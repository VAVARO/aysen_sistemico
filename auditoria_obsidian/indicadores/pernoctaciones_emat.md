---
id: respaldo_indicador_pernoctaciones_emat
title: "Respaldo de Indicador — Pernoctaciones Turísticas Anuales EMAT (pernoctaciones_emat)"
type: respaldo_indicador
variable_clave: "pernoctaciones_emat"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "pernoctaciones"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: true
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
  - requiere-verificacion
---

# Respaldo de Indicador: `pernoctaciones_emat`

- **Nombre**: Pernoctaciones Turísticas Anuales EMAT
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: pernoctaciones
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 208.500 -> 138.400 (Variación de -33,6% (umbral operativo >= 20%)); Lago Verde: 6.800 -> 2.800 (Variación de -58,8% (umbral operativo >= 20%)); Aysén: 98.400 -> 58.200 (Variación de -40,9% (umbral operativo >= 20%)); Cisnes: 74.200 -> 44.800 (Variación de -39,6% (umbral operativo >= 20%)); Guaitecas: 5.400 -> 2.300 (Variación de -57,4% (umbral operativo >= 20%)); Cochrane: 49.200 -> 22.800 (Variación de -53,7% (umbral operativo >= 20%)); O'Higgins: 16.400 -> 6.439 (Variación de -60,7% (umbral operativo >= 20%)); Tortel: 27.000 -> 10.400 (Variación de -61,5% (umbral operativo >= 20%)); Chile Chico: 58.600 -> 26.500 (Variación de -54,8% (umbral operativo >= 20%)); Río Ibáñez: 86.200 -> 51.400 (Variación de -40,4% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 208.500 | 138.400 | -70.100 | -33,6% | SI (Variación de -33,6% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 6.800 | 2.800 | -4.000 | -58,8% | SI (Variación de -58,8% (umbral operativo >= 20%)) |
| `11201` | Aysén | 98.400 | 58.200 | -40.200 | -40,9% | SI (Variación de -40,9% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 74.200 | 44.800 | -29.400 | -39,6% | SI (Variación de -39,6% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 5.400 | 2.300 | -3.100 | -57,4% | SI (Variación de -57,4% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 49.200 | 22.800 | -26.400 | -53,7% | SI (Variación de -53,7% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 16.400 | 6.439 | -9.961 | -60,7% | SI (Variación de -60,7% (umbral operativo >= 20%)) |
| `11303` | Tortel | 27.000 | 10.400 | -16.600 | -61,5% | SI (Variación de -61,5% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 58.600 | 26.500 | -32.100 | -54,8% | SI (Variación de -54,8% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 86.200 | 51.400 | -34.800 | -40,4% | SI (Variación de -40,4% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
