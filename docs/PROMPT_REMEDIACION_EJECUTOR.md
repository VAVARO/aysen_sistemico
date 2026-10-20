# PROMPT DE IMPLEMENTACIÓN — Remediación SUPERFORECAST (Aysén)

> **Para el modelo ejecutor (barato / flash).** Este documento es autocontenido.
> Ejecuta las tareas en orden. No improvises fuera de lo que está escrito.
> No leas archivos que no aparezcan aquí por ruta explícita.

---

## 0. Contexto mínimo que necesitas

- **Repositorio**: `C:\AGY\SUPERFORECAST` (rama `main`).
- **Proyecto**: plataforma estática de datos territoriales de la Región de Aysén.
  HTML/CSS/JS vanilla, sin build de Node en producción, costo de infraestructura $0.
- **Autor**: Álvaro Contreras Barrios.
- **Python**: usa SIEMPRE la ruta explícita `C:\Users\alvar\.local\bin\python3.11.exe`.
  No asumas `python`, `py` ni `uv` en el `PATH`.
- **Shell**: el entorno corre bash (git-bash/MSYS), no PowerShell. Usa sintaxis POSIX.

### Reglas innegociables (romper cualquiera invalida el trabajo)

1. **Cero emojis** en interfaz, código, comentarios y mensajes de commit.
2. **Cero autores académicos** citados (Jackson, Hawe, Ulrich, Beer, etc.) y cero
   relaciones causales inventadas.
3. **Paleta fija**: cobalto `#00357f` / `#0059c5`; papeles `#ffffff`, `#fcf9f8`,
   `#f4efec`; tintas `#1c1b1b`, `#4a4745`.
4. **Tipografías fijas**: Playfair Display (serif), Inter (sans), JetBrains Mono (datos).
5. **No renombres ni elimines IDs contractuales del DOM.** Las suites de pruebas
   dependen de ellos: `#repoHealthBadge`, `#healthScore`, `#btnModeDesktop`,
   `#btnModeProjector`, `#crossAlertBanner`, `#crossAlertTitle`, `#crossAlertText`,
   `#miniChart`, `#crossChart`, `#concept-drawer`, `#global-search-input`,
   `#workspaceWindowTabs`, y los patrones `btnMinCard-*`, `btnMaxCard-*`, `btnDelCard-*`.
6. **Cero saturación**: no agregues tarjetas, selectores ni tablas nuevas "por si acaso".
   Cada elemento en pantalla debe justificar su valor.
7. **No reescribas los datos.** No toques `data/systemic/*.json` salvo donde se indique
   explícitamente (Tarea 5).

### Comando de verificación (lo correrás varias veces)

```bash
cd /c/AGY/SUPERFORECAST
PY="/c/Users/alvar/.local/bin/python3.11.exe"
"$PY" scripts/test_fuentes_integridad.py        # 37 tests
"$PY" tests/test_e2e_requirements.py            # 58 tests
"$PY" tests/test_laboratorio_audit.py           # 7 tests
"$PY" tests/test_laboratorio_health.py          # 6 tests
"$PY" tests/test_portal_health.py               # 5 tests
"$PY" tests/verify_m1_editorial.py              # 8 checks
"$PY" scripts/validate_data_lake.py --all
node scripts/build_aysen_hubs_bundle.cjs
```

---

## TAREA 1 — [P0] Restaurar la API key de CARTO (regresión activa)

**Problema.** Un agente anterior borró la constante `CARTO_API_KEY` de los tres
archivos que montan mapas Leaflet. Hoy los tres cargan los tiles de CARTO Voyager
sin clave, lo que degrada el servicio a modo anónimo con límite de tasa y marca de
agua. El test `test_02_carto_voyager_with_key` en
`scripts/test_fuentes_integridad.py:680` ya está **fallando** por esto
(1 de 37 tests en rojo).

**La clave es:** `cb1_26jf_1_b3c8a2bb8884ddd6439f3456`

