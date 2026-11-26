---
id: respaldo_indicador_hogares_lena_pct
title: "Respaldo de Indicador — Hogares con Calefacción a Leña (hogares_lena_pct)"
type: respaldo_indicador
variable_clave: "hogares_lena_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 13
unidad: "% hogares"
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

# Respaldo de Indicador: `hogares_lena_pct`

- **Nombre**: Hogares con Calefacción a Leña
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #13
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: % hogares
- **Fuente oficial**: Comisión Nacional de Energía (CNE) — Sistema de Información de Precios en Línea (https://www.bencinaenlinea.cl/)
- **Frecuencia / Modo**: Semanal / Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 92,4 -> 68,8 (Variación de -25,5% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] INFOR / MMA 10.999 recambios de calefactores al 25-ago-2026 / PDA Res. Ex. 8.940/2026

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 92,4 | 68,8 | -23,6 | -25,5% | SI (Variación de -25,5% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 98,2 | 98,1 | -0,10 | -0,1% | NO |
| `11201` | Aysén | 87,8 | 84,5 | -3,30 | -3,8% | NO |
| `11202` | Cisnes | 95,1 | 94 | -1,10 | -1,2% | NO |
| `11203` | Guaitecas | 94,6 | 94,2 | -0,40 | -0,4% | NO |
| `11301` | Cochrane | 96 | 95,5 | -0,50 | -0,5% | NO |
| `11302` | O'Higgins | 99,1 | 98,8 | -0,30 | -0,3% | NO |
| `11303` | Tortel | 98,4 | 98,5 | 0,10 | +0,1% | NO |
| `11401` | Chile Chico | 82,3 | 82 | -0,30 | -0,4% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 9 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
