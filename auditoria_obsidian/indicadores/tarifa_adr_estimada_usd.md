---
id: respaldo_indicador_tarifa_adr_estimada_usd
title: "Respaldo de Indicador — Tarifa Diaria Promedio Hotelera (ADR) (tarifa_adr_estimada_usd)"
type: respaldo_indicador
variable_clave: "tarifa_adr_estimada_usd"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "US$"
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

# Respaldo de Indicador: `tarifa_adr_estimada_usd`

- **Nombre**: Tarifa Diaria Promedio Hotelera (ADR)
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: US$
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 159 -> 71,1 (Variación de -55,3% (umbral operativo >= 20%)); Lago Verde: 92 -> 52,4 (Variación de -43,0% (umbral operativo >= 20%)); Aysén: 182 -> 85,5 (Variación de -53,0% (umbral operativo >= 20%)); Cisnes: 196 -> 89,4 (Variación de -54,4% (umbral operativo >= 20%)); Guaitecas: 115 -> 56,2 (Variación de -51,1% (umbral operativo >= 20%)); Cochrane: 176 -> 77,7 (Variación de -55,9% (umbral operativo >= 20%)); O'Higgins: 186 -> 61,7 (Variación de -66,8% (umbral operativo >= 20%)); Tortel: 155 -> 58,5 (Variación de -62,3% (umbral operativo >= 20%)); Chile Chico: 169 -> 62,7 (Variación de -62,9% (umbral operativo >= 20%)); Río Ibáñez: 203 -> 65,7 (Variación de -67,6% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 159 | 71,1 | -87,9 | -55,3% | SI (Variación de -55,3% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 92 | 52,4 | -39,6 | -43,0% | SI (Variación de -43,0% (umbral operativo >= 20%)) |
| `11201` | Aysén | 182 | 85,5 | -96,5 | -53,0% | SI (Variación de -53,0% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 196 | 89,4 | -106,6 | -54,4% | SI (Variación de -54,4% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 115 | 56,2 | -58,8 | -51,1% | SI (Variación de -51,1% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 176 | 77,7 | -98,3 | -55,9% | SI (Variación de -55,9% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 186 | 61,7 | -124,3 | -66,8% | SI (Variación de -66,8% (umbral operativo >= 20%)) |
| `11303` | Tortel | 155 | 58,5 | -96,5 | -62,3% | SI (Variación de -62,3% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 169 | 62,7 | -106,3 | -62,9% | SI (Variación de -62,9% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 203 | 65,7 | -137,3 | -67,6% | SI (Variación de -67,6% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
