---
id: respaldo_indicador_cobertura_subsidio_electrico_pct
title: "Respaldo de Indicador — Cobertura Comunal del Subsidio Eléctrico (% sobre Hogares) (cobertura_subsidio_electrico_pct)"
type: respaldo_indicador
variable_clave: "cobertura_subsidio_electrico_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 12
unidad: "%"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: false
ultima_corrida: "2026-11-27"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
---

# Respaldo de Indicador: `cobertura_subsidio_electrico_pct`

- **Nombre**: Cobertura Comunal del Subsidio Eléctrico (% sobre Hogares)
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #12
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: %
- **Fuente oficial**: Superintendencia de Electricidad y Combustibles (SEC) / CNE (https://www.sec.cl/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 35,9 | 34,9 | -1 | -2,8% | NO |
| `11102` | Lago Verde | 25,6 | 22 | -3,60 | -14,1% | NO |
| `11201` | Aysén | 38,9 | 35,2 | -3,70 | -9,5% | NO |
| `11202` | Cisnes | 36,3 | 34,2 | -2,10 | -5,8% | NO |
| `11203` | Guaitecas | 28,5 | 24,4 | -4,10 | -14,4% | NO |
| `11301` | Cochrane | 34,2 | 30,4 | -3,80 | -11,1% | NO |
| `11302` | O'Higgins | 19,2 | 16,4 | -2,80 | -14,6% | NO |
| `11303` | Tortel | 20,5 | 17,3 | -3,20 | -15,6% | NO |
| `11401` | Chile Chico | 30,3 | 28 | -2,30 | -7,6% | NO |
| `11402` | Río Ibáñez | 32,1 | 27,6 | -4,50 | -14,0% | NO |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 0.
- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `agregada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
