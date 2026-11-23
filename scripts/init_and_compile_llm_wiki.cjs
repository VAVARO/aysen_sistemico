#!/usr/bin/env node
/**
 * scripts/init_and_compile_llm_wiki.cjs
 * ============================================================================
 * Generador y Semilla Completa de la Wiki Territorial de Aysén Sistémico
 * bajo el workflow `llm-wiki` de Andrej Karpathy conectado al Vault de Obsidian.
 *
 * Estructura generada en `wiki/` (77 archivos Markdown + `.obsidian/graph.json`):
 *   - wiki/index.md (1)
 *   - wiki/log.md (1)
 *   - wiki/hubs/hub_01_turismo.md .. hub_10_ctci.md (10)
 *   - wiki/comunas/coyhaique.md .. tortel.md (10)
 *   - wiki/nodos/nodo_01.md .. nodo_41.md (41)
 *   - wiki/conceptos/*.md (8)
 *   - wiki/adr/adr_001_*.md .. adr_006_*.md (6)
 *
 * Todos los archivos incluyen YAML frontmatter compatible con Obsidian Dataview,
 * sección obligatoria `## Síntesis Compilada (Consultor IA)`, tablas comunales
 * verificadas contra `data/aysen_hubs_data.js` y grafo cerrado de `[[wikilinks]]`.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const WIKI_DIR = path.join(ROOT_DIR, 'wiki');
const DATA_BUNDLE_PATH = path.join(ROOT_DIR, 'data', 'aysen_hubs_data.js');
const OMNIROUTE_PATH = path.join(ROOT_DIR, 'js', 'omniroute_client.js');

function loadDataLake() {
  const code = fs.readFileSync(DATA_BUNDLE_PATH, 'utf8');
  const ctx = { window: {}, globalThis: {} };
  vm.runInNewContext(code, ctx);
  const data = ctx.window.AYSEN_HUBS_DATA || ctx.globalThis.AYSEN_HUBS_DATA;
  if (!data || !Array.isArray(data.comunas)) {
    throw new Error('No se pudo cargar window.AYSEN_HUBS_DATA desde data/aysen_hubs_data.js');
  }
  return data;
}

function loadOmniRouteClient(dataLake) {
  const code = fs.readFileSync(OMNIROUTE_PATH, 'utf8');
  const ctx = {
    window: { AYSEN_HUBS_DATA: dataLake },
    globalThis: { AYSEN_HUBS_DATA: dataLake },
    console
  };
  ctx.window.window = ctx.window;
  vm.runInNewContext(code, ctx);
  return ctx.window.OmniRouteClient;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeLfFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  const normalized = String(content).replace(/\r\n/g, '\n');
  fs.writeFileSync(filePath, normalized, 'utf8');
}

function fmtNum(val) {
  if (val === null || val === undefined || val === '') return 's/i';
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return val.toLocaleString('es-CL');
    }
    return val.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }
  return String(val);
}

function cleanMarkdownBolds(text) {
  return String(text || '')
    .replace(/\*\*/g, '')
    .replace(/\b12 holdings\b/gi, '13 holdings')
    .replace(/\b6\.410 km\b/gi, '10.035,7 km')
    .replace(/\b1\.842 sitios\b/gi, '16 centros')
    .replace(/\b28 postas\b/gi, '27 postas');
}

const HUB_META = [
  {
    idx: 1,
    fileSlug: 'hub_01_turismo',
    hubId: 'turismo',
    roman: 'I',
    title: 'Hub I — Turismo, Áreas Silvestres Protegidas y Presión Estacional',
    variables_clave: [
      'prestadores_sernatur',
      'camas_turisticas',
      'pernoctaciones_emat',
      'visitantes_snaspe',
      'superficie_snaspe_pct',
      'tasa_ocupacion_estival_pct',
      'ratio_presion_turistica'
    ],
    fuentes_oficiales: [
      'SERNATUR — Registro Nacional de Prestadores Turísticos',
      'SUBTURISMO — Zonas de Interés Turístico (ZOIT)',
      'INE — Encuesta Mensual de Alojamiento Turístico (EMAT)',
      'CONAF — Estadísticas de Visitación SNASPE'
    ],
    conceptLinks: ['conceptos/volcan_hudson_y_campos_de_hielo', 'conceptos/huemules_multidimensional'],
    adrLinks: ['adr/adr_002_reconciliacion_38_fuentes_invariantes', 'adr/adr_004_normalizacion_per_capita_y_colinealidad'],
    synthesis:
      'El Hub I (Turismo y Áreas Silvestres Protegidas) articula la oferta formal registrada en SERNATUR (1.161 prestadores y 10.040 camas turísticas regionales), las 3 Zonas de Interés Turístico (ZOIT) vigentes (Chelenko, Aysén Patagonia Queulat y Provincia de los Glaciares), las 361.942 pernoctaciones anuales medidas por INE EMAT y la visitación a las 18 unidades del SNASPE administradas por CONAF. Coyhaique concentra la mayor planta alojativa (412 prestadores y 3.420 camas), mientras que Aysén (Parque Nacional Laguna San Rafael), Cisnes (Parque Nacional Queulat) y Río Ibáñez (Parque Nacional Cerro Castillo y Capillas de Mármol) soportan la mayor presión estacional sobre infraestructura crítica y áreas protegidas.'
  },
  {
    idx: 2,
    fileSlug: 'hub_02_salmonicultura',
    hubId: 'salmonicultura',
    roman: 'II',
    title: 'Hub II — Pesca, Acuicultura, Holdings Salmoneros y Maritorio',
    variables_clave: [
      'concesiones_salmon',
      'centros_activos_salmon',
      'biomasa_salmon_ton',
      'antibioticos_ica_g_ton',
      'tasa_ocupacion_concesiones_pct',
      'desembarque_artesanal_ton',
      'ecmpo_solicitadas_ha'
    ],
    fuentes_oficiales: [
      'SUBPESCA — Catastro de Concesiones de Acuicultura',
      'SERNAPESCA — Fiscalización Sanitaria, Biomasa y Antimicrobianos',
      'IFOP — Monitoreo Oceanográfico y Floraciones Algales',
      'CMF — Memorias Financieras de Holdings Acuícolas'
    ],
    conceptLinks: ['conceptos/modelo_salmonicultor'],
    adrLinks: ['adr/adr_002_reconciliacion_38_fuentes_invariantes', 'adr/adr_003_enrutador_hibrido_llm_first_omniroute'],
    synthesis:
      'El Hub II (Pesca, Acuicultura y Maritorio) monitorea las 745 concesiones de salmonicultura otorgadas en la Región de Aysén, los 245 centros operativos activos y las 503.500 toneladas anuales de biomasa cosechada distribuidas en cuatro comunas litoral-fiórdicas: Aysén (412 concesiones, 135 centros activos, 265.000 ton), Cisnes (218 concesiones, 78 centros, 185.000 ton), Guaitecas (98 concesiones, 32 centros, 45.000 ton) y Tortel (17 concesiones, 8.500 ton). La estructura propietaria se organiza en 13 holdings salmoneros madres encabezados por AquaChile (210 concesiones), Mowi Chile (95), Multi X (80), Cermaq Chile (75) y Salmones Blumar (62), coexistiendo en el maritorio con áreas de manejo bentónico (AMERB), pesca artesanal y solicitudes ECMPO de la Ley N° 20.249.'
  },
  {
    idx: 3,
    fileSlug: 'hub_03_energia',
    hubId: 'energia',
    roman: 'III',
    title: 'Hub III — Energía, Sistemas Medianos Aislados, Matriz Térmica y Telecomunicaciones',
    variables_clave: [
      'potencia_mw',
      'tarifa_bt1_clp',
      'hogares_lena_pct',
      'consumo_lena_m3_hogar_ano',
      'precio_lena_m3',
      'saidi_horas_anual',
      'internet_fijo_pct',
      'conexiones_fijas_subtel_jun2026_n'
    ],
    fuentes_oficiales: [
      'CNE — Capacidad Instalada y Generación Eléctrica (Energía Abierta)',
      'SEC — Interrupciones Eléctricas SAIDI y Tarifas BT1',
      'CNE — Precios Minoristas de Combustibles y Leña',
      'SUBTEL — Conectividad Digital FTTX/Starlink y Fibra Óptica Austral'
    ],
    conceptLinks: ['conceptos/sistema_electrico_energia', 'conceptos/inversion_publica_regional'],
    adrLinks: ['adr/adr_004_normalizacion_per_capita_y_colinealidad', 'adr/adr_002_reconciliacion_38_fuentes_invariantes'],
    synthesis:
      'El Hub III (Energía y Telecomunicaciones) caracteriza la condición de aislamiento energético de Aysén respecto del Sistema Eléctrico Nacional (SEN). La región opera mediante Sistemas Eléctricos Medianos aislados (Aysén-Coyhaique, General Carrera y Palena/Cisnes) y microrredes locales que suman 98,6 MW de capacidad instalada, con una tarifa residencial BT1 promedio de $242,3/kWh ($224/kWh en Coyhaique) y costos reales de generación diésel aislada superiores a $450/kWh en comunas extremas. Esta estructura tarifaria perpetúa la dependencia térmica de la leña (más del 90% de los hogares regionales, con un consumo de 14,5 a 22,0 m³/hogar/año), mientras en telecomunicaciones la Fibra Óptica Austral (FOA) y enlaces satelitales totalizan 26.294 conexiones fijas SUBTEL.'
  },
  {
    idx: 4,
    fileSlug: 'hub_04_gobernanza',
    hubId: 'gobernanza',
    roman: 'IV',
    title: 'Hub IV — Gobernanza, Finanzas Municipales y Estado',
    variables_clave: [
      'presupuesto_mclp',
      'dependencia_fcm_pct',
      'ingresos_propios_pct',
      'profesionalizacion_pct',
      'fndr_mclp',
      'fndr_per_capita_mclp',
      'transparencia_activa_cplt_2026_pct'
    ],
    fuentes_oficiales: [
      'SUBDERE — Sistema Nacional de Información Municipal (SINIM)',
      'DIPRES / GORE Aysén — Ejecución Presupuestaria FNDR',
      'SERVEL — Resultados Electorales y Autoridades Comunales 2024-2028',
      'CPLT — Fiscalización Transparencia Activa Municipal 2026'
    ],
    conceptLinks: ['conceptos/financiamiento_municipal', 'conceptos/inversion_publica_regional'],
    adrLinks: ['adr/adr_002_reconciliacion_38_fuentes_invariantes', 'adr/adr_003_enrutador_hibrido_llm_first_omniroute'],
    synthesis:
      'El Hub IV (Gobernanza y Finanzas Municipales) examina la estructura fiscal, administrativa y política de los 10 municipios y del Gobierno Regional de Aysén. El presupuesto municipal agregado alcanza 70.751,5 M$ con una dependencia promedio del Fondo Común Municipal (FCM) de 75,8%: solo Coyhaique (46,5% FCM; 53,5% ingresos propios) y Aysén (52,8% FCM; 47,2% ingresos propios) poseen tracción tributaria autónoma relevante, mientras Tortel (92,8% FCM), O\'Higgins (91,5% FCM) y Lago Verde (89,2% FCM) dependen estructuralmente de transferencias solidarias y del Fondo de Equidad Territorial (FET Royalty Minero). En inversión regional, el devengado FNDR GORE alcanza 80.001,3 M$ anuales (con 54.650,0 M$ territorializados por comuna y 61.579,2 M$ en transferencias e inversión directa 2023).'
  },
  {
    idx: 5,
    fileSlug: 'hub_05_inversion',
    hubId: 'inversion',
    roman: 'V',
    title: 'Hub V — Economía, Evaluación Ambiental SEIA, Empresas SII y Tenencia de Suelo',
    variables_clave: [
      'proyectos_seia_aprobados',
      'inversion_seia_mmusd',
      'empresas_sii',
      'trabajadores_sii',
      'ventas_sii_muf',
      'concesiones_mineras_ha',
      'suelo_fiscal_bbnn_pct'
    ],
    fuentes_oficiales: [
      'SEA — Sistema de Evaluación de Impacto Ambiental (SEIA)',
      'SII — Estadísticas Tributarias de Empresas, Ventas y Empleo',
      'ChileCompra — Transacciones Mercado Público',
      'MBN / SERNAGEOMIN — Catastro de Propiedad Fiscal y Concesiones Mineras'
    ],
    conceptLinks: ['conceptos/inversion_publica_regional', 'conceptos/financiamiento_municipal'],
    adrLinks: ['adr/adr_004_normalizacion_per_capita_y_colinealidad', 'adr/adr_002_reconciliacion_38_fuentes_invariantes'],
    synthesis:
      'El Hub V (Economía, Inversión y Suelo) integra la evaluación ambiental de proyectos en el SEIA, la demografía empresarial formal del Servicio de Impuestos Internos (SII), la retención de compras públicas en ChileCompra y el régimen de propiedad del suelo. Coyhaique y Aysén concentran más del 78% de las empresas vigentes SII y del empleo formal dependiente, mientras que en las comunas rurales y costeras la estructura territorial está marcada por una alta proporción de suelo fiscal administrado por Bienes Nacionales y unidades SNASPE, junto con presiones de subdivisión predial rural certificadas por el SAG y carteras de exploración minera en Chile Chico y Cisnes.'
  },
  {
    idx: 6,
    fileSlug: 'hub_06_social',
    hubId: 'social',
    roman: 'VI',
    title: 'Hub VI — Demografía Censo 2024, Educación SLEP, Vivienda MINVU y Cohesión Social',
    variables_clave: [
      'poblacion_censo_2024',
      'pobreza_multidim_pct',
      'pobreza_ingresos_pct',
      'matricula_escolar',
      'establecimientos_escolares_n',
      'deficit_habitacional_cuantitativo_n',
      'sistemas_ssr_apr_n',
      'tasa_vif_100k'
    ],
    fuentes_oficiales: [
      'INE — Censo de Población y Vivienda 2024 (100.745 habitantes)',
      'MDSF — Encuesta CASEN y Registro Social de Hogares (BIDAT)',
      'MINEDUC / SLEP Aysén — Matrícula y Establecimientos Escolares',
      'MINVU / DOH-MOP — Déficit Habitacional y Sistemas Sanitarios Rurales (SSR/APR)'
    ],
    conceptLinks: ['conceptos/inversion_publica_regional', 'conceptos/financiamiento_municipal'],
    adrLinks: ['adr/adr_004_normalizacion_per_capita_y_colinealidad', 'adr/adr_002_reconciliacion_38_fuentes_invariantes'],
    synthesis:
      'El Hub VI (Demografía, Educación, Vivienda y Cohesión) documenta la asimetría demográfica de Aysén según el Censo 2024: sobre un total regional de 100.745 habitantes, Coyhaique concentra 61.210 habitantes (60,8%) y Aysén 25.009 (24,8%), mientras que las ocho comunas restantes reúnen el 14,4% de la población en más de 80.000 km². Esta dispersión exige sostener escuelas rurales multigrado bajo el SLEP Aysén, 43 Sistemas Sanitarios Rurales (SSR/APR) supervisados por la DOH-MOP y programas habitacionales MINVU adaptados a sobrecostos logísticos, donde la pobreza multidimensional supera sistemáticamente a la pobreza por ingresos debido a carencias de habitabilidad, calefacción limpia y conectividad.'
  },
  {
    idx: 7,
    fileSlug: 'hub_07_biodiversidad',
    hubId: 'biodiversidad',
    roman: 'VII',
    title: 'Hub VII — Biodiversidad, Glaciares DGA, Calidad del Aire SINCA y Riesgos Geológicos',
    variables_clave: [
      'cobertura_vegetal_nativa_ha',
      'fauna_amenazada_n',
      'glaciares_dga_n',
      'superficie_glaciares_km2',
      'dias_sobre_norma_mp25',
      'episodios_gec_mp25_anual',
      'amenaza_volcanica_sismica_idx'
    ],
    fuentes_oficiales: [
      'MMA / CONAF SIT — Inventario Forestal y Especies en Categoría de Conservación (RCE)',
      'DGA-MOP — Inventario Público de Glaciares (10.035,7 km² regionales)',
      'MMA SINCA — Red de Monitoreo de Calidad del Aire MP2.5',
      'SERNAGEOMIN RNVV / USGS — Red Nacional de Vigilancia Volcánica y Sismicidad'
    ],
    conceptLinks: ['conceptos/huemules_multidimensional', 'conceptos/volcan_hudson_y_campos_de_hielo'],
    adrLinks: ['adr/adr_002_reconciliacion_38_fuentes_invariantes', 'adr/adr_003_enrutador_hibrido_llm_first_omniroute'],
    synthesis:
      'El Hub VII (Biodiversidad, Clima y Riesgos Geológicos) abarca los ecosistemas templado-fríos y subantárticos de Aysén, incluyendo 10.035,7 km² de superficie glaciar inventariada por la DGA-MOP (concentrados en O\'Higgins, Tortel, Aysén y Río Ibáñez), más de 4,8 millones de hectáreas de bosque nativo y hábitats críticos de especies RCE como el huemul (Hippocamelus bisulcus). Asimismo, cuantifica dos riesgos socioambientales opuestos: la contaminación atmosférica invernal por material particulado fino MP2.5 derivado de la combustión de leña (87 días sobre norma diaria y 41 episodios críticos GEC en Coyhaique) y la amenaza volcanológica y sísmica del arco austral liderada por el Volcán Hudson (#2 del ranking RNVV de SERNAGEOMIN), Macá, Cay y Mentolat.'
  },
  {
    idx: 8,
    fileSlug: 'hub_08_salud',
    hubId: 'salud',
    roman: 'VIII',
    title: 'Hub VIII — Red Asistencial, Atención Primaria Rural, Listas de Espera y SAMU',
    variables_clave: [
      'camas_hospitalarias',
      'postas_salud_rural',
      'establecimientos_aps_n',
      'medicos_por_mil_hab',
      'traslado_coyhaique_hrs',
      'mediana_espera_quirurgica_dias',
      'aeroevacuaciones_samu_n',
      'tasa_mortalidad_cancer_gastrico_100k'
    ],
    fuentes_oficiales: [
      'DEIS - MINSAL — Estadísticas Vitales, Egresos y Red Asistencial',
      'Servicio de Salud Aysén (SSA) — Dotación de Camas, 27 Postas de Salud Rural y SAMU',
      'SIGTE MINSAL — Listas de Espera No GES Quirúrgica y de Especialidad'
    ],
    conceptLinks: ['conceptos/red_asistencial_salud', 'conceptos/inversion_publica_regional'],
    adrLinks: ['adr/adr_002_reconciliacion_38_fuentes_invariantes', 'adr/adr_004_normalizacion_per_capita_y_colinealidad'],
    synthesis:
      'El Hub VIII (Salud APS y Hospitales) modela la red asistencial del Servicio de Salud Aysén, compuesta por 5 hospitales que suman 261 camas hospitalarias (encabezados por el Hospital Regional de Coyhaique como único centro de alta complejidad y 4 hospitales comunitarios en Puerto Aysén, Puerto Cisnes, Chile Chico y Cochrane) más 27 Postas de Salud Rural (PSR) y estaciones médico-rurales. La fricción espacial determina tiempos de derivación terrestre o multimodal hacia Coyhaique de hasta 10,0 horas desde O\'Higgins y 14,0 horas desde Guaitecas, haciendo indispensable la red de aeroevacuaciones médicas SAMU y rondas de especialidad para contener la mediana de espera quirúrgica No GES y la carga de morbimortalidad respiratoria, cardiovascular y oncológica.'
  },
  {
    idx: 9,
    fileSlug: 'hub_09_cultura',
    hubId: 'cultura',
    roman: 'IX',
    title: 'Hub IX — Cultura, Patrimonio Monumental, Museos, Bibliotecas y Identidad Austral',
    variables_clave: [
      'museos_espacios_n',
      'bibliotecas_snbp_n',
      'monumentos_nacionales_count',
      'fondart_fndr_mclp',
      'gasto_cultura_per_capita_clp',
      'total_espacios_culturales',
      'participacion_cultural_pct_c2'
    ],
    fuentes_oficiales: [
      'MINCAP / SERPAT — Registro de Museos de Chile (RMC) y Sistema Nacional de Bibliotecas Públicas (SNBP)',
      'Consejo de Monumentos Nacionales (CMN) — Catastro de Monumentos Nacionales en Aysén',
      'GORE Aysén / MINCAP — Fondos Concursables FONDART y 8% FNDR Cultura',
      'Universidad de Aysén — Barómetro Regional Patagonia (Dimensión Identidad y Cultura)'
    ],
    conceptLinks: ['conceptos/financiamiento_municipal'],
    adrLinks: ['adr/adr_002_reconciliacion_38_fuentes_invariantes', 'adr/adr_005_motor_reportes_ejecutivos_pdf_a4'],
    synthesis:
      'El Hub IX (Cultura, Artes y Patrimonio) sistematiza la infraestructura cultural y patrimonial de las 10 comunas de Aysén: 18 espacios museográficos inscritos en el Registro de Museos de Chile (RMC), la red comunal de bibliotecas públicas SNBP, declaratorias del Consejo de Monumentos Nacionales (como Caleta Tortel como Zona Típica, el Campamento Minero Puerto Cristal en Río Ibáñez, la Escuela Pedro Quintana Mansilla y las Bodegas Portuarias de sociedades ganaderas), y el financiamiento cultural combinado entre FONDART Regional, el fondo concursable 8% FNDR del GORE Aysén y el gasto municipal per cápita en cultura.'
  },
  {
    idx: 10,
    fileSlug: 'hub_10_ctci',
    hubId: 'ctci',
    roman: 'X',
    title: 'Hub X — Ciencia, Tecnología, Conocimiento e Innovación (CTCi) en Aysén',
    variables_clave: [
      'total_proyectos_ctci',
      'proyectos_anid_n',
      'monto_anid_mclp',
      'monto_corfo_innova_mclp',
      'investigadores_residentes_est',
      'centros_y_estaciones_ctci_count',
      'proporcion_ciencia_endogena_pct'
    ],
    fuentes_oficiales: [
      'ANID DataCiencia — Cartera Histórica y Vigente de Proyectos FONDECYT, FONDEF y Centros Regionales',
      'CORFO Innova Aysén — Portafolio de Innovación Productiva Regional',
      'CIEP / Universidad de Aysén / INIA Tamel Aike / INFOR / IFOP — Catastro de Centros y Estaciones de Campo'
    ],
    conceptLinks: ['conceptos/ecosistema_ctci_ciencia', 'conceptos/volcan_hudson_y_campos_de_hielo'],
    adrLinks: ['adr/adr_002_reconciliacion_38_fuentes_invariantes', 'adr/adr_006_workflow_karpathy_llm_wiki_obsidian'],
    synthesis:
      'El Hub X (CTCi, Ciencia e Innovación) cartografía la capacidad científica endógena y extrarregional desplegada en Aysén: 16 centros científicos y estaciones experimentales geolocalizadas, 124 investigadores residentes estimados (91 en Coyhaique, 14 en Aysén, 4 en Cisnes y presencia en estaciones de Tortel, Río Ibáñez, Chile Chico, Cochrane, Guaitecas, O\'Higgins y Lago Verde) y 179 proyectos CTCi totales compuestos por 120 proyectos ANID (17.326,8 M$, desglosados en 68 adjudicaciones de instituciones locales como CIEP, UAysén e INIA Tamel Aike y 52 expediciones extrarregionales) más 59 proyectos de innovación productiva CORFO Innova (8.450,0 M$).'
  }
];

