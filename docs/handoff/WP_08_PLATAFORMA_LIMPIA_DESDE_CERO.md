# WP_08 — Construcción desde Cero de la Plataforma Sistémica y Relacional de Aysén (`plataforma_aysen.html`) + Corrección de `mapa_territorial.html`

## 1. Diagnóstico y Reglas Estrictas del Usuario
El usuario probó la versión anterior y detectó 4 problemas críticos que debemos resolver de raíz:
1. **El mapa estorbaba y mezclaba capas**: En `mapa_territorial.html` el mapa ocupaba dos tercios de la pantalla de forma permanente y tenía capas cableadas en duro (pasos fronterizos, estaciones, aeródromos) que seguían apareciendo aunque el usuario activara solo el filtro de SEIA.
2. **El modelo relacional tipo Power BI no se apreciaba**: Al estar encerrado en un panel lateral estrecho, no se podía trabajar cómodamente con las tablas y sus llaves.
3. **El buscador y el wizard fallaban**: Porque en `mapa_territorial.html` las variables `comunasData`, `map` y `activeComuna` estaban declaradas con `let`/`const` locales sin exponerse en `window`, y porque la matriz de holdings/RUTs se leía desde una propiedad inexistente (`holdings_salmoneros_matriz_ruts`) en vez de cargar `data/raw/territorio_concesiones/holdings_salmoneros_ruts_aysen.json`.
4. **CERO Relaciones Forzadas y CERO Nombres de Autores**:
   - **PROHIBIDO** mencionar autores académicos (nada de Jackson, Hawe, Ulrich, Beer, Pawson, Burns, Larson, etc.) ni jerga teórica en la interfaz.
   - **PROHIBIDO** inventar o pre-fabricar relaciones causales forzadas (por ejemplo, NO afirmar que los holdings salmoneros saturan el hospital ni forzar vínculos con salud). Los holdings y sus 42 RUTs son simplemente un **dato fáctico de titularidad** disponible para explorar y cruzar.
   - **El propósito de la aplicación**: Invitar al usuario a entender Aysén como un sistema complejo dinámico **permitiéndole hacer interactuar variables y cruzar tablas libremente**, sin imponer conclusiones prefabricadas.

---

## 2. Entregables a Construir

### Entregable A: Nueva Aplicación Principal desde Cero (`plataforma_aysen.html` + `js/plataforma_aysen.css` + `js/plataforma_aysen.js`)
Construir una aplicación web limpia de **pantalla completa (`100vw × 100vh`)** donde el mapa **NO** sea el centro de la pantalla, sino que el centro sea la interacción de variables y el modelo relacional de datos.

#### Diseño Estético (`/apple-design`, `/emil-design-eng`, `/find-animation-opportunities`):
- Fondo papel `#F7F7F5`, superficies `#FFFFFF`, tinta `#141618`, bordes finos `1px solid rgba(20, 22, 24, 0.09)`.
- Tipografía con `font-variant-numeric: tabular-nums;` en todas las tablas, RUTs y cifras; `font-optical-sizing: auto;` y `letter-spacing: -0.02em` en titulares.
- Curvas físicas `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`.
- Feedback táctil `:active { transform: scale(0.97); }` (`140ms var(--ease-out)`), cero `transition: all`, buscador a `0ms` de latencia.

#### Fuentes de Datos que Carga `js/plataforma_aysen.js` (vía `fetch()`):
1. `data/comunas_aysen.json` (10 comunas base: Censo 2024, CASEN 2022, SNASPE, Ruta 7, equipamiento).
2. `data/series_prospectivas.json` (18 series temporales 2020–2035).
3. `data/systemic/01_gob_poder_finanzas.json` (Alcaldes, concejos, parlamentarios, presupuestos SINIM, dependencia FCM %, FNDR).
4. `data/systemic/02_energia_combustibles_telecom.json` (Sistemas eléctricos, tarifas, centrales, precios CNE leña/combustibles, Fibra Óptica FOA).
5. `data/systemic/03_concesiones_tierra_mar.json` (745 concesiones acuícolas, barrios ACS, caletas, minería, tierra fiscal).
6. `data/raw/territorio_concesiones/holdings_salmoneros_ruts_aysen.json` (Los 12 Holdings Madres y sus 42 RUTs filiales detallados).
7. `data/systemic/04_inversion_seia_economia.json` (722 proyectos SEIA aprobados + 22 en evaluación, rubros SII, empleo público, PIB).
8. `data/systemic/05_social_salud_educacion_riesgos.json` (Red de salud DEIS, tiempos de evacuación SAMU, educación SLEP, delitos CEAD/VIF, volcanes y sismos USGS).
9. `data/systemic/06_turismo_sernatur_conaf.json` (Prestadores SERNATUR, 4 ZOIT, series mensuales EMAT ene-dic, visitación parques CONAF).

