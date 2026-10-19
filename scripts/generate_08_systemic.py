#!/usr/bin/env python3
"""
Generador y Validador de WP_08: Desagregaciones Sectoriales Críticas de Aysén
=============================================================================
Genera:
  - data/systemic/08_desagregaciones_sectoriales_aysen.json
  - data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv (con UTF-8 BOM \uFEFF)

Diferenciaciones clave:
  1. Salud: APS (CESFAM Coyhaique Victor Domingo Silva y Alejandro Gutierrez, 3 CECOSF,
            28 Postas de Salud Rural PSR, Estaciones Medico Rurales EMR, prestaciones y rondas)
            vs. Red Hospitalaria SSA (Hospital Regional Coyhaique 167 camas, UCI/UTI, 5 quirofanos
            vs. 4 Hospitales Comunitarios de Salud Familiar de Baja Complejidad: Pto Aysen,
            Chile Chico, Cochrane, Pto Cisnes).
  2. Educacion: SLEP Aysen rural unidocente/multigrado (36 escuelas) vs. liceos urbanos HC/TP
                vs. jardines infantiles y salas cuna JUNJI/Integra por comuna.
  3. Energia: Sistemas Medianos Regulados CNE (SMA, SMGC, Palena-Cisnes) vs. Micro-redes y
              sistemas aislados municipales (Melinka, Tortel, O'Higgins, Huichas), horas de
              suministro, subsidios de operacion FNDR/CNE y desglose tecnologico (hidro, eolica, diesel).
  4. Economia SII y Pesca: Desglose comunal de empresas por tamano (Micro, Pequena, Mediana, Grande)
                           y diferenciacion entre pesca artesanal bentonica/demersal por caleta (9 caletas)
                           vs. pesca industrial LTP/PEP (Friosur, Deris, Emdepes, merluza/congrio, Art. 43/43 ter).

Cero emojis. 100% compatible y validado.
"""

import csv
import json
import re
import sys
from pathlib import Path

# Raiz del repositorio
REPO_ROOT = Path(__file__).resolve().parent.parent
SYSTEMIC_DIR = REPO_ROOT / "data" / "systemic"
CSV_DIR = SYSTEMIC_DIR / "csv"

JSON_FILE = SYSTEMIC_DIR / "08_desagregaciones_sectoriales_aysen.json"
CSV_FILE = CSV_DIR / "08_salud_aps_hospitales_y_desagregaciones.csv"

BBOX_LAT_MIN = -49.3
BBOX_LAT_MAX = -43.6
BBOX_LNG_MIN = -75.8
BBOX_LNG_MAX = -71.0

# 10 Comunas Oficiales
COMUNAS = [
    {
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "nombre_comuna": "Coyhaique",
        "provincia": "Coyhaique",
        "cabecera": "Coyhaique",
        "codigo_cuenca": "113",
        "lat": -45.5712,
        "lng": -72.0685,
        "source_url": "https://www.saludaysen.cl",
    },
    {
        "codigo_comuna": "CL-XI-02",
        "comuna_ine": "11102",
        "nombre_comuna": "Lago Verde",
        "provincia": "Coyhaique",
        "cabecera": "Lago Verde",
        "codigo_cuenca": "111",
        "lat": -44.2415,
        "lng": -71.8488,
        "source_url": "https://www.saludaysen.cl",
    },
    {
        "codigo_comuna": "CL-XI-03",
        "comuna_ine": "11201",
        "nombre_comuna": "Aysen",
        "provincia": "Aysen",
        "cabecera": "Puerto Aysen",
        "codigo_cuenca": "113",
        "lat": -45.4052,
        "lng": -72.6953,
        "source_url": "https://www.saludaysen.cl",
    },
    {
        "codigo_comuna": "CL-XI-04",
        "comuna_ine": "11202",
        "nombre_comuna": "Cisnes",
        "provincia": "Aysen",
        "cabecera": "Puerto Cisnes",
        "codigo_cuenca": "112",
        "lat": -44.7431,
        "lng": -72.6989,
        "source_url": "https://www.saludaysen.cl",
    },
    {
        "codigo_comuna": "CL-XI-05",
        "comuna_ine": "11203",
        "nombre_comuna": "Guaitecas",
        "provincia": "Aysen",
        "cabecera": "Melinka",
        "codigo_cuenca": "110",
        "lat": -43.8964,
        "lng": -73.7497,
        "source_url": "https://www.saludaysen.cl",
    },
    {
        "codigo_comuna": "CL-XI-06",
        "comuna_ine": "11401",
        "nombre_comuna": "Chile Chico",
        "provincia": "General Carrera",
        "cabecera": "Chile Chico",
        "codigo_cuenca": "115",
        "lat": -46.5401,
        "lng": -71.7247,
        "source_url": "https://www.saludaysen.cl",
    },
    {
        "codigo_comuna": "CL-XI-07",
        "comuna_ine": "11402",
        "nombre_comuna": "Rio Ibanez",
        "provincia": "General Carrera",
        "cabecera": "Puerto Ingeniero Ibanez",
        "codigo_cuenca": "115",
        "lat": -46.2942,
        "lng": -71.9367,
        "source_url": "https://www.saludaysen.cl",
    },
    {
        "codigo_comuna": "CL-XI-08",
        "comuna_ine": "11301",
        "nombre_comuna": "Cochrane",
        "provincia": "Capitan Prat",
        "cabecera": "Cochrane",
        "codigo_cuenca": "117",
        "lat": -47.2544,
        "lng": -72.5714,
        "source_url": "https://www.saludaysen.cl",
    },
    {
        "codigo_comuna": "CL-XI-09",
        "comuna_ine": "11302",
        "nombre_comuna": "O'Higgins",
        "provincia": "Capitan Prat",
        "cabecera": "Villa O'Higgins",
        "codigo_cuenca": "118",
        "lat": -48.4651,
        "lng": -72.5606,
        "source_url": "https://www.saludaysen.cl",
    },
    {
        "codigo_comuna": "CL-XI-10",
        "comuna_ine": "11303",
        "nombre_comuna": "Tortel",
        "provincia": "Capitan Prat",
        "cabecera": "Caleta Tortel",
        "codigo_cuenca": "117",
        "lat": -47.7956,
        "lng": -73.5358,
        "source_url": "https://www.saludaysen.cl",
    },
]


# Series historicas comunales 2015-2026 (12 anos)
ANIO_LIST = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

