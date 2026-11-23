#!/usr/bin/env node
/**
 * tests/test_mobile_fiordos_and_curated_discoveries.cjs
 * ============================================================================
 * Suite Automatizada de Verificación para:
 *   1. Motor Python Multicriterio — 25 Hallazgos Curados (`scripts/precompute_curated_discoveries.py` -> `data/aysen_hallazgos_precalculados.js`) + 10 comunas DashAI.
 *   2. Menú Móvil Universal en `js/cabecera_global.js` (`#btnMobileMenu`, `#btnMobileClose`, `#mobileNavBackdrop`).
 *   3. Responsividad Móvil de `sistemas_complejos.html` (`mobileScale`, `.prop-stepper` 1 fila, `touch-action: pan-y`).
 *   4. Responsividad Móvil de `laboratorio.html` (`#heroEmptyCanvas` `position: relative !important; transform: none !important;`, `#canvasZoomHud`, `isStackedLayout()`).
 *   5. Zoom y Visibilidad de Fiordos en el Mapa de Concesiones (`wheel` excluye `.map-container-box, .leaflet-container`, `L.DomEvent.disableScrollPropagation`, `zoomend` baja `fillOpacity` a `0.04` y conmutador de mapa base con relieve de fiordos).
 *   6. Galería Visual de 25 Hallazgos en `laboratorio.html` (`data/aysen_hallazgos_precalculados.js`, `#btnOpenDiscoveriesDrawer`, barras visuales `R²%` y carga con recta de regresión lineal `showTrend: true`).
 */

'use strict';

const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

function runTest1PythonMulticriteriaDiscoveries() {
  console.log('--- Test 1: Motor Python Multicriterio — 25 Hallazgos Curados y 10 Radiografías Comunales ---');
  const pyScript = path.join(ROOT_DIR, 'scripts', 'precompute_curated_discoveries.py');
  assert.ok(fs.existsSync(pyScript), 'Falta scripts/precompute_curated_discoveries.py');

  execSync('python scripts/precompute_curated_discoveries.py', {
    cwd: ROOT_DIR,
    stdio: 'pipe'
  });

  const outPath = path.join(ROOT_DIR, 'data', 'aysen_hallazgos_precalculados.js');
  assert.ok(fs.existsSync(outPath), 'No se generó data/aysen_hallazgos_precalculados.js');

  delete require.cache[require.resolve(outPath)];
  const bundle = require(outPath);
  assert.ok(bundle && Array.isArray(bundle.curatedDiscoveries), 'Falta curatedDiscoveries en AYSEN_DISCOVERIES_DATA');
  assert.strictEqual(bundle.curatedDiscoveries.length, 25, `Se esperaban 25 hallazgos, encontrados: ${bundle.curatedDiscoveries.length}`);

  const crossCount = bundle.curatedDiscoveries.filter(d => d.category === 'cruce_comunal_oculto').length;
  const tempCount = bundle.curatedDiscoveries.filter(d => d.category === 'acoplamiento_temporal_2015_2026').length;
  assert.strictEqual(crossCount, 20, `Se esperaban 20 hallazgos transversales inter-Hubs, encontrados: ${crossCount}`);
  assert.strictEqual(tempCount, 5, `Se esperaban 5 hallazgos longitudinales 2015-2026, encontrados: ${tempCount}`);

  const snakeCaseRe = /\b[a-z0-9]+_[a-z0-9_]+\b/;
  bundle.curatedDiscoveries.forEach((d, idx) => {
    assert.strictEqual(d.id, `disc_${String(idx + 1).padStart(2, '0')}`);
    assert.notStrictEqual(d.hubX, d.hubY, `El hallazgo ${d.id} debe conectar dos Hubs distintos (${d.hubX} vs ${d.hubY})`);
    assert.ok(d.regressionLine && typeof d.regressionLine.slopeBeta1 === 'number', `Falta slopeBeta1 en ${d.id}`);
    assert.ok(d.regressionLine && typeof d.regressionLine.interceptBeta0 === 'number', `Falta interceptBeta0 en ${d.id}`);
    assert.ok(d.statProofBadges, `Faltan statProofBadges en ${d.id}`);

    const st = d.statProofBadges;
    ['pearsonR', 'spearmanRho', 'partialCorrPop', 'rWithoutCoyhaique', 'pValueFdr'].forEach(k => {
      assert.strictEqual(typeof st[k], 'number', `La prueba ${k} debe ser numérica en ${d.id}`);
    });
    assert.ok(st.pValueFdr < 0.05, `El hallazgo ${d.id} debe tener pValueFdr < 0.05 (obtenido: ${st.pValueFdr})`);
    assert.ok(Math.abs(st.partialCorrPop) >= 0.65, `El hallazgo ${d.id} debe tener |partialCorrPop| >= 0.65 (obtenido: ${st.partialCorrPop})`);
    assert.ok(Math.abs(st.rWithoutCoyhaique) >= 0.65, `El hallazgo ${d.id} debe tener |rWithoutCoyhaique| >= 0.65 (obtenido: ${st.rWithoutCoyhaique})`);
    assert.ok(typeof d.plainExplanation === 'string' && d.plainExplanation.length > 40, `Falta plainExplanation en ${d.id}`);
    assert.ok(!snakeCaseRe.test(d.plainExplanation), `plainExplanation contiene snake_case en ${d.id}: ${d.plainExplanation}`);
  });

  assert.ok(bundle.comunasExplain && typeof bundle.comunasExplain === 'object', 'Falta comunasExplain');
  const comunaKeys = Object.keys(bundle.comunasExplain);
  assert.strictEqual(comunaKeys.length, 10, `Se esperaban 10 comunas en comunasExplain, encontradas: ${comunaKeys.length}`);
  comunaKeys.forEach(cName => {
    const info = bundle.comunasExplain[cName];
    assert.strictEqual(info.topAboveRegionalMean.length, 5, `${cName} debe tener 5 indicadores sobre la media regional`);
    assert.strictEqual(info.topBelowRegionalMean.length, 5, `${cName} debe tener 5 indicadores bajo la media regional`);
    assert.strictEqual(info.twinComunas.length, 2, `${cName} debe tener 2 comunas gemelas`);
  });

  console.log('  [PASS] Test 1: 25 hallazgos curados (5 pruebas estadísticas superadas) y 10 radiografías comunales verificadas.');
}

