---
id: respaldo_indicador_camas_hospitalarias
title: "Respaldo de Indicador — Camas Hospitalarias Red SSA (camas_hospitalarias)"
type: respaldo_indicador
variable_clave: "camas_hospitalarias"
tipo_dato: "numeric"
nivel_umbral: "estructural"
umbral_outlier_pct: 5
hub: "salud"
hub_titulo: "VIII. Salud"
nodo_id: 24
unidad: "camas"
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

# Respaldo de Indicador: `camas_hospitalarias`

- **Nombre**: Camas Hospitalarias Red SSA
- **Hub / Nodo**: VIII. Salud · Nodo #24
- **Umbral de outlier**: estructural (>= 5%)
- **Unidad**: camas
- **Fuente oficial**: Ministerio de Salud (MINSAL) — Departamento de Estadísticas e Información de Salud (DEIS) / Servicio de Salud Aysén (SSA) (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Mensual · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 167 -> 135 (Variación de -19,2% (umbral estructural >= 5%)); Aysén: 52 -> 56 (Variación de +7,7% (umbral estructural >= 5%)); Cisnes: 12 -> 8 (Variación de -33,3% (umbral estructural >= 5%)); Cochrane: 16 -> 7 (Variación de -56,3% (umbral estructural >= 5%)); Chile Chico: 14 -> 7 (Variación de -50,0% (umbral estructural >= 5%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 167 | 135 | -32 | -19,2% | SI (Variación de -19,2% (umbral estructural >= 5%)) |
| `11201` | Aysén | 52 | 56 | 4 | +7,7% | SI (Variación de +7,7% (umbral estructural >= 5%)) |
| `11202` | Cisnes | 12 | 8 | -4 | -33,3% | SI (Variación de -33,3% (umbral estructural >= 5%)) |
| `11301` | Cochrane | 16 | 7 | -9 | -56,3% | SI (Variación de -56,3% (umbral estructural >= 5%)) |
| `11401` | Chile Chico | 14 | 7 | -7 | -50,0% | SI (Variación de -50,0% (umbral estructural >= 5%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 5 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
