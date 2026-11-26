---
id: respaldo_indicador_ratio_costo_calefaccion_electrica_vs_lena
title: "Respaldo de Indicador — Ratio Costo Térmico Útil Bomba de Calor BT1 vs. Leña (ratio_costo_calefaccion_electrica_vs_lena)"
type: respaldo_indicador
variable_clave: "ratio_costo_calefaccion_electrica_vs_lena"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 13
unidad: "veces"
en_lexico_oficial: true
ultimo_estado: "agregada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-agregada
---

# Respaldo de Indicador: `ratio_costo_calefaccion_electrica_vs_lena`

- **Nombre**: Ratio Costo Térmico Útil Bomba de Calor BT1 vs. Leña
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #13
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: veces
- **Fuente oficial**: Comisión Nacional de Energía (CNE) — Sistema de Información de Precios en Línea (https://www.bencinaenlinea.cl/)
- **Frecuencia / Modo**: Semanal / Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | N/D | 2,25 | 2,25 | N/A (desde 0) | NO |
| `11102` | Lago Verde | N/D | 3,06 | 3,06 | N/A (desde 0) | NO |
| `11201` | Aysén | N/D | 2,35 | 2,35 | N/A (desde 0) | NO |
| `11202` | Cisnes | N/D | 2,49 | 2,49 | N/A (desde 0) | NO |
| `11203` | Guaitecas | N/D | 2,25 | 2,25 | N/A (desde 0) | NO |
| `11301` | Cochrane | N/D | 2,60 | 2,60 | N/A (desde 0) | NO |
| `11302` | O'Higgins | N/D | 3,21 | 3,21 | N/A (desde 0) | NO |
| `11303` | Tortel | N/D | 2,98 | 2,98 | N/A (desde 0) | NO |
| `11401` | Chile Chico | N/D | 2,17 | 2,17 | N/A (desde 0) | NO |
| `11402` | Río Ibáñez | N/D | 2,47 | 2,47 | N/A (desde 0) | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `agregada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
