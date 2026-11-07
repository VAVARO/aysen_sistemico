# Sincronización y Auditoría Integral de Remedios (Ejes 1 al 6)
**Plataforma Sistémica de Aysén — Auditoría de Código y Alineamiento Arquitectural**
**Fecha**: 2026-11-07
**Autor**: Álvaro Contreras Barrios

---

## 1. Resumen Ejecutivo
El presente documento certifica la implementación exhaustiva de las observaciones y remedios contractuales planteados por la revisión de código técnica en los Ejes 1 al 6. Las modificaciones aseguran la coherencia entre el Data Lake territorial, el compilador del bundle estático, los visualizadores analíticos y el motor conversacional cerrado OmniRoute.

---

## 2. Detalle de Cambios por Eje

### Eje 1. Consistencia Semántica del Hub VIII (Salud)
- **Archivo modificado**: `data/nl_lexicon_aysen.json` (L575-722, L879-899).
- **Acción**:
  - Reclasificación de las 7 variables clave de salud asistencial (`urgencias_respiratorias_pct`, `camas_hospitalarias`, `medicos_por_mil_hab`, `aeroevacuaciones_samu_n`, `espera_no_ges_n`, `traslado_coyhaique_hrs`, `salud_principal`) de `"hub": "social"` a `"hub": "salud"` y `"hubTitle": "VIII. Salud"`.
  - Eliminación de la ambigüedad que fragmentaba el catálogo entre la dimensión social y la red hospitalaria/asistencial del DEIS MINSAL.

### Eje 2. Inferencia de Hubs y Catálogo Autoexplicativo en Laboratorio
- **Archivo modificado**: `laboratorio.html`.
- **Acción**:
  - Actualización y elevación de alcance funcional de `hubInference(k)` al cuerpo de `loadDataLakeAndCatalog` para evitar excepciones de `ReferenceError: hubInference is not defined` durante el registro de series de tiempo de `barometro`, garantizando inferencia unificada tanto en la iteración comunal como en el registro de series dinámicas.
  - Elevación de alcance de `existingIds` a nivel de función `loadDataLakeAndCatalog` previniendo errores de `ReferenceError: existingIds is not defined` durante la ingesta de módulos de extensión (`cultura_patrimonio` y `ctci_innovacion`).
  - Reclasificación de las series del Servicio de Salud Aysén (`urgencias_respiratorias_anuales_ssa` y `egresos_hospitalarios_red_ssa`) a `hubId: 'salud'` y `hubTitle: 'VIII. Salud'`.
  - Población de las 32 nuevas variables en `AUTOEXPLANATORY_VAR_DICT` con títulos, unidades y fuentes explícitas (MOP Vialidad, SUBTEL, MINVU, DOH, ODEPA / INFOR, DGA, DEIS MINSAL, UAysén Barómetro).
  - Sincronización dinámica de `syncSeriesDefs` con `AppState.hubsData.series` para registrar `emporcha_toneladas`, `emporcha_cruceros`, `balmaceda_pasajeros_jac` y `barometro`.

### Eje 3. Síntesis Regional y Memoria Conversacional en OmniRoute
- **Archivo modificado**: `js/omniroute_client.js`.
- **Acción**:
  - Diferenciación rigurosa entre consultas con foco en métricas específicas (`hasSpecificMetricFocus: true`, ej. FCM, barcazas, leña) y consultas regionales de exploración sectorial (`isBroadSectorQuery: true`, ej. `"dame datos del barómetro de la u de aysen"`, `"qué datos tienes de conectividad"`).
  - Implementación del Caso B.2 (Síntesis Regional de Sector / Fuente Multidimensional) en `synthesizeFromMemoryPacket`: genera un resumen estructurado de hasta 8 indicadores con agregaciones regionales (Totales o Promedios según corresponda), máximos y mínimos comunales, garantizando un largo textual analítico conciso.
  - Sincronización de rotación de indicadores tanto en el texto analítico como en las variables del gráfico (`chart.varX`, `chart.varY`, `chart.yKey`, `chart.y2Key`) ante repreguntas conversacionales regionales (`"¿y no tienes más datos?"`, `"¿qué más tienes?"`) sin caer en el error de indicador inexistente.
  - Fijación de `_conversationState.lastDomain = 'barometro'` ante cualquier activación de variables `barometro_*` (incluyendo `activeKeys`).
  - Inyección completa de variables de sector en `buildMemoryGroundedPrompts` para el LLM en `localhost:20128` y fallback determinista estricto en caso de desconexión.
  - Alineación de `relatedHub` para respetar `getHubForVariable(chartSpec.varX)` en consultas métricas específicas y `matchedSector.hub` únicamente en consultas sectoriales amplias.

