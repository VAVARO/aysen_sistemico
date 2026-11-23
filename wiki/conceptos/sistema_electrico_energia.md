---
id: sistema_electrico_energia
title: "Matriz Energética Dual de Aysén: Sistemas Medianos Aislados y Matriz Térmica a Leña"
type: concepto
hub_id: energia
hub_roman: III
variables_clave:
  - potencia_mw
  - tarifa_bt1_clp
  - hogares_lena_pct
  - consumo_lena_m3_hogar_ano
  - dias_sobre_norma_mp25
  - saidi_horas_anual
fuentes_oficiales:
  - "CNE — Capacidad Instalada y Generación Eléctrica en Sistemas Medianos"
  - "SEC — Tarifas Residenciales BT1 e Índice de Interrupción SAIDI"
  - "MMA SINCA — Red de Monitoreo de Material Particulado Fino MP2.5"
  - "INFOR — Consumo Residencial de Leña y Dendroenergía en Patagonia"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - concepto
  - hub-iii
---

# Matriz Energética Dual de Aysén: Sistemas Medianos Aislados y Matriz Térmica a Leña

## Síntesis Compilada (Consultor IA)

Aunque Aysén posee abundante recurso hídrico, la región no está interconectada al Sistema Eléctrico Nacional (SEN): opera mediante Sistemas Eléctricos Medianos aislados y microrredes con 98,6 MW instalados (42,5 MW en Aysén y 26,8 MW en Coyhaique), lo que eleva la tarifa eléctrica residencial BT1 a $224/kWh en Coyhaique ($242,3/kWh promedio regional). Ese costo eléctrico frente a la leña ($48.000/m³ en Coyhaique) explica la paradoja hidro-térmica: el 92,4% de los hogares coyhaiquinos usa leña para calefacción (14,5 m³/hogar/año; 82,3% en Chile Chico a 99,1% en O'Higgins), generando 87 días anuales sobre la norma diaria de MP2.5 (41 episodios críticos GEC).

## Indicadores Comunales Verificados

| Comuna | Capacidad Eléctrica Instalada en el Subsistema (MW) | Tarifa Eléctrica Residencial BT1 ($/kWh) | Matriz de Calefacción a Leña (% hogares) | Consumo Residencial de Leña (m³/hogar/año) | Días Anuales sobre Norma Diaria MP2.5 (SINCA) |
| --- | --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 26,8 | 224 | 92,4 | 14,5 | 87 |
| [[comunas/lago_verde|Lago Verde]] | 1,4 | 258 | 98,2 | 21 | 12 |
| [[comunas/aysen|Aysén]] | 42,5 | 222 | 87,8 | 15 | 34 |
| [[comunas/cisnes|Cisnes]] | 6,8 | 235 | 95,1 | 18,5 | 16 |
| [[comunas/guaitecas|Guaitecas]] | 2,8 | 265 | 94,6 | 19 | 4 |
| [[comunas/chile_chico|Chile Chico]] | 7,5 | 228 | 82,3 | 16,5 | 18 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 2,4 | 231 | 94,2 | 19,5 | 14 |
| [[comunas/cochrane|Cochrane]] | 5,8 | 230 | 96 | 18 | 22 |
| [[comunas/ohiggins|O'Higgins]] | 1,4 | 262 | 99,1 | 22 | 8 |
| [[comunas/tortel|Tortel]] | 1,2 | 268 | 98,4 | 21,5 | 10 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hub Principal**: [[hubs/hub_03_energia|Hub III]]
- **Comunas Protagonistas**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]] · [[comunas/chile_chico|Chile Chico]] · [[comunas/ohiggins|O'Higgins]] · [[comunas/guaitecas|Guaitecas]]
- **Nodos Satélite Asociados**: [[nodos/nodo_11|Nodo #11]] · [[nodos/nodo_12|Nodo #12]] · [[nodos/nodo_13|Nodo #13]] · [[nodos/nodo_30|Nodo #30]]
- **Decisiones de Arquitectura y Datos (ADR)**: [[adr/adr_004_normalizacion_per_capita_y_colinealidad|ADR-004]] · [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]]
