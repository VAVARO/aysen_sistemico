---
id: respaldo_indicador_mediana_espera_quirurgica_dias
title: "Respaldo de Indicador — Mediana de Espera Quirúrgica No GES (mediana_espera_quirurgica_dias)"
type: respaldo_indicador
variable_clave: "mediana_espera_quirurgica_dias"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "salud"
hub_titulo: "VIII. Salud"
nodo_id: 38
unidad: "días"
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

# Respaldo de Indicador: `mediana_espera_quirurgica_dias`

- **Nombre**: Mediana de Espera Quirúrgica No GES
- **Hub / Nodo**: VIII. Salud · Nodo #38
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: días
- **Fuente oficial**: Servicio de Salud Aysén (SSA) / DEIS MINSAL (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 318 -> 218 (Variación de -31,4% (umbral operativo >= 20%)); Lago Verde: 418 -> 284 (Variación de -32,1% (umbral operativo >= 20%)); Aysén: 354 -> 234 (Variación de -33,9% (umbral operativo >= 20%)); Cisnes: 412 -> 268 (Variación de -35,0% (umbral operativo >= 20%)); Guaitecas: 468 -> 312 (Variación de -33,3% (umbral operativo >= 20%)); Cochrane: 368 -> 242 (Variación de -34,2% (umbral operativo >= 20%)); O'Higgins: 436 -> 280 (Variación de -35,8% (umbral operativo >= 20%)); Tortel: 388 -> 258 (Variación de -33,5% (umbral operativo >= 20%)); Chile Chico: 364 -> 248 (Variación de -31,9% (umbral operativo >= 20%)); Río Ibáñez: 424 -> 276 (Variación de -34,9% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 318 | 218 | -100 | -31,4% | SI (Variación de -31,4% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 418 | 284 | -134 | -32,1% | SI (Variación de -32,1% (umbral operativo >= 20%)) |
| `11201` | Aysén | 354 | 234 | -120 | -33,9% | SI (Variación de -33,9% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 412 | 268 | -144 | -35,0% | SI (Variación de -35,0% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 468 | 312 | -156 | -33,3% | SI (Variación de -33,3% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 368 | 242 | -126 | -34,2% | SI (Variación de -34,2% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 436 | 280 | -156 | -35,8% | SI (Variación de -35,8% (umbral operativo >= 20%)) |
| `11303` | Tortel | 388 | 258 | -130 | -33,5% | SI (Variación de -33,5% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 364 | 248 | -116 | -31,9% | SI (Variación de -31,9% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 424 | 276 | -148 | -34,9% | SI (Variación de -34,9% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.
- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
