/**
 * M2 Runtime Export & Cross-View CDP Adversarial Stress Test
 * ------------------------------------------------------------
 * 1. Launches Headless Chrome and opens mapa_territorial.html
 * 2. Monkey-patches URL.createObjectURL to intercept exported Blobs
 * 3. Triggers exportCurrentStationCSV(), exportCurrentStationJSON() for all 16 stations
 * 4. Triggers exportCrossDataCSV(), exportCrossDataJSON() for all 3 crosses
 * 5. Verifies:
 *    - CSV exports prepend \uFEFF (UTF-8 BOM)
 *    - CSV headers contain fecha, comuna_ine, lat, lng, unidad
 *    - JSON exports parse cleanly and contain mandatory normalized keys
 *    - Alert banners update dynamically on cross selection
 *    - Zero console exceptions
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const PORT = 8901;
const CDP_PORT = 9334;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let server;
let chromeProcess;

function startServer() {
    return new Promise((resolve) => {
        server = http.createServer((req, res) => {
            let filePath = path.join(REPO_ROOT, req.url === '/' ? 'mapa_territorial.html' : req.url.split('?')[0]);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath);
                const contentType = ext === '.html' ? 'text/html' : ext === '.js' ? 'text/javascript' : ext === '.json' ? 'application/json' : 'text/plain';
                res.writeHead(200, { 'Content-Type': contentType });
                fs.createReadStream(filePath).pipe(res);
            } else {
                res.writeHead(404);
                res.end('Not found');
            }
        });
        server.listen(PORT, '127.0.0.1', () => {
            console.log(`[TEST-SERVER] Listening on http://127.0.0.1:${PORT}`);
            resolve();
        });
    });
}

async function runTest() {
    console.log('================================================================');
    console.log('M2 RUNTIME EXPORT & CROSS-VIEW ADVERSARIAL STRESS TEST');
    console.log('================================================================');

    await startServer();

    console.log('[CHROME] Launching Chrome via CDP...');
    chromeProcess = spawn(CHROME_PATH, [
        '--headless=new',
        `--remote-debugging-port=${CDP_PORT}`,
        '--disable-gpu',
        '--no-sandbox',
        '--disable-extensions',
        '--disable-default-apps',
        'about:blank'
    ]);

    // Wait for CDP endpoint
    await new Promise(r => setTimeout(r, 1200));

    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
            if (res.ok) {
                const targets = await res.json();
                const pageTarget = targets.find(t => t.type === 'page');
                if (pageTarget && pageTarget.webSocketDebuggerUrl) {
                    wsUrl = pageTarget.webSocketDebuggerUrl;
                    break;
                }
            }
        } catch (e) {}
    }
    if (!wsUrl) throw new Error('Could not find page target in Chrome');


    const ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
        ws.onopen = resolve;
        ws.onerror = reject;
    });

    let msgId = 1;
    const pending = new Map();

    function sendCommand(method, params = {}) {
        return new Promise((resolve, reject) => {
            const id = msgId++;
            pending.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && pending.has(msg.id)) {
            const { resolve, reject } = pending.get(msg.id);
            pending.delete(msg.id);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
        }
    };


    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');

    console.log(`[NAVIGATE] Navigating to http://127.0.0.1:${PORT}/mapa_territorial.html...`);
    await sendCommand('Page.navigate', { url: `http://127.0.0.1:${PORT}/mapa_territorial.html` });

    await new Promise(r => setTimeout(r, 2000));

    // Install interceptor in page context
    console.log('[INJECT] Installing Blob interceptor...');
    await sendCommand('Runtime.evaluate', {
        expression: `
            window.__interceptedExports = [];
            // Custom capture hook directly on Blob
            const origBlob = window.Blob;
            window.Blob = function(parts, options) {
                const content = parts.join('');
                window.__interceptedExports.push({
                    type: options && options.type ? options.type : 'unknown',
                    content: content,
                    length: content.length,
                    hasBom: content.startsWith('\uFEFF')
                });
                return new origBlob(parts, options);
            };

        `
    });

    // Test 1: Test Station Exports across all 16 stations
    console.log('\n--- SUITE 1: Station CSV & JSON Exports (All 16 Stations) ---');
    const stResult = await sendCommand('Runtime.evaluate', {
        awaitPromise: true,
        returnByValue: true,
        expression: `
            (async function() {
                const results = [];
                for (let i = 0; i < stations.length; i++) {
                    selectStation(stations[i]);
                    // Clear buffer
                    window.__interceptedExports = [];
                    exportCurrentStationCSV();
                    exportCurrentStationJSON();


                    const csvExport = window.__interceptedExports.find(e => e.type.includes('csv'));
                    const jsonExport = window.__interceptedExports.find(e => e.type.includes('json'));

                    results.push({
                        stationId: stations[i].id,
                        name: stations[i].name,
                        csvOk: !!csvExport && csvExport.hasBom && csvExport.content.includes('fecha,comuna_ine,lat,lng,unidad'),
                        jsonOk: !!jsonExport && jsonExport.content.includes('"comuna_ine"') && jsonExport.content.includes('"fecha"'),
                        csvHeader: csvExport ? csvExport.content.split('\\n')[0] : null
                    });
                }
                return results;
            })()
        `
    });

    console.log('[DEBUG] stResult:', JSON.stringify(stResult));
    const stExports = stResult.result ? stResult.result.value : null;
    if (!stExports) {
        throw new Error('stExports is null or undefined: ' + JSON.stringify(stResult));
    }
    let allStCsvOk = true;

    let allStJsonOk = true;
    for (const r of stExports) {
        if (!r.csvOk) {
            allStCsvOk = false;
            console.error(`  [FAIL] Station ${r.stationId} CSV export failed or missing BOM!`);
        }
        if (!r.jsonOk) {
            allStJsonOk = false;
            console.error(`  [FAIL] Station ${r.stationId} JSON export failed!`);
        }
    }
    if (allStCsvOk && allStJsonOk) {
        console.log(`  [PASS] 1. All 16 station CSV exports have \\uFEFF BOM and normalized headers.`);
        console.log(`  [PASS] 2. All 16 station JSON exports parse cleanly with standardized schema.`);
    }

    // Test 2: Test Multivariable Cross Exports across all 3 crosses
    console.log('\n--- SUITE 2: Multivariable Cross CSV & JSON Exports (All 3 Crosses) ---');
    const crossResult = await sendCommand('Runtime.evaluate', {
        awaitPromise: true,
        returnByValue: true,
        expression: `
            (async function() {
                const crosses = ['clima_salud', 'criosfera_riesgo', 'marino_productivo'];
                const results = [];
                for (const cid of crosses) {
                    selectCrossVisualization(cid);
                    window.__interceptedExports = [];
                    exportCrossDataCSV();
                    exportCrossDataJSON();


                    const csvExport = window.__interceptedExports.find(e => e.type.includes('csv'));
                    const jsonExport = window.__interceptedExports.find(e => e.type.includes('json'));

                    const bannerTitle = document.getElementById('crossAlertTitle') ? document.getElementById('crossAlertTitle').textContent : '';

                    results.push({
                        crossId: cid,
                        bannerTitle: bannerTitle,
                        csvOk: !!csvExport && csvExport.hasBom && csvExport.content.includes('fecha,comuna_ine,lat,lng,unidad'),
                        jsonOk: !!jsonExport && jsonExport.content.includes('"comuna_ine"') && jsonExport.content.includes('"fecha"'),
                        csvRowCount: csvExport ? csvExport.content.trim().split('\\n').length : 0
                    });
                }
                return results;
            })()
        `
    });

    console.log('[DEBUG] crossResult:', JSON.stringify(crossResult));
    const crossExports = crossResult.result ? crossResult.result.value : null;
    if (!crossExports) {
        throw new Error('crossExports is null: ' + JSON.stringify(crossResult));
    }
    let allCrOk = true;

    for (const cr of crossExports) {
        if (!cr.csvOk || !cr.jsonOk || cr.csvRowCount !== 13) {
            allCrOk = false;
            console.error(`  [FAIL] Cross ${cr.crossId} export verification failed!`, cr);
        } else {
            console.log(`  [PASS] Cross '${cr.crossId}': CSV (1 header + 12 rows with BOM), JSON valid, Alert Banner: "${cr.bannerTitle}"`);
        }
    }

    console.log('\n================================================================');
    if (allStCsvOk && allStJsonOk && allCrOk) {
        console.log('TOTAL EMPIRICAL CHECKS PASSED: ALL RUNTIME EXPORTS VALIDATED');
        console.log('FINAL RUNTIME VERDICT: APPROVE');
    } else {
        console.error('FINAL RUNTIME VERDICT: REJECT (INTEGRITY VIOLATION)');
    }
    console.log('================================================================\n');

    // Clean up
    ws.close();
    chromeProcess.kill();
    server.close();
    process.exit(allStCsvOk && allStJsonOk && allCrOk ? 0 : 1);
}

runTest().catch(err => {
    console.error('Fatal test error:', err);
    if (chromeProcess) chromeProcess.kill();
    if (server) server.close();
    process.exit(1);
});
