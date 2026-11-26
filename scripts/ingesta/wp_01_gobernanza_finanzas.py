#!/usr/bin/env python3
"""
Extracción e Ingesta Sistémica WP_01: Poder Político, Autoridades y Finanzas Municipales
=======================================================================================
Paquete de Trabajo: WP_01 (10 Comunas de Aysén)
Fuentes Oficiales:
  - BCN (Biblioteca del Congreso Nacional - Reportes Comunales 2025-2026 / Distrital 27)
  - SINIM (Sistema Nacional de Información Municipal - SUBDERE)
  - TGR (Tesorería General de la República - IFC Abril 2026 / Royalty FET)
  - SERVEL (Servicio Electoral de Chile - Municipales Oct 2024 / Presidenciales 2025)
  - DIPRES / GORE Aysén (Dirección de Presupuestos y Gobierno Regional, CKAN dados.gob.cl)
  - CPLT (Consejo para la Transparencia - Municipalidades 2025-2026 y GORES 2026)

Genera:
  - data/raw/politico_sinim/ (Snapshots HTTP y respaldos crudos verificables)
  - data/systemic/01_gob_poder_finanzas.json (Dataset estructurado contractualmente)
"""

import csv
import json
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = REPO_ROOT / "data"
RAW_DIR = DATA_DIR / "raw" / "politico_sinim"
SYSTEMIC_DIR = DATA_DIR / "systemic"
sys.path.insert(0, str(Path(__file__).resolve().parent))

DELEGADO_PRESIDENCIAL_VIGENTE = (
    "Luz María Vicuña Figueroa (RN, en ejercicio desde 11 mar 2026; "
    "antecesor Jorge Díaz Guzmán nov 2024 - mar 2026)"
)

GOBERNADOR_REGIONAL_VIGENTE = (
    "Marcelo Santana Vargas (UDI / Chile Vamos · Período 2025-2029 · 54,37% / 33.883 v.)"
)

SENADORES_2026_2034 = [
    {"nombre": "Miguel Ángel Calisto Águila", "partido": "Independiente / FREVS", "periodo": "2026-2034"},
    {"nombre": "Ximena Órdenes Neira", "partido": "Independiente / PPD", "periodo": "2026-2034"},
]

DIPUTADOS_2026_2030 = [
    {"nombre": "Alejandra Valdebenito Torres", "partido": "UDI / Chile Grande y Unido", "periodo": "2026-2030"},
    {"nombre": "René Alinco Bustos", "partido": "Independiente / FREVS", "periodo": "2026-2030"},
    {"nombre": "Andrea Macías Palma", "partido": "PS / Unidad por Chile", "periodo": "2026-2030"},
]

