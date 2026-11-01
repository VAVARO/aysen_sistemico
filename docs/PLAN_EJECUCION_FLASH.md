# Plan de Remediación Arquitectónica (Argon High -> Argon Medium)

## Regla de Modelo y Ejecución
- **Prohibición estricta de modelos Flash**: Toda delegación se ejecuta exclusivamente con instancias de Argon (`Model='inherit'`).
- **Estándar Cero AI Slop y Cero Emojis**: Sin emojis en HTML/JS/CSS/JSON/Python, sin cajas dentro de cajas, sin citas falsas (`border-left`) en análisis regionales de Aysén y sin menciones a `"Data Lake"` en `sistemas_complejos.html`.

---

## Corrección Quirúrgica 1 · Limpieza Total del Header y Eliminación de la Barra de Ruta
**Archivos**: `js/cabecera_global.js`, `js/cabecera_global.css`, `portal.html`, `sistemas_complejos.html`
1. En `js/cabecera_global.js` y `js/cabecera_global.css`:
   - Eliminar por completo el nodo DOM, estilos y lógica de `.platform-method-strip`, `.method-route-strip`, `#methodological-route-strip` y `"RUTA METODOLÓGICA DE LA PLATAFORMA"`.
   - El header global vuelve a ser una única barra superior limpia de `56px` de altura con el nombre del autor (`Álvaro Contreras Barrios`), el subtítulo del módulo actual y los 5 enlaces de navegación (`Portada`, `Visualizador de Complejidad`, `Datos de Aysén`, `Laboratorio Sistémico`, `LinkedIn ↗`).
2. En `portal.html`:
   - Eliminar el bloque `<nav id="methodological-route-strip" ...>...</nav>`, restaurar `--header-height: 59px;` y eliminar las referencias a `routeStrip` en el sincronizador de modo oscuro.
3. En `sistemas_complejos.html`:
   - Eliminar de `<header class="brand-header">` los controles residuales que colisionaban sobre `"VISUALIZADOR DE COMPLEJIDAD"`: `#btnScrollToAtlas` (`Atlas en Aysén (16) ↓`) y `.lang-switch` (`#langSwitch`, `ES / EN`).
   - Reubicar `#btnBackToGrid` (`← Índice (16)`) dentro de `.stage-controls` en `#detailView` para que solo aparezca dentro del escenario de detalle y jamás en la barra global de `56px`. Proteger los listeners JS (`#langEs`, `#langEn`, `#btnScrollToAtlas`) con comprobaciones de nulidad.

---

## Corrección Quirúrgica 2 · Purga Radical de AI Slop y Falsas Citas en `sistemas_complejos.html`
**Archivo**: `sistemas_complejos.html`
1. Eliminar todos los eyebrows y etiquetas redundantes en `#aysenCecanAtlasSection`:
   - Borrar `"MARCO EPISTEMOLÓGICO CECAN · EVIDENCIA TERRITORIAL AYSÉN"` (`.atlas-header-kicker`).
   - Borrar el recuadro con borde azul `"ATRIBUCIÓN ACADÉMICA CECAN"` (`#atlasIntroCitation` / `.atlas-citation-block`). La referencia `Boehnert, J., Penn, A., Barbrook-Johnson, P., Bicket, M., & Hills, D. (2018). The visual representation of complexity: Definitions, examples & learning points [Poster]. Loughborough University.` debe aparecer de forma sobria como nota académica al pie de la grilla conceptual (`#gridAttributionPill`, sin duplicaciones con borde azul).
   - Borrar la etiqueta `"CATEGORÍA SISTÉMICA:"` (`.atlas-filter-label`), borrar los badges grises al lado de cada número (`.atlas-category-tag`) y borrar las traducciones al inglés en cursiva debajo de cada título (`.atlas-prop-en`).
   - Borrar toda mención a `"Data Lake institucional"` o `"Data Lake"` en los textos visibles de `sistemas_complejos.html`.
