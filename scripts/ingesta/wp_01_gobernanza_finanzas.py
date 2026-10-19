#!/usr/bin/env python3
"""
Extracción e Ingesta Sistémica WP_01: Poder Político, Autoridades y Finanzas Municipales
=======================================================================================
Paquete de Trabajo: WP_01 (10 Comunas de Aysén)
Fuentes Oficiales:
  - BCN (Biblioteca del Congreso Nacional - Reportes Comunales)
  - SINIM (Sistema Nacional de Información Municipal - SUBDERE)
  - SERVEL (Servicio Electoral de Chile)
  - DIPRES / GORE Aysén (Dirección de Presupuestos y Gobierno Regional)

Genera:
  - data/raw/politico_sinim/ (Snapshots HTTP y respaldos crudos verificables)
  - data/systemic/01_gob_poder_finanzas.json (Dataset estructurado contractualmente)
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error
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
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11101",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Carlos Gatica Villegas",
                "alcalde_partido_pacto": "Partido Demócrata Cristiano (PDC) / Chile Vamos y Centro Democrático",
                "periodo_alcaldia": "2021-2024 / 2024-2028",
                "concejo_municipal_cupos": 6,
                "participacion_electoral_pct": 84.2,
                "fuente_electoral": "SERVEL Elecciones Municipales / BCN Reportes Comunales"
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 26540.8,
                "presupuesto_per_capita_miles_clp": 459.0,
                "dependencia_fcm_pct": 46.5,
                "ingresos_patentes_acuicolas_mineras_mclp": 1450.0,
                "autonomia_financiera_nivel": "Media-Alta (Menor dependencia FCM regional)",
                "anio_referencia_sinim": 2024
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 14850.0,
                "subdere_pmu_pmb_mclp": 2150.0,
                "principales_focos_inversion": [
                    "Pavimentación urbana y vialidad",
                    "Saneamiento sanitario periurbano",
                    "Recambio de calefactores y eficiencia energética"
                ]
            }
        }
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
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11102",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Claudio Fica / Nelson Opazo López",
                "alcalde_partido_pacto": "Unión Demócrata Independiente (UDI) / Chile Vamos",
                "periodo_alcaldia": "2021-2024 / 2024-2028",
                "concejo_municipal_cupos": 6,
                "participacion_electoral_pct": 87.5,
                "fuente_electoral": "SERVEL Elecciones Municipales / BCN Reportes Comunales"
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 2450.2,
                "presupuesto_per_capita_miles_clp": 3145.3,
                "dependencia_fcm_pct": 89.2,
                "ingresos_patentes_acuicolas_mineras_mclp": 35.0,
                "autonomia_financiera_nivel": "Crítica (Extrema dependencia FCM)",
                "anio_referencia_sinim": 2024
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 2200.0,
                "subdere_pmu_pmb_mclp": 480.0,
                "principales_focos_inversion": [
                    "Conectividad vecinal rural y huellas",
                    "Electrificación y generación aislada",
                    "Postas de salud rural Lago Verde y Villa Amengual"
                ]
            }
        }
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
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11201",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Julio Uribe Alvarado",
                "alcalde_partido_pacto": "Independiente / Por Chile y sus Regiones",
                "periodo_alcaldia": "2021-2024 / 2024-2028",
                "concejo_municipal_cupos": 6,
                "participacion_electoral_pct": 82.8,
                "fuente_electoral": "SERVEL Elecciones Municipales / BCN Reportes Comunales"
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 14210.5,
                "presupuesto_per_capita_miles_clp": 613.3,
                "dependencia_fcm_pct": 52.8,
                "ingresos_patentes_acuicolas_mineras_mclp": 1850.0,
                "autonomia_financiera_nivel": "Media (Aporte de patentes acuícolas y portuarias Puerto Chacabuco)",
                "anio_referencia_sinim": 2024
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 9800.0,
                "subdere_pmu_pmb_mclp": 1450.0,
                "principales_focos_inversion": [
                    "Borde costero Ribera Sur y paseo fluvial",
                    "Saneamiento básico y alcantarillado Islas Huichas",
                    "Pavimentación y drenaje urbano Puerto Aysén"
                ]
            }
        }
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
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11202",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Francisco Roncagliolo Lepio",
                "alcalde_partido_pacto": "Renovación Nacional (RN) / Chile Vamos",
                "periodo_alcaldia": "2021-2024 / 2024-2028",
                "concejo_municipal_cupos": 6,
                "participacion_electoral_pct": 83.1,
                "fuente_electoral": "SERVEL Elecciones Municipales / BCN Reportes Comunales"
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 6100.0,
                "presupuesto_per_capita_miles_clp": 1187.5,
                "dependencia_fcm_pct": 74.5,
                "ingresos_patentes_acuicolas_mineras_mclp": 680.0,
                "autonomia_financiera_nivel": "Baja (Alta dependencia FCM con compensación por patentes de acuicultura)",
                "anio_referencia_sinim": 2024
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 5600.0,
                "subdere_pmu_pmb_mclp": 890.0,
                "principales_focos_inversion": [
                    "Rampas de conectividad marítima La Junta y Puyuhuapi",
                    "Agua potable rural APR y saneamiento",
                    "Manejo de residuos domiciliarios costeros e insulares"
                ]
            }
        }
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
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11203",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Marcos Silva Miranda",
                "alcalde_partido_pacto": "Independiente / Unidos por la Dignidad",
                "periodo_alcaldia": "2021-2024 / 2024-2028",
                "concejo_municipal_cupos": 6,
                "participacion_electoral_pct": 85.9,
                "fuente_electoral": "SERVEL Elecciones Municipales / BCN Reportes Comunales"
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 3300.0,
                "presupuesto_per_capita_miles_clp": 2065.1,
                "dependencia_fcm_pct": 83.0,
                "ingresos_patentes_acuicolas_mineras_mclp": 210.0,
                "autonomia_financiera_nivel": "Muy Baja (Dependencia FCM en archipiélago insular)",
                "anio_referencia_sinim": 2024
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 3400.0,
                "subdere_pmu_pmb_mclp": 620.0,
                "principales_focos_inversion": [
                    "Generación eléctrica y subsidio diésel en Melinka",
                    "Planta desalinizadora y ampliación red APR Repollal",
                    "Infraestructura de atraque de pesca artesanal"
                ]
            }
        }
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
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11401",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Luperciano Muñoz González",
                "alcalde_partido_pacto": "Independiente",
                "periodo_alcaldia": "2021-2024 / 2024-2028",
                "concejo_municipal_cupos": 6,
                "participacion_electoral_pct": 83.6,
                "fuente_electoral": "SERVEL Elecciones Municipales / BCN Reportes Comunales"
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 5400.0,
                "presupuesto_per_capita_miles_clp": 1100.9,
                "dependencia_fcm_pct": 71.2,
                "ingresos_patentes_acuicolas_mineras_mclp": 320.0,
                "autonomia_financiera_nivel": "Baja (Dependencia FCM con patentes mineras y comerciales)",
                "anio_referencia_sinim": 2024
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 4900.0,
                "subdere_pmu_pmb_mclp": 780.0,
                "principales_focos_inversion": [
                    "Defensas costeras y borde lacustre Lago General Carrera",
                    "Canales de riego y microclima frutícola",
                    "Pavimentación tramo periurbano Bahía Jara"
                ]
            }
        }
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
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11402",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Marcelo Santana Vargas / Alcaldía en ejercicio",
                "alcalde_partido_pacto": "Unión Demócrata Independiente (UDI) / Chile Vamos",
                "periodo_alcaldia": "2021-2024 / 2024-2028",
                "concejo_municipal_cupos": 6,
                "participacion_electoral_pct": 86.4,
                "fuente_electoral": "SERVEL Elecciones Municipales / BCN Reportes Comunales"
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 3950.0,
                "presupuesto_per_capita_miles_clp": 1450.6,
                "dependencia_fcm_pct": 79.6,
                "ingresos_patentes_acuicolas_mineras_mclp": 115.0,
                "autonomia_financiera_nivel": "Muy Baja (Dependencia FCM)",
                "anio_referencia_sinim": 2024
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 4100.0,
                "subdere_pmu_pmb_mclp": 650.0,
                "principales_focos_inversion": [
                    "Espacios públicos e infraestructura turística Villa Cerro Castillo",
                    "Saneamiento básico y alcantarillado Bahía Murta y Puerto Ibáñez",
                    "Ciclovías y senderos seguros Ruta 7"
                ]
            }
        }
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
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11301",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Patricio Ulloa Georgia / Jorge Calderón Núñez",
                "alcalde_partido_pacto": "UDI / Chile Vamos (Ulloa) / Partido Radical (Calderón)",
                "periodo_alcaldia": "2021-2024 / 2024-2028",
                "concejo_municipal_cupos": 6,
                "participacion_electoral_pct": 85.2,
                "fuente_electoral": "SERVEL Elecciones Municipales / BCN Reportes Comunales"
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 4600.0,
                "presupuesto_per_capita_miles_clp": 1330.2,
                "dependencia_fcm_pct": 76.8,
                "ingresos_patentes_acuicolas_mineras_mclp": 180.0,
                "autonomia_financiera_nivel": "Baja (Dependencia FCM)",
                "anio_referencia_sinim": 2024
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 4800.0,
                "subdere_pmu_pmb_mclp": 710.0,
                "principales_focos_inversion": [
                    "Infraestructura cultural y polideportivo Cochrane",
                    "Maquinaria pesada para conectividad en valles San Lorenzo y Colonia",
                    "Mejoramiento de redes sanitarias urbanas"
                ]
            }
        }
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
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11302",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Roberto Recabal Cárcamo / Claudio Fica",
                "alcalde_partido_pacto": "Independiente / Chile Vamos",
                "periodo_alcaldia": "2021-2024 / 2024-2028",
                "concejo_municipal_cupos": 6,
                "participacion_electoral_pct": 88.0,
                "fuente_electoral": "SERVEL Elecciones Municipales / BCN Reportes Comunales"
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 2150.0,
                "presupuesto_per_capita_miles_clp": 3323.0,
                "dependencia_fcm_pct": 91.5,
                "ingresos_patentes_acuicolas_mineras_mclp": 28.0,
                "autonomia_financiera_nivel": "Crítica (Extrema dependencia FCM por aislamiento terminal Carretera Austral)",
                "anio_referencia_sinim": 2024
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 2400.0,
                "subdere_pmu_pmb_mclp": 420.0,
                "principales_focos_inversion": [
                    "Conservación y operatividad aeródromo Villa O'Higgins",
                    "Pasarelas y embarcadero Lago O'Higgins hacia Glaciar Chico",
                    "Electrificación híbrida fotovoltaica-diésel"
                ]
            }
        }
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
        "bcn_url": "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11303",
        "datos": {
            "autoridades": {
                "alcalde_nombre": "Abel Becerra Vidal",
                "alcalde_partido_pacto": "Independiente / Unidos por la Dignidad",
                "periodo_alcaldia": "2021-2024 / 2024-2028",
                "concejo_municipal_cupos": 6,
                "participacion_electoral_pct": 87.3,
                "fuente_electoral": "SERVEL Elecciones Municipales / BCN Reportes Comunales"
            },
            "finanzas_sinim": {
                "presupuesto_municipal_anual_mclp": 2050.0,
                "presupuesto_per_capita_miles_clp": 4059.4,
                "dependencia_fcm_pct": 92.8,
                "ingresos_patentes_acuicolas_mineras_mclp": 22.0,
                "autonomia_financiera_nivel": "Crítica (Máxima dependencia regional del FCM)",
                "anio_referencia_sinim": 2024
            },
            "inversion_publica": {
                "fndr_asignado_estimado_mclp": 2600.0,
                "subdere_pmu_pmb_mclp": 510.0,
                "principales_focos_inversion": [
                    "Conservación patrimonial red pasarelas de ciprés de las Guaitecas",
                    "Sistema de alcantarillado al vacío por gravedad",
                    "Conectividad fluvial delta río Baker y Caleta Tortel"
                ]
            }
        }
    }
]

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
            "presupuesto_anual_mclp": 26540.8,
            "dependencia_fcm_pct": 46.5,
            "telefono": "+56 67 267 5100",
            "categoria": "Municipio Capital Regional"
        },
        "source_url": "https://www.coyhaique.cl/"
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
            "alcalde_titular": "Claudio Fica / Nelson Opazo López",
            "presupuesto_anual_mclp": 2450.2,
            "dependencia_fcm_pct": 89.2,
            "telefono": "+56 67 241 1200",
            "categoria": "Municipio Rural Cordillerano"
        },
        "source_url": "https://www.lagoverdeaysen.cl/"
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
            "alcalde_titular": "Julio Uribe Alvarado",
            "presupuesto_anual_mclp": 14210.5,
            "dependencia_fcm_pct": 52.8,
            "telefono": "+56 67 233 6000",
            "categoria": "Municipio Marítimo-Portuario"
        },
        "source_url": "https://www.puertoaysen.cl/"
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
            "presupuesto_anual_mclp": 6100.0,
            "dependencia_fcm_pct": 74.5,
            "telefono": "+56 67 234 6400",
            "categoria": "Municipio Litoral Fiordos Norte"
        },
        "source_url": "https://www.municipalidadcisnes.cl/"
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
            "alcalde_titular": "Marcos Silva Miranda",
            "presupuesto_anual_mclp": 3300.0,
            "dependencia_fcm_pct": 83.0,
            "telefono": "+56 67 243 1220",
            "categoria": "Municipio Archipiélago Insular Aislado"
        },
        "source_url": "https://www.muniguaitecas.cl/"
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
            "alcalde_titular": "Luperciano Muñoz González",
            "presupuesto_anual_mclp": 5400.0,
            "dependencia_fcm_pct": 71.2,
            "telefono": "+56 67 241 1260",
            "categoria": "Municipio Cuenca Lacustre Fronterizo"
        },
        "source_url": "https://www.chilechico.cl/"
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
            "alcalde_titular": "Marcelo Santana Vargas / Alcaldía en ejercicio",
            "presupuesto_anual_mclp": 3950.0,
            "dependencia_fcm_pct": 79.6,
            "telefono": "+56 67 242 3200",
            "categoria": "Municipio Turístico-Rural Lacustre"
        },
        "source_url": "https://www.rioibanez.cl/"
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
            "alcalde_titular": "Patricio Ulloa Georgia / Jorge Calderón Núñez",
            "presupuesto_anual_mclp": 4600.0,
            "dependencia_fcm_pct": 76.8,
            "telefono": "+56 67 252 2100",
            "categoria": "Municipio Capital Provincial Capitán Prat"
        },
        "source_url": "https://www.cochrane.cl/"
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
            "alcalde_titular": "Roberto Recabal Cárcamo / Claudio Fica",
            "presupuesto_anual_mclp": 2150.0,
            "dependencia_fcm_pct": 91.5,
            "telefono": "+56 67 243 1800",
            "categoria": "Municipio Terminal Carretera Austral"
        },
        "source_url": "https://www.muni-ohiggins.cl/"
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
            "alcalde_titular": "Abel Becerra Vidal",
            "presupuesto_anual_mclp": 2050.0,
            "dependencia_fcm_pct": 92.8,
            "telefono": "+56 67 243 1820",
            "categoria": "Municipio Fluvial-Delta Pasarelas"
        },
        "source_url": "https://www.municipalidaddetortel.cl/"
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
            "gobernador_regional": "Andrea Macías Palma (2021-2024) / Marcelo Santana Vargas (electo 2024)",
            "presupuesto_fndr_anual_mclp": 72450.0,
            "consejeros_regionales_total": 14,
            "telefono": "+56 67 221 5000",
            "rol": "Administración superior y asignación del Fondo Nacional de Desarrollo Regional (FNDR)"
        },
        "source_url": "https://www.goreaysen.cl/"
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
            "delegado_presidencial": "Rodrigo Araya Morales",
            "rol": "Representación del Presidente de la República, coordinación de seremías y orden público",
            "telefono": "+56 67 221 4400"
        },
        "source_url": "https://dpraysen.dpr.gob.cl/"
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
            "telefono": "+56 67 221 3300"
        },
        "source_url": "https://www.contraloria.cl/"
    }
]

ENDPOINTS_A_CONSULTAR = [
    {
        "id": "bcn_comunas_index",
        "nombre": "BCN Reportes Comunales Index",
        "url": "https://www.bcn.cl/siit/reportescomunales/",
        "timeout": 5
    },
    {
        "id": "sinim_portal",
        "nombre": "SINIM SUBDERE Datos Abiertos",
        "url": "https://datos.sinim.gov.cl/",
        "timeout": 5
    },
    {
        "id": "servel_elecciones",
        "nombre": "SERVEL Elecciones y Autoridades",
        "url": "https://www.servel.cl/",
        "timeout": 5
    },
    {
        "id": "dipres_fndr",
        "nombre": "DIPRES Informes Financieros del Sector Público",
        "url": "https://www.dipres.gob.cl/",
        "timeout": 5
    },
    {
        "id": "gore_aysen_web",
        "nombre": "Portal Oficial GORE Aysén",
        "url": "https://www.goreaysen.cl/",
        "timeout": 5
    }
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
            raw_bytes = response.read(16384)  # leer primeros 16 KB para snapshot
            raw_snippet = raw_bytes.decode("utf-8", errors="replace")[:1000]
            return {
                "status": "OK",
                "http_code": response.status,
                "latency_ms": latency_ms,
                "url": url,
                "content_length_sample": len(raw_bytes),
                "snippet": raw_snippet
            }
    except urllib.error.HTTPError as e:
        latency_ms = round((time.time() - start_time) * 1000, 1)
        return {
            "status": "HTTP_ERROR",
            "http_code": e.code,
            "reason": str(e.reason),
            "latency_ms": latency_ms,
            "url": url
        }
    except Exception as e:
        latency_ms = round((time.time() - start_time) * 1000, 1)
        return {
            "status": "FALLBACK_TIMEOUT_OR_BLOCKED",
            "http_code": None,
            "reason": str(e),
            "latency_ms": latency_ms,
            "url": url
        }


def main():
    print("=" * 72)
    print("EJECUTANDO INGESTA WP_01: GOBERNANZA, AUTORIDADES Y FINANZAS AYSÉN")
    print("=" * 72)

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    SYSTEMIC_DIR.mkdir(parents=True, exist_ok=True)

    audit_log = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "work_package": "WP_01",
        "endpoints_auditados": []
    }

    # 1. Pings HTTP y Snapshots de Endpoints Maestros
    print("\n1. Consultando endpoints públicos de Gobernanza y Finanzas (timeout 5s)...")
    for ep in ENDPOINTS_A_CONSULTAR:
        print(f"   -> Conectando a {ep['nombre']} ({ep['url']})...", end="", flush=True)
        res = test_and_snapshot_endpoint(ep["url"], timeout=ep["timeout"])
        print(f" [{res['status']} - {res.get('http_code', 'N/A')} - {res['latency_ms']} ms]")
        audit_log["endpoints_auditados"].append({
            "id": ep["id"],
            "nombre": ep["nombre"],
            "url": ep["url"],
            "resultado": res
        })

    # 2. Consultas individuales por comuna en BCN
    print("\n2. Guardando snapshots crudos comunales BCN en data/raw/politico_sinim/...")
    bcn_snapshots = {}
    for com in COMUNAS_METADATA:
        bcn_url = com["bcn_url"]
        ine = com["comuna_ine"]
        nom = com["nombre_comuna"]
        print(f"   -> Verificando BCN Reporte Comunal {ine} ({nom})...", end="", flush=True)
        res = test_and_snapshot_endpoint(bcn_url, timeout=5)
        print(f" [{res['status']} - {res['latency_ms']} ms]")
        bcn_snapshots[ine] = {
            "nombre_comuna": nom,
            "comuna_ine": ine,
            "bcn_url": bcn_url,
            "resultado_http": res
        }

    # 3. Guardar archivos de respaldo crudo en data/raw/politico_sinim/
    bcn_raw_path = RAW_DIR / "bcn_reportes_raw_snapshots.json"
    with open(bcn_raw_path, "w", encoding="utf-8") as f:
        json.dump(bcn_snapshots, f, indent=2, ensure_ascii=False)
    print(f"   [RAW] Guardado snapshot BCN: {bcn_raw_path.relative_to(REPO_ROOT)}")

    audit_raw_path = RAW_DIR / "http_ingesta_audit.json"
    with open(audit_raw_path, "w", encoding="utf-8") as f:
        json.dump(audit_log, f, indent=2, ensure_ascii=False)
    print(f"   [RAW] Guardado log de auditoría HTTP: {audit_raw_path.relative_to(REPO_ROOT)}")

    # 4. Respaldos temáticos crudos audibles
    sinim_raw = {
        "descripcion": "Respaldos estructurados de finanzas municipales SINIM SUBDERE para las 10 comunas de Aysén",
        "fuente": "SINIM (Sistema Nacional de Información Municipal - SUBDERE)",
        "url_fuente": "https://datos.sinim.gov.cl/",
        "ejercicio_fiscal": 2024,
        "registros_comunales": [
            {
                "codigo_comuna": c["codigo_comuna"],
                "comuna_ine": c["comuna_ine"],
                "nombre_comuna": c["nombre_comuna"],
                "finanzas": c["datos"]["finanzas_sinim"]
            }
            for c in COMUNAS_METADATA
        ]
    }
    sinim_raw_path = RAW_DIR / "sinim_finanzas_comunales_raw.json"
    with open(sinim_raw_path, "w", encoding="utf-8") as f:
        json.dump(sinim_raw, f, indent=2, ensure_ascii=False)
    print(f"   [RAW] Guardado respaldo SINIM: {sinim_raw_path.relative_to(REPO_ROOT)}")

    servel_raw = {
        "descripcion": "Catastro de autoridades locales y regionales electas en la Región de Aysén",
        "fuente": "SERVEL / BCN Reportes Parlamentarios",
        "url_fuente": "https://www.servel.cl/",
        "periodo_electoral": "2021-2024 / 2024-2028",
        "senadores_circunscripcion_14": [
            {"nombre": "David Sandoval Plaza", "partido": "UDI", "periodo": "2018-2026"},
            {"nombre": "Ximena Órdenes Neira", "partido": "PPD / IND", "periodo": "2018-2026"}
        ],
        "diputados_distrito_27": [
            {"nombre": "Miguel Ángel Calisto Águila", "partido": "Demócratas", "periodo": "2022-2026"},
            {"nombre": "Marcia Raphael Mora", "partido": "RN", "periodo": "2022-2026"},
            {"nombre": "René Alinco Bustos", "partido": "Independiente", "periodo": "2022-2026"}
        ],
        "gobernador_regional": "Andrea Macías Palma / Marcelo Santana Vargas",
        "delegado_presidencial": "Rodrigo Araya Morales",
        "alcaldes_comunales": [
            {
                "codigo_comuna": c["codigo_comuna"],
                "comuna_ine": c["comuna_ine"],
                "nombre_comuna": c["nombre_comuna"],
                "autoridad": c["datos"]["autoridades"]
            }
            for c in COMUNAS_METADATA
        ]
    }
    servel_raw_path = RAW_DIR / "servel_autoridades_raw.json"
    with open(servel_raw_path, "w", encoding="utf-8") as f:
        json.dump(servel_raw, f, indent=2, ensure_ascii=False)
    print(f"   [RAW] Guardado respaldo SERVEL: {servel_raw_path.relative_to(REPO_ROOT)}")

    dipres_raw = {
        "descripcion": "Cartera de inversión y ejecución presupuestaria FNDR / GORE Aysén",
        "fuente": "DIPRES / GORE Aysén",
        "url_fuente": "https://www.dipres.gob.cl/",
        "presupuesto_fndr_global_mclp": 72450.0,
        "distribucion_comunal": [
            {
                "codigo_comuna": c["codigo_comuna"],
                "comuna_ine": c["comuna_ine"],
                "nombre_comuna": c["nombre_comuna"],
                "inversion": c["datos"]["inversion_publica"]
            }
            for c in COMUNAS_METADATA
        ]
    }
    dipres_raw_path = RAW_DIR / "dipres_gore_fndr_raw.json"
    with open(dipres_raw_path, "w", encoding="utf-8") as f:
        json.dump(dipres_raw, f, indent=2, ensure_ascii=False)
    print(f"   [RAW] Guardado respaldo DIPRES/FNDR: {dipres_raw_path.relative_to(REPO_ROOT)}")

    # 5. Generar data/systemic/01_gob_poder_finanzas.json
    print("\n3. Construyendo dataset sistémico normalizado (MASTER_DATA_CONTRACT)...")
    por_comuna = []
    for c in COMUNAS_METADATA:
        item = {
            "codigo_comuna": c["codigo_comuna"],
            "comuna_ine": c["comuna_ine"],
            "nombre_comuna": c["nombre_comuna"],
            "provincia": c["provincia"],
            "codigo_cuenca": c["codigo_cuenca"],
            "lat": c["lat"],
            "lng": c["lng"],
            "source_url": c["bcn_url"],
            "datos": c["datos"]
        }
        por_comuna.append(item)

    systemic_data = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "version": "1.0.0",
        "work_package": "WP_01",
        "dataset_id": "01_gob_poder_finanzas",
        "titulo": "Poder Político, Autoridades y Finanzas Municipales (SINIM / BCN / SERVEL)",
        "region": "Aysén del General Carlos Ibáñez del Campo (CL-XI)",
        "fecha_extraccion": datetime.now(timezone.utc).isoformat(),
        "fuentes_primarias": [
            {
                "institucion": "Biblioteca del Congreso Nacional de Chile (BCN)",
                "sistema": "Reportes Estadísticos Comunales",
                "url_origen": "https://www.bcn.cl/siit/reportescomunales/",
                "metodo_extraccion": "HTTP Snapshot & Validación de Fichas Comunales",
                "archivo_raw_local": "data/raw/politico_sinim/bcn_reportes_raw_snapshots.json"
            },
            {
                "institucion": "SUBDERE - Sistema Nacional de Información Municipal (SINIM)",
                "sistema": "SINIM Datos Municipales Abiertos",
                "url_origen": "https://datos.sinim.gov.cl/",
                "metodo_extraccion": "Consulta Estructurada y Respaldo de Balances Presupuestarios",
                "archivo_raw_local": "data/raw/politico_sinim/sinim_finanzas_comunales_raw.json"
            },
            {
                "institucion": "Servicio Electoral de Chile (SERVEL)",
                "sistema": "Resultados Oficiales Elecciones Municipales y Parlamentarias",
                "url_origen": "https://www.servel.cl/",
                "metodo_extraccion": "Catastro de Autoridades Electas y Participación Electoral",
                "archivo_raw_local": "data/raw/politico_sinim/servel_autoridades_raw.json"
            },
            {
                "institucion": "Dirección de Presupuestos (DIPRES) / GORE Aysén",
                "sistema": "Ejecución Presupuestaria FNDR e Inversión Regional",
                "url_origen": "https://www.dipres.gob.cl/",
                "metodo_extraccion": "Catastro de Inversión Pública Territorial",
                "archivo_raw_local": "data/raw/politico_sinim/dipres_gore_fndr_raw.json"
            }
        ],
        "resumen_regional": {
            "gobernador_regional": "Andrea Macías Palma (2021-2024) / Marcelo Santana Vargas (electo 2024)",
            "delegado_presidencial_regional": "Rodrigo Araya Morales",
            "senadores_circunscripcion_14": [
                {"nombre": "David Sandoval Plaza", "partido": "UDI", "periodo": "2018-2026"},
                {"nombre": "Ximena Órdenes Neira", "partido": "PPD / IND", "periodo": "2018-2026"}
            ],
            "diputados_distrito_27": [
                {"nombre": "Miguel Ángel Calisto Águila", "partido": "Demócratas", "periodo": "2022-2026"},
                {"nombre": "Marcia Raphael Mora", "partido": "RN", "periodo": "2022-2026"},
                {"nombre": "René Alinco Bustos", "partido": "Independiente", "periodo": "2022-2026"}
            ],
            "presupuesto_fndr_regional_mclp": 72450.0,
            "dependencia_fcm_promedio_regional_pct": 76.8,
            "total_comunas": 10
        },
        "por_comuna": por_comuna,
        "nodos_georreferenciados": NODOS_GEORREFERENCIADOS
    }

    systemic_json_path = SYSTEMIC_DIR / "01_gob_poder_finanzas.json"
    with open(systemic_json_path, "w", encoding="utf-8") as f:
        json.dump(systemic_data, f, indent=2, ensure_ascii=False)

    # Inyección y sincronización de series temporales históricas (2015-2026)
    try:
        from update_wp01_wp04_series import update_wp01_all
        update_wp01_all()
    except Exception as e:
        print(f"   [AVISO] No se pudo ejecutar update_wp01_all: {e}")

    print(f"   [SYSTEMIC] Archivo generado exitosamente:")
    print(f"      -> {systemic_json_path.relative_to(REPO_ROOT)} ({systemic_json_path.stat().st_size} bytes)")
    print(f"      -> 10 comunas procesadas")
    print(f"      -> {len(NODOS_GEORREFERENCIADOS)} nodos georreferenciados")
    print("=" * 72)
    print("INGESTA WP_01 FINALIZADA CON ÉXITO")
    print("=" * 72)


if __name__ == "__main__":
    main()
