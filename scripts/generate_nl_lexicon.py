#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/generate_nl_lexicon.py
Genera data/nl_lexicon_aysen.json para el motor de traducción NLP Lego en cliente.
100% Client-side, Zero-API, 0ms, Costo $0, CERO EMOJIS.
Autor: Álvaro Contreras Barrios
"""
import json
import os

variables = [
    # -------------------------------------------------------------
    # 1. SALMONICULTURA & MARITORIO (HUB II)
    # -------------------------------------------------------------
    {
        "id": "concesiones_salmon",
        "canonicalId": "salmon_concesiones_vigentes",
        "name": "Concesiones de Salmonicultura Otorgadas",
        "shortName": "Concesiones Salmón",
        "unit": "concesiones",
        "hub": "salmonicultura",
        "hubTitle": "II. Pesca, Acuicultura y Mar",
        "nodeId": 6,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "concesiones", "concesion", "concesiones acuicolas", "concesiones de salmon",
            "concesiones salmoneras", "jaulas", "balsas jaulas", "jaulas de salmoneras",
            "salmones", "salmon", "salmoneras", "cultivo de salmon", "centros de cultivo",
            "maritorio", "concesiones marinas", "concesiones de acuicultura", "acuicultura",
            "piscinas salmoneras", "jaula marina", "balsas salmoneras", "salmonicultura",
            "concesiones vigentes", "concesiones otorgadas", "jaulas en el mar"
        ]
    },
    {
        "id": "biomasa_salmon_ton",
        "canonicalId": "wp03_biomasa_salmon_ton",
        "name": "Biomasa Cosechada de Salmónidos",
        "shortName": "Biomasa Salmón",
        "unit": "toneladas",
        "hub": "salmonicultura",
        "hubTitle": "II. Pesca, Acuicultura y Mar",
        "nodeId": 6,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "biomasa", "biomasa cosechada", "cosecha de salmon", "toneladas de salmon",
            "produccion de salmon", "salmones cosechados", "volumen de salmon",
            "biomasa salmon", "kilos de salmon", "tonelaje salmonero", "extraccion salmon"
        ]
    },
    {
        "id": "centros_activos_salmon",
        "canonicalId": "wp03_centros_activos",
        "name": "Centros Acuícolas Operativos Activos",
        "shortName": "Centros Salmón Activos",
        "unit": "centros",
        "hub": "salmonicultura",
        "hubTitle": "II. Pesca, Acuicultura y Mar",
        "nodeId": 8,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "centros activos", "centros operativos", "centros salmoneros activos",
            "salmoneras operando", "centros en engorda", "centros con peces", "jaulas activas",
            "sitios de cultivo activos"
        ]
    },
    {
        "id": "antibioticos_ica_g_ton",
        "canonicalId": "wp03_ica_antibioticos",
        "name": "Índice de Consumo de Antibióticos (ICA)",
        "shortName": "Antibióticos ICA",
        "unit": "g/tonelada",
        "hub": "salmonicultura",
        "hubTitle": "II. Pesca, Acuicultura y Mar",
        "nodeId": 9,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "antibioticos", "ica", "consumo de antibioticos", "uso de antibioticos",
            "antimicrobianos", "gramos por tonelada", "quimicos en salmones",
            "medicamentos en jaulas", "tratamiento antibiotico salmon"
        ]
    },
    {
        "id": "amerb_decretadas",
        "canonicalId": "wp03_desembarque_artesanal",
        "name": "Áreas de Manejo de Recursos Bentónicos (AMERB) Decretadas",
        "shortName": "AMERB Decretadas",
        "unit": "áreas",
        "hub": "salmonicultura",
        "hubTitle": "II. Pesca, Acuicultura y Mar",
        "nodeId": 8,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "amerb", "areas de manejo", "pesca artesanal", "caletas", "caletas pesqueras",
            "buzos", "mariscadores", "recursos bentonicos", "locos", "erizos", "algas"
        ]
    },
    {
        "id": "amerb_operativas",
        "canonicalId": "wp03_desembarque_artesanal",
        "name": "AMERB Operativas Vigentes",
        "shortName": "AMERB Operativas",
        "unit": "áreas",
        "hub": "salmonicultura",
        "hubTitle": "II. Pesca, Acuicultura y Mar",
        "nodeId": 8,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "amerb operativas", "areas de manejo activas", "sindicatos de pescadores",
            "extraccion artesanal", "caletas activas"
        ]
    },

    # -------------------------------------------------------------
    # 2. GOBERNANZA & FINANZAS MUNICIPALES (HUB IV)
    # -------------------------------------------------------------
    {
        "id": "presupuesto_mclp",
        "canonicalId": "wp01_presupuesto_municipal",
        "name": "Presupuesto Municipal Anual (SINIM)",
        "shortName": "Presupuesto Municipal",
        "unit": "M$ CLP",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 15,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "presupuesto", "plata municipal", "plata de la municipalidad", "presupuesto municipal",
            "fondos municipales", "gasto municipal", "recursos de la municipalidad",
            "ingresos municipales", "sinim", "presupuesto comunal", "arca municipal",
            "millones municipales", "m$ clp municipal"
        ]
    },
    {
        "id": "ipp_per_capita_clp",
        "canonicalId": "wp01_ipp_per_capita",
        "name": "Ingresos Propios Permanentes per Cápita (SINIM)",
        "shortName": "IPP per Cápita",
        "unit": "CLP/hab",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 15,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "patentes", "pago de patente", "ingresos propios", "ingresos propios permanentes",
            "ipp", "ipp per capita", "patentes municipales", "cobro de patentes",
            "plata propia", "recaudacion propia", "patentes comerciales", "patentes acuicolas",
            "patentes mineras", "pago patentes", "contribuciones locales"
        ]
    },
    {
        "id": "presupuesto_per_capita_mclp",
        "canonicalId": "wp01_presupuesto_per_capita",
        "name": "Presupuesto Municipal per Cápita",
        "shortName": "Presupuesto per Cápita",
        "unit": "Miles CLP/hab",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 15,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "presupuesto por habitante", "presupuesto per capita", "plata por persona",
            "recursos por habitante", "gasto por habitante", "pesos por persona",
            "plata municipal por habitante"
        ]
    },
    {
        "id": "dependencia_fcm_pct",
        "canonicalId": "finanzas_dependencia_fcm_pct",
        "name": "Dependencia del Fondo Común Municipal (FCM)",
        "shortName": "Dependencia FCM",
        "unit": "% presupuesto",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 16,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "dependencia", "fcm", "fondo comun municipal", "fondo comun", "aporte del estado",
            "dependencia municipal", "dependencia del fcm", "transferencias del estado",
            "subsidio municipal", "ayuda estatal municipal", "porcentaje fcm",
            "cuanto depende del fondo comun"
        ]
    },
    {
        "id": "fndr_mclp",
        "canonicalId": "wp01_inversion_fndr",
        "name": "Inversión FNDR Asignada Estimada",
        "shortName": "Inversión FNDR",
        "unit": "M$ CLP",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 18,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "fndr", "fondo nacional de desarrollo regional", "gore", "gobierno regional",
            "inversion fndr", "plata gore", "proyectos gore", "inversion publica regional",
            "fondos fndr", "financiamiento gore"
        ]
    },
    {
        "id": "gasto_personal_pct",
        "canonicalId": "wp01_profesionalizacion_pct",
        "name": "Gasto en Personal Municipal (Subtítulo 21)",
        "shortName": "Gasto Personal Municipal",
        "unit": "% presupuesto",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 15,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "gasto en personal", "sueldos municipales", "subtitulo 21", "gasto funcionarios",
            "planta municipal gasto", "cuanto gastan en sueldos", "personal municipal"
        ]
    },
    {
        "id": "inversion_directa_pct",
        "canonicalId": "wp01_presupuesto_municipal",
        "name": "Inversión Real Directa Municipal",
        "shortName": "Inversión Directa",
        "unit": "% presupuesto",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 15,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "inversion directa", "inversion real directa", "obras municipales",
            "gasto en obras", "proyectos directos del municipio"
        ]
    },
    {
        "id": "profesionalizacion_pct",
        "canonicalId": "wp01_profesionalizacion_pct",
        "name": "Profesionalización de la Planta Municipal",
        "shortName": "Profesionalización",
        "unit": "% personal",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 15,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "profesionalizacion", "profesionales en el municipio", "titulados municipales",
            "grado universitario funcionarios", "calificacion personal municipal"
        ]
    },
    {
        "id": "alcalde",
        "canonicalId": "wp01_presupuesto_municipal",
        "name": "Alcalde Electo Comunal (2024-2028)",
        "shortName": "Alcalde Electo",
        "unit": "autoridad",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 17,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "alcalde", "edil", "jefe comunal", "autoridad comunal", "quien manda",
            "quien gobierna", "alcaldesa", "jefe municipal"
        ]
    },
    {
        "id": "partido_alcalde",
        "canonicalId": "wp01_presupuesto_municipal",
        "name": "Partido Político o Pacto del Alcalde",
        "shortName": "Partido Político Alcalde",
        "unit": "pacto/partido",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 17,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "partido del alcalde", "partido politico", "pacto electoral", "derecha",
            "izquierda", "democrata cristiano", "oficialismo", "oposicion", "independiente"
        ]
    },
    {
        "id": "codigo_comuna",
        "canonicalId": "comuna_poblacion_2024",
        "name": "Código Territorial Comunal",
        "shortName": "Código Comunal",
        "unit": "código",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 17,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "codigo comuna", "codigo territorial", "cl xi"
        ]
    },
    {
        "id": "comuna_ine",
        "canonicalId": "comuna_poblacion_2024",
        "name": "Código INE Comunal",
        "shortName": "Código INE",
        "unit": "código",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 17,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "codigo ine", "ine comunal", "11101", "11201", "identificador ine"
        ]
    },

    # -------------------------------------------------------------
    # 3. SALUD (HUB VIII) Y EDUCACIÓN & SOCIEDAD (HUB VI)
    # -------------------------------------------------------------
    {
        "id": "urgencias_respiratorias_pct",
        "canonicalId": "wp05_urgencias_respiratorias_pct",
        "name": "Urgencias Respiratorias Invernales",
        "shortName": "Urgencias Respiratorias",
        "unit": "% urgencias",
        "hub": "salud",
        "hubTitle": "VIII. Salud",
        "nodeId": 24,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "problemas respiratorios", "urgencias", "urgencias respiratorias",
            "enfermedades de invierno", "bronquitis", "neumonia", "virus respiratorio",
            "consultas por humo", "resfrios de invierno", "crisis respiratoria",
            "enfermedades respiratorias", "infecciones respiratorias", "urgencias por smog"
        ]
    },
    {
        "id": "camas_hospitalarias",
        "canonicalId": "wp05_camas_hospitalarias",
        "name": "Camas Hospitalarias Red SSA",
        "shortName": "Camas Hospitalarias",
        "unit": "camas",
        "hub": "salud",
        "hubTitle": "VIII. Salud",
        "nodeId": 24,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "hospitalizados", "camas", "camas hospitalarias", "hospitales", "hospital",
            "red hospitalaria", "internaciones", "cupos de hospital", "camas de hospital",
            "infraestructura hospitalaria", "capacidad hospitalaria"
        ]
    },
    {
        "id": "medicos_por_mil_hab",
        "canonicalId": "wp05_medicos_por_mil_hab",
        "name": "Densidad Médica de la Red Asistencial",
        "shortName": "Médicos por 1.000 hab",
        "unit": "médicos/1.000 hab",
        "hub": "salud",
        "hubTitle": "VIII. Salud",
        "nodeId": 24,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "medicos", "doctores", "posta", "salud", "atencion medica",
            "medicos por mil habitantes", "doctores disponibles", "especialistas medicos",
            "acceso a doctores", "dotacion medica", "postas rurales", "cesfam"
        ]
    },
    {
        "id": "aeroevacuaciones_samu_n",
        "canonicalId": "wp05_aeroevacuaciones_samu",
        "name": "Aeroevacuaciones Médicas SAMU Anuales",
        "shortName": "Aeroevacuaciones SAMU",
        "unit": "evacuaciones",
        "hub": "salud",
        "hubTitle": "VIII. Salud",
        "nodeId": 24,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "aeroevacuaciones", "samu", "evacuacion medica", "avion ambulancia",
            "traslado aereo", "emergencias medicas aereas", "rescate aereo",
            "vuelo de urgencia", "vuelo medico", "samu aysen"
        ]
    },
    {
        "id": "espera_no_ges_n",
        "canonicalId": "wp05_camas_hospitalarias",
        "name": "Lista de Espera Consultas No GES",
        "shortName": "Lista de Espera No GES",
        "unit": "consultas",
        "hub": "salud",
        "hubTitle": "VIII. Salud",
        "nodeId": 24,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "lista de espera", "espera no ges", "consultas de especialidad", "retraso medico",
            "filas de espera", "espera hospital", "espera doctores", "tiempo para especialista"
        ]
    },
    {
        "id": "traslado_coyhaique_hrs",
        "canonicalId": "wp05_tiempo_hospital_hrs",
        "name": "Tiempo de Traslado Terrestre a Coyhaique",
        "shortName": "Tiempo a Coyhaique",
        "unit": "horas",
        "hub": "salud",
        "hubTitle": "VIII. Salud",
        "nodeId": 24,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "horas de viaje", "distancia", "aislamiento", "horas a coyhaique",
            "tiempo de viaje", "horas al hospital", "demora en llegar",
            "cuanto se demora", "distancia hospital regional"
        ]
    },
    {
        "id": "pobreza_multidim_pct",
        "canonicalId": "comuna_pobreza_casen",
        "name": "Pobreza Multidimensional CASEN",
        "shortName": "Pobreza Multidimensional",
        "unit": "% pob.",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "pobreza", "casen", "vulnerabilidad", "pobreza multidimensional",
            "carencias", "indice de pobreza", "hogares vulnerables",
            "vulnerabilidad social", "estratificacion", "desigualdad social"
        ]
    },
    {
        "id": "pobreza_ingresos_pct",
        "canonicalId": "comuna_pobreza_casen",
        "name": "Pobreza por Ingresos CASEN",
        "shortName": "Pobreza Ingresos",
        "unit": "% pob.",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "pobreza por ingresos", "ingresos", "bajos ingresos", "plata en el bolsillo",
            "linea de la pobreza", "pobreza extrema", "ingresos de hogares"
        ]
    },
    {
        "id": "poblacion_censo_2024",
        "canonicalId": "comuna_poblacion_2024",
        "name": "Población Comunal Censo 2024",
        "shortName": "Población Censo 2024",
        "unit": "habitantes",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "poblacion", "habitantes", "censo", "censo 2024", "cuanta gente",
            "personas", "demografia", "residentes", "poblacion total"
        ]
    },
    {
        "id": "densidad_hab_km2",
        "canonicalId": "comuna_poblacion_2024",
        "name": "Densidad Poblacional Comunal",
        "shortName": "Densidad hab/km²",
        "unit": "hab/km²",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "densidad", "densidad poblacional", "habitantes por kilometro cuadrado",
            "aglomeracion", "despoblamiento", "densidad demografica", "habitantes por km2"
        ]
    },
    {
        "id": "superficie_km2",
        "canonicalId": "comuna_poblacion_2024",
        "name": "Superficie Territorial Comunal",
        "shortName": "Superficie km²",
        "unit": "km²",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "superficie", "tamano de la comuna", "extension territorial", "kilometros cuadrados",
            "area comunal", "extension comunal", "km2 de la comuna"
        ]
    },
    {
        "id": "porcentaje_regional_pct",
        "canonicalId": "comuna_poblacion_2024",
        "name": "Porcentaje Regional de Población",
        "shortName": "Peso Demográfico %",
        "unit": "% regional",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "peso demografico", "porcentaje regional", "participacion regional",
            "cuanto pesa la comuna", "proporcion regional"
        ]
    },
    {
        "id": "matricula_escolar",
        "canonicalId": "wp05_matricula_slep",
        "name": "Matrícula Escolar Total SLEP",
        "shortName": "Matrícula Escolar",
        "unit": "alumnos",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 25,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "matricula", "colegios", "escuelas", "estudiantes", "alumnos",
            "slep", "slep aysen", "educacion publica", "escuelas rurales",
            "educacion basica", "educacion media"
        ]
    },
    {
        "id": "salud_principal",
        "canonicalId": "wp05_camas_hospitalarias",
        "name": "Establecimiento de Salud Principal Comunal",
        "shortName": "Centro de Salud Principal",
        "unit": "establecimiento",
        "hub": "salud",
        "hubTitle": "VIII. Salud",
        "nodeId": 24,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "hospital principal", "consultorio", "posta principal", "centro de salud comunal",
            "cesfam comunal", "hospital de aysen", "hospital de cochrane", "hospital de chile chico"
        ]
    },
    {
        "id": "aerodromo",
        "canonicalId": "wp05_aeroevacuaciones_samu",
        "name": "Aeródromo o Pista DGAC de Conectividad",
        "shortName": "Aeródromo DGAC",
        "unit": "aeródromo",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 24,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "aerodromo", "pista de aterrizaje", "aeropuerto", "dgac", "balmaceda",
            "conectividad aerea", "pista aerea", "vuelos"
        ]
    },
    {
        "id": "nombre_comuna",
        "canonicalId": "comuna_poblacion_2024",
        "name": "Nombre Oficial de la Comuna",
        "shortName": "Comuna",
        "unit": "comuna",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "comuna", "nombre comuna", "municipio", "localidad", "territorio"
        ]
    },
    {
        "id": "provincia",
        "canonicalId": "comuna_poblacion_2024",
        "name": "Provincia Administrativa",
        "shortName": "Provincia",
        "unit": "provincia",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "provincia", "provincia de aysen", "provincia general carrera",
            "provincia capitan prat", "provincia coyhaique"
        ]
    },
    {
        "id": "cabecera",
        "canonicalId": "comuna_poblacion_2024",
        "name": "Cabecera o Capital Comunal",
        "shortName": "Cabecera Comunal",
        "unit": "cabecera",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "cabecera", "capital comunal", "pueblo cabecera", "villa cabecera"
        ]
    },
    {
        "id": "id",
        "canonicalId": "comuna_poblacion_2024",
        "name": "Identificador Único Correlativo Comunal (1 a 10)",
        "shortName": "ID Comuna",
        "unit": "id",
        "hub": "social",
        "hubTitle": "VI. Sociedad: Demografía, Salud y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "id comunal", "numero de comuna", "orden comunal"
        ]
    },

    # -------------------------------------------------------------
    # 4. ENERGÍA, CALEFACCIÓN & TELECOMUNICACIONES (HUB III)
    # -------------------------------------------------------------
    {
        "id": "dias_sobre_norma_mp25",
        "canonicalId": "wp07_dias_mp25_sinca",
        "name": "Días Sobre Norma MP2.5 Calidad del Aire",
        "shortName": "Días Alerta MP2.5",
        "unit": "días/año",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 30,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "contaminacion", "humo", "aire sucio", "smog", "mp25", "mp 2.5", "mp2.5",
            "dias contaminados", "mala calidad del aire", "polucion", "alerta ambiental",
            "preemergencia", "emergencia ambiental", "sinca", "estaciones de monitoreo",
            "aire respirable", "polvo fino"
        ]
    },
    {
        "id": "hogares_lena_pct",
        "canonicalId": "wp02_calefaccion_lena_pct",
        "name": "Hogares con Calefacción a Leña",
        "shortName": "Calefacción Leña %",
        "unit": "% hogares",
        "hub": "energia",
        "hubTitle": "III. Energía y Telecomunicaciones",
        "nodeId": 13,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "lena", "estufas", "calefaccion a lena", "estufas a lena", "fuego",
            "combustion lenta", "cocina a lena", "chimenea", "quema de lena",
            "calor de hogar", "matriz de calefaccion", "uso de lena"
        ]
    },
    {
        "id": "precio_lena_m3",
        "canonicalId": "wp02_precio_lena_seca",
        "name": "Precio Metro Cúbico de Leña Seca",
        "shortName": "Precio Leña m³",
        "unit": "CLP/m³",
        "hub": "energia",
        "hubTitle": "III. Energía y Telecomunicaciones",
        "nodeId": 13,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "precio lena", "cuanto vale la lena", "costo metro cubico lena",
            "valor de la lena", "metro de lena", "lena seca", "precio del calor"
        ]
    },
    {
        "id": "saidi_horas_anual",
        "canonicalId": "wp02_saidi_horas",
        "name": "Horas de Interrupción Eléctrica (SAIDI)",
        "shortName": "Horas Cortes SAIDI",
        "unit": "horas/año",
        "hub": "energia",
        "hubTitle": "III. Energía y Telecomunicaciones",
        "nodeId": 12,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "cortes de luz", "apagones", "interrupciones electricas", "saidi",
            "corte de energia", "horas sin luz", "falla de luz", "suministro electrico",
            "estabilidad electrica", "sec", "cortes de luz anuales"
        ]
    },
    {
        "id": "tarifa_bt1_clp",
        "canonicalId": "wp02_potencia_electrica_mw",
        "name": "Tarifa Residencial Eléctrica BT1",
        "shortName": "Tarifa Eléctrica BT1",
        "unit": "CLP/kWh",
        "hub": "energia",
        "hubTitle": "III. Energía y Telecomunicaciones",
        "nodeId": 12,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "tarifa de luz", "tarifa electrica", "tarifa de electricidad", "boleta de luz", "cuenta de luz", "precio del kwh",
            "tarifa bt1", "cuanto cuesta la luz", "electricidad residencial", "precio electricidad", "precio de la luz", "valor kwh",
            "cobro electrico", "costo energia electrica"
        ]
    },
    {
        "id": "costo_diesel_aislado_clp",
        "canonicalId": "wp02_generacion_diesel_pct",
        "name": "Costo de Generación Diésel Aislado",
        "shortName": "Costo Diésel Aislado",
        "unit": "CLP/kWh",
        "hub": "energia",
        "hubTitle": "III. Energía y Telecomunicaciones",
        "nodeId": 12,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "diesel aislado", "costo diesel", "generador diesel", "motores diesel",
            "petroleo para luz", "sistemas aislados diesel", "microredes diesel",
            "generacion cara"
        ]
    },
    {
        "id": "potencia_mw",
        "canonicalId": "wp02_potencia_electrica_mw",
        "name": "Potencia Eléctrica Instalada Comunal",
        "shortName": "Potencia Eléctrica MW",
        "unit": "MW",
        "hub": "energia",
        "hubTitle": "III. Energía y Telecomunicaciones",
        "nodeId": 11,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "potencia electrica", "megawatts", "centrales electricas", "generacion electrica",
            "capacidad electrica", "hidroelectrica", "eolica", "parque eolico", "sma"
        ]
    },
    {
        "id": "gasolina_93_clp",
        "canonicalId": "wp02_precio_gasolina_93",
        "name": "Precio Gasolina 93 por Litro",
        "shortName": "Precio Bencina 93",
        "unit": "CLP/litro",
        "hub": "energia",
        "hubTitle": "III. Energía y Telecomunicaciones",
        "nodeId": 13,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "bencina", "gasolina", "combustible", "precio bencina", "precio combustible",
            "bencina 93", "litro de bencina", "bencinera", "sobrecosto combustible"
        ]
    },
    {
        "id": "internet_fijo_pct",
        "canonicalId": "wp02_internet_fijo_pct",
        "name": "Penetración de Internet Fijo Residencial",
        "shortName": "Internet Fijo %",
        "unit": "% hogares",
        "hub": "energia",
        "hubTitle": "III. Energía y Telecomunicaciones",
        "nodeId": 14,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "internet", "fibra optica", "foa", "conectividad digital", "wifi",
            "banda ancha", "internet fijo", "hogares con internet", "telecomunicaciones",
            "cobertura internet", "subtel"
        ]
    },
    {
        "id": "sistema_electrico",
        "canonicalId": "wp02_potencia_electrica_mw",
        "name": "Subsistema Eléctrico de Abastecimiento",
        "shortName": "Sistema Eléctrico",
        "unit": "subsistema",
        "hub": "energia",
        "hubTitle": "III. Energía y Telecomunicaciones",
        "nodeId": 12,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "sistema electrico", "subsistema electrico", "red electrica", "sistema mediano",
            "sistema aislado", "cobertura edelaysen"
        ]
    },
    {
        "id": "estado_foa",
        "canonicalId": "wp02_internet_fijo_pct",
        "name": "Troncal de Fibra Óptica Austral (FOA)",
        "shortName": "Troncal FOA",
        "unit": "infraestructura",
        "hub": "energia",
        "hubTitle": "III. Energía y Telecomunicaciones",
        "nodeId": 14,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "estado foa", "troncal digital", "ramal submarino", "fibra terrestre",
            "conexion troncal", "cable submarino", "conexion austral"
        ]
    },

    # -------------------------------------------------------------
    # 5. CONECTIVIDAD & VIALIDAD (HUB IV)
    # -------------------------------------------------------------
    {
        "id": "ruta7_ripio_km",
        "canonicalId": "wp01_inversion_fndr",
        "name": "Kilómetros de Ripio en Carretera Austral Ruta 7",
        "shortName": "Ruta 7 Ripio",
        "unit": "km",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 18,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "caminos de ripio", "ripio", "camino de tierra", "carretera de ripio",
            "km ripio", "ruta 7 ripio", "carretera austral ripio", "estado de caminos",
            "calamina", "baches", "caminos malos", "sin pavimento"
        ]
    },
    {
        "id": "ruta7_pavimentada_km",
        "canonicalId": "wp01_inversion_fndr",
        "name": "Kilómetros Pavimentados en Carretera Austral Ruta 7",
        "shortName": "Ruta 7 Pavimentada",
        "unit": "km",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 18,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "pavimento", "caminos pavimentados", "ruta 7 pavimentada", "asfalto",
            "carretera austral pavimentada", "km pavimento", "pavimentacion"
        ]
    },
    {
        "id": "dependencia_barcaza",
        "canonicalId": "wp01_inversion_fndr",
        "name": "Dependencia de Barcaza y Conectividad Lacustre/Marítima",
        "shortName": "Dependencia Barcaza",
        "unit": "estado",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Finanzas",
        "nodeId": 18,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "barcaza", "barcazas", "ferry", "aislamiento maritimo", "conectividad por barcaza",
            "transbordador", "cruce en barcaza", "dependencia de transbordador"
        ]
    },

    # -------------------------------------------------------------
    # 6. TURISMO & ÁREAS SILVESTRES (HUB I)
    # -------------------------------------------------------------
    {
        "id": "pernoctaciones_emat",
        "canonicalId": "wp06_pernoctaciones_emat",
        "name": "Pernoctaciones Turísticas Anuales EMAT",
        "shortName": "Pernoctaciones EMAT",
        "unit": "pernoctaciones",
        "hub": "turismo",
        "hubTitle": "I. Turismo y Áreas Silvestres",
        "nodeId": 3,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "turismo", "turistas", "pernoctaciones", "noches de hotel", "ocupacion",
            "ocupacion hotelera", "alojamiento", "emat", "temporada turistica",
            "turismo verano", "turismo invierno", "estacionalidad turistica",
            "flujo de turistas", "cuantos turistas duermen"
        ]
    },
    {
        "id": "ratio_presion_turistica",
        "canonicalId": "wp06_ratio_presion_turistica",
        "name": "Ratio de Presión Turística Estival",
        "shortName": "Presión Turística",
        "unit": "ratio turistas/hab",
        "hub": "turismo",
        "hubTitle": "I. Turismo y Áreas Silvestres",
        "nodeId": 3,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "presion turistica", "ratio presion turistica", "sobrecarga turistica",
            "turistas por habitante", "poblacion flotante", "turismo masivo",
            "saturacion turistica", "colapso turistico"
        ]
    },
    {
        "id": "visitantes_snaspe",
        "canonicalId": "wp06_visitantes_snaspe",
        "name": "Visitantes Anuales a Parques SNASPE CONAF",
        "shortName": "Visitantes Parques SNASPE",
        "unit": "visitantes",
        "hub": "turismo",
        "hubTitle": "I. Turismo y Áreas Silvestres",
        "nodeId": 4,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "parques", "visitantes", "visitantes parques", "conaf visitantes",
            "turistas en parques", "senderismo", "trekking", "visitas reservas",
            "entradas conaf", "parques nacionales visitantes", "queulat visitantes"
        ]
    },
    {
        "id": "prestadores_sernatur",
        "canonicalId": "wp06_prestadores_sernatur",
        "name": "Prestadores Turísticos Registrados SERNATUR",
        "shortName": "Prestadores SERNATUR",
        "unit": "prestadores",
        "hub": "turismo",
        "hubTitle": "I. Turismo y Áreas Silvestres",
        "nodeId": 1,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "hoteles", "prestadores", "prestadores sernatur", "guias turisticos",
            "agencias de turismo", "cabanas", "hostales", "oferta turistica",
            "servicios turisticos", "alojamientos turisticos", "camas turisticas",
            "turismo aventura", "empresas de turismo"
        ]
    },
    {
        "id": "camas_turisticas",
        "canonicalId": "wp06_prestadores_sernatur",
        "name": "Capacidad Estimada de Camas Turísticas",
        "shortName": "Camas Turísticas",
        "unit": "camas",
        "hub": "turismo",
        "hubTitle": "I. Turismo y Áreas Silvestres",
        "nodeId": 1,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "camas turisticas", "capacidad hotelera", "camas disponibles turistas",
            "plazas hoteleras", "capacidad de hospedaje"
        ]
    },
    {
        "id": "ha_snaspe_por_guardaparque",
        "canonicalId": "wp06_visitantes_snaspe",
        "name": "Hectáreas Protegidas por Guardaparque CONAF",
        "shortName": "ha por Guardaparque",
        "unit": "ha/guardaparque",
        "hub": "turismo",
        "hubTitle": "I. Turismo y Áreas Silvestres",
        "nodeId": 4,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "guardaparques", "guardaparque", "conaf guardaparques", "dotacion conaf",
            "cuidado de parques", "guardaparques por hectarea", "vigilancia ambiental",
            "guardabosques"
        ]
    },
    {
        "id": "zoit_nombre",
        "canonicalId": "wp06_prestadores_sernatur",
        "name": "Zona de Interés Turístico (ZOIT) Vinculada",
        "shortName": "Nombre ZOIT",
        "unit": "zona",
        "hub": "turismo",
        "hubTitle": "I. Turismo y Áreas Silvestres",
        "nodeId": 2,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "zoit", "zona zoit", "destino zoit", "zona de interes turistico",
            "poligono zoit", "declaratoria zoit"
        ]
    },

    # -------------------------------------------------------------
    # 7. INVERSIÓN, SEIA & ECONOMÍA (HUB V)
    # -------------------------------------------------------------
    {
        "id": "inversion_seia_mmusd",
        "canonicalId": "seia_inversion_mmusd",
        "name": "Inversión Aprobada Acumulada SEIA",
        "shortName": "Inversión SEIA MM USD",
        "unit": "MM USD",
        "hub": "inversion",
        "hubTitle": "V. Economía, Inversión y Suelo",
        "nodeId": 19,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "inversion", "seia", "plata seia", "inversion seia", "millones de dolares seia",
            "inversion ambiental", "montos seia", "dinero aprobado seia", "capital invertido",
            "rca aprobada", "proyectos evaluados", "inversion privada"
        ]
    },
    {
        "id": "proyectos_seia_aprobados",
        "canonicalId": "wp04_proyectos_seia",
        "name": "Proyectos SEIA Aprobados Históricos",
        "shortName": "Proyectos SEIA",
        "unit": "proyectos",
        "hub": "inversion",
        "hubTitle": "V. Economía, Inversión y Suelo",
        "nodeId": 19,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "proyectos", "proyectos seia", "proyectos aprobados", "declaraciones de impacto",
            "estudios de impacto", "dia", "eia", "iniciativas seia", "sea aysen"
        ]
    },
    {
        "id": "empresas_sii",
        "canonicalId": "wp04_empresas_activas_sii",
        "name": "Empresas Activas Registradas ante SII",
        "shortName": "Empresas SII",
        "unit": "empresas",
        "hub": "inversion",
        "hubTitle": "V. Economía, Inversión y Suelo",
        "nodeId": 20,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "empresas", "empresas activas", "sii", "negocios", "pymes", "microempresas",
            "comercios", "estructura empresarial", "contribuyentes"
        ]
    },
    {
        "id": "trabajadores_sii",
        "canonicalId": "wp04_trabajadores_sii",
        "name": "Trabajadores Dependientes Informados al SII",
        "shortName": "Trabajadores SII",
        "unit": "trabajadores",
        "hub": "inversion",
        "hubTitle": "V. Economía, Inversión y Suelo",
        "nodeId": 20,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "trabajadores", "empleo", "empleados", "asalariados", "trabajo dependiente",
            "fuerza laboral", "puestos de trabajo", "ocupacion laboral"
        ]
    },
    {
        "id": "concesiones_mineras_ha",
        "canonicalId": "wp03_concesiones_mineras_ha",
        "name": "Superficie de Concesiones Mineras SERNAGEOMIN",
        "shortName": "Concesiones Mineras ha",
        "unit": "ha",
        "hub": "inversion",
        "hubTitle": "V. Economía, Inversión y Suelo",
        "nodeId": 21,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "mineria", "concesiones mineras", "yacimientos", "sernageomin", "pertenencias mineras",
            "hectareas mineras", "extraccion minera", "mina", "zinc", "plomo", "oro"
        ]
    },
    {
        "id": "parcelaciones_sag_n",
        "canonicalId": "wp04_parcelaciones_sag",
        "name": "Parcelaciones Rurales Certificadas (SAG DL 3.516)",
        "shortName": "Parcelaciones SAG",
        "unit": "parcelaciones",
        "hub": "inversion",
        "hubTitle": "V. Economía, Inversión y Suelo",
        "nodeId": 22,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "parcelas", "parcelaciones", "loteos", "subdivisiones", "sag", "dl 3516",
            "loteos rurales", "venta de parcelas", "fragmentacion de suelo", "suelo agricola"
        ]
    },
    {
        "id": "compras_locales_pct",
        "canonicalId": "wp04_compras_locales_pct",
        "name": "Compras Públicas Adjudicadas a Proveedores Locales",
        "shortName": "Compras Públicas Locales %",
        "unit": "% compras",
        "hub": "inversion",
        "hubTitle": "V. Economía, Inversión y Suelo",
        "nodeId": 20,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "compras locales", "mercado publico", "proveedores locales", "licitaciones locales",
            "compras municipales locales", "fuga de compras", "compras publicas"
        ]
    },
    {
        "id": "fuga_compras_pct",
        "canonicalId": "wp04_compras_locales_pct",
        "name": "Fuga de Compras Públicas Extrarregional",
        "shortName": "Fuga Compras %",
        "unit": "% compras",
        "hub": "inversion",
        "hubTitle": "V. Economía, Inversión y Suelo",
        "nodeId": 20,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "fuga de compras", "compras fuera de la region", "plata que se va",
            "perdida de compras locales", "compras a santiago", "fuga de gasto publico"
        ]
    },
    {
        "id": "seia_plazo_dias",
        "canonicalId": "wp04_proyectos_seia",
        "name": "Plazo Promedio de Evaluación Ambiental SEIA",
        "shortName": "Plazo SEIA Días",
        "unit": "días",
        "hub": "inversion",
        "hubTitle": "V. Economía, Inversión y Suelo",
        "nodeId": 19,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "demora seia", "plazo seia", "cuanto tardan proyectos", "tiempo de aprobacion ambiental",
            "burocracia seia", "permisologia", "dias de evaluacion", "plazos de evaluacion"
        ]
    },

    # -------------------------------------------------------------
    # 8. BIODIVERSIDAD, AGUA & GLACIARES (HUB VII)
    # -------------------------------------------------------------
    {
        "id": "superficie_glaciar_km2",
        "canonicalId": "wp07_glaciares_dga",
        "name": "Superficie de Glaciares DGA",
        "shortName": "Superficie Glaciar km²",
        "unit": "km²",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 30,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "glaciares", "hielo", "campos de hielo", "ventisqueros", "hielo patagonico",
            "superficie glaciar", "campo de hielo norte", "campo de hielo sur",
            "retroceso de glaciares", "criosfera", "km2 glaciares"
        ]
    },
    {
        "id": "glaciares_dga_n",
        "canonicalId": "wp07_glaciares_dga",
        "name": "Número de Glaciares Inventariados DGA",
        "shortName": "Glaciares DGA",
        "unit": "glaciares",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 30,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "numero de glaciares", "conteo de glaciares", "glaciares inventariados",
            "inventario dga glaciares", "cuantos glaciares hay"
        ]
    },
    {
        "id": "daa_no_consuntivos_m3s",
        "canonicalId": "wp07_glaciares_dga",
        "name": "Derechos de Aguas No Consuntivos (DGA)",
        "shortName": "DAA No Consuntivos m³/s",
        "unit": "m³/s",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 30,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "agua", "derechos de agua", "daa", "no consuntivos", "caudal hidraulico",
            "hidroelectricidad agua", "dga aguas", "caudal reservado", "rios", "rio baker",
            "rio simpson", "cuencas"
        ]
    },
    {
        "id": "daa_consuntivos_m3s",
        "canonicalId": "wp07_glaciares_dga",
        "name": "Derechos de Aguas Consuntivos (DGA)",
        "shortName": "DAA Consuntivos m³/s",
        "unit": "m³/s",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 30,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "agua consuntiva", "riego", "agua potable rural", "apr", "extraccion de agua",
            "consumo de agua", "derechos consuntivos"
        ]
    },
    {
        "id": "superficie_snaspe_pct",
        "canonicalId": "comuna_snaspe_pct",
        "name": "Porcentaje Comunal en Áreas Protegidas SNASPE",
        "shortName": "Superficie SNASPE %",
        "unit": "% territorio",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 22,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "protegido", "snaspe", "areas protegidas", "parques nacionales", "reservas nacionales",
            "conservacion", "superficie protegida", "territorio protegido", "conaf parques",
            "santuario de la naturaleza", "monumento natural"
        ]
    },
    {
        "id": "unidades_snaspe",
        "canonicalId": "comuna_snaspe_pct",
        "name": "Unidades de Parques y Reservas SNASPE en la Comuna",
        "shortName": "Unidades SNASPE",
        "unit": "unidades",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 4,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "parques de la comuna", "reservas de la comuna", "monumentos naturales comunales",
            "queulat", "cerro castillo", "laguna san rafael", "patagonia parque"
        ]
    },
    {
        "id": "cuenca_bna",
        "canonicalId": "wp07_glaciares_dga",
        "name": "Cuenca Hidrográfica Principal (DGA / BNA)",
        "shortName": "Cuenca DGA",
        "unit": "cuenca",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 30,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "cuenca", "cuenca hidrografica", "bna", "cuenca dga", "rio principal",
            "cuenca del rio", "cuenca 113", "cuenca 115"
        ]
    },
    {
        "id": "cobertura_vegetal_nativa_ha",
        "canonicalId": "wp07_cobertura_vegetal_ha",
        "name": "Cobertura de Bosque y Flora Nativa",
        "shortName": "Flora Nativa ha",
        "unit": "ha",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 27,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "bosque nativo", "flora nativa", "cobertura vegetal", "lengas", "coihues",
            "cipres de las guaytecas", "arboles nativos", "vegetacion", "selva fria",
            "bosque templado"
        ]
    },
    {
        "id": "cobertura_vegetal_pct",
        "canonicalId": "wp07_cobertura_vegetal_ha",
        "name": "Porcentaje de Cobertura Vegetal Nativa",
        "shortName": "Cobertura Vegetal %",
        "unit": "% territorio",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 27,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "porcentaje vegetacion", "porcentaje de bosque", "cobertura verde",
            "boscosidad", "porcentaje vegetal", "bosque nativo porcentaje"
        ]
    },
    {
        "id": "fauna_amenazada_n",
        "canonicalId": "wp07_cobertura_vegetal_ha",
        "name": "Especies de Fauna Amenazada en Categoría RCE",
        "shortName": "Fauna Amenazada",
        "unit": "especies",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 28,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "fauna", "animales", "especies amenazadas", "huemul", "huemules", "pudor",
            "carpintero negro", "ranita de darwin", "conservacion fauna", "rce mma",
            "peligro de extincion", "biodiversidad animal"
        ]
    },

    # -------------------------------------------------------------
    # 9. DIMENSIÓN CORPORATIVA & HOLDINGS SALMONEROS
    # -------------------------------------------------------------
    {
        "id": "holding_concesiones",
        "canonicalId": "holding_concesiones",
        "name": "Concesiones Estimadas por Holding Matriz",
        "shortName": "Concesiones por Holding",
        "unit": "concesiones",
        "hub": "salmonicultura",
        "hubTitle": "II. Pesca, Acuicultura y Mar",
        "nodeId": 7,
        "dim": "holding",
        "outlierBiased": False,
        "synonyms": [
            "concesiones por holding", "jaulas por empresa", "ranking de salmoneras",
            "concesiones de aquachile", "concesiones de mowi", "quien tiene mas concesiones",
            "holding con mas concesiones", "salmoneras mas grandes"
        ]
    },
    {
        "id": "holding_pct",
        "canonicalId": "holding_pct",
        "name": "Porcentaje Regional de Concesiones por Holding",
        "shortName": "% Regional Holding",
        "unit": "% regional",
        "hub": "salmonicultura",
        "hubTitle": "II. Pesca, Acuicultura y Mar",
        "nodeId": 7,
        "dim": "holding",
        "outlierBiased": False,
        "synonyms": [
            "concentracion salmonera", "porcentaje por holding", "cuota de mercado salmonero",
            "participacion de mercado salmon", "monopolio salmonero", "control salmonero"
        ]
    },

    # -------------------------------------------------------------
    # 10. DIMENSIÓN TEMPORAL & SERIES PROSPECTIVAS
    # -------------------------------------------------------------
    {
        "id": "mp25_invernal_coyhaique",
        "canonicalId": "mp25_invernal_coyhaique",
        "name": "Serie Histórica y Proyección MP2.5 Invernal Coyhaique",
        "shortName": "MP2.5 Coyhaique Histórico",
        "unit": "µg/m³",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 30,
        "dim": "tiempo",
        "outlierBiased": True,
        "synonyms": [
            "evolucion de contaminacion en coyhaique", "historia mp25", "serie historica mp25",
            "contaminacion en el tiempo", "tendencia mp25 coyhaique", "mp25 2015 2026"
        ]
    },
    {
        "id": "caudal_baker_bertrand",
        "canonicalId": "caudal_baker_bertrand",
        "name": "Serie Caudal Histórico y Proyectado Río Baker en Bertrand",
        "shortName": "Caudal Baker Histórico",
        "unit": "m³/s",
        "hub": "biodiversidad",
        "hubTitle": "VII. Biodiversidad y Medio Ambiente",
        "nodeId": 30,
        "dim": "tiempo",
        "outlierBiased": False,
        "synonyms": [
            "evolucion caudal baker", "historico rio baker", "caudal baker en el tiempo",
            "crecida baker historica", "tendencia caudal baker"
        ]
    },
    # -------------------------------------------------------------
    # NUEVAS VARIABLES VERIFICADAS (AUDITORÍA NOV 2026: CPLT, ROYALTY, GORE FNDR, BIDAT RSH, SUBTEL JUN 2026, SERVEL)
    # -------------------------------------------------------------
    {
        "id": "transparencia_activa_cplt_2026_pct",
        "canonicalId": "comuna_alcalde",
        "name": "Cumplimiento de Transparencia Activa Municipal 2026 (CPLT)",
        "shortName": "Transparencia CPLT 2026",
        "unit": "% cumplimiento",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Política",
        "nodeId": 15,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "transparencia", "transparencia activa", "cplt", "consejo para la transparencia",
            "fiscalizacion municipal", "probidad municipal", "indice transparencia"
        ]
    },
    {
        "id": "fet_royalty_minero_2025_mclp",
        "canonicalId": "comuna_fcm_pct",
        "name": "Fondo de Equidad Territorial (FET) Royalty Minero 2025",
        "shortName": "Royalty Minero FET 2025",
        "unit": "M$ CLP",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Política",
        "nodeId": 16,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "royalty", "royalty minero", "fondo de equidad territorial", "fet",
            "transferencias royalty", "ley royalty minero"
        ]
    },
    {
        "id": "fet_royalty_minero_2024_mclp",
        "canonicalId": "comuna_fcm_pct",
        "name": "Fondo de Equidad Territorial (FET) Royalty Minero 2024",
        "shortName": "Royalty Minero FET 2024",
        "unit": "M$ CLP",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Política",
        "nodeId": 16,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "royalty 2024", "fet 2024", "royalty minero 2024"
        ]
    },
    {
        "id": "ingresos_mun_bcn_2025_mclp",
        "canonicalId": "comuna_presupuesto_mclp",
        "name": "Ingresos Municipales Percibidos SINIM/BCN 2025",
        "shortName": "Ingresos Mun. 2025",
        "unit": "M$ CLP",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Política",
        "nodeId": 15,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "ingresos municipales 2025", "ingresos totales bcn", "ingresos percibidos municipio"
        ]
    },
    {
        "id": "fndr_gore_2023_ejecutado_mclp",
        "canonicalId": "comuna_fndr_mclp",
        "name": "Inversión FNDR GORE Ejecutada por Comuna (datos.gob.cl 2023)",
        "shortName": "FNDR Ejecutado Comunal",
        "unit": "M$ CLP",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Política",
        "nodeId": 18,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "fndr ejecutado", "gasto actual fndr", "inversion gore ejecutada", "datos gob fndr"
        ]
    },
    {
        "id": "fndr_gore_2023_asignado_mclp",
        "canonicalId": "comuna_fndr_mclp",
        "name": "Inversión FNDR GORE Asignada por Comuna (datos.gob.cl 2023)",
        "shortName": "FNDR Asignado Comunal",
        "unit": "M$ CLP",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Política",
        "nodeId": 18,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "fndr asignado comunal", "cartera fndr por comuna", "asignacion gore"
        ]
    },
    {
        "id": "fndr_gore_2023_ejecucion_pct",
        "canonicalId": "comuna_fndr_mclp",
        "name": "Tasa de Ejecución Presupuestaria FNDR por Comuna (%)",
        "shortName": "Ejecución FNDR %",
        "unit": "%",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Política",
        "nodeId": 18,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "tasa ejecucion fndr", "porcentaje ejecucion fndr", "cumplimiento gasto gore"
        ]
    },
    {
        "id": "fndr_gore_2023_proyectos_n",
        "canonicalId": "comuna_fndr_mclp",
        "name": "Iniciativas de Inversión FNDR GORE Financiadas (N)",
        "shortName": "Proyectos FNDR GORE",
        "unit": "proyectos",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Política",
        "nodeId": 18,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "proyectos fndr", "iniciativas fndr", "cantidad proyectos gore"
        ]
    },
    {
        "id": "fondos_concursables_gore_2023_n",
        "canonicalId": "comuna_fndr_mclp",
        "name": "Proyectos Adjudicados Fondos Concursables Comunitarios GORE (8%)",
        "shortName": "Fondos 8% GORE (N)",
        "unit": "proyectos",
        "hub": "social",
        "hubTitle": "VI. Social y Educación",
        "nodeId": 18,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "fondos concursables", "fondo 8 porciento", "8% fndr", "subvenciones comunitarias gore",
            "vinculacion con la comunidad", "fondo social gore"
        ]
    },
    {
        "id": "fondos_concursables_gore_2023_mclp",
        "canonicalId": "comuna_fndr_mclp",
        "name": "Monto Adjudicado Fondos Concursables Comunitarios GORE (M$)",
        "shortName": "Monto Fondos 8% (M$)",
        "unit": "M$ CLP",
        "hub": "social",
        "hubTitle": "VI. Social y Educación",
        "nodeId": 18,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "monto fondos concursables", "plata 8 porciento", "millones fondos 8%"
        ]
    },
    {
        "id": "participacion_presidencial_2025_2v_pct",
        "canonicalId": "comuna_alcalde",
        "name": "Participación Electoral 2da Vuelta Presidencial Dic 2025 (SERVEL)",
        "shortName": "Participación 2V 2025",
        "unit": "%",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Política",
        "nodeId": 17,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "participacion electoral 2025", "voto obligatorio", "eleccion presidencial 2025",
            "participacion segunda vuelta", "votantes 2025"
        ]
    },
    {
        "id": "padron_electoral_nov_2025",
        "canonicalId": "comuna_alcalde",
        "name": "Padrón Electoral Definitivo Noviembre 2025 (SERVEL)",
        "shortName": "Padrón Electoral 2025",
        "unit": "electores",
        "hub": "gobernanza",
        "hubTitle": "IV. Gobernanza y Política",
        "nodeId": 17,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "padron electoral", "habilitados para votar", "inscritos votar 2025"
        ]
    },
    {
        "id": "rsh_carencia_servicios_basicos_jun2026_pct",
        "canonicalId": "comuna_pobreza_pct",
        "name": "Personas en Hogares Carentes de Servicios Básicos (RSH Jun 2026)",
        "shortName": "Carencia Serv. Básicos RSH",
        "unit": "%",
        "hub": "social",
        "hubTitle": "VI. Social y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "carencia servicios basicos", "servicios basicos rsh", "bidat rsh",
            "hogares sin servicios basicos", "registro social de hogares"
        ]
    },
    {
        "id": "rsh_hacinamiento_jun2026_pct",
        "canonicalId": "comuna_pobreza_pct",
        "name": "Hogares Hacinados en Registro Social de Hogares (Jun 2026)",
        "shortName": "Hacinamiento RSH 2026",
        "unit": "%",
        "hub": "social",
        "hubTitle": "VI. Social y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "hacinamiento rsh", "hogares hacinados", "hacinamiento junio 2026"
        ]
    },
    {
        "id": "ruralidad_censo_2024_pct",
        "canonicalId": "comuna_poblacion_2024",
        "name": "Porcentaje de Población Rural Censo 2024 (INE)",
        "shortName": "Ruralidad Censo 2024",
        "unit": "%",
        "hub": "social",
        "hubTitle": "VI. Social y Educación",
        "nodeId": 23,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "ruralidad", "poblacion rural", "porcentaje rural censo 2024", "rural aysen"
        ]
    },
    {
        "id": "conexiones_fijas_subtel_jun2026_n",
        "canonicalId": "wp02_internet_fijo_pct",
        "name": "Conexiones Totales de Internet Fija SUBTEL (Junio 2026)",
        "shortName": "Conexiones Fijas SUBTEL",
        "unit": "conexiones",
        "hub": "energia",
        "hubTitle": "III. Energía y Conectividad",
        "nodeId": 14,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "conexiones subtel", "conexiones internet fija", "subtel junio 2026",
            "ftth", "fibra optica", "starlink", "accesos internet fijo"
        ]
    },
    {
        "id": "conexiones_residenciales_subtel_jun2026_n",
        "canonicalId": "wp02_internet_fijo_pct",
        "name": "Conexiones Residenciales de Internet Fija SUBTEL (Junio 2026)",
        "shortName": "Conexiones Resid. SUBTEL",
        "unit": "conexiones",
        "hub": "energia",
        "hubTitle": "III. Energía y Conectividad",
        "nodeId": 14,
        "dim": "comuna",
        "outlierBiased": True,
        "synonyms": [
            "internet residencial subtel", "hogares internet fijo subtel"
        ]
    },
    {
        "id": "variacion_conexiones_2015_2026_pct",
        "canonicalId": "wp02_internet_fijo_pct",
        "name": "Crecimiento Conexiones Fijas de Internet 2015–Jun 2026 (SUBTEL)",
        "shortName": "Crecimiento Internet 15-26",
        "unit": "%",
        "hub": "energia",
        "hubTitle": "III. Energía y Conectividad",
        "nodeId": 14,
        "dim": "comuna",
        "outlierBiased": False,
        "synonyms": [
            "crecimiento internet", "expansion conectividad digital", "aumento fibra optica"
        ]
    }
]

# -------------------------------------------------------------
# NODOS SATÉLITES (#01 a #31)
# -------------------------------------------------------------
satellite_nodes = [
    {"id": 1, "hub": "turismo", "title": "Prestadores Registrados SERNATUR", "chartType": "bar", "synonyms": ["prestadores sernatur", "servicios turisticos", "alojamientos turisticos", "guias turisticos", "camas hoteleras"]},
    {"id": 2, "hub": "turismo", "title": "Zonas de Interes Turistico (4 ZOIT)", "chartType": "bar", "synonyms": ["zoit", "zonas zoit", "destino coyhaique", "aysen queulat", "chelenko", "provincia de los glaciares"]},
    {"id": 3, "hub": "turismo", "title": "Pernoctaciones y Estacionalidad (EMAT)", "chartType": "line", "synonyms": ["emat", "pernoctaciones mensuales", "estacionalidad turistica", "ocupacion hotelera", "curva mensual pernoctaciones"]},
    {"id": 4, "hub": "turismo", "title": "Visitantes a Parques Nacionales (CONAF)", "chartType": "bar", "synonyms": ["visitantes conaf", "visitas parques", "parque queulat", "laguna san rafael", "cerro castillo"]},
    {"id": 5, "hub": "turismo", "title": "Atractivos y Nodos Turisticos Georreferenciados", "chartType": "doughnut", "synonyms": ["atractivos turisticos", "puntos turisticos", "destinos ancla", "hitos geograficos"]},
    {"id": 6, "hub": "salmonicultura", "title": "Concesiones de Acuicultura por Comuna (745)", "chartType": "bar", "synonyms": ["745 concesiones", "concesiones de acuicultura comunales", "jaulas salmoneras por comuna", "distribucion concesiones"]},
    {"id": 7, "hub": "salmonicultura", "title": "Matriz de 13 Holdings Madres y Concesiones", "chartType": "bar", "synonyms": ["12 holdings", "13 holdings", "holdings salmoneros", "duenos de las concesiones", "aquachile", "mowi", "consorcios salmoneros"]},
    {"id": 8, "hub": "salmonicultura", "title": "Barrios Sanitarios (ACS) y Caletas Pesqueras", "chartType": "bar", "synonyms": ["barrios sanitarios", "acs", "caletas pesqueras", "agrupaciones de concesiones"]},
    {"id": 9, "hub": "salmonicultura", "title": "Monitoreo Marino, Oxígeno Disuelto y FAN", "chartType": "line", "synonyms": ["oxigeno disuelto", "marea roja", "fan", "floraciones algales", "monitoreo marino"]},
    {"id": 10, "hub": "salmonicultura", "title": "Pesca Industrial por Pesquería e Impuesto Específico (Art. 43 ter)", "chartType": "bar", "synonyms": ["pesca industrial", "impuesto especifico pesca", "merluza del sur", "congrio dorado", "art 43 ter"]},
    {"id": 11, "hub": "energia", "title": "Generacion y Centrales Electricas", "chartType": "doughnut", "synonyms": ["centrales electricas", "matriz electrica", "generacion hidraulica", "generacion eolica", "generacion termica"]},
    {"id": 12, "hub": "energia", "title": "Sistemas Electricos Medianos y Aislados", "chartType": "bar", "synonyms": ["sistemas electricos", "sistema mediano aysen", "sistemas aislados", "edelaysen", "microredes"]},
    {"id": 13, "hub": "energia", "title": "Precios de Combustibles y Lena por Comuna (CNE)", "chartType": "bar", "synonyms": ["precios combustibles cne", "bencina en linea", "precio lena comunal", "sobrecosto patagonico"]},
    {"id": 14, "hub": "energia", "title": "Fibra Optica Austral (FOA) y Telecomunicaciones", "chartType": "bar", "synonyms": ["foa", "fibra optica austral", "ramal submarino", "telecomunicaciones aysen", "troncal digital"]},
    {"id": 15, "hub": "gobernanza", "title": "Presupuestos Municipales y Patentes (SINIM)", "chartType": "bar", "synonyms": ["presupuestos municipales sinim", "finanzas municipales", "ingresos propios sinim", "patentes sinim"]},
    {"id": 16, "hub": "gobernanza", "title": "Dependencia del Fondo Comun Municipal (FCM)", "chartType": "bar", "synonyms": ["dependencia fcm comunal", "fondo comun municipal aysen", "ranking dependencia fcm"]},
    {"id": 17, "hub": "gobernanza", "title": "Alcaldes (2024-2028), Concejos y Participacion", "chartType": "bar", "synonyms": ["alcaldes electos", "servel 2024", "participacion electoral", "partidos alcaldes"]},
    {"id": 18, "hub": "gobernanza", "title": "Inversion Publica FNDR y Conectividad Ruta 7", "chartType": "bar", "synonyms": ["fndr gore", "carretera austral", "pavimentacion muelle", "inversion publica territorial"]},
    {"id": 19, "hub": "inversion", "title": "Proyectos de Inversion en el SEIA (RCA)", "chartType": "bar", "synonyms": ["seia aysen", "proyectos rca", "inversion acumulada seia", "sea aysen cartera"]},
    {"id": 20, "hub": "inversion", "title": "Empresas, Empleo y Ventas por Rubro (SII)", "chartType": "doughnut", "synonyms": ["empresas sii", "empleo dependiente", "ventas sii", "rubros economicos aysen"]},
    {"id": 21, "hub": "inversion", "title": "Concesiones Mineras y Yacimientos (SERNAGEOMIN)", "chartType": "bar", "synonyms": ["mineria sernageomin", "yacimientos polimetalicos", "pertenencias mineras aysen"]},
    {"id": 22, "hub": "inversion", "title": "Tenencia de Suelo Fiscal, SNASPE y Privada (BBNN / CONAF)", "chartType": "bar", "synonyms": ["suelo fiscal", "bienes nacionales", "propiedad fiscal vs privada", "tierras fiscales"]},
    {"id": 23, "hub": "social", "title": "Demografia Censo 2024 y Pobreza CASEN", "chartType": "bar", "synonyms": ["censo 2024 aysen", "poblacion comunal", "pobreza casen multidimensional"]},
    {"id": 24, "hub": "social", "title": "Red Asistencial de Salud y Evacuacion SAMU", "chartType": "bar", "synonyms": ["red asistencial salud", "camas deis", "samu aeroevacuaciones", "hospital regional coyhaique"]},
    {"id": 25, "hub": "social", "title": "Educacion Publica (SLEP Aysen) y Superior", "chartType": "bar", "synonyms": ["slep aysen", "educacion publica", "matricula escolar", "escuelas multigrado"]},
    {"id": 26, "hub": "social", "title": "Seguridad Ciudadana y Delitos (CEAD / VIF)", "chartType": "bar", "synonyms": ["seguridad ciudadana", "delitos cead", "violencia intrafamiliar", "tasa vif"]},
    {"id": 27, "hub": "biodiversidad", "title": "Cobertura Forestal y Flora Nativa (CONAF SIT / MMA)", "chartType": "bar", "synonyms": ["bosque nativo conaf", "flora nativa aysen", "pisos vegetacionales", "cobertura arborea"]},
    {"id": 28, "hub": "biodiversidad", "title": "Fauna Silvestre y Especies en Categoria de Conservacion (RCE MMA)", "chartType": "doughnut", "synonyms": ["fauna emblematica", "huemul patagonia", "conservacion rce", "especies vulnerables"]},
    {"id": 29, "hub": "biodiversidad", "title": "Especies Exoticas Invasoras y Presion Ecologica", "chartType": "bar", "synonyms": ["especies invasoras", "vison americano", "castor", "rosa mosqueta", "presion ecologica"]},
    {"id": 30, "hub": "biodiversidad", "title": "Monitoreo Continuo de Calidad del Aire (SINCA) e Hidrología (DGA)", "chartType": "line", "synonyms": ["calidad del aire sinca", "mp25 coyhaique", "caudales dga", "hidrologia cuencas"]},
    {"id": 31, "hub": "biodiversidad", "title": "Complejos Volcanicos Activos (RNVV), Sismos (USGS) y Red de Estaciones", "chartType": "bar", "synonyms": ["volcan hudson", "sismicidad usgs", "volcanes activos", "falla liquidquiñe", "rnvv sernageomin"]}
]

# Modos e Intenciones
intent_keywords = {
    "temporal": [
        "tiempo", "historia", "evolucion", "anos", "ano", "meses", "2015", "2016", "2017",
        "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2030",
        "historico", "mensual", "anual", "tendencia", "proyeccion", "estacionalidad", "mes a mes",
        "a lo largo del tiempo", "linea de tiempo"
    ],
    "holding": [
        "holding", "holdings", "duenos", "dueños", "aquachile", "aqua chile",
        "mowi", "multix", "multi x", "australis", "blumar", "camanchaca", "corporativo",
        "matrices", "filiales", "consorcio", "grupos empresariales", "grupos economicos",
        "holding salmonero", "empresas salmoneras"
    ],
    "scatter": [
        "dispersion", "correlacion", "cruce", "relacion", "frente a", "vs", "versus",
        "afecta a", "impacta en", "se relaciona con", "contra"
    ],
    "bar": [
        "ranking", "barras", "comparar", "comparativa", "por comuna", "comunal",
        "distribucion", "quien tiene mas", "quien tiene menos", "las 10 comunas"
    ],
    "exclude_coyhaique": [
        "sin coyhaique", "excluir coyhaique", "sacar coyhaique", "sin la capital",
        "quitar coyhaique", "aislado", "rural", "sin capital regional", "solo comunas pequenas"
    ]
}

stopwords = [
    "quiero", "quisiera", "mostrar", "mostrame", "muestrame", "mezclar", "ver", "graficar",
    "comparar", "entre", "con", "vs", "versus", "de", "la", "el", "los", "las", "un", "una",
    "unos", "unas", "en", "por", "y", "o", "que", "como", "cual", "cuales", "a", "al", "del",
    "para", "sobre", "me", "podrias", "puedes", "dame", "cuanto", "cuanta", "cuantos", "cuantas",
    "grafico", "grafica", "datos", "indicadores", "graficarme", "dime", "porfa", "favor"
]

REQUIRED_SYNONYMS_BY_VAR = {
    # 1. Salmonicultura
    "concesiones_salmon": ["concesiones", "jaulas", "salmones", "salmoneras", "cultivo de salmon", "concesiones de salmon", "concesiones de salmones", "concesiones salmoneras", "jaulas de salmoneras", "jaulas marinas", "balsas jaulas"],
    "biomasa_salmon_ton": ["biomasa", "biomasa de salmon", "biomasa de salmones", "biomasa salmon", "biomasa cosechada", "cosecha de salmon", "cosecha de salmones", "toneladas de salmon", "produccion de salmon"],
    # 2. Finanzas Municipales
    "presupuesto_mclp": ["presupuesto", "plata municipal", "presupuesto municipal", "fondos municipales", "gasto municipal"],
    "ipp_per_capita_clp": ["patentes", "pago de patente", "pago de patentes", "ingresos propios", "ingresos propios permanentes", "ipp", "ipp per capita", "patentes municipales"],
    "presupuesto_per_capita_mclp": ["presupuesto per capita", "presupuesto por habitante", "plata por persona", "recursos por habitante"],
    # 3. Salud
    "urgencias_respiratorias_pct": ["problemas respiratorios", "urgencias", "urgencias respiratorias", "enfermedades de invierno", "bronquitis", "crisis respiratoria"],
    "camas_hospitalarias": ["hospitalizados", "camas", "camas hospitalarias", "hospitales", "hospital", "red hospitalaria"],
    # 4. Calefacción y Contaminación
    "dias_sobre_norma_mp25": ["contaminacion", "humo", "aire sucio", "smog", "mp25", "mp 2.5", "mp2.5", "dias contaminados", "alerta ambiental"],
    "hogares_lena_pct": ["lena", "estufas", "calefaccion a lena", "estufas a lena", "quema de lena"],
    "precio_lena_m3": ["precio lena", "precio de lena", "cuanto vale la lena", "costo metro cubico lena", "metro de lena", "lena seca"],
    # 5. Electricidad
    "saidi_horas_anual": ["cortes de luz", "apagones", "interrupciones electricas", "saidi", "horas sin luz", "falla de luz"],
    "tarifa_bt1_clp": ["tarifa de luz", "tarifa electrica", "tarifa de electricidad", "tarifa bt1", "boleta de luz", "precio del kwh", "tarifa electrica bt1", "cuanto cuesta la luz", "precio electricidad", "precio de la luz", "valor kwh"],
    "costo_diesel_aislado_clp": ["costo diesel", "diesel aislado", "generador diesel", "sistemas aislados diesel"],
    # 6. Conectividad
    "ruta7_ripio_km": ["caminos de ripio", "ripio", "camino de tierra", "carretera de ripio", "ruta 7 ripio", "carretera austral ripio"],
    "traslado_coyhaique_hrs": ["aislamiento", "horas de viaje", "distancia", "horas a coyhaique", "tiempo de viaje", "horas al hospital"],
    "ruta7_pavimentada_km": ["carretera austral", "pavimento", "caminos pavimentados", "ruta 7 pavimentada", "asfalto", "carretera austral pavimentada"],
    # 7. Turismo
    "pernoctaciones_emat": ["turismo", "turistas", "pernoctaciones", "noches de hotel", "ocupacion", "ocupacion hotelera", "alojamiento", "emat"],
    "ratio_presion_turistica": ["presion turistica", "ratio presion turistica", "sobrecarga turistica", "turistas por habitante", "poblacion flotante"],
    "visitantes_snaspe": ["parques", "visitantes", "visitantes parques", "conaf visitantes", "turistas en parques", "visitas reservas"],
    "prestadores_sernatur": ["hoteles", "prestadores", "prestadores sernatur", "guias turisticos", "alojamientos turisticos"],
    # 8. Pobreza
    "pobreza_multidim_pct": ["pobreza", "casen", "vulnerabilidad", "pobreza multidimensional", "pobreza casen"],
    "pobreza_ingresos_pct": ["ingresos", "pobreza por ingresos", "bajos ingresos", "linea de la pobreza"],
    # 9. Fondo Común Municipal
    "dependencia_fcm_pct": ["dependencia", "fcm", "fondo comun municipal", "fondo comun", "aporte del estado", "dependencia municipal", "dependencia del fcm"],
    # 10. Inversión SEIA
    "inversion_seia_mmusd": ["inversion", "plata seia", "inversion seia", "millones de dolares seia", "inversion seia mmusd"],
    "proyectos_seia_aprobados": ["seia", "proyectos", "proyectos seia", "proyectos aprobados", "declaraciones de impacto", "dia", "eia"],
    # 11. Criosfera y Agua
    "superficie_glaciar_km2": ["glaciares", "hielo", "campos de hielo", "ventisqueros", "hielo patagonico", "superficie glaciar"],
    "daa_no_consuntivos_m3s": ["agua", "derechos de agua", "daa", "no consuntivos", "caudal hidraulico"],
    # 12. Guardaparques y SNASPE
    "ha_snaspe_por_guardaparque": ["guardaparques", "guardaparque", "conaf", "conaf guardaparques", "dotacion conaf"],
    "superficie_snaspe_pct": ["protegido", "snaspe", "areas protegidas", "parques nacionales", "reservas nacionales", "territorio protegido"],
    # 13. Salud y Emergencias
    "medicos_por_mil_hab": ["medicos", "doctores", "posta", "salud", "atencion medica", "medicos por mil habitantes", "postas rurales"],
    "aeroevacuaciones_samu_n": ["samu", "aeroevacuaciones", "evacuacion medica", "avion ambulancia", "traslado aereo", "aeroevacuaciones samu"],
    "espera_no_ges_n": ["espera", "lista de espera", "espera no ges", "consultas de especialidad"]
}

ADDITIONAL_CANONICAL_VARIABLES = [
    # Hub I - Turismo
    {"id": "visitas_por_cama_turistica", "canonicalId": "visitas_por_cama_turistica", "name": "Visitas por Cama Turística", "shortName": "Visitas por Cama", "unit": "visitas/cama", "hub": "turismo", "hubTitle": "I. Turismo y Áreas Silvestres", "nodeId": 3, "dim": "comuna", "outlierBiased": False, "synonyms": ["visitas por cama", "rotacion camas turisticas"]},
    {"id": "visitas_por_pernoctacion_ratio", "canonicalId": "visitas_por_pernoctacion_ratio", "name": "Ratio Visitas por Pernoctación", "shortName": "Visitas / Pernoctación", "unit": "ratio", "hub": "turismo", "hubTitle": "I. Turismo y Áreas Silvestres", "nodeId": 3, "dim": "comuna", "outlierBiased": False, "synonyms": ["visitas por pernoctacion", "ratio visitas pernoctacion"]},
    {"id": "visitantes_extranjeros_pct", "canonicalId": "visitantes_extranjeros_pct", "name": "Proporción de Visitantes Extranjeros SNASPE", "shortName": "Visitantes Extranjeros %", "unit": "%", "hub": "turismo", "hubTitle": "I. Turismo y Áreas Silvestres", "nodeId": 4, "dim": "comuna", "outlierBiased": False, "synonyms": ["visitantes extranjeros", "turistas extranjeros", "porcentaje extranjeros parques"]},
    {"id": "visitantes_extranjeros_snaspe_n", "canonicalId": "visitantes_extranjeros_snaspe_n", "name": "Número de Visitantes Extranjeros SNASPE", "shortName": "Extranjeros SNASPE", "unit": "visitantes", "hub": "turismo", "hubTitle": "I. Turismo y Áreas Silvestres", "nodeId": 4, "dim": "comuna", "outlierBiased": False, "synonyms": ["numero turistas extranjeros", "extranjeros en parques"]},
    {"id": "tasa_ocupacion_estival_pct", "canonicalId": "tasa_ocupacion_estival_pct", "name": "Tasa de Ocupación Hotelera Estival", "shortName": "Ocupación Estival", "unit": "%", "hub": "turismo", "hubTitle": "I. Turismo y Áreas Silvestres", "nodeId": 3, "dim": "comuna", "outlierBiased": False, "synonyms": ["ocupacion estival", "ocupacion verano", "tasa ocupacion estival"]},
    {"id": "tasa_ocupacion_invernal_pct", "canonicalId": "tasa_ocupacion_invernal_pct", "name": "Tasa de Ocupación Hotelera Invernal", "shortName": "Ocupación Invernal", "unit": "%", "hub": "turismo", "hubTitle": "I. Turismo y Áreas Silvestres", "nodeId": 3, "dim": "comuna", "outlierBiased": False, "synonyms": ["ocupacion invernal", "ocupacion invierno", "temporada baja"]},
    {"id": "concentracion_estival_pct", "canonicalId": "concentracion_estival_pct", "name": "Concentración Turística Estival", "shortName": "Concentración Estival", "unit": "%", "hub": "turismo", "hubTitle": "I. Turismo y Áreas Silvestres", "nodeId": 3, "dim": "comuna", "outlierBiased": False, "synonyms": ["estacionalidad turistica", "concentracion estival"]},
    {"id": "estadia_promedio_dias", "canonicalId": "estadia_promedio_dias", "name": "Estadía Turística Promedio", "shortName": "Estadía Promedio", "unit": "días", "hub": "turismo", "hubTitle": "I. Turismo y Áreas Silvestres", "nodeId": 3, "dim": "comuna", "outlierBiased": False, "synonyms": ["estadia promedio", "dias de estadia", "noches promedio turista"]},
    {"id": "gasto_diario_turista_usd", "canonicalId": "gasto_diario_turista_usd", "name": "Gasto Diario Promedio por Turista", "shortName": "Gasto Diario Turista", "unit": "US$/día", "hub": "turismo", "hubTitle": "I. Turismo y Áreas Silvestres", "nodeId": 3, "dim": "comuna", "outlierBiased": False, "synonyms": ["gasto diario turista", "gasto turista", "dolares por turista"]},
    {"id": "tarifa_adr_estimada_usd", "canonicalId": "tarifa_adr_estimada_usd", "name": "Tarifa Diaria Promedio Hotelera (ADR)", "shortName": "Tarifa Hotelera ADR", "unit": "US$", "hub": "turismo", "hubTitle": "I. Turismo y Áreas Silvestres", "nodeId": 3, "dim": "comuna", "outlierBiased": False, "synonyms": ["tarifa adr", "precio hotel", "tarifa hotelera"]},
    {"id": "revpar_estimado_usd", "canonicalId": "revpar_estimado_usd", "name": "Ingreso por Habitación Disponible (RevPAR)", "shortName": "RevPAR", "unit": "US$", "hub": "turismo", "hubTitle": "I. Turismo y Áreas Silvestres", "nodeId": 3, "dim": "comuna", "outlierBiased": False, "synonyms": ["revpar", "ingreso por habitacion"]},
    # Hub III y IV - Conectividad, Energía y Transporte
    {"id": "largo_pista_aerodromo_m", "canonicalId": "largo_pista_aerodromo_m", "name": "Largo de Pista de Aeródromo", "shortName": "Pista Aeródromo", "unit": "metros", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["largo pista", "pista aerodromo", "aerodromo pista"]},
    {"id": "operaciones_aerodromo_interior_anual", "canonicalId": "operaciones_aerodromo_interior_anual", "name": "Operaciones Aéreas Anuales en Aeródromo", "shortName": "Operaciones Aéreas", "unit": "operaciones", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["operaciones aereas", "vuelos locales", "trafico aerodromo"]},
    {"id": "red_vial_total_km", "canonicalId": "red_vial_total_km", "name": "Extensión Total de Red Vial Comunal (MOP)", "shortName": "Red Vial Total", "unit": "km", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["red vial total", "kilometros de caminos", "caminos totales"]},
    {"id": "red_vial_pavimentada_km", "canonicalId": "red_vial_pavimentada_km", "name": "Red Vial Comunal Pavimentada (MOP)", "shortName": "Red Vial Pavimentada km", "unit": "km", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["red vial pavimentada", "kilometros pavimentados"]},
    {"id": "red_vial_solucion_basica_km", "canonicalId": "red_vial_solucion_basica_km", "name": "Red Vial con Solución Básica", "shortName": "Red Solución Básica", "unit": "km", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["solucion basica vial", "caminos solucion basica"]},
    {"id": "red_vial_ripio_km", "canonicalId": "red_vial_ripio_km", "name": "Red Vial de Ripio (MOP)", "shortName": "Red Vial Ripio km", "unit": "km", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["red vial de ripio", "caminos ripiados mop"]},
    {"id": "red_vial_tierra_km", "canonicalId": "red_vial_tierra_km", "name": "Red Vial de Tierra (MOP)", "shortName": "Red Vial Tierra", "unit": "km", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["caminos de tierra mop", "red vial tierra"]},
    {"id": "red_vial_pavimentada_pct", "canonicalId": "red_vial_pavimentada_pct", "name": "Porcentaje de Red Vial Pavimentada", "shortName": "% Red Pavimentada", "unit": "%", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["porcentaje pavimentado", "pavimentacion vial", "cobertura pavimento"]},
    {"id": "distancia_coyhaique_km", "canonicalId": "distancia_coyhaique_km", "name": "Distancia Terrestre/Marítima a Coyhaique", "shortName": "Distancia a Coyhaique", "unit": "km", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["distancia a coyhaique", "kilometros a coyhaique"]},
    {"id": "tiempo_viaje_coyhaique_hrs", "canonicalId": "tiempo_viaje_coyhaique_hrs", "name": "Tiempo de Viaje Multimodal hacia Coyhaique", "shortName": "Tiempo Viaje Coyhaique", "unit": "horas", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["tiempo de viaje multimodal", "horas de traslado a coyhaique"]},
    {"id": "dependencia_barcaza_nivel", "canonicalId": "dependencia_barcaza_nivel", "name": "Nivel de Dependencia de Barcaza o Transbordador", "shortName": "Dependencia Barcaza", "unit": "nivel 0-3", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["dependencia de barcaza", "barcaza", "transbordador", "conectividad maritima"]},
    {"id": "hogares_sin_internet_fijo_pct", "canonicalId": "hogares_sin_internet_fijo_pct", "name": "Hogares sin Conexión Fija a Internet", "shortName": "Sin Internet Fijo %", "unit": "%", "hub": "energia", "hubTitle": "III. Energía y Telecomunicaciones", "nodeId": 14, "dim": "comuna", "outlierBiased": False, "synonyms": ["sin internet fijo", "brecha digital", "hogares sin internet", "desconectados digital"]},
    {"id": "establecimientos_educacion_conectados_n", "canonicalId": "establecimientos_educacion_conectados_n", "name": "Establecimientos Educacionales Conectados", "shortName": "Escuelas Conectadas", "unit": "establecimientos", "hub": "energia", "hubTitle": "III. Energía y Telecomunicaciones", "nodeId": 14, "dim": "comuna", "outlierBiased": False, "synonyms": ["escuelas conectadas", "internet en escuelas"]},
    {"id": "consumo_lena_m3_hogar_ano", "canonicalId": "consumo_lena_m3_hogar_ano", "name": "Consumo Residencial de Leña por Hogar", "shortName": "Consumo Leña/Hogar", "unit": "m³/hogar/año", "hub": "energia", "hubTitle": "III. Energía y Telecomunicaciones", "nodeId": 13, "dim": "comuna", "outlierBiased": False, "synonyms": ["consumo de lena por hogar", "metros cubicos por hogar", "gasto residencial de lena"]},
    {"id": "consumo_lena_m3_solidos_anual", "canonicalId": "consumo_lena_m3_solidos_anual", "name": "Consumo Total Anual de Leña Sólida (INFOR)", "shortName": "Consumo Total Leña", "unit": "m³ sólidos/año", "hub": "energia", "hubTitle": "III. Energía y Telecomunicaciones", "nodeId": 13, "dim": "comuna", "outlierBiased": False, "synonyms": ["consumo total de lena", "volumen total de lena", "metros solidos de lena"]},
    # Hub V y Agro/Banca
    {"id": "ganado_bovino_cabezas", "canonicalId": "ganado_bovino_cabezas", "name": "Masa Ganadera Bovina (BCN / ODEPA)", "shortName": "Ganado Bovino", "unit": "cabezas", "hub": "inversion", "hubTitle": "V. Economía, Inversión y Suelo", "nodeId": 22, "dim": "comuna", "outlierBiased": False, "synonyms": ["ganado bovino", "vacunos", "vacas", "ganaderia bovina"]},
    {"id": "ganado_ovino_cabezas", "canonicalId": "ganado_ovino_cabezas", "name": "Masa Ganadera Ovina (BCN / ODEPA)", "shortName": "Ganado Ovino", "unit": "cabezas", "hub": "inversion", "hubTitle": "V. Economía, Inversión y Suelo", "nodeId": 22, "dim": "comuna", "outlierBiased": False, "synonyms": ["ganado ovino", "ovejas", "lana", "ganaderia ovina"]},
    {"id": "bosque_nativo_ha", "canonicalId": "bosque_nativo_ha", "name": "Superficie de Bosque Nativo (CONAF 2026)", "shortName": "Bosque Nativo ha", "unit": "hectáreas", "hub": "biodiversidad", "hubTitle": "VII. Biodiversidad, Clima y Riesgos", "nodeId": 27, "dim": "comuna", "outlierBiased": False, "synonyms": ["bosque nativo", "hectareas bosque nativo", "superficie bosque"]},
    {"id": "plantaciones_ha", "canonicalId": "plantaciones_ha", "name": "Superficie de Plantaciones Forestales", "shortName": "Plantaciones ha", "unit": "hectáreas", "hub": "inversion", "hubTitle": "V. Economía, Inversión y Suelo", "nodeId": 22, "dim": "comuna", "outlierBiased": False, "synonyms": ["plantaciones forestales", "pino", "forestales"]},
    {"id": "ventas_sii_domicilio_local_muf", "canonicalId": "ventas_sii_domicilio_local_muf", "name": "Ventas SII con Domicilio Tributario en Aysén (Miles de UF)", "shortName": "Ventas Locales SII (MUF)", "unit": "Miles de UF", "hub": "inversion", "hubTitle": "V. Economía, Inversión y Suelo", "nodeId": 20, "dim": "comuna", "outlierBiased": True, "synonyms": ["ventas domicilio local", "ventas tributarias locales", "25800 muf", "ventas sii aysen"]},
    {"id": "sucursales_bancarias_n", "canonicalId": "sucursales_bancarias_n", "name": "Sucursales Bancarias Totales (CMF: Privada + BancoEstado)", "shortName": "Sucursales Bancarias Totales", "unit": "sucursales", "hub": "inversion", "hubTitle": "V. Economía, Inversión y Suelo", "nodeId": 20, "dim": "comuna", "outlierBiased": False, "synonyms": ["sucursales bancarias totales", "sucursales bancos", "sucursales cmf", "bancos comuna"]},
    {"id": "cajeros_automaticos_n", "canonicalId": "cajeros_automaticos_n", "name": "Cajeros Automáticos ATM (CMF)", "shortName": "Cajeros Automáticos", "unit": "cajeros", "hub": "inversion", "hubTitle": "V. Economía, Inversión y Suelo", "nodeId": 20, "dim": "comuna", "outlierBiased": False, "synonyms": ["cajeros automaticos", "cajeros", "atm", "dispensadores"]},
    {"id": "cajavecina_puntos_n", "canonicalId": "cajavecina_puntos_n", "name": "Puntos CajaVecina BancoEstado (CMF)", "shortName": "Puntos CajaVecina CMF", "unit": "puntos", "hub": "inversion", "hubTitle": "V. Economía, Inversión y Suelo", "nodeId": 20, "dim": "comuna", "outlierBiased": False, "synonyms": ["cajavecina puntos", "corresponsalia cajavecina", "bancoestado puntos"]},
    {"id": "sucursales_banca_privada_cmf", "canonicalId": "sucursales_banca_privada_cmf", "name": "Sucursales de Banca Privada (CMF)", "shortName": "Sucursales Banca Privada", "unit": "sucursales", "hub": "inversion", "hubTitle": "V. Economía, Inversión y Suelo", "nodeId": 20, "dim": "comuna", "outlierBiased": False, "synonyms": ["bancos", "sucursales bancarias privadas", "banca privada", "cmf"]},
    {"id": "puntos_cajavecina_bancoestado", "canonicalId": "cajavecina_puntos_n", "isAliasOf": "cajavecina_puntos_n", "name": "Puntos CajaVecina BancoEstado", "shortName": "Puntos CajaVecina", "unit": "puntos", "hub": "inversion", "hubTitle": "V. Economía, Inversión y Suelo", "nodeId": 20, "dim": "comuna", "outlierBiased": False, "synonyms": ["cajavecina", "caja vecina", "bancoestado", "inclusion financiera"]},
    # Hub VI - Social, Vivienda, Educación, Barómetro (Sprint 9 Censo 2024 / CASEN / MINVU / SLEP / SIES / CEAD)
    {"id": "viviendas_totales_censo_2024", "canonicalId": "viviendas_totales_censo_2024", "name": "Viviendas Totales Censadas (Censo 2024 INE)", "shortName": "Viviendas Totales Censo 2024", "unit": "viviendas", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 23, "dim": "comuna", "outlierBiased": True, "synonyms": ["viviendas totales", "viviendas censadas", "parque habitacional censo 2024"]},
    {"id": "viviendas_ocupadas_censo_2024", "canonicalId": "hogares_censo_2024", "isAliasOf": "hogares_censo_2024", "name": "Viviendas Particulares Ocupadas con Moradores Presentes (Censo 2024)", "shortName": "Viviendas Ocupadas Censo 2024", "unit": "viviendas", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 23, "dim": "comuna", "outlierBiased": True, "synonyms": ["viviendas ocupadas", "viviendas con moradores presentes"]},
    {"id": "pueblos_originarios_pct_censo_2024", "canonicalId": "pueblos_originarios_pct_censo_2024", "name": "Población Pueblos Originarios Censo 2024 (%)", "shortName": "Pueblos Originarios % (2024)", "unit": "%", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 23, "dim": "comuna", "outlierBiased": False, "synonyms": ["pueblos originarios censo 2024", "pertenencia indigena censo 2024"]},
    {"id": "inmigrantes_internacionales_pct_censo_2024", "canonicalId": "inmigrantes_internacionales_pct_censo_2024", "name": "Inmigrantes Internacionales Censo 2024 (%)", "shortName": "Inmigrantes % (Censo 2024)", "unit": "%", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 23, "dim": "comuna", "outlierBiased": False, "synonyms": ["inmigrantes internacionales", "poblacion extranjera censo 2024", "migrantes censo 2024"]},
    {"id": "deficit_cuantitativo_minvu", "canonicalId": "deficit_habitacional_cuantitativo_n", "isAliasOf": "deficit_habitacional_cuantitativo_n", "name": "Déficit Habitacional Cuantitativo Censo 2024 (MINVU CECT)", "shortName": "Déficit Cuantitativo MINVU", "unit": "viviendas", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 41, "dim": "comuna", "outlierBiased": True, "synonyms": ["deficit cuantitativo minvu", "deficit habitacional censo 2024"]},
    {"id": "deficit_habitacional_cuantitativo_viv", "canonicalId": "deficit_habitacional_cuantitativo_n", "isAliasOf": "deficit_habitacional_cuantitativo_n", "name": "Déficit Habitacional Cuantitativo (viviendas MINVU)", "shortName": "Déficit Cuantitativo (viv.)", "unit": "viviendas", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 41, "dim": "comuna", "outlierBiased": True, "synonyms": ["deficit habitacional viv", "requerimiento vivienda nueva"]},
    {"id": "deficit_cuantitativo_pct_hogares", "canonicalId": "deficit_cuantitativo_pct_hogares", "name": "Déficit Habitacional Cuantitativo (% de Hogares Censo 2024)", "shortName": "% Déficit Cuantitativo / Hogares", "unit": "%", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 41, "dim": "comuna", "outlierBiased": False, "synonyms": ["porcentaje deficit cuantitativo", "tasa deficit habitacional"]},
    {"id": "carencia_servicios_basicos_rsh_pct", "canonicalId": "rsh_carencia_servicios_basicos_jun2026_pct", "isAliasOf": "rsh_carencia_servicios_basicos_jun2026_pct", "name": "Carencia de Servicios Básicos RSH (%)", "shortName": "Carencia Serv. Básicos RSH (%)", "unit": "%", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 41, "dim": "comuna", "outlierBiased": False, "synonyms": ["carencia servicios basicos rsh", "sin agua o alcantarillado rsh"]},
    {"id": "hacinamiento_rsh_pct", "canonicalId": "rsh_hacinamiento_jun2026_pct", "isAliasOf": "rsh_hacinamiento_jun2026_pct", "name": "Hacinamiento en Registro Social de Hogares (%)", "shortName": "Hacinamiento RSH (%)", "unit": "%", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 41, "dim": "comuna", "outlierBiased": False, "synonyms": ["hacinamiento rsh", "tasa hacinamiento rsh"]},
    {"id": "matricula_escolar_total_n", "canonicalId": "matricula_escolar", "isAliasOf": "matricula_escolar", "name": "Matrícula Escolar Total MINEDUC (todas las dependencias)", "shortName": "Matrícula Escolar MINEDUC", "unit": "estudiantes", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 25, "dim": "comuna", "outlierBiased": True, "synonyms": ["matricula escolar total", "alumnos mineduc"]},
    {"id": "matricula_escolar_mineduc", "canonicalId": "matricula_escolar", "isAliasOf": "matricula_escolar", "name": "Matrícula Escolar Total MINEDUC CEM", "shortName": "Matrícula Escolar CEM", "unit": "estudiantes", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 25, "dim": "comuna", "outlierBiased": True, "synonyms": ["matricula cem mineduc", "matricula total escolar"]},
    {"id": "matricula_slep_aysen_n", "canonicalId": "matricula_slep_aysen_n", "name": "Matrícula Escolar Pública SLEP Aysén", "shortName": "Matrícula SLEP Aysén", "unit": "estudiantes", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 25, "dim": "comuna", "outlierBiased": True, "synonyms": ["matricula slep", "alumnos slep aysen", "educacion publica matricula"]},
    {"id": "establecimientos_escolares_n", "canonicalId": "establecimientos_escolares_n", "name": "Establecimientos Escolares (SLEP / MINEDUC)", "shortName": "Establecimientos Escolares", "unit": "establecimientos", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 25, "dim": "comuna", "outlierBiased": False, "synonyms": ["establecimientos escolares", "colegios", "escuelas totales", "liceos"]},
    {"id": "deficit_habitacional_cuantitativo_n", "canonicalId": "deficit_habitacional_cuantitativo_n", "name": "Déficit Habitacional Cuantitativo (MINVU)", "shortName": "Déficit Cuantitativo Viv.", "unit": "viviendas", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 41, "dim": "comuna", "outlierBiased": False, "synonyms": ["deficit habitacional", "deficit de vivienda", "falta de viviendas", "viviendas faltantes"]},
    {"id": "deficit_habitacional_cualitativo_n", "canonicalId": "deficit_habitacional_cualitativo_n", "name": "Déficit Habitacional Cualitativo (MINVU)", "shortName": "Déficit Cualitativo Viv.", "unit": "viviendas", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 41, "dim": "comuna", "outlierBiased": False, "synonyms": ["deficit cualitativo", "viviendas por mejorar", "mejoramiento vivienda"]},
    {"id": "sistemas_ssr_apr_n", "canonicalId": "sistemas_ssr_apr_n", "name": "Sistemas de Agua Potable Rural (SSR / APR)", "shortName": "Sistemas APR / SSR", "unit": "sistemas", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 41, "dim": "comuna", "outlierBiased": False, "synonyms": ["apr", "agua potable rural", "comites apr", "sistemas ssr"]},
    {"id": "barometro_confianza_institucional_pct", "canonicalId": "barometro_confianza_institucional_pct", "name": "Confianza Ciudadana en el Municipio (Barómetro UAysén)", "shortName": "Confianza Municipal", "unit": "%", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 15, "dim": "comuna", "outlierBiased": False, "synonyms": ["confianza institucional", "confianza municipal", "barometro confianza"]},
    {"id": "barometro_redes_apoyo_comunitario_pct", "canonicalId": "barometro_redes_apoyo_comunitario_pct", "name": "Redes de Apoyo Comunitario (Barómetro UAysén)", "shortName": "Redes de Apoyo", "unit": "%", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 26, "dim": "comuna", "outlierBiased": False, "synonyms": ["redes de apoyo", "apoyo comunitario", "cohesion social"]},
    {"id": "barometro_orgullo_identidad_pct", "canonicalId": "barometro_orgullo_identidad_pct", "name": "Orgullo e Identidad Territorial (Barómetro UAysén)", "shortName": "Orgullo Territorial", "unit": "%", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 26, "dim": "comuna", "outlierBiased": False, "synonyms": ["orgullo regional", "identidad territorial", "pertenencia"]},
    {"id": "barometro_prioridad_conectividad_pct", "canonicalId": "barometro_prioridad_conectividad_pct", "name": "Prioridad Ciudadana en Conectividad (Barómetro)", "shortName": "Prioridad Conectividad", "unit": "%", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 40, "dim": "comuna", "outlierBiased": False, "synonyms": ["prioridad conectividad", "demanda conectividad"]},
    {"id": "barometro_tension_desarrollo_conservacion_pct", "canonicalId": "barometro_tension_desarrollo_conservacion_pct", "name": "Tensión Desarrollo vs. Conservación (Barómetro)", "shortName": "Tensión Desarrollo/Conservación", "unit": "%", "hub": "biodiversidad", "hubTitle": "VII. Biodiversidad, Clima y Riesgos", "nodeId": 27, "dim": "comuna", "outlierBiased": False, "synonyms": ["tension conservacion", "desarrollo vs conservacion"]},
    {"id": "barometro_intencion_migracion_juvenil_pct", "canonicalId": "barometro_intencion_migracion_juvenil_pct", "name": "Retención y Oportunidades Juveniles (Barómetro)", "shortName": "Retención Juvenil", "unit": "%", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 26, "dim": "comuna", "outlierBiased": False, "synonyms": ["migracion juvenil", "jovenes se van", "retencion juvenil"]},
    {"id": "barometro_preocupacion_contaminacion_lena_pct", "canonicalId": "barometro_preocupacion_contaminacion_lena_pct", "name": "Preocupación por Contaminación por Leña (Barómetro)", "shortName": "Preocupación Humo/Leña", "unit": "%", "hub": "energia", "hubTitle": "III. Energía y Telecomunicaciones", "nodeId": 13, "dim": "comuna", "outlierBiased": False, "synonyms": ["preocupacion lena", "percepcion contaminacion"]},
    {"id": "indice_envejecimiento", "canonicalId": "indice_envejecimiento", "name": "Índice de Envejecimiento Demográfico", "shortName": "Índice Envejecimiento", "unit": "adultos/100 menores", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 23, "dim": "comuna", "outlierBiased": False, "synonyms": ["envejecimiento", "indice de envejecimiento", "adultos mayores proporcion"]},
    {"id": "autoidentificacion_indigena_pct", "canonicalId": "autoidentificacion_indigena_pct", "name": "Autoidentificación Indígena (Censo 2024)", "shortName": "Población Indígena %", "unit": "%", "hub": "cultura", "hubTitle": "IX. Cultura y Patrimonio", "nodeId": 34, "dim": "comuna", "outlierBiased": False, "synonyms": ["pueblos originarios", "poblacion indigena", "autoidentificacion indigena"]},
    {"id": "comunidades_indigenas_conadi", "canonicalId": "comunidades_indigenas_conadi", "name": "Comunidades Indígenas Registradas (CONADI)", "shortName": "Comunidades Indígenas", "unit": "comunidades", "hub": "cultura", "hubTitle": "IX. Cultura y Patrimonio", "nodeId": 34, "dim": "comuna", "outlierBiased": False, "synonyms": ["comunidades indigenas", "conadi"]},
    {"id": "juntas_vecinos_activas", "canonicalId": "juntas_vecinos_activas", "name": "Juntas de Vecinos Activas (SINIM)", "shortName": "Juntas de Vecinos", "unit": "juntas", "hub": "social", "hubTitle": "VI. Demografía, Educación y Sociedad", "nodeId": 25, "dim": "comuna", "outlierBiased": False, "synonyms": ["juntas de vecinos", "organizaciones vecinales"]},
    # Hub VIII - Salud
    {"id": "postas_salud_rural", "canonicalId": "postas_salud_rural", "name": "Postas de Salud Rural (PSR)", "shortName": "Postas Rurales", "unit": "postas", "hub": "salud", "hubTitle": "VIII. Salud APS y Hospitales", "nodeId": 38, "dim": "comuna", "outlierBiased": False, "synonyms": ["postas de salud rural", "psr", "postas", "centros rurales salud"]},
    {"id": "esperanza_vida_total_anos", "canonicalId": "esperanza_vida_total_anos", "name": "Esperanza de Vida al Nacer (DEIS)", "shortName": "Esperanza de Vida", "unit": "años", "hub": "salud", "hubTitle": "VIII. Salud APS y Hospitales", "nodeId": 38, "dim": "comuna", "outlierBiased": False, "synonyms": ["esperanza de vida", "longevidad", "anos de vida"]},
    {"id": "cobertura_empam_pct", "canonicalId": "cobertura_empam_pct", "name": "Cobertura Preventiva del Adulto Mayor (EMPAM)", "shortName": "Cobertura EMPAM", "unit": "%", "hub": "salud", "hubTitle": "VIII. Salud APS y Hospitales", "nodeId": 38, "dim": "comuna", "outlierBiased": False, "synonyms": ["empam", "cobertura empam", "salud preventiva", "control adulto mayor", "examen preventivo adulto mayor"]},
    {"id": "cobertura_pscv_pct", "canonicalId": "cobertura_pscv_pct", "name": "Cobertura Programa de Salud Cardiovascular (PSCV)", "shortName": "Cobertura PSCV", "unit": "%", "hub": "salud", "hubTitle": "VIII. Salud APS y Hospitales", "nodeId": 38, "dim": "comuna", "outlierBiased": False, "synonyms": ["pscv", "salud cardiovascular", "control cardiovascular"]},
    {"id": "camas_psiquiatricas_uhce", "canonicalId": "camas_psiquiatricas_uhce", "name": "Camas Psiquiátricas UHCE", "shortName": "Camas Psiquiátricas", "unit": "camas", "hub": "salud", "hubTitle": "VIII. Salud APS y Hospitales", "nodeId": 38, "dim": "comuna", "outlierBiased": False, "synonyms": ["camas psiquiatricas", "salud mental camas", "uhce"]},
    {"id": "mediana_espera_especialidad_dias", "canonicalId": "mediana_espera_especialidad_dias", "name": "Mediana de Espera en Consulta de Especialidad", "shortName": "Espera Especialidad", "unit": "días", "hub": "salud", "hubTitle": "VIII. Salud APS y Hospitales", "nodeId": 38, "dim": "comuna", "outlierBiased": False, "synonyms": ["espera especialidad", "dias espera especialista", "demora especialista"]},
    {"id": "mediana_espera_quirurgica_dias", "canonicalId": "mediana_espera_quirurgica_dias", "name": "Mediana de Espera Quirúrgica No GES", "shortName": "Espera Quirúrgica", "unit": "días", "hub": "salud", "hubTitle": "VIII. Salud APS y Hospitales", "nodeId": 38, "dim": "comuna", "outlierBiased": False, "synonyms": ["espera quirurgica", "dias espera cirugia", "lista espera cirugia"]},
    {"id": "tasa_mortalidad_cancer_gastrico_100k", "canonicalId": "tasa_mortalidad_cancer_gastrico_100k", "name": "Tasa de Mortalidad por Cáncer Gástrico (DEIS)", "shortName": "Mortalidad Cáncer Gástrico", "unit": "def/100k hab", "hub": "salud", "hubTitle": "VIII. Salud APS y Hospitales", "nodeId": 38, "dim": "comuna", "outlierBiased": False, "synonyms": ["cancer", "mortalidad por cancer", "cancer gastrico", "tasa de cancer"]},
    {"id": "tasa_mortalidad_cancer_vesicula_100k", "canonicalId": "tasa_mortalidad_cancer_vesicula_100k", "name": "Tasa de Mortalidad por Cáncer de Vesícula (DEIS)", "shortName": "Mortalidad Cáncer Vesícula", "unit": "def/100k hab", "hub": "salud", "hubTitle": "VIII. Salud APS y Hospitales", "nodeId": 38, "dim": "comuna", "outlierBiased": False, "synonyms": ["cancer de vesicula", "vesicula"]},
    {"id": "tasa_mortalidad_suicidio_100k", "canonicalId": "tasa_mortalidad_suicidio_100k", "name": "Tasa de Mortalidad por Suicidio (DEIS)", "shortName": "Mortalidad Suicidio", "unit": "def/100k hab", "hub": "salud", "hubTitle": "VIII. Salud APS y Hospitales", "nodeId": 38, "dim": "comuna", "outlierBiased": False, "synonyms": ["suicidio", "mortalidad salud mental", "tasa suicidio"]},
    # Hub IX - Cultura y Patrimonio
    {"id": "museos_espacios_n", "canonicalId": "museos_espacios_n", "name": "Museos y Espacios Culturales", "shortName": "Espacios Culturales", "unit": "espacios", "hub": "cultura", "hubTitle": "IX. Cultura y Patrimonio", "nodeId": 32, "dim": "comuna", "outlierBiased": False, "synonyms": ["museos", "espacios culturales", "centros culturales"]},
    {"id": "bibliotecas_snbp_n", "canonicalId": "bibliotecas_snbp_n", "name": "Bibliotecas Públicas (SNBP)", "shortName": "Bibliotecas SNBP", "unit": "bibliotecas", "hub": "cultura", "hubTitle": "IX. Cultura y Patrimonio", "nodeId": 32, "dim": "comuna", "outlierBiased": False, "synonyms": ["bibliotecas", "bibliotecas publicas", "snbp"]},
    {"id": "fondart_fndr_mclp", "canonicalId": "fondart_fndr_mclp", "name": "Inversión FONDART y Cultura FNDR", "shortName": "Fondos Cultura", "unit": "M$ CLP", "hub": "cultura", "hubTitle": "IX. Cultura y Patrimonio", "nodeId": 33, "dim": "comuna", "outlierBiased": False, "synonyms": ["fondart", "fondos de cultura", "financiamiento cultural"]},
    {"id": "monumentos_nacionales_count", "canonicalId": "monumentos_nacionales_count", "name": "Monumentos Nacionales Declarados (CMN)", "shortName": "Monumentos CMN", "unit": "monumentos", "hub": "cultura", "hubTitle": "IX. Cultura y Patrimonio", "nodeId": 32, "dim": "comuna", "outlierBiased": False, "synonyms": ["monumentos", "monumentos nacionales", "patrimonio protegido", "cmn"]},
    {"id": "museos_count", "canonicalId": "museos_count", "name": "Museos Inscritos en RMC", "shortName": "Museos RMC", "unit": "museos", "hub": "cultura", "hubTitle": "IX. Cultura y Patrimonio", "nodeId": 32, "dim": "comuna", "outlierBiased": False, "synonyms": ["museos inscritos", "registro museos"]},
    {"id": "nota_percepcion_cultura_b4b", "canonicalId": "nota_percepcion_cultura_b4b", "name": "Evaluación Ciudadana Oferta Cultural", "shortName": "Nota Cultura", "unit": "nota 1-7", "hub": "cultura", "hubTitle": "IX. Cultura y Patrimonio", "nodeId": 34, "dim": "comuna", "outlierBiased": False, "synonyms": ["nota cultura", "percepcion cultural"]},
    {"id": "participacion_cultural_pct_c2", "canonicalId": "participacion_cultural_pct_c2", "name": "Participación en Organizaciones Culturales", "shortName": "Participación Cultural", "unit": "%", "hub": "cultura", "hubTitle": "IX. Cultura y Patrimonio", "nodeId": 34, "dim": "comuna", "outlierBiased": False, "synonyms": ["participacion cultural", "actividad cultural"]},
    # Hub X - CTCi e Innovación
    {"id": "proyectos_anid_n", "canonicalId": "proyectos_anid_n", "name": "Proyectos ANID Adjudicados", "shortName": "Proyectos ANID", "unit": "proyectos", "hub": "ctci", "hubTitle": "X. CTCi e Innovación", "nodeId": 35, "dim": "comuna", "outlierBiased": False, "synonyms": ["proyectos anid", "anid", "fondecyt", "fondef"]},
    {"id": "monto_anid_mclp", "canonicalId": "monto_anid_mclp", "name": "Financiamiento ANID Adjudicado", "shortName": "Monto ANID", "unit": "M$ CLP", "hub": "ctci", "hubTitle": "X. CTCi e Innovación", "nodeId": 35, "dim": "comuna", "outlierBiased": False, "synonyms": ["monto anid", "plata ciencia", "financiamiento anid"]},
    {"id": "innovacion_corfo_mclp", "canonicalId": "innovacion_corfo_mclp", "name": "Financiamiento CORFO Innovación", "shortName": "CORFO Innova", "unit": "M$ CLP", "hub": "ctci", "hubTitle": "X. CTCi e Innovación", "nodeId": 37, "dim": "comuna", "outlierBiased": False, "synonyms": ["corfo", "innovacion corfo", "fondos corfo"]},
    {"id": "proyectos_ctci_total", "canonicalId": "proyectos_ctci_total", "name": "Total de Proyectos de Ciencia e Innovación", "shortName": "Proyectos CTCi", "unit": "proyectos", "hub": "ctci", "hubTitle": "X. CTCi e Innovación", "nodeId": 35, "dim": "comuna", "outlierBiased": False, "synonyms": ["proyectos ctci", "proyectos de ciencia", "proyectos de investigacion"]},
    {"id": "investigadores_residentes", "canonicalId": "investigadores_residentes", "name": "Investigadores Residentes en Aysén", "shortName": "Investigadores Residentes", "unit": "investigadores", "hub": "ctci", "hubTitle": "X. CTCi e Innovación", "nodeId": 36, "dim": "comuna", "outlierBiased": False, "synonyms": ["investigadores", "cientificos", "investigadores residentes"]},
    {"id": "proyectos_anid_locales_count", "canonicalId": "proyectos_anid_locales_count", "name": "Proyectos ANID con Dirección Local", "shortName": "ANID Locales", "unit": "proyectos", "hub": "ctci", "hubTitle": "X. CTCi e Innovación", "nodeId": 36, "dim": "comuna", "outlierBiased": False, "synonyms": ["anid locales", "ciencia local"]},
    {"id": "proyectos_anid_extrarregionales_count", "canonicalId": "proyectos_anid_extrarregionales_count", "name": "Proyectos ANID Ejecutados desde Fuera", "shortName": "ANID Extrarregionales", "unit": "proyectos", "hub": "ctci", "hubTitle": "X. CTCi e Innovación", "nodeId": 36, "dim": "comuna", "outlierBiased": False, "synonyms": ["anid extrarregionales", "ciencia externa"]},
    {"id": "proyectos_corfo_innova_count", "canonicalId": "proyectos_corfo_innova_count", "name": "Número de Proyectos CORFO Innova", "shortName": "Proyectos CORFO", "unit": "proyectos", "hub": "ctci", "hubTitle": "X. CTCi e Innovación", "nodeId": 37, "dim": "comuna", "outlierBiased": False, "synonyms": ["proyectos corfo", "numero corfo"]},
    {"id": "centros_y_estaciones_ctci_count", "canonicalId": "centros_y_estaciones_ctci_count", "name": "Centros y Estaciones Científicas CTCi", "shortName": "Centros CTCi", "unit": "centros", "hub": "ctci", "hubTitle": "X. CTCi e Innovación", "nodeId": 36, "dim": "comuna", "outlierBiased": False, "synonyms": ["centros cientificos", "estaciones de campo", "ciep", "centros ctci"]},
    {"id": "percepcion_ctci_prioritaria_pct_i1i", "canonicalId": "percepcion_ctci_prioritaria_pct_i1i", "name": "Valoración Ciudadana de Ciencia y Tecnología", "shortName": "Valoración Ciencia", "unit": "%", "hub": "ctci", "hubTitle": "X. CTCi e Innovación", "nodeId": 36, "dim": "comuna", "outlierBiased": False, "synonyms": ["valoracion ciencia", "importancia ciencia"]},
    # Hub IV - Finanzas Municipales BCN/SINIM 2025 (Sprint 7)
    {"id": "fcm_bcn_2025_mclp", "canonicalId": "fcm_bcn_2025_mclp", "name": "Aporte Fondo Común Municipal (FCM) BCN-SINIM 2025", "shortName": "Aporte FCM BCN 2025", "unit": "M$ CLP", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 16, "dim": "comuna", "outlierBiased": True, "synonyms": ["aporte fcm", "fondo comun municipal monto", "fcm bcn 2025", "transferencia fcm"]},
    {"id": "ipp_bcn_2025_mclp", "canonicalId": "ipp_bcn_2025_mclp", "name": "Ingresos Propios Permanentes (IPP) BCN-SINIM 2025", "shortName": "IPP BCN 2025", "unit": "M$ CLP", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 15, "dim": "comuna", "outlierBiased": True, "synonyms": ["ipp monto", "ingresos propios permanentes monto", "ipp bcn 2025", "recaudacion propia municipal"]},
    {"id": "participacion_fcm_ingreso_total_pct", "canonicalId": "participacion_fcm_ingreso_total_pct", "name": "Participación del FCM sobre Ingreso Municipal Total (%)", "shortName": "% FCM / Ingreso Total", "unit": "%", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 16, "dim": "comuna", "outlierBiased": False, "synonyms": ["participacion fcm ingreso total", "peso fcm ingreso municipal", "fcm sobre ingreso total"]},
    {"id": "gastos_corrientes_bcn_pct", "canonicalId": "gastos_corrientes_bcn_pct", "name": "Proporción de Gastos Corrientes Municipales BCN (%)", "shortName": "% Gastos Corrientes", "unit": "%", "hub": "gobernanza", "hubTitle": "IV. Gobernanza y Finanzas", "nodeId": 15, "dim": "comuna", "outlierBiased": False, "synonyms": ["gastos corrientes", "gasto corriente municipal", "gastos funcionamiento municipio"]},
    # Serie temporal clave
    {"id": "pib_regional_nominal_mmclp", "canonicalId": "pib_regional_nominal_mmclp", "name": "Producto Interno Bruto (PIB) Regional Nominal (2015–2026)", "shortName": "PIB Regional", "unit": "MM$ CLP", "hub": "inversion", "hubTitle": "V. Economía, Inversión y Suelo", "nodeId": 20, "dim": "tiempo", "outlierBiased": False, "synonyms": ["pib", "pib regional", "producto interno bruto", "crecimiento economico aysen"]}
]

existing_lex_ids = {v["id"] for v in variables}
for add_v in ADDITIONAL_CANONICAL_VARIABLES:
    if add_v["id"] not in existing_lex_ids:
        variables.append(add_v)
        existing_lex_ids.add(add_v["id"])

# Merge no destructivo con data/nl_lexicon_aysen.json en disco para conservar las curaciones
# de Sprints 4, 5 y 6 (variables adicionales y etiquetas isAliasOf / isComplementOf)
disk_lex_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "nl_lexicon_aysen.json")
if os.path.isfile(disk_lex_path):
    with open(disk_lex_path, "r", encoding="utf-8-sig") as f_disk:
        disk_lex = json.load(f_disk)
    disk_vars = disk_lex.get("variables", [])
    disk_by_id = {v.get("id"): v for v in disk_vars if isinstance(v, dict) and v.get("id")}
    gen_by_id = {v["id"]: v for v in variables}
    for vid, gen_v in gen_by_id.items():
        dv = disk_by_id.get(vid)
        if dv:
            if dv.get("isAliasOf") and "isAliasOf" not in gen_v:
                gen_v["isAliasOf"] = dv["isAliasOf"]
            if dv.get("isComplementOf") and "isComplementOf" not in gen_v:
                gen_v["isComplementOf"] = dv["isComplementOf"]
    for dv in disk_vars:
        vid = dv.get("id")
        if vid and vid not in existing_lex_ids:
            variables.append(dv)
            existing_lex_ids.add(vid)

var_by_id = {v["id"]: v for v in variables}
# Sprint 7: ingresos_mun_bcn_2025_mclp === presupuesto_mclp (r = 1.000000), marcar alias para Audit V3
if "ingresos_mun_bcn_2025_mclp" in var_by_id:
    var_by_id["ingresos_mun_bcn_2025_mclp"]["isAliasOf"] = "presupuesto_mclp"
if "puntos_cajavecina_bancoestado" in var_by_id:
    var_by_id["puntos_cajavecina_bancoestado"]["isAliasOf"] = "cajavecina_puntos_n"
if "ventas_sii_muf" in var_by_id:
    var_by_id["ventas_sii_muf"]["name"] = "Valor Bruto de Producción Física Regional SII (incluye casas matrices extrarregionales, Miles de UF)"
    var_by_id["ventas_sii_muf"]["shortName"] = "Valor Bruto Prod. (MUF)"
# Sprint 9: Saneamiento de falsos alias SIES/SSR y paridades Censo/MINVU/MINEDUC
if "matricula_educacion_superior_sies_n" in var_by_id:
    var_by_id["matricula_educacion_superior_sies_n"].pop("isAliasOf", None)
    var_by_id["matricula_educacion_superior_sies_n"]["canonicalId"] = "matricula_educacion_superior_sies_n"
    var_by_id["matricula_educacion_superior_sies_n"]["name"] = "Matrícula Educación Superior SIES 2026 (UAysén + INACAP + CFT Estatal)"
if "matricula_ed_superior_sies" in var_by_id:
    var_by_id["matricula_ed_superior_sies"]["isAliasOf"] = "matricula_educacion_superior_sies_n"
    var_by_id["matricula_ed_superior_sies"]["canonicalId"] = "matricula_educacion_superior_sies_n"
if "beneficiarios_ssr_apr_doh" in var_by_id:
    var_by_id["beneficiarios_ssr_apr_doh"].pop("isAliasOf", None)
    var_by_id["beneficiarios_ssr_apr_doh"]["canonicalId"] = "beneficiarios_ssr_apr_doh"
    var_by_id["beneficiarios_ssr_apr_doh"]["unit"] = "personas"
if "viviendas_ocupadas_censo_2024" in var_by_id:
    var_by_id["viviendas_ocupadas_censo_2024"]["isAliasOf"] = "hogares_censo_2024"
    var_by_id["viviendas_ocupadas_censo_2024"]["canonicalId"] = "hogares_censo_2024"
if "deficit_habitacional_cualitativo_n" in var_by_id:
    var_by_id["deficit_habitacional_cualitativo_n"]["isComplementOf"] = "hogares_censo_2024"

CANONICAL_HUB_TITLES = {
    "turismo": "I. Turismo y Áreas Silvestres",
    "salmonicultura": "II. Pesca, Acuicultura y Mar",
    "energia": "III. Energía y Telecomunicaciones",
    "gobernanza": "IV. Gobernanza y Finanzas",
    "inversion": "V. Economía, Inversión y Suelo",
    "social": "VI. Demografía, Educación y Sociedad",
    "biodiversidad": "VII. Biodiversidad, Clima y Riesgos",
    "salud": "VIII. Salud",
    "cultura": "IX. Cultura y Patrimonio",
    "ctci": "X. CTCi e Innovación",
}
for v in variables:
    hub_key = v.get("hub")
    if hub_key in CANONICAL_HUB_TITLES:
        v["hubTitle"] = CANONICAL_HUB_TITLES[hub_key]

for var_id, terms in REQUIRED_SYNONYMS_BY_VAR.items():
    if var_id in var_by_id:
        existing = set(var_by_id[var_id]["synonyms"])
        for t in terms:
            if t not in existing:
                var_by_id[var_id]["synonyms"].append(t)


lexicon_output = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "version": "1.0.0",
    "author": "Álvaro Contreras Barrios",
    "date": "17-Oct-2026",
    "description": "Léxico semántico de lenguaje natural (NLP en cliente) para mapear lenguaje lego, modismos y sinónimos a variables de Aysén Sistémico.",
    "intentKeywords": intent_keywords,
    "stopwords": stopwords,
    "variables": variables,
    "nodes": satellite_nodes
}

with open('data/nl_lexicon_aysen.json', 'w', encoding='utf-8', newline='\n') as f:
    json.dump(lexicon_output, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"Generated data/nl_lexicon_aysen.json with {len(variables)} variables and {len(satellite_nodes)} nodes.")

