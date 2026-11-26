---
id: respaldo_indicador_ipp_per_capita_clp
title: "Respaldo de Indicador — Ingresos Propios Permanentes per Cápita (SINIM) (ipp_per_capita_clp)"
type: respaldo_indicador
variable_clave: "ipp_per_capita_clp"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "gobernanza"
hub_titulo: "IV. Gobernanza y Finanzas"
nodo_id: 15
unidad: "CLP/hab"
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

# Respaldo de Indicador: `ipp_per_capita_clp`

- **Nombre**: Ingresos Propios Permanentes per Cápita (SINIM)
- **Hub / Nodo**: IV. Gobernanza y Finanzas · Nodo #15
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: CLP/hab
- **Fuente oficial**: Sistema Nacional de Información Municipal (SINIM) — SUBDERE (https://datos.sinim.gov.cl/)
- **Frecuencia / Modo**: Trimestral · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 245.565 -> 148.232 (Variación de -39,6% (umbral operativo >= 20%)); Lago Verde: 339.692 -> 552.952 (Variación de +62,8% (umbral operativo >= 20%)); Aysén: 289.478 -> 194.770 (Variación de -32,7% (umbral operativo >= 20%)); Cisnes: 302.813 -> 580.062 (Variación de +91,6% (umbral operativo >= 20%)); Guaitecas: 351.067 -> 528.924 (Variación de +50,7% (umbral operativo >= 20%)); Cochrane: 308.606 -> 145.419 (Variación de -52,9% (umbral operativo >= 20%)); O'Higgins: 282.455 -> 182.859 (Variación de -35,3% (umbral operativo >= 20%)); Tortel: 292.277 -> 222.455 (Variación de -23,9% (umbral operativo >= 20%)); Chile Chico: 317.059 -> 135.441 (Variación de -57,3% (umbral operativo >= 20%)); Río Ibáñez: 295.922 -> 185.784 (Variación de -37,2% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 245.565 | 148.232 | -97.333 | -39,6% | SI (Variación de -39,6% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 339.692 | 552.952 | 213.260 | +62,8% | SI (Variación de +62,8% (umbral operativo >= 20%)) |
| `11201` | Aysén | 289.478 | 194.770 | -94.708 | -32,7% | SI (Variación de -32,7% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 302.813 | 580.062 | 277.249 | +91,6% | SI (Variación de +91,6% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 351.067 | 528.924 | 177.857 | +50,7% | SI (Variación de +50,7% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 308.606 | 145.419 | -163.187 | -52,9% | SI (Variación de -52,9% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 282.455 | 182.859 | -99.596 | -35,3% | SI (Variación de -35,3% (umbral operativo >= 20%)) |
| `11303` | Tortel | 292.277 | 222.455 | -69.822 | -23,9% | SI (Variación de -23,9% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 317.059 | 135.441 | -181.618 | -57,3% | SI (Variación de -57,3% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 295.922 | 185.784 | -110.138 | -37,2% | SI (Variación de -37,2% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
