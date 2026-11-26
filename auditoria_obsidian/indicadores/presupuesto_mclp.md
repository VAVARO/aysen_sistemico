---
id: respaldo_indicador_presupuesto_mclp
title: "Respaldo de Indicador — Presupuesto Municipal Anual (SINIM) (presupuesto_mclp)"
type: respaldo_indicador
variable_clave: "presupuesto_mclp"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "gobernanza"
hub_titulo: "IV. Gobernanza y Finanzas"
nodo_id: 15
unidad: "M$ CLP"
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

# Respaldo de Indicador: `presupuesto_mclp`

- **Nombre**: Presupuesto Municipal Anual (SINIM)
- **Hub / Nodo**: IV. Gobernanza y Finanzas · Nodo #15
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: M$ CLP
- **Fuente oficial**: Sistema Nacional de Información Municipal (SINIM) — SUBDERE (https://datos.sinim.gov.cl/)
- **Frecuencia / Modo**: Trimestral · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 2.450,2 -> 3.321,1 (Variación de +35,5% (umbral operativo >= 20%)); Cisnes: 6.100 -> 7.985,3 (Variación de +30,9% (umbral operativo >= 20%)); Guaitecas: 3.300 -> 4.569,0 (Variación de +38,5% (umbral operativo >= 20%)); Cochrane: 4.600 -> 5.721,0 (Variación de +24,4% (umbral operativo >= 20%)); O'Higgins: 2.150 -> 5.323,8 (Variación de +147,6% (umbral operativo >= 20%)); Tortel: 2.050 -> 3.440,7 (Variación de +67,8% (umbral operativo >= 20%)); Río Ibáñez: 3.950 -> 6.252,9 (Variación de +58,3% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 26.540,8 | 27.611 | 1.070,2 | +4,0% | NO |
| `11102` | Lago Verde | 2.450,2 | 3.321,1 | 870,9 | +35,5% | SI (Variación de +35,5% (umbral operativo >= 20%)) |
| `11201` | Aysén | 14.210,5 | 14.614,3 | 403,8 | +2,8% | NO |
| `11202` | Cisnes | 6.100 | 7.985,3 | 1.885,3 | +30,9% | SI (Variación de +30,9% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 3.300 | 4.569,0 | 1.269,0 | +38,5% | SI (Variación de +38,5% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 4.600 | 5.721,0 | 1.121,0 | +24,4% | SI (Variación de +24,4% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 2.150 | 5.323,8 | 3.173,8 | +147,6% | SI (Variación de +147,6% (umbral operativo >= 20%)) |
| `11303` | Tortel | 2.050 | 3.440,7 | 1.390,7 | +67,8% | SI (Variación de +67,8% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 5.400 | 5.981,7 | 581,7 | +10,8% | NO |
| `11402` | Río Ibáñez | 3.950 | 6.252,9 | 2.302,9 | +58,3% | SI (Variación de +58,3% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
