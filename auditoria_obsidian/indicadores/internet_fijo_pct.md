---
id: respaldo_indicador_internet_fijo_pct
title: "Respaldo de Indicador — Penetración de Internet Fijo Total SUBTEL (% Hogares) (internet_fijo_pct)"
type: respaldo_indicador
variable_clave: "internet_fijo_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 14
unidad: "% hogares"
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

# Respaldo de Indicador: `internet_fijo_pct`

- **Nombre**: Penetración de Internet Fijo Total SUBTEL (% Hogares)
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #14
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: % hogares
- **Fuente oficial**: Subsecretaría de Telecomunicaciones (SUBTEL) — Proyecto FOA (https://www.subtel.gob.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Cisnes: 43,6 -> 72,5 (Variación de +66,3% (umbral operativo >= 20%)); Guaitecas: 31,8 -> 51,9 (Variación de +63,2% (umbral operativo >= 20%)); Río Ibáñez: 35,2 -> 52,4 (Variación de +48,9% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 75,5 | 70,1 | -5,40 | -7,2% | NO |
| `11102` | Lago Verde | 17,6 | 17,5 | -0,10 | -0,6% | NO |
| `11201` | Aysén | 61,8 | 66,5 | 4,70 | +7,6% | NO |
| `11202` | Cisnes | 43,6 | 72,5 | 28,9 | +66,3% | SI (Variación de +66,3% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 31,8 | 51,9 | 20,1 | +63,2% | SI (Variación de +63,2% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 51,4 | 60,8 | 9,40 | +18,3% | NO |
| `11303` | Tortel | 27,5 | 22,1 | -5,40 | -19,6% | NO |
| `11401` | Chile Chico | 47,9 | 40,4 | -7,50 | -15,7% | NO |
| `11402` | Río Ibáñez | 35,2 | 52,4 | 17,2 | +48,9% | SI (Variación de +48,9% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 9 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