### Eje 4. Estado Inicial Neutro del Consultor Territorial
- **Archivo modificado**: `consultor.html`.
- **Acción**:
  - Reemplazo del gráfico precargado por defecto en `DOMContentLoaded`: se inicializa con `currentChartState.render = false`, `varX: null`, `varY: null`.
  - Inserción del contenedor `#emptyEvidenceState` con estilos `.empty-evidence` que presenta un estado visual sobrio invitando al análisis sin asumir una pregunta predeterminada.
  - Revelación dinámica de la barra de herramientas `#evidenceToolbar`, el pie de evidencia `#evidenceFooter` y el lienzo `#chartSection` únicamente cuando `applyChartSpec(spec)` recibe una especificación real con `spec.render === true`.

### Eje 5. Integridad Gráfica y Textual en Data Hub e Inteligencia Territorial
- **Archivo modificado**: `index.html`.
- **Acción**:
  - Filtrado contractual de enlaces D3 en `initOrUpdateD3Map` contra `validNodeIds = new Set(allNodes.map(n => n.nodeId || n.id))` antes de inicializar `d3.forceLink(links)`, previniendo errores de nodos no resueltos.
  - Sincronización de etiquetas de nodos en tarjetas de Hubs:
    * Hub VI (Social): Nodos #23, #25, #26.
    * Hub VII (Biodiversidad): Nodos #27 a #31.
    * Hub VIII (Salud): Nodos #24, #38, #39.
  - Actualización de textos institucionales a `"34 Fuentes"` preservando intactos selectores contractuales del DOM como `#tbody-28-fuentes`.
  - Inclusión en `initProvenanceFlowchart()` de las nuevas instituciones territoriales: `inst-emporcha`, `inst-minvu`, `inst-odepa` e `inst-uaysen`.
  - Enlace de `openComunaProfileModal` exponiendo tarjetas e indicadores de Conectividad Multimodal, Vivienda y Agua Rural, Silvoagropecuario y Barómetro Patagonia.

### Eje 6. Persistencia y Compilación del Data Lake y Bundle
- **Archivos modificados**:
  - `scripts/build_aysen_hubs_bundle.cjs`
  - `data/raw/informes_territoriales/deficit_habitacional_minvu_aysen.json`
  - `data/raw/informes_territoriales/censo_agropecuario_forestal_odepa_infor.json`
  - `data/raw/informes_territoriales/determinantes_sociales_salud_minsal.json`
  - `data/raw/barometro/barometro_patagonia_uaysen.json`
  - `js/systemic_atlas.js`
  - `data/systemic/provenance_catalog.json`
- **Acción**:
  - Persistencia física de los 4 datasets de respaldo territorial en disco para que `loadOpt()` los resuelva sin advertencias de archivos faltantes.
  - Integración en `comunas` de los campos territoriales de `wp09`, `wp10` y `wp11`.
  - Exportación de `conectividadMultimodal: { terminalesPortuarios, rutasMaritimas, redAeroportuaria }` y `spatialFiles` dentro del bundle `data/aysen_hubs_data.js`.
  - Actualización de `SystemicAtlas` para incorporar `wp07`–`wp11` y `fromHubsBundle(window.AYSEN_HUBS_DATA)`.
  - Actualización de `provenance_catalog.json` a `"total_hubs": 10`, `"total_nodos": 39` incluyendo los nodos satélite `#32` al `#39` y las fuentes de los paquetes de trabajo WP_08 a WP_11.

---

## 3. Matriz de Validación de Suites Automatizadas
Todas las pruebas de integridad y regresión del repositorio fueron ejecutadas en el entorno local:

1. **Compilación de Bundle**: `node scripts/build_aysen_hubs_bundle.cjs` -> Generación exitosa (1.291.433 bytes, 10 Hubs, 39 Nodos, 0 nulls, 0 emojis).
2. **Sincronía de Bundle**: `node scripts/verify_bundle_sync.cjs` -> 100% en sincronía con `data/systemic/`.
3. **Limpieza Anti-Slop de Emojis**: `python scripts/clean_emojis.py` -> 0 emojis detectados en todos los archivos del sistema.
4. **Validador Data Lake (WP_01 a WP_07)**: `python scripts/validate_data_lake.py --all` -> 100% PASS en los 7 paquetes evaluados.
5. **Suite de Integridad Institucional**: `python scripts/test_fuentes_integridad.py` -> 37/37 pruebas aprobadas (100.0% salud de datos).
6. **Auditoría Editorial M1**: `python tests/verify_m1_editorial.py` -> 8/8 pruebas aprobadas.
7. **Checklist 10 Hubs y 39 Nodos**: `python tests/verify_10_hubs_checklist.py` -> 4/4 bloques técnicos verificados al 100%.
8. **Suite Pytest Completa**: `python -m pytest tests/` -> 464 de 464 pruebas aprobadas en 44.15 segundos (0 fallos).
