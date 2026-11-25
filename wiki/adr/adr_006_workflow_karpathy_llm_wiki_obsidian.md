---
id: adr_006_workflow_karpathy_llm_wiki_obsidian
title: "ADR-006 — Implementación del Workflow LLM-Wiki de Karpathy Conectado a Obsidian Vault"
type: adr
hub_id: ctci
hub_roman: X
variables_clave:
  - total_proyectos_ctci
  - investigadores_residentes_est
  - centros_y_estaciones_ctci_count
fuentes_oficiales:
  - "ANID DataCiencia — Cartera CTCi Aysén"
  - "CORFO Innova Aysén — Portafolio Regional"
  - "CIEP / Universidad de Aysén — Gestión del Conocimiento Territorial"
updated_at: "2026-11-25"
tags:
  - aysen-sistemico
  - adr
  - hub-x
---

# ADR-006 — Implementación del Workflow LLM-Wiki de Karpathy Conectado a Obsidian Vault

## Síntesis Compilada (Consultor IA)

Para superar la amnesia entre sesiones de los agentes LLM sin poner en riesgo la integridad de las 245 variables comunales (226 numéricas) y 18 Barrios ACS del Data Lake, Aysén Sistémico implementa el patrón `llm-wiki` de Andrej Karpathy bajo una arquitectura dual: los vectores cuantitativos permanecen inmutables en `scripts/build_aysen_hubs_bundle.cjs` y `data/aysen_hubs_data.js`, mientras que el conocimiento semántico, causal y regulatorio se compila en `wiki/` (77 notas Markdown interconectadas con YAML frontmatter para Obsidian Dataview, `wiki/index.md` y `wiki/log.md`). El puente `scripts/obsidian_wiki_bridge.cjs` sincroniza bidireccionalmente la carpeta `wiki/` con el Vault de Obsidian del autor en Google Drive (`Aysen_Sistemico/`), valida 5 invariantes deterministas (`--lint`) y compila las síntesis editadas en Obsidian hacia `data/aysen_wiki_compiled.js` (`--compile`), hidratando en vivo a `window.OmniRouteClient`.

## Contexto, Decisión e Implicancias de Ingeniería

- **Contexto del Problema**: El conocimiento cualitativo sobre mecanismos legales, historia institucional y lectura territorial necesita evolucionar continuamente en el entorno PKM del autor (Obsidian) y reflejarse en el Consultor Web.
- **Decisión Arquitectónica**: Adoptar la regla «Extend, Don't Create» sobre una ontología cerrada de 77 páginas (`index`, `log`, 10 `hubs`, 10 `comunas`, 41 `nodos`, 8 `conceptos`, 6 `adr`) con compilación determinista hacia `window.AYSEN_WIKI_COMPILED`.
- **Consecuencias y Verificación**: Edición fluida en Obsidian Graph View, cero enlaces rotos, cero páginas huérfanas y actualización automática del Consultor IA.

## Indicadores Comunales Verificados

| Comuna | Total Proyectos de Ciencia e Innovación (ANID + CORFO) (proyectos) | Investigadores Residentes Estimados | Centros Científicos y Estaciones de Campo CTCi (centros) |
| --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 102 | 91 | 6 |
| [[comunas/lago_verde|Lago Verde]] | 2 | 1 | 1 |
| [[comunas/aysen|Aysén]] | 31 | 14 | 2 |
| [[comunas/cisnes|Cisnes]] | 11 | 4 | 1 |
| [[comunas/guaitecas|Guaitecas]] | 4 | 2 | 1 |
| [[comunas/chile_chico|Chile Chico]] | 8 | 3 | 1 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 5 | 2 | 1 |
| [[comunas/cochrane|Cochrane]] | 7 | 3 | 1 |
| [[comunas/ohiggins|O'Higgins]] | 3 | 1 | 1 |
| [[comunas/tortel|Tortel]] | 6 | 3 | 1 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hubs Impactados**: [[hubs/hub_04_gobernanza|Hub IV]] · [[hubs/hub_10_ctci|Hub X]]
- **Comunas de Referencia**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]]
- **Conceptos Vinculados**: [[conceptos/ecosistema_ctci_ciencia|ecosistema_ctci_ciencia]] · [[conceptos/financiamiento_municipal|financiamiento_municipal]]
