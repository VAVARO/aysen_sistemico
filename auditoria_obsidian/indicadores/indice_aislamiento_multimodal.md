---
id: respaldo_indicador_indice_aislamiento_multimodal
title: "Respaldo de Indicador — Índice de Aislamiento Multimodal (indice_aislamiento_multimodal)"
type: respaldo_indicador
variable_clave: "indice_aislamiento_multimodal"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 14
unidad: "índice"
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

# Respaldo de Indicador: `indice_aislamiento_multimodal`

- **Nombre**: Índice de Aislamiento Multimodal
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #14
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: índice
- **Fuente oficial**: Subsecretaría de Telecomunicaciones (SUBTEL) — Proyecto FOA (https://www.subtel.gob.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 0 -> 1,10 (Transición desde 0 a 1,10); Aysén: 8,90 -> 5,80 (Variación de -34,8% (umbral operativo >= 20%)); Cisnes: 33 -> 19,2 (Variación de -41,8% (umbral operativo >= 20%)); Río Ibáñez: 31 -> 22,7 (Variación de -26,8% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 0 | 1,10 | 1,10 | N/A (desde 0) | SI (Transición desde 0 a 1,10) |
| `11201` | Aysén | 8,90 | 5,80 | -3,10 | -34,8% | SI (Variación de -34,8% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 33 | 19,2 | -13,8 | -41,8% | SI (Variación de -41,8% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 87,1 | 77,6 | -9,50 | -10,9% | NO |
| `11301` | Cochrane | 28,7 | 23,6 | -5,10 | -17,8% | NO |
| `11302` | O'Higgins | 86,6 | 86,4 | -0,20 | -0,2% | NO |
| `11303` | Tortel | 79,2 | 81,4 | 2,20 | +2,8% | NO |
| `11401` | Chile Chico | 27,9 | 30,6 | 2,70 | +9,7% | NO |
| `11402` | Río Ibáñez | 31 | 22,7 | -8,30 | -26,8% | SI (Variación de -26,8% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 9 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
