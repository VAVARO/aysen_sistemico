# Plataforma y Base de Datos Sistémica de Aysén

Repositorio de datos e inteligencia territorial de la Región de Aysén (10 comunas, 7 Hubs sistémicos, 31 nodos satélites, 7 paquetes de trabajo WP_01–WP_07).

- **Autor**: Álvaro Contreras Barrios
- **Costo de infraestructura**: \$0 (archivos estáticos JSON/CSV, HTML/CSS/JS vanilla, Canvas 2D, SVG, Chart.js, Leaflet, D3).
- **Cero dependencias de servidor en producción**: Ejecución local o en cualquier servidor estático (GitHub Pages, Cloudflare Pages, Netlify, S3).

---

## Módulos de la Plataforma

La plataforma implementa una cabecera global unificada con identidad editorial austral (paleta cobalto `#00357f`, tipografías Playfair Display, Inter y JetBrains Mono):

1. **[portal.html](portal.html) — Portada Principal**:
   - Lienzo a pantalla completa con metamorfosis vectorial continua de 10 postales icónicas de Aysén (128 capas × 256 vértices = 32.768 vértices por postal).
   - Navegación snap-scroll de 4 secciones: Hero interactivo, *¿Qué es un Sistema Complejo Dinámico?*, *¿Por qué hacemos esto?* y *¿Qué encontrarás acá?* con red neuronal viva sobre Canvas.
2. **[sistemas_complejos.html](sistemas_complejos.html) — Visualizador de Complejidad**:
   - Explorador pedagógico de las 16 propiedades sistémicas del marco CECAN con simulaciones interactivas en canvas.
   - Panel de lectura editorial bilingüe (Español / Inglés) con sincronización dinámica.
3. **[index.html](index.html) — Data Hub e Inteligencia Territorial**:
   - Data Lake local empaquetado: 7 Hubs temáticos equilibrados, 31 nodos y las 10 comunas de la región.
   - Vistas duales: Mapa de Hubs (31) y Las 10 Comunas (10) con buscador integrado `#global-search-input`.
   - Drawer lateral ejecutivo con ficha de procedencia institucional (corte 17-Oct-2026), gráfico acotado y descarga CSV con UTF-8 BOM.
4. **[laboratorio.html](laboratorio.html) — Laboratorio Sistémico (Estudio Cartográfico 2D)**:
   - Lienzo espacial 2D infinito interactivo con ventanas flotantes libres de tamaño dinámico.
   - Conexiones de red entre ventanas, propagación de filtros territoriales, drag-and-drop de variables desde el catálogo oficial, capas de cálculo real (Promedio y Tendencia $R^2$), y soporte de sub-dashboards múltiples.
   - Persistencia completa en `LocalStorage`, exportación/importación `.json` y generación de informes listos para imprimir/PDF.

---

## Estructura del Repositorio

```text
├── index.html                           # Data Hub e Inteligencia Territorial
├── portal.html                          # Portada interactiva y postales morfológicas
├── sistemas_complejos.html              # Visualizador pedagógico de 16 propiedades CECAN
├── laboratorio.html                     # Laboratorio sistémico y estudio cartográfico 2D
├── plataforma_aysen.html                # Visor territorial unificado
├── mapa_territorial.html                # Atlas prospectivo (18 series temporales 2030-2035)
├── AGENTS.md                            # Reglas operativas y arquitectura del repositorio
├── PROJECT.md                           # Especificación técnica e inventario de características
├── CECANV.4.pdf                         # Documento de referencia científica de sistemas complejos
│
├── data/
│   ├── aysen_hubs_data.js               # Bundle estático compilado (window.AYSEN_HUBS_DATA)
│   ├── comunas_aysen.json               # 10 comunas: Censo 2024, CASEN, SNASPE, conectividad
│   ├── series_prospectivas.json         # 18 series temporales con proyecciones a 2030-2035
│   ├── estaciones_aysen.json            # Red de estaciones y sensores territoriales
│   ├── data_health_report.json          # Reporte de salud e integridad de datos (100% PASS)
│   ├── raw/                             # Fuentes primarias y matrices institucionales
│   └── systemic/                        # Data Lake estructurado (WP_01 a WP_07 + 08)
│       ├── 01_gob_poder_finanzas.json
│       ├── 02_energia_combustibles_telecom.json
│       ├── 03_concesiones_tierra_mar.json
│       ├── 04_inversion_seia_economia.json
│       ├── 05_social_salud_educacion_riesgos.json
│       ├── 06_turismo_sernatur_conaf.json
│       ├── 07_biodiversidad_flora_fauna_aysen.json
│       ├── 08_desagregaciones_sectoriales_aysen.json
│       ├── provenance_catalog.json      # Trazabilidad y gobernanza de 31 nodos
│       └── csv/                         # 14+ planillas CSV UTF-8 BOM
│
├── js/                                  # Hojas de estilo y controladores de módulos
├── docs/                                # Especificaciones técnicas, contratos y bitácoras
├── scripts/                             # Pipelines de ingesta, compilación y validación
└── tests/                               # Suites de pruebas automatizadas E2E y de integridad
```

---

## Verificación y Compilación

Para compilar el bundle del Data Lake y correr las suites de validación automatizada:

```bash
# Compilar bundle frontend (genera data/aysen_hubs_data.js)
node scripts/build_aysen_hubs_bundle.cjs

# Validar integridad del Data Lake (WP_01 a WP_07)
python scripts/validate_data_lake.py --all

# Correr suite de integridad territorial (37 pruebas)
python scripts/test_fuentes_integridad.py

# Correr suite E2E de requerimientos (58 pruebas)
python tests/test_e2e_requirements.py

# Correr suites de salud de módulos
python tests/test_portal_health.py
python tests/test_laboratorio_health.py
python tests/verify_m1_editorial.py
```
