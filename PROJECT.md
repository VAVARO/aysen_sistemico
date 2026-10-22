# Project: Atlas Territorial Prospectivo para la Región de Aysén

## Architecture
- Module/package boundaries, data flow, shared interfaces:
  - Data Layer:
    - `data/comunas_aysen.json`: Official Census 2024, CASEN 2022 SAE, CONAF SNASPE, road connectivity (Ruta 7 km paved vs gravel, barges), critical infrastructure (5 hospitals, 32 postas, 10 aerodromes, 8 border passes) for all 10 comunas.
    - `data/series_prospectivas.json`: Curated 18 strategic dynamic series across the 4 Regional Dilemmas, with historical telemetry and trend projections to 2030-2035, physical bounds, confidence intervals, and 4 Superforecasting questions with verifiable resolution criteria.
    - Legacy assets (`data/estaciones_aysen.json`, `data/cruces_multivariables.json`, `data/cne_precios_aysen.json`, `data/data_health_report.json`) maintained for backwards compatibility.
  - Presentation Layer (`mapa_territorial.html`):
    - 3 Navigation Modes:
      1. Modo Comunas (Radiografía Comunal): Comuna selector/click, human profile card displayed in <200ms, associated physical sensors.
      2. Modo Retos & Proyecciones: Selector for the 4 regional dilemmas, multi-axis `#crossChart` with historical + 2030-2035 projection curves, editorial synthesis in `#crossAlertBanner`.
      3. Modo Descargas: Direct CSV downloads with UTF-8 BOM (`\xef\xbb\xbf`) for Excel compatibility.
    - CARTO Voyager basemap without watermarks via API key `cb1_26jf_1_b3c8a2bb8884ddd6439f3456`.
    - Zero AI Slop: No developer buttons, no 440px/560px pixel buttons, no artificial emergency alarmism, no dense raw math jargon.
    - Preservation of all 9 contractual DOM IDs (`#repoHealthBadge`, `#healthScore`, `#btnModeDesktop`, `#btnModeProjector`, `#crossAlertBanner`, `#crossAlertTitle`, `#crossAlertText`, `#miniChart`, `#crossChart`) plus the 11 station IDs and 4 export functions.
  - Quality & Verification Layer:
    - Automated test harness `scripts/test_fuentes_integridad.py` updated to 100% validate 10 comunas, 18 prospective series, geographic bounds `[-49.3, -43.6]` lat / `[-75.8, -71.0]` lng, mathematical projection consistency, CSV UTF-8 BOM exports, and DOM ID preservation.
    - Passing 100% via `uv run python scripts/test_fuentes_integridad.py`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | 10 Comunas Structural Base | Official Censo 2024, CASEN, ASPE CONAF, connectivity, equipment for all 10 comunas in `data/comunas_aysen.json` | M1 | Survey E1/E3, ORIGINAL_REQUEST R1 |
| 2 | Zero-Null Comunal Records | All 10 comunas populated with non-null, validated records | M1 | Survey E1/E3, ORIGINAL_REQUEST R1/R4 |
| 3 | 18 Strategic Series Curated | 18 dynamic variables curated from 46 audited series in `data/series_prospectivas.json` | M2 | Survey E1/E3, ORIGINAL_REQUEST R2 |
| 4 | Trend Projections 2030-2035 | Monotonic, physically bounded projections with confidence intervals for each series | M2 | Survey E1/E3, ORIGINAL_REQUEST R2/R4 |
| 5 | Superforecasting Regional Questions | 1-2 strategic decision questions with verifiable resolution criteria per dilemma | M2 | Survey E1, ORIGINAL_REQUEST R2 |
| 6 | CARTO Voyager Base Layer | Basemap with active API key `cb1_26jf_1_b3c8a2bb8884ddd6439f3456` without watermarks | M3 | Survey E2, ORIGINAL_REQUEST R3 |
| 7 | Modo Comunas (Radiografía Comunal) | Sub-200ms display of comunal profile (Censo, CASEN, connectivity, CONAF) and territorial sensors | M3 | Survey E2, ORIGINAL_REQUEST R3 |
| 8 | Modo Retos & Proyecciones | 4 regional dilemmas selector with history + 2030 projection curves on `#crossChart` and `#crossAlertBanner` | M3 | Survey E2, ORIGINAL_REQUEST R3 |
| 9 | Modo Descargas (Excel-Compatible CSV) | Direct CSV export with UTF-8 BOM (`\xef\xbb\xbf`) and RFC 4180 formatting | M3 | Survey E2/E3, ORIGINAL_REQUEST R3/R4 |
| 10 | Contractual DOM IDs Preservation | Retain `#repoHealthBadge`, `#healthScore`, `#btnModeDesktop`, `#btnModeProjector`, `#crossAlertBanner`, `#crossAlertTitle`, `#crossAlertText`, `#miniChart`, `#crossChart` in DOM | M3 | Survey E2/E3, ORIGINAL_REQUEST R3 |
| 11 | Zero AI Slop & Editorial Tone | Eradicate pixel buttons, alarmist tooltips, formula clutter, and developer badges | M3 | Survey E2, ORIGINAL_REQUEST R3 |
| 12 | Automated Integrity Test Harness | Extend `scripts/test_fuentes_integridad.py` to validate 10 comunas, 18 series, coordinates, math consistency, CSV BOM | M4 | Survey E3, ORIGINAL_REQUEST R4 |
| 13 | Geographic Bounding Box Invariant | Verify all lat/lng strictly within `[-49.3, -43.6]` lat and `[-75.8, -71.0]` lng | M4 | Survey E3, ORIGINAL_REQUEST R4 |
| 14 | E2E Regression Pass | Ensure 100% pass across all unit tests and regression suites via `uv run python scripts/test_fuentes_integridad.py` | M4 | Survey E2/E3, ORIGINAL_REQUEST R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Base Comunas Aysén (`data/comunas_aysen.json`) | Build official 10 comunas dataset (Censo 2024, CASEN 2022, CONAF, connectivity, critical equipment) with zero nulls | None | DONE |
| M2 | Series Prospectivas (`data/series_prospectivas.json`) | Build 18 strategic series with historical data, projections to 2030-2035, and 4 Superforecasting questions | M1 | DONE |
| M3 | Rediseño Atlas Territorial (`mapa_territorial.html`) | Implement 3 modes (Comunas, Retos & Proyecciones, Descargas), CARTO Voyager key, eradicate AI slop, preserve contractual DOM IDs | M1, M2 | DONE |
| M4 | Arnés de Integridad y Verificación E2E (`scripts/test_fuentes_integridad.py`) | Extend test suite to validate 10 comunas, 18 series, math consistency, CSV BOM, and run full test suites | M1, M2, M3 | DONE |

