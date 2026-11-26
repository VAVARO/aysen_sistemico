---
id: respaldo_indicador_tarifa_bt1_clp
title: "Respaldo de Indicador — Tarifa Residencial Eléctrica BT1 (tarifa_bt1_clp)"
type: respaldo_indicador
variable_clave: "tarifa_bt1_clp"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 12
unidad: "CLP/kWh"
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

# Respaldo de Indicador: `tarifa_bt1_clp`

- **Nombre**: Tarifa Residencial Eléctrica BT1
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #12
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: CLP/kWh
- **Fuente oficial**: Superintendencia de Electricidad y Combustibles (SEC) / CNE (https://www.sec.cl/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 224 -> 287,8 (Variación de +28,5% (umbral operativo >= 20%)); Aysén: 222 -> 287,8 (Variación de +29,6% (umbral operativo >= 20%)); Cisnes: 235 -> 292,4 (Variación de +24,4% (umbral operativo >= 20%)); Cochrane: 230 -> 291,2 (Variación de +26,6% (umbral operativo >= 20%)); Chile Chico: 228 -> 289,5 (Variación de +27,0% (umbral operativo >= 20%)); Río Ibáñez: 231 -> 289,5 (Variación de +25,3% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Decreto N° 8T MinEnergía 19-ago-2026 / Pliego Edelaysen Nov-2026 (Leyes PEC/MPC 21.472 y 21.667)

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 224 | 287,8 | 63,8 | +28,5% | SI (Variación de +28,5% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 258 | 294 | 36 | +14,0% | NO |
| `11201` | Aysén | 222 | 287,8 | 65,8 | +29,6% | SI (Variación de +29,6% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 235 | 292,4 | 57,4 | +24,4% | SI (Variación de +24,4% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 265 | 312 | 47 | +17,7% | NO |
| `11301` | Cochrane | 230 | 291,2 | 61,2 | +26,6% | SI (Variación de +26,6% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 262 | 308 | 46 | +17,6% | NO |
| `11303` | Tortel | 268 | 318 | 50 | +18,7% | NO |
| `11401` | Chile Chico | 228 | 289,5 | 61,5 | +27,0% | SI (Variación de +27,0% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 231 | 289,5 | 58,5 | +25,3% | SI (Variación de +25,3% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
