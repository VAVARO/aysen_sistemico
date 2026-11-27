---
id: respaldo_indicador_establecimientos_educacion_conectados_n
title: "Respaldo de Indicador — Establecimientos Educacionales Conectados (establecimientos_educacion_conectados_n)"
type: respaldo_indicador
variable_clave: "establecimientos_educacion_conectados_n"
tipo_dato: "numeric"
nivel_umbral: "estructural"
umbral_outlier_pct: 5
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 14
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

# Respaldo de Indicador: `establecimientos_educacion_conectados_n`

- **Nombre**: Establecimientos Educacionales Conectados
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #14
- **Umbral de outlier**: estructural (>= 5%)
- **Unidad**: establecimientos
- **Fuente oficial**: Subsecretaría de Telecomunicaciones (SUBTEL) — Proyecto FOA (https://www.subtel.gob.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Cochrane: 4 -> 2 (Variación de -50,0% (umbral estructural >= 5%)); O'Higgins: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%)); Tortel: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11301` | Cochrane | 4 | 2 | -2 | -50,0% | SI (Variación de -50,0% (umbral estructural >= 5%)) |
| `11302` | O'Higgins | 2 | 1 | -1 | -50,0% | SI (Variación de -50,0% (umbral estructural >= 5%)) |
| `11303` | Tortel | 2 | 1 | -1 | -50,0% | SI (Variación de -50,0% (umbral estructural >= 5%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 3 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
