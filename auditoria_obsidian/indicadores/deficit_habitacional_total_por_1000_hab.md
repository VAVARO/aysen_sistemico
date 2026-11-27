---
id: respaldo_indicador_deficit_habitacional_total_por_1000_hab
title: "Respaldo de Indicador — Déficit Habitacional Total por 1.000 Habitantes (deficit_habitacional_total_por_1000_hab)"
type: respaldo_indicador
variable_clave: "deficit_habitacional_total_por_1000_hab"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 23
unidad: "viviendas/1000 hab"
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

# Respaldo de Indicador: `deficit_habitacional_total_por_1000_hab`

- **Nombre**: Déficit Habitacional Total por 1.000 Habitantes
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #23
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: viviendas/1000 hab
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / Ministerio de Desarrollo Social y Familia (MDSF) (https://censo2024.ine.gob.cl/)
- **Frecuencia / Modo**: Decenal (Censo) / Bienal (CASEN) · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 30,1 -> 19,5 (Variación de -35,2% (umbral operativo >= 20%)); Lago Verde: 41,1 -> 82,8 (Variación de +101,5% (umbral operativo >= 20%)); Aysén: 31 -> 14,2 (Variación de -54,2% (umbral operativo >= 20%)); Cisnes: 33,9 -> 20,4 (Variación de -39,8% (umbral operativo >= 20%)); Guaitecas: 55,7 -> 8,80 (Variación de -84,2% (umbral operativo >= 20%)); O'Higgins: 40,2 -> 6 (Variación de -85,1% (umbral operativo >= 20%)); Tortel: 77,2 -> 26,6 (Variación de -65,5% (umbral operativo >= 20%)); Chile Chico: 27,3 -> 17,4 (Variación de -36,3% (umbral operativo >= 20%)); Río Ibáñez: 29,7 -> 18,7 (Variación de -37,0% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 30,1 | 19,5 | -10,6 | -35,2% | SI (Variación de -35,2% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 41,1 | 82,8 | 41,7 | +101,5% | SI (Variación de +101,5% (umbral operativo >= 20%)) |
| `11201` | Aysén | 31 | 14,2 | -16,8 | -54,2% | SI (Variación de -54,2% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 33,9 | 20,4 | -13,5 | -39,8% | SI (Variación de -39,8% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 55,7 | 8,80 | -46,9 | -84,2% | SI (Variación de -84,2% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 32,1 | 33,8 | 1,70 | +5,3% | NO |
| `11302` | O'Higgins | 40,2 | 6 | -34,2 | -85,1% | SI (Variación de -85,1% (umbral operativo >= 20%)) |
| `11303` | Tortel | 77,2 | 26,6 | -50,6 | -65,5% | SI (Variación de -65,5% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 27,3 | 17,4 | -9,90 | -36,3% | SI (Variación de -36,3% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 29,7 | 18,7 | -11 | -37,0% | SI (Variación de -37,0% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
