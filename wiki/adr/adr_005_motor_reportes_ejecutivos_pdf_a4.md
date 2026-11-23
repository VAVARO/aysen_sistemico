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
| [[comunas/coyhaique|Coyhaique]] | 46,5 | 53,5 | 41,1 | 8 |
| [[comunas/lago_verde|Lago Verde]] | 89,2 | 10,8 | 5,8 | 2 |
| [[comunas/aysen|Aysén]] | 52,8 | 47,2 | 32,4 | 6 |
| [[comunas/cisnes|Cisnes]] | 74,5 | 25,5 | 17,3 | 6 |
| [[comunas/guaitecas|Guaitecas]] | 83 | 17 | 43,9 | 2 |
| [[comunas/chile_chico|Chile Chico]] | 71,2 | 28,8 | 15,8 | 5 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 79,6 | 20,4 | 15,8 | 6 |
| [[comunas/cochrane|Cochrane]] | 76,8 | 23,2 | 9,4 | 3 |
| [[comunas/ohiggins|O'Higgins]] | 91,5 | 8,5 | 3,9 | 2 |
| [[comunas/tortel|Tortel]] | 92,8 | 7,2 | 3,8 | 2 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hubs Impactados**: [[hubs/hub_01_turismo|Hub I]] · [[hubs/hub_04_gobernanza|Hub IV]] · [[hubs/hub_09_cultura|Hub IX]]
- **Comunas de Referencia**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]] · [[comunas/cochrane|Cochrane]] · [[comunas/chile_chico|Chile Chico]]
- **Conceptos Vinculados**: [[conceptos/financiamiento_municipal|financiamiento_municipal]] · [[conceptos/inversion_publica_regional|inversion_publica_regional]]
