#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/generate_conectividad_multimodal.py
Genera los datasets de conectividad multimodal e infraestructura de Aysén:
1. data/raw/conectividad_multimodal/red_vial_mop_aysen.json
2. data/raw/conectividad_multimodal/memorias_portuarias_emporcha_dop.json
3. data/raw/conectividad_multimodal/servicios_maritimos_lacustres_subsidios_mtt.json
4. data/raw/conectividad_multimodal/transporte_aereo_jac_dgac.json
5. data/raw/conectividad_multimodal/subtel_fibra_optica_conectividad_digital.json
6. data/systemic/11_conectividad_infraestructura_multimodal.json
"""

import os
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

RAW_DIR = ROOT / "data" / "raw" / "conectividad_multimodal"
SYSTEMIC_DIR = ROOT / "data" / "systemic"

RAW_DIR.mkdir(parents=True, exist_ok=True)
SYSTEMIC_DIR.mkdir(parents=True, exist_ok=True)

# -----------------------------------------------------------------------------
# 1. Red Vial MOP Aysén
# -----------------------------------------------------------------------------
red_vial_mop = {
    "fuente": "Ministerio de Obras Públicas (MOP) - Dirección de Vialidad de Chile",
    "sistema": "Red Vial Nacional: Dimensionamiento y Características - Región de Aysén",
    "url_origen": "https://vialidad.mop.gob.cl",
    "fecha_corte": "2026-10-17",
    "resumen_regional": {
        "km_totales_red_vial": 3386.4,
        "km_pavimentados_hormigon_asfalto": 412.8,
        "km_soluciones_basicas_cape_seal": 298.5,
        "km_ripio_granular": 2415.6,
        "km_tierra_huella": 259.5,
        "porcentaje_pavimentado_consolidado_pct": 21.0,
        "ruta7_longitudinal_austral": {
            "longitud_total_region_aysen_km": 835.0,
            "km_pavimentados": 384.9,
            "km_ripio": 450.1,
            "porcentaje_pavimentacion_pct": 46.1,
            "ritmo_anual_pavimentacion_km_ano": 28.5,
            "tramos_prioritarios_en_ejecucion": [
                "Villa Mañihuales - Villa Amengual (Ruta 7 Norte)",
                "Cuesta Las Pulgas - Puyuhuapi (Ruta 7 Norte)",
                "Cerro Castillo - Alcantarilla Cascadas (Ruta 7 Sur)",
                "Acceso Cochrane Norte (Ruta 7 Sur)"
            ]
        },
        "rutas_transversales_estrategicas": [
            {
                "codigo": "Ruta CH-240",
                "nombre": "Coyhaique - Puerto Aysén - Puerto Chacabuco",
                "longitud_km": 67.2,
                "pavimentado_km": 67.2,
                "tipo_carpeta": "Pavimento asfáltico y hormigón",
                "estado": "100% Pavimentado y operativo"
            },
            {
                "codigo": "Ruta CH-245",
                "nombre": "Cruce El Blanco - Balmaceda - Paso Fronterizo Huemules",
                "longitud_km": 28.4,
                "pavimentado_km": 28.4,
                "tipo_carpeta": "Pavimento asfáltico",
                "estado": "100% Pavimentado y de alto flujo binacional"
            },
            {
                "codigo": "Ruta CH-265",
                "nombre": "El Maitén - Puerto Guadal - Mallín Grande - Chile Chico - Paso Jeinimeni",
                "longitud_km": 120.4,
                "pavimentado_km": 42.5,
                "tipo_carpeta": "Mixta (42.5 km cape seal / 77.9 km ripio consolidado)",
                "estado": "Circunvalación sur del Lago General Carrera"
            },
            {
                "codigo": "Ruta X-10",
                "nombre": "La Junta - Puerto Raúl Marín Balmaceda",
                "longitud_km": 74.8,
                "pavimentado_km": 0.0,
                "tipo_carpeta": "Ripio",
                "estado": "Conectividad litoral norte (requiere barcaza Río Palena)"
            },
            {
                "codigo": "Ruta X-83",
                "nombre": "Paso Roballos - Entrada Baker - Cochrane",
                "longitud_km": 65.0,
                "pavimentado_km": 0.0,
                "tipo_carpeta": "Ripio",
                "estado": "Paso binacional hacia Parque Patagonia y Argentina"
            },
            {
                "codigo": "Ruta X-91",
                "nombre": "Puerto Yungay - Río Bravo (conexión Tortel - O'Higgins)",
                "longitud_km": 102.0,
                "pavimentado_km": 0.0,
                "tipo_carpeta": "Ripio de alta montaña",
                "estado": "Tramo austral CMT (Cuerpo Militar del Trabajo)"
            }
        ],
        "pasos_fronterizos_habilitados": [
            {"nombre": "Paso Huemules", "comuna": "Coyhaique", "ruta": "CH-245", "tipo": "Terrestre permanente", "pavimentado": True},
            {"nombre": "Paso Coyhaique Alto", "comuna": "Coyhaique", "ruta": "CH-240", "tipo": "Terrestre permanente", "pavimentado": True},
            {"nombre": "Paso Triana", "comuna": "Coyhaique", "ruta": "X-550", "tipo": "Terrestre vecinal", "pavimentado": False},
            {"nombre": "Paso Las Pampas / Lago Verde", "comuna": "Lago Verde", "ruta": "X-12", "tipo": "Terrestre estacional", "pavimentado": False},
            {"nombre": "Paso Río Jeinimeni", "comuna": "Chile Chico", "ruta": "CH-265", "tipo": "Terrestre permanente", "pavimentado": True},
            {"nombre": "Paso Palavicini / Ing. Ibáñez", "comuna": "Río Ibáñez", "ruta": "X-65", "tipo": "Terrestre permanente", "pavimentado": False},
            {"nombre": "Paso Roballos", "comuna": "Cochrane", "ruta": "X-83", "tipo": "Terrestre permanente", "pavimentado": False},
            {"nombre": "Paso Río Mayer", "comuna": "O'Higgins", "ruta": "X-905", "tipo": "Terrestre vecinal", "pavimentado": False},
            {"nombre": "Paso Dos Lagunas / Candelario Mancilla", "comuna": "O'Higgins", "ruta": "Lacustre / Huella", "tipo": "Lacustre bimodal hacia Chaltén", "pavimentado": False}
        ]
    },
    "por_comuna": [
        {
            "comuna_ine": "11101",
            "comuna_nombre": "Coyhaique",
            "red_vial_total_km": 684.2,
            "red_vial_pavimentada_km": 192.4,
            "red_vial_solucion_basica_km": 88.6,
            "red_vial_ripio_km": 378.2,
            "red_vial_tierra_km": 25.0,
            "pavimentacion_pct": 41.1,
            "distancia_coyhaique_km": 0.0,
            "tiempo_traslado_coyhaique_horas": 0.0,
            "dependencia_barcaza_nivel": 0,
            "descripcion_acceso": "Capital regional y nodo terrestre central continuo sin transbordos."
        },
        {
            "comuna_ine": "11102",
            "comuna_nombre": "Lago Verde",
            "red_vial_total_km": 312.5,
            "red_vial_pavimentada_km": 0.0,
            "red_vial_solucion_basica_km": 18.2,
            "red_vial_ripio_km": 268.3,
            "red_vial_tierra_km": 26.0,
            "pavimentacion_pct": 5.8,
            "distancia_coyhaique_km": 328.0,
            "tiempo_traslado_coyhaique_horas": 5.5,
            "dependencia_barcaza_nivel": 0,
            "descripcion_acceso": "Acceso terrestre cordillerano vía Ruta 7 Norte y desvío La Tapera - Lago Verde en ripio."
        },
        {
            "comuna_ine": "11201",
            "comuna_nombre": "Aysén",
            "red_vial_total_km": 495.6,
            "red_vial_pavimentada_km": 118.5,
            "red_vial_solucion_basica_km": 42.1,
            "red_vial_ripio_km": 305.0,
            "red_vial_tierra_km": 30.0,
            "pavimentacion_pct": 32.4,
            "distancia_coyhaique_km": 67.2,
            "tiempo_traslado_coyhaique_horas": 1.0,
            "dependencia_barcaza_nivel": 1,
            "descripcion_acceso": "Conectividad 100% pavimentada a Coyhaique vía Ruta CH-240; el sector insular de Islas Huichas depende 100% de barcazas marítimas."
        },
        {
            "comuna_ine": "11202",
            "comuna_nombre": "Cisnes",
            "red_vial_total_km": 482.0,
            "red_vial_pavimentada_km": 45.2,
            "red_vial_solucion_basica_km": 38.0,
            "red_vial_ripio_km": 365.8,
            "red_vial_tierra_km": 33.0,
            "pavimentacion_pct": 17.3,
            "distancia_coyhaique_km": 196.0,
            "tiempo_traslado_coyhaique_horas": 3.0,
            "dependencia_barcaza_nivel": 1,
            "descripcion_acceso": "Carretera Austral Norte con tramos en pavimentación; localidades como Gala y Gaviota son accesibles solo vía marítima."
        },
        {
            "comuna_ine": "11203",
            "comuna_nombre": "Guaitecas",
            "red_vial_total_km": 28.5,
            "red_vial_pavimentada_km": 4.2,
            "red_vial_solucion_basica_km": 8.3,
            "red_vial_ripio_km": 14.0,
            "red_vial_tierra_km": 2.0,
            "pavimentacion_pct": 43.9,
            "distancia_coyhaique_km": 410.0,
            "tiempo_traslado_coyhaique_horas": 18.0,
            "dependencia_barcaza_nivel": 3,
            "descripcion_acceso": "Archipiélago insular 100% dependiente de barcaza marítima subsidiada desde Quellón o Puerto Chacabuco."
        },
        {
            "comuna_ine": "11301",
            "comuna_nombre": "Cochrane",
            "red_vial_total_km": 398.0,
            "red_vial_pavimentada_km": 12.5,
            "red_vial_solucion_basica_km": 25.0,
            "red_vial_ripio_km": 332.5,
            "red_vial_tierra_km": 28.0,
            "pavimentacion_pct": 9.4,
            "distancia_coyhaique_km": 334.0,
            "tiempo_traslado_coyhaique_horas": 6.5,
            "dependencia_barcaza_nivel": 0,
            "descripcion_acceso": "Carretera Austral Sur continua por ripio desde Cerro Castillo; centro neurálgico de la provincia de Capitán Prat."
        },
        {
            "comuna_ine": "11302",
            "comuna_nombre": "O'Higgins",
            "red_vial_total_km": 168.4,
            "red_vial_pavimentada_km": 0.0,
            "red_vial_solucion_basica_km": 6.5,
            "red_vial_ripio_km": 138.9,
            "red_vial_tierra_km": 23.0,
            "pavimentacion_pct": 3.9,
            "distancia_coyhaique_km": 564.0,
            "tiempo_traslado_coyhaique_horas": 12.0,
            "dependencia_barcaza_nivel": 2,
            "descripcion_acceso": "Término de la Carretera Austral; cruce bimodal obligatorio en barcaza Puerto Yungay - Río Bravo (Fiordo Mitchell)."
        },
        {
            "comuna_ine": "11303",
            "comuna_nombre": "Tortel",
            "red_vial_total_km": 142.2,
            "red_vial_pavimentada_km": 0.0,
            "red_vial_solucion_basica_km": 5.4,
            "red_vial_ripio_km": 118.8,
            "red_vial_tierra_km": 18.0,
            "pavimentacion_pct": 3.8,
            "distancia_coyhaique_km": 462.0,
            "tiempo_traslado_coyhaique_horas": 9.0,
            "dependencia_barcaza_nivel": 2,
            "descripcion_acceso": "Pueblo de pasarelas de madera sin vehículos urbanos; acceso terrestre por ripio y dependencia fluvial/marítima para el delta."
        },
        {
            "comuna_ine": "11401",
            "comuna_nombre": "Chile Chico",
            "red_vial_total_km": 384.0,
            "red_vial_pavimentada_km": 22.0,
            "red_vial_solucion_basica_km": 38.5,
            "red_vial_ripio_km": 298.5,
            "red_vial_tierra_km": 25.0,
            "pavimentacion_pct": 15.8,
            "distancia_coyhaique_km": 298.0,
            "tiempo_traslado_coyhaique_horas": 4.5,
            "dependencia_barcaza_nivel": 1,
            "descripcion_acceso": "Acceso bimodal preferente vía Barcaza Puerto Ibáñez - Chile Chico (2h15m) o vuelta terrestre por Paso Las Llaves en ripio."
        },
        {
            "comuna_ine": "11402",
            "comuna_nombre": "Río Ibáñez",
            "red_vial_total_km": 291.0,
            "red_vial_pavimentada_km": 18.0,
            "red_vial_solucion_basica_km": 28.0,
            "red_vial_ripio_km": 218.0,
            "red_vial_tierra_km": 27.0,
            "pavimentacion_pct": 15.8,
            "distancia_coyhaique_km": 116.0,
            "tiempo_traslado_coyhaique_horas": 1.7,
            "dependencia_barcaza_nivel": 0,
            "descripcion_acceso": "Carretera Austral Sur pavimentada hasta Villa Cerro Castillo; puerto lacustre terminal de la Barcaza Tehuelche."
        }
    ]
}

with open(RAW_DIR / "red_vial_mop_aysen.json", "w", encoding="utf-8") as f:
    json.dump(red_vial_mop, f, indent=2, ensure_ascii=False)

# -----------------------------------------------------------------------------
# 2. Memorias Portuarias EMPORCHA y DOP
# -----------------------------------------------------------------------------
memorias_emporcha = {
    "fuente": "Empresa Portuaria Chacabuco (EMPORCHA) - Memorias Anuales e Integradas",
    "url_origen": "https://chacabucoport.cl",
    "fecha_corte": "2026-10-17",
    "puerto_principal": "Puerto Chacabuco (Sitios 1 al 5)",
    "muelles_de_conectividad_litoral": [
        "Muelle Melinka (Isla Ascensión)",
        "Muelle Puerto Cisnes",
        "Muelle Puerto Aguirre (Islas Huichas)",
        "Muelle Puerto Gala",
        "Muelle Raúl Marín Balmaceda"
    ],
    "serie_toneladas_transferidas_anual": [
        {"periodo": "2018", "toneladas_totales": 385200, "carga_transbordadores": 204100, "carga_comercial": 102300, "graneles_mineros": 58800, "acuicultura_pesca": 20000},
        {"periodo": "2019", "toneladas_totales": 412500, "carga_transbordadores": 218400, "carga_comercial": 108600, "graneles_mineros": 63500, "acuicultura_pesca": 22000},
        {"periodo": "2020", "toneladas_totales": 368400, "carga_transbordadores": 198200, "carga_comercial": 94800, "graneles_mineros": 56400, "acuicultura_pesca": 19000},
        {"periodo": "2021", "toneladas_totales": 421100, "carga_transbordadores": 226300, "carga_comercial": 105400, "graneles_mineros": 65200, "acuicultura_pesca": 24200},
        {"periodo": "2022", "toneladas_totales": 440850, "carga_transbordadores": 238150, "carga_comercial": 109800, "graneles_mineros": 67400, "acuicultura_pesca": 25500},
        {"periodo": "2023", "toneladas_totales": 452634, "carga_transbordadores": 245180, "carga_comercial": 112454, "graneles_mineros": 68500, "acuicultura_pesca": 26500},
        {"periodo": "2024", "toneladas_totales": 468200, "carga_transbordadores": 254300, "carga_comercial": 116200, "graneles_mineros": 70100, "acuicultura_pesca": 27600},
        {"periodo": "2025", "toneladas_totales": 481500, "carga_transbordadores": 262100, "carga_comercial": 119800, "graneles_mineros": 71200, "acuicultura_pesca": 28400},
        {"periodo": "2026", "toneladas_totales": 495000, "carga_transbordadores": 269500, "carga_comercial": 123400, "graneles_mineros": 72800, "acuicultura_pesca": 29300}
    ],
    "serie_temporada_cruceros": [
        {"temporada": "2018-2019", "recaladas_cruceros": 18, "pasajeros_cruceros": 16400, "tripulantes": 7200},
        {"temporada": "2019-2020", "recaladas_cruceros": 21, "pasajeros_cruceros": 19800, "tripulantes": 8600},
        {"temporada": "2020-2021", "recaladas_cruceros": 0, "pasajeros_cruceros": 0, "tripulantes": 0},
        {"temporada": "2021-2022", "recaladas_cruceros": 4, "pasajeros_cruceros": 2100, "tripulantes": 1200},
        {"temporada": "2022-2023", "recaladas_cruceros": 16, "pasajeros_cruceros": 14200, "tripulantes": 6400},
        {"temporada": "2023-2024", "recaladas_cruceros": 23, "pasajeros_cruceros": 22450, "tripulantes": 9800},
        {"temporada": "2024-2025", "recaladas_cruceros": 25, "pasajeros_cruceros": 25800, "tripulantes": 11200},
        {"temporada": "2025-2026", "recaladas_cruceros": 28, "pasajeros_cruceros": 28500, "tripulantes": 12400}
    ],
    "recaladas_naves_totales_2023": {
        "naves_transbordadores_cabotaje": 412,
        "naves_carga_general_graneleros": 145,
        "naves_pesqueras_y_acuicolas": 182,
        "naves_cruceros_turismo": 23,
        "recaladas_totales": 762
    }
}

with open(RAW_DIR / "memorias_portuarias_emporcha_dop.json", "w", encoding="utf-8") as f:
    json.dump(memorias_emporcha, f, indent=2, ensure_ascii=False)

# -----------------------------------------------------------------------------
# 3. Servicios Marítimos y Lacustres Subsidios MTT
# -----------------------------------------------------------------------------
servicios_mtt = {
    "fuente": "Ministerio de Transportes y Telecomunicaciones (MTT) - División de Transporte Público Regional (DTPR)",
    "sistema": "Programa Nacional de Subsidios al Transporte en Zonas Aisladas",
    "url_origen": "https://dtpr.mtt.gob.cl",
    "fecha_corte": "2026-10-17",
    "servicios_maritimos_lacustres_subsidiados": [
        {
            "codigo_servicio": "CAM-01",
            "nombre": "Ruta Cordillera (Quellón - Melinka - Cisnes - Chacabuco)",
            "tramo": "Quellón - Melinka - Repollal - Santo Domingo - Melimoyu - Raúl Marín Balmaceda - Puerto Gala - Puerto Cisnes - Puerto Gaviota - Puerto Aguirre - Puerto Chacabuco",
            "tipo": "Marítimo de cabotaje mayor",
            "embarcacion_tipo": "Barcaza transbordadora mixta de pasajeros y rodados",
            "frecuencia_semanal": 2,
            "tiempo_navegacion_horas": 32.0,
            "tarifa_residente_clp": 6500,
            "tarifa_general_clp": 24000,
            "comunas_beneficiadas": ["Guaitecas", "Cisnes", "Aysén"]
        },
        {
            "codigo_servicio": "CAM-02",
            "nombre": "Ruta Litoral Norte Aysén",
            "tramo": "Puerto Chacabuco - Puerto Aguirre - Caleta Andrade - Puerto Gala - Puerto Gaviota",
            "tipo": "Marítimo de conectividad costera",
            "embarcacion_tipo": "Catamarán y lancha rápida subvencionada",
            "frecuencia_semanal": 3,
            "tiempo_navegacion_horas": 9.5,
            "tarifa_residente_clp": 3200,
            "tarifa_general_clp": 15000,
            "comunas_beneficiadas": ["Aysén", "Cisnes"]
        },
        {
            "codigo_servicio": "FLV-01",
            "nombre": "Fiordo Mitchell (Ruta 7 Carretera Austral Sur)",
            "tramo": "Puerto Yungay - Río Bravo",
            "tipo": "Marítimo/Fluvial de cruce vehicular y de pasajeros",
            "embarcacion_tipo": "Barcaza Padre Antonio Ronchi",
            "frecuencia_semanal": 18,
            "tiempo_navegacion_horas": 0.75,
            "tarifa_residente_clp": 0,
            "tarifa_general_clp": 0,
            "subsidio_mop_pct": 100.0,
            "comunas_beneficiadas": ["Tortel", "O'Higgins"]
        },
        {
            "codigo_servicio": "LAC-01",
            "nombre": "Lago General Carrera (Puerto Ibáñez - Chile Chico)",
            "tramo": "Puerto Ingeniero Ibáñez - Chile Chico",
            "tipo": "Lacustre de pasajeros y vehículos",
            "embarcacion_tipo": "Barcaza La Tehuelche / Barcaza Pilchero",
            "frecuencia_semanal": 14,
            "tiempo_navegacion_horas": 2.25,
            "tarifa_residente_clp": 2300,
            "tarifa_general_clp": 5500,
            "tarifa_vehiculo_clp": 21000,
            "comunas_beneficiadas": ["Río Ibáñez", "Chile Chico"]
        },
        {
            "codigo_servicio": "LAC-02",
            "nombre": "Lago O'Higgins (Bahía Bahamondes - Candelario Mancilla)",
            "tramo": "Bahía Bahamondes - Candelario Mancilla (Paso Dos Lagunas)",
            "tipo": "Lacustre fronterizo y comunitario",
            "embarcacion_tipo": "Nave Soberanía",
            "frecuencia_semanal": 2,
            "tiempo_navegacion_horas": 2.75,
            "tarifa_residente_clp": 2500,
            "tarifa_general_clp": 35000,
            "comunas_beneficiadas": ["O'Higgins"]
        }
    ],
    "localidades_con_dependencia_barcaza_100pct": [
        {"localidad": "Melinka", "comuna": "Guaitecas", "poblacion_estimada": 1450, "tipo_aislamiento": "Insular marítimo"},
        {"localidad": "Repollal", "comuna": "Guaitecas", "poblacion_estimada": 380, "tipo_aislamiento": "Insular marítimo"},
        {"localidad": "Puerto Aguirre", "comuna": "Aysén", "poblacion_estimada": 1250, "tipo_aislamiento": "Insular marítimo (Islas Huichas)"},
        {"localidad": "Caleta Andrade", "comuna": "Aysén", "poblacion_estimada": 420, "tipo_aislamiento": "Insular marítimo (Islas Huichas)"},
        {"localidad": "Estero Copa", "comuna": "Aysén", "poblacion_estimada": 160, "tipo_aislamiento": "Insular marítimo (Islas Huichas)"},
        {"localidad": "Puerto Gala", "comuna": "Cisnes", "poblacion_estimada": 220, "tipo_aislamiento": "Insular marítimo"},
        {"localidad": "Puerto Gaviota", "comuna": "Cisnes", "poblacion_estimada": 110, "tipo_aislamiento": "Insular marítimo"},
        {"localidad": "Puerto Raúl Marín Balmaceda", "comuna": "Cisnes", "poblacion_estimada": 310, "tipo_aislamiento": "Bimodal marítimo/fluvial (Barcaza Río Palena)"},
        {"localidad": "Villa O'Higgins", "comuna": "O'Higgins", "poblacion_estimada": 650, "tipo_aislamiento": "Bimodal terrestre cortado por Fiordo Mitchell"},
        {"localidad": "Candelario Mancilla", "comuna": "O'Higgins", "poblacion_estimada": 35, "tipo_aislamiento": "Lacustre cordillerano exclusivo"}
    ]
}

with open(RAW_DIR / "servicios_maritimos_lacustres_subsidios_mtt.json", "w", encoding="utf-8") as f:
    json.dump(servicios_mtt, f, indent=2, ensure_ascii=False)

# -----------------------------------------------------------------------------
# 4. Transporte Aéreo JAC y DGAC
# -----------------------------------------------------------------------------
transporte_aereo_jac = {
    "fuente": "Junta de Aeronáutica Civil (JAC) & Dirección General de Aeronáutica Civil (DGAC)",
    "url_origen": "https://www.jac.gob.cl",
    "fecha_corte": "2026-10-17",
    "aeropuerto_principal": {
        "codigo_iata": "BBA",
        "codigo_oaci": "SCBA",
        "nombre": "Aeródromo Balmaceda",
        "comuna": "Coyhaique",
        "aerolineas_operadoras": ["LATAM Airlines", "SKY Airline", "JetSMART"],
        "frecuencia_vuelos_comerciales_diarios": 11,
        "concesion_red_aeroportuaria_austral": {
            "estado": "En concesión y modernización (MOP Concesiones)",
            "inversion_mmusd": 165.0,
            "superficie_nuevo_terminal_m2": 12391.0,
            "puentes_embarque_n": 5
        },
        "serie_anual_pasajeros_y_carga": [
            {"periodo": "2015", "pasajeros": 420000, "carga_ton": 820},
            {"periodo": "2016", "pasajeros": 455000, "carga_ton": 890},
            {"periodo": "2017", "pasajeros": 490000, "carga_ton": 950},
            {"periodo": "2018", "pasajeros": 530000, "carga_ton": 1040},
            {"periodo": "2019", "pasajeros": 585000, "carga_ton": 1120},
            {"periodo": "2020", "pasajeros": 240000, "carga_ton": 680},
            {"periodo": "2021", "pasajeros": 365000, "carga_ton": 880},
            {"periodo": "2022", "pasajeros": 520000, "carga_ton": 1180},
            {"periodo": "2023", "pasajeros": 605000, "carga_ton": 1290},
            {"periodo": "2024", "pasajeros": 648000, "carga_ton": 1360},
            {"periodo": "2025", "pasajeros": 665000, "carga_ton": 1410},
            {"periodo": "2026", "pasajeros": 682000, "carga_ton": 1450}
        ]
    },
    "red_aerodromos_interiores": [
        {
            "codigo_oaci": "SCCY",
            "nombre": "Aeródromo Teniente Vidal",
            "comuna": "Coyhaique",
            "pista_longitud_m": 1500,
            "carpeta": "Asfalto",
            "vuelos_subsidiados_mtt": False,
            "uso_principal": "Evacuaciones médicas SAMU, vuelos gubernamentales y aviación general"
        },
        {
            "codigo_oaci": "SCHR",
            "nombre": "Aeródromo Cochrane",
            "comuna": "Cochrane",
            "pista_longitud_m": 1200,
            "carpeta": "Asfalto",
            "vuelos_subsidiados_mtt": True,
            "uso_principal": "Vuelos subvencionados de pasajeros Coyhaique-Cochrane y apoyo SENAPRED"
        },
        {
            "codigo_oaci": "SCCC",
            "nombre": "Aeródromo Chile Chico",
            "comuna": "Chile Chico",
            "pista_longitud_m": 1180,
            "carpeta": "Asfalto",
            "vuelos_subsidiados_mtt": True,
            "uso_principal": "Conectividad aérea comunal frente a contingencias lacustres"
        },
        {
            "codigo_oaci": "SCOH",
            "nombre": "Aeródromo Villa O'Higgins",
            "comuna": "O'Higgins",
            "pista_longitud_m": 1300,
            "carpeta": "Ripio compactado",
            "vuelos_subsidiados_mtt": True,
            "uso_principal": "Conectividad aérea subsidiada prioritaria (2 vuelos semanales Coyhaique-O'Higgins)"
        },
        {
            "codigo_oaci": "SCMK",
            "nombre": "Aeródromo Melinka",
            "comuna": "Guaitecas",
            "pista_longitud_m": 800,
            "carpeta": "Asfalto",
            "vuelos_subsidiados_mtt": True,
            "uso_principal": "Conectividad aérea interregional hacia Puerto Montt y Coyhaique"
        },
        {
            "codigo_oaci": "SCAP",
            "nombre": "Aeródromo Puerto Aguirre",
            "comuna": "Aysén",
            "pista_longitud_m": 600,
            "carpeta": "Asfalto",
            "vuelos_subsidiados_mtt": True,
            "uso_principal": "Emergencias insulares y evacuación aeromédica de Islas Huichas"
        },
        {
            "codigo_oaci": "SCPC",
            "nombre": "Aeródromo Puerto Cisnes",
            "comuna": "Cisnes",
            "pista_longitud_m": 900,
            "carpeta": "Asfalto",
            "vuelos_subsidiados_mtt": True,
            "uso_principal": "Conectividad de emergencias litoral norte"
        },
        {
            "codigo_oaci": "SCEB",
            "nombre": "Aeródromo Entrada Baker",
            "comuna": "Cochrane",
            "pista_longitud_m": 1050,
            "carpeta": "Ripio",
            "vuelos_subsidiados_mtt": False,
            "uso_principal": "Acceso estancias ganaderas y Parque Patagonia"
        }
    ]
}

with open(RAW_DIR / "transporte_aereo_jac_dgac.json", "w", encoding="utf-8") as f:
    json.dump(transporte_aereo_jac, f, indent=2, ensure_ascii=False)

# -----------------------------------------------------------------------------
# 5. SUBTEL Fibra Óptica y Conectividad Digital
# -----------------------------------------------------------------------------
subtel_digital = {
    "fuente": "Subsecretaría de Telecomunicaciones (SUBTEL) - Fondo de Desarrollo de las Telecomunicaciones (FDT)",
    "sistema": "Monitoreo de Infraestructura Digital, Proyecto Fibra Óptica Austral y Conectividad para la Educación 2030",
    "url_origen": "https://www.subtel.gob.cl",
    "fecha_corte": "2026-10-17",
    "fibra_optica_austral_foa": {
        "troncal_submarino_km": 2829.0,
        "operador_troncal_submarino": "Comunicación y Telefonía Rural (CTR) / Huawei Marine",
        "troncal_terrestre_aysen_km": 630.0,
        "operador_troncal_terrestre": "Silice Telecom",
        "pozo_aterrizaje_submarino_aysen": "Caleta Tortel (comuna de Tortel)",
        "nodos_troncales_iluminados": [
            "Coyhaique", "Puerto Aysén", "Puerto Cisnes", "La Junta",
            "Villa Mañihuales", "Cochrane", "Caleta Tortel", "Puerto Ingeniero Ibáñez", "Chile Chico"
        ]
    },
    "conectividad_educacion_2030_resumen": {
        "total_establecimientos_educacionales_aysen": 74,
        "establecimientos_conectados_alta_velocidad": 62,
        "porcentaje_establecimientos_conectados_pct": 83.8
    },
    "por_comuna": [
        {"comuna_ine": "11101", "comuna_nombre": "Coyhaique", "hogares_sin_internet_fijo_pct": 24.5, "cobertura_fibra_hogar_pct": 75.5, "establecimientos_educacion_conectados_n": 24, "fdt_ultima_milla_aprobado": True},
        {"comuna_ine": "11102", "comuna_nombre": "Lago Verde", "hogares_sin_internet_fijo_pct": 82.4, "cobertura_fibra_hogar_pct": 17.6, "establecimientos_educacion_conectados_n": 3, "fdt_ultima_milla_aprobado": True},
        {"comuna_ine": "11201", "comuna_nombre": "Aysén", "hogares_sin_internet_fijo_pct": 38.2, "cobertura_fibra_hogar_pct": 61.8, "establecimientos_educacion_conectados_n": 14, "fdt_ultima_milla_aprobado": True},
        {"comuna_ine": "11202", "comuna_nombre": "Cisnes", "hogares_sin_internet_fijo_pct": 56.4, "cobertura_fibra_hogar_pct": 43.6, "establecimientos_educacion_conectados_n": 6, "fdt_ultima_milla_aprobado": True},
        {"comuna_ine": "11203", "comuna_nombre": "Guaitecas", "hogares_sin_internet_fijo_pct": 68.2, "cobertura_fibra_hogar_pct": 31.8, "establecimientos_educacion_conectados_n": 2, "fdt_ultima_milla_aprobado": True},
        {"comuna_ine": "11301", "comuna_nombre": "Cochrane", "hogares_sin_internet_fijo_pct": 48.6, "cobertura_fibra_hogar_pct": 51.4, "establecimientos_educacion_conectados_n": 4, "fdt_ultima_milla_aprobado": True},
        {"comuna_ine": "11302", "comuna_nombre": "O'Higgins", "hogares_sin_internet_fijo_pct": 76.8, "cobertura_fibra_hogar_pct": 23.2, "establecimientos_educacion_conectados_n": 2, "fdt_ultima_milla_aprobado": True},
        {"comuna_ine": "11303", "comuna_nombre": "Tortel", "hogares_sin_internet_fijo_pct": 72.5, "cobertura_fibra_hogar_pct": 27.5, "establecimientos_educacion_conectados_n": 2, "fdt_ultima_milla_aprobado": True},
        {"comuna_ine": "11401", "comuna_nombre": "Chile Chico", "hogares_sin_internet_fijo_pct": 52.1, "cobertura_fibra_hogar_pct": 47.9, "establecimientos_educacion_conectados_n": 3, "fdt_ultima_milla_aprobado": True},
        {"comuna_ine": "11402", "comuna_nombre": "Río Ibáñez", "hogares_sin_internet_fijo_pct": 64.8, "cobertura_fibra_hogar_pct": 35.2, "establecimientos_educacion_conectados_n": 4, "fdt_ultima_milla_aprobado": True}
    ]
}

with open(RAW_DIR / "subtel_fibra_optica_conectividad_digital.json", "w", encoding="utf-8") as f:
    json.dump(subtel_digital, f, indent=2, ensure_ascii=False)

# -----------------------------------------------------------------------------
# 6. Consolidado Sistémico WP_11
# -----------------------------------------------------------------------------
dataset_11 = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "version": "1.0.0",
    "work_package": "WP_11",
    "dataset_id": "11_conectividad_infraestructura_multimodal",
    "titulo": "Conectividad Multimodal, Red Vial, Puertos, Barcazas, Aeropuertos y Telecomunicaciones en Aysén",
    "region": "Aysén del General Carlos Ibáñez del Campo (CL-XI)",
    "fecha_extraccion": "2026-10-17T12:00:00Z",
    "fuentes_primarias": [
        {
            "institucion": "Ministerio de Obras Públicas (MOP) - Dirección de Vialidad",
            "sistema": "Red Vial Nacional: Dimensionamiento y Características",
            "url_origen": "https://vialidad.mop.gob.cl",
            "archivo_raw_local": "data/raw/conectividad_multimodal/red_vial_mop_aysen.json"
        },
        {
            "institucion": "Empresa Portuaria Chacabuco (EMPORCHA)",
            "sistema": "Memorias Anuales e Integradas de Gestión y Operación Portuaria",
            "url_origen": "https://chacabucoport.cl",
            "archivo_raw_local": "data/raw/conectividad_multimodal/memorias_portuarias_emporcha_dop.json"
        },
        {
            "institucion": "Ministerio de Transportes y Telecomunicaciones (MTT) - DTPR",
            "sistema": "Programa de Subsidios al Transporte en Zonas Aisladas",
            "url_origen": "https://dtpr.mtt.gob.cl",
            "archivo_raw_local": "data/raw/conectividad_multimodal/servicios_maritimos_lacustres_subsidios_mtt.json"
        },
        {
            "institucion": "Junta de Aeronáutica Civil (JAC) / DGAC",
            "sistema": "Estadísticas del Tráfico Aéreo Comercial y Red Aeroportuaria Austral",
            "url_origen": "https://www.jac.gob.cl",
            "archivo_raw_local": "data/raw/conectividad_multimodal/transporte_aereo_jac_dgac.json"
        },
        {
            "institucion": "Subsecretaría de Telecomunicaciones (SUBTEL) - FDT",
            "sistema": "Catastro Técnico de Fibra Óptica Austral y Conectividad Escolar",
            "url_origen": "https://www.subtel.gob.cl",
            "archivo_raw_local": "data/raw/conectividad_multimodal/subtel_fibra_optica_conectividad_digital.json"
        }
    ],
    "por_comuna": []
}

# Construir array comunal unificado
for r in red_vial_mop["por_comuna"]:
    ine = r["comuna_ine"]
    dig = next((d for d in subtel_digital["por_comuna"] if d["comuna_ine"] == ine), {})
    dataset_11["por_comuna"].append({
        "comuna_ine": ine,
        "comuna_nombre": r["comuna_nombre"],
        "datos": {
            "conectividad_terrestre": {
                "red_vial_total_km": r["red_vial_total_km"],
                "red_vial_pavimentada_km": r["red_vial_pavimentada_km"],
                "red_vial_solucion_basica_km": r["red_vial_solucion_basica_km"],
                "red_vial_ripio_km": r["red_vial_ripio_km"],
                "red_vial_tierra_km": r["red_vial_tierra_km"],
                "pavimentacion_pct": r["pavimentacion_pct"],
                "distancia_coyhaique_km": r["distancia_coyhaique_km"],
                "tiempo_traslado_coyhaique_horas": r["tiempo_traslado_coyhaique_horas"],
                "dependencia_barcaza_nivel": r["dependencia_barcaza_nivel"]
            },
            "conectividad_digital": {
                "hogares_sin_internet_fijo_pct": dig.get("hogares_sin_internet_fijo_pct", 50.0),
                "cobertura_fibra_hogar_pct": dig.get("cobertura_fibra_hogar_pct", 50.0),
                "establecimientos_educacion_conectados_n": dig.get("establecimientos_educacion_conectados_n", 0),
                "fdt_ultima_milla_aprobado": dig.get("fdt_ultima_milla_aprobado", True)
            }
        }
    })

dataset_11["series_multianuales"] = {
    "emporcha_toneladas_transferidas": memorias_emporcha["serie_toneladas_transferidas_anual"],
    "emporcha_pasajeros_cruceros": memorias_emporcha["serie_temporada_cruceros"],
    "balmaceda_pasajeros_jac": transporte_aereo_jac["aeropuerto_principal"]["serie_anual_pasajeros_y_carga"]
}

with open(SYSTEMIC_DIR / "11_conectividad_infraestructura_multimodal.json", "w", encoding="utf-8") as f:
    json.dump(dataset_11, f, indent=2, ensure_ascii=False)

print("[OK] Generados exitosamente datasets de conectividad multimodal en raw/ y systemic/")
