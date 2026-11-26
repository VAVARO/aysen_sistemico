---
id: respaldo_indicador_visitas_por_cama_turistica
title: "Respaldo de Indicador — Visitas por Cama Turística (visitas_por_cama_turistica)"
type: respaldo_indicador
variable_clave: "visitas_por_cama_turistica"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "visitas/cama"
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

# Respaldo de Indicador: `visitas_por_cama_turistica`

- **Nombre**: Visitas por Cama Turística
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: visitas/cama
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 11,3 -> 6,20 (Variación de -45,1% (umbral operativo >= 20%)); Lago Verde: 10,9 -> 0 (Caída a 0 desde 10,9); Aysén: 16 -> 3,80 (Variación de -76,3% (umbral operativo >= 20%)); Cisnes: 51,8 -> 20,7 (Variación de -60,0% (umbral operativo >= 20%)); Guaitecas: 16,6 -> 0 (Caída a 0 desde 16,6); Cochrane: 51,6 -> 14,3 (Variación de -72,3% (umbral operativo >= 20%)); O'Higgins: 51,7 -> 0 (Caída a 0 desde 51,7); Tortel: 39,4 -> 0 (Caída a 0 desde 39,4); Chile Chico: 43,8 -> 8,50 (Variación de -80,6% (umbral operativo >= 20%)); Río Ibáñez: 35,7 -> 13,7 (Variación de -61,6% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 11,3 | 6,20 | -5,10 | -45,1% | SI (Variación de -45,1% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 10,9 | 0 | -10,9 | -100,0% | SI (Caída a 0 desde 10,9) |
| `11201` | Aysén | 16 | 3,80 | -12,2 | -76,3% | SI (Variación de -76,3% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 51,8 | 20,7 | -31,1 | -60,0% | SI (Variación de -60,0% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 16,6 | 0 | -16,6 | -100,0% | SI (Caída a 0 desde 16,6) |
| `11301` | Cochrane | 51,6 | 14,3 | -37,3 | -72,3% | SI (Variación de -72,3% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 51,7 | 0 | -51,7 | -100,0% | SI (Caída a 0 desde 51,7) |
| `11303` | Tortel | 39,4 | 0 | -39,4 | -100,0% | SI (Caída a 0 desde 39,4) |
| `11401` | Chile Chico | 43,8 | 8,50 | -35,3 | -80,6% | SI (Variación de -80,6% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 35,7 | 13,7 | -22,0 | -61,6% | SI (Variación de -61,6% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
