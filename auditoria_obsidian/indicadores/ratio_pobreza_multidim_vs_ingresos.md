---
id: respaldo_indicador_ratio_pobreza_multidim_vs_ingresos
title: "Respaldo de Indicador — Razón Pobreza Multidimensional sobre Ingresos (ratio_pobreza_multidim_vs_ingresos)"
type: respaldo_indicador
variable_clave: "ratio_pobreza_multidim_vs_ingresos"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 23
unidad: "razón"
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

# Respaldo de Indicador: `ratio_pobreza_multidim_vs_ingresos`

- **Nombre**: Razón Pobreza Multidimensional sobre Ingresos
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #23
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: razón
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / Ministerio de Desarrollo Social y Familia (MDSF) (https://censo2024.ine.gob.cl/)
- **Frecuencia / Modo**: Decenal (Censo) / Bienal (CASEN) · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 27,2 -> 20 (Variación de -26,5% (umbral operativo >= 20%)); Cisnes: 3,70 -> 2,50 (Variación de -32,4% (umbral operativo >= 20%)); Guaitecas: 4,50 -> 3,60 (Variación de -20,0% (umbral operativo >= 20%)); O'Higgins: 2,50 -> 1,30 (Variación de -48,0% (umbral operativo >= 20%)); Tortel: 5,70 -> 2,70 (Variación de -52,6% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 4,10 | 4,80 | 0,70 | +17,1% | NO |
| `11102` | Lago Verde | 27,2 | 20 | -7,20 | -26,5% | SI (Variación de -26,5% (umbral operativo >= 20%)) |
| `11201` | Aysén | 2,90 | 2,40 | -0,50 | -17,2% | NO |
| `11202` | Cisnes | 3,70 | 2,50 | -1,20 | -32,4% | SI (Variación de -32,4% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 4,50 | 3,60 | -0,90 | -20,0% | SI (Variación de -20,0% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 2,40 | 2,30 | -0,10 | -4,2% | NO |
| `11302` | O'Higgins | 2,50 | 1,30 | -1,20 | -48,0% | SI (Variación de -48,0% (umbral operativo >= 20%)) |
| `11303` | Tortel | 5,70 | 2,70 | -3 | -52,6% | SI (Variación de -52,6% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 2,80 | 2,70 | -0,10 | -3,6% | NO |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 9 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
