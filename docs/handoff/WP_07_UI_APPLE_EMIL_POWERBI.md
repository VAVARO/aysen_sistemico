# WP_07: Rediseño Fino de Experiencia de Usuario, Asistente Inicial y Modelo de Tablas (Estilo Power BI)

## 1. Reglas de Ingeniería de Diseño (`/apple-design` + `/emil-design-eng` + `/find-animation-opportunities`)

Todo código CSS y JS que se incorpore en `mapa_territorial.html` (y `js/systemic_engine.js`) debe obedecer sin excepción estas reglas para erradicar cualquier rastro de "AI Slop":

### A. Tokens de Movimiento y Físicas (Emil Kowalski & Apple WWDC)
```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
```
1. **Prohibido `transition: all`**: Especificar siempre propiedades exactas (`transform`, `opacity`, `background-color`, `border-color`).
2. **Prohibido `ease-in` y prohibido `scale(0)`**: Toda entrada de panel, popover o modal debe partir de `transform: scale(0.96); opacity: 0` con `var(--ease-out)` en `160ms–220ms`.
3. **Feedback inmediato al presionar (`pointer-down` / `:active`)**:
   - Todo botón interactivo debe tener `transition: transform 140ms var(--ease-out), background-color 140ms ease;` y `:active { transform: scale(0.97); }`.
4. **Cero animación en acciones de teclado repetitivas (`Escape`, `[`, búsqueda instantánea)**: Los filtros de búsqueda por teclado y atajos deben responder en `0ms`.
5. **Gating de Hover y Accesibilidad de Movimiento**:
   - Envolver efectos `:hover` de transformación dentro de `@media (hover: hover) and (pointer: fine) { ... }`.
   - Incluir soporte obligatorio `@media (prefers-reduced-motion: reduce)` que reemplace traslaciones/escalas por cross-fade suave de opacidad (`150ms ease`).
6. **Tipografía de Precisión (Apple Optical Sizing & Tabular Numbers)**:
   - Títulos grandes: `letter-spacing: -0.02em; line-height: 1.12; font-optical-sizing: auto;`.
   - Toda cifra, RUT, monto en pesos/USD, porcentaje o coordenada en tablas y tarjetas: `font-variant-numeric: tabular-nums;`.
7. **Materiales y Superficies Sobrias**:
   - Papel cálido `#FBFBFA`, paneles `#FFFFFF`, bordes hairline de `1px solid #E3E4DC`, barras flotantes con `background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(16px) saturate(180%);`.
   - **Prohibidos emojis decorativos infantiles** en la nueva interfaz: usar íconos SVG de trazo fino (`stroke-width="1.75"`), etiquetas tipográficas limpias y lenguaje sobrio en español.

---

## 2. Los 3 Componentes Nuevos a Integrar en `mapa_territorial.html` (Vía `js/systemic_engine.js` + CSS limpio)

