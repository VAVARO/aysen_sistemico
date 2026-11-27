---
id: respaldo_indicador_tasa_dmcs_100k
title: "Respaldo de Indicador — Tasa Delitos de Mayor Connotación Social (DMCS) (tasa_dmcs_100k)"
type: respaldo_indicador
variable_clave: "tasa_dmcs_100k"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 26
unidad: "casos/100k hab"
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

# Respaldo de Indicador: `tasa_dmcs_100k`

- **Nombre**: Tasa Delitos de Mayor Connotación Social (DMCS)
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #26
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: casos/100k hab
- **Fuente oficial**: Subsecretaría de Prevención del Delito (SPD) — Centro de Estudios y Análisis del Delito (CEAD) (https://cead.minsegpublica.gob.cl/)
- **Frecuencia / Modo**: Trimestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 2.150,4 -> 1.702 (Variación de -20,9% (umbral operativo >= 20%)); Lago Verde: 420 -> 1.422,3 (Variación de +238,6% (umbral operativo >= 20%)); Aysén: 1.980,2 -> 1.197,6 (Variación de -39,5% (umbral operativo >= 20%)); Cisnes: 1.120 -> 1.754,1 (Variación de +56,6% (umbral operativo >= 20%)); Guaitecas: 890 -> 1.862,2 (Variación de +109,2% (umbral operativo >= 20%)); Cochrane: 1.280 -> 748,5 (Variación de -41,5% (umbral operativo >= 20%)); O'Higgins: 650 -> 1.481,5 (Variación de +127,9% (umbral operativo >= 20%)); Tortel: 510 -> 1.202,7 (Variación de +135,8% (umbral operativo >= 20%)); Chile Chico: 1.340 -> 1.743,2 (Variación de +30,1% (umbral operativo >= 20%)); Río Ibáñez: 910 -> 1.695,5 (Variación de +86,3% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 2.150,4 | 1.702 | -448,4 | -20,9% | SI (Variación de -20,9% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 420 | 1.422,3 | 1.002,3 | +238,6% | SI (Variación de +238,6% (umbral operativo >= 20%)) |
| `11201` | Aysén | 1.980,2 | 1.197,6 | -782,6 | -39,5% | SI (Variación de -39,5% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 1.120 | 1.754,1 | 634,1 | +56,6% | SI (Variación de +56,6% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 890 | 1.862,2 | 972,2 | +109,2% | SI (Variación de +109,2% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 1.280 | 748,5 | -531,5 | -41,5% | SI (Variación de -41,5% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 650 | 1.481,5 | 831,5 | +127,9% | SI (Variación de +127,9% (umbral operativo >= 20%)) |
| `11303` | Tortel | 510 | 1.202,7 | 692,7 | +135,8% | SI (Variación de +135,8% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 1.340 | 1.743,2 | 403,2 | +30,1% | SI (Variación de +30,1% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 910 | 1.695,5 | 785,5 | +86,3% | SI (Variación de +86,3% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
