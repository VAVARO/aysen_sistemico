---
id: respaldo_indicador_visitantes_snaspe
title: "Respaldo de Indicador — Visitantes Anuales a Parques SNASPE CONAF (visitantes_snaspe)"
type: respaldo_indicador
variable_clave: "visitantes_snaspe"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 4
unidad: "visitantes"
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

# Respaldo de Indicador: `visitantes_snaspe`

- **Nombre**: Visitantes Anuales a Parques SNASPE CONAF
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #4
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: visitantes
- **Fuente oficial**: Corporación Nacional Forestal (CONAF) — Gerencia de Áreas Silvestres Protegidas (https://www.conaf.cl/centro-documental/visitacion-ap-2025/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 38.500 -> 21.190 (Variación de -45,0% (umbral operativo >= 20%)); Lago Verde: 1.800 -> 0 (Caída a 0 desde 1.800); Aysén: 29.600 -> 7.048 (Variación de -76,2% (umbral operativo >= 20%)); Cisnes: 64.200 -> 25.619 (Variación de -60,1% (umbral operativo >= 20%)); Guaitecas: 2.400 -> 0 (Caída a 0 desde 2.400); Cochrane: 35.600 -> 9.853 (Variación de -72,3% (umbral operativo >= 20%)); O'Higgins: 12.400 -> 0 (Caída a 0 desde 12.400); Tortel: 14.200 -> 0 (Caída a 0 desde 14.200); Chile Chico: 34.200 -> 6.600 (Variación de -80,7% (umbral operativo >= 20%)); Río Ibáñez: 41.000 -> 15.807 (Variación de -61,4% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 38.500 | 21.190 | -17.310 | -45,0% | SI (Variación de -45,0% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 1.800 | 0 | -1.800 | -100,0% | SI (Caída a 0 desde 1.800) |
| `11201` | Aysén | 29.600 | 7.048 | -22.552 | -76,2% | SI (Variación de -76,2% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 64.200 | 25.619 | -38.581 | -60,1% | SI (Variación de -60,1% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 2.400 | 0 | -2.400 | -100,0% | SI (Caída a 0 desde 2.400) |
| `11301` | Cochrane | 35.600 | 9.853 | -25.747 | -72,3% | SI (Variación de -72,3% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 12.400 | 0 | -12.400 | -100,0% | SI (Caída a 0 desde 12.400) |
| `11303` | Tortel | 14.200 | 0 | -14.200 | -100,0% | SI (Caída a 0 desde 14.200) |
| `11401` | Chile Chico | 34.200 | 6.600 | -27.600 | -80,7% | SI (Variación de -80,7% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 41.000 | 15.807 | -25.193 | -61,4% | SI (Variación de -61,4% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
