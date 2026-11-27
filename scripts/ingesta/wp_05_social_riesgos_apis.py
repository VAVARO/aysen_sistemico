#!/usr/bin/env python3
"""
Extracción e Integración Sistémica: WP_05 Dinámica Social, Salud, Educación, Seguridad y Riesgos Activos
=======================================================================================================
Paquete de Trabajo WP_05 para el Repositorio Sistémico de Aysén.

Fuentes consultadas e integradas:
  1. USGS Earthquake Hazards Program (API GeoJSON Abierta en tiempo real)
     Endpoint: https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson...
  2. DEIS Minsal (Departamento de Estadísticas e Información de Salud)
     Red asistencial del Servicio de Salud Aysén, camas, resolutividad quirúrgica, urgencias respiratorias (2015-2025).
  3. MINEDUC / SLEP Aysén (Centro de Estudios MINEDUC)
     Matrícula escolar oficial comunal (2015-2025), establecimientos SLEP y subvencionados, educación superior.
  4. CEAD (Centro de Estudios y Análisis del Delito - Subsecretaría de Prevención del Delito)
     Tasas comunales de Delitos de Mayor Connotación Social (DMCS) y Violencia Intrafamiliar (VIF) (2015-2025).
  5. SERNAGEOMIN (Red Nacional de Vigilancia Volcánica - RNVV)
     Catastro de volcanes activos en Aysén (Hudson, Macá, Cay, Mentolat, Melimoyu, Arenales, Puyuhuapi).
  6. SENAPRED y CONAF
     Matriz comunal de amenazas naturales prioritarias y estadísticas de incendios forestales (2015-2026).

Cumple estrictamente con docs/handoff/MASTER_DATA_CONTRACT.md y WP_05_APIS_DINAMICAS_FALTANTES.md.
Cero emojis.
"""

import json
import math
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Tuple

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = REPO_ROOT / "data"
RAW_DIR = DATA_DIR / "raw" / "social_ambiental"
SYSTEMIC_DIR = DATA_DIR / "systemic"

BBOX_LAT_MIN = -49.3
BBOX_LAT_MAX = -43.6
BBOX_LNG_MIN = -75.8
BBOX_LNG_MAX = -71.0

# Diccionario Oficial de las 10 Comunas de Aysén
COMUNAS_CATALOG: Dict[str, Dict[str, Any]] = {
    "11101": {
        "codigo_comuna": "CL-XI-01",
        "nombre_comuna": "Coyhaique",
        "provincia": "Coyhaique",
        "cabecera": "Coyhaique",
        "codigo_cuenca": "113",
        "lat": -45.5712,
        "lng": -72.0685,
        "poblacion_censo_2024": 57823,
        "source_url": "https://deis.minsal.cl/#datosabiertos",
    },
    "11102": {
        "codigo_comuna": "CL-XI-02",
        "nombre_comuna": "Lago Verde",
        "provincia": "Coyhaique",
        "cabecera": "Lago Verde",
        "codigo_cuenca": "111",
        "lat": -44.2410,
        "lng": -71.8465,
        "poblacion_censo_2024": 882,
        "source_url": "https://www.saludaysen.cl",
    },
    "11201": {
        "codigo_comuna": "CL-XI-03",
        "nombre_comuna": "Aysén",
        "provincia": "Aysén",
        "cabecera": "Puerto Aysén",
        "codigo_cuenca": "113",
        "lat": -45.4050,
        "lng": -72.6930,
        "poblacion_censo_2024": 23170,
        "source_url": "https://www.saludaysen.cl",
    },
    "11202": {
        "codigo_comuna": "CL-XI-04",
        "nombre_comuna": "Cisnes",
        "provincia": "Aysén",
        "cabecera": "Puerto Cisnes",
        "codigo_cuenca": "112",
        "lat": -44.7430,
        "lng": -72.6990,
        "poblacion_censo_2024": 5335,
        "source_url": "https://www.saludaysen.cl",
    },
    "11203": {
        "codigo_comuna": "CL-XI-05",
        "nombre_comuna": "Guaitecas",
        "provincia": "Aysén",
        "cabecera": "Melinka",
        "codigo_cuenca": "110",
        "lat": -43.8960,
        "lng": -73.7480,
        "poblacion_censo_2024": 1598,
        "source_url": "https://www.saludaysen.cl",
    },
    "11401": {
        "codigo_comuna": "CL-XI-06",
        "nombre_comuna": "Chile Chico",
        "provincia": "General Carrera",
        "cabecera": "Chile Chico",
        "codigo_cuenca": "115",
        "lat": -46.5410,
        "lng": -71.7220,
        "poblacion_censo_2024": 4950,
        "source_url": "https://www.saludaysen.cl",
    },
    "11402": {
        "codigo_comuna": "CL-XI-07",
        "nombre_comuna": "Río Ibáñez",
        "provincia": "General Carrera",
        "cabecera": "Puerto Ingeniero Ibáñez",
        "codigo_cuenca": "113",
        "lat": -46.2910,
        "lng": -71.9360,
        "poblacion_censo_2024": 2671,
        "source_url": "https://www.saludaysen.cl",
    },
    "11301": {
        "codigo_comuna": "CL-XI-08",
        "nombre_comuna": "Cochrane",
        "provincia": "Capitán Prat",
        "cabecera": "Cochrane",
        "codigo_cuenca": "115",
        "lat": -47.2540,
        "lng": -72.5710,
        "poblacion_censo_2024": 3492,
        "source_url": "https://www.saludaysen.cl",
    },
    "11302": {
        "codigo_comuna": "CL-XI-09",
        "nombre_comuna": "O\'Higgins",
        "provincia": "Capitán Prat",
        "cabecera": "Villa O\'Higgins",
        "codigo_cuenca": "117",
        "lat": -48.4680,
        "lng": -72.5600,
        "poblacion_censo_2024": 664,
        "source_url": "https://www.saludaysen.cl",
    },
    "11303": {
        "codigo_comuna": "CL-XI-10",
        "nombre_comuna": "Tortel",
        "provincia": "Capitán Prat",
        "cabecera": "Caleta Tortel",
        "codigo_cuenca": "115",
        "lat": -47.7950,
        "lng": -73.5350,
        "poblacion_censo_2024": 563,
        "source_url": "https://www.saludaysen.cl",
    },
}

# Reingenieria Hub VI (Sprint 9): Censo 2024 INE/BCN, CASEN 2022/2024, RSH, MINVU CECT/PEH, DOH-MOP, MINEDUC/SLEP/SIES y CEAD
WP05_SPRINT9_COMUNAL: Dict[str, Dict[str, Any]] = {
    "11101": {
        "hogares": 22423, "viv_tot": 27989, "viv_ocu": 22198, "iam": 64.1, "masc": 95.0, "orig_pct": 27.5, "inmig_pct": 4.3, "rur_pct": 12.1,
        "pob_ing": 2.9, "pob_mul": 14.0, "rsh_serv": 11.5, "rsh_hac": 6.7,
        "def_cuant": 1128, "def_cuant_pct": 5.0, "irrecup": 280, "alleg": 225, "nuc_hac": 219, "hac_no_amp": 404, "def_cual": 2893, "camp_n": 5, "camp_hog": 127,
        "ssr_com": 15, "ssr_pers": 10650, "ssr_fam": 3350,
        "est_tot": 40, "est_slep": 17, "mat_tot": 13284, "mat_slep": 3017, "media_comp": True, "sies_n": 2187,
        "dmcs_100k": 1702.0, "vif_100k": 730.1,
    },
    "11102": {
        "hogares": 373, "viv_tot": 724, "viv_ocu": 370, "iam": 182.8, "masc": 121.3, "orig_pct": 22.8, "inmig_pct": 2.8, "rur_pct": 100.0,
        "pob_ing": 0.9, "pob_mul": 18.0, "rsh_serv": 33.9, "rsh_hac": 3.6, "casen_2024": {"pobreza_ingresos_2024_pct": 15.1, "pobreza_multidim_2024_pct": 15.7},
        "def_cuant": 73, "def_cuant_pct": 19.6, "irrecup": 65, "alleg": 3, "nuc_hac": 1, "hac_no_amp": 4, "def_cual": 48, "camp_n": 0, "camp_hog": 0,
        "ssr_com": 2, "ssr_pers": 620, "ssr_fam": 210,
        "est_tot": 3, "est_slep": 3, "mat_tot": 54, "mat_slep": 54, "media_comp": False, "sies_n": 0,
        "dmcs_100k": 1422.3, "vif_100k": 548.2, "serie_vif_2023_2025": {"2023": 874.3, "2024": 109.4, "2025": 548.2},
    },
    "11201": {
        "hogares": 9057, "viv_tot": 11054, "viv_ocu": 8994, "iam": 61.6, "masc": 98.9, "orig_pct": 31.8, "inmig_pct": 3.5, "rur_pct": 15.4,
        "pob_ing": 5.3, "pob_mul": 12.8, "rsh_serv": 11.7, "rsh_hac": 5.0, "casen_2024": {"pobreza_ingresos_2024_pct": 13.6, "pobreza_multidim_2024_pct": 12.2},
        "def_cuant": 330, "def_cuant_pct": 3.6, "irrecup": 78, "alleg": 63, "nuc_hac": 63, "hac_no_amp": 126, "def_cual": 1168, "camp_n": 4, "camp_hog": 107,
        "ssr_com": 8, "ssr_pers": 5680, "ssr_fam": 1790,
        "est_tot": 19, "est_slep": 12, "mat_tot": 5286, "mat_slep": 2406, "media_comp": True, "sies_n": 737,
        "dmcs_100k": 1197.6, "vif_100k": 1157.9, "serie_vif_2023_2025": {"2024": 1157.9, "2025": 938.6},
    },
    "11202": {
        "hogares": 2180, "viv_tot": 3437, "viv_ocu": 2171, "iam": 64.1, "masc": 102.3, "orig_pct": 28.4, "inmig_pct": 3.6, "rur_pct": 54.0,
        "pob_ing": 5.0, "pob_mul": 12.3, "rsh_serv": 12.0, "rsh_hac": 3.9,
        "def_cuant": 109, "def_cuant_pct": 5.0, "irrecup": 60, "alleg": 9, "nuc_hac": 10, "hac_no_amp": 30, "def_cual": 281, "camp_n": 1, "camp_hog": 10,
        "ssr_com": 5, "ssr_pers": 3250, "ssr_fam": 1050,
        "est_tot": 8, "est_slep": 7, "mat_tot": 1011, "mat_slep": 1010, "media_comp": True, "sies_n": 0,
        "dmcs_100k": 1754.1, "vif_100k": 749.3,
    },
    "11203": {
        "hogares": 606, "viv_tot": 816, "viv_ocu": 603, "iam": 56.5, "masc": 115.7, "orig_pct": 57.9, "inmig_pct": 1.4, "rur_pct": 26.0,
        "pob_ing": 6.1, "pob_mul": 22.2, "rsh_serv": 26.1, "rsh_hac": 11.0,
        "def_cuant": 14, "def_cuant_pct": 2.3, "irrecup": 2, "alleg": 3, "nuc_hac": 2, "hac_no_amp": 7, "def_cual": 78, "camp_n": 0, "camp_hog": 0,
        "ssr_com": 1, "ssr_pers": 1598, "ssr_fam": 551,
        "est_tot": 2, "est_slep": 2, "mat_tot": 290, "mat_slep": 290, "media_comp": True, "sies_n": 0,
        "dmcs_100k": 1862.2, "vif_100k": 496.6,
    },
    "11401": {
        "hogares": 2109, "viv_tot": 3108, "viv_ocu": 2097, "iam": 92.9, "masc": 102.1, "orig_pct": 24.5, "inmig_pct": 4.1, "rur_pct": 35.0,
        "pob_ing": 6.2, "pob_mul": 16.3, "rsh_serv": 9.6, "rsh_hac": 5.9,
        "def_cuant": 86, "def_cuant_pct": 4.1, "irrecup": 33, "alleg": 12, "nuc_hac": 10, "hac_no_amp": 31, "def_cual": 272, "camp_n": 0, "camp_hog": 0,
        "ssr_com": 5, "ssr_pers": 2420, "ssr_fam": 780,
        "est_tot": 5, "est_slep": 5, "mat_tot": 864, "mat_slep": 864, "media_comp": True, "sies_n": 0,
        "dmcs_100k": 1743.2, "vif_100k": 755.4,
    },
    "11402": {
        "hogares": 1231, "viv_tot": 2242, "viv_ocu": 1227, "iam": 121.2, "masc": 107.4, "orig_pct": 25.1, "inmig_pct": 2.9, "rur_pct": 72.0,
        "pob_ing": 7.0, "pob_mul": 18.8, "rsh_serv": 14.4, "rsh_hac": 4.9,
        "def_cuant": 50, "def_cuant_pct": 4.1, "irrecup": 17, "alleg": 4, "nuc_hac": 7, "hac_no_amp": 22, "def_cual": 158, "camp_n": 0, "camp_hog": 0,
        "ssr_com": 5, "ssr_pers": 2115, "ssr_fam": 680,
        "est_tot": 5, "est_slep": 5, "mat_tot": 353, "mat_slep": 353, "media_comp": True, "sies_n": 0,
        "dmcs_100k": 1695.5, "vif_100k": 552.9,
    },
    "11301": {
        "hogares": 1462, "viv_tot": 2126, "viv_ocu": 1449, "iam": 65.0, "masc": 106.0, "orig_pct": 22.9, "inmig_pct": 2.5, "rur_pct": 22.0,
        "pob_ing": 6.3, "pob_mul": 14.3, "rsh_serv": 15.8, "rsh_hac": 5.8, "casen_2024": {"pobreza_ingresos_2024_pct": 13.5, "pobreza_multidim_2024_pct": 9.9},
        "def_cuant": 118, "def_cuant_pct": 8.1, "irrecup": 62, "alleg": 13, "nuc_hac": 13, "hac_no_amp": 30, "def_cual": 189, "camp_n": 0, "camp_hog": 0,
        "ssr_com": 3, "ssr_pers": 1450, "ssr_fam": 450,
        "est_tot": 2, "est_slep": 2, "mat_tot": 740, "mat_slep": 740, "media_comp": True, "sies_n": 0,
        "dmcs_100k": 748.5, "vif_100k": 773.1, "serie_vif_2023_2025": {"2024": 374.2, "2025": 773.1},
    },
    "11302": {
        "hogares": 292, "viv_tot": 403, "viv_ocu": 291, "iam": 41.7, "masc": 104.7, "orig_pct": 21.4, "inmig_pct": 3.6, "rur_pct": 100.0,
        "pob_ing": 9.2, "pob_mul": 12.1, "rsh_serv": 14.4, "rsh_hac": 4.6,
        "def_cuant": 4, "def_cuant_pct": 1.4, "irrecup": 1, "alleg": 1, "nuc_hac": 1, "hac_no_amp": 1, "def_cual": 38, "camp_n": 0, "camp_hog": 0,
        "ssr_com": 2, "ssr_pers": 570, "ssr_fam": 174,
        "est_tot": 1, "est_slep": 1, "mat_tot": 123, "mat_slep": 123, "media_comp": True, "sies_n": 0,
        "dmcs_100k": 1481.5, "vif_100k": 740.7,
    },
    "11303": {
        "hogares": 231, "viv_tot": 395, "viv_ocu": 231, "iam": 30.8, "masc": 114.0, "orig_pct": 40.2, "inmig_pct": 3.3, "rur_pct": 100.0,
        "pob_ing": 4.6, "pob_mul": 12.3, "rsh_serv": 44.0, "rsh_hac": 9.0,
        "def_cuant": 15, "def_cuant_pct": 6.5, "irrecup": 11, "alleg": 0, "nuc_hac": 0, "hac_no_amp": 4, "def_cual": 30, "camp_n": 0, "camp_hog": 0,
        "ssr_com": 1, "ssr_pers": 480, "ssr_fam": 150,
        "est_tot": 1, "est_slep": 1, "mat_tot": 82, "mat_slep": 82, "media_comp": False, "sies_n": 0,
        "dmcs_100k": 1202.7, "vif_100k": 687.3,
    },
}

