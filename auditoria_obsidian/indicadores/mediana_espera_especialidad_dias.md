---
id: respaldo_indicador_mediana_espera_especialidad_dias
title: "Respaldo de Indicador — Mediana de Espera en Consulta de Especialidad (mediana_espera_especialidad_dias)"
type: respaldo_indicador
variable_clave: "mediana_espera_especialidad_dias"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "salud"
hub_titulo: "VIII. Salud"
nodo_id: 38
unidad: "días"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
---

# Respaldo de Indicador: `mediana_espera_especialidad_dias`

- **Nombre**: Mediana de Espera en Consulta de Especialidad
- **Hub / Nodo**: VIII. Salud · Nodo #38
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: días
- **Fuente oficial**: Servicio de Salud Aysén (SSA) / DEIS MINSAL (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 235 | 218 | -17 | -7,2% | NO |
| `11102` | Lago Verde | 312 | 334 | 22 | +7,1% | NO |
| `11201` | Aysén | 254 | 242 | -12 | -4,7% | NO |
| `11202` | Cisnes | 278 | 274 | -4 | -1,4% | NO |
| `11203` | Guaitecas | 318 | 346 | 28 | +8,8% | NO |
| `11301` | Cochrane | 285 | 269 | -16 | -5,6% | NO |
| `11302` | O'Higgins | 304 | 305 | 1 | +0,3% | NO |
| `11303` | Tortel | 294 | 288 | -6 | -2,0% | NO |
| `11401` | Chile Chico | 268 | 262 | -6 | -2,2% | NO |
| `11402` | Río Ibáñez | 292 | 302 | 10 | +3,4% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
