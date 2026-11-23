#!/usr/bin/env node
/**
 * tests/test_karpathy_llm_wiki_obsidian.cjs
 * ============================================================================
 * Suite de Verificación End-to-End del Workflow `llm-wiki` de Andrej Karpathy
 * conectado al Vault de Obsidian y al Consultor IA (`window.OmniRouteClient`).
 *
 * Verifica:
 *   - Test 1: Estructura y conteo exacto de 77 archivos Markdown en `wiki/` + `wiki/.obsidian/graph.json`.
 *   - Test 2: Ejecución limpia de `node scripts/obsidian_wiki_bridge.cjs --lint` (0 enlaces rotos, 0 huérfanos, 100% variables_clave válidas, 0 cifras obsoletas).
 *   - Test 3: Compilación (`--compile`) hacia `data/aysen_wiki_compiled.js` e hidratación dinámica en `window.OmniRouteClient`.
 *   - Test 4: Ciclo bidireccional completo con un Vault temporal de Obsidian (`--sync-to-vault` -> edición en Vault -> `--pull-from-vault` -> `--compile` -> restauración limpia).
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const WIKI_DIR = path.join(ROOT_DIR, 'wiki');
const DATA_BUNDLE_PATH = path.join(ROOT_DIR, 'data', 'aysen_hubs_data.js');
const COMPILED_WIKI_PATH = path.join(ROOT_DIR, 'data', 'aysen_wiki_compiled.js');
const OMNIROUTE_PATH = path.join(ROOT_DIR, 'js', 'omniroute_client.js');

const bridge = require(path.join(ROOT_DIR, 'scripts', 'obsidian_wiki_bridge.cjs'));

function countMdFilesInDir(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  return fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).length;
}

function runTest1StructureAndCounts() {
  console.log('--- Test 1: Estructura canónica de wiki/ (77 notas + .obsidian/graph.json) ---');
  assert.ok(fs.existsSync(path.join(WIKI_DIR, 'index.md')), 'Falta wiki/index.md');
  assert.ok(fs.existsSync(path.join(WIKI_DIR, 'log.md')), 'Falta wiki/log.md');
  assert.ok(fs.existsSync(path.join(WIKI_DIR, '.obsidian', 'graph.json')), 'Falta wiki/.obsidian/graph.json');

  const hubsCount = countMdFilesInDir(path.join(WIKI_DIR, 'hubs'));
  const comunasCount = countMdFilesInDir(path.join(WIKI_DIR, 'comunas'));
  const nodosCount = countMdFilesInDir(path.join(WIKI_DIR, 'nodos'));
  const conceptosCount = countMdFilesInDir(path.join(WIKI_DIR, 'conceptos'));
  const adrCount = countMdFilesInDir(path.join(WIKI_DIR, 'adr'));

  assert.strictEqual(hubsCount, 10, `Se esperaban 10 páginas en wiki/hubs/, encontradas: ${hubsCount}`);
  assert.strictEqual(comunasCount, 10, `Se esperaban 10 páginas en wiki/comunas/, encontradas: ${comunasCount}`);
  assert.strictEqual(nodosCount, 41, `Se esperaban 41 páginas en wiki/nodos/, encontradas: ${nodosCount}`);
  assert.strictEqual(conceptosCount, 8, `Se esperaban 8 páginas en wiki/conceptos/, encontradas: ${conceptosCount}`);
  assert.strictEqual(adrCount, 6, `Se esperaban 6 páginas en wiki/adr/, encontradas: ${adrCount}`);

  const allMd = bridge.listMarkdownFiles(WIKI_DIR);
  assert.strictEqual(allMd.length, 77, `Se esperaban 77 archivos Markdown en total en wiki/, encontrados: ${allMd.length}`);
  console.log('  [PASS] Test 1: 77 archivos Markdown y .obsidian/graph.json verificados.');
}

function runTest2DeterministicLinter() {
  console.log('--- Test 2: Linter Determinista (--lint: 0 wikilinks rotos, 0 huérfanos, 100% variables_clave válidas) ---');
  const lintRes = bridge.lintWikiAndBundle({ silent: true });
  assert.strictEqual(lintRes.ok, true, `Linter reportó errores: ${lintRes.errors.join(' | ')}`);
  assert.strictEqual(lintRes.stats.totalPages, 77);
  assert.strictEqual(lintRes.stats.brokenWikilinks, 0);
  assert.strictEqual(lintRes.stats.orphanCount, 0);
  assert.ok(lintRes.stats.checkedVariablesCount >= 200, 'Se esperaban al menos 200 variables_clave validadas en frontmatter');
  console.log(`  [PASS] Test 2: Linter OK (${lintRes.stats.totalWikilinks} wikilinks verificados, 0 rotos, 0 huérfanos).`);
}

function runTest3CompilationAndConsultantHydration() {
  console.log('--- Test 3: Compilación (--compile) e hidratación en window.OmniRouteClient ---');
  const compiled = bridge.compileWikiToBundle({ silent: true });
  assert.ok(fs.existsSync(COMPILED_WIKI_PATH), 'No se generó data/aysen_wiki_compiled.js');
  assert.strictEqual(compiled.totalPages, 77);
  assert.ok(compiled.conceptsById.financiamiento_municipal, 'Falta concepto financiamiento_municipal en bundle compilado');
  assert.ok(compiled.conceptsById.huemules_multidimensional, 'Falta entidad huemules_multidimensional en bundle compilado');
  assert.ok(compiled.conceptsById.volcan_hudson, 'Falta entidad volcan_hudson en bundle compilado');

  // Verificar que consultor.html cargue data/aysen_wiki_compiled.js
  const consultorHtml = fs.readFileSync(path.join(ROOT_DIR, 'consultor.html'), 'utf8');
  assert.ok(
    consultorHtml.includes('src="data/aysen_wiki_compiled.js"'),
    'consultor.html no incluye <script src="data/aysen_wiki_compiled.js">'
  );

  // Simular carga en navegador con versión customizada de AYSEN_WIKI_COMPILED
  const customMarker = '[SINTESIS_COMPILADA_DESDE_OBSIDIAN_WIKI_VERIFICADA]';
  const customWikiBundle = JSON.parse(JSON.stringify(compiled));
  customWikiBundle.conceptsById.financiamiento_municipal.conceptualBrief =
    `${customWikiBundle.conceptsById.financiamiento_municipal.conceptualBrief} ${customMarker}`;

  const ctx = { window: {}, globalThis: {}, console };
  ctx.window.window = ctx.window;
  vm.runInNewContext(fs.readFileSync(DATA_BUNDLE_PATH, 'utf8'), ctx);
  ctx.window.AYSEN_WIKI_COMPILED = customWikiBundle;
  ctx.globalThis.AYSEN_WIKI_COMPILED = customWikiBundle;
  vm.runInNewContext(fs.readFileSync(OMNIROUTE_PATH, 'utf8'), ctx);

  const OmniRouteClient = ctx.window.OmniRouteClient;
  OmniRouteClient.init(ctx.window.AYSEN_HUBS_DATA);

  const finPacket = OmniRouteClient.CONCEPTUAL_DOMAIN_PACKETS.find(p => p.id === 'financiamiento_municipal');
  assert.ok(finPacket, 'No se encontró paquete financiamiento_municipal en OmniRouteClient');
  assert.ok(
    finPacket.conceptualBrief.includes(customMarker),
    'OmniRouteClient no hidrató conceptualBrief desde window.AYSEN_WIKI_COMPILED'
  );
  console.log('  [PASS] Test 3: data/aysen_wiki_compiled.js generado e hidratado dinámicamente en OmniRouteClient.');
}

function runTest4BidirectionalObsidianVaultSync() {
  console.log('--- Test 4: Sincronización bidireccional con Vault de Obsidian (--sync-to-vault -> edit -> --pull-from-vault) ---');
  const tmpVaultDir = fs.mkdtempSync(path.join(os.tmpdir(), 'obsidian_vault_aysen_test_'));
  const targetConceptRel = path.join('conceptos', 'financiamiento_municipal.md');
  const repoConceptPath = path.join(WIKI_DIR, targetConceptRel);
  const originalContent = fs.readFileSync(repoConceptPath, 'utf8');

  try {
    // 1. Exportar desde wiki/ hacia el Vault temporal
    const syncOut = bridge.syncToVault(tmpVaultDir, { silent: true });
    assert.strictEqual(syncOut.copiedCount, 77);
    const vaultConceptPath = path.join(syncOut.targetDir, targetConceptRel);
    assert.ok(fs.existsSync(vaultConceptPath), 'No se copió financiamiento_municipal.md al Vault temporal');
    assert.ok(
      fs.existsSync(path.join(syncOut.targetDir, '.obsidian', 'graph.json')),
      'No se copió .obsidian/graph.json al Vault temporal'
    );

    // 2. Simular edición hecha por el usuario en Obsidian dentro de "## Síntesis Compilada (Consultor IA)"
    const obsidianEditNote = 'Edición verificada en Obsidian Vault para sincronización bidireccional con el Consultor.';
    const editedContent = originalContent.replace(
      '## Síntesis Compilada (Consultor IA)\n\n',
      `## Síntesis Compilada (Consultor IA)\n\n${obsidianEditNote} `
    );
    fs.writeFileSync(vaultConceptPath, editedContent, 'utf8');

    // 3. Ejecutar --pull-from-vault (importa a wiki/, corre --lint y --compile)
    const pullRes = bridge.pullFromVault(tmpVaultDir, { silent: true });
    assert.strictEqual(pullRes.pulledCount, 77);
    assert.strictEqual(pullRes.lintResult.ok, true);
    assert.ok(
      pullRes.compiled.conceptsById.financiamiento_municipal.synthesis.includes(obsidianEditNote),
      'La edición realizada en el Vault de Obsidian no se reflejó en el bundle compilado tras --pull-from-vault'
    );
  } finally {
    // 4. Restaurar el archivo original en wiki/ y recompilar el bundle limpio de producción
    fs.writeFileSync(repoConceptPath, originalContent, 'utf8');
    bridge.compileWikiToBundle({ silent: true });
    try {
      fs.rmSync(tmpVaultDir, { recursive: true, force: true });
    } catch (_) {
      // ignore cleanup error
    }
  }
  console.log('  [PASS] Test 4: Ciclo completo --sync-to-vault -> edición en Obsidian -> --pull-from-vault -> --compile verificado.');
}

function main() {
  runTest1StructureAndCounts();
  runTest2DeterministicLinter();
  runTest3CompilationAndConsultantHydration();
  runTest4BidirectionalObsidianVaultSync();
  console.log('\n[test_karpathy_llm_wiki_obsidian] 4/4 TESTS PASARON AL 100%.');
}

main();
