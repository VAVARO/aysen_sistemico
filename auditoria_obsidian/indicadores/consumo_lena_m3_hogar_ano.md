---
id: respaldo_indicador_consumo_lena_m3_hogar_ano
title: "Respaldo de Indicador — Consumo Residencial de Leña por Hogar (consumo_lena_m3_hogar_ano)"
type: respaldo_indicador
variable_clave: "consumo_lena_m3_hogar_ano"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 13
unidad: "m³/hogar/año"
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

# Respaldo de Indicador: `consumo_lena_m3_hogar_ano`

- **Nombre**: Consumo Residencial de Leña por Hogar
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #13
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: m³/hogar/año
- **Fuente oficial**: Comisión Nacional de Energía (CNE) — Sistema de Información de Precios en Línea (https://www.bencinaenlinea.cl/)
- **Frecuencia / Modo**: Semanal / Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 14,5 -> 9,81 (Variación de -32,3% (umbral operativo >= 20%)); Lago Verde: 21 -> 15,1 (Variación de -28,1% (umbral operativo >= 20%)); Cisnes: 18,5 -> 14,0 (Variación de -24,6% (umbral operativo >= 20%)); Guaitecas: 19 -> 13,1 (Variación de -31,1% (umbral operativo >= 20%)); Cochrane: 18 -> 14,4 (Variación de -20,3% (umbral operativo >= 20%)); O'Higgins: 22 -> 15,5 (Variación de -29,5% (umbral operativo >= 20%)); Tortel: 21,5 -> 15,2 (Variación de -29,3% (umbral operativo >= 20%)); Chile Chico: 16,5 -> 12,0 (Variación de -27,6% (umbral operativo >= 20%)); Río Ibáñez: 19,5 -> 14,1 (Variación de -27,9% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] INFOR Observatorio BES N° 11 (conversión estéreos -> m³ sólidos factor ~0,64) / PDA Res. Ex. 8.940/2026

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 14,5 | 9,81 | -4,69 | -32,3% | SI (Variación de -32,3% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 21 | 15,1 | -5,90 | -28,1% | SI (Variación de -28,1% (umbral operativo >= 20%)) |
| `11201` | Aysén | 15 | 13,2 | -1,80 | -12,0% | NO |
| `11202` | Cisnes | 18,5 | 14,0 | -4,55 | -24,6% | SI (Variación de -24,6% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 19 | 13,1 | -5,90 | -31,1% | SI (Variación de -31,1% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 18 | 14,4 | -3,65 | -20,3% | SI (Variación de -20,3% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 22 | 15,5 | -6,50 | -29,5% | SI (Variación de -29,5% (umbral operativo >= 20%)) |
| `11303` | Tortel | 21,5 | 15,2 | -6,30 | -29,3% | SI (Variación de -29,3% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 16,5 | 12,0 | -4,55 | -27,6% | SI (Variación de -27,6% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 19,5 | 14,1 | -5,45 | -27,9% | SI (Variación de -27,9% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