## Interface Contracts
### `data/comunas_aysen.json` Contract
- Array of 10 objects, strictly keyed by `codigo_comuna` (`CL-XI-01` to `CL-XI-10`) and `comuna_ine` (`11101` to `11303`).
- Properties:
  - `codigo_comuna` (string): e.g. "CL-XI-01"
  - `comuna_ine` (string): e.g. "11101"
  - `nombre` (string): e.g. "Coyhaique"
  - `provincia` (string): e.g. "Coyhaique"
  - `cabecera` (string): e.g. "Coyhaique"
  - `cuenca_principal_bna` (string): e.g. "Cuenca 113 (Río Aysén)"
  - `coordenadas`: { `lat`: float in `[-49.3, -43.6]`, `lng`: float in `[-75.8, -71.0]` }
  - `demografia`: { `censo_2024_poblacion`: integer, `superficie_km2`: float, `densidad_hab_km2`: float }
  - `pobreza_casen`: { `pobreza_ingresos_pct`: float, `pobreza_multidimensional_pct`: float, `fuente`: string }
  - `conservacion_conaf`: { `superficie_protegida_pct`: float, `unidades_snaspe`: array of strings }
  - `conectividad`: { `ruta7_km_pavimentados`: float, `ruta7_km_ripio`: float, `dependencia_barcaza`: string, `descripcion_acceso`: string }
  - `equipamiento_critico`: { `salud_principal`: string, `total_postas_rurales`: integer, `aerodromo_dgac`: string, `paso_fronterizo`: string }
  - `sensores_asociados_ids`: array of integers (matching IDs in `estaciones_aysen.json`)

### `data/series_prospectivas.json` Contract
- Object with `total_series`: 18, `horizonte_proyeccion`: "2030-2035", `dilemas_regionales`: 4, and `series`: array of 18 series objects.
- Each series object:
  - `id`: string (snake_case, unique)
  - `nombre`: string
  - `dilema_regional`: string ("frio_aire", "conectividad", "fiordos_salmones", "seguridad_hidrica", "demografia_regional")
  - `comuna_ine`: string (or "regional")
  - `codigo_comuna`: string (or "CL-XI-REG")
  - `cuenca_bna`: string
  - `estacion_sensor`: string
  - `coordenadas`: { `lat`: float, `lng`: float }
  - `fuente_institucional`: string
  - `unidad_medida`: string
  - `historico`: array of objects { `fecha`: string (YYYY or YYYY-MM), `valor`: float }
  - `proyeccion_2030_2035`: array of objects { `fecha`: string (YYYY), `valor_proyectado`: float, `limite_inferior`: float, `limite_superior`: float }
  - `pregunta_superforecasting`: { `pregunta`: string, `horizonte`: string, `criterio_resolucion`: string, `fuente_resolutoria`: string }

### `mapa_territorial.html` DOM & Function Contract
- Mandatory DOM IDs: `#repoHealthBadge`, `#healthScore`, `#btnModeDesktop`, `#btnModeProjector`, `#crossAlertBanner`, `#crossAlertTitle`, `#crossAlertText`, `#crossAlertIcon`, `#miniChart`, `#crossChart`, `#itemCat`, `#itemTitle`, `#itemLoc`, `#itemInst`, `#itemFreq`, `#itemCode`, `#itemAccess`, `#itemDesc`, `#chartMetricName`, `#detailPanel`, `#drawerCollapseBtn`, `#drawerMiniDock`, `#dockExpandBtn`, `#tabStationView`, `#tabCrossView`, `#viewStationContainer`, `#viewCrossContainer`.
- Basemap: Leaflet `L.tileLayer` with `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_26jf_1_b3c8a2bb8884ddd6439f3456`.
- CSV Export: Prefixed with `\uFEFF` (UTF-8 BOM), columns: `fecha,comuna_ine,lat,lng,unidad,...`.
- Chart cleanup: Call `destroyActiveChart()` before instantiating new charts.

## Code Layout
- `data/comunas_aysen.json` — 10 official comunas database (Owner: M1 Worker)
- `data/series_prospectivas.json` — 18 curated strategic series database (Owner: M2 Worker)
- `mapa_territorial.html` — Atlas Territorial Prospectivo UI (Owner: M3 Worker)
- `scripts/test_fuentes_integridad.py` — Quality and integrity test harness (Owner: M4 Worker)
- `data/estaciones_aysen.json` — Canonical 16 stations dataset (Read-only / baseline)
- `data/cruces_multivariables.json` — Multivariable joins baseline (Read-only / baseline)
- `data/data_health_report.json` — Health status report generated by integrity runner
