---
id: respaldo_indicador_concentracion_estival_pct
title: "Respaldo de Indicador — Concentración Turística Estival (concentracion_estival_pct)"
type: respaldo_indicador
variable_clave: "concentracion_estival_pct"
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

# Respaldo de Indicador: `concentracion_estival_pct`

- **Nombre**: Concentración Turística Estival
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: %
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 70,2 -> 54,8 (Variación de -21,9% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 70,2 | 54,8 | -15,4 | -21,9% | SI (Variación de -21,9% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 82,9 | 81,2 | -1,70 | -2,1% | NO |
| `11201` | Aysén | 71,6 | 61,4 | -10,2 | -14,2% | NO |
| `11202` | Cisnes | 82,3 | 77,8 | -4,50 | -5,5% | NO |
| `11203` | Guaitecas | 81,5 | 69,5 | -12 | -14,7% | NO |
| `11301` | Cochrane | 83,5 | 80,4 | -3,10 | -3,7% | NO |
| `11302` | O'Higgins | 92 | 88,2 | -3,80 | -4,1% | NO |
| `11303` | Tortel | 88,5 | 86,8 | -1,70 | -1,9% | NO |
| `11401` | Chile Chico | 79,6 | 74,6 | -5 | -6,3% | NO |
| `11402` | Río Ibáñez | 86 | 85,6 | -0,40 | -0,5% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
