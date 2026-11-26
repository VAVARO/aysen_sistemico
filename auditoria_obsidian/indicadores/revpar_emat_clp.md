---
id: respaldo_indicador_revpar_emat_clp
title: "Respaldo de Indicador — Ingreso por Habitación Disponible EMAT Real (RevPAR CLP) (revpar_emat_clp)"
type: respaldo_indicador
variable_clave: "revpar_emat_clp"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "$ CLP"
en_lexico_oficial: true
ultimo_estado: "agregada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-agregada
---

# Respaldo de Indicador: `revpar_emat_clp`

- **Nombre**: Ingreso por Habitación Disponible EMAT Real (RevPAR CLP)
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: $ CLP
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | N/D | 17.981 | 17.981 | N/A (desde 0) | NO |
| `11102` | Lago Verde | N/D | 7.570 | 7.570 | N/A (desde 0) | NO |
| `11201` | Aysén | N/D | 20.625 | 20.625 | N/A (desde 0) | NO |
| `11202` | Cisnes | N/D | 20.376 | 20.376 | N/A (desde 0) | NO |
| `11203` | Guaitecas | N/D | 8.811 | 8.811 | N/A (desde 0) | NO |
| `11301` | Cochrane | N/D | 16.531 | 16.531 | N/A (desde 0) | NO |
| `11302` | O'Higgins | N/D | 10.196 | 10.196 | N/A (desde 0) | NO |
| `11303` | Tortel | N/D | 10.675 | 10.675 | N/A (desde 0) | NO |
| `11401` | Chile Chico | N/D | 13.470 | 13.470 | N/A (desde 0) | NO |
| `11402` | Río Ibáñez | N/D | 13.790 | 13.790 | N/A (desde 0) | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `agregada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
