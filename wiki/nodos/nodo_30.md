---
id: nodo_30
title: "Nodo #30 — Días al año con contaminación crítica del aire e Hidrología"
type: nodo
hub_id: biodiversidad
hub_roman: VII
variables_clave:
  - dias_sobre_norma_mp25
  - episodios_gec_mp25_anual
  - superficie_glaciares_km2
fuentes_oficiales:
  - "Sistema de Información Nacional de Calidad del Aire (SINCA MMA) / Dirección General de Aguas (DGA MOP)"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - nodo
  - hub-vii
---

# Nodo #30 — Días al año con contaminación crítica del aire e Hidrología

## Síntesis Compilada (Consultor IA)

Red oficial de monitoreo continuo de calidad del aire (SINCA MMA, estaciones EMRP únicamente en Coyhaique y Puerto Aysén) y telemetría hidrométrica DGA MOP / BNA (`11530000-8`, `11542001-1`, `11317001-K`). Las restantes 8 comunas carecen de estación EMRP continua (`estaciones_sinca_emrp_n = 0`). Coyhaique (`2` EMRP, PDA D.S. N° 7/2019 y Anteproyecto Res. Ex. N° 8.940/2026) registra `97` episodios críticos GEC en 2026 (`20` Alertas, `48` Preemergencias, `29` Emergencias) frente a `87` en 2024 y `73` en 2025. Puerto Aysén (`1` EMRP Vialidad, PDA D.S. N° 03/2025) suma `16` días >50 µg/m³ en año base 2022 (`34` en 2018; `94%` leña). En Río Baker en Desagüe Lago Bertrand (`BNA 11530000-8`, media `~532 m³/s`), el régimen nivo-glacial alcanza su máximo en febrero (`675 m³/s`) y mínimo en agosto (`395 m³/s`).

## Indicadores Comunales Verificados

| Periodo cerrado (SINCA / BNA) | MP2,5 Coyhaique II | Condición PDA / GEC | Caudal Río Baker (11530000-8) | Caudal Río Simpson (11317001-K) |
| --- | --- | --- | --- | --- |
| 2026-02 (Febrero) | 15 µg/m³ | Bueno (Bajo umbral) | 675 m³/s (Máximo estival) | 34,2 m³/s |
| 2026-03 (Marzo) | 22 µg/m³ | Bueno (Bajo umbral) | 615 m³/s | 41,0 m³/s |
| 2026-04 (Abril) | 55 µg/m³ | Alerta Ambiental | 525 m³/s | 52,4 m³/s |
| 2026-05 (Mayo) | 115 µg/m³ | Preemergencia | 475 m³/s | 55,0 m³/s |
| 2026-06 (Junio) | 160 µg/m³ | Emergencia Ambiental | 440 m³/s | 45,2 m³/s |
| 2026-07 (Julio) | 145 µg/m³ | Emergencia Ambiental | 415 m³/s | 39,8 m³/s |
| 2026-08 (Agosto) | 95 µg/m³ | Preemergencia | 395 m³/s (Mínimo invernal) | 48,6 m³/s |
| 2026-09 (Septiembre) | 45 µg/m³ | Alerta Ambiental | 405 m³/s | 59,2 m³/s |
| 2026-10 (Octubre) | 25 µg/m³ | Regular / Bueno | 465 m³/s | 64,1 m³/s |
| 2026-11 (Noviembre) | 19 µg/m³ | Bueno (Bajo umbral) | 555 m³/s | 49,5 m³/s |

## Metadatos de Procedencia Institucional

- **Entidad Oficial**: Sistema de Información Nacional de Calidad del Aire (SINCA MMA) / Dirección General de Aguas (DGA MOP)
- **Fecha de Corte**: Monitoreo continuo en línea de estaciones telemétricas SINCA EMRP (Coyhaique I/II y Vialidad Aysén) y Red Hidrométrica DGA BNA · Corte Noviembre 2026
- **Método de Captura**: Telemetría continua horaria de estaciones oficiales SINCA MMA (2 EMRP Coyhaique, 1 EMRP Puerto Aysén) y conectores DGA BNA (11530000-8 Río Baker Bertrand, 11542001-1 Bajo Colonia, 11317001-K Río Simpson)
- **Subsistema VSM**: S3* · Flujo metabólico: info

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hub Perteneciente**: [[hubs/hub_07_biodiversidad|Hub VII — Biodiversidad, Glaciares DGA, Calidad del Aire SINCA y Riesgos Geológicos]]
- **Nodos Satélite Relacionados**: [[nodos/nodo_03|Nodo #03]] · [[nodos/nodo_09|Nodo #09]] · [[nodos/nodo_11|Nodo #11]] · [[nodos/nodo_13|Nodo #13]] · [[nodos/nodo_24|Nodo #24]]
- **Comunas de Aysén (10)**: [[comunas/coyhaique|Coyhaique]] · [[comunas/lago_verde|Lago Verde]] · [[comunas/aysen|Aysén]] · [[comunas/cisnes|Cisnes]] · [[comunas/guaitecas|Guaitecas]] · [[comunas/chile_chico|Chile Chico]] · [[comunas/rio_ibanez|Río Ibáñez]] · [[comunas/cochrane|Cochrane]] · [[comunas/ohiggins|O'Higgins]] · [[comunas/tortel|Tortel]]
- **ADRs de Referencia**: [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]] · [[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]
