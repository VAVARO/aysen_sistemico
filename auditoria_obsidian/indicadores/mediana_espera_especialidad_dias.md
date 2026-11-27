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
requiere_verificacion: true
ultima_corrida: "2026-11-27"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
  - requiere-verificacion
---

# Respaldo de Indicador: `mediana_espera_especialidad_dias`

- **Nombre**: Mediana de Espera en Consulta de Especialidad
- **Hub / Nodo**: VIII. Salud · Nodo #38
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: días
- **Fuente oficial**: Servicio de Salud Aysén (SSA) / DEIS MINSAL (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 218 -> 124 (Variación de -43,1% (umbral operativo >= 20%)); Lago Verde: 334 -> 186 (Variación de -44,3% (umbral operativo >= 20%)); Aysén: 242 -> 138 (Variación de -43,0% (umbral operativo >= 20%)); Cisnes: 274 -> 162 (Variación de -40,9% (umbral operativo >= 20%)); Guaitecas: 346 -> 194 (Variación de -43,9% (umbral operativo >= 20%)); Cochrane: 269 -> 146 (Variación de -45,7% (umbral operativo >= 20%)); O'Higgins: 305 -> 172 (Variación de -43,6% (umbral operativo >= 20%)); Tortel: 288 -> 148 (Variación de -48,6% (umbral operativo >= 20%)); Chile Chico: 262 -> 152 (Variación de -42,0% (umbral operativo >= 20%)); Río Ibáñez: 302 -> 168 (Variación de -44,4% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 218 | 124 | -94 | -43,1% | SI (Variación de -43,1% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 334 | 186 | -148 | -44,3% | SI (Variación de -44,3% (umbral operativo >= 20%)) |
| `11201` | Aysén | 242 | 138 | -104 | -43,0% | SI (Variación de -43,0% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 274 | 162 | -112 | -40,9% | SI (Variación de -40,9% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 346 | 194 | -152 | -43,9% | SI (Variación de -43,9% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 269 | 146 | -123 | -45,7% | SI (Variación de -45,7% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 305 | 172 | -133 | -43,6% | SI (Variación de -43,6% (umbral operativo >= 20%)) |
| `11303` | Tortel | 288 | 148 | -140 | -48,6% | SI (Variación de -48,6% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 262 | 152 | -110 | -42,0% | SI (Variación de -42,0% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 302 | 168 | -134 | -44,4% | SI (Variación de -44,4% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.
- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