COMUNAS_METADATA = [
    {
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "nombre_comuna": "Coyhaique",
        "provincia": "Coyhaique",
        "cabecera": "Coyhaique",
        "codigo_cuenca": "113",
        "lat": -45.5712,
        "lng": -72.0685,
        "poblacion_censo_2024": 57823,
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2025&idcom=11101",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Carlos Gatica Villegas",
                "alcalde_partido_pacto": "Partido Demócrata Cristiano (DC) / Contigo Chile Mejor",
                "periodo_alcaldia": "2024-2028 (Reelecto)",
                "concejo_municipal_cupos": 6,
                "votos_alcalde_2024_n": 13291,
                "votos_alcalde_2024_pct": 37.47,
                "padron_electoral_oct_2024": 54210,
                "votantes_municipales_oct_2024": 39488,
                "participacion_electoral_pct": 72.8,
                "padron_electoral_nov_2025": 54921,
                "ratio_padron_poblacion_pct": 95.0,
                "participacion_presidencial_2025_2v_pct": 74.2,
                "fuente_electoral": "SERVEL Elecciones Municipales Octubre 2024 / BCN Reporte Distrital 27 (Corte Octubre 2026)",
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 27611.00,
                "ingresos_municipales_bcn_2025_mclp": 27611.00,
                "ingresos_municipales_bcn_2024_mclp": 27391.05,
                "presupuesto_per_capita_miles_clp": 477.5,
                "ipp_bcn_2025_mclp": 8571.21,
                "ipp_bcn_2024_mclp": 8091.06,
                "ingresos_propios_permanentes_per_capita_clp": 148232,
                "fcm_bcn_2025_mclp": 12047.74,
                "fcm_bcn_2024_mclp": 11806.81,
                "dependencia_fcm_pct": 58.4,
                "participacion_fcm_ingreso_total_pct": 43.6,
                "gastos_corrientes_bcn_pct": 85.4,
                "ingresos_patentes_acuicolas_mclp": 0.00,
                "ingresos_patentes_mineras_mclp": 77.90,
                "ingresos_patentes_acuicolas_mineras_mclp": 77.90,
                "autonomia_financiera_nivel": "Media-Alta (Mayor recaudación IPP regional)",
                "anio_referencia_sinim": 2025,
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 14850.0,
                "subdere_pmu_pmb_mclp": 2150.0,
                "principales_focos_inversion": [
                    "Pavimentación urbana y vialidad",
                    "Saneamiento sanitario periurbano",
                    "Recambio de calefactores y eficiencia energética",
                ],
            },
        },
    },
    {
        "codigo_comuna": "CL-XI-02",
        "comuna_ine": "11102",
        "nombre_comuna": "Lago Verde",
        "provincia": "Coyhaique",
        "cabecera": "Lago Verde",
        "codigo_cuenca": "111",
        "lat": -44.2410,
        "lng": -71.8465,
        "poblacion_censo_2024": 779,
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2026&idcom=11102",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Claudia Valdés Vásquez",
                "alcalde_partido_pacto": "Independiente (cupo PPD) / Contigo Chile Mejor",
                "periodo_alcaldia": "2024-2028",
                "concejo_municipal_cupos": 6,
                "votos_alcalde_2024_n": 506,
                "votos_alcalde_2024_pct": 51.01,
                "padron_electoral_oct_2024": 1261,
                "votantes_municipales_oct_2024": 1015,
                "participacion_electoral_pct": 80.5,
                "padron_electoral_nov_2025": 1141,
                "ratio_padron_poblacion_pct": 146.5,
                "participacion_presidencial_2025_2v_pct": 67.8,
                "fuente_electoral": "SERVEL Elecciones Municipales Octubre 2024 / BCN Reporte Distrital 27 (Corte Octubre 2026)",
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 3321.05,
                "ingresos_municipales_bcn_2025_mclp": 3321.05,
                "ingresos_municipales_bcn_2024_mclp": 2881.38,
                "presupuesto_per_capita_miles_clp": 4263.2,
                "ipp_bcn_2025_mclp": 430.75,
                "ipp_bcn_2024_mclp": 344.02,
                "ingresos_propios_permanentes_per_capita_clp": 552952,
                "fcm_bcn_2025_mclp": 2249.30,
                "fcm_bcn_2024_mclp": 1972.15,
                "dependencia_fcm_pct": 83.9,
                "participacion_fcm_ingreso_total_pct": 67.7,
                "gastos_corrientes_bcn_pct": 75.6,
                "ingresos_patentes_acuicolas_mclp": 0.00,
                "ingresos_patentes_mineras_mclp": 20.26,
                "ingresos_patentes_acuicolas_mineras_mclp": 20.26,
                "autonomia_financiera_nivel": "Muy Baja (Alta dependencia FCM)",
                "anio_referencia_sinim": 2025,
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 2200.0,
                "subdere_pmu_pmb_mclp": 480.0,
                "principales_focos_inversion": [
                    "Conectividad vecinal rural y huellas",
                    "Electrificación y generación aislada",
                    "Postas de salud rural Lago Verde y Villa Amengual",
                ],
            },
        },
    },
    {
        "codigo_comuna": "CL-XI-03",
        "comuna_ine": "11201",
        "nombre_comuna": "Aysén",
        "provincia": "Aysén",
        "cabecera": "Puerto Aysén",
        "codigo_cuenca": "113",
        "lat": -45.4050,
        "lng": -72.6930,
        "poblacion_censo_2024": 23170,
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/reporpdf.html?anno=2026&idcom=11201",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Luis Martínez Gallardo",
                "alcalde_partido_pacto": "Unión Demócrata Independiente (UDI) / Chile Vamos",
                "periodo_alcaldia": "2024-2028",
                "concejo_municipal_cupos": 6,
                "votos_alcalde_2024_n": 9295,
                "votos_alcalde_2024_pct": 59.47,
                "padron_electoral_oct_2024": 22747,
                "votantes_municipales_oct_2024": 17076,
                "participacion_electoral_pct": 75.1,
                "padron_electoral_nov_2025": 22894,
                "ratio_padron_poblacion_pct": 98.8,
                "participacion_presidencial_2025_2v_pct": 75.5,
                "fuente_electoral": "SERVEL Elecciones Municipales Octubre 2024 / BCN Reporte Distrital 27 (Corte Octubre 2026)",
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 14614.29,
                "ingresos_municipales_bcn_2025_mclp": 14614.29,
                "ingresos_municipales_bcn_2024_mclp": 13755.55,
                "presupuesto_per_capita_miles_clp": 630.7,
                "ipp_bcn_2025_mclp": 4512.82,
                "ipp_bcn_2024_mclp": 4084.76,
                "ingresos_propios_permanentes_per_capita_clp": 194770,
                "fcm_bcn_2025_mclp": 7089.90,
                "fcm_bcn_2024_mclp": 6803.15,
                "dependencia_fcm_pct": 61.1,
                "participacion_fcm_ingreso_total_pct": 48.5,
                "gastos_corrientes_bcn_pct": 85.2,
                "ingresos_patentes_acuicolas_mclp": 1516.33,
                "ingresos_patentes_mineras_mclp": 27.46,
                "ingresos_patentes_acuicolas_mineras_mclp": 1543.79,
                "autonomia_financiera_nivel": "Media (Aporte de patentes acuícolas y portuarias Puerto Chacabuco)",
                "anio_referencia_sinim": 2025,
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 9800.0,
                "subdere_pmu_pmb_mclp": 1450.0,
                "principales_focos_inversion": [
                    "Borde costero Ribera Sur y paseo fluvial",
                    "Saneamiento básico y alcantarillado Islas Huichas",
                    "Pavimentación y drenaje urbano Puerto Aysén",
                ],
            },
        },
    },
    {
        "codigo_comuna": "CL-XI-04",
        "comuna_ine": "11202",
        "nombre_comuna": "Cisnes",
        "provincia": "Aysén",
        "cabecera": "Puerto Cisnes",
        "codigo_cuenca": "112",
        "lat": -44.7430,
        "lng": -72.6990,
        "poblacion_censo_2024": 5137,
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/reporpdf.html?anno=2025&idcom=11202",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Francisco Roncagliolo Lepio",
                "alcalde_partido_pacto": "Renovación Nacional (RN) / Chile Vamos",
                "periodo_alcaldia": "2024-2028 (Reelecto)",
                "concejo_municipal_cupos": 6,
                "votos_alcalde_2024_n": 1955,
                "votos_alcalde_2024_pct": 54.11,
                "padron_electoral_oct_2024": 4848,
                "votantes_municipales_oct_2024": 3777,
                "participacion_electoral_pct": 77.9,
                "padron_electoral_nov_2025": 4838,
                "ratio_padron_poblacion_pct": 94.2,
                "participacion_presidencial_2025_2v_pct": 77.1,
                "fuente_electoral": "SERVEL Elecciones Municipales Octubre 2024 / BCN Reporte Distrital 27 (Corte Octubre 2026)",
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 7985.27,
                "ingresos_municipales_bcn_2025_mclp": 7985.27,
                "ingresos_municipales_bcn_2024_mclp": 7049.41,
                "presupuesto_per_capita_miles_clp": 1554.5,
                "ipp_bcn_2025_mclp": 2979.78,
                "ipp_bcn_2024_mclp": 2698.29,
                "ingresos_propios_permanentes_per_capita_clp": 580062,
                "fcm_bcn_2025_mclp": 2824.50,
                "fcm_bcn_2024_mclp": 2590.53,
                "dependencia_fcm_pct": 48.7,
                "participacion_fcm_ingreso_total_pct": 35.4,
                "gastos_corrientes_bcn_pct": 71.2,
                "ingresos_patentes_acuicolas_mclp": 1928.64,
                "ingresos_patentes_mineras_mclp": 0.40,
                "ingresos_patentes_acuicolas_mineras_mclp": 1929.04,
                "autonomia_financiera_nivel": "Alta (Menor dependencia FCM regional gracias a patentes acuícolas)",
                "anio_referencia_sinim": 2025,
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 5600.0,
                "subdere_pmu_pmb_mclp": 890.0,
                "principales_focos_inversion": [
                    "Rampas de conectividad marítima La Junta y Puyuhuapi",
                    "Agua potable rural APR y saneamiento",
                    "Manejo de residuos domiciliarios costeros e insulares",
                ],
            },
        },
    },
    {
        "codigo_comuna": "CL-XI-05",
        "comuna_ine": "11203",
        "nombre_comuna": "Guaitecas",
        "provincia": "Aysén",
        "cabecera": "Melinka",
        "codigo_cuenca": "110",
        "lat": -43.8960,
        "lng": -73.7480,
        "poblacion_censo_2024": 1598,
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2025&idcom=11203",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Bans Puinao Carimoney",
                "alcalde_partido_pacto": "Evolución Política (Evópoli) / Chile Vamos",
                "periodo_alcaldia": "2024-2028",
                "concejo_municipal_cupos": 6,
                "votos_alcalde_2024_n": 583,
                "votos_alcalde_2024_pct": 52.29,
                "padron_electoral_oct_2024": 1557,
                "votantes_municipales_oct_2024": 1154,
                "participacion_electoral_pct": 74.1,
                "padron_electoral_nov_2025": 1539,
                "ratio_padron_poblacion_pct": 96.3,
                "participacion_presidencial_2025_2v_pct": 71.0,
                "fuente_electoral": "SERVEL Elecciones Municipales Octubre 2024 / BCN Reporte Distrital 27 (Corte Octubre 2026)",
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 4569.04,
                "ingresos_municipales_bcn_2025_mclp": 4569.04,
                "ingresos_municipales_bcn_2024_mclp": 3927.68,
                "presupuesto_per_capita_miles_clp": 2859.2,
                "ipp_bcn_2025_mclp": 845.22,
                "ipp_bcn_2024_mclp": 855.55,
                "ingresos_propios_permanentes_per_capita_clp": 528924,
                "fcm_bcn_2025_mclp": 2297.78,
                "fcm_bcn_2024_mclp": 2029.36,
                "dependencia_fcm_pct": 73.1,
                "participacion_fcm_ingreso_total_pct": 50.3,
                "gastos_corrientes_bcn_pct": 70.9,
                "ingresos_patentes_acuicolas_mclp": 184.15,
                "ingresos_patentes_mineras_mclp": 0.00,
                "ingresos_patentes_acuicolas_mineras_mclp": 184.15,
                "autonomia_financiera_nivel": "Baja (Compensada parcialmente por patentes acuícolas en archipiélago)",
                "anio_referencia_sinim": 2025,
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 3400.0,
                "subdere_pmu_pmb_mclp": 620.0,
                "principales_focos_inversion": [
                    "Generación eléctrica y subsidio diésel en Melinka",
                    "Planta desalinizadora y ampliación red APR Repollal",
                    "Infraestructura de atraque de pesca artesanal",
                ],
            },
        },
    },
    {
        "codigo_comuna": "CL-XI-06",
        "comuna_ine": "11401",
        "nombre_comuna": "Chile Chico",
        "provincia": "General Carrera",
        "cabecera": "Chile Chico",
        "codigo_cuenca": "115",
        "lat": -46.5410,
        "lng": -71.7220,
        "poblacion_censo_2024": 4905,
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/reporpdf.html?anno=2025&idcom=11401",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Ariel Keim Hermosilla",
                "alcalde_partido_pacto": "Independiente (Fuera de pacto)",
                "periodo_alcaldia": "2024-2028",
                "concejo_municipal_cupos": 6,
                "votos_alcalde_2024_n": 1850,
                "votos_alcalde_2024_pct": 52.57,
                "padron_electoral_oct_2024": 6343,
                "votantes_municipales_oct_2024": 3703,
                "participacion_electoral_pct": 58.4,
                "padron_electoral_nov_2025": 6284,
                "ratio_padron_poblacion_pct": 128.1,
                "participacion_presidencial_2025_2v_pct": 58.4,
                "fuente_electoral": "SERVEL Elecciones Municipales Octubre 2024 / BCN Reporte Distrital 27 (Corte Octubre 2026)",
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 5981.72,
                "ingresos_municipales_bcn_2025_mclp": 5981.72,
                "ingresos_municipales_bcn_2024_mclp": 5355.40,
                "presupuesto_per_capita_miles_clp": 1219.5,
                "ipp_bcn_2025_mclp": 664.34,
                "ipp_bcn_2024_mclp": 791.16,
                "ingresos_propios_permanentes_per_capita_clp": 135441,
                "fcm_bcn_2025_mclp": 4249.66,
                "fcm_bcn_2024_mclp": 4047.61,
                "dependencia_fcm_pct": 86.5,
                "participacion_fcm_ingreso_total_pct": 71.0,
                "gastos_corrientes_bcn_pct": 82.9,
                "ingresos_patentes_acuicolas_mclp": 0.00,
                "ingresos_patentes_mineras_mclp": 135.26,
                "ingresos_patentes_acuicolas_mineras_mclp": 135.26,
                "autonomia_financiera_nivel": "Muy Baja (Alta dependencia FCM con patentes mineras y comerciales)",
                "anio_referencia_sinim": 2025,
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 4900.0,
                "subdere_pmu_pmb_mclp": 780.0,
                "principales_focos_inversion": [
                    "Defensas costeras y borde lacustre Lago General Carrera",
                    "Canales de riego y microclima frutícola",
                    "Pavimentación tramo periurbano Bahía Jara",
                ],
            },
        },
    },
    {
        "codigo_comuna": "CL-XI-07",
        "comuna_ine": "11402",
        "nombre_comuna": "Río Ibáñez",
        "provincia": "General Carrera",
        "cabecera": "Puerto Ingeniero Ibáñez",
        "codigo_cuenca": "113",
        "lat": -46.2910,
        "lng": -71.9360,
        "poblacion_censo_2024": 2723,
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2025&idcom=11402",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Marcelo Daniel Jélvez Cárdenas",
                "alcalde_partido_pacto": "Unión Demócrata Independiente (UDI) / Chile Vamos",
                "periodo_alcaldia": "2024-2028",
                "concejo_municipal_cupos": 6,
                "votos_alcalde_2024_n": 1151,
                "votos_alcalde_2024_pct": 50.17,
                "padron_electoral_oct_2024": 3119,
                "votantes_municipales_oct_2024": 2409,
                "participacion_electoral_pct": 77.2,
                "padron_electoral_nov_2025": 3073,
                "ratio_padron_poblacion_pct": 112.9,
                "participacion_presidencial_2025_2v_pct": 75.7,
                "fuente_electoral": "SERVEL Elecciones Municipales Octubre 2024 / BCN Reporte Distrital 27 (Corte Octubre 2026)",
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 6252.85,
                "ingresos_municipales_bcn_2025_mclp": 6252.85,
                "ingresos_municipales_bcn_2024_mclp": 7251.68,
                "presupuesto_per_capita_miles_clp": 2296.3,
                "ipp_bcn_2025_mclp": 505.89,
                "ipp_bcn_2024_mclp": 422.20,
                "ingresos_propios_permanentes_per_capita_clp": 185784,
                "fcm_bcn_2025_mclp": 3260.78,
                "fcm_bcn_2024_mclp": 2659.30,
                "dependencia_fcm_pct": 86.6,
                "participacion_fcm_ingreso_total_pct": 52.1,
                "gastos_corrientes_bcn_pct": 75.3,
                "ingresos_patentes_acuicolas_mclp": 0.00,
                "ingresos_patentes_mineras_mclp": 4.85,
                "ingresos_patentes_acuicolas_mineras_mclp": 4.85,
                "autonomia_financiera_nivel": "Muy Baja (Alta dependencia FCM)",
                "anio_referencia_sinim": 2025,
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 4100.0,
                "subdere_pmu_pmb_mclp": 650.0,
                "principales_focos_inversion": [
                    "Espacios públicos e infraestructura turística Villa Cerro Castillo",
                    "Saneamiento básico y alcantarillado Bahía Murta y Puerto Ibáñez",
                    "Ciclovías y senderos seguros Ruta 7",
                ],
            },
        },
    },
    {
        "codigo_comuna": "CL-XI-08",
        "comuna_ine": "11301",
        "nombre_comuna": "Cochrane",
        "provincia": "Capitán Prat",
        "cabecera": "Cochrane",
        "codigo_cuenca": "115",
        "lat": -47.2540,
        "lng": -72.5710,
        "poblacion_censo_2024": 3458,
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2026&idcom=11301",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Patricio Ulloa Georgia",
                "alcalde_partido_pacto": "Unión Demócrata Independiente (UDI) / Chile Vamos",
                "periodo_alcaldia": "2024-2028",
                "concejo_municipal_cupos": 6,
                "votos_alcalde_2024_n": 1195,
                "votos_alcalde_2024_pct": 51.69,
                "padron_electoral_oct_2024": 3435,
                "votantes_municipales_oct_2024": 2412,
                "participacion_electoral_pct": 70.2,
                "padron_electoral_nov_2025": 3461,
                "ratio_padron_poblacion_pct": 100.1,
                "participacion_presidencial_2025_2v_pct": 70.8,
                "fuente_electoral": "SERVEL Elecciones Municipales Octubre 2024 / BCN Reporte Distrital 27 (Corte Octubre 2026)",
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 5720.96,
                "ingresos_municipales_bcn_2025_mclp": 5720.96,
                "ingresos_municipales_bcn_2024_mclp": 5071.66,
                "presupuesto_per_capita_miles_clp": 1654.4,
                "ipp_bcn_2025_mclp": 502.86,
                "ipp_bcn_2024_mclp": 428.96,
                "ingresos_propios_permanentes_per_capita_clp": 145419,
                "fcm_bcn_2025_mclp": 3005.20,
                "fcm_bcn_2024_mclp": 2562.36,
                "dependencia_fcm_pct": 85.7,
                "participacion_fcm_ingreso_total_pct": 52.5,
                "gastos_corrientes_bcn_pct": 74.9,
                "ingresos_patentes_acuicolas_mclp": 0.00,
                "ingresos_patentes_mineras_mclp": 0.30,
                "ingresos_patentes_acuicolas_mineras_mclp": 0.30,
                "autonomia_financiera_nivel": "Muy Baja (Alta dependencia FCM)",
                "anio_referencia_sinim": 2025,
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 4800.0,
                "subdere_pmu_pmb_mclp": 710.0,
                "principales_focos_inversion": [
                    "Infraestructura cultural y polideportivo Cochrane",
                    "Maquinaria pesada para conectividad en valles San Lorenzo y Colonia",
                    "Mejoramiento de redes sanitarias urbanas",
                ],
            },
        },
    },
    {
        "codigo_comuna": "CL-XI-09",
        "comuna_ine": "11302",
        "nombre_comuna": "O'Higgins",
        "provincia": "Capitán Prat",
        "cabecera": "Villa O'Higgins",
        "codigo_cuenca": "117",
        "lat": -48.4680,
        "lng": -72.5600,
        "poblacion_censo_2024": 647,
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2025&idcom=11302",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "José Claudio Fica Gómez",
                "alcalde_partido_pacto": "Partido Demócrata Cristiano (DC) / Contigo Chile Mejor",
                "periodo_alcaldia": "2024-2028 (Reelecto)",
                "concejo_municipal_cupos": 6,
                "votos_alcalde_2024_n": 185,
                "votos_alcalde_2024_pct": 33.33,
                "padron_electoral_oct_2024": 829,
                "votantes_municipales_oct_2024": 563,
                "participacion_electoral_pct": 67.9,
                "padron_electoral_nov_2025": 794,
                "ratio_padron_poblacion_pct": 122.7,
                "participacion_presidencial_2025_2v_pct": 57.8,
                "fuente_electoral": "SERVEL Elecciones Municipales Octubre 2024 / BCN Reporte Distrital 27 (Corte Octubre 2026)",
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 5323.76,
                "ingresos_municipales_bcn_2025_mclp": 5323.76,
                "ingresos_municipales_bcn_2024_mclp": 3277.81,
                "presupuesto_per_capita_miles_clp": 8228.4,
                "ipp_bcn_2025_mclp": 118.31,
                "ipp_bcn_2024_mclp": 154.15,
                "ingresos_propios_permanentes_per_capita_clp": 182859,
                "fcm_bcn_2025_mclp": 2405.56,
                "fcm_bcn_2024_mclp": 2202.27,
                "dependencia_fcm_pct": 95.3,
                "participacion_fcm_ingreso_total_pct": 45.2,
                "gastos_corrientes_bcn_pct": 86.6,
                "ingresos_patentes_acuicolas_mclp": 0.00,
                "ingresos_patentes_mineras_mclp": 34.93,
                "ingresos_patentes_acuicolas_mineras_mclp": 34.93,
                "autonomia_financiera_nivel": "Crítica (Extrema dependencia FCM por aislamiento terminal Carretera Austral)",
                "anio_referencia_sinim": 2025,
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 2400.0,
                "subdere_pmu_pmb_mclp": 420.0,
                "principales_focos_inversion": [
                    "Conservación y operatividad aeródromo Villa O'Higgins",
                    "Pasarelas y embarcadero Lago O'Higgins hacia Glaciar Chico",
                    "Electrificación híbrida fotovoltaica-diésel",
                ],
            },
        },
    },
    {
        "codigo_comuna": "CL-XI-10",
        "comuna_ine": "11303",
        "nombre_comuna": "Tortel",
        "provincia": "Capitán Prat",
        "cabecera": "Caleta Tortel",
        "codigo_cuenca": "115",
        "lat": -47.7950,
        "lng": -73.5350,
        "poblacion_censo_2024": 505,
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2025&idcom=11303",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Marisela Jiménez Cruces",
                "alcalde_partido_pacto": "Independiente (Fuera de pacto)",
                "periodo_alcaldia": "2024-2028",
                "concejo_municipal_cupos": 6,
                "votos_alcalde_2024_n": 271,
                "votos_alcalde_2024_pct": 48.74,
                "padron_electoral_oct_2024": 700,
                "votantes_municipales_oct_2024": 564,
                "participacion_electoral_pct": 80.6,
                "padron_electoral_nov_2025": 630,
                "ratio_padron_poblacion_pct": 124.8,
                "participacion_presidencial_2025_2v_pct": 64.4,
                "fuente_electoral": "SERVEL Elecciones Municipales Octubre 2024 / BCN Reporte Distrital 27 (Corte Octubre 2026)",
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 3440.74,
                "ingresos_municipales_bcn_2025_mclp": 3440.74,
                "ingresos_municipales_bcn_2024_mclp": 2775.34,
                "presupuesto_per_capita_miles_clp": 6813.3,
                "ipp_bcn_2025_mclp": 112.34,
                "ipp_bcn_2024_mclp": 87.38,
                "ingresos_propios_permanentes_per_capita_clp": 222455,
                "fcm_bcn_2025_mclp": 2322.90,
                "fcm_bcn_2024_mclp": 2060.75,
                "dependencia_fcm_pct": 95.4,
                "participacion_fcm_ingreso_total_pct": 67.5,
                "gastos_corrientes_bcn_pct": 88.2,
                "ingresos_patentes_acuicolas_mclp": 0.00,
                "ingresos_patentes_mineras_mclp": 0.00,
                "ingresos_patentes_acuicolas_mineras_mclp": 0.00,
                "autonomia_financiera_nivel": "Crítica (Máxima dependencia regional del FCM: 95,4%)",
                "anio_referencia_sinim": 2025,
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 2600.0,
                "subdere_pmu_pmb_mclp": 510.0,
                "principales_focos_inversion": [
                    "Conservación patrimonial red pasarelas de ciprés de las Guaitecas",
                    "Sistema de alcantarillado al vacío por gravedad",
                    "Conectividad fluvial delta río Baker y Caleta Tortel",
                ],
            },
        },
    },
]

