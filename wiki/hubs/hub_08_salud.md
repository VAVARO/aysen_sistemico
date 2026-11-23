---
id: hub_08_salud
title: "Hub VIII — Red Asistencial, Atención Primaria Rural, Listas de Espera y SAMU"
type: hub
hub_id: salud
hub_roman: VIII
variables_clave:
  - camas_hospitalarias
  - postas_salud_rural
  - establecimientos_aps_n
  - medicos_por_mil_hab
  - traslado_coyhaique_hrs
  - mediana_espera_quirurgica_dias
  - aeroevacuaciones_samu_n
  - tasa_mortalidad_cancer_gastrico_100k
fuentes_oficiales:
  - "DEIS - MINSAL — Estadísticas Vitales, Egresos y Red Asistencial"
  - "Servicio de Salud Aysén (SSA) — Dotación de Camas, 27 Postas de Salud Rural y SAMU"
  - "SIGTE MINSAL — Listas de Espera No GES Quirúrgica y de Especialidad"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - hub
  - hub-viii
---

# Hub VIII — Red Asistencial, Atención Primaria Rural, Listas de Espera y SAMU

## Síntesis Compilada (Consultor IA)

El Hub VIII (Salud APS y Hospitales) modela la red asistencial del Servicio de Salud Aysén, compuesta por 5 hospitales que suman 261 camas hospitalarias (encabezados por el Hospital Regional de Coyhaique como único centro de alta complejidad y 4 hospitales comunitarios en Puerto Aysén, Puerto Cisnes, Chile Chico y Cochrane) más 27 Postas de Salud Rural (PSR) y estaciones médico-rurales. La fricción espacial determina tiempos de derivación terrestre o multimodal hacia Coyhaique de hasta 10,0 horas desde O'Higgins y 14,0 horas desde Guaitecas, haciendo indispensable la red de aeroevacuaciones médicas SAMU y rondas de especialidad para contener la mediana de espera quirúrgica No GES y la carga de morbimortalidad respiratoria, cardiovascular y oncológica.

## Indicadores Comunales Verificados

| Comuna | Camas Hospitalarias Red Asistencial | Postas de Salud Rural (PSR) | Establecimientos de Atención Primaria (APS) | Médicos por cada 1.000 Habitantes (médicos/1.000 hab) | Tiempo de Derivación Médica en Ambulancia/Barcaza al Hospital Regional Coyhaique (horas) |
| --- | --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 167 | 7 | 13 | 3,12 | 0 |
| [[comunas/lago_verde|Lago Verde]] | 0 | 3 | 5 | 0,82 | 4,5 |
| [[comunas/aysen|Aysén]] | 52 | 4 | 7 | 1,74 | 1 |
| [[comunas/cisnes|Cisnes]] | 12 | 4 | 7 | 1,15 | 3,5 |
| [[comunas/guaitecas|Guaitecas]] | 0 | 1 | 3 | 0,95 | 14 |
| [[comunas/chile_chico|Chile Chico]] | 14 | 2 | 4 | 1,28 | 4 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 0 | 3 | 5 | 0,88 | 1,5 |
| [[comunas/cochrane|Cochrane]] | 16 | 1 | 3 | 1,42 | 6 |
| [[comunas/ohiggins|O'Higgins]] | 0 | 1 | 3 | 0,78 | 10 |
| [[comunas/tortel|Tortel]] | 0 | 1 | 3 | 0,85 | 8 |

## Nodos Satélite del Hub

- [[nodos/nodo_24|Nodo #24: Red Hospitalaria Regional y Camas Críticas (5 Hospitales · 261 Camas)]]
- [[nodos/nodo_38|Nodo #38: Atención Primaria Rural: 27 Postas (PSR), 20 EMR y Rondas Médicas]]
- [[nodos/nodo_39|Nodo #39: Lista de Espera Quirúrgica y Aeroevacuaciones SAMU]]

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Comunas de Aysén (10)**: [[comunas/coyhaique|Coyhaique]] · [[comunas/lago_verde|Lago Verde]] · [[comunas/aysen|Aysén]] · [[comunas/cisnes|Cisnes]] · [[comunas/guaitecas|Guaitecas]] · [[comunas/chile_chico|Chile Chico]] · [[comunas/rio_ibanez|Río Ibáñez]] · [[comunas/cochrane|Cochrane]] · [[comunas/ohiggins|O'Higgins]] · [[comunas/tortel|Tortel]]
- **Paquetes Conceptuales y Entidades Territoriales**:
- [[conceptos/red_asistencial_salud|red_asistencial_salud]]
- [[conceptos/inversion_publica_regional|inversion_publica_regional]]
- **Registros de Decisión de Arquitectura y Datos (ADR)**:
- [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR_002_RECONCILIACION_38_FUENTES_INVARIANTES]]
- [[adr/adr_004_normalizacion_per_capita_y_colinealidad|ADR_004_NORMALIZACION_PER_CAPITA_Y_COLINEALIDAD]]
