#!/usr/bin/env node
/**
 * scripts/obsidian_wiki_bridge.cjs
 * Puente bidireccional entre wiki/ (Karpathy LLM-Wiki), el Vault de Obsidian del usuario
 * (vía filesystem OBSIDIAN_VAULT_PATH o vía Obsidian Local REST API http://127.0.0.1:27123)
 * y el bundle compilado data/aysen_wiki_compiled.js para el Consultor IA.
 *
 * Comandos:
 *   node scripts/obsidian_wiki_bridge.cjs --compile
 *   node scripts/obsidian_wiki_bridge.cjs --lint
 *   node scripts/obsidian_wiki_bridge.cjs --sync-to-vault [--vault-path "C:/ruta/a/tu/Vault"]
 *   node scripts/obsidian_wiki_bridge.cjs --pull-from-vault [--vault-path "C:/ruta/a/tu/Vault"]
 *   node scripts/obsidian_wiki_bridge.cjs --sync-rest-api [--api-url "http://127.0.0.1:27123"] [--token "..."]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');
const https = require('https');

const ROOT_DIR = path.resolve(__dirname, '..');
const WIKI_DIR = path.join(ROOT_DIR, 'wiki');
const DATA_BUNDLE_PATH = path.join(ROOT_DIR, 'data', 'aysen_hubs_data.js');
const COMPILED_WIKI_PATH = path.join(ROOT_DIR, 'data', 'aysen_wiki_compiled.js');
const BRIDGE_CONFIG_PATH = path.join(ROOT_DIR, '.obsidian_bridge.json');
const DEFAULT_GDRIVE_VAULT_PATH = path.resolve(ROOT_DIR, '..', 'Obsidian Vault');

const FORBIDDEN_STALE_CLAIMS = [
  '12 holdings',
  '6.410 km',
  '1.842 sitios',
  '28 postas'
];

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

function loadDataLake() {
  const code = fs.readFileSync(DATA_BUNDLE_PATH, 'utf8');
  const ctx = { window: {}, globalThis: {} };
  vm.runInNewContext(code, ctx);
  return ctx.window.AYSEN_HUBS_DATA || ctx.globalThis.AYSEN_HUBS_DATA;
}

function listMarkdownFiles(baseDir, relDir = '') {
  const results = [];
  const fullDir = path.join(baseDir, relDir);
  if (!fs.existsSync(fullDir)) return results;
  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const childRel = relDir ? `${relDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...listMarkdownFiles(baseDir, childRel));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(childRel.replace(/\\/g, '/'));
    }
  }
  return results.sort();
}

function parseFrontmatter(markdown) {
  const text = String(markdown || '').replace(/\r\n/g, '\n');
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { frontmatter: {}, body: text };
  }
  const yamlBlock = match[1];
  const body = text.slice(match[0].length);
  const frontmatter = {};
  let currentListKey = null;

  for (const rawLine of yamlBlock.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const listMatch = line.match(/^\s+-\s+(.*)$/);
    if (listMatch && currentListKey) {
      let itemVal = listMatch[1].trim();
      itemVal = itemVal.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      frontmatter[currentListKey].push(itemVal);
      continue;
    }
    const kvMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      let val = kvMatch[2].trim();
      val = val.replace(/\s+#.*$/, '').trim();
      if (!val) {
        frontmatter[key] = [];
        currentListKey = key;
      } else {
        val = val.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        frontmatter[key] = val;
        currentListKey = null;
      }
    }
  }
  return { frontmatter, body };
}

function extractCompiledSynthesis(body) {
  const text = String(body || '').replace(/\r\n/g, '\n');
  const regex = /^##\s+Síntesis Compilada \(Consultor IA\)\s*\n+([\s\S]*?)(?=\n##\s+|\n#\s+|$)/m;
  const match = text.match(regex);
  if (!match) return '';
  return match[1].trim();
}

function extractSubSectionSyntheses(body) {
  const text = String(body || '').replace(/\r\n/g, '\n');
  const result = {};
  const subRegex = /^###\s+.*?\(`([a-z0-9_]+)`\)\s*\n+([\s\S]*?)(?=\n###\s+|\n##\s+|$)/gm;
  let m;
  while ((m = subRegex.exec(text)) !== null) {
    result[m[1].trim()] = m[2].trim();
  }
  return result;
}

function extractWikilinks(markdown) {
  const { body } = parseFrontmatter(markdown);
  const withoutCode = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]+`/g, '');
  const links = [];
  const regex = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g;
  let m;
  while ((m = regex.exec(withoutCode)) !== null) {
    const rawTarget = m[1].trim().replace(/\\/g, '/').replace(/\.md$/i, '');
    if (rawTarget) {
      links.push({
        target: rawTarget,
        alias: m[2] ? m[2].trim() : null
      });
    }
  }
  return links;
}

function resolveWikilinkTarget(target, allRelPathsSet, basenameToRelPath) {
  const clean = target.replace(/^\/+/, '').replace(/\.md$/i, '');
  const direct = `${clean}.md`;
  if (allRelPathsSet.has(direct)) return direct;
  if (basenameToRelPath.has(clean)) return basenameToRelPath.get(clean);
  return null;
}

function lintWikiAndBundle(options = {}) {
  const silent = Boolean(options.silent);
  const errors = [];
  const dataLake = loadDataLake();
  const validComunaKeys = new Set(Object.keys((dataLake.comunas && dataLake.comunas[0]) || {}));

  if (!fs.existsSync(WIKI_DIR)) {
    errors.push('No existe el directorio wiki/');
    return { ok: false, errors, stats: {} };
  }

  const mdFiles = listMarkdownFiles(WIKI_DIR);
  const allRelPathsSet = new Set(mdFiles);
  const basenameToRelPath = new Map();
  mdFiles.forEach(rel => {
    const base = path.basename(rel, '.md');
    if (!basenameToRelPath.has(base)) {
      basenameToRelPath.set(base, rel);
    }
  });

  // Check 5a: Presencia de index.md y log.md
  if (!allRelPathsSet.has('index.md')) {
    errors.push('Falta archivo obligatorio wiki/index.md');
  }
  if (!allRelPathsSet.has('log.md')) {
    errors.push('Falta archivo obligatorio wiki/log.md');
  }

  const incomingFromIndex = new Set();
  const incomingFromOtherPages = new Map();
  mdFiles.forEach(rel => incomingFromOtherPages.set(rel, new Set()));

  let totalWikilinks = 0;
  let brokenWikilinks = 0;
  let checkedVariablesCount = 0;

  for (const relPath of mdFiles) {
    const absPath = path.join(WIKI_DIR, relPath);
    const content = fs.readFileSync(absPath, 'utf8');
    const { frontmatter } = parseFrontmatter(content);

    // Check 4: Guardrail contra Stale Claims Numéricos y emojis
    const lowerContent = content.toLowerCase();
    for (const stale of FORBIDDEN_STALE_CLAIMS) {
      if (lowerContent.includes(stale.toLowerCase())) {
        errors.push(`[Stale Claim] ${relPath} contiene cifra obsoleta prohibida: "${stale}"`);
      }
    }
    if (EMOJI_REGEX.test(content)) {
      errors.push(`[Emoji Guardrail] ${relPath} contiene emojis no permitidos.`);
    }

    // Check 3: Validación de variables_clave en Frontmatter
    const vars = Array.isArray(frontmatter.variables_clave) ? frontmatter.variables_clave : [];
    for (const v of vars) {
      checkedVariablesCount++;
      if (!validComunaKeys.has(v)) {
        errors.push(`[Invalid Variable] ${relPath} declara variable_clave inexistente en window.AYSEN_HUBS_DATA.comunas[0]: "${v}"`);
      }
    }

    // Check 1: Integridad de [[wikilinks]]
    const links = extractWikilinks(content);
    for (const lnk of links) {
      totalWikilinks++;
      const resolved = resolveWikilinkTarget(lnk.target, allRelPathsSet, basenameToRelPath);
      if (!resolved) {
        brokenWikilinks++;
        errors.push(`[Broken Wikilink] ${relPath} enlaza a [[${lnk.target}]] que no existe en wiki/`);
      } else {
        if (relPath === 'index.md') {
          incomingFromIndex.add(resolved);
        } else if (resolved !== relPath) {
          incomingFromOtherPages.get(resolved).add(relPath);
        }
      }
    }
  }

  // Check 2: Cero Páginas Huérfanas y catalogación en index.md
  let orphanCount = 0;
  for (const relPath of mdFiles) {
    if (relPath === 'index.md') continue;
    if (!incomingFromIndex.has(relPath)) {
      orphanCount++;
      errors.push(`[Uncataloged in index.md] La página ${relPath} no está enlazada desde wiki/index.md`);
    }
    const otherSenders = incomingFromOtherPages.get(relPath);
    if (!otherSenders || otherSenders.size === 0) {
      orphanCount++;
      errors.push(`[Orphan Page] La página ${relPath} no recibe enlaces desde ninguna otra página del grafo además de index.md`);
    }
  }

  // Check 5b: Formato de log.md
  if (allRelPathsSet.has('log.md')) {
    const logContent = fs.readFileSync(path.join(WIKI_DIR, 'log.md'), 'utf8');
    const logHeaders = logContent
      .split(/\r?\n/)
      .filter(l => /^##\s+\[/.test(l));
    if (logHeaders.length === 0) {
      errors.push('[Invalid log.md] wiki/log.md no contiene entradas cronológicas "## [YYYY-MM-DD] ..."');
    }
    const validLogHeaderRe = /^## \[\d{4}-\d{2}-\d{2}\] (ingest|lint|adr|query) \| .+/;
    for (const h of logHeaders) {
      if (!validLogHeaderRe.test(h)) {
        errors.push(`[Invalid log.md header] Entrada mal formada en wiki/log.md: "${h}"`);
      }
    }
  }

  const stats = {
    totalPages: mdFiles.length,
    totalWikilinks,
    brokenWikilinks,
    orphanCount,
    checkedVariablesCount
  };

  if (!silent) {
    if (errors.length === 0) {
      console.log(
        `[obsidian_wiki_bridge --lint] OK: ${stats.totalPages} páginas verificadas, ` +
        `${stats.totalWikilinks} wikilinks válidos (0 rotos), 0 páginas huérfanas, ` +
        `${stats.checkedVariablesCount} variables_clave validadas contra AYSEN_HUBS_DATA y 0 cifras obsoletas.`
      );
    } else {
      console.error(`[obsidian_wiki_bridge --lint] FALLÓ con ${errors.length} errores:`);
      errors.forEach(e => console.error(`  - ${e}`));
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    stats
  };
}

function compileWikiToBundle(options = {}) {
  const silent = Boolean(options.silent);
  const mdFiles = listMarkdownFiles(WIKI_DIR);

  const conceptsById = {};
  const hubsById = {};
  const comunasById = {};
  const nodosById = {};
  const adrsById = {};

  for (const relPath of mdFiles) {
    const absPath = path.join(WIKI_DIR, relPath);
    const raw = fs.readFileSync(absPath, 'utf8');
    const { frontmatter, body } = parseFrontmatter(raw);
    const synthesis = extractCompiledSynthesis(body);
    const subSyntheses = extractSubSectionSyntheses(body);
    const baseId = path.basename(relPath, '.md');
    const id = frontmatter.id || baseId;

    const record = {
      id,
      slug: baseId,
      relPath,
      title: frontmatter.title || baseId,
      type: frontmatter.type || 'page',
      hub_id: frontmatter.hub_id || null,
      hub_roman: frontmatter.hub_roman || null,
      variables_clave: Array.isArray(frontmatter.variables_clave) ? frontmatter.variables_clave : [],
      fuentes_oficiales: Array.isArray(frontmatter.fuentes_oficiales) ? frontmatter.fuentes_oficiales : [],
      updated_at: frontmatter.updated_at || '2026-11-23',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      synthesis,
      conceptualBrief: synthesis,
      verifiedSynthesis: synthesis
    };

    if (relPath.startsWith('conceptos/')) {
      conceptsById[baseId] = record;
      conceptsById[id] = record;
      const aliases = Array.isArray(frontmatter.aliases) ? frontmatter.aliases : [];
      for (const alias of aliases) {
        const subText = subSyntheses[alias] || synthesis;
        conceptsById[alias] = Object.assign({}, record, {
          id: alias,
          synthesis: subText,
          conceptualBrief: subText,
          verifiedSynthesis: subText
        });
      }
      for (const [subKey, subText] of Object.entries(subSyntheses)) {
        if (!conceptsById[subKey]) {
          conceptsById[subKey] = Object.assign({}, record, {
            id: subKey,
            synthesis: subText,
            conceptualBrief: subText,
            verifiedSynthesis: subText
          });
        }
      }
    } else if (relPath.startsWith('hubs/')) {
      hubsById[baseId] = record;
      if (frontmatter.hub_id) hubsById[frontmatter.hub_id] = record;
      if (frontmatter.hub_roman) hubsById[frontmatter.hub_roman] = record;
    } else if (relPath.startsWith('comunas/')) {
      comunasById[baseId] = record;
      comunasById[id] = record;
    } else if (relPath.startsWith('nodos/')) {
      nodosById[baseId] = record;
    } else if (relPath.startsWith('adr/')) {
      adrsById[baseId] = record;
    }
  }

  const compiledPayload = {
    generatedAt: '2026-11-23T00:00:00.000Z',
    totalPages: mdFiles.length,
    conceptsById,
    hubsById,
    comunasById,
    nodosById,
    adrsById
  };

  const jsOutput = [
    '/**',
    ' * data/aysen_wiki_compiled.js',
    ' * Bundle pre-compilado de la Wiki Territorial de Aysén Sistémico (Workflow llm-wiki de Karpathy + Obsidian Vault).',
    ' * Generado automáticamente por: node scripts/obsidian_wiki_bridge.cjs --compile',
    ' */',
    '(function (root) {',
    "  'use strict';",
    `  const compiled = ${JSON.stringify(compiledPayload, null, 2)};`,
    '  if (root) {',
    '    root.AYSEN_WIKI_COMPILED = compiled;',
    '  }',
    "  if (typeof module === 'object' && module.exports) {",
    '    module.exports = compiled;',
    '  }',
    "})(typeof window !== 'undefined' ? window : globalThis);",
    ''
  ].join('\n');

  fs.writeFileSync(COMPILED_WIKI_PATH, jsOutput.replace(/\r\n/g, '\n'), 'utf8');

  if (!silent) {
    console.log(
      `[obsidian_wiki_bridge --compile] Generado data/aysen_wiki_compiled.js ` +
      `(${compiledPayload.totalPages} páginas, ${Object.keys(conceptsById).length} entradas conceptuales, ` +
      `${Object.keys(adrsById).length} ADRs).`
    );
  }

  return compiledPayload;
}

