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

El Hub III (Energía y Telecomunicaciones) caracteriza el aislamiento eléctrico, térmico y digital de Aysén frente al SEN. Opera mediante Sistemas Medianos (SMA, SMGC, Puerto Cisnes/Palena) y Sistemas Aislados <= 1,50 MW (Art. 173° LGSE) que suman 67,10 MW operativos (+18,98 MW ERNC en construcción 2026), bajo Pliego BT1 Edelaysen Decreto N° 8T nov-2026 en $287,8/kWh en Coyhaique/Aysén y 13.448 hogares beneficiarios del Subsidio Eléctrico Ley 21.667. Al 19-nov-2026 (CNE), la gasolina 93 promedia $1.696/L y kerosene $1.497/L (+$282/L FEPP) vía único MBM Copec Chacabuco (6.674 m³ activos), mientras INFOR BES N° 11 certifica 334.274 m³ sólidos/año de leña (Coyhaique 147.080 m³s [44,0%], 68,8% hogares). En telecomunicaciones (SUBTEL jun-2026 / FDT 3T-2026) suma 26.294 conexiones fijas (24.782 residenciales), con único aterrizaje submarino CTR en Caleta Tortel, Cable Austral privado GTD en Puerto Chacabuco, 14 POIITs Silica y despliegues FDT-2025-03 / Tortel-O'Higgins (1S-2028).

## Indicadores Comunales Verificados

| Comuna | Capacidad Eléctrica Instalada en el Subsistema (MW) | Tarifa Eléctrica Residencial BT1 ($/kWh) | Matriz de Calefacción a Leña (% hogares) | Consumo Residencial de Leña (m³/hogar/año) | Precio Leña Seca ($/m³) |
| --- | --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 33,95 | 287,8 | 68,8 | 9,81 | 48.000 |
| [[comunas/lago_verde|Lago Verde]] | 0,35 | 294 | 98,1 | 15,1 | 36.000 |
| [[comunas/aysen|Aysén]] | 18,48 | 287,8 | 84,5 | 13,2 | 46.000 |
| [[comunas/cisnes|Cisnes]] | 2,83 | 292,4 | 94 | 13,95 | 44.000 |
| [[comunas/guaitecas|Guaitecas]] | 1,45 | 312 | 94,2 | 13,1 | 52.000 |
| [[comunas/chile_chico|Chile Chico]] | 3,9 | 289,5 | 82 | 11,95 | 50.000 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 1,4 | 289,5 | 94,2 | 14,05 | 44.000 |
| [[comunas/cochrane|Cochrane]] | 2,54 | 291,2 | 95,5 | 14,35 | 42.000 |
| [[comunas/ohiggins|O'Higgins]] | 1,25 | 308 | 98,8 | 15,5 | 36.000 |
| [[comunas/tortel|Tortel]] | 0,95 | 318 | 98,5 | 15,2 | 40.000 |

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