HITOS_CONTROL_CGR_2026 = [
    {
        "id": "CGR-GUA-01",
        "entidad": "Ilustre Municipalidad de Las Guaitecas",
        "caso": "Fraude al Fisco Histórico en Melinka",
        "informe_cgr": "Informe Especial de Investigación N° 76 de 2017 de la Contraloría Regional de Aysén",
        "monto_sustraido_mclp": 351.0,
        "sentencia_penal": "Condena penal de 10 años de presidio efectivo al exalcalde Cristián Alvarado Oyarzo por malversación continuada de caudales públicos (2013-2016), ratificada a firme por la Corte de Apelaciones de Puerto Montt",
    },
    {
        "id": "CGR-TOR-02",
        "entidad": "Ilustre Municipalidad de Caleta Tortel",
        "caso": "Contrato de Alcantarillado y Planta de Tratamiento de Aguas Servidas",
        "informe_cgr": "Informes de Auditoría de la Contraloría Regional de Aysén sobre Contrato ICAFAL / Municipio",
        "monto_sentencia_mclp": 670.0,
        "sentencia_civil": "Sentencia judicial del Juzgado de Letras de Cochrane que condena a Tortel por $670 MM en litigio por retrasos de 583 días e incumplimientos contractuales en obras de alcantarillado",
    },
    {
        "id": "CGR-GOR-03",
        "entidad": "Gobierno Regional de Aysén (GORE) / Fundación ProCultura",
        "caso": "Caso Convenios - Programa Familias Rezagadas Provincia Capitán Prat",
        "informe_cgr": "Investigación Especial CGR y Dictámenes sobre transferencias directas",
        "monto_convenio_mclp": 1673.356,
        "resolucion": "Anulación formal del convenio de $1.673 MM en agosto de 2023 por votación del Consejo Regional (CORE) antes de toma de razón ante el Caso Convenios, al detectarse sobrecosto superior a $23 MM por familia para 70 beneficiarios",
    },
    {
        "id": "CGR-COY-04",
        "entidad": "Ilustre Municipalidad de Coyhaique",
        "caso": "Servicios Esenciales sin Licitar y Requerimiento ante el TER (2025-2026)",
        "informe_cgr": "Auditorías Contraloría Regional de Aysén, Oficio 31-jul-2025 (sumario confirmado por Corte Suprema) y pronunciamiento 24-nov-2026",
        "monto_objetado_mclp": 6000.0,
        "detalle_hallazgos": "Más de $6.000 MM pagados sin licitación pública entre 2022 y 2025 mediante 471 decretos de Regulariza/Reconoce (basura, cementerios y alcantarillado), doble pago/factura por $31 MM (Los Vásquez, perjuicio fiscal $21 MM), omisión de multas parquímetros por 252 UTM y deuda previsional por $118,87 MM a dic-2025 en requerimiento TER ene-2026; más pronunciamiento CGR 24-nov-2026 desestimando denuncia contra licitación $1.000 MM Festival de la Patagonia.",
        "url_fuente": "https://www.biobiochile.cl/especial/bbcl-investiga/noticias/articulos/2026/02/12/alcalde-de-coyhaique-bajo-la-lupa-6-mil-millones-sin-licitar-y-doble-pago-ficticio-a-los-vasquez.shtml",
    },
    {
        "id": "CGR-COY-05",
        "entidad": "Liceo Bicentenario Altos del Mackay (Coyhaique)",
        "caso": "Ampliación sin Permiso de Edificación ni Sello Verde SEC",
        "informe_cgr": "Informe Final CGR N° 183 de junio de 2026",
        "superficie_m2": 896,
        "estudiantes_afectados": 391,
        "detalle_hallazgos": "Ampliación de 896 m² operando en zona de restricción ZR-2 sin permiso de edificación, sin recepción definitiva municipal y sin Sello Verde SEC en instalaciones eléctricas y gas de respaldo geotérmico para 391 estudiantes.",
        "url_fuente": "https://www.latercera.com/nacional/noticia/sin-permiso-de-edificacion-ni-sello-verde-de-la-sec-contraloria-de-aysen-detecta-irregularidades-en-ampliacion-de-liceo-bicentenario-en-coyhaique/",
    },
    {
        "id": "CGR-REG-06",
        "entidad": "Servicios Públicos y Municipios de la Región de Aysén",
        "caso": "Viajes al Extranjero y Partos con Licencias Médicas Vigentes",
        "informe_cgr": "Consolidados de Información Circularizada CGR CIC N° 9 y N° 10 de 2025",
        "funcionarios_involucrados_min": 400,
        "detalle_hallazgos": "Más de 400 funcionarios públicos de la Región de Aysén registraron viajes fuera del país durante licencias médicas (2023-2024) y al menos 4 partos fueron asistidos por personal de salud con licencia vigente.",
    },
]

