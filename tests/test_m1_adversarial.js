/**
 * Empirical Adversarial Test Harness for M1:
 * - Chart.js Lifecycle Under Rapid Toggling
 * - Canvas Reuse & Collision Errors ("Canvas is already in use")
 * - Chart Destruction & Instance Cleanup
 * - DOM Visibility Invariants (Station vs Cross View)
 * - Responsive Breakpoints (1280px Desktop, 900px Tablet, 600px Mobile, 375px Ultra-mobile)
 * - Mobile Drawer Behavior & Interactivity
 *
 * Uses Headless Chrome via native Chrome DevTools Protocol (CDP) WebSocket.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const PORT = 8899;
const CDP_PORT = 9333;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let cachedChartJs = null;
let cachedLeafletJs = null;
let cachedLeafletCss = null;

async function prefetchCdnAssets() {
    console.log('[SETUP] Prefetching CDN assets for deterministic offline-safe browser execution...');
    try {
        const [rChart, rLeaflet, rCss] = await Promise.all([
            fetch('https://cdn.jsdelivr.net/npm/chart.js').then(r => r.text()),
            fetch('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js').then(r => r.text()),
            fetch('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css').then(r => r.text())
        ]);
        cachedChartJs = rChart;
        cachedLeafletJs = rLeaflet;
        cachedLeafletCss = rCss;
        console.log(`[SETUP] Assets cached: Chart.js (${cachedChartJs.length}b), Leaflet JS (${cachedLeafletJs.length}b)`);
    } catch (err) {
        console.warn('[SETUP] Warning: Failed to prefetch online CDN, using mock stubs if necessary:', err.message);
    }
}

// Simple HTTP server serving the repo root with localized CDN routing
function startServer() {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            let reqPath = decodeURI(req.url.split('?')[0]);

            if (reqPath === '/_local_chart.js' && cachedChartJs) {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(cachedChartJs);
                return;
            }
            if (reqPath === '/_local_leaflet.js' && cachedLeafletJs) {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(cachedLeafletJs);
                return;
            }
            if (reqPath === '/_local_leaflet.css' && cachedLeafletCss) {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(cachedLeafletCss);
                return;
            }

            if (reqPath === '/' || reqPath === '/mapa_territorial.html') {
                const htmlPath = path.join(REPO_ROOT, 'mapa_territorial.html');
                let html = fs.readFileSync(htmlPath, 'utf8');
                if (cachedChartJs) {
                    html = html.replace('https://cdn.jsdelivr.net/npm/chart.js', '/_local_chart.js');
                }
                if (cachedLeafletJs) {
                    html = html.replace('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', '/_local_leaflet.js');
                }
                if (cachedLeafletCss) {
                    html = html.replace('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', '/_local_leaflet.css');
                }
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(html);
                return;
            }

            const filePath = path.join(REPO_ROOT, reqPath);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end('Not Found');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
        });

        server.listen(PORT, '127.0.0.1', () => {
            resolve(server);
        });
        server.on('error', reject);
    });
}

// Simple CDP Client over WebSocket
class CDPClient {
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
        this.ws = null;
        this.id = 0;
        this.callbacks = new Map();
        this.events = [];
        this.consoleLogs = [];
        this.exceptions = [];
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.wsUrl);
            this.ws.onopen = () => resolve();
            this.ws.onerror = (err) => reject(err);
            this.ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.id && this.callbacks.has(msg.id)) {
                    const { resolve, reject } = this.callbacks.get(msg.id);
                    this.callbacks.delete(msg.id);
                    if (msg.error) {
                        reject(new Error(msg.error.message));
                    } else {
                        resolve(msg.result);
                    }
                } else if (msg.method) {
                    this.events.push(msg);
                    if (msg.method === 'Console.messageAdded') {
                        this.consoleLogs.push(msg.params.message);
                    } else if (msg.method === 'Runtime.consoleAPICalled') {
                        const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
                        this.consoleLogs.push({ type: msg.params.type, text });
                    } else if (msg.method === 'Runtime.exceptionThrown') {
                        this.exceptions.push(msg.params.exceptionDetails);
                    }
                }
            };
        });
    }

    send(method, params = {}) {
        return new Promise((resolve, reject) => {
            const msgId = ++this.id;
            this.callbacks.set(msgId, { resolve, reject });
            this.ws.send(JSON.stringify({ id: msgId, method, params }));
        });
    }

    async eval(expr) {
        const res = await this.send('Runtime.evaluate', {
            expression: expr,
            returnByValue: true,
            awaitPromise: true
        });
        if (res.exceptionDetails) {
            throw new Error(`Eval error in [${expr}]: ` + JSON.stringify(res.exceptionDetails));
        }
        return res.result ? res.result.value : undefined;
    }

    async setViewport(width, height, isMobile = false) {
        await this.send('Emulation.setDeviceMetricsOverride', {
            width,
            height,
            deviceScaleFactor: 1,
            mobile: isMobile
        });
        await this.send('Emulation.setVisibleSize', { width, height });
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

async function runAdversarialSuite() {
    console.log('================================================================');
    console.log('M1 EMPIRICAL ADVERSARIAL STRESS TEST HARNESS');
    console.log('Target: mapa_territorial.html (View Toggle, Lifecycles, Breakpoints)');
    console.log('================================================================\n');

    await prefetchCdnAssets();
    const server = await startServer();
    console.log(`[SETUP] Static HTTP server running at http://127.0.0.1:${PORT}`);

    // Launch Chrome Headless
    const chrome = spawn(CHROME_PATH, [
        '--headless=new',
        `--remote-debugging-port=${CDP_PORT}`,
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-gpu',
        '--no-sandbox',
        'about:blank'
    ]);

    let cdp = null;

    try {
        let targetWsUrl = null;
        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 200));
            try {
                const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
                if (res.ok) {
                    const targets = await res.json();
                    const pageTarget = targets.find(t => t.type === 'page');
                    if (pageTarget && pageTarget.webSocketDebuggerUrl) {
                        targetWsUrl = pageTarget.webSocketDebuggerUrl;
                        break;
                    }
                }
            } catch (e) {}
        }

        if (!targetWsUrl) {
            throw new Error('Could not obtain Chrome CDP WebSocket URL');
        }

        cdp = new CDPClient(targetWsUrl);
        await cdp.connect();
        await cdp.send('Runtime.enable');
        await cdp.send('Page.enable');
        await cdp.send('Console.enable');

        console.log(`[SETUP] Navigating to http://127.0.0.1:${PORT}/mapa_territorial.html...`);
        await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/mapa_territorial.html` });

        // Wait for page load and Leaflet / Chart.js initialization
        await new Promise(r => setTimeout(r, 1500));

        let results = [];

        function report(title, passed, detail = '') {
            results.push({ title, passed, detail });
            console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${title} ${detail ? '(' + detail + ')' : ''}`);
            if (!passed) {
                console.error(`     >>> FAILURE REASON: ${detail}`);
            }
        }

        // ======================================================================
        // SUITE 1: CHART LIFECYCLE ADVERSARIAL TESTING
        // ======================================================================
        console.log('\n--- SUITE 1: Chart Lifecycle & View Toggling Adversarial Stress ---');

        // 1. Initial baseline verification
        const baseline = await cdp.eval(`({
            currentView: typeof currentView !== 'undefined' ? currentView : null,
            hasChartInstance: typeof chartInstance !== 'undefined' && !!chartInstance,
            hasCrossInstance: typeof crossChartInstance !== 'undefined' && !!crossChartInstance,
            miniChartActive: typeof Chart !== 'undefined' && !!Chart.getChart('miniChart'),
            crossChartActive: typeof Chart !== 'undefined' && !!Chart.getChart('crossChart'),
            stationContainerDisplay: getComputedStyle(document.getElementById('viewStationContainer')).display,
            crossContainerDisplay: getComputedStyle(document.getElementById('viewCrossContainer')).display,
            miniChartWidth: document.getElementById('miniChart').clientWidth,
            miniChartHeight: document.getElementById('miniChart').clientHeight
        })`);

        report('1. Baseline Chart Initialization',
            baseline.currentView === 'station' &&
            baseline.hasChartInstance &&
            !baseline.hasCrossInstance &&
            baseline.miniChartActive &&
            !baseline.crossChartActive &&
            baseline.stationContainerDisplay === 'flex' &&
            baseline.crossContainerDisplay === 'none' &&
            baseline.miniChartWidth > 0 &&
            baseline.miniChartHeight > 0,
            `View: ${baseline.currentView}, miniChart active: ${baseline.miniChartActive}, Canvas: ${baseline.miniChartWidth}x${baseline.miniChartHeight}`
        );

        // 2. High-frequency synchronous view toggling (0ms delay, 100 alternating switches)
        console.log('  [RUN] Executing 100 rapid alternating switches (0ms synchronous microtask burst)...');
        const rapidResult0ms = await cdp.eval(`(() => {
            const errors = [];
            for (let i = 0; i < 100; i++) {
                try {
                    switchSidebarView(i % 2 === 0 ? 'cross' : 'station');
                } catch (e) {
                    errors.push({ iter: i, err: e.message });
                }
            }
            return {
                errors,
                currentView: typeof currentView !== 'undefined' ? currentView : null,
                hasChartInstance: typeof chartInstance !== 'undefined' && !!chartInstance,
                hasCrossInstance: typeof crossChartInstance !== 'undefined' && !!crossChartInstance,
                miniChartActive: typeof Chart !== 'undefined' && !!Chart.getChart('miniChart'),
                crossChartActive: typeof Chart !== 'undefined' && !!Chart.getChart('crossChart')
            };
        })()`);

        report('2. 100 Rapid Switches (0ms Microtask Burst)',
            rapidResult0ms.errors.length === 0 &&
            rapidResult0ms.currentView === 'station' &&
            rapidResult0ms.miniChartActive &&
            !rapidResult0ms.crossChartActive,
            `Errors: ${rapidResult0ms.errors.length}, Final View: ${rapidResult0ms.currentView}, MiniActive: ${rapidResult0ms.miniChartActive}, CrossActive: ${rapidResult0ms.crossChartActive}`
        );

        // 3. Timed alternating switches (15ms delay, 40 iterations) to stress RAF & resize observers
        console.log('  [RUN] Executing 40 timed alternating switches (15ms delay to stress RAF/settlement)...');
        const timedSwitchResult = await cdp.eval(`(async () => {
            const errors = [];
            for (let i = 0; i < 40; i++) {
                try {
                    switchSidebarView(i % 2 === 0 ? 'cross' : 'station');
                    await new Promise(r => setTimeout(r, 15));
                } catch (e) {
                    errors.push({ iter: i, err: e.message });
                }
            }
            return {
                errors,
                currentView: typeof currentView !== 'undefined' ? currentView : null,
                hasChartInstance: typeof chartInstance !== 'undefined' && !!chartInstance,
                hasCrossInstance: typeof crossChartInstance !== 'undefined' && !!crossChartInstance,
                miniChartActive: typeof Chart !== 'undefined' && !!Chart.getChart('miniChart'),
                crossChartActive: typeof Chart !== 'undefined' && !!Chart.getChart('crossChart')
            };
        })()`);

        report('3. 40 Timed Switches (15ms delay with RAF overlap)',
            timedSwitchResult.errors.length === 0 &&
            timedSwitchResult.miniChartActive &&
            !timedSwitchResult.crossChartActive,
            `Errors: ${timedSwitchResult.errors.length}, MiniActive: ${timedSwitchResult.miniChartActive}`
        );

        // 4. Memory & Canvas Collision Verification: Exactly one chart active at any time
        const singleChartActiveCheck = await cdp.eval(`(() => {
            switchSidebarView('cross');
            const crossOnly = !Chart.getChart('miniChart') && !!Chart.getChart('crossChart');
            switchSidebarView('station');
            const stationOnly = !!Chart.getChart('miniChart') && !Chart.getChart('crossChart');
            destroyActiveChart();
            const noneActive = !Chart.getChart('miniChart') && !Chart.getChart('crossChart');
            // Restore
            switchSidebarView('station');
            return { crossOnly, stationOnly, noneActive };
        })()`);

        report('4. Clean Canvas Collision Prevention & Single Active Chart Invariant',
            singleChartActiveCheck.crossOnly &&
            singleChartActiveCheck.stationOnly &&
            singleChartActiveCheck.noneActive,
            `CrossOnly: ${singleChartActiveCheck.crossOnly}, StationOnly: ${singleChartActiveCheck.stationOnly}, NoneActive: ${singleChartActiveCheck.noneActive}`
        );

        // 5. DOM Visibility Invariant after Rapid Switching
        await cdp.eval(`switchSidebarView('station')`);
        const stationState = await cdp.eval(`({
            stationDisplay: getComputedStyle(document.getElementById('viewStationContainer')).display,
            crossDisplay: getComputedStyle(document.getElementById('viewCrossContainer')).display,
            stationAria: document.getElementById('tabStationView').getAttribute('aria-selected'),
            crossAria: document.getElementById('tabCrossView').getAttribute('aria-selected'),
            canvasWidth: document.getElementById('miniChart').clientWidth,
            canvasHeight: document.getElementById('miniChart').clientHeight
        })`);

        await cdp.eval(`switchSidebarView('cross')`);
        const crossState = await cdp.eval(`({
            stationDisplay: getComputedStyle(document.getElementById('viewStationContainer')).display,
            crossDisplay: getComputedStyle(document.getElementById('viewCrossContainer')).display,
            stationAria: document.getElementById('tabStationView').getAttribute('aria-selected'),
            crossAria: document.getElementById('tabCrossView').getAttribute('aria-selected'),
            canvasWidth: document.getElementById('crossChart').clientWidth,
            canvasHeight: document.getElementById('crossChart').clientHeight
        })`);

        report('5. DOM Visibility Invariants & Aria Tab States',
            stationState.stationDisplay === 'flex' &&
            stationState.crossDisplay === 'none' &&
            stationState.stationAria === 'true' &&
            stationState.crossAria === 'false' &&
            stationState.canvasWidth > 0 &&
            crossState.stationDisplay === 'none' &&
            crossState.crossDisplay === 'flex' &&
            crossState.stationAria === 'false' &&
            crossState.crossAria === 'true' &&
            crossState.canvasWidth > 0,
            `Station: flex/none canvas=${stationState.canvasWidth}x${stationState.canvasHeight}, Cross: none/flex canvas=${crossState.canvasWidth}x${crossState.canvasHeight}`
        );

        // 6. Cross-visualization pill switching stress (30 rapid selections across 3 domains)
        const pillSwitchResult = await cdp.eval(`(() => {
            const pills = ['clima_salud', 'criosfera_riesgo', 'marino_productivo'];
            const errors = [];
            for (let i = 0; i < 30; i++) {
                const p = pills[i % pills.length];
                try {
                    selectCrossVisualization(p);
                } catch (e) {
                    errors.push({ pill: p, err: e.message });
                }
            }
            return {
                errors,
                currentCrossId: typeof currentCrossId !== 'undefined' ? currentCrossId : null,
                crossChartActive: typeof Chart !== 'undefined' && !!Chart.getChart('crossChart')
            };
        })()`);

        report('6. Rapid Multivariable Cross Pill Switching (30 iterations)',
            pillSwitchResult.errors.length === 0 && pillSwitchResult.crossChartActive,
            `Errors: ${pillSwitchResult.errors.length}, Final CrossId: ${pillSwitchResult.currentCrossId}`
        );

        // 7. Marker click while on Cross View (Should seamlessly auto-route back to station view)
        const autoRouteCheck = await cdp.eval(`(() => {
            switchSidebarView('cross');
            const beforeView = currentView;
            selectStation(stations[1]); // Click Bajo Colonia
            return {
                beforeView,
                afterView: currentView,
                currentStationId: currentStation.id,
                itemTitle: document.getElementById('itemTitle').innerText,
                miniChartActive: typeof Chart !== 'undefined' && !!Chart.getChart('miniChart'),
                crossChartActive: typeof Chart !== 'undefined' && !!Chart.getChart('crossChart')
            };
        })()`);

        report('7. Map Marker Click Auto-Routes Cross View -> Station View',
            autoRouteCheck.beforeView === 'cross' &&
            autoRouteCheck.afterView === 'station' &&
            autoRouteCheck.currentStationId === 2 &&
            autoRouteCheck.itemTitle.includes('Colonia') &&
            autoRouteCheck.miniChartActive &&
            !autoRouteCheck.crossChartActive,
            `Before: ${autoRouteCheck.beforeView}, After: ${autoRouteCheck.afterView}, Station: "${autoRouteCheck.itemTitle}"`
        );

        // 8. Console exception check during Suite 1
        const suite1Exceptions = cdp.exceptions.slice();
        const canvasInUseErrors = cdp.consoleLogs.filter(l => (l.text || '').includes('Canvas is already in use'));
        report('8. Zero "Canvas is already in use" & Zero Uncaught Exceptions',
            suite1Exceptions.length === 0 && canvasInUseErrors.length === 0,
            `Exceptions: ${suite1Exceptions.length}, "Canvas in use" logs: ${canvasInUseErrors.length}`
        );


        // ======================================================================
        // SUITE 2: RESPONSIVE BREAKPOINTS & MOBILE DRAWER BEHAVIOR
        // ======================================================================
        console.log('\n--- SUITE 2: Responsive Breakpoints & Mobile Drawer Behavior ---');

        // 9. Desktop Viewport (1280px x 800px)
        await cdp.setViewport(1280, 800, false);
        await new Promise(r => setTimeout(r, 200));

        await cdp.eval(`setDrawerMode('desktop')`);
        await new Promise(r => setTimeout(r, 350));
        const desktopModeInfo = await cdp.eval(`({
            panelWidth: document.getElementById('detailPanel').offsetWidth,
            appLayoutCols: getComputedStyle(document.querySelector('.app-layout')).gridTemplateColumns,
            fullContentDisplay: getComputedStyle(document.getElementById('drawerFullContent')).visibility,
            miniDockDisplay: getComputedStyle(document.getElementById('drawerMiniDock')).display
        })`);

        await cdp.eval(`setDrawerMode('projector')`);
        await new Promise(r => setTimeout(r, 350));
        const projectorModeInfo = await cdp.eval(`({
            panelWidth: document.getElementById('detailPanel').offsetWidth,
            appLayoutCols: getComputedStyle(document.querySelector('.app-layout')).gridTemplateColumns
        })`);

        await cdp.eval(`setDrawerMode('collapsed')`);
        await new Promise(r => setTimeout(r, 350));
        const collapsedModeInfo = await cdp.eval(`({
            panelWidth: document.getElementById('detailPanel').offsetWidth,
            appLayoutCols: getComputedStyle(document.querySelector('.app-layout')).gridTemplateColumns,
            fullContentVis: getComputedStyle(document.getElementById('drawerFullContent')).visibility,
            miniDockDisplay: getComputedStyle(document.getElementById('drawerMiniDock')).display
        })`);

        report('9. Desktop Breakpoint (1280px) 3-State Layout & Dock Visibility',
            Math.abs(desktopModeInfo.panelWidth - 440) <= 2 &&
            Math.abs(projectorModeInfo.panelWidth - 560) <= 2 &&
            Math.abs(collapsedModeInfo.panelWidth - 48) <= 2 &&
            desktopModeInfo.fullContentDisplay === 'visible' &&
            desktopModeInfo.miniDockDisplay === 'none' &&
            collapsedModeInfo.fullContentVis === 'hidden' &&
            collapsedModeInfo.miniDockDisplay === 'flex',
            `Desktop: ${desktopModeInfo.panelWidth}px, Projector: ${projectorModeInfo.panelWidth}px, Collapsed: ${collapsedModeInfo.panelWidth}px`
        );

        // 10. Tablet Viewport (900px x 700px)
        console.log('  [RUN] Emulating Tablet Viewport (900px x 700px)...');
        await cdp.setViewport(900, 700, false);
        await new Promise(r => setTimeout(r, 250));

        await cdp.eval(`setDrawerMode('desktop')`);
        await new Promise(r => setTimeout(r, 350));
        const tabletDesktopInfo = await cdp.eval(`({
            panelWidth: document.getElementById('detailPanel').offsetWidth,
            panelHeight: document.getElementById('detailPanel').offsetHeight,
            layoutCols: getComputedStyle(document.querySelector('.app-layout')).gridTemplateColumns,
            layoutRows: getComputedStyle(document.querySelector('.app-layout')).gridTemplateRows,
            borderTop: getComputedStyle(document.getElementById('detailPanel')).borderTopWidth,
            borderLeft: getComputedStyle(document.getElementById('detailPanel')).borderLeftWidth
        })`);

        await cdp.eval(`setDrawerMode('collapsed')`);
        await new Promise(r => setTimeout(r, 350));
        const tabletCollapsedInfo = await cdp.eval(`({
            panelHeight: document.getElementById('detailPanel').offsetHeight,
            dockDirection: getComputedStyle(document.getElementById('drawerMiniDock')).flexDirection,
            dockHeight: document.getElementById('drawerMiniDock').offsetHeight,
            stationLabelDisplay: getComputedStyle(document.getElementById('dockMobileStationLabel')).display
        })`);

        report('10. Tablet Breakpoint (900px) Layout Transition to Row Grid & Bottom Dock',
            tabletDesktopInfo.panelWidth >= 890 &&
            Math.abs(tabletDesktopInfo.panelHeight - 360) <= 5 &&
            tabletDesktopInfo.borderTop === '1px' &&
            tabletDesktopInfo.borderLeft === '0px' &&
            Math.abs(tabletCollapsedInfo.panelHeight - 48) <= 2 &&
            tabletCollapsedInfo.dockDirection === 'row' &&
            tabletCollapsedInfo.stationLabelDisplay === 'block',
            `Desktop H: ${tabletDesktopInfo.panelHeight}px (expected 360px), Collapsed H: ${tabletCollapsedInfo.panelHeight}px, Direction: ${tabletCollapsedInfo.dockDirection}`
        );

        // 11. Mobile Viewport (600px x 800px)
        console.log('  [RUN] Emulating Mobile Viewport (600px x 800px)...');
        await cdp.setViewport(600, 800, true);
        await new Promise(r => setTimeout(r, 250));

        await cdp.eval(`setDrawerMode('desktop')`);
        const mobileDesktopInfo = await cdp.eval(`({
            headerStatsDisplay: getComputedStyle(document.querySelector('.header-stats')).display,
            layerControlsWrap: getComputedStyle(document.querySelector('.map-layer-controls')).flexWrap,
            layerControlsOverflow: getComputedStyle(document.querySelector('.map-layer-controls')).overflowX,
            panelHeight: document.getElementById('detailPanel').offsetHeight,
            canvasWidth: document.getElementById('miniChart').clientWidth,
            canvasHeight: document.getElementById('miniChart').clientHeight
        })`);

        await cdp.eval(`setDrawerMode('collapsed')`);
        const mobileCollapsedInfo = await cdp.eval(`({
            panelHeight: document.getElementById('detailPanel').offsetHeight,
            dockHeight: document.getElementById('drawerMiniDock').offsetHeight,
            dockExpandBtnVisible: document.getElementById('dockExpandBtn').offsetWidth > 0
        })`);

        report('11. Mobile Breakpoint (600px) Header Shrink, Layer Scroll & Sizing',
            mobileDesktopInfo.headerStatsDisplay === 'none' &&
            mobileDesktopInfo.layerControlsWrap === 'nowrap' &&
            mobileDesktopInfo.layerControlsOverflow === 'auto' &&
            Math.abs(mobileCollapsedInfo.dockHeight - 44) <= 2 &&
            mobileDesktopInfo.canvasWidth <= 600 &&
            mobileDesktopInfo.canvasWidth > 200,
            `Stats: ${mobileDesktopInfo.headerStatsDisplay}, Dock H: ${mobileCollapsedInfo.dockHeight}px (expected 44px), Canvas: ${mobileDesktopInfo.canvasWidth}x${mobileDesktopInfo.canvasHeight}`
        );

        // 12. Mobile Interactive Drawer Expansion & Collapse via Click
        console.log('  [RUN] Testing Mobile Click Interactivity on Mini Dock and Collapse Button...');
        const clickInteractiveResult = await cdp.eval(`(async () => {
            setDrawerMode('collapsed');
            await new Promise(r => setTimeout(r, 350));
            const h0 = document.getElementById('detailPanel').offsetHeight;

            // Click dock to expand
            document.getElementById('drawerMiniDock').click();
            await new Promise(r => setTimeout(r, 350));
            const modeAfterExpand = currentDrawerMode;
            const h1 = document.getElementById('detailPanel').offsetHeight;

            // Click collapse button to collapse back
            document.getElementById('drawerCollapseBtn').click();
            await new Promise(r => setTimeout(r, 350));
            const modeAfterCollapse = currentDrawerMode;
            const h2 = document.getElementById('detailPanel').offsetHeight;

            return {
                h0,
                modeAfterExpand,
                h1,
                modeAfterCollapse,
                h2
            };
        })()`);

        report('12. Mobile Drawer Click Interactivity (Click Dock -> Expand -> Click Collapse)',
            clickInteractiveResult.h0 === 44 &&
            clickInteractiveResult.modeAfterExpand === 'desktop' &&
            clickInteractiveResult.h1 > 350 &&
            clickInteractiveResult.modeAfterCollapse === 'collapsed' &&
            clickInteractiveResult.h2 === 44,
            `Start: ${clickInteractiveResult.h0}px -> Expanded: ${clickInteractiveResult.h1}px (${clickInteractiveResult.modeAfterExpand}) -> Collapsed: ${clickInteractiveResult.h2}px (${clickInteractiveResult.modeAfterCollapse})`
        );

        // 13. Ultra-Mobile Viewport (375px x 667px - iPhone SE) Layout Integrity
        console.log('  [RUN] Emulating Ultra-Mobile Viewport (375px x 667px)...');
        await cdp.setViewport(375, 667, true);
        await new Promise(r => setTimeout(r, 250));
        await cdp.eval(`setDrawerMode('desktop'); selectStation(stations[0]);`);

        const ultraMobileInfo = await cdp.eval(`({
            bodyScrollWidth: document.body.scrollWidth,
            windowInnerWidth: window.innerWidth,
            panelScrollWidth: document.getElementById('detailPanel').scrollWidth,
            panelClientWidth: document.getElementById('detailPanel').clientWidth,
            chartCanvasWidth: document.getElementById('miniChart').clientWidth,
            chartContainerWidth: document.querySelector('.chart-container-fluid').clientWidth,
            hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth
        })`);

        report('13. Ultra-Mobile Viewport (375px) No Horizontal Overflow & Canvas Fitting',
            !ultraMobileInfo.hasHorizontalOverflow &&
            ultraMobileInfo.chartCanvasWidth <= 375 &&
            ultraMobileInfo.chartCanvasWidth > 250,
            `Body: scroll=${ultraMobileInfo.bodyScrollWidth}px inner=${ultraMobileInfo.windowInnerWidth}px, Canvas: ${ultraMobileInfo.chartCanvasWidth}px`
        );

        // 14. Global Console Error / Warning / Exception Audit across all test suites
        const totalExceptions = cdp.exceptions.length;
        const totalErrorLogs = cdp.consoleLogs.filter(l => l.type === 'error').length;
        report('14. Complete Console Integrity (0 Uncaught Exceptions & 0 Console Errors)',
            totalExceptions === 0 && totalErrorLogs === 0,
            `Total Exceptions: ${totalExceptions}, Console Errors: ${totalErrorLogs}`
        );

        // Summary Assessment
        console.log('\n================================================================');
        const allPassed = results.every(r => r.passed);
        console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${results.filter(r => r.passed).length} | FAILED: ${results.filter(r => !r.passed).length}`);
        console.log(`FINAL EMPIRICAL VERDICT: ${allPassed ? 'APPROVE' : 'REQUEST_CHANGES'}`);
        console.log('================================================================\n');

        return { allPassed, results };

    } finally {
        if (cdp) cdp.close();
        if (chrome) {
            chrome.kill('SIGKILL');
        }
        server.close();
    }
}

runAdversarialSuite()
    .then(({ allPassed }) => {
        process.exit(allPassed ? 0 : 1);
    })
    .catch(err => {
        console.error('Test Harness Fatal Error:', err);
        process.exit(1);
    });
