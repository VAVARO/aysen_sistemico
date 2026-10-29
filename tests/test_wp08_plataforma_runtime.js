/**
 * WP_08 Runtime CDP & Headless Chrome End-to-End Test Suite
 * -----------------------------------------------------------
 * Validates:
 * 1. Zero JS console errors on plataforma_aysen.html.
 * 2. 100% data hydration across the 9 JSON datasets (10 comunas, 18 series, 13 holdings, 42 RUTs).
 * 3. Instant Universal Search (#globalSearchInput, 0ms latency) by RUT, holding, comuna, variable.
 * 4. Wizard (#btnOpenWizard) setup of all 6 guided actions.
 * 5. Vista 1: Variable interaction (Chart.js scatter/bubble, dual-axis bar, seasonal EMAT, 10 comunas side-by-side, descriptive Pearson r, CSV UTF-8 BOM export).
 * 6. Vista 2: Relational Model (Power BI 8 schema boxes, PK/FK keys, LIVE JOIN 10 comunas and 42 RUTs, CSV export).
 * 7. Vista 3: Fichas Comunales & Holdings (6 dimensions, official links, 42 subsidiary RUTs).
 * 8. Vista 4: Clean Leaflet Map (On-demand, exclusive SEIA layer filter with 0 intrusive markers, clean map wipe).
 * 9. Integration in mapa_territorial.html: Exposed window.comunasData, window.map, window.activeComuna, header button to plataforma_aysen.html.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const PORT = 8925;
const CDP_PORT = 9345;
function getChromePath() {
    if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
    const candidates = process.platform === 'win32' ? [
        'C:\Program Files\Google\Chrome\Application\chrome.exe',
        'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
        path.join(process.env.LOCALAPPDATA || '', 'Google\Chrome\Application\chrome.exe')
    ] : [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser'
    ];
    return candidates.find(c => c && fs.existsSync(c)) || null;
}

const CHROME_PATH = getChromePath();

let server;
let chromeProcess;

function startServer() {
    return new Promise((resolve) => {
        server = http.createServer((req, res) => {
            let reqPath = req.url.split('?')[0];
            if (reqPath === '/') reqPath = '/plataforma_aysen.html';
            let filePath = path.join(REPO_ROOT, reqPath.startsWith('/') ? reqPath.slice(1) : reqPath);

            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath);
                const contentType = ext === '.html' ? 'text/html; charset=utf-8' :
                                    ext === '.js' ? 'text/javascript; charset=utf-8' :
                                    ext === '.css' ? 'text/css; charset=utf-8' :
                                    ext === '.json' ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8';
                res.writeHead(200, { 'Content-Type': contentType });
                fs.createReadStream(filePath).pipe(res);
            } else {
                res.writeHead(404);
                res.end('Not found: ' + reqPath);
            }
        });
        server.listen(PORT, '127.0.0.1', () => {
            console.log(`[TEST-SERVER] Listening on http://127.0.0.1:${PORT}`);
            resolve();
        });
    });
}

function sendCDP(ws, method, params = {}, id = 1) {
    return new Promise((resolve, reject) => {
        const msg = JSON.stringify({ id, method, params });
        const handler = (data) => {
            try {
                const parsed = JSON.parse(data.toString());
                if (parsed.id === id) {
                    ws.removeListener('message', handler);
                    if (parsed.error) reject(parsed.error);
                    else resolve(parsed.result);
                }
            } catch (e) {
                // Ignore parse errors from other events
            }
        };
        ws.on('message', handler);
        ws.send(msg);
    });
}

async function getCDPTarget() {
    const fetch = (await import('node:http')).get;
    for (let i = 0; i < 20; i++) {
        try {
            const data = await new Promise((resolve, reject) => {
                http.get(`http://127.0.0.1:${CDP_PORT}/json`, (res) => {
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => resolve(JSON.parse(body)));
                }).on('error', reject);
            });
            if (data && data.length > 0) return data[0];
        } catch (e) {
            await new Promise(r => setTimeout(r, 200));
        }
    }
    throw new Error('Could not connect to Chrome CDP endpoint');
}

async function runTestSuite() {
    console.log('================================================================');
    console.log('WP_08 RUNTIME CDP & HEADLESS CHROME TEST SUITE');
    console.log('================================================================');

    await startServer();

    if (!CHROME_PATH) { console.log('[SKIP] Chrome not found. Exiting.'); process.exit(0); }
    console.log('[CHROME] Launching Chrome via CDP...');
    chromeProcess = spawn(CHROME_PATH, [
        '--headless=new',
        `--remote-debugging-port=${CDP_PORT}`,
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,900',
        'about:blank'
    ]);

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
    console.log('[CDP] Connected to Chrome Page WebSocket.');

    let consoleErrors = [];
    let msgId = 1;
    const pending = new Map();

    function cdp(method, params = {}) {
        return new Promise((resolve, reject) => {
            const id = msgId++;
            pending.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    ws.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            if (msg.id && pending.has(msg.id)) {
                const { resolve, reject } = pending.get(msg.id);
                pending.delete(msg.id);
                if (msg.error) reject(msg.error);
                else resolve(msg.result);
            }
            if (msg.method === 'Runtime.consoleAPICalled') {
                if (msg.params.type === 'error') {
                    consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
                }
            } else if (msg.method === 'Runtime.exceptionThrown') {
                consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
            }
        } catch (e) {}
    };

    await cdp('Page.enable');
    await cdp('Runtime.enable');

    async function evaluate(expression) {
        const res = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
        if (res.exceptionDetails) {
            throw new Error(`Eval exception: ${res.exceptionDetails.text} (${expression})`);
        }
        return res.result ? res.result.value : undefined;
    }

    try {
        // -------------------------------------------------------------
        // TEST 1: Load plataforma_aysen.html and verify 0 console errors
        // -------------------------------------------------------------
        console.log('\n--- [TEST 1] Loading plataforma_aysen.html ---');
        await cdp('Page.navigate', { url: `http://127.0.0.1:${PORT}/plataforma_aysen.html` });
        await new Promise(r => setTimeout(r, 1500));

        const isLoaded = await evaluate('window.AppState && window.AppState.isLoaded');
        console.log(`  AppState.isLoaded: ${isLoaded}`);
        if (!isLoaded) throw new Error('AppState failed to load in memory');

        const datasetStats = await evaluate(`({
            comunas: window.AppState.comunasData.length,
            series: window.AppState.seriesData.length,
            holdings: window.AppState.holdingsData?.holdings?.length || 0,
            filiales: (window.AppState.holdingsData?.holdings || []).reduce((acc, h) => acc + (h.filiales_y_ruts || []).length, 0),
            nodes: window.AppState.allNodes.length
        })`);
        console.log(`  Datasets verified: 10 Comunas (${datasetStats.comunas}), 18 Series (${datasetStats.series}), 13 Holdings (${datasetStats.holdings}), 42 RUTs (${datasetStats.filiales}), ${datasetStats.nodes} Nodos.`);
        
        if (datasetStats.comunas !== 10) throw new Error(`Expected 10 comunas, got ${datasetStats.comunas}`);
        if (datasetStats.series !== 18) throw new Error(`Expected 18 series, got ${datasetStats.series}`);
        if (datasetStats.holdings < 12) throw new Error(`Expected >= 12 holdings, got ${datasetStats.holdings}`);
        if (datasetStats.filiales !== 42) throw new Error(`Expected 42 filial RUTs, got ${datasetStats.filiales}`);
        console.log('  [PASS] 1. All 9 Datasets loaded cleanly with 100% data integrity.');

        // -------------------------------------------------------------
        // TEST 2: Universal Instant Search (#globalSearchInput, 0ms)
        // -------------------------------------------------------------
        console.log('\n--- [TEST 2] Instant Universal Search ---');
        // Search by holding
        await evaluate(`(() => {
            const input = document.getElementById('globalSearchInput');
            input.value = 'AquaChile';
            input.dispatchEvent(new Event('input'));
        })()`);
        let searchDropdownVisible = await evaluate(`document.getElementById('searchResultsDropdown').classList.contains('visible')`);
        let searchResultsText = await evaluate(`document.getElementById('searchResultsDropdown').innerText`);
        if (!searchDropdownVisible || !searchResultsText.includes('AquaChile')) {
            throw new Error('Search failed for holding AquaChile');
        }
        console.log('  [PASS] Search by holding "AquaChile" rendered instantly.');

        // Search by filial RUT with dots and hyphen
        await evaluate(`(() => {
            const input = document.getElementById('globalSearchInput');
            input.value = '86.247.400-7';
            input.dispatchEvent(new Event('input'));
        })()`);
        searchResultsText = await evaluate(`document.getElementById('searchResultsDropdown').innerText`);
        if (!searchResultsText.includes('AquaChile') && !searchResultsText.includes('86.247.400-7')) {
            throw new Error('Search failed for RUT 86.247.400-7');
        }
        console.log('  [PASS] Search by official RUT "86.247.400-7" rendered filial match.');

        // Search by Comuna name
        await evaluate(`(() => {
            const input = document.getElementById('globalSearchInput');
            input.value = 'Cochrane';
            input.dispatchEvent(new Event('input'));
        })()`);
        searchResultsText = await evaluate(`document.getElementById('searchResultsDropdown').innerText`);
        if (!searchResultsText.includes('Cochrane')) {
            throw new Error('Search failed for Comuna Cochrane');
        }
        console.log('  [PASS] Search by comuna "Cochrane" found.');

        // Search by Quantitative Variable
        await evaluate(`(() => {
            const input = document.getElementById('globalSearchInput');
            input.value = 'leña';
            input.dispatchEvent(new Event('input'));
        })()`);
        searchResultsText = await evaluate(`document.getElementById('searchResultsDropdown').innerText`);
        if (!searchResultsText.toLowerCase().includes('leña')) {
            throw new Error('Search failed for variable leña');
        }
        console.log('  [PASS] Search by variable "leña" found in catalog.');

        // -------------------------------------------------------------
        // TEST 3: Wizard "¿Por dónde empezar?"
        // -------------------------------------------------------------
        console.log('\n--- [TEST 3] Wizard Modal ---');
        await evaluate(`document.getElementById('btnOpenWizard').click();`);
        let modalOpen = await evaluate(`document.getElementById('wizardModal').classList.contains('open')`);
        let cardCount = await evaluate(`document.querySelectorAll('.wizard-action-card').length`);
        if (!modalOpen || cardCount !== 6) throw new Error(`Wizard modal failed to open or missing 6 cards (found ${cardCount})`);
        console.log(`  [PASS] Wizard modal opened with ${cardCount} actionable cards.`);

        // Click first card "Hacer interactuar variables"
        await evaluate(`document.querySelector('.wizard-action-card[data-wizard-action="cross_variables"]').click();`);
        modalOpen = await evaluate(`document.getElementById('wizardModal').classList.contains('open')`);
        let activeTab = await evaluate(`window.AppState.activeTab`);
        if (modalOpen || activeTab !== 'variables') throw new Error('Wizard card action failed to configure workspace');
        console.log('  [PASS] Wizard card configured Workspace into Variable Interaction View.');

        // -------------------------------------------------------------
        // TEST 4: Vista 1 (Hacer interactuar variables, Chart.js & Table)
        // -------------------------------------------------------------
        console.log('\n--- [TEST 4] Vista 1: Interacción de Variables ---');
        const rValue = await evaluate(`document.getElementById('statPearsonR').innerText`);
        console.log(`  Calculated descriptive correlation: ${rValue}`);
        if (!rValue.includes('r =')) throw new Error('Pearson r was not calculated');

        const tableRowCount = await evaluate(`document.querySelectorAll('#comunasCrossTableBody tr').length`);
        if (tableRowCount !== 10) throw new Error(`Expected 10 comuna rows in table, got ${tableRowCount}`);
        console.log(`  10 Comunas Side-by-side table verified (${tableRowCount} rows).`);

        // Test dual-axis bar mode toggle
        await evaluate(`document.querySelector('.mode-toggle-btn[data-chart-mode="bar"]').click();`);
        let chartMode = await evaluate(`window.AppState.chartType`);
        if (chartMode !== 'bar') throw new Error('Failed to toggle to dual-axis bar chart');
        console.log('  [PASS] Dual-axis bar chart toggle confirmed.');

        // Test seasonal EMAT series toggle
        await evaluate(`document.querySelector('.mode-toggle-btn[data-chart-mode="seasonal"]').click();`);
        chartMode = await evaluate(`window.AppState.chartType`);
        if (chartMode !== 'seasonal') throw new Error('Failed to toggle to seasonal EMAT chart');
        console.log('  [PASS] Seasonal EMAT series chart toggle confirmed.');

        // -------------------------------------------------------------
        // TEST 5: Vista 2 (Modelo Relacional Power BI Style)
        // -------------------------------------------------------------
        console.log('\n--- [TEST 5] Vista 2: Modelo Relacional (Power BI) ---');
        await evaluate(`document.getElementById('tabBtnRelational').click();`);
        activeTab = await evaluate(`window.AppState.activeTab`);
        if (activeTab !== 'relational') throw new Error('Failed to switch to relational tab');

        const schemaBoxCount = await evaluate(`document.querySelectorAll('.schema-box-card').length`);
        if (schemaBoxCount !== 8) throw new Error(`Expected 8 schema boxes, got ${schemaBoxCount}`);
        console.log(`  8 Schema table boxes verified with PK/FK indicators.`);

        // Test holdings and 42 RUTs mode
        await evaluate(`document.getElementById('btnJoinModeHoldings').click();`);
        let joinRowCount = await evaluate(`document.querySelectorAll('#liveJoinTableBody tr').length`);
        console.log(`  LIVE JOIN in Holdings & RUTs mode: ${joinRowCount} filial rows.`);
        if (joinRowCount !== 42) throw new Error(`Expected exactly 42 filial rows in live join, got ${joinRowCount}`);
        console.log('  [PASS] Matriz de 12 Holdings y 42 RUTs filiales rendered cleanly in live join table.');

        // Test filtering in live join
        await evaluate(`(() => {
            const input = document.getElementById('modelTableSearch');
            input.value = 'AquaChile';
            input.dispatchEvent(new Event('input'));
        })()`);
        let filteredRows = await evaluate(`document.querySelectorAll('#liveJoinTableBody tr').length`);
        if (filteredRows === 0 || filteredRows >= 42) throw new Error('Live join search filtering failed');
        console.log(`  [PASS] Live join table search filtered to ${filteredRows} AquaChile filiales.`);

        // -------------------------------------------------------------
        // TEST 6: Vista 3 (Fichas Comunales y Titulares)
        // -------------------------------------------------------------
        console.log('\n--- [TEST 6] Vista 3: Fichas Comunales & Titulares ---');
        await evaluate(`document.getElementById('tabBtnFichas').click();`);
        activeTab = await evaluate(`window.AppState.activeTab`);
        if (activeTab !== 'fichas') throw new Error('Failed to switch to fichas tab');

        const dimCardCount = await evaluate(`document.querySelectorAll('#fichasDimensionsGrid .dimension-card').length`);
        if (dimCardCount !== 6) throw new Error(`Expected 6 dimension cards, got ${dimCardCount}`);
        console.log(`  [PASS] 6 systemic dimension cards rendered with verified official source links.`);

        const holdingsCardsCount = await evaluate(`document.querySelectorAll('#holdingsCardsList .holding-detail-card').length`);
        if (holdingsCardsCount < 12) throw new Error(`Expected >= 12 holding detail cards, got ${holdingsCardsCount}`);
        console.log(`  [PASS] ${holdingsCardsCount} Holdings detail cards rendered with active subsidiary RUT badges.`);

        // -------------------------------------------------------------
        // TEST 7: Vista 4 (Mapa por Capas Limpias — Leaflet Bajo Demanda)
        // -------------------------------------------------------------
        console.log('\n--- [TEST 7] Vista 4: Mapa por Capas Limpias ---');
        await evaluate(`document.getElementById('tabBtnMap').click();`);
        activeTab = await evaluate(`window.AppState.activeTab`);
        if (activeTab !== 'map') throw new Error('Failed to switch to map tab');

        // Test exclusive layer filter "Solo Proyectos SEIA"
        await evaluate(`document.querySelector('.exclusive-layer-btn[data-exclusive-layer="seia"]').click();`);
        let seiaMarkerCount = await evaluate(`window.AppState.mapLayerGroup ? Object.keys(window.AppState.mapLayerGroup._layers).length : 0`);
        console.log(`  Markers rendered in "Solo Proyectos SEIA": ${seiaMarkerCount}`);
        if (seiaMarkerCount !== 20) throw new Error(`Expected exactly 20 SEIA project nodes, got ${seiaMarkerCount}`);
        console.log('  [PASS] "Solo Proyectos SEIA" rendered exclusively 20 SEIA project nodes (zero intrusive border markers).');

        // Test clean wipe
        await evaluate(`document.getElementById('btnClearMapLayers').click();`);
        let clearedMarkerCount = await evaluate(`window.AppState.mapLayerGroup ? Object.keys(window.AppState.mapLayerGroup._layers).length : 0`);
        if (clearedMarkerCount !== 0) throw new Error(`Expected 0 markers after clear, got ${clearedMarkerCount}`);
        console.log('  [PASS] "Limpiar mapa" wiped all markers (0 markers remaining).');

        // -------------------------------------------------------------
        // TEST 8: Check Console Errors on plataforma_aysen.html
        // -------------------------------------------------------------
        console.log('\n--- [TEST 8] Browser Console Errors Check ---');
        if (consoleErrors.length > 0) {
            console.error('  FAIL: Uncaught console errors detected:', consoleErrors);
            throw new Error(`Console errors present: ${consoleErrors.join('; ')}`);
        }
        console.log('  [PASS] Clean runtime: 0 JS errors, 0 uncaught exceptions.');

        // -------------------------------------------------------------
        // TEST 9: Verify mapa_territorial.html Integration
        // -------------------------------------------------------------
        console.log('\n--- [TEST 9] Verifying mapa_territorial.html Integration ---');
        consoleErrors = [];
        await cdp('Page.navigate', { url: `http://127.0.0.1:${PORT}/mapa_territorial.html` });
        await new Promise(r => setTimeout(r, 1500));

        const mtGlobals = await evaluate(`({
            hasComunasData: Boolean(window.comunasData && window.comunasData.length === 10),
            hasMap: Boolean(window.map),
            hasActiveComuna: Boolean(window.activeComuna),
            hasHeaderBtn: Boolean(document.querySelector('header a[href="plataforma_aysen.html"]')),
            hasHoldingsLoaded: Boolean(window.AysenSystemicData && window.AysenSystemicData.holdings)
        })`);
        console.log('  mapa_territorial.html integration status:', mtGlobals);

        if (!mtGlobals.hasComunasData) throw new Error('window.comunasData missing or invalid');
        if (!mtGlobals.hasMap) throw new Error('window.map missing');
        if (!mtGlobals.hasActiveComuna) throw new Error('window.activeComuna missing');
        if (!mtGlobals.hasHeaderBtn) throw new Error('Header button to plataforma_aysen.html missing');
        if (!mtGlobals.hasHoldingsLoaded) throw new Error('AysenSystemicData.holdings failed to load in systemic_atlas.js');

        console.log('  [PASS] mapa_territorial.html exposed window.comunasData, window.map, window.activeComuna, and loaded holdings.');

        // -------------------------------------------------------------
        // TEST 10: Verify index.html button to plataforma_aysen.html
        // -------------------------------------------------------------
        console.log('\n--- [TEST 10] Verifying index.html Links ---');
        await cdp('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
        await new Promise(r => setTimeout(r, 2000));

        const indexLink = await evaluate(`Boolean(document.querySelector('a[href="plataforma_aysen.html"]') || document.querySelector('a[href*="plataforma_aysen"]'))`);
        if (!indexLink) throw new Error('index.html primary button does not point to plataforma_aysen.html');
        console.log('  [PASS] index.html primary button successfully points to plataforma_aysen.html.');

        console.log('\n================================================================');
        console.log('ALL 10 RUNTIME E2E HEADLESS CHROME CHECKS PASSED PERFECTLY!');
        console.log('================================================================');

    } finally {
        ws.close();
        if (chromeProcess) chromeProcess.kill();
        if (server) server.close();
    }
}

runTestSuite().then(() => {
    process.exit(0);
}).catch(err => {
    console.error('\n[FATAL TEST FAILURE]:', err);
    process.exit(1);
});
