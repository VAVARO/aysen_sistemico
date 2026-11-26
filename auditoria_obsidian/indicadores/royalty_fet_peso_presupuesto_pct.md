---
id: respaldo_indicador_royalty_fet_peso_presupuesto_pct
title: "Respaldo de Indicador — Peso Royalty / FET sobre Presupuesto Municipal (royalty_fet_peso_presupuesto_pct)"
type: respaldo_indicador
variable_clave: "royalty_fet_peso_presupuesto_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "gobernanza"
hub_titulo: "IV. Gobernanza y Finanzas"
nodo_id: 15
unidad: "%"
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

# Respaldo de Indicador: `royalty_fet_peso_presupuesto_pct`

- **Nombre**: Peso Royalty / FET sobre Presupuesto Municipal
- **Hub / Nodo**: IV. Gobernanza y Finanzas · Nodo #15
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: %
- **Fuente oficial**: Sistema Nacional de Información Municipal (SINIM) — SUBDERE (https://datos.sinim.gov.cl/)
- **Frecuencia / Modo**: Trimestral · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 11,6 -> 8,50 (Variación de -26,7% (umbral operativo >= 20%)); Cisnes: 5,10 -> 3,90 (Variación de -23,5% (umbral operativo >= 20%)); Guaitecas: 8,60 -> 6,20 (Variación de -27,9% (umbral operativo >= 20%)); Cochrane: 6,50 -> 5,20 (Variación de -20,0% (umbral operativo >= 20%)); O'Higgins: 13 -> 5,30 (Variación de -59,2% (umbral operativo >= 20%)); Tortel: 13,6 -> 8,10 (Variación de -40,4% (umbral operativo >= 20%)); Río Ibáñez: 7,60 -> 4,80 (Variación de -36,8% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 1,80 | 1,70 | -0,10 | -5,6% | NO |
| `11102` | Lago Verde | 11,6 | 8,50 | -3,10 | -26,7% | SI (Variación de -26,7% (umbral operativo >= 20%)) |
| `11201` | Aysén | 2,80 | 2,70 | -0,10 | -3,6% | NO |
| `11202` | Cisnes | 5,10 | 3,90 | -1,20 | -23,5% | SI (Variación de -23,5% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 8,60 | 6,20 | -2,40 | -27,9% | SI (Variación de -27,9% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 6,50 | 5,20 | -1,30 | -20,0% | SI (Variación de -20,0% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 13 | 5,30 | -7,70 | -59,2% | SI (Variación de -59,2% (umbral operativo >= 20%)) |
| `11303` | Tortel | 13,6 | 8,10 | -5,50 | -40,4% | SI (Variación de -40,4% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 5,60 | 5,10 | -0,50 | -8,9% | NO |
| `11402` | Río Ibáñez | 7,60 | 4,80 | -2,80 | -36,8% | SI (Variación de -36,8% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
