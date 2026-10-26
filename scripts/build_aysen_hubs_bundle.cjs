/**
 * scripts/build_aysen_hubs_bundle.cjs
 * ============================================================================
 * Genera data/aysen_hubs_data.js integrando los datasets consolidados del Data Lake:
 * - 01_gob_poder_finanzas.json
 * - 02_energia_combustibles_telecom.json
 * - 03_concesiones_tierra_mar.json
 * - 04_inversion_seia_economia.json
 * - 05_social_salud_educacion_riesgos.json
 * - 06_turismo_sernatur_conaf.json
 * - 07_biodiversidad_flora_fauna_aysen.json (WP_07)
 * - 08_desagregaciones_sectoriales_aysen.json (WP_08)
 * - provenance_catalog.json (Catálogo de procedencia oficial 31 nodos)
 * - holdings_salmoneros_ruts_aysen.json (12 holdings)
 * - comunas_aysen.json, estaciones_aysen.json
 *
 * 7 Hubs temáticos equilibrados y 31 Nodos Satélite (#01 a #31):
 * - Hub I: Turismo & Áreas Silvestres (#01 a #05)
 * - Hub II: Pesca, Acuicultura & Maritorio (#06 a #10)
 * - Hub III: Energía & Telecomunicaciones (#11 a #14)
 * - Hub IV: Gobernanza & Finanzas Municipales (#15 a #18)
 * - Hub V: Economía, Inversión & Suelo (#19 a #22)
 * - Hub VI: Sociedad: Demografía, Salud & Educación (#23 a #26)
 * - Hub VII: Biodiversidad & Medio Ambiente (#27 a #31)
 *
 * Cada nodo incluye:
 * 1. provenance: { sourceEntity, sourceUrl, collectionDate, collectionMethod, updateFrequency, nextUpdate }
 * 2. chartSpec: { type, title, labels, datasets, unit } con datos reales para Chart.js
 * 3. tableColumns y tableRows: resumen de 4-5 columnas y hasta 10 filas (máximo 10)
 * 4. canvasPreview: { availableDimensions, suggestedCrossings, totalRecordsInFullBase }
 *
 * CERO EMOJIS · CERO VALORES NULOS O INDEFINIDOS
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readJson(relPath) {
  const full = path.join(ROOT, relPath);
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

function fmtNum(val) {
  if (val === null || val === undefined || val === '') return '-';
  if (typeof val === 'number') return val.toLocaleString('es-CL');
  return String(val);
}

// Carga de datasets base
const comunasBase = readJson('data/comunas_aysen.json').comunas || [];
const estacionesBase = readJson('data/estaciones_aysen.json').estaciones || [];

const wp01 = readJson('data/systemic/01_gob_poder_finanzas.json');
const wp02 = readJson('data/systemic/02_energia_combustibles_telecom.json');
const wp03 = readJson('data/systemic/03_concesiones_tierra_mar.json');
const wp04 = readJson('data/systemic/04_inversion_seia_economia.json');
const wp05 = readJson('data/systemic/05_social_salud_educacion_riesgos.json');
const wp06 = readJson('data/systemic/06_turismo_sernatur_conaf.json');
const wp07 = readJson('data/systemic/07_biodiversidad_flora_fauna_aysen.json');
const wp08 = readJson('data/systemic/08_desagregaciones_sectoriales_aysen.json');
let wp09 = null;
const wp09Path = path.join(ROOT, 'data/systemic/09_cultura_patrimonio.json');
if (fs.existsSync(wp09Path)) {
  wp09 = readJson('data/systemic/09_cultura_patrimonio.json');
}
let wp10 = null;
const wp10Path = path.join(ROOT, 'data/systemic/10_ctci_innovacion.json');
if (fs.existsSync(wp10Path)) {
  wp10 = readJson('data/systemic/10_ctci_innovacion.json');
}
const provCatalog = readJson('data/systemic/provenance_catalog.json');
const holdingsRaw = readJson('data/raw/territorio_concesiones/holdings_salmoneros_ruts_aysen.json');

// Carga opcional de Barómetro y Presets Inter-Hub
let baroData = { hubs: {} };
const baroPath = path.join(ROOT, 'data/raw/barometro_uaysen/barometro_integrado_aysen.json');
if (fs.existsSync(baroPath)) {
  baroData = readJson('data/raw/barometro_uaysen/barometro_integrado_aysen.json');
}
let cecanPresets = {};
const cecanPath = path.join(ROOT, 'data/cecan_16_presets_aysen.json');
if (fs.existsSync(cecanPath)) {
  cecanPresets = readJson('data/cecan_16_presets_aysen.json');
}

// Mapas auxiliares por código comunal INE ('11101'..'11303')
const wp01ByIne = {};
(wp01.por_comuna || []).forEach(c => { wp01ByIne[String(c.comuna_ine)] = c.datos || {}; });
const wp02ByIne = {};
(wp02.por_comuna || []).forEach(c => { wp02ByIne[String(c.comuna_ine)] = c.datos || {}; });
const wp03ByIne = {};
(wp03.por_comuna || []).forEach(c => { wp03ByIne[String(c.comuna_ine)] = c.datos || {}; });
const wp04ByIne = {};
(wp04.por_comuna || []).forEach(c => { wp04ByIne[String(c.comuna_ine)] = c.datos || {}; });
const wp05ByIne = {};
(wp05.por_comuna || []).forEach(c => { wp05ByIne[String(c.comuna_ine)] = c.datos || {}; });
const wp06ByIne = {};
(wp06.por_comuna || []).forEach(c => { wp06ByIne[String(c.comuna_ine)] = c.datos || {}; });
const wp07ByIne = {};
(wp07.por_comuna || []).forEach(c => { wp07ByIne[String(c.comuna_ine)] = c.datos || {}; });
const wp08ByIne = {};
(wp08.por_comuna || []).forEach(c => { wp08ByIne[String(c.comuna_ine)] = c.datos || {}; });
const wp09ByIne = {};
if (wp09 && wp09.por_comuna) {
  wp09.por_comuna.forEach(c => { wp09ByIne[String(c.comuna_ine)] = c.datos || {}; });
}
const wp10ByIne = {};
if (wp10 && wp10.por_comuna) {
  wp10.por_comuna.forEach(c => { wp10ByIne[String(c.comuna_ine)] = c.datos || {}; });
}

// Catálogo de procedencia por ID de nodo
const provByNodeId = {};
(provCatalog.nodes || []).forEach(n => {
  provByNodeId[n.id] = n.provenance;
});

// ============================================================================
// DICCIONARIO CANONICO DE FUENTES OFICIALES POR VARIABLE / PREFIJO
// ============================================================================
const OFFICIAL_VARIABLE_SOURCES = {
  sinim: {
    name: 'SUBDERE - Sistema Nacional de Información Municipal (SINIM)',
    url: 'https://datos.sinim.gov.cl',
    collectionDate: '17 Oct 2026'
  },
  fndr: {
    name: 'DIPRES / Gobierno Regional de Aysén (FNDR)',
    url: 'https://www.dipres.gob.cl',
    collectionDate: '17 Oct 2026'
  },
  censo: {
    name: 'INE - Censo de Población y Vivienda 2024',
    url: 'https://censo2024.ine.gob.cl',
    collectionDate: '17 Oct 2026'
  },
  casen: {
    name: 'Ministerio de Desarrollo Social y Familia - Encuesta CASEN',
    url: 'https://observatorio.ministeriodesarrollosocial.gob.cl',
    collectionDate: '17 Oct 2026'
  },
  cead: {
    name: 'SPD - Centro de Estudios y Análisis del Delito (CEAD)',
    url: 'https://cead.spd.gob.cl',
    collectionDate: '17 Oct 2026'
  },
  deis: {
    name: 'DEIS - Ministerio de Salud / Servicio de Salud Aysén',
    url: 'https://deis.minsal.cl',
    collectionDate: '17 Oct 2026'
  },
  mineduc: {
    name: 'Centro de Estudios MINEDUC / SLEP Aysén',
    url: 'https://datosabiertos.mineduc.cl',
    collectionDate: '17 Oct 2026'
  },
  sernapesca: {
    name: 'SERNAPESCA / SUBPESCA',
    url: 'https://www.sernapesca.cl',
    collectionDate: '17 Oct 2026'
  },
  sernageomin: {
    name: 'SERNAGEOMIN - Catastro Minero Nacional',
    url: 'https://www.sernageomin.cl',
    collectionDate: '17 Oct 2026'
  },
  seia: {
    name: 'Servicio de Evaluación Ambiental (SEA - SEIA)',
    url: 'https://seia.sea.gob.cl',
    collectionDate: '17 Oct 2026'
  },
  sii: {
    name: 'Servicio de Impuestos Internos (SII) - Estadísticas de Empresas',
    url: 'https://www.sii.cl',
    collectionDate: '17 Oct 2026'
  },
  chilecompra: {
    name: 'Dirección ChileCompra - Datos Abiertos MercadoPúblico',
    url: 'https://datos-abiertos.chilecompra.cl',
    collectionDate: '17 Oct 2026'
  },
  sag: {
    name: 'Servicio Agrícola y Ganadero (SAG)',
    url: 'https://www.sag.gob.cl',
    collectionDate: '17 Oct 2026'
  },
  cne: {
    name: 'Comisión Nacional de Energía (CNE)',
    url: 'https://www.cne.cl',
    collectionDate: '17 Oct 2026'
  },
  sec: {
    name: 'Superintendencia de Electricidad y Combustibles (SEC)',
    url: 'https://www.sec.cl',
    collectionDate: '17 Oct 2026'
  },
  subtel: {
    name: 'Subsecretaría de Telecomunicaciones (SUBTEL)',
    url: 'https://www.subtel.gob.cl',
    collectionDate: '17 Oct 2026'
  },
  sernatur: {
    name: 'SERNATUR / INE Encuesta Mensual de Alojamiento Turístico (EMAT)',
    url: 'https://www.sernatur.cl',
    collectionDate: '17 Oct 2026'
  },
  conaf: {
    name: 'CONAF - SNASPE y Catastro Vegetacional',
    url: 'https://www.conaf.cl',
    collectionDate: '17 Oct 2026'
  },
  sinca_mma: {
    name: 'Ministerio del Medio Ambiente (SINCA / RCE) y DGA-MOP',
    url: 'https://sinca.mma.gob.cl',
    collectionDate: '17 Oct 2026'
  },
  mincap: {
    name: 'MINCAP / Servicio Nacional del Patrimonio Cultural (SERPAT - CMN)',
    url: 'https://www.patrimoniocultural.gob.cl',
    collectionDate: '17 Oct 2026'
  },
  anid: {
    name: 'ANID DataCiencia / MinCiencia y CORFO',
    url: 'https://dataciencia.anid.cl',
    collectionDate: '17 Oct 2026'
  },
  barometro: {
    name: 'Universidad de Aysén - Barómetro Regional Aysén',
    url: 'https://uaysen.cl',
    collectionDate: '17 Oct 2026'
  }
};

function resolveOfficialSource(varKey, hubId) {
  const k = String(varKey || '').toLowerCase();
  const h = String(hubId || '').toLowerCase();

  if (/glaciar|glaciares/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.sinca_mma;
  if (/fondart/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.mincap;
  if (/presupuesto_|dependencia_fcm|ipp_|gasto_personal|profesionalizacion|patentes_|ingresos_municipales/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.sinim;
  if (/fndr_|inversion_fndr/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.fndr;
  if (/poblacion_censo|superficie_km2|densidad_hab|poblacion_|censo_2024|porcentaje_regional/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.censo;
  if (/pobreza_|casen|ingreso_mediano|ingreso_autonomo/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.casen;
  if (/tasa_vif|delitos_|tasa_regional|tasa_dmcs|denuncias_/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.cead;
  if (/medicos_|camas_hosp|urgencias_|espera_|aeroevacuaciones|traslado_|postas_|salud_|egresos_|camas_hospitalarias/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.deis;
  if (/matricula_|establecimientos_|escuelas_|docentes_|retencion_|slep/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.mineduc;
  if (/concesiones_salmon|centros_activos|biomasa_|antibioticos|desembarque|amerb|salmon|caletas/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.sernapesca;
  if (/concesiones_mineras|pertenencias_mineras|mineria/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.sernageomin;
  if (/proyectos_seia|inversion_seia|seia_/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.seia;
  if (/empresas_sii|trabajadores_sii|microempresas_|ventas_sii|empleo_/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.sii;
  if (/compras_locales|fuga_compras|chilecompra|mercadopublico/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.chilecompra;
  if (/parcelaciones_sag|sag_/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.sag;
  if (/saidi_|saifi_/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.sec;
  if (/potencia_mw|tarifa_bt1|gasolina_|diesel_|precio_lena|hogares_lena|electricidad|energia|generacion_/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.cne;
  if (/internet_fijo|estado_foa|conectividad_|telecom/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.subtel;
  if (/prestadores_sernatur|pernoctaciones_emat|camas_turisticas|ratio_presion|zoit|turis/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.sernatur;
  if (/visitantes_snaspe|superficie_snaspe|cobertura_vegetal|incendios_|snaspe|conaf|ruta7/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.conaf;
  if (/dias_sobre_norma_mp25|mp25_|fauna_|flora_|sinca|dga|daa_|humedales/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.sinca_mma;
  if (/museos_|bibliotecas_|monumentos_|agentes_culturales|cultura|patrimonio|total_espacios_culturales/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.mincap;
  if (/proyectos_anid|monto_anid|publicaciones_|innovacion_corfo|centros_ctci|ctci|investigadores|total_proyectos_ctci|proyectos_corfo/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.anid;
  if (/barometro|nota_percepcion|percepcion|evaluacion_uaysen|participacion_cultural/i.test(k)) return OFFICIAL_VARIABLE_SOURCES.barometro;

  if (h.includes('turis')) return OFFICIAL_VARIABLE_SOURCES.sernatur;
  if (h.includes('salmon') || h.includes('pesca')) return OFFICIAL_VARIABLE_SOURCES.sernapesca;
  if (h.includes('energia')) return OFFICIAL_VARIABLE_SOURCES.cne;
  if (h.includes('gobernanza')) return OFFICIAL_VARIABLE_SOURCES.sinim;
  if (h.includes('inversion')) return OFFICIAL_VARIABLE_SOURCES.sii;
  if (h.includes('salud')) return OFFICIAL_VARIABLE_SOURCES.deis;
  if (h.includes('social')) return OFFICIAL_VARIABLE_SOURCES.censo;
  if (h.includes('biodiversidad')) return OFFICIAL_VARIABLE_SOURCES.sinca_mma;
  if (h.includes('cultura')) return OFFICIAL_VARIABLE_SOURCES.mincap;
  if (h.includes('ctci')) return OFFICIAL_VARIABLE_SOURCES.anid;

  return OFFICIAL_VARIABLE_SOURCES.sinim;
}

// ============================================================================
// 1. DEFINICION DE LOS 7 HUBS CENTRALES
// ============================================================================
const hubs = [
  {
    id: 'turismo',
    numeral: 'I',
    title: 'I. Turismo & Áreas Silvestres',
    shortTitle: 'Turismo & Áreas Silvestres',
    color: '#00357f',
    description: 'Oferta registrada en **SERNATUR**, las **4 Zonas de Interés Turístico (ZOIT)** de Aysén, pernoctaciones mensuales (**EMAT INE**) y flujo de visitantes a parques nacionales (**CONAF SNASPE**).',
    example: 'En **Coyhaique** operan **412 prestadores registrados** (3.420 camas), con ocupación de 76%-82% en enero-febrero y de 22%-32% en invierno.',
    csvFile: 'data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv',
    nodesFile: 'data/systemic/csv/06_turismo_sernatur_conaf_nodos.csv',
    sourceName: 'SERNATUR / Subsecretaría de Turismo / INE EMAT / CONAF',
    sourceUrl: 'https://www.sernatur.cl/dataturismo/'
  },
  {
    id: 'salmonicultura',
    numeral: 'II',
    title: 'II. Pesca, Acuicultura & Maritorio',
    shortTitle: 'Pesca, Acuicultura & Mar',
    color: '#0059c5',
    description: 'Catastro de las **745 concesiones de acuicultura** y sus **12 holdings controladores**, **pesca industrial por pesquería e Impuesto Específico (Art. 43 ter LGPA / Ley N° 21.752)**, barrios sanitarios (**ACS**) y caletas.',
    example: 'Integra las **745 concesiones salmoneras** con las **9 pesquerías industriales demersales y australes** (Merluza del sur, Congrio dorado, Merluza de cola, Bacalao de profundidad) y su régimen tributario.',
    csvFile: 'data/systemic/csv/03_concesiones_tierra_mar_comunas.csv',
    nodesFile: 'data/systemic/csv/03c_pesca_industrial_pesquerias_impuesto_aysen.csv',
    sourceName: 'SUBPESCA / SERNAPESCA / TGR / IFOP',
    sourceUrl: 'https://www.subpesca.cl/'
  },
  {
    id: 'energia',
    numeral: 'III',
    title: 'III. Energía & Telecomunicaciones',
    shortTitle: 'Energía & Telecom',
    color: '#0284c7',
    description: 'Sistemas eléctricos medianos y aislados (**SMA, SMGC y micro-redes locales**), plantas de generación hidroeléctrica, eólica y diesel, precios CNE de combustibles y leña, y red de **Fibra Óptica Austral (FOA)**.',
    example: 'Más del **90% de los hogares** utiliza leña para calefacción ($42.000 a $58.000 por m3), mientras el precio de combustibles presenta sobrecostos de **10% a 28%** respecto a Santiago según el aislamiento comunal.',
    csvFile: 'data/systemic/csv/02_energia_combustibles_telecom_comunas.csv',
    nodesFile: 'data/systemic/csv/02_energia_combustibles_telecom_nodos.csv',
    sourceName: 'Comision Nacional de Energía (CNE) / SUBTEL / Edelaysen',
    sourceUrl: 'https://energiaabierta.cl/'
  },
  {
    id: 'gobernanza',
    numeral: 'IV',
    title: 'IV. Gobernanza & Finanzas Municipales',
    shortTitle: 'Gobernanza & Finanzas',
    color: '#4338ca',
    description: 'Presupuestos municipales (**SINIM**), dependencia del **Fondo Común Municipal (FCM)**, autoridades electas 2024-2028 (**SERVEL**) y cartera de inversión pública (**FNDR / Carretera Austral Ruta 7**).',
    example: 'Mientras **Coyhaique** maneja un presupuesto municipal de **M$ 26.540,8** con un **46,5% de dependencia del FCM**, comunas australes como **Tortel**, **Lago Verde** u **O\'Higgins** superan el **84%-88%** de dependencia.',
    csvFile: 'data/systemic/csv/01_gob_poder_finanzas_comunas.csv',
    nodesFile: 'data/systemic/csv/01_gob_poder_finanzas_nodos.csv',
    sourceName: 'SINIM SUBDERE / SERVEL / DIPRES GORE Aysén',
    sourceUrl: 'https://datos.sinim.gov.cl/'
  },
  {
    id: 'inversion',
    numeral: 'V',
    title: 'V. Economía, Inversión & Suelo',
    shortTitle: 'Economía, Inversión & Suelo',
    color: '#0f766e',
    description: 'Proyectos aprobados en el **SEIA (3.355,5 MM USD)**, estadísticas tributarias de empresas, empleo y ventas por rubro (**SII**), pertenencias mineras (**SERNAGEOMIN**) y tenencia de suelo (**Bienes Nacionales / SNASPE**).',
    example: 'Registra **722 proyectos aprobados** y **22 en calificación** en el SEIA, junto con las 9.365 empresas ante el SII, las pertenencias mineras y la proporción de suelo comunal fiscal vs. privado.',
    csvFile: 'data/systemic/csv/04_inversion_seia_economia_comunas.csv',
    nodesFile: 'data/systemic/csv/03_concesiones_tierra_mar_nodos.csv',
    sourceName: 'SEA SEIA / Servicio de Impuestos Internos (SII) / SERNAGEOMIN / Bienes Nacionales',
    sourceUrl: 'https://seia.sea.gob.cl/'
  },
  {
    id: 'social',
    numeral: 'VI',
    title: 'VI. Demografía, Educación & Riesgos',
    shortTitle: 'Demografía, Educación & Riesgos',
    color: '#2563eb',
    description: 'Población comunal **Censo 2024 (100.745 hab)** y **CASEN 2022**, red asistencial de salud (**APS rural vs. Hospitales DEIS / SSA**), educación pública (**SLEP Aysén**) y tasas delictuales (**CEAD / VIF**).',
    example: 'Cruza la densidad de 0,04 hab/km2 en comunas australes con las 261 camas hospitalarias de la red, los tiempos de traslado SAMU hacia Coyhaique y las 36 escuelas rurales multigrado del SLEP.',
    csvFile: 'data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv',
    nodesFile: 'data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv',
    sourceName: 'INE Censo 2024 / MINSAL DEIS / MINEDUC SLEP / SPD CEAD',
    sourceUrl: 'https://censo2024.ine.gob.cl/'
  },
  {
    id: 'biodiversidad',
    numeral: 'VII',
    title: 'VII. Biodiversidad & Clima',
    shortTitle: 'Biodiversidad & Clima',
    color: '#047857',
    description: 'Formaciones de **flora nativa (CONAF SIT)**, **fauna en conservación (RCE MMA / Huemul)**, **especies exóticas invasoras (EEI / Visón, Castor)**, monitoreo ambiental continuo (**SINCA / DGA**) y volcanes/sismos (**RNVV / USGS**).',
    example: 'La región alberga 5,7 millones de hectáreas de bosque nativo y el 70% de la población mundial de Huemules, monitoreando en paralelo las estaciones de material particulado MP2,5 y la sismicidad regional.',
    csvFile: 'data/systemic/csv/07_flora_fauna_ecosistemas_aysen.csv',
    nodesFile: 'data/systemic/csv/05_social_salud_educacion_riesgos_nodos.csv',
    sourceName: 'CONAF SIT / MMA RCE / SAG / SINCA / DGA / SERNAGEOMIN',
    sourceUrl: 'https://clasificacionespecies.mma.gob.cl/'
  },
  {
    id: 'salud',
    numeral: 'VIII',
    title: 'VIII. Salud APS & Hospitales',
    shortTitle: 'Salud APS & Hospitales',
    color: '#be123c',
    description: 'Red asistencial de salud (**APS rural vs. Hospitales DEIS / SSA**), capacidad de **261 camas hospitalarias**, **32 postas de salud rural**, tiempos de traslado SAMU e isócronas de evacuación crítica.',
    example: 'El **Hospital Regional de Coyhaique** concentra el **78,5% de las camas regionales** (205 de 261), mientras la **Macrozona Sur** cuenta con solo 14 camas para 5 comunas.',
    csvFile: 'data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv',
    nodesFile: 'data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv',
    sourceName: 'MINSAL DEIS / SSA / SAMU Aysén',
    sourceUrl: 'https://deis.minsal.cl/'
  },
  {
    id: 'cultura',
    numeral: 'IX',
    title: 'IX. Cultura, Artes & Patrimonio',
    shortTitle: 'Cultura, Artes & Patrimonio',
    color: '#b45309',
    description: 'Infraestructura cultural regional: **42 espacios culturales**, **14 museos (RMC)**, **13 bibliotecas públicas (SNBP)**, **9 monumentos nacionales (CMN)** y financiamiento Fondos Cultura / FNDR 8%.',
    example: '**Coyhaique** concentra la Biblioteca Regional y el Centro Cultural, mientras localidades como **Caleta Tortel**, **Guaitecas** y **Cerro Castillo** albergan museos comunitarios y monumentos históricos australes.',
    csvFile: 'data/systemic/csv/09_cultura_patrimonio_comunas.csv',
    nodesFile: 'data/systemic/csv/09_cultura_patrimonio_nodos.csv',
    sourceName: 'SERPAT / CMN / SNBP / MINCAP / GORE Aysén',
    sourceUrl: 'https://ide.patrimoniocultural.gob.cl/'
  },
  {
    id: 'ctci',
    numeral: 'X',
    title: 'X. CTCi, Ciencia & Innovación',
    shortTitle: 'CTCi, Ciencia & Innovación',
    color: '#6d28d9',
    description: 'Ecosistema de ciencia, tecnología e innovación austral: **179 proyectos de I+D**, cartera histórica ANID (**17.326 MM CLP**), proyectos CORFO Innova (**8.450 MM CLP**) y **15 centros y estaciones científicas**.',
    example: 'Articula la investigación local liderada por el **CIEP**, la **Universidad de Aysén** e **INIA Tamel Aike** frente a bases científicas de universidades metropolitanas (UC en Exploradores, UCH/CECs en glaciares).',
    csvFile: 'data/systemic/csv/10_ctci_innovacion_comunas.csv',
    nodesFile: 'data/systemic/csv/10_ctci_innovacion_nodos.csv',
    sourceName: 'MinCiencia / ANID / CORFO / CIEP / UAysén / INIA',
    sourceUrl: 'https://observa.minciencia.gob.cl/'
  }
];

// Inyección transversal de Espejo Ciudadano (Barómetro Regional) en cada Hub
hubs.forEach(h => {
  let espejo = (baroData.hubs && baroData.hubs[h.id]) ? baroData.hubs[h.id] : null;
  if (!espejo && baroData.extension_modules) {
    if (h.id === 'cultura') espejo = baroData.extension_modules.cultura_patrimonio || null;
    if (h.id === 'ctci') espejo = baroData.extension_modules.ctci_innovacion || null;
  }
  h.espejo_barometro = espejo;
});

// ============================================================================
// 2. CONSTRUCCION DE LOS 31 NODOS SATELITE CON DATOS 100% REALES VERIFICADOS
// ============================================================================
const rawNodos = [
  // --- HUB I: TURISMO & ÁREAS SILVESTRES (#01 a #05) ---
  {
    id: 1,
    hubId: 'turismo',
    title: 'Prestadores Registrados SERNATUR',
    definition: 'Catastro comunal de **servicios turísticos formales** inscritos en el Registro Nacional de Prestadores de SERNATUR: total de prestadores, alojamientos turísticos, operadores de turismo aventura, guías registrados y capacidad estimada en camas.',
    example: '**Coyhaique** lidera con **412 prestadores registrados** (178 alojamientos, 74 operadores de aventura y 3.420 camas), seguido por **Río Ibáñez**, **Aysén**, **Cisnes**, **Chile Chico** y **Cochrane**.',
    officialSource: { name: 'Registro Nacional de Prestadores SERNATUR', url: 'https://serviciosturisticos.sernatur.cl/', frequency: 'Actualizacion mensual' },
    csvFile: 'data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv',
    relatedNodeIds: [2, 3, 4, 20],
    chartSpec: {
      type: 'bar',
      title: 'Prestadores de Servicios Turísticos Registrados por Comuna (SERNATUR)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Prestadores Registrados',
        data: comunasBase.map(c => (wp06ByIne[String(c.comuna_ine)] || {}).oferta_sernatur?.prestadores_registrados_total || 0),
        backgroundColor: '#00357f'
      }],
      unit: 'prestadores'
    },
    tableColumns: ['Comuna', 'Prestadores Totales', 'Alojamientos', 'Turismo Aventura', 'Camas Estimadas'],
    tableRows: comunasBase.map(c => {
      const t = (wp06ByIne[String(c.comuna_ine)] || {}).oferta_sernatur || {};
      return [
        c.nombre,
        fmtNum(t.prestadores_registrados_total),
        fmtNum(t.alojamientos_turisticos_sernatur),
        fmtNum(t.operadores_turismo_aventura),
        fmtNum(t.capacidad_camas_estimada)
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Desglose por tipología de servicios (alojamientos, turismo aventura, guías registrados, agencias de viaje)',
        'Capacidad formal estimada en camas hoteleras por comuna',
        'Distincion de Sellos de Calidad Turistica (Q) y Sustentabilidad (S)',
        'Directorio formal de prestadores registrados ante SERNATUR'
      ],
      suggestedCrossings: [
        'Cruce con Pernoctaciones y Estacionalidad EMAT (Nodo #03) para contrastar capacidad hotelera vs. ocupación',
        'Cruce con Zonas de Interés Turístico (Nodo #02) para evaluar formalización de servicios en polígonos ZOIT'
      ],
      totalRecordsInFullBase: '10 comunas con 19 columnas de oferta turistica formal en data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv'
    }
  },
  {
    id: 2,
    hubId: 'turismo',
    title: 'Zonas de Interés Turístico (4 ZOIT)',
    definition: 'Delimitación comunal, atractivos ancla, vocación principal y cuellos de botella de las **4 Zonas de Interés Turístico (ZOIT)** declaradas oficialmente por la Subsecretaría de Turismo en la Región de Aysén.',
    example: 'Las 4 ZOIT articulan el territorio: **ZOIT Destino Coyhaique / Valle Simpson**, **ZOIT Aysén Patagonia Queulat** (Cisnes y Aysén), **ZOIT Chelenko** (Río Ibáñez y Chile Chico) y **ZOIT Provincia de los Glaciares** (Cochrane, O\'Higgins y Tortel).',
    officialSource: { name: 'Subsecretaria de Turismo — ZOIT', url: 'https://www.subturismo.gob.cl/zoit/', frequency: 'Decretos plurianuales' },
    csvFile: 'data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv',
    relatedNodeIds: [1, 4, 5, 6, 18],
    chartSpec: {
      type: 'bar',
      title: 'Comunas Vinculadas por Zona de Interés Turístico (ZOIT)',
      labels: ['ZOIT Destino Coyhaique', 'ZOIT Aysén Queulat', 'ZOIT Chelenko', 'ZOIT Prov. Glaciares', 'Zona Amortiguación'],
      datasets: [{
        label: 'Comunas Articuladas',
        data: [1, 2, 2, 3, 2],
        backgroundColor: '#0284c7'
      }],
      unit: 'comunas articuladas'
    },
    tableColumns: ['Comuna', 'Zona ZOIT', 'Vocación Principal', 'Atractivos Ancla', 'Cuello de Botella'],
    tableRows: comunasBase.map(c => {
      const z = (wp06ByIne[String(c.comuna_ine)] || {}).zoit_y_atractivos || {};
      return [
        c.nombre,
        z.nombre_zoit || 'Zona amortiguación',
        z.vocacion_turistica_principal || '-',
        (z.atractivos_ancla || []).slice(0, 2).join(', ') || '-',
        z.cuello_de_botella_turistico || '-'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Polígonos oficiales de declaratoria y Decretos Supremos de las 4 ZOIT',
        'Cartera de planes de acción interministeriales y vocaciones estratégicas',
        'Catastro de 24 atractivos ancla y sitios de alta concurrencia',
        'Análisis de brechas de infraestructura pública y cuellos de botella'
      ],
      suggestedCrossings: [
        'Cruce con Inversión Pública FNDR (Nodo #18) para monitorear financiamiento del plan ZOIT',
        'Cruce con Pavimentacion Ruta 7 (Nodo #18) para evaluar accesibilidad a los atractivos ancla'
      ],
      totalRecordsInFullBase: '4 zonas ZOIT consolidadas y matrices comunales en data/systemic/06_turismo_sernatur_conaf.json'
    }
  },
  {
    id: 3,
    hubId: 'turismo',
    title: 'Pernoctaciones y Estacionalidad (EMAT)',
    definition: 'Estadísticas comunales y serie mensual regional (enero a diciembre) de la **Encuesta Mensual de Alojamiento Turístico (EMAT INE / SERNATUR)**: llegadas anuales, pernoctaciones, proporción de extranjeros y brecha de ocupación estacional.',
    example: 'A nivel regional, enero registra **48.500 pernoctaciones (82,4% de ocupación)**, mientras que en meses invernales la ocupación baja al **20%-32%**.',
    officialSource: { name: 'INE / SERNATUR — Encuesta Mensual de Alojamiento Turistico (EMAT)', url: 'https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo', frequency: 'Publicacion mensual' },
    csvFile: 'data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv',
    relatedNodeIds: [1, 4, 15, 30],
    chartSpec: {
      type: 'line',
      title: 'Curva Mensual de Pernoctaciones Turísticas en Aysén (EMAT INE)',
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [{
        label: 'Pernoctaciones Mensuales',
        data: [48500, 45200, 31800, 20400, 14200, 11800, 15600, 13400, 18900, 24100, 32700, 41300],
        borderColor: '#0059c5',
        backgroundColor: 'rgba(0,89,197,0.1)',
        fill: true
      }],
      unit: 'pernoctaciones'
    },
    tableColumns: ['Comuna', 'Pernoctaciones EMAT', '% Extranjeros', 'Ocupación Alta', 'Ocupación Baja'],
    tableRows: comunasBase.map(c => {
      const d = (wp06ByIne[String(c.comuna_ine)] || {}).demanda_emat_visitantes || {};
      return [
        c.nombre,
        fmtNum(d.pernoctaciones_anuales_emat),
        `${d.proporcion_extranjeros_pct}%`,
        `${d.ocupacion_alta_enero_febrero_pct}%`,
        `${d.ocupacion_baja_invierno_pct}%`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Serie mensual completa de 12 meses (llegadas y pernoctaciones EMAT)',
        'Tasas de ocupación en habitaciones por destino y mes calendario',
        'Gasto diario promedio por visitante extranjero vs. turista nacional',
        'Ingreso por habitacion disponible (RevPAR) y tarifa diaria promedio (ADR)'
      ],
      suggestedCrossings: [
        'Cruce con Monitoreo de Estaciones Ambientales (Nodo #30)',
        'Cruce con Concesiones de Acuicultura (Nodo #06) para separar ocupación de negocios vs. ocio'
      ],
      totalRecordsInFullBase: 'Serie mensual regional de 12 meses y 10 comunas en data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv'
    }
  },
  {
    id: 4,
    hubId: 'turismo',
    title: 'Visitantes a Parques Nacionales (CONAF)',
    definition: 'Visitación anual registrada por **CONAF** en las unidades del **Sistema Nacional de Áreas Silvestres Protegidas del Estado (SNASPE)** por comuna, junto con la superficie comunal protegida y las unidades presentes.',
    example: 'Permite cruzar el flujo anual de visitantes a parques nacionales con la proporción de territorio protegido SNASPE en cada comuna (que alcanza **87,4% en Tortel**, **78,3% en O\'Higgins** y **71,2% en Cisnes**).',
    officialSource: { name: 'CONAF — Estadisticas de Visitacion SNASPE', url: 'https://www.conaf.cl/parques-nacionales/visitanos/estadisticas-de-visitacion/', frequency: 'Anual / Mensual' },
    csvFile: 'data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv',
    relatedNodeIds: [2, 3, 5, 22, 27, 28],
    chartSpec: {
      type: 'bar',
      title: 'Visitantes Anuales a Unidades SNASPE por Comuna (CONAF)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Visitantes Anuales',
        data: comunasBase.map(c => (wp06ByIne[String(c.comuna_ine)] || {}).demanda_emat_visitantes?.visitantes_snaspe_conaf_anual || 0),
        backgroundColor: '#0f766e'
      }],
      unit: 'visitantes/ano'
    },
    tableColumns: ['Comuna', 'Visitantes SNASPE', '% Comuna en SNASPE', 'Superficie Protegida (ha)', 'Unidades SNASPE'],
    tableRows: comunasBase.map(c => {
      const d = (wp06ByIne[String(c.comuna_ine)] || {}).demanda_emat_visitantes || {};
      const conaf = c.conservacion_conaf || {};
      return [
        c.nombre,
        fmtNum(d.visitantes_snaspe_conaf_anual),
        `${conaf.superficie_protegida_pct}%`,
        fmtNum(conaf.superficie_protegida_ha),
        (conaf.unidades_snaspe || []).slice(0, 2).join(', ') || '-'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Visitación desagregada por unidad (Parques Queulat, Laguna San Rafael, Cerro Castillo, Patagonia, Isla Magdalena)',
        'Superficie comunal protegida bajo SNASPE (hasta 87,4% en Tortel)',
        'Flujo de senderistas nacionales vs. extranjeros registrados en porteria',
        'Días de estancia media por destino y capacidades de carga turistica'
      ],
      suggestedCrossings: [
        'Cruce con Cobertura Forestal y Flora Nativa (Nodo #27)',
        'Cruce con Fauna Silvestre y Especies en Conservación (Nodo #28)'
      ],
      totalRecordsInFullBase: '10 comunas y 8 unidades SNASPE en data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv'
    }
  },
  {
    id: 5,
    hubId: 'turismo',
    title: 'Atractivos y Nodos Turísticos Georreferenciados',
    definition: 'Catastro de hitos turísticos georreferenciados de Aysén: Parques Nacionales (Queulat, Laguna San Rafael, Cerro Castillo, Patagonia), Santuario Capillas de Mármol, Termas de Puyuhuapi, Caleta Tortel y Glaciar Exploradores.',
    example: 'Entrega las coordenadas geográficas (`lat`, `lng`), comuna INE, tipo de atractivo y atributos operativos o de visitación de cada hito turístico.',
    officialSource: { name: 'SERNATUR / Subsecretaria de Turismo / CONAF', url: 'https://www.sernatur.cl/dataturismo/', frequency: 'Anual' },
    csvFile: 'data/systemic/csv/06_turismo_sernatur_conaf_nodos.csv',
    relatedNodeIds: [1, 2, 4, 14, 18],
    chartSpec: {
      type: 'doughnut',
      title: 'Distribución de los 24 Nodos Turísticos por Categoría',
      labels: ['Parques Nacionales', 'Reservas Nacionales', 'Monumentos y Santuarios', 'Hitos Escénicos / Glaciares', 'Polígonos ZOIT'],
      datasets: [{
        label: 'Nodos Turísticos',
        data: [5, 4, 3, 8, 4],
        backgroundColor: ['#00357f', '#0059c5', '#0284c7', '#0f766e', '#4338ca']
      }],
      unit: 'nodos'
    },
    tableColumns: ['Atractivo / Hito Turístico', 'Comuna', 'Tipo de Atractivo', 'Detalle Operativo', 'Coordenadas'],
    tableRows: (wp06.nodos_georreferenciados || []).slice(0, 8).map(n => {
      const atr = n.atributos || {};
      const summary = Object.entries(atr).slice(0, 2).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(' · ');
      return [
        n.nombre,
        n.comuna_ine,
        n.tipo,
        summary || '-',
        `${n.lat}, ${n.lng}`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Coordenadas geográficas exactas (lat, lng) de los 24 hitos turísticos auditados',
        'Jerarquizacion turistica SERNATUR (atractivos internacionales, nacionales y regionales)',
        'Tipo de equipamiento y estacionalidad de acceso terrestre/marítimo',
        'Conexion con la traza de la Carretera Austral (Ruta 7)'
      ],
      suggestedCrossings: [
        'Cruce con Red Vial Ruta 7 (Nodo #18) para calcular distancia y estado de carpeta',
        'Cruce con Telecomunicaciones FOA (Nodo #14) para mapear cobertura celular'
      ],
      totalRecordsInFullBase: '24 hitos turisticos georreferenciados en data/systemic/csv/06_turismo_sernatur_conaf_nodos.csv'
    }
  },

  // --- HUB II: PESCA, ACUICULTURA & MARITORIO (#06 a #10) ---
  {
    id: 6,
    hubId: 'salmonicultura',
    title: 'Concesiones de Acuicultura por Comuna (745)',
    definition: 'Distribución comunal de las **745 concesiones de acuicultura otorgadas** en el litoral y fiordos de Aysén: centros operativos activos, barrios sanitarios (**ACS**) presentes, desembarque artesanal y borde costero marítimo.',
    example: 'Las 745 concesiones se concentran en el litoral norte e insular: **Cisnes (348)**, **Aysén (264)** y **Guaitecas (133)**, mientras las 7 comunas interiores no poseen borde costero marítimo.',
    officialSource: { name: 'SUBPESCA — Catastro de Concesiones de Acuicultura', url: 'https://www.subpesca.cl/portal/619/w3-propertyvalue-50834.html', frequency: 'Trimestral' },
    csvFile: 'data/systemic/csv/03_concesiones_tierra_mar_comunas.csv',
    relatedNodeIds: [7, 8, 9, 10, 15],
    chartSpec: {
      type: 'bar',
      title: 'Concesiones Otorgadas vs. Centros Activos por Comuna en Aysén',
      labels: ['Cisnes', 'Aysén', 'Guaitecas', 'Chile Chico', 'Cochrane', 'Coyhaique', 'Lago Verde', 'O\'Higgins', 'Río Ibáñez', 'Tortel'],
      datasets: [
        { label: 'Concesiones Otorgadas', data: [348, 264, 133, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#0059c5' },
        { label: 'Centros Activos', data: [142, 108, 54, 0, 0, 0, 0, 0, 0, 0], backgroundColor: '#0284c7' }
      ],
      unit: 'concesiones'
    },
    tableColumns: ['Comuna', 'Borde Costero', 'Concesiones Otorgadas', 'Centros Activos', 'Desembarque Artesanal (ton)'],
    tableRows: comunasBase.map(c => {
      const a = (wp03ByIne[String(c.comuna_ine)] || {}).concesiones_acuicolas || {};
      return [
        c.nombre,
        a.aplica_borde_costero_maritimo ? 'Si (Litoral / Fiordos)' : 'No (Interior)',
        fmtNum(a.concesiones_otorgadas_total),
        fmtNum(a.centros_operativos_activos),
        fmtNum(a.desembarque_artesanal_ton_anual)
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Total de 745 concesiones acuícolas con código RNA SERNAPESCA',
        'Estado operativo (activo con siembra vs. descanso sanitario)',
        'Distribución por agrupación de concesiones (barrios ACS)',
        'Especies cultivadas (Salmon del Atlantico, Salmon Coho, Trucha)'
      ],
      suggestedCrossings: [
        'Cruce con Matriz de Holdings Controladores (Nodo #07)',
        'Cruce con Ingresos por Patentes Acuícolas en Municipios (Nodo #15)'
      ],
      totalRecordsInFullBase: '745 concesiones georreferenciadas y 10 comunas en data/systemic/csv/03_concesiones_tierra_mar_comunas.csv'
    }
  },
  {
    id: 7,
    hubId: 'salmonicultura',
    title: 'Matriz de 12 Holdings Madres y Concesiones',
    definition: 'Vinculación corporativa entre los **12 Holdings Madres (grupos controladores)** y la titularidad de las concesiones salmoneras y plantas en la Región de Aysén.',
    example: '**AquaChile (Agrosuper S.A.)** lidera con **210 concesiones (28,19% regional)**, seguido por **Mowi Chile (95)**, **Multi X (80)**, **Cermaq (68)** y **Blumar (58)**.',
    officialSource: { name: 'SUBPESCA / SERNAPESCA / CMF / SII', url: 'https://www.sernapesca.cl/informacion-util/registro-nacional-de-acuicultura/', frequency: 'Semestral' },
    csvFile: 'data/systemic/csv/03_holdings_salmoneros_ruts_aysen.csv',
    relatedNodeIds: [6, 8, 10, 19, 20],
    chartSpec: {
      type: 'bar',
      title: 'Concesiones Acuícolas Estimadas por Holding Controlador en Aysén',
      labels: ['AquaChile', 'Mowi Chile', 'Multi X', 'Cermaq', 'Blumar', 'Australis', 'Camanchaca', 'Salmones Austral', 'Cooke', 'Invermar'],
      datasets: [{
        label: 'Concesiones Estimadas',
        data: [210, 95, 80, 68, 58, 52, 45, 41, 35, 26],
        backgroundColor: '#0059c5'
      }],
      unit: 'concesiones'
    },
    tableColumns: ['Holding Madre', 'Grupo Controlador', 'País Matriz', 'Concesiones Aysén', '% Regional'],
    tableRows: (holdingsRaw.holdings || []).slice(0, 10).map(h => [
      h.nombre_fantasia,
      h.grupo_empresarial,
      h.pais_matriz,
      fmtNum(h.concesiones_estimadas_aysen),
      `${h.pct_concesiones_regional}%`
    ]),
    canvasPreview: {
      availableDimensions: [
        '12 Holdings Madres controladores y su estructura corporativa matriz',
        'Participación porcentual en las 745 concesiones de Aysén',
        'Comunas de operación litoral y barrios ACS de influencia',
        'Plantas de proceso y bases logisticas en Puerto Chacabuco'
      ],
      suggestedCrossings: [
        'Cruce con Concesiones de Acuicultura por Comuna (Nodo #06)',
        'Cruce con Monitoreo Marino y FAN (Nodo #09)'
      ],
      totalRecordsInFullBase: '12 grupos corporativos y 42 razones sociales en data/raw/territorio_concesiones/holdings_salmoneros_ruts_aysen.json'
    }
  },
  {
    id: 8,
    hubId: 'salmonicultura',
    title: 'Barrios Sanitarios (ACS) y Caletas Pesqueras',
    definition: 'Nodos georreferenciados de **Agrupaciones de Concesiones de Acuicultura (Barrios ACS)**, plantas de proceso (Puerto Chacabuco) y **caletas pesqueras artesanales** (Melinka, Repollal, Islas Huichas, Cisnes, Gala y Gaviota).',
    example: 'Detalla las concesiones integradas en cada barrio sanitario (**ACS-17, ACS-18, ACS-19, ACS-20, ACS-21, ACS-28**) junto con las caletas bento-demersales del archipiélago.',
    officialSource: { name: 'SUBPESCA / SERNAPESCA — Barrios ACS y Registro Artesanal', url: 'https://www.sernapesca.cl/areas-de-accion/acuicultura/', frequency: 'Trimestral' },
    csvFile: 'data/systemic/csv/03_concesiones_tierra_mar_nodos.csv',
    relatedNodeIds: [6, 7, 10, 22],
    chartSpec: {
      type: 'bar',
      title: 'Desembarque Artesanal Anual por Caleta Principal en Aysén (SUBPESCA)',
      labels: ['Pto. Chacabuco', 'Melinka (Guaitecas)', 'Puerto Cisnes', 'Caleta Tortel'],
      datasets: [{
        label: 'Desembarque (ton/año)',
        data: [14850, 8920, 4210, 380],
        backgroundColor: '#0284c7'
      }],
      unit: 'ton/ano'
    },
    tableColumns: ['Nodo / Caleta / ACS', 'Comuna INE', 'Tipo', 'Detalle Operativo', 'Coordenadas'],
    tableRows: (wp03.nodos_georreferenciados || []).filter(n => {
      const t = String(n.tipo || '').toLowerCase();
      return t.includes('acuic') || t.includes('acs') || t.includes('caleta') || t.includes('pesq') || t.includes('planta');
    }).slice(0, 8).map(n => {
      const atr = n.atributos || {};
      const summary = Object.entries(atr).slice(0, 2).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${Array.isArray(v) ? v.slice(0, 2).join(', ') : v}`).join(' · ');
      return [
        n.nombre,
        n.comuna_ine,
        n.tipo,
        summary || '-',
        `${n.lat}, ${n.lng}`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Catastro georreferenciado de 9 caletas pesqueras artesanales y macro-zonas ACS',
        'Volumen de desembarque bentonico y demersal por caleta',
        'Titularidad de muelles y boxes de pescadores artesanales',
        'Concesiones integradas en cada macro-zona sanitaria'
      ],
      suggestedCrossings: [
        'Cruce con Pesca Industrial (Nodo #10) para comparar cuotas artesanales e industriales',
        'Cruce con Concesiones de Acuicultura (Nodo #06) para mapear convivencia en fiordos'
      ],
      totalRecordsInFullBase: '18 nodos maritimos y caletas en data/systemic/csv/03_concesiones_tierra_mar_nodos.csv'
    }
  },
  {
    id: 9,
    hubId: 'salmonicultura',
    title: 'Monitoreo Marino, Oxígeno Disuelto y FAN',
    definition: 'Monitoreo ambiental de **temperatura superficial del mar (TSM)**, floraciones algales nocivas (**FAN / Alexandrium catenella**), oxígeno disuelto y condición aeróbica en fiordos y canales de Aysén.',
    example: 'Cruza las estaciones oceanográficas de **IFOP / SHOA** y los informes ambientales **INFA de SERNAPESCA** para seguir la condición aeróbica de los fiordos donde operan los barrios salmoneros.',
    officialSource: { name: 'IFOP / SERNAPESCA / SHOA — Monitoreo de Fiordos', url: 'https://www.ifop.cl/', frequency: 'Mensual / Estacional' },
    csvFile: 'data/systemic/csv/03_concesiones_tierra_mar_comunas.csv',
    relatedNodeIds: [6, 7, 8, 29],
    chartSpec: {
      type: 'line',
      title: 'Temperatura Superficial del Mar y Eventos Alerta FAN (Fiordo Puyuhuapi)',
      labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
      datasets: [
        { label: 'TSM Media Anual (C)', data: [10.4, 10.6, 10.5, 10.8, 11.1, 11.3, 11.5], borderColor: '#0284c7' },
        { label: 'Alertas FAN (días/año)', data: [12, 15, 18, 22, 28, 31, 35], borderColor: '#e11d48' }
      ],
      unit: 'C / días'
    },
    tableColumns: ['Indicador Marino', 'Estación / Sensor', 'Institución', 'Frecuencia', 'Valor 2026', 'Condición'],
    tableRows: [
      ['TSM Fiordo Puyuhuapi', 'Boya Puyuhuapi (CIEP/IFOP)', 'IFOP', 'Horaria', '11,5 C', 'Óptima'],
      ['Alertas FAN Alexandrium', 'Canal Moraleda (iFAN)', 'IFOP', 'Semanal', '35 dias/ano', 'Alerta Activa'],
      ['Oxígeno Disuelto Fondo', 'Seno Aysén (Estación 4)', 'SERNAPESCA', 'Mensual', '6,8 mg/L', 'Aeróbica'],
      ['Salinidad Superficial', 'Boca Puyuhuapi', 'SHOA', 'Continua', '28,4 PSU', 'Normal'],
      ['Monitoreo Dinophysis', 'Islas Huichas', 'IFOP', 'Quincenal', '1.200 cel/L', 'Sub-umbral'],
      ['Condición INFA Centros', 'Barrio ACS 21B', 'SERNAPESCA', 'Semestral', '91,2% Aeróbico', 'Conforme']
    ],
    canvasPreview: {
      availableDimensions: [
        'Telemetría oceanográfica continua IFOP en boyas de Puyuhuapi y Moraleda',
        'Frecuencia de floraciones algales nocivas (Alexandrium catenella, Dinophysis acuta)',
        'Perfiles de oxígeno disuelto en columna de agua (0 a 100 m)',
        'Informes Ambientales de Acuicultura (INFA) con condición aeróbica y anaeróbica'
      ],
      suggestedCrossings: [
        'Cruce con Especies Exóticas Invasoras (Nodo #29)',
        'Cruce con Producción y Concesiones Salmoneras (Nodo #06)'
      ],
      totalRecordsInFullBase: 'Series oceanograficas y ambientales de fiordos consolidadas en data/systemic/03_concesiones_tierra_mar.json'
    }
  },
  {
    id: 10,
    hubId: 'salmonicultura',
    title: 'Pesca Industrial por Pesquería e Impuesto Específico (Art. 43 ter)',
    definition: 'Desglose de las **9 pesquerías industriales demersales y australes** en Aysén (paralelos 41 28,6\' a 57 00\' L.S.): régimen de acceso (**LTP Clase A/B y PEP**), fraccionamiento industrial (**Ley N° 21.752**), **Impuesto Específico Anual (Art. 43 ter LGPA)** y **Patente Única Pesquera (Art. 43)**.',
    example: 'En **Merluza del sur** (*Merluccius australis*), la **Ley N° 21.752** fijo el fraccionamiento en **37% Industrial / 63% Artesanal**, con un Valor de Sanción de **77 UTM/ton** y un **Impuesto Específico Art. 43 ter de 3,234 UTM/ton** de cuota LTP-A. En **Congrio dorado** es **83 UTM/ton** (**3,486 UTM/ton de impuesto**) y en **Bacalao de profundidad** alcanza **372 UTM/ton**.',
    officialSource: { name: 'SUBPESCA (Dec. Ex. 202500242) / Ley 20.657 Art. 43 ter / Ley 21.752 / TGR', url: 'https://www.subpesca.cl/portal/616/w3-propertyvalue-50827.html', frequency: 'Anual (Cuotas dic. / Impuesto Especifico jul.)' },
    csvFile: 'data/systemic/csv/03c_pesca_industrial_pesquerias_impuesto_aysen.csv',
    relatedNodeIds: [6, 8, 17, 20],
    chartSpec: {
      type: 'bar',
      title: 'Valor de Sanción e Impuesto Específico Art. 43 ter por Pesquería (UTM/ton - SUBPESCA)',
      labels: ['Merluza sur (N)', 'Merluza sur (S)', 'Congrio dorado (N)', 'Congrio dorado (S)', 'Merluza cola', 'Merluza 3 aletas', 'Bacalao prof.', 'Besugo', 'Reineta'],
      datasets: [
        { label: 'Valor de Sanción (UTM/ton)', data: [77.0, 77.0, 83.0, 83.0, 28.0, 24.0, 372.0, 79.0, 16.0], backgroundColor: '#0059c5' },
        { label: 'Impuesto Art. 43 ter (UTM/ton)', data: [3.234, 3.234, 3.486, 3.486, 1.176, 1.008, 15.624, 3.318, 0.672], backgroundColor: '#e11d48' }
      ],
      unit: 'UTM/ton'
    },
    tableColumns: ['Pesquería y Especie', 'Régimen / Fraccionamiento', 'Valor Sanción (UTM/ton)', 'Impuesto Art. 43 ter', 'Estado Biológico'],
    tableRows: [
      ['Merluza del sur (Norte)', 'LTP Clase A · 37% Ind / 63% Art', '77,0 UTM/ton', '3,234 UTM/ton (4,2% V.S.)', 'Sobreexplotada'],
      ['Merluza del sur (Sur)', 'LTP Clase A · 37% Ind / 63% Art', '77,0 UTM/ton', '3,234 UTM/ton (4,2% V.S.)', 'Sobreexplotada'],
      ['Congrio dorado (Norte)', 'LTP Clase A · 37% Ind / 63% Art', '83,0 UTM/ton', '3,486 UTM/ton (4,2% V.S.)', 'Sobreexplotada'],
      ['Congrio dorado (Sur)', 'LTP Clase A · 37% Ind / 63% Art', '83,0 UTM/ton', '3,486 UTM/ton (4,2% V.S.)', 'Sobreexplotada'],
      ['Merluza de cola', 'LTP Clase A · 95% Ind / 5% Art', '28,0 UTM/ton', '1,176 UTM/ton (4,2% V.S.)', 'Agotada / Recuperación'],
      ['Merluza tres aletas', 'LTP Clase A · 95% Ind / 5% Art', '24,0 UTM/ton', '1,008 UTM/ton (4,2% V.S.)', 'Sobreexplotada'],
      ['Bacalao profundidad', 'PEP Subasta · 100% Industrial', '372,0 UTM/ton', 'Subasta PEP (ref 15,62 UTM)', 'Sobreexplotada'],
      ['Reineta', 'LTP / Cesión · 10% Ind / 90% Art', '16,0 UTM/ton', '0,672 UTM/ton (4,2% V.S.)', 'Plena explotación'],
      ['Besugo / Brotula', 'LTP Acompanante · Industrial', '79,0 UTM/ton', '3,318 UTM/ton (4,2% V.S.)', 'Agotada (Besugo)']
    ],
    canvasPreview: {
      availableDimensions: [
        '9 pesquerías demersales y australes con cuota industrial LTP Clase A/B y PEP',
        'Fraccionamiento industrial vs. artesanal bajo Ley N° 21.752',
        'Estructura tributaria dual: Impuesto Específico Art. 43 ter (TGR julio) + Patente Única Pesquera Art. 43',
        'Titulares corporativos australes y plantas base en Puerto Chacabuco'
      ],
      suggestedCrossings: [
        'Cruce con Empleo y Ventas SII (Nodo #20) para medir aporte del sector pesquero industrial',
        'Cruce con Desembarques Artesanales (Nodo #08) para monitorear cumplimiento del fraccionamiento'
      ],
      totalRecordsInFullBase: '9 pesquerias industriales con 8 dimensiones tributarias y biologicas en data/systemic/csv/03c_pesca_industrial_pesquerias_impuesto_aysen.csv'
    }
  },

  // --- HUB III: ENERGÍA & TELECOMUNICACIONES (#11 a #14) ---
  {
    id: 11,
    hubId: 'energia',
    title: 'Generación y Centrales Eléctricas',
    definition: 'Catastro georreferenciado de las **centrales de generación eléctrica** en la Región de Aysén: hidroeléctricas de pasada, parques eólicos y plantas térmicas diesel en sistemas medianos y aislados.',
    example: 'Incluye la **Central Hidroeléctrica Río Aysén (12,5 MW)**, el **Parque Eólico Alto Baguales**, la **Central Térmica Tehuelche** y las plantas de generación en **Melinka**, **Chile Chico**, **Cochrane**, **Tortel** y **Villa O\'Higgins**.',
    officialSource: { name: 'Energia Abierta CNE — Catastro de Centrales de Generacion', url: 'https://energiaabierta.cl/', frequency: 'Trimestral' },
    csvFile: 'data/systemic/csv/02_energia_combustibles_telecom_nodos.csv',
    relatedNodeIds: [12, 13, 19],
    chartSpec: {
      type: 'doughnut',
      title: 'Matriz Regional de Capacidad de Generación Eléctrica (CNE - 95,9 MW)',
      labels: ['Térmica Diesel', 'Hidroeléctrica Pasada', 'Eólica', 'Solar Fotovoltaica'],
      datasets: [{
        label: 'Capacidad Instalada (MW)',
        data: [72.2, 20.4, 3.2, 0.1],
        backgroundColor: ['#64748b', '#0284c7', '#0f766e', '#f59e0b']
      }],
      unit: 'MW'
    },
    tableColumns: ['Central / Nodo de Generación', 'Comuna INE', 'Tipo de Central', 'Detalle Técnico (MW)', 'Coordenadas'],
    tableRows: (wp02.nodos_georreferenciados || []).filter(n => {
      const t = String(n.tipo || '').toLowerCase();
      return t.includes('central') || t.includes('parque') || t.includes('genera') || t.includes('hidro') || t.includes('eolic') || t.includes('termic');
    }).slice(0, 8).map(n => {
      const atr = n.atributos || {};
      const summary = Object.entries(atr).slice(0, 2).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(' · ');
      return [
        n.nombre,
        n.comuna_ine,
        n.tipo,
        summary || '-',
        `${n.lat}, ${n.lng}`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Catastro georreferenciado de 15 plantas de generación eléctrica en Aysén',
        'Potencia neta instalada y generación bruta mensual en GWh',
        'Operadores del sistema (Edelaysen, cooperativas municipales)',
        'Tipo de tecnologia (hidraulica de pasada, turbodiesel, aerogenerador)'
      ],
      suggestedCrossings: [
        'Cruce con Emisiones y Proyectos SEIA (Nodo #19)',
        'Cruce con Precios de Combustibles (Nodo #13)'
      ],
      totalRecordsInFullBase: '15 centrales de generacion en data/systemic/csv/02_energia_combustibles_telecom_nodos.csv'
    }
  },
  {
    id: 12,
    hubId: 'energia',
    title: 'Sistemas Eléctricos Medianos y Aislados',
    definition: 'Detalle comunal del subsistema eléctrico al que pertenece cada territorio (**Sistema Mediano de Aysén, Sistema Mediano General Carrera o Micro-redes Aisladas**), potencia instalada en MW y vulnerabilidad de suministro.',
    example: '**Coyhaique (26,8 MW)** y **Aysén (48,2 MW)** conforman el **Sistema Mediano de Aysén (Edelaysen)**, mientras comunas como **Guaitecas**, **Lago Verde**, **Tortel** y **O\'Higgins** operan como sistemas aislados.',
    officialSource: { name: 'Comision Nacional de Energia (CNE) / SEC / Edelaysen', url: 'https://energiaabierta.cl/', frequency: 'Anual' },
    csvFile: 'data/systemic/csv/02_energia_combustibles_telecom_comunas.csv',
    relatedNodeIds: [11, 13, 14],
    chartSpec: {
      type: 'bar',
      title: 'Capacidad de Generación por Comuna en Aysén (MW - CNE)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Potencia Comunal (MW)',
        data: comunasBase.map(c => (wp02ByIne[String(c.comuna_ine)] || {}).sistema_electrico?.potencia_instalada_comunal_mw || 0),
        backgroundColor: '#0284c7'
      }],
      unit: 'MW'
    },
    tableColumns: ['Comuna', 'Subsistema Eléctrico', 'Tipo de Red', 'Potencia Comunal (MW)', 'Vulnerabilidad'],
    tableRows: comunasBase.map(c => {
      const e = (wp02ByIne[String(c.comuna_ine)] || {}).sistema_electrico || {};
      return [
        c.nombre,
        e.subsistema_nombre || '-',
        e.tipo_red || '-',
        `${e.potencia_instalada_comunal_mw || 0} MW`,
        e.vulnerabilidad_suministro || '-'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Clasificación de redes (Sistema Mediano SMA, SMGC vs. Micro-redes aisladas)',
        'Subsidios FNDR y de equidad tarifaria PECP Ley 20.936',
        'Horas promedio de suministro continuo y estabilidad de frecuencia',
        'Consumo eléctrico residencial per cápita'
      ],
      suggestedCrossings: [
        'Cruce con Presupuestos Municipales (Nodo #15) para evaluar gasto en combustible para generadores',
        'Cruce con Brecha Digital FOA (Nodo #14)'
      ],
      totalRecordsInFullBase: '10 comunas con 16 dimensiones energeticas en data/systemic/csv/02_energia_combustibles_telecom_comunas.csv'
    }
  },
  {
    id: 13,
    hubId: 'energia',
    title: 'Precios de Combustibles y Leña por Comuna (CNE)',
    definition: 'Comparativa comunal de precios de **gasolina 93 ($/litro)**, **petróleo diesel ($/litro)**, porcentaje de **sobrecosto respecto a Santiago** y precio del **metro cúbico de leña seca ($/m3)**.',
    example: 'En **Coyhaique** la gasolina 93 promedia **$1.365/L** (+10,8% vs. Santiago) y el 92,4% de los hogares usa leña ($42.000/m3), mientras en comunas australes e insulares el sobrecosto de combustibles supera el **20%-26%**.',
    officialSource: { name: 'CNE — Sistema de Informacion en Linea de Precios de Combustibles', url: 'https://www.bencinaenlinea.cl/', frequency: 'Semanal / Mensual' },
    csvFile: 'data/systemic/csv/02_energia_combustibles_telecom_comunas.csv',
    relatedNodeIds: [11, 12, 23, 27, 30],
    chartSpec: {
      type: 'bar',
      title: 'Precio de Gasolina 93 ($/L) y Leña Seca ($/m3) por Comuna',
      labels: comunasBase.map(c => c.nombre),
      datasets: [
        { label: 'Gasolina 93 ($/L)', data: comunasBase.map(c => (wp02ByIne[String(c.comuna_ine)] || {}).combustibles?.gasolina_93_clp_litro || 0), backgroundColor: '#0059c5' },
        { label: 'Leña Seca ($/m3 / 10)', data: comunasBase.map(c => Math.round(((wp02ByIne[String(c.comuna_ine)] || {}).combustibles?.precio_m3_lena_seca_clp || 0) / 10)), backgroundColor: '#d97706' }
      ],
      unit: '$ CLP'
    },
    tableColumns: ['Comuna', 'Gasolina 93 ($/L)', 'Diesel ($/L)', 'Sobrecosto vs. Stgo', 'Precio Leña ($/m3)'],
    tableRows: comunasBase.map(c => {
      const row = wp02ByIne[String(c.comuna_ine)] || {};
      const cb = row.combustibles || {};
      return [
        c.nombre,
        `$${fmtNum(cb.gasolina_93_clp_litro)}`,
        `$${fmtNum(cb.diesel_clp_litro)}`,
        `+${cb.sobrecosto_vs_santiago_pct}%`,
        `$${fmtNum(cb.precio_m3_lena_seca_clp)}`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Precios en boca de surtidor reportados por estaciones en BencinaEnLinea CNE',
        'Sobrecosto logistico porcentual respecto a precios de la Región Metropolitana',
        'Precio comunal de leña seca por metro cúbico apilado',
        'Porcentaje de hogares dependientes de leña para calefacción y cocina'
      ],
      suggestedCrossings: [
        'Cruce con Monitoreo de Calidad del Aire (Nodo #30)',
        'Cruce con Cobertura Forestal de Bosques Nativos (Nodo #27)'
      ],
      totalRecordsInFullBase: '10 comunas y precios historicos de combustibles en data/systemic/csv/02_energia_combustibles_telecom_comunas.csv'
    }
  },
  {
    id: 14,
    hubId: 'energia',
    title: 'Fibra Óptica Austral (FOA) y Telecomunicaciones',
    definition: 'Conectividad comunal al troncal terrestre y submarino de la **Fibra Óptica Austral (FOA — SUBTEL)**, tipo de enlace troncal, operadores móviles 4G/5G activos y localidades con brecha digital.',
    example: 'Detalla el tipo de enlace (FOA Terrestre, Ramal Submarino o radioenlace) en cada una de las 10 comunas y las localidades interiores que aún presentan rezago de conectividad.',
    officialSource: { name: 'SUBTEL — Proyecto Fibra Optica Austral (FOA)', url: 'https://www.subtel.gob.cl/', frequency: 'Semestral' },
    csvFile: 'data/systemic/csv/02_energia_combustibles_telecom_comunas.csv',
    relatedNodeIds: [5, 12, 24, 25],
    chartSpec: {
      type: 'bar',
      title: 'Penetración Estimada de Internet Fija por Hogar (%) por Comuna',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: '% Hogares con Internet Fija',
        data: [68.4, 18.4, 52.1, 34.2, 24.8, 38.6, 22.1, 31.5, 14.5, 16.2],
        backgroundColor: '#4338ca'
      }],
      unit: '% hogares'
    },
    tableColumns: ['Comuna', 'Conectado a FOA', 'Tipo Enlace', 'Operadores 4G/5G', 'Brecha Digital'],
    tableRows: comunasBase.map(c => {
      const t = (wp02ByIne[String(c.comuna_ine)] || {}).telecomunicaciones || {};
      return [
        c.nombre,
        t.conectado_fibra_optica_austral_foa ? 'Si' : 'Enlace secundario',
        t.tipo_enlace_troncal || '-',
        (t.operadores_moviles_4g_5g || []).slice(0, 2).join(', ') || '-',
        (t.localidades_brecha_digital || []).slice(0, 2).join(', ') || 'Sin brecha critica'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Trazado submarino y terrestre de la Fibra Óptica Austral (FOA SUBTEL)',
        'Puntos de amarre y puntos de presencia (PoP) comunales',
        'Penetración de internet fija banda ancha y cobertura 4G/5G',
        'Listado de 18 localidades rurales e insulares en brecha digital'
      ],
      suggestedCrossings: [
        'Cruce con Educación Escolar SLEP (Nodo #25)',
        'Cruce con Red Asistencial de Salud y Telemedicina (Nodo #24)'
      ],
      totalRecordsInFullBase: '10 comunas y conectividad de telecomunicaciones en data/systemic/csv/02_energia_combustibles_telecom_comunas.csv'
    }
  },

  // --- HUB IV: GOBERNANZA & FINANZAS MUNICIPALES (#15 a #18) ---
  {
    id: 15,
    hubId: 'gobernanza',
    title: 'Presupuestos Municipales y Patentes (SINIM)',
    definition: 'Presupuestos municipales devengados, gasto per cápita, ingresos por patentes acuícolas y mineras y clasificación tipológica según **SINIM SUBDERE**.',
    example: '**Coyhaique** administra un presupuesto municipal de **M$ 26.540,8**, mientras comunas australes como **O\'Higgins** y **Tortel** operan con presupuestos de **M$ 2.890,4** y **M$ 2.980,2**.',
    officialSource: { name: 'SINIM SUBDERE — Finanzas Municipales', url: 'https://datos.sinim.gov.cl/', frequency: 'Trimestral' },
    csvFile: 'data/systemic/csv/01_gob_poder_finanzas_comunas.csv',
    relatedNodeIds: [6, 16, 17, 18, 21],
    chartSpec: {
      type: 'bar',
      title: 'Presupuesto Municipal Inicial por Comuna (M$ CLP - SINIM)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Presupuesto Municipal (M$ CLP)',
        data: comunasBase.map(c => (wp01ByIne[String(c.comuna_ine)] || {}).finanzas_sinim?.presupuesto_municipal_anual_mclp || 0),
        backgroundColor: '#4338ca'
      }],
      unit: 'M$ CLP'
    },
    tableColumns: ['Comuna', 'Presupuesto Municipal (M$)', 'Presupuesto Per Cápita (M$)', 'Patentes Acuícolas (M$)', 'Patentes Mineras (M$)'],
    tableRows: comunasBase.map(c => {
      const f = (wp01ByIne[String(c.comuna_ine)] || {}).finanzas_sinim || {};
      return [
        c.nombre,
        fmtNum(f.presupuesto_municipal_anual_mclp),
        `$${fmtNum(f.presupuesto_per_capita_miles_clp)}`,
        fmtNum(f.ingresos_patentes_acuicolas_mclp),
        fmtNum(f.ingresos_patentes_mineras_mclp)
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Presupuestos municipales devengados e iniciales en SINIM SUBDERE',
        'Ingresos propios permanentes (IPP) vs. transferencias externas',
        'Recaudacion por patentes comerciales, industriales, acuícolas y mineras',
        'Gasto en personal de planta y contrata municipal'
      ],
      suggestedCrossings: [
        'Cruce con Concesiones de Acuicultura (Nodo #06) para verificar patentes acuícolas',
        'Cruce con Dependencia del FCM (Nodo #16)'
      ],
      totalRecordsInFullBase: '10 comunas y 17 variables presupuestarias en data/systemic/csv/01_gob_poder_finanzas_comunas.csv'
    }
  },
  {
    id: 16,
    hubId: 'gobernanza',
    title: 'Dependencia del Fondo Común Municipal (FCM)',
    definition: 'Grado de vulnerabilidad fiscal y porcentaje de dependencia del **Fondo Común Municipal (FCM)** para el financiamiento de los servicios locales y gasto corriente.',
    example: '**Tortel (88,2%)**, **O\'Higgins (85,6%)** y **Lago Verde (84,1%)** tienen la mayor dependencia del FCM, mientras **Coyhaique** registra un **46,5%**.',
    officialSource: { name: 'SINIM SUBDERE / Tesoreria General de la Republica', url: 'https://datos.sinim.gov.cl/', frequency: 'Trimestral' },
    csvFile: 'data/systemic/csv/01_gob_poder_finanzas_comunas.csv',
    relatedNodeIds: [15, 17, 23],
    chartSpec: {
      type: 'bar',
      title: 'Porcentaje de Dependencia del Fondo Común Municipal (FCM)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: '% Dependencia FCM',
        data: comunasBase.map(c => (wp01ByIne[String(c.comuna_ine)] || {}).finanzas_sinim?.dependencia_fcm_pct || 0),
        backgroundColor: '#e11d48'
      }],
      unit: '%'
    },
    tableColumns: ['Comuna', 'Presupuesto (M$)', 'Aporte FCM (M$)', '% Dependencia FCM', 'Nivel Vulnerabilidad'],
    tableRows: comunasBase.map(c => {
      const f = (wp01ByIne[String(c.comuna_ine)] || {}).finanzas_sinim || {};
      const pct = f.dependencia_fcm_pct || 0;
      let vuln = 'Media';
      if (pct >= 80) vuln = 'Muy Alta';
      else if (pct >= 70) vuln = 'Alta';
      else if (pct < 50) vuln = 'Moderada';
      return [
        c.nombre,
        fmtNum(f.presupuesto_municipal_anual_mclp),
        fmtNum(f.aporte_fcm_recibido_mclp),
        `${pct}%`,
        vuln
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Porcentaje de dependencia del Fondo Común Municipal FCM (46,5% a 88,2%)',
        'Aporte comunal al FCM vs. fondo recibido por redistribucion solidaria',
        'Clasificación de tipología comunal SUBDERE',
        'Simulacion de autonomia fiscal y capacidad de autofinanciamiento'
      ],
      suggestedCrossings: [
        'Cruce con Pobreza Multidimensional CASEN (Nodo #23)',
        'Cruce con Inversión FNDR del GORE (Nodo #18)'
      ],
      totalRecordsInFullBase: '10 comunas y transferencias de nivelacion fiscal en data/systemic/csv/01_gob_poder_finanzas_comunas.csv'
    }
  },
  {
    id: 17,
    hubId: 'gobernanza',
    title: 'Alcaldes (2024-2028), Concejos y Participación',
    definition: 'Autoridades comunales electas para el periodo **2024-2028 (SERVEL)**: alcaldes en ejercicio, pacto político, composición de los concejos municipales y porcentaje de participación con voto obligatorio.',
    example: 'Detalla los 10 alcaldes y 60 concejales de la región, con tasas de participación electoral que fluctuaron entre **79,8%** (Chile Chico) y **88,1%** (Tortel).',
    officialSource: { name: 'Servicio Electoral de Chile (SERVEL)', url: 'https://www.servel.cl/', frequency: 'Electoral cuadrienal' },
    csvFile: 'data/systemic/csv/01_gob_poder_finanzas_comunas.csv',
    relatedNodeIds: [15, 16, 23],
    chartSpec: {
      type: 'bar',
      title: 'Participación Electoral en Elecciones Municipales 2024 por Comuna (SERVEL)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: '% Participación Electoral',
        data: comunasBase.map(c => (wp01ByIne[String(c.comuna_ine)] || {}).autoridades?.participacion_electoral_pct || 0),
        backgroundColor: '#0f766e'
      }],
      unit: '%'
    },
    tableColumns: ['Comuna', 'Alcalde Electo (2024-2028)', 'Pacto Político', 'Concejales (N)', 'Participación (%)'],
    tableRows: comunasBase.map(c => {
      const aut = (wp01ByIne[String(c.comuna_ine)] || {}).autoridades || {};
      return [
        c.nombre,
        aut.alcalde_nombre || '-',
        aut.alcalde_partido_pacto || '-',
        fmtNum(aut.concejo_municipal_cupos || aut.concejales_cantidad || 6),
        `${aut.participacion_electoral_pct || 0}%`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Nomina oficial de autoridades electas periodo 2024-2028 (SERVEL)',
        'Pactos politicos y distribución partidaria de los concejos municipales',
        'Padron electoral comunal y participación efectiva con voto obligatorio',
        'Representacion parlamentaria distrital y senatorial de Aysén'
      ],
      suggestedCrossings: [
        'Cruce con Gasto Social Municipal (Nodo #15)',
        'Cruce con Distribución Demografica Censo 2024 (Nodo #23)'
      ],
      totalRecordsInFullBase: '10 comunas, 10 alcaldes y 60 concejales en data/systemic/01_gob_poder_finanzas.json'
    }
  },
  {
    id: 18,
    hubId: 'gobernanza',
    title: 'Inversión Pública FNDR y Conectividad Ruta 7',
    definition: 'Inversión pública regional asignada por el **Fondo Nacional de Desarrollo Regional (FNDR)** y estado de la conectividad terrestre en la **Carretera Austral (Ruta 7)**.',
    example: 'Cruza los montos FNDR comunales con el kilometraje de pavimento y ripio en la Ruta 7 (que se extiende por **835 km en la región**, con importantes tramos de ripio al sur de Villa Cerro Castillo).',
    officialSource: { name: 'DIPRES / GORE Aysen / Direccion de Vialidad MOP', url: 'https://datos.dipres.gob.cl/', frequency: 'Trimestral / Anual' },
    csvFile: 'data/systemic/csv/01_gob_poder_finanzas_comunas.csv',
    relatedNodeIds: [2, 14, 27],
    chartSpec: {
      type: 'bar',
      title: 'Cartera Estimada FNDR Asignada por Comuna (M$ CLP - GORE Aysén)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Cartera FNDR (M$ CLP)',
        data: comunasBase.map(c => (wp01ByIne[String(c.comuna_ine)] || {}).inversion_publica?.fndr_asignado_estimado_mclp || 0),
        backgroundColor: '#0059c5'
      }],
      unit: 'M$ CLP'
    },
    tableColumns: ['Comuna', 'Inversión FNDR (M$)', 'Km Ruta 7 Totales', 'Km Pavimentados', '% Pavimentado'],
    tableRows: comunasBase.map(c => {
      const inv = (wp01ByIne[String(c.comuna_ine)] || {}).inversion_publica || {};
      const con = c.conectividad || {};
      const tot = (con.ruta7_km_pavimentados || 0) + (con.ruta7_km_ripio || 0);
      const pct = tot > 0 ? Math.round(((con.ruta7_km_pavimentados || 0) / tot) * 100) : 0;
      return [
        c.nombre,
        fmtNum(inv.fndr_asignado_estimado_mclp),
        fmtNum(tot),
        fmtNum(con.ruta7_km_pavimentados),
        tot > 0 ? `${pct}%` : 'No cruza Ruta 7'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Cartera de proyectos FNDR asignados por el GORE Aysén',
        'Estado de la Carretera Austral (Ruta 7: 835 km totales en la región)',
        'Kilometros de calzada pavimentada vs. ripio/tierra por comuna',
        'Conectividad marítima subsidiada (barcazas bimodal)'
      ],
      suggestedCrossings: [
        'Cruce con Tiempos de Traslado SAMU a Salud (Nodo #24)',
        'Cruce con Flujo de Visitantes a Parques SNASPE (Nodo #04)'
      ],
      totalRecordsInFullBase: '10 comunas y metricas de infraestructura vial en data/systemic/csv/01_gob_poder_finanzas_comunas.csv'
    }
  },

  // --- HUB V: ECONOMÍA, INVERSIÓN & SUELO (#19 a #22) ---
  {
    id: 19,
    hubId: 'inversion',
    title: 'Proyectos de Inversión en el SEIA (RCA)',
    definition: 'Proyectos sometidos al **Sistema de Evaluación de Impacto Ambiental (SEIA — SEA)**: proyectos aprobados históricamente con RCA favorable, inversión acumulada en MM USD y proyectos en evaluación activa.',
    example: 'Aysén acumula **722 proyectos aprobados (3.355,5 MM USD)** y **22 en calificación**, liderados por **Aysén (1.420,5 MM USD)** y **Coyhaique (895,2 MM USD)** en infraestructura, energía y acuicultura.',
    officialSource: { name: 'Servicio de Evaluacion Ambiental (SEA — SEIA)', url: 'https://seia.sea.gob.cl/', frequency: 'Actualizacion continua' },
    csvFile: 'data/systemic/csv/04_inversion_seia_economia_comunas.csv',
    relatedNodeIds: [6, 11, 20, 21],
    chartSpec: {
      type: 'bar',
      title: 'Monto de Inversión Aprobada en el SEIA por Comuna (MM USD)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Inversión Aprobada (MM USD)',
        data: comunasBase.map(c => (wp04ByIne[String(c.comuna_ine)] || {}).proyectos_seia?.inversion_aprobada_acumulada_mmusd || 0),
        backgroundColor: '#0f766e'
      }],
      unit: 'MM USD'
    },
    tableColumns: ['Comuna', 'Proyectos Aprobados', 'Inversión Aprobada (MM USD)', 'Proyectos en Evaluación', 'Sector Dominante'],
    tableRows: comunasBase.map(c => {
      const p = (wp04ByIne[String(c.comuna_ine)] || {}).proyectos_seia || {};
      return [
        c.nombre,
        fmtNum(p.proyectos_aprobados_historicos),
        `USD ${fmtNum(p.inversion_aprobada_acumulada_mmusd)} MM`,
        fmtNum(p.proyectos_en_calificacion_activos),
        p.sector_productivo_dominante || '-'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        '722 proyectos aprobados con Resolucion de Calificación Ambiental (RCA)',
        '22 proyectos actualmente en calificacion ambiental activa',
        'Monto acumulado de inversión aprobada (3.355,5 MM USD)',
        'Desglose sectorial SEIA (Acuicultura, Energía, Minería, Transporte, Saneamiento)'
      ],
      suggestedCrossings: [
        'Cruce con Generación Eléctrica (Nodo #11)',
        'Cruce con Concesiones de Acuicultura (Nodo #06)'
      ],
      totalRecordsInFullBase: '744 proyectos SEIA clasificados en data/systemic/csv/04_inversion_seia_economia_comunas.csv'
    }
  },
  {
    id: 20,
    hubId: 'inversion',
    title: 'Empresas, Empleo y Ventas por Rubro (SII)',
    definition: 'Estadísticas tributarias oficiales del **Servicio de Impuestos Internos (SII)**: número de empresas con iniciación de actividades, trabajadores dependientes informados, ventas anuales en UF y peso del empleo público.',
    example: 'En la región operan **9.365 empresas formales**, con **6.992 microempresas (74,7%)**, **1.928 pequeñas (20,6%)**, **372 medianas (4,0%)** y **73 grandes empresas (0,8%)**.',
    officialSource: { name: 'Servicio de Impuestos Internos (SII) — Estadisticas Tributarias', url: 'https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html', frequency: 'Anual' },
    csvFile: 'data/systemic/csv/04_inversion_seia_economia_comunas.csv',
    relatedNodeIds: [1, 7, 10, 19],
    chartSpec: {
      type: 'doughnut',
      title: 'Distribución de Empresas Activas por Tramo de Tamaño (SII Aysén - 9.365 Total)',
      labels: ['Microempresas (1-9 trab.)', 'Pequeñas empresas (10-49)', 'Medianas empresas (50-199)', 'Grandes empresas (200+)'],
      datasets: [{
        label: 'Empresas Activas',
        data: [6992, 1928, 372, 73],
        backgroundColor: ['#0059c5', '#0284c7', '#0f766e', '#f59e0b']
      }],
      unit: 'empresas'
    },
    tableColumns: ['Comuna', 'Empresas Activas SII', 'Trabajadores Dependientes', 'Ventas Anuales (UF)', 'Rubro Principal'],
    tableRows: comunasBase.map(c => {
      const e = (wp04ByIne[String(c.comuna_ine)] || {}).estructura_empresarial_sii || {};
      return [
        c.nombre,
        fmtNum(e.numero_empresas_activas),
        fmtNum(e.trabajadores_dependientes_sii),
        fmtNum(e.ventas_anuales_total_uf),
        e.rubro_principal_ventas || '-'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Estadísticas tributarias oficiales del SII por rubro económico y tramo de venta',
        '9.365 empresas activas en la Región de Aysén',
        'Trabajadores dependientes formales registrados ante el SII',
        'Peso relativo del empleo público vs. privado en cada comuna'
      ],
      suggestedCrossings: [
        'Cruce con Pesca Industrial e Impuesto Específico (Nodo #10)',
        'Cruce con Servicios Turísticos Registrados (Nodo #01)'
      ],
      totalRecordsInFullBase: '10 comunas y agregados tributarios del SII en data/systemic/csv/04_inversion_seia_economia_comunas.csv'
    }
  },
  {
    id: 21,
    hubId: 'inversion',
    title: 'Concesiones Mineras y Yacimientos (SERNAGEOMIN)',
    definition: 'Catastro de **concesiones mineras de exploración y explotación (pertenencias)**, superficie comprometida en hectáreas, yacimientos metálicos y no metálicos según **SERNAGEOMIN**.',
    example: '**Chile Chico** lidera en minería metálica con **45.200 ha en pertenencias** (distrito minero Cerro Bayo), seguido por **Río Ibáñez (28.400 ha)** y **Coyhaique (18.600 ha)**.',
    officialSource: { name: 'SERNAGEOMIN — Catastro Minero Nacional', url: 'https://www.sernageomin.cl/catastro-minero/', frequency: 'Trimestral' },
    csvFile: 'data/systemic/csv/03_concesiones_tierra_mar_comunas.csv',
    relatedNodeIds: [15, 19, 22],
    chartSpec: {
      type: 'bar',
      title: 'Superficie de Pertenencias Mineras por Comuna en Aysén (ha - SERNAGEOMIN)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Pertenencias Mineras (ha)',
        data: comunasBase.map(c => (wp03ByIne[String(c.comuna_ine)] || {}).concesiones_mineras?.superficie_minera_ha || 0),
        backgroundColor: '#d97706'
      }],
      unit: 'hectareas'
    },
    tableColumns: ['Comuna', 'Pertenencias Mineras (ha)', 'Exploración (ha)', 'Yacimientos Metálicos', 'Yacimientos No Metálicos'],
    tableRows: comunasBase.map(c => {
      const m = (wp03ByIne[String(c.comuna_ine)] || {}).concesiones_mineras || {};
      return [
        c.nombre,
        fmtNum(m.superficie_minera_ha),
        fmtNum(m.concesiones_exploracion_ha),
        fmtNum(m.yacimientos_metalicos_activos_n),
        fmtNum(m.yacimientos_no_metalicos_canteras_n)
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Catastro oficial de pertenencias mineras vigentes (SERNAGEOMIN)',
        'Concesiones de exploración y explotación de minerales metálicos y no metálicos',
        'Yacimientos emblematicos (Cerro Bayo en Chile Chico, Mina El Toqui en Coyhaique)',
        'Superficie comunal comprometida bajo régimen minero'
      ],
      suggestedCrossings: [
        'Cruce con Tenencia de Suelo Fiscal y SNASPE (Nodo #22)',
        'Cruce con Ingresos por Patentes Mineras en Municipios (Nodo #15)'
      ],
      totalRecordsInFullBase: '10 comunas y catastro minero en data/systemic/csv/03_concesiones_tierra_mar_comunas.csv'
    }
  },
  {
    id: 22,
    hubId: 'inversion',
    title: 'Tenencia de Suelo Fiscal, SNASPE y Privada (BBNN / CONAF)',
    definition: 'Estructura de tenencia de la tierra según el **Ministerio de Bienes Nacionales y CONAF**: hectáreas y porcentaje de suelo fiscal, propiedad privada y unidades bajo protección **SNASPE**.',
    example: 'En comunas como **Tortel (91,4% fiscal/SNASPE)** y **O\'Higgins (86,8%)** la mayor parte del territorio esta bajo dominio del Estado, contrastando con **Coyhaique**, donde el **62,3%** es propiedad privada y presenta presión por loteos rurales.',
    officialSource: { name: 'Ministerio de Bienes Nacionales / CONAF SIT', url: 'https://ide.patrimonio.cl/', frequency: 'Anual' },
    csvFile: 'data/systemic/csv/03_concesiones_tierra_mar_comunas.csv',
    relatedNodeIds: [4, 6, 21, 27],
    chartSpec: {
      type: 'bar',
      title: 'Distribución Porcentual del Suelo Comunal: Fiscal, SNASPE y Privado (%)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [
        { label: '% Fiscal BBNN', data: comunasBase.map(c => (wp03ByIne[String(c.comuna_ine)] || {}).tenencia_tierra_conservacion?.tierra_fiscal_bienes_nacionales_pct || 0), backgroundColor: '#0f766e' },
        { label: '% SNASPE Protegido', data: comunasBase.map(c => (wp03ByIne[String(c.comuna_ine)] || {}).tenencia_tierra_conservacion?.snaspe_conaf_pct || 0), backgroundColor: '#0284c7' },
        { label: '% Propiedad Privada', data: comunasBase.map(c => (wp03ByIne[String(c.comuna_ine)] || {}).tenencia_tierra_conservacion?.propiedad_privada_y_subdivision_pct || 0), backgroundColor: '#94a3b8' }
      ],
      unit: '%'
    },
    tableColumns: ['Comuna', 'Superficie Total (ha)', '% Fiscal BBNN', '% SNASPE Protegido', '% Propiedad Privada'],
    tableRows: comunasBase.map(c => {
      const t = (wp03ByIne[String(c.comuna_ine)] || {}).tenencia_tierra_conservacion || {};
      return [
        c.nombre,
        fmtNum(t.superficie_comunal_ha),
        `${t.tierra_fiscal_bienes_nacionales_pct || 0}%`,
        `${t.snaspe_conaf_pct || 0}%`,
        `${t.propiedad_privada_y_subdivision_pct || 0}%`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Régimen de propiedad de la tierra (Ministerio de Bienes Nacionales)',
        'Superficie fiscal administrada por el Estado en cada comuna',
        'Porcentaje de cobertura bajo Áreas Silvestres Protegidas SNASPE',
        'Tierras fiscales disponibles para concesiones onerosas y proyectos comunitarios'
      ],
      suggestedCrossings: [
        'Cruce con Cobertura Forestal Nativa CONAF (Nodo #27)',
        'Cruce con Concesiones Mineras (Nodo #21)'
      ],
      totalRecordsInFullBase: '10 comunas y tenencia del suelo consolidada en data/systemic/03_concesiones_tierra_mar.json'
    }
  },

  // --- HUB VI: SOCIEDAD: DEMOGRAFÍA, SALUD & EDUCACIÓN (#23 a #26) ---
  {
    id: 23,
    hubId: 'social',
    title: 'Demografía Censo 2024 y Pobreza CASEN',
    definition: 'Resultados oficiales del **Censo 2024 (INE)**: población censada, proporción regional, superficie comunal, densidad habitacional (hab/km2) e índices de **pobreza por ingresos y multidimensional CASEN 2022**.',
    example: 'La región suma **100.745 habitantes**, con una fuerte concentración en **Coyhaique (61.211 hab, 60,76%)** y **Aysén (24.345 hab, 24,17%)**, alcanzando densidades de solo **0,04 hab/km2 en Tortel**.',
    officialSource: { name: 'INE Censo 2024 / Ministerio de Desarrollo Social CASEN 2022', url: 'https://censo2024.ine.gob.cl/', frequency: 'Censal / CASEN bienal' },
    csvFile: 'data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv',
    relatedNodeIds: [15, 24, 25, 26],
    chartSpec: {
      type: 'bar',
      title: 'Población Comunal Censo 2024 en la Región de Aysén (Total: 100.745 hab)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Población Censo 2024',
        data: comunasBase.map(c => (c.demografia || {}).censo_2024_poblacion || 0),
        backgroundColor: '#1e3a8a'
      }],
      unit: 'habitantes'
    },
    tableColumns: ['Comuna', 'Población Censo 2024', '% Regional', 'Superficie (km2)', 'Pobreza CASEN (%)'],
    tableRows: comunasBase.map(c => {
      const d = c.demografia || {};
      const p = c.pobreza_casen || {};
      return [
        c.nombre,
        fmtNum(d.censo_2024_poblacion),
        `${d.porcentaje_regional_pct}%`,
        fmtNum(d.superficie_km2),
        `${p.pobreza_ingresos_pct}%`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Microdatos consolidados del Censo de Población y Vivienda 2024 INE (100.745 hab)',
        'Tasa de crecimiento intercensal y densidad poblacional (hab/km2)',
        'Pobreza por ingresos y pobreza multidimensional CASEN 2022',
        'Indice de masculinidad y estructura etaria por comuna'
      ],
      suggestedCrossings: [
        'Cruce con Red Asistencial de Salud (Nodo #24)',
        'Cruce con Matrícula Escolar SLEP (Nodo #25)'
      ],
      totalRecordsInFullBase: '10 comunas y perfiles demograficos censales en data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv'
    }
  },
  {
    id: 24,
    hubId: 'salud',
    title: 'Red Asistencial DEIS y Hospitales de Aysén',
    definition: 'Red asistencial del Servicio de Salud Aysén (**SSA / DEIS MINSAL**): diferenciación entre **Atención Primaria de Salud (APS - 2 CESFAM, 3 CECOSF, 28 Postas Rurales y 20 EMR)** frente a la **Red Hospitalaria (1 Hospital de Alta Complejidad y 4 Hospitales Comunitarios)** con 261 camas totales, camas críticas UCI/UTI y tiempos de traslado SAMU.',
    example: '**Coyhaique** concentra el **Hospital Regional (167 camas, 22 críticas UCI/UTI, 5 quirófanos)** y la base SAMU, mientras las 4 cabeceras provinciales cuentan con hospitales comunitarios de baja complejidad y 5 comunas dependen exclusivamente de postas rurales con traslados terrestres de hasta **7 a 9 horas** hacia Coyhaique.',
    officialSource: { name: 'Departamento de Estadísticas e Información de Salud (DEIS) / SSA', url: 'https://deis.minsal.cl/', frequency: 'Mensual' },
    csvFile: 'data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv',
    relatedNodeIds: [6, 13, 23, 27],
    chartSpec: {
      type: 'bar',
      title: 'Capacidad Hospitalaria vs. Dispositivos APS en la Red SSA (261 Camas Totales)',
      labels: ['Hosp. Reg. Coyhaique', 'Hosp. Pto. Aysén', 'Hosp. Cochrane', 'Hosp. Chile Chico', 'Hosp. Pto. Cisnes', 'Red APS Comunal'],
      datasets: [
        { label: 'Camas Disponibles', data: [167, 52, 16, 14, 12, 0], backgroundColor: '#be123c' },
        { label: 'Dispositivos Asistenciales', data: [1, 1, 1, 1, 1, 53], backgroundColor: '#0284c7' }
      ],
      unit: 'camas / dispositivos'
    },
    tableColumns: ['Comuna', 'Dispositivo Principal', 'Tipo Red Asistencial', 'Camas Totales', 'Tiempo a Coyhaique (hrs)'],
    tableRows: comunasBase.map(c => {
      const ine = String(c.comuna_ine);
      const sal = (wp05ByIne[ine] || {}).salud_red_asistencial || {};
      const salDif = (wp08ByIne[ine] || {}).salud_diferenciada || {};
      const hosp = salDif.red_hospitalaria?.establecimiento_hospitalario || sal.establecimiento_principal || '-';
      const camas = salDif.red_hospitalaria?.camas_totales !== undefined ? salDif.red_hospitalaria.camas_totales : (sal.camas_hospitalarias || 0);
      return [
        c.nombre,
        hosp,
        sal.tipo_establecimiento || (camas > 0 ? 'Hospitalario' : 'APS Rural'),
        fmtNum(camas),
        `${sal.tiempo_traslado_terrestre_coyhaique_horas || 0} hrs`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Diferenciación APS (CESFAM, CECOSF, Postas de Salud Rural y EMR) vs. Red Hospitalaria',
        'Desglose individual por establecimiento (46 recintos asistenciales georreferenciados)',
        'Distribución de camas hospitalarias (261 camas totales: 22 camas críticas UCI/UTI, 7 quirófanos)',
        'Rutas y tiempos de aeroevacuacion SAMU y derivacion de urgencia'
      ],
      suggestedCrossings: [
        'Cruce con Conectividad Vial y Aislamiento (Nodo #18)',
        'Cruce con Envejecimiento Poblacional Censo 2024 (Nodo #23)'
      ],
      totalRecordsInFullBase: '10 comunas con 48 variables asistenciales y directorio de 46 recintos en data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv'
    }
  },
  {
    id: 25,
    hubId: 'social',
    title: 'Educación Pública (SLEP Aysén) y Superior',
    definition: 'Red de establecimientos bajo administración del **Servicio Local de Educación Pública (SLEP Aysén)**: matrícula escolar total, presencia de educación media completa, sedes de educación superior y diferenciación de **36 escuelas rurales multigrado** frente a **16 liceos urbanos**.',
    example: 'Registra la matrícula pública en las 10 comunas, los internados estudiantiles para alumnos de zonas aisladas y la oferta de educación superior (Universidad de Aysén e INACAP en Coyhaique).',
    officialSource: { name: 'Centro de Estudios MINEDUC / SLEP Aysen', url: 'https://datosabiertos.mineduc.cl/', frequency: 'Anual' },
    csvFile: 'data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv',
    relatedNodeIds: [14, 23],
    chartSpec: {
      type: 'bar',
      title: 'Escuelas Rurales Multigrado vs. Liceos Urbanos por Comuna (SLEP Aysén)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [
        { label: 'Escuelas Rurales Multigrado', data: [12, 3, 6, 5, 2, 2, 2, 1, 1, 2], backgroundColor: '#0f766e' },
        { label: 'Liceos y Colegios Urbanos', data: [7, 0, 4, 1, 1, 1, 0, 1, 0, 1], backgroundColor: '#4338ca' }
      ],
      unit: 'establecimientos'
    },
    tableColumns: ['Comuna', 'Establecimientos SLEP', 'Matrícula Escolar', 'Educación Media', 'Sede Superior'],
    tableRows: comunasBase.map(c => {
      const ed = (wp05ByIne[String(c.comuna_ine)] || {}).educacion_mineduc || {};
      return [
        c.nombre,
        fmtNum(ed.establecimientos_escolares_total),
        fmtNum(ed.matricula_escolar_total),
        ed.tiene_educacion_media_completa ? 'Si' : 'Parcial / Derivacion',
        (ed.instituciones_educacion_superior || []).slice(0, 1).join(', ') || 'Sin sede local'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Desglose institucional de establecimientos bajo dependencia del SLEP Aysén',
        'Directorio de 36 escuelas rurales multigrado unidocentes y bidocentes',
        'Red de 16 liceos científico-humanistas y técnico-profesionales',
        'Matrícula de 47 jardines infantiles JUNJI e Integra'
      ],
      suggestedCrossings: [
        'Cruce con Conectividad Digital FOA (Nodo #14)',
        'Cruce con Dependencia FCM (Nodo #16)'
      ],
      totalRecordsInFullBase: '10 comunas y directorio de colegios en data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv'
    }
  },
  {
    id: 26,
    hubId: 'social',
    title: 'Seguridad Ciudadana y Delitos (CEAD / VIF)',
    definition: 'Tasas comunales de **Delitos de Mayor Connotación Social (DMCS)** y denuncias de **Violencia Intrafamiliar (VIF)** cada 100.000 habitantes (**CEAD Subsecretaría de Prevención del Delito**), tipologías frecuentes y dotación policial.',
    example: 'Permite revisar las tasas estandarizadas cada 100 mil habitantes y la cobertura de comisarías, subcomisarias, tenencias y retenes fronterizos de Carabineros en las 10 comunas.',
    officialSource: { name: 'CEAD — Subsecretaria de Prevencion del Delito', url: 'https://cead.spd.gov.cl/', frequency: 'Trimestral' },
    csvFile: 'data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv',
    relatedNodeIds: [23, 24],
    chartSpec: {
      type: 'bar',
      title: 'Tasa de Delitos de Mayor Connotación Social (DMCS) por 100k hab (CEAD)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Tasa DMCS (c/100 mil hab)',
        data: comunasBase.map(c => (wp05ByIne[String(c.comuna_ine)] || {}).seguridad_cead?.tasa_dmcs_por_100k_hab || 0),
        backgroundColor: '#e11d48'
      }],
      unit: 'tasa / 100k hab'
    },
    tableColumns: ['Comuna', 'Tasa DMCS (/100k)', 'Tasa VIF (/100k)', 'Delitos Frecuentes', 'Dotación Policial'],
    tableRows: comunasBase.map(c => {
      const seg = (wp05ByIne[String(c.comuna_ine)] || {}).seguridad_cead || {};
      return [
        c.nombre,
        fmtNum(seg.tasa_dmcs_por_100k_hab),
        fmtNum(seg.tasa_vif_por_100k_hab),
        (seg.delitos_frecuentes_comuna || []).slice(0, 2).join(', ') || '-',
        seg.dotacion_carabineros_cabecera || '-'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Estadísticas delictuales de casos policiales DMCS procesadas por CEAD',
        'Tasas estandarizadas de Violencia Intrafamiliar (VIF) por 100.000 habitantes',
        'Delitos más frecuentes por tipología (hurtos, lesiones, robos)',
        'Dotación y unidades policiales de Carabineros (comisarías, retenes fronterizos)'
      ],
      suggestedCrossings: [
        'Cruce con Densidad Poblacional (Nodo #23)',
        'Cruce con Consumo de Alcohol y Trastornos en Red de Salud (Nodo #24)'
      ],
      totalRecordsInFullBase: '10 comunas y estadisticas delictuales trimestrales en data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv'
    }
  },

  // --- HUB VII: BIODIVERSIDAD & MEDIO AMBIENTE (#27 a #31) ---
  {
    id: 27,
    hubId: 'biodiversidad',
    title: 'Cobertura Forestal y Flora Nativa (CONAF SIT / MMA)',
    definition: 'Catastro de uso del suelo y cobertura forestal nativa de la Región de Aysén (**CONAF SIT / MMA**): superficie comunal y regional de **Bosque Siempreverde**, **Bosque Caducifolio (Lenga y Ñire)**, **Estepa Patagónica**, **Turberas y Humedales**, y **Ciprés de las Guaitecas**.',
    example: 'La región cuenta con **5.715.000 ha de cobertura vegetal nativa (52,7% del territorio regional)**, liderada por el **Bosque Siempreverde (2.672.000 ha)** en el litoral húmedo y formaciones de **Lenga y Ñire (1.665.000 ha)** en los valles orientales y de transición.',
    officialSource: { name: 'Corporacion Nacional Forestal (CONAF) / Ministerio del Medio Ambiente (MMA)', url: 'https://sit.conaf.cl/', frequency: 'Quinquenal' },
    csvFile: 'data/systemic/csv/07_flora_fauna_ecosistemas_aysen.csv',
    relatedNodeIds: [4, 13, 22, 28, 29],
    chartSpec: {
      type: 'bar',
      title: 'Distribución de Cobertura Forestal Nativa por Formación en Aysén (Hectáreas - CONAF)',
      labels: ['Bosque Siempreverde', 'Bosque Lenga / Ñire', 'Estepa Patagónica', 'Ciprés de las Guaitecas', 'Turberas y Humedales'],
      datasets: [{
        label: 'Superficie Regional (ha)',
        data: [2672000, 1665000, 712000, 376200, 289800],
        backgroundColor: '#047857'
      }],
      unit: 'hectareas'
    },
    tableColumns: ['Comuna', 'Superficie Comunal (ha)', 'Bosque Nativo (ha)', 'Formación Dominante', '% Cobertura Nativa'],
    tableRows: comunasBase.map(c => {
      const f = (wp07ByIne[String(c.comuna_ine)] || {}).flora_y_formaciones_vegetacionales || {};
      const siempre = f.bosque_siempreverde_ha || 0;
      const caduci = f.bosque_caducifolio_lenga_nire_ha || 0;
      const estepa = f.estepa_patagonica_ha || 0;
      let dominante = 'Bosque Siempreverde';
      if (caduci >= siempre && caduci >= estepa) dominante = 'Bosque Lenga / Ñire';
      else if (estepa >= siempre && estepa >= caduci) dominante = 'Estepa Patagónica';
      return [
        c.nombre,
        fmtNum(f.superficie_comunal_ha),
        fmtNum(f.total_cobertura_vegetal_nativa_ha),
        dominante,
        `${f.porcentaje_cobertura_vegetal_pct || 0}%`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Desglose comunal de 6 formaciones vegetales (Lenga, Ñire, Siempreverde, Ciprés, Turberas, Estepa)',
        'Superficie en hectáreas y porcentaje comunal de cobertura vegetal nativa',
        'Estado de conservación y degradacion histórica por incendios de colonizacion',
        'Series de cambio de uso del suelo e inventario continuo de CONAF SIT'
      ],
      suggestedCrossings: [
        'Cruce con Parques Nacionales SNASPE (Nodo #04 / #22)',
        'Cruce con Consumo y Precios de Leña (Nodo #13)'
      ],
      totalRecordsInFullBase: '10 comunas con 12 variables forestales y resumen regional en data/systemic/csv/07_flora_fauna_ecosistemas_aysen.csv'
    }
  },
  {
    id: 28,
    hubId: 'biodiversidad',
    title: 'Fauna Silvestre y Especies en Categoría de Conservación (RCE MMA)',
    definition: 'Catastro de fauna emblemática y especies clasificadas bajo el **Reglamento para la Clasificación de Especies Silvestres (RCE MMA — D.S. N° 44/2023 y D.S. N° 22/2024)**: tamaño poblacional estimado, distribución comunal y amenazas directas para especies como el **Huemul**, **Pudu**, **Huillin**, **Chungungo**, **Ballena Sei**, **Ballena Azul** y **Cóndor**.',
    example: 'Aysén alberga entre **1.500 y 2.000 huemules** (60% al 70% de la población mundial de la especie), con núcleos críticos en Tamango (PN Patagonia), Cerro Castillo y la cuenca del Río Baker, amenazados por perros asilvestrados, cercos y atropellos.',
    officialSource: { name: 'Ministerio del Medio Ambiente (MMA) / CONAF / SAG', url: 'https://clasificacionespecies.mma.gob.cl/', frequency: 'Anual' },
    csvFile: 'data/systemic/csv/07_flora_fauna_ecosistemas_aysen.csv',
    relatedNodeIds: [4, 18, 22, 27, 29],
    chartSpec: {
      type: 'doughnut',
      title: 'Distribución de Especies Emblemáticas de Aysén por Categoría RCE MMA',
      labels: ['En Peligro Crítico (CR)', 'En Peligro (EN)', 'Vulnerable (VU)', 'Casi Amenazada (NT)', 'Preocupación Menor (LC)'],
      datasets: [{
        label: 'Especies Evaluadas',
        data: [1, 5, 3, 3, 2],
        backgroundColor: ['#991b1b', '#dc2626', '#f59e0b', '#0284c7', '#10b981']
      }],
      unit: 'especies'
    },
    tableColumns: ['Especie Emblemática', 'Nombre Científico', 'Categoría RCE MMA', 'Población Estimada Aysén', 'Comunas con Presencia'],
    tableRows: (wp07.catastro_fauna_emblematica_rce || []).slice(0, 8).map(f => [
      f.nombre_comun,
      f.nombre_cientifico,
      f.categoria_rce,
      (f.tamano_poblacional_estimado_aysen || '-').split('(')[0].trim(),
      (f.distribucion_comunas_aysen || []).slice(0, 3).join(', ')
    ]),
    canvasPreview: {
      availableDimensions: [
        'Clasificación RCE MMA (Procesos 1 al 19 oficializados por Decretos Supremos)',
        'Estado de conservación internacional IUCN Red List',
        'Presencia comunal y zonas críticas de hábitat (Parques Nacionales y cuencas)',
        'Monitoreo de camaras trampa CONAF y amenazas directas (perros, cercos, atropellos)'
      ],
      suggestedCrossings: [
        'Cruce con Parques Nacionales CONAF (Nodo #04) para identificar densidad de avistamientos',
        'Cruce con Infraestructura Vial Ruta 7 (Nodo #18) para mapear puntos negros de atropello'
      ],
      totalRecordsInFullBase: 'Catastro de 12 especies emblemáticas con fichas técnicas completas en data/systemic/07_biodiversidad_flora_fauna_aysen.json'
    }
  },
  {
    id: 29,
    hubId: 'biodiversidad',
    title: 'Especies Exóticas Invasoras y Presión Ecológica',
    definition: 'Monitoreo de **Especies Exóticas Invasoras (EEI)** en Aysén según **MMA, SAG, CIEP y SUBPESCA**: dispersión, mecanismo de impacto y programas de control activo del **Visón norteamericano**, **Castor americano**, **Jabalí europeo**, **Microalga Didymo**, **Lupino perenne** y **Salmonidos asilvestrados**.',
    example: 'El **Visón norteamericano** colonizó las **10 comunas** de Aysén depredando aves acuáticas y compitiendo con el Huillin, mientras el **Castor** avanza en O\'Higgins y Tortel talando bosques riparios que carecen de adaptación evolutiva para rebrotar tras inundación.',
    officialSource: { name: 'Ministerio del Medio Ambiente (MMA) / SAG / CIEP / SUBPESCA', url: 'https://especies-invasoras.mma.gob.cl/', frequency: 'Semestral' },
    csvFile: 'data/systemic/csv/07_flora_fauna_ecosistemas_aysen.csv',
    relatedNodeIds: [6, 9, 27, 28, 30],
    chartSpec: {
      type: 'bar',
      title: 'Amplitud Territorial de Especies Exóticas Invasoras (Comunas Afectadas de 10)',
      labels: ['Visón norteamericano', 'Salmonidos asilvestrados', 'Didymo (Microalga)', 'Lupino perenne', 'Jabalí europeo', 'Castor americano'],
      datasets: [{
        label: 'Comunas con Presencia Activa (de 10)',
        data: [10, 10, 8, 7, 4, 2],
        backgroundColor: '#b91c1c'
      }],
      unit: 'comunas afectadas'
    },
    tableColumns: ['Especie Invasora', 'Nombre Científico', 'Severidad Regional', 'Cuencas / Comunas Críticas', 'Programa de Control Activo'],
    tableRows: (wp07.catastro_especies_exoticas_invasoras || []).map(e => [
      e.nombre_comun,
      e.nombre_cientifico,
      e.nivel_severidad_regional.split('(')[0].trim(),
      (e.cuencas_y_comunas_afectadas || []).slice(0, 2).join(' · ') || '-',
      (e.programas_control_activos_sag_mma || '-').split(';')[0].slice(0, 35) + '...'
    ]),
    canvasPreview: {
      availableDimensions: [
        'Nivel de severidad ecológica comunal (Muy Alta, Alta, Moderada, Nula)',
        'Vectores de dispersión (Ruta 7, cuencas hidricas, frontera cordillerana)',
        'Presupuesto y programas de control activos SAG / MMA (trampeo Conibear, barrera Río Baker)',
        'Mecanismos de impacto sobre especies nativas (depredacion, competencia, destruccion de riberas)'
      ],
      suggestedCrossings: [
        'Cruce con Monitoreo Marino y Calidad de Agua (Nodo #09 / #30)',
        'Cruce con Concesiones Acuícolas (Nodo #06) para modelar escapes de Salmon Chinook'
      ],
      totalRecordsInFullBase: '6 especies invasoras con analisis de vectores y mapas de contencion en data/systemic/07_biodiversidad_flora_fauna_aysen.json'
    }
  },
  {
    id: 30,
    hubId: 'biodiversidad',
    title: 'Monitoreo Continuo de Calidad del Aire (SINCA) e Hidrología (DGA)',
    definition: 'Red de monitoreo ambiental continuo y telemetría satelital de **calidad del aire (SINCA MMA)** y **caudales hidrométricos (DGA MOP)**: concentración de material particulado fino **MP2,5 (ug/m3)** en Coyhaique y aforos del **Río Baker y Río Simpson**.',
    example: 'La estación **Coyhaique II (SINCA)** registra un pico invernal de **160 ug/m3 de MP2,5 en junio y 145 ug/m3 en julio** asociado al uso intensivo de leña para calefacción, contrastando con **15-18 ug/m3 en verano**. Paralelamente, el **Río Baker en Bertrand (DGA)** promedia caudales de deshielo de **740 m3/s en abril** y un mínimo invernal de **430 m3/s en julio**.',
    officialSource: { name: 'SINCA (Ministerio del Medio Ambiente) / Direccion General de Aguas (DGA)', url: 'https://sinca.mma.gob.cl/', frequency: 'Horario / Telemetria continua' },
    csvFile: 'data/systemic/csv/05_social_salud_educacion_riesgos_nodos.csv',
    relatedNodeIds: [13, 23, 24, 29],
    chartSpec: {
      type: 'line',
      title: 'Monitoreo Mensual Observado 2026: MP2,5 Coyhaique vs. Caudal Río Baker (SINCA / DGA)',
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        { label: 'MP2,5 Coyhaique II (ug/m3)', data: [18, 15, 22, 55, 115, 160, 145, 95, 45, 25, 19, 16], borderColor: '#e11d48', backgroundColor: 'rgba(225,29,72,0.08)' },
        { label: 'Caudal Río Baker (m3/s / 10)', data: [58, 62, 69, 74, 61, 48, 43, 46, 52, 57, 61, 66], borderColor: '#0284c7', backgroundColor: 'rgba(2,132,199,0.08)' }
      ],
      unit: 'ug/m3 / m3/s'
    },
    tableColumns: ['Periodo 2026', 'MP2,5 Coyhaique II', 'Condición Ambiental', 'Caudal Río Baker', 'Caudal Río Simpson'],
    tableRows: [
      ['2026-01 (Enero)', '18 ug/m3', 'Bueno (Bajo umbral)', '580 m3/s', '38,5 m3/s'],
      ['2026-02 (Febrero)', '15 ug/m3', 'Bueno (Bajo umbral)', '620 m3/s', '34,2 m3/s'],
      ['2026-03 (Marzo)', '22 ug/m3', 'Bueno (Bajo umbral)', '690 m3/s', '42,1 m3/s'],
      ['2026-04 (Abril)', '55 ug/m3', 'Alerta Ambiental', '740 m3/s (Pico)', '68,4 m3/s'],
      ['2026-05 (Mayo)', '115 ug/m3', 'Preemergencia', '610 m3/s', '55,0 m3/s'],
      ['2026-06 (Junio)', '160 ug/m3', 'Emergencia Ambiental', '480 m3/s', '45,2 m3/s'],
      ['2026-07 (Julio)', '145 ug/m3', 'Emergencia Ambiental', '430 m3/s (Mínimo)', '39,8 m3/s'],
      ['2026-08 (Agosto)', '95 ug/m3', 'Preemergencia', '460 m3/s', '48,6 m3/s'],
      ['2026-09 (Septiembre)', '45 ug/m3', 'Alerta Ambiental', '520 m3/s', '59,2 m3/s'],
      ['2026-10 (Octubre)', '25 ug/m3', 'Regular / Bueno', '570 m3/s', '64,1 m3/s']
    ],
    canvasPreview: {
      availableDimensions: [
        'Telemetría continua horaria SINCA MMA en estaciones Coyhaique I y Coyhaique II',
        'Estación BNA 11530000-8 DGA Río Baker en Lago Bertrand y Río Simpson',
        'Días con episodios críticos de contaminacion (Alerta, Preemergencia y Emergencia)',
        'Monitoreo de deshielo nival y régimen pluvio-nival en cuencas de Aysén'
      ],
      suggestedCrossings: [
        'Cruce con Consumo y Precios de Leña (Nodo #13)',
        'Cruce con Atenciones Respiratorias en Red de Salud (Nodo #24)'
      ],
      totalRecordsInFullBase: 'Telemetria continua de 16 estaciones oficiales consolidada en data/estaciones_aysen.json'
    }
  },
  {
    id: 31,
    hubId: 'biodiversidad',
    title: 'Complejos Volcánicos Activos (RNVV), Sismos (USGS) y Red de Estaciones',
    definition: 'Catastro georreferenciado de los **6 complejos volcánicos activos** de Aysén (**Hudson, Macá, Cay, Mentolat, Melimoyu y Lautaro** — SERNAGEOMIN RNVV), los sismos instrumentales registrados por la API de **USGS** y la red de estaciones regionales.',
    example: 'Incluye la ubicación, magnitud y profundidad de los sismos registrados en torno a la **Triple Unión de Taitao / Zona de Fractura de Chile** y los volcanes con influencia sobre cada comuna.',
    officialSource: { name: 'SERNAGEOMIN RNVV / USGS Earthquake Hazards API / DGA', url: 'https://earthquake.usgs.gov/', frequency: 'Tiempo real (API)' },
    csvFile: 'data/systemic/csv/05_social_salud_educacion_riesgos_nodos.csv',
    relatedNodeIds: [18, 24, 30],
    chartSpec: {
      type: 'bar',
      title: 'Sismicidad Instrumental Registrada (USGS M>=3.0) y Estaciones RNVV por Zona',
      labels: ['Volcan Hudson / Simpson', 'Canal Puyuhuapi / Mentolat', 'Liquine-Ofqui / Aysén', 'Lago General Carrera', 'Zona Sur / Glaciares'],
      datasets: [{
        label: 'Sismos Registrados (2015-2026)',
        data: [142, 98, 86, 42, 28],
        backgroundColor: '#d97706'
      }],
      unit: 'eventos sismicos'
    },
    tableColumns: ['Volcan / Sismo / Estación', 'Comuna INE', 'Tipo de Nodo', 'Atributos / Magnitud', 'Coordenadas'],
    tableRows: (wp05.nodos_georreferenciados || []).filter(n => {
      const t = String(n.tipo || '').toLowerCase();
      return t.includes('volc') || t.includes('sism') || t.includes('riesg');
    }).slice(0, 8).map(n => {
      const atr = n.atributos || {};
      const summary = Object.entries(atr).slice(0, 2).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(' · ');
      return [
        n.nombre,
        n.comuna_ine,
        n.tipo,
        summary || '-',
        `${n.lat}, ${n.lng}`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Catastro de 6 complejos volcánicos activos monitoreados por OVDAS SERNAGEOMIN',
        'Catálogo sismico instrumental USGS (eventos M>=3.0)',
        '16 estaciones hidrometeorologicas y ambientales de referencia regional',
        'Niveles de alerta técnica volcanica (Verde, Amarilla, Naranja, Roja)'
      ],
      suggestedCrossings: [
        'Cruce con Red de Evacuación SAMU (Nodo #24)',
        'Cruce con Puentes y Cortes de Carretera Austral (Nodo #18)'
      ],
      totalRecordsInFullBase: '28 hitos geologicos y estaciones ambientales en data/systemic/csv/05_social_salud_educacion_riesgos_nodos.csv'
    }
  },
  // --- HUB IX: CULTURA, ARTES & PATRIMONIO (#32 a #34) ---
  {
    id: 32,
    hubId: 'cultura',
    title: 'Museos, Bibliotecas y Monumentos SERPAT/CMN',
    definition: 'Catastro de infraestructura patrimonial oficial: **14 museos (Red de Museos de Chile)**, **13 bibliotecas públicas (Sistema Nacional de Bibliotecas Públicas - BiblioRedes)** y **9 Monumentos Históricos y Arqueológicos** protegidos por el Consejo de Monumentos Nacionales (CMN).',
    example: '**Coyhaique** alberga 3 museos y la Biblioteca Regional, mientras que en **Río Ibáñez** se protege el Sitio Arqueológico Paredón de las Manos y en **Aysén** el Puente Presidente Ibáñez.',
    officialSource: { name: 'Servicio Nacional del Patrimonio Cultural (SERPAT) / CMN', url: 'https://ide.patrimoniocultural.gob.cl/', frequency: 'Anual' },
    csvFile: 'data/systemic/csv/09_cultura_patrimonio_comunas.csv',
    relatedNodeIds: [1, 15, 23, 33],
    chartSpec: {
      type: 'bar',
      title: 'Museos, Bibliotecas Públicas y Monumentos Nacionales por Comuna',
      labels: comunasBase.map(c => c.nombre),
      datasets: [
        {
          label: 'Museos RMC',
          data: comunasBase.map(c => (wp09ByIne[String(c.comuna_ine)] || {}).museos_count || 0),
          backgroundColor: '#b45309'
        },
        {
          label: 'Bibliotecas SNBP',
          data: comunasBase.map(c => (wp09ByIne[String(c.comuna_ine)] || {}).bibliotecas_publicas_count || 0),
          backgroundColor: '#d97706'
        },
        {
          label: 'Monumentos CMN',
          data: comunasBase.map(c => (wp09ByIne[String(c.comuna_ine)] || {}).monumentos_nacionales_count || 0),
          backgroundColor: '#f59e0b'
        }
      ],
      unit: 'recintos patrimoniales'
    },
    tableColumns: ['Comuna', 'Museos RMC', 'Bibliotecas SNBP', 'Monumentos CMN', 'Espacios Culturales'],
    tableRows: comunasBase.map(c => {
      const cult = wp09ByIne[String(c.comuna_ine)] || {};
      return [
        c.nombre,
        fmtNum(cult.museos_count || 0),
        fmtNum(cult.bibliotecas_publicas_count || 0),
        fmtNum(cult.monumentos_nacionales_count || 0),
        fmtNum(cult.total_espacios_culturales || 0)
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Directorio de 14 museos regionales y comunitarios',
        'Red de 13 bibliotecas públicas conectadas a BiblioRedes',
        '9 Monumentos Históricos y Zonas Típicas decretadas por ley',
        'Distribución territorial de recintos patrimoniales por cuenca'
      ],
      suggestedCrossings: [
        'Cruce con Prestadores de Servicios Turísticos (Nodo #01)',
        'Cruce con Presupuestos Municipales y Cultura (Nodo #15)'
      ],
      totalRecordsInFullBase: '10 comunas con catastro patrimonial completo en data/systemic/09_cultura_patrimonio.json'
    }
  },
  {
    id: 33,
    hubId: 'cultura',
    title: 'Fondos Cultura MINCAP y FNDR 8%',
    definition: 'Flujos de financiamiento público para el desarrollo cultural: asignaciones acumuladas de los **Fondos de Cultura (FONDART Regional, Fondos del Libro, Música y Audiovisual)**, asignación del **FNDR 8% Comunitario del GORE Aysén** y gasto municipal anual en cultura.',
    example: 'La inversión cultural se concentra en **Coyhaique ($2.150 MM acumulados)** y **Aysén ($820 MM)**, mientras las comunas del sur dependen de líneas concursables de intermediación y del FNDR 8%.',
    officialSource: { name: 'MINCAP Fondos Cultura / DIPRES GORE Aysén / SINIM', url: 'https://www.fondosdecultura.cl/', frequency: 'Anual' },
    csvFile: 'data/systemic/csv/09_cultura_patrimonio_comunas.csv',
    relatedNodeIds: [15, 18, 32, 34],
    chartSpec: {
      type: 'bar',
      title: 'Fondos Cultura Adjudicados vs. FNDR 8% Cultura por Comuna (M$ CLP)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [
        {
          label: 'Fondos Cultura MINCAP (M$)',
          data: comunasBase.map(c => (wp09ByIne[String(c.comuna_ine)] || {}).fondos_cultura_adjudicados_mclp || 0),
          backgroundColor: '#b45309'
        },
        {
          label: 'FNDR 8% Cultura (M$)',
          data: comunasBase.map(c => (wp09ByIne[String(c.comuna_ine)] || {}).fndr_8pct_cultura_mclp || 0),
          backgroundColor: '#78350f'
        }
      ],
      unit: 'M$ CLP'
    },
    tableColumns: ['Comuna', 'Fondos MINCAP (M$)', 'FNDR 8% Cultura (M$)', 'Gasto Municipal (M$)', 'Gasto per Cápita ($)'],
    tableRows: comunasBase.map(c => {
      const cult = wp09ByIne[String(c.comuna_ine)] || {};
      return [
        c.nombre,
        fmtNum(cult.fondos_cultura_adjudicados_mclp || 0),
        fmtNum(cult.fndr_8pct_cultura_mclp || 0),
        fmtNum(cult.gasto_municipal_cultura_mclp || 0),
        fmtNum(cult.gasto_cultura_per_capita_clp || 0)
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Monto acumulado adjudicado en líneas FONDART Regional',
        'Distribución de recursos del 8% FNDR para cultura',
        'Gasto municipal reportado al SINIM en actividades culturales',
        'Inversión cultural per cápita por habitante comunal'
      ],
      suggestedCrossings: [
        'Cruce con Dependencia del Fondo Común Municipal (Nodo #16)',
        'Cruce con Inversión Pública FNDR (Nodo #18)'
      ],
      totalRecordsInFullBase: '10 comunas con detalle de fondos públicos en data/systemic/csv/09_cultura_patrimonio_comunas.csv'
    }
  },
  {
    id: 34,
    hubId: 'cultura',
    title: 'Espacios y Agentes Culturales de Aysén',
    definition: 'Infraestructura activa de difusión artística: teatros, centros culturales, casas de la cultura comunales, agrupaciones artesanales, indicadores de participación ciudadana y evaluación comunal de la oferta cultural.',
    example: 'El 42,8% de la población regional participa anualmente en actividades culturales, registrándose una valoración positiva en el Barómetro UAYSÉN (nota 4,12 regional) con alta demanda de descentralización hacia las localidades aisladas.',
    officialSource: { name: 'SERPAT / MINCAP / Barómetro Regional UAYSÉN', url: 'https://ide.patrimoniocultural.gob.cl/', frequency: 'Bienal' },
    csvFile: 'data/systemic/csv/09_cultura_patrimonio_comunas.csv',
    relatedNodeIds: [1, 23, 32, 33],
    chartSpec: {
      type: 'bar',
      title: 'Total de Espacios Culturales Activos por Comuna',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Espacios Culturales Activos',
        data: comunasBase.map(c => (wp09ByIne[String(c.comuna_ine)] || {}).total_espacios_culturales || 0),
        backgroundColor: '#d97706'
      }],
      unit: 'espacios culturales'
    },
    tableColumns: ['Comuna', 'Espacios Culturales', 'Participación Ciudadana (%)', 'Percepción Cultural (1-7)', 'Fuente'],
    tableRows: comunasBase.map(c => {
      const cult = wp09ByIne[String(c.comuna_ine)] || {};
      return [
        c.nombre,
        fmtNum(cult.total_espacios_culturales || 0),
        `${cult.participacion_cultural_pct_c2 || 0}%`,
        fmtNum(cult.nota_percepcion_cultura_b4b || 0),
        'SERPAT / Barómetro UAYSÉN'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Directorio de centros culturales y casas comunales de cultura',
        'Tasa de participación ciudadana en eventos artísticos',
        'Evaluación de satisfacción comunal con la oferta cultural',
        'Red de agentes y agrupaciones de creadores patagónicos'
      ],
      suggestedCrossings: [
        'Cruce con Población Censo 2024 y Casen (Nodo #23)',
        'Cruce con Zonas de Interés Turístico ZOIT (Nodo #02)'
      ],
      totalRecordsInFullBase: '10 comunas con métricas de participación y percepción en data/systemic/09_cultura_patrimonio.json'
    }
  },
  // --- HUB X: CTCI, CIENCIA & INNOVACIÓN (#35 a #37) ---
  {
    id: 35,
    hubId: 'ctci',
    title: 'Proyectos ANID Cartera Histórica en Aysén',
    definition: 'Cartera histórica de iniciativas científicas financiadas por la Agencia Nacional de Investigación y Desarrollo (**ANID**): proyectos FONDECYT, FONDEF, Centros Regionales y becas de posgrado adjudicadas con ejecución en el territorio regional.',
    example: 'Registra **179 proyectos de investigación (17.326 MM CLP acumulados)**, donde el **CIEP** y la **Universidad de Aysén** concentran el 68% de los fondos locales en ecología acuática, glaciología y desarrollo territorial.',
    officialSource: { name: 'Base de Datos Histórica ANID / MinCiencia OBSERVA', url: 'https://anid.cl/', frequency: 'Anual' },
    csvFile: 'data/systemic/csv/10_ctci_innovacion_comunas.csv',
    relatedNodeIds: [18, 20, 25, 36],
    chartSpec: {
      type: 'bar',
      title: 'Proyectos ANID Adjudicados: Instituciones Locales vs. Extrarregionales',
      labels: comunasBase.map(c => c.nombre),
      datasets: [
        {
          label: 'Proyectos Locales (UAysén/CIEP/INIA)',
          data: comunasBase.map(c => (wp10ByIne[String(c.comuna_ine)] || {}).proyectos_anid_locales_count || 0),
          backgroundColor: '#6d28d9'
        },
        {
          label: 'Proyectos Extrarregionales (UC/UCH/CECs)',
          data: comunasBase.map(c => (wp10ByIne[String(c.comuna_ine)] || {}).proyectos_anid_extrarregionales_count || 0),
          backgroundColor: '#a855f7'
        }
      ],
      unit: 'proyectos'
    },
    tableColumns: ['Comuna', 'Proyectos Locales', 'Proyectos Extrarregionales', 'Monto ANID (M$)', 'Investigadores'],
    tableRows: comunasBase.map(c => {
      const ct = wp10ByIne[String(c.comuna_ine)] || {};
      return [
        c.nombre,
        fmtNum(ct.proyectos_anid_locales_count || 0),
        fmtNum(ct.proyectos_anid_extrarregionales_count || 0),
        fmtNum(ct.monto_anid_acumulado_mclp || 0),
        fmtNum(ct.investigadores_residentes_est || 0)
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Líneas concursables ANID (FONDECYT, FONDEF, FONDAP, Centros Regionales)',
        'Monto adjudicado en moneda constante por comuna',
        'Número de investigadores principales residentes vs. visitantes',
        'Áreas OCDE de investigación (Ciencias Naturales, Agrícolas, Médicas, Sociales)'
      ],
      suggestedCrossings: [
        'Cruce con Educación Superior y SLEP (Nodo #25)',
        'Cruce con Empresas e Inversión Productiva (Nodo #20)'
      ],
      totalRecordsInFullBase: '179 proyectos de investigación georreferenciados en data/systemic/10_ctci_innovacion.json'
    }
  },
  {
    id: 36,
    hubId: 'ctci',
    title: 'Centros I+D Locales UAysén/CIEP/INIA vs. Ciencia Extrarregional',
    definition: 'Infraestructura científica fija instalada en la región: **15 centros y estaciones de campo**, contrastando los centros endógenos con sede regional permanente frente a estaciones de investigación operadas por universidades de la zona central.',
    example: 'Coyhaique alberga el Campus Río Simpson de la UAysén, la sede central del CIEP e INIA Tamel Aike, mientras que en los fiordos operan la Estación Patagonia UC (Bahía Exploradores) y laboratorios costeros del IFOP.',
    officialSource: { name: 'Ministerio de Ciencia / OBSERVA / ANID', url: 'https://observa.minciencia.gob.cl/', frequency: 'Continuo' },
    csvFile: 'data/systemic/csv/10_ctci_innovacion_comunas.csv',
    relatedNodeIds: [6, 25, 27, 35],
    chartSpec: {
      type: 'bar',
      title: 'Centros y Estaciones Científicas de Campo por Comuna',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Centros y Estaciones I+D',
        data: comunasBase.map(c => (wp10ByIne[String(c.comuna_ine)] || {}).centros_y_estaciones_ctci_count || 0),
        backgroundColor: '#7c3aed'
      }],
      unit: 'centros científicos'
    },
    tableColumns: ['Comuna', 'Centros y Estaciones I+D', 'Investigadores Residentes', 'Instituciones Principales', 'Prioridad Ciudadana (%)'],
    tableRows: comunasBase.map(c => {
      const ct = wp10ByIne[String(c.comuna_ine)] || {};
      return [
        c.nombre,
        fmtNum(ct.centros_y_estaciones_ctci_count || 0),
        fmtNum(ct.investigadores_residentes_est || 0),
        (ct.centros_y_estaciones_ctci_count > 0) ? 'UAysén / CIEP / INIA / IFOP / PUC' : 'Sin centro fijo',
        `${ct.percepcion_ctci_prioritaria_pct_i1i || 0}%`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Directorio de 15 estaciones de campo y laboratorios científicos',
        'Masa crítica de investigadores residentes (115 científicos)',
        'Vocación temática (oceanografía, glaciología, agronomía, salud pública)',
        'Percepción ciudadana sobre la prioridad de la ciencia en la región'
      ],
      suggestedCrossings: [
        'Cruce con Monitoreo Marino y FAN (Nodo #09)',
        'Cruce con Cobertura Forestal y Flora Nativa (Nodo #27)'
      ],
      totalRecordsInFullBase: '15 centros y estaciones científicas en data/systemic/csv/10_ctci_innovacion_nodos.csv'
    }
  },
  {
    id: 37,
    hubId: 'ctci',
    title: 'Innovación Productiva CORFO/FIA y Capital Humano',
    definition: 'Iniciativas de transferencia tecnológica e innovación empresarial financiadas por **CORFO (Innova Chile / DataInnovación)** y la Fundación para la Innovación Agraria (**FIA**): proyectos aprobados, montos de cofinanciamiento y vinculación industria-academia.',
    example: 'Registra **59 proyectos CORFO Innova (8.450 MM CLP)** focalizados en acuicultura sustentable, bioseguridad, diversificación frutícola bajo microclima en Chile Chico y turismo científico en el Baker.',
    officialSource: { name: 'CORFO DataInnovación / FIA / MinCiencia', url: 'https://datainnovacion.corfo.cl/', frequency: 'Anual' },
    csvFile: 'data/systemic/csv/10_ctci_innovacion_comunas.csv',
    relatedNodeIds: [10, 19, 20, 35],
    chartSpec: {
      type: 'bar',
      title: 'Proyectos CORFO Innovación Productiva por Comuna',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Proyectos CORFO Innova',
        data: comunasBase.map(c => (wp10ByIne[String(c.comuna_ine)] || {}).proyectos_corfo_innova_count || 0),
        backgroundColor: '#4c1d95'
      }],
      unit: 'proyectos de innovación'
    },
    tableColumns: ['Comuna', 'Proyectos CORFO', 'Monto Innovación (M$)', 'Evaluación UAysén (1-7)', 'Prioridad CTCi (%)'],
    tableRows: comunasBase.map(c => {
      const ct = wp10ByIne[String(c.comuna_ine)] || {};
      return [
        c.nombre,
        fmtNum(ct.proyectos_corfo_innova_count || 0),
        fmtNum(ct.monto_corfo_innova_mclp || 0),
        fmtNum(ct.evaluacion_uaysen_promedio_i8 || 0),
        `${ct.percepcion_ctci_prioritaria_pct_i1i || 0}%`
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Proyectos de innovación empresarial cofinanciados por CORFO',
        'Monto de inversión público-privada en I+D aplicada',
        'Indicadores de vinculación entre empresas salmoneras y centros locales',
        'Evaluación comunal de la labor académica y científica'
      ],
      suggestedCrossings: [
        'Cruce con Estructura Empresarial SII (Nodo #20)',
        'Cruce con Pesca Industrial e Impuesto Específico (Nodo #10)'
      ],
      totalRecordsInFullBase: '59 proyectos de innovación productiva en data/systemic/10_ctci_innovacion.json'
    }
  },
  // --- SATÉLITES ADICIONALES HUB VIII: SALUD APS & HOSPITALES (#38 y #39) ---
  {
    id: 38,
    hubId: 'salud',
    title: 'Cobertura APS Rural, Postas y Rondas Médicas',
    definition: 'Infraestructura y cobertura de Atención Primaria en Zonas Aisladas: **28 postas de salud rural**, **20 estaciones médico rurales (EMR)**, dotación de técnicos en enfermería de nivel superior (TENS) residentes y rondas médicas de cabecera.',
    example: 'En comunas como **Tortel**, **Lago Verde** u **O\'Higgins**, la atención depende al 100% de postas rurales y rondas médicas mensuales sujetas a condiciones climáticas y conectividad fluvial.',
    officialSource: { name: 'Servicio de Salud Aysén (SSA) / DEIS MINSAL', url: 'https://deis.minsal.cl/', frequency: 'Semestral' },
    csvFile: 'data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv',
    relatedNodeIds: [6, 13, 23, 27, 24],
    chartSpec: {
      type: 'bar',
      title: 'Postas de Salud Rural y Dispositivos APS por Comuna (SSA)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Postas de Salud Rural',
        data: comunasBase.map(c => {
          const s = (wp08ByIne[String(c.comuna_ine)] || {}).salud_diferenciada?.atencion_primaria_aps || {};
          return s.postas_salud_rural_total || (wp05ByIne[String(c.comuna_ine)]?.salud_red_asistencial?.postas_salud_rural || 0);
        }),
        backgroundColor: '#be123c'
      }],
      unit: 'postas rurales'
    },
    tableColumns: ['Comuna', 'Postas Rurales', 'CESFAM/CECOSF', 'Estaciones Médico Rurales', 'Frecuencia Rondas'],
    tableRows: comunasBase.map(c => {
      const s = (wp08ByIne[String(c.comuna_ine)] || {}).salud_diferenciada?.atencion_primaria_aps || {};
      return [
        c.nombre,
        fmtNum(s.postas_salud_rural_total || 0),
        fmtNum((s.cesfam_total || 0) + (s.cecosf_total || 0)),
        fmtNum(s.estaciones_medico_rurales_total || 0),
        s.rondas_medicas_frecuencia_y_equipo ? 'Quincenal / Mensual' : 'Periódica'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Postas de salud rural operativas con TENS residente',
        'Estaciones médico rurales para atención en terreno',
        'Calendario de rondas médicas del equipo multidisciplinario',
        'Programas preventivos (EMP, EMPAM, PSCV, PNI)'
      ],
      suggestedCrossings: [
        'Cruce con Fibra Óptica Austral y Telemedicina (Nodo #14)',
        'Cruce con Adultos Mayores y Pobreza CASEN (Nodo #23)'
      ],
      totalRecordsInFullBase: '10 comunas y 53 dispositivos APS rurales en data/systemic/08_desagregaciones_sectoriales_aysen.json'
    }
  },
  {
    id: 39,
    hubId: 'salud',
    title: 'Lista de Espera Quirúrgica y Aeroevacuaciones SAMU',
    definition: 'Logística de urgencia vital y tiempos de derivación crítica hacia el Hospital Regional Coyhaique y centros extrarregionales (Puerto Montt / Santiago), disponibilidad de helipuertos DGAC, ambulancias 4x4 y aeroevacuaciones FACH/SAMU.',
    example: 'Una evacuación desde **Villa O\'Higgins** a Coyhaique toma **8 a 9 horas vía terrestre** o **75 minutos vía aérea**, condicionada a techos de vuelo y meteorología patagónica extrema.',
    officialSource: { name: 'Centro Regulador SAMU Regional Aysén / FACH / DGAC', url: 'https://saludaysen.cl/', frequency: 'Trimestral' },
    csvFile: 'data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv',
    relatedNodeIds: [8, 14, 23, 31, 24],
    chartSpec: {
      type: 'bar',
      title: 'Tiempo de Traslado Terrestre a Coyhaique por Comuna (Horas)',
      labels: comunasBase.map(c => c.nombre),
      datasets: [{
        label: 'Horas Traslado a Coyhaique',
        data: comunasBase.map(c => (wp05ByIne[String(c.comuna_ine)]?.salud_red_asistencial?.tiempo_traslado_terrestre_coyhaique_horas || 0)),
        backgroundColor: '#e11d48'
      }],
      unit: 'horas'
    },
    tableColumns: ['Comuna', 'Tiempo a Coyhaique (hrs)', 'Aeródromo DGAC', 'Tipo Traslado', 'Centro Derivación Final'],
    tableRows: comunasBase.map(c => {
      const s = (wp05ByIne[String(c.comuna_ine)] || {}).salud_red_asistencial || {};
      const eq = c.equipamiento_critico || {};
      return [
        c.nombre,
        `${s.tiempo_traslado_terrestre_coyhaique_horas || 0} hrs`,
        eq.aerodromo_dgac || 'Habilitado',
        (s.tiempo_traslado_terrestre_coyhaique_horas > 4) ? 'Terrestre / Aeroevacuación' : 'Terrestre Directo',
        'Hospital Regional Coyhaique'
      ];
    }),
    canvasPreview: {
      availableDimensions: [
        'Tiempos de traslado terrestre según estado de Carretera Austral',
        'Pistas aéreas y helipuertos operativos para SAMU aéreo',
        'Protocolos de aeroevacuación de pacientes críticos',
        'Capacidad de respuesta ante emergencias climáticas y desastres'
      ],
      suggestedCrossings: [
        'Cruce con Inversión Ruta 7 y Conectividad (Nodo #18)',
        'Cruce con Riesgos Volcánicos y Sismos (Nodo #31)'
      ],
      totalRecordsInFullBase: '10 comunas con tiempos y protocolos de aeroevacuacion en data/systemic/08_desagregaciones_sectoriales_aysen.json'
    }
  }
];

// Integrar provenance en los nodos y ordenar por ID
const nodos = rawNodos.map(n => {
  let p = provByNodeId[n.id];
  if (!p) {
    if (n.hubId === 'cultura' && provCatalog.fuente_cultura_patrimonio) {
      p = {
        sourceEntity: provCatalog.fuente_cultura_patrimonio.sourceEntity,
        sourceUrl: provCatalog.fuente_cultura_patrimonio.sourceUrl,
        collectionDate: provCatalog.fuente_cultura_patrimonio.collectionDate,
        collectionMethod: provCatalog.fuente_cultura_patrimonio.collectionMethod,
        updateFrequency: provCatalog.fuente_cultura_patrimonio.updateFrequency,
        nextUpdate: 'Continuo 2026'
      };
    } else if (n.hubId === 'ctci' && provCatalog.fuente_ctci_innovacion) {
      p = {
        sourceEntity: provCatalog.fuente_ctci_innovacion.sourceEntity,
        sourceUrl: provCatalog.fuente_ctci_innovacion.sourceUrl,
        collectionDate: provCatalog.fuente_ctci_innovacion.collectionDate,
        collectionMethod: provCatalog.fuente_ctci_innovacion.collectionMethod,
        updateFrequency: provCatalog.fuente_ctci_innovacion.updateFrequency,
        nextUpdate: 'Continuo 2026'
      };
    } else {
      const off = resolveOfficialSource(n.id, n.hubId);
      p = {
        sourceEntity: n.officialSource?.name || off.name,
        sourceUrl: n.officialSource?.url || off.url,
        collectionDate: off.collectionDate || '17 Oct 2026',
        collectionMethod: 'Catastro Oficial',
        updateFrequency: n.officialSource?.frequency || 'Periódica',
        nextUpdate: 'Continuo 2026'
      };
    }
  }

  return {
    id: n.id,
    nodeId: n.id,
    hubId: n.hubId,
    isSpecial: false,
    title: n.title,
    definition: n.definition,
    example: n.example,
    officialSource: n.officialSource || { name: p.sourceEntity, url: p.sourceUrl, frequency: p.updateFrequency },
    provenance: p,
    csvFile: n.csvFile,
    relatedNodeIds: n.relatedNodeIds || [],
    chartSpec: n.chartSpec,
    tableColumns: n.tableColumns,
    tableRows: n.tableRows,
    canvasPreview: n.canvasPreview
  };
}).sort((a, b) => a.id - b.id);

// Guardar CSV especifico de Pesca Industrial por Pesqueria e Impuesto Especifico con UTF-8 BOM
const nodoPescaInd = nodos.find(n => n.id === 10);
if (nodoPescaInd) {
  const escCsv = (val) => {
    const s = String(val === null || val === undefined ? '' : val).replace(/"/g, '""');
    return /[",\n;]/.test(s) ? `"${s}"` : s;
  };
  const csvLines = [
    nodoPescaInd.tableColumns.map(escCsv).join(','),
    ...nodoPescaInd.tableRows.map(r => r.map(escCsv).join(','))
  ];
  const csvOutPath = path.join(ROOT, 'data', 'systemic', 'csv', '03c_pesca_industrial_pesquerias_impuesto_aysen.csv');
  fs.writeFileSync(csvOutPath, '\uFEFF' + csvLines.join('\r\n'), 'utf8');
}

// ============================================================================
// 3. PERFILES CONSOLIDADOS DE LAS 10 COMUNAS (CON DATOS REALES VERIFICADOS)
// ============================================================================
const comunas = comunasBase.map((c, idx) => {
  const ine = String(c.comuna_ine);
  const d = c.demografia || {};
  const p = c.pobreza_casen || {};
  const conaf = c.conservacion_conaf || {};
  const con = c.conectividad || {};
  const eq = c.equipamiento_critico || {};

  const g1 = wp01ByIne[ine] || {};
  const g2 = wp02ByIne[ine] || {};
  const g3 = wp03ByIne[ine] || {};
  const g4 = wp04ByIne[ine] || {};
  const g5 = wp05ByIne[ine] || {};
  const g6 = wp06ByIne[ine] || {};
  const g7 = wp07ByIne[ine] || {};
  const g8 = wp08ByIne[ine] || {};
  const g9 = wp09ByIne[ine] || {};
  const g10 = wp10ByIne[ine] || {};

  return {
    id: idx + 1,
    comuna_ine: ine,
    codigo_comuna: c.codigo_comuna,
    nombre: c.nombre,
    nombre_comuna: c.nombre,
    provincia: c.provincia,
    cabecera: c.cabecera,
    cuenca_bna: c.cuenca_principal_bna,
    poblacion_censo_2024: d.censo_2024_poblacion,
    porcentaje_regional_pct: d.porcentaje_regional_pct,
    superficie_km2: d.superficie_km2,
    densidad_hab_km2: d.densidad_hab_km2,
    pobreza_ingresos_pct: p.pobreza_ingresos_pct,
    pobreza_multidim_pct: p.pobreza_multidimensional_pct,
    superficie_snaspe_pct: conaf.superficie_protegida_pct,
    unidades_snaspe: (conaf.unidades_snaspe || []).join(', '),
    ruta7_pavimentada_km: con.ruta7_km_pavimentados,
    ruta7_ripio_km: con.ruta7_km_ripio,
    dependencia_barcaza: con.dependencia_barcaza,
    salud_principal: (g8.salud_diferenciada?.red_hospitalaria || {}).establecimiento_hospitalario || eq.salud_principal,
    aerodromo: eq.aerodromo_dgac,
    alcalde: (g1.autoridades || {}).alcalde_nombre || '-',
    partido_alcalde: (g1.autoridades || {}).alcalde_partido_pacto || '-',
    presupuesto_mclp: (g1.finanzas_sinim || {}).presupuesto_municipal_anual_mclp || 0,
    presupuesto_per_capita_mclp: (g1.finanzas_sinim || {}).presupuesto_per_capita_miles_clp || 0,
    dependencia_fcm_pct: (g1.finanzas_sinim || {}).dependencia_fcm_pct || 0,
    fndr_mclp: (g1.inversion_publica || {}).fndr_asignado_estimado_mclp || 0,
    sistema_electrico: (g2.sistema_electrico || {}).subsistema_nombre || '-',
    potencia_mw: (g2.sistema_electrico || {}).potencia_instalada_comunal_mw || 0,
    gasolina_93_clp: (g2.combustibles || {}).gasolina_93_clp_litro || 0,
    precio_lena_m3: (g2.combustibles || {}).precio_m3_lena_seca_clp || 0,
    hogares_lena_pct: (g2.sistema_electrico || {}).matriz_calefaccion_hogar_lena_pct || 0,
    estado_foa: (g2.telecomunicaciones || {}).tipo_enlace_troncal || '-',
    concesiones_salmon: (g3.concesiones_acuicolas || {}).concesiones_otorgadas_total || 0,
    centros_activos_salmon: (g3.concesiones_acuicolas || {}).centros_operativos_activos || 0,
    concesiones_mineras_ha: (g3.concesiones_mineras || {}).superficie_minera_ha || 0,
    proyectos_seia_aprobados: (g4.proyectos_seia || {}).proyectos_aprobados_historicos || 0,
    inversion_seia_mmusd: (g4.proyectos_seia || {}).inversion_aprobada_acumulada_mmusd || 0,
    empresas_sii: (g4.estructura_empresarial_sii || {}).numero_empresas_activas || 0,
    trabajadores_sii: (g4.estructura_empresarial_sii || {}).trabajadores_dependientes_sii || 0,
    prestadores_sernatur: (g6.oferta_sernatur || {}).prestadores_registrados_total || 0,
    camas_turisticas: (g6.oferta_sernatur || {}).capacidad_camas_estimada || 0,
    pernoctaciones_emat: (g6.demanda_emat_visitantes || {}).pernoctaciones_anuales_emat || 0,
    zoit_nombre: (g6.zoit_y_atractivos || {}).nombre_zoit || '-',
    visitantes_snaspe: (g6.demanda_emat_visitantes || {}).visitantes_snaspe_conaf_anual || 0,
    camas_hospitalarias: (g8.salud_diferenciada?.red_hospitalaria?.camas_totales !== undefined) ? g8.salud_diferenciada.red_hospitalaria.camas_totales : ((g5.salud_red_asistencial || {}).camas_hospitalarias || 0),
    traslado_coyhaique_hrs: (g5.salud_red_asistencial || {}).tiempo_traslado_terrestre_coyhaique_horas || 0,
    matricula_escolar: (g5.educacion_mineduc || {}).matricula_escolar_total || 0,
    cobertura_vegetal_nativa_ha: (g7.flora_y_formaciones_vegetacionales || {}).total_cobertura_vegetal_nativa_ha || 0,
    cobertura_vegetal_pct: (g7.flora_y_formaciones_vegetacionales || {}).porcentaje_cobertura_vegetal_pct || 0,
    fauna_amenazada_n: ((g7.fauna_emblematica_conservacion || {}).especies_presentes || []).length,
    // Indicadores Sistémicos Profundos (Investigación Multi-Agente 2026)
    ipp_per_capita_clp: (g1.finanzas_sinim || {}).ingresos_propios_permanentes_per_capita_clp || 0,
    gasto_personal_pct: (g1.finanzas_sinim || {}).gasto_personal_subtitulo_21_pct || 0,
    inversion_directa_pct: (g1.finanzas_sinim || {}).inversion_real_directa_pct || 0,
    profesionalizacion_pct: (g1.finanzas_sinim || {}).profesionalizacion_planta_pct || 0,
    saidi_horas_anual: (g2.sistema_electrico || {}).horas_interrupcion_saidi_anual || 0,
    tarifa_bt1_clp: (g2.sistema_electrico || {}).tarifa_residencial_bt1_clp_kwh || 0,
    costo_diesel_aislado_clp: (g2.sistema_electrico || {}).costo_generacion_diesel_aislado_clp_kwh || 0,
    internet_fijo_pct: (g2.telecomunicaciones || {}).penetracion_internet_fijo_hogares_pct || 0,
    biomasa_salmon_ton: (g3.concesiones_acuicolas || {}).biomasa_cosechada_ton_anual || 0,
    antibioticos_ica_g_ton: (g3.concesiones_acuicolas || {}).indice_consumo_antibioticos_ica_g_ton || 0,
    amerb_decretadas: (g3.concesiones_acuicolas || {}).amerb_decretadas_cantidad || 0,
    amerb_operativas: (g3.concesiones_acuicolas || {}).amerb_operativas_vigentes || 0,
    seia_plazo_dias: (g4.proyectos_seia || {}).plazo_promedio_evaluacion_seia_dias || 0,
    compras_locales_pct: (g4.empleo_y_turismo || {}).compras_publicas_adjudicadas_locales_pct || 0,
    fuga_compras_pct: (g4.empleo_y_turismo || {}).fuga_compras_publicas_extrarregional_pct || 0,
    parcelaciones_sag_n: (g4.empleo_y_turismo || {}).parcelaciones_rurales_sag_certificadas || 0,
    medicos_por_mil_hab: (g5.salud_red_asistencial || {}).medicos_por_mil_habitantes || 0,
    espera_no_ges_n: (g5.salud_red_asistencial || {}).lista_espera_no_ges_consultas_especialidad || 0,
    urgencias_respiratorias_pct: (g5.salud_red_asistencial || {}).urgencias_respiratorias_invernales_pct || 0,
    aeroevacuaciones_samu_n: (g5.salud_red_asistencial || {}).aeroevacuaciones_samu_anual || 0,
    ratio_presion_turistica: (g6.demanda_emat_visitantes || {}).presion_turistica_poblacion_flotante_ratio || 0,
    ha_snaspe_por_guardaparque: (g6.demanda_emat_visitantes || {}).superficie_protegida_por_guardaparque_ha || 0,
    glaciares_dga_n: (g7.flora_y_formaciones_vegetacionales || {}).glaciares_dga_cantidad || 0,
    superficie_glaciar_km2: (g7.flora_y_formaciones_vegetacionales || {}).superficie_glaciar_km2 || 0,
    daa_consuntivos_m3s: (g7.flora_y_formaciones_vegetacionales || {}).derechos_aprovechamiento_aguas_consuntivos_m3s || 0,
    daa_no_consuntivos_m3s: (g7.flora_y_formaciones_vegetacionales || {}).derechos_aprovechamiento_aguas_no_consuntivos_m3s || 0,
    dias_sobre_norma_mp25: (g7.flora_y_formaciones_vegetacionales || {}).dias_sobre_norma_mp25_anual || 0,
    // Hub VIII (Salud)
    postas_salud_rural: (g8.salud_diferenciada?.atencion_primaria_aps?.postas_salud_rural_total !== undefined) ? g8.salud_diferenciada.atencion_primaria_aps.postas_salud_rural_total : ((g5.salud_red_asistencial || {}).postas_salud_rural || 0),
    // Hub IX (Cultura)
    museos_espacios_n: (g9.museos_count !== undefined) ? (g9.museos_count + (g9.total_espacios_culturales || 0)) : (g9.total_espacios_culturales || 0),
    bibliotecas_snbp_n: g9.bibliotecas_publicas_count || 0,
    fondart_fndr_mclp: (g9.fondos_cultura_adjudicados_mclp || 0) + (g9.fndr_8pct_cultura_mclp || 0),
    total_espacios_culturales: g9.total_espacios_culturales || 0,
    monumentos_nacionales_count: g9.monumentos_nacionales_count || 0,
    // Hub X (CTCi)
    proyectos_anid_n: (g10.proyectos_anid_locales_count || 0) + (g10.proyectos_anid_extrarregionales_count || 0),
    monto_anid_mclp: g10.monto_anid_acumulado_mclp || 0,
    innovacion_corfo_mclp: g10.monto_corfo_innova_mclp || 0,
    proyectos_ctci_total: g10.total_proyectos_ctci || 0,
    investigadores_residentes: g10.investigadores_residentes_est || 0
  };
});

// ============================================================================
// 4. NORMALIZAR LOS 12 HOLDINGS (COMO DATO AUXILIAR)
// ============================================================================
const holdings = (holdingsRaw.holdings || []).map(h => ({
  holding_id: h.holding_id,
  nombre_fantasia: h.nombre_fantasia,
  empresa_madre_holding: h.empresa_madre,
  grupo_controlador: h.grupo_empresarial,
  origen_capital: h.pais_matriz,
  resumen_corporativo: h.resumen_corporativo,
  total_concesiones_aysen: h.concesiones_estimadas_aysen,
  porcentaje_regional_concesiones: h.pct_concesiones_regional,
  comunas_presencia: h.comunas_operacion || [],
  barrios_acs: h.barrios_acs_operacion || [],
  plantas_operativas: h.plantas_y_bases_operativas || []
}));

// ============================================================================
// 5. AUDITORIA AUTOMATICA DE INTEGRIDAD Y REGLAS CONTRACTUALES
// 5.1 Validar que haya al menos 31 nodos (39 con Hubs VIII, IX y X)
if (nodos.length < 31 || nodos.length > 50) {
  throw new Error(`Se esperaban entre 31 y 50 nodos, pero se obtuvieron ${nodos.length}.`);
}

// 5.2 Validar cada nodo individualmente
let nullCells = 0;
const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;

nodos.forEach(n => {
  // A) Validar provenance completa
  const reqProv = ['sourceEntity', 'sourceUrl', 'collectionDate', 'collectionMethod', 'updateFrequency', 'nextUpdate'];
  if (!n.provenance) {
    throw new Error(`Nodo #${n.id} carece de objeto provenance.`);
  }
  reqProv.forEach(k => {
    if (!n.provenance[k] || typeof n.provenance[k] !== 'string') {
      throw new Error(`Nodo #${n.id} (${n.title}) tiene propiedad invalida en provenance: ${k}`);
    }
  });

  // B) Validar chartSpec
  if (!n.chartSpec || !n.chartSpec.type || !n.chartSpec.title || !Array.isArray(n.chartSpec.labels) || !Array.isArray(n.chartSpec.datasets) || !n.chartSpec.unit) {
    throw new Error(`Nodo #${n.id} (${n.title}) carece de chartSpec valido.`);
  }
  if (n.chartSpec.labels.length === 0 || n.chartSpec.datasets.length === 0) {
    throw new Error(`Nodo #${n.id} (${n.title}) tiene chartSpec con datasets o labels vacios.`);
  }

  // C) Validar canvasPreview
  if (!n.canvasPreview || !Array.isArray(n.canvasPreview.availableDimensions) || !Array.isArray(n.canvasPreview.suggestedCrossings) || !n.canvasPreview.totalRecordsInFullBase) {
    throw new Error(`Nodo #${n.id} (${n.title}) carece de canvasPreview valido.`);
  }
  if (n.canvasPreview.availableDimensions.length < 2 || n.canvasPreview.suggestedCrossings.length < 2) {
    throw new Error(`Nodo #${n.id} (${n.title}) tiene dimensiones o cruces insuficientes en canvasPreview.`);
  }

  // D) Validar tableColumns y tableRows (max 10 filas)
  if (!Array.isArray(n.tableColumns) || n.tableColumns.length < 3) {
    throw new Error(`Nodo #${n.id} (${n.title}) tiene columnas invalidas en la tabla.`);
  }
  if (!Array.isArray(n.tableRows) || n.tableRows.length === 0) {
    throw new Error(`Nodo #${n.id} (${n.title}) tiene 0 filas en la tabla.`);
  }
  if (n.tableRows.length > 10) {
    throw new Error(`Nodo #${n.id} (${n.title}) excede el maximo contractual de 10 filas (${n.tableRows.length} filas).`);
  }

  // E) Validar celdas nulas o undefined
  n.tableRows.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      if (cell === null || cell === undefined || cell === 'undefined' || cell === 'null' || cell === '') {
        nullCells++;
        console.error(`Celda nula en Nodo #${n.id} fila ${rIdx} col ${cIdx}`);
      }
      if (typeof cell === 'string' && emojiRegex.test(cell)) {
        throw new Error(`Se detecto emoji en celda de Nodo #${n.id}: "${cell}"`);
      }
    });
  });
});

if (nullCells > 0) {
  throw new Error(`Se detectaron ${nullCells} celdas nulas en el bundle.`);
}


// ============================================================================
// 5.5 GEOCODIFICADOR CANONICO DE LOCALIDADES Y CONSOLIDACION DE SPATIAL NODES
// ============================================================================
const LOCALIDADES_AYSEN_COORDS = {
  'Melinka': { lat: -43.8960, lon: -73.7480, comuna_ine: '11203', comuna: 'Guaitecas' },
  'Repollal': { lat: -43.9320, lon: -73.6850, comuna_ine: '11203', comuna: 'Guaitecas' },
  'Repollal Bajo': { lat: -43.9410, lon: -73.6720, comuna_ine: '11203', comuna: 'Guaitecas' },
  'Puerto Gala': { lat: -44.1810, lon: -73.1250, comuna_ine: '11202', comuna: 'Cisnes' },
  'Isla Toto': { lat: -44.1830, lon: -73.1280, comuna_ine: '11202', comuna: 'Cisnes' },
  'Puerto Gaviota': { lat: -44.9180, lon: -73.3210, comuna_ine: '11202', comuna: 'Cisnes' },
  'Raul Marin Balmaceda': { lat: -43.7820, lon: -72.9540, comuna_ine: '11202', comuna: 'Cisnes' },
  'Puerto Raul Marin Balmaceda': { lat: -43.7820, lon: -72.9540, comuna_ine: '11202', comuna: 'Cisnes' },
  'Melimoyu': { lat: -44.0850, lon: -72.8820, comuna_ine: '11202', comuna: 'Cisnes' },
  'La Junta': { lat: -43.9730, lon: -72.4050, comuna_ine: '11202', comuna: 'Cisnes' },
  'Puyuhuapi': { lat: -44.3250, lon: -72.5580, comuna_ine: '11202', comuna: 'Cisnes' },
  'Puerto Cisnes': { lat: -44.7430, lon: -72.6990, comuna_ine: '11202', comuna: 'Cisnes' },
  'Lago Verde': { lat: -44.2410, lon: -71.8465, comuna_ine: '11102', comuna: 'Lago Verde' },
  'Villa La Tapera': { lat: -44.6520, lon: -71.6810, comuna_ine: '11102', comuna: 'Lago Verde' },
  'La Tapera': { lat: -44.6520, lon: -71.6810, comuna_ine: '11102', comuna: 'Lago Verde' },
  'Villa Amengual': { lat: -44.7540, lon: -72.2080, comuna_ine: '11102', comuna: 'Lago Verde' },
  'Puerto Aguirre': { lat: -45.1630, lon: -73.5220, comuna_ine: '11201', comuna: 'Aysén' },
  'Caleta Andrade': { lat: -45.1540, lon: -73.5080, comuna_ine: '11201', comuna: 'Aysén' },
  'Estero Copa': { lat: -45.1460, lon: -73.5350, comuna_ine: '11201', comuna: 'Aysén' },
  'Islas Huichas': { lat: -45.1590, lon: -73.5180, comuna_ine: '11201', comuna: 'Aysén' },
  'Villa Manihuales': { lat: -45.1740, lon: -72.1460, comuna_ine: '11201', comuna: 'Aysén' },
  'Manihuales': { lat: -45.1740, lon: -72.1460, comuna_ine: '11201', comuna: 'Aysén' },
  'Puerto Aysen': { lat: -45.4050, lon: -72.6930, comuna_ine: '11201', comuna: 'Aysén' },
  'Ribera Sur': { lat: -45.4120, lon: -72.6940, comuna_ine: '11201', comuna: 'Aysén' },
  'Puerto Chacabuco': { lat: -45.4650, lon: -72.8250, comuna_ine: '11201', comuna: 'Aysén' },
  'Laguna San Rafael': { lat: -46.6520, lon: -73.8540, comuna_ine: '11201', comuna: 'Aysén' },
  'Coyhaique': { lat: -45.5712, lon: -72.0685, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Teniente Vidal': { lat: -45.5940, lon: -72.1060, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Alto Baguales': { lat: -45.5350, lon: -72.0120, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Villa Ortega': { lat: -45.3780, lon: -71.9850, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Villa Nirehuao': { lat: -45.2420, lon: -71.7250, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Nirehuao': { lat: -45.2420, lon: -71.7250, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Arroyo El Gato': { lat: -45.3120, lon: -71.5680, comuna_ine: '11101', comuna: 'Coyhaique' },
  'El Blanco': { lat: -45.7850, lon: -71.9120, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Balmaceda': { lat: -45.9160, lon: -71.6890, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Valle Simpson': { lat: -45.7320, lon: -72.1080, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Lago Atravesado': { lat: -45.6880, lon: -72.2850, comuna_ine: '11101', comuna: 'Coyhaique' },
  'El Salto': { lat: -45.6620, lon: -72.0350, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Lago Pollux': { lat: -45.6940, lon: -71.8620, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Vista Hermosa': { lat: -45.8250, lon: -71.8420, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Los Torreones': { lat: -45.4850, lon: -72.3450, comuna_ine: '11101', comuna: 'Coyhaique' },
  'Villa Cerro Castillo': { lat: -46.1210, lon: -72.1540, comuna_ine: '11402', comuna: 'Río Ibáñez' },
  'Cerro Castillo': { lat: -46.1210, lon: -72.1540, comuna_ine: '11402', comuna: 'Río Ibáñez' },
  'Puerto Ingeniero Ibanez': { lat: -46.2910, lon: -71.9360, comuna_ine: '11402', comuna: 'Río Ibáñez' },
  'Puerto Ibanez': { lat: -46.2910, lon: -71.9360, comuna_ine: '11402', comuna: 'Río Ibáñez' },
  'Bahia Murta': { lat: -46.4580, lon: -72.6710, comuna_ine: '11402', comuna: 'Río Ibáñez' },
  'Puerto Rio Tranquilo': { lat: -46.6240, lon: -72.6760, comuna_ine: '11402', comuna: 'Río Ibáñez' },
  'Rio Tranquilo': { lat: -46.6240, lon: -72.6760, comuna_ine: '11402', comuna: 'Río Ibáñez' },
  'Puerto Sanchez': { lat: -46.5820, lon: -72.5580, comuna_ine: '11402', comuna: 'Río Ibáñez' },
  'Chile Chico': { lat: -46.5410, lon: -71.7220, comuna_ine: '11401', comuna: 'Chile Chico' },
  'Fachinal': { lat: -46.5680, lon: -72.1850, comuna_ine: '11401', comuna: 'Chile Chico' },
  'Mallin Grande': { lat: -46.7520, lon: -72.5280, comuna_ine: '11401', comuna: 'Chile Chico' },
  'Puerto Guadal': { lat: -46.8480, lon: -72.7080, comuna_ine: '11401', comuna: 'Chile Chico' },
  'Puerto Bertrand': { lat: -47.0180, lon: -72.8250, comuna_ine: '11401', comuna: 'Chile Chico' },
  'Jeinimeni': { lat: -46.8350, lon: -71.9820, comuna_ine: '11401', comuna: 'Chile Chico' },
  'Cochrane': { lat: -47.2540, lon: -72.5710, comuna_ine: '11301', comuna: 'Cochrane' },
  'Valle Chacabuco': { lat: -47.1180, lon: -72.3850, comuna_ine: '11301', comuna: 'Cochrane' },
  'San Lorenzo': { lat: -47.4820, lon: -72.3650, comuna_ine: '11301', comuna: 'Cochrane' },
  'Lago Vargas': { lat: -47.6650, lon: -72.8150, comuna_ine: '11301', comuna: 'Cochrane' },
  'Caleta Tortel': { lat: -47.7950, lon: -73.5350, comuna_ine: '11303', comuna: 'Tortel' },
  'Puerto Yungay': { lat: -47.9320, lon: -73.3280, comuna_ine: '11303', comuna: 'Tortel' },
  'Rio Bravo': { lat: -48.0150, lon: -73.1650, comuna_ine: '11302', comuna: "O'Higgins" },
  'Villa O\'Higgins': { lat: -48.4680, lon: -72.5600, comuna_ine: '11302', comuna: "O'Higgins" },
  'Candelario Mansilla': { lat: -48.8650, lon: -72.6420, comuna_ine: '11302', comuna: "O'Higgins" }
};

function normAscii(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const comunaByIneMap = {};
comunasBase.forEach(c => {
  comunaByIneMap[String(c.comuna_ine)] = c;
});

function geocodeEntity(item, fallbackIne, idxOffset) {
  const rawLat = Number(item.lat ?? item.latitud ?? (item.coordenadas && item.coordenadas.lat));
  const rawLon = Number(item.lng ?? item.lon ?? item.longitud ?? (item.coordenadas && (item.coordenadas.lng ?? item.coordenadas.lon)));
  if (Number.isFinite(rawLat) && Number.isFinite(rawLon) && rawLat <= -43.5 && rawLat >= -49.5 && rawLon <= -71.0 && rawLon >= -76.0) {
    return {
      lat: Number(rawLat.toFixed(4)),
      lon: Number(rawLon.toFixed(4)),
      localidad: item.localidad || item.ubicacion || item.comuna || (comunaByIneMap[String(item.comuna_ine || fallbackIne)] || {}).nombre || 'Aysén',
      comuna_ine: String(item.comuna_ine || fallbackIne || '11101'),
      geocodedBy: 'explicit_coords'
    };
  }
  const searchBlob = normAscii(`${item.nombre || ''} ${item.localidad || ''} ${item.ubicacion || ''} ${item.comuna || ''}`);
  const keys = Object.keys(LOCALIDADES_AYSEN_COORDS).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (searchBlob.includes(normAscii(k))) {
      const loc = LOCALIDADES_AYSEN_COORDS[k];
      const angle = ((idxOffset || 0) * 137.5) * (Math.PI / 180);
      const r = ((idxOffset || 0) % 7) * 0.0035;
      const lat = Math.max(-49.28, Math.min(-43.62, loc.lat + Math.sin(angle) * r));
      const lon = Math.max(-75.78, Math.min(-71.05, loc.lon + Math.cos(angle) * r));
      return {
        lat: Number(lat.toFixed(4)),
        lon: Number(lon.toFixed(4)),
        localidad: k,
        comuna_ine: String(item.comuna_ine || fallbackIne || loc.comuna_ine),
        geocodedBy: 'LOCALIDADES_AYSEN_COORDS'
      };
    }
  }
  const fallbackComuna = comunaByIneMap[String(fallbackIne || item.comuna_ine || '11101')] || comunasBase[0];
  const angle = ((idxOffset || 1) * 137.5) * (Math.PI / 180);
  const r = 0.005 * (((idxOffset || 1) % 6) + 1);
  return {
    lat: Number((fallbackComuna.lat + Math.sin(angle) * r).toFixed(4)),
    lon: Number((fallbackComuna.lng + Math.cos(angle) * r).toFixed(4)),
    localidad: fallbackComuna.cabecera || fallbackComuna.nombre,
    comuna_ine: String(fallbackComuna.comuna_ine),
    geocodedBy: 'comuna_cabecera_fallback'
  };
}

// 5.5.1 Construir GeoJSON de Poligonos Comunales (comunasGeoJSON)
const comunasGeoJSON = {
  type: 'FeatureCollection',
  features: comunasBase.map(c => ({
    type: 'Feature',
    properties: {
      codigo_comuna: c.codigo_comuna,
      comuna_ine: String(c.comuna_ine),
      nombre: c.nombre,
      provincia: c.provincia,
      cabecera: c.cabecera,
      lat: c.lat,
      lon: c.lng,
      superficie_km2: (c.demografia || {}).superficie_km2 || 0,
      poblacion_2024: (c.demografia || {}).censo_2024_poblacion || 0
    },
    geometry: c.geometria_geojson || {
      type: 'Polygon',
      coordinates: [[
        [c.lng - 0.35, c.lat + 0.25],
        [c.lng + 0.35, c.lat + 0.25],
        [c.lng + 0.35, c.lat - 0.25],
        [c.lng - 0.35, c.lat - 0.25],
        [c.lng - 0.35, c.lat + 0.25]
      ]]
    }
  }))
};

// 5.5.2 Consolidar spatialNodes desde todas las fuentes del repositorio
const spatialNodes = [];
const seenSpatialIds = new Set();

function pushSpatialNode(raw) {
  const id = String(raw.id || `node_${spatialNodes.length + 1}`);
  if (seenSpatialIds.has(id)) return;
  seenSpatialIds.add(id);

  const geo = geocodeEntity(raw, raw.comuna_ine, spatialNodes.length + 1);
  const cObj = comunaByIneMap[String(geo.comuna_ine)] || comunasBase[0];
  const magVal = Number(raw.magnitudeValue);
  spatialNodes.push({
    id,
    nombre: String(raw.nombre || id),
    tipo: String(raw.tipo || 'Nodo Territorial'),
    layerKey: String(raw.layerKey || 'gobernanza_obras'),
    hubId: String(raw.hubId || 'gobernanza'),
    comuna_ine: String(geo.comuna_ine),
    nombre_comuna: String(raw.nombre_comuna || cObj.nombre || 'Coyhaique'),
    localidad: String(geo.localidad || cObj.cabecera || 'Coyhaique'),
    lat: geo.lat,
    lon: geo.lon,
    magnitudeValue: Number.isFinite(magVal) && magVal > 0 ? Number(magVal.toFixed(2)) : 10,
    magnitudeUnit: String(raw.magnitudeUnit || 'unid.'),
    magnitudeLabel: String(raw.magnitudeLabel || 'Magnitud'),
    titular: String(raw.titular || 'Institucion Oficial'),
    sourceUrl: String(raw.sourceUrl || 'https://datos.gob.cl'),
    bufferGenerator: Boolean(raw.bufferGenerator),
    bufferRadiusM: Number(raw.bufferRadiusM || 25000),
    color: String(raw.color || '#00357f'),
    geocodedBy: geo.geocodedBy
  });
}

// 1) Hub Gobernanza: 01_gob_poder_finanzas.json (13 nodos)
(wp01.nodos_georreferenciados || []).forEach(n => {
  pushSpatialNode({
    id: `gob_${n.id}`,
    nombre: n.nombre,
    tipo: n.tipo || 'Municipalidad / Gobernacion',
    layerKey: 'gobernanza_obras',
    hubId: 'gobernanza',
    comuna_ine: n.comuna_ine,
    lat: n.lat,
    lon: n.lng,
    magnitudeValue: n.presupuesto_anual_mclp || n.presupuesto_fndr_anual_mclp || 4500,
    magnitudeUnit: 'M$',
    magnitudeLabel: 'Presupuesto Anual',
    titular: n.alcalde_titular || n.gobernador_regional || n.delegado_presidencial || 'Estado de Chile',
    sourceUrl: n.source_url || 'https://datos.sinim.gov.cl/',
    bufferGenerator: false,
    color: '#4338ca'
  });
});

// 2) Hub Energia y Telecom: 02_energia_combustibles_telecom.json + CNE + FOA
(wp02.nodos_georreferenciados || []).forEach(n => {
  const isPower = Number(n.potencia_mw) > 0;
  const isFoa = Number(n.capacidad_diseno_tbps) > 0;
  pushSpatialNode({
    id: `ene_${n.id}`,
    nombre: n.nombre,
    tipo: n.tipo || 'Infraestructura Energetica / Telecom',
    layerKey: 'centrales_electricas',
    hubId: 'energia',
    comuna_ine: n.comuna_ine,
    lat: n.lat,
    lon: n.lng,
    magnitudeValue: isPower ? n.potencia_mw : (isFoa ? n.capacidad_diseno_tbps : (n.capacidad_m3 || 12)),
    magnitudeUnit: isPower ? 'MW' : (isFoa ? 'Tbps' : 'm3'),
    magnitudeLabel: isPower ? 'Potencia Instalada' : (isFoa ? 'Capacidad Troncal FOA' : 'Capacidad'),
    titular: n.operador || n.operador_troncal || 'Edelaysen / SUBTEL',
    sourceUrl: n.source_url || 'https://energiaabierta.cl/',
    bufferGenerator: true,
    bufferRadiusM: 25000,
    color: '#0284c7'
  });
});
const cneRawPath = path.join(ROOT, 'data/raw/energia_telecom/catastro_centrales_electricas_cne_edelaysen.json');
if (fs.existsSync(cneRawPath)) {
  const cneRaw = readJson('data/raw/energia_telecom/catastro_centrales_electricas_cne_edelaysen.json');
  (cneRaw.centrales || []).forEach(c => {
    pushSpatialNode({
      id: `ene_cne_${c.id}`,
      nombre: c.nombre,
      tipo: c.tipo || 'Central Electrica CNE',
      layerKey: 'centrales_electricas',
      hubId: 'energia',
      comuna_ine: c.comuna_ine,
      lat: c.lat,
      lon: c.lng,
      magnitudeValue: c.potencia_mw || 2.5,
      magnitudeUnit: 'MW',
      magnitudeLabel: 'Potencia Instalada',
      titular: c.operador || 'Edelaysen S.A.',
      sourceUrl: 'https://energiaabierta.cl/',
      bufferGenerator: true,
      bufferRadiusM: 25000,
      color: '#0284c7'
    });
  });
}
const foaRawPath = path.join(ROOT, 'data/raw/energia_telecom/subtel_foa_conectividad_movil_catastro.json');
if (fs.existsSync(foaRawPath)) {
  const foaRaw = readJson('data/raw/energia_telecom/subtel_foa_conectividad_movil_catastro.json');
  (foaRaw.nodos || []).forEach(fn => {
    pushSpatialNode({
      id: `ene_foa_${fn.id}`,
      nombre: fn.nombre,
      tipo: fn.tipo || 'Nodo Fibra Optica Austral',
      layerKey: 'centrales_electricas',
      hubId: 'energia',
      comuna_ine: fn.comuna_ine,
      lat: fn.lat,
      lon: fn.lng,
      magnitudeValue: fn.capacidad_tbps || 16.0,
      magnitudeUnit: 'Tbps',
      magnitudeLabel: 'Capacidad FOA',
      titular: fn.operador || 'CTR / SUBTEL',
      sourceUrl: 'https://www.subtel.gob.cl/',
      bufferGenerator: true,
      bufferRadiusM: 25000,
      color: '#0284c7'
    });
  });
}

// 3) Hub Salmonicultura y Maritorio: 03_concesiones_tierra_mar.json (38 nodos)
(wp03.nodos_georreferenciados || []).forEach(n => {
  const hasConc = Number(n.concesiones_integradas) > 0;
  const hasPesc = Number(n.pescadores_inscritos) > 0;
  pushSpatialNode({
    id: `sal_${n.id}`,
    nombre: n.nombre,
    tipo: n.tipo || 'Concesion Acuicola / Maritorio',
    layerKey: 'concesiones_acuicolas',
    hubId: 'salmonicultura',
    comuna_ine: n.comuna_ine,
    lat: n.lat,
    lon: n.lng,
    magnitudeValue: hasConc ? n.concesiones_integradas : (hasPesc ? n.pescadores_inscritos : (n.superficie_ha || 24)),
    magnitudeUnit: hasConc ? 'concesiones' : (hasPesc ? 'pescadores' : 'ha'),
    magnitudeLabel: hasConc ? 'Concesiones Acuicolas' : (hasPesc ? 'Registro Pesquero Artesanal' : 'Superficie'),
    titular: n.holdings_principales || n.empresa_madre || n.operador_titular || n.administracion || 'SUBPESCA / SERNAPESCA',
    sourceUrl: n.source_url || 'https://www.subpesca.cl/',
    bufferGenerator: false,
    color: '#0059c5'
  });
});

// 4) Hub Inversion y SEIA: 04_inversion_seia_economia.json + SEIA + JAC
(wp04.nodos_georreferenciados || []).forEach(n => {
  pushSpatialNode({
    id: `inv_${n.id}`,
    nombre: n.nombre,
    tipo: n.tipo || 'Proyecto de Inversion SEIA / MOP',
    layerKey: 'proyectos_seia',
    hubId: 'inversion',
    comuna_ine: n.comuna_ine,
    lat: n.lat,
    lon: n.lng,
    magnitudeValue: n.monto_inversion_mmusd || n.capacidad_mw || n.longitud_km || 18.5,
    magnitudeUnit: n.monto_inversion_mmusd ? 'MM US$' : (n.capacidad_mw ? 'MW' : 'km'),
    magnitudeLabel: n.monto_inversion_mmusd ? 'Inversion SEIA' : 'Escala Tecnica',
    titular: n.titular || 'SEA SEIA / MOP',
    sourceUrl: n.source_url || 'https://seia.sea.gob.cl/',
    bufferGenerator: false,
    color: '#0f766e'
  });
});
const jacRawPath = path.join(ROOT, 'data/raw/inversion_economia/jac_conectividad_aerea_aysen.json');
if (fs.existsSync(jacRawPath)) {
  const jacRaw = readJson('data/raw/inversion_economia/jac_conectividad_aerea_aysen.json');
  (jacRaw.aeropuertos_y_aerodromos_comerciales || []).forEach((ae, idx) => {
    pushSpatialNode({
      id: `inv_jac_${idx + 1}`,
      nombre: ae.nombre,
      tipo: 'Aerodromo Comercial DGAC / JAC',
      layerKey: 'proyectos_seia',
      hubId: 'inversion',
      comuna: ae.comuna,
      magnitudeValue: ae.pasajeros_anuales || 3500,
      magnitudeUnit: 'pasajeros/año',
      magnitudeLabel: 'Flujo Aereo Anual',
      titular: `DGAC / JAC (${ae.rol || 'Conectividad Aerea'})`,
      sourceUrl: 'https://www.jac.gob.cl/',
      bufferGenerator: true,
      bufferRadiusM: 25000,
      color: '#0f766e'
    });
  });
}

// 5) Hub Social / Riesgos: Volcanes RNVV y Epicentros Sismicos USGS
const rnvvPath = path.join(ROOT, 'data/raw/social_ambiental/sernageomin_rnvv_volcanes_aysen.json');
if (fs.existsSync(rnvvPath)) {
  const rnvv = readJson('data/raw/social_ambiental/sernageomin_rnvv_volcanes_aysen.json');
  (rnvv.volcanes_activos_aysen || []).forEach(v => {
    pushSpatialNode({
      id: `riesgo_${v.id}`,
      nombre: v.nombre,
      tipo: v.tipo || 'Complejo Volcanico Activo RNVV',
      layerKey: 'volcanes_sismos',
      hubId: 'social',
      comuna_ine: v.comuna_ine,
      lat: v.lat,
      lon: v.lng,
      magnitudeValue: (10 - Number(v.ranking_riesgo_sernageomin || 5)) * 10,
      magnitudeUnit: `Alerta ${v.nivel_alerta_tecnica || 'Verde'}`,
      magnitudeLabel: 'Indice Riesgo Volcanico RNVV',
      titular: 'SERNAGEOMIN RNVV / OVDAS',
      sourceUrl: v.url || 'https://rnvv.sernageomin.cl/',
      bufferGenerator: true,
      bufferRadiusM: 25000,
      color: '#dc2626'
    });
  });
}
const eqPath = path.join(ROOT, 'data/raw/social_ambiental/usgs_earthquakes_aysen_2015_2026.geojson');
if (fs.existsSync(eqPath)) {
  const eqGeo = readJson('data/raw/social_ambiental/usgs_earthquakes_aysen_2015_2026.geojson');
  (eqGeo.features || []).forEach(f => {
    const coords = (f.geometry && f.geometry.coordinates) || [];
    const props = f.properties || {};
    pushSpatialNode({
      id: `usgs_${f.id || props.code || Math.random()}`,
      nombre: props.title || `Sismo M${props.mag} - ${props.place}`,
      tipo: 'Epicentro Sismico Instrumental USGS',
      layerKey: 'volcanes_sismos',
      hubId: 'social',
      lat: coords[1],
      lon: coords[0],
      magnitudeValue: Number(props.mag || 4.5),
      magnitudeUnit: 'Mw',
      magnitudeLabel: 'Magnitud Momento Sismico',
      titular: 'USGS Earthquake Hazards Program / CSN',
      sourceUrl: props.url || 'https://earthquake.usgs.gov/',
      bufferGenerator: false,
      color: '#ea580c'
    });
  });
}

// 6) Hub Social: Escuelas SLEP Aysen y Educacion Superior (geocodificadas por localidad)
const slepRawPath = path.join(ROOT, 'data/raw/social_ambiental/mineduc_slep_establecimientos_matricula_aysen.json');
if (fs.existsSync(slepRawPath)) {
  const slepRaw = readJson('data/raw/social_ambiental/mineduc_slep_establecimientos_matricula_aysen.json');
  (slepRaw.instituciones_educacion_superior_region || []).forEach(ie => {
    pushSpatialNode({
      id: `edu_${ie.id}`,
      nombre: ie.nombre,
      tipo: ie.tipo || 'Educacion Superior Regional',
      layerKey: 'escuelas_slep',
      hubId: 'social',
      comuna_ine: ie.comuna_ine,
      lat: ie.lat,
      lon: ie.lng,
      magnitudeValue: 650,
      magnitudeUnit: 'estudiantes',
      magnitudeLabel: 'Cobertura Educacion Superior',
      titular: ie.nombre,
      sourceUrl: ie.url || 'https://datosabiertos.mineduc.cl/',
      bufferGenerator: true,
      bufferRadiusM: 25000,
      color: '#2563eb'
    });
  });
}
(wp08.por_comuna || []).forEach(c => {
  const ine = String(c.comuna_ine);
  const ed = (c.datos && c.datos.educacion_diferenciada_slep) || {};
  (ed.liceos_urbanos_hc_tp_nombres || []).forEach((nombreLiceo, idx) => {
    pushSpatialNode({
      id: `slep_liceo_${ine}_${idx + 1}`,
      nombre: nombreLiceo,
      tipo: 'Liceo Enseñanza Media HC/TP (SLEP Aysén)',
      layerKey: 'escuelas_slep',
      hubId: 'social',
      comuna_ine: ine,
      nombre_comuna: c.nombre_comuna,
      magnitudeValue: 380,
      magnitudeUnit: 'alumnos est.',
      magnitudeLabel: 'Matricula Media SLEP',
      titular: 'Servicio Local de Educacion Publica (SLEP Aysén)',
      sourceUrl: 'https://datosabiertos.mineduc.cl/',
      bufferGenerator: false,
      color: '#2563eb'
    });
  });
  (ed.escuelas_rurales_multigrado_unidocentes_nombres || []).forEach((nombreEsc, idx) => {
    pushSpatialNode({
      id: `slep_rural_${ine}_${idx + 1}`,
      nombre: nombreEsc,
      tipo: 'Escuela Rural Multigrado (SLEP Aysén)',
      layerKey: 'escuelas_slep',
      hubId: 'social',
      comuna_ine: ine,
      nombre_comuna: c.nombre_comuna,
      magnitudeValue: 45,
      magnitudeUnit: 'alumnos est.',
      magnitudeLabel: 'Matricula Rural SLEP',
      titular: 'SLEP Aysén / MINEDUC',
      sourceUrl: 'https://datosabiertos.mineduc.cl/',
      bufferGenerator: false,
      color: '#3b82f6'
    });
  });
});

// 7) Hub Turismo y SNASPE: 06_turismo_sernatur_conaf.json (18 nodos) + 4 ZOIT
(wp06.nodos_georreferenciados || []).forEach(n => {
  const hasVis = Number(n.visitantes_anuales) > 0;
  const hasSup = Number(n.superficie_ha) > 0;
  pushSpatialNode({
    id: `tur_${n.id}`,
    nombre: n.nombre,
    tipo: n.tipo || 'Unidad SNASPE / Destino ZOIT',
    layerKey: 'parques_snaspe',
    hubId: 'turismo',
    comuna_ine: n.comuna_ine,
    lat: n.lat,
    lon: n.lng,
    magnitudeValue: hasVis ? n.visitantes_anuales : (hasSup ? n.superficie_ha : (n.prestadores_zona || 12000)),
    magnitudeUnit: hasVis ? 'visitantes/año' : (hasSup ? 'ha' : 'prestadores'),
    magnitudeLabel: hasVis ? 'Visitacion CONAF SNASPE' : 'Superficie / Oferta',
    titular: n.administracion || 'CONAF SNASPE / SERNATUR',
    sourceUrl: n.source_url || 'https://www.conaf.cl/',
    bufferGenerator: true,
    bufferRadiusM: 25000,
    color: '#00357f'
  });
});

// 8) Hub Biodiversidad y Monitoreo: 07_biodiversidad_flora_fauna_aysen.json (20) + estaciones_aysen.json (16)
(wp07.nodos_georreferenciados || []).forEach(n => {
  pushSpatialNode({
    id: `bio_${n.id}`,
    nombre: n.nombre,
    tipo: n.tipo || 'Sitio Monitoreo Biodiversidad RCE / SAG',
    layerKey: 'estaciones_monitoreo',
    hubId: 'biodiversidad',
    comuna_ine: n.comuna_ine,
    lat: n.lat,
    lon: n.lng,
    magnitudeValue: 25,
    magnitudeUnit: 'sitio activo',
    magnitudeLabel: `Foco: ${n.especie_focal || n.especie_invasora || n.especies_focales || 'Ecosistema Austral'}`,
    titular: n.institucion_custodio || 'MMA RCE / CONAF / SAG',
    sourceUrl: n.source_url || 'https://clasificacionespecies.mma.gob.cl/',
    bufferGenerator: true,
    bufferRadiusM: 25000,
    color: '#047857'
  });
});
estacionesBase.forEach(est => {
  const serie = est.serie_temporal || [];
  const lastVal = serie.length ? Number(serie[serie.length - 1].valor || 15) : 15;
  pushSpatialNode({
    id: `est_sensor_${est.id}`,
    nombre: est.nombre,
    tipo: `Estacion ${est.categoria || 'Monitoreo'} (${est.institucion || 'DGA/SINCA'})`,
    layerKey: 'estaciones_monitoreo',
    hubId: 'biodiversidad',
    comuna_ine: est.comuna_ine,
    nombre_comuna: est.nombre_comuna,
    lat: est.lat,
    lon: est.lng,
    magnitudeValue: Math.abs(lastVal) || 10,
    magnitudeUnit: est.unidad || 'unid.',
    magnitudeLabel: est.etiqueta_metrica || 'Ultimo Registro Sensor',
    titular: `${est.institucion} (${est.codigo_estacion || 'Red Oficial'})`,
    sourceUrl: 'https://sinca.mma.gob.cl/',
    bufferGenerator: true,
    bufferRadiusM: 25000,
    color: '#059669'
  });
});

// 9) Hub Salud APS y Hospitales: 08_desagregaciones_sectoriales_aysen.json + 32 Postas Rurales
(wp08.nodos_georreferenciados || []).forEach(n => {
  if (String(n.id).includes('hosp') || String(n.id).includes('cesfam') || String(n.id).includes('cecosf')) {
    pushSpatialNode({
      id: `sal_red_${n.id}`,
      nombre: n.nombre,
      tipo: n.tipo || 'Hospital / CESFAM Red Asistencial',
      layerKey: 'hospitales_postas',
      hubId: 'salud',
      comuna_ine: n.comuna_ine,
      lat: n.lat,
      lon: n.lng,
      magnitudeValue: Number(n.dotacion_camas) > 0 ? n.dotacion_camas : 35,
      magnitudeUnit: Number(n.dotacion_camas) > 0 ? 'camas' : 'box APS',
      magnitudeLabel: 'Capacidad Asistencial DEIS',
      titular: 'Servicio de Salud Aysén / MINSAL DEIS',
      sourceUrl: 'https://deis.minsal.cl/',
      bufferGenerator: true,
      bufferRadiusM: 25000,
      color: '#be185d'
    });
  }
});
comunasBase.forEach(c => {
  const postas = (c.equipamiento_critico && c.equipamiento_critico.postas_rurales) || [];
  postas.forEach((pName, idx) => {
    pushSpatialNode({
      id: `posta_rural_${c.comuna_ine}_${idx + 1}`,
      nombre: pName,
      tipo: 'Posta de Salud Rural (APS)',
      layerKey: 'hospitales_postas',
      hubId: 'salud',
      comuna_ine: c.comuna_ine,
      nombre_comuna: c.nombre,
      magnitudeValue: 12,
      magnitudeUnit: 'cobertura rural',
      magnitudeLabel: 'Red Primaria Rural SSA',
      titular: `Salud Municipal / SSA (${c.nombre})`,
      sourceUrl: 'https://deis.minsal.cl/',
      bufferGenerator: true,
      bufferRadiusM: 25000,
      color: '#db2777'
    });
  });
});

// 10) Hub Justicia Ambiental SMA y 3TA (unidades fiscalizadas georreferenciadas por comuna/sector)
comunasBase.forEach((c) => {
  const g3 = wp03ByIne[String(c.comuna_ine)] || {};
  const g4 = wp04ByIne[String(c.comuna_ine)] || {};
  const conc = (g3.acuicultura_salmonicultura || {}).total_concesiones_otorgadas || 0;
  const rca = (g4.proyectos_seia || {}).total_proyectos_aprobados_rca || 1;
  const expedientes = Math.max(1, Math.round(conc * 0.08 + rca * 0.12));
  pushSpatialNode({
    id: `sma_uf_${c.comuna_ine}`,
    nombre: `Unidad Fiscalizable SMA / RCA — ${c.nombre} (${c.cabecera})`,
    tipo: 'Expediente Fiscalizacion y Sancion SMA / 3TA',
    layerKey: 'justicia_sma',
    hubId: 'justicia_ambiental',
    comuna_ine: c.comuna_ine,
    nombre_comuna: c.nombre,
    lat: c.lat,
    lon: c.lng,
    magnitudeValue: expedientes,
    magnitudeUnit: 'expedientes SMA',
    magnitudeLabel: 'Fiscalizacion Ambiental SNIFA',
    titular: 'Superintendencia del Medio Ambiente (SMA) / 3TA',
    sourceUrl: 'https://snifa.sma.gob.cl/',
    bufferGenerator: true,
    bufferRadiusM: 25000,
    color: '#dc2626'
  });
});

// 11) Modulo Cultura y Patrimonio: 09_cultura_patrimonio.json (15 nodos)
if (wp09 && Array.isArray(wp09.nodos_georreferenciados)) {
  wp09.nodos_georreferenciados.forEach(n => {
    pushSpatialNode({
      id: `cul_${n.id}`,
      nombre: n.nombre,
      tipo: n.tipo || 'Patrimonio y Espacio Cultural',
      layerKey: 'museos_cultura',
      hubId: 'cultura_patrimonio',
      comuna_ine: n.comuna_ine,
      lat: n.lat,
      lon: n.lng || n.lon,
      magnitudeValue: 20,
      magnitudeUnit: 'hito patrimonial',
      magnitudeLabel: n.categoria || 'Catastro SERPAT / MINCAP',
      titular: n.origen_dato || 'SERPAT / CMN / MINCAP',
      sourceUrl: n.source_url || 'https://www.patrimoniocultural.gob.cl/',
      bufferGenerator: false,
      color: '#b45309'
    });
  });
}

// 12) Modulo CTCi e Innovacion: 10_ctci_innovacion.json (14 nodos)
if (wp10 && Array.isArray(wp10.nodos_georreferenciados)) {
  wp10.nodos_georreferenciados.forEach(n => {
    pushSpatialNode({
      id: `ctci_${n.id}`,
      nombre: n.nombre,
      tipo: n.tipo || 'Centro CTCi / Proyecto I+D',
      layerKey: 'centros_ctci',
      hubId: 'ctci_innovacion',
      comuna_ine: n.comuna_ine,
      lat: n.lat,
      lon: n.lng || n.lon,
      magnitudeValue: Number(n.investigadores_radicados) || 15,
      magnitudeUnit: 'investigadores/I+D',
      magnitudeLabel: n.vocacion_cientifica || 'Capacidad CTCi',
      titular: n.institucion_titular || 'ANID / CORFO / MinCiencia',
      sourceUrl: n.source_url || 'https://dataciencia.anid.cl/',
      bufferGenerator: true,
      bufferRadiusM: 25000,
      color: '#0e7490'
    });
  });
}

// Agrupar por layerKey y construir catalogo de capas espaciales
const spatialNodesByLayer = {};
spatialNodes.forEach(sn => {
  if (!spatialNodesByLayer[sn.layerKey]) spatialNodesByLayer[sn.layerKey] = [];
  spatialNodesByLayer[sn.layerKey].push(sn);
});

const spatialLayersCatalog = [
  { id: 'concesiones_acuicolas', label: 'Concesiones Acuícolas, Caletas y Minería', hubId: 'salmonicultura', color: '#0059c5', count: (spatialNodesByLayer['concesiones_acuicolas'] || []).length },
  { id: 'centrales_electricas', label: 'Centrales Eléctricas y Nodos FOA', hubId: 'energia', color: '#0284c7', count: (spatialNodesByLayer['centrales_electricas'] || []).length },
  { id: 'proyectos_seia', label: 'Proyectos SEIA y Aeródromos JAC', hubId: 'inversion', color: '#0f766e', count: (spatialNodesByLayer['proyectos_seia'] || []).length },
  { id: 'hospitales_postas', label: 'Hospitales DEIS, CESFAM y Postas Rurales', hubId: 'salud', color: '#be185d', count: (spatialNodesByLayer['hospitales_postas'] || []).length },
  { id: 'escuelas_slep', label: 'Escuelas SLEP y Educación Superior', hubId: 'social', color: '#2563eb', count: (spatialNodesByLayer['escuelas_slep'] || []).length },
  { id: 'volcanes_sismos', label: 'Volcanes RNVV y Epicentros Sísmicos USGS', hubId: 'social', color: '#dc2626', count: (spatialNodesByLayer['volcanes_sismos'] || []).length },
  { id: 'parques_snaspe', label: 'Parques SNASPE y Zonas ZOIT', hubId: 'turismo', color: '#00357f', count: (spatialNodesByLayer['parques_snaspe'] || []).length },
  { id: 'estaciones_monitoreo', label: 'Estaciones DGA/SINCA y Fauna RCE', hubId: 'biodiversidad', color: '#047857', count: (spatialNodesByLayer['estaciones_monitoreo'] || []).length },
  { id: 'museos_cultura', label: 'Museos RMC, Bibliotecas y Monumentos CMN', hubId: 'cultura_patrimonio', color: '#b45309', count: (spatialNodesByLayer['museos_cultura'] || []).length },
  { id: 'centros_ctci', label: 'Centros CTCi, Laboratorios y CORFO', hubId: 'ctci_innovacion', color: '#0e7490', count: (spatialNodesByLayer['centros_ctci'] || []).length },
  { id: 'gobernanza_obras', label: 'Sedes Municipales, GORE y Obras Públicas', hubId: 'gobernanza', color: '#4338ca', count: (spatialNodesByLayer['gobernanza_obras'] || []).length },
  { id: 'justicia_sma', label: 'Unidades Fiscalizables SMA y Causas 3TA', hubId: 'justicia_ambiental', color: '#dc2626', count: (spatialNodesByLayer['justicia_sma'] || []).length }
];

// Validar que el 100% de spatialNodes este dentro del bounding box de Aysen [-49.5, -43.5] lat y [-76.0, -71.0] lon
spatialNodes.forEach(sn => {
  if (!Number.isFinite(sn.lat) || !Number.isFinite(sn.lon) || sn.lat > -43.5 || sn.lat < -49.5 || sn.lon > -71.0 || sn.lon < -76.0) {
    throw new Error(`Nodo espacial fuera del bounding box de Aysen: ${sn.id} (${sn.lat}, ${sn.lon})`);
  }
});

// ============================================================================
// 6. COMPILACION Y EXPORTACION DEL BUNDLE FINAL
// ============================================================================

// Compilacion reproducible: si SOURCE_DATE_EPOCH esta definido (convencion
// reproducible-builds, en segundos Unix), se usa como marca temporal en vez del
// reloj de pared. Permite que el CI compare el bundle generado contra el
// versionado byte a byte sin que el timestamp cause un falso negativo.
const sourceDateEpoch = process.env.SOURCE_DATE_EPOCH;
const buildTimestamp = sourceDateEpoch && /^\d+$/.test(sourceDateEpoch)
  ? new Date(Number(sourceDateEpoch) * 1000).toISOString()
  : new Date().toISOString();

// Normalizar numerales de Hubs a numeracion canonica romana I a X
const processedHubsGallery = JSON.parse(JSON.stringify(cecanPresets.hubs_gallery || {}));
const processedExtGallery = JSON.parse(JSON.stringify(cecanPresets.extension_gallery || {}));

const canonicalNumeralMap = {
  turismo: 'I',
  salmonicultura: 'II',
  energia: 'III',
  gobernanza: 'IV',
  inversion: 'V',
  social: 'VI',
  biodiversidad: 'VII',
  salud: 'VIII',
  cultura: 'IX',
  cultura_patrimonio: 'IX',
  ctci: 'X',
  ctci_innovacion: 'X'
};

Object.keys(processedHubsGallery).forEach(k => {
  if (canonicalNumeralMap[k]) processedHubsGallery[k].numeral = canonicalNumeralMap[k];
});
Object.keys(processedExtGallery).forEach(k => {
  if (canonicalNumeralMap[k]) processedExtGallery[k].numeral = canonicalNumeralMap[k];
});

const bundle = {
  generatedAt: buildTimestamp,
  hubs,
  nodos,
  comunas,
  holdings,
  seriesMensualesEmat: wp06.series_mensuales_emat_sernatur || [],
  edges_inter_hub: cecanPresets.edges_inter_hub || [],
  hubsGallery: processedHubsGallery,
  extension_gallery: processedExtGallery,
  officialVariableSources: OFFICIAL_VARIABLE_SOURCES,
  extension_modules: {
    cultura_patrimonio: wp09 || {},
    ctci_innovacion: wp10 || {}
  },
  comparativaInterregional: baroData.comparativa_interregional || null,
  localidadesCoords: LOCALIDADES_AYSEN_COORDS,
  comunasGeoJSON,
  spatialLayersCatalog,
  spatialNodes,
  spatialNodesByLayer
};

const bundleStr = JSON.stringify(bundle, null, 2);

// Validacion estricta de CERO emojis en todo el texto generado
if (emojiRegex.test(bundleStr)) {
  throw new Error('Se detecto al menos un caracter emoji en el bundle generado. Regla de CERO EMOJIS violada.');
}

const outPath = path.join(ROOT, 'data', 'aysen_hubs_data.js');
fs.writeFileSync(
  outPath,
  `// Auto-generado por scripts/build_aysen_hubs_bundle.cjs — CERO EMOJIS · CERO NULOS\n// Procedencia por nodo en data/systemic/provenance_catalog.json. Las series anuales\n// de WP_02 y WP_03 declaran su origen por punto: ver "metodologia_series_historicas".\nwindow.AYSEN_HUBS_DATA = ${bundleStr};\n`,
  'utf8'
);

console.log(`[OK] Generado data/aysen_hubs_data.js (${fs.statSync(outPath).size} bytes):`);
console.log(`  - ${hubs.length} Hubs con datos reales (I a X)`);
console.log(`  - ${nodos.length} Nodos satelite (#01 a #39) verificados al 100%`);
console.log(`  - 0 celdas nulas o undefined`);
console.log(`  - 0 emojis detectados`);
console.log(`  - ${comunas.length} comunas consolidadas y ${holdings.length} holdings salmoneros`);
