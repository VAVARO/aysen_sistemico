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
  - "DEIS - MINSAL (03-11-2026) — Catastro de 5 Hospitales, 4 CESFAM, 4 CECOSF, 27 PSR, 9 EMR y 2 COSAM"
  - "Servicio de Salud Aysén (DAP SSA · 0% Salud Municipal) — Convenio GORE–MINSAL $195.000M y SAMU / SAMU Reloncaví"
  - "SIGTE Glosa 06 MINSAL / CIPS-UDD T3 2026 — 14.751 CNE (159d), 3.608 IQ (262d), 6.870 Odonto (242d), 524 GES (88d)"
  - "DEIS / UNICEF SITAN 2025 / SEREMI Salud — Suicidio 19,9/100k (#1 Chile), Cáncer Gástrico 18,4/100k (64% H. pylori), Vesícula C23 18,29/100k"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - hub
  - hub-viii
---

# Hub VIII — Red Asistencial, Atención Primaria Rural, Listas de Espera y SAMU

## Síntesis Compilada (Consultor IA)

El Hub VIII (Salud APS y Hospitales) modela la red asistencial 100% dependiente del Servicio de Salud Aysén (DAP SSA — 0% salud municipalizada; 0 clínicas privadas de hospitalización general), reforzada por el Convenio de Programación GORE Aysén–MINSAL del 30-07-2025 ($195.000 millones). Sus 5 hospitales públicos suman 213 camas de diseño (174 agudas efectivas y 8 pabellones quirúrgicos): Hospital Regional Coyhaique (135 basales, 141 con las 6 camas de la nueva UPC Pediátrica jun-2026, 4 pabellones, 18 sillones de hemodiálisis), Puerto Aysén (56 camas, 2 pabellones, 7/17 camas Medicina bloqueadas por pacientes sociosanitarios y ~30 camas en la red SSA), Hospital Comunitario Dr. Jorge Ibar Bruce de Puerto Cisnes (8 camas), Hospital Dr. Leopoldo Ortega Rodríguez de Chile Chico (7 camas, 1 pabellón, nuevo edificio feb-2026) y Hospital Lord Cochrane (7 camas, 1 pabellón, acreditado SuperSalud 14-05-2026). La APS reúne 4 CESFAM (+1 en construcción), 4 CECOSF, 27 Postas de Salud Rural (PSR, 100% tele-ECG desde oct-2025), 9 EMR y 2 COSAM. En SIGTE T3 2026 destacan 14.751 CNE No GES (159 días mediana), 3.608 IQ No GES (262 días mediana), 6.870 consultas odontológicas (242 días) y 524 retrasos GES (88 días), junto a 454 aeroevacuaciones SAMU primarias + 45 secundarias (Melinka regulado por SAMU Reloncaví; HRC sin equipo ECMO; 5 casos/1 fallecimiento hantavirus ago-2026) y la mayor tasa de suicidio de Chile (19,9/100k; 28,1/100k adolescente), además de 5,54 médicos RNPI vs. 1,80 efectivos en red pública SSA por 1.000 hab (UAysén con 0 carreras de Medicina).

## Indicadores Comunales Verificados

| Comuna | Camas Hospitalarias Red Asistencial | Postas de Salud Rural (PSR) | Establecimientos de Atención Primaria (APS) | Médicos por cada 1.000 Habitantes (médicos/1.000 hab) | Tiempo de Derivación Médica en Ambulancia/Barcaza al Hospital Regional Coyhaique (horas) |
| --- | --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 135 | 7 | 12 | 3,12 | 0 |
| [[comunas/lago_verde|Lago Verde]] | 0 | 3 | 3 | 0,82 | 4,5 |
| [[comunas/aysen|Aysén]] | 56 | 2 | 6 | 1,74 | 1 |
| [[comunas/cisnes|Cisnes]] | 8 | 4 | 7 | 1,15 | 3,5 |
| [[comunas/guaitecas|Guaitecas]] | 0 | 1 | 2 | 0,95 | 14 |
| [[comunas/chile_chico|Chile Chico]] | 7 | 3 | 5 | 1,28 | 4 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 0 | 5 | 7 | 0,88 | 1,5 |
| [[comunas/cochrane|Cochrane]] | 7 | 0 | 0 | 1,42 | 6 |
| [[comunas/ohiggins|O'Higgins]] | 0 | 1 | 1 | 0,78 | 10 |
| [[comunas/tortel|Tortel]] | 0 | 1 | 1 | 0,85 | 8 |

## Nodos Satélite del Hub

- [[nodos/nodo_24|Nodo #24: Red Hospitalaria Regional y Camas Críticas (5 Hospitales · 213 Camas)]]
- [[nodos/nodo_38|Nodo #38: Atención Primaria Rural: 27 Postas (PSR), 9 EMR, 4 CESFAM, 4 CECOSF y Rondas Médicas]]
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
