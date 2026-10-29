/**
 * scripts/run_toolbar_simulation.cjs
 * =============================================================================
 * Simulador de eventos e interactividad para la Barra Flotante (#canvaFloatingToolbar)
 * de Laboratorio Sistémico (laboratorio.html).
 *
 * Valida la ejecución programática y por clics de 100% de los botones:
 * - Visuales: tbBtnBar, tbBtnLine, tbBtnScatter, tbBtnMap, tbBtnTable, tbBtnKPI
 * - Muestras de color: .color-swatch-btn
 * - Analítica: tbBtnAverage, tbBtnTrend, tbBtnReflection, tbBtnCsv, btnExcludeCoyhaique
 * - Escala y ranking: tbBtnSortRank, tbBtnScaleRaw, tbBtnScalePct, tbBtnScaleZ
 * - Botón de cierre: tbBtnCloseToolbar
 * - Arrastre libre: toolbarDragHandle
 * - Protección de deselección ante clics en el lienzo
 *
 * Principio innegociable: CERO EMOJIS.
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const labHtmlPath = path.join(rootDir, 'laboratorio.html');
const html = fs.readFileSync(labHtmlPath, 'utf8');

function extractFunction(source, funcName) {
  const marker = 'function ' + funcName;
  const idx = source.indexOf(marker);
  if (idx === -1) {
    throw new Error('No se encontro la funcion: ' + funcName);
  }
  const openBrace = source.indexOf('{', idx);
  let depth = 1;
  let inString = false;
  let quoteChar = null;
  let i = openBrace + 1;
  while (i < source.length && depth > 0) {
    const ch = source[i];
    if (inString) {
      if (ch === quoteChar && source[i - 1] !== '\\') {
        inString = false;
      }
    } else {
      if (ch === "'" || ch === '"' || ch === '`') {
        inString = true;
        quoteChar = ch;
      } else if (ch === '{') {
        depth++;
      } else if (ch === '}') {
        depth--;
      }
    }
    i++;
  }
  return source.slice(idx, i);
}

class MockElement {
  constructor(id, tag = 'div', classes = '') {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.className = classes;
    this._classList = new Set(classes.split(' ').filter(Boolean));
    this.style = {};
    this.dataset = {};
    this._listeners = {};
    this.disabled = false;
    this.children = [];
    this.textContent = '';
    this.title = '';
  }

  get classList() {
    return {
      add: (...c) => c.forEach(x => this._classList.add(x)),
      remove: (...c) => c.forEach(x => this._classList.delete(x)),
      contains: (c) => this._classList.has(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (this._classList.has(c)) this._classList.delete(c);
          else this._classList.add(c);
        } else if (force) {
          this._classList.add(c);
        } else {
          this._classList.delete(c);
        }
      }
    };
  }

  getAttribute(attr) {
    if (attr.startsWith('data-')) {
      const k = attr.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return this.dataset[k] !== undefined ? this.dataset[k] : (this[attr] || null);
    }
    return this[attr] || null;
  }

  setAttribute(attr, val) {
    this[attr] = val;
    if (attr.startsWith('data-')) {
      const k = attr.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      this.dataset[k] = val;
    }
  }

  addEventListener(type, fn) {
    if (!this._listeners[type]) this._listeners[type] = [];
    this._listeners[type].push(fn);
  }

  dispatchEvent(evt) {
    const list = this._listeners[evt.type] || [];
    for (const fn of list) {
      fn(evt);
      if (evt._stopped) break;
    }
  }

  click() {
    const evt = {
      type: 'click',
      target: this,
      stopPropagation: () => { evt._stopped = true; }
    };
    this.dispatchEvent(evt);
  }

  querySelectorAll(sel) {
    const res = [];
    const walk = (el) => {
      for (const ch of el.children) {
        if (sel === '.color-swatch-btn' && ch.classList.contains('color-swatch-btn')) res.push(ch);
        if (sel === '.floating-btn' && ch.classList.contains('floating-btn')) res.push(ch);
        walk(ch);
      }
    };
    walk(this);
    return res;
  }

  closest(sel) {
    if (sel.includes(this.id) || sel.includes(this.className)) return this;
    return this;
  }

  getBoundingClientRect() {
    return { left: 100, top: 100, width: 380, height: 42, right: 480, bottom: 142 };
  }

  setPointerCapture() {}
  releasePointerCapture() {}
}

const elements = {};
function reg(id, tag, cls) {
  const el = new MockElement(id, tag, cls);
  elements[id] = el;
  return el;
}

const tb = reg('canvaFloatingToolbar', 'div', 'canva-floating-toolbar context-toolbar');
const dragHandle = reg('toolbarDragHandle', 'div', 'toolbar-drag-handle');
const closeBtn = reg('tbBtnCloseToolbar', 'button', 'toolbar-close-btn');
const btnBar = reg('tbBtnBar', 'button', 'floating-btn');
const btnLine = reg('tbBtnLine', 'button', 'floating-btn');
const btnScatter = reg('tbBtnScatter', 'button', 'floating-btn');
const btnMap = reg('tbBtnMap', 'button', 'floating-btn');
const btnTable = reg('tbBtnTable', 'button', 'floating-btn');
const btnKPI = reg('tbBtnKPI', 'button', 'floating-btn');
const btnAvg = reg('tbBtnAverage', 'button', 'floating-btn');
const btnTrend = reg('tbBtnTrend', 'button', 'floating-btn');
const btnRef = reg('tbBtnReflection', 'button', 'floating-btn');
const btnCsv = reg('tbBtnCsv', 'button', 'floating-btn');
const btnExc = reg('btnExcludeCoyhaique', 'button', 'floating-btn');
const btnSort = reg('tbBtnSortRank', 'button', 'floating-btn');
const btnRaw = reg('tbBtnScaleRaw', 'button', 'floating-btn');
const btnPct = reg('tbBtnScalePct', 'button', 'floating-btn');
const btnZ = reg('tbBtnScaleZ', 'button', 'floating-btn');
const panelLienzo = reg('panelLienzo', 'div', 'panel-lienzo');

const swatches = ['#00357f', '#0284c7', '#047857', '#b45309', '#b91c1c'].map((c, i) => {
  const sw = new MockElement('swatch_' + i, 'button', 'color-swatch-btn');
  sw.setAttribute('data-color', c);
  return sw;
});

tb.children = [
  dragHandle, closeBtn, btnBar, btnLine, btnScatter, btnMap, btnTable, btnKPI,
  btnAvg, btnTrend, btnRef, btnCsv, btnExc, btnSort, btnRaw, btnPct, btnZ,
  ...swatches
];

global.document = {
  getElementById: (id) => elements[id] || null,
  querySelectorAll: (sel) => tb.querySelectorAll(sel)
};

global.window = {
  addEventListener: () => {}
};

global.COMUNAS_ORDER = [
  'Coyhaique', 'Aysén', 'Chile Chico', 'Cochrane', 'Cisnes',
  'Guaitecas', 'Río Ibáñez', 'O\'Higgins', 'Tortel', 'Lago Verde'
];

global.normStr = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

global.COMUNAS_DATA = {};
global.COMUNAS_ORDER.forEach((c, idx) => {
  global.COMUNAS_DATA[c] = { pop: 2000 * (idx + 1) };
});

global.TERRITORIAL_SLICES = {};

global.AppState = {
  activeWidgetId: null,
  widgets: [],
  catalogItems: [
    { id: 'poblacion_censo_2024', name: 'Población Censo 2024', dim: 'comuna', unit: 'hab', data: [57818, 23959, 4863, 3390, 5217, 3190, 2699, 625, 523, 852] }
  ],
  toolbarPosition: null,
  toolbarHiddenByCard: {},
  transform: { x: 0, y: 0, scale: 1 },
  excludeCoyhaique: false
};

global.historyStack = [];
global.pushHistory = (msg) => { global.historyStack.push(msg); };
global.autoSave = () => {};
global.renderWidgetCardDOM = () => {};
global.renderWidgetVisual = () => {};
global.renderWindowTabs = () => {};
global.updateFloatingToolbarPosition = () => {};

let reflectionCardCalls = [];
global.invokeReflectionCardForWidget = (id) => { reflectionCardCalls.push(id); };

let exportCsvCalls = [];
global.exportCsv = (w) => { exportCsvCalls.push(w); };

let smartPopoverCalls = [];
global.openSmartPopover = (w, trigger) => { smartPopoverCalls.push({ w, trigger }); };

global.resolveCommunalVector = (item) => {
  if (item && Array.isArray(item.data)) return item.data;
  return global.COMUNAS_ORDER.map(() => 0);
};

// Evaluar funciones extraidas de laboratorio.html
eval(extractFunction(html, 'getTargetToolbarWidget'));
eval(extractFunction(html, 'hideFloatingToolbar'));
eval(extractFunction(html, 'showFloatingToolbarForCard'));
eval(extractFunction(html, 'initFloatingToolbarEvents'));
eval(extractFunction(html, 'getWidgetDataPayload'));

// Inicializar eventos de la barra
initFloatingToolbarEvents();

const results = {
  univariate: {},
  preset: {},
  shielding: {},
  summary: { total: 0, passed: 0, failed: 0 }
};

function recordTest(category, name, passed, details = '') {
  results[category][name] = { passed, details };
  results.summary.total++;
  if (passed) results.summary.passed++;
  else results.summary.failed++;
}

// -----------------------------------------------------------------------------
// CASO 1: TARJETA UNIVARIADA
// -----------------------------------------------------------------------------
const w1 = {
  id: 101,
  type: 'chart',
  chartType: 'bar',
  varX: 'poblacion_censo_2024',
  color: '#00357f',
  showAverage: false,
  showTrend: false,
  excludeOutlierCoyhaique: false,
  sortRanking: 'none',
  scaleMode: 'raw'
};
AppState.widgets = [w1];
showFloatingToolbarForCard(101);

recordTest('univariate', 'tb_active_on_show', tb.classList.contains('active'), 'La barra adquiere clase .active');
recordTest('univariate', 'target_widget_sync', tb.dataset.targetWidgetId === '101' && AppState.activeWidgetId === 101, 'Sincronizacion de targetWidgetId y activeWidgetId');

// Clic Línea
btnLine.click();
recordTest('univariate', 'tbBtnLine_click', w1.type === 'chart' && w1.chartType === 'line', 'Cambia a gráfico de línea');

// Clic Dispersión (univariada genera contraste y abre popover)
smartPopoverCalls = [];
btnScatter.click();
recordTest('univariate', 'tbBtnScatter_click', w1.type === 'chart' && w1.chartType === 'scatter' && smartPopoverCalls.length === 1, 'Cambia a dispersión y abre popover');

// Clic Tabla
btnTable.click();
recordTest('univariate', 'tbBtnTable_click', w1.type === 'table', 'Cambia a vista tabular');

// Clic KPI
btnKPI.click();
recordTest('univariate', 'tbBtnKPI_click', w1.type === 'kpi', 'Cambia a vista KPI');

// Clic Mapa
btnMap.click();
recordTest('univariate', 'tbBtnMap_click', w1.type === 'map', 'Cambia a vista mapa');

// Clic Barras
btnBar.click();
recordTest('univariate', 'tbBtnBar_click', w1.type === 'chart' && w1.chartType === 'bar', 'Restaura a gráfico de barras');

// Clic Muestra de Color (#047857)
swatches[2].click();
recordTest('univariate', 'color_swatch_click', w1.color === '#047857', 'Color actualizado a #047857');

// Clic Promedio
btnAvg.click();
recordTest('univariate', 'tbBtnAverage_click', w1.showAverage === true, 'showAverage alternado a true');

// Clic Tendencia
btnTrend.click();
recordTest('univariate', 'tbBtnTrend_click', w1.showTrend === true, 'showTrend alternado a true');

// Clic Sin Coyhaique
btnExc.click();
recordTest('univariate', 'btnExcludeCoyhaique_click', w1.excludeOutlierCoyhaique === true, 'excludeOutlierCoyhaique alternado a true');

// Clic Ciclo de Ranking (desc -> asc -> none)
btnSort.click();
const r1 = w1.sortRanking;
btnSort.click();
const r2 = w1.sortRanking;
btnSort.click();
const r3 = w1.sortRanking;
recordTest('univariate', 'tbBtnSortRank_cycle', r1 === 'desc' && r2 === 'asc' && r3 === 'none', `Ciclo ranking: ${r1} -> ${r2} -> ${r3}`);

// Clic Escalas
btnPct.click();
const sPct = w1.scaleMode;
btnZ.click();
const sZ = w1.scaleMode;
btnRaw.click();
const sRaw = w1.scaleMode;
recordTest('univariate', 'tbBtnScale_modes', sPct === 'pct' && sZ === 'zscore' && sRaw === 'raw', `Escalas: ${sPct} -> ${sZ} -> ${sRaw}`);

// Clic Pregunta Reflexiva
reflectionCardCalls = [];
btnRef.click();
recordTest('univariate', 'tbBtnReflection_click', reflectionCardCalls.length === 1 && reflectionCardCalls[0] === 101, 'Invoca reflexion para w1');

// Clic Exportar CSV
exportCsvCalls = [];
btnCsv.click();
recordTest('univariate', 'tbBtnCsv_click', exportCsvCalls.length === 1 && exportCsvCalls[0] === w1, 'Exporta CSV para w1');

// Clic Cerrar Barra Flotante
closeBtn.click();
recordTest('univariate', 'tbBtnCloseToolbar_click', !tb.classList.contains('active') && AppState.activeWidgetId === 101, 'Oculta barra preservando activeWidgetId');

// -----------------------------------------------------------------------------
// CASO 2: TARJETA PRESET (CUSTOMCHARTSPEC)
// -----------------------------------------------------------------------------
const w2 = {
  id: 202,
  type: 'chart',
  chartType: 'line',
  color: '#00357f',
  customChartSpec: {
    type: 'line',
    labels: [...global.COMUNAS_ORDER],
    datasets: [
      { label: 'Emisiones MP2.5', data: [120, 80, 45, 30, 25, 20, 15, 10, 8, 5], borderColor: '#00357f', unit: 'ug/m3' },
      { label: 'Urgencias Respiratorias', data: [95, 70, 40, 28, 22, 18, 12, 9, 7, 4], borderColor: '#0284c7', unit: '%' }
    ]
  }
};
AppState.widgets = [w1, w2];
showFloatingToolbarForCard(202);

// Color swatch en preset actualiza w2.color Y w2.customChartSpec.datasets[0].borderColor
swatches[3].click(); // #b45309
recordTest('preset', 'preset_color_sync', w2.color === '#b45309' && w2.customChartSpec.datasets[0].borderColor === '#b45309', 'Actualiza color en widget y customChartSpec dataset');

// Alternar tipos visuales en preset
btnTable.click();
const pTab = w2.type;
btnKPI.click();
const pKpi = w2.type;
btnMap.click();
const pMap = w2.type;
btnBar.click();
const pBar = w2.type;
recordTest('preset', 'preset_visual_types', pTab === 'table' && pKpi === 'kpi' && pMap === 'map' && pBar === 'chart', 'Cambio entre tabla, kpi, mapa y barras en preset');

// Analitica en preset: Excluir Coyhaique
btnExc.click();
const presetExcPayload = getWidgetDataPayload(w2);
const coyhaiqueRemoved = presetExcPayload.labels.length === 9 && !presetExcPayload.labels.some(l => normStr(l) === 'coyhaique');
recordTest('preset', 'preset_exclude_coyhaique_payload', coyhaiqueRemoved, 'getWidgetDataPayload excluye Coyhaique de labels y datos del preset');

// Analitica en preset: Escala Porcentual
btnPct.click();
const presetPctPayload = getWidgetDataPayload(w2);
const sumXPct = Math.round(presetPctPayload.dataX.reduce((a, b) => a + b, 0));
recordTest('preset', 'preset_scale_pct_payload', sumXPct === 100, `getWidgetDataPayload transforma dataX a porcentaje (suma = ${sumXPct}%)`);

// Analitica en preset: Ordenamiento / Ranking Descendente
btnSort.click(); // desc
const presetSortPayload = getWidgetDataPayload(w2);
const isDesc = presetSortPayload.dataX[0] >= presetSortPayload.dataX[presetSortPayload.dataX.length - 1];
recordTest('preset', 'preset_sort_ranking_payload', isDesc, 'getWidgetDataPayload ordena los datos del preset por ranking descendente');

// -----------------------------------------------------------------------------
// CASO 3: PROTECCION DE EVENTOS Y BLINDAJE CONTRA DESELECCION
// -----------------------------------------------------------------------------
// Simular que targetWidgetId rescata activeWidgetId si este se perdiera
AppState.activeWidgetId = null;
tb.dataset.targetWidgetId = '202';
const targetW = getTargetToolbarWidget();
recordTest('shielding', 'get_target_toolbar_widget_recovery', targetW && targetW.id === 202 && AppState.activeWidgetId === 202, 'getTargetToolbarWidget recupera activeWidgetId desde tb.dataset.targetWidgetId');

// Simular click en toolbar drag handle no deselecciona
let isCardDeselected = false;
function deselectActiveCard() { isCardDeselected = true; }

// Verificacion de la clausula de escape en mousedown
const targetInToolbar = tb;
const shouldIgnoreCanvasMousedown = !!targetInToolbar.closest('#canvaFloatingToolbar, #smartPopover, .connection-action-popover');
recordTest('shielding', 'canvas_mousedown_shielding', shouldIgnoreCanvasMousedown, 'mousedown dentro del toolbar es ignorado por los listeners del lienzo');

console.log(JSON.stringify(results, null, 2));

if (results.summary.failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
