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
updated_at: "2026-11-25"
tags:
  - aysen-sistemico
  - log
---

# Bitácora Cronológica de Conocimiento — Aysén Sistémico (LLM Wiki Log)

Registro append-only de ingestas de fuentes, auditorías (lint), decisiones de arquitectura (adr) y síntesis compiladas.
Comando rápido de consulta: `grep "^## \[" wiki/log.md | tail -n 10`

## Síntesis Compilada (Consultor IA)

La bitácora cronológica (`wiki/log.md`) registra de manera inmutable todas las operaciones de ingesta estadística (`ingest`), decisiones arquitectónicas (`adr`) y validaciones deterministas (`lint`) sobre la base de conocimiento de Aysén Sistémico (10 comunas, 10 Hubs, 41 Nodos Satélite, 236 variables comunales —218 numéricas— y 38 fuentes oficiales).

## [2026-10-16] ingest | Inicialización del Data Lake Territorial (10 Comunas, 38 Fuentes Oficiales)
- Compilación inicial de indicadores comunales CENSO 2024, SINIM, SERNATUR, CONAF, SERNAPESCA, CNE, SEC, DEIS y ANID hacia [[index|Índice Maestro de la Wiki]] y [[comunas/coyhaique|Coyhaique]].

## [2026-11-21] adr | Reorganización Taxonómica en 10 Hubs, 41 Nodos Satélite y 30 Subcategorías
- Commit `6497827`: Estandarización de la ontología territorial en 10 Hubs equilibrados (`I` al `X`) documentada en [[adr/adr_001_arquitectura_cero_costo_vanilla|ADR-001]] y [[hubs/hub_04_gobernanza|Hub IV — Gobernanza]].