function runTest2UniversalMobileNav() {
  console.log('--- Test 2: Menú Móvil Universal en js/cabecera_global.js ---');
  const src = fs.readFileSync(path.join(ROOT_DIR, 'js', 'cabecera_global.js'), 'utf8');
  assert.ok(src.includes("getElementById('btnMobileMenu')"), 'Falta búsqueda de #btnMobileMenu en cabecera_global.js');
  assert.ok(src.includes("getElementById('mobileNavDrawer')"), 'Falta búsqueda de #mobileNavDrawer en cabecera_global.js');
  assert.ok(src.includes("getElementById('btnMobileClose')"), 'Falta búsqueda de #btnMobileClose en cabecera_global.js');
  assert.ok(src.includes("getElementById('mobileNavBackdrop')"), 'Falta búsqueda de #mobileNavBackdrop en cabecera_global.js');
  assert.ok(src.includes("btnMobileMenu.addEventListener('click', openMobileNav)"), 'Falta listener click en btnMobileMenu');
  assert.ok(src.includes("btnMobileClose.addEventListener('click', closeMobileNav)"), 'Falta listener click en btnMobileClose');
  assert.ok(src.includes("mobileNavBackdrop.addEventListener('click', closeMobileNav)"), 'Falta listener click en mobileNavBackdrop');
  console.log('  [PASS] Test 2: Menú hamburguesa móvil conectado universalmente en js/cabecera_global.js.');
}

function runTest3SistemasComplejosMobile() {
  console.log('--- Test 3: Responsividad Móvil de sistemas_complejos.html ---');
  const html = fs.readFileSync(path.join(ROOT_DIR, 'sistemas_complejos.html'), 'utf8');
  assert.ok(
    html.includes('const mobileScale = rawW < 560 ? Math.max(0.54, rawW / 640) : 1;'),
    'Falta escalado virtual mobileScale en renderScene() de sistemas_complejos.html'
  );
  assert.ok(
    html.includes('ctx.scale(mobileScale, mobileScale)'),
    'Falta ctx.scale(mobileScale, mobileScale) en renderScene()'
  );
  assert.ok(
    html.includes('flex-wrap: nowrap !important;') && html.includes('overflow-x: auto !important;'),
    'Falta stepper horizontal de 1 fila en @media (max-width: 768px)'
  );
  assert.ok(
    html.includes('height: 270px !important;') && html.includes('min-height: 270px !important;'),
    'Falta altura explícita de 270px en .stage-viewport para móvil'
  );
  assert.ok(
    html.includes('touch-action: pan-y;'),
    'Falta touch-action: pan-y en #sceneCanvas'
  );
  assert.ok(
    html.includes('if (Math.abs(dx) > Math.abs(dy))'),
    'Falta condición Math.abs(dx) > Math.abs(dy) en touchmove de #sceneCanvas para permitir scroll vertical'
  );
  console.log('  [PASS] Test 3: Escalado virtual, stepper de 1 fila y scroll táctil vertical verificados en sistemas_complejos.html.');
}

