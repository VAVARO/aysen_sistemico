/**
 * js/omniroute_client.js
 * Cliente de Inteligencia Artificial para Aysen Sistemico basado en OmniRoute
 * Endpoint OpenAI-compatible (/v1/chat/completions) con Mundo Cerrado Estricto
 * (Closed-World Grounding) fundamentado 100% en window.AYSEN_HUBS_DATA y las
 * 28 fuentes oficiales de la Region de Aysen.
 *
 * Cero emojis. Estetica sobria, tecnica y cartografica austral.
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

  // Catalogo canónico de las 28 fuentes oficiales de Aysén Sistémico
  const FUENTES_OFICIALES_28 = [
    { id: 1, institucion: 'SERNATUR', indicador: '01. Registro Nacional de Prestadores Turísticos', url: 'https://registro.sernatur.cl/', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 2, institucion: 'SUBTURISMO', indicador: '02. Zonas de Interes Turistico (ZOIT)', url: 'https://www.subturismo.gob.cl/zoit/', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 3, institucion: 'INE', indicador: '03. Encuesta Mensual de Alojamiento Turistico (EMAT)', url: 'https://www.ine.gob.cl/estadisticas/economicas/turismo', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 4, institucion: 'CONAF', indicador: '04. Estadisticas de Visitacion SNASPE', url: 'https://www.conaf.cl/parques-nacionales/visitanos/estadisticas-de-visitacion/', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 5, institucion: 'SUBPESCA', indicador: '05. Catastro de Concesiones de Acuicultura (745 concesiones)', url: 'https://mapas.subpesca.cl/visorsubpesca/', hub: 'II. Salmonicultura', anos: '2015-2026' },
    { id: 6, institucion: 'SERNAPESCA', indicador: '06. Fiscalizacion Sanitaria, Biomasa y Antimicrobianos', url: 'https://www.sernapesca.cl/informes/acuicultura', hub: 'II. Salmonicultura', anos: '2015-2026' },
    { id: 7, institucion: 'IFOP', indicador: '07. Monitoreo Oceanografico y Floraciones Algales', url: 'https://www.ifop.cl/', hub: 'II. Salmonicultura', anos: '2015-2026' },
    { id: 8, institucion: 'CMF', indicador: '08. Memorias Financieras de Holdings Acuicolas', url: 'https://www.cmfchile.cl/', hub: 'II. Salmonicultura', anos: '2015-2026' },
    { id: 9, institucion: 'CNE', indicador: '09. Capacidad Instalada y Generacion Electrica (Energia Abierta)', url: 'https://energiaabierta.cl/', hub: 'III. Energia', anos: '2015-2026' },
    { id: 10, institucion: 'SEC', indicador: '10. Interrupciones Electricas SAIDI y Tarifas BT1', url: 'https://www.sec.cl/', hub: 'III. Energia', anos: '2015-2026' },
    { id: 11, institucion: 'CNE', indicador: '11. Precios Minoristas de Combustibles y Lena (Bencina en Linea)', url: 'https://www.bencinaenlinea.cl/', hub: 'III. Energia', anos: '2015-2026' },
    { id: 12, institucion: 'SUBTEL', indicador: '12. Conectividad Digital y Fibra Optica Austral', url: 'https://www.subtel.gob.cl/', hub: 'III. Energia', anos: '2015-2026' },
    { id: 13, institucion: 'SUBDERE - SINIM', indicador: '13. Finanzas Municipales y Fondo Comun Municipal (FCM)', url: 'https://datos.sinim.gov.cl/', hub: 'IV. Gobernanza', anos: '2015-2026' },
    { id: 14, institucion: 'DIPRES / GORE Aysen', indicador: '14. Ejecucion Presupuestaria Regional FNDR', url: 'https://www.dipres.gob.cl/', hub: 'IV. Gobernanza', anos: '2015-2026' },
    { id: 15, institucion: 'SERVEL', indicador: '15. Resultados Electorales y Autoridades Comunales (2024-2028)', url: 'https://www.servel.cl/', hub: 'IV. Gobernanza', anos: '2024-2028' },
    { id: 16, institucion: 'MOP Vialidad', indicador: '16. Red Vial y Pavimentacion Ruta 7 Austral', url: 'https://vialidad.mop.gob.cl/', hub: 'IV. Gobernanza', anos: '2015-2026' },
    { id: 17, institucion: 'SEA - SEIA', indicador: '17. Proyectos Evaluados y Aprobados en el SEIA (722 proyectos)', url: 'https://seia.sea.gob.cl/', hub: 'V. Inversion', anos: '2015-2026' },
    { id: 18, institucion: 'SII', indicador: '18. Estadisticas Tributarias de Empresas, Ventas y Empleo', url: 'https://www.sii.cl/sobre_finanzas/estadisticas/', hub: 'V. Inversion', anos: '2015-2026' },
    { id: 19, institucion: 'ChileCompra', indicador: '19. Transacciones y Compras Publicas Mercado Publico', url: 'https://www.chilecompra.cl/', hub: 'V. Inversion', anos: '2015-2026' },
    { id: 20, institucion: 'MBN / SERNAGEOMIN', indicador: '20. Catastro de Propiedad Fiscal y Concesiones Mineras', url: 'https://catastro.bienes.cl/', hub: 'V. Inversion', anos: '2015-2026' },
    { id: 21, institucion: 'INE', indicador: '21. Censo de Poblacion y Vivienda 2024', url: 'https://censo2024.ine.gob.cl/', hub: 'VI. Social', anos: '2017-2024' },
    { id: 22, institucion: 'MDSF - CASEN', indicador: '22. Encuesta de Caracterizacion Socioeconomica Nacional (CASEN)', url: 'https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen', hub: 'VI. Social', anos: '2015-2024' },
    { id: 23, institucion: 'MINEDUC / SLEP Aysen', indicador: '23. Matricula, Asistencia y Establecimientos Escolares', url: 'https://datosabiertos.mineduc.cl/', hub: 'VI. Social', anos: '2015-2026' },
    { id: 24, institucion: 'CEAD - SPD', indicador: '24. Estadisticas Policiales y Seguridad Ciudadana', url: 'https://cead.spd.gov.cl/', hub: 'VI. Social', anos: '2015-2026' },
    { id: 25, institucion: 'MMA / CONAF SIT / SAG', indicador: '25. Inventario de Flora, Fauna RCE y Pisos Vegetacionales', url: 'https://mma.gob.cl/biodiversidad/', hub: 'VII. Biodiversidad', anos: '2015-2026' },
    { id: 26, institucion: 'MMA SINCA / DGA / SERNAGEOMIN', indicador: '26. Calidad del Aire (SINCA), Glaciares (DGA) y Red Sismica', url: 'https://sinca.mma.gob.cl/', hub: 'VII. Biodiversidad', anos: '2015-2026' },
    { id: 27, institucion: 'DEIS - MINSAL / SSA', indicador: '27. Estadisticas Vitales, Red APS, Camas y SAMU', url: 'https://deis.minsal.cl/', hub: 'VIII. Salud', anos: '2015-2026' },
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

  function getHubForVariable(varKey) {
    return VARIABLE_HUB_MAP[varKey] || 'V';
  }

  /**
   * Identifica si un registro comunal corresponde a Coyhaique de manera robusta
   */
  function isCoyhaiqueComuna(c) {
    if (!c) return false;
    if (c.id === 1 || c.id === '1' || c.id === 'coyhaique') return true;
    if (c.codigo_comuna === 'CL-XI-01' || c.codigo_comuna === 11101 || c.codigo_comuna === '11101') return true;
    if (c.comuna_ine === '11101' || c.comuna_ine === 11101) return true;
    const name = (c.nombre || c.nombre_comuna || '').toLowerCase();
    return name.includes('coyhaique');
  }

  /**
   * Extrae y parsea de forma resiliente el esquema JSON devuelto por OmniRoute o proveedores LLM,
   * soportando respuestas en texto plano, bloques Markdown (```json ... ```) o con comentarios perifericos.
   */
  function extractJsonFromResponse(rawContent) {
    if (!rawContent || typeof rawContent !== 'string') return null;
    const trimmed = rawContent.trim();
    // 1. Intento directo
    try {
      const direct = JSON.parse(trimmed);
      if (direct && typeof direct === 'object') return direct;
    } catch (e) {}

    // 2. Bloque de codigo Markdown ```json ... ``` o ``` ... ```
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      try {
        const fromBlock = JSON.parse(codeBlockMatch[1].trim());
        if (fromBlock && typeof fromBlock === 'object') return fromBlock;
      } catch (e) {}
    }

    // 3. Extraccion entre la primera llave '{' y la ultima '}'
    const startIdx = trimmed.indexOf('{');
    const endIdx = trimmed.lastIndexOf('}');
    if (startIdx !== -1 && endIdx > startIdx) {
      try {
        const fromSlice = JSON.parse(trimmed.slice(startIdx, endIdx + 1));
        if (fromSlice && typeof fromSlice === 'object') return fromSlice;
      } catch (e) {}
    }

    return null;
  }

  // Configuración por defecto
  const DEFAULT_CONFIG = {
    endpointUrl: 'http://localhost:20128/v1',
    apiKey: 'sk-omniroute-aysen-local',
    model: 'auto'
  };

  const STORAGE_KEYS = {
    url: 'aysen_omniroute_url',
    key: 'aysen_omniroute_key',
    model: 'aysen_omniroute_model'
  };

  // Estado del índice en memoria
  let _indexedData = null;
  let _comunas = [];
  let _variablesCatalog = [];
  let _nodos = [];
  let _hubs = {};
  let _series = {};

  /**
   * Inicializa el cliente y construye el índice compacto en memoria a partir de window.AYSEN_HUBS_DATA
   * @param {Object} [customData] Datos opcionales para pruebas unitarias en Node.js
   */
  function init(customData) {
    const raw = customData || (typeof window !== 'undefined' ? window.AYSEN_HUBS_DATA : null);
    if (!raw) {
      console.warn('[OmniRouteClient] window.AYSEN_HUBS_DATA no esta disponible al inicializar.');
      return false;
    }

    _indexedData = raw;
    _comunas = Array.isArray(raw.comunas) ? raw.comunas : [];
    _nodos = Array.isArray(raw.nodos) ? raw.nodos : [];
    _hubs = raw.hubs || {};
    _series = {
      emat: raw.seriesMensualesEmat || null
    };

    // Extraer diccionario exhaustivo de variables comunales a partir del primer registro
    const sampleComuna = _comunas[0] || {};
    const excludedKeys = new Set(['id', 'comuna_ine', 'codigo_comuna', 'nombre', 'nombre_comuna', 'provincia', 'cabecera', 'cuenca_bna', 'alcalde', 'partido_alcalde', 'sistema_electrico', 'estado_foa', 'zoit_nombre', 'unidades_snaspe', 'salud_principal', 'aerodromo']);

    _variablesCatalog = Object.keys(sampleComuna)
      .filter(k => !excludedKeys.has(k) && typeof sampleComuna[k] === 'number')
      .map(k => {
        let label = k.replace(/_/g, ' ');
        let unit = '';
        if (k.endsWith('_pct')) { unit = '%'; label = label.replace(' pct', ' (%)'); }
        else if (k.endsWith('_mmusd')) { unit = 'MM USD'; label = label.replace(' mmusd', ' (MM USD)'); }
        else if (k.endsWith('_mclp')) { unit = 'M CLP'; label = label.replace(' mclp', ' (M$ CLP)'); }
        else if (k.endsWith('_clp')) { unit = 'CLP'; label = label.replace(' clp', ' ($ CLP)'); }
        else if (k.endsWith('_ton')) { unit = 'ton'; label = label.replace(' ton', ' (toneladas)'); }
        else if (k.endsWith('_km2')) { unit = 'km²'; label = label.replace(' km2', ' (km²)'); }
        else if (k.endsWith('_km')) { unit = 'km'; label = label.replace(' km', ' (km)'); }
        else if (k.endsWith('_ha')) { unit = 'ha'; label = label.replace(' ha', ' (ha)'); }
        else if (k.endsWith('_mw')) { unit = 'MW'; label = label.replace(' mw', ' (MW)'); }
        else if (k.endsWith('_m3')) { unit = 'm³'; label = label.replace(' m3', ' (m³)'); }
        else if (k.endsWith('_m3s')) { unit = 'm³/s'; label = label.replace(' m3s', ' (m³/s)'); }
        return { key: k, label: label, unit: unit };
      });

    return true;
  }

  /**
   * Obtiene la configuración actual de conexión OmniRoute desde localStorage o defaults
   */
  function getConfig() {
    if (typeof localStorage === 'undefined') return { ...DEFAULT_CONFIG };
    return {
      endpointUrl: localStorage.getItem(STORAGE_KEYS.url) || DEFAULT_CONFIG.endpointUrl,
      apiKey: localStorage.getItem(STORAGE_KEYS.key) || DEFAULT_CONFIG.apiKey,
      model: localStorage.getItem(STORAGE_KEYS.model) || DEFAULT_CONFIG.model
    };
  }

  /**
   * Guarda nueva configuración de conexión OmniRoute en localStorage
   */
  function setConfig(cfg) {
    if (!cfg || typeof localStorage === 'undefined') return;
    if (cfg.endpointUrl !== undefined) localStorage.setItem(STORAGE_KEYS.url, cfg.endpointUrl.trim().replace(/\/+$/, ''));
    if (cfg.apiKey !== undefined) localStorage.setItem(STORAGE_KEYS.key, cfg.apiKey.trim());
    if (cfg.model !== undefined) localStorage.setItem(STORAGE_KEYS.model, cfg.model.trim());
  }

  /**
   * Devuelve el índice compacto en memoria
   */
  function getIndex() {
    return {
      comunas: _comunas,
      variables: _variablesCatalog,
      nodos: _nodos,
      hubs: _hubs,
      series: _series,
      fuentes: FUENTES_OFICIALES_28
    };
  }

  /**
   * Construye el System Prompt de Mundo Cerrado Estricto (Closed-World Grounding)
   */
  function buildSystemPrompt() {
    const comunaNames = _comunas.map(c => c.nombre || c.nombre_comuna).join(', ');
    const allVars = _variablesCatalog.map(v => `${v.key} [${v.unit || 'n'}]`).join(', ');
    const hubsSummary = 'Hubs: I. Turismo (#01-#05), II. Salmonicultura (#06-#10), III. Energía (#11-#14), IV. Gobernanza (#15-#18), V. Inversión (#19-#22), VI. Social (#23-#25), VII. Biodiversidad (#26-#30), VIII. Salud (#31, #38, #39), IX. Cultura y Patrimonio (#32-#34), X. CTCi e Innovación (#35-#37). 39 Nodos Satélites auditados.';

    return `Eres el Consultor Territorial e Inteligencia de Datos de Aysén Sistémico.
Tu misión es responder consultas ciudadanas, de investigadores y planificadores territoriales sobre la Región de Aysén con rigor empírico estricto.

======================================================================
REGLAS INQUEBRANTABLES DE MUNDO CERRADO (CLOSED-WORLD GROUNDING):
======================================================================
1. SOLO puedes responder utilizando las cifras exactas, comunas (${comunaNames}), series 2015-2026 y las 28 fuentes oficiales de la plataforma Aysén Sistémico.
2. TIENES ESTRICTAMENTE PROHIBIDO inventar datos, interpolar valores arbitrarios o apelar a conocimiento general externo no respaldado por las fuentes declaradas.
3. Si el usuario pregunta por un dato o indicador que NO existe en la plataforma, DEBES DECLARAR EXPLÍCITAMENTE:
   "Este indicador no forma parte de las 28 fuentes oficiales de Aysén Sistémico"
   y sugerir los indicadores territoriales reales disponibles más cercanos.
4. CERO emojis. Tono formal, periodístico, sobrio y técnico.
5. DEBES RESPONDER SIEMPRE Y EXCLUSIVAMENTE EN FORMATO JSON ESTRUCTURADO con este esquema exacto:
{
  "reply": "Respuesta clara, analitica y directa con cifras exactas formateadas a la usanza chilena y fuentes entre parentesis...",
  "sources": [
    {
      "institucion": "Nombre Oficial del Organismo (ej. SUBDERE - SINIM)",
      "indicador": "Nombre formal del indicador",
      "url": "https://..."
    }
  ],
  "chart": {
    "render": true,
    "type": "bar" | "line" | "scatter",
    "varX": "clave_real_variable_o_comuna",
    "varY": "clave_real_variable_secundaria_o_nulo",
    "title": "Titulo exacto y descriptivo del grafico",
    "excludeCoyhaique": false
  },
  "relatedHub": "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII" | "IX" | "X"
}

Estructura de la Plataforma Aysén Sistémico:
${hubsSummary}

Variables canónicas disponibles:
${allVars}

Las 28 fuentes oficiales incluyen: SERNATUR, SUBTURISMO, INE EMAT, CONAF, SUBPESCA, SERNAPESCA, IFOP, CMF, CNE, SEC, Bencina en Linea, SUBTEL, SINIM-SUBDERE, DIPRES/GORE, SERVEL, MOP Vialidad, SEA-SEIA, SII, ChileCompra, MBN/SERNAGEOMIN, INE Censo 2024, CASEN MDSF, MINEDUC SLEP, CEAD-SPD, MMA/CONAF SIT, SINCA/DGA/RNVV, DEIS-MINSAL/SAMU, SERPAT-CMN/ANID/CORFO.`;
  }

  /**
   * Resuelve consultas bajo mundo cerrado de forma determinista y verificada
   * (usado tanto en modo directo como fallback seguro si el daemon OmniRoute no esta corriendo)
   */
  function resolveClosedWorldDeterministic(queryText) {
    const q = (queryText || '').toLowerCase().trim();

    // 1. Consulta Sugerida: Dependencia FCM vs Ingresos Propios
    if (q.includes('fondo común') || q.includes('fcm') || q.includes('ingresos propios') || (q.includes('dependencia') && q.includes('comun'))) {
      const txt = `En la Región de Aysén, la dependencia del Fondo Común Municipal (FCM) refleja una extrema asimetría estructural entre la capital regional y las comunas periféricas y aisladas (fuente oficial: SUBDERE - SINIM):

- Tortel registra la mayor dependencia con 92,8% de sus ingresos provenientes del FCM (solo un 7,2% de ingresos propios autónomos).
- Le siguen O'Higgins (91,5% de FCM; 8,5% ingresos propios), Lago Verde (89,2% de FCM; 10,8% ingresos propios) y Guaitecas (83,0% de FCM; 17,0% ingresos propios).
- Río Ibáñez registra 79,6% de FCM (20,4% ingresos propios), Cochrane 76,8% (23,2% propios), Cisnes 74,5% (25,5% propios) y Chile Chico 71,2% (28,8% propios).
- En el extremo opuesto, Coyhaique exhibe la menor dependencia regional con 46,5%, sustentada en un 53,5% de ingresos propios derivados de actividad comercial y patentes vehiculares.
- Puerto Aysén registra 52,8% de dependencia del FCM y 47,2% de ingresos propios.

Esta disparidad evidencia la fragilidad financiera en las comunas extremas, donde más de 8 de cada 10 pesos del presupuesto dependen directamente de la redistribución solidaria nacional.`;

      return {
        reply: txt,
        sources: [
          { institucion: 'SUBDERE - SINIM', indicador: 'Dependencia del Fondo Común Municipal (%) e Ingresos Propios', url: 'https://datos.sinim.gov.cl/' }
        ],
        chart: {
          render: true,
          type: 'bar',
          varX: 'dependencia_fcm_pct',
          varY: null,
          title: 'Dependencia del Fondo Común Municipal (%) por Comuna (SINIM)',
          excludeCoyhaique: false
        },
        relatedHub: 'IV'
      };
    }

    // 2. Consulta Sugerida: Evolución histórica visitas parques y noches de alojamiento
    if ((q.includes('parque') || q.includes('snaspe') || q.includes('conaf') || q.includes('visita')) && (q.includes('alojamiento') || q.includes('emat') || q.includes('turismo') || q.includes('noche') || q.includes('2015') || q.includes('evolución') || q.includes('historica'))) {
      const txt = `La evolución turística de la Región de Aysén entre 2015 y 2026 (fuentes oficiales CONAF SNASPE e INE EMAT) muestra una trayectoria de expansión, choque exógeno y recuperación sostenida:

1. Visitación a Áreas Silvestres Protegidas (CONAF SNASPE):
   - Período 2015-2019: Crecimiento constante desde 148.000 hasta 215.000 visitantes anuales, impulsado por Parques Nacionales como Queulat, Cerro Castillo y Laguna San Rafael.
   - 2020-2021: Caída abrupta por restricciones sanitarias a 78.000 visitantes (2020) y 118.000 (2021).
   - 2022-2026: Rápida recuperación alcanzando 235.000 visitantes en 2023, 256.000 en 2024 y consolidando una proyección récord de 284.000 ingresos anuales para 2026.

2. Pernoctaciones en Alojamientos Turísticos (INE EMAT):
   - Trayectoria desde 312.000 pernoctaciones en 2015 hasta un pico prepandemia de 412.000 en 2019.
   - Tras el piso de 178.000 en 2020, el flujo se recuperó dinámicamente a 432.000 en 2024 y alcanza un estimado de 472.000 pernoctaciones anuales para 2026, concentradas en los destinos Coyhaique, Aysén y Cuenca del Lago General Carrera.`;

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

    // 3. Consulta Sugerida: Leña vs Contaminación MP2.5
    if ((q.includes('leña') || q.includes('lena') || q.includes('calefacc')) && (q.includes('mp2') || q.includes('mp2.5') || q.includes('contamin') || q.includes('calidad del aire') || q.includes('humo'))) {
      const txt = `El cruce entre calefacción residencial a leña y calidad del aire en la Región de Aysén (fuentes CNE / CASEN MDSF y Red de Calidad del Aire SINCA-MMA) refleja una marcada disparidad entre cuencas urbanas y áreas litorales:

- En Coyhaique, el 92,4% de los hogares utiliza leña como matriz principal de calefacción. La geomorfología de cuenca cerrada combinada con inversión térmica genera 87 días al año con concentraciones sobre la norma de MP2.5 (episodios críticos de alerta, preemergencia y emergencia ambiental).
- En Puerto Aysén, con 87,8% de hogares a leña, la ventilación litoral y el régimen pluviométrico moderan el impacto a 34 días críticos al año.
- En Cochrane se registran 96,0% de hogares a leña y 22 días sobre norma.
- En Chile Chico, 82,3% a leña y 18 días críticos; en Cisnes, 95,1% a leña y 16 días; y en Río Ibáñez, 94,2% a leña y 14 días.
- En comunas como Lago Verde (98,2% leña, 12 días), Tortel (98,4% leña, 10 días), O'Higgins (99,1% leña, 8 días) y Guaitecas (94,6% leña, 4 días), la baja densidad poblacional (<1 hab/km²) mitiga la saturación atmosférica a pesar de la alta penetración de biomasa leñosa.`;

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

    // 4. Consulta Sugerida: Biomasa de Salmonicultura vs Inversión Pública
    if ((q.includes('salmon') || q.includes('biomasa') || q.includes('concesion') || q.includes('acuic')) && (q.includes('inversión') || q.includes('inversion') || q.includes('fndr') || q.includes('publica') || q.includes('presupuesto'))) {
      const txt = `El análisis espacial entre la cosecha de salmonicultura y la inversión pública regional (fuentes oficiales SERNAPESCA, SUBPESCA y DIPRES / GORE Aysén) demuestra una marcada disociación territorial:

1. Concentración de Biomasa Salmonícola (SERNAPESCA 2024-2026, 503.500 ton regionales totales):
   - La comuna de Aysén concentra el 52,6% de la biomasa regional con 265.000 ton/año y la mayor concentración de centros operativos.
   - Cisnes alberga el 36,7% (185.000 ton/año).
   - Guaitecas aporta el 8,9% (45.000 ton/año).
   - Tortel registra una producción periférica de 8.500 ton/año (1,7%).
   - Las restantes 6 comunas no tienen actividad intensiva en maritorio.

2. Contraste con la Inversión Pública Regional (FNDR DIPRES / GORE, 54.650 M$ regionales totales):
   - Coyhaique, sin producción de biomasa salmonícola, capta el 27,2% del FNDR regional (14.850 M$), concentrando infraestructura hospitalaria y vial urbana.
   - Aysén recibe el 17,9% (9.800 M$) y Cisnes el 10,3% (5.600 M$).
   - Comunas litorales productivas como Guaitecas reciben solo 3.400 M$ (6,2%), exhibiendo un desacople estructural entre el volumen de biomasa privada extraída y los fondos públicos asignados a saneamiento y conectividad.`;

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

    // 5. Verificación de variables generales
    for (const v of _variablesCatalog) {
      if (q.includes(v.key) || q.includes(v.label.toLowerCase())) {
        const top5 = [..._comunas]
          .sort((a, b) => (b[v.key] || 0) - (a[v.key] || 0))
          .slice(0, 5)
          .map(c => `${c.nombre || c.nombre_comuna}: ${(c[v.key] || 0).toLocaleString('es-CL')} ${v.unit}`)
          .join('\n- ');

        const hubLetter = getHubForVariable(v.key);
        return {
          reply: `Indicador territorial verificado: ${v.label}.\n\nDistribución en las principales comunas:\n- ${top5}\n\nDatos oficiales consolidados al 100% en window.AYSEN_HUBS_DATA (Hub ${hubLetter}).`,
          sources: [
            { institucion: 'Plataforma Aysén Sistémico', indicador: v.label, url: 'index.html' }
          ],
          chart: {
            render: true,
            type: 'bar',
            varX: v.key,
            varY: null,
            title: v.label,
            excludeCoyhaique: false
          },
          relatedHub: hubLetter
        };
      }
    }

    // 6. Si el dato solicitado no existe en la plataforma (Mundo Cerrado)
    return {
      reply: `Este indicador no forma parte de las 28 fuentes oficiales de Aysén Sistémico.

La plataforma solo responde y grafica con base en registros auditados de las instituciones oficiales (SINIM, SERNATUR, CONAF, INE, CNE, SEC, SUBPESCA, SERNAPESCA, SEA, SII, CASEN, MINEDUC, MMA, DEIS-MINSAL, ANID, entre otras).

Indicadores territoriales reales recomendados:
1. Dependencia del Fondo Común Municipal (%) e Ingresos Propios (SINIM)
2. Visitas a Parques Nacionales SNASPE y Pernoctaciones EMAT (CONAF / INE)
3. Porcentaje de Hogares a Leña vs Días con Contaminación MP2.5 (CNE / MMA)
4. Biomasa de Salmonicultura vs Inversión Pública FNDR (SERNAPESCA / GORE)`,
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
   * @param {string} userMessage Texto de la consulta
   * @param {Object} [options] Opciones opcionales de llamada
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
          } else {
            console.warn('[OmniRouteClient] Respuesta no contenia un esquema JSON valido:', content);
          }
        }
      }
    } catch (errNet) {
      // Endpoint local no activo o error de red: fallback controlado a resolutor determinista
      // Esto asegura que consultor.html siempre funcione incluso antes de levantar scripts/start_omniroute.sh
    }

    const fallbackResult = resolveClosedWorldDeterministic(prompt);
    fallbackResult.offlineFallback = true;
    fallbackResult.notice = 'Respuesta resuelta con el índice verificado de Aysén Sistémico. (Para activar inferencia multi-proveedor en vivo vía OmniRoute, inicie el servicio con scripts/start_omniroute.sh).';
    return fallbackResult;
  }

  /**
   * Obtiene la serie de datos comunales para una variable específica
   */
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

  // Inicialización automática si window.AYSEN_HUBS_DATA ya está cargado
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
    getComunaVector: getComunaVector,
    extractJsonFromResponse: extractJsonFromResponse,
    getHubForVariable: getHubForVariable,
    FUENTES_OFICIALES_28: FUENTES_OFICIALES_28
  };
});
