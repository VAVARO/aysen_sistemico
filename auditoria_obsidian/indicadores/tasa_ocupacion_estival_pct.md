---
id: respaldo_indicador_tasa_ocupacion_estival_pct
title: "Respaldo de Indicador — Tasa de Ocupación Hotelera Estival (tasa_ocupacion_estival_pct)"
type: respaldo_indicador
variable_clave: "tasa_ocupacion_estival_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 3
unidad: "%"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
---

# Respaldo de Indicador: `tasa_ocupacion_estival_pct`

- **Nombre**: Tasa de Ocupación Hotelera Estival
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #3
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: %
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / SERNATUR (https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo)
- **Frecuencia / Modo**: Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 76,5 | 89,9 | 13,4 | +17,5% | NO |
| `11102` | Lago Verde | 58,2 | 64,5 | 6,30 | +10,8% | NO |
| `11201` | Aysén | 72,1 | 84,2 | 12,1 | +16,8% | NO |
| `11202` | Cisnes | 84,5 | 70 | -14,5 | -17,2% | NO |
| `11203` | Guaitecas | 64 | 62 | -2 | -3,1% | NO |
| `11301` | Cochrane | 81 | 79,4 | -1,60 | -2,0% | NO |
| `11302` | O'Higgins | 86,5 | 80,5 | -6 | -6,9% | NO |
| `11303` | Tortel | 85 | 78,6 | -6,40 | -7,5% | NO |
| `11401` | Chile Chico | 82 | 76,2 | -5,80 | -7,1% | NO |
| `11402` | Río Ibáñez | 89,2 | 78,8 | -10,4 | -11,7% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
