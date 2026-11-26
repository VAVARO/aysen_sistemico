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
ultimo_estado: "agregada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-agregada
---

# Respaldo de Indicador: `cobertura_subsidio_electrico_pct`

- **Nombre**: Cobertura Comunal del Subsidio Eléctrico (% sobre Hogares)
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #12
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: %
- **Fuente oficial**: Superintendencia de Electricidad y Combustibles (SEC) / CNE (https://www.sec.cl/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | N/D | 35,9 | 35,9 | N/A (desde 0) | NO |
| `11102` | Lago Verde | N/D | 25,6 | 25,6 | N/A (desde 0) | NO |
| `11201` | Aysén | N/D | 38,9 | 38,9 | N/A (desde 0) | NO |
| `11202` | Cisnes | N/D | 36,3 | 36,3 | N/A (desde 0) | NO |
| `11203` | Guaitecas | N/D | 28,5 | 28,5 | N/A (desde 0) | NO |
| `11301` | Cochrane | N/D | 34,2 | 34,2 | N/A (desde 0) | NO |
| `11302` | O'Higgins | N/D | 19,2 | 19,2 | N/A (desde 0) | NO |
| `11303` | Tortel | N/D | 20,5 | 20,5 | N/A (desde 0) | NO |
| `11401` | Chile Chico | N/D | 30,3 | 30,3 | N/A (desde 0) | NO |
| `11402` | Río Ibáñez | N/D | 32,1 | 32,1 | N/A (desde 0) | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `agregada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
