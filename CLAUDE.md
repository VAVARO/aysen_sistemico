# Project: Plataforma y Base de Datos Sistémica de Aysén

## Tech Stack
- Frontend: HTML5, CSS3, JavaScript vanilla (ES6+), Canvas 2D.
- External CDNs: Chart.js, Leaflet, D3.js (no local node dependencies in production).
- Backend / Data: Python 3.11+, Node.js 20+ (build compiler & test scripts).
- Data Lake: Static JSON & CSV files UTF-8 (BOM on CSVs, no BOM on JSONs).

## Core Commands
- Compile Data Bundle: `node scripts/build_aysen_hubs_bundle.cjs`
- Verify Bundle Sync: `node scripts/verify_bundle_sync.cjs`
- Clean Emojis: `python scripts/clean_emojis.py`
- Validate Data Lake: `python scripts/validate_data_lake.py --all`
- Run Integrity Suite (37 tests): `python scripts/test_fuentes_integridad.py`
- Run E2E Requirements (58 tests): `python tests/test_e2e_requirements.py`
- Run Pytest Suite (398 tests): `python -m pytest tests/`
- Check Working Tree: `git diff --exit-code -- . ':(exclude)data/data_health_report.json' ':(exclude)data/aysen_hubs_data.js'`

## Architecture & Modules (Cuaderno Editorial y Cartográfico Austral)
1. `portal.html` - Home / Portada Principal con metamorfosis vectorial continua (10 postales icónicas).
2. `sistemas_complejos.html` - Visualizador interactivo de 16 propiedades CECAN de sistemas complejos.
3. `index.html` - Data Hub e Inteligencia Territorial (10 Hubs, 39 nodos satélites, 10 comunas, drawer analítico).
4. `laboratorio.html` - Estudio cartográfico 2D sobre lienzo infinito interactivo.
5. `css/apple-design.css` - Capa transversal de accesibilidad y foco visible cobalto.

## Non-Negotiable Invariants & Boundaries
- Zero AI Slop: Strictly 0 emojis across all UI, source code, JSONs, and CSVs.
- Zero Invented Causality: No citations to arbitrary academic theorists or ungrounded correlations.
- Strict Line Endings: All files committed with LF line endings (`.gitattributes`).
- CSV Exports: UTF-8 BOM (`\uFEFF`) and RFC 4180 format.
- Canonical Data Lake: 10 Hubs (`I` to `X`), 39 Satellite Nodes (`#01` to `#39`), 10 Comunas of Aysén.
- DOM Contract Preservation: Never remove or alter contractual IDs (`#concept-drawer`, `#repoHealthBadge`, `#healthScore`, `#miniChart`, etc.).
