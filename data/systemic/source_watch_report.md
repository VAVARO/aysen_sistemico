# Orden de Trabajo: Fuentes del Data Lake de Aysen

- Generado: 2026-10-20T19:50:49+00:00
- Nodos evaluados: 31
- Resumen: UNCHANGED 15 · DUE 10 · BASELINE 6

> Regla: un `CHANGED` de Tier B NO es un dato nuevo hasta confirmarlo
> contra la fuente. `similarity` cercano a 1.0 suele ser maquetacion.

## VENCIDO - Ventana de actualizacion pasada (10)

| # | Nodo | Frecuencia | Edad dias | Corte |
|---|---|---|---|---|
| 1 | Prestadores Registrados SERNATUR | Mensual | 49 | Catastro Registro Nacional SERNATUR · Corte Septiemb |
| 3 | Pernoctaciones y Estacionalidad (EMAT) | Mensual | 80 | Encuesta Mensual de Alojamiento Turístico (EMAT) INE |
| 9 | Monitoreo Marino, Oxígeno Disuelto y FAN | Mensual | 49 | Programa de Monitoreo de Floraciones Algales Nocivas |
| 13 | Precios de Combustibles y Leña por Comuna (CNE) | Semanal / Mensual | 19 | Precios semanales en estaciones de servicio y catast |
| 15 | Presupuestos Municipales y Patentes (SINIM) | Trimestral | 141 | Presupuestos Devengados e Ingresos Propios Permanent |
| 19 | Proyectos de Inversión en el SEIA (RCA) | Mensual | 49 | Base Oficial de Proyectos Calificados y en Evaluació |
| 23 | Demografía Censo 2024 y Pobreza CASEN | Decenal (Censo) / Bienal (CASEN) | 1023 | Resultados Oficiales del Censo de Población y Vivien |
| 24 | Red Asistencial de Salud y Evacuación SAMU | Mensual | 49 | Registro de Establecimientos de Salud (DEIS) y Tiemp |
| 30 | Monitoreo Continuo de Calidad del Aire (SINCA) e Hid | Horario / Continuo | 19 | Monitoreo continuo en línea de estaciones telemétric |
| 31 | Complejos Volcánicos Activos (RNVV), Sismos (USGS) y | Tiempo real / Mensual | 19 | Boletines de Actividad Volcánica y Catálogo Sísmico  |

## LINEA BASE - Primera medicion (6)

| # | Nodo | Tier | HTTP |
|---|---|---|---|
| 4 | Visitantes a Parques Nacionales (CONAF) | B | 200 |
| 18 | Inversión Pública FNDR y Conectividad Ruta 7 | B | 200 |
| 21 | Concesiones Mineras y Yacimientos (SERNAGEOMIN) | B | 200 |
| 22 | Tenencia de Suelo Fiscal, SNASPE y Privada (BBNN / C | B | 200 |
| 26 | Seguridad Ciudadana y Delitos (CEAD / VIF) | B | 200 |
| 29 | Especies Exóticas Invasoras y Presión Ecológica | B | 200 |

## Siguiente paso

1. Confirmar cada `CHANGED` con `web_extract` sobre su `sourceUrl`.
2. Aplicar solo deltas confirmados sobre `data/systemic/<WP>.json` con `patch`.
3. Actualizar `collectionDate` y `nextUpdate` del nodo en `provenance_catalog.json`.
4. `node scripts/build_aysen_hubs_bundle.cjs` y `validate_data_lake.py --all`.
5. Re-correr con `--update-baseline` para fijar la nueva linea base.
