# WP_06: Turismo, Prestadores SERNATUR, ZOIT, Ocupación EMAT y Visitantes SNASPE

## 📋 Prompt de Traspaso (Copiar y pegar en un modelo económico / nueva sesión)

```text
Ejecuta el paquete de trabajo WP_06 (Turismo SERNATUR, Subsecretaría de Turismo, INE EMAT y CONAF Visitantes SNASPE) para el repositorio de Aysén.
REGLA DE TOKENS: NO leas mapa_territorial.html, index.html, data/series_prospectivas.json ni la carpeta .agents/.
Lee ÚNICAMENTE:
1. docs/handoff/MASTER_DATA_CONTRACT.md
2. docs/handoff/WP_06_TURISMO_SERNATUR.md

Tu tarea:
1. Crear y ejecutar el script `scripts/ingesta/wp_06_turismo_sernatur.py` en Python 3.11 estándar.
2. Consultar portales oficiales (SERNATUR DataTurismo, Registro Nacional de Prestadores de Servicios Turísticos SERNATUR, Subsecretaría de Turismo ZOIT, INE EMAT y CONAF Estadísticas Visitantes SNASPE), guardando los respaldos crudos y series periódicas en `data/raw/turismo_sernatur/`.
3. Generar `data/systemic/06_turismo_sernatur_conaf.json` con cobertura 10/10 comunas (`11101` a `11303`), series periódicas de actualización (mensual/estacional EMAT y anual CONAF) y al menos 18 nodos georreferenciados (Zonas de Interés Turístico ZOIT, Parques Nacionales según flujo de visitantes, polos turísticos como Capillas de Mármol/Puerto Río Tranquilo, Puyuhuapi, Caleta Tortel, Villa Cerro Castillo, Lago General Carrera).
4. Ejecutar `uv run python scripts/validate_data_lake.py --wp WP_06` hasta obtener `100% PASS`.
```

---

## 1. Fuentes Oficiales de SERNATUR, Subturismo, INE y CONAF (Con Frecuencia de Actualización)

1. **SERNATUR — Registro Nacional de Prestadores de Servicios Turísticos (`serviciosturisticos.sernatur.cl`)**:
   - **Frecuencia de actualización**: Continua / Mensual (`https://serviciosturisticos.sernatur.cl/` y `https://www.sernatur.cl/dataturismo/`).
   - Datos por comuna: Total de prestadores inscritos en SERNATUR, desglosados en Alojamientos Turísticos (hoteles, cabañas, lodges de pesca, hostales, camping), Operadores de Turismo Aventura (kayak, trekking en hielo, rafting en Río Baker, cabalgatas, pesca recreativa), Guías de Turismo registrados, Sellos de Calidad Turística (Sello Q) y Sellos de Sustentabilidad (Sello S).
