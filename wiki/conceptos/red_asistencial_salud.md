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
  - "DEIS - MINSAL (03-11-2026) — Estadísticas de Red Asistencial y 213 Camas de Diseño"
  - "Servicio de Salud Aysén (DAP SSA) — 4 CESFAM, 4 CECOSF, 27 PSR, 9 EMR, 2 COSAM y 454+45 Aeroevacuaciones SAMU"
  - "SIGTE Glosa 06 MINSAL / CIPS-UDD T3 2026 — 14.751 CNE (159d), 3.608 IQ (262d), 6.870 Odonto (242d), 524 GES (88d)"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - concepto
  - hub-viii
---

# Arquitectura de la Red Asistencial del Servicio de Salud Aysén (DEIS - MINSAL)

## Síntesis Compilada (Consultor IA)

El Servicio de Salud Aysén (DAP SSA · 0% salud municipalizada; 0 clínicas privadas de hospitalización general) articula 5 hospitales con 213 camas de diseño (174 agudas efectivas y 8 pabellones quirúrgicos): Hospital Regional Coyhaique (135 basales, 141 con 6 UPC Pediátrica jun-2026, 4 pabellones, 18 sillones hemodiálisis), Puerto Aysén (56 camas, 2 pabellones; ~30 camas bloqueadas sociosanitarias en la red), Puerto Cisnes Dr. Jorge Ibar Bruce (8 camas), Hospital Dr. Leopoldo Ortega Rodríguez de Chile Chico (7 camas, 1 pabellón, nuevo edificio feb-2026) y Hospital Lord Cochrane (7 camas, 1 pabellón, acreditado SuperSalud 14-05-2026). La APS reúne 4 CESFAM (+1 en construcción), 4 CECOSF, 27 PSR (100% tele-ECG oct-2025), 9 EMR y 2 COSAM, respaldados por el Convenio GORE–MINSAL de $195.000M. En SIGTE T3 2026 registra 14.751 CNE (159d), 3.608 IQ (262d), 6.870 Odonto (242d) y 524 retrasos GES (88d), con 454 aeroevacuaciones SAMU primarias + 45 secundarias (Melinka regulado por SAMU Reloncaví; HRC sin equipo ECMO; auditorías CGR abr y ago 2026).

## Indicadores Comunales Verificados

| Comuna | Camas Hospitalarias Red Asistencial | Postas de Salud Rural (PSR) | Médicos por cada 1.000 Habitantes (médicos/1.000 hab) | Tiempo de Derivación Médica en Ambulancia/Barcaza al Hospital Regional Coyhaique (horas) | Mediana de Espera Quirúrgica No GES (días) |
| --- | --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 135 | 7 | 3,12 | 0 | 218 |
| [[comunas/lago_verde|Lago Verde]] | 0 | 3 | 0,82 | 4,5 | 284 |
| [[comunas/aysen|Aysén]] | 56 | 2 | 1,74 | 1 | 234 |
| [[comunas/cisnes|Cisnes]] | 8 | 4 | 1,15 | 3,5 | 268 |
| [[comunas/guaitecas|Guaitecas]] | 0 | 1 | 0,95 | 14 | 312 |
| [[comunas/chile_chico|Chile Chico]] | 7 | 3 | 1,28 | 4 | 248 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 0 | 5 | 0,88 | 1,5 | 276 |
| [[comunas/cochrane|Cochrane]] | 7 | 0 | 1,42 | 6 | 242 |
| [[comunas/ohiggins|O'Higgins]] | 0 | 1 | 0,78 | 10 | 280 |
| [[comunas/tortel|Tortel]] | 0 | 1 | 0,85 | 8 | 258 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hub Principal**: [[hubs/hub_08_salud|Hub VIII]]
- **Comunas Protagonistas**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]] · [[comunas/cisnes|Cisnes]] · [[comunas/chile_chico|Chile Chico]] · [[comunas/cochrane|Cochrane]] · [[comunas/guaitecas|Guaitecas]] · [[comunas/ohiggins|O'Higgins]]
- **Nodos Satélite Asociados**: [[nodos/nodo_24|Nodo #24]] · [[nodos/nodo_38|Nodo #38]] · [[nodos/nodo_39|Nodo #39]]
- **Decisiones de Arquitectura y Datos (ADR)**: [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]] · [[adr/adr_004_normalizacion_per_capita_y_colinealidad|ADR-004]]
