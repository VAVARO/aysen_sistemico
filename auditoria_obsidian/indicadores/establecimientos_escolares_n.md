---
id: respaldo_indicador_establecimientos_escolares_n
title: "Respaldo de Indicador — Establecimientos Escolares (SLEP / MINEDUC) (establecimientos_escolares_n)"
type: respaldo_indicador
variable_clave: "establecimientos_escolares_n"
tipo_dato: "numeric"
nivel_umbral: "estructural"
umbral_outlier_pct: 5
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 25
unidad: "establecimientos"
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

# Respaldo de Indicador: `establecimientos_escolares_n`

- **Nombre**: Establecimientos Escolares (SLEP / MINEDUC)
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #25
- **Umbral de outlier**: estructural (>= 5%)
- **Unidad**: establecimientos
- **Fuente oficial**: Ministerio de Educación (MINEDUC) — Centro de Estudios / Servicio Local de Educación Pública (SLEP Aysén) (https://datosabiertos.mineduc.cl/)
- **Frecuencia / Modo**: Anual · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 33 -> 40 (Variación de +21,2% (umbral estructural >= 5%)); Lago Verde: 4 -> 3 (Variación de -25,0% (umbral estructural >= 5%)); Aysén: 18 -> 19 (Variación de +5,6% (umbral estructural >= 5%)); Cisnes: 9 -> 8 (Variación de -11,1% (umbral estructural >= 5%)); Cochrane: 4 -> 2 (Variación de -50,0% (umbral estructural >= 5%)); O'Higgins: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%)); Tortel: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 33 | 40 | 7 | +21,2% | SI (Variación de +21,2% (umbral estructural >= 5%)) |
| `11102` | Lago Verde | 4 | 3 | -1 | -25,0% | SI (Variación de -25,0% (umbral estructural >= 5%)) |
| `11201` | Aysén | 18 | 19 | 1 | +5,6% | SI (Variación de +5,6% (umbral estructural >= 5%)) |
| `11202` | Cisnes | 9 | 8 | -1 | -11,1% | SI (Variación de -11,1% (umbral estructural >= 5%)) |
| `11301` | Cochrane | 4 | 2 | -2 | -50,0% | SI (Variación de -50,0% (umbral estructural >= 5%)) |
| `11302` | O'Higgins | 2 | 1 | -1 | -50,0% | SI (Variación de -50,0% (umbral estructural >= 5%)) |
| `11303` | Tortel | 2 | 1 | -1 | -50,0% | SI (Variación de -50,0% (umbral estructural >= 5%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 7 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