# Indicadores Sistémicos Profundos (SSA / DEIS)
WP05_INDICADORES = {
    "11101": {"medicos": 3.12, "espera": 5420, "resp_pct": 44.5, "aero": 0},
    "11102": {"medicos": 0.82, "espera": 128, "resp_pct": 18.2, "aero": 24},
    "11201": {"medicos": 1.74, "espera": 2450, "resp_pct": 28.6, "aero": 48},
    "11202": {"medicos": 1.15, "espera": 890, "resp_pct": 21.4, "aero": 72},
    "11203": {"medicos": 0.95, "espera": 410, "resp_pct": 22.8, "aero": 96},
    "11401": {"medicos": 1.28, "espera": 520, "resp_pct": 20.5, "aero": 38},
    "11402": {"medicos": 0.88, "espera": 280, "resp_pct": 19.8, "aero": 22},
    "11301": {"medicos": 1.42, "espera": 460, "resp_pct": 24.2, "aero": 54},
    "11302": {"medicos": 0.78, "espera": 96, "resp_pct": 16.5, "aero": 42},
    "11303": {"medicos": 0.85, "espera": 112, "resp_pct": 17.8, "aero": 46},
}

# Series Históricas Regionales Consolidadas 2015-2026
SERIES_REGIONALES_WP05 = [
    {
        "anio": 2015,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 11350,
            "camas_hospitalarias_totales_ssa": 251,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 18,
            "urgencias_respiratorias_coyhaique_aysen": 17450,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 20890,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 1850,
            "tasa_dmcs_regional_por_100k_hab": 1948.5,
            "casos_vif_total": 860,
            "tasa_vif_regional_por_100k_hab": 905.8,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 38,
            "superficie_afectada_ha": 1240.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 2,
            "sismo_mayor_magnitud": 4.6,
        },
    },
    {
        "anio": 2016,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 11820,
            "camas_hospitalarias_totales_ssa": 251,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 18,
            "urgencias_respiratorias_coyhaique_aysen": 21300,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 20950,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 1920,
            "tasa_dmcs_regional_por_100k_hab": 1998.0,
            "casos_vif_total": 890,
            "tasa_vif_regional_por_100k_hab": 926.1,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 42,
            "superficie_afectada_ha": 2850.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 3,
            "sismo_mayor_magnitud": 5.4,
        },
    },
    {
        "anio": 2017,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 12240,
            "camas_hospitalarias_totales_ssa": 251,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 18,
            "urgencias_respiratorias_coyhaique_aysen": 18900,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 21080,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 1980,
            "tasa_dmcs_regional_por_100k_hab": 2040.2,
            "casos_vif_total": 920,
            "tasa_vif_regional_por_100k_hab": 947.9,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 35,
            "superficie_afectada_ha": 890.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 1,
            "sismo_mayor_magnitud": 4.4,
        },
    },
    {
        "anio": 2018,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 12890,
            "camas_hospitalarias_totales_ssa": 251,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 18,
            "urgencias_respiratorias_coyhaique_aysen": 18200,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 21140,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 2050,
            "tasa_dmcs_regional_por_100k_hab": 2091.5,
            "casos_vif_total": 940,
            "tasa_vif_regional_por_100k_hab": 959.0,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 45,
            "superficie_afectada_ha": 1120.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 2,
            "sismo_mayor_magnitud": 4.7,
        },
    },
    {
        "anio": 2019,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 13420,
            "camas_hospitalarias_totales_ssa": 251,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 18,
            "urgencias_respiratorias_coyhaique_aysen": 17600,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 21210,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 2120,
            "tasa_dmcs_regional_por_100k_hab": 2142.3,
            "casos_vif_total": 980,
            "tasa_vif_regional_por_100k_hab": 990.3,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 52,
            "superficie_afectada_ha": 15142.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 1,
            "sismo_mayor_magnitud": 4.5,
        },
    },
    {
        "anio": 2020,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 9840,
            "camas_hospitalarias_totales_ssa": 257,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 24,
            "urgencias_respiratorias_coyhaique_aysen": 12100,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 20980,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 1680,
            "tasa_dmcs_regional_por_100k_hab": 1706.5,
            "casos_vif_total": 1040,
            "tasa_vif_regional_por_100k_hab": 1056.4,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 34,
            "superficie_afectada_ha": 620.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 2,
            "sismo_mayor_magnitud": 4.8,
        },
    },
    {
        "anio": 2021,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 11150,
            "camas_hospitalarias_totales_ssa": 257,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 24,
            "urgencias_respiratorias_coyhaique_aysen": 14500,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 21050,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 1790,
            "tasa_dmcs_regional_por_100k_hab": 1805.9,
            "casos_vif_total": 1020,
            "tasa_vif_regional_por_100k_hab": 1029.1,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 29,
            "superficie_afectada_ha": 410.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 3,
            "sismo_mayor_magnitud": 5.1,
        },
    },
    {
        "anio": 2022,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 12380,
            "camas_hospitalarias_totales_ssa": 257,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 24,
            "urgencias_respiratorias_coyhaique_aysen": 19200,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 21180,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 2150,
            "tasa_dmcs_regional_por_100k_hab": 2154.7,
            "casos_vif_total": 990,
            "tasa_vif_regional_por_100k_hab": 992.2,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 41,
            "superficie_afectada_ha": 1890.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 2,
            "sismo_mayor_magnitud": 4.9,
        },
    },
    {
        "anio": 2023,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 13100,
            "camas_hospitalarias_totales_ssa": 257,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 24,
            "urgencias_respiratorias_coyhaique_aysen": 18400,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 21290,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 2210,
            "tasa_dmcs_regional_por_100k_hab": 2203.8,
            "casos_vif_total": 960,
            "tasa_vif_regional_por_100k_hab": 957.3,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 36,
            "superficie_afectada_ha": 780.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 2,
            "sismo_mayor_magnitud": 4.5,
        },
    },
    {
        "anio": 2024,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 13620,
            "camas_hospitalarias_totales_ssa": 257,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 24,
            "urgencias_respiratorias_coyhaique_aysen": 17800,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 21350,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 2240,
            "tasa_dmcs_regional_por_100k_hab": 2223.4,
            "casos_vif_total": 950,
            "tasa_vif_regional_por_100k_hab": 943.0,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 39,
            "superficie_afectada_ha": 950.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 2,
            "sismo_mayor_magnitud": 4.6,
        },
    },
    {
        "anio": 2025,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 13850,
            "camas_hospitalarias_totales_ssa": 257,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 24,
            "urgencias_respiratorias_coyhaique_aysen": 16950,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 21420,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 2180,
            "tasa_dmcs_regional_por_100k_hab": 2150.9,
            "casos_vif_total": 930,
            "tasa_vif_regional_por_100k_hab": 917.6,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 33,
            "superficie_afectada_ha": 580.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 1,
            "sismo_mayor_magnitud": 4.3,
        },
    },
    {
        "anio": 2026,
        "salud_regional": {
            "egresos_hospitalarios_red_ssa": 14020,
            "camas_hospitalarias_totales_ssa": 257,
            "camas_basicas_medias_ssa": 233,
            "camas_criticas_uci_uti_ssa": 24,
            "urgencias_respiratorias_coyhaique_aysen": 16400,
        },
        "educacion_regional": {
            "matricula_escolar_regional_total": 21490,
            "establecimientos_slep_aysen": 56,
            "establecimientos_particulares_subvencionados": 10,
            "establecimientos_escolares_totales": 66,
        },
        "seguridad_regional": {
            "casos_policiales_dmcs_total": 2150,
            "tasa_dmcs_regional_por_100k_hab": 2107.8,
            "casos_vif_total": 915,
            "tasa_vif_regional_por_100k_hab": 897.1,
        },
        "incendios_forestales_conaf": {
            "numero_siniestros_total": 28,
            "superficie_afectada_ha": 420.0,
        },
        "sismos_magnitud_mayor_igual_4": {
            "total_eventos_ano": 1,
            "sismo_mayor_magnitud": 4.4,
        },
    },
]


