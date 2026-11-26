---
id: respaldo_indicador_llegadas_por_cama_turistica
title: "Respaldo de Indicador — Llegadas EMAT por Cama Turística Disponible (rotación) (llegadas_por_cama_turistica)"
type: respaldo_indicador
variable_clave: "llegadas_por_cama_turistica"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "llegadas/cama"
en_lexico_oficial: true
ultimo_estado: "agregada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-agregada
---

# Respaldo de Indicador: `llegadas_por_cama_turistica`

- **Nombre**: Llegadas EMAT por Cama Turística Disponible (rotación)
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: llegadas/cama
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | N/D | 21,4 | 21,4 | N/A (desde 0) | NO |
| `11102` | Lago Verde | N/D | 9,10 | 9,10 | N/A (desde 0) | NO |
| `11201` | Aysén | N/D | 17,2 | 17,2 | N/A (desde 0) | NO |
| `11202` | Cisnes | N/D | 19,8 | 19,8 | N/A (desde 0) | NO |
| `11203` | Guaitecas | N/D | 8,30 | 8,30 | N/A (desde 0) | NO |
| `11301` | Cochrane | N/D | 17,2 | 17,2 | N/A (desde 0) | NO |
| `11302` | O'Higgins | N/D | 14 | 14 | N/A (desde 0) | NO |
| `11303` | Tortel | N/D | 16,3 | 16,3 | N/A (desde 0) | NO |
| `11401` | Chile Chico | N/D | 18,1 | 18,1 | N/A (desde 0) | NO |
| `11402` | Río Ibáñez | N/D | 25,3 | 25,3 | N/A (desde 0) | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `agregada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