2. **SERNATUR / INE — Encuesta Mensual de Alojamiento Turístico (EMAT) y Big Data Turismo Interno**:
   - **Frecuencia de actualización**: Mensual (~30 días de rezago en INE / DataTurismo SERNATUR `https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo`).
   - Destinos medidos en Aysén: *Coyhaique - Puerto Aysén*, *Carretera Austral Norte (Cisnes / Puyuhuapi / Queulat)*, *Carretera Austral Sur (Cuenca Lago General Carrera / Baker / Cochrane / Tortel / O'Higgins)*.
   - Variables críticas: Llegadas mensuales/anuales de pasajeros (chilenos vs extranjeros), pernoctaciones totales, estancia media (noches), tasa de ocupación en habitaciones (verano ene-feb vs invierno jun-jul), tarifa promedio diaria por habitación (ADR CLP) e ingreso por habitación disponible (RevPAR CLP).
3. **Subsecretaría de Turismo / SERNATUR — Zonas de Interés Turístico (ZOIT) en Aysén**:
   - Portal oficial: `https://www.subturismo.gob.cl/zoit/`
   - **Las ZOIT de Aysén**:
     - *ZOIT Chelenko* (Comunas de Chile Chico y Río Ibáñez — Lago General Carrera, Capillas de Mármol, Valle Exploradores, Jeinimeni, Cerro Castillo).
     - *ZOIT Aysén Patagonia Queulat* (Comunas de Cisnes y Aysén — Parque Nacional Queulat, Ventisquero Colgante, Termas de Puyuhuapi, La Junta, Raúl Marín Balmaceda).
     - *ZOIT Provincia de los Glaciares* (Comunas de Cochrane, O'Higgins y Tortel — Río Baker, Parque Nacional Patagonia, Caleta Tortel, Villa O'Higgins, Glaciar O'Higgins y Jorge Montt).
     - *ZOIT Destino Coyhaique / Valle Simpson* (Polo receptor y distribuidor regional).
4. **CONAF / SERNATUR — Estadísticas de Visitantes al SNASPE (Parques y Reservas Nacionales)**:
   - Portal oficial: `https://www.conaf.cl/parques-nacionales/visitanos/estadisticas-de-visitacion/`
   - **Frecuencia de actualización**: Anual / Temporada estival.
   - Visitantes anuales (nacionales vs extranjeros) en unidades de Aysén: Parque Nacional Queulat (~55.000+ visitantes/año), Parque Nacional Cerro Castillo, Reserva Nacional Río Simpson, Parque Nacional Laguna San Rafael, Parque Nacional Patagonia (sectores Chacabuco y Jeinimeni), Reserva Nacional Coyhaique, Reserva Nacional Tamango, más el flujo al Santuario de la Naturaleza Capillas de Mármol (Puerto Río Tranquilo).

---

## 2. Esquema Requerido por Comuna en `data/systemic/06_turismo_sernatur_conaf.json`

Dentro de cada elemento de `por_comuna[i].datos`, incluir obligatoriamente los 3 bloques exigidos por `validate_data_lake.py`:

```json
"datos": {
  "oferta_sernatur": {
    "prestadores_registrados_total": 420,
    "alojamientos_turisticos_sernatur": 185,
    "operadores_turismo_aventura": 78,
    "guias_turismo_registrados": 95,
    "sellos_calidad_q_y_sustentabilidad_s": 24,
    "capacidad_camas_estimada": 3450,
    "frecuencia_actualizacion_fuente": "Mensual (Registro Nacional SERNATUR)"
  },
  "demanda_emat_visitantes": {
    "destino_emat_sernatur": "Coyhaique - Reserva Cerro Castillo",
    "llegadas_turistas_anual": 92500,
    "pernoctaciones_anuales_emat": 215000,
    "proporcion_extranjeros_pct": 28.5,
    "ocupacion_alta_enero_febrero_pct": 78.4,
    "ocupacion_baja_invierno_pct": 31.2,
    "estancia_media_dias": 2.8,
    "gasto_diario_promedio_usd": 115.0,
    "visitantes_snaspe_conaf_anual": 42000
  },
  "zoit_y_atractivos": {
    "pertenece_a_zoit": true,
    "nombre_zoit": "ZOIT Coyhaique / ZOIT Chelenko / ZOIT Aysén Patagonia Queulat / ZOIT Provincia de los Glaciares",
    "atractivos_ancla": ["Reserva Nacional Coyhaique", "Río Simpson (Pesca con Mosca)", "Centro de Ski El Fraile"],
    "vocacion_turistica_principal": "Hub receptor regional, pesca con mosca (fly fishing) y naturaleza",
    "cuello_de_botella_turistico": "Estacionalidad invernal y conectividad aérea/vial"
  }
}
```
Además, a nivel superior del JSON, incluir `"series_mensuales_emat_sernatur"` con la curva mensual (enero a diciembre) de pernoctaciones y tasa de ocupación en Aysén para graficar la marcada estacionalidad turística patagónica.