Hay exactamente **3 sitios** que corregir. En cada uno, el estado actual es una
llamada `L.tileLayer` sin el parámetro `?key=`, y debes volver al patrón con
constante + template literal.

### 1.1 — `mapa_territorial.html` (alrededor de la línea 4740)

Estado actual:

```javascript
        // CARTO Basemap with verified API key (clean tiles without watermark)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
```

Debe quedar:

```javascript
        // CARTO Basemap with verified API key (clean tiles without watermark)
        const CARTO_API_KEY = 'cb1_26jf_1_b3c8a2bb8884ddd6439f3456';
        L.tileLayer(`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`, {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
```

Nota: las comillas simples pasan a **backticks**. Si no lo haces, `${CARTO_API_KEY}`
se enviaría como texto literal a CARTO.

### 1.2 — `laboratorio.html` (alrededor de la línea 7314)

Mismo cambio, respetando la indentación de 10 espacios de ese bloque y el `maxZoom: 19`.
Este `L.tileLayer` está dentro de una función que se ejecuta por cada ventana de mapa,
así que declara la constante **fuera** del cuerpo que se repite, o usa `const` dentro
del mismo scope de la función (no en el scope global del archivo, para no colisionar).

### 1.3 — `js/plataforma_aysen.js` (alrededor de la línea 3044)

Mismo cambio. Ojo: aquí el objetivo es `AppState.mapInstance`, no `map`, y el
`maxZoom` es **18**, no 19. No lo uniformes.

```javascript
    // Basemap CARTO Voyager con API key
    const CARTO_API_KEY = 'cb1_26jf_1_b3c8a2bb8884ddd6439f3456';
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 18
    }).addTo(AppState.mapInstance);
```

### Verificación de la Tarea 1

```bash
cd /c/AGY/SUPERFORECAST
grep -rn "cb1_26jf_1_b3c8a2bb8884ddd6439f3456" --include='*.html' --include='*.js' . | grep -v node_modules
# Debe devolver exactamente 3 líneas: mapa_territorial.html, laboratorio.html, js/plataforma_aysen.js

grep -rn "cartocdn.com/rastertiles/voyager" --include='*.html' --include='*.js' . | grep -v node_modules | grep -v "key="
# Debe devolver 0 líneas (ningún tileLayer sin clave)

"/c/Users/alvar/.local/bin/python3.11.exe" scripts/test_fuentes_integridad.py
# Debe terminar con 37/37 y exit code 0
```

**Criterio de término**: las 3 ocurrencias presentes, cero `tileLayer` sin `key=`,
y la suite de 37 tests en verde.

---

## TAREA 2 — [P0] El marcador de salud miente cuando hay tests rojos

**Problema.** `scripts/test_fuentes_integridad.py` imprime
`REPOSITORY STATUS: OPERATIONAL (OVERALL HEALTH SCORE: 100.0%)` aunque haya fallas.
En la corrida actual imprimía 100% con 1 de 37 tests en rojo. El exit code sí era 1,
pero el texto humano es el que la gente lee, y dice lo contrario.

**Qué hacer.** En `scripts/test_fuentes_integridad.py`, en el bloque final que arma
el resumen (cerca de las líneas 795–806, donde están los `sys.exit(1)` / `sys.exit(0)`):

1. Calcula el score real: `score = (tests_ejecutados - fallas - errores) / tests_ejecutados * 100`.
2. Si hay al menos una falla o error, el estado debe ser `DEGRADED`, nunca `OPERATIONAL`.
3. Imprime el conteo explícito: `TESTS: 36/37 PASS · 1 FAIL`.

No cambies la lógica de los tests ni el formato del encabezado de cada suite; sólo
el bloque de resumen final.

**Criterio de término**: con la Tarea 1 aplicada imprime `37/37` y `OPERATIONAL`;
si introduces una falla a propósito (y luego la revieres), imprime `DEGRADED` y un
score menor a 100.

---

## TAREA 3 — [P0] No existe CI: la regresión de CARTO pasó inadvertida