#### Componentes del Header Superior (Fijo, Limpio y 100% Funcional):
1. **Marca Sobria**: *"Aysén · Plataforma de Datos y Exploración Sistémica"* (10 Comunas · 8 Bases Conectadas).
2. **Buscador Universal Instantáneo en Vivo (`#globalSearchInput`, `0ms`)**:
   - Un input visible directamente en la barra superior (más atajo `Ctrl+K`) que al escribir despliega un panel de resultados instantáneos buscando en:
     * **10 Comunas** (por nombre, código INE `11101`..`11303`, cabecera o alcalde).
     * **12 Holdings Salmoneros y 42 RUTs filiales** (por nombre de holding como `AquaChile`, `Mowi`, `Multi X`, `Cermaq`, `Blumar`, `Australis`, `Yadrán`, por razón social de filial o por RUT con o sin puntos `86.247.400-7`, `96.633.150-5`).
     * **Variables Cuantitativas (>35 variables)** (ej. escribir "leña", "pobreza", "SEIA", "turismo", "FCM") -> al hacer clic la carga directamente en el Laboratorio de Variables.
     * **Nodos e Infraestructura (158 nodos)**: proyectos SEIA, centrales eléctricas, ZOIT, parques nacionales, hospitales, volcanes -> al hacer clic abre el detalle o lo muestra limpio en el mapa.
3. **Botón `¿Por dónde empezar?` (`#btnOpenWizard`)**:
   - Abre un asistente limpio y 100% funcional con tarjetas claras que al hacer clic configuran automáticamente el espacio de trabajo (ej. *"Cruzar variables entre las 10 comunas"*, *"Explorar el Modelo de Tablas estilo Power BI"*, *"Consultar los 12 Holdings Salmoneros y sus 42 RUTs"*, *"Ver proyectos de inversión SEIA y economía comunal"*, *"Ver Turismo SERNATUR, ZOIT y estacionalidad"*, *"Abrir el Mapa Limpio por capas individuales"*).

#### Las 4 Vistas Principales a Pantalla Completa (Pestañas en el Header):

##### VISTA 1: `1. Hacer Interactuar Variables` (Vista por defecto — Pantalla Completa sin Mapa)
Diseñada para que el usuario explore Aysén como un sistema complejo **haciendo interactuar libremente cualquier par o trío de variables** sin relaciones forzadas:
- **Panel de Control Superior / Izquierdo**:
  * **Selector Variable Eje X** (`<select id="selectVarX">`): Más de 30 variables reales organizadas por `<optgroup>` (Demografía y Territorio, Finanzas Municipales SINIM, Energía y Conectividad FOA, Concesiones Marítimas y Tierra, Inversión SEIA y Empleo SII, Turismo SERNATUR y Parques, Salud, Educación y Seguridad).
  * **Selector Variable Eje Y** (`<select id="selectVarY">`): Mismo catálogo completo de >30 variables.
  * **Selector Variable Tamaño de Burbuja Z** (`<select id="selectVarZ">`): Opcional (ej. Población Censo 2024, Presupuesto Municipal, Superficie km² o uniforme).
  * **Agrupación de Color**: Por Zona Geográfica (*Litoral y Archipiélagos*, *Intermedia / Valle*, *Continental y Fronteriza*) o por Provincia (*Coyhaique*, *Aysén*, *General Carrera*, *Capitán Prat*).
  * **Botones de Cruces Sugeridos para Explorar (1 clic)**:
    1. *Dependencia Fondo Común Municipal (%) vs. Inversión SEIA Aprobada (MM USD)*
    2. *Concesiones Acuícolas Totales vs. Ingresos Propios Permanentes Municipales (M$)*
    3. *Visitantes Parques CONAF vs. Prestadores Inscritos SERNATUR*
    4. *Pobreza Multidimensional CASEN (%) vs. Cobertura Fibra Óptica / 4G (%)*
    5. *Distancia a Coyhaique (km) vs. Tiempo de Evacuación Aeromédica SAMU (min)*
    6. *Precio Leña ($/m³) vs. Tarifa Eléctrica Residencial ($/kWh)*