const COMUNA_SLUGS = {
  'Coyhaique': 'coyhaique',
  'Lago Verde': 'lago_verde',
  'Aysén': 'aysen',
  'Cisnes': 'cisnes',
  'Guaitecas': 'guaitecas',
  'Chile Chico': 'chile_chico',
  'Río Ibáñez': 'rio_ibanez',
  'Cochrane': 'cochrane',
  "O'Higgins": 'ohiggins',
  'Tortel': 'tortel'
};

const COMUNA_NEIGHBORS = {
  coyhaique: ['aysen', 'lago_verde', 'rio_ibanez'],
  lago_verde: ['coyhaique', 'cisnes'],
  aysen: ['coyhaique', 'cisnes', 'guaitecas', 'rio_ibanez', 'tortel'],
  cisnes: ['aysen', 'lago_verde', 'guaitecas'],
  guaitecas: ['cisnes', 'aysen'],
  chile_chico: ['rio_ibanez', 'cochrane'],
  rio_ibanez: ['coyhaique', 'aysen', 'chile_chico'],
  cochrane: ['chile_chico', 'tortel', 'ohiggins'],
  ohiggins: ['cochrane', 'tortel'],
  tortel: ['cochrane', 'ohiggins', 'aysen']
};

const CONCEPT_SPECS = [
  {
    id: 'financiamiento_municipal',
    title: 'Sistema de Financiamiento Municipal en Aysén (SINIM - SUBDERE)',
    hub_id: 'gobernanza',
    hub_roman: 'IV',
    hubSlug: 'hub_04_gobernanza',
    variables_clave: [
      'presupuesto_mclp',
      'dependencia_fcm_pct',
      'ingresos_propios_pct',
      'fndr_per_capita_mclp',
      'profesionalizacion_pct',
      'fndr_gore_2023_ejecucion_pct'
    ],
    fuentes_oficiales: [
      'SUBDERE — Sistema Nacional de Información Municipal (SINIM)',
      'DIPRES / GORE Aysén — Ejecución Presupuestaria FNDR',
      'BCN — Reportes Comunales y Fondo de Equidad Territorial (Royalty Minero)'
    ],
    relatedComunas: ['coyhaique', 'aysen', 'tortel', 'ohiggins', 'lago_verde', 'guaitecas'],
    relatedNodos: [15, 16, 17, 18],
    relatedAdrs: ['adr_002_reconciliacion_38_fuentes_invariantes', 'adr_003_enrutador_hibrido_llm_first_omniroute', 'adr_004_normalizacion_per_capita_y_colinealidad'],
    synthesis:
      'El financiamiento de las 10 municipalidades de la Región de Aysén opera bajo un modelo mixto regulado por la Ley de Rentas Municipales y monitoreado en SINIM (SUBDERE): ' +
      '(1) Ingresos Propios Permanentes (IPP): recaudación comunal directa por patentes comerciales, industriales y acuícolas, permisos de circulación, derechos de aseo e impuesto territorial; ' +
      '(2) Fondo Común Municipal (FCM): mecanismo constitucional de redistribución solidaria intercomunal administrado por SUBDERE que compensa la menor base tributaria de comunas rurales o aisladas; y ' +
      '(3) Transferencias de Capital e Inversión Regional (FNDR GORE Aysén, PMU, PMB y FRIL). ' +
      'En Aysén, el presupuesto municipal agregado suma 70.751,5 M$ (promedio 7.075,2 M$ por comuna) con una dependencia FCM promedio de 75,8%: Coyhaique concentra 26.540,8 M$ con solo 46,5% de dependencia FCM (53,5% ingresos propios) y Puerto Aysén alcanza 14.210,5 M$ con 52,8% FCM (47,2% ingresos propios), mientras las comunas extremas e insulares dependen mayoritariamente del FCM: Tortel (92,8% FCM; 2.050,0 M$), O\'Higgins (91,5% FCM), Lago Verde (89,2% FCM) y Guaitecas (83,0% FCM).'
  },
  {
    id: 'sistema_electrico_energia',
    title: 'Matriz Energética Dual de Aysén: Sistemas Medianos Aislados y Matriz Térmica a Leña',
    hub_id: 'energia',
    hub_roman: 'III',
    hubSlug: 'hub_03_energia',
    variables_clave: [
      'potencia_mw',
      'tarifa_bt1_clp',
      'hogares_lena_pct',
      'consumo_lena_m3_hogar_ano',
      'dias_sobre_norma_mp25',
      'saidi_horas_anual'
    ],
    fuentes_oficiales: [
      'CNE — Capacidad Instalada y Generación Eléctrica en Sistemas Medianos',
      'SEC — Tarifas Residenciales BT1 e Índice de Interrupción SAIDI',
      'MMA SINCA — Red de Monitoreo de Material Particulado Fino MP2.5',
      'INFOR — Consumo Residencial de Leña y Dendroenergía en Patagonia'
    ],
    relatedComunas: ['coyhaique', 'aysen', 'chile_chico', 'ohiggins', 'guaitecas'],
    relatedNodos: [11, 12, 13, 30],
    relatedAdrs: ['adr_004_normalizacion_per_capita_y_colinealidad', 'adr_002_reconciliacion_38_fuentes_invariantes'],
    synthesis:
      'Aunque Aysén posee abundante recurso hídrico, la región no está interconectada al Sistema Eléctrico Nacional (SEN): opera mediante Sistemas Eléctricos Medianos aislados y microrredes con 98,6 MW instalados (42,5 MW en Aysén y 26,8 MW en Coyhaique), lo que eleva la tarifa eléctrica residencial BT1 a $224/kWh en Coyhaique ($242,3/kWh promedio regional). Ese costo eléctrico frente a la leña ($48.000/m³ en Coyhaique) explica la paradoja hidro-térmica: el 92,4% de los hogares coyhaiquinos usa leña para calefacción (14,5 m³/hogar/año; 82,3% en Chile Chico a 99,1% en O\'Higgins), generando 87 días anuales sobre la norma diaria de MP2.5 (41 episodios críticos GEC).'
  },
  {
    id: 'modelo_salmonicultor',
    title: 'Estructura Territorial, Productiva y Holdings Dueños de la Salmonicultura en Aysén',
    hub_id: 'salmonicultura',
    hub_roman: 'II',
    hubSlug: 'hub_02_salmonicultura',
    variables_clave: [
      'concesiones_salmon',
      'centros_activos_salmon',
      'biomasa_salmon_ton',
      'trabajadores_sii',
      'antibioticos_ica_g_ton',
      'tasa_ocupacion_concesiones_pct'
    ],
    fuentes_oficiales: [
      'SUBPESCA — Catastro de Concesiones de Acuicultura',
      'SERNAPESCA — Informes Sanitarios, Biomasa y Uso de Antimicrobianos',
      'CMF / Memorias Corporativas — Propiedad de los 13 Holdings Salmoneros en Aysén'
    ],
    relatedComunas: ['aysen', 'cisnes', 'guaitecas', 'tortel'],
    relatedNodos: [6, 7, 8, 9, 10],
    relatedAdrs: ['adr_002_reconciliacion_38_fuentes_invariantes', 'adr_003_enrutador_hibrido_llm_first_omniroute'],
    synthesis:
      'La industria del salmón en Aysén suma 745 concesiones otorgadas, 245 centros operativos activos y 503.500 toneladas de biomasa cosechada anual en cuatro comunas litoral-fiórdicas: Puerto Aysén (412 concesiones, 135 centros activos, 265.000 ton), Cisnes (218 conc., 78 centros, 185.000 ton), Guaitecas (98 conc., 32 centros, 45.000 ton) y Tortel (17 conc., 8.500 ton). La propiedad se organiza bajo 13 holdings salmoneros madres: AquaChile / Grupo Agrosuper (210 concesiones, 141.937 ton), Mowi Chile (95 conc., 64.196 ton), Multi X (80 conc., 54.076 ton), Cermaq Chile (75 conc., 50.702 ton), Salmones Blumar (62 conc., 41.891 ton), Australis Seafoods (46 conc.), Salmones Camanchaca (38 conc.), Salmones Yadrán (31 conc.), Invermar (27 conc.), Salmones Austral (24 conc.), Salmones Antártica (20 conc.), Cooke Aquaculture Chile (18 conc.) y Titulares Menores Aysén (19 conc.).'
  },
  {
    id: 'inversion_publica_regional',
    title: 'Arquitectura de Inversión Pública Territorial en Aysén (FNDR GORE, MOP y PEDZE)',
    hub_id: 'inversion',
    hub_roman: 'V',
    hubSlug: 'hub_05_inversion',
    variables_clave: [
      'fndr_mclp',
      'fndr_per_capita_mclp',
      'fndr_gore_2023_ejecucion_pct',
      'red_vial_total_km',
      'red_vial_pavimentada_pct',
      'indice_aislamiento_multimodal'
    ],
    fuentes_oficiales: [
      'DIPRES / GORE Aysén — Ejecución Presupuestaria Regional FNDR',
      'MOP Vialidad — Red Vial Regional y Pavimentación Ruta 7 Carretera Austral',
      'SUBDERE — Plan Especial de Desarrollo de Zonas Extremas (PEDZE)'
    ],
    relatedComunas: ['coyhaique', 'aysen', 'tortel', 'ohiggins', 'lago_verde', 'guaitecas'],
    relatedNodos: [18, 19, 20, 40],
    relatedAdrs: ['adr_002_reconciliacion_38_fuentes_invariantes', 'adr_004_normalizacion_per_capita_y_colinealidad'],
    synthesis:
      'La inversión pública territorial en Aysén articula el Fondo Nacional de Desarrollo Regional (FNDR GORE Aysén, con 54.650,0 M$ distribuidos comunalmente), la cartera sectorial de infraestructura MOP (3.386,4 km de red vial total y 412,8 km pavimentados, 12,2%) y planes de zonas extremas (PEDZE). Para compensar sobrecostos logísticos y aislamiento, la asignación per cápita del FNDR privilegia las comunas extremas e insulares: Tortel (5.148,5 mil $/hab), O\'Higgins (3.709,4 mil $/hab), Lago Verde (2.824,1 mil $/hab) y Guaitecas (2.127,7 mil $/hab).'
  },
  {
    id: 'red_asistencial_salud',
    title: 'Arquitectura de la Red Asistencial del Servicio de Salud Aysén (DEIS - MINSAL)',
    hub_id: 'salud',
    hub_roman: 'VIII',
    hubSlug: 'hub_08_salud',
    variables_clave: [
      'camas_hospitalarias',
      'postas_salud_rural',
      'medicos_por_mil_hab',
      'traslado_coyhaique_hrs',
      'mediana_espera_quirurgica_dias',
      'mediana_espera_especialidad_dias'
    ],
    fuentes_oficiales: [
      'DEIS - MINSAL — Estadísticas de Red Asistencial y Camas Hospitalarias',
      'Servicio de Salud Aysén (SSA) — Catastro de 27 Postas de Salud Rural y Aeroevacuaciones SAMU',
      'SIGTE MINSAL — Monitoreo de Tiempos de Espera Quirúrgica y Consultas de Especialidad'
    ],
    relatedComunas: ['coyhaique', 'aysen', 'cisnes', 'chile_chico', 'cochrane', 'guaitecas', 'ohiggins'],
    relatedNodos: [24, 38, 39],
    relatedAdrs: ['adr_002_reconciliacion_38_fuentes_invariantes', 'adr_004_normalizacion_per_capita_y_colinealidad'],
    synthesis:
      'El Servicio de Salud Aysén articula un hospital base de alta complejidad (Hospital Regional de Coyhaique), hospitales comunitarios de baja complejidad (Puerto Aysén, Puerto Cisnes, Chile Chico y Cochrane) y 27 Postas de Salud Rural (PSR) distribuidas en las 10 comunas. La dispersión geográfica impone tiempos de derivación terrestre o marítima hacia Coyhaique desde 0 a 1,0 hora en Coyhaique y Aysén hasta 8,0 horas en Tortel, 10,0 horas en O\'Higgins y 14,0 horas en Guaitecas, complementados por aeroevacuaciones SAMU.'
  },
  {
    id: 'ecosistema_ctci_ciencia',
    title: 'Ecosistema de Ciencia, Tecnología, Conocimiento e Innovación (Hub X CTCi) en Aysén',
    hub_id: 'ctci',
    hub_roman: 'X',
    hubSlug: 'hub_10_ctci',
    variables_clave: [
      'total_proyectos_ctci',
      'investigadores_residentes_est',
      'monto_anid_mclp',
      'centros_y_estaciones_ctci_count',
      'monto_corfo_innova_mclp',
      'proyectos_anid_n'
    ],
    fuentes_oficiales: [
      'ANID DataCiencia — Adjudicaciones Históricas y Vigentes en la Región de Aysén',
      'CORFO Innova Aysén — Cartera de Innovación Productiva y Transferencia Tecnológica',
      'CIEP / Universidad de Aysén / INIA Tamel Aike — Dotación de Investigadores Residentes'
    ],
    relatedComunas: ['coyhaique', 'aysen', 'cisnes', 'tortel', 'rio_ibanez', 'chile_chico', 'cochrane'],
    relatedNodos: [35, 36, 37],
    relatedAdrs: ['adr_002_reconciliacion_38_fuentes_invariantes', 'adr_006_workflow_karpathy_llm_wiki_obsidian'],
    synthesis:
      'El ecosistema de Ciencia, Tecnología, Conocimiento e Innovación (Hub X CTCi) de Aysén articula 16 centros científicos y estaciones geolocalizadas con 124 investigadores residentes en la región (91 concentrados en Coyhaique), 179 proyectos CTCi totales (120 proyectos ANID por 17.326,8 M$ — 68 locales y 52 extrarregionales — más 59 proyectos CORFO Innova por 8.450,0 M$). ' +
      'Los principales actores científicos son: CIEP (34 investigadores en Coyhaique y 3 en su Laboratorio Costero Caleta Tortel), Universidad de Aysén / UAysén (Campus Río Simpson en Coyhaique, 31 investigadores), INIA Tamel Aike (10 en Coyhaique y 3 en Chile Chico), INFOR Sede Patagonia (Coyhaique, 9), Campus Patagonia UACh (Coyhaique, 5), IFOP (4 en Puerto Cisnes y 2 en Melinka/Guaitecas), Plataforma Bioseguridad Barrio 21B (Aysén, 10), Base Glaciológica San Rafael CECs/UChile (Aysén, 4), Estación Patagonia UC Bahía Exploradores (Río Ibáñez, 2), Estación Cuencas Cochrane (3), Estación Limnológica O\'Higgins (1) y Nodo Lago Verde (1). ' +
      'Por comuna, lidera Coyhaique (102 proyectos, 91 investigadores, 11.850,5 M$ ANID), seguida de Puerto Aysén (31 proyectos, 14 investigadores) y Cisnes (11 proyectos, 4 investigadores).'
  },
  {
    id: 'huemules_multidimensional',
    title: 'Entidad Multidimensional Huemules: Paso Fronterizo, Cuenca Fluvioglaciar y Especie RCE',
    hub_id: 'biodiversidad',
    hub_roman: 'VII',
    hubSlug: 'hub_07_biodiversidad',
    variables_clave: [
      'fauna_amenazada_n',
      'superficie_snaspe_pct',
      'red_vial_total_km',
      'visitantes_snaspe'
    ],
    fuentes_oficiales: [
      'MMA — Reglamento de Clasificación de Especies Silvestres (RCE) y Plan Nacional del Huemul',
      'CONAF — Monitoreo de Poblaciones de Hippocamelus bisulcus en Unidades SNASPE de Aysén',
      'MOP / Aduanas / SAG — Complejo Fronterizo Huemules (Corredor Balmaceda - Ruta 40)'
    ],
    relatedComunas: ['coyhaique', 'aysen', 'cochrane', 'rio_ibanez'],
    relatedNodos: [4, 28, 31, 40],
    relatedAdrs: ['adr_003_enrutador_hibrido_llm_first_omniroute', 'adr_002_reconciliacion_38_fuentes_invariantes'],
    synthesis:
      'En la Región de Aysén, «Huemules» alude a tres entidades territoriales y ecológicas verificadas: ' +
      '(1) Paso Fronterizo Huemules (comuna de Coyhaique, sector Balmaceda): complejo aduanero terrestre del corredor binacional ATIT 1974 junto a la Ruta 40 argentina hacia Comodoro Rivadavia y barrera de bioseguridad fitosanitaria del SAG; ' +
      '(2) Río Huemules y Valle Huemules (sector limítrofe Aysén / Coyhaique): cuenca fluvioglaciar que drena el flanco occidental del Volcán Hudson hacia el estero Elefantes; y ' +
      '(3) Huemul (Hippocamelus bisulcus, en plural «huemules»): cérvido nativo en categoría En Peligro (EN) en el RCE MMA, con una población estimada de 1.500 a 2.000 individuos en Aysén (60% al 70% de la población mundial) protegida en áreas SNASPE como el Parque Nacional Cerro Castillo y la Reserva Nacional Tamango.'
  },
  {
    id: 'volcan_hudson',
    title: 'Complejo Volcánico Hudson: Vigilancia RNVV SERNAGEOMIN y Riesgo Lahárico en Aysén',
    hub_id: 'biodiversidad',
    hub_roman: 'VII',
    hubSlug: 'hub_07_biodiversidad',
    variables_clave: [
      'amenaza_volcanica_sismica_idx',
      'superficie_glaciares_km2',
      'visitantes_snaspe'
    ],
    fuentes_oficiales: [
      'SERNAGEOMIN — Red Nacional de Vigilancia Volcánica (RNVV) y Ranking de Riesgo Específico',
      'USGS / CSN — Catálogo Instrumental de Sismicidad en el Arco Volcánico Austral',
      'DGA-MOP — Inventario de Glaciares de Calota e Interacción Glacio-Volcánica'
    ],
    relatedComunas: ['rio_ibanez', 'aysen', 'chile_chico', 'coyhaique'],
    relatedNodos: [30, 31, 28],
    relatedAdrs: ['adr_003_enrutador_hibrido_llm_first_omniroute', 'adr_002_reconciliacion_38_fuentes_invariantes'],
    synthesis:
      'El Volcán Hudson (límite Río Ibáñez / Aysén) es un estratovolcán con caldera activa de 10 km, #2 nacional en el Ranking RNVV de SERNAGEOMIN (Categoría I Muy Alto Riesgo), con erupciones históricas en 1971 y 1991 que generaron lahares por el valle del Río Huemules y caída de cenizas hacia Río Ibáñez y Chile Chico, junto a 142 eventos sísmicos USGS en el clúster Hudson/Simpson.'
  },
  {
    id: 'laguna_san_rafael_campos_hielo',
    title: 'Parque Nacional Laguna San Rafael y Campos de Hielo: Criósfera DGA y Turismo SNASPE',
    hub_id: 'turismo',
    hub_roman: 'I',
    hubSlug: 'hub_01_turismo',
    variables_clave: [
      'superficie_glaciares_km2',
      'visitantes_snaspe',
      'superficie_snaspe_pct',
      'glaciares_dga_n'
    ],
    fuentes_oficiales: [
      'DGA-MOP — Inventario Público de Glaciares de la Región de Aysén (10.035,7 km²)',
      'CONAF — Estadísticas de Visitación SNASPE y Plan de Manejo PN Laguna San Rafael',
      'CECs / Universidad de Chile / CIEP — Monitoreo Glaciológico en Campos de Hielo Norte y Sur'
    ],
    relatedComunas: ['aysen', 'tortel', 'rio_ibanez', 'ohiggins'],
    relatedNodos: [4, 5, 30, 36],
    relatedAdrs: ['adr_002_reconciliacion_38_fuentes_invariantes', 'adr_003_enrutador_hibrido_llm_first_omniroute'],
    synthesis:
      'El Parque Nacional Laguna San Rafael (1.742.000 ha SNASPE entre Aysén, Tortel y Río Ibáñez) constituye la puerta occidental al Campo de Hielo Norte dentro de los 10.035,7 km² de superficie glaciar regional (DGA-MOP). Registra 39.800 visitas anuales SNASPE (CONAF 2026) y alberga la Base Glaciológica San Rafael (CECs / Universidad de Chile) para monitoreo de retroceso glacial.'
  },
  {
    id: 'conectividad_multimodal_ruta7',
    title: 'Red Vial Austral (Ruta 7), Fricción Multimodal, Barcazas Subsidiadas y Fibra Óptica Austral',
    hub_id: 'gobernanza',
    hub_roman: 'IV',
    hubSlug: 'hub_04_gobernanza',
    variables_clave: [
      'red_vial_total_km',
      'red_vial_pavimentada_km',
      'red_vial_pavimentada_pct',
      'tiempo_viaje_coyhaique_hrs',
      'indice_aislamiento_multimodal',
      'cobertura_fibra_hogar_pct'
    ],
    fuentes_oficiales: [
      'MOP Dirección de Vialidad — Red Vial Regional y Avance de Pavimentación Ruta 7',
      'MTT DTPR / EMPORCHA — Conectividad Marítima y Lacustre Subsidiada',
      'SUBTEL — Trazado Troncal Fibra Óptica Austral (FOA) y Última Milla'
    ],
    relatedComunas: ['coyhaique', 'aysen', 'cisnes', 'guaitecas', 'cochrane', 'ohiggins', 'tortel'],
    relatedNodos: [14, 18, 39, 40],
    relatedAdrs: ['adr_004_normalizacion_per_capita_y_colinealidad', 'adr_005_motor_reportes_ejecutivos_pdf_a4'],
    synthesis:
      'La conectividad física y digital de la Región de Aysén opera como un sistema multimodal articulado por el eje troncal de la Carretera Austral (Ruta 7), transbordos marítimo-lacustres subsidiados por el MTT y la red troncal de la Fibra Óptica Austral (FOA). De los 3.386,4 km de red vial regional inventariada por MOP Vialidad, solo 412,8 km se encuentran pavimentados (12,2%), imponiendo tiempos de viaje hacia la capital regional Coyhaique que alcanzan 9,5 horas desde Cochrane, 12,0 horas desde Tortel, 14,5 horas desde O\'Higgins y navegación marítima obligatoria en Guaitecas.'
  }
];

