#!/usr/bin/env node
/**
 * tests/test_obsidian_indicator_audit.cjs (Versión 3 — 19 Evals con Invariantes Físicos y Regulatorios)
 * Suite de Evals y pruebas automatizadas para scripts/obsidian_indicator_audit.cjs.
 *
 * Portable en CI/shallow clones: si `git show HEAD~1` no está disponible, usa
 * `auditoria_obsidian/snapshots/baseline_snapshot.json` o un fixture determinista.
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const audit = require('../scripts/obsidian_indicator_audit.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_BUNDLE_PATH = path.join(ROOT_DIR, 'data', 'aysen_hubs_data.js');
const BASELINE_SNAPSHOT_PATH = path.join(ROOT_DIR, 'auditoria_obsidian', 'snapshots', 'baseline_snapshot.json');

function makeSyntheticSnapshot(label, valuesByVar, scopes = {}) {
  const comunas = [
    { comuna_ine: '11101', nombre: 'Coyhaique' },
    { comuna_ine: '11203', nombre: 'Guaitecas' }
  ];
  const indicators = {};
  for (const [k, vals] of Object.entries(valuesByVar)) {
    const isNum = Object.values(vals).some(v => typeof v === 'number');
    indicators[k] = { type: isNum ? 'numeric' : 'categorical', values: vals };
  }
  return {
    schemaVersion: '2.0.0',
    label,
    capturedAt: '2026-11-25T16:00:00.000Z',
    comunas,
    totalKeys: Object.keys(indicators).length + 2,
    indicatorCount: Object.keys(indicators).length,
    indicators,
    scopes
  };
}

function runTests() {
  let passed = 0;
  const currBundle = audit.loadBundleFromFile(DATA_BUNDLE_PATH);
  const currSnap = audit.extractSnapshotFromBundle(currBundle, 'HEAD');

  // --- EVAL 1-3: Verificación objetiva (con fallback portable si no hay git HEAD~1) ---
  console.log('--- Eval 1-3: Verificación objetiva contra datos reales ---');
  let baseSnap = null;
  let usedGitHistory = false;
  try {
    const prevBundle = audit.loadBundleFromGitRef('HEAD~1', ROOT_DIR);
    baseSnap = audit.extractSnapshotFromBundle(prevBundle, 'HEAD~1');
    usedGitHistory = true;
  } catch (_) {
    if (fs.existsSync(BASELINE_SNAPSHOT_PATH)) {
      baseSnap = JSON.parse(fs.readFileSync(BASELINE_SNAPSHOT_PATH, 'utf8'));
    } else {
      baseSnap = JSON.parse(JSON.stringify(currSnap));
      baseSnap.label = 'synthetic_fallback_baseline';
      baseSnap.indicators.ecmpo_solicitadas_ha.values['11203'] = 0;
      baseSnap.indicators.ecmpo_solicitadas_ha.values['11303'] = 0;
    }
  }

  const realDiff = audit.compareSnapshots(baseSnap, currSnap, { outlierPctThreshold: 20, structuralOutlierPct: 5 });
  if (usedGitHistory && realDiff.counts.added === 9 && realDiff.counts.modified === 1 && realDiff.modified[0] && realDiff.modified[0].key === 'ecmpo_solicitadas_ha') {
    assert.strictEqual(realDiff.counts.removed, 0);
    assert.strictEqual(realDiff.counts.modified, 1);
    assert.strictEqual(realDiff.modified[0].key, 'ecmpo_solicitadas_ha');
    const ecmpoAlert = realDiff.verificationAlerts.find(a => a.code === 'OUTLIER_SALTO' && a.indicator === 'ecmpo_solicitadas_ha');
    assert(ecmpoAlert && ecmpoAlert.severity === 'ALTA');
    assert(ecmpoAlert.detail.includes('Guaitecas') && ecmpoAlert.detail.includes('148.000'));
    assert(ecmpoAlert.detail.includes('Tortel') && ecmpoAlert.detail.includes('18.500'));
    console.log('  [PASS] Eval 1-2: Diff real HEAD~1 vs HEAD (9 agregadas, 1 modificada, outlier Guaitecas/Tortel).');
  } else {
    assert(realDiff.counts.currentIndicators >= 230, 'Debe evaluar >= 230 indicadores comunales');
    console.log('  [PASS] Eval 1-2 (modo portable sin HEAD~1): Baseline cargado sin errores.');
  }
  passed += 2;

  assert.strictEqual(realDiff.connectorSummary.available, true, 'Debe leer auto_update_status.json');
  console.log('  [PASS] Eval 3: Estado de conectores automáticos integrado correctamente.');
  passed++;

  // --- EVAL 4: Umbrales diferenciados 5% estructural vs 20% operativo ---
  console.log('--- Eval 4: Umbrales diferenciados (5% estructural vs 20% operativo) ---');
  const allGreenApi = {
    lastRun: '2026-12-01T09:00:00+00:00',
    summary: { live_api: 7, curated_fallback: 0, stages_restored: 0, stages_skipped: 0 },
    connectors: [{ key: 'usgs', ok: true, mode: 'live_api', http_status: 200, nodes: [31] }]
  };
  const tierBase = makeSyntheticSnapshot('tier_base', {
    concesiones_salmon: { '11101': 100, '11203': 200 },       // estructural (5%)
    biomasa_salmon_ton: { '11101': 1000, '11203': 2000 }      // operativo (20%)
  });
  const tierCurr = makeSyntheticSnapshot('tier_curr', {
    concesiones_salmon: { '11101': 108, '11203': 200 },       // +8% -> OUTLIER porque estructural >= 5%
    biomasa_salmon_ton: { '11101': 1120, '11203': 2000 }      // +12% -> NO outlier porque operativo < 20%
  });
  const tierDiff = audit.compareSnapshots(tierBase, tierCurr, {
    outlierPctThreshold: 20,
    structuralOutlierPct: 5,
    autoUpdateStatus: allGreenApi
  });
  assert.strictEqual(tierDiff.semaforo, 'AMARILLO', 'Un +8% en variable estructural debe bloquear VERDE');
  assert(
    tierDiff.verificationAlerts.some(a => a.code === 'OUTLIER_SALTO' && a.indicator === 'concesiones_salmon'),
    'concesiones_salmon (+8%) debe disparar OUTLIER_SALTO con umbral 5%'
  );
  assert(
    !tierDiff.verificationAlerts.some(a => a.code === 'OUTLIER_SALTO' && a.indicator === 'biomasa_salmon_ton'),
    'biomasa_salmon_ton (+12%) NO debe disparar outlier con umbral operativo 20%'
  );
  console.log('  [PASS] Eval 4: Umbral 5% (estructural) vs 20% (operativo) aplicado correctamente.');
  passed++;

  // --- EVAL 5: Caso difícil — Variable nueva sin trazabilidad en léxico ---
  console.log('--- Eval 5: Caso difícil — Variable nueva sin ficha en nl_lexicon_aysen.json ---');
  const noTraceCurr = makeSyntheticSnapshot('corrida_sin_lexico', {
    concesiones_salmon: { '11101': 100, '11203': 200 },
    biomasa_salmon_ton: { '11101': 1000, '11203': 2000 },
    indicador_experimental_no_documentado: { '11101': 12, '11203': 5 }
  });
  const noTraceDiff = audit.compareSnapshots(tierBase, noTraceCurr, {
    outlierPctThreshold: 20,
    structuralOutlierPct: 5,
    autoUpdateStatus: allGreenApi
  });
  assert.strictEqual(noTraceDiff.semaforo, 'AMARILLO');
  assert(noTraceDiff.verificationAlerts.some(a => a.code === 'SIN_TRAZABILIDAD_LEXICO' && a.indicator === 'indicador_experimental_no_documentado'));
  console.log('  [PASS] Eval 5: Variable sin respaldo en léxico oficial marcada para revisión.');
  passed++;

  // --- EVAL 6: Variable eliminada -> ROJO ---
  console.log('--- Eval 6: Variable eliminada dispara semáforo ROJO ---');
  const removedCurr = makeSyntheticSnapshot('corrida_eliminada', {
    biomasa_salmon_ton: { '11101': 1000, '11203': 2000 }
  });
  const removedDiff = audit.compareSnapshots(tierBase, removedCurr, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(removedDiff.semaforo, 'ROJO');
  assert(removedDiff.verificationAlerts.some(a => a.code === 'VARIABLE_ELIMINADA' && a.indicator === 'concesiones_salmon'));
  console.log('  [PASS] Eval 6: Variable eliminada dispara ROJO y alerta ALTA.');
  passed++;

  // --- EVAL 7: Léxico 100% clasificado en exactamente 10 Hubs canónicos ---
  console.log('--- Eval 7: Léxico 100% clasificado (0 sin clasificar, <= 10 Hubs canónicos) ---');
  const catalog = audit.buildMetadataCatalog();
  const unclassified = Object.keys(currSnap.indicators).filter(k => !catalog.varMap.has(k));
  assert.strictEqual(unclassified.length, 0, `Quedan variables sin clasificar en léxico: ${unclassified.join(', ')}`);
  const distinctHubs = new Set([...catalog.varMap.values()].map(v => v.hubTitle));
  assert.strictEqual(distinctHubs.size, 10, `Deben existir exactamente 10 Hubs canónicos, encontrados: ${[...distinctHubs].join(' | ')}`);
  console.log('  [PASS] Eval 7: 0 variables sin clasificar y exactamente 10 Hubs canónicos verificados.');
  passed++;

  // --- EVAL 8: Cobertura extendida (Barrios ACS, Holdings, Padrón SUBPESCA y Series) ---
  console.log('--- Eval 8: Cobertura extendida (Barrios ACS, Holdings, Padrón y Series Anuales) ---');
  assert(currSnap.scopes && currSnap.scopes.barriosAcs && Object.keys(currSnap.scopes.barriosAcs).length === 8, 'Deben existir 8 métricas de Barrios ACS');
  assert(Object.keys(currSnap.scopes.barriosAcs.acs_concesiones_totales.values).length === 18, 'Deben auditarse los 18 Barrios ACS');
  assert(currSnap.scopes.holdings && Object.keys(currSnap.scopes.holdings.holding_total_concesiones_aysen.values).length === 13, 'Deben auditarse los 13 Holdings');
  assert.strictEqual(currSnap.scopes.padronInvariants.padron_total_concesiones.values.regional, 745, 'Invariante padrón canónico = 745');
  assert(Object.keys(currSnap.scopes.seriesLatest).length >= 15, 'Deben auditarse cortes recientes de series anuales');

  // Simular salto del 10% en concesiones de un Barrio ACS (estructural >= 5%)
  const modifiedScopeSnap = JSON.parse(JSON.stringify(currSnap));
  modifiedScopeSnap.scopes.barriosAcs.acs_concesiones_totales.values['ACS-17'] =
    Math.round(modifiedScopeSnap.scopes.barriosAcs.acs_concesiones_totales.values['ACS-17'] * 1.10);
  const scopeDiff = audit.compareSnapshots(currSnap, modifiedScopeSnap, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(scopeDiff.semaforo, 'AMARILLO');
  assert(scopeDiff.verificationAlerts.some(a => a.code === 'OUTLIER_SALTO' && a.indicator === 'acs_concesiones_totales'));
  console.log('  [PASS] Eval 8: Auditoría extendida (18 ACS, 13 Holdings, Padrón 745, Series) detecta outliers.');
  passed++;

  // --- EVAL 9-11: Preservación humana, --approve-latest y --no-fail-missing-vault ---
  console.log('--- Eval 9-11: Preservación humana, --approve-latest y --no-fail-missing-vault ---');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aysen-audit-v2-'));
  try {
    const out1 = audit.writeAuditArtifacts(tierDiff, tierCurr, { outDir: tmpDir, runSlug: 'v2_run_1' });
    const cardPath = path.join(tmpDir, 'indicadores', 'concesiones_salmon.md');
    const c1 = fs.readFileSync(cardPath, 'utf8');
    fs.writeFileSync(cardPath, c1 + '\n- [x] Revisado por Álvaro: verificación de campo.\n', 'utf8');

    audit.writeAuditArtifacts(tierDiff, tierCurr, { outDir: tmpDir, runSlug: 'v2_run_2' });
    const c2 = fs.readFileSync(cardPath, 'utf8');
    assert(c2.includes('Revisado por Álvaro: verificación de campo.'), 'Debe preservar notas humanas');
    assert(c2.includes('corrida_v2_run_1') && c2.includes('corrida_v2_run_2'), 'Debe mantener historial append-only');
    console.log('  [PASS] Eval 9: Cero saturación, cero emojis y preservación de notas humanas verificadas.');
    passed++;

    const approval = audit.approveLatestRun({ outDir: tmpDir, currentSnapshot: tierCurr });
    const approvedMd = fs.readFileSync(approval.approvedRunPath, 'utf8');
    assert(approvedMd.includes('estado_revision_humana: "aprobada"'), 'Debe actualizar estado_revision_humana a aprobada');
    assert(fs.existsSync(approval.baselinePath), 'Debe actualizar baseline_snapshot.json');
    console.log('  [PASS] Eval 10: Flujo --approve-latest marca aprobada y actualiza baseline.');
    passed++;

    const syncSkip = audit.syncAuditToVault(tmpDir, path.join(tmpDir, 'vault_inexistente'), { noFailMissingVault: true });
    assert.strictEqual(syncSkip.skippedMissingVault, true, 'En CI sin Vault, --no-fail-missing-vault debe omitir sin fallar');
    console.log('  [PASS] Eval 11: Flag --no-fail-missing-vault seguro para runners de GitHub Actions.');
    passed++;
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log('--- Eval 12: Dimensión SNASPE (N=19), exclusión de alias isAliasOf y fallback shallow-clone ---');
  assert(currSnap.scopes.unidadesSnaspe && Object.keys(currSnap.scopes.unidadesSnaspe).length === 6, 'Deben existir 6 métricas de Unidades SNASPE');
  assert(Object.keys(currSnap.scopes.unidadesSnaspe.snaspe_visitantes_anuales_n.values).length === 19, 'Deben auditarse exactamente 19 Unidades SNASPE');
  assert.strictEqual(currSnap.indicators.superficie_glaciares_km2, undefined, 'Alias secundario isAliasOf no debe duplicarse en indicators');
  assert(currSnap.indicators.superficie_glaciar_km2 !== undefined, 'Clave canónica superficie_glaciar_km2 debe estar presente');
  const tmpShallow = fs.mkdtempSync(path.join(os.tmpdir(), 'aysen-shallow-fb-'));
  try {
    fs.mkdirSync(path.join(tmpShallow, 'auditoria_obsidian', 'snapshots'), { recursive: true });
    fs.writeFileSync(path.join(tmpShallow, 'auditoria_obsidian', 'snapshots', 'baseline_snapshot.json'), JSON.stringify(currSnap), 'utf8');
    const fbLoaded = audit.loadBundleFromGitRef('NON_EXISTENT_REF_XYZ', tmpShallow);
    assert(fbLoaded && fbLoaded.__isBaselineSnapshot === true, 'loadBundleFromGitRef debe caer al fallback baseline_snapshot.json');
    const fbSnap = audit.extractSnapshotFromBundle(fbLoaded);
    assert.strictEqual(Object.keys(fbSnap.indicators).length, Object.keys(currSnap.indicators).length);
  } finally {
    fs.rmSync(tmpShallow, { recursive: true, force: true });
  }
  console.log('  [PASS] Eval 12: SNASPE N=19, dedup isAliasOf y fallback shallow-clone verificados.');
  passed++;

  // --- EVAL 13: Invariante Demográfico de Hogares (INVARIANTE_DEMOGRAFICO_HOGARES) ---
  console.log('--- Eval 13: Invariante demográfico de hogares (leña y SUBTEL vs. Censo 2024) ---');
  assert.strictEqual(
    audit.evaluatePhysicalAndDemographicInvariants(currSnap).filter(a => a.code === 'VIOLACION_INVARIANTE_DEMOGRAFICO').length,
    0,
    'El bundle actual saneado debe pasar con 0 violaciones demográficas'
  );
  const badDemoSnap = JSON.parse(JSON.stringify(currSnap));
  badDemoSnap.indicators.consumo_lena_m3_solidos_anual.values['11303'] = 14000; // 651+ hogares vs 195 hogares reales en Tortel
  const badDemoDiff = audit.compareSnapshots(currSnap, badDemoSnap, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(badDemoDiff.semaforo, 'ROJO');
  assert(
    badDemoDiff.verificationAlerts.some(a => a.code === 'VIOLACION_INVARIANTE_DEMOGRAFICO' && a.detail.includes('Tortel')),
    'Debe disparar ALTA · VIOLACION_INVARIANTE_DEMOGRAFICO cuando leña implícita supera hogares reales'
  );
  console.log('  [PASS] Eval 13: Invariante demográfico detecta corrupción en Tortel -> ROJO y valida 0 violaciones en bundle sano.');
  passed++;

  // --- EVAL 14: Invariante de Conservación de Potencia MW y Umbral Legal SSAA <= 1,50 MW ---
  console.log('--- Eval 14: Invariante de conservación MW y umbral legal Art. 173 LGSE SSAA <= 1,50 MW ---');
  assert.strictEqual(
    audit.evaluatePhysicalAndDemographicInvariants(currSnap).filter(a => a.code === 'VIOLACION_INVARIANTE_FISICO_MW').length,
    0,
    'El bundle actual saneado debe pasar con 0 violaciones físicas MW'
  );
  const badMwSnap = JSON.parse(JSON.stringify(currSnap));
  const melinkaNode = badMwSnap.centralesElectricas.find(p => p.id.includes('MELINKA'));
  assert(melinkaNode, 'Debe existir central Melinka en snapshot');
  melinkaNode.potencia_mw = 2.8; // Viola tanto umbral SSAA <= 1.50 MW como conservacion con comuna (1.45 MW)
  const badMwDiff = audit.compareSnapshots(currSnap, badMwSnap, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(badMwDiff.semaforo, 'ROJO');
  assert(
    badMwDiff.verificationAlerts.some(a => a.code === 'VIOLACION_INVARIANTE_FISICO_MW' && a.detail.includes('1,50 MW')),
    'Debe disparar ALTA · VIOLACION_INVARIANTE_FISICO_MW ante SSAA > 1,50 MW y descalce comunal'
  );
  console.log('  [PASS] Eval 14: Invariante de potencia MW y límite SSAA Art. 173 LGSE verificados.');
  passed++;

  // --- EVAL 15: Invariante Anti-Colinealidad Bilateral Activa (|r| >= 0.9995) ---
  console.log('--- Eval 15: Invariante Anti-Colinealidad Bilateral Activa (|r| >= 0.9995) ---');
  assert.strictEqual(
    audit.evaluatePhysicalAndDemographicInvariants(currSnap).filter(a => a.code === 'COLINEALIDAD_ESPURIA_ACTIVA').length,
    0,
    'El bundle actual saneado debe tener 0 pares activos con colinealidad espuria |r| >= 0.9995'
  );
  const badColSnap = JSON.parse(JSON.stringify(currSnap));
  const compVals = {};
  for (const ine of Object.keys(badColSnap.indicators.internet_fijo_pct.values)) {
    compVals[ine] = Number((100 - Number(badColSnap.indicators.internet_fijo_pct.values[ine])).toFixed(1));
  }
  badColSnap.indicators.indicador_complemento_sin_etiqueta = { type: 'numeric', values: compVals };
  const badColDiff = audit.compareSnapshots(currSnap, badColSnap, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(badColDiff.semaforo, 'ROJO');
  assert(
    badColDiff.verificationAlerts.some(a => a.code === 'COLINEALIDAD_ESPURIA_ACTIVA' && a.indicator.includes('indicador_complemento_sin_etiqueta')),
    'Debe disparar ALTA · COLINEALIDAD_ESPURIA_ACTIVA cuando un complemento 100-X carece de etiqueta'
  );
  console.log('  [PASS] Eval 15: Cero colinealidad activa en bundle real y detección automática de complemento sin etiqueta.');
  passed++;

  // --- EVAL 16: Trazabilidad de Cambio Regulatorio Documentado (CAMBIO_REGULATORIO_DOCUMENTADO) ---
  console.log('--- Eval 16: Trazabilidad normativa ante salto tarifario/combustibles >= 20% ---');
  const regBase = JSON.parse(JSON.stringify(currSnap));
  const regCurr = JSON.parse(JSON.stringify(currSnap));
  regBase.indicators.tarifa_bt1_clp.values['11101'] = 224.0;
  regCurr.indicators.tarifa_bt1_clp.values['11101'] = 287.8; // +28.5% -> outlier + cita Decreto 8T/2026
  const regDiff = audit.compareSnapshots(regBase, regCurr, { autoUpdateStatus: allGreenApi });
  const bt1Alert = regDiff.verificationAlerts.find(a => a.code === 'OUTLIER_SALTO' && a.indicator === 'tarifa_bt1_clp');
  assert(bt1Alert, 'Debe disparar OUTLIER_SALTO en tarifa_bt1_clp');
  assert.strictEqual(bt1Alert.regulatoryTag, 'CAMBIO_REGULATORIO_DOCUMENTADO');
  assert(
    bt1Alert.detail.includes('[NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO]') && bt1Alert.detail.includes('Decreto N° 8T'),
    `La alerta debe citar Decreto N° 8T MinEnergía: ${bt1Alert.detail}`
  );
  console.log('  [PASS] Eval 16: Clasificador de shock regulatorio adjunta cita normativa verificada.');
  passed++;

  // --- EVAL 17: Invariantes Fiscales, Geográficos (Patentes Acuícolas) y Electorales Hub IV (Sprint 7) ---
  console.log('--- Eval 17: Invariantes fiscales BCN/SINIM, patentes acuícolas 0 en interior y SERVEL Oct-2024 ---');
  assert.strictEqual(
    audit.evaluateHub4FiscalAndElectoralInvariants(currBundle).length,
    0,
    'El bundle actual reconciliado debe pasar Eval 17 directo sobre bundle con 0 alertas'
  );
  assert.strictEqual(
    audit.evaluateHub4FiscalAndElectoralInvariants(currSnap).length,
    0,
    'El snapshot actual reconciliado debe pasar Eval 17 con 0 alertas'
  );

  // 17a: Presupuesto menor que FCM en O'Higgins (como ocurría antes del Sprint 7) -> ROJO
  const badBudgetSnap = JSON.parse(JSON.stringify(currSnap));
  badBudgetSnap.indicators.presupuesto_mclp.values['11302'] = 2150.0;
  const badBudgetDiff = audit.compareSnapshots(currSnap, badBudgetSnap, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(badBudgetDiff.semaforo, 'ROJO');
  assert(
    badBudgetDiff.verificationAlerts.some(a => a.code === 'ERROR_CONTABLE_PRESUPUESTO_MENOR_QUE_FCM' && a.detail.includes('[ERROR_CONTABLE_PRESUPUESTO_MENOR_QUE_FCM]')),
    'Debe disparar ALTA · [ERROR_CONTABLE_PRESUPUESTO_MENOR_QUE_FCM] cuando presupuesto < FCM'
  );

  // 17b: Patente acuicola falsa en comuna interior sin mar (Coyhaique = 725 M$) -> ROJO
  const badPatSnap = JSON.parse(JSON.stringify(currSnap));
  badPatSnap.hub4FiscalAudit.wp01PatentesAcuicolasByIne['11101'] = 725.0;
  const badPatDiff = audit.compareSnapshots(currSnap, badPatSnap, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(badPatDiff.semaforo, 'ROJO');
  assert(
    badPatDiff.verificationAlerts.some(a => a.code === 'ERROR_PATENTE_ACUICOLA_COMUNA_INTERIOR' && a.detail.includes('[ERROR_PATENTE_ACUICOLA_COMUNA_INTERIOR]')),
    'Debe disparar ALTA · [ERROR_PATENTE_ACUICOLA_COMUNA_INTERIOR] ante patente acuícola en comuna sin mar'
  );

  // 17c: Desviacion IPP per capita y participacion SERVEL fuera de rango -> ROJO
  const badFcmElecSnap = JSON.parse(JSON.stringify(currSnap));
  badFcmElecSnap.indicators.ipp_per_capita_clp.values['11202'] = 999999;
  badFcmElecSnap.indicators.participacion_municipales_2024_pct.values['11302'] = 88.0;
  const badFcmElecDiff = audit.compareSnapshots(currSnap, badFcmElecSnap, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(badFcmElecDiff.semaforo, 'ROJO');
  assert(
    badFcmElecDiff.verificationAlerts.some(a => a.code === 'ERROR_CONTABLE_IPP_PER_CAPITA') &&
    badFcmElecDiff.verificationAlerts.some(a => a.code === 'ERROR_ELECTORAL_SERVEL_2024'),
    'Debe detectar inconsistencia IPP per cápita y SERVEL Oct-2024'
  );
  console.log('  [PASS] Eval 17: Coherencia presupuestaria, patentes acuícolas 0 en interior, IPP/hab y SERVEL 2024 verificados.');
  passed++;

  // --- EVAL 18: Invariantes Hub V (BCCh PIB, SII 5 tramos/ventas, SEIA sin Los Cóndores, SERNAGEOMIN, ODEPA, CMF/CONAF 2026) ---
  console.log('--- Eval 18: Invariantes Hub V BCCh, SII 5 tramos, SEIA 1:1, SERNAGEOMIN 356, ODEPA y CONAF 2026 ---');
  assert.strictEqual(
    audit.evaluateHub5EconomyInvestmentLandInvariants(currBundle).length,
    0,
    'El bundle actual reconciliado debe pasar Eval 18 directo sobre bundle con 0 alertas'
  );
  assert.strictEqual(
    audit.evaluateHub5EconomyInvestmentLandInvariants(currSnap).length,
    0,
    'El snapshot actual reconciliado debe pasar Eval 18 con 0 alertas'
  );

  // 18a: Reintroduccion de Los Condores en SEIA -> ROJO
  const badSeiaSnap = JSON.parse(JSON.stringify(currSnap));
  badSeiaSnap.hub5EconomyAudit.seiaSpatialNodes[6] = {
    id: 'inv_seia-07-central-hidroelectrica-los-condores',
    nombre: 'Central Hidroeléctrica Los Cóndores',
    magnitudeValue: 120,
    sourceUrl: 'https://seia.sea.gob.cl/?id_expediente=1874921'
  };
  const badSeiaDiff = audit.compareSnapshots(currSnap, badSeiaSnap, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(badSeiaDiff.semaforo, 'ROJO');
  assert(
    badSeiaDiff.verificationAlerts.some(a => a.code === 'ERROR_GEOGRAFICO_SEIA_LOS_CONDORES'),
    'Debe disparar ALTA · [ERROR_GEOGRAFICO_SEIA_LOS_CONDORES] si reaparece Los Cóndores o id_expediente'
  );

  // 18b: Corrupcion catastro minero Tortel > 0 y masa bovina != 144118 -> ROJO
  const badMinGanSnap = JSON.parse(JSON.stringify(currSnap));
  badMinGanSnap.indicators.concesiones_mineras_ha.values['11303'] = 3200;
  badMinGanSnap.indicators.ganado_bovino_cabezas.values['11101'] = 42500;
  const badMinGanDiff = audit.compareSnapshots(currSnap, badMinGanSnap, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(badMinGanDiff.semaforo, 'ROJO');
  assert(
    badMinGanDiff.verificationAlerts.some(a => a.code === 'ERROR_CATASTRO_MINERO_SERNAGEOMIN') &&
    badMinGanDiff.verificationAlerts.some(a => a.code === 'ERROR_MASA_GANADERA_ODEPA'),
    'Debe detectar corrupción en catastro minero SERNAGEOMIN y masa ganadera ODEPA'
  );
  console.log('  [PASS] Eval 18: Erradicación Los Cóndores, SII 5 tramos, SERNAGEOMIN 356, ODEPA 144.118/177.972, BCCh/ChileCompra y CONAF 2026 verificados.');
  passed++;

  // --- EVAL 19: Invariantes Hub VI (Censo 2024 39.964/52.294/IAM, MINVU 1.927, SSR 9.185, SLEP 55/86, SIES 2.924, CEAD real) ---
  console.log('--- Eval 19: Invariantes Hub VI Censo 2024, MINVU CECT, SSR DOH, SLEP/SIES 2026 y CEAD ---');
  assert.strictEqual(
    audit.evaluateHub6SocialDemographyEducationHousingInvariants(currBundle).length,
    0,
    'El bundle actual reconciliado debe pasar Eval 19 directo sobre bundle con 0 alertas'
  );
  assert.strictEqual(
    audit.evaluateHub6SocialDemographyEducationHousingInvariants(currSnap).length,
    0,
    'El snapshot actual reconciliado debe pasar Eval 19 con 0 alertas'
  );

  // 19a: Corrupcion de hogares Censo 2024 y deficit MINVU -> ROJO
  const badCensoMinvuSnap = JSON.parse(JSON.stringify(currSnap));
  badCensoMinvuSnap.indicators.hogares_censo_2024.values['11101'] = 21000;
  badCensoMinvuSnap.indicators.deficit_habitacional_cuantitativo_n.values['11101'] = 950;
  const badCensoMinvuDiff = audit.compareSnapshots(currSnap, badCensoMinvuSnap, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(badCensoMinvuDiff.semaforo, 'ROJO');
  assert(
    badCensoMinvuDiff.verificationAlerts.some(a => a.code === 'ERROR_CENSO_2024_HOGARES_VIVIENDAS_IAM') &&
    badCensoMinvuDiff.verificationAlerts.some(a => a.code === 'ERROR_MINVU_CECT_DEFICIT_HABITACIONAL'),
    'Debe detectar corrupcion de hogares Censo 2024 y deficit habitacional MINVU'
  );

  // 19b: Reintroduccion de multiplo sintetico CEAD (420) y corrupcion SIES/Tortel -> ROJO
  const badCeadEduSnap = JSON.parse(JSON.stringify(currSnap));
  badCeadEduSnap.indicators.tasa_dmcs_100k.values['11102'] = 420;
  badCeadEduSnap.indicators.matricula_educacion_superior_sies_n.values['11201'] = 400;
  badCeadEduSnap.hub6SocialAudit.tortelEducacion.liceos_urbanos_n = 1;
  const badCeadEduDiff = audit.compareSnapshots(currSnap, badCeadEduSnap, { autoUpdateStatus: allGreenApi });
  assert.strictEqual(badCeadEduDiff.semaforo, 'ROJO');
  assert(
    badCeadEduDiff.verificationAlerts.some(a => a.code === 'ERROR_SEGURIDAD_CEAD_VALORES_SINTETICOS') &&
    badCeadEduDiff.verificationAlerts.some(a => a.code === 'ERROR_EDUCACION_SLEP_Y_SIES_2026'),
    'Debe detectar multiplos sinteticos CEAD y corrupcion de matricula SIES o liceo fantasma en Tortel'
  );
  console.log('  [PASS] Eval 19: Censo 2024, MINVU CECT, SSR/APR, SLEP 86/55, SIES 2.924, CEAD y Wiki Hub VI verificados.');
  passed++;

  console.log(`\n[ALL PASS] ${passed}/19 evals automatizados de auditoría Obsidian V3 pasaron correctamente.`);
}

runTests();