**Problema.** El repositorio tiene 11+ suites de pruebas y ninguna automatización.
Por eso un borrado de una API key sobrevivió a un commit. No hay `.github/`.

**Qué hacer.** Crea `.github/workflows/verificacion.yml`:

- Se dispara en `push` y `pull_request` sobre `main`.
- Corre en `ubuntu-latest` con `actions/setup-python@v5` (Python `3.11`) y
  `actions/setup-node@v4` (Node `20`).
- Pasos, en este orden, cada uno como `run` independiente para que el log diga
  cuál falló:
  1. `node scripts/build_aysen_hubs_bundle.cjs`
  2. `python scripts/validate_data_lake.py --all`
  3. `python scripts/test_fuentes_integridad.py`
  4. `python tests/test_e2e_requirements.py`
  5. `python tests/test_laboratorio_audit.py`
  6. `python tests/test_laboratorio_health.py`
  7. `python tests/test_portal_health.py`
  8. `python tests/verify_m1_editorial.py`
- **Sin `continue-on-error`.** El workflow debe fallar si cualquier paso falla.
- Un paso final `git diff --exit-code data/` que falle si la compilación del bundle
  dejó el árbol sucio (eso significaría que `aysen_hubs_data.js` versionado no
  corresponde a sus fuentes).

**Advertencia**: en el repositorio, correr `scripts/test_fuentes_integridad.py`
reescribe `data/data_health_report.json`, que está versionado. Antes de agregar el
paso `git diff --exit-code data/`, mueve ese reporte a una ruta ignorada o agrégalo
a `.gitignore`; si no, el CI fallará siempre por una razón falsa.

**Criterio de término**: el archivo existe, es YAML válido
(`python -c "import yaml,sys; yaml.safe_load(open('.github/workflows/verificacion.yml'))"`),
y no contiene `continue-on-error`.

---

## TAREA 4 — [P1] Dependencias de CDN sin fijar (riesgo de cadena de suministro)

**Problema.** Un sitio estático que debe durar años carga librerías sin versión fija:

| Dónde | Qué | Riesgo |
|---|---|---|
| `index.html:24`, `laboratorio.html:23`, `mapa_territorial.html:1869`, `portal.html:11` | `https://cdn.jsdelivr.net/npm/chart.js` | **Sin versión.** Un major de Chart.js rompe los gráficos sin que nadie toque el repo |
| `index.html:24` | `https://cdn.tailwindcss.com` | CDN de Tailwind: es una build de desarrollo, explícitamente no apta para producción |
| `index.html:21` | `https://d3js.org/d3.v7.min.js` | Versión fijada, pero sin SRI |
| `laboratorio.html:24-25` | `unpkg.com/leaflet@1.9.4` | Versión fijada, sin SRI |

**Qué hacer.**

1. Fija Chart.js a una versión exacta en los 4 archivos:
   `https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js`
   Verifica en el navegador o con `curl -I` que la URL responde 200 antes de commitear.
2. Agrega `integrity` y `crossorigin="anonymous"` a Chart.js, D3 y Leaflet.
   Obtén cada hash con:
   ```bash
   curl -sL "<url>" | openssl dgst -sha384 -binary | openssl base64 -A
   ```
   No inventes los hashes. Si no puedes calcularlos, deja un comentario
   `<!-- TODO SRI: hash pendiente -->` y repórtalo, pero no pongas un valor falso.
3. Sustituye el CDN de Tailwind. Elige **una** de estas dos y dilo en el reporte:
   - (a) Extrae las clases de Tailwind realmente usadas en `index.html` a reglas CSS
     propias en `js/plataforma_aysen.css` y elimina el `<script>` del CDN.
   - (b) Si (a) es demasiado grande para una pasada, deja el CDN pero agrega un
     comentario con la razón y marca la deuda en `AGENTS.md`.

**Criterio de término**: ningún `<script src>` de librería sin versión; las 5 páginas
siguen cargando y sus suites de salud siguen en verde.

