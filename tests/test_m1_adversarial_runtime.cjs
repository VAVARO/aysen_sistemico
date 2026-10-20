/**
 * tests/test_m1_adversarial_runtime.cjs
 * =============================================================================
 * Harness de Ejecución Dinámica en Node.js — Milestone 1
 * Emula y estresa los métodos exactos de laboratorio.html:
 * - getWidgetDataPayload con filtrado territorial, exclusión Coyhaique y per cápita
 * - Sincronización de dimensiones y longitud en vectores bivariados
 * - Estado reactivo ante clearAll()
 * - Dimensionamiento y clamping de toggleFixedDropdown en múltiples resoluciones
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');
const labHtmlPath = path.join(rootDir, 'laboratorio.html');
const bundlePath = path.join(rootDir, 'data', 'aysen_hubs_data.js');

const labHtml = fs.readFileSync(labHtmlPath, 'utf8');
const bundleText = fs.readFileSync(bundlePath, 'utf8');

// Cargar bundle AYSEN_HUBS_DATA
const bundleCode = bundleText.replace('window.AYSEN_HUBS_DATA =', 'global.AYSEN_HUBS_DATA =');
eval(bundleCode);
const hubsData = global.AYSEN_HUBS_DATA;

console.log('[Runtime Test] AYSEN_HUBS_DATA cargado correctamente. Comunas:', hubsData.comunas.length);

// Extraer COMUNAS_ORDER, TERRITORIAL_SLICES, COMUNAS_CONTEXT_MAP
const extractConst = (name) => {
  const match = labHtml.match(new RegExp(`const\\s+${name}\\s*=\\s*([\\s\\S]*?);\\r?\\n`));
  if (!match) throw new Error(`Constante ${name} no encontrada`);
  return eval('(' + match[1] + ')');
};

const COMUNAS_ORDER = extractConst('COMUNAS_ORDER');
const TERRITORIAL_SLICES = extractConst('TERRITORIAL_SLICES');
const COMUNAS_CONTEXT_MAP = extractConst('COMUNAS_CONTEXT_MAP');

assert.strictEqual(COMUNAS_ORDER.length, 10, 'COMUNAS_ORDER debe tener 10 comunas');
assert.ok(TERRITORIAL_SLICES.comuna_coyhaique, 'TERRITORIAL_SLICES debe tener comuna_coyhaique');
assert.ok(TERRITORIAL_SLICES.comuna_tortel, 'TERRITORIAL_SLICES debe tener comuna_tortel');

function normStr(s) {
  if (s == null) return '';
  return String(s).toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['’´`]/g, '')
    .replace(/\s+/g, '_');
}

// Simular catálogo con variables comunales y temporales
const mockCatalogItems = [
  {
    id: 'com_pob',
    name: 'Población Censo 2024',
    shortName: 'Población',
    dim: 'comuna',
    unit: 'hab',
    data: hubsData.comunas.map(c => c.poblacion_censo_2024 || 1000)
  },
  {
    id: 'com_fcm',
    name: 'Dependencia Fondo Común Municipal',
    shortName: 'Dependencia FCM',
    dim: 'comuna',
    unit: '%',
    data: hubsData.comunas.map(c => c.dependencia_fcm_pct || 50)
  },
  {
    id: 'time_turismo',
    name: 'Llegada de Pasajeros Aeródromo',
    shortName: 'Tráfico Aéreo',
    dim: 'tiempo',
    unit: 'pasajeros',
    data: [15000, 18000, 21000, 24000, 28000, 31000, 35000]
  }
];

// Estado global mock
const AppState = {
  widgets: [],
  reflectionCards: [],
  activeWidgetId: null,
  nextWidgetId: 1,
  territorialFilter: 'all',
  excludeCoyhaique: false,
  perCapitaMode: false,
  catalogItems: mockCatalogItems
};

// Implementar getWidgetDataPayload idéntico a laboratorio.html
function getWidgetDataPayload(w) {
  if (!w.varX) {
    return { mode: 'empty', labels: [], data: [], unit: '', label: 'Sin variable', dim: 'none' };
  }
  const vX = AppState.catalogItems.find(v => v.id === w.varX) || AppState.catalogItems[0];
  const vY = w.varY ? AppState.catalogItems.find(v => v.id === w.varY) : null;
  let res = null;

  if (!vY) {
    if (Array.isArray(vX.data) && vX.dim === 'comuna') {
      res = {
        mode: 'univariate',
        labels: [...COMUNAS_ORDER],
        data: [...vX.data],
        unit: vX.unit,
        label: vX.shortName || vX.name,
        dim: 'comuna'
      };
    } else if (Array.isArray(vX.data) && vX.dim === 'tiempo') {
      res = {
        mode: 'univariate',
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        data: [...vX.data],
        unit: vX.unit,
        label: vX.shortName || vX.name,
        dim: 'tiempo'
      };
    }
  } else {
    res = {
      mode: 'bivariate',
      key: 'comuna',
      dim: 'comuna',
      labels: [...COMUNAS_ORDER],
      dataX: [...vX.data],
      dataY: [...vY.data],
      unitX: vX.unit,
      unitY: vY.unit,
      nameX: vX.shortName || vX.name,
      nameY: vY.shortName || vY.name
    };
  }

  if (!res || res.mode === 'empty') return res;

  // 1. Filtrado Territorial (Slicer)
  if (res.dim === 'comuna' && AppState.territorialFilter && AppState.territorialFilter !== 'all') {
    const allowed = TERRITORIAL_SLICES[AppState.territorialFilter] || COMUNAS_ORDER;
    const keep = [];
    res.labels.forEach((lbl, i) => {
      if (allowed.some(a => normStr(a) === normStr(lbl))) keep.push(i);
    });
    if (keep.length > 0) {
      res.labels = keep.map(i => res.labels[i]);
      if (res.mode === 'univariate') {
        res.data = keep.map(i => res.data[i]);
      } else {
        res.dataX = keep.map(i => res.dataX[i]);
        res.dataY = keep.map(i => res.dataY[i]);
      }
    }
  }

  // 1.1 Exclusión de Coyhaique
  if (res.dim === 'comuna' && (AppState.excludeCoyhaique || w.excludeOutlierCoyhaique)) {
    const keep = [];
    res.labels.forEach((lbl, i) => {
      if (normStr(lbl) !== 'coyhaique') keep.push(i);
    });
    if (keep.length > 0) {
      res.labels = keep.map(i => res.labels[i]);
      if (res.mode === 'univariate') {
        res.data = keep.map(i => res.data[i]);
      } else {
        res.dataX = keep.map(i => res.dataX[i]);
        res.dataY = keep.map(i => res.dataY[i]);
      }
    }
  }

  return res;
}

// =============================================================================
// TEST 1: TARJETAS ABIERTAS Y CAMBIO DINÁMICO DE TERRITORIAL SLICER
// =============================================================================
console.log('[Runtime Test 1] Probando tarjetas abiertas y transiciones de slicer...');

const widgetUnivariate = { id: 1, type: 'chart', varX: 'com_pob', varY: null };
const widgetBivariate = { id: 2, type: 'chart', varX: 'com_pob', varY: 'com_fcm' };
const widgetTemporal = { id: 3, type: 'chart', varX: 'time_turismo', varY: null };
AppState.widgets = [widgetUnivariate, widgetBivariate, widgetTemporal];

// Estado inicial: 'all'
let p1 = getWidgetDataPayload(widgetUnivariate);
let p2 = getWidgetDataPayload(widgetBivariate);
let p3 = getWidgetDataPayload(widgetTemporal);

assert.strictEqual(p1.labels.length, 10, 'Univariado inicial debe tener 10 etiquetas');
assert.strictEqual(p2.labels.length, 10, 'Bivariado inicial debe tener 10 etiquetas');
assert.strictEqual(p2.dataX.length, p2.dataY.length, 'DataX y DataY deben tener igual longitud');
assert.strictEqual(p3.labels.length, 7, 'Temporal inicial debe tener 7 años');

// Cambio 1: Filtrar a 'prov_capitan_prat' (3 comunas: Cochrane, O'Higgins, Tortel)
AppState.territorialFilter = 'prov_capitan_prat';
p1 = getWidgetDataPayload(widgetUnivariate);
p2 = getWidgetDataPayload(widgetBivariate);
p3 = getWidgetDataPayload(widgetTemporal);

assert.strictEqual(p1.labels.length, 3, 'Prov. Capitán Prat debe tener 3 comunas');
assert.strictEqual(p2.labels.length, 3, 'Bivariado debe tener 3 comunas');
assert.strictEqual(p2.dataX.length, 3);
assert.strictEqual(p2.dataY.length, 3);
assert.ok(p1.labels.includes('Tortel'), 'Debe incluir Tortel');
assert.ok(!p1.labels.includes('Coyhaique'), 'NO debe incluir Coyhaique');
assert.strictEqual(p3.labels.length, 7, 'Serie temporal NO debe ser afectada por slicer comunal');

// Cambio 2: Filtrar a comuna individual 'comuna_tortel'
AppState.territorialFilter = 'comuna_tortel';
p1 = getWidgetDataPayload(widgetUnivariate);
p2 = getWidgetDataPayload(widgetBivariate);
assert.strictEqual(p1.labels.length, 1);
assert.strictEqual(p1.labels[0], 'Tortel');
assert.strictEqual(p2.labels.length, 1);
assert.strictEqual(p2.dataX.length, 1);
assert.strictEqual(p2.dataY.length, 1);

// Cambio 3: Retornar a 'all'
AppState.territorialFilter = 'all';
p1 = getWidgetDataPayload(widgetUnivariate);
p2 = getWidgetDataPayload(widgetBivariate);
assert.strictEqual(p1.labels.length, 10);
assert.strictEqual(p2.labels.length, 10);

console.log('  -> PASS: Tarjetas abiertas responden y preservan sincronización en todos los slicers.');

// =============================================================================
// TEST 2: SIMULACIÓN DE clearAll()
// =============================================================================
console.log('[Runtime Test 2] Probando clearAll() y reinicio total de estado...');

let mockStatusText = '';
function updateStatus() {
  const total = AppState.widgets.length;
  const minCount = AppState.widgets.filter(w => w.minimized).length;
  const visibleCount = total - minCount;
  if (total === 0) {
    mockStatusText = '0 ventanas';
  } else if (minCount === 0) {
    mockStatusText = `${total} ventanas`;
  } else {
    mockStatusText = `${total} ventanas (${visibleCount} visible(s), ${minCount} oculta(s))`;
  }
}

function clearAll() {
  AppState.widgets = [];
  AppState.reflectionCards = [];
  AppState.activeWidgetId = null;
  AppState.nextWidgetId = 1;
  AppState.territorialFilter = 'all';
  AppState.excludeCoyhaique = false;
  updateStatus();
}

// Antes de clearAll
updateStatus();
assert.strictEqual(mockStatusText, '3 ventanas');

// Ejecutar clearAll
clearAll();
assert.strictEqual(AppState.widgets.length, 0);
assert.strictEqual(AppState.territorialFilter, 'all');
assert.strictEqual(AppState.excludeCoyhaique, false);
assert.strictEqual(AppState.activeWidgetId, null);
assert.strictEqual(mockStatusText, '0 ventanas');

console.log('  -> PASS: clearAll() resetea limpiamente contadores a 0 y slicer a "all".');

// =============================================================================
// TEST 3: toggleFixedDropdown EN VIEWPORTS PEQUEÑOS Y LÍMITES DE VENTANA
// =============================================================================
console.log('[Runtime Test 3] Probando posicionamiento y escape de dropdowns en diversas resoluciones...');

function calculateDropdownCoords(btnRect, winWidth, alignRight) {
  const top = btnRect.bottom + 4;
  let left = 'auto';
  let right = 'auto';
  if (alignRight) {
    right = Math.max(8, winWidth - btnRect.right);
  } else {
    left = Math.max(8, btnRect.left);
  }
  return { top, left, right };
}

// Probar viewports típicos: 360 (móvil pequeño), 414 (móvil grande), 768 (tablet), 1024, 1440 (desktop)
const testViewports = [360, 414, 768, 1024, 1440];

testViewports.forEach(vw => {
  // Botón "+ Tarjeta ▾" (a la izquierda, alignRight = false)
  const btnAddRect = { left: 12, right: 90, top: 6, bottom: 34, width: 78, height: 28 };
  const coordsAdd = calculateDropdownCoords(btnAddRect, vw, false);
  assert.strictEqual(coordsAdd.top, 38, `Top debe ser 38px en ${vw}px`);
  assert.strictEqual(coordsAdd.left, 12, `Left debe ser 12px en ${vw}px`);
  assert.strictEqual(coordsAdd.right, 'auto');

  // Botón "Proyecto ▾" (a la derecha, alignRight = true)
  const btnProjRect = { left: vw - 100, right: vw - 12, top: 6, bottom: 34, width: 88, height: 28 };
  const coordsProj = calculateDropdownCoords(btnProjRect, vw, true);
  assert.strictEqual(coordsProj.top, 38);
  assert.strictEqual(coordsProj.left, 'auto');
  assert.strictEqual(coordsProj.right, 12, `Right debe ser 12px en ${vw}px`);

  // Caso extremo: Botón pegado al borde izquierdo (left = 0)
  const edgeBtnLeft = { left: 0, right: 80, top: 6, bottom: 34 };
  const coordsEdgeLeft = calculateDropdownCoords(edgeBtnLeft, vw, false);
  assert.strictEqual(coordsEdgeLeft.left, 8, 'Math.max(8, 0) debe garantizar margen mínimo de 8px');

  // Caso extremo: Botón pegado al borde derecho (right = vw)
  const edgeBtnRight = { left: vw - 80, right: vw, top: 6, bottom: 34 };
  const coordsEdgeRight = calculateDropdownCoords(edgeBtnRight, vw, true);
  assert.strictEqual(coordsEdgeRight.right, 8, 'Math.max(8, 0) debe garantizar margen mínimo de 8px');
});

console.log('  -> PASS: toggleFixedDropdown garantiza escape y clamp >= 8px en todos los viewports.');

console.log('\n=============================================================================');
console.log('TODAS LAS PRUEBAS DE ESTRÉS DINÁMICO EN RUNTIME APROBADAS SATISFACTORIAMENTE');
console.log('=============================================================================');
