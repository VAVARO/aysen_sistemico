---
id: respaldo_indicador_hogares_censo_2024
title: "Respaldo de Indicador — Hogares Censales Estimados (Censo 2024) (hogares_censo_2024)"
type: respaldo_indicador
variable_clave: "hogares_censo_2024"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 23
unidad: "hogares"
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

# Respaldo de Indicador: `hogares_censo_2024`

- **Nombre**: Hogares Censales Estimados (Censo 2024)
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #23
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: hogares
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / Ministerio de Desarrollo Social y Familia (MDSF) (https://censo2024.ine.gob.cl/)
- **Frecuencia / Modo**: Decenal (Censo) / Bienal (CASEN) · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · ERROR_CENSO_2024_HOGARES_VIVIENDAS_IAM]** [ERROR_CENSO_2024_HOGARES_VIVIENDAS_IAM] Censo 2024 inconsistente: hogares=39964 (39964), vivTot=52294 (52294), vivOcu=0 (39631), IAM(LV=182.8, RI=121.2, Tor=30.8).

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 21.800 | 22.423 | 623 | +2,9% | NO |
| `11102` | Lago Verde | 320 | 373 | 53 | +16,6% | NO |
| `11201` | Aysén | 8.200 | 9.057 | 857 | +10,5% | NO |
| `11202` | Cisnes | 2.050 | 2.180 | 130 | +6,3% | NO |
| `11203` | Guaitecas | 520 | 606 | 86 | +16,5% | NO |
| `11301` | Cochrane | 1.300 | 1.462 | 162 | +12,5% | NO |
| `11302` | O'Higgins | 250 | 292 | 42 | +16,8% | NO |
| `11303` | Tortel | 195 | 231 | 36 | +18,5% | NO |
| `11401` | Chile Chico | 1.950 | 2.109 | 159 | +8,2% | NO |
| `11402` | Río Ibáñez | 1.060 | 1.231 | 171 | +16,1% | NO |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.
- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `agregada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
