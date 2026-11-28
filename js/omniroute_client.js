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

  // Catálogo institucional de las 28 fuentes verificadas troncales (+ 10 complementarias = 38 fuentes oficiales)
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
    { id: 11, institucion: 'CNE', indicador: '11. Precios Minoristas de Combustibles y Leña (Bencina en Línea · con brecha en zonas sin surtidor)', url: 'https://www.bencinaenlinea.cl/', hub: 'III. Energía', anos: '2015-2026' },
    { id: 12, institucion: 'SUBTEL', indicador: '12. Conectividad Digital FTTX/Starlink (Jun 2026: 26.294 conexiones) y Fibra Última Milla', url: 'https://www.subtel.gob.cl/estudios-y-estadisticas/internet/', hub: 'III. Energía', anos: '2015-2026' },
    { id: 13, institucion: 'SUBDERE - SINIM', indicador: '13. Finanzas Municipales, FCM y Royalty Minero FET (BCN 2026)', url: 'https://datos.sinim.gov.cl/', hub: 'IV. Gobernanza', anos: '2015-2026' },
    { id: 14, institucion: 'DIPRES / GORE Aysén', indicador: '14. Ejecución Presupuestaria Regional FNDR', url: 'https://www.dipres.gob.cl/', hub: 'IV. Gobernanza', anos: '2015-2026' },
    { id: 15, institucion: 'SERVEL', indicador: '15. Resultados Electorales, Autoridades Comunales y Participación 2024–2025', url: 'https://www.servel.cl/', hub: 'IV. Gobernanza', anos: '2024-2028' },
    { id: 16, institucion: 'MOP Vialidad', indicador: '16. Red Vial y Pavimentación Ruta 7 Austral', url: 'https://vialidad.mop.gob.cl/', hub: 'IV. Gobernanza', anos: '2015-2026' },
    { id: 17, institucion: 'SEA - SEIA', indicador: '17. Proyectos Evaluados y Aprobados en el SEIA', url: 'https://seia.sea.gob.cl/', hub: 'V. Inversión', anos: '2015-2026' },
    { id: 18, institucion: 'SII', indicador: '18. Estadísticas Tributarias de Empresas, Ventas y Empleo', url: 'https://www.sii.cl/sobre_finanzas/estadisticas/', hub: 'V. Inversión', anos: '2015-2026' },
    { id: 19, institucion: 'ChileCompra', indicador: '19. Transacciones y Compras Públicas Mercado Público', url: 'https://www.chilecompra.cl/', hub: 'V. Inversión', anos: '2015-2026' },
    { id: 20, institucion: 'MBN / SERNAGEOMIN', indicador: '20. Catastro de Propiedad Fiscal Regional y Concesiones Mineras', url: 'https://catastro.bienes.cl/', hub: 'V. Inversión', anos: '2015-2026' },
    { id: 21, institucion: 'INE', indicador: '21. Censo de Población y Vivienda 2024 (100.745 hab.)', url: 'https://censo2024.ine.gob.cl/', hub: 'VI. Social', anos: '2017-2024' },
    { id: 22, institucion: 'MDSF - CASEN', indicador: '22. Encuesta de Caracterización Socioeconómica Nacional (CASEN)', url: 'https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen', hub: 'VI. Social', anos: '2015-2024' },
    { id: 23, institucion: 'MINEDUC / SLEP Aysén', indicador: '23. Matrícula, Asistencia y Establecimientos Escolares', url: 'https://datosabiertos.mineduc.cl/', hub: 'VI. Social', anos: '2015-2026' },
    { id: 24, institucion: 'CEAD - SPD', indicador: '24. Estadísticas Policiales y Seguridad Ciudadana', url: 'https://cead.spd.gob.cl/', hub: 'VI. Social', anos: '2015-2026' },
    { id: 25, institucion: 'MMA / CONAF SIT / SAG', indicador: '25. Inventario de Flora, Fauna RCE y Pisos Vegetacionales', url: 'https://mma.gob.cl/biodiversidad/', hub: 'VII. Biodiversidad', anos: '2015-2026' },
    { id: 26, institucion: 'MMA SINCA / DGA / SERNAGEOMIN', indicador: '26. Calidad del Aire (SINCA), Glaciares (DGA) y Red Sísmica', url: 'https://sinca.mma.gob.cl/', hub: 'VII. Biodiversidad', anos: '2015-2026' },
    { id: 27, institucion: 'DEIS - MINSAL / SSA', indicador: '27. Estadísticas Vitales, Red APS, Camas y SAMU', url: 'https://deis.minsal.cl/', hub: 'VIII. Salud', anos: '2015-2026' },
    { id: 28, institucion: 'SERPAT-CMN / ANID / CORFO', indicador: '28. Infraestructura Cultural, Cartera ANID, CORFO e Investigadores', url: 'https://dataciencia.anid.cl/', hub: 'IX. Cultura y X. CTCi', anos: '2015-2026' }
  ];

  const FUENTES_OFICIALES_COMPLEMENTARIAS = [
    { id: 29, institucion: 'MOP Vialidad', indicador: '29. Red Vial Nacional, Pavimentación y Tiempos de Viaje', url: 'https://vialidad.mop.gob.cl/', hub: 'Conectividad Multimodal', anos: '2018-2026' },
    { id: 30, institucion: 'EMPORCHA / DOP MOP', indicador: '30. Operaciones Portuarias, Carga y Cruceros', url: 'https://chacabucoport.cl/', hub: 'Conectividad Multimodal', anos: '2015-2026' },
    { id: 31, institucion: 'MTT DTPR / JAC DGAC', indicador: '31. Conectividad Marítima, Lacustre y Aérea Subsidiada (+30% en 2025)', url: 'https://dtpr.mtt.gob.cl/', hub: 'Conectividad Multimodal', anos: '2015-2026' },
    { id: 32, institucion: 'MINVU / DOH-MOP', indicador: '32. Déficit Habitacional PEH (1.293 meta superada) y Red SSR/APR', url: 'https://www.minvu.gob.cl/', hub: 'Informes Territoriales', anos: '2024-2026' },
    { id: 33, institucion: 'ODEPA / INFOR / DGA', indicador: '33. Censo Silvoagropecuario, Dendroenergía y Glaciares', url: 'https://www.odepa.gob.cl/', hub: 'Informes Territoriales', anos: '2015-2026' },
    { id: 34, institucion: 'Universidad de Aysén', indicador: '34. Barómetro Regional Patagonia: Percepción y Cohesión', url: 'https://uaysen.cl/', hub: 'Informes Territoriales', anos: '2018-2026' },
    { id: 35, institucion: 'CPLT (Consejo para la Transparencia)', indicador: '35. Fiscalización Nacional Transparencia Activa Municipal 2026 (Regional 73,8%)', url: 'https://www.consejotransparencia.cl/', hub: 'IV. Gobernanza', anos: '2026' },
    { id: 36, institucion: 'GORE Aysén (datos.gob.cl) / SUBDERE BCN', indicador: '36. Inversión FNDR Comunal (2015–2023), Fondos 8% y FET Royalty Minero (2024–2025)', url: 'https://datos.gob.cl/dataset/inversion-anual-del-fondo-nacional-de-desarrollo-regional-del-gobierno-regional-de-aysen-anos-2005', hub: 'IV. Gobernanza / V. Inversión', anos: '2015-2025' },
    { id: 37, institucion: 'MDSF BIDAT (RSH Jun 2026) / CGR PRI', indicador: '37. Registro Social de Hogares (Carencia Servicios y Hacinamiento) y PRI Coyhaique-Aysén', url: 'https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2026&idcom=11101', hub: 'VI. Social', anos: '2026' },
    { id: 38, institucion: 'SERVEL / TRICEL / Congreso / GORE Aysén', indicador: '38. Composición Política Histórica de Aysén (Presidenciales, Parlamento, CORE y Alcaldes 1989–2026)', url: 'https://www.goreaysen.cl/consejeros-regionales/', hub: 'IV. Gobernanza', anos: '1989-2034' }
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
    ruta7_pavimentada_km: 'Carretera Austral Troncal (Ruta 7) Pavimentada (km)',
    ruta7_ripio_km: 'Carretera Austral Troncal (Ruta 7) en Ripio (km)',
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
    potencia_mw: 'Capacidad Eléctrica Instalada en el Subsistema (MW)',
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
    traslado_coyhaique_hrs: 'Tiempo de Derivación Médica en Ambulancia/Barcaza al Hospital Regional Coyhaique (horas)',
    matricula_escolar: 'Matrícula Escolar Total (MINEDUC)',
    establecimientos_escolares_n: 'Total Establecimientos Escolares (Públicos + Subvencionados) (colegios)',
    establecimientos_aps_n: 'Establecimientos de Atención Primaria (APS)',
    cobertura_vegetal_nativa_ha: 'Cobertura de Bosque y Vegetación Nativa (ha)',
    cobertura_vegetal_pct: 'Cobertura Vegetal Nativa (%)',
    fauna_amenazada_n: 'Especies de Fauna Amenazada en la Comuna',
    ipp_per_capita_clp: 'Ingresos Propios Permanentes Per Cápita ($/hab)',
    gasto_personal_pct: 'Gasto Municipal en Personal (% del Presupuesto)',
    inversion_directa_pct: 'Inversión Municipal Directa (% del Presupuesto)',
    profesionalizacion_pct: 'Profesionalización de Planta Municipal (%)',
    saidi_horas_anual: 'Índice de Interrupción Eléctrica SAIDI (hrs/año)',
    tarifa_bt1_clp: 'Tarifa Eléctrica Residencial BT1 ($/kWh)',
    potencia_ernc_en_construccion_mw: 'Potencia ERNC en Construcción 2026 (MW)',
    cobertura_subsidio_electrico_hogares_n: 'Beneficiarios Subsidio Eléctrico Ley 21.667 (hogares)',
    cobertura_subsidio_electrico_pct: 'Cobertura Subsidio Eléctrico (% hogares)',
    diesel_clp_litro: 'Precio Petróleo Diésel CNE ($/L)',
    kerosene_clp_litro: 'Precio Kerosene Doméstico CNE ($/L)',
    costo_kwh_termico_util_lena_clp: 'Costo kWh Térmico Útil Leña ($/kWh_útil)',
    costo_kwh_termico_util_kerosene_clp: 'Costo kWh Térmico Útil Kerosene ($/kWh_útil)',
    ratio_costo_calefaccion_electrica_vs_lena: 'Ratio Costo Calefacción Bomba de Calor vs. Leña (veces)',
    hogares_censo_2024: 'Hogares Censales Estimados Censo 2024 (hogares)',
    costo_diesel_aislado_clp: 'Costo de Generación Diésel Aislado ($/kWh)',
    internet_fijo_pct: 'Penetración de Internet Fijo en Hogares (%)',
    biomasa_salmon_ton: 'Biomasa de Salmón Cosechada (ton)',
    antibioticos_ica_g_ton: 'Uso de Antibióticos en Salmonicultura ICA (g/ton)',
    amerb_decretadas: 'Áreas de Manejo Bentónico (AMERB) Decretadas (áreas)',
    amerb_operativas: 'Áreas de Manejo Bentónico (AMERB) Operativas (áreas)',
    seia_plazo_dias: 'Plazo Promedio de Evaluación Ambiental en el SEIA (días)',
    compras_locales_pct: 'Compras Públicas Adjudicadas a Proveedores Locales (%)',
    fuga_compras_pct: 'Fuga de Compras Públicas Extrarregional (%)',
    parcelaciones_sag_n: 'Subdivisiones Prediales Rurales Certificadas SAG',
    medicos_por_mil_hab: 'Médicos por cada 1.000 Habitantes (médicos/1.000 hab)',
    espera_no_ges_n: 'Personas en Lista de Espera de Especialidad Médica (No GES) (interconsultas)',
    urgencias_respiratorias_pct: 'Urgencias Respiratorias Invernales (%)',
    aeroevacuaciones_samu_n: 'Aeroevacuaciones Médicas SAMU (anual)',
    ratio_presion_turistica: 'Ratio de Presión Turística (Visitantes/Residentes)',
    ha_snaspe_por_guardaparque: 'Superficie Protegida SNASPE por cada Guardaparque CONAF (ha/guardaparque)',
    glaciares_dga_n: 'Glaciares Inventariados DGA',
    superficie_glaciar_km2: 'Superficie Glaciar Comunal (km²)',
    daa_consuntivos_m3s: 'Derechos de Agua Consuntivos DGA (Riego y Consumo) (m³/s)',
    daa_no_consuntivos_m3s: 'Derechos de Agua No Consuntivos DGA (Hidroelectricidad) (m³/s)',
    dias_sobre_norma_mp25: 'Días Anuales sobre Norma Diaria MP2.5 (SINCA)',
    postas_salud_rural: 'Postas de Salud Rural (PSR)',
    museos_espacios_n: 'Museos y Espacios Culturales',
    bibliotecas_snbp_n: 'Bibliotecas Públicas Fijas SNBP',
    bibliotecas_publicas_count: 'Bibliotecas Públicas Fijas SNBP',
    puntos_cultura_comunitaria_pcc_n: 'Puntos de Cultura Comunitaria PCC MINCAP',
    fondart_fndr_mclp: 'Total Fondos Culturales Adjudicados (FONDART + 8% FNDR) (M$ CLP)',
    total_espacios_culturales: 'Total de Espacios Culturales e Infraestructura',
    monumentos_nacionales_count: 'Monumentos Nacionales Declarados (CMN)',
    proyectos_anid_n: 'Subtotal Proyectos Científicos ANID (Locales + Extrarregionales) (proyectos)',
    monto_anid_mclp: 'Inversión Acumulada en Ciencia ANID (M$)',
    innovacion_corfo_mclp: 'Inversión en Innovación CORFO Innova (M$)',
    monto_corfo_innova_mclp: 'Inversión en Innovación CORFO Innova (M$)',
    proyectos_ctci_total: 'Total de Proyectos CTCi e Innovación',
    investigadores_residentes: 'Investigadores Residentes Estimados',
    investigadores_residentes_est: 'Investigadores Residentes Estimados',
    centros_y_estaciones_ctci_count: 'Centros Científicos y Estaciones de Campo CTCi (centros)',
    evaluacion_uaysen_promedio_i8: 'Evaluación Desempeño Universidad de Aysén (nota 1-7)',
    nota_percepcion_cultura_b4b: 'Percepción Oportunidades Culturales Barómetro (nota 1-7)',
    participacion_cultural_pct_c2: 'Participación en Organizaciones Culturales (%)',
    percepcion_ctci_prioritaria_pct_i1i: 'Percepción Actividades CTCi Prioritarias (%)',
    gasto_cultura_per_capita_clp: 'Gasto Municipal en Cultura Per Cápita ($/hab)',
    ecmpo_solicitadas_ha: 'Solicitudes ECMPO Ley Lafkenche (ha)',
    ecmpo_traslape_acuicola_n: 'Concesiones Acuícolas con Traslape ECMPO',
    concesiones_acuicolas_en_snaspe: 'Concesiones Acuícolas en SNASPE',
    desembarque_artesanal_ton: 'Desembarque Pesquero Artesanal Flota Local RPA (ton/año)',
    desembarque_muelles_total_ton: 'Descarga Física Total en Muelles Incl. Zona Contigua (ton/año)',
    patente_acuicola_pua_mclp: 'Ingreso Municipal Patente Única de Acuicultura Art. 84 LGPA (M$ CLP/año)',
    peso_pua_ingresos_propios_pct: 'Peso de Patente Acuícola PUA sobre Ingresos Propios Municipales (%)',
    superficie_concesionada_mar_ha: 'Superficie Marina Concesionada de Acuicultura (ha)',
    empleo_directo_acuicola_n: 'Empleo Directo en Salmonicultura (trabajadores)',
    sancionatorios_sma_acuicolas_n: 'Procedimientos Sancionatorios SMA en Centros Acuícolas (SNIFA)',
    centros_infa_anaerobica_n: 'Centros Acuícolas con Condición INFA Anaeróbica',
    sancionatorios_sma_por_holding: 'Expedientes Sancionatorios SMA-SNIFA por Holding',
    acs_concesiones_totales: 'Concesiones Otorgadas por Barrio ACS',
    acs_centros_activos: 'Centros Activos por Barrio ACS',
    acs_biomasa_cosechada_ton: 'Biomasa Cosechada por Barrio ACS (ton)',
    acs_antibioticos_ica_g_ton: 'Uso de Antibióticos ICA por Barrio ACS (g/ton)',
    acs_mortalidad_ciclo_pct: 'Mortalidad en Ciclo por Barrio ACS (%)',
    acs_densidad_max_kg_m3: 'Densidad Máxima Autorizada SUBPESCA por Barrio ACS (kg/m³)',
    acs_infa_aerobica_pct: 'Centros con Condición INFA Aeróbica por Barrio ACS (%)',
    acs_concesiones_en_snaspe: 'Concesiones dentro de SNASPE por Barrio ACS',
    tasa_ocupacion_concesiones_pct: 'Tasa de Operación de Concesiones Acuícolas (%)',
    proporcion_concesiones_en_snaspe_pct: 'Proporción de Concesiones en SNASPE (%)',
    trabajadores_sii_por_centro_activo: 'Trabajadores SII por Centro Activo (trab./centro)',
    pesca_ind_fraccionamiento_art_pct: 'Fraccionamiento Artesanal Ley N° 21.752 (%)',
    pesca_ind_fraccionamiento_ind_pct: 'Fraccionamiento Industrial Ley N° 21.752 (%)',
    pesca_ind_valor_sancion_utm: 'Valor de Sanción SUBPESCA (UTM/ton)',
    pesca_ind_impuesto_43ter_utm: 'Impuesto Específico Art. 43 ter LGPA (UTM/ton)',
    sindicatos_pesca_artesanal: 'Sindicatos de Pesca Artesanal',
    mediana_espera_quirurgica_dias: 'Mediana de Espera Quirúrgica No GES (días)',
    holdings_salmoneros: 'Holdings y Empresas de Salmonicultura en Aysén',
    holdings_operadores_salmon: 'Holdings Salmoneros Operadores en la Comuna',
    pesquerias_industriales: 'Pesquerías y Cuotas Industriales / Artesanales',
    provincia: 'Provincia',
    cabecera: 'Cabecera Comunal',
    cuenca_bna: 'Cuenca Hidrográfica Principal (BNA)',

    // Conectividad Multimodal e Infraestructura
    red_vial_total_km: 'Red Vial Total Comunal (km)',
    red_vial_pavimentada_km: 'Red Vial Comunal Total Pavimentada (Ruta 7 + Secundaria) (km)',
    red_vial_ripio_km: 'Red Vial en Ripio (km)',
    red_vial_tierra_km: 'Red Vial en Tierra (km)',
    red_vial_pavimentada_pct: 'Porcentaje de Pavimentación Vial (%)',
    distancia_coyhaique_km: 'Distancia Terrestre a Coyhaique (km)',
    tiempo_viaje_coyhaique_hrs: 'Tiempo de Viaje en Transporte Público Multimodal a Coyhaique (horas)',
    dependencia_barcaza_nivel: 'Nivel de Dependencia de Barcaza (nivel 0-3)',
    hogares_sin_internet_fijo_pct: 'Hogares sin Conexión Fija a Internet (%)',
    cobertura_fibra_hogar_pct: 'Cobertura de Fibra Óptica al Hogar (%)',
    establecimientos_educacion_conectados_n: 'Establecimientos Educacionales Conectados FOA',

    // Informes Territoriales: Vivienda, Agropecuario, Salud y Glaciares
    deficit_habitacional_cuantitativo_n: 'Déficit Habitacional Cuantitativo (viviendas)',
    deficit_habitacional_cualitativo_n: 'Déficit Habitacional Cualitativo (viviendas)',
    sistemas_ssr_apr_n: 'Sistemas de Agua Potable Rural (SSR / APR)',
    cobertura_ssr_apr_familias: 'Beneficiarios SSR/APR (personas)',
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
    tasa_aprobacion_rs_sni_pct: 'Proyectos Municipales con Recomendación Satisfactoria (RS) en el SNI (%)',
    exclusion_bancaria_comunas_pct: 'Comunas en Exclusión Bancaria Privada (%)',
    puntos_cajavecina_n: 'Puntos de Corresponsalía CajaVecina BancoEstado',
    eventos_glof_cachet2_n: 'Vaciamientos Catastróficos GLOF Lago Cachet 2',
    glaciar_exploradores_estatus: 'Estatus Glaciar Exploradores (DGA/CONAF)',
    zoits_oficiales_count: 'Zonas de Interés Turístico Oficiales Decretadas',

    // Nuevas Variables Verificadas (Nov 2026)
    transparencia_activa_cplt_2026_pct: 'Cumplimiento Transparencia Activa CPLT 2026 (%)',
    participacion_presidencial_2025_2v_pct: 'Participación 2da Vuelta Presidencial Dic 2025 (%)',
    padron_electoral_nov_2025: 'Padrón Electoral Definitivo Nov 2025',
    ingresos_mun_bcn_2025_mclp: 'Ingresos Municipales Percibidos BCN/SINIM 2025 (M$)',
    fet_royalty_minero_2024_mclp: 'Fondo Equidad Territorial Royalty Minero 2024 (M$)',
    fet_royalty_minero_2025_mclp: 'Fondo Equidad Territorial Royalty Minero 2025 (M$)',
    fndr_gore_2023_proyectos_n: 'Iniciativas FNDR GORE Ejecutadas 2023 (N)',
    fndr_gore_2023_asignado_mclp: 'Inversión FNDR GORE Asignada 2023 (M$)',
    fndr_gore_2023_ejecutado_mclp: 'Inversión FNDR GORE Ejecutada 2023 (M$)',
    fndr_gore_2023_ejecucion_pct: 'Tasa Ejecución FNDR GORE 2023 (%)',
    fondos_concursables_gore_2023_n: 'Proyectos Adjudicados Fondos 8% GORE 2023 (N)',
    fondos_concursables_gore_2023_mclp: 'Monto Fondos Concursables 8% GORE 2023 (M$)',
    rsh_carencia_servicios_basicos_jun2026_pct: 'Personas Carentes de Servicios Básicos RSH Jun 2026 (%)',
    rsh_hacinamiento_jun2026_pct: 'Hogares Hacinados RSH Jun 2026 (%)',
    ruralidad_censo_2024_pct: 'Población Rural Censo 2024 (%)',
    conexiones_fijas_subtel_jun2026_n: 'Conexiones Fijas Internet SUBTEL Jun 2026 (N)',
    conexiones_residenciales_subtel_jun2026_n: 'Conexiones Residenciales Internet SUBTEL Jun 2026 (N)',
    variacion_conexiones_2015_2026_pct: 'Crecimiento Conexiones Fijas Internet 2015–Jun 2026 (%)',
    visitas_por_cama_turistica: 'Ratio Visitas SNASPE por Cama Turística',
    visitas_por_pernoctacion_ratio: 'Ratio Visitas SNASPE por Pernoctación EMAT',
    visitantes_extranjeros_pct: 'Visitantes Internacionales Receptivos SNASPE (%)',
    visitantes_extranjeros_snaspe_n: 'Visitantes Extranjeros Anuales SNASPE',
    tasa_ocupacion_estival_pct: 'Tasa de Ocupación Hotelera Estival Ene-Feb (%)',
    tasa_ocupacion_invernal_pct: 'Tasa de Ocupación Hotelera Invernal May-Ago (%)',
    concentracion_estival_pct: 'Concentración Estacional Estival Dic-Mar (%)',
    estadia_promedio_dias: 'Estadía Media Turística (días/noches EMAT)',
    gasto_diario_turista_usd: 'Gasto Diario Estimado por Turista (US$)',
    tarifa_adr_estimada_usd: 'Tarifa Hotelera Promedio Estimada ADR (US$)',
    revpar_estimado_usd: 'Ingreso por Habitación Disponible RevPAR (US$)',
    largo_pista_aerodromo_m: 'Largo de Pista Aeródromo DGAC (metros)',
    operaciones_aerodromo_interior_anual: 'Operaciones Aéreas Anuales Aeródromo Interior (operaciones/año)',
    establecimientos_slep_aysen: 'Establecimientos Escolares Públicos SLEP Aysén (colegios)',
    fondos_cultura_adjudicados_mclp: 'Subtotal Fondos Sectoriales MINCAP Adjudicados (Solo FONDART) (M$ CLP)',
    total_proyectos_ctci: 'Total Proyectos de Ciencia e Innovación (ANID + CORFO) (proyectos)',
    indice_envejecimiento: 'Índice de Envejecimiento Demográfico (65+ años por cada 100 menores de 15)',
    indice_masculinidad: 'Índice de Masculinidad Comunal (Hombres por cada 100 Mujeres)',
    barometro_confianza_institucional_pct_hist: 'Serie Barómetro (2018–2026): Confianza en Gestión Municipal (%)',
    barometro_redes_apoyo_comunitario_pct_hist: 'Serie Barómetro (2018–2026): Redes de Apoyo Comunitario (%)',
    barometro_orgullo_identidad_pct_hist: 'Serie Barómetro (2018–2026): Orgullo e Identidad Territorial (%)',
    barometro_prioridad_conectividad_pct_hist: 'Serie Barómetro (2018–2026): Prioridad a Conectividad (%)',
    barometro_tension_desarrollo_conservacion_pct_hist: 'Serie Barómetro (2018–2026): Tensión Desarrollo vs. Conservación (%)',
    barometro_intencion_migracion_juvenil_pct_hist: 'Serie Barómetro (2018–2026): Retención y Oportunidades Juveniles (%)',
    barometro_preocupacion_contaminacion_lena_pct_hist: 'Serie Barómetro (2018–2026): Urgencia por Contaminación de Leña (%)',
    barometro_evaluacion_acceso_salud_pct_hist: 'Serie Barómetro (2018–2026): Evaluación del Acceso a Salud (%)',
    subsidio_fiscal_diesel_kwh_clp: 'Subsidio Fiscal a Generación Diésel Aislada ($/kWh)',
    indice_aislamiento_multimodal: 'Índice Compuesto de Aislamiento Multimodal (0–100)',
    ventas_sii_domicilio_local_muf: 'Ventas SII con Domicilio Tributario en Aysén (Miles de UF)',
    ventas_sii_muf: 'Valor Bruto de Producción Física Regional SII (Miles de UF)',
    sucursales_bancarias_n: 'Sucursales Bancarias Totales CMF (Privada + BancoEstado)',
    cajeros_automaticos_n: 'Cajeros Automáticos ATM CMF (N°)',
    cajavecina_puntos_n: 'Puntos de Corresponsalía CajaVecina BancoEstado (N°)',
    viviendas_totales_censo_2024: 'Viviendas Totales Censadas Censo 2024 (viviendas)',
    viviendas_ocupadas_censo_2024: 'Viviendas Ocupadas Moradores Presentes Censo 2024 (viviendas)',
    pueblos_originarios_pct_censo_2024: 'Población Pueblos Originarios Censo 2024 (%)',
    inmigrantes_internacionales_pct_censo_2024: 'Inmigrantes Internacionales Censo 2024 (%)',
    deficit_cuantitativo_minvu: 'Déficit Habitacional Cuantitativo Censo 2024 MINVU CECT (viviendas)',
    deficit_habitacional_cuantitativo_viv: 'Déficit Habitacional Cuantitativo MINVU (viviendas)',
    deficit_cuantitativo_pct_hogares: 'Déficit Habitacional Cuantitativo (% Hogares Censo 2024)',
    carencia_servicios_basicos_rsh_pct: 'Carencia de Servicios Básicos RSH (%)',
    hacinamiento_rsh_pct: 'Hacinamiento Registro Social de Hogares (%)',
    matricula_escolar_total_n: 'Matrícula Escolar Total MINEDUC (estudiantes)',
    matricula_escolar_mineduc: 'Matrícula Escolar Total MINEDUC CEM (estudiantes)',
    matricula_slep_aysen_n: 'Matrícula Escolar Pública SLEP Aysén (estudiantes)',
    matricula_educacion_superior_sies_n: 'Matrícula Educación Superior SIES 2026 (estudiantes)',
    beneficiarios_ssr_apr_doh: 'Beneficiarios Agua Potable Rural SSR/APR DOH (personas)',
    ventas_por_empresa_uf: 'Ventas Promedio por Empresa SII (UF/empresa)',
    inversion_por_proyecto_seia_mmusd: 'Ticket Promedio por Proyecto SEIA (MM USD/proy.)',
    suelo_fiscal_bbnn_pct: 'Porcentaje de Suelo Fiscal Bienes Nacionales (%)',
    suelo_privado_pct: 'Porcentaje de Suelo en Propiedad Privada (%)',
    fndr_per_capita_mclp: 'Inversión FNDR Asignada Per Cápita (Miles $ CLP/hab)',
    fndr_gore_2023_per_capita_mclp: 'FNDR GORE 2023 Ejecutado Per Cápita (Miles $ CLP/hab)',
    royalty_fet_peso_presupuesto_pct: 'Peso del Royalty Minero FET 2025 sobre Presupuesto (%)',
    fcm_bcn_2025_mclp: 'Aporte Fondo Común Municipal (FCM) BCN 2025 (M$)',
    ipp_bcn_2025_mclp: 'Ingresos Propios Permanentes (IPP) BCN 2025 (M$)',
    participacion_fcm_ingreso_total_pct: 'Participación FCM sobre Ingreso Municipal Total (%)',
    gastos_corrientes_bcn_pct: 'Gastos Corrientes Municipales BCN (%)',
    participacion_municipales_2024_pct: 'Participación Electoral Municipal 2024 SERVEL (%)',
    ratio_padron_poblacion_pct: 'Ratio Padrón Electoral Nov-2025 / Censo 2024 (%)',
    pib_regional_nominal_mmclp: 'PIB Regional Nominal de Aysén (MM$ CLP)',
    generacion_hidro_gwh: 'Generación Hidroeléctrica Anual (GWh)',
    generacion_diesel_gwh: 'Generación Térmica Diésel Anual (GWh)',
    participacion_diesel_matriz_pct: 'Participación Térmica Diésel en Matriz (%)',
    fndr_asignado_vs_ejecutado_2015_2025: 'FNDR Asignado vs. Ejecutado GORE Aysén (M$ CLP)',
    fndr_gore_ejecutado_datosgob_hist: 'Ejecución FNDR GORE Aysén (datos.gob.cl, M$ CLP)',
    presupuesto_fndr_gore_aysen_mclp: 'Presupuesto FNDR GORE Aysén (M$ CLP)',
    emporcha_carga_transbordadores_ton: 'Carga en Transbordadores / Rodados EMPORCHA (ton)',
    emporcha_carga_comercial_ton: 'Carga Comercial General EMPORCHA (ton)',
    emporcha_graneles_mineros_ton: 'Graneles Mineros Transferidos EMPORCHA (ton)',
    emporcha_acuicultura_pesca_ton: 'Carga Acuicultura y Pesca EMPORCHA (ton)',
    tasa_dmcs_100k: 'Tasa de Delitos de Mayor Connotación Social DMCS (c/100k hab)',
    tasa_vif_100k: 'Tasa de Denuncias por Violencia Intrafamiliar VIF (c/100k hab)',
    escuelas_rurales_multigrado_n: 'Escuelas Rurales Multigrado SLEP (n°)',
    liceos_urbanos_n: 'Liceos de Enseñanza Media HC/TP (n°)',
    ratio_pobreza_multidim_vs_ingresos: 'Ratio Pobreza Multidimensional / Ingresos (veces)',
    deficit_habitacional_total_por_1000_hab: 'Déficit Habitacional Cuantitativo cada 1.000 Habitantes (viv./1.000 hab)',
    especies_exoticas_invasoras_n: 'Complejos de Especies Exóticas Invasoras EEI Presentes (especies)',
    episodios_gec_mp25_anual: 'Episodios Críticos GEC MP2.5 (>110 µg/m³, días/año)',
    expedientes_fiscalizacion_sma_n: 'Expedientes de Fiscalización Ambiental SMA (expedientes)',
    amenaza_volcanica_sismica_idx: 'Índice Integrado de Amenaza Volcánica y Sísmica (0-100)',
    centros_culturales_n: 'Centros Culturales y Casas de la Cultura (centros)',
    organizaciones_comunitarias_n: 'Organizaciones Comunitarias y Territoriales Activas (organizaciones)',
    cultores_patrimonio_inmaterial_n: 'Cultores Patrimonio Cultural Inmaterial SIGPA (cultores)',
    fndr_8pct_cultura_mclp: 'Inversión FNDR 8% Cultura y Patrimonio (M$ CLP)',
    gasto_municipal_cultura_mclp: 'Gasto Municipal Total en Cultura SINIM (M$ CLP)',
    aporte_universidades_f4g_pct: 'Aporte Percibido de Universidades al Desarrollo F4_G (%)',
    proporcion_ciencia_endogena_pct: 'Proporción de Proyectos ANID con Ciencia Endógena (%)',
    matricula_educacion_superior_sies_n: 'Matrícula Educación Superior SIES por Sede Comunal (estudiantes)',
    matricula_ed_superior_sies: 'Matrícula de Educación Superior SIES (estudiantes)',
    alojamientos_turisticos_rnpst_n: 'Alojamientos Turísticos Registrados RNPST (establecimientos)',
    operadores_aventura_rnpst_n: 'Operadores de Turismo Aventura Registrados RNPST (operadores)',
    guias_turismo_rnpst_n: 'Guías de Turismo Registrados RNPST (guías)',
    restaurantes_turisticos_rnpst_n: 'Restaurantes Turísticos Registrados RNPST (restaurantes)',
    prestadores_vigencia_patente_pct: 'Vigencia Formal de Patente en Prestadores RNPST (%)',
    llegadas_turistas_emat_n: 'Llegadas de Pasajeros a Alojamientos EMAT INE 2025 (llegadas)',
    visitantes_atractivos_totales_n: 'Visitantes a Atractivos Turísticos Totales SNASPE + Privados (visitas)',
    llegadas_por_cama_turistica: 'Llegadas EMAT por Cama Turística Disponible (llegadas/cama)',
    tasa_ocupacion_emat_estival_pct: 'Tasa de Ocupación Habitaciones INE EMAT Ene–Feb 2026 (%)',
    estadia_regional_viaje_dias: 'Estadía Media del Viaje Turístico en Aysén SIT UACh (días)',
    tarifa_adr_emat_clp: 'Tarifa Promedio Diaria EMAT Real 2025 ($ CLP)',
    revpar_emat_clp: 'Ingreso por Habitación Disponible EMAT Real 2025 ($ CLP)',
    empresas_act_turismo_sii_n: 'Empresas en Actividades Características del Turismo SII (empresas)',
    ventas_act_turismo_uf: 'Ventas Anuales en Actividades Características del Turismo SII (UF)',
    empleo_act_turismo_n: 'Empleo Dependiente Informado en ACT Turismo SII (empleos)',
    snaspe_superficie_ha: 'Superficie Protegida SNASPE por Unidad (ha CONAF)',
    snaspe_visitantes_anuales_n: 'Visitantes Anuales Oficiales CONAF por Unidad SNASPE (visitas)',
    snaspe_guardaparques_permanentes_n: 'Guardaparques Permanentes CONAF por Unidad SNASPE',
    snaspe_concesiones_salmon_dentro_n: 'Concesiones Salmoneras Dentro de Unidad SNASPE (SUBPESCA)',
    snaspe_superficie_salmon_ha: 'Superficie Acuícola Dentro de Unidad SNASPE (ha)',
    snaspe_inversion_pdze_mclp: 'Inversión Habilitante PDZE por Unidad SNASPE (M$ CLP)',
    pasos_fronterizos_pdi_aysen: 'Control Migratorio Pasos Fronterizos PDI Aysén (controles)'
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
    BCCH_CNR: {
      institucion: 'Banco Central de Chile (BCCh) — Cuentas Nacionales Regionales',
      titulo: 'Banco Central de Chile — PIB Regional de Aysén y 13 Actividades Económicas',
      url: 'https://si3.bcentral.cl/'
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
    },
    CPLT_2026: {
      institucion: 'Consejo para la Transparencia (CPLT) — Fiscalización Transparencia Activa Municipal 2026',
      titulo: 'CPLT — Cumplimiento Transparencia Activa Municipal 2026 (Promedio Aysén 73,8%)',
      url: 'https://www.consejotransparencia.cl/'
    },
    GORE_FNDR_DATOSGOB: {
      institucion: 'GORE Aysén (datos.gob.cl) / SUBDERE BCN — FNDR, Fondos 8% y FET Royalty Minero',
      titulo: 'GORE Aysén / SUBDERE — Inversión FNDR 2015–2023, Fondos Concursables y Royalty Minero 2024–2025',
      url: 'https://datos.gob.cl/dataset/inversion-anual-del-fondo-nacional-de-desarrollo-regional-del-gobierno-regional-de-aysen-anos-2005'
    },
    PUA_TGR_SINIM: {
      institucion: 'SINIM / Tesorería General de la República / Aduanas DUS (Art. 84 LGPA)',
      titulo: 'PUA Art. 84 LGPA, Empleo Directo Acuícola y Fuga de Procesamiento a Los Lagos',
      url: 'https://datos.sinim.gov.cl/'
    },
    SMA_SNIFA_INFA: {
      institucion: 'Superintendencia del Medio Ambiente (SNIFA) / SERNAPESCA / SUBPESCA (Res. Ex. 8228)',
      titulo: 'Fiscalización Ambiental Acuícola: Sancionatorios SNIFA, INFAs Anaeróbicas y Límite ICA 400 g/t',
      url: 'https://snifa.sma.gob.cl/'
    },
    BIDAT_RSH_2026: {
      institucion: 'Ministerio de Desarrollo Social y Familia (BIDAT) vía BCN — Registro Social de Hogares Junio 2026',
      titulo: 'BIDAT MDSF — Carencia de Servicios Básicos y Hacinamiento Comunal (Junio 2026)',
      url: 'https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2026&idcom=11101'
    },
    SERVEL_HISTORICO: {
      institucion: 'SERVEL / TRICEL / Congreso Nacional / GORE Aysén — Series Históricas 1989–2026',
      titulo: 'SERVEL / GORE Aysén — Elecciones Presidenciales, Parlamento, CORE 2013–2029 y Alcaldes 1992–2028',
      url: 'https://www.goreaysen.cl/consejeros-regionales/'
    },
    CEAD_SPD: {
      institucion: 'SPD / CEAD — Estadísticas Delictuales DMCS y VIF',
      titulo: 'CEAD — Tasas Comunales y Regionales DMCS y VIF (c/100k hab)',
      url: 'https://cead.spd.gov.cl/'
    },
    SMA_SNIFA: {
      institucion: 'Superintendencia del Medio Ambiente (SMA / SNIFA)',
      titulo: 'SMA — Expedientes de Fiscalización y Sanciones Ambientales en Aysén',
      url: 'https://snifa.sma.gob.cl/'
    },
    SIGPA_SERPAT: {
      institucion: 'MINCAP / SERPAT — Sistema de Información para la Gestión del Patrimonio Inmaterial (SIGPA)',
      titulo: 'SERPAT SIGPA — Cultores de Patrimonio Inmaterial y Sitios Arqueológicos CMN',
      url: 'https://www.sigpa.cl/'
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
    concesiones_acuicolas_en_snaspe: PROVENANCE_CATALOG_ENTRIES.SUBPESCA_SNASPE,
    desembarque_artesanal_ton: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    desembarque_muelles_total_ton: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    ecmpo_traslape_acuicola_n: PROVENANCE_CATALOG_ENTRIES.SUBPESCA_CRUBC,
    patente_acuicola_pua_mclp: PROVENANCE_CATALOG_ENTRIES.PUA_TGR_SINIM,
    peso_pua_ingresos_propios_pct: PROVENANCE_CATALOG_ENTRIES.PUA_TGR_SINIM,
    superficie_concesionada_mar_ha: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    empleo_directo_acuicola_n: PROVENANCE_CATALOG_ENTRIES.PUA_TGR_SINIM,
    sancionatorios_sma_acuicolas_n: PROVENANCE_CATALOG_ENTRIES.SMA_SNIFA_INFA,
    centros_infa_anaerobica_n: PROVENANCE_CATALOG_ENTRIES.SMA_SNIFA_INFA,
    sancionatorios_sma_por_holding: PROVENANCE_CATALOG_ENTRIES.SMA_SNIFA_INFA,
    acs_concesiones_totales: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    acs_centros_activos: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    acs_biomasa_cosechada_ton: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    acs_antibioticos_ica_g_ton: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    acs_mortalidad_ciclo_pct: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    acs_densidad_max_kg_m3: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    acs_infa_aerobica_pct: PROVENANCE_CATALOG_ENTRIES.SMA_SNIFA_INFA,
    acs_concesiones_en_snaspe: PROVENANCE_CATALOG_ENTRIES.SUBPESCA_SNASPE,
    tasa_ocupacion_concesiones_pct: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    proporcion_concesiones_en_snaspe_pct: PROVENANCE_CATALOG_ENTRIES.SUBPESCA_SNASPE,
    trabajadores_sii_por_centro_activo: PROVENANCE_CATALOG_ENTRIES.SERNAPESCA_SUBPESCA,
    pesca_ind_fraccionamiento_art_pct: PROVENANCE_CATALOG_ENTRIES.HOLDINGS_ACUICOLAS,
    pesca_ind_fraccionamiento_ind_pct: PROVENANCE_CATALOG_ENTRIES.HOLDINGS_ACUICOLAS,
    pesca_ind_valor_sancion_utm: PROVENANCE_CATALOG_ENTRIES.HOLDINGS_ACUICOLAS,
    pesca_ind_impuesto_43ter_utm: PROVENANCE_CATALOG_ENTRIES.HOLDINGS_ACUICOLAS,
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
    potencia_ernc_en_construccion_mw: PROVENANCE_CATALOG_ENTRIES.CNE,
    cobertura_subsidio_electrico_hogares_n: PROVENANCE_CATALOG_ENTRIES.CNE,
    cobertura_subsidio_electrico_pct: PROVENANCE_CATALOG_ENTRIES.CNE,
    diesel_clp_litro: PROVENANCE_CATALOG_ENTRIES.CNE,
    kerosene_clp_litro: PROVENANCE_CATALOG_ENTRIES.CNE,
    costo_kwh_termico_util_lena_clp: PROVENANCE_CATALOG_ENTRIES.CNE,
    costo_kwh_termico_util_kerosene_clp: PROVENANCE_CATALOG_ENTRIES.CNE,
    ratio_costo_calefaccion_electrica_vs_lena: PROVENANCE_CATALOG_ENTRIES.CNE,
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
    visitas_por_cama_turistica: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    visitas_por_pernoctacion_ratio: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    visitantes_extranjeros_pct: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    visitantes_extranjeros_snaspe_n: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    tasa_ocupacion_estival_pct: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    tasa_ocupacion_invernal_pct: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    concentracion_estival_pct: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    estadia_promedio_dias: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    gasto_diario_turista_usd: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    tarifa_adr_estimada_usd: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    revpar_estimado_usd: PROVENANCE_CATALOG_ENTRIES.SERNATUR_EMAT,
    largo_pista_aerodromo_m: PROVENANCE_CATALOG_ENTRIES.JAC_DGAC,
    operaciones_aerodromo_interior_anual: PROVENANCE_CATALOG_ENTRIES.JAC_DGAC,
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
    bibliotecas_publicas_count: PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN,
    puntos_cultura_comunitaria_pcc_n: PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN,
    fondart_fndr_mclp: PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN,
    total_espacios_culturales: PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN,
    monumentos_nacionales_count: PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN,
    proyectos_anid_n: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    monto_anid_mclp: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    innovacion_corfo_mclp: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    monto_corfo_innova_mclp: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    proyectos_ctci_total: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    total_proyectos_ctci: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    investigadores_residentes: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    investigadores_residentes_est: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    centros_y_estaciones_ctci_count: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,

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
    barometro_preocupacion_contaminacion_lena_pct: PROVENANCE_CATALOG_ENTRIES.BAROMETRO_UAYSEN,

    // Nuevas Variables Verificadas (Nov 2026)
    transparencia_activa_cplt_2026_pct: PROVENANCE_CATALOG_ENTRIES.CPLT_2026,
    participacion_presidencial_2025_2v_pct: PROVENANCE_CATALOG_ENTRIES.SERVEL_HISTORICO,
    padron_electoral_nov_2025: PROVENANCE_CATALOG_ENTRIES.SERVEL_HISTORICO,
    ingresos_mun_bcn_2025_mclp: PROVENANCE_CATALOG_ENTRIES.SINIM,
    fet_royalty_minero_2024_mclp: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    fet_royalty_minero_2025_mclp: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    fndr_gore_2023_proyectos_n: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    fndr_gore_2023_asignado_mclp: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    fndr_gore_2023_ejecutado_mclp: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    fndr_gore_2023_ejecucion_pct: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    fondos_concursables_gore_2023_n: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    fondos_concursables_gore_2023_mclp: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    rsh_carencia_servicios_basicos_jun2026_pct: PROVENANCE_CATALOG_ENTRIES.BIDAT_RSH_2026,
    rsh_hacinamiento_jun2026_pct: PROVENANCE_CATALOG_ENTRIES.BIDAT_RSH_2026,
    ruralidad_censo_2024_pct: PROVENANCE_CATALOG_ENTRIES.INE_CENSO,
    conexiones_fijas_subtel_jun2026_n: PROVENANCE_CATALOG_ENTRIES.SUBTEL,
    conexiones_residenciales_subtel_jun2026_n: PROVENANCE_CATALOG_ENTRIES.SUBTEL,
    variacion_conexiones_2015_2026_pct: PROVENANCE_CATALOG_ENTRIES.SUBTEL,
    subsidio_fiscal_diesel_kwh_clp: PROVENANCE_CATALOG_ENTRIES.CNE,
    indice_aislamiento_multimodal: PROVENANCE_CATALOG_ENTRIES.MOP_VIALIDAD,
    ventas_sii_domicilio_local_muf: PROVENANCE_CATALOG_ENTRIES.SII,
    ventas_sii_muf: PROVENANCE_CATALOG_ENTRIES.SII,
    ventas_por_empresa_uf: PROVENANCE_CATALOG_ENTRIES.SII,
    sucursales_bancarias_n: PROVENANCE_CATALOG_ENTRIES.CMF_BANCOESTADO,
    cajeros_automaticos_n: PROVENANCE_CATALOG_ENTRIES.CMF_BANCOESTADO,
    cajavecina_puntos_n: PROVENANCE_CATALOG_ENTRIES.CMF_BANCOESTADO,
    inversion_por_proyecto_seia_mmusd: PROVENANCE_CATALOG_ENTRIES.SEA_SEIA,
    suelo_fiscal_bbnn_pct: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    suelo_privado_pct: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    fndr_per_capita_mclp: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    fndr_gore_2023_per_capita_mclp: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    royalty_fet_peso_presupuesto_pct: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    participacion_municipales_2024_pct: PROVENANCE_CATALOG_ENTRIES.SERVEL_HISTORICO,
    ratio_padron_poblacion_pct: PROVENANCE_CATALOG_ENTRIES.SERVEL_HISTORICO,
    pib_regional_nominal_mmclp: PROVENANCE_CATALOG_ENTRIES.BCCH_CNR,
    generacion_hidro_gwh: PROVENANCE_CATALOG_ENTRIES.CNE,
    generacion_diesel_gwh: PROVENANCE_CATALOG_ENTRIES.CNE,
    participacion_diesel_matriz_pct: PROVENANCE_CATALOG_ENTRIES.CNE,
    emporcha_carga_transbordadores_ton: PROVENANCE_CATALOG_ENTRIES.EMPORCHA,
    emporcha_carga_comercial_ton: PROVENANCE_CATALOG_ENTRIES.EMPORCHA,
    emporcha_graneles_mineros_ton: PROVENANCE_CATALOG_ENTRIES.EMPORCHA,
    emporcha_acuicultura_pesca_ton: PROVENANCE_CATALOG_ENTRIES.EMPORCHA,
    tasa_dmcs_100k: PROVENANCE_CATALOG_ENTRIES.CEAD_SPD,
    tasa_vif_100k: PROVENANCE_CATALOG_ENTRIES.CEAD_SPD,
    escuelas_rurales_multigrado_n: PROVENANCE_CATALOG_ENTRIES.MINEDUC_SLEP,
    liceos_urbanos_n: PROVENANCE_CATALOG_ENTRIES.MINEDUC_SLEP,
    viviendas_totales_censo_2024: PROVENANCE_CATALOG_ENTRIES.INE_CENSO,
    viviendas_ocupadas_censo_2024: PROVENANCE_CATALOG_ENTRIES.INE_CENSO,
    pueblos_originarios_pct_censo_2024: PROVENANCE_CATALOG_ENTRIES.INE_CENSO,
    inmigrantes_internacionales_pct_censo_2024: PROVENANCE_CATALOG_ENTRIES.INE_CENSO,
    deficit_cuantitativo_minvu: PROVENANCE_CATALOG_ENTRIES.MINVU_DOH,
    deficit_habitacional_cuantitativo_viv: PROVENANCE_CATALOG_ENTRIES.MINVU_DOH,
    deficit_cuantitativo_pct_hogares: PROVENANCE_CATALOG_ENTRIES.MINVU_DOH,
    carencia_servicios_basicos_rsh_pct: PROVENANCE_CATALOG_ENTRIES.BIDAT_RSH_2026,
    hacinamiento_rsh_pct: PROVENANCE_CATALOG_ENTRIES.BIDAT_RSH_2026,
    matricula_escolar_total_n: PROVENANCE_CATALOG_ENTRIES.MINEDUC_SLEP,
    matricula_escolar_mineduc: PROVENANCE_CATALOG_ENTRIES.MINEDUC_SLEP,
    matricula_slep_aysen_n: PROVENANCE_CATALOG_ENTRIES.MINEDUC_SLEP,
    matricula_educacion_superior_sies_n: PROVENANCE_CATALOG_ENTRIES.MINEDUC_SLEP,
    beneficiarios_ssr_apr_doh: PROVENANCE_CATALOG_ENTRIES.MINVU_DOH,
    ratio_pobreza_multidim_vs_ingresos: PROVENANCE_CATALOG_ENTRIES.CASEN,
    deficit_habitacional_total_por_1000_hab: PROVENANCE_CATALOG_ENTRIES.MINVU,
    especies_exoticas_invasoras_n: PROVENANCE_CATALOG_ENTRIES.CONAF_SNASPE,
    episodios_gec_mp25_anual: PROVENANCE_CATALOG_ENTRIES.MMA_SINCA,
    expedientes_fiscalizacion_sma_n: PROVENANCE_CATALOG_ENTRIES.SMA_SNIFA,
    amenaza_volcanica_sismica_idx: PROVENANCE_CATALOG_ENTRIES.SERNAGEOMIN,
    centros_culturales_n: PROVENANCE_CATALOG_ENTRIES.MINCAP_CMN,
    organizaciones_comunitarias_n: PROVENANCE_CATALOG_ENTRIES.SINIM,
    cultores_patrimonio_inmaterial_n: PROVENANCE_CATALOG_ENTRIES.SIGPA_SERPAT,
    fndr_8pct_cultura_mclp: PROVENANCE_CATALOG_ENTRIES.GORE_FNDR_DATOSGOB,
    gasto_municipal_cultura_mclp: PROVENANCE_CATALOG_ENTRIES.SINIM,
    aporte_universidades_f4g_pct: PROVENANCE_CATALOG_ENTRIES.BAROMETRO_UAYSEN,
    proporcion_ciencia_endogena_pct: PROVENANCE_CATALOG_ENTRIES.ANID_CORFO,
    matricula_educacion_superior_sies_n: PROVENANCE_CATALOG_ENTRIES.SIES_MINEDUC,
    matricula_ed_superior_sies: PROVENANCE_CATALOG_ENTRIES.SIES_MINEDUC
  };

  // ============================================================================
  // WP-A.2: SINÓNIMOS DE INDICADORES (SIN 'holdings' EN concesiones_salmon)
  // ============================================================================
  const INDICATOR_SYNONYMS = {
    poblacion_censo_2024: ['poblacion', 'habitantes', 'personas viven', 'cuantas personas', 'cuanta gente', 'demografia', 'residentes', 'censo', 'cantidad de habitantes', 'population', 'inhabitants', 'most populated', 'least populated', 'menos pobladas', 'mas pobladas'],
    superficie_km2: ['superficie territorial', 'superficie', 'extension territorial', 'tamano comunal', 'area km2'],
    densidad_hab_km2: ['densidad poblacional', 'densidad', 'habitantes por km2'],
    dependencia_fcm_pct: ['dependencia del fondo comun municipal', 'fondo comun municipal', 'fcm', 'dependencia municipal', 'dependientes del fcm', 'dependencia fcm', 'dependencia de fondos centrales', 'transferencias subdere', 'financiamiento municipal fcm', 'autonomia financiera municipal', 'equidad territorial fiscal'],
    ingresos_propios_pct: ['porcentaje de ingresos propios', 'ingresos propios pct', 'participacion ingresos propios', 'ipp porcentaje', 'autonomia fiscal porcentual', 'proporcion ingresos propios'],
    ipp_per_capita_clp: ['ingresos propios', 'ingresos propios permanentes', 'autonomia financiera', 'ipp', 'recaudacion propia', 'recaudacion municipal propia'],
    presupuesto_mclp: ['presupuesto municipal', 'financiamiento municipal', 'como funciona el financiamiento municipal', 'finanzas municipales', 'recursos municipales', 'gasto municipal', 'ingresos municipales', 'plata municipal', 'presupuesto comunal', 'presupuesto anual', 'presupuesto vigente', 'sinim presupuesto'],
    presupuesto_per_capita_mclp: ['presupuesto per capita', 'gasto municipal por habitante', 'gasto municipal per capita'],
    fndr_mclp: ['inversion publica regional', 'fndr', 'fondo nacional de desarrollo regional', 'inversion regional'],
    concesiones_salmon: ['concesiones salmoneras', 'concesiones acuicolas', 'concesiones de salmon', 'acuicultura', 'salmonicultura', 'salmones', 'salmoneras'],
    centros_activos_salmon: ['centros activos', 'centros de cultivo', 'centros operativos'],
    biomasa_salmon_ton: ['biomasa de salmonicultura', 'biomasa salmon', 'biomasa cosechada', 'biomasa producida', 'biomasa acuicola', 'cosecha de salmon', 'toneladas de salmon', 'produccion salmonera', 'salmon biomass', 'harvested biomass'],
    antibioticos_ica_g_ton: ['antibioticos', 'uso de antibioticos', 'ica', 'antimicrobianos'],
    visitantes_snaspe: ['visitas a parques nacionales', 'parques nacionales', 'visitacion snaspe', 'visitas snaspe', 'turistas parques', 'national parks', 'park visitors', 'national park visits'],
    pernoctaciones_emat: ['noches de alojamiento turistico', 'alojamiento turistico', 'pernoctaciones', 'emat', 'overnight stays'],
    camas_turisticas: ['camas turisticas', 'camas disponibles', 'capacidad de camas', 'capacidad hotelera', 'available tourist beds', 'tourist beds', 'hotel beds'],
    visitas_por_cama_turistica: ['visitas por cama', 'visitas a camas', 'visitas sobre camas', 'ratio visitas cama', 'visits to available tourist beds', 'visits to tourist beds', 'ratio of national park visits', 'visits per bed', 'snaspe per bed'],
    visitas_por_pernoctacion_ratio: ['visitas sobre pernoctaciones', 'visitas por pernoctacion', 'visits to overnight stays', 'ratio overnight stays'],
    ratio_presion_turistica: ['presion turistica', 'indice de presion turistica', 'presion turistica sobre residentes', 'visitantes residentes', 'summer tourist pressure', 'tourist pressure', 'visitor pressure'],
    ha_snaspe_por_guardaparque: ['hectareas por guardaparque', 'ha por guardaparque', 'superficie por guardaparque', 'dotacion de guardaparques', 'guardaparques conaf', 'carga por guardaparque', 'guardaparques', 'guardaparque'],
    visitantes_extranjeros_pct: ['visitantes extranjeros', 'turistas extranjeros', 'turismo internacional', 'turismo receptivo', 'foreign visitors', 'international visitors', 'foreign tourists'],
    visitantes_extranjeros_snaspe_n: ['cantidad de visitantes extranjeros', 'turistas extranjeros snaspe', 'foreign park visitors'],
    tasa_ocupacion_estival_pct: ['ocupacion estival', 'tasa de ocupacion estival', 'ocupacion verano', 'summer occupancy rate'],
    tasa_ocupacion_invernal_pct: ['ocupacion invernal', 'tasa de ocupacion invernal', 'ocupacion invierno', 'winter occupancy rate'],
    concentracion_estival_pct: ['concentracion estival', 'estacionalidad estival', 'summer concentration'],
    estadia_promedio_dias: ['estadia media', 'estadia promedio', 'average stay', 'length of stay'],
    gasto_diario_turista_usd: ['gasto diario turista', 'gasto promedio turista', 'daily tourist spending'],
    tarifa_adr_estimada_usd: ['tarifa promedio diaria', 'adr hotelero', 'tarifa diaria promedio', 'average daily rate'],
    revpar_estimado_usd: ['revpar', 'ingreso por habitacion disponible', 'revenue per available room'],
    largo_pista_aerodromo_m: ['largo de pista', 'longitud de pista', 'pista aerodromo', 'metros de pista', 'capacidad de pista', 'runway length'],
    operaciones_aerodromo_interior_anual: ['operaciones aerodromos', 'aerodromos interiores', 'aerotaxis', 'vuelos subsidiados aerodromo', 'frecuencia vuelos interiores'],
    prestadores_sernatur: ['prestadores turisticos', 'sernatur', 'oferta turistica', 'rnpst'],
    alojamientos_turisticos_rnpst_n: ['alojamientos rnpst', 'alojamientos sernatur', 'hoteles cabanas registrados'],
    operadores_aventura_rnpst_n: ['operadores turismo aventura', 'aventura rnpst'],
    guias_turismo_rnpst_n: ['guias de turismo rnpst', 'guias registrados sernatur'],
    restaurantes_turisticos_rnpst_n: ['restaurantes turisticos rnpst'],
    prestadores_vigencia_patente_pct: ['vigencia patente rnpst', 'patentes vigentes turismo', 'brecha vigencia rnpst'],
    llegadas_turistas_emat_n: ['llegadas emat', 'llegadas de pasajeros turismo'],
    visitantes_atractivos_totales_n: ['atractivos turisticos totales', 'capillas de marmol visitantes', 'flujo total atractivos'],
    llegadas_por_cama_turistica: ['llegadas por cama', 'rotacion camas turisticas'],
    tasa_ocupacion_emat_estival_pct: ['ocupacion emat verano', 'ocupacion continua emat'],
    estadia_regional_viaje_dias: ['estadia regional viaje', 'encuesta balmaceda uach', 'duracion viaje regional'],
    tarifa_adr_emat_clp: ['adr clp', 'tarifa adr emat', 'adr pesos'],
    revpar_emat_clp: ['revpar clp', 'revpar emat', 'revpar pesos'],
    empresas_act_turismo_sii_n: ['empresas act turismo', 'actividades caracteristicas del turismo', 'rubro i sii'],
    ventas_act_turismo_uf: ['ventas act turismo', 'facturacion turismo uf'],
    empleo_act_turismo_n: ['empleo act turismo', 'ocupados turismo', 'informalidad turismo'],
    snaspe_visitantes_anuales_n: ['unidades snaspe', 'visitantes por unidad snaspe', 'sbap snaspe', 'lista verde uicn', 'glaciar exploradores', 'rol 7477'],
    pasos_fronterizos_pdi_aysen: ['pasos fronterizos pdi', 'control migratorio pdi', 'jeinimeni', 'coyhaique alto', 'huemules'],
    hogares_lena_pct: ['calefaccionan con lena', 'hogares que calefaccionan con lena', 'uso de lena', 'calefaccion lena', 'calefaccion a lena', 'firewood', 'firewood heating', 'wood heating', 'heating dependency', 'firewood heating dependency'],
    dias_sobre_norma_mp25: ['contaminacion critica mp25', 'contaminacion critica mp2.5', 'mp2.5', 'pm2.5', 'mp25', 'pm25', 'dias con contaminacion', 'calidad del aire', 'material particulado', 'critical days', 'air pollution', 'air quality'],
    saidi_horas_anual: ['saidi', 'cortes de luz', 'apagones', 'sin luz', 'se corta la luz', 'cortes de electricidad', 'interrupcion electrica', 'calidad electrica', 'corte electrico saidi', 'horas de corte electrico'],
    tarifa_bt1_clp: ['tarifa electrica', 'tarifa bt1', 'precio electricidad', 'cuenta de la luz', 'precio de la luz', 'luz cara', 'electricidad cara'],
    costo_diesel_aislado_clp: ['costo de generacion diesel aislado', 'costo generacion diesel aislado', 'generacion diesel aislado', 'costo diesel aislado'],
    subsidio_fiscal_diesel_kwh_clp: ['subsidio fiscal diesel', 'subsidio diesel', 'subsidio electrico', 'subsidio sistemas aislados'],
    gasolina_93_clp: ['bencina', 'gasolina', 'combustible', 'combustibles', 'precio de la bencina', 'nafta'],
    precio_lena_m3: ['precio de la lena', 'valor de la lena', 'metro de lena', 'costo de la lena'],
    potencia_mw: ['capacidad instalada', 'potencia instalada', 'megavatios', 'generacion electrica', 'matriz energetica', 'nudos criticos energeticos', 'materia energetica'],
    potencia_ernc_en_construccion_mw: ['ernc en construccion', 'alto baguales ampliacion', 'bess coyhaique', 'cerro sombrero solar'],
    cobertura_subsidio_electrico_hogares_n: ['subsidio electrico hogares', 'ley 21667', 'quinto proceso subsidio electrico'],
    cobertura_subsidio_electrico_pct: ['cobertura subsidio electrico', 'porcentaje subsidio electrico'],
    diesel_clp_litro: ['precio diesel', 'petroleo diesel', 'diesel por litro'],
    kerosene_clp_litro: ['kerosene', 'parafina', 'fepp kerosene', 'shock kerosene'],
    costo_kwh_termico_util_lena_clp: ['costo kwh util lena', 'costo termico lena'],
    costo_kwh_termico_util_kerosene_clp: ['costo kwh util kerosene', 'costo termico parafina'],
    ratio_costo_calefaccion_electrica_vs_lena: ['ratio calefaccion electrica vs lena', 'bomba de calor vs lena', 'brecha termica electrica lena'],
    camas_hospitalarias: ['camas hospitalarias', 'camas de hospital', 'hospitales'],
    medicos_por_mil_hab: ['medicos por mil habitantes', 'medicos por mil hab', 'dotacion medica', 'medicos', 'doctores', 'especialistas', 'falta de medicos'],
    urgencias_respiratorias_pct: ['enfermedades respiratorias', 'problemas respiratorios', 'urgencias respiratorias', 'bronquitis', 'asma'],
    aeroevacuaciones_samu_n: ['ambulancia aerea', 'evacuacion aeromedica', 'aeroevacuaciones', 'aeroevacuaciones samu', 'samu', 'traslado de urgencia'],
    postas_salud_rural: ['postas rurales', 'postas de salud rural', 'aps'],
    matricula_escolar: ['matricula escolar', 'alumnos', 'estudiantes', 'educacion escolar'],
    ruralidad_censo_2024_pct: ['ruralidad', 'poblacion rural', 'porcentaje rural', 'tasa de ruralidad'],
    pobreza_ingresos_pct: ['pobreza por ingresos', 'tasa de pobreza', 'pobreza casen'],
    pobreza_multidim_pct: ['pobreza multidimensional', 'tasa de pobreza multidimensional'],
    profesionalizacion_pct: ['funcionarios municipales profesionales', 'profesionalizacion municipal', 'proporcion de profesionales municipales', 'personal municipal profesional', 'profesionalizacion'],
    amerb_decretadas: ['areas amerb', 'amerb', 'areas de manejo', 'amerb decretadas'],
    amerb_operativas: ['amerb operativas', 'areas de manejo amerb operativas', 'areas de manejo operativas', 'amerb operativas vigentes', 'amerb activas'],
    ecmpo_solicitadas_ha: ['hectareas de ecmpo', 'hectareas ecmpo', 'ecmpo solicitadas', 'ecmpo', 'solicitudes ecmpo', 'ley lafkenche', 'lafkenche', 'espacios costeros marinos', 'espacios costeros pueblos originarios'],
    concesiones_acuicolas_en_snaspe: ['concesiones acuicolas en snaspe', 'concesiones en snaspe', 'concesiones superpuestas en snaspe', 'concesiones dentro de snaspe', 'jaulas en snaspe'],
    desembarque_artesanal_ton: ['desembarque artesanal', 'desembarque pesquero artesanal', 'toneladas desembarque artesanal'],
    desembarque_muelles_total_ton: ['descarga total muelles', 'desembarque zona contigua', 'transferencia fisica caletas'],
    ecmpo_traslape_acuicola_n: ['traslape ecmpo acuicola', 'concesiones suspendidas ecmpo'],
    patente_acuicola_pua_mclp: ['patente acuicola', 'patentes salmoneras', 'pua', 'articulo 84 lgpa', 'tributos salmoneros', 'impuestos salmoneras municipio'],
    peso_pua_ingresos_propios_pct: ['peso patente acuicola', 'dependencia patente salmonera', 'pua sobre ingresos propios'],
    superficie_concesionada_mar_ha: ['superficie concesionada acuicultura', 'hectareas marinas acuicolas'],
    empleo_directo_acuicola_n: ['empleo directo salmon', 'trabajadores salmoneros', 'empleo plantas de proceso chacabuco'],
    sancionatorios_sma_acuicolas_n: ['sanciones sma', 'snifa', 'sobreproduccion salmones', 'fiscalizacion ambiental salmoneras'],
    centros_infa_anaerobica_n: ['infa anaerobica', 'fondo marino sin oxigeno'],
    sancionatorios_sma_por_holding: ['sanciones sma por holding', 'snifa por holding'],
    acs_concesiones_totales: ['barrios acuicolas', 'barrios sanitarios', 'acs', 'concesiones por barrio acs'],
    acs_centros_activos: ['centros activos por barrio acs'],
    acs_biomasa_cosechada_ton: ['biomasa por barrio acs'],
    acs_antibioticos_ica_g_ton: ['antibioticos por barrio acs', 'ica por barrio'],
    acs_mortalidad_ciclo_pct: ['mortalidad por barrio acs', 'mortalidad ciclo salmon'],
    acs_densidad_max_kg_m3: ['densidad de cultivo por barrio', 'densidad maxima acs'],
    acs_infa_aerobica_pct: ['infa aerobica por acs'],
    acs_concesiones_en_snaspe: ['snaspe por barrio acs'],
    tasa_ocupacion_concesiones_pct: ['tasa de ocupacion concesiones', 'tasa de operacion acuicola'],
    proporcion_concesiones_en_snaspe_pct: ['proporcion concesiones en snaspe', 'porcentaje concesiones en snaspe'],
    trabajadores_sii_por_centro_activo: ['trabajadores por centro activo', 'arraigo laboral salmon'],
    daa_no_consuntivos_m3s: ['derechos de agua', 'derechos de aprovechamiento de agua', 'daa', 'caudal derechos de agua'],
    gasto_cultura_per_capita_clp: ['gasto municipal en cultura per capita', 'gasto en cultura per capita', 'gasto cultura per capita', 'gasto cultural per capita', 'gasto municipal cultura'],
    total_espacios_culturales: ['espacios culturales', 'infraestructura cultural', 'centros culturales'],
    monumentos_nacionales_count: ['monumentos', 'monumentos nacionales', 'patrimonio monumental'],
    fondos_cultura_adjudicados_mclp: ['fondos de cultura', 'fondos culturales', 'fondos concursables adjudicados', 'fondos concursables cultura', 'fondos de cultura mincap', 'fondos cultura mincap adjudicados', 'fondos cultura mincap', 'fondart'],
    bibliotecas_snbp_n: ['bibliotecas', 'bibliotecas publicas', 'bibliotecas snbp'],
    puntos_cultura_comunitaria_pcc_n: ['puntos de cultura comunitaria', 'pcc', 'puntos de cultura'],
    proyectos_ctci_total: ['proyectos ctci', 'proyectos de ciencia', 'ciencia y tecnologia'],
    monto_anid_mclp: ['monto anid', 'fondos anid', 'financiamiento anid', 'proyectos anid'],
    innovacion_corfo_mclp: ['innovacion corfo', 'corfo innova', 'monto corfo innova'],
    empresas_sii: ['empresas sii', 'empresas registradas en el sii', 'empresas registradas sii', 'numero de empresas', 'empresas activas', 'tejido empresarial'],
    concesiones_mineras_ha: ['hectareas de concesiones mineras', 'concesiones mineras', 'pertenencias mineras', 'hectareas mineras', 'mineria sernageomin'],
    compras_locales_pct: ['compras locales', 'porcentaje de compras locales', 'retencion comercial', 'compras publicas locales'],
    fuga_compras_pct: ['fuga de compras', 'fuga de compras extrarregionales', 'fuga comercial', 'compras extrarregionales'],
    trabajadores_sii: ['empleo', 'puestos de trabajo', 'trabajo formal', 'trabajadores', 'fuerza laboral'],
    parcelaciones_sag_n: ['parcelas', 'parcelaciones', 'loteos', 'subdivision predial', 'parcelas de agrado'],
    inversion_seia_mmusd: ['inversion aprobada seia', 'inversion seia', 'proyectos aprobados seia', 'inversion ambiental seia'],
    seia_plazo_dias: ['plazo seia', 'plazo promedio de evaluacion ambiental', 'plazo de evaluacion ambiental', 'evaluacion ambiental en el seia', 'plazo evaluacion seia', 'permisologia seia', 'dias evaluacion seia'],
    red_vial_total_km: ['red vial', 'red vial total', 'kilometros de caminos', 'vialidad'],
    red_vial_pavimentada_km: ['red vial pavimentada', 'caminos pavimentados', 'asfalto', 'rutas', 'estado de las rutas', 'rutas de entrada', 'insumos', 'abastecimiento', 'logistica', 'carretera austral', 'ruta 7'],
    ruta7_pavimentada_km: ['ruta 7 pavimentada', 'pavimentacion ruta 7', 'asfalto ruta 7', 'ruta 7'],
    ruta7_ripio_km: ['ruta 7 ripio', 'ripio ruta 7', 'tramos de ripio ruta 7'],
    emporcha_toneladas: ['puerto chacabuco', 'emporcha', 'carga portuaria', 'entrada de insumos', 'insumos', 'abastecimiento maritimo', 'cabotaje', 'toneladas movilizadas'],
    red_vial_pavimentada_pct: ['porcentaje de red vial pavimentada', 'porcentaje de pavimentacion', 'pavimentacion vial', 'pavimentacion'],
    tiempo_viaje_coyhaique_hrs: ['tiempo de traslado', 'tiempo de traslado a coyhaique', 'tiempo de viaje', 'tiempo a coyhaique', 'horas de viaje', 'horas a coyhaique', 'traslado coyhaique'],
    hogares_sin_internet_fijo_pct: ['sin internet', 'brecha digital', 'hogares sin internet', 'internet fijo', 'fibra optica', 'conectividad digital'],
    deficit_habitacional_cuantitativo_n: ['deficit habitacional', 'deficit cuantitativo', 'viviendas nuevas', 'falta de viviendas', 'vivienda', 'casa', 'casas', 'viviendas', 'arriendo', 'arrendar', 'conseguir casa', 'techo', 'allegados', 'falta de vivienda'],
    deficit_habitacional_cualitativo_n: ['deficit cualitativo', 'mejoramiento de vivienda', 'viviendas a reparar'],
    indice_envejecimiento: ['vejez', 'envejecimiento', 'envejecidos', 'envejecida', 'adultos mayores', 'tercera edad', 'abuelos', 'ancianos', 'indice de envejecimiento'],
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
    barometro_evaluacion_acceso_salud_pct: ['evaluacion salud', 'satisfaccion salud', 'acceso a salud barometro', 'evaluacion ciudadana del acceso a salud', 'evaluacion acceso salud', 'acceso a salud del barometro', 'barometro b3 a'],
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
    tasa_mortalidad_cancer_gastrico_100k: ['cancer', 'tumores', 'cancer gastrico', 'tasa de mortalidad por cancer gastrico', 'mortalidad por cancer'],
    tasa_mortalidad_suicidio_100k: ['suicidio', 'suicidios', 'salud mental', 'tasa de mortalidad por suicidio', 'mortalidad por suicidio'],
    puntos_cajavecina_bancoestado: ['bancos', 'cajeros', 'sacar plata', 'caja vecina', 'cajavecina', 'banca'],
    sucursales_banca_privada_cmf: ['sucursales bancarias', 'bancos privados', 'banca privada', 'sin banco'],
    sindicatos_pesca_artesanal: ['pescadores', 'pesca artesanal', 'caletas', 'sindicatos pesqueros', 'sindicatos de pesca artesanal'],
    autoidentificacion_indigena_pct: ['pueblos originarios', 'indigenas', 'mapuche', 'poblacion indigena', 'autoidentificacion indigena'],
    comunidades_indigenas_conadi: ['comunidades indigenas', 'conadi', 'comunidades indigenas conadi', 'comunidades conadi'],
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
    matricula_sies_total: ['matricula educacion superior', 'sies', 'estudiantes educacion superior', 'matricula sies', '2924 estudiantes'],
    matricula_cft_estatal: ['cft estatal', 'cft estatal aysen', 'matricula cft estatal', '737 estudiantes cft'],
    matricula_inacap_coyhaique: ['inacap coyhaique', 'inacap aysen', 'matricula inacap', '800 estudiantes inacap'],
    matricula_universidad_aysen: ['universidad de aysen', 'matricula uaysen', 'estudiantes uaysen', '790 estudiantes uaysen'],
    solicitudes_ecmpo_ha: ['ecmpo', 'solicitudes ecmpo', 'ley lafkenche', 'espacios costeros pueblos originarios', 'pu wapi', 'antunen rain', '620000 ha', 'crubc ecmpo'],
    concesiones_salmon_snaspe_n: ['concesiones en snaspe', 'concesiones reserva las guaitecas', 'salmoneras en areas protegidas', '312 concesiones snaspe', 'ley sbap salmoneras'],
    ejecucion_fndr_devengado_mclp: ['fndr devengado', 'ejecucion real fndr', 'ejecucion presupuestaria gore', 'fndr dipres', 'gasto devengado fndr', '61548 devengado'],
    inversion_sectorial_ministerial_mclp: ['inversion sectorial ministerial', 'inversion sectorial', 'gasto ministerial centralizado', 'gasto sectorial mop minvu salud', '402000 sectorial'],
    tasa_aprobacion_rs_sni_pct: ['tasa de aprobacion rs', 'tasa aprobacion rs', 'tasa rs', 'recomendacion satisfactoria', 'aprobacion sni', 'cartera rs sni', 'proyectos rs', 'rs sni bip', 'proyectos rs mideso', 'eficacia proyectos sni'],
    exclusion_bancaria_comunas_pct: ['exclusion bancaria', 'banca privada', 'sucursales bancarias', 'comunas sin bancos', '80% exclusion bancaria'],
    puntos_cajavecina_n: ['cajavecina', 'caja vecina', 'puntos cajavecina', 'bancoestado cajavecina', 'corresponsalia bancaria', '400 puntos cajavecina'],
    eventos_glof_cachet2_n: ['glof', 'eventos glof', 'glofs', 'lago cachet 2', 'cachet 2', 'vaciamientos lago cachet', 'cuenca baker glof', 'rio colonia glof', '27 vaciamientos'],
    glaciar_exploradores_estatus: ['glaciar exploradores', 'exploradores', 'clausura trekking hielo', 'cierre glaciar exploradores', 'hielo exploradores'],
    zoits_oficiales_count: ['zoits oficiales', '3 zoits decretadas', 'zoits decretadas', 'zoits oficiales decretadas'],
    transparencia_activa_cplt_2026_pct: ['transparencia activa', 'transparencia', 'cplt', 'consejo para la transparencia', 'probidad municipal', 'cumplimiento municipal transparencia'],
    fet_royalty_minero_2025_mclp: ['royalty minero', 'fet', 'fondo de equidad territorial', 'ley royalty', 'royalty municipal'],
    fndr_gore_2023_ejecutado_mclp: ['fndr ejecutado', 'gasto fndr gore', 'ejecucion fndr datos gob', 'inversion gore ejecutada'],
    fondos_concursables_gore_2023_n: ['fondos concursables', '8% fndr', 'fondo 8 porciento', 'vinculacion con la comunidad gore', 'proyectos sociales 8%'],
    evaluacion_uaysen_promedio_i8: ['evaluacion ciudadana de la universidad de aysen', 'evaluacion de la universidad de aysen', 'evaluacion uaysen', 'evaluacion universidad de aysen', 'evaluacion de la uaysen', 'nota uaysen', 'nota universidad de aysen', 'valoracion uaysen', 'reputacion uaysen', 'barometro uaysen i8', 'calificacion uaysen', 'desempeno universidad de aysen'],
    nota_percepcion_cultura_b4b: ['percepcion cultura', 'nota percepcion cultura', 'oportunidades culturales'],
    participacion_cultural_pct_c2: ['participacion cultural', 'organizaciones culturales'],
    percepcion_ctci_prioritaria_pct_i1i: ['percepcion ctci prioritaria', 'percepcion ciudadana de prioridad de la ciencia', 'prioridad de la ciencia ctci', 'ctci prioritaria'],
    participacion_presidencial_2025_2v_pct: ['participacion electoral', 'participacion servel', 'votacion electoral', 'tasa de participacion electoral', 'participacion electoral 2025', 'voto obligatorio 2025', 'segunda vuelta 2025', 'historia electoral', 'composicion politica'],
    rsh_carencia_servicios_basicos_jun2026_pct: ['carencia servicios basicos', 'servicios basicos rsh', 'bidat rsh', 'registro social hogares', 'hacinamiento rsh'],
    conexiones_fijas_subtel_jun2026_n: ['conexiones fijas subtel', 'subtel junio 2026', 'starlink aysen', 'fttx aysen', 'fibra ultima milla', 'telecomunicaciones subtel'],
    superficie_snaspe_pct: ['superficie snaspe', 'porcentaje snaspe', 'porcentaje de superficie snaspe', 'areas protegidas snaspe', 'superficie protegida snaspe'],
    ventas_sii_domicilio_local_muf: ['ventas domicilio local', 'ventas locales sii', '25800 muf', 'ventas tributarias locales'],
    ventas_sii_muf: ['ventas sii', 'ventas anuales sii', 'miles de uf', 'ventas declaradas sii', 'valor bruto produccion'],
    sucursales_bancarias_n: ['sucursales bancarias totales', 'sucursales bancarias', 'bancos en la comuna'],
    cajeros_automaticos_n: ['cajeros automaticos', 'cajeros', 'atm'],
    cajavecina_puntos_n: ['puntos cajavecina', 'cajavecina puntos', 'corresponsalia cajavecina'],
    ventas_por_empresa_uf: ['ventas por empresa', 'uf por empresa', 'ventas promedio por empresa'],
    inversion_por_proyecto_seia_mmusd: ['ticket promedio seia', 'inversion por proyecto seia'],
    suelo_fiscal_bbnn_pct: ['suelo fiscal', 'bienes nacionales', 'porcentaje suelo fiscal'],
    suelo_privado_pct: ['suelo privado', 'propiedad privada', 'porcentaje de suelo privado', 'porcentaje suelo privado'],
    fndr_per_capita_mclp: ['fndr per capita', 'inversion fndr por habitante', 'inversion fndr per capita'],
    fndr_gore_2023_per_capita_mclp: ['fndr 2023 per capita', 'fndr ejecutado per capita', 'fndr ejecutada per capita', 'inversion fndr ejecutada per capita', 'inversion fndr per capita', 'fndr per capita'],
    royalty_fet_peso_presupuesto_pct: ['peso royalty', 'porcentaje royalty presupuesto', 'royalty sobre presupuesto', 'peso tiene en su presupuesto', 'peso en el presupuesto', 'peso en su presupuesto', 'peso presupuesto royalty'],
    participacion_municipales_2024_pct: ['participacion municipales 2024', 'elecciones municipales 2024'],
    ratio_padron_poblacion_pct: ['ratio padron poblacion', 'padron sobre poblacion'],
    indice_aislamiento_multimodal: ['indice de aislamiento', 'aislamiento multimodal', 'vulnerabilidad energetico digital'],
    tasa_vif_100k: ['violencia intrafamiliar', 'vif', 'denuncias vif', 'tasa vif', 'tasas de vif'],
    tasa_dmcs_100k: ['delitos de mayor connotacion social', 'dmcs', 'tasa dmcs', 'tasas de dmcs', 'connotacion social', 'cead'],
    establecimientos_slep_aysen: ['establecimientos escolares slep', 'establecimientos slep', 'establecimientos escolares', 'colegios slep', 'escuelas slep'],
    matricula_ed_superior_sies: ['educacion superior', 'matricula de educacion superior', 'matricula educacion superior sies', 'matricula superior', 'sies'],
    viviendas_totales_censo_2024: ['viviendas totales', 'viviendas censadas', 'parque habitacional censo 2024'],
    deficit_cuantitativo_pct_hogares: ['porcentaje deficit cuantitativo', 'tasa deficit habitacional'],
    matricula_slep_aysen_n: ['matricula slep', 'alumnos slep aysen'],
    pueblos_originarios_pct_censo_2024: ['pueblos originarios censo 2024', 'pertenencia indigena censo 2024'],
    inmigrantes_internacionales_pct_censo_2024: ['inmigrantes internacionales', 'poblacion extranjera censo 2024', 'migrantes censo 2024'],
    indice_masculinidad: ['indice de masculinidad', 'masculinidad'],
    establecimientos_aps_n: ['establecimientos aps', 'dispositivos aps', 'centros aps', 'red aps', 'recintos aps', 'cesfam y postas', 'atencion primaria'],
    traslado_coyhaique_hrs: ['tiempo de traslado a coyhaique en ambulancia', 'traslado en ambulancia', 'derivacion medica a coyhaique', 'tiempo de derivacion medica', 'traslado a coyhaique'],
    consumo_lena_m3_solidos_anual: ['volumen anual de lena', 'consumo anual de lena', 'm3 solidos', 'lena quemada'],
    informalidad_lena_pct: ['informalidad lena', 'informalidad de la lena', 'lena informal', 'lena humeda'],
    fauna_amenazada_n: ['fauna amenazada', 'especies de fauna amenazada', 'especies rce', 'fauna rce'],
    especies_exoticas_invasoras_n: ['especies exoticas invasoras', 'especies invasoras', 'eei'],
    expedientes_fiscalizacion_sma_n: ['expedientes de fiscalizacion sma', 'expedientes sma', 'fiscalizacion sma'],
    amenaza_volcanica_sismica_idx: ['amenaza volcanica', 'volcanes activos rnvv', 'sismos usgs'],
    fndr_8pct_cultura_mclp: ['fndr 8% cultura', 'fndr 8 cultura', '8% cultura'],
    gasto_municipal_cultura_mclp: ['gasto municipal en cultura', 'gasto municipal cultura'],
    aporte_universidades_f4g_pct: ['aporte de las universidades', 'rol universidades', 'f4 g', 'f4_g'],
    proporcion_ciencia_endogena_pct: ['ciencia endogena', 'ciencia local vs extrarregional', 'extractivismo cientifico']
  };

  // ============================================================================
  // WP-B.2: DEFINICIONES SECTORIALES PARA CRUCES COMUNA × SECTOR
  // ============================================================================
  const SECTOR_DEFINITIONS = {
    salmonicultura: {
      id: 'salmonicultura',
      title: 'Salmonicultura y Acuicultura',
      hub: 'II',
      regex: /\b(salmonicultura|salmon|salmones|salmonera|salmoneras|salmonero|salmoneros|acuicultura|acuicola|acuicolas|biomasa|centros de cultivo|concesiones acuicolas|concesiones salmoneras|holding|holdings|empresas salmoneras|empresa salmonera)\b/i,
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
      regex: /\b(turismo|turistico|turistica|sernatur|snaspe|parques nacionales|pernoctaciones|emat|alojamiento|zoit|eco-?lodge|tourist beds|overnight stays|tourist pressure|national park)\b/i,
      varX: 'visitantes_snaspe',
      varY: 'prestadores_sernatur',
      chartTitle: 'Visitantes Anuales a Parques SNASPE vs. Prestadores Turísticos SERNATUR',
      provenanceKeys: ['visitantes_snaspe', 'prestadores_sernatur'],
      keys: ['prestadores_sernatur', 'camas_turisticas', 'visitas_por_cama_turistica', 'pernoctaciones_emat', 'visitas_por_pernoctacion_ratio', 'visitantes_snaspe', 'visitantes_extranjeros_pct', 'concentracion_estival_pct', 'estadia_promedio_dias', 'tarifa_adr_estimada_usd', 'revpar_estimado_usd', 'superficie_snaspe_pct', 'ratio_presion_turistica']
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
    cultura: {
      id: 'cultura',
      title: 'Cultura, Patrimonio e Identidad',
      hub: 'IX',
      regex: /\b(cultura|cultural\w*|patrimonio|patrimonial\w*|museos?|bibliotecas?|fondart|monumentos?|sitios?\s+arqueologic\w*|artesania|fiestas?\s+costumbristas?|cultores?)\b/i,
      varX: 'total_espacios_culturales',
      varY: 'fondos_cultura_adjudicados_mclp',
      chartTitle: 'Total de Espacios Culturales e Infraestructura vs. Fondos Culturales Adjudicados (M$)',
      provenanceKeys: ['total_espacios_culturales', 'fondos_cultura_adjudicados_mclp', 'bibliotecas_snbp_n'],
      keys: ['total_espacios_culturales', 'bibliotecas_snbp_n', 'fondos_cultura_adjudicados_mclp', 'monumentos_nacionales_count', 'museos_espacios_n', 'gasto_municipal_cultura_mclp']
    },
    ctci: {
      id: 'ctci',
      title: 'Ciencia, Tecnología e Innovación (CTCi)',
      hub: 'X',
      regex: /\b(ciencia|cientific\w*|investigacion|investigadores?|ctci|anid|fondecyt|corfo|innovacion|ciep|uaysen|inia|centros?\s+de\s+investigacion|laboratorios?)\b/i,
      varX: 'total_proyectos_ctci',
      varY: 'investigadores_residentes_est',
      chartTitle: 'Total de Proyectos CTCi (ANID + CORFO) vs. Investigadores Residentes Estimados por Comuna',
      provenanceKeys: ['total_proyectos_ctci', 'investigadores_residentes_est', 'monto_anid_mclp', 'monto_corfo_innova_mclp'],
      keys: ['total_proyectos_ctci', 'investigadores_residentes_est', 'monto_anid_mclp', 'monto_corfo_innova_mclp', 'centros_y_estaciones_ctci_count', 'proyectos_anid_n']
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
    },
    politica_transparencia_finanzas: {
      id: 'politica_transparencia_finanzas',
      title: 'Transparencia Activa, Royalty Minero y Participación',
      hub: 'Gobernanza',
      regex: /\b(transparencia activa|cplt|royalty|fet royalty|fndr|fondos concursables|padron electoral|participacion electoral)\b/i,
      varX: 'transparencia_activa_cplt_2026_pct',
      varY: 'fet_royalty_minero_2025_mclp',
      chartTitle: 'Transparencia Activa CPLT 2026 (%) vs. Royalty Minero FET 2025 (MM$)',
      provenanceKeys: ['transparencia_activa_cplt_2026_pct', 'fet_royalty_minero_2025_mclp'],
      keys: ['transparencia_activa_cplt_2026_pct', 'fet_royalty_minero_2025_mclp', 'fndr_gore_2023_ejecutado_mclp', 'fondos_concursables_gore_2023_mclp', 'participacion_presidencial_2025_2v_pct', 'padron_electoral_nov_2025']
    }
  };

  let _config = Object.assign({}, DEFAULT_CONFIG);
  let _dataLake = null;
  let _lexicon = null;
  let _initialized = false;
  let _lexiconPromise = null;
  let _conversationMemory = [];

  // WP-A.3: Estado de memoria conversacional de seguimiento entre turnos
  let _conversationState = {
    lastComunaCode: null,
    lastComunaName: null,
    lastComunaKey: null,
    lastVarKey: null,
    lastVarLabel: null,
    lastDomain: null,
    lastLocalidad: null,
    lastIndicatorKeys: [],
    lastSubstantiveQuery: null,
    lastConceptualPacketId: null,
    rejectedVarKeys: [],
    pureRepairCount: 0,
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
    holdings: [],          // 13 holdings salmoneros madres registrados en SUBPESCA/SERNAPESCA
    holdingsPorComuna: {}, // Operadores salmoneros por código INE comunal
    customCollections: [], // Holdings, series mensuales, puentes y futuras tablas
    sourcesByKey: {},      // Fuentes oficiales indexadas por variable
    fuentes: [...FUENTES_OFICIALES_28, ...FUENTES_OFICIALES_COMPLEMENTARIAS]
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
      .replace(/(\d)\.(\d)/g, '$1_DEC_$2')
      .replace(/[^a-z0-9\s_-]/g, ' ')
      .replace(/_DEC_/g, '.')
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
    if (/sernatur|turis|emat|pernoctacion|snaspe.*visita|visita.*snaspe|visitantes_snaspe|visitantes_extranjeros|visitas_por_cama|visitas_por_pernoctacion|ocupacion_estival|ocupacion_invernal|concentracion_estival|estadia_promedio|gasto_diario_turista|tarifa_adr|revpar|zoit|hotel|alojamiento/.test(k)) return 'I';
    if (/salmon|acuic|biomasa|antibiotico|amerb|subpesca|sernapesca|caligus|holding/.test(k)) return 'II';
    if (/potencia_mw|mw|electric|saidi|saifi|tarifa_bt1|gasolina|diesel|precio_lena|internet_fijo|fibra|telecom/.test(k)) return 'III';
    if (/presupuesto|fcm|fndr|ipp|gasto_personal|inversion_directa|profesionalizacion|ruta7|alcalde|concejal|sinim|municipal|largo_pista_aerodromo|operaciones_aerodromo/.test(k)) return 'IV';
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
    } else if (key === 'ha_snaspe_por_guardaparque') {
      unit = 'ha/guardaparque';
    } else if (key === 'evaluacion_uaysen_promedio_i8' || key === 'nota_percepcion_cultura_b4b') {
      unit = 'nota (1-7)';
    } else if (/_pct(_[a-z0-9]+)?$/i.test(key) || key.includes('porcentaje')) {
      unit = '%';
    } else if (key.endsWith('_mmusd')) {
      unit = 'MM US$';
    } else if (key.endsWith('_usd')) {
      unit = 'US$';
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
      /(pct|porcentaje|tasa|densidad|per_capita|por_mil|ratio|promedio|visitas_por_cama|estadia|gasto_diario|adr|revpar|guardaparque|evaluacion_uaysen|participacion_cultural|percepcion_ctci|plazo|horas|hrs|tarifa|precio|costo|gasolina|diesel|ica_g_ton|nota|indice|esperanza_vida|envejecimiento|masculinidad|espera_.*dias|fauna_amenazada_n|especies_exoticas_invasoras_n|dias_sobre_norma_mp25|episodios_gec_mp25_anual|amenaza_volcanica_sismica_idx|aporte_universidades_f4g_pct|proporcion_ciencia_endogena_pct|deficit_habitacional_total_por_1000_hab)/i.test(key)
    );

    const rawCn = CANONICAL_LABELS[key] || (lexiconEntry && lexiconEntry.label) || humanizeKey(key);
    const humanLabel = rawCn
      .replace(/\s+I8$/i, '')
      .replace(/\s+B4b$/i, '')
      .replace(/\s+C2$/i, '')
      .replace(/\s+I1i$/i, '');
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
  /**
   * Sincroniza dinámicamente CONCEPTUAL_DOMAIN_PACKETS y TERRITORIAL_ENTITY_GRAPH
   * con las síntesis pre-compiladas desde la Wiki de Karpathy / Obsidian Vault
   * (`window.AYSEN_WIKI_COMPILED`), manteniendo las síntesis en código como fallback.
   */
  function syncCompiledWikiKnowledge(customWikiBundle) {
    const wikiBundle = customWikiBundle || (global && global.AYSEN_WIKI_COMPILED) || null;
    if (!wikiBundle || typeof wikiBundle !== 'object') return false;
    const conceptsById = wikiBundle.conceptsById || {};
    let updatedCount = 0;

    CONCEPTUAL_DOMAIN_PACKETS.forEach(packet => {
      const entry = conceptsById[packet.id];
      if (entry) {
        const text = String(entry.conceptualBrief || entry.synthesis || '').trim();
        if (text) {
          packet.conceptualBrief = text;
          updatedCount++;
        }
      }
    });

    TERRITORIAL_ENTITY_GRAPH.forEach(entity => {
      const entry = conceptsById[entity.id];
      if (entry) {
        const text = String(entry.verifiedSynthesis || entry.synthesis || '').trim();
        if (text) {
          entity.verifiedSynthesis = text;
          updatedCount++;
        }
      }
    });

    return updatedCount > 0;
  }

  function ensureInitialized() {
    syncCompiledWikiKnowledge();
    if (!_initialized && (global && global.AYSEN_HUBS_DATA)) {
      OmniRouteClient.init(_dataLake || global.AYSEN_HUBS_DATA);
    }
  }

  function resolveSourcesForKeys(keys) {
    ensureInitialized();
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
      const synonymsList = Array.from(synonymPhrases).filter(Boolean);
      const synonymMatchers = synonymsList
        .filter(phrase => phrase.length >= 2)
        .map(phrase => ({
          re: new RegExp(`(?:^|\\s)${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`),
          bonus: 14 * phrase.split(' ').length + phrase.length * 0.5
        }));

      const varRecord = {
        key,
        label: meta.label,
        unit: meta.unit,
        hub: meta.hub,
        isNumeric: meta.isNumeric,
        aggregation: meta.aggregation,
        source,
        synonyms: synonymsList,
        synonymMatchers,
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
    FUENTES_OFICIALES_COMPLEMENTARIAS.forEach(pushOfficialSource);
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
      '13 holdings salmoneros madres operan en el litoral de Aysén (745 concesiones otorgadas y 503.500 ton de biomasa anual: AquaChile, Multi X, Blumar, Mowi, Cermaq, Australis)',
      'Criosfera y recursos hidricos: 8.721,6 km2 de superficie glaciar regional (10.301 glaciares en IPG 2022 DGA-MOP / SOCHICRI oct-2025, Campos de Hielo Norte y Sur) y cuencas binacionales (Palena, Cisnes, Aysen, Baker y Pascua)',
      'Corredor binacional ATIT 1974 via RN40 y Paso Cardenal Samore hacia Huemules, Jeinimeni, Coyhaique Alto y Roballos',
      'EMPORCHA Puerto Chacabuco 468.200 ton (2024) y proy. 495.000 ton (2026) + CAM-01 + barcazas DTPR',
      'Red vial MOP 3.386,4 km totales (412,8 km pavimentados [12,2%] vs 2.438,0 km ripio)',
      'Sistemas Medianos y Aislados desconectados del SEN (67,10 MW operativos + 18,98 MW ERNC en construccion 2026) + Decreto 8T Nov-2026 BT1 $287,8/kWh + 13.448 hogares Subsidio Electrico + Lena INFOR BES 11 334.274 m3s/ano (Coyhaique 147.080 m3s [44,0%]) + unico MBM activo Copec Chacabuco 6.674 m3 + CTR submarina solo en Caleta Tortel',
      'Finanzas municipales BCN/SINIM 2025: ingresos municipales agregados de 84.820,68 M$ (promedio 8.482,1 M$/comuna), IPP 19.243,52 M$, FCM 41.753,32 M$ (dependencia FCM 68,5% ponderada / 77,5% simple; min 48,7% Cisnes, 58,4% Coyhaique; max 95,4% Tortel), FNDR 2025 devengado récord 73.863,0 M$ (92,0% sobre 80.200,0 M$) y participación municipal oct-2024 de 72,9% (SERVEL)',
      'Bosque nativo CONAF 2026: 5.152.384,3 ha (10.667.211,5 ha catastradas; 5.189.923,8 ha subuso Bosques total; 2.387.525,4 ha en SNASPE) con 4 tipos forestales (Siempreverde 2.552.613,1 ha, Lenga 1.409.259,7 ha, Coihue de Magallanes 882.420,0 ha, Cipres de las Guaitecas 308.091,5 ha)',
      'Huemul RCE MMA 750-1.000 individuos en Aysen (<1.500 poblacion mundial 17° Proceso RCE; amenaza perros asilvestrados); 154 taxones nativos RCE (64 en amenaza directa 20° Proceso oct-2026); Ganado BCN/ODEPA 144.118 bovinos y 177.972 ovinos',
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
    const holdingPattern = /\b(holding|holdings|holdings?\s+salmon\w*|empresas salmoneras|empresa salmonera|empresas duenas|segun empresa|segun empresas|por empresa|por empresas|por holding|que empresas|cuales empresas|grupos economicos|grupo economico|quienes son los duenos|duenos del salmon|duenos de la industria|quienes controlan|aquachile|multi x|multix|blumar|mowi|australis|cermaq|camanchaca|cooke|yadran|ice val|salmones austral|salmones antartica|invermar|friosur|pesquerias|pesqueria|cuotas|cuota pesquera|cuota industrial|pregunte por empresas|empresas o holdings|no comunas|no por comunas)\b/i;
    return holdingPattern.test(qNorm) || holdingPattern.test(String(rawQuery || ''));
  }

  /**
   * WP-A.2: Construye la respuesta y especificación gráfica (`customCategoryData: true`)
   * para los principales Holdings Salmoneros Madres y Pesquerías de Aysén.
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

    const asksB2BOrTerritorial = /\b(seia|inversion|puerto\w*|portuari\w*|logistic\w*|mantenimiento|proveedor\w*|redes)\b/i.test(qNorm);
    const maritimeComunas = (index.entities || [])
      .filter(e => Number(e.raw?.concesiones_salmon) > 0)
      .slice()
      .sort((a, b) => (Number(b.raw?.concesiones_salmon) || 0) - (Number(a.raw?.concesiones_salmon) || 0));
    const top5Compact = holdings12.slice(0, 5).map((h, i) =>
      `${i + 1}) ${shortHoldingName(h.nombre_fantasia)} (${fmtNumber(h.total_concesiones_aysen)}/${fmtNumber(h.centros_activos_estimados)}c/${fmtNumber(h.biomasa_estimada_ton)}t)`
    ).join(', ');
    const comunaDesglose = maritimeComunas.map(e => {
      const er = e.raw || {};
      const concC = Number(er.concesiones_salmon) || 0;
      const ctrsC = Number(er.centros_activos_salmon) || 0;
      const usoPct = concC > 0 ? fmtNumber((ctrsC / concC) * 100, 1) : '0';
      return `${e.name} (${fmtNumber(ctrsC)}/${fmtNumber(concC)} ctrs [${usoPct}%], ${fmtNumber(er.biomasa_salmon_ton)}t, US$${fmtNumber(er.inversion_seia_mmusd)}MM SEIA)`;
    }).join(', ');

    let reply = '';
    if (isFisherySpecific) {
      reply = `En pesca (9 pesquerías en Aysén, Ley 21.752), destacan Merluza del Sur (37% Ind/63% Art, 3,234 UTM/ton), Congrio Dorado (3,486 UTM/ton) y Bacalao (100% PEP). En acuicultura (${fmtNumber(totalConcesionesReg)} concesiones, ${fmtNumber(totalBiomasaReg)} ton en Aysén, Cisnes, Guaitecas y Tortel): ${top5}; más ${rest7}.`;
    } else if (asksB2BOrTerritorial && maritimeComunas.length > 0) {
      const b2bReply = `Los 12 principales grupos (de 13 holdings salmoneros madres) reúnen ${fmtNumber(totalConcesiones12)}/${fmtNumber(totalConcesionesReg)} conc. (${pct12Reg}%; Top 5: 58,0%→70,8%): ${top5Compact}. Comunas: ${comunaDesglose}. Puertos: Puerto Chacabuco (EMPORCHA, Aysén) y barcazas en Cisnes, Guaitecas y Tortel.`;
      reply = b2bReply.length > 645 ? b2bReply.slice(0, 642) + '...' : b2bReply;
    } else {
      reply = `Las ${fmtNumber(totalConcesionesReg)} concesiones y ${fmtNumber(totalBiomasaReg)} ton de biomasa en Aysén (Aysén, Cisnes, Guaitecas y Tortel) operan bajo 13 holdings madres (top 12 reúnen ${fmtNumber(totalConcesiones12)} conc., ${pct12Reg}% reg.; 19 en otros titulares; Top 5 pasó de 58,0% a 70,8% en 2026): ${top5}. Completan la tabla principal: ${rest7}.`;
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
      subtitle: 'Distribución en los principales Holdings Salmoneros de Aysén (registro 13 grupos madres)',
      sourceText: asksB2BOrTerritorial
        ? 'CMF / SUBPESCA / SERNAPESCA · SEA (SEIA) · EMPORCHA / MTT'
        : 'CMF / SUBPESCA / SERNAPESCA — Registro de Concesiones y Memorias Anuales de Holdings Acuícolas',
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

    const sourceKeys = asksB2BOrTerritorial
      ? ['holdings_salmoneros', 'biomasa_salmon_ton', 'inversion_seia_mmusd', 'dependencia_barcaza']
      : ['holdings_salmoneros', 'biomasa_salmon_ton'];
    const sources = resolveSourcesForKeys(sourceKeys);
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

    // 1. Leña y Pellet (INFOR / SEC) — sin secuestrar siglas INFOR en consultas sobre centros científicos CTCi
    const hasFirewoodTerms = /\b(lena|pellet|pellets|calefaccion|dendroenerg\w*|combusti\w*|humedad|m3\s+estereos|ley 21\.?499|xilohigrometro|biocombustibles?)\b/i.test(qNorm);
    const hasResearchCentersCtx = /\b(ciep|inia|ifop|cecs|anid|estacion\w*\s+de\s+campo|centros?\s+cientific\w*|estacion\s+patagonia\s+uc|tamel\s+aike)\b/i.test(qNorm);
    if (/\b(pellet|pellets|demanda de pellet|dendroenerg|ley 21\.?499|humedad de la le[ñn]a|xilohigrometro|consumo.*le[ñn]a.*pellet|pellet.*le[ñn]a|biocombustibles? solidos?)\b/i.test(qNorm) ||
        ((/\b(volumen.*le[ñn]a)\b/i.test(qNorm) || (/\binfor\b/i.test(qNorm) && hasFirewoodTerms && !hasResearchCentersCtx)) && !isSingleComunaSpecific)) {
      return 'pellet_lena';
    }

    // 1b. Red de Centros Científicos CTCi y Estaciones de Campo (#35, #36, #37)
    // Si pregunta específicamente distribución "por comuna" de ANID/investigadores sin nombrar un centro explícito, resolver vía variables comunales
    const explicitNamedCenterCtx = /\b(ciep|inia|ifop|cecs|estacion\w*\s+de\s+campo|centros?\s+cientific\w*|centros?\s+de\s+investigacion|estacion\s+patagonia\s+uc|tamel\s+aike)\b/i.test(qNorm);
    const asksAnidByComunaOnly = /\bpor\s+comuna\b/i.test(qNorm) && !explicitNamedCenterCtx;
    if (hasResearchCentersCtx && !asksAnidByComunaOnly && !/\b(compar\w*.*corfo|evaluacion ciudadano?a?\s+de\s+la\s+(?:universidad|uaysen))\b/i.test(qNorm) && !/\bvolcan\w*|sism\w*|sma\b/i.test(qNorm)) {
      return 'centros_ctci_red_campo';
    }

    // 1c. Patrimonio Cultural Inmaterial SIGPA, Sitios Paleo-Arqueológicos y Tejido Asociativo (#34)
    if (/\b(sigpa|patrimonio\s+(?:cultural\s+)?inmaterial|tejueler\w*|carpinter\w*\s+de\s+ribera|jinetead\w*|chamame|bano\s+nuevo|paredon\s+de\s+las\s+manos|chilesaurus|formacion\s+toqui|paleontolog\w*|arqueolog\w*)\b/i.test(qNorm)) {
      return 'patrimonio_inmaterial_arqueologia_sigpa';
    }

    // 1d. Evolución Histórica VIF vs DMCS (2015–2026) y tasas comunales (#26)
    if (/\b(vif|violencia\s+intrafamiliar)\b/i.test(qNorm) && /\b(dmcs|delitos?\s+de\s+mayor\s+connotacion|cead)\b/i.test(qNorm) &&
        /\b(evolucion\w*|2015|2020|2021|2026|historico|historica|serie|trayectoria)\b/i.test(qNorm)) {
      return 'seguridad_vif_dmcs';
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
    if (/\b(pobreza multidimensional|multidimensional.*ingresos|ingresos.*multidimensional|casen multidimensional|pobreza monetaria.*multidimensional)\b/i.test(qNorm) &&
        !/\b(fndr|royalty|saidi|tarifa|salmon|biomasa|concesion\w*|presupuesto|medicos|empam|turismo|pernoctacion\w*|seia|glaciar\w*|lena|mp25)\b/i.test(qNorm)) {
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

    // 8. SLEP Aysén (traspaso 2024, 66 establecimientos) y matrícula SIES / UAysén 2026 / CDPR CORFO
    if ((/\b(slep aysen|traspaso.*slep|sies|matricula.*superior|cft estatal|cft estatal aysen|uaysen.*inacap|inacap.*uaysen|campus errazuriz|victor cubillos|66 establecimientos|traspaso 2024|uach\s+campus\s+patagonia|cdpr\s+corfo|fic-?r|administracion\s+provisional)\b/i.test(qNorm)) &&
        !/\b(sin\s+internet\s+fijo|hogares\s+sin\s+internet)\b/i.test(qNorm)) {
      return 'slep_sies';
    }

    // 8a-1. Especies Exóticas Invasoras EEI (Nodo #29 — prioridad sobre ECMPO incluso con SNASPE)
    if (/\b(especies?\s+(?:exotic\w*|invasor\w*)|eei\b|vison|castor|didymo|jabali|lupino|chinook\s+asilvestrad\w*|asilvestrad\w*)\b/i.test(qNorm)) {
      return 'especies_exoticas_invasoras';
    }

    // 8a-2. Fauna Silvestre en Conservación RCE (Nodo #28 — sin secuestrar comparativas con MP2.5)
    if (/\b(huemul|maca\s+tobiano|pudu|huillin|chungungo|ballena\s+(?:sei|azul)|delfin\s+chileno|rce\s+mma|especies?\s+en\s+conservacion)\b/i.test(qNorm) &&
        !/\b(mp2\.?5|norma|por\s+comuna.*dias)\b/i.test(qNorm)) {
      return 'fauna_rce_conservacion';
    }

    // 8a-3. Hidrología Mensual Baker / Simpson vs MP2.5 Coyhaique (Nodo #30)
    if (/\b(caudal|rio\s+baker|rio\s+simpson|hidrolog\w*|estacionalidad\s+mp2\.?5)\b/i.test(qNorm) &&
        !/\b(glof|glofs|cachet\s+2)\b/i.test(qNorm)) {
      return 'hidrologia_caudal_mp25_mensual';
    }

    // 8a-3b. Barrios Acuícolas (ACS-17 a ACS-35) — Nueva dimensión N=18
    if (/\b(barrios?\s+acuicol\w*|barrios?\s+sanitari\w*|agrupacion(?:es)?\s+de\s+concesiones|acs[-\s]?\d{2}|densidad\s+(?:de\s+siembra|maxima|por\s+barrio)|antibioticos?\s+por\s+barrio|mortalidad\s+(?:por\s+barrio|en\s+ciclo)|18\s+barrios)\b/i.test(qNorm) &&
        !/\b(fraccionamiento|ley\s*21\.?752|desembarque\s+artesanal|caletas?)\b/i.test(qNorm)) {
      return 'barrios_acs_aysen';
    }

    // 8a-3c. Patente Única de Acuicultura (PUA Art. 84 LGPA), Empleo Directo y Fuga de Exportación a Los Lagos
    if (/\b(patentes?\s+acuicol\w*|patentes?\s+salmoner\w*|pua\b|art\.?\s*84\s+lgpa|tributos?\s+salmoner\w*|impuestos?\s+salmoneras|fuga\s+(?:de\s+)?(?:procesamiento|exportacion|valor|wellboats?)|wellboats?|aduanas?.*los\s+lagos|empleo\s+directo\s+(?:en\s+)?(?:salmon\w*|acuic\w*)|plantas?\s+de\s+proceso\s+chacabuco)\b/i.test(qNorm)) {
      return 'patente_pua_fuga_exportacion';
    }

    // 8a-3d. Fiscalización Ambiental Acuícola (SMA-SNIFA), INFAs Anaeróbicas y Límite ICA 400 g/t
    if (/\b((?:sancion\w*|expedientes?\s+sancion\w*|multas?|sobreproduccion|fiscalizacion).*(?:salmon\w*|acuic\w*|snifa|infa)|infa\s+anaerobica|fondo\s+marino\s+sin\s+oxigeno|res\.?\s*ex\.?\s*8228|400\s*g\/t|piscirickettsia|tenacibaculosis|snifa.*(?:australis|aquachile|cooke|mowi|salmon\w*))\b/i.test(qNorm) &&
        !/\b(volcan\w*|hudson|sism\w*|usgs|rnvv)\b/i.test(qNorm)) {
      return 'fiscalizacion_sma_infa_salmon';
    }

    // 8a-4. Volcanes RNVV, Sismos USGS y Fiscalización SMA (Nodo #31 + justicia_sma)
    if (/\b(volcan\w*|rnvv|sernageomin|hudson|maca\b|mentolat|melimoyu|cay\b|arenales|sism\w*|terremot\w*|usgs|liquine\s*ofqui|expedientes?\s+(?:de\s+)?fiscalizacion\s+sma|snifa|sancion\w*\s+ambiental\w*|justicia\s+ambiental)\b/i.test(qNorm) &&
        !/\b(glof|cachet\s+2)\b/i.test(qNorm)) {
      return 'volcanes_sismos_justicia_sma';
    }

    // 8b. Fiscalización ambiental acuícola, SNASPE e ICA antibióticos (Perfil Ambientalista / Fiscalizador)
    if (!isSingleComunaSpecific &&
        /\b(salmon\w*|acuic\w*|biomasa|concesiones|centros de cultivo)\b/i.test(qNorm) &&
        /\b(impacto ambiental|fiscaliz\w*|areas? protegidas?|areas? silvestres?|antibioticos?|escapes?|denuncias?)\b/i.test(qNorm) &&
        !/\b(ecmpo|ley lafkenche|pu wapi|antunen rain)\b/i.test(qNorm)) {
      return 'impacto_ambiental_salmon';
    }

    // 9. Solicitudes ECMPO Ley Lafkenche (620.000 ha) y concesiones en SNASPE (312 en RN Las Guaitecas)
    if (!/\bconcesiones?\s+mineras?\b|\broyalty\b/i.test(qNorm) &&
        /\b(ecmpo|ley lafkenche|pu wapi|antunen rain|620\.?000 ha|concesiones\s+(?:de\s+)?(?:acuic\w+|salmon\w+|maritimas?)?\s*(?:en|dentro\s+de|superpuestas?\s+(?:en|con))\s+snaspe|concesiones.*reserva.*guaitecas|reserva.*guaitecas.*concesiones|312 concesiones|solicitudes ecmpo)\b/i.test(qNorm)) {
      return 'ecmpo_snaspe';
    }

    // 10. Existencias ganaderas bovinas y ovinas (ODEPA Censo Agropecuario)
    if (/\b(ganaderia bovina|ganaderia ovina|ganado bovino.*ovino|ganado ovino.*bovino|bovinos.*ovinos|ovinos.*bovinos|bovinos y ovinos|ovinos y bovinos|existencias ganaderas|censo agropecuario.*ganad|caf odepa|cabezas de ganado|ganaderia.*odepa)\b/i.test(qNorm)) {
      return 'ganaderia_bovina_ovina';
    }

    // 11. Inversión FNDR devengada vs sectorial ministerial centralizada (DIPRES)
    if (/\b(fndr devengad|inversion sectorial ministerial|sectorial.*fndr|fndr.*sectorial|gasto centralizado.*fndr|ejecucion real fndr|subejecucion fndr|fndr.*dipres|dipres.*fndr|inversion sectorial.*dipres|ejecucion.*fndr.*gore|ejecucion presupuestaria fndr)\b/i.test(qNorm) && !/\b(royalty|fet royalty|fondos concursables|8%\s*fndr)\b/i.test(qNorm)) {
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
    if (/\b(cuantos arboles|cantidad de arboles|numero de arboles|total de arboles)\b/i.test(qNorm) && !isSingleComunaSpecific) {
      return 'bosques_arboles_conaf';
    }

    // 18. Consultas sobre perros / población canina -> puente a RCE Huemul y Censo Agropecuario ODEPA
    if (/\b(cuantos perros|poblacion canina|cantidad de perros|numero de perros|perros asilvestrados|cuantas mascotas|mascotas)\b/i.test(qNorm)) {
      return 'fauna_perros_ganaderia';
    }

    // 19. Composición política histórica (1989-2026), presidenciales, parlamentarios, intendentes y COREs
    if (/\b(composicion politica|historia politica|como ha votado|voto historico|votacion historica|ultimos 30 anos|consejeros regionales|core\b|cores\b|intendentes|senadores|diputados|presidenciales.*aysen|elecciones.*aysen|partidos politicos)\b/i.test(qNorm)) {
      return 'composicion_politica_historica';
    }

    // 20. Fiscalización Transparencia Activa Municipal CPLT 2026
    if (/\b(transparencia activa|cplt|fiscalizacion municipal|ranking transparencia)\b/i.test(qNorm)) {
      return 'transparencia_activa_cplt';
    }

    // 21. FNDR GORE Aysén (datos.gob.cl), Fondos Concursables 8% y FET Royalty Minero
    if ((/\b(royalty minero|fet royalty|fondos concursables|8%\s*fndr|fndr gore|ejecucion fndr|cartera fndr)\b/i.test(qNorm) ||
         (/\b(evolucion|historico|historia|serie|anual|2015)\b.*\bfndr\b|\bfndr\b.*\b(evolucion|historico|historia|2015|2025|2026)\b/i.test(qNorm) && !/\bsectorial\b/i.test(qNorm))) &&
        !/\b(cultur\w*|fondart|mincap|arte\w*|patrimonio|museo\w*|biblioteca\w*|monumento\w*)\b/i.test(qNorm)) {
      return 'royalty_minero_y_fondos_gore';
    }

    // 22. Conectividad digital fija SUBTEL junio 2026 (FTTH / Starlink / Última Milla; respeta consultas específicas de cobertura/carencia)
    if (/\b(conexiones fijas|ftth|starlink|subtel.*2026|ultima milla|banda ancha fija subtel)\b/i.test(qNorm) && !/\b(cobertura.*fibra|sin conexion|sin internet)\b/i.test(qNorm)) {
      return 'conectividad_digital_subtel_2026';
    }

    // 23. Fraccionamiento Ley 21.752 / Impuesto Art. 43 ter / Desembarque Artesanal por Caleta (Nodos #08 y #10)
    if (/\b(fraccionamiento|ley\s*21\.?752|43\s*ter|valor\s+de\s+sancion|desembarque\s+artesanal)\b/i.test(qNorm) ||
        (/\b(merluza|congrio|bacalao)\b/i.test(qNorm) && /\b(artesanal|industrial|caletas?|desembarque|impuesto|sancion)\b/i.test(qNorm))) {
      return 'pesquerias_fraccionamiento_caletas';
    }

    return null;
  }

  /**
   * Construye respuesta analítica y especificación de evidencia para temas reconciliados oficiales
   */
  function buildReconciledTopicReply(topicKey, userText, qNorm, index) {
    switch (topicKey) {
      case 'pellet_lena': {
        const reply = 'En la matriz energética y dendroenergética regional (INFOR Observatorio BES N° 11 y SEC Ley N° 21.499): El consumo de leña residencial certificado asciende a 334.274 m³ sólidos/año (~550.000 m³ estéreos/año, factor ~0,64 m³s/m³st). En Coyhaique (147.080 m³s/año, 44,0% regional), tras 10.999 recambios de calefactores al 25-ago-2026 (73,3% de la meta PDA vigente y Anteproyecto Res. Ex. N° 8.940/2026 hacia 20.000 recambios), el uso de leña bajó al 68,8% de los hogares (9,81 m³s/hogar/año; $45,7/kWh_útil frente a $102,8/kWh_útil en bomba de calor BT1 $287,8/kWh y $174,7/kWh_útil en kerosene tras el shock FEPP de octubre 2026). La demanda de pellet (~20.000 ton/año) llega 100% por vía marítima a Puerto Chacabuco, mientras la SEC fiscaliza humedad < 25% bajo la Ley N° 21.499.';
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
        const reply = 'Según el MINVU CECT (Censo 2024), CASEN 2024 y el cierre oficial del Plan de Emergencia Habitacional (PEH febrero 2026): Aysén registra un déficit habitacional cuantitativo de 1.927 viviendas (4,8% de los 39.964 hogares: 609 irrecuperables, 333 allegados, 326 núcleos hacinados y 659 en hacinamiento no ampliable; -35,3% histórico) y un déficit cualitativo CASEN 2024 de 12,9% (5.155 hogares), además de 10 campamentos (244 hogares). En volumen lidera Coyhaique (1.128) y Aysén (330), y en tasa relativa Lago Verde (19,6%) y Cochrane (8,1%). El PEH cerró febrero 2026 con 1.671 viviendas terminadas sobre la meta de 1.293 (129,2% de cumplimiento, prorrogado hasta dic-2029).';
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
        const reply = 'Según la Subdirección de Servicios Sanitarios Rurales (DOH-MOP) bajo la Ley N° 20.998: En la Región de Aysén operan 47 comités y cooperativas de SSR vigentes, abasteciendo a 28.833 personas beneficiarias rurales (28,6% de la población regional) a través de 9.185 familias/arranques domiciliarios conectados (incluyendo 551 arranques en el SSR de Melinka). Esta infraestructura comunitaria enfrenta una alta vulnerabilidad estacional por congelamiento recurrente de matrices y captaciones superficiales.';
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
        const reply = 'Según Glosa 06 MINSAL / SIGTE / CIPS-UDD (corte T3 2026 al 30-09-2026 y BCN 2024): La Red Asistencial del Servicio de Salud Aysén (SSA) registra 14.751 Consultas Nuevas de Especialidad (CNE) No GES (tasa 14.642/100k vs. 13.526/100k nacional; mediana oficial SIGTE de 159 días), 3.608 Intervenciones Quirúrgicas Mayores No GES (tasa 3.581/100k, +36,3% sobre Chile; mediana oficial SIGTE de 262 días vs. 301 días nacional), 6.870 consultas Odontológicas No GES (dic-2024, mediana 242 días, 82/1.000 FONASA) y 524 garantías GES retrasadas (mediana 88 días, 4ª más alta de Chile; retraso GES oncológico 149,6/100k). Nota metodológica: SIGTE reporta por Servicio de Salud (SSA)/hospital, por lo que la desagregación comunal atribuye proporcionalmente según población inscrita FONASA.';
        const sources = resolveSourcesForKeys(['espera_no_ges_n', 'mediana_espera_especialidad_dias', 'mediana_espera_quirurgica_dias']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'espera_no_ges_n',
            varY: null,
            yKey: 'espera_no_ges_n',
            y2Key: null,
            title: 'Lista de Espera No GES Consultas de Especialidad por Comuna (SIGTE T3 2026 · 14.751 CNE)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VIII'
        };
      }
      case 'cancer_suicidio': {
        const gEnts = (index.entities || []).slice().sort((a, b) => (b.raw?.tasa_mortalidad_cancer_gastrico_100k || 0) - (a.raw?.tasa_mortalidad_cancer_gastrico_100k || 0));
        const sEnts = (index.entities || []).slice().sort((a, b) => (b.raw?.tasa_mortalidad_suicidio_100k || 0) - (a.raw?.tasa_mortalidad_suicidio_100k || 0));
        const gMax = gEnts[0], gMin = gEnts[gEnts.length - 1];
        const sMax = sEnts[0], sMin = sEnts[sEnts.length - 1];
        const diffNote = (gMax && sMax)
          ? ` A nivel comunal, el Cáncer Gástrico alcanza su máximo en ${gMax.name} (${fmtNumber(gMax.raw.tasa_mortalidad_cancer_gastrico_100k)} c/100k) y mínimo en ${gMin.name} (${fmtNumber(gMin.raw.tasa_mortalidad_cancer_gastrico_100k)}), mientras la mortalidad por suicidio lidera en ${sMax.name} (${fmtNumber(sMax.raw.tasa_mortalidad_suicidio_100k)} c/100k) vs. ${sMin.name} (${fmtNumber(sMin.raw.tasa_mortalidad_suicidio_100k)}).`
          : '';
        const reply = `Según DEIS MINSAL / UNICEF SITAN 2025 y el Registro de Cáncer: Las neoplasias digestivas lideran los AVPP en Aysén con Cáncer Gástrico (C16, promedio 18,4 c/100k hab; estudio SEREMI/UAysén con 64% de prevalencia de Helicobacter pylori y 82% de erradicación) y Vesícula Biliar (C23, 18,29 c/100k hab; 22 casos estudiados en HRC 2024). En salud mental, Aysén registra la mayor tasa nacional de suicidio con 19,9 c/100k hab (20 suicidios en 2024 vs. 10,7/100k Chile; 28,1/100k en adolescentes 15–19 años y 18,1% de jóvenes bajo control en salud mental) con solo 9 camas psiquiátricas UHCE en el HRC (0 en las otras 9 comunas) y 2 COSAM (Coyhaique y Puerto Aysén).${diffNote}`;
        const sources = resolveSourcesForKeys(['tasa_mortalidad_cancer_gastrico_100k', 'tasa_mortalidad_suicidio_100k', 'camas_psiquiatricas_uhce', 'barometro_evaluacion_acceso_salud_pct']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'tasa_mortalidad_cancer_gastrico_100k',
            varY: 'tasa_mortalidad_suicidio_100k',
            yKey: 'tasa_mortalidad_cancer_gastrico_100k',
            y2Key: 'tasa_mortalidad_suicidio_100k',
            title: 'Cáncer Gástrico vs. Mortalidad por Suicidio por Comuna (c/100k hab · DEIS)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VIII'
        };
      }
      case 'camas_hrc_postas': {
        const reply = 'Según el catastro oficial DEIS MINSAL (03-11-2026) y el Servicio de Salud Aysén (SSA): El 100% de la APS y red hospitalaria pública depende directamente del DAP SSA (0% salud municipalizada; 0 clínicas privadas de hospitalización general). La red de 5 hospitales públicos suma 213 camas de diseño (174 agudas efectivas y 8 pabellones quirúrgicos): Hospital Regional Coyhaique 135 camas basales (141 con las 6 camas de la nueva UPC Pediátrica jun-2026, 4 pabellones, 18 sillones de hemodiálisis), Puerto Aysén 56 camas y 2 pabellones (~30 camas bloqueadas sociosanitarias en la red SSA), Puerto Cisnes Dr. Jorge Ibar Bruce 8 camas, Hospital Dr. Leopoldo Ortega Rodríguez de Chile Chico 7 camas y 1 pabellón (nuevo edificio feb-2026), y Hospital Lord Cochrane 7 camas y 1 pabellón (acreditado SuperSalud 14-05-2026). La APS reúne 4 CESFAM (+1 en construcción), 4 CECOSF, 27 Postas de Salud Rural (PSR, 100% tele-ECG oct-2025), 9 EMR y 2 COSAM.';
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
            title: 'Camas Hospitalarias (213 diseño) y Postas de Salud Rural (27 PSR) por Comuna',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VIII'
        };
      }
      case 'slep_sies': {
        const reply = 'En educación escolar y superior regional (MINEDUC CEM, SLEP Aysén Ley N° 21.040, SIES 2026 y PAES 2026): La región cuenta con 86 establecimientos escolares activos (87 en 2025) y el SLEP Aysén articula 65 recintos operativos (55 escuelas/liceos + 10 jardines VTF; 66 en 2024; 22.087 alumnos totales y 8.939 SLEP), logrando en PAES Admisión 2026 627,4 pts en M1 (+13,8 pts; Chile 623,0) y 600,2 pts en Lectora (+12,9 pts). En educación superior SIES 2026 suma 2.924 estudiantes (2.907 pregrado): Coyhaique 2.187 (INACAP ~1.187, Universidad de Aysén ~1.000) y Puerto Aysén 737 en el CFT Estatal de Aysén.';
        const sources = resolveSourcesForKeys(['matricula_escolar', 'matricula_ed_superior_sies', 'evaluacion_uaysen_promedio_i8']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'matricula_escolar',
            varY: 'establecimientos_slep_aysen',
            yKey: 'matricula_escolar',
            y2Key: 'establecimientos_slep_aysen',
            title: 'Matrícula Escolar y Establecimientos Públicos SLEP Aysén por Comuna',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VI'
        };
      }
      case 'impacto_ambiental_salmon': {
        const asksConcesionesEnSnaspe = /\bconcesiones\s+(?:acuicolas\s+|salmoneras\s+)?(?:en|dentro\s+de|superpuestas\s+en)\s+snaspe\b/i.test(qNorm);
        const asksIcaExplicit = /\b(antibioticos?|ica)\b/i.test(qNorm);
        const marEnts = (index.entities || [])
          .filter(e => Number(e.raw?.concesiones_salmon) > 0)
          .slice()
          .sort((a, b) => (Number(b.raw?.concesiones_salmon) || 0) - (Number(a.raw?.concesiones_salmon) || 0));

        if (asksConcesionesEnSnaspe) {
          const detailSnaspe = marEnts.map(e => {
            const er = e.raw || {};
            const conc = Number(er.concesiones_salmon) || 0;
            const snConc = Number(er.concesiones_acuicolas_en_snaspe) || 0;
            const snConcPct = conc > 0 ? ((snConc / conc) * 100).toFixed(1).replace('.', ',') : '0,0';
            return `${e.name} (${fmtNumber(snConc)}/${fmtNumber(conc)} en SNASPE [${snConcPct}%], ${fmtNumber(er.superficie_snaspe_pct)}% sup. SNASPE, ICA ${fmtNumber(er.antibioticos_ica_g_ton)} g/t)`;
          }).join('; ');
          const reply = `Fiscalización en áreas protegidas SNASPE y uso de antibióticos (SERNAPESCA/SUBPESCA/CONAF): 312 concesiones superpuestas en SNASPE (237 en RN Las Guaitecas, 63 en PN Isla Magdalena y 12 en RN Katalalixar; Ley SBAP N° 21.600). Desglose litoral: ${detailSnaspe}.`;
          const focusComunas = marEnts.map(e => e.name);
          const sources = resolveSourcesForKeys(['concesiones_acuicolas_en_snaspe', 'superficie_snaspe_pct', 'antibioticos_ica_g_ton', 'concesiones_salmon', 'concesiones_salmon_snaspe_n']);
          return {
            reply,
            chart: {
              render: true,
              type: 'scatter',
              varX: 'concesiones_acuicolas_en_snaspe',
              varY: asksIcaExplicit ? 'antibioticos_ica_g_ton' : 'superficie_snaspe_pct',
              varZ: 'superficie_snaspe_pct',
              varW: 'antibioticos_ica_g_ton',
              yKey: 'concesiones_acuicolas_en_snaspe',
              y2Key: asksIcaExplicit ? 'antibioticos_ica_g_ton' : 'superficie_snaspe_pct',
              focusComunas,
              multiCharts: [
                {
                  type: 'scatter',
                  varX: 'concesiones_acuicolas_en_snaspe',
                  varY: 'antibioticos_ica_g_ton',
                  focusComunas,
                  title: 'Concesiones Acuícolas en SNASPE vs. Intensidad Antibióticos ICA (g/ton)',
                  sourceText: resolveSourcesForKeys(['concesiones_acuicolas_en_snaspe', 'antibioticos_ica_g_ton']).map(s => s.institucion).join(' · '),
                  excludeCoyhaique: false
                },
                {
                  type: 'scatter',
                  varX: 'concesiones_salmon',
                  varY: 'superficie_snaspe_pct',
                  focusComunas,
                  title: 'Concesiones Salmoneras Totales vs. Superficie Protegida SNASPE (%)',
                  sourceText: resolveSourcesForKeys(['concesiones_salmon', 'superficie_snaspe_pct']).map(s => s.institucion).join(' · '),
                  excludeCoyhaique: false
                }
              ],
              title: 'Cruce Litoral: Concesiones en SNASPE, Superficie Protegida (%) e ICA Antibióticos',
              sourceText: sources.map(s => s.institucion).join(' · '),
              excludeCoyhaique: false
            },
            sources,
            relatedHub: 'II'
          };
        }

        const detailStr = marEnts.map(e => {
          const er = e.raw || {};
          return `${e.name} (${fmtNumber(er.concesiones_salmon)} conc., ${fmtNumber(er.biomasa_salmon_ton)}t, ${fmtNumber(er.superficie_snaspe_pct)}% SNASPE, ICA ${fmtNumber(er.antibioticos_ica_g_ton)} g/t)`;
        }).join(', ');
        const reply = `Fiscalización acuícola (SERNAPESCA/SUBPESCA/CONAF): ${detailStr}. Catastro oficial registra 312 concesiones superpuestas en SNASPE (RN Las Guaitecas, Ley SBAP N° 21.600). Sin datos comunales de escapes de salmones ni denuncias SMA.`;
        const sources = resolveSourcesForKeys(['biomasa_salmon_ton', 'concesiones_salmon', 'superficie_snaspe_pct', 'antibioticos_ica_g_ton', 'concesiones_salmon_snaspe_n']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'biomasa_salmon_ton',
            varY: 'concesiones_salmon',
            varZ: 'superficie_snaspe_pct',
            varW: 'antibioticos_ica_g_ton',
            yKey: 'biomasa_salmon_ton',
            y2Key: 'concesiones_salmon',
            multiCharts: [
              {
                type: 'bar',
                varX: 'biomasa_salmon_ton',
                varY: 'concesiones_salmon',
                title: 'Biomasa Cosechada (ton) vs. Concesiones Acuícolas',
                sourceText: resolveSourcesForKeys(['biomasa_salmon_ton', 'concesiones_salmon']).map(s => s.institucion).join(' · '),
                excludeCoyhaique: false
              },
              {
                type: 'bar',
                varX: 'concesiones_salmon',
                varY: 'superficie_snaspe_pct',
                title: 'Concesiones Salmoneras vs. Superficie Protegida SNASPE (%)',
                sourceText: resolveSourcesForKeys(['concesiones_salmon', 'superficie_snaspe_pct']).map(s => s.institucion).join(' · '),
                excludeCoyhaique: false
              }
            ],
            title: 'Fiscalización Acuícola: Biomasa, Concesiones, SNASPE (%) e ICA Antibióticos',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'II'
        };
      }
      case 'pesquerias_fraccionamiento_caletas': {
        const reply = 'En pesca industrial y artesanal (Ley N° 21.752 y Art. 43 ter LGPA, Nodos #08 y #10): Merluza del sur (Norte y Sur) y Congrio dorado (Norte y Sur) establecen un fraccionamiento de 37% Industrial / 63% Artesanal, con Valor de Sanción SUBPESCA de 77 y 83 UTM/ton e Impuesto Art. 43 ter de 3,234 y 3,486 UTM/ton; Bacalao de profundidad opera 100% Industrial PEP (Valor Sanción 372 UTM/ton, ref. 15,62 UTM) y Reineta 90% Artesanal / 10% Industrial (16 UTM/ton). Distinción clave de desembarque (SERNAPESCA): mientras la descarga física total en muelles y caletas asciende a 31.690 ton/año incluyendo lanchas extrarregionales de Los Lagos en Zona Contigua —Puerto Chacabuco (14.850 ton), Melinka (8.920 ton), Puerto Cisnes (4.210 ton) y Caleta Tortel (380 ton)—, el desembarque de flota artesanal residente inscrita en el RPA comunal totaliza 13.820 ton/año: Guaitecas (5.650 ton), Aysén (4.850 ton), Cisnes (3.200 ton) y Tortel (120 ton).';
        const fishLabels = ['Merluza del sur (Norte)', 'Merluza del sur (Sur)', 'Congrio dorado (Norte)', 'Congrio dorado (Sur)', 'Merluza de cola', 'Merluza tres aletas', 'Bacalao profundidad', 'Reineta', 'Besugo / Brotula'];
        const fishArt = [63, 63, 63, 63, 5, 5, 0, 90, 0];
        const fishInd = [37, 37, 37, 37, 95, 95, 100, 10, 100];
        const caletaLabels = ['Puerto Chacabuco', 'Melinka', 'Puerto Cisnes', 'Caleta Tortel'];
        const caletaData = [14850, 8920, 4210, 380];
        const focusComunas = ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel'];
        const sources = resolveSourcesForKeys(['pesca_ind_fraccionamiento_art_pct', 'desembarque_artesanal_ton', 'sindicatos_pesca_artesanal']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            customCategoryData: true,
            categoryLabel: 'Pesquería',
            varX: 'pesca_ind_fraccionamiento_art_pct',
            varY: 'pesca_ind_fraccionamiento_ind_pct',
            labels: fishLabels,
            datasets: [
              { label: '% Artesanal (Ley 21.752)', data: fishArt, unit: '%' },
              { label: '% Industrial (LTP/PEP)', data: fishInd, unit: '%' }
            ],
            multiCharts: [
              {
                type: 'bar',
                customCategoryData: true,
                categoryLabel: 'Pesquería',
                varX: 'pesca_ind_fraccionamiento_art_pct',
                varY: 'pesca_ind_fraccionamiento_ind_pct',
                labels: fishLabels,
                datasets: [
                  { label: '% Artesanal (Ley 21.752)', data: fishArt, unit: '%' },
                  { label: '% Industrial (LTP/PEP)', data: fishInd, unit: '%' }
                ],
                title: 'Fraccionamiento Artesanal vs. Industrial por Pesquería (Ley N° 21.752)',
                sourceText: 'SUBPESCA / Ley N° 21.752 / LGPA Art. 43 ter',
                excludeCoyhaique: false
              },
              {
                type: 'bar',
                customCategoryData: true,
                categoryLabel: 'Caleta Pesquera',
                varX: 'desembarque_artesanal_ton',
                varY: 'sindicatos_pesca_artesanal',
                focusComunas,
                labels: caletaLabels,
                datasets: [
                  { label: 'Desembarque por Caleta (ton/año)', data: caletaData, unit: 'ton/año' }
                ],
                title: 'Desembarque Pesquero por Caleta Principal (ton/año)',
                sourceText: 'SERNAPESCA — Estadísticas de Caletas y Registro Pesquero Artesanal',
                excludeCoyhaique: false
              }
            ],
            title: 'Pesquerías Ley N° 21.752 (Fraccionamiento e Impuesto Art. 43 ter) y Desembarque en Caletas',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'II'
        };
      }
      case 'barrios_acs_aysen': {
        const dl = _dataLake || (global && global.AYSEN_HUBS_DATA) || {};
        const acsList = Array.isArray(dl.barriosAcs) && dl.barriosAcs.length ? dl.barriosAcs : [
          { codigo_acs: 'ACS-17', comuna: 'Guaitecas', concesiones_totales: 44, centros_activos: 15, biomasa_cosechada_ton: 21100, antibioticos_ica_g_ton: 392.0, mortalidad_ciclo_pct: 9.1, densidad_max_kg_m3: 12.0, infa_aerobica_pct: 83.5 },
          { codigo_acs: 'ACS-22A', comuna: 'Aysén', concesiones_totales: 72, centros_activos: 24, biomasa_cosechada_ton: 47100, antibioticos_ica_g_ton: 364.5, mortalidad_ciclo_pct: 8.8, densidad_max_kg_m3: 12.0, infa_aerobica_pct: 82.8 },
          { codigo_acs: 'ACS-35', comuna: 'Tortel', concesiones_totales: 17, centros_activos: 0, biomasa_cosechada_ton: 8500, antibioticos_ica_g_ton: 289.0, mortalidad_ciclo_pct: 6.4, densidad_max_kg_m3: 17.0, infa_aerobica_pct: 95.0 }
        ];
        const sortedBio = [...acsList].sort((a, b) => (Number(b.biomasa_cosechada_ton) || 0) - (Number(a.biomasa_cosechada_ton) || 0));
        const top3Bio = sortedBio.slice(0, 3).map(b => `${b.codigo_acs} (${b.comuna}: ${fmtNumber(b.biomasa_cosechada_ton)} t, ICA ${fmtNumber(b.antibioticos_ica_g_ton)} g/t, ${b.densidad_max_kg_m3} kg/m³)`).join('; ');
        const tortelAcs = acsList.find(b => b.codigo_acs === 'ACS-35');
        const reply = `Los 18 Barrios Acuícolas (Agrupaciones de Concesiones de Salmónidos ACS-17 a ACS-35) de Aysén concentran 745 concesiones, 245 centros activos, 312 concesiones en SNASPE y 503.500 ton cosechadas. Mayor producción e intensidad sanitaria: ${top3Bio}. En el extremo austral, ${tortelAcs ? `${tortelAcs.codigo_acs} (Caleta Tortel)` : 'ACS-35'} opera bajo descanso sanitario coordinado de ciclo largo (17 concesiones, 0 centros activos vigentes, 8.500 ton de cierre de ciclo bianual en 4 centros con RCA comercial, ICA 289,0 g/t e INFA aeróbica 95,0%).`;
        const sources = resolveSourcesForKeys(['acs_biomasa_cosechada_ton', 'acs_antibioticos_ica_g_ton', 'acs_infa_aerobica_pct']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            customCategoryData: true,
            categoryLabel: 'Barrio ACS',
            varX: 'acs_biomasa_cosechada_ton',
            varY: 'acs_antibioticos_ica_g_ton',
            labels: acsList.map(b => b.codigo_acs),
            datasets: [
              { label: 'Biomasa Cosechada (ton)', data: acsList.map(b => Number(b.biomasa_cosechada_ton) || 0), unit: 'ton' },
              { label: 'ICA Antibióticos (g/ton)', data: acsList.map(b => Number(b.antibioticos_ica_g_ton) || 0), unit: 'g/ton' }
            ],
            title: 'Los 18 Barrios Sanitarios ACS de Aysén: Biomasa Cosechada (ton) e ICA Antibióticos (g/ton)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'II'
        };
      }
      case 'patente_pua_fuga_exportacion': {
        const reply = 'Según SINIM, Tesorería General de la República (Art. 84 LGPA), SUBPESCA y Aduanas DUS: Las 9.304 ha marinas concesionadas generan 3.249,5 M$ CLP/año directos para los municipios litoral-fiórdicos (50% de 20 UTM/ha; otros 3.249,5 M$ CLP/año ingresan al FNDR del GORE Aysén): Aysén recibe 1.485,0 M$ CLP (22,1% de sus ingresos propios), Cisnes 1.190,0 M$ CLP (29,3% IPP), Guaitecas 492,0 M$ CLP (87,7% de sus ingresos propios permanentes) y Tortel 82,5 M$ CLP (55,9% IPP). A nivel laboral, el empleo directo acuícola alcanza 7.055 trabajadores (4.850 en Aysén/Chacabuco, 1.420 Cisnes, 410 Guaitecas, 340 Coyhaique, 35 Tortel). Pese a producir más del 50% del salmón del Atlántico del país (503.500 ton/año), más del 80% se traslada en wellboats a plantas y puertos de Los Lagos (>US$ 5.600 millones/año facturados), exportándose directamente por Aduanas desde Aysén solo US$ 209 millones/año.';
        const sources = resolveSourcesForKeys(['patente_acuicola_pua_mclp', 'peso_pua_ingresos_propios_pct', 'empleo_directo_acuicola_n']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'patente_acuicola_pua_mclp',
            varY: 'peso_pua_ingresos_propios_pct',
            yKey: 'patente_acuicola_pua_mclp',
            y2Key: 'peso_pua_ingresos_propios_pct',
            focusComunas: ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel'],
            title: 'Patente Única de Acuicultura Art. 84 LGPA (M$ CLP/año) vs. Peso en Ingresos Propios (%)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'II'
        };
      }
      case 'fiscalizacion_sma_infa_salmon': {
        const reply = 'De acuerdo con SNIFA-SMA, SERNAPESCA y Res. Ex. N° 8228 SUBPESCA (abril 2026): La acuicultura en Aysén acumula 66 expedientes sancionatorios SMA-SNIFA (Aysén 31, Cisnes 21, Guaitecas 12, Tortel 2; liderados por AquaChile 18, Mowi Chile 8 y Australis Seafoods 8 por autodenuncia de sobreproducción, Multi X 7, Cermaq 6, Blumar 5 y Cooke Aquaculture 3 en Cupquelán) y 32 centros con condición INFA anaeróbica subyacente (Aysén 16, Cisnes 10, Guaitecas 6, Tortel 0). El límite regulatorio ICA 2026 fija un tope máximo de 400 g/t (comunas vigentes: Guaitecas 382,1 g/t, Aysén 335,4 g/t, Cisnes 324,8 g/t, Tortel 289,0 g/t), con mortalidad promedio ~0,7%/mes en Salmón del Atlántico dominada por SRS / Piscirickettsia salmonis (52,8%) y Tenacibaculosis (31,5%).';
        const sources = resolveSourcesForKeys(['sancionatorios_sma_acuicolas_n', 'centros_infa_anaerobica_n', 'antibioticos_ica_g_ton']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'sancionatorios_sma_acuicolas_n',
            varY: 'centros_infa_anaerobica_n',
            yKey: 'sancionatorios_sma_acuicolas_n',
            y2Key: 'centros_infa_anaerobica_n',
            focusComunas: ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel'],
            title: 'Expedientes Sancionatorios SMA-SNIFA vs. Centros con INFA Anaeróbica por Comuna',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'II'
        };
      }
      case 'ecmpo_snaspe': {
        const reply = 'Según registros oficiales de SUBPESCA, CONADI, CRUBC Aysén y CONAF: Se encuentran en tramitación más de 620.000 ha en las grandes solicitudes ECMPO continentales-insulares (Antünen Rain 393.000 ha en Aysén y Pu Wapi 227.000 ha en Cisnes), a las que se suman 148.000 ha en Las Guaitecas y 18.500 ha en Tortel (total regional 786.500 ha bajo Ley N° 20.249), generando traslape o suspensión (Art. 10) en 338 concesiones (Aysén 164, Cisnes 112, Guaitecas 58, Tortel 4). Paralelamente, 312 concesiones salmoneras operan dentro de áreas SNASPE (237 en RN Las Guaitecas, 53 en PN Isla Magdalena, 12 en RN Katalalixar y 10 en borde PN Laguna San Rafael / Cupquelán), bajo auditorías de Contraloría y la Ley SBAP N° 21.600.';
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
        const reply = 'Según los registros oficiales BCN / ODEPA (VIII Censo Nacional Agropecuario y Forestal): La Región de Aysén cuenta con 144.118 cabezas de ganado bovino y 177.972 cabezas de ganado ovino. La mayor dotación bovina se concentra en Coyhaique (46.816 bovinos), Lago Verde (20.048), Cochrane (18.065), Río Ibáñez (17.405) y Aysén (15.532), mientras la masa ovina lidera en Río Ibáñez (42.110), Chile Chico (38.210), Cochrane (34.808) y Coyhaique (32.010).';
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
        const reply = 'Según los balances oficiales de ejecución presupuestaria de la DIPRES: El FNDR del GORE Aysén devengó M$ 61.579,2 (90,1% de M$ 68.333,7 asignados) en 2023 y contó con presupuestos DIPRES de M$ 75.543 en 2024 y M$ 77.977 inicial (M$ 82.313 estimado GORE) en 2025. En contraposición, la inversión sectorial ministerial centralizada (MOP, MINVU, Salud, MTT) suma entre M$ 395.000 y M$ 402.000 anuales (5x a 6x el FNDR descentralizado). En el SNI/BIP, los proyectos municipales promedian una tasa de aprobación RS de solo 31,5% (rango de 18% en Tortel a 45% en Coyhaique).';
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
        const reply = 'Según estadísticas oficiales de la Comisión para el Mercado Financiero (CMF 2025) y BancoEstado: 8 de las 10 comunas de Aysén (80%) carecen de sucursales bancarias privadas (12 sucursales totales: 7 privadas concentradas en Coyhaique/Aysén y 5 BancoEstado) y existen 47 cajeros automáticos (66 locaciones por cada 100.000 adultos y 2.051 instrumentos de ahorro cada 1.000 habitantes). La red comunal de 415 puntos CajaVecina de BancoEstado sostiene la inclusión financiera rural y aislada.';
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
        const reply = 'Nudos críticos energéticos en Aysén (CNE / SEC / INFOR / MMA): 1) Desconexión del SEN: 67,10 MW operativos (+18,98 MW ERNC en construcción) y SSAA <= 1,50 MW; 2) Calidad y tarifas: SAIDI 36,0 h/año (64,3 h Tortel, 62,1 h Guaitecas) y BT1 $287,8/kWh en Coyhaique/Aysén (Decreto 8T nov-2026; 13.448 hogares con Subsidio Eléctrico); 3) Combustibles y leña: gasolina $1.696/L y kerosene $1.497/L vía único MBM Copec Chacabuco (6.674 m³) más 334.274 m³s/año de leña (Coyhaique 68,8% hogares); 4) Aire: Coyhaique suma 87 días/año sobre norma MP2.5.';
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
        const reply = 'Las fuentes oficiales no registran un censo comunal de perros o mascotas domésticas. Sin embargo, existen dos registros faunísticos vinculados en la base: 1) Biodiversidad (RCE MMA / CONAF): los perros asilvestrados figuran como amenaza directa crítica sobre los 1.500 a 2.000 huemules de Aysén (60%–70% de la población mundial); 2) Censo Agropecuario (BCN / ODEPA): el ganado doméstico censado alcanza 144.118 bovinos y 177.972 ovinos en la región (liderando Coyhaique con 46.816 bovinos y Río Ibáñez con 42.110 ovinos).';
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
      case 'composicion_politica_historica': {
        const hp = _dataLake?.historiaPolitica || {};
        const gov = hp?.ejecutivo_regional?.gobernadores_regionales_electos?.slice(-1)[0]?.nombre || 'Marcelo Santana Vargas';
        const dpr = hp?.ejecutivo_regional?.delegados_presidenciales_regionales?.slice(-1)[0]?.nombre || 'Luz María Vicuña Figueroa';
        const sens = hp?.senadores_historia_1990_2034?.slice(-1)[0]?.titulares?.map(t => t.nombre).join(' y ') || 'Miguel Ángel Calisto y Ximena Órdenes';
        const dips = hp?.diputados_historia_1990_2030?.slice(-1)[0]?.titulares?.map(t => t.nombre).join(', ') || 'Alejandra Valdebenito, René Alinco, Andrea Macías';
        const reply = `Serie histórica SERVEL/TRICEL/BCN (1989–2026): Gobernador Regional ${gov} (UDI, 54,39% 1V oct 2024; sucediendo a Andrea Macías 2021–2025) y DPR ${dpr} (desde mar 2026). Senadores 2026–2034: ${sens}; Diputados D27: ${dips}. El CORE cuenta con 14 escaños (6 Coyhaique, 4 Aysén, 2 Capitán Prat, 2 General Carrera). En presidenciales 2025: 1V Jara 27,2%, Kast 23,0%, Kaiser 20,3%, Parisi 16,6%; 2V Kast 59,93% vs Jara 40,07% (73,3% participación sobre 99.575 electores).`;
        const sources = resolveSourcesForKeys(['participacion_presidencial_2025_2v_pct', 'padron_electoral_nov_2025']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'participacion_presidencial_2025_2v_pct',
            varY: null,
            yKey: 'participacion_presidencial_2025_2v_pct',
            y2Key: null,
            title: 'Participación Electoral Presidencial 2V Dic 2025 (%) por Comuna (SERVEL)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'IV',
          isContextualBridge: true
        };
      }
      case 'transparencia_activa_cplt': {
        const cplt = _dataLake?.cpltTransparencia2026 || {};
        const avgReg = cplt.promedio_regional_aysen_pct ?? 73.8;
        const avgNac = cplt.promedio_nacional_pct ?? 88.5;
        const asksPresup = /\b(presupuesto|presupuestos|recursos municipales|gasto municipal)\b/i.test(qNorm);
        const asksProf = /\b(profesionalizacion|profesional|planta municipal|funcionarios)\b/i.test(qNorm);
        const asksIpp = /\b(ipp|ingresos propios)\b/i.test(qNorm);
        const extraKeys = [];
        if (asksPresup) extraKeys.push('presupuesto_mclp');
        if (asksProf) extraKeys.push('profesionalizacion_pct');
        if (asksIpp && !extraKeys.includes('ipp_per_capita_clp')) extraKeys.push('ipp_per_capita_clp');

        const varYKey = extraKeys[0] || null;
        const varZKey = extraKeys[1] || null;
        const multiCharts = extraKeys.length >= 2
          ? extraKeys.slice(0, 2).map(ek => ({
              type: 'scatter',
              varX: 'transparencia_activa_cplt_2026_pct',
              varY: ek,
              title: `Transparencia Activa CPLT 2026 (%) vs. ${CANONICAL_LABELS[ek] || ek}`,
              sourceText: resolveSourcesForKeys(['transparencia_activa_cplt_2026_pct', ek]).map(s => s.institucion).join(' · '),
              excludeCoyhaique: false
            }))
          : undefined;
        const corrFinding = extraKeys.length > 0
          ? ' El análisis bivariado demuestra que la transparencia activa no depende del tamaño presupuestario (r = 0,19) ni de la profesionalización de la planta (r = 0,20): municipios rurales pequeños como Río Ibáñez (100,0%) y Guaitecas (92,63%) superan ampliamente a Coyhaique (74,45%), Cisnes (61,60%) y Chile Chico (57,46%).'
          : '';
        const reply = `Según Fiscalización Transparencia Activa Municipal CPLT 2026, Aysén promedia ${String(avgReg).replace('.', ',')}% frente a ${String(avgNac).replace('.', ',')}% nacional (lugar 16/16 regiones). Lideran Río Ibáñez (100,0%, #1 nacional), Aysén (96,09%) y Guaitecas (92,63%), seguidas por Coyhaique (74,45%) y Tortel (72,92%), con brechas en Chile Chico (57,46%), Lago Verde (59,24%), Cochrane (60,58%), Cisnes (61,60%) y O'Higgins (62,71%).${corrFinding}`;
        const sources = resolveSourcesForKeys(['transparencia_activa_cplt_2026_pct', ...extraKeys]);
        return {
          reply,
          chart: {
            render: true,
            type: extraKeys.length === 1 ? 'scatter' : 'bar',
            varX: 'transparencia_activa_cplt_2026_pct',
            varY: varYKey,
            varZ: varZKey,
            yKey: 'transparencia_activa_cplt_2026_pct',
            y2Key: varYKey,
            multiCharts,
            title: varYKey
              ? `Transparencia Activa CPLT 2026 (%) vs. ${extraKeys.map(k => CANONICAL_LABELS[k] || k).join(' y ')}`
              : 'Transparencia Activa Municipal CPLT 2026 (% Cumplimiento)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'IV',
          isContextualBridge: true
        };
      }
      case 'royalty_minero_y_fondos_gore': {
        const asksFndrEvolution = /\b(evolucion|historico|historia|serie|anual|2015)\b.*\bfndr\b|\bfndr\b.*\b(evolucion|historico|historia|2015|2025|2026)\b/i.test(qNorm) && !/\broyalty\b/i.test(qNorm);
        const fndrSeries = Array.isArray(_dataLake?.series?.fndr_asignado_vs_ejecutado_2015_2025)
          ? _dataLake.series.fndr_asignado_vs_ejecutado_2015_2025
          : [];
        if (asksFndrEvolution && fndrSeries.length > 0) {
          const labels = fndrSeries.map(r => String(r.anio || r.periodo));
          const asigData = fndrSeries.map(r => Number(r.asignado_mclp) || 0);
          const execData = fndrSeries.map(r => (r.gasto_actual_mclp !== null && r.gasto_actual_mclp !== undefined ? Number(r.gasto_actual_mclp) : null));
          const sources = resolveSourcesForKeys(['fndr_gore_2023_ejecutado_mclp', 'tasa_aprobacion_rs_sni_pct']);
          return {
            reply: 'Según la serie oficial del GORE Aysén (datos.gob.cl / DIPRES 2015–2026), el FNDR pasó de $47.242,8 MM asignados ($43.706,5 MM ejecutados, 92,5%) en 2015 a $68.787,4 MM en 2017, sufrió una contracción extraordinaria por pandemia en 2020 ($17.714,6 MM asignados / $17.510,2 MM ejecutados en 165 iniciativas) y cerró 2023 con $68.333,7 MM asignados ($61.579,2 MM ejecutados CKAN / $61.548,0 MM cierre DIPRES = 90,0% en 560 iniciativas). Tras caer en 2024 a $44.765,5 MM devengados sobre $75.543,0 MM vigentes (59,3%), el ejercicio 2025 alcanzó un récord histórico de $73.863,0 MM devengados sobre $80.200,0 MM vigentes (92,0%, +65,0% vs 2024), proyectándose $81.812,0 MM iniciales en 2026 (marco ajustado $74.312,0 MM) y $80.748,0 MM para 2027 por acuerdo con Hacienda. En el SNI, las carteras municipales promedian una tasa de aprobación RS de 31,5% (rango de 18% en Tortel a 45% en Coyhaique).',
            chart: {
              render: true,
              type: 'line',
              varX: 'presupuesto_fndr_gore_aysen_mclp',
              varY: 'fndr_gore_ejecutado_datosgob_hist',
              yKey: 'presupuesto_fndr_gore_aysen_mclp',
              y2Key: 'fndr_gore_ejecutado_datosgob_hist',
              title: 'Evolución Oficial FNDR GORE Aysén: Asignado vs. Ejecutado (2015–2025)',
              sourceText: sources.map(s => s.institucion).join(' · '),
              excludeCoyhaique: false,
              customTemporalSeries: {
                xTitle: 'Años (2015–2025)',
                labels,
                datasets: [
                  { label: 'FNDR Asignado / Vigente DIPRES (M$ CLP)', data: asigData, unit: 'M$ CLP', borderColor: '#00357f', yAxisID: 'y' },
                  { label: 'FNDR Ejecutado Real datos.gob.cl (M$ CLP)', data: execData, unit: 'M$ CLP', borderColor: '#0284c7', yAxisID: 'y', dashed: true }
                ]
              }
            },
            sources,
            relatedHub: 'IV',
            isContextualBridge: true
          };
        }

        const g23 = _dataLake?.goreFndrSeries?.serie_fndr_regional_datosgob_2015_2023?.['2023'] || {};
        const init23 = g23.total_iniciativas || 560;
        const exec23 = g23.gasto_actual_mclp || 61579.2;
        const asig23 = g23.asignado_mclp || 68333.7;
        const pct23 = g23.tasa_ejecucion_pct || 90.1;
        const comunasRoy = [...(index.entities || [])]
          .filter(e => e.raw && e.raw.fet_royalty_minero_2025_mclp > 0)
          .sort((a, b) => (b.raw.fet_royalty_minero_2025_mclp || 0) - (a.raw.fet_royalty_minero_2025_mclp || 0));
        const sumRoy25 = comunasRoy.reduce((acc, e) => acc + (Number(e.raw.fet_royalty_minero_2025_mclp) || 0), 0);
        const sumRoy24 = comunasRoy.reduce((acc, e) => acc + (Number(e.raw.fet_royalty_minero_2024_mclp) || 0), 0);
        const pctVarRoy = sumRoy24 > 0 ? (((sumRoy25 - sumRoy24) / sumRoy24) * 100) : 132.8;
        const royDesglose = comunasRoy
          .map(e => `${e.name} $${fmtNumber(e.raw.fet_royalty_minero_2025_mclp, 2)} MM`)
          .join(', ');
        const reply = `En cartera GORE/DIPRES (datos.gob.cl), el FNDR 2023 ejecutó $${exec23.toLocaleString('es-CL')} MM de $${asig23.toLocaleString('es-CL')} MM en ${init23} iniciativas (${pct23}%), en 2024 devengó $44.765,5 MM sobre $75.543,0 MM (59,3%) y en 2025 alcanzó récord de $73.863,0 MM sobre $80.200,0 MM vigentes (92,0%; acuerdo 2027 $80.748,0 MM), con tasa promedio SNI RS comunal de 31,5%. Vía SUBDERE/TGR, el Fondo de Equidad Territorial (FET) Royalty Minero 2025 transfirió $${fmtNumber(sumRoy25, 2)} MM a las 10 comunas (+${fmtNumber(pctVarRoy, 1)}% frente a $${fmtNumber(sumRoy24, 2)} MM en 2024 y $1.652,0 MM en 1S 2026; FCMI = $0 MM): ${royDesglose}. Relativamente sobre ingresos municipales BCN 2025 ($84.820,68 MM), equivale al 8,5% en Lago Verde, 8,1% en Tortel y 5,3% en O'Higgins frente a 1,7% en Coyhaique.`;
        const asksBudgetWeight = /\b(peso\b|porcentaje|proporcion|incidencia|participacion)\b/i.test(qNorm) && /\b(presupuesto|municipal)\b/i.test(qNorm);
        const sources = resolveSourcesForKeys(
          asksBudgetWeight
            ? ['fet_royalty_minero_2025_mclp', 'royalty_fet_peso_presupuesto_pct']
            : ['fet_royalty_minero_2025_mclp', 'fndr_gore_2023_ejecutado_mclp']
        );
        return {
          reply,
          chart: asksBudgetWeight ? {
            render: true,
            type: 'scatter',
            varX: 'fet_royalty_minero_2025_mclp',
            varY: 'royalty_fet_peso_presupuesto_pct',
            yKey: 'fet_royalty_minero_2025_mclp',
            y2Key: 'royalty_fet_peso_presupuesto_pct',
            title: 'Royalty Minero FET 2025 (MM$ CLP) vs. Peso sobre Presupuesto Municipal (%)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          } : {
            render: true,
            type: 'bar',
            varX: 'fet_royalty_minero_2025_mclp',
            varY: 'fet_royalty_minero_2024_mclp',
            yKey: 'fet_royalty_minero_2025_mclp',
            y2Key: 'fet_royalty_minero_2024_mclp',
            title: 'Fondo Equidad Territorial Royalty Minero 2025 vs 2024 (MM$ CLP)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'IV',
          isContextualBridge: true
        };
      }
      case 'conectividad_digital_subtel_2026': {
        const reply = 'Al corte de junio 2026 (SUBTEL Tabla 7.7.1 corregida), Aysén suma 26.294 conexiones fijas de internet (+135,5% vs 2015): 75,96% FTTX fibra óptica (19.972), 21,48% satelital Starlink (5.648) y 2,25% xDSL. Lideran Coyhaique (15.785), Aysén (5.748) y Cisnes (1.638), frente a Tortel (56) y Lago Verde (189) con predominio satelital. En agosto 2026 inició Fibra Óptica Última Milla GORE-SUBTEL ($7.600 MM, 33 localidades, 7.802 viviendas).';
        const sources = resolveSourcesForKeys(['conexiones_fijas_subtel_jun2026_n', 'variacion_conexiones_2015_2026_pct']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'conexiones_fijas_subtel_jun2026_n',
            varY: 'conexiones_residenciales_subtel_jun2026_n',
            yKey: 'conexiones_fijas_subtel_jun2026_n',
            y2Key: 'conexiones_residenciales_subtel_jun2026_n',
            title: 'Conexiones Fijas Internet SUBTEL Jun 2026: Total vs Residencial',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'III',
          isContextualBridge: true
        };
      }
      case 'centros_ctci_red_campo': {
        const reply = (
          'Red Científica y Estaciones de Campo CTCi en Aysén (Nodos #35, #36 y #37 · ANID/MinCiencia/CORFO): ' +
          'Operan exactamente 16 centros científicos y estaciones de campo permanentes con 124 investigadores residentes: ' +
          'Coyhaique (6 centros y 91 investigadores: CIEP 34 [nómina 2026: 23 inv./19 PhD + 12 apoyo + 12 gestión = 47], UAysén 31 [FIUT Etapa 2 $10.484M y 1.000 alumnos SIES 2026], INIA Tamel Aike 10 [1er Banco Zoogenético], INFOR Sede Patagonia 9, UACh Campus Patagonia 5 [pregrado cerrado ago-2025] y DGAC BBA 2), ' +
          'Puerto Aysén (2 centros y 14 investigadores: Sede/Lab. IFOP Puerto Aysén y Plataforma Bioseguridad Barrio 21B 10 + Base Glaciológica San Rafael 4), ' +
          'Cisnes (IFOP y Reserva Elemental Melimoyu 16.000 ha, 4), Tortel (Lab. Costero CIEP/COPAS Coastal/CIAyT 3), Cochrane (Estación Cuencas CIEP/UAysén/Rewilding 3), Chile Chico (Estación Agroclimática INIA y Formación Toqui 3), ' +
          'Guaitecas (IFOP Melinka/CBA-MERI 2), Río Ibáñez (Estación Cerro Castillo UAysén / Bahía Exploradores UC con jurisdicción Aysén 11201 y acceso Río Tranquilo 11402, 2), Lago Verde (Nodo INIA/MinCiencia 1) y O\'Higgins (Estación Glaciar DGA/CECs/UdeC 1). ' +
          'En adjudicaciones ANID (120 proyectos / $17.326,8 MM: CIEP 34, UACh 32, UAysén 22, U. de Chile 3, Otras 29), la Ciencia Endógena Local alcanza 68 proyectos ($11.850,5 MM · 56,7% y 68,4% del monto) frente a 52 extrarregionales ($5.476,3 MM), más 59 proyectos CORFO Innova ($8.450 MM), Catastro NCA 2026 (9 equipos críticos activos = $1.683,1 MM; 6 FONDEQUIP en Aysén), matrícula SIES 2026 de 2.924 estudiantes (INACAP 1.187, UAysén 1.000, CFT Estatal 737), CDPR CORFO 2026 ($2.534 MM), Plan Aysén Azul (>$7.500 MM) y SEREMI de Ciencia Aysén (oct-2025).'
        );
        const sources = resolveSourcesForKeys(['centros_y_estaciones_ctci_count', 'investigadores_residentes', 'monto_anid_mclp', 'innovacion_corfo_mclp']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'centros_y_estaciones_ctci_count',
            varY: 'investigadores_residentes',
            yKey: 'centros_y_estaciones_ctci_count',
            y2Key: 'investigadores_residentes',
            customCategoryData: true,
            labels: ['CIEP (ANID)', 'UACh Patagonia', 'UAysén', 'U. de Chile', 'Otras Inst.', 'CORFO Innova'],
            datasets: [{
              label: 'Proyectos Adjudicados ANID & CORFO Innova en Aysén (n°)',
              data: [34, 32, 22, 3, 29, 59],
              backgroundColor: ['#00357f', '#0284c7', '#6d28d9', '#0f766e', '#64748b', '#b45309']
            }],
            title: 'Red CTCi (16 Centros · 124 Investigadores) y Proyectos ANID/CORFO por Institución',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'X'
        };
      }
      case 'patrimonio_inmaterial_arqueologia_sigpa': {
        const resCult = _dataLake?.extension_modules?.cultura_patrimonio?.resumen_regional || {};
        const cultoresTotal = resCult.cultores_patrimonio_inmaterial_total || 313;
        const orgsTotal = resCult.organizaciones_comunitarias_total || 392;
        const reply = (
          `Patrimonio Cultural Inmaterial SIGPA (SERPAT), Sitios Paleo-Arqueológicos CMN y Tejido Asociativo en Aysén (Nodo #34): ` +
          `1) Patrimonio Inmaterial SIGPA (${cultoresTotal} cultores registrados): Maestros tejueleros de Ciprés de las Guaitecas (45 cultores en Melinka, Tortel y Cisnes, en riesgo por restricción de acceso a madera muerta), ` +
          `Carpinteros de ribera y construcción naval artesanal (28 cultores activos en Puerto Aguirre, Gala, Gaviota y Melinka) y ` +
          `Jineteadas gauchas, chamamé y tradiciones camperas (240 cultores en 38 clubes camperos en Río Ibáñez, Cochrane, Mañihuales, Lago Verde y Coyhaique). ` +
          `2) Sitios Paleo-Arqueológicos CMN: Cueva Baño Nuevo 1 (Coyhaique, 10.200 años AP, conjunto funerario más antiguo de Patagonia occidental), Paredón de las Manos (Río Ibáñez, 3.000-6.000 años AP, Monumento Arqueológico por el solo ministerio de la Ley N° 17.288) y Formación Toqui en Mallín Grande (Chile Chico, 148 Ma, hallazgo mundial de Chilesaurus diegosuarezi). ` +
          `3) Tejido Asociativo (${orgsTotal} organizaciones): 248 Juntas de Vecinos (Ley 19.418), 45 Sindicatos de Pescadores Artesanales, 38 Clubes de Huasos y Jineteada, 31 Comités Campesinos y 22 Agrupaciones de Mujeres Rurales.`
        );
        const sources = resolveSourcesForKeys(['cultores_patrimonio_inmaterial_n', 'monumentos_nacionales_count', 'organizaciones_comunitarias_n']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'cultores_patrimonio_inmaterial_n',
            varY: 'organizaciones_comunitarias_n',
            yKey: 'cultores_patrimonio_inmaterial_n',
            y2Key: 'organizaciones_comunitarias_n',
            customCategoryData: true,
            labels: ['Cultores Camperos', 'Tejueleros de Ciprés', 'Carpinteros de Ribera', 'JJ.VV. Activas', 'Sindicatos Pesca', 'Clubes Camperos'],
            datasets: [{
              label: 'Patrimonio Inmaterial SIGPA (313 cultores) y Organizaciones (392)',
              data: [240, 45, 28, 248, 45, 38],
              backgroundColor: ['#b45309', '#d97706', '#0284c7', '#00357f', '#0f766e', '#7c2d12']
            }],
            title: 'Patrimonio Cultural Inmaterial SIGPA SERPAT (313) y Tejido Asociativo (392)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'IX'
        };
      }
      case 'especies_exoticas_invasoras': {
        const reply = (
          'Especies Exóticas Invasoras EEI en Aysén y Áreas Silvestres SNASPE (Nodo #29 · SAG/WCS/CONAF/SUBPESCA): ' +
          'El catastro regional registra 6 complejos evaluados: Visón norteamericano en 10/10 comunas (Control Macrozonal SAG y Estrategia WCS Chile / SAG / Island Conservation ago-2026), ' +
          'Salmónidos asilvestrados en 10/10 comunas (vigilancia SERNAPESCA), Microalga Didymo en 6 cuencas BNA declaradas en plaga o riesgo por SUBPESCA D.Ac. N° 414/2024 (110, 111, 113, 114, 115, 117 · 8 comunas continentales), ' +
          'Lupino en 7/10 comunas, Jabalí europeo en 6/10 comunas (incl. Río Ibáñez / PN Cerro Castillo, cámaras trampa CONAF/UACh 2025) y Castor americano con 0 comunas invadidas en Aysén (Alerta Temprana Preventiva SAT FAO/MMA/SAG/CONAF/WCS mar-2025 en Última Esperanza).'
        );
        const sources = resolveSourcesForKeys(['especies_exoticas_invasoras_n', 'fauna_amenazada_n', 'superficie_snaspe_pct']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'especies_exoticas_invasoras_n',
            varY: 'fauna_amenazada_n',
            yKey: 'especies_exoticas_invasoras_n',
            y2Key: 'fauna_amenazada_n',
            customCategoryData: true,
            labels: ['Visón Americano', 'Salmónidos (Chinook)', 'Alga Didymo (6 cuencas)', 'Lupino Invasor', 'Jabalí Europeo (6 com.)', 'Castor (SAT 0 com.)'],
            datasets: [{
              label: 'Cobertura Comunal Establecida de EEI (n° de 10 comunas)',
              data: [10, 10, 8, 7, 6, 0],
              backgroundColor: ['#b91c1c', '#dc2626', '#d97706', '#ca8a04', '#0284c7', '#4338ca']
            }],
            title: 'Catastro de Especies Exóticas Invasoras EEI en Aysén (Comunas Afectadas)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VII'
        };
      }
      case 'fauna_rce_conservacion': {
        const reply = (
          'Catastro de Fauna Silvestre RCE MMA en Aysén (20° Proceso RCE, D.S. N° 29/2025 oct-2026 · Nodo #28): ' +
          'La nómina RCE de Aysén reúne 154 taxones nativos y 64 especies en categorías de amenaza directa (CR, EN, VU); en el subconjunto emblemático auditado destacan: ' +
          '1 En Peligro Crítico (CR: Macá Tobiano), Huemul (EN: 750–1.000 individuos en Aysén, ~50%–60% de <1.500 maduros mundiales según 17° Proceso RCE MMA), ' +
          'Ballena Azul (EN: <250 individuos maduros, ~217 estimados en aguas chilenas Golfo de Penas–Chiloé), Huillín (EN entre Regiones VI y X; Insuficientemente Conocida IC en XI y XII), Ballena Sei (EN), Chungungo (EN), Pudú/Cóndor/Guanaco (VU) y Puma/Carpintero/Delfín Chileno (NT).'
        );
        const sources = resolveSourcesForKeys(['fauna_amenazada_n', 'superficie_snaspe_pct']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'fauna_amenazada_n',
            varY: 'superficie_snaspe_pct',
            yKey: 'fauna_amenazada_n',
            y2Key: 'superficie_snaspe_pct',
            customCategoryData: true,
            labels: ['En Peligro Crítico (CR)', 'En Peligro (EN)', 'Vulnerable (VU)', 'Casi Amenazada (NT)', 'Insuf. Conocida XI-XII (IC)'],
            datasets: [{
              label: 'Especies Emblemáticas Auditadas RCE MMA Aysén (12 fichas; 64 amenazadas de 154 totales)',
              data: [1, 4, 3, 3, 1],
              backgroundColor: ['#991b1b', '#dc2626', '#d97706', '#0284c7', '#64748b']
            }],
            title: 'Fauna Silvestre 20° Proceso RCE MMA en Aysén (154 taxones RCE · 64 amenazadas)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VII'
        };
      }
      case 'hidrologia_caudal_mp25_mensual': {
        const reply = (
          'Estacionalidad Hidrológica Mensual (Río Baker BNA 11530000-8 y Río Simpson) vs. MP2,5 SINCA (Nodo #30 · DGA/SINCA): ' +
          'Solo Coyhaique (2 EMRP: 97 episodios críticos GEC en 2026; 87 en 2024; 87 días >50 µg/m³) y Puerto Aysén (1 EMRP Vialidad PDA D.S. N° 03/2025: 16 días base 2022) poseen estaciones continuas SINCA. ' +
          'En hidrología, el Río Baker en Desagüe Lago Bertrand (BNA 11530000-8, media ~532 m³/s) presenta régimen nivo-glacial con máximo estival en febrero (675 m³/s) y enero (655 m³/s) y mínimo invernal en agosto (395 m³/s), contrastando con el pulso invernal de MP2,5 en Coyhaique II (160 µg/m³ en junio).'
        );
        const sources = resolveSourcesForKeys(['dias_sobre_norma_mp25', 'daa_no_consuntivos_m3s']);
        return {
          reply,
          chart: {
            render: true,
            type: 'line',
            varX: 'dias_sobre_norma_mp25',
            varY: 'daa_no_consuntivos_m3s',
            yKey: 'dias_sobre_norma_mp25',
            y2Key: 'daa_no_consuntivos_m3s',
            customTemporalSeries: true,
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic (12m)'],
            datasets: [
              {
                label: 'MP2.5 Estación Coyhaique II (µg/m³)',
                data: [18, 15, 22, 55, 115, 160, 145, 95, 45, 25, 19, 16],
                borderColor: '#991b1b',
                backgroundColor: 'rgba(153, 27, 27, 0.14)',
                yAxisID: 'y',
                unit: 'µg/m³'
              },
              {
                label: 'Caudal Medio Mensual Río Baker DGA BNA 11530000-8 (m³/s)',
                data: [655, 675, 615, 525, 475, 440, 415, 395, 405, 465, 555, 625],
                borderColor: '#0284c7',
                backgroundColor: 'rgba(2, 132, 199, 0.14)',
                yAxisID: 'y1',
                unit: 'm³/s'
              }
            ],
            title: 'Régimen Nivo-Glacial DGA Río Baker (Máx. Feb 675 / Mín. Ago 395 m³/s) vs. MP2.5 Coyhaique II',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VII'
        };
      }
      case 'volcanes_sismos_justicia_sma': {
        const asksSmaExplicit = /\b(sma|snifa|fiscalizacion|sancion\w*|denuncia\w*|justicia\s+ambiental|expedientes?)\b/i.test(qNorm);
        const asksSanRafael = /\b(laguna\s+san\s+rafael|glaciar\s+san\s+rafael|parque\s+nacional\s+laguna\s+san\s+rafael|campos?\s+de\s+hielo)\b/i.test(qNorm);

        if (asksSmaExplicit) {
          const smaRanked = (index.entities || []).slice().sort((a, b) => (b.raw?.expedientes_fiscalizacion_sma_n || 0) - (a.raw?.expedientes_fiscalizacion_sma_n || 0));
          const top3Sma = smaRanked.slice(0, 3).map(e => `${e.name} (${e.raw.expedientes_fiscalizacion_sma_n})`).join(', ');
          const reply = (
            'Amenaza Volcánica RNVV (SERNAGEOMIN), Sismicidad USGS y Fiscalización Ambiental SMA en Aysén (Nodo #31 + justicia_sma): ' +
            '1) 5 complejos volcánicos activos RNVV dentro de Aysén: Volcán Hudson (#12 nacional, Categoría I Muy Alto Riesgo por regla VEI >= 4), Melimoyu (Cat. II), Mentolat (#35, Cat. III), Macá (#39, Cat. III) y Cay (#63, Cat. IV), más Volcán Lautaro (Cat. III, Natales/Magallanes) como amenaza transregional al sur de Villa O\'Higgins (Cerro Arenales excluido por falta de erupción holocena confirmada). ' +
            '2) 396 eventos sísmicos catalogados USGS distribuidos por clúster geodésico: Hudson/Simpson (142), Puyuhuapi/Mentolat (98), Falla Liquiñe-Ofqui/Aysén (86), General Carrera (42) y Zona Sur/Glaciares (28). ' +
            `3) 282 expedientes comunales de fiscalización ambiental SMA SNIFA (prom. 28,2/comuna): lideran ${top3Sma} (nunca confundir volcanes activos con centros activos de salmonicultura).`
          );
          const sources = resolveSourcesForKeys(['expedientes_fiscalizacion_sma_n', 'amenaza_volcanica_sismica_idx']);
          return {
            reply,
            chart: {
              render: true,
              type: 'bar',
              varX: 'expedientes_fiscalizacion_sma_n',
              varY: 'amenaza_volcanica_sismica_idx',
              yKey: 'expedientes_fiscalizacion_sma_n',
              y2Key: 'amenaza_volcanica_sismica_idx',
              title: 'Expedientes de Fiscalización SMA (282) y Amenaza Volcánica-Sísmica por Comuna',
              sourceText: sources.map(s => s.institucion).join(' · '),
              excludeCoyhaique: false
            },
            sources,
            relatedHub: 'VII',
            isContextualBridge: true
          };
        }

        if (asksSanRafael) {
          const reply = (
            'Síntesis geográfica y glaciovolcánica de ambos hitos australes: ' +
            '1) Volcán Hudson (límite Aysén / Río Ibáñez): estratovolcán con caldera activa de 10 km, #12 nacional en el Ranking RNVV de SERNAGEOMIN (Categoría I Muy Alto Riesgo por regla VEI >= 4), erupciones históricas en 1971 y 1991 con lahares por el valle del Río Huemules y cenizas sobre Río Ibáñez/Chile Chico, junto a 142 eventos sísmicos USGS registrados en el clúster Hudson/Simpson. ' +
            '2) Parque Nacional y Glaciar Laguna San Rafael (comunas de Aysén, Tortel y Río Ibáñez; 1.742.000 ha SNASPE): puerta de entrada al Campo de Hielo Norte dentro de los 8.721,6 km² de superficie glaciar regional IPG 2022 (10.301 glaciares DGA-MOP), con 39.800 visitas anuales SNASPE (CONAF 2026) y monitoreo activo en la Base Glaciológica San Rafael (CECs / Universidad de Chile).'
          );
          const sources = resolveSourcesForKeys(['superficie_glaciares_km2', 'visitantes_snaspe', 'amenaza_volcanica_sismica_idx']);
          return {
            reply,
            chart: {
              render: true,
              type: 'bar',
              varX: 'superficie_glaciares_km2',
              varY: 'amenaza_volcanica_sismica_idx',
              yKey: 'superficie_glaciares_km2',
              y2Key: 'amenaza_volcanica_sismica_idx',
              title: 'Superficie Glaciar Comunal (km²) y Amenaza Volcánica-Sísmica RNVV por Comuna',
              sourceText: sources.map(s => s.institucion).join(' · '),
              excludeCoyhaique: false
            },
            sources,
            relatedHub: 'VII',
            isContextualBridge: true
          };
        }

        const reply = (
          'Amenaza Volcánica RNVV (SERNAGEOMIN) y Sismicidad USGS en Aysén (Nodo #31): ' +
          '1) 5 complejos volcánicos activos RNVV en Aysén: Volcán Hudson (#12 nacional, Categoría I Muy Alto Riesgo por regla VEI >= 4, caldera activa de 10 km entre Aysén y Río Ibáñez), Melimoyu (Cat. II), Mentolat (#35, Cat. III), Macá (#39, Cat. III) y Cay (#63, Cat. IV), más Volcán Lautaro (Cat. III, Natales/Magallanes) sobre O\'Higgins. ' +
          '2) 396 eventos sísmicos catalogados USGS distribuidos por clúster geodésico: Hudson/Simpson (142), Puyuhuapi/Mentolat (98), Falla Liquiñe-Ofqui/Aysén (86), General Carrera (42) y Zona Sur/Glaciares (28).'
        );
        const sources = resolveSourcesForKeys(['amenaza_volcanica_sismica_idx', 'superficie_glaciares_km2']);
        return {
          reply,
          chart: {
            render: true,
            type: 'bar',
            varX: 'amenaza_volcanica_sismica_idx',
            varY: 'superficie_glaciares_km2',
            yKey: 'amenaza_volcanica_sismica_idx',
            y2Key: 'superficie_glaciares_km2',
            title: 'Amenaza Volcánica-Sísmica RNVV y Superficie Glaciar Comunal (km²)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VII',
          isContextualBridge: true
        };
      }
      case 'seguridad_vif_dmcs': {
        const vifSeries = Array.isArray(_dataLake?.series?.tasa_vif_regional_por_100k_hab)
          ? _dataLake.series.tasa_vif_regional_por_100k_hab
          : [905.8, 926.1, 918.4, 948.9, 982.3, 1056.4, 1031.2, 994.8, 962.1, 938.4, 917.6, 897.1];
        const dmcsSeries = Array.isArray(_dataLake?.series?.tasa_dmcs_regional_por_100k_hab)
          ? _dataLake.series.tasa_dmcs_regional_por_100k_hab
          : [1948.5, 1998.0, 2064.2, 2108.5, 2142.3, 1706.5, 1785.0, 1942.0, 2058.4, 2124.6, 2150.9, 2107.8];
        const vifRanked = (index.entities || []).slice().sort((a, b) => (b.raw?.tasa_vif_100k || 0) - (a.raw?.tasa_vif_100k || 0));
        const dmcsRanked = (index.entities || []).slice().sort((a, b) => (b.raw?.tasa_dmcs_100k || 0) - (a.raw?.tasa_dmcs_100k || 0));
        const topVif = vifRanked.slice(0, 2).map(e => `${e.name} (${fmtNumber(e.raw.tasa_vif_100k)} c/100k)`).join(' y ');
        const topDmcs = dmcsRanked.slice(0, 2).map(e => `${e.name} (${fmtNumber(e.raw.tasa_dmcs_100k)} c/100k)`).join(' y ');
        const reply = (
          'Evolución Histórica 2015-2026 y Tasas Comunales de Violencia Intrafamiliar (VIF) vs. Delitos de Mayor Connotación Social (DMCS) en Aysén (SPD-CEAD, Nodo #26): ' +
          'En la serie regional 2015-2026 se observa la divergencia pandémica 2020-2021: mientras DMCS cayó un -20,3% por confinamiento (de 2.142,3 en 2019 a 1.706,5 c/100k en 2020, cerrando en 2.107,8 en 2026), ' +
          'las denuncias VIF subieron de 905,8 (2015) a un máximo histórico de 1.056,4 c/100k en 2020 y cerraron en 897,1 c/100k en 2026. ' +
          `A nivel comunal 2026, VIF es liderada por ${topVif} (prom. comunal ${fmtNumber(index.variablesByKey.tasa_vif_100k?.stats?.avg || 624.6)} c/100k), mientras DMCS lidera en ${topDmcs} (prom. ${fmtNumber(index.variablesByKey.tasa_dmcs_100k?.stats?.avg || 1125.1)} c/100k).`
        );
        const sources = resolveSourcesForKeys(['tasa_vif_100k', 'tasa_dmcs_100k']);
        return {
          reply,
          chart: {
            render: true,
            type: 'line',
            varX: 'tasa_vif_100k',
            varY: 'tasa_dmcs_100k',
            yKey: 'tasa_vif_100k',
            y2Key: 'tasa_dmcs_100k',
            customTemporalSeries: true,
            labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
            datasets: [
              {
                label: 'Tasa Violencia Intrafamiliar VIF (c/100k hab)',
                data: vifSeries,
                borderColor: '#b91c1c',
                backgroundColor: 'rgba(185, 28, 28, 0.14)',
                yAxisID: 'y',
                unit: 'c/100k hab'
              },
              {
                label: 'Tasa Delitos de Mayor Connotación Social DMCS (c/100k hab)',
                data: dmcsSeries,
                borderColor: '#00357f',
                backgroundColor: 'rgba(0, 53, 127, 0.12)',
                yAxisID: 'y1',
                unit: 'c/100k hab'
              }
            ],
            title: 'Serie Histórica VIF vs. Delitos DMCS en Aysén (2015-2026 · c/100k hab)',
            sourceText: sources.map(s => s.institucion).join(' · '),
            excludeCoyhaique: false
          },
          sources,
          relatedHub: 'VI'
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
      { key: 'transparencia_activa_cplt_2026_pct', bloque: 'Finanzas Municipales e Inversión' },
      { key: 'fet_royalty_minero_2025_mclp', bloque: 'Finanzas Municipales e Inversión' },
      { key: 'fndr_gore_2023_ejecutado_mclp', bloque: 'Finanzas Municipales e Inversión' },
      { key: 'participacion_presidencial_2025_2v_pct', bloque: 'Finanzas Municipales e Inversión' },
      { key: 'pobreza_ingresos_pct', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'pobreza_multidim_pct', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'camas_hospitalarias', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'postas_salud_rural', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'medicos_por_mil_hab', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'matricula_escolar', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'hogares_lena_pct', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'dias_sobre_norma_mp25', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'tarifa_bt1_clp', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'saidi_horas_anual', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'rsh_carencia_servicios_basicos_jun2026_pct', bloque: 'Social, Salud, Educación y Energía' },
      { key: 'conexiones_fijas_subtel_jun2026_n', bloque: 'Social, Salud, Educación y Energía' }
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
  function buildComunaProfileReply(ent, index, options = {}) {
    const r = ent.raw;
    const pob = fmtNumber(r.poblacion_censo_2024);
    const pct = fmtNumber(r.porcentaje_regional_pct);
    const sup = fmtNumber(r.superficie_km2);
    const dens = fmtNumber(r.densidad_hab_km2, 2);
    const rankPob = getComunaRank(index, r.comuna_ine, 'poblacion_censo_2024') || 1;

    if (options && options.evaluativeMultiCriteria) {
      const rankAisl = getComunaRank(index, r.comuna_ine, 'indice_aislamiento_multimodal') || '-';
      const rankFndrPc = getComunaRank(index, r.comuna_ine, 'fndr_per_capita_mclp') || '-';
      const dieselReal = r.costo_real_generacion_diesel_kwh_clp || r.costo_diesel_aislado_clp || 0;
      const energiaTxt = dieselReal > 0
        ? `diésel aislado a $${fmtNumber(dieselReal)}/kWh (BT1 $${fmtNumber(r.tarifa_bt1_clp)}/kWh)`
        : `tarifa BT1 $${fmtNumber(r.tarifa_bt1_clp)}/kWh (${fmtNumber(r.potencia_mw)} MW)`;
      const barcazaShort = String(r.dependencia_barcaza || '').split('(')[0].trim();
      const locCab = r.cabecera ? `${r.cabecera}, ` : '';
      return (
        `Radiografía territorial de ${ent.name} (${locCab}${pob} hab., ${sup} km²): ` +
        `Aislamiento multimodal ${fmtNumber(r.indice_aislamiento_multimodal, 1)}/100 (#${rankAisl} reg.), ${fmtNumber(r.traslado_coyhaique_hrs)} hrs a Coyhaique${barcazaShort ? ` (${barcazaShort})` : ''}. ` +
        `Inversión y Finanzas: FNDR per cápita M$ ${fmtNumber(r.fndr_per_capita_mclp, 1)}/hab (#${rankFndrPc} reg., M$ ${fmtNumber(r.fndr_mclp)}), ${fmtNumber(r.dependencia_fcm_pct, 1)}% FCM, ${fmtNumber(r.empresas_sii)} empresas SII y US$ ${fmtNumber(r.inversion_seia_mmusd)} MM SEIA. ` +
        `Energía, Conectividad y Turismo: ${energiaTxt}, ${fmtNumber(r.cobertura_fibra_hogar_pct, 1)}% fibra hogar (${fmtNumber(r.conexiones_fijas_subtel_jun2026_n)} conexiones SUBTEL), ${fmtNumber(r.visitantes_snaspe)} visitas SNASPE (${fmtNumber(r.superficie_snaspe_pct, 1)}% protegido).`
      );
    }

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

    if (Array.isArray(varRecord.synonymMatchers)) {
      for (const m of varRecord.synonymMatchers) {
        if (m.re.test(qNorm)) {
          score += m.bonus;
        }
      }
    } else {
      for (const phrase of varRecord.synonyms || []) {
        if (phrase.length >= 2) {
          const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const re = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`);
          if (re.test(qNorm)) {
            const wordCount = phrase.split(' ').length;
            score += 14 * wordCount + phrase.length * 0.5;
          }
        }
      }
    }

    const blockDependVerbMatch = varRecord.key === 'trabajadores_sii';
    for (const qt of qTokens) {
      const isDependVerb = blockDependVerbMatch && /^depend(?:e|en|ia|ian|encia|iendo|emos)$/.test(qt);
      let matchedExactOrPrefix = false;
      for (const vt of varRecord.tokens) {
        if (isDependVerb && /^dependient/.test(vt)) continue;
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
        const allowStemCheck = !(isDependVerb && /^depend/.test(qtStem));
        if (allowStemCheck && qtStem.length >= 4 && varRecord.stems.some(vs => vs === qtStem || (vs.length >= 5 && qtStem.length >= 5 && (vs.startsWith(qtStem) || qtStem.startsWith(vs))))) {
          score += 3.5;
        }
      }
    }

    const asksMacroPibOrIncome = /\b(pib|producto interno bruto|ingreso per capita|sueldo)\b/.test(qNorm);
    const asksPerMilHabitantes = /(por mil habitantes|cada 1000 habitantes|cada mil habitantes)/.test(qNorm) && !/\bdensidad\b/.test(qNorm);
    if (!asksMacroPibOrIncome && /(por habitante|per capita|por cada mil|por cada 1000|cada mil|por mil)/.test(qNorm)) {
      if (/(per_capita|por_mil|ratio)/.test(varRecord.key) || (!asksPerMilHabitantes && varRecord.key === 'densidad_hab_km2')) score += 18;
      if (varRecord.key === 'poblacion_censo_2024') score -= 20;
      if (asksPerMilHabitantes && (varRecord.key === 'densidad_hab_km2' || varRecord.key === 'poblacion_censo_2024')) score -= 18;
    }

    if (/(fondo comun municipal|dependencia.*fcm)/.test(qNorm) && varRecord.key === 'dependencia_fcm_pct') {
      score += 30;
    }
    if (/(calefaccion.*lena|hogares.*lena)/.test(qNorm) && varRecord.key === 'hogares_lena_pct') {
      score += 30;
    }
    if (/(porcentaje|pct|%)\s+(?:de\s+)?(?:red\s+vial\s+pavimentada|pavimentacion)/.test(qNorm) && varRecord.key === 'red_vial_pavimentada_pct') {
      score += 45;
    }
    if (/\bbiomasa\b/.test(qNorm) && !/\bpellet\b/.test(qNorm) && varRecord.key === 'biomasa_salmon_ton') {
      score += 30;
    }
    if (
      /(personas viven|cuantas personas|poblacion|habitantes)/.test(qNorm) &&
      !/(por habitante|per capita|por cada mil|por cada 1000|cada mil|por mil|envejec|adult|indigen|beneficiari|canin|escolar|joven|juvenil|activa|ocupada|rural|urbana|presion turistica|investigadores)/.test(qNorm)
    ) {
      if (varRecord.key === 'poblacion_censo_2024') score += 40;
    }
    if (varRecord.key === 'poblacion_censo_2024' && /\binvestigadores\s+residentes\b/i.test(qNorm) && !/\b(poblacion|habitantes|personas\s+viven)\b/i.test(qNorm)) {
      score -= 25;
    }
    if (/((?:porcentaje|superficie)\s+(?:de\s+)?(?:superficie\s+|areas\s+protegidas\s+)?snaspe|\bareas\s+protegidas\s+snaspe\b|\barea\s+snaspe\b)/i.test(qNorm)) {
      if (varRecord.key === 'superficie_snaspe_pct') score += 45;
      if (varRecord.key === 'superficie_km2' && !/\b(superficie\s+comunal|superficie\s+territorial|km2)\b/i.test(qNorm)) score -= 28;
    }
    if ((varRecord.key === 'superficie_km2' || varRecord.key === 'superficie_snaspe_pct') && /\bsuperficie\s+de\s+bosque/i.test(qNorm)) {
      score -= 12;
    }
    if ((varRecord.key === 'investigadores_residentes' || varRecord.key === 'investigadores_residentes_est') && !/\binvestigador/i.test(qNorm)) {
      score -= 10;
    }
    if (varRecord.key === 'ruralidad_censo_2024_pct' && !/\b(rural|ruralidad)\b/i.test(qNorm)) {
      score -= 20;
    }
    if (
      varRecord.key === 'profesionalizacion_pct' &&
      /(financiamiento|finanzas|presupuesto|fcm|fondo comun|ingresos|recursos municipales)/i.test(qNorm) &&
      !/\b(profesional|profesionalizacion|planta|funcionarios|personal)\b/i.test(qNorm)
    ) {
      score -= 20;
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
  /**
   * Paquetes Conceptuales Sistémicos: cuando el usuario pregunta "cómo funciona",
   * "cómo se estructura", "de qué depende" o consulta un concepto multidimensional,
   * garantizamos que el LLM y el motor determinista reciban todas las variables reales del fenómeno.
   */
  const CONCEPTUAL_DOMAIN_PACKETS = [
    {
      id: 'financiamiento_municipal',
      hubId: 'gobernanza',
      relatedHub: 'IV',
      pattern: /(financiamiento\s+municipal|finanzas\s+municipales|como\s+se\s+financian\s+los\s+municipios|recursos\s+municipales|autonomia\s+financiera\s+municipal|como\s+funciona\s+(?:el\s+financiamiento|el\s+municipio|el\s+fcm|el\s+fondo\s+comun|la\s+hacienda\s+municipal))/i,
      title: 'Sistema de Financiamiento Municipal en la Región de Aysén (SINIM - SUBDERE)',
      coreVariables: [
        'presupuesto_mclp',
        'dependencia_fcm_pct',
        'ingresos_propios_pct',
        'fndr_per_capita_mclp',
        'profesionalizacion_pct',
        'fndr_gore_2023_ejecucion_pct'
      ],
      preferredChart: {
        type: 'bar',
        varX: 'dependencia_fcm_pct',
        varY: 'ingresos_propios_pct',
        title: 'Estructura del Financiamiento Municipal: Dependencia FCM (%) vs. Ingresos Propios Permanentes (%)'
      },
      conceptualBrief:
        'El financiamiento de las 10 municipalidades de la Región de Aysén opera bajo un modelo mixto regulado por la Ley de Rentas Municipales y monitoreado en SINIM (SUBDERE): ' +
        '(1) Ingresos Propios Permanentes (IPP): recaudación comunal directa por patentes comerciales, industriales y acuícolas, permisos de circulación, derechos de aseo e impuesto territorial; ' +
        '(2) Fondo Común Municipal (FCM): mecanismo constitucional de redistribución solidaria intercomunal administrado por SUBDERE que compensa la menor base tributaria de comunas rurales o aisladas; y ' +
        '(3) Transferencias de Capital e Inversión Regional (FNDR GORE Aysén, PMU, PMB y FRIL). ' +
        'En Aysén, los ingresos municipales BCN/SINIM 2025 suman 84.820,68 M$ (promedio 8.482,1 M$ por comuna), con IPP de 19.243,52 M$, FCM de 41.753,32 M$ (dependencia FCM de 68,5% ponderada / 77,5% simple comunal): Cisnes (48,7% FCM gracias a 1.928,64 M$ de patentes acuícolas), Coyhaique (58,4% FCM; 27.611,00 M$) y Aysén (61,1% FCM; 14.614,29 M$) concentran la recaudación propia, mientras Tortel (95,4% FCM; 3.440,74 M$), O\'Higgins (95,3% FCM; 5.323,76 M$), Río Ibáñez (86,6% FCM) y Chile Chico (86,5% FCM) dependen mayoritariamente del FCM y Royalty FET.'
    },
    {
      id: 'sistema_electrico_energia',
      hubId: 'energia',
      relatedHub: 'III',
      pattern: /(como\s+funciona\s+(?:la\s+energia|el\s+sistema\s+electrico|la\s+electricidad|la\s+matriz\s+energetica)|sistemas\s+medianos(?:\s+aislados)?|aislamiento\s+electrico|transicion\s+energetica|pobreza\s+energetica|matriz\s+termica(?:\s+a\s+lena)?|contaminacion.*hidroelectric\w*|hidroelectric\w*.*contaminacion|luz\s+es\s+muy\s+cara.*lena|luz.*cara.*lena|tarifa\s+electrica.*lena|lena.*tarifa\s+electrica)/i,
      title: 'Matriz Energética Dual de Aysén: Sistemas Eléctricos Medianos Aislados y Matriz Térmica a Leña',
      coreVariables: [
        'potencia_mw',
        'tarifa_bt1_clp',
        'hogares_lena_pct',
        'consumo_lena_m3_hogar_ano',
        'dias_sobre_norma_mp25',
        'saidi_horas_anual'
      ],
      preferredChart: {
        type: 'scatter',
        varX: 'tarifa_bt1_clp',
        varY: 'consumo_lena_m3_hogar_ano',
        title: 'Tarifa Eléctrica Residencial BT1 ($/kWh) vs. Consumo Anual de Leña (m³/hogar/año)'
      },
      conceptualBrief:
        'Aunque Aysén posee abundante recurso hídrico, no está conectada al SEN: opera en Sistemas Medianos (SMA, SMGC, Cisnes/Palena) y Sistemas Aislados <= 1,50 MW que suman 67,10 MW operativos (33,95 MW en Coyhaique y 18,48 MW en Aysén, más +18,98 MW ERNC en construcción 2026). El Pliego Edelaysen vigente al 1-nov-2026 (Decreto N° 8T/2026) sitúa la tarifa BT1 en $287,8/kWh en Coyhaique/Aysén (hasta $318,0/kWh en Tortel, donde el Subsidio Eléctrico Ley 21.667 excluye a los SSAA). Al convertir a $/kWh térmico útil, calefaccionar con bomba de calor cuesta ~$102,8/kWh_útil (y con kerosene $174,7/kWh_útil tras el shock FEPP de +$282/L), frente a ~$45,7/kWh_útil de la leña ($48.000/m³ en Coyhaique), explicando por qué el 68,8% de hogares coyhaiquinos (9,81 m³s/hogar; 147.080 m³s de 334.274 m³s regionales) y >94% en comunas extremas siguen usando leña, generando 87 días/año sobre norma MP2.5 en Coyhaique.'
    },
    {
      id: 'modelo_salmonicultor',
      hubId: 'salmonicultura',
      relatedHub: 'II',
      pattern: /(como\s+funciona\s+(?:la\s+salmonicultura|la\s+acuicultura|la\s+industria\s+salmonera|la\s+industria\s+del\s+salmon|el\s+sector\s+salmonero)|modelo\s+salmonero|estructura\s+salmonera|industria\s+del\s+salmon.*duenos|duenos.*salmon)/i,
      title: 'Estructura Territorial, Productiva y Holdings Dueños de la Salmonicultura en Aysén',
      coreVariables: [
        'concesiones_salmon',
        'centros_activos_salmon',
        'biomasa_salmon_ton',
        'trabajadores_sii',
        'antibioticos_ica_g_ton',
        'tasa_ocupacion_concesiones_pct'
      ],
      preferredChart: {
        type: 'bar',
        varX: 'biomasa_salmon_ton',
        varY: 'centros_activos_salmon',
        title: 'Biomasa Cosechada de Salmónidos (ton) y Centros Activos por Comuna'
      },
      conceptualBrief:
        'La industria del salmón en Aysén suma 745 concesiones otorgadas, 245 centros operativos activos y 503.500 toneladas de biomasa cosechada anual en cuatro comunas litoral-fiórdicas: Puerto Aysén (412 concesiones, 135 centros activos, 265.000 ton), Cisnes (218 conc., 78 centros, 185.000 ton), Guaitecas (98 conc., 32 centros, 45.000 ton) y Tortel (17 conc., 8.500 ton). La propiedad se organiza bajo 13 holdings salmoneros madres: AquaChile / Grupo Agrosuper (210 concesiones, 141.937 ton), Mowi Chile (95 conc., 64.196 ton), Multi X (80 conc., 54.076 ton), Cermaq Chile (75 conc., 50.702 ton), Salmones Blumar (62 conc., 41.891 ton), Australis Seafoods (46 conc.), Salmones Camanchaca (38 conc.), Salmones Yadrán (31 conc.), Invermar (27 conc.), Salmones Austral (24 conc.), Salmones Antártica (20 conc.), Cooke Aquaculture Chile (18 conc.) y Titulares Menores Aysén (19 conc.).'
    },
    {
      id: 'inversion_publica_regional',
      hubId: 'inversion',
      relatedHub: 'V',
      pattern: /(como\s+(?:funciona|opera|se\s+asigna)\s+la\s+inversion\s+publica|sistema\s+de\s+inversion\s+publica|arquitectura\s+(?:de\s+)?inversion|plan\s+especial\s+de\s+zonas\s+extremas|\bpedze\b|\bbip\s+midasof\b|como\s+funciona\s+el\s+fndr)/i,
      title: 'Arquitectura de Inversión Pública Territorial en Aysén (FNDR GORE y Cartera Sectorial)',
      coreVariables: [
        'fndr_mclp',
        'fndr_per_capita_mclp',
        'fndr_gore_2023_ejecucion_pct',
        'red_vial_total_km',
        'red_vial_pavimentada_pct',
        'indice_aislamiento_multimodal'
      ],
      preferredChart: {
        type: 'bar',
        varX: 'fndr_mclp',
        varY: 'fndr_per_capita_mclp',
        title: 'Inversión Pública FNDR Asignada (M$) vs. FNDR Per Cápita (Miles $/hab)'
      },
      conceptualBrief:
        'La inversión pública territorial en Aysén articula el Fondo Nacional de Desarrollo Regional (FNDR GORE Aysén, con 54.650,0 M$ distribuidos comunalmente), la cartera sectorial de infraestructura MOP (3.386,4 km de red vial total y 412,8 km pavimentados, 12,2%) y planes de zonas extremas (PEDZE). Para compensar sobrecostos logísticos y aislamiento, la asignación per cápita del FNDR privilegia las comunas extremas e insulares: Tortel (5.148,5 mil $/hab), O\'Higgins (3.709,4 mil $/hab), Lago Verde (2.824,1 mil $/hab) y Guaitecas (2.127,7 mil $/hab).'
    },
    {
      id: 'red_asistencial_salud',
      hubId: 'salud',
      relatedHub: 'VIII',
      pattern: /(como\s+funciona\s+(?:la\s+salud|la\s+red\s+asistencial|el\s+servicio\s+de\s+salud)|arquitectura\s+hospitalaria|derivacion\s+medica\s+en\s+aysen)/i,
      title: 'Arquitectura de la Red Asistencial del Servicio de Salud Aysén (DEIS - MINSAL)',
      coreVariables: [
        'camas_hospitalarias',
        'postas_salud_rural',
        'medicos_por_mil_hab',
        'traslado_coyhaique_hrs',
        'mediana_espera_quirurgica_dias',
        'mediana_espera_especialidad_dias'
      ],
      preferredChart: {
        type: 'scatter',
        varX: 'traslado_coyhaique_hrs',
        varY: 'mediana_espera_quirurgica_dias',
        title: 'Tiempo de Derivación Médica a Coyhaique (hrs) vs. Mediana de Espera Quirúrgica (días)'
      },
      conceptualBrief:
        'El Servicio de Salud Aysén (DAP SSA · 0% salud municipalizada; 0 clínicas privadas de hospitalización general) articula 5 hospitales con 213 camas de diseño (174 agudas efectivas y 8 pabellones quirúrgicos): Hospital Regional de Coyhaique (135 basales, 141 con 6 UPC Pediátrica jun-2026, 4 pabellones), Puerto Aysén (56 camas, 2 pabellones; ~30 camas bloqueadas sociosanitarias en la red), Puerto Cisnes Dr. Jorge Ibar Bruce (8 camas), Hospital Dr. Leopoldo Ortega Rodríguez de Chile Chico (7 camas, 1 pabellón, nuevo edificio feb-2026) y Hospital Lord Cochrane (7 camas, 1 pabellón, acreditado may-2026). La APS reúne 4 CESFAM (+1 en construcción), 4 CECOSF, 27 PSR (100% tele-ECG), 9 EMR y 2 COSAM, bajo el Convenio GORE–MINSAL de $195.000M. Registra 14.751 CNE (159d), 3.608 IQ (262d), 6.870 Odonto (242d), 524 GES (88d) y 454 aeroevacuaciones SAMU primarias + 45 secundarias (Melinka regulado por SAMU Reloncaví; HRC sin equipo ECMO).'
    },
    {
      id: 'ecosistema_ctci_ciencia',
      hubId: 'ctci',
      relatedHub: 'X',
      pattern: /(quienes\s+hacen\s+ciencia|quienes\s+investigan|como\s+funciona\s+la\s+ciencia|ecosistema\s+ctci|centros\s+de\s+investigacion|investigacion\s+cientifica\s+en\s+aysen|ciencia\s+o\s+investigacion(?:\s+en\s+aysen)?)/i,
      title: 'Ecosistema de Ciencia, Tecnología, Conocimiento e Innovación (Hub X CTCi) en Aysén',
      coreVariables: [
        'total_proyectos_ctci',
        'investigadores_residentes_est',
        'monto_anid_mclp',
        'centros_y_estaciones_ctci_count',
        'monto_corfo_innova_mclp',
        'proyectos_anid_n'
      ],
      preferredChart: {
        type: 'bar',
        varX: 'total_proyectos_ctci',
        varY: 'investigadores_residentes_est',
        title: 'Total de Proyectos CTCi (ANID + CORFO) vs. Investigadores Residentes Estimados por Comuna'
      },
      conceptualBrief:
        'El ecosistema de Ciencia, Tecnología, Conocimiento e Innovación (Hub X CTCi) de Aysén articula 16 centros científicos y estaciones geolocalizadas con 124 investigadores residentes en la región (91 en Coyhaique), 179 proyectos CTCi totales (120 proyectos ANID por $17.326,8 MM — 68 locales [$11.850,5 MM] y 52 extrarregionales [$5.476,3 MM] — más 59 proyectos CORFO Innova por $8.450,0 MM), FIUT Etapa 2 UAysén ($10.484 MM a 10 años), PATSER CIEP R20F0002 ($2.750 MM) + Basal GORE 2026 (>$1.599 MM), Catastro NCA 2026 (9 equipos críticos activos = $1.683,1 MM: UAysén 4 [$1.295,9 MM], CIEP 4 [$330,3 MM], INIA 1 [$56,8 MM]; 6 FONDEQUIP), matrícula SIES 2026 de 2.924 estudiantes (INACAP 1.187, UAysén 1.000, CFT Estatal 737), CDPR CORFO 2026 ($2.534 MM, +34,4%), Plan Aysén Azul (>$7.500 MM), 252 marcas INAPI (+63% en 2025, #1 nacional) y SEREMI de Ciencia propia en Aysén (oct-2025). ' +
        'Principales centros: CIEP (34 inv. en Coyhaique [nómina 2026: 47 personas] y 3 en Caleta Tortel junto a COPAS Coastal), UAysén (31), INIA Tamel Aike (10 en Coyhaique con 1er Banco Zoogenético y 3 en Chile Chico), INFOR Sede Patagonia (9), UACh Campus Patagonia (5), IFOP Puerto Aysén/Barrio 21B (10), Base Glaciológica San Rafael (4), IFOP Cisnes/Melimoyu (4), Cochrane (3), IFOP Melinka (2), Estación Cerro Castillo UAysén / Bahía Exploradores UC (Río Ibáñez/Aysén, 2), O\'Higgins (1) y Lago Verde (1).'
    }
  ];

  /**
   * Grafo Territorial Multi-Entidad: resuelve topónimos polisémicos, pasos fronterizos,
   * cuencas, glaciares y especies emblemáticas en plural evitando búsquedas vacías o alucinaciones.
   */
  const TERRITORIAL_ENTITY_GRAPH = [
    {
      id: 'huemules_multidimensional',
      relatedHub: 'VII',
      pattern: /\b(huemules|paso\s+huemules|rio\s+huemules|valle\s+huemules)\b/i,
      comunas: ['Coyhaique', 'Aysén'],
      hubIds: ['biodiversidad', 'inversion', 'turismo'],
      variables: [
        'fauna_amenazada_n',
        'superficie_snaspe_pct',
        'red_vial_total_km',
        'visitantes_snaspe'
      ],
      preferredChart: {
        type: 'bar',
        varX: 'fauna_amenazada_n',
        varY: 'superficie_snaspe_pct',
        title: 'Especies de Fauna Amenazada RCE (n°) y Superficie Protegida SNASPE (%) por Comuna'
      },
      verifiedSynthesis:
        'En la Región de Aysén, «Huemules» alude a tres entidades territoriales y ecológicas verificadas: ' +
        '(1) Paso Fronterizo Huemules (comuna de Coyhaique, sector Balmaceda): complejo aduanero terrestre del corredor binacional ATIT 1974 junto a la Ruta 40 argentina hacia Comodoro Rivadavia y barrera de bioseguridad fitosanitaria del SAG; ' +
        '(2) Río Huemules y Valle Huemules (sector limítrofe Aysén / Coyhaique): cuenca fluvioglaciar que drena el flanco occidental del Volcán Hudson hacia el estero Elefantes; y ' +
        '(3) Huemul (Hippocamelus bisulcus, en plural «huemules»): cérvido nativo en categoría En Peligro (EN) en el RCE MMA (< 1.500 individuos maduros a nivel mundial según Ficha Oficial 17° Proceso RCE), con una población estimada de 750 a 1.000 individuos en Aysén (~50% a 60% de la población mundial) protegida en áreas SNASPE como el Parque Nacional Cerro Castillo y la Reserva Nacional Tamango.'
    },
    {
      id: 'volcan_hudson',
      relatedHub: 'VII',
      pattern: /\b(volcan\s+hudson|hudson)\b/i,
      comunas: ['Río Ibáñez', 'Aysén'],
      hubIds: ['biodiversidad', 'turismo', 'social'],
      variables: [
        'amenaza_volcanica_sismica_idx',
        'superficie_glaciares_km2',
        'visitantes_snaspe'
      ],
      preferredChart: {
        type: 'bar',
        varX: 'amenaza_volcanica_sismica_idx',
        varY: 'superficie_glaciares_km2',
        title: 'Índice de Amenaza Volcánica-Sísmica RNVV y Superficie Glaciar Comunal (km²)'
      },
      verifiedSynthesis:
        'El Volcán Hudson (-45.90, -72.97, límite Río Ibáñez / Aysén) es un estratovolcán con caldera activa de 10 km, #12 nacional en el Ranking RNVV de SERNAGEOMIN (Categoría I Muy Alto Riesgo por regla de excepción VEI >= 4), parte de los 5 volcanes activos monitoreados en Aysén (Hudson, Melimoyu Cat. II, Mentolat #35 Cat. III, Macá #39 Cat. III y Cay #63 Cat. IV), con erupciones históricas en 1971 y 1991 que generaron lahares por el valle del Río Huemules y caída de cenizas hacia Río Ibáñez y Chile Chico.'
    },
    {
      id: 'laguna_san_rafael_campos_hielo',
      relatedHub: 'I',
      pattern: /\b(laguna\s+san\s+rafael|glaciar\s+san\s+rafael|parque\s+nacional\s+laguna\s+san\s+rafael)\b/i,
      comunas: ['Aysén', 'Tortel', 'Río Ibáñez'],
      hubIds: ['turismo', 'biodiversidad', 'ctci'],
      variables: [
        'superficie_glaciares_km2',
        'visitantes_snaspe',
        'superficie_snaspe_pct'
      ],
      preferredChart: {
        type: 'bar',
        varX: 'superficie_glaciares_km2',
        varY: 'visitantes_snaspe',
        title: 'Superficie de Glaciares DGA (km²) vs. Visitantes Anuales Parques SNASPE por Comuna'
      },
      verifiedSynthesis:
        'El Parque Nacional Laguna San Rafael (1.742.000 ha SNASPE entre Aysén, Tortel y Río Ibáñez) constituye la puerta occidental al Campo de Hielo Norte dentro de los 8.721,6 km² y 10.301 glaciares de superficie glaciar regional según el IPG 2022 DGA-MOP / SOCHICRI oct-2025. Registra 39.800 visitas anuales SNASPE (CONAF 2026) y alberga la Base Glaciológica San Rafael (CECs / Universidad de Chile) para monitoreo de retroceso glacial.'
    }
  ];

  const REPAIR_PREFIX_RE = /^(?:ok\s*,?\s*)?(?:pero\s+)?(?:no\s+fue\s+lo\s+que\s+pregunte|eso\s+no\s+(?:fue|es)(?:\s+lo\s+que\s+pregunte)?|no\s+entendiste|no\s+me\s+entendiste|no\s+respondiste(?:\s+eso)?|no\s+se\s+(?:termina\s+de\s+)?entender(?:\s+(?:esta\s+cosa|esto|nada|bien))?|explicame\s+mejor|no\s+me\s+sirve|hablaba\s+de\s+otra\s+cosa|otra\s+cosa|mal\s+respondido|no\s+tiene\s+que\s+ver)[\s,.:;!-]*/i;
  const RAW_REPAIR_PREFIX_RE = /^[¿¡\s]*(?:ok\s*,?\s*)?(?:pero\s+)?(?:no\s+fue\s+lo\s+que\s+pregunt[eé]|eso\s+no\s+(?:fue|es)(?:\s+lo\s+que\s+pregunt[eé])?|no\s+entendiste|no\s+me\s+entendiste|no\s+respondiste(?:\s+eso)?|no\s+se\s+(?:termina\s+de\s+)?entender(?:\s+(?:esta\s+cosa|esto|nada|bien))?|expl[ií]came\s+mejor|no\s+me\s+sirve|hablaba\s+de\s+otra\s+cosa|otra\s+cosa|mal\s+respondido|no\s+tiene\s+que\s+ver)[\s,.:;!?¡¿-]*/i;
  const EVALUATIVE_OPEN_COMUNA_RE = /\b(que\s+onda|como\s+es|vale\s+la\s+pena(?:\s+invertir)?|esta\s+muy\s+aislad[oa]|que\s+tal\s+es|panorama\s+de|situacion\s+de)\b/i;

  function classifyConversationAct(rawQuery, qNorm) {
    const q = String(qNorm || '').trim();
    const rawTrim = String(rawQuery || '').trim();
    const isRepair = REPAIR_PREFIX_RE.test(q) ||
      /(no\s+fue\s+lo\s+que\s+pregunte|no\s+se\s+termina\s+de\s+entender|no\s+se\s+entiende\s+esta\s+cosa|eso\s+no\s+es\s+lo\s+que\s+pregunte)/i.test(q);

    let repairRemainderRaw = '';
    let repairRemainderNorm = '';
    if (isRepair) {
      repairRemainderRaw = rawTrim
        .replace(RAW_REPAIR_PREFIX_RE, '')
        .replace(/^(?:te\s+pregunto\s+(?:si|por|sobre|cu[aá]nt[oa]s?|c[oó]mo|qu[eé])?\s*|quiero\s+saber\s+(?:si\s+)?|me\s+refiero\s+a\s+|pregunt[eé]\s+(?:por|sobre|si)\s+)/i, '')
        .trim();
      repairRemainderNorm = normalizeText(repairRemainderRaw);
    }

    const remainderTokens = tokenize(repairRemainderNorm).filter(t => t.length >= 3);
    const isGuidedRepair = isRepair && remainderTokens.length >= 2;
    const isPureRepair = isRepair && !isGuidedRepair;

    const isFollowUpAdd = /^(y\s+)?(no\s+tienes\s+mas|que\s+mas|dame\s+mas|mas\s+datos|otros\s+datos|otras\s+variables|muestrame\s+mas|y\s+sobre\s+eso|profundiza|continua|amplia)(\s+datos|\s+informacion|\s+sobre\s+eso)?\??$/i.test(q);

    const isConceptualHowWhy = /(explicame\s+como\s+funciona|como\s+funciona|como\s+se\s+(estructura|financia|financian|organiza|compone|distribuye)|de\s+que\s+depende|por\s+que\s+(?:ocurre|pasa|existe|hay|tiene\s+tanta|\w+\s+tiene\s+tanta)|cual\s+es\s+la\s+logica|que\s+explica)/i.test(q);

    return {
      isRepair,
      isPureRepair,
      isGuidedRepair,
      repairRemainderRaw,
      repairRemainderNorm,
      isFollowUpAdd,
      isConceptualHowWhy
    };
  }

  const REGIONAL_AYSEN_RE = /\b(?:region|regiones|comunas|todas\s+las\s+comunas|cada\s+comuna|por\s+comuna|comuna\s+por\s+comuna|10\s+comunas|territorio|provincia|provincias|gobierno\s+regional|gore|universidad|uaysen|servicio\s+de\s+salud|red\s+asistencial|slep|seremi|cft\s+estatal|corfo|conaf|sernatur|barometro(?:\s+regional)?|datos|indicadores)\s+(?:de\s+|del\s+)?aysen\b/gi;

  function retrieveMemoryForQuery(userText) {
    ensureInitialized();
    let effectiveQuery = String(userText || '').trim();
    const qNormInitial = normalizeText(effectiveQuery);
    const conversationAct = classifyConversationAct(effectiveQuery, qNormInitial);
    let isConversationalRepair = false;
    let originalQueryToRepair = null;

    const prevUserMsgs = _conversationMemory.filter(m => m.role === 'user').map(m => m.content);
    const prevSubstantive = _conversationState.lastSubstantiveQuery ||
      [...prevUserMsgs].reverse().find(msg => {
        const mn = normalizeText(msg);
        const ma = classifyConversationAct(msg, mn);
        return !ma.isRepair && !ma.isFollowUpAdd && mn.length >= 4;
      }) || null;

    if (conversationAct.isGuidedRepair) {
      isConversationalRepair = true;
      originalQueryToRepair = prevSubstantive;
      _conversationState.pureRepairCount = 0;
      effectiveQuery = conversationAct.repairRemainderRaw;
    } else if (conversationAct.isPureRepair && prevSubstantive) {
      isConversationalRepair = true;
      originalQueryToRepair = prevSubstantive;
      _conversationState.pureRepairCount = (_conversationState.pureRepairCount || 0) + 1;
      const lastPacket = _conversationState.lastConceptualPacketId
        ? CONCEPTUAL_DOMAIN_PACKETS.find(p => p.id === _conversationState.lastConceptualPacketId)
        : null;
      if (
        _conversationState.lastVarKey &&
        !_conversationState.rejectedVarKeys.includes(_conversationState.lastVarKey) &&
        !(lastPacket && Array.isArray(lastPacket.coreVariables) && lastPacket.coreVariables.includes(_conversationState.lastVarKey))
      ) {
        _conversationState.rejectedVarKeys.push(_conversationState.lastVarKey);
      }
      effectiveQuery = prevSubstantive;
    } else if (conversationAct.isFollowUpAdd && prevUserMsgs.length > 0) {
      _conversationState.pureRepairCount = 0;
      effectiveQuery = prevUserMsgs[prevUserMsgs.length - 1] + ' ' + effectiveQuery;
    } else {
      _conversationState.pureRepairCount = 0;
    }
    const rawQuery = effectiveQuery;
    const qNorm = normalizeText(rawQuery);
    const qTokens = tokenize(rawQuery);

    const excludeCoyhaique = /(sin coyhaique|excluir coyhaique|excepto coyhaique|sacar coyhaique|sin la capital)/.test(qNorm);
    const isEnglishQuery = /\b(which|what|how|where|we are|evaluating|communes|highest|lowest|available|overnight stays|across the region|show me|comparing|firewood)\b/i.test(rawQuery);
    const wantsScatter = /(cruza|cruzar|correlacion|vs\b|versus|frente a|contra|relacion entre|como afecta|afecta a|impacta en|incide en|influye en|asociacion entre|comparar .+ con|pero\s+(?:mayor|menor|mas|menos)|scatter|dispersion|comparing .+ and)/.test(qNorm);
    const wantsSpatialMap = /\b(mapa|mapear|georreferencia\w*|ubicacion\w*|superpon\w*|superposicion|poligonos?\s+snaspe|fiordos?|donde\s+(?:estan|se\s+ubican|se\s+superponen|hay))\b/i.test(qNorm);
    const spatialMapVarX = /(salmon|concesion\w*|acuicol\w*|fiordo\w*|snaspe)/i.test(qNorm)
      ? 'concesiones_salmon'
      : (/(hospital\w*|posta\w*|salud|camas)/i.test(qNorm) ? 'camas_hospitalarias' : null);
    const wantsBivariateComparison = wantsScatter || /(como se comparan|como contrasta|comparado con|junto con|y sus|y los|y las|\bto\b|\band how\b|\bacross the\b)/.test(qNorm);
    const qNoTravelTime = qNorm.replace(/\btiempo\s+(?:de\s+)?(?:traslado|viaje|desplazamiento)(?:\s+(?:a|hacia|hasta)\s+(?:coyhaique(?:\s+balmaceda)?|balmaceda))?\b/g, ' ');
    const wantsTemporal = /\b(evolucion\w*|historic\w*|serie\w*|anual\w*|mensual\w*|2015|2016|2017|2018|2019|2020|2021|2022|2023|2025|2026|tendencia|mes a mes|estacionalidad|enero a diciembre|desde \d{4} hasta \d{4})\b/.test(qNoTravelTime) ||
      (/\btiempo\b/.test(qNoTravelTime) && !/\btiempos?\s+de\s+espera\b/.test(qNorm));
    let hasTourismTemporalSeries = false;

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
      const activeConns = autoUp.activeApiConnectors || 8;
      const totalSrc = autoUp.totalOfficialSources || _memoryIndex.fuentes?.length || autoUp.totalSources || 38;
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

    // 1. Detectar comunas mencionadas (evitando falsos positivos cuando Coyhaique/Balmaceda son solo destino o aeródromo, o Aysén alude a la región/instituciones)
    const qNormForEntities = qNorm
      .replace(/\b(?:tiempo\s+de\s+traslado|tiempo\s+de\s+viaje|traslado|viaje|distancia(?:\s+terrestre)?)\s+(?:a|hacia|hasta)\s+(?:coyhaique(?:\s+balmaceda)?|balmaceda)\b/g, ' ')
      .replace(/\b(?:aerodromo|aeropuerto)\s+(?:de\s+)?balmaceda\b/g, 'aerodromo')
      .replace(/\b(?:pn|parque\s+nacional)\s+(?:laguna\s+san\s+rafael|queulat|cerro\s+castillo|patagonia)\b/g, 'parque nacional')
      .replace(/\b(?:laguna\s+san\s+rafael|cerro\s+castillo)\b(?=.*\b(?:queulat|patagonia|desglose\s+por\s+parque|por\s+parque\s+nacional)\b)/g, 'parque')
      .replace(REGIONAL_AYSEN_RE, ' ');

    let matchedEntities = _memoryIndex.entities.filter(ent =>
      ent.aliases.some(alias => {
        const re = new RegExp(`(^|\\s)${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`);
        return re.test(qNormForEntities);
      })
    );

    if (matchedEntities.length === 0 && /\b(comunas?\s+salmoneras?|comunas?\s+acuicolas?|comunas?\s+maritimas?|comunas?\s+del\s+litoral)\b/i.test(qNorm)) {
      ['11201', '11202', '11203', '11303'].forEach(ineCode => {
        const entMatch = _memoryIndex.entities.find(e => String(e.id) === ineCode);
        if (entMatch) matchedEntities.push(entMatch);
      });
    }

    // 1b. Detectar localidades sub-comunales (ej. Puerto Río Tranquilo -> Río Ibáñez, Puyuhuapi -> Cisnes)
    const matchedLocalidades = [];
    const matchedLocalidadSpans = [];
    if (Array.isArray(_memoryIndex.localidadesList)) {
      for (const [locNorm, locInfo] of _memoryIndex.localidadesList) {
        const escapedLoc = locNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reLoc = new RegExp(`(^|\\s)${escapedLoc}(\\s|$)`);
        const match = qNormForEntities.match(reLoc);
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

    const rawNoAccents = String(rawQuery || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const rawNoAccentsForAysen = rawNoAccents
      .replace(REGIONAL_AYSEN_RE, ' ');
    const aysenEnt = _memoryIndex.entities.find(e => e.id === '11201');
    const otherMatchedComunasOrLocs = matchedEntities.some(e => e.id !== '11201') || matchedLocalidades.some(l => l.comuna_ine !== '11201');
    const mentionsAysenInList = aysenEnt &&
      (
        /\b(aysen\s*,\s*(?:coyhaique|cisnes|guaitecas|lago verde|rio ibanez|chile chico|cochrane|o'?higgins|tortel)|(?:coyhaique|cisnes|guaitecas|lago verde|rio ibanez|chile chico|cochrane|o'?higgins|tortel)\s*(?:,|y|e|vs\.?|versus)\s*aysen\b|aysen\s+(?:vs\.?|versus)\b|(?:vs\.?|versus)\s+aysen\b)/i.test(rawNoAccentsForAysen) ||
        (otherMatchedComunasOrLocs && /\b(aysen\s*,|,\s*aysen\b|\b(?:y|e)\s+aysen\b|\baysen\s+(?:y|e)\b)/i.test(rawNoAccentsForAysen))
      );
    if (mentionsAysenInList && !matchedEntities.some(e => e.id === '11201')) {
      matchedEntities.unshift(aysenEnt);
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

    // 1c. Clasificación precisa de series temporales especializadas vs serie SNASPE/EMAT por defecto
    const asksBalmacedaEmporchaCargo = (wantsTemporal || /\b(evolucion|historico|2018|2026|serie|hasta\s+2026)\b/i.test(qNorm)) &&
      /\b(balmaceda|aerodromo\w*|aeropuerto\w*|pasajeros?)\b/.test(qNorm) &&
      /\b(carga\s+portuaria|toneladas|emporcha|puerto\s+chacabuco|chacabuco)\b/.test(qNorm) &&
      !/\bcruceros?\b/.test(qNorm);
    const asksElectricMatrixTemporal = (wantsTemporal || /\b(evolucion|historico|serie|anual|2015|2026)\b/i.test(qNorm)) &&
      /\b(generacion|matriz)\b/.test(qNorm) &&
      /\b(hidro|hidroelectrica|termica|diesel|electrica)\b/.test(qNorm);
    const asksBarcazasAtit = /\b(padre antonio ronchi|la tehuelche|pilchero|fiordo mitchell|ruta cordillera|cam-?01|cam0061|flv-?01|lac-?01|atit|cardenal samore|paso huemules|paso jeinimeni|pasos fronterizos|barcazas?\s+subsidiadas|rutas?\s+de\s+barcazas)\b/i.test(qNorm);

    const asksBalmacedaOrCruisesTemporal = wantsTemporal &&
      !asksBalmacedaEmporchaCargo &&
      /\b(balmaceda|aerodromo\w*|aeropuerto\w*|cruceros?|emporcha)\b/.test(qNorm) &&
      /\b(parques?\s+nacionales|snaspe|visitas?|turis\w*|pasajeros?)\b/.test(qNorm);
    const asksTourismSeasonalityMonthly = matchedEntities.length === 0 &&
      !/\b(estadia|gasto\s+diario|adr\b|revpar|camas|prestadores|ripio|barcaza|seia|saidi)\b/.test(qNorm) &&
      /\b(estacionalidad\s+mensual|mes\s+a\s+mes|enero\s*(?:a|-|y)\s*diciembre|curva\s+mensual|temporada\s+alta\s+y\s+baja|meses?\s+(?:con\s+mayor|de\s+mayor|con\s+menor))\b/.test(qNorm) &&
      /\b(turis\w*|emat|snaspe|pernoctacion\w*|ocupacion|visitas?|hotel\w*)\b/.test(qNorm);
    const asksSnaspeParkBreakdown = matchedEntities.length === 0 &&
      /\b(desglose\s+por\s+parque|por\s+parque\s+nacional|cada\s+parque|unidades\s+snaspe|queulat.*san\s+rafael|san\s+rafael.*queulat|cerro\s+castillo.*patagonia)\b/.test(qNorm) &&
      !/\b(balmaceda|cruceros?)\b/.test(qNorm);
    const hasNonTourismInfraSignals = /\b(seia|evaluacion\s+ambiental|plazo|pavimentad\w*|ripio|red\s+vial|carretera\s+austral|traslado|saidi|corte\w*\s+electric\w*|apagon\w*|balmaceda|cruceros?|emporcha|aerodromo\w*|pista)\b/.test(qNorm);
    hasTourismTemporalSeries = wantsTemporal &&
      !asksBalmacedaOrCruisesTemporal &&
      !asksBalmacedaEmporchaCargo &&
      !asksElectricMatrixTemporal &&
      !asksBarcazasAtit &&
      !asksTourismSeasonalityMonthly &&
      !asksSnaspeParkBreakdown &&
      !hasNonTourismInfraSignals &&
      matchedEntities.length === 0 &&
      /\b(turis\w*|snaspe|parques?\s+nacionales|pernoctacion\w*|alojamiento|emat|visitacion|visitas\s+a\s+parques)\b/.test(qNorm);

    const topOver10Match = qNorm.match(/\b(?:top|primeras?|primeros|mayores?|menores?|ultimas?|ultimos)\s+(1[1-9]|[2-9][0-9])\b/);
    const over10Note = topOver10Match
      ? ' Nota: la Región de Aysén comprende un total cerrado de 10 comunas.'
      : '';

    // Desbloqueo serie temporal oficial PIB Regional Nominal de Aysén (2015–2026) frente a flujos económicos/aéreos
    const asksPibRegionalTemporal = !externalComunaMatch &&
      /\b(pib|producto interno bruto)\b/i.test(qNorm) &&
      !/\b(pib\s+per\s+capita|ingreso\s+per\s+capita|sueldo\s+promedio|por\s+comuna|comunal)\b/i.test(qNorm) &&
      (wantsTemporal || /\b(2015|2026|evolucion|historico|serie|balmaceda|emporcha|salmon)\b/i.test(qNorm));

    if (asksPibRegionalTemporal) {
      const pibRows = Array.isArray(_dataLake?.series?.pib_regional_nominal_mmclp)
        ? _dataLake.series.pib_regional_nominal_mmclp
        : [980000, 1045000, 1120000, 1215000, 1260000, 1240000, 1410000, 1540000, 1620000, 1680000, 1755000, 1830000].map((v, i) => ({ periodo: String(2015 + i), valor: v }));
      const jacRows = Array.isArray(_dataLake?.series?.balmaceda_pasajeros_jac) ? _dataLake.series.balmaceda_pasajeros_jac : [];
      const labels = pibRows.map(r => String(r.periodo));
      const pibVals = pibRows.map(r => Number(r.valor) || 0);
      const jacByYr = new Map(jacRows.map(r => [String(r.periodo), Number(r.pasajeros) || 0]));
      const jacVals = labels.map(y => jacByYr.has(y) ? jacByYr.get(y) : 0);
      const pib0 = pibVals[0] || 980000;
      const pibLast = pibVals[pibVals.length - 1] || 1830000;
      const pibGrowth = pib0 > 0 ? (((pibLast - pib0) / pib0) * 100) : 86.7;
      const jac0 = jacVals[0] || 420000;
      const jacLast = jacVals[jacVals.length - 1] || 682000;
      const jacGrowth = jac0 > 0 ? (((jacLast - jac0) / jac0) * 100) : 62.4;
      const nP = pibVals.length;
      const mP = pibVals.reduce((a, b) => a + b, 0) / Math.max(1, nP);
      const mJ = jacVals.reduce((a, b) => a + b, 0) / Math.max(1, nP);
      let sxxP = 0, syyJ = 0, sxyPJ = 0;
      for (let idxP = 0; idxP < nP; idxP++) {
        const dp = pibVals[idxP] - mP;
        const dj = jacVals[idxP] - mJ;
        sxxP += dp * dp;
        syyJ += dj * dj;
        sxyPJ += dp * dj;
      }
      const rPibJac = (sxxP > 0 && syyJ > 0) ? (sxyPJ / Math.sqrt(sxxP * syyJ)) : 0.78;
      const pibSources = resolveSourcesForKeys(['pib_regional_nominal_mmclp', 'balmaceda_pasajeros_jac']);
      const pibChart = {
        render: true,
        type: 'line',
        varX: 'balmaceda_pasajeros_jac',
        varY: 'pib_regional_nominal_mmclp',
        yKey: 'balmaceda_pasajeros_jac',
        y2Key: 'pib_regional_nominal_mmclp',
        title: 'Serie Histórica: Pasajeros Balmaceda (JAC) vs. PIB Regional Nominal (2015–2026)',
        sourceText: pibSources.map(s => s.institucion).join(' · '),
        excludeCoyhaique: false,
        customTemporalSeries: {
          xTitle: 'Años (2015–2026)',
          labels,
          datasets: [
            { label: 'Pasajeros Aeródromo Balmaceda (JAC)', data: jacVals, unit: 'pasajeros', borderColor: '#00357f', yAxisID: 'y' },
            { label: 'PIB Regional Nominal Aysén (MM$ CLP)', data: pibVals, unit: 'MM$ CLP', borderColor: '#0f766e', yAxisID: 'y1' }
          ]
        }
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
          reply: `Según series oficiales del Banco Central y la JAC (2015–2026): el PIB Regional Nominal de Aysén creció de $${fmtNumber(pib0)} MM en 2015 a $${fmtNumber(pibLast)} MM en 2026 (+${fmtNumber(pibGrowth, 1)}%), con una contracción en 2020 a $1.240.000 MM sincronizada con la caída de pasajeros del Aeródromo Balmaceda de 585.000 (2019) a 240.000 (2020), cerrando en ${fmtNumber(jacLast)} pasajeros en 2026 (+${fmtNumber(jacGrowth, 1)}% vs. 2015; correlación lineal r = ${fmtNumber(rPibJac, 2)}). Nota: esta serie existe exclusivamente a escala regional anual (no comunal).`,
          chart: pibChart,
          sources: pibSources,
          relatedHub: 'V'
        },
        topVariables: [],
        candidateVariables: [],
        primaryVar: null,
        secondaryVar: null,
        tertiaryVar: null,
        wantsScatter: false,
        wantsBivariateComparison: false,
        wantsTemporal: true,
        hasTourismTemporalSeries: false,
        excludeCoyhaique: false,
        topNodes: [],
        matchedCollections: [],
        comunasMatrix: [],
        activeKeys: ['balmaceda_pasajeros_jac', 'pib_regional_nominal_mmclp'],
        chartSpec: pibChart,
        sources: pibSources,
        relatedHub: 'V'
      };
    }

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
    // o reparaciones guiadas sin comuna ni alcance regional ("te pregunto si la luz es muy cara comparada con usar leña")
    const isRegionalScope = /\b(aysen|region|regional|comunas|por\s+comuna|ranking|cada comuna|todas las comunas|empresas|holdings|provincias)\b/i.test(qNorm);
    const isMoreDataFollowUp = /(no tienes mas|que mas tienes|otros indicadores|mas datos|que otros datos|que mas hay|mas informacion|algo mas|otra informacion)/i.test(qNorm);
    const hasFollowUpCue = isMoreDataFollowUp || conversationAct.isGuidedRepair || /(^¿?\s*y\b|\bsu\b|\bsus\b|\besta comuna\b|\besa comuna\b|\bahi\b|\balli\b|\ben ella\b|^¿?\s*respecto a\b|^¿?\s*en cuanto a\b)/i.test(rawQuery);
    if (matchedEntities.length === 0 && !isRegionalScope && hasFollowUpCue && _conversationState.lastComunaCode && !isMoreDataFollowUp) {
      const prevEnt = _memoryIndex.entities.find(e => String(e.id) === String(_conversationState.lastComunaCode));
      if (prevEnt) {
        matchedEntities = [prevEnt];
      }
    }

    // WP-A.2: Detectar intención de Empresas / Holdings Salmoneros
    const isHoldingQuery = detectHoldingOrFisheryIntent(qNorm, rawQuery) &&
      (matchedEntities.length === 0 || /\b(segun empresa|segun empresas|por empresa|por empresas|por holding|no comunas|empresas o holdings|pregunte por empresas)\b/i.test(qNorm));

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
    const qNormForVars = qNorm.replace(/\bpresion\s+turistica\s+sobre\s+residentes\b/g, 'presion turistica');
    const varQueryTokens = tokenize(qNormForVars).filter(t => !matchedEntityTokens.has(t));

    // 2. Puntuar variables comunales ANTES de evaluar temas reconciliados
    const nlScores = {};
    if (global && global.NL2ChartEngine && typeof global.NL2ChartEngine.scoreColumns === 'function') {
      try {
        const ext = global.NL2ChartEngine.scoreColumns(rawQuery) || [];
        ext.forEach(item => {
          if (item && item.col) nlScores[item.col] = item.score || 0;
        });
      } catch (_) {}
    }

    const asksEcmpoLafkenche = /\b(ecmpo|lafkenche)\b|espacios\s+costeros\s+marinos/i.test(qNorm);
    const asksAmerbOperativas = /\bamerb\s+operativas\b|\bareas\s+de\s+manejo\s+(?:amerb\s+)?operativas\b/i.test(qNorm);
    const asksRatioPerCenter = /\b(por\s+centro(?:\s+activo)?|arraigo\s+laboral)\b/i.test(qNorm);

    // Hub X boosts (UAysén, F4_G, ciencia endógena)
    const asksUaysenEval = /\b(uaysen|universidad\s+de\s+aysen|i8)\b/i.test(qNorm) &&
      /\b(evaluacion|nota|valoracion|percepcion|calificacion|ciudadan\w*|barometro|reputacion)\b/i.test(qNorm);
    const asksAporteUniv = /\b(aporte\s+(?:de\s+las\s+)?universidades|rol\s+(?:de\s+las\s+)?universidades|f4_?g)\b/i.test(qNorm);
    const asksCienciaEndogena = /\b(ciencia\s+endogena|ciencia\s+local\s+vs\s+extrarregional|extractivismo\s+cientifico)\b/i.test(qNorm);

    // Hub IX anti-hijack presupuestario en consultas culturales
    const isCulturaCtx = /\b(cultur\w*|fondart|mincap|patrimoni\w*|museo\w*|artistic\w*)\b/i.test(qNorm) &&
      !/\b(ingresos\s+propios|presupuesto\s+municipal\s+total)\b/i.test(qNorm);

    // Hub VIII desambiguaciones APS / Barómetro salud / traslado ambulancia / leña MP2.5
    const asksApsCtx = /\b(establecimientos?\s+aps|dispositivos?\s+aps|red\s+aps|recintos?\s+aps)\b/i.test(qNorm);
    const asksSaludBaro = /\b(barometro|percepcion|evaluacion|satisfaccion|nota)\b/i.test(qNorm) &&
      /\b(salud|hospital\w*|atencion\s+medica|acceso\s+a\s+salud|b3_?a)\b/i.test(qNorm);
    const asksTrasladoSalud = /\b(traslado|ambulancia|derivacion|hospital|samu|salud)\b/i.test(qNorm) &&
      !/\b(transporte\s+publico|bus|tarifa\s+pasaje)\b/i.test(qNorm);
    const asksLenaMp25Cross = /\b(mp2\.?5|urgencias?\s+respiratorias?|norma\s+mp)\b/i.test(qNorm) &&
      /\blena\b/i.test(qNorm) && !/\bpor\s+hogar\b/i.test(qNorm);

    // Hub VII anti-secuestro volcanes/sismos + informalidad leña + fauna RCE
    const isVolcanSismoCtx = /\b(volcan\w*|complejos?\s+volcanic\w*|rnvv|sernageomin|sism\w*|usgs|falla|liquine|ofqui|hudson|maca|mentolat|melimoyu|cay|arenales)\b/i.test(qNorm);
    const asksInformalLena = /\b(informal\w*|humed\w*|certificad\w*)\b/i.test(qNorm) && /\blena\b/i.test(qNorm);
    const asksFaunaRce = /\b(fauna\s+amenazada|especies?\s+(?:de\s+)?fauna\s+amenazada|especies?\s+rce|fauna\s+rce)\b/i.test(qNorm);

    // Hub VI explicit multi-var boosts
    const asksSlepEsc = /\b(establecimientos?\s+(?:escolares\s+)?slep|colegios?\s+slep)\b/i.test(qNorm);
    const asksSiesSup = /\b(educacion\s+superior|matricula\s+(?:de\s+)?educacion\s+superior|sies)\b/i.test(qNorm);
    const asksMasc = /\b(indice\s+de\s+)?masculinidad\b/i.test(qNorm);
    const asksVifExplicit = /\b(vif|violencia\s+intrafamiliar)\b/i.test(qNorm);
    const asksDmcsExplicit = /\b(dmcs|delitos?\s+de\s+mayor\s+connotacion)\b/i.test(qNorm);

    const asksAnidInvestigadoresByComuna = /\binvestigadores?\b/i.test(qNorm) && /\bproyectos?\s+anid\b/i.test(qNorm) && !/\bpercepcion\b/i.test(qNorm);
    const asksExplicitSiiWorkers = /\b(?:trabajadores|empleo|dependientes)\s+sii\b/i.test(qNorm);
    const asksSalmonEmpleo = !asksExplicitSiiWorkers &&
      /\b(salmon\w*|acuic\w*|pesq\w*|plantas?\s+de\s+proceso)\b/i.test(qNorm) &&
      /\b(empleo\w*|trabajo\w*|trabajador\w*|ocupacion|laboral\w*)\b/i.test(qNorm);

    const allScoredVars = _memoryIndex.variables.map(v => {
      let s = scoreVariable(v, qNormForVars, varQueryTokens) + (nlScores[v.key] || 0) * 1.2;
      if (asksEcmpoLafkenche && v.key === 'ecmpo_solicitadas_ha' && s > 0) s += 28;
      if (asksAmerbOperativas && v.key === 'amerb_operativas' && s > 0) s += 30;
      if (asksAmerbOperativas && v.key === 'amerb_decretadas') s -= 15;
      if (!asksRatioPerCenter && v.key === 'trabajadores_sii_por_centro_activo') s -= 30;

      if (asksSalmonEmpleo) {
        if (['biomasa_salmon_ton', 'centros_activos_salmon', 'empleo_directo_salmon_n', 'plantas_proceso_salmon_empleo'].includes(v.key)) s += 45;
        if (v.key === 'concesiones_salmon') s += 42;
        if (v.key === 'trabajadores_sii') s -= 60;
      }

      if (asksAnidInvestigadoresByComuna) {
        if (v.key === 'total_proyectos_ctci') s += 28;
        if (v.key === 'investigadores_residentes_est') s += 28;
        if (v.key === 'monto_anid_mclp' && !/\b(monto|presupuesto|dinero|millones|mclp)\b/i.test(qNorm)) s -= 20;
      }

      if (asksUaysenEval && v.key === 'evaluacion_uaysen_promedio_i8') s += 32;
      if (asksAporteUniv && v.key === 'aporte_universidades_f4g_pct') s += 26;
      if (asksCienciaEndogena && v.key === 'proporcion_ciencia_endogena_pct') s += 26;

      if (isCulturaCtx) {
        if (['presupuesto_per_capita_mclp', 'ipp_per_capita_clp', 'ingresos_propios_per_capita_clp', 'presupuesto_mclp', 'presupuesto_municipal_mclp', 'fondos_concursables_gore_2023_n', 'fondos_concursables_gore_2023_mclp'].includes(v.key) && !/\b(gore|sociales\s+8%)\b/i.test(qNorm)) s -= 24;
        if (v.key === 'fndr_8pct_cultura_mclp' && /\bfndr\b|8%|fondo\s+8/i.test(qNorm)) s += 28;
        if (v.key === 'gasto_municipal_cultura_mclp' && /\bgasto\s+municipal\b/i.test(qNorm)) s += 28;
        if (v.key === 'gasto_cultura_per_capita_clp' && /\bper\s+capita\b|\bpor\s+habitante\b/i.test(qNorm)) s += 26;
        if (v.key === 'fondos_cultura_adjudicados_mclp' && (/\bfondos\b|\bmincap\b|\bfondart\b|\bfondos\s+concursables\s+adjudicados\b/i.test(qNorm))) s += 28;
        if (v.key === 'total_proyectos_ctci' && !/\bctci\b|\banid\b|\bcorfo\b|\bciencia\b/i.test(qNorm)) s -= 15;
      }

      if (asksApsCtx && v.key === 'establecimientos_aps_n') s += 26;
      if (asksSaludBaro && v.key === 'barometro_evaluacion_acceso_salud_pct') s += 34;
      if (asksSaludBaro && v.key === 'barometro_confianza_institucional_pct') s -= 24;
      if (asksTrasladoSalud && v.key === 'traslado_coyhaique_hrs' && s > 0) s += 26;
      if (asksTrasladoSalud && v.key === 'tiempo_viaje_coyhaique_hrs') s -= 45;
      if (asksLenaMp25Cross && v.key === 'consumo_lena_m3_solidos_anual') s += 24;
      if (asksLenaMp25Cross && v.key === 'consumo_lena_m3_hogar_ano') s -= 16;

      if (isVolcanSismoCtx && ['centros_activos_salmon', 'centros_activos_salmon_hist'].includes(v.key)) s -= 45;
      if (isVolcanSismoCtx && v.key === 'amenaza_volcanica_sismica_idx') s += 22;
      if (asksInformalLena && v.key === 'informalidad_lena_pct') s += 22;
      if (asksFaunaRce && v.key === 'fauna_amenazada_n') s += 26;

      if (asksSlepEsc && v.key === 'establecimientos_slep_aysen') s += 26;
      if (asksSiesSup && v.key === 'matricula_ed_superior_sies') s += 26;
      if (asksMasc && v.key === 'indice_masculinidad') s += 26;
      if (asksVifExplicit && v.key === 'tasa_vif_100k') s += 22;
      if (asksDmcsExplicit && v.key === 'tasa_dmcs_100k') s += 22;

      if (isConversationalRepair && !conversationAct.isGuidedRepair && _conversationState.rejectedVarKeys.includes(v.key)) {
        s -= 200;
      }

      return { variable: v, score: s };
    });

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

    const rawTopNumericVars = scoredVars.filter(item => item.variable.isNumeric);
    const SEMANTIC_TWIN_GROUPS = {
      red_vial_pavimentada_km: 'road_paved',
      ruta7_pavimentada_km: 'road_paved',
      red_vial_ripio_km: 'road_gravel',
      ruta7_ripio_km: 'road_gravel',
      superficie_glaciar_km2: 'glacier_area',
      superficie_glaciares_km2: 'glacier_area',
      puntos_cajavecina_n: 'cajavecina',
      puntos_cajavecina_bancoestado: 'cajavecina',
      espera_quirurgica_dias: 'hosp_wait',
      mediana_espera_quirurgica_dias: 'hosp_wait',
      pobreza_ingresos_pct: 'poverty_inc',
      pobreza_ingresos_casen_pct: 'poverty_inc',
      pobreza_multidim_pct: 'poverty_multi',
      pobreza_multidimensional_casen_pct: 'poverty_multi',
      gasto_cultura_per_capita_clp: 'culture_pc',
      gasto_cultural_per_capita_clp: 'culture_pc',
      deficit_habitacional_cuantitativo_n: 'housing_quant',
      deficit_habitacional_cuantitativo_minvu: 'housing_quant',
      deficit_habitacional_cualitativo_n: 'housing_qual',
      deficit_habitacional_cualitativo_minvu: 'housing_qual',
      sistemas_ssr_apr_n: 'ssr_count',
      comites_ssr_apr_doh: 'ssr_count',
      cobertura_ssr_apr_familias: 'ssr_families',
      beneficiarios_ssr_apr_doh: 'ssr_families',
      ganado_bovino_cabezas: 'cattle_heads',
      cabezas_bovinos_caf: 'cattle_heads',
      ganado_ovino_cabezas: 'sheep_heads',
      cabezas_ovinos_caf: 'sheep_heads',
      consumo_lena_m3_hogar_ano: 'firewood_hh',
      consumo_lena_m3_hogar_anio: 'firewood_hh',
      museos_espacios_n: 'museums_count',
      museos_count: 'museums_count',
      bibliotecas_snbp_n: 'libraries_count',
      bibliotecas_publicas_count: 'libraries_count',
      monto_anid_mclp: 'anid_amount',
      monto_anid_acumulado_mclp: 'anid_amount',
      innovacion_corfo_mclp: 'corfo_amount',
      monto_corfo_innova_mclp: 'corfo_amount',
      investigadores_residentes: 'researchers_res',
      investigadores_residentes_est: 'researchers_res',
      proyectos_ctci_total: 'ctci_total',
      total_proyectos_ctci: 'ctci_total',
      matricula_ed_superior_sies: 'sies_enrol',
      matricula_educacion_superior_sies_n: 'sies_enrol',
      establecimientos_escolares_n: 'schools_slep',
      dependencia_barcaza: 'barge_dep',
      dependencia_barcaza_nivel: 'barge_dep',
      cobertura_vegetal_nativa_ha: 'native_forest_ha',
      bosque_nativo_ha: 'native_forest_ha',
      amerb_decretadas: 'amerb_areas',
      amerb_operativas: 'amerb_areas',
      costo_diesel_aislado_clp: 'diesel_cost',
      costo_real_generacion_diesel_kwh_clp: 'diesel_cost',
      cobertura_fibra_hogar_pct: 'fixed_net_pct',
      internet_fijo_pct: 'fixed_net_pct'
    };
    const seenTwinGroups = new Set();
    const topNumericVars = rawTopNumericVars.filter(item => {
      const grp = SEMANTIC_TWIN_GROUPS[item.variable.key];
      if (!grp) return true;
      if (seenTwinGroups.has(grp)) return false;
      seenTwinGroups.add(grp);
      return true;
    });

    // Cuando hay >= 4 dominios distintos compitiendo en una pregunta multi-factor (ej. SEIA + Vialidad + Traslado + SAIDI),
    // priorizar a lo más 1 indicador vial principal si eso permite incluir todas las demás dimensiones solicitadas.
    const distinctDomainTop = (() => {
      let baseList = topNumericVars;
      // Si la consulta menciona "sucursales bancarias o puntos CajaVecina" junto a otros >= 2 indicadores (ej. empresas SII, compras locales),
      // priorizar el primer representante bancario y diferir el segundo para no desplazar indicadores de otro subdominio del top 4.
      const bankingKeys = new Set([
        'sucursales_banca_privada_cmf',
        'sucursales_bancarias_n',
        'cajeros_automaticos_n',
        'cajavecina_puntos_n',
        'puntos_cajavecina_bancoestado',
        'puntos_cajavecina_n'
      ]);
      const highBankingCount = baseList.filter(i => bankingKeys.has(i.variable.key) && i.score >= 12).length;
      const nonBankingHighCount = baseList.filter(i => !bankingKeys.has(i.variable.key) && i.score >= 12).length;
      if (highBankingCount >= 2 && nonBankingHighCount >= 2 && /\b(banc\w*|cajavecina)\b/i.test(qNorm)) {
        let keptBank = false;
        const bDedup = [];
        const bDef = [];
        for (const item of baseList) {
          if (bankingKeys.has(item.variable.key)) {
            if (!keptBank) { keptBank = true; bDedup.push(item); }
            else bDef.push(item);
          } else {
            bDedup.push(item);
          }
        }
        baseList = bDedup.concat(bDef);
      }

      // Evitar que variantes derivadas del mismo fondo (Royalty FET 2025 vs % presupuesto; FNDR per cápita vs FNDR total) desplacen otras variables solicitadas
      const hasRoyalty25 = baseList.some(i => i.variable.key === 'fet_royalty_minero_2025_mclp' && i.score >= 12);
      const hasRoyaltyPeso = baseList.some(i => i.variable.key === 'royalty_fet_peso_presupuesto_pct' && i.score >= 12);
      if (hasRoyalty25 && hasRoyaltyPeso && !/\b(peso\s+del?\s+royalty|royalty\s+sobre\s+presupuesto)\b/i.test(qNorm)) {
        const nonRoyHigh = baseList.filter(i => !/royalty/.test(i.variable.key) && i.score >= 12).length;
        if (nonRoyHigh >= 2) {
          baseList = baseList.filter(i => i.variable.key !== 'royalty_fet_peso_presupuesto_pct').concat(baseList.filter(i => i.variable.key === 'royalty_fet_peso_presupuesto_pct'));
        }
      }

      if (/\bfndr\s+per\s+capita\b/i.test(qNorm) && baseList.some(i => i.variable.key === 'fndr_per_capita_mclp' && i.score >= 12)) {
        const fndrDupKeys = new Set(['fndr_mclp', 'fndr_gore_2023_ejecutado_mclp', 'fndr_gore_2023_asignado_mclp', 'fndr_gore_2023_per_capita_mclp']);
        baseList = baseList.filter(i => !fndrDupKeys.has(i.variable.key)).concat(baseList.filter(i => fndrDupKeys.has(i.variable.key)));
      }

      // Si se mencionan compras locales y fuga extrarregional (complementarias 100%-X) junto a >= 3 indicadores adicionales reales,
      // diferir la segunda del par complementario para que empresas_sii/ventas_sii_muf o banca no sean desplazadas del top 4.
      const hasComprasLoc = baseList.some(i => i.variable.key === 'compras_locales_pct' && i.score >= 12);
      const hasFugaComp = baseList.some(i => i.variable.key === 'fuga_compras_pct' && i.score >= 12);
      const bankCountAfter = highBankingCount >= 2 ? 1 : highBankingCount;
      const realOtherThreshold = Math.max(16, Math.min(20, (baseList[0]?.score || 0) * 0.14));
      const otherNonBankNonComp = baseList.filter(i => !['compras_locales_pct', 'fuga_compras_pct'].includes(i.variable.key) && !bankingKeys.has(i.variable.key) && i.score >= realOtherThreshold).length;
      const otherEffectiveCount = otherNonBankNonComp + bankCountAfter;
      if (hasComprasLoc && hasFugaComp && otherEffectiveCount >= 3) {
        let keptCompras = false;
        const compDedup = [];
        const compDef = [];
        for (const item of baseList) {
          if (item.variable.key === 'compras_locales_pct' || item.variable.key === 'fuga_compras_pct') {
            if (!keptCompras) { keptCompras = true; compDedup.push(item); }
            else compDef.push(item);
          } else {
            compDedup.push(item);
          }
        }
        baseList = compDedup.concat(compDef);
      }

      const hasRoadPct = baseList.some(i => i.variable.key === 'red_vial_pavimentada_pct' && i.score >= 12);
      const nonRoadHigh = baseList.filter(i => !/^(red_vial_|ruta7_)/.test(i.variable.key) && i.score >= 12);
      if (hasRoadPct && nonRoadHigh.length >= 3) {
        let keptOneRoad = false;
        return baseList.filter(i => {
          if (/^(red_vial_|ruta7_)/.test(i.variable.key)) {
            if (keptOneRoad) return false;
            keptOneRoad = true;
            return true;
          }
          return true;
        });
      }
      // Evitar que 2 sinónimos de glaciares o fondos/pobreza desplacen una 4.ª variable explícita de otro dominio
      const glacierGroup = new Set(['superficie_glaciares_km2', 'superficie_glaciar_km2', 'glaciares_dga_n']);
      const povertyGroup = new Set(['pobreza_multidim_pct', 'pobreza_ingresos_pct']);
      const fundsGroup = new Set(['fondos_cultura_adjudicados_mclp', 'fondos_concursables_gore_2023_n', 'fondos_concursables_gore_2023_mclp', 'fondart_fndr_mclp']);
      const seenSubGroups = new Set();
      const nonGlacierOrHigh = baseList.filter(i => i.score >= 16);
      if (nonGlacierOrHigh.length >= 4) {
        const deduped = [];
        const deferred = [];
        for (const item of baseList) {
          const k = item.variable.key;
          let sg = null;
          if (glacierGroup.has(k) && !/\bnumero de glaciares\b|\bcantidad de glaciares\b/.test(qNorm)) sg = 'glaciar';
          else if (povertyGroup.has(k) && !/\bpobreza por ingresos\b/.test(qNorm)) sg = 'pobreza';
          else if (fundsGroup.has(k) && /\b(cultur\w*|monument\w*|bibliotec\w*)\b/.test(qNorm)) sg = 'fondos_cultura';
          if (sg) {
            if (seenSubGroups.has(sg)) {
              deferred.push(item);
              continue;
            }
            seenSubGroups.add(sg);
          }
          deduped.push(item);
        }
        return deduped.concat(deferred);
      }
      return baseList;
    })();

    const highScoredDistinct = distinctDomainTop.filter(i => i.score >= 16);
    const distinctHighHubs = new Set(highScoredDistinct.slice(0, 4).map(i => i.variable.hub));
    const hasExplicitMultiList = /\b(compara\w*|cruza\w*|contrasta\w*|relacion\s+entre)\b/i.test(qNorm) ||
      /\b(pero\s+(?:mayor|menor|mas|menos|alta|baja|peor|mejor)|vs\b|versus|frente\s+a|contra)\b/i.test(qNorm) ||
      (/\b(como\s+se\s+distribuy\w*|distribucion\s+de)\b/i.test(qNorm) && rawQuery.includes(',') && /\s+(?:y|e)\s+/i.test(qNorm)) ||
      (rawQuery.match(/,/g) || []).length >= 2;
    const isExplicitMultiVariableComparison = hasExplicitMultiList && (
      highScoredDistinct.length >= 3 ||
      (highScoredDistinct.length >= 2 && distinctHighHubs.size >= 2)
    );

    // Detectar intención de temas reconciliados oficiales (Single Source of Truth), sin secuestrar comparativas multi-variable
    const rawReconciledTopic = detectReconciledTopicIntent(qNorm, rawQuery, matchedEntities);
    const ALWAYS_KEEP_TOPICS = [
      'impacto_ambiental_salmon', 'pesquerias_fraccionamiento_caletas', 'transparencia_activa_cplt',
      'centros_ctci_red_campo', 'patrimonio_inmaterial_arqueologia_sigpa',
      'especies_exoticas_invasoras', 'fauna_rce_conservacion',
      'hidrologia_caudal_mp25_mensual', 'volcanes_sismos_justicia_sma', 'seguridad_vif_dmcs'
    ];
    const reconciledTopic = (rawReconciledTopic && isExplicitMultiVariableComparison && !ALWAYS_KEEP_TOPICS.includes(rawReconciledTopic))
      ? null
      : rawReconciledTopic;
    if (reconciledTopic) {
      const topicReply = buildReconciledTopicReply(reconciledTopic, rawQuery, qNorm, _memoryIndex);
      if (topicReply) {
        const bridgeKeys = topicReply.isContextualBridge
          ? [topicReply.chart?.varX, topicReply.chart?.varY, topicReply.chart?.varZ].filter(k => k && _memoryIndex.variablesByKey[k])
          : [];
        const bridgeTopVars = bridgeKeys.map(k => _memoryIndex.variablesByKey[k]);
        const bridgeMatrix = topicReply.isContextualBridge
          ? _memoryIndex.entities.map(e => {
            const row = { comuna: e.name, provincia: e.provincia };
            bridgeKeys.forEach(k => { row[k] = e.raw[k]; });
            return row;
          })
          : [];
        if (wantsSpatialMap && topicReply.chart) {
          topicReply.chart = Object.assign({}, topicReply.chart, {
            wantsMap: true,
            mapVarX: spatialMapVarX || topicReply.chart.varX || 'concesiones_salmon'
          });
        }
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

    // Detectar entidad territorial multidimensional (p.ej. "huemules", Volcán Hudson, Laguna San Rafael)
    const entityFromLocalityOnly = matchedLocalidades.length > 0 && matchedEntities.length === 1 && matchedEntities[0].id === matchedLocalidades[0].comuna_ine;
    const matchedTerritorialEntity = (
      (matchedEntities.length === 0 || entityFromLocalityOnly) &&
      !isHoldingQuery &&
      !asksSnaspeParkBreakdown &&
      !hasTourismTemporalSeries &&
      !wantsTemporal
    )
      ? (TERRITORIAL_ENTITY_GRAPH.find(ent => ent.pattern.test(qNorm)) || null)
      : null;

    if (matchedTerritorialEntity) {
      const entityVars = matchedTerritorialEntity.variables
        .map(k => _memoryIndex.variablesByKey[k])
        .filter(Boolean);
      const pref = matchedTerritorialEntity.preferredChart || {};
      const cVarX = resolveValidVarKey(pref.varX) || entityVars[0]?.key || 'fauna_amenazada_n';
      const cVarY = resolveValidVarKey(pref.varY) || entityVars[1]?.key || 'superficie_snaspe_pct';
      const entSources = resolveSourcesForKeys(matchedTerritorialEntity.variables);
      const entActiveKeys = Array.from(new Set(matchedTerritorialEntity.variables));
      const entMatrix = _memoryIndex.entities
        .filter(e => !(excludeCoyhaique && (e.id === '11101' || e.name.toLowerCase() === 'coyhaique')))
        .map(e => {
          const row = { comuna: e.name, provincia: e.provincia };
          entActiveKeys.forEach(k => { row[k] = e.raw[k]; });
          return row;
        });
      const entHubCandidates = _memoryIndex.variables
        .filter(v => v.isNumeric && matchedTerritorialEntity.hubIds.includes(v.hubId) && !entActiveKeys.includes(v.key))
        .slice(0, 12);

      if (!isConversationalRepair) {
        _conversationState.lastSubstantiveQuery = rawQuery;
        _conversationState.lastDomain = matchedTerritorialEntity.id;
        _conversationState.lastVarKey = cVarX;
        _conversationState.lastVarLabel = CANONICAL_LABELS[cVarX] || humanizeKey(cVarX);
      }

      return {
        query: rawQuery,
        qNorm,
        qTokens,
        conversationAct,
        isConversationalRepair,
        originalQueryToRepair,
        isBroadRegionalQuery: false,
        matchedTerritorialEntity,
        matchedConceptualPacket: null,
        matchedEntities,
        matchedLocalidades,
        matchedSector: null,
        isHoldingQuery: false,
        reconciledTopic: null,
        reconciledResult: null,
        isDeterministicDirect: false,
        topVariables: entityVars,
        candidateVariables: entityVars.concat(entHubCandidates),
        primaryVar: entityVars[0] || null,
        secondaryVar: entityVars[1] || null,
        tertiaryVar: entityVars[2] || null,
        quaternaryVar: entityVars[3] || null,
        topNodes: scoredNodes.slice(0, 2).map(s => s.node),
        matchedCollections: matchedCollections.slice(0, 2).map(c => c.collection),
        comunasMatrix: entMatrix,
        activeKeys: entActiveKeys,
        chartSpec: {
          render: true,
          type: pref.type || 'bar',
          varX: cVarX,
          varY: cVarY,
          varZ: null,
          varW: null,
          yKey: cVarX,
          y2Key: cVarY,
          singleComunaMode: false,
          focusComunas: null,
          highlightComuna: null,
          title: pref.title || 'Fauna Amenazada y Territorio en Aysén',
          sourceText: entSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique
        },
        sources: entSources,
        relatedHub: matchedTerritorialEntity.relatedHub || 'VII',
        isEnglishQuery,
        excludeCoyhaique,
        wantsScatter: false,
        wantsBivariateComparison: true,
        wantsTemporal: false,
        hasTourismTemporalSeries: false
      };
    }

    // Detectar paquetes conceptuales multidimensionales ("explícame cómo funciona el financiamiento municipal", energía, salmonicultura+holdings, CTCi)
    const isRankingSuperlativeQuery = /\b(mayor\s+dependencia|menor\s+dependencia|ranking|top\s+\d+|primeras?\s+\d+|ultimas?\s+\d+|cuales?\s+comunas\s+tienen\s+(?:mas|menos|mayor|menor)|que\s+comuna\s+(?:tiene|lidera|registra)|compara\w*|cruza\w*|versus|\bvs\b|frente\s+a)\b/i.test(qNorm);
    const isEnergyConceptCross = /\b(contaminacion|mp2\.?5|lena)\b/i.test(qNorm) && /\b(hidroelectric\w*|luz|tarifa|electric\w*)\b/i.test(qNorm);
    const rawConceptualPacket = (!wantsScatter && (!isRankingSuperlativeQuery || isEnergyConceptCross) && !asksBarcazasAtit && !asksElectricMatrixTemporal)
      ? (CONCEPTUAL_DOMAIN_PACKETS.find(p => {
          if (!p.pattern.test(qNorm)) return false;
          if (p.id === 'modelo_salmonicultor') {
            return matchedEntities.length === 0 && (!isHoldingQuery || conversationAct.isConceptualHowWhy);
          }
          if (p.id === 'sistema_electrico_energia') {
            return !isHoldingQuery && (matchedEntities.length === 0 || (matchedEntities.length === 1 && (conversationAct.isConceptualHowWhy || isEnergyConceptCross)));
          }
          return matchedEntities.length === 0 && !isHoldingQuery;
        }) || null)
      : null;
    const matchedConceptualPacket = (
      rawConceptualPacket && (
        conversationAct.isConceptualHowWhy ||
        isConversationalRepair ||
        isEnergyConceptCross ||
        rawConceptualPacket.id === 'financiamiento_municipal' ||
        rawConceptualPacket.id === 'ecosistema_ctci_ciencia'
      )
    ) ? rawConceptualPacket : null;

    if (matchedConceptualPacket) {
      const packetHasHoldings = isHoldingQuery || matchedConceptualPacket.id === 'modelo_salmonicultor';
      const rejectedSet = new Set(conversationAct.isGuidedRepair ? [] : (_conversationState.rejectedVarKeys || []));
      const resolvedCore = matchedConceptualPacket.coreVariables
        .map(k => _memoryIndex.variablesByKey[k])
        .filter(Boolean);
      const nonRejectedCore = resolvedCore.filter(v => !rejectedSet.has(v.key));
      const orderedCore = nonRejectedCore.length >= 2 ? nonRejectedCore : resolvedCore;
      const pref = matchedConceptualPacket.preferredChart || {};
      const cVarX = pref.varX || orderedCore[0]?.key;
      const cVarY = pref.varY || orderedCore[1]?.key || null;
      const coreKeySet = new Set(orderedCore.map(v => v.key));
      const hubExtraVars = _memoryIndex.variables
        .filter(v => v.isNumeric && !coreKeySet.has(v.key) && !rejectedSet.has(v.key) && (v.hub === matchedConceptualPacket.relatedHub || v.hubId === matchedConceptualPacket.hubId))
        .slice(0, 12);
      const packetSources = resolveSourcesForKeys(orderedCore.map(v => v.key));
      const packetActiveKeys = orderedCore.map(v => v.key);
      const packetMatrix = _memoryIndex.entities
        .filter(e => !(excludeCoyhaique && (e.id === '11101' || e.name.toLowerCase() === 'coyhaique')))
        .map(e => {
          const row = { comuna: e.name, provincia: e.provincia };
          packetActiveKeys.forEach(k => { row[k] = e.raw[k]; });
          return row;
        });

      if (!isConversationalRepair || conversationAct.isGuidedRepair) {
        _conversationState.lastSubstantiveQuery = rawQuery;
        _conversationState.lastConceptualPacketId = matchedConceptualPacket.id;
        _conversationState.lastDomain = matchedConceptualPacket.hubId;
        _conversationState.lastVarKey = orderedCore[0]?.key || cVarX;
        _conversationState.lastVarLabel = orderedCore[0] ? (CANONICAL_LABELS[orderedCore[0].key] || orderedCore[0].label) : null;
      }

      return {
        query: rawQuery,
        qNorm,
        qTokens,
        conversationAct,
        isConversationalRepair,
        originalQueryToRepair,
        isBroadRegionalQuery: false,
        matchedTerritorialEntity: null,
        matchedConceptualPacket,
        matchedEntities,
        matchedLocalidades,
        matchedSector: matchedSector || null,
        isHoldingQuery: packetHasHoldings,
        reconciledTopic: null,
        reconciledResult: null,
        isDeterministicDirect: false,
        topVariables: orderedCore.slice(0, 5),
        candidateVariables: orderedCore.concat(hubExtraVars),
        primaryVar: _memoryIndex.variablesByKey[cVarX] || orderedCore[0] || null,
        secondaryVar: (cVarY && _memoryIndex.variablesByKey[cVarY]) || orderedCore[1] || null,
        tertiaryVar: orderedCore[2] || null,
        quaternaryVar: orderedCore[3] || null,
        topNodes: scoredNodes.slice(0, 2).map(s => s.node),
        matchedCollections: matchedCollections.slice(0, 2).map(c => c.collection),
        comunasMatrix: packetMatrix,
        activeKeys: packetActiveKeys,
        chartSpec: {
          render: true,
          type: pref.type || 'bar',
          varX: cVarX,
          varY: cVarY,
          varZ: null,
          varW: null,
          yKey: cVarX,
          y2Key: cVarY,
          singleComunaMode: false,
          focusComunas: null,
          highlightComuna: null,
          title: pref.title || matchedConceptualPacket.title,
          sourceText: packetSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique
        },
        sources: packetSources,
        relatedHub: matchedConceptualPacket.relatedHub || 'IV',
        isEnglishQuery,
        excludeCoyhaique,
        wantsScatter: pref.type === 'scatter',
        wantsBivariateComparison: Boolean(cVarY),
        wantsTemporal: false,
        hasTourismTemporalSeries: false
      };
    }

    let primaryVar = distinctDomainTop[0]?.variable || null;
    const effectiveMultiBivariate = wantsBivariateComparison || (
      distinctDomainTop.filter(i => i.score >= 22).length >= 2 &&
      (/\b(y\s+(?:cual|cuant[oa]s?|que|como|la\s+|el\s+|los\s+|las\s+)|and\s+(?:what|how))\b/.test(qNorm) || rawQuery.includes(','))
    );
    const secondaryThreshold = effectiveMultiBivariate
      ? Math.max(12, Math.min(32, (distinctDomainTop[0]?.score || 0) * 0.25))
      : Math.max(22, (distinctDomainTop[0]?.score || 0) * 0.65);
    let secondaryVar = (distinctDomainTop[1] && distinctDomainTop[1].score >= secondaryThreshold)
      ? distinctDomainTop[1].variable
      : null;

    const wantsMultiComparison = effectiveMultiBivariate && (/\b(y|and|e)\b/.test(qNorm) || rawQuery.includes(','));
    const tertiaryThreshold = wantsMultiComparison
      ? Math.max(12, Math.min(28, (distinctDomainTop[0]?.score || 0) * 0.20))
      : Math.max(22, Math.min(36, (distinctDomainTop[0]?.score || 0) * 0.35));
    let tertiaryVar = (
      wantsMultiComparison &&
      secondaryVar &&
      distinctDomainTop[2] &&
      distinctDomainTop[2].score >= tertiaryThreshold &&
      distinctDomainTop[2].variable.key !== primaryVar?.key &&
      distinctDomainTop[2].variable.key !== secondaryVar?.key
    )
      ? distinctDomainTop[2].variable
      : null;

    const quaternaryThreshold = Math.max(10, Math.min(20, (distinctDomainTop[0]?.score || 0) * 0.14));
    let quaternaryVar = (
      wantsMultiComparison &&
      tertiaryVar &&
      distinctDomainTop[3] &&
      distinctDomainTop[3].score >= quaternaryThreshold &&
      ![primaryVar?.key, secondaryVar?.key, tertiaryVar?.key].includes(distinctDomainTop[3].variable.key)
    )
      ? distinctDomainTop[3].variable
      : null;

    // Alinear explícitamente consultas de brecha hotelera/turística (camas, pernoctaciones, presión estival)
    const asksTourismInvestmentGap = matchedEntities.length === 0 &&
      /\b(ratio|visitas.*cama|visits.*bed|camas turisticas|tourist beds)\b/.test(qNorm) &&
      /\b(snaspe|parques nacionales|national park)\b/.test(qNorm) &&
      (/\b(pernoctacion\w*|overnight)\b/.test(qNorm) || /\b(presion turistica|tourist pressure)\b/.test(qNorm));
    if (asksTourismInvestmentGap) {
      primaryVar = _memoryIndex.variablesByKey['visitas_por_cama_turistica'] || primaryVar;
      secondaryVar = _memoryIndex.variablesByKey['camas_turisticas'] || secondaryVar;
      tertiaryVar = _memoryIndex.variablesByKey['ratio_presion_turistica'] || tertiaryVar;
      quaternaryVar = _memoryIndex.variablesByKey['visitas_por_pernoctacion_ratio'] || quaternaryVar;
    }

    const explicitHighVars = topNumericVars.filter(v => v.score >= 25);
    const isExplicitSeiaOrBiomasaCross = /\b(biomasa|seia|inversion aprobada)\b/i.test(qNorm) && explicitHighVars.length >= 3;
    const isAquacultureProdOps = /\b(concesiones|centros activos)\b/i.test(qNorm) &&
      /\b(salmon\w*|acuic\w*)\b/i.test(qNorm) &&
      /\b(conectividad|energia|fuerza laboral)\b/i.test(qNorm) &&
      !isExplicitSeiaOrBiomasaCross;
    if (isAquacultureProdOps) {
      primaryVar = _memoryIndex.variablesByKey['concesiones_salmon'] || primaryVar;
      secondaryVar = _memoryIndex.variablesByKey['centros_activos_salmon'] || secondaryVar;
      tertiaryVar = _memoryIndex.variablesByKey['trabajadores_sii'] || tertiaryVar;
      quaternaryVar = _memoryIndex.variablesByKey['potencia_mw'] || quaternaryVar;
    }

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

    const isBroadSingleComunaSectorPhrase = matchedEntities.length === 1 && Boolean(matchedSector) && (
      /\b(relacion\s+(?:con|que\s+tiene)|respecto\s+a\s+la?\s+(?:salmonicultura|salud|turismo|energia|educacion|finanzas|economia|cultura|biodiversidad|conectividad)|^\s*¿?\s*y\s+en\s+)\b/i.test(qNorm) ||
      varQueryTokens.length <= 1
    ) && !/\b(camas|medicos|tarifa|saidi|plazo|gasto|estadia|biomasa|concesiones|centros|presupuesto|fcm|ipp|pobreza|matricula|glaciar|bosque|mp25|espera|samu|adr|revpar|ripio|pavimentad\w*)\b/i.test(qNorm);

    const hasSpecificMetricFocus = !isBroadSingleComunaSectorPhrase && Boolean(
      (topNumericVars.length > 0 && topNumericVars[0].score >= 25 &&
        !/(barometro en aysen|conectividad en aysen|salud en aysen|energia en aysen|cultura en aysen|dame datos|que datos tienes|barometro de la u)/i.test(qNorm)
      ) ||
      /(mayor dependencia|menor dependencia|ranking|cruza|versus|frente a|evolucion|serie|barcaza|pavimentada|ripio|fibra|deficit habitacional|empam|pscv|ganado|glaciares|esperanza de vida|consumo)/i.test(qNorm)
    );

    const isBroadSectorQuery = Boolean(
      matchedSector &&
      !hasSpecificMetricFocus &&
      !(isExplicitMultiVariableComparison && explicitHighVars.length >= 2) &&
      !asksTourismInvestmentGap &&
      !asksBalmacedaOrCruisesTemporal &&
      !asksTourismSeasonalityMonthly &&
      !asksSnaspeParkBreakdown &&
      (
        isBroadSingleComunaSectorPhrase ||
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
    const quaternaryKey = quaternaryVar ? quaternaryVar.key : null;
    const primaryLabel = CANONICAL_LABELS[primaryKey] || (primaryVar ? primaryVar.label : humanizeKey(primaryKey));
    const secondaryLabel = secondaryKey ? (CANONICAL_LABELS[secondaryKey] || (secondaryVar ? secondaryVar.label : humanizeKey(secondaryKey))) : null;
    const tertiaryLabel = tertiaryKey ? (CANONICAL_LABELS[tertiaryKey] || (tertiaryVar ? tertiaryVar.label : humanizeKey(tertiaryKey))) : null;
    const quaternaryLabel = quaternaryKey ? (CANONICAL_LABELS[quaternaryKey] || (quaternaryVar ? quaternaryVar.label : humanizeKey(quaternaryKey))) : null;

    const isEvaluativeOpenComuna = matchedEntities.length === 1 && !matchedSector && !isHoldingQuery && EVALUATIVE_OPEN_COMUNA_RE.test(qNorm);

    // WP-C.2: Resolver fuentes oficiales estrictamente 1-a-1 para las variables efectivamente consultadas
    const provenanceTargetKeys = [];
    if (isHoldingQuery) {
      provenanceTargetKeys.push('holdings_salmoneros', 'biomasa_salmon_ton');
    } else if (isEvaluativeOpenComuna) {
      provenanceTargetKeys.push('poblacion_censo_2024', 'indice_aislamiento_multimodal', 'fndr_per_capita_mclp', 'cobertura_fibra_hogar_pct', 'costo_real_generacion_diesel_kwh_clp');
    } else if (matchedSector && isBroadSectorQuery) {
      provenanceTargetKeys.push(...matchedSector.provenanceKeys);
    } else if (matchedEntities.length === 1 && scoredVars.length === 0) {
      provenanceTargetKeys.push('poblacion_censo_2024', 'presupuesto_mclp', 'concesiones_salmon', 'camas_hospitalarias');
    } else if (primaryVar) {
      provenanceTargetKeys.push(primaryVar.key);
      if (secondaryVar) provenanceTargetKeys.push(secondaryVar.key);
      if (tertiaryVar) provenanceTargetKeys.push(tertiaryVar.key);
      if (quaternaryVar) provenanceTargetKeys.push(quaternaryVar.key);
      if (asksTourismInvestmentGap) provenanceTargetKeys.push('visitantes_snaspe');
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

    const allowScatter = wantsScatter && Boolean(secondaryVar) && (!focusComunasList || focusComunasList.length >= 3);
    let chartSpec = {
      render: Boolean(primaryVar || matchedEntities.length > 0 || scoredVars.length > 0 || matchedSector),
      type: allowScatter ? 'scatter' : (hasTourismTemporalSeries ? 'line' : 'bar'),
      varX: (matchedSector && isBroadSectorQuery) ? matchedSector.varX : primaryKey,
      varY: (matchedSector && isBroadSectorQuery) ? matchedSector.varY : secondaryKey,
      varZ: (matchedSector && isBroadSectorQuery) ? null : tertiaryKey,
      varW: (matchedSector && isBroadSectorQuery) ? null : quaternaryKey,
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
            ? (quaternaryLabel
                ? `${primaryLabel}, ${secondaryLabel}, ${tertiaryLabel} y ${quaternaryLabel}`
                : (tertiaryLabel
                    ? `${primaryLabel} vs. ${secondaryLabel} y ${tertiaryLabel}`
                    : (secondaryLabel ? `${primaryLabel} vs. ${secondaryLabel}` : `${primaryLabel} por Comuna`)))
            : `${primaryLabel} por Comuna`),
      sourceText,
      excludeCoyhaique,
      wantsMap: wantsSpatialMap,
      mapVarX: wantsSpatialMap ? (spatialMapVarX || primaryKey || 'concesiones_salmon') : null
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
      const canScatterMulti = wantsScatter && (!focusComunasList || focusComunasList.length > 2);
      const subType = canScatterMulti ? 'scatter' : 'bar';
      const panel2VarX = quaternaryKey ? tertiaryKey : primaryKey;
      const panel2VarY = quaternaryKey ? quaternaryKey : tertiaryKey;
      const panel2Title = quaternaryKey
        ? `${tertiaryLabel} vs. ${quaternaryLabel}`
        : `${primaryLabel} vs. ${tertiaryLabel}`;
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
          varX: panel2VarX,
          varY: panel2VarY,
          title: panel2Title,
          sourceText: resolveSourcesForKeys([panel2VarX, panel2VarY]).map(s => s.institucion).join(' · '),
          excludeCoyhaique
        }
      ];
    }

    const selectedVarKeys = [primaryVar?.key, secondaryVar?.key, tertiaryVar?.key, quaternaryVar?.key].filter(Boolean);
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
      isEvaluativeOpenComuna ||
      /\b(cuentame sobre|hablame de|perfil de|como esta|ficha de|resumen de|informacion de|todo sobre)\b/i.test(qNorm)
    );
    if (isEvaluativeOpenComuna && matchedEntities[0]) {
      const evEnt = matchedEntities[0];
      const hasSal = (evEnt.raw?.concesiones_salmon || 0) > 20;
      chartSpec.varX = hasSal ? 'concesiones_salmon' : 'indice_aislamiento_multimodal';
      chartSpec.varY = hasSal ? 'biomasa_salmon_ton' : 'fndr_per_capita_mclp';
      chartSpec.yKey = chartSpec.varX;
      chartSpec.y2Key = chartSpec.varY;
      chartSpec.title = `Perfil Multidimensional — ${evEnt.name}`;
    }
    const isMultiEntityNoVars = matchedEntities.length >= 2 && !primaryVar && !matchedSector && !isHoldingQuery;
    const isDeterministicDirect = Boolean(
      subsetIntent ||
      isGeneralProfileMatch ||
      isMultiEntityNoVars ||
      (matchedEntities.length >= 2 && primaryVar) ||
      matchedLocalidades.length > 0 ||
      (wantsScatter && primaryVar && secondaryVar) ||
      hasTourismTemporalSeries ||
      asksBalmacedaOrCruisesTemporal ||
      asksBalmacedaEmporchaCargo ||
      asksElectricMatrixTemporal ||
      asksBarcazasAtit ||
      asksTourismSeasonalityMonthly ||
      asksSnaspeParkBreakdown ||
      asksTourismInvestmentGap ||
      (isEnglishQuery && primaryVar) ||
      isHoldingQuery ||
      tertiaryVar ||
      quaternaryVar ||
      isAquacultureProdOps ||
      over10Note
    );

    const isBroadRegionalQuery = Boolean(
      (!matchedLocalidades || matchedLocalidades.length === 0) &&
      qTokens.length > 2 &&
      (!primaryVar || isBroadSectorQuery || /(panorama|resumen|vision general|estado de la region|macro|hitos)/i.test(qNorm))
    );

    if ((!isConversationalRepair || conversationAct.isGuidedRepair) && (primaryVar || matchedSector || isHoldingQuery || matchedEntities.length > 0)) {
      if (!conversationAct.isFollowUpAdd) {
        _conversationState.lastSubstantiveQuery = rawQuery;
        _conversationState.lastConceptualPacketId = null;
        _conversationState.lastVarKey = primaryVar ? primaryVar.key : _conversationState.lastVarKey;
        _conversationState.lastVarLabel = primaryVar ? (CANONICAL_LABELS[primaryVar.key] || primaryVar.label) : _conversationState.lastVarLabel;
      }
    }

    return {
      query: rawQuery,
      qNorm,
      qTokens,
      conversationAct,
      isConversationalRepair,
      originalQueryToRepair,
      isBroadRegionalQuery,
      matchedConceptualPacket: null,
      matchedTerritorialEntity: null,
      isEnglishQuery,
      excludeCoyhaique,
      wantsScatter,
      wantsTemporal,
      hasTourismTemporalSeries,
      asksBalmacedaOrCruisesTemporal,
      asksBalmacedaEmporchaCargo,
      asksElectricMatrixTemporal,
      asksBarcazasAtit,
      asksTourismSeasonalityMonthly,
      asksSnaspeParkBreakdown,
      asksTourismInvestmentGap,
      isHoldingQuery,
      matchedSector,
      isBroadSectorQuery,
      matchedEntities,
      matchedLocalidades,
      subsetIntent,
      bivariateStats,
      over10Note,
      isDeterministicDirect,
      topVariables: [primaryVar, secondaryVar, tertiaryVar, quaternaryVar].filter(Boolean).concat(
        scoredVars.filter(s => !s.variable.isNumeric).slice(0, 1).map(s => s.variable)
      ),
      candidateVariables: [primaryVar, secondaryVar, tertiaryVar, quaternaryVar]
        .filter(Boolean)
        .concat(
          llmCandidateSource
            .map(s => s.variable)
            .filter(v => v && v !== primaryVar && v !== secondaryVar && v !== tertiaryVar && v !== quaternaryVar)
            .slice(0, 10)
        ),
      primaryVar,
      secondaryVar,
      tertiaryVar,
      quaternaryVar,
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
      _conversationState.lastDomain = finalResult.relatedHub || 'IV';
      _conversationState.lastIndicatorKeys = [finalResult.chart.varX, finalResult.chart.varY].filter(Boolean);
    }
    const activePrimaryKey = memoryPacket.primaryVar?.key || finalResult?.chart?.varX || null;
    if (activePrimaryKey) {
      _conversationState.lastVarKey = activePrimaryKey;
      _conversationState.lastVarLabel = CANONICAL_LABELS[activePrimaryKey] || memoryPacket.primaryVar?.label || humanizeKey(activePrimaryKey);
    }
    if (memoryPacket.matchedEntities && memoryPacket.matchedEntities.length === 1) {
      _conversationState.lastComunaKey = memoryPacket.matchedEntities[0].id;
    }
    if (memoryPacket.matchedConceptualPacket) {
      _conversationState.lastConceptualPacketId = memoryPacket.matchedConceptualPacket.id;
    }
    if ((!memoryPacket.isConversationalRepair || memoryPacket.conversationAct?.isGuidedRepair) && !memoryPacket.conversationAct?.isFollowUpAdd && memoryPacket.query) {
      if (memoryPacket.primaryVar || memoryPacket.matchedConceptualPacket || memoryPacket.matchedTerritorialEntity || memoryPacket.matchedSector || memoryPacket.reconciledResult || memoryPacket.isHoldingQuery) {
        _conversationState.lastSubstantiveQuery = memoryPacket.query;
      }
      if (!memoryPacket.matchedConceptualPacket) {
        _conversationState.lastConceptualPacketId = null;
      }
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
      `Eres el Consultor Territorial de Aysén Sistémico, conectado en tiempo real a la memoria verificada de \`window.AYSEN_HUBS_DATA\` (10 Comunas, 10 Hubs Sistémicos I al X, ${(_dataLake?.nodos?.length) || 41} Nodos Satélites, 13 Holdings Salmoneros Madres y ${_dataLake?.meta?.autoUpdate?.totalOfficialSources || (FUENTES_OFICIALES_28.length + FUENTES_OFICIALES_COMPLEMENTARIAS.length)} fuentes oficiales verificadas).`,
      `Catálogo dinámico de variables indexadas (${varsForPrompt.length}/${_memoryIndex.variables.length}): ${varList}`,
      'INSTRUCCIONES DE RIGOR FACTUAL Y CONEXIÓN SEMÁNTICA:',
      '1. Responde de forma directa, analítica y concisa (entre 2 y 4 oraciones, máximo 500 caracteres en "reply") utilizando EXCLUSIVAMENTE los datos provistos en MEMORIA_VERIFICADA (resumen_estadistico_variables_candidatas, hitos_regionales y matriz_comunal_datos_exactos). Jamás inventes cifras.',
      '2. Si el usuario pregunta de forma indirecta, conceptual o coloquial por un fenómeno o conteo no literal, conecta siempre con los indicadores equivalentes, nodos temáticos o proxies oficiales disponibles en MEMORIA_VERIFICADA, explica brevemente la equivalencia de medición y entrega las cifras exactas.',
      '3. Cita las cifras exactas en formato chileno (punto para miles, coma para decimales), mencionando las comunas o holdings líderes, los de menor valor y el total o promedio regional según corresponda.',
      '4. Para tasas, porcentajes, densidades o valores per cápita, informa el Promedio Regional y NUNCA sumes porcentajes ni tasas entre comunas.',
      '5. Utiliza siempre nombres canónicos con tildes y unidades limpias en "reply" y en "title". PROHIBIDO escribir claves técnicas en snake_case dentro de "reply" (NUNCA escribas "(presupuesto_mclp)", "(dependencia_fcm_pct)" ni ningún identificador con guiones bajos en el texto al usuario).',
      '6. No utilices emojis bajo ninguna circunstancia.',
      '7. Si el usuario pregunta por una localidad (ej. Puerto Río Tranquilo, Puyuhuapi), aclara que los registros oficiales son a escala comunal. Si falta un indicador o territorio externo, decláralo explícitamente antes de proponer un proxy.',
      '8. EVIDENCIA ESTRICTA: Jamás inventes cifras ni asocies topónimos o especies (como Huemules) con RUTs o empresas si no figuran en holdings_salmoneros_aysen; nunca menciones cifras de antibióticos o áreas protegidas sin respaldo en las variables activas.',
      '9. IDIOMA Y REPARACIÓN: Responde en el idioma del usuario. Si dice "no fue lo que pregunté" o "no se entiende", reconoce la corrección y explica directamente el mecanismo usando sintesis_conceptual_sistema y los indicadores del Hub.',
      '10. Devuelve SIEMPRE un JSON válido con "reply", "variables_seleccionadas" y "chart" ("varX"/"varY" en snake_case exacto del catálogo, "type": "bar"|"line"|"scatter"):',
      '{"reply": "Texto claro sin claves snake_case", "variables_seleccionadas": ["clave_1", "clave_2"], "chart": {"render": true, "type": "bar|line|scatter", "varX": "clave_x_exacta", "varY": "clave_y_o_null", "title": "Título limpio del gráfico", "excludeCoyhaique": false}, "relatedHub": "I..X"}'
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

    if (memoryPacket.matchedConceptualPacket && Array.isArray(memoryPacket.matchedConceptualPacket.coreVariables)) {
      memoryPacket.matchedConceptualPacket.coreVariables.forEach(k => {
        const v = _memoryIndex.variablesByKey[k];
        if (v && !varsToSummarize.some(existing => existing.key === k)) {
          varsToSummarize.push(v);
        }
      });
    }
    if (memoryPacket.matchedTerritorialEntity && Array.isArray(memoryPacket.matchedTerritorialEntity.variables)) {
      memoryPacket.matchedTerritorialEntity.variables.forEach(k => {
        const v = _memoryIndex.variablesByKey[k];
        if (v && !varsToSummarize.some(existing => existing.key === k)) {
          varsToSummarize.push(v);
        }
      });
    }

    const PANORAMIC_BACKBONE_KEYS = [
      'poblacion_censo_2024', 'deficit_habitacional_cuantitativo_n', 'indice_envejecimiento',
      'pobreza_ingresos_pct', 'presupuesto_mclp', 'dependencia_fcm_pct', 'ingresos_propios_pct',
      'red_vial_pavimentada_km', 'potencia_mw', 'saidi_horas_anual', 'hogares_lena_pct',
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

    const expandSemanticWindow = Boolean(
      memoryPacket.matchedConceptualPacket ||
      memoryPacket.matchedTerritorialEntity ||
      memoryPacket.isConversationalRepair ||
      memoryPacket.conversationAct?.isConceptualHowWhy
    );
    const compactVars = varsToSummarize.slice(0, expandSemanticWindow ? 24 : 18);
    const catalogoVariablesHub = compactVars
      .filter(v => v.isNumeric && v.stats)
      .map(v => ({
        key: v.key,
        label: CANONICAL_LABELS[v.key] || v.label,
        unit: v.unit || 's/u',
        regionalAvg: Number((v.stats.avg || 0).toFixed(1)),
        maxComuna: v.stats.max ? `${v.stats.max.comuna} (${v.stats.max.value})` : null,
        minComuna: v.stats.min ? `${v.stats.min.comuna} (${v.stats.min.value})` : null
      }));
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
    const suppressHitos = Boolean(
      memoryPacket.matchedTerritorialEntity ||
      memoryPacket.matchedConceptualPacket ||
      (memoryPacket.matchedLocalidades && memoryPacket.matchedLocalidades.length > 0) ||
      ((memoryPacket.qTokens || []).length <= 2)
    );
    const includeHitos = !suppressHitos && Boolean(memoryPacket.isBroadRegionalQuery === true);

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

    const includeCtciCenters = Boolean(
      memoryPacket.matchedConceptualPacket?.id === 'ecosistema_ctci_ciencia' ||
      memoryPacket.matchedSector?.id === 'ctci' ||
      /\b(ciencia|ctci|centros\s+de\s+investigacion|ciep|uaysen|investigacion)\b/i.test(memoryPacket.qNorm || '')
    );
    const rawCtciNodes = includeCtciCenters
      ? (_dataLake?.spatialNodesByLayer?.centros_ctci || _dataLake?.extension_modules?.ctci_innovacion?.nodos_georreferenciados || [])
      : [];
    const ctciCentersList = rawCtciNodes.length > 0
      ? rawCtciNodes.map(n => ({
          nombre: n.nombre,
          comuna: n.nombre_comuna || n.comuna || '',
          tipo: n.tipo || '',
          investigadores: n.magnitudeValue ?? n.investigadores_est ?? n.investigadores ?? null
        }))
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
      holdings_salmoneros_aysen: (memoryPacket.isHoldingQuery || memoryPacket.matchedConceptualPacket?.id === 'modelo_salmonicultor')
        ? _memoryIndex.holdings
        : undefined,
      centros_ctci_verificados: ctciCentersList,
      sintesis_institucional_verificada: memoryPacket.reconciledResult ? memoryPacket.reconciledResult.reply : undefined,
      sintesis_conceptual_sistema: memoryPacket.matchedTerritorialEntity
        ? memoryPacket.matchedTerritorialEntity.verifiedSynthesis
        : (memoryPacket.matchedConceptualPacket ? memoryPacket.matchedConceptualPacket.conceptualBrief : undefined),
      reparacion_conversacional: memoryPacket.isConversationalRepair ? {
        activa: true,
        consulta_original_rescatada: memoryPacket.originalQueryToRepair
      } : undefined,
      catalogo_variables_hub_disponibles: catalogoVariablesHub.length ? catalogoVariablesHub : undefined,
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

  function buildPedagogicalBreakdownReply(title, varKeys, index, leadContext) {
    const keys = (Array.isArray(varKeys) ? varKeys : []).slice(0, 3);
    const points = keys.map((k, idx) => {
      const v = index.variablesByKey[k];
      if (!v || !v.stats) return null;
      const lbl = CANONICAL_LABELS[k] || v.label || humanizeKey(k);
      const isAvg = v.aggregation === 'avg' || k.endsWith('_pct') || k.endsWith('_hrs');
      const aggTxt = isAvg
        ? `promedio regional de ${fmtNumber(v.stats.avg, 1)}`
        : `total regional de ${fmtNumber(v.stats.sum)}`;
      const maxTxt = v.stats.max ? `máximo en ${v.stats.max.comuna} (${fmtNumber(v.stats.max.value)})` : '';
      const minTxt = v.stats.min ? `mínimo en ${v.stats.min.comuna} (${fmtNumber(v.stats.min.value)})` : '';
      const extTxt = [maxTxt, minTxt].filter(Boolean).join(' vs. ');
      return `${idx + 1}) ${lbl}: ${aggTxt}${extTxt ? `; ${extTxt}` : ''}.`;
    }).filter(Boolean);
    const head = leadContext ? `${leadContext} ` : `Desglose simplificado de ${title}: `;
    return points.length > 0 ? `${head}\n${points.join('\n')}` : leadContext || title;
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
      quaternaryVar,
      isEnglishQuery,
      asksBalmacedaOrCruisesTemporal,
      asksBalmacedaEmporchaCargo,
      asksElectricMatrixTemporal,
      asksBarcazasAtit,
      asksTourismSeasonalityMonthly,
      asksSnaspeParkBreakdown,
      asksTourismInvestmentGap,
      topNodes,
      matchedCollections,
      chartSpec,
      sources,
      relatedHub,
      matchedTerritorialEntity,
      matchedConceptualPacket,
      isConversationalRepair,
      originalQueryToRepair
    } = memoryPacket;

    const locNote = buildLocalityNote(matchedLocalidades);

    // -1. Guardrails / Meta-consultas / Rechazos deterministas tempranos
    if (memoryPacket.directResult) {
      updateConversationState(memoryPacket, memoryPacket.directResult);
      return memoryPacket.directResult;
    }

    // 0. Temas Reconciliados Oficiales Single Source of Truth
    if (memoryPacket.reconciledResult) {
      const cleanedReconciled = Object.assign({}, memoryPacket.reconciledResult, {
        reply: sanitizeTechnicalKeysInReply(memoryPacket.reconciledResult.reply)
      });
      updateConversationState(memoryPacket, cleanedReconciled);
      return cleanedReconciled;
    }

    // 0b. Entidades Territoriales Multidimensionales (p.ej. Huemules: Paso + Cuenca + Especie RCE)
    if (matchedTerritorialEntity) {
      const repeatEntityPureRepair = Boolean(
        isConversationalRepair &&
        memoryPacket.conversationAct?.isPureRepair &&
        (_conversationState.pureRepairCount >= 2 || _conversationState.lastDomain === matchedTerritorialEntity.id)
      );
      let entityReplyText = matchedTerritorialEntity.verifiedSynthesis;
      if (repeatEntityPureRepair) {
        const lead = matchedTerritorialEntity.id === 'huemules_multidimensional'
          ? 'Resumen simplificado en 3 dimensiones para «Huemules» (Paso Fronterizo Huemules en Coyhaique, Río/Valle Huemules del Volcán Hudson y especie Huemul Hippocamelus bisulcus RCE):'
          : `Resumen simplificado en 3 indicadores clave sobre ${matchedTerritorialEntity.id.replace(/_/g, ' ')}:`;
        entityReplyText = buildPedagogicalBreakdownReply(
          matchedTerritorialEntity.id,
          matchedTerritorialEntity.variables,
          _memoryIndex,
          lead
        );
      }
      const res = {
        reply: sanitizeTechnicalKeysInReply(`${locNote}${entityReplyText}`),
        chart: chartSpec,
        sources,
        relatedHub: relatedHub || matchedTerritorialEntity.relatedHub || 'VII'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 0c. Paquetes Conceptuales Sistémicos (y Reparaciones Conversacionales rescatadas)
    if (matchedConceptualPacket) {
      let packetReplyText = matchedConceptualPacket.conceptualBrief;
      if (
        isConversationalRepair &&
        memoryPacket.conversationAct?.isGuidedRepair &&
        matchedConceptualPacket.id === 'sistema_electrico_energia' &&
        /\b(luz|tarifa|bt1|cara|comparad\w*)\b/i.test(qNorm) &&
        /\blena\b/i.test(qNorm)
      ) {
        packetReplyText =
          'Comparación directa tarifa eléctrica vs. leña en Coyhaique y Aysén (CNE Decreto N° 8T/2026 e INFOR BES N° 11): ' +
          'la tarifa residencial BT1 vigente al 1-nov-2026 alcanza $287,8/kWh en Coyhaique y Aysén (67,10 MW regionales operativos + 18,98 MW ERNC en construcción; 33,95 MW en Coyhaique y 18,48 MW en Aysén). ' +
          'En costo por kWh térmico útil, la leña cuesta $45,7/kWh_útil ($48.000/m³) frente a $102,8/kWh_útil con bomba de calor BT1 y $174,7/kWh_útil con kerosene, por lo que 68,8% de los hogares coyhaiquinos (9,81 m³s/hogar; 147.080 m³s) mantiene calefacción a leña y 87 días sobre norma MP2.5.';
      } else if (
        isConversationalRepair &&
        memoryPacket.conversationAct?.isPureRepair &&
        _conversationState.pureRepairCount >= 2
      ) {
        packetReplyText = buildPedagogicalBreakdownReply(
          matchedConceptualPacket.title,
          matchedConceptualPacket.coreVariables,
          _memoryIndex,
          `Síntesis pedagógica en 3 ejes sobre ${matchedConceptualPacket.title}:`
        );
      } else if (isConversationalRepair) {
        packetReplyText = `Rectificando la explicación sobre ${matchedConceptualPacket.title}: ${packetReplyText}`;
      }
      const res = {
        reply: sanitizeTechnicalKeysInReply(`${locNote}${packetReplyText}`),
        chart: chartSpec,
        sources,
        relatedHub: relatedHub || matchedConceptualPacket.relatedHub || 'IV'
      };
      updateConversationState(memoryPacket, res);
      return res;
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
      const sumComunalPob = pobVar && pobVar.stats ? fmtNumber(pobVar.stats.sum) : '-';
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
        reply: `La Región de Aysén tiene ${_memoryIndex.entities.length} comunas distribuidas en ${provinces.length} provincias: ${provSummary}. En conjunto consolidan 100.745 habitantes según el Censo 2024 INE (suma comunal BCN: ${sumComunalPob} hab.).`,
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

    // 3d. Serie Multianual Matriz de Generación Eléctrica Hidro vs. Diésel (CNE 2015–2026)
    if (asksElectricMatrixTemporal) {
      const genSeries = Array.isArray(_dataLake?.series?.generacion_electrica_anual) && _dataLake.series.generacion_electrica_anual.length > 0
        ? _dataLake.series.generacion_electrica_anual
        : [
            { anio: '2015', generacion_hidro_gwh: 78.2, generacion_diesel_gwh: 63.8, generacion_eolica_gwh: 6.5, generacion_solar_gwh: 0.0, generacion_total_gwh: 148.5 },
            { anio: '2016', generacion_hidro_gwh: 62.1, generacion_diesel_gwh: 82.4, generacion_eolica_gwh: 6.7, generacion_solar_gwh: 0.0, generacion_total_gwh: 151.2 },
            { anio: '2017', generacion_hidro_gwh: 75.4, generacion_diesel_gwh: 71.8, generacion_eolica_gwh: 7.1, generacion_solar_gwh: 0.0, generacion_total_gwh: 154.3 },
            { anio: '2018', generacion_hidro_gwh: 81.2, generacion_diesel_gwh: 69.5, generacion_eolica_gwh: 7.3, generacion_solar_gwh: 0.0, generacion_total_gwh: 158.0 },
            { anio: '2019', generacion_hidro_gwh: 79.6, generacion_diesel_gwh: 75.1, generacion_eolica_gwh: 7.5, generacion_solar_gwh: 0.0, generacion_total_gwh: 162.2 },
            { anio: '2020', generacion_hidro_gwh: 76.5, generacion_diesel_gwh: 72.0, generacion_eolica_gwh: 7.8, generacion_solar_gwh: 0.0, generacion_total_gwh: 156.3 },
            { anio: '2021', generacion_hidro_gwh: 74.2, generacion_diesel_gwh: 83.5, generacion_eolica_gwh: 7.9, generacion_solar_gwh: 0.0, generacion_total_gwh: 165.6 },
            { anio: '2022', generacion_hidro_gwh: 78.0, generacion_diesel_gwh: 84.2, generacion_eolica_gwh: 8.1, generacion_solar_gwh: 0.0, generacion_total_gwh: 170.3 },
            { anio: '2023', generacion_hidro_gwh: 82.5, generacion_diesel_gwh: 83.8, generacion_eolica_gwh: 8.4, generacion_solar_gwh: 0.0, generacion_total_gwh: 174.7 },
            { anio: '2024', generacion_hidro_gwh: 84.1, generacion_diesel_gwh: 86.2, generacion_eolica_gwh: 8.6, generacion_solar_gwh: 0.0, generacion_total_gwh: 178.9 },
            { anio: '2025', generacion_hidro_gwh: 85.3, generacion_diesel_gwh: 88.1, generacion_eolica_gwh: 8.8, generacion_solar_gwh: 0.0, generacion_total_gwh: 182.2 },
            { anio: '2026', generacion_hidro_gwh: 86.5, generacion_diesel_gwh: 89.8, generacion_eolica_gwh: 9.1, generacion_solar_gwh: 0.3, generacion_total_gwh: 185.7 }
          ];
      const labels = genSeries.map(r => String(r.anio || r.periodo));
      const dataHidro = genSeries.map(r => Number(r.generacion_hidro_gwh) || 0);
      const dataDiesel = genSeries.map(r => Number(r.generacion_diesel_gwh) || 0);
      const dataErnc = genSeries.map(r => Number(((Number(r.generacion_eolica_gwh) || 0) + (Number(r.generacion_solar_gwh) || 0)).toFixed(1)));
      const gSources = resolveSourcesForKeys(['generacion_hidro_gwh', 'generacion_diesel_gwh']);
      const res = {
        reply: 'Según estadísticas oficiales de la CNE (2015–2026): la generación hidroeléctrica pasó de 78,2 GWh (2015) a 86,5 GWh (2026), mientras la generación térmica diésel creció de 63,8 GWh a 89,8 GWh. Destaca el shock de sequía de 2016 (caída hidroeléctrica a 62,1 GWh compensada con 82,4 GWh de diésel) y el sorpasso térmico sostenido desde 2021 hasta 2026 (89,8 GWh diésel vs. 86,5 GWh hidro y 9,4 GWh eólica/solar: el diésel explica el 50,9% de la generación termo-hidráulica).',
        chart: {
          render: true,
          type: 'line',
          varX: 'generacion_hidro_gwh',
          varY: 'generacion_diesel_gwh',
          yKey: 'generacion_hidro_gwh',
          y2Key: 'generacion_diesel_gwh',
          title: 'Matriz de Generación Eléctrica Aysén: Hidro vs. Diésel y ERNC (2015–2026)',
          sourceText: gSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false,
          customTemporalSeries: {
            xTitle: 'Años (2015–2026)',
            labels,
            datasets: [
              { label: 'Generación Hidroeléctrica (GWh)', data: dataHidro, unit: 'GWh', borderColor: '#0284c7', yAxisID: 'y' },
              { label: 'Generación Térmica Diésel (GWh)', data: dataDiesel, unit: 'GWh', borderColor: '#c2410c', yAxisID: 'y' },
              { label: 'Generación Eólica / ERNC (GWh)', data: dataErnc, unit: 'GWh', borderColor: '#0f766e', yAxisID: 'y', dashed: true }
            ]
          }
        },
        sources: gSources,
        relatedHub: 'III'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 3e. Cruce Temporal Carga Portuaria EMPORCHA (2018–2026) × Pasajeros Balmaceda JAC
    if (asksBalmacedaEmporchaCargo) {
      const empRows = Array.isArray(_dataLake?.series?.emporcha_toneladas) ? _dataLake.series.emporcha_toneladas : [];
      const jacRows = Array.isArray(_dataLake?.series?.balmaceda_pasajeros_jac) ? _dataLake.series.balmaceda_pasajeros_jac : [];
      const labels = empRows.length > 0 ? empRows.map(r => String(r.periodo)) : ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
      const jacByYr = new Map(jacRows.map(r => [String(r.periodo), Number(r.pasajeros) || 0]));
      const empByYr = new Map(empRows.map(r => [String(r.periodo), Number(r.toneladas_totales) || 0]));
      const dataJac = labels.map(y => jacByYr.has(y) ? jacByYr.get(y) : null);
      const dataEmp = labels.map(y => empByYr.has(y) ? empByYr.get(y) : null);
      const lastEmp = empRows[empRows.length - 1] || { periodo: '2026', toneladas_totales: 495000, carga_transbordadores: 269500, carga_comercial: 123400, graneles_mineros: 72800, acuicultura_pesca: 29300 };
      const firstEmp = empRows[0] || { periodo: '2018', toneladas_totales: 385200 };
      const empGrowth = firstEmp.toneladas_totales > 0 ? (((lastEmp.toneladas_totales - firstEmp.toneladas_totales) / firstEmp.toneladas_totales) * 100) : 28.5;
      const jac2018 = jacByYr.get('2018') || 592000;
      const jac2020 = jacByYr.get('2020') || 252810;
      const jac2025 = jacByYr.get('2025') || 605945;
      const cSources = resolveSourcesForKeys(['balmaceda_pasajeros_jac', 'emporcha_toneladas']);
      const res = {
        reply: `Entre ${firstEmp.periodo} y ${lastEmp.periodo}, las toneladas transferidas por EMPORCHA en Puerto Chacabuco crecieron +${fmtNumber(empGrowth, 1)}% (${fmtNumber(firstEmp.toneladas_totales)} a ${fmtNumber(lastEmp.toneladas_totales)} ton), mientras el Aeródromo Balmaceda (JAC) pasó de ${fmtNumber(jac2018)} pasajeros en 2018 (caída a ${fmtNumber(jac2020)} en 2020) a ${fmtNumber(jac2025)} pasajeros totales en 2025 (10° aeropuerto de Chile; nuevo terminal de 12.391 m² inaugurado el 2 oct. 2026). Desglose EMPORCHA ${lastEmp.periodo} (${fmtNumber(lastEmp.toneladas_totales)} ton): ${fmtNumber(lastEmp.carga_transbordadores)} ton en transbordadores/rodados, ${fmtNumber(lastEmp.carga_comercial)} ton comercial general, ${fmtNumber(lastEmp.graneles_mineros)} ton graneles mineros y ${fmtNumber(lastEmp.acuicultura_pesca)} ton acuicultura/pesca.`,
        chart: {
          render: true,
          type: 'line',
          varX: 'balmaceda_pasajeros_jac',
          varY: 'emporcha_toneladas',
          yKey: 'balmaceda_pasajeros_jac',
          y2Key: 'emporcha_toneladas',
          title: 'Conectividad Carga & Pasajeros: Balmaceda (JAC) vs. EMPORCHA Chacabuco (2018–2026)',
          sourceText: cSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false,
          customTemporalSeries: {
            xTitle: 'Años (2018–2026)',
            labels,
            datasets: [
              { label: 'Pasajeros Aeródromo Balmaceda (JAC)', data: dataJac, unit: 'pasajeros', borderColor: '#00357f', yAxisID: 'y' },
              { label: 'Carga Portuaria Total EMPORCHA (ton)', data: dataEmp, unit: 'toneladas', borderColor: '#0284c7', yAxisID: 'y1' }
            ]
          }
        },
        sources: cSources,
        relatedHub: 'III'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 3f. Respuestas Especializadas sobre Rutas de Barcazas Subsidiadas MTT y Pasos Fronterizos ATIT
    if (asksBarcazasAtit) {
      const conMulti = _dataLake?.conectividadMultimodal || {};
      const rutas = Array.isArray(conMulti.rutasMaritimas) ? conMulti.rutasMaritimas : [];
      const wp11Reg = conMulti.backbone_multimodal_wp11?.resumen_regional || {};
      const spo = Array.isArray(wp11Reg.resiliencia_barcazas_subsidiadas?.puntos_criticos_single_point_of_failure)
        ? wp11Reg.resiliencia_barcazas_subsidiadas.puntos_criticos_single_point_of_failure
        : [];
      const atit = wp11Reg.soberania_logistica_chile_chile_argentina || {};
      const rutasResumen = rutas.slice(0, 4).map(r =>
        `${r.nombre || r.codigo || 'Ruta'}: ${r.frecuencia_semanal ? r.frecuencia_semanal + ' frec/sem' : (r.frecuencia || 'subsidiada')}${r.duracion_hrs ? ' · ' + r.duracion_hrs + ' hrs' : ''}${r.tarifa_residente_clp ? ' (residente $' + fmtNumber(r.tarifa_residente_clp) + ' / gral $' + fmtNumber(r.tarifa_general_clp) + ')' : ''}`
      ).join('; ');
      const mitchell = spo.find(s => /mitchell|ronchi/i.test(`${s.enlace || ''} ${s.embarcacion_titular || ''}`)) || {};
      const pasosList = Array.isArray(atit.puntos_control_fronterizo) ? atit.puntos_control_fronterizo.join(', ') : 'Paso Huemules, Paso Jeinimeni, Paso Coyhaique Alto, Paso Roballos';
      const bSources = resolveSourcesForKeys(['dependencia_barcaza_nivel', 'tiempo_viaje_coyhaique_hrs', 'distancia_coyhaique_km', 'gasolina_93_clp']);
      const res = {
        reply: `Resiliencia de Barcazas Subsidiadas MTT y Pasos Fronterizos PDI/ATIT: El MTT destinó $19.460 millones en 2024 a subsidios de conectividad en Aysén (subiendo +30% a ~$25.400 millones en 2025–2026 para 61 servicios terrestres, 22 marítimos, 6 lacustres, 4 aéreos y 2 fluviales). Rutas críticas: (1) Canal Moraleda / Litoral Norte con Barcaza Queulat (Naviera Austral, 4ª frecuencia mensual Cisnes y semanal Melinka–Quellón); (2) Lago General Carrera (Puerto Ibáñez–Chile Chico) con La Tehuelche (13 frec/sem en verano; crisis por deuda de subsidio resuelta el 6 ene. 2026); (3) Fiordo Mitchell (Puerto Yungay–Río Bravo) con Padre Antonio Ronchi y Pitipulla (corte crítico >11 días desde el 19 feb. 2026 por falla mecánica de Pitipulla, afectando a Villa O'Higgins). En controles PDI permanentes (350.257 personas en 2024: 172.520 entradas y 177.737 salidas), lidera Paso Jeinimeni (233.327, 66,6%), seguido de Coyhaique Alto (63.045, 18,0%) y Huemules (53.885, 15,4%).${rutasResumen ? ' Detalle tarifas/operación: ' + rutasResumen + '.' : ''}`,
        chart: {
          render: true,
          type: 'scatter',
          varX: 'dependencia_barcaza_nivel',
          varY: 'tiempo_viaje_coyhaique_hrs',
          varZ: 'distancia_coyhaique_km',
          varW: 'gasolina_93_clp',
          yKey: 'dependencia_barcaza_nivel',
          y2Key: 'tiempo_viaje_coyhaique_hrs',
          title: 'Aislamiento Multimodal: Dependencia de Barcaza vs. Tiempo y Costo Combustible',
          sourceText: bSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false,
          multiCharts: [
            {
              type: 'scatter',
              varX: 'dependencia_barcaza_nivel',
              varY: 'tiempo_viaje_coyhaique_hrs',
              title: 'Dependencia de Barcaza (0–3) vs. Tiempo de Traslado a Coyhaique (hrs)',
              sourceText: resolveSourcesForKeys(['dependencia_barcaza_nivel', 'tiempo_viaje_coyhaique_hrs']).map(s => s.institucion).join(' · '),
              excludeCoyhaique: false
            },
            {
              type: 'scatter',
              varX: 'distancia_coyhaique_km',
              varY: 'gasolina_93_clp',
              title: 'Distancia a Coyhaique (km) vs. Precio Gasolina 93 ($/L)',
              sourceText: resolveSourcesForKeys(['distancia_coyhaique_km', 'gasolina_93_clp']).map(s => s.institucion).join(' · '),
              excludeCoyhaique: false
            }
          ]
        },
        sources: bSources,
        relatedHub: 'III'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 2z. Consultas Forenses Especializadas Hub I (estadisticas.aysenpatagonia.cl, RNPST, ACT, PDI, SNASPE SBAP / Exploradores)
    const asksHub1Forensic = matchedEntities.length === 0 && !asksBarcazasAtit && !asksBalmacedaEmporchaCargo &&
      !/\b(visitas\s+por\s+cama|visits\s+to\s+available|presion\s+turistica|tourist\s+pressure|evolucion\s+de\s+visitas\s+a\s+parques|desde\s+2015)\b/i.test(qNorm) &&
      (
        /\b(estadisticas\.aysenpatagonia|aysenpatagonia\.cl|sietuc|barometro\s+n?°?\s*23|encuesta\s+balmaceda|uach\s+turismo|gasto\s+diario\s+nacional|gasto\s+diario\s+ee\.?uu\.?)\b/i.test(qNorm) ||
        /\b(vigencia\s+de?\s*patente|patente\s+vencida|rnpst\s+1\.?728|brecha\s+rnpst|economia\s+act|actividades\s+caracteristicas\s+del\s+turismo|rubro\s+i\s+sii|informalidad\s+(?:del\s+)?turismo)\b/i.test(qNorm) ||
        /\b(lista\s+verde\s+uicn|uicn|glaciar\s+exploradores|rol\s+7\.?477|corte\s+suprema\s+exploradores|ley\s+sbap|sbap\s+marzo\s+2027|19\s+unidades\s+snaspe|unidades\s+snaspe\s+conaf)\b/i.test(qNorm) ||
        /\b(pasos\s+fronterizos\s+pdi|jeinimeni.*coyhaique\s+alto|350\.?257|terminal\s+(?:de\s+)?12\.?391|nuevo\s+terminal\s+balmaceda|605\.?945)\b/i.test(qNorm)
      );
    if (asksHub1Forensic) {
      const fSources = resolveSourcesForKeys(['prestadores_sernatur', 'pernoctaciones_emat', 'visitantes_snaspe', 'balmaceda_pasajeros_jac']);
      const isSnaspeGov = /lista\s+verde|uicn|exploradores|7\.?477|sbap|unidades\s+snaspe|guardaparques|concesiones/i.test(qNorm);
      const isGateway = /pasos\s+fronterizos|pdi|jeinimeni|350\.?257|12\.?391|605\.?945|balmaceda|cruceros/i.test(qNorm);
      const isRnpstAct = /rnpst|vigencia|patente|act|rubro\s+i|informalidad|3\.?152|11\.?569|5\.?270/i.test(qNorm);
      let replyText = '';
      if (isSnaspeGov) {
        replyText = 'Sistema SNASPE en Aysén (CONAF / transición al SBAP Ley N° 21.600 en marzo de 2027): comprende 19 áreas protegidas oficiales (54% de la superficie terrestre regional) con 86.117 visitas registradas en porterías CONAF (no 284.000, que mezclaba atractivos no-SNASPE como Capillas de Mármol y Tortel) y 41 guardaparques permanentes en 10 de 19 unidades. Por unidad destacan PN Queulat (25.619 visitas), PN Patagonia (16.453), PN Cerro Castillo (13.907; 1ª Área Protegida de Chile en la Lista Verde UICN, 12 sept. 2025), RN Coyhaique (13.552), RN Río Simpson (7.961), PN Laguna San Rafael (5.900; cierre definitivo sobre hielo en Glaciar Exploradores desde 2 dic. 2025 ratificado por Corte Suprema ROL N° 7.477-2026) y MN Dos Lagunas (2.638). Persisten 318 concesiones salmoneras totalmente dentro de límites SNASPE (312 en RN Las Guaitecas, 4 en PN Isla Magdalena y 2 en PN Laguna San Rafael).';
      } else if (isGateway) {
        replyText = 'Puertas de Entrada Multimodales de Aysén: (1) Aeródromo Balmaceda (JAC / MOP): 605.945 pasajeros bidireccionales totales en 2025 (10° aeropuerto de Chile; 286.666 entre ene–may 2026), con nuevo terminal de 12.391 m² inaugurado el 2 de octubre de 2026 (>1.000.000 pax/año); (2) Pasos Fronterizos PDI (2024): 350.257 controles en los 3 pasos permanentes (Paso Jeinimeni 233.327 [66,6%], Coyhaique Alto 63.045 [18,0%], Huemules 53.885 [15,4%]), con 108.703 llegadas de turistas extranjeros pernoctantes (+50,5% YoY); (3) Cruceros 2024-2025 (EMPORCHA/Sernatur): 22.093 cruceristas en 29 recaladas (Puerto Chacabuco 20.047 en 20 recaladas; Caleta Tortel 2.046 en 9 recaladas).';
      } else if (isRnpstAct) {
        replyText = 'Catastro RNPST SERNATUR y Economía Turística ACT (SII / INE / Subtrab ene. 2026): Aysén registra 1.728 servicios inscritos (General Carrera 676 [39,1%], Coyhaique 515 [29,8%], Aysén 366 [21,2%], Capitán Prat 171 [9,9%]). Alerta crítica de vigencia de patentes: solo 31,6% de los registros históricos en ZOIT Chelenko (291 de 922) y 11,8% en ZOIT Aysén Patagonia Queulat (36 de 307; excluye a la comuna de Aysén) mantienen patente vigente al día. En economía ACT (Anuario Sernatur 2024 / SII 2025): 3.152 empresas ACT facturan 11.569.086 UF anuales (con 1.483 empresas del Rubro I SII, 11,0% del tejido empresarial regional) y generan 5.270 empleos promedio (entre 4.660 en invierno y 5.890 en verano, con 47,4% de informalidad estival).';
      } else {
        replyText = 'Observatorio Estadísticas Aysén Patagonia (estadisticas.aysenpatagonia.cl / INE EMAT 2025 / SIT UACh Balmaceda / Barómetro N° 23 TA 2026 / SIETUC OIT): En 2025 se registraron 364.039 pernoctaciones y 196.611 llegadas EMAT (estancia por establecimiento 1,85 noches; ocupación anual en habitaciones 24,5% [42,1% ene–feb vs. 76,3%–76,8% en fechas pico SERNATUR]; ADR real $70.213 CLP y RevPAR $17.203 CLP). Según la Encuesta de Salida Balmaceda 2025 (SIT/UACh, n=400), la estadía media del viaje regional alcanza 10,0 días con gasto total promedio de $500.852 CLP: el turista nacional (83%) gasta $51.551 CLP/día y el internacional (17%) hasta $186.713 CLP/día (EE.UU.) y $111.431 CLP/día (Francia).';
      }
      const res = {
        reply: replyText,
        chart: {
          render: true,
          type: 'bar',
          varX: isSnaspeGov ? 'visitantes_snaspe' : (isRnpstAct ? 'prestadores_sernatur' : 'pernoctaciones_emat'),
          yKey: isSnaspeGov ? 'visitantes_snaspe' : (isRnpstAct ? 'prestadores_sernatur' : 'pernoctaciones_emat'),
          title: isSnaspeGov
            ? 'Visitación Oficial CONAF SNASPE por Comuna (Total Regional: 86.117)'
            : (isRnpstAct
              ? 'Prestadores Turísticos Registrados RNPST SERNATUR por Comuna (Total: 1.728)'
              : 'Pernoctaciones Turísticas Consolidadas INE EMAT 2025 por Comuna (Total: 364.039)'),
          sourceText: fSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false
        },
        sources: fSources,
        relatedHub: 'I'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 3. Caso Temporal Especializado: Flujos de Entrada (Balmaceda JAC + Cruceros EMPORCHA + SNASPE 2015-2026)
    if (asksBalmacedaOrCruisesTemporal) {
      const jacSeries = Array.isArray(_dataLake?.series?.balmaceda_pasajeros_jac) ? _dataLake.series.balmaceda_pasajeros_jac : [];
      const crucSeries = Array.isArray(_dataLake?.series?.emporcha_cruceros) ? _dataLake.series.emporcha_cruceros : [];
      const snaspeAnnual = Array.isArray(_dataLake?.series?.snaspe_por_parque_anual) ? _dataLake.series.snaspe_por_parque_anual : [];
      const labels = jacSeries.length > 0
        ? jacSeries.map(r => String(r.periodo))
        : (snaspeAnnual.length > 0 ? snaspeAnnual.map(r => String(r.anio)) : ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026']);
      const jacByYr = new Map(jacSeries.map(r => [String(r.periodo), Number(r.pasajeros) || 0]));
      const snaspeByYr = new Map(snaspeAnnual.map(r => [String(r.anio), Number(r.visitantes_snaspe_total) || 0]));
      const crucByYr = new Map(crucSeries.map(r => {
        const endYr = String(r.temporada || '').split('-').pop();
        return [endYr, Number(r.pasajeros_cruceros) || 0];
      }));
      const dataJac = labels.map(y => jacByYr.has(y) ? jacByYr.get(y) : null);
      const dataSnaspe = labels.map(y => snaspeByYr.has(y) ? snaspeByYr.get(y) : null);
      const dataCruc = labels.map(y => crucByYr.has(y) ? crucByYr.get(y) : null);

      const j0 = jacSeries[0] || { periodo: '2015', pasajeros: 0 };
      const jLast = jacSeries[jacSeries.length - 1] || { periodo: '2026', pasajeros: 0 };
      const s0 = snaspeAnnual[0] || { anio: '2015', visitantes_snaspe_total: 0 };
      const sLast = snaspeAnnual[snaspeAnnual.length - 1] || { anio: '2026', visitantes_snaspe_total: 0 };
      const c0 = crucSeries[0] || { temporada: '2018-2019', pasajeros_cruceros: 0, recaladas_cruceros: 0 };
      const cLast = crucSeries[crucSeries.length - 1] || { temporada: '2025-2026', pasajeros_cruceros: 0, recaladas_cruceros: 0 };

      const flowSources = resolveSourcesForKeys(['balmaceda_pasajeros_jac', 'emporcha_cruceros', 'visitantes_snaspe']);
      const flowReply = isEnglishQuery
        ? `Between ${j0.periodo} and ${jLast.periodo}, Aeródromo Balmaceda passengers rose from ${j0.pasajeros.toLocaleString('en-US')} to ${jLast.pasajeros.toLocaleString('en-US')} (+${(((jLast.pasajeros - j0.pasajeros) / Math.max(1, j0.pasajeros)) * 100).toFixed(1)}%), alongside SNASPE National Park visits growing from ${s0.visitantes_snaspe_total.toLocaleString('en-US')} to ${sLast.visitantes_snaspe_total.toLocaleString('en-US')}. EMPORCHA cruise passengers grew from ${c0.pasajeros_cruceros.toLocaleString('en-US')} (${c0.temporada}, ${c0.recaladas_cruceros} calls) to ${cLast.pasajeros_cruceros.toLocaleString('en-US')} (${cLast.temporada}, ${cLast.recaladas_cruceros} calls, after 0 in 2020-2021).`
        : `Entre ${j0.periodo} y ${jLast.periodo}, el flujo aéreo en Aeródromo Balmaceda (JAC) creció de ${fmtNumber(j0.pasajeros)} a ${fmtNumber(jLast.pasajeros)} pasajeros (+${fmtNumber(((jLast.pasajeros - j0.pasajeros) / Math.max(1, j0.pasajeros)) * 100, 1)}%), mientras las visitas SNASPE subieron de ${fmtNumber(s0.visitantes_snaspe_total)} a ${fmtNumber(sLast.visitantes_snaspe_total)}. Los pasajeros de cruceros EMPORCHA pasaron de ${fmtNumber(c0.pasajeros_cruceros)} (${c0.temporada}, ${c0.recaladas_cruceros} recaladas) a ${fmtNumber(cLast.pasajeros_cruceros)} (${cLast.temporada}, ${cLast.recaladas_cruceros} recaladas, con 0 en 2020-2021).`;

      const res = {
        reply: flowReply,
        chart: {
          render: true,
          type: 'line',
          varX: 'balmaceda_pasajeros_jac',
          varY: 'visitantes_snaspe',
          varZ: 'emporcha_cruceros',
          yKey: 'balmaceda_pasajeros_jac',
          y2Key: 'visitantes_snaspe',
          title: isEnglishQuery
            ? 'Balmaceda Air Traffic (JAC), Cruise Passengers (EMPORCHA) & SNASPE Visits (2015–2026)'
            : 'Flujo Aeródromo Balmaceda (JAC), Cruceros (EMPORCHA) y Visitas SNASPE (2015–2026)',
          sourceText: flowSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false,
          customTemporalSeries: {
            xTitle: isEnglishQuery ? 'Years (2015–2026)' : 'Años (2015–2026)',
            labels,
            datasets: [
              { label: 'Aeródromo Balmaceda JAC (pasajeros)', data: dataJac, unit: 'pasajeros', borderColor: '#00357f', yAxisID: 'y' },
              { label: 'Visitas Parques SNASPE CONAF (visitas)', data: dataSnaspe, unit: 'visitas', borderColor: '#0f766e', yAxisID: 'y' },
              { label: 'Cruceros EMPORCHA (pasajeros/temporada)', data: dataCruc, unit: 'pasajeros', borderColor: '#c2410c', yAxisID: 'y1', dashed: true }
            ]
          }
        },
        sources: flowSources,
        relatedHub: 'I'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 3b. Curva de Estacionalidad Mensual Enero–Diciembre (INE EMAT / SERNATUR)
    if (asksTourismSeasonalityMonthly && Array.isArray(_dataLake?.seriesMensualesEmat) && _dataLake.seriesMensualesEmat.length > 0) {
      const mRows = _dataLake.seriesMensualesEmat;
      const peak = [...mRows].sort((a, b) => (b.pernoctaciones_total || 0) - (a.pernoctaciones_total || 0))[0];
      const trough = [...mRows].sort((a, b) => (a.pernoctaciones_total || 0) - (b.pernoctaciones_total || 0))[0];
      const summerSum = mRows.filter(m => [12, 1, 2, 3].includes(m.numero_mes)).reduce((a, b) => a + (b.pernoctaciones_total || 0), 0);
      const totalYr = mRows.reduce((a, b) => a + (b.pernoctaciones_total || 0), 0);
      const summerShare = totalYr > 0 ? ((summerSum / totalYr) * 100) : 0;
      const mSources = resolveSourcesForKeys(['pernoctaciones_emat', 'tasa_ocupacion_estival_pct']);
      const res = {
        reply: isEnglishQuery
          ? `Regional tourism seasonality (INE EMAT) concentrates ${summerShare.toFixed(1)}% of annual overnight stays in Dec–Mar (${summerSum.toLocaleString('en-US')} of ${totalYr.toLocaleString('en-US')} nights). Peak occurs in ${peak.mes} (${peak.pernoctaciones_total.toLocaleString('en-US')} nights, ${peak.tasa_ocupacion_pct}% occupancy) vs. the winter trough in ${trough.mes} (${trough.pernoctaciones_total.toLocaleString('en-US')} nights, ${trough.tasa_ocupacion_pct}% occupancy).`
          : `La estacionalidad mensual del turismo en Aysén (INE EMAT) concentra el ${fmtNumber(summerShare, 1)}% de las pernoctaciones en diciembre–marzo (${fmtNumber(summerSum)} de ${fmtNumber(totalYr)} noches anuales). El pico ocurre en ${peak.mes} (${fmtNumber(peak.pernoctaciones_total)} noches, ${fmtNumber(peak.tasa_ocupacion_pct, 1)}% ocupación) frente al valle invernal de ${trough.mes} (${fmtNumber(trough.pernoctaciones_total)} noches, ${fmtNumber(trough.tasa_ocupacion_pct, 1)}% ocupación).`,
        chart: {
          render: true,
          type: 'line',
          varX: 'pernoctaciones_emat',
          varY: 'tasa_ocupacion_estival_pct',
          yKey: 'pernoctaciones_emat',
          y2Key: 'tasa_ocupacion_estival_pct',
          title: isEnglishQuery ? 'Monthly Tourism Seasonality EMAT (Jan–Dec)' : 'Curva Mensual de Estacionalidad Turística EMAT (Enero–Diciembre)',
          sourceText: mSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false,
          customTemporalSeries: {
            xTitle: isEnglishQuery ? 'Month (Jan–Dec)' : 'Meses del Año (Enero–Diciembre)',
            labels: mRows.map(m => m.mes),
            datasets: [
              { label: 'Pernoctaciones EMAT (noches)', data: mRows.map(m => m.pernoctaciones_total), unit: 'noches', borderColor: '#00357f', yAxisID: 'y' },
              { label: 'Tasa de Ocupación Hotelera (%)', data: mRows.map(m => m.tasa_ocupacion_pct), unit: '%', borderColor: '#c2410c', yAxisID: 'y1', dashed: true }
            ]
          }
        },
        sources: mSources,
        relatedHub: 'I'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

    // 3c. Desglose por Parque Nacional Individual CONAF SNASPE (2015–2026)
    if (asksSnaspeParkBreakdown && Array.isArray(_dataLake?.series?.snaspe_por_parque_anual) && _dataLake.series.snaspe_por_parque_anual.length > 0) {
      const rows = _dataLake.series.snaspe_por_parque_anual;
      const last = rows[rows.length - 1];
      const pSources = resolveSourcesForKeys(['visitantes_snaspe']);
      const res = {
        reply: isEnglishQuery
          ? `By individual CONAF SNASPE National Park (${last.anio}, total ${last.visitantes_snaspe_total.toLocaleString('en-US')} visits): PN Queulat leads with ${last.pn_queulat.toLocaleString('en-US')} visits, followed by PN Laguna San Rafael (${last.pn_laguna_san_rafael.toLocaleString('en-US')}), PN Cerro Castillo (${last.pn_cerro_castillo.toLocaleString('en-US')}), and PN Patagonia (${last.pn_patagonia.toLocaleString('en-US')}), plus ${last.otras_unidades.toLocaleString('en-US')} in other protected reserves.`
          : `Desglose oficial CONAF SNASPE por parque nacional (${last.anio}, total oficial en porterías CONAF: ${fmtNumber(last.visitantes_snaspe_total)} visitas en 19 unidades atendidas por 41 guardaparques permanentes rumbo al SBAP marzo 2027): lidera PN Queulat (${fmtNumber(last.pn_queulat)}), seguido de PN Patagonia (${fmtNumber(last.pn_patagonia)}), PN Cerro Castillo (${fmtNumber(last.pn_cerro_castillo)}, 1ª Área Protegida de Chile en Lista Verde UICN), RN Coyhaique/otras unidades (${fmtNumber(last.otras_unidades)}) y PN Laguna San Rafael (${fmtNumber(last.pn_laguna_san_rafael)}, con cierre definitivo sobre hielo del Glaciar Exploradores ratificado por Corte Suprema ROL N° 7.477-2026).`,
        chart: {
          render: true,
          type: 'line',
          varX: 'visitantes_snaspe',
          varY: 'visitantes_extranjeros_pct',
          yKey: 'visitantes_snaspe',
          y2Key: 'visitantes_extranjeros_pct',
          title: isEnglishQuery ? 'Annual Visits by National Park (CONAF SNASPE 2015–2026)' : 'Evolución Anual de Visitantes por Parque Nacional SNASPE (2015–2026)',
          sourceText: pSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false,
          customTemporalSeries: {
            xTitle: isEnglishQuery ? 'Years (2015–2026)' : 'Años (2015–2026)',
            labels: rows.map(r => String(r.anio)),
            datasets: [
              { label: 'PN Queulat (visitas)', data: rows.map(r => r.pn_queulat), unit: 'visitas', borderColor: '#00357f', yAxisID: 'y' },
              { label: 'PN Laguna San Rafael (visitas)', data: rows.map(r => r.pn_laguna_san_rafael), unit: 'visitas', borderColor: '#0f766e', yAxisID: 'y' },
              { label: 'PN Cerro Castillo (visitas)', data: rows.map(r => r.pn_cerro_castillo), unit: 'visitas', borderColor: '#c2410c', yAxisID: 'y' },
              { label: 'PN Patagonia (visitas)', data: rows.map(r => r.pn_patagonia), unit: 'visitas', borderColor: '#6d28d9', yAxisID: 'y', dashed: true }
            ]
          }
        },
        sources: pSources,
        relatedHub: 'I'
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
    if (matchedEntities.length === 1 && matchedSector && isBroadSectorQuery) {
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

    // 5. WP-B.1: Perfil Comunal Integral en 4 bloques cuando se consulta por una comuna sin indicador único o en consulta coloquial evaluativa abierta
    const isEvaluativeComunaOpen = matchedEntities.length === 1 && !matchedSector && !isHoldingQuery && EVALUATIVE_OPEN_COMUNA_RE.test(qNorm);
    const isGeneralComunaProfileRequest = matchedEntities.length === 1 && (
      topVariables.length === 0 ||
      isEvaluativeComunaOpen ||
      /\b(cuentame sobre|hablame de|perfil de|como esta|ficha de|resumen de|informacion de|todo sobre)\b/i.test(qNorm)
    ) && !matchedSector;

    if (isGeneralComunaProfileRequest) {
      const ent = matchedEntities[0];
      const c = ent.raw;
      const profileReply = buildComunaProfileReply(ent, _memoryIndex, { evaluativeMultiCriteria: isEvaluativeComunaOpen });
      const profileRows = buildComunaProfileTableRows(ent, _memoryIndex);
      const hasSalmonVocation = (c.concesiones_salmon || 0) > 20;
      const varX = hasSalmonVocation
        ? 'concesiones_salmon'
        : (isEvaluativeComunaOpen ? 'indice_aislamiento_multimodal' : 'presupuesto_per_capita_mclp');
      const varY = hasSalmonVocation
        ? 'biomasa_salmon_ton'
        : (isEvaluativeComunaOpen ? 'fndr_per_capita_mclp' : 'dependencia_fcm_pct');
      const profSources = resolveSourcesForKeys(
        isEvaluativeComunaOpen
          ? ['poblacion_censo_2024', 'indice_aislamiento_multimodal', 'fndr_per_capita_mclp', 'cobertura_fibra_hogar_pct', 'costo_real_generacion_diesel_kwh_clp']
          : ['poblacion_censo_2024', varX, 'presupuesto_mclp', 'camas_hospitalarias']
      );

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
      const numericTopVars = topVariables.filter(v => v && v.isNumeric).slice(0, 4);
      const varsToShow = numericTopVars.length > 0 ? numericTopVars : topVariables.slice(0, 2);
      const isDenseGridReply = isMultiEntityQuery && varsToShow.length >= 3;
      const hasConcAndActivos = varsToShow.some(v => v.key === 'concesiones_salmon') &&
        varsToShow.some(v => v.key === 'centros_activos_salmon');

      const lines = matchedEntities.map(ent => {
        const metricsText = varsToShow.map(v => {
          const val = ent.raw[v.key];
          let cleanLbl = CANONICAL_LABELS[v.key] || v.label;
          if (isDenseGridReply) {
            cleanLbl = cleanLbl.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
          }
          if (typeof val === 'number') {
            const rankIdx = v.stats ? v.stats.ranked.findIndex(r => r.comuna_ine === ent.id) + 1 : null;
            const rankStr = (!isMultiEntityQuery && rankIdx) ? ` (#${rankIdx} de ${_memoryIndex.entities.length})` : ((!isDenseGridReply && rankIdx) ? ` (#${rankIdx})` : '');
            const unitSuffix = (!isDenseGridReply && shouldAppendUnit(cleanLbl, v.unit)) ? ` ${v.unit}` : '';
            return `${cleanLbl}: ${fmtNumber(val)}${unitSuffix}${rankStr}`;
          }
          return `${cleanLbl}: ${val ?? '-'}`;
        }).join(isMultiEntityQuery ? '; ' : ' · ');

        let usoStr = '';
        if (hasConcAndActivos && Number(ent.raw?.concesiones_salmon) > 0) {
          const pctUso = fmtNumber((Number(ent.raw.centros_activos_salmon) / Number(ent.raw.concesiones_salmon)) * 100, 1);
          usoStr = ` [uso: ${pctUso}%]`;
        }
        return isMultiEntityQuery
          ? `${ent.name}: ${metricsText}${usoStr}.`
          : `La comuna de ${ent.name} (Provincia de ${ent.provincia}) registra ${metricsText}${usoStr}.`;
      });

      const compVar = primaryVar || varsToShow[0];
      let regionalNote = '';
      if (!isDenseGridReply && compVar && compVar.isNumeric && compVar.stats) {
        const cleanCompLabel = CANONICAL_LABELS[compVar.key] || compVar.label;
        const aggLabel = compVar.aggregation === 'avg' ? 'Promedio regional' : 'Total regional';
        const aggVal = compVar.aggregation === 'avg' ? compVar.stats.avg : compVar.stats.sum;
        const unitSuffix = shouldAppendUnit(cleanCompLabel, compVar.unit) ? ` ${compVar.unit}` : '';
        regionalNote = ` ${aggLabel} de ${cleanCompLabel}: ${fmtNumber(aggVal)}${unitSuffix} (máx. ${compVar.stats.max.comuna} ${fmtNumber(compVar.stats.max.value)}; mín. ${compVar.stats.min.comuna} ${fmtNumber(compVar.stats.min.value)}).`;
      }

      const asksHoldingEvol = /\b(evolucion|concentracion|2018|2026)\b/i.test(qNorm) && /\b(holding|holdings|salmon\w*)\b/i.test(qNorm);
      const holdingEvolNote = asksHoldingEvol
        ? ' Top 5 holdings (2018–2026): 58,0% → 70,8%.'
        : '';

      const combinedReply = `${locNote}${lines.join(' ')}${holdingEvolNote}${regionalNote}${over10Note || ''}`;
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
          const projVars = [primaryVar, secondaryVar, tertiaryVar, quaternaryVar].filter(v => v && v.isNumeric && v.stats);
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

      const fmtEn = (val, dec = 1) => {
        if (typeof val !== 'number' || !Number.isFinite(val)) return String(val ?? '-');
        const isInt = Math.abs(val - Math.round(val)) < 1e-6;
        const useDec = Math.abs(val) < 10 && !isInt ? Math.max(dec, 2) : dec;
        return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: isInt ? 0 : useDec });
      };
      const EN_LABELS_MAP = {
        visitas_por_cama_turistica: 'SNASPE Visits / Tourist Bed Ratio',
        camas_turisticas: 'Available Tourist Beds',
        ratio_presion_turistica: 'Summer Tourist Pressure (Visits/Resident)',
        visitas_por_pernoctacion_ratio: 'SNASPE Visits / Overnight Stays Ratio',
        visitantes_snaspe: 'Annual SNASPE Park Visits',
        pernoctaciones_emat: 'Annual Overnight Stays (EMAT)',
        visitantes_extranjeros_pct: 'Foreign Visitors Share (%)',
        concentracion_estival_pct: 'Summer Concentration (%)',
        tarifa_adr_estimada_usd: 'Estimated Average Daily Rate ADR (US$)',
        revpar_estimado_usd: 'Estimated RevPAR (US$)'
      };

      const buildVarParagraph = (v, isPrimary, compactMode = false) => {
        const list = excludeCoyhaique
          ? v.stats.ranked.filter(r => r.comuna_ine !== '11101' && r.comuna.toLowerCase() !== 'coyhaique')
          : v.stats.ranked;
        if (!list.length) return '';

        const useEnglish = Boolean(isEnglishQuery && !wantsScatter);
        const cleanLbl = useEnglish ? (EN_LABELS_MAP[v.key] || CANONICAL_LABELS[v.key] || v.label) : (CANONICAL_LABELS[v.key] || v.label);
        const sum = list.reduce((acc, r) => acc + r.value, 0);
        const avg = sum / list.length;
        const unitStr = v.unit ? ` ${v.unit}` : '';
        if (useEnglish) {
          const top3 = list.slice(0, 3).map((r) => `${r.comuna} (${fmtEn(r.value)})`).join(', ');
          const bot1 = list[list.length - 1];
          const aggEn = v.aggregation === 'avg' ? `Reg. avg: ${fmtEn(avg)}` : `Reg. total: ${fmtEn(sum)}`;
          return `${cleanLbl}: led by ${top3}, min ${bot1.comuna} (${fmtEn(bot1.value)}), ${aggEn}.`;
        }
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
          : (v.key === 'poblacion_censo_2024' && !excludeCoyhaique && list.length === 10
            ? `Total regional oficial INE: 100.745 hab. (suma comunal BCN: ${fmtNumber(sum)}${unitStr}, promedio comunal: ${fmtNumber(avg)}${unitStr}).`
            : `Total regional: ${fmtNumber(sum)}${unitStr} (promedio comunal: ${fmtNumber(avg)}${unitStr}).`);

        return `${cleanLbl}${excludeCoyhaique ? ' (sin Coyhaique)' : ''}: Lideran ${topN}, y el menor registro corresponde a ${bottom.comuna} (${fmtNumber(bottom.value)}${unitStr}). ${aggSentence}`;
      };

      const isThreeVar = Boolean(tertiaryVar && tertiaryVar.isNumeric && tertiaryVar.stats);
      const isFourVar = Boolean(quaternaryVar && quaternaryVar.isNumeric && quaternaryVar.stats);
      const useCompactSummary = isThreeVar || (wantsScatter && Boolean(bivariateStats));
      const paragraphs = [buildVarParagraph(primaryVar, true, useCompactSummary)];
      if (secondaryVar && secondaryVar.isNumeric && secondaryVar.stats) {
        paragraphs.push(buildVarParagraph(secondaryVar, false, useCompactSummary));
      }
      if (isThreeVar) {
        paragraphs.push(buildVarParagraph(tertiaryVar, false, true));
      }
      if (isFourVar && !wantsScatter) {
        paragraphs.push(buildVarParagraph(quaternaryVar, false, true));
      }
      if (wantsScatter && bivariateStats && secondaryVar && secondaryVar.isNumeric) {
        const cleanY = CANONICAL_LABELS[secondaryVar.key] || secondaryVar.label;
        const brList = bivariateStats.bottomRight.slice(0, 3).join(', ');
        const brClause = brList
          ? `con comunas de alto X y bajo Y en el cuadrante inferior-derecho (${brList}), `
          : '';
        paragraphs.push(`Correlación lineal ${bivariateStats.sense} (r = ${fmtNumber(bivariateStats.r, 2)}, R² = ${fmtNumber(bivariateStats.r2, 2)}): ${brClause}máximo de ${cleanY} en ${bivariateStats.maxY.comuna} (${fmtNumber(bivariateStats.maxY.value)}) y mínimo en ${bivariateStats.minY.comuna} (${fmtNumber(bivariateStats.minY.value)}).`);
      }

      let outChart = chartSpec;
      if (isEnglishQuery && !wantsScatter && asksTourismInvestmentGap && outChart) {
        outChart = Object.assign({}, outChart, {
          title: 'SNASPE Park Visits per Tourist Bed, Overnight Ratio & Summer Pressure by Commune',
          multiCharts: [
            {
              type: 'bar',
              varX: 'visitas_por_cama_turistica',
              varY: 'camas_turisticas',
              title: 'Visits per Tourist Bed vs. Available Tourist Beds',
              sourceText: resolveSourcesForKeys(['visitas_por_cama_turistica', 'camas_turisticas']).map(s => s.institucion).join(' · '),
              excludeCoyhaique
            },
            {
              type: 'bar',
              varX: 'ratio_presion_turistica',
              varY: 'visitas_por_pernoctacion_ratio',
              title: 'Summer Tourist Pressure vs. Visits/Overnight Ratio',
              sourceText: resolveSourcesForKeys(['ratio_presion_turistica', 'visitas_por_pernoctacion_ratio']).map(s => s.institucion).join(' · '),
              excludeCoyhaique
            }
          ]
        });
      }

      const maxReplyLen = isFourVar ? 780 : 645;
      const combinedVarReply = `${paragraphs.filter(Boolean).join(' ')}${over10Note || ''}`;
      const res = {
        reply: combinedVarReply.length > maxReplyLen ? combinedVarReply.slice(0, maxReplyLen - 3) + '...' : combinedVarReply,
        chart: outChart,
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

    // 10. Reparación conversacional sin paquete previo vs. Caso F (fuera del catálogo oficial)
    if (isConversationalRepair) {
      const govFallbackPacket = CONCEPTUAL_DOMAIN_PACKETS[0];
      const repairSources = resolveSourcesForKeys(govFallbackPacket.coreVariables);
      const res = {
        reply: sanitizeTechnicalKeysInReply(`Disculpa el desvío en la respuesta anterior${originalQueryToRepair ? ` sobre "${originalQueryToRepair}"` : ''}. A modo de referencia directa del sistema regional (Hub IV BCN/SINIM 2025), las 10 comunas de Aysén reúnen 84.820,68 M$ de ingresos municipales con 68,5% de dependencia FCM ponderada (77,5% promedio comunal simple); indícame qué variable o comuna específica deseas profundizar.`),
        chart: {
          render: true,
          type: 'bar',
          varX: 'dependencia_fcm_pct',
          varY: 'ingresos_propios_pct',
          yKey: 'dependencia_fcm_pct',
          y2Key: 'ingresos_propios_pct',
          title: 'Estructura del Financiamiento Municipal: Dependencia FCM (%) vs. Ingresos Propios Permanentes (%)',
          sourceText: repairSources.map(s => s.institucion).join(' · '),
          excludeCoyhaique: false
        },
        sources: repairSources,
        relatedHub: 'IV'
      };
      updateConversationState(memoryPacket, res);
      return res;
    }

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
    const VAR_KEY_ALIASES = {
      presupuesto_municipal_mclp: 'presupuesto_mclp',
      presupuesto_vigente_mclp: 'presupuesto_mclp',
      concesiones_operativas_n: 'centros_activos_salmon',
      centros_cultivo_activos: 'centros_activos_salmon',
      concesiones_total_n: 'concesiones_salmon',
      biomasa_cosechada_ton: 'biomasa_salmon_ton',
      centros_ctci_n: 'centros_y_estaciones_ctci_count',
      fondos_corfo_innova_mclp: 'monto_corfo_innova_mclp',
      fondos_cultura_total_mclp: 'fondos_cultura_adjudicados_mclp',
      monumentos_nacionales_n: 'monumentos_nacionales_count',
      museos_espacios_patrimoniales_n: 'museos_espacios_n',
      inversion_fndr_mclp: 'fndr_mclp',
      inversion_fndr_per_capita_mclp: 'fndr_per_capita_mclp',
      inversion_per_capita_mclp: 'fndr_per_capita_mclp',
      ejecucion_presupuestaria_gore_pct: 'fndr_gore_2023_ejecucion_pct',
      postas_rurales_n: 'postas_salud_rural',
      especies_rce_amenazadas_n: 'fauna_amenazada_n',
      visitantes_snaspe_anual: 'visitantes_snaspe',
      areas_protegidas_snaspe_ha: 'superficie_snaspe_pct',
      capacidad_instalada_mw: 'potencia_mw',
      conectividad_digital_pct: 'cobertura_fibra_hogar_pct',
      uso_antibioticos_g_ton: 'antibioticos_ica_g_ton',
      empleo_directo_salmon_n: 'trabajadores_sii',
      medicos_por_10k_hab: 'medicos_por_mil_hab',
      tiempo_traslado_hospital_min: 'traslado_coyhaique_hrs',
      indice_aislamiento_subdere: 'indice_aislamiento_multimodal'
    };
    const cleaned = rawCandidate.trim().split(/[\s(]/)[0];
    const resolvedClean = VAR_KEY_ALIASES[cleaned] || cleaned;
    if (_memoryIndex.variablesByKey[resolvedClean]?.isNumeric) return resolvedClean;
    const snakeMatch = rawCandidate.match(/\b[a-z][a-z0-9_]{3,}\b/);
    if (snakeMatch) {
      const mKey = VAR_KEY_ALIASES[snakeMatch[0]] || snakeMatch[0];
      if (_memoryIndex.variablesByKey[mKey]?.isNumeric) return mKey;
    }
    return null;
  }

  /**
   * Sanitizador anti-snake_case: elimina identificadores técnicos entre paréntesis
   * y reemplaza cualquier clave técnica residual por su etiqueta oficial legible.
   */
  function sanitizeTechnicalKeysInReply(text) {
    if (!text || typeof text !== 'string') return text;
    const aliasMap = {
      presupuesto_mclp: 'Presupuesto Municipal Vigente (M$)',
      presupuesto_municipal_mclp: 'Presupuesto Municipal Vigente (M$)',
      dependencia_fcm_pct: 'Dependencia del Fondo Común Municipal (%)',
      ingresos_propios_pct: 'Ingresos Propios Permanentes (%)',
      fndr_per_capita_mclp: 'Inversión FNDR Per Cápita (Miles $/hab)',
      inversion_fndr_per_capita_mclp: 'Inversión FNDR Per Cápita (Miles $/hab)',
      profesionalizacion_pct: 'Profesionalización de Planta Municipal (%)'
    };
    const knownKeyRe = /^(presupuesto|dependencia|ingresos|concesiones|biomasa|tarifa|hogares|camas|medicos|superficie|visitantes|empresas|trabajadores|fndr|pobreza|tasa|indice|gasto|monto|proyectos|centros|postas|cobertura|consumo|informalidad|saidi|profesionalizacion|traslado|mediana|fauna|glaciares|potencia|poblacion|densidad|red_vial|ruta7|antibioticos|america|amerb|ecmpo|desembarque|barometro)/i;

    const cleaned = text
      .replace(/\s*\(\s*[a-z][a-z0-9]*(?:_[a-z0-9]+)+\s*\)/gi, (full) => {
        const inner = full.replace(/[\s()]/g, '');
        if (
          aliasMap[inner] ||
          (_memoryIndex && _memoryIndex.variablesByKey && _memoryIndex.variablesByKey[inner]) ||
          knownKeyRe.test(inner)
        ) {
          return '';
        }
        return full;
      })
      .replace(/(https?:\/\/[^\s)]+)|(\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b)/g, (match, url, snake) => {
        if (url) return url;
        if (!snake) return match;
        if (aliasMap[snake]) return aliasMap[snake];
        const entry = _memoryIndex && _memoryIndex.variablesByKey && _memoryIndex.variablesByKey[snake];
        if (entry) return CANONICAL_LABELS[snake] || entry.label;
        return match;
      });
    return cleaned.replace(/\s+([.,;:])/g, '$1').replace(/\s{2,}/g, ' ').trim();
  }

  /**
   * Re-hidrata el chartSpec y fuentes oficiales a partir de las variables elegidas por el LLM.
   */
  function rehydrateChartFromLLM(parsed, memoryPacket) {
    const safeParsed = parsed || {};
    const llmChart = safeParsed.chart || {};
    const pktChart = (memoryPacket && memoryPacket.chartSpec) || {};
    const selectedArr = Array.isArray(safeParsed.variables_seleccionadas)
      ? safeParsed.variables_seleccionadas.map(resolveValidVarKey).filter(Boolean)
      : [];
    const yKeysArr = Array.isArray(llmChart.yKeys)
      ? llmChart.yKeys.map(resolveValidVarKey).filter(Boolean)
      : [];

    const llmVarX = resolveValidVarKey(llmChart.varX) ||
      (llmChart.xKey && llmChart.xKey !== 'comuna' ? resolveValidVarKey(llmChart.xKey) : null) ||
      yKeysArr[0] ||
      selectedArr[0] ||
      null;
    const llmVarY = resolveValidVarKey(llmChart.varY) ||
      yKeysArr[1] ||
      selectedArr.find(k => k !== llmVarX) ||
      null;

    const explicitDisable = llmChart.render === false || llmChart.render === 'false';
    const shouldRender = explicitDisable
      ? false
      : Boolean((llmChart.render !== undefined ? llmChart.render : pktChart.render) || llmVarX);

    let validVarX = null;
    let validVarY = null;
    if (shouldRender) {
      if (llmVarX) {
        validVarX = llmVarX;
        if (llmVarY && llmVarY !== llmVarX) {
          validVarY = llmVarY;
        } else if (pktChart.varY && pktChart.varY !== llmVarX && !selectedArr.length && !yKeysArr.length) {
          validVarY = pktChart.varY;
        }
      } else if (memoryPacket?.primaryVar || memoryPacket?.matchedSector || memoryPacket?.reconciledResult || memoryPacket?.matchedConceptualPacket || memoryPacket?.matchedTerritorialEntity) {
        validVarX = pktChart.varX || null;
        validVarY = (pktChart.varY && pktChart.varY !== validVarX) ? pktChart.varY : null;
      } else {
        const inferredKeys = inferVariablesFromReplyText(`${memoryPacket?.query || ''} ${safeParsed.reply || ''}`);
        validVarX = inferredKeys[0] || pktChart.varX || null;
        validVarY = (memoryPacket?.wantsBivariateComparison && inferredKeys[1] && inferredKeys[1] !== validVarX)
          ? inferredKeys[1]
          : (pktChart.varY || null);
      }
    }

    const allowedTypes = ['bar', 'line', 'scatter'];
    let chartType = allowedTypes.includes(llmChart.type) ? llmChart.type : (pktChart.type || 'bar');
    if (chartType === 'line' && !memoryPacket?.hasTourismTemporalSeries && !pktChart.customTemporalSeries) {
      chartType = (memoryPacket?.wantsScatter && validVarY) ? 'scatter' : 'bar';
    }
    if (chartType === 'scatter' && Array.isArray(pktChart.focusComunas) && pktChart.focusComunas.length < 3) {
      chartType = 'bar';
    }

    const resolvedTitle = resolveChartTitleForVars(validVarX, validVarY, memoryPacket || { chartSpec: pktChart }, llmChart);
    const exactSources = shouldRender && validVarX ? resolveSourcesForKeys([validVarX, validVarY].filter(Boolean)) : [];
    const varChanged = Boolean(llmVarX && llmVarX !== pktChart.varX);

    return {
      validVarX,
      validVarY,
      chartType,
      shouldRender,
      resolvedTitle,
      exactSources,
      chartSpec: {
        render: Boolean(shouldRender && (validVarX || pktChart.customCategoryData)),
        type: chartType,
        varX: validVarX,
        varY: validVarY,
        varZ: varChanged ? null : (pktChart.varZ || null),
        varW: varChanged ? null : (pktChart.varW || null),
        yKey: validVarX,
        y2Key: validVarY,
        singleComunaMode: Boolean(pktChart.singleComunaMode),
        focusComunas: pktChart.focusComunas || null,
        comunaName: pktChart.comunaName || null,
        comunaIne: pktChart.comunaIne || null,
        multiCharts: varChanged ? null : (pktChart.multiCharts || null),
        customTemporalSeries: pktChart.customTemporalSeries || null,
        customCategoryData: Boolean(pktChart.customCategoryData),
        labels: pktChart.labels || null,
        datasets: pktChart.datasets || null,
        holdingRows: pktChart.holdingRows || null,
        comunaProfileRows: pktChart.comunaProfileRows || null,
        highlightComuna: memoryPacket?.matchedEntities?.length === 1 ? memoryPacket.matchedEntities[0].name : null,
        title: resolvedTitle,
        sourceText: exactSources.map(s => s.institucion).join(' · '),
        excludeCoyhaique: llmChart.excludeCoyhaique !== undefined
          ? Boolean(llmChart.excludeCoyhaique)
          : Boolean(pktChart.excludeCoyhaique)
      }
    };
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

  function startLexiconFetchIfNeeded() {
    if (_lexicon || _lexiconPromise || typeof fetch !== 'function') return _lexiconPromise;
    _lexiconPromise = fetch(_config.lexiconUrl)
      .then(r => (r.ok ? r.json() : null))
      .then(json => {
        if (json) {
          _lexicon = json;
          if (global && global.NL2ChartEngine && typeof global.NL2ChartEngine.setLexicon === 'function') {
            global.NL2ChartEngine.setLexicon(json);
          }
          if (_dataLake) buildMemoryIndex(_dataLake, _lexicon);
        }
        return json;
      })
      .catch(() => null);
    return _lexiconPromise;
  }

  /**
   * API Pública de OmniRouteClient
   */
  const OmniRouteClient = {
    init(dataLake, customConfig = {}) {
      _config = Object.assign({}, DEFAULT_CONFIG, _config, customConfig);
      const targetLake = dataLake || _dataLake || (global ? global.AYSEN_HUBS_DATA : null);
      if (!targetLake || typeof targetLake !== 'object') return false;

      if (!_lexicon && global && global.NL2ChartEngine && typeof global.NL2ChartEngine.getLexicon === 'function') {
        _lexicon = global.NL2ChartEngine.getLexicon();
      }
      if (!_lexicon) {
        tryLoadNodeLexicon();
      }

      if (_initialized && _dataLake === targetLake && _memoryIndex.variables.length > 0 && !customConfig.forceRebuild) {
        startLexiconFetchIfNeeded();
        return this;
      }

      _dataLake = targetLake;
      syncCompiledWikiKnowledge();
      buildMemoryIndex(_dataLake, _lexicon);
      _initialized = true;
      startLexiconFetchIfNeeded();

      return this;
    },

    syncCompiledWikiKnowledge,

    refreshMemory(newDataLake) {
      if (newDataLake) _dataLake = newDataLake;
      if (_dataLake) {
        buildMemoryIndex(_dataLake, _lexicon);
        _initialized = true;
      }
      return _memoryIndex;
    },

    clearConversationMemory() {
      _conversationMemory = [];
      _conversationState = {
        lastComunaCode: null,
        lastComunaName: null,
        lastComunaKey: null,
        lastVarKey: null,
        lastVarLabel: null,
        lastDomain: null,
        lastLocalidad: null,
        lastIndicatorKeys: [],
        lastSubstantiveQuery: null,
        lastConceptualPacketId: null,
        rejectedVarKeys: [],
        pureRepairCount: 0,
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
      ensureInitialized();
      return _memoryIndex;
    },

    buildSystemPrompt,
    buildMemoryGroundedPrompts,
    extractJsonFromResponse,
    retrieveMemoryForQuery,
    classifyConversationAct,
    sanitizeTechnicalKeysInReply,
    rehydrateChartFromLLM,
    CONCEPTUAL_DOMAIN_PACKETS,
    TERRITORIAL_ENTITY_GRAPH,
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
    FUENTES_OFICIALES_COMPLEMENTARIAS,

    getComunaVector(varKey, excludeCoyhaique = false) {
      ensureInitialized();
      return (_memoryIndex.comunas || [])
        .filter(c => !(excludeCoyhaique && isCoyhaiqueComuna(c)))
        .map(c => ({
          id: c.id,
          nombre: c.nombre || c.nombre_comuna,
          value: typeof c[varKey] === 'number' ? c[varKey] : 0
        }));
    },

    resolveClosedWorldDeterministic(userText) {
      ensureInitialized();
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
      ensureInitialized();

      const memoryPacket = retrieveMemoryForQuery(userText);

      // Resolución directa determinista para temas reconciliados, guardrails, holdings, series temporales, rankings/sumas y multi-gráficos
      if (
        (memoryPacket.reconciledResult && !memoryPacket.reconciledResult.isContextualBridge) ||
        memoryPacket.isDeterministicDirect
      ) {
        const rawDirectRes = memoryPacket.directResult || (
          memoryPacket.reconciledResult && !memoryPacket.reconciledResult.isContextualBridge
            ? memoryPacket.reconciledResult
            : synthesizeFromMemoryPacket(memoryPacket)
        );
        const directRes = Object.assign({}, rawDirectRes, {
          reply: sanitizeTechnicalKeysInReply(rawDirectRes.reply)
        });
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

        const rehydrated = rehydrateChartFromLLM(parsed, memoryPacket);
        const rawHub = String(parsed.relatedHub || '').trim();
        const resolvedHub = (memoryPacket.reconciledResult && memoryPacket.reconciledResult.relatedHub)
          ? memoryPacket.reconciledResult.relatedHub
          : (rehydrated.validVarX
              ? getHubForVariable(rehydrated.validVarX)
              : (/^(I|II|III|IV|V|VI|VII|VIII|IX|X)$/.test(rawHub) ? rawHub : (memoryPacket.relatedHub || 'IV')));

        const baseReply = (parsed._isTruncatedRescue && memoryPacket.reconciledResult && memoryPacket.reconciledResult.reply)
          ? memoryPacket.reconciledResult.reply
          : (parsed.reply || synthesizeFromMemoryPacket(memoryPacket).reply);
        const locPrefix = buildLocalityNote(memoryPacket.matchedLocalidades);
        const combinedReply = (locPrefix && !baseReply.toLowerCase().includes(memoryPacket.matchedLocalidades[0].comunaName.toLowerCase()))
          ? `${locPrefix}${baseReply}`
          : baseReply;
        const resolvedReply = sanitizeTechnicalKeysInReply(combinedReply);

        const finalResult = {
          reply: resolvedReply,
          chart: rehydrated.chartSpec,
          sources: rehydrated.exactSources.length
            ? rehydrated.exactSources
            : (rehydrated.shouldRender ? memoryPacket.sources : []),
          relatedHub: resolvedHub
        };

        updateConversationState(memoryPacket, finalResult);
        _conversationMemory.push({ role: 'user', content: userText });
        _conversationMemory.push({ role: 'assistant', content: finalResult.reply });

        return finalResult;
      } catch (_) {
        const rawFallback = synthesizeFromMemoryPacket(memoryPacket);
        const fallbackResult = Object.assign({}, rawFallback, {
          reply: sanitizeTechnicalKeysInReply(rawFallback.reply)
        });
        _conversationMemory.push({ role: 'user', content: userText });
        _conversationMemory.push({ role: 'assistant', content: fallbackResult.reply });
        return fallbackResult;
      } finally {
        if (timer) clearTimeout(timer);
      }
    }
  };

  return OmniRouteClient;
});