## [2026-11-22] ingest | Reingeniería Integral de los Hubs II al X (236 Variables Comunales Verificadas)
- Commits `50ab91a`, `a4d8c79`, `2890ce3`, `e9ea303`: Incorporación de varianza real en vectores clínicos DEIS ([[hubs/hub_08_salud|Hub VIII — Salud]]), 16 centros CTCi con 124 investigadores ([[hubs/hub_10_ctci|Hub X — CTCi]]), 18 espacios museográficos ([[hubs/hub_09_cultura|Hub IX — Cultura]]), 10.035,7 km² glaciares DGA ([[hubs/hub_07_biodiversidad|Hub VII — Biodiversidad]]) y 27 Postas de Salud Rural ([[nodos/nodo_38|Nodo #38]]). Véase [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]].

## [2026-11-22] adr | Arquitectura Semántica LLM-First en Consultor y Motor de Dossier PDF A4 en Laboratorio
- Commits `6ecf4c5` y `080de7a`: Implementación de paquetes conceptuales ([[conceptos/financiamiento_municipal|Financiamiento Municipal]], [[conceptos/sistema_electrico_energia|Matriz Energética]]), grafo territorial multi-entidad ([[conceptos/huemules_multidimensional|Huemules]], [[conceptos/volcan_hudson_y_campos_de_hielo|Volcán Hudson y Laguna San Rafael]]), reparación conversacional pura y guiada ([[adr/adr_003_enrutador_hibrido_llm_first_omniroute|ADR-003]]) y generador PDF editorial A4 con narrativa de 3 párrafos por gráfico ([[adr/adr_005_motor_reportes_ejecutivos_pdf_a4|ADR-005]]).

## [2026-11-23] lint | Instanciación de la Wiki Compilada de Karpathy y Sincronización con Obsidian Vault
- Compilación de 77 páginas canónicas en `wiki/` ([[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]), verificación de 0 enlaces rotos, 0 páginas huérfanas y 100% de paridad numérica contra `data/aysen_hubs_data.js`.

## [2026-11-23] adr | Motor Python de 25 Hallazgos Estadísticos Multicriterio, Reparación Móvil y Visibilidad de Fiordos
- Pre-cálculo en Python (`scripts/precompute_curated_discoveries.py` -> `data/aysen_hallazgos_precalculados.js`) de 25 hallazgos inter-Hubs con 5 pruebas (OLS + Benjamini-Hochberg FDR < 0,05, Spearman, correlación parcial por población, Leave-Coyhaique-Out y primeras diferencias 2015–2026), reparación universal del menú móvil (`js/cabecera_global.js`, `sistemas_complejos.html`, `laboratorio.html`) y transparencia automática de polígonos sobre fiordos en Leaflet ([[adr/adr_004_normalizacion_per_capita_y_colinealidad|ADR-004]]).

## [2026-11-25] adr | Sprints 1–3: Auditoría Estadística, Semilla Dual Conectada y Sincronización Bidireccional Obsidian
- **Integridad dimensional en Laboratorio**: Bloqueo de cruces bivariados espurios entre dimensiones incompatibles (`holding` / `tiempo` vs. `comuna`) en `resolveCommunalVector()`, `fuseVariableIntoWidget()`, `getWidgetDataPayload()` y `createWidget()`, separando automáticamente en láminas paralelas vinculadas mediante `addConnection(..., 'sync')`.
- **Normalización Z-Score y Per Cápita**: Soporte nativo de `scaleMode: 'per_capita'` con conversión explícita de `MM US$` / `MUS$` a `US$/hab`, y lectura estadística específica para escala Z-Score (`σ`) sin coeficientes de variación espurios.
- **Reportes Ejecutivos PDF e Integración LLM**: Guardas `isLiveLLMConnected()` en `enrichReportNarrativesWithAI()` para impedir sobrescrituras offline con salidas de ranking, enriquecimiento determinista bivariado por cuadrantes (`Alto-Alto`, `Alto-Bajo`, `Bajo-Alto`, `Bajo-Bajo`), mapeo semántico de nodos satélite (como [[nodos/nodo_30|Nodo #30]] MP2,5), encabezados multi-Hub transversales y renderizado `<strong>` para énfasis Markdown.
- **Sincronización Wiki y Vault**: Actualización canónica a `245` variables comunales (`226` numéricas tras Sprint 4), incorporación de guardia anti-regresión en `FORBIDDEN_STALE_CLAIMS` de `scripts/obsidian_wiki_bridge.cjs`, cálculo dinámico de `generatedAt` en `data/aysen_wiki_compiled.js`, auto-sincronización al Vault local tras `--compile`, encadenamiento desde `scripts/build_aysen_hubs_bundle.cjs` e instalación de `.git/hooks/pre-commit` vía `scripts/install_git_hooks.cjs` ([[adr/adr_001_arquitectura_cero_costo_vanilla|ADR-001]], [[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]).

## [2026-11-25] ingest | Sprint 4: Reingeniería Forense del Hub II (18 Barrios ACS, Padrón SUBPESCA, Patente PUA Art. 84 LGPA y Fiscalización SNIFA-SMA)
- **Saneamiento forense de Hub II**: Unificación exacta del vector `antibioticos_ica_g_ton` (`382,1 / 335,4 / 324,8 / 289,0 g/t`) entre `dl.comunas`, `barriosAcs` y `concesionesPadronCompact`; resolución de la paradoja contable de Tortel (`ACS-35`: 0 activos vigentes y 8.500 ton asignadas exclusivamente a 4 centros habilitados RCA con `ciclo_cerrado_reciente = 1`); incorporación de solicitudes ECMPO en Guaitecas (`148.000 ha`) y Tortel (`18.500 ha`) más `ecmpo_traslape_acuicola_n` (`338` concesiones); y reconciliación entre desembarque RPA flota local (`13.820 ton`) vs. transferencia total en muelles (`31.690 ton`).
- **Ingesta real SUBPESCA y SNASPE por holding**: Creación de `scripts/ingesta/fetch_subpesca_padron_aysen.cjs` contra `geoportal.subpesca.cl` (`694` polígonos reales de Aysén) y redistribución geográfica de las `312` concesiones en SNASPE con presencia real de Cooke Aquaculture (`10` en borde PN Laguna San Rafael / Cupquelán), Australis (`15`) y Yadrán (`27`).
- **Nueva dimensión `dim: 'acs'` y variables fiscales/ambientales**: Exportación de `window.AYSEN_HUBS_DATA.barriosAcs` (`N=18` barrios `ACS-17` a `ACS-35`, `745` conc., `245` activos, `312` SNASPE, `503.500 ton`) con 8 variables `acs_*`, 8 nuevas variables comunales (`patente_acuicola_pua_mclp`, `peso_pua_ingresos_propios_pct`, `superficie_concesionada_mar_ha`, `empleo_directo_acuicola_n`, `sancionatorios_sma_acuicolas_n`, `centros_infa_anaerobica_n`, `ecmpo_traslape_acuicola_n`, `desembarque_muelles_total_ton`), `sancionatorios_sma_por_holding` y 4 series históricas por especie (`2015–2026`), sincronizadas en [[hubs/hub_02_salmonicultura|Hub II]], [[conceptos/modelo_salmonicultor|Modelo Salmonicultor]] y [[nodos/nodo_06|Nodos #06]]–[[nodos/nodo_09|#09]].

## [2026-11-26] ingest | Sprint 5: Reingeniería Forense Hub I Turismo/SNASPE y Saneamiento Transversal 10 Hubs
- **Hub I EMAT, RNPST, ZOIT y Economía ACT**: Eliminación de fórmulas colineales (`ADR 1,35x` y ocupación estival sintética), reconciliación exacta a 364.039 pernoctaciones y 196.611 llegadas EMAT 2025 (ADR $70.213 CLP, RevPAR $17.203 CLP, estadía regional de 10,0 días en Encuesta Balmaceda), catastro RNPST de 1.728 servicios con brecha de vigencia de patentes (31,6% Chelenko / 11,8% Queulat), exclusión legal de Aysén (11201) de la ZOIT Queulat y economía ACT (3.152 empresas, 11.569.086 UF, 5.270 empleos) en [[hubs/hub_01_turismo|Hub I]] y [[nodos/nodo_01|Nodos #01]]–[[nodos/nodo_05|#05]].
- **Dimensión SNASPE N=19 y Puertas Multimodales**: Separación entre 86.117 visitas oficiales CONAF y 273.900 en atractivos totales, nueva dimensión `dim: 'snaspe'` (N=19 unidades, 41 guardaparques, 318 concesiones en SNASPE, Lista Verde UICN en Cerro Castillo y Glaciar Exploradores Corte Suprema ROL 7.477-2026), serie Balmaceda JAC (605.945 pax en 2025, terminal 12.391 m² oct. 2026), pasos PDI (350.257 controles en 2024) y cruceros (22.093 pax en 29 recaladas).
- **Saneamiento Transversal y Auditoría V2**: Asimetría SII real en [[hubs/hub_05_inversion|Hub V]] y [[nodos/nodo_20|Nodo #20]] (13.453 empresas y 35.832 trabajadores, CV > 0,25), diferenciación SUBTEL fijo vs. FTTH en Hub III, exclusión de 19 alias secundarios `isAliasOf` en Laboratorio/Precompute/Auditoría, clasificación al 100% bajo 10 Hubs canónicos y extensión de `obsidian_indicator_audit.cjs` a `unidadesSnaspe` N=19 y fallback de historial git.
