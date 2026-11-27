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
const MARCO_REGULATORIO_PATH = path.join(ROOT_DIR, 'data', 'raw', 'energia_telecom', 'marco_regulatorio_tarifario_aysen_2024_2028.json');
const WP01_SYSTEMIC_PATH = path.join(ROOT_DIR, 'data', 'systemic', '01_gob_poder_finanzas.json');
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
  'monumentos_nacionales_',
  'centros_culturales_',
  'puntos_cultura_comunitaria_',
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

  // e) Centrales Electricas CNE / SSAA (nodos MW operativos)
  const centralesRaw = dataLake.spatialNodesByLayer && Array.isArray(dataLake.spatialNodesByLayer.centrales_electricas)
    ? dataLake.spatialNodesByLayer.centrales_electricas.filter(n => n && n.magnitudeUnit === 'MW')
    : [];
  if (centralesRaw.length > 0) {
    const mwVals = {};
    for (const c of centralesRaw) {
      if (c.id) mwVals[String(c.id)] = Number(c.magnitudeValue) || 0;
    }
    scopes.centralesElectricas = {
      centrales_potencia_mw: { type: 'numeric', values: mwVals }
    };
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
      .filter(v => v && (v.isAliasOf || v.isComplementOf))
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

  const centralesElectricas = (dataLake.spatialNodesByLayer && Array.isArray(dataLake.spatialNodesByLayer.centrales_electricas)
    ? dataLake.spatialNodesByLayer.centrales_electricas.filter(n => n && n.magnitudeUnit === 'MW')
    : []).map(c => ({
    id: String(c.id || ''),
    nombre: String(c.nombre || ''),
    comuna_ine: String(c.comuna_ine || ''),
    sistema: String(c.sistema || ''),
    potencia_mw: Number(c.magnitudeValue) || 0
  }));
  const comunaHogares = {};
  const comunaPoblacion = {};
  const ingresosMunBcn2025ByIne = {};
  const bosqueNativoByIne = {};
  const nameToIne = {};
  for (const row of (dataLake.comunas || [])) {
    const ine = String(row.comuna_ine || row.codigo_comuna || '');
    if (ine) {
      if (row.nombre) nameToIne[String(row.nombre)] = ine;
      if (typeof row.hogares_censo_2024 === 'number') comunaHogares[ine] = row.hogares_censo_2024;
      if (typeof row.poblacion_censo_2024 === 'number') comunaPoblacion[ine] = row.poblacion_censo_2024;
      if (typeof row.ingresos_mun_bcn_2025_mclp === 'number') ingresosMunBcn2025ByIne[ine] = row.ingresos_mun_bcn_2025_mclp;
      if (typeof row.bosque_nativo_ha === 'number') bosqueNativoByIne[ine] = row.bosque_nativo_ha;
    }
  }

  const wp01Json = readJsonSafe(options.wp01Path || WP01_SYSTEMIC_PATH, null);
  const wp01PatentesAcuicolasByIne = {};
  const padronOct2024ByIne = {};
  const votantesOct2024ByIne = {};
  if (wp01Json && Array.isArray(wp01Json.por_comuna)) {
    for (const pc of wp01Json.por_comuna) {
      const ine = String(pc.comuna_ine || '');
      if (!ine) continue;
      const fin = (pc.datos && pc.datos.finanzas_sinim) || {};
      const aut = (pc.datos && pc.datos.autoridades) || {};
      wp01PatentesAcuicolasByIne[ine] = Number(fin.ingresos_patentes_acuicolas_mclp) || 0;
      padronOct2024ByIne[ine] = Number(aut.padron_electoral_oct_2024) || 0;
      votantesOct2024ByIne[ine] = Number(aut.votantes_municipales_oct_2024) || 0;
    }
  }
  const nodo15PatentesAcuicolasByIne = {};
  const nodo15 = Array.isArray(dataLake.nodos) ? dataLake.nodos.find(n => n && n.id === 15) : null;
  if (nodo15 && Array.isArray(nodo15.tableRows)) {
    for (const r of nodo15.tableRows) {
      const ine = nameToIne[String(r[0] || '')];
      if (!ine) continue;
      const parsed = Number(String(r[3] || '0').replace(/\./g, '').replace(',', '.'));
      nodo15PatentesAcuicolasByIne[ine] = Number.isFinite(parsed) ? parsed : 0;
    }
  }

  // Contexto Hub V (Sprint 8 - Eval E18)
  const hub4Obj = Array.isArray(dataLake.hubs) ? dataLake.hubs.find(h => h && h.id === 'inversion') : null;
  const nodo20 = Array.isArray(dataLake.nodos) ? dataLake.nodos.find(n => n && n.id === 20) : null;
  const wp04Json = readJsonSafe(options.wp04Path || path.join(ROOT_DIR, 'data', 'systemic', '04_inversion_seia_economia.json'), null);
  const wp03Json = readJsonSafe(options.wp03Path || path.join(ROOT_DIR, 'data', 'systemic', '03_concesiones_tierra_mar.json'), null);
  const seiaSpatialNodes = (dataLake.spatialNodesByLayer && Array.isArray(dataLake.spatialNodesByLayer.proyectos_seia_puros))
    ? dataLake.spatialNodesByLayer.proyectos_seia_puros.map(n => ({
        id: String(n.id || ''),
        nombre: String(n.nombre || ''),
        magnitudeValue: Number(n.magnitudeValue) || 0,
        sourceUrl: String(n.sourceUrl || n.source_url || '')
      }))
    : [];
  const wp04SeiaNodes = (wp04Json && Array.isArray(wp04Json.nodos_georreferenciados))
    ? wp04Json.nodos_georreferenciados.map(n => ({
        id: String(n.id || ''),
        nombre: String(n.nombre || ''),
        monto_inversion_mmusd: Number((n.atributos && n.atributos.monto_inversion_mmusd) || 0),
        source_url: String(n.source_url || '')
      }))
    : [];
  const mineriaFaenas = (dataLake.spatialNodesByLayer && Array.isArray(dataLake.spatialNodesByLayer.mineria_faenas))
    ? dataLake.spatialNodesByLayer.mineria_faenas.map(n => ({
        id: String(n.id || ''),
        nombre: String(n.nombre || ''),
        titular: String(n.titular || ''),
        magnitudeValue: Number(n.magnitudeValue) || 0
      }))
    : [];
  const pibSeriesArr = (dataLake.series && Array.isArray(dataLake.series.pib_regional_nominal_mmclp))
    ? dataLake.series.pib_regional_nominal_mmclp
    : [];
  const pib2025Entry = pibSeriesArr.find(r => String(r.periodo || r.anio || '') === '2025') || null;
  const mpSeriesArr = (dataLake.series && Array.isArray(dataLake.series.transacciones_compras_publicas_mclp))
    ? dataLake.series.transacciones_compras_publicas_mclp
    : [];
  const mp2026Entry = mpSeriesArr.find(r => String(r.periodo || r.anio || '') === '2026') || null;
  const wp03Res = (wp03Json && wp03Json.resumen_regional) || {};
  const wp07Json = readJsonSafe(path.join(ROOT_DIR, 'data', 'systemic', '07_biodiversidad_flora_fauna_aysen.json'), null);
  const wp07Conaf2026 = (dataLake.catastroVegetacionalConaf2026) || (wp07Json && wp07Json.resumen_regional && wp07Json.resumen_regional.catastro_vegetacional_conaf_2026) || {};

  const hub5EconomyAudit = {
    hub4ExampleText: String((hub4Obj && hub4Obj.example) || ''),
    nodo20TramosData: Array.isArray(nodo20 && nodo20.chartSpec && nodo20.chartSpec.datasets && nodo20.chartSpec.datasets[0] && nodo20.chartSpec.datasets[0].data)
      ? nodo20.chartSpec.datasets[0].data.map(Number)
      : [],
    seiaSpatialNodes,
    wp04SeiaNodes,
    mineriaFaenas,
    sernageominResumen: {
      concesiones_totales: Number(wp03Res.concesiones_mineras_totales || ((Number(wp03Res.concesiones_mineras_explotacion_totales) || 0) + (Number(wp03Res.concesiones_mineras_exploracion_totales) || 0))) || 0,
      explotacion: Number(wp03Res.concesiones_mineras_explotacion_totales) || 0,
      exploracion: Number(wp03Res.concesiones_mineras_exploracion_totales) || 0,
      superficie_ha: Number(wp03Res.superficie_concesionada_mineria_ha) || 0
    },
    pib2025Mmclp: pib2025Entry ? Number(pib2025Entry.valor) : null,
    chilecompra2026YtdMclp: mp2026Entry ? Number(mp2026Entry.valor) : Number((dataLake.chilecompraMercadoPublico && dataLake.chilecompraMercadoPublico['2026_ytd_22oct'] && dataLake.chilecompraMercadoPublico['2026_ytd_22oct'].monto_mclp) || 0),
    bosqueNativoByIne,
    conaf2026: {
      superficie_catastrada_ha: Number(wp07Conaf2026.superficie_catastrada_ha) || 0,
      bosque_nativo_ha: Number(wp07Conaf2026.bosque_nativo_ha) || 0,
      bosques_en_snaspe_ha: Number(wp07Conaf2026.bosques_en_snaspe_ha) || 0
    }
  };

  // Contexto Hub VI (Sprint 9 - Eval E19: Censo 2024, MINVU, SSR, SLEP, SIES, CEAD, Wiki)
  const tortelObj = Array.isArray(dataLake.comunas) ? dataLake.comunas.find(c => String(c.comuna_ine) === '11303') : null;
  const nodo25 = Array.isArray(dataLake.nodos) ? dataLake.nodos.find(n => n && n.id === 25) : null;
  const nodo25Ds = Array.isArray(nodo25 && nodo25.chartSpec && nodo25.chartSpec.datasets)
    ? nodo25.chartSpec.datasets.map(ds => Array.isArray(ds.data) ? ds.data.map(Number) : [])
    : [];
  const hub06WikiPath = options.hub06WikiPath || path.join(ROOT_DIR, 'wiki', 'hubs', 'hub_06_social.md');
  let hub06WikiText = '';
  try {
    if (fs.existsSync(hub06WikiPath)) {
      hub06WikiText = fs.readFileSync(hub06WikiPath, 'utf8');
    }
  } catch (_) {}
  const viviendasOcupadasByIne = {};
  const deficitCuantitativoMinvuByIne = {};
  for (const row of (dataLake.comunas || [])) {
    const ine = String(row.comuna_ine || row.codigo_comuna || '');
    if (!ine) continue;
    if (typeof row.viviendas_ocupadas_censo_2024 === 'number') {
      viviendasOcupadasByIne[ine] = row.viviendas_ocupadas_censo_2024;
    }
    const defVal = typeof row.deficit_habitacional_cuantitativo_n === 'number'
      ? row.deficit_habitacional_cuantitativo_n
      : (typeof row.deficit_cuantitativo_minvu === 'number' ? row.deficit_cuantitativo_minvu : null);
    if (defVal !== null) {
      deficitCuantitativoMinvuByIne[ine] = defVal;
    }
  }
  const hub6SocialAudit = {
    viviendasOcupadasByIne,
    deficitCuantitativoMinvuByIne,
    tortelEducacion: {
      escuelas_rurales_multigrado_n: tortelObj ? Number(tortelObj.escuelas_rurales_multigrado_n ?? 0) : null,
      liceos_urbanos_n: tortelObj ? Number(tortelObj.liceos_urbanos_n ?? 0) : null,
      establecimientos_escolares_n: tortelObj ? Number(tortelObj.establecimientos_escolares_n ?? 0) : null
    },
    nodo25Datasets: nodo25Ds,
    hub06WikiText
  };

  // Contexto Hub VII (Sprint 10 - Eval E20: CONAF 2026, Glaciares IPG 2022, EEI, SINCA/DGA, Volcanes RNVV, SIES Nodo 36)
  const nodo27 = Array.isArray(dataLake.nodos) ? dataLake.nodos.find(n => n && n.id === 27) : null;
  const nodo29 = Array.isArray(dataLake.nodos) ? dataLake.nodos.find(n => n && n.id === 29) : null;
  const nodo30 = Array.isArray(dataLake.nodos) ? dataLake.nodos.find(n => n && n.id === 30) : null;
  const nodo31 = Array.isArray(dataLake.nodos) ? dataLake.nodos.find(n => n && n.id === 31) : null;
  const estacionesPath = options.estacionesAysenPath || path.join(ROOT_DIR, 'data', 'estaciones_aysen.json');
  const estacionesJson = readJsonSafe(estacionesPath, null);
  const estacionesArr = Array.isArray(estacionesJson)
    ? estacionesJson
    : (Array.isArray(estacionesJson && estacionesJson.estaciones) ? estacionesJson.estaciones : []);
  const bakerEst = estacionesArr.find(
    e => e && (Number(e.id) === 1 || String(e.codigo_estacion || e.codigo || '').includes('11530000-8'))
  ) || null;
  const bakerSerie = Array.isArray(bakerEst && (bakerEst.serie_temporal || bakerEst.serie))
    ? (bakerEst.serie_temporal || bakerEst.serie)
    : [];
  let bakerEstMaxVal = null;
  let bakerEstMaxMes = null;
  let bakerEstMinVal = null;
  let bakerEstMinMes = null;
  let bakerEstHasFuture = false;
  const currentYm = new Date().toISOString().slice(0, 7);
  for (const pt of bakerSerie) {
    const val = Number(pt && pt.valor);
    const fecha = String((pt && pt.fecha) || '');
    const ym = fecha.slice(0, 7);
    if (ym && ym > currentYm) bakerEstHasFuture = true;
    if (Number.isFinite(val)) {
      if (bakerEstMaxVal === null || val > bakerEstMaxVal) {
        bakerEstMaxVal = val;
        bakerEstMaxMes = ym;
      }
      if (bakerEstMinVal === null || val < bakerEstMinVal) {
        bakerEstMinVal = val;
        bakerEstMinMes = ym;
      }
    }
  }
  const mapaHtmlPath = options.mapaTerritorialPath || path.join(ROOT_DIR, 'mapa_territorial.html');
  let mapaBakerChartData = null;
  try {
    if (fs.existsSync(mapaHtmlPath)) {
      const mapaTxt = fs.readFileSync(mapaHtmlPath, 'utf8');
      const m = mapaTxt.match(/11530000-8[\s\S]{0,600}?chartData:\s*\[([^\]]+)\]/);
      if (m) {
        mapaBakerChartData = m[1].split(',').map(x => Number(x.trim())).filter(Number.isFinite);
      }
    }
  } catch (_) {}
  const rnvvPath = options.rnvvVolcanoesPath || path.join(ROOT_DIR, 'data', 'raw', 'social_ambiental', 'sernageomin_rnvv_volcanes_aysen.json');
  const rnvvJson = readJsonSafe(rnvvPath, null);
  const rnvvList = Array.isArray(rnvvJson && rnvvJson.volcanes_activos_aysen) ? rnvvJson.volcanes_activos_aysen : [];
  const hudsonRnvv = rnvvList.find(v => String(v.id || '').includes('hudson') || /hudson/i.test(String(v.nombre || '')));
  const arenalesInRnvvAysen = rnvvList.some(v => /arenales/i.test(String(v.nombre || '') + String(v.id || '')) && String(v.comuna_ine || '') === '11201');
  const autoUpPath = options.autoUpdateStatusPath || AUTO_UPDATE_STATUS_PATH;
  const autoUpJson = readJsonSafe(autoUpPath, null);
  const nodo36WikiPath = options.nodo36WikiPath || path.join(ROOT_DIR, 'wiki', 'nodos', 'nodo_36.md');
  let nodo36WikiText = '';
  try {
    if (fs.existsSync(nodo36WikiPath)) {
      nodo36WikiText = fs.readFileSync(nodo36WikiPath, 'utf8');
    }
  } catch (_) {}

  const eeiPorComunaCastorN = Array.isArray(wp07Json && wp07Json.por_comuna)
    ? wp07Json.por_comuna.filter(c => c?.datos?.especies_exoticas_invasoras?.castor_canadiense?.presente === true).length
    : 0;
  const didymoCat = Array.isArray(wp07Json && wp07Json.catastro_especies_exoticas_invasoras)
    ? wp07Json.catastro_especies_exoticas_invasoras.find(e => /didymo/i.test(String(e.nombre_comun || '')))
    : null;
  const jabaliCat = Array.isArray(wp07Json && wp07Json.catastro_especies_exoticas_invasoras)
    ? wp07Json.catastro_especies_exoticas_invasoras.find(e => /jabal/i.test(String(e.nombre_comun || '')))
    : null;

  const hub7BiodivAudit = {
    superficieGlaciaresAliasByIne: Object.fromEntries(
      (dataLake.comunas || []).map(r => [String(r.comuna_ine || ''), Number(r.superficie_glaciares_km2 ?? NaN)])
    ),
    episodiosGec2024ByIne: Object.fromEntries(
      (dataLake.comunas || []).map(r => [String(r.comuna_ine || ''), r.episodios_gec_mp25_2024 ?? null])
    ),
    nodo27Labels: Array.isArray(nodo27 && nodo27.chartSpec && nodo27.chartSpec.labels) ? nodo27.chartSpec.labels.slice() : [],
    nodo27Data: Array.isArray(nodo27 && nodo27.chartSpec && nodo27.chartSpec.datasets && nodo27.chartSpec.datasets[0] && nodo27.chartSpec.datasets[0].data)
      ? nodo27.chartSpec.datasets[0].data.map(Number)
      : [],
    nodo29Labels: Array.isArray(nodo29 && nodo29.chartSpec && nodo29.chartSpec.labels) ? nodo29.chartSpec.labels.slice() : [],
    nodo29Data: Array.isArray(nodo29 && nodo29.chartSpec && nodo29.chartSpec.datasets && nodo29.chartSpec.datasets[0] && nodo29.chartSpec.datasets[0].data)
      ? nodo29.chartSpec.datasets[0].data.map(Number)
      : [],
    eeiPorComunaCastorN,
    jabaliText: `${(jabaliCat && (jabaliCat.cuencas_y_comunas_afectadas || []).join(' ')) || ''} ${String((nodo29 && nodo29.example) || '')}`,
    didymoText: `${(didymoCat && (didymoCat.cuencas_y_comunas_afectadas || []).join(' ')) || ''} ${String((nodo29 && nodo29.example) || '')}`,
    nodo30BakerData: Array.isArray(nodo30 && nodo30.chartSpec && nodo30.chartSpec.datasets && nodo30.chartSpec.datasets[1] && nodo30.chartSpec.datasets[1].data)
      ? nodo30.chartSpec.datasets[1].data.map(Number)
      : [],
    nodo30TableHas202612: Array.isArray(nodo30 && nodo30.tableRows)
      ? nodo30.tableRows.some(r => /2026-12/i.test(String((r && r[0]) || '')))
      : false,
    bakerEstacion: {
      found: Boolean(bakerEst),
      maxVal: bakerEstMaxVal,
      maxMes: bakerEstMaxMes,
      minVal: bakerEstMinVal,
      minMes: bakerEstMinMes,
      hasFutureDates: bakerEstHasFuture
    },
    mapaBakerChartData,
    activeApiConnectors: Number((autoUpJson && autoUpJson.activeApiConnectors) || (dataLake.meta && dataLake.meta.autoUpdate && dataLake.meta.autoUpdate.activeApiConnectors) || 0),
    hasDgaHidrologiaConnector: Array.isArray(autoUpJson && autoUpJson.connectors)
      ? autoUpJson.connectors.some(c => (c.key || c.connector) === 'dga_hidrologia')
      : false,
    volcanesRnvv: {
      count: rnvvList.length,
      hudsonRanking: hudsonRnvv ? Number(hudsonRnvv.ranking_riesgo_sernageomin) : null,
      arenalesInAysen: arenalesInRnvvAysen,
      nodo31Text: `${String((nodo31 && nodo31.definition) || '')} ${String((nodo31 && nodo31.example) || '')}`
    },
    nodo36WikiText
  };

  // Contexto Hub VIII (Sprint 11 - Eval E21: Red Hospitalaria 213/8, APS 4/4/27/9/2, SIGTE T3 2026, SAMU 454+45, DEIS, B3_B, estaciones 2026-12)
  const wp08Json = readJsonSafe(options.wp08Path || path.join(ROOT_DIR, 'data', 'systemic', '08_desagregaciones_sectoriales_aysen.json'), null);
  const wp05Json = readJsonSafe(options.wp05Path || path.join(ROOT_DIR, 'data', 'systemic', '05_social_salud_educacion_riesgos.json'), null);
  const minsalDetPath = options.minsalDetPath || path.join(ROOT_DIR, 'data', 'raw', 'informes_territoriales', 'salud_determinantes_sociales_minsal.json');
  const minsalDetJson = readJsonSafe(minsalDetPath, null);
  const wp08SaludRes = (wp08Json && wp08Json.resumen_regional && wp08Json.resumen_regional.salud_resumen) || {};
  const wp08SigteRes = (wp08Json && wp08Json.resumen_regional && wp08Json.resumen_regional.listas_espera_sigte) || {};
  const wp08PorComuna = Array.isArray(wp08Json && wp08Json.por_comuna) ? wp08Json.por_comuna : [];
  const totalPabWp08 = wp08PorComuna.reduce((acc, c) => acc + (Number(c?.datos?.salud_diferenciada?.red_hospitalaria?.quirofanos_totales) || 0), 0);
  const hrcRowWp08 = wp08PorComuna.find(c => String(c.comuna_ine) === '11101') || {};
  const chChicoRowWp08 = wp08PorComuna.find(c => String(c.comuna_ine) === '11401') || {};
  const hospNodesLayer = (dataLake.spatialNodesByLayer && Array.isArray(dataLake.spatialNodesByLayer.hospitales_postas))
    ? dataLake.spatialNodesByLayer.hospitales_postas
    : [];
  const chChicoNodeLayer = hospNodesLayer.find(n => String(n.comuna_ine) === '11401' && /Hospital/i.test(String(n.tipo || n.nombre || '')));
  const chileChicoHospitalName = String(
    chChicoRowWp08?.datos?.salud_diferenciada?.red_hospitalaria?.establecimiento_hospitalario ||
    (chChicoNodeLayer && chChicoNodeLayer.nombre) ||
    ''
  );
  const wp05AeroSum = Array.isArray(wp05Json && wp05Json.por_comuna)
    ? wp05Json.por_comuna.reduce((acc, c) => acc + (Number(c?.datos?.salud_red_asistencial?.aeroevacuaciones_samu_anual) || 0), 0)
    : 454;
  const minsalDetAeroSum = Array.isArray(minsalDetJson && minsalDetJson.por_comuna)
    ? minsalDetJson.por_comuna.reduce((acc, c) => acc + (Number(c?.aeroevacuaciones_samu_anual) || 0), 0)
    : 454;
  const saludHubObj = Array.isArray(dataLake.hubs) ? dataLake.hubs.find(h => h && h.id === 'salud') : null;
  const saludBaroQs = Array.isArray(saludHubObj?.espejo_barometro?.preguntas) ? saludHubObj.espejo_barometro.preguntas : [];
  const saludBarometroHasB3B = saludBaroQs.some(q => String(q && q.codigo) === 'B3_B');
  const estacionesHasFuture202612 = estacionesArr.some(st =>
    Array.isArray(st && st.serie_temporal) && st.serie_temporal.some(pt => String((pt && (pt.periodo_mes || pt.fecha)) || '').startsWith('2026-12'))
  );
  const nodo39 = Array.isArray(dataLake.nodos) ? dataLake.nodos.find(n => n && n.id === 39) : null;
  const nodo39Ds0Sum = Array.isArray(nodo39?.chartSpec?.datasets?.[0]?.data)
    ? nodo39.chartSpec.datasets[0].data.reduce((a, b) => a + (Number(b) || 0), 0)
    : null;
  const nodo39Ds1Sum = Array.isArray(nodo39?.chartSpec?.datasets?.[1]?.data)
    ? nodo39.chartSpec.datasets[1].data.reduce((a, b) => a + (Number(b) || 0), 0)
    : null;

  const hub8SaludAudit = {
    hrcQuirofanosTotales: Number(hrcRowWp08?.datos?.salud_diferenciada?.red_hospitalaria?.quirofanos_totales ?? 4),
    totalPabellonesQuirurgicos: totalPabWp08 || Number(wp08SaludRes.total_pabellones_quirurgicos || 0),
    chileChicoHospitalName,
    apsResumen: {
      total_cesfam: Number(wp08SaludRes.total_cesfam || 0),
      total_cecosf: Number(wp08SaludRes.total_cecosf || 0),
      total_postas_salud_rural_psr: Number(wp08SaludRes.total_postas_salud_rural_psr || 0),
      total_emr_ssa: Number(wp08SaludRes.total_emr_ssa || 0),
      total_cosam: Number(wp08SaludRes.total_cosam || 0)
    },
    sigteRegional: {
      cne_no_ges_ssa_t3_2026: Number(wp08SigteRes.cne_no_ges_ssa_t3_2026 || 0),
      iq_no_ges_ssa_t3_2026: Number(wp08SigteRes.iq_no_ges_ssa_t3_2026 || 0),
      odontologia_no_ges_ssa_dic2024: Number(wp08SigteRes.odontologia_no_ges_ssa_dic2024 || 0),
      retrasos_ges_ssa_t3_2026: Number(wp08SigteRes.retrasos_ges_ssa_t3_2026 || 0),
      mediana_espera_cne_dias: Number(wp08SigteRes.mediana_espera_cne_dias || 0),
      mediana_espera_quirurgica_dias: Number(wp08SigteRes.mediana_espera_quirurgica_dias || 0)
    },
    wp05AeroSum,
    minsalDetAeroSum,
    dotacionMedica: {
      medicos_rnpi_por_mil_hab: Number(wp08SaludRes.medicos_rnpi_por_mil_hab || 0),
      medicos_red_publica_ssa_por_mil_hab: Number(wp08SaludRes.medicos_red_publica_ssa_por_mil_hab || 0)
    },
    saludBarometroHasB3B,
    estacionesCount: estacionesArr.length,
    estacionesHasFuture202612,
    nodo39Ds0Sum,
    nodo39Ds1Sum
  };


  // Contexto Hub IX (Sprint 12 - Eval E22: CMN 16/23, RMC 16/27, MRA 36173, SNBP 16/31221, Gasto Censo 2024, Indigena 29.0% / 29230, CONADI 47 SIIC, 25 PCC, Barometro Semaforo, Wiki)
  const wp09PathAudit = options.wp09Path || path.join(ROOT_DIR, 'data', 'systemic', '09_cultura_patrimonio.json');
  const wp09JsonAudit = readJsonSafe(wp09PathAudit, null);
  const wp09ResAudit = (wp09JsonAudit && wp09JsonAudit.resumen_regional) || {};
  const wp09ComsAudit = Array.isArray(wp09JsonAudit && wp09JsonAudit.por_comuna) ? wp09JsonAudit.por_comuna : [];
  const wp09NodosAudit = Array.isArray(wp09JsonAudit && wp09JsonAudit.nodos_georreferenciados) ? wp09JsonAudit.nodos_georreferenciados : [];
  const culNodesSpatial = Array.isArray(dataLake?.spatialNodesByLayer?.museos_cultura) ? dataLake.spatialNodesByLayer.museos_cultura : [];
  const mraSpatial = culNodesSpatial.find(n => n && n.id === 'cul_CP-NOD-01') || null;
  const marmolSpatial = culNodesSpatial.find(n => n && n.id === 'cul_CP-NOD-04') || null;
  const bibRegSpatial = culNodesSpatial.find(n => n && n.id === 'cul_CP-NOD-06') || null;
  const marmolJsonNode = wp09NodosAudit.find(n => n && n.id === 'CP-NOD-04') || null;

  const cmnBienesByIne = {};
  const semaforoMuestralByIne = {};
  for (const row of wp09ComsAudit) {
    const ine = String(row && row.comuna_ine || '');
    if (!ine) continue;
    cmnBienesByIne[ine] = Number(row?.datos?.monumentos_nacionales_bienes_count ?? 0);
    semaforoMuestralByIne[ine] = String(row?.datos?.semaforo_muestral_barometro || '');
  }

  const readWikiSafe = (relParts) => {
    try {
      const fp = path.join(ROOT_DIR, ...relParts);
      return fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : '';
    } catch (_) {
      return '';
    }
  };
  const wikiHub9Txt = readWikiSafe(['wiki', 'hubs', 'hub_09_cultura.md']);
  const wikiN32Txt = readWikiSafe(['wiki', 'nodos', 'nodo_32.md']);
  const wikiN33Txt = readWikiSafe(['wiki', 'nodos', 'nodo_33.md']);
  const wikiN34Txt = readWikiSafe(['wiki', 'nodos', 'nodo_34.md']);
  const combinedWikiH9 = `${wikiHub9Txt}\n${wikiN32Txt}\n${wikiN33Txt}\n${wikiN34Txt}`;
  const wikiHasObsolete18Rmc = /18 espacios museogr[aá]ficos inscritos en el Registro de Museos de Chile/i.test(combinedWikiH9);
  const tortelRowMatch = wikiN34Txt.match(/\|\s*\[\[comunas\/tortel\|Tortel\]\][^\n]*/i);
  const wikiNodo34HasObsoleteTortel19 = tortelRowMatch ? /\|\s*19(?:\.0)?%\s*\|/i.test(tortelRowMatch[0]) : false;

  const hub9CulturaAudit = {
    cmnBienesByIne,
    cmnBienesTotal: Number(wp09ResAudit.total_monumentos_nacionales_bienes_cmn || 0),
    capillaMarmolComunaIne: String(marmolSpatial?.comuna_ine || marmolJsonNode?.comuna_ine || ''),
    museosRedRegionalTotal: Number(wp09ResAudit.total_museos_red_regional || 0),
    mraVisitas2025: Number(mraSpatial?.magnitudeValue ?? wp09ResAudit.visitas_museo_regional_aysen_2025 ?? 0),
    bibRegPrestamos2024: Number(bibRegSpatial?.magnitudeValue ?? 0),
    bibliotecasPublicasByIne: Object.fromEntries(
      (dataLake.comunas || []).map(r => [String(r.comuna_ine || ''), Number(r.bibliotecas_publicas_count ?? NaN)])
    ),
    museosEspaciosByIne: Object.fromEntries(
      (dataLake.comunas || []).map(r => [String(r.comuna_ine || ''), Number(r.museos_espacios_n ?? NaN)])
    ),
    gastoCulturalAliasByIne: Object.fromEntries(
      (dataLake.comunas || []).map(r => [String(r.comuna_ine || ''), Number(r.gasto_cultural_per_capita_clp ?? NaN)])
    ),
    autoidentificacionIndigenaByIne: Object.fromEntries(
      (dataLake.comunas || []).map(r => [String(r.comuna_ine || ''), Number(r.autoidentificacion_indigena_pct ?? NaN)])
    ),
    pueblosOriginariosResumen: {
      total_comunidades_conadi_registradas: Number(wp09ResAudit.pueblos_originarios?.total_comunidades_conadi_registradas || 0),
      familias_comunidades_conadi_siic: Number(wp09ResAudit.pueblos_originarios?.familias_comunidades_conadi_siic || 0),
      total_organizaciones_indigenas_comunidades_y_asociaciones: Number(wp09ResAudit.pueblos_originarios?.total_organizaciones_indigenas_comunidades_y_asociaciones || 0),
      poblacion_indigena_censo_2024: Number(wp09ResAudit.pueblos_originarios?.poblacion_indigena_censo_2024 || 0),
      autoidentificacion_regional_pct: Number(wp09ResAudit.pueblos_originarios?.autoidentificacion_regional_pct || 0)
    },
    semaforoMuestralByIne,
    barometroMicrodatosB4B: {
      promedio: Number(wp09ResAudit.nota_percepcion_cultura_microdatos_b4b || 0),
      tasa_positiva_pct: Number(wp09ResAudit.tasa_positiva_cultura_b4b_pct || 0)
    },
    wikiHasObsolete18Rmc,
    wikiNodo34HasObsoleteTortel19
  };

  return {
    schemaVersion: '3.0.0',
    label,
    capturedAt: new Date().toISOString(),
    bundleGeneratedAt: dataLake.generatedAt || null,
    autoUpdateMeta: (dataLake.meta && dataLake.meta.autoUpdate) || null,
    comunas,
    comunaHogares,
    comunaPoblacion,
    hub4FiscalAudit: {
      ingresosMunBcn2025ByIne,
      wp01PatentesAcuicolasByIne,
      nodo15PatentesAcuicolasByIne,
      padronOct2024ByIne,
      votantesOct2024ByIne
    },
    hub5EconomyAudit,
    hub6SocialAudit,
    hub7BiodivAudit,
    hub8SaludAudit,
    hub9CulturaAudit,
    centralesElectricas,
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
    { id: 'seriesLatest', label: 'Series Anuales (Último Corte)', hubTitle: 'Series Históricas Regionales' },
    { id: 'centralesElectricas', label: 'Centrales Eléctricas CNE (MW)', hubTitle: CANONICAL_HUB_TITLES.energia }
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

function evaluatePhysicalAndDemographicInvariants(snapshot, options = {}) {
  const alerts = [];
  if (!snapshot || typeof snapshot !== 'object') return alerts;
  const comunas = Array.isArray(snapshot.comunas) ? snapshot.comunas : [];
  const indicators = snapshot.indicators || {};
  const lexiconJson = options.lexicon || readJsonSafe(options.lexiconPath || LEXICON_PATH, { variables: [] });
  const excludedAliasSet = new Set(
    (Array.isArray(lexiconJson.variables) ? lexiconJson.variables : [])
      .filter(v => v && (v.isAliasOf || v.isComplementOf))
      .map(v => v.id)
  );

  // Invariante 1: INVARIANTE_DEMOGRAFICO_HOGARES (hogares implicitos en leña y conexiones residenciales SUBTEL <= 1.05 * hogares_censo_2024 <= poblacion)
  for (const c of comunas) {
    const ine = String(c.comuna_ine || '');
    const cName = c.nombre || ine;
    if (!ine) continue;
    const hogRaw = (snapshot.comunaHogares && snapshot.comunaHogares[ine] !== undefined)
      ? snapshot.comunaHogares[ine]
      : indicators.hogares_censo_2024?.values?.[ine];
    const pobRaw = (snapshot.comunaPoblacion && snapshot.comunaPoblacion[ine] !== undefined)
      ? snapshot.comunaPoblacion[ine]
      : indicators.poblacion_censo_2024?.values?.[ine];
    const hogares = (typeof hogRaw === 'number' && Number.isFinite(hogRaw)) ? hogRaw : null;
    const pob = (typeof pobRaw === 'number' && Number.isFinite(pobRaw)) ? pobRaw : null;

    const lenaVol = indicators.consumo_lena_m3_solidos_anual?.values?.[ine];
    const lenaHog = indicators.consumo_lena_m3_hogar_ano?.values?.[ine];
    if (typeof lenaVol === 'number' && Number.isFinite(lenaVol) && typeof lenaHog === 'number' && Number.isFinite(lenaHog) && lenaHog > 0) {
      const impliedHog = lenaVol / lenaHog;
      if ((hogares !== null && hogares > 0 && impliedHog > 1.05 * hogares) || (pob !== null && pob > 0 && impliedHog > pob)) {
        alerts.push({
          severity: 'ALTA',
          code: 'VIOLACION_INVARIANTE_DEMOGRAFICO',
          invariant: 'INVARIANTE_DEMOGRAFICO_HOGARES',
          indicator: 'consumo_lena_m3_solidos_anual',
          hub: CANONICAL_HUB_TITLES.energia,
          detail: `[INVARIANTE_DEMOGRAFICO_HOGARES] ${cName}: ${Math.round(impliedHog)} hogares implícitos de leña (${formatNumberCL(lenaVol)} m³ / ${formatNumberCL(lenaHog)} m³/hogar) exceden 1.05x hogares Censo 2024 (${hogares ?? 'N/D'}) o población (${pob ?? 'N/D'}).`
        });
      }
    }

    const subtelRes = indicators.conexiones_residenciales_subtel_jun2026_n?.values?.[ine];
    if (typeof subtelRes === 'number' && Number.isFinite(subtelRes)) {
      if ((hogares !== null && hogares > 0 && subtelRes > 1.05 * hogares) || (pob !== null && pob > 0 && subtelRes > pob)) {
        alerts.push({
          severity: 'ALTA',
          code: 'VIOLACION_INVARIANTE_DEMOGRAFICO',
          invariant: 'INVARIANTE_DEMOGRAFICO_HOGARES',
          indicator: 'conexiones_residenciales_subtel_jun2026_n',
          hub: CANONICAL_HUB_TITLES.energia,
          detail: `[INVARIANTE_DEMOGRAFICO_HOGARES] ${cName}: ${formatNumberCL(subtelRes)} conexiones residenciales SUBTEL exceden hogares Censo 2024 (${hogares ?? 'N/D'}).`
        });
      }
    }
  }

  // Invariante 2: INVARIANTE_CONSERVACION_POTENCIA_MW (SUM comunas == SUM centrales <= 0.1 MW y SSAA <= 1.50 MW Art. 173 LGSE)
  const centrales = Array.isArray(snapshot.centralesElectricas) ? snapshot.centralesElectricas : [];
  if (indicators.potencia_mw && centrales.length > 0 && comunas.length > 0) {
    const sumComunas = comunas.reduce((acc, c) => acc + (Number(indicators.potencia_mw.values?.[c.comuna_ine]) || 0), 0);
    const sumPlantas = centrales.reduce((acc, p) => acc + (Number(p.potencia_mw) || 0), 0);
    if (Math.abs(sumComunas - sumPlantas) > 0.1) {
      alerts.push({
        severity: 'ALTA',
        code: 'VIOLACION_INVARIANTE_FISICO_MW',
        invariant: 'INVARIANTE_CONSERVACION_POTENCIA_MW',
        indicator: 'potencia_mw',
        hub: CANONICAL_HUB_TITLES.energia,
        detail: `[INVARIANTE_CONSERVACION_POTENCIA_MW] Descalce de conservación eléctrica: SUM(comunas.potencia_mw) = ${sumComunas.toFixed(2)} MW vs. SUM(centrales.potencia_mw) = ${sumPlantas.toFixed(2)} MW (tolerancia <= 0,10 MW).`
      });
    }

    const byIne = {};
    for (const p of centrales) {
      if (!p.comuna_ine) continue;
      byIne[p.comuna_ine] = (byIne[p.comuna_ine] || 0) + (Number(p.potencia_mw) || 0);
      if (/sistema\s+aislado/i.test(p.sistema || '') && !/sistema\s+mediano/i.test(p.sistema || '') && Number(p.potencia_mw) > 1.50) {
        alerts.push({
          severity: 'ALTA',
          code: 'VIOLACION_INVARIANTE_FISICO_MW',
          invariant: 'INVARIANTE_CONSERVACION_POTENCIA_MW',
          indicator: 'potencia_mw',
          hub: CANONICAL_HUB_TITLES.energia,
          detail: `[INVARIANTE_CONSERVACION_POTENCIA_MW] Central "${p.nombre || p.id}" clasificada como Sistema Aislado declara ${Number(p.potencia_mw).toFixed(2)} MW, violando límite legal <= 1,50 MW (Art. 173° LGSE).`
        });
      }
    }
    for (const c of comunas) {
      if (byIne[c.comuna_ine] === undefined) continue;
      const cmw = Number(indicators.potencia_mw.values?.[c.comuna_ine]) || 0;
      const pmw = byIne[c.comuna_ine];
      if (Math.abs(cmw - pmw) > 0.1) {
        alerts.push({
          severity: 'ALTA',
          code: 'VIOLACION_INVARIANTE_FISICO_MW',
          invariant: 'INVARIANTE_CONSERVACION_POTENCIA_MW',
          indicator: 'potencia_mw',
          hub: CANONICAL_HUB_TITLES.energia,
          detail: `[INVARIANTE_CONSERVACION_POTENCIA_MW] ${c.nombre}: potencia comunal (${cmw.toFixed(2)} MW) difiere de centrales (${pmw.toFixed(2)} MW) > 0,10 MW.`
        });
      }
    }
  }

  // Invariante 3: INVARIANTE_CERO_COLINEALIDAD_ACTIVA (|r| >= 0.9995 afín/complementaria entre indicadores activos)
  if (comunas.length >= 5) {
    const ines = comunas.map(c => String(c.comuna_ine));
    const coyIdx = ines.indexOf('11101');
    const aysIdx = ines.indexOf('11201');
    const activeVecs = [];
    for (const [k, obj] of Object.entries(indicators)) {
      if (excludedAliasSet.has(k) || !obj || obj.type !== 'numeric' || !obj.values) continue;
      const xs = ines.map(ine => Number(obj.values[ine]));
      if (xs.some(v => !Number.isFinite(v))) continue;
      const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
      const dx = xs.reduce((a, b) => a + (b - mx) * (b - mx), 0);
      if (dx <= 1e-12) continue;
      activeVecs.push({ k, xs, mx, dx });
    }
    for (let i = 0; i < activeVecs.length; i++) {
      for (let j = i + 1; j < activeVecs.length; j++) {
        const A = activeVecs[i], B = activeVecs[j];
        let num = 0;
        for (let t = 0; t < A.xs.length; t++) num += (A.xs[t] - A.mx) * (B.xs[t] - B.mx);
        const r = num / Math.sqrt(A.dx * B.dx);
        if (Math.abs(r) < 0.9995) continue;

        let isRedundant = r <= -0.9995;
        if (!isRedundant) {
          const slope = num / A.dx;
          const intercept = B.mx - slope * A.mx;
          const rngY = (Math.max(...B.xs) - Math.min(...B.xs)) || 1;
          let maxRelResid = 0;
          for (let t = 0; t < A.xs.length; t++) {
            maxRelResid = Math.max(maxRelResid, Math.abs(B.xs[t] - (intercept + slope * A.xs[t])) / rngY);
          }
          const xs2 = A.xs.filter((_, idx) => idx !== coyIdx && idx !== aysIdx);
          const ys2 = B.xs.filter((_, idx) => idx !== coyIdx && idx !== aysIdx);
          let rNoCA = 0;
          if (xs2.length >= 3) {
            const m2x = xs2.reduce((a, b) => a + b, 0) / xs2.length;
            const m2y = ys2.reduce((a, b) => a + b, 0) / ys2.length;
            let n2 = 0, d2x = 0, d2y = 0;
            for (let t = 0; t < xs2.length; t++) {
              n2 += (xs2[t] - m2x) * (ys2[t] - m2y);
              d2x += (xs2[t] - m2x) * (xs2[t] - m2x);
              d2y += (ys2[t] - m2y) * (ys2[t] - m2y);
            }
            if (d2x > 0 && d2y > 0) rNoCA = n2 / Math.sqrt(d2x * d2y);
          }
          isRedundant = Math.abs(rNoCA) >= 0.9995 && maxRelResid <= 0.0065;
        }

        if (isRedundant) {
          alerts.push({
            severity: 'ALTA',
            code: 'COLINEALIDAD_ESPURIA_ACTIVA',
            invariant: 'INVARIANTE_CERO_COLINEALIDAD_ACTIVA',
            indicator: `${A.k} ~ ${B.k}`,
            hub: 'Transversal (Calidad Estadística)',
            detail: `[INVARIANTE_CERO_COLINEALIDAD_ACTIVA] Par activo colineal detectado sin etiqueta isAliasOf/isComplementOf: ${A.k} vs ${B.k} (r = ${r.toFixed(6)}).`
          });
        }
      }
    }
  }

  return alerts;
}

function evaluateHub4FiscalAndElectoralInvariants(bundleOrSnapshot, options = {}) {
  const alerts = [];
  if (!bundleOrSnapshot || typeof bundleOrSnapshot !== 'object') return alerts;
  const snapshot = (!bundleOrSnapshot.indicators && Array.isArray(bundleOrSnapshot.comunas))
    ? extractSnapshotFromBundle(bundleOrSnapshot, 'direct', options)
    : bundleOrSnapshot;
  const comunas = Array.isArray(snapshot.comunas) ? snapshot.comunas : [];
  const indicators = snapshot.indicators || {};
  const h4 = snapshot.hub4FiscalAudit || {};
  if (comunas.length === 0 || !indicators.presupuesto_mclp) return alerts;

  let totalPadron24 = 0;
  let totalVotantes24 = 0;

  for (const c of comunas) {
    const ine = String(c.comuna_ine || '');
    const cName = c.nombre || ine;
    if (!ine) continue;

    const pres = Number(indicators.presupuesto_mclp?.values?.[ine]);
    const ingBcn = Number(
      h4.ingresosMunBcn2025ByIne?.[ine] !== undefined
        ? h4.ingresosMunBcn2025ByIne[ine]
        : indicators.ingresos_mun_bcn_2025_mclp?.values?.[ine]
    );
    const fcm = Number(indicators.fcm_bcn_2025_mclp?.values?.[ine]);
    const ipp = Number(indicators.ipp_bcn_2025_mclp?.values?.[ine]);

    // 1. Invariante de Coherencia Presupuestaria Municipal
    if (Number.isFinite(pres) && Number.isFinite(fcm) && Number.isFinite(ipp)) {
      if (pres < fcm || pres <= fcm + 0.5 * ipp || (Number.isFinite(ingBcn) && Math.abs(pres - ingBcn) > 0.5)) {
        alerts.push({
          severity: 'ALTA',
          code: 'ERROR_CONTABLE_PRESUPUESTO_MENOR_QUE_FCM',
          invariant: 'INVARIANTE_COHERENCIA_PRESUPUESTO_MUNICIPAL',
          indicator: 'presupuesto_mclp',
          hub: CANONICAL_HUB_TITLES.gobernanza,
          detail: `[ERROR_CONTABLE_PRESUPUESTO_MENOR_QUE_FCM] ${cName}: presupuesto (${formatNumberCL(pres)} M$) incoherente frente a FCM (${formatNumberCL(fcm)} M$) + 0,5*IPP (${formatNumberCL(0.5 * ipp)} M$) o BCN 2025 (${formatNumberCL(ingBcn)} M$).`
        });
      }

      // 3a. Invariante Contable de Dependencia FCM
      const dep = Number(indicators.dependencia_fcm_pct?.values?.[ine]);
      if (Number.isFinite(dep) && (ipp + fcm) > 0) {
        const expDep = Number(((fcm / (ipp + fcm)) * 100).toFixed(1));
        if (Math.abs(dep - expDep) > 0.2) {
          alerts.push({
            severity: 'ALTA',
            code: 'ERROR_CONTABLE_DEPENDENCIA_FCM',
            invariant: 'INVARIANTE_CONTABLE_FCM_Y_IPP_PC',
            indicator: 'dependencia_fcm_pct',
            hub: CANONICAL_HUB_TITLES.gobernanza,
            detail: `[ERROR_CONTABLE_DEPENDENCIA_FCM] ${cName}: dependencia_fcm_pct=${dep}% difiere de FCM/(IPP+FCM)=${expDep}% (>0,2%).`
          });
        }
      }

      // 3b. Invariante Contable IPP Per Capita (ipp_bcn_2025_mclp en M$ -> CLP/hab)
      const ippPc = Number(indicators.ipp_per_capita_clp?.values?.[ine]);
      const pop = Number(indicators.poblacion_censo_2024?.values?.[ine] ?? snapshot.comunaPoblacion?.[ine]);
      if (Number.isFinite(ippPc) && Number.isFinite(pop) && pop > 0) {
        const expIppPc = Math.round((ipp * 1000000) / pop);
        if (Math.abs(ippPc - expIppPc) > 5) {
          alerts.push({
            severity: 'ALTA',
            code: 'ERROR_CONTABLE_IPP_PER_CAPITA',
            invariant: 'INVARIANTE_CONTABLE_FCM_Y_IPP_PC',
            indicator: 'ipp_per_capita_clp',
            hub: CANONICAL_HUB_TITLES.gobernanza,
            detail: `[ERROR_CONTABLE_IPP_PER_CAPITA] ${cName}: ipp_per_capita_clp=${ippPc} difiere de round(IPP*1e6/pob)=${expIppPc} (>5 CLP).`
          });
        }
      }
    }

    // 2. Invariante Geografico de Patentes Acuicolas (0 en comunas sin concesiones_salmon)
    const concSalmon = Number(indicators.concesiones_salmon?.values?.[ine]) || 0;
    if (concSalmon === 0) {
      const wp01Acu = Number(h4.wp01PatentesAcuicolasByIne?.[ine]) || 0;
      const n15Acu = Number(h4.nodo15PatentesAcuicolasByIne?.[ine]) || 0;
      if (wp01Acu > 0 || n15Acu > 0) {
        alerts.push({
          severity: 'ALTA',
          code: 'ERROR_PATENTE_ACUICOLA_COMUNA_INTERIOR',
          invariant: 'INVARIANTE_GEOGRAFICO_PATENTES_ACUICOLAS',
          indicator: 'ingresos_patentes_acuicolas_mclp',
          hub: CANONICAL_HUB_TITLES.gobernanza,
          detail: `[ERROR_PATENTE_ACUICOLA_COMUNA_INTERIOR] ${cName} (${ine}) tiene 0 concesiones salmoneras pero registra patentes acuicolas > 0 (WP01=${wp01Acu} M$, Nodo #15=${n15Acu} M$).`
        });
      }
    }

    // 4. Invariante Electoral SERVEL Municipales Oct-2024
    const part24 = Number(indicators.participacion_municipales_2024_pct?.values?.[ine]);
    const pad24 = Number(h4.padronOct2024ByIne?.[ine]) || 0;
    const vot24 = Number(h4.votantesOct2024ByIne?.[ine]) || 0;
    if (pad24 > 0) totalPadron24 += pad24;
    if (vot24 > 0) totalVotantes24 += vot24;
    if (Number.isFinite(part24)) {
      const expPart24 = pad24 > 0 ? Number(((vot24 / pad24) * 100).toFixed(1)) : part24;
      if (part24 < 55 || part24 > 82 || (pad24 > 0 && Math.abs(part24 - expPart24) > 0.15)) {
        alerts.push({
          severity: 'ALTA',
          code: 'ERROR_ELECTORAL_SERVEL_2024',
          invariant: 'INVARIANTE_ELECTORAL_SERVEL_2024',
          indicator: 'participacion_municipales_2024_pct',
          hub: CANONICAL_HUB_TITLES.gobernanza,
          detail: `[ERROR_ELECTORAL_SERVEL_2024] ${cName}: participacion_municipales_2024_pct=${part24}% fuera de rango [55%, 82%] o inconsistente con vot/pad (${expPart24}%).`
        });
      }
    }
  }

  if (totalPadron24 > 0 && totalVotantes24 > 0) {
    const regPart24 = Number(((totalVotantes24 / totalPadron24) * 100).toFixed(1));
    if (Math.abs(regPart24 - 72.9) > 0.2) {
      alerts.push({
        severity: 'ALTA',
        code: 'ERROR_ELECTORAL_SERVEL_2024',
        invariant: 'INVARIANTE_ELECTORAL_SERVEL_2024',
        indicator: 'participacion_municipales_2024_pct',
        hub: CANONICAL_HUB_TITLES.gobernanza,
        detail: `[ERROR_ELECTORAL_SERVEL_2024] Promedio regional ponderado=${regPart24}% difiere de 72,9%.`
      });
    }
  }

  return alerts;
}

function evaluateHub5EconomyInvestmentLandInvariants(bundleOrSnapshot, options = {}) {
  const alerts = [];
  if (!bundleOrSnapshot || typeof bundleOrSnapshot !== 'object') return alerts;
  const snapshot = (!bundleOrSnapshot.indicators && Array.isArray(bundleOrSnapshot.comunas))
    ? extractSnapshotFromBundle(bundleOrSnapshot, 'direct', options)
    : bundleOrSnapshot;
  const comunas = Array.isArray(snapshot.comunas) ? snapshot.comunas : [];
  const indicators = snapshot.indicators || {};
  const h5 = snapshot.hub5EconomyAudit || {};
  if (comunas.length === 0 || !h5.nodo20TramosData) return alerts;

  // 1. Erradicación de "Central Hidroeléctrica Los Cóndores" + 0 id_expediente + sincronía 1:1 SEIA
  const seiaSp = Array.isArray(h5.seiaSpatialNodes) ? h5.seiaSpatialNodes : [];
  const wp04Seia = Array.isArray(h5.wp04SeiaNodes) ? h5.wp04SeiaNodes : [];
  const hasLosCondores = seiaSp.some(n => /los[-_\s]?c[oó]ndores/i.test(`${n.id} ${n.nombre}`)) ||
    wp04Seia.some(n => /los[-_\s]?c[oó]ndores/i.test(`${n.id} ${n.nombre}`));
  const hasFakeExpediente = seiaSp.some(n => /id_expediente=/i.test(n.sourceUrl || '')) ||
    wp04Seia.some(n => /id_expediente=/i.test(n.source_url || ''));
  let seiaMismatchDetail = '';
  if (seiaSp.length !== 20 || wp04Seia.length !== 20) {
    seiaMismatchDetail = `Conteo SEIA distinto de 20 (bundle=${seiaSp.length}, wp04=${wp04Seia.length})`;
  } else {
    const wp04Map = new Map(wp04Seia.map(n => [`inv_${n.id}`, n.monto_inversion_mmusd]));
    for (const sn of seiaSp) {
      const expM = wp04Map.get(sn.id);
      if (expM === undefined || Math.abs(sn.magnitudeValue - expM) > 0.01) {
        seiaMismatchDetail = `Desincronia 1:1 en ${sn.id}: bundle=${sn.magnitudeValue} vs wp04=${expM}`;
        break;
      }
    }
  }
  if (hasLosCondores || hasFakeExpediente || seiaMismatchDetail) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_GEOGRAFICO_SEIA_LOS_CONDORES',
      invariant: 'INVARIANTE_SEIA_GEO_Y_SINCRONIA_1A1',
      indicator: 'inversion_seia_mmusd',
      hub: CANONICAL_HUB_TITLES.inversion,
      detail: `[ERROR_GEOGRAFICO_SEIA_LOS_CONDORES] SEIA invalido: losCondores=${hasLosCondores}, idExpedienteFicticio=${hasFakeExpediente}, sync=${seiaMismatchDetail || 'OK'}.`
    });
  }

  // 2. Contradicción SII (0 9.365/56.475, 5 tramos = 12.953 y ventas locales 25.800 vs bruto 131.520)
  const hub4Ex = String(h5.hub4ExampleText || '');
  const hasOldSiiExample = /9\.365|56\.475/.test(hub4Ex);
  const tramos = Array.isArray(h5.nodo20TramosData) ? h5.nodo20TramosData : [];
  const tramosSum = tramos.reduce((a, b) => a + (Number(b) || 0), 0);
  const sumVentasLocal = comunas.reduce((a, c) => a + (Number(indicators.ventas_sii_domicilio_local_muf?.values?.[c.comuna_ine]) || 0), 0);
  const sumVentasBruto = comunas.reduce((a, c) => a + (Number(indicators.ventas_sii_muf?.values?.[c.comuna_ine]) || 0), 0);
  if (hasOldSiiExample || tramos.length !== 5 || tramosSum !== 12953 || Math.abs(sumVentasLocal - 25800) > 1 || Math.abs(sumVentasBruto - 131520) > 1) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_CONTRADICCION_SII_TRAMOS_Y_VENTAS',
      invariant: 'INVARIANTE_SII_5_TRAMOS_Y_VENTAS_UF',
      indicator: 'ventas_sii_domicilio_local_muf',
      hub: CANONICAL_HUB_TITLES.inversion,
      detail: `[ERROR_CONTRADICCION_SII_TRAMOS_Y_VENTAS] SII inconsistente: oldEx=${hasOldSiiExample}, tramos=${tramos.length} (sum=${tramosSum}), localMUF=${sumVentasLocal}, brutoMUF=${sumVentasBruto}.`
    });
  }

  // 3. Catastro Minero SERNAGEOMIN (356 conc. / 128.511 ha) y titulares reales El Toqui / Cerro Bayo
  const sumMinHa = comunas.reduce((a, c) => a + (Number(indicators.concesiones_mineras_ha?.values?.[c.comuna_ine]) || 0), 0);
  const ccMinHa = Number(indicators.concesiones_mineras_ha?.values?.['11401']) || 0;
  const torMinHa = Number(indicators.concesiones_mineras_ha?.values?.['11303']) || 0;
  const guaMinHa = Number(indicators.concesiones_mineras_ha?.values?.['11203']) || 0;
  const sernRes = h5.sernageominResumen || {};
  const faenas = Array.isArray(h5.mineriaFaenas) ? h5.mineriaFaenas : [];
  const toquiNode = faenas.find(f => f.id === 'inv_min_el_toqui');
  const bayoNode = faenas.find(f => f.id === 'inv_min_cerro_bayo');
  const titularesOk = Boolean(
    toquiNode && /Pac[ií]fico del Sur/i.test(toquiNode.titular) &&
    bayoNode && /Andean Silver/i.test(bayoNode.titular)
  );
  if (
    Math.abs(sumMinHa - 128511) > 1 ||
    ccMinHa !== 47537 ||
    torMinHa !== 0 ||
    guaMinHa !== 0 ||
    (sernRes.explotacion + sernRes.exploracion) !== 356 ||
    !titularesOk
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_CATASTRO_MINERO_SERNAGEOMIN',
      invariant: 'INVARIANTE_SERNAGEOMIN_356_CONCESIONES',
      indicator: 'concesiones_mineras_ha',
      hub: CANONICAL_HUB_TITLES.inversion,
      detail: `[ERROR_CATASTRO_MINERO_SERNAGEOMIN] Catastro minero inconsistente: sumHa=${sumMinHa}, ChileChico=${ccMinHa}, Tortel=${torMinHa}, Guaitecas=${guaMinHa}, conc=${sernRes.explotacion}+${sernRes.exploracion}, titularesOk=${titularesOk}.`
    });
  }

  // 4. Masa Ganadera ODEPA (144.118 bovinos y 177.972 ovinos)
  const sumBov = comunas.reduce((a, c) => a + (Number(indicators.ganado_bovino_cabezas?.values?.[c.comuna_ine]) || 0), 0);
  const sumOv = comunas.reduce((a, c) => a + (Number(indicators.ganado_ovino_cabezas?.values?.[c.comuna_ine]) || 0), 0);
  if (sumBov !== 144118 || sumOv !== 177972) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_MASA_GANADERA_ODEPA',
      invariant: 'INVARIANTE_MASA_GANADERA_ODEPA',
      indicator: 'ganado_bovino_cabezas',
      hub: CANONICAL_HUB_TITLES.inversion,
      detail: `[ERROR_MASA_GANADERA_ODEPA] Masa ganadera incoherente: bovinos=${sumBov} (esp. 144118), ovinos=${sumOv} (esp. 177972).`
    });
  }

  // 5. PIB BCCh 2025 (1.991.000 MM$) y ChileCompra 2026 YTD (228.874,2 M$)
  if (Number(h5.pib2025Mmclp) !== 1991000 || Math.abs((Number(h5.chilecompra2026YtdMclp) || 0) - 228874.2) > 0.2) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_PIB_BCCH_Y_CHILECOMPRA',
      invariant: 'INVARIANTE_BCCH_PIB_Y_CHILECOMPRA',
      indicator: 'pib_regional_nominal_mmclp',
      hub: CANONICAL_HUB_TITLES.inversion,
      detail: `[ERROR_PIB_BCCH_Y_CHILECOMPRA] PIB 2025=${h5.pib2025Mmclp} (esp. 1991000) o ChileCompra 2026 YTD=${h5.chilecompra2026YtdMclp} (esp. 228874.2).`
    });
  }

  // 6. Banca CMF en D.comunas y Catastro Vegetacional CONAF 2026 (5.152.384,3 ha / 2.387.525,4 ha SNASPE)
  const hasAllCmfKeys = ['sucursales_bancarias_n', 'cajeros_automaticos_n', 'cajavecina_puntos_n'].every(k => Boolean(indicators[k]));
  const sumBosque = comunas.reduce((a, c) => {
    const v = indicators.bosque_nativo_ha?.values?.[c.comuna_ine] ?? h5.bosqueNativoByIne?.[c.comuna_ine] ?? 0;
    return a + (Number(v) || 0);
  }, 0);
  const c26 = h5.conaf2026 || {};
  if (!hasAllCmfKeys || Math.abs(sumBosque - 5152384.3) > 0.5 || Math.abs((Number(c26.bosques_en_snaspe_ha) || 0) - 2387525.4) > 0.5) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_BANCA_CMF_Y_CONAF_2026',
      invariant: 'INVARIANTE_CMF_Y_CONAF_2026',
      indicator: 'bosque_nativo_ha',
      hub: CANONICAL_HUB_TITLES.biodiversidad,
      detail: `[ERROR_BANCA_CMF_Y_CONAF_2026] hasAllCmfKeys=${hasAllCmfKeys}, sumBosque=${sumBosque.toFixed(1)} (esp. 5152384.3), snaspeBosque=${c26.bosques_en_snaspe_ha}.`
    });
  }

  return alerts;
}

