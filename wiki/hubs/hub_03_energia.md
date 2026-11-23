---
id: hub_03_energia
title: "Hub III — Energía, Sistemas Medianos Aislados, Matriz Térmica y Telecomunicaciones"
type: hub
hub_id: energia
hub_roman: III
variables_clave:
  - potencia_mw
  - tarifa_bt1_clp
  - hogares_lena_pct
  - consumo_lena_m3_hogar_ano
  - precio_lena_m3
  - saidi_horas_anual
  - internet_fijo_pct
  - conexiones_fijas_subtel_jun2026_n
fuentes_oficiales:
  - "CNE — Capacidad Instalada y Generación Eléctrica (Energía Abierta)"
  - "SEC — Interrupciones Eléctricas SAIDI y Tarifas BT1"
  - "CNE — Precios Minoristas de Combustibles y Leña"
  - "SUBTEL — Conectividad Digital FTTX/Starlink y Fibra Óptica Austral"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - hub
  - hub-iii
---

# Hub III — Energía, Sistemas Medianos Aislados, Matriz Térmica y Telecomunicaciones

## Síntesis Compilada (Consultor IA)

El Hub III (Energía y Telecomunicaciones) caracteriza la condición de aislamiento energético de Aysén respecto del Sistema Eléctrico Nacional (SEN). La región opera mediante Sistemas Eléctricos Medianos aislados (Aysén-Coyhaique, General Carrera y Palena/Cisnes) y microrredes locales que suman 98,6 MW de capacidad instalada, con una tarifa residencial BT1 promedio de $242,3/kWh ($224/kWh en Coyhaique) y costos reales de generación diésel aislada superiores a $450/kWh en comunas extremas. Esta estructura tarifaria perpetúa la dependencia térmica de la leña (más del 90% de los hogares regionales, con un consumo de 14,5 a 22,0 m³/hogar/año), mientras en telecomunicaciones la Fibra Óptica Austral (FOA) y enlaces satelitales totalizan 26.294 conexiones fijas SUBTEL.

## Indicadores Comunales Verificados

| Comuna | Capacidad Eléctrica Instalada en el Subsistema (MW) | Tarifa Eléctrica Residencial BT1 ($/kWh) | Matriz de Calefacción a Leña (% hogares) | Consumo Residencial de Leña (m³/hogar/año) | Precio Leña Seca ($/m³) |
| --- | --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 26,8 | 224 | 92,4 | 14,5 | 48.000 |
| [[comunas/lago_verde|Lago Verde]] | 1,4 | 258 | 98,2 | 21 | 38.000 |
| [[comunas/aysen|Aysén]] | 42,5 | 222 | 87,8 | 15 | 46.000 |
| [[comunas/cisnes|Cisnes]] | 6,8 | 235 | 95,1 | 18,5 | 42.000 |
| [[comunas/guaitecas|Guaitecas]] | 2,8 | 265 | 94,6 | 19 | 55.000 |
| [[comunas/chile_chico|Chile Chico]] | 7,5 | 228 | 82,3 | 16,5 | 50.000 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 2,4 | 231 | 94,2 | 19,5 | 44.000 |
| [[comunas/cochrane|Cochrane]] | 5,8 | 230 | 96 | 18 | 42.000 |
| [[comunas/ohiggins|O'Higgins]] | 1,4 | 262 | 99,1 | 22 | 36.000 |
| [[comunas/tortel|Tortel]] | 1,2 | 268 | 98,4 | 21,5 | 40.000 |

## Nodos Satélite del Hub

- [[nodos/nodo_11|Nodo #11: Generación y Centrales Eléctricas]]
- [[nodos/nodo_12|Nodo #12: Sistemas Eléctricos Medianos y Aislados]]
- [[nodos/nodo_13|Nodo #13: Precios de Combustibles y Leña por Comuna (CNE)]]
- [[nodos/nodo_14|Nodo #14: Fibra Óptica Austral (FOA) y Telecomunicaciones]]

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Comunas de Aysén (10)**: [[comunas/coyhaique|Coyhaique]] · [[comunas/lago_verde|Lago Verde]] · [[comunas/aysen|Aysén]] · [[comunas/cisnes|Cisnes]] · [[comunas/guaitecas|Guaitecas]] · [[comunas/chile_chico|Chile Chico]] · [[comunas/rio_ibanez|Río Ibáñez]] · [[comunas/cochrane|Cochrane]] · [[comunas/ohiggins|O'Higgins]] · [[comunas/tortel|Tortel]]
- **Paquetes Conceptuales y Entidades Territoriales**:
- [[conceptos/sistema_electrico_energia|sistema_electrico_energia]]
- [[conceptos/inversion_publica_regional|inversion_publica_regional]]
- **Registros de Decisión de Arquitectura y Datos (ADR)**:
- [[adr/adr_004_normalizacion_per_capita_y_colinealidad|ADR_004_NORMALIZACION_PER_CAPITA_Y_COLINEALIDAD]]
- [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR_002_RECONCILIACION_38_FUENTES_INVARIANTES]]
