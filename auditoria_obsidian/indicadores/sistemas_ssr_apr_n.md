---
id: respaldo_indicador_sistemas_ssr_apr_n
title: "Respaldo de Indicador — Sistemas de Agua Potable Rural (SSR / APR) (sistemas_ssr_apr_n)"
type: respaldo_indicador
variable_clave: "sistemas_ssr_apr_n"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 41
unidad: "sistemas"
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

# Respaldo de Indicador: `sistemas_ssr_apr_n`

- **Nombre**: Sistemas de Agua Potable Rural (SSR / APR)
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #41
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: sistemas
- **Fuente oficial**: MINVU / MDSF Registro Social de Hogares / DOH-MOP (https://www.minvu.gob.cl/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 12 -> 15 (Variación de +25,0% (umbral operativo >= 20%)); Lago Verde: 3 -> 2 (Variación de -33,3% (umbral operativo >= 20%)); Guaitecas: 2 -> 1 (Variación de -50,0% (umbral operativo >= 20%)); Cochrane: 4 -> 3 (Variación de -25,0% (umbral operativo >= 20%)); Tortel: 2 -> 1 (Variación de -50,0% (umbral operativo >= 20%)); Chile Chico: 4 -> 5 (Variación de +25,0% (umbral operativo >= 20%)); Río Ibáñez: 4 -> 5 (Variación de +25,0% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 12 | 15 | 3 | +25,0% | SI (Variación de +25,0% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 3 | 2 | -1 | -33,3% | SI (Variación de -33,3% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 6 | 5 | -1 | -16,7% | NO |
| `11203` | Guaitecas | 2 | 1 | -1 | -50,0% | SI (Variación de -50,0% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 4 | 3 | -1 | -25,0% | SI (Variación de -25,0% (umbral operativo >= 20%)) |
| `11303` | Tortel | 2 | 1 | -1 | -50,0% | SI (Variación de -50,0% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 4 | 5 | 1 | +25,0% | SI (Variación de +25,0% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 4 | 5 | 1 | +25,0% | SI (Variación de +25,0% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 8 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
