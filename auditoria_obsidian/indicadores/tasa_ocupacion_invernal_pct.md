---
id: respaldo_indicador_tasa_ocupacion_invernal_pct
title: "Respaldo de Indicador — Tasa de Ocupación Hotelera Invernal (tasa_ocupacion_invernal_pct)"
type: respaldo_indicador
variable_clave: "tasa_ocupacion_invernal_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "%"
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

# Respaldo de Indicador: `tasa_ocupacion_invernal_pct`

- **Nombre**: Tasa de Ocupación Hotelera Invernal
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: %
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 12 -> 8,50 (Variación de -29,2% (umbral operativo >= 20%)); Guaitecas: 14,5 -> 11,2 (Variación de -22,8% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 32,4 | 28,4 | -4 | -12,3% | NO |
| `11102` | Lago Verde | 12 | 8,50 | -3,50 | -29,2% | SI (Variación de -29,2% (umbral operativo >= 20%)) |
| `11201` | Aysén | 28,6 | 24,6 | -4 | -14,0% | NO |
| `11202` | Cisnes | 18,2 | 15,8 | -2,40 | -13,2% | NO |
| `11203` | Guaitecas | 14,5 | 11,2 | -3,30 | -22,8% | SI (Variación de -22,8% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 16 | 13,8 | -2,20 | -13,7% | NO |
| `11302` | O'Higgins | 7,50 | 6,80 | -0,70 | -9,3% | NO |
| `11303` | Tortel | 11 | 9,20 | -1,80 | -16,4% | NO |
| `11401` | Chile Chico | 21 | 17,5 | -3,50 | -16,7% | NO |
| `11402` | Río Ibáñez | 14,5 | 12,4 | -2,10 | -14,5% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