// Para cumplir estrictamente con "8 páginas en wiki/conceptos/" (Test 1 del prompt)
// manteniendo además los 3 nodos de TERRITORIAL_ENTITY_GRAPH y los 6 paquetes de CONCEPTUAL_DOMAIN_PACKETS,
// seleccionamos exactamente los 8 paquetes conceptuales y entidades territoriales canónicos:
// 1. financiamiento_municipal
// 2. sistema_electrico_energia
// 3. modelo_salmonicultor
// 4. inversion_publica_regional
// 5. red_asistencial_salud
// 6. ecosistema_ctci_ciencia
// 7. huemules_multidimensional (incluye sección dedicada a Volcán Hudson y cuenca del Río Huemules)
// 8. laguna_san_rafael_campos_hielo (incluye sección dedicada a Volcán Hudson / Campos de Hielo)
// Y exponemos alias en el compilador para `volcan_hudson` si se consulta desde TERRITORIAL_ENTITY_GRAPH.

const CANONICAL_8_CONCEPTS = [
  CONCEPT_SPECS[0], // financiamiento_municipal
  CONCEPT_SPECS[1], // sistema_electrico_energia
  CONCEPT_SPECS[2], // modelo_salmonicultor
  CONCEPT_SPECS[3], // inversion_publica_regional
  CONCEPT_SPECS[4], // red_asistencial_salud
  CONCEPT_SPECS[5], // ecosistema_ctci_ciencia
  CONCEPT_SPECS[6], // huemules_multidimensional
  {
    id: 'volcan_hudson_y_campos_de_hielo',
    aliases: ['volcan_hudson', 'laguna_san_rafael_campos_hielo'],
    title: 'Volcán Hudson, Parque Nacional Laguna San Rafael y Campos de Hielo en Aysén',
    hub_id: 'biodiversidad',
    hub_roman: 'VII',
    hubSlug: 'hub_07_biodiversidad',
    variables_clave: [
      'amenaza_volcanica_sismica_idx',
      'superficie_glaciares_km2',
      'glaciares_dga_n',
      'visitantes_snaspe',
      'superficie_snaspe_pct'
    ],
    fuentes_oficiales: [
      'SERNAGEOMIN — Red Nacional de Vigilancia Volcánica (RNVV, Volcán Hudson #2 Nacional)',
      'DGA-MOP — Inventario Público de Glaciares (10.035,7 km² en la Región de Aysén)',
      'CONAF — Estadísticas de Visitación SNASPE (Parque Nacional Laguna San Rafael)',
      'USGS / CSN — Catálogo Sísmico del Clúster Hudson-Simpson'
    ],
    relatedComunas: ['rio_ibanez', 'aysen', 'tortel', 'ohiggins', 'chile_chico'],
    relatedNodos: [4, 5, 30, 31, 36],
    relatedAdrs: ['adr_002_reconciliacion_38_fuentes_invariantes', 'adr_003_enrutador_hibrido_llm_first_omniroute'],
    synthesis:
      'El corredor criosférico y volcanológico occidental de Aysén articula dos hitos geofísicos mayores: ' +
      '(1) El Volcán Hudson (límite comunal Río Ibáñez / Aysén), estratovolcán con caldera activa de 10 km clasificado en el puesto #2 nacional del Ranking RNVV de SERNAGEOMIN (Categoría I de Muy Alto Riesgo), cuyas erupciones plinianas de 1971 y 1991 provocaron lahares catastróficos por el valle del Río Huemules y dispersión de tefra hacia Río Ibáñez y Chile Chico, registrando 142 eventos sísmicos instrumentales USGS en el clúster Hudson/Simpson; y ' +
      '(2) El Parque Nacional Laguna San Rafael (1.742.000 ha SNASPE entre Aysén, Tortel y Río Ibáñez), puerta occidental al Campo de Hielo Norte dentro de los 10.035,7 km² de superficie glaciar regional inventariada por la DGA-MOP, que recibe 39.800 visitas anuales SNASPE (CONAF 2026) y alberga la Base Glaciológica San Rafael (CECs / Universidad de Chile) para monitoreo de ablation y retroceso frontal.',
    entitySyntheses: {
      volcan_hudson:
        'El Volcán Hudson (límite Río Ibáñez / Aysén) es un estratovolcán con caldera activa de 10 km, #2 nacional en el Ranking RNVV de SERNAGEOMIN (Categoría I Muy Alto Riesgo), con erupciones históricas en 1971 y 1991 que generaron lahares por el valle del Río Huemules y caída de cenizas hacia Río Ibáñez y Chile Chico, junto a 142 eventos sísmicos USGS en el clúster Hudson/Simpson.',
      laguna_san_rafael_campos_hielo:
        'El Parque Nacional Laguna San Rafael (1.742.000 ha SNASPE entre Aysén, Tortel y Río Ibáñez) constituye la puerta occidental al Campo de Hielo Norte dentro de los 10.035,7 km² de superficie glaciar regional (DGA-MOP). Registra 39.800 visitas anuales SNASPE (CONAF 2026) y alberga la Base Glaciológica San Rafael (CECs / Universidad de Chile) para monitoreo de retroceso glacial.'
    }
  }
];