function evaluateHub6SocialDemographyEducationHousingInvariants(bundleOrSnapshot, options = {}) {
  const alerts = [];
  if (!bundleOrSnapshot || typeof bundleOrSnapshot !== 'object') return alerts;
  const snapshot = (!bundleOrSnapshot.indicators && Array.isArray(bundleOrSnapshot.comunas))
    ? extractSnapshotFromBundle(bundleOrSnapshot, 'direct', options)
    : bundleOrSnapshot;
  const comunas = Array.isArray(snapshot.comunas) ? snapshot.comunas : [];
  const indicators = snapshot.indicators || {};
  const h6 = snapshot.hub6SocialAudit || {};
  if (comunas.length === 0 || !indicators.hogares_censo_2024) return alerts;

  const getVal = (key, ine) => Number(indicators[key]?.values?.[ine] ?? NaN);
  const sumInd = (key) => comunas.reduce((a, c) => a + (Number(indicators[key]?.values?.[c.comuna_ine]) || 0), 0);

  // 1. Censo 2024: Hogares (39.964), Viviendas totales (52.294), Ocupadas (39.631) e IAM exacto
  const sumHog = sumInd('hogares_censo_2024');
  const sumVivTot = sumInd('viviendas_totales_censo_2024');
  const sumVivOcu = comunas.reduce((a, c) => {
    const v = indicators.viviendas_ocupadas_censo_2024?.values?.[c.comuna_ine] ?? h6.viviendasOcupadasByIne?.[c.comuna_ine] ?? 0;
    return a + (Number(v) || 0);
  }, 0);
  const iamLV = getVal('indice_envejecimiento', '11102');
  const iamRI = getVal('indice_envejecimiento', '11402');
  const iamTor = getVal('indice_envejecimiento', '11303');
  if (
    sumHog !== 39964 ||
    sumVivTot !== 52294 ||
    sumVivOcu !== 39631 ||
    Math.abs(iamLV - 182.8) > 0.1 ||
    Math.abs(iamRI - 121.2) > 0.1 ||
    Math.abs(iamTor - 30.8) > 0.1
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_CENSO_2024_HOGARES_VIVIENDAS_IAM',
      invariant: 'INVARIANTE_CENSO_2024_DEMOGRAFIA',
      indicator: 'hogares_censo_2024',
      hub: CANONICAL_HUB_TITLES.social,
      detail: `[ERROR_CENSO_2024_HOGARES_VIVIENDAS_IAM] Censo 2024 inconsistente: hogares=${sumHog} (39964), vivTot=${sumVivTot} (52294), vivOcu=${sumVivOcu} (39631), IAM(LV=${iamLV}, RI=${iamRI}, Tor=${iamTor}).`
    });
  }

  // 2. Deficit Habitacional MINVU CECT (1.927 = 1.128 Coyhaique + 73 LV + 330 Aysen + 118 Cochrane...)
  const getDefVal = (ine) => Number(
    indicators.deficit_habitacional_cuantitativo_n?.values?.[ine] ??
    indicators.deficit_cuantitativo_minvu?.values?.[ine] ??
    h6.deficitCuantitativoMinvuByIne?.[ine] ??
    NaN
  );
  const sumDef = comunas.reduce((a, c) => a + (getDefVal(c.comuna_ine) || 0), 0);
  const defCoy = getDefVal('11101');
  const defLV = getDefVal('11102');
  const defAys = getDefVal('11201');
  const defCoc = getDefVal('11301');
  const sumAliasDef = h6.deficitCuantitativoMinvuByIne && Object.keys(h6.deficitCuantitativoMinvuByIne).length > 0
    ? comunas.reduce((a, c) => a + (Number(h6.deficitCuantitativoMinvuByIne[c.comuna_ine]) || 0), 0)
    : 1927;
  if (sumDef !== 1927 || sumAliasDef !== 1927 || defCoy !== 1128 || defLV !== 73 || defAys !== 330 || defCoc !== 118) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_MINVU_CECT_DEFICIT_HABITACIONAL',
      invariant: 'INVARIANTE_MINVU_CECT_2024',
      indicator: 'deficit_habitacional_cuantitativo_n',
      hub: CANONICAL_HUB_TITLES.social,
      detail: `[ERROR_MINVU_CECT_DEFICIT_HABITACIONAL] Deficit MINVU inconsistente: sum=${sumDef} (alias=${sumAliasDef}, esp. 1927), Coy=${defCoy}, LV=${defLV}, Ays=${defAys}, Coc=${defCoc}.`
    });
  }

  // 3. Agua Potable Rural SSR/APR DOH-MOP: familias SSR < hogares Censo 2024 y sumas (9.185 fam / 28.833 pers)
  const sumSsrFam = sumInd('cobertura_ssr_apr_familias');
  const sumSsrPers = sumInd('beneficiarios_ssr_apr_doh');
  const ssrOverCap = comunas.find(c => {
    const fam = getVal('cobertura_ssr_apr_familias', c.comuna_ine);
    const hog = getVal('hogares_censo_2024', c.comuna_ine);
    return Number.isFinite(fam) && Number.isFinite(hog) && fam >= hog;
  });
  if (sumSsrFam !== 9185 || sumSsrPers !== 28833 || ssrOverCap) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_SSR_DOH_COBERTURA_FAMILIAS',
      invariant: 'INVARIANTE_SSR_DOH_POBLACION',
      indicator: 'cobertura_ssr_apr_familias',
      hub: CANONICAL_HUB_TITLES.social,
      detail: `[ERROR_SSR_DOH_COBERTURA_FAMILIAS] SSR/APR inconsistente: familias=${sumSsrFam} (9185), personas=${sumSsrPers} (28833), exceso=${ssrOverCap ? ssrOverCap.comuna_ine : 'ninguno'}.`
    });
  }

  // 4. Educacion MINEDUC/SLEP/SIES: 86 colegios (55 SLEP), Tortel 1 escuela / 0 liceos, SIES 2.924 (2.187/737)
  const sumEsc = sumInd('establecimientos_escolares_n');
  const sumSlep = sumInd('establecimientos_slep_aysen');
  const sumSies = sumInd('matricula_educacion_superior_sies_n');
  const siesCoy = getVal('matricula_educacion_superior_sies_n', '11101');
  const siesAys = getVal('matricula_educacion_superior_sies_n', '11201');
  const tEdu = h6.tortelEducacion || {};
  const tortelEst = getVal('establecimientos_escolares_n', '11303');
  const dsArr = Array.isArray(h6.nodo25Datasets) ? h6.nodo25Datasets : [];
  const nodo25Sum = dsArr.length >= 2
    ? dsArr.slice(0, 2).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.reduce((a, b) => a + (Number(b) || 0), 0) : 0), 0)
    : 86;
  if (
    sumEsc !== 86 ||
    sumSlep !== 55 ||
    tortelEst !== 1 ||
    tEdu.escuelas_rurales_multigrado_n !== 1 ||
    tEdu.liceos_urbanos_n !== 0 ||
    nodo25Sum !== 86 ||
    sumSies !== 2924 ||
    siesCoy !== 2187 ||
    siesAys !== 737
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_EDUCACION_SLEP_Y_SIES_2026',
      invariant: 'INVARIANTE_SLEP_86_Y_SIES_2924',
      indicator: 'matricula_educacion_superior_sies_n',
      hub: CANONICAL_HUB_TITLES.social,
      detail: `[ERROR_EDUCACION_SLEP_Y_SIES_2026] Educacion inconsistente: esc=${sumEsc} (86), slep=${sumSlep} (55), Tortel(est=${tortelEst}, escRur=${tEdu.escuelas_rurales_multigrado_n}, lic=${tEdu.liceos_urbanos_n}), nodo25=${nodo25Sum}, SIES=${sumSies} (${siesCoy}/${siesAys}).`
    });
  }

  // 5. Seguridad CEAD: cero multiplos sinteticos antiguos en tasa_dmcs_100k o tasa_vif_100k
  const bannedCead = new Set([420, 1120, 890, 1340, 910, 1280, 650, 510]);
  const badCeadFound = [];
  for (const c of comunas) {
    for (const k of ['tasa_dmcs_100k', 'tasa_vif_100k']) {
      const val = getVal(k, c.comuna_ine);
      if (Number.isFinite(val) && bannedCead.has(val)) {
        badCeadFound.push(`${c.comuna_ine}:${k}=${val}`);
      }
    }
  }
  if (badCeadFound.length > 0) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_SEGURIDAD_CEAD_VALORES_SINTETICOS',
      invariant: 'INVARIANTE_CEAD_2023_2025_REAL',
      indicator: 'tasa_dmcs_100k',
      hub: CANONICAL_HUB_TITLES.social,
      detail: `[ERROR_SEGURIDAD_CEAD_VALORES_SINTETICOS] Multiplos sinteticos heredados detectados: ${badCeadFound.join(', ')}.`
    });
  }

  // 6. Wiki hub_06_social.md: 57.823 y 23.170 sin resabios de 61.210
  const wikiTxt = String(h6.hub06WikiText || '');
  if (wikiTxt && (!wikiTxt.includes('57.823') || !wikiTxt.includes('23.170') || wikiTxt.includes('61.210'))) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_WIKI_HUB06_POBLACION_CENSO_2024',
      invariant: 'INVARIANTE_WIKI_HUB06_TEXTO_CENSO',
      indicator: 'poblacion_censo_2024',
      hub: CANONICAL_HUB_TITLES.social,
      detail: '[ERROR_WIKI_HUB06_POBLACION_CENSO_2024] wiki/hubs/hub_06_social.md debe reflejar 57.823 / 23.170 sin 61.210.'
    });
  }

  return alerts;
}

