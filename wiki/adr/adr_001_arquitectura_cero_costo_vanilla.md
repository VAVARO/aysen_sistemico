---
id: adr_001_arquitectura_cero_costo_vanilla
title: "ADR-001 — Arquitectura Zero-Cost Static Data Lake y Cuaderno Editorial Cartográfico Austral"
type: adr
hub_id: gobernanza
hub_roman: IV
variables_clave:
  - poblacion_censo_2024
  - presupuesto_mclp
  - fndr_mclp
fuentes_oficiales:
  - "INE — Censo de Población y Vivienda 2024"
  - "SUBDERE — SINIM"
  - "GORE Aysén — Datos Abiertos"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - adr
  - hub-iv
---

# ADR-001 — Arquitectura Zero-Cost Static Data Lake y Cuaderno Editorial Cartográfico Austral

## Síntesis Compilada (Consultor IA)

Aysén Sistémico adopta una arquitectura de costo de infraestructura cero ($0/mes) basada en HTML5, CSS3 y JavaScript Vanilla ES6+ sin dependencias de Node.js en tiempo de ejecución ni bases de datos relacionales pagadas. El pipeline de compilación estática (`scripts/build_aysen_hubs_bundle.cjs`) empaqueta las variables comunales verificadas del Data Lake, 10 Hubs temáticos (`I` al `X`), 41 Nodos Satélite (`#01` al `#41`) y fuentes oficiales en `data/aysen_hubs_data.js`, alimentando cinco módulos integrados bajo la identidad visual Cuaderno Editorial y Cartográfico Austral: Portada Vectorial (`portal.html`), Visualizador de Complejidad (`sistemas_complejos.html`), Data Hub Territorial (`index.html`), Laboratorio Cartográfico 2D (`laboratorio.html`) y Consultor Semántico IA (`consultor.html`).

## Contexto, Decisión e Implicancias de Ingeniería

- **Contexto del Problema**: Las plataformas públicas de datos regionales suelen fracasar por costos recurrentes de servidores cloud, fragmentación de microservicios o acoplamiento a licencias BI propietarias que quedan obsoletas al terminar un convenio.
- **Decisión Arquitectónica**: Desacoplar completamente la fase de ingesta/compilación (ejecutada en Node.js y Python en tiempo de build) de la fase de consulta ciudadana (100% cliente en navegador vía GitHub Pages + proxy ligero hacia OmniRoute).
- **Consecuencias y Verificación**: Latencia cero en cruces bivariados sobre las 10 comunas, auditoría determinista mediante suites automatizadas, portabilidad total offline y preservación de contratos DOM.

## Indicadores Comunales Verificados

| Comuna | Población Censo 2024 (hab.) | Presupuesto Municipal Vigente (M$) | Inversión Pública FNDR Asignada (M$) |
| --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 57.823 | 27.611 | 14.850 |
| [[comunas/lago_verde|Lago Verde]] | 882 | 3.321,05 | 2.200 |
| [[comunas/aysen|Aysén]] | 23.170 | 14.614,29 | 9.800 |
| [[comunas/cisnes|Cisnes]] | 5.335 | 7.985,27 | 5.600 |
| [[comunas/guaitecas|Guaitecas]] | 1.598 | 4.569,04 | 3.400 |
| [[comunas/chile_chico|Chile Chico]] | 4.950 | 5.981,72 | 4.900 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 2.671 | 6.252,85 | 4.100 |
| [[comunas/cochrane|Cochrane]] | 3.492 | 5.720,96 | 4.800 |
| [[comunas/ohiggins|O'Higgins]] | 664 | 5.323,76 | 2.400 |
| [[comunas/tortel|Tortel]] | 563 | 3.440,74 | 2.600 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hubs Impactados**: [[hubs/hub_01_turismo|Hub I]] · [[hubs/hub_04_gobernanza|Hub IV]] · [[hubs/hub_10_ctci|Hub X]]
- **Comunas de Referencia**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]]
- **Conceptos Vinculados**: [[conceptos/financiamiento_municipal|financiamiento_municipal]] · [[conceptos/ecosistema_ctci_ciencia|ecosistema_ctci_ciencia]]
