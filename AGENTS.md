# Plataforma y Base de Datos Sistémica de Aysén

Repositorio de datos e inteligencia territorial de la Región de Aysén (10 comunas, 7 Hubs sistémicos, 31 nodos satélites, 7 paquetes WP_01–WP_07). Costo de infraestructura: **$0** (archivos estáticos JSON/CSV, HTML/CSS/JS vanilla). Autor: **Álvaro Contreras Barrios**.

## Arquitectura de la Plataforma (4 Módulos Principales — Identidad "Cuaderno Editorial y Cartográfico Austral")
- **Cabecera Global Unificada (56px)** en las 4 páginas: Barra superior de 3px con gradiente cobalto (`linear-gradient(90deg, #00357f, #0059c5, #00357f)`), fondo `rgba(252, 249, 248, 0.92)` con `backdrop-filter: blur(16px)` y borde inferior `1px solid rgba(28, 27, 27, 0.09)`. Bloque izquierdo: dot cobalto 9px + autor `Álvaro Contreras Barrios` (Playfair Display 1.2rem/700) + `|` + título corto del módulo en español. Bloque derecho: 5 enlaces estándar (`Portada`, `Visualizador de Complejidad`, `Datos de Aysén`, `Laboratorio Sistémico`, `LinkedIn ↗`).
1. **[portal.html](file:///c:/AGY/SUPERFORECAST/portal.html) (Home / Portada Principal)**:
   - Lienzo a pantalla completa con metamorfosis vectorial continua de **10 postales icónicas de Aysén** (128 capas × 256 vértices = 32.768 vértices por postal).
   - Navegación Snap-scroll (*snap-to-section* 100vh): Sección 1 (Hero con título y selector de pips), Sección 2 (`¿Qué es un Sistema Complejo Dinámico?`), Sección 3 (`¿Por qué hacemos esto?`), Sección 4 (`¿Qué encontrarás acá?`).
   - Cabecera unificada con soporte modo oscuro (`.dark-mode`).
2. **[sistemas_complejos.html](file:///c:/AGY/SUPERFORECAST/sistemas_complejos.html) (Visualizador de Complejidad)**:
   - Explorador pedagógico de las **16 propiedades de sistemas complejos** (marco CECAN) con simulaciones interactivas en canvas.
   - Panel de lectura editorial bilingüe (ES / EN) con sincronización dinámica de cabecera y botón de retorno `← Índice (16)`.
3. **[index.html](file:///c:/AGY/SUPERFORECAST/index.html) (Data Hub e Inteligencia Territorial)**:
   - Data Lake local empaquetado: 7 Hubs equilibrados (`turismo`, `salmonicultura`, `energia`, `gobernanza`, `inversion`, `social`, `biodiversidad`), 31 nodos temáticos, 10 comunas de Aysén.
   - 2 Vistas exclusivas sin saturación: **Mapa de Hubs (31)** y **Las 10 Comunas (10)** con radios ortogonales sutiles (`rounded-sm`), glifos tipográficos (`→`, `←`, `↗`) y buscador integrado `#global-search-input`.
   - Drawer lateral ejecutivo (`#concept-drawer`): Ficha de procedencia institucional (corte 17-Oct-2026), gráfico acotado (Chart.js), tabla resumen y exportación CSV con UTF-8 BOM (`\uFEFF`).
   - Grafo D3 interactivo con enlaces vertebrales (backbone), radios satélites homogéneos (`r: 13`) y leyenda filtrable.
4. **[laboratorio.html](file:///c:/AGY/SUPERFORECAST/laboratorio.html) (Laboratorio Sistémico — Estudio Cartográfico 2D)**:
   - Lienzo Espacial Infinito 2D interactivo (estilo Miro/Mural) con ventanas flotantes libres de tamaño dinámico.
   - Controles técnicos monocromáticos sobrios en JetBrains Mono (`[–]`, `[+]`, `[×]`) preservando IDs contractuales (`btnMinCard-*`, `btnMaxCard-*`, `btnDelCard-*`).
   - Barra flotante contextual estilo papel editorial, barra de pestañas de ventanas (`#workspaceWindowTabs`), cross-highlighting reactivo entre tarjetas conectadas, cálculo real de capas Promedio y Tendencia ($R^2$), y tarjetas de reflexión bajo demanda (? Pregunta).
   - Persistencia completa: autoguardado en `LocalStorage`, exportación/importación `.json` y reportes para impresión/PDF.

## Stack y Entorno (Windows)
- **Python**: Usar SIEMPRE la ruta explícita `& "C:\Users\alvar\.local\bin\python3.11.exe"` (no asumir `python` o `uv` en `PATH`).
- **Frontend**: HTML5 + CSS3 + JS vanilla, Canvas 2D, Chart.js y Leaflet/D3 por CDN. Cero dependencias de Node en producción.
- **Pipeline de Datos**: Compilador estático `node scripts/build_aysen_hubs_bundle.cjs` -> genera `data/aysen_hubs_data.js` (`window.AYSEN_HUBS_DATA`, ~196 KB).
- **Economía de Tokens y Context Budgeting**:
  - No leer directorios pesados (`.agents/`, `docs/ideas/`, ni HTMLs de >1.000 líneas completos).
  - Usar siempre slice notation con `view_file` (máx. 100–300 líneas específicas) o consultas directas vía python one-liners.
  - No cargar `data/aysen_hubs_data.js` en memoria de contexto (consultar vía `provenance_catalog.json` o scripts).
  - Si se lanzan subagentes (`flash`), cerrarlos inmediatamente al finalizar con `manage_subagents(Action='kill_all')`.

## Comandos de Verificación Rápida
- **Compilador de Bundle**: `node scripts/build_aysen_hubs_bundle.cjs`
- **Suite E2E (58 tests)**: `& "C:\Users\alvar\.local\bin\python3.11.exe" tests/test_e2e_requirements.py`
- **Suite Portal (5 tests)**: `& "C:\Users\alvar\.local\bin\python3.11.exe" tests/test_portal_health.py`
- **Suite Laboratorio (6 tests)**: `& "C:\Users\alvar\.local\bin\python3.11.exe" tests/test_laboratorio_health.py`
- **Suite de Integridad (37 tests)**: `& "C:\Users\alvar\.local\bin\python3.11.exe" scripts/test_fuentes_integridad.py`
- **Validador Data Lake (WP_01 a WP_07)**: `& "C:\Users\alvar\.local\bin\python3.11.exe" scripts/validate_data_lake.py --all`
- **Suite Editorial (8 checks)**: `& "C:\Users\alvar\.local\bin\python3.11.exe" tests/verify_m1_editorial.py`

## Mapa de Datos Consolidados (Data Lake 100% Verificado)
| Ruta | Contenido |
|---|---|
| `data/aysen_hubs_data.js` | Bundle compilado frontend: 7 Hubs, 31 Nodos, 10 Comunas (`window.AYSEN_HUBS_DATA`) |
| `data/systemic/provenance_catalog.json` | Fichas de trazabilidad y gobernanza institucional para los 31 nodos (corte 17-Oct-2026) |
| `data/comunas_aysen.json` | 10 comunas: Censo 2024 (100.745 hab), CASEN 2022, SNASPE, conectividad Ruta 7 |
| `data/series_prospectivas.json` | 18 series temporales curadas (histórico + proyección 2030–2035) |
| `data/systemic/01_gob_poder_finanzas.json` | WP_01: Alcaldes 2024–2028, presupuestos SINIM, % dependencia FCM, FNDR |
| `data/systemic/02_energia_combustibles_telecom.json` | WP_02: Sistemas eléctricos aislados y medianos, tarifas, leña, combustibles CNE, FOA |
| `data/systemic/03_concesiones_tierra_mar.json` | WP_03: 745 concesiones acuícolas, caletas, minería SERNAGEOMIN, tierra fiscal BBNN |
| `data/raw/territorio_concesiones/holdings_salmoneros_ruts_aysen.json` | Matriz de 12 Holdings Madres y 42 RUTs filiales vinculados a las concesiones |
| `data/systemic/04_inversion_seia_economia.json` | WP_04: 722 proyectos SEIA, empresas/empleo SII por rubro y tamaño, PIB regional |
| `data/systemic/05_social_salud_educacion_riesgos.json` | WP_05: Red DEIS (APS vs Hospitales), SAMU, colegios SLEP, delitos CEAD, volcanes/sismos |
| `data/systemic/06_turismo_sernatur_conaf.json` | WP_06: Prestadores SERNATUR (Q/S), 4 ZOIT, estacionalidad EMAT, visitantes CONAF |
| `data/systemic/07_biodiversidad_flora_fauna_aysen.json` | WP_07: Pisos vegetacionales (Luebert/CONAF), fauna RCE (Huemul, etc.), especies invasoras |
| `data/systemic/csv/*.csv` | 14 planillas CSV con UTF-8 BOM (`\uFEFF`) listas para Excel |

## Principios Innegociables de Diseño y UX
1. **Cero Saturación ("Ensalada")**: No construir interfaces con exceso de tarjetas, selectores o tablas simultáneas. Cada elemento en pantalla debe justificar su valor.
2. **Cero Relaciones Causales Inventadas**: Cero citas a autores académicos (Jackson, Hawe, Ulrich, Beer, etc.) y cero hipótesis no sustentadas por datos fácticos.
3. **Identidad Editorial Austral**:
   - Autor: Álvaro Contreras Barrios.
   - Paleta: Azul Cobalto (`#00357f`, `#0059c5`), fondos claros (`#ffffff`, `#fcf9f8`, `#f4efec`), textos (`#1c1b1b`, `#4a4745`).
   - Tipografía: Playfair Display (Serif), Inter (Sans), JetBrains Mono (Datos/Métricas).
   - Cero emojis en interfaz profesional.
4. **Contratos DOM y Compatibilidad**: Mantener IDs contractuales (`#repoHealthBadge`, `#healthScore`, `#btnModeDesktop`, etc.) requeridos por las suites de pruebas automatizadas.
