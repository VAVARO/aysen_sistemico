---
id: respaldo_indicador_consumo_lena_m3_solidos_anual
title: "Respaldo de Indicador — Consumo Total Anual de Leña Sólida (INFOR) (consumo_lena_m3_solidos_anual)"
type: respaldo_indicador
variable_clave: "consumo_lena_m3_solidos_anual"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 13
unidad: "m³ sólidos/año"
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

# Respaldo de Indicador: `consumo_lena_m3_solidos_anual`

- **Nombre**: Consumo Total Anual de Leña Sólida (INFOR)
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #13
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: m³ sólidos/año
- **Fuente oficial**: Comisión Nacional de Energía (CNE) — Sistema de Información de Precios en Línea (https://www.bencinaenlinea.cl/)
- **Frecuencia / Modo**: Semanal / Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 248.800 -> 147.080 (Variación de -40,9% (umbral operativo >= 20%)); Lago Verde: 16.200 -> 4.740 (Variación de -70,7% (umbral operativo >= 20%)); Aysén: 128.500 -> 91.453 (Variación de -28,8% (umbral operativo >= 20%)); Cisnes: 38.400 -> 26.882 (Variación de -30,0% (umbral operativo >= 20%)); Guaitecas: 18.200 -> 6.417 (Variación de -64,7% (umbral operativo >= 20%)); Cochrane: 34.800 -> 17.816 (Variación de -48,8% (umbral operativo >= 20%)); O'Higgins: 11.556 -> 3.829 (Variación de -66,9% (umbral operativo >= 20%)); Tortel: 14.000 -> 2.920 (Variación de -79,1% (umbral operativo >= 20%)); Chile Chico: 32.600 -> 19.108 (Variación de -41,4% (umbral operativo >= 20%)); Río Ibáñez: 22.400 -> 14.029 (Variación de -37,4% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] INFOR Observatorio BES N° 11 (334.274 m³ sólidos/año) / Ley 21.499 / Anteproyecto PDA Coyhaique Res. Ex. 8.940/2026

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 248.800 | 147.080 | -101.720 | -40,9% | SI (Variación de -40,9% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 16.200 | 4.740 | -11.460 | -70,7% | SI (Variación de -70,7% (umbral operativo >= 20%)) |
| `11201` | Aysén | 128.500 | 91.453 | -37.047 | -28,8% | SI (Variación de -28,8% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 38.400 | 26.882 | -11.518 | -30,0% | SI (Variación de -30,0% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 18.200 | 6.417 | -11.783 | -64,7% | SI (Variación de -64,7% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 34.800 | 17.816 | -16.984 | -48,8% | SI (Variación de -48,8% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 11.556 | 3.829 | -7.727 | -66,9% | SI (Variación de -66,9% (umbral operativo >= 20%)) |
| `11303` | Tortel | 14.000 | 2.920 | -11.080 | -79,1% | SI (Variación de -79,1% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 32.600 | 19.108 | -13.492 | -41,4% | SI (Variación de -41,4% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 22.400 | 14.029 | -8.371 | -37,4% | SI (Variación de -37,4% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
