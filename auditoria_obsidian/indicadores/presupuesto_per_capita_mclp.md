---
id: respaldo_indicador_presupuesto_per_capita_mclp
title: "Respaldo de Indicador — Presupuesto Municipal per Cápita (presupuesto_per_capita_mclp)"
type: respaldo_indicador
variable_clave: "presupuesto_per_capita_mclp"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "gobernanza"
hub_titulo: "IV. Gobernanza y Finanzas"
nodo_id: 15
unidad: "Miles CLP/hab"
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

# Respaldo de Indicador: `presupuesto_per_capita_mclp`

- **Nombre**: Presupuesto Municipal per Cápita
- **Hub / Nodo**: IV. Gobernanza y Finanzas · Nodo #15
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: Miles CLP/hab
- **Fuente oficial**: Sistema Nacional de Información Municipal (SINIM) — SUBDERE (https://datos.sinim.gov.cl/)
- **Frecuencia / Modo**: Trimestral · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 3.145,3 -> 4.263,2 (Variación de +35,5% (umbral operativo >= 20%)); Cisnes: 1.187,5 -> 1.554,5 (Variación de +30,9% (umbral operativo >= 20%)); Guaitecas: 2.065,1 -> 2.859,2 (Variación de +38,5% (umbral operativo >= 20%)); Cochrane: 1.330,2 -> 1.654,4 (Variación de +24,4% (umbral operativo >= 20%)); O'Higgins: 3.323 -> 8.228,4 (Variación de +147,6% (umbral operativo >= 20%)); Tortel: 4.059,4 -> 6.813,3 (Variación de +67,8% (umbral operativo >= 20%)); Río Ibáñez: 1.450,6 -> 2.296,3 (Variación de +58,3% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 459 | 477,5 | 18,5 | +4,0% | NO |
| `11102` | Lago Verde | 3.145,3 | 4.263,2 | 1.117,9 | +35,5% | SI (Variación de +35,5% (umbral operativo >= 20%)) |
| `11201` | Aysén | 613,3 | 630,7 | 17,4 | +2,8% | NO |
| `11202` | Cisnes | 1.187,5 | 1.554,5 | 367 | +30,9% | SI (Variación de +30,9% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 2.065,1 | 2.859,2 | 794,1 | +38,5% | SI (Variación de +38,5% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 1.330,2 | 1.654,4 | 324,2 | +24,4% | SI (Variación de +24,4% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 3.323 | 8.228,4 | 4.905,4 | +147,6% | SI (Variación de +147,6% (umbral operativo >= 20%)) |
| `11303` | Tortel | 4.059,4 | 6.813,3 | 2.753,9 | +67,8% | SI (Variación de +67,8% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 1.100,9 | 1.219,5 | 118,6 | +10,8% | NO |
| `11402` | Río Ibáñez | 1.450,6 | 2.296,3 | 845,7 | +58,3% | SI (Variación de +58,3% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