function resolveVaultTargetDir(explicitVaultPath) {
  let baseVault = explicitVaultPath || process.env.OBSIDIAN_VAULT_PATH || null;
  if (!baseVault && fs.existsSync(BRIDGE_CONFIG_PATH)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(BRIDGE_CONFIG_PATH, 'utf8'));
      if (cfg && cfg.vaultPath) baseVault = cfg.vaultPath;
    } catch (_) {
      // ignore malformed config
    }
  }
  if (!baseVault && fs.existsSync(DEFAULT_GDRIVE_VAULT_PATH)) {
    baseVault = DEFAULT_GDRIVE_VAULT_PATH;
  }
  if (!baseVault) {
    throw new Error('No se especificó ruta de Obsidian Vault (--vault-path, OBSIDIAN_VAULT_PATH ni .obsidian_bridge.json).');
  }
  const resolvedBase = path.resolve(baseVault);
  // Si la ruta ya termina en Aysen_Sistemico, usarla directamente; si es la raíz del Vault, usar subcarpeta Aysen_Sistemico
  const targetDir = path.basename(resolvedBase) === 'Aysen_Sistemico'
    ? resolvedBase
    : path.join(resolvedBase, 'Aysen_Sistemico');

  return {
    vaultRoot: resolvedBase,
    targetDir
  };
}

