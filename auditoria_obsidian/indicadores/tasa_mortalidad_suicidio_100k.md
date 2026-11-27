---
id: respaldo_indicador_tasa_mortalidad_suicidio_100k
title: "Respaldo de Indicador — Tasa de Mortalidad por Suicidio (DEIS) (tasa_mortalidad_suicidio_100k)"
type: respaldo_indicador
variable_clave: "tasa_mortalidad_suicidio_100k"
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

# Respaldo de Indicador: `tasa_mortalidad_suicidio_100k`

- **Nombre**: Tasa de Mortalidad por Suicidio (DEIS)
- **Hub / Nodo**: VIII. Salud · Nodo #38
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: def/100k hab
- **Fuente oficial**: Servicio de Salud Aysén (SSA) / DEIS MINSAL (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 13,4 -> 17,8 (Variación de +32,8% (umbral operativo >= 20%)); Lago Verde: 17,8 -> 23,4 (Variación de +31,5% (umbral operativo >= 20%)); Aysén: 15,6 -> 20,6 (Variación de +32,1% (umbral operativo >= 20%)); Cisnes: 14,8 -> 19,5 (Variación de +31,8% (umbral operativo >= 20%)); Guaitecas: 16,2 -> 21,3 (Variación de +31,5% (umbral operativo >= 20%)); Cochrane: 13,9 -> 18,3 (Variación de +31,7% (umbral operativo >= 20%)); O'Higgins: 14,2 -> 18,7 (Variación de +31,7% (umbral operativo >= 20%)); Tortel: 13,8 -> 18,2 (Variación de +31,9% (umbral operativo >= 20%)); Chile Chico: 14,5 -> 19,1 (Variación de +31,7% (umbral operativo >= 20%)); Río Ibáñez: 16,8 -> 22,1 (Variación de +31,5% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 13,4 | 17,8 | 4,40 | +32,8% | SI (Variación de +32,8% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 17,8 | 23,4 | 5,60 | +31,5% | SI (Variación de +31,5% (umbral operativo >= 20%)) |
| `11201` | Aysén | 15,6 | 20,6 | 5,00 | +32,1% | SI (Variación de +32,1% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 14,8 | 19,5 | 4,70 | +31,8% | SI (Variación de +31,8% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 16,2 | 21,3 | 5,10 | +31,5% | SI (Variación de +31,5% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 13,9 | 18,3 | 4,40 | +31,7% | SI (Variación de +31,7% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 14,2 | 18,7 | 4,50 | +31,7% | SI (Variación de +31,7% (umbral operativo >= 20%)) |
| `11303` | Tortel | 13,8 | 18,2 | 4,40 | +31,9% | SI (Variación de +31,9% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 14,5 | 19,1 | 4,60 | +31,7% | SI (Variación de +31,7% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 16,8 | 22,1 | 5,30 | +31,5% | SI (Variación de +31,5% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
