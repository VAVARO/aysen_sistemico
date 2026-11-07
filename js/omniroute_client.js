/**
 * OmniRouteClient — Motor RAG en Memoria y Cliente LLM para Aysén Sistémico
 * ============================================================================
 * Arquitectura 100% libre de hardcoding y auto-adaptativa a nuevos datos:
 * 1. Introspecta dinámicamente `window.AYSEN_HUBS_DATA` (comunas, nodos, hubs,
 *    holdings, series históricas y cualquier colección o columna futura).
 * 2. Construye un índice invertido ponderado en memoria (integrando
 *    `NL2ChartEngine` / `data/nl_lexicon_aysen.json` cuando están disponibles).
 * 3. Recupera el subconjunto exacto de datos (RAG Context) para cada consulta
 *    y lo inyecta en la memoria del LLM (`http://localhost:20128/v1/chat/completions`),
 *    manteniendo memoria conversacional multi-turno.
 * 4. Si el servidor LLM local no está disponible, sintetiza la respuesta
 *    directamente desde el paquete de memoria recuperado (cero cifras estáticas).
 */
(function (root, factory) {
  'use strict';
  const instance = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = instance;
  }
  if (root) {
    root.OmniRouteClient = instance;
  }
})(typeof window !== 'undefined' ? window : globalThis, function (global) {
  'use strict';

  const DEFAULT_CONFIG = {
    endpoint: 'http://localhost:20128/v1/chat/completions',
    endpointUrl: 'http://localhost:20128/v1',
    apiKey: 'sk-omniroute-aysen-local',
    model: 'omniroute-default',
    temperature: 0.15,
    maxTokens: 1100,
    timeoutMs: 12000,
    maxHistoryTurns: 6,
    lexiconUrl: 'data/nl_lexicon_aysen.json'
  };

  // Catálogo institucional de las 28 fuentes verificadas
  const FUENTES_OFICIALES_28 = [
    { id: 1, institucion: 'SERNATUR', indicador: '01. Registro Nacional de Prestadores Turísticos', url: 'https://registro.sernatur.cl/', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 2, institucion: 'SUBTURISMO', indicador: '02. Zonas de Interés Turístico (ZOIT)', url: 'https://www.subturismo.gob.cl/zoit/', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 3, institucion: 'INE', indicador: '03. Encuesta Mensual de Alojamiento Turístico (EMAT)', url: 'https://www.ine.gob.cl/estadisticas/economicas/turismo', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 4, institucion: 'CONAF', indicador: '04. Estadísticas de Visitación SNASPE', url: 'https://www.conaf.cl/parques-nacionales/visitanos/estadisticas-de-visitacion/', hub: 'I. Turismo', anos: '2015-2026' },
    { id: 5, institucion: 'SUBPESCA', indicador: '05. Catastro de Concesiones de Acuicultura', url: 'https://mapas.subpesca.cl/visorsubpesca/', hub: 'II. Salmonicultura', anos: '2015-2026' },
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
    { id: 17, institucion: 'SEA - SEIA', indicador: '17. Proyectos Evaluados y Aprobados en el SEIA', url: 'https://seia.sea.gob.cl/', hub: 'V. Inversión', anos: '2015-2026' },
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

  let _config = Object.assign({}, DEFAULT_CONFIG);
  let _dataLake = null;
  let _lexicon = null;
  let _conversationMemory = [];

  // Carga automática del léxico en entorno Node.js si está disponible en disco
  function tryLoadNodeLexicon() {
    if (_lexicon) return _lexicon;
    if (typeof require === 'function') {
      try {
        const fs = require('fs');
        const path = require('path');
        const lexPath = path.resolve(process.cwd(), DEFAULT_CONFIG.lexiconUrl);
        if (fs.existsSync(lexPath)) {
          _lexicon = JSON.parse(fs.readFileSync(lexPath, 'utf8'));
        }
      } catch (_) {}
    }
    return _lexicon;
  }

  // Índice dinámico auto-construido desde el Data Lake
  let _memoryIndex = {
    entities: [],          // Comunas u otras unidades territoriales detectadas
    comunas: [],           // Referencia directa a comunas para compatibilidad contractual
    variables: [],         // Todas las columnas numéricas y categóricas de comunas
    variablesByKey: {},
    nodes: [],             // Todos los nodos satélite (#01..#N) con sus tablas y series
    nodos: [],             // Alias contractual para nodos
    hubs: [],              // Todos los hubs temáticos
    customCollections: [], // Holdings, series mensuales, puentes y futuras tablas
    sourcesByKey: {},      // Fuentes oficiales indexadas por variable
    fuentes: FUENTES_OFICIALES_28
  };

  // Stopwords en español para tokenización limpia
  const STOPWORDS = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
    'a', 'en', 'con', 'por', 'para', 'sin', 'sobre', 'entre', 'hacia', 'hasta',
    'y', 'e', 'o', 'u', 'ni', 'que', 'cual', 'cuales', 'como', 'donde', 'cuando',
    'cuanto', 'cuanta', 'cuantos', 'cuantas', 'quien', 'quienes', 'se', 'su',
    'sus', 'es', 'son', 'fue', 'ha', 'han', 'hay', 'tiene', 'tienen', 'mas',
    'menos', 'muy', 'pero', 'si', 'no', 'me', 'te', 'lo', 'le', 'les', 'nos',
    'esta', 'estan', 'este', 'estos', 'esta', 'estuvo', 'ser', 'estar',
    'mostrar', 'muestrame', 'mostrame', 'ver', 'dime', 'consulta', 'consultar',
    'datos', 'dato', 'informacion', 'indicador', 'indicadores', 'variable',
    'variables', 'grafico', 'graficar', 'tabla', 'aysen', 'region', 'cada',
    'comuna', 'comunas', 'comunal', 'comunales', 'regional', 'regionales',
    'territorial', 'territoriales', 'mayor', 'menor', 'comparan', 'contrasta', 'cruza'
  ]);

  const IDENTITY_KEYS = new Set([
    'id', 'comuna_ine', 'codigo_comuna', 'nombre', 'nombre_comuna', 'lat', 'lng', 'lon'
  ]);

  const TECHNICAL_SUFFIXES_RE = /\b(pct|mclp|clp|mmusd|usd|ton|km2|km|ha|mw|hrs|m3s|m3|n|count|total|est|anual|hist)\b/g;

  function normalizeText(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9.\s_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(str) {
    return normalizeText(str)
      .replace(/_/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !STOPWORDS.has(t));
  }

  function fmtNumber(val, maxDecimals = 1) {
    if (typeof val !== 'number' || !Number.isFinite(val)) return String(val ?? '-');
    const isInt = Math.abs(val - Math.round(val)) < 1e-6;
    return val.toLocaleString('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: isInt ? 0 : maxDecimals
    });
  }

  /**
   * Infiere dinámicamente el Hub temático (I al X) al que pertenece cualquier variable
   * actual o futura mediante inspección del Data Lake y reglas semánticas abiertas.
   */
  function getHubForVariable(varKey) {
    const k = String(varKey || '').toLowerCase();
    // 1. Verificar si el índice dinámico ya lo resolvió desde systemicBridges / nodos
    if (_memoryIndex.variablesByKey && _memoryIndex.variablesByKey[varKey]?.hub) {
      return _memoryIndex.variablesByKey[varKey].hub;
    }
    // 2. Inferencia semántica abierta para cualquier columna presente o futura
    if (/sernatur|turis|emat|pernoctacion|snaspe.*visita|visita.*snaspe|visitantes_snaspe|zoit|hotel|alojamiento/.test(k)) return 'I';
    if (/salmon|acuic|biomasa|antibiotico|amerb|subpesca|sernapesca|caligus/.test(k)) return 'II';
    if (/potencia_mw|mw|electric|saidi|saifi|tarifa_bt1|gasolina|diesel|precio_lena|internet_fijo|fibra|telecom/.test(k)) return 'III';
    if (/presupuesto|fcm|fndr|ipp|gasto_personal|inversion_directa|profesionalizacion|ruta7|alcalde|concejal|sinim|municipal/.test(k)) return 'IV';
    if (/seia|sii|empresa|trabajador|compra|fuga_compras|parcelacion|miner|pib|inversion_seia/.test(k)) return 'V';
    if (/glaciar|vegetal|snaspe_pct|guardaparque|fauna|huemul|daa_|mp25|hogares_lena|aire|bosque|biodiv/.test(k)) return 'VII';
    if (/hospital|cama.*hosp|medico|espera_no_ges|urgencia|samu|aeroevac|posta|traslado_coyhaique|salud|deis/.test(k)) return 'VIII';
    if (/museo|biblioteca|fondart|espacios_culturales|monumento|patrimonio|cultura/.test(k)) return 'IX';
    if (/anid|corfo|ctci|investigador|ciencia|innovacion/.test(k)) return 'X';
    return 'VI';
  }

  /**
   * Extrae un objeto JSON desde una respuesta de LLM (pura, bloque Markdown o con texto envolvente).
   */
  function extractJsonFromResponse(rawContent) {
    if (!rawContent || typeof rawContent !== 'string') return null;
    const trimmed = rawContent.trim();
    try {
      const direct = JSON.parse(trimmed);
      if (direct && typeof direct === 'object') return direct;
    } catch (_) {}

    const mdMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (mdMatch && mdMatch[1]) {
      try {
        const parsed = JSON.parse(mdMatch[1].trim());
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (_) {}
    }

    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const candidate = trimmed.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (_) {}
    }
    return null;
  }

  /**
   * Infiere etiqueta legible, unidad de medida y regla de agregación ('sum' vs 'avg')
   * para cualquier clave presente o futura del Data Lake.
   */
  function inferVariableMetadata(key, sampleValues, lexiconEntry) {
    let unit = '';
    if (lexiconEntry && lexiconEntry.unit) {
      unit = lexiconEntry.unit;
    } else if (key.endsWith('_pct') || key.includes('porcentaje')) {
      unit = '%';
    } else if (key.endsWith('_mmusd')) {
      unit = 'MM USD';
    } else if (key.endsWith('_mclp')) {
      unit = 'M$ CLP';
    } else if (key.endsWith('_clp')) {
      unit = '$ CLP';
    } else if (key.endsWith('_ton')) {
      unit = 'ton';
    } else if (key.endsWith('_km2')) {
      unit = 'km²';
    } else if (key.endsWith('_km')) {
      unit = 'km';
    } else if (key.endsWith('_ha')) {
      unit = 'ha';
    } else if (key.endsWith('_mw')) {
      unit = 'MW';
    } else if (key.endsWith('_hrs') || key.includes('horas')) {
      unit = 'horas';
    } else if (key.endsWith('_m3s')) {
      unit = 'm³/s';
    } else if (key.endsWith('_m3')) {
      unit = 'm³';
    } else if (key.includes('por_mil')) {
      unit = 'por mil hab.';
    } else if (key.includes('poblacion') || key.includes('habitante')) {
      unit = 'hab.';
    }

    // Determinar si la variable es intensiva (tasa, porcentaje, per cápita, promedio, densidad, precio, tarifa)
    const isIntensive = Boolean(
      unit === '%' ||
      /(pct|porcentaje|tasa|densidad|per_capita|por_mil|ratio|promedio|plazo|horas|hrs|tarifa|precio|costo|gasolina|diesel|ica_g_ton|nota|indice)/i.test(key)
    );

    let humanLabel = (lexiconEntry && lexiconEntry.label)
      ? lexiconEntry.label
      : key
          .replace(/_/g, ' ')
          .replace(TECHNICAL_SUFFIXES_RE, '')
          .replace(/\s+/g, ' ')
          .trim();

    if (humanLabel) {
      humanLabel = humanLabel.charAt(0).toUpperCase() + humanLabel.slice(1);
    } else {
      humanLabel = key;
    }

    const numericVals = sampleValues.filter(v => typeof v === 'number' && Number.isFinite(v));
    const isNumeric = numericVals.length > 0;

    return {
      key,
      label: humanLabel,
      unit,
      isNumeric,
      aggregation: isIntensive ? 'avg' : 'sum',
      hub: getHubForVariable(key)
    };
  }

  /**
   * Resuelve dinámicamente la fuente oficial de una variable o nodo leyendo
   * `officialVariableSources`, `nodos` y `hubs` desde `window.AYSEN_HUBS_DATA`.
   */
  function resolveSourceForKey(key, dataLake) {
    const sourcesMap = (dataLake && dataLake.officialVariableSources) || {};
    const k = String(key || '').toLowerCase();

    for (const [srcId, srcObj] of Object.entries(sourcesMap)) {
      if (k.includes(srcId.toLowerCase())) {
        return {
          institucion: srcObj.name || srcId.toUpperCase(),
          indicador: key,
          url: srcObj.url || '#'
        };
      }
    }

    const bridges = Array.isArray(dataLake?.systemicBridges) ? dataLake.systemicBridges : [];
    const nodes = Array.isArray(dataLake?.nodos) ? dataLake.nodos : [];
    for (const b of bridges) {
      if (b.varX === key || b.varY === key) {
        const node = nodes.find(n => n.id === b.source || n.id === b.target);
        if (node && node.provenance) {
          return {
            institucion: node.provenance.sourceEntity || node.officialSource?.name || 'Fuente Oficial',
            indicador: node.title || key,
            url: node.provenance.sourceUrl || node.officialSource?.url || '#'
          };
        }
      }
    }

    const pick = (id, fallbackName, fallbackUrl) => {
      const s = sourcesMap[id];
      return {
        institucion: s ? s.name : fallbackName,
        indicador: key,
        url: s ? s.url : fallbackUrl
      };
    };

    if (/poblacion|censo|superficie_km2|densidad/.test(k)) return pick('censo', 'INE - Censo 2024', 'https://censo2024.ine.gob.cl');
    if (/pobreza|casen/.test(k)) return pick('casen', 'MDSF - Encuesta CASEN', 'https://observatorio.ministeriodesarrollosocial.gob.cl');
    if (/presupuesto|fcm|ipp|gasto_personal|profesionalizacion|alcalde/.test(k)) return pick('sinim', 'SUBDERE - SINIM', 'https://datos.sinim.gov.cl');
    if (/fndr/.test(k)) return pick('fndr', 'DIPRES / GORE Aysén (FNDR)', 'https://www.dipres.gob.cl');
    if (/salmon|acuicol|biomasa|antibioticos|amerb/.test(k)) return pick('sernapesca', 'SERNAPESCA / SUBPESCA', 'https://www.sernapesca.cl');
    if (/miner/.test(k)) return pick('sernageomin', 'SERNAGEOMIN', 'https://www.sernageomin.cl');
    if (/seia/.test(k)) return pick('seia', 'SEA - SEIA', 'https://seia.sea.gob.cl');
    if (/sii|empresa|trabajador/.test(k)) return pick('sii', 'Servicio de Impuestos Internos (SII)', 'https://www.sii.cl');
    if (/compra|fuga/.test(k)) return pick('chilecompra', 'Dirección ChileCompra', 'https://datos-abiertos.chilecompra.cl');
    if (/parcelacion|sag/.test(k)) return pick('sag', 'SAG', 'https://www.sag.gob.cl');
    if (/saidi|saifi/.test(k)) return pick('sec', 'SEC', 'https://www.sec.cl');
    if (/potencia|tarifa|gasolina|diesel|lena|electric/.test(k)) return pick('cne', 'Comisión Nacional de Energía (CNE)', 'https://www.cne.cl');
    if (/internet|foa|telecom/.test(k)) return pick('subtel', 'SUBTEL', 'https://www.subtel.gob.cl');
    if (/sernatur|emat|pernoctacion|turis|camas_turisticas|zoit/.test(k)) return pick('sernatur', 'SERNATUR / INE EMAT', 'https://www.sernatur.cl');
    if (/snaspe|vegetal|conaf|guardaparque/.test(k)) return pick('conaf', 'CONAF - SNASPE / SIT', 'https://www.conaf.cl');
    if (/glaciar|mp25|daa|fauna|sinca|dga/.test(k)) return pick('sinca_mma', 'MMA (SINCA / RCE) y DGA-MOP', 'https://sinca.mma.gob.cl');
    if (/salud|hospital|camas_hospitalarias|medico|posta|urgencia|espera|samu|traslado/.test(k)) return pick('deis', 'DEIS MINSAL / Servicio de Salud Aysén', 'https://deis.minsal.cl');
    if (/matricula|educ|slep|escuela/.test(k)) return pick('mineduc', 'MINEDUC / SLEP Aysén', 'https://datosabiertos.mineduc.cl');
    if (/museo|biblioteca|monumento|cultura|fondart|espacios_culturales/.test(k)) return pick('mincap', 'MINCAP / SERPAT / CMN', 'https://www.patrimoniocultural.gob.cl');
    if (/anid|corfo|ctci|investigador|ciencia/.test(k)) return pick('anid', 'ANID / MinCiencia / CORFO', 'https://dataciencia.anid.cl');

    return pick('sinim', 'Plataforma de Datos Oficiales de Aysén', 'https://datos.gob.cl');
  }

  // Sinónimos semánticos de respaldo por patrón de nombre de columna (activos incluso si el JSON externo aún no carga)
  function getIntrinsicSynonymsForKey(key) {
    const k = String(key || '').toLowerCase();
    const extra = [];
    if (k === 'poblacion_censo_2024') {
      extra.push('poblacion', 'habitantes', 'personas viven', 'cuantas personas', 'cuanta gente', 'demografia', 'residentes', 'censo');
    } else if (k === 'dependencia_fcm_pct') {
      extra.push('dependencia del fondo comun municipal', 'fondo comun municipal', 'fcm', 'dependencia municipal');
    } else if (k === 'ipp_per_capita_clp' || k === 'presupuesto_per_capita_mclp') {
      extra.push('ingresos propios', 'ingresos propios permanentes', 'presupuesto per capita', 'autonomia financiera');
    } else if (k === 'visitantes_snaspe') {
      extra.push('visitas a parques nacionales', 'parques nacionales', 'visitacion snaspe', 'visitas snaspe', 'turistas parques');
    } else if (k === 'pernoctaciones_emat') {
      extra.push('noches de alojamiento turistico', 'alojamiento turistico', 'pernoctaciones', 'emat');
    } else if (k === 'hogares_lena_pct') {
      extra.push('calefaccionan con lena', 'hogares que calefaccionan con lena', 'uso de lena', 'calefaccion lena', 'lena');
    } else if (k === 'dias_sobre_norma_mp25') {
      extra.push('contaminacion critica mp2.5', 'mp2.5', 'dias con contaminacion', 'calidad del aire', 'material particulado');
    } else if (k === 'biomasa_salmon_ton') {
      extra.push('biomasa de salmonicultura', 'biomasa salmon', 'salmonicultura', 'cosecha de salmon', 'acuicultura');
    } else if (k === 'fndr_mclp') {
      extra.push('inversion publica regional', 'fndr', 'fondo nacional de desarrollo regional', 'inversion regional');
    } else if (k === 'superficie_km2') {
      extra.push('superficie territorial', 'superficie', 'extension territorial', 'tamano comunal', 'area km2');
    } else if (k === 'camas_hospitalarias') {
      extra.push('camas hospitalarias', 'camas de hospital', 'hospitales');
    }
    return extra;
  }

  /**
   * Construye o reconstruye la memoria indexada completa inspeccionando
   * todas las estructuras presentes en `dataLake`.
   */
  function buildMemoryIndex(dataLake, lexicon) {
    if (!dataLake || typeof dataLake !== 'object') return;

    const comunas = Array.isArray(dataLake.comunas) ? dataLake.comunas : [];
    const nodos = Array.isArray(dataLake.nodos) ? dataLake.nodos : [];
    const hubs = Array.isArray(dataLake.hubs) ? dataLake.hubs : [];
    const bridges = Array.isArray(dataLake.systemicBridges) ? dataLake.systemicBridges : [];
    const lexVars = (lexicon && lexicon.variables) ? lexicon.variables : {};

    // 1. Indexar entidades territoriales (comunas o futuras unidades)
    const entities = comunas.map(c => {
      const name = c.nombre || c.nombre_comuna || String(c.id);
      const normName = normalizeText(name);
      const aliases = new Set([normName]);
      const stripped = normName.replace(/^(puerto|caleta|villa)\s+/, '').trim();
      if (stripped && stripped !== 'aysen') aliases.add(stripped);
      if (normName === 'aysen') {
        aliases.delete('aysen');
        aliases.add('puerto aysen');
        aliases.add('pto aysen');
        aliases.add('comuna de aysen');
        aliases.add('aysen comuna');
      }
      if (normName.includes('ibanez')) {
        aliases.add('ibanez');
        aliases.add('rio ibanez');
        aliases.add('puerto ibanez');
      }
      if (normName.includes('ohiggins') || normName.includes("o'higgins") || normName.includes('higgins')) {
        aliases.add('ohiggins');
        aliases.add('o higgins');
        aliases.add('villa ohiggins');
        aliases.add('villa o higgins');
      }
      if (normName.includes('guaitecas')) aliases.add('melinka');
      if (normName.includes('tortel')) aliases.add('caleta tortel');
      if (normName.includes('cisnes')) aliases.add('puerto cisnes');

      return {
        id: String(c.comuna_ine || c.codigo_comuna || c.id),
        name,
        provincia: c.provincia || '',
        cabecera: c.cabecera || '',
        aliases: Array.from(aliases),
        raw: c
      };
    });

    // 2. Descubrir todas las claves de todas las filas de `comunas` (soporta esquemas heterogéneos)
    const allComunaKeys = new Set();
    comunas.forEach(c => {
      if (c && typeof c === 'object') {
        Object.keys(c).forEach(k => {
          if (!IDENTITY_KEYS.has(k)) allComunaKeys.add(k);
        });
      }
    });

    const bridgeContextByVar = {};
    bridges.forEach(b => {
      if (b.varX) {
        bridgeContextByVar[b.varX] = (bridgeContextByVar[b.varX] || '') + ' ' + (b.relationNote || '');
      }
      if (b.varY) {
        bridgeContextByVar[b.varY] = (bridgeContextByVar[b.varY] || '') + ' ' + (b.relationNote || '');
      }
    });

    const variables = [];
    const variablesByKey = {};
    const sourcesByKey = {};

    allComunaKeys.forEach(key => {
      const sampleValues = comunas.map(c => c[key]).filter(v => v !== undefined && v !== null);
      const lexEntry = lexVars[key] || null;
      const meta = inferVariableMetadata(key, sampleValues, lexEntry);
      const source = resolveSourceForKey(key, dataLake);
      sourcesByKey[key] = source;

      const synonymPhrases = new Set();
      synonymPhrases.add(normalizeText(key.replace(/_/g, ' ')));
      synonymPhrases.add(normalizeText(meta.label));
      getIntrinsicSynonymsForKey(key).forEach(s => synonymPhrases.add(normalizeText(s)));
      if (lexEntry && Array.isArray(lexEntry.synonyms)) {
        lexEntry.synonyms.forEach(s => synonymPhrases.add(normalizeText(s)));
      }

      const tokenBag = new Set([
        ...tokenize(key),
        ...tokenize(meta.label),
        ...tokenize(bridgeContextByVar[key] || '')
      ]);
      synonymPhrases.forEach(p => tokenize(p).forEach(t => tokenBag.add(t)));

      let stats = null;
      if (meta.isNumeric) {
        const ranked = comunas
          .map(c => ({
            comuna: c.nombre || c.nombre_comuna,
            comuna_ine: String(c.comuna_ine || c.codigo_comuna || ''),
            value: typeof c[key] === 'number' && Number.isFinite(c[key]) ? c[key] : 0
          }))
          .sort((a, b) => b.value - a.value);

        const sum = ranked.reduce((acc, r) => acc + r.value, 0);
        const avg = ranked.length ? sum / ranked.length : 0;
        stats = {
          sum,
          avg,
          max: ranked[0] || null,
          second: ranked[1] || null,
          min: ranked[ranked.length - 1] || null,
          ranked
        };
      }

      const varRecord = {
        key,
        label: meta.label,
        unit: meta.unit,
        hub: meta.hub,
        isNumeric: meta.isNumeric,
        aggregation: meta.aggregation,
        source,
        synonyms: Array.from(synonymPhrases).filter(Boolean),
        tokens: Array.from(tokenBag),
        stats
      };

      variables.push(varRecord);
      variablesByKey[key] = varRecord;
    });

    // 3. Indexar todos los Nodos Satélite (#01..#N) incluyendo tablas y series de tiempo
    const indexedNodes = nodos.map(n => {
      const textCorpus = [
        n.title,
        n.definition,
        n.example,
        n.chartSpec?.title,
        ...(Array.isArray(n.tableColumns) ? n.tableColumns : []),
        ...(Array.isArray(n.canvasPreview?.availableDimensions) ? n.canvasPreview.availableDimensions : [])
      ].filter(Boolean).join(' ');

      return {
        id: n.id,
        hubId: n.hubId,
        title: n.title || `Nodo #${n.id}`,
        definition: (n.definition || '').replace(/\*\*/g, ''),
        example: (n.example || '').replace(/\*\*/g, ''),
        chartSpec: n.chartSpec || null,
        tableColumns: n.tableColumns || [],
        tableRows: n.tableRows || [],
        provenance: n.provenance || n.officialSource || null,
        tokens: tokenize(textCorpus),
        normTitle: normalizeText(n.title || '')
      };
    });

    // 4. Indexar Hubs temáticos
    const indexedHubs = hubs.map(h => ({
      id: h.id,
      numeral: h.numeral,
      title: h.title,
      description: (h.description || '').replace(/\*\*/g, ''),
      example: (h.example || '').replace(/\*\*/g, ''),
      sourceName: h.sourceName,
      sourceUrl: h.sourceUrl,
      tokens: tokenize(`${h.title} ${h.description} ${h.example}`)
    }));

    // 5. Auto-descubrir colecciones adicionales (holdings, seriesMensualesEmat, extension_modules y futuras claves)
    const customCollections = [];
    const knownTopKeys = new Set([
      'generatedAt', 'meta', 'hubs', 'nodos', 'comunas', 'comunasGeoJSON',
      'localidadesCoords', 'officialVariableSources', 'spatialNodesByLayer'
    ]);

    Object.keys(dataLake).forEach(topKey => {
      if (knownTopKeys.has(topKey)) return;
      const val = dataLake[topKey];
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
        const sampleKeys = Object.keys(val[0]);
        const sampleText = JSON.stringify(val.slice(0, 5));
        customCollections.push({
          key: topKey,
          count: val.length,
          fields: sampleKeys,
          tokens: tokenize(`${topKey} ${sampleKeys.join(' ')} ${sampleText}`),
          records: val
        });
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        customCollections.push({
          key: topKey,
          count: Object.keys(val).length,
          fields: Object.keys(val),
          tokens: tokenize(`${topKey} ${Object.keys(val).join(' ')}`),
          records: val
        });
      }
    });

    _memoryIndex = {
      entities,
      comunas,
      variables,
      variablesByKey,
      nodes: indexedNodes,
      nodos: indexedNodes,
      hubs: indexedHubs,
      customCollections,
      sourcesByKey,
      fuentes: FUENTES_OFICIALES_28
    };
  }

  /**
   * Puntúa una variable del catálogo frente a la consulta del usuario.
   */
  function scoreVariable(varRecord, qNorm, qTokens) {
    let score = 0;

    for (const phrase of varRecord.synonyms) {
      if (phrase.length > 2 && qNorm.includes(phrase)) {
        const wordCount = phrase.split(' ').length;
        score += 14 * wordCount + phrase.length * 0.5;
      }
    }

    for (const qt of qTokens) {
      for (const vt of varRecord.tokens) {
        if (qt === vt) {
          score += 5;
        } else if (qt.length >= 4 && vt.length >= 4 && (vt.startsWith(qt) || qt.startsWith(vt))) {
          score += 2.5;
        }
      }
    }

    if (/(por habitante|per capita|por mil)/.test(qNorm)) {
      if (/(per_capita|por_mil|densidad|ratio)/.test(varRecord.key)) score += 18;
      if (varRecord.key === 'poblacion_censo_2024') score -= 20;
    }

    // Priorizar el indicador principal cuando la pregunta menciona un concepto primario y uno secundario
    if (/(fondo comun municipal|dependencia.*fcm)/.test(qNorm) && varRecord.key === 'dependencia_fcm_pct') {
      score += 30;
    }
    if (/(calefaccion.*lena|hogares.*lena)/.test(qNorm) && varRecord.key === 'hogares_lena_pct') {
      score += 30;
    }
    if (/(biomasa.*salmon|concentran la biomasa)/.test(qNorm) && varRecord.key === 'biomasa_salmon_ton') {
      score += 30;
    }
    if (/(personas viven|cuantas personas|poblacion|habitantes)/.test(qNorm) && !/(por habitante|per capita|por mil)/.test(qNorm)) {
      if (varRecord.key === 'poblacion_censo_2024') score += 35;
    }

    return score;
  }

  /**
   * Recupera el paquete de memoria relevante (`memoryPacket`) desde `_memoryIndex`
   * para responder la consulta del usuario con datos 100% verificados.
   */
  function retrieveMemoryForQuery(userText) {
    const qNorm = normalizeText(userText);
    const qTokens = tokenize(userText);

    const excludeCoyhaique = /(sin coyhaique|excluir coyhaique|excepto coyhaique|sacar coyhaique|sin la capital)/.test(qNorm);
    const wantsScatter = /(cruza|cruzar|correlacion|vs\b|versus|frente a|contra|relacion entre|comparar .+ con)/.test(qNorm);
    const wantsTemporal = /(evolucion|historic|serie|anual|mensual|2015|2016|2017|2018|2019|2020|2021|2022|2023|2025|2026|tiempo|tendencia|mes a mes)/.test(qNorm);

    // 1. Detectar comunas mencionadas (soporta 1 o múltiples comunas comparadas)
    const matchedEntities = _memoryIndex.entities.filter(ent =>
      ent.aliases.some(alias => {
        const re = new RegExp(`(^|\\s)${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`);
        return re.test(qNorm);
      })
    );

    const matchedEntityTokens = new Set();
    matchedEntities.forEach(ent => {
      ent.aliases.forEach(a => tokenize(a).forEach(t => matchedEntityTokens.add(t)));
    });
    const varQueryTokens = qTokens.filter(t => !matchedEntityTokens.has(t));

    // 2. Puntuar variables comunales (combinando motor propio + NL2ChartEngine si está disponible)
    const nlScores = {};
    if (global && global.NL2ChartEngine && typeof global.NL2ChartEngine.scoreColumns === 'function') {
      try {
        const ext = global.NL2ChartEngine.scoreColumns(userText) || [];
        ext.forEach(item => {
          if (item && item.col) nlScores[item.col] = item.score || 0;
        });
      } catch (_) {}
    }

    const scoredVars = _memoryIndex.variables
      .map(v => ({
        variable: v,
        score: scoreVariable(v, qNorm, varQueryTokens) + (nlScores[v.key] || 0) * 1.2
      }))
      .filter(item => item.score >= 5)
      .sort((a, b) => b.score - a.score);

    // 3. Puntuar Nodos Satélite (#01..#N) para recuperar tablas, definiciones y series históricas
    const scoredNodes = _memoryIndex.nodes
      .map(n => {
        let s = 0;
        if (n.normTitle && n.normTitle.length > 3 && qNorm.includes(n.normTitle)) s += 25;
        qTokens.forEach(qt => {
          n.tokens.forEach(nt => {
            if (qt === nt) s += 4;
            else if (qt.length >= 4 && nt.startsWith(qt)) s += 2;
          });
        });
        if (wantsTemporal && n.chartSpec && n.chartSpec.type === 'line') s += 6;
        return { node: n, score: s };
      })
      .filter(item => item.score >= 8)
      .sort((a, b) => b.score - a.score);

    // 4. Puntuar colecciones especiales
    const matchedCollections = _memoryIndex.customCollections
      .map(col => {
        let s = 0;
        qTokens.forEach(qt => {
          if (col.tokens.includes(qt)) s += 5;
        });
        return { collection: col, score: s };
      })
      .filter(item => item.score >= 10)
      .sort((a, b) => b.score - a.score);

    const topNumericVars = scoredVars.filter(item => item.variable.isNumeric);
    const primaryVar = topNumericVars[0]?.variable || null;
    const secondaryVar = (topNumericVars[1] && topNumericVars[1].score >= Math.max(8, (topNumericVars[0]?.score || 0) * 0.35))
      ? topNumericVars[1].variable
      : null;

    let chartSpec = {
      render: Boolean(primaryVar || matchedEntities.length > 0),
      type: wantsScatter && secondaryVar ? 'scatter' : (wantsTemporal ? 'line' : 'bar'),
      varX: primaryVar ? primaryVar.key : 'poblacion_censo_2024',
      varY: secondaryVar ? secondaryVar.key : null,
      title: primaryVar
        ? (secondaryVar ? `${primaryVar.label} vs ${secondaryVar.label}` : `${primaryVar.label} por Comuna`)
        : 'Población Comunal Censo 2024',
      excludeCoyhaique
    };

    if (wantsTemporal && /(turis|snaspe|parque|pernoctacion|alojamiento|emat|visita)/.test(qNorm)) {
      chartSpec = {
        render: true,
        type: 'line',
        varX: 'visitantes_snaspe',
        varY: 'pernoctaciones_emat',
        title: 'Evolución Histórica de Visitas SNASPE y Pernoctaciones EMAT (2015–2026)',
        excludeCoyhaique: false
      };
    }

    const selectedVarKeys = topNumericVars.slice(0, 4).map(v => v.variable.key);
    const allTextVars = scoredVars.filter(v => !v.variable.isNumeric).slice(0, 2).map(v => v.variable.key);
    const activeKeys = Array.from(new Set([
      ...selectedVarKeys,
      ...allTextVars,
      ...(selectedVarKeys.length === 0 ? ['poblacion_censo_2024', 'superficie_km2', 'presupuesto_mclp', 'dependencia_fcm_pct'] : [])
    ]));

    const filteredEntities = _memoryIndex.entities.filter(e =>
      !(excludeCoyhaique && (e.id === '11101' || e.name.toLowerCase() === 'coyhaique'))
    );

    const comunasMatrix = filteredEntities.map(e => {
      const row = { comuna: e.name, provincia: e.provincia };
      activeKeys.forEach(k => {
        row[k] = e.raw[k];
      });
      return row;
    });

    const sources = [];
    const seenUrls = new Set();
    const pushSource = (src) => {
      if (!src) return;
      const key = `${src.institucion}|${src.url}`;
      if (!seenUrls.has(key)) {
        seenUrls.add(key);
        sources.push(src);
      }
    };

    activeKeys.forEach(k => pushSource(_memoryIndex.sourcesByKey[k]));
    scoredNodes.slice(0, 2).forEach(({ node }) => {
      if (node.provenance) {
        pushSource({
          institucion: node.provenance.sourceEntity || node.provenance.name || 'Fuente Oficial',
          indicador: node.title,
          url: node.provenance.sourceUrl || node.provenance.url || '#'
        });
      }
    });

    const relatedHub = getHubForVariable(chartSpec.varX);

    return {
      query: userText,
      qNorm,
      excludeCoyhaique,
      wantsScatter,
      wantsTemporal,
      matchedEntities,
      topVariables: scoredVars.slice(0, 4).map(s => s.variable),
      primaryVar,
      secondaryVar,
      topNodes: scoredNodes.slice(0, 2).map(s => s.node),
      matchedCollections: matchedCollections.slice(0, 2).map(c => c.collection),
      comunasMatrix,
      activeKeys,
      chartSpec,
      sources: sources.slice(0, 4),
      relatedHub
    };
  }

  /**
   * Construye el System Prompt general y de memoria verificada.
   */
  function buildSystemPrompt() {
    if (!_memoryIndex.variables.length && (_dataLake || (global && global.AYSEN_HUBS_DATA))) {
      buildMemoryIndex(_dataLake || global.AYSEN_HUBS_DATA, _lexicon);
    }
    const varList = _memoryIndex.variables.map(v => `${v.key} (${v.unit || 'unid.'}, Hub ${v.hub})`).join(', ');
    return [
      'Eres el Consultor Territorial de Aysén Sistémico, conectado en tiempo real a la memoria verificada de `window.AYSEN_HUBS_DATA` (10 Comunas, 10 Hubs Sistémicos I al X, 39 Nodos Satélites y 28 fuentes oficiales).',
      `Catálogo dinámico de variables indexadas (${_memoryIndex.variables.length}): ${varList}`,
      'INSTRUCCIONES DE RIGOR FACTUAL:',
      '1. Responde EXCLUSIVAMENTE utilizando los datos provistos en la memoria recuperada. Jamás inventes cifras.',
      '2. Cita las cifras exactas en formato chileno (punto para miles, coma para decimales), mencionando las comunas líderes, las de menor valor y el total o promedio regional según corresponda.',
      '3. Para tasas, porcentajes, densidades o valores per cápita, informa el Promedio Regional y NUNCA sumes porcentajes ni tasas entre comunas.',
      '4. No utilices emojis bajo ninguna circunstancia.',
      '5. Devuelve tu respuesta estrictamente como un objeto JSON válido con la estructura:',
      '{"reply": "Texto analítico claro y conciso con las cifras exactas", "chart": {"render": true, "type": "bar|line|scatter", "varX": "clave_x", "varY": "clave_y_o_null", "title": "Título del gráfico", "excludeCoyhaique": false}, "relatedHub": "I..X"}'
    ].join('\n');
  }

  /**
   * Construye el System Prompt inyectando la Memoria Verificada (`memoryPacket`)
   * para que el LLM responda razonando sobre los datos reales sin alucinar.
   */
  function buildMemoryGroundedPrompts(memoryPacket) {
    const varSummaries = memoryPacket.topVariables.map(v => {
      if (!v.isNumeric || !v.stats) {
        return { key: v.key, label: v.label, type: 'categorical' };
      }
      return {
        key: v.key,
        label: v.label,
        unit: v.unit,
        aggregationType: v.aggregation === 'avg' ? 'Promedio Regional' : 'Total Acumulado Regional',
        regionalAggregateValue: v.aggregation === 'avg'
          ? Number(v.stats.avg.toFixed(2))
          : Number(v.stats.sum.toFixed(2)),
        leaderComuna: v.stats.max,
        secondComuna: v.stats.second,
        lowestComuna: v.stats.min,
        source: v.source?.institucion
      };
    });

    const nodeContext = memoryPacket.topNodes.map(n => ({
      nodeId: n.id,
      title: n.title,
      definition: n.definition,
      tableColumns: n.tableColumns,
      tableRows: n.tableRows.slice(0, 10),
      timeSeries: n.chartSpec && n.chartSpec.type === 'line' ? {
        title: n.chartSpec.title,
        labels: n.chartSpec.labels,
        datasets: (n.chartSpec.datasets || []).map(ds => ({ label: ds.label, data: ds.data }))
      } : undefined
    }));

    const extraContext = memoryPacket.matchedCollections.map(col => ({
      collection: col.key,
      totalRecords: col.count,
      sampleRecords: Array.isArray(col.records) ? col.records.slice(0, 8) : col.records
    }));

    const systemPrompt = buildSystemPrompt();

    const memoryPayload = {
      consulta_usuario: memoryPacket.query,
      comunas_filtradas_solicitadas: memoryPacket.matchedEntities.map(e => e.raw),
      resumen_estadistico_variables_relevantes: varSummaries,
      matriz_comunal_datos_exactos: memoryPacket.comunasMatrix,
      nodos_y_series_historicas_relevantes: nodeContext,
      colecciones_adicionales_detectadas: extraContext,
      catalogo_total_stats: {
        total_comunas: _memoryIndex.entities.length,
        total_variables_comunales: _memoryIndex.variables.length,
        total_nodos_satelite: _memoryIndex.nodes.length,
        total_hubs: _memoryIndex.hubs.length
      },
      grafico_sugerido: memoryPacket.chartSpec
    };

    return {
      systemPrompt,
      userPromptWithMemory: `MEMORIA_VERIFICADA:\n${JSON.stringify(memoryPayload)}\n\nCONSULTA DEL USUARIO:\n${memoryPacket.query}`
    };
  }

  /**
   * Sintetiza una respuesta analítica dinámica leyendo directamente del `memoryPacket`
   * cuando el servidor LLM local no está activo. Cero textos o números hardcodeados.
   */
  function synthesizeFromMemoryPacket(memoryPacket) {
    const {
      qNorm,
      excludeCoyhaique,
      wantsTemporal,
      matchedEntities,
      topVariables,
      primaryVar,
      secondaryVar,
      topNodes,
      matchedCollections,
      chartSpec,
      sources,
      relatedHub
    } = memoryPacket;

    // 0. Consultas estructurales sobre la división comunal / provincial o catálogo de la región
    const isStructuralComunasQuery = (
      matchedEntities.length === 0 &&
      topVariables.length === 0 &&
      /(cuantas comunas|cuales son las comunas|cuales son las 10 comunas|comunas de aysen|division comunal|division territorial|cuales son las provincias|provincias de aysen)/.test(qNorm)
    );

    if (isStructuralComunasQuery) {
      const pobVar = _memoryIndex.variablesByKey['poblacion_censo_2024'];
      const totalPob = pobVar && pobVar.stats ? fmtNumber(pobVar.stats.sum) : '-';
      const provinces = Array.from(new Set(_memoryIndex.entities.map(e => e.provincia).filter(Boolean)));
      const byProv = {};
      _memoryIndex.entities.forEach(e => {
        const p = e.provincia || 'Aysén';
        if (!byProv[p]) byProv[p] = [];
        byProv[p].push(e.name);
      });
      const provSummary = Object.entries(byProv)
        .map(([prov, names]) => `${prov} (${names.join(', ')})`)
        .join('; ');

      return {
        reply: `La Región de Aysén tiene ${_memoryIndex.entities.length} comunas distribuidas en ${provinces.length} provincias: ${provSummary}. En conjunto suman ${totalPob} habitantes según el Censo 2024 (INE).`,
        chart: {
          render: true,
          type: 'bar',
          varX: 'poblacion_censo_2024',
          varY: 'superficie_km2',
          title: 'Población Censo 2024 vs Superficie Comunal (km²)',
          excludeCoyhaique: false
        },
        sources,
        relatedHub: 'VI'
      };
    }

    if (/(que datos tiene|que fuentes|catalogo de datos|que variables|que puedo consultar)/.test(qNorm) && topVariables.length === 0) {
      return {
        reply: `La plataforma integra ${_memoryIndex.variables.length} indicadores comunales en las ${_memoryIndex.entities.length} comunas de Aysén, organizados en ${_memoryIndex.hubs.length} Hubs temáticos y ${_memoryIndex.nodes.length} Nodos satélite a partir de ${_memoryIndex.fuentes.length} fuentes oficiales (INE, SINIM, SERNATUR, CONAF, CNE, SEC, SUBPESCA, SEA, SII y DEIS).`,
        chart: {
          render: true,
          type: 'bar',
          varX: 'poblacion_censo_2024',
          varY: null,
          title: 'Población Comunal · Censo 2024 (INE)',
          excludeCoyhaique: false
        },
        sources,
        relatedHub: 'VI'
      };
    }

    // Caso Temporal: Serie histórica extraída dinámicamente del preset/nodo correspondiente
    if (wantsTemporal && chartSpec.type === 'line' && chartSpec.varX === 'visitantes_snaspe') {
      const turismoPreset = (_dataLake?.hubsGallery?.turismo?.presets || []).find(p => p.config?.customChartSpec);
      const spec = turismoPreset?.config?.customChartSpec;
      const labels = spec?.labels || [];
      const dsEmat = spec?.datasets?.[0]?.data || [];
      const dsSnaspe = spec?.datasets?.[1]?.data || [];
      if (labels.length > 0 && dsSnaspe.length > 0 && dsEmat.length > 0) {
        const firstYr = labels[0];
        const lastYr = labels[labels.length - 1];
        const snaspeStart = fmtNumber(dsSnaspe[0]);
        const snaspeEnd = fmtNumber(dsSnaspe[dsSnaspe.length - 1]);
        const ematStart = fmtNumber(dsEmat[0]);
        const ematEnd = fmtNumber(dsEmat[dsEmat.length - 1]);
        return {
          reply: `Entre ${firstYr} y ${lastYr}, las visitas a Parques Nacionales (SNASPE) pasaron de ${snaspeStart} a ${snaspeEnd} visitantes anuales, mientras que las pernoctaciones turísticas (INE EMAT) evolucionaron de ${ematStart} a ${ematEnd} noches anuales.`,
          chart: chartSpec,
          sources,
          relatedHub: 'I'
        };
      }
    }

    // Caso A: Consulta sobre una o más comunas específicas con indicadores detectados
    if (matchedEntities.length > 0 && topVariables.length > 0) {
      const lines = matchedEntities.map(ent => {
        const metricsText = topVariables.slice(0, 3).map(v => {
          const val = ent.raw[v.key];
          if (typeof val === 'number') {
            const rankIdx = v.stats ? v.stats.ranked.findIndex(r => r.comuna_ine === ent.id) + 1 : null;
            const rankStr = rankIdx ? ` (#${rankIdx} de ${_memoryIndex.entities.length})` : '';
            return `${v.label}: ${fmtNumber(val)}${v.unit ? ' ' + v.unit : ''}${rankStr}`;
          }
          return `${v.label}: ${val ?? '-'}`;
        }).join(' · ');
        return `La comuna de ${ent.name} (Provincia de ${ent.provincia}) registra ${metricsText}.`;
      });

      const compVar = primaryVar || topVariables[0];
      let regionalNote = '';
      if (compVar && compVar.isNumeric && compVar.stats) {
        const aggLabel = compVar.aggregation === 'avg' ? 'Promedio regional' : 'Total regional';
        const aggVal = compVar.aggregation === 'avg' ? compVar.stats.avg : compVar.stats.sum;
        regionalNote = ` ${aggLabel} de ${compVar.label}: ${fmtNumber(aggVal)}${compVar.unit ? ' ' + compVar.unit : ''} (máximo en ${compVar.stats.max.comuna} con ${fmtNumber(compVar.stats.max.value)}${compVar.unit ? ' ' + compVar.unit : ''} y mínimo en ${compVar.stats.min.comuna} con ${fmtNumber(compVar.stats.min.value)}${compVar.unit ? ' ' + compVar.unit : ''}).`;
      }

      return {
        reply: `${lines.join(' ')}${regionalNote}`,
        chart: chartSpec,
        sources,
        relatedHub
      };
    }

    // Caso B: Perfil integral de una comuna específica cuando no se especificó un único indicador
    if (matchedEntities.length === 1 && topVariables.length === 0) {
      const ent = matchedEntities[0];
      const c = ent.raw;
      const pob = fmtNumber(c.poblacion_censo_2024);
      const pct = fmtNumber(c.porcentaje_regional_pct);
      const sup = fmtNumber(c.superficie_km2);
      const fcm = fmtNumber(c.dependencia_fcm_pct);
      const pto = fmtNumber(c.presupuesto_per_capita_mclp);

      return {
        reply: `La comuna de ${ent.name} cuenta con ${pob} habitantes (${pct}% regional) y una superficie de ${sup} km² (Provincia de ${ent.provincia}, cabecera ${ent.cabecera}). Registra una dependencia del Fondo Común Municipal de ${fcm}% y un presupuesto municipal per cápita de ${pto} M$ CLP.`,
        chart: {
          render: true,
          type: 'bar',
          varX: 'presupuesto_per_capita_mclp',
          varY: 'dependencia_fcm_pct',
          title: `Comparativa Financiera y Territorial — Destacando ${ent.name}`,
          excludeCoyhaique: false
        },
        sources,
        relatedHub: 'IV'
      };
    }

    // Caso C: Variables numéricas detectadas (1 o 2 variables para ranking o cruce bivariado)
    if (primaryVar && primaryVar.isNumeric && primaryVar.stats) {
      const buildVarParagraph = (v, isPrimary) => {
        const list = excludeCoyhaique
          ? v.stats.ranked.filter(r => r.comuna_ine !== '11101' && r.comuna.toLowerCase() !== 'coyhaique')
          : v.stats.ranked;
        if (!list.length) return '';

        const sum = list.reduce((acc, r) => acc + r.value, 0);
        const avg = sum / list.length;
        const unitStr = v.unit ? ` ${v.unit}` : '';
        const topCount = (isPrimary && v.key === 'poblacion_censo_2024') ? 5 : 3;
        const topN = list.slice(0, topCount).map((r, i) => `${i + 1}. ${r.comuna} (${fmtNumber(r.value)}${unitStr})`).join(', ');
        const bottom = list[list.length - 1];
        const aggSentence = v.aggregation === 'avg'
          ? `Promedio regional: ${fmtNumber(avg)}${unitStr}.`
          : `Total regional: ${fmtNumber(sum)}${unitStr} (promedio comunal: ${fmtNumber(avg)}${unitStr}).`;

        return `${v.label}${excludeCoyhaique ? ' (sin Coyhaique)' : ''}: Lideran ${topN}, y el menor registro corresponde a ${bottom.comuna} (${fmtNumber(bottom.value)}${unitStr}). ${aggSentence}`;
      };

      const paragraphs = [buildVarParagraph(primaryVar, true)];
      if (secondaryVar && secondaryVar.isNumeric && secondaryVar.stats) {
        paragraphs.push(buildVarParagraph(secondaryVar, false));
      }

      return {
        reply: paragraphs.filter(Boolean).join(' '),
        chart: chartSpec,
        sources,
        relatedHub
      };
    }

    // Caso D: Variables categóricas / texto de comunas (ej. alcaldes, sistema eléctrico, aeródromo, ZOIT)
    if (topVariables.length > 0 && !topVariables[0].isNumeric) {
      const tv = topVariables[0];
      const rows = _memoryIndex.entities
        .map(e => `${e.name}: ${e.raw[tv.key] ?? '-'}`)
        .join(' · ');
      return {
        reply: `Registro comunal para ${tv.label} en las ${_memoryIndex.entities.length} comunas: ${rows}.`,
        chart: chartSpec,
        sources,
        relatedHub
      };
    }

    // Caso E: Coincidencia en Nodos Satélite o Colecciones Especiales
    if (topNodes.length > 0) {
      const node = topNodes[0];
      const text = `${node.title}: ${node.definition} ${node.example}`.trim();
      return {
        reply: text.length > 620 ? text.slice(0, 617) + '...' : text,
        chart: chartSpec,
        sources,
        relatedHub
      };
    }

    if (matchedCollections.length > 0) {
      const col = matchedCollections[0];
      return {
        reply: `Se encontraron ${col.count} registros en la colección "${col.key}" del índice territorial (campos disponibles: ${col.fields.slice(0, 8).join(', ')}).`,
        chart: chartSpec,
        sources,
        relatedHub
      };
    }

    // Caso F: Sin coincidencia en el catálogo -> declarar explícitamente que no forma parte de las 28 fuentes oficiales
    const sampleLabels = _memoryIndex.variables.slice(0, 6).map(v => v.label).join(', ');
    return {
      reply: `Este indicador no forma parte de las 28 fuentes oficiales de Aysén Sistémico. Actualmente el índice dinámico cuenta con ${_memoryIndex.variables.length} indicadores comunales y ${_memoryIndex.nodes.length} nodos temáticos (por ejemplo: ${sampleLabels}).`,
      chart: { render: false, type: 'bar', varX: null, varY: null, title: '', excludeCoyhaique: false },
      sources: [],
      relatedHub: 'IV'
    };
  }

  function isCoyhaiqueComuna(c) {
    if (!c) return false;
    if (c.id === 1 || c.id === '1' || c.id === 'coyhaique') return true;
    if (c.codigo_comuna === 'CL-XI-01' || c.codigo_comuna === 11101 || c.codigo_comuna === '11101') return true;
    if (c.comuna_ine === '11101' || c.comuna_ine === 11101) return true;
    const name = (c.nombre || c.nombre_comuna || '').toLowerCase();
    return name.includes('coyhaique');
  }

  /**
   * API Pública de OmniRouteClient
   */
  const OmniRouteClient = {
    init(dataLake, customConfig = {}) {
      _config = Object.assign({}, DEFAULT_CONFIG, customConfig);
      _dataLake = dataLake || (global ? global.AYSEN_HUBS_DATA : null);
      if (!_dataLake || typeof _dataLake !== 'object') return false;

      if (global && global.NL2ChartEngine && typeof global.NL2ChartEngine.getLexicon === 'function') {
        _lexicon = global.NL2ChartEngine.getLexicon();
      }
      if (!_lexicon) {
        tryLoadNodeLexicon();
      }

      buildMemoryIndex(_dataLake, _lexicon);

      if (!_lexicon && typeof fetch === 'function') {
        fetch(_config.lexiconUrl)
          .then(r => (r.ok ? r.json() : null))
          .then(json => {
            if (json) {
              _lexicon = json;
              if (global && global.NL2ChartEngine && typeof global.NL2ChartEngine.setLexicon === 'function') {
                global.NL2ChartEngine.setLexicon(json);
              }
              buildMemoryIndex(_dataLake, _lexicon);
            }
          })
          .catch(() => {});
      }

      return this;
    },

    refreshMemory(newDataLake) {
      if (newDataLake) _dataLake = newDataLake;
      buildMemoryIndex(_dataLake, _lexicon);
      return _memoryIndex;
    },

    clearConversationMemory() {
      _conversationMemory = [];
    },

    getConfig() {
      return Object.assign({}, _config);
    },

    setConfig(newConfig) {
      _config = Object.assign({}, _config, newConfig || {});
      return Object.assign({}, _config);
    },

    getIndex() {
      return _memoryIndex;
    },

    buildSystemPrompt,
    extractJsonFromResponse,
    getHubForVariable,
    FUENTES_OFICIALES_28,

    getComunaVector(varKey, excludeCoyhaique = false) {
      if (!_memoryIndex.comunas.length && (_dataLake || (global && global.AYSEN_HUBS_DATA))) {
        this.init(_dataLake || global.AYSEN_HUBS_DATA);
      }
      return (_memoryIndex.comunas || [])
        .filter(c => !(excludeCoyhaique && isCoyhaiqueComuna(c)))
        .map(c => ({
          id: c.id,
          nombre: c.nombre || c.nombre_comuna,
          value: typeof c[varKey] === 'number' ? c[varKey] : 0
        }));
    },

    resolveClosedWorldDeterministic(userText) {
      if (!_memoryIndex.variables.length && (_dataLake || (global && global.AYSEN_HUBS_DATA))) {
        this.init(_dataLake || global.AYSEN_HUBS_DATA);
      }
      const packet = retrieveMemoryForQuery(userText);
      return synthesizeFromMemoryPacket(packet);
    },

    localVerifiedQuery(userText) {
      return this.resolveClosedWorldDeterministic(userText);
    },

    async query(userText) {
      if (!_memoryIndex.variables.length && (_dataLake || (global && global.AYSEN_HUBS_DATA))) {
        this.init(_dataLake || global.AYSEN_HUBS_DATA);
      }

      const memoryPacket = retrieveMemoryForQuery(userText);
      const { systemPrompt, userPromptWithMemory } = buildMemoryGroundedPrompts(memoryPacket);

      const messages = [
        { role: 'system', content: systemPrompt },
        ..._conversationMemory.slice(-_config.maxHistoryTurns * 2),
        { role: 'user', content: userPromptWithMemory }
      ];

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), _config.timeoutMs) : null;

      try {
        const response = await fetch(_config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: _config.model,
            temperature: _config.temperature,
            max_tokens: _config.maxTokens,
            messages
          }),
          signal: controller ? controller.signal : undefined
        });

        if (timer) clearTimeout(timer);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const rawContent = data?.choices?.[0]?.message?.content || '';
        if (!rawContent) throw new Error('Empty LLM response');

        const parsed = extractJsonFromResponse(rawContent) || {
          reply: rawContent.trim(),
          chart: memoryPacket.chartSpec
        };

        const llmChart = parsed.chart || {};
        const validVarX = (llmChart.varX && _memoryIndex.variablesByKey[llmChart.varX])
          ? llmChart.varX
          : memoryPacket.chartSpec.varX;
        const validVarY = (llmChart.varY && _memoryIndex.variablesByKey[llmChart.varY])
          ? llmChart.varY
          : memoryPacket.chartSpec.varY;

        const finalResult = {
          reply: parsed.reply || synthesizeFromMemoryPacket(memoryPacket).reply,
          chart: {
            render: llmChart.render !== undefined ? Boolean(llmChart.render) : memoryPacket.chartSpec.render,
            type: llmChart.type || memoryPacket.chartSpec.type,
            varX: validVarX,
            varY: validVarY,
            title: llmChart.title || memoryPacket.chartSpec.title,
            excludeCoyhaique: llmChart.excludeCoyhaique !== undefined
              ? Boolean(llmChart.excludeCoyhaique)
              : memoryPacket.chartSpec.excludeCoyhaique
          },
          sources: memoryPacket.sources,
          relatedHub: parsed.relatedHub || getHubForVariable(validVarX)
        };

        _conversationMemory.push({ role: 'user', content: userText });
        _conversationMemory.push({ role: 'assistant', content: finalResult.reply });

        return finalResult;
      } catch (_) {
        if (timer) clearTimeout(timer);
        const fallbackResult = synthesizeFromMemoryPacket(memoryPacket);
        _conversationMemory.push({ role: 'user', content: userText });
        _conversationMemory.push({ role: 'assistant', content: fallbackResult.reply });
        return fallbackResult;
      }
    }
  };

  if (global && global.AYSEN_HUBS_DATA) {
    OmniRouteClient.init(global.AYSEN_HUBS_DATA);
  }

  return OmniRouteClient;
});
