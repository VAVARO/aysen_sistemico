#!/usr/bin/env node
/**
 * verify_bundle_sync.cjs
 *
 * Verifica que data/aysen_hubs_data.js (versionado) corresponda exactamente a
 * sus fuentes en data/systemic/. Si alguien edita un JSON del Data Lake y olvida
 * recompilar, el frontend sirve datos viejos y nada lo detecta.
 *
 * El bundle incluye "generatedAt" con el reloj de pared, por lo que una
 * comparacion ingenua siempre falla. Aqui se recompila forzando SOURCE_DATE_EPOCH
 * al mismo instante que declara el bundle versionado, de modo que la unica
 * diferencia posible sea de CONTENIDO.
 *
 * Uso:  node scripts/verify_bundle_sync.cjs
 * Exit: 0 = en sincronia · 1 = desincronizado o error
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const BUNDLE_PATH = path.join(REPO_ROOT, 'data', 'aysen_hubs_data.js');
const BUILDER = path.join(REPO_ROOT, 'scripts', 'build_aysen_hubs_bundle.cjs');

function fail(msg) {
  console.error(`[FAIL] ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(BUNDLE_PATH)) fail(`No existe ${BUNDLE_PATH}`);
if (!fs.existsSync(BUILDER)) fail(`No existe ${BUILDER}`);

const committed = fs.readFileSync(BUNDLE_PATH, 'utf8');

const match = committed.match(/"generatedAt":\s*"([^"]+)"/);
if (!match) fail('El bundle versionado no declara "generatedAt".');

const epochSeconds = Math.floor(new Date(match[1]).getTime() / 1000);
if (!Number.isFinite(epochSeconds)) fail(`"generatedAt" ilegible: ${match[1]}`);

// Respaldo: el compilador escribe en la ruta real, hay que poder revertir.
const backup = path.join(os.tmpdir(), `aysen_bundle_backup_${process.pid}.js`);
fs.writeFileSync(backup, committed, 'utf8');

let rebuilt;
try {
  execFileSync(process.execPath, [BUILDER], {
    cwd: REPO_ROOT,
    env: { ...process.env, SOURCE_DATE_EPOCH: String(epochSeconds) },
    stdio: 'pipe',
  });
  rebuilt = fs.readFileSync(BUNDLE_PATH, 'utf8');
} catch (err) {
  fs.copyFileSync(backup, BUNDLE_PATH);
  fs.unlinkSync(backup);
  fail(`El compilador fallo: ${err.message}`);
} finally {
  if (fs.existsSync(backup)) {
    fs.copyFileSync(backup, BUNDLE_PATH);
    fs.unlinkSync(backup);
  }
}

// Normaliza finales de linea (el repo guarda LF y Windows entrega CRLF) y
// neutraliza "generatedAt": SOURCE_DATE_EPOCH tiene resolucion de segundos, asi
// que no puede reproducir los milisegundos del bundle versionado. Lo que importa
// comparar es el CONTENIDO de datos, no la marca temporal.
const norm = (s) => s
  .replace(/\r\n/g, '\n')
  .replace(/"generatedAt":\s*"[^"]*"/, '"generatedAt": "<NORMALIZADO>"');

if (norm(committed) === norm(rebuilt)) {
  console.log('[OK] data/aysen_hubs_data.js esta en sincronia con data/systemic/.');
  process.exit(0);
}

const a = norm(committed).split('\n');
const b = norm(rebuilt).split('\n');
const diffs = [];
for (let i = 0; i < Math.max(a.length, b.length) && diffs.length < 10; i += 1) {
  if (a[i] !== b[i]) {
    diffs.push(`  linea ${i + 1}:\n    versionado: ${String(a[i]).slice(0, 120)}\n    recompilado: ${String(b[i]).slice(0, 120)}`);
  }
}

console.error('[FAIL] El bundle versionado NO corresponde a sus fuentes.');
console.error('       Corre: node scripts/build_aysen_hubs_bundle.cjs y commitea el resultado.');
console.error(`       Lineas versionadas: ${a.length} · recompiladas: ${b.length}`);
console.error(diffs.join('\n'));
process.exit(1);
