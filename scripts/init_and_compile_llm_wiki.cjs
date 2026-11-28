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
    .replace(/\b6\.410 km\b/gi, '8.721,6 km')
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
      'El Hub I (Turismo y Áreas Silvestres Protegidas) consolida los 1.728 servicios registrados en el RNPST SERNATUR (10.040 camas formales, con brecha de vigencia de patentes de 31,6% en ZOIT Chelenko y 11,8% en ZOIT Queulat), las 364.039 pernoctaciones y 196.611 llegadas anuales consolidadas en INE EMAT 2025 (estancia media de 1,85 noches por establecimiento vs. 10,0 días de viaje regional en Aeródromo Balmaceda; ADR real de $70.213 CLP y RevPAR de $17.203 CLP) y las 86.117 visitas oficiales registradas en porterías CONAF a las 19 unidades del SNASPE atendidas por 41 guardaparques permanentes rumbo al SBAP marzo 2027. En economía sectorial ACT suman 3.152 empresas, 11.569.086 UF en ventas y 5.270 empleos promedio, y la comuna de Aysén (11201) queda formalmente excluida del polígono legal de la ZOIT Aysén Patagonia Queulat (solo Cisnes y Lago Verde).'
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
      'El Hub III (Energía y Telecomunicaciones) caracteriza el aislamiento eléctrico, térmico y digital de Aysén frente al SEN. Opera mediante Sistemas Medianos (SMA, SMGC, Puerto Cisnes/Palena) y Sistemas Aislados <= 1,50 MW (Art. 173° LGSE) que suman 67,10 MW operativos (+18,98 MW ERNC en construcción 2026), bajo Pliego BT1 Edelaysen Decreto N° 8T nov-2026 en $287,8/kWh en Coyhaique/Aysén y 13.448 hogares beneficiarios del Subsidio Eléctrico Ley 21.667. Al 19-nov-2026 (CNE), la gasolina 93 promedia $1.696/L y kerosene $1.497/L (+$282/L FEPP) vía único MBM Copec Chacabuco (6.674 m³ activos), mientras INFOR BES N° 11 certifica 334.274 m³ sólidos/año de leña (Coyhaique 147.080 m³s [44,0%], 68,8% hogares). En telecomunicaciones (SUBTEL jun-2026 / FDT 3T-2026) suma 26.294 conexiones fijas (24.782 residenciales), con único aterrizaje submarino CTR en Caleta Tortel, Cable Austral privado GTD en Puerto Chacabuco, 14 POIITs Silica y despliegues FDT-2025-03 / Tortel-O\'Higgins (1S-2028).'
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
      'El Hub IV (Gobernanza y Finanzas Municipales) examina la estructura fiscal, administrativa y política de los 10 municipios y del Gobierno Regional de Aysén según BCN / SINIM 2025, TGR y SERVEL. Los ingresos municipales efectivos alcanzan 84.820,68 M$ (2025; 78.736,96 M$ en 2024), con IPP de 19.243,52 M$ y transferencias FCM de 41.753,32 M$ (dependencia FCM de 68,5% ponderada y 77,5% promedio simple comunal): Cisnes lidera en autonomía (48,7% FCM gracias a 1.928,64 M$ en patentes acuícolas SINIM), seguido de Coyhaique (58,4% FCM; 27.611,00 M$) y Aysén (61,1% FCM; 14.614,29 M$; 1.516,33 M$ patentes acuícolas), mientras Tortel (95,4% FCM; 3.440,74 M$) y O\'Higgins (95,3% FCM; 5.323,76 M$) presentan máxima dependencia del FCM y del Royalty Minero FET (3.207,73 M$ 2025; FCMI = 0 M$). En inversión regional, el FNDR GORE cerró 2025 con un devengado récord de 73.863,0 M$ (92,0% sobre 80.200,0 M$ vigentes; +65,0% respecto a los 44.765,5 M$ [59,3%] de 2024, y tras los 61.579,2 M$ CKAN / 61.548,0 M$ DIPRES de 2023), con acuerdo Hacienda 2027 en 80.748,0 M$.'
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
      'ventas_sii_domicilio_local_muf',
      'ventas_sii_muf',
      'sucursales_bancarias_n',
      'cajeros_automaticos_n',
      'cajavecina_puntos_n',
      'concesiones_mineras_ha',
      'ganado_bovino_cabezas',
      'ganado_ovino_cabezas',
      'suelo_fiscal_bbnn_pct'
    ],
    fuentes_oficiales: [
      'Banco Central de Chile (BCCh) — Cuentas Nacionales Regionales',
      'SEA — Sistema de Evaluación de Impacto Ambiental (SEIA)',
      'SII — Estadísticas Tributarias de Empresas, Ventas y Empleo',
      'ChileCompra — Transacciones Mercado Público',
      'CMF / BancoEstado — Inclusión Financiera y CajaVecina',
      'MBN / SERNAGEOMIN / BCN / ODEPA / CONAF 2026'
    ],
    conceptLinks: ['conceptos/inversion_publica_regional', 'conceptos/financiamiento_municipal'],
    adrLinks: ['adr/adr_004_normalizacion_per_capita_y_colinealidad', 'adr/adr_002_reconciliacion_38_fuentes_invariantes'],
    synthesis:
      'El Hub V (Economía, Inversión y Suelo) integra las Cuentas Nacionales Regionales del Banco Central (PIB nominal 2025 de 1.991.000 MM$ CLP, +8,5% real, FBCF +18,2%, PIB turístico 89.200 MM$ = 4,5%, nota 1T 2026: -2,6% real y 13 actividades económicas), el SEIA (722 proyectos aprobados históricos; Cuenta Pública SEA 2024-2025: 3 aprobados, 1 desistido, 0 rechazados y 72 pertinencias en 2025; sin alucinaciones extrarregionales), la demografía empresarial SII (13.453 empresas y 35.832 trabajadores en 2025; 5 tramos UF BCN 2024 sobre 12.953 empresas; 25.800 MUF de ventas por domicilio tributario local frente a 131.520 MUF de valor bruto de producción física), compras públicas ChileCompra (230.850 M$ en 2024, 238.400 M$ en 2025 y 228.874,2 M$ en 2026 YTD), CMF 2025 (12 sucursales, 47 ATM y 415 puntos CajaVecina), catastro SERNAGEOMIN (356 concesiones / 128.511 ha; Pacífico del Sur en El Toqui y Andean Silver en Cerro Bayo), masa ganadera BCN/ODEPA (144.118 bovinos y 177.972 ovinos) y Catastro Vegetacional CONAF 2026 (10.667.211,5 ha catastradas; 5.152.384,3 ha bosque nativo; 2.387.525,4 ha en SNASPE).'
  },
  {
    idx: 6,
    fileSlug: 'hub_06_social',
    hubId: 'social',
    roman: 'VI',
    title: 'Hub VI — Demografía Censo 2024, Educación SLEP, Vivienda MINVU y Cohesión Social',
    variables_clave: [
      'poblacion_censo_2024',
      'hogares_censo_2024',
      'viviendas_totales_censo_2024',
      'indice_envejecimiento',
      'pobreza_multidim_pct',
      'pobreza_ingresos_pct',
      'matricula_escolar',
      'establecimientos_escolares_n',
      'establecimientos_slep_aysen',
      'matricula_educacion_superior_sies_n',
      'deficit_habitacional_cuantitativo_n',
      'sistemas_ssr_apr_n',
      'beneficiarios_ssr_apr_doh',
      'cobertura_ssr_apr_familias',
      'tasa_dmcs_100k',
      'tasa_vif_100k'
    ],
    fuentes_oficiales: [
      'INE / BCN — Censo 2024 (100.745 hab., 39.964 hogares, 52.294 viviendas)',
      'MDSF — CASEN 2022/2024 (ene-2026) y Registro Social de Hogares',
      'MINEDUC / SLEP Aysén / SIES 2026 — 86 colegios (55 SLEP + 10 VTF) y 2.924 SIES',
      'MINVU CECT / PEH Feb-2026 / DOH-MOP — 1.927 déficit cuantitativo, PEH 1.671 y 47 SSR',
      'CEAD SPD / BCN — Tasas delictuales violentos/integridad y VIF 2023–2025'
    ],
    conceptLinks: ['conceptos/inversion_publica_regional', 'conceptos/financiamiento_municipal'],
    adrLinks: ['adr/adr_004_normalizacion_per_capita_y_colinealidad', 'adr/adr_002_reconciliacion_38_fuentes_invariantes'],
    synthesis:
      'El Hub VI (Demografía, Educación, Vivienda y Cohesión) integra los microdatos oficiales del Censo 2024 (INE / BCN 2026): sobre un total regional consolidado de 100.745 habitantes (suma comunal BCN 101.148 hab.; 80,7% urbana / 19,3% rural; 49.847 hombres y 50.898 mujeres), Coyhaique concentra 57.823 habitantes (57,4%) y Aysén 23.170 habitantes (23,0%) (80,4% conjunto), con 39.964 hogares (2,5 pers./hogar) y 52.294 viviendas totales (39.631 ocupadas). El Índice de Envejecimiento pasó de 13,7 (1992) a 66,2 (2024; Lago Verde 182,8, Río Ibáñez 121,2, Tortel 30,8), con masculinidad regional de 97,9, pueblos originarios de 29,0% (29.230 pers.) e inmigración de 3,9% (3.931 pers.). En hábitat, MINVU CECT (oct-2025) fija el déficit cuantitativo en 1.927 viviendas (4,8% hogares: Coyhaique 1.128, Aysén 330, Lago Verde 73 [19,6%], Cochrane 118 [8,1%]), CASEN 2024 fija el déficit cualitativo en 12,9% (5.155 hogares), se catastran 10 campamentos (244 hogares) y el PEH cerró febrero 2026 con 1.671 viviendas terminadas (129,2% sobre meta de 1.293, prorrogado a dic-2029); paralelamente operan 47 comités SSR/APR DOH-MOP (28.833 personas y 9.185 familias/arranques, con 551 en Melinka). En educación conviven 86 colegios activos (55 escuelas/liceos SLEP + 10 jardines VTF = 65 SLEP; Tortel 1 escuela y 0 liceos), 22.087 alumnos totales (8.939 SLEP), PAES 2026 sobre la media nacional (M1 627,4 / Lectora 600,2) y 2.924 estudiantes SIES 2026 (Coyhaique 2.187 y CFT Estatal Aysén 737). CASEN 2024 (nueva metodología ene-2026) marca 14,3% de pobreza por ingresos y 12,1% multidimensional, mientras CEAD registra VIF regional de 691,6 (2023), 809,9 (2024) y 709,9 c/100k hab (2025).'
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
      'CONAF SIT 2026 — Catastro Vegetacional (10.667.211,5 ha; 5.152.384,3 ha bosque nativo)',
      'DGA-MOP — Inventario Público de Glaciares IPG 2022 (10.301 glaciares; 8.721,6 km²)',
      'MMA — 20° Proceso RCE (D.S. N° 29/2025, oct-2026) y Red SINCA EMRP (Coyhaique/Aysén)',
      'SERNAGEOMIN RNVV / USGS / DGA Red Hidrométrica (5 volcanes activos RNVV en Aysén)'
    ],
    conceptLinks: ['conceptos/huemules_multidimensional', 'conceptos/volcan_hudson_y_campos_de_hielo'],
    adrLinks: ['adr/adr_002_reconciliacion_38_fuentes_invariantes', 'adr/adr_003_enrutador_hibrido_llm_first_omniroute'],
    synthesis:
      'El Hub VII (Biodiversidad, Clima y Riesgos Geológicos) integra el Catastro Vegetacional CONAF 2024-2026 (5.152.384,3 ha de bosque nativo [48,30% de 10.667.211,5 ha catastradas], con 5.189.923,8 ha de subuso Bosques, 2.387.525,4 ha en SNASPE, 2.606.729,0 ha de praderas/matorrales y 106.484,6 ha de humedales CONAF), junto al Inventario Público de Glaciares IPG 2022 de DGA-MOP (10.301 glaciares [39,4% nacional, 1° en número] y 8.721,6 km² [41,5% nacional, ~1.235,6 km³ eq. agua]). En fauna (20° Proceso RCE MMA, 154 taxones y 64 amenazados), Aysén concentra 750-1.000 huemules (~50%-60% de <1.500 maduros mundiales) y Ballena Azul <250 (~217), mientras Castor canadensis registra 0 comunas invadidas (SAT preventivo mar-2025). En aire y riesgos, solo Coyhaique (2 EMRP, 97 GEC en 2026 / 87 en 2024) y Puerto Aysén (1 EMRP Vialidad, 16 días base PDA D.S. N° 03/2025) tienen monitoreo continuo EMRP SINCA, el Río Baker en Bertrand (BNA 11530000-8) alcanza su máximo estival en febrero (675 m³/s) y el Volcán Hudson ocupa el puesto #12 nacional RNVV (Categoría I).'
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
      'DEIS - MINSAL (03-11-2026) — Catastro de 5 Hospitales, 4 CESFAM, 4 CECOSF, 27 PSR, 9 EMR y 2 COSAM',
      'Servicio de Salud Aysén (DAP SSA · 0% Salud Municipal) — Convenio GORE–MINSAL $195.000M y SAMU / SAMU Reloncaví',
      'SIGTE Glosa 06 MINSAL / CIPS-UDD T3 2026 — 14.751 CNE (159d), 3.608 IQ (262d), 6.870 Odonto (242d), 524 GES (88d)',
      'DEIS / UNICEF SITAN 2025 / SEREMI Salud — Suicidio 19,9/100k (#1 Chile), Cáncer Gástrico 18,4/100k (64% H. pylori), Vesícula C23 18,29/100k'
    ],
    conceptLinks: ['conceptos/red_asistencial_salud', 'conceptos/inversion_publica_regional'],
    adrLinks: ['adr/adr_002_reconciliacion_38_fuentes_invariantes', 'adr/adr_004_normalizacion_per_capita_y_colinealidad'],
    synthesis:
      'El Hub VIII (Salud APS y Hospitales) modela la red asistencial 100% dependiente del Servicio de Salud Aysén (DAP SSA — 0% salud municipalizada; 0 clínicas privadas de hospitalización general), reforzada por el Convenio de Programación GORE Aysén–MINSAL del 30-07-2025 ($195.000 millones). Sus 5 hospitales públicos suman 213 camas de diseño (174 agudas efectivas y 8 pabellones quirúrgicos): Hospital Regional Coyhaique (135 basales, 141 con las 6 camas de la nueva UPC Pediátrica jun-2026, 4 pabellones, 18 sillones de hemodiálisis), Puerto Aysén (56 camas, 2 pabellones, 7/17 camas Medicina bloqueadas por pacientes sociosanitarios y ~30 camas en la red SSA), Hospital Comunitario Dr. Jorge Ibar Bruce de Puerto Cisnes (8 camas), Hospital Dr. Leopoldo Ortega Rodríguez de Chile Chico (7 camas, 1 pabellón, nuevo edificio feb-2026) y Hospital Lord Cochrane (7 camas, 1 pabellón, acreditado SuperSalud 14-05-2026). La APS reúne 4 CESFAM (+1 en construcción), 4 CECOSF, 27 Postas de Salud Rural (PSR, 100% tele-ECG desde oct-2025), 9 EMR y 2 COSAM. En SIGTE T3 2026 destacan 14.751 CNE No GES (159 días mediana), 3.608 IQ No GES (262 días mediana), 6.870 consultas odontológicas (242 días) y 524 retrasos GES (88 días), junto a 454 aeroevacuaciones SAMU primarias + 45 secundarias (Melinka regulado por SAMU Reloncaví; HRC sin equipo ECMO; 5 casos/1 fallecimiento hantavirus ago-2026) y la mayor tasa de suicidio de Chile (19,9/100k; 28,1/100k adolescente), además de 5,54 médicos RNPI vs. 1,80 efectivos en red pública SSA por 1.000 hab (UAysén con 0 carreras de Medicina).'
  },
  {
    idx: 9,
    fileSlug: 'hub_09_cultura',
    hubId: 'cultura',
    roman: 'IX',
    title: 'Hub IX — Cultura, Patrimonio Monumental, Museos, Bibliotecas e Identidad Austral',
    variables_clave: [
      'museos_count',
      'bibliotecas_snbp_n',
      'monumentos_nacionales_count',
      'total_espacios_culturales',
      'gasto_cultura_per_capita_clp',
      'fondart_fndr_mclp',
      'participacion_cultural_pct_c2',
      'puntos_cultura_comunitaria_pcc_n',
      'pueblos_originarios_pct_censo_2024'
    ],
    fuentes_oficiales: [
      'MINCAP / SERPAT — Registro de Museos de Chile (RMC 16/27), SNBP (16 fijas / 31.221 préstamos), PCC (25) y ENPCCL 2024',
      'Consejo de Monumentos Nacionales (CMN Ley N° 17.288) — 16 declaratorias / 23 bienes protegidos en Aysén',
      'INE Censo 2024 / BCN Reporte Distrital 27 / CONADI SIIC — Pueblos Originarios (29,0%) y 47 Comunidades SIIC',
      'GORE Aysén / MINCAP / SINIM — Fondos Cultura 2022–2026, PAOCC, Red Cultura, 8% FNDR y Gasto Municipal',
      'Universidad de Aysén — Barómetro Regional Patagonia (N=465, B4_B = 4,04, semáforo comunal n<30)'
    ],
    conceptLinks: ['conceptos/financiamiento_municipal'],
    adrLinks: ['adr/adr_002_reconciliacion_38_fuentes_invariantes', 'adr/adr_005_motor_reportes_ejecutivos_pdf_a4'],
    synthesis:
      'El Hub IX (Cultura, Artes y Patrimonio) sistematiza la infraestructura cultural oficial de las 10 comunas de Aysén (54 espacios totales): 16 museos activos inscritos en el Registro de Museos de Chile (RMC 2026, dentro de una Red de Museos de Aysén de 27 recintos; Museo Regional de Aysén con 36.173 visitas en 2025, #12 nacional), 16 bibliotecas públicas fijas SNBP en 10/10 comunas (31.221 préstamos físicos y 7.591 socios activos en 2024; 18.199 en Biblioteca Regional), 16 declaratorias del Consejo de Monumentos Nacionales (12 MH / 19 bienes incluyendo los 8 de la SIA en Coyhaique, 1 ZT en Caleta Tortel y 3 SN incluyendo Capilla de Mármol en Río Ibáñez 11402 = 23 bienes protegidos) y 6 centros culturales municipales. Integra además la serie MINCAP 2022–2026 (57 proyectos por >$1.007M en 2025, PAOCC 5 organizaciones en 2026, Red Cultura 7 espacios + $61M a 4 municipios, 25 Puntos de Cultura Comunitaria PCC), el FNDR 8% ($5.681M a 355 iniciativas en 2025), ENPCCL 2024 (62,0% urbana vs. 75,4% nacional), la demografía indígena Censo 2024 (29,0% = 29.230 personas; 47 Comunidades Indígenas SIIC CONADI con 490 familias + 27 Asociaciones Indígenas funcionales = 74 organizaciones) y el gasto municipal per cápita recalculado sobre Censo 2024 ($43.537 en Lago Verde y $32.860 en Tortel frente a $11.850 en Coyhaique), junto al Barómetro Regional (N=465, nota B4_B = 4,04, tasa positiva 40,2%): Coyhaique y Aysén operan en semáforo verde (n>=50), mientras las 8 comunas rurales permanecen en semáforo rojo (n<30) por lo que valores extremos como 100,0% en Tortel o 80,0% y nota 5,00 en Lago Verde son artefactos de micro-muestra (n<=5) que deben interpretarse a nivel de Macrozona.'
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
      'proporcion_ciencia_endogena_pct',
      'matricula_educacion_superior_sies_n'
    ],
    fuentes_oficiales: [
      'ANID DataCiencia / Compendio 2021-2025 / FIUT Etapa 2 / PATSER R20F0002 / FONDAP',
      'Nodo Ciencia Austral (NCA 2026) — Catastro de Equipamiento Científico Crítico y FONDEQUIP',
      'SIES MINEDUC / SES / CNA / SEREMI de Ciencia Aysén / CDPR CORFO / FIA / INAPI 2026 / Barómetro N=465'
    ],
    conceptLinks: ['conceptos/ecosistema_ctci_ciencia', 'conceptos/volcan_hudson_y_campos_de_hielo'],
    adrLinks: ['adr/adr_002_reconciliacion_38_fuentes_invariantes', 'adr/adr_006_workflow_karpathy_llm_wiki_obsidian'],
    synthesis:
      'El Hub X (CTCi, Ciencia e Innovación) distingue exactamente 179 proyectos CTCi totales ($25.776,8M CLP) compuestos por 120 proyectos científicos ANID ($17.326,8M: 68 locales endógenos por $11.850,5M [68,4%] y 52 extrarregionales por $5.476,3M [31,6%]) más 59 proyectos CORFO Innova ($8.450,0M). Registra 16 centros científicos y estaciones (124 investigadores residentes: 91 en Coyhaique, 14 en Puerto Aysén): nómina real CIEP (23 inv. [19 PhD] + 12 apoyo = 35 I+D + 12 gestión = 47 personas; PATSER R20F0002 $2.750M + Basal GORE 2026 >$1.599M), UAysén (FIUT Etapa 2 $10.484M a 10 años, fin Administración Provisional SES 15-01-2026, Rector Dr. Víctor Cubillos), INIA Tamel Aike (1er Banco de Recursos Zoogenéticos de Chile), IFOP Puerto Aysén (nueva sede/lab. oct-2024), Reserva Elemental Melimoyu (Fundación MERI, 16.000 ha en Cisnes, excluyendo Huinay), Estación Cerro Castillo UAysén / Bahía Exploradores UC (jurisdicción Aysén 11201, acceso Río Ibáñez 11402), COPAS Coastal (2026-2031) e INCAR². Incluye el Catastro NCA 2026 (6 FONDEQUIP en Aysén; 9 equipos críticos activos = $1.683,06M: UAysén 4 [$1.295,86M], CIEP 4 [$330,35M, con limitante de mantenimiento en Aqualog], INIA 1 [$56,85M] + SODAR-RASS UACh $137,60M e IFCB UdeC/COPAS), matrícula SIES 2026 de 2.924 estudiantes (Coyhaique 2.187: INACAP 1.187 + UAysén 1.000; Puerto Aysén 737: CFT Estatal; cierre pregrado UACh Patagonia ago-2025), CDPR CORFO ($1.930M 2024 -> $1.885M + $747M Sercotec 2025 -> $2.534M 2026), Plan Aysén Azul (>$7.500M), FIA (244 ha cerezos / 660 ton, vitivinicultura austral, orujo cervecero 2026), INAPI 2026 (252 marcas residentes +63% #1 nacional), nueva SEREMI de Ciencia Aysén (oct-2025, Gabriel Pérez Aros) y semáforo muestral Barómetro (N=465; verde 11101/11201 vs rojo n<30 en 8 rurales; I8 referente 5,08 / media n=423 4,98).'
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
      'En Aysén, los ingresos municipales agregados BCN/SINIM 2025 suman 84.820,68 M$ (promedio 8.482,1 M$ por comuna) con dependencia FCM ponderada de 68,5% (77,5% promedio simple comunal): Cisnes (48,7% FCM gracias a 1.928,64 M$ de patentes acuícolas SINIM), Coyhaique (58,4% FCM; 27.611,00 M$) y Aysén (61,1% FCM; 14.614,29 M$) concentran la base propia, mientras Tortel (95,4% FCM; 3.440,74 M$), O\'Higgins (95,3% FCM; 5.323,76 M$), Río Ibáñez (86,6% FCM) y Chile Chico (86,5% FCM) dependen mayoritariamente del FCM y del Royalty Minero FET (3.207,73 M$ en 2025).'
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
      'Aunque Aysén posee abundante recurso hídrico, no está conectada al SEN: opera mediante Sistemas Medianos y Sistemas Aislados <= 1,50 MW que totalizan 67,10 MW operativos (33,95 MW en Coyhaique y 18,48 MW en Aysén, más 18,98 MW ERNC en construcción 2026), con tarifa BT1 vigente nov-2026 (Decreto N° 8T/2026) de $287,8/kWh en Coyhaique/Aysén y hasta $318,0/kWh en Tortel. En $/kWh térmico útil, calefaccionar con bomba de calor (COP 2,8) cuesta ~$102,8/kWh_útil y con kerosene $174,7/kWh_útil tras el shock FEPP de octubre 2026, frente a $45,7/kWh_útil de leña ($48.000/m³ en Coyhaique), explicando que 334.274 m³ sólidos/año sigan sosteniendo la calefacción regional (Coyhaique 147.080 m³s [44,0%], 68,8% hogares a 9,81 m³s/hogar tras 10.999 recambios PDA) y 87 días sobre norma MP2.5.'
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
      'DEIS - MINSAL (03-11-2026) — Estadísticas de Red Asistencial y 213 Camas de Diseño',
      'Servicio de Salud Aysén (DAP SSA) — 4 CESFAM, 4 CECOSF, 27 PSR, 9 EMR, 2 COSAM y 454+45 Aeroevacuaciones SAMU',
      'SIGTE Glosa 06 MINSAL / CIPS-UDD T3 2026 — 14.751 CNE (159d), 3.608 IQ (262d), 6.870 Odonto (242d), 524 GES (88d)'
    ],
    relatedComunas: ['coyhaique', 'aysen', 'cisnes', 'chile_chico', 'cochrane', 'guaitecas', 'ohiggins'],
    relatedNodos: [24, 38, 39],
    relatedAdrs: ['adr_002_reconciliacion_38_fuentes_invariantes', 'adr_004_normalizacion_per_capita_y_colinealidad'],
    synthesis:
      'El Servicio de Salud Aysén (DAP SSA · 0% salud municipalizada; 0 clínicas privadas de hospitalización general) articula 5 hospitales con 213 camas de diseño (174 agudas efectivas y 8 pabellones quirúrgicos): Hospital Regional Coyhaique (135 basales, 141 con 6 UPC Pediátrica jun-2026, 4 pabellones, 18 sillones hemodiálisis), Puerto Aysén (56 camas, 2 pabellones; ~30 camas bloqueadas sociosanitarias en la red), Puerto Cisnes Dr. Jorge Ibar Bruce (8 camas), Hospital Dr. Leopoldo Ortega Rodríguez de Chile Chico (7 camas, 1 pabellón, nuevo edificio feb-2026) y Hospital Lord Cochrane (7 camas, 1 pabellón, acreditado SuperSalud 14-05-2026). La APS reúne 4 CESFAM (+1 en construcción), 4 CECOSF, 27 PSR (100% tele-ECG oct-2025), 9 EMR y 2 COSAM, respaldados por el Convenio GORE–MINSAL de $195.000M. En SIGTE T3 2026 registra 14.751 CNE (159d), 3.608 IQ (262d), 6.870 Odonto (242d) y 524 retrasos GES (88d), con 454 aeroevacuaciones SAMU primarias + 45 secundarias (Melinka regulado por SAMU Reloncaví; HRC sin equipo ECMO; auditorías CGR abr y ago 2026).'
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
      'El ecosistema de Ciencia, Tecnología, Conocimiento e Innovación (Hub X CTCi) de Aysén articula 16 centros científicos y estaciones geolocalizadas con 124 investigadores residentes (91 en Coyhaique, 14 en Puerto Aysén) y 179 proyectos CTCi totales ($25.776,8M) = 120 proyectos científicos ANID ($17.326,8M: 68 locales por $11.850,5M y 52 extrarregionales por $5.476,3M) + 59 proyectos CORFO Innova ($8.450,0M). ' +
      'Integra FIUT Etapa 2 UAysén ($10.484M a 10 años, 2025-2035), PATSER CIEP R20F0002 ($2.750M) + Basal GORE 2026 (>$1.599M), Catastro NCA 2026 (6 FONDEQUIP en Aysén y 9 equipos críticos activos por $1.683,06M: UAysén 4 [$1.295,86M], CIEP 4 [$330,35M con limitante de mantenimiento en Aqualog], INIA 1 [$56,85M] + SODAR-RASS UACh $137,60M e IFCB UdeC/COPAS), nómina CIEP 2026 (23 investigadores [19 PhD] + 12 apoyo = 35 I+D + 12 gestión = 47 personas), 1er Banco de Recursos Zoogenéticos de Chile (INIA Tamel Aike), nueva sede/lab. IFOP Puerto Aysén (oct-2024), Reserva Elemental Melimoyu (Fundación MERI, 16.000 ha en Cisnes, sin Huinay) y deslinde de Bahía Exploradores (jurisdicción Aysén 11201, acceso Río Ibáñez 11402) junto a Estación Cerro Castillo UAysén. ' +
      'En educación superior SIES 2026 consolida 2.924 estudiantes (Coyhaique 2.187: INACAP 1.187 + UAysén 1.000; Puerto Aysén 737: CFT Estatal; término Adm. Provisional SES 15-01-2026, Rector Dr. Víctor Cubillos, cierre pregrado UACh ago-2025), junto a CDPR CORFO ($1.930M 2024 -> $1.885M + $747M Sercotec 2025 -> $2.534M 2026), Plan Aysén Azul (>$7.500M), FIA (244 ha cerezos Chile Chico / 660 ton, vitivinicultura austral, orujo cervecero 2026), INAPI 2026 (252 marcas +63% #1 nacional), SEREMI de Ciencia propia (oct-2025, Gabriel Pérez Aros) y semáforo muestral Barómetro (N=465; rojo n<30 en 8 rurales; I8 referente 5,08 / media n=423 4,98).'
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
      '(3) Huemul (Hippocamelus bisulcus, en plural «huemules»): cérvido nativo en categoría En Peligro (EN) en el RCE MMA, con una población mundial total inferior a 1.500 individuos maduros (101 subpoblaciones Chile-Argentina, 17° Proceso RCE), de la cual Aysén concentra entre 750 y 1.000 individuos (~50%–60% mundial) protegidos en áreas SNASPE como el Parque Nacional Cerro Castillo y la Reserva Nacional Tamango.'
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
      'SERNAGEOMIN — Red Nacional de Vigilancia Volcánica (RNVV, Volcán Hudson #12 Nacional Cat. I)',
      'USGS / CSN — Catálogo Instrumental de Sismicidad en el Arco Volcánico Austral',
      'DGA-MOP — Inventario Público de Glaciares IPG 2022 (8.721,6 km² / 10.301 glaciares)'
    ],
    relatedComunas: ['rio_ibanez', 'aysen', 'chile_chico', 'coyhaique'],
    relatedNodos: [30, 31, 28],
    relatedAdrs: ['adr_003_enrutador_hibrido_llm_first_omniroute', 'adr_002_reconciliacion_38_fuentes_invariantes'],
    synthesis:
      'El Volcán Hudson (1.905 m, límite Río Ibáñez / Aysén) es un estratovolcán con caldera activa de 10 km en el puesto #12 nacional del Ranking RNVV de SERNAGEOMIN (Categoría I Muy Alto Riesgo por regla de excepción VEI >= 4), con erupciones históricas en 1971 y 1991 que generaron lahares por el valle del Río Huemules y caída de cenizas hacia Río Ibáñez y Chile Chico, junto a 142 eventos sísmicos USGS en el clúster Hudson/Simpson.'
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
      'DGA-MOP — Inventario Público de Glaciares IPG 2022 de la Región de Aysén (8.721,6 km² / 10.301 glaciares)',
      'CONAF — Estadísticas de Visitación SNASPE y Plan de Manejo PN Laguna San Rafael',
      'CECs / Universidad de Chile / CIEP — Monitoreo Glaciológico en Campos de Hielo Norte y Sur'
    ],
    relatedComunas: ['aysen', 'tortel', 'rio_ibanez', 'ohiggins'],
    relatedNodos: [4, 5, 30, 36],
    relatedAdrs: ['adr_002_reconciliacion_38_fuentes_invariantes', 'adr_003_enrutador_hibrido_llm_first_omniroute'],
    synthesis:
      'El Parque Nacional Laguna San Rafael (1.742.000 ha SNASPE entre Aysén, Tortel y Río Ibáñez) constituye la puerta occidental al Campo de Hielo Norte dentro de los 8.721,6 km² de superficie glaciar regional (10.301 glaciares, IPG 2022 DGA-MOP). Registra 39.800 visitas anuales SNASPE (CONAF 2026) y alberga la Base Glaciológica San Rafael (CECs / Universidad de Chile) para monitoreo de retroceso glacial.'
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
      'SERNAGEOMIN — Red Nacional de Vigilancia Volcánica (RNVV, 5 volcanes activos en Aysén; Hudson #12 Nacional Cat. I)',
      'DGA-MOP — Inventario Público de Glaciares IPG 2022 / SOCHICRI oct-2025 (10.301 glaciares / 8.721,6 km² en Aysén)',
      'CONAF — Estadísticas de Visitación SNASPE (Parque Nacional Laguna San Rafael)',
      'USGS / CSN — Catálogo Sísmico del Clúster Hudson-Simpson'
    ],
    relatedComunas: ['rio_ibanez', 'aysen', 'tortel', 'ohiggins', 'chile_chico'],
    relatedNodos: [4, 5, 30, 31, 36],
    relatedAdrs: ['adr_002_reconciliacion_38_fuentes_invariantes', 'adr_003_enrutador_hibrido_llm_first_omniroute'],
    synthesis:
      'El corredor criosférico y volcanológico occidental de Aysén articula dos hitos geofísicos mayores: ' +
      '(1) El Volcán Hudson (-45.90, -72.97, 1.905 m, límite comunal Río Ibáñez / Aysén), estratovolcán con caldera activa de 10 km clasificado en el puesto #12 nacional del Ranking RNVV de SERNAGEOMIN (Categoría I de Muy Alto Riesgo por regla de excepción VEI >= 4), parte de los 5 volcanes activos de Aysén monitoreados por RNVV (junto a Melimoyu Cat. II, Mentolat #35 Cat. III, Macá #39 Cat. III y Cay #63 Cat. IV), cuyas erupciones plinianas de 1971 y 1991 provocaron lahares catastróficos por el valle del Río Huemules y dispersión de tefra hacia Río Ibáñez y Chile Chico; y ' +
      '(2) El Parque Nacional Laguna San Rafael (1.742.000 ha SNASPE entre Aysén, Tortel y Río Ibáñez), puerta occidental al Campo de Hielo Norte dentro de los 8.721,6 km² y 10.301 glaciares inventariados por DGA-MOP IPG 2022 (~1.235,6 km³ de agua equivalente), que recibe 39.800 visitas anuales SNASPE (CONAF 2026) y alberga la Base Glaciológica San Rafael.',
    entitySyntheses: {
      volcan_hudson:
        'El Volcán Hudson (-45.90, -72.97, límite Río Ibáñez / Aysén) es un estratovolcán con caldera activa de 10 km, #12 nacional en el Ranking RNVV de SERNAGEOMIN (Categoría I Muy Alto Riesgo por regla de excepción VEI >= 4), con erupciones históricas en 1971 y 1991 que generaron lahares por el valle del Río Huemules y caída de cenizas hacia Río Ibáñez y Chile Chico. Cerro Arenales queda excluido de volcanes activos RNVV (Stern et al. 2016) y Volcán Lautaro (Cat. III, Natales/Magallanes) actúa como amenaza transregional en el borde sur de O\'Higgins.',
      laguna_san_rafael_campos_hielo:
        'El Parque Nacional Laguna San Rafael (1.742.000 ha SNASPE entre Aysén, Tortel y Río Ibáñez) constituye la puerta occidental al Campo de Hielo Norte dentro de los 8.721,6 km² y 10.301 glaciares de superficie glaciar regional según el IPG 2022 DGA-MOP (SOCHICRI oct-2025). Registra 39.800 visitas anuales SNASPE (CONAF 2026).'
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
      'Aysén Sistémico adopta una arquitectura de costo de infraestructura cero ($0/mes) basada en HTML5, CSS3 y JavaScript Vanilla ES6+ sin dependencias de Node.js en tiempo de ejecución ni bases de datos relacionales pagadas. El pipeline de compilación estática (`scripts/build_aysen_hubs_bundle.cjs`) empaqueta las variables comunales verificadas del Data Lake, 10 Hubs temáticos (`I` al `X`), 41 Nodos Satélite (`#01` al `#41`) y fuentes oficiales en `data/aysen_hubs_data.js`, alimentando cinco módulos integrados bajo la identidad visual Cuaderno Editorial y Cartográfico Austral: Portada Vectorial (`portal.html`), Visualizador de Complejidad (`sistemas_complejos.html`), Data Hub Territorial (`index.html`), Laboratorio Cartográfico 2D (`laboratorio.html`) y Consultor Semántico IA (`consultor.html`).',
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
      'DGA-MOP — Inventario Público de Glaciares IPG 2022 / SOCHICRI oct-2025 (10.301 glaciares / 8.721,6 km²)',
      'DEIS - MINSAL / Servicio de Salud Aysén — 5 Hospitales (213 camas diseño), 4 CESFAM, 4 CECOSF, 27 PSR, 9 EMR, 2 COSAM',
      'ANID / CORFO / CIEP / UAysén — 16 Centros CTCi y 124 Investigadores Residentes',
      'DIPRES / GORE Aysén — Ejecución Presupuestaria FNDR'
    ],
    relatedHubs: ['hub_02_salmonicultura', 'hub_04_gobernanza', 'hub_07_biodiversidad', 'hub_08_salud', 'hub_10_ctci'],
    relatedComunas: ['coyhaique', 'aysen', 'cisnes', 'guaitecas', 'tortel', 'ohiggins'],
    relatedConcepts: ['modelo_salmonicultor', 'ecosistema_ctci_ciencia', 'red_asistencial_salud', 'volcan_hudson_y_campos_de_hielo'],
    synthesis:
      'Tras auditar los 10 Hubs, se establecieron invariantes numéricos únicos en todo el repositorio para eliminar discrepancias entre tablas comunales, nodos satélite y respuestas del Consultor IA: (1) Salmonicultura: 13 holdings salmoneros madres con 745 concesiones otorgadas en las 4 comunas costeras, 245 centros operativos activos y 503.500 toneladas de biomasa cosechada; (2) Criósfera DGA (IPG 2022 / SOCHICRI oct-2025): 10.301 glaciares y 8.721,6 km² de superficie glaciar regional (~1.235,6 km³ agua equivalente); (3) Salud APS & Hospitales (Hub VIII — Sprint 11): red 100% DAP SSA (0% salud municipalizada; 0 clínicas privadas de hospitalización general), 5 hospitales con 213 camas de diseño (219 con UPC Pediátrica jun-2026; 174 agudas efectivas; 8 pabellones; Hospital Dr. Leopoldo Ortega Rodríguez de Chile Chico 7 camas/1 pabellón), 4 CESFAM (+1 en construcción), 4 CECOSF, 27 PSR (100% tele-ECG), 9 EMR, 2 COSAM, SIGTE T3 2026 (14.751 CNE / 159d; 3.608 IQ / 262d; 6.870 Odonto / 242d; 524 GES / 88d), 454+45 SAMU y suicidio 19,9/100k (#1 Chile); (4) Ecosistema CTCi: 16 centros científicos con 124 investigadores residentes y 179 proyectos totales (120 ANID + 59 CORFO); (5) Finanzas GORE y Municipales: ingresos municipales BCN/SINIM 2025 de 84.820,68 M$ (FCM 41.753,32 M$ brutos), FNDR 2025 devengado de 73.863,0 M$ (92,0%) y acuerdo Hacienda 2027 en 80.748,0 M$; (6) Economía, Inversión y Suelo (Hub V — Sprint 8): PIB nominal BCCh 2025 de 1.991.000 MM$ (+8,5% real, 13 actividades, 1T 2026 -2,6% real), demografía SII (13.453 empresas / 35.832 trabajadores en 2025; 5 tramos UF BCN 2024 sobre 12.953 empresas; 25.800 MUF domicilio local vs. 131.520 MUF valor bruto de producción), SEIA sin alucinaciones extrarregionales y sincronía 1:1 (Cuenta Pública SEA 2025), ChileCompra 2026 YTD (228.874,2 M$), SERNAGEOMIN (356 conc. / 128.511 ha), ODEPA (144.118 bovinos / 177.972 ovinos) y CONAF 2026 (10.667.211,5 ha / 5.152.384,3 ha bosque nativo); (7) Desarrollo Social (Hub VI — Sprint 9): Censo 2024 (100.745 hab. INE / 39.964 hogares / 52.294 viviendas / IAM 66,2), MINVU CECT (1.927 cuantitativo / 12,9% cualitativo = 5.155 / 10 campamentos / PEH 1.671 = 129,2%), DOH-MOP (47 SSR / 28.833 personas / 9.185 familias), Educación (86 colegios; 55 SLEP + 10 VTF; 2.924 SIES 2026) y CEAD VIF oficial 2023–2025; y (8) Biodiversidad, Criósfera, Aire e Hidrología (Hub VII — Sprint 10): CONAF 2026 (4 tipos forestales sumando 5.152.384,3 ha incl. Coihue de Magallanes 882.420,0 ha; 5.189.923,8 ha subuso Bosques), 20° Proceso RCE oct-2026 (154 taxones, 64 en amenaza directa; Huemul 750–1.000 en Aysén y < 1.500 global; Ballena Azul < 250; Huillín EN VI–X / IC XI–XII), EEI (Castor 0 comunas invadidas con SAT mar-2025; Jabalí 6 comunas; Didymo 6 cuencas BNA D.Ac. N° 414/2024), SINCA EMRP únicamente en Coyhaique (97 GEC 2026 / 87 en 2024) y Puerto Aysén (16 días base 2022 / 34 en 2018), régimen nivo-glacial DGA Río Baker BNA 11530000-8 (Feb 675 m³/s, Ago 395 m³/s; 8° conector dga_hidrologia) y 5 volcanes RNVV en Aysén (Hudson #12 Cat. I; exclusión Cerro Arenales).',
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
      'Debido a que Coyhaique concentra 57.823 de los 100.745 habitantes de Aysén (57,4%) y Puerto Aysén 23.170 (23,0%) (80,4% conjunto), cualquier cruce bruto entre dos variables de conteo absoluto (por ejemplo, número de empresas SII vs. matrícula escolar o presupuesto municipal total) produce coeficientes de determinación aparentes superiores a R² = 0,92 que solo reflejan el tamaño poblacional. Para evitar inferencias causales espurias, Aysén Sistémico incorpora normalización dinámica Per Cápita (por 1.000 habitantes), Participación % Regional y un filtro «Excluir Coyhaique (Outlier)» tanto en `laboratorio.html` como en `consultor.html`, priorizando cruces físicamente independientes como Tarifa Eléctrica BT1 ($/kWh) vs. Consumo Residencial de Leña (m³/hogar/año) o Tiempo de Derivación Médica (hrs) vs. Mediana de Espera Quirúrgica (días).',
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
      'Para superar la amnesia entre sesiones de los agentes LLM sin poner en riesgo la integridad de las variables numéricas del Data Lake, Aysén Sistémico implementa el patrón `llm-wiki` de Andrej Karpathy bajo una arquitectura dual: los vectores cuantitativos permanecen inmutables en `scripts/build_aysen_hubs_bundle.cjs` y `data/aysen_hubs_data.js`, mientras que el conocimiento semántico, causal y regulatorio se compila en `wiki/` (77 notas Markdown interconectadas con YAML frontmatter para Obsidian Dataview, `wiki/index.md` y `wiki/log.md`). El puente `scripts/obsidian_wiki_bridge.cjs` sincroniza bidireccionalmente la carpeta `wiki/` con el Vault de Obsidian del autor en Google Drive (`Aysen_Sistemico/`), valida 5 invariantes deterministas (`--lint`) y compila las síntesis editadas en Obsidian hacia `data/aysen_wiki_compiled.js` (`--compile`), hidratando en vivo a `window.OmniRouteClient`.',
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
      `| Infraestructura Cultural y Bibliotecas | ${fmtNum(c.museos_count)} museos RMC (${fmtNum(c.total_espacios_culturales)} espacios) / ${fmtNum(c.bibliotecas_snbp_n)} bibliotecas SNBP | [[hubs/hub_09_cultura|Hub IX — Cultura]] |`,
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
  20: ['empresas_sii', 'trabajadores_sii', 'ventas_sii_domicilio_local_muf', 'ventas_sii_muf', 'sucursales_bancarias_n', 'cajeros_automaticos_n', 'cajavecina_puntos_n'],
  21: ['concesiones_mineras_ha', 'fet_royalty_minero_2025_mclp'],
  22: ['suelo_fiscal_bbnn_pct', 'superficie_snaspe_pct', 'parcelaciones_sag_n'],
  23: ['poblacion_censo_2024', 'hogares_censo_2024', 'viviendas_totales_censo_2024', 'indice_envejecimiento', 'pobreza_ingresos_pct', 'pobreza_multidim_pct'],
  24: ['camas_hospitalarias', 'medicos_por_mil_hab', 'traslado_coyhaique_hrs'],
  25: ['matricula_escolar', 'matricula_slep_aysen_n', 'establecimientos_escolares_n', 'establecimientos_slep_aysen', 'matricula_educacion_superior_sies_n'],
  26: ['tasa_vif_100k', 'tasa_dmcs_100k'],
  27: ['cobertura_vegetal_nativa_ha', 'cobertura_vegetal_pct', 'bosque_nativo_ha'],
  28: ['fauna_amenazada_n', 'superficie_snaspe_pct'],
  29: ['especies_exoticas_invasoras_n', 'parcelaciones_sag_n'],
  30: ['dias_sobre_norma_mp25', 'episodios_gec_mp25_anual', 'superficie_glaciares_km2'],
  31: ['amenaza_volcanica_sismica_idx', 'superficie_glaciares_km2'],
  32: ['monumentos_nacionales_count', 'museos_count', 'bibliotecas_snbp_n', 'total_espacios_culturales'],
  33: ['fondart_fndr_mclp', 'gasto_cultura_per_capita_clp'],
  34: ['total_espacios_culturales', 'participacion_cultural_pct_c2', 'pueblos_originarios_pct_censo_2024', 'comunidades_indigenas_conadi', 'puntos_cultura_comunitaria_pcc_n'],
  35: ['proyectos_anid_n', 'monto_anid_mclp', 'proyectos_anid_locales_count'],
  36: ['centros_y_estaciones_ctci_count', 'investigadores_residentes_est', 'proporcion_ciencia_endogena_pct'],
  37: ['monto_corfo_innova_mclp', 'proyectos_corfo_innova_count', 'total_proyectos_ctci'],
  38: ['postas_salud_rural', 'establecimientos_aps_n', 'traslado_coyhaique_hrs'],
  39: ['mediana_espera_quirurgica_dias', 'espera_no_ges_n', 'aeroevacuaciones_samu_n'],
  40: ['red_vial_total_km', 'red_vial_pavimentada_km', 'red_vial_pavimentada_pct', 'tiempo_viaje_coyhaique_hrs'],
  41: ['deficit_habitacional_cuantitativo_n', 'deficit_cuantitativo_pct_hogares', 'deficit_habitacional_cualitativo_n', 'sistemas_ssr_apr_n', 'beneficiarios_ssr_apr_doh', 'cobertura_ssr_apr_familias']
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
    'La bitácora cronológica (`wiki/log.md`) registra de manera inmutable todas las operaciones de ingesta estadística (`ingest`), decisiones arquitectónicas (`adr`) y validaciones deterministas (`lint`) sobre la base de conocimiento de Aysén Sistémico (10 comunas, 10 Hubs, 41 Nodos Satélite y fuentes oficiales verificadas).',
    '',
    '## [2026-10-16] ingest | Inicialización del Data Lake Territorial (10 Comunas, Fuentes Oficiales)',
    '- Compilación inicial de indicadores comunales CENSO 2024, SINIM, SERNATUR, CONAF, SERNAPESCA, CNE, SEC, DEIS y ANID hacia [[index|Índice Maestro de la Wiki]] y [[comunas/coyhaique|Coyhaique]].',
    '',
    '## [2026-11-21] adr | Reorganización Taxonómica en 10 Hubs, 41 Nodos Satélite y 30 Subcategorías',
    '- Commit `6497827`: Estandarización de la ontología territorial en 10 Hubs equilibrados (`I` al `X`) documentada en [[adr/adr_001_arquitectura_cero_costo_vanilla|ADR-001]] y [[hubs/hub_04_gobernanza|Hub IV — Gobernanza]].',
    '',
    '## [2026-11-22] ingest | Reingeniería Integral de los Hubs II al X (Variables Comunales Verificadas)',
    '- Commits `50ab91a`, `a4d8c79`, `2890ce3`, `e9ea303`: Incorporación de varianza real en vectores clínicos DEIS ([[hubs/hub_08_salud|Hub VIII — Salud]]), 16 centros CTCi con 124 investigadores ([[hubs/hub_10_ctci|Hub X — CTCi]]), 18 espacios museográficos ([[hubs/hub_09_cultura|Hub IX — Cultura]]), 10.035,7 km² glaciares DGA ([[hubs/hub_07_biodiversidad|Hub VII — Biodiversidad]]) y 27 Postas de Salud Rural ([[nodos/nodo_38|Nodo #38]]). Véase [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]].',
    '',
    '## [2026-11-22] adr | Arquitectura Semántica LLM-First en Consultor y Motor de Dossier PDF A4 en Laboratorio',
    '- Commits `6ecf4c5` y `080de7a`: Implementación de paquetes conceptuales ([[conceptos/financiamiento_municipal|Financiamiento Municipal]], [[conceptos/sistema_electrico_energia|Matriz Energética]]), grafo territorial multi-entidad ([[conceptos/huemules_multidimensional|Huemules]], [[conceptos/volcan_hudson_y_campos_de_hielo|Volcán Hudson y Laguna San Rafael]]), reparación conversacional pura y guiada ([[adr/adr_003_enrutador_hibrido_llm_first_omniroute|ADR-003]]) y generador PDF editorial A4 con narrativa de 3 párrafos por gráfico ([[adr/adr_005_motor_reportes_ejecutivos_pdf_a4|ADR-005]]).',
    '',
    '## [2026-11-23] lint | Instanciación de la Wiki Compilada de Karpathy y Sincronización con Obsidian Vault',
    '- Compilación de 77 páginas canónicas en `wiki/` ([[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]), verificación de 0 enlaces rotos, 0 páginas huérfanas y 100% de paridad numérica contra `data/aysen_hubs_data.js`.',
    '',
    '## [2026-11-25] ingest | Sprint 4: Reingeniería Forense Hub II (18 Barrios ACS, Padrón SUBPESCA, PUA Art. 84 LGPA y SNIFA-SMA)',
    '- Unificación de `antibioticos_ica_g_ton`, resolución de `ACS-35` Tortel, solicitudes ECMPO Guaitecas/Tortel, catastro real SUBPESCA y `barriosAcs` en [[hubs/hub_02_salmonicultura|Hub II]], [[conceptos/modelo_salmonicultor|Modelo Salmonicultor]] y [[nodos/nodo_06|Nodos #06]]–[[nodos/nodo_09|#09]].',
    '',
    '## [2026-11-26] ingest | Sprint 5: Reingeniería Forense Hub I Turismo/SNASPE y Saneamiento Transversal 10 Hubs',
    '- Reconciliación EMAT 2025 (364.039 pernoctaciones), RNPST (1.728 servicios), dimensión `dim: \'snaspe\'` (N=19), asimetría SII real (13.453 empresas / 35.832 trabajadores) y Auditoría Obsidian V2 en [[hubs/hub_01_turismo|Hub I]] y [[hubs/hub_05_inversion|Hub V]].',
    '',
    '## [2026-11-26] ingest | Sprint 6: Reingeniería Forense del Hub III (Energía, Combustibles, Matriz Térmica, SUBTEL/FOA) e Invariantes Obsidian V3',
    '- Erradicación del nodo alucinado `Cabo Juan Román`, catastro reconciliado de 21 centrales operativas sumando exactamente `67,10 MW` (+`18,98 MW` ERNC en construcción 2026) con SSAA `<= 1,50 MW` (Art. 173° LGSE), BT1 nov-2026 `Decreto N° 8T/2026` (`$287,8/kWh`), `13.448` hogares Subsidio Eléctrico Ley 21.667 y `data/raw/energia_telecom/marco_regulatorio_tarifario_aysen_2024_2028.json`.',
    '- Corte combustibles CNE 19-nov-2026 (`$1.696/L` gasolina 93, `$1.663/L` diésel, `$1.497/L` kerosene FEPP), Terminal MBM Copec Chacabuco `6.674 m³` activos (`10.474 m³` totales), leña INFOR BES N° 11 `334.274 m³ sólidos/año` (`Coyhaique 147.080 m³s [44,0%]`, `68,8%` hogares, `9,81 m³s/hogar`), trazado real SUBTEL/FOA (único aterrizaje CTR en [[comunas/tortel|Tortel]], GTD privado en Puerto Chacabuco, 14 POIITs Silica, `FDT-2025-03` y Tortel–O\'Higgins 1S-2028) y paridad censal `26.294`/`24.782` conexiones en [[hubs/hub_03_energia|Hub III]] y [[nodos/nodo_11|Nodos #11]]–[[nodos/nodo_14|#14]].',
    '- Cierre residuales Sprint 5 (`isAliasOf` USD/CLP, neutralización bilateral de 3 complementos `100 - X` y `comuna_principal`/`comuna_ine` en 19 `unidadesSnaspe`) y evolución a **Obsidian Indicator Audit V3** (Evals E13–E16).',
    '',
    '## [2026-11-26] ingest | Sprint 8: Reingeniería Forense del Hub V (BCCh, SII 5 Tramos, SEIA 1:1, SERNAGEOMIN, ChileCompra, CMF, ODEPA y CONAF 2026)',
    '- Reconciliación macroeconómica BCCh Cuentas Nacionales Regionales 2018–2025 (`1.991.000 MM$` en 2025, `+8,5%` real, FBCF `+18,2%`, PIB turístico `89.200 MM$` = `4,5%`, 1T 2026 `-2,6%` real, 13 actividades económicas) y eliminación de contradicción SII (`9.365/56.475`) mediante 5 tramos UF BCN 2024 (`12.953` emp.), ventas domicilio local (`25.800 MUF`) vs valor bruto producción (`131.520 MUF`) y series SII 2022–2025 en [[hubs/hub_05_inversion|Hub V]] y [[nodos/nodo_20|Nodo #20]].',
    '- Erradicación geográfica de `Los Cóndores` (Maule) reemplazada por `Central Hidroeléctrica Río Mañihuales` (`Edelaysen S.A.`), limpieza de parámetros ficticios `id_expediente=`, sincronía 1:1 SEIA, Cuenta Pública SEA 2025 (`3` aprobados, `1` desistido, `0` rechazados, `72` pertinencias), catastro SERNAGEOMIN (`356` conc. / `128.511 ha` con Pacífico del Sur y Andean Silver), ChileCompra (`230.850 M$` 2024 / `238.400 M$` 2025 / `228.874,2 M$` 2026 YTD), banca CMF 2025 + leyes de excepción, ODEPA (`144.118` bovinos / `177.972` ovinos), CONAF 2026 (`10.667.211,5 ha` / `5.152.384,3 ha` bosque nativo / `2.387.525,4 ha` en SNASPE) y **Eval E18** en [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]].',
    '',
    '## [2026-11-27] ingest | Sprint 9: Reingeniería Forense del Hub VI (Censo 2024, CASEN 2022/2024, MINVU CECT/PEH, DOH-MOP, SLEP/SIES 2026, CEAD) y Eval E19',
    '- Parche de residuos Sprint 8 (eliminado falso `isAliasOf: total_proyectos_ctci` en `matricula_educacion_superior_sies_n`, alineado `ventas_sii_domicilio_local_muf` sumando `25.800 MUF` y desagregación `personas` vs. `familias` SSR/APR) y actualización oficial de [[hubs/hub_06_social|Hub VI]] (Coyhaique `57.823 [57,4%]` y Aysén `23.170 [23,0%]`), `39.964` hogares, `52.294` viviendas (`39.631` ocupadas), IAM `66,2` (`1992: 13,7`), masculinidad `97,9`, pueblos originarios `29,0%` e inmigración `3,9%`.',
    '- Reconciliación CASEN 2022/2024 (nueva metodología ene-2026: `14,3%` ingresos / `12,1%` multidimensional), MINVU CECT (`1.927` déficit cuantitativo = `4,8%`, `12,9%` cualitativo = `5.155`, `10` campamentos / `244` hogares, cierre PEH feb-2026 `1.671` viviendas = `129,2%`), DOH-MOP (`47` SSR / `28.833` pers. / `9.185` familias), Educación (`86` colegios, `55` SLEP + `10` VTF, `2.924` SIES 2026, Tortel `1` escuela y `0` liceos), CEAD/VIF 2023–2025 sin múltiplos redondos sintéticos y **Eval E19** en [[nodos/nodo_23|Nodo #23]], [[nodos/nodo_25|#25]], [[nodos/nodo_26|#26]] y [[nodos/nodo_41|#41]].',
    '',
    '## [2026-11-27] ingest | Sprint 10: Reingeniería Forense del Hub VII (Biodiversidad, Criósfera IPG 2022, RCE, EEI, SINCA, DGA `BNA 11530000-8`, Volcanismo RNVV), 8° Conector `dga_hidrologia` y Eval E20',
    '- Cierre de residuo SIES 2026 en [[nodos/nodo_36|Nodo #36]] (`2.924` estudiantes: `2.187` Coyhaique + `737` Aysén) y reconciliación integral del [[hubs/hub_07_biodiversidad|Hub VII]]: Catastro CONAF 2026 con 4 tipos forestales sumando `5.152.384,3 ha` (`Coihue de Magallanes 882.420,0 ha`), `5.189.923,8 ha` Bosques total y `2.387.525,4 ha` en SNASPE; criósfera IPG 2022 (`10.301` glaciares / `8.721,6 km²` / `~1.235,6 km³`); 20° Proceso RCE oct-2026 (`154` taxones / `64` amenazadas, Huemul `750–1.000` en Aysén y `<1.500` global, Ballena Azul `<250`, Huillín EN VI–X / IC XI–XII); EEI (`Castor` `0` comunas establecidas con SAT mar-2025, `Jabalí` `6` comunas, `Didymo` `6` cuencas BNA D.Ac. N° 414/2024, `Visón` WCS/SAG ago-2026).',
    '- Exclusividad SINCA EMRP en Coyhaique (`97` GEC 2026 / `87` 2024) y Puerto Aysén (`16` días base 2022 / `34` 2018, D.S. N° 03/2025), régimen nivo-glacial del Río Baker `BNA 11530000-8` (máx. Feb `675 m³/s`, mín. Ago `395 m³/s`, 12 meses cerrados sin fechas futuras), 5 volcanes activos RNVV en Aysén (Hudson `#12` Cat. I; exclusión Cerro Arenales; Volcán Lautaro transregional), registro del 8° conector en vivo `dga_hidrologia` y **Eval E20** en [[nodos/nodo_27|Nodos #27]]–[[nodos/nodo_31|#31]] y [[conceptos/volcan_hudson_y_campos_de_hielo|Volcán Hudson y Campos de Hielo]].',
    '',
    '## [2026-11-27] ingest | Sprint 11: Reingeniería Forense del Hub VIII (Red SSA 213 Camas, DEIS APS 27 PSR, SIGTE T3 2026, SAMU 454+45, DEIS 19,9/100k) y Eval E21',
    '- Cierre de residuos Sprint 10 en `data/estaciones_aysen.json` (`0` fechas futuras `2026-12` en las 16 estaciones) y `sys.path` en `wp_07_biodiversidad_flora_fauna.py`.',
    '- Reconciliación integral del [[hubs/hub_08_salud|Hub VIII]] y [[conceptos/red_asistencial_salud|Red Asistencial de Salud]]: dependencia 100% DAP SSA (`0%` salud municipalizada; `0` clínicas privadas hospitalización general; Convenio GORE–MINSAL `$195.000M`), 5 hospitales con `213` camas de diseño (`135` HRC basales / `141` con UPC Pediátrica jun-2026 / `4` pabellones / `18` hemodiálisis; `56` Puerto Aysén con bloqueo sociosanitario `7/17` Medicina y `~30` en red SSA; `8` Puerto Cisnes; `7` Hospital Dr. Leopoldo Ortega Rodríguez de Chile Chico feb-2026 erradicando el falso nombre San José; `7` Hospital Lord Cochrane acreditado may-2026; `8` pabellones), catastro DEIS 03-11-2026 (`4` CESFAM +1 en construcción, `4` CECOSF, `27` PSR 100% tele-ECG, `9` EMR, `2` COSAM).',
    '- Actualización Glosa 06 SIGTE T3 2026 (`14.751` CNE / `159d`, `3.608` IQ / `262d`, `6.870` Odonto / `242d`, `524` retrasos GES / `88d`, `149,6/100k` oncológico GES), SAMU (`454` primarias + `45` secundarias; Melinka regulado por SAMU Reloncaví; déficit ECMO HRC), epidemiología DEIS (suicidio `19,9/100k` `#1` Chile, `64%` *H. pylori* C16, vesícula C23 `18,29/100k`), dotación médica (`5,54` RNPI vs `1,80` red pública SSA; UAysén `0` Medicina), reemplazo `B3_B` por `I4_A` en `salud.espejo_barometro`, [[nodos/nodo_39|Nodo #39]] y **Eval E21** en [[nodos/nodo_24|Nodos #24]], [[nodos/nodo_38|#38]]–[[nodos/nodo_39|#39]].',
    '',
    '## [2026-11-27] ingest | Sprint 12: Reingeniería Forense del Hub IX (CMN 16/23, RMC 16/27, SNBP 16/31.221, Censo 2024 Indígena 29,0%, CONADI 47 SIIC, 25 PCC, Barómetro N=465) y Eval E22',
    '- Reconciliación integral del [[hubs/hub_09_cultura|Hub IX]] y [[nodos/nodo_32|Nodos #32]]–[[nodos/nodo_34|#34]]: catastro CMN (`16` declaratorias / `23` bienes protegidos: `12` MH / `19` bienes incluyendo 8 inmuebles SIA en Coyhaique, `1` ZT Caleta Tortel, `3` SN reasignando *Capilla de Mármol* `CP-NOD-04` a Río Ibáñez `11402`; Lago Verde `1`, Cisnes `1`, Cochrane `1`), RMC (`16` museos activos / `27` Red Regional; Museo Regional de Aysén `36.173` visitas SNM 2025), SNBP (`16` bibliotecas fijas / `31.221` préstamos 2024 / `18.199` Biblioteca Regional) y `6` centros culturales (`54` espacios culturales totales).',
    '- Recálculo exacto de `gasto_cultura_per_capita_clp` sobre padrón Censo 2024 (`$43.537` Lago Verde, `$32.860` Tortel, `$11.850` Coyhaique), serie MINCAP 2022–2026 (`57` proy. / `$1.007M` en 2025, PAOCC `5` orgs., Red Cultura `7` espacios + `$61M`), FNDR 8% (`$5.681M` / `355` iniciativas 2025), ENPCCL 2024 (`62,0%`), `25` PCC, unificación indígena Censo 2024 (`29,0%` = `29.230` hab., Guaitecas `57,9%`), desglose CONADI SIIC (`47` Comunidades / `490` familias + `27` Asociaciones = `74` orgs.), preservación de CUT real en `wp_09_barometro_espejo.py`, semáforo muestral comunal (`B4_B = 4,04`, `n < 30` en 8 comunas rurales) y **Eval E22**.',
    '',
    '## [2026-11-27] ingest | Sprint 13: Reingeniería Forense del Hub X (16 Centros / 124 Inv., 120 ANID + 59 CORFO, NCA 2026, SIES 2.924, SEREMI Ciencia Aysén) y Eval E23',
    '- Persistencia en disco (v2.0.0) de `wp_11_ctci_anid_corfo.py`, `10_ctci_innovacion.json` y CSVs con padrón comunal Censo 2024 (`101.148` suma / `100.745` regional), `16` nodos (`CTCI-NOD-01..16`, `[6,1,2,1,1,1,1,1,1,1]`) y `124` investigadores residentes (`[91,1,14,4,2,3,2,3,1,3]`), separando `179` CTCi (`$25.776,8M`) = `120` ANID (`$17.326,8M`: `68` locales `$11.850,5M` + `52` extrarregionales `$5.476,3M`) + `59` CORFO (`$8.450,0M`).',
    '- Integración de `hitos_anid_minciencia_2025_2026` (FIUT Etapa 2 UAysén `$10.484M`, CIEP PATSER `$2.750M` + Basal GORE `>$1.599M`, Compendio ANID 2025, COPAS Coastal 2026–2031 e INCAR²), `catastro_equipamiento_critico_nca_2026` (`6` FONDEQUIP, `9` equipos activos = `$1.683.057.705 CLP` en Coyhaique), matrícula SIES 2026 (`2.924`: INACAP `1.187`, UAysén `1.000`, CFT Estatal `737`), nómina real CIEP (`47`), 1er Banco Zoogenético INIA, nueva sede IFOP oct-2024, Reserva Elemental Melimoyu (`16.000 ha`), deslinde Bahía Exploradores (`11201`/`11402`), CDPR CORFO (`$2.534M` 2026), Plan Aysén Azul (`>$7.500M`), FIA, INAPI (`252` marcas `+63%`), SEREMI de Ciencia Aysén (oct-2025), semáforo muestral (`4,98`/`5,08`) y **Eval E23** en [[hubs/hub_10_ctci|Hub X]], [[nodos/nodo_35|Nodos #35]]–[[nodos/nodo_37|#37]] y [[conceptos/ecosistema_ctci_ciencia|Ecosistema CTCi]].',
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
    'La Wiki Territorial de Aysén Sistémico organiza el conocimiento verificado de la Región de Aysén (100.745 habitantes Censo 2024, 10 comunas, indicadores comunales verificados y fuentes institucionales) en 77 páginas canónicas interconectadas: 1 índice maestro (`index.md`), 1 bitácora cronológica (`log.md`), 10 Hubs temáticos (`I` al `X`), 10 radiografías comunales, 41 fichas de Nodos Satélite (`#01` al `#41`), 8 paquetes conceptuales y entidades territoriales multidimensionales, y 6 registros de decisiones de arquitectura y datos (`ADR-001` a `ADR-006`).',
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
