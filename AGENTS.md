# Atlas Territorial Prospectivo de Aysén

Sitio estático (GitHub Pages) que explica la Región de Aysén: sus 10 comunas, sus series
clave y proyecciones a 2030–2035. Es la base de datos para un futuro torneo de
superforecasting. Costo de infraestructura: **$0** (sin servidor, solo JSON/CSV planos).

## Stack
- HTML + JS vanilla en un solo archivo (`mapa_territorial.html`), Leaflet + Chart.js por CDN.
- Mapa base: CARTO Voyager con API key del proyecto (ver `mapa_territorial.html`).
- Datos: JSON en `data/`. Tests: Python estándar (`unittest`) y algunos scripts Node.
- No hay `pyproject.toml`, `package.json` ni repositorio git.

## Comandos
- Suite principal (37 tests, ~20 s, hace pings HTTP reales): `uv run python scripts/test_fuentes_integridad.py`
- Editorial: `uv run python tests/verify_m1_editorial.py` (8 checks)
- E2E: `uv run python tests/test_e2e_requirements.py` (58 tests)
- Ejecutar siempre las tres tras tocar `mapa_territorial.html` o `data/`.
- Los tests de `scripts/` reescriben `data/data_health_report.json`; es normal.

## Mapa del proyecto (cargar solo la sección que corresponda)
| Ruta | Qué es |
|---|---|
| `mapa_territorial.html` | Visor principal (~300 KB). 3 modos: Comunas, Retos y Proyecciones, Descargas |
| `data/comunas_aysen.json` | **10 comunas**: Censo 2024, CASEN 2022 (SAE), CONAF, Ruta 7, equipamiento |
| `data/series_prospectivas.json` | **18 series** curadas, histórico + proyección 2030–2035 + pregunta de forecasting |
| `data/estaciones_aysen.json` | 16 estaciones/sensores georreferenciados (capa de puntos) |
| `data/cruces_multivariables.json` | 3 cruces (clima-salud, criósfera-riesgo, marino-productivo) |
| `data/catalogo_series_aysen.json` | Catálogo de las 46 series auditadas (18 se priorizaron) |
| `data/data_health_report.json` | Generado por el arnés; no editar a mano |
| `scripts/test_fuentes_integridad.py` | Arnés de integridad (suites 1–6) |
| `PROJECT.md` | Especificación del Atlas (la fuente de verdad del diseño) |
| `index.html` | Portada antigua ("Auditoría Agéntica en Vivo"); **no** es el Atlas |

## Convenciones de datos
- Claves: `comuna_ine` (11101…11402), `codigo_comuna` (`CL-XI-01`…`10`), `codigo_cuenca` (BNA).
- Dos series son de alcance regional: `comuna_ine="regional"`, `codigo_comuna="CL-XI-REG"`.
  La serie demográfica usa `dilema_regional="demografia_regional"` (fuera de los 4 dilemas).
- Bounding box de Aysén: lat [-49.3, -43.6], lng [-75.8, -71.0].
- Cero valores nulos. Proyecciones: `limite_inferior <= valor_proyectado <= limite_superior`,
  sin negativos en magnitudes físicas.
- Exportaciones CSV: UTF-8 con BOM (`\uFEFF`) para Excel.

## Convenciones de UI (anti "AI slop")
- Tono editorial: papel `#F7F7F5`, tinta `#141618`, bordes finos, prosa humana en español.
- Prohibido: insignias de autobombo, botones de desarrollador (`440px/560px`), jerga estadística
  cruda (r de Pearson, p-valores) en la vista pública, alarmas artificiales.
- Criterio de éxito: una persona entiende en 10 s qué es una comuna y qué retos enfrenta.
- **IDs del DOM contractuales** (los tests los exigen; ocultarlos, nunca borrarlos):
  `#repoHealthBadge #healthScore #btnModeDesktop #btnModeProjector #crossAlertBanner
  #crossAlertTitle #crossAlertText #miniChart #crossChart`.

## Límites
- No inventar cifras. Si falta un dato oficial, dejarlo marcado como pendiente, no estimarlo en silencio.
- No agregar dependencias ni crecer el peso sin avisar (hosting estático). Medido hoy: HTML 299 KB +
  datos 144 KB ≈ 443 KB. El objetivo original era < 200 KB: **hoy no se cumple**; no empeorarlo.
- No tocar el scoring de los tests para "ponerlos en verde": arreglar el dato o el código.
- Preguntar antes de cambiar el esquema de `data/*.json` (el visor y los tests dependen de él).

## Trampas conocidas
- **Las cifras de comunas/series no están cotejadas contra fuentes oficiales por los tests.**
  Los tests validan estructura y coherencia interna (densidad = población / superficie, rangos),
  no veracidad. Verificar a mano antes de publicar.
- Los tests hacen HTTP real a 10 instituciones; `DEGRADED` por latencia es normal, no un fallo.
- `TEST_INFRA.md` y `TEST_READY.md` son de la fase previa (16 estaciones, Pearson); parcialmente
  obsoletos. `failure_log.txt` es un residuo viejo. No tratarlos como estado actual.
- `.agents/teamwork_run1/` es el historial de la primera corrida multi-agente (cientos de archivos).
  **No cargarlo** salvo que se pida; es contexto de bajo valor y gran tamaño.
- Los `handoff.md` de subagentes son informes, no verdad: contrastar con el código antes de citar.
- Consola de Windows muestra mojibake con acentos; los archivos están en UTF-8 y están bien.

## Estado (2026-10-16)
Hitos 1–4 del plan completos y con tests en verde. Pendiente: revisión visual en navegador,
cotejo de cifras con fuentes oficiales y auditoría independiente (el subagente se cortó por cuota).
