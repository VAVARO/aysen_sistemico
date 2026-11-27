---
id: respaldo_indicador_pobreza_multidim_pct
title: "Respaldo de Indicador — Pobreza Multidimensional CASEN (pobreza_multidim_pct)"
type: respaldo_indicador
variable_clave: "pobreza_multidim_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 23
unidad: "% pob."
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

# Respaldo de Indicador: `pobreza_multidim_pct`

- **Nombre**: Pobreza Multidimensional CASEN
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #23
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: % pob.
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / Ministerio de Desarrollo Social y Familia (MDSF) (https://censo2024.ine.gob.cl/)
- **Frecuencia / Modo**: Decenal (Censo) / Bienal (CASEN) · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 24,5 -> 18 (Variación de -26,5% (umbral operativo >= 20%)); Cisnes: 18,6 -> 12,3 (Variación de -33,9% (umbral operativo >= 20%)); O'Higgins: 22,8 -> 12,1 (Variación de -46,9% (umbral operativo >= 20%)); Tortel: 26,2 -> 12,3 (Variación de -53,1% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 11,8 | 14 | 2,20 | +18,6% | NO |
| `11102` | Lago Verde | 24,5 | 18 | -6,50 | -26,5% | SI (Variación de -26,5% (umbral operativo >= 20%)) |
| `11201` | Aysén | 15,2 | 12,8 | -2,40 | -15,8% | NO |
| `11202` | Cisnes | 18,6 | 12,3 | -6,30 | -33,9% | SI (Variación de -33,9% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 27,4 | 22,2 | -5,20 | -19,0% | NO |
| `11301` | Cochrane | 15 | 14,3 | -0,70 | -4,7% | NO |
| `11302` | O'Higgins | 22,8 | 12,1 | -10,7 | -46,9% | SI (Variación de -46,9% (umbral operativo >= 20%)) |
| `11303` | Tortel | 26,2 | 12,3 | -13,9 | -53,1% | SI (Variación de -53,1% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 16,2 | 16,3 | 0,10 | +0,6% | NO |
| `11402` | Río Ibáñez | 19,8 | 18,8 | -1 | -5,1% | NO |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
