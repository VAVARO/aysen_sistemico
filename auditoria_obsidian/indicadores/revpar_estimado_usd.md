---
id: respaldo_indicador_revpar_estimado_usd
title: "Respaldo de Indicador — Ingreso por Habitación Disponible (RevPAR) (revpar_estimado_usd)"
type: respaldo_indicador
variable_clave: "revpar_estimado_usd"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "US$"
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

# Respaldo de Indicador: `revpar_estimado_usd`

- **Nombre**: Ingreso por Habitación Disponible (RevPAR)
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: US$
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 79,6 -> 18,9 (Variación de -76,3% (umbral operativo >= 20%)); Lago Verde: 28 -> 8 (Variación de -71,4% (umbral operativo >= 20%)); Aysén: 83,7 -> 21,7 (Variación de -74,1% (umbral operativo >= 20%)); Cisnes: 87,7 -> 21,4 (Variación de -75,6% (umbral operativo >= 20%)); Guaitecas: 39,4 -> 9,30 (Variación de -76,4% (umbral operativo >= 20%)); Cochrane: 73,9 -> 17,4 (Variación de -76,5% (umbral operativo >= 20%)); O'Higgins: 72,7 -> 10,7 (Variación de -85,3% (umbral operativo >= 20%)); Tortel: 62,9 -> 11,2 (Variación de -82,2% (umbral operativo >= 20%)); Chile Chico: 76,7 -> 14,2 (Variación de -81,5% (umbral operativo >= 20%)); Río Ibáñez: 90,1 -> 14,5 (Variación de -83,9% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 79,6 | 18,9 | -60,7 | -76,3% | SI (Variación de -76,3% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 28 | 8 | -20 | -71,4% | SI (Variación de -71,4% (umbral operativo >= 20%)) |
| `11201` | Aysén | 83,7 | 21,7 | -62 | -74,1% | SI (Variación de -74,1% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 87,7 | 21,4 | -66,3 | -75,6% | SI (Variación de -75,6% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 39,4 | 9,30 | -30,1 | -76,4% | SI (Variación de -76,4% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 73,9 | 17,4 | -56,5 | -76,5% | SI (Variación de -76,5% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 72,7 | 10,7 | -62 | -85,3% | SI (Variación de -85,3% (umbral operativo >= 20%)) |
| `11303` | Tortel | 62,9 | 11,2 | -51,7 | -82,2% | SI (Variación de -82,2% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 76,7 | 14,2 | -62,5 | -81,5% | SI (Variación de -81,5% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 90,1 | 14,5 | -75,6 | -83,9% | SI (Variación de -83,9% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