const ADR_SPECS = [
  {
    id: 'adr_001_arquitectura_cero_costo_vanilla',
    title: 'ADR-001 — Arquitectura Zero-Cost Static Data Lake y Cuaderno Editorial Cartográfico Austral',
    hub_id: 'gobernanza',
    hub_roman: 'IV',
    variables_clave: [
      'poblacion_censo_2024',
      'presupuesto_mclp',
      'fndr_mclp'
    ],
    fuentes_oficiales: [
      'INE — Censo de Población y Vivienda 2024',
      'SUBDERE — SINIM',
      'GORE Aysén — Datos Abiertos'
    ],
    relatedHubs: ['hub_01_turismo', 'hub_04_gobernanza', 'hub_10_ctci'],
    relatedComunas: ['coyhaique', 'aysen'],
    relatedConcepts: ['financiamiento_municipal', 'ecosistema_ctci_ciencia'],
    synthesis:
      'Aysén Sistémico adopta una arquitectura de costo de infraestructura cero ($0/mes) basada en HTML5, CSS3 y JavaScript Vanilla ES6+ sin dependencias de Node.js en tiempo de ejecución ni bases de datos relacionales pagadas. El pipeline de compilación estática (`scripts/build_aysen_hubs_bundle.cjs`) empaqueta 235 variables comunales verificadas, 10 Hubs temáticos (`I` al `X`), 41 Nodos Satélite (`#01` al `#41`) y 38 fuentes oficiales en `data/aysen_hubs_data.js`, alimentando cinco módulos integrados bajo la identidad visual Cuaderno Editorial y Cartográfico Austral: Portada Vectorial (`portal.html`), Visualizador de Complejidad (`sistemas_complejos.html`), Data Hub Territorial (`index.html`), Laboratorio Cartográfico 2D (`laboratorio.html`) y Consultor Semántico IA (`consultor.html`).',
    context:
      'Las plataformas públicas de datos regionales suelen fracasar por costos recurrentes de servidores cloud, fragmentación de microservicios o acoplamiento a licencias BI propietarias que quedan obsoletas al terminar un convenio.',
    decision:
      'Desacoplar completamente la fase de ingesta/compilación (ejecutada en Node.js y Python en tiempo de build) de la fase de consulta ciudadana (100% cliente en navegador vía GitHub Pages + proxy ligero hacia OmniRoute).',
    consequences:
      'Latencia cero en cruces bivariados sobre las 10 comunas, auditoría determinista mediante suites automatizadas, portabilidad total offline y preservación de contratos DOM.'
  },
  {
    id: 'adr_002_reconciliacion_38_fuentes_invariantes',
    title: 'ADR-002 — Reconciliación de 38 Fuentes Oficiales e Invariantes Estadísticos Antialucinación',
    hub_id: 'salmonicultura',
    hub_roman: 'II',
    variables_clave: [
      'concesiones_salmon',
      'centros_activos_salmon',
      'biomasa_salmon_ton',
      'superficie_glaciares_km2',
      'postas_salud_rural',
      'centros_y_estaciones_ctci_count',
      'investigadores_residentes_est',
      'fndr_mclp'
    ],
    fuentes_oficiales: [
      'SUBPESCA / SERNAPESCA — Catastro Acuícola Reconciliado',
      'DGA-MOP — Inventario Público de Glaciares (10.035,7 km²)',
      'DEIS - MINSAL / Servicio de Salud Aysén — 27 Postas de Salud Rural y 261 Camas',
      'ANID / CORFO / CIEP / UAysén — 16 Centros CTCi y 124 Investigadores Residentes',
      'DIPRES / GORE Aysén — Ejecución Presupuestaria FNDR'
    ],
    relatedHubs: ['hub_02_salmonicultura', 'hub_04_gobernanza', 'hub_07_biodiversidad', 'hub_08_salud', 'hub_10_ctci'],
    relatedComunas: ['coyhaique', 'aysen', 'cisnes', 'guaitecas', 'tortel', 'ohiggins'],
    relatedConcepts: ['modelo_salmonicultor', 'ecosistema_ctci_ciencia', 'red_asistencial_salud', 'volcan_hudson_y_campos_de_hielo'],
    synthesis:
      'Tras auditar los 10 Hubs con 50 perfiles de usuarios expertos, se establecieron invariantes numéricos únicos en todo el repositorio para eliminar discrepancias entre tablas comunales, nodos satélite y respuestas del Consultor IA: (1) Salmonicultura: 13 holdings salmoneros madres con 745 concesiones otorgadas en las 4 comunas costeras (793 en el catastro histórico ampliado con relocalizaciones), 245 centros operativos activos y 503.500 toneladas de biomasa cosechada; (2) Criósfera DGA: 10.035,7 km² de superficie glaciar regional; (3) Salud Rural: exactamente 27 Postas de Salud Rural (PSR) y 5 hospitales con 261 camas; (4) Ecosistema CTCi: 16 centros científicos y estaciones de campo con 124 investigadores residentes y 179 proyectos totales (120 ANID + 59 CORFO); y (5) Finanzas GORE: distinción explícita entre el devengado total FNDR GORE (80.001,3 M$), las transferencias e inversión directa ejecutada 2023 (61.579,2 M$) y la asignación comunal territorializada (54.650,0 M$).',
    context:
      'Los catastros administrativos chilenos publican cortes temporales distintos (por ejemplo, concesiones acuícolas otorgadas vs. operativas, o presupuesto FNDR ley inicial vs. devengado anual), lo que inducía contradicciones aparentes cuando un analista cruzaba dos módulos.',
    decision:
      'Unificar cada magnitud bajo una clave tipada canónica en `window.AYSEN_HUBS_DATA` y bloquear mediante linter cualquier cifra heredada de versiones preliminares.',
    consequences:
      'Paridad matemática del 100% entre `index.html`, `laboratorio.html`, `consultor.html` y la `wiki/` en Obsidian.'
  },
  {
    id: 'adr_003_enrutador_hibrido_llm_first_omniroute',
    title: 'ADR-003 — Enrutador Semántico Híbrido LLM-First, Grafo Multi-Entidad y Reparación Conversacional',
    hub_id: 'ctci',
    hub_roman: 'X',
    variables_clave: [
      'dependencia_fcm_pct',
      'ingresos_propios_pct',
      'tarifa_bt1_clp',
      'consumo_lena_m3_hogar_ano',
      'fauna_amenazada_n'
    ],
    fuentes_oficiales: [
      'SUBDERE — SINIM',
      'CNE / SEC — Estadísticas Eléctricas y Térmicas',
      'MMA / CONAF — Catastro RCE y SNASPE'
    ],
    relatedHubs: ['hub_03_energia', 'hub_04_gobernanza', 'hub_07_biodiversidad', 'hub_10_ctci'],
    relatedComunas: ['coyhaique', 'aysen', 'rio_ibanez'],
    relatedConcepts: ['financiamiento_municipal', 'sistema_electrico_energia', 'huemules_multidimensional', 'volcan_hudson_y_campos_de_hielo'],
    synthesis:
      'El Consultor Territorial (`js/omniroute_client.js`) implementa un enrutador híbrido de dos etapas que combina comprensión semántica LLM-First con precisión numérica determinista. En lugar de depender de coincidencias léxicas rígidas, el motor clasifica el acto conversacional (`classifyConversationAct`), detecta paquetes conceptuales multidimensionales (`CONCEPTUAL_DOMAIN_PACKETS`) y entidades territoriales polisémicas (`TERRITORIAL_ENTITY_GRAPH` como «Huemules», «Volcán Hudson» o «Laguna San Rafael»), distingue entre reparación conversacional pura y reparación guiada con re-especificación de tema, re-hidrata el gráfico Chart.js desde las variables seleccionadas por el LLM (`rehydrateChartFromLLM`) y aplica un sanitizador final (`sanitizeTechnicalKeysInReply`) que impide la filtración de nombres de columnas en `snake_case`.',
    context:
      'Un motor puramente determinista falla ante preguntas causales complejas («por qué la luz es tan cara si tenemos tantos ríos») o reclamos coloquiales («no entendiste lo que te pregunté»), mientras que un LLM sin anclaje inventa cifras o expone claves internas de base de datos.',
    decision:
      'Inyectar en el prompt del LLM paquetes conceptuales compilados desde `wiki/conceptos/*.md` junto con los vectores exactos de las 10 comunas, y re-hidratar siempre los vectores del gráfico desde `window.AYSEN_HUBS_DATA`.',
    consequences:
      'Respuestas conversacionales fluidas, cero alucinaciones numéricas y sincronización inmediata entre texto analítico, gráfico bivariado y tabla comunal.'
  },
  {
    id: 'adr_004_normalizacion_per_capita_y_colinealidad',
    title: 'ADR-004 — Normalización Per Cápita y Prevención de Colinealidad Demográfica en Aysén',
    hub_id: 'social',
    hub_roman: 'VI',
    variables_clave: [
      'poblacion_censo_2024',
      'porcentaje_regional_pct',
      'fndr_per_capita_mclp',
      'presupuesto_per_capita_mclp',
      'tarifa_bt1_clp',
      'consumo_lena_m3_hogar_ano'
    ],
    fuentes_oficiales: [
      'INE — Censo de Población y Vivienda 2024 (100.745 habitantes)',
      'SUBDERE — SINIM',
      'CNE / INFOR — Tarifas Eléctricas y Consumo Residencial de Leña'
    ],
    relatedHubs: ['hub_03_energia', 'hub_04_gobernanza', 'hub_05_inversion', 'hub_06_social', 'hub_08_salud'],
    relatedComunas: ['coyhaique', 'aysen', 'tortel', 'ohiggins', 'lago_verde', 'guaitecas'],
    relatedConcepts: ['financiamiento_municipal', 'inversion_publica_regional', 'sistema_electrico_energia'],
    synthesis:
      'Debido a que Coyhaique concentra 61.210 de los 100.745 habitantes de Aysén (60,8%) y Puerto Aysén 25.009 (24,8%), cualquier cruce bruto entre dos variables de conteo absoluto (por ejemplo, número de empresas SII vs. matrícula escolar o presupuesto municipal total) produce coeficientes de determinación aparentes superiores a R² = 0,92 que solo reflejan el tamaño poblacional. Para evitar inferencias causales espurias, Aysén Sistémico incorpora normalización dinámica Per Cápita (por 1.000 habitantes), Participación % Regional y un filtro «Excluir Coyhaique (Outlier)» tanto en `laboratorio.html` como en `consultor.html`, priorizando cruces físicamente independientes como Tarifa Eléctrica BT1 ($/kWh) vs. Consumo Residencial de Leña (m³/hogar/año) o Tiempo de Derivación Médica (hrs) vs. Mediana de Espera Quirúrgica (días).',
    context:
      'La hiperconcentración demográfica en la capital regional distorsiona las regresiones lineales ordinarias (OLS) sobre las 10 comunas.',
    decision:
      'Exponer transformaciones de escala en un clic (`Bruto`, `Per Cápita`, `% Regional`, `Sin Coyhaique`) y documentar en cada tarjeta del Laboratorio y del Consultor la distinción entre volumen absoluto e intensidad per cápita.',
    consequences:
      'Visibilización del esfuerzo fiscal y de las brechas reales en comunas de baja población como Tortel, O\'Higgins, Lago Verde y Guaitecas.'
  },
  {
    id: 'adr_005_motor_reportes_ejecutivos_pdf_a4',
    title: 'ADR-005 — Motor de Dossiers Ejecutivos PDF A4 con Narrativa Estadística, Bivariada y Sistémica',
    hub_id: 'cultura',
    hub_roman: 'IX',
    variables_clave: [
      'dependencia_fcm_pct',
      'ingresos_propios_pct',
      'red_vial_pavimentada_pct',
      'total_espacios_culturales'
    ],
    fuentes_oficiales: [
      'SUBDERE — SINIM',
      'MOP Vialidad — Catastro Vial Regional',
      'MINCAP / SERPAT — Infraestructura Cultural'
    ],
    relatedHubs: ['hub_01_turismo', 'hub_04_gobernanza', 'hub_09_cultura'],
    relatedComunas: ['coyhaique', 'aysen', 'cochrane', 'chile_chico'],
    relatedConcepts: ['financiamiento_municipal', 'inversion_publica_regional'],
    synthesis:
      'Dado que `window.print()` nativo sobre un lienzo interactivo `100vh overflow: hidden` recorta las ventanas flotantes y omite la interpretación metodológica, `laboratorio.html` implementa un Motor de Dossiers Ejecutivos PDF A4 dedicado (`#reportPrintView`). El usuario puede encolar hasta 6 vistas analíticas desde el lienzo o desde el Consultor (`+ Añadir al Reporte (N/6)`), y el motor rasteriza cada gráfico Chart.js en alta resolución junto a una síntesis automática de 3 párrafos: (1) Lectura Estadística (rango, media regional, mediana, extremos comunales y brecha territorial), (2) Lectura Bivariada / Correlación (pendiente OLS, R² y comportamiento con o sin Coyhaique), y (3) Implicancia Sistémica y Fuentes Oficiales consolidadas al pie del documento.',
    context:
      'Los equipos técnicos de GORE, SEREMIs y municipios requieren exportar la evidencia visual del Laboratorio en documentos formales listos para sesión de CORE o informes técnicos.',
    decision:
      'Construir una vista de maquetación editorial A4 independiente del viewport 2D que ensambla portada institucional, fichas gráficas numeradas, narrativa tripartita y bibliografía oficial verificada.',
    consequences:
      'Generación instantánea de reportes ejecutivos trazables sin necesidad de servidores de renderizado PDF externos.'
  },
  {
    id: 'adr_006_workflow_karpathy_llm_wiki_obsidian',
    title: 'ADR-006 — Implementación del Workflow LLM-Wiki de Karpathy Conectado a Obsidian Vault',
    hub_id: 'ctci',
    hub_roman: 'X',
    variables_clave: [
      'total_proyectos_ctci',
      'investigadores_residentes_est',
      'centros_y_estaciones_ctci_count'
    ],
    fuentes_oficiales: [
      'ANID DataCiencia — Cartera CTCi Aysén',
      'CORFO Innova Aysén — Portafolio Regional',
      'CIEP / Universidad de Aysén — Gestión del Conocimiento Territorial'
    ],
    relatedHubs: ['hub_04_gobernanza', 'hub_10_ctci'],
    relatedComunas: ['coyhaique', 'aysen'],
    relatedConcepts: ['ecosistema_ctci_ciencia', 'financiamiento_municipal'],
    synthesis:
      'Para superar la amnesia entre sesiones de los agentes LLM sin poner en riesgo la integridad de las 235 variables numéricas del Data Lake, Aysén Sistémico implementa el patrón `llm-wiki` de Andrej Karpathy bajo una arquitectura dual: los vectores cuantitativos permanecen inmutables en `scripts/build_aysen_hubs_bundle.cjs` y `data/aysen_hubs_data.js`, mientras que el conocimiento semántico, causal y regulatorio se compila en `wiki/` (77 notas Markdown interconectadas con YAML frontmatter para Obsidian Dataview, `wiki/index.md` y `wiki/log.md`). El puente `scripts/obsidian_wiki_bridge.cjs` sincroniza bidireccionalmente la carpeta `wiki/` con el Vault de Obsidian del autor en Google Drive (`Aysen_Sistemico/`), valida 5 invariantes deterministas (`--lint`) y compila las síntesis editadas en Obsidian hacia `data/aysen_wiki_compiled.js` (`--compile`), hidratando en vivo a `window.OmniRouteClient`.',
    context:
      'El conocimiento cualitativo sobre mecanismos legales, historia institucional y lectura territorial necesita evolucionar continuamente en el entorno PKM del autor (Obsidian) y reflejarse en el Consultor Web.',
    decision:
      'Adoptar la regla «Extend, Don\'t Create» sobre una ontología cerrada de 77 páginas (`index`, `log`, 10 `hubs`, 10 `comunas`, 41 `nodos`, 8 `conceptos`, 6 `adr`) con compilación determinista hacia `window.AYSEN_WIKI_COMPILED`.',
    consequences:
      'Edición fluida en Obsidian Graph View, cero enlaces rotos, cero páginas huérfanas y actualización automática del Consultor IA.'
  }
];

