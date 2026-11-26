---
id: respaldo_indicador_gasto_diario_turista_usd
title: "Respaldo de Indicador — Gasto Diario Promedio por Turista (gasto_diario_turista_usd)"
type: respaldo_indicador
variable_clave: "gasto_diario_turista_usd"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "US$/día"
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

# Respaldo de Indicador: `gasto_diario_turista_usd`

- **Nombre**: Gasto Diario Promedio por Turista
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: US$/día
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 118 -> 64 (Variación de -45,8% (umbral operativo >= 20%)); Aysén: 135 -> 96 (Variación de -28,9% (umbral operativo >= 20%)); Cisnes: 145 -> 108 (Variación de -25,5% (umbral operativo >= 20%)); Guaitecas: 85 -> 66 (Variación de -22,4% (umbral operativo >= 20%)); Cochrane: 130 -> 104 (Variación de -20,0% (umbral operativo >= 20%)); Chile Chico: 125 -> 74 (Variación de -40,8% (umbral operativo >= 20%)); Río Ibáñez: 150 -> 114 (Variación de -24,0% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 118 | 64 | -54 | -45,8% | SI (Variación de -45,8% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 68 | 58 | -10 | -14,7% | NO |
| `11201` | Aysén | 135 | 96 | -39 | -28,9% | SI (Variación de -28,9% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 145 | 108 | -37 | -25,5% | SI (Variación de -25,5% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 85 | 66 | -19 | -22,4% | SI (Variación de -22,4% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 130 | 104 | -26 | -20,0% | SI (Variación de -20,0% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 138 | 112 | -26 | -18,8% | NO |
| `11303` | Tortel | 115 | 95 | -20 | -17,4% | NO |
| `11401` | Chile Chico | 125 | 74 | -51 | -40,8% | SI (Variación de -40,8% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 150 | 114 | -36 | -24,0% | SI (Variación de -24,0% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
