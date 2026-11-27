#!/usr/bin/env node
/**
 * Suite de Aceptación (Bloque 4):
 * Verifica la re-arquitectura semántica LLM-First de js/omniroute_client.js
 * y el Motor de Dossier Ejecutivo y Reportes Editoriales A4 PDF de laboratorio.html.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

function loadEnv() {
  const ctx = {
    console,
    Math,
    Date,
    JSON,
    Array,
    Object,
    Set,
    Map,
    RegExp,
    Number,
    String,
    Boolean,
    Promise,
    setTimeout,
    clearTimeout,
    fetch: async () => {
      throw new Error('offline-unit-test');
    },
    location: { protocol: 'http:', hostname: 'localhost' }
  };
  ctx.window = ctx;
  ctx.global = ctx;
  ctx.globalThis = ctx;

  const bundleSrc = fs.readFileSync(path.join(ROOT, 'data/aysen_hubs_data.js'), 'utf8');
  const nlSrc = fs.readFileSync(path.join(ROOT, 'js/nl2chart_engine.js'), 'utf8');
  const omniSrc = fs.readFileSync(path.join(ROOT, 'js/omniroute_client.js'), 'utf8');
  const lex = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/nl_lexicon_aysen.json'), 'utf8'));

  vm.runInNewContext(bundleSrc, ctx);
  vm.runInNewContext(nlSrc, ctx);
  if (ctx.NL2ChartEngine && typeof ctx.NL2ChartEngine.setLexicon === 'function') {
    ctx.NL2ChartEngine.setLexicon(lex);
  }
  vm.runInNewContext(omniSrc, ctx);

  const client = ctx.OmniRouteClient;
  const ok = client.init(ctx.AYSEN_HUBS_DATA, { lexicon: lex });
  assert(Boolean(ok), 'OmniRouteClient.init debe retornar instancia truthy');
  return { ctx, client, bundle: ctx.AYSEN_HUBS_DATA, omniSrc };
}

(async () => {
  const { client, bundle, omniSrc } = loadEnv();

  // -------------------------------------------------------------------------
  // 1. Test Conversación Turno 1: "explícame cómo funciona el financiamiento municipal"
  // -------------------------------------------------------------------------
  client.clearConversationMemory();
  const q1Text = 'explícame cómo funciona el financiamiento municipal';
  const pkt1 = client.retrieveMemoryForQuery(q1Text);
  assert(pkt1 && pkt1.matchedConceptualPacket, 'Turno 1 debe activar matchedConceptualPacket');
  assert.strictEqual(
    pkt1.matchedConceptualPacket.id,
    'financiamiento_municipal',
    'Turno 1 debe resolver paquete conceptual financiamiento_municipal'
  );
  const topKeys1 = (pkt1.topVariables || []).map(v => v.key);
  assert(topKeys1.includes('presupuesto_mclp'), 'topVariables debe incluir presupuesto_mclp: ' + topKeys1.join(','));
  assert(topKeys1.includes('dependencia_fcm_pct'), 'topVariables debe incluir dependencia_fcm_pct: ' + topKeys1.join(','));
  assert(topKeys1.includes('ingresos_propios_pct'), 'topVariables debe incluir ingresos_propios_pct: ' + topKeys1.join(','));
  assert.notStrictEqual(topKeys1[0], 'profesionalizacion_pct', 'profesionalizacion_pct NO puede liderar financiamiento municipal');

  const res1 = await client.query(q1Text);
  assert(res1 && res1.reply, 'Turno 1 debe entregar respuesta');
  assert(/Ingresos Propios/i.test(res1.reply) && /Fondo Común Municipal/i.test(res1.reply) && /FNDR/i.test(res1.reply),
    'Turno 1 debe explicar IPP + FCM + FNDR: ' + res1.reply);
  assert(res1.chart && res1.chart.render === true, 'Turno 1 debe renderizar gráfico');
  assert.strictEqual(res1.chart.varX, 'dependencia_fcm_pct', 'Gráfico Turno 1 varX debe ser dependencia_fcm_pct');
  assert.strictEqual(res1.chart.varY, 'ingresos_propios_pct', 'Gráfico Turno 1 varY debe ser ingresos_propios_pct');
  assert(!/\([a-z]+_[a-z0-9_]+\)/.test(res1.reply), 'Turno 1 no debe filtrar claves snake_case: ' + res1.reply);
  console.log('[OK] Test 1: Conversación Turno 1 (financiamiento municipal conceptual + gráfico)');

  // -------------------------------------------------------------------------
  // 2. Test Conversación Turno 2: "no fue lo que pregunté" (Reparación conversacional)
  // -------------------------------------------------------------------------
  const pkt2 = client.retrieveMemoryForQuery('no fue lo que pregunté');
  assert.strictEqual(pkt2.isConversationalRepair, true, 'Turno 2 debe detectar isConversationalRepair === true');
  assert(pkt2.originalQueryToRepair && /financiamiento municipal/i.test(pkt2.originalQueryToRepair),
    'Turno 2 debe rescatar consulta sustantiva previa');

  const res2 = await client.query('no fue lo que pregunté');
  assert(res2 && res2.reply, 'Turno 2 debe producir respuesta');
  assert(!/no forma parte de las fuentes oficiales/i.test(res2.reply),
    'Turno 2 jamás debe caer en rechazo Caso F: ' + res2.reply);
  assert(/Fondo Común Municipal|SINIM|Ingresos Propios/i.test(res2.reply),
    'Turno 2 debe responder sobre el tema original rescatado: ' + res2.reply);
  console.log('[OK] Test 2: Conversación Turno 2 (reparación conversacional sin Caso F)');

  // -------------------------------------------------------------------------
  // 3. Test Conversación Turno 3: "huemules" (Grafo Territorial Multi-Entidad + Supresión hitos_regionales)
  // -------------------------------------------------------------------------
  const pkt3 = client.retrieveMemoryForQuery('huemules');
  assert(pkt3 && pkt3.matchedTerritorialEntity, 'Turno 3 debe activar matchedTerritorialEntity');
  assert.strictEqual(
    pkt3.matchedTerritorialEntity.id,
    'huemules_multidimensional',
    'Turno 3 debe resolver entidad huemules_multidimensional'
  );
  assert.strictEqual(pkt3.isBroadRegionalQuery, false, 'Topónimo corto no debe activar isBroadRegionalQuery');

  const res3 = await client.query('huemules');
  assert(res3 && res3.reply, 'Turno 3 debe producir respuesta');
  assert(/Paso Fronterizo Huemules/i.test(res3.reply), 'Debe explicar Paso Fronterizo Huemules: ' + res3.reply);
  assert(/Río Huemules/i.test(res3.reply) && /Valle Huemules/i.test(res3.reply), 'Debe explicar Río/Valle Huemules: ' + res3.reply);
  assert(/Hippocamelus bisulcus/i.test(res3.reply), 'Debe explicar especie Huemul RCE: ' + res3.reply);
  assert(!/Huemules es un RUT/i.test(res3.reply) && !/12 holdings/i.test(res3.reply),
    'No debe alucinar RUT ni citar 12 holdings: ' + res3.reply);
  console.log('[OK] Test 3: Conversación Turno 3 (huemules multidimensional sin alucinación RUT)');

  // -------------------------------------------------------------------------
  // 4. Test Conversación Turno 4: Reparación + Sanitizador Anti-snake_case + Re-hidratación LLM
  // -------------------------------------------------------------------------
  const res4 = await client.query('ok, pero no se termina de entender esta cosa...');
  assert(res4 && res4.reply && !/no forma parte de las fuentes oficiales/i.test(res4.reply),
    'Turno 4 "no se termina de entender" no debe caer en Caso F: ' + res4.reply);

  const rawLeakyReply =
    'El sistema combina presupuesto vigente (presupuesto_mclp), dependencia central (dependencia_fcm_pct) y uso de ingresos_propios_pct. Fuente: https://datos.sinim.gov.cl/datos_abiertos';
  const cleanedReply = client.sanitizeTechnicalKeysInReply(rawLeakyReply);
  assert(!cleanedReply.includes('presupuesto_mclp'), 'Sanitizador debe quitar presupuesto_mclp: ' + cleanedReply);
  assert(!cleanedReply.includes('dependencia_fcm_pct'), 'Sanitizador debe quitar dependencia_fcm_pct: ' + cleanedReply);
  assert(!cleanedReply.includes('ingresos_propios_pct'), 'Sanitizador debe humanizar ingresos_propios_pct: ' + cleanedReply);
  assert(cleanedReply.includes('https://datos.sinim.gov.cl/datos_abiertos'), 'Sanitizador debe preservar URLs íntegras');

  const rehydrated = client.rehydrateChartFromLLM(
    {
      reply: cleanedReply,
      variables_seleccionadas: ['presupuesto_mclp', 'dependencia_fcm_pct'],
      chart: { type: 'bar', title: 'Finanzas SINIM' }
    },
    pkt1
  );
  assert.strictEqual(rehydrated.validVarX, 'presupuesto_mclp', 'Re-hidratación debe tomar variable #1 elegida por LLM');
  assert.strictEqual(rehydrated.validVarY, 'dependencia_fcm_pct', 'Re-hidratación debe tomar variable #2 elegida por LLM');
  assert(rehydrated.exactSources.length > 0, 'Re-hidratación debe reconstruir fuentes oficiales');
  console.log('[OK] Test 4: Turno 4, Sanitizador anti-snake_case y Re-hidratación LLM');

  // -------------------------------------------------------------------------
  // 5. Test Sincronización de panoramicNodesAndMilestones
  // -------------------------------------------------------------------------
  assert(!/12 holdings/i.test(omniSrc), 'js/omniroute_client.js no debe contener "12 holdings"');
  assert(!omniSrc.includes('6.410'), 'js/omniroute_client.js no debe contener "6.410" obsoleto');
  const idx = client.getIndex();
  assert(idx.panoramicNodesAndMilestones.includes('Nodos (41)'), 'panoramicNodesAndMilestones debe preservar Nodos (41)');
  assert(idx.panoramicNodesAndMilestones.includes('13 holdings salmoneros madres'), 'Hitos deben reflejar 13 holdings salmoneros madres');
  console.log('[OK] Test 5: Sincronización de panoramicNodesAndMilestones verificada');

  // -------------------------------------------------------------------------
  // 6. Test Paridad de Presets en hubsGallery (10 Hubs >= 6 presets)
  // -------------------------------------------------------------------------
  const expected10Hubs = [
    'turismo', 'salmonicultura', 'energia', 'gobernanza', 'inversion',
    'social', 'biodiversidad', 'salud', 'cultura', 'ctci'
  ];
  const hg = bundle.hubsGallery || {};
  expected10Hubs.forEach(hKey => {
    assert(hg[hKey] && Array.isArray(hg[hKey].presets), `Falta hubsGallery.${hKey}`);
    assert(hg[hKey].presets.length >= 6, `Hub ${hKey} tiene solo ${hg[hKey].presets.length} presets (< 6)`);
  });
  console.log('[OK] Test 6: Todos los 10 Hubs en hubsGallery tienen >= 6 presets');

  // -------------------------------------------------------------------------
  // 7. Test Motor de Narrativa y Bibliografía PDF en laboratorio.html
  // -------------------------------------------------------------------------
  const labHtml = fs.readFileSync(path.join(ROOT, 'laboratorio.html'), 'utf8');
  const requiredLabTokens = [
    'generateChartEditorialNarrative',
    'openExecutiveReportModal',
    'captureCurrentChartSnapshot',
    'pinCurrentChartToReport',
    'renderExecutiveReportSheet',
    'enrichReportNarrativesWithAI',
    'printExecutiveReport',
    'id="executiveReportPrintRoot"',
    'id="executiveReportModal"',
    'id="btnPinChartToReport"',
    '@media print',
    '@page',
    'size: A4 portrait'
  ];
  requiredLabTokens.forEach(tok => {
    assert(labHtml.includes(tok), `laboratorio.html debe contener: ${tok}`);
  });

  // Extraer y ejecutar generateChartEditorialNarrative en VM aislada
  const fnMatch = labHtml.match(/function generateChartEditorialNarrative\(snap\)\s*\{[\s\S]*?\n\s{6}\}/);
  assert(fnMatch, 'No se pudo extraer generateChartEditorialNarrative desde laboratorio.html');
  const narCtx = { Number };
  vm.runInNewContext(`${fnMatch[0]}`, narCtx);
  const sampleNar = narCtx.generateChartEditorialNarrative({
    xLabel: 'Dependencia FCM',
    xUnit: '%',
    yLabel: 'Ingresos Propios Permanentes',
    yUnit: '%',
    yKey: 'ingresos_propios_pct',
    scaleModeLabel: 'Valores Nominales',
    hubTitle: 'IV. Gobernanza y Finanzas',
    nodeTitle: 'Finanzas Municipales SINIM',
    stats: {
      meanX: 75.8,
      medianX: 78.2,
      stdX: 15.2,
      cvX: 20.1,
      sumX: 757.9,
      maxComuna: 'Tortel',
      maxVal: 92.8,
      minComuna: 'Coyhaique',
      minVal: 46.5,
      gapRatio: 2.0,
      top3Names: ['Tortel', "O'Higgins", 'Lago Verde'],
      top3SharePct: 36.1,
      pearsonR: -1.0,
      r2: 1.0,
      quadrants: { highHigh: [], lowLow: [] }
    }
  });
  assert(
    sampleNar &&
    sampleNar.paragraphStatistical.includes('Tortel') &&
    sampleNar.paragraphAnalytical.includes('Pearson') &&
    sampleNar.paragraphSystemic.includes('Gobernanza'),
    'generateChartEditorialNarrative debe producir los 3 párrafos editoriales con cifras reales'
  );
  console.log('[OK] Test 7: Motor de Narrativa y Bibliografía PDF A4 validado en laboratorio.html');

  // -------------------------------------------------------------------------
  // 8. Test Cero Regresión en los 10 Hubs (v5) y cero emojis
  // -------------------------------------------------------------------------
  const c0 = bundle.comunas[0];
  const totalComunaCols = Object.keys(c0).length;
  assert(totalComunaCols >= 235, `Se esperaban >= 235 columnas comunales en bundle.comunas[0], hay ${totalComunaCols}`);
  assert(idx.variables.length >= 230, `Se esperaban >= 230 variables indexadas en OmniRouteClient, hay ${idx.variables.length}`);
  assert(c0.ingresos_propios_pct !== undefined, 'Debe existir ingresos_propios_pct en comunas');

  const ctciMod = bundle.extension_modules.ctci_innovacion;
  assert.strictEqual(ctciMod.nodos_georreferenciados.length, 16, 'CTCi debe mantener 16 centros/estaciones');
  const invSum = ctciMod.por_comuna.reduce((acc, c) => acc + (c.datos?.investigadores_residentes_est || 0), 0);
  assert.strictEqual(invSum, 124, 'CTCi debe sumar 124 investigadores residentes');

  const cultMod = bundle.extension_modules.cultura_patrimonio;
  assert(cultMod.nodos_georreferenciados.length >= 15, 'Cultura debe mantener nodos georreferenciados');
  assert.strictEqual(cultMod.resumen_regional.total_museos_rmc, 14, 'Cultura debe mantener 14 museos RMC');

  const postasSum = bundle.comunas.reduce((acc, c) => acc + (c.postas_salud_rural || 0), 0);
  assert.strictEqual(postasSum, 27, 'Postas de salud rural deben sumar 27');

  const glacSum = Number(bundle.comunas.reduce((acc, c) => acc + (c.superficie_glaciares_km2 || 0), 0).toFixed(1));
  assert.strictEqual(glacSum, 8721.6, 'Superficie glaciar debe sumar 8721.6 km2');

  const emojiRe = /[\u{10000}-\u{10FFFF}]|[\u2600-\u27bf]|[\u2300-\u23ff]|[\u2b50-\u2b55]/u;
  assert(!emojiRe.test(omniSrc), 'js/omniroute_client.js contiene emojis');
  assert(!emojiRe.test(labHtml), 'laboratorio.html contiene emojis');

  console.log('[OK] Test 8: Cero regresión en los 10 Hubs (v5) y cero emojis verificados.');

  // -------------------------------------------------------------------------
  // 9. Test Reparación Guiada con Re-especificación en la misma frase
  // -------------------------------------------------------------------------
  client.clearConversationMemory();
  const prevFinRes = await client.query('explícame cómo funciona el financiamiento municipal');
  const guidedText = 'eso no es lo que pregunté, quiero saber cuántos investigadores y proyectos ANID hay por comuna';
  const pkt9a = client.retrieveMemoryForQuery(guidedText);
  assert.strictEqual(pkt9a.conversationAct.isGuidedRepair, true, 'Debe detectar isGuidedRepair === true');
  assert.strictEqual(pkt9a.conversationAct.isPureRepair, false, 'No debe tratar reparación guiada como pura');
  const topKeys9 = (pkt9a.topVariables || []).map(v => v.key);
  assert(topKeys9.includes('total_proyectos_ctci'), 'Reparación guiada debe incluir total_proyectos_ctci: ' + topKeys9.join(','));
  assert(topKeys9.includes('investigadores_residentes_est'), 'Reparación guiada debe incluir investigadores_residentes_est: ' + topKeys9.join(','));
  const res9a = await client.query(guidedText);
  assert(res9a && res9a.reply && res9a.reply !== prevFinRes.reply, 'Reparación guiada no puede repetir respuesta previa');
  assert(!/Fondo Común Municipal/i.test(res9a.reply), 'Reparación guiada no debe volver a responder sobre FCM: ' + res9a.reply);
  assert.strictEqual(res9a.chart.varX, 'total_proyectos_ctci', 'Chart varX debe ser total_proyectos_ctci');
  assert.strictEqual(res9a.chart.varY, 'investigadores_residentes_est', 'Chart varY debe ser investigadores_residentes_est');

  client.clearConversationMemory();
  const coy1 = await client.query('¿por qué Coyhaique tiene tanta contaminación en invierno si en Aysén sobra agua para hidroeléctricas?');
  const guidedLuzText = 'no entendiste, te pregunto si la luz es muy cara comparada con usar leña';
  const pkt9b = client.retrieveMemoryForQuery(guidedLuzText);
  assert.strictEqual(pkt9b.conversationAct.isGuidedRepair, true, 'Debe detectar isGuidedRepair === true en luz vs leña');
  assert(pkt9b.matchedEntities.some(e => e.name === 'Coyhaique'), 'Debe heredar Coyhaique al no mencionar otra comuna');
  const res9b = await client.query(guidedLuzText);
  assert(res9b && res9b.reply && res9b.reply !== coy1.reply, 'Turno 2 luz vs leña no puede repetir respuesta previa');
  assert(/224\/kWh|BT1/i.test(res9b.reply) && /48\.000\/m³/i.test(res9b.reply),
    'Debe comparar tarifa eléctrica BT1 vs leña: ' + res9b.reply);
  console.log('[OK] Test 9: Reparación guiada con re-especificación (ANID/investigadores y Coyhaique luz vs leña)');

  // -------------------------------------------------------------------------
  // 10. Test Multi-Intención Salmón + Dueños / Holdings (13 holdings y 503.500 ton)
  // -------------------------------------------------------------------------
  client.clearConversationMemory();
  const q10 = '¿cómo funciona la industria del salmón en Aysén y quiénes son los dueños?';
  const pkt10 = client.retrieveMemoryForQuery(q10);
  assert.strictEqual(pkt10.isHoldingQuery, true, 'Debe activar isHoldingQuery === true');
  assert(pkt10.matchedConceptualPacket && pkt10.matchedConceptualPacket.id === 'modelo_salmonicultor',
    'Debe activar paquete modelo_salmonicultor');
  const grounded10 = client.buildMemoryGroundedPrompts(pkt10);
  assert(grounded10.userPromptWithMemory.includes('"holdings_salmoneros_aysen":[') &&
    grounded10.userPromptWithMemory.includes('AquaChile'),
    'MEMORIA_VERIFICADA debe inyectar holdings_salmoneros_aysen completos');
  const res10 = await client.query(q10);
  ['13 holdings', 'AquaChile', 'Multi X', 'Mowi', 'Blumar', '503.500'].forEach(tok => {
    assert(res10.reply.includes(tok), `Respuesta de industria del salmón debe incluir ${tok}: ${res10.reply}`);
  });
  console.log('[OK] Test 10: Industria del salmón + 13 holdings dueños e inyección en MEMORIA_VERIFICADA');

  // -------------------------------------------------------------------------
  // 11. Test Anti-colisión léxica "depende" vs "Trabajadores Dependientes SII"
  // -------------------------------------------------------------------------
  client.clearConversationMemory();
  const q11 = '¿y qué comuna depende más del empleo salmonero?';
  const pkt11 = client.retrieveMemoryForQuery(q11);
  assert(pkt11.topVariables && pkt11.topVariables.length > 0, 'Debe recuperar variables de Hub II');
  assert.notStrictEqual(pkt11.topVariables[0].key, 'trabajadores_sii',
    'trabajadores_sii NO puede liderar ante verbo "depende" + empleo salmonero');
  const hub2Keys = ['centros_activos_salmon', 'biomasa_salmon_ton', 'concesiones_salmon', 'empleo_directo_salmon_n'];
  assert(hub2Keys.includes(pkt11.topVariables[0].key),
    'Variable #1 debe ser de Hub II acuícola, obtuvo: ' + pkt11.topVariables[0].key);
  const res11 = await client.query(q11);
  assert.notStrictEqual(res11.chart.varX, 'trabajadores_sii', 'Chart varX no debe ser trabajadores_sii');
  assert(!/Trabajadores Dependientes SII/i.test(res11.reply),
    'No debe responder con Trabajadores Dependientes SII liderado por Coyhaique: ' + res11.reply);
  assert(/Aysén/i.test(res11.reply) && /(245|503\.500|745)/.test(res11.reply),
    'Debe priorizar actividad acuícola liderada por Aysén: ' + res11.reply);
  console.log('[OK] Test 11: Anti-colisión verbo "depende" vs Trabajadores Dependientes SII en empleo salmonero');

  // -------------------------------------------------------------------------
  // 12. Test Separación Cultura vs CTCi y 16 Centros / 124 Investigadores
  // -------------------------------------------------------------------------
  client.clearConversationMemory();
  const q12 = '¿quiénes hacen ciencia o investigación en Aysén?';
  const pkt12 = client.retrieveMemoryForQuery(q12);
  assert(pkt12.matchedSector && pkt12.matchedSector.id === 'ctci',
    'Debe resolver sector ctci independiente de cultura');
  assert(pkt12.matchedConceptualPacket && pkt12.matchedConceptualPacket.id === 'ecosistema_ctci_ciencia',
    'Debe activar paquete conceptual ecosistema_ctci_ciencia');
  const grounded12 = client.buildMemoryGroundedPrompts(pkt12);
  assert(grounded12.userPromptWithMemory.includes('"centros_ctci_verificados":['),
    'MEMORIA_VERIFICADA debe incluir listado verificado centros_ctci_verificados');
  const res12 = await client.query(q12);
  assert.notStrictEqual(res12.chart.varX, 'total_espacios_culturales',
    'Gráfico de ciencia JAMÁS debe ser total_espacios_culturales');
  assert.strictEqual(res12.chart.varX, 'total_proyectos_ctci', 'Chart varX debe ser total_proyectos_ctci');
  assert.strictEqual(res12.chart.varY, 'investigadores_residentes_est', 'Chart varY debe ser investigadores_residentes_est');
  ['16 centros', '124 investigadores', '91', 'CIEP', 'UAysén', 'INIA Tamel Aike', 'UACh', 'IFOP'].forEach(tok => {
    assert(res12.reply.includes(tok), `Respuesta de ciencia debe incluir ${tok}: ${res12.reply}`);
  });
  console.log('[OK] Test 12: Ecosistema CTCi separado de Cultura (16 centros, 124 investigadores)');

  // -------------------------------------------------------------------------
  // 13. Test Consulta Coloquial Villa O'Higgins + Volcán Hudson y Laguna San Rafael sin SMA
  // -------------------------------------------------------------------------
  client.clearConversationMemory();
  const q13a = "¿qué onda Villa O'Higgins, vale la pena invertir allá o está muy aislado?";
  const res13a = await client.query(q13a);
  assert.notStrictEqual(res13a.chart.varX, 'costo_diesel_aislado_clp',
    'Consulta evaluativa abierta sobre Villa O\'Higgins no debe reducirse solo a costo_diesel_aislado_clp');
  ['O\'Higgins', '86,4', '10 hrs', '3.614,5', '620', '0% fibra hogar', '0 visitas SNASPE'].forEach(tok => {
    assert(res13a.reply.includes(tok), `Perfil integral de O'Higgins debe incluir ${tok}: ${res13a.reply}`);
  });

  client.clearConversationMemory();
  const q13b = '¿qué me puedes contar del Volcán Hudson y la Laguna San Rafael?';
  const res13b = await client.query(q13b);
  ['Volcán Hudson', 'Laguna San Rafael', 'Campo de Hielo Norte', '8.721,6 km²'].forEach(tok => {
    assert(res13b.reply.includes(tok), `Síntesis Hudson + San Rafael debe incluir ${tok}: ${res13b.reply}`);
  });
  assert(!/\bSMA\b|\bSNIFA\b|282 expedientes/i.test(res13b.reply),
    'No debe inyectar expedientes SMA cuando no fueron solicitados: ' + res13b.reply);
  assert.notStrictEqual(res13b.chart.varX, 'expedientes_fiscalizacion_sma_n',
    'Chart varX no debe ser expedientes_fiscalizacion_sma_n sin mención de fiscalización/SMA');
  assert(!emojiRe.test(fs.readFileSync(__filename, 'utf8')), 'La suite de pruebas no debe contener emojis');
  console.log('[OK] Test 13: Perfil integral Villa O\'Higgins y Volcán Hudson + Laguna San Rafael sin SMA');

  console.log('ALL_CONSULTOR_LLM_AND_PDF_REPORT_TESTS_PASSED');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
