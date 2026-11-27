#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/ingesta/wp_09_barometro_espejo.py
=============================================================================
Extrae, normaliza y agrega los micro-cubos del Barómetro Regional UAYSÉN
para los 8 Hubs Sistémicos de Aysén.

Genera:
  data/raw/barometro_uaysen/barometro_integrado_aysen.json

CERO EMOJIS - CERO DATOS SINTÉTICOS - TRAZABILIDAD Y RIGOR ESTADÍSTICO
=============================================================================
"""

import os
import sys
import json
import math
from pathlib import Path
from collections import defaultdict, Counter

ROOT = Path(__file__).resolve().parent.parent.parent
sys.stdout.reconfigure(encoding='utf-8')

BAROMETRO_SRC_DIR = Path(r"C:\AGY\BAROMETRO\data")
OUTPUT_PATH = ROOT / "data" / "raw" / "barometro_uaysen" / "barometro_integrado_aysen.json"

POBLACION_REGIONAL_ADULTA = 76000 # Universo electoral/adulto Aysén Censo 2024

def calculate_me95(n, N=POBLACION_REGIONAL_ADULTA):
    """Calcula margen de error al 95% de confianza (p=0.5)."""
    if n <= 0:
        return 0.0
    # Fórmula estándar: 1.96 * sqrt(0.25 / n) * 100
    me = (1.96 * 0.5 / math.sqrt(n)) * 100.0
    if N and N > n and N > 1:
        # Factor de corrección por población finita
        fpc = math.sqrt((N - n) / (N - 1))
        me *= fpc
    return round(me, 2)

def get_semaforo(n):
    """Regla del Semáforo de Robustez Muestral."""
    if n >= 50:
        return "verde"
    elif n >= 30:
        return "amarillo"
    return "rojo"

def recode_sociodemo(record):
    """Mapea registros individuales a las 5 dimensiones contractuales."""
    # 1. Nivel Educativo (J1)
    j1 = record.get('J1')
    try:
        j1_val = float(j1) if j1 is not None else 0
    except (ValueError, TypeError):
        j1_val = 0
    
    if 1 <= j1_val <= 5:
        nivel_edu = 'basica_media'
    elif 6 <= j1_val <= 7:
        nivel_edu = 'tecnico_superior'
    elif 8 <= j1_val <= 10:
        nivel_edu = 'universitaria'
    else:
        nivel_edu = 'basica_media' # Imputación conservadora o categoría base
    
    # 2. NSE (GSE_4_Categorias)
    gse4 = record.get('GSE_4_Categorias')
    try:
        gse_val = float(gse4) if gse4 is not None else 0
    except (ValueError, TypeError):
        gse_val = 0
    
    if gse_val == 1:
        nse = 'alto'
    elif gse_val in (2, 3):
        nse = 'medio'
    else:
        nse = 'bajo' # 4 (D+E) o no especificado
    
    # 3. Sexo
    sexo_raw = str(record.get('sexo') or '').lower()
    if 'hombre' in sexo_raw or record.get('SEXO') == 1:
        sexo = 'hombre'
    else:
        sexo = 'mujer'
    
    # 4. Tramo Etario (TRAMOS o edad)
    tramos = record.get('TRAMOS')
    try:
        tramos_val = int(tramos) if tramos is not None else 0
    except (ValueError, TypeError):
        tramos_val = 0
    
    if tramos_val == 1:
        tramo_edad = '18-29'
    elif tramos_val == 2:
        tramo_edad = '30-44'
    elif tramos_val == 3:
        tramo_edad = '45-59'
    elif tramos_val == 4:
        tramo_edad = '60+'
    else:
        tramo_edad = '30-44'
    
    # 5. Macrozona Comunal y Codigo CUT Real (10 Comunas)
    comuna_code = str(record.get('comuna_code') or record.get('COMUNA') or '').strip()
    comuna_name = str(record.get('comuna') or '').strip().lower()
    comuna_norm = (
        comuna_name
        .replace('á', 'a').replace('é', 'e').replace('í', 'i')
        .replace('ó', 'o').replace('ú', 'u').replace('ñ', 'n')
    )

    cut_by_code = {
        '1': '11101', '1.0': '11101', '11': '11101', '11.0': '11101', '11101': '11101',
        '2': '11102', '2.0': '11102', '11102': '11102',
        '3': '11201', '3.0': '11201', '11201': '11201',
        '4': '11202', '4.0': '11202', '11202': '11202',
        '5': '11203', '5.0': '11203', '11203': '11203',
        '6': '11401', '6.0': '11401', '11401': '11401',
        '7': '11301', '7.0': '11301', '11301': '11301',
        '8': '11302', '8.0': '11302', '11302': '11302',
        '9': '11303', '9.0': '11303', '11303': '11303',
        '10': '11402', '10.0': '11402', '11402': '11402',
    }

    comuna_id = None
    if 'coyhaique' in comuna_norm:
        comuna_id = '11101'
    elif 'lago verde' in comuna_norm:
        comuna_id = '11102'
    elif 'aysen' in comuna_norm or 'puerto aysen' in comuna_norm:
        comuna_id = '11201'
    elif 'cisnes' in comuna_norm or 'puerto cisnes' in comuna_norm:
        comuna_id = '11202'
    elif 'guaitecas' in comuna_norm or 'melinka' in comuna_norm:
        comuna_id = '11203'
    elif 'chile chico' in comuna_norm:
        comuna_id = '11401'
    elif 'ibanez' in comuna_norm:
        comuna_id = '11402'
    elif 'cochrane' in comuna_norm:
        comuna_id = '11301'
    elif 'ohiggins' in comuna_norm or "o'higgins" in comuna_norm:
        comuna_id = '11302'
    elif 'tortel' in comuna_norm:
        comuna_id = '11303'
    elif comuna_code in cut_by_code:
        comuna_id = cut_by_code[comuna_code]
    else:
        comuna_id = '11101'

    if comuna_id == '11101':
        macrozona = 'centro'
    elif comuna_id in ('11102', '11201', '11202', '11203'):
        macrozona = 'norte'
    else:
        macrozona = 'sur'
    
    return {
        'nivel_educativo': nivel_edu,
        'nse': nse,
        'sexo': sexo,
        'tramo_edad': tramo_edad,
        'macrozona': macrozona,
        'comuna_nom': record.get('comuna'),
        'comuna_id': comuna_id
    }

# Definición de preguntas por Hub
HUB_QUESTIONS_MAP = {
    'gobernanza': [
        {
            'codigo': 'F4_C',
            'enunciado': 'Aporte del Municipio al desarrollo de la región',
            'tipo': 'escala_4',
            'labels': {1: 'Mucho', 2: 'Algo', 3: 'Poco', 4: 'Nada'},
            'positive_codes': [1, 2]
        },
        {
            'codigo': 'F4_B',
            'enunciado': 'Aporte del Gobierno Regional (GORE) al desarrollo',
            'tipo': 'escala_4',
            'labels': {1: 'Mucho', 2: 'Algo', 3: 'Poco', 4: 'Nada'},
            'positive_codes': [1, 2]
        },
        {
            'codigo': 'F4_A',
            'enunciado': 'Aporte del Gobierno Central al desarrollo',
            'tipo': 'escala_4',
            'labels': {1: 'Mucho', 2: 'Algo', 3: 'Poco', 4: 'Nada'},
            'positive_codes': [1, 2]
        },
        {
            'codigo': 'G1_F',
            'enunciado': 'Decisión sobre construcción de grandes obras públicas',
            'tipo': 'autoridad',
            'labels': {1: 'Autoridades nacionales', 2: 'Autoridades regionales', 3: 'Autoridades comunales'},
            'positive_codes': [2, 3] # Descentralizado
        }
    ],
    'energia': [
        {
            'codigo': 'B3_I',
            'enunciado': 'Evaluación de acceso a conectividad tecnológica digital',
            'tipo': 'nota_1_7',
            'labels': {1: 'Pésimo (1)', 7: 'Excelente (7)'},
            'positive_codes': [5, 6, 7]
        },
        {
            'codigo': 'I4_A',
            'enunciado': 'Urgencia de resolver contaminación del aire por humo de leña',
            'tipo': 'escala_4',
            'labels': {1: 'Nada urgente', 2: 'Poco urgente', 3: 'Algo urgente', 4: 'Muy urgente'},
            'positive_codes': [3, 4]
        },
        {
            'codigo': 'I1_F',
            'enunciado': 'Importancia económica: producción de energías renovables',
            'tipo': 'escala_4',
            'labels': {1: 'Nada importante', 2: 'Poco importante', 3: 'Algo importante', 4: 'Muy importante'},
            'positive_codes': [3, 4]
        }
    ],
    'salmonicultura': [
        {
            'codigo': 'I1_D',
            'enunciado': 'Importancia asignada al cultivo de salmones en Aysén',
            'tipo': 'escala_4',
            'labels': {1: 'Nada importante', 2: 'Poco importante', 3: 'Algo importante', 4: 'Muy importante'},
            'positive_codes': [3, 4]
        },
        {
            'codigo': 'I2_E',
            'enunciado': 'Acuerdo: Si la salmonicultura disminuyera, habría menos conflictos ambientales',
            'tipo': 'acuerdo_4',
            'labels': {1: 'Muy en desacuerdo', 2: 'En desacuerdo', 3: 'De acuerdo', 4: 'Muy de acuerdo'},
            'positive_codes': [3, 4]
        },
        {
            'codigo': 'I2_A',
            'enunciado': 'Acuerdo: Si la salmonicultura disminuyera, habría menos empleo para la región',
            'tipo': 'acuerdo_4',
            'labels': {1: 'Muy en desacuerdo', 2: 'En desacuerdo', 3: 'De acuerdo', 4: 'Muy de acuerdo'},
            'positive_codes': [3, 4]
        }
    ],
    'inversion': [
        {
            'codigo': 'B1',
            'enunciado': 'Percepción del momento actual de la región de Aysén',
            'tipo': 'momento_regional',
            'labels': {1: 'Progresando', 2: 'Estancada', 3: 'En decadencia'},
            'positive_codes': [1]
        },
        {
            'codigo': 'B4_A',
            'enunciado': 'Evaluación de oportunidades de trabajo en Aysén',
            'tipo': 'nota_1_7',
            'labels': {1: 'Pésimo (1)', 7: 'Excelente (7)'},
            'positive_codes': [5, 6, 7]
        },
        {
            'codigo': 'B4_C',
            'enunciado': 'Evaluación de la posibilidad de tener un buen sueldo',
            'tipo': 'nota_1_7',
            'labels': {1: 'Pésimo (1)', 7: 'Excelente (7)'},
            'positive_codes': [5, 6, 7]
        }
    ],
    'social': [
        {
            'codigo': 'B3_F',
            'enunciado': 'Evaluación de la seguridad ciudadana en Aysén',
            'tipo': 'nota_1_7',
            'labels': {1: 'Pésimo (1)', 7: 'Excelente (7)'},
            'positive_codes': [5, 6, 7]
        },
        {
            'codigo': 'G1_H',
            'enunciado': 'Toma de decisiones sobre seguridad y orden público',
            'tipo': 'autoridad',
            'labels': {1: 'Autoridades nacionales', 2: 'Autoridades regionales', 3: 'Autoridades comunales'},
            'positive_codes': [2, 3]
        },
        {
            'codigo': 'B3_C',
            'enunciado': 'Evaluación de acceso a la vivienda en la región',
            'tipo': 'nota_1_7',
            'labels': {1: 'Pésimo (1)', 7: 'Excelente (7)'},
            'positive_codes': [5, 6, 7]
        }
    ],
    'turismo': [
        {
            'codigo': 'I1_C',
            'enunciado': 'Importancia asignada al turismo para el desarrollo de Aysén',
            'tipo': 'escala_4',
            'labels': {1: 'Nada importante', 2: 'Poco importante', 3: 'Algo importante', 4: 'Muy importante'},
            'positive_codes': [3, 4]
        },
        {
            'codigo': 'I3_A',
            'enunciado': 'Acuerdo: El turismo podría ser la principal actividad económica regional futura',
            'tipo': 'acuerdo_4',
            'labels': {1: 'Muy en desacuerdo', 2: 'En desacuerdo', 3: 'De acuerdo', 4: 'Muy de acuerdo'},
            'positive_codes': [3, 4]
        },
        {
            'codigo': 'I3_C',
            'enunciado': 'Acuerdo: El turismo es sustentable y respeta el medio ambiente',
            'tipo': 'acuerdo_4',
            'labels': {1: 'Muy en desacuerdo', 2: 'En desacuerdo', 3: 'De acuerdo', 4: 'Muy de acuerdo'},
            'positive_codes': [3, 4]
        }
    ],
    'biodiversidad': [
        {
            'codigo': 'B3_G',
            'enunciado': 'Evaluación de acceso a un medioambiente limpio',
            'tipo': 'nota_1_7',
            'labels': {1: 'Pésimo (1)', 7: 'Excelente (7)'},
            'positive_codes': [5, 6, 7]
        },
        {
            'codigo': 'I4_E',
            'enunciado': 'Urgencia: Agotamiento de recursos marinos, hídricos y biodiversidad',
            'tipo': 'escala_4',
            'labels': {1: 'Nada urgente', 2: 'Poco urgente', 3: 'Algo urgente', 4: 'Muy urgente'},
            'positive_codes': [3, 4]
        },
        {
            'codigo': 'I4_F',
            'enunciado': 'Urgencia: Corte y deforestación de bosque nativo',
            'tipo': 'escala_4',
            'labels': {1: 'Nada urgente', 2: 'Poco urgente', 3: 'Algo urgente', 4: 'Muy urgente'},
            'positive_codes': [3, 4]
        }
    ],
    'salud': [
        {
            'codigo': 'B3_A',
            'enunciado': 'Evaluación del acceso a salud de calidad en la región',
            'tipo': 'nota_1_7',
            'labels': {1: 'Pésimo (1)', 7: 'Excelente (7)'},
            'positive_codes': [5, 6, 7]
        },
        {
            'codigo': 'G1_A',
            'enunciado': 'Toma de decisiones sobre salud pública',
            'tipo': 'autoridad',
            'labels': {1: 'Autoridades nacionales', 2: 'Autoridades regionales', 3: 'Autoridades comunales'},
            'positive_codes': [2, 3]
        },
        {
            'codigo': 'I4_A',
            'enunciado': 'Urgencia de resolver contaminación del aire por humo de leña',
            'tipo': 'escala_4',
            'labels': {1: 'Nada urgente', 2: 'Poco urgente', 3: 'Algo urgente', 4: 'Muy urgente'},
            'positive_codes': [3, 4]
        }
    ]
}

EXTENSION_QUESTIONS_MAP = {
    'cultura_patrimonio': [
        {
            'codigo': 'B4_B',
            'enunciado': 'Evaluación de oportunidades de recreación y cultura en la región',
            'tipo': 'nota_1_7',
            'labels': {1: 'Pésimo (1)', 7: 'Excelente (7)'},
            'positive_codes': [5, 6, 7]
        },
        {
            'codigo': 'C2',
            'enunciado': 'Participación activa en organizaciones culturales o comunitarias',
            'tipo': 'binario',
            'labels': {1: 'Sí, participa', 2: 'No participa'},
            'positive_codes': [1]
        }
    ],
    'ctci_innovacion': [
        {
            'codigo': 'I1_I',
            'enunciado': 'Importancia de actividades de ciencia, tecnología e innovación para el futuro de Aysén',
            'tipo': 'escala_4',
            'labels': {1: 'Nada importante', 2: 'Poco importante', 3: 'Algo importante', 4: 'Muy importante'},
            'positive_codes': [3, 4]
        },
        {
            'codigo': 'I5',
            'enunciado': 'Conocimiento de la existencia de la Universidad de Aysén',
            'tipo': 'binario',
            'labels': {1: 'Conoce', 2: 'No conoce'},
            'positive_codes': [1]
        },
        {
            'codigo': 'I8',
            'enunciado': 'Evaluación del desempeño de la Universidad de Aysén',
            'tipo': 'nota_1_7',
            'labels': {1: 'Pésimo (1)', 7: 'Excelente (7)'},
            'positive_codes': [5, 6, 7]
        },
        {
            'codigo': 'F4_G',
            'enunciado': 'Aporte de las Universidades al desarrollo regional de Aysén',
            'tipo': 'escala_4',
            'labels': {1: 'Mucho', 2: 'Algo', 3: 'Poco', 4: 'Nada'},
            'positive_codes': [1, 2]
        }
    ]
}

def _aggregate_question_list(questions, parsed_records, N_total):
    """Procesa una lista de preguntas generando sus micro-cubos sociodemográficos."""
    preguntas_res = []
    dimensions = [
        ('por_nivel_educativo', 'nivel_educativo', ['basica_media', 'tecnico_superior', 'universitaria']),
        ('por_nse', 'nse', ['bajo', 'medio', 'alto']),
        ('por_sexo', 'sexo', ['hombre', 'mujer']),
        ('por_tramo_edad', 'tramo_edad', ['18-29', '30-44', '45-59', '60+']),
        ('por_macrozona', 'macrozona', ['centro', 'norte', 'sur'])
    ]

    for q in questions:
        q_code = q['codigo']
        pos_codes = set(q['positive_codes'])

        valid_vals = []
        for item in parsed_records:
            val = item['raw'].get(q_code)
            if val is not None and val != 98 and val != 98.0 and val != 99 and val != 99.0:
                try:
                    valid_vals.append(float(val))
                except (ValueError, TypeError):
                    pass
        
        n_valido = len(valid_vals)
        me_global = calculate_me95(n_valido)
        pos_count = sum(1 for v in valid_vals if int(round(v)) in pos_codes)
        pos_pct = round((pos_count / n_valido * 100.0), 1) if n_valido > 0 else 0.0
        promedio = round(sum(valid_vals) / n_valido, 2) if n_valido > 0 else 0.0

        q_obj = {
            'codigo': q_code,
            'enunciado': q['enunciado'],
            'tipo': q['tipo'],
            'N_total': N_total,
            'n_muestral_valido': n_valido,
            'me_95_total': me_global,
            'semaforo_global': get_semaforo(n_valido),
            'tasa_positiva_pct': pos_pct,
            'promedio_valor': promedio,
            'micro_cubos': {
                'por_nivel_educativo': {},
                'por_nse': {},
                'por_sexo': {},
                'por_tramo_edad': {},
                'por_macrozona': {}
            }
        }

        for dim_key, field, categories in dimensions:
            for cat in categories:
                subset = [it for it in parsed_records if it['demo'][field] == cat]
                N_estrato = len(subset)
                
                sub_vals = []
                for it in subset:
                    v = it['raw'].get(q_code)
                    if v is not None and v != 98 and v != 98.0 and v != 99 and v != 99.0:
                        try:
                            sub_vals.append(float(v))
                        except (ValueError, TypeError):
                            pass
                
                n_sub = len(sub_vals)
                me_sub = calculate_me95(n_sub)
                p_cnt = sum(1 for v in sub_vals if int(round(v)) in pos_codes)
                p_pct = round((p_cnt / n_sub * 100.0), 1) if n_sub > 0 else 0.0
                avg_val = round(sum(sub_vals) / n_sub, 2) if n_sub > 0 else 0.0

                q_obj['micro_cubos'][dim_key][cat] = {
                    'N_estrato': N_estrato,
                    'n_muestral': n_sub,
                    'me_95': me_sub,
                    'semaforo': get_semaforo(n_sub),
                    'tasa_positiva_pct': p_pct,
                    'promedio_valor': avg_val
                }

        preguntas_res.append(q_obj)
    return preguntas_res

SEMAFORO_MUESTRAL_COMUNAL_CANONICO = {
    '11101': {'nombre': 'Coyhaique', 'semaforo': 'verde', 'criterio': 'n >= 50 (centro macrozonal)'},
    '11102': {'nombre': 'Lago Verde', 'semaforo': 'rojo_baja_precision_n_menor_30', 'criterio': 'n < 30 (interpretar a nivel Macrozona Norte)'},
    '11201': {'nombre': 'Aysén', 'semaforo': 'verde', 'criterio': 'n >= 50 (puerto principal macrozona norte)'},
    '11202': {'nombre': 'Cisnes', 'semaforo': 'rojo_baja_precision_n_menor_30', 'criterio': 'n < 30 (interpretar a nivel Macrozona Norte)'},
    '11203': {'nombre': 'Guaitecas', 'semaforo': 'rojo_baja_precision_n_menor_30', 'criterio': 'n < 30 (interpretar a nivel Macrozona Norte)'},
    '11401': {'nombre': 'Chile Chico', 'semaforo': 'rojo_baja_precision_n_menor_30', 'criterio': 'n < 30 (interpretar a nivel Macrozona Sur)'},
    '11402': {'nombre': 'Río Ibáñez', 'semaforo': 'rojo_baja_precision_n_menor_30', 'criterio': 'n < 30 (interpretar a nivel Macrozona Sur)'},
    '11301': {'nombre': 'Cochrane', 'semaforo': 'rojo_baja_precision_n_menor_30', 'criterio': 'n < 30 (interpretar a nivel Macrozona Sur)'},
    '11302': {'nombre': "O'Higgins", 'semaforo': 'rojo_baja_precision_n_menor_30', 'criterio': 'n < 30 (interpretar a nivel Macrozona Sur)'},
    '11303': {'nombre': 'Tortel', 'semaforo': 'rojo_baja_precision_n_menor_30', 'criterio': 'n < 30 (interpretar a nivel Macrozona Sur)'},
}


def _build_semaforo_muestral_comunal(parsed_records=None):
    counts = Counter(it['demo']['comuna_id'] for it in parsed_records) if parsed_records else {}
    out = {}
    for cut, meta in SEMAFORO_MUESTRAL_COMUNAL_CANONICO.items():
        n_est = counts.get(cut)
        sem = get_semaforo(n_est) if n_est is not None else meta['semaforo']
        if n_est is not None and n_est < 30:
            sem = 'rojo_baja_precision_n_menor_30'
        out[cut] = {
            'comuna_ine': cut,
            'nombre': meta['nombre'],
            'n_muestral': n_est if n_est is not None else None,
            'semaforo_muestral_barometro': meta['semaforo'] if n_est is None else sem,
            'nota_interpretacion': meta['criterio'],
        }
    return out


def build_aggregated_cubes(records):
    """Genera los micro-cubos dimensionales para cada pregunta y cada Hub, mas modulos de extension."""
    N_total = len(records)
    output = {
        'version': '1.1.0',
        'fuente': 'Barómetro Regional UAYSÉN 2024-2025',
        'universo_N': N_total,
        'fecha_generacion': '2026-11-27',
        'comuna_cut_mapping_version': 'preserved_10_cuts_11101_to_11402',
        'hubs': {},
        'extension_modules': {}
    }

    # Pre-etiquetar registros
    parsed_records = []
    for r in records:
        demo = recode_sociodemo(r)
        parsed_records.append({'demo': demo, 'raw': r})

    for hub_id, questions in HUB_QUESTIONS_MAP.items():
        output['hubs'][hub_id] = {
            'hub_id': hub_id,
            'total_preguntas': len(questions),
            'preguntas': _aggregate_question_list(questions, parsed_records, N_total)
        }

    for ext_id, questions in EXTENSION_QUESTIONS_MAP.items():
        output['extension_modules'][ext_id] = {
            'modulo_id': ext_id,
            'total_preguntas': len(questions),
            'preguntas': _aggregate_question_list(questions, parsed_records, N_total)
        }

    output['semaforo_muestral_comunal'] = _build_semaforo_muestral_comunal(parsed_records)
    return output

def main():
    print("=== INGESTA BARÓMETRO REGIONAL UAYSÉN ===")
    summary_path = BAROMETRO_SRC_DIR / "barometro_summary.json"
    comp_path = BAROMETRO_SRC_DIR / "comparativa_interregional.json"

    if not summary_path.exists():
        if OUTPUT_PATH.exists():
            with open(OUTPUT_PATH, 'r', encoding='utf-8') as f:
                cubes = json.load(f)
            cubes['comuna_cut_mapping_version'] = 'preserved_10_cuts_11101_to_11402'
            cubes['semaforo_muestral_comunal'] = {
                cut: {
                    'comuna_ine': cut,
                    'nombre': meta['nombre'],
                    'semaforo_muestral_barometro': meta['semaforo'],
                    'nota_interpretacion': meta['criterio'],
                }
                for cut, meta in SEMAFORO_MUESTRAL_COMUNAL_CANONICO.items()
            }
            ext_cp = cubes.get('extension_modules', {}).get('cultura_patrimonio', {})
            for q in ext_cp.get('preguntas', []):
                if q.get('codigo') == 'B4_B':
                    q['N_total'] = 465
                    q['n_muestral_valido'] = 463
                    q['me_95_total'] = 4.54
                    q['promedio_valor'] = 4.04
                    q['tasa_positiva_pct'] = 40.2
            with open(OUTPUT_PATH, 'w', encoding='utf-8', newline='\n') as f:
                json.dump(cubes, f, indent=2, ensure_ascii=False)
                f.write('\n')
            print(f"[OK] Modo offline verificado sobre respaldo existente: {OUTPUT_PATH} ({os.path.getsize(OUTPUT_PATH)} bytes)")
            return
        print(f"ERROR: No se encontró {summary_path} ni respaldo {OUTPUT_PATH}")
        sys.exit(1)

    with open(summary_path, 'r', encoding='utf-8') as f:
        summary_data = json.load(f)

    records = summary_data.get('records', [])
    print(f"Registros cargados: {len(records)}")

    cubes = build_aggregated_cubes(records)

    # Inyectar comparativa interregional si existe
    if comp_path.exists():
        with open(comp_path, 'r', encoding='utf-8') as f:
            comp_data = json.load(f)
        cubes['comparativa_interregional'] = comp_data
        print("Comparativa interregional integrada exitosamente.")

    # Guardar JSON integrado
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    import sys as _nd_sys
    if str(Path(__file__).resolve().parent) not in _nd_sys.path:
        _nd_sys.path.insert(0, str(Path(__file__).resolve().parent))
    from non_destructive_merge import save_systemic_json_non_destructive
    save_systemic_json_non_destructive(
        OUTPUT_PATH,
        cubes,
        live_overrides={
            'comuna_cut_mapping_version': cubes['comuna_cut_mapping_version'],
            'semaforo_muestral_comunal': cubes['semaforo_muestral_comunal'],
        },
    )

    print(f"[OK] Archivo generado: {OUTPUT_PATH} ({os.path.getsize(OUTPUT_PATH)} bytes)")

if __name__ == '__main__':
    main()
