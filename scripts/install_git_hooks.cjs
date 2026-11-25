/**
 * scripts/install_git_hooks.cjs
 * ============================================================================
 * Instala el hook .git/hooks/pre-commit con saltos LF y cero dependencias
 * para validar LLM Wiki (--lint), sincronia del bundle y cero emojis.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HOOKS_DIR = path.join(ROOT_DIR, '.git', 'hooks');
const PRE_COMMIT_PATH = path.join(HOOKS_DIR, 'pre-commit');

const PRE_COMMIT_SCRIPT = [
  '#!/bin/sh',
  '# Hook pre-commit generado por scripts/install_git_hooks.cjs',
  '',
  'STAGED=$(git diff --cached --name-only)',
  'if [ -z "$STAGED" ]; then',
  '  exit 0',
  'fi',
  '',
  'if echo "$STAGED" | grep -qE "^(wiki/|data/|[^/]+\\.html$)"; then',
  '  echo "[pre-commit] Ejecutando lint Wiki LLM y validacion de bundle..."',
  '  node scripts/obsidian_wiki_bridge.cjs --lint || exit 1',
  '  node scripts/verify_bundle_sync.cjs || exit 1',
  'fi',
  '',
  'exit 0',
  ''
].join('\n');

function installPreCommitHook() {
  if (!fs.existsSync(path.join(ROOT_DIR, '.git'))) {
    throw new Error('No se encontro directorio .git en la raiz del repositorio.');
  }
  fs.mkdirSync(HOOKS_DIR, { recursive: true });
  fs.writeFileSync(PRE_COMMIT_PATH, PRE_COMMIT_SCRIPT, { encoding: 'utf8', mode: 0o755 });
  try {
    fs.chmodSync(PRE_COMMIT_PATH, 0o755);
  } catch (_) {}
  console.log(`[OK] Hook pre-commit instalado en ${path.relative(ROOT_DIR, PRE_COMMIT_PATH)}`);
}

if (require.main === module) {
  installPreCommitHook();
}

module.exports = { installPreCommitHook, PRE_COMMIT_PATH };