---

## TAREA 5 — [P1] Seis fuentes oficiales están caídas

**Problema.** El proyecto declara trazabilidad institucional para 31 nodos, pero
6 de las URLs del catálogo ya no existen. Verificado por sondeo directo:

| Nodo | URL en `data/systemic/provenance_catalog.json` | Falla |
|---|---|---|
| #4 Visitantes CONAF | `https://www.conaf.cl/parques-nacionales/visitanos/estadisticas-de-visitacion/` | HTTP 404 |
| #18 Inversión FNDR | `https://datos.dipres.gob.cl/` | DNS no resuelve |
| #21 Concesiones mineras | `https://www.sernageomin.cl/catastro-minero/` | HTTP 404 |
| #22 Suelo fiscal | `https://ide.patrimonio.cl/` | DNS no resuelve |
| #26 Seguridad / delitos | `https://cead.spd.gov.cl/` | DNS no resuelve |
| #29 Especies invasoras | `https://especies-invasoras.mma.gob.cl/` | DNS no resuelve |

**Qué hacer.** Para cada uno de los 6 nodos, en `data/systemic/provenance_catalog.json`:

1. Busca la URL oficial vigente del mismo organismo y el mismo dato.
   **Verifícala** con `curl -sI -A "Mozilla/5.0" "<url>"` antes de escribirla.
   Si devuelve 200, sirve. Si no la encuentras, deja la actual y marca
   `"sourceUrlStatus": "ROTA_PENDIENTE_REVISION"`.
2. Conserva la anterior en un campo nuevo `"sourceUrlPrevious"`.
3. **No cambies los valores de datos** de esos nodos. Sólo la trazabilidad.

**Criterio de término**: los 6 nodos tienen `sourceUrlPrevious`, y cada
`sourceUrl` nueva está verificada con 200 o marcada como pendiente.
`validate_data_lake.py --all` sigue en verde.

---

## TAREA 6 — [P1] `collectionDate` no es una fecha procesable

**Problema.** Los 31 nodos guardan la fecha de corte como texto libre
("Catastro Registro Nacional SERNATUR · Corte Septiembre 2026",
"Decreto Exento SUBPESCA N° 202500242 · Dic. 2025"). **0 de 31** son parseables
como fecha ISO. Eso impide calcular automáticamente qué dato está vencido.

**Qué hacer.** En `data/systemic/provenance_catalog.json`, para cada uno de los
31 nodos, **agrega** dos campos junto a los existentes (no borres `collectionDate`,
que es el texto editorial que se muestra en el drawer):

```json
"collectionDateISO": "2026-09-01",
"updateFrequencyDays": 31
```

- `collectionDateISO`: deriva la fecha del texto que ya está. Si el texto sólo dice
  mes y año, usa el día 01. Si no hay forma de inferirla, usa `null`.
- `updateFrequencyDays`: convierte `updateFrequency` a días enteros, así:
  Horario/Continuo/Tiempo real = 1 · Semanal = 7 · Mensual = 31 · Trimestral = 92 ·
  Semestral = 184 · Anual = 366 · Bienal = 731 · Cuatrienal = 1461 ·
  Quinquenal = 1826 · Decenal/Censal = 3653 · Plurianual = 1461.
  Para cadenas compuestas usa **el valor más corto** (ej.
  `"Decenal (Censo) / Bienal (CASEN)"` → `731`, porque CASEN se actualiza antes).

**Criterio de término**: los 31 nodos tienen ambos campos; el JSON es válido
(`python -c "import json;json.load(open('data/systemic/provenance_catalog.json',encoding='utf-8'))"`).

---

## TAREA 7 — [P1] Series históricas interpoladas presentadas como observadas

**Problema.** `scripts/ingesta/build_historical_raw_data.py` genera las series
anuales 2015–2026 por **interpolación lineal** entre valores ancla
(`interpolate_linear`, línea 636, usada en `build_comuna_series_wp02` y
`build_comuna_series_wp03`). Los años intermedios no son observaciones: son
estimaciones. Sin embargo el frontend las muestra junto a datos reales sin
distinguirlas, y la documentación afirma "100% datos verificados".