function runTest4LaboratorioMobile() {
  console.log('--- Test 4: Responsividad Móvil de laboratorio.html ---');
  const html = fs.readFileSync(path.join(ROOT_DIR, 'laboratorio.html'), 'utf8');
  assert.ok(
    html.includes('position: relative !important;') &&
    html.includes('transform: none !important;') &&
    html.includes('.hero-hubs-launcher-grid'),
    'Falta rediseño scrolleable de #heroEmptyCanvas (.hero-studio-card) en <= 768px'
  );
  assert.ok(
    html.includes('#canvasZoomHud {\n        display: none !important;\n      }'),
    'Falta ocultamiento de #canvasZoomHud en móvil'
  );
  assert.ok(
    html.includes("window.addEventListener('touchmove', (e) => {\n          if (isStackedLayout()) return;"),
    'Falta guardia if (isStackedLayout()) return; en window.addEventListener(touchmove)'
  );
  assert.ok(
    html.includes("tb.style.bottom = '54px';") && html.includes("tb.style.width = 'calc(100vw - 16px)';"),
    'Falta anclaje inferior móvil de #canvaFloatingToolbar en updateFloatingToolbarPosition()'
  );
  console.log('  [PASS] Test 4: Tarjeta hero scrolleable, touchmove y barra flotante móvil verificados en laboratorio.html.');
}

function runTest5LeafletZoomAndFiordosVisibility() {
  console.log('--- Test 5: Zoom y Visibilidad de Fiordos en el Mapa de Concesiones (laboratorio.html) ---');
  const html = fs.readFileSync(path.join(ROOT_DIR, 'laboratorio.html'), 'utf8');
  assert.ok(
    html.includes("if (e.target.closest('.map-container-box, .leaflet-container'))"),
    'El listener wheel del lienzo 2D no excluye .map-container-box, .leaflet-container'
  );
  assert.ok(
    html.includes('L.DomEvent.disableScrollPropagation(mapBoxEl)') &&
    html.includes('L.DomEvent.disableClickPropagation(mapBoxEl)'),
    'Falta L.DomEvent.disableScrollPropagation / disableClickPropagation en el contenedor del mapa'
  );
  assert.ok(
    html.includes("map.on('zoomend'") && html.includes('fillOpacity: isSelected ? 0.12 : 0.04'),
    'Falta atenuación automática fillOpacity: 0.04 sobre fiordos al hacer zoom o en modo acuícola'
  );
  assert.ok(
    html.includes('maxNativeZoom: 18') &&
    html.includes('World_Topo_Map/MapServer/tile/{z}/{y}/{x}') &&
    html.includes('Fiordos &amp; Relieve'),
    'Falta conmutador de mapa base con relieve de fiordos (World_Topo_Map) y maxNativeZoom: 18'
  );
  console.log('  [PASS] Test 5: Aislamiento de zoom, transparencia sobre fiordos (0.04) y mapa base de relieve verificados.');
}

function runTest6CuratedDiscoveriesGalleryUI() {
  console.log('--- Test 6: Galería Visual de 25 Hallazgos y Recta de Regresión en laboratorio.html ---');
  const html = fs.readFileSync(path.join(ROOT_DIR, 'laboratorio.html'), 'utf8');
  assert.ok(
    html.includes('<script src="data/aysen_hallazgos_precalculados.js" defer></script>'),
    'laboratorio.html no carga data/aysen_hallazgos_precalculados.js'
  );
  assert.ok(
    html.includes('id="btnOpenDiscoveriesDrawer"'),
    'Falta botón #btnOpenDiscoveriesDrawer en la barra superior de laboratorio.html'
  );
  assert.ok(
    html.includes('id="btnExplainCard-${w.id}"'),
    'Falta botón #btnExplainCard-${w.id} en las tarjetas del Laboratorio'
  );
  assert.ok(
    html.includes('id="modalCuratedDiscoveries"') &&
    html.includes('discovery-r2-bar') &&
    html.includes('Graficar con Recta de Regresión →'),
    'Falta modal #modalCuratedDiscoveries con barras R²% y botón Graficar con Recta de Regresión'
  );
  assert.ok(
    html.includes('function loadCuratedDiscoveryIntoCanvas') &&
    html.includes('showTrend: true') &&
    html.includes('showAverage: true'),
    'loadCuratedDiscoveryIntoCanvas no activa showTrend: true y showAverage: true'
  );
  console.log('  [PASS] Test 6: Galería de 25 hallazgos, barras R²% y carga con recta de regresión verificadas en laboratorio.html.');
}

function main() {
  runTest1PythonMulticriteriaDiscoveries();
  runTest2UniversalMobileNav();
  runTest3SistemasComplejosMobile();
  runTest4LaboratorioMobile();
  runTest5LeafletZoomAndFiordosVisibility();
  runTest6CuratedDiscoveriesGalleryUI();
  console.log('\n[test_mobile_fiordos_and_curated_discoveries] 6/6 TESTS PASARON AL 100%.');
}

main();