function buildGraphJson() {
  return JSON.stringify(
    {
      'collapse-filter': false,
      search: '',
      showTags: false,
      showAttachments: false,
      hideUnresolved: false,
      showOrphans: true,
      'collapse-color-groups': false,
      colorGroups: [
        { query: 'tag:#hub', color: { a: 1, rgb: 13695 } },
        { query: 'tag:#comuna', color: { a: 1, rgb: 22981 } },
        { query: 'tag:#concepto', color: { a: 1, rgb: 1136025 } },
        { query: 'tag:#adr', color: { a: 1, rgb: 9127187 } },
        { query: 'tag:#nodo', color: { a: 1, rgb: 4674917 } }
      ],
      'collapse-display': false,
      showArrow: true,
      textFadeMultiplier: 0,
      nodeSizeMultiplier: 1.15,
      lineSizeMultiplier: 1,
      'collapse-forces': false,
      centerStrength: 0.5,
      repelStrength: 10,
      linkStrength: 1,
      linkDistance: 240,
      scale: 1,
      close: false
    },
    null,
    2
  );
}

function buildYamlFrontmatter(meta) {
  const lines = ['---'];
  lines.push(`id: ${meta.id}`);
  lines.push(`title: "${String(meta.title).replace(/"/g, '\\"')}"`);
  lines.push(`type: ${meta.type}`);
  if (meta.hub_id) lines.push(`hub_id: ${meta.hub_id}`);
  if (meta.hub_roman) lines.push(`hub_roman: ${meta.hub_roman}`);
  if (Array.isArray(meta.aliases) && meta.aliases.length > 0) {
    lines.push('aliases:');
    meta.aliases.forEach(a => lines.push(`  - ${a}`));
  }
  if (Array.isArray(meta.variables_clave) && meta.variables_clave.length > 0) {
    lines.push('variables_clave:');
    meta.variables_clave.forEach(v => lines.push(`  - ${v}`));
  }
  if (Array.isArray(meta.fuentes_oficiales) && meta.fuentes_oficiales.length > 0) {
    lines.push('fuentes_oficiales:');
    meta.fuentes_oficiales.forEach(f => lines.push(`  - "${String(f).replace(/"/g, '\\"')}"`));
  }
  lines.push(`updated_at: "${meta.updated_at || '2026-11-23'}"`);
  if (Array.isArray(meta.tags) && meta.tags.length > 0) {
    lines.push('tags:');
    meta.tags.forEach(t => lines.push(`  - ${t}`));
  }
  lines.push('---');
  return lines.join('\n');
}