function copyFilePreservingMtime(srcFile, destFile) {
  const dir = path.dirname(destFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const content = fs.readFileSync(srcFile, 'utf8').replace(/\r\n/g, '\n');
  fs.writeFileSync(destFile, content, 'utf8');
  try {
    const stat = fs.statSync(srcFile);
    fs.utimesSync(destFile, stat.atime, stat.mtime);
  } catch (_) {
    // ignore utimes issues on virtual drives
  }
}

function syncToVault(explicitVaultPath, options = {}) {
  const silent = Boolean(options.silent);
  const { vaultRoot, targetDir } = resolveVaultTargetDir(explicitVaultPath);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const mdFiles = listMarkdownFiles(WIKI_DIR);
  let copiedCount = 0;

  for (const relPath of mdFiles) {
    const src = path.join(WIKI_DIR, relPath);
    const dest = path.join(targetDir, relPath);
    copyFilePreservingMtime(src, dest);
    copiedCount++;
  }

  const srcGraph = path.join(WIKI_DIR, '.obsidian', 'graph.json');
  if (fs.existsSync(srcGraph)) {
    const destGraph = path.join(targetDir, '.obsidian', 'graph.json');
    copyFilePreservingMtime(srcGraph, destGraph);
  }

  if (!silent) {
    console.log(
      `[obsidian_wiki_bridge --sync-to-vault] Sincronizadas ${copiedCount} notas Markdown y .obsidian/graph.json ` +
      `hacia "${targetDir}" (Vault: "${vaultRoot}").`
    );
  }

  return {
    vaultRoot,
    targetDir,
    copiedCount
  };
}

function pullFromVault(explicitVaultPath, options = {}) {
  const silent = Boolean(options.silent);
  const { vaultRoot, targetDir } = resolveVaultTargetDir(explicitVaultPath);

  if (!fs.existsSync(targetDir)) {
    throw new Error(`No existe la carpeta Aysen_Sistemico en el Vault: "${targetDir}"`);
  }

  const vaultMdFiles = listMarkdownFiles(targetDir);
  let pulledCount = 0;

  for (const relPath of vaultMdFiles) {
    const src = path.join(targetDir, relPath);
    const dest = path.join(WIKI_DIR, relPath);
    copyFilePreservingMtime(src, dest);
    pulledCount++;
  }

  const lintResult = lintWikiAndBundle({ silent });
  if (!lintResult.ok) {
    throw new Error(`El Linter falló tras importar desde el Vault (${lintResult.errors.length} errores).`);
  }

  const compiled = compileWikiToBundle({ silent });

  if (!silent) {
    console.log(
      `[obsidian_wiki_bridge --pull-from-vault] Importadas ${pulledCount} notas desde "${targetDir}", ` +
      `validadas con --lint y compiladas en data/aysen_wiki_compiled.js.`
    );
  }

  return {
    vaultRoot,
    targetDir,
    pulledCount,
    lintResult,
    compiled
  };
}

function putNoteViaRestApi(apiUrl, token, relativePath, markdownContent) {
  return new Promise((resolve, reject) => {
    const base = String(apiUrl || 'http://127.0.0.1:27123').replace(/\/+$/, '');
    const urlObj = new URL(`${base}/vault/Aysen_Sistemico/${relativePath}`);
    const lib = urlObj.protocol === 'https:' ? https : http;
    const bodyBuffer = Buffer.from(String(markdownContent || ''), 'utf8');

    const headers = {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Length': bodyBuffer.length
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const req = lib.request(
      {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'PUT',
        headers,
        rejectUnauthorized: false
      },
      res => {
        let respBody = '';
        res.on('data', chunk => {
          respBody += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ statusCode: res.statusCode, body: respBody });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${respBody}`));
          }
        });
      }
    );

    req.on('error', err => reject(err));
    req.write(bodyBuffer);
    req.end();
  });
}

async function syncViaRestApi(apiUrl, token, options = {}) {
  const silent = Boolean(options.silent);
  const endpoint = apiUrl || process.env.OBSIDIAN_REST_API_URL || 'http://127.0.0.1:27123';
  const authToken = token || process.env.OBSIDIAN_REST_API_KEY || '';
  const mdFiles = listMarkdownFiles(WIKI_DIR);
  let sentCount = 0;

  for (const relPath of mdFiles) {
    const content = fs.readFileSync(path.join(WIKI_DIR, relPath), 'utf8');
    await putNoteViaRestApi(endpoint, authToken, relPath, content);
    sentCount++;
  }

  if (!silent) {
    console.log(`[obsidian_wiki_bridge --sync-rest-api] Sincronizadas ${sentCount} notas vía PUT ${endpoint}/vault/Aysen_Sistemico/*`);
  }
  return { endpoint, sentCount };
}

function parseCliArgs(argv) {
  const args = {
    compile: false,
    lint: false,
    syncToVault: false,
    pullFromVault: false,
    syncRestApi: false,
    vaultPath: null,
    apiUrl: null,
    token: null
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--compile') args.compile = true;
    else if (a === '--lint') args.lint = true;
    else if (a === '--sync-to-vault') args.syncToVault = true;
    else if (a === '--pull-from-vault') args.pullFromVault = true;
    else if (a === '--sync-rest-api') args.syncRestApi = true;
    else if (a === '--vault-path' && argv[i + 1]) {
      args.vaultPath = argv[++i];
    } else if (a === '--api-url' && argv[i + 1]) {
      args.apiUrl = argv[++i];
    } else if (a === '--token' && argv[i + 1]) {
      args.token = argv[++i];
    }
  }
  return args;
}

async function runCli() {
  const args = parseCliArgs(process.argv.slice(2));
  if (!args.compile && !args.lint && !args.syncToVault && !args.pullFromVault && !args.syncRestApi) {
    args.lint = true;
    args.compile = true;
  }

  if (args.lint) {
    const res = lintWikiAndBundle();
    if (!res.ok) process.exit(1);
  }
  if (args.compile) {
    compileWikiToBundle();
  }
  if (args.syncToVault) {
    syncToVault(args.vaultPath);
  }
  if (args.pullFromVault) {
    pullFromVault(args.vaultPath);
  }
  if (args.syncRestApi) {
    await syncViaRestApi(args.apiUrl, args.token);
  }
}

if (require.main === module) {
  runCli().catch(err => {
    console.error('[obsidian_wiki_bridge] Error:', err.message);
    process.exit(1);
  });
}

module.exports = {
  lintWikiAndBundle,
  compileWikiToBundle,
  syncToVault,
  pullFromVault,
  syncViaRestApi,
  parseFrontmatter,
  extractCompiledSynthesis,
  listMarkdownFiles
};
