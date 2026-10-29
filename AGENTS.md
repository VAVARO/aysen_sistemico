# Plataforma y Base de Datos Sistémica de Aysén

Repositorio de datos e inteligencia territorial de la Región de Aysén (10 comunas, 10 Hubs sistémicos `I` al `X`, 39 nodos satélites `#01` al `#39`, 10 paquetes de trabajo `WP_01` al `WP_10`). Costo de infraestructura: **$0** (archivos estáticos JSON/CSV, HTML/CSS/JS vanilla). Autor: **Álvaro Contreras Barrios**.

## Arquitectura de la Plataforma (4 Módulos Principales — Identidad "Cuaderno Editorial y Cartográfico Austral")
- **Cabecera Global Unificada (56px)** en las 4 páginas: Barra superior de 3px con gradiente cobalto (`linear-gradient(90deg, #00357f, #0059c5, #00357f)`), fondo `rgba(252, 249, 248, 0.92)` con `backdrop-filter: blur(16px)` y borde inferior `1px solid rgba(28, 27, 27, 0.09)`. Bloque izquierdo: dot cobalto 9px + autor `Álvaro Contreras Barrios` (Playfair Display 1.2rem/700) + `|` + título corto del módulo en español. Bloque derecho: 5 enlaces estándar (`Portada`, `Visualizador de Complejidad`, `Datos de Aysén`, `Laboratorio Sistémico`, `LinkedIn ↗`).
- **Capa Transversal de Accesibilidad**: `css/apple-design.css` (foco visible cobalto, `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast`).

