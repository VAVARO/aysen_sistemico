---
id: respaldo_indicador_prestadores_sernatur
title: "Respaldo de Indicador — Prestadores Turísticos Registrados SERNATUR (prestadores_sernatur)"
type: respaldo_indicador
variable_clave: "prestadores_sernatur"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 1
unidad: "prestadores"
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

# Respaldo de Indicador: `prestadores_sernatur`

- **Nombre**: Prestadores Turísticos Registrados SERNATUR
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #1
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: prestadores
- **Fuente oficial**: Servicio Nacional de Turismo (SERNATUR) / Subsecretaría de Turismo (https://serviciosturisticos.sernatur.cl/)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Aysén: 185 -> 126 (Variación de -31,9% (umbral operativo >= 20%)); Cisnes: 138 -> 215 (Variación de +55,8% (umbral operativo >= 20%)); Chile Chico: 95 -> 231 (Variación de +143,2% (umbral operativo >= 20%)); Río Ibáñez: 132 -> 445 (Variación de +237,1% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 412 | 489 | 77 | +18,7% | NO |
| `11102` | Lago Verde | 24 | 26 | 2 | +8,3% | NO |
| `11201` | Aysén | 185 | 126 | -59 | -31,9% | SI (Variación de -31,9% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 138 | 215 | 77 | +55,8% | SI (Variación de +55,8% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 21 | 25 | 4 | +19,0% | NO |
| `11301` | Cochrane | 83 | 96 | 13 | +15,7% | NO |
| `11302` | O'Higgins | 29 | 31 | 2 | +6,9% | NO |
| `11303` | Tortel | 42 | 44 | 2 | +4,8% | NO |
| `11401` | Chile Chico | 95 | 231 | 136 | +143,2% | SI (Variación de +143,2% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 132 | 445 | 313 | +237,1% | SI (Variación de +237,1% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
