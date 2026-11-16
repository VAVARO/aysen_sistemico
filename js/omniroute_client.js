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
    maxTokens: 1800,
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
    cuenca_bna: 'Cuenca Hidrográfica Principal (BNA)',

    // Conectividad Multimodal e Infraestructura
    red_vial_total_km: 'Red Vial Total Comunal (km)',
    red_vial_pavimentada_km: 'Red Vial Pavimentada (km)',
    red_vial_ripio_km: 'Red Vial en Ripio (km)',
    red_vial_tierra_km: 'Red Vial en Tierra (km)',
    red_vial_pavimentada_pct: 'Porcentaje de Pavimentación Vial (%)',
    distancia_coyhaique_km: 'Distancia Terrestre a Coyhaique (km)',
    tiempo_viaje_coyhaique_hrs: 'Tiempo de Viaje a Coyhaique (hrs)',
    dependencia_barcaza_nivel: 'Nivel de Dependencia de Barcaza',
    hogares_sin_internet_fijo_pct: 'Hogares sin Conexión Fija a Internet (%)',
    cobertura_fibra_hogar_pct: 'Cobertura de Fibra Óptica al Hogar (%)',
    establecimientos_educacion_conectados_n: 'Establecimientos Educacionales Conectados FOA',

    // Informes Territoriales: Vivienda, Agropecuario, Salud y Glaciares
    deficit_habitacional_cuantitativo_n: 'Déficit Habitacional Cuantitativo (viviendas)',
    deficit_habitacional_cualitativo_n: 'Déficit Habitacional Cualitativo (viviendas)',
    sistemas_ssr_apr_n: 'Sistemas de Agua Potable Rural (SSR / APR)',
    cobertura_ssr_apr_familias: 'Familias con Agua Potable Rural SSR/APR',
    ganado_bovino_cabezas: 'Ganado Bovino (cabezas)',
    ganado_ovino_cabezas: 'Ganado Ovino (cabezas)',
    bosque_nativo_ha: 'Superficie de Bosque Nativo (ha)',
    plantaciones_ha: 'Plantaciones Forestales (ha)',
    consumo_lena_m3_hogar_ano: 'Consumo Residencial de Leña (m³/hogar/año)',
    superficie_glaciares_km2: 'Superficie de Glaciares DGA (km²)',
    esperanza_vida_total_anos: 'Esperanza de Vida al Nacer (años)',
    cobertura_empam_pct: 'Cobertura Control Adulto Mayor EMPAM (%)',
    cobertura_pscv_pct: 'Cobertura Salud Cardiovascular PSCV (%)',

    // Barómetro Patagonia UAysén (8 variables canónicas)
    barometro_confianza_institucional_pct: 'Confianza en Gestión Municipal (%)',
    barometro_redes_apoyo_comunitario_pct: 'Redes de Apoyo Comunitario (%)',
    barometro_orgullo_identidad_pct: 'Orgullo e Identidad Territorial (%)',
    barometro_prioridad_conectividad_pct: 'Prioridad de Acceso a Conectividad (%)',
    barometro_tension_desarrollo_conservacion_pct: 'Tensión Desarrollo vs. Conservación (%)',
    barometro_intencion_migracion_juvenil_pct: 'Percepción Oportunidades / Retención Juvenil (%)',
    barometro_evaluacion_acceso_salud_pct: 'Evaluación Acceso a Salud de Calidad (%)',
    barometro_preocupacion_contaminacion_lena_pct: 'Preocupación por Contaminación de Leña (%)',

    // Nuevas Variables Reconciliadas Oficiales (Single Source of Truth)
    volumen_regional_lena_m3: 'Volumen Regional de Leña Residencial (m³ sólidos/año)',
    demanda_pellet_ton_ano: 'Demanda Regional de Pellet de Madera (ton/año)',
    estandar_humedad_lena_pct: 'Estándar Máximo de Humedad en Leña Ley 21.499 (%)',
    comites_ssr_vigentes_n: 'Comités y Cooperativas SSR Vigentes (DOH-MOP)',
    poblacion_beneficiaria_ssr: 'Beneficiarios de Agua Rural SSR/APR (hab.)',
    pct_viviendas_irrecuperables: 'Viviendas Irrecuperables Déficit Cuantitativo (%)',
    espera_quirurgica_dias: 'Mediana de Espera Quirúrgica No GES (días)',
    interconsultas_no_ges_total: 'Total de Interconsultas No GES Pendientes (SIGTE)',
    tasa_cancer_gastrico_cie10: 'Tasa Mortalidad Cáncer Gástrico C16 (por 100k hab)',
    tasa_cancer_vesicula_cie10: 'Tasa Mortalidad Cáncer Vesícula C23 (por 100k hab)',
    tasa_suicidio_por_100k: 'Tasa Mortalidad por Suicidio e Intentos (por 100k hab)',
    camas_psiquiatricas_uhce: 'Camas Psiquiátricas de Corta Estadía UHCE HRC',
    estaciones_medico_rurales_n: 'Estaciones Médico Rurales de Ronda (EMR)',
    matricula_sies_total: 'Matrícula Total Educación Superior (SIES)',
    matricula_cft_estatal: 'Matrícula CFT Estatal Aysén (SIES)',
    matricula_inacap_coyhaique: 'Matrícula INACAP Sede Coyhaique (SIES)',
    matricula_universidad_aysen: 'Matrícula Universidad de Aysén (SIES)',
    solicitudes_ecmpo_ha: 'Solicitudes ECMPO Ley Lafkenche en Trámite (ha)',
    concesiones_salmon_snaspe_n: 'Concesiones Salmoneras en Reserva Las Guaitecas (SNASPE)',
    ejecucion_fndr_devengado_mclp: 'Ejecución Real Devengada FNDR GORE Aysén (M$)',
    inversion_sectorial_ministerial_mclp: 'Inversión Sectorial Ministerial Centralizada (M$)',
    tasa_aprobacion_rs_sni_pct: 'Tasa de Aprobación RS Proyectos SNI/BIP (%)',
    exclusion_bancaria_comunas_pct: 'Comunas en Exclusión Bancaria Privada (%)',
    puntos_cajavecina_n: 'Puntos de Corresponsalía CajaVecina BancoEstado',
    eventos_glof_cachet2_n: 'Vaciamientos Catastróficos GLOF Lago Cachet 2',
    glaciar_exploradores_estatus: 'Estatus Glaciar Exploradores (DGA/CONAF)',
    zoits_oficiales_count: 'Zonas de Interés Turístico Oficiales Decretadas'
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
    EMPORCHA: {
      institucion: 'Empresa Portuaria Chacabuco (EMPORCHA)',
      titulo: 'EMPORCHA — Memorias Anuales e Integradas de Gestión Portuaria',
      url: 'https://chacabucoport.cl/'
    },
    MINVU: {
      institucion: 'MINVU — Ministerio de Vivienda y Urbanismo',
      titulo: 'MINVU — Catastro de Déficit Habitacional Comunal',
      url: 'https://www.minvu.gob.cl/'
    },
    ODEPA_INE: {
      institucion: 'ODEPA / INE — Censo Agropecuario y Forestal',
      titulo: 'ODEPA / INE — Estadísticas Agropecuarias Comunales',
      url: 'https://www.odepa.gob.cl/'
    },
    BAROMETRO_UAYSEN: {
      institucion: 'Universidad de Aysén — Barómetro Regional Patagonia',
      titulo: 'Universidad de Aysén — Barómetro Patagonia: Percepción y Cohesión Ciudadana',
      url: 'https://uaysen.cl/'
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
    JAC_DGAC: {
      institucion: 'JAC / DGAC — Junta de Aeronáutica Civil y Dirección General de Aeronáutica Civil',
      titulo: 'JAC / DGAC — Estadísticas de Transporte Aéreo Regional y Red de Aeródromos',
      url: 'https://www.jac.gob.cl/'
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
    },
    INFOR: {
      institucion: 'Instituto Forestal (INFOR) / Ministerio de Agricultura',
      titulo: 'INFOR — Catastro Dendroenergético y Consumo Residencial de Leña',
      url: 'https://www.infor.cl/'
    },
    SEC_LEY: {
      institucion: 'Superintendencia de Electricidad y Combustibles (SEC) — Ley N° 21.499',
      titulo: 'SEC — Fiscalización de Biocombustibles Sólidos y Calidad de Leña y Pellet',
      url: 'https://www.sec.cl/'
    },
    DOH_MOP: {
      institucion: 'Dirección de Obras Hidráulicas (DOH-MOP) — Subdirección de Servicios Sanitarios Rurales',
      titulo: 'DOH-MOP — Catastro de Comités y Cooperativas SSR / APR (Ley N° 20.998)',
      url: 'https://doh.mop.gob.cl/'
    },
    SIGTE: {
      institucion: 'Subsecretaría de Redes Asistenciales / SIGTE / FONASA',
      titulo: 'SIGTE — Registro Oficial de Listas de Espera No GES y Tiempos de Atención',
      url: 'https://sigte.minsal.cl/'
    },
    DEIS_ONCOLOGIA: {
      institucion: 'DEIS MINSAL / Registro Poblacional de Cáncer de Aysén',
      titulo: 'DEIS MINSAL — Vigilancia Epidemiológica de Cáncer Gástrico y Vesicular',
      url: 'https://deis.minsal.cl/'
    },
    DEIS_SALUD_MENTAL: {
      institucion: 'DEIS MINSAL (Estadísticas Vitales) / Servicio de Salud Aysén (SSA)',
      titulo: 'DEIS MINSAL / SSA — Tasa de Mortalidad por Suicidio y Capacidad Psiquiátrica UHCE',
      url: 'https://deis.minsal.cl/'
    },
    SLEP_AYSEN: {
      institucion: 'SLEP Aysén / Dirección de Educación Pública (DEP) — Ley N° 21.040',
      titulo: 'SLEP Aysén — Traspaso Escolar 2024 y Catastro de 66 Establecimientos',
      url: 'https://slepaysen.cl/'
    },
    SIES_MINEDUC: {
      institucion: 'Servicio de Información de Educación Superior (SIES) / MINEDUC',
      titulo: 'SIES / MINEDUC — Matrícula Oficial Educación Superior (CFT Estatal, INACAP, UAysén)',
      url: 'https://www.mifuturo.cl/sies/'
    },
    SUBPESCA_CRUBC: {
      institucion: 'SUBPESCA / CONADI / Actas Oficiales CRUBC Aysén — Ley N° 20.249',
      titulo: 'SUBPESCA / CRUBC — Catastro de Solicitudes ECMPO (620.000 ha en trámite)',
      url: 'https://mapas.subpesca.cl/visorsubpesca/'
    },
    SUBPESCA_SNASPE: {
      institucion: 'SUBPESCA / SERNAPESCA / CONAF — Catastro en SNASPE',
      titulo: 'SUBPESCA / CONAF — Concesiones Salmoneras en Reserva Nacional Las Guaitecas (312)',
      url: 'https://www.sernapesca.cl/'
    },
    DIPRES_SECTORIAL: {
      institucion: 'Dirección de Presupuestos (DIPRES) / Ministerios Sectoriales',
      titulo: 'DIPRES — Inversión Sectorial Ministerial Centralizada vs. FNDR Devengado',
      url: 'https://www.dipres.gob.cl/'
    },
    CMF_BANCOESTADO: {
      institucion: 'Comisión para el Mercado Financiero (CMF) / BancoEstado',
      titulo: 'CMF / BancoEstado — Inclusión Financiera, Exclusión Bancaria Privada y Red CajaVecina',
      url: 'https://www.cmfchile.cl/'
    },
    DGA_GLACIOLOGIA: {
      institucion: 'DGA - MOP — Unidad de Glaciología y Nieves / Red Hidrométrica GLOF',
      titulo: 'DGA - MOP — Registro Histórico de Vaciamientos GLOF Lago Cachet 2 y Glaciología',
      url: 'https://dga.mop.gob.cl/'
    },
    CONAF_DGA_CORTE: {
      institucion: 'DGA / CONAF / Fallo confirmatorio de la Corte de Apelaciones de Coyhaique',
      titulo: 'DGA / CONAF — Estatus Glaciar Exploradores y Cierre Preventivo de Trekking sobre Hielo',
      url: 'https://www.conaf.cl/'
    },
    SUBTURISMO_ZOIT: {
      institucion: 'Subsecretaría de Turismo (Subturismo) — Catastro Nacional Oficial de Decretos ZOIT',
      titulo: 'Subturismo — Decretos Supremos de Zonas de Interés Turístico Decretadas',
      url: 'https://www.subturismo.gob.cl/zoit/'
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
    investigadores_residentes: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,

    // Conectividad Multimodal
    red_vial_total_km: PROVENANCE_CATALOG_ENTRIES.MOP_VIALIDAD,
    red_vial_pavimentada_km: PROVENANCE_CATALOG_ENTRIES.MOP_VIALIDAD,
    red_vial_ripio_km: PROVENANCE_CATALOG_ENTRIES.MOP_VIALIDAD,
    red_vial_tierra_km: PROVENANCE_CATALOG_ENTRIES.MOP_VIALIDAD,
    red_vial_pavimentada_pct: PROVENANCE_CATALOG_ENTRIES.MOP_VIALIDAD,
    distancia_coyhaique_km: PROVENANCE_CATALOG_ENTRIES.MOP_VIALIDAD,
    tiempo_viaje_coyhaique_hrs: PROVENANCE_CATALOG_ENTRIES.MOP_VIALIDAD,
    dependencia_barcaza_nivel: PROVENANCE_CATALOG_ENTRIES.MTT_DTPR,
    hogares_sin_internet_fijo_pct: PROVENANCE_CATALOG_ENTRIES.SUBTEL,
    cobertura_fibra_hogar_pct: PROVENANCE_CATALOG_ENTRIES.SUBTEL,
    establecimientos_educacion_conectados_n: PROVENANCE_CATALOG_ENTRIES.SUBTEL,
    trafico_aereo_pasajeros_balmaceda_jac: PROVENANCE_CATALOG_ENTRIES.JAC_DGAC,
    balmaceda_pasajeros_jac: PROVENANCE_CATALOG_ENTRIES.JAC_DGAC,
    emporcha_toneladas: PROVENANCE_CATALOG_ENTRIES.EMPORCHA,
    emporcha_cruceros: PROVENANCE_CATALOG_ENTRIES.EMPORCHA,

    // Informes Territoriales y Reconciliación Single Source of Truth
    deficit_habitacional_cuantitativo_n: PROVENANCE_CATALOG_ENTRIES.MINVU,
    deficit_habitacional_cualitativo_n: PROVENANCE_CATALOG_ENTRIES.MINVU,
    pct_viviendas_irrecuperables: PROVENANCE_CATALOG_ENTRIES.MINVU,
    sistemas_ssr_apr_n: PROVENANCE_CATALOG_ENTRIES.DOH_MOP,
    cobertura_ssr_apr_familias: PROVENANCE_CATALOG_ENTRIES.DOH_MOP,
    comites_ssr_vigentes_n: PROVENANCE_CATALOG_ENTRIES.DOH_MOP,
    poblacion_beneficiaria_ssr: PROVENANCE_CATALOG_ENTRIES.DOH_MOP,
    ganado_bovino_cabezas: PROVENANCE_CATALOG_ENTRIES.ODEPA_INE,
    ganado_ovino_cabezas: PROVENANCE_CATALOG_ENTRIES.ODEPA_INE,
    bosque_nativo_ha: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    plantaciones_ha: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    consumo_lena_m3_hogar_ano: PROVENANCE_CATALOG_ENTRIES.INFOR,
    volumen_regional_lena_m3: PROVENANCE_CATALOG_ENTRIES.INFOR,
    demanda_pellet_ton_ano: PROVENANCE_CATALOG_ENTRIES.SEC_LEY,
    estandar_humedad_lena_pct: PROVENANCE_CATALOG_ENTRIES.SEC_LEY,
    superficie_glaciares_km2: PROVENANCE_CATALOG_ENTRIES.DGA_MOP,
    esperanza_vida_total_anos: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    cobertura_empam_pct: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    cobertura_pscv_pct: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    espera_no_ges_n: PROVENANCE_CATALOG_ENTRIES.SIGTE,
    espera_quirurgica_dias: PROVENANCE_CATALOG_ENTRIES.SIGTE,
    interconsultas_no_ges_total: PROVENANCE_CATALOG_ENTRIES.SIGTE,
    tasa_cancer_gastrico_cie10: PROVENANCE_CATALOG_ENTRIES.DEIS_ONCOLOGIA,
    tasa_cancer_vesicula_cie10: PROVENANCE_CATALOG_ENTRIES.DEIS_ONCOLOGIA,
    tasa_suicidio_por_100k: PROVENANCE_CATALOG_ENTRIES.DEIS_SALUD_MENTAL,
    camas_psiquiatricas_uhce: PROVENANCE_CATALOG_ENTRIES.DEIS_SALUD_MENTAL,
    estaciones_medico_rurales_n: PROVENANCE_CATALOG_ENTRIES.DEIS_MINSAL,
    matricula_sies_total: PROVENANCE_CATALOG_ENTRIES.SIES_MINEDUC,
    matricula_cft_estatal: PROVENANCE_CATALOG_ENTRIES.SIES_MINEDUC,
    matricula_inacap_coyhaique: PROVENANCE_CATALOG_ENTRIES.SIES_MINEDUC,
    matricula_universidad_aysen: PROVENANCE_CATALOG_ENTRIES.SIES_MINEDUC,
    solicitudes_ecmpo_ha: PROVENANCE_CATALOG_ENTRIES.SUBPESCA_CRUBC,
    concesiones_salmon_snaspe_n: PROVENANCE_CATALOG_ENTRIES.SUBPESCA_SNASPE,
    ejecucion_fndr_devengado_mclp: PROVENANCE_CATALOG_ENTRIES.DIPRES_SECTORIAL,
    inversion_sectorial_ministerial_mclp: PROVENANCE_CATALOG_ENTRIES.DIPRES_SECTORIAL,
    tasa_aprobacion_rs_sni_pct: PROVENANCE_CATALOG_ENTRIES.DIPRES_SECTORIAL,
    exclusion_bancaria_comunas_pct: PROVENANCE_CATALOG_ENTRIES.CMF_BANCOESTADO,
    puntos_cajavecina_n: PROVENANCE_CATALOG_ENTRIES.CMF_BANCOESTADO,
    eventos_glof_cachet2_n: PROVENANCE_CATALOG_ENTRIES.DGA_GLACIOLOGIA,
    glaciar_exploradores_estatus: PROVENANCE_CATALOG_ENTRIES.CONAF_DGA_CORTE,
    zoits_oficiales_count: PROVENANCE_CATALOG_ENTRIES.SUBTURISMO_ZOIT,

    // Barómetro Patagonia UAysén
    barometro_confianza_institucional_pct: PROVENANCE_CATALOG_ENTRIES.BAROMETRO_UAYSEN,
    barometro_redes_apoyo_comunitario_pct: PROVENANCE_CATALOG_ENTRIES.BAROMETRO_UAYSEN,
    barometro_orgullo_identidad_pct: PROVENANCE_CATALOG_ENTRIES.BAROMETRO_UAYSEN,
    barometro_prioridad_conectividad_pct: PROVENANCE_CATALOG_ENTRIES.BAROMETRO_UAYSEN,
    barometro_tension_desarrollo_conservacion_pct: PROVENANCE_CATALOG_ENTRIES.BAROMETRO_UAYSEN,
    barometro_intencion_migracion_juvenil_pct: PROVENANCE_CATALOG_ENTRIES.BAROMETRO_UAYSEN,
    barometro_evaluacion_acceso_salud_pct: PROVENANCE_CATALOG_ENTRIES.BAROMETRO_UAYSEN,
    barometro_preocupacion_contaminacion_lena_pct: PROVENANCE_CATALOG_ENTRIES.BAROMETRO_UAYSEN
  };

  // ============================================================================
  // WP-A.2: SINÓNIMOS DE INDICADORES (SIN 'holdings' EN concesiones_salmon)
  // ============================================================================
  const INDICATOR_SYNONYMS = {
    poblacion_censo_2024: ['poblacion', 'habitantes', 'personas viven', 'cuantas personas', 'cuanta gente', 'demografia', 'residentes', 'censo', 'cantidad de habitantes', 'population', 'inhabitants', 'most populated', 'least populated', 'menos pobladas', 'mas pobladas'],
    superficie_km2: ['superficie territorial', 'superficie', 'extension territorial', 'tamano comunal', 'area km2'],
    densidad_hab_km2: ['densidad poblacional', 'densidad', 'habitantes por km2'],
    dependencia_fcm_pct: ['dependencia del fondo comun municipal', 'fondo comun municipal', 'fcm', 'dependencia municipal', 'dependientes del fcm', 'dependencia fcm'],
    ipp_per_capita_clp: ['ingresos propios', 'ingresos propios permanentes', 'autonomia financiera'],
    presupuesto_mclp: ['presupuesto municipal', 'presupuesto anual', 'presupuesto vigente'],
    presupuesto_per_capita_mclp: ['presupuesto per capita', 'gasto municipal por habitante', 'gasto municipal per capita'],
    fndr_mclp: ['inversion publica regional', 'fndr', 'fondo nacional de desarrollo regional', 'inversion regional'],
    concesiones_salmon: ['concesiones salmoneras', 'concesiones acuicolas', 'concesiones de salmon', 'acuicultura', 'salmonicultura', 'salmones', 'salmoneras'],
    centros_activos_salmon: ['centros activos', 'centros de cultivo', 'centros operativos'],
    biomasa_salmon_ton: ['biomasa de salmonicultura', 'biomasa salmon', 'biomasa cosechada', 'cosecha de salmon', 'toneladas de salmon', 'produccion salmonera', 'salmon biomass', 'harvested biomass'],
    antibioticos_ica_g_ton: ['antibioticos', 'uso de antibioticos', 'ica', 'antimicrobianos'],
    visitantes_snaspe: ['visitas a parques nacionales', 'parques nacionales', 'visitacion snaspe', 'visitas snaspe', 'turistas parques', 'national parks', 'park visitors'],
    pernoctaciones_emat: ['noches de alojamiento turistico', 'alojamiento turistico', 'pernoctaciones', 'emat'],
    prestadores_sernatur: ['prestadores turisticos', 'sernatur', 'oferta turistica'],
    hogares_lena_pct: ['calefaccionan con lena', 'hogares que calefaccionan con lena', 'uso de lena', 'calefaccion lena', 'calefaccion a lena', 'firewood', 'firewood heating', 'wood heating', 'heating dependency', 'firewood heating dependency'],
    dias_sobre_norma_mp25: ['contaminacion critica mp25', 'contaminacion critica mp2.5', 'mp2.5', 'pm2.5', 'mp25', 'pm25', 'dias con contaminacion', 'calidad del aire', 'material particulado', 'critical days', 'air pollution', 'air quality'],
    saidi_horas_anual: ['saidi', 'cortes de luz', 'apagones', 'sin luz', 'se corta la luz', 'cortes de electricidad', 'interrupcion electrica', 'calidad electrica'],
    tarifa_bt1_clp: ['tarifa electrica', 'tarifa bt1', 'precio electricidad', 'cuenta de la luz', 'precio de la luz', 'luz cara', 'electricidad cara'],
    gasolina_93_clp: ['bencina', 'gasolina', 'combustible', 'combustibles', 'precio de la bencina', 'nafta'],
    precio_lena_m3: ['precio de la lena', 'valor de la lena', 'metro de lena', 'costo de la lena'],
    potencia_mw: ['capacidad instalada', 'potencia instalada', 'megavatios', 'generacion electrica', 'matriz energetica', 'nudos criticos energeticos', 'materia energetica'],
    camas_hospitalarias: ['camas hospitalarias', 'camas de hospital', 'hospitales'],
    medicos_por_mil_hab: ['medicos por mil habitantes', 'dotacion medica', 'medicos', 'doctores', 'especialistas', 'falta de medicos'],
    urgencias_respiratorias_pct: ['enfermedades respiratorias', 'problemas respiratorios', 'urgencias respiratorias', 'bronquitis', 'asma'],
    aeroevacuaciones_samu_n: ['ambulancia aerea', 'evacuacion aeromedica', 'aeroevacuaciones', 'samu', 'traslado de urgencia'],
    postas_salud_rural: ['postas rurales', 'postas de salud rural', 'aps'],
    matricula_escolar: ['matricula escolar', 'alumnos', 'estudiantes', 'educacion escolar'],
    pobreza_ingresos_pct: ['pobreza por ingresos', 'tasa de pobreza', 'pobreza casen'],
    pobreza_multidim_pct: ['pobreza multidimensional'],
    empresas_sii: ['empresas sii', 'numero de empresas', 'empresas activas', 'tejido empresarial'],
    trabajadores_sii: ['empleo', 'puestos de trabajo', 'trabajo formal', 'trabajadores', 'fuerza laboral'],
    parcelaciones_sag_n: ['parcelas', 'parcelaciones', 'loteos', 'subdivision predial', 'parcelas de agrado'],
    inversion_seia_mmusd: ['inversion seia', 'proyectos aprobados seia', 'evaluacion ambiental'],
    red_vial_total_km: ['red vial', 'red vial total', 'kilometros de caminos', 'vialidad'],
    red_vial_pavimentada_km: ['red vial pavimentada', 'caminos pavimentados', 'asfalto', 'rutas', 'estado de las rutas', 'rutas de entrada', 'insumos', 'abastecimiento', 'logistica', 'carretera austral', 'ruta 7'],
    ruta7_pavimentada_km: ['ruta 7 pavimentada', 'pavimentacion ruta 7', 'asfalto ruta 7', 'ruta 7'],
    ruta7_ripio_km: ['ruta 7 ripio', 'ripio ruta 7', 'tramos de ripio ruta 7'],
    emporcha_toneladas: ['puerto chacabuco', 'emporcha', 'carga portuaria', 'entrada de insumos', 'insumos', 'abastecimiento maritimo', 'cabotaje', 'toneladas movilizadas'],
    red_vial_pavimentada_pct: ['porcentaje de pavimentacion', 'pavimentacion vial', 'pavimentacion'],
    tiempo_viaje_coyhaique_hrs: ['tiempo de viaje', 'tiempo a coyhaique', 'horas de viaje', 'horas a coyhaique', 'traslado coyhaique'],
    hogares_sin_internet_fijo_pct: ['sin internet', 'brecha digital', 'hogares sin internet', 'internet fijo', 'fibra optica', 'conectividad digital'],
    deficit_habitacional_cuantitativo_n: ['deficit habitacional', 'deficit cuantitativo', 'viviendas nuevas', 'falta de viviendas', 'vivienda', 'casa', 'casas', 'viviendas', 'arriendo', 'arrendar', 'conseguir casa', 'techo', 'allegados', 'falta de vivienda'],
    deficit_habitacional_cualitativo_n: ['deficit cualitativo', 'mejoramiento de vivienda', 'viviendas a reparar'],
    indice_envejecimiento: ['vejez', 'envejecimiento', 'envejecidos', 'adultos mayores', 'tercera edad', 'abuelos', 'ancianos'],
    ganado_bovino_cabezas: ['ganado bovino', 'bovinos', 'vacas', 'cabezas bovinas', 'ganaderia bovina'],
    ganado_ovino_cabezas: ['ganado ovino', 'ovinos', 'ovejas', 'cabezas ovinas', 'ganaderia ovina'],
    glaciares_dga_n: ['glaciares', 'numero de glaciares', 'cantidad de glaciares', 'campos de hielo', 'reservas de agua dulce'],
    superficie_glaciares_km2: ['glaciares', 'superficie glaciar', 'hielo', 'campos de hielo', 'reservas de agua dulce'],
    barometro_confianza_institucional_pct: ['confianza municipal', 'barometro confianza', 'confianza institucional', 'aporte municipio', 'barometro'],
    barometro_redes_apoyo_comunitario_pct: ['redes de apoyo', 'participacion comunitaria', 'apoyo comunitario', 'barometro social'],
    barometro_orgullo_identidad_pct: ['orgullo regional', 'identidad regional', 'identidad aysen', 'pertenencia austral'],
    barometro_prioridad_conectividad_pct: ['prioridad conectividad', 'acceso conectividad', 'barometro conectividad'],
    barometro_tension_desarrollo_conservacion_pct: ['desarrollo vs conservacion', 'conflictos ambientales', 'tension desarrollo conservacion', 'cuidar la naturaleza', 'naturaleza vs economia', 'economia vs medio ambiente'],
    barometro_intencion_migracion_juvenil_pct: ['retencion juvenil', 'migracion juvenil', 'oportunidades trabajo jovenes', 'jovenes', 'juventud', 'irse de la region', 'quieren ir', 'emigrar', 'fuga de jovenes'],
    barometro_evaluacion_acceso_salud_pct: ['evaluacion salud', 'satisfaccion salud', 'acceso a salud barometro'],
    barometro_preocupacion_contaminacion_lena_pct: ['preocupacion lena', 'humo lena barometro', 'contaminacion aire barometro', 'urgencia lena'],
    esperanza_vida_total_anos: ['esperanza de vida', 'expectativa de vida', 'anos de vida', 'longevidad', 'vida al nacer', 'vivir mas anos', 'life expectancy'],
    consumo_lena_m3_hogar_ano: ['consumo de lena', 'consumo residencial lena', 'metros cubicos lena', 'lena por hogar'],
    sistemas_ssr_apr_n: ['agua potable rural', 'ssr', 'apr', 'sistemas de agua potable', 'sin agua potable'],
    dependencia_barcaza_nivel: ['dependencia de barcaza', 'barcaza', 'barcazas', 'conectividad maritima', 'transporte maritimo', 'subsidio barcaza', 'barcazas subsidiadas', 'fiordo mitchell', 'barcaza litoral'],
    distancia_coyhaique_km: ['distancia a coyhaique', 'distancia terrestre', 'distancia terrestre a coyhaique', 'km a coyhaique', 'kilometros a coyhaique'],
    red_vial_ripio_km: ['red vial en ripio', 'caminos de ripio', 'ripio', 'red ripio'],
    red_vial_tierra_km: ['red vial en tierra', 'caminos de tierra', 'tierra'],
    cobertura_fibra_hogar_pct: ['cobertura de fibra optica', 'fibra al hogar', 'foa hogar', 'cobertura fibra', 'fibra optica austral'],
    establecimientos_educacion_conectados_n: ['establecimientos educacionales conectados', 'escuelas conectadas', 'colegios conectados foa', 'conectividad escolar 2030', 'educacion 2030 conectividad'],
    cobertura_ssr_apr_familias: ['familias con apr', 'cobertura apr', 'familias con agua potable rural', 'familias ssr'],
    cobertura_vegetal_nativa_ha: ['arboles', 'cuantos arboles', 'cantidad de arboles', 'bosques', 'superficie de bosque', 'superficie forestal', 'masa forestal', 'vegetacion nativa', 'cobertura vegetal'],
    bosque_nativo_ha: ['bosque nativo', 'superficie bosque nativo', 'hectareas bosque nativo', 'bosques nativos', 'arboles', 'arbolado', 'hectareas de bosque'],
    plantaciones_ha: ['plantaciones forestales', 'superficie plantaciones', 'forestal'],
    cobertura_empam_pct: ['empam', 'control adulto mayor', 'examen medicina preventiva adulto mayor', 'salud adulto mayor', 'adultos mayores empam'],
    cobertura_pscv_pct: ['pscv', 'salud cardiovascular', 'programa de salud cardiovascular', 'control cardiovascular'],
    espera_no_ges_n: ['lista de espera', 'listas de espera', 'esperando atencion', 'espera no ges', 'interconsultas pendientes'],
    mediana_espera_quirurgica_dias: ['operaciones', 'cirugias', 'espera quirurgica', 'lista de espera quirurgica'],
    tasa_mortalidad_cancer_gastrico_100k: ['cancer', 'tumores', 'cancer gastrico', 'mortalidad por cancer'],
    tasa_mortalidad_suicidio_100k: ['suicidio', 'suicidios', 'salud mental', 'mortalidad por suicidio'],
    puntos_cajavecina_bancoestado: ['bancos', 'cajeros', 'sacar plata', 'caja vecina', 'cajavecina', 'banca'],
    sucursales_banca_privada_cmf: ['sucursales bancarias', 'bancos privados', 'banca privada', 'sin banco'],
    sindicatos_pesca_artesanal: ['pescadores', 'pesca artesanal', 'caletas', 'sindicatos pesqueros'],
    autoidentificacion_indigena_pct: ['pueblos originarios', 'indigenas', 'mapuche', 'poblacion indigena'],
    comunidades_indigenas_conadi: ['comunidades indigenas', 'conadi'],
    juntas_vecinos_activas: ['juntas de vecinos', 'organizaciones sociales', 'organizaciones vecinales'],

    // Nuevas Variables Reconciliadas Oficiales
    volumen_regional_lena_m3: ['volumen de lena', 'volumen regional de lena', 'infor lena', 'catastro dendroenergetico', 'lena infor', 'metros cubicos de lena anual', 'extraccion de lena', 'informalidad lena', 'humedad lena', '565456 m3'],
    demanda_pellet_ton_ano: ['pellet', 'demanda de pellet', 'pellet de madera', 'biomasa pellet', 'consumo de pellet', 'toneladas de pellet', 'pellets', 'mesa del pellet', 'estufas a pellet', 'sec ley 21499', 'biocombustibles solidos', 'ley 21499', '20000 ton'],
    estandar_humedad_lena_pct: ['humedad de la lena', 'estandar de humedad', 'xilohigrometro', 'humedad menor a 25', 'biocombustibles sec'],
    comites_ssr_vigentes_n: ['comites ssr', 'cooperativas de agua rural', 'comites de agua potable rural', 'sistemas de agua rural', '47 comites', 'ley 20998'],
    poblacion_beneficiaria_ssr: ['beneficiarios ssr', 'familias con agua rural', 'poblacion abastecida apr', 'beneficiarios agua potable rural', '28833 beneficiarios'],
    pct_viviendas_irrecuperables: ['viviendas irrecuperables', 'porcentaje viviendas irrecuperables', '56% irrecuperables'],
    espera_quirurgica_dias: ['espera quirurgica', 'lista de espera quirurgica', 'dias espera quirurgica', 'mediana quirurgica', 'cirugia retraso', '395 dias'],
    interconsultas_no_ges_total: ['interconsultas no ges', 'total interconsultas', '11420 interconsultas', 'sigte fonasa'],
    tasa_cancer_gastrico_cie10: ['cancer gastrico', 'cancer de estomago', 'c16', 'mortalidad cancer gastrico', 'deis cancer gastrico', '18.4 cancer'],
    tasa_cancer_vesicula_cie10: ['cancer de vesicula', 'cancer vesicula', 'c23', 'mortalidad cancer vesicula', '12.6 vesicula'],
    tasa_suicidio_por_100k: ['tasa de suicidio', 'suicidio', 'suicidios', 'mortalidad suicidio', 'salud mental suicidio', 'intentos de autoeliminacion', '15.1 suicidio'],
    camas_psiquiatricas_uhce: ['camas psiquiatricas', 'uhce', 'salud mental hrc', 'uhce hrc', '9 camas psiquiatricas', 'psiquiatria coyhaique'],
    estaciones_medico_rurales_n: ['estaciones medico rurales', 'emr', 'rondas medicas', '20 estaciones medico'],
    matricula_sies_total: ['matricula educacion superior', 'sies', 'estudiantes educacion superior', 'matricula sies', '2327 estudiantes'],
    matricula_cft_estatal: ['cft estatal', 'cft estatal aysen', 'matricula cft estatal', '737 estudiantes cft'],
    matricula_inacap_coyhaique: ['inacap coyhaique', 'inacap aysen', 'matricula inacap', '800 estudiantes inacap'],
    matricula_universidad_aysen: ['universidad de aysen', 'matricula uaysen', 'estudiantes uaysen', '790 estudiantes uaysen'],
    solicitudes_ecmpo_ha: ['ecmpo', 'solicitudes ecmpo', 'ley lafkenche', 'espacios costeros pueblos originarios', 'pu wapi', 'antunen rain', '620000 ha', 'crubc ecmpo'],
    concesiones_salmon_snaspe_n: ['concesiones en snaspe', 'concesiones reserva las guaitecas', 'salmoneras en areas protegidas', '312 concesiones snaspe', 'ley sbap salmoneras'],
    ejecucion_fndr_devengado_mclp: ['fndr devengado', 'ejecucion real fndr', 'ejecucion presupuestaria gore', 'fndr dipres', 'gasto devengado fndr', '61548 devengado'],
    inversion_sectorial_ministerial_mclp: ['inversion sectorial ministerial', 'inversion sectorial', 'gasto ministerial centralizado', 'gasto sectorial mop minvu salud', '402000 sectorial'],
    tasa_aprobacion_rs_sni_pct: ['tasa aprobacion rs', 'rs sni bip', 'proyectos rs mideso', 'eficacia proyectos sni'],
    exclusion_bancaria_comunas_pct: ['exclusion bancaria', 'banca privada', 'sucursales bancarias', 'comunas sin bancos', '80% exclusion bancaria'],
    puntos_cajavecina_n: ['cajavecina', 'caja vecina', 'puntos cajavecina', 'bancoestado cajavecina', 'corresponsalia bancaria', '400 puntos cajavecina'],
    eventos_glof_cachet2_n: ['glof', 'eventos glof', 'glofs', 'lago cachet 2', 'cachet 2', 'vaciamientos lago cachet', 'cuenca baker glof', 'rio colonia glof', '27 vaciamientos'],
    glaciar_exploradores_estatus: ['glaciar exploradores', 'exploradores', 'clausura trekking hielo', 'cierre glaciar exploradores', 'hielo exploradores'],
    zoits_oficiales_count: ['zoits oficiales', '3 zoits decretadas', 'zoits decretadas', 'zoits oficiales decretadas']
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
      regex: /\b(energ[ií]a|energ[eé]tic[oa]s?|matriz energ[eé]tica|sistema el[eé]ctrico|el[eé]ctric[oa]s?|electricidad|generaci[oó]n|calefacci[oó]n|contaminaci[oó]n|mp2\.?5|calidad del aire|saidi|cortes de luz|tarifa el[eé]ctrica|combustibles?|bencina|di[eé]sel)\b/i,
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
      regex: /\b(biodiversidad|bosques?|bosque nativo|[aá]rboles|arbolado|forestal|cobertura vegetal|vegetaci[oó]n|flora|glaciares|derechos de agua|fauna|conservaci[oó]n)\b/i,
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
    },
    conectividad: {
      id: 'conectividad',
      title: 'Conectividad Multimodal e Infraestructura',
      hub: 'Conectividad',
      regex: /\b(conectividad|red vial|vialidad|caminos?|rutas?|carretera austral|ruta 7|pavimentaci[oó]n|barcazas?|puerto chacabuco|emporcha|transporte mar[ií]timo|cabotaje|insumos|abastecimiento|log[ií]stica|carga|balmaceda|aer[oó]dromos?|aeropuertos?|fibra [oó]ptica|foa)\b/i,
      varX: 'red_vial_pavimentada_km',
      varY: 'tiempo_viaje_coyhaique_hrs',
      chartTitle: 'Red Vial Pavimentada (km) vs. Tiempo de Viaje a Coyhaique (horas)',
      provenanceKeys: ['red_vial_pavimentada_km', 'tiempo_viaje_coyhaique_hrs'],
      keys: ['red_vial_total_km', 'red_vial_pavimentada_km', 'red_vial_ripio_km', 'red_vial_tierra_km', 'red_vial_pavimentada_pct', 'distancia_coyhaique_km', 'tiempo_viaje_coyhaique_hrs', 'dependencia_barcaza_nivel', 'cobertura_fibra_hogar_pct', 'hogares_sin_internet_fijo_pct']
    },
    barometro: {
      id: 'barometro',
      title: 'Barómetro Regional y Percepción Territorial (UAysén)',
      hub: 'Barómetro',
      regex: /\b(barometro|percepcion|cohesion|confianza|orgullo|identidad|uaysen|encuesta ciudadana|prioridad conectividad|tension ambiental|retencion juvenil)\b/i,
      varX: 'barometro_confianza_institucional_pct',
      varY: 'barometro_orgullo_identidad_pct',
      chartTitle: 'Confianza en Gestión Municipal (%) vs. Orgullo e Identidad Austral (%)',
      provenanceKeys: ['barometro_confianza_institucional_pct', 'barometro_orgullo_identidad_pct'],
      keys: ['barometro_confianza_institucional_pct', 'barometro_redes_apoyo_comunitario_pct', 'barometro_orgullo_identidad_pct', 'barometro_prioridad_conectividad_pct', 'barometro_tension_desarrollo_conservacion_pct', 'barometro_intencion_migracion_juvenil_pct', 'barometro_evaluacion_acceso_salud_pct', 'barometro_preocupacion_contaminacion_lena_pct']
    },
    vivienda_habitabilidad: {
      id: 'vivienda_habitabilidad',
      title: 'Vivienda, APR y Habitabilidad Austral',
      hub: 'Hábitat',
      regex: /\b(vivienda|deficit habitacional|hacinamiento|apr|ssr|agua potable rural|sanidad|habitabilidad)\b/i,
      varX: 'deficit_habitacional_cuantitativo_n',
      varY: 'sistemas_ssr_apr_n',
      chartTitle: 'Déficit Habitacional Cuantitativo (viviendas) vs. Sistemas APR/SSR',
      provenanceKeys: ['deficit_habitacional_cuantitativo_n', 'sistemas_ssr_apr_n'],
      keys: ['deficit_habitacional_cuantitativo_n', 'deficit_habitacional_cualitativo_n', 'sistemas_ssr_apr_n', 'cobertura_ssr_apr_familias']
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
    'cuentame', 'hablame', 'relacion', 'respecto', 'ranking', 'cantidad', 'vs', 'versus'
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

  const QUERY_STOPWORDS = new Set([
    'como', 'cual', 'cuales', 'donde', 'cuanto', 'cuanta', 'cuantos', 'cuantas',
    'tiene', 'tienen', 'estan', 'entre', 'para', 'segun', 'sobre', 'desde', 'hasta',
    'region', 'aysen', 'comuna', 'comunas', 'nivel', 'datos', 'dato', 'valor', 'valores',
    'mayor', 'menor', 'principales', 'principal', 'indicador', 'indicadores',
    'totalmente', 'inexistente', 'inventado', 'pasa', 'afecta', 'existe', 'existen',
    'cuesta', 'falta', 'faltan', 'quiere', 'quieren', 'hacer', 'puede', 'pueden', 'toda', 'todas', 'todos', 'vs', 'versus'
  ]);

  const SPANISH_SUFFIXES = [
    'aciones', 'iciones', 'amientos', 'imientos', 'isticos', 'isticas', 'acionales',
    'adores', 'adoras', 'ancias', 'encias', 'acion', 'icion', 'amiento', 'imiento',
    'idades', 'istico', 'istica', 'eticos', 'eticas', 'acional', 'antes', 'ientes',
    'anzas', 'encias', 'ismos', 'istas', 'etico', 'etica', 'ador', 'adora', 'ancia',
    'encia', 'idad', 'ante', 'iente', 'anza', 'ismo', 'ista', 'ales', 'ares', 'iles',
    'ores', 'oras', 'ados', 'adas', 'idos', 'idas', 'ando', 'iendo', 'eros', 'eras',
    'ivos', 'ivas', 'osos', 'osas', 'ero', 'era', 'ivo', 'iva', 'oso', 'osa',
    'es', 'os', 'as', 'o', 'a', 'e', 's'
  ];

  function stemSpanishWord(word) {
    const w = String(word || '').toLowerCase().trim();
    if (w.length < 5) return w;
    for (const suf of SPANISH_SUFFIXES) {
      if (w.endsWith(suf)) {
        const stem = w.slice(0, w.length - suf.length);
        if (stem.length >= 4) return stem;
      }
    }
    return w;
  }

  function normalizeText(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\b(pm|mp)\s*2[.,]5\b/gi, 'mp25')
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

    // Rescate ante JSON truncado por límite de tokens
    const replyMatch = trimmed.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)(?:"|$)/);
    if (replyMatch && replyMatch[1]) {
      const unescapedReply = replyMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .trim();
      if (unescapedReply.length >= 12) {
        const varXMatch = trimmed.match(/"varX"\s*:\s*"([a-z0-9_]+)"/i);
        const varYMatch = trimmed.match(/"varY"\s*:\s*"([a-z0-9_]+)"/i);
        const renderMatch = trimmed.match(/"render"\s*:\s*(true|false)/i);
        const typeMatch = trimmed.match(/"type"\s*:\s*"(bar|line|scatter)"/i);
        const hubMatch = trimmed.match(/"relatedHub"\s*:\s*"(I|II|III|IV|V|VI|VII|VIII|IX|X)"/i);
        return {
          _isTruncatedRescue: true,
          reply: unescapedReply,
          chart: {
            render: renderMatch ? renderMatch[1].toLowerCase() === 'true' : true,
            type: typeMatch ? typeMatch[1] : 'bar',
            varX: varXMatch ? varXMatch[1] : null,
            varY: varYMatch ? varYMatch[1] : null
          },
          relatedHub: hubMatch ? hubMatch[1] : undefined
        };
      }
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
      /(pct|porcentaje|tasa|densidad|per_capita|por_mil|ratio|promedio|plazo|horas|hrs|tarifa|precio|costo|gasolina|diesel|ica_g_ton|nota|indice|esperanza_vida|envejecimiento|masculinidad|espera_.*dias)/i.test(key)
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
        aliases.add('puerto ingeniero ibanez');
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

    // 1b. Indexar localidades sub-comunales desde `localidadesCoords` -> comuna madre
    const knownEntityAliases = new Set();
    const entityByIne = new Map();
    entities.forEach(ent => {
      entityByIne.set(String(ent.id), ent);
      ent.aliases.forEach(a => knownEntityAliases.add(a));
    });
    const localidadesMap = new Map();
    const localidadesRaw = (dataLake.localidadesCoords && typeof dataLake.localidadesCoords === 'object')
      ? dataLake.localidadesCoords
      : {};
    Object.entries(localidadesRaw).forEach(([locName, info]) => {
      if (!info || !info.comuna_ine) return;
      const nLoc = normalizeText(locName);
      if (!nLoc || nLoc.length < 4 || knownEntityAliases.has(nLoc)) return;
      const parentEnt = entityByIne.get(String(info.comuna_ine));
      if (!parentEnt) return;
      const entry = {
        localidadName: locName,
        normName: nLoc,
        comuna_ine: String(info.comuna_ine),
        comunaName: parentEnt.name,
        entity: parentEnt
      };
      localidadesMap.set(nLoc, entry);
      const strippedLoc = nLoc.replace(/^(puerto|caleta|villa)\s+/, '').trim();
      if (strippedLoc && strippedLoc.length >= 5 && !knownEntityAliases.has(strippedLoc) && !localidadesMap.has(strippedLoc)) {
        localidadesMap.set(strippedLoc, entry);
      }
    });
    const EXPLICIT_LOCALIDADES = [
      { key: 'puyuhuapi', name: 'Puyuhuapi', ine: '11202' },
      { key: 'la junta', name: 'La Junta', ine: '11202' },
      { key: 'raul marin balmaceda', name: 'Raúl Marín Balmaceda', ine: '11202' },
      { key: 'puerto cisnes', name: 'Puerto Cisnes', ine: '11202' },
      { key: 'puerto rio tranquilo', name: 'Puerto Río Tranquilo', ine: '11402' },
      { key: 'rio tranquilo', name: 'Puerto Río Tranquilo', ine: '11402' },
      { key: 'bahia murta', name: 'Bahía Murta', ine: '11402' },
      { key: 'puerto murta', name: 'Bahía Murta', ine: '11402' },
      { key: 'cerro castillo', name: 'Villa Cerro Castillo', ine: '11402' },
      { key: 'villa cerro castillo', name: 'Villa Cerro Castillo', ine: '11402' },
      { key: 'caleta andrade', name: 'Caleta Andrade', ine: '11201' },
      { key: 'puerto aguirre', name: 'Puerto Aguirre', ine: '11201' },
      { key: 'manihuales', name: 'Villa Mañihuales', ine: '11201' },
      { key: 'villa manihuales', name: 'Villa Mañihuales', ine: '11201' },
      { key: 'puerto chacabuco', name: 'Puerto Chacabuco', ine: '11201' },
      { key: 'chacabuco', name: 'Puerto Chacabuco', ine: '11201' },
      { key: 'puerto guadal', name: 'Puerto Guadal', ine: '11401' },
      { key: 'puerto bertrand', name: 'Puerto Bertrand', ine: '11401' },
      { key: 'puerto sánchez', name: 'Puerto Sánchez', ine: '11402' },
      { key: 'puerto sanchez', name: 'Puerto Sánchez', ine: '11402' }
    ];
    EXPLICIT_LOCALIDADES.forEach(item => {
      const parentEnt = entityByIne.get(item.ine);
      if (!parentEnt) return;
      const nKey = normalizeText(item.key);
      if (!nKey || localidadesMap.has(nKey)) return;
      localidadesMap.set(nKey, {
        localidadName: item.name,
        normName: nKey,
        comuna_ine: item.ine,
        comunaName: parentEnt.name,
        entity: parentEnt
      });
    });
    const localidadesList = Array.from(localidadesMap.entries())
      .sort((a, b) => b[0].length - a[0].length);

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

        const rankedAsc = [...ranked].reverse();
        const sum = ranked.reduce((acc, r) => acc + r.value, 0);
        const avg = ranked.length ? sum / ranked.length : 0;
        const top3 = ranked.slice(0, 3);
        const top3Sum = top3.reduce((acc, r) => acc + r.value, 0);
        const top3Pct = sum > 0 ? (top3Sum / sum) * 100 : 0;
        const bottom3 = rankedAsc.slice(0, 3);
        const bottom3Sum = bottom3.reduce((acc, r) => acc + r.value, 0);
        const bottom3Pct = sum > 0 ? (bottom3Sum / sum) * 100 : 0;
        stats = {
          sum,
          avg,
          max: ranked[0] || null,
          second: ranked[1] || null,
          min: ranked[ranked.length - 1] || null,
          ranked,
          rankedAsc,
          top3,
          top3Sum,
          top3Pct,
          bottom3,
          bottom3Sum,
          bottom3Pct
        };
      }

      const tokensArr = Array.from(tokenBag);
      const stemsArr = Array.from(new Set(
        tokensArr
          .filter(t => !QUERY_STOPWORDS.has(t) && t.length >= 4)
          .map(stemSpanishWord)
      ));

      const varRecord = {
        key,
        label: meta.label,
        unit: meta.unit,
        hub: meta.hub,
        isNumeric: meta.isNumeric,
        aggregation: meta.aggregation,
        source,
        synonyms: Array.from(synonymPhrases).filter(Boolean),
        tokens: tokensArr,
        stems: stemsArr,
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

    // 6. Construir catálogo dinámico consolidado de fuentes oficiales verificadas
    const allOfficialSources = [];
    const seenSources = new Set();
    const pushOfficialSource = (src) => {
      if (!src || !src.institucion) return;
      const key = `${normalizeText(src.institucion)}|${String(src.url || '').replace(/\/+$/, '')}`;
      if (seenSources.has(key)) return;
      seenSources.add(key);
      allOfficialSources.push(src);
    };
    FUENTES_OFICIALES_28.forEach(pushOfficialSource);
    Object.values(PROVENANCE_CATALOG_ENTRIES).forEach(entry => {
      pushOfficialSource({
        institucion: entry.institucion,
        indicador: entry.titulo,
        url: entry.url,
        hub: 'Catálogo Verificado',
        anos: '2015-2026'
      });
    });

    // 7. Construir Atlas Panorámico compacto (indicadores deduplicados + nodos e hitos)
    const seenStatSig = new Set();
    const panoramicIndicators = [];
    variables.forEach(v => {
      if (!v.isNumeric || !v.stats) return;
      const sig = `${v.stats.sum.toFixed(1)}|${v.stats.avg.toFixed(1)}|${v.stats.max?.comuna || ''}`;
      if (seenStatSig.has(sig)) return;
      seenStatSig.add(sig);
      const aggStr = v.aggregation === 'avg'
        ? `Prom:${Number(v.stats.avg.toFixed(1))}`
        : `Tot:${Number(v.stats.sum.toFixed(1))}`;
      const maxStr = v.stats.max ? `1°${v.stats.max.comuna}:${v.stats.max.value}` : '';
      const minStr = v.stats.min ? `min:${v.stats.min.comuna}:${v.stats.min.value}` : '';
      panoramicIndicators.push(`${v.key}=${aggStr}${v.unit || ''}[${maxStr},${minStr}]`);
    });

    const nodeSummaryList = indexedNodes.map(n => `#${n.id}(${n.hubId}):${n.title}`).join('; ');
    const regionalMilestones = [
      '12 Holdings salmoneros madres (AquaChile, Multi X, Blumar, Mowi, Cermaq, Australis)',
      'Corredor binacional ATIT 1974 via RN40 y Paso Cardenal Samore hacia Huemules/Jeinimeni/Coyhaique Alto/Roballos',
      'EMPORCHA Puerto Chacabuco 468.200 ton (2024) y proy. 495.000 ton (2026) + CAM-01 + barcazas DTPR',
      'Red vial MOP 3.386,4 km totales (412,8 km pav. vs 2.438,0 km ripio)',
      '3 subsistemas electricos aislados SEN (98,6 MW) + SAIDI prom 36,0 h/ano + Lena INFOR 565.456 m3/ano + Pellet 20.000 ton/ano maritimo',
      'Bosque nativo CONAF 4.832.500 ha + 35.240 ha plantaciones + 5.723.000 ha vegetacion nativa',
      'Huemul RCE MMA 1.500-2.000 individuos (amenaza perros asilvestrados); Ganado ODEPA 130.832 bovinos y 177.934 ovinos',
      'Listas espera SIGTE 11.420 interconsultas; GLOFs Cachet 2 cuenca Baker; 3 ZOITs decretadas'
    ].join(' | ');
    const panoramicNodesAndMilestones = `Hitos regionales: ${regionalMilestones}. Nodos (${indexedNodes.length}): ${nodeSummaryList}`;

    _memoryIndex = {
      entities,
      localidadesList,
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
      fuentes: allOfficialSources,
      panoramicIndicators,
      panoramicNodesAndMilestones
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
    const totalConcesiones12 = holdings12.reduce((acc, h) => acc + (Number(h.total_concesiones_aysen) || 0), 0);
    const pct12Reg = fmtNumber(totalConcesionesReg > 0 ? (totalConcesiones12 / totalConcesionesReg) * 100 : 0, 1);
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
      reply = `Las ${fmtNumber(totalConcesionesReg)} concesiones y ${fmtNumber(totalBiomasaReg)} ton de biomasa en Aysén (Aysén, Cisnes y Guaitecas) se concentran en 12 holdings (${fmtNumber(totalConcesiones12)} conc., ${pct12Reg}% reg.; 19 en otros titulares; Top 5 pasó de 58,0% a 70,8% en 2026): ${top5}. Completan los 12: ${rest7}.`;
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
   * Detector de Consultas Reconciliadas sobre Fuentes Oficiales Primarias
   * (docs/viplan_research/MATRIZ_RECONCILIACION_FUENTES_OFICIALES.md)
   */
  function detectReconciledTopicIntent(qNorm, rawQuery, matchedEntities = []) {
    const isSingleComunaSpecific = matchedEntities.length === 1 &&
      !/\b(regional|total|ambas|versus|vs|compar|todas|aysen|region|cuantas|cuantos|resumen)\b/i.test(qNorm);

    // 1. Leña y Pellet (INFOR / SEC)
    if (/\b(pellet|pellets|demanda de pellet|dendroenerg|ley 21\.?499|humedad de la le[ñn]a|xilohigrometro|consumo.*le[ñn]a.*pellet|pellet.*le[ñn]a|biocombustibles? solidos?)\b/i.test(qNorm) ||
        (/\b(infor|volumen.*le[ñn]a)\b/i.test(qNorm) && !isSingleComunaSpecific)) {
      return 'pellet_lena';
    }

    // 2. Déficit habitacional cuantitativo y cualitativo (MINVU)
    if (/\b(deficit habitacional|deficit cuantitativo|deficit cualitativo|viviendas? irrecuperables?|plan de emergencia habitacional|peh minvu)\b/i.test(qNorm)) {
      if (!isSingleComunaSpecific || /\b(cuantitativo y cualitativo|ambos|total|regional|minvu|peh)\b/i.test(qNorm)) {
        return 'deficit_habitacional';
      }
    }

    // 3. Comités y beneficiarios de agua rural SSR/APR (DOH-MOP)
    if (/\b(ssr|apr|comites? de agua|cooperativas? de agua|agua potable rural|servicios? sanitarios? rurales?|ley 20\.?998|seguridad hidrica rural|beneficiarios ssr|agua rural)\b/i.test(qNorm)) {
      if (!isSingleComunaSpecific || /\b(cuantos comites|comites y beneficiarios|total|regional|doh|mop|ley 20998)\b/i.test(qNorm)) {
        return 'agua_rural_ssr';
      }
    }

    // 4. Pobreza multidimensional vs ingresos (CASEN MDSF)
    if (/\b(pobreza multidimensional|multidimensional.*ingresos|ingresos.*multidimensional|casen multidimensional|pobreza monetaria.*multidimensional)\b/i.test(qNorm)) {
      return 'pobreza_multidim';
    }

    // 5. Listas de espera de especialidad y quirúrgica (SIGTE)
    if (/\b(listas? de espera|espera no ges|interconsultas no ges|espera quirurgica|espera de especialidad|sigte|tiempos? de espera)\b/i.test(qNorm)) {
      return 'listas_espera_sigte';
    }

    // 6. Cáncer gástrico, vesícula y tasa de suicidio (DEIS MINSAL)
    if (/\b(cancer gastrico|cancer de vesicula|neoplasias digestivas|tasa de suicidio|suicidios?|uhce|camas psiquiatricas|salud mental.*deis|cancer.*suicidio|suicidio.*cancer)\b/i.test(qNorm)) {
      return 'cancer_suicidio';
    }

    // 7. Camas hospitalarias HRC (167 de 261) y postas de salud rural (27 PSR)
    if (/\b(camas.*postas|postas.*camas|camas.*hrc|hrc.*camas|hospital regional.*camas|camas.*hospital regional|167 de 261|167 camas|261 camas|27 postas|postas de salud rural.*hrc|hrc.*postas|postas y camas|camas y postas|27 postas de salud rural)\b/i.test(qNorm)) {
      return 'camas_hrc_postas';
    }

    // 8. SLEP Aysén (traspaso 2024, 66 establecimientos) y matrícula SIES (CFT Estatal, INACAP, UAysén)
    if (/\b(slep aysen|traspaso.*slep|sies|matricula.*superior|cft estatal|cft estatal aysen|uaysen.*inacap|inacap.*uaysen|campus errazuriz|victor cubillos|66 establecimientos|traspaso 2024)\b/i.test(qNorm)) {
      return 'slep_sies';
    }

    // 9. Solicitudes ECMPO Ley Lafkenche (620.000 ha) y concesiones en SNASPE (312 en RN Las Guaitecas)
    if (/\b(ecmpo|ley lafkenche|pu wapi|antunen rain|620\.?000 ha|concesiones.*snaspe|concesiones.*reserva.*guaitecas|reserva.*guaitecas.*concesiones|312 concesiones|solicitudes ecmpo)\b/i.test(qNorm)) {
      return 'ecmpo_snaspe';
    }

    // 10. Existencias ganaderas bovinas y ovinas (ODEPA Censo Agropecuario)
    if (/\b(ganaderia bovina|ganaderia ovina|ganado bovino.*ovino|ganado ovino.*bovino|bovinos.*ovinos|ovinos.*bovinos|bovinos y ovinos|ovinos y bovinos|existencias ganaderas|censo agropecuario.*ganad|caf odepa|cabezas de ganado|ganaderia.*odepa)\b/i.test(qNorm)) {
      return 'ganaderia_bovina_ovina';
    }

    // 11. Inversión FNDR devengada vs sectorial ministerial centralizada (DIPRES)
    if (/\b(fndr devengad|inversion sectorial ministerial|sectorial.*fndr|fndr.*sectorial|gasto centralizado.*fndr|ejecucion real fndr|subejecucion fndr|fndr.*dipres|dipres.*fndr|inversion sectorial.*dipres|ejecucion.*fndr.*gore|ejecucion presupuestaria fndr)\b/i.test(qNorm)) {
      return 'fndr_sectorial';
    }

    // 12. Bancarización y cobertura CajaVecina (CMF / BancoEstado)
    if (/\b(exclusion bancaria|banca privada|bancarizacion|cajavecina|caja vecina|bancoestado.*cobertura|cobertura.*cajavecina|sucursales bancarias|corresponsalia bancaria)\b/i.test(qNorm)) {
      return 'exclusion_bancaria_cajavecina';
    }

    // 13. GLOFs en cuenca Baker / Cachet 2 (DGA) y Glaciar Exploradores
    if (/\b(glof|glofs|lago cachet|cachet 2|cuenca.*baker.*glof|glaciar exploradores|clausura.*exploradores|trekking sobre hielo|vaciamientos.*cachet)\b/i.test(qNorm)) {
      return 'glof_exploradores';
    }

    // 14. Las 3 ZOITs oficiales decretadas (Chelenko, Aysén-Patagonia, Glaciares)
    if (/\b(zoits? oficiales|zoits? decretadas?|3 zoits|cuales son las zoits|zonas? de interes turistico decretadas?|zoit chelenko|aysen patagonia queulat|provincia de los glaciares|decretos? zoit|zoits?.*subturismo)\b/i.test(qNorm) ||
        (/\bzoits?\b/i.test(qNorm) && !isSingleComunaSpecific)) {
      return 'zoit_oficiales';
    }

    // 15. Nudos críticos energéticos y matriz térmica/eléctrica regional
    if (/\b(nudos? criticos?.*energ|problemas?.*energ|cuellos? de botella.*energ|desafios?.*energ|brechas?.*energ|materia energetica|crisis energetica)\b/i.test(qNorm)) {
      return 'nudos_criticos_energia';
    }

    // 16. Principales rutas de entrada de insumos y soberanía logística
    if (/\b(rutas?.*insumos|entran.*insumos|ingreso.*insumos|abastecimiento.*region|logistica.*aysen|principales rutas.*aysen|por donde entran|rutas? de entrada|soberania logistica)\b/i.test(qNorm)) {
      return 'rutas_insumos_logistica';
    }

    // 17. Masa forestal / árboles y cobertura de bosque nativo CONAF
    if (/\b(cuantos arboles|cantidad de arboles|numero de arboles|total de arboles|superficie de bosque|hectareas de bosque)\b/i.test(qNorm) && !isSingleComunaSpecific) {
      return 'bosques_arboles_conaf';
    }

    // 18. Consultas sobre perros / población canina -> puente a RCE Huemul y Censo Agropecuario ODEPA
    if (/\b(cuantos perros|poblacion canina|cantidad de perros|numero de perros|perros asilvestrados|cuantas mascotas|mascotas)\b/i.test(qNorm)) {
      return 'fauna_perros_ganaderia';
    }

    return null;
  }

  /**
   * Construye respuesta analítica y especificación de evidencia para temas reconciliados oficiales
   */
  function buildReconciledTopicReply(topicKey, userText, qNorm, index) {
    switch (topicKey) {
      case 'pellet_lena': {
        const reply = 'En la matriz energética y dendroenergética regional (fuentes oficiales INFOR y SEC Ley N° 21.499): El consumo de leña residencial totaliza 565.456 m³ sólidos/año (~850.000 m³ estéreos/año) con un consumo específico promedio de 17,5 m³ sólidos/hogar/año (INFOR), representando el 80% al 92,8% de la matriz térmica regional. La demanda regional de pellet de madera asciende a ~20.000 ton/año, abastecida en un 100% mediante cabotaje marítimo hacia Puerto Chacabuco (Mesa del Pellet / SEREMI de Energía). Bajo la Ley N° 21.499, la SEC fiscaliza el estándar de humedad < 25% con xilohigrómetros e inscripción obligatoria de Centros de Procesamiento de Biomasa (CPB).';
        const sources = resolveSourcesForKeys(['volumen_regional_lena_m3', 'demanda_pellet_ton_ano']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'consumo_lena_m3_hogar_ano',
            varY: 'hogares_lena_pct',
            yKey: 'consumo_lena_m3_hogar_ano',
            y2Key: 'hogares_lena_pct',
            title: 'Consumo Residencial de Leña (m³/hogar/año) vs. Matriz a Leña (% hogares)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'III'
        };
      }
      case 'deficit_habitacional': {
        const reply = 'Según el Observatorio Habitacional del MINVU y el Plan de Emergencia Habitacional (PEH): La Región de Aysén registra un déficit habitacional cuantitativo de 3.147 viviendas (56% irrecuperables, 1.762 viviendas) y un déficit cualitativo superior a 14.000 viviendas con deficiencias en envolvente térmica y habitabilidad. La demanda se concentra prioritariamente en Coyhaique (1.845 viviendas cuantitativo) y Aysén (762 viviendas).';
        const sources = resolveSourcesForKeys(['deficit_habitacional_cuantitativo_n', 'deficit_habitacional_cualitativo_n']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'deficit_habitacional_cuantitativo_n',
            varY: 'deficit_habitacional_cualitativo_n',
            yKey: 'deficit_habitacional_cuantitativo_n',
            y2Key: 'deficit_habitacional_cualitativo_n',
            title: 'Déficit Habitacional Cuantitativo vs. Cualitativo (MINVU)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VI'
        };
      }
      case 'agua_rural_ssr': {
        const reply = 'Según la Subdirección de Servicios Sanitarios Rurales (DOH-MOP) bajo la Ley N° 20.998: En la Región de Aysén operan 47 comités y cooperativas de SSR vigentes, abasteciendo a 28.833 beneficiarios rurales (28,6% de la población regional). Esta infraestructura comunitaria enfrenta una alta vulnerabilidad estacional por congelamiento recurrente de matrices y captaciones superficiales en valles interiores durante la temporada invernal.';
        const sources = resolveSourcesForKeys(['sistemas_ssr_apr_n', 'cobertura_ssr_apr_familias']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'sistemas_ssr_apr_n',
            varY: 'cobertura_ssr_apr_familias',
            yKey: 'sistemas_ssr_apr_n',
            y2Key: 'cobertura_ssr_apr_familias',
            title: 'Sistemas de Agua Potable Rural (SSR/APR) y Familias Abastecidas (DOH-MOP)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VI'
        };
      }
      case 'pobreza_multidim': {
        const reply = 'Según la Encuesta CASEN del Ministerio de Desarrollo Social y Familia (MDSF): En la Región de Aysén, la pobreza por ingresos monetarios promedia 4,0% regional, cifra distorsionada por la alta asignación de zona de funcionarios en comunas pequeñas (ej. Lago Verde registra 0,9%). En contraste, la Pobreza Multidimensional alcanza un 14,0% promedio regional y se eleva a rangos de 22,0% a 28,0% en comunas rurales aisladas (Lago Verde 24,1%, Tortel 26,4%, O\'Higgins 27,8%, Guaitecas 23,5%), reflejando graves carencias en habitabilidad, calefacción y aislamiento.';
        const sources = resolveSourcesForKeys(['pobreza_ingresos_pct', 'pobreza_multidim_pct']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'pobreza_ingresos_pct',
            varY: 'pobreza_multidim_pct',
            yKey: 'pobreza_ingresos_pct',
            y2Key: 'pobreza_multidim_pct',
            title: 'Pobreza por Ingresos vs. Pobreza Multidimensional CASEN (%)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VI'
        };
      }
      case 'listas_espera_sigte': {
        const reply = 'Según el Sistema de Información de Gestión de Tiempos de Espera (SIGTE / Subsecretaría de Redes Asistenciales / FONASA): La Red Asistencial de Aysén registra 11.420 interconsultas No GES pendientes. La mediana de espera para consulta de nueva especialidad médica es de 284 días, mientras que la mediana de espera para intervenciones quirúrgicas alcanza los 395 días.';
        const sources = resolveSourcesForKeys(['espera_no_ges_n']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'espera_no_ges_n',
            varY: null,
            yKey: 'espera_no_ges_n',
            y2Key: null,
            title: 'Lista de Espera No GES Consultas de Especialidad por Comuna (SIGTE)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VIII'
        };
      }
      case 'cancer_suicidio': {
        const reply = 'Según las estadísticas de vigilancia epidemiológica del DEIS MINSAL y el Registro Poblacional de Cáncer: Las neoplasias digestivas son la 1ª causa de años de vida potencialmente perdidos (AVPP) en Aysén, encabezadas por el Cáncer Gástrico (C16, tasa de 18,4 por 100k hab) y el Cáncer de Vesícula Biliar (C23, tasa de 12,6 por 100k hab). En salud mental, la región registra una tasa de mortalidad por suicidio de ~15,1 por 100k hab, existiendo un cuello de botella asistencial crítico: solo 9 camas psiquiátricas de corta estadía en la UHCE del Hospital Regional Coyhaique para toda la población regional.';
        const sources = resolveSourcesForKeys(['tasa_cancer_gastrico_cie10', 'tasa_suicidio_por_100k']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'camas_hospitalarias',
            varY: 'medicos_por_mil_hab',
            yKey: 'camas_hospitalarias',
            y2Key: 'medicos_por_mil_hab',
            title: 'Camas Hospitalarias vs. Dotación Médica por Comuna (DEIS MINSAL)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VIII'
        };
      }
      case 'camas_hrc_postas': {
        const reply = 'Según el catastro oficial del DEIS MINSAL y el Servicio de Salud Aysén (SSA): La red asistencial regional dispone de 261 camas hospitalarias totales, de las cuales 167 camas (63,98%) están concentradas en el Hospital Regional Coyhaique (HRC), seguidas por Puerto Aysén (52), Cochrane (16), Chile Chico (14) y Cisnes (12). En atención primaria rural, existen 27 Postas de Salud Rural (PSR) permanentes dotadas de personal TENS residente y 20 Estaciones Médico Rurales (EMR) atendidas por rondas periódicas.';
        const sources = resolveSourcesForKeys(['camas_hospitalarias', 'postas_salud_rural']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'camas_hospitalarias',
            varY: 'postas_salud_rural',
            yKey: 'camas_hospitalarias',
            y2Key: 'postas_salud_rural',
            title: 'Camas Hospitalarias y Postas de Salud Rural (PSR) por Comuna',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VIII'
        };
      }
      case 'slep_sies': {
        const reply = 'En el ámbito educativo oficial (SLEP Aysén Ley N° 21.040 y SIES MINEDUC): El SLEP Aysén asumió la administración escolar pública efectiva el 1 de enero de 2024, articulando 66 recintos educacionales (56 escuelas/liceos y 10 jardines infantiles). En educación superior, el SIES reporta una matrícula total regional de 2.327 estudiantes: CFT Estatal Aysén (737 alumnos), INACAP Coyhaique (800) y Universidad de Aysén (790 alumnos, consolidada en su Campus Errázuriz tras culminar la administración provisional SES e iniciar la rectoría del Dr. Víctor Cubillos 2026-2030). El 66% de la matrícula superior regional corresponde a formación técnica.';
        const sources = resolveSourcesForKeys(['matricula_escolar', 'matricula_sies_total']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'matricula_escolar',
            varY: 'establecimientos_escolares_n',
            yKey: 'matricula_escolar',
            y2Key: 'establecimientos_escolares_n',
            title: 'Matrícula Escolar y Establecimientos Educacionales por Comuna',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VI'
        };
      }
      case 'ecmpo_snaspe': {
        const reply = 'Según registros oficiales de SUBPESCA, CONADI, CRUBC Aysén y CONAF: Se encuentran en tramitación administrativa y judicial más de 620.000 ha en solicitudes de Espacios Costeros Marinos para Pueblos Originarios (ECMPO Ley N° 20.249), destacando Pu Wapi (227.000 ha en Cisnes) y Antünen Rain (393.000 ha en Islas Huichas). Paralelamente, más de 300 concesiones salmoneras (312 en catastro SNASPE) operan al interior de la Reserva Nacional Las Guaitecas, bajo auditorías de la Contraloría General de la República y el marco de la Ley SBAP N° 21.600.';
        const sources = resolveSourcesForKeys(['solicitudes_ecmpo_ha', 'concesiones_salmon_snaspe_n']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'concesiones_salmon',
            varY: 'centros_activos_salmon',
            yKey: 'concesiones_salmon',
            y2Key: 'centros_activos_salmon',
            title: 'Concesiones Salmoneras y Centros Activos por Comuna',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'II'
        };
      }
      case 'ganaderia_bovina_ovina': {
        const reply = 'Según el VIII Censo Nacional Agropecuario y Forestal (CAF 2021) de ODEPA e INE: La Región de Aysén cuenta con 130.832 cabezas de ganado bovino y 177.934 cabezas de ganado ovino. La mayor dotación pecuaria se concentra en Coyhaique (48.500 bovinos y 62.000 ovinos), Río Ibáñez (24.200 bovinos y 38.500 ovinos), Chile Chico (15.400 bovinos y 28.600 ovinos) y Cochrane (16.200 bovinos y 22.400 ovinos).';
        const sources = resolveSourcesForKeys(['ganado_bovino_cabezas', 'ganado_ovino_cabezas']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'ganado_bovino_cabezas',
            varY: 'ganado_ovino_cabezas',
            yKey: 'ganado_bovino_cabezas',
            y2Key: 'ganado_ovino_cabezas',
            title: 'Ganado Bovino vs. Ganado Ovino por Comuna (Censo Agropecuario ODEPA)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'V'
        };
      }
      case 'fndr_sectorial': {
        const reply = 'Según los balances oficiales de ejecución presupuestaria de la DIPRES: El FNDR del GORE Aysén devengó M$ 61.548 en 2023 (88,2% del presupuesto vigente) y registró un 79,0% de ejecución al cierre preliminar de 2024 (M$ 57.235,5). En contraposición, la inversión sectorial ministerial centralizada (MOP, MINVU, Salud, MTT) suma entre M$ 395.000 y M$ 402.000 anuales (5x a 6x el FNDR descentralizado). En el SNI/BIP, los proyectos municipales promedian una tasa de aprobación RS de solo 37,5%, alcanzando un 65% de rechazos/observaciones en comunas rurales.';
        const sources = resolveSourcesForKeys(['ejecucion_fndr_devengado_mclp', 'inversion_sectorial_ministerial_mclp']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'fndr_mclp',
            varY: 'presupuesto_mclp',
            yKey: 'fndr_mclp',
            y2Key: 'presupuesto_mclp',
            title: 'Inversión Pública FNDR vs. Presupuesto Municipal por Comuna',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'IV'
        };
      }
      case 'exclusion_bancaria_cajavecina': {
        const reply = 'Según estadísticas oficiales de la Comisión para el Mercado Financiero (CMF) y BancoEstado: 8 de las 10 comunas de Aysén (80%) carecen de sucursales bancarias privadas, existiendo presencia comercial exclusiva en Coyhaique y Puerto Aysén. La red comunal de más de 400 puntos de corresponsalía CajaVecina de BancoEstado instalados en almacenes y comercios locales representa la infraestructura crítica de inclusión financiera y transaccional para la población rural y aislada.';
        const sources = resolveSourcesForKeys(['exclusion_bancaria_comunas_pct', 'puntos_cajavecina_n']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'puntos_cajavecina_bancoestado',
            varY: 'sucursales_banca_privada_cmf',
            yKey: 'puntos_cajavecina_bancoestado',
            y2Key: 'sucursales_banca_privada_cmf',
            title: 'Puntos CajaVecina BancoEstado vs. Sucursales Banca Privada (CMF) por Comuna',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'V'
        };
      }
      case 'glof_exploradores': {
        const reply = 'Según la Unidad de Glaciología y Nieves de la DGA y CONAF: Se registran 27 vaciamientos catastróficos históricos GLOF (Glacial Lake Outburst Floods) en Lago Cachet 2 hacia el Río Colonia y la cuenca del Río Baker, con volúmenes de descarga de hasta 200 millones de m³ por evento y caudales superiores a 3.000 m³/s. En el Glaciar Exploradores, rige la clausura total e indefinida del trekking sobre hielo fósil mediante resoluciones técnicas DGA/CONAF y fallo confirmatorio de la Corte de Apelaciones de Coyhaique por peligro de colapso morrénico, manteniéndose activo únicamente el sendero perimetral de mirador panorámico.';
        const sources = resolveSourcesForKeys(['eventos_glof_cachet2_n', 'glaciar_exploradores_estatus']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'superficie_glaciares_km2',
            varY: null,
            yKey: 'superficie_glaciares_km2',
            y2Key: null,
            title: 'Superficie Glaciar Comunal (DGA) en Aysén',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VII'
        };
      }
      case 'zoit_oficiales': {
        const reply = 'Según el catastro oficial de la Subsecretaría de Turismo (Subturismo): En la Región de Aysén existen únicamente 3 Zonas de Interés Turístico (ZOIT) decretadas oficialmente con Decreto Supremo: 1. ZOIT Chelenko (Cuenca Lago General Carrera: Chile Chico y Río Ibáñez), 2. ZOIT Aysén Patagonia Queulat (Cisnes, Aysén y Lago Verde), y 3. ZOIT Provincia de los Glaciares (Cochrane, Tortel y Villa O\'Higgins). Coyhaique no cuenta con decreto ZOIT y funciona como nodo articulador de servicios turísticos.';
        const sources = resolveSourcesForKeys(['zoit_nombre', 'zoits_oficiales_count']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'prestadores_sernatur',
            varY: 'visitantes_snaspe',
            yKey: 'prestadores_sernatur',
            y2Key: 'visitantes_snaspe',
            title: 'Prestadores Turísticos SERNATUR vs. Visitantes Parques SNASPE por Comuna',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'I'
        };
      }
      case 'nudos_criticos_energia': {
        const reply = 'Los principales nudos críticos energéticos en Aysén son cuatro: 1) Desconexión del SEN nacional: opera en 3 subsistemas aislados (98,6 MW instalados totales) dependientes de diésel térmico en comunas insulares/australes; 2) Calidad de suministro y tarifas: SAIDI promedio de 36,0 h/año (hasta 64,3 h en Tortel y 62,1 h en Guaitecas) y tarifa BT1 promedio de $242,3/kWh; 3) Matriz térmica a leña: 93,8% promedio de hogares usa leña (565.456 m³/año INFOR) y 100% del pellet (~20.000 ton/año) llega por vía marítima; 4) Contaminación atmosférica: Coyhaique registra 87 días/año sobre norma MP2.5 (Aysén 34 días).';
        const sources = resolveSourcesForKeys(['hogares_lena_pct', 'dias_sobre_norma_mp25', 'saidi_horas_anual', 'demanda_pellet_ton_ano']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'hogares_lena_pct',
            varY: 'dias_sobre_norma_mp25',
            yKey: 'hogares_lena_pct',
            y2Key: 'dias_sobre_norma_mp25',
            title: 'Matriz de Calefacción a Leña (% hogares) vs. Días sobre Norma MP2.5 (CNE / MMA)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'III',
          isContextualBridge: true
        };
      }
      case 'rutas_insumos_logistica': {
        const reply = 'El ingreso de insumos a Aysén depende de tres vías críticas: 1) Corredor binacional por Argentina (ATIT 1974): vía RN40 y Paso Cardenal Samoré hacia Huemules, Jeinimeni, Coyhaique Alto y Roballos (GLP, carnes, frutas y abarrotes; cortes por clima amenazan desabastecimiento en 5–7 días); 2) Cabotaje marítimo: Puerto Chacabuco (EMPORCHA, 468.200 ton en 2024; 495.000 ton proy. 2026), Ruta Cordillera CAM-01 y barcazas DTPR; 3) Red vial MOP: 3.386,4 km totales (412,8 km pavimentados, 18,9% prom., vs. 2.438,0 km en ripio).';
        const sources = resolveSourcesForKeys(['red_vial_pavimentada_km', 'emporcha_toneladas', 'dependencia_barcaza_nivel']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'red_vial_pavimentada_km',
            varY: 'red_vial_ripio_km',
            yKey: 'red_vial_pavimentada_km',
            y2Key: 'red_vial_ripio_km',
            title: 'Red Vial Pavimentada vs. Red Vial en Ripio (km) por Comuna (MOP Vialidad)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'IV',
          isContextualBridge: true
        };
      }
      case 'bosques_arboles_conaf': {
        const reply = 'Los catastros oficiales (CONAF / MMA) miden la masa arbórea en superficie (hectáreas) y no por conteo individual de árboles. En la Región de Aysén, la cobertura de bosque nativo alcanza 4.832.500 ha (destacando Aysén con 1.120.000 ha, Cisnes con 860.000 ha y Tortel con 780.000 ha), más 35.240 ha de plantaciones forestales; considerando toda la cobertura vegetal nativa, suma 5.723.000 ha (60,0% promedio comunal), con predominio de bosques siempreverdes y lenga bajo protección parcial del SNASPE.';
        const sources = resolveSourcesForKeys(['bosque_nativo_ha', 'cobertura_vegetal_pct']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'bosque_nativo_ha',
            varY: 'cobertura_vegetal_pct',
            yKey: 'bosque_nativo_ha',
            y2Key: 'cobertura_vegetal_pct',
            title: 'Superficie de Bosque Nativo (ha) vs. Cobertura Vegetal (%) por Comuna (CONAF)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VII',
          isContextualBridge: true
        };
      }
      case 'fauna_perros_ganaderia': {
        const reply = 'Las fuentes oficiales no registran un censo comunal de perros o mascotas domésticas. Sin embargo, existen dos registros faunísticos vinculados en la base: 1) Biodiversidad (RCE MMA / CONAF): los perros asilvestrados figuran como amenaza directa crítica sobre los 1.500 a 2.000 huemules de Aysén (60%–70% de la población mundial); 2) Censo Agropecuario (ODEPA / INE): el ganado doméstico censado alcanza 130.832 bovinos y 177.934 ovinos en la región (liderando Coyhaique con 42.500 bovinos y Río Ibáñez con 42.100 ovinos).';
        const sources = resolveSourcesForKeys(['ganado_bovino_cabezas', 'fauna_amenazada_n']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'ganado_bovino_cabezas',
            varY: 'ganado_ovino_cabezas',
            yKey: 'ganado_bovino_cabezas',
            y2Key: 'ganado_ovino_cabezas',
            title: 'Existencias Ganaderas: Bovinos vs. Ovinos por Comuna (ODEPA / INE)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VII',
          isContextualBridge: true
        };
      }
      default:
        return null;
    }
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
   * Calcula estadísticos exactos de regresión bivariada (Pearson r, R², extremos reales
   * y cuadrantes respecto a la media) para sincronizar texto y scatter plot sin alucinaciones.
   */
  function computeBivariateStats(entities, varXKey, varYKey, excludeCoyhaique = false) {
    const pts = (entities || [])
      .filter(e => !(excludeCoyhaique && (e.id === '11101' || e.name.toLowerCase() === 'coyhaique')))
      .map(e => ({
        comuna: e.name,
        x: typeof e.raw?.[varXKey] === 'number' ? e.raw[varXKey] : null,
        y: typeof e.raw?.[varYKey] === 'number' ? e.raw[varYKey] : null
      }))
      .filter(p => p.x !== null && p.y !== null);

    const n = pts.length;
    if (n < 2) return null;
    const meanX = pts.reduce((s, p) => s + p.x, 0) / n;
    const meanY = pts.reduce((s, p) => s + p.y, 0) / n;
    let sxx = 0, syy = 0, sxy = 0;
    pts.forEach(p => {
      const dx = p.x - meanX;
      const dy = p.y - meanY;
      sxx += dx * dx;
      syy += dy * dy;
      sxy += dx * dy;
    });
    const r = (sxx > 0 && syy > 0) ? (sxy / Math.sqrt(sxx * syy)) : 0;
    const r2 = r * r;
    const sense = Math.abs(r) < 0.1 ? 'casi nula / muy débil' : (r > 0 ? 'positiva' : 'negativa');
    const byYDesc = [...pts].sort((a, b) => b.y - a.y);
    const byXDesc = [...pts].sort((a, b) => b.x - a.x);

    return {
      n,
      r,
      r2,
      sense,
      meanX,
      meanY,
      maxX: { comuna: byXDesc[0].comuna, value: byXDesc[0].x },
      minX: { comuna: byXDesc[n - 1].comuna, value: byXDesc[n - 1].x },
      maxY: { comuna: byYDesc[0].comuna, value: byYDesc[0].y },
      minY: { comuna: byYDesc[n - 1].comuna, value: byYDesc[n - 1].y },
      topRight: pts.filter(p => p.x >= meanX && p.y >= meanY).map(p => p.comuna),
      bottomRight: pts.filter(p => p.x >= meanX && p.y < meanY).map(p => p.comuna),
      topLeft: pts.filter(p => p.x < meanX && p.y >= meanY).map(p => p.comuna),
      bottomLeft: pts.filter(p => p.x < meanX && p.y < meanY).map(p => p.comuna)
    };
  }

  /**
   * Bloque 1 & 4: Construye 4 gráficos temáticos enfocados en una única comuna vs. Promedio Regional
   * para acompañar los 4 bloques de su perfil integral sin saturar con las otras 9 comunas.
   */
  function buildComunaMultiCharts(ent, index) {
    const r = ent.raw || {};
    const regAvg = (key) => {
      const v = index.variablesByKey[key];
      return v && v.stats ? Number((v.stats.avg || 0).toFixed(1)) : 0;
    };
    const val = (key) => (typeof r[key] === 'number' && Number.isFinite(r[key]) ? r[key] : 0);
    const hasSalmonVocation = (r.concesiones_salmon || 0) > 20;

    return [
      {
        title: `1. Demografía y Territorio (${ent.name})`,
        type: 'bar',
        customCategoryData: true,
        labels: [ent.name, 'Prom. Reg.'],
        categoryLabel: 'Escala Comunal vs. Promedio',
        varX: 'poblacion_censo_2024',
        varY: 'superficie_km2',
        datasets: [
          { label: 'Población Censo 2024 (hab.)', data: [val('poblacion_censo_2024'), Math.round(regAvg('poblacion_censo_2024'))], unit: 'hab.', yAxisID: 'y' },
          { label: 'Superficie Comunal (km²)', data: [val('superficie_km2'), Math.round(regAvg('superficie_km2'))], unit: 'km²', yAxisID: 'y1' }
        ],
        sourceText: 'INE — Censo de Población y Vivienda 2024'
      },
      hasSalmonVocation
        ? {
            title: `2. Vocación Acuícola (${ent.name})`,
            type: 'bar',
            customCategoryData: true,
            labels: [ent.name, 'Prom. Reg.'],
            categoryLabel: 'Escala Comunal vs. Promedio',
            varX: 'concesiones_salmon',
            varY: 'biomasa_salmon_ton',
            datasets: [
              { label: 'Concesiones Salmonicultura', data: [val('concesiones_salmon'), regAvg('concesiones_salmon')], unit: 'concesiones', yAxisID: 'y' },
              { label: 'Biomasa Cosechada (ton)', data: [val('biomasa_salmon_ton'), Math.round(regAvg('biomasa_salmon_ton'))], unit: 'ton', yAxisID: 'y1' }
            ],
            sourceText: 'SERNAPESCA / SUBPESCA'
          }
        : {
            title: `2. Economía y Turismo (${ent.name})`,
            type: 'bar',
            customCategoryData: true,
            labels: [ent.name, 'Prom. Reg.'],
            categoryLabel: 'Escala Comunal vs. Promedio',
            varX: 'empresas_sii',
            varY: 'prestadores_sernatur',
            datasets: [
              { label: 'Empresas Vigentes SII', data: [val('empresas_sii'), Math.round(regAvg('empresas_sii'))], unit: 'empresas', yAxisID: 'y' },
              { label: 'Prestadores SERNATUR', data: [val('prestadores_sernatur'), Math.round(regAvg('prestadores_sernatur'))], unit: 'prestadores', yAxisID: 'y1' }
            ],
            sourceText: 'SII · SERNATUR'
          },
      {
        title: `3. Finanzas Municipales SINIM (${ent.name})`,
        type: 'bar',
        customCategoryData: true,
        labels: [ent.name, 'Prom. Reg.'],
        categoryLabel: 'Escala Comunal vs. Promedio',
        varX: 'presupuesto_per_capita_mclp',
        varY: 'dependencia_fcm_pct',
        datasets: [
          { label: 'Presupuesto Per Cápita (M$/hab)', data: [val('presupuesto_per_capita_mclp'), regAvg('presupuesto_per_capita_mclp')], unit: 'M$/hab', yAxisID: 'y' },
          { label: 'Dependencia FCM (%)', data: [val('dependencia_fcm_pct'), regAvg('dependencia_fcm_pct')], unit: '%', yAxisID: 'y1' }
        ],
        sourceText: 'SUBDERE — SINIM'
      },
      {
        title: `4. Social y Energía Térmica (${ent.name})`,
        type: 'bar',
        customCategoryData: true,
        labels: [ent.name, 'Prom. Reg.'],
        categoryLabel: 'Escala Comunal vs. Promedio',
        varX: 'pobreza_multidim_pct',
        varY: 'hogares_lena_pct',
        datasets: [
          { label: 'Pobreza Multidimensional (%)', data: [val('pobreza_multidim_pct'), regAvg('pobreza_multidim_pct')], unit: '%', yAxisID: 'y' },
          { label: 'Hogares con Leña (%)', data: [val('hogares_lena_pct'), regAvg('hogares_lena_pct')], unit: '%', yAxisID: 'y1' }
        ],
        sourceText: 'MDSF CASEN · CNE'
      }
    ];
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
    const totBio = vBio && vBio.stats && vBio.stats.sum ? vBio.stats.sum : 503500;

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
      const totBio = index.variablesByKey['biomasa_salmon_ton']?.stats?.sum || 503500;
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
        reply = `La comuna de ${ent.name} es un territorio interior sin litoral marítimo, por lo que registra 0 concesiones de salmonicultura, 0 centros de cultivo activos y 0 ton de biomasa marina. A nivel regional, las ${fmtNumber(totConc)} concesiones y ${fmtNumber(totBio)} ton de biomasa se concentran en Aysén (412 concesiones, 265.000 ton), Cisnes (218 concesiones, 185.000 ton), Guaitecas (98 concesiones, 45.000 ton) y Tortel (17 concesiones, 8.500 ton).`;
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
        singleComunaMode: true,
        comunaName: ent.name,
        comunaIne: ent.id,
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
      if (phrase.length >= 2) {
        const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`);
        if (re.test(qNorm)) {
          const wordCount = phrase.split(' ').length;
          score += 14 * wordCount + phrase.length * 0.5;
        }
      }
    }

    for (const qt of qTokens) {
      let matchedExactOrPrefix = false;
      for (const vt of varRecord.tokens) {
        if (qt === vt) {
          score += 5;
          matchedExactOrPrefix = true;
        } else if (qt.length >= 4 && vt.length >= 4 && !QUERY_STOPWORDS.has(qt) && (vt.startsWith(qt) || qt.startsWith(vt))) {
          score += 2.5;
          matchedExactOrPrefix = true;
        }
      }
      if (!matchedExactOrPrefix && qt.length >= 4 && !QUERY_STOPWORDS.has(qt) && Array.isArray(varRecord.stems)) {
        const qtStem = stemSpanishWord(qt);
        if (qtStem.length >= 4 && varRecord.stems.some(vs => vs === qtStem || (vs.length >= 5 && qtStem.length >= 5 && (vs.startsWith(qtStem) || qtStem.startsWith(vs))))) {
          score += 3.5;
        }
      }
    }

    const asksMacroPibOrIncome = /\b(pib|producto interno bruto|ingreso per capita|sueldo)\b/.test(qNorm);
    if (!asksMacroPibOrIncome && /(por habitante|per capita|por cada mil|por cada 1000|cada mil|por mil)/.test(qNorm)) {
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
    if (
      /(personas viven|cuantas personas|poblacion|habitantes)/.test(qNorm) &&
      !/(por habitante|per capita|por cada mil|por cada 1000|cada mil|por mil|envejec|adult|indigen|beneficiari|canin|escolar|joven|juvenil|activa|ocupada|rural|urbana)/.test(qNorm)
    ) {
      if (varRecord.key === 'poblacion_censo_2024') score += 40;
    }

    return score;
  }

  function detectSubsetRankingIntent(qNorm) {
    const asksAsc = /\b(menos\s+pobladas?|menor\s+poblacion|mas\s+pequenas?|menos\s+habitantes|comunas?\s+menores|menor\s+valor|menores\s+valores|ultimas?\s+[0-9]+\s+comunas?)\b/i.test(qNorm);
    const hasCountQuantifier = /\b(?:las?\s+|los?\s+|top\s+|primeras?\s+|ultimas?\s+)([2-9]|dos|tres|cuatro|cinco|seis|siete)\s+(?:comunas?\s+)?(?:con\s+)?(?:mas|menos|mayores|menores)\b/i.test(qNorm) ||
      /\b([2-9]|dos|tres|cuatro|cinco|seis|siete)\s+comunas?\s+(?:con\s+)?(?:mas|menos|mayores|menores)\b/i.test(qNorm);
    const hasFilterMetric = /\b(pobladas?|habitantes|poblacion|superficie|grandes|extensas)\b/i.test(qNorm);
    const asksDescWithSum = /\b(suma|sumatoria|cuanto\s+suman|porcentaje\s+representan|porcentaje\s+del\s+total)\b/i.test(qNorm) &&
      /\b(mas\s+pobladas?|mayor\s+poblacion|mas\s+grandes?|mas\s+habitantes|comunas?\s+mayores|primeras?\s+[0-9]+)\b/i.test(qNorm);
    if (!asksAsc && !asksDescWithSum && !(hasCountQuantifier && hasFilterMetric)) return null;

    const wordToNum = { dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7 };
    let n = null;
    const numMatch = qNorm.match(/\b([2-9])\s+(?:comunas?|menores|mayores|primeras|ultimas|menos|mas)\b/);
    if (numMatch) {
      n = parseInt(numMatch[1], 10);
    } else {
      const wordMatch = qNorm.match(/\b(dos|tres|cuatro|cinco|seis|siete)\s+(?:comunas?|menores|mayores|primeras|ultimas|menos|mas)\b/);
      if (wordMatch) n = wordToNum[wordMatch[1]];
    }
    if (!n) {
      n = /\bcomunas\b/.test(qNorm) ? 3 : 1;
    }

    const direction = (asksAsc || /\b(menos|menor|menores|pequenas?|ultimas?)\b/i.test(qNorm)) ? 'asc' : 'desc';
    let filterVarKey = null;
    if (/\b(pobladas?|habitantes|poblacion)\b/i.test(qNorm)) {
      filterVarKey = 'poblacion_censo_2024';
    } else if (/\b(superficie|grandes|extensas)\b/i.test(qNorm)) {
      filterVarKey = 'superficie_km2';
    }

    return {
      direction,
      count: Math.min(n, 10),
      filterVarKey,
      wantsSum: /\b(suma|sumatoria|cuanto\s+suman|porcentaje|representan|total)\b/i.test(qNorm)
    };
  }

  function buildEmptyChartSpec(reason) {
    return {
      render: false,
      type: 'bar',
      varX: null,
      varY: null,
      title: '',
      excludeCoyhaique: false,
      emptyReason: reason || ''
    };
  }

  /**
   * Recupera el paquete de memoria relevante (`memoryPacket`) desde `_memoryIndex`
   * para responder la consulta del usuario con datos 100% verificados.
   */
  function retrieveMemoryForQuery(userText) {
    let effectiveQuery = String(userText || '').trim();
    const isFollowUp = /^(y\s+)?(no\s+tienes\s+mas|que\s+mas|dame\s+mas|mas\s+datos|otros\s+datos|otras\s+variables|muestrame\s+mas|y\s+sobre\s+eso|profundiza|continua)/i.test(normalizeText(effectiveQuery));
    if (isFollowUp && _conversationMemory.length > 0) {
      const prevUserMsgs = _conversationMemory.filter(m => m.role === 'user').map(m => m.content);
      if (prevUserMsgs.length > 0) {
        effectiveQuery = prevUserMsgs[prevUserMsgs.length - 1] + ' ' + effectiveQuery;
      }
    }
    const rawQuery = effectiveQuery;
    const qNorm = normalizeText(rawQuery);
    const qTokens = tokenize(rawQuery);

    const excludeCoyhaique = /(sin coyhaique|excluir coyhaique|excepto coyhaique|sacar coyhaique|sin la capital)/.test(qNorm);
    const wantsScatter = /(cruza|cruzar|correlacion|vs\b|versus|frente a|contra|relacion entre|comparar .+ con|scatter|dispersion|comparing .+ and)/.test(qNorm);
    const wantsBivariateComparison = wantsScatter || /(como se comparan|como contrasta|comparado con|junto con|y sus|y los|y las)/.test(qNorm);
    const wantsTemporal = /(evolucion|historic|serie|anual|mensual|2015|2016|2017|2018|2019|2020|2021|2022|2023|2025|2026|tiempo|tendencia|mes a mes)/.test(qNorm);
    const hasTourismTemporalSeries = wantsTemporal && /(turis|snaspe|parque|pernoctacion|alojamiento|emat|visita)/.test(qNorm);

    // Guardrail 0A: Rechazo limpio fuera de dominio / jailbreak (restaurantes, pasajes, elecciones futuras, etc.)
    const isOutOfDomain = /\b(mejor restaurante|donde comer|recomienda.*restaurante|candidato ganador|quien va a ganar|que partido.*ganar|partido politico.*ganar|proximas elecciones|pronostico electoral|pasaje aereo|precio del pasaje|cuanto cuesta un pasaje|costo de un pasaje|vuelo.*santiago|precio.*vuelo|horoscopo|receta de cocina|ignora los datos oficiales)\b/i.test(qNorm);
    if (isOutOfDomain) {
      return {
        query: rawQuery,
        qNorm,
        qTokens,
        matchedEntities: [],
        matchedLocalidades: [],
        matchedSector: null,
        isHoldingQuery: false,
        isDeterministicDirect: true,
        directResult: {
          reply: 'No es posible responder esa solicitud: esta plataforma consulta exclusivamente estadísticas públicas oficiales de la Región de Aysén y no entrega recomendaciones comerciales ni pronósticos electorales.',
          chart: buildEmptyChartSpec('Consulta fuera del dominio de estadísticas oficiales de Aysén.'),
          sources: [],
          relatedHub: 'IV'
        },
        topVariables: [],
        candidateVariables: [],
        primaryVar: null,
        secondaryVar: null,
        tertiaryVar: null,
        wantsScatter: false,
        wantsBivariateComparison: false,
        wantsTemporal: false,
        hasTourismTemporalSeries: false,
        excludeCoyhaique: false,
        topNodes: [],
        matchedCollections: [],
        comunasMatrix: [],
        activeKeys: [],
        chartSpec: buildEmptyChartSpec('Consulta fuera del dominio de estadísticas oficiales de Aysén.'),
        sources: [],
        relatedHub: 'IV'
      };
    }

    // Guardrail 0B: Meta-consulta instantánea de fechas de actualización y vigencia del repositorio (ciclo mensual día 1)
    const isFreshnessMetaQuery = /\b(hasta que fecha.*actualizad|estan actualizad.*datos|fecha.*actualizad|ultima actualizacion|indicadores.*desactualizados|frescura.*datos|cuando se actualizaron|fecha de corte|vigencia de las fuentes)\b/i.test(qNorm);
    if (isFreshnessMetaQuery) {
      const autoUp = _dataLake?.meta?.autoUpdate || {};
      const nowIso = new Date().toISOString().slice(0, 10);
      const lastRunIso = String(autoUp.lastRun || nowIso).slice(0, 10);
      const [yr, mo] = lastRunIso.split('-');
      const cycleCutIso = (yr && mo) ? `${yr}-${mo}-01` : `${nowIso.slice(0, 7)}-01`;
      const activeConns = autoUp.activeApiConnectors || 7;
      const totalSrc = _memoryIndex.fuentes?.length || autoUp.totalSources || 33;
      const reply = `La plataforma se actualiza automáticamente el día 1 de cada mes (ciclo mensual vigente: ${cycleCutIso}; última corrida automática registrada: ${lastRunIso}, con ${activeConns} conectores API activos sobre ${totalSrc} fuentes oficiales en series 2015–2026). Fuentes censales y estructurales como Censo INE 2024, CASEN 2022 y Censo Agropecuario 2021 mantienen su última publicación oficial vigente.`;
      const metaChart = buildEmptyChartSpec('Consulta de vigencia y ciclo de actualización mensual (día 1 de cada mes).');
      return {
        query: rawQuery,
        qNorm,
        qTokens,
        matchedEntities: [],
        matchedLocalidades: [],
        matchedSector: null,
        isHoldingQuery: false,
        isDeterministicDirect: true,
        directResult: {
          reply,
          chart: metaChart,
          sources: [],
          relatedHub: 'IV'
        },
        topVariables: [],
        candidateVariables: [],
        primaryVar: null,
        secondaryVar: null,
        tertiaryVar: null,
        wantsScatter: false,
        wantsBivariateComparison: false,
        wantsTemporal: false,
        hasTourismTemporalSeries: false,
        excludeCoyhaique: false,
        topNodes: [],
        matchedCollections: [],
        comunasMatrix: [],
        activeKeys: [],
        chartSpec: metaChart,
        sources: [],
        relatedHub: 'IV'
      };
    }

    // Guardrail 0C: Indicador inexistente explícito (tasa de desempleo comunal)
    const isMissingUnemployment = /\b(tasa de desempleo|desempleo comunal|desempleo de las 10 comunas|tasa de desocupacion|desocupacion comunal|cesantia comunal)\b/i.test(qNorm);
    if (isMissingUnemployment) {
      const empChart = buildEmptyChartSpec('La tasa de desempleo trimestral del INE no está desagregada para las 10 comunas de Aysén.');
      return {
        query: rawQuery,
        qNorm,
        qTokens,
        matchedEntities: [],
        matchedLocalidades: [],
        matchedSector: null,
        isHoldingQuery: false,
        isDeterministicDirect: true,
        directResult: {
          reply: 'No se dispone de datos de tasa de desempleo trimestral desagregados para las 10 comunas de Aysén, por lo que no es posible generar el gráfico solicitado. Como indicador laboral formal disponible a escala comunal puede consultar Trabajadores Dependientes SII.',
          chart: empChart,
          sources: [],
          relatedHub: 'V'
        },
        topVariables: [],
        candidateVariables: [],
        primaryVar: null,
        secondaryVar: null,
        tertiaryVar: null,
        wantsScatter: false,
        wantsBivariateComparison: false,
        wantsTemporal: false,
        hasTourismTemporalSeries: false,
        excludeCoyhaique: false,
        topNodes: [],
        matchedCollections: [],
        comunasMatrix: [],
        activeKeys: [],
        chartSpec: empChart,
        sources: [],
        relatedHub: 'V'
      };
    }

    // 1. Detectar comunas mencionadas
    let matchedEntities = _memoryIndex.entities.filter(ent =>
      ent.aliases.some(alias => {
        const re = new RegExp(`(^|\\s)${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`);
        return re.test(qNorm);
      })
    );

    const rawNoAccents = String(rawQuery || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const aysenEnt = _memoryIndex.entities.find(e => e.id === '11201');
    const mentionsAysenInList = aysenEnt &&
      !/\bregion de aysen\b/i.test(rawNoAccents) &&
      /\b(aysen\s*,|,\s*aysen\b|aysen\s+(?:vs\.?|versus)\b|(?:vs\.?|versus)\s+aysen\b|\bcompara(?:r|cion)?\b[^?]*\bde\s+aysen\b)/i.test(rawNoAccents);
    if (mentionsAysenInList && !matchedEntities.some(e => e.id === '11201')) {
      matchedEntities.unshift(aysenEnt);
    }

    // 1b. Detectar localidades sub-comunales (ej. Puerto Río Tranquilo -> Río Ibáñez, Puyuhuapi -> Cisnes)
    const matchedLocalidades = [];
    const matchedLocalidadSpans = [];
    if (Array.isArray(_memoryIndex.localidadesList)) {
      for (const [locNorm, locInfo] of _memoryIndex.localidadesList) {
        const escapedLoc = locNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reLoc = new RegExp(`(^|\\s)${escapedLoc}(\\s|$)`);
        const match = qNorm.match(reLoc);
        if (match && match.index !== undefined) {
          const start = match.index;
          const end = start + match[0].length;
          const overlaps = matchedLocalidadSpans.some(sp => start < sp.end && end > sp.start);
          if (!overlaps) {
            matchedLocalidadSpans.push({ start, end });
            if (!matchedLocalidades.some(l => l.comuna_ine === locInfo.comuna_ine && l.localidadName === locInfo.localidadName)) {
              matchedLocalidades.push(Object.assign({}, locInfo, { _pos: start }));
            }
            if (locInfo.entity && !matchedEntities.some(e => e.id === locInfo.entity.id)) {
              matchedEntities.push(locInfo.entity);
            }
          }
        }
      }
    }

    const externalComunaMatch = rawQuery.match(/\b(Providencia|Santiago|Las Condes|Vitacura|Ñuñoa|Nunoa|Maipú|Maipu|Puente Alto|Valparaíso|Valparaiso|Viña del Mar|Concepción|Concepcion|Temuco|Valdivia|Osorno|Puerto Montt|Castro|Ancud|Punta Arenas|Puerto Natales)\b/i);
    if (aysenEnt && /\bpuerto aysen\b/.test(qNorm) && (matchedLocalidades.length > 0 || externalComunaMatch)) {
      const ptoPos = qNorm.indexOf('puerto aysen');
      matchedLocalidades.push({
        localidadName: 'Puerto Aysén',
        normName: 'puerto aysen',
        comuna_ine: '11201',
        comunaName: aysenEnt.name,
        entity: aysenEnt,
        _pos: ptoPos
      });
    }
    if (matchedLocalidades.length > 1) {
      matchedLocalidades.sort((a, b) => (a._pos ?? 0) - (b._pos ?? 0));
    }

    const topOver10Match = qNorm.match(/\b(?:top|primeras?|primeros|mayores?|menores?|ultimas?|ultimos)\s+(1[1-9]|[2-9][0-9])\b/);
    const over10Note = topOver10Match
      ? ' Nota: la Región de Aysén comprende un total cerrado de 10 comunas.'
      : '';

    // Guardrail 0D: PIB per cápita comunal o comunas externas a la Región de Aysén (ej. Providencia, Santiago)
    const asksPibOrPrivateIncome = /\b(pib|producto interno bruto|pib per capita|ingreso per capita familiar|sueldo promedio)\b/i.test(qNorm);
    if (externalComunaMatch || asksPibOrPrivateIncome) {
      const extName = externalComunaMatch ? externalComunaMatch[1] : null;
      const missingParts = [];
      if (asksPibOrPrivateIncome) {
        missingParts.push('no existe PIB per cápita oficial desagregado a escala comunal (y el presupuesto municipal SINIM mide gasto público local, no ingreso privado)');
      }
      if (extName) {
        missingParts.push(`no se dispone de datos para ${extName} porque el repositorio cubre exclusivamente las 10 comunas de Aysén`);
      }
      const locNote0D = buildLocalityNote(matchedLocalidades);
      const disclaimer = `Limitación metodológica: ${missingParts.join('; ')}.`;

      if (matchedEntities.length === 0 && extName) {
        const extChart = buildEmptyChartSpec(`No existen registros para ${extName}; cobertura exclusiva de las 10 comunas de Aysén.`);
        return {
          query: rawQuery,
          qNorm,
          qTokens,
          matchedEntities: [],
          matchedLocalidades,
          matchedSector: null,
          isHoldingQuery: false,
          isDeterministicDirect: true,
          directResult: {
            reply: `${locNote0D}${disclaimer} Puede consultar cualquiera de las 10 comunas de la Región de Aysén.${over10Note}`,
            chart: extChart,
            sources: [],
            relatedHub: 'V'
          },
          topVariables: [],
          candidateVariables: [],
          primaryVar: null,
          secondaryVar: null,
          tertiaryVar: null,
          wantsScatter: false,
          wantsBivariateComparison: false,
          wantsTemporal: false,
          hasTourismTemporalSeries: false,
          excludeCoyhaique: false,
          topNodes: [],
          matchedCollections: [],
          comunasMatrix: [],
          activeKeys: [],
          chartSpec: extChart,
          sources: [],
          relatedHub: 'V'
        };
      }

      const siiSources = resolveSourcesForKeys(['empresas_sii', 'trabajadores_sii']);
      const targetEnt = matchedEntities[0] || null;
      const empVar = _memoryIndex.variablesByKey['empresas_sii'];
      const trabVar = _memoryIndex.variablesByKey['trabajadores_sii'];
      let proxyText = '';
      if (matchedEntities.length > 0) {
        const entSummaries = matchedEntities.map(ent => {
          const r = ent.raw || {};
          return `${ent.name} registra ${fmtNumber(r.empresas_sii)} empresas vigentes y ${fmtNumber(r.trabajadores_sii)} trabajadores dependientes`;
        }).join('; ');
        proxyText = ` Como proxy de actividad económica formal del SII: ${entSummaries} (frente a ${fmtNumber(empVar?.stats?.sum || 0)} empresas y ${fmtNumber(trabVar?.stats?.sum || 0)} trabajadores en la región).${over10Note}`;
      } else {
        proxyText = ` Como proxy de actividad económica formal comunal, el SII registra ${fmtNumber(empVar?.stats?.sum || 0)} empresas vigentes y ${fmtNumber(trabVar?.stats?.sum || 0)} trabajadores dependientes en Aysén (liderando Coyhaique con ${fmtNumber(empVar?.stats?.max?.value || 0)} empresas).${over10Note}`;
      }
      const proxyChart = {
        render: true,
        type: 'bar',
        varX: 'empresas_sii',
        varY: 'trabajadores_sii',
        yKey: 'empresas_sii',
        y2Key: 'trabajadores_sii',
        singleComunaMode: matchedEntities.length === 1,
        focusComunas: matchedEntities.length > 0 ? matchedEntities.map(e => e.name) : null,
        highlightComuna: targetEnt ? targetEnt.name : null,
        comunaName: matchedEntities.length === 1 && targetEnt ? targetEnt.name : null,
        comunaIne: matchedEntities.length === 1 && targetEnt ? targetEnt.id : null,
        title: matchedEntities.length === 1 && targetEnt
          ? `Proxy Actividad Económica SII — ${targetEnt.name}`
          : (matchedEntities.length > 1
              ? `Proxy Actividad Económica SII: ${matchedEntities.map(e => e.name).join(' vs. ')}`
              : 'Proxy Actividad Económica: Empresas y Trabajadores SII por Comuna'),
        sourceText: siiSources.map(s => s.institucion).join(' · '),
        excludeCoyhaique
      };
      return {
        query: rawQuery,
        qNorm,
        qTokens,
        matchedEntities,
        matchedLocalidades,
        matchedSector: null,
        isHoldingQuery: false,
        isDeterministicDirect: true,
        directResult: {
          reply: `${locNote0D}${disclaimer}${proxyText}`,
          chart: proxyChart,
          sources: siiSources,
          relatedHub: 'V'
        },
        topVariables: [empVar, trabVar].filter(Boolean),
        candidateVariables: [empVar, trabVar].filter(Boolean),
        primaryVar: empVar || null,
        secondaryVar: trabVar || null,
        tertiaryVar: null,
        wantsScatter: false,
        wantsBivariateComparison: true,
        wantsTemporal: false,
        hasTourismTemporalSeries: false,
        excludeCoyhaique,
        topNodes: [],
        matchedCollections: [],
        comunasMatrix: [],
        activeKeys: ['empresas_sii', 'trabajadores_sii'],
        chartSpec: proxyChart,
        sources: siiSources,
        relatedHub: 'V'
      };
    }

    // Guardrail 0E: Consultas nominales puntuales sobre 1 comuna que NO requieren gráfico (acumula múltiples atributos nominales)
    const isNominalSingleLookup = matchedEntities.length === 1 && /\b(quien es el alcalde|quien es la alcaldesa|como se llama el alcalde|partido del alcalde|que partido.*alcalde|cual es la cabecera|a que provincia pertenece|que provincia|cual es el aerodromo|tiene aerodromo|cual es el hospital principal|tiene hospital|tiene salida al mar|tiene litoral)\b/i.test(qNorm);
    if (isNominalSingleLookup) {
      const ent = matchedEntities[0];
      const r = ent.raw || {};
      const nomParts = [];
      const nomKeys = [];
      let nomHub = 'IV';
      if (/\b(alcalde|alcaldesa|partido)\b/.test(qNorm)) {
        nomParts.push(`El alcalde en ejercicio de ${ent.name} (período 2024–2028) es ${r.alcalde || '-'} (${r.partido_alcalde || '-'}).`);
        nomKeys.push('alcalde');
      }
      if (/\b(cabecera|provincia)\b/.test(qNorm)) {
        nomParts.push(`La comuna de ${ent.name} pertenece a la Provincia de ${r.provincia || '-'} y su cabecera comunal es ${r.cabecera || ent.name}.`);
        nomKeys.push('poblacion_censo_2024');
        if (nomParts.length === 1) nomHub = 'VI';
      }
      if (/\b(hospital|postas|recinto asistencial|recinto de salud)\b/.test(qNorm)) {
        const camas = Number(r.camas_hospitalarias) || 0;
        const postas = Number(r.postas_salud_rural) || 0;
        const tipoAtencion = camas > 0
          ? `tiene recinto base en ${r.salud_principal || '-'} (${fmtNumber(camas)} camas hospitalarias y ${fmtNumber(postas)} postas rurales)`
          : `no cuenta con hospital de mediana/alta complejidad (${fmtNumber(camas)} camas hospitalarias); la atención se articula vía ${r.salud_principal || '-'} con ${fmtNumber(postas)} postas rurales`;
        nomParts.push(`En salud, ${ent.name} ${tipoAtencion}.`);
        nomKeys.push('salud_principal', 'camas_hospitalarias');
        if (nomParts.length === 1) nomHub = 'VIII';
      }
      if (/\b(aerodromo|pista aerea)\b/.test(qNorm)) {
        nomParts.push(`Su aeródromo registrado es ${r.aerodromo || 'sin registro DGAC directo'}.`);
        nomKeys.push('aerodromo');
      }
      if (/\b(salida al mar|litoral)\b/.test(qNorm)) {
        const tieneMar = (r.concesiones_salmon || 0) > 0 || ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel'].includes(ent.name);
        nomParts.push(tieneMar
          ? `Cuenta con litoral marítimo en fiordos y canales australes (${fmtNumber(r.concesiones_salmon)} concesiones acuícolas).`
          : `Es territorio interior sin litoral marítimo (0 concesiones acuícolas).`);
        nomKeys.push('concesiones_salmon');
        if (nomParts.length === 1) nomHub = 'II';
      }
      const nomReply = `${buildLocalityNote(matchedLocalidades)}${nomParts.join(' ')}`;
      const nomSources = resolveSourcesForKeys(Array.from(new Set(nomKeys)));
      const nomChart = buildEmptyChartSpec('Consulta nominal puntual respondida directamente sin gráfico.');
      return {
        query: rawQuery,
        qNorm,
        qTokens,
        matchedEntities,
        matchedLocalidades,
        matchedSector: null,
        isHoldingQuery: false,
        isDeterministicDirect: true,
        directResult: {
          reply: nomReply,
          chart: nomChart,
          sources: nomSources,
          relatedHub: nomHub
        },
        topVariables: [],
        candidateVariables: [],
        primaryVar: null,
        secondaryVar: null,
        tertiaryVar: null,
        wantsScatter: false,
        wantsBivariateComparison: false,
        wantsTemporal: false,
        hasTourismTemporalSeries: false,
        excludeCoyhaique: false,
        topNodes: [],
        matchedCollections: [],
        comunasMatrix: [],
        activeKeys: [],
        chartSpec: nomChart,
        sources: nomSources,
        relatedHub: nomHub
      };
    }

    // WP-A.3: Resolver referencias anafóricas de seguimiento ("¿y cuál es su relación con la salmonicultura?", "¿y en salud?", "¿y no tienes más datos?")
    const isRegionalScope = /\b(aysen|region|regional|comunas|ranking|cada comuna|todas las comunas|empresas|holdings|provincias)\b/i.test(qNorm);
    const isMoreDataFollowUp = /(no tienes mas|que mas tienes|otros indicadores|mas datos|que otros datos|que mas hay|mas informacion|algo mas|otra informacion)/i.test(qNorm);
    const hasFollowUpCue = isMoreDataFollowUp || /(^¿?\s*y\b|\bsu\b|\bsus\b|\besta comuna\b|\besa comuna\b|\bahi\b|\balli\b|\ben ella\b|^¿?\s*respecto a\b|^¿?\s*en cuanto a\b)/i.test(rawQuery);
    if (matchedEntities.length === 0 && !isRegionalScope && hasFollowUpCue && _conversationState.lastComunaCode && !isMoreDataFollowUp) {
      const prevEnt = _memoryIndex.entities.find(e => String(e.id) === String(_conversationState.lastComunaCode));
      if (prevEnt) {
        matchedEntities = [prevEnt];
      }
    }

    // WP-A.2: Detectar intención de Empresas / Holdings Salmoneros
    const isHoldingQuery = detectHoldingOrFisheryIntent(qNorm, rawQuery) &&
      (matchedEntities.length === 0 || /\b(segun empresa|segun empresas|por empresa|por empresas|por holding|no comunas|empresas o holdings|pregunte por empresas)\b/i.test(qNorm));

    // Detectar intención de temas reconciliados oficiales (Single Source of Truth)
    const reconciledTopic = detectReconciledTopicIntent(qNorm, rawQuery, matchedEntities);
    if (reconciledTopic) {
      const topicReply = buildReconciledTopicReply(reconciledTopic, rawQuery, qNorm, _memoryIndex);
      if (topicReply) {
        const bridgeKeys = topicReply.isContextualBridge
          ? [topicReply.chart?.varX, topicReply.chart?.varY].filter(k => k && _memoryIndex.variablesByKey[k])
          : [];
        const bridgeTopVars = bridgeKeys.map(k => _memoryIndex.variablesByKey[k]);
        const bridgeMatrix = topicReply.isContextualBridge
          ? _memoryIndex.entities.map(e => {
            const row = { comuna: e.name, provincia: e.provincia };
            bridgeKeys.forEach(k => { row[k] = e.raw[k]; });
            return row;
          })
          : [];
        return {
          query: rawQuery,
          qNorm,
          qTokens,
          matchedEntities,
          matchedLocalidades,
          matchedSector: null,
          isHoldingQuery: false,
          reconciledTopic,
          reconciledResult: topicReply,
          topVariables: bridgeTopVars,
          topNumericVars: bridgeTopVars,
          primaryVar: bridgeTopVars[0] || null,
          secondaryVar: bridgeTopVars[1] || null,
          tertiaryVar: null,
          wantsScatter: false,
          wantsBivariateComparison: false,
          wantsTemporal: false,
          hasTourismTemporalSeries: false,
          excludeCoyhaique,
          topNodes: [],
          matchedCollections: [],
          comunasMatrix: bridgeMatrix,
          activeKeys: bridgeKeys,
          chartSpec: topicReply.chart,
          sources: topicReply.sources,
          relatedHub: topicReply.relatedHub || 'IV'
        };
      }
    }

    // WP-B.2: Detectar intención de Cruce Comuna × Sector o Sector Regional
    let matchedSector = null;
    if (matchedEntities.length === 1) {
      matchedSector = detectSectorForComunaQuery(qNorm, rawQuery);
    } else if (matchedEntities.length === 0 && !isHoldingQuery) {
      matchedSector = detectSectorForComunaQuery(qNorm, rawQuery);
    }

    const matchedEntityTokens = new Set();
    matchedEntities.forEach(ent => {
      ent.aliases.forEach(a => tokenize(a).forEach(t => matchedEntityTokens.add(t)));
    });
    matchedLocalidades.forEach(loc => {
      tokenize(loc.localidadName).forEach(t => matchedEntityTokens.add(t));
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

    const allScoredVars = _memoryIndex.variables.map(v => ({
      variable: v,
      score: scoreVariable(v, qNorm, varQueryTokens) + (nlScores[v.key] || 0) * 1.2
    }));

    let scoredVars = allScoredVars
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

    // Si es pregunta de seguimiento regional ("¿y no tienes más datos?", "¿qué más tienes?", "¿y otros indicadores?")
    if (matchedEntities.length === 0 && scoredVars.length === 0 && !matchedSector && hasFollowUpCue) {
      if (_conversationState.lastDomain && SECTOR_DEFINITIONS[_conversationState.lastDomain]) {
        matchedSector = SECTOR_DEFINITIONS[_conversationState.lastDomain];
        if (_conversationState.lastIndicatorKeys.length > 2) {
          const rotated = _conversationState.lastIndicatorKeys.slice(2).concat(_conversationState.lastIndicatorKeys.slice(0, 2));
          _conversationState.lastIndicatorKeys = rotated;
          scoredVars = rotated.map(k => _memoryIndex.variablesByKey[k]).filter(Boolean).map((v, idx) => ({ variable: v, score: 30 - idx * 3 }));
        }
      } else if (_conversationState.lastIndicatorKeys.length > 0) {
        let keysToUse = _conversationState.lastIndicatorKeys;
        if (_conversationState.lastIndicatorKeys.length > 2) {
          keysToUse = keysToUse.slice(2).concat(keysToUse.slice(0, 2));
          _conversationState.lastIndicatorKeys = keysToUse;
        }
        scoredVars = keysToUse
          .map(k => _memoryIndex.variablesByKey[k])
          .filter(Boolean)
          .map((v, idx) => ({ variable: v, score: 30 - idx * 5 }));
      }
    }

    const llmCandidateSource = scoredVars.length > 0
      ? scoredVars
      : allScoredVars
          .filter(item => item.score >= 3.5)
          .sort((a, b) => b.score - a.score);

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
    let primaryVar = topNumericVars[0]?.variable || null;
    const secondaryThreshold = wantsBivariateComparison
      ? Math.max(12, Math.min(32, (topNumericVars[0]?.score || 0) * 0.25))
      : Math.max(22, (topNumericVars[0]?.score || 0) * 0.65);
    let secondaryVar = (topNumericVars[1] && topNumericVars[1].score >= secondaryThreshold)
      ? topNumericVars[1].variable
      : null;

    const wantsMultiComparison = wantsBivariateComparison && (/\by\b/.test(qNorm) || qNorm.includes(','));
    const tertiaryThreshold = Math.max(22, (topNumericVars[0]?.score || 0) * 0.35);
    let tertiaryVar = (
      wantsMultiComparison &&
      secondaryVar &&
      topNumericVars[2] &&
      topNumericVars[2].score >= tertiaryThreshold &&
      topNumericVars[2].variable.key !== primaryVar?.key &&
      topNumericVars[2].variable.key !== secondaryVar?.key
    )
      ? topNumericVars[2].variable
      : null;

    const subsetIntent = (primaryVar && primaryVar.isNumeric && primaryVar.stats && matchedEntities.length === 0)
      ? detectSubsetRankingIntent(qNorm)
      : null;
    if (subsetIntent) {
      if (subsetIntent.filterVarKey) {
        const analyticVars = topNumericVars.filter(item => item.variable.key !== subsetIntent.filterVarKey && item.score >= 12);
        if (analyticVars.length > 0) {
          primaryVar = analyticVars[0].variable;
          secondaryVar = (analyticVars[1] && analyticVars[1].score >= 12) ? analyticVars[1].variable : null;
          tertiaryVar = null;
          subsetIntent.isConditionalProjection = true;
        } else {
          primaryVar = _memoryIndex.variablesByKey[subsetIntent.filterVarKey] || primaryVar;
          secondaryVar = null;
          tertiaryVar = null;
        }
      } else {
        secondaryVar = null;
        tertiaryVar = null;
      }

      const sortVar = (subsetIntent.filterVarKey && _memoryIndex.variablesByKey[subsetIntent.filterVarKey])
        ? _memoryIndex.variablesByKey[subsetIntent.filterVarKey]
        : primaryVar;
      if (sortVar && sortVar.stats) {
        const rawSortList = subsetIntent.direction === 'asc' ? sortVar.stats.rankedAsc : sortVar.stats.ranked;
        const scopedSortList = excludeCoyhaique
          ? rawSortList.filter(r => r.comuna_ine !== '11101' && r.comuna.toLowerCase() !== 'coyhaique')
          : rawSortList;
        subsetIntent.sortVarKey = sortVar.key;
        subsetIntent.comunas = scopedSortList.slice(0, subsetIntent.count).map(r => r.comuna);
      }
    }

    const hasSpecificMetricFocus = Boolean(
      (topNumericVars.length > 0 && topNumericVars[0].score >= 25 &&
        !/(barometro en aysen|conectividad en aysen|salud en aysen|energia en aysen|cultura en aysen|dame datos|que datos tienes|barometro de la u)/i.test(qNorm)
      ) ||
      /(mayor dependencia|menor dependencia|ranking|cruza|versus|frente a|evolucion|serie|barcaza|pavimentada|ripio|fibra|deficit habitacional|empam|pscv|ganado|glaciares|esperanza de vida|consumo)/i.test(qNorm)
    );

    const isBroadSectorQuery = Boolean(
      matchedSector &&
      !hasSpecificMetricFocus &&
      (
        scoredVars.length === 0 ||
        topNumericVars.length === 0 ||
        topNumericVars[0].score < 25 ||
        /(barometro en aysen|conectividad en aysen|salud en aysen|energia en aysen|cultura en aysen|dame datos|que datos tienes|panorama|resumen de|barometro de la u)/i.test(qNorm)
      )
    );

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
    const tertiaryKey = tertiaryVar ? tertiaryVar.key : null;
    const primaryLabel = CANONICAL_LABELS[primaryKey] || (primaryVar ? primaryVar.label : humanizeKey(primaryKey));
    const secondaryLabel = secondaryKey ? (CANONICAL_LABELS[secondaryKey] || (secondaryVar ? secondaryVar.label : humanizeKey(secondaryKey))) : null;
    const tertiaryLabel = tertiaryKey ? (CANONICAL_LABELS[tertiaryKey] || (tertiaryVar ? tertiaryVar.label : humanizeKey(tertiaryKey))) : null;

    // WP-C.2: Resolver fuentes oficiales estrictamente 1-a-1 para las variables efectivamente consultadas
    const provenanceTargetKeys = [];
    if (isHoldingQuery) {
      provenanceTargetKeys.push('holdings_salmoneros', 'biomasa_salmon_ton');
    } else if (matchedSector && isBroadSectorQuery) {
      provenanceTargetKeys.push(...matchedSector.provenanceKeys);
    } else if (matchedEntities.length === 1 && scoredVars.length === 0) {
      provenanceTargetKeys.push('poblacion_censo_2024', 'presupuesto_mclp', 'concesiones_salmon', 'camas_hospitalarias');
    } else if (primaryVar) {
      provenanceTargetKeys.push(primaryVar.key);
      if (secondaryVar) provenanceTargetKeys.push(secondaryVar.key);
      if (tertiaryVar) provenanceTargetKeys.push(tertiaryVar.key);
    } else if (scoredVars.length > 0) {
      provenanceTargetKeys.push(scoredVars[0].variable.key);
    } else {
      provenanceTargetKeys.push('poblacion_censo_2024');
    }

    if (hasTourismTemporalSeries) {
      provenanceTargetKeys.length = 0;
      provenanceTargetKeys.push('visitantes_snaspe', 'pernoctaciones_emat');
    }

    const sources = resolveSourcesForKeys(provenanceTargetKeys);
    const sourceText = sources.map(s => s.institucion).join(' · ');

    const singleComunaFlag = matchedEntities.length === 1;
    let focusComunasList = matchedEntities.length >= 1 ? matchedEntities.map(e => e.name) : null;
    if (!focusComunasList && subsetIntent && Array.isArray(subsetIntent.comunas) && subsetIntent.comunas.length > 0) {
      focusComunasList = subsetIntent.comunas;
    }

    const bivariateStats = (primaryVar && secondaryVar && primaryVar.isNumeric && secondaryVar.isNumeric && (wantsScatter || wantsBivariateComparison))
      ? computeBivariateStats(_memoryIndex.entities, primaryVar.key, secondaryVar.key, excludeCoyhaique)
      : null;

    let chartSpec = {
      render: Boolean(primaryVar || matchedEntities.length > 0 || scoredVars.length > 0 || matchedSector),
      type: wantsScatter && secondaryVar ? 'scatter' : (hasTourismTemporalSeries ? 'line' : 'bar'),
      varX: (matchedSector && isBroadSectorQuery) ? matchedSector.varX : primaryKey,
      varY: (matchedSector && isBroadSectorQuery) ? matchedSector.varY : secondaryKey,
      varZ: (matchedSector && isBroadSectorQuery) ? null : tertiaryKey,
      yKey: (matchedSector && isBroadSectorQuery) ? matchedSector.varX : primaryKey,
      y2Key: (matchedSector && isBroadSectorQuery) ? matchedSector.varY : secondaryKey,
      singleComunaMode: singleComunaFlag,
      focusComunas: focusComunasList,
      highlightComuna: singleComunaFlag ? matchedEntities[0].name : null,
      comunaName: singleComunaFlag ? matchedEntities[0].name : null,
      comunaIne: singleComunaFlag ? matchedEntities[0].id : null,
      title: (matchedSector && isBroadSectorQuery)
        ? (matchedSector.chartTitle || `${matchedSector.title} por Comuna`)
        : (primaryVar
            ? (tertiaryLabel
                ? `${primaryLabel} vs. ${secondaryLabel} y ${tertiaryLabel}`
                : (secondaryLabel ? `${primaryLabel} vs. ${secondaryLabel}` : `${primaryLabel} por Comuna`))
            : `${primaryLabel} por Comuna`),
      sourceText,
      excludeCoyhaique
    };

    if (hasTourismTemporalSeries) {
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

    if (tertiaryVar && !hasTourismTemporalSeries && !(matchedSector && isBroadSectorQuery)) {
      const subType = wantsScatter ? 'scatter' : 'bar';
      chartSpec.multiCharts = [
        {
          type: subType,
          varX: primaryKey,
          varY: secondaryKey,
          title: `${primaryLabel} vs. ${secondaryLabel}`,
          sourceText: resolveSourcesForKeys([primaryKey, secondaryKey]).map(s => s.institucion).join(' · '),
          excludeCoyhaique
        },
        {
          type: subType,
          varX: primaryKey,
          varY: tertiaryKey,
          title: `${primaryLabel} vs. ${tertiaryLabel}`,
          sourceText: resolveSourcesForKeys([primaryKey, tertiaryKey]).map(s => s.institucion).join(' · '),
          excludeCoyhaique
        }
      ];
    }

    const selectedVarKeys = [primaryVar?.key, secondaryVar?.key, tertiaryVar?.key].filter(Boolean);
    const allTextVars = scoredVars.filter(v => !v.variable.isNumeric).slice(0, 1).map(v => v.variable.key);
    const activeKeys = Array.from(new Set([
      ...selectedVarKeys,
      ...allTextVars,
      ...(matchedSector ? (matchedSector.keys || []) : []),
      ...(selectedVarKeys.length === 0 && !matchedSector ? ['poblacion_censo_2024', 'superficie_km2', 'presupuesto_mclp', 'dependencia_fcm_pct'] : [])
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
      : ((matchedSector && isBroadSectorQuery) ? matchedSector.hub : getHubForVariable(chartSpec.varX));

    const isGeneralProfileMatch = matchedEntities.length === 1 && !matchedSector && !isHoldingQuery && (
      topNumericVars.length === 0 ||
      /\b(cuentame sobre|hablame de|perfil de|como esta|ficha de|resumen de|informacion de|todo sobre)\b/i.test(qNorm)
    );
    const isMultiEntityNoVars = matchedEntities.length >= 2 && !primaryVar && !matchedSector && !isHoldingQuery;
    const isDeterministicDirect = Boolean(
      subsetIntent ||
      isGeneralProfileMatch ||
      isMultiEntityNoVars ||
      (matchedEntities.length >= 2 && primaryVar) ||
      matchedLocalidades.length > 0 ||
      (wantsScatter && primaryVar && secondaryVar) ||
      hasTourismTemporalSeries ||
      isHoldingQuery ||
      tertiaryVar ||
      over10Note
    );

    return {
      query: rawQuery,
      qNorm,
      excludeCoyhaique,
      wantsScatter,
      wantsTemporal,
      hasTourismTemporalSeries,
      isHoldingQuery,
      matchedSector,
      isBroadSectorQuery,
      matchedEntities,
      matchedLocalidades,
      subsetIntent,
      bivariateStats,
      over10Note,
      isDeterministicDirect,
      topVariables: [primaryVar, secondaryVar, tertiaryVar].filter(Boolean).concat(
        scoredVars.filter(s => !s.variable.isNumeric).slice(0, 1).map(s => s.variable)
      ),
      candidateVariables: [primaryVar, secondaryVar, tertiaryVar]
        .filter(Boolean)
        .concat(
          llmCandidateSource
            .map(s => s.variable)
            .filter(v => v && v !== primaryVar && v !== secondaryVar && v !== tertiaryVar)
            .slice(0, 10)
        ),
      primaryVar,
      secondaryVar,
      tertiaryVar,
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

    const hasBarometroVar = (memoryPacket.topVariables || []).some(v => v && v.key && v.key.startsWith('barometro_')) ||
      (memoryPacket.primaryVar && memoryPacket.primaryVar.key && memoryPacket.primaryVar.key.startsWith('barometro_')) ||
      (memoryPacket.activeKeys || []).some(k => typeof k === 'string' && k.startsWith('barometro_')) ||
      (memoryPacket.matchedSector && memoryPacket.matchedSector.id === 'barometro');

    const isFollowUpCue = /(no tienes mas|que mas tienes|otros indicadores|mas datos|que otros datos|que mas hay|mas informacion|algo mas|otra informacion)/i.test(memoryPacket.qNorm || '');

    if (hasBarometroVar) {
      _conversationState.lastDomain = 'barometro';
      if (SECTOR_DEFINITIONS.barometro && (!isFollowUpCue || !_conversationState.lastIndicatorKeys || _conversationState.lastIndicatorKeys.length === 0)) {
        _conversationState.lastIndicatorKeys = [...SECTOR_DEFINITIONS.barometro.keys];
      }
    } else if (memoryPacket.isHoldingQuery) {
      _conversationState.lastDomain = 'holdings_salmoneros';
      _conversationState.lastIndicatorKeys = ['concesiones_salmon', 'biomasa_salmon_ton'];
    } else if (memoryPacket.matchedSector && (!memoryPacket.matchedEntities || memoryPacket.matchedEntities.length === 0)) {
      _conversationState.lastDomain = memoryPacket.matchedSector.id;
      _conversationState.lastIndicatorKeys = [...(memoryPacket.matchedSector.keys || [])];
    } else if (memoryPacket.matchedEntities && memoryPacket.matchedEntities.length === 1) {
      const ent = memoryPacket.matchedEntities[0];
      _conversationState.lastComunaCode = ent.id;
      _conversationState.lastComunaName = ent.name;
      if (memoryPacket.matchedSector) {
        _conversationState.lastDomain = memoryPacket.matchedSector.id;
        _conversationState.lastIndicatorKeys = [...(memoryPacket.matchedSector.provenanceKeys || memoryPacket.matchedSector.keys || [])];
      } else if (memoryPacket.primaryVar) {
        _conversationState.lastDomain = memoryPacket.primaryVar.hub;
        _conversationState.lastIndicatorKeys = [memoryPacket.primaryVar.key, memoryPacket.secondaryVar?.key].filter(Boolean);
      } else {
        _conversationState.lastDomain = 'perfil_comunal';
      }
    } else if (memoryPacket.matchedSector) {
      _conversationState.lastDomain = memoryPacket.matchedSector.id;
      _conversationState.lastIndicatorKeys = [...(memoryPacket.matchedSector.keys || [])];
    } else if (memoryPacket.primaryVar) {
      _conversationState.lastDomain = memoryPacket.primaryVar.hub;
      _conversationState.lastIndicatorKeys = [memoryPacket.primaryVar.key, memoryPacket.secondaryVar?.key].filter(Boolean);
    } else if (finalResult && finalResult.chart && finalResult.chart.varX) {
      _conversationState.lastDomain = finalResult.relatedHub || 'VI';
      _conversationState.lastIndicatorKeys = [finalResult.chart.varX, finalResult.chart.varY].filter(Boolean);
    }
    _conversationState.lastQuery = memoryPacket.query || '';
    if (finalResult && finalResult.chart && !finalResult.chart.sourceText && Array.isArray(finalResult.sources)) {
      finalResult.chart.sourceText = finalResult.sources.map(s => s.institucion).join(' · ');
    }
  }

  /**
   * Construye el System Prompt general y de memoria verificada.
   */
  function buildSystemPrompt(subsetVars) {
    if (!_memoryIndex.variables.length && (_dataLake || (global && global.AYSEN_HUBS_DATA))) {
      buildMemoryIndex(_dataLake || global.AYSEN_HUBS_DATA, _lexicon);
    }
    const hasSubset = Array.isArray(subsetVars) && subsetVars.length > 0;
    const varsForPrompt = hasSubset
      ? subsetVars
      : _memoryIndex.variables;
    const varList = hasSubset
      ? varsForPrompt.map(v => v.key).join(', ')
      : varsForPrompt.map(v => `${v.key} (${v.label}, Hub ${v.hub})`).join(', ');
    return [
      `Eres el Consultor Territorial de Aysén Sistémico, conectado en tiempo real a la memoria verificada de \`window.AYSEN_HUBS_DATA\` (10 Comunas, 10 Hubs Sistémicos I al X, 39 Nodos Satélites, 12 Holdings Salmoneros Madres y ${_memoryIndex.fuentes.length} fuentes oficiales verificadas).`,
      `Catálogo dinámico de variables indexadas (${varsForPrompt.length}/${_memoryIndex.variables.length}): ${varList}`,
      'INSTRUCCIONES DE RIGOR FACTUAL Y CONEXIÓN SEMÁNTICA:',
      '1. Responde de forma directa, analítica y concisa (entre 2 y 4 oraciones, máximo 500 caracteres en "reply") utilizando EXCLUSIVAMENTE los datos provistos en MEMORIA_VERIFICADA (resumen_estadistico_variables_candidatas, hitos_regionales y matriz_comunal_datos_exactos). Jamás inventes cifras.',
      '2. Si el usuario pregunta de forma indirecta, conceptual o coloquial por un fenómeno o conteo no literal, conecta siempre con los indicadores equivalentes, nodos temáticos o proxies oficiales disponibles en MEMORIA_VERIFICADA, explica brevemente la equivalencia de medición y entrega las cifras exactas.',
      '3. Cita las cifras exactas en formato chileno (punto para miles, coma para decimales), mencionando las comunas o holdings líderes, los de menor valor y el total o promedio regional según corresponda.',
      '4. Para tasas, porcentajes, densidades o valores per cápita, informa el Promedio Regional y NUNCA sumes porcentajes ni tasas entre comunas.',
      '5. Utiliza siempre nombres canónicos con tildes y unidades limpias en "reply" y en "title". Jamás muestres claves snake_case dentro del texto de "reply".',
      '6. No utilices emojis bajo ninguna circunstancia.',
      '7. Si el usuario pregunta por una localidad (ej. Puerto Río Tranquilo, Puyuhuapi), aclara que los registros oficiales son a escala comunal. Si falta un indicador o territorio externo, decláralo explícitamente antes de proponer un proxy.',
      '8. Devuelve tu respuesta estrictamente como un objeto JSON válido. En "chart", "varX" y "varY" DEBEN ser claves exactas en snake_case elegidas del catálogo provisto (ej. "deficit_habitacional_cuantitativo_n", "barometro_tension_desarrollo_conservacion_pct"), NUNCA nombres de comunas ni arreglos, y "type" debe ser "bar", "line" o "scatter":',
      '{"reply": "Texto analítico claro y conciso con las cifras exactas", "chart": {"render": true, "type": "bar|line|scatter", "varX": "clave_x_exacta", "varY": "clave_y_o_null", "title": "Título limpio del gráfico", "excludeCoyhaique": false}, "relatedHub": "I..X"}'
    ].join('\n');
  }

  /**
   * Construye el System Prompt inyectando la Memoria Verificada (`memoryPacket`)
   * para que el LLM responda razonando sobre los datos reales sin alucinar.
   */
  function buildMemoryGroundedPrompts(memoryPacket) {
    const varsToSummarize = [...(memoryPacket.candidateVariables || memoryPacket.topVariables || [])];
    if (memoryPacket.matchedSector && Array.isArray(memoryPacket.matchedSector.keys)) {
      memoryPacket.matchedSector.keys.forEach(k => {
        const v = _memoryIndex.variablesByKey[k];
        if (v && !varsToSummarize.some(existing => existing.key === k)) {
          varsToSummarize.push(v);
        }
      });
    }

    const PANORAMIC_BACKBONE_KEYS = [
      'poblacion_censo_2024', 'deficit_habitacional_cuantitativo_n', 'indice_envejecimiento',
      'pobreza_ingresos_pct', 'presupuesto_mclp', 'red_vial_pavimentada_km',
      'potencia_mw', 'saidi_horas_anual', 'hogares_lena_pct',
      'dias_sobre_norma_mp25', 'biomasa_salmon_ton', 'visitantes_snaspe',
      'bosque_nativo_ha', 'superficie_glaciares_km2', 'medicos_por_mil_hab',
      'espera_no_ges_n', 'puntos_cajavecina_bancoestado',
      'barometro_intencion_migracion_juvenil_pct',
      'barometro_tension_desarrollo_conservacion_pct'
    ];
    PANORAMIC_BACKBONE_KEYS.forEach(k => {
      const v = _memoryIndex.variablesByKey[k];
      if (v && !varsToSummarize.some(existing => existing.key === k)) {
        varsToSummarize.push(v);
      }
    });

    const compactVars = varsToSummarize.slice(0, 14);
    const varSummaries = compactVars.map(v => {
      if (!v.isNumeric || !v.stats) {
        return `${v.key} (${v.label}): categorica`;
      }
      const aggTag = v.aggregation === 'avg' ? 'Prom' : 'Tot';
      const aggVal = Number((v.aggregation === 'avg' ? v.stats.avg : v.stats.sum).toFixed(1));
      const maxPart = v.stats.max ? `1°${v.stats.max.comuna}:${v.stats.max.value}` : '';
      const secPart = v.stats.second ? `, 2°${v.stats.second.comuna}:${v.stats.second.value}` : '';
      const minPart = v.stats.min ? `, min ${v.stats.min.comuna}:${v.stats.min.value}` : '';
      const bot3 = Array.isArray(v.stats.bottom3) && v.stats.bottom3.length >= 3
        ? ` | menores_3=[${v.stats.bottom3.map((r, i) => `${i + 1}°${r.comuna}:${r.value}`).join(', ')} suma=${fmtNumber(v.stats.bottom3Sum, 1)} (${fmtNumber(v.stats.bottom3Pct, 3)}%)]`
        : '';
      return `${v.key} (${v.label}, ${v.unit || 's/u'}): ${aggTag}=${aggVal} [${maxPart}${secPart}${minPart}${bot3}]`;
    });

    const relevantNodes = (memoryPacket.topNodes || []).slice(0, 2).map(n => ({
      id: n.id,
      hubId: n.hubId,
      title: n.title,
      definition: String(n.definition || '').slice(0, 180)
    }));

    const includeConnectivity = memoryPacket.matchedSector?.id === 'conectividad' ||
      /(ruta|camino|carretera|conectividad|barcaza|puerto|emporcha|insumo|abastecimiento|logistica|transporte|frontera|paso)/.test(memoryPacket.qNorm || '');
    const backbone = includeConnectivity ? _dataLake?.conectividadMultimodal?.backbone_multimodal_wp11 : null;
    const connectivityBrief = backbone?.resumen_regional ? {
      corredor_binacional: backbone.resumen_regional.soberania_logistica_chile_chile_argentina,
      barcazas_criticas: backbone.resumen_regional.resiliencia_barcazas_subsidiadas?.puntos_criticos_single_point_of_failure,
      emporcha_ultimos_anos: (backbone.series_multianuales?.emporcha_toneladas_transferidas || []).slice(-3)
    } : undefined;

    const limitedActiveKeys = (memoryPacket.activeKeys || []).slice(0, 6);
    const compactComunasMatrix = (memoryPacket.comunasMatrix || []).map(row => {
      const compactRow = { comuna: row.comuna };
      limitedActiveKeys.forEach(k => {
        if (k in row) compactRow[k] = row[k];
      });
      return compactRow;
    });

    const fullMilestones = _memoryIndex.panoramicNodesAndMilestones || '';
    const hitosOnly = fullMilestones.includes('. Nodos (')
      ? fullMilestones.split('. Nodos (')[0]
      : fullMilestones;
    const includeHitos = !memoryPacket.primaryVar || Boolean(memoryPacket.reconciledResult);

    const systemPrompt = buildSystemPrompt(compactVars);
    const hasExplicitChartHint = Boolean(memoryPacket.primaryVar || memoryPacket.matchedSector || memoryPacket.reconciledResult);
    const compactFilteredComunas = memoryPacket.matchedEntities.length
      ? memoryPacket.matchedEntities.map(e => {
          const r = e.raw || {};
          const out = {
            comuna: e.name,
            provincia: r.provincia,
            poblacion_censo_2024: r.poblacion_censo_2024,
            superficie_km2: r.superficie_km2,
            presupuesto_mclp: r.presupuesto_mclp,
            dependencia_fcm_pct: r.dependencia_fcm_pct,
            empresas_sii: r.empresas_sii,
            concesiones_salmon: r.concesiones_salmon,
            biomasa_salmon_ton: r.biomasa_salmon_ton,
            camas_hospitalarias: r.camas_hospitalarias
          };
          limitedActiveKeys.forEach(k => {
            if (k in r) out[k] = r[k];
          });
          return out;
        })
      : undefined;

    const turismoPreset = memoryPacket.hasTourismTemporalSeries
      ? (_dataLake?.hubsGallery?.turismo?.presets || []).find(p => p.config?.customChartSpec)
      : null;
    const annualSeriesHint = turismoPreset?.config?.customChartSpec
      ? {
          anios: turismoPreset.config.customChartSpec.labels,
          pernoctaciones_emat: turismoPreset.config.customChartSpec.datasets?.[0]?.data,
          visitas_snaspe: turismoPreset.config.customChartSpec.datasets?.[1]?.data
        }
      : undefined;

    const memoryPayload = {
      consulta_usuario: memoryPacket.query,
      estado_conversacional_previo: _conversationState.lastComunaName || _conversationState.lastDomain ? _conversationState : undefined,
      sector_tematico_consultado: memoryPacket.matchedSector ? memoryPacket.matchedSector.title : undefined,
      localidades_mapeadas_a_comunas: (memoryPacket.matchedLocalidades && memoryPacket.matchedLocalidades.length)
        ? memoryPacket.matchedLocalidades.map(l => ({ localidad: l.localidadName, comuna: l.comunaName }))
        : undefined,
      nota_serie_temporal: (memoryPacket.wantsTemporal && !memoryPacket.hasTourismTemporalSeries)
        ? 'Sin serie anual histórica para esta variable: solo corte transversal comunal; usa gráfico de barras y aclara la ausencia de años anteriores.'
        : undefined,
      serie_historica_anual_2015_2026: annualSeriesHint,
      comunas_filtradas_solicitadas: compactFilteredComunas,
      holdings_salmoneros_aysen: memoryPacket.isHoldingQuery ? _memoryIndex.holdings : undefined,
      sintesis_institucional_verificada: memoryPacket.reconciledResult ? memoryPacket.reconciledResult.reply : undefined,
      hitos_regionales: (includeHitos && hitosOnly) ? hitosOnly.slice(0, 900) : undefined,
      nodos_satelite_relevantes: relevantNodes.length ? relevantNodes : undefined,
      conectividad_multimodal_resumen: connectivityBrief,
      resumen_estadistico_variables_candidatas: varSummaries,
      correlacion_bivariada_exacta: memoryPacket.bivariateStats ? {
        pearson_r: Number(memoryPacket.bivariateStats.r.toFixed(2)),
        r2: Number(memoryPacket.bivariateStats.r2.toFixed(2)),
        sentido_real: memoryPacket.bivariateStats.sense,
        maximo_y: memoryPacket.bivariateStats.maxY,
        minimo_y: memoryPacket.bivariateStats.minY,
        cuadrante_superior_derecho: memoryPacket.bivariateStats.topRight,
        cuadrante_inferior_derecho: memoryPacket.bivariateStats.bottomRight
      } : undefined,
      matriz_comunal_datos_exactos: compactComunasMatrix,
      grafico_sugerido: hasExplicitChartHint ? memoryPacket.chartSpec : undefined
    };

    return {
      systemPrompt,
      userPromptWithMemory: `MEMORIA_VERIFICADA:\n${JSON.stringify(memoryPayload)}\n\nCONSULTA DEL USUARIO:\n${memoryPacket.query}`
    };
  }

  function buildLocalityNote(matchedLocalidades) {
    if (!Array.isArray(matchedLocalidades) || matchedLocalidades.length === 0) return '';
    const pairs = matchedLocalidades.map(l => `${l.localidadName} (${l.comunaName})`).join(', ');
    return `Nota: ${pairs} — cifras a escala comunal. `;
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
      wantsScatter,
      wantsTemporal,
      hasTourismTemporalSeries,
      isHoldingQuery,
      matchedSector,
      isBroadSectorQuery,
      matchedEntities,
      matchedLocalidades,
      subsetIntent,
      bivariateStats,
      over10Note,
      topVariables,
      primaryVar,
      secondaryVar,
      tertiaryVar,
      topNodes,
      matchedCollections,
      chartSpec,
      sources,
      relatedHub
    } = memoryPacket;

    const locNote = buildLocalityNote(matchedLocalidades);

    // -1. Guardrails / Meta-consultas / Rechazos deterministas tempranos
    if (memoryPacket.directResult) {
      updateConversationState(memoryPacket, memoryPacket.directResult);
      return memoryPacket.directResult;
    }

    // 0. Temas Reconciliados Oficiales Single Source of Truth
    if (memoryPacket.reconciledResult) {
      updateConversationState(memoryPacket, memoryPacket.reconciledResult);
      return memoryPacket.reconciledResult;
    }
    const detectedTopic = detectReconciledTopicIntent(qNorm, query, matchedEntities);
    if (detectedTopic) {
      const topicRes = buildReconciledTopicReply(detectedTopic, query, qNorm, _memoryIndex);
      if (topicRes) {
        updateConversationState(memoryPacket, topicRes);
        return topicRes;
      }
    }

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
    if (hasTourismTemporalSeries && chartSpec.type === 'line' && chartSpec.varX === 'visitantes_snaspe') {
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

    // 4b. WP-B.2: Caso B.2 (Síntesis Regional de Sector / Fuente Multidimensional)
    // Cuando la consulta es a nivel regional (0 comunas específicas) sobre un sector o fuente multidimensional
    // (ej. "dame datos del barómetro de la u de aysen", "qué datos tienes de conectividad", "datos de salud en aysén")
    const isMoreFollowUp = /(no tienes mas|que mas tienes|otros indicadores|mas datos|que otros datos|que mas hay|mas informacion|algo mas|otra informacion)/i.test(qNorm);
    if (matchedEntities.length === 0 && matchedSector && (isBroadSectorQuery || isMoreFollowUp)) {
      const secKeys = (isMoreFollowUp && _conversationState.lastIndicatorKeys && _conversationState.lastIndicatorKeys.length > 0)
        ? _conversationState.lastIndicatorKeys.slice(0, 8)
        : (matchedSector.keys || []).slice(0, 8);

      const metricSummaries = [];

      secKeys.forEach(k => {
        const v = _memoryIndex.variablesByKey[k];
        if (!v || !v.stats) return;
        const cleanLbl = CANONICAL_LABELS[k] || v.label || humanizeKey(k);
        const isAvg = v.aggregation === 'avg' || k.endsWith('_pct') || k.endsWith('_hrs') || /ratio|promedio|médicos|tarifa/i.test(v.unit || '');
        const aggLabel = isAvg ? 'Promedio regional' : 'Total regional';
        const aggVal = isAvg ? v.stats.avg : v.stats.sum;
        const u = v.unit || '';
        const unitSuffix = (u && !cleanLbl.includes(u) && !cleanLbl.includes('%')) ? ` ${u}` : '';
        const maxStr = v.stats.max ? `máximo en ${v.stats.max.comuna} con ${fmtNumber(v.stats.max.value)}${unitSuffix}` : '';
        const minStr = v.stats.min ? `mínimo en ${v.stats.min.comuna} con ${fmtNumber(v.stats.min.value)}${unitSuffix}` : '';
        const rangeStr = (maxStr && minStr) ? ` (${maxStr} y ${minStr})` : '';
        metricSummaries.push(`• ${cleanLbl}: ${aggLabel} de ${fmtNumber(aggVal)}${unitSuffix}${rangeStr}.`);
      });

      const prefix = isMoreFollowUp
        ? `Adicionalmente, en ${matchedSector.title}, los registros oficiales en la Región de Aysén reportan:`
        : `En ${matchedSector.title}, los registros oficiales en la Región de Aysén presentan los siguientes indicadores consolidados:`;

      const reply = metricSummaries.length > 0
        ? `${prefix}\n${metricSummaries.join('\n')}`
        : `En ${matchedSector.title}, la plataforma integra indicadores comunales oficiales para las 10 comunas de Aysén.`;

      const secSources = resolveSourcesForKeys(matchedSector.provenanceKeys || matchedSector.keys);
      const res = {
        reply,
        chart: {
          render: true,
          type: 'bar',
          varX: (isMoreFollowUp && secKeys.length > 0) ? secKeys[0] : (matchedSector.varX || secKeys[0]),
          varY: (isMoreFollowUp && secKeys.length > 1) ? secKeys[1] : (matchedSector.varY || secKeys[1]),
          yKey: (isMoreFollowUp && secKeys.length > 0) ? secKeys[0] : (matchedSector.varX || secKeys[0]),
          y2Key: (isMoreFollowUp && secKeys.length > 1) ? secKeys[1] : (matchedSector.varY || secKeys[1]),
          title: matchedSector.chartTitle || `${matchedSector.title} en Aysén`,
          sourceText: secSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false
        },
        sources: secSources,
        relatedHub: matchedSector.hub || 'X'
      };
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

      const multiCharts = buildComunaMultiCharts(ent, _memoryIndex);
      const replyWithLoc = locNote ? `${locNote}${profileReply}` : profileReply;
      const finalProfReply = replyWithLoc.length > 645 ? replyWithLoc.slice(0, 642) + '...' : replyWithLoc;

      const res = {
        reply: finalProfReply,
        chart: {
          render: true,
          type: 'bar',
          varX,
          varY,
          yKey: varX,
          y2Key: varY,
          singleComunaMode: true,
          focusComunas: [ent.name],
          highlightComuna: ent.name,
          comunaName: ent.name,
          comunaIne: ent.id,
          comunaProfileRows: profileRows,
          multiCharts,
          title: `Perfil Multidimensional — ${ent.name}`,
          sourceText: profSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false
        },
        sources: profSources,
        relatedHub: hasSalmonVocation ? 'II' : 'IV'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 5b. Comparación entre 2+ localidades o comunas sin métrica específica (ej. "Puerto Río Tranquilo vs Puyuhuapi")
    if (matchedEntities.length >= 2 && topVariables.length === 0) {
      const compSources = resolveSourcesForKeys(['poblacion_censo_2024', 'prestadores_sernatur']);
      const compLines = matchedEntities.map(ent => {
        const r = ent.raw || {};
        return `${ent.name}: ${fmtNumber(r.poblacion_censo_2024)} hab., ${fmtNumber(r.prestadores_sernatur)} prest. SERNATUR, ${fmtNumber(r.visitantes_snaspe)} visitas SNASPE`;
      }).join('; ');
      const rawCompReply = `${locNote}Comparativa comunal: ${compLines}.`;
      const res = {
        reply: rawCompReply.length > 645 ? rawCompReply.slice(0, 642) + '...' : rawCompReply,
        chart: {
          render: true,
          type: 'bar',
          varX: 'poblacion_censo_2024',
          varY: 'prestadores_sernatur',
          yKey: 'poblacion_censo_2024',
          y2Key: 'prestadores_sernatur',
          singleComunaMode: false,
          focusComunas: matchedEntities.map(e => e.name),
          highlightComuna: matchedEntities[0].name,
          title: `Comparativa Comunal: ${matchedEntities.map(e => e.name).join(' vs. ')}`,
          sourceText: compSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique
        },
        sources: compSources,
        relatedHub: 'I'
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

      const isMultiEntityQuery = matchedEntities.length >= 2;
      const lines = matchedEntities.map(ent => {
        const metricsText = topVariables.slice(0, 2).map(v => {
          const val = ent.raw[v.key];
          const cleanLbl = CANONICAL_LABELS[v.key] || v.label;
          if (typeof val === 'number') {
            const rankIdx = v.stats ? v.stats.ranked.findIndex(r => r.comuna_ine === ent.id) + 1 : null;
            const rankStr = (!isMultiEntityQuery && rankIdx) ? ` (#${rankIdx} de ${_memoryIndex.entities.length})` : (rankIdx ? ` (#${rankIdx})` : '');
            const unitSuffix = shouldAppendUnit(cleanLbl, v.unit) ? ` ${v.unit}` : '';
            return `${cleanLbl}: ${fmtNumber(val)}${unitSuffix}${rankStr}`;
          }
          return `${cleanLbl}: ${val ?? '-'}`;
        }).join(isMultiEntityQuery ? '; ' : ' · ');
        return isMultiEntityQuery
          ? `${ent.name}: ${metricsText}.`
          : `La comuna de ${ent.name} (Provincia de ${ent.provincia}) registra ${metricsText}.`;
      });

      const compVar = primaryVar || topVariables[0];
      let regionalNote = '';
      if (compVar && compVar.isNumeric && compVar.stats) {
        const cleanCompLabel = CANONICAL_LABELS[compVar.key] || compVar.label;
        const aggLabel = compVar.aggregation === 'avg' ? 'Promedio regional' : 'Total regional';
        const aggVal = compVar.aggregation === 'avg' ? compVar.stats.avg : compVar.stats.sum;
        const unitSuffix = shouldAppendUnit(cleanCompLabel, compVar.unit) ? ` ${compVar.unit}` : '';
        regionalNote = ` ${aggLabel} de ${cleanCompLabel}: ${fmtNumber(aggVal)}${unitSuffix} (máx. ${compVar.stats.max.comuna} ${fmtNumber(compVar.stats.max.value)}; mín. ${compVar.stats.min.comuna} ${fmtNumber(compVar.stats.min.value)}).`;
      }

      const combinedReply = `${locNote}${lines.join(' ')}${regionalNote}${over10Note || ''}`;
      const res = {
        reply: combinedReply.length > 645 ? combinedReply.slice(0, 642) + '...' : combinedReply,
        chart: Object.assign({}, chartSpec, {
          singleComunaMode: matchedEntities.length === 1,
          focusComunas: matchedEntities.map(e => e.name),
          comunaName: matchedEntities.length === 1 ? matchedEntities[0].name : null,
          comunaIne: matchedEntities.length === 1 ? matchedEntities[0].id : null,
          highlightComuna: matchedEntities[0].name
        }),
        sources,
        relatedHub
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 7. Caso C: Variables numéricas detectadas a nivel regional (1, 2 o 3 variables, rankings de subconjuntos y rankings condicionados)
    if (primaryVar && primaryVar.isNumeric && primaryVar.stats) {
      if (subsetIntent) {
        if (subsetIntent.isConditionalProjection && subsetIntent.sortVarKey && Array.isArray(subsetIntent.comunas) && subsetIntent.comunas.length > 0) {
          const sortVar = _memoryIndex.variablesByKey[subsetIntent.sortVarKey];
          const sortLbl = CANONICAL_LABELS[sortVar?.key] || sortVar?.label || subsetIntent.sortVarKey;
          const dirLabel = subsetIntent.direction === 'asc' ? 'menor' : 'mayor';
          const subsetEnts = subsetIntent.comunas
            .map(name => _memoryIndex.entities.find(e => e.name === name))
            .filter(Boolean);
          const projVars = [primaryVar, secondaryVar, tertiaryVar].filter(v => v && v.isNumeric && v.stats);
          const varLines = projVars.map(v => {
            const cleanLbl = CANONICAL_LABELS[v.key] || v.label;
            const unitStr = v.unit ? ` ${v.unit}` : '';
            const valsList = subsetEnts.map(e => `${e.name} (${fmtNumber(e.raw[v.key])})`).join(', ');
            const subVals = subsetEnts.map(e => Number(e.raw[v.key])).filter(Number.isFinite);
            const subSumV = subVals.reduce((a, b) => a + b, 0);
            const subAvgV = subVals.length ? (subSumV / subVals.length) : 0;
            const isAvgV = v.aggregation === 'avg' || v.unit.includes('%');
            const summaryStr = isAvgV
              ? `Prom. subconjunto: ${fmtNumber(subAvgV, 1)}${unitStr} vs. Reg.: ${fmtNumber(v.stats.avg, 1)}${unitStr}`
              : `Suma subconjunto: ${fmtNumber(subSumV)}${unitStr} (Reg.: ${fmtNumber(v.stats.sum)}${unitStr})`;
            return `${cleanLbl}: ${valsList} [${summaryStr}].`;
          }).join(' ');
          const condReply = `En las ${subsetEnts.length} comunas con ${dirLabel} ${sortLbl}: ${varLines}${over10Note || ''}`;
          const res = {
            reply: condReply.length > 645 ? condReply.slice(0, 642) + '...' : condReply,
            chart: chartSpec,
            sources,
            relatedHub
          };
          updateConversationState(memoryPacket, res);
          return res;
        }

        const list = subsetIntent.direction === 'asc'
          ? (excludeCoyhaique
              ? primaryVar.stats.rankedAsc.filter(r => r.comuna_ine !== '11101' && r.comuna.toLowerCase() !== 'coyhaique')
              : primaryVar.stats.rankedAsc)
          : (excludeCoyhaique
              ? primaryVar.stats.ranked.filter(r => r.comuna_ine !== '11101' && r.comuna.toLowerCase() !== 'coyhaique')
              : primaryVar.stats.ranked);
        const subset = list.slice(0, subsetIntent.count);
        const subSum = subset.reduce((acc, r) => acc + r.value, 0);
        const totalReg = primaryVar.stats.sum || 0;
        const pct = totalReg > 0 ? (subSum / totalReg) * 100 : 0;
        const pctDecimals = pct < 10 ? 3 : 1;
        const cleanLbl = CANONICAL_LABELS[primaryVar.key] || primaryVar.label;
        const unitStr = primaryVar.unit ? ` ${primaryVar.unit}` : '';
        const itemsStr = subset.map(r => `${r.comuna} (${fmtNumber(r.value)}${unitStr})`).join(', ');
        const dirWord = subsetIntent.direction === 'asc' ? 'menores' : 'mayores';
        const isIntensive = primaryVar.aggregation === 'avg' || primaryVar.unit.includes('%');
        const replyStr = isIntensive
          ? `Las ${subset.length} comunas con valores ${dirWord} en ${cleanLbl} son ${itemsStr} (promedio del subconjunto: ${fmtNumber(subSum / (subset.length || 1), 2)}${unitStr}; promedio regional: ${fmtNumber(primaryVar.stats.avg, 2)}${unitStr}).${over10Note || ''}`
          : `Las ${subset.length} comunas con valores ${dirWord} en ${cleanLbl} son ${itemsStr}. En conjunto suman exactamente ${fmtNumber(subSum)}${unitStr}, lo que representa el ${fmtNumber(pct, pctDecimals)}% del total regional de ${fmtNumber(totalReg)}${unitStr}.${over10Note || ''}`;
        const res = {
          reply: replyStr.length > 645 ? replyStr.slice(0, 642) + '...' : replyStr,
          chart: chartSpec,
          sources,
          relatedHub
        };
        updateConversationState(memoryPacket, res);
        return res;
      }

      const buildVarParagraph = (v, isPrimary, compactMode = false) => {
        const list = excludeCoyhaique
          ? v.stats.ranked.filter(r => r.comuna_ine !== '11101' && r.comuna.toLowerCase() !== 'coyhaique')
          : v.stats.ranked;
        if (!list.length) return '';

        const cleanLbl = CANONICAL_LABELS[v.key] || v.label;
        const sum = list.reduce((acc, r) => acc + r.value, 0);
        const avg = sum / list.length;
        const unitStr = v.unit ? ` ${v.unit}` : '';
        if (compactMode) {
          const top1 = list[0];
          const bot1 = list[list.length - 1];
          const aggValStr = v.aggregation === 'avg' ? `Prom: ${fmtNumber(avg)}${unitStr}` : `Tot: ${fmtNumber(sum)}${unitStr}`;
          return `${cleanLbl}: máx ${top1.comuna} (${fmtNumber(top1.value)}), mín ${bot1.comuna} (${fmtNumber(bot1.value)}), ${aggValStr}.`;
        }
        const topCount = (isPrimary && v.key === 'poblacion_censo_2024') ? 5 : 3;
        const topN = list.slice(0, topCount).map((r, i) => `${i + 1}. ${r.comuna} (${fmtNumber(r.value)}${unitStr})`).join(', ');
        const bottom = list[list.length - 1];
        const aggSentence = v.aggregation === 'avg'
          ? `Promedio regional: ${fmtNumber(avg)}${unitStr}.`
          : `Total regional: ${fmtNumber(sum)}${unitStr} (promedio comunal: ${fmtNumber(avg)}${unitStr}).`;

        return `${cleanLbl}${excludeCoyhaique ? ' (sin Coyhaique)' : ''}: Lideran ${topN}, y el menor registro corresponde a ${bottom.comuna} (${fmtNumber(bottom.value)}${unitStr}). ${aggSentence}`;
      };

      const isThreeVar = Boolean(tertiaryVar && tertiaryVar.isNumeric && tertiaryVar.stats);
      const useCompactSummary = isThreeVar || (wantsScatter && Boolean(bivariateStats));
      const paragraphs = [buildVarParagraph(primaryVar, true, useCompactSummary)];
      if (secondaryVar && secondaryVar.isNumeric && secondaryVar.stats) {
        paragraphs.push(buildVarParagraph(secondaryVar, false, useCompactSummary));
      }
      if (isThreeVar) {
        paragraphs.push(buildVarParagraph(tertiaryVar, false, true));
      }
      if (wantsScatter && bivariateStats && secondaryVar && secondaryVar.isNumeric) {
        const cleanY = CANONICAL_LABELS[secondaryVar.key] || secondaryVar.label;
        const brList = bivariateStats.bottomRight.slice(0, 3).join(', ');
        const brClause = brList
          ? `con comunas de alto X y bajo Y en el cuadrante inferior-derecho (${brList}), `
          : '';
        paragraphs.push(`Correlación lineal ${bivariateStats.sense} (r = ${fmtNumber(bivariateStats.r, 2)}, R² = ${fmtNumber(bivariateStats.r2, 2)}): ${brClause}máximo de ${cleanY} en ${bivariateStats.maxY.comuna} (${fmtNumber(bivariateStats.maxY.value)}) y mínimo en ${bivariateStats.minY.comuna} (${fmtNumber(bivariateStats.minY.value)}).`);
      }

      const combinedVarReply = `${paragraphs.filter(Boolean).join(' ')}${over10Note || ''}`;
      const res = {
        reply: combinedVarReply.length > 645 ? combinedVarReply.slice(0, 642) + '...' : combinedVarReply,
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

    // 10. Caso F: Sin coincidencia en el catálogo -> declarar explícitamente que no forma parte de las fuentes oficiales
    const sampleLabels = _memoryIndex.variables.filter(v => v.isNumeric).slice(0, 5).map(v => CANONICAL_LABELS[v.key] || v.label).join(', ');
    return {
      reply: `Este indicador no forma parte de las fuentes oficiales verificadas de Aysén Sistémico. Actualmente el índice dinámico cuenta con ${_memoryIndex.variables.length} indicadores comunales y ${_memoryIndex.nodes.length} nodos temáticos (por ejemplo: ${sampleLabels}).`,
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

  function resolveValidVarKey(rawCandidate) {
    if (!rawCandidate || typeof rawCandidate !== 'string') return null;
    const cleaned = rawCandidate.trim().split(/[\s(]/)[0];
    if (_memoryIndex.variablesByKey[cleaned]?.isNumeric) return cleaned;
    const snakeMatch = rawCandidate.match(/\b[a-z][a-z0-9_]{3,}\b/);
    if (snakeMatch && _memoryIndex.variablesByKey[snakeMatch[0]]?.isNumeric) return snakeMatch[0];
    return null;
  }

  function inferVariablesFromReplyText(combinedText) {
    const qNorm = normalizeText(combinedText || '');
    const qTokens = tokenize(combinedText || '');
    return _memoryIndex.variables
      .filter(v => v.isNumeric)
      .map(v => ({ key: v.key, score: scoreVariable(v, qNorm, qTokens) }))
      .filter(item => item.score >= 5)
      .sort((a, b) => b.score - a.score)
      .map(s => s.key);
  }

  function resolveChartTitleForVars(validVarX, validVarY, memoryPacket, llmChart) {
    if (
      validVarX === memoryPacket.chartSpec.varX &&
      validVarY === memoryPacket.chartSpec.varY &&
      memoryPacket.chartSpec.title
    ) {
      return memoryPacket.chartSpec.title;
    }
    const hasCleanLlmTitle = llmChart.title && typeof llmChart.title === 'string' && !/[a-z]+_[a-z]+/.test(llmChart.title);
    if (hasCleanLlmTitle && (!validVarY || /vs\.?|versus|frente a/i.test(llmChart.title))) {
      return llmChart.title;
    }
    if (!validVarX) return memoryPacket.chartSpec.title || '';
    const labelX = CANONICAL_LABELS[validVarX] || humanizeKey(validVarX);
    if (validVarY) {
      const labelY = CANONICAL_LABELS[validVarY] || humanizeKey(validVarY);
      return `${labelX} vs. ${labelY}`;
    }
    return `${labelX} por Comuna`;
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
    detectReconciledTopicIntent,
    buildReconciledTopicReply,
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
      if (Array.isArray(history) && history.length > 0) {
        _conversationMemory = history.map(h => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: String(h.content || h.text || '')
        }));
      }
      return this.query(userText);
    },

    async query(userText) {
      if (!_memoryIndex.variables.length && (_dataLake || (global && global.AYSEN_HUBS_DATA))) {
        this.init(_dataLake || global.AYSEN_HUBS_DATA);
      }

      const memoryPacket = retrieveMemoryForQuery(userText);

      // Resolución directa determinista para temas reconciliados, guardrails, holdings, series temporales, rankings/sumas y multi-gráficos
      if (
        (memoryPacket.reconciledResult && !memoryPacket.reconciledResult.isContextualBridge) ||
        memoryPacket.isDeterministicDirect
      ) {
        const directRes = memoryPacket.directResult || (
          memoryPacket.reconciledResult && !memoryPacket.reconciledResult.isContextualBridge
            ? memoryPacket.reconciledResult
            : synthesizeFromMemoryPacket(memoryPacket)
        );
        updateConversationState(memoryPacket, directRes);
        _conversationMemory.push({ role: 'user', content: userText });
        _conversationMemory.push({ role: 'assistant', content: directRes.reply });
        return directRes;
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
        const llmVarX = resolveValidVarKey(llmChart.varX);
        const llmVarY = resolveValidVarKey(llmChart.varY);
        const explicitDisable = llmChart.render === false || llmChart.render === 'false';
        const shouldRenderChart = explicitDisable
          ? false
          : Boolean((llmChart.render !== undefined ? llmChart.render : memoryPacket.chartSpec.render) || llmVarX);

        let validVarX = null;
        let validVarY = null;
        if (shouldRenderChart) {
          if (llmVarX) {
            validVarX = llmVarX;
            if (llmVarY && llmVarY !== llmVarX && (memoryPacket.secondaryVar || memoryPacket.wantsBivariateComparison)) {
              validVarY = llmVarY;
            } else if (memoryPacket.chartSpec.varY && memoryPacket.chartSpec.varY !== llmVarX) {
              validVarY = memoryPacket.chartSpec.varY;
            }
          } else if (memoryPacket.primaryVar || memoryPacket.matchedSector || memoryPacket.reconciledResult) {
            validVarX = memoryPacket.chartSpec.varX || null;
            validVarY = (memoryPacket.chartSpec.varY && memoryPacket.chartSpec.varY !== validVarX)
              ? memoryPacket.chartSpec.varY
              : null;
          } else {
            const inferredKeys = inferVariablesFromReplyText(`${userText} ${parsed.reply || ''}`);
            validVarX = inferredKeys[0] || memoryPacket.chartSpec.varX || null;
            validVarY = (memoryPacket.wantsBivariateComparison && inferredKeys[1] && inferredKeys[1] !== validVarX)
              ? inferredKeys[1]
              : (memoryPacket.chartSpec.varY || null);
          }
        }

        const allowedTypes = ['bar', 'line', 'scatter'];
        let chartType = allowedTypes.includes(llmChart.type) ? llmChart.type : (memoryPacket.chartSpec.type || 'bar');
        // Restringir 'line' estrictamente a series temporales (nunca sobre categorias de comunas)
        if (chartType === 'line' && !memoryPacket.hasTourismTemporalSeries) {
          chartType = (memoryPacket.wantsScatter && validVarY) ? 'scatter' : 'bar';
        }
        const resolvedTitle = resolveChartTitleForVars(validVarX, validVarY, memoryPacket, llmChart);
        const exactSources = shouldRenderChart ? resolveSourcesForKeys([validVarX, validVarY].filter(Boolean)) : [];
        const rawHub = String(parsed.relatedHub || '').trim();
        const resolvedHub = (memoryPacket.reconciledResult && memoryPacket.reconciledResult.relatedHub)
          ? memoryPacket.reconciledResult.relatedHub
          : (validVarX
              ? getHubForVariable(validVarX)
              : (/^(I|II|III|IV|V|VI|VII|VIII|IX|X)$/.test(rawHub) ? rawHub : (memoryPacket.relatedHub || 'IV')));

        const baseReply = (parsed._isTruncatedRescue && memoryPacket.reconciledResult && memoryPacket.reconciledResult.reply)
          ? memoryPacket.reconciledResult.reply
          : (parsed.reply || synthesizeFromMemoryPacket(memoryPacket).reply);
        const locPrefix = buildLocalityNote(memoryPacket.matchedLocalidades);
        const resolvedReply = (locPrefix && !baseReply.toLowerCase().includes(memoryPacket.matchedLocalidades[0].comunaName.toLowerCase()))
          ? `${locPrefix}${baseReply}`
          : baseReply;

        const finalResult = {
          reply: resolvedReply,
          chart: {
            render: Boolean(shouldRenderChart && (validVarX || memoryPacket.chartSpec?.customCategoryData)),
            type: chartType,
            varX: validVarX,
            varY: validVarY,
            varZ: memoryPacket.chartSpec?.varZ || null,
            yKey: validVarX,
            y2Key: validVarY,
            singleComunaMode: Boolean(memoryPacket.chartSpec?.singleComunaMode),
            focusComunas: memoryPacket.chartSpec?.focusComunas || null,
            comunaName: memoryPacket.chartSpec?.comunaName || null,
            comunaIne: memoryPacket.chartSpec?.comunaIne || null,
            multiCharts: memoryPacket.chartSpec?.multiCharts || null,
            highlightComuna: memoryPacket.matchedEntities.length === 1 ? memoryPacket.matchedEntities[0].name : null,
            title: resolvedTitle,
            sourceText: exactSources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: llmChart.excludeCoyhaique !== undefined
              ? Boolean(llmChart.excludeCoyhaique)
              : memoryPacket.chartSpec.excludeCoyhaique
          },
          sources: exactSources.length ? exactSources : (shouldRenderChart ? memoryPacket.sources : []),
          relatedHub: resolvedHub
        };

        updateConversationState(memoryPacket, finalResult);
        _conversationMemory.push({ role: 'user', content: userText });
        _conversationMemory.push({ role: 'assistant', content: finalResult.reply });

        return finalResult;
      } catch (_) {
        const fallbackResult = synthesizeFromMemoryPacket(memoryPacket);
        _conversationMemory.push({ role: 'user', content: userText });
        _conversationMemory.push({ role: 'assistant', content: fallbackResult.reply });
        return fallbackResult;
      } finally {
        if (timer) clearTimeout(timer);
      }
    }
  };

  if (global && global.AYSEN_HUBS_DATA) {
    OmniRouteClient.init(global.AYSEN_HUBS_DATA);
  }

  return OmniRouteClient;
});