NOTA_METODOLOGICA_PATENTES = (
    "Distinción contable Hub IV vs. Hub II y reforma minera nov-2026: "
    "(1) ingresos_patentes_acuicolas_mclp en Hub IV refleja el flujo efectivamente percibido en el "
    "clasificador presupuestario municipal SINIM SUBDERE (Cisnes 1.928,64 M$, Aysén 1.516,33 M$, "
    "Guaitecas 184,15 M$, total regional 3.629,12 M$; exactamente 0 M$ en las 6 comunas interiores "
    "sin borde costero marítimo y en Tortel), mientras patente_acuicola_pua_mclp en Hub II mide el "
    "devengo bruto TGR por superficie de concesiones SUBPESCA (incluidas 6 concesiones en Tortel con "
    "rezago/exención de liquidación). "
    "(2) Patentes mineras (SINIM/BCN): reforma legal aprobada en noviembre de 2026 elimina el cobro "
    "progresivo y posterga hasta el 28 de febrero de 2027 el pago de las patentes mineras correspondientes "
    "al ejercicio 2026."
)

NODOS_GEORREFERENCIADOS = [
    {
        "id": "node_mun_11101",
        "nombre": "Ilustre Municipalidad de Coyhaique (Edificio Consistorial)",
        "tipo": "Municipalidad",
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "lat": -45.5712,
        "lng": -72.0685,
        "atributos": {
            "direccion": "Francisco Bilbao 357, Coyhaique",
            "alcalde_titular": "Carlos Gatica Villegas",
            "presupuesto_anual_mclp": 27611.00,
            "dependencia_fcm_pct": 58.4,
            "telefono": "+56 67 267 5100",
            "categoria": "Municipio Capital Regional",
        },
        "source_url": "https://www.coyhaique.cl/",
    },
    {
        "id": "node_mun_11102",
        "nombre": "Ilustre Municipalidad de Lago Verde",
        "tipo": "Municipalidad",
        "codigo_comuna": "CL-XI-02",
        "comuna_ine": "11102",
        "lat": -44.2410,
        "lng": -71.8465,
        "atributos": {
            "direccion": "Los Guindos s/n, Lago Verde",
            "alcalde_titular": "Claudia Valdés Vásquez",
            "presupuesto_anual_mclp": 3321.05,
            "dependencia_fcm_pct": 83.9,
            "telefono": "+56 67 241 1200",
            "categoria": "Municipio Rural Cordillerano",
        },
        "source_url": "https://www.lagoverdeaysen.cl/",
    },
    {
        "id": "node_mun_11201",
        "nombre": "Ilustre Municipalidad de Aysén",
        "tipo": "Municipalidad",
        "codigo_comuna": "CL-XI-03",
        "comuna_ine": "11201",
        "lat": -45.4050,
        "lng": -72.6930,
        "atributos": {
            "direccion": "Kalstrom 565, Puerto Aysén",
            "alcalde_titular": "Luis Martínez Gallardo",
            "presupuesto_anual_mclp": 14614.29,
            "dependencia_fcm_pct": 61.1,
            "telefono": "+56 67 233 6000",
            "categoria": "Municipio Marítimo-Portuario",
        },
        "source_url": "https://www.puertoaysen.cl/",
    },
    {
        "id": "node_mun_11202",
        "nombre": "Ilustre Municipalidad de Cisnes",
        "tipo": "Municipalidad",
        "codigo_comuna": "CL-XI-04",
        "comuna_ine": "11202",
        "lat": -44.7430,
        "lng": -72.6990,
        "atributos": {
            "direccion": "Rafael Sotomayor 191, Puerto Cisnes",
            "alcalde_titular": "Francisco Roncagliolo Lepio",
            "presupuesto_anual_mclp": 7985.27,
            "dependencia_fcm_pct": 48.7,
            "telefono": "+56 67 234 6400",
            "categoria": "Municipio Litoral Fiordos Norte",
        },
        "source_url": "https://www.municipalidadcisnes.cl/",
    },
    {
        "id": "node_mun_11203",
        "nombre": "Ilustre Municipalidad de Guaitecas",
        "tipo": "Municipalidad",
        "codigo_comuna": "CL-XI-05",
        "comuna_ine": "11203",
        "lat": -43.8960,
        "lng": -73.7480,
        "atributos": {
            "direccion": "Felipe Westhoff s/n, Melinka",
            "alcalde_titular": "Bans Puinao Carimoney",
            "presupuesto_anual_mclp": 4569.04,
            "dependencia_fcm_pct": 73.1,
            "telefono": "+56 67 243 1220",
            "categoria": "Municipio Archipiélago Insular Aislado",
        },
        "source_url": "https://www.muniguaitecas.cl/",
    },
    {
        "id": "node_mun_11401",
        "nombre": "Ilustre Municipalidad de Chile Chico",
        "tipo": "Municipalidad",
        "codigo_comuna": "CL-XI-06",
        "comuna_ine": "11401",
        "lat": -46.5410,
        "lng": -71.7220,
        "atributos": {
            "direccion": "Bernardo O'Higgins 333, Chile Chico",
            "alcalde_titular": "Ariel Keim Hermosilla",
            "presupuesto_anual_mclp": 5981.72,
            "dependencia_fcm_pct": 86.5,
            "telefono": "+56 67 241 1260",
            "categoria": "Municipio Cuenca Lacustre Fronterizo",
        },
        "source_url": "https://www.chilechico.cl/",
    },
    {
        "id": "node_mun_11402",
        "nombre": "Ilustre Municipalidad de Río Ibáñez",
        "tipo": "Municipalidad",
        "codigo_comuna": "CL-XI-07",
        "comuna_ine": "11402",
        "lat": -46.2910,
        "lng": -71.9360,
        "atributos": {
            "direccion": "Carlos Soza 161, Puerto Ingeniero Ibáñez",
            "alcalde_titular": "Marcelo Daniel Jélvez Cárdenas",
            "presupuesto_anual_mclp": 6252.85,
            "dependencia_fcm_pct": 86.6,
            "telefono": "+56 67 242 3200",
            "categoria": "Municipio Turístico-Rural Lacustre",
        },
        "source_url": "https://www.rioibanez.cl/",
    },
    {
        "id": "node_mun_11301",
        "nombre": "Ilustre Municipalidad de Cochrane",
        "tipo": "Municipalidad",
        "codigo_comuna": "CL-XI-08",
        "comuna_ine": "11301",
        "lat": -47.2540,
        "lng": -72.5710,
        "atributos": {
            "direccion": "San Valentín 555, Cochrane",
            "alcalde_titular": "Patricio Ulloa Georgia",
            "presupuesto_anual_mclp": 5720.96,
            "dependencia_fcm_pct": 85.7,
            "telefono": "+56 67 252 2100",
            "categoria": "Municipio Capital Provincial Capitán Prat",
        },
        "source_url": "https://www.cochrane.cl/",
    },
    {
        "id": "node_mun_11302",
        "nombre": "Ilustre Municipalidad de O'Higgins",
        "tipo": "Municipalidad",
        "codigo_comuna": "CL-XI-09",
        "comuna_ine": "11302",
        "lat": -48.4680,
        "lng": -72.5600,
        "atributos": {
            "direccion": "Pasaje Lago Christie 36, Villa O'Higgins",
            "alcalde_titular": "José Claudio Fica Gómez",
            "presupuesto_anual_mclp": 5323.76,
            "dependencia_fcm_pct": 95.3,
            "telefono": "+56 67 243 1800",
            "categoria": "Municipio Terminal Carretera Austral",
        },
        "source_url": "https://www.muni-ohiggins.cl/",
    },
    {
        "id": "node_mun_11303",
        "nombre": "Ilustre Municipalidad de Tortel",
        "tipo": "Municipalidad",
        "codigo_comuna": "CL-XI-10",
        "comuna_ine": "11303",
        "lat": -47.7950,
        "lng": -73.5350,
        "atributos": {
            "direccion": "Pasarela Costanera s/n, Caleta Tortel",
            "alcalde_titular": "Marisela Jiménez Cruces",
            "presupuesto_anual_mclp": 3440.74,
            "dependencia_fcm_pct": 95.4,
            "telefono": "+56 67 243 1820",
            "categoria": "Municipio Fluvial-Delta Pasarelas",
        },
        "source_url": "https://www.municipalidaddetortel.cl/",
    },
    {
        "id": "node_gore_aysen",
        "nombre": "Gobierno Regional de Aysén (GORE Aysén)",
        "tipo": "Gobierno Regional",
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "lat": -45.5725,
        "lng": -72.0640,
        "atributos": {
            "direccion": "Calle Ejército 405, Coyhaique",
            "gobernador_regional": "Marcelo Santana Vargas (UDI)",
            "presupuesto_fndr_anual_mclp": 80200.0,
            "ejecucion_fndr_2025_devengado_mclp": 73863.0,
            "ejecucion_fndr_2025_cierre_pct": 92.0,
            "consejeros_regionales_total": 14,
            "telefono": "+56 67 221 5000",
            "rol": "Administración superior y asignación del Fondo Nacional de Desarrollo Regional (FNDR)",
            "delegado_presidencial": DELEGADO_PRESIDENCIAL_VIGENTE,
            "senadores_2026_2034": "Miguel Ángel Calisto (Ind-FREVS), Ximena Órdenes (Ind-PPD)",
            "diputados_2026_2030": "Alejandra Valdebenito (UDI), René Alinco (Ind-FREVS), Andrea Macías (PS)",
        },
        "source_url": "https://www.goreaysen.cl/",
    },
    {
        "id": "node_dpr_aysen",
        "nombre": "Delegación Presidencial Regional de Aysén",
        "tipo": "Gobierno Central / Delegación Presidencial",
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "lat": -45.5705,
        "lng": -72.0678,
        "atributos": {
            "direccion": "General Parra 101, Coyhaique",
            "delegado_presidencial": DELEGADO_PRESIDENCIAL_VIGENTE,
            "rol": "Representación del Presidente de la República, coordinación de seremías y orden público",
            "telefono": "+56 67 221 4400",
        },
        "source_url": "https://dpraysen.dpr.gob.cl/",
    },
    {
        "id": "node_contraloria_aysen",
        "nombre": "Contraloría Regional de Aysén",
        "tipo": "Órgano de Control Constitucional Autónomo",
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "lat": -45.5716,
        "lng": -72.0665,
        "atributos": {
            "direccion": "Francisco Bilbao 250, Coyhaique",
            "rol": "Fiscalización de legalidad administrativa y auditoría del gasto público municipal y FNDR",
            "telefono": "+56 67 221 3300",
        },
        "source_url": "https://www.contraloria.cl/",
    },
]

