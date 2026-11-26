---
id: red_asistencial_salud
title: "Arquitectura de la Red Asistencial del Servicio de Salud Aysén (DEIS - MINSAL)"
type: concepto
hub_id: salud
hub_roman: VIII
variables_clave:
  - camas_hospitalarias
  - postas_salud_rural
  - medicos_por_mil_hab
  - traslado_coyhaique_hrs
  - mediana_espera_quirurgica_dias
  - mediana_espera_especialidad_dias
fuentes_oficiales:
  - "DEIS - MINSAL — Estadísticas de Red Asistencial y Camas Hospitalarias"
  - "Servicio de Salud Aysén (SSA) — Catastro de 27 Postas de Salud Rural y Aeroevacuaciones SAMU"
  - "SIGTE MINSAL — Monitoreo de Tiempos de Espera Quirúrgica y Consultas de Especialidad"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - concepto
  - hub-viii
---

# Arquitectura de la Red Asistencial del Servicio de Salud Aysén (DEIS - MINSAL)

## Síntesis Compilada (Consultor IA)

El Servicio de Salud Aysén articula un hospital base de alta complejidad (Hospital Regional de Coyhaique), hospitales comunitarios de baja complejidad (Puerto Aysén, Puerto Cisnes, Chile Chico y Cochrane) y 27 Postas de Salud Rural (PSR) distribuidas en las 10 comunas. La dispersión geográfica impone tiempos de derivación terrestre o marítima hacia Coyhaique desde 0 a 1,0 hora en Coyhaique y Aysén hasta 8,0 horas en Tortel, 10,0 horas en O'Higgins y 14,0 horas en Guaitecas, complementados por aeroevacuaciones SAMU.

## Indicadores Comunales Verificados

| Comuna | Camas Hospitalarias Red Asistencial | Postas de Salud Rural (PSR) | Médicos por cada 1.000 Habitantes (médicos/1.000 hab) | Tiempo de Derivación Médica en Ambulancia/Barcaza al Hospital Regional Coyhaique (horas) | Mediana de Espera Quirúrgica No GES (días) |
| --- | --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 167 | 7 | 3,12 | 0 | 318 |
| [[comunas/lago_verde|Lago Verde]] | 0 | 3 | 0,82 | 4,5 | 418 |
| [[comunas/aysen|Aysén]] | 52 | 4 | 1,74 | 1 | 354 |
| [[comunas/cisnes|Cisnes]] | 12 | 4 | 1,15 | 3,5 | 412 |
| [[comunas/guaitecas|Guaitecas]] | 0 | 1 | 0,95 | 14 | 468 |
| [[comunas/chile_chico|Chile Chico]] | 14 | 2 | 1,28 | 4 | 364 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 0 | 3 | 0,88 | 1,5 | 424 |
| [[comunas/cochrane|Cochrane]] | 16 | 1 | 1,42 | 6 | 368 |
| [[comunas/ohiggins|O'Higgins]] | 0 | 1 | 0,78 | 10 | 436 |
| [[comunas/tortel|Tortel]] | 0 | 1 | 0,85 | 8 | 388 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hub Principal**: [[hubs/hub_08_salud|Hub VIII]]
- **Comunas Protagonistas**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]] · [[comunas/cisnes|Cisnes]] · [[comunas/chile_chico|Chile Chico]] · [[comunas/cochrane|Cochrane]] · [[comunas/guaitecas|Guaitecas]] · [[comunas/ohiggins|O'Higgins]]
- **Nodos Satélite Asociados**: [[nodos/nodo_24|Nodo #24]] · [[nodos/nodo_38|Nodo #38]] · [[nodos/nodo_39|Nodo #39]]
- **Decisiones de Arquitectura y Datos (ADR)**: [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]] · [[adr/adr_004_normalizacion_per_capita_y_colinealidad|ADR-004]]
