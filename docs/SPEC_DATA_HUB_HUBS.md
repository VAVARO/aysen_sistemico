# Especificación Técnica: Data Hub & Mapa de Hubs Sistémicos de Aysén

Documento de contexto de Nivel 2 para agentes y desarrolladores. Define la arquitectura, modelos de datos, contratos de interfaz y flujos de empaquetado para el módulo [index.html](file:///c:/AGY/SUPERFORECAST/index.html).

---

## 1. Arquitectura de Datos y Pipeline

El Data Hub funciona a costo de infraestructura **$0** (estático puro), compilando datos heterogéneos de 7 paquetes de trabajo (WP_01 a WP_07) en un bundle JavaScript optimizado:

```
[Fuentes Institucionales (JSONs en data/systemic/)]
                    ↓
[scripts/build_aysen_hubs_bundle.cjs] + [scripts/build_provenance_catalog.py]
                    ↓
[data/aysen_hubs_data.js] (window.AYSEN_HUBS_DATA) + [data/systemic/provenance_catalog.json]
                    ↓
[index.html] (Grafo D3, Vistas Comunas, Drawer Ejecutivo)
```

- **Bundle frontend**: `data/aysen_hubs_data.js` (~196 KB). Se carga síncronamente como `<script src="data/aysen_hubs_data.js">`.
- **Estructura raíz de `window.AYSEN_HUBS_DATA`**:
  ```javascript
  {
    hubs: [ /* 7 Hubs temáticos */ ],
    nodes: [ /* 31 Nodos satélites */ ],
    links: [ /* Enlaces D3: Hub->Nodo y Hub<->Hub */ ],
    comunas: [ /* 10 Comunas con datos transversales */ ],
    crossAnalysis: { /* Matriz de cruces entre hubs */ },
    meta: {
      generatedAt: "2026-10-18T...",
      totalHubs: 7,
      totalNodes: 31,
      totalComunas: 10
    }
  }
  ```

---

## 2. Los 7 Hubs Sistémicos

Cada nodo satélite pertenece a uno de los 7 Hubs temáticos, con colorimetría y balance estructurado:

| Hub ID | Nombre del Hub | Color Hex | Cantidad de Nodos | Nodos Satélites |
|---|---|---|:---:|---|
| `turismo` | I. Turismo & Áreas Silvestres | `#0059c5` (Azul Cobalto) | 5 | #01 a #05 |
| `salmonicultura` | II. Pesca, Acuicultura & Maritorio | `#008272` (Verde Azulado) | 5 | #06 a #10 |
| `energia` | III. Energía & Telecomunicaciones | `#b35c00` (Ámbar Tierra) | 4 | #11 a #14 |
| `gobernanza` | IV. Gobernanza & Finanzas Municipales | `#5942b0` (Púrpura Profundo) | 4 | #15 a #18 |
| `inversion` | V. Economía, Inversión & Suelo | `#1e6827` (Verde Bosque) | 4 | #19 a #22 |
| `social` | VI. Sociedad: Demografía, Salud & Educación | `#a61c47` (Granate Austral) | 4 | #23 a #26 |
| `biodiversidad` | VII. Biodiversidad & Medio Ambiente | `#2e6930` (Verde Esmeralda) | 5 | #27 a #31 |

---

## 3. Catálogo Canónico de los 31 Nodos Satélites

Todos los nodos comparten el mismo diseño visual (círculos de radio homogéneo `r: 13`), sin badges ni halos especiales.

| # | ID del Nodo | Título del Nodo | Hub Padre | Fuente Oficial | Unidad / Métrica Clave |
|:---:|---|---|---|---|---|
| **01** | `prestadores_turismo_sernatur` | Prestadores Turísticos Registrados | `turismo` | SERNATUR | Servicios (Alojamientos, Guías, etc.) |
| **02** | `sellos_calidad_sustentabilidad` | Sellos de Calidad (Q) y Sustentabilidad (S) | `turismo` | SERNATUR | Número de empresas certificadas |
| **03** | `zonas_zoit` | Zonas de Interés Turístico (ZOIT) | `turismo` | Subsecretaría de Turismo | 4 Decretos ZOIT vigentes |
| **04** | `estacionalidad_emat` | Estacionalidad Ocupacional Hotelera (EMAT) | `turismo` | INE Chile | Tasa de Ocupación Mensual (%) |
| **05** | `visitantes_snaspe` | Afluencia a Parques y Reservas SNASPE | `turismo` | CONAF | Visitantes anuales |
| **06** | `concesiones_salmon_mar` | Concesiones de Salmonicultura en Mar | `salmonicultura` | SERNAPESCA | 745 Concesiones otorgadas |
| **07** | `holdings_salmoneros_madres` | Titularidad de Holdings Salmoneros | `salmonicultura` | SERNAPESCA / CMF | 12 Grupos empresariales |
| **08** | `caletas_pesqueras_artesanales` | Caletas Pesqueras Artesanales | `salmonicultura` | SERNAPESCA | 29 Caletas y desembarques |
| **09** | `concesiones_maritimas_sectores` | Concesiones Marítimas por Destino | `salmonicultura` | DIRECTEMAR / BBNN | Concesiones por uso |
| **10** | `pesca_industrial_impuesto_especifico` | Pesca Industrial e Impuesto Específico (Art. 43 ter) | `salmonicultura` | SUBPESCA / SERNAPESCA / TGR | Capturas industriales (t) y tributo UTM |
| **11** | `sistemas_electricos_generacion` | Sistemas Eléctricos: Generación y Capacidad | `energia` | CNE | Capacidad instalada (MW) por fuente |
| **12** | `tarifas_electricas_comunales` | Tarifas Residenciales de Electricidad | `energia` | SEC / CNE | $/kWh por sistema |
| **13** | `consumo_combustibles_lena` | Consumo de Combustibles y Biomasa | `energia` | CNE / MMA | m³ leña y m³ combustibles |
| **14** | `conectividad_digital_telecom` | Conectividad Digital y Fibra Óptica Austral | `energia` | SUBTEL | Trazado FOA y cobertura 4G/5G |
| **15** | `alcaldes_autoridades_municipales` | Autoridades Municipales (2024–2028) | `gobernanza` | SERVEL / Municipalidades | 10 Alcaldes en ejercicio |
| **16** | `ingresos_presupuestos_municipales` | Presupuestos e Ingresos Municipales | `gobernanza` | SINIM / SUBDERE | M$ presupuestados y gasto per cápita |
| **17** | `dependencia_fcm_comunal` | Dependencia del Fondo Común Municipal (FCM) | `gobernanza` | SINIM | % de dependencia fiscal |
| **18** | `inversion_fndr_gore` | Inversión Pública Regional (FNDR) | `gobernanza` | GORE Aysén / SUBDERE | M$ ejecutados en proyectos comunales |
| **19** | `proyectos_seia_estado` | Proyectos de Inversión SEIA | `inversion` | SEA | 722 Proyectos (Aprobados, En Calificación) |
| **20** | `empresas_trabajadores_sii` | Tejido Empresarial y Empleo Formal | `inversion` | SII | Empresas registradas y trabajadores |
| **21** | `pib_regional_sectores` | Producto Interno Bruto (PIB) Regional | `inversion` | Banco Central de Chile | MM$ por rama económica |
| **22** | `tenencia_suelo_fiscal_privado` | Estructura de Tenencia del Suelo | `inversion` | BBNN / CONAF / CIREN | % Fiscal BBNN, % SNASPE, % Privado |
| **23** | `demografia_casen_censo` | Demografía Censo 2024 y Vulnerabilidad CASEN | `social` | INE / MDSF | Población (100.745 hab) y Pobreza (%) |
| **24** | `red_salud_aps_hospitales` | Red Asistencial de Salud: APS vs. Hospitales | `social` | DEIS Minsal | 5 Hospitales, 32 Postas, Box SAMU |
| **25** | `educacion_matricula_slep` | Educación Pública y Cobertura SLEP | `social` | MINEDUC / SLEP Aysén | Establecimientos y matrícula escolar |
| **26** | `seguridad_delitos_cead` | Seguridad Ciudadana y Delitos de Mayor Connotación | `social` | CEAD / SPD | Casos policiales y tasa DMCS |
| **27** | `cobertura_forestal_flora` | Formaciones Vegetacionales y Bosque Nativo | `biodiversidad` | CONAF | Hectáreas de bosque nativo y estepa |
| **28** | `fauna_amenazada_rce` | Fauna Silvestre en Estado de Conservación | `biodiversidad` | MMA (RCE) | Especies en Peligro / Vulnerables |
| **29** | `especies_invasoras_amenaza` | Especies Exóticas Invasoras | `biodiversidad` | SAG / MMA / CIEP | Especies detectadas y control |
| **30** | `monitoreo_continuo_aire_agua` | Monitoreo Continuo: Aire (SINCA) y Caudales (DGA) | `biodiversidad` | SINCA MMA / DGA MOP | MP2,5 Coyhaique II (µg/m³), Baker y Simpson (m³/s) |
| **31** | `riesgos_volcanes_sismicidad` | Monitoreo Volcánico y Sismicidad | `biodiversidad` | SERNAGEOMIN / USGS | Red RNVV Volcán Hudson, Macá, Cay |

---

## 4. Contratos de Interfaz (DOM) de `index.html`

Para asegurar el paso incondicional de los 58 tests de integración y la robustez del frontend:

### 4.1. Vistas Principales (Navegación Limpia)
- Botones de selección de vista:
  - `#tab-btn-nodos`: Activa el modo Grafo de Hubs (`#view-nodos`).
  - `#tab-btn-comunas`: Activa el modo Radiografía Comunal (`#view-comunas`).
- Indicadores de recuento:
  - `#badge-count-nodos`: Muestra `31`.
  - `#badge-count-comunas`: Muestra `10`.

### 4.2. Contenedor y Grafo D3
- `#d3-canvas-container`: Lienzo D3 responsivo.
- `#d3-concept-svg`: Elemento `<svg>` escalable.
- Simulación D3: `d3.forceSimulation` con enlace rígido entre hubs y órbitas estables de nodos satélites.

### 4.3. Drawer Lateral Ejecutivo (`#concept-drawer`)
Al cliquear un nodo o una comuna se abre el drawer con las siguientes secciones obligatorias:
- `#drawer-title`: Nombre del nodo/comuna seleccionado.
- `#drawer-badge`: Etiqueta del Hub al que pertenece.
- `#drawer-desc`: Resumen conciso contextual.
- `#drawer-chart-container`: Contenedor para el gráfico de síntesis (`#drawer-chart`).
- `#drawer-table-container`: Tabla analítica sin saturación (máximo 10 filas comunales o métricas clave).
- `#drawer-provenance-container`: Ficha de transparencia técnica (Fuente, Fecha de Corte: 17 de octubre de 2026, Próxima Actualización, Método de Recolección).
- `#btn-export-node-csv`: Botón de descarga CSV para Excel (`\uFEFF` UTF-8 BOM).

### 4.4. IDs Contractuales de Compatibilidad
Los siguientes IDs están preservados en el DOM para la suite de integración automatizada (`tests/test_e2e_requirements.py`):
- `#repoHealthBadge`, `#healthScore`
- `#btnModeDesktop`, `#btnModeProjector`
- `#crossAlertBanner`, `#crossAlertTitle`, `#crossAlertText`
- `#miniChart`, `#crossChart`

---

## 5. Prácticas de Context Engineering (Ahorro de Tokens)

1. **NO cargar `data/aysen_hubs_data.js` en contexto**: Tiene ~196 KB. Si requieres verificar valores de un nodo, usa:
   ```powershell
   & "C:\Users\alvar\.local\bin\python3.11.exe" -c "import json; cat=json.load(open('data/systemic/provenance_catalog.json', encoding='utf-8')); print(cat['nodes']['nodo_10'])"
   ```
2. **Recompilar tras modificar datos**: Siempre ejecutar:
   ```powershell
   node scripts/build_aysen_hubs_bundle.cjs
   ```
3. **Verificación rápida antes de cerrar**:
   ```powershell
   & "C:\Users\alvar\.local\bin\python3.11.exe" tests/test_e2e_requirements.py
   & "C:\Users\alvar\.local\bin\python3.11.exe" scripts/test_fuentes_integridad.py
   ```
4. **Cero hipótesis no sustentadas**: Cero citas inventadas a teóricos o modelos de sistemas que no estén soportados en datos oficiales. Cero emojis en código o vistas.