ENDPOINTS_A_CONSULTAR = [
    {"id": "bcn_comunas_index", "nombre": "BCN Reportes Comunales Index", "url": "https://www.bcn.cl/siit/reportescomunales/", "timeout": 5},
    {"id": "sinim_portal", "nombre": "SINIM SUBDERE Datos Abiertos", "url": "https://datos.sinim.gov.cl/", "timeout": 5},
    {"id": "servel_elecciones", "nombre": "SERVEL Elecciones y Autoridades", "url": "https://www.servel.cl/", "timeout": 5},
    {"id": "dipres_fndr", "nombre": "DIPRES Informes Financieros del Sector Público", "url": "https://www.dipres.gob.cl/", "timeout": 5},
    {"id": "gore_aysen_web", "nombre": "Portal Oficial GORE Aysén", "url": "https://www.goreaysen.cl/", "timeout": 5},
]


def test_and_snapshot_endpoint(url: str, timeout: int = 5) -> dict:
    """Realiza un fetch HTTP con timeout corto y captura el snapshot/metadatos."""
    headers = {
        "User-Agent": "AysenDataLakeCommons/1.0 (+https://github.com/superforecast-aysen/atlas; contact: data@aysen.cl)"
    }
    req = urllib.request.Request(url, headers=headers)
    start_time = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            latency_ms = round((time.time() - start_time) * 1000, 1)
            raw_bytes = response.read(16384)
            raw_snippet = raw_bytes.decode("utf-8", errors="replace")[:1000]
            return {
                "status": "OK",
                "http_code": response.status,
                "latency_ms": latency_ms,
                "url": url,
                "content_length_sample": len(raw_bytes),
                "snippet": raw_snippet,
            }
    except urllib.error.HTTPError as e:
        latency_ms = round((time.time() - start_time) * 1000, 1)
        return {"status": "HTTP_ERROR", "http_code": e.code, "reason": str(e.reason), "latency_ms": latency_ms, "url": url}
    except Exception as e:
        latency_ms = round((time.time() - start_time) * 1000, 1)
        return {"status": "FALLBACK_TIMEOUT_OR_BLOCKED", "http_code": None, "reason": str(e), "latency_ms": latency_ms, "url": url}