function evaluateHub7BiodiversidadGlaciaresAireVolcanesInvariants(bundleOrSnapshot, options = {}) {
  const alerts = [];
  if (!bundleOrSnapshot || typeof bundleOrSnapshot !== 'object') return alerts;
  const snapshot = (!bundleOrSnapshot.indicators && Array.isArray(bundleOrSnapshot.comunas))
    ? extractSnapshotFromBundle(bundleOrSnapshot, 'direct', options)
    : bundleOrSnapshot;
  const comunas = Array.isArray(snapshot.comunas) ? snapshot.comunas : [];
  const indicators = snapshot.indicators || {};
  const h5 = snapshot.hub5EconomyAudit || {};
  const h7 = snapshot.hub7BiodivAudit || {};
  if (comunas.length < 10 || !indicators.superficie_glaciar_km2) return alerts;

  const getRaw = (key, ine) => {
    const map = indicators[key] && indicators[key].values;
    if (!map || !(ine in map)) return undefined;
    return map[ine];
  };
  const sumInd = (key) => comunas.reduce((a, c) => a + (Number(indicators[key]?.values?.[c.comuna_ine]) || 0), 0);

  // (a) Bosque nativo CONAF 2026 = 5.152.384,3 ha y 4 tipos forestales oficiales incl. Coihue de Magallanes (882.420 ha)
  const sumBosque = comunas.reduce((a, c) => {
    const v = indicators.bosque_nativo_ha?.values?.[c.comuna_ine] ?? h5.bosqueNativoByIne?.[c.comuna_ine] ?? 0;
    return a + (Number(v) || 0);
  }, 0);
  const labels27 = Array.isArray(h7.nodo27Labels) ? h7.nodo27Labels.map(s => String(s || '')) : [];
  const data27 = Array.isArray(h7.nodo27Data) ? h7.nodo27Data.map(Number) : [];
  const joined27 = labels27.join(' | ');
  const hasAll4Types = /siempreverde/i.test(joined27) && /lenga/i.test(joined27) && /coihue\s+de\s+magallanes/i.test(joined27) && /cipr[eé]s/i.test(joined27);
  const forest4Sum = data27.length >= 4 ? data27.slice(0, 4).reduce((a, b) => a + (Number(b) || 0), 0) : 0;
  const hasCoihue882 = data27.some(v => Math.abs(v - 882420) < 0.5);
  if (
    Math.abs(sumBosque - 5152384.3) > 0.5 ||
    (labels27.length > 0 && (!hasAll4Types || Math.abs(forest4Sum - 5152384.3) > 0.5 || !hasCoihue882))
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_CONAF_2026_TIPOS_FORESTALES',
      invariant: 'INVARIANTE_CONAF_2026_4_TIPOS_FORESTALES',
      indicator: 'bosque_nativo_ha',
      hub: CANONICAL_HUB_TITLES.biodiversidad,
      detail: `[ERROR_CONAF_2026_TIPOS_FORESTALES] Bosque nativo=${sumBosque.toFixed(1)} ha (esp. 5152384.3), 4tipos=${forest4Sum.toFixed(1)}, hasAll4=${hasAll4Types}, coihue882=${hasCoihue882}.`
    });
  }

  // (b) Criosfera IPG 2022 DGA: 8.721,6 km2 y 10.301 glaciares
  const sumGlacKm2 = sumInd('superficie_glaciar_km2');
  const sumGlacKm2Alias = indicators.superficie_glaciares_km2
    ? sumInd('superficie_glaciares_km2')
    : comunas.reduce((a, c) => a + (Number(h7.superficieGlaciaresAliasByIne?.[c.comuna_ine] ?? indicators.superficie_glaciar_km2?.values?.[c.comuna_ine]) || 0), 0);
  const sumGlacN = sumInd('glaciares_dga_n');
  if (
    Math.abs(sumGlacKm2 - 8721.6) > 0.2 ||
    Math.abs(sumGlacKm2Alias - 8721.6) > 0.2 ||
    sumGlacN !== 10301
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_CRIOSFERA_IPG_2022_GLACIARES',
      invariant: 'INVARIANTE_CRIOSFERA_IPG_2022_8721_6',
      indicator: 'superficie_glaciar_km2',
      hub: CANONICAL_HUB_TITLES.biodiversidad,
      detail: `[ERROR_CRIOSFERA_IPG_2022_GLACIARES] Glaciares IPG 2022 inconsistentes: km2=${sumGlacKm2.toFixed(1)} / alias=${sumGlacKm2Alias.toFixed(1)} (esp. 8721.6), n=${sumGlacN} (esp. 10301).`
    });
  }

  // (c) EEI: Castor 0 comunas establecidas, Jabali con Rio Ibanez / Cerro Castillo, Didymo 6 cuencas BNA (110,111,113,114,115,117)
  const data29 = Array.isArray(h7.nodo29Data) ? h7.nodo29Data.map(Number) : [];
  const castorChartVal = data29.length >= 6 ? data29[5] : 0;
  const jabaliTxt = String(h7.jabaliText || '');
  const didymoTxt = String(h7.didymoText || '');
  const hasJabaliIbanez = /ib[aá][nñ]ez|cerro\s+castillo/i.test(jabaliTxt);
  const hasDidymo6Cuencas = ['110', '111', '113', '114', '115', '117'].every(b => new RegExp(`\\b${b}\\b`).test(didymoTxt));
  if (
    Number(h7.eeiPorComunaCastorN || 0) !== 0 ||
    castorChartVal !== 0 ||
    (jabaliTxt && !hasJabaliIbanez) ||
    (didymoTxt && !hasDidymo6Cuencas)
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_EEI_CASTOR_JABALI_DIDYMO',
      invariant: 'INVARIANTE_EEI_SAT_CASTOR_Y_6_CUENCAS_DIDYMO',
      indicator: 'especies_exoticas_invasoras_n',
      hub: CANONICAL_HUB_TITLES.biodiversidad,
      detail: `[ERROR_EEI_CASTOR_JABALI_DIDYMO] Castor comunas=${h7.eeiPorComunaCastorN} / chart=${castorChartVal} (esp. 0), hasJabaliIbanez=${hasJabaliIbanez}, hasDidymo6Cuencas=${hasDidymo6Cuencas}.`
    });
  }

  // (d) SINCA EMRP exclusivamente en Coyhaique (97 GEC 2026 / 87 2024) y Puerto Aysen (16 dias base 2022)
  const emrpCoy = Number(getRaw('estaciones_sinca_emrp_n', '11101'));
  const emrpAys = Number(getRaw('estaciones_sinca_emrp_n', '11201'));
  const gecCoy = Number(getRaw('episodios_gec_mp25_anual', '11101'));
  const rawGec24 = getRaw('episodios_gec_mp25_2024', '11101');
  const gecCoy24 = Number(rawGec24 !== undefined ? rawGec24 : (h7.episodiosGec2024ByIne?.['11101'] ?? NaN));
  const diasCoy = Number(getRaw('dias_sobre_norma_mp25', '11101'));
  const diasAys = Number(getRaw('dias_sobre_norma_mp25', '11201'));
  const badNonEmrp = [];
  for (const c of comunas) {
    const ine = String(c.comuna_ine);
    if (ine === '11101' || ine === '11201') continue;
    const estN = getRaw('estaciones_sinca_emrp_n', ine);
    const dVal = getRaw('dias_sobre_norma_mp25', ine);
    const gVal = getRaw('episodios_gec_mp25_anual', ine);
    if (Number(estN) !== 0 || (dVal !== null && dVal !== undefined) || (gVal !== null && gVal !== undefined)) {
      badNonEmrp.push(`${ine}(est=${estN},dias=${dVal},gec=${gVal})`);
    }
  }
  if (
    emrpCoy !== 2 || emrpAys !== 1 ||
    gecCoy !== 97 || gecCoy24 !== 87 || diasCoy !== 87 || diasAys !== 16 ||
    badNonEmrp.length > 0
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_SINCA_EMRP_COBERTURA_Y_GEC',
      invariant: 'INVARIANTE_SINCA_EMRP_SOLO_COYHAIQUE_Y_AYSEN',
      indicator: 'episodios_gec_mp25_anual',
      hub: CANONICAL_HUB_TITLES.biodiversidad,
      detail: `[ERROR_SINCA_EMRP_COBERTURA_Y_GEC] Coy(est=${emrpCoy},gec26=${gecCoy},gec24=${gecCoy24},dias=${diasCoy}), Ays(est=${emrpAys},dias=${diasAys}), noEMRP=[${badNonEmrp.join(', ')}].`
    });
  }

  // (e) Hidrograma Rio Baker BNA 11530000-8 (Feb 675, Ago 395, sin futuro) y 8 conectores (incl. dga_hidrologia)
  const bData = Array.isArray(h7.nodo30BakerData) ? h7.nodo30BakerData.map(Number) : [];
  let nodo30Ok = true;
  if (bData.length === 12) {
    const maxB = Math.max(...bData);
    const minB = Math.min(...bData);
    nodo30Ok = bData[1] === 675 && maxB === 675 && bData[7] === 395 && minB === 395;
  }
  const bEst = h7.bakerEstacion || {};
  const estOk = !bEst.found || (
    bEst.maxVal === 675 &&
    String(bEst.maxMes || '').endsWith('-02') &&
    bEst.minVal === 395 &&
    String(bEst.minMes || '').endsWith('-08') &&
    !bEst.hasFutureDates
  );
  const mData = Array.isArray(h7.mapaBakerChartData) ? h7.mapaBakerChartData.map(Number) : [];
  const mapaOk = mData.length === 0 || (mData.length === 12 && mData[1] === 675 && mData[7] === 395);
  const connOk = Number(h7.activeApiConnectors || 0) === 8 && Boolean(h7.hasDgaHidrologiaConnector);
  if (!nodo30Ok || !estOk || !mapaOk || Boolean(h7.nodo30TableHas202612) || !connOk) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_HIDROLOGIA_BAKER_Y_CONECTOR_DGA',
      invariant: 'INVARIANTE_BAKER_NIVO_GLACIAL_Y_8_CONECTORES',
      indicator: 'hidrologia_caudales_dga',
      hub: CANONICAL_HUB_TITLES.biodiversidad,
      detail: `[ERROR_HIDROLOGIA_BAKER_Y_CONECTOR_DGA] nodo30Ok=${nodo30Ok}, estOk=${estOk}, mapaOk=${mapaOk}, tableFuture=${Boolean(h7.nodo30TableHas202612)}, conns=${h7.activeApiConnectors}, hasDga=${Boolean(h7.hasDgaHidrologiaConnector)}.`
    });
  }

  // (f) Volcanes RNVV (5 en Aysen, Hudson #12 Cat I, sin Arenales en 11201) y wiki/nodos/nodo_36.md con 2.924 SIES
  const vInfo = h7.volcanesRnvv || {};
  const n31Txt = String(vInfo.nodo31Text || '');
  const n36Txt = String(h7.nodo36WikiText || '');
  const n31Has12 = /#12|puesto\s+12/i.test(n31Txt);
  const n36Ok = !n36Txt || (n36Txt.includes('2.924') && !n36Txt.includes('2.327'));
  if (
    Number(vInfo.count || 0) !== 5 ||
    Number(vInfo.hudsonRanking || 0) !== 12 ||
    Boolean(vInfo.arenalesInAysen) ||
    (n31Txt && !n31Has12) ||
    !n36Ok
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_VOLCANISMO_RNVV_Y_WIKI_SIES',
      invariant: 'INVARIANTE_VOLCANES_RNVV_5_Y_NODO36_SIES',
      indicator: 'amenaza_volcanica_sismica_idx',
      hub: CANONICAL_HUB_TITLES.biodiversidad,
      detail: `[ERROR_VOLCANISMO_RNVV_Y_WIKI_SIES] rnvvCount=${vInfo.count}, hudson=${vInfo.hudsonRanking}, arenales=${Boolean(vInfo.arenalesInAysen)}, n31Has12=${n31Has12}, n36Ok=${n36Ok}.`
    });
  }

  return alerts;
}