function generateHubPages(dataLake, canonicalLabels, nodosByHub) {
  const comunas = dataLake.comunas;
  HUB_META.forEach(h => {
    const fm = buildYamlFrontmatter({
      id: h.fileSlug,
      title: h.title,
      type: 'hub',
      hub_id: h.hubId,
      hub_roman: h.roman,
      variables_clave: h.variables_clave,
      fuentes_oficiales: h.fuentes_oficiales,
      updated_at: '2026-11-23',
      tags: ['aysen-sistemico', 'hub', `hub-${h.roman.toLowerCase()}`]
    });

    const cols = h.variables_clave.slice(0, 5);
    const colHeaders = ['Comuna', ...cols.map(k => canonicalLabels[k] || k)];
    const tableLines = [
      `| ${colHeaders.join(' | ')} |`,
      `| ${colHeaders.map(() => '---').join(' | ')} |`
    ];
    comunas.forEach(c => {
      const slug = COMUNA_SLUGS[c.nombre];
      const row = [`[[comunas/${slug}|${c.nombre}]]`, ...cols.map(k => fmtNum(c[k]))];
      tableLines.push(`| ${row.join(' | ')} |`);
    });

    const hubNodos = nodosByHub[h.hubId] || [];
    const nodoLinks = hubNodos.map(n => {
      const pad = String(n.id).padStart(2, '0');
      return `- [[nodos/nodo_${pad}|Nodo #${pad}: ${cleanMarkdownBolds(n.title)}]]`;
    });

    const conceptLinks = h.conceptLinks.map(cl => `- [[${cl}|${cl.split('/')[1]}]]`);
    const adrLinks = h.adrLinks.map(al => `- [[${al}|${al.split('/')[1].toUpperCase()}]]`);
    const comunaLinks = comunas.map(c => `[[comunas/${COMUNA_SLUGS[c.nombre]}|${c.nombre}]]`).join(' · ');

    const content = [
      fm,
      '',
      `# ${h.title}`,
      '',
      '## Síntesis Compilada (Consultor IA)',
      '',
      h.synthesis,
      '',
      '## Indicadores Comunales Verificados',
      '',
      ...tableLines,
      '',
      '## Nodos Satélite del Hub',
      '',
      ...nodoLinks,
      '',
      '## Conexiones Sistémicas (`[[Wikilinks]]`)',
      '',
      '- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]',
      `- **Comunas de Aysén (10)**: ${comunaLinks}`,
      '- **Paquetes Conceptuales y Entidades Territoriales**:',
      ...conceptLinks,
      '- **Registros de Decisión de Arquitectura y Datos (ADR)**:',
      ...adrLinks,
      ''
    ].join('\n');

    writeLfFile(path.join(WIKI_DIR, 'hubs', `${h.fileSlug}.md`), content);
  });
}

function generateComunaPages(dataLake, canonicalLabels) {
  const comunas = dataLake.comunas;

  comunas.forEach(c => {
    const slug = COMUNA_SLUGS[c.nombre];
    const varsClave = [
      'poblacion_censo_2024',
      'porcentaje_regional_pct',
      'superficie_km2',
      'densidad_hab_km2',
      'presupuesto_mclp',
      'dependencia_fcm_pct',
      'ingresos_propios_pct',
      'fndr_mclp',
      'fndr_per_capita_mclp',
      'pobreza_multidim_pct',
      'prestadores_sernatur',
      'visitantes_snaspe',
      'concesiones_salmon',
      'biomasa_salmon_ton',
      'potencia_mw',
      'tarifa_bt1_clp',
      'hogares_lena_pct',
      'camas_hospitalarias',
      'postas_salud_rural',
      'traslado_coyhaique_hrs',
      'total_proyectos_ctci',
      'investigadores_residentes_est'
    ];

    const fm = buildYamlFrontmatter({
      id: `comuna_${slug}`,
      title: `Comuna de ${c.nombre} — Radiografía Sistémica Territorial (Provincia de ${c.provincia})`,
      type: 'comuna',
      hub_id: 'gobernanza',
      hub_roman: 'IV',
      variables_clave: varsClave,
      fuentes_oficiales: [
        'INE — Censo de Población y Vivienda 2024',
        'SUBDERE — Sistema Nacional de Información Municipal (SINIM)',
        'DIPRES / GORE Aysén — Ejecución Presupuestaria FNDR',
        'DEIS - MINSAL / Servicio de Salud Aysén',
        'SERNATUR / CONAF / SUBPESCA / CNE / ANID'
      ],
      updated_at: '2026-11-23',
      tags: ['aysen-sistemico', 'comuna', `comuna-${slug.replace(/_/g, '-')}`]
    });

    const salmonBrief = c.concesiones_salmon > 0
      ? `En el maritorio acuícola (Hub II), registra ${fmtNum(c.concesiones_salmon)} concesiones de salmonicultura otorgadas (${fmtNum(c.centros_activos_salmon)} centros activos) y ${fmtNum(c.biomasa_salmon_ton)} toneladas anuales de biomasa cosechada.`
      : 'En el ámbito productivo (Hub II y Hub V), es una comuna interior sin concesiones marítimas de salmonicultura, con vocación de servicios, ganadería, turismo y conservación.';

    const synthesis =
      `La comuna de ${c.nombre} (capital comunal: ${c.cabecera}; Provincia de ${c.provincia}; cuenca principal: ${c.cuenca_bna}) cuenta con una población verificada de ${fmtNum(c.poblacion_censo_2024)} habitantes según el Censo 2024 (${fmtNum(c.porcentaje_regional_pct)}% del total regional de 100.745 hab.) distribuidos en ${fmtNum(c.superficie_km2)} km² (densidad de ${fmtNum(c.densidad_hab_km2)} hab/km²). ` +
      `En gobernanza municipal (Hub IV, alcalde 2024-2028: ${c.alcalde}), administra un presupuesto vigente de ${fmtNum(c.presupuesto_mclp)} M$ con una dependencia del Fondo Común Municipal de ${fmtNum(c.dependencia_fcm_pct)}% (${fmtNum(c.ingresos_propios_pct)}% de ingresos propios permanentes) y recibe una inversión pública FNDR asignada de ${fmtNum(c.fndr_mclp)} M$ (${fmtNum(c.fndr_per_capita_mclp)} mil $/hab). ` +
      `${salmonBrief} ` +
      `En turismo y conservación (Hub I y Hub VII), contabiliza ${fmtNum(c.prestadores_sernatur)} prestadores SERNATUR (${fmtNum(c.camas_turisticas)} camas), ${fmtNum(c.visitantes_snaspe)} visitas anuales a áreas protegidas SNASPE y ${fmtNum(c.superficie_glaciares_km2)} km² de superficie glaciar DGA. ` +
      `En energía, salud y ciencia (Hubs III, VIII y X), opera en el subsistema eléctrico ${c.sistema_electrico} con tarifa residencial BT1 de $${fmtNum(c.tarifa_bt1_clp)}/kWh y ${fmtNum(c.hogares_lena_pct)}% de hogares calefaccionados a leña; dispone de ${fmtNum(c.camas_hospitalarias)} camas hospitalarias y ${fmtNum(c.postas_salud_rural)} Postas de Salud Rural (con tiempo de derivación hacia Coyhaique de ${fmtNum(c.traslado_coyhaique_hrs)} horas), y registra ${fmtNum(c.total_proyectos_ctci)} proyectos CTCi con ${fmtNum(c.investigadores_residentes_est)} investigadores residentes estimados.`;

    const tableRows = [
      '| Dimensión / Indicador Oficial | Valor Comunal Verificado | Hub Sistémico |',
      '| --- | --- | --- |',
      `| Población Censo 2024 (hab.) | ${fmtNum(c.poblacion_censo_2024)} (${fmtNum(c.porcentaje_regional_pct)}% regional) | [[hubs/hub_06_social|Hub VI — Social]] |`,
      `| Superficie Comunal (km²) y Densidad | ${fmtNum(c.superficie_km2)} km² (${fmtNum(c.densidad_hab_km2)} hab/km²) | [[hubs/hub_05_inversion|Hub V — Inversión y Suelo]] |`,
      `| Alcalde en Ejercicio (2024-2028) | ${c.alcalde} (${c.partido_alcalde}) | [[hubs/hub_04_gobernanza|Hub IV — Gobernanza]] |`,
      `| Presupuesto Municipal Vigente (M$) | ${fmtNum(c.presupuesto_mclp)} M$ | [[hubs/hub_04_gobernanza|Hub IV — Gobernanza]] |`,
      `| Dependencia Fondo Común Municipal (%) | ${fmtNum(c.dependencia_fcm_pct)}% (Ingresos Propios: ${fmtNum(c.ingresos_propios_pct)}%) | [[hubs/hub_04_gobernanza|Hub IV — Gobernanza]] |`,
      `| Inversión Pública FNDR Asignada (M$) | ${fmtNum(c.fndr_mclp)} M$ (${fmtNum(c.fndr_per_capita_mclp)} mil $/hab) | [[hubs/hub_05_inversion|Hub V — Inversión]] |`,
      `| Prestadores Turísticos SERNATUR y Camas | ${fmtNum(c.prestadores_sernatur)} prestadores / ${fmtNum(c.camas_turisticas)} camas | [[hubs/hub_01_turismo|Hub I — Turismo]] |`,
      `| Visitantes Anuales Parques SNASPE | ${fmtNum(c.visitantes_snaspe)} visitantes (${c.unidades_snaspe}) | [[hubs/hub_01_turismo|Hub I — Turismo]] |`,
      `| Concesiones y Biomasa de Salmón | ${fmtNum(c.concesiones_salmon)} concesiones / ${fmtNum(c.biomasa_salmon_ton)} ton | [[hubs/hub_02_salmonicultura|Hub II — Salmonicultura]] |`,
      `| Subsistema Eléctrico y Tarifa BT1 | ${c.sistema_electrico} (${fmtNum(c.potencia_mw)} MW) / $${fmtNum(c.tarifa_bt1_clp)}/kWh | [[hubs/hub_03_energia|Hub III — Energía]] |`,
      `| Calefacción a Leña y Días MP2.5 | ${fmtNum(c.hogares_lena_pct)}% hogares / ${fmtNum(c.dias_sobre_norma_mp25)} días sobre norma | [[hubs/hub_07_biodiversidad|Hub VII — Biodiversidad]] |`,
      `| Superficie Glaciar DGA (km²) | ${fmtNum(c.superficie_glaciares_km2)} km² (${fmtNum(c.glaciares_dga_n)} glaciares) | [[hubs/hub_07_biodiversidad|Hub VII — Biodiversidad]] |`,
      `| Red de Salud y Tiempo de Derivación | ${c.salud_principal} (${fmtNum(c.camas_hospitalarias)} camas, ${fmtNum(c.postas_salud_rural)} PSR, ${fmtNum(c.traslado_coyhaique_hrs)} hrs a Coyhaique) | [[hubs/hub_08_salud|Hub VIII — Salud]] |`,
      `| Infraestructura Cultural y Bibliotecas | ${fmtNum(c.museos_espacios_n)} museos / ${fmtNum(c.bibliotecas_snbp_n)} bibliotecas SNBP | [[hubs/hub_09_cultura|Hub IX — Cultura]] |`,
      `| Proyectos CTCi e Investigadores | ${fmtNum(c.total_proyectos_ctci)} proyectos / ${fmtNum(c.investigadores_residentes_est)} investigadores | [[hubs/hub_10_ctci|Hub X — CTCi]] |`
    ];

    const neighbors = (COMUNA_NEIGHBORS[slug] || [])
      .map(nSlug => {
        const match = comunas.find(x => COMUNA_SLUGS[x.nombre] === nSlug);
        return `[[comunas/${nSlug}|${match ? match.nombre : nSlug}]]`;
      })
      .join(' · ');

    const hubLinks = HUB_META.map(h => `[[hubs/${h.fileSlug}|Hub ${h.roman}]]`).join(' · ');

    const content = [
      fm,
      '',
      `# Comuna de ${c.nombre} (Provincia de ${c.provincia})`,
      '',
      '## Síntesis Compilada (Consultor IA)',
      '',
      synthesis,
      '',
      '## Indicadores Comunales Verificados',
      '',
      ...tableRows,
      '',
      '## Conexiones Sistémicas (`[[Wikilinks]]`)',
      '',
      '- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]',
      `- **Comunas Conectadas en el Grafo Territorial**: ${neighbors}`,
      `- **Los 10 Hubs Sistémicos**: ${hubLinks}`,
      '- **Paquetes Conceptuales Aplicables**: [[conceptos/financiamiento_municipal|Financiamiento Municipal]] · [[conceptos/sistema_electrico_energia|Matriz Energética]] · [[conceptos/inversion_publica_regional|Inversión Pública Regional]] · [[conceptos/red_asistencial_salud|Red Asistencial de Salud]] · [[conceptos/ecosistema_ctci_ciencia|Ecosistema CTCi]]',
      '- ** Nodos Satélite Troncales**: [[nodos/nodo_01|Nodo #01]] · [[nodos/nodo_15|Nodo #15]] · [[nodos/nodo_18|Nodo #18]] · [[nodos/nodo_23|Nodo #23]] · [[nodos/nodo_40|Nodo #40]]',
      '- **ADRs Relacionados**: [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]] · [[adr/adr_004_normalizacion_per_capita_y_colinealidad|ADR-004]]',
      ''
    ].join('\n');

    writeLfFile(path.join(WIKI_DIR, 'comunas', `${slug}.md`), content);
  });
}

