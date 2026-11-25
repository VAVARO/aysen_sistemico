# Project: Plataforma y Base de Datos Sistémica de Aysén

## Tech Stack
- Frontend: HTML5, CSS3, JavaScript vanilla (ES6+), Canvas 2D.
- External CDNs: Chart.js, Leaflet, D3.js (no local node dependencies in production).
- Backend / Data: Python 3.11+, Node.js 20+ (build compiler & test scripts).
- Data Lake: Static JSON & CSV files UTF-8 (BOM on CSVs, no BOM on JSONs).

## Core Commands
- Sincronización Previa Obligatoria: Antes de editar cualquier archivo o hacer git push, ejecutar siempre 'git pull --rebase origin main' y luego 'node scripts/build_aysen_hubs_bundle.cjs' para evitar conflictos con las corridas automáticas de GitHub Actions.
- Compile Data Bundle: `node scripts/build_aysen_hubs_bundle.cjs`
- Verify Bundle Sync: `node scripts/verify_bundle_sync.cjs`
- Clean Emojis: `python scripts/clean_emojis.py`
- Validate Data Lake: `python scripts/validate_data_lake.py --all`
- Run Integrity Suite (37 tests): `python scripts/test_fuentes_integridad.py`
- Run E2E Requirements (58 tests): `python tests/test_e2e_requirements.py`
- Run OmniRoute & Consultor RAG Suite (22 tests): `python tests/test_omniroute_consultor.py`
- Run Pytest Suite (463 tests): `python -m pytest tests/`
- Check Working Tree: `git diff --exit-code -- . ':(exclude)data/data_health_report.json' ':(exclude)data/aysen_hubs_data.js'`

## Architecture & Modules (Cuaderno Editorial y Cartográfico Austral)
1. `portal.html` - Home / Portada Principal con metamorfosis vectorial continua (10 postales icónicas).
2. `sistemas_complejos.html` - Visualizador interactivo de 16 propiedades de sistemas complejos (marco Boehnert et al., 2018).
3. `index.html` - Data Hub e Inteligencia Territorial (10 Hubs, 41 nodos satélites `#01` a `#41`, 30 subcategorías, 236 variables comunales [218 numéricas], 38 fuentes oficiales, 10 comunas, drawer analítico).
4. `laboratorio.html` - Estudio cartográfico 2D sobre lienzo infinito interactivo.
5. `consultor.html` & `js/omniroute_client.js` - Consultor de Datos Territorial con motor RAG en memoria auto-adaptativo a nuevos datos (`buildMemoryIndex`, `refreshMemory`), integrado con `js/nl2chart_engine.js` y `data/nl_lexicon_aysen.json`.
6. `css/apple-design.css` - Capa transversal de accesibilidad y foco visible cobalto.

## Non-Negotiable Invariants & Boundaries
- Zero AI Slop: Strictly 0 emojis across all UI, source code, JSONs, and CSVs.
- Zero Invented Causality: No citations to arbitrary academic theorists or ungrounded correlations.
- Strict Line Endings: All files committed with LF line endings (`.gitattributes`).
- CSV Exports: UTF-8 BOM (`\uFEFF`) and RFC 4180 format.
- Canonical Data Lake: 10 Hubs (`I` to `X`), 41 Satellite Nodes (`#01` to `#41`), 30 subcategories, 236 comuna variables (218 numeric), 38 official sources, 10 Comunas of Aysén.
- DOM Contract Preservation: Never remove or alter contractual IDs (`#concept-drawer`, `#repoHealthBadge`, `#healthScore`, `#miniChart`, etc.).

## LLM Wiki Workflow (Karpathy Pattern + Obsidian Vault)
- **Separación Estricta entre Verdad Numérica Tipada y Wiki Semántica Compilada**:
  - Los vectores cuantitativos (`236` variables [`218` numéricas] × `10` comunas y series históricas 2015–2026) viven en `scripts/build_aysen_hubs_bundle.cjs` y `data/aysen_hubs_data.js` como fuente de verdad matemática inmutable.
  - La carpeta `wiki/` almacena el conocimiento acumulado y compuesto (`77` notas canónicas interconectadas con YAML frontmatter compatible con Obsidian Dataview y `[[wikilinks]]`): `wiki/index.md`, `wiki/log.md`, `10` páginas en `wiki/hubs/`, `10` páginas en `wiki/comunas/`, `41` fichas en `wiki/nodos/`, `8` paquetes conceptuales y entidades territoriales en `wiki/conceptos/` y `6` ADRs en `wiki/adr/`.
- **Comandos Oficiales de la Wiki**:
  - `node scripts/init_and_compile_llm_wiki.cjs`: Regenera/actualiza la estructura base de `wiki/` desde el Data Lake y compila `data/aysen_wiki_compiled.js`.
  - `node scripts/obsidian_wiki_bridge.cjs --lint`: Ejecuta el linter determinista sobre los archivos Markdown de `wiki/` (0 wikilinks rotos, 0 huérfanos, 0 claves inválidas, 0 cifras obsoletas).
  - `node scripts/obsidian_wiki_bridge.cjs --compile`: Compila las síntesis editadas en Obsidian (`wiki/`) hacia `data/aysen_wiki_compiled.js` (`window.AYSEN_WIKI_COMPILED`), hidratando automáticamente `window.OmniRouteClient`.
  - `node scripts/obsidian_wiki_bridge.cjs --sync-to-vault --vault-path "<RUTA_VAULT>"`: Sincroniza `wiki/` hacia la carpeta `Aysen_Sistemico/` del Vault principal de Obsidian del usuario.
  - `node scripts/obsidian_wiki_bridge.cjs --pull-from-vault`: Trae ediciones desde el Vault de Obsidian, ejecuta el Linter y recompila el Consultor.
- **Protocolo Obligatorio para el Agente en cada `Ingest` o Cambio Metodológico**:
  1. Actualizar el vector numérico en `scripts/build_aysen_hubs_bundle.cjs` y regenerar `data/aysen_hubs_data.js`.
  2. Actualizar las páginas afectadas en `wiki/hubs/`, `wiki/comunas/`, `wiki/nodos/` o `wiki/conceptos/` (aplicando siempre *"Extend, Don't Create"*).
  3. Si se tomó una decisión metodológica o arquitectónica nueva, documentarla en `wiki/adr/` y registrar una entrada con prefijo `## [YYYY-MM-DD] ingest|lint|adr | Título` al final de `wiki/log.md`.
  4. Ejecutar `node scripts/obsidian_wiki_bridge.cjs --lint && node scripts/obsidian_wiki_bridge.cjs --compile`.

