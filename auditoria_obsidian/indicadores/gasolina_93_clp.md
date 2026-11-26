---
id: respaldo_indicador_gasolina_93_clp
title: "Respaldo de Indicador — Precio Gasolina 93 por Litro (gasolina_93_clp)"
type: respaldo_indicador
variable_clave: "gasolina_93_clp"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 13
unidad: "CLP/litro"
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

# Respaldo de Indicador: `gasolina_93_clp`

- **Nombre**: Precio Gasolina 93 por Litro
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #13
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: CLP/litro
- **Fuente oficial**: Comisión Nacional de Energía (CNE) — Sistema de Información de Precios en Línea (https://www.bencinaenlinea.cl/)
- **Frecuencia / Modo**: Semanal / Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 1.362 -> 1.652 (Variación de +21,3% (umbral operativo >= 20%)); Aysén: 1.375 -> 1.651 (Variación de +20,1% (umbral operativo >= 20%)); Cochrane: 1.410 -> 1.714 (Variación de +21,6% (umbral operativo >= 20%)); Río Ibáñez: 1.420 -> 1.705 (Variación de +20,1% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Bandas MEPCO Ley 20.765 / CNE Bencina en Línea corte 19-nov-2026 (promedio regional $1.696/L)

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 1.362 | 1.652 | 290 | +21,3% | SI (Variación de +21,3% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 1.520 | 1.765 | 245 | +16,1% | NO |
| `11201` | Aysén | 1.375 | 1.651 | 276 | +20,1% | SI (Variación de +20,1% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 1.440 | 1.695 | 255 | +17,7% | NO |
| `11203` | Guaitecas | 1.560 | 1.785 | 225 | +14,4% | NO |
| `11301` | Cochrane | 1.410 | 1.714 | 304 | +21,6% | SI (Variación de +21,6% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 1.620 | 1.812 | 192 | +11,9% | NO |
| `11303` | Tortel | 1.580 | 1.790 | 210 | +13,3% | NO |
| `11401` | Chile Chico | 1.430 | 1.710 | 280 | +19,6% | NO |
| `11402` | Río Ibáñez | 1.420 | 1.705 | 285 | +20,1% | SI (Variación de +20,1% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
