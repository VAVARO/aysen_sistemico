---
id: respaldo_indicador_escuelas_rurales_multigrado_n
title: "Respaldo de Indicador — Escuelas Rurales Multigrado (escuelas_rurales_multigrado_n)"
type: respaldo_indicador
variable_clave: "escuelas_rurales_multigrado_n"
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

# Respaldo de Indicador: `escuelas_rurales_multigrado_n`

- **Nombre**: Escuelas Rurales Multigrado
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #25
- **Umbral de outlier**: estructural (>= 5%)
- **Unidad**: establecimientos
- **Fuente oficial**: Ministerio de Educación (MINEDUC) — Centro de Estudios / Servicio Local de Educación Pública (SLEP Aysén) (https://datosabiertos.mineduc.cl/)
- **Frecuencia / Modo**: Anual · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Tortel: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11303` | Tortel | 2 | 1 | -1 | -50,0% | SI (Variación de -50,0% (umbral estructural >= 5%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 1 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
