#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/build_cecan_presets.py
=============================================================================
Genera data/cecan_16_presets_aysen.json y actualiza data/cruces_multivariables.json
vinculando las 16 Propiedades de Complejidad con la base de datos territorial de Aysén.

Organiza las 16 propiedades bajo 3 modalidades analíticas exactas (mode):
1. Grupo A · mode: "epistemological_limit" (3 propiedades: #02, #12, #13)
2. Grupo B · mode: "dual_chart" (5 propiedades: #01, #08, #11, #15, #16)
3. Grupo C · mode: "single_chart" (8 propiedades: #03, #04, #05, #06, #07, #09, #10, #14)

Regla estricta: CERO EMOJIS y CERO siglas redundantes en títulos, etiquetas o metadatos.
=============================================================================
"""

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def build_complexity_presets():
    presets_data = {
        "version": "2.0.0",
        "fecha_actualizacion": "2026-10-17",
        "dataset_id": "propiedades_16_complejidad_aysen",
        "titulo": "16 Propiedades de Complejidad para la Región de Aysén",
        "descripcion": "Catálogo canónico de configuración y parametrización de las 16 Propiedades de Complejidad vinculadas a las variables territoriales oficiales de Aysén.",
        "referencia_academica": "Boehnert, J., Penn, A., Barbrook-Johnson, P., Bicket, M., & Hills, D. (2018). The visual representation of complexity: Definitions, examples & learning points [Poster]. Loughborough University.",
        "total_properties": 16,
        "empirical_charts_count": 14,
        "epistemological_limits_count": 3,
        "dual_charts_count": 5,
        "single_charts_count": 8,
        "properties": [
            # =================================================================
            # #01 RETROALIMENTACIÓN (dual_chart)
            # =================================================================
            {
                "property_id": 1,
                "property_num": "01",
                "prop_id": "prop_01",
                "name_es": "Retroalimentación",
                "name_en": "Feedback",
                "mode": "dual_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Cuando el resultado o producto de un proceso influye en la entrada de forma directa o indirecta, acelerando el cambio (retroalimentación positiva) o amortiguándolo (retroalimentación negativa).",
                "aysen_explanation": "En las comunas de Aysén operan dos bucles simultáneos sobre la calidad del aire invernal: por un lado, el alto porcentaje de hogares que calefaccionan con leña intensifica los días sobre la norma de MP2,5 en cuencas con inversión térmica (bucle reforzador, Gráfico A); por otro, el programa acumulado de recambio térmico y aislación PDA entre 2015 y 2026 amortigua progresivamente la concentración invernal de MP2,5 en Coyhaique (bucle regulador, Gráfico B).",
                "official_source": "MMA (Red SINCA / PDA Coyhaique) e INE - MINSAL",
                "return_url": "sistemas_complejos.html?prop=01",
                "reflection_card": {
                    "header": "#01 Retroalimentación",
                    "definition": "Cuando el resultado o producto de un proceso influye en la entrada de forma directa o indirecta, acelerando el cambio (bucle reforzador) o estabilizándolo (bucle regulador).",
                    "aysen_case": "En Aysén coexisten un bucle reforzador comunal —donde la alta dependencia de leña residencial y el frío invernal elevan los episodios críticos de saturación por MP2,5— y un bucle regulador multianual (2015–2026), donde el recambio de calefactores y la aislación térmica PDA reducen gradualmente el promedio invernal de material particulado fino.",
                    "official_source": "MMA (Red SINCA / PDA) y MINSAL (DEIS)",
                    "return_url": "sistemas_complejos.html?prop=01",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_01_chart_a",
                        "label": "Gráfico A · Bucle Reforzador Comunal: Uso de Leña vs. Días Sobre Norma MP2,5",
                        "title": "Bucle Reforzador: Hogares con Leña (%) vs. Días Sobre Norma MP2,5",
                        "chart_type": "bar",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "nombre",
                        "y_axis": "hogares_lena_pct",
                        "secondary_axis": "dias_sobre_norma_mp25",
                        "series_keys": ["hogares_lena_pct", "dias_sobre_norma_mp25"],
                        "x_label": "Comunas de Aysén (10)",
                        "y_label": "Hogares con Leña (%) / Días > Norma MP2,5 (días/año)",
                        "source": "MMA - Red SINCA y Encuesta CASEN / INE",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False
                        },
                        "hypothesis_es": "El predominio de combustión de leña en valles cerrados refuerza la saturación atmosférica invernal."
                    },
                    {
                        "preset_id": "prop_01_chart_b",
                        "label": "Gráfico B · Bucle Regulador (2015–2026): Recambio Térmico PDA vs. MP2,5 Invernal",
                        "title": "Bucle Regulador (2015–2026): Recambio Térmico PDA vs. MP2,5 Invernal",
                        "chart_type": "line",
                        "dimension": "tiempo",
                        "dataset_source": "temporal_2015_2026",
                        "x_axis": "anio",
                        "y_axis": "recambio_calefactores_pda_hist",
                        "secondary_axis": "mp25_invernal_coyhaique",
                        "series_keys": ["recambio_calefactores_pda_hist", "mp25_invernal_coyhaique"],
                        "x_label": "Año (Serie Histórica 2015–2026)",
                        "y_label": "Recambios Térmicos PDA (unid.) / MP2,5 Invernal (µg/m³)",
                        "source": "MMA - Plan de Descontaminación Atmosférica (PDA) y Red SINCA",
                        "suggested_switches": {
                            "excludeOutlierCoyhaique": False
                        },
                        "hypothesis_es": "La acumulación de recambios térmicos y aislación de viviendas actúa como retroalimentación negativa reduciendo el promedio invernal de MP2,5."
                    }
                ]
            },

            # =================================================================
            # #02 EMERGENCIA (epistemological_limit - 3 widgets simultáneos)
            # =================================================================
            {
                "property_id": 2,
                "property_num": "02",
                "prop_id": "prop_02",
                "name_es": "Emergencia",
                "name_en": "Emergence",
                "mode": "epistemological_limit",
                "hasEmpiricalChart": True,
                "systemic_widgets": ["tarifa_bt1_clp", "dias_sobre_norma_mp25", "dependencia_fcm_pct"],
                "definition_es": "Propiedades nuevas de nivel superior que surgen de la interacción colectiva de componentes y no pueden describirse ni deducirse examinando una sola parte aislada.",
                "aysen_explanation": "Límite epistemológico de los gráficos bivariados aislados: fenómenos emergentes en Aysén como la vulnerabilidad energética invernal o la fragilidad fiscal comunal no pueden deducirse de una única regresión entre dos variables. Emergen simultáneamente del acoplamiento entre el alto costo eléctrico residencial (tarifa BT1), la saturación atmosférica por combustión de leña (días sobre norma MP2,5) y la dependencia presupuestaria municipal respecto del Fondo Común Municipal.",
                "official_source": "CNE / SEC, MMA (Red SINCA) y SUBDERE (SINIM)",
                "return_url": "sistemas_complejos.html?prop=02",
                "reflection_card": {
                    "header": "#02 Emergencia",
                    "definition": "Propiedades macroscópicas que surgen de la interacción entre múltiples subsistemas y que no pueden explicarse ni predecirse observando sus componentes por separado.",
                    "aysen_case": "Por qué un único gráfico bivariado es insuficiente: la vulnerabilidad invernal y la fragilidad territorial en Aysén emergen de la interacción simultánea de al menos tres dominios distintos que se muestran en los widgets adjuntos: (1) Energía: Tarifa eléctrica residencial BT1 ($/kWh), que encarece la calefacción limpia; (2) Ambiente y Salud: Días sobre norma de MP2,5 (días/año) por quema de leña; y (3) Gobernanza: Dependencia comunal del Fondo Común Municipal (%), que limita la capacidad de respuesta local.",
                    "official_source": "CNE / SEC, MMA (Red SINCA) y SUBDERE (SINIM)",
                    "return_url": "sistemas_complejos.html?prop=02",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_02_widget_energia",
                        "label": "Dominio 1 · Energía: Tarifa Eléctrica Residencial BT1 por Comuna",
                        "title": "Dominio Energía: Tarifa Residencial BT1 ($/kWh)",
                        "chart_type": "bar",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "nombre",
                        "y_axis": "tarifa_bt1_clp",
                        "series_keys": ["tarifa_bt1_clp"],
                        "x_label": "Comunas de Aysén (10)",
                        "y_label": "Tarifa Eléctrica Residencial BT1 ($/kWh)",
                        "source": "CNE / SEC - Tarifas Sistemas Medianos y Aislados",
                        "suggested_switches": {"excludeOutlierCoyhaique": False}
                    },
                    {
                        "preset_id": "prop_02_widget_aire",
                        "label": "Dominio 2 · Ambiente: Episodios Sobre Norma MP2,5 por Comuna",
                        "title": "Dominio Ambiente: Días Sobre Norma MP2,5 (días/año)",
                        "chart_type": "bar",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "nombre",
                        "y_axis": "dias_sobre_norma_mp25",
                        "series_keys": ["dias_sobre_norma_mp25"],
                        "x_label": "Comunas de Aysén (10)",
                        "y_label": "Días Sobre Norma MP2,5 (días/año)",
                        "source": "MMA - Red de Monitoreo SINCA Aysén",
                        "suggested_switches": {"excludeOutlierCoyhaique": False}
                    },
                    {
                        "preset_id": "prop_02_widget_fiscal",
                        "label": "Dominio 3 · Gobernanza: Dependencia del Fondo Común Municipal",
                        "title": "Dominio Gobernanza: Dependencia del FCM (%)",
                        "chart_type": "bar",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "nombre",
                        "y_axis": "dependencia_fcm_pct",
                        "series_keys": ["dependencia_fcm_pct"],
                        "x_label": "Comunas de Aysén (10)",
                        "y_label": "Dependencia Fondo Común Municipal (%)",
                        "source": "SUBDERE - Sistema Nacional de Información Municipal (SINIM)",
                        "suggested_switches": {"excludeOutlierCoyhaique": False}
                    }
                ]
            },

            # =================================================================
            # #03 AUTOORGANIZACIÓN (single_chart)
            # =================================================================
            {
                "property_id": 3,
                "property_num": "03",
                "prop_id": "prop_03",
                "name_es": "Autoorganización",
                "name_en": "Self-organisation",
                "mode": "single_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Regularidades o patrones de nivel superior que surgen espontáneamente a partir de la interacción local de componentes autónomos sin un mando centralizado.",
                "aysen_explanation": "En las 10 comunas de Aysén, la red de prestadores de servicios turísticos registrados en SERNATUR y los espacios culturales locales se articulan de manera autónoma alrededor de los flujos de visitación a parques y reservas del SNASPE, conformando circuitos de hospitalidad e identidad sin planificación centralizada única.",
                "official_source": "SERNATUR (Registro Nacional), MINCAP y CONAF (SNASPE)",
                "return_url": "sistemas_complejos.html?prop=03",
                "reflection_card": {
                    "header": "#03 Autoorganización",
                    "definition": "Capacidad de un sistema para generar orden, redes locales y estructuras coordinadas mediante interacciones autónomas de nivel inferior sin dirección centralizada.",
                    "aysen_case": "A lo largo de la Carretera Austral y el litoral, microempresas de alojamiento, guías locales (prestadores SERNATUR) y espacios culturales o museos comunitarios emergen y se coordinan localmente en respuesta a la visitación de áreas silvestres protegidas SNASPE en comunas como Río Ibáñez, Chile Chico, Cisnes y Tortel.",
                    "official_source": "SERNATUR, Ministerio de las Culturas (MINCAP) y CONAF",
                    "return_url": "sistemas_complejos.html?prop=03",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_03_chart_a",
                        "label": "Prestadores Turísticos SERNATUR, Espacios Culturales y Visitación SNASPE por Comuna",
                        "title": "Autoorganización Local: Prestadores SERNATUR y Espacios Culturales vs. Visitantes SNASPE",
                        "chart_type": "bar",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "nombre",
                        "y_axis": "prestadores_sernatur",
                        "secondary_axis": "visitantes_snaspe",
                        "series_keys": ["prestadores_sernatur", "total_espacios_culturales", "visitantes_snaspe"],
                        "x_label": "Comunas de Aysén (10)",
                        "y_label": "Prestadores SERNATUR y Espacios Culturales (n°) / Visitantes SNASPE",
                        "source": "SERNATUR, MINCAP y CONAF (SNASPE)",
                        "suggested_switches": {"excludeOutlierCoyhaique": False},
                        "hypothesis_es": "Los actores locales de turismo y cultura se autoorganizan territorialmente en torno a los nodos de visitación de naturaleza."
                    }
                ]
            },

            # =================================================================
            # #04 PALANCAS Y NODOS CENTRALES (single_chart)
            # =================================================================
            {
                "property_id": 4,
                "property_num": "04",
                "prop_id": "prop_04",
                "name_es": "Palancas y nodos centrales",
                "name_en": "Levers and hubs",
                "mode": "single_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Componentes de un sistema que ejercen una influencia desproporcionada debido a la estructura de sus conexiones, actuando como palancas de cambio o puntos de vulnerabilidad.",
                "aysen_explanation": "La distribución comunal de camas hospitalarias, médicos por mil habitantes y penetración de internet fijo evidencia una arquitectura en estrella donde Coyhaique y Puerto Aysén operan como nodos centrales de alta complejidad asistencial y digital frente a las 8 comunas periféricas.",
                "official_source": "MINSAL (DEIS / Servicio de Salud Aysén) y SUBTEL",
                "return_url": "sistemas_complejos.html?prop=04",
                "reflection_card": {
                    "header": "#04 Palancas y nodos centrales",
                    "definition": "Nodos dentro de una red que concentran conexiones críticas y determinan tanto la capacidad de movilizar cambios como la vulnerabilidad del sistema ante interrupciones.",
                    "aysen_case": "Coyhaique (167 camas hospitalarias; 3,12 médicos por mil hab.; 61,2% de internet fijo) y Puerto Aysén concentran la infraestructura crítica regional. Cualquier saturación o corte de conectividad en estos dos nodos centrales repercute de inmediato sobre las 8 comunas periféricas que dependen de derivaciones clínicas y enlaces troncales.",
                    "official_source": "MINSAL - Servicio de Salud Aysén (DEIS) y SUBTEL",
                    "return_url": "sistemas_complejos.html?prop=04",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_04_chart_a",
                        "label": "Nodos Centrales Asistenciales y Digitales por Comuna",
                        "title": "Nodos Centrales: Camas Hospitalarias, Médicos/1.000 hab. e Internet Fijo (%)",
                        "chart_type": "bar",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "nombre",
                        "y_axis": "camas_hospitalarias",
                        "secondary_axis": "internet_fijo_pct",
                        "series_keys": ["camas_hospitalarias", "medicos_por_mil_hab", "internet_fijo_pct"],
                        "x_label": "Comunas de Aysén (10)",
                        "y_label": "Camas Hospitalarias (n°) y Médicos/1k hab. / Internet Fijo (%)",
                        "source": "MINSAL (DEIS - SSA) y SUBTEL",
                        "sortRanking": "desc",
                        "suggested_switches": {"excludeOutlierCoyhaique": False},
                        "hypothesis_es": "La concentración de camas hospitalarias, dotación médica y fibra óptica en Coyhaique y Aysén configura una red tipo hub-and-spoke."
                    }
                ]
            },

            # =================================================================
            # #05 NO LINEALIDAD (single_chart)
            # =================================================================
            {
                "property_id": 5,
                "property_num": "05",
                "prop_id": "prop_05",
                "name_es": "No linealidad",
                "name_en": "Non-linearity",
                "mode": "single_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Relación en la que el efecto de las entradas sobre los resultados no es proporcional, presentando saltos abruptos o curvas de umbral ante variaciones similares.",
                "aysen_explanation": "Al cruzar el porcentaje comunal de hogares que usan leña (eje X) con los días anuales sobre la norma de MP2,5 (eje Y), la respuesta no es una recta proporcional: sobre el umbral de 85% de uso de leña, las comunas encajonadas en valles interiores con inversión térmica y mayor densidad urbana experimentan un salto desproporcionado en episodios críticos.",
                "official_source": "MMA (Red SINCA Aysén) y Ministerio de Desarrollo Social (CASEN)",
                "return_url": "sistemas_complejos.html?prop=05",
                "reflection_card": {
                    "header": "#05 No linealidad",
                    "definition": "Un sistema es no lineal cuando los cambios en los resultados no guardan proporción constante con los cambios en las entradas, exhibiendo efectos umbral o aceleraciones abruptas.",
                    "aysen_case": "Todas las comunas de Aysén superan el 82% de uso de leña residencial, pero los días sobre la norma de MP2,5 no crecen linealmente con dicho porcentaje: la combinación de densidad de emisiones y encajonamiento topográfico en Coyhaique (87 días) y Puerto Aysén (34 días) dispara de forma no lineal la saturación atmosférica frente a localidades ventosas o costeras.",
                    "official_source": "MMA - Red SINCA Aysén y Encuesta CASEN / INE",
                    "return_url": "sistemas_complejos.html?prop=05",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_05_chart_a",
                        "label": "Dispersión No Lineal: Hogares con Leña (%) vs. Días Sobre Norma MP2,5",
                        "title": "No Linealidad y Efecto Umbral: Uso de Leña (%) vs. Días Sobre Norma MP2,5",
                        "chart_type": "scatter",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "hogares_lena_pct",
                        "y_axis": "dias_sobre_norma_mp25",
                        "series_keys": ["hogares_lena_pct", "dias_sobre_norma_mp25"],
                        "x_label": "Hogares que Utilizan Leña para Calefacción (%)",
                        "y_label": "Episodios Anuales Sobre Norma MP2,5 (días/año)",
                        "source": "MMA - Red SINCA y Encuesta CASEN",
                        "suggested_switches": {"excludeOutlierCoyhaique": False},
                        "hypothesis_es": "Sobre el umbral del 85% de uso de leña, la topografía de cuenca e inversión térmica genera un salto no lineal en los días de saturación por MP2,5."
                    }
                ]
            },

            # =================================================================
            # #06 DOMINIOS DE ESTABILIDAD (single_chart)
            # =================================================================
            {
                "property_id": 6,
                "property_num": "06",
                "prop_id": "prop_06",
                "name_es": "Dominios de estabilidad",
                "name_en": "Domains of stability",
                "mode": "single_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Estados estables o cuencas de atracción hacia los cuales gravita un sistema, permaneciendo en ellos a menos que una perturbación supere un umbral crítico.",
                "aysen_explanation": "La serie 2015–2026 de superficie regional de bosque nativo y áreas protegidas SNASPE frente a las hectáreas afectadas anualmente por incendios forestales (CONAF) ilustra cómo la cobertura boscosa austral se mantiene dentro de un dominio de estabilidad pese a perturbaciones puntuales como el incendio de Bahía Mansa / Cochrane en 2019.",
                "official_source": "CONAF (Catastro Vegetacional y Estadísticas de Incendios Forestales)",
                "return_url": "sistemas_complejos.html?prop=06",
                "reflection_card": {
                    "header": "#06 Dominios de estabilidad",
                    "definition": "Configuraciones hacia las cuales tiende a retornar un sistema tras perturbaciones moderadas, pero que pueden desplazarse hacia otro régimen si se rebasa un umbral.",
                    "aysen_case": "Entre 2015 y 2026, la matriz de bosque nativo y áreas silvestres protegidas de Aysén (~4,81 millones de hectáreas) absorbe perturbaciones interanuales de incendios forestales manteniendo su cuenca de estabilidad ecológica, aunque el pico de 2019 (15.420 ha afectadas) advierte sobre el riesgo de cruzar umbrales de regeneración en bosques subantárticos de lento crecimiento.",
                    "official_source": "CONAF - Catastro de Bosque Nativo, SNASPE y Estadísticas de Incendios",
                    "return_url": "sistemas_complejos.html?prop=06",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_06_chart_a",
                        "label": "Serie 2015–2026: Superficie Bosque Nativo / SNASPE vs. Incendios Forestales CONAF",
                        "title": "Dominios de Estabilidad (2015–2026): Bosque Nativo / SNASPE vs. Incendios Forestales",
                        "chart_type": "line",
                        "dimension": "tiempo",
                        "dataset_source": "temporal_2015_2026",
                        "x_axis": "anio",
                        "y_axis": "superficie_bosque_nativo_snaspe_miles_ha_hist",
                        "secondary_axis": "superficie_incendios_forestales_conaf_ha_hist",
                        "series_keys": [
                            "superficie_bosque_nativo_snaspe_miles_ha_hist",
                            "superficie_incendios_forestales_conaf_ha_hist"
                        ],
                        "x_label": "Año (Serie Histórica 2015–2026)",
                        "y_label": "Bosque Nativo y SNASPE (Miles ha) / Incendios Forestales (ha/año)",
                        "source": "CONAF - Catastro Vegetacional y Departamento de Protección contra Incendios",
                        "suggested_switches": {"excludeOutlierCoyhaique": False},
                        "hypothesis_es": "La cobertura de bosque nativo permanece en su dominio de estabilidad frente a pulsos acotados de fuego, salvo eventos extremos que alteren el suelo."
                    }
                ]
            },

            # =================================================================
            # #07 ADAPTACIÓN (single_chart)
            # =================================================================
            {
                "property_id": 7,
                "property_num": "07",
                "prop_id": "prop_07",
                "name_es": "Adaptación",
                "name_en": "Adaptation",
                "mode": "single_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Capacidad de los actores y componentes del sistema para aprender, ajustar sus estrategias y evolucionar en respuesta a cambios del entorno o intervenciones.",
                "aysen_explanation": "Entre 2015 y 2026, la expansión de la penetración regional de internet fijo (SUBTEL, de 24,8% a 64,8%) ha sido acompañada por un aprendizaje adaptativo de las micro y pequeñas empresas regionales, que elevaron la retención local de compras públicas en MercadoPúblico (ChileCompra) del 31,2% al 51,8%.",
                "official_source": "SUBTEL (Series de Internet Fijo) y Dirección ChileCompra",
                "return_url": "sistemas_complejos.html?prop=07",
                "reflection_card": {
                    "header": "#07 Adaptación",
                    "definition": "Proceso mediante el cual los agentes modifican sus prácticas, capacidades o estructuras para responder estratégicamente a nuevas condiciones o infraestructuras.",
                    "aysen_case": "A medida que el despliegue de fibra óptica austral redujo el aislamiento digital entre 2015 y 2026, los proveedores locales de las comunas de Aysén adaptaron sus procesos de licitación electrónica en ChileCompra, incrementando en más de veinte puntos porcentuales la proporción del gasto público adjudicado a empresas residentes en la región.",
                    "official_source": "SUBTEL (Estadísticas Telecomunicaciones) y Dirección ChileCompra",
                    "return_url": "sistemas_complejos.html?prop=07",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_07_chart_a",
                        "label": "Serie 2015–2026: Penetración de Internet Fijo SUBTEL vs. Retención de Compras Públicas Locales",
                        "title": "Adaptación Digital (2015–2026): Internet Fijo SUBTEL (%) vs. Compras Públicas Locales (%)",
                        "chart_type": "line",
                        "dimension": "tiempo",
                        "dataset_source": "temporal_2015_2026",
                        "x_axis": "anio",
                        "y_axis": "penetracion_internet_fijo_subtel_pct_hist",
                        "secondary_axis": "retencion_compras_publicas_locales_pct_hist",
                        "series_keys": [
                            "penetracion_internet_fijo_subtel_pct_hist",
                            "retencion_compras_publicas_locales_pct_hist"
                        ],
                        "x_label": "Año (Serie Histórica 2015–2026)",
                        "y_label": "Penetración Internet Fijo (%) / Retención Compras Locales (%)",
                        "source": "SUBTEL y Dirección ChileCompra (MercadoPúblico)",
                        "suggested_switches": {"excludeOutlierCoyhaique": False},
                        "hypothesis_es": "La adopción de conectividad fija habilita el aprendizaje digital de proveedores locales para capturar mayor participación en compras públicas."
                    }
                ]
            },

            # =================================================================
            # #08 DEPENDENCIA DEL CAMINO (dual_chart)
            # =================================================================
            {
                "property_id": 8,
                "property_num": "08",
                "prop_id": "prop_08",
                "name_es": "Dependencia del camino",
                "name_en": "Path dependency",
                "mode": "dual_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Condición en la que los estados y decisiones actuales o futuras dependen de la secuencia histórica de decisiones e infraestructuras que los precedieron.",
                "aysen_explanation": "La estructura fiscal de los municipios de Aysén exhibe una marcada dependencia del camino (lock-in institucional): la serie 2015–2026 muestra que la dependencia regional del Fondo Común Municipal permanece sobre el 61% frente a los ingresos propios permanentes (Gráfico A), mientras el corte comunal revela cómo esa rigidez histórica condiciona la alta proporción del presupuesto absorbida por gasto en personal en las comunas de menor base tributaria (Gráfico B).",
                "official_source": "SUBDERE - Sistema Nacional de Información Municipal (SINIM)",
                "return_url": "sistemas_complejos.html?prop=08",
                "reflection_card": {
                    "header": "#08 Dependencia del camino",
                    "definition": "Las trayectorias pasadas y los diseños institucionales previos restringen el abanico de opciones viables en el presente, generando inercia estructural.",
                    "aysen_case": "El régimen de financiamiento municipal chileno creó en las comunas aisladas de Aysén una trayectoria histórica de alta dependencia del Fondo Común Municipal (superior al 85% en Tortel, O'Higgins y Lago Verde). Esta estructura acumulada en el tiempo limita la generación de ingresos propios permanentes y compromete entre el 40% y el 52% del gasto en plantas administrativas fijas.",
                    "official_source": "SUBDERE - Sistema Nacional de Información Municipal (SINIM)",
                    "return_url": "sistemas_complejos.html?prop=08",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_08_chart_a",
                        "label": "Gráfico A · Trayectoria 2015–2026: Dependencia del FCM vs. Ingresos Propios Permanentes",
                        "title": "Inercia Fiscal (2015–2026): Dependencia FCM (%) vs. Ingresos Propios Permanentes (%)",
                        "chart_type": "line",
                        "dimension": "tiempo",
                        "dataset_source": "temporal_2015_2026",
                        "x_axis": "anio",
                        "y_axis": "dependencia_fcm_promedio_regional_pct",
                        "secondary_axis": "ingresos_propios_permanentes_pct_hist",
                        "series_keys": [
                            "dependencia_fcm_promedio_regional_pct",
                            "ingresos_propios_permanentes_pct_hist"
                        ],
                        "x_label": "Año (Serie Histórica 2015–2026)",
                        "y_label": "Dependencia FCM (%) / Ingresos Propios Permanentes (%)",
                        "source": "SUBDERE - SINIM (Series Presupuestarias 2015–2026)",
                        "suggested_switches": {"excludeOutlierCoyhaique": False}
                    },
                    {
                        "preset_id": "prop_08_chart_b",
                        "label": "Gráfico B · Estructura Comunal: Dependencia del FCM (%) vs. Gasto en Personal (%)",
                        "title": "Rigidez Presupuestaria Comunal: Dependencia FCM (%) vs. Gasto en Personal (%)",
                        "chart_type": "bar",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "nombre",
                        "y_axis": "dependencia_fcm_pct",
                        "secondary_axis": "gasto_personal_pct",
                        "series_keys": ["dependencia_fcm_pct", "gasto_personal_pct"],
                        "x_label": "Comunas de Aysén (10)",
                        "y_label": "Dependencia del FCM (%) / Gasto en Personal (%)",
                        "source": "SUBDERE - Sistema Nacional de Información Municipal (SINIM)",
                        "suggested_switches": {"excludeOutlierCoyhaique": False}
                    }
                ]
            },

            # =================================================================
            # #09 PUNTOS DE INFLEXIÓN (single_chart)
            # =================================================================
            {
                "property_id": 9,
                "property_num": "09",
                "prop_id": "prop_09",
                "name_es": "Puntos de inflexión",
                "name_en": "Tipping points",
                "mode": "single_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Umbral crítico a partir del cual el comportamiento y los resultados del sistema cambian de forma súbita, alterando la pendiente o el régimen de su trayectoria.",
                "aysen_explanation": "Las series 2015–2026 de pernoctaciones turísticas EMAT y de flujo anual de pasajeros en el aeródromo Balmaceda capturan con nitidez el quiebre estructural de 2020 (caída de 396.400 a 118.500 noches) y el cambio de pendiente en la fase de reorganización y recuperación 2021–2026.",
                "official_source": "INE - SERNATUR (Encuesta EMAT) y Junta de Aeronáutica Civil (JAC)",
                "return_url": "sistemas_complejos.html?prop=09",
                "reflection_card": {
                    "header": "#09 Puntos de inflexión",
                    "definition": "Momento o umbral crítico más allá del cual un sistema experimenta una transición abrupta de régimen y modifica su pendiente de evolución.",
                    "aysen_case": "El sistema turístico y aerocomercial de Aysén registró en 2020 un punto de inflexión abrupto por el cierre sanitario de conectividad aérea y terrestre, contrayendo las pernoctaciones EMAT en un 70,1% y el tráfico en Balmaceda en un 55,2%, seguido de un nuevo régimen de expansión acelerada entre 2022 y 2026.",
                    "official_source": "INE - SERNATUR (EMAT) y Junta de Aeronáutica Civil (JAC)",
                    "return_url": "sistemas_complejos.html?prop=09",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_09_chart_a",
                        "label": "Serie 2015–2026: Pernoctaciones Turísticas EMAT vs. Tráfico Aéreo Balmaceda JAC",
                        "title": "Punto de Inflexión (2015–2026): Pernoctaciones EMAT vs. Pasajeros Balmaceda JAC",
                        "chart_type": "line",
                        "dimension": "tiempo",
                        "dataset_source": "temporal_2015_2026",
                        "x_axis": "anio",
                        "y_axis": "pernoctaciones_anuales_emat_hist",
                        "secondary_axis": "trafico_aereo_pasajeros_balmaceda_jac",
                        "series_keys": [
                            "pernoctaciones_anuales_emat_hist",
                            "trafico_aereo_pasajeros_balmaceda_jac"
                        ],
                        "x_label": "Año (Serie Histórica 2015–2026)",
                        "y_label": "Pernoctaciones EMAT (noches) / Pasajeros Balmaceda (pasajeros)",
                        "source": "INE - SERNATUR (EMAT) y Junta de Aeronáutica Civil (JAC)",
                        "suggested_switches": {"excludeOutlierCoyhaique": False},
                        "hypothesis_es": "El cierre de conectividad de 2020 produjo un quiebre estructural simultáneo en el flujo aéreo y la ocupación turística regional."
                    }
                ]
            },

            # =================================================================
            # #10 CAMBIO EN EL TIEMPO (single_chart)
            # =================================================================
            {
                "property_id": 10,
                "property_num": "10",
                "prop_id": "prop_10",
                "name_es": "Cambio en el tiempo",
                "name_en": "Change over time",
                "mode": "single_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Los sistemas complejos se encuentran continuamente fuera del equilibrio y evolucionan en el tiempo mediante transiciones graduales, acumulaciones y desfases.",
                "aysen_explanation": "La serie 2015–2026 de la matriz eléctrica de Aysén muestra cómo el sistema energético cambia continuamente en el tiempo: mientras la generación renovable hidroeléctrica y eólica se expande de 92,4 a 144,0 GWh y la generación diésel desciende de 68,5 a 55,4 GWh, la tarifa residencial BT1 evoluciona con rezagos regulatorios y de costos de distribución.",
                "official_source": "Comisión Nacional de Energía (CNE) y Superintendencia de Electricidad y Combustibles (SEC)",
                "return_url": "sistemas_complejos.html?prop=10",
                "reflection_card": {
                    "header": "#10 Cambio en el tiempo",
                    "definition": "Desarrollo continuo de los sistemas fuera del equilibrio, caracterizado por tasas diferenciales de cambio y desfases entre inversión física y resultados tarifarios.",
                    "aysen_case": "Entre 2015 y 2026, la incorporación gradual de centrales mini-hidro y parques eólicos en los sistemas medianos de Aysén desplazó parcialmente la generación térmica diésel, demostrando una transición estructural en el tiempo que convive con el reajuste progresivo de la tarifa residencial BT1.",
                    "official_source": "Comisión Nacional de Energía (CNE) y SEC",
                    "return_url": "sistemas_complejos.html?prop=10",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_10_chart_a",
                        "label": "Serie 2015–2026: Transición Matriz Eléctrica (Diésel vs. Hidro/Eólica y Tarifa BT1)",
                        "title": "Cambio en el Tiempo (2015–2026): Generación Hidro/Eólica vs. Diésel (GWh) y Tarifa BT1",
                        "chart_type": "line",
                        "dimension": "tiempo",
                        "dataset_source": "temporal_2015_2026",
                        "x_axis": "anio",
                        "y_axis": "generacion_hidro_gwh",
                        "secondary_axis": "generacion_diesel_gwh",
                        "series_keys": [
                            "generacion_hidro_gwh",
                            "generacion_diesel_gwh",
                            "tarifa_bt1_regional_clp_hist"
                        ],
                        "x_label": "Año (Serie Histórica 2015–2026)",
                        "y_label": "Generación Hidro/Eólica y Diésel (GWh) / Tarifa BT1 ($/kWh)",
                        "source": "Comisión Nacional de Energía (CNE) y SEC",
                        "suggested_switches": {"excludeOutlierCoyhaique": False},
                        "hypothesis_es": "La matriz eléctrica regional evoluciona gradualmente hacia renovables mientras los sistemas aislados mantienen una fracción diésel."
                    }
                ]
            },

            # =================================================================
            # #11 SISTEMA ABIERTO (dual_chart)
            # =================================================================
            {
                "property_id": 11,
                "property_num": "11",
                "prop_id": "prop_11",
                "name_es": "Sistema abierto",
                "name_en": "Open system",
                "mode": "dual_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Sistema que mantiene intercambios continuos de energía, materiales, personas, capital e información con su entorno externo a través de fronteras permeables.",
                "aysen_explanation": "Aysén opera como un sistema territorial abierto altamente expuesto a flujos externos: temporalmente (Gráfico A, 2015–2026), el precio regional del diésel (CNE) y la llegada anual de pasajeros por el aeródromo Balmaceda (JAC) transmiten shocks internacionales de energía y movilidad; espacialmente (Gráfico B, comunal), el costo de los combustibles en localidades aisladas se cruza con el ratio de presión turística (visitantes SNASPE por habitante).",
                "official_source": "CNE (Bencina en Línea), Junta de Aeronáutica Civil (JAC) y CONAF / INE",
                "return_url": "sistemas_complejos.html?prop=11",
                "reflection_card": {
                    "header": "#11 Sistema abierto",
                    "definition": "Todo sistema territorial intercambia energía, combustibles, personas y capital con el exterior, por lo que sus dinámicas internas están acopladas a precios y flujos extrarregionales.",
                    "aysen_case": "La condición insular y austral de Aysén amplifica su apertura: las alzas internacionales del petróleo se trasladan al precio regional del diésel y encarecen el suministro en comunas con sistemas aislados (Guaitecas, Lago Verde, O'Higgins, Tortel), al tiempo que el flujo de pasajeros por Balmaceda impulsa una presión turística que en Tortel y O'Higgins supera los 20 visitantes por residente.",
                    "official_source": "CNE, Junta de Aeronáutica Civil (JAC) y CONAF / SERNATUR",
                    "return_url": "sistemas_complejos.html?prop=11",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_11_chart_a",
                        "label": "Gráfico A · Flujos Externos (2015–2026): Precio Regional Diésel CNE y Pasajeros Balmaceda JAC",
                        "title": "Apertura Externa (2015–2026): Precio Diésel CNE ($/L) vs. Pasajeros Balmaceda JAC",
                        "chart_type": "line",
                        "dimension": "tiempo",
                        "dataset_source": "temporal_2015_2026",
                        "x_axis": "anio",
                        "y_axis": "precio_diesel_regional_cne_clp_hist",
                        "secondary_axis": "trafico_aereo_pasajeros_balmaceda_jac",
                        "series_keys": [
                            "precio_diesel_regional_cne_clp_hist",
                            "trafico_aereo_pasajeros_balmaceda_jac"
                        ],
                        "x_label": "Año (Serie Histórica 2015–2026)",
                        "y_label": "Precio Diésel Regional ($/L) / Pasajeros Balmaceda (pasajeros/año)",
                        "source": "CNE (Bencina en Línea) y Junta de Aeronáutica Civil (JAC)",
                        "suggested_switches": {"excludeOutlierCoyhaique": False}
                    },
                    {
                        "preset_id": "prop_11_chart_b",
                        "label": "Gráfico B · Exposición Comunal: Costo de Combustible vs. Presión Turística por Habitante",
                        "title": "Exposición Comunal: Precio Combustible ($/L) vs. Ratio de Presión Turística (visit./hab)",
                        "chart_type": "bar",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "nombre",
                        "y_axis": "gasolina_93_clp",
                        "secondary_axis": "ratio_presion_turistica",
                        "series_keys": ["gasolina_93_clp", "costo_diesel_aislado_clp", "ratio_presion_turistica"],
                        "x_label": "Comunas de Aysén (10)",
                        "y_label": "Precio Combustible ($/L) / Ratio Presión Turística (visit./hab)",
                        "source": "CNE (Bencina en Línea / Sistemas Aislados) y CONAF / INE",
                        "suggested_switches": {"excludeOutlierCoyhaique": False}
                    }
                ]
            },

            # =================================================================
            # #12 IMPREDECIBILIDAD (epistemological_limit - sin gráfico)
            # =================================================================
            {
                "property_id": 12,
                "property_num": "12",
                "prop_id": "prop_12",
                "name_es": "Impredecibilidad",
                "name_en": "Unpredictability",
                "mode": "epistemological_limit",
                "hasEmpiricalChart": False,
                "definition_es": "Imposibilidad estructural de pronosticar con exactitud el estado futuro de un sistema complejo debido a la interacción de múltiples mecanismos, retroalimentaciones y perturbaciones externas.",
                "aysen_explanation": "Límite epistemológico del pronóstico lineal: en un sistema abierto como Aysén, proyectar regresiones históricas hacia el futuro mediante una recta determinista induce a error analítico. Eventos singulares no anticipados por las series pasadas —como erupciones volcánicas tipo Hudson (1991), floraciones algales nocivas extremas (2016), vaciados glaciares súbitos (GLOF en Cachet II) o shocks regulatorios y sanitarios externos— reconfiguran abruptamente las trayectorias regionales.",
                "official_source": "SERNAGEOMIN, IFOP, DGA y Banco de Preguntas Metacognitivas",
                "return_url": "sistemas_complejos.html?prop=12",
                "reflection_card": {
                    "header": "#12 Impredecibilidad",
                    "definition": "En sistemas complejos abiertos, el acoplamiento de múltiples variables y la sensibilidad a perturbaciones hacen imposible predecir con exactitud estados futuros a largo plazo.",
                    "aysen_case": "Por qué no se incluye un gráfico de tendencia lineal futura: extrapolar una regresión histórica sobre el PIB, la cosecha de salmón o el flujo turístico de Aysén oculta la exposición del territorio a perturbaciones discretas no predecibles (erupciones del volcán Hudson o Maca, floraciones de Alexandrium catenella en fiordos, cortes de la Ruta 7 por remociones en masa o cambios arancelarios en mercados de destino). En lugar de extrapolar rectas, utilice el panel lateral de Preguntas Metacognitivas para contrastar escenarios estructurales.",
                    "official_source": "SERNAGEOMIN (Red Volcánica), IFOP, SENAPRED y Módulo Metacognitivo",
                    "return_url": "sistemas_complejos.html?prop=12",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "methodological_note": {
                    "reason": "Proyectar regresiones pasadas hacia el futuro mediante una línea de tendencia determinista induce a error analítico en sistemas expuestos a perturbaciones no previstas.",
                    "suggested_action": "Explorar el módulo de Preguntas Metacognitivas en el panel derecho para evaluar escenarios alternativos ante shocks volcánicos, sanitarios o regulatorios.",
                    "recommended_module": "panelMetacognicion"
                },
                "presets": []
            },

            # =================================================================
            # #13 FACTORES DESCONOCIDOS (epistemological_limit - sin gráfico)
            # =================================================================
            {
                "property_id": 13,
                "property_num": "13",
                "prop_id": "prop_13",
                "name_es": "Factores desconocidos",
                "name_en": "Unknowns",
                "mode": "epistemological_limit",
                "hasEmpiricalChart": False,
                "definition_es": "Existencia inevitable de factores, dinámicas o actores no observados que influyen en el sistema y producen efectos indirectos inesperados ante una intervención.",
                "aysen_explanation": "Diagnóstico de brechas de información estatal: las 28 bases de datos oficiales integradas en esta plataforma miden lo que el Estado registra formalmente, pero dejan fuera variables determinantes para el funcionamiento real de Aysén. Entre estos factores no observados destacan el volumen y contenido real de humedad del comercio informal de leña, las redes vecinales y familiares de cuidado no remunerado en comunas aisladas, y la presión ecológica subsuperficial en fiordos y canales carentes de boyas oceanográficas continuas.",
                "official_source": "Diagnóstico de Brechas sobre las 28 Bases Oficiales (SINIM, CNE, SII, MINSAL, MMA, IFOP)",
                "return_url": "sistemas_complejos.html?prop=13",
                "reflection_card": {
                    "header": "#13 Factores desconocidos",
                    "definition": "Debido a la estructura causal abierta de un sistema complejo, siempre existen variables latentes o actores fuera del radar estadístico que condicionan el resultado de las políticas.",
                    "aysen_case": "Lo que las 28 bases oficiales del Estado no capturan en Aysén (y por qué graficar solo lo medido sesga el diagnóstico): (1) Mercado informal de leña húmeda: las estaciones SINCA miden el MP2,5 resultante, pero no existe trazabilidad completa del circuito informal de extracción y secado; (2) Redes comunitarias de cuidado: en Guaitecas, Tortel, O'Higgins y Lago Verde, la resiliencia sanitaria depende de redes vecinales no registradas en DEIS; (3) Fiordos sin instrumentación: vastos sectores marítimos carecen de boyas continuas de oxígeno disuelto y salinidad.",
                    "official_source": "Catálogo de Procedencia Institucional y Auditoría de Brechas de Información",
                    "return_url": "sistemas_complejos.html?prop=13",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "methodological_note": {
                    "reason": "Los factores desconocidos constituyen puntos ciegos fuera del alcance de los registros administrativos estatales; representarlos como una serie empírica cerrada contradice su naturaleza epistémica.",
                    "suggested_action": "Utilizar las tarjetas de reflexión y preguntas metacognitivas para identificar qué variables omitidas por las estadísticas oficiales pueden desviar una intervención territorial.",
                    "recommended_module": "panelMetacognicion"
                },
                "presets": []
            },

            # =================================================================
            # #14 CONTROL DISTRIBUIDO (single_chart)
            # =================================================================
            {
                "property_id": 14,
                "property_num": "14",
                "prop_id": "prop_14",
                "name_es": "Control distribuido",
                "name_en": "Distributed control",
                "mode": "single_chart",
                "hasEmpiricalChart": True,
                "definition_es": "La capacidad de decisión y acción sobre el sistema se reparte entre múltiples actores autónomos con información y atribuciones locales, sin que exista un controlador central absoluto.",
                "aysen_explanation": "Al comparar por comuna el presupuesto municipal vigente (SINIM), la cartera de inversión pública regional FNDR (GORE Aysén) y la inversión privada aprobada en el SEIA, se observa que el desarrollo territorial de las 10 comunas no responde a un mando único, sino a decisiones distribuidas entre alcaldías, gobierno regional, agencias sectoriales y titulares privados.",
                "official_source": "SUBDERE (SINIM), Gobierno Regional de Aysén (FNDR) y SEA (SEIA)",
                "return_url": "sistemas_complejos.html?prop=14",
                "reflection_card": {
                    "header": "#14 Control distribuido",
                    "definition": "En los sistemas complejos ningún actor detenta el control total; los resultados emergen de la concurrencia de decisiones locales, sectoriales y privadas.",
                    "aysen_case": "En cada una de las 10 comunas de Aysén convergen al menos tres esferas de decisión con lógicas distintas: la administración alcaldicia (presupuesto municipal SINIM), la asignación de inversión regional (FNDR GORE) y las decisiones de inversión privada evaluadas en el SEIA (que superan los US$ 1.320 millones en Aysén y US$ 525 millones en Cisnes). Guiar el territorio exige coordinación interinstitucional en lugar de mandatos verticales.",
                    "official_source": "SUBDERE (SINIM), DIPRES / GORE Aysén (FNDR) y SEA (SEIA)",
                    "return_url": "sistemas_complejos.html?prop=14",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_14_chart_a",
                        "label": "Comparativa Comunal Agrupada: Presupuesto Municipal, Inversión FNDR e Inversión SEIA",
                        "title": "Control Distribuido por Comuna: Presupuesto Municipal y FNDR (M$ CLP) vs. Inversión SEIA (MM US$)",
                        "chart_type": "bar",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "nombre",
                        "y_axis": "presupuesto_mclp",
                        "secondary_axis": "inversion_seia_mmusd",
                        "series_keys": ["presupuesto_mclp", "fndr_mclp", "inversion_seia_mmusd"],
                        "x_label": "Comunas de Aysén (10)",
                        "y_label": "Presupuesto Municipal y FNDR (M$ CLP) / Inversión SEIA (MM US$)",
                        "source": "SUBDERE (SINIM), GORE Aysén (FNDR) y SEA (SEIA)",
                        "suggested_switches": {"excludeOutlierCoyhaique": False},
                        "hypothesis_es": "La inversión y gestión territorial están repartidas asimétricamente entre municipios, gobierno regional y titulares privados."
                    }
                ]
            },

            # =================================================================
            # #15 SISTEMAS ANIDADOS (dual_chart)
            # =================================================================
            {
                "property_id": 15,
                "property_num": "15",
                "prop_id": "prop_15",
                "name_es": "Sistemas anidados",
                "name_en": "Nested systems",
                "mode": "dual_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Jerarquías de sistemas complejos donde subsistemas locales operan dentro de sistemas regionales y nacionales mayores ('sistemas de sistemas').",
                "aysen_explanation": "La estructura económica de Aysén opera como una jerarquía anidada: a escala macro-regional (Gráfico A, 2015–2026), el Producto Interno Bruto Regional (Banco Central) se acopla con los flujos anuales de inversión aprobada en el SEIA; a escala subregional y comunal (Gráfico B), esa misma economía se desagrega en dos subsistemas especializados: la biomasa acuícola de salmón en las comunas del litoral (Aysén, Cisnes, Guaitecas) y la concentración de empresas de servicios y comercio SII en la capital regional Coyhaique.",
                "official_source": "Banco Central de Chile, SEA (SEIA), SERNAPESCA y Servicio de Impuestos Internos (SII)",
                "return_url": "sistemas_complejos.html?prop=15",
                "reflection_card": {
                    "header": "#15 Sistemas anidados",
                    "definition": "Los sistemas complejos se organizan como sistemas dentro de sistemas, donde cada nivel posee dinámicas propias que condicionan y son condicionadas por los niveles superior e inferior.",
                    "aysen_case": "El desempeño macroeconómico agregado de Aysén (PIB regional y flujo anual SEIA, Gráfico A) contiene en su interior subsistemas comunales funcionalmente diferenciados (Gráfico B): mientras Puerto Aysén, Cisnes y Guaitecas sostienen la producción física de biomasa salmonera en el maritorio, Coyhaique anida más del 58% de las empresas formales SII que proveen servicios administrativos, logísticos y comerciales.",
                    "official_source": "Banco Central de Chile, SEA (SEIA), SERNAPESCA y SII",
                    "return_url": "sistemas_complejos.html?prop=15",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_15_chart_a",
                        "label": "Gráfico A · Escala Macro-Regional (2015–2026): PIB Regional e Inversión Aprobada SEIA",
                        "title": "Nivel Macro-Regional (2015–2026): PIB Regional (MM$ CLP) vs. Inversión SEIA (MM US$)",
                        "chart_type": "line",
                        "dimension": "tiempo",
                        "dataset_source": "temporal_2015_2026",
                        "x_axis": "anio",
                        "y_axis": "pib_regional_nominal_mmclp",
                        "secondary_axis": "flujo_anual_inversion_seia_aprobada_mmusd",
                        "series_keys": [
                            "pib_regional_nominal_mmclp",
                            "flujo_anual_inversion_seia_aprobada_mmusd"
                        ],
                        "x_label": "Año (Serie Histórica 2015–2026)",
                        "y_label": "PIB Regional (MM$ CLP) / Flujo Inversión SEIA (MM US$)",
                        "source": "Banco Central de Chile y Servicio de Evaluación Ambiental (SEA)",
                        "suggested_switches": {"excludeOutlierCoyhaique": False}
                    },
                    {
                        "preset_id": "prop_15_chart_b",
                        "label": "Gráfico B · Subsistemas Comunales Anidados: Biomasa de Salmón Litoral vs. Empresas SII",
                        "title": "Nivel Comunal Anidado: Biomasa Salmón (Ton) en Litoral vs. Empresas Activas SII (n°)",
                        "chart_type": "bar",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "nombre",
                        "y_axis": "biomasa_salmon_ton",
                        "secondary_axis": "empresas_sii",
                        "series_keys": ["biomasa_salmon_ton", "empresas_sii"],
                        "x_label": "Comunas de Aysén (10)",
                        "y_label": "Biomasa Cosechada Salmón (Ton) / Empresas Activas SII (n°)",
                        "source": "SERNAPESCA y Servicio de Impuestos Internos (SII)",
                        "suggested_switches": {"excludeOutlierCoyhaique": False}
                    }
                ]
            },

            # =================================================================
            # #16 MÚLTIPLES ESCALAS Y NIVELES (dual_chart)
            # =================================================================
            {
                "property_id": 16,
                "property_num": "16",
                "prop_id": "prop_16",
                "name_es": "Múltiples escalas y niveles",
                "name_en": "Multiple scales and levels",
                "mode": "dual_chart",
                "hasEmpiricalChart": True,
                "definition_es": "Los procesos en sistemas complejos operan a través de distintas escalas espaciales y niveles demográficos, requiriendo observar el sistema desde múltiples perspectivas simultáneas.",
                "aysen_explanation": "En Aysén, la fuerte primacía urbana de Coyhaique (57,4% de la población regional y 5.535 empresas SII) distorsiona las correlaciones cuando se observa únicamente la escala regional agregada (Gráfico A, N=10 comunas Con Coyhaique). Al cambiar la lente analítica y excluir el nodo capital (Gráfico B, N=9 comunas Sin Coyhaique con excludeOutlierCoyhaique: true), emerge la verdadera estructura demográfica y empresarial de las 9 comunas litorales, rurales y australes.",
                "official_source": "INE (Censo de Población y Vivienda 2024) y Servicio de Impuestos Internos (SII)",
                "return_url": "sistemas_complejos.html?prop=16",
                "reflection_card": {
                    "header": "#16 Múltiples escalas y niveles",
                    "definition": "Un mismo fenómeno territorial exhibe patrones distintos según la escala de observación; analizar un único nivel oculta las dinámicas de los niveles subyacentes.",
                    "aysen_case": "Al graficar Población Censo 2024 vs. Empresas SII en las 10 comunas (Gráfico A, Con Coyhaique), el peso de la capital regional comprime visualmente a las otras 9 comunas cerca del origen y fuerza una correlación aparente cercana a 1. Al activar el filtro Sin Coyhaique (Gráfico B, N=9 comunas), se hace visible la diferenciación real entre cabeceras intermedias (Puerto Aysén, Chile Chico, Cisnes, Cochrane) y localidades insulares o fronterizas.",
                    "official_source": "INE (Censo 2024) y Servicio de Impuestos Internos (SII)",
                    "return_url": "sistemas_complejos.html?prop=16",
                    "return_label": "← Volver a esta propiedad en Visualizador de Complejidad"
                },
                "presets": [
                    {
                        "preset_id": "prop_16_chart_a",
                        "label": "Gráfico A · Escala Regional Completa (N=10 Comunas Con Coyhaique): Población vs. Empresas SII",
                        "title": "Escala N=10 (Con Coyhaique): Población Censo 2024 (hab) vs. Empresas SII (n°)",
                        "chart_type": "scatter",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "poblacion_censo_2024",
                        "y_axis": "empresas_sii",
                        "series_keys": ["poblacion_censo_2024", "empresas_sii"],
                        "x_label": "Población Comunal Censo 2024 (habitantes)",
                        "y_label": "Empresas Activas SII (n° de empresas)",
                        "source": "INE (Censo 2024) y Servicio de Impuestos Internos (SII)",
                        "excludeCoyhaique": False,
                        "excludeOutlierCoyhaique": False,
                        "suggested_switches": {
                            "excludeCoyhaique": False,
                            "excludeOutlierCoyhaique": False
                        }
                    },
                    {
                        "preset_id": "prop_16_chart_b",
                        "label": "Gráfico B · Escala Subregional (N=9 Comunas Sin Coyhaique): Población vs. Empresas SII",
                        "title": "Escala N=9 (Sin Coyhaique): Población Censo 2024 (hab) vs. Empresas SII (n°)",
                        "chart_type": "scatter",
                        "dimension": "comunal",
                        "dataset_source": "comunas",
                        "x_axis": "poblacion_censo_2024",
                        "y_axis": "empresas_sii",
                        "series_keys": ["poblacion_censo_2024", "empresas_sii"],
                        "x_label": "Población Comunal Censo 2024 — Sin Coyhaique (habitantes)",
                        "y_label": "Empresas Activas SII — Sin Coyhaique (n° de empresas)",
                        "source": "INE (Censo 2024) y Servicio de Impuestos Internos (SII)",
                        "excludeCoyhaique": True,
                        "excludeOutlierCoyhaique": True,
                        "suggested_switches": {
                            "excludeCoyhaique": True,
                            "excludeOutlierCoyhaique": True
                        }
                    }
                ]
            }
        ]
    }

    for prop in presets_data["properties"]:
        refl = prop.get("reflection_card") or {}
        if "aysen_case_es" not in prop:
            prop["aysen_case_es"] = refl.get("aysen_case") or prop.get("aysen_explanation") or ""
        if "description" not in prop:
            prop["description"] = prop.get("definition_es") or ""
        for pr in prop.get("presets", []):
            pr["titulo"] = pr.get("titulo") or pr.get("title") or pr.get("label") or ""
            pr["chartType"] = pr.get("chartType") or pr.get("chart_type") or "bar"
            dim = pr.get("dimension") or "comunal"
            if dim == "tiempo" or pr["chartType"] == "line":
                pr["type"] = "temporal"
                pr["seriePrimaria"] = pr.get("seriePrimaria") or pr.get("y_axis")
                pr["serieSecundaria"] = pr.get("serieSecundaria") or pr.get("secondary_axis")
                pr["varX"] = pr.get("varX") or pr["seriePrimaria"]
                pr["varY"] = pr.get("varY") or pr["serieSecundaria"]
            elif pr["chartType"] == "scatter":
                pr["type"] = "bivariate"
                pr["varX"] = pr.get("varX") or pr.get("x_axis")
                pr["varY"] = pr.get("varY") or pr.get("y_axis")
            else:
                pr["type"] = "bivariate"
                pr["varX"] = pr.get("varX") or pr.get("y_axis")
                pr["varY"] = pr.get("varY") or pr.get("secondary_axis")
            sw = pr.get("suggested_switches") or {}
            excl = bool(
                pr.get("excludeOutlierCoyhaique", False)
                or pr.get("excludeCoyhaique", False)
                or sw.get("excludeOutlierCoyhaique", False)
                or sw.get("excludeCoyhaique", False)
            )
            pr["excludeOutlierCoyhaique"] = excl
            pr["excludeCoyhaique"] = excl
            pr["what_it_shows"] = pr.get("what_it_shows") or pr.get("hypothesis_es") or prop["aysen_case_es"]
        prop["widgets"] = prop.get("presets", [])

    target_file = ROOT / "data" / "cecan_16_presets_aysen.json"
    baro_file = ROOT / "data" / "raw" / "barometro_uaysen" / "barometro_integrado_aysen.json"
    barometro_data = {}
    if baro_file.exists():
        with open(baro_file, "r", encoding="utf-8") as f:
            barometro_data = json.load(f)

    try:
        from scripts.build_hubs_gallery_and_edges import (
            build_hubs_gallery,
            build_extension_gallery,
            build_edges_inter_hub,
        )
        presets_data["total_hubs"] = 8
        presets_data["total_hub_presets"] = 40
        presets_data["hubs_gallery"] = build_hubs_gallery(barometro_data)
        presets_data["extension_gallery"] = build_extension_gallery(barometro_data)
        presets_data["edges_inter_hub"] = build_edges_inter_hub(barometro_data)
        print("Galería de 40 visualizaciones, 10 presets de extensión e inter-hub edges inyectadas en catálogo de 16 propiedades.")
    except Exception as e:
        print(f"Aviso: no se pudo inyectar galería de 40 presets: {e}")

    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(presets_data, f, indent=2, ensure_ascii=False)
    print(f"Archivo guardado exitosamente: {target_file}")
    return presets_data


def update_cruces_multivariables():
    cruces_file = ROOT / "data" / "cruces_multivariables.json"
    with open(cruces_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "cruces" in data:
        criosfera = data["cruces"].get("criosfera_riesgo", {})
        if "datos" in criosfera:
            for row in criosfera["datos"]:
                if "caudal_m3s" in row and "caudal_baker_m3s" not in row:
                    row["caudal_baker_m3s"] = row["caudal_m3s"]
                if "nivel_limnigrafo_m" in row and "nivel_colonia_m" not in row:
                    row["nivel_colonia_m"] = row["nivel_limnigrafo_m"]

        clima = data["cruces"].get("clima_salud", {})
        clima["propiedades_vinculos"] = [
            {
                "property_id": 1,
                "property_num": "01",
                "preset_id": "prop_01_chart_a",
                "tipo": "Retroalimentación Positiva (+): Frío, Quema de Leña y Saturación MP2,5",
                "variables": ["dias_sobre_norma_mp25", "urgencias_respiratorias_pct", "hogares_lena_pct"]
            }
        ]

        criosfera["propiedades_vinculos"] = [
            {
                "property_id": 9,
                "property_num": "09",
                "preset_id": "prop_09_chart_a",
                "tipo": "Punto de Inflexión Hidrológico: Vaciado Súbito GLOF en Lago Cachet II",
                "variables": ["caudal_baker_m3s", "nivel_colonia_m", "precipitacion_tortel_mm"]
            }
        ]

        marino = data["cruces"].get("marino_productivo", {})
        marino["propiedades_vinculos"] = [
            {
                "property_id": 15,
                "property_num": "15",
                "preset_id": "prop_15_chart_b",
                "tipo": "Sistemas Anidados: Biomasa Acuícola en Comunas Litorales vs. Tejido Empresarial",
                "variables": ["biomasa_cosecha_kton", "infa_aerobica_pct", "alexandrium_cel_l"]
            }
        ]

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
    build_complexity_presets()
    update_cruces_multivariables()
