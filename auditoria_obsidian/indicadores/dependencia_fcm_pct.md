---
id: respaldo_indicador_dependencia_fcm_pct
title: "Respaldo de Indicador — Dependencia del Fondo Común Municipal (FCM) (dependencia_fcm_pct)"
type: respaldo_indicador
variable_clave: "dependencia_fcm_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "gobernanza"
hub_titulo: "IV. Gobernanza y Finanzas"
nodo_id: 16
unidad: "% presupuesto"
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

# Respaldo de Indicador: `dependencia_fcm_pct`

- **Nombre**: Dependencia del Fondo Común Municipal (FCM)
- **Hub / Nodo**: IV. Gobernanza y Finanzas · Nodo #16
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: % presupuesto
- **Fuente oficial**: SUBDERE / Tesorería General de la República (TGR) (https://datos.sinim.gov.cl/)
- **Frecuencia / Modo**: Trimestral · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 46,5 -> 58,4 (Variación de +25,6% (umbral operativo >= 20%)); Cisnes: 74,5 -> 48,7 (Variación de -34,6% (umbral operativo >= 20%)); Chile Chico: 71,2 -> 86,5 (Variación de +21,5% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 46,5 | 58,4 | 11,9 | +25,6% | SI (Variación de +25,6% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 89,2 | 83,9 | -5,30 | -5,9% | NO |
| `11201` | Aysén | 52,8 | 61,1 | 8,30 | +15,7% | NO |
| `11202` | Cisnes | 74,5 | 48,7 | -25,8 | -34,6% | SI (Variación de -34,6% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 83 | 73,1 | -9,90 | -11,9% | NO |
| `11301` | Cochrane | 76,8 | 85,7 | 8,90 | +11,6% | NO |
| `11302` | O'Higgins | 91,5 | 95,3 | 3,80 | +4,2% | NO |
| `11303` | Tortel | 92,8 | 95,4 | 2,60 | +2,8% | NO |
| `11401` | Chile Chico | 71,2 | 86,5 | 15,3 | +21,5% | SI (Variación de +21,5% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 79,6 | 86,6 | 7 | +8,8% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