1. **[portal.html](file:///g:/Mi%20unidad/AGY/SUPERFORECAST/portal.html) (Home / Portada Principal)**:
   - Lienzo a pantalla completa con metamorfosis vectorial continua de **10 postales icónicas de Aysén** (128 capas × 256 vértices = 32.768 vértices por postal).
   - Navegación Snap-scroll (*snap-to-section* 100vh): Sección 1 (Hero con título y selector de pips), Sección 2 (`¿Qué es un Sistema Complejo Dinámico?`), Sección 3 (`¿Por qué hacemos esto?`), Sección 4 (`¿Qué encontrarás acá?`).
   - Cabecera unificada con soporte modo oscuro (`.dark-mode`).
2. **[sistemas_complejos.html](file:///g:/Mi%20unidad/AGY/SUPERFORECAST/sistemas_complejos.html) (Visualizador de Complejidad)**:
   - Explorador pedagógico de las **16 propiedades de sistemas complejos** (marco CECAN) con simulaciones interactivas en canvas.
   - Panel de lectura editorial bilingüe (ES / EN) con sincronización dinámica de cabecera y botón de retorno `← Índice (16)`.
3. **[index.html](file:///g:/Mi%20unidad/AGY/SUPERFORECAST/index.html) (Data Hub e Inteligencia Territorial)**:
   - Data Lake local empaquetado: 10 Hubs equilibrados (`turismo`, `salmonicultura`, `energia`, `gobernanza`, `inversion`, `social`, `biodiversidad`, `salud`, `cultura`, `ctci`), 39 nodos temáticos, 10 comunas de Aysén.
   - 2 Vistas exclusivas sin saturación: **Mapa de Hubs (39)** y **Las 10 Comunas (10)** con radios ortogonales sutiles (`rounded-sm`), glifos tipográficos (`→`, `←`, `↗`) y buscador integrado `#global-search-input`.
   - Drawer lateral ejecutivo (`#concept-drawer`): Ficha de procedencia institucional (corte 17-Oct-2026), gráfico acotado (Chart.js), tabla resumen y exportación CSV con UTF-8 BOM (`\uFEFF`). Gestos fluidos de dismiss con rubber-banding y momentum.
   - Grafo D3 interactivo con enlaces vertebrales (backbone), radios satélites homogéneos (`r: 13`) y barra plana superior de filtros.
4. **[laboratorio.html](file:///g:/Mi%20unidad/AGY/SUPERFORECAST/laboratorio.html) (Laboratorio Sistémico — Estudio Cartográfico 2D)**:
   - Lienzo Espacial Infinito 2D interactivo (estilo Miro/Mural) con ventanas flotantes libres de tamaño dinámico.
   - Controles técnicos monocromáticos sobrios en JetBrains Mono (`[–]`, `[+]`, `[×]`) preservando IDs contractuales (`btnMinCard-*`, `btnMaxCard-*`, `btnDelCard-*`).
   - Barra flotante contextual estilo papel editorial, barra de pestañas de ventanas (`#workspaceWindowTabs`), cross-highlighting reactivo entre tarjetas conectadas, cálculo real de capas Promedio y Tendencia ($R^2$), y tarjetas de reflexión bajo demanda (? Pregunta).
   - Persistencia completa: autoguardado en `LocalStorage`, exportación/importación `.json` y reportes para impresión/PDF.

## Stack y Entorno
- **Python**: Python 3.11+. Ejecutar mediante `python` en PATH o `uv run python`.
- **Node.js**: Node 20+.
- **Frontend**: HTML5 + CSS3 + JS vanilla, Canvas 2D, Chart.js y Leaflet/D3 por CDN. Cero dependencias de Node en producción.
- **Pipeline de Datos**: Compilador estático `node scripts/build_aysen_hubs_bundle.cjs` -> genera `data/aysen_hubs_data.js` (`window.AYSEN_HUBS_DATA`, ~1.2 MB, 10 Hubs, 39 Nodos).
- **Control de Versiones**: Saltos de línea normalizados a LF en `.gitattributes`. Los CSV se exportan con `lineterminator="\n"` y cabecera UTF-8 BOM (`\uFEFF`). Los JSONs se serializan estrictamente sin BOM.

## Economía de Tokens y Context Budgeting
- No leer directorios pesados (`.agents/`, `docs/ideas/`, ni HTMLs de >1.000 líneas completos).
- Usar siempre slice notation con `view_file` (máx. 100–300 líneas específicas) o consultas directas vía python one-liners.
- No cargar `data/aysen_hubs_data.js` en memoria de contexto (consultar vía `provenance_catalog.json` o scripts).
- Si se lanzan subagentes (`flash`), cerrarlos inmediatamente al finalizar con `manage_subagents(Action='kill_all')`.

## Comandos de Verificación Canónicos
- **Compilador de Bundle**: `node scripts/build_aysen_hubs_bundle.cjs`
- **Sincronía de Bundle**: `node scripts/verify_bundle_sync.cjs`
- **Limpieza Anti-Slop de Emojis**: `python scripts/clean_emojis.py`
- **Validador Data Lake (WP_01 a WP_07)**: `python scripts/validate_data_lake.py --all`
- **Suite de Integridad (37 tests)**: `python scripts/test_fuentes_integridad.py`
- **Suite E2E (58 tests)**: `python tests/test_e2e_requirements.py`
- **Suite Portal (5 tests)**: `python tests/test_portal_health.py`
- **Suite Laboratorio Auditoría (7 tests)**: `python tests/test_laboratorio_audit.py`
- **Suite Laboratorio Salud (6 tests)**: `python tests/test_laboratorio_health.py`
- **Suite Editorial M1 (8 checks)**: `python tests/verify_m1_editorial.py`
- **Suite Presets CECAN y NL2Chart (9 tests)**: `python tests/test_cecan_presets_and_nl2chart.py`
- **Suite Mobile Responsive (7 tests)**: `python tests/test_mobile_responsive_e2e.py`
- **Suite Red Anti-Slop (8 tests)**: `python tests/test_no_slop_hub_network.py`
- **Checklist 10 Hubs y 39 Nodos**: `python tests/verify_10_hubs_checklist.py`
- **Suite Pytest Completa (398 tests)**: `python -m pytest tests/`
- **Comprobación de Higiene del Árbol de Trabajo**: `git diff --exit-code -- . ':(exclude)data/data_health_report.json' ':(exclude)data/aysen_hubs_data.js'`

## Mapa de Datos Consolidados (Data Lake: 10 Hubs, 39 Nodos Satélite)
| Hub | Clave / WP | Nodos | Fuentes Institucionales |
|---|---|---|---|
| I. Turismo | WP_06 | 5 (#01–#05) | SERNATUR (sellos Q/S), Subturismo, INE EMAT, CONAF Parques |
| II. Salmonicultura | WP_03 | 5 (#06–#10) | SUBPESCA (745 concesiones), 13 Holdings madres, 42 RUTs filiales, Sernapesca |
| III. Energía | WP_02 | 4 (#11–#14) | CNE (sistemas medianos y aislados, tarifas), SEC, Bencina en Línea |
| IV. Gobernanza | WP_01 | 4 (#15–#18) | SINIM (presupuestos, FCM), BCN, SERVEL (alcaldes 2024–2028), SUBDERE |
| V. Inversión | WP_04 | 4 (#19–#22) | SEA (722 proyectos SEIA), SII (empresas y empleo formal), Banco Central |
| VI. Social | WP_05 | 3 (#23–#25) | MINEDUC (SLEP Aysén), CEAD (seguridad), SAMU, ONEMI/SENAPRED |
| VII. Biodiversidad | WP_07 | 5 (#26–#30) | MMA, CONAF (pisos vegetacionales Luebert, Huemul RCE), SAG, IFOP |
| VIII. Salud | WP_08 | 3 (#31, #38, #39) | DEIS MINSAL (red APS vs hospitales, causas de defunción, camas críticas) |
| IX. Cultura y Patrimonio | WP_09 | 3 (#32–#34) | MinCap (inmuebles patrimoniales, gasto municipal cultura, festividades) |
| X. CTCi e Innovación | WP_10 | 3 (#35–#37) | MinCiencia, ANID (Fondecyt, Fondef, centros CIEP), Corfo Innova Aysén |

## Principios Innegociables de Diseño y UX
1. **Cero Saturación ("Ensalada")**: No construir interfaces con exceso de tarjetas, selectores o tablas simultáneas. Cada elemento en pantalla debe justificar su valor.
2. **Cero Relaciones Causales Inventadas**: Cero citas a autores académicos innecesarios y cero hipótesis no sustentadas por datos fácticos.
3. **Identidad Editorial Austral**:
   - Autor: Álvaro Contreras Barrios.
   - Paleta: Azul Cobalto (`#00357f`, `#0059c5`), fondos claros (`#ffffff`, `#fcf9f8`, `#f4efec`), textos (`#1c1b1b`, `#4a4745`).
   - Tipografía: Playfair Display (Serif), Inter / Space Grotesk (Sans), JetBrains Mono (Datos/Métricas).
   - Cero emojis en interfaz profesional o código fuente.
4. **Contratos DOM y Compatibilidad**: Mantener IDs contractuales (`#repoHealthBadge`, `#healthScore`, `#concept-drawer`, `#miniChart`, etc.) requeridos por las suites de pruebas automatizadas.
