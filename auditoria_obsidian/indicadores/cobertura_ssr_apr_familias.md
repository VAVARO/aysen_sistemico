---
id: respaldo_indicador_cobertura_ssr_apr_familias
title: "Respaldo de Indicador — Cobertura Servicios Sanitarios Rurales (APR) (cobertura_ssr_apr_familias)"
type: respaldo_indicador
variable_clave: "cobertura_ssr_apr_familias"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 23
unidad: "familias"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: true
ultima_corrida: "2026-11-27"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
  - requiere-verificacion
---

# Respaldo de Indicador: `cobertura_ssr_apr_familias`

- **Nombre**: Cobertura Servicios Sanitarios Rurales (APR)
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #23
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: familias
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / Ministerio de Desarrollo Social y Familia (MDSF) (https://censo2024.ine.gob.cl/)
- **Frecuencia / Modo**: Decenal (Censo) / Bienal (CASEN) · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 10.500 -> 3.350 (Variación de -68,1% (umbral operativo >= 20%)); Lago Verde: 620 -> 210 (Variación de -66,1% (umbral operativo >= 20%)); Aysén: 5.500 -> 1.790 (Variación de -67,5% (umbral operativo >= 20%)); Cisnes: 3.100 -> 1.050 (Variación de -66,1% (umbral operativo >= 20%)); Guaitecas: 1.420 -> 551 (Variación de -61,2% (umbral operativo >= 20%)); Cochrane: 1.450 -> 450 (Variación de -69,0% (umbral operativo >= 20%)); O'Higgins: 610 -> 174 (Variación de -71,5% (umbral operativo >= 20%)); Tortel: 480 -> 150 (Variación de -68,8% (umbral operativo >= 20%)); Chile Chico: 2.350 -> 780 (Variación de -66,8% (umbral operativo >= 20%)); Río Ibáñez: 2.050 -> 680 (Variación de -66,8% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 10.500 | 3.350 | -7.150 | -68,1% | SI (Variación de -68,1% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 620 | 210 | -410 | -66,1% | SI (Variación de -66,1% (umbral operativo >= 20%)) |
| `11201` | Aysén | 5.500 | 1.790 | -3.710 | -67,5% | SI (Variación de -67,5% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 3.100 | 1.050 | -2.050 | -66,1% | SI (Variación de -66,1% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 1.420 | 551 | -869 | -61,2% | SI (Variación de -61,2% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 1.450 | 450 | -1.000 | -69,0% | SI (Variación de -69,0% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 610 | 174 | -436 | -71,5% | SI (Variación de -71,5% (umbral operativo >= 20%)) |
| `11303` | Tortel | 480 | 150 | -330 | -68,8% | SI (Variación de -68,8% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 2.350 | 780 | -1.570 | -66,8% | SI (Variación de -66,8% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 2.050 | 680 | -1.370 | -66,8% | SI (Variación de -66,8% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