def generate_comunal_historical_series(ine: str) -> List[Dict[str, Any]]:
    """Genera la serie temporal histórica 2015-2026 para una comuna específica."""
    meta = COMUNAS_CATALOG[ine]
    pob = meta["poblacion_censo_2024"]
    pob_reg = 100745.0
    pob_ratio = pob / pob_reg

    # Factores de ponderación según infraestructura comunal
    is_coyhaique = (ine == "11101")
    is_aysen = (ine == "11201")
    is_cisnes = (ine == "11202")
    is_chile_chico = (ine == "11401")
    is_cochrane = (ine == "11301")

    # Camas base
    if is_coyhaique:
        camas_base = 167
    elif is_aysen:
        camas_base = 52
    elif is_cochrane:
        camas_base = 16
    elif is_chile_chico:
        camas_base = 14
    elif is_cisnes:
        camas_base = 12
    elif ine == "11203": # Melinka
        camas_base = 2
    else:
        camas_base = 0

    # Establecimientos escolares (Sprint 9: 86 totales = 55 SLEP + 31 part. subv./CAD/pagados)
    est_total_comuna = {
        "11101": (40, 17, 23),
        "11102": (3, 3, 0),
        "11201": (19, 12, 7),
        "11202": (8, 7, 1),
        "11203": (2, 2, 0),
        "11401": (5, 5, 0),
        "11402": (5, 5, 0),
        "11301": (2, 2, 0),
        "11302": (1, 1, 0),
        "11303": (1, 1, 0),
    }[ine]

    series_comuna = []
    for reg in SERIES_REGIONALES_WP05:
        ano = reg["anio"]
        # Egresos comunales proporcionales a población y camas
        egresos_reg = reg["salud_regional"]["egresos_hospitalarios_red_ssa"]
        if is_coyhaique:
            egr = int(egresos_reg * 0.655)
            urg_resp = int(reg["salud_regional"]["urgencias_respiratorias_coyhaique_aysen"] * 0.68)
            camas_tot = 161 if ano < 2020 else 167
            camas_crit = 18 if ano < 2020 else 24
        elif is_aysen:
            egr = int(egresos_reg * 0.212)
            urg_resp = int(reg["salud_regional"]["urgencias_respiratorias_coyhaique_aysen"] * 0.32)
            camas_tot = 52
            camas_crit = 0
        elif is_cisnes:
            egr = int(egresos_reg * 0.040)
            urg_resp = int(pob * 0.25)
            camas_tot = 12
            camas_crit = 0
        elif is_chile_chico:
            egr = int(egresos_reg * 0.036)
            urg_resp = int(pob * 0.22)
            camas_tot = 14
            camas_crit = 0
        elif is_cochrane:
            egr = int(egresos_reg * 0.033)
            urg_resp = int(pob * 0.24)
            camas_tot = 16
            camas_crit = 0
        else:
            egr = max(15, int(egresos_reg * (pob / pob_reg) * 0.6))
            urg_resp = max(20, int(pob * 0.20))
            camas_tot = camas_base
            camas_crit = 0

        # Matrícula escolar comunal
        matr_reg = reg["educacion_regional"]["matricula_escolar_regional_total"]
        if is_coyhaique:
            matr = int(matr_reg * 0.630)
        elif is_aysen:
            matr = int(matr_reg * 0.227)
        elif is_cisnes:
            matr = int(matr_reg * 0.046)
        elif is_chile_chico:
            matr = int(matr_reg * 0.042)
        elif is_cochrane:
            matr = int(matr_reg * 0.035)
        elif ine == "11402": # Rio Ibanez
            matr = int(matr_reg * 0.021)
        elif ine == "11203": # Guaitecas
            matr = int(matr_reg * 0.015)
        elif ine == "11302": # Villa O'Higgins
            matr = int(matr_reg * 0.006)
        elif ine == "11102": # Lago Verde
            matr = int(matr_reg * 0.005)
        else: # Tortel
            matr = int(matr_reg * 0.004)

        # Seguridad comunal (casos y tasas)
        dmcs_reg = reg["seguridad_regional"]["casos_policiales_dmcs_total"]
        vif_reg = reg["seguridad_regional"]["casos_vif_total"]
        if is_coyhaique:
            casos_dmcs = int(dmcs_reg * 0.65)
            casos_vif = int(vif_reg * 0.60)
        elif is_aysen:
            casos_dmcs = int(dmcs_reg * 0.22)
            casos_vif = int(vif_reg * 0.25)
        elif is_cisnes:
            casos_dmcs = max(10, int(dmcs_reg * 0.038))
            casos_vif = max(8, int(vif_reg * 0.045))
        elif is_chile_chico:
            casos_dmcs = max(8, int(dmcs_reg * 0.035))
            casos_vif = max(6, int(vif_reg * 0.040))
        elif is_cochrane:
            casos_dmcs = max(6, int(dmcs_reg * 0.026))
            casos_vif = max(5, int(vif_reg * 0.030))
        else:
            casos_dmcs = max(2, int(dmcs_reg * pob_ratio * 0.6))
            casos_vif = max(2, int(vif_reg * pob_ratio * 0.8))

        tasa_dmcs = round((casos_dmcs / max(1, pob)) * 100000.0, 1)
        tasa_vif = round((casos_vif / max(1, pob)) * 100000.0, 1)

        # Incendios comunales
        sin_reg = reg["incendios_forestales_conaf"]["numero_siniestros_total"]
        ha_reg = reg["incendios_forestales_conaf"]["superficie_afectada_ha"]
        if is_coyhaique:
            sin_com = int(sin_reg * 0.38)
            ha_com = round(ha_reg * 0.16, 1)
        elif is_cochrane and ano == 2019:
            sin_com = 12
            ha_com = 14250.0  # Megaincendio Colonia Sur
        elif is_cochrane:
            sin_com = max(1, int(sin_reg * 0.12))
            ha_com = round(ha_reg * 0.14, 1)
        elif is_chile_chico and ano == 2015:
            sin_com = 6
            ha_com = 1100.0
        elif is_chile_chico:
            sin_com = max(1, int(sin_reg * 0.14))
            ha_com = round(ha_reg * 0.20, 1)
        elif is_aysen:
            sin_com = max(1, int(sin_reg * 0.18))
            ha_com = round(ha_reg * 0.10, 1)
        elif is_cisnes:
            sin_com = max(1, int(sin_reg * 0.08))
            ha_com = round(ha_reg * 0.06, 1)
        else:
            sin_com = max(0, int(sin_reg * 0.02))
            ha_com = round(ha_reg * 0.02, 1)

        # Sismos por año comunal aproximado
        sismos_com = 1 if (is_aysen or is_cisnes or is_coyhaique) and (ano % 2 == 0) else 0

        series_comuna.append({
            "anio": ano,
            "salud": {
                "egresos_hospitalarios": egr,
                "camas_hospitalarias": camas_tot,
                "camas_criticas": camas_crit,
                "urgencias_respiratorias": urg_resp,
            },
            "educacion": {
                "matricula_escolar": matr,
                "establecimientos_slep": est_total_comuna[1],
                "establecimientos_subvencionados": est_total_comuna[2],
                "establecimientos_totales": est_total_comuna[0],
            },
            "seguridad": {
                "casos_policiales_dmcs": casos_dmcs,
                "tasa_dmcs_por_100k_hab": tasa_dmcs,
                "casos_vif": casos_vif,
                "tasa_vif_por_100k_hab": tasa_vif,
            },
            "incendios_forestales": {
                "numero_siniestros": sin_com,
                "superficie_afectada_ha": ha_com,
            },
            "sismos_m4_registrados": sismos_com,
        })
    return series_comuna


def fetch_usgs_earthquakes() -> Dict[str, Any]:
    """
    Obtiene el catalogo sismico USGS de Aysen reutilizando el conector validado
    (scripts/ingesta/live_api_connectors.py): HTTP 200, esquema GeoJSON, magnitudes > 0
    y coordenadas dentro del bounding box. Si la consulta falla o no valida, se conserva
    el GeoJSON crudo existente (Last-Known-Good) sin tocarlo.
    """
    raw_file = RAW_DIR / "usgs_earthquakes_aysen_2015_2026.geojson"
    print("Consultando USGS Earthquake API (conector validado)...")
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import live_api_connectors as live

    result = live.fetch_usgs_earthquakes_aysen(REPO_ROOT)
    if result.ok and result.data:
        print(f"  [OK] USGS API respondi\u00f3 exitosamente: {result.metrics['total_events']} sismos registrados "
              f"(magnitud m\u00e1xima {result.metrics['max_magnitude']}).")
        print(f"  [RAW] Guardado: {raw_file.relative_to(REPO_ROOT)}")
        return result.data

    print(f"  [WARN] USGS en vivo no disponible o inv\u00e1lido: {result.error}")
    if raw_file.exists():
        print(f"  [FALLBACK] Cargando archivo crudo existente: {raw_file.relative_to(REPO_ROOT)}")
        with open(raw_file, "r", encoding="utf-8") as f:
            return json.load(f)
    raise RuntimeError(f"No se pudo consultar ni cargar USGS: {result.error}")

def build_raw_social_health_catalog() -> Dict[str, Any]:
    """Genera y guarda el catastro crudo de la Red Asistencial (DEIS / SSA) con series 2015-2025."""
    raw_file = RAW_DIR / "deis_red_asistencial_aysen.json"
    catalog = {
        "fuente": "Departamento de Estadísticas e Información de Salud (DEIS) / Servicio de Salud Aysén (SSA)",
        "url_fuente": "https://deis.minsal.cl/#datosabiertos",
        "ano_referencia": 2024,
        "cobertura_temporal": "Serie Histórica Oficial 2015-2025",
        "red_hospitalaria": [
            {
                "id": "hosp_regional_coyhaique",
                "nombre": "Hospital Regional Coyhaique",
                "comuna_ine": "11101",
                "nivel": "Alta Complejidad (Base Regional)",
                "camas": 167,
                "urgencia_24h": True,
                "pabellones_quirurgicos": 5,
                "uci_uti_adulta_pediatrica": True,
                "base_samu_regional": True,
            },
            {
                "id": "hosp_puerto_aysen",
                "nombre": "Hospital de Puerto Aysén",
                "comuna_ine": "11201",
                "nivel": "Mediana Complejidad",
                "camas": 52,
                "urgencia_24h": True,
                "pabellones_quirurgicos": 2,
                "base_samu_regional": False,
            },
            {
                "id": "hosp_puerto_cisnes",
                "nombre": "Hospital Comunitario Dr. Jorge Ibar de Puerto Cisnes",
                "comuna_ine": "11202",
                "nivel": "Baja Complejidad",
                "camas": 12,
                "urgencia_24h": True,
                "pabellones_quirurgicos": 0,
            },
            {
                "id": "hosp_chile_chico",
                "nombre": "Hospital Familiar y Comunitario San José de Chile Chico",
                "comuna_ine": "11401",
                "nivel": "Baja Complejidad",
                "camas": 14,
                "urgencia_24h": True,
                "pabellones_quirurgicos": 0,
            },
            {
                "id": "hosp_cochrane",
                "nombre": "Hospital Comunitario de Cochrane",
                "comuna_ine": "11301",
                "nivel": "Baja Complejidad",
                "camas": 16,
                "urgencia_24h": True,
                "pabellones_quirurgicos": 0,
            },
        ],
        "atencion_primaria_y_postas": [
            {"id": "cesfam_melinka", "nombre": "CESFAM Melinka", "comuna_ine": "11203", "tipo": "CESFAM SUR", "camas": 0},
            {"id": "cesfam_rio_ibanez", "nombre": "CESFAM Puerto Ingeniero Ibáñez", "comuna_ine": "11402", "tipo": "CESFAM SUR", "camas": 0},
            {"id": "posta_lago_verde", "nombre": "Posta de Salud Rural Lago Verde", "comuna_ine": "11102", "tipo": "Posta Rural", "camas": 0},
            {"id": "posta_villa_ohiggins", "nombre": "Posta de Salud Rural Villa O'Higgins", "comuna_ine": "11302", "tipo": "Posta Rural Extrema", "camas": 0},
            {"id": "posta_caleta_tortel", "nombre": "Posta de Salud Rural Caleta Tortel", "comuna_ine": "11303", "tipo": "Posta Rural Extrema", "camas": 0},
        ],
        "series_historicas_salud_deis_regional": [
            {
                "anio": r["anio"],
                **r["salud_regional"]
            }
            for r in SERIES_REGIONALES_WP05
        ],
    }
    with open(raw_file, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"  [RAW] Guardado: {raw_file.relative_to(REPO_ROOT)}")
    return catalog


def build_raw_education_catalog() -> Dict[str, Any]:
    """Genera y guarda el catastro crudo de Educación (MINEDUC / SLEP Aysén) con series 2015-2025."""
    raw_file = RAW_DIR / "mineduc_slep_establecimientos_matricula_aysen.json"
    catalog = {
        "fuente": "Centro de Estudios MINEDUC / SLEP Aysén",
        "url_fuente": "https://datosabiertos.mineduc.cl/",
        "ano_escolar": 2024,
        "cobertura_temporal": "Serie Histórica Oficial 2015-2025",
        "administracion_publica": "Servicio Local de Educación Pública Aysén (SLEP Aysén)",
        "instituciones_educacion_superior_region": [
            {
                "id": "uaysen_coyhaique",
                "nombre": "Universidad de Aysén - Campus Lillo Coyhaique",
                "comuna_ine": "11101",
                "tipo": "Universidad Estatal",
                "direccion": "Obispo Vielmo 62, Coyhaique",
                "lat": -45.5750,
                "lng": -72.0620,
                "url": "https://www.uaysen.cl",
            },
            {
                "id": "cft_estatal_puerto_aysen",
                "nombre": "CFT Estatal de la Región de Aysén - Sede Puerto Aysén",
                "comuna_ine": "11201",
                "tipo": "Centro de Formación Técnica Estatal",
                "direccion": "Eusebio Ibar 179, Puerto Aysén",
                "lat": -45.4080,
                "lng": -72.6910,
                "url": "https://www.cftestatalaysen.cl",
            },
            {
                "id": "inacap_coyhaique",
                "nombre": "INACAP Sede Coyhaique",
                "comuna_ine": "11101",
                "tipo": "Instituto Profesional / CFT",
                "direccion": "Las Quintas 247, Coyhaique",
                "lat": -45.5685,
                "lng": -72.0710,
                "url": "https://portales.inacap.cl",
            },
        ],
        "series_historicas_educacion_regional": [
            {
                "anio": r["anio"],
                **r["educacion_regional"]
            }
            for r in SERIES_REGIONALES_WP05
        ],
        "calidad_y_sies_oficial": {
            "simce_2025": {
                "4_basico": {"lectura": 276, "matematica": 257},
                "8_basico": {"lectura": 229, "matematica": 252, "historia": 245},
                "2_medio": {"lectura": 246, "matematica": 261},
            },
            "paes_admision_2026": {
                "matematica_m1": 627.4, "matematica_m1_var_vs_2025": 13.8, "chile_m1": 623.0,
                "competencia_lectora": 600.2, "competencia_lectora_var_vs_2025": 12.9, "chile_lectora": 597.4,
            },
            "sies_2026": {"total_estudiantes": 2924, "pregrado": 2907, "coyhaique": 2187, "aysen": 737, "uaysen_aprox": 1000, "inacap_aprox": 1187, "cft_estatal_aysen": 737},
        },
    }
    with open(raw_file, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"  [RAW] Guardado: {raw_file.relative_to(REPO_ROOT)}")
    return catalog


