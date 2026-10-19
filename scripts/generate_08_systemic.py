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

    # Asignar a por_comuna
    por_comuna = []
    for c in COMUNAS:
        ine = c["comuna_ine"]
        comuna_entry = dict(c)
        comuna_entry["datos"] = datos_comunales[ine]
        por_comuna.append(comuna_entry)

    # 2. Resumen Regional
    resumen_regional = {
        "region_codigo": "CL-XI",
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
            "pesca_industrial_presencia": pesca_ind["presencia_plantas_o_flota"],
            "pesca_industrial_titulares_ltp_plantas": " | ".join(pesca_ind["titulares_ltp_o_plantas"]),
            "pesca_industrial_pesquerias_cuota": " | ".join(pesca_ind["pesquerias_cuota_industrial"]),
            "pesca_industrial_gravamenes_aplicables": pesca_ind["gravamenes_aplicables"],
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