### Componente 1: Asistente Inicial `"¿Qué estás buscando en Aysén?"` (Modal/Overlay Guiado + Botón en Header)
- Accesible desde un botón destacado en el header (`¿Qué estás buscando?` / `Explorar por tema`) y abrible automáticamente o a petición sin bloquear los tests automatizados de regresión.
- Incluye:
  1. **Buscador Universal Instantáneo (`0ms`)**: Busca en vivo a través de las 10 comunas, los 12 holdings salmoneros y sus **42 RUTs filiales**, los proyectos del **SEIA**, las **centrales eléctricas**, los **alcaldes**, las **ZOIT / atractivos de SERNATUR**, los **hospitales/postas** y los **volcanes/sismos**. Al hacer clic en un resultado, te lleva directo a ese elemento en el mapa y abre su ficha completa.
  2. **Las 5 Rutas Guiadas en 2 Pasos**:
     - **Ruta 1 — Comunas de Aysén**: Elegir una de las 10 comunas o comparar las 10 comunas lado a lado.
     - **Ruta 2 — Empresas, Concesiones, Inversión y Poder Político**:
       - *Sub-opción 2A*: Concesiones salmoneras, 12 empresas madres y sus 42 RUTs filiales (`WP_03`).
       - *Sub-opción 2B*: Proyectos de inversión en el SEIA y estructura empresarial SII (`WP_04`).
       - *Sub-opción 2C*: Minería y propiedad de la tierra (SNASPE, Bienes Nacionales y privado) (`WP_03`).
       - *Sub-opción 2D*: Alcaldes, concejos, parlamentarios y finanzas municipales SINIM / Fondo Común Municipal (`WP_01`).
     - **Ruta 3 — Turismo (SERNATUR), Energía, Conectividad y Servicios**:
       - *Sub-opción 3A*: Turismo SERNATUR: Prestadores registrados, ZOIT, ocupación EMAT y visitantes a Parques Nacionales (`WP_06`).
       - *Sub-opción 3B*: Energía: Centrales hidro/eólicas/diésel, sistemas aislados y precios de combustibles/leña (`WP_02`).
       - *Sub-opción 3C*: Conectividad y Telecomunicaciones: Ruta 7, barcazas, vuelos y Fibra Óptica Austral (`WP_02`).
       - *Sub-opción 3D*: Salud (hospitales y derivación aeromédica), Educación (MINEDUC/SLEP) y Seguridad/VIF (`WP_05`).
     - **Ruta 4 — Agua, Clima, Riesgos Naturales y Proyecciones 2030–2035**:
       - Ríos, glaciares, vaciamientos GLOF, volcanes activos, sismos USGS en vivo, calidad del aire MP2.5 y proyecciones a 2030–2035.
     - **Ruta 5 — Relaciones entre Bases de Datos (Modelo de Tablas)**:
       - Abre la vista interactiva estilo Power BI con las cajas de tablas, llaves de unión (`comuna_ine`, `codigo_cuenca`, `codigo_barrio_acs`, `holding_id`/`rut`) y generador de cruces en vivo.

---

### Componente 2: Vista Personalizada y "Datos Relacionados en esta Comuna" (En el Panel Lateral + Modo Expandido)
- En ` Radiografía Comunal` (y cuando el usuario selecciona cualquier comuna o nodo de los 6 paquetes sistémicos):
  - Debajo de los datos básicos de Censo/CASEN/Conectividad, se renderiza un bloque limpio de **Dimensiones de la Comuna (Datos Integrados del Data Lake)** con selector rápido por ámbito:
    1. **Gobernanza y Finanzas (SINIM)**: Alcalde/sa, partido, presupuesto anual, % dependencia del Fondo Común Municipal, patentes e inversión FNDR.
    2. **Energía y Telecomunicaciones (CNE / SUBTEL)**: Subsistema eléctrico al que pertenece, potencia instalada MW, precio gasolina/diésel/leña, conexión Fibra Óptica Austral (FOA) y operadores 4G/5G.
    3. **Mar, Minería y Tenencia de Tierra (SUBPESCA / SERNAGEOMIN / CONAF)**: Concesiones salmoneras, holdings y RUTs que operan en esa comuna, caletas artesanales, concesiones mineras y % de superficie SNASPE vs Fiscal vs Privada.
    4. **Inversión SEIA y Economía (SEA / SII)**: Proyectos aprobados y en evaluación (MM USD), número de empresas y trabajadores SII, rubros principales y % de empleo público.
    5. **Turismo (SERNATUR / EMAT / CONAF)**: Prestadores registrados en SERNATUR, alojamientos, operadores de aventura, ZOIT a la que pertenece, pernoctaciones EMAT, estacionalidad verano/invierno y visitantes a parques nacionales.
    6. **Salud, Educación, Seguridad y Riesgos (DEIS / MINEDUC / CEAD / USGS)**: Hospital de derivación quirúrgica, tiempo de traslado a Coyhaique, aeroevacuación SAMU, colegios/matrícula SLEP, tasas de delitos/VIF y volcanes/sismos cercanos.
  - Además, en el mapa se agrega una barra limpia para encender/apagar los **140+ nodos georreferenciados** del Data Lake (`Municipalidades`, `Centrales Eléctricas y FOA`, `Holdings Salmoneros y Caletas`, `Minería y Parques`, `Proyectos SEIA`, `Turismo SERNATUR / ZOIT`, `Hospitales, Volcanes y Sismos USGS`).

---