Esto choca de frente con el principio de *Cero Relaciones Causales Inventadas*.
No es un bug de código: es un problema de honestidad del dato.

**Qué hacer (no borres nada, etiqueta).**

1. En `build_historical_raw_data.py`, en el `dict` de cada punto de serie generado
   por interpolación, agrega la clave `"origen": "interpolado"`. Para los años que
   provienen de un valor ancla real (los que el código fija explícitamente, como
   `cfg["bt1_2024"]`, `cfg["net_pct_2024"]`, `cfg["saidi_2024"]`, `cfg["saifi_2024"]`),
   usa `"origen": "observado"`.
2. En el drawer de procedencia (`index.html`, sección del `#concept-drawer`), cuando
   una serie contenga puntos con `origen === "interpolado"`, muestra una línea de
   texto sobria bajo el gráfico, en JetBrains Mono, tono `#4a4745`:
   `Serie reconstruida por interpolación entre años ancla. Puntos observados: <n> de <total>.`
   Sin iconos, sin color de alarma, sin caja nueva.
3. En `README.md` y `AGENTS.md`, reemplaza cualquier afirmación de
   "100% datos verificados" por una formulación exacta, por ejemplo:
   "Datos institucionales con trazabilidad declarada por nodo; las series anuales
   intermedias de WP_02 y WP_03 están reconstruidas por interpolación entre años ancla."

**Criterio de término**: ningún punto interpolado carece de `"origen"`; el drawer
declara la reconstrucción; la documentación ya no afirma verificación total.

---

## TAREA 8 — [P2] UX del Laboratorio Sistémico (`laboratorio.html`)

**Diagnóstico medido** sobre el archivo (8.901 líneas):

| Señal | Valor | Problema |
|---|---|---|
| `<button>` | 88 | Densidad de controles altísima para un lienzo que exige foco |
| `aria-*` | 25 | Menos de un atributo por cada 3 botones |
| `role=` | 8 | Menús y diálogos sin rol semántico |
| `tabindex` | 2 | El lienzo es prácticamente inoperable por teclado |
| `@media` | 3 | Apenas 3 breakpoints para una app de este tamaño |
| Deshacer / rehacer | **0** | No existe |
| `confirm()` | 2 | Única red de seguridad ante acciones destructivas |
| Atajos de teclado | 2 (`Escape`, `Enter`) | Sin atajos de lienzo |

Implementa estas seis correcciones. **No agregues controles nuevos a la barra**:
el objetivo es reducir fricción, no sumar botones.

### 8.1 — Deshacer / rehacer (la más importante)

Hoy se puede borrar una ventana o reiniciar el lienzo entero y no hay vuelta atrás;
el único resguardo son dos `confirm()` (líneas 5047 y 8419). En un lienzo infinito
con arrastre, un clic accidental destruye trabajo.

- Implementa una pila de historial sobre el estado que ya se serializa en
  `localStorage` bajo la clave `AYSEN_STUDIO_STATE` (líneas 8152–8160).
- Profundidad 25 estados. Guarda un snapshot **antes** de: crear, borrar, duplicar,
  mover, redimensionar ventana, conectar/desconectar, aplicar filtro y limpiar lienzo.
- Atajos `Ctrl+Z` / `Ctrl+Shift+Z` (y `Cmd` en Mac).
- Cuando exista historial, **reemplaza los dos `confirm()`** por la acción directa
  más un aviso efímero (toast) de 5 segundos con un enlace `Deshacer`.
  Un `confirm()` bloqueante por cada borrado es peor UX que un deshacer confiable.

### 8.2 — Atajos de teclado del lienzo

Añade, y documéntalos en un popover accesible con la tecla `?`:

| Tecla | Acción |
|---|---|
| `Supr` / `Backspace` | Eliminar ventana seleccionada |
| `Ctrl+D` | Duplicar ventana seleccionada |
| `F` | Encuadrar todo (zoom to fit) |
| `Barra espaciadora` + arrastre | Desplazar el lienzo |
| `Ctrl+0` | Restablecer zoom al 100% |
| `Tab` | Ciclar entre ventanas |
| `Escape` | Cerrar panel/menú activo (ya existe, consérvalo) |

### 8.3 — Accesibilidad de los 88 botones

- Todo botón que sólo muestre un glifo (`[–]`, `[+]`, `[×]`, `→`, `←`, `↗`) necesita
  `aria-label` en español describiendo la acción.
- `#canvasContextMenu`, `#addCardDropdownMenu`, `#projectMenuDropdown` y
  `#smartPopover` necesitan `role="menu"` con hijos `role="menuitem"`, navegación por
  flechas y cierre con `Escape`.
- `#panelCatalogo`, `#panelMetacognicion` y los modales necesitan `role="dialog"`,
  `aria-modal="true"`, `aria-labelledby` apuntando a su título, y atrapar el foco
  mientras están abiertos.
- Mantén el foco visible: contorno de 2px en `#0059c5`. No uses `outline: none`
  sin un reemplazo visible.

### 8.4 — Unificar las 4 rutas para crear una tarjeta

Hoy hay cuatro caminos distintos para lo mismo: `#btnAddChart` (dropdown),
`#ctxNewChart` (menú contextual), `#btnHeroInit` (estado vacío) y `#btnMobNavAdd`
(barra móvil). Cada uno con su propio manejador.

- Extrae una única función `crearTarjeta(tipo, origen)` y haz que los cuatro puntos
  de entrada la llamen. No elimines ninguno de los cuatro accesos (son contextos
  legítimos distintos), pero que compartan comportamiento, validación y registro
  en el historial de deshacer.

### 8.5 — El estado vacío no enseña a usar la herramienta

`#heroEmptyCanvas` ofrece "Cargar Escenario Comunal", que salta directo a un
escenario ya armado (`loadScenario('salmon_inversion')`). El usuario nunca aprende
el gesto central del lienzo: arrastrar una variable del catálogo a la tarjeta.

- Reemplaza el contenido del estado vacío por tres pasos numerados, en texto sobrio,
  sin iconos ni ilustraciones:
  1. `Abre el catálogo de variables` — con el botón que enfoca `#panelCatalogo`.
  2. `Arrastra una variable al lienzo` — con una animación CSS discreta de 2s en bucle
     que muestre el gesto (respeta `prefers-reduced-motion`).
  3. `Conecta dos tarjetas para cruzarlas` — texto explicativo.
- Conserva "Cargar Escenario Comunal" como enlace secundario, no como acción primaria.

### 8.6 — Responsive real

Con 3 `@media` para 8.901 líneas, el lienzo infinito en móvil es inoperable.

- Define breakpoints en 1280px, 1024px, 768px y 480px.
- Bajo 768px: el lienzo pasa a una **lista vertical apilada** de tarjetas, no a un
  lienzo con paneo. Un canvas espacial infinito no funciona con el pulgar.
- `#mobileStudioNav` debe tener objetivos táctiles de 44×44px como mínimo.
- Verifica con `tests/test_mobile_responsive_e2e.py` (7 tests) al terminar.

**Criterio de término de la Tarea 8**: deshacer/rehacer funciona en las 8 acciones
listadas; los atajos responden; cero botones de glifo sin `aria-label`; los cuatro
puntos de entrada llaman a `crearTarjeta`; y
`tests/test_laboratorio_audit.py`, `tests/test_laboratorio_health.py` y
`tests/test_mobile_responsive_e2e.py` siguen en verde.

---

## TAREA 9 — [P2] La cabecera global está duplicada en 5 páginas

