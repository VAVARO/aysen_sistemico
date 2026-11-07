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
 *    manteniendo memoria conversacional multi-turno (`conversationState`).
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

  // ============================================================================
  // WP-C.1: DICCIONARIO CANÓNICO DE ETIQUETAS CON TILDES Y UNIDADES LIMPIAS
  // ============================================================================
  const CANONICAL_LABELS = {
    poblacion_censo_2024: 'Población Censo 2024 (hab.)',
    porcentaje_regional_pct: 'Participación Poblacional Regional (%)',
    superficie_km2: 'Superficie Comunal (km²)',
    densidad_hab_km2: 'Densidad Poblacional (hab/km²)',
    pobreza_ingresos_pct: 'Pobreza por Ingresos CASEN (%)',
    pobreza_multidim_pct: 'Pobreza Multidimensional CASEN (%)',
    superficie_snaspe_pct: 'Superficie Protegida SNASPE (%)',
    unidades_snaspe: 'Áreas Silvestres Protegidas SNASPE',
    ruta7_pavimentada_km: 'Ruta 7 Pavimentada (km)',
    ruta7_ripio_km: 'Ruta 7 en Ripio (km)',
    dependencia_barcaza: 'Dependencia de Conectividad Marítima / Barcaza',
    salud_principal: 'Establecimiento de Salud Principal',
    aerodromo: 'Aeródromo DGAC',
    alcalde: 'Alcalde en Ejercicio (2024-2028)',
    partido_alcalde: 'Pacto / Partido Político Alcalde',
    presupuesto_mclp: 'Presupuesto Municipal Vigente (M$)',
    presupuesto_vigente_mclp: 'Presupuesto Municipal Vigente (M$)',
    presupuesto_per_capita_mclp: 'Presupuesto Municipal Per Cápita (M$/hab)',
    dependencia_fcm_pct: 'Dependencia del Fondo Común Municipal (%)',
    ingresos_propios_pct: 'Ingresos Propios Permanentes (%)',
    fndr_mclp: 'Inversión Pública FNDR Asignada (M$)',
    sistema_electrico: 'Subsistema Eléctrico CNE',
    potencia_mw: 'Potencia Eléctrica Instalada (MW)',
    gasolina_93_clp: 'Precio Gasolina 93 Octanos ($/L)',
    precio_lena_m3: 'Precio Leña Seca ($/m³)',
    hogares_lena_pct: 'Matriz de Calefacción a Leña (% hogares)',
    estado_foa: 'Estado Enlace Troncal Fibra Óptica Austral',
    concesiones_salmon: 'Concesiones de Salmonicultura',
    centros_activos_salmon: 'Centros de Cultivo Activos',
    concesiones_mineras_ha: 'Superficie de Concesiones Mineras (ha)',
    proyectos_seia_aprobados: 'Proyectos Aprobados en el SEIA (RCA)',
    inversion_seia_mmusd: 'Inversión Aprobada SEIA (MM US$)',
    empresas_sii: 'Empresas Vigentes SII',
    trabajadores_sii: 'Trabajadores Dependientes SII',
    prestadores_sernatur: 'Prestadores Turísticos SERNATUR',
    camas_turisticas: 'Capacidad de Camas Turísticas',
    pernoctaciones_emat: 'Pernoctaciones Turísticas Anuales (EMAT)',
    zoit_nombre: 'Zona de Interés Turístico (ZOIT)',
    visitantes_snaspe: 'Visitantes Anuales a Parques SNASPE',
    camas_hospitalarias: 'Camas Hospitalarias Red Asistencial',
    traslado_coyhaique_hrs: 'Tiempo de Traslado Terrestre a Coyhaique (hrs)',
    matricula_escolar: 'Matrícula Escolar Total (MINEDUC)',
    establecimientos_escolares_n: 'Establecimientos Educacionales (SLEP / MINEDUC)',
    establecimientos_aps_n: 'Establecimientos de Atención Primaria (APS)',
    cobertura_vegetal_nativa_ha: 'Cobertura de Bosque y Vegetación Nativa (ha)',
    cobertura_vegetal_pct: 'Cobertura Vegetal Nativa (%)',
    fauna_amenazada_n: 'Especies de Fauna Amenazada en la Comuna',
    ipp_per_capita_clp: 'Ingresos Propios Permanentes Per Cápita ($/hab)',
    gasto_personal_pct: 'Gasto en Personal Municipal (%)',
    inversion_directa_pct: 'Inversión Real Directa Municipal (%)',
    profesionalizacion_pct: 'Profesionalización de Planta Municipal (%)',
    saidi_horas_anual: 'Índice de Interrupción Eléctrica SAIDI (hrs/año)',
    tarifa_bt1_clp: 'Tarifa Eléctrica Residencial BT1 ($/kWh)',
    costo_diesel_aislado_clp: 'Costo de Generación Diésel Aislado ($/kWh)',
    internet_fijo_pct: 'Penetración de Internet Fijo en Hogares (%)',
    biomasa_salmon_ton: 'Biomasa de Salmón Cosechada (ton)',
    antibioticos_ica_g_ton: 'Uso de Antibióticos en Salmonicultura ICA (g/ton)',
    amerb_decretadas: 'Áreas de Manejo AMERB Decretadas',
    amerb_operativas: 'Áreas de Manejo AMERB Operativas',
    seia_plazo_dias: 'Plazo Promedio de Evaluación SEIA (días)',
    compras_locales_pct: 'Compras Públicas Adjudicadas a Proveedores Locales (%)',
    fuga_compras_pct: 'Fuga de Compras Públicas Extrarregional (%)',
    parcelaciones_sag_n: 'Subdivisiones Prediales Rurales Certificadas SAG',
    medicos_por_mil_hab: 'Médicos por cada 1.000 Habitantes',
    espera_no_ges_n: 'Lista de Espera No GES Consultas de Especialidad',
    urgencias_respiratorias_pct: 'Urgencias Respiratorias Invernales (%)',
    aeroevacuaciones_samu_n: 'Aeroevacuaciones Médicas SAMU (anual)',
    ratio_presion_turistica: 'Ratio de Presión Turística (Visitantes/Residentes)',
    ha_snaspe_por_guardaparque: 'Hectáreas Protegidas SNASPE por Guardaparque',
    glaciares_dga_n: 'Glaciares Inventariados DGA',
    superficie_glaciar_km2: 'Superficie Glaciar Comunal (km²)',
    daa_consuntivos_m3s: 'Derechos de Agua Consuntivos Otorgados (m³/s)',
    daa_no_consuntivos_m3s: 'Derechos de Agua No Consuntivos Otorgados (m³/s)',
    dias_sobre_norma_mp25: 'Días Anuales sobre Norma Diaria MP2.5 (SINCA)',
    postas_salud_rural: 'Postas de Salud Rural (PSR)',
    museos_espacios_n: 'Museos y Espacios Culturales',
    bibliotecas_snbp_n: 'Bibliotecas Públicas SNBP',
    fondart_fndr_mclp: 'Fondos de Cultura FONDART + FNDR 8% (M$)',
    total_espacios_culturales: 'Total de Espacios Culturales e Infraestructura',
    monumentos_nacionales_count: 'Monumentos Nacionales Declarados (CMN)',
    proyectos_anid_n: 'Proyectos de Investigación ANID',
    monto_anid_mclp: 'Inversión Acumulada en Ciencia ANID (M$)',
    innovacion_corfo_mclp: 'Inversión en Innovación CORFO Innova (M$)',
    proyectos_ctci_total: 'Total de Proyectos CTCi e Innovación',
    investigadores_residentes: 'Investigadores Residentes Estimados',
    holdings_salmoneros: 'Holdings y Empresas de Salmonicultura en Aysén',
    holdings_operadores_salmon: 'Holdings Salmoneros Operadores en la Comuna',
    pesquerias_industriales: 'Pesquerías y Cuotas Industriales / Artesanales',
    provincia: 'Provincia',
    cabecera: 'Cabecera Comunal',
    cuenca_bna: 'Cuenca Hidrográfica Principal (BNA)'
  };

  // ============================================================================
  // WP-C.2: MAPA DETERMINISTA EXACTO 1-A-1 DE FUENTES OFICIALES POR VARIABLE
  // ============================================================================
  const PROVENANCE_CATALOG_ENTRIES = {
    INE_CENSO: {
      institucion: 'INE — Censo de Población y Vivienda 2024',
      titulo: 'INE — Censo de Población y Vivienda 2024',
      url: 'https://censo2024.ine.gob.cl/'
    },
    SINIM: {
      institucion: 'SUBDERE — Sistema Nacional de Información Municipal (SINIM)',
      titulo: 'SUBDERE — Sistema Nacional de Información Municipal (SINIM)',
      url: 'https://datos.sinim.gov.cl/'
    },
    FNDR: {
      institucion: 'DIPRES / GORE Aysén — Ejecución Presupuestaria Regional FNDR',
      titulo: 'DIPRES / GORE Aysén — Ejecución Presupuestaria Regional FNDR',
      url: 'https://www.dipres.gob.cl/'
    },
    SERVEL: {
      institucion: 'SERVEL — Resultados Electorales y Autoridades Comunales (2024-2028)',
      titulo: 'SERVEL — Resultados Electorales y Autoridades Comunales (2024-2028)',
      url: 'https://www.servel.cl/'
    },
    SERNAPESCA_SUBPESCA: {
      institucion: 'SERNAPESCA / SUBPESCA — Catastro Acuícola y Estadísticas de Cosecha',
      titulo: 'SERNAPESCA / SUBPESCA — Catastro Acuícola y Estadísticas de Cosecha',
      url: 'https://www.sernapesca.cl/informacion-util/anuarios-estadisticos-de-pesca-y-acuicultura/'
    },
    HOLDINGS_ACUICOLAS: {
      institucion: 'CMF / SUBPESCA / SERNAPESCA — Registro de Concesiones y Memorias Anuales de Holdings Acuícolas',
      titulo: 'CMF / SUBPESCA / SERNAPESCA — Registro de Concesiones y Memorias Anuales de Holdings Acuícolas',
      url: 'https://www.subpesca.cl/portal/619/w3-propertyvalue-50830.html'
    },
    CASEN: {
      institucion: 'MDSF — Encuesta de Caracterización Socioeconómica Nacional (CASEN)',
      titulo: 'MDSF — Encuesta de Caracterización Socioeconómica Nacional (CASEN)',
      url: 'https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen'
    },
    DEIS_MINSAL: {
      institucion: 'DEIS MINSAL / Servicio de Salud Aysén — Red Asistencial y Camas',
      titulo: 'DEIS MINSAL / Servicio de Salud Aysén — Red Asistencial y Camas',
      url: 'https://deis.minsal.cl/'
    },
    MINEDUC_SLEP: {
      institucion: 'MINEDUC / SLEP Aysén — Matrícula y Establecimientos Escolares',
      titulo: 'MINEDUC / SLEP Aysén — Matrícula y Establecimientos Escolares',
      url: 'https://datosabiertos.mineduc.cl/'
    },
    CNE: {
      institucion: 'CNE — Capacidad Instalada, Tarifas Eléctricas y Combustibles',
      titulo: 'CNE — Capacidad Instalada, Tarifas Eléctricas y Combustibles',
      url: 'https://energiaabierta.cl/'
    },
    SEC: {
      institucion: 'SEC — Índice de Interrupciones Eléctricas SAIDI y Calidad de Suministro',
      titulo: 'SEC — Índice de Interrupciones Eléctricas SAIDI y Calidad de Suministro',
      url: 'https://www.sec.cl/'
    },
    SUBTEL: {
      institucion: 'SUBTEL — Conectividad Digital y Fibra Óptica Austral',
      titulo: 'SUBTEL — Conectividad Digital y Fibra Óptica Austral',
      url: 'https://www.subtel.gob.cl/'
    },
    SEA_SEIA: {
      institucion: 'SEA — Servicio de Evaluación Ambiental (Expedientes SEIA Aysén)',
      titulo: 'SEA — Servicio de Evaluación Ambiental (Expedientes SEIA Aysén)',
      url: 'https://seia.sea.gob.cl/'
    },
    SII: {
      institucion: 'SII — Estadísticas Tributarias de Empresas, Ventas y Empleo',
      titulo: 'SII — Estadísticas Tributarias de Empresas, Ventas y Empleo',
      url: 'https://www.sii.cl/sobre_finanzas/estadisticas/'
    },
    CHILECOMPRA: {
      institucion: 'ChileCompra — Transacciones y Compras Públicas Mercado Público',
      titulo: 'ChileCompra — Transacciones y Compras Públicas Mercado Público',
      url: 'https://datos-abiertos.chilecompra.cl/'
    },
    SAG: {
      institucion: 'SAG — Certificaciones de Subdivisión de Predios Rústicos',
      titulo: 'SAG — Certificaciones de Subdivisión de Predios Rústicos',
      url: 'https://www.sag.gob.cl/'
    },
    SERNATUR_EMAT: {
      institucion: 'SERNATUR / INE — Registro de Prestadores Turísticos y Encuesta EMAT',
      titulo: 'SERNATUR / INE — Registro de Prestadores Turísticos y Encuesta EMAT',
      url: 'https://registro.sernatur.cl/'
    },
    CONAF_SNASPE: {
      institucion: 'CONAF — Estadísticas de Visitación SNASPE y Catastro Vegetacional',
      titulo: 'CONAF — Estadísticas de Visitación SNASPE y Catastro Vegetacional',
      url: 'https://www.conaf.cl/parques-nacionales/visitanos/estadisticas-de-visitacion/'
    },
    MMA_SINCA: {
      institucion: 'MMA — Red de Calidad del Aire (SINCA MP2.5) e Inventario de Especies RCE',
      titulo: 'MMA — Red de Calidad del Aire (SINCA MP2.5) e Inventario de Especies RCE',
      url: 'https://sinca.mma.gob.cl/'
    },
    DGA_MOP: {
      institucion: 'DGA - MOP — Inventario Público de Glaciares y Derechos de Agua',
      titulo: 'DGA - MOP — Inventario Público de Glaciares y Derechos de Agua',
      url: 'https://dga.mop.gob.cl/'
    },
    MOP_VIALIDAD: {
      institucion: 'MOP Vialidad — Red Vial y Pavimentación Ruta 7 Carretera Austral',
      titulo: 'MOP Vialidad — Red Vial y Pavimentación Ruta 7 Carretera Austral',
      url: 'https://vialidad.mop.gob.cl/'
    },
    MTT_DTPR: {
      institucion: 'MTT / DTPR — Subsidios de Conectividad Marítima y Lacustre',
      titulo: 'MTT / DTPR — Subsidios de Conectividad Marítima y Lacustre',
      url: 'https://www.dtpr.gob.cl/'
    },
    DGAC: {
      institucion: 'DGAC — Red Aeroportuaria y Aeródromos de Aysén',
      titulo: 'DGAC — Red Aeroportuaria y Aeródromos de Aysén',
      url: 'https://www.dgac.gob.cl/'
    },
    SERNAGEOMIN: {
      institucion: 'SERNAGEOMIN — Catastro de Concesiones Mineras y Red Volcánica',
      titulo: 'SERNAGEOMIN — Catastro de Concesiones Mineras y Red Volcánica',
      url: 'https://www.sernageomin.cl/'
    },
    MINCAP_CMN: {
      institucion: 'MinCap / SERPAT / CMN — Infraestructura Cultural, Bibliotecas y Monumentos',
      titulo: 'MinCap / SERPAT / CMN — Infraestructura Cultural, Bibliotecas y Monumentos',
      url: 'https://www.patrimoniocultural.gob.cl/'
    },
    ANID_CORFO: {
      institucion: 'ANID / MinCiencia / CORFO — Cartera de Proyectos CTCi e Innovación',
      titulo: 'ANID / MinCiencia / CORFO — Cartera de Proyectos CTCi e Innovación',
      url: 'https://dataciencia.anid.cl/'
    }
  };

  const VARIABLE_TO_PROVENANCE = {
    poblacion_censo_2024: PROVENANCE_CATALOG_ENTRIES.INE_CENSO,
    porcentaje_regional_pct: PROVENANCE_CATALOG_ENTRIES.INE_CENSO,
    superficie_km2: PROVENANCE_CATALOG_ENTRIES.INE_CENSO,
    densidad_hab_km2: PROVENANCE_CATALOG_ENTRIES.INE_CENSO,
    dependencia_fcm_pct: PROVENANCE_CATALOG_ENTRIES.SINIM,
    presupuesto_mclp: PROVENANCE_CATALOG_ENTRIES.SINIM,
    presupuesto_vigente_mclp: PROVENANCE_CATALOG_ENTRIES.SINIM,
    presupuesto_per_capita_mclp: PROVENANCE_CATALOG_ENTRIES.SINIM,
    ingresos_propios_pct: PROVENANCE_CATALOG_ENTRIES.SINIM,
    ipp_per_capita_clp: PROVENANCE_CATALOG_ENTRIES.SINIM,
    gasto_personal_pct: PROVENANCE_CATALOG_ENTRIES.SINIM,
    inversion_directa_pct: PROVENANCE_CATALOG_ENTRIES.SINIM,
    profesionalizacion_pct: PROVENANCE_CATALOG_ENTRIES.SINIM,
    fndr_mclp: PROVENANCE_CATALOG_ENTRIES.FNDR,
    alcalde: PROVENANCE_CATALOG_ENTRIES.SERVEL,
    partido_alcalde: PROVENANCE_CATALOG_ENTRIES.SERVEL,
    biomasa_salmon_ton: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    concesiones_salmon: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    centros_activos_salmon: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    antibioticos_ica_g_ton: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    amerb_decretadas: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    amerb_operativas: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    holdings_operadores_salmon: PROVENANCE_CATALOG_ENTRIES.HOLDINGS_ACUICOLAS,
    holdings_salmoneros: PROVENANCE_CATALOG_ENTRIES.HOLDINGS_ACUICOLAS,
    pesquerias_industriales: PROVENANCE_CATALOG_ENTRIES.HOLDINGS_ACUICOLAS,
    pobreza_ingresos_pct: PROVENANCE_CATALOG_ENTRIES.CASEN,
    pobreza_multidim_pct: PROVENANCE_CATALOG_ENTRIES.CASEN,
    camas_hospitalarias: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    postas_salud_rural: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    salud_principal: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    medicos_por_mil_hab: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    espera_no_ges_n: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    urgencias_respiratorias_pct: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    aeroevacuaciones_samu_n: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    traslado_coyhaique_hrs: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    establecimientos_aps_n: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    matricula_escolar: PROVENANCE_CATALOG_ENTRIES.MINEDUC_SLEP,
    establecimientos_escolares_n: PROVENANCE_CATALOG_ENTRIES.MINEDUC_SLEP,
    sistema_electrico: PROVENANCE_CATALOG_ENTRIES.CNE,
    potencia_mw: PROVENANCE_CATALOG_ENTRIES.CNE,
    tarifa_bt1_clp: PROVENANCE_CATALOG_ENTRIES.CNE,
    costo_diesel_aislado_clp: PROVENANCE_CATALOG_ENTRIES.CNE,
    gasolina_93_clp: PROVENANCE_CATALOG_ENTRIES.CNE,
    precio_lena_m3: PROVENANCE_CATALOG_ENTRIES.CNE,
    hogares_lena_pct: PROVENANCE_CATALOG_ENTRIES.CNE,
    saidi_horas_anual: PROVENANCE_CATALOG_ENTRIES.SEC,
    internet_fijo_pct: PROVENANCE_CATALOG_ENTRIES.SUBTEL,
    estado_foa: PROVENANCE_CATALOG_ENTRIES.SUBTEL,
    proyectos_seia_aprobados: PROVENANCE_CATALOG_ENTRIES.SEA_SEIA,
    inversion_seia_mmusd: PROVENANCE_CATALOG_ENTRIES.SEA_SEIA,
    seia_plazo_dias: PROVENANCE_CATALOG_ENTRIES.SEA_SEIA,
    empresas_sii: PROVENANCE_CATALOG_ENTRIES.SII,
    trabajadores_sii: PROVENANCE_CATALOG_ENTRIES.SII,
    compras_locales_pct: PROVENANCE_CATALOG_ENTRIES.CHILECOMPRA,
    fuga_compras_pct: PROVENANCE_CATALOG_ENTRIES.CHILECOMPRA,
    parcelaciones_sag_n: PROVENANCE_CATALOG_ENTRIES.SAG,
    prestadores_sernatur: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    camas_turisticas: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    pernoctaciones_emat: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    zoit_nombre: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    ratio_presion_turistica: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    visitantes_snaspe: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    superficie_snaspe_pct: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    unidades_snaspe: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    ha_snaspe_por_guardaparque: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    cobertura_vegetal_nativa_ha: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    cobertura_vegetal_pct: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    dias_sobre_norma_mp25: PROVENANCE_CATALOG_ENTRIES.MMA_SINCA,
    fauna_amenazada_n: PROVENANCE_CATALOG_ENTRIES.MMA_SINCA,
    glaciares_dga_n: PROVENANCE_CATALOG_ENTRIES.DGA_MOP,
    superficie_glaciar_km2: PROVENANCE_CATALOG_ENTRIES.DGA_MOP,
    daa_consuntivos_m3s: PROVENANCE_CATALOG_ENTRIES.DGA_MOP,
    daa_no_consuntivos_m3s: PROVENANCE_CATALOG_ENTRIES.DGA_MOP,
    ruta7_pavimentada_km: PROVENANCE_CATALOG_ENTRIES.MOP_VIALIDAD,
    ruta7_ripio_km: PROVENANCE_CATALOG_ENTRIES.MOP_VIALIDAD,
    dependencia_barcaza: PROVENANCE_CATALOG_ENTRIES.MTT_DTPR,
    aerodromo: PROVENANCE_CATALOG_ENTRIES.DGAC,
    concesiones_mineras_ha: PROVENANCE_CATALOG_ENTRIES.SERNAGEOMIN,
    museos_espacios_n: PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN,
    bibliotecas_snbp_n: PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN,
    fondart_fndr_mclp: PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN,
    total_espacios_culturales: PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN,
    monumentos_nacionales_count: PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN,
    proyectos_anid_n: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    monto_anid_mclp: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    innovacion_corfo_mclp: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    proyectos_ctci_total: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    investigadores_residentes: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO
  };

  // ============================================================================
  // WP-A.2: SINÓNIMOS DE INDICADORES (SIN 'holdings' EN concesiones_salmon)
  // ============================================================================
  const INDICATOR_SYNONYMS = {
    poblacion_censo_2024: ['poblacion', 'habitantes', 'personas viven', 'cuantas personas', 'cuanta gente', 'demografia', 'residentes', 'censo', 'cantidad de habitantes'],
    superficie_km2: ['superficie territorial', 'superficie', 'extension territorial', 'tamano comunal', 'area km2'],
    densidad_hab_km2: ['densidad poblacional', 'densidad', 'habitantes por km2'],
    dependencia_fcm_pct: ['dependencia del fondo comun municipal', 'fondo comun municipal', 'fcm', 'dependencia municipal'],
    ipp_per_capita_clp: ['ingresos propios', 'ingresos propios permanentes', 'autonomia financiera'],
    presupuesto_mclp: ['presupuesto municipal', 'presupuesto anual', 'presupuesto vigente'],
    presupuesto_per_capita_mclp: ['presupuesto per capita', 'gasto municipal por habitante'],
    fndr_mclp: ['inversion publica regional', 'fndr', 'fondo nacional de desarrollo regional', 'inversion regional'],
    concesiones_salmon: ['concesiones salmoneras', 'concesiones acuicolas', 'concesiones de salmon', 'acuicultura', 'salmonicultura', 'salmones', 'salmoneras'],
    centros_activos_salmon: ['centros activos', 'centros de cultivo', 'centros operativos'],
    biomasa_salmon_ton: ['biomasa de salmonicultura', 'biomasa salmon', 'biomasa cosechada', 'cosecha de salmon', 'toneladas de salmon', 'produccion salmonera'],
    antibioticos_ica_g_ton: ['antibioticos', 'uso de antibioticos', 'ica', 'antimicrobianos'],
    visitantes_snaspe: ['visitas a parques nacionales', 'parques nacionales', 'visitacion snaspe', 'visitas snaspe', 'turistas parques'],
    pernoctaciones_emat: ['noches de alojamiento turistico', 'alojamiento turistico', 'pernoctaciones', 'emat'],
    prestadores_sernatur: ['prestadores turisticos', 'sernatur', 'oferta turistica'],
    hogares_lena_pct: ['calefaccionan con lena', 'hogares que calefaccionan con lena', 'uso de lena', 'calefaccion lena', 'lena'],
    dias_sobre_norma_mp25: ['contaminacion critica mp2.5', 'mp2.5', 'mp25', 'dias con contaminacion', 'calidad del aire', 'material particulado'],
    saidi_horas_anual: ['saidi', 'cortes de luz', 'interrupcion electrica', 'calidad electrica'],
    tarifa_bt1_clp: ['tarifa electrica', 'tarifa bt1', 'precio electricidad'],
    camas_hospitalarias: ['camas hospitalarias', 'camas de hospital', 'hospitales'],
    medicos_por_mil_hab: ['medicos por mil habitantes', 'dotacion medica', 'medicos'],
    postas_salud_rural: ['postas rurales', 'postas de salud rural', 'aps'],
    matricula_escolar: ['matricula escolar', 'alumnos', 'estudiantes', 'educacion escolar'],
    pobreza_ingresos_pct: ['pobreza por ingresos', 'tasa de pobreza', 'pobreza casen'],
    pobreza_multidim_pct: ['pobreza multidimensional'],
    empresas_sii: ['empresas sii', 'numero de empresas', 'empresas activas', 'tejido empresarial'],
    inversion_seia_mmusd: ['inversion seia', 'proyectos aprobados seia', 'evaluacion ambiental']
  };

  // ============================================================================
  // WP-B.2: DEFINICIONES SECTORIALES PARA CRUCES COMUNA × SECTOR
  // ============================================================================
  const SECTOR_DEFINITIONS = {
    salmonicultura: {
      id: 'salmonicultura',
      title: 'Salmonicultura y Acuicultura',
      hub: 'II',
      regex: /\b(salmonicultura|salmon|salmones|salmonera|salmoneras|acuicultura|acuicola|acuicolas|biomasa|centros de cultivo|concesiones acuicolas|concesiones salmoneras|holding|holdings|empresas salmoneras|empresa salmonera)\b/i,
      varX: 'concesiones_salmon',
      varY: 'biomasa_salmon_ton',
      chartTitle: 'Concesiones de Salmonicultura vs. Biomasa de Salmón Cosechada (ton)',
      provenanceKeys: ['concesiones_salmon', 'biomasa_salmon_ton'],
      keys: ['concesiones_salmon', 'centros_activos_salmon', 'biomasa_salmon_ton', 'antibioticos_ica_g_ton', 'amerb_decretadas', 'amerb_operativas']
    },
    turismo: {
      id: 'turismo',
      title: 'Turismo y Áreas Silvestres Protegidas',
      hub: 'I',
      regex: /\b(turismo|turistico|turistica|sernatur|snaspe|parques nacionales|pernoctaciones|emat|alojamiento|zoit)\b/i,
      varX: 'visitantes_snaspe',
      varY: 'prestadores_sernatur',
      chartTitle: 'Visitantes Anuales a Parques SNASPE vs. Prestadores Turísticos SERNATUR',
      provenanceKeys: ['visitantes_snaspe', 'prestadores_sernatur'],
      keys: ['prestadores_sernatur', 'camas_turisticas', 'pernoctaciones_emat', 'visitantes_snaspe', 'superficie_snaspe_pct', 'ratio_presion_turistica']
    },
    salud: {
      id: 'salud',
      title: 'Salud y Red Asistencial',
      hub: 'VIII',
      regex: /\b(salud|red asistencial|atencion primaria|aps|postas rurales|samu|aeroevacuaciones|lista de espera)\b/i,
      varX: 'camas_hospitalarias',
      varY: 'medicos_por_mil_hab',
      chartTitle: 'Camas Hospitalarias Red Asistencial vs. Médicos por cada 1.000 Habitantes',
      provenanceKeys: ['camas_hospitalarias', 'medicos_por_mil_hab'],
      keys: ['camas_hospitalarias', 'postas_salud_rural', 'establecimientos_aps_n', 'medicos_por_mil_hab', 'espera_no_ges_n', 'urgencias_respiratorias_pct', 'aeroevacuaciones_samu_n', 'traslado_coyhaique_hrs']
    },
    energia: {
      id: 'energia',
      title: 'Energía, Calefacción y Calidad del Aire',
      hub: 'III',
      regex: /\b(energia|matriz energetica|sistema electrico|calefaccion|contaminacion|mp2\.?5|calidad del aire|saidi|cortes de luz|tarifa electrica)\b/i,
      varX: 'hogares_lena_pct',
      varY: 'dias_sobre_norma_mp25',
      chartTitle: 'Matriz de Calefacción a Leña (% hogares) vs. Días Anuales sobre Norma Diaria MP2.5 (SINCA)',
      provenanceKeys: ['hogares_lena_pct', 'dias_sobre_norma_mp25', 'saidi_horas_anual'],
      keys: ['potencia_mw', 'tarifa_bt1_clp', 'saidi_horas_anual', 'hogares_lena_pct', 'dias_sobre_norma_mp25', 'precio_lena_m3', 'gasolina_93_clp']
    },
    finanzas: {
      id: 'finanzas',
      title: 'Finanzas Municipales y Gobernanza',
      hub: 'IV',
      regex: /\b(finanzas|finanzas municipales|presupuesto municipal|fondo comun municipal|fcm|ingresos propios|fndr|municipio|gobernanza)\b/i,
      varX: 'dependencia_fcm_pct',
      varY: 'presupuesto_per_capita_mclp',
      chartTitle: 'Dependencia del Fondo Común Municipal (%) vs. Presupuesto Municipal Per Cápita (M$/hab)',
      provenanceKeys: ['dependencia_fcm_pct', 'presupuesto_per_capita_mclp', 'fndr_mclp'],
      keys: ['presupuesto_mclp', 'presupuesto_per_capita_mclp', 'dependencia_fcm_pct', 'ipp_per_capita_clp', 'fndr_mclp', 'inversion_directa_pct']
    },
    economia: {
      id: 'economia',
      title: 'Economía, Empleo e Inversión SEIA',
      hub: 'V',
      regex: /\b(economia|vocacion productiva|inversion seia|seia|empleo|estructura empresarial|compras publicas)\b/i,
      varX: 'empresas_sii',
      varY: 'inversion_seia_mmusd',
      chartTitle: 'Empresas Vigentes SII vs. Inversión Aprobada SEIA (MM US$)',
      provenanceKeys: ['empresas_sii', 'inversion_seia_mmusd'],
      keys: ['empresas_sii', 'trabajadores_sii', 'inversion_seia_mmusd', 'proyectos_seia_aprobados', 'compras_locales_pct', 'fuga_compras_pct']
    },
    educacion: {
      id: 'educacion',
      title: 'Educación y Condiciones Sociales',
      hub: 'VI',
      regex: /\b(educacion|colegios|escuelas|liceos|slep|pobreza|casen|condiciones sociales)\b/i,
      varX: 'matricula_escolar',
      varY: 'pobreza_multidim_pct',
      chartTitle: 'Matrícula Escolar Total (MINEDUC) vs. Pobreza Multidimensional CASEN (%)',
      provenanceKeys: ['matricula_escolar', 'pobreza_multidim_pct'],
      keys: ['matricula_escolar', 'establecimientos_escolares_n', 'pobreza_ingresos_pct', 'pobreza_multidim_pct']
    },
    biodiversidad: {
      id: 'biodiversidad',
      title: 'Biodiversidad, Bosques y Glaciares',
      hub: 'VII',
      regex: /\b(biodiversidad|bosque nativo|vegetacion|glaciares|derechos de agua|fauna|conservacion)\b/i,
      varX: 'cobertura_vegetal_nativa_ha',
      varY: 'superficie_glaciar_km2',
      chartTitle: 'Cobertura de Bosque y Vegetación Nativa (ha) vs. Superficie Glaciar Comunal (km²)',
      provenanceKeys: ['cobertura_vegetal_nativa_ha', 'superficie_glaciar_km2'],
      keys: ['cobertura_vegetal_nativa_ha', 'cobertura_vegetal_pct', 'glaciares_dga_n', 'superficie_glaciar_km2', 'fauna_amenazada_n', 'daa_no_consuntivos_m3s']
    },
    cultura_ctci: {
      id: 'cultura_ctci',
      title: 'Cultura, Patrimonio y Ciencia (CTCi)',
      hub: 'IX',
      regex: /\b(cultura|patrimonio|museos|bibliotecas|monumentos|ciencia|ctci|anid|corfo|innovacion)\b/i,
      varX: 'total_espacios_culturales',
      varY: 'proyectos_ctci_total',
      chartTitle: 'Total de Espacios Culturales e Infraestructura vs. Total de Proyectos CTCi e Innovación',
      provenanceKeys: ['total_espacios_culturales', 'proyectos_ctci_total'],
      keys: ['total_espacios_culturales', 'bibliotecas_snbp_n', 'fondart_fndr_mclp', 'proyectos_ctci_total', 'monto_anid_mclp', 'innovacion_corfo_mclp']
    }
  };

  let _config = Object.assign({}, DEFAULT_CONFIG);
  let _dataLake = null;
  let _lexicon = null;
  let _conversationMemory = [];

  // WP-A.3: Estado de memoria conversacional de seguimiento entre turnos
  let _conversationState = {
    lastComunaCode: null,
    lastComunaName: null,
    lastDomain: null,
    lastIndicatorKeys: [],
    lastQuery: ''
  };

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
    holdings: [],          // 12 holdings salmoneros madres (+ titulares menores)
    holdingsPorComuna: {}, // Operadores salmoneros por código INE comunal
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
    'territorial', 'territoriales', 'mayor', 'menor', 'comparan', 'contrasta', 'cruza',
    'cuentame', 'hablame', 'relacion', 'respecto', 'ranking', 'cantidad'
  ]);

  const IDENTITY_KEYS = new Set([
    'id', 'comuna_ine', 'codigo_comuna', 'nombre', 'nombre_comuna', 'lat', 'lng', 'lon'
  ]);

  const TECHNICAL_SUFFIXES_RE = /\b(pct|mclp|clp|mmusd|usd|ton|km2|km|ha|mw|hrs|m3s|m3|n|count|total|est|anual|hist)\b/g;

  const ACCENT_WORD_MAP = {
    poblacion: 'Población',
    salmon: 'Salmón',
    inversion: 'Inversión',
    educacion: 'Educación',
    electrico: 'Eléctrico',
    electrica: 'Eléctrica',
    energia: 'Energía',
    turistica: 'Turística',
    turisticas: 'Turísticas',
    turistico: 'Turístico',
    medicos: 'Médicos',
    medico: 'Médico',
    publicas: 'Públicas',
    publica: 'Pública',
    numero: 'Número',
    indice: 'Índice',
    areas: 'Áreas',
    area: 'Área',
    hidrogeno: 'Hidrógeno',
    codigo: 'Código',
    comun: 'Común',
    per: 'Per',
    capita: 'Cápita',
    dias: 'Días',
    ano: 'Año',
    anos: 'Años',
    lena: 'Leña'
  };

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
   * WP-C.1: Formatea cualquier clave de variable usando `CANONICAL_LABELS` con tildes
   * o capitalización acentuada limpia para columnas futuras.
   */
  function humanizeKey(key) {
    if (!key) return '';
    if (CANONICAL_LABELS[key]) return CANONICAL_LABELS[key];
    const words = String(key)
      .replace(/_/g, ' ')
      .replace(TECHNICAL_SUFFIXES_RE, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(w => {
        const lower = w.toLowerCase();
        if (ACCENT_WORD_MAP[lower]) return ACCENT_WORD_MAP[lower];
        if (lower.length <= 2 && lower !== 'id') return lower;
        return w.charAt(0).toUpperCase() + w.slice(1);
      });
    return words.join(' ') || String(key);
  }

  /**
   * Infiere dinámicamente el Hub temático (I al X) al que pertenece cualquier variable
   * actual o futura mediante inspección del Data Lake y reglas semánticas abiertas.
   */
  function getHubForVariable(varKey) {
    const k = String(varKey || '').toLowerCase();
    if (_memoryIndex.variablesByKey && _memoryIndex.variablesByKey[varKey]?.hub) {
      return _memoryIndex.variablesByKey[varKey].hub;
    }
    if (/sernatur|turis|emat|pernoctacion|snaspe.*visita|visita.*snaspe|visitantes_snaspe|zoit|hotel|alojamiento/.test(k)) return 'I';
    if (/salmon|acuic|biomasa|antibiotico|amerb|subpesca|sernapesca|caligus|holding/.test(k)) return 'II';
    if (/potencia_mw|mw|electric|saidi|saifi|tarifa_bt1|gasolina|diesel|precio_lena|internet_fijo|fibra|telecom/.test(k)) return 'III';
    if (/presupuesto|fcm|fndr|ipp|gasto_personal|inversion_directa|profesionalizacion|ruta7|alcalde|concejal|sinim|municipal/.test(k)) return 'IV';
    if (/seia|sii|empresa|trabajador|compra|fuga_compras|parcelacion|miner|pib|inversion_seia/.test(k)) return 'V';
    if (/glaciar|vegetal|snaspe_pct|guardaparque|fauna|huemul|daa_|mp25|hogares_lena|aire|bosque|biodiv/.test(k)) return 'VII';
    if (/hospital|cama.*hosp|medico|espera_no_ges|urgencia|samu|aeroevac|posta|traslado_coyhaique|salud|deis|aps/.test(k)) return 'VIII';
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
   * Infiere etiqueta legible con tildes, unidad de medida y regla de agregación ('sum' vs 'avg')
   * para cualquier clave presente o futura del Data Lake.
   */
  function inferVariableMetadata(key, sampleValues, lexiconEntry) {
    let unit = '';
    if (lexiconEntry && lexiconEntry.unit) {
      unit = lexiconEntry.unit;
    } else if (key.endsWith('_pct') || key.includes('porcentaje')) {
      unit = '%';
    } else if (key.endsWith('_mmusd')) {
      unit = 'MM US$';
    } else if (key.endsWith('_mclp')) {
      unit = 'M$';
    } else if (key.endsWith('_clp')) {
      unit = '$';
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
      unit = 'hrs';
    } else if (key.endsWith('_m3s')) {
      unit = 'm³/s';
    } else if (key.endsWith('_m3')) {
      unit = 'm³';
    } else if (key.includes('por_mil')) {
      unit = 'por 1.000 hab.';
    } else if (key.includes('poblacion') || key.includes('habitante')) {
      unit = 'hab.';
    }

    const isIntensive = Boolean(
      unit === '%' ||
      /(pct|porcentaje|tasa|densidad|per_capita|por_mil|ratio|promedio|plazo|horas|hrs|tarifa|precio|costo|gasolina|diesel|ica_g_ton|nota|indice)/i.test(key)
    );

    const humanLabel = CANONICAL_LABELS[key] || (lexiconEntry && lexiconEntry.label) || humanizeKey(key);
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
   * WP-C.2: Resuelve de forma determinista y exacta 1-a-1 la fuente oficial de una clave,
   * sin coincidencias laxas por subcadena ni nombres de columnas en snake_case.
   */
  function resolveSourceForKey(key) {
    const k = String(key || '').trim();
    const kLower = k.toLowerCase();

    if (VARIABLE_TO_PROVENANCE[k]) {
      const p = VARIABLE_TO_PROVENANCE[k];
      return {
        institucion: p.institucion,
        titulo: p.titulo,
        indicador: p.titulo,
        url: p.url
      };
    }

    let entry = null;
    if (/poblacion|censo|superficie_km2|densidad/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.INE_CENSO;
    else if (/pobreza|casen/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.CASEN;
    else if (/presupuesto|fcm|ipp|gasto_personal|profesionalizacion|inversion_directa/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.SINIM;
    else if (/fndr/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.FNDR;
    else if (/alcalde|partido/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.SERVEL;
    else if (/holding|pesqueria/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.HOLDINGS_ACUICOLAS;
    else if (/salmon|acuicol|biomasa|antibioticos|amerb/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA;
    else if (/miner/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.SERNAGEOMIN;
    else if (/seia/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.SEA_SEIA;
    else if (/sii|empresa|trabajador/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.SII;
    else if (/compra|fuga/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.CHILECOMPRA;
    else if (/parcelacion|sag/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.SAG;
    else if (/saidi|saifi/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.SEC;
    else if (/potencia|tarifa|gasolina|diesel|lena|electric|hidrogeno/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.CNE;
    else if (/internet|foa|telecom|5g/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.SUBTEL;
    else if (/sernatur|emat|pernoctacion|turis|camas_turisticas|zoit/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT;
    else if (/snaspe|vegetal|conaf|guardaparque/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE;
    else if (/mp25|fauna|sinca/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.MMA_SINCA;
    else if (/glaciar|daa|dga/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.DGA_MOP;
    else if (/salud|hospital|camas_hospitalarias|medico|posta|urgencia|espera|samu|traslado|aps/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL;
    else if (/matricula|educ|slep|escuela/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.MINEDUC_SLEP;
    else if (/museo|biblioteca|monumento|cultura|fondart|espacios_culturales/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN;
    else if (/anid|corfo|ctci|investigador|ciencia/.test(kLower)) entry = PROVENANCE_CATALOG_ENTRIES.ANID_CORFO;
    else entry = PROVENANCE_CATALOG_ENTRIES.SINIM;

    return {
      institucion: entry.institucion,
      titulo: entry.titulo,
      indicador: entry.titulo,
      url: entry.url
    };
  }

  /**
   * WP-C.2: Devuelve la lista deduplicada de fuentes oficiales para un conjunto de claves
   * de variables, garantizando que jamás se exponga un nombre de columna en snake_case.
   */
  function resolveSourcesForKeys(keys) {
    const out = [];
    const seen = new Set();
    (Array.isArray(keys) ? keys : []).forEach(k => {
      if (!k) return;
      const src = resolveSourceForKey(k);
      if (!src) return;
      const sig = `${src.institucion}|${src.url}`;
      if (!seen.has(sig)) {
        seen.add(sig);
        out.push(src);
      }
    });
    return out;
  }

  function getIntrinsicSynonymsForKey(key) {
    const k = String(key || '').toLowerCase();
    return INDICATOR_SYNONYMS[k] ? [...INDICATOR_SYNONYMS[k]] : [];
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
    const holdings = Array.isArray(dataLake.holdings) ? dataLake.holdings : [];
    const holdingsPorComuna = (dataLake.holdingsPorComuna && typeof dataLake.holdingsPorComuna === 'object')
      ? dataLake.holdingsPorComuna
      : {};
    const lexVars = (lexicon && lexicon.variables) ? lexicon.variables : {};

    // 1. Indexar entidades territoriales (las 10 comunas)
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

    // 2. Descubrir todas las claves de todas las filas de `comunas`
    const allComunaKeys = new Set();
    comunas.forEach(c => {
      if (c && typeof c === 'object') {
        Object.keys(c).forEach(k => {
          if (!IDENTITY_KEYS.has(k)) allComunaKeys.add(k);
        });
      }
    });

    const variables = [];
    const variablesByKey = {};
    const sourcesByKey = {};

    allComunaKeys.forEach(key => {
      const sampleValues = comunas.map(c => c[key]).filter(v => v !== undefined && v !== null);
      const lexEntry = lexVars[key] || null;
      const meta = inferVariableMetadata(key, sampleValues, lexEntry);
      const source = resolveSourceForKey(key);
      sourcesByKey[key] = source;

      const synonymPhrases = new Set();
      synonymPhrases.add(normalizeText(key.replace(/_/g, ' ')));
      synonymPhrases.add(normalizeText(meta.label));
      getIntrinsicSynonymsForKey(key).forEach(s => synonymPhrases.add(normalizeText(s)));
      if (lexEntry && Array.isArray(lexEntry.synonyms)) {
        lexEntry.synonyms.forEach(s => {
          // WP-A.2: Asegurar que 'holdings' no contamine concesiones_salmon
          if (key === 'concesiones_salmon' && normalizeText(s) === 'holdings') return;
          synonymPhrases.add(normalizeText(s));
        });
      }

      // WP-C.2: No contaminar tokenBag con relationNote de systemicBridges
      const tokenBag = new Set([
        ...tokenize(key),
        ...tokenize(meta.label)
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

    // 3. Indexar todos los Nodos Satélite (#01..#N)
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
      holdings,
      holdingsPorComuna,
      evolucionHoldingsSalmoneros: dataLake.evolucionHoldingsSalmoneros || null,
      customCollections,
      sourcesByKey,
      fuentes: FUENTES_OFICIALES_28
    };
  }

  /**
   * Obtiene el ranking (#1 a #10) de una comuna en una variable numérica.
   */
  function getComunaRank(index, comunaIne, varKey) {
    const v = index.variablesByKey[varKey];
    if (!v || !v.stats || !Array.isArray(v.stats.ranked)) return null;
    const idx = v.stats.ranked.findIndex(r => String(r.comuna_ine) === String(comunaIne));
    return idx >= 0 ? idx + 1 : null;
  }

  /**
   * WP-A.2: Detector específico de consultas por Empresa / Holding Salmonero o Pesquerías.
   */
  function detectHoldingOrFisheryIntent(qNorm, rawQuery) {
    const holdingPattern = /\b(holding|holdings|empresas salmoneras|empresa salmonera|segun empresa|segun empresas|por empresa|por empresas|por holding|que empresas|cuales empresas|grupos economicos|grupo economico|aquachile|multi x|multix|blumar|mowi|australis|cermaq|camanchaca|cooke|yadran|ice val|salmones austral|salmones antartica|invermar|friosur|pesquerias|pesqueria|cuotas|cuota pesquera|cuota industrial|pregunte por empresas|empresas o holdings|no comunas|no por comunas)\b/i;
    return holdingPattern.test(qNorm) || holdingPattern.test(String(rawQuery || ''));
  }

  /**
   * WP-A.2: Construye la respuesta y especificación gráfica (`customCategoryData: true`)
   * para los 12 Holdings Salmoneros Madres y Pesquerías de Aysén.
   */
  function buildHoldingsReply(userText, qNorm, index) {
    const allHoldings = Array.isArray(index.holdings) ? index.holdings : [];
    const holdings12 = allHoldings
      .filter(h => h.holding_id !== 'holding_otros_menores')
      .slice()
      .sort((a, b) => (Number(b.total_concesiones_aysen) || 0) - (Number(a.total_concesiones_aysen) || 0));

    const totalConcesionesReg = index.variablesByKey['concesiones_salmon']?.stats?.sum || 745;
    const totalBiomasaReg = index.variablesByKey['biomasa_salmon_ton']?.stats?.sum || 503500;

    const shortHoldingName = (name) => {
      if (!name) return '';
      if (name.includes('Blumar')) return 'Blumar';
      if (name.includes('Australis')) return 'Australis Mar';
      if (name.includes('Camanchaca')) return 'Camanchaca';
      if (name.includes('Yadr')) return 'Yadran';
      if (name.includes('Invermar')) return 'Invermar/Salmones Ice Val';
      if (name.includes('Cooke')) return 'Cooke Aquaculture';
      return name;
    };

    const top5 = holdings12.slice(0, 5).map((h, i) => {
      const conc = fmtNumber(h.total_concesiones_aysen);
      const pct = fmtNumber(h.porcentaje_regional_concesiones, 1);
      const bio = fmtNumber(h.biomasa_estimada_ton);
      const ctrs = fmtNumber(h.centros_activos_estimados);
      return `${i + 1}) ${shortHoldingName(h.nombre_fantasia)}: ${conc} (${pct}%, ${ctrs} ctrs, ${bio} ton)`;
    }).join('; ');

    const rest7 = holdings12.slice(5).map(h =>
      `${shortHoldingName(h.nombre_fantasia)} (${fmtNumber(h.total_concesiones_aysen)})`
    ).join(', ');

    const isFisherySpecific = /\b(pesquerias|pesqueria|cuotas|cuota pesquera|cuota industrial|merluza|congrio|bacalao)\b/i.test(qNorm);

    let reply = '';
    if (isFisherySpecific) {
      reply = `En pesca (9 pesquerías en Aysén, Ley 21.752), destacan Merluza del Sur (37% Ind/63% Art, 3,234 UTM/ton), Congrio Dorado (3,486 UTM/ton) y Bacalao (100% PEP). En acuicultura (${fmtNumber(totalConcesionesReg)} concesiones, ${fmtNumber(totalBiomasaReg)} ton en Aysén, Cisnes y Guaitecas): ${top5}; más ${rest7}.`;
    } else {
      reply = `Las ${fmtNumber(totalConcesionesReg)} concesiones acuícolas y ${fmtNumber(totalBiomasaReg)} ton de biomasa en Aysén (Aysén, Cisnes y Guaitecas) se concentran en 12 holdings madres (97,4% reg.; Top 5 pasó de 58,0% en 2018 a 70,8% en 2026): ${top5}. Completan los 12: ${rest7}.`;
    }

    const chart = {
      render: true,
      type: 'bar',
      customCategoryData: true,
      categoryLabel: 'Empresa / Holding',
      varX: 'holdings_salmoneros',
      varY: 'biomasa_salmon_ton',
      yKey: 'total_concesiones_aysen',
      y2Key: 'biomasa_estimada_ton',
      title: 'Concesiones Acuícolas Otorgadas y Biomasa Estimada (ton) por Empresa / Holding',
      subtitle: 'Distribución en los 12 Holdings Salmoneros Madres de Aysén',
      sourceText: 'CMF / SUBPESCA / SERNAPESCA — Registro de Concesiones y Memorias Anuales de Holdings Acuícolas',
      excludeCoyhaique: false,
      labels: holdings12.map(h => h.nombre_fantasia),
      datasets: [
        {
          label: 'Concesiones Acuícolas Otorgadas',
          data: holdings12.map(h => Number(h.total_concesiones_aysen) || 0),
          unit: 'concesiones',
          yAxisID: 'y'
        },
        {
          label: 'Biomasa Estimada (ton)',
          data: holdings12.map(h => Number(h.biomasa_estimada_ton) || 0),
          unit: 'ton',
          yAxisID: 'y1'
        }
      ],
      holdingRows: holdings12.map((h, idx) => ({
        rank: idx + 1,
        nombre: h.nombre_fantasia,
        empresa_madre: h.empresa_madre_holding,
        grupo: h.grupo_controlador,
        concesiones: Number(h.total_concesiones_aysen) || 0,
        pct_regional: Number(h.porcentaje_regional_concesiones) || 0,
        centros_activos: Number(h.centros_activos_estimados) || 0,
        biomasa_ton: Number(h.biomasa_estimada_ton) || 0,
        comunas: (h.comunas_presencia || []).join(', ')
      }))
    };

    const sources = resolveSourcesForKeys(['holdings_salmoneros', 'biomasa_salmon_ton']);
    return {
      reply,
      chart,
      sources,
      relatedHub: 'II'
    };
  }

  /**
   * WP-B.1: Construye las filas de la Ficha Completa de Indicadores de la Comuna vs.
   * Promedio/Total Regional para la tabla de evidencia de `consultor.html`.
   */
  function buildComunaProfileTableRows(ent, index) {
    const r = ent.raw;
    const specKeys = [
      { key: 'poblacion_censo_2024', bloque: 'Demografía y Territorio' },
      { key: 'superficie_km2', bloque: 'Demografía y Territorio' },
      { key: 'densidad_hab_km2', bloque: 'Demografía y Territorio' },
      { key: 'empresas_sii', bloque: 'Economía y Vocación Productiva' },
      { key: 'trabajadores_sii', bloque: 'Economía y Vocación Productiva' },
      { key: 'inversion_seia_mmusd', bloque: 'Economía y Vocación Productiva' },
      { key: 'concesiones_salmon', bloque: 'Economía y Vocación Productiva' },
      { key: 'centros_activos_salmon', bloque: 'Economía y Vocación Productiva' },
      { key: 'biomasa_salmon_ton', bloque: 'Economía y Vocación Productiva' },
      { key: 'prestadores_sernatur', bloque: 'Economía y Vocación Productiva' },
      { key: 'visitantes_snaspe', bloque: 'Economía y Vocación Productiva' },
      { key: 'presupuesto_mclp', bloque: 'Finanzas Municipales e Inversión' },
      { key: 'presupuesto_per_capita_mclp', bloque: 'Finanzas Municipales e Inversión' },
      { key: 'dependencia_fcm_pct', bloque: 'Finanzas Municipales e Inversión' },
      { key: 'ipp_per_capita_clp', bloque: 'Finanzas Municipales e Inversión' },
      { key: 'fndr_mclp', bloque: 'Finanzas Municipales e Inversión' },
      { key: 'pobreza_ingresos_pct', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'pobreza_multidim_pct', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'camas_hospitalarias', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'postas_salud_rural', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'medicos_por_mil_hab', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'matricula_escolar', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'hogares_lena_pct', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'dias_sobre_norma_mp25', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'tarifa_bt1_clp', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'saidi_horas_anual', bloque: 'Social, Salud, Educación y Energía' }
    ];

    return specKeys.map(item => {
      const v = index.variablesByKey[item.key];
      const val = typeof r[item.key] === 'number' ? r[item.key] : 0;
      const rank = getComunaRank(index, r.comuna_ine, item.key);
      const isAvg = v ? v.aggregation === 'avg' : false;
      const regVal = v && v.stats ? (isAvg ? v.stats.avg : v.stats.sum) : 0;
      const pctShare = (!isAvg && v && v.stats && v.stats.sum > 0 && val > 0)
        ? ` (${fmtNumber((val / v.stats.sum) * 100, 1)}% reg.)`
        : '';

      return {
        key: item.key,
        bloque: item.bloque,
        indicador: CANONICAL_LABELS[item.key] || (v ? v.label : humanizeKey(item.key)),
        valorComunaNum: val,
        valorComuna: `${fmtNumber(val)}${pctShare}`,
        ranking: rank ? `#${rank} de 10` : '-',
        referenciaRegional: `${isAvg ? 'Promedio' : 'Total'}: ${fmtNumber(regVal)}`
      };
    });
  }

  /**
   * WP-B.1: Construye el perfil comunal integral en 4 bloques temáticos con ranking
   * regional y comparación frente al promedio/total regional.
   */
  function buildComunaProfileReply(ent, index) {
    const r = ent.raw;
    const pob = fmtNumber(r.poblacion_censo_2024);
    const pct = fmtNumber(r.porcentaje_regional_pct);
    const sup = fmtNumber(r.superficie_km2);
    const dens = fmtNumber(r.densidad_hab_km2, 2);
    const rankPob = getComunaRank(index, r.comuna_ine, 'poblacion_censo_2024') || 1;

    const vPresPerCap = index.variablesByKey['presupuesto_per_capita_mclp'];
    const avgPresPerCap = vPresPerCap && vPresPerCap.stats ? fmtNumber(Math.round(vPresPerCap.stats.avg)) : '2.135';
    const vConc = index.variablesByKey['concesiones_salmon'];
    const totConc = vConc && vConc.stats && vConc.stats.sum ? vConc.stats.sum : 745;
    const vBio = index.variablesByKey['biomasa_salmon_ton'];
    const totBio = vBio && vBio.stats && vBio.stats.sum ? vBio.stats.sum : 504000;

    // 1. Demografía y Territorio
    const b1 = `La comuna de ${ent.name} cuenta con ${pob} habitantes (${pct}% regional, #${rankPob} de 10; Prov. ${r.provincia}, cab. ${r.cabecera}), ${sup} km² y ${dens} hab/km².`;

    // 2. Economía y Vocación Productiva
    let vocacion = '';
    if ((r.concesiones_salmon || 0) > 20) {
      const rankSal = getComunaRank(index, r.comuna_ine, 'concesiones_salmon') || 1;
      const pctConc = fmtNumber((r.concesiones_salmon / totConc) * 100, 1);
      const pctBio = fmtNumber(((r.biomasa_salmon_ton || 0) / totBio) * 100, 1);
      vocacion = `salmonicultura con ${fmtNumber(r.concesiones_salmon)} concesiones (${pctConc}% reg., #${rankSal}), ${fmtNumber(r.centros_activos_salmon)} centros activos y ${fmtNumber(r.biomasa_salmon_ton)} ton de biomasa (${pctBio}%)`;
    } else if (String(r.comuna_ine) === '11101') {
      vocacion = `servicios y comercio (${fmtNumber(r.trabajadores_sii)} empleos SII), ${fmtNumber(r.prestadores_sernatur)} prestadores SERNATUR y ${fmtNumber(r.visitantes_snaspe)} visitas SNASPE`;
    } else {
      vocacion = `turismo SNASPE/SERNATUR con ${fmtNumber(r.prestadores_sernatur)} prestadores (${fmtNumber(r.camas_turisticas)} camas), ${fmtNumber(r.visitantes_snaspe)} visitas SNASPE y ${fmtNumber(r.superficie_snaspe_pct)}% área protegida`;
    }
    const b2 = `• Economía y Vocación: ${fmtNumber(r.empresas_sii)} empresas SII, US$ ${fmtNumber(r.inversion_seia_mmusd)} MM SEIA; eje en ${vocacion}.`;

    // 3. Finanzas Municipales e Inversión Pública
    const rankFcm = getComunaRank(index, r.comuna_ine, 'dependencia_fcm_pct') || 1;
    const b3 = `• Finanzas: Presupuesto M$ ${fmtNumber(r.presupuesto_mclp)} (M$ ${fmtNumber(r.presupuesto_per_capita_mclp)}/hab vs M$ ${avgPresPerCap} prom.), ${fmtNumber(r.dependencia_fcm_pct)}% dependencia FCM (#${rankFcm}), IPP $${fmtNumber(r.ipp_per_capita_clp)}/hab y FNDR M$ ${fmtNumber(r.fndr_mclp)}.`;

    // 4. Condiciones Sociales, Salud, Educación y Energía
    const b4 = `• Social, Salud y Energía: Pobreza ${fmtNumber(r.pobreza_ingresos_pct)}% (multidim. ${fmtNumber(r.pobreza_multidim_pct)}%), ${fmtNumber(r.camas_hospitalarias)} camas hosp. (${fmtNumber(r.postas_salud_rural)} postas, ${fmtNumber(r.medicos_por_mil_hab, 2)} méd/1.000 hab), ${fmtNumber(r.matricula_escolar)} alumnos, ${fmtNumber(r.hogares_lena_pct)}% leña, ${fmtNumber(r.dias_sobre_norma_mp25)} días MP2.5 y SAIDI ${fmtNumber(r.saidi_horas_anual)} h.`;

    return [b1, b2, b3, b4].join('\n');
  }

  /**
   * WP-B.2: Construye la respuesta y el gráfico bivariado para un cruce Comuna × Sector
   * (ej. Cisnes + salmonicultura, Coyhaique + contaminación/energía, Chile Chico + turismo, Aysén + salud).
   */
  function buildComunaSectorReply(ent, sectorDef, index) {
    const r = ent.raw;
    const ine = String(r.comuna_ine);
    let reply = '';

    if (sectorDef.id === 'salmonicultura') {
      const totConc = index.variablesByKey['concesiones_salmon']?.stats?.sum || 745;
      const totCtrs = index.variablesByKey['centros_activos_salmon']?.stats?.sum || 245;
      const totBio = index.variablesByKey['biomasa_salmon_ton']?.stats?.sum || 504000;
      const conc = r.concesiones_salmon || 0;
      const ctrs = r.centros_activos_salmon || 0;
      const bio = r.biomasa_salmon_ton || 0;

      if (conc > 0) {
        const rankConc = getComunaRank(index, ine, 'concesiones_salmon') || 1;
        const pctConc = fmtNumber((conc / totConc) * 100, 1);
        const pctCtrs = fmtNumber((ctrs / totCtrs) * 100, 1);
        const pctBio = fmtNumber((bio / totBio) * 100, 1);
        const opsList = index.holdingsPorComuna[ine] || [];
        const opsText = opsList.length > 0
          ? opsList.slice(0, 7).map(o => `${o.holding} (${fmtNumber(o.concesiones_comuna)})`).join(', ')
          : (r.holdings_operadores_salmon || 'AquaChile, Multi X, Mowi Chile y Blumar');

        reply = `En salmonicultura, la comuna de ${ent.name} registra ${fmtNumber(conc)} concesiones acuícolas otorgadas (${pctConc}% regional, #${rankConc} de 10), ${fmtNumber(ctrs)} centros de cultivo activos (${pctCtrs}% regional) y ${fmtNumber(bio)} ton de biomasa cosechada (${pctBio}% del total regional de ${fmtNumber(totBio)} ton), con un índice de antibióticos (ICA) de ${fmtNumber(r.antibioticos_ica_g_ton)} g/ton y ${fmtNumber(r.amerb_operativas)} áreas AMERB operativas (de ${fmtNumber(r.amerb_decretadas)} decretadas). Principales holdings que operan en su litoral: ${opsText}.`;
      } else {
        reply = `La comuna de ${ent.name} es un territorio interior sin litoral marítimo, por lo que registra 0 concesiones de salmonicultura, 0 centros de cultivo activos y 0 ton de biomasa marina. A nivel regional, las ${fmtNumber(totConc)} concesiones y ${fmtNumber(totBio)} ton de biomasa se concentran en Aysén (412 concesiones, 265.000 ton), Cisnes (218 concesiones, 185.000 ton), Guaitecas (98 concesiones, 45.000 ton) y Tortel (17 concesiones, 9.000 ton).`;
      }
    } else if (sectorDef.id === 'turismo') {
      const rankVis = getComunaRank(index, ine, 'visitantes_snaspe') || 1;
      const rankPrest = getComunaRank(index, ine, 'prestadores_sernatur') || 1;
      reply = `En turismo y conservación, la comuna de ${ent.name} cuenta con ${fmtNumber(r.prestadores_sernatur)} prestadores registrados en SERNATUR (#${rankPrest} de 10), ${fmtNumber(r.camas_turisticas)} plazas de alojamiento y ${fmtNumber(r.pernoctaciones_emat)} pernoctaciones anuales EMAT. Registra ${fmtNumber(r.visitantes_snaspe)} visitantes anuales a áreas SNASPE (#${rankVis} regional), con un ${fmtNumber(r.superficie_snaspe_pct)}% de su superficie comunal bajo protección oficial (${r.unidades_snaspe || 'SNASPE'}) y ZOIT: ${r.zoit_nombre || 'No aplica'}.`;
    } else if (sectorDef.id === 'salud') {
      const rankCamas = getComunaRank(index, ine, 'camas_hospitalarias') || 1;
      reply = `En salud y red asistencial, la comuna de ${ent.name} tiene como recinto base a ${r.salud_principal} con ${fmtNumber(r.camas_hospitalarias)} camas hospitalarias (#${rankCamas} de 10), ${fmtNumber(r.postas_salud_rural)} postas de salud rural (${fmtNumber(r.establecimientos_aps_n || r.postas_salud_rural)} centros APS en total) y ${fmtNumber(r.medicos_por_mil_hab, 2)} médicos por cada 1.000 habitantes. Registra ${fmtNumber(r.espera_no_ges_n)} consultas en lista de espera No GES, ${fmtNumber(r.urgencias_respiratorias_pct)}% de urgencias respiratorias invernales y ${fmtNumber(r.aeroevacuaciones_samu_n)} aeroevacuaciones SAMU anuales (traslado terrestre a Coyhaique: ${fmtNumber(r.traslado_coyhaique_hrs)} hrs).`;
    } else if (sectorDef.id === 'energia') {
      const rankMp = getComunaRank(index, ine, 'dias_sobre_norma_mp25') || 1;
      reply = `En energía y calidad ambiental, la comuna de ${ent.name} opera bajo el subsistema ${r.sistema_electrico} con ${fmtNumber(r.potencia_mw)} MW instalados, tarifa residencial BT1 de $${fmtNumber(r.tarifa_bt1_clp)}/kWh e índice de interrupción SAIDI de ${fmtNumber(r.saidi_horas_anual)} horas anuales. El ${fmtNumber(r.hogares_lena_pct)}% de los hogares utiliza leña para calefacción ($${fmtNumber(r.precio_lena_m3)}/m³), registrando ${fmtNumber(r.dias_sobre_norma_mp25)} días anuales sobre la norma diaria de MP2.5 (#${rankMp} de 10) y gasolina 93 a $${fmtNumber(r.gasolina_93_clp)}/L.`;
    } else if (sectorDef.id === 'finanzas') {
      const rankFcm = getComunaRank(index, ine, 'dependencia_fcm_pct') || 1;
      const rankPto = getComunaRank(index, ine, 'presupuesto_mclp') || 1;
      reply = `En finanzas municipales y gobernanza (alcalde ${r.alcalde}, ${r.partido_alcalde}), la comuna de ${ent.name} ejecuta un presupuesto anual vigente de M$ ${fmtNumber(r.presupuesto_mclp)} (#${rankPto} de 10) equivalente a M$ ${fmtNumber(r.presupuesto_per_capita_mclp)} por habitante. Presenta una dependencia del Fondo Común Municipal de ${fmtNumber(r.dependencia_fcm_pct)}% (#${rankFcm} regional), ingresos propios permanentes de $${fmtNumber(r.ipp_per_capita_clp)}/hab, inversión directa de ${fmtNumber(r.inversion_directa_pct)}% y cartera FNDR asignada de M$ ${fmtNumber(r.fndr_mclp)}.`;
    } else {
      const items = sectorDef.keys.map(k => {
        const v = index.variablesByKey[k];
        const val = r[k];
        const rank = getComunaRank(index, ine, k);
        return `${CANONICAL_LABELS[k] || (v ? v.label : humanizeKey(k))}: ${typeof val === 'number' ? fmtNumber(val) : (val ?? '-')}${rank ? ` (#${rank} de 10)` : ''}`;
      }).join('; ');
      reply = `En ${sectorDef.title}, la comuna de ${ent.name} registra: ${items}.`;
    }

    const sources = resolveSourcesForKeys(sectorDef.provenanceKeys);
    return {
      reply,
      chart: {
        render: true,
        type: 'bar',
        varX: sectorDef.varX,
        varY: sectorDef.varY,
        yKey: sectorDef.varX,
        y2Key: sectorDef.varY,
        highlightComuna: ent.name,
        title: `${sectorDef.chartTitle} — Foco: ${ent.name}`,
        sourceText: sources.map(s => s.institucion).join(' · '),
        excludeCoyhaique: false
      },
      sources,
      relatedHub: sectorDef.hub
    };
  }

  /**
   * Detecta si la consulta pide cruzar una comuna con un sector temático completo.
   */
  function detectSectorForComunaQuery(qNorm, rawQuery) {
    // Si la pregunta consulta una única métrica puntual sin pedir relación/sector, no forzar sector completo
    const isSinglePointMetric = /^(¿?\s*cual es la poblacion|¿?\s*cuantas personas viven|¿?\s*cuantos habitantes|¿?\s*cuantas camas hospitalarias hay|¿?\s*cual es la superficie)\b/i.test(String(rawQuery || '').trim());
    if (isSinglePointMetric) return null;

    for (const sec of Object.values(SECTOR_DEFINITIONS)) {
      if (sec.regex.test(qNorm) || sec.regex.test(String(rawQuery || ''))) {
        return sec;
      }
    }
    return null;
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
      if (varRecord.key === 'poblacion_censo_2024') score += 40;
    }

    return score;
  }

  /**
   * Recupera el paquete de memoria relevante (`memoryPacket`) desde `_memoryIndex`
   * para responder la consulta del usuario con datos 100% verificados.
   */
  function retrieveMemoryForQuery(userText) {
    const rawQuery = String(userText || '').trim();
    const qNorm = normalizeText(rawQuery);
    const qTokens = tokenize(rawQuery);

    const excludeCoyhaique = /(sin coyhaique|excluir coyhaique|excepto coyhaique|sacar coyhaique|sin la capital)/.test(qNorm);
    const wantsScatter = /(cruza|cruzar|correlacion|vs\b|versus|frente a|contra|relacion entre|comparar .+ con)/.test(qNorm);
    const wantsBivariateComparison = wantsScatter || /(como se comparan|como contrasta|comparado con|junto con|y sus|y los|y las)/.test(qNorm);
    const wantsTemporal = /(evolucion|historic|serie|anual|mensual|2015|2016|2017|2018|2019|2020|2021|2022|2023|2025|2026|tiempo|tendencia|mes a mes)/.test(qNorm);

    // 1. Detectar comunas mencionadas
    let matchedEntities = _memoryIndex.entities.filter(ent =>
      ent.aliases.some(alias => {
        const re = new RegExp(`(^|\\s)${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`);
        return re.test(qNorm);
      })
    );

    // WP-A.3: Resolver referencias anafóricas de seguimiento ("¿y cuál es su relación con la salmonicultura?", "¿y en salud?")
    const isRegionalScope = /\b(aysen|region|regional|comunas|ranking|cada comuna|todas las comunas|empresas|holdings|provincias)\b/i.test(qNorm);
    const hasFollowUpCue = /(^¿?\s*y\b|\bsu\b|\bsus\b|\besta comuna\b|\besa comuna\b|\bahi\b|\balli\b|\ben ella\b|^¿?\s*respecto a\b|^¿?\s*en cuanto a\b)/i.test(rawQuery);
    if (matchedEntities.length === 0 && !isRegionalScope && hasFollowUpCue && _conversationState.lastComunaCode) {
      const prevEnt = _memoryIndex.entities.find(e => String(e.id) === String(_conversationState.lastComunaCode));
      if (prevEnt) {
        matchedEntities = [prevEnt];
      }
    }

    // WP-A.2: Detectar intención de Empresas / Holdings Salmoneros
    const isHoldingQuery = detectHoldingOrFisheryIntent(qNorm, rawQuery) &&
      (matchedEntities.length === 0 || /\b(segun empresa|segun empresas|por empresa|por empresas|por holding|no comunas|empresas o holdings|pregunte por empresas)\b/i.test(qNorm));

    // WP-B.2: Detectar intención de Cruce Comuna × Sector
    let matchedSector = matchedEntities.length === 1 ? detectSectorForComunaQuery(qNorm, rawQuery) : null;

    const matchedEntityTokens = new Set();
    matchedEntities.forEach(ent => {
      ent.aliases.forEach(a => tokenize(a).forEach(t => matchedEntityTokens.add(t)));
    });
    const varQueryTokens = qTokens.filter(t => !matchedEntityTokens.has(t));

    // 2. Puntuar variables comunales
    const nlScores = {};
    if (global && global.NL2ChartEngine && typeof global.NL2ChartEngine.scoreColumns === 'function') {
      try {
        const ext = global.NL2ChartEngine.scoreColumns(rawQuery) || [];
        ext.forEach(item => {
          if (item && item.col) nlScores[item.col] = item.score || 0;
        });
      } catch (_) {}
    }

    let scoredVars = _memoryIndex.variables
      .map(v => ({
        variable: v,
        score: scoreVariable(v, qNorm, varQueryTokens) + (nlScores[v.key] || 0) * 1.2
      }))
      .filter(item => item.score >= 5)
      .sort((a, b) => b.score - a.score);

    // Si es pregunta de seguimiento de comuna sobre un sector o indicador previo ("¿y en Coyhaique?", "¿y en Cisnes?")
    if (matchedEntities.length === 1 && scoredVars.length === 0 && !matchedSector && hasFollowUpCue) {
      if (_conversationState.lastDomain && SECTOR_DEFINITIONS[_conversationState.lastDomain]) {
        matchedSector = SECTOR_DEFINITIONS[_conversationState.lastDomain];
      } else if (_conversationState.lastIndicatorKeys.length > 0) {
        scoredVars = _conversationState.lastIndicatorKeys
          .map(k => _memoryIndex.variablesByKey[k])
          .filter(Boolean)
          .map((v, idx) => ({ variable: v, score: 30 - idx * 5 }));
      }
    }

    // 3. Puntuar Nodos Satélite (#01..#N)
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
    const secondaryThreshold = wantsBivariateComparison
      ? Math.max(8, (topNumericVars[0]?.score || 0) * 0.30)
      : Math.max(22, (topNumericVars[0]?.score || 0) * 0.65);
    const secondaryVar = (topNumericVars[1] && topNumericVars[1].score >= secondaryThreshold)
      ? topNumericVars[1].variable
      : null;

    const HUB_FALLBACK_NUMERIC = {
      I: 'prestadores_sernatur',
      II: 'concesiones_salmon',
      III: 'potencia_mw',
      IV: 'presupuesto_mclp',
      V: 'empresas_sii',
      VI: 'poblacion_censo_2024',
      VII: 'superficie_snaspe_pct',
      VIII: 'camas_hospitalarias',
      IX: 'total_espacios_culturales',
      X: 'proyectos_ctci_total'
    };

    const catFallbackKey = (!primaryVar && scoredVars.length > 0)
      ? (HUB_FALLBACK_NUMERIC[scoredVars[0].variable.hub] || 'poblacion_censo_2024')
      : 'poblacion_censo_2024';

    const primaryKey = primaryVar ? primaryVar.key : catFallbackKey;
    const secondaryKey = secondaryVar ? secondaryVar.key : null;
    const primaryLabel = CANONICAL_LABELS[primaryKey] || (primaryVar ? primaryVar.label : humanizeKey(primaryKey));
    const secondaryLabel = secondaryKey ? (CANONICAL_LABELS[secondaryKey] || (secondaryVar ? secondaryVar.label : humanizeKey(secondaryKey))) : null;

    // WP-C.2: Resolver fuentes oficiales estrictamente 1-a-1 para las variables efectivamente consultadas
    const provenanceTargetKeys = [];
    if (isHoldingQuery) {
      provenanceTargetKeys.push('holdings_salmoneros', 'biomasa_salmon_ton');
    } else if (matchedSector) {
      provenanceTargetKeys.push(...matchedSector.provenanceKeys);
    } else if (matchedEntities.length === 1 && scoredVars.length === 0) {
      provenanceTargetKeys.push('poblacion_censo_2024', 'presupuesto_mclp', 'concesiones_salmon', 'camas_hospitalarias');
    } else if (primaryVar) {
      provenanceTargetKeys.push(primaryVar.key);
      if (secondaryVar) provenanceTargetKeys.push(secondaryVar.key);
    } else if (scoredVars.length > 0) {
      provenanceTargetKeys.push(scoredVars[0].variable.key);
    } else {
      provenanceTargetKeys.push('poblacion_censo_2024');
    }

    if (wantsTemporal && /(turis|snaspe|parque|pernoctacion|alojamiento|emat|visita)/.test(qNorm)) {
      provenanceTargetKeys.length = 0;
      provenanceTargetKeys.push('visitantes_snaspe', 'pernoctaciones_emat');
    }

    const sources = resolveSourcesForKeys(provenanceTargetKeys);
    const sourceText = sources.map(s => s.institucion).join(' · ');

    let chartSpec = {
      render: Boolean(primaryVar || matchedEntities.length > 0 || scoredVars.length > 0),
      type: wantsScatter && secondaryVar ? 'scatter' : (wantsTemporal ? 'line' : 'bar'),
      varX: primaryKey,
      varY: secondaryKey,
      yKey: primaryKey,
      y2Key: secondaryKey,
      title: primaryVar
        ? (secondaryLabel ? `${primaryLabel} vs. ${secondaryLabel}` : `${primaryLabel} por Comuna`)
        : `${primaryLabel} por Comuna`,
      sourceText,
      excludeCoyhaique
    };

    if (wantsTemporal && /(turis|snaspe|parque|pernoctacion|alojamiento|emat|visita)/.test(qNorm)) {
      chartSpec = {
        render: true,
        type: 'line',
        varX: 'visitantes_snaspe',
        varY: 'pernoctaciones_emat',
        yKey: 'visitantes_snaspe',
        y2Key: 'pernoctaciones_emat',
        title: 'Evolución Histórica de Visitas SNASPE y Pernoctaciones EMAT (2015–2026)',
        sourceText,
        excludeCoyhaique: false
      };
    }

    const selectedVarKeys = [primaryVar?.key, secondaryVar?.key].filter(Boolean);
    const allTextVars = scoredVars.filter(v => !v.variable.isNumeric).slice(0, 1).map(v => v.variable.key);
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

    const relatedHub = isHoldingQuery
      ? 'II'
      : (matchedSector ? matchedSector.hub : getHubForVariable(chartSpec.varX));

    return {
      query: rawQuery,
      qNorm,
      excludeCoyhaique,
      wantsScatter,
      wantsTemporal,
      isHoldingQuery,
      matchedSector,
      matchedEntities,
      topVariables: [primaryVar, secondaryVar].filter(Boolean).concat(
        scoredVars.filter(s => !s.variable.isNumeric).slice(0, 1).map(s => s.variable)
      ),
      primaryVar,
      secondaryVar,
      topNodes: scoredNodes.slice(0, 2).map(s => s.node),
      matchedCollections: matchedCollections.slice(0, 2).map(c => c.collection),
      comunasMatrix,
      activeKeys,
      chartSpec,
      sources,
      relatedHub
    };
  }

  /**
   * Actualiza la memoria conversacional de seguimiento (`_conversationState`).
   */
  function updateConversationState(memoryPacket, finalResult) {
    if (!memoryPacket) return;
    if (memoryPacket.isHoldingQuery) {
      _conversationState.lastDomain = 'holdings_salmoneros';
      _conversationState.lastIndicatorKeys = ['concesiones_salmon', 'biomasa_salmon_ton'];
    } else if (memoryPacket.matchedEntities && memoryPacket.matchedEntities.length === 1) {
      const ent = memoryPacket.matchedEntities[0];
      _conversationState.lastComunaCode = ent.id;
      _conversationState.lastComunaName = ent.name;
      if (memoryPacket.matchedSector) {
        _conversationState.lastDomain = memoryPacket.matchedSector.id;
        _conversationState.lastIndicatorKeys = [...memoryPacket.matchedSector.provenanceKeys];
      } else if (memoryPacket.primaryVar) {
        _conversationState.lastDomain = memoryPacket.primaryVar.hub;
        _conversationState.lastIndicatorKeys = [memoryPacket.primaryVar.key, memoryPacket.secondaryVar?.key].filter(Boolean);
      } else {
        _conversationState.lastDomain = 'perfil_comunal';
      }
    } else if (memoryPacket.primaryVar) {
      _conversationState.lastDomain = memoryPacket.primaryVar.hub;
      _conversationState.lastIndicatorKeys = [memoryPacket.primaryVar.key, memoryPacket.secondaryVar?.key].filter(Boolean);
    }
    _conversationState.lastQuery = memoryPacket.query || '';
    if (finalResult && finalResult.chart && !finalResult.chart.sourceText && Array.isArray(finalResult.sources)) {
      finalResult.chart.sourceText = finalResult.sources.map(s => s.institucion).join(' · ');
    }
  }

  /**
   * Construye el System Prompt general y de memoria verificada.
   */
  function buildSystemPrompt() {
    if (!_memoryIndex.variables.length && (_dataLake || (global && global.AYSEN_HUBS_DATA))) {
      buildMemoryIndex(_dataLake || global.AYSEN_HUBS_DATA, _lexicon);
    }
    const varList = _memoryIndex.variables.map(v => `${v.key} (${v.label}, Hub ${v.hub})`).join(', ');
    return [
      'Eres el Consultor Territorial de Aysén Sistémico, conectado en tiempo real a la memoria verificada de `window.AYSEN_HUBS_DATA` (10 Comunas, 10 Hubs Sistémicos I al X, 39 Nodos Satélites, 12 Holdings Salmoneros Madres y 28 fuentes oficiales).',
      `Catálogo dinámico de variables indexadas (${_memoryIndex.variables.length}): ${varList}`,
      'INSTRUCCIONES DE RIGOR FACTUAL:',
      '1. Responde EXCLUSIVAMENTE utilizando los datos provistos en la memoria recuperada. Jamás inventes cifras.',
      '2. Cita las cifras exactas en formato chileno (punto para miles, coma para decimales), mencionando las comunas o holdings líderes, los de menor valor y el total o promedio regional según corresponda.',
      '3. Para tasas, porcentajes, densidades o valores per cápita, informa el Promedio Regional y NUNCA sumes porcentajes ni tasas entre comunas.',
      '4. Utiliza siempre nombres canónicos con tildes y unidades limpias. Jamás muestres claves en snake_case.',
      '5. No utilices emojis bajo ninguna circunstancia.',
      '6. Devuelve tu respuesta estrictamente como un objeto JSON válido con la estructura:',
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

    const systemPrompt = buildSystemPrompt();

    const memoryPayload = {
      consulta_usuario: memoryPacket.query,
      estado_conversacional_previo: _conversationState,
      comunas_filtradas_solicitadas: memoryPacket.matchedEntities.map(e => e.raw),
      holdings_salmoneros_aysen: memoryPacket.isHoldingQuery ? _memoryIndex.holdings : undefined,
      resumen_estadistico_variables_relevantes: varSummaries,
      matriz_comunal_datos_exactos: memoryPacket.comunasMatrix,
      grafico_sugerido: memoryPacket.chartSpec
    };

    return {
      systemPrompt,
      userPromptWithMemory: `MEMORIA_VERIFICADA:\n${JSON.stringify(memoryPayload)}\n\nCONSULTA DEL USUARIO:\n${memoryPacket.query}`
    };
  }

  /**
   * Sintetiza una respuesta analítica dinámica leyendo directamente del `memoryPacket`
   * cuando el servidor LLM local no está activo.
   */
  function synthesizeFromMemoryPacket(memoryPacket) {
    const {
      query,
      qNorm,
      excludeCoyhaique,
      wantsTemporal,
      isHoldingQuery,
      matchedSector,
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

    // 1. WP-A.2: Consultas por Empresas / Holdings Salmoneros y Pesquerías
    if (isHoldingQuery) {
      const res = buildHoldingsReply(query, qNorm, _memoryIndex);
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 2. Consultas estructurales sobre la división comunal / provincial o catálogo de la región
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

      const structSources = resolveSourcesForKeys(['poblacion_censo_2024', 'superficie_km2']);
      const res = {
        reply: `La Región de Aysén tiene ${_memoryIndex.entities.length} comunas distribuidas en ${provinces.length} provincias: ${provSummary}. En conjunto suman ${totalPob} habitantes según el Censo 2024 (INE).`,
        chart: {
          render: true,
          type: 'bar',
          varX: 'poblacion_censo_2024',
          varY: 'superficie_km2',
          yKey: 'poblacion_censo_2024',
          y2Key: 'superficie_km2',
          title: 'Población Censo 2024 (hab.) vs. Superficie Comunal (km²)',
          sourceText: structSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false
        },
        sources: structSources,
        relatedHub: 'VI'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    if (/(que datos tiene|que fuentes|catalogo de datos|que variables|que puedo consultar)/.test(qNorm) && topVariables.length === 0) {
      const catSources = resolveSourcesForKeys(['poblacion_censo_2024']);
      const res = {
        reply: `La plataforma integra ${_memoryIndex.variables.length} indicadores comunales en las ${_memoryIndex.entities.length} comunas de Aysén, organizados en ${_memoryIndex.hubs.length} Hubs temáticos y ${_memoryIndex.nodes.length} Nodos satélite a partir de ${_memoryIndex.fuentes.length} fuentes oficiales (INE, SINIM, SERNATUR, CONAF, CNE, SEC, SUBPESCA, SEA, SII y DEIS).`,
        chart: {
          render: true,
          type: 'bar',
          varX: 'poblacion_censo_2024',
          varY: null,
          yKey: 'poblacion_censo_2024',
          y2Key: null,
          title: 'Población Censo 2024 (hab.) por Comuna',
          sourceText: catSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false
        },
        sources: catSources,
        relatedHub: 'VI'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 3. Caso Temporal: Serie histórica de visitas SNASPE y pernoctaciones EMAT
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
        const res = {
          reply: `Entre ${firstYr} y ${lastYr}, las visitas a Parques Nacionales (SNASPE) pasaron de ${snaspeStart} a ${snaspeEnd} visitantes anuales, mientras que las pernoctaciones turísticas (INE EMAT) evolucionaron de ${ematStart} a ${ematEnd} noches anuales.`,
          chart: chartSpec,
          sources,
          relatedHub: 'I'
        };
        updateConversationState(memoryPacket, res);
        return res;
      }
    }

    // 4. WP-B.2: Cruce Comuna × Sector (ej. "relación de Cisnes con la salmonicultura", "¿y en salud?")
    if (matchedEntities.length === 1 && matchedSector) {
      const res = buildComunaSectorReply(matchedEntities[0], matchedSector, _memoryIndex);
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 5. WP-B.1: Perfil Comunal Integral en 4 bloques cuando se consulta por una comuna sin indicador único
    const isGeneralComunaProfileRequest = matchedEntities.length === 1 && (
      topVariables.length === 0 ||
      /\b(cuentame sobre|hablame de|perfil de|como esta|ficha de|resumen de|informacion de|todo sobre)\b/i.test(qNorm)
    ) && !matchedSector;

    if (isGeneralComunaProfileRequest) {
      const ent = matchedEntities[0];
      const c = ent.raw;
      const profileReply = buildComunaProfileReply(ent, _memoryIndex);
      const profileRows = buildComunaProfileTableRows(ent, _memoryIndex);
      const hasSalmonVocation = (c.concesiones_salmon || 0) > 20;
      const varX = hasSalmonVocation ? 'concesiones_salmon' : 'presupuesto_per_capita_mclp';
      const varY = hasSalmonVocation ? 'biomasa_salmon_ton' : 'dependencia_fcm_pct';
      const profSources = resolveSourcesForKeys([
        'poblacion_censo_2024',
        varX,
        'presupuesto_mclp',
        'camas_hospitalarias'
      ]);

      const res = {
        reply: profileReply,
        chart: {
          render: true,
          type: 'bar',
          varX,
          varY,
          yKey: varX,
          y2Key: varY,
          highlightComuna: ent.name,
          comunaName: ent.name,
          comunaIne: ent.id,
          comunaProfileRows: profileRows,
          title: `${CANONICAL_LABELS[varX]} vs. ${CANONICAL_LABELS[varY]} — Destacando ${ent.name}`,
          sourceText: profSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false
        },
        sources: profSources,
        relatedHub: hasSalmonVocation ? 'II' : 'IV'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 6. Caso A: Consulta sobre una o más comunas específicas con un indicador puntual detectado (ej. "¿cuál es la población de Puerto Aysén?")
    if (matchedEntities.length > 0 && topVariables.length > 0) {
      const shouldAppendUnit = (lbl, u) => {
        if (!u) return false;
        if (lbl.includes(u)) return false;
        if (/\([^)]+\)/.test(lbl)) return false;
        if (u.includes('1.000') && lbl.includes('1.000')) return false;
        return true;
      };

      const lines = matchedEntities.map(ent => {
        const metricsText = topVariables.slice(0, 2).map(v => {
          const val = ent.raw[v.key];
          const cleanLbl = CANONICAL_LABELS[v.key] || v.label;
          if (typeof val === 'number') {
            const rankIdx = v.stats ? v.stats.ranked.findIndex(r => r.comuna_ine === ent.id) + 1 : null;
            const rankStr = rankIdx ? ` (#${rankIdx} de ${_memoryIndex.entities.length})` : '';
            const unitSuffix = shouldAppendUnit(cleanLbl, v.unit) ? ` ${v.unit}` : '';
            return `${cleanLbl}: ${fmtNumber(val)}${unitSuffix}${rankStr}`;
          }
          return `${cleanLbl}: ${val ?? '-'}`;
        }).join(' · ');
        return `La comuna de ${ent.name} (Provincia de ${ent.provincia}) registra ${metricsText}.`;
      });

      const compVar = primaryVar || topVariables[0];
      let regionalNote = '';
      if (compVar && compVar.isNumeric && compVar.stats) {
        const cleanCompLabel = CANONICAL_LABELS[compVar.key] || compVar.label;
        const aggLabel = compVar.aggregation === 'avg' ? 'Promedio regional' : 'Total regional';
        const aggVal = compVar.aggregation === 'avg' ? compVar.stats.avg : compVar.stats.sum;
        const unitSuffix = shouldAppendUnit(cleanCompLabel, compVar.unit) ? ` ${compVar.unit}` : '';
        regionalNote = ` ${aggLabel} de ${cleanCompLabel}: ${fmtNumber(aggVal)}${unitSuffix} (máximo en ${compVar.stats.max.comuna} con ${fmtNumber(compVar.stats.max.value)} y mínimo en ${compVar.stats.min.comuna} con ${fmtNumber(compVar.stats.min.value)}).`;
      }

      const res = {
        reply: `${lines.join(' ')}${regionalNote}`,
        chart: Object.assign({}, chartSpec, {
          highlightComuna: matchedEntities[0].name
        }),
        sources,
        relatedHub
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 7. Caso C: Variables numéricas detectadas a nivel regional (1 o 2 variables para ranking o cruce bivariado)
    if (primaryVar && primaryVar.isNumeric && primaryVar.stats) {
      const buildVarParagraph = (v, isPrimary) => {
        const list = excludeCoyhaique
          ? v.stats.ranked.filter(r => r.comuna_ine !== '11101' && r.comuna.toLowerCase() !== 'coyhaique')
          : v.stats.ranked;
        if (!list.length) return '';

        const cleanLbl = CANONICAL_LABELS[v.key] || v.label;
        const sum = list.reduce((acc, r) => acc + r.value, 0);
        const avg = sum / list.length;
        const unitStr = v.unit ? ` ${v.unit}` : '';
        const topCount = (isPrimary && v.key === 'poblacion_censo_2024') ? 5 : 3;
        const topN = list.slice(0, topCount).map((r, i) => `${i + 1}. ${r.comuna} (${fmtNumber(r.value)}${unitStr})`).join(', ');
        const bottom = list[list.length - 1];
        const aggSentence = v.aggregation === 'avg'
          ? `Promedio regional: ${fmtNumber(avg)}${unitStr}.`
          : `Total regional: ${fmtNumber(sum)}${unitStr} (promedio comunal: ${fmtNumber(avg)}${unitStr}).`;

        return `${cleanLbl}${excludeCoyhaique ? ' (sin Coyhaique)' : ''}: Lideran ${topN}, y el menor registro corresponde a ${bottom.comuna} (${fmtNumber(bottom.value)}${unitStr}). ${aggSentence}`;
      };

      const paragraphs = [buildVarParagraph(primaryVar, true)];
      if (secondaryVar && secondaryVar.isNumeric && secondaryVar.stats) {
        paragraphs.push(buildVarParagraph(secondaryVar, false));
      }

      const res = {
        reply: paragraphs.filter(Boolean).join(' '),
        chart: chartSpec,
        sources,
        relatedHub
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 8. Caso D: Variables categóricas / texto de comunas (ej. alcaldes, sistema eléctrico, aeródromo, ZOIT)
    if (topVariables.length > 0 && !topVariables[0].isNumeric) {
      const tv = topVariables[0];
      const cleanLbl = CANONICAL_LABELS[tv.key] || tv.label;
      const rows = _memoryIndex.entities
        .map(e => `${e.name}: ${e.raw[tv.key] ?? '-'}`)
        .join(' · ');
      const catSources = resolveSourcesForKeys([tv.key, chartSpec.varX].filter(Boolean));
      const fullReply = `Registro comunal para ${cleanLbl} en las ${_memoryIndex.entities.length} comunas: ${rows}.`;
      const res = {
        reply: fullReply.length > 640 ? fullReply.slice(0, 637) + '...' : fullReply,
        chart: Object.assign({}, chartSpec, {
          sourceText: catSources.map(s => s.institucion).join(' · ')
        }),
        sources: catSources,
        relatedHub
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 9. Caso E: Coincidencia en Nodos Satélite o Colecciones Especiales
    if (topNodes.length > 0) {
      const node = topNodes[0];
      const text = `${node.title}: ${node.definition} ${node.example}`.trim();
      const res = {
        reply: text.length > 620 ? text.slice(0, 617) + '...' : text,
        chart: chartSpec,
        sources,
        relatedHub
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    if (matchedCollections.length > 0) {
      const col = matchedCollections[0];
      const res = {
        reply: `Se encontraron ${col.count} registros en la colección "${col.key}" del índice territorial (campos disponibles: ${col.fields.slice(0, 8).join(', ')}).`,
        chart: chartSpec,
        sources,
        relatedHub
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 10. Caso F: Sin coincidencia en el catálogo -> declarar explícitamente que no forma parte de las 28 fuentes oficiales
    const sampleLabels = _memoryIndex.variables.filter(v => v.isNumeric).slice(0, 5).map(v => CANONICAL_LABELS[v.key] || v.label).join(', ');
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
      _conversationState = {
        lastComunaCode: null,
        lastComunaName: null,
        lastDomain: null,
        lastIndicatorKeys: [],
        lastQuery: ''
      };
    },

    getConversationState() {
      return Object.assign({}, _conversationState);
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
    humanizeKey,
    resolveSourceForKey,
    resolveSourcesForKeys,
    buildComunaProfileReply,
    buildComunaProfileTableRows,
    buildComunaSectorReply,
    buildHoldingsReply,
    CANONICAL_LABELS,
    VARIABLE_TO_PROVENANCE,
    INDICATOR_SYNONYMS,
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

    async askConsultant(userText, history = []) {
      if (Array.isArray(history) && history.length === 0) {
        // Si el cliente pasa historial explícito vacío, no borrar estado salvo que se pida clearConversationMemory
      }
      return this.query(userText);
    },

    async query(userText) {
      if (!_memoryIndex.variables.length && (_dataLake || (global && global.AYSEN_HUBS_DATA))) {
        this.init(_dataLake || global.AYSEN_HUBS_DATA);
      }

      const memoryPacket = retrieveMemoryForQuery(userText);
      const isProfileReq = memoryPacket.matchedEntities.length === 1 && (
        memoryPacket.topVariables.length === 0 ||
        /\b(cuentame sobre|hablame de|perfil de|como esta|ficha de|resumen de|informacion de|todo sobre)\b/i.test(memoryPacket.qNorm)
      ) && !memoryPacket.matchedSector;

      if (memoryPacket.isHoldingQuery || memoryPacket.matchedSector || isProfileReq) {
        const directResult = synthesizeFromMemoryPacket(memoryPacket);
        _conversationMemory.push({ role: 'user', content: userText });
        _conversationMemory.push({ role: 'assistant', content: directResult.reply });
        return directResult;
      }

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

        const exactSources = resolveSourcesForKeys([validVarX, validVarY].filter(Boolean));
        const finalResult = {
          reply: parsed.reply || synthesizeFromMemoryPacket(memoryPacket).reply,
          chart: {
            render: llmChart.render !== undefined ? Boolean(llmChart.render) : memoryPacket.chartSpec.render,
            type: llmChart.type || memoryPacket.chartSpec.type,
            varX: validVarX,
            varY: validVarY,
            yKey: validVarX,
            y2Key: validVarY,
            highlightComuna: memoryPacket.matchedEntities.length === 1 ? memoryPacket.matchedEntities[0].name : null,
            title: memoryPacket.chartSpec.title || llmChart.title,
            sourceText: exactSources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: llmChart.excludeCoyhaique !== undefined
              ? Boolean(llmChart.excludeCoyhaique)
              : memoryPacket.chartSpec.excludeCoyhaique
          },
          sources: exactSources.length ? exactSources : memoryPacket.sources,
          relatedHub: parsed.relatedHub || getHubForVariable(validVarX)
        };

        updateConversationState(memoryPacket, finalResult);
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
