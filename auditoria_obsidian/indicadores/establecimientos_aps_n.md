---
id: respaldo_indicador_establecimientos_aps_n
title: "Respaldo de Indicador — Establecimientos de Atención Primaria de Salud (APS) (establecimientos_aps_n)"
type: respaldo_indicador
variable_clave: "establecimientos_aps_n"
tipo_dato: "numeric"
nivel_umbral: "estructural"
umbral_outlier_pct: 5
hub: "salud"
hub_titulo: "VIII. Salud"
nodo_id: 38
unidad: "establecimientos"
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

# Respaldo de Indicador: `establecimientos_aps_n`

- **Nombre**: Establecimientos de Atención Primaria de Salud (APS)
- **Hub / Nodo**: VIII. Salud · Nodo #38
- **Umbral de outlier**: estructural (>= 5%)
- **Unidad**: establecimientos
- **Fuente oficial**: Servicio de Salud Aysén (SSA) / DEIS MINSAL (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 13 -> 12 (Variación de -7,7% (umbral estructural >= 5%)); Lago Verde: 5 -> 3 (Variación de -40,0% (umbral estructural >= 5%)); Aysén: 7 -> 6 (Variación de -14,3% (umbral estructural >= 5%)); Guaitecas: 3 -> 2 (Variación de -33,3% (umbral estructural >= 5%)); Cochrane: 3 -> 0 (Caída a 0 desde 3); O'Higgins: 3 -> 1 (Variación de -66,7% (umbral estructural >= 5%)); Tortel: 3 -> 1 (Variación de -66,7% (umbral estructural >= 5%)); Chile Chico: 4 -> 5 (Variación de +25,0% (umbral estructural >= 5%)); Río Ibáñez: 5 -> 7 (Variación de +40,0% (umbral estructural >= 5%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 13 | 12 | -1 | -7,7% | SI (Variación de -7,7% (umbral estructural >= 5%)) |
| `11102` | Lago Verde | 5 | 3 | -2 | -40,0% | SI (Variación de -40,0% (umbral estructural >= 5%)) |
| `11201` | Aysén | 7 | 6 | -1 | -14,3% | SI (Variación de -14,3% (umbral estructural >= 5%)) |
| `11203` | Guaitecas | 3 | 2 | -1 | -33,3% | SI (Variación de -33,3% (umbral estructural >= 5%)) |
| `11301` | Cochrane | 3 | 0 | -3 | -100,0% | SI (Caída a 0 desde 3) |
| `11302` | O'Higgins | 3 | 1 | -2 | -66,7% | SI (Variación de -66,7% (umbral estructural >= 5%)) |
| `11303` | Tortel | 3 | 1 | -2 | -66,7% | SI (Variación de -66,7% (umbral estructural >= 5%)) |
| `11401` | Chile Chico | 4 | 5 | 1 | +25,0% | SI (Variación de +25,0% (umbral estructural >= 5%)) |
| `11402` | Río Ibáñez | 5 | 7 | 2 | +40,0% | SI (Variación de +40,0% (umbral estructural >= 5%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 9 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