- **Área Central Dividida en 2 Paneles Amplios**:
  * **Izquierda (Gráfico Interactivo Chart.js de Dispersión / Burbujas + Comparativa por Comuna)**:
    - Muestra las 10 comunas posicionadas según `(Variable X, Variable Y)` con tamaño `Z`. Al pasar el mouse o hacer clic en un punto, muestra el desglose exacto de esa comuna.
    - Conmutador para ver el mismo cruce como **Gráfico de Dispersión (X vs Y)** o como **Gráfico de Barras Comparativo de Doble Eje** ordenado de mayor a menor.
    - **Sub-pestaña Temporal / Estacional**: Permite cruzar series en el tiempo (ej. *Curva Mensual de Pernoctaciones Turísticas EMAT* vs. *Ocupación Verano/Invierno*, o cualquiera de las 18 series 2020–2035 de `series_prospectivas.json`).
  * **Derecha (Tabla Interactiva Lado a Lado de las 10 Comunas + Estadísticas Descriptivas Fácticas)**:
    - Muestra las 10 comunas con sus valores exactos para `Variable X`, `Variable Y`, `Variable Z`, el promedio regional, mínimo, máximo y coeficiente de correlación observado ($r$ calculado en vivo solo como dato descriptivo matemático, advirtiendo expresamente: *"Correlación estadística descriptiva entre las 10 comunas; no implica relación causal directa"*).
    - Botón **Descargar este Cruce en Excel (CSV UTF-8 BOM)**.

##### VISTA 2: `2. Modelo Relacional (Power BI)` (Pantalla Completa — 100% del ancho)
Sin mapa lateral que robe espacio. Toda la pantalla dedicada al modelo de datos:
- **Mitad Superior — Lienzo del Diagrama de Tablas y Llaves (Estilo Power BI Model View)**:
  * Muestra las **8 Cajas de Tablas** en una grilla amplia con líneas conectoras SVG entre sus llaves:
    1. `comunas_base` (PK: `comuna_ine`, `codigo_comuna`) — Censo 2024, CASEN, Ruta 7
    2. `gob_finanzas_sinim` (FK: `comuna_ine`) — Alcaldes, Presupuesto, % FCM, FNDR
    3. `energia_telecom_foa` (FK: `comuna_ine`) — Sistemas eléctricos, tarifas, leña, FOA
    4. `concesiones_tierra_mar` (FK: `comuna_ine`, `codigo_barrio_acs`) — 745 concesiones, minería, SNASPE
    5. `holdings_salmoneros_ruts` (PK: `holding_id`, `rut_filial` $\leftrightarrow$ `comunas_presencia`) — 12 Holdings Madres y 42 RUTs filiales
    6. `inversion_seia_sii` (FK: `comuna_ine`) — Proyectos SEIA (MM USD), empresas y empleo SII
    7. `turismo_sernatur_conaf` (FK: `comuna_ine`, `nombre_zoit`) — Prestadores SERNATUR, 4 ZOIT, EMAT, CONAF
    8. `social_salud_riesgos` (FK: `comuna_ine`) — Salud DEIS, SAMU, educación SLEP, CEAD, volcanes/sismos
  * Cada caja muestra sus columnas principales con casillas de verificación (`checkbox`) para que el usuario pueda **encender o apagar tanto tablas completas como columnas específicas**, además de botones de combinaciones rápidas.