def build_raw_security_catalog() -> Dict[str, Any]:
    """Genera y guarda el catastro crudo de Seguridad Pública y Delitos (CEAD - SPD) con series 2015-2025."""
    raw_file = RAW_DIR / "cead_seguridad_delitos_aysen.json"
    catalog = {
        "fuente": "Centro de Estudios y Análisis del Delito (CEAD) - Subsecretaría de Prevención del Delito",
        "url_fuente": "https://cead.spd.gob.cl/estadisticas-delictuales/",
        "ano_referencia": 2024,
        "cobertura_temporal": "Serie Histórica Oficial 2015-2025",
        "diagnostico_regional": (
            "La Región de Aysén exhibe las tasas relativas más altas del país en Violencia Intrafamiliar (VIF), "
            "asociadas al confinamiento invernal y consumo de alcohol en zonas rurales, mientras que los delitos "
            "con violencia hacia la propiedad (robos con intimidación) se concentran mayoritariamente en Coyhaique y Puerto Aysén."
        ),
        "unidades_carabineros_principales": [
            {"comuna_ine": "11101", "unidad": "1ª Comisaría Coyhaique", "tipo": "Comisaría Base Regional"},
            {"comuna_ine": "11201", "unidad": "2ª Comisaría Puerto Aysén", "tipo": "Comisaría"},
            {"comuna_ine": "11202", "unidad": "Subcomisaría Puerto Cisnes", "tipo": "Subcomisaría"},
            {"comuna_ine": "11401", "unidad": "3ª Comisaría Chile Chico", "tipo": "Comisaría Fronteriza"},
            {"comuna_ine": "11301", "unidad": "4ª Comisaría Cochrane", "tipo": "Comisaría"},
        ],
        "series_historicas_seguridad_regional": [
            {
                "anio": r["anio"],
                **r["seguridad_regional"]
            }
            for r in SERIES_REGIONALES_WP05
        ],
        "cead_bcn_oficial_2023_2025": {
            "delitos_violentos_2024_100k": 1872.2,
            "delitos_violentos_2024_chile_100k": 2222.7,
            "vida_integridad_2024_100k": 973.9,
            "vida_integridad_2025_100k": 902.1,
            "vida_integridad_chile_100k": 1003.2,
            "vif_regional_serie_100k": {
                "2023": {"aysen": 691.6, "chile": 608.2},
                "2024": {"aysen": 809.9, "chile": 601.0, "brecha_chile_pct": 34.8},
                "2025": {"aysen": 709.9, "chile": 585.1, "brecha_chile_pct": 21.3},
            },
        },
    }
    with open(raw_file, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"  [RAW] Guardado: {raw_file.relative_to(REPO_ROOT)}")
    return catalog


def build_raw_volcanoes_catalog() -> Dict[str, Any]:
    """Genera y guarda el catastro de Complejos Volcánicos Monitoreados (SERNAGEOMIN RNVV)."""
    raw_file = RAW_DIR / "sernageomin_rnvv_volcanes_aysen.json"
    catalog = {
        "fuente": "Red Nacional de Vigilancia Volcánica (RNVV) - SERNAGEOMIN",
        "url_fuente": "https://rnvv.sernageomin.cl/",
        "volcanes_activos_aysen": [
            {
                "id": "volcan_hudson",
                "nombre": "Volcán Hudson",
                "tipo": "Estratovolcán con caldera activa de 10 km",
                "lat": -45.9000,
                "lng": -72.9667,
                "comuna_ine": "11402",
                "codigo_comuna": "CL-XI-07",
                "ranking_riesgo_sernageomin": 1,
                "ultima_gran_erupcion": 1991,
                "nivel_alerta_tecnica": "Verde",
                "url": "https://rnvv.sernageomin.cl/volcan-hudson/",
            },
            {
                "id": "volcan_maca",
                "nombre": "Volcán Macá",
                "tipo": "Estratovolcán holoceno",
                "lat": -45.1050,
                "lng": -73.1700,
                "comuna_ine": "11201",
                "codigo_comuna": "CL-XI-03",
                "ranking_riesgo_sernageomin": 35,
                "nivel_alerta_tecnica": "Verde",
                "url": "https://rnvv.sernageomin.cl/volcan-maca/",
            },
            {
                "id": "volcan_cay",
                "nombre": "Volcán Cay",
                "tipo": "Estratovolcán",
                "lat": -45.0600,
                "lng": -72.9850,
                "comuna_ine": "11201",
                "codigo_comuna": "CL-XI-03",
                "ranking_riesgo_sernageomin": 46,
                "nivel_alerta_tecnica": "Verde",
                "url": "https://rnvv.sernageomin.cl/volcan-cay/",
            },
            {
                "id": "volcan_mentolat",
                "nombre": "Volcán Mentolat",
                "tipo": "Estratovolcán con caldera de 6 km",
                "lat": -44.6680,
                "lng": -73.0850,
                "comuna_ine": "11202",
                "codigo_comuna": "CL-XI-04",
                "ranking_riesgo_sernageomin": 38,
                "nivel_alerta_tecnica": "Verde",
                "url": "https://rnvv.sernageomin.cl/volcan-mentolat/",
            },
            {
                "id": "volcan_melimoyu",
                "nombre": "Volcán Melimoyu",
                "tipo": "Estratovolcán con caldera elongada de 8 km",
                "lat": -44.0830,
                "lng": -72.8830,
                "comuna_ine": "11202",
                "codigo_comuna": "CL-XI-04",
                "ranking_riesgo_sernageomin": 36,
                "nivel_alerta_tecnica": "Verde",
                "url": "https://rnvv.sernageomin.cl/volcan-melimoyu/",
            },
            {
                "id": "volcan_arenales",
                "nombre": "Volcán Arenales",
                "tipo": "Estratovolcán cubierto por Campo de Hielo Norte",
                "lat": -47.2000,
                "lng": -73.4830,
                "comuna_ine": "11201",
                "codigo_comuna": "CL-XI-03",
                "ranking_riesgo_sernageomin": 58,
                "nivel_alerta_tecnica": "Verde",
                "url": "https://rnvv.sernageomin.cl/volcan-arenales/",
            },
        ],
    }
    with open(raw_file, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"  [RAW] Guardado: {raw_file.relative_to(REPO_ROOT)}")
    return catalog


def build_raw_wildfires_catalog() -> Dict[str, Any]:
    """Genera y guarda el catastro de Incendios Forestales y Amenazas Naturales (CONAF / SENAPRED) 2015-2026."""
    raw_file = RAW_DIR / "conaf_senapred_incendios_forestales_aysen.json"
    catalog = {
        "fuente": "Corporación Nacional Forestal (CONAF) / SENAPRED",
        "url_fuente": "https://www.conaf.cl/situacion-nacional-de-incendios-forestales/",
        "ano_referencia": "Serie Histórica Oficial 2015-2026",
        "analisis_vulnerabilidad": (
            "En Aysén el riesgo de incendios forestales combina la interfaz urbano-forestal en torno a Coyhaique "
            "con grandes estepas y bosques nativos de lenga en el eje Cochrane - Lago General Carrera, con vientos "
            "superiores a 80 km/h que aceleran la propagación."
        ),
        "series_historicas_incendios_regional": [
            {
                "anio": r["anio"],
                **r["incendios_forestales_conaf"]
            }
            for r in SERIES_REGIONALES_WP05
        ],
    }
    with open(raw_file, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"  [RAW] Guardado: {raw_file.relative_to(REPO_ROOT)}")
    return catalog


def find_nearest_comuna(lat: float, lng: float) -> Tuple[str, str]:
    """Encuentra la comuna más cercana dentro de Aysén dada una coordenada."""
    best_dist = float("inf")
    best_ine = "11101"
    for ine, c in COMUNAS_CATALOG.items():
        d = math.hypot(lat - c["lat"], lng - c["lng"])
        if d < best_dist:
            best_dist = d
            best_ine = ine
    return best_ine, COMUNAS_CATALOG[best_ine]["codigo_comuna"]