2. Eliminar el formato de cita (`border-left`, `padding-left`, fondo gris o cursivas de blockquote) de todos los textos de ejemplos regionales de Aysén.
3. Estructura limpia de cada una de las 16 propiedades en `#aysenCecanAtlasSection`:
   - Un único encabezado sobrio: `#01 Retroalimentación` (`font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; color: #0f172a;`).
   - Un párrafo breve con la definición conceptual y, separado por un salto limpio (sin bordes laterales ni cajas), una oración directa que introduce el caso empírico de Aysén.

---

## Corrección Quirúrgica 3 · Reconstrucción de los 16 Gráficos con `Chart.js` y Estética de `laboratorio.html`
**Archivos**: `sistemas_complejos.html`, `data/cecan_16_presets_aysen.json`
1. Cargar **Chart.js v4.4.1** en el `<head>` de `sistemas_complejos.html`:
   `<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" integrity="sha384-9nhczxUqK87bcKHh20fSQcTGD4qq5GhayNYSYWqwBkINBhOfQLg/P5HG5lF1urn4" crossorigin="anonymous"></script>`
2. Eliminar por completo el generador manual Canvas 2D y las cajas grises `.atlas-canvas-status`.
3. Renderizar cada uno de los 16 gráficos dentro de `<div style="position: relative; height: 260px; width: 100%;"><canvas id="atlas-canvas-XX"></canvas></div>` leyendo datos reales verificados con varianza no nula desde `window.AYSEN_HUBS_DATA`:
   - **Series de tiempo multieje (`line` 2015–2026)**: `#01 Retroalimentación`, `#06 Dominios de estabilidad`, `#08 Dependencia del camino`, `#09 Puntos de inflexión`, `#10 Cambio en el tiempo`, `#12 Impredecibilidad`.
   - **Barras comparativas bivariadas (`bar` por comuna, ordenadas de mayor a menor)**: `#02 Emergencia`, `#03 Autoorganización`, `#04 Palancas y nodos centrales`, `#11 Sistema abierto`, `#14 Control distribuido`, `#15 Sistemas anidados`, `#16 Múltiples escalas y niveles`.
   - **Dispersión con regresión/umbral (`scatter` con plugin de anticolisión de etiquetas)**: `#05 No linealidad`, `#07 Adaptación`, `#13 Factores desconocidos`.
4. Estética idéntica a `laboratorio.html`:
   - `plugins.legend`: `{ display: true, position: 'top', align: 'start', labels: { boxWidth: 10, color: '#334155', font: { family: "'IBM Plex Sans', sans-serif", size: 11 } } }`.
   - `scales.x.title` y `scales.y.title`: `{ display: true, text: '<Indicador (unidad)>', color: '#334155', font: { family: "'IBM Plex Sans', sans-serif", size: 11, weight: '500' } }`, con `ticks` formateados mediante `toLocaleString('es-CL')`.
   - Pie de fuente limpio en 1 sola línea debajo de cada canvas (`font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: #64748b;`):
     `Fuente: [Organismo Oficial exacto] · <a href="laboratorio.html?preset=cecan_XX">Explorar en Laboratorio →</a>`

---

## Corrección Quirúrgica 4 · Revisión Visual y Pruebas Automatizadas (Argon High)
**Archivo**: `tests/test_coherencia_metodologia_y_cecan.py`
- Verificar que `.platform-method-strip`, `.method-route-strip` y `"RUTA METODOLÓGICA DE LA PLATAFORMA"` no existan en ningún archivo.
- Verificar ausencia de colisión en el header de `sistemas_complejos.html`.
- Verificar que las 16 propiedades en `sistemas_complejos.html` instancien gráficos reales con `new Chart(`, tengan `scales.x.title.display: true`, `scales.y.title.display: true`, `plugins.legend.display: true` y datos reales con varianza positiva (cero vectores planos en `0`).
- Verificar ausencia total de `border-left` en los textos de casos de Aysén y ausencia de menciones a `"Data Lake"` en `sistemas_complejos.html`.