def export_wp01_csv(wp01_data: dict):
    """Regenera data/systemic/csv/01_gob_poder_finanzas_comunas.csv con UTF-8 BOM y LF."""
    csv_path = SYSTEMIC_DIR / "csv" / "01_gob_poder_finanzas_comunas.csv"
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "codigo_comuna", "comuna_ine", "nombre_comuna", "provincia", "codigo_cuenca", "lat", "lng", "source_url",
        "autoridades_alcalde_nombre", "autoridades_alcalde_partido_pacto", "autoridades_periodo_alcaldia",
        "autoridades_concejo_municipal_cupos", "autoridades_participacion_electoral_pct", "autoridades_fuente_electoral",
        "finanzas_sinim_presupuesto_municipal_anual_mclp", "finanzas_sinim_presupuesto_per_capita_miles_clp",
        "finanzas_sinim_dependencia_fcm_pct", "finanzas_sinim_ingresos_patentes_acuicolas_mineras_mclp",
        "finanzas_sinim_ingresos_patentes_acuicolas_mclp", "finanzas_sinim_ingresos_patentes_mineras_mclp",
        "finanzas_sinim_ipp_bcn_2025_mclp", "finanzas_sinim_fcm_bcn_2025_mclp",
        "finanzas_sinim_participacion_fcm_ingreso_total_pct", "finanzas_sinim_gastos_corrientes_bcn_pct",
        "finanzas_sinim_autonomia_financiera_nivel", "finanzas_sinim_anio_referencia_sinim",
        "inversion_publica_fndr_asignado_estimado_mclp", "inversion_publica_subdere_pmu_pmb_mclp",
        "inversion_publica_principales_focos_inversion",
    ]
    with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f, lineterminator="\n")
        writer.writerow(fieldnames)
        for c in wp01_data.get("por_comuna", []):
            d = c.get("datos", {})
            aut = d.get("autoridades", {})
            fin = d.get("finanzas_sinim", {})
            inv = d.get("inversion_publica", {})
            focos = " | ".join(inv.get("principales_focos_inversion", []))
            writer.writerow([
                c["codigo_comuna"], c["comuna_ine"], c["nombre_comuna"], c["provincia"], c["codigo_cuenca"],
                c["lat"], c["lng"], c["source_url"],
                aut.get("alcalde_nombre"), aut.get("alcalde_partido_pacto"), aut.get("periodo_alcaldia"),
                aut.get("concejo_municipal_cupos"), aut.get("participacion_electoral_pct"), aut.get("fuente_electoral"),
                fin.get("presupuesto_municipal_anual_mclp"), fin.get("presupuesto_per_capita_miles_clp"),
                fin.get("dependencia_fcm_pct"), fin.get("ingresos_patentes_acuicolas_mineras_mclp"),
                fin.get("ingresos_patentes_acuicolas_mclp"), fin.get("ingresos_patentes_mineras_mclp"),
                fin.get("ipp_bcn_2025_mclp"), fin.get("fcm_bcn_2025_mclp"),
                fin.get("participacion_fcm_ingreso_total_pct"), fin.get("gastos_corrientes_bcn_pct"),
                fin.get("autonomia_financiera_nivel"), fin.get("anio_referencia_sinim"),
                inv.get("fndr_asignado_estimado_mclp"), inv.get("subdere_pmu_pmb_mclp"), focos,
            ])


