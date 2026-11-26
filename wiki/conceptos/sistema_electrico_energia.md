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

Aunque Aysén posee abundante recurso hídrico, no está conectada al SEN: opera mediante Sistemas Medianos y Sistemas Aislados <= 1,50 MW que totalizan 67,10 MW operativos (33,95 MW en Coyhaique y 18,48 MW en Aysén, más 18,98 MW ERNC en construcción 2026), con tarifa BT1 vigente nov-2026 (Decreto N° 8T/2026) de $287,8/kWh en Coyhaique/Aysén y hasta $318,0/kWh en Tortel. En $/kWh térmico útil, calefaccionar con bomba de calor (COP 2,8) cuesta ~$102,8/kWh_útil y con kerosene $174,7/kWh_útil tras el shock FEPP de octubre 2026, frente a $45,7/kWh_útil de leña ($48.000/m³ en Coyhaique), explicando que 334.274 m³ sólidos/año sigan sosteniendo la calefacción regional (Coyhaique 147.080 m³s [44,0%], 68,8% hogares a 9,81 m³s/hogar tras 10.999 recambios PDA) y 87 días sobre norma MP2.5.

## Indicadores Comunales Verificados

| Comuna | Capacidad Eléctrica Instalada en el Subsistema (MW) | Tarifa Eléctrica Residencial BT1 ($/kWh) | Matriz de Calefacción a Leña (% hogares) | Consumo Residencial de Leña (m³/hogar/año) | Días Anuales sobre Norma Diaria MP2.5 (SINCA) |
| --- | --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 33,95 | 287,8 | 68,8 | 9,81 | 87 |
| [[comunas/lago_verde|Lago Verde]] | 0,35 | 294 | 98,1 | 15,1 | 12 |
| [[comunas/aysen|Aysén]] | 18,48 | 287,8 | 84,5 | 13,2 | 34 |
| [[comunas/cisnes|Cisnes]] | 2,83 | 292,4 | 94 | 13,95 | 16 |
| [[comunas/guaitecas|Guaitecas]] | 1,45 | 312 | 94,2 | 13,1 | 4 |
| [[comunas/chile_chico|Chile Chico]] | 3,9 | 289,5 | 82 | 11,95 | 18 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 1,4 | 289,5 | 94,2 | 14,05 | 14 |
| [[comunas/cochrane|Cochrane]] | 2,54 | 291,2 | 95,5 | 14,35 | 22 |
| [[comunas/ohiggins|O'Higgins]] | 1,25 | 308 | 98,8 | 15,5 | 8 |
| [[comunas/tortel|Tortel]] | 0,95 | 318 | 98,5 | 15,2 | 10 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hub Principal**: [[hubs/hub_03_energia|Hub III]]
- **Comunas Protagonistas**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]] · [[comunas/chile_chico|Chile Chico]] · [[comunas/ohiggins|O'Higgins]] · [[comunas/guaitecas|Guaitecas]]
- **Nodos Satélite Asociados**: [[nodos/nodo_11|Nodo #11]] · [[nodos/nodo_12|Nodo #12]] · [[nodos/nodo_13|Nodo #13]] · [[nodos/nodo_30|Nodo #30]]
- **Decisiones de Arquitectura y Datos (ADR)**: [[adr/adr_004_normalizacion_per_capita_y_colinealidad|ADR-004]] · [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]]