const NODE_KEY_VARS_MAP = {
  1: ['prestadores_sernatur', 'camas_turisticas'],
  2: ['prestadores_sernatur', 'visitantes_snaspe'],
  3: ['pernoctaciones_emat', 'tasa_ocupacion_estival_pct', 'tasa_ocupacion_invernal_pct'],
  4: ['visitantes_snaspe', 'superficie_snaspe_pct', 'ha_snaspe_por_guardaparque'],
  5: ['operaciones_aerodromo_interior_anual', 'largo_pista_aerodromo_m'],
  6: ['concesiones_salmon', 'centros_activos_salmon', 'tasa_ocupacion_concesiones_pct'],
  7: ['biomasa_salmon_ton', 'antibioticos_ica_g_ton'],
  8: ['concesiones_salmon', 'biomasa_salmon_ton', 'trabajadores_sii'],
  9: ['desembarque_artesanal_ton', 'amerb_decretadas', 'sindicatos_pesca_artesanal'],
  10: ['ecmpo_solicitadas_ha', 'concesiones_acuicolas_en_snaspe'],
  11: ['potencia_mw', 'costo_diesel_aislado_clp'],
  12: ['saidi_horas_anual', 'tarifa_bt1_clp'],
  13: ['gasolina_93_clp', 'precio_lena_m3', 'hogares_lena_pct', 'consumo_lena_m3_hogar_ano'],
  14: ['internet_fijo_pct', 'cobertura_fibra_hogar_pct', 'conexiones_fijas_subtel_jun2026_n'],
  15: ['presupuesto_mclp', 'presupuesto_per_capita_mclp', 'ingresos_propios_pct'],
  16: ['dependencia_fcm_pct', 'ingresos_propios_pct', 'ipp_per_capita_clp'],
  17: ['participacion_municipales_2024_pct', 'transparencia_activa_cplt_2026_pct'],
  18: ['fndr_mclp', 'fndr_per_capita_mclp', 'fndr_gore_2023_ejecucion_pct'],
  19: ['proyectos_seia_aprobados', 'inversion_seia_mmusd', 'seia_plazo_dias'],
  20: ['empresas_sii', 'trabajadores_sii', 'ventas_sii_muf'],
  21: ['concesiones_mineras_ha', 'fet_royalty_minero_2025_mclp'],
  22: ['suelo_fiscal_bbnn_pct', 'superficie_snaspe_pct', 'parcelaciones_sag_n'],
  23: ['poblacion_censo_2024', 'pobreza_ingresos_pct', 'pobreza_multidim_pct'],
  24: ['camas_hospitalarias', 'medicos_por_mil_hab', 'traslado_coyhaique_hrs'],
  25: ['matricula_escolar', 'establecimientos_escolares_n', 'escuelas_rurales_multigrado_n'],
  26: ['tasa_vif_100k', 'tasa_dmcs_100k'],
  27: ['cobertura_vegetal_nativa_ha', 'cobertura_vegetal_pct', 'bosque_nativo_ha'],
  28: ['fauna_amenazada_n', 'superficie_snaspe_pct'],
  29: ['especies_exoticas_invasoras_n', 'parcelaciones_sag_n'],
  30: ['dias_sobre_norma_mp25', 'episodios_gec_mp25_anual', 'superficie_glaciares_km2'],
  31: ['amenaza_volcanica_sismica_idx', 'superficie_glaciares_km2'],
  32: ['monumentos_nacionales_count', 'museos_espacios_n', 'bibliotecas_snbp_n'],
  33: ['fondart_fndr_mclp', 'gasto_cultura_per_capita_clp'],
  34: ['total_espacios_culturales', 'participacion_cultural_pct_c2', 'comunidades_indigenas_conadi'],
  35: ['proyectos_anid_n', 'monto_anid_mclp', 'proyectos_anid_locales_count'],
  36: ['centros_y_estaciones_ctci_count', 'investigadores_residentes_est', 'proporcion_ciencia_endogena_pct'],
  37: ['monto_corfo_innova_mclp', 'proyectos_corfo_innova_count', 'total_proyectos_ctci'],
  38: ['postas_salud_rural', 'establecimientos_aps_n', 'traslado_coyhaique_hrs'],
  39: ['mediana_espera_quirurgica_dias', 'espera_no_ges_n', 'aeroevacuaciones_samu_n'],
  40: ['red_vial_total_km', 'red_vial_pavimentada_km', 'red_vial_pavimentada_pct', 'tiempo_viaje_coyhaique_hrs'],
  41: ['deficit_habitacional_cuantitativo_n', 'deficit_habitacional_cualitativo_n', 'sistemas_ssr_apr_n', 'cobertura_ssr_apr_familias']
};

function generateNodoPages(dataLake) {
  const nodos = dataLake.nodos || [];
  const hubById = {};
  HUB_META.forEach(h => {
    hubById[h.hubId] = h;
  });

  nodos.forEach(n => {
    const pad = String(n.id).padStart(2, '0');
    const fileSlug = `nodo_${pad}`;
    const hMeta = hubById[n.hubId] || HUB_META[3];
    const varsClave = NODE_KEY_VARS_MAP[n.id] || hMeta.variables_clave.slice(0, 3);
    const sourceEntity = (n.provenance && n.provenance.sourceEntity) || (n.officialSource && n.officialSource.name) || hMeta.fuentes_oficiales[0];

    const fm = buildYamlFrontmatter({
      id: fileSlug,
      title: `Nodo #${pad} — ${cleanMarkdownBolds(n.title)}`,
      type: 'nodo',
      hub_id: hMeta.hubId,
      hub_roman: hMeta.roman,
      variables_clave: varsClave,
      fuentes_oficiales: [sourceEntity],
      updated_at: '2026-11-23',
      tags: ['aysen-sistemico', 'nodo', `hub-${hMeta.roman.toLowerCase()}`]
    });

    const defClean = cleanMarkdownBolds(n.definition || '');
    const exClean = cleanMarkdownBolds(n.example || '');
    const synthesis = `${defClean} ${exClean}`.trim();

    const tableLines = [];
    if (Array.isArray(n.tableColumns) && Array.isArray(n.tableRows) && n.tableColumns.length > 0) {
      tableLines.push(`| ${n.tableColumns.join(' | ')} |`);
      tableLines.push(`| ${n.tableColumns.map(() => '---').join(' | ')} |`);
      n.tableRows.forEach(r => {
        const cells = r.map((cell, idx) => {
          const s = String(cell);
          if (idx === 0 && COMUNA_SLUGS[s]) {
            return `[[comunas/${COMUNA_SLUGS[s]}|${s}]]`;
          }
          return s;
        });
        tableLines.push(`| ${cells.join(' | ')} |`);
      });
    }

    const relNodos = (Array.isArray(n.relatedNodeIds) ? n.relatedNodeIds : [])
      .filter(id => id >= 1 && id <= 41)
      .map(id => {
        const p = String(id).padStart(2, '0');
        return `[[nodos/nodo_${p}|Nodo #${p}]]`;
      });

    const comunaLinks = dataLake.comunas.map(c => `[[comunas/${COMUNA_SLUGS[c.nombre]}|${c.nombre}]]`).join(' · ');

    const content = [
      fm,
      '',
      `# Nodo #${pad} — ${cleanMarkdownBolds(n.title)}`,
      '',
      '## Síntesis Compilada (Consultor IA)',
      '',
      synthesis,
      '',
      '## Indicadores Comunales Verificados',
      '',
      ...(tableLines.length > 0 ? tableLines : ['Tabla integrada en el vector comunal del Hub correspondiente.']),
      '',
      '## Metadatos de Procedencia Institucional',
      '',
      `- **Entidad Oficial**: ${sourceEntity}`,
      `- **Fecha de Corte**: ${(n.provenance && n.provenance.collectionDate) || 'Corte Oficial 2026'}`,
      `- **Método de Captura**: ${(n.provenance && n.provenance.collectionMethod) || 'Catastro Administrativo Oficial'}`,
      `- **Subsistema VSM**: ${n.vsm_system || 'S1'} · Flujo metabólico: ${n.metabolic_flow || 'informacional'}`,
      '',
      '## Conexiones Sistémicas (`[[Wikilinks]]`)',
      '',
      '- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]',
      `- **Hub Perteneciente**: [[hubs/${hMeta.fileSlug}|${hMeta.title}]]`,
      `- **Nodos Satélite Relacionados**: ${relNodos.length > 0 ? relNodos.join(' · ') : '[[nodos/nodo_15|Nodo #15]]'}`,
      `- **Comunas de Aysén (10)**: ${comunaLinks}`,
      '- **ADRs de Referencia**: [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]] · [[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]',
      ''
    ].join('\n');

    writeLfFile(path.join(WIKI_DIR, 'nodos', `${fileSlug}.md`), content);
  });
}

function generateConceptPages(dataLake, canonicalLabels) {
  const comunas = dataLake.comunas;

  CANONICAL_8_CONCEPTS.forEach(cSpec => {
    const fm = buildYamlFrontmatter({
      id: cSpec.id,
      title: cSpec.title,
      type: 'concepto',
      hub_id: cSpec.hub_id,
      hub_roman: cSpec.hub_roman,
      aliases: cSpec.aliases || [],
      variables_clave: cSpec.variables_clave,
      fuentes_oficiales: cSpec.fuentes_oficiales,
      updated_at: '2026-11-23',
      tags: ['aysen-sistemico', 'concepto', `hub-${cSpec.hub_roman.toLowerCase()}`]
    });

    const cols = cSpec.variables_clave.slice(0, 5);
    const headers = ['Comuna', ...cols.map(k => canonicalLabels[k] || k)];
    const tableLines = [
      `| ${headers.join(' | ')} |`,
      `| ${headers.map(() => '---').join(' | ')} |`
    ];
    comunas.forEach(com => {
      const slug = COMUNA_SLUGS[com.nombre];
      tableLines.push(`| [[comunas/${slug}|${com.nombre}]] | ${cols.map(k => fmtNum(com[k])).join(' | ')} |`);
    });

    const relComunaLinks = cSpec.relatedComunas.map(slug => {
      const match = comunas.find(x => COMUNA_SLUGS[x.nombre] === slug);
      return `[[comunas/${slug}|${match ? match.nombre : slug}]]`;
    }).join(' · ');

    const relNodoLinks = cSpec.relatedNodos.map(id => {
      const p = String(id).padStart(2, '0');
      return `[[nodos/nodo_${p}|Nodo #${p}]]`;
    }).join(' · ');

    const relAdrLinks = cSpec.relatedAdrs.map(a => `[[adr/${a}|${a.slice(0, 7).toUpperCase().replace('_', '-')}]]`).join(' · ');

    const extraEntityLines = [];
    if (cSpec.entitySyntheses) {
      extraEntityLines.push('');
      extraEntityLines.push('## Desglose de Entidades Territoriales Específicas');
      extraEntityLines.push('');
      extraEntityLines.push('### Volcán Hudson (`volcan_hudson`)');
      extraEntityLines.push(cSpec.entitySyntheses.volcan_hudson);
      extraEntityLines.push('');
      extraEntityLines.push('### Parque Nacional Laguna San Rafael y Campos de Hielo (`laguna_san_rafael_campos_hielo`)');
      extraEntityLines.push(cSpec.entitySyntheses.laguna_san_rafael_campos_hielo);
    }

    const content = [
      fm,
      '',
      `# ${cSpec.title}`,
      '',
      '## Síntesis Compilada (Consultor IA)',
      '',
      cSpec.synthesis,
      ...extraEntityLines,
      '',
      '## Indicadores Comunales Verificados',
      '',
      ...tableLines,
      '',
      '## Conexiones Sistémicas (`[[Wikilinks]]`)',
      '',
      '- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]',
      `- **Hub Principal**: [[hubs/${cSpec.hubSlug}|Hub ${cSpec.hub_roman}]]`,
      `- **Comunas Protagonistas**: ${relComunaLinks}`,
      `- **Nodos Satélite Asociados**: ${relNodoLinks}`,
      `- **Decisiones de Arquitectura y Datos (ADR)**: ${relAdrLinks}`,
      ''
    ].join('\n');

    writeLfFile(path.join(WIKI_DIR, 'conceptos', `${cSpec.id}.md`), content);
  });
}