function evaluateHub8SaludSsaDeisSigteSamuInvariants(bundleOrSnapshot, options = {}) {
  const alerts = [];
  if (!bundleOrSnapshot || typeof bundleOrSnapshot !== 'object') return alerts;
  const snapshot = (!bundleOrSnapshot.indicators && Array.isArray(bundleOrSnapshot.comunas))
    ? extractSnapshotFromBundle(bundleOrSnapshot, 'direct', options)
    : bundleOrSnapshot;
  const comunas = Array.isArray(snapshot.comunas) ? snapshot.comunas : [];
  const indicators = snapshot.indicators || {};
  const h8 = snapshot.hub8SaludAudit || {};
  if (comunas.length < 10 || !indicators.camas_hospitalarias) return alerts;

  const getNum = (key, ine) => Number(indicators[key]?.values?.[ine] ?? 0);
  const sumInd = (key) => comunas.reduce((a, c) => a + (Number(indicators[key]?.values?.[c.comuna_ine]) || 0), 0);
  const meanInd = (key) => sumInd(key) / comunas.length;

  // (a) Red hospitalaria SSA: 213 camas (135/56/8/7/7), 8 pabellones (4 HRC) y Hospital Dr. Leopoldo Ortega Rodriguez (sin San Jose)
  const expCamas = { '11101': 135, '11102': 0, '11201': 56, '11202': 8, '11203': 0, '11401': 7, '11402': 0, '11301': 7, '11302': 0, '11303': 0 };
  const sumCamas = sumInd('camas_hospitalarias');
  const camasMismatch = Object.entries(expCamas).some(([ine, v]) => getNum('camas_hospitalarias', ine) !== v);
  const hospName = String(h8.chileChicoHospitalName || '');
  const hasSanJose = /san\s+jos[eé]/i.test(hospName);
  const hasLeopoldo = /leopoldo\s+ortega/i.test(hospName);
  if (
    sumCamas !== 213 ||
    camasMismatch ||
    Number(h8.hrcQuirofanosTotales || 0) !== 4 ||
    Number(h8.totalPabellonesQuirurgicos || 0) !== 8 ||
    hasSanJose ||
    (hospName && !hasLeopoldo)
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_RED_HOSPITALARIA_SSA_CAMAS_QUIROFANOS',
      invariant: 'INVARIANTE_RED_SSA_213_CAMAS_8_PABELLONES',
      indicator: 'camas_hospitalarias',
      hub: CANONICAL_HUB_TITLES.salud,
      detail: `[ERROR_RED_HOSPITALARIA_SSA_CAMAS_QUIROFANOS] sumCamas=${sumCamas} (esp. 213), HRC pab=${h8.hrcQuirofanosTotales}, totalPab=${h8.totalPabellonesQuirurgicos}, chileChico="${hospName}".`
    });
  }

  // (b) Catastro APS DEIS: 27 PSR exactas, 4 CESFAM, 4 CECOSF, 9 EMR, 2 COSAM
  const expPsr = { '11101': 7, '11102': 3, '11201': 2, '11202': 4, '11203': 1, '11301': 0, '11302': 1, '11303': 1, '11401': 3, '11402': 5 };
  const sumPsr = sumInd('postas_salud_rural');
  const sumPsrAlias = indicators.postas_rurales_psr_n ? sumInd('postas_rurales_psr_n') : sumPsr;
  const psrMismatch = Object.entries(expPsr).some(([ine, v]) =>
    getNum('postas_salud_rural', ine) !== v || (indicators.postas_rurales_psr_n && getNum('postas_rurales_psr_n', ine) !== v)
  );
  const apsRes = h8.apsResumen || {};
  if (
    sumPsr !== 27 ||
    sumPsrAlias !== 27 ||
    psrMismatch ||
    Number(apsRes.total_cesfam || 0) !== 4 ||
    Number(apsRes.total_cecosf || 0) !== 4 ||
    Number(apsRes.total_emr_ssa || 0) !== 9 ||
    Number(apsRes.total_cosam || 0) !== 2
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_CATASTRO_APS_DEIS_PSR_CESFAM_CECOSF_EMR',
      invariant: 'INVARIANTE_APS_DEIS_4_4_27_9_2',
      indicator: 'postas_salud_rural',
      hub: CANONICAL_HUB_TITLES.salud,
      detail: `[ERROR_CATASTRO_APS_DEIS_PSR_CESFAM_CECOSF_EMR] psr=${sumPsr}/${sumPsrAlias}, cesfam=${apsRes.total_cesfam}, cecosf=${apsRes.total_cecosf}, emr=${apsRes.total_emr_ssa}, cosam=${apsRes.total_cosam}.`
    });
  }

  // (c) Listas de espera SIGTE Glosa 06 T3 2026: 14751 CNE (159d), 3608 IQ (262d), 6870 Odonto, 524 GES
  const sumEspera = sumInd('espera_no_ges_n');
  const meanCne = meanInd('mediana_espera_especialidad_dias');
  const meanIq = meanInd('mediana_espera_quirurgica_dias');
  const sig = h8.sigteRegional || {};
  const nodo39CneOk = h8.nodo39Ds0Sum === null || h8.nodo39Ds0Sum === undefined || Number(h8.nodo39Ds0Sum) === 14751;
  if (
    sumEspera !== 14751 ||
    Math.abs(meanCne - 159) > 0.2 ||
    Math.abs(meanIq - 262) > 0.2 ||
    Number(sig.iq_no_ges_ssa_t3_2026 || 0) !== 3608 ||
    Number(sig.odontologia_no_ges_ssa_dic2024 || 0) !== 6870 ||
    Number(sig.retrasos_ges_ssa_t3_2026 || 0) !== 524 ||
    !nodo39CneOk
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_LISTAS_ESPERA_SIGTE_T3_2026',
      invariant: 'INVARIANTE_SIGTE_T3_2026_14751_3608_6870_524',
      indicator: 'espera_no_ges_n',
      hub: CANONICAL_HUB_TITLES.salud,
      detail: `[ERROR_LISTAS_ESPERA_SIGTE_T3_2026] espera=${sumEspera}, meanCne=${meanCne.toFixed(1)}, meanIq=${meanIq.toFixed(1)}, iq=${sig.iq_no_ges_ssa_t3_2026}, odonto=${sig.odontologia_no_ges_ssa_dic2024}, ges=${sig.retrasos_ges_ssa_t3_2026}.`
    });
  }

  // (d) Aeroevacuaciones SAMU: 454 primarias + 45 secundarias en Coyhaique, reconciliado wp05 == minsal_det
  const sumAero = sumInd('aeroevacuaciones_samu_n');
  const secCoy = indicators.aeroevacuaciones_secundarias_interregionales_n
    ? getNum('aeroevacuaciones_secundarias_interregionales_n', '11101')
    : 45;
  const nodo39AeroOk = h8.nodo39Ds1Sum === null || h8.nodo39Ds1Sum === undefined || Number(h8.nodo39Ds1Sum) === 454;
  if (
    sumAero !== 454 ||
    secCoy !== 45 ||
    Number(h8.wp05AeroSum || 0) !== 454 ||
    Number(h8.minsalDetAeroSum || 0) !== 454 ||
    !nodo39AeroOk
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_AEROEVACUACIONES_SAMU_RECONCILIACION',
      invariant: 'INVARIANTE_SAMU_454_PRIMARIAS_45_SECUNDARIAS',
      indicator: 'aeroevacuaciones_samu_n',
      hub: CANONICAL_HUB_TITLES.salud,
      detail: `[ERROR_AEROEVACUACIONES_SAMU_RECONCILIACION] sumAero=${sumAero}, secCoy=${secCoy}, wp05=${h8.wp05AeroSum}, minsalDet=${h8.minsalDetAeroSum}.`
    });
  }

  // (e) Epidemiologia DEIS (Suicidio 19.9, Vesicula 18.29), RNPI 5.54 / SSA 1.80 y ausencia B3_B en salud.espejo_barometro
  const meanSuic = meanInd('tasa_mortalidad_suicidio_100k');
  const meanVesic = meanInd('tasa_mortalidad_cancer_vesicula_100k');
  const dot = h8.dotacionMedica || {};
  if (
    Math.abs(meanSuic - 19.9) > 0.1 ||
    Math.abs(meanVesic - 18.29) > 0.1 ||
    Math.abs(Number(dot.medicos_rnpi_por_mil_hab || 0) - 5.54) > 0.05 ||
    Math.abs(Number(dot.medicos_red_publica_ssa_por_mil_hab || 0) - 1.80) > 0.05 ||
    Boolean(h8.saludBarometroHasB3B)
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_EPIDEMIOLOGIA_DEIS_DOTACION_Y_BAROMETRO',
      invariant: 'INVARIANTE_DEIS_19_9_RNPI_5_54_SIN_B3_B',
      indicator: 'tasa_mortalidad_suicidio_100k',
      hub: CANONICAL_HUB_TITLES.salud,
      detail: `[ERROR_EPIDEMIOLOGIA_DEIS_DOTACION_Y_BAROMETRO] suic=${meanSuic.toFixed(2)}, vesic=${meanVesic.toFixed(2)}, rnpi=${dot.medicos_rnpi_por_mil_hab}, ssa=${dot.medicos_red_publica_ssa_por_mil_hab}, hasB3B=${Boolean(h8.saludBarometroHasB3B)}.`
    });
  }

  // (f) Cierre Sprint 10: 0 registros 2026-12 en las 16 estaciones de data/estaciones_aysen.json
  if (Boolean(h8.estacionesHasFuture202612) || (Number(h8.estacionesCount || 0) > 0 && Number(h8.estacionesCount) !== 16)) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_ESTACIONES_AYSEN_FECHA_FUTURA_2026_12',
      invariant: 'INVARIANTE_ESTACIONES_16_SIN_2026_12',
      indicator: 'estaciones_aysen',
      hub: CANONICAL_HUB_TITLES.biodiversidad,
      detail: `[ERROR_ESTACIONES_AYSEN_FECHA_FUTURA_2026_12] count=${h8.estacionesCount}, has202612=${Boolean(h8.estacionesHasFuture202612)}.`
    });
  }

  return alerts;
}