**Problema.** `AGENTS.md` exige una cabecera idéntica de 56px en todas las páginas,
pero el marcado está copiado a mano en `portal.html`, `index.html`, `laboratorio.html`,
`sistemas_complejos.html` y `mapa_territorial.html`. Cinco copias divergen con cada
edición. El CSS también: entre 902 y 2.448 líneas de `<style>` embebido por archivo.

**Qué hacer.**

1. Crea `js/cabecera_global.js` que exporte una función
   `montarCabecera({ tituloModulo, activo })` e inyecte el marcado de la cabecera
   en un `<header class="brand-header">` ya presente en cada página.
   Los 5 enlaces estándar son: `Portada`, `Visualizador de Complejidad`,
   `Datos de Aysén`, `Laboratorio Sistémico`, `LinkedIn ↗`.
2. Crea `js/cabecera_global.css` con los estilos de `.brand-header` y descendientes,
   extraídos de los `<style>` embebidos.
3. Reemplaza el marcado duplicado en las 5 páginas por el contenedor vacío más la
   llamada a `montarCabecera`.
4. **Conserva el soporte de `.dark-mode`** que hoy tiene `portal.html`.

**Riesgo**: `tests/verify_m1_editorial.py` valida la cabecera de `mapa_territorial.html`
por marcado. Si la inyectas por JS, ese test, que lee el HTML estático, fallará.
**Por eso**: deja el marcado estático como contenido inicial del `<header>` y usa el
JS sólo para marcar el enlace activo y el título del módulo. No conviertas la cabecera
en algo que sólo exista tras ejecutar JavaScript.

**Criterio de término**: una sola fuente de verdad para los estilos de cabecera;
las 5 páginas se ven idénticas; `verify_m1_editorial.py` sigue con sus 8 checks en verde.

---

## TAREA 10 — [P3] Higiene del repositorio

1. **`.gitignore`**: agrega `data/systemic/source_watch_manifest.json` (el watchdog de
   fuentes guarda ~20 KB de snapshot por fuente; versionarlo engorda el repo cada ciclo)
   y `data/data_health_report.json` si aplicaste la Tarea 3.
2. **`LICENSE`**: el repositorio no tiene ninguno. Pregunta al autor qué licencia
   quiere antes de crear el archivo. **No elijas una por tu cuenta.**
3. **`tests/`**: hay 40+ archivos de prueba con nombres superpuestos
   (`test_m1_adversarial.js`, `test_m1_adversarial_runtime.cjs`,
   `test_milestone1_adversarial_challenger.py`, `test_m1_challenger_invariants.py`,
   `test_m1_stress_challenge.py`...). No los borres. Crea `tests/README.md` que
   liste, para cada archivo: qué cubre, cómo se corre y si está vigente o es legado.
4. **Documentación desincronizada**: `PROJECT.md` declara el milestone M4 como
   `IN_PROGRESS` y `CONTEXT_NEXT_CHAT.md` dice "3 módulos principales" cuando ya son 4
   (falta el Laboratorio). Actualiza ambos para que coincidan con `AGENTS.md`.

---

## Orden de ejecución y entrega

Ejecuta en este orden y **corre las suites después de cada bloque**:

1. Tarea 1 (CARTO) → suite de 37 tests debe pasar de 36/37 a 37/37.
2. Tareas 2 y 3 (honestidad del marcador + CI).
3. Tareas 5 y 6 (trazabilidad y esquema de fechas) → `validate_data_lake.py --all`.
4. Tarea 4 (CDN) → suites de salud de cada página.
5. Tarea 7 (etiquetado de interpolación) → recompila el bundle.
6. Tarea 8 (UX Laboratorio) → suites de laboratorio y responsive.
7. Tareas 9 y 10.

### Reporte final obligatorio

Entrega una tabla con una fila por tarea: `Tarea | Estado | Archivos tocados |
Evidencia (salida real del comando de verificación)`.

- Si una tarea no se pudo completar, dilo explícitamente y explica qué bloqueó.
- **No inventes salidas de comandos.** Pega la salida real o declara que no la corriste.
- No hagas `commit` ni `push` salvo que el autor lo pida.
