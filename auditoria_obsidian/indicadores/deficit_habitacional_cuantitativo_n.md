---
id: respaldo_indicador_deficit_habitacional_cuantitativo_n
title: "Respaldo de Indicador — Déficit Habitacional Cuantitativo (MINVU) (deficit_habitacional_cuantitativo_n)"
type: respaldo_indicador
variable_clave: "deficit_habitacional_cuantitativo_n"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 41
unidad: "viviendas"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: true
ultima_corrida: "2026-11-27"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
  - requiere-verificacion
---

# Respaldo de Indicador: `deficit_habitacional_cuantitativo_n`

- **Nombre**: Déficit Habitacional Cuantitativo (MINVU)
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #41
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: viviendas
- **Fuente oficial**: MINVU / MDSF Registro Social de Hogares / DOH-MOP (https://www.minvu.gob.cl/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 1.742 -> 1.128 (Variación de -35,2% (umbral operativo >= 20%)); Lago Verde: 32 -> 73 (Variación de +128,1% (umbral operativo >= 20%)); Aysén: 719 -> 330 (Variación de -54,1% (umbral operativo >= 20%)); Cisnes: 174 -> 109 (Variación de -37,4% (umbral operativo >= 20%)); Guaitecas: 89 -> 14 (Variación de -84,3% (umbral operativo >= 20%)); O'Higgins: 26 -> 4 (Variación de -84,6% (umbral operativo >= 20%)); Tortel: 39 -> 15 (Variación de -61,5% (umbral operativo >= 20%)); Chile Chico: 134 -> 86 (Variación de -35,8% (umbral operativo >= 20%)); Río Ibáñez: 81 -> 50 (Variación de -38,3% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 1.742 | 1.128 | -614 | -35,2% | SI (Variación de -35,2% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 32 | 73 | 41 | +128,1% | SI (Variación de +128,1% (umbral operativo >= 20%)) |
| `11201` | Aysén | 719 | 330 | -389 | -54,1% | SI (Variación de -54,1% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 174 | 109 | -65 | -37,4% | SI (Variación de -37,4% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 89 | 14 | -75 | -84,3% | SI (Variación de -84,3% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 111 | 118 | 7 | +6,3% | NO |
| `11302` | O'Higgins | 26 | 4 | -22 | -84,6% | SI (Variación de -84,6% (umbral operativo >= 20%)) |
| `11303` | Tortel | 39 | 15 | -24 | -61,5% | SI (Variación de -61,5% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 134 | 86 | -48 | -35,8% | SI (Variación de -35,8% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 81 | 50 | -31 | -38,3% | SI (Variación de -38,3% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