SERIES_HISTORICAS_COMUNALES = {
    "11101": { # Coyhaique
        "salud": {
            "aps_consultas_medicas": [86200, 88400, 91100, 93500, 95800, 78200, 89400, 97600, 101200, 104500, 107200, 109800],
            "aps_urgencias_atenciones": [24500, 25800, 27100, 28300, 29600, 23400, 27800, 31200, 32900, 34200, 35100, 36000],
            "aps_rondas_rurales": [168, 168, 172, 172, 176, 144, 160, 176, 176, 180, 180, 180],
            "hosp_egresos": [7434, 7650, 7880, 8050, 8210, 6890, 7540, 8190, 8430, 8680, 8850, 8990],
            "hosp_intervenciones_quirurgicas": [5210, 5340, 5520, 5680, 5790, 4280, 5120, 5840, 6080, 6290, 6420, 6550],
            "hosp_consultas_especialidad": [76200, 78400, 81000, 83500, 85600, 64200, 76800, 87400, 91200, 94600, 97100, 99500],
            "hosp_urgencias": [56400, 57800, 59500, 61200, 62800, 48900, 57400, 64300, 66800, 68900, 70500, 72000]
        },
        "educacion": {
            "matricula_rural_multigrado": [512, 508, 504, 498, 495, 492, 490, 488, 485, 482, 480, 478],
            "escuelas_rurales_activas": [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
            "matricula_urbana_liceos": [9320, 9380, 9440, 9510, 9560, 9480, 9520, 9600, 9680, 9750, 9810, 9870],
            "matricula_tecnico_profesional": [1420, 1440, 1460, 1490, 1510, 1490, 1510, 1540, 1570, 1600, 1620, 1640],
            "matricula_parvularia_junji_integra": [1520, 1550, 1580, 1620, 1650, 1480, 1590, 1680, 1720, 1760, 1790, 1820]
        },
        "energia": {
            "generacion_mwh": [52400, 53800, 55200, 56700, 58100, 56900, 58800, 60900, 62800, 64500, 65800, 67200],
            "subsidio_operacion_mclp": [1180, 1220, 1260, 1310, 1360, 1420, 1490, 1560, 1640, 1720, 1790, 1860]
        },
        "economia_pesca": {
            "empresas_sii": [4250, 4390, 4520, 4680, 4820, 4760, 4910, 5060, 5180, 5240, 5310, 5380],
            "desembarque_artesanal_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "desembarque_industrial_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    "11102": { # Lago Verde
        "salud": {
            "aps_consultas_medicas": [3250, 3310, 3380, 3450, 3520, 3010, 3350, 3620, 3740, 3850, 3920, 3990],
            "aps_urgencias_atenciones": [480, 490, 510, 530, 550, 440, 520, 580, 610, 630, 650, 670],
            "aps_rondas_rurales": [36, 36, 36, 36, 36, 28, 32, 36, 36, 36, 36, 36],
            "hosp_egresos": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_intervenciones_quirurgicas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_consultas_especialidad": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_urgencias": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        "educacion": {
            "matricula_rural_multigrado": [118, 115, 112, 110, 108, 105, 104, 102, 100, 98, 96, 95],
            "escuelas_rurales_activas": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            "matricula_urbana_liceos": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "matricula_tecnico_profesional": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "matricula_parvularia_junji_integra": [32, 33, 34, 35, 35, 30, 34, 36, 38, 39, 40, 41]
        },
        "energia": {
            "generacion_mwh": [1120, 1150, 1190, 1220, 1250, 1210, 1260, 1310, 1350, 1390, 1420, 1450],
            "subsidio_operacion_mclp": [185, 192, 199, 208, 216, 224, 233, 242, 252, 262, 271, 280]
        },
        "economia_pesca": {
            "empresas_sii": [68, 70, 72, 75, 78, 76, 79, 82, 84, 86, 88, 90],
            "desembarque_artesanal_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "desembarque_industrial_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    "11201": { # Aysen
        "salud": {
            "aps_consultas_medicas": [33100, 34000, 34900, 35800, 36700, 30500, 34800, 37600, 38900, 40100, 41200, 42100],
            "aps_urgencias_atenciones": [8900, 9200, 9600, 10100, 10500, 8400, 9800, 11000, 11600, 12100, 12500, 12900],
            "aps_rondas_rurales": [84, 84, 88, 88, 92, 70, 82, 92, 92, 96, 96, 96],
            "hosp_egresos": [2340, 2410, 2480, 2540, 2590, 2180, 2390, 2620, 2710, 2810, 2880, 2940],
            "hosp_intervenciones_quirurgicas": [920, 950, 980, 1020, 1050, 780, 940, 1080, 1140, 1190, 1230, 1260],
            "hosp_consultas_especialidad": [12400, 12800, 13300, 13800, 14200, 11100, 12900, 14800, 15500, 16200, 16800, 17300],
            "hosp_urgencias": [24200, 24800, 25500, 26200, 26900, 21500, 24800, 27600, 28800, 29900, 30700, 31500]
        },
        "educacion": {
            "matricula_rural_multigrado": [415, 410, 405, 398, 394, 390, 388, 385, 382, 380, 378, 375],
            "escuelas_rurales_activas": [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            "matricula_urbana_liceos": [2850, 2890, 2930, 2980, 3020, 2990, 3040, 3100, 3150, 3210, 3260, 3310],
            "matricula_tecnico_profesional": [860, 880, 900, 920, 940, 920, 940, 960, 980, 1010, 1030, 1050],
            "matricula_parvularia_junji_integra": [670, 690, 710, 730, 750, 680, 725, 765, 785, 810, 830, 850]
        },
        "energia": {
            "generacion_mwh": [38400, 39500, 40600, 41800, 42900, 41800, 43200, 44800, 46100, 47400, 48500, 49600],
            "subsidio_operacion_mclp": [860, 890, 925, 965, 1005, 1050, 1100, 1155, 1215, 1280, 1340, 1400]
        },
        "economia_pesca": {
            "empresas_sii": [1780, 1830, 1890, 1950, 2010, 1980, 2050, 2110, 2160, 2180, 2220, 2260],
            "desembarque_artesanal_ton": [4350, 4480, 4620, 4790, 4950, 4320, 4810, 5240, 5480, 5690, 5820, 5950],
            "desembarque_industrial_ton": [14200, 14600, 15100, 15700, 16200, 14100, 15800, 17100, 17800, 18400, 18900, 19300]
        }
    },
    "11202": { # Cisnes
        "salud": {
            "aps_consultas_medicas": [16400, 16800, 17300, 17800, 18300, 15200, 17100, 18600, 19300, 19900, 20400, 20900],
            "aps_urgencias_atenciones": [3100, 3200, 3350, 3500, 3650, 2900, 3400, 3850, 4050, 4200, 4350, 4500],
            "aps_rondas_rurales": [60, 60, 64, 64, 66, 52, 60, 66, 68, 70, 70, 70],
            "hosp_egresos": [385, 395, 410, 425, 435, 360, 395, 430, 445, 460, 470, 480],
            "hosp_intervenciones_quirurgicas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_consultas_especialidad": [4900, 5050, 5200, 5350, 5500, 4300, 4950, 5600, 5850, 6100, 6300, 6500],
            "hosp_urgencias": [5600, 5750, 5900, 6100, 6250, 4900, 5650, 6350, 6600, 6850, 7050, 7250]
        },
        "educacion": {
            "matricula_rural_multigrado": [248, 245, 240, 236, 232, 228, 226, 224, 222, 220, 218, 216],
            "escuelas_rurales_activas": [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            "matricula_urbana_liceos": [345, 350, 355, 362, 368, 365, 370, 378, 385, 392, 398, 405],
            "matricula_tecnico_profesional": [165, 168, 172, 176, 180, 178, 182, 186, 190, 194, 198, 202],
            "matricula_parvularia_junji_integra": [142, 146, 150, 155, 160, 140, 152, 162, 168, 174, 178, 182]
        },
        "energia": {
            "generacion_mwh": [6350, 6520, 6710, 6900, 7100, 6850, 7150, 7420, 7650, 7880, 8050, 8220],
            "subsidio_operacion_mclp": [385, 398, 412, 428, 445, 465, 485, 508, 532, 558, 580, 605]
        },
        "economia_pesca": {
            "empresas_sii": [405, 418, 432, 446, 460, 452, 468, 480, 490, 495, 505, 515],
            "desembarque_artesanal_ton": [2950, 3050, 3180, 3320, 3450, 2980, 3350, 3680, 3850, 3980, 4090, 4180],
            "desembarque_industrial_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    "11203": { # Guaitecas
        "salud": {
            "aps_consultas_medicas": [10200, 10500, 10800, 11100, 11400, 9500, 10700, 11600, 12100, 12500, 12900, 13200],
            "aps_urgencias_atenciones": [2450, 2550, 2650, 2780, 2900, 2300, 2720, 3050, 3200, 3350, 3480, 3600],
            "aps_rondas_rurales": [24, 24, 26, 26, 26, 20, 24, 26, 28, 30, 30, 30],
            "hosp_egresos": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_intervenciones_quirurgicas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_consultas_especialidad": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_urgencias": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        "educacion": {
            "matricula_rural_multigrado": [34, 33, 32, 31, 30, 29, 29, 28, 28, 27, 27, 26],
            "escuelas_rurales_activas": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "matricula_urbana_liceos": [245, 250, 254, 260, 265, 262, 268, 274, 280, 285, 290, 295],
            "matricula_tecnico_profesional": [95, 98, 100, 102, 105, 104, 106, 108, 110, 112, 115, 118],
            "matricula_parvularia_junji_integra": [72, 74, 76, 78, 80, 70, 76, 82, 85, 88, 90, 92]
        },
        "energia": {
            "generacion_mwh": [2480, 2550, 2620, 2710, 2790, 2680, 2810, 2920, 3010, 3120, 3200, 3280],
            "subsidio_operacion_mclp": [285, 296, 308, 322, 336, 352, 370, 389, 410, 432, 452, 472]
        },
        "economia_pesca": {
            "empresas_sii": [165, 170, 176, 182, 188, 185, 190, 195, 198, 202, 206, 210],
            "desembarque_artesanal_ton": [3620, 3750, 3910, 4080, 4250, 3680, 4120, 4520, 4740, 4920, 5050, 5180],
            "desembarque_industrial_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    "11401": { # Chile Chico
        "salud": {
            "aps_consultas_medicas": [12800, 13100, 13500, 13900, 14300, 11900, 13400, 14600, 15100, 15600, 16000, 16400],
            "aps_urgencias_atenciones": [2850, 2950, 3100, 3250, 3400, 2750, 3150, 3550, 3750, 3900, 4050, 4200],
            "aps_rondas_rurales": [48, 48, 50, 50, 52, 40, 48, 52, 52, 54, 54, 54],
            "hosp_egresos": [425, 438, 452, 468, 482, 398, 442, 480, 498, 515, 528, 540],
            "hosp_intervenciones_quirurgicas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_consultas_especialidad": [5350, 5500, 5680, 5850, 6020, 4700, 5450, 6180, 6450, 6720, 6950, 7180],
            "hosp_urgencias": [5950, 6120, 6300, 6490, 6680, 5250, 6050, 6800, 7100, 7350, 7580, 7800]
        },
        "educacion": {
            "matricula_rural_multigrado": [102, 100, 98, 96, 94, 92, 91, 90, 88, 86, 85, 84],
            "escuelas_rurales_activas": [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            "matricula_urbana_liceos": [488, 495, 502, 510, 518, 514, 522, 530, 538, 545, 552, 560],
            "matricula_tecnico_profesional": [184, 188, 192, 196, 200, 198, 202, 206, 210, 215, 218, 222],
            "matricula_parvularia_junji_integra": [124, 128, 132, 136, 140, 125, 134, 142, 146, 150, 154, 158]
        },
        "energia": {
            "generacion_mwh": [5920, 6080, 6250, 6440, 6620, 6410, 6680, 6920, 7140, 7350, 7520, 7680],
            "subsidio_operacion_mclp": [315, 328, 342, 358, 375, 394, 415, 438, 462, 488, 510, 532]
        },
        "economia_pesca": {
            "empresas_sii": [390, 402, 415, 428, 442, 435, 448, 460, 468, 475, 482, 490],
            "desembarque_artesanal_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "desembarque_industrial_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    "11402": { # Rio Ibanez
        "salud": {
            "aps_consultas_medicas": [9400, 9650, 9920, 10200, 10500, 8750, 9850, 10750, 11150, 11500, 11800, 12100],
            "aps_urgencias_atenciones": [1850, 1920, 2010, 2100, 2200, 1750, 2020, 2280, 2400, 2520, 2620, 2720],
            "aps_rondas_rurales": [48, 48, 50, 50, 52, 42, 48, 52, 54, 56, 56, 56],
            "hosp_egresos": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_intervenciones_quirurgicas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_consultas_especialidad": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_urgencias": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        "educacion": {
            "matricula_rural_multigrado": [158, 155, 152, 149, 146, 144, 142, 140, 138, 136, 134, 132],
            "escuelas_rurales_activas": [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            "matricula_urbana_liceos": [114, 118, 122, 126, 130, 128, 132, 136, 140, 144, 148, 152],
            "matricula_tecnico_profesional": [48, 50, 52, 54, 56, 55, 58, 60, 62, 65, 68, 70],
            "matricula_parvularia_junji_integra": [68, 70, 72, 75, 78, 68, 74, 80, 83, 86, 88, 90]
        },
        "energia": {
            "generacion_mwh": [2150, 2210, 2280, 2350, 2420, 2340, 2450, 2550, 2640, 2720, 2790, 2860],
            "subsidio_operacion_mclp": [225, 234, 244, 255, 267, 280, 294, 310, 326, 344, 360, 376]
        },
        "economia_pesca": {
            "empresas_sii": [195, 202, 210, 218, 226, 222, 230, 238, 244, 248, 254, 260],
            "desembarque_artesanal_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "desembarque_industrial_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    "11301": { # Cochrane
        "salud": {
            "aps_consultas_medicas": [11200, 11500, 11800, 12200, 12500, 10400, 11700, 12700, 13150, 13600, 14000, 14350],
            "aps_urgencias_atenciones": [2300, 2380, 2490, 2600, 2720, 2200, 2520, 2850, 3010, 3150, 3280, 3400],
            "aps_rondas_rurales": [36, 36, 38, 38, 40, 30, 36, 40, 40, 42, 42, 42],
            "hosp_egresos": [465, 480, 495, 512, 528, 440, 485, 525, 545, 565, 580, 595],
            "hosp_intervenciones_quirurgicas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_consultas_especialidad": [5700, 5880, 6050, 6240, 6420, 5050, 5820, 6590, 6880, 7150, 7380, 7600],
            "hosp_urgencias": [6350, 6520, 6720, 6930, 7140, 5600, 6450, 7280, 7590, 7880, 8120, 8350]
        },
        "educacion": {
            "matricula_rural_multigrado": [52, 50, 49, 48, 47, 46, 45, 44, 43, 42, 42, 41],
            "escuelas_rurales_activas": [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            "matricula_urbana_liceos": [418, 425, 432, 440, 448, 444, 450, 458, 465, 472, 478, 485],
            "matricula_tecnico_profesional": [155, 158, 162, 166, 170, 168, 172, 176, 180, 185, 188, 192],
            "matricula_parvularia_junji_integra": [98, 102, 106, 110, 114, 100, 108, 115, 120, 124, 128, 132]
        },
        "energia": {
            "generacion_mwh": [3880, 3990, 4110, 4230, 4350, 4210, 4380, 4540, 4680, 4820, 4940, 5060],
            "subsidio_operacion_mclp": [265, 276, 288, 302, 316, 332, 350, 369, 390, 412, 430, 448]
        },
        "economia_pesca": {
            "empresas_sii": [290, 301, 312, 324, 336, 330, 342, 352, 360, 365, 372, 380],
            "desembarque_artesanal_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "desembarque_industrial_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    "11302": { # O'Higgins
        "salud": {
            "aps_consultas_medicas": [2450, 2510, 2580, 2650, 2720, 2280, 2550, 2780, 2880, 2980, 3050, 3120],
            "aps_urgencias_atenciones": [410, 425, 445, 465, 485, 380, 450, 510, 540, 565, 590, 615],
            "aps_rondas_rurales": [18, 18, 20, 20, 20, 16, 18, 20, 22, 22, 22, 22],
            "hosp_egresos": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_intervenciones_quirurgicas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_consultas_especialidad": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_urgencias": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        "educacion": {
            "matricula_rural_multigrado": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "escuelas_rurales_activas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "matricula_urbana_liceos": [92, 95, 98, 102, 105, 103, 106, 110, 112, 115, 118, 120],
            "matricula_tecnico_profesional": [22, 24, 25, 26, 28, 27, 28, 30, 32, 34, 35, 36],
            "matricula_parvularia_junji_integra": [23, 24, 25, 26, 27, 22, 25, 28, 29, 30, 31, 32]
        },
        "energia": {
            "generacion_mwh": [865, 890, 920, 950, 980, 945, 990, 1030, 1070, 1110, 1140, 1170],
            "subsidio_operacion_mclp": [165, 172, 180, 189, 198, 208, 220, 232, 245, 258, 270, 282]
        },
        "economia_pesca": {
            "empresas_sii": [50, 52, 54, 56, 58, 57, 59, 61, 63, 65, 67, 69],
            "desembarque_artesanal_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "desembarque_industrial_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    "11303": { # Tortel
        "salud": {
            "aps_consultas_medicas": [2150, 2210, 2280, 2350, 2420, 2040, 2280, 2480, 2580, 2680, 2750, 2820],
            "aps_urgencias_atenciones": [360, 375, 395, 415, 435, 340, 400, 455, 480, 505, 530, 555],
            "aps_rondas_rurales": [16, 16, 18, 18, 18, 14, 16, 18, 20, 20, 20, 20],
            "hosp_egresos": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_intervenciones_quirurgicas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_consultas_especialidad": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "hosp_urgencias": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        "educacion": {
            "matricula_rural_multigrado": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "escuelas_rurales_activas": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "matricula_urbana_liceos": [78, 80, 82, 85, 88, 86, 88, 92, 94, 96, 98, 100],
            "matricula_tecnico_profesional": [18, 19, 20, 21, 22, 21, 22, 24, 25, 26, 27, 28],
            "matricula_parvularia_junji_integra": [19, 20, 21, 22, 23, 19, 21, 24, 25, 26, 27, 28]
        },
        "energia": {
            "generacion_mwh": [760, 785, 810, 840, 870, 835, 880, 915, 950, 985, 1010, 1035],
            "subsidio_operacion_mclp": [152, 159, 166, 175, 184, 194, 205, 217, 229, 242, 254, 265]
        },
        "economia_pesca": {
            "empresas_sii": [54, 56, 58, 60, 62, 61, 63, 65, 67, 69, 71, 73],
            "desembarque_artesanal_ton": [145, 152, 160, 168, 175, 142, 165, 182, 194, 205, 212, 220],
            "desembarque_industrial_ton": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    }
}

def build_dataset():
    # 1. Datos comunales detallados
    datos_comunales = {
        "11101": { # Coyhaique
            "salud_diferenciada": {
                "atencion_primaria_aps": {
                    "total_establecimientos_aps": 13,
                    "cesfam_total": 2,
                    "cesfam_nombres": [
                        "CESFAM Victor Domingo Silva",
                        "CESFAM Alejandro Gutierrez"
                    ],
                    "cecosf_total": 2,
                    "cecosf_nombres": [
                        "CECOSF Los Condores",
                        "CECOSF Valle Simpson"
                    ],
                    "postas_salud_rural_total": 7,
                    "postas_salud_rural_nombres": [
                        "Posta de Salud Rural Balmaceda",
                        "Posta de Salud Rural El Blanco",
                        "Posta de Salud Rural Lago Atravesado",
                        "Posta de Salud Rural Valle Simpson",
                        "Posta de Salud Rural Villa Ortega",
                        "Posta de Salud Rural Villa Nirehuao",
                        "Posta de Salud Rural Arroyo El Gato"
                    ],
                    "estaciones_medico_rurales_total": 4,
                    "estaciones_medico_rurales_nombres": [
                        "EMR El Salto",
                        "EMR Lago Pollux",
                        "EMR Seis Hermanas",
                        "EMR Rodeo Los Palos"
                    ],
                    "rondas_medicas_frecuencia_y_equipo": "Rondas quincenales a postas y mensuales a estaciones medico rurales por equipo de cabecera APS (medico general, enfermera, matrona, dentista, asistente social y TENS residente)",
                    "prestaciones_preventivas": [
                        "Examen de Medicina Preventiva del Adulto (EMP)",
                        "Examen de Medicina Preventiva del Adulto Mayor (EMPAM)",
                        "Control de Salud Infantil y Nino Sano",
                        "Programa Nacional de Inmunizaciones (PNI)",
                        "Programa de Salud Cardiovascular (PSCV)",
                        "Entrega de Alimentacion Complementaria PNAC y PACAM",
                        "Fondo de Farmacia (FOFAR) para patologias cronicas"
                    ]
                },
                "red_hospitalaria": {
                    "establecimiento_hospitalario": "Hospital Regional Coyhaique",
                    "nivel_complejidad": "Alta Complejidad (Hospital Base Regional / Tipo 1-2)",
                    "camas_totales": 167,
                    "camas_criticas_uci_uti": {
                        "uci_adultos": 6,
                        "uti_adultos": 12,
                        "uti_pediatrica": 4,
                        "neonatologia": 6
                    },
                    "quirofanos_totales": 5,
                    "quirofanos_detalle": "5 pabellones quirurgicos electivos y de urgencia + 1 sala de partos quirurgica",
                    "servicios_apoyo_diagnostico": [
                        "Laboratorio Clinico Automatizado 24/7",
                        "Imagenologia: Resonador Magnetico y TAC Multicorte 64 canales",
                        "Unidad de Hemodialisis Regional (24 puestos)",
                        "Banco de Sangre y Medicina Transfusional",
                        "Base Central y Centro Regulador SAMU Regional Aysen",
                        "Helipuerto institucional habilitado DGAC para aeroevacuaciones"
                    ],
                    "protocolo_derivacion": "Centro receptor final de toda la red asistencial de Aysen. Patologias de ultra-alta complejidad (gran quemado, cirugia cardiovascular pediatrica extracorporea, trasplantes) se derivan por aeroevacuacion FACH/SAMU a Hospital Puerto Montt o Hospital Salvador/Calvo Mackenna en Santiago."
                }
            },
            "educacion_diferenciada_slep": {
                "escuelas_rurales_multigrado_unidocentes_total": 12,
                "escuelas_rurales_multigrado_unidocentes_nombres": [
                    "Escuela Rural Valle Simpson",
                    "Escuela Rural Arroyo El Gato",
                    "Escuela Rural El Blanco",
                    "Escuela Rural Villa Ortega",
                    "Escuela Rural Villa Nirehuao",
                    "Escuela Rural Lago Atravesado",
                    "Escuela Rural Balmaceda (Basica)",
                    "Escuela Rural Vista Hermosa",
                    "Escuela Rural Alto Baguales",
                    "Escuela Rural El Salto",
                    "Escuela Rural Lago Pollux",
                    "Escuela Rural Los Torreones"
                ],
                "liceos_urbanos_hc_tp_total": 7,
                "liceos_urbanos_hc_tp_nombres": [
                    "Liceo Bicentenario Altos del Mackay (HC)",
                    "Liceo Tecnico Profesional Josefina Aguirre Montenegro (TP)",
                    "Liceo Republica de Argentina (HC)",
                    "Colegio Bicentenario Victor Domingo Silva (HC)",
                    "Colegio Diego Portales (HC)",
                    "Liceo Agricola de la Patagonia (TP Agropecuario)",
                    "Colegio San Felipe Benicio (Particular Subvencionado)"
                ],
                "jardines_junji_integra_total": 18,
                "jardines_junji_integra_nombres": [
                    "Jardin Infantil Copito de Nieve (JUNJI)",
                    "Jardin Infantil Kau-Kalem (JUNJI)",
                    "Jardin Infantil Arcoiris (Integra)",
                    "Jardin Infantil Bambi (JUNJI)",
                    "Jardin Infantil El Ovejero (Integra)",
                    "Jardin Infantil Las Lengitas (VTF)"
                ]
            },
            "energia_diferenciada": {
                "clasificacion_sistema": "Sistema Mediano Regulado",
                "subsistema_nombre": "Sistema Mediano de Aysen (SMA)",
                "operador_distribucion": "Empresa Electrica de Aysen S.A. (Edelaysen - Grupo Saesa)",
                "horas_suministro_diarias": 24,
                "subsidios_operacion": "Mecanismo de Estabilizacion y Subsidio Ley 20.936 (PECP y Equidad Tarifaria Residencial CNE)",
                "potencia_instalada_mw": 26.8,
                "desglose_tecnologia_mw": {
                    "hidroelectrica": 0.8,
                    "eolica": 3.2,
                    "diesel": 22.8,
                    "solar": 0.0
                },
                "desglose_tecnologia_pct": {
                    "hidroelectrica": 3.0,
                    "eolica": 11.9,
                    "diesel": 85.1,
                    "solar": 0.0
                }
            },
            "economia_sii_y_pesca": {
                "sii_empresas_tamano": {
                    "total_empresas": 5240,
                    "microempresa_n": 3878,
                    "microempresa_pct": 74.0,
                    "pequena_empresa_n": 1127,
                    "pequena_empresa_pct": 21.5,
                    "mediana_empresa_n": 194,
                    "mediana_empresa_pct": 3.7,
                    "grande_empresa_n": 41,
                    "grande_empresa_pct": 0.8
                },
                "pesca_artesanal": {
                    "caletas_oficiales_total": 0,
                    "caletas_nombres": [],
                    "pesquerias_artesanales_principales": "Sin litoral maritimo directo; comercio mayorista y distribucion de recursos del mar",
                    "especies_objetivo": [],
                    "artes_de_pesca": []
                },
                "pesca_industrial": {
                    "presencia_plantas_o_flota": "Sede corporativa y servicios de apoyo logisticos; sin planta procesadora directa ni desembarque",
                    "titulares_ltp_o_plantas": ["Servicios auxiliares pesqueros y proveedores"],
                    "pesquerias_cuota_industrial": [],
                    "gravamenes_aplicables": "Patentes municipales comerciales y tributacion general SII"
                }
            }
        },

        "11102": { # Lago Verde
            "salud_diferenciada": {
                "atencion_primaria_aps": {
                    "total_establecimientos_aps": 5,
                    "cesfam_total": 0,
                    "cesfam_nombres": [],
                    "cecosf_total": 0,
                    "cecosf_nombres": [],
                    "postas_salud_rural_total": 3,
                    "postas_salud_rural_nombres": [
                        "Posta de Salud Rural Lago Verde",
                        "Posta de Salud Rural Villa La Tapera",
                        "Posta de Salud Rural Villa Amengual"
                    ],
                    "estaciones_medico_rurales_total": 2,
                    "estaciones_medico_rurales_nombres": [
                        "EMR Alto Rio Cisnes",
                        "EMR La Peligrosa"
                    ],
                    "rondas_medicas_frecuencia_y_equipo": "Ronda mensual por equipo medico de cabecera desde CESFAM/Hospital base con TENS permanente en cada posta",
                    "prestaciones_preventivas": [
                        "Control Cardiovascular PSCV",
                        "Control Nino Sano",
                        "Vacunatorio PNI",
                        "EMP/EMPAM",
                        "Entrega de leche y farmacos cronicos"
                    ]
                },
                "red_hospitalaria": {
                    "establecimiento_hospitalario": "Sin hospital en la comuna (Atencion Primaria Rural)",
                    "nivel_complejidad": "Derivacion Hospitalaria Externa",
                    "camas_totales": 0,
                    "camas_criticas_uci_uti": {
                        "uci_adultos": 0,
                        "uti_adultos": 0,
                        "uti_pediatrica": 0,
                        "neonatologia": 0
                    },
                    "quirofanos_totales": 0,
                    "quirofanos_detalle": "0 quirofanos (atencion basica de urgencia en box de posta)",
                    "servicios_apoyo_diagnostico": [
                        "Triage y estabilizacion en box de procedimientos",
                        "Electrocardiografo con telemedicina",
                        "Oxigenoterapia de urgencia"
                    ],
                    "protocolo_derivacion": "Derivacion directa a Hospital Regional Coyhaique (traslado terrestre 4.5 h en ambulancia 4x4) o centro hospitalario de Cisnes segun cercania. Aeroevacuacion SAMU ante emergencias criticas o cortes de ruta por nevadas."
                }
            },
            "educacion_diferenciada_slep": {
                "escuelas_rurales_multigrado_unidocentes_total": 3,
                "escuelas_rurales_multigrado_unidocentes_nombres": [
                    "Escuela Rural Jose Antolin Silva Ormeno (Lago Verde)",
                    "Escuela Rural Rio Cisnes (Villa La Tapera)",
                    "Escuela Rural Villa Amengual"
                ],
                "liceos_urbanos_hc_tp_total": 0,
                "liceos_urbanos_hc_tp_nombres": [],
                "jardines_junji_integra_total": 2,
                "jardines_junji_integra_nombres": [
                    "Jardin Infantil Lago Verde (Integra)",
                    "Sala Cuna y Jardin Infantil La Tapera (VTF)"
                ]
            },
            "energia_diferenciada": {
                "clasificacion_sistema": "Sistema Mediano Extendido / Aislado Radial",
                "subsistema_nombre": "Sistema Palena - La Junta (Edelaysen) y Autoproduccion Lago Verde",
                "operador_distribucion": "Edelaysen S.A.",
                "horas_suministro_diarias": 24,
                "subsidios_operacion": "Tarifa regulada de distribucion rural y subsidio de equidad tarifaria CNE",
                "potencia_instalada_mw": 1.4,
                "desglose_tecnologia_mw": {
                    "hidroelectrica": 0.0,
                    "eolica": 0.0,
                    "diesel": 1.4,
                    "solar": 0.0
                },
                "desglose_tecnologia_pct": {
                    "hidroelectrica": 0.0,
                    "eolica": 0.0,
                    "diesel": 100.0,
                    "solar": 0.0
                }
            },
            "economia_sii_y_pesca": {
                "sii_empresas_tamano": {
                    "total_empresas": 86,
                    "microempresa_n": 74,
                    "microempresa_pct": 86.0,
                    "pequena_empresa_n": 11,
                    "pequena_empresa_pct": 12.8,
                    "mediana_empresa_n": 1,
                    "mediana_empresa_pct": 1.2,
                    "grande_empresa_n": 0,
                    "grande_empresa_pct": 0.0
                },
                "pesca_artesanal": {
                    "caletas_oficiales_total": 0,
                    "caletas_nombres": [],
                    "pesquerias_artesanales_principales": "Sin actividad pesquera maritima; pesca recreativa deportiva de truchas y salmones en rios",
                    "especies_objetivo": [],
                    "artes_de_pesca": []
                },
                "pesca_industrial": {
                    "presencia_plantas_o_flota": "Nula",
                    "titulares_ltp_o_plantas": [],
                    "pesquerias_cuota_industrial": [],
                    "gravamenes_aplicables": "No aplica"
                }
            }
        },

        "11201": { # Aysen
            "salud_diferenciada": {
                "atencion_primaria_aps": {
                    "total_establecimientos_aps": 7,
                    "cesfam_total": 0,
                    "cesfam_nombres": [],
                    "cecosf_total": 1,
                    "cecosf_nombres": [
                        "CECOSF Ribera Sur (Puerto Aysen)"
                    ],
                    "postas_salud_rural_total": 4,
                    "postas_salud_rural_nombres": [
                        "Posta de Salud Rural Puerto Aguirre (Islas Huichas)",
                        "Posta de Salud Rural Caleta Andrade (Islas Huichas)",
                        "Posta de Salud Rural Estero Copa (Islas Huichas)",
                        "Posta de Salud Rural Villa Manihuales"
                    ],
                    "estaciones_medico_rurales_total": 2,
                    "estaciones_medico_rurales_nombres": [
                        "EMR Vista Hermosa",
                        "EMR Rio Los Palos"
                    ],
                    "rondas_medicas_frecuencia_y_equipo": "Rondas maritimas mensuales a Islas Huichas por lancha sanitaria SSA y rondas quincenales terrestres a Manihuales",
                    "prestaciones_preventivas": [
                        "Control del Nino Sano",
                        "Programa Cardiovascular PSCV",
                        "Vacunatorio PNI",
                        "EMPAM",
                        "Salud Dental Rural",
                        "Entrega PNAC/PACAM"
                    ]
                },
                "red_hospitalaria": {
                    "establecimiento_hospitalario": "Hospital de Puerto Aysen",
                    "nivel_complejidad": "Mediana Complejidad / Comunitario Resolutivo (Hospital Tipo 3)",
                    "camas_totales": 52,
                    "camas_criticas_uci_uti": {
                        "uci_adultos": 0,
                        "uti_adultos": 0,
                        "uti_pediatrica": 0,
                        "neonatologia": 2
                    },
                    "quirofanos_totales": 2,
                    "quirofanos_detalle": "2 pabellones quirurgicos para cirugia menor, cirugia ambulatoria, procedimientos y cesareas",
                    "servicios_apoyo_diagnostico": [
                        "Servicio de Urgencia 24/7 con ambulancia de avanzada",
                        "Laboratorio Clinico",
                        "Imagenologia basica y Rayos X digital",
                        "Sala de Partos integral",
                        "Rehabilitacion Kinesica integral"
                    ],
                    "protocolo_derivacion": "Derivacion a Hospital Regional Coyhaique para cirugia mayor, cuidados intensivos UCI/UTI y especialidades (a 65 km, 1.0 h de traslado terrestre pavimentado por Ruta 240). Desde Islas Huichas se evacua por lancha ambulancia o aeroevacuacion FACH/Carabineros/SAMU."
                }
            },
            "educacion_diferenciada_slep": {
                "escuelas_rurales_multigrado_unidocentes_total": 6,
                "escuelas_rurales_multigrado_unidocentes_nombres": [
                    "Escuela Rural Almirante Simpson (Puerto Chacabuco)",
                    "Escuela Rural Carlos Condell (Caleta Andrade - Islas Huichas)",
                    "Escuela Rural Pedro Aguirre Cerda (Puerto Aguirre)",
                    "Escuela Rural Gabriela Mistral (Sector Km 8)",
                    "Escuela Rural Aysen Manihuales",
                    "Escuela Rural San Sebastian"
                ],
                "liceos_urbanos_hc_tp_total": 4,
                "liceos_urbanos_hc_tp_nombres": [
                    "Liceo Bicentenario San Jose UR (HC y TP Maritimo-Acuicola)",
                    "Liceo Politecnico Aysen (TP Mecanica, Quimica Industrial y Construccion)",
                    "Liceo Raul Broussain Campino (HC)",
                    "Colegio Santa Teresa de los Andes (Particular Subvencionado)"
                ],
                "jardines_junji_integra_total": 9,
                "jardines_junji_integra_nombres": [
                    "Jardin Infantil Los Nadis (JUNJI Puerto Aysen)",
                    "Jardin Infantil Panguecitos (JUNJI Ribera Sur)",
                    "Jardin Infantil Gotitas de Lluvia (Integra Chacabuco)",
                    "Jardin Infantil Los Manios (Integra Puerto Aysen)",
                    "Jardin Infantil Rayito de Sol (Islas Huichas)"
                ]
            },
            "energia_diferenciada": {
                "clasificacion_sistema": "Sistema Mediano (Continente) y Sistema Aislado (Islas Huichas)",
                "subsistema_nombre": "Sistema Mediano de Aysen (SMA) e Islas Huichas Aislado",
                "operador_distribucion": "Edelaysen S.A.",
                "horas_suministro_diarias": 24,
                "subsidios_operacion": "Subsidio de Equidad Tarifaria CNE en continente; subsidio al flete maritimo de combustible en Puerto Aguirre",
                "potencia_instalada_mw": 42.5,
                "desglose_tecnologia_mw": {
                    "hidroelectrica": 15.9,
                    "eolica": 0.0,
                    "diesel": 26.6,
                    "solar": 0.0
                },
                "desglose_tecnologia_pct": {
                    "hidroelectrica": 37.4,
                    "eolica": 0.0,
                    "diesel": 62.6,
                    "solar": 0.0
                }
            },
            "economia_sii_y_pesca": {
                "sii_empresas_tamano": {
                    "total_empresas": 2180,
                    "microempresa_n": 1570,
                    "microempresa_pct": 72.0,
                    "pequena_empresa_n": 480,
                    "pequena_empresa_pct": 22.0,
                    "mediana_empresa_n": 104,
                    "mediana_empresa_pct": 4.8,
                    "grande_empresa_n": 26,
                    "grande_empresa_pct": 1.2
                },
                "pesca_artesanal": {
                    "caletas_oficiales_total": 2,
                    "caletas_nombres": [
                        "Caleta Puerto Aguirre (Islas Huichas)",
                        "Caleta de Pescadores Puerto Chacabuco"
                    ],
                    "pesquerias_artesanales_principales": "Pesca demersal con espinel y extraccion bentonica de moluscos",
                    "especies_objetivo": [
                        "Merluza del sur (Merluccius australis)",
                        "Congrio dorado (Genypterus blacodes)",
                        "Erizo rojo (Loxechinus albus)",
                        "Almeja (Ameghinomya antiqua)",
                        "Cholga (Aulacomya atra)"
                    ],
                    "artes_de_pesca": [
                        "Espinel y linea de mano",
                        "Buceo semi-autonomo con compresor de aire",
                        "Trampas de jaiba"
                    ]
                },
                "pesca_industrial": {
                    "presencia_plantas_o_flota": "Polo industrial pesquero y portuario principal de la Region de Aysen. Puerto base de buques arrastreros y plantas de congelado/procesamiento",
                    "titulares_ltp_o_plantas": [
                        "Pesquera Friosur S.A. (Planta de proceso Puerto Chacabuco)",
                        "Deris S.A.",
                        "Emdepes S.A. (Operacion en muelle Chacabuco)",
                        "Globalpesca SpA"
                    ],
                    "pesquerias_cuota_industrial": [
                        "Merluza del sur (Merluccius australis) - Cuota LTP Clase A y B (37% fraccion industrial Ley 21.752)",
                        "Congrio dorado (Genypterus blacodes) - Cuota LTP Clase A y B",
                        "Merluza de cola (Macruronus magellanicus) - Arrastre media agua",
                        "Merluza de tres aletas (Micromesistius australis)"
                    ],
                    "gravamenes_aplicables": "Impuesto Especifico a la Pesca Art. 43 ter LGPA (4.2% del Valor Sancion por tonelada de cuota LTP-A pagado en julio TGR) y Patente Unica Pesquera Art. 43 (0.4 a 2.0 UTM por TRG nave semestral)"
                }
            }
        },

        "11202": { # Cisnes
            "salud_diferenciada": {
                "atencion_primaria_aps": {
                    "total_establecimientos_aps": 7,
                    "cesfam_total": 0,
                    "cesfam_nombres": [],
                    "cecosf_total": 0,
                    "cecosf_nombres": [],
                    "postas_salud_rural_total": 5,
                    "postas_salud_rural_nombres": [
                        "Posta de Salud Rural Puyuhuapi",
                        "Posta de Salud Rural La Junta",
                        "Posta de Salud Rural Puerto Raul Marin Balmaceda",
                        "Posta de Salud Rural Puerto Gala",
                        "Posta de Salud Rural Puerto Gaviota"
                    ],
                    "estaciones_medico_rurales_total": 2,
                    "estaciones_medico_rurales_nombres": [
                        "EMR Melimoyu",
                        "EMR Puerto Piedra"
                    ],
                    "rondas_medicas_frecuencia_y_equipo": "Rondas maritimas mensuales a Puerto Gala y Puerto Gaviota; rondas quincenales terrestres por Carretera Austral a Puyuhuapi y La Junta",
                    "prestaciones_preventivas": [
                        "Programa Cardiovascular PSCV",
                        "Control Nino Sano",
                        "Inmunizaciones PNI",
                        "EMPAM",
                        "Examenes preventivos en terreno"
                    ]
                },
                "red_hospitalaria": {
                    "establecimiento_hospitalario": "Hospital Comunitario Dr. Jorge Ibar Bruce de Puerto Cisnes",
                    "nivel_complejidad": "Baja Complejidad (Hospital Comunitario de Salud Familiar / Tipo 4)",
                    "camas_totales": 12,
                    "camas_criticas_uci_uti": {
                        "uci_adultos": 0,
                        "uti_adultos": 0,
                        "uti_pediatrica": 0,
                        "neonatologia": 0
                    },
                    "quirofanos_totales": 0,
                    "quirofanos_detalle": "0 quirofanos de cirugia mayor (cuenta con box de procedimientos quirurgicos menores y atencion de partos inminentes)",
                    "servicios_apoyo_diagnostico": [
                        "Servicio de Urgencia Rural (SUR) 24/7",
                        "Laboratorio Clinico basico",
                        "Rayos X dental y osteopulmonar",
                        "Box dental y box ginecologico",
                        "Ambulancia 4x4 de emergencia"
                    ],
                    "protocolo_derivacion": "Derivacion terrestre hacia Hospital de Puerto Aysen (165 km, 2.5 h) o Hospital Regional Coyhaique (196 km, 3.5 h) por Ruta 7 y Ruta 240. Las caletas aisladas (Gala, Gaviota, Marin Balmaceda) derivan por lancha ambulancia hacia Quellon o Cisnes, o aeroevacuacion SAMU."
                }
            },
            "educacion_diferenciada_slep": {
                "escuelas_rurales_multigrado_unidocentes_total": 5,
                "escuelas_rurales_multigrado_unidocentes_nombres": [
                    "Escuela Rural Amanda Labarca (Puerto Raul Marin Balmaceda)",
                    "Escuela Rural Melimoyu",
                    "Escuela Rural Puerto Gala (Isla Toto)",
                    "Escuela Rural Puerto Gaviota",
                    "Escuela Rural Puyuhuapi"
                ],
                "liceos_urbanos_hc_tp_total": 1,
                "liceos_urbanos_hc_tp_nombres": [
                    "Liceo Arturo Prat Chacon de Puerto Cisnes (TP Maritimo y Turismo)"
                ],
                "jardines_junji_integra_total": 5,
                "jardines_junji_integra_nombres": [
                    "Jardin Infantil Puerto Cisnes (Integra)",
                    "Jardin Infantil Puyuhuapi (JUNJI)",
                    "Jardin Infantil La Junta (Integra)",
                    "Jardin Infantil Raul Marin Balmaceda (JUNJI)",
                    "Sala Cuna Cisnes (VTF)"
                ]
            },
            "energia_diferenciada": {
                "clasificacion_sistema": "Sistema Mediano y Micro-redes Aisladas",
                "subsistema_nombre": "Sistema Mediano Palena - Cisnes (Edelaysen) y Micro-redes Caletas",
                "operador_distribucion": "Edelaysen S.A. / Comites Locales",
                "horas_suministro_diarias": 24,
                "subsidios_operacion": "Tarifa regulada CNE de sistemas medianos; subsidio a grupos electrogenos en caletas pesqueras",
                "potencia_instalada_mw": 6.8,
                "desglose_tecnologia_mw": {
                    "hidroelectrica": 2.0,
                    "eolica": 0.0,
                    "diesel": 4.8,
                    "solar": 0.0
                },
                "desglose_tecnologia_pct": {
                    "hidroelectrica": 29.4,
                    "eolica": 0.0,
                    "diesel": 70.6,
                    "solar": 0.0
                }
            },
            "economia_sii_y_pesca": {
                "sii_empresas_tamano": {
                    "total_empresas": 490,
                    "microempresa_n": 382,
                    "microempresa_pct": 78.0,
                    "pequena_empresa_n": 93,
                    "pequena_empresa_pct": 19.0,
                    "mediana_empresa_n": 12,
                    "mediana_empresa_pct": 2.4,
                    "grande_empresa_n": 3,
                    "grande_empresa_pct": 0.6
                },
                "pesca_artesanal": {
                    "caletas_oficiales_total": 4,
                    "caletas_nombres": [
                        "Caleta Puerto Gala (Isla Toto)",
                        "Caleta Puerto Gaviota",
                        "Caleta y Muelle de Pescadores Puerto Cisnes",
                        "Caleta Puerto Raul Marin Balmaceda"
                    ],
                    "pesquerias_artesanales_principales": "Pesca demersal de merluza austral y congrio; extraccion bentonica de centolla y erizo",
                    "especies_objetivo": [
                        "Merluza del sur (Merluccius australis)",
                        "Congrio dorado (Genypterus blacodes)",
                        "Centolla (Lithodes santolla)",
                        "Erizo rojo (Loxechinus albus)",
                        "Jaiba marmola"
                    ],
                    "artes_de_pesca": [
                        "Espinel y espinel de fondo",
                        "Trampas centolleras y jaiberas",
                        "Buceo semi-autonomo"
                    ]
                },
                "pesca_industrial": {
                    "presencia_plantas_o_flota": "Paso y operacion exterior de naves factoria en canales principales; sin plantas industriales de proceso activas en la comuna",
                    "titulares_ltp_o_plantas": ["Flota industrial de paso autorizada SERNAPESCA"],
                    "pesquerias_cuota_industrial": ["Merluza del sur y congrio dorado en aguas exteriores"],
                    "gravamenes_aplicables": "Patente Unica Pesquera por naves operando en la unidad de pesqueria"
                }
            }
        },

        "11203": { # Guaitecas
            "salud_diferenciada": {
                "atencion_primaria_aps": {
                    "total_establecimientos_aps": 3,
                    "cesfam_total": 1,
                    "cesfam_nombres": [
                        "CESFAM Melinka (Atencion Primaria Resolutiva Insular)"
                    ],
                    "cecosf_total": 0,
                    "cecosf_nombres": [],
                    "postas_salud_rural_total": 1,
                    "postas_salud_rural_nombres": [
                        "Posta de Salud Rural Repollal Bajo"
                    ],
                    "estaciones_medico_rurales_total": 1,
                    "estaciones_medico_rurales_nombres": [
                        "EMR Melinka Sur / Isla Ascension"
                    ],
                    "rondas_medicas_frecuencia_y_equipo": "Ronda quincenal terrestre/maritima entre Melinka y Repollal; equipo de cabecera en CESFAM Melinka con 2 medicos generales de zona (EDF), enfermeros, matrona, dentista y TENS permanente en Repollal",
                    "prestaciones_preventivas": [
                        "Atencion de Urgencia 24/7 (SUR)",
                        "Programa Cardiovascular PSCV",
                        "Control Nino Sano",
                        "Vacunatorio PNI",
                        "Salud Bucal Primaria",
                        "Medicina Preventiva Adulto y Mayor"
                    ]
                },
                "red_hospitalaria": {
                    "establecimiento_hospitalario": "Sin hospital en el archipielago (Cobertura por CESFAM Melinka)",
                    "nivel_complejidad": "Atencion Primaria con Servicio de Urgencia Rural (SUR) y Sala de Rayos/Observacion",
                    "camas_totales": 0,
                    "camas_criticas_uci_uti": {
                        "uci_adultos": 0,
                        "uti_adultos": 0,
                        "uti_pediatrica": 0,
                        "neonatologia": 0
                    },
                    "quirofanos_totales": 0,
                    "quirofanos_detalle": "0 quirofanos (atencion de urgencias y estabilizacion previa a aeroevacuacion)",
                    "servicios_apoyo_diagnostico": [
                        "Box de Reanimacion y Triage SUR",
                        "Rayos X dental y osteopulmonar basico",
                        "Laboratorio basico de urgencia (hemograma/quimica rapida)",
                        "Ambulancia 4x4 comunal",
                        "Lancha ambulancia municipal",
                        "Helipuerto y aerodromo Melinka (SCMK) para aeroevacuaciones"
                    ],
                    "protocolo_derivacion": "Derivacion de maxima criticidad logistica. Traslado por avion ambulancia o helicoptero institucional SAMU/FACH/Carabineros hacia Hospital Regional Coyhaique o hacia Hospital de Castro (Region de Los Lagos) por cercania geografica en emergencias de riesgo vital inminente. Traslado maritimo a Quellon (5.0 h en barcaza) para casos electivos."
                }
            },
            "educacion_diferenciada_slep": {
                "escuelas_rurales_multigrado_unidocentes_total": 1,
                "escuelas_rurales_multigrado_unidocentes_nombres": [
                    "Escuela Rural Repollal"
                ],
                "liceos_urbanos_hc_tp_total": 1,
                "liceos_urbanos_hc_tp_nombres": [
                    "Liceo Melinka (HC y TP Maritimo-Pesquero y Acuicola)"
                ],
                "jardines_junji_integra_total": 2,
                "jardines_junji_integra_nombres": [
                    "Jardin Infantil Lobito Marino (JUNJI Melinka)",
                    "Sala Cuna y Jardin Infantil Rayito de Sol (Integra)"
                ]
            },
            "energia_diferenciada": {
                "clasificacion_sistema": "Sistema Aislado Municipal Insular",
                "subsistema_nombre": "Sistema Aislado Insular Melinka",
                "operador_distribucion": "Ilustre Municipalidad de Guaitecas (Servicio Electrico Municipal)",
                "horas_suministro_diarias": 24,
                "subsidios_operacion": "Subsidio al Diesel de Generacion FNDR / GORE Aysen Glosa 02 (cubre mas del 65% del costo de combustible)",
                "potencia_instalada_mw": 2.8,
                "desglose_tecnologia_mw": {
                    "hidroelectrica": 0.0,
                    "eolica": 0.0,
                    "diesel": 2.8,
                    "solar": 0.0
                },
                "desglose_tecnologia_pct": {
                    "hidroelectrica": 0.0,
                    "eolica": 0.0,
                    "diesel": 100.0,
                    "solar": 0.0
                }
            },
            "economia_sii_y_pesca": {
                "sii_empresas_tamano": {
                    "total_empresas": 198,
                    "microempresa_n": 168,
                    "microempresa_pct": 84.8,
                    "pequena_empresa_n": 27,
                    "pequena_empresa_pct": 13.6,
                    "mediana_empresa_n": 3,
                    "mediana_empresa_pct": 1.5,
                    "grande_empresa_n": 0,
                    "grande_empresa_pct": 0.0
                },
                "pesca_artesanal": {
                    "caletas_oficiales_total": 2,
                    "caletas_nombres": [
                        "Caleta Pesquera Artesanal Melinka",
                        "Caleta Pesquera Repollal Bajo"
                    ],
                    "pesquerias_artesanales_principales": "Principal polo bentonico regional de Chile Austral; extraccion masiva de erizo rojo, almejas y luga",
                    "especies_objetivo": [
                        "Erizo rojo (Loxechinus albus)",
                        "Almeja (Ameghinomya antiqua)",
                        "Luga roja (Gigartina skottsbergii)",
                        "Loco (Concholepas concholepas en areas AMERB)",
                        "Merluza del sur (pesca de consumo y venta menor)"
                    ],
                    "artes_de_pesca": [
                        "Buceo semi-autonomo tipo cachimba",
                        "Embarcaciones artesanales y botes motor fuera de borda",
                        "Recoleccion de orilla"
                    ]
                },
                "pesca_industrial": {
                    "presencia_plantas_o_flota": "Fondeo de naves auxiliares de la salmonicultura y transito de flota pesquera industrial en boca del Golfo Corcovado; sin plantas industriales de harina ni congelado en tierra",
                    "titulares_ltp_o_plantas": ["Centros de engorda salmonicola y centros de acopio"],
                    "pesquerias_cuota_industrial": ["Flota industrial opera en exterior de Golfo Corcovado"],
                    "gravamenes_aplicables": "Patentes municipales pesqueras y concesiones de fondeo maritimo"
                }
            }
        },

        "11401": { # Chile Chico
            "salud_diferenciada": {
                "atencion_primaria_aps": {
                    "total_establecimientos_aps": 5,
                    "cesfam_total": 0,
                    "cesfam_nombres": [],
                    "cecosf_total": 0,
                    "cecosf_nombres": [],
                    "postas_salud_rural_total": 3,
                    "postas_salud_rural_nombres": [
                        "Posta de Salud Rural Puerto Guadal",
                        "Posta de Salud Rural Mallin Grande",
                        "Posta de Salud Rural Puerto Bertrand"
                    ],
                    "estaciones_medico_rurales_total": 2,
                    "estaciones_medico_rurales_nombres": [
                        "EMR Fachinal",
                        "EMR Bahia Jara"
                    ],
                    "rondas_medicas_frecuencia_y_equipo": "Ronda quincenal del equipo APS desde Hospital de Chile Chico bordeando la cuenca lacustre del Lago General Carrera con TENS permanente en cada posta",
                    "prestaciones_preventivas": [
                        "Programa Cardiovascular PSCV",
                        "Control Nino Sano",
                        "Vacunatorio PNI",
                        "EMPAM",
                        "Entrega de Farmacos y Alimentos PNAC"
                    ]
                },
                "red_hospitalaria": {
                    "establecimiento_hospitalario": "Hospital Familiar y Comunitario San Jose / Dr. Leopoldo Ortega Rodriguez de Chile Chico",
                    "nivel_complejidad": "Baja Complejidad (Hospital Comunitario de Salud Familiar / Tipo 4)",
                    "camas_totales": 14,
                    "camas_criticas_uci_uti": {
                        "uci_adultos": 0,
                        "uti_adultos": 0,
                        "uti_pediatrica": 0,
                        "neonatologia": 0
                    },
                    "quirofanos_totales": 0,
                    "quirofanos_detalle": "0 quirofanos de cirugia mayor (cuenta con pabellon de cirugia menor ambulatoria y sala de partos de emergencia)",
                    "servicios_apoyo_diagnostico": [
                        "Servicio de Urgencia 24/7",
                        "Laboratorio Clinico basico",
                        "Imagenologia: Rayos X convencional y Ecografia basica",
                        "Clinica Dental",
                        "Ambulancias 4x4"
                    ],
                    "protocolo_derivacion": "Derivacion bimodal hacia Hospital Regional Coyhaique: combinacion lacustre en barcaza Tehuelche Chile Chico - Puerto Ibanez (2.5 h navegacion) + terrestre 115 km (1.5 h) = total 4.5 h. Alternativa terrestre por territorio argentino (Paso Los Antiguos/Huemules) en 6.0 h. Aeroevacuacion SAMU en pacientes criticos desde aerodromo Chile Chico (SCCC)."
                }
            },
            "educacion_diferenciada_slep": {
                "escuelas_rurales_multigrado_unidocentes_total": 2,
                "escuelas_rurales_multigrado_unidocentes_nombres": [
                    "Escuela Rural Libertador Bernardo O'Higgins (Puerto Guadal)",
                    "Escuela Rural Tulio Burgos Rivera (Mallin Grande)"
                ],
                "liceos_urbanos_hc_tp_total": 1,
                "liceos_urbanos_hc_tp_nombres": [
                    "Liceo Bicentenario Luisa Rabanal Palma (HC y TP Agropecuario y Servicios de Turismo)"
                ],
                "jardines_junji_integra_total": 3,
                "jardines_junji_integra_nombres": [
                    "Jardin Infantil La Semillita (JUNJI Chile Chico)",
                    "Jardin Infantil Rayito de Sol (Integra)",
                    "Sala Cuna Puerto Guadal (VTF)"
                ]
            },
            "energia_diferenciada": {
                "clasificacion_sistema": "Sistema Mediano Regulado",
                "subsistema_nombre": "Sistema Mediano General Carrera (SMGC)",
                "operador_distribucion": "Edelaysen S.A.",
                "horas_suministro_diarias": 24,
                "subsidios_operacion": "Tarificacion de Sistemas Medianos CNE y Subsidio de Equidad Tarifaria",
                "potencia_instalada_mw": 7.5,
                "desglose_tecnologia_mw": {
                    "hidroelectrica": 1.0,
                    "eolica": 0.0,
                    "diesel": 6.4,
                    "solar": 0.1
                },
                "desglose_tecnologia_pct": {
                    "hidroelectrica": 13.3,
                    "eolica": 0.0,
                    "diesel": 85.3,
                    "solar": 1.4
                }
            },
            "economia_sii_y_pesca": {
                "sii_empresas_tamano": {
                    "total_empresas": 415,
                    "microempresa_n": 324,
                    "microempresa_pct": 78.1,
                    "pequena_empresa_n": 79,
                    "pequena_empresa_pct": 19.0,
                    "mediana_empresa_n": 10,
                    "mediana_empresa_pct": 2.4,
                    "grande_empresa_n": 2,
                    "grande_empresa_pct": 0.5
                },
                "pesca_artesanal": {
                    "caletas_oficiales_total": 0,
                    "caletas_nombres": [],
                    "pesquerias_artesanales_principales": "Sin actividad pesquera maritima; pesca artesanal y deportiva de agua dulce en Lago General Carrera (trucha arcoiris y salmon chinook)",
                    "especies_objetivo": [
                        "Trucha arcoiris (Oncorhynchus mykiss)",
                        "Pejerrey patagonico"
                    ],
                    "artes_de_pesca": [
                        "Lineas de pesca y currican lacustre"
                    ]
                },
                "pesca_industrial": {
                    "presencia_plantas_o_flota": "Nula actividad pesquera industrial; matriz economica focalizada en mineria polimetalica (Cerro Bayo) y agrofruticultura de exportacion de cerezas",
                    "titulares_ltp_o_plantas": [],
                    "pesquerias_cuota_industrial": [],
                    "gravamenes_aplicables": "No aplica"
                }
            }
        },

        "11402": { # Rio Ibanez
            "salud_diferenciada": {
                "atencion_primaria_aps": {
                    "total_establecimientos_aps": 6,
                    "cesfam_total": 1,
                    "cesfam_nombres": [
                        "CESFAM Puerto Ingeniero Ibanez"
                    ],
                    "cecosf_total": 0,
                    "cecosf_nombres": [],
                    "postas_salud_rural_total": 3,
                    "postas_salud_rural_nombres": [
                        "Posta de Salud Rural Villa Cerro Castillo",
                        "Posta de Salud Rural Puerto Rio Tranquilo",
                        "Posta de Salud Rural Bahia Murta"
                    ],
                    "estaciones_medico_rurales_total": 2,
                    "estaciones_medico_rurales_nombres": [
                        "EMR Puerto Sanchez",
                        "EMR El Manzano"
                    ],
                    "rondas_medicas_frecuencia_y_equipo": "Ronda medica quincenal desde CESFAM Ibanez a Cerro Castillo, Tranquilo, Murta y Sanchez con ambulancias de traslado",
                    "prestaciones_preventivas": [
                        "Atencion Medica y Dental Primaria",
                        "Programa Cardiovascular PSCV",
                        "Control Nino Sano",
                        "Vacunatorio PNI",
                        "EMP/EMPAM"
                    ]
                },
                "red_hospitalaria": {
                    "establecimiento_hospitalario": "Sin hospital en la comuna (Atencion Primaria con CESFAM y Postas)",
                    "nivel_complejidad": "Derivacion Hospitalaria Externa",
                    "camas_totales": 0,
                    "camas_criticas_uci_uti": {
                        "uci_adultos": 0,
                        "uti_adultos": 0,
                        "uti_pediatrica": 0,
                        "neonatologia": 0
                    },
                    "quirofanos_totales": 0,
                    "quirofanos_detalle": "0 quirofanos (atencion de urgencias basicas y triage)",
                    "servicios_apoyo_diagnostico": [
                        "Servicio de Urgencia Rural 24/7 en CESFAM",
                        "Box de reanimacion y telecardiologia",
                        "Ambulancias 4x4 comunales"
                    ],
                    "protocolo_derivacion": "Derivacion directa hacia Hospital Regional Coyhaique por Ruta 7 pavimentada (115 km desde Pto. Ibanez, 1.5 h; 95 km desde Cerro Castillo, 1.2 h; 220 km desde Rio Tranquilo, 3.5 h). Evacuacion aeromedica en aerodromo Ibanez para emergencias criticas."
                }
            },
            "educacion_diferenciada_slep": {
                "escuelas_rurales_multigrado_unidocentes_total": 4,
                "escuelas_rurales_multigrado_unidocentes_nombres": [
                    "Escuela Rural Carretera Austral (Bahia Murta)",
                    "Escuela Rural Puerto Sanchez",
                    "Escuela Rural Gabriela Mistral (Puerto Rio Tranquilo)",
                    "Escuela Rural Aonikenk (Villa Cerro Castillo - ciclo basico)"
                ],
                "liceos_urbanos_hc_tp_total": 1,
                "liceos_urbanos_hc_tp_nombres": [
                    "Liceo Rural Cerro Castillo (TP Turismo, Hoteleria y Servicios)"
                ],
                "jardines_junji_integra_total": 3,
                "jardines_junji_integra_nombres": [
                    "Jardin Infantil Puerto Ibanez (Integra)",
                    "Jardin Infantil Cerro Castillo (JUNJI)",
                    "Sala Cuna Rio Tranquilo (VTF)"
                ]
            },
            "energia_diferenciada": {
                "clasificacion_sistema": "Sistema Mediano Regulado (Interconexion Ramal Sur)",
                "subsistema_nombre": "Sistema Mediano de Aysen (Interconexion Ramal 23 kV Coyhaique - Ibanez)",
                "operador_distribucion": "Edelaysen S.A.",
                "horas_suministro_diarias": 24,
                "subsidios_operacion": "Tarifa regulada SMA con compensacion de equidad tarifaria residencial",
                "potencia_instalada_mw": 2.4,
                "desglose_tecnologia_mw": {
                    "hidroelectrica": 0.0,
                    "eolica": 0.0,
                    "diesel": 2.4,
                    "solar": 0.0
                },
                "desglose_tecnologia_pct": {
                    "hidroelectrica": 0.0,
                    "eolica": 0.0,
                    "diesel": 100.0,
                    "solar": 0.0
                }
            },
            "economia_sii_y_pesca": {
                "sii_empresas_tamano": {
                    "total_empresas": 265,
                    "microempresa_n": 220,
                    "microempresa_pct": 83.0,
                    "pequena_empresa_n": 41,
                    "pequena_empresa_pct": 15.5,
                    "mediana_empresa_n": 4,
                    "mediana_empresa_pct": 1.5,
                    "grande_empresa_n": 0,
                    "grande_empresa_pct": 0.0
                },
                "pesca_artesanal": {
                    "caletas_oficiales_total": 0,
                    "caletas_nombres": [],
                    "pesquerias_artesanales_principales": "Sin actividad pesquera maritima; servicios de navegacion turistica menor en Santuario de la Naturaleza Capillas de Marmol y pesca deportiva",
                    "especies_objetivo": [],
                    "artes_de_pesca": []
                },
                "pesca_industrial": {
                    "presencia_plantas_o_flota": "Nula",
                    "titulares_ltp_o_plantas": [],
                    "pesquerias_cuota_industrial": [],
                    "gravamenes_aplicables": "No aplica"
                }
            }
        },

        "11301": { # Cochrane
            "salud_diferenciada": {
                "atencion_primaria_aps": {
                    "total_establecimientos_aps": 3,
                    "cesfam_total": 0,
                    "cesfam_nombres": [],
                    "cecosf_total": 0,
                    "cecosf_nombres": [],
                    "postas_salud_rural_total": 1,
                    "postas_salud_rural_nombres": [
                        "Posta de Salud Rural San Lorenzo / Lago Vargas"
                    ],
                    "estaciones_medico_rurales_total": 2,
                    "estaciones_medico_rurales_nombres": [
                        "EMR Rio Neff",
                        "EMR San Martin"
                    ],
                    "rondas_medicas_frecuencia_y_equipo": "Ronda mensual a valles aislados (San Lorenzo, Colonia, Entrada Baker) por equipo multidisciplinario del Hospital de Cochrane",
                    "prestaciones_preventivas": [
                        "Control Cardiovascular PSCV",
                        "Control Nino Sano",
                        "Inmunizaciones PNI",
                        "EMPAM",
                        "Salud Dental Rural"
                    ]
                },
                "red_hospitalaria": {
                    "establecimiento_hospitalario": "Hospital Comunitario de Cochrane (Hospital Lord Cochrane)",
                    "nivel_complejidad": "Baja Complejidad (Cabecera Provincial Capitan Prat / Tipo 4)",
                    "camas_totales": 16,
                    "camas_criticas_uci_uti": {
                        "uci_adultos": 0,
                        "uti_adultos": 0,
                        "uti_pediatrica": 0,
                        "neonatologia": 0
                    },
                    "quirofanos_totales": 0,
                    "quirofanos_detalle": "0 quirofanos de cirugia mayor (cuenta con sala de procedimientos quirurgicos menores y sala de atencion de urgencias)",
                    "servicios_apoyo_diagnostico": [
                        "Servicio de Urgencia 24/7",
                        "Laboratorio Clinico",
                        "Imagenologia: Rayos X digital",
                        "Modulo Dental y Odontologia Integral",
                        "Ambulancias de traslado 4x4",
                        "Aerodromo Cochrane (SCHR) habilitado para vuelos sanitarios"
                    ],
                    "protocolo_derivacion": "Derivacion critica a Hospital Regional Coyhaique. Distancia 334 km por Ruta 7 (tramos pavimentados y ripio, tiempo de viaje 6.5 a 7.0 h). Pacientes criticos o con riesgo vital se derivan obligatoriamente por avion ambulancia o helicoptero institucional SAMU desde el aerodromo local."
                }
            },
            "educacion_diferenciada_slep": {
                "escuelas_rurales_multigrado_unidocentes_total": 1,
                "escuelas_rurales_multigrado_unidocentes_nombres": [
                    "Escuela Rural San Lorenzo / Barrancas"
                ],
                "liceos_urbanos_hc_tp_total": 1,
                "liceos_urbanos_hc_tp_nombres": [
                    "Liceo Bicentenario Austral Lord Cochrane (HC y TP Electricidad y Mecanica)"
                ],
                "jardines_junji_integra_total": 3,
                "jardines_junji_integra_nombres": [
                    "Jardin Infantil Tamanguito (JUNJI Cochrane)",
                    "Jardin Infantil El Huemul (Integra)",
                    "Sala Cuna Los Canelos (VTF)"
                ]
            },
            "energia_diferenciada": {
                "clasificacion_sistema": "Sistema Mediano Regulado (Extremo Sur SMGC)",
                "subsistema_nombre": "Sistema Mediano General Carrera - Cochrane (Edelaysen)",
                "operador_distribucion": "Edelaysen S.A.",
                "horas_suministro_diarias": 24,
                "subsidios_operacion": "Tarifa regulada de sistemas medianos CNE con compensacion por sobrecosto de combustible",
                "potencia_instalada_mw": 5.8,
                "desglose_tecnologia_mw": {
                    "hidroelectrica": 0.9,
                    "eolica": 0.0,
                    "diesel": 4.9,
                    "solar": 0.0
                },
                "desglose_tecnologia_pct": {
                    "hidroelectrica": 15.5,
                    "eolica": 0.0,
                    "diesel": 84.5,
                    "solar": 0.0
                }
            },
            "economia_sii_y_pesca": {
                "sii_empresas_tamano": {
                    "total_empresas": 345,
                    "microempresa_n": 276,
                    "microempresa_pct": 80.0,
                    "pequena_empresa_n": 60,
                    "pequena_empresa_pct": 17.4,
                    "mediana_empresa_n": 8,
                    "mediana_empresa_pct": 2.3,
                    "grande_empresa_n": 1,
                    "grande_empresa_pct": 0.3
                },
                "pesca_artesanal": {
                    "caletas_oficiales_total": 0,
                    "caletas_nombres": [],
                    "pesquerias_artesanales_principales": "Sin actividad maritima; pesca deportiva de salmonidos en Cuenca del Rio Baker y Lago Cochrane",
                    "especies_objetivo": [
                        "Trucha arcoiris",
                        "Trucha fario",
                        "Salmon chinook (Oncorhynchus tshawytscha)"
                    ],
                    "artes_de_pesca": [
                        "Pesca con mosca (fly fishing) y devolucion"
                    ]
                },
                "pesca_industrial": {
                    "presencia_plantas_o_flota": "Nula",
                    "titulares_ltp_o_plantas": [],
                    "pesquerias_cuota_industrial": [],
                    "gravamenes_aplicables": "No aplica"
                }
            }
        },

        "11302": { # O'Higgins
            "salud_diferenciada": {
                "atencion_primaria_aps": {
                    "total_establecimientos_aps": 3,
                    "cesfam_total": 0,
                    "cesfam_nombres": [],
                    "cecosf_total": 0,
                    "cecosf_nombres": [],
                    "postas_salud_rural_total": 1,
                    "postas_salud_rural_nombres": [
                        "Posta de Salud Rural Villa O'Higgins (Atencion Primaria Extrema)"
                    ],
                    "estaciones_medico_rurales_total": 2,
                    "estaciones_medico_rurales_nombres": [
                        "EMR Candelario Mancilla (Frontera Lago O'Higgins)",
                        "EMR Entrada Mayer"
                    ],
                    "rondas_medicas_frecuencia_y_equipo": "Ronda mensual lacustre a Candelario Mancilla y terrestre a Mayer; equipo permanente de 1 Medico General de Zona (EDF), 1 enfermera y 2 TENS residentes en la posta",
                    "prestaciones_preventivas": [
                        "Control Nino Sano",
                        "Programa Cardiovascular PSCV",
                        "Inmunizaciones PNI",
                        "EMPAM",
                        "Urgencias y Triage 24/7"
                    ]
                },
                "red_hospitalaria": {
                    "establecimiento_hospitalario": "Sin hospital en la comuna (Posta Rural de Aislamiento Extremo)",
                    "nivel_complejidad": "Derivacion Hospitalaria Externa de Aislamiento Extremo",
                    "camas_totales": 0,
                    "camas_criticas_uci_uti": {
                        "uci_adultos": 0,
                        "uti_adultos": 0,
                        "uti_pediatrica": 0,
                        "neonatologia": 0
                    },
                    "quirofanos_totales": 0,
                    "quirofanos_detalle": "0 quirofanos (atencion de emergencias vitales y estabilizacion)",
                    "servicios_apoyo_diagnostico": [
                        "Box de Reanimacion con desfibrilador DEA y telemedicina",
                        "Electrocardiografo digital",
                        "Generador electrico autonomo de respaldo",
                        "Ambulancia 4x4 institucional",
                        "Aerodromo Villa O'Higgins (SCOH) para puente aereo"
                    ],
                    "protocolo_derivacion": "Derivacion de extrema complejidad territorial. Distancia a Coyhaique: 560 km (12.0 h de viaje terrestre continuo incluyendo cruce obligatorio de barcaza en fiordo Mitchell / Puerto Yungay). Primera referencia hospitalaria: Hospital Comunitario de Cochrane (230 km, 5.0 h). Casos de gravedad y emergencias quirurgicas se resuelven exclusivamente mediante aeroevacuacion con avion bimotor SAMU/FACH desde aerodromo Villa O'Higgins."
                }
            },
            "educacion_diferenciada_slep": {
                "escuelas_rurales_multigrado_unidocentes_total": 1,
                "escuelas_rurales_multigrado_unidocentes_nombres": [
                    "Escuela Rural Fronteriza Pioneros del Sur (Ciclo Basico)"
                ],
                "liceos_urbanos_hc_tp_total": 1,
                "liceos_urbanos_hc_tp_nombres": [
                    "Liceo Pioneros del Sur (Ensenanza Media Humanista-Cientifica)"
                ],
                "jardines_junji_integra_total": 1,
                "jardines_junji_integra_nombres": [
                    "Jardin Infantil Hielito Azul (JUNJI Villa O'Higgins)"
                ]
            },
            "energia_diferenciada": {
                "clasificacion_sistema": "Sistema Aislado Municipal Extremo",
                "subsistema_nombre": "Sistema Aislado Villa O'Higgins",
                "operador_distribucion": "Ilustre Municipalidad de O'Higgins",
                "horas_suministro_diarias": 24,
                "subsidios_operacion": "Subsidio de Generacion Aislada FNDR / GORE Aysen para abastecimiento diesel y mantencion turbina hidraulica",
                "potencia_instalada_mw": 1.4,
                "desglose_tecnologia_mw": {
                    "hidroelectrica": 0.6,
                    "eolica": 0.0,
                    "diesel": 0.8,
                    "solar": 0.0
                },
                "desglose_tecnologia_pct": {
                    "hidroelectrica": 42.9,
                    "eolica": 0.0,
                    "diesel": 57.1,
                    "solar": 0.0
                }
            },
            "economia_sii_y_pesca": {
                "sii_empresas_tamano": {
                    "total_empresas": 78,
                    "microempresa_n": 69,
                    "microempresa_pct": 88.5,
                    "pequena_empresa_n": 8,
                    "pequena_empresa_pct": 10.3,
                    "mediana_empresa_n": 1,
                    "mediana_empresa_pct": 1.3,
                    "grande_empresa_n": 0,
                    "grande_empresa_pct": 0.0
                },
                "pesca_artesanal": {
                    "caletas_oficiales_total": 0,
                    "caletas_nombres": [],
                    "pesquerias_artesanales_principales": "Sin actividad maritima; servicios de navegacion lacustre en Lago O'Higgins y guiado de pesca deportiva de truchas",
                    "especies_objetivo": [],
                    "artes_de_pesca": []
                },
                "pesca_industrial": {
                    "presencia_plantas_o_flota": "Nula",
                    "titulares_ltp_o_plantas": [],
                    "pesquerias_cuota_industrial": [],
                    "gravamenes_aplicables": "No aplica"
                }
            }
        },

        "11303": { # Tortel
            "salud_diferenciada": {
                "atencion_primaria_aps": {
                    "total_establecimientos_aps": 3,
                    "cesfam_total": 0,
                    "cesfam_nombres": [],
                    "cecosf_total": 0,
                    "cecosf_nombres": [],
                    "postas_salud_rural_total": 1,
                    "postas_salud_rural_nombres": [
                        "Posta de Salud Rural Caleta Tortel (Atencion Primaria Costera-Fluvial)"
                    ],
                    "estaciones_medico_rurales_total": 2,
                    "estaciones_medico_rurales_nombres": [
                        "EMR Rio Bravo",
                        "EMR Caleta Tortel Playa"
                    ],
                    "rondas_medicas_frecuencia_y_equipo": "Rondas fluviales mensuales por lancha municipal hacia Rio Bravo y desembocadura Baker; TENS permanente en Posta Tortel y visitas programadas de medico EDF desde Cochrane",
                    "prestaciones_preventivas": [
                        "Atencion de Emergencias Primarias",
                        "Control Nino Sano",
                        "Programa Cardiovascular PSCV",
                        "Vacunatorio PNI",
                        "EMPAM",
                        "Entrega de Farmacos y Alimentos"
                    ]
                },
                "red_hospitalaria": {
                    "establecimiento_hospitalario": "Sin hospital en la comuna (Posta Rural de Dificil Acceso en Pasarelas)",
                    "nivel_complejidad": "Derivacion Hospitalaria Externa Costera-Fluvial",
                    "camas_totales": 0,
                    "camas_criticas_uci_uti": {
                        "uci_adultos": 0,
                        "uti_adultos": 0,
                        "uti_pediatrica": 0,
                        "neonatologia": 0
                    },
                    "quirofanos_totales": 0,
                    "quirofanos_detalle": "0 quirofanos (atencion de urgencias basicas y soporte vital)",
                    "servicios_apoyo_diagnostico": [
                        "Box de Urgencia con DEA y monitoreo basico",
                        "Camilla de rescate en pasarelas peatonales",
                        "Lancha ambulancia de rescate fluvial-maritimo",
                        "Ambulancia 4x4 en estacionamiento terminal",
                        "Helipuerto Caleta Tortel habilitado para aeroevacuaciones"
                    ],
                    "protocolo_derivacion": "Derivacion compleja por topografia de pasarelas de cipres. Traslado de pacientes en camilla manual hasta vehiculo ambulancia o lancha. Hospital de derivacion primaria: Hospital Comunitario de Cochrane (128 km de ripio, 2.5 h); derivacion definitiva de alta complejidad: Hospital Regional Coyhaique (462 km, 9.0 h). Pacientes graves son evacuados por helicoptero FACH o avioneta SAMU."
                }
            },
            "educacion_diferenciada_slep": {
                "escuelas_rurales_multigrado_unidocentes_total": 1,
                "escuelas_rurales_multigrado_unidocentes_nombres": [
                    "Escuela Rural Comandante Luis Bravo Martinez (Ciclo Basico)"
                ],
                "liceos_urbanos_hc_tp_total": 1,
                "liceos_urbanos_hc_tp_nombres": [
                    "Liceo Luis Bravo Martinez (Ciclo Medio Tecnico y Humanista en Desarrollo)"
                ],
                "jardines_junji_integra_total": 1,
                "jardines_junji_integra_nombres": [
                    "Jardin Infantil Los Cipreses (Integra / Caleta Tortel)"
                ]
            },
            "energia_diferenciada": {
                "clasificacion_sistema": "Sistema Aislado Municipal - Fluvial",
                "subsistema_nombre": "Sistema Aislado Caleta Tortel",
                "operador_distribucion": "Ilustre Municipalidad de Tortel",
                "horas_suministro_diarias": 24,
                "subsidios_operacion": "Subsidio de Operacion de Sistemas Aislados GORE Aysen / Subdere (aprox. 195 millones CLP anuales para diesel y logistica)",
                "potencia_instalada_mw": 1.2,
                "desglose_tecnologia_mw": {
                    "hidroelectrica": 0.1,
                    "eolica": 0.0,
                    "diesel": 1.1,
                    "solar": 0.0
                },
                "desglose_tecnologia_pct": {
                    "hidroelectrica": 8.3,
                    "eolica": 0.0,
                    "diesel": 91.7,
                    "solar": 0.0
                }
            },
            "economia_sii_y_pesca": {
                "sii_empresas_tamano": {
                    "total_empresas": 68,
                    "microempresa_n": 61,
                    "microempresa_pct": 89.7,
                    "pequena_empresa_n": 6,
                    "pequena_empresa_pct": 8.8,
                    "mediana_empresa_n": 1,
                    "mediana_empresa_pct": 1.5,
                    "grande_empresa_n": 0,
                    "grande_empresa_pct": 0.0
                },
                "pesca_artesanal": {
                    "caletas_oficiales_total": 1,
                    "caletas_nombres": [
                        "Caleta Pesquera Caleta Tortel"
                    ],
                    "pesquerias_artesanales_principales": "Pesca artesanal austral demersal en fiordos y canales del Golfo de Penas; captura de centolla y robalo",
                    "especies_objetivo": [
                        "Centolla (Lithodes santolla)",
                        "Merluza del sur (Merluccius australis)",
                        "Robalo (Eleginops maclovinus)",
                        "Congrio dorado"
                    ],
                    "artes_de_pesca": [
                        "Trampas artesanales centolleras",
                        "Espinel y lienza",
                        "Botes a motor fuera de borda"
                    ]
                },
                "pesca_industrial": {
                    "presencia_plantas_o_flota": "Fondeo y refugio temporal de buques factoria en aguas protegidas ante temporales del Golfo de Penas; sin instalaciones fabriles en tierra",
                    "titulares_ltp_o_plantas": ["Flota industrial en transito hacia aguas exteriores de Magallanes"],
                    "pesquerias_cuota_industrial": ["Merluza del sur y merluza de tres aletas en exterior"],
                    "gravamenes_aplicables": "No aplica a nivel municipal"
                }
            }
        }
    }

    # Asignar a por_comuna e inyectar series historicas anuales 2015-2026
    por_comuna = []
    for c in COMUNAS:
        ine = c["comuna_ine"]
        comuna_entry = dict(c)
        comuna_datos = dict(datos_comunales[ine])
        
        # Inyectar series historicas anuales
        series_comuna = []
        c_series = SERIES_HISTORICAS_COMUNALES.get(ine, {})
        for idx, y in enumerate(ANIO_LIST):
            item = {
                "anio": y,
                "salud": {
                    "aps_consultas_medicas": c_series["salud"]["aps_consultas_medicas"][idx],
                    "aps_urgencias_atenciones": c_series["salud"]["aps_urgencias_atenciones"][idx],
                    "aps_rondas_rurales": c_series["salud"]["aps_rondas_rurales"][idx],
                    "hosp_egresos": c_series["salud"]["hosp_egresos"][idx],
                    "hosp_intervenciones_quirurgicas": c_series["salud"]["hosp_intervenciones_quirurgicas"][idx],
                    "hosp_consultas_especialidad": c_series["salud"]["hosp_consultas_especialidad"][idx],
                    "hosp_urgencias": c_series["salud"]["hosp_urgencias"][idx]
                },
                "educacion": {
                    "matricula_rural_multigrado": c_series["educacion"]["matricula_rural_multigrado"][idx],
                    "escuelas_rurales_activas": c_series["educacion"]["escuelas_rurales_activas"][idx],
                    "matricula_urbana_liceos": c_series["educacion"]["matricula_urbana_liceos"][idx],
                    "matricula_tecnico_profesional": c_series["educacion"]["matricula_tecnico_profesional"][idx],
                    "matricula_parvularia_junji_integra": c_series["educacion"]["matricula_parvularia_junji_integra"][idx]
                },
                "energia": {
                    "generacion_mwh": c_series["energia"]["generacion_mwh"][idx],
                    "subsidio_operacion_mclp": c_series["energia"]["subsidio_operacion_mclp"][idx]
                },
                "economia_pesca": {
                    "empresas_sii": c_series["economia_pesca"]["empresas_sii"][idx],
                    "desembarque_artesanal_ton": c_series["economia_pesca"]["desembarque_artesanal_ton"][idx],
                    "desembarque_industrial_ton": c_series["economia_pesca"]["desembarque_industrial_ton"][idx]
                }
            }
            series_comuna.append(item)
            
        comuna_datos["series_historicas"] = series_comuna
        comuna_entry["datos"] = comuna_datos
        por_comuna.append(comuna_entry)

    # 2. Resumen Regional y agregacion de series historicas regionales 2015-2026
    series_regionales = []
    for idx, y in enumerate(ANIO_LIST):
        reg_item = {
            "anio": y,
            "salud_regional": {
                "aps_consultas_medicas_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["salud"]["aps_consultas_medicas"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "aps_urgencias_atenciones_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["salud"]["aps_urgencias_atenciones"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "aps_rondas_rurales_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["salud"]["aps_rondas_rurales"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "hosp_egresos_red_ssa": sum(SERIES_HISTORICAS_COMUNALES[ine]["salud"]["hosp_egresos"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "hosp_intervenciones_quirurgicas_red": sum(SERIES_HISTORICAS_COMUNALES[ine]["salud"]["hosp_intervenciones_quirurgicas"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "hosp_consultas_especialidad_red": sum(SERIES_HISTORICAS_COMUNALES[ine]["salud"]["hosp_consultas_especialidad"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "hosp_urgencias_red": sum(SERIES_HISTORICAS_COMUNALES[ine]["salud"]["hosp_urgencias"][idx] for ine in SERIES_HISTORICAS_COMUNALES)
            },
            "educacion_regional": {
                "matricula_rural_multigrado_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["educacion"]["matricula_rural_multigrado"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "escuelas_rurales_multigrado_activas": sum(SERIES_HISTORICAS_COMUNALES[ine]["educacion"]["escuelas_rurales_activas"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "matricula_urbana_liceos_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["educacion"]["matricula_urbana_liceos"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "matricula_tecnico_profesional_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["educacion"]["matricula_tecnico_profesional"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "matricula_parvularia_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["educacion"]["matricula_parvularia_junji_integra"][idx] for ine in SERIES_HISTORICAS_COMUNALES)
            },
            "energia_regional": {
                "generacion_mwh_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["energia"]["generacion_mwh"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "subsidios_operacion_mclp_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["energia"]["subsidio_operacion_mclp"][idx] for ine in SERIES_HISTORICAS_COMUNALES)
            },
            "economia_pesca_regional": {
                "empresas_sii_activas_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["economia_pesca"]["empresas_sii"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "desembarque_artesanal_ton_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["economia_pesca"]["desembarque_artesanal_ton"][idx] for ine in SERIES_HISTORICAS_COMUNALES),
                "desembarque_industrial_ton_total": sum(SERIES_HISTORICAS_COMUNALES[ine]["economia_pesca"]["desembarque_industrial_ton"][idx] for ine in SERIES_HISTORICAS_COMUNALES)
            }
        }
        series_regionales.append(reg_item)

    resumen_regional = {
        "region_codigo": "CL-XI",
        "series_historicas_regionales": series_regionales,
        "region_nombre": "Aysen del General Carlos Ibanez del Campo",
        "salud_resumen": {
            "total_camas_hospitalarias_red_ssa": 261,
            "distribucion_camas_por_hospital": {
                "Hospital Regional Coyhaique": 167,
                "Hospital de Puerto Aysen": 52,
                "Hospital Comunitario de Cochrane": 16,
                "Hospital Familiar y Comunitario San Jose de Chile Chico": 14,
                "Hospital Comunitario Dr. Jorge Ibar de Puerto Cisnes": 12
            },
            "hospitales_alta_complejidad": 1,
            "hospitales_comunitarios_baja_complejidad": 4,
            "total_cesfam_urbanos": 2,
            "total_cecosf": 3,
            "total_postas_salud_rural_psr": 28,
            "total_estaciones_medico_rurales_emr": 20,
            "camas_criticas_uci_uti_regionales": 22,
            "quirofanos_totales_red": 7
        },
        "educacion_resumen": {
            "slep_responsable": "Servicio Local de Educacion Publica (SLEP) Aysen",
            "escuelas_rurales_multigrado_unidocentes_total": 36,
            "liceos_urbanos_hc_tp_total": 16,
            "jardines_infantiles_junji_integra_total": 47,
            "presencia_internados_estudiantiles": "Red de internados en cabeceras comunales para garantizar escolaridad a ninos de zonas rurales aisladas"
        },
        "energia_resumen": {
            "sistemas_medianos_regulados": [
                "Sistema Mediano de Aysen (SMA) - Edelaysen",
                "Sistema Mediano General Carrera (SMGC) - Edelaysen",
                "Sistema Mediano Palena-Cisnes - Edelaysen"
            ],
            "sistemas_aislados_municipales": [
                "Sistema Aislado Melinka (Guaitecas)",
                "Sistema Aislado Puerto Aguirre (Islas Huichas)",
                "Sistema Aislado Caleta Tortel",
                "Sistema Aislado Villa O'Higgins"
            ],
            "matriz_generacion_regional_total_mw": 95.9,
            "porcentaje_hidroelectrico_regional": 21.3,
            "porcentaje_eolica_regional": 3.3,
            "porcentaje_diesel_regional": 75.3,
            "porcentaje_solar_regional": 0.1,
            "horas_promedio_suministro": "24 horas continuas en todas las cabeceras comunales; alta dependencia de subsidio FNDR al combustible en micro-redes"
        },
        "economia_y_pesca_resumen": {
            "total_empresas_sii_vigentes": 9365,
            "desglose_regional_por_tamano": {
                "microempresa_n": 6992,
                "microempresa_pct": 74.7,
                "pequena_empresa_n": 1928,
                "pequena_empresa_pct": 20.6,
                "mediana_empresa_n": 372,
                "mediana_empresa_pct": 4.0,
                "grande_empresa_n": 73,
                "grande_empresa_pct": 0.8
            },
            "caletas_pesqueras_artesanales_oficiales": 9,
            "pesquerias_artesanales_clave": "Erizo rojo, almeja, merluza del sur, congrio dorado, centolla y luga roja",
            "pesquerias_industriales_clave": "Merluza del sur (37% fraccion industrial Ley 21.752), congrio dorado, merluza de cola y merluza de tres aletas",
            "principales_titulares_industriales_base_aysen": [
                "Pesquera Friosur S.A. (Planta Puerto Chacabuco)",
                "Deris S.A.",
                "Emdepes S.A.",
                "Globalpesca SpA"
            ],
            "regimen_tributario_pesquero": "Impuesto Especifico Art. 43 ter LGPA (LTP-A) + Patente Unica Pesquera Art. 43 LGPA"
        }
    }

    # 3. Nodos Georreferenciados (Hospitales, CESFAM, CECOSF, Caletas, Centrales electricas, Liceos emblemáticos)
    nodos = [
        # Hospitales y APS Emblemáticos
        {
            "id": "nodo-hosp-regional-coyhaique",
            "nombre": "Hospital Regional Coyhaique",
            "tipo": "Hospital de Alta Complejidad",
            "codigo_comuna": "CL-XI-01",
            "comuna_ine": "11101",
            "lat": -45.5714,
            "lng": -72.0635,
            "atributos": {
                "camas": 167,
                "quirofanos": 5,
                "uci_uti": True,
                "nivel": "Alta Complejidad",
                "dependencia": "Servicio de Salud Aysen"
            },
            "source_url": "https://www.saludaysen.cl"
        },
        {
            "id": "nodo-hosp-puerto-aysen",
            "nombre": "Hospital de Puerto Aysen",
            "tipo": "Hospital Comunitario de Mediana Complejidad",
            "codigo_comuna": "CL-XI-03",
            "comuna_ine": "11201",
            "lat": -45.4058,
            "lng": -72.6892,
            "atributos": {
                "camas": 52,
                "quirofanos": 2,
                "uci_uti": False,
                "nivel": "Mediana Complejidad",
                "dependencia": "Servicio de Salud Aysen"
            },
            "source_url": "https://www.saludaysen.cl"
        },
        {
            "id": "nodo-hosp-puerto-cisnes",
            "nombre": "Hospital Comunitario Dr. Jorge Ibar Bruce",
            "tipo": "Hospital Comunitario de Baja Complejidad",
            "codigo_comuna": "CL-XI-04",
            "comuna_ine": "11202",
            "lat": -44.7450,
            "lng": -72.6965,
            "atributos": {
                "camas": 12,
                "quirofanos": 0,
                "uci_uti": False,
                "nivel": "Baja Complejidad",
                "dependencia": "Servicio de Salud Aysen"
            },
            "source_url": "https://www.saludaysen.cl"
        },
        {
            "id": "nodo-hosp-chile-chico",
            "nombre": "Hospital Familiar y Comunitario San Jose de Chile Chico",
            "tipo": "Hospital Comunitario de Baja Complejidad",
            "codigo_comuna": "CL-XI-06",
            "comuna_ine": "11401",
            "lat": -46.5412,
            "lng": -71.7289,
            "atributos": {
                "camas": 14,
                "quirofanos": 0,
                "uci_uti": False,
                "nivel": "Baja Complejidad",
                "dependencia": "Servicio de Salud Aysen"
            },
            "source_url": "https://www.saludaysen.cl"
        },
        {
            "id": "nodo-hosp-cochrane",
            "nombre": "Hospital Comunitario Lord Cochrane",
            "tipo": "Hospital Comunitario de Baja Complejidad",
            "codigo_comuna": "CL-XI-08",
            "comuna_ine": "11301",
            "lat": -47.2558,
            "lng": -72.5698,
            "atributos": {
                "camas": 16,
                "quirofanos": 0,
                "uci_uti": False,
                "nivel": "Baja Complejidad",
                "dependencia": "Servicio de Salud Aysen"
            },
            "source_url": "https://www.saludaysen.cl"
        },
        {
            "id": "nodo-cesfam-victor-domingo-silva",
            "nombre": "CESFAM Victor Domingo Silva",
            "tipo": "Centro de Salud Familiar Urbano",
            "codigo_comuna": "CL-XI-01",
            "comuna_ine": "11101",
            "lat": -45.5802,
            "lng": -72.0594,
            "atributos": {
                "camas": 0,
                "atencion": "Atencion Primaria Urbana",
                "inscritos": 32000
            },
            "source_url": "https://www.saludaysen.cl"
        },
        {
            "id": "nodo-cesfam-alejandro-gutierrez",
            "nombre": "CESFAM Alejandro Gutierrez",
            "tipo": "Centro de Salud Familiar Urbano",
            "codigo_comuna": "CL-XI-01",
            "comuna_ine": "11101",
            "lat": -45.5645,
            "lng": -72.0728,
            "atributos": {
                "camas": 0,
                "atencion": "Atencion Primaria Urbana",
                "inscritos": 26000
            },
            "source_url": "https://www.saludaysen.cl"
        },
        {
            "id": "nodo-cecosf-ribera-sur",
            "nombre": "CECOSF Ribera Sur",
            "tipo": "Centro Comunitario de Salud Familiar",
            "codigo_comuna": "CL-XI-03",
            "comuna_ine": "11201",
            "lat": -45.4112,
            "lng": -72.6935,
            "atributos": {
                "camas": 0,
                "tipo_recinto": "CECOSF",
                "dependencia": "Hospital de Puerto Aysen"
            },
            "source_url": "https://www.saludaysen.cl"
        },
        {
            "id": "nodo-cesfam-melinka",
            "nombre": "CESFAM Melinka",
            "tipo": "Centro de Salud Familiar Insular con SUR",
            "codigo_comuna": "CL-XI-05",
            "comuna_ine": "11203",
            "lat": -43.8950,
            "lng": -73.7480,
            "atributos": {
                "camas": 0,
                "urgencia_24h": True,
                "tipo_recinto": "CESFAM Insular"
            },
            "source_url": "https://www.saludaysen.cl"
        },

        # Caletas Pesqueras Artesanales
        {
            "id": "nodo-caleta-melinka",
            "nombre": "Caleta Pesquera Melinka",
            "tipo": "Caleta Pesquera Artesanal",
            "codigo_comuna": "CL-XI-05",
            "comuna_ine": "11203",
            "lat": -43.8980,
            "lng": -73.7450,
            "atributos": {
                "tipo_pesca": "Bentonica y Demersal",
                "recursos_clave": "Erizo, Almeja, Luga, Merluza",
                "pescadores_rpa": 450
            },
            "source_url": "https://www.sernapesca.cl"
        },
        {
            "id": "nodo-caleta-puerto-chacabuco",
            "nombre": "Caleta de Pescadores Puerto Chacabuco",
            "tipo": "Caleta Pesquera Artesanal",
            "codigo_comuna": "CL-XI-03",
            "comuna_ine": "11201",
            "lat": -45.4628,
            "lng": -72.8285,
            "atributos": {
                "tipo_pesca": "Demersal y Bentonica",
                "recursos_clave": "Merluza del sur, Congrio dorado",
                "pescadores_rpa": 280
            },
            "source_url": "https://www.sernapesca.cl"
        },
        {
            "id": "nodo-caleta-puerto-aguirre",
            "nombre": "Caleta Puerto Aguirre (Islas Huichas)",
            "tipo": "Caleta Pesquera Artesanal",
            "codigo_comuna": "CL-XI-03",
            "comuna_ine": "11201",
            "lat": -45.1630,
            "lng": -73.5220,
            "atributos": {
                "tipo_pesca": "Demersal y Bentonica",
                "recursos_clave": "Merluza, Erizo, Almeja",
                "pescadores_rpa": 210
            },
            "source_url": "https://www.sernapesca.cl"
        },
        {
            "id": "nodo-caleta-puerto-cisnes",
            "nombre": "Caleta de Pescadores Puerto Cisnes",
            "tipo": "Caleta Pesquera Artesanal",
            "codigo_comuna": "CL-XI-04",
            "comuna_ine": "11202",
            "lat": -44.7410,
            "lng": -72.7020,
            "atributos": {
                "tipo_pesca": "Demersal y Centollera",
                "recursos_clave": "Merluza austral, Centolla",
                "pescadores_rpa": 120
            },
            "source_url": "https://www.sernapesca.cl"
        },
        {
            "id": "nodo-caleta-puerto-gala",
            "nombre": "Caleta Puerto Gala (Isla Toto)",
            "tipo": "Caleta Pesquera Artesanal",
            "codigo_comuna": "CL-XI-04",
            "comuna_ine": "11202",
            "lat": -44.2810,
            "lng": -73.1950,
            "atributos": {
                "tipo_pesca": "Demersal Fuerte",
                "recursos_clave": "Merluza del sur, Congrio dorado",
                "pescadores_rpa": 95
            },
            "source_url": "https://www.sernapesca.cl"
        },
        {
            "id": "nodo-caleta-tortel",
            "nombre": "Caleta Pesquera Caleta Tortel",
            "tipo": "Caleta Pesquera Artesanal",
            "codigo_comuna": "CL-XI-10",
            "comuna_ine": "11303",
            "lat": -47.7940,
            "lng": -73.5340,
            "atributos": {
                "tipo_pesca": "Demersal y Centollera Austral",
                "recursos_clave": "Centolla, Merluza, Robalo",
                "pescadores_rpa": 45
            },
            "source_url": "https://www.sernapesca.cl"
        },

        # Centrales e Infraestructura Energetica Clave
        {
            "id": "nodo-planta-friosur-chacabuco",
            "nombre": "Planta Industrial Pesquera Friosur S.A.",
            "tipo": "Planta Procesadora de Pesca Industrial",
            "codigo_comuna": "CL-XI-03",
            "comuna_ine": "11201",
            "lat": -45.4650,
            "lng": -72.8250,
            "atributos": {
                "rubro": "Pesca Industrial y Congelado",
                "especies_procesadas": "Merluza del sur, Congrio, Merluza de cola",
                "titular_ltp": "Pesquera Friosur S.A."
            },
            "source_url": "https://www.friosur.cl"
        },
        {
            "id": "nodo-central-tehuelche",
            "nombre": "Central Termica Tehuelche (Coyhaique)",
            "tipo": "Central Termica Diesel de Respaldo",
            "codigo_comuna": "CL-XI-01",
            "comuna_ine": "11101",
            "lat": -45.5780,
            "lng": -72.0620,
            "atributos": {
                "potencia_mw": 19.8,
                "sistema": "Sistema Mediano de Aysen (SMA)",
                "operador": "Edelaysen S.A."
            },
            "source_url": "https://www.cne.cl"
        },
        {
            "id": "nodo-central-chacabuco",
            "nombre": "Central Termica Chacabuco",
            "tipo": "Central Termica Diesel de Base",
            "codigo_comuna": "CL-XI-03",
            "comuna_ine": "11201",
            "lat": -45.4610,
            "lng": -72.8220,
            "atributos": {
                "potencia_mw": 23.5,
                "sistema": "Sistema Mediano de Aysen (SMA)",
                "operador": "Edelaysen S.A."
            },
            "source_url": "https://www.cne.cl"
        },
        {
            "id": "nodo-central-los-maquis",
            "nombre": "Central Hidroelectrica Los Maquis",
            "tipo": "Central Hidroelectrica de Pasada",
            "codigo_comuna": "CL-XI-06",
            "comuna_ine": "11401",
            "lat": -46.7020,
            "lng": -72.8710,
            "atributos": {
                "potencia_mw": 1.0,
                "sistema": "Sistema Mediano General Carrera (SMGC)",
                "operador": "Edelaysen S.A."
            },
            "source_url": "https://www.cne.cl"
        },
        {
            "id": "nodo-central-rio-mosco",
            "nombre": "Central Hidroelectrica Rio Mosco (Villa O'Higgins)",
            "tipo": "Central Hidroelectrica de Pasada Aislada",
            "codigo_comuna": "CL-XI-09",
            "comuna_ine": "11302",
            "lat": -48.4680,
            "lng": -72.5580,
            "atributos": {
                "potencia_mw": 0.6,
                "sistema": "Sistema Aislado Villa O'Higgins",
                "operador": "Ilustre Municipalidad de O'Higgins"
            },
            "source_url": "https://www.cne.cl"
        },
        {
            "id": "nodo-central-tortel",
            "nombre": "Central Generacion Diesel Caleta Tortel",
            "tipo": "Central Termica Diesel Aislada",
            "codigo_comuna": "CL-XI-10",
            "comuna_ine": "11303",
            "lat": -47.7960,
            "lng": -73.5330,
            "atributos": {
                "potencia_mw": 1.1,
                "sistema": "Sistema Aislado Caleta Tortel",
                "operador": "Ilustre Municipalidad de Tortel"
            },
            "source_url": "https://www.cne.cl"
        }
    ]

    dataset = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "version": "1.0.0",
        "work_package": "WP_08",
        "dataset_id": "08_desagregaciones_sectoriales_aysen",
        "titulo": "Desagregaciones Sectoriales Criticas de Aysen: Salud APS vs Hospitales, Educacion Rural vs Urbana SLEP, Sistemas Electricos Medianos vs Aislados, Estructura SII y Pesca Artesanal vs Industrial",
        "region": "CL-XI (Aysen del General Carlos Ibanez del Campo)",
        "fecha_extraccion": "2026-10-17",
        "fuentes_primarias": [
            "Servicio de Salud Aysen (SSA) / DEIS Ministerio de Salud - Red Asistencial y Establecimientos de Salud 2024",
            "Servicio Local de Educacion Publica (SLEP) Aysen / Datos Abiertos MINEDUC 2024",
            "Comision Nacional de Energia (CNE) / Resolucion Exenta Fijacion Tarifaria Sistemas Medianos y Aislados",
            "Servicio de Impuestos Internos (SII) - Estadisticas Tributarias de Empresas por Tamano y Comuna",
            "Subsecretaria de Pesca y Acuicultura (SUBPESCA) / SERNAPESCA - Registro Pesquero Artesanal y Licencias Transables de Pesca LTP Ley 21.752"
        ],
        "resumen_regional": resumen_regional,
        "por_comuna": por_comuna,
        "nodos_georreferenciados": nodos
    }

    return dataset


def build_csv_rows(dataset):
    rows = []
    for c in dataset["por_comuna"]:
        codigo_comuna = c["codigo_comuna"]
        comuna_ine = c["comuna_ine"]
        nombre_comuna = c["nombre_comuna"]
        provincia = c["provincia"]
        cabecera = c["cabecera"]
        lat = c["lat"]
        lng = c["lng"]
        d = c["datos"]

        salud = d["salud_diferenciada"]
        aps = salud["atencion_primaria_aps"]
        hosp = salud["red_hospitalaria"]

        educ = d["educacion_diferenciada_slep"]
        energ = d["energia_diferenciada"]
        econ = d["economia_sii_y_pesca"]
        sii = econ["sii_empresas_tamano"]
        pesca_art = econ["pesca_artesanal"]
        pesca_ind = econ["pesca_industrial"]

        row = {
            "codigo_comuna": codigo_comuna,
            "comuna_ine": comuna_ine,
            "nombre_comuna": nombre_comuna,
            "provincia": provincia,
            "cabecera": cabecera,
            "lat": lat,
            "lng": lng,
            # Salud APS
            "aps_total_establecimientos": aps["total_establecimientos_aps"],
            "aps_cesfam_total": aps["cesfam_total"],
            "aps_cesfam_nombres": " | ".join(aps["cesfam_nombres"]),
            "aps_cecosf_total": aps["cecosf_total"],
            "aps_cecosf_nombres": " | ".join(aps["cecosf_nombres"]),
            "aps_postas_salud_rural_total": aps["postas_salud_rural_total"],
            "aps_postas_salud_rural_nombres": " | ".join(aps["postas_salud_rural_nombres"]),
            "aps_estaciones_medico_rurales_total": aps["estaciones_medico_rurales_total"],
            "aps_estaciones_medico_rurales_nombres": " | ".join(aps["estaciones_medico_rurales_nombres"]),
            "aps_rondas_medicas_frecuencia": aps["rondas_medicas_frecuencia_y_equipo"],
            "aps_prestaciones_preventivas": " | ".join(aps["prestaciones_preventivas"]),
            # Red Hospitalaria SSA
            "hospital_nombre": hosp["establecimiento_hospitalario"],
            "hospital_nivel_complejidad": hosp["nivel_complejidad"],
            "hospital_camas_totales": hosp["camas_totales"],
            "hospital_camas_uci_uti": hosp["camas_criticas_uci_uti"]["uci_adultos"] + hosp["camas_criticas_uci_uti"]["uti_adultos"] + hosp["camas_criticas_uci_uti"]["uti_pediatrica"],
            "hospital_quirofanos_totales": hosp["quirofanos_totales"],
            "hospital_quirofanos_detalle": hosp["quirofanos_detalle"],
            "hospital_protocolo_derivacion": hosp["protocolo_derivacion"],
            # Educacion SLEP
            "educ_slep_escuelas_rurales_multigrado_total": educ["escuelas_rurales_multigrado_unidocentes_total"],
            "educ_slep_escuelas_rurales_nombres": " | ".join(educ["escuelas_rurales_multigrado_unidocentes_nombres"]),
            "educ_slep_liceos_urbanos_hc_tp_total": educ["liceos_urbanos_hc_tp_total"],
            "educ_slep_liceos_urbanos_nombres": " | ".join(educ["liceos_urbanos_hc_tp_nombres"]),
            "educ_jardines_junji_integra_total": educ["jardines_junji_integra_total"],
            "educ_jardines_junji_integra_nombres": " | ".join(educ["jardines_junji_integra_nombres"]),
            # Energia
            "energia_clasificacion_sistema": energ["clasificacion_sistema"],
            "energia_subsistema_nombre": energ["subsistema_nombre"],
            "energia_operador_distribucion": energ["operador_distribucion"],
            "energia_horas_suministro_diarias": energ["horas_suministro_diarias"],
            "energia_subsidios_operacion": energ["subsidios_operacion"],
            "energia_potencia_instalada_mw": energ["potencia_instalada_mw"],
            "energia_pct_hidroelectrica": energ["desglose_tecnologia_pct"]["hidroelectrica"],
            "energia_pct_eolica": energ["desglose_tecnologia_pct"]["eolica"],
            "energia_pct_diesel": energ["desglose_tecnologia_pct"]["diesel"],
            "energia_pct_solar": energ["desglose_tecnologia_pct"]["solar"],
            # Economia SII
            "sii_empresas_activas_total": sii["total_empresas"],
            "sii_microempresas_n": sii["microempresa_n"],
            "sii_microempresas_pct": sii["microempresa_pct"],
            "sii_pequenas_empresas_n": sii["pequena_empresa_n"],
            "sii_pequenas_empresas_pct": sii["pequena_empresa_pct"],
            "sii_medianas_empresas_n": sii["mediana_empresa_n"],
            "sii_medianas_empresas_pct": sii["mediana_empresa_pct"],
            "sii_grandes_empresas_n": sii["grande_empresa_n"],
            "sii_grandes_empresas_pct": sii["grande_empresa_pct"],
            # Pesca Artesanal vs Industrial
            "pesca_artesanal_caletas_total": pesca_art["caletas_oficiales_total"],
            "pesca_artesanal_caletas_nombres": " | ".join(pesca_art["caletas_nombres"]),
            "pesca_artesanal_pesquerias_clave": pesca_art["pesquerias_artesanales_principales"],
            "pesca_artesanal_especies_objetivo": " | ".join(pesca_art["especies_objetivo"]),
            "pesca_industrial_presencia": pesca_ind["pesencia_plantas_o_flota"] if "pesencia_plantas_o_flota" in pesca_ind else pesca_ind.get("presencia_plantas_o_flota", ""),
            "pesca_industrial_titulares_ltp_plantas": " | ".join(pesca_ind["titulares_ltp_o_plantas"]),
            "pesca_industrial_pesquerias_cuota": " | ".join(pesca_ind["pesquerias_cuota_industrial"]),
            "pesca_industrial_gravamenes_aplicables": pesca_ind["gravamenes_aplicables"],
            # Metricas consolidadas serie historica (ano referencia 2024)
            "aps_consultas_medicas_2024": d.get("series_historicas", [{}])[-3].get("salud", {}).get("aps_consultas_medicas", 0) if "series_historicas" in d else 0,
            "aps_urgencias_2024": d.get("series_historicas", [{}])[-3].get("salud", {}).get("aps_urgencias_atenciones", 0) if "series_historicas" in d else 0,
            "aps_rondas_rurales_2024": d.get("series_historicas", [{}])[-3].get("salud", {}).get("aps_rondas_rurales", 0) if "series_historicas" in d else 0,
            "hosp_egresos_2024": d.get("series_historicas", [{}])[-3].get("salud", {}).get("hosp_egresos", 0) if "series_historicas" in d else 0,
            "hosp_cirugias_2024": d.get("series_historicas", [{}])[-3].get("salud", {}).get("hosp_intervenciones_quirurgicas", 0) if "series_historicas" in d else 0,
            "hosp_consultas_especialidad_2024": d.get("series_historicas", [{}])[-3].get("salud", {}).get("hosp_consultas_especialidad", 0) if "series_historicas" in d else 0,
            "hosp_urgencias_2024": d.get("series_historicas", [{}])[-3].get("salud", {}).get("hosp_urgencias", 0) if "series_historicas" in d else 0,
            "educ_matricula_rural_multigrado_2024": d.get("series_historicas", [{}])[-3].get("educacion", {}).get("matricula_rural_multigrado", 0) if "series_historicas" in d else 0,
            "educ_matricula_urbana_liceos_2024": d.get("series_historicas", [{}])[-3].get("educacion", {}).get("matricula_urbana_liceos", 0) if "series_historicas" in d else 0,
            "educ_matricula_tecnico_profesional_2024": d.get("series_historicas", [{}])[-3].get("educacion", {}).get("matricula_tecnico_profesional", 0) if "series_historicas" in d else 0,
            "educ_matricula_parvularia_2024": d.get("series_historicas", [{}])[-3].get("educacion", {}).get("matricula_parvularia_junji_integra", 0) if "series_historicas" in d else 0,
            "energia_generacion_mwh_2024": d.get("series_historicas", [{}])[-3].get("energia", {}).get("generacion_mwh", 0) if "series_historicas" in d else 0,
            "energia_subsidio_mclp_2024": d.get("series_historicas", [{}])[-3].get("energia", {}).get("subsidio_operacion_mclp", 0) if "series_historicas" in d else 0,
            "pesca_desembarque_artesanal_ton_2024": d.get("series_historicas", [{}])[-3].get("economia_pesca", {}).get("desembarque_artesanal_ton", 0) if "series_historicas" in d else 0,
            "pesca_desembarque_industrial_ton_2024": d.get("series_historicas", [{}])[-3].get("economia_pesca", {}).get("desembarque_industrial_ton", 0) if "series_historicas" in d else 0,
            "cobertura_serie_historica": "2015-2026 (12 anos)",
        }
        rows.append(row)
    return rows


def check_no_emojis(text: str) -> bool:
    # Busca caracteres emoji comunes o rangos Unicode suplementarios
    emoji_pattern = re.compile(
        "[\U00010000-\U0010ffff]|"
        "[\u2600-\u26ff]|"
        "[\u2700-\u27bf]|"
        "[\U0001f300-\U0001f5ff]|"
        "[\U0001f600-\U0001f64f]|"
        "[\U0001f680-\U0001f6ff]|"
        "[\U0001f900-\U0001f9ff]|"
        "[\U0001fa70-\U0001faff]"
    )
    return bool(emoji_pattern.search(text))


def main():
    print("Iniciando construccion de WP_08: Desagregaciones Sectoriales Aysen...")
    dataset = build_dataset()

    # Validacion de Nodos dentro del BBOX
    for n in dataset["nodos_georreferenciados"]:
        lat = n["lat"]
        lng = n["lng"]
        if not (BBOX_LAT_MIN <= lat <= BBOX_LAT_MAX):
            raise ValueError(f"Nodo fuera de BBOX Lat: {n['id']} ({lat})")
        if not (BBOX_LNG_MIN <= lng <= BBOX_LNG_MAX):
            raise ValueError(f"Nodo fuera de BBOX Lng: {n['id']} ({lng})")

    # Serializacion JSON
    json_str = json.dumps(dataset, indent=2, ensure_ascii=False)
    if check_no_emojis(json_str):
        raise ValueError("Error: Se detectaron emojis en el JSON generado!")

    # Escribir archivo JSON
    SYSTEMIC_DIR.mkdir(parents=True, exist_ok=True)
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        f.write(json_str)
    print(f"[OK] Archivo JSON guardado con exito: {JSON_FILE}")

    # Validacion de lectura JSON
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        loaded = json.load(f)
    assert len(loaded["por_comuna"]) == 10, "Deben haber exactamente 10 comunas"
    assert len(loaded["nodos_georreferenciados"]) >= 15, "Deben haber al menos 15 nodos"

    # Construccion CSV
    csv_rows = build_csv_rows(dataset)
    headers = list(csv_rows[0].keys())

    CSV_DIR.mkdir(parents=True, exist_ok=True)
    with open(CSV_FILE, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(csv_rows)
    print(f"[OK] Archivo CSV guardado con exito: {CSV_FILE}")

    # Validacion CSV
    with open(CSV_FILE, "rb") as f:
        bom = f.read(3)
        if bom != b"\xef\xbb\xbf":
            raise ValueError("Error: El archivo CSV no contiene UTF-8 BOM (\\uFEFF)!")

    with open(CSV_FILE, "r", encoding="utf-8-sig") as f:
        csv_content = f.read()
        if check_no_emojis(csv_content):
            raise ValueError("Error: Se detectaron emojis en el CSV generado!")

    print("[PASS] Validacion completa y exitosa:")
    print(f"  1. JSON valido y estructurado: {JSON_FILE} ({len(json_str)} bytes)")
    print(f"  2. CSV con UTF-8 BOM: {CSV_FILE} ({len(csv_content)} caracteres, 10 comunas)")
    print("  3. 0 emojis detectados.")
    print("  4. 100% de nodos dentro del BBOX de Aysen.")


if __name__ == "__main__":
    main()
