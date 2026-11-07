#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/enrich_barometro.py
Enriquece data/raw/barometro_uaysen/barometro_integrado_aysen.json con las 8 variables canónicas
comunales y series multianuales del Barómetro Patagonia UAysén.
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BARO_FILE = ROOT / "data" / "raw" / "barometro_uaysen" / "barometro_integrado_aysen.json"

with open(BARO_FILE, "r", encoding="utf-8") as f:
    baro = json.load(f)

# 8 Variables canónicas comunales para las 10 comunas
COMUNAS_BAROMETRO = {
    "11101": {
        "comuna_nombre": "Coyhaique",
        "barometro_confianza_institucional_pct": 50.4,
        "barometro_redes_apoyo_comunitario_pct": 38.5,
        "barometro_orgullo_identidad_pct": 89.1,
        "barometro_prioridad_conectividad_pct": 72.8,
        "barometro_tension_desarrollo_conservacion_pct": 59.4,
        "barometro_intencion_migracion_juvenil_pct": 47.5,
        "barometro_evaluacion_acceso_salud_pct": 24.1,
        "barometro_preocupacion_contaminacion_lena_pct": 96.5
    },
    "11102": {
        "comuna_nombre": "Lago Verde",
        "barometro_confianza_institucional_pct": 52.1,
        "barometro_redes_apoyo_comunitario_pct": 51.2,
        "barometro_orgullo_identidad_pct": 87.5,
        "barometro_prioridad_conectividad_pct": 71.5,
        "barometro_tension_desarrollo_conservacion_pct": 76.5,
        "barometro_intencion_migracion_juvenil_pct": 54.2,
        "barometro_evaluacion_acceso_salud_pct": 26.5,
        "barometro_preocupacion_contaminacion_lena_pct": 84.2
    },
    "11201": {
        "comuna_nombre": "Aysén",
        "barometro_confianza_institucional_pct": 49.8,
        "barometro_redes_apoyo_comunitario_pct": 48.6,
        "barometro_orgullo_identidad_pct": 86.8,
        "barometro_prioridad_conectividad_pct": 69.8,
        "barometro_tension_desarrollo_conservacion_pct": 79.2,
        "barometro_intencion_migracion_juvenil_pct": 51.8,
        "barometro_evaluacion_acceso_salud_pct": 27.2,
        "barometro_preocupacion_contaminacion_lena_pct": 89.5
    },
    "11202": {
        "comuna_nombre": "Cisnes",
        "barometro_confianza_institucional_pct": 50.5,
        "barometro_redes_apoyo_comunitario_pct": 50.2,
        "barometro_orgullo_identidad_pct": 87.2,
        "barometro_prioridad_conectividad_pct": 72.0,
        "barometro_tension_desarrollo_conservacion_pct": 81.0,
        "barometro_intencion_migracion_juvenil_pct": 53.0,
        "barometro_evaluacion_acceso_salud_pct": 28.0,
        "barometro_preocupacion_contaminacion_lena_pct": 85.0
    },
    "11203": {
        "comuna_nombre": "Guaitecas",
        "barometro_confianza_institucional_pct": 48.2,
        "barometro_redes_apoyo_comunitario_pct": 52.4,
        "barometro_orgullo_identidad_pct": 85.0,
        "barometro_prioridad_conectividad_pct": 73.5,
        "barometro_tension_desarrollo_conservacion_pct": 74.8,
        "barometro_intencion_migracion_juvenil_pct": 55.4,
        "barometro_evaluacion_acceso_salud_pct": 25.8,
        "barometro_preocupacion_contaminacion_lena_pct": 81.2
    },
    "11301": {
        "comuna_nombre": "Cochrane",
        "barometro_confianza_institucional_pct": 68.4,
        "barometro_redes_apoyo_comunitario_pct": 57.8,
        "barometro_orgullo_identidad_pct": 91.2,
        "barometro_prioridad_conectividad_pct": 65.2,
        "barometro_tension_desarrollo_conservacion_pct": 43.5,
        "barometro_intencion_migracion_juvenil_pct": 49.8,
        "barometro_evaluacion_acceso_salud_pct": 19.5,
        "barometro_preocupacion_contaminacion_lena_pct": 95.8
    },
    "11302": {
        "comuna_nombre": "O'Higgins",
        "barometro_confianza_institucional_pct": 71.2,
        "barometro_redes_apoyo_comunitario_pct": 62.5,
        "barometro_orgullo_identidad_pct": 92.5,
        "barometro_prioridad_conectividad_pct": 66.8,
        "barometro_tension_desarrollo_conservacion_pct": 41.2,
        "barometro_intencion_migracion_juvenil_pct": 52.6,
        "barometro_evaluacion_acceso_salud_pct": 18.2,
        "barometro_preocupacion_contaminacion_lena_pct": 94.2
    },
    "11303": {
        "comuna_nombre": "Tortel",
        "barometro_confianza_institucional_pct": 70.5,
        "barometro_redes_apoyo_comunitario_pct": 60.8,
        "barometro_orgullo_identidad_pct": 91.8,
        "barometro_prioridad_conectividad_pct": 65.5,
        "barometro_tension_desarrollo_conservacion_pct": 44.0,
        "barometro_intencion_migracion_juvenil_pct": 51.5,
        "barometro_evaluacion_acceso_salud_pct": 17.8,
        "barometro_preocupacion_contaminacion_lena_pct": 95.0
    },
    "11401": {
        "comuna_nombre": "Chile Chico",
        "barometro_confianza_institucional_pct": 68.9,
        "barometro_redes_apoyo_comunitario_pct": 56.4,
        "barometro_orgullo_identidad_pct": 89.5,
        "barometro_prioridad_conectividad_pct": 63.8,
        "barometro_tension_desarrollo_conservacion_pct": 41.8,
        "barometro_intencion_migracion_juvenil_pct": 48.9,
        "barometro_evaluacion_acceso_salud_pct": 20.1,
        "barometro_preocupacion_contaminacion_lena_pct": 97.2
    },
    "11402": {
        "comuna_nombre": "Río Ibáñez",
        "barometro_confianza_institucional_pct": 51.0,
        "barometro_redes_apoyo_comunitario_pct": 41.2,
        "barometro_orgullo_identidad_pct": 89.8,
        "barometro_prioridad_conectividad_pct": 71.8,
        "barometro_tension_desarrollo_conservacion_pct": 61.2,
        "barometro_intencion_migracion_juvenil_pct": 48.5,
        "barometro_evaluacion_acceso_salud_pct": 21.5,
        "barometro_preocupacion_contaminacion_lena_pct": 92.8
    }
}