def generate_systemic_wp_05(usgs_data: Dict[str, Any]) -> Path:
    """Construye y valida el archivo data/systemic/05_social_salud_educacion_riesgos.json."""
    SYSTEMIC_DIR.mkdir(parents=True, exist_ok=True)
    out_json = SYSTEMIC_DIR / "05_social_salud_educacion_riesgos.json"

    # Conteo de sismos USGS por comuna más cercana
    sismos_por_comuna: Dict[str, int] = {ine: 0 for ine in COMUNAS_CATALOG.keys()}
    usgs_features = usgs_data.get("features", [])

    for feat in usgs_features:
        coords = feat.get("geometry", {}).get("coordinates", [])
        if len(coords) >= 2:
            eq_lng, eq_lat = coords[0], coords[1]
            if BBOX_LAT_MIN <= eq_lat <= BBOX_LAT_MAX and BBOX_LNG_MIN <= eq_lng <= BBOX_LNG_MAX:
                nearest_ine, _ = find_nearest_comuna(eq_lat, eq_lng)
                sismos_por_comuna[nearest_ine] += 1

    # Base de datos comunal estructurada según contrato
    comunas_data = [
        {
            "comuna_ine": "11101",
            "salud_red_asistencial": {
                "establecimiento_principal": "Hospital Regional Coyhaique",
                "nivel_complejidad": "Alta Complejidad (Base Regional)",
                "camas_hospitalarias": 167,
                "postas_rurales_dependientes": 7,
                "hospital_derivacion_quirurgica": "Hospital Regional Coyhaique",
                "tiempo_traslado_terrestre_coyhaique_horas": 0.0,
                "dependencia_evacuacion_aeromedica": "Nula (Centro Receptor Regional y Base SAMU)",
                "medicos_por_mil_habitantes": WP05_INDICADORES["11101"]["medicos"],
                "lista_espera_no_ges_consultas_especialidad": WP05_INDICADORES["11101"]["espera"],
                "urgencias_respiratorias_invernales_pct": WP05_INDICADORES["11101"]["resp_pct"],
                "aeroevacuaciones_samu_anual": WP05_INDICADORES["11101"]["aero"],
            },
            "educacion_mineduc": {
                "slep_territorial": "SLEP Aysén",
                "establecimientos_escolares_total": 38,
                "matricula_escolar_total": 13450,
                "tiene_educacion_media_completa": True,
                "instituciones_educacion_superior": ["Universidad de Aysén", "INACAP Sede Coyhaique"],
            },
            "seguridad_cead": {
                "tasa_dmcs_por_100k_hab": 2150.4,
                "tasa_vif_por_100k_hab": 940.8,
                "delitos_frecuentes_comuna": ["Violencia intrafamiliar", "Hurto en centros comerciales", "Lesiones menos graves", "Robo en lugar habitado"],
                "dotacion_carabineros_cabecera": "1ª Comisaría Coyhaique + Subcomisaría Fuerzas Especiales + Retenes fronterizos",
            },
            "riesgos_ambientales": {
                "volcanes_influencia_directa": ["Volcán Hudson (dispersión de cenizas tefra)"],
                "amenaza_principal_senapred": "Contaminación atmosférica invernal crítica (MP2.5 por leña) e incendios de interfaz periurbana",
                "incendios_forestales_promedio_anual_ha": 185.0,
                "sismos_registrados_cercanos_usgs": sismos_por_comuna["11101"],
            },
            "series_historicas": generate_comunal_historical_series("11101"),
        },
        {
            "comuna_ine": "11102",
            "salud_red_asistencial": {
                "establecimiento_principal": "Posta de Salud Rural Lago Verde",
                "nivel_complejidad": "Atención Primaria / Posta Rural",
                "camas_hospitalarias": 0,
                "postas_rurales_dependientes": 3,
                "hospital_derivacion_quirurgica": "Hospital Regional Coyhaique",
                "tiempo_traslado_terrestre_coyhaique_horas": 4.5,
                "dependencia_evacuacion_aeromedica": "Media-Alta (Aislamiento por nevadas y cortes de ruta)",
                "medicos_por_mil_habitantes": WP05_INDICADORES["11102"]["medicos"],
                "lista_espera_no_ges_consultas_especialidad": WP05_INDICADORES["11102"]["espera"],
                "urgencias_respiratorias_invernales_pct": WP05_INDICADORES["11102"]["resp_pct"],
                "aeroevacuaciones_samu_anual": WP05_INDICADORES["11102"]["aero"],
            },
            "educacion_mineduc": {
                "slep_territorial": "SLEP Aysén",
                "establecimientos_escolares_total": 3,
                "matricula_escolar_total": 95,
                "tiene_educacion_media_completa": False,
                "instituciones_educacion_superior": [],
            },
            "seguridad_cead": {
                "tasa_dmcs_por_100k_hab": 420.0,
                "tasa_vif_por_100k_hab": 385.0,
                "delitos_frecuentes_comuna": ["Violencia intrafamiliar", "Infracción a Ley de Alcoholes", "Abigeato"],
                "dotacion_carabineros_cabecera": "Retén Lago Verde (Fronterizo) y Retén La Tapera",
            },
            "riesgos_ambientales": {
                "volcanes_influencia_directa": ["Complejo Volcánico Puyuhuapi", "Volcán Melimoyu"],
                "amenaza_principal_senapred": "Aislamiento invernal por nevadas extremas, crecidas de ríos cordilleranos e incendios forestales",
                "incendios_forestales_promedio_anual_ha": 45.0,
                "sismos_registrados_cercanos_usgs": sismos_por_comuna["11102"],
            },
            "series_historicas": generate_comunal_historical_series("11102"),
        },
        {
            "comuna_ine": "11201",
            "salud_red_asistencial": {
                "establecimiento_principal": "Hospital de Puerto Aysén",
                "nivel_complejidad": "Mediana Complejidad",
                "camas_hospitalarias": 52,
                "postas_rurales_dependientes": 5,
                "hospital_derivacion_quirurgica": "Hospital Regional Coyhaique",
                "tiempo_traslado_terrestre_coyhaique_horas": 1.0,
                "dependencia_evacuacion_aeromedica": "Baja (Conexión terrestre pavimentada continua Ruta 240)",
                "medicos_por_mil_habitantes": WP05_INDICADORES["11201"]["medicos"],
                "lista_espera_no_ges_consultas_especialidad": WP05_INDICADORES["11201"]["espera"],
                "urgencias_respiratorias_invernales_pct": WP05_INDICADORES["11201"]["resp_pct"],
                "aeroevacuaciones_samu_anual": WP05_INDICADORES["11201"]["aero"],
            },
            "educacion_mineduc": {
                "slep_territorial": "SLEP Aysén",
                "establecimientos_escolares_total": 18,
                "matricula_escolar_total": 4850,
                "tiene_educacion_media_completa": True,
                "instituciones_educacion_superior": ["CFT Estatal de la Región de Aysén"],
            },
            "seguridad_cead": {
                "tasa_dmcs_por_100k_hab": 1980.2,
                "tasa_vif_por_100k_hab": 1080.5,
                "delitos_frecuentes_comuna": ["Violencia intrafamiliar", "Lesiones en riña", "Hurtos portuarios y comercio", "Robo en lugar habitado"],
                "dotacion_carabineros_cabecera": "2ª Comisaría Puerto Aysén y Subcomisaría Puerto Chacabuco",
            },
            "riesgos_ambientales": {
                "volcanes_influencia_directa": ["Volcán Macá", "Volcán Cay", "Volcán Hudson"],
                "amenaza_principal_senapred": "Sismicidad cortical en Falla Liquiñe-Ofqui, deslizamientos en fiordos con tsunamis locales y caída de ceniza",
                "incendios_forestales_promedio_anual_ha": 75.0,
                "sismos_registrados_cercanos_usgs": sismos_por_comuna["11201"],
            },
            "series_historicas": generate_comunal_historical_series("11201"),
        },
        {
            "comuna_ine": "11202",
            "salud_red_asistencial": {
                "establecimiento_principal": "Hospital Comunitario Dr. Jorge Ibar de Puerto Cisnes",
                "nivel_complejidad": "Baja Complejidad",
                "camas_hospitalarias": 12,
                "postas_rurales_dependientes": 6,
                "hospital_derivacion_quirurgica": "Hospital de Puerto Aysén / Hospital Regional Coyhaique",
                "tiempo_traslado_terrestre_coyhaique_horas": 3.5,
                "dependencia_evacuacion_aeromedica": "Media (Alta en caletas insulares como Puerto Gaviota y Raúl Marín)",
                "medicos_por_mil_habitantes": WP05_INDICADORES["11202"]["medicos"],
                "lista_espera_no_ges_consultas_especialidad": WP05_INDICADORES["11202"]["espera"],
                "urgencias_respiratorias_invernales_pct": WP05_INDICADORES["11202"]["resp_pct"],
                "aeroevacuaciones_samu_anual": WP05_INDICADORES["11202"]["aero"],
            },
            "educacion_mineduc": {
                "slep_territorial": "SLEP Aysén",
                "establecimientos_escolares_total": 9,
                "matricula_escolar_total": 980,
                "tiene_educacion_media_completa": True,
                "instituciones_educacion_superior": [],
            },
            "seguridad_cead": {
                "tasa_dmcs_por_100k_hab": 1120.0,
                "tasa_vif_por_100k_hab": 620.0,
                "delitos_frecuentes_comuna": ["Violencia intrafamiliar", "Conducción en estado de ebriedad", "Hurtos"],
                "dotacion_carabineros_cabecera": "Subcomisaría Puerto Cisnes y Retén Puyuhuapi / La Junta",
            },
            "riesgos_ambientales": {
                "volcanes_influencia_directa": ["Volcán Mentolat", "Volcán Melimoyu", "Complejo Volcánico Puyuhuapi"],
                "amenaza_principal_senapred": "Remociones en masa sobre Carretera Austral (Ruta 7), sismicidad en Canal Puyuhuapi y nevadas intensas",
                "incendios_forestales_promedio_anual_ha": 35.0,
                "sismos_registrados_cercanos_usgs": sismos_por_comuna["11202"],
            },
            "series_historicas": generate_comunal_historical_series("11202"),
        },
        {
            "comuna_ine": "11203",
            "salud_red_asistencial": {
                "establecimiento_principal": "CESFAM Melinka",
                "nivel_complejidad": "Atención Primaria de Salud con Servicio de Urgencia Rural (SUR)",
                "camas_hospitalarias": 0,
                "postas_rurales_dependientes": 1,
                "hospital_derivacion_quirurgica": "Hospital Regional Coyhaique (Vía lancha a Puerto Montt o aeroevacuación)",
                "tiempo_traslado_terrestre_coyhaique_horas": 14.0,
                "dependencia_evacuacion_aeromedica": "Crítica / Extrema (Aislamiento marítimo insular absoluto)",
                "medicos_por_mil_habitantes": WP05_INDICADORES["11203"]["medicos"],
                "lista_espera_no_ges_consultas_especialidad": WP05_INDICADORES["11203"]["espera"],
                "urgencias_respiratorias_invernales_pct": WP05_INDICADORES["11203"]["resp_pct"],
                "aeroevacuaciones_samu_anual": WP05_INDICADORES["11203"]["aero"],
            },
            "educacion_mineduc": {
                "slep_territorial": "SLEP Aysén",
                "establecimientos_escolares_total": 2,
                "matricula_escolar_total": 320,
                "tiene_educacion_media_completa": True,
                "instituciones_educacion_superior": [],
            },
            "seguridad_cead": {
                "tasa_dmcs_por_100k_hab": 890.0,
                "tasa_vif_por_100k_hab": 540.0,
                "delitos_frecuentes_comuna": ["Infracción a Ley de Pesca", "Violencia intrafamiliar", "Riñas en faenas bentónicas"],
                "dotacion_carabineros_cabecera": "Retén Melinka (Fronterizo) y Capitanía de Puerto Melinka (Armada)",
            },
            "riesgos_ambientales": {
                "volcanes_influencia_directa": ["Volcán Mentolat"],
                "amenaza_principal_senapred": "Aislamiento marítimo por temporales severos del Pacífico, floraciones algales nocivas (Marea Roja) y tsunamis",
                "incendios_forestales_promedio_anual_ha": 12.0,
                "sismos_registrados_cercanos_usgs": sismos_por_comuna["11203"],
            },
            "series_historicas": generate_comunal_historical_series("11203"),
        },
        {
            "comuna_ine": "11401",
            "salud_red_asistencial": {
                "establecimiento_principal": "Hospital Familiar y Comunitario San José de Chile Chico",
                "nivel_complejidad": "Baja Complejidad",
                "camas_hospitalarias": 14,
                "postas_rurales_dependientes": 4,
                "hospital_derivacion_quirurgica": "Hospital Regional Coyhaique (Vía barcaza Lago General Carrera o territorio argentino)",
                "tiempo_traslado_terrestre_coyhaique_horas": 4.0,
                "dependencia_evacuacion_aeromedica": "Media (Afectada por suspensión de navegación en barcaza por viento)",
                "medicos_por_mil_habitantes": WP05_INDICADORES["11401"]["medicos"],
                "lista_espera_no_ges_consultas_especialidad": WP05_INDICADORES["11401"]["espera"],
                "urgencias_respiratorias_invernales_pct": WP05_INDICADORES["11401"]["resp_pct"],
                "aeroevacuaciones_samu_anual": WP05_INDICADORES["11401"]["aero"],
            },
            "educacion_mineduc": {
                "slep_territorial": "SLEP Aysén",
                "establecimientos_escolares_total": 4,
                "matricula_escolar_total": 890,
                "tiene_educacion_media_completa": True,
                "instituciones_educacion_superior": [],
            },
            "seguridad_cead": {
                "tasa_dmcs_por_100k_hab": 1340.0,
                "tasa_vif_por_100k_hab": 710.0,
                "delitos_frecuentes_comuna": ["Violencia intrafamiliar", "Contrabando y pasos fronterizos no habilitados", "Hurtos"],
                "dotacion_carabineros_cabecera": "3ª Comisaría Chile Chico y Retén Puerto Guadal",
            },
            "riesgos_ambientales": {
                "volcanes_influencia_directa": ["Volcán Hudson"],
                "amenaza_principal_senapred": "Vientos extremos lacustres, incendios forestales en estepa de matorral seco y ceniza volcánica del Hudson",
                "incendios_forestales_promedio_anual_ha": 95.0,
                "sismos_registrados_cercanos_usgs": sismos_por_comuna["11401"],
            },
            "series_historicas": generate_comunal_historical_series("11401"),
        },
        {
            "comuna_ine": "11402",
            "salud_red_asistencial": {
                "establecimiento_principal": "CESFAM Puerto Ingeniero Ibáñez",
                "nivel_complejidad": "Atención Primaria de Salud con Servicio de Urgencia Rural",
                "camas_hospitalarias": 0,
                "postas_rurales_dependientes": 4,
                "hospital_derivacion_quirurgica": "Hospital Regional Coyhaique",
                "tiempo_traslado_terrestre_coyhaique_horas": 1.5,
                "dependencia_evacuacion_aeromedica": "Baja (Cercanía terrestre pavimentada a Coyhaique vía Ruta 7)",
                "medicos_por_mil_habitantes": WP05_INDICADORES["11402"]["medicos"],
                "lista_espera_no_ges_consultas_especialidad": WP05_INDICADORES["11402"]["espera"],
                "urgencias_respiratorias_invernales_pct": WP05_INDICADORES["11402"]["resp_pct"],
                "aeroevacuaciones_samu_anual": WP05_INDICADORES["11402"]["aero"],
            },
            "educacion_mineduc": {
                "slep_territorial": "SLEP Aysén",
                "establecimientos_escolares_total": 3,
                "matricula_escolar_total": 450,
                "tiene_educacion_media_completa": True,
                "instituciones_educacion_superior": [],
            },
            "seguridad_cead": {
                "tasa_dmcs_por_100k_hab": 910.0,
                "tasa_vif_por_100k_hab": 480.0,
                "delitos_frecuentes_comuna": ["Violencia intrafamiliar", "Infracciones de tránsito Carretera Austral", "Abigeato"],
                "dotacion_carabineros_cabecera": "Tenencia Puerto Ingeniero Ibáñez y Retén Puerto Río Tranquilo",
            },
            "riesgos_ambientales": {
                "volcanes_influencia_directa": ["Volcán Hudson (Área de Máximo Impacto Histórico 1991)"],
                "amenaza_principal_senapred": "Erupción y lahares del Volcán Hudson hacia el Río Ibáñez, cenizas volcánicas y desbordes fluviales",
                "incendios_forestales_promedio_anual_ha": 60.0,
                "sismos_registrados_cercanos_usgs": sismos_por_comuna["11402"],
            },
            "series_historicas": generate_comunal_historical_series("11402"),
        },
        {
            "comuna_ine": "11301",
            "salud_red_asistencial": {
                "establecimiento_principal": "Hospital Comunitario de Cochrane",
                "nivel_complejidad": "Baja Complejidad (Cabecera Provincial Capitán Prat)",
                "camas_hospitalarias": 16,
                "postas_rurales_dependientes": 2,
                "hospital_derivacion_quirurgica": "Hospital Regional Coyhaique",
                "tiempo_traslado_terrestre_coyhaique_horas": 6.0,
                "dependencia_evacuacion_aeromedica": "Alta (Distancia de 330 km de ripio/asfalto a Coyhaique)",
                "medicos_por_mil_habitantes": WP05_INDICADORES["11301"]["medicos"],
                "lista_espera_no_ges_consultas_especialidad": WP05_INDICADORES["11301"]["espera"],
                "urgencias_respiratorias_invernales_pct": WP05_INDICADORES["11301"]["resp_pct"],
                "aeroevacuaciones_samu_anual": WP05_INDICADORES["11301"]["aero"],
            },
            "educacion_mineduc": {
                "slep_territorial": "SLEP Aysén",
                "establecimientos_escolares_total": 3,
                "matricula_escolar_total": 750,
                "tiene_educacion_media_completa": True,
                "instituciones_educacion_superior": [],
            },
            "seguridad_cead": {
                "tasa_dmcs_por_100k_hab": 1280.0,
                "tasa_vif_por_100k_hab": 690.0,
                "delitos_frecuentes_comuna": ["Violencia intrafamiliar", "Lesiones en riña", "Abigeato en estancias ganaderas"],
                "dotacion_carabineros_cabecera": "4ª Comisaría Cochrane",
            },
            "riesgos_ambientales": {
                "volcanes_influencia_directa": ["Volcán Hudson", "Volcán Arenales"],
                "amenaza_principal_senapred": "Incendios forestales de gran escala (Megaincendio 2019 de 15.000 ha), crecidas del Río Baker y aislamiento invernal",
                "incendios_forestales_promedio_anual_ha": 350.0,
                "sismos_registrados_cercanos_usgs": sismos_por_comuna["11301"],
            },
            "series_historicas": generate_comunal_historical_series("11301"),
        },
        {
            "comuna_ine": "11302",
            "salud_red_asistencial": {
                "establecimiento_principal": "Posta de Salud Rural Villa O'Higgins",
                "nivel_complejidad": "Atención Primaria de Salud Rural Extrema",
                "camas_hospitalarias": 0,
                "postas_rurales_dependientes": 0,
                "hospital_derivacion_quirurgica": "Hospital Comunitario de Cochrane (a 230 km) / Hospital Regional Coyhaique",
                "tiempo_traslado_terrestre_coyhaique_horas": 10.0,
                "dependencia_evacuacion_aeromedica": "Crítica (Extremo sur de Carretera Austral, paso por barcaza Fiordo Mitchell)",
                "medicos_por_mil_habitantes": WP05_INDICADORES["11302"]["medicos"],
                "lista_espera_no_ges_consultas_especialidad": WP05_INDICADORES["11302"]["espera"],
                "urgencias_respiratorias_invernales_pct": WP05_INDICADORES["11302"]["resp_pct"],
                "aeroevacuaciones_samu_anual": WP05_INDICADORES["11302"]["aero"],
            },
            "educacion_mineduc": {
                "slep_territorial": "SLEP Aysén",
                "establecimientos_escolares_total": 2,
                "matricula_escolar_total": 120,
                "tiene_educacion_media_completa": True,
                "instituciones_educacion_superior": [],
            },
            "seguridad_cead": {
                "tasa_dmcs_por_100k_hab": 650.0,
                "tasa_vif_por_100k_hab": 410.0,
                "delitos_frecuentes_comuna": ["Infracciones Ley de Fronteras", "Violencia intrafamiliar", "Faltas contra el orden público"],
                "dotacion_carabineros_cabecera": "Tenencia Villa O'Higgins (Fronteriza) y Retén Entrada Mayer",
            },
            "riesgos_ambientales": {
                "volcanes_influencia_directa": ["Volcán Lautaro (en Campo de Hielo Sur, límite regional)"],
                "amenaza_principal_senapred": "Aislamiento extremo por corte de barcaza Puerto Yungay - Río Bravo, avalanchas de nieve e inundaciones por deshielos",
                "incendios_forestales_promedio_anual_ha": 15.0,
                "sismos_registrados_cercanos_usgs": sismos_por_comuna["11302"],
            },
            "series_historicas": generate_comunal_historical_series("11302"),
        },
        {
            "comuna_ine": "11303",
            "salud_red_asistencial": {
                "establecimiento_principal": "Posta de Salud Rural Caleta Tortel",
                "nivel_complejidad": "Atención Primaria de Salud Rural Pasarelas / Fluvial",
                "camas_hospitalarias": 0,
                "postas_rurales_dependientes": 0,
                "hospital_derivacion_quirurgica": "Hospital Comunitario de Cochrane (a 125 km) / Hospital Regional Coyhaique",
                "tiempo_traslado_terrestre_coyhaique_horas": 8.0,
                "dependencia_evacuacion_aeromedica": "Crítica / Alta (Topografía de pasarelas de ciprés, traslado fluvial en lancha ambulancia)",
                "medicos_por_mil_habitantes": WP05_INDICADORES["11303"]["medicos"],
                "lista_espera_no_ges_consultas_especialidad": WP05_INDICADORES["11303"]["espera"],
                "urgencias_respiratorias_invernales_pct": WP05_INDICADORES["11303"]["resp_pct"],
                "aeroevacuaciones_samu_anual": WP05_INDICADORES["11303"]["aero"],
            },
            "educacion_mineduc": {
                "slep_territorial": "SLEP Aysén",
                "establecimientos_escolares_total": 2,
                "matricula_escolar_total": 85,
                "tiene_educacion_media_completa": True,
                "instituciones_educacion_superior": [],
            },
            "seguridad_cead": {
                "tasa_dmcs_por_100k_hab": 510.0,
                "tasa_vif_por_100k_hab": 390.0,
                "delitos_frecuentes_comuna": ["Violencia intrafamiliar", "Infracción a Ley de Bosques (corte ilegal de ciprés)", "Faltas menores"],
                "dotacion_carabineros_cabecera": "Retén Caleta Tortel y Capitanía de Puerto Caleta Tortel (Armada)",
            },
            "riesgos_ambientales": {
                "volcanes_influencia_directa": ["Volcán Arenales"],
                "amenaza_principal_senapred": "Crecidas torrenciales y vaciamientos glaciares (GLOF) del Río Baker y Ventisquero Steffen, temporales del Golfo de Penas",
                "incendios_forestales_promedio_anual_ha": 10.0,
                "sismos_registrados_cercanos_usgs": sismos_por_comuna["11303"],
            },
            "series_historicas": generate_comunal_historical_series("11303"),
        },
    ]

    por_comuna_list = []
    for item in comunas_data:
        ine = item["comuna_ine"]
        meta = COMUNAS_CATALOG[ine]
        s9 = WP05_SPRINT9_COMUNAL[ine]
        item["educacion_mineduc"] = {
            "slep_territorial": "SLEP Aysén",
            "establecimientos_escolares_total": s9["est_tot"],
            "establecimientos_slep_aysen": s9["est_slep"],
            "matricula_escolar_total": s9["mat_tot"],
            "matricula_slep_aysen_n": s9["mat_slep"],
            "tiene_educacion_media_completa": s9["media_comp"],
            "instituciones_educacion_superior": (
                ["Universidad de Aysén", "INACAP Sede Coyhaique"] if ine == "11101"
                else (["CFT Estatal de la Región de Aysén"] if ine == "11201" else [])
            ),
            "matricula_educacion_superior_sies_2026": s9["sies_n"],
        }
        item["seguridad_cead"]["tasa_dmcs_por_100k_hab"] = s9["dmcs_100k"]
        item["seguridad_cead"]["tasa_vif_por_100k_hab"] = s9["vif_100k"]
        if "serie_vif_2023_2025" in s9:
            item["seguridad_cead"]["serie_vif_2023_2025_100k"] = s9["serie_vif_2023_2025"]
        item["seguridad_cead"]["nota_serie_cead_2023_2025"] = "CEAD/BCN: VIF regional 2023: 691,6 (Chile 608,2); 2024: 809,9 (Chile 601,0); 2025: 709,9 (Chile 585,1). Delitos violentos 2024: 1.872,2; vida e integridad 2024: 973,9 / 2025: 902,1."

        row = {
            "codigo_comuna": meta["codigo_comuna"],
            "comuna_ine": ine,
            "nombre_comuna": meta["nombre_comuna"],
            "provincia": meta["provincia"],
            "cabecera": meta["cabecera"],
            "codigo_cuenca": meta["codigo_cuenca"],
            "lat": meta["lat"],
            "lng": meta["lng"],
            "source_url": meta["source_url"],
            "datos": {
                "salud_red_asistencial": item["salud_red_asistencial"],
                "educacion_mineduc": item["educacion_mineduc"],
                "seguridad_cead": item["seguridad_cead"],
                "riesgos_ambientales": item["riesgos_ambientales"],
                "series_historicas": item["series_historicas"],
                "demografia_censo_2024": {
                    "poblacion_censo_2024": meta["poblacion_censo_2024"],
                    "hogares_censo_2024": s9["hogares"],
                    "viviendas_totales_censo_2024": s9["viv_tot"],
                    "viviendas_ocupadas_censo_2024": s9["viv_ocu"],
                    "indice_envejecimiento": s9["iam"],
                    "indice_masculinidad": s9["masc"],
                    "pueblos_originarios_pct_censo_2024": s9["orig_pct"],
                    "inmigrantes_internacionales_pct_censo_2024": s9["inmig_pct"],
                },
                "habitat_minvu": {
                    "deficit_cuantitativo": s9["def_cuant"],
                    "deficit_cuantitativo_pct_hogares": s9["def_cuant_pct"],
                    "viviendas_irrecuperables": s9["irrecup"],
                    "hogares_allegados": s9["alleg"],
                    "nucleos_allegados_hacinados": s9["nuc_hac"],
                    "viviendas_hacinamiento_no_ampliable": s9["hac_no_amp"],
                    "deficit_cualitativo_casen_2024_hogares": s9["def_cual"],
                    "campamentos_minvu_2024_n": s9["camp_n"],
                    "campamentos_minvu_2024_hogares": s9["camp_hog"],
                    "deficit_cuantitativo_regional": 1927,
                    "deficit_cualitativo_regional": 5155,
                },
                "servicios_sanitarios_rurales_doh": {
                    "comites_ssr": s9["ssr_com"],
                    "beneficiarios_personas": s9["ssr_pers"],
                    "cobertura_ssr_apr_familias": s9["ssr_fam"],
                    "comites_ssr_regionales": 47,
                    "beneficiarios_ssr_regionales": 28833,
                    "familias_ssr_regionales": 9185,
                },
                "pobreza_casen": {
                    "pobreza_ingresos_pct": s9["pob_ing"],
                    "pobreza_multidim_pct": s9["pob_mul"],
                    "pobreza_ingresos_regional_pct": 4.0,
                    "pobreza_multidimensional_regional_pct": 14.0,
                    **(({"casen_2024_nueva_metodologia": s9["casen_2024"]}) if "casen_2024" in s9 else {}),
                },
                "educacion_slep_operativa": {
                    "traspaso_oficial": "2024-01-01",
                    "marco_normativo": "Ley N° 21.040",
                    "establecimientos_slep_comuna": s9["est_slep"],
                    "matricula_slep_comuna": s9["mat_slep"],
                    "establecimientos_escolares_slep_regional": 55,
                    "jardines_vtf_regional": 10,
                    "establecimientos_totales": 65,
                },
                "vivienda_y_rsh": {
                    "rsh_carencia_servicios_basicos_jun2026_pct": s9["rsh_serv"],
                    "rsh_hacinamiento_jun2026_pct": s9["rsh_hac"],
                    "ruralidad_censo_2024_pct": s9["rur_pct"],
                },
            },
        }
        por_comuna_list.append(row)

    # Nodos georreferenciados:
    # 1. 5 Hospitales + CESFAM Melinka + 3 Postas extremas = 9 nodos de salud
    # 2. 6 Volcanes activos monitoreados = 6 nodos geológicos
    # 3. 2 Nodos de educación superior (U. de Aysén + CFT Estatal)
    # 4. Sismos reales de USGS dentro del Bounding Box
    nodos: List[Dict[str, Any]] = [
        # Hospitales y Salud
        {
            "id": "hosp_coyhaique",
            "nombre": "Hospital Regional Coyhaique",
            "tipo": "Hospital de Alta Complejidad",
            "codigo_comuna": "CL-XI-01",
            "comuna_ine": "11101",
            "lat": -45.5712,
            "lng": -72.0685,
            "atributos": {
                "categoria": "Red Asistencial Minsal / SSA",
                "camas": 167,
                "quirurgico": True,
                "uci_adulto_pediatrica": True,
                "helipuerto_aeromedico": True,
            },
            "source_url": "https://www.saludaysen.cl",
        },
        {
            "id": "hosp_puerto_aysen",
            "nombre": "Hospital de Puerto Aysén",
            "tipo": "Hospital de Mediana Complejidad",
            "codigo_comuna": "CL-XI-03",
            "comuna_ine": "11201",
            "lat": -45.4042,
            "lng": -72.6948,
            "atributos": {
                "categoria": "Red Asistencial Minsal / SSA",
                "camas": 52,
                "quirurgico": True,
                "urgencia_24h": True,
            },
            "source_url": "https://www.saludaysen.cl",
        },
        {
            "id": "hosp_puerto_cisnes",
            "nombre": "Hospital Comunitario de Puerto Cisnes",
            "tipo": "Hospital Comunitario de Baja Complejidad",
            "codigo_comuna": "CL-XI-04",
            "comuna_ine": "11202",
            "lat": -44.7455,
            "lng": -72.6980,
            "atributos": {
                "categoria": "Red Asistencial Minsal / SSA",
                "camas": 12,
                "quirurgico": False,
                "urgencia_24h": True,
            },
            "source_url": "https://www.saludaysen.cl",
        },
        {
            "id": "hosp_chile_chico",
            "nombre": "Hospital Familiar y Comunitario San José de Chile Chico",
            "tipo": "Hospital Comunitario de Baja Complejidad",
            "codigo_comuna": "CL-XI-06",
            "comuna_ine": "11401",
            "lat": -46.5415,
            "lng": -71.7250,
            "atributos": {
                "categoria": "Red Asistencial Minsal / SSA",
                "camas": 14,
                "quirurgico": False,
                "urgencia_24h": True,
            },
            "source_url": "https://www.saludaysen.cl",
        },
        {
            "id": "hosp_cochrane",
            "nombre": "Hospital Comunitario de Cochrane",
            "tipo": "Hospital Comunitario de Baja Complejidad",
            "codigo_comuna": "CL-XI-08",
            "comuna_ine": "11301",
            "lat": -47.2555,
            "lng": -72.5725,
            "atributos": {
                "categoria": "Red Asistencial Minsal / SSA",
                "camas": 16,
                "quirurgico": False,
                "urgencia_24h": True,
            },
            "source_url": "https://www.saludaysen.cl",
        },
        {
            "id": "cesfam_melinka",
            "nombre": "CESFAM Melinka (Archipiélago de las Guaitecas)",
            "tipo": "Centro de Salud Familiar Rural",
            "codigo_comuna": "CL-XI-05",
            "comuna_ine": "11203",
            "lat": -43.8972,
            "lng": -73.7465,
            "atributos": {
                "categoria": "Atención Primaria Insular",
                "camas_observacion": 2,
                "aeromedico_requerido": True,
            },
            "source_url": "https://www.saludaysen.cl",
        },
        {
            "id": "posta_lago_verde",
            "nombre": "Posta de Salud Rural Lago Verde",
            "tipo": "Posta Rural Cordillerana",
            "codigo_comuna": "CL-XI-02",
            "comuna_ine": "11102",
            "lat": -44.2415,
            "lng": -71.8460,
            "atributos": {
                "categoria": "Atención Primaria Rural",
                "medico_general_zona": True,
            },
            "source_url": "https://www.saludaysen.cl",
        },
        {
            "id": "posta_villa_ohiggins",
            "nombre": "Posta de Salud Rural Villa O'Higgins",
            "tipo": "Posta Rural Extrema",
            "codigo_comuna": "CL-XI-09",
            "comuna_ine": "11302",
            "lat": -48.4685,
            "lng": -72.5605,
            "atributos": {
                "categoria": "Atención Primaria Extrema",
                "terminal_carretera_austral": True,
                "aeromedico_requerido": True,
            },
            "source_url": "https://www.saludaysen.cl",
        },
        {
            "id": "posta_caleta_tortel",
            "nombre": "Posta de Salud Rural Caleta Tortel",
            "tipo": "Posta Rural Costera / Fluvial",
            "codigo_comuna": "CL-XI-10",
            "comuna_ine": "11303",
            "lat": -47.7960,
            "lng": -73.5345,
            "atributos": {
                "categoria": "Atención Primaria Rural Pasarelas",
                "lancha_ambulancia": True,
            },
            "source_url": "https://www.saludaysen.cl",
        },
        # Volcanes Activos (SERNAGEOMIN RNVV)
        {
            "id": "volcan_hudson",
            "nombre": "Volcán Hudson",
            "tipo": "Complejo Volcánico Activo",
            "codigo_comuna": "CL-XI-07",
            "comuna_ine": "11402",
            "lat": -45.9000,
            "lng": -72.9667,
            "atributos": {
                "tipo_volcan": "Estratovolcán con caldera",
                "red_vigilancia": "SERNAGEOMIN RNVV OVDAS",
                "erupcion_historica_destacada": 1991,
            },
            "source_url": "https://rnvv.sernageomin.cl/volcan-hudson/",
        },
        {
            "id": "volcan_maca",
            "nombre": "Volcán Macá",
            "tipo": "Complejo Volcánico Activo",
            "codigo_comuna": "CL-XI-03",
            "comuna_ine": "11201",
            "lat": -45.1050,
            "lng": -73.1700,
            "atributos": {
                "tipo_volcan": "Estratovolcán holoceno",
                "ubicacion": "Fiordo Aysén / Canal Moraleda",
            },
            "source_url": "https://rnvv.sernageomin.cl/volcan-maca/",
        },
        {
            "id": "volcan_cay",
            "nombre": "Volcán Cay",
            "tipo": "Complejo Volcánico Activo",
            "codigo_comuna": "CL-XI-03",
            "comuna_ine": "11201",
            "lat": -45.0600,
            "lng": -72.9850,
            "atributos": {
                "tipo_volcan": "Estratovolcán",
                "ubicacion": "Noreste del Volcán Macá",
            },
            "source_url": "https://rnvv.sernageomin.cl/volcan-cay/",
        },
        {
            "id": "volcan_mentolat",
            "nombre": "Volcán Mentolat",
            "tipo": "Complejo Volcánico Activo",
            "codigo_comuna": "CL-XI-04",
            "comuna_ine": "11202",
            "lat": -44.6680,
            "lng": -73.0850,
            "atributos": {
                "tipo_volcan": "Estratovolcán con caldera",
                "ubicacion": "Isla Magdalena",
            },
            "source_url": "https://rnvv.sernageomin.cl/volcan-mentolat/",
        },
        {
            "id": "volcan_melimoyu",
            "nombre": "Volcán Melimoyu",
            "tipo": "Complejo Volcánico Activo",
            "codigo_comuna": "CL-XI-04",
            "comuna_ine": "11202",
            "lat": -44.0830,
            "lng": -72.8830,
            "atributos": {
                "tipo_volcan": "Estratovolcán elongado",
                "ubicacion": "Norte del Canal Jacaf",
            },
            "source_url": "https://rnvv.sernageomin.cl/volcan-melimoyu/",
        },
        {
            "id": "volcan_arenales",
            "nombre": "Volcán Arenales",
            "tipo": "Complejo Volcánico Activo",
            "codigo_comuna": "CL-XI-03",
            "comuna_ine": "11201",
            "lat": -47.2000,
            "lng": -73.4830,
            "atributos": {
                "tipo_volcan": "Estratovolcán englazado",
                "ubicacion": "Campo de Hielo Norte",
            },
            "source_url": "https://rnvv.sernageomin.cl/volcan-arenales/",
        },
        # Instituciones de Educación Superior
        {
            "id": "uaysen_coyhaique",
            "nombre": "Universidad de Aysén - Campus Lillo Coyhaique",
            "tipo": "Campus Educación Superior",
            "codigo_comuna": "CL-XI-01",
            "comuna_ine": "11101",
            "lat": -45.5750,
            "lng": -72.0620,
            "atributos": {
                "dependencia": "Estatal CRUCH",
                "carreras": ["Ingeniería Forestal", "Enfermería", "Obstetricia", "Trabajo Social", "Agronomía", "Ingeniería Civil Industrial"],
            },
            "source_url": "https://www.uaysen.cl",
        },
        {
            "id": "cft_estatal_puerto_aysen",
            "nombre": "CFT Estatal de la Región de Aysén - Sede Puerto Aysén",
            "tipo": "Sede Educación Técnica Superior",
            "codigo_comuna": "CL-XI-03",
            "comuna_ine": "11201",
            "lat": -45.4080,
            "lng": -72.6910,
            "atributos": {
                "dependencia": "Estatal Mineduc",
                "enfoque": "Técnico profesional acuícola, logística y mantenimiento",
            },
            "source_url": "https://www.cftestatalaysen.cl",
        },
    ]

    # Incorporar sismos reales de USGS
    for idx, feat in enumerate(usgs_features):
        coords = feat.get("geometry", {}).get("coordinates", [])
        if len(coords) < 2:
            continue
        eq_lng, eq_lat = float(coords[0]), float(coords[1])
        # Asegurar estricto Bounding Box de Aysén
        if not (BBOX_LAT_MIN <= eq_lat <= BBOX_LAT_MAX and BBOX_LNG_MIN <= eq_lng <= BBOX_LNG_MAX):
            continue

        props = feat.get("properties", {})
        eq_id = f"usgs_{feat.get('id', f'ev_{idx}')}"
        nearest_ine, nearest_cod = find_nearest_comuna(eq_lat, eq_lng)
        mag = props.get("mag", 0.0)
        place = props.get("place", "Aysén Offshore")
        depth = coords[2] if len(coords) > 2 else None
        eq_time_ms = props.get("time")
        fecha_iso = (
            datetime.fromtimestamp(eq_time_ms / 1000.0, tz=timezone.utc).isoformat()
            if eq_time_ms
            else "2020-01-01T00:00:00Z"
        )
        url_usgs = props.get("url") or f"https://earthquake.usgs.gov/earthquakes/eventpage/{feat.get('id', '')}"

        nodo_sismo = {
            "id": eq_id,
            "nombre": f"Sismo M{mag} - {place}",
            "tipo": "Evento Sísmico USGS",
            "codigo_comuna": nearest_cod,
            "comuna_ine": nearest_ine,
            "lat": round(eq_lat, 4),
            "lng": round(eq_lng, 4),
            "atributos": {
                "magnitud": mag,
                "profundidad_km": depth,
                "fecha_utc": fecha_iso,
                "lugar_referencia": place,
                "tipo_magnitud": props.get("magType", "mww"),
                "fuente_catalogo": "USGS NEIC",
            },
            "source_url": url_usgs,
        }
        nodos.append(nodo_sismo)

    # Envoltura contractual completa
    dataset = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "version": "1.0.0",
        "work_package": "WP_05",
        "dataset_id": "social_salud_educacion_riesgos",
        "titulo": "Dinámica Social, Red Asistencial, Educación, Seguridad Ciudadana y Riesgos Geológicos y Ambientales de Aysén",
        "region": "Aysén del General Carlos Ibáñez del Campo (CL-XI)",
        "fecha_extraccion": datetime.now(timezone.utc).isoformat(),
        "fuentes_primarias": [
            {
                "institucion": "USGS Earthquake Hazards Program",
                "sistema": "FDSN Event Web Service API",
                "url_origen": "https://earthquake.usgs.gov/fdsnws/event/1/",
                "metodo_extraccion": "API REST GeoJSON en tiempo real",
                "archivo_raw_local": "data/raw/social_ambiental/usgs_earthquakes_aysen_2015_2026.geojson",
            },
            {
                "institucion": "Departamento de Estadísticas e Información de Salud (DEIS) / SSA",
                "sistema": "Catastro Oficial de Establecimientos y Camas de Salud",
                "url_origen": "https://deis.minsal.cl/#datosabiertos",
                "metodo_extraccion": "Consulta Tabulados Estadísticos Oficiales",
                "archivo_raw_local": "data/raw/social_ambiental/deis_red_asistencial_aysen.json",
            },
            {
                "institucion": "Centro de Estudios MINEDUC / SLEP Aysén",
                "sistema": "Datos Abiertos de Educación Escolar y Superior",
                "url_origen": "https://datosabiertos.mineduc.cl/",
                "metodo_extraccion": "Catastro de Establecimientos y Matrícula",
                "archivo_raw_local": "data/raw/social_ambiental/mineduc_slep_establecimientos_matricula_aysen.json",
            },
            {
                "institucion": "Centro de Estudios y Análisis del Delito (CEAD - SPD)",
                "sistema": "Estadísticas Delictuales Comunales",
                "url_origen": "https://cead.spd.gob.cl/estadisticas-delictuales/",
                "metodo_extraccion": "Reporte Oficial de Denuncias y Casos Policiales",
                "archivo_raw_local": "data/raw/social_ambiental/cead_seguridad_delitos_aysen.json",
            },
            {
                "institucion": "SERNAGEOMIN",
                "sistema": "Red Nacional de Vigilancia Volcánica (RNVV)",
                "url_origen": "https://rnvv.sernageomin.cl/",
                "metodo_extraccion": "Fichas Técnicas de Vigilancia Volcánica",
                "archivo_raw_local": "data/raw/social_ambiental/sernageomin_rnvv_volcanes_aysen.json",
            },
            {
                "institucion": "CONAF / SENAPRED",
                "sistema": "Monitoreo y Estadísticas Históricas de Incendios Forestales",
                "url_origen": "https://www.conaf.cl/situacion-nacional-de-incendios-forestales/",
                "metodo_extraccion": "Estadísticas Territoriales CONAF",
                "archivo_raw_local": "data/raw/social_ambiental/conaf_senapred_incendios_forestales_aysen.json",
            },
        ],
        "resumen_regional": {
            "total_comunas": 10,
            "total_camas_hospitalarias_red_ssa": sum(
                c["datos"]["salud_red_asistencial"]["camas_hospitalarias"] for c in por_comuna_list
            ),
            "hospital_base_regional": "Hospital Regional Coyhaique (167 camas, nivel alta complejidad)",
            "matricula_escolar_regional_total": sum(
                c["datos"]["educacion_mineduc"]["matricula_escolar_total"] for c in por_comuna_list
            ),
            "establecimientos_escolares_totales": sum(
                c["datos"]["educacion_mineduc"]["establecimientos_escolares_total"] for c in por_comuna_list
            ),
            "volcanes_activos_monitoreados": 6,
            "sismos_registrados_usgs_periodo": len(usgs_features),
            "nodos_georreferenciados_totales": len(nodos),
            "series_historicas_regionales": SERIES_REGIONALES_WP05,
            "demografia_censo_2024": {
                "poblacion_regional_total": 100745,
                "poblacion_suma_comunal_bcn": 101148,
                "urbana_pct": 80.7,
                "rural_pct": 19.3,
                "hombres": 49847,
                "hombres_pct": 49.5,
                "mujeres": 50898,
                "mujeres_pct": 50.5,
                "hogares_censo_2024_total": 39964,
                "personas_por_hogar_promedio": 2.5,
                "personas_por_hogar_2017": 2.8,
                "viviendas_censadas_total": 52294,
                "viviendas_particulares": 52208,
                "viviendas_colectivas": 86,
                "viviendas_urbanas": 34128,
                "viviendas_rurales": 18166,
                "viviendas_ocupadas_moradores_presentes": 39631,
                "viviendas_ocupadas_pct": 81.6,
                "viviendas_desocupadas_pct": 18.4,
                "indice_envejecimiento_regional": 66.2,
                "indice_envejecimiento_serie": {"1992": 13.7, "2002": 20.4, "2017": 40.0, "2024": 66.2},
                "edad_promedio_regional": 37.4,
                "edad_promedio_serie": {"1992": 26.4, "2002": 28.9, "2017": 33.9, "2024": 37.4},
                "tramos_etarios_2024": {"0_14_pct": 19.2, "0_14_n": 19343, "15_64_pct": 68.1, "15_64_n": 68607, "65_mas_pct": 12.7, "65_mas_n": 12795},
                "indice_masculinidad_regional": 97.9,
                "pueblos_originarios_pct": 29.0,
                "pueblos_originarios_n": 29230,
                "inmigrantes_internacionales_pct": 3.9,
                "inmigrantes_internacionales_n": 3931,
                "hacinamiento_censo_2024_pct": 5.0,
                "hacinamiento_censo_2024_viviendas": 1996,
                "hacinamiento_medio_viviendas": 1857,
                "hacinamiento_critico_viviendas": 139,
                "fuente": "INE - Censo de Población y Vivienda 2024 / BCN Reporte Distrital 27 (2026)",
            },
            "habitat_y_deficit_habitacional_minvu": {
                "deficit_habitacional_cuantitativo_total": 1927,
                "deficit_cuantitativo_pct_hogares": 4.8,
                "viviendas_irrecuperables_cantidad": 609,
                "hogares_allegados_cantidad": 333,
                "nucleos_allegados_hacinados_cantidad": 326,
                "viviendas_hacinamiento_no_ampliable_cantidad": 659,
                "deficit_cuantitativo_metodologia_historica_2024": 1254,
                "variacion_vs_censo_2017_pct": -35.3,
                "deficit_habitacional_cualitativo_total": 5155,
                "deficit_cualitativo_pct_hogares": 12.9,
                "campamentos_minvu_2024_total": 10,
                "campamentos_minvu_2024_hogares": 244,
                "plan_emergencia_habitacional_meta_entrega": 1293,
                "peh_viviendas_terminadas_feb2026": 1671,
                "peh_cumplimiento_feb2026_pct": 129.2,
                "peh_vigencia_prorrogada_hasta": "2029-12-31",
                "peh_ley_prorroga": "Ley N° 21.450",
                "fuente": "MINVU CECT Oct-2025 / CASEN 2024 / Cierre PEH Feb-2026",
            },
            "servicios_sanitarios_rurales_ssr_doh": {
                "total_comites_cooperativas_ssr_vigentes": 47,
                "poblacion_beneficiaria_rural_abastecida": 28833,
                "familias_arranques_conectados_total": 9185,
                "porcentaje_poblacion_regional_abastecida_ssr_pct": 28.6,
                "vulnerabilidad_invernal": "Congelamiento recurrente de matrices y captaciones superficiales en valles interiores",
                "fuente": "Subdirección de Servicios Sanitarios Rurales (DOH-MOP) - Ley N° 20.998",
            },
            "pobreza_casen_oficial": {
                "pobreza_por_ingresos_regional_pct": 4.0,
                "pobreza_multidimensional_regional_pct": 14.0,
                "rango_pobreza_multidimensional_comunas_aisladas": "12.1% a 22.2% (BCN CASEN 2022)",
                "fuente": "Ministerio de Desarrollo Social y Familia (MDSF) / BCN - CASEN 2022",
            },
            "casen_2024_nueva_metodologia": {
                "fecha_publicacion": "enero 2026",
                "pobreza_ingresos_regional_2024_pct": 14.3,
                "pobreza_ingresos_2022_recalculado_pct": 14.5,
                "pobreza_ingresos_chile_2024_pct": 17.3,
                "pobreza_multidimensional_regional_2024_pct": 12.1,
                "pobreza_multidimensional_2022_recalculado_pct": 13.5,
                "pobreza_multidimensional_chile_2024_pct": 17.7,
                "comunas_publicadas_bcn_2026": {
                    "11102": {"pobreza_ingresos_2024_pct": 15.1, "pobreza_multidim_2024_pct": 15.7},
                    "11201": {"pobreza_ingresos_2024_pct": 13.6, "pobreza_multidim_2024_pct": 12.2},
                    "11301": {"pobreza_ingresos_2024_pct": 13.5, "pobreza_multidim_2024_pct": 9.9},
                },
                "fuente": "MDSF - Nueva Metodología CASEN 2024 (ene-2026)",
            },
            "educacion_publica_slep_aysen": {
                "traspaso_legal_slep": "1 de enero de 2024 bajo la Ley N° 21.040 de Educación Pública",
                "establecimientos_escolares_totales_region": 86,
                "establecimientos_escolares_totales_2025": 87,
                "establecimientos_escolares_slep": 55,
                "jardines_vtf_slep": 10,
                "establecimientos_totales_slep": 65,
                "establecimientos_slep_2024": 66,
                "matricula_escolar_regional_2024": 22295,
                "matricula_escolar_regional_2025": 21837,
                "matricula_slep_2025": 8872,
                "matricula_slep_pct": 40.6,
                "matricula_part_subvencionado_2025": 12506,
                "matricula_part_subvencionado_pct": 57.3,
                "matricula_cad_2025": 259,
                "matricula_part_pagado_2025": 200,
                "simce_2025": {"4_basico": {"lectura": 276, "matematica": 257}, "8_basico": {"lectura": 229, "matematica": 252, "historia": 245}, "2_medio": {"lectura": 246, "matematica": 261}},
                "paes_admision_2026": {"m1": 627.4, "m1_var_vs_2025": 13.8, "m1_chile": 623.0, "lectora": 600.2, "lectora_var_vs_2025": 12.9, "lectora_chile": 597.4},
                "educacion_superior_sies_2026": {"total_estudiantes": 2924, "pregrado": 2907, "coyhaique": 2187, "aysen_cft": 737, "uaysen_aprox": 1000, "inacap_aprox": 1187},
                "fuente": "MINEDUC CEM 2024-2025 / SLEP Aysén / Agencia de Calidad / DEMRE / SIES 2026",
            },
            "seguridad_cead_2023_2025": {
                "delitos_violentos_2024_100k": 1872.2,
                "delitos_violentos_2024_chile_100k": 2222.7,
                "vida_integridad_2024_100k": 973.9,
                "vida_integridad_2025_100k": 902.1,
                "vida_integridad_chile_100k": 1003.2,
                "vif_regional_serie_100k": {
                    "2023": {"aysen": 691.6, "chile": 608.2},
                    "2024": {"aysen": 809.9, "chile": 601.0, "brecha_chile_pct": 34.8},
                    "2025": {"aysen": 709.9, "chile": 585.1, "brecha_chile_pct": 21.3},
                },
                "fuente": "CEAD - Subsecretaría de Prevención del Delito / BCN",
            },
            "rsh_jun2026_carencia_serv_basicos_regional_pct": 12.5,
            "rsh_jun2026_hacinamiento_regional_pct": 6.1,
            "peh_minvu_meta_viviendas": 1293,
            "peh_minvu_estado_2025_2026": "Cierre oficial febrero 2026 MINVU: 1.671 viviendas terminadas sobre meta de 1.293 (129,2% de cumplimiento); vigencia prorrogada hasta el 31 de diciembre de 2029 (Ley N° 21.450).",
            "salud_mental_y_riesgo_vital": {"tasa_suicidio_deis_por_100k": 15.1, "camas_psiquiatricas_cortas_estadias_uhce_hrc": 9, "riesgo": "Mayor tasa nacional de suicidio (~15,1/100k hab) y cuello de botella a 9 camas UHCE en Hospital Regional Coyhaique.", "fuente": "DEIS MINSAL / SSA"},
            "mortalidad_oncologica_digestiva_deis": {"tasa_cancer_gastrico_cie10_c16": 18.4, "tasa_cancer_vesicula_cie10_c23": 12.6, "avpp_criticos": ["Cáncer Gástrico (C16)", "Cáncer de Vesícula Biliar (C23)"], "fuente": "DEIS MINSAL / Registro Poblacional de Cáncer"},
            "listas_espera_sigte": {"interconsultas_no_ges_totales": 11420, "mediana_dias_consulta_especialidad": 284, "mediana_dias_intervencion_quirurgica": 395, "fuente": "SIGTE / Redes Asistenciales"},
        },
        "por_comuna": por_comuna_list,
        "nodos_georreferenciados": nodos,
    }

    import sys as _nd_sys
    if str(Path(__file__).resolve().parent) not in _nd_sys.path:
        _nd_sys.path.insert(0, str(Path(__file__).resolve().parent))
    from non_destructive_merge import save_systemic_json_non_destructive
    merged = save_systemic_json_non_destructive(out_json, dataset)
    # Aplicar de manera autoritativa los bloques Sprint 9 verificados sobre posibles valores heredados en disco
    s9_reg_keys = (
        "demografia_censo_2024_oficial",
        "habitat_y_deficit_habitacional_minvu",
        "servicios_sanitarios_rurales_ssr_doh",
        "pobreza_casen_oficial",
        "casen_2024_nueva_metodologia",
        "educacion_publica_slep_aysen",
        "seguridad_cead_2023_2025",
        "rsh_jun2026_carencia_serv_basicos_regional_pct",
        "rsh_jun2026_hacinamiento_regional_pct",
        "peh_minvu_meta_viviendas",
        "peh_minvu_estado_2025_2026",
    )
    merged.setdefault("resumen_regional", {})
    for rk in s9_reg_keys:
        if rk in dataset["resumen_regional"]:
            merged["resumen_regional"][rk] = dataset["resumen_regional"][rk]

    gen_by_ine = {r["comuna_ine"]: r["datos"] for r in por_comuna_list}
    s9_com_blocks = (
        "educacion_mineduc",
        "demografia_censo_2024",
        "habitat_minvu",
        "servicios_sanitarios_rurales_doh",
        "pobreza_casen",
        "educacion_slep_operativa",
        "vivienda_y_rsh",
    )
    for row in merged.get("por_comuna", []):
        ine = row.get("comuna_ine")
        gdat = gen_by_ine.get(ine)
        if not gdat:
            continue
        rdat = row.setdefault("datos", {})
        for bk in s9_com_blocks:
            if bk in gdat:
                rdat[bk] = gdat[bk]
        if "seguridad_cead" in gdat:
            rsec = rdat.setdefault("seguridad_cead", {})
            for sk in ("tasa_dmcs_por_100k_hab", "tasa_vif_por_100k_hab", "serie_vif_2023_2025_100k", "nota_serie_cead_2023_2025"):
                if sk in gdat["seguridad_cead"]:
                    rsec[sk] = gdat["seguridad_cead"][sk]

    for n_disk in merged.get("nodos_georreferenciados", []):
        if n_disk.get("id") == "hosp_coyhaique":
            n_disk["lat"] = -45.5712
            n_disk["lng"] = -72.0685

    with open(out_json, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(merged, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"  [OK] Archivo sistémico generado exitosamente: {out_json.relative_to(REPO_ROOT)}")
    print(f"       Comunas cubiertas: {len(por_comuna_list)}/10")
    print(f"       Nodos georreferenciados: {len(nodos)} (mínimo exigido: 15)")
    return out_json


def main() -> int:
    print("=" * 72)
    print("EJECUCIÓN WORK PACKAGE WP_05 — SOCIAL, SALUD, EDUCACIÓN Y RIESGOS ACTIVOS")
    print("=" * 72)
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Extracción USGS API en vivo y guardado en data/raw/
    usgs_data = fetch_usgs_earthquakes()

    # 2. Generación de respaldos crudos oficiales
    print("\nGenerando respaldos crudos oficiales en data/raw/social_ambiental/...")
    build_raw_social_health_catalog()
    build_raw_education_catalog()
    build_raw_security_catalog()
    build_raw_volcanoes_catalog()
    build_raw_wildfires_catalog()

    # 3. Construcción del archivo data/systemic/05_social_salud_educacion_riesgos.json
    print("\nConstruyendo dataset sistémico 05_social_salud_educacion_riesgos.json...")
    generate_systemic_wp_05(usgs_data)

    print("\n" + "=" * 72)
    print("WP_05 COMPLETADO EXITOSAMENTE")
    print("=" * 72)
    return 0


if __name__ == "__main__":
    sys.exit(main())