function evaluateHub9CulturaPatrimonioConadiBarometroInvariants(bundleOrSnapshot, options = {}) {
  const alerts = [];
  if (!bundleOrSnapshot || typeof bundleOrSnapshot !== 'object') return alerts;
  const snapshot = (!bundleOrSnapshot.indicators && Array.isArray(bundleOrSnapshot.comunas))
    ? extractSnapshotFromBundle(bundleOrSnapshot, 'direct', options)
    : bundleOrSnapshot;
  const comunas = Array.isArray(snapshot.comunas) ? snapshot.comunas : [];
  const indicators = snapshot.indicators || {};
  const h9 = snapshot.hub9CulturaAudit || {};
  if (comunas.length < 10 || !indicators.monumentos_nacionales_count) return alerts;

  const getNum = (key, ine) => Number(indicators[key]?.values?.[ine] ?? NaN);
  const sumInd = (key) => comunas.reduce((a, c) => a + (Number(indicators[key]?.values?.[c.comuna_ine]) || 0), 0);

  // 1. Catastro CMN Monumentos Nacionales: 16 declaratorias / 23 bienes, Chile Chico = 0, Capilla de Marmol -> Rio Ibanez (11402), Lago Verde=1, Cisnes=1, Cochrane=1
  const expCmn = { '11101': 2, '11102': 1, '11201': 5, '11202': 1, '11203': 0, '11401': 0, '11402': 4, '11301': 1, '11302': 0, '11303': 2 };
  const sumCmn = sumInd('monumentos_nacionales_count');
  const cmnMismatch = Object.entries(expCmn).some(([ine, v]) => getNum('monumentos_nacionales_count', ine) !== v);
  if (
    sumCmn !== 16 ||
    cmnMismatch ||
    Number(h9.cmnBienesTotal || 0) !== 23 ||
    getNum('monumentos_nacionales_count', '11401') !== 0 ||
    String(h9.capillaMarmolComunaIne || '') !== '11402' ||
    getNum('monumentos_nacionales_count', '11102') !== 1 ||
    getNum('monumentos_nacionales_count', '11202') !== 1 ||
    getNum('monumentos_nacionales_count', '11301') !== 1
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_CATASTRO_CMN_MONUMENTOS_NACIONALES',
      invariant: 'INVARIANTE_CMN_16_DECLARATORIAS_23_BIENES',
      indicator: 'monumentos_nacionales_count',
      hub: CANONICAL_HUB_TITLES.cultura,
      detail: `[ERROR_CATASTRO_CMN_MONUMENTOS_NACIONALES] sumCMN=${sumCmn} (esp. 16), bienes=${h9.cmnBienesTotal} (23), ChileChico=${getNum('monumentos_nacionales_count', '11401')} (0), CapillaMarmol=${h9.capillaMarmolComunaIne} (11402).`
    });
  }

  // 2. Catastro RMC Museos (16 activos / 27 red), MRA 36173 visitas, SNBP (16 fijas) y 54 espacios totales
  const expMus = { '11101': 8, '11102': 0, '11201': 1, '11202': 0, '11203': 0, '11401': 2, '11402': 2, '11301': 2, '11302': 1, '11303': 0 };
  const expBib = { '11101': 2, '11102': 1, '11201': 3, '11202': 3, '11203': 1, '11401': 2, '11402': 1, '11301': 1, '11302': 1, '11303': 1 };
  const expTot = { '11101': 14, '11102': 3, '11201': 10, '11202': 5, '11203': 1, '11401': 4, '11402': 7, '11301': 5, '11302': 2, '11303': 3 };
  const sumMus = sumInd('museos_count');
  const sumBib = sumInd('bibliotecas_snbp_n');
  const sumTot = sumInd('total_espacios_culturales');
  const musMismatch = Object.entries(expMus).some(([ine, v]) => getNum('museos_count', ine) !== v);
  const bibMismatch = Object.entries(expBib).some(([ine, v]) => {
    const aliasBib = indicators.bibliotecas_publicas_count
      ? getNum('bibliotecas_publicas_count', ine)
      : Number(h9.bibliotecasPublicasByIne?.[ine] ?? v);
    return getNum('bibliotecas_snbp_n', ine) !== v || aliasBib !== v;
  });
  const totMismatch = Object.entries(expTot).some(([ine, v]) => getNum('total_espacios_culturales', ine) !== v);
  if (
    sumMus !== 16 ||
    sumBib !== 16 ||
    sumTot !== 54 ||
    musMismatch ||
    bibMismatch ||
    totMismatch ||
    Number(h9.mraVisitas2025 || 0) !== 36173 ||
    Number(h9.museosRedRegionalTotal || 0) !== 27
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_CATASTRO_RMC_MUSEOS_Y_SNBP_BIBLIOTECAS',
      invariant: 'INVARIANTE_RMC_16_SNBP_16_ESPACIOS_54',
      indicator: 'museos_count',
      hub: CANONICAL_HUB_TITLES.cultura,
      detail: `[ERROR_CATASTRO_RMC_MUSEOS_Y_SNBP_BIBLIOTECAS] museos=${sumMus} (16), red=${h9.museosRedRegionalTotal} (27), bib=${sumBib} (16), tot=${sumTot} (54), MRA=${h9.mraVisitas2025} (36173).`
    });
  }

  // 3. Gasto Cultural Per Capita Censo 2024 exacto
  const expGastoPc = { '11101': 11850, '11102': 43537, '11201': 9305, '11202': 15445, '11203': 25782, '11401': 15111, '11402': 19693, '11301': 17869, '11302': 32831, '11303': 32860 };
  const gastoMismatch = comunas.some(c => {
    const ine = String(c.comuna_ine);
    const val = getNum('gasto_cultura_per_capita_clp', ine);
    const gm = getNum('gasto_municipal_cultura_mclp', ine);
    const pop = Number(indicators.poblacion_censo_2024?.values?.[ine] ?? snapshot.comunaPoblacion?.[ine] ?? 0);
    const calc = pop > 0 ? Math.round((gm * 1000000) / pop) : -1;
    return val !== expGastoPc[ine] || (calc > 0 && val !== calc);
  });
  if (gastoMismatch) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_GASTO_CULTURAL_PER_CAPITA_CENSO_2024',
      invariant: 'INVARIANTE_GASTO_CULTURAL_PC_CENSO_2024',
      indicator: 'gasto_cultura_per_capita_clp',
      hub: CANONICAL_HUB_TITLES.cultura,
      detail: `[ERROR_GASTO_CULTURAL_PER_CAPITA_CENSO_2024] Gasto cultural per capita desalineado respecto a Censo 2024 (LV=${getNum('gasto_cultura_per_capita_clp', '11102')} esp. 43537, Tortel=${getNum('gasto_cultura_per_capita_clp', '11303')} esp. 32860).`
    });
  }

  // 4. Demografia Indigena Censo 2024 (29.0% = 29230 hab.), CONADI SIIC (47 / 490 familias) y 25 PCC
  const expOrigPct = { '11101': 25.7, '11102': 28.2, '11201': 34.7, '11202': 34.9, '11203': 57.9, '11401': 26.0, '11402': 32.4, '11301': 24.5, '11302': 28.4, '11303': 40.2 };
  const expPcc = { '11101': 6, '11102': 0, '11201': 1, '11202': 3, '11203': 0, '11401': 3, '11402': 4, '11301': 4, '11302': 3, '11303': 1 };
  const origMismatch = Object.entries(expOrigPct).some(([ine, v]) => {
    const pCenso = getNum('pueblos_originarios_pct_censo_2024', ine);
    const pAuto = indicators.autoidentificacion_indigena_pct
      ? getNum('autoidentificacion_indigena_pct', ine)
      : Number(h9.autoidentificacionIndigenaByIne?.[ine] ?? v);
    return Math.abs(pCenso - v) > 0.05 || Math.abs(pAuto - v) > 0.05 || Math.abs(pCenso - pAuto) > 0.05;
  });
  const sumPcc = sumInd('puntos_cultura_comunitaria_pcc_n');
  const pccMismatch = Object.entries(expPcc).some(([ine, v]) => getNum('puntos_cultura_comunitaria_pcc_n', ine) !== v);
  const poRes = h9.pueblosOriginariosResumen || {};
  if (
    origMismatch ||
    sumPcc !== 25 ||
    pccMismatch ||
    Number(poRes.total_comunidades_conadi_registradas || 0) !== 47 ||
    Number(poRes.familias_comunidades_conadi_siic || 0) !== 490 ||
    Number(poRes.poblacion_indigena_censo_2024 || 0) !== 29230 ||
    Math.abs(Number(poRes.autoidentificacion_regional_pct || 0) - 29.0) > 0.05
  ) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_DEMOGRAFIA_INDIGENA_CENSO_2024_Y_CONADI_PCC',
      invariant: 'INVARIANTE_INDIGENA_29_0_CONADI_47_PCC_25',
      indicator: 'pueblos_originarios_pct_censo_2024',
      hub: CANONICAL_HUB_TITLES.cultura,
      detail: `[ERROR_DEMOGRAFIA_INDIGENA_CENSO_2024_Y_CONADI_PCC] origMismatch=${origMismatch}, sumPcc=${sumPcc} (25), conadiSIIC=${poRes.total_comunidades_conadi_registradas} (47), fam=${poRes.familias_comunidades_conadi_siic} (490), pobInd=${poRes.poblacion_indigena_censo_2024} (29230).`
    });
  }

  // 5. Wiki Hub IX limpia (sin "18 espacios museograficos..." ni "19%" en Tortel) y semaforo muestral Barometro en las 10 comunas
  const sems = h9.semaforoMuestralByIne || {};
  const ruralInes = ['11102', '11202', '11203', '11401', '11402', '11301', '11302', '11303'];
  const semInvalid =
    sems['11101'] !== 'verde' ||
    sems['11201'] !== 'verde' ||
    ruralInes.some(ine => sems[ine] !== 'rojo_baja_precision_n_menor_30');
  if (Boolean(h9.wikiHasObsolete18Rmc) || Boolean(h9.wikiNodo34HasObsoleteTortel19) || semInvalid) {
    alerts.push({
      severity: 'ALTA',
      code: 'ERROR_WIKI_HUB09_Y_BAROMETRO_SEMAFORO',
      invariant: 'INVARIANTE_WIKI_HUB09_Y_SEMAFORO_BAROMETRO',
      indicator: 'nota_percepcion_cultura_b4b',
      hub: CANONICAL_HUB_TITLES.cultura,
      detail: `[ERROR_WIKI_HUB09_Y_BAROMETRO_SEMAFORO] obsolete18Rmc=${Boolean(h9.wikiHasObsolete18Rmc)}, tortel19=${Boolean(h9.wikiNodo34HasObsoleteTortel19)}, semInvalid=${semInvalid}.`
    });
  }

  return alerts;
}

