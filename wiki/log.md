---
id: wiki_log
title: "Bitácora Cronológica de Conocimiento — Aysén Sistémico (LLM Wiki Log)"
type: log
hub_id: gobernanza
hub_roman: IV
variables_clave:
  - poblacion_censo_2024
  - presupuesto_mclp
  - total_proyectos_ctci
fuentes_oficiales:
  - "INE — Censo de Población y Vivienda 2024"
  - "SUBDERE — SINIM"
  - "ANID DataCiencia / CORFO Innova"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - log
---

# Bitácora Cronológica de Conocimiento — Aysén Sistémico (LLM Wiki Log)

Registro append-only de ingestas de fuentes, auditorías (lint), decisiones de arquitectura (adr) y síntesis compiladas.
Comando rápido de consulta: `grep "^## \[" wiki/log.md | tail -n 10`

## Síntesis Compilada (Consultor IA)

La bitácora cronológica (`wiki/log.md`) registra de manera inmutable todas las operaciones de ingesta estadística (`ingest`), decisiones arquitectónicas (`adr`) y validaciones deterministas (`lint`) sobre la base de conocimiento de Aysén Sistémico (10 comunas, 10 Hubs, 41 Nodos Satélite, 235 variables comunales y 38 fuentes oficiales).

## [2026-10-16] ingest | Inicialización del Data Lake Territorial (10 Comunas, 38 Fuentes Oficiales)
- Compilación inicial de indicadores comunales CENSO 2024, SINIM, SERNATUR, CONAF, SERNAPESCA, CNE, SEC, DEIS y ANID hacia [[index|Índice Maestro de la Wiki]] y [[comunas/coyhaique|Coyhaique]].

## [2026-11-21] adr | Reorganización Taxonómica en 10 Hubs, 41 Nodos Satélite y 30 Subcategorías
- Commit `6497827`: Estandarización de la ontología territorial en 10 Hubs equilibrados (`I` al `X`) documentada en [[adr/adr_001_arquitectura_cero_costo_vanilla|ADR-001]] y [[hubs/hub_04_gobernanza|Hub IV — Gobernanza]].

## [2026-11-22] ingest | Reingeniería Integral de los Hubs II al X (235 Variables Comunales Verificadas)
- Commits `50ab91a`, `a4d8c79`, `2890ce3`, `e9ea303`: Incorporación de varianza real en vectores clínicos DEIS ([[hubs/hub_08_salud|Hub VIII — Salud]]), 16 centros CTCi con 124 investigadores ([[hubs/hub_10_ctci|Hub X — CTCi]]), 18 espacios museográficos ([[hubs/hub_09_cultura|Hub IX — Cultura]]), 10.035,7 km² glaciares DGA ([[hubs/hub_07_biodiversidad|Hub VII — Biodiversidad]]) y 27 Postas de Salud Rural ([[nodos/nodo_38|Nodo #38]]). Véase [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]].

## [2026-11-22] adr | Arquitectura Semántica LLM-First en Consultor y Motor de Dossier PDF A4 en Laboratorio
- Commits `6ecf4c5` y `080de7a`: Implementación de paquetes conceptuales ([[conceptos/financiamiento_municipal|Financiamiento Municipal]], [[conceptos/sistema_electrico_energia|Matriz Energética]]), grafo territorial multi-entidad ([[conceptos/huemules_multidimensional|Huemules]], [[conceptos/volcan_hudson_y_campos_de_hielo|Volcán Hudson y Laguna San Rafael]]), reparación conversacional pura y guiada ([[adr/adr_003_enrutador_hibrido_llm_first_omniroute|ADR-003]]) y generador PDF editorial A4 con narrativa de 3 párrafos por gráfico ([[adr/adr_005_motor_reportes_ejecutivos_pdf_a4|ADR-005]]).

## [2026-11-23] lint | Instanciación de la Wiki Compilada de Karpathy y Sincronización con Obsidian Vault
- Compilación de 77 páginas canónicas en `wiki/` ([[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]), verificación de 0 enlaces rotos, 0 páginas huérfanas y 100% de paridad numérica contra `data/aysen_hubs_data.js`.

## [2026-11-23] adr | Motor Python de 25 Hallazgos Estadísticos Multicriterio, Reparación Móvil y Visibilidad de Fiordos
- Pre-cálculo en Python (`scripts/precompute_curated_discoveries.py` -> `data/aysen_hallazgos_precalculados.js`) de 25 hallazgos inter-Hubs con 5 pruebas (OLS + Benjamini-Hochberg FDR < 0,05, Spearman, correlación parcial por población, Leave-Coyhaique-Out y primeras diferencias 2015–2026), reparación universal del menú móvil (`js/cabecera_global.js`, `sistemas_complejos.html`, `laboratorio.html`) y transparencia automática de polígonos sobre fiordos en Leaflet ([[adr/adr_004_normalizacion_per_capita_y_colinealidad|ADR-004]]).