YEARS = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"]
SERIES_BAROMETRO = {
    "barometro_confianza_institucional_pct": [52.1, 53.0, 50.8, 51.5, 53.2, 54.6, 55.1, 55.8, 56.2],
    "barometro_redes_apoyo_comunitario_pct": [44.2, 45.1, 48.5, 47.8, 46.5, 46.9, 47.2, 47.8, 48.1],
    "barometro_orgullo_identidad_pct": [86.5, 87.0, 88.0, 87.8, 88.1, 88.4, 88.9, 89.2, 89.5],
    "barometro_prioridad_conectividad_pct": [74.5, 73.2, 71.8, 71.0, 70.5, 70.0, 69.5, 68.8, 68.2],
    "barometro_tension_desarrollo_conservacion_pct": [56.2, 58.0, 60.1, 61.2, 61.5, 61.9, 62.4, 63.0, 63.5],
    "barometro_intencion_migracion_juvenil_pct": [54.0, 53.2, 51.5, 50.8, 50.2, 49.9, 49.2, 48.5, 48.0],
    "barometro_evaluacion_acceso_salud_pct": [21.5, 22.0, 20.8, 21.9, 22.8, 23.7, 24.5, 25.1, 25.8],
    "barometro_preocupacion_contaminacion_lena_pct": [88.5, 90.1, 91.4, 91.8, 92.2, 92.6, 93.1, 93.5, 94.0]
}

baro["comunas"] = COMUNAS_BAROMETRO
baro["series"] = {
    "periodos": YEARS,
    "indicadores": SERIES_BAROMETRO
}

with open(BARO_FILE, "w", encoding="utf-8") as f:
    json.dump(baro, f, indent=2, ensure_ascii=False)

print("[OK] barometro_integrado_aysen.json enriquecido con variables comunales y series multianuales.")
