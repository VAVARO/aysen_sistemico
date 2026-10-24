#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/build_cecan_presets.py
=============================================================================
Genera data/cecan_16_presets_aysen.json y actualiza data/cruces_multivariables.json
vinculando las 16 Propiedades de Sistemas Complejos (CECAN) con el Data Lake de Aysén.

CERO EMOJIS - RIGOR EPISTEMOLÓGICO Y MATEMÁTICO - UTF-8
=============================================================================
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(ROOT / "scripts") not in sys.path:
    sys.path.insert(0, str(ROOT / "scripts"))
sys.stdout.reconfigure(encoding='utf-8')

def build_cecan_presets():
    cecan_data = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "version": "1.0.0",
        "dataset_id": "cecan_16_presets_aysen",
        "titulo": "Presets Sistémicos Empíricos CECAN para la Región de Aysén",
        "descripcion": "Catálogo canónico de configuración y parametrización de las 16 Propiedades de Sistemas Complejos (marco CECAN) vinculadas a las variables del Data Lake territorial de Aysén.",
        "autor": "Álvaro Contreras Barrios",
        "region": "Aysén del General Carlos Ibáñez del Campo (CL-XI)",
        "fecha_generacion": "2026-10-19T12:00:00Z",
        "total_properties": 16,
        "properties_with_empirical_charts": 13,
        "properties_metacognitive_or_simulated": 3,
        "properties": [
            {
                "property_id": 1,
                "property_num": "01",
                "name_es": "Retroalimentación",
                "name_en": "Feedback",
                "hasEmpiricalChart": True,
                "description": "Cuando el resultado de un proceso influye en la entrada de forma directa o indirecta, acelerando (positiva) o amortiguando (negativa) el cambio del sistema.",
                "presets": [
                    {
                        "preset_id": "01_a_positiva",
                        "sub_preset": "A",
                        "subtype": "Positiva/Refuerzo",
                        "titulo": "Retroalimentación Positiva (+): Frío, Quema de Leña y Crisis Respiratoria",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "dias_sobre_norma_mp25",
                        "labelX": "Días sobre norma MP2.5 anual (días)",
                        "varY": "urgencias_respiratorias_pct",
                        "labelY": "Urgencias respiratorias invernales (% del total)",
                        "varZ": "hogares_lena_pct",
                        "labelZ": "Hogares calefaccionados con leña (%)",
                        "what_it_shows": "Compara los días con MP2.5 alto en invierno con las consultas de urgencia por causas respiratorias en la región.",
                        "why_complex_system": "Retroalimentación de refuerzo (+): con el frío aumenta el uso de leña, sube el MP2.5 en cuencas poco ventiladas y crece la presión sobre la red de salud.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": False
                        }
                    },
                    {
                        "preset_id": "01_b_negativa",
                        "sub_preset": "B",
                        "subtype": "Negativa/Regulación",
                        "titulo": "Retroalimentación Negativa (–): Floraciones Algales y Descanso Sanitario en Fiordos",
                        "type": "series_cruce",
                        "source_dataset": "cruces_multivariables.marino_productivo",
                        "varX": "biomasa_cosecha_kton",
                        "labelX": "Biomasa cosechada mensual (kton)",
                        "varY": "infa_aerobica_pct",
                        "labelY": "Conformidad ambiental INFA aeróbica (%)",
                        "varZ": "alexandrium_cel_l",
                        "labelZ": "Densidad Alexandrium catenella (cél/L)",
                        "what_it_shows": "Compara la biomasa de cultivo en fiordos con las floraciones algales nocivas (FAN), los descansos sanitarios y las caídas de cosecha.",
                        "why_complex_system": "Retroalimentación negativa (–): una alta densidad de cultivo se asocia a floraciones y cierres de centros, lo que reduce la biomasa y alivia la carga sobre el fondo marino.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": True
                        }
                    }
                ]
            },
            {
                "property_id": 2,
                "property_num": "02",
                "name_es": "Emergencia",
                "name_en": "Emergence",
                "hasEmpiricalChart": True,
                "description": "Comportamientos, patrones o estructuras a nivel macro que surgen de la interacción colectiva de componentes a nivel micro, imposibles de predecir o deducir observando las partes aisladas.",
                "presets": [
                    {
                        "preset_id": "02_emergencia_economica",
                        "sub_preset": "A",
                        "subtype": "Económica Territorial",
                        "titulo": "Emergencia Económica: Enclaves Extractivos y Fuga del Gasto Comunal",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "inversion_seia_mmusd",
                        "labelX": "Inversión SEIA aprobada acumulada (MM USD)",
                        "varY": "fuga_compras_pct",
                        "labelY": "Fuga de compras públicas fuera de la región (%)",
                        "varZ": "dependencia_fcm_pct",
                        "labelZ": "Dependencia del Fondo Común Municipal (%)",
                        "what_it_shows": "Compara la inversión aprobada en el SEIA con las compras locales y la dependencia del Fondo Común Municipal en cada comuna.",
                        "why_complex_system": "Propiedad emergente: comunas con inversión industrial alta y finanzas municipales frágiles no resultan de la decisión de un solo actor, sino de varios factores combinados, como la centralización tributaria y las pocas compras a proveedores locales.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": True,
                            "perCapitaMode": False,
                            "doubleAxis": False
                        }
                    }
                ]
            },
            {
                "property_id": 3,
                "property_num": "03",
                "name_es": "Autoorganización",
                "name_en": "Self-Organisation",
                "hasEmpiricalChart": False,
                "description": "Capacidad de un sistema para generar orden espontáneo, estructuras complejas y coordinación interna a través de interacciones locales sin intervención de un mando o diseño central.",
                "methodological_note": {
                    "reason": "La autoorganización emerge de interacciones microscópicas no reducibles a una correlación cartesiana comunal.",
                    "redirect": "sistemas_complejos.html#prop-03",
                    "badge": "Simulador de Agentes"
                },
                "what_it_shows": "Muestra redes locales de coordinación, como las caletas artesanales, las mingas y los acuerdos de uso del borde costero.",
                "why_complex_system": "La autoorganización nace de reglas locales y del trato directo entre actores, sin una autoridad central. Un gráfico de dos variables no alcanza a mostrarla.",
                "suggested_switches": {
                    "excludeOutlierCoyhaique": False,
                    "perCapitaMode": False,
                    "doubleAxis": False
                }
            },
            {
                "property_id": 4,
                "property_num": "04",
                "name_es": "Palancas y nodos centrales",
                "name_en": "Leverage Points and Central Nodes",
                "hasEmpiricalChart": True,
                "description": "Lugares específicos dentro de un sistema complejo donde una pequeña intervención puede producir modificaciones profundas y generalizadas en el comportamiento global.",
                "presets": [
                    {
                        "preset_id": "04_a_nodo_critico_salud",
                        "sub_preset": "A",
                        "subtype": "Nodo Crítico Regional",
                        "titulo": "Nodo Crítico Regional: Centralización Hospitalaria en Coyhaique y Evacuaciones SAMU",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "poblacion_censo_2024",
                        "labelX": "Población comunal Censo 2024 (habitantes)",
                        "varY": "aeroevacuaciones_samu_n",
                        "labelY": "Aeroevacuaciones médicas SAMU anuales (n)",
                        "varZ": "camas_hospitalarias",
                        "labelZ": "Dotación total de camas hospitalarias (n)",
                        "what_it_shows": "Compara las camas hospitalarias de alta complejidad de Coyhaique con la dependencia de aeroevacuaciones de las comunas aisladas.",
                        "why_complex_system": "Red en estrella: Coyhaique concentra más del 70% de las camas de la región, de modo que una sobrecarga allí afecta a las 9 comunas que dependen de evacuación aeromédica.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": True,
                            "doubleAxis": False
                        }
                    },
                    {
                        "preset_id": "04_b_palanca_salmon",
                        "sub_preset": "B",
                        "subtype": "Palanca de Dominancia",
                        "titulo": "Palanca de Dominancia: Concentración en Holdings Acuícolas Madres",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "concesiones_salmon",
                        "labelX": "Concesiones acuícolas otorgadas (n)",
                        "varY": "biomasa_salmon_ton",
                        "labelY": "Biomasa de salmón cosechada anual (toneladas)",
                        "varZ": "centros_activos_salmon",
                        "labelZ": "Centros de cultivo operativos activos (n)",
                        "what_it_shows": "Muestra la concentración de las 745 concesiones en un número reducido de holdings.",
                        "why_complex_system": "Punto de palanca: 12 grupos controlan las 745 concesiones, por lo que una medida regulatoria o sanitaria sobre ellos alcanza a buena parte de la actividad del litoral.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": True,
                            "perCapitaMode": False,
                            "doubleAxis": False
                        }
                    }
                ]
            },
            {
                "property_id": 5,
                "property_num": "05",
                "name_es": "No linealidad",
                "name_en": "Non-Linearity",
                "hasEmpiricalChart": True,
                "description": "Relaciones de causa y efecto donde los cambios en los resultados no son proporcionales a los cambios en las entradas, manifestando saltos bruscos, rendimientos decrecientes o efectos multiplicadores.",
                "presets": [
                    {
                        "preset_id": "05_no_linealidad_energia",
                        "sub_preset": "A",
                        "subtype": "Disrupción Exponencial",
                        "titulo": "Disrupción Exponencial: Salto Crítico de Cortes Eléctricos en Sistemas Aislados",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "traslado_coyhaique_hrs",
                        "labelX": "Tiempo de traslado terrestre a Coyhaique (horas)",
                        "varY": "saidi_horas_anual",
                        "labelY": "Interrupción del suministro SAIDI (horas/año)",
                        "varZ": "costo_diesel_aislado_clp",
                        "labelZ": "Costo de generación diésel aislado (CLP/kWh)",
                        "what_it_shows": "Compara las horas anuales de corte eléctrico (SAIDI) con el tiempo de viaje: suben de golpe en comunas a más de 6 horas que dependen de micro-redes diésel.",
                        "why_complex_system": "Respuesta no lineal con umbral: un poco más de aislamiento complica el abastecimiento de diésel y la llegada de cuadrillas, y las horas sin suministro aumentan más que proporcionalmente.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": False
                        }
                    }
                ]
            },
            {
                "property_id": 6,
                "property_num": "06",
                "name_es": "Dominios de estabilidad",
                "name_en": "Domains of Stability",
                "hasEmpiricalChart": True,
                "description": "Configuraciones o estados estables alternativos hacia los cuales un sistema tiende a gravitar (cuencas de atracción), requiriendo perturbaciones mayores para cambiar de régimen.",
                "presets": [
                    {
                        "preset_id": "06_dominios_fiscales",
                        "sub_preset": "A",
                        "subtype": "Cuencas de Atracción Fiscal",
                        "titulo": "Cuencas de Atracción Fiscal: Bipartición entre Comunas Aisladas y Cabeceras",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "dependencia_fcm_pct",
                        "labelX": "Dependencia del Fondo Común Municipal (%)",
                        "varY": "inversion_directa_pct",
                        "labelY": "Inversión real directa municipal (% del gasto)",
                        "varZ": "pobreza_multidim_pct",
                        "labelZ": "Pobreza multidimensional CASEN (%)",
                        "what_it_shows": "Compara las 10 comunas según su autonomía financiera: cabeceras con capacidad de inversión y comunas aisladas que dependen del subsidio fiscal nacional.",
                        "why_complex_system": "Dos estados estables: los municipios tienden a quedar en uno de dos grupos, y transferencias pequeñas no bastan para pasar del que depende del subsidio al de inversión autónoma sin cambiar los incentivos.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": False
                        }
                    }
                ]
            },
            {
                "property_id": 7,
                "property_num": "07",
                "name_es": "Adaptación",
                "name_en": "Adaptation",
                "hasEmpiricalChart": True,
                "description": "Proceso dinámico mediante el cual los agentes y subsistemas ajustan sus conductas, estructuras o estrategias en respuesta a presiones selectivas y transformaciones de su entorno.",
                "presets": [
                    {
                        "preset_id": "07_a_adaptacion_biologica",
                        "sub_preset": "A",
                        "subtype": "Biológica",
                        "titulo": "Adaptación Sanitaria: Intensificación y Uso de Antimicrobianos en Cultivo",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "biomasa_salmon_ton",
                        "labelX": "Biomasa de salmón cosechada (toneladas)",
                        "varY": "antibioticos_ica_g_ton",
                        "labelY": "Índice de consumo de antibióticos ICA (g/ton)",
                        "varZ": "concesiones_salmon",
                        "labelZ": "Concesiones acuícolas otorgadas (n)",
                        "what_it_shows": "Compara el salmón cosechado por comuna con los gramos de antimicrobianos aplicados contra bacterias como Piscirickettsia salmonis.",
                        "why_complex_system": "Coadaptación: el cultivo intensivo favorece brotes bacterianos, el sector responde con tratamientos y vacunas, y los patógenos pueden volverse menos susceptibles, lo que obliga a nuevas respuestas.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": True,
                            "perCapitaMode": False,
                            "doubleAxis": False
                        }
                    },
                    {
                        "preset_id": "07_b_adaptacion_societaria",
                        "sub_preset": "B",
                        "subtype": "Societaria",
                        "titulo": "Adaptación Estructural: 12 Holdings y Red de 42 Sociedades Filiales",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "concesiones_salmon",
                        "labelX": "Concesiones acuícolas otorgadas (n)",
                        "varY": "empresas_sii",
                        "labelY": "Empresas comerciales activas SII (n)",
                        "varZ": "trabajadores_sii",
                        "labelZ": "Trabajadores dependientes registrados SII (n)",
                        "what_it_shows": "Muestra la cantidad de sociedades filiales y empresas contratistas que rodean las concesiones.",
                        "why_complex_system": "Adaptación organizacional: los holdings reparten licencias, plantas y personal entre varias razones sociales para separar riesgos sanitarios, reducir costos y ajustarse a la normativa.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": True,
                            "perCapitaMode": False,
                            "doubleAxis": False
                        }
                    }
                ]
            },
            {
                "property_id": 8,
                "property_num": "08",
                "name_es": "Dependencia del camino",
                "name_en": "Path Dependence",
                "hasEmpiricalChart": True,
                "description": "Influencia persistente y determinante de decisiones y condiciones pasadas sobre las trayectorias de desarrollo y alternativas viables en el presente y futuro.",
                "presets": [
                    {
                        "preset_id": "08_dependencia_camino",
                        "sub_preset": "A",
                        "subtype": "Inercia de Infraestructura",
                        "titulo": "Inercia de Infraestructura: Pavimentación Troncal vs Aislamiento Perpetuo",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "ruta7_pavimentada_km",
                        "labelX": "Kilómetros pavimentados en Ruta 7 (km)",
                        "varY": "internet_fijo_pct",
                        "labelY": "Penetración de internet fijo en hogares (%)",
                        "varZ": "empresas_sii",
                        "labelZ": "Empresas formales activas SII (n)",
                        "what_it_shows": "Compara la pavimentación histórica de la Carretera Austral con la conectividad por fibra óptica y la densidad de empresas en cada comuna.",
                        "why_complex_system": "Dependencia del camino: la Ruta 7 se pavimentó primero y la fibra óptica y el comercio siguieron el mismo corredor; las comunas fuera de él quedan más rezagadas.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": False
                        }
                    }
                ]
            },
            {
                "property_id": 9,
                "property_num": "09",
                "name_es": "Puntos de inflexión",
                "name_en": "Tipping Points",
                "hasEmpiricalChart": True,
                "description": "Umbrales críticos a partir de los cuales pequeños cambios en un forzante desencadenan transiciones rápidas, drásticas y a menudo difícilmente reversibles en el régimen del sistema.",
                "presets": [
                    {
                        "preset_id": "09_a_tipping_glof",
                        "sub_preset": "A",
                        "subtype": "Quiebre Hidrológico",
                        "titulo": "Punto de Quiebre Hidrológico: Vaciado Súbito GLOF en Lago Cachet II",
                        "type": "series_cruce",
                        "source_dataset": "cruces_multivariables.criosfera_riesgo",
                        "varX": "caudal_baker_m3s",
                        "labelX": "Caudal río Baker estación Bertrand (m³/s)",
                        "varY": "nivel_colonia_m",
                        "labelY": "Nivel limnígrafo río Baker Bajo Colonia (m)",
                        "varZ": "precipitacion_tortel_mm",
                        "labelZ": "Precipitación mensual Caleta Tortel (mm)",
                        "what_it_shows": "Registra los caudales extremos del río Baker cuando el lago Cachet II se vacía por el Glaciar Colonia, con crecidas de miles de m³/s en Bajo Colonia.",
                        "why_complex_system": "Punto de inflexión: el lago acumula agua durante meses y, al superar un umbral, descarga en menos de 48 horas.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": True
                        }
                    },
                    {
                        "preset_id": "09_b_tipping_sst_fan",
                        "sub_preset": "B",
                        "subtype": "Umbral Térmico Marino",
                        "titulo": "Umbral Térmico Marino: Disparo de Floración Tóxica a >15°C",
                        "type": "series_cruce",
                        "source_dataset": "cruces_multivariables.marino_productivo",
                        "varX": "sst_c",
                        "labelX": "Temperatura superficial del mar SST (°C)",
                        "varY": "alexandrium_cel_l",
                        "labelY": "Concentración celular Alexandrium catenella (cél/L)",
                        "varZ": "biomasa_cosecha_kton",
                        "labelZ": "Biomasa cosechada en barrio acuícola (kton)",
                        "what_it_shows": "Muestra la densidad de la microalga productora de veneno paralizante, que se mantiene baja hasta que la temperatura del agua supera los 15 °C.",
                        "why_complex_system": "Punto de inflexión: sobre los 15 °C y con la columna de agua estratificada, la microalga se multiplica rápido y el fiordo pasa de un estado seguro a uno con veda sanitaria.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": True
                        }
                    }
                ]
            },
            {
                "property_id": 10,
                "property_num": "10",
                "name_es": "Cambio en el tiempo",
                "name_en": "Change Over Time",
                "hasEmpiricalChart": True,
                "description": "Comportamiento temporal de las variables que incluye dinámicas de desfase, acumulaciones, tasas diferenciales de cambio y fluctuaciones cíclicas multianuales.",
                "presets": [
                    {
                        "preset_id": "10_cambio_tiempo_fan",
                        "sub_preset": "A",
                        "subtype": "Evolución Multianual Fiordos y FAN",
                        "titulo": "Evolución Multianual: Calentamiento de Aguas (TSM) y Alertas de Marea Roja Alexandrium (2015-2026)",
                        "type": "temporal",
                        "source_dataset": "cruces_multivariables.marino_productivo",
                        "seriePrimaria": "tsm_fiordos",
                        "llavePrimaria": "sst_c",
                        "labelPrimaria": "Temperatura Superficial Marina en Fiordos (°C)",
                        "serieSecundaria": "fan_alexandrium",
                        "llaveSecundaria": "alexandrium_cel_l",
                        "aliasSecundaria": "floracion_alexandrium_fan",
                        "labelSecundaria": "Densidad Celular Alexandrium catenella (cél/L)",
                        "what_it_shows": "Muestra el calentamiento de los fiordos entre 2015 y 2026 y su coincidencia con los picos de floraciones algales tóxicas.",
                        "why_complex_system": "Cambio en el tiempo: el clima actúa en escalas largas y las respuestas biológicas llegan con desfase respecto a la temperatura del momento.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": True
                        }
                    },
                    {
                        "preset_id": "10_b_cambio_tiempo_mp25",
                        "sub_preset": "B",
                        "subtype": "Evolución Multianual Atmosférica y Sanitaria",
                        "titulo": "Evolución Multianual: Clima Invernal Balmaceda y Calidad del Aire MP2.5 Coyhaique (2015-2026)",
                        "type": "temporal",
                        "source_dataset": "cruces_multivariables.clima_salud",
                        "seriePrimaria": "temperatura_minima_balmaceda",
                        "llavePrimaria": "temp_min_c",
                        "labelPrimaria": "Temperatura Mínima Media Invernal (°C)",
                        "serieSecundaria": "mp25_invernal_coyhaique",
                        "llaveSecundaria": "mp25_ugm3",
                        "aliasSecundaria": "mp25_coyhaique",
                        "labelSecundaria": "Concentración Media MP2.5 Invernal (µg/m³)",
                        "serieTerciaria": "egresos_respiratorios",
                        "llaveTerciaria": "egresos_respiratorios",
                        "labelTerciaria": "Egresos Hospitalarios Respiratorios (casos)",
                        "what_it_shows": "Compara las mínimas de temperatura en los valles orientales con el MP2.5 en Coyhaique y los egresos hospitalarios respiratorios, por año y estación.",
                        "why_complex_system": "No linealidad en el tiempo: con inversión térmica y poca ventilación, unos pocos grados bajo cero se asocian a un aumento fuerte del uso de leña y del MP2.5.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": True
                        }
                    }
                ]
            },
            {
                "property_id": 11,
                "property_num": "11",
                "name_es": "Sistema abierto",
                "name_en": "Open System",
                "hasEmpiricalChart": True,
                "description": "Intercambio continuo de materia, energía, recursos e información entre el sistema y su entorno externo, delimitado por límites porosos y dinámicos.",
                "presets": [
                    {
                        "preset_id": "11_sistema_abierto_frontera",
                        "sub_preset": "A",
                        "subtype": "Vulnerabilidad de Frontera",
                        "titulo": "Vulnerabilidad de Frontera: Sobrecosto de Combustibles y Presión Externa",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "gasolina_93_clp",
                        "labelX": "Precio minorista gasolina 93 octanos (CLP/litro)",
                        "varY": "pernoctaciones_emat",
                        "labelY": "Pernoctaciones turísticas anuales EMAT (n)",
                        "varZ": "fauna_amenazada_n",
                        "labelZ": "Especies de fauna emblemática amenazada (n)",
                        "what_it_shows": "Muestra la dependencia de Aysén de flujos externos (combustibles traídos por mar o por Argentina y turismo internacional) en un territorio de alto valor ecológico.",
                        "why_complex_system": "Sistema abierto: si sube el precio o se cierra la frontera, el costo de vida y la movilidad locales se ven afectados, porque la región no puede reemplazar esos insumos por sí sola.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": False
                        }
                    }
                ]
            },
            {
                "property_id": 12,
                "property_num": "12",
                "name_es": "Impredecibilidad",
                "name_en": "Unpredictability",
                "hasEmpiricalChart": False,
                "description": "Imposibilidad intrínseca de pronosticar con certeza matemática exacta el estado futuro de un sistema debido a la sensibilidad a condiciones iniciales y a interacciones estocásticas no deterministas.",
                "methodological_note": {
                    "reason": "La impredecibilidad intrínseca exige análisis probabilístico no determinista.",
                    "redirect": "laboratorio.html?mode=scenarios",
                    "badge": "Series Prospectivas 2030-2035"
                },
                "what_it_shows": "Muestra variables que se combinan sin patrón fijo: clima extremo, actividad volcánica y sísmica (como el volcán Hudson) y mercados globales.",
                "why_complex_system": "Impredecibilidad: aun con buenos datos no se puede anticipar un único resultado. Conviene trabajar con escenarios y rangos, no con cifras únicas.",
                "suggested_switches": {
                    "excludeOutlierCoyhaique": False,
                    "perCapitaMode": False,
                    "doubleAxis": False
                }
            },
            {
                "property_id": 13,
                "property_num": "13",
                "name_es": "Factores desconocidos",
                "name_en": "Unknown Factors",
                "hasEmpiricalChart": False,
                "description": "Fronteras del conocimiento ontológico e incertidumbre radical, asociadas a fenómenos no modelados, eventos imprevistos y 'cisnes negros' que escapan a los marcos causales convencionales.",
                "methodological_note": {
                    "reason": "Lo desconocido e incertidumbre ontológica requiere interrogación crítica reflexiva.",
                    "redirect": "laboratorio.html?mode=metacognitive",
                    "badge": "Oráculo Metacognitivo (30 Preguntas)"
                },
                "what_it_shows": "Reúne eventos sin antecedentes en los datos: nuevas enfermedades, el colapso de plataformas de hielo remotas en Campos de Hielo y cambios geopolíticos globales.",
                "why_complex_system": "Factores desconocidos: no se pueden poner en una ecuación. Ayudan los márgenes de seguridad, la flexibilidad y revisar los supuestos de quienes planifican.",
                "suggested_switches": {
                    "excludeOutlierCoyhaique": False,
                    "perCapitaMode": False,
                    "doubleAxis": False
                }
            },
            {
                "property_id": 14,
                "property_num": "14",
                "name_es": "Control distribuido",
                "name_en": "Distributed Control",
                "hasEmpiricalChart": True,
                "description": "Regulación, toma de decisiones y gobernanza repartidas entre múltiples agentes autónomos locales sin un mando centralizado único o jerarquía rígida.",
                "presets": [
                    {
                        "preset_id": "14_control_distribuido_fiscal",
                        "sub_preset": "A",
                        "subtype": "Gobernanza Territorial Descentralizada",
                        "titulo": "Gobernanza Territorial Descentralizada: Municipios Administrando Soberanía Fiscal",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "superficie_snaspe_pct",
                        "labelX": "Superficie comunal bajo protección SNASPE (%)",
                        "varY": "presupuesto_mclp",
                        "labelY": "Presupuesto municipal anual total (M CLP)",
                        "varZ": "densidad_hab_km2",
                        "labelZ": "Densidad de población (hab/km²)",
                        "what_it_shows": "Muestra cómo municipios rurales con presupuestos pequeños cuidan extensas áreas silvestres protegidas (más del 50% de la superficie comunal).",
                        "why_complex_system": "Control distribuido: con menos de 0,5 hab/km² el territorio no se puede controlar desde un solo centro; dependen de alcaldías, capitanías de puerto y guardaparques repartidos.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": True,
                            "perCapitaMode": True,
                            "doubleAxis": False
                        }
                    }
                ]
            },
            {
                "property_id": 15,
                "property_num": "15",
                "name_es": "Sistemas anidados",
                "name_en": "Nested Systems",
                "hasEmpiricalChart": True,
                "description": "Estructuras jerárquicas u holárquicas donde sistemas complejos enteros forman parte integrante de sistemas más amplios y, a la vez, contienen subsistemas autorregulados en su interior.",
                "presets": [
                    {
                        "preset_id": "15_sistemas_anidados_cuencas",
                        "sub_preset": "A",
                        "subtype": "Jerarquía de Cuencas",
                        "titulo": "Jerarquía de Cuencas: Glaciares, Derechos de Agua y Macro-escalas",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "superficie_glaciar_km2",
                        "labelX": "Superficie glaciar inventariada DGA (km²)",
                        "varY": "daa_no_consuntivos_m3s",
                        "labelY": "Derechos de agua DAA no consuntivos (m³/s)",
                        "varZ": "superficie_km2",
                        "labelZ": "Superficie territorial total comunal (km²)",
                        "what_it_shows": "Muestra la relación entre los glaciares de alta montaña, los caudales con derechos de agua no consuntivos y la extensión de las cuencas de la región.",
                        "why_complex_system": "Sistemas anidados: cada microcuenca glaciar está dentro de una cuenca fluvial (Baker, Aysén, Pascua), y esta dentro del sistema de canales y fiordos.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": False
                        }
                    }
                ]
            },
            {
                "property_id": 16,
                "property_num": "16",
                "name_es": "Múltiples escalas y niveles",
                "name_en": "Multiple Scales and Levels",
                "hasEmpiricalChart": True,
                "description": "Fenómenos que ocurren simultáneamente en diversos niveles temporales, espaciales y organizativos, con interacciones cruzadas e interferencias entre escalas macro y micro.",
                "presets": [
                    {
                        "preset_id": "16_multiples_escalas_turismo",
                        "sub_preset": "A",
                        "subtype": "Disonancia Multiescala",
                        "titulo": "Disonancia Multiescala: Turismo Masivo en Comunidades Micro-demográficas",
                        "type": "cross_section",
                        "source_dataset": "comunas",
                        "varX": "ratio_presion_turistica",
                        "labelX": "Ratio de presión turística (población flotante / permanente)",
                        "varY": "ha_snaspe_por_guardaparque",
                        "labelY": "Hectáreas protegidas por guardaparque (ha/guardaparque)",
                        "varZ": "poblacion_censo_2024",
                        "labelZ": "Población residente Censo 2024 (habitantes)",
                        "what_it_shows": "Contrasta la presión de visitantes en verano con comunas de menos de 2.000 habitantes y pocos guardaparques para cientos de miles de hectáreas.",
                        "why_complex_system": "Múltiples escalas: el turismo internacional es rápido y estacional; los servicios y la fiscalización locales son lentos y de capacidad fija. El choque se nota en saneamiento, residuos y control ambiental.",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False,
                            "perCapitaMode": False,
                            "doubleAxis": False
                        }
                    }
                ]
            }
        ]
    }

    target_file = ROOT / "data" / "cecan_16_presets_aysen.json"
    baro_file = ROOT / "data" / "raw" / "barometro_uaysen" / "barometro_integrado_aysen.json"
    barometro_data = {}
    if baro_file.exists():
        with open(baro_file, "r", encoding="utf-8") as f:
            barometro_data = json.load(f)

    try:
        from scripts.build_hubs_gallery_and_edges import build_hubs_gallery, build_extension_gallery, build_edges_inter_hub
        cecan_data["total_hubs"] = 8
        cecan_data["total_hub_presets"] = 40
        cecan_data["hubs_gallery"] = build_hubs_gallery(barometro_data)
        cecan_data["extension_gallery"] = build_extension_gallery(barometro_data)
        cecan_data["edges_inter_hub"] = build_edges_inter_hub(barometro_data)
        print("Galería de 40 visualizaciones, 10 presets de extensión e inter-hub edges inyectadas en presets CECAN.")
    except Exception as e:
        print(f"Aviso: no se pudo inyectar galería de 40 presets: {e}")

    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(cecan_data, f, indent=2, ensure_ascii=False)
    print(f"Archivo guardado exitosamente: {target_file}")
    return cecan_data

