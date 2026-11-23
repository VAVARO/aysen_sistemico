---
id: adr_003_enrutador_hibrido_llm_first_omniroute
title: "ADR-003 — Enrutador Semántico Híbrido LLM-First, Grafo Multi-Entidad y Reparación Conversacional"
type: adr
hub_id: ctci
hub_roman: X
variables_clave:
  - dependencia_fcm_pct
  - ingresos_propios_pct
  - tarifa_bt1_clp
  - consumo_lena_m3_hogar_ano
  - fauna_amenazada_n
fuentes_oficiales:
  - "SUBDERE — SINIM"
  - "CNE / SEC — Estadísticas Eléctricas y Térmicas"
  - "MMA / CONAF — Catastro RCE y SNASPE"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - adr
  - hub-x
---

# ADR-003 — Enrutador Semántico Híbrido LLM-First, Grafo Multi-Entidad y Reparación Conversacional

## Síntesis Compilada (Consultor IA)

El Consultor Territorial (`js/omniroute_client.js`) implementa un enrutador híbrido de dos etapas que combina comprensión semántica LLM-First con precisión numérica determinista. En lugar de depender de coincidencias léxicas rígidas, el motor clasifica el acto conversacional (`classifyConversationAct`), detecta paquetes conceptuales multidimensionales (`CONCEPTUAL_DOMAIN_PACKETS`) y entidades territoriales polisémicas (`TERRITORIAL_ENTITY_GRAPH` como «Huemules», «Volcán Hudson» o «Laguna San Rafael»), distingue entre reparación conversacional pura y reparación guiada con re-especificación de tema, re-hidrata el gráfico Chart.js desde las variables seleccionadas por el LLM (`rehydrateChartFromLLM`) y aplica un sanitizador final (`sanitizeTechnicalKeysInReply`) que impide la filtración de nombres de columnas en `snake_case`.

## Contexto, Decisión e Implicancias de Ingeniería

- **Contexto del Problema**: Un motor puramente determinista falla ante preguntas causales complejas («por qué la luz es tan cara si tenemos tantos ríos») o reclamos coloquiales («no entendiste lo que te pregunté»), mientras que un LLM sin anclaje inventa cifras o expone claves internas de base de datos.
- **Decisión Arquitectónica**: Inyectar en el prompt del LLM paquetes conceptuales compilados desde `wiki/conceptos/*.md` junto con los vectores exactos de las 10 comunas, y re-hidratar siempre los vectores del gráfico desde `window.AYSEN_HUBS_DATA`.
- **Consecuencias y Verificación**: Respuestas conversacionales fluidas, cero alucinaciones numéricas y sincronización inmediata entre texto analítico, gráfico bivariado y tabla comunal.

## Indicadores Comunales Verificados

| Comuna | Dependencia del Fondo Común Municipal (%) | Ingresos Propios Permanentes (%) | Tarifa Eléctrica Residencial BT1 ($/kWh) | Consumo Residencial de Leña (m³/hogar/año) |
| --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 46,5 | 53,5 | 224 | 14,5 |
| [[comunas/lago_verde|Lago Verde]] | 89,2 | 10,8 | 258 | 21 |
| [[comunas/aysen|Aysén]] | 52,8 | 47,2 | 222 | 15 |
| [[comunas/cisnes|Cisnes]] | 74,5 | 25,5 | 235 | 18,5 |
| [[comunas/guaitecas|Guaitecas]] | 83 | 17 | 265 | 19 |
| [[comunas/chile_chico|Chile Chico]] | 71,2 | 28,8 | 228 | 16,5 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 79,6 | 20,4 | 231 | 19,5 |
| [[comunas/cochrane|Cochrane]] | 76,8 | 23,2 | 230 | 18 |
| [[comunas/ohiggins|O'Higgins]] | 91,5 | 8,5 | 262 | 22 |
| [[comunas/tortel|Tortel]] | 92,8 | 7,2 | 268 | 21,5 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hubs Impactados**: [[hubs/hub_03_energia|Hub III]] · [[hubs/hub_04_gobernanza|Hub IV]] · [[hubs/hub_07_biodiversidad|Hub VII]] · [[hubs/hub_10_ctci|Hub X]]
- **Comunas de Referencia**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]] · [[comunas/rio_ibanez|Río Ibáñez]]
- **Conceptos Vinculados**: [[conceptos/financiamiento_municipal|financiamiento_municipal]] · [[conceptos/sistema_electrico_energia|sistema_electrico_energia]] · [[conceptos/huemules_multidimensional|huemules_multidimensional]] · [[conceptos/volcan_hudson_y_campos_de_hielo|volcan_hudson_y_campos_de_hielo]]
