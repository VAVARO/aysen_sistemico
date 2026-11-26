---
id: nodo_11
title: "Nodo #11 — Generación y Centrales Eléctricas"
type: nodo
hub_id: energia
hub_roman: III
variables_clave:
  - potencia_mw
  - costo_diesel_aislado_clp
fuentes_oficiales:
  - "Comisión Nacional de Energía (CNE) — Plataforma Energía Abierta"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - nodo
  - hub-iii
---

# Nodo #11 — Generación y Centrales Eléctricas

## Síntesis Compilada (Consultor IA)

Catastro georreferenciado de las centrales de generación eléctrica en la Región de Aysén: hidroeléctricas de pasada, parques eólicos y plantas térmicas diesel en sistemas medianos y aislados. Catastro reconciliado de 21 unidades operativas (67,10 MW): Central Térmica Tehuelche (17,98 MW), Lago Atravesado (11,00 MW), Planta Solar El Blanco (2,99 MW), Parque Eólico Alto Baguales (1,98 MW + 15 MW/2,5 MW BESS en construcción), Puerto Chacabuco (10,00 MW) y Sistemas Aislados <= 1,50 MW (Melinka 1,45 MW, O'Higgins 1,25 MW, Tortel 0,95 MW, Puerto Aguirre 0,48 MW).

## Indicadores Comunales Verificados

| Central / Nodo de Generación | Comuna INE | Tipo de Central | Detalle Técnico (MW) | Coordenadas |
| --- | --- | --- | --- | --- |
| Central Hidroeléctrica Lago Atravesado | 11101 | Hidroeléctrica de pasada | potencia mw: 11 · tecnologia: Hidroeléctrica de pasada | -45.688, -72.285 |
| Central Mini-Hidroeléctrica Río Aysén / Puerto Aysén | 11201 | Hidroeléctrica de pasada | potencia mw: 2 · tecnologia: Hidroeléctrica de pasada | -45.405, -72.685 |
| Central Hidroeléctrica El Toqui (Autogeneración Minera) | 11201 | Hidroeléctrica de pasada | potencia mw: 2 · tecnologia: Hidroeléctrica de pasada | -45.052, -71.931 |
| Microcentrales SSAA Litoral Cisnes (Pto. Gaviota, Pto. Gala y Melimoyu) | 11202 | Híbrida Microhidro + Diésel | potencia mw: 0.36 · tecnologia: Híbrida Microhidro + Diésel | -44.525, -73.205 |
| Central Hidroeléctrica Los Maquis (Puerto Guadal) | 11401 | Hidroeléctrica de pasada | potencia mw: 1 · tecnologia: Hidroeléctrica de pasada | -46.685, -72.715 |
| Central Hidroeléctrica El Traro | 11301 | Hidroeléctrica de pasada | potencia mw: 0.64 · tecnologia: Hidroeléctrica de pasada | -47.231, -72.512 |
| Central Híbrida Municipal Caleta Tortel (Diésel + Microhidro Pelton) | 11303 | Híbrida Diésel + Microhidro | potencia mw: 0.95 · tecnologia: Híbrida Diésel + Microhidro | -47.798, -73.538 |
| Central Híbrida Río Mosco / Villa O'Higgins (Hidro + Respaldo Diésel) | 11302 | Híbrida Hidroeléctrica + Diésel | potencia mw: 1.25 · tecnologia: Híbrida Hidroeléctrica + Diésel | -48.472, -72.548 |

## Metadatos de Procedencia Institucional

- **Entidad Oficial**: Comisión Nacional de Energía (CNE) — Plataforma Energía Abierta
- **Fecha de Corte**: Catastro de Centrales de Generación Eléctrica en Operación · Corte Agosto 2026
- **Método de Captura**: Declaraciones oficiales de operadores eléctricos ante CNE y Coordinador Eléctrico Nacional
- **Subsistema VSM**: S1 · Flujo metabólico: energy

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hub Perteneciente**: [[hubs/hub_03_energia|Hub III — Energía, Sistemas Medianos Aislados, Matriz Térmica y Telecomunicaciones]]
- **Nodos Satélite Relacionados**: [[nodos/nodo_19|Nodo #19]] · [[nodos/nodo_21|Nodo #21]] · [[nodos/nodo_30|Nodo #30]] · [[nodos/nodo_37|Nodo #37]]
- **Comunas de Aysén (10)**: [[comunas/coyhaique|Coyhaique]] · [[comunas/lago_verde|Lago Verde]] · [[comunas/aysen|Aysén]] · [[comunas/cisnes|Cisnes]] · [[comunas/guaitecas|Guaitecas]] · [[comunas/chile_chico|Chile Chico]] · [[comunas/rio_ibanez|Río Ibáñez]] · [[comunas/cochrane|Cochrane]] · [[comunas/ohiggins|O'Higgins]] · [[comunas/tortel|Tortel]]
- **ADRs de Referencia**: [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]] · [[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]