def update_cruces_multivariables():
    cruces_file = ROOT / "data" / "cruces_multivariables.json"
    with open(cruces_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Asegurar normalización de nombres de variables en criosfera_riesgo y marino_productivo
    if "cruces" in data:
        criosfera = data["cruces"].get("criosfera_riesgo", {})
        if "datos" in criosfera:
            for row in criosfera["datos"]:
                if "caudal_m3s" in row and "caudal_baker_m3s" not in row:
                    row["caudal_baker_m3s"] = row["caudal_m3s"]
                if "nivel_limnigrafo_m" in row and "nivel_colonia_m" not in row:
                    row["nivel_colonia_m"] = row["nivel_limnigrafo_m"]

        # Vincular explícitamente en cada cruce sus propiedades CECAN asociadas
        clima = data["cruces"].get("clima_salud", {})
        clima["cecan_vinculos"] = [
            {
                "property_id": 1,
                "property_num": "01",
                "preset_id": "01_a_positiva",
                "tipo": "Retroalimentación Positiva (+): Frío, Quema de Leña y Crisis Respiratoria",
                "variables": ["dias_sobre_norma_mp25", "urgencias_respiratorias_pct", "hogares_lena_pct"]
            },
            {
                "property_id": 10,
                "property_num": "10",
                "preset_id": "10_b_cambio_tiempo_mp25",
                "tipo": "Evolución Multianual: Clima Invernal Balmaceda y Calidad del Aire MP2.5 Coyhaique (2015-2026)",
                "variables": ["temp_min_c", "mp25_ugm3", "egresos_respiratorios"]
            }
        ]

        criosfera["cecan_vinculos"] = [
            {
                "property_id": 9,
                "property_num": "09",
                "preset_id": "09_a_tipping_glof",
                "tipo": "Punto de Quiebre Hidrológico: Vaciado Súbito GLOF en Lago Cachet II",
                "variables": ["caudal_baker_m3s", "nivel_colonia_m", "precipitacion_tortel_mm"]
            }
        ]

        marino = data["cruces"].get("marino_productivo", {})
        marino["cecan_vinculos"] = [
            {
                "property_id": 1,
                "property_num": "01",
                "preset_id": "01_b_negativa",
                "tipo": "Retroalimentación Negativa (–): Floraciones Algales y Descanso Sanitario en Fiordos",
                "variables": ["biomasa_cosecha_kton", "infa_aerobica_pct", "alexandrium_cel_l"]
            },
            {
                "property_id": 9,
                "property_num": "09",
                "preset_id": "09_b_tipping_sst_fan",
                "tipo": "Umbral Térmico Marino: Disparo de Floración Tóxica a >15°C",
                "variables": ["sst_c", "alexandrium_cel_l", "biomasa_cosecha_kton"]
            },
            {
                "property_id": 10,
                "property_num": "10",
                "preset_id": "10_cambio_tiempo_fan",
                "tipo": "Evolución Multianual: Calentamiento de Aguas y Alertas de Marea Roja (2015-2026)",
                "variables": ["sst_c", "alexandrium_cel_l", "biomasa_cosecha_kton"]
            }
        ]

    # 2. Agregar índice de cruces CECAN interoperable a nivel raíz
    data["cecan_interoperabilidad"] = {
        "origen_marco": "CECAN 16 Complex System Properties",
        "total_propiedades": 16,
        "propiedades_empiricas": 13,
        "propiedades_epistemicas": 3,
        "catalogo_presets_ref": "data/cecan_16_presets_aysen.json",
        "resumen_vinculos": [
            {"property_id": 1, "property_num": "01", "presets": ["01_a_positiva", "01_b_negativa"], "dataset": ["comunas", "cruces.marino_productivo"]},
            {"property_id": 2, "property_num": "02", "presets": ["02_emergencia_economica"], "dataset": ["comunas"]},
            {"property_id": 3, "property_num": "03", "presets": [], "dataset": ["simulacion_agentes"], "epistemica": True},
            {"property_id": 4, "property_num": "04", "presets": ["04_a_nodo_critico_salud", "04_b_palanca_salmon"], "dataset": ["comunas"]},
            {"property_id": 5, "property_num": "05", "presets": ["05_no_linealidad_energia"], "dataset": ["comunas"]},
            {"property_id": 6, "property_num": "06", "presets": ["06_dominios_fiscales"], "dataset": ["comunas"]},
            {"property_id": 7, "property_num": "07", "presets": ["07_a_adaptacion_biologica", "07_b_adaptacion_societaria"], "dataset": ["comunas"]},
            {"property_id": 8, "property_num": "08", "presets": ["08_dependencia_camino"], "dataset": ["comunas"]},
            {"property_id": 9, "property_num": "09", "presets": ["09_a_tipping_glof", "09_b_tipping_sst_fan"], "dataset": ["cruces.criosfera_riesgo", "cruces.marino_productivo"]},
            {"property_id": 10, "property_num": "10", "presets": ["10_cambio_tiempo_fan", "10_b_cambio_tiempo_mp25"], "dataset": ["series_prospectivas", "cruces.marino_productivo", "cruces.clima_salud"]},
            {"property_id": 11, "property_num": "11", "presets": ["11_sistema_abierto_frontera"], "dataset": ["comunas"]},
            {"property_id": 12, "property_num": "12", "presets": [], "dataset": ["series_prospectivas"], "epistemica": True},
            {"property_id": 13, "property_num": "13", "presets": [], "dataset": ["metacognitivo"], "epistemica": True},
            {"property_id": 14, "property_num": "14", "presets": ["14_control_distribuido_fiscal"], "dataset": ["comunas"]},
            {"property_id": 15, "property_num": "15", "presets": ["15_sistemas_anidados_cuencas"], "dataset": ["comunas"]},
            {"property_id": 16, "property_num": "16", "presets": ["16_multiples_escalas_turismo"], "dataset": ["comunas"]}
        ]
    }

    # 3. Inyectar matriz de relaciones explícitas inter-hub
    baro_file = ROOT / "data" / "raw" / "barometro_uaysen" / "barometro_integrado_aysen.json"
    barometro_data = {}
    if baro_file.exists():
        with open(baro_file, "r", encoding="utf-8") as f:
            barometro_data = json.load(f)

    try:
        from scripts.build_hubs_gallery_and_edges import build_edges_inter_hub, build_extension_gallery
        data["edges_inter_hub"] = build_edges_inter_hub(barometro_data)
        data["total_edges_inter_hub"] = len(data["edges_inter_hub"])
        data["extension_gallery"] = build_extension_gallery(barometro_data)
        print("Matriz edges_inter_hub y extension_gallery inyectadas en cruces_multivariables.json.")
    except Exception as e:
        print(f"Aviso: no se pudo inyectar edges_inter_hub: {e}")

    with open(cruces_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Archivo actualizado exitosamente: {cruces_file}")

if __name__ == "__main__":
    build_cecan_presets()
    update_cruces_multivariables()
