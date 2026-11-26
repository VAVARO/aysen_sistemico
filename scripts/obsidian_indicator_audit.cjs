#!/usr/bin/env node
/**
 * scripts/obsidian_indicator_audit.cjs (Versión 2)
 * Registro automático de cambios y respaldos en Obsidian por indicador para Aysén Sistémico.
 *
 * Cobertura V2:
 *   - 10 comunas (`dataLake.comunas`, 237 indicadores)
 *   - 18 Barrios ACS (`dataLake.barriosAcs`, 8 variables numéricas por barrio)
 *   - 13 Holdings salmoneros (`dataLake.holdings`, 7 variables clave por holding)
 *   - Invariantes del padrón acuícola (`dataLake.concesionesPadronCompact` vs `padron_real_subpesca_aysen.json`)
 *   - Último corte anual de `dataLake.series` y `dataLake.seriesAcuiculturaAnual`
 *
 * Umbrales diferenciados de outlier:
 *   - 5% estricto para variables estructurales/catastrales (`poblacion_*`, `concesiones_*`,
 *     `ecmpo_*`, `superficie_*`, establecimientos de salud/educación, etc.)
 *   - 20% por defecto para variables operativas/de flujo (biomasa, desembarques, presupuestos, etc.)
 *   - Siempre alerta ante transiciones `0 <-> valor`, cambio de signo o nulos.
 *
 * No modifica `wiki/` (77 páginas canónicas) ni `data/aysen_hubs_data.js`.
 *
 * Uso:
 *   node scripts/obsidian_indicator_audit.cjs --against-git HEAD~1 --sync-to-vault
 *   node scripts/obsidian_indicator_audit.cjs --sync-to-vault --no-fail-missing-vault
 *   node scripts/obsidian_indicator_audit.cjs --approve-latest --sync-to-vault
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const cp = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_BUNDLE_PATH = path.join(ROOT_DIR, 'data', 'aysen_hubs_data.js');
const LEXICON_PATH = path.join(ROOT_DIR, 'data', 'nl_lexicon_aysen.json');
const PROVENANCE_PATH = path.join(ROOT_DIR, 'data', 'systemic', 'provenance_catalog.json');
const AUTO_UPDATE_STATUS_PATH = path.join(ROOT_DIR, 'data', 'systemic', 'auto_update_status.json');
const PADRON_REAL_PATH = path.join(ROOT_DIR, 'data', 'raw', 'territorio_concesiones', 'padron_real_subpesca_aysen.json');
const DEFAULT_OUT_DIR = path.join(ROOT_DIR, 'auditoria_obsidian');
const DEFAULT_VAULT_ROOT = path.resolve(ROOT_DIR, '..', 'Obsidian Vault');
const VAULT_SUBFOLDER = 'Aysen_Sistemico_Auditoria';

const IDENTITY_KEYS = new Set([
  'id',
  'comuna_ine',
  'codigo_comuna',
  'nombre',
  'nombre_comuna',
  'provincia',
  'cabecera',
  'cuenca_bna'
]);

const CANONICAL_HUB_TITLES = {
  turismo: 'I. Turismo y Áreas Silvestres',
  salmonicultura: 'II. Pesca, Acuicultura y Mar',
  energia: 'III. Energía y Telecomunicaciones',
  gobernanza: 'IV. Gobernanza y Finanzas',
  inversion: 'V. Economía, Inversión y Suelo',
  social: 'VI. Demografía, Educación y Sociedad',
  biodiversidad: 'VII. Biodiversidad, Clima y Riesgos',
  salud: 'VIII. Salud',
  cultura: 'IX. Cultura y Patrimonio',
  ctci: 'X. CTCi e Innovación'
};

// Variables estructurales/catastrales: umbral estricto del 5%
const STRUCTURAL_PREFIXES = [
  'poblacion_',
  'concesiones_salmon',
  'concesiones_acuicolas_',
  'concesiones_en_snaspe',
  'ecmpo_',
  'superficie_',
  'establecimientos_',
  'hospitales_',
  'postas_',
  'cesfam_',
  'escuelas_',
  'liceos_',
  'camas_',
  'centros_salud',
  'museos_',
  'bibliotecas_',
  'centros_culturales_',
  'total_espacios_culturales',
  'holdings_operadores_',
  'acs_concesiones_',
  'holding_total_concesiones',
  'holding_concesiones_snaspe',
  'padron_total_concesiones',
  'padron_en_snaspe',
  'padron_raw_subpesca_',
  'snaspe_superficie_',
  'snaspe_guardaparques_',
  'snaspe_concesiones_'
];

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

function isStructuralIndicator(key) {
  const k = String(key || '').toLowerCase();
  return STRUCTURAL_PREFIXES.some(pref => k === pref || k.startsWith(pref));
}

function getOutlierThresholdForKey(key, options = {}) {
  const structuralPct = Number.isFinite(options.structuralOutlierPct) ? options.structuralOutlierPct : 5;
  const operationalPct = Number.isFinite(options.outlierPctThreshold) ? options.outlierPctThreshold : 20;
  if (isStructuralIndicator(key)) {
    return { pct: structuralPct, tier: 'estructural' };
  }
  return { pct: operationalPct, tier: 'operativo' };
}

function loadBundleFromCode(code) {
  const ctx = { window: {}, globalThis: {} };
  vm.runInNewContext(code, ctx);
  const data = ctx.window.AYSEN_HUBS_DATA || ctx.globalThis.AYSEN_HUBS_DATA;
  if (!data || !Array.isArray(data.comunas) || data.comunas.length === 0) {
    throw new Error('El bundle no contiene window.AYSEN_HUBS_DATA.comunas válido.');
  }
  return data;
}

function loadBundleFromFile(filePath) {
  return loadBundleFromCode(fs.readFileSync(filePath, 'utf8'));
}

function loadBundleFromGitRef(gitRef, cwd = ROOT_DIR) {
  const safeRef = String(gitRef || '').trim();
  if (!/^[a-zA-Z0-9._~^/-]+$/.test(safeRef)) {
    throw new Error(`Referencia git inválida: "${safeRef}"`);
  }
  try {
    const code = cp.execFileSync('git', ['show', `${safeRef}:data/aysen_hubs_data.js`], {
      cwd,
      maxBuffer: 30 * 1024 * 1024,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    return loadBundleFromCode(code);
  } catch (err) {
    const baselinePath = path.join(cwd, 'auditoria_obsidian', 'snapshots', 'baseline_snapshot.json');
    const baselineSnap = readJsonSafe(baselinePath, null);
    if (baselineSnap && baselineSnap.indicators) {
      return { __isBaselineSnapshot: true, snapshot: baselineSnap };
    }
    throw err;
  }
}

function readJsonSafe(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {
    return fallback;
  }
}

function buildMetadataCatalog(options = {}) {
  const lexicon = options.lexicon || readJsonSafe(LEXICON_PATH, { variables: [] });
  const provenance = options.provenance || readJsonSafe(PROVENANCE_PATH, { nodes: [] });

  const nodeMap = new Map();
  for (const n of (provenance && Array.isArray(provenance.nodes) ? provenance.nodes : [])) {
    nodeMap.set(Number(n.nodeId || n.id), n);
  }

  const varMap = new Map();
  const varsList = Array.isArray(lexicon && lexicon.variables) ? lexicon.variables : [];
  for (const v of varsList) {
    if (!v || !v.id) continue;
    const nodeInfo = v.nodeId != null ? nodeMap.get(Number(v.nodeId)) : null;
    const hubKey = v.hub || (nodeInfo && nodeInfo.hubId) || 'sin_hub';
    const canonicalHubTitle = CANONICAL_HUB_TITLES[hubKey] || v.hubTitle || 'Sin Hub asignado';
    varMap.set(v.id, {
      id: v.id,
      name: v.name || v.id,
      shortName: v.shortName || v.name || v.id,
      unit: v.unit || '',
      hub: hubKey,
      hubTitle: canonicalHubTitle,
      nodeId: v.nodeId != null ? Number(v.nodeId) : null,
      sourceEntity: (nodeInfo && nodeInfo.provenance && nodeInfo.provenance.sourceEntity) || 'No documentado en provenance_catalog.json',
      sourceUrl: (nodeInfo && nodeInfo.provenance && nodeInfo.provenance.sourceUrl) || '',
      updateFrequency: (nodeInfo && nodeInfo.provenance && nodeInfo.provenance.updateFrequency) || 'No especificada',
      extractionMode: (nodeInfo && nodeInfo.provenance && nodeInfo.provenance.extractionMode) || 'no_especificado',
      inLexicon: true
    });
  }

  return { varMap, nodeMap };
}

function extractAdditionalScopes(dataLake, options = {}) {
  const scopes = {
    barriosAcs: {},
    unidadesSnaspe: {},
    holdings: {},
    padronInvariants: {},
    seriesLatest: {}
  };

  // a) Barrios ACS (N=18)
  if (Array.isArray(dataLake.barriosAcs) && dataLake.barriosAcs.length > 0) {
    const acsFields = [
      'concesiones_totales',
      'centros_activos',
      'concesiones_en_snaspe',
      'biomasa_cosechada_ton',
      'antibioticos_ica_g_ton',
      'mortalidad_ciclo_pct',
      'densidad_max_kg_m3',
      'infa_aerobica_pct'
    ];
    for (const f of acsFields) {
      const values = {};
      for (const b of dataLake.barriosAcs) {
        const code = String(b.codigo_acs || b.nombre_sector || '');
        if (code && b[f] !== undefined) {
          values[code] = b[f];
        }
      }
      scopes.barriosAcs[`acs_${f}`] = { type: 'numeric', values };
    }
  }

  // a2) Unidades SNASPE (N=19)
  if (Array.isArray(dataLake.unidadesSnaspe) && dataLake.unidadesSnaspe.length > 0) {
    const snaspeFields = [
      'superficie_ha',
      'visitantes_anuales_n',
      'guardaparques_permanentes_n',
      'concesiones_salmon_dentro_n',
      'superficie_salmon_ha',
      'inversion_pdze_mclp'
    ];
    for (const f of snaspeFields) {
      const values = {};
      for (const u of dataLake.unidadesSnaspe) {
        const code = String(u.id || u.nombre || '');
        if (code && u[f] !== undefined) {
          values[code] = u[f];
        }
      }
      scopes.unidadesSnaspe[`snaspe_${f}`] = { type: 'numeric', values };
    }
  }

  // b) Holdings salmoneros (N=13)
  if (Array.isArray(dataLake.holdings) && dataLake.holdings.length > 0) {
    const holdingFields = [
      'total_concesiones_aysen',
      'centros_activos_estimados',
      'concesiones_snaspe',
      'biomasa_estimada_ton',
      'sancionatorios_sma_snifa',
      'centros_activos_padron',
      'biomasa_padron_ton'
    ];
    for (const f of holdingFields) {
      const values = {};
      for (const h of dataLake.holdings) {
        const hid = String(h.nombre_fantasia || h.holding_id || '');
        if (hid && h[f] !== undefined) {
          values[hid] = h[f];
        }
      }
      scopes.holdings[`holding_${f}`] = { type: 'numeric', values };
    }
  }

  // c) Invariantes agregados de concesionesPadronCompact vs padron_real_subpesca_aysen.json
  const padron = dataLake.concesionesPadronCompact;
  if (padron && typeof padron === 'object') {
    const inv = {
      padron_total_concesiones: Number(padron.total || (Array.isArray(padron.rows) ? padron.rows.length : 0)),
      padron_activos: Number(padron.activos || 0),
      padron_inactivos: Number(padron.inactivos || 0),
      padron_en_snaspe: Number(padron.en_snaspe || 0)
    };
    const rawPadronPath = options.padronRealPath || PADRON_REAL_PATH;
    const rawPadron = readJsonSafe(rawPadronPath, null);
    if (rawPadron && Number.isFinite(Number(rawPadron.total_registros))) {
      inv.padron_raw_subpesca_poligonos = Number(rawPadron.total_registros);
    }
    for (const [k, v] of Object.entries(inv)) {
      scopes.padronInvariants[k] = { type: 'numeric', values: { regional: v } };
    }
  }

  // d) Último corte anual de series y seriesAcuiculturaAnual
  if (dataLake.series && typeof dataLake.series === 'object') {
    for (const [seriesKey, seriesVal] of Object.entries(dataLake.series)) {
      if (Array.isArray(seriesVal) && seriesVal.length > 0) {
        const last = seriesVal[seriesVal.length - 1];
        if (last && typeof last === 'object') {
          const period = String(last.periodo || last.ano || last.anio || last.year || 'ultimo');
          for (const [fk, fv] of Object.entries(last)) {
            if (typeof fv === 'number' && Number.isFinite(fv)) {
              scopes.seriesLatest[`serie_${seriesKey}__${fk}`] = {
                type: 'numeric',
                values: { [period]: fv }
              };
            }
          }
        }
      }
    }
  }

  if (Array.isArray(dataLake.seriesAcuiculturaAnual) && dataLake.seriesAcuiculturaAnual.length > 0) {
    const last = dataLake.seriesAcuiculturaAnual[dataLake.seriesAcuiculturaAnual.length - 1];
    if (last && typeof last === 'object') {
      const period = String(last.ano || last.anio || 'ultimo');
      const flatten = (obj, prefix) => {
        for (const [fk, fv] of Object.entries(obj)) {
          if (fk === 'ano' || fk === 'anio') continue;
          if (typeof fv === 'number' && Number.isFinite(fv)) {
            scopes.seriesLatest[`${prefix}__${fk}`] = {
              type: 'numeric',
              values: { [period]: fv }
            };
          } else if (fv && typeof fv === 'object' && !Array.isArray(fv)) {
            flatten(fv, `${prefix}_${fk}`);
          }
        }
      };
      flatten(last, 'serie_acuicultura');
    }
  }

  return scopes;
}

function extractSnapshotFromBundle(dataLake, label = 'current', options = {}) {
  if (dataLake && dataLake.__isBaselineSnapshot && dataLake.snapshot) {
    return dataLake.snapshot;
  }
  const lexiconJson = readJsonSafe(options.lexiconPath || LEXICON_PATH, { variables: [] });
  const aliasKeys = new Set(
    (Array.isArray(lexiconJson.variables) ? lexiconJson.variables : [])
      .filter(v => v && v.isAliasOf)
      .map(v => v.id)
  );
  const comunas = dataLake.comunas.map(c => ({
    comuna_ine: String(c.comuna_ine || c.codigo_comuna || ''),
    nombre: String(c.nombre || c.nombre_comuna || '')
  }));

  const allKeys = Object.keys(dataLake.comunas[0] || {});
  const indicators = {};

  for (const key of allKeys) {
    if (IDENTITY_KEYS.has(key) || aliasKeys.has(key)) continue;
    const values = {};
    let isNumeric = false;
    for (const row of dataLake.comunas) {
      const ine = String(row.comuna_ine || row.codigo_comuna || '');
      const val = row[key];
      if (typeof val === 'number' && Number.isFinite(val)) {
        isNumeric = true;
      }
      values[ine] = val === undefined ? null : val;
    }
    indicators[key] = {
      type: isNumeric ? 'numeric' : 'categorical',
      values
    };
  }

  const scopes = extractAdditionalScopes(dataLake, options);

  return {
    schemaVersion: '2.0.0',
    label,
    capturedAt: new Date().toISOString(),
    bundleGeneratedAt: dataLake.generatedAt || null,
    autoUpdateMeta: (dataLake.meta && dataLake.meta.autoUpdate) || null,
    comunas,
    totalKeys: allKeys.length,
    indicatorCount: Object.keys(indicators).length,
    indicators,
    scopes
  };
}

function formatNumberCL(val) {
  if (val === null || val === undefined) return 'N/D';
  if (typeof val !== 'number' || !Number.isFinite(val)) return String(val);
  const abs = Math.abs(val);
  const decimals = Number.isInteger(val) ? 0 : (abs < 10 ? 2 : 1);
  return val.toLocaleString('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function formatPct(pct) {
  if (pct === null || pct === undefined || !Number.isFinite(pct)) return 'N/A (desde 0)';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1).replace('.', ',')}%`;
}

function evaluateCellDelta(key, prevVal, currVal, options) {
  const { pct: thresholdPct, tier } = getOutlierThresholdForKey(key, options);
  let deltaAbs = null;
  let deltaPct = null;
  let isOutlier = false;
  let outlierReason = '';

  if (typeof prevVal === 'number' && typeof currVal === 'number') {
    deltaAbs = currVal - prevVal;
    if (prevVal === 0 && currVal !== 0) {
      deltaPct = null;
      isOutlier = true;
      outlierReason = `Transición desde 0 a ${formatNumberCL(currVal)}`;
    } else if (prevVal !== 0 && currVal === 0) {
      deltaPct = -100;
      isOutlier = true;
      outlierReason = `Caída a 0 desde ${formatNumberCL(prevVal)}`;
    } else if (prevVal !== 0) {
      deltaPct = (deltaAbs / Math.abs(prevVal)) * 100;
      if (Math.sign(prevVal) !== Math.sign(currVal)) {
        isOutlier = true;
        outlierReason = `Cambio de signo (${formatNumberCL(prevVal)} -> ${formatNumberCL(currVal)})`;
      } else if (Math.abs(deltaPct) >= thresholdPct) {
        isOutlier = true;
        outlierReason = `Variación de ${formatPct(deltaPct)} (umbral ${tier} >= ${thresholdPct}%)`;
      }
    }
  } else if ((prevVal === null) !== (currVal === null)) {
    isOutlier = true;
    outlierReason = prevVal === null ? 'Aparición de dato antes nulo' : 'Dato pasó a nulo';
  }

  return { deltaAbs, deltaPct, isOutlier, outlierReason, thresholdPct, tier };
}

function compareAdditionalScopes(baselineScopes = {}, currentScopes = {}, options = {}) {
  const scopeNames = [
    { id: 'barriosAcs', label: 'Barrios ACS (N=18)', hubTitle: CANONICAL_HUB_TITLES.salmonicultura },
    { id: 'unidadesSnaspe', label: 'Unidades SNASPE (N=19)', hubTitle: CANONICAL_HUB_TITLES.turismo },
    { id: 'holdings', label: 'Holdings Salmoneros (N=13)', hubTitle: CANONICAL_HUB_TITLES.salmonicultura },
    { id: 'padronInvariants', label: 'Invariantes Padrón SUBPESCA', hubTitle: CANONICAL_HUB_TITLES.salmonicultura },
    { id: 'seriesLatest', label: 'Series Anuales (Último Corte)', hubTitle: 'Series Históricas Regionales' }
  ];

  const summary = [];
  const changes = [];
  const alerts = [];

  for (const sc of scopeNames) {
    const bMap = (baselineScopes && baselineScopes[sc.id]) || {};
    const cMap = (currentScopes && currentScopes[sc.id]) || {};
    const bKeys = new Set(Object.keys(bMap));
    const cKeys = new Set(Object.keys(cMap));
    const allKeys = Array.from(new Set([...bKeys, ...cKeys])).sort();

    let modifiedCount = 0;
    let addedCount = 0;
    let removedCount = 0;
    let unchangedCount = 0;

    for (const key of allKeys) {
      const inB = bKeys.has(key);
      const inC = cKeys.has(key);
      if (!inB && inC) {
        addedCount++;
        changes.push({ scope: sc.label, key, status: 'agregada', entity: 'múltiples', prev: null, curr: Object.keys(cMap[key].values || {}).length + ' registros', deltaPct: null, isOutlier: false });
        continue;
      }
      if (inB && !inC) {
        removedCount++;
        changes.push({ scope: sc.label, key, status: 'eliminada', entity: 'múltiples', prev: Object.keys(bMap[key].values || {}).length + ' registros', curr: null, deltaPct: -100, isOutlier: true });
        alerts.push({
          severity: 'ALTA',
          code: 'VARIABLE_ELIMINADA',
          indicator: key,
          hub: sc.label,
          detail: `Indicador "${key}" desapareció en el ámbito ${sc.label}.`
        });
        continue;
      }

      const bVals = bMap[key].values || {};
      const cVals = cMap[key].values || {};
      const entities = Array.from(new Set([...Object.keys(bVals), ...Object.keys(cVals)])).sort();
      let changedHere = false;

      for (const ent of entities) {
        const pv = bVals[ent] === undefined ? null : bVals[ent];
        const cv = cVals[ent] === undefined ? null : cVals[ent];
        if (JSON.stringify(pv) === JSON.stringify(cv)) continue;
        changedHere = true;
        const evalRes = evaluateCellDelta(key, pv, cv, options);
        changes.push({
          scope: sc.label,
          key,
          status: 'modificada',
          entity: ent,
          prev: pv,
          curr: cv,
          deltaAbs: evalRes.deltaAbs,
          deltaPct: evalRes.deltaPct,
          isOutlier: evalRes.isOutlier,
          outlierReason: evalRes.outlierReason
        });
        if (evalRes.isOutlier) {
          alerts.push({
            severity: 'ALTA',
            code: 'OUTLIER_SALTO',
            indicator: key,
            hub: sc.label,
            detail: `${ent}: ${formatNumberCL(pv)} -> ${formatNumberCL(cv)} (${evalRes.outlierReason})`
          });
        }
      }

      if (changedHere) modifiedCount++;
      else unchangedCount++;
    }

    summary.push({
      id: sc.id,
      label: sc.label,
      totalCurrent: cKeys.size,
      modified: modifiedCount,
      added: addedCount,
      removed: removedCount,
      unchanged: unchangedCount
    });
  }

  return { summary, changes, alerts };
}

function compareSnapshots(baseline, current, options = {}) {
  const outlierPctThreshold = Number.isFinite(options.outlierPctThreshold) ? options.outlierPctThreshold : 20;
  const structuralOutlierPct = Number.isFinite(options.structuralOutlierPct) ? options.structuralOutlierPct : 5;
  const thresholdOpts = { outlierPctThreshold, structuralOutlierPct };
  const catalog = options.catalog || buildMetadataCatalog();
  const autoUpdateStatus = options.autoUpdateStatus !== undefined
    ? options.autoUpdateStatus
    : readJsonSafe(AUTO_UPDATE_STATUS_PATH, null);

  const comunaNameByIne = new Map();
  for (const c of current.comunas) comunaNameByIne.set(c.comuna_ine, c.nombre);
  for (const c of (baseline.comunas || [])) {
    if (!comunaNameByIne.has(c.comuna_ine)) comunaNameByIne.set(c.comuna_ine, c.nombre);
  }

  const baseKeys = new Set(Object.keys(baseline.indicators || {}));
  const currKeys = new Set(Object.keys(current.indicators || {}));
  const allKeys = Array.from(new Set([...baseKeys, ...currKeys])).sort();

  const added = [];
  const removed = [];
  const modified = [];
  const unchanged = [];
  const verificationAlerts = [];

  function getMeta(key) {
    const found = catalog.varMap.get(key);
    if (found) return found;
    return {
      id: key,
      name: key,
      shortName: key,
      unit: '',
      hub: 'sin_clasificar',
      hubTitle: 'Sin clasificar en léxico oficial',
      nodeId: null,
      sourceEntity: 'No registrado en nl_lexicon_aysen.json',
      sourceUrl: '',
      updateFrequency: 'No especificada',
      extractionMode: 'no_especificado',
      inLexicon: false
    };
  }

  for (const key of allKeys) {
    const meta = getMeta(key);
    const inBase = baseKeys.has(key);
    const inCurr = currKeys.has(key);
    const { pct: appliedThreshold, tier: thresholdTier } = getOutlierThresholdForKey(key, thresholdOpts);

    if (!inBase && inCurr) {
      const currInd = current.indicators[key];
      const nonZeroComunas = Object.entries(currInd.values)
        .filter(([, v]) => typeof v === 'number' ? v !== 0 : Boolean(v));
      added.push({
        key,
        status: 'agregada',
        type: currInd.type,
        thresholdTier,
        appliedThreshold,
        meta,
        nonZeroCount: nonZeroComunas.length,
        changes: Object.entries(currInd.values).map(([ine, v]) => ({
          comuna_ine: ine,
          comuna: comunaNameByIne.get(ine) || ine,
          prev: null,
          curr: v,
          deltaAbs: typeof v === 'number' ? v : null,
          deltaPct: null,
          isOutlier: false,
          outlierReason: ''
        }))
      });

      if (!meta.inLexicon && currInd.type === 'numeric') {
        verificationAlerts.push({
          severity: 'MEDIA',
          code: 'SIN_TRAZABILIDAD_LEXICO',
          indicator: key,
          hub: meta.hubTitle,
          detail: `Indicador numérico nuevo sin ficha en nl_lexicon_aysen.json (${nonZeroComunas.length} comunas con valor distinto de 0). Registrar unidad, Hub y fuente antes de cruzarlo.`
        });
      }
      continue;
    }

    if (inBase && !inCurr) {
      const baseInd = baseline.indicators[key];
      removed.push({
        key,
        status: 'eliminada',
        type: baseInd.type,
        thresholdTier,
        appliedThreshold,
        meta,
        changes: Object.entries(baseInd.values).map(([ine, v]) => ({
          comuna_ine: ine,
          comuna: comunaNameByIne.get(ine) || ine,
          prev: v,
          curr: null,
          deltaAbs: typeof v === 'number' ? -v : null,
          deltaPct: -100,
          isOutlier: true,
          outlierReason: 'Variable eliminada del Data Lake'
        }))
      });
      verificationAlerts.push({
        severity: 'ALTA',
        code: 'VARIABLE_ELIMINADA',
        indicator: key,
        hub: meta.hubTitle,
        detail: `La variable "${key}" existía en el baseline y desapareció en la corrida actual. Verificar si fue renombrada o eliminada por error.`
      });
      continue;
    }

    const baseInd = baseline.indicators[key];
    const currInd = current.indicators[key];
    const comunaInes = Array.from(new Set([
      ...Object.keys(baseInd.values || {}),
      ...Object.keys(currInd.values || {})
    ])).sort();

    const cellChanges = [];
    let hasOutlier = false;

    for (const ine of comunaInes) {
      const prevVal = baseInd.values[ine] === undefined ? null : baseInd.values[ine];
      const currVal = currInd.values[ine] === undefined ? null : currInd.values[ine];
      if (JSON.stringify(prevVal) === JSON.stringify(currVal)) continue;

      const evalRes = evaluateCellDelta(key, prevVal, currVal, thresholdOpts);
      if (evalRes.isOutlier) hasOutlier = true;

      cellChanges.push({
        comuna_ine: ine,
        comuna: comunaNameByIne.get(ine) || ine,
        prev: prevVal,
        curr: currVal,
        deltaAbs: evalRes.deltaAbs,
        deltaPct: evalRes.deltaPct,
        isOutlier: evalRes.isOutlier,
        outlierReason: evalRes.outlierReason
      });
    }

    if (cellChanges.length === 0) {
      unchanged.push({ key, status: 'sin_cambios', type: currInd.type, meta });
    } else {
      modified.push({
        key,
        status: 'modificada',
        type: currInd.type,
        thresholdTier,
        appliedThreshold,
        meta,
        hasOutlier,
        changes: cellChanges
      });

      if (hasOutlier) {
        const outlierCells = cellChanges.filter(c => c.isOutlier);
        const detailStr = outlierCells
          .map(c => `${c.comuna}: ${formatNumberCL(c.prev)} -> ${formatNumberCL(c.curr)} (${c.outlierReason})`)
          .join('; ');
        verificationAlerts.push({
          severity: 'ALTA',
          code: 'OUTLIER_SALTO',
          indicator: key,
          hub: meta.hubTitle,
          detail: detailStr
        });
      }

      if (!meta.inLexicon && currInd.type === 'numeric') {
        verificationAlerts.push({
          severity: 'MEDIA',
          code: 'SIN_TRAZABILIDAD_LEXICO',
          indicator: key,
          hub: meta.hubTitle,
          detail: `Indicador modificado sin ficha en nl_lexicon_aysen.json. Verificar fuente y unidad.`
        });
      }
    }
  }

  // Comparar ámbitos adicionales (barriosAcs, holdings, padronInvariants, seriesLatest)
  const additionalScopes = compareAdditionalScopes(baseline.scopes, current.scopes, thresholdOpts);
  for (const scAlert of additionalScopes.alerts) {
    verificationAlerts.push(scAlert);
  }

  // Salud de conectores (revisión de 5 minutos)
  const connectorSummary = {
    available: Boolean(autoUpdateStatus),
    lastRun: (autoUpdateStatus && autoUpdateStatus.lastRun) || 'No disponible',
    liveApiCount: (autoUpdateStatus && autoUpdateStatus.summary && autoUpdateStatus.summary.live_api) || 0,
    fallbackCount: (autoUpdateStatus && autoUpdateStatus.summary && autoUpdateStatus.summary.curated_fallback) || 0,
    stagesRestored: (autoUpdateStatus && autoUpdateStatus.summary && autoUpdateStatus.summary.stages_restored) || 0,
    stagesSkipped: (autoUpdateStatus && autoUpdateStatus.summary && autoUpdateStatus.summary.stages_skipped) || 0,
    failedConnectors: []
  };

  if (autoUpdateStatus && Array.isArray(autoUpdateStatus.connectors)) {
    for (const conn of autoUpdateStatus.connectors) {
      if (!conn.ok || conn.mode === 'curated_fallback') {
        connectorSummary.failedConnectors.push({
          key: conn.key || conn.connector,
          mode: conn.mode || 'desconocido',
          httpStatus: conn.http_status,
          nodes: Array.isArray(conn.nodes) ? conn.nodes : [],
          error: conn.error || 'Sin detalle de error'
        });
      }
    }
  }

  if (connectorSummary.stagesRestored > 0) {
    verificationAlerts.push({
      severity: 'ALTA',
      code: 'ETAPA_RESTAURADA',
      indicator: 'pipeline_ingesta',
      hub: 'Infraestructura / Ingesta',
      detail: `${connectorSummary.stagesRestored} etapa(s) fueron restauradas por Circuit Breaker (Last-Known-Good) en la última corrida automática (${connectorSummary.lastRun}).`
    });
  }

  if (connectorSummary.failedConnectors.length > 0) {
    const names = connectorSummary.failedConnectors.map(c => c.key).join(', ');
    verificationAlerts.push({
      severity: 'MEDIA',
      code: 'CONECTOR_FALLBACK',
      indicator: 'pipeline_ingesta',
      hub: 'Infraestructura / Ingesta',
      detail: `${connectorSummary.failedConnectors.length} conector(es) operaron en curated_fallback: ${names}. Los datos previos se conservaron, pero conviene verificar si hubo actualización oficial pendiente.`
    });
  }

  const unchangedByHubMap = new Map();
  for (const item of unchanged) {
    const hubLabel = item.meta.hubTitle || 'Sin clasificar en léxico oficial';
    unchangedByHubMap.set(hubLabel, (unchangedByHubMap.get(hubLabel) || 0) + 1);
  }
  const unchangedByHub = Array.from(unchangedByHubMap.entries())
    .map(([hubTitle, count]) => ({ hubTitle, count }))
    .sort((a, b) => a.hubTitle.localeCompare(b.hubTitle));

  const highAlerts = verificationAlerts.filter(a => a.severity === 'ALTA');
  const medAlerts = verificationAlerts.filter(a => a.severity === 'MEDIA');
  const hasRemovedScope = additionalScopes.summary.some(s => s.removed > 0);
  let semaforo = 'VERDE';
  if (removed.length > 0 || hasRemovedScope || connectorSummary.stagesRestored > 0) {
    semaforo = 'ROJO';
  } else if (highAlerts.length > 0 || medAlerts.length > 0) {
    semaforo = 'AMARILLO';
  }

  return {
    runDate: new Date().toISOString().slice(0, 10),
    generatedAt: new Date().toISOString(),
    baselineLabel: baseline.label || 'baseline',
    currentLabel: current.label || 'current',
    outlierPctThreshold,
    structuralOutlierPct,
    semaforo,
    counts: {
      totalEvaluated: allKeys.length,
      baselineIndicators: baseKeys.size,
      currentIndicators: currKeys.size,
      modified: modified.length,
      added: added.length,
      removed: removed.length,
      unchanged: unchanged.length,
      alertsHigh: highAlerts.length,
      alertsMedium: medAlerts.length,
      alertsTotal: verificationAlerts.length
    },
    connectorSummary,
    modified,
    added,
    removed,
    unchanged,
    unchangedByHub,
    additionalScopes,
    verificationAlerts
  };
}

function sanitizeSlug(str) {
  return String(str || 'run')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'run';
}

function extractHumanNotesSection(existingContent) {
  if (!existingContent) return null;
  const marker = '## Revisión Humana (Notas Preservadas)';
  const idx = existingContent.indexOf(marker);
  if (idx === -1) return null;
  return existingContent.slice(idx).trim();
}

function renderRunNote(diff, runSlug) {
  const lines = [];
  lines.push('---');
  lines.push(`id: auditoria_corrida_${runSlug}`);
  lines.push(`title: "Auditoría de Corrida — ${diff.runDate} (${diff.baselineLabel} vs ${diff.currentLabel})"`);
  lines.push('type: auditoria_corrida');
  lines.push(`fecha: "${diff.runDate}"`);
  lines.push(`baseline: "${diff.baselineLabel}"`);
  lines.push(`actual: "${diff.currentLabel}"`);
  lines.push(`semaforo: "${diff.semaforo}"`);
  lines.push(`total_indicadores: ${diff.counts.currentIndicators}`);
  lines.push(`modificados: ${diff.counts.modified}`);
  lines.push(`agregados: ${diff.counts.added}`);
  lines.push(`eliminados: ${diff.counts.removed}`);
  lines.push(`sin_cambios: ${diff.counts.unchanged}`);
  lines.push(`alertas_alta: ${diff.counts.alertsHigh}`);
  lines.push(`alertas_media: ${diff.counts.alertsMedium}`);
  lines.push(`conectores_live_api: ${diff.connectorSummary.liveApiCount}`);
  lines.push(`conectores_fallback: ${diff.connectorSummary.fallbackCount}`);
  lines.push(`etapas_restauradas: ${diff.connectorSummary.stagesRestored}`);
  lines.push(`umbral_outlier_operativo_pct: ${diff.outlierPctThreshold}`);
  lines.push(`umbral_outlier_estructural_pct: ${diff.structuralOutlierPct}`);
  lines.push('estado_revision_humana: "pendiente"');
  lines.push('tags:');
  lines.push('  - aysen-sistemico');
  lines.push('  - auditoria-indicadores');
  lines.push(`  - semaforo-${diff.semaforo.toLowerCase()}`);
  lines.push('---');
  lines.push('');
  lines.push(`# Auditoría de Corrida de Indicadores — ${diff.runDate}`);
  lines.push('');
  lines.push(`Comparación determinista: \`${diff.baselineLabel}\` -> \`${diff.currentLabel}\` · Semáforo de revisión: **${diff.semaforo}**.`);
  lines.push('Índice maestro: [[index_auditoria|Índice de Auditoría de Indicadores]].');
  lines.push('');
  lines.push('## 1. Revisión Rápida (5 Minutos)');
  lines.push('');
  lines.push('| Dimensión de Control | Resultado | Señal |');
  lines.push('|---|---|---|');
  lines.push(`| Indicadores comunales evaluados | ${diff.counts.currentIndicators} actuales (${diff.counts.baselineIndicators} en baseline) | ${diff.counts.modified} modificados · ${diff.counts.added} agregados · ${diff.counts.removed} eliminados · ${diff.counts.unchanged} sin cambios |`);
  lines.push(`| Umbrales de salto brusco | Estructural >= ${diff.structuralOutlierPct}% · Operativo >= ${diff.outlierPctThreshold}% | + transiciones 0/nulo y cambios de signo |`);
  lines.push(`| Alertas para revisión humana | ${diff.counts.alertsTotal} (${diff.counts.alertsHigh} ALTA · ${diff.counts.alertsMedium} MEDIA) | Requiere cierre humano antes de merge a \`main\` si semáforo != VERDE |`);
  lines.push(`| Salud de conectores automáticos | ${diff.connectorSummary.liveApiCount} live_api · ${diff.connectorSummary.fallbackCount} curated_fallback | ${diff.connectorSummary.stagesRestored} etapa(s) restaurada(s) · Última corrida API: \`${diff.connectorSummary.lastRun}\` |`);
  lines.push('');
  lines.push('### Checklist de Cierre Humano');
  lines.push('- [ ] Revisar logs de GitHub Actions (`actualizacion_mensual.yml` / `verificacion.yml`) sin errores bloqueantes.');
  lines.push('- [ ] Confirmar cobertura esperada de indicadores y conectores en `curated_fallback`.');
  lines.push('- [ ] Validar cada outlier o variable nueva listada en la Sección 2 antes de aprobar el PR.');
  lines.push('- [ ] Ejecutar `node scripts/obsidian_indicator_audit.cjs --approve-latest --sync-to-vault` para aprobar y fijar el nuevo baseline.');
  lines.push('');

  lines.push('## 2. Qué Requiere Verificación Humana');
  lines.push('');
  if (diff.verificationAlerts.length === 0) {
    lines.push('No se detectaron outliers, variables eliminadas, fallbacks ni brechas de trazabilidad en esta corrida.');
  } else {
    for (const alert of diff.verificationAlerts) {
      const isComunaCard = diff.modified.some(m => m.key === alert.indicator)
        || diff.added.some(a => a.key === alert.indicator)
        || diff.removed.some(r => r.key === alert.indicator);
      const targetLink = isComunaCard
        ? `[[indicadores/${alert.indicator}|${alert.indicator}]]`
        : `\`${alert.indicator}\``;
      lines.push(`- [ ] **[${alert.severity} · ${alert.code}]** ${targetLink} (${alert.hub}): ${alert.detail}`);
    }
  }
  lines.push('');

  lines.push('## 3. Qué Cambió en esta Corrida (Indicadores Comunales)');
  lines.push('');
  if (diff.modified.length === 0 && diff.added.length === 0 && diff.removed.length === 0) {
    lines.push('Sin variaciones numéricas ni estructurales en `dataLake.comunas` respecto al baseline.');
  } else {
    if (diff.modified.length > 0) {
      lines.push(`### 3.1 Indicadores Modificados (${diff.modified.length})`);
      lines.push('');
      lines.push('| Indicador | Hub / Nodo | Nivel Umbral | Comuna | Anterior | Actual | Delta | Delta % | Outlier | Respaldo |');
      lines.push('|---|---|---|---|---|---|---|---|---|---|');
      for (const item of diff.modified) {
        const hubNodo = item.meta.nodeId ? `${item.meta.hubTitle} (Nodo #${item.meta.nodeId})` : item.meta.hubTitle;
        for (const ch of item.changes) {
          lines.push(
            `| \`${item.key}\` | ${hubNodo} | ${item.thresholdTier} (${item.appliedThreshold}%) | ${ch.comuna} | ${formatNumberCL(ch.prev)} | ${formatNumberCL(ch.curr)} | ${formatNumberCL(ch.deltaAbs)} | ${formatPct(ch.deltaPct)} | ${ch.isOutlier ? 'SI' : 'NO'} | [[indicadores/${item.key}|Ficha]] |`
          );
        }
      }
      lines.push('');
    }

    if (diff.added.length > 0) {
      lines.push(`### 3.2 Indicadores Agregados (${diff.added.length})`);
      lines.push('');
      lines.push('| Indicador | Tipo | Hub | Comunas con valor != 0 | En léxico oficial | Respaldo |');
      lines.push('|---|---|---|---|---|---|');
      for (const item of diff.added) {
        lines.push(
          `| \`${item.key}\` | ${item.type} | ${item.meta.hubTitle} | ${item.nonZeroCount} / 10 | ${item.meta.inLexicon ? 'SI' : 'NO (revisar)'} | [[indicadores/${item.key}|Ficha]] |`
        );
      }
      lines.push('');
    }

    if (diff.removed.length > 0) {
      lines.push(`### 3.3 Indicadores Eliminados (${diff.removed.length})`);
      lines.push('');
      lines.push('| Indicador | Tipo | Hub | Acción requerida | Respaldo |');
      lines.push('|---|---|---|---|---|');
      for (const item of diff.removed) {
        lines.push(
          `| \`${item.key}\` | ${item.type} | ${item.meta.hubTitle} | Confirmar si fue renombrado o eliminado por error | [[indicadores/${item.key}|Ficha]] |`
        );
      }
      lines.push('');
    }
  }

  lines.push('## 4. Qué Quedó Igual (Resumen por 10 Hubs Canónicos)');
  lines.push('');
  lines.push(`**${diff.counts.unchanged} indicadores comunales** mantuvieron valores idénticos en las 10 comunas de Aysén. No se generan fichas individuales vacías para evitar ruido en el grafo de Obsidian.`);
  lines.push('');
  lines.push('| Hub Canónico | Indicadores sin cambios |');
  lines.push('|---|---|');
  for (const row of diff.unchangedByHub) {
    lines.push(`| ${row.hubTitle} | ${row.count} |`);
  }
  lines.push('');

  lines.push('## 5. Cobertura Extendida (Barrios ACS, Holdings, Padrón SUBPESCA y Series Anuales)');
  lines.push('');
  lines.push('| Ámbito Estructural | Series/Métricas Actuales | Modificadas | Agregadas | Eliminadas | Sin cambios |');
  lines.push('|---|---|---|---|---|---|');
  for (const s of diff.additionalScopes.summary) {
    lines.push(`| ${s.label} | ${s.totalCurrent} | ${s.modified} | ${s.added} | ${s.removed} | ${s.unchanged} |`);
  }
  lines.push('');
  if (diff.additionalScopes.changes.length > 0) {
    lines.push('### Cambios Detectados en Ámbitos Extendidos');
    lines.push('');
    lines.push('| Ámbito | Métrica | Entidad / Periodo | Estado | Anterior | Actual | Outlier |');
    lines.push('|---|---|---|---|---|---|---|');
    for (const ch of diff.additionalScopes.changes.slice(0, 40)) {
      lines.push(`| ${ch.scope} | \`${ch.key}\` | ${ch.entity} | ${ch.status} | ${formatNumberCL(ch.prev)} | ${formatNumberCL(ch.curr)} | ${ch.isOutlier ? 'SI' : 'NO'} |`);
    }
    if (diff.additionalScopes.changes.length > 40) {
      lines.push(`| ... | *(${diff.additionalScopes.changes.length - 40} cambios adicionales resumidos)* | - | - | - | - | - |`);
    }
    lines.push('');
  }

  if (diff.connectorSummary.failedConnectors.length > 0) {
    lines.push('## 6. Detalle de Conectores en `curated_fallback`');
    lines.push('');
    lines.push('| Conector | Modo | HTTP | Nodos | Motivo registrado |');
    lines.push('|---|---|---|---|---|');
    for (const c of diff.connectorSummary.failedConnectors) {
      const nodesStr = c.nodes.length ? c.nodes.map(n => `#${n}`).join(', ') : 'N/D';
      const cleanErr = String(c.error || '').replace(/\|/g, '/').replace(/\r?\n/g, ' ');
      lines.push(`| \`${c.key}\` | \`${c.mode}\` | ${c.httpStatus == null ? 'N/A' : c.httpStatus} | ${nodesStr} | ${cleanErr} |`);
    }
    lines.push('');
  }

  return lines.join('\n') + '\n';
}

function renderIndicatorBackupNote(item, diff, runSlug, existingContent = null) {
  const alertsForItem = diff.verificationAlerts.filter(a => a.indicator === item.key);
  const needsVerification = alertsForItem.length > 0;
  const preservedHumanSection = extractHumanNotesSection(existingContent);

  let previousHistoryRows = [];
  if (existingContent) {
    const histMatch = existingContent.match(/## Historial de Corridas\n+([\s\S]*?)(?=\n## |$)/);
    if (histMatch) {
      previousHistoryRows = histMatch[1]
        .split('\n')
        .filter(l => l.startsWith('- '))
        .filter(l => !l.includes(`corrida_${runSlug}`));
    }
  }

  const summaryEntry = `- **${diff.runDate}** ([[corridas/corrida_${runSlug}|corrida_${runSlug}]]): estado \`${item.status}\` · ${item.changes.length} comuna(s) con cambio/registro · alertas: ${alertsForItem.length}.`;
  const allHistoryRows = [summaryEntry, ...previousHistoryRows];

  const lines = [];
  lines.push('---');
  lines.push(`id: respaldo_indicador_${item.key}`);
  lines.push(`title: "Respaldo de Indicador — ${item.meta.name} (${item.key})"`);
  lines.push('type: respaldo_indicador');
  lines.push(`variable_clave: "${item.key}"`);
  lines.push(`tipo_dato: "${item.type}"`);
  lines.push(`nivel_umbral: "${item.thresholdTier}"`);
  lines.push(`umbral_outlier_pct: ${item.appliedThreshold}`);
  lines.push(`hub: "${item.meta.hub}"`);
  lines.push(`hub_titulo: "${item.meta.hubTitle}"`);
  if (item.meta.nodeId != null) {
    lines.push(`nodo_id: ${item.meta.nodeId}`);
  }
  lines.push(`unidad: "${item.meta.unit || 'no_especificada'}"`);
  lines.push(`en_lexico_oficial: ${item.meta.inLexicon}`);
  lines.push(`ultimo_estado: "${item.status}"`);
  lines.push(`requiere_verificacion: ${needsVerification}`);
  lines.push(`ultima_corrida: "${diff.runDate}"`);
  lines.push('tags:');
  lines.push('  - aysen-sistemico');
  lines.push('  - respaldo-indicador');
  lines.push(`  - estado-${item.status}`);
  if (needsVerification) lines.push('  - requiere-verificacion');
  lines.push('---');
  lines.push('');
  lines.push(`# Respaldo de Indicador: \`${item.key}\``);
  lines.push('');
  lines.push(`- **Nombre**: ${item.meta.name}`);
  lines.push(`- **Hub / Nodo**: ${item.meta.hubTitle}${item.meta.nodeId ? ` · Nodo #${item.meta.nodeId}` : ''}`);
  lines.push(`- **Umbral de outlier**: ${item.thresholdTier} (>= ${item.appliedThreshold}%)`);
  lines.push(`- **Unidad**: ${item.meta.unit || 'No especificada en léxico'}`);
  lines.push(`- **Fuente oficial**: ${item.meta.sourceEntity}${item.meta.sourceUrl ? ` (${item.meta.sourceUrl})` : ''}`);
  lines.push(`- **Frecuencia / Modo**: ${item.meta.updateFrequency} · \`${item.meta.extractionMode}\``);
  lines.push(`- **Última auditoría**: [[corridas/corrida_${runSlug}|Corrida ${diff.runDate}]] · [[index_auditoria|Índice de Auditoría]]`);
  lines.push('');

  lines.push('## Alertas Activas en esta Corrida');
  lines.push('');
  if (alertsForItem.length === 0) {
    lines.push('Sin alertas activas en la corrida más reciente.');
  } else {
    for (const a of alertsForItem) {
      lines.push(`- [ ] **[${a.severity} · ${a.code}]** ${a.detail}`);
    }
  }
  lines.push('');

  lines.push(`## Comparación Comunal (${diff.baselineLabel} vs ${diff.currentLabel})`);
  lines.push('');
  lines.push('| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const ch of item.changes) {
    lines.push(
      `| \`${ch.comuna_ine}\` | ${ch.comuna} | ${formatNumberCL(ch.prev)} | ${formatNumberCL(ch.curr)} | ${formatNumberCL(ch.deltaAbs)} | ${formatPct(ch.deltaPct)} | ${ch.isOutlier ? `SI (${ch.outlierReason})` : 'NO'} |`
    );
  }
  lines.push('');

  lines.push('## Historial de Corridas');
  lines.push('');
  for (const row of allHistoryRows) lines.push(row);
  lines.push('');

  if (preservedHumanSection) {
    lines.push(preservedHumanSection);
  } else {
    lines.push('## Revisión Humana (Notas Preservadas)');
    lines.push('');
    lines.push('<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->');
    lines.push('- [ ] Verificado contra fuente oficial.');
  }
  lines.push('');

  return lines.join('\n');
}

function renderAuditIndex(outDir) {
  const runsDir = path.join(outDir, 'corridas');
  const indDir = path.join(outDir, 'indicadores');
  const runFiles = fs.existsSync(runsDir)
    ? fs.readdirSync(runsDir).filter(f => f.endsWith('.md')).sort().reverse()
    : [];
  const indFiles = fs.existsSync(indDir)
    ? fs.readdirSync(indDir).filter(f => f.endsWith('.md')).sort()
    : [];

  const lines = [];
  lines.push('---');
  lines.push('id: index_auditoria_indicadores');
  lines.push('title: "Índice de Auditoría y Respaldos por Indicador — Aysén Sistémico"');
  lines.push('type: index_auditoria');
  lines.push(`updated_at: "${new Date().toISOString().slice(0, 10)}"`);
  lines.push(`total_corridas: ${runFiles.length}`);
  lines.push(`total_fichas_indicadores: ${indFiles.length}`);
  lines.push('tags:');
  lines.push('  - aysen-sistemico');
  lines.push('  - auditoria-indicadores');
  lines.push('---');
  lines.push('');
  lines.push('# Índice de Auditoría y Respaldos por Indicador');
  lines.push('');
  lines.push('Bitácora estructurada para auditar cambios en los indicadores comunales, Barrios ACS, Holdings, Padrón SUBPESCA y Series Anuales de Aysén Sistémico en revisiones rápidas de 5 minutos.');
  lines.push('');
  lines.push('## Corridas Registradas');
  lines.push('');
  if (runFiles.length === 0) {
    lines.push('- Sin corridas registradas aún.');
  } else {
    for (const f of runFiles) {
      const base = f.replace(/\.md$/, '');
      lines.push(`- [[corridas/${base}|${base}]]`);
    }
  }
  lines.push('');
  lines.push('## Fichas de Respaldo por Indicador (Modificados / Nuevos / Alertados)');
  lines.push('');
  if (indFiles.length === 0) {
    lines.push('- Sin fichas de respaldo generadas aún.');
  } else {
    for (const f of indFiles) {
      const base = f.replace(/\.md$/, '');
      lines.push(`- [[indicadores/${base}|${base}]]`);
    }
  }
  lines.push('');
  lines.push('## Consulta Rápida Dataview (Pendientes de Verificación)');
  lines.push('');
  lines.push('```dataview');
  lines.push('TABLE ultimo_estado AS "Estado", hub_titulo AS "Hub", nivel_umbral AS "Umbral", ultima_corrida AS "Corrida"');
  lines.push('FROM #respaldo-indicador AND #requiere-verificacion');
  lines.push('SORT ultima_corrida DESC');
  lines.push('```');
  lines.push('');

  return lines.join('\n');
}

function writeAuditArtifacts(diff, currentSnapshot, options = {}) {
  const outDir = options.outDir || DEFAULT_OUT_DIR;
  const runSlug = options.runSlug || `${diff.runDate}_${sanitizeSlug(diff.baselineLabel)}_vs_${sanitizeSlug(diff.currentLabel)}`;
  const runsDir = path.join(outDir, 'corridas');
  const indDir = path.join(outDir, 'indicadores');
  const snapDir = path.join(outDir, 'snapshots');

  fs.mkdirSync(runsDir, { recursive: true });
  fs.mkdirSync(indDir, { recursive: true });
  fs.mkdirSync(snapDir, { recursive: true });

  const runNotePath = path.join(runsDir, `corrida_${runSlug}.md`);
  const runMarkdown = renderRunNote(diff, runSlug);
  if (EMOJI_REGEX.test(runMarkdown)) {
    throw new Error('Guardrail anti-emoji activado en nota de corrida.');
  }
  fs.writeFileSync(runNotePath, runMarkdown, 'utf8');

  const itemsToBackup = [...diff.modified, ...diff.added, ...diff.removed];
  const indicatorPaths = [];

  for (const item of itemsToBackup) {
    const indPath = path.join(indDir, `${item.key}.md`);
    const existing = fs.existsSync(indPath) ? fs.readFileSync(indPath, 'utf8') : null;
    const indMd = renderIndicatorBackupNote(item, diff, runSlug, existing);
    if (EMOJI_REGEX.test(indMd)) {
      throw new Error(`Guardrail anti-emoji activado en ficha de indicador ${item.key}.`);
    }
    fs.writeFileSync(indPath, indMd, 'utf8');
    indicatorPaths.push(indPath);
  }

  const indexPath = path.join(outDir, 'index_auditoria.md');
  fs.writeFileSync(indexPath, renderAuditIndex(outDir), 'utf8');

  const runSnapshotPath = path.join(snapDir, `snapshot_${runSlug}.json`);
  fs.writeFileSync(runSnapshotPath, JSON.stringify(currentSnapshot, null, 2) + '\n', 'utf8');

  const baselinePath = path.join(snapDir, 'baseline_snapshot.json');
  if (options.updateBaseline || !fs.existsSync(baselinePath)) {
    fs.writeFileSync(baselinePath, JSON.stringify(currentSnapshot, null, 2) + '\n', 'utf8');
  }

  return {
    outDir,
    runSlug,
    runNotePath,
    indicatorPaths,
    indexPath,
    runSnapshotPath,
    baselinePath
  };
}

function approveLatestRun(options = {}) {
  const outDir = options.outDir || DEFAULT_OUT_DIR;
  const runsDir = path.join(outDir, 'corridas');
  const snapDir = path.join(outDir, 'snapshots');
  if (!fs.existsSync(runsDir)) {
    throw new Error(`No existe directorio de corridas en "${runsDir}".`);
  }
  const runFiles = fs.readdirSync(runsDir)
    .filter(f => f.startsWith('corrida_') && f.endsWith('.md'))
    .map(f => ({ name: f, full: path.join(runsDir, f), mtime: fs.statSync(path.join(runsDir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime || b.name.localeCompare(a.name));

  if (runFiles.length === 0) {
    throw new Error(`No hay notas de corrida en "${runsDir}" para aprobar.`);
  }

  const latest = runFiles[0];
  let content = fs.readFileSync(latest.full, 'utf8');
  if (/^estado_revision_humana:\s*"[^"]*"/m.test(content)) {
    content = content.replace(/^estado_revision_humana:\s*"[^"]*"/m, 'estado_revision_humana: "aprobada"');
  } else {
    content = content.replace(/^---\n/, '---\nestado_revision_humana: "aprobada"\n');
  }
  const approvalDate = new Date().toISOString();
  if (/^fecha_aprobacion_humana:/m.test(content)) {
    content = content.replace(/^fecha_aprobacion_humana:.*$/m, `fecha_aprobacion_humana: "${approvalDate}"`);
  } else {
    content = content.replace(/^estado_revision_humana: "aprobada"/m, `estado_revision_humana: "aprobada"\nfecha_aprobacion_humana: "${approvalDate}"`);
  }
  fs.writeFileSync(latest.full, content, 'utf8');

  // Actualizar baseline_snapshot.json con el estado actual aprobado
  const bundlePath = options.bundlePath || DATA_BUNDLE_PATH;
  const currentSnapshot = options.currentSnapshot || extractSnapshotFromBundle(loadBundleFromFile(bundlePath), 'HEAD_APROBADO');
  fs.mkdirSync(snapDir, { recursive: true });
  const baselinePath = path.join(snapDir, 'baseline_snapshot.json');
  fs.writeFileSync(baselinePath, JSON.stringify(currentSnapshot, null, 2) + '\n', 'utf8');

  return {
    approvedRunPath: latest.full,
    approvedRunFile: latest.name,
    approvalDate,
    baselinePath
  };
}

function syncAuditToVault(outDir, explicitVaultRoot, options = {}) {
  const vaultRoot = explicitVaultRoot || process.env.OBSIDIAN_VAULT_PATH || DEFAULT_VAULT_ROOT;
  if (!fs.existsSync(vaultRoot)) {
    if (options.noFailMissingVault) {
      return { vaultRoot, destRoot: null, copied: 0, skippedMissingVault: true };
    }
    throw new Error(`No se encontró el Vault de Obsidian en "${vaultRoot}". Pasa --vault-path o usa --no-fail-missing-vault en CI.`);
  }
  const destRoot = path.join(vaultRoot, VAULT_SUBFOLDER);
  fs.mkdirSync(destRoot, { recursive: true });

  let copied = 0;
  function walk(srcBase, rel = '') {
    const full = path.join(srcBase, rel);
    for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
      if (entry.name === 'snapshots') continue;
      const childRel = rel ? path.join(rel, entry.name) : entry.name;
      const srcPath = path.join(srcBase, childRel);
      const dstPath = path.join(destRoot, childRel);
      if (entry.isDirectory()) {
        fs.mkdirSync(dstPath, { recursive: true });
        walk(srcBase, childRel);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        fs.mkdirSync(path.dirname(dstPath), { recursive: true });
        fs.copyFileSync(srcPath, dstPath);
        copied++;
      }
    }
  }
  walk(outDir);
  return { vaultRoot, destRoot, copied, skippedMissingVault: false };
}

function parseCliArgs(argv) {
  const args = {
    againstGit: null,
    baseline: null,
    outDir: DEFAULT_OUT_DIR,
    outlierPct: 20,
    structuralOutlierPct: 5,
    syncToVault: false,
    noFailMissingVault: false,
    vaultPath: null,
    updateBaseline: false,
    approveLatest: false,
    jsonSummary: false
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--against-git' && argv[i + 1]) args.againstGit = argv[++i];
    else if (a === '--baseline' && argv[i + 1]) args.baseline = argv[++i];
    else if (a === '--out-dir' && argv[i + 1]) args.outDir = path.resolve(argv[++i]);
    else if (a === '--outlier-pct' && argv[i + 1]) args.outlierPct = Number(argv[++i]);
    else if (a === '--structural-outlier-pct' && argv[i + 1]) args.structuralOutlierPct = Number(argv[++i]);
    else if (a === '--sync-to-vault') args.syncToVault = true;
    else if (a === '--no-fail-missing-vault') args.noFailMissingVault = true;
    else if (a === '--vault-path' && argv[i + 1]) args.vaultPath = argv[++i];
    else if (a === '--update-baseline') args.updateBaseline = true;
    else if (a === '--approve-latest') args.approveLatest = true;
    else if (a === '--json') args.jsonSummary = true;
  }
  return args;
}

function runCli() {
  const args = parseCliArgs(process.argv.slice(2));

  if (args.approveLatest) {
    const approval = approveLatestRun({ outDir: args.outDir });
    let vaultSync = null;
    if (args.syncToVault) {
      vaultSync = syncAuditToVault(args.outDir, args.vaultPath, { noFailMissingVault: args.noFailMissingVault });
    }
    if (args.jsonSummary) {
      console.log(JSON.stringify({ approval, vaultSync }, null, 2));
    } else {
      console.log(`[obsidian_indicator_audit --approve-latest] Corrida aprobada: ${approval.approvedRunPath}`);
      console.log(`[obsidian_indicator_audit --approve-latest] Baseline actualizado: ${approval.baselinePath}`);
      if (vaultSync && !vaultSync.skippedMissingVault) {
        console.log(`[obsidian_indicator_audit --approve-latest] Sincronizadas ${vaultSync.copied} notas hacia "${vaultSync.destRoot}"`);
      } else if (vaultSync && vaultSync.skippedMissingVault) {
        console.log('[obsidian_indicator_audit --approve-latest] Vault local no disponible (omitido por --no-fail-missing-vault).');
      }
    }
    return;
  }

  const currentBundle = loadBundleFromFile(DATA_BUNDLE_PATH);
  const currentSnapshot = extractSnapshotFromBundle(currentBundle, 'HEAD');

  let baselineSnapshot;
  if (args.againstGit) {
    try {
      const prevBundle = loadBundleFromGitRef(args.againstGit, ROOT_DIR);
      baselineSnapshot = extractSnapshotFromBundle(prevBundle, args.againstGit);
    } catch (gitErr) {
      const fallbackPath = path.join(args.outDir, 'snapshots', 'baseline_snapshot.json');
      if (fs.existsSync(fallbackPath)) {
        baselineSnapshot = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
      } else {
        throw gitErr;
      }
    }
  } else {
    const basePath = args.baseline || path.join(args.outDir, 'snapshots', 'baseline_snapshot.json');
    if (!fs.existsSync(basePath)) {
      throw new Error(
        `No existe snapshot baseline en "${basePath}". Ejecuta primero con --against-git HEAD~1 para generar el baseline inicial.`
      );
    }
    baselineSnapshot = JSON.parse(fs.readFileSync(basePath, 'utf8'));
  }

  const diff = compareSnapshots(baselineSnapshot, currentSnapshot, {
    outlierPctThreshold: args.outlierPct,
    structuralOutlierPct: args.structuralOutlierPct
  });

  const written = writeAuditArtifacts(diff, currentSnapshot, {
    outDir: args.outDir,
    updateBaseline: args.updateBaseline
  });

  let vaultSync = null;
  if (args.syncToVault) {
    vaultSync = syncAuditToVault(args.outDir, args.vaultPath, {
      noFailMissingVault: args.noFailMissingVault
    });
  }

  if (args.jsonSummary) {
    console.log(JSON.stringify({ diff: { ...diff, unchanged: undefined }, written, vaultSync }, null, 2));
  } else {
    console.log(
      `[obsidian_indicator_audit] Corrida ${diff.runDate} (${diff.baselineLabel} -> ${diff.currentLabel}) | ` +
      `Semáforo: ${diff.semaforo} | Modificados: ${diff.counts.modified} | Agregados: ${diff.counts.added} | ` +
      `Eliminados: ${diff.counts.removed} | Sin cambios: ${diff.counts.unchanged} | Alertas: ${diff.counts.alertsTotal}`
    );
    console.log(`[obsidian_indicator_audit] Nota de corrida: ${written.runNotePath}`);
    console.log(`[obsidian_indicator_audit] Fichas de respaldo por indicador: ${written.indicatorPaths.length}`);
    if (vaultSync && !vaultSync.skippedMissingVault) {
      console.log(`[obsidian_indicator_audit] Sincronizadas ${vaultSync.copied} notas hacia "${vaultSync.destRoot}"`);
    } else if (vaultSync && vaultSync.skippedMissingVault) {
      console.log('[obsidian_indicator_audit] Vault local no disponible (omitido por --no-fail-missing-vault).');
    }
  }
}

if (require.main === module) {
  try {
    runCli();
  } catch (err) {
    console.error('[obsidian_indicator_audit] Error:', err.message);
    process.exit(1);
  }
}

module.exports = {
  CANONICAL_HUB_TITLES,
  isStructuralIndicator,
  getOutlierThresholdForKey,
  loadBundleFromFile,
  loadBundleFromGitRef,
  buildMetadataCatalog,
  extractSnapshotFromBundle,
  compareSnapshots,
  renderRunNote,
  renderIndicatorBackupNote,
  writeAuditArtifacts,
  approveLatestRun,
  syncAuditToVault
};
