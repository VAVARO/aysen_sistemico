---
id: respaldo_indicador_visitas_por_pernoctacion_ratio
title: "Respaldo de Indicador — Ratio Visitas por Pernoctación (visitas_por_pernoctacion_ratio)"
type: respaldo_indicador
variable_clave: "visitas_por_pernoctacion_ratio"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "ratio"
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

# Respaldo de Indicador: `visitas_por_pernoctacion_ratio`

- **Nombre**: Ratio Visitas por Pernoctación
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: ratio
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 0,26 -> 0 (Caída a 0 desde 0,26); Aysén: 0,30 -> 0,12 (Variación de -60,0% (umbral operativo >= 20%)); Cisnes: 0,87 -> 0,57 (Variación de -34,5% (umbral operativo >= 20%)); Guaitecas: 0,44 -> 0 (Caída a 0 desde 0,44); Cochrane: 0,72 -> 0,43 (Variación de -40,3% (umbral operativo >= 20%)); O'Higgins: 0,76 -> 0 (Caída a 0 desde 0,76); Tortel: 0,53 -> 0 (Caída a 0 desde 0,53); Chile Chico: 0,58 -> 0,25 (Variación de -56,9% (umbral operativo >= 20%)); Río Ibáñez: 0,48 -> 0,31 (Variación de -35,4% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 0,18 | 0,15 | -0,03 | -16,7% | NO |
| `11102` | Lago Verde | 0,26 | 0 | -0,26 | -100,0% | SI (Caída a 0 desde 0,26) |
| `11201` | Aysén | 0,30 | 0,12 | -0,18 | -60,0% | SI (Variación de -60,0% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 0,87 | 0,57 | -0,30 | -34,5% | SI (Variación de -34,5% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 0,44 | 0 | -0,44 | -100,0% | SI (Caída a 0 desde 0,44) |
| `11301` | Cochrane | 0,72 | 0,43 | -0,29 | -40,3% | SI (Variación de -40,3% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 0,76 | 0 | -0,76 | -100,0% | SI (Caída a 0 desde 0,76) |
| `11303` | Tortel | 0,53 | 0 | -0,53 | -100,0% | SI (Caída a 0 desde 0,53) |
| `11401` | Chile Chico | 0,58 | 0,25 | -0,33 | -56,9% | SI (Variación de -56,9% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 0,48 | 0,31 | -0,17 | -35,4% | SI (Variación de -35,4% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