- **Mitad Inferior — Tabla Cruzada Resultante (`LIVE JOIN`) a Ancho Completo**:
  * Tabla amplia con scroll horizontal suave, buscador/filtro instantáneo dentro de la tabla, ordenamiento por columna y botón **Exportar Tabla Unida a Excel (`.csv` UTF-8 BOM)**.
  * Incluye vista tanto unida por `comuna_ine` (10 filas con todas las columnas seleccionadas de las 8 tablas) como vista desagregada por **Holding Madre y sus 42 RUTs filiales** (`42 filas` con RUT, razón social, holding madre, grupo controlador, concesiones en Aysén y comunas donde opera).

##### VISTA 3: `3. Fichas Comunales y Titulares (RUTs / SEIA)` (Pantalla Completa)
- Selector superior para elegir cualquiera de las **10 comunas** (o comparar 2 comunas lado a lado), mostrando en tarjetas amplias y limpias sus 6 dimensiones (Gobernanza/SINIM, Energía/FOA, Concesiones/Tierra, Inversión SEIA/Empleo SII, Turismo SERNATUR/ZOIT y Salud/Educación/Seguridad) con enlaces directos a las fuentes oficiales.
- Sub-sección dedicada: **Explorador de Titulares, 12 Holdings Salmoneros (42 RUTs) y Proyectos SEIA**, con buscador instantáneo por RUT o nombre de empresa.

##### VISTA 4: `4. Mapa por Capas Limpias` (Bajo Demanda — Cero Capas Intrusivas)
- El mapa Leaflet solo vive en esta cuarta pestaña (se inicializa o redimensiona con `invalidateSize()` al abrirla).
- **REGLA DE ORO DEL MAPA**: Parte limpio (o solo con el contorno/cabecera si el usuario lo pide) y tiene un panel lateral de **Filtros Exclusivos y Exactos**:
  * Botón **"Limpiar todo el mapa (0 marcadores)"** y botones de **"Ver SOLO esta capa"** para cada categoría:
    1. `Solo Proyectos SEIA` (muestra única y exclusivamente los proyectos SEIA evaluados/aprobados; cero pasos fronterizos, cero estaciones).
    2. `Solo Concesiones Acuícolas y Caletas`
    3. `Solo Minería y Áreas Protegidas SNASPE`
    4. `Solo Centrales Eléctricas y Fibra Óptica (FOA)`
    5. `Solo Turismo SERNATUR, ZOIT y Parques`
    6. `Solo Municipios y Gobernanza`
    7. `Solo Salud, Volcanes y Sismos USGS`
  * También permite combinar 2 capas si el usuario marca explícitamente sus checkboxes, pero **jamás** muestra marcadores ocultos o pasos fronterizos no solicitados.

---

### Entregable B: Reparación de `mapa_territorial.html` y `js/systemic_atlas.js` + Actualización de `index.html`
1. En `index.html`: Hacer que el botón principal lleve directamente a `plataforma_aysen.html` (y dejar un enlace secundario al visor clásico `mapa_territorial.html`).
2. En `mapa_territorial.html`:
   - Agregar en el header un botón destacado **"Abrir Plataforma Completa de Datos y Relaciones (Sin Mapa Fijo)"** que lleve a `plataforma_aysen.html`.
   - Exponer explícitamente `window.comunasData = comunasData;`, `window.map = map;`, `window.activeComuna = activeComuna;` y `window.pasosLayer` / `window.markersLayer` para que `js/systemic_atlas.js` funcione sin errores.
   - En `js/systemic_atlas.js`:
     * Corregir la carga de holdings leyendo `data/raw/territorio_concesiones/holdings_salmoneros_ruts_aysen.json` para que el buscador por RUT (`86.247.400-7`, `AquaChile`, `Mowi`) funcione al 100%.
     * Cuando el usuario filtre una capa en la barra de capas del mapa (ej. "Inversión SEIA"), ocultar automáticamente los marcadores base de `mapa_territorial.html` (pasos fronterizos, estaciones, aeródromos) para que solo se vea la capa seleccionada.
   - Mantener intactos todos los IDs contractuales de `mapa_territorial.html` para que las 3 suites de tests (`scripts/test_fuentes_integridad.py`, `tests/verify_m1_editorial.py`, `tests/test_e2e_requirements.py`) sigan pasando al 100%.
