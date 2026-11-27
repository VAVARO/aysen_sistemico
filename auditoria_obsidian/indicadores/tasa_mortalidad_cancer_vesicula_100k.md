---
id: respaldo_indicador_tasa_mortalidad_cancer_vesicula_100k
title: "Respaldo de Indicador — Tasa de Mortalidad por Cáncer de Vesícula (DEIS) (tasa_mortalidad_cancer_vesicula_100k)"
type: respaldo_indicador
variable_clave: "tasa_mortalidad_cancer_vesicula_100k"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "salud"
hub_titulo: "VIII. Salud"
nodo_id: 38
unidad: "def/100k hab"
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

# Respaldo de Indicador: `tasa_mortalidad_cancer_vesicula_100k`

- **Nombre**: Tasa de Mortalidad por Cáncer de Vesícula (DEIS)
- **Hub / Nodo**: VIII. Salud · Nodo #38
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: def/100k hab
- **Fuente oficial**: Servicio de Salud Aysén (SSA) / DEIS MINSAL (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 10,8 -> 15,8 (Variación de +46,3% (umbral operativo >= 20%)); Lago Verde: 14,9 -> 21,4 (Variación de +43,6% (umbral operativo >= 20%)); Aysén: 12,1 -> 17,6 (Variación de +45,5% (umbral operativo >= 20%)); Cisnes: 12,4 -> 18,1 (Variación de +46,0% (umbral operativo >= 20%)); Guaitecas: 13,5 -> 19,5 (Variación de +44,4% (umbral operativo >= 20%)); Cochrane: 11,8 -> 17,2 (Variación de +45,8% (umbral operativo >= 20%)); O'Higgins: 11,6 -> 16,9 (Variación de +45,7% (umbral operativo >= 20%)); Tortel: 11,5 -> 16,6 (Variación de +44,3% (umbral operativo >= 20%)); Chile Chico: 13,2 -> 19,2 (Variación de +45,5% (umbral operativo >= 20%)); Río Ibáñez: 14,2 -> 20,6 (Variación de +45,1% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 10,8 | 15,8 | 5 | +46,3% | SI (Variación de +46,3% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 14,9 | 21,4 | 6,50 | +43,6% | SI (Variación de +43,6% (umbral operativo >= 20%)) |
| `11201` | Aysén | 12,1 | 17,6 | 5,50 | +45,5% | SI (Variación de +45,5% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 12,4 | 18,1 | 5,70 | +46,0% | SI (Variación de +46,0% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 13,5 | 19,5 | 6 | +44,4% | SI (Variación de +44,4% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 11,8 | 17,2 | 5,40 | +45,8% | SI (Variación de +45,8% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 11,6 | 16,9 | 5,30 | +45,7% | SI (Variación de +45,7% (umbral operativo >= 20%)) |
| `11303` | Tortel | 11,5 | 16,6 | 5,10 | +44,3% | SI (Variación de +44,3% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 13,2 | 19,2 | 6 | +45,5% | SI (Variación de +45,5% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 14,2 | 20,6 | 6,40 | +45,1% | SI (Variación de +45,1% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
