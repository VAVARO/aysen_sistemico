---
id: respaldo_indicador_estadia_promedio_dias
title: "Respaldo de Indicador — Estadía Turística Promedio (estadia_promedio_dias)"
type: respaldo_indicador
variable_clave: "estadia_promedio_dias"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "días"
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

# Respaldo de Indicador: `estadia_promedio_dias`

- **Nombre**: Estadía Turística Promedio
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: días
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 2,70 -> 1,89 (Variación de -30,0% (umbral operativo >= 20%)); Aysén: 2,30 -> 1,83 (Variación de -20,4% (umbral operativo >= 20%)); Cochrane: 2,50 -> 1,92 (Variación de -23,2% (umbral operativo >= 20%)); O'Higgins: 2,80 -> 1,92 (Variación de -31,4% (umbral operativo >= 20%)); Chile Chico: 2,40 -> 1,88 (Variación de -21,7% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 2,70 | 1,89 | -0,81 | -30,0% | SI (Variación de -30,0% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 2 | 1,87 | -0,13 | -6,5% | NO |
| `11201` | Aysén | 2,30 | 1,83 | -0,47 | -20,4% | SI (Variación de -20,4% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 2,10 | 1,82 | -0,28 | -13,3% | NO |
| `11203` | Guaitecas | 2,30 | 1,92 | -0,38 | -16,5% | NO |
| `11301` | Cochrane | 2,50 | 1,92 | -0,58 | -23,2% | SI (Variación de -23,2% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 2,80 | 1,92 | -0,88 | -31,4% | SI (Variación de -31,4% (umbral operativo >= 20%)) |
| `11303` | Tortel | 1,90 | 1,78 | -0,12 | -6,3% | NO |
| `11401` | Chile Chico | 2,40 | 1,88 | -0,52 | -21,7% | SI (Variación de -21,7% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 2,10 | 1,77 | -0,33 | -15,7% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