function compareSnapshots(baseline, current, options = {}) {
  const outlierPctThreshold = Number.isFinite(options.outlierPctThreshold) ? options.outlierPctThreshold : 20;
  const structuralOutlierPct = Number.isFinite(options.structuralOutlierPct) ? options.structuralOutlierPct : 5;
  const thresholdOpts = { outlierPctThreshold, structuralOutlierPct };
  const catalog = options.catalog || buildMetadataCatalog();
  const autoUpdateStatus = options.autoUpdateStatus !== undefined
    ? options.autoUpdateStatus
    : readJsonSafe(AUTO_UPDATE_STATUS_PATH, null);
  const marcoRegulatorio = options.marcoRegulatorio !== undefined
    ? options.marcoRegulatorio
    : readJsonSafe(MARCO_REGULATORIO_PATH, null);
  const regRules = (marcoRegulatorio && marcoRegulatorio.reglas_auditoria_indicadores) || {};

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
        const regRule = regRules[key] || null;
        const regSuffix = regRule ? ` · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] ${regRule.cita_normativa}` : '';
        verificationAlerts.push({
          severity: 'ALTA',
          code: 'OUTLIER_SALTO',
          regulatoryTag: regRule ? 'CAMBIO_REGULATORIO_DOCUMENTADO' : null,
          regulatoryCitation: regRule ? regRule.cita_normativa : null,
          indicator: key,
          hub: meta.hubTitle,
          detail: detailStr + regSuffix
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

  // Invariantes físicos, demográficos, fiscales Hub IV, económicos Hub V, sociales Hub VI, Hub VII y anti-colinealidad (Audit V3 / E17-E20)
  const invariantAlerts = [
    ...evaluatePhysicalAndDemographicInvariants(current, options),
    ...evaluateHub4FiscalAndElectoralInvariants(current, options),
    ...evaluateHub5EconomyInvestmentLandInvariants(current, options),
    ...evaluateHub6SocialDemographyEducationHousingInvariants(current, options),
    ...evaluateHub7BiodiversidadGlaciaresAireVolcanesInvariants(current, options),
    ...evaluateHub8SaludSsaDeisSigteSamuInvariants(current, options),
    ...evaluateHub9CulturaPatrimonioConadiBarometroInvariants(current, options)
  ];
  for (const invAlert of invariantAlerts) {
    verificationAlerts.push(invAlert);
  }

  const highAlerts = verificationAlerts.filter(a => a.severity === 'ALTA');
  const medAlerts = verificationAlerts.filter(a => a.severity === 'MEDIA');
  const regDocumentedCount = verificationAlerts.filter(a => a.regulatoryTag === 'CAMBIO_REGULATORIO_DOCUMENTADO').length;
  const hasRemovedScope = additionalScopes.summary.some(s => s.removed > 0);
  let semaforo = 'VERDE';
  if (removed.length > 0 || hasRemovedScope || connectorSummary.stagesRestored > 0 || invariantAlerts.length > 0) {
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
      invariantViolations: invariantAlerts.length,
      regulatoryDocumented: regDocumentedCount,
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
    else if (a === '--update-baseline' || a === '--write-baseline') args.updateBaseline = true;
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
  evaluatePhysicalAndDemographicInvariants,
  evaluateHub4FiscalAndElectoralInvariants,
  evaluateHub5EconomyInvestmentLandInvariants,
  evaluateHub6SocialDemographyEducationHousingInvariants,
  evaluateHub7BiodiversidadGlaciaresAireVolcanesInvariants,
  evaluateHub8SaludSsaDeisSigteSamuInvariants,
  hub8_salud_ssa_deis_sigte_samu_consistency: evaluateHub8SaludSsaDeisSigteSamuInvariants,
  evaluateHub9CulturaPatrimonioConadiBarometroInvariants,
  hub9_cultura_patrimonio_conadi_barometro_consistency: evaluateHub9CulturaPatrimonioConadiBarometroInvariants,
  compareSnapshots,
  renderRunNote,
  renderIndicatorBackupNote,
  writeAuditArtifacts,
  approveLatestRun,
  syncAuditToVault
};