### Componente 3: Vista Interactiva `"Relaciones de Datos (Modelo)"` (Estilo Modelo de Tablas de Power BI)
- Se añade una pestaña/vista principal: **`4. Relaciones de Datos`** (además de mantener intactas las 3 pestañas contractuales `1. Radiografía Comunal`, `2. Retos & Proyecciones`, `3. Descargas`).
- Al abrir **`4. Relaciones de Datos`** (o al pulsar *"Ampliar Modelo de Tablas"*), el usuario ve:
  1. **El Diagrama Relacional Interactivo de Tablas (Estilo Power BI Model View)**:
     - Cajas visuales para cada tabla de la base de datos:
       - `comunas_aysen` *(Tabla Maestra: 10 comunas)*
       - `01_gob_poder_finanzas` *(SINIM, SERVEL, FNDR)*
       - `02_energia_combustibles_telecom` *(CNE, Edelaysen, SUBTEL FOA)*
       - `03_concesiones_tierra_mar` *(SUBPESCA, SERNAGEOMIN, BBNN)*
       - `03_holdings_salmoneros_ruts` *(12 Empresas Madres ↔ 42 RUTs filiales)*
       - `04_inversion_seia_economia` *(Proyectos SEIA, Empresas SII, Empleo)*
       - `05_social_salud_educacion_riesgos` *(DEIS, MINEDUC, CEAD, USGS)*
       - `06_turismo_sernatur_conaf` *(Prestadores SERNATUR, EMAT, ZOIT, CONAF)*
       - `series_prospectivas` *(18 Series 2020–2035 y Sensores)*
     - Cada caja muestra sus campos clave y resalta las **Llaves de Unión (`PK` / `FK`)**:
       - `comuna_ine` (`11101..11303`) / `codigo_comuna` (`CL-XI-01..10`) — Relación `1:1` y `1:N`
       - `codigo_cuenca` (`110..118`) — Relación Hidrológica BNA
       - `codigo_barrio_acs` (`ACS-17..35`) — Relación Espacial Acuícola
       - `holding_id` $\leftrightarrow$ `rut_filial` — Relación Corporativa (1 Empresa Madre : N RUTs titulares)
  2. **Constructor de Cruces en Vivo (Click-to-Join)**:
     - El usuario puede marcar **2 o más tablas del diagrama** (o elegir un cruce preconfigurado como *"Finanzas Municipales SINIM × Concesiones y Holdings Salmoneros"*, *"Energía Aislada × Salud y Evacuación Aeromédica"*, *"Turismo SERNATUR × Conectividad Ruta 7 y Aeródromos"*, *"Inversión SEIA × Empleo SII y Pobreza CASEN"*) o ver la **Matriz de los 12 Holdings Salmoneros y sus 42 RUTs**.
     - Abajo del diagrama se construye al instante la **tabla combinada real** uniendo los registros por la llave seleccionada (`comuna_ine`, `codigo_barrio_acs` o `holding_id`), con buscador, ordenamiento y un botón **`Descargar este cruce en Excel (CSV UTF-8 BOM)`**.

---

## 3. Regla Inquebrantable de No-Regresión (Contratos Existentes)
El rediseño **NO DEBE ELIMINAR NI RENOMBRAR** ninguno de los IDs ni funciones exigidos por las suites de pruebas existentes:
- IDs obligatorios: `#repoHealthBadge`, `#healthScore`, `#btnModeDesktop`, `#btnModeProjector`, `#crossAlertBanner`, `#crossAlertTitle`, `#crossAlertText`, `#crossAlertIcon`, `#miniChart`, `#crossChart`, `#itemCat`, `#itemTitle`, `#itemLoc`, `#itemInst`, `#itemFreq`, `#itemCode`, `#itemAccess`, `#itemDesc`, `#chartMetricName`, `#detailPanel`, `#drawerCollapseBtn`, `#drawerMiniDock`, `#dockExpandBtn`, `#tabStationView`, `#tabCrossView`, `#tabDownloadsView`, `#viewStationContainer`, `#viewCrossContainer`, `#viewDownloadsContainer`.
- El estado inicial al cargar `mapa_territorial.html` sin parámetros debe seguir mostrando `#viewStationContainer` activo con Coyhaique (`CL-XI-01`) seleccionado en `<200ms` para que todos los tests de Headless Chrome y Python (`scripts/test_fuentes_integridad.py`, `tests/verify_m1_editorial.py`, `tests/test_e2e_requirements.py`) pasen al **100%**.