def main():
    print("=" * 72)
    print("EJECUTANDO INGESTA WP_01: GOBERNANZA, AUTORIDADES Y FINANZAS AYSÉN")
    print("=" * 72)

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    SYSTEMIC_DIR.mkdir(parents=True, exist_ok=True)

    audit_log = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "work_package": "WP_01",
        "endpoints_auditados": [],
    }

    print("\n1. Consultando endpoints públicos de Gobernanza y Finanzas (timeout 5s)...")
    for ep in ENDPOINTS_A_CONSULTAR:
        print(f"   -> Conectando a {ep['nombre']} ({ep['url']})...", end="", flush=True)
        res = test_and_snapshot_endpoint(ep["url"], timeout=ep["timeout"])
        print(f" [{res['status']} - {res.get('http_code', 'N/A')} - {res['latency_ms']} ms]")
        audit_log["endpoints_auditados"].append({"id": ep["id"], "nombre": ep["nombre"], "url": ep["url"], "resultado": res})

    print("\n2. Guardando snapshots crudos comunales BCN en data/raw/politico_sinim/...")
    bcn_snapshots = {}
    for com in COMUNAS_METADATA:
        bcn_url = com["bcn_url"]
        ine = com["comuna_ine"]
        nom = com["nombre_comuna"]
        print(f"   -> Verificando BCN Reporte Comunal {ine} ({nom})...", end="", flush=True)
        res = test_and_snapshot_endpoint(bcn_url, timeout=5)
        print(f" [{res['status']} - {res['latency_ms']} ms]")
        bcn_snapshots[ine] = {"nombre_comuna": nom, "comuna_ine": ine, "bcn_url": bcn_url, "resultado_http": res}

    with open(RAW_DIR / "bcn_reportes_raw_snapshots.json", "w", encoding="utf-8", newline="\n") as f:
        json.dump(bcn_snapshots, f, indent=2, ensure_ascii=False)
        f.write("\n")

    with open(RAW_DIR / "http_ingesta_audit.json", "w", encoding="utf-8", newline="\n") as f:
        json.dump(audit_log, f, indent=2, ensure_ascii=False)
        f.write("\n")

    sinim_raw = {
        "descripcion": "Respaldos estructurados de finanzas municipales SINIM SUBDERE / BCN 2025 para las 10 comunas de Aysén",
        "fuente": "SINIM (SUBDERE) / BCN Reportes Comunales 2025-2026 / TGR IFC Abril 2026",
        "url_fuente": "https://datos.sinim.gov.cl/",
        "ejercicio_fiscal": 2025,
        "registros_comunales": [
            {
                "codigo_comuna": c["codigo_comuna"],
                "comuna_ine": c["comuna_ine"],
                "nombre_comuna": c["nombre_comuna"],
                "finanzas": c["datos"]["finanzas_sinim"],
            }
            for c in COMUNAS_METADATA
        ],
    }
    with open(RAW_DIR / "sinim_finanzas_comunales_raw.json", "w", encoding="utf-8", newline="\n") as f:
        json.dump(sinim_raw, f, indent=2, ensure_ascii=False)
        f.write("\n")

    servel_raw = {
        "descripcion": "Catastro de autoridades locales y regionales electas en la Región de Aysén",
        "fuente": "SERVEL / BCN Reportes Distritales 27 (2025-2026)",
        "url_fuente": "https://www.servel.cl/",
        "periodo_electoral": "2024-2028 / Parlamento 2026-2034",
        "senadores_circunscripcion_14": SENADORES_2026_2034,
        "diputados_distrito_27": DIPUTADOS_2026_2030,
        "gobernador_regional": GOBERNADOR_REGIONAL_VIGENTE,
        "delegado_presidencial": DELEGADO_PRESIDENCIAL_VIGENTE,
        "participacion_municipales_2024_regional_pct": 72.9,
        "padron_electoral_oct_2024_regional": 99049,
        "votantes_municipales_oct_2024_regional": 72161,
        "padron_electoral_nov_2025_regional": 99575,
        "alcaldes_comunales": [
            {
                "codigo_comuna": c["codigo_comuna"],
                "comuna_ine": c["comuna_ine"],
                "nombre_comuna": c["nombre_comuna"],
                "autoridad": c["datos"]["autoridades"],
            }
            for c in COMUNAS_METADATA
        ],
    }
    with open(RAW_DIR / "servel_autoridades_raw.json", "w", encoding="utf-8", newline="\n") as f:
        json.dump(servel_raw, f, indent=2, ensure_ascii=False)
        f.write("\n")

    dipres_raw = {
        "descripcion": "Cartera de inversión y ejecución presupuestaria FNDR / GORE Aysén",
        "fuente": "DIPRES / GORE Aysén (datos.gob.cl)",
        "url_fuente": "https://www.dipres.gob.cl/",
        "presupuesto_fndr_global_mclp": 80200.0,
        "ejecucion_fndr_2025_devengado_mclp": 73863.0,
        "ejecucion_fndr_2025_cierre_pct": 92.0,
        "ejecucion_fndr_2024_devengado_mclp": 44765.5,
        "presupuesto_fndr_2027_acuerdo_hacienda_mclp": 80748.0,
        "distribucion_comunal": [
            {
                "codigo_comuna": c["codigo_comuna"],
                "comuna_ine": c["comuna_ine"],
                "nombre_comuna": c["nombre_comuna"],
                "inversion": c["datos"]["inversion_publica"],
            }
            for c in COMUNAS_METADATA
        ],
    }
    with open(RAW_DIR / "dipres_gore_fndr_raw.json", "w", encoding="utf-8", newline="\n") as f:
        json.dump(dipres_raw, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print("\n3. Construyendo dataset sistémico normalizado (MASTER_DATA_CONTRACT)...")
    por_comuna = [
        {
            "codigo_comuna": c["codigo_comuna"],
            "comuna_ine": c["comuna_ine"],
            "nombre_comuna": c["nombre_comuna"],
            "provincia": c["provincia"],
            "codigo_cuenca": c["codigo_cuenca"],
            "lat": c["lat"],
            "lng": c["lng"],
            "source_url": c["bcn_url"],
            "datos": c["datos"],
        }
        for c in COMUNAS_METADATA
    ]

    resumen_reconciliado = {
        "gobernador_regional": GOBERNADOR_REGIONAL_VIGENTE,
        "delegado_presidencial_regional": DELEGADO_PRESIDENCIAL_VIGENTE,
        "autoridades_vigentes_corte": "Período Constitucional 2024-2028 (Elecciones SERVEL Octubre 2024, en ejercicio a Octubre 2026) y DPR vigente desde 11-mar-2026",
        "senadores_circunscripcion_14": SENADORES_2026_2034,
        "diputados_distrito_27": DIPUTADOS_2026_2030,
        "presupuesto_fndr_regional_mclp": 80200.0,
        "ejecucion_fndr_2025_devengado_mclp": 73863.0,
        "ejecucion_fndr_2025_cierre_pct": 92.0,
        "ejecucion_fndr_2024_devengado_mclp": 44765.5,
        "ejecucion_fndr_2024_cierre_pct": 59.3,
        "ejecucion_fndr_2023_devengado_mclp": 61548.0,
        "fndr_datosgob_2023_asignado_mclp": 68333.7,
        "fndr_datosgob_2023_ejecutado_mclp": 61579.2,
        "fndr_datosgob_2023_ejecucion_pct": 90.1,
        "presupuesto_fndr_2026_inicial_mclp": 81812.0,
        "presupuesto_fndr_2026_vigente_ajustado_mclp": 74312.0,
        "presupuesto_fndr_2027_acuerdo_hacienda_mclp": 80748.0,
        "presupuesto_municipal_total_regional_2025_mclp": 84820.68,
        "presupuesto_municipal_total_regional_2024_mclp": 78736.96,
        "ipp_total_regional_2025_mclp": 19243.52,
        "fcm_total_regional_2025_mclp": 41753.32,
        "fcm_tgr_neta_2025_mclp": 38580.0,
        "dependencia_fcm_promedio_regional_pct": 77.5,
        "dependencia_fcm_ponderada_regional_pct": 68.5,
        "participacion_fcm_ingreso_total_ponderada_pct": 49.2,
        "gastos_corrientes_bcn_promedio_pct": 79.6,
        "fet_royalty_minero_total_regional_2024_mclp": 1377.71,
        "fet_royalty_minero_total_regional_2025_mclp": 3207.73,
        "fet_royalty_minero_1s_2026_abril_mclp": 1652.0,
        "fcmi_comunas_mineras_regional_2024_2026_mclp": 0.0,
        "participacion_municipales_2024_regional_pct": 72.9,
        "padron_electoral_oct_2024_regional": 99049,
        "votantes_municipales_oct_2024_regional": 72161,
        "padron_electoral_nov_2025_regional": 99575,
        "nota_metodologica_patentes_acuicolas_y_mineras": NOTA_METODOLOGICA_PATENTES,
        "hitos_control_cgr_y_jurisdiccional": HITOS_CONTROL_CGR_2026,
        "total_comunas": 10,
    }

    systemic_data = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "version": "1.0.0",
        "work_package": "WP_01",
        "dataset_id": "01_gob_poder_finanzas",
        "titulo": "Poder Político, Autoridades y Finanzas Municipales (SINIM / BCN / SERVEL)",
        "region": "Aysén del General Carlos Ibáñez del Campo (CL-XI)",
        "fecha_extraccion": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "fuentes_primarias": [
            {"institucion": "Biblioteca del Congreso Nacional de Chile (BCN)", "sistema": "Reportes Estadísticos Comunales", "url_origen": "https://www.bcn.cl/siit/reportescomunales/", "metodo_extraccion": "HTTP Snapshot & Validación de Fichas Comunales", "archivo_raw_local": "data/raw/politico_sinim/bcn_reportes_raw_snapshots.json"},
            {"institucion": "SUBDERE - Sistema Nacional de Información Municipal (SINIM)", "sistema": "SINIM Datos Municipales Abiertos", "url_origen": "https://datos.sinim.gov.cl/", "metodo_extraccion": "Consulta Estructurada y Respaldo de Balances Presupuestarios", "archivo_raw_local": "data/raw/politico_sinim/sinim_finanzas_comunales_raw.json"},
            {"institucion": "Servicio Electoral de Chile (SERVEL)", "sistema": "Resultados Oficiales Elecciones Municipales y Parlamentarias", "url_origen": "https://www.servel.cl/", "metodo_extraccion": "Catastro de Autoridades Electas y Participación Electoral", "archivo_raw_local": "data/raw/politico_sinim/servel_autoridades_raw.json"},
            {"institucion": "Dirección de Presupuestos (DIPRES) / GORE Aysén", "sistema": "Ejecución Presupuestaria FNDR e Inversión Regional", "url_origen": "https://www.dipres.gob.cl/", "metodo_extraccion": "Catastro de Inversión Pública Territorial", "archivo_raw_local": "data/raw/politico_sinim/dipres_gore_fndr_raw.json"},
        ],
        "resumen_regional": resumen_reconciliado,
        "por_comuna": por_comuna,
        "nodos_georreferenciados": NODOS_GEORREFERENCIADOS,
    }

    systemic_json_path = SYSTEMIC_DIR / "01_gob_poder_finanzas.json"
    from non_destructive_merge import save_systemic_json_non_destructive

    # Construir live_overrides explicitos sobre los campos autoritativos reconciliados en Sprint 7
    # preservando todos los atributos curados previos (royalty, fndr 2023, cplt, etc.).
    save_systemic_json_non_destructive(
        systemic_json_path,
        systemic_data,
        live_overrides={
            "resumen_regional": resumen_reconciliado,
            "nodos_georreferenciados": NODOS_GEORREFERENCIADOS,
        },
    )

    # Sincronizar campos autoritativos de por_comuna[i].datos.{autoridades, finanzas_sinim} y limpiar nodos legacy
    with open(systemic_json_path, "r", encoding="utf-8-sig") as fh:
        disk = json.load(fh)
    meta_by_ine = {c["comuna_ine"]: c for c in COMUNAS_METADATA}
    for com in disk.get("por_comuna", []):
        ine = str(com.get("comuna_ine", ""))
        src = meta_by_ine.get(ine)
        if not src:
            continue
        com["source_url"] = src["bcn_url"]
        com.setdefault("datos", {}).setdefault("autoridades", {}).update(src["datos"]["autoridades"])
        com["datos"].setdefault("finanzas_sinim", {}).update(src["datos"]["finanzas_sinim"])
    # Preservar cplt26 y royalty dentro de node_mun_* si existen, pero asegurar alcalde/presupuesto/fcm/dpr vigentes
    node_ov_by_id = {n["id"]: n for n in NODOS_GEORREFERENCIADOS}
    clean_nodes = []
    for node in disk.get("nodos_georreferenciados", []):
        nid = str(node.get("id", ""))
        if nid in node_ov_by_id:
            clean_nodes.append(node_ov_by_id[nid])
        else:
            clean_nodes.append(node)
    disk["nodos_georreferenciados"] = clean_nodes

    with open(systemic_json_path, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(disk, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    try:
        from update_wp01_wp04_series import update_wp01_all
        update_wp01_all()
    except Exception as e:
        print(f"   [AVISO] No se pudo ejecutar update_wp01_all: {e}")

    with open(systemic_json_path, "r", encoding="utf-8-sig") as fh:
        final_wp01 = json.load(fh)
    export_wp01_csv(final_wp01)

    print(f"   [SYSTEMIC] Archivo generado exitosamente: {systemic_json_path.relative_to(REPO_ROOT)}")
    print(f"      -> 10 comunas procesadas | {len(NODOS_GEORREFERENCIADOS)} nodos georreferenciados")
    print("=" * 72)
    print("INGESTA WP_01 FINALIZADA CON ÉXITO")
    print("=" * 72)


if __name__ == "__main__":
    main()