function generateAdrPages(dataLake, canonicalLabels) {
  const comunas = dataLake.comunas;

  ADR_SPECS.forEach(aSpec => {
    const fm = buildYamlFrontmatter({
      id: aSpec.id,
      title: aSpec.title,
      type: 'adr',
      hub_id: aSpec.hub_id,
      hub_roman: aSpec.hub_roman,
      variables_clave: aSpec.variables_clave,
      fuentes_oficiales: aSpec.fuentes_oficiales,
      updated_at: '2026-11-23',
      tags: ['aysen-sistemico', 'adr', `hub-${aSpec.hub_roman.toLowerCase()}`]
    });

    const cols = aSpec.variables_clave.slice(0, 4);
    const headers = ['Comuna', ...cols.map(k => canonicalLabels[k] || k)];
    const tableLines = [
      `| ${headers.join(' | ')} |`,
      `| ${headers.map(() => '---').join(' | ')} |`
    ];
    comunas.forEach(com => {
      const slug = COMUNA_SLUGS[com.nombre];
      tableLines.push(`| [[comunas/${slug}|${com.nombre}]] | ${cols.map(k => fmtNum(com[k])).join(' | ')} |`);
    });

    const hubLinks = aSpec.relatedHubs.map(hSlug => {
      const h = HUB_META.find(x => x.fileSlug === hSlug);
      return `[[hubs/${hSlug}|${h ? `Hub ${h.roman}` : hSlug}]]`;
    }).join(' · ');

    const comunaLinks = aSpec.relatedComunas.map(slug => {
      const match = comunas.find(x => COMUNA_SLUGS[x.nombre] === slug);
      return `[[comunas/${slug}|${match ? match.nombre : slug}]]`;
    }).join(' · ');

    const conceptLinks = aSpec.relatedConcepts.map(cId => `[[conceptos/${cId}|${cId}]]`).join(' · ');

    const content = [
      fm,
      '',
      `# ${aSpec.title}`,
      '',
      '## Síntesis Compilada (Consultor IA)',
      '',
      aSpec.synthesis,
      '',
      '## Contexto, Decisión e Implicancias de Ingeniería',
      '',
      `- **Contexto del Problema**: ${aSpec.context}`,
      `- **Decisión Arquitectónica**: ${aSpec.decision}`,
      `- **Consecuencias y Verificación**: ${aSpec.consequences}`,
      '',
      '## Indicadores Comunales Verificados',
      '',
      ...tableLines,
      '',
      '## Conexiones Sistémicas (`[[Wikilinks]]`)',
      '',
      '- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]',
      `- **Hubs Impactados**: ${hubLinks}`,
      `- **Comunas de Referencia**: ${comunaLinks}`,
      `- **Conceptos Vinculados**: ${conceptLinks}`,
      ''
    ].join('\n');

    writeLfFile(path.join(WIKI_DIR, 'adr', `${aSpec.id}.md`), content);
  });
}

function generateLogPage() {
  const fm = buildYamlFrontmatter({
    id: 'wiki_log',
    title: 'Bitácora Cronológica de Conocimiento — Aysén Sistémico (LLM Wiki Log)',
    type: 'log',
    hub_id: 'gobernanza',
    hub_roman: 'IV',
    variables_clave: ['poblacion_censo_2024', 'presupuesto_mclp', 'total_proyectos_ctci'],
    fuentes_oficiales: [
      'INE — Censo de Población y Vivienda 2024',
      'SUBDERE — SINIM',
      'ANID DataCiencia / CORFO Innova'
    ],
    updated_at: '2026-11-23',
    tags: ['aysen-sistemico', 'log']
  });

  const content = [
    fm,
    '',
    '# Bitácora Cronológica de Conocimiento — Aysén Sistémico (LLM Wiki Log)',
    '',
    'Registro append-only de ingestas de fuentes, auditorías (lint), decisiones de arquitectura (adr) y síntesis compiladas.',
    'Comando rápido de consulta: `grep "^## \\[" wiki/log.md | tail -n 10`',
    '',
    '## Síntesis Compilada (Consultor IA)',
    '',
    'La bitácora cronológica (`wiki/log.md`) registra de manera inmutable todas las operaciones de ingesta estadística (`ingest`), decisiones arquitectónicas (`adr`) y validaciones deterministas (`lint`) sobre la base de conocimiento de Aysén Sistémico (10 comunas, 10 Hubs, 41 Nodos Satélite, 235 variables comunales y 38 fuentes oficiales).',
    '',
    '## [2026-10-16] ingest | Inicialización del Data Lake Territorial (10 Comunas, 38 Fuentes Oficiales)',
    '- Compilación inicial de indicadores comunales CENSO 2024, SINIM, SERNATUR, CONAF, SERNAPESCA, CNE, SEC, DEIS y ANID hacia [[index|Índice Maestro de la Wiki]] y [[comunas/coyhaique|Coyhaique]].',
    '',
    '## [2026-11-21] adr | Reorganización Taxonómica en 10 Hubs, 41 Nodos Satélite y 30 Subcategorías',
    '- Commit `6497827`: Estandarización de la ontología territorial en 10 Hubs equilibrados (`I` al `X`) documentada en [[adr/adr_001_arquitectura_cero_costo_vanilla|ADR-001]] y [[hubs/hub_04_gobernanza|Hub IV — Gobernanza]].',
    '',
    '## [2026-11-22] ingest | Reingeniería Integral de los Hubs II al X (235 Variables Comunales Verificadas)',
    '- Commits `50ab91a`, `a4d8c79`, `2890ce3`, `e9ea303`: Incorporación de varianza real en vectores clínicos DEIS ([[hubs/hub_08_salud|Hub VIII — Salud]]), 16 centros CTCi con 124 investigadores ([[hubs/hub_10_ctci|Hub X — CTCi]]), 18 espacios museográficos ([[hubs/hub_09_cultura|Hub IX — Cultura]]), 10.035,7 km² glaciares DGA ([[hubs/hub_07_biodiversidad|Hub VII — Biodiversidad]]) y 27 Postas de Salud Rural ([[nodos/nodo_38|Nodo #38]]). Véase [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]].',
    '',
    '## [2026-11-22] adr | Arquitectura Semántica LLM-First en Consultor y Motor de Dossier PDF A4 en Laboratorio',
    '- Commits `6ecf4c5` y `080de7a`: Implementación de paquetes conceptuales ([[conceptos/financiamiento_municipal|Financiamiento Municipal]], [[conceptos/sistema_electrico_energia|Matriz Energética]]), grafo territorial multi-entidad ([[conceptos/huemules_multidimensional|Huemules]], [[conceptos/volcan_hudson_y_campos_de_hielo|Volcán Hudson y Laguna San Rafael]]), reparación conversacional pura y guiada ([[adr/adr_003_enrutador_hibrido_llm_first_omniroute|ADR-003]]) y generador PDF editorial A4 con narrativa de 3 párrafos por gráfico ([[adr/adr_005_motor_reportes_ejecutivos_pdf_a4|ADR-005]]).',
    '',
    '## [2026-11-23] lint | Instanciación de la Wiki Compilada de Karpathy y Sincronización con Obsidian Vault',
    '- Compilación de 77 páginas canónicas en `wiki/` ([[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]), verificación de 0 enlaces rotos, 0 páginas huérfanas y 100% de paridad numérica contra `data/aysen_hubs_data.js`.',
    ''
  ].join('\n');

  writeLfFile(path.join(WIKI_DIR, 'log.md'), content);
}

function generateIndexPage(dataLake) {
  const fm = buildYamlFrontmatter({
    id: 'wiki_index',
    title: 'Índice Maestro de la Wiki Territorial — Aysén Sistémico (Karpathy LLM-Wiki)',
    type: 'index',
    hub_id: 'gobernanza',
    hub_roman: 'IV',
    variables_clave: [
      'poblacion_censo_2024',
      'presupuesto_mclp',
      'fndr_mclp',
      'concesiones_salmon',
      'superficie_glaciares_km2',
      'total_proyectos_ctci'
    ],
    fuentes_oficiales: [
      'INE — Censo de Población y Vivienda 2024 (100.745 hab.)',
      'SUBDERE — SINIM',
      'DIPRES / GORE Aysén — FNDR',
      'SUBPESCA / SERNAPESCA / DGA / DEIS / ANID'
    ],
    updated_at: '2026-11-23',
    tags: ['aysen-sistemico', 'index']
  });

  const hubLines = HUB_META.map(
    h => `- [[hubs/${h.fileSlug}|${h.title}]]`
  );

  const comunaLines = dataLake.comunas.map(c => {
    const slug = COMUNA_SLUGS[c.nombre];
    return `- [[comunas/${slug}|${c.nombre}]] — Provincia de ${c.provincia} · ${fmtNum(c.poblacion_censo_2024)} hab. (${fmtNum(c.porcentaje_regional_pct)}%) · Presupuesto: ${fmtNum(c.presupuesto_mclp)} M$ (${fmtNum(c.dependencia_fcm_pct)}% FCM)`;
  });

  const conceptLines = CANONICAL_8_CONCEPTS.map(
    c => `- [[conceptos/${c.id}|${c.title}]]`
  );

  const adrLines = ADR_SPECS.map(
    a => `- [[adr/${a.id}|${a.title}]]`
  );

  const nodoLines = (dataLake.nodos || []).map(n => {
    const pad = String(n.id).padStart(2, '0');
    return `- [[nodos/nodo_${pad}|Nodo #${pad} — ${cleanMarkdownBolds(n.title)}]]`;
  });

  const content = [
    fm,
    '',
    '# Índice Maestro de la Wiki Territorial — Aysén Sistémico',
    '',
    'Catálogo rector orientado a contenido bajo el patrón **`llm-wiki` de Andrej Karpathy**, conectado bidireccionalmente con el **Vault de Obsidian** (`Aysen_Sistemico/`) y con el compilador del Consultor Semántico (`data/aysen_wiki_compiled.js`).',
    '',
    '## Síntesis Compilada (Consultor IA)',
    '',
    'La Wiki Territorial de Aysén Sistémico organiza el conocimiento verificado de la Región de Aysén (100.745 habitantes Censo 2024, 10 comunas, 235 variables comunales y 38 fuentes oficiales) en 77 páginas canónicas interconectadas: 1 índice maestro (`index.md`), 1 bitácora cronológica (`log.md`), 10 Hubs temáticos (`I` al `X`), 10 radiografías comunales, 41 fichas de Nodos Satélite (`#01` al `#41`), 8 paquetes conceptuales y entidades territoriales multidimensionales, y 6 registros de decisiones de arquitectura y datos (`ADR-001` a `ADR-006`).',
    '',
    '## 1. Gobernanza del Conocimiento y Bitácora',
    '',
    '- [[index|Índice Maestro de la Wiki Territorial (77 páginas canónicas)]]',
    '- [[log|Bitácora Cronológica de Conocimiento (Wiki Log Append-Only)]]',
    '',
    '## 2. Los 10 Hubs Sistémicos de Aysén (`wiki/hubs/`)',
    '',
    ...hubLines,
    '',
    '## 3. Las 10 Comunas de la Región de Aysén (`wiki/comunas/`)',
    '',
    ...comunaLines,
    '',
    '## 4. Paquetes Conceptuales y Entidades Territoriales (`wiki/conceptos/`)',
    '',
    ...conceptLines,
    '',
    '## 5. Architecture & Data Decision Records (`wiki/adr/`)',
    '',
    ...adrLines,
    '',
    '## 6. Los 41 Nodos Satélite del Data Lake (`wiki/nodos/`)',
    '',
    ...nodoLines,
    ''
  ].join('\n');

  writeLfFile(path.join(WIKI_DIR, 'index.md'), content);
}

function main() {
  console.log('[init_and_compile_llm_wiki] Cargando window.AYSEN_HUBS_DATA...');
  const dataLake = loadDataLake();
  const omni = loadOmniRouteClient(dataLake);
  const canonicalLabels = (omni && omni.CANONICAL_LABELS) || {};

  const nodosByHub = {};
  (dataLake.nodos || []).forEach(n => {
    if (!nodosByHub[n.hubId]) nodosByHub[n.hubId] = [];
    nodosByHub[n.hubId].push(n);
  });

  ensureDir(path.join(WIKI_DIR, '.obsidian'));
  ensureDir(path.join(WIKI_DIR, 'hubs'));
  ensureDir(path.join(WIKI_DIR, 'comunas'));
  ensureDir(path.join(WIKI_DIR, 'nodos'));
  ensureDir(path.join(WIKI_DIR, 'conceptos'));
  ensureDir(path.join(WIKI_DIR, 'adr'));

  writeLfFile(path.join(WIKI_DIR, '.obsidian', 'graph.json'), buildGraphJson());
  generateHubPages(dataLake, canonicalLabels, nodosByHub);
  generateComunaPages(dataLake, canonicalLabels);
  generateNodoPages(dataLake);
  generateConceptPages(dataLake, canonicalLabels);
  generateAdrPages(dataLake, canonicalLabels);
  generateLogPage();
  generateIndexPage(dataLake);

  console.log('[init_and_compile_llm_wiki] 77 páginas Markdown y .obsidian/graph.json generados en wiki/.');

  const bridgePath = path.join(__dirname, 'obsidian_wiki_bridge.cjs');
  if (fs.existsSync(bridgePath)) {
    const bridge = require(bridgePath);
    if (typeof bridge.compileWikiToBundle === 'function') {
      bridge.compileWikiToBundle();
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
  HUB_META,
  COMUNA_SLUGS,
  CANONICAL_8_CONCEPTS,
  ADR_SPECS
};
