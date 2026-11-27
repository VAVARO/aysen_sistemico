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
requiere_verificacion: false
ultima_corrida: "2026-11-27"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
---

# Respaldo de Indicador: `ipp_per_capita_clp`

- **Nombre**: Ingresos Propios Permanentes per Cápita (SINIM)
- **Hub / Nodo**: IV. Gobernanza y Finanzas · Nodo #15
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: CLP/hab
- **Fuente oficial**: Sistema Nacional de Información Municipal (SINIM) — SUBDERE (https://datos.sinim.gov.cl/)
- **Frecuencia / Modo**: Trimestral · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11102` | Lago Verde | 552.952 | 488.379 | -64.573 | -11,7% | NO |
| `11202` | Cisnes | 580.062 | 558.534 | -21.528 | -3,7% | NO |
| `11301` | Cochrane | 145.419 | 144.003 | -1.416 | -1,0% | NO |
| `11302` | O'Higgins | 182.859 | 178.178 | -4.681 | -2,6% | NO |
| `11303` | Tortel | 222.455 | 199.538 | -22.917 | -10,3% | NO |
| `11401` | Chile Chico | 135.441 | 134.210 | -1.231 | -0,9% | NO |
| `11402` | Río Ibáñez | 185.784 | 189.401 | 3.617 | +1,9% | NO |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 7 comuna(s) con cambio/registro · alertas: 0.
- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
