---
id: respaldo_indicador_llegadas_turistas_emat_n
title: "Respaldo de Indicador — Llegadas de Pasajeros a Alojamientos EMAT (INE 2025) (llegadas_turistas_emat_n)"
type: respaldo_indicador
variable_clave: "llegadas_turistas_emat_n"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "llegadas"
en_lexico_oficial: true
ultimo_estado: "agregada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-agregada
---

# Respaldo de Indicador: `llegadas_turistas_emat_n`

- **Nombre**: Llegadas de Pasajeros a Alojamientos EMAT (INE 2025)
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: llegadas
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | N/D | 73.200 | 73.200 | N/A (desde 0) | NO |
| `11102` | Lago Verde | N/D | 1.500 | 1.500 | N/A (desde 0) | NO |
| `11201` | Aysén | N/D | 31.800 | 31.800 | N/A (desde 0) | NO |
| `11202` | Cisnes | N/D | 24.600 | 24.600 | N/A (desde 0) | NO |
| `11203` | Guaitecas | N/D | 1.200 | 1.200 | N/A (desde 0) | NO |
| `11301` | Cochrane | N/D | 11.900 | 11.900 | N/A (desde 0) | NO |
| `11302` | O'Higgins | N/D | 3.361 | 3.361 | N/A (desde 0) | NO |
| `11303` | Tortel | N/D | 5.850 | 5.850 | N/A (desde 0) | NO |
| `11401` | Chile Chico | N/D | 14.100 | 14.100 | N/A (desde 0) | NO |
| `11402` | Río Ibáñez | N/D | 29.100 | 29.100 | N/A (desde 0) | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `agregada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
