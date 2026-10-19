# WP_04: Inversión SEIA, Estructura Empresarial SII, Empleo y Licitaciones

## 📋 Prompt de Traspaso (Copiar y pegar en un modelo económico / nueva sesión)

```text
Ejecuta el paquete de trabajo WP_04 para el repositorio de Aysén.
REGLA DE TOKENS: NO leas mapa_territorial.html, index.html, data/series_prospectivas.json ni la carpeta .agents/.
Lee ÚNICAMENTE:
1. docs/handoff/MASTER_DATA_CONTRACT.md
2. docs/handoff/WP_04_INVERSION_SEIA_ECONOMIA.md

Tu tarea:
1. Crear y ejecutar el script `scripts/ingesta/wp_04_inversion_seia_economia.py` en Python 3.11 estándar.
2. Descargar / guardar respaldos crudos en `data/raw/inversion_economia/` (Proyectos SEIA en Aysén del Servicio de Evaluación Ambiental SEA, Estadísticas de Empresas y Trabajadores por Rubro y Comuna del SII, Tráfico Aéreo JAC, Turismo SERNATUR/INE, PIB Regional Banco Central y Licitaciones Mercado Público).
3. Generar `data/systemic/04_inversion_seia_economia.json` con las 10 comunas (`11101` a `11303`) y al menos 16 nodos georreferenciados (principales proyectos SEIA aprobados y en evaluación en Aysén con su monto en MM USD, titular y link al expediente SEA, más nodos logísticos/económicos clave).
4. Ejecutar `uv run python scripts/validate_data_lake.py --wp WP_04` hasta obtener `100% PASS`.
```

---

## 1. Fuentes Oficiales y Endpoints a Consultar / Almacenar en `data/raw/inversion_economia/`

1. **SEA (Servicio de Evaluación Ambiental) — Proyectos de Inversión en el SEIA (Región de Aysén)**:
   - Buscador y MapServer SEIA: `https://seia.sea.gob.cl/busqueda/buscarProyectoAction.php` y `https://sig.sea.gob.cl/`
   - Información requerida: Proyectos ingresados por EIA y DIA en las 10 comunas de Aysén (energía eólica/hidro/transmisión, engorda y plantas de salmónidos, continuidad operacional minera Cerro Bayo/El Toqui, rellenos sanitarios, obras portuarias MOP y pavimentación Ruta 7), con monto de inversión (`MM USD`), titular, estado (`Aprobado`, `En Calificación`, `Rechazado/Desistido`) y URL directa a la ficha SEIA.
2. **SII (Servicio de Impuestos Internos) — Estadísticas de Empresas y Trabajadores por Comuna y Rubro**:
   - Nómina y Estadísticas de Empresas por Comuna: `https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html`
   - Variables críticas por comuna: Número total de empresas, número de trabajadores dependientes informados, ventas anuales (UF) y los 3 rubros económicos dominantes en cada comuna (ej. Administración Pública, Acuicultura y Pesca, Construcción/Obras Viales, Ganadería/Silvicultura, Alojamiento y Turismo).
3. **Banco Central / INE / SERNATUR / Mercado Público (Series Económicas Omitidas en `index.html`)**:
   - PIB Regional de Aysén y participación sectorial (`https://si3.bcentral.cl`).
   - Encuesta Nacional de Empleo (ENE INE: tasa de ocupación, informalidad laboral y dependencia de empleo público).
   - Pernoctaciones turísticas EMAT (INE/SERNATUR) en destinos Coyhaique-Puerto Aysén, Carretera Austral Norte (Cisnes/Puyuhuapi) y Carretera Austral Sur (General Carrera/Cochrane/Tortel/O'Higgins).
   - Licitaciones de Obras Públicas y Contratos Municipales/GORE en Mercado Público (`https://www.mercadopublico.cl`).

---

## 2. Esquema Requerido por Comuna en `data/systemic/04_inversion_seia_economia.json`

Dentro de cada elemento de `por_comuna[i].datos`, incluir obligatoriamente los 3 bloques exigidos por `validate_data_lake.py`:

```json
"datos": {
  "proyectos_seia": {
    "proyectos_aprobados_historicos": 85,
    "proyectos_en_calificacion_actual": 4,
    "inversion_aprobada_acumulada_mmusd": 640.5,
    "inversion_en_evaluacion_mmusd": 48.2,
    "sectores_inversion_dominantes": ["Acuicultura", "Energía", "Infraestructura Portuaria y Vial"],
    "proyecto_emblematico_reciente": "Nombre del proyecto (Titular, MM USD)"
  },
  "estructura_empresarial_sii": {
    "numero_empresas_activas": 4820,
    "trabajadores_dependientes_sii": 28400,
    "ventas_anuales_estimadas_miles_uf": 42500,
    "rubros_principales": ["Administración Pública y Salud", "Comercio y Servicios", "Construcción e Ingeniería"],
    "peso_empleo_publico_estimado_pct": 34.5
  },
  "empleo_y_turismo": {
    "tasa_ocupacion_estimada_pct": 61.2,
    "informalidad_laboral_estimada_pct": 24.8,
    "destino_turistico_sernatur": "Coyhaique - Reserva Cerro Castillo",
    "pernoctaciones_anuales_estimadas": 145000,
    "licitaciones_mercado_publico_anual_mclp": 26500
  }
}
```

## 3. Nodos Georreferenciados Mínimos (`nodos_georreferenciados`)
Al menos **16 nodos** dentro del Bounding Box de Aysén:
- Proyectos emblemáticos en el SEIA (aprobados, en evaluación o conflictivos) distribuidos en las comunas de Aysén: parques eólicos, proyectos de transmisión eléctrica, plantas de proceso y centros acuícolas mayores, proyectos mineros en Chile Chico/Coyhaique, terminales portuarios (Chacabuco, Yungay, Ibáñez, Melinka) y obras viales/hidráulicas MOP.
