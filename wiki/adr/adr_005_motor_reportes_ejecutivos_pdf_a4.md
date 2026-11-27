---
id: adr_005_motor_reportes_ejecutivos_pdf_a4
title: "ADR-005 — Motor de Dossiers Ejecutivos PDF A4 con Narrativa Estadística, Bivariada y Sistémica"
type: adr
hub_id: cultura
hub_roman: IX
variables_clave:
  - dependencia_fcm_pct
  - ingresos_propios_pct
  - red_vial_pavimentada_pct
  - total_espacios_culturales
fuentes_oficiales:
  - "SUBDERE — SINIM"
  - "MOP Vialidad — Catastro Vial Regional"
  - "MINCAP / SERPAT — Infraestructura Cultural"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - adr
  - hub-ix
---

# ADR-005 — Motor de Dossiers Ejecutivos PDF A4 con Narrativa Estadística, Bivariada y Sistémica

## Síntesis Compilada (Consultor IA)

Dado que `window.print()` nativo sobre un lienzo interactivo `100vh overflow: hidden` recorta las ventanas flotantes y omite la interpretación metodológica, `laboratorio.html` implementa un Motor de Dossiers Ejecutivos PDF A4 dedicado (`#reportPrintView`). El usuario puede encolar hasta 6 vistas analíticas desde el lienzo o desde el Consultor (`+ Añadir al Reporte (N/6)`), y el motor rasteriza cada gráfico Chart.js en alta resolución junto a una síntesis automática de 3 párrafos: (1) Lectura Estadística (rango, media regional, mediana, extremos comunales y brecha territorial), (2) Lectura Bivariada / Correlación (pendiente OLS, R² y comportamiento con o sin Coyhaique), y (3) Implicancia Sistémica y Fuentes Oficiales consolidadas al pie del documento.

## Contexto, Decisión e Implicancias de Ingeniería

- **Contexto del Problema**: Los equipos técnicos de GORE, SEREMIs y municipios requieren exportar la evidencia visual del Laboratorio en documentos formales listos para sesión de CORE o informes técnicos.
- **Decisión Arquitectónica**: Construir una vista de maquetación editorial A4 independiente del viewport 2D que ensambla portada institucional, fichas gráficas numeradas, narrativa tripartita y bibliografía oficial verificada.
- **Consecuencias y Verificación**: Generación instantánea de reportes ejecutivos trazables sin necesidad de servidores de renderizado PDF externos.

## Indicadores Comunales Verificados

| Comuna | Dependencia del Fondo Común Municipal (%) | Ingresos Propios Permanentes (%) | Porcentaje de Pavimentación Vial (%) | Total de Espacios Culturales e Infraestructura |
| --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 58,4 | 41,6 | 41,1 | 14 |
| [[comunas/lago_verde|Lago Verde]] | 83,9 | 16,1 | 5,8 | 3 |
| [[comunas/aysen|Aysén]] | 61,1 | 38,9 | 32,4 | 10 |
| [[comunas/cisnes|Cisnes]] | 48,7 | 51,3 | 17,3 | 5 |
| [[comunas/guaitecas|Guaitecas]] | 73,1 | 26,9 | 43,9 | 1 |
| [[comunas/chile_chico|Chile Chico]] | 86,5 | 13,5 | 15,8 | 4 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 86,6 | 13,4 | 15,8 | 7 |
| [[comunas/cochrane|Cochrane]] | 85,7 | 14,3 | 9,4 | 5 |
| [[comunas/ohiggins|O'Higgins]] | 95,3 | 4,7 | 3,9 | 2 |
| [[comunas/tortel|Tortel]] | 95,4 | 4,6 | 3,8 | 3 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hubs Impactados**: [[hubs/hub_01_turismo|Hub I]] · [[hubs/hub_04_gobernanza|Hub IV]] · [[hubs/hub_09_cultura|Hub IX]]
- **Comunas de Referencia**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]] · [[comunas/cochrane|Cochrane]] · [[comunas/chile_chico|Chile Chico]]
- **Conceptos Vinculados**: [[conceptos/financiamiento_municipal|financiamiento_municipal]] · [[conceptos/inversion_publica_regional|inversion_publica_regional]]
