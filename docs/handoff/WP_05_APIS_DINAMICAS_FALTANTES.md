# WP_05: Dinámica Social, Salud, Educación, Seguridad y Riesgos Activos (APIs Omitidas)

## 📋 Prompt de Traspaso (Copiar y pegar en un modelo económico / nueva sesión)

```text
Ejecuta el paquete de trabajo WP_05 para el repositorio de Aysén.
REGLA DE TOKENS: NO leas mapa_territorial.html, index.html, data/series_prospectivas.json ni la carpeta .agents/.
Lee ÚNICAMENTE:
1. docs/handoff/MASTER_DATA_CONTRACT.md
2. docs/handoff/WP_05_APIS_DINAMICAS_FALTANTES.md

Tu tarea:
1. Crear y ejecutar el script `scripts/ingesta/wp_05_social_riesgos_apis.py` en Python 3.11 estándar.
2. Descargar / guardar respaldos crudos en `data/raw/social_ambiental/` consultando APIs reales (USGS GeoJSON API para sismos en el polígono de Aysén, DEIS Minsal establecimientos y causas, MINEDUC matrícula y establecimientos por comuna, CEAD estadísticas delictuales comunales, SERNAGEOMIN volcanes de Aysén y SENAPRED/CONAF incendios forestales).
3. Generar `data/systemic/05_social_salud_educacion_riesgos.json` con las 10 comunas (`11101` a `11303`) y al menos 18 nodos georreferenciados (5 hospitales con su red de derivación, volcanes activos monitoreados Hudson/Macá/Mentolat/Cay/Melimoyu, epicentros sísmicos recientes en la falla Liquiñe-Ofqui y campus/liceos estratégicos).
4. Ejecutar `uv run python scripts/validate_data_lake.py --wp WP_05` hasta obtener `100% PASS`.
```

---

## 1. Fuentes Oficiales y APIs Directas a Consultar / Almacenar en `data/raw/social_ambiental/`

1. **USGS Earthquake API (API GeoJSON abierta, sin token, responde en < 1s)**:
   - Endpoint directo para el Bounding Box de Aysén:
     `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=-49.3&maxlatitude=-43.6&minlongitude=-75.8&maxlongitude=-71.0&starttime=2015-01-01&minmagnitude=3.5`
   - Extrae todos los eventos sísmicos reales registrados en la Zona de Falla Liquiñe-Ofqui, Fiordo Aysén, Dorsal de Chile / Triple Punto y alrededores del Volcán Hudson.
2. **DEIS Minsal — Red Asistencial, Derivación Aeromédica y Estadísticas Vitales**:
   - Portal de Datos Abiertos DEIS: `https://deis.minsal.cl/#datosabiertos` y `https://datos.gob.cl`
   - Variables por comuna: Establecimiento cabecera, número de camas (si es hospital), dependencia del Servicio de Salud Aysén, hospital base de derivación quirúrgica, tiempo estimado de traslado terrestre a Coyhaique (horas), requerimiento de evacuación aeromédica (SAMU Aysén) y tasa de mortalidad/natalidad comunal.
3. **MINEDUC (Centro de Estudios) — Establecimientos, Matrícula y Educación Superior**:
   - Datos Abiertos MINEDUC: `https://datosabiertos.mineduc.cl/`
   - Variables por comuna: Número de establecimientos educacionales (municipales/SLEP Aysén, particulares subvencionados), matrícula escolar total, presencia de educación media completa en la comuna (o necesidad de internado fuera de la comuna) y presencia de educación superior (Universidad de Aysén, INACAP, CFT Estatal de Aysén).
4. **CEAD (Subsecretaría de Prevención del Delito) — Seguridad Pública por Comuna**:
   - Estadísticas Delictuales Comunales: `https://cead.spd.gob.cl/estadisticas-delictuales/`
   - Variables por comuna: Tasa de Delitos de Mayor Connotación Social (DMCS por 100.000 hab), tasa de Violencia Intrafamiliar (VIF — uno de los principales problemas sociales invernales en Aysén) e infracciones a la Ley de Alcoholes / Abigeato en zonas rurales.
5. **SERNAGEOMIN (RNVV) & CONAF / NASA FIRMS — Volcanes e Incendios Forestales**:
   - Red Nacional de Vigilancia Volcánica (`https://rnvv.sernageomin.cl/`): Volcanes Melimoyu (Cisnes), Mentolat (Cisnes/Isla Magdalena), Puyuhuapi (Cisnes), Cay y Macá (Aysén), Hudson (Río Ibáñez/Aysén) y Arenales (Campo de Hielo Norte).
   - Estadísticas históricas de incendios forestales CONAF por comuna (superficie afectada en hectáreas y vulnerabilidad de interfaz urbano-forestal en Coyhaique, Río Ibáñez y Cochrane).

---

## 2. Esquema Requerido por Comuna en `data/systemic/05_social_salud_educacion_riesgos.json`

Dentro de cada elemento de `por_comuna[i].datos`, incluir obligatoriamente los 4 bloques exigidos por `validate_data_lake.py`:

```json
"datos": {
  "salud_red_asistencial": {
    "establecimiento_principal": "Hospital Regional Coyhaique",
    "nivel_complejidad": "Alta Complejidad (Base Regional) / Baja Complejidad / Posta Rural",
    "camas_hospitalarias": 167,
    "postas_rurales_dependientes": 7,
    "hospital_derivacion_quirurgica": "Hospital Regional Coyhaique",
    "tiempo_traslado_terrestre_coyhaique_horas": 0.0,
    "dependencia_evacuacion_aeromedica": "Nula (Centro Receptor Regional) / Alta / Crítica"
  },
  "educacion_mineduc": {
    "slep_territorial": "SLEP Aysén",
    "establecimientos_escolares_total": 38,
    "matricula_escolar_total": 13450,
    "tiene_educacion_media_completa": true,
    "instituciones_educacion_superior": ["Universidad de Aysén", "INACAP Coyhaique"]
  },
  "seguridad_cead": {
    "tasa_dmcs_por_100k_hab": 1420.5,
    "tasa_vif_por_100k_hab": 890.2,
    "delitos_frecuentes_comuna": ["Violencia intrafamiliar", "Hurtos", "Lesiones menos graves"],
    "dotacion_carabineros_cabecera": "1ª Comisaría Coyhaique + Retenes fronterizos/rurales"
  },
  "riesgos_ambientales": {
    "volcanes_influencia_directa": ["Volcán Hudson (caída de ceniza)"],
    "amenaza_principal_senapred": "Contaminación atmosférica invernal e incendios de interfaz",
    "incendios_forestales_promedio_anual_ha": 185.0,
    "sismos_registrados_cercanos_usgs": 4
  }
}
```

## 3. Nodos Georreferenciados Mínimos (`nodos_georreferenciados`)
Al menos **18 nodos** dentro del Bounding Box de Aysén:
- Los 5 Hospitales de la red asistencial de Aysén (Coyhaique, Puerto Aysén, Cisnes, Chile Chico, Cochrane) + CESFAM Melinka y Postas extremas (Villa O'Higgins, Caleta Tortel, Lago Verde).
- Los 6 complejos volcánicos activos monitoreados en Aysén (Hudson, Macá, Cay, Mentolat, Melimoyu, Arenales).
- Los sismos reales descargados desde la API de USGS dentro del polígono de Aysén.
- Campus de la Universidad de Aysén (Coyhaique) y CFT Estatal de Aysén (Puerto Aysén).
