---
id: respaldo_indicador_cobertura_fibra_hogar_pct
title: "Respaldo de Indicador — Cobertura de Fibra Óptica Residencial (cobertura_fibra_hogar_pct)"
type: respaldo_indicador
variable_clave: "cobertura_fibra_hogar_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 14
unidad: "%"
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

# Respaldo de Indicador: `cobertura_fibra_hogar_pct`

- **Nombre**: Cobertura de Fibra Óptica Residencial
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #14
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: %
- **Fuente oficial**: Subsecretaría de Telecomunicaciones (SUBTEL) — Proyecto FOA (https://www.subtel.gob.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 17,6 -> 0,80 (Variación de -95,5% (umbral operativo >= 20%)); Cisnes: 43,6 -> 24,8 (Variación de -43,1% (umbral operativo >= 20%)); Guaitecas: 31,8 -> 2,40 (Variación de -92,5% (umbral operativo >= 20%)); Cochrane: 51,4 -> 39,2 (Variación de -23,7% (umbral operativo >= 20%)); O'Higgins: 23,2 -> 1,50 (Variación de -93,5% (umbral operativo >= 20%)); Tortel: 27,5 -> 2,10 (Variación de -92,4% (umbral operativo >= 20%)); Chile Chico: 47,9 -> 36,5 (Variación de -23,8% (umbral operativo >= 20%)); Río Ibáñez: 35,2 -> 21,4 (Variación de -39,2% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 75,5 | 68,4 | -7,10 | -9,4% | NO |
| `11102` | Lago Verde | 17,6 | 0,80 | -16,8 | -95,5% | SI (Variación de -95,5% (umbral operativo >= 20%)) |
| `11201` | Aysén | 61,8 | 54,2 | -7,60 | -12,3% | NO |
| `11202` | Cisnes | 43,6 | 24,8 | -18,8 | -43,1% | SI (Variación de -43,1% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 31,8 | 2,40 | -29,4 | -92,5% | SI (Variación de -92,5% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 51,4 | 39,2 | -12,2 | -23,7% | SI (Variación de -23,7% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 23,2 | 1,50 | -21,7 | -93,5% | SI (Variación de -93,5% (umbral operativo >= 20%)) |
| `11303` | Tortel | 27,5 | 2,10 | -25,4 | -92,4% | SI (Variación de -92,4% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 47,9 | 36,5 | -11,4 | -23,8% | SI (Variación de -23,8% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 35,2 | 21,4 | -13,8 | -39,2% | SI (Variación de -39,2% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
