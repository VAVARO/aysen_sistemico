# -*- coding: utf-8 -*-
"""Regresiones reales para los hallazgos de QA y Web Performance across all 5 modules."""
import json
import os
import re
import subprocess
import unittest


ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


def read_text(rel_path):
    with open(os.path.join(ROOT_DIR, rel_path), 'r', encoding='utf-8') as f:
        return f.read()


def run_node_script(js_code):
    proc = subprocess.run(
        ['node', '-e', js_code],
        cwd=ROOT_DIR,
        capture_output=True,
        text=True,
        encoding='utf-8',
        timeout=25,
    )
    if proc.returncode != 0:
        raise AssertionError(
            f"Node execution failed (rc={proc.returncode}):\nSTDOUT:\n{proc.stdout}\nSTDERR:\n{proc.stderr}"
        )
    return proc.stdout.strip()


class TestQAPerformanceRegressions(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.portal = read_text('portal.html')
        cls.sistemas = read_text('sistemas_complejos.html')
        cls.index = read_text('index.html')
        cls.lab = read_text('laboratorio.html')
        cls.consultor = read_text('consultor.html')
        cls.omni = read_text('js/omniroute_client.js')
        cls.cabecera_js = read_text('js/cabecera_global.js')
        cls.cabecera_css = read_text('js/cabecera_global.css')
        cls.bundle_script = read_text('scripts/build_aysen_hubs_bundle.cjs')

    def test_01_omniroute_cada_comuna_and_deferred_init(self):
        out = run_node_script(r"""
const fs = require('fs');
const vm = require('vm');
const dataSb = { window: {} };
dataSb.window = dataSb;
vm.runInNewContext(fs.readFileSync('data/aysen_hubs_data.js', 'utf8'), dataSb);
const rawDataLake = dataSb.AYSEN_HUBS_DATA;

let dataLakeReads = 0;
const sandbox = {
  window: {},
  document: {},
  console,
  Math,
  Date,
  Set,
  Map,
  RegExp,
  JSON,
  Array,
  Object,
  Number,
  String,
  Boolean,
  fetch: async () => ({ ok: false })
};
Object.defineProperty(sandbox, 'AYSEN_HUBS_DATA', {
  get() {
    dataLakeReads += 1;
    return rawDataLake;
  },
  configurable: true
});
sandbox.window = sandbox;
vm.runInNewContext(fs.readFileSync('js/omniroute_client.js', 'utf8'), sandbox);

const readsBeforeCall = dataLakeReads;
const res = sandbox.OmniRouteClient.resolveClosedWorldDeterministic('¿Cuántos espacios culturales hay en cada comuna de Aysén?');
const readsAfterResolve = dataLakeReads;
const firstIdx = sandbox.OmniRouteClient.init(rawDataLake);
const secondIdx = sandbox.OmniRouteClient.init(rawDataLake);
const ch = (res && res.chart) || {};

console.log(JSON.stringify({
  readsBeforeCall,
  readsAfterResolve,
  singleComunaMode: ch.singleComunaMode !== undefined ? ch.singleComunaMode : null,
  comunaName: ch.comunaName !== undefined ? ch.comunaName : 'MISSING',
  focusComunas: ch.focusComunas !== undefined ? ch.focusComunas : 'MISSING',
  varsLen: Array.isArray(ch.multiCharts) ? ch.multiCharts.length : (ch.varX ? 1 : 0),
  relatedHub: res ? res.relatedHub : null,
  idempotentInit: Boolean(firstIdx && secondIdx && firstIdx === secondIdx)
}));
""")
        data = json.loads(out)
        self.assertEqual(data['readsBeforeCall'], 0, 'OmniRoute no debe construir el índice síncronamente al cargar el script')
        self.assertGreater(data['readsAfterResolve'], 0)
        self.assertFalse(data['singleComunaMode'])
        self.assertIsNone(data['comunaName'])
        self.assertIsNone(data['focusComunas'])
        self.assertGreaterEqual(data['varsLen'], 1)
        self.assertTrue(data['idempotentInit'])

    def test_02_cabecera_global_mobile_drawer_and_static_links(self):
        out = run_node_script(r"""
const fs = require('fs');
const vm = require('vm');
function makeEl(tag, id) {
  const attrs = {};
  const classes = new Set();
  const listeners = {};
  const children = [];
  return {
    tagName: tag.toUpperCase(),
    id: id || '',
    className: '',
    innerHTML: '',
    textContent: '',
    style: {},
    dataset: {},
    children,
    setAttribute(k, v) { attrs[k] = String(v); },
    getAttribute(k) { return k in attrs ? attrs[k] : null; },
    removeAttribute(k) { delete attrs[k]; },
    classList: {
      add(c) { classes.add(c); },
      remove(c) { classes.delete(c); },
      toggle(c, force) {
        if (force === undefined) {
          if (classes.has(c)) { classes.delete(c); return false; }
          classes.add(c); return true;
        }
        if (force) classes.add(c); else classes.delete(c);
        return !!force;
      },
      contains(c) { return classes.has(c); }
    },
    addEventListener(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); },
    appendChild(child) { children.push(child); return child; },
    insertBefore(child) { children.push(child); return child; },
    insertAdjacentHTML() {},
    querySelectorAll() { return []; },
    querySelector() { return null; },
    remove() {}
  };
}

const registry = {};
const headerEl = makeEl('header', 'brandHeader');
const innerEl = makeEl('div');
const navPillsEl = makeEl('nav');
const brandRightEl = makeEl('div');
const linksWrapEl = makeEl('nav');
registry['brandHeader'] = headerEl;

headerEl.querySelector = (sel) => {
  if (sel.includes('.brand-header-inner')) return innerEl;
  if (sel.includes('.brand-nav-pills')) return navPillsEl;
  return null;
};
innerEl.querySelector = (sel) => (sel.includes('.brand-right') ? brandRightEl : null);
brandRightEl.insertAdjacentHTML = (pos, html) => {
  if (html.includes('id="btnMobileMenu"')) registry['btnMobileMenu'] = makeEl('button', 'btnMobileMenu');
};

const bodyEl = makeEl('body');
bodyEl.insertAdjacentHTML = (pos, html) => {
  if (html.includes('id="mobileNavDrawer"')) {
    const drawer = makeEl('div', 'mobileNavDrawer');
    drawer.querySelector = (sel) => (sel === '.mobile-nav-links' ? linksWrapEl : null);
    registry['mobileNavDrawer'] = drawer;
    registry['btnMobileClose'] = makeEl('button', 'btnMobileClose');
    registry['mobileNavBackdrop'] = makeEl('div', 'mobileNavBackdrop');
  }
};

const document = {
  body: bodyEl,
  getElementById(id) { return registry[id] || null; },
  querySelector(sel) {
    if (sel.includes('header.brand-header')) return headerEl;
    if (sel === '#mobileNavDrawer .mobile-nav-links') return linksWrapEl;
    return null;
  },
  querySelectorAll() { return []; },
  createElement(tag) { return makeEl(tag); }
};

const windowListeners = {};
const sandbox = {
  location: { pathname: '/portal.html' },
  document,
  console,
  addEventListener(evt, fn) { (windowListeners[evt] = windowListeners[evt] || []).push(fn); },
  module: { exports: {} },
  exports: {}
};
sandbox.exports = sandbox.module.exports;
sandbox.window = sandbox;

vm.runInNewContext(fs.readFileSync('js/cabecera_global.js', 'utf8'), sandbox);
sandbox.montarCabecera({ activo: 'portal.html' });

const hasDrawer = Boolean(registry['mobileNavDrawer']);
const hasBtn = Boolean(registry['btnMobileMenu']);
sandbox.openMobileNav();
const openedOpen = registry['mobileNavDrawer'].classList.contains('open');
const openedAria = registry['mobileNavDrawer'].getAttribute('aria-hidden');

(windowListeners['keydown'] || []).forEach(fn => fn({ key: 'Escape' }));
const closedAfterEscOpen = registry['mobileNavDrawer'].classList.contains('open');
const closedAfterEscAria = registry['mobileNavDrawer'].getAttribute('aria-hidden');

console.log(JSON.stringify({
  hasDrawer,
  hasBtn,
  openedOpen,
  openedAria,
  closedAfterEscOpen,
  closedAfterEscAria,
  exportFn: typeof sandbox.module.exports.montarCabecera === 'function'
}));
""")
        data = json.loads(out)
        self.assertTrue(data['hasDrawer'])
        self.assertTrue(data['hasBtn'])
        self.assertTrue(data['openedOpen'])
        self.assertEqual(data['openedAria'], 'false')
        self.assertFalse(data['closedAfterEscOpen'])
        self.assertEqual(data['closedAfterEscAria'], 'true')
        self.assertTrue(data['exportFn'])

        for name, html in [('portal', self.portal), ('sistemas', self.sistemas), ('index', self.index), ('laboratorio', self.lab), ('consultor', self.consultor)]:
            self.assertIn('id="btnMobileMenu"', html, f'{name} missing #btnMobileMenu')
            self.assertIn('id="mobileNavDrawer"', html, f'{name} missing #mobileNavDrawer')
            self.assertIn('consultor.html', html, f'{name} missing Consultor de Datos link')
            self.assertNotIn('function openMobileNav', html, f'{name} should not duplicate openMobileNav inline')

        self.assertIn('z-index: 1200', self.cabecera_css)

    def test_03_consultor_updateLabLink_and_mobile_hardening(self):
        self.assertIn('100dvh', self.consultor)
        self.assertIn('@media (max-width: 960px)', self.consultor)
        self.assertIn('rel="noopener noreferrer"', self.consultor)
        self.assertIn('integrity="sha', self.consultor)

        match = re.search(r'function updateLabLink\(\)\s*\{[\s\S]*?\n\s{6}\}', self.consultor)
        self.assertIsNotNone(match, 'updateLabLink no encontrado en consultor.html')
        out = run_node_script(f"""
const window = {{ location: {{ href: 'http://localhost/consultor.html' }} }};
const linkEl = {{ href: 'laboratorio.html' }};
const btnOpenInLab = linkEl;
const document = {{ getElementById: (id) => id === 'btnOpenInLab' ? linkEl : null }};
const currentChartState = {{
  chartType: 'line',
  varX: 'anio',
  varY: 'temperatura_media_anual',
  dataVariables: [{{ id: 'temperatura_media_anual' }}]
}};
{match.group(0)}
updateLabLink();
console.log(linkEl.href);
""")
        self.assertIn('varX=', out)
        self.assertIn('temperatura_media_anual', out)
        self.assertNotIn('visitantes_snaspe', out)

    def test_04_sistemas_complejos_bilingual_and_dpr(self):
        self.assertIn('id="langEs"', self.sistemas)
        self.assertIn('id="langEn"', self.sistemas)
        self.assertIn('100dvh', self.sistemas)
        self.assertIn('Math.min(window.devicePixelRatio || 1, 2)', self.sistemas)

        map_match = re.search(r'const SCENE_EN_MAP = \{[\s\S]*?\};', self.sistemas)
        fn_match = re.search(r'function translateSceneTextEn\(str\)\s*\{[\s\S]*?\n\s{4}\}', self.sistemas)
        self.assertIsNotNone(map_match)
        self.assertIsNotNone(fn_match)
        out = run_node_script(f"""
{map_match.group(0)}
{fn_match.group(0)}
console.log(JSON.stringify({{
  reinforcing: translateSceneTextEn('REFUERZA'),
  permafrost: translateSceneTextEn('PERMAFROST CONGELADO'),
  checked: translateSceneTextEn('[OK] ESTABILIZA')
}}));
""")
        res = json.loads(out)
        self.assertEqual(res['reinforcing'], 'REINFORCING')
        self.assertEqual(res['permafrost'], 'FROZEN PERMAFROST')
        self.assertIn('BALANCING', res['checked'])

    def test_05_index_html_clean_loading_search_and_bridges(self):
        self.assertNotIn('document.write(', self.index)
        self.assertIn('precomputeSearchTextForNodos', self.index)
        self.assertIn('hydrateHubsData', self.index)
        self.assertIn('AppState.graph.simulation.stop()', self.index)
        self.assertIn('laboratorio.html?node=${encodeURIComponent(rel.id)}', self.index)
        self.assertIn('Funcionamiento y Fuentes (38)', self.index)
        self.assertIn('#23, #25, #26, #41', self.index)
        self.assertIn('panelHeight', self.index)

        out = run_node_script(r"""
const fs = require('fs');
const vm = require('vm');
const sandbox = { window: {} };
sandbox.window = sandbox;
vm.runInNewContext(fs.readFileSync('data/aysen_hubs_data.js', 'utf8'), sandbox);
const bridges = (sandbox.AYSEN_HUBS_DATA && sandbox.AYSEN_HUBS_DATA.systemicBridges) || [];
const edges = new Set(bridges.map(b => {
  const a = Number(b.source), c = Number(b.target);
  return `${Math.min(a, c)}-${Math.max(a, c)}`;
}));
const expected = ['1-40', '13-40', '19-40', '39-40', '12-41', '17-41', '22-41', '24-41'];
console.log(JSON.stringify(expected.filter(e => !edges.has(e))));
""")
        self.assertEqual(json.loads(out), [])

    def test_06_portal_html_perf_and_prose(self):
        self.assertIn('new Float32Array(', self.portal)
        self.assertIn('lastDwellRenderKey', self.portal)
        self.assertIn('ResizeObserver', self.portal)
        self.assertIn('visibilitychange', self.portal)
        self.assertIn('REDUCED_MOTION', self.portal)
        self.assertIn('href="consultor.html" class="editorial-inline-link"', self.portal)
        sec_why = self.portal.split('id="seccion-por-que"')[1][:1500]
        self.assertNotIn(' ,', sec_why)
        self.assertNotIn(' .', sec_why)

    def test_07_laboratorio_exportJson_circular_and_single_ref_hydration(self):
        ser_match = re.search(r'function serializeWidgetState\(w\)\s*\{[\s\S]*?\n\s{6}\}', self.lab)
        exp_match = re.search(r'function exportJson\(\)\s*\{[\s\S]*?\n\s{6}\}', self.lab)
        load_match = re.search(r'function loadSavedOrPreset\(\)\s*\{[\s\S]*?\n\s{6}\}', self.lab)
        self.assertIsNotNone(ser_match)
        self.assertIsNotNone(exp_match)
        self.assertIsNotNone(load_match)

        out = run_node_script(f"""
const circ = {{ name: 'ChartMock' }};
circ.self = circ;
const w1 = {{
  id: 1, type: 'chart', chartType: 'bar', title: 'Test', varX: 'v1', varY: null,
  color: '#00357f', showAverage: false, showTrend: false, x: 100, y: 120, w: 500, h: 370,
  instance: circ, resizeObserver: {{ obs: circ }}
}};
const AppState = {{
  widgets: [w1],
  subDashboards: [{{ id: 'sd1', name: 'Principal', widgets: [w1], connections: [], reflectionCards: [], transform: {{ x: 0, y: 0, scale: 1 }} }}],
  activeSubDashboardId: 'sd1',
  nextSubDashboardId: 2,
  nextWidgetId: 2,
  nextReflectionId: 1,
  connections: [],
  reflectionCards: [],
  transform: {{ x: 0, y: 0, scale: 1 }}
}};
let lastBlobText = '';
let revoked = [];
class Blob {{ constructor(parts) {{ lastBlobText = parts.join(''); }} }}
const URL = {{ createObjectURL: () => 'blob://test-json', revokeObjectURL: (u) => revoked.push(u) }};
const document = {{
  getElementById: () => null,
  createElement: () => ({{ href: '', download: '', click() {{}} }})
}};
const setTimeout = (fn) => fn();
{ser_match.group(0)}
{exp_match.group(0)}
exportJson();
const parsed = JSON.parse(lastBlobText);

const renderedRefs = [];
const localStorage = {{ getItem: () => lastBlobText }};
const AppState2 = {{
  widgets: [],
  subDashboards: [],
  activeSubDashboardId: null,
  nextSubDashboardId: 1,
  nextWidgetId: 1,
  nextReflectionId: 1,
  connections: [],
  reflectionCards: [],
  transform: {{ x: 0, y: 0, scale: 1 }}
}};
function renderWidgetCardDOM(w) {{ renderedRefs.push(w); }}
function renderReflectionCardDOM() {{}}
function applyCanvasTransform() {{}}
function syncHeroVisibility() {{}}
function renderWindowTabs() {{}}
function updateStatus() {{}}
function updateConnections() {{}}
function renderSubDashboards() {{}}
const loadFnCode = {json.dumps(load_match.group(0).replace('AppState.', 'AppState2.'))};
eval(loadFnCode);
loadSavedOrPreset();

console.log(JSON.stringify({{
  exportedWidgets: parsed.widgets.length,
  hasInstanceKey: 'instance' in parsed.widgets[0],
  revokedCount: revoked.length,
  hydratedSameRef: AppState2.widgets.length === 1 && renderedRefs.length === 1 && AppState2.widgets[0] === renderedRefs[0]
}}));
""")
        res = json.loads(out)
        self.assertEqual(res['exportedWidgets'], 1)
        self.assertFalse(res['hasInstanceKey'])
        self.assertEqual(res['revokedCount'], 1)
        self.assertTrue(res['hydratedSameRef'])

    def test_08_laboratorio_word_boundary_search_and_leaflet_opt(self):
        norm_match = re.search(r'function normStr\([^)]*\)\s*\{[\s\S]*?\n\s{6}\}', self.lab)
        b_match = re.search(r'function buildCatalogSearchText\(it\)\s*\{[\s\S]*?\n\s{6}\}', self.lab)
        m_match = re.search(r'function matchesCatalogSearch\(it, qNorm\)\s*\{[\s\S]*?\n\s{6}\}', self.lab)
        self.assertIsNotNone(norm_match)
        self.assertIsNotNone(b_match)
        self.assertIsNotNone(m_match)

        out = run_node_script(f"""
{norm_match.group(0)}
function getAutoexplanatoryVarInfo() {{ return null; }}
function resolveCatalogSubGroup() {{ return ''; }}
{b_match.group(0)}
{m_match.group(0)}
const itemTrue = {{ id: 'rs_01', name: 'Indicador RS Territorial' }};
const itemFalse = {{ id: 'x_01', name: 'Diversidad en transporte regional' }};
console.log(JSON.stringify({{
  hitShort: matchesCatalogSearch(itemTrue, 'rs'),
  missSubstring: matchesCatalogSearch(itemFalse, 'rs')
}}));
""")
        res = json.loads(out)
        self.assertTrue(res['hitShort'])
        self.assertFalse(res['missSubstring'])

        self.assertIn('preferCanvas: true', self.lab)
        self.assertIn('L.canvas({ pane:', self.lab)
        self.assertIn('marker.bindTooltip(() =>', self.lab)
        self.assertIn('marker.bindPopup(() =>', self.lab)
        self.assertIn('await Promise.all([', self.lab)
        self.assertIn('URL.revokeObjectURL', self.lab)

    def test_09_laboratorio_barometro_filters_aria_and_exec_stats(self):
        self.assertNotIn('onclick="openSociodemoDrawer', self.lab)
        self.assertIn("modal.setAttribute('aria-hidden', 'false')", self.lab)
        self.assertIn("drawer.setAttribute('aria-hidden', 'false')", self.lab)
        self.assertIn("if (interreg === 'los_lagos' || interreg === 'nacional' || interreg === 'comparativa')", self.lab)

        stats_match = re.search(r'function computeWidgetExecutiveStats\(w\)\s*\{([\s\S]*?)\n\s{6}\}', self.lab)
        self.assertIsNotNone(stats_match)
        out = run_node_script(f"""
const AppState = {{ territorialFilter: 'all', excludeCoyhaique: false }};
const document = {{ querySelector: () => null }};
function getWidgetDataPayload() {{
  return {{
    mode: 'bivariate',
    dim: 'barometro_estrato',
    labels: ['NSE Bajo', 'NSE Medio', 'NSE Alto'],
    dataX: [42, 42, 42],
    dataY: [68, 52, 40],
    nameX: 'Pobreza Multidimensional',
    unitX: '%',
    nameY: 'Percepción Positiva',
    unitY: '%'
  }};
}}
function computeWidgetExecutiveStats(w) {{
{stats_match.group(1)}
}}
const res = computeWidgetExecutiveStats({{ title: 'Espejo', excludeOutlierCoyhaique: false }});
console.log(JSON.stringify(res));
""")
        res = json.loads(out)
        self.assertIn('promedio estructural regional homogéneo', res['pt1'])
        self.assertIn('lidera NSE Bajo', res['pt1'])
        self.assertIn('rezaga NSE Alto', res['pt1'])


if __name__ == '__main__':
    unittest.main()
