---
id: respaldo_indicador_espera_no_ges_n
title: "Respaldo de Indicador — Lista de Espera Consultas No GES (espera_no_ges_n)"
type: respaldo_indicador
variable_clave: "espera_no_ges_n"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "salud"
hub_titulo: "VIII. Salud"
nodo_id: 24
unidad: "consultas"
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

# Respaldo de Indicador: `espera_no_ges_n`

- **Nombre**: Lista de Espera Consultas No GES
- **Hub / Nodo**: VIII. Salud · Nodo #24
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: consultas
- **Fuente oficial**: Ministerio de Salud (MINSAL) — Departamento de Estadísticas e Información de Salud (DEIS) / Servicio de Salud Aysén (SSA) (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Mensual · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 5.420 -> 8.120 (Variación de +49,8% (umbral operativo >= 20%)); Aysén: 2.450 -> 3.465 (Variación de +41,4% (umbral operativo >= 20%)); Guaitecas: 410 -> 268 (Variación de -34,6% (umbral operativo >= 20%)); Cochrane: 460 -> 617 (Variación de +34,1% (umbral operativo >= 20%)); Tortel: 112 -> 88 (Variación de -21,4% (umbral operativo >= 20%)); Chile Chico: 520 -> 682 (Variación de +31,2% (umbral operativo >= 20%)); Río Ibáñez: 280 -> 422 (Variación de +50,7% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 5.420 | 8.120 | 2.700 | +49,8% | SI (Variación de +49,8% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 128 | 148 | 20 | +15,6% | NO |
| `11201` | Aysén | 2.450 | 3.465 | 1.015 | +41,4% | SI (Variación de +41,4% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 890 | 835 | -55 | -6,2% | NO |
| `11203` | Guaitecas | 410 | 268 | -142 | -34,6% | SI (Variación de -34,6% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 460 | 617 | 157 | +34,1% | SI (Variación de +34,1% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 96 | 106 | 10 | +10,4% | NO |
| `11303` | Tortel | 112 | 88 | -24 | -21,4% | SI (Variación de -21,4% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 520 | 682 | 162 | +31,2% | SI (Variación de +31,2% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 280 | 422 | 142 | +50,7% | SI (Variación de +50,7% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
