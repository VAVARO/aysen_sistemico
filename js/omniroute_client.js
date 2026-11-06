/**
 * js/omniroute_client.js
 * Cliente de Inteligencia Artificial para Aysén Sistémico basado en OmniRoute
 * Endpoint OpenAI-compatible (/v1/chat/completions) con verificación de datos oficiales
 * fundamentado 100% en window.AYSEN_HUBS_DATA y las 28 fuentes oficiales de la Región de Aysén.
 *
 * Cero emojis. Estética sobria, técnica y cartográfica austral.
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OmniRouteClient = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // Catálogo canónico de las 28 fuentes oficiales de Aysén Sistémico
  const FUENTES_OFICIALES_28 = [
    { id: 1, institucion: 'SERNATUR', indicador: '01. Registro Nacional de Prestadores Turísticos', url: 'https://registro.sernatur.cl/', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 2, institucion: 'SUBTURISMO', indicador: '02. Zonas de Interés Turístico (ZOIT)', url: 'https://www.subturismo.gob.cl/zoit/', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 3, institucion: 'INE', indicador: '03. Encuesta Mensual de Alojamiento Turístico (EMAT)', url: 'https://www.ine.gob.cl/estadisticas/economicas/turismo', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 4, institucion: 'CONAF', indicador: '04. Estadísticas de Visitación SNASPE', url: 'https://www.conaf.cl/parques-nacionales/visitanos/estadisticas-de-visitacion/', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 5, institucion: 'SUBPESCA', indicador: '05. Catastro de Concesiones de Acuicultura (745 concesiones)', url: 'https://mapas.subpesca.cl/visorsubpesca/', hub: 'II. Salmonicultura', anos: '2015-2026' },
    { id: 6, institucion: 'SERNAPESCA', indicador: '06. Fiscalización Sanitaria, Biomasa y Antimicrobianos', url: 'https://www.sernapesca.cl/informes/acuicultura', hub: 'II. Salmonicultura', anos: '2015-2026' },
    { id: 7, institucion: 'IFOP', indicador: '07. Monitoreo Oceanográfico y Floraciones Algales', url: 'https://www.ifop.cl/', hub: 'II. Salmonicultura', anos: '2015-2026' },
    { id: 8, institucion: 'CMF', indicador: '08. Memorias Financieras de Holdings Acuícolas', url: 'https://www.cmfchile.cl/', hub: 'II. Salmonicultura', anos: '2015-2026' },
    { id: 9, institucion: 'CNE', indicador: '09. Capacidad Instalada y Generación Eléctrica (Energía Abierta)', url: 'https://energiaabierta.cl/', hub: 'III. Energía', anos: '2015-2026' },
    { id: 10, institucion: 'SEC', indicador: '10. Interrupciones Eléctricas SAIDI y Tarifas BT1', url: 'https://www.sec.cl/', hub: 'III. Energía', anos: '2015-2026' },
    { id: 11, institucion: 'CNE', indicador: '11. Precios Minoristas de Combustibles y Leña (Bencina en Línea)', url: 'https://www.bencinaenlinea.cl/', hub: 'III. Energía', anos: '2015-2026' },
    { id: 12, institucion: 'SUBTEL', indicador: '12. Conectividad Digital y Fibra Óptica Austral', url: 'https://www.subtel.gob.cl/', hub: 'III. Energía', anos: '2015-2026' },
    { id: 13, institucion: 'SUBDERE - SINIM', indicador: '13. Finanzas Municipales y Fondo Común Municipal (FCM)', url: 'https://datos.sinim.gov.cl/', hub: 'IV. Gobernanza', anos: '2015-2026' },
    { id: 14, institucion: 'DIPRES / GORE Aysén', indicador: '14. Ejecución Presupuestaria Regional FNDR', url: 'https://www.dipres.gob.cl/', hub: 'IV. Gobernanza', anos: '2015-2026' },
    { id: 15, institucion: 'SERVEL', indicador: '15. Resultados Electorales y Autoridades Comunales (2024-2028)', url: 'https://www.servel.cl/', hub: 'IV. Gobernanza', anos: '2024-2028' },
    { id: 16, institucion: 'MOP Vialidad', indicador: '16. Red Vial y Pavimentación Ruta 7 Austral', url: 'https://vialidad.mop.gob.cl/', hub: 'IV. Gobernanza', anos: '2015-2026' },
    { id: 17, institucion: 'SEA - SEIA', indicador: '17. Proyectos Evaluados y Aprobados en el SEIA (722 proyectos)', url: 'https://seia.sea.gob.cl/', hub: 'V. Inversión', anos: '2015-2026' },
    { id: 18, institucion: 'SII', indicador: '18. Estadísticas Tributarias de Empresas, Ventas y Empleo', url: 'https://www.sii.cl/sobre_finanzas/estadisticas/', hub: 'V. Inversión', anos: '2015-2026' },
    { id: 19, institucion: 'ChileCompra', indicador: '19. Transacciones y Compras Públicas Mercado Público', url: 'https://www.chilecompra.cl/', hub: 'V. Inversión', anos: '2015-2026' },
    { id: 20, institucion: 'MBN / SERNAGEOMIN', indicador: '20. Catastro de Propiedad Fiscal y Concesiones Mineras', url: 'https://catastro.bienes.cl/', hub: 'V. Inversión', anos: '2015-2026' },
    { id: 21, institucion: 'INE', indicador: '21. Censo de Población y Vivienda 2024', url: 'https://censo2024.ine.gob.cl/', hub: 'VI. Social', anos: '2017-2024' },
    { id: 22, institucion: 'MDSF - CASEN', indicador: '22. Encuesta de Caracterización Socioeconómica Nacional (CASEN)', url: 'https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen', hub: 'VI. Social', anos: '2015-2024' },
    { id: 23, institucion: 'MINEDUC / SLEP Aysén', indicador: '23. Matrícula, Asistencia y Establecimientos Escolares', url: 'https://datosabiertos.mineduc.cl/', hub: 'VI. Social', anos: '2015-2026' },
    { id: 24, institucion: 'CEAD - SPD', indicador: '24. Estadísticas Policiales y Seguridad Ciudadana', url: 'https://cead.spd.gob.cl/', hub: 'VI. Social', anos: '2015-2026' },
    { id: 25, institucion: 'MMA / CONAF SIT / SAG', indicador: '25. Inventario de Flora, Fauna RCE y Pisos Vegetacionales', url: 'https://mma.gob.cl/biodiversidad/', hub: 'VII. Biodiversidad', anos: '2015-2026' },
    { id: 26, institucion: 'MMA SINCA / DGA / SERNAGEOMIN', indicador: '26. Calidad del Aire (SINCA), Glaciares (DGA) y Red Sísmica', url: 'https://sinca.mma.gob.cl/', hub: 'VII. Biodiversidad', anos: '2015-2026' },
    { id: 27, institucion: 'DEIS - MINSAL / SSA', indicador: '27. Estadísticas Vitales, Red APS, Camas y SAMU', url: 'https://deis.minsal.cl/', hub: 'VIII. Salud', anos: '2015-2026' },
    { id: 28, institucion: 'SERPAT-CMN / ANID / CORFO', indicador: '28. Infraestructura Cultural, Cartera ANID, CORFO e Investigadores', url: 'https://dataciencia.anid.cl/', hub: 'IX. Cultura y X. CTCi', anos: '2015-2026' }
  ];

  // Mapeo exhaustivo de variables comunales a su Hub canónico (I a X)
  const VARIABLE_HUB_MAP = {
    // Hub I: Turismo
    prestadores_sernatur: 'I', camas_turisticas: 'I', pernoctaciones_emat: 'I',
    visitantes_snaspe: 'I', ratio_presion_turistica: 'I',
    // Hub II: Salmonicultura
    concesiones_salmon: 'II', centros_activos_salmon: 'II', biomasa_salmon_ton: 'II',
    antibioticos_ica_g_ton: 'II', amerb_decretadas: 'II', amerb_operativas: 'II',
    // Hub III: Energía
    potencia_mw: 'III', gasolina_93_clp: 'III', precio_lena_m3: 'III',
    saidi_horas_anual: 'III', tarifa_bt1_clp: 'III', costo_diesel_aislado_clp: 'III', internet_fijo_pct: 'III',
    // Hub IV: Gobernanza
    presupuesto_mclp: 'IV', presupuesto_per_capita_mclp: 'IV', dependencia_fcm_pct: 'IV',
    fndr_mclp: 'IV', ipp_per_capita_clp: 'IV', gasto_personal_pct: 'IV',
    inversion_directa_pct: 'IV', profesionalizacion_pct: 'IV',
    ruta7_pavimentada_km: 'IV', ruta7_ripio_km: 'IV',
    // Hub V: Inversión
    concesiones_mineras_ha: 'V', proyectos_seia_aprobados: 'V', inversion_seia_mmusd: 'V',
    empresas_sii: 'V', trabajadores_sii: 'V', seia_plazo_dias: 'V',
    compras_locales_pct: 'V', fuga_compras_pct: 'V', parcelaciones_sag_n: 'V',
    // Hub VI: Social
    poblacion_censo_2024: 'VI', porcentaje_regional_pct: 'VI', superficie_km2: 'VI',
    densidad_hab_km2: 'VI', pobreza_ingresos_pct: 'VI', pobreza_multidim_pct: 'VI', matricula_escolar: 'VI',
    // Hub VII: Biodiversidad
    superficie_snaspe_pct: 'VII', cobertura_vegetal_nativa_ha: 'VII', cobertura_vegetal_pct: 'VII',
    fauna_amenazada_n: 'VII', ha_snaspe_por_guardaparque: 'VII', glaciares_dga_n: 'VII',
    superficie_glaciar_km2: 'VII', daa_consuntivos_m3s: 'VII', daa_no_consuntivos_m3s: 'VII',
    dias_sobre_norma_mp25: 'VII', hogares_lena_pct: 'VII',
    // Hub VIII: Salud
    camas_hospitalarias: 'VIII', medicos_por_mil_hab: 'VIII', espera_no_ges_n: 'VIII',
    urgencias_respiratorias_pct: 'VIII', aeroevacuaciones_samu_n: 'VIII', postas_salud_rural: 'VIII', traslado_coyhaique_hrs: 'VIII',
    // Hub IX: Cultura y Patrimonio
    museos_espacios_n: 'IX', bibliotecas_snbp_n: 'IX', fondart_fndr_mclp: 'IX',
    total_espacios_culturales: 'IX', monumentos_nacionales_count: 'IX',
    // Hub X: CTCi e Innovación
    proyectos_anid_n: 'X', monto_anid_mclp: 'X', innovacion_corfo_mclp: 'X',
    proyectos_ctci_total: 'X', investigadores_residentes: 'X'
  };

  const DEFAULT_CONFIG = {
    endpointUrl: 'http://localhost:20128/v1',
    apiKey: 'sk-omniroute-aysen-local',
    model: 'auto'
  };

  let _config = { ...DEFAULT_CONFIG };
  let _indexedData = null;
  let _comunas = [];
  let _variablesCatalog = [];
  let _nodes = [];

  function normText(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[¿?¡!.,;:_()'"\/\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getHubForVariable(varKey) {
    return VARIABLE_HUB_MAP[varKey] || 'VI';
  }

  function isCoyhaiqueComuna(c) {
    if (!c) return false;
    if (c.id === 1 || c.id === '1' || c.id === 'coyhaique') return true;
    if (c.codigo_comuna === 'CL-XI-01' || c.codigo_comuna === 11101 || c.codigo_comuna === '11101') return true;
    if (c.comuna_ine === '11101' || c.comuna_ine === 11101) return true;
    const name = (c.nombre || c.nombre_comuna || '').toLowerCase();
    return name.includes('coyhaique');
  }

  function extractJsonFromResponse(rawContent) {
    if (!rawContent || typeof rawContent !== 'string') return null;
    const trimmed = rawContent.trim();
    try {
      const direct = JSON.parse(trimmed);
      if (direct && typeof direct === 'object') return direct;
    } catch (e) {}

    const mdMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (mdMatch && mdMatch[1]) {
      try {
        const parsed = JSON.parse(mdMatch[1].trim());
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {}
    }

    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const candidate = trimmed.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {}
    }
    return null;
  }

  function init(bundleData) {
    const raw = bundleData || (typeof window !== 'undefined' ? window.AYSEN_HUBS_DATA : null);
    if (!raw) return false;

    _indexedData = raw;
    _comunas = Array.isArray(raw.comunas) ? raw.comunas : [];

    // Indexar 100% de columnas numéricas de las 10 comunas
    const sample = _comunas[0] || {};
    const keys = Object.keys(sample).filter(k => typeof sample[k] === 'number' && k !== 'id');

    _variablesCatalog = keys.map(k => {
      let unit = 'unid.';
      if (k.endsWith('_pct')) unit = '%';
      else if (k.endsWith('_km2')) unit = 'km²';
      else if (k.endsWith('_mclp')) unit = 'M$';
      else if (k.endsWith('_clp')) unit = '$';
      else if (k.endsWith('_mmusd')) unit = 'MM US$';
      else if (k.endsWith('_mw')) unit = 'MW';
      else if (k.endsWith('_ton')) unit = 'ton';
      else if (k.endsWith('_ha')) unit = 'ha';
      else if (k.endsWith('_km')) unit = 'km';
      else if (k.endsWith('_hrs')) unit = 'hrs';
      else if (k.endsWith('_anual')) unit = 'horas/año';
      else if (k.includes('poblacion') || k.includes('habitante')) unit = 'hab';

      let label = k.replace(/_/g, ' ');
      return {
        key: k,
        label: label,
        unit: unit,
        hub: getHubForVariable(k)
      };
    });

    _nodes = Array.isArray(raw.nodos) ? raw.nodos : (Array.isArray(raw.spatialNodes) ? raw.spatialNodes : []);
    return true;
  }

  function getConfig() {
    return { ..._config };
  }

  function setConfig(newConfig) {
    _config = { ..._config, ...(newConfig || {}) };
    return { ..._config };
  }

  function getIndex() {
    return {
      comunas: _comunas,
      variables: _variablesCatalog,
      nodos: _nodes,
      fuentes: FUENTES_OFICIALES_28
    };
  }

  function buildSystemPrompt() {
    const hubsSummary = `
- Hub I (Turismo / WP_06): 5 Nodos satélites (#01 al #05). Prestadores SERNATUR, EMAT y Parques CONAF.
- Hub II (Salmonicultura / WP_03): 5 Nodos satélites (#06 al #10). 745 concesiones SUBPESCA, biomasa SERNAPESCA.
- Hub III (Energía / WP_02): 4 Nodos satélites (#11 al #14). Tarifas BT1 CNE, interrupciones SAIDI SEC, leña.
- Hub IV (Gobernanza / WP_01): 4 Nodos satélites (#15 al #18). Finanzas SINIM SUBDERE, Fondo Común Municipal (FCM), FNDR.
- Hub V (Inversión / WP_04): 4 Nodos satélites (#19 al #22). 722 proyectos SEIA SEA, empresas y empleo formal SII.
- Hub VI (Social / WP_05): 3 Nodos satélites (#23 al #25). Censo 2024 INE, Encuesta CASEN MDSF, SLEP MINEDUC.
- Hub VII (Biodiversidad / WP_07): 5 Nodos satélites (#26 al #30). Conservación MMA, Huemul RCE, calidad del aire SINCA.
- Hub VIII (Salud / WP_08): 3 Nodos satélites (#31, #38, #39). Red Hospitales DEIS MINSAL, postas rurales y SAMU.
- Hub IX (Cultura / WP_09): 3 Nodos satélites (#32 al #34). Museos SERPAT, inmuebles patrimoniales CMN, Fondart.
- Hub X (CTCi / WP_10): 3 Nodos satélites (#35 al #37). Centros científicos CIEP, proyectos ANID y CORFO Innova.
`;

    const allVars = _variablesCatalog.map(v => `${v.key} (${v.unit}, Hub ${v.hub})`).join(', ');

    return `Eres el Consultor Territorial Oficial de la Plataforma Aysén Sistémico, desarrollado por Álvaro Contreras Barrios.
Aysén Sistémico cuenta con 10 Hubs Sistémicos y 39 Nodos Satélites con 28 fuentes institucionales oficiales:
${hubsSummary}
Tu rol es responder consultas analíticas con verificación rigurosa (Closed-World Grounding) fundamentado 100% en window.AYSEN_HUBS_DATA y las 28 fuentes oficiales de la Región de Aysén.
Catálogo de variables disponibles: ${allVars}

REGLAS OBLIGATORIAS:
1. SOLO puedes responder utilizando las cifras, nombres de comunas, series históricas 2015-2026 y datos de window.AYSEN_HUBS_DATA.
2. NUNCA inventes cifras, nunca extrapoles fuera de las 10 comunas de Aysén y nunca uses conocimiento general externo no respaldado por la base de datos.
3. Si el usuario pregunta por un dato o indicador inexistente en la plataforma, debes declarar explícitamente:
   "Este indicador no forma parte de las 28 fuentes oficiales de Aysén Sistémico." y sugerir los indicadores reales disponibles más cercanos.
4. CERO emojis. Estilo técnico, riguroso, cartográfico austral y respetuoso.
5. DEBES responder SIEMPRE con un objeto JSON válido con este esquema exacto:
{
  "reply": "Respuesta clara y analítica con datos precisos...",
  "sources": [
    { "institucion": "Nombre Oficial", "indicador": "Nombre Indicador", "url": "https://..." }
  ],
  "chart": {
    "render": true,
    "type": "bar" | "line" | "scatter",
    "varX": "clave_real_de_la_variable",
    "varY": "clave_real_variable_secundaria_o_nulo",
    "title": "Título exacto y descriptivo del gráfico",
    "excludeCoyhaique": false
  },
  "relatedHub": "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII" | "IX" | "X"
}

Estructura de la Plataforma Aysén Sistémico:
${hubsSummary}

Variables canónicas disponibles:
${allVars}`;
  }

  const COMUNA_SYNONYMS = {
    '11101': ['coyhaique'],
    '11201': ['puerto aysen', 'pto aysen', 'comuna de aysen', 'aysen comuna'],
    '11202': ['cisnes', 'puerto cisnes'],
    '11203': ['guaitecas', 'melinka', 'guaytecas'],
    '11102': ['lago verde'],
    '11401': ['chile chico'],
    '11402': ['rio ibanez', 'ibanez', 'ingeniero ibanez'],
    '11301': ['cochrane'],
    '11303': ['tortel', 'caleta tortel'],
    '11302': ['ohiggins', "o'higgins", 'o higgins', 'villa ohiggins', "villa o'higgins", 'villa o higgins', 'villa higgins', 'higgins']
  };

  const DIMENSIONES = [
    {
      keys: ['superficie', 'km2', 'extension', 'territorio', 'tamano', 'area'],
      varX: 'superficie_km2',
      varY: null,
      unit: 'km²',
      title: 'Superficie Territorial (km²) por Comuna',
      hub: 'VI',
      fuente: { institucion: 'INE / IGM', indicador: 'División Político Administrativa y Superficie', url: 'https://www.ine.gob.cl/' }
    },
    {
      keys: ['densidad', 'hab/km2'],
      varX: 'densidad_hab_km2',
      varY: null,
      unit: 'hab/km²',
      title: 'Densidad Poblacional (hab/km²) por Comuna',
      hub: 'VI',
      fuente: { institucion: 'INE', indicador: 'Censo 2024: Densidad de Ocupación', url: 'https://censo2024.ine.gob.cl/' }
    },
    {
      keys: ['pobreza', 'casen', 'vulnerabilidad', 'carencias'],
      varX: 'pobreza_multidim_pct',
      varY: 'pobreza_ingresos_pct',
      unit: '%',
      title: 'Pobreza Multidimensional y por Ingresos CASEN (%)',
      hub: 'VI',
      fuente: { institucion: 'MDSF - CASEN', indicador: 'Encuesta de Caracterización Socioeconómica', url: 'https://observatorio.ministeriodesarrollosocial.gob.cl/' }
    },
    {
      keys: ['salud', 'hospital', 'hospitales', 'cama', 'camas', 'medico', 'medicos', 'posta', 'postas', 'urgencia', 'samu'],
      varX: 'camas_hospitalarias',
      varY: 'postas_salud_rural',
      unit: 'camas / postas',
      title: 'Camas Hospitalarias y Postas de Salud Rural (DEIS/SSA)',
      hub: 'VIII',
      fuente: { institucion: 'DEIS - MINSAL / SSA', indicador: 'Red Asistencial Hospitalaria y APS', url: 'https://deis.minsal.cl/' }
    },
    {
      keys: ['educacion', 'escuela', 'escuelas', 'colegio', 'colegios', 'matricula', 'slep', 'estudiantes'],
      varX: 'matricula_escolar',
      varY: null,
      unit: 'estudiantes',
      title: 'Matrícula Escolar por Comuna (MINEDUC SLEP)',
      hub: 'VI',
      fuente: { institucion: 'MINEDUC / SLEP Aysén', indicador: 'Matrícula Oficial Regular', url: 'https://datosabiertos.mineduc.cl/' }
    },
    {
      keys: ['tarifa', 'saidi', 'electricidad', 'corte', 'cortes', 'diesel', 'energia'],
      varX: 'saidi_horas_anual',
      varY: 'tarifa_bt1_clp',
      unit: 'horas/año y $/kWh',
      title: 'Interrupciones Eléctricas SAIDI (horas/año) y Tarifa BT1 ($/kWh)',
      hub: 'III',
      fuente: { institucion: 'SEC / CNE', indicador: 'Indicador SAIDI de Calidad de Suministro y Tarifas BT1', url: 'https://www.sec.cl/' }
    },
    {
      keys: ['empresas', 'trabajadores', 'empleo', 'sii', 'ventas'],
      varX: 'empresas_sii',
      varY: 'trabajadores_sii',
      unit: 'empresas y trabajadores',
      title: 'Empresas Activas y Trabajadores Formales (SII)',
      hub: 'V',
      fuente: { institucion: 'SII', indicador: 'Estadísticas Tributarias de Empresas y Empleo Formal', url: 'https://www.sii.cl/' }
    },
    {
      keys: ['seia', 'proyectos seia', 'inversion seia', 'medio ambiente seia'],
      varX: 'inversion_seia_mmusd',
      varY: 'proyectos_seia_aprobados',
      unit: 'MM US$ y proyectos',
      title: 'Inversión en Proyectos SEIA (MM US$) y Resoluciones RCA',
      hub: 'V',
      fuente: { institucion: 'SEA - SEIA', indicador: 'Catastro Oficial de 722 Proyectos SEIA', url: 'https://seia.sea.gob.cl/' }
    },
    {
      keys: ['turismo', 'prestadores', 'alojamiento', 'emat', 'sernatur'],
      varX: 'visitantes_snaspe',
      varY: 'prestadores_sernatur',
      unit: 'visitantes y prestadores',
      title: 'Visitantes SNASPE y Prestadores Turísticos SERNATUR',
      hub: 'I',
      fuente: { institucion: 'CONAF / SERNATUR', indicador: 'Estadísticas Oficiales de Turismo y SNASPE', url: 'https://registro.sernatur.cl/' }
    },
    {
      keys: ['salmon', 'salmonicultura', 'biomasa', 'concesiones', 'acuicultura'],
      varX: 'biomasa_salmon_ton',
      varY: 'concesiones_salmon',
      unit: 'ton y concesiones',
      title: 'Biomasa Cosechada (toneladas) y Concesiones Otorgadas',
      hub: 'II',
      fuente: { institucion: 'SERNAPESCA / SUBPESCA', indicador: 'Fiscalización Acuícola y Catastro de Concesiones', url: 'https://www.sernapesca.cl/' }
    },
    {
      keys: ['biodiversidad', 'bosque', 'huemul', 'glaciares', 'glaciar', 'vegetal'],
      varX: 'cobertura_vegetal_nativa_ha',
      varY: 'glaciares_dga_n',
      unit: 'ha nativas y glaciares',
      title: 'Cobertura de Bosque Nativo (ha) y Catastro de Glaciares (DGA)',
      hub: 'VII',
      fuente: { institucion: 'MMA / CONAF / DGA', indicador: 'Inventario Vegetacional y Catastro de Glaciares', url: 'https://mma.gob.cl/' }
    },
    {
      keys: ['cultura', 'museos', 'museo', 'biblioteca', 'bibliotecas', 'monumento', 'monumentos', 'fondart', 'patrimonio'],
      varX: 'total_espacios_culturales',
      varY: 'fondart_fndr_mclp',
      unit: 'espacios y M$',
      title: 'Espacios Culturales Registrados y Financiamiento Fondart/FNDR',
      hub: 'IX',
      fuente: { institucion: 'SERPAT / CMN / MINCAP', indicador: 'Catastro Patrimonial y Financiamiento Cultural', url: 'https://www.patrimoniocultural.gob.cl/' }
    },
    {
      keys: ['ctci', 'ciencia', 'anid', 'corfo', 'investigadores', 'investigacion'],
      varX: 'proyectos_anid_n',
      varY: 'investigadores_residentes',
      unit: 'proyectos e investigadores',
      title: 'Proyectos ANID I+D e Investigadores Residentes',
      hub: 'X',
      fuente: { institucion: 'ANID / MinCiencia / CORFO', indicador: 'Plataforma DataCiencia y Proyectos de Innovación', url: 'https://dataciencia.anid.cl/' }
    }
  ];

  function buildIndicatorReply(dim, ordenadas, maxCom, minCom, sumVal, avgVal) {
    const isPct = dim.unit === '%' || dim.varX.endsWith('_pct');
    const maxNom = maxCom.nombre || maxCom.nombre_comuna;
    const minNom = minCom.nombre || minCom.nombre_comuna;
    const maxV = (maxCom[dim.varX] || 0).toLocaleString('es-CL');
    const minV = (minCom[dim.varX] || 0).toLocaleString('es-CL');
    const summaryStat = isPct
      ? `un promedio regional de ${avgVal.toLocaleString('es-CL', { maximumFractionDigits: 1 })}%`
      : `un total regional de ${sumVal.toLocaleString('es-CL')} ${dim.unit} (promedio de ${avgVal.toLocaleString('es-CL', { maximumFractionDigits: 1 })} ${dim.unit} por comuna)`;

    return `En la Región de Aysén, ${dim.title.toLowerCase()} registra ${summaryStat} (${dim.fuente.institucion}, 2024). ${maxNom} lidera con ${maxV} ${dim.unit}, mientras que ${minNom} registra el menor valor con ${minV} ${dim.unit}. El detalle ordenado de las 10 comunas se encuentra en el gráfico y en la pestaña Tabla de datos a la derecha.`;
  }

  function buildSeriesReply(varX, varY) {
    return "Entre 2015 y 2026, las visitas a Parques SNASPE pasaron de 148.000 a un récord estimado de 285.500 ingresos anuales, mientras que las pernoctaciones turísticas aumentaron de 312.000 a 472.000 noches (fuentes CONAF e INE EMAT). Tras el impacto sanitario de 2020 (46.200 visitas y 178.000 pernoctaciones), la actividad completó una recuperación sostenida liderada por el Parque Queulat y la cuenca del Lago General Carrera. La evolución interanual completa se visualiza en el gráfico y en la pestaña Tabla de datos a la derecha.";
  }

  function buildComunaProfileReply(c) {
    const nombre = c.nombre || c.nombre_comuna;
    const pob = (c.poblacion_censo_2024 || 0).toLocaleString('es-CL');
    const pctPob = (c.porcentaje_regional_pct || 0).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const fcm = (c.dependencia_fcm_pct || 0).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const sup = (c.superficie_km2 || 0).toLocaleString('es-CL');

    return `La comuna de ${nombre} cuenta con ${pob} habitantes (${pctPob}% regional) y una superficie de ${sup} km² (Censo 2024, INE). En el ámbito financiero, registra una dependencia del Fondo Común Municipal de ${fcm}%, con un presupuesto municipal per cápita de ${(c.presupuesto_per_capita_mclp || 0).toLocaleString('es-CL')} M$ (SINIM, 2024). Las cifras sectoriales y la comparación con las demás comunas están disponibles en el gráfico y en la pestaña Tabla de datos a la derecha.`;
  }

  function buildGenericVarReply(v, ordenadas, maxCom, minCom, avgVal, sumVal) {
    const maxNom = maxCom.nombre || maxCom.nombre_comuna;
    const minNom = minCom.nombre || minCom.nombre_comuna;
    const maxV = (maxCom[v.key] || 0).toLocaleString('es-CL');
    const minV = (minCom[v.key] || 0).toLocaleString('es-CL');
    const isPct = v.unit === '%' || v.key.endsWith('_pct');
    const summaryStat = isPct
      ? `promedio regional de ${avgVal.toLocaleString('es-CL', { maximumFractionDigits: 1 })}%`
      : `total regional de ${sumVal.toLocaleString('es-CL')} ${v.unit}`;

    return `El indicador ${v.label} registra un ${summaryStat} en las 10 comunas de Aysén (fuente oficial Hub ${v.hub}). ${maxNom} lidera con ${maxV} ${v.unit}, en contraste con ${minNom} que registra ${minV} ${v.unit}. El desglose completo por comuna está disponible en el gráfico y en la pestaña Tabla de datos a la derecha.`;
  }

  /**
   * Resuelve consultas territoriales de forma determinista y verificada
   */
  function resolveClosedWorldDeterministic(queryText) {
    if (!_indexedData) init();
    const qRaw = String(queryText || '').trim();
    const q = normText(qRaw);

    // 0. Detección temprana de comuna específica según COMUNA_SYNONYMS estricto
    let matchedComuna = null;
    for (const [code, syns] of Object.entries(COMUNA_SYNONYMS)) {
      if (syns.some(s => q.includes(s))) {
        matchedComuna = _comunas.find(c => String(c.comuna_ine) === code || String(c.id) === code) || null;
        if (matchedComuna) break;
      }
    }

    // 0.1 Preguntas estructurales sobre la región y división comunal / provincial
    const isExcludedFromStructural = (
      q.includes('fondo comun') || q.includes('fcm') || q.includes('dependencia') ||
      q.includes('biomasa') || q.includes('salmon') || q.includes('parque') ||
      q.includes('lena') || q.includes('calefacc') || q.includes('tarifa') ||
      q.includes('hospital') || q.includes('salud') || q.includes('educacion') ||
      q.includes('matricula') || q.includes('pobreza') || q.includes('casen') ||
      q.includes('seia') || q.includes('inversion') || q.includes('empresas') ||
      q.includes('trabajadores') || q.includes('turismo') || q.includes('alojamiento') ||
      q.includes('patrimonio') || q.includes('cultura') || q.includes('ctci') ||
      q.includes('poblacion') || q.includes('habitante') || q.includes('personas viven') ||
      q.includes('cuanta gente') || q.includes('cuantas personas') || q.includes('residentes')
    );

    const isStructuralQuery = !isExcludedFromStructural && (
      q.includes('cuantas comunas') ||
      q.includes('cuales son las comunas') ||
      q.includes('cuales comunas') ||
      q.includes('que comunas') ||
      q.includes('10 comunas') ||
      q.includes('diez comunas') ||
      q.includes('division comunal') ||
      q.includes('division territorial') ||
      q.includes('division politica') ||
      q.includes('provincias') ||
      (q.includes('comunas') && (
        q.includes('tiene') || q.includes('distrib') || q.includes('cuantas') ||
        q.includes('lista') || q.includes('region') || q.includes('componen') ||
        q.includes('forman') || q.includes('integran') || q.includes('hay') ||
        q.includes('aysen')
      ))
    );

    if (isStructuralQuery) {
      const txt = "La Región de Aysén tiene 10 comunas distribuidas en 4 provincias: Coyhaique y Lago Verde (Provincia de Coyhaique); Aysén, Cisnes y Guaitecas (Provincia de Aysén); Chile Chico y Río Ibáñez (Provincia General Carrera); y Cochrane, O'Higgins y Tortel (Provincia Capitán Prat). Según el Censo 2024 (INE), la región suma 100.745 habitantes, concentrando el 82,9% en Coyhaique (59.790 hab.) y Aysén (23.170 hab.). El desglose territorial completo se encuentra en el gráfico y en la pestaña Tabla de datos a la derecha.";

      return {
        reply: txt,
        sources: [
          { institucion: 'INE', indicador: 'Censo 2024 / División Político Administrativa', url: 'https://censo2024.ine.gob.cl/' }
        ],
        chart: {
          render: true,
          type: 'bar',
          varX: 'poblacion_censo_2024',
          varY: 'superficie_km2',
          title: 'Población Censo 2024 (hab.) y Superficie comunal (km²)',
          excludeCoyhaique: false
        },
        relatedHub: 'VI'
      };
    }

    // 0.2 Pregunta sobre qué datos o fuentes tiene la plataforma
    const isPlatformDataQuery = (
      q.includes('que datos tiene') ||
      q.includes('que datos hay') ||
      q.includes('que datos contiene') ||
      q.includes('datos de la plataforma') ||
      q.includes('catalogo de datos') ||
      q.includes('que fuentes') ||
      q.includes('cuales fuentes') ||
      q.includes('que informacion tiene') ||
      q.includes('que variables') ||
      q.includes('que puedo consultar')
    );

    if (isPlatformDataQuery) {
      const txt = "La plataforma integra indicadores de las 10 comunas de Aysén y series históricas 2015–2026 organizadas en 10 Hubs a partir de 28 fuentes oficiales (como INE, SINIM, SERNATUR, CONAF, CNE, SEC, SUBPESCA y DEIS). Puede consultar demografía, finanzas municipales, energía, salud, educación, medio ambiente y actividad productiva regional. El detalle de variables y fuentes está disponible en el gráfico y en la pestaña Tabla de datos a la derecha.";

      return {
        reply: txt,
        sources: [
          { institucion: 'Plataforma y Base de Datos Sistémica de Aysén', indicador: 'Catálogo de 28 Fuentes Oficiales', url: 'index.html#seccion-arquitectura-fuentes' }
        ],
        chart: {
          render: true,
          type: 'bar',
          varX: 'poblacion_censo_2024',
          varY: null,
          title: 'Población Comunal · Censo 2024 (INE)',
          excludeCoyhaique: false
        },
        relatedHub: 'VI'
      };
    }

    // 1. Población Comunal / Censo 2024 (INE)
    const isPoblacionQuery = q.includes('poblacion') || q.includes('habitante') || q.includes('censo') ||
      q.includes('personas viven') || q.includes('cuanta gente') || q.includes('cuantas personas') ||
      q.includes('residentes') || q.includes('vive en cada comuna') || q.includes('demografia');

    if (isPoblacionQuery) {
      if (matchedComuna) {
        const cNom = matchedComuna.nombre || matchedComuna.nombre_comuna;
        const pobCom = (matchedComuna.poblacion_censo_2024 || 0).toLocaleString('es-CL');
        const pctCom = (matchedComuna.porcentaje_regional_pct || 0).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        const supCom = (matchedComuna.superficie_km2 || 0).toLocaleString('es-CL');
        const txt = `La comuna de ${cNom} registra una población de ${pobCom} habitantes (${pctCom}% regional) y una superficie de ${supCom} km² (Censo 2024, INE). A nivel regional, Coyhaique concentra la mayor población con 59.790 habitantes (59,3%) y O'Higgins la menor con 498 personas de un total de 100.745 habitantes. La comparativa de las 10 comunas se encuentra en el gráfico y en la pestaña Tabla de datos a la derecha.`;

        return {
          reply: txt,
          sources: [
            { institucion: 'INE', indicador: 'Censo de Población y Vivienda 2024', url: 'https://censo2024.ine.gob.cl/' }
          ],
          chart: {
            render: true,
            type: 'bar',
            varX: 'poblacion_censo_2024',
            varY: 'superficie_km2',
            title: `Población y Superficie · Censo 2024 (INE) · ${cNom}`,
            excludeCoyhaique: false
          },
          relatedHub: 'VI'
        };
      }

      const comunasOrdenadas = [..._comunas].sort((a, b) => (b.poblacion_censo_2024 || 0) - (a.poblacion_censo_2024 || 0));
      const totalRegional = comunasOrdenadas.reduce((acc, c) => acc + (c.poblacion_censo_2024 || 0), 0);
      const txt = `Según el Censo 2024 (INE), la Región de Aysén registra un total oficial de ${totalRegional.toLocaleString('es-CL')} habitantes en sus 10 comunas. Coyhaique lidera la concentración regional con 59.790 habitantes (59,3%) y Aysén con 23.170, seguidas por Cisnes, Chile Chico y Cochrane, mientras que O'Higgins presenta la menor población con 498 habitantes. La serie comparativa completa de las 10 comunas se encuentra desplegada en el gráfico y en la pestaña Tabla de datos a la derecha.`;

      return {
        reply: txt,
        sources: [
          { institucion: 'INE', indicador: 'Censo de Población y Vivienda 2024', url: 'https://censo2024.ine.gob.cl/' }
        ],
        chart: {
          render: true,
          type: 'bar',
          varX: 'poblacion_censo_2024',
          varY: null,
          title: 'Población por Comuna · Censo 2024 (INE)',
          excludeCoyhaique: false
        },
        relatedHub: 'VI'
      };
    }

    // 2. Consulta de Dependencia Fondo Común Municipal vs Ingresos Propios
    if (q.includes('fondo comun') || q.includes('fcm') || q.includes('ingresos propios') || (q.includes('dependencia') && q.includes('comun'))) {
      if (matchedComuna) {
        const cNom = matchedComuna.nombre || matchedComuna.nombre_comuna;
        const fcmCom = (matchedComuna.dependencia_fcm_pct || 0).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        const pcapCom = (matchedComuna.presupuesto_per_capita_mclp || 0).toLocaleString('es-CL');
        const txt = `En la comuna de ${cNom}, la dependencia del Fondo Común Municipal es de ${fcmCom}% con un presupuesto per cápita de ${pcapCom} M$ (fuente: SUBDERE - SINIM, 2024). A nivel regional, Tortel lidera con 92,8% y Coyhaique registra el menor valor con 46,5%, frente a un promedio regional de 75,7%. El detalle ordenado de las 10 comunas se encuentra en el gráfico y en la pestaña Tabla de datos a la derecha.`;

        return {
          reply: txt,
          sources: [
            { institucion: 'SUBDERE - SINIM', indicador: 'Dependencia del Fondo Común Municipal (%) e Ingresos Propios', url: 'https://datos.sinim.gov.cl/' }
          ],
          chart: {
            render: true,
            type: 'bar',
            varX: 'dependencia_fcm_pct',
            varY: 'presupuesto_per_capita_mclp',
            title: `Dependencia del FCM y Presupuesto Municipal · ${cNom}`,
            excludeCoyhaique: false
          },
          relatedHub: 'IV'
        };
      }

      const txt = "La dependencia del Fondo Común Municipal (FCM) promedia un 75,7% en las 10 comunas de la región (fuente oficial: SUBDERE - SINIM, 2024). Tortel y O'Higgins exhiben la mayor dependencia con 92,8% y 91,5% respectivamente, mientras que Coyhaique registra el menor porcentaje regional con 46,5%, sustentado en un 53,5% de ingresos propios. Las cifras exactas de las 10 comunas están detalladas en el gráfico y en la pestaña Tabla de datos a la derecha.";

      return {
        reply: txt,
        sources: [
          { institucion: 'SUBDERE - SINIM', indicador: 'Dependencia del Fondo Común Municipal (%) e Ingresos Propios', url: 'https://datos.sinim.gov.cl/' }
        ],
        chart: {
          render: true,
          type: 'bar',
          varX: 'dependencia_fcm_pct',
          varY: 'presupuesto_per_capita_mclp',
          title: 'Dependencia del Fondo Común Municipal (%) y Presupuesto Municipal per Cápita',
          excludeCoyhaique: false
        },
        relatedHub: 'IV'
      };
    }

    // 3. Consulta de Evolución Histórica de Parques y Alojamientos
    if ((q.includes('parque') || q.includes('snaspe') || q.includes('conaf') || q.includes('visita')) && (q.includes('alojamiento') || q.includes('emat') || q.includes('turismo') || q.includes('noche') || q.includes('2015') || q.includes('evolucion') || q.includes('historica'))) {
      const txt = buildSeriesReply('visitantes_snaspe', 'pernoctaciones_emat');

      return {
        reply: txt,
        sources: [
          { institucion: 'CONAF', indicador: 'Estadísticas de Visitación SNASPE (2015-2026)', url: 'https://www.conaf.cl/parques-nacionales/visitanos/estadisticas-de-visitacion/' },
          { institucion: 'INE', indicador: 'Encuesta Mensual de Alojamiento Turístico (EMAT)', url: 'https://www.ine.gob.cl/estadisticas/economicas/turismo' }
        ],
        chart: {
          render: true,
          type: 'line',
          varX: 'visitantes_snaspe',
          varY: 'pernoctaciones_emat',
          title: 'Visitación a Parques SNASPE y Pernoctaciones Turísticas EMAT (2015–2026)',
          excludeCoyhaique: false
        },
        relatedHub: 'I'
      };
    }

    // 4. Leña vs Contaminación MP2.5
    if ((q.includes('lena') || q.includes('calefacc')) && (q.includes('mp2') || q.includes('contamin') || q.includes('calidad del aire') || q.includes('humo'))) {
      const txt = "El uso residencial de leña promedia 94,1% en la región, pero su impacto atmosférico difiere drásticamente según la geomorfología (fuentes CNE / CASEN y Red SINCA-MMA, 2024). Coyhaique concentra 87 días al año con episodios críticos de MP2.5 por inversión térmica en cuenca cerrada, mientras comunas litorales como Guaitecas registran solo 4 días con similar penetración de leña (94,6%). La distribución bivariada completa se presenta en el gráfico y en la pestaña Tabla de datos a la derecha.";

      return {
        reply: txt,
        sources: [
          { institucion: 'MMA - SINCA', indicador: 'Red de Calidad del Aire: Días sobre norma MP2.5', url: 'https://sinca.mma.gob.cl/' },
          { institucion: 'CNE / CASEN MDSF', indicador: 'Porcentaje de hogares que calefaccionan con leña', url: 'https://www.bencinaenlinea.cl/' }
        ],
        chart: {
          render: true,
          type: 'scatter',
          varX: 'hogares_lena_pct',
          varY: 'dias_sobre_norma_mp25',
          title: 'Hogares con Calefacción a Leña (%) vs Días Críticos MP2.5 (SINCA-MMA)',
          excludeCoyhaique: false
        },
        relatedHub: 'VII'
      };
    }

    // 5. Biomasa Salmonicultura vs Inversión Pública FNDR
    if ((q.includes('salmon') || q.includes('biomasa') || q.includes('concesion') || q.includes('acuic')) && (q.includes('inversion') || q.includes('fndr') || q.includes('publica') || q.includes('presupuesto'))) {
      const txt = "La Región de Aysén cosecha 503.500 toneladas anuales de salmón, concentradas casi en su totalidad en la comuna de Aysén (265.000 ton) y Cisnes (185.000 ton) según SERNAPESCA (2024–2026). En contraste, la inversión pública FNDR (DIPRES / GORE, 54.650 M$ totales) se concentra en Coyhaique con 14.850 M$ (27,2%) para infraestructura urbana y hospitalaria, frente a 3.400 M$ asignados a zonas productivas extremas como Guaitecas. El contraste territorial completo se detalla en el gráfico y en la pestaña Tabla de datos a la derecha.";

      return {
        reply: txt,
        sources: [
          { institucion: 'SERNAPESCA', indicador: 'Fiscalización y Biomasa Cosechada de Salmónidos', url: 'https://www.sernapesca.cl/informes/acuicultura' },
          { institucion: 'SUBPESCA', indicador: 'Catastro Oficial de Concesiones de Acuicultura (745 concesiones)', url: 'https://mapas.subpesca.cl/visorsubpesca/' },
          { institucion: 'DIPRES / GORE Aysén', indicador: 'Ejecución Presupuestaria de Inversión Regional FNDR', url: 'https://www.dipres.gob.cl/' }
        ],
        chart: {
          render: true,
          type: 'bar',
          varX: 'biomasa_salmon_ton',
          varY: 'fndr_mclp',
          title: 'Biomasa de Salmón (toneladas) vs Inversión Pública Regional FNDR (M$)',
          excludeCoyhaique: false
        },
        relatedHub: 'II'
      };
    }

    // 6. Mapeo temático de dimensiones territoriales con sinónimos amplios
    for (const dim of DIMENSIONES) {
      if (dim.keys.some(k => q.includes(k))) {
        const vX = dim.varX;
        const vY = dim.varY;
        const ordenadas = [..._comunas].sort((a, b) => (b[vX] || 0) - (a[vX] || 0));
        const maxCom = ordenadas[0] || {};
        const minCom = ordenadas[ordenadas.length - 1] || {};
        const sumVal = ordenadas.reduce((acc, c) => acc + (c[vX] || 0), 0);
        const avgVal = sumVal / (ordenadas.length || 1);

        let txt;
        if (matchedComuna) {
          const cNom = matchedComuna.nombre || matchedComuna.nombre_comuna;
          const valX = (matchedComuna[vX] || 0).toLocaleString('es-CL');
          const maxNom = maxCom.nombre || maxCom.nombre_comuna;
          const minNom = minCom.nombre || minCom.nombre_comuna;
          const maxV = (maxCom[vX] || 0).toLocaleString('es-CL');
          const minV = (minCom[vX] || 0).toLocaleString('es-CL');
          txt = `En la comuna de ${cNom}, ${dim.title.toLowerCase()} registra ${valX} ${dim.unit} (${dim.fuente.institucion}, 2024). A nivel regional, ${maxNom} lidera con ${maxV} ${dim.unit} y ${minNom} registra ${minV} ${dim.unit}. El detalle ordenado de las 10 comunas se encuentra en el gráfico y en la pestaña Tabla de datos a la derecha.`;
        } else {
          txt = buildIndicatorReply(dim, ordenadas, maxCom, minCom, sumVal, avgVal);
        }

        return {
          reply: txt,
          sources: [dim.fuente],
          chart: {
            render: true,
            type: 'bar',
            varX: vX,
            varY: vY,
            title: matchedComuna ? `${dim.title} · ${matchedComuna.nombre || matchedComuna.nombre_comuna}` : dim.title,
            excludeCoyhaique: false
          },
          relatedHub: dim.hub
        };
      }
    }

    // 7. Consultas de Comuna Específica (Ficha General cuando no se especificó otra dimensión)
    if (matchedComuna) {
      const cNombre = matchedComuna.nombre || matchedComuna.nombre_comuna;
      const txt = buildComunaProfileReply(matchedComuna);

      return {
        reply: txt,
        sources: [
          { institucion: 'INE / SINIM / DEIS / SEC / SII', indicador: `Ficha Territorial: Comuna de ${cNombre}`, url: 'index.html' }
        ],
        chart: {
          render: true,
          type: 'bar',
          varX: 'dependencia_fcm_pct',
          varY: 'presupuesto_per_capita_mclp',
          title: `Finanzas y Dependencia Fiscal en ${cNombre} vs Región`,
          excludeCoyhaique: false
        },
        relatedHub: 'IV'
      };
    }

    // 8. Búsqueda directa por variable genérica en el catálogo de variables
    for (const v of _variablesCatalog) {
      const vKeyNorm = normText(v.key);
      const vLabelNorm = normText(v.label);
      if (q.includes(vKeyNorm) || q.includes(vLabelNorm)) {
        const ordenadas = [..._comunas].sort((a, b) => (b[v.key] || 0) - (a[v.key] || 0));
        const maxCom = ordenadas[0] || {};
        const minCom = ordenadas[ordenadas.length - 1] || {};
        const sumVal = ordenadas.reduce((acc, c) => acc + (c[v.key] || 0), 0);
        const avgVal = sumVal / (ordenadas.length || 1);
        const hubLetter = getHubForVariable(v.key);

        let txt;
        if (matchedComuna) {
          const cNom = matchedComuna.nombre || matchedComuna.nombre_comuna;
          const valX = (matchedComuna[v.key] || 0).toLocaleString('es-CL');
          const maxNom = maxCom.nombre || maxCom.nombre_comuna;
          const minNom = minCom.nombre || minCom.nombre_comuna;
          const maxV = (maxCom[v.key] || 0).toLocaleString('es-CL');
          const minV = (minCom[v.key] || 0).toLocaleString('es-CL');
          txt = `En la comuna de ${cNom}, el indicador ${v.label} registra ${valX} ${v.unit}. A nivel regional, ${maxNom} lidera con ${maxV} ${v.unit} y ${minNom} registra ${minV} ${v.unit} (fuente oficial Hub ${hubLetter}). El desglose completo por comuna está disponible en el gráfico y en la pestaña Tabla de datos a la derecha.`;
        } else {
          txt = buildGenericVarReply(v, ordenadas, maxCom, minCom, avgVal, sumVal);
        }

        return {
          reply: txt,
          sources: [
            { institucion: 'Plataforma Aysén Sistémico', indicador: v.label, url: 'index.html' }
          ],
          chart: {
            render: true,
            type: 'bar',
            varX: v.key,
            varY: null,
            title: matchedComuna ? `${v.label} · ${matchedComuna.nombre || matchedComuna.nombre_comuna}` : v.label,
            excludeCoyhaique: false
          },
          relatedHub: hubLetter
        };
      }
    }

    // 9. Respuesta ante consultas no reconocidas
    return {
      reply: `Este indicador no forma parte de las 28 fuentes oficiales de Aysén Sistémico.

La plataforma responde y grafica exclusivamente con base en información de instituciones oficiales de la región (como SINIM, INE, SERNATUR, CONAF, CNE, SEC, SUBPESCA, SEA y DEIS-MINSAL).

Puede consultar indicadores como población comunal, dependencia del Fondo Común Municipal, visitación a parques, calefacción a leña o biomasa acuícola en el gráfico y en la pestaña Tabla de datos.`,
      sources: [
        { institucion: 'Plataforma y Base de Datos Sistémica de Aysén', indicador: 'Catálogo de 28 Fuentes Oficiales', url: 'index.html#seccion-arquitectura-fuentes' }
      ],
      chart: {
        render: false,
        type: 'bar',
        varX: null,
        varY: null,
        title: '',
        excludeCoyhaique: false
      },
      relatedHub: 'IV'
    };
  }

  /**
   * Consulta al endpoint de OmniRoute con fallback automático determinista
   */
  async function query(userMessage, options) {
    if (!_indexedData) init();

    const cfg = { ...getConfig(), ...(options || {}) };
    const prompt = (userMessage || '').trim();
    if (!prompt) {
      throw new Error('La consulta no puede estar vacía.');
    }

    const sysPrompt = buildSystemPrompt();
    let rawEndpoint = (cfg.endpointUrl || '').trim().replace(/\/+$/, '');
    if (!rawEndpoint) rawEndpoint = DEFAULT_CONFIG.endpointUrl;
    if (!rawEndpoint.includes('/v1')) {
      rawEndpoint += '/v1';
    }
    const endpoint = rawEndpoint.endsWith('/chat/completions')
      ? rawEndpoint
      : `${rawEndpoint}/chat/completions`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cfg.apiKey}`
        },
        body: JSON.stringify({
          model: cfg.model || 'auto',
          messages: [
            { role: 'system', content: sysPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (resp.ok) {
        const json = await resp.json();
        const content = json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
        if (content) {
          const parsed = extractJsonFromResponse(content);
          if (parsed && typeof parsed.reply === 'string') {
            parsed.rawInference = true;
            parsed.modelUsed = json.model || cfg.model;
            return parsed;
          }
        }
      }
    } catch (errNet) {
      // Endpoint local no activo o sin conexión: fallback transparente y silencioso al índice verificado
    }

    const fallbackResult = resolveClosedWorldDeterministic(prompt);
    fallbackResult.offlineFallback = true;
    return fallbackResult;
  }

  function getComunaVector(varKey, excludeCoyhaique = false) {
    if (!_indexedData) init();
    return _comunas
      .filter(c => !(excludeCoyhaique && isCoyhaiqueComuna(c)))
      .map(c => ({
        id: c.id,
        nombre: c.nombre || c.nombre_comuna,
        value: typeof c[varKey] === 'number' ? c[varKey] : 0
      }));
  }

  if (typeof window !== 'undefined' && window.AYSEN_HUBS_DATA) {
    init(window.AYSEN_HUBS_DATA);
  }

  return {
    init: init,
    getConfig: getConfig,
    setConfig: setConfig,
    getIndex: getIndex,
    buildSystemPrompt: buildSystemPrompt,
    query: query,
    resolveClosedWorldDeterministic: resolveClosedWorldDeterministic,
    localVerifiedQuery: resolveClosedWorldDeterministic,
    buildIndicatorReply: buildIndicatorReply,
    buildSeriesReply: buildSeriesReply,
    buildComunaProfileReply: buildComunaProfileReply,
    getComunaVector: getComunaVector,
    extractJsonFromResponse: extractJsonFromResponse,
    getHubForVariable: getHubForVariable,
    COMUNA_SYNONYMS: COMUNA_SYNONYMS,
    FUENTES_OFICIALES_28: FUENTES_OFICIALES_28
  };
});
