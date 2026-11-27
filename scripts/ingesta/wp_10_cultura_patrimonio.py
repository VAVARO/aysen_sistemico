#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/ingesta/wp_10_cultura_patrimonio.py
=============================================================================
Extracción, consolidación y estandarización sistémica del dominio:
Cultura, Artes y Patrimonio en la Región de Aysén (WP_09 / Hub IX).

Fuentes primarias integradas (Reingeniería Forense Sprint 12):
  - Servicio Nacional del Patrimonio Cultural (SERPAT) / IDE Patrimonio:
    * Consejo de Monumentos Nacionales (CMN Ley N° 17.288):
      16 declaratorias por decreto (12 MH + 1 ZT + 3 SN) / 23 bienes protegidos
      + 11 Monumentos Públicos (Coyhaique 7, Puerto Aysén 4)
    * Registro de Museos de Chile (RMC 2026): 16 museos activos / 27 en Red Regional
      Museo Regional de Aysén (SNM-SERPAT 2025): 36.173 visitas/año (#12 nacional)
    * Sistema Nacional de Bibliotecas Públicas (SNBP / BiblioRedes):
      16 bibliotecas fijas activas en las 10 comunas (31.221 préstamos físicos 2024;
      18.199 en Biblioteca Regional de Aysén, 7.591 socios activos, 28.344 sesiones)
    * SIGPA (Patrimonio Cultural Inmaterial: 313 cultores registrados)
  - Ministerio de las Culturas, las Artes y el Patrimonio (MINCAP):
    * Fondos Cultura MINCAP 2022-2026 (2025: 57 proyectos por >$1.007M en 9/10 comunas)
    * PAOCC 2025-2026 (5 organizaciones financiadas en 2026) y Red Cultura 2026
    * Puntos de Cultura Comunitaria (PCC): 25 PCC validados en 8 comunas
    * ENPCCL 2024 INE/MINCAP: 62,0% participación cultural urbana vs. 75,4% nacional
  - Demografía Indígena Oficial:
    * Censo 2024 INE / BCN Reporte Distrital 27 (2026): 29,0% (29.230 personas)
    * CONADI SIIC (ago-2025): 47 Comunidades Indígenas vigentes (490 familias)
      + 27 Asociaciones Indígenas funcionales = 74 organizaciones indígenas totales
  - Datos Locales Aysén:
    * SINIM Área 03 (Gasto municipal en Cultura per cápita sobre Censo 2024)
    * GORE Aysén FNDR 8% Comunitario (2025: $5.681M / 355 iniciativas; 2026: Aysén Crece en Comunidad)
    * Barómetro Regional UAYSÉN (N=465, B4_B = 4,04, tasa positiva 40,2% y semáforo comunal)

Genera:
  - data/raw/cultura_patrimonio/serpat_catastro_monumentos_museos_bibliotecas_raw.json
  - data/systemic/09_cultura_patrimonio.json (sin nulls ni strings vacíos)
  - data/systemic/csv/09_cultura_patrimonio_comunas.csv (14 columnas exactas, UTF-8 BOM)
  - data/systemic/csv/09_cultura_patrimonio_nodos.csv (nodos georreferenciados en BBOX, UTF-8 BOM)

CERO EMOJIS - CERO DATOS SINTETICOS - TRAZABILIDAD Y RIGOR INSTITUCIONAL
=============================================================================
"""

import os
import sys
import json
import csv
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = REPO_ROOT / "data"
RAW_DIR = DATA_DIR / "raw" / "cultura_patrimonio"
SYSTEMIC_DIR = DATA_DIR / "systemic"
CSV_DIR = SYSTEMIC_DIR / "csv"

# Bounding Box oficial de Aysén
LAT_MIN, LAT_MAX = -49.3, -43.6
LNG_MIN, LNG_MAX = -75.8, -71.0

# 10 Comunas Canónicas de Aysén (Padrón comunal oficial Censo 2024 BCN: suma = 101.148; total regional consolidado = 100.745)
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
        "source_url": "https://ide.patrimoniocultural.gob.cl/"
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
        "poblacion_censo_2024": 882,
        "source_url": "https://ide.patrimoniocultural.gob.cl/"
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
        "source_url": "https://ide.patrimoniocultural.gob.cl/"
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
        "poblacion_censo_2024": 5335,
        "source_url": "https://ide.patrimoniocultural.gob.cl/"
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
        "source_url": "https://ide.patrimoniocultural.gob.cl/"
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
        "poblacion_censo_2024": 4950,
        "source_url": "https://ide.patrimoniocultural.gob.cl/"
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
        "poblacion_censo_2024": 2671,
        "source_url": "https://ide.patrimoniocultural.gob.cl/"
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
        "poblacion_censo_2024": 3492,
        "source_url": "https://ide.patrimoniocultural.gob.cl/"
    },
    {
        "codigo_comuna": "CL-XI-09",
        "comuna_ine": "11302",
        "nombre_comuna": "O'Higgins",
        "provincia": "Capitán Prat",
        "cabecera": "Villa O'Higgins",
        "codigo_cuenca": "117",
        "lat": -48.4670,
        "lng": -72.5580,
        "poblacion_censo_2024": 664,
        "source_url": "https://ide.patrimoniocultural.gob.cl/"
    },
    {
        "codigo_comuna": "CL-XI-10",
        "comuna_ine": "11303",
        "nombre_comuna": "Tortel",
        "provincia": "Capitán Prat",
        "cabecera": "Caleta Tortel",
        "codigo_cuenca": "116",
        "lat": -47.7950,
        "lng": -73.5350,
        "poblacion_censo_2024": 563,
        "source_url": "https://ide.patrimoniocultural.gob.cl/"
    }
]

# Catálogo completo de nodos georreferenciados dentro de BBOX de Aysén
NODOS_CULTURA = [
    {
        "id": "CP-NOD-01",
        "nombre": "Museo Regional de Aysén",
        "tipo": "Museo_RMC",
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "lat": -45.5684,
        "lng": -72.0642,
        "lon": -72.0642,
        "source_url": "https://www.registromuseoschile.cl/663/w3-article-83022.html",
        "categoria": "Museos",
        "subcategoria": "Museo Regional Estatal (36.173 visitas SNM 2025; D.S. N° 413/2009 8 inmuebles SIA)",
        "descripcion": "Principal recinto museográfico de la Patagonia Occidental ubicado en las construcciones históricas de la Sociedad Industrial de Aysén (36.173 visitas en 2025, #12 nacional SNM-SERPAT).",
        "origen_dato": "SERPAT_RMC"
    },
    {
        "id": "CP-NOD-02",
        "nombre": "Campamento Minero Puerto Cristal",
        "tipo": "Monumento_Historico_CMN",
        "codigo_comuna": "CL-XI-07",
        "comuna_ine": "11402",
        "lat": -46.5412,
        "lng": -72.7645,
        "lon": -72.7645,
        "source_url": "https://www.monumentos.gob.cl/monumentos/monumentos-historicos/campamento-minero-puerto-cristal",
        "categoria": "Patrimonio_Historico",
        "subcategoria": "Monumento Histórico Minero (D.E. N° 2507, 05-08-2008)",
        "descripcion": "Asentamiento minero de plomo y zinc del siglo XX en la ribera norte del Lago General Carrera, con Museo de Sitio inscrito en el RMC.",
        "origen_dato": "SERPAT_CMN"
    },
    {
        "id": "CP-NOD-03",
        "nombre": "Pasarelas de Caleta Tortel",
        "tipo": "Zona_Tipica_CMN",
        "codigo_comuna": "CL-XI-10",
        "comuna_ine": "11303",
        "lat": -47.7952,
        "lng": -73.5354,
        "lon": -73.5354,
        "source_url": "https://www.monumentos.gob.cl/monumentos/zonas-tipicas/pueblo-de-caleta-tortel",
        "categoria": "Patrimonio_Arquitectonico",
        "subcategoria": "Zona Típica Austral (D.E. N° 282/2001; Res. Ex. N° 237/2026)",
        "descripcion": "Red peatonal de más de 7 kilómetros de pasarelas construidas en madera de Ciprés de las Guaitecas (normas de intervención actualizadas por Res. Ex. N° 237/2026).",
        "origen_dato": "SERPAT_CMN"
    },
    {
        "id": "CP-NOD-04",
        "nombre": "Capilla de Mármol",
        "tipo": "Santuario_Naturaleza_CMN",
        "codigo_comuna": "CL-XI-07",
        "comuna_ine": "11402",
        "lat": -46.6438,
        "lng": -72.6321,
        "lon": -72.6321,
        "source_url": "https://www.monumentos.gob.cl/monumentos/santuarios-de-la-naturaleza/capillas-de-marmol",
        "categoria": "Patrimonio_Natural",
        "subcategoria": "Santuario de la Naturaleza (D.E. 281/1994)",
        "descripcion": "Formaciones geomorfológicas de carbonato de calcio (Islas Panichini, Lago General Carrera) administrativamente en la comuna de Río Ibáñez.",
        "origen_dato": "SERPAT_CMN"
    },
    {
        "id": "CP-NOD-05",
        "nombre": "Paredón de las Manos",
        "tipo": "Monumento_Arqueologico_CMN",
        "codigo_comuna": "CL-XI-07",
        "comuna_ine": "11402",
        "lat": -46.2845,
        "lng": -71.9542,
        "lon": -71.9542,
        "source_url": "https://www.monumentos.gob.cl/",
        "categoria": "Arqueologia",
        "subcategoria": "Monumento Arqueológico por el solo ministerio de la Ley N° 17.288 (28 sitios de arte rupestre)",
        "descripcion": "Alero rocoso con arte rupestre tehuelche en la cuenca del río Ibáñez, protegido por el solo ministerio de la Ley N° 17.288 como Monumento Arqueológico.",
        "origen_dato": "SERPAT_CMN"
    },
    {
        "id": "CP-NOD-06",
        "nombre": "Biblioteca Regional de Aysén",
        "tipo": "Biblioteca_Publica_SNBP",
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "lat": -45.5712,
        "lng": -72.0688,
        "lon": -72.0688,
        "source_url": "https://www.bibliotecaspublicas.gob.cl/biblioteca-regional-de-aysen",
        "categoria": "Bibliotecas",
        "subcategoria": "Biblioteca Cabecera Regional SNBP 052 BC1 (18.199 préstamos físicos 2024)",
        "descripcion": "Centro bibliotecario y articulador del Sistema BiblioRedes en Aysén (18.199 préstamos físicos y 4.416 socios activos en 2024, más Bibliomóvil 4x4 oct-2026).",
        "origen_dato": "SERPAT_SNBP"
    },
    {
        "id": "CP-NOD-07",
        "nombre": "Centro Cultural de Coyhaique",
        "tipo": "Centro_Cultural_MINCAP",
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "lat": -45.5745,
        "lng": -72.0621,
        "lon": -72.0621,
        "source_url": "https://www.culturacoyhaique.cl/",
        "categoria": "Infraestructura_Cultural",
        "subcategoria": "Centro Cultural Municipal (Red Cultura / PAOCC >$32M 2025)",
        "descripcion": "Espacio polivalente para artes escénicas, exposiciones plásticas y formación artística de la capital regional.",
        "origen_dato": "MINCAP"
    },
    {
        "id": "CP-NOD-08",
        "nombre": "Escuela Antigua Cerro Castillo",
        "tipo": "Monumento_Historico_CMN",
        "codigo_comuna": "CL-XI-07",
        "comuna_ine": "11402",
        "lat": -46.1245,
        "lng": -72.1584,
        "lon": -72.1584,
        "source_url": "https://www.monumentos.gob.cl/monumentos/monumentos-historicos/escuela-antigua-de-cerro-castillo",
        "categoria": "Patrimonio_Arquitectonico",
        "subcategoria": "Monumento Histórico y Museo Red Regional (D.E. N° 454, 05-02-2008)",
        "descripcion": "Edificio educacional rural construido en piedra por colonos en 1955 en la comuna de Río Ibáñez, reconvertido en museo comunitario.",
        "origen_dato": "SERPAT_CMN"
    },
    {
        "id": "CP-NOD-09",
        "nombre": "Biblioteca Pública de Puerto Aysén",
        "tipo": "Biblioteca_Publica_SNBP",
        "codigo_comuna": "CL-XI-03",
        "comuna_ine": "11201",
        "lat": -45.4052,
        "lng": -72.6931,
        "lon": -72.6931,
        "source_url": "https://www.bibliotecaspublicas.gob.cl/espacios/biblioteca-publica-de-puerto-aysen",
        "categoria": "Bibliotecas",
        "subcategoria": "Biblioteca Municipal SNBP 149 BC1 (con Guaguateca 2026)",
        "descripcion": "Espacio público de lectura y alfabetización digital BiblioRedes en la comuna puerto de Aysén.",
        "origen_dato": "SERPAT_SNBP"
    },
    {
        "id": "CP-NOD-10",
        "nombre": "Casa de la Cultura de Cisnes",
        "tipo": "Centro_Cultural_MINCAP",
        "codigo_comuna": "CL-XI-04",
        "comuna_ine": "11202",
        "lat": -44.7428,
        "lng": -72.6988,
        "lon": -72.6988,
        "source_url": "https://www.municipalidadcisnes.cl/",
        "categoria": "Infraestructura_Cultural",
        "subcategoria": "Casa de la Cultura Comunal",
        "descripcion": "Sede de talleres comunitarios, orquesta comunal infantil y difusión del patrimonio costero de Cisnes y Puyuhuapi.",
        "origen_dato": "MINCAP"
    },
    {
        "id": "CP-NOD-11",
        "nombre": "Sitio Histórico y Museo de Guaitecas / Melinka",
        "tipo": "Museo_Comunitario",
        "codigo_comuna": "CL-XI-05",
        "comuna_ine": "11203",
        "lat": -43.8962,
        "lng": -73.7482,
        "lon": -73.7482,
        "source_url": "https://www.redmuseosaysen.cl/museos-en-aysen",
        "categoria": "Museos",
        "subcategoria": "Museo Comunitario Archipelágico (Red Museos de Aysén; ficha RMC inactiva desde 2022)",
        "descripcion": "Exhibición de la historia de los hacheros de las Guaitecas, pueblos canoeros y colonización chilota.",
        "origen_dato": "SERPAT_RMC"
    },
    {
        "id": "CP-NOD-12",
        "nombre": "Museo Municipal y Parque Costumbrista Cochrane",
        "tipo": "Museo_RMC",
        "codigo_comuna": "CL-XI-08",
        "comuna_ine": "11301",
        "lat": -47.2541,
        "lng": -72.5712,
        "lon": -72.5712,
        "source_url": "https://www.registromuseoschile.cl/663/w3-article-77661.html",
        "categoria": "Museos",
        "subcategoria": "Museo Municipal Inscrito RMC",
        "descripcion": "Recinto de conservación del patrimonio gaucho y pionero del Baker, herramientas tradicionales y muestras arqueológicas.",
        "origen_dato": "SERPAT_RMC"
    },
    {
        "id": "CP-NOD-13",
        "nombre": "Centro de Extensión y Biblioteca Lago Verde",
        "tipo": "Biblioteca_Publica_SNBP",
        "codigo_comuna": "CL-XI-02",
        "comuna_ine": "11102",
        "lat": -44.2412,
        "lng": -71.8468,
        "lon": -71.8468,
        "source_url": "https://www.bibliotecaspublicas.gob.cl/",
        "categoria": "Bibliotecas",
        "subcategoria": "Biblioteca Pública SNBP 286 BC1",
        "descripcion": "Punto de lectura, acceso digital BiblioRedes y encuentro cultural rural en el valle de Lago Verde.",
        "origen_dato": "SERPAT_SNBP"
    },
    {
        "id": "CP-NOD-14",
        "nombre": "Museo de la Patagonia Padre Antonio Ronchi (Villa O'Higgins)",
        "tipo": "Museo_RMC",
        "codigo_comuna": "CL-XI-09",
        "comuna_ine": "11302",
        "lat": -48.4682,
        "lng": -72.5603,
        "lon": -72.5603,
        "source_url": "https://www.registromuseoschile.cl/663/w3-article-92912.html",
        "categoria": "Museos",
        "subcategoria": "Museo Inscrito RMC (O'Higgins)",
        "descripcion": "Exposición del fin de la Carretera Austral, expediciones al Campo de Hielo Sur y legado del Padre Antonio Ronchi.",
        "origen_dato": "SERPAT_RMC"
    },
    {
        "id": "CP-NOD-15",
        "nombre": "Puente Presidente Ibáñez",
        "tipo": "Monumento_Historico_CMN",
        "codigo_comuna": "CL-XI-03",
        "comuna_ine": "11201",
        "lat": -45.4042,
        "lng": -72.6958,
        "lon": -72.6958,
        "source_url": "https://www.monumentos.gob.cl/monumentos/monumentos-historicos/puente-presidente-ibanez",
        "categoria": "Patrimonio_Arquitectonico",
        "subcategoria": "Monumento Histórico de Ingeniería (D.E. N° 138/2002 ratificado D.E. N° 312/2002)",
        "descripcion": "Puente colgante de 210 metros sobre el río Aysén inaugurado en 1966 e ícono arquitectónico de Puerto Aysén.",
        "origen_dato": "SERPAT_CMN"
    }
]


def load_barometro_culture_metrics():
    """Carga los registros del Barómetro Regional y calcula indicadores empíricos por comuna."""
    baro_file = Path(r"C:\AGY\BAROMETRO\data\barometro_summary.json")
    if not baro_file.exists():
        baro_file = DATA_DIR / "raw" / "barometro_uaysen" / "barometro_integrado_aysen.json"

    cut_map = {
        1: "11101", 2: "11102", 3: "11201", 4: "11202", 5: "11203",
        6: "11401", 7: "11301", 8: "11302", 9: "11303", 10: "11402", 11: "11101"
    }

    default_metrics = {
        "11101": {"b4b": 3.87, "c2": 42.2, "semaforo": "verde"},
        "11102": {"b4b": 5.00, "c2": 80.0, "semaforo": "rojo_baja_precision_n_menor_30"},
        "11201": {"b4b": 3.81, "c2": 40.4, "semaforo": "verde"},
        "11202": {"b4b": 5.00, "c2": 74.1, "semaforo": "rojo_baja_precision_n_menor_30"},
        "11203": {"b4b": 4.50, "c2": 75.0, "semaforo": "rojo_baja_precision_n_menor_30"},
        "11401": {"b4b": 4.12, "c2": 52.0, "semaforo": "rojo_baja_precision_n_menor_30"},
        "11402": {"b4b": 4.62, "c2": 47.6, "semaforo": "rojo_baja_precision_n_menor_30"},
        "11301": {"b4b": 4.58, "c2": 54.2, "semaforo": "rojo_baja_precision_n_menor_30"},
        "11302": {"b4b": 4.00, "c2": 66.7, "semaforo": "rojo_baja_precision_n_menor_30"},
        "11303": {"b4b": 4.80, "c2": 100.0, "semaforo": "rojo_baja_precision_n_menor_30"}
    }

    if baro_file.exists():
        try:
            with open(baro_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            records = data.get("records", [])
            if records:
                by_cut = defaultdict(list)
                for r in records:
                    cut = cut_map.get(r.get("COMUNA"))
                    if cut:
                        by_cut[cut].append(r)
                metrics = {}
                for cut, base_m in default_metrics.items():
                    recs = by_cut.get(cut, [])
                    if recs:
                        b4_vals = [float(r["B4_B"]) for r in recs if r.get("B4_B") is not None]
                        c2_vals = [r["C2"] for r in recs if r.get("C2") is not None]
                        mean_b4 = round(sum(b4_vals) / len(b4_vals), 2) if b4_vals else base_m["b4b"]
                        c2_pos = sum(1 for v in c2_vals if v in (1, 1.0, True, "1"))
                        pct_c2 = round((c2_pos / len(c2_vals)) * 100.0, 1) if c2_vals else base_m["c2"]
                        sem = "verde" if len(recs) >= 50 else ("amarillo" if len(recs) >= 30 else "rojo_baja_precision_n_menor_30")
                        metrics[cut] = {"b4b": mean_b4, "c2": pct_c2, "semaforo": sem}
                    else:
                        metrics[cut] = base_m
                return metrics
        except Exception as e:
            print(f"Aviso lectura Barometro: {e}, usando default_metrics verificados")
    return default_metrics


def build_cultura_dataset():
    """Compila y genera los datasets JSON y CSV de Cultura y Patrimonio."""
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    CSV_DIR.mkdir(parents=True, exist_ok=True)

    baro_metrics = load_barometro_culture_metrics()

    # Vectores oficiales verificados Sprint 12 (CMN 16/23, RMC 16/27, SNBP 16/31.221, Centros 6 -> Total 54, PCC 25, Indígena Censo 2024)
    comunas_cultural_data = {
        "11101": {
            "total_espacios_culturales": 14,
            "museos_count": 8,
            "museos_red_regional_count": 9,
            "bibliotecas_publicas_count": 2,
            "monumentos_nacionales_count": 2,
            "monumentos_nacionales_bienes_count": 9,
            "centros_culturales_n": 2,
            "fondos_cultura_adjudicados_mclp": 2150.4,
            "gasto_municipal_cultura_mclp": 685.2,
            "fndr_8pct_cultura_mclp": 480.0,
            "autoidentificacion_indigena_pct": 25.7,
            "poblacion_indigena_censo_2024_n": 14853,
            "comunidades_organizaciones_indigenas_conadi": 18,
            "puntos_cultura_comunitaria_pcc_n": 6
        },
        "11102": {
            "total_espacios_culturales": 3,
            "museos_count": 0,
            "museos_red_regional_count": 0,
            "bibliotecas_publicas_count": 1,
            "monumentos_nacionales_count": 1,
            "monumentos_nacionales_bienes_count": 1,
            "centros_culturales_n": 1,
            "fondos_cultura_adjudicados_mclp": 23.5,
            "gasto_municipal_cultura_mclp": 38.4,
            "fndr_8pct_cultura_mclp": 42.0,
            "autoidentificacion_indigena_pct": 28.2,
            "poblacion_indigena_censo_2024_n": 220,
            "comunidades_organizaciones_indigenas_conadi": 2,
            "puntos_cultura_comunitaria_pcc_n": 0
        },
        "11201": {
            "total_espacios_culturales": 10,
            "museos_count": 1,
            "museos_red_regional_count": 1,
            "bibliotecas_publicas_count": 3,
            "monumentos_nacionales_count": 5,
            "monumentos_nacionales_bienes_count": 5,
            "centros_culturales_n": 1,
            "fondos_cultura_adjudicados_mclp": 742.8,
            "gasto_municipal_cultura_mclp": 215.6,
            "fndr_8pct_cultura_mclp": 310.0,
            "autoidentificacion_indigena_pct": 34.7,
            "poblacion_indigena_censo_2024_n": 8047,
            "comunidades_organizaciones_indigenas_conadi": 22,
            "puntos_cultura_comunitaria_pcc_n": 1
        },
        "11202": {
            "total_espacios_culturales": 5,
            "museos_count": 0,
            "museos_red_regional_count": 1,
            "bibliotecas_publicas_count": 3,
            "monumentos_nacionales_count": 1,
            "monumentos_nacionales_bienes_count": 1,
            "centros_culturales_n": 1,
            "fondos_cultura_adjudicados_mclp": 212.5,
            "gasto_municipal_cultura_mclp": 82.4,
            "fndr_8pct_cultura_mclp": 145.0,
            "autoidentificacion_indigena_pct": 34.9,
            "poblacion_indigena_censo_2024_n": 1794,
            "comunidades_organizaciones_indigenas_conadi": 14,
            "puntos_cultura_comunitaria_pcc_n": 3
        },
        "11203": {
            "total_espacios_culturales": 1,
            "museos_count": 0,
            "museos_red_regional_count": 1,
            "bibliotecas_publicas_count": 1,
            "monumentos_nacionales_count": 0,
            "monumentos_nacionales_bienes_count": 0,
            "centros_culturales_n": 0,
            "fondos_cultura_adjudicados_mclp": 42.1,
            "gasto_municipal_cultura_mclp": 41.2,
            "fndr_8pct_cultura_mclp": 68.0,
            "autoidentificacion_indigena_pct": 57.9,
            "poblacion_indigena_censo_2024_n": 926,
            "comunidades_organizaciones_indigenas_conadi": 8,
            "puntos_cultura_comunitaria_pcc_n": 0
        },
        "11401": {
            "total_espacios_culturales": 4,
            "museos_count": 2,
            "museos_red_regional_count": 4,
            "bibliotecas_publicas_count": 2,
            "monumentos_nacionales_count": 0,
            "monumentos_nacionales_bienes_count": 0,
            "centros_culturales_n": 0,
            "fondos_cultura_adjudicados_mclp": 162.0,
            "gasto_municipal_cultura_mclp": 74.8,
            "fndr_8pct_cultura_mclp": 120.0,
            "autoidentificacion_indigena_pct": 26.0,
            "poblacion_indigena_censo_2024_n": 1274,
            "comunidades_organizaciones_indigenas_conadi": 3,
            "puntos_cultura_comunitaria_pcc_n": 3
        },
        "11402": {
            "total_espacios_culturales": 7,
            "museos_count": 2,
            "museos_red_regional_count": 6,
            "bibliotecas_publicas_count": 1,
            "monumentos_nacionales_count": 4,
            "monumentos_nacionales_bienes_count": 4,
            "centros_culturales_n": 0,
            "fondos_cultura_adjudicados_mclp": 195.4,
            "gasto_municipal_cultura_mclp": 52.6,
            "fndr_8pct_cultura_mclp": 110.0,
            "autoidentificacion_indigena_pct": 32.4,
            "poblacion_indigena_censo_2024_n": 882,
            "comunidades_organizaciones_indigenas_conadi": 4,
            "puntos_cultura_comunitaria_pcc_n": 4
        },
        "11301": {
            "total_espacios_culturales": 5,
            "museos_count": 2,
            "museos_red_regional_count": 3,
            "bibliotecas_publicas_count": 1,
            "monumentos_nacionales_count": 1,
            "monumentos_nacionales_bienes_count": 1,
            "centros_culturales_n": 1,
            "fondos_cultura_adjudicados_mclp": 184.2,
            "gasto_municipal_cultura_mclp": 62.4,
            "fndr_8pct_cultura_mclp": 95.0,
            "autoidentificacion_indigena_pct": 24.5,
            "poblacion_indigena_censo_2024_n": 847,
            "comunidades_organizaciones_indigenas_conadi": 2,
            "puntos_cultura_comunitaria_pcc_n": 4
        },
        "11302": {
            "total_espacios_culturales": 2,
            "museos_count": 1,
            "museos_red_regional_count": 2,
            "bibliotecas_publicas_count": 1,
            "monumentos_nacionales_count": 0,
            "monumentos_nacionales_bienes_count": 0,
            "centros_culturales_n": 0,
            "fondos_cultura_adjudicados_mclp": 45.6,
            "gasto_municipal_cultura_mclp": 21.8,
            "fndr_8pct_cultura_mclp": 38.0,
            "autoidentificacion_indigena_pct": 28.4,
            "poblacion_indigena_censo_2024_n": 184,
            "comunidades_organizaciones_indigenas_conadi": 0,
            "puntos_cultura_comunitaria_pcc_n": 3
        },
        "11303": {
            "total_espacios_culturales": 3,
            "museos_count": 0,
            "museos_red_regional_count": 0,
            "bibliotecas_publicas_count": 1,
            "monumentos_nacionales_count": 2,
            "monumentos_nacionales_bienes_count": 2,
            "centros_culturales_n": 0,
            "fondos_cultura_adjudicados_mclp": 91.0,
            "gasto_municipal_cultura_mclp": 18.5,
            "fndr_8pct_cultura_mclp": 42.0,
            "autoidentificacion_indigena_pct": 40.2,
            "poblacion_indigena_censo_2024_n": 203,
            "comunidades_organizaciones_indigenas_conadi": 1,
            "puntos_cultura_comunitaria_pcc_n": 1
        }
    }

    por_comuna = []
    csv_comunas_rows = []

    total_espacios_reg = 0
    total_museos_reg = 0
    total_museos_red_reg = 0
    total_biblio_reg = 0
    total_mn_reg = 0
    total_mn_bienes_reg = 0
    total_centros_reg = 0
    total_pcc_reg = 0
    total_indigena_n_reg = 0
    total_fondos_reg = 0.0
    total_gasto_mun_reg = 0.0
    total_fndr_reg = 0.0

    for meta in COMUNAS_METADATA:
        cut = meta["comuna_ine"]
        cdata = comunas_cultural_data[cut]
        bdata = baro_metrics[cut]

        pob = meta["poblacion_censo_2024"]
        gasto_mun = cdata["gasto_municipal_cultura_mclp"]
        gasto_per_capita = round((gasto_mun * 1_000_000.0) / pob)

        # Invariante aritmética exacta de espacios
        espacios_calc = (
            cdata["museos_count"]
            + cdata["bibliotecas_publicas_count"]
            + cdata["monumentos_nacionales_count"]
            + cdata["centros_culturales_n"]
        )
        assert espacios_calc == cdata["total_espacios_culturales"], f"Espacios no cuadran en {cut}"

        total_espacios_reg += espacios_calc
        total_museos_reg += cdata["museos_count"]
        total_museos_red_reg += cdata["museos_red_regional_count"]
        total_biblio_reg += cdata["bibliotecas_publicas_count"]
        total_mn_reg += cdata["monumentos_nacionales_count"]
        total_mn_bienes_reg += cdata["monumentos_nacionales_bienes_count"]
        total_centros_reg += cdata["centros_culturales_n"]
        total_pcc_reg += cdata["puntos_cultura_comunitaria_pcc_n"]
        total_indigena_n_reg += cdata["poblacion_indigena_censo_2024_n"]
        total_fondos_reg += cdata["fondos_cultura_adjudicados_mclp"]
        total_gasto_mun_reg += gasto_mun
        total_fndr_reg += cdata["fndr_8pct_cultura_mclp"]

        comuna_entry = {
            "codigo_comuna": meta["codigo_comuna"],
            "comuna_ine": cut,
            "nombre_comuna": meta["nombre_comuna"],
            "provincia": meta["provincia"],
            "cabecera": meta["cabecera"],
            "codigo_cuenca": meta["codigo_cuenca"],
            "lat": meta["lat"],
            "lng": meta["lng"],
            "source_url": meta["source_url"],
            "datos": {
                "total_espacios_culturales": espacios_calc,
                "museos_count": cdata["museos_count"],
                "museos_red_regional_count": cdata["museos_red_regional_count"],
                "bibliotecas_publicas_count": cdata["bibliotecas_publicas_count"],
                "monumentos_nacionales_count": cdata["monumentos_nacionales_count"],
                "monumentos_nacionales_bienes_count": cdata["monumentos_nacionales_bienes_count"],
                "centros_culturales_n": cdata["centros_culturales_n"],
                "puntos_cultura_comunitaria_pcc_n": cdata["puntos_cultura_comunitaria_pcc_n"],
                "fondos_cultura_adjudicados_mclp": cdata["fondos_cultura_adjudicados_mclp"],
                "gasto_municipal_cultura_mclp": gasto_mun,
                "gasto_cultura_per_capita_clp": gasto_per_capita,
                "fndr_8pct_cultura_mclp": cdata["fndr_8pct_cultura_mclp"],
                "autoidentificacion_indigena_pct": cdata["autoidentificacion_indigena_pct"],
                "poblacion_indigena_censo_2024_n": cdata["poblacion_indigena_censo_2024_n"],
                "comunidades_organizaciones_indigenas_conadi": cdata["comunidades_organizaciones_indigenas_conadi"],
                "nota_percepcion_cultura_b4b": bdata["b4b"],
                "participacion_cultural_pct_c2": bdata["c2"],
                "semaforo_muestral_barometro": bdata["semaforo"],
                "origen_dato": "observado_oficial"
            }
        }
        por_comuna.append(comuna_entry)

        # Fila CSV de 14 columnas exactas (contrato M2)
        csv_row = [
            meta["codigo_comuna"],
            cut,
            meta["nombre_comuna"],
            espacios_calc,
            cdata["museos_count"],
            cdata["bibliotecas_publicas_count"],
            cdata["monumentos_nacionales_count"],
            cdata["fondos_cultura_adjudicados_mclp"],
            gasto_mun,
            gasto_per_capita,
            cdata["fndr_8pct_cultura_mclp"],
            bdata["b4b"],
            bdata["c2"],
            "observado_oficial"
        ]
        csv_comunas_rows.append(csv_row)

    resumen_regional = {
        "total_espacios_culturales_regional": total_espacios_reg,
        "total_museos_rmc": total_museos_reg,
        "total_museos_red_regional": total_museos_red_reg,
        "total_bibliotecas_snbp": total_biblio_reg,
        "total_monumentos_nacionales_cmn": total_mn_reg,
        "total_monumentos_nacionales_bienes_cmn": total_mn_bienes_reg,
        "total_monumentos_publicos_cmn": 11,
        "total_centros_culturales_municipales": total_centros_reg,
        "total_puntos_cultura_comunitaria_pcc": total_pcc_reg,
        "visitas_museo_regional_aysen_2025": 36173,
        "visitas_museo_regional_aysen_2024": 28490,
        "ranking_nacional_mra_snm_2025": 12,
        "prestamos_fisicos_snbp_2024": 31221,
        "socios_activos_snbp_2024": 7591,
        "sesiones_biblioredes_2024": 28344,
        "participacion_cultural_urbana_enpccl_2024_pct": 62.0,
        "participacion_cultural_urbana_nacional_enpccl_2024_pct": 75.4,
        "fondos_cultura_adjudicados_acumulado_mclp": round(total_fondos_reg, 1),
        "gasto_municipal_cultura_anual_regional_mclp": round(total_gasto_mun_reg, 1),
        "fndr_8pct_cultura_anual_regional_mclp": round(total_fndr_reg, 1),
        "nota_percepcion_cultura_regional_b4b": 4.04,
        "nota_percepcion_cultura_microdatos_b4b": 4.04,
        "tasa_positiva_cultura_b4b_pct": 40.2,
        "participacion_cultural_pct_regional_c2": 42.8,
        "participacion_cultural_microdatos_c2_pct": 46.9,
        "cultores_patrimonio_inmaterial_total": 313,
        "organizaciones_comunitarias_total": 392,
        "pueblos_originarios": {
            "autoidentificacion_regional_pct": 29.0,
            "fuente_medicion": "Censo de Población y Vivienda 2024 INE (BCN Reporte Distrital 27, 2026) y CONADI SIIC (ago-2025)",
            "poblacion_indigena_estimada": total_indigena_n_reg,
            "poblacion_indigena_censo_2024": total_indigena_n_reg,
            "pueblo_predominante": "Mapuche-Huilliche (93%) con presencia histórica y territorial de pueblos canoeros Chonos y Kawésqar",
            "comuna_maxima_densidad": "Guaitecas (57.9% autoidentificacion, 926 personas)",
            "total_comunidades_conadi_registradas": 47,
            "familias_comunidades_conadi_siic": 490,
            "asociaciones_indigenas_funcionales_ley_19253": 27,
            "total_organizaciones_indigenas_comunidades_y_asociaciones": 74,
            "nota_asimetria_juridica": "CONADI SIIC (ago-2025) registra 47 Comunidades Indígenas vigentes (Art. 9° Ley 19.253, 490 familias, 0,93% del total nacional de 5.073). El agregado territorial de 74 organizaciones combina esas 47 Comunidades con 27 Asociaciones Indígenas funcionales (Art. 76° Ley 19.253) mediante las cuales se articulan comunas sin tierras indígenas tituladas por el Estado (Cisnes 34,9%, Tortel 40,2% Asoc. Menco, Chile Chico 26,0% Antu Ñi Fotum, Cochrane 24,5% Manqui y Lago Verde 28,2% Mari Mari).",
            "solicitudes_ecmpo_lafkenche_ha": 621000.0,
            "ecmpos_emblematicas": "Pu Wapi (Cisnes, ~227.000 ha) y Antunen Rain (Islas Huichas, ~394.000 ha)"
        },
        "financiamiento_cultural_detalle_2022_2026": {
            "fuente": "MINCAP Fondos Cultura (2022-2026), Estrategia Quinquenal Regional Aysén 2024-2029 y GORE Aysén FNDR 8%",
            "convocatorias_anuales_mincap": {
                "2022": {
                    "proyectos_concursables_base": 43,
                    "monto_concursables_mclp": 512.9,
                    "desglose_lineas": "Fondart Regional: 37 ($365.914.340), Libro: 7 ($59.671.052), Música: 3 ($34.598.492), Artes Escénicas: 2 ($52.686.675), Fondart Nacional: 2",
                    "paocc_proyectos": 3,
                    "paocc_monto_clp": 177472040,
                    "fondo_patrimonio_clp": 25000000,
                    "mejoramiento_museos_proyectos": 5,
                    "mejoramiento_museos_clp": 200354122
                },
                "2023": {
                    "proyectos_primeras_entregas": 51,
                    "monto_referencial_mclp": 300.0
                },
                "2024": {
                    "proyectos_seleccionados": 54,
                    "monto_total_clp": 477389400,
                    "variacion_vs_2022_pct": 30.0,
                    "empleos_culturales_estimados": 140,
                    "desglose": "22 Fondart Regional, 6 Fondart Nacional, 4 Artes Escénicas, 3 Fondo del Libro + 19 de 1a entrega"
                },
                "2025": {
                    "proyectos_seleccionados": 57,
                    "monto_total_mclp": 1007.0,
                    "comunas_cubiertas": 9,
                    "distribucion_territorial": "~28 Coyhaique, 9 Aysén, 5 Chile Chico, 4 Cisnes, 3 Tortel y 8 en otras 4 comunas rurales",
                    "empleos_culturales": 202,
                    "empleabilidad_femenina_pct": 64.0
                },
                "2026_primera_entrega": {
                    "proyectos_seleccionados": 9,
                    "detalle": "Primeras 15 líneas nacionales dic-2025 (4 Becas Chile Crea, FIMP, Festival Patagonia en Escena Malotun y II Encuentro Textil de Puyuhuapi)"
                }
            },
            "paocc_2025_2026": {
                "organizaciones_2026": 5,
                "concurso_2026": ["Escuela de Danzas Zíngara (#17 nacional)", "Teatro Austral"],
                "glosa_presupuestaria_2026": ["Agrupación Malotun Ortiga", "Corporación Memoria Austral", "Pulso Austral"],
                "coyhaique_jun_2025_mclp": 32.0
            },
            "red_cultura_2026": {
                "espacios_comunitarios_jul_2026": 7,
                "comunas_espacios": ["Aysén (Espacio Abierto, Espacio Kinesis, Casa Alerce, La Polilla Mañihuales)", "Cisnes (Micelio)", "Cochrane (Café Tero)", "O'Higgins (Taller El Bosque)"],
                "transferencia_municipios_nov_2026_clp": 61000000,
                "municipios_beneficiados_nov_2026": ["Coyhaique", "Aysén", "Tortel", "Lago Verde"],
                "planes_gestion_financiados": 6
            },
            "fndr_8pct_gore_aysen": {
                "monto_concurso_global_2025_mclp": 5681.0,
                "iniciativas_adjudicadas_2025": 355,
                "postulaciones_ingresadas_2025": 1240,
                "iniciativas_admisibles_2025": 672,
                "programa_2026": "Aysén Crece en Comunidad (Res. Ex. N° 83 y N° 115 de enero de 2026)"
            }
        },
        "sitios_paleo_arqueologicos": [
            {
                "id": "SIT-ARQ-01",
                "nombre": "Cueva Bano Nuevo 1",
                "comuna": "Coyhaique",
                "antiguedad": "10.200 AP",
                "categoria": "Sitio Arqueologico y Bioantropologico",
                "descripcion": "Conjunto funerario mas antiguo de la Patagonia con 10 esqueletos humanos y fauna pleistocenica extinta"
            },
            {
                "id": "SIT-ARQ-02",
                "nombre": "Paredon de las Manos",
                "comuna": "Rio Ibanez",
                "antiguedad": "3.000 a 6.000 AP",
                "categoria": "Monumento Arqueologico (Ley N° 17.288) / Arte Rupestre Tehuelche",
                "descripcion": "Alero rocoso con improntas de manos en negativo y 28 sitios de arte rupestre protegidos por el solo ministerio de la Ley N° 17.288"
            },
            {
                "id": "SIT-PAL-03",
                "nombre": "Formacion Toqui (Mallin Grande)",
                "comuna": "Chile Chico",
                "antiguedad": "148 Ma (Jurasico Superior)",
                "categoria": "Yacimiento Paleontologico de Interes Mundial",
                "descripcion": "Yacimiento de descubrimiento del fosil de Chilesaurus diegosuarezi, dinosaurio teropodo herbivoro unico protegido por la Ley N° 17.288"
            }
        ],
        "patrimonio_inmaterial_sigpa": {
            "fuente": "SERPAT - Sistema de Informacion para la Gestion del Patrimonio Cultural Inmaterial (SIGPA)",
            "expresiones_destacadas": [
                {
                    "expresion": "Maestros tejueleros de cipres de las Guaitecas",
                    "cultores_estimados": 45,
                    "estado": "En riesgo de extincion por trabas a madera muerta y falta de aprendices",
                    "territorio": "Litoral norte y archipielagos (Melinka, Tortel, Cisnes)"
                },
                {
                    "expresion": "Carpinteros de ribera y constructores navales artesanales",
                    "cultores_estimados": 28,
                    "estado": "Vulnerable, activo en caletas pesqueras",
                    "territorio": "Puerto Aguirre, Puerto Gala, Puerto Gaviota, Melinka"
                },
                {
                    "expresion": "Jineteadas gauchas, chamame y tradiciones camperas patagonicas",
                    "cultores_estimados": 240,
                    "estado": "Vigorosa, 38 clubes camperos organizados",
                    "territorio": "Puerto Ibanez, Cochrane, Villa Manihuales, Lago Verde, Coyhaique"
                }
            ]
        },
        "tejido_asociativo": {
            "fuente": "Registro Civil / SUBDERE / INDAP / SERNAPESCA",
            "juntas_de_vecinos_ley_19418_total": 248,
            "sindicatos_pescadores_artesanales_total": 45,
            "agrupaciones_mujeres_rurales_total": 22,
            "clubes_huasos_y_jineteada_total": 38,
            "comites_campesinos_productores_total": 31
        },
        "paradoja_gasto_cultural_rural_urbano": {
            "gasto_per_capita_coyhaique_clp": 11850,
            "gasto_per_capita_lago_verde_clp": 43537,
            "gasto_per_capita_tortel_clp": 32860,
            "concentracion_fondos_mincap_coyhaique_pct": 55.9,
            "explicacion": "Paradoja de escala demografica sobre Censo 2024: la baja poblacion en comunas rurales eleva el gasto municipal per capita ($43.537 en Lago Verde y $32.860 en Tortel), mientras el 55,9% del monto concursable acumulado MINCAP se concentra en Coyhaique."
        }
    }

    json_dataset = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "version": "2.0.0",
        "work_package": "WP_09",
        "dataset_id": "09_cultura_patrimonio",
        "titulo": "Cultura, Artes y Patrimonio: Catastro CMN (16/23), RMC (16/27), SNBP (16), Fondos MINCAP, CONADI SIIC, 25 PCC y Barómetro (N=465)",
        "region": "Región de Aysén del General Carlos Ibáñez del Campo",
        "fecha_extraccion": "2026-11-27T00:00:00Z",
        "fuentes_primarias": [
            {
                "nombre": "Servicio Nacional del Patrimonio Cultural (SERPAT) / IDE Patrimonio / CMN / RMC / SNBP",
                "url": "https://ide.patrimoniocultural.gob.cl/",
                "cobertura": "16 declaratorias CMN (23 bienes), 16 museos activos RMC (27 Red Regional), 16 bibliotecas SNBP (31.221 préstamos 2024), SIGPA"
            },
            {
                "nombre": "Ministerio de las Culturas, las Artes y el Patrimonio (MINCAP)",
                "url": "https://www.fondosdecultura.cl/",
                "cobertura": "Fondos de Cultura 2022-2026, PAOCC, Red Cultura, 25 Puntos de Cultura Comunitaria (PCC) y ENPCCL 2024 (62,0%)"
            },
            {
                "nombre": "Instituto Nacional de Estadísticas (INE) Censo 2024 / BCN Distrito 27 / CONADI SIIC",
                "url": "https://www.bcn.cl/siit/reportesdistritales/reporte_final.html?anno=2026&distrito=27",
                "cobertura": "Padrón Censo 2024, autoidentificación pueblos originarios (29,0%, 29.230 hab.) y 47 Comunidades Indígenas SIIC CONADI (490 familias)"
            },
            {
                "nombre": "Gobierno Regional de Aysén / SINIM",
                "url": "https://www.goreaysen.cl/",
                "cobertura": "FNDR 8% Cultura y Patrimonio (2025: $5.681M / 355 iniciativas) y gasto municipal Área 03 SINIM"
            },
            {
                "nombre": "Barómetro Regional UAYSÉN (N=465)",
                "url": "https://www.uaysen.cl/",
                "cobertura": "Indicadores empíricos B4_B (media regional 4,04, tasa positiva 40,2%) y C2 con semáforo muestral comunal"
            }
        ],
        "resumen_regional": resumen_regional,
        "por_comuna": por_comuna,
        "nodos_georreferenciados": NODOS_CULTURA
    }

    # Guardar JSON con reemplazo explícito de las secciones reconciliadas del Sprint 12
    json_path = SYSTEMIC_DIR / "09_cultura_patrimonio.json"
    if str(Path(__file__).resolve().parent) not in sys.path:
        sys.path.insert(0, str(Path(__file__).resolve().parent))
    from non_destructive_merge import save_systemic_json_non_destructive
    save_systemic_json_non_destructive(
        json_path,
        json_dataset,
        live_overrides={
            "version": json_dataset["version"],
            "titulo": json_dataset["titulo"],
            "fecha_extraccion": json_dataset["fecha_extraccion"],
            "fuentes_primarias": json_dataset["fuentes_primarias"],
            "resumen_regional": json_dataset["resumen_regional"],
            "por_comuna": json_dataset["por_comuna"],
            "nodos_georreferenciados": json_dataset["nodos_georreferenciados"],
        },
    )
    print(f"JSON generado exitosamente: {json_path}")

    # Guardar CSV Comunas (14 columnas exactas con UTF-8 BOM y LF)
    comunas_header = [
        "codigo_comuna", "comuna_ine", "nombre_comuna", "total_espacios_culturales",
        "museos_count", "bibliotecas_publicas_count", "monumentos_nacionales_count",
        "fondos_cultura_adjudicados_mclp", "gasto_municipal_cultura_mclp",
        "gasto_cultura_per_capita_clp", "fndr_8pct_cultura_mclp",
        "nota_percepcion_cultura_b4b", "participacion_cultural_pct_c2", "origen_dato"
    ]
    csv_comunas_path = CSV_DIR / "09_cultura_patrimonio_comunas.csv"
    with open(csv_comunas_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f, lineterminator="\n")
        writer.writerow(comunas_header)
        writer.writerows(csv_comunas_rows)
    print(f"CSV Comunas generado exitosamente: {csv_comunas_path}")

    # Guardar CSV Nodos con UTF-8 BOM y LF
    nodos_header = [
        "id", "nombre", "tipo", "codigo_comuna", "comuna_ine", "lat", "lng", "lon",
        "source_url", "categoria", "subcategoria", "descripcion", "origen_dato"
    ]
    csv_nodos_path = CSV_DIR / "09_cultura_patrimonio_nodos.csv"
    with open(csv_nodos_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f, lineterminator="\n")
        writer.writerow(nodos_header)
        for n in NODOS_CULTURA:
            writer.writerow([
                n["id"], n["nombre"], n["tipo"], n["codigo_comuna"], n["comuna_ine"],
                n["lat"], n["lng"], n["lon"], n["source_url"], n["categoria"],
                n["subcategoria"], n["descripcion"], n["origen_dato"]
            ])
    print(f"CSV Nodos generado exitosamente: {csv_nodos_path}")

    # Guardar respaldo raw estructurado sin BOM y con LF
    raw_snapshot_path = RAW_DIR / "serpat_catastro_monumentos_museos_bibliotecas_raw.json"
    with open(raw_snapshot_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump({
            "fuente": "SERPAT (CMN 16/23, RMC 16/27, SNBP 16/31.221) / MINCAP (25 PCC, ENPCCL 62,0%) / SINIM / GORE Aysén / CONADI SIIC (47)",
            "fecha_snapshot": "2026-11-27T00:00:00Z",
            "nodos": NODOS_CULTURA,
            "resumen": json_dataset["resumen_regional"]
        }, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Respaldo raw guardado: {raw_snapshot_path}")


if __name__ == "__main__":
    print("Iniciando pipeline de ingesta WP_10 Cultura y Patrimonio...")
    build_cultura_dataset()
    print("Pipeline WP_10 Cultura y Patrimonio finalizado con exito.")
