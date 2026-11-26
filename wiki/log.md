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

La bitácora cronológica (`wiki/log.md`) registra de manera inmutable todas las operaciones de ingesta estadística (`ingest`), decisiones arquitectónicas (`adr`) y validaciones deterministas (`lint`) sobre la base de conocimiento de Aysén Sistémico (10 comunas, 10 Hubs, 41 Nodos Satélite y fuentes oficiales verificadas).

## [2026-10-16] ingest | Inicialización del Data Lake Territorial (10 Comunas, Fuentes Oficiales)
- Compilación inicial de indicadores comunales CENSO 2024, SINIM, SERNATUR, CONAF, SERNAPESCA, CNE, SEC, DEIS y ANID hacia [[index|Índice Maestro de la Wiki]] y [[comunas/coyhaique|Coyhaique]].

## [2026-11-21] adr | Reorganización Taxonómica en 10 Hubs, 41 Nodos Satélite y 30 Subcategorías
- Commit `6497827`: Estandarización de la ontología territorial en 10 Hubs equilibrados (`I` al `X`) documentada en [[adr/adr_001_arquitectura_cero_costo_vanilla|ADR-001]] y [[hubs/hub_04_gobernanza|Hub IV — Gobernanza]].

## [2026-11-22] ingest | Reingeniería Integral de los Hubs II al X (Variables Comunales Verificadas)
- Commits `50ab91a`, `a4d8c79`, `2890ce3`, `e9ea303`: Incorporación de varianza real en vectores clínicos DEIS ([[hubs/hub_08_salud|Hub VIII — Salud]]), 16 centros CTCi con 124 investigadores ([[hubs/hub_10_ctci|Hub X — CTCi]]), 18 espacios museográficos ([[hubs/hub_09_cultura|Hub IX — Cultura]]), 10.035,7 km² glaciares DGA ([[hubs/hub_07_biodiversidad|Hub VII — Biodiversidad]]) y 27 Postas de Salud Rural ([[nodos/nodo_38|Nodo #38]]). Véase [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]].

## [2026-11-22] adr | Arquitectura Semántica LLM-First en Consultor y Motor de Dossier PDF A4 en Laboratorio
- Commits `6ecf4c5` y `080de7a`: Implementación de paquetes conceptuales ([[conceptos/financiamiento_municipal|Financiamiento Municipal]], [[conceptos/sistema_electrico_energia|Matriz Energética]]), grafo territorial multi-entidad ([[conceptos/huemules_multidimensional|Huemules]], [[conceptos/volcan_hudson_y_campos_de_hielo|Volcán Hudson y Laguna San Rafael]]), reparación conversacional pura y guiada ([[adr/adr_003_enrutador_hibrido_llm_first_omniroute|ADR-003]]) y generador PDF editorial A4 con narrativa de 3 párrafos por gráfico ([[adr/adr_005_motor_reportes_ejecutivos_pdf_a4|ADR-005]]).

## [2026-11-23] lint | Instanciación de la Wiki Compilada de Karpathy y Sincronización con Obsidian Vault
- Compilación de 77 páginas canónicas en `wiki/` ([[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]), verificación de 0 enlaces rotos, 0 páginas huérfanas y 100% de paridad numérica contra `data/aysen_hubs_data.js`.

## [2026-11-25] ingest | Sprint 4: Reingeniería Forense Hub II (18 Barrios ACS, Padrón SUBPESCA, PUA Art. 84 LGPA y SNIFA-SMA)
- Unificación de `antibioticos_ica_g_ton`, resolución de `ACS-35` Tortel, solicitudes ECMPO Guaitecas/Tortel, catastro real SUBPESCA y `barriosAcs` en [[hubs/hub_02_salmonicultura|Hub II]], [[conceptos/modelo_salmonicultor|Modelo Salmonicultor]] y [[nodos/nodo_06|Nodos #06]]–[[nodos/nodo_09|#09]].

## [2026-11-26] ingest | Sprint 5: Reingeniería Forense Hub I Turismo/SNASPE y Saneamiento Transversal 10 Hubs
- Reconciliación EMAT 2025 (364.039 pernoctaciones), RNPST (1.728 servicios), dimensión `dim: 'snaspe'` (N=19), asimetría SII real (13.453 empresas / 35.832 trabajadores) y Auditoría Obsidian V2 en [[hubs/hub_01_turismo|Hub I]] y [[hubs/hub_05_inversion|Hub V]].

## [2026-11-26] ingest | Sprint 6: Reingeniería Forense del Hub III (Energía, Combustibles, Matriz Térmica, SUBTEL/FOA) e Invariantes Obsidian V3
- Erradicación del nodo alucinado `Cabo Juan Román`, catastro reconciliado de 21 centrales operativas sumando exactamente `67,10 MW` (+`18,98 MW` ERNC en construcción 2026) con SSAA `<= 1,50 MW` (Art. 173° LGSE), BT1 nov-2026 `Decreto N° 8T/2026` (`$287,8/kWh`), `13.448` hogares Subsidio Eléctrico Ley 21.667 y `data/raw/energia_telecom/marco_regulatorio_tarifario_aysen_2024_2028.json`.
- Corte combustibles CNE 19-nov-2026 (`$1.696/L` gasolina 93, `$1.663/L` diésel, `$1.497/L` kerosene FEPP), Terminal MBM Copec Chacabuco `6.674 m³` activos (`10.474 m³` totales), leña INFOR BES N° 11 `334.274 m³ sólidos/año` (`Coyhaique 147.080 m³s [44,0%]`, `68,8%` hogares, `9,81 m³s/hogar`), trazado real SUBTEL/FOA (único aterrizaje CTR en [[comunas/tortel|Tortel]], GTD privado en Puerto Chacabuco, 14 POIITs Silica, `FDT-2025-03` y Tortel–O'Higgins 1S-2028) y paridad censal `26.294`/`24.782` conexiones en [[hubs/hub_03_energia|Hub III]] y [[nodos/nodo_11|Nodos #11]]–[[nodos/nodo_14|#14]].
- Cierre residuales Sprint 5 (`isAliasOf` USD/CLP, neutralización bilateral de 3 complementos `100 - X` y `comuna_principal`/`comuna_ine` en 19 `unidadesSnaspe`) y evolución a **Obsidian Indicator Audit V3** (Evals E13–E16).

## [2026-11-26] ingest | Sprint 8: Reingeniería Forense del Hub V (BCCh, SII 5 Tramos, SEIA 1:1, SERNAGEOMIN, ChileCompra, CMF, ODEPA y CONAF 2026)
- Reconciliación macroeconómica BCCh Cuentas Nacionales Regionales 2018–2025 (`1.991.000 MM$` en 2025, `+8,5%` real, FBCF `+18,2%`, PIB turístico `89.200 MM$` = `4,5%`, 1T 2026 `-2,6%` real, 13 actividades económicas) y eliminación de contradicción SII (`9.365/56.475`) mediante 5 tramos UF BCN 2024 (`12.953` emp.), ventas domicilio local (`25.800 MUF`) vs valor bruto producción (`131.520 MUF`) y series SII 2022–2025 en [[hubs/hub_05_inversion|Hub V]] y [[nodos/nodo_20|Nodo #20]].
- Erradicación geográfica de `Los Cóndores` (Maule) reemplazada por `Central Hidroeléctrica Río Mañihuales` (`Edelaysen S.A.`), limpieza de parámetros ficticios `id_expediente=`, sincronía 1:1 SEIA, Cuenta Pública SEA 2025 (`3` aprobados, `1` desistido, `0` rechazados, `72` pertinencias), catastro SERNAGEOMIN (`356` conc. / `128.511 ha` con Pacífico del Sur y Andean Silver), ChileCompra (`230.850 M$` 2024 / `238.400 M$` 2025 / `228.874,2 M$` 2026 YTD), banca CMF 2025 + leyes de excepción, ODEPA (`144.118` bovinos / `177.972` ovinos), CONAF 2026 (`10.667.211,5 ha` / `5.152.384,3 ha` bosque nativo / `2.387.525,4 ha` en SNASPE) y **Eval E18** en [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]].
