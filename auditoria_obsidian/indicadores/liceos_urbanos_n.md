---
id: respaldo_indicador_liceos_urbanos_n
title: "Respaldo de Indicador — Liceos Urbanos (liceos_urbanos_n)"
type: respaldo_indicador
variable_clave: "liceos_urbanos_n"
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

# Respaldo de Indicador: `liceos_urbanos_n`

- **Nombre**: Liceos Urbanos
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #25
- **Umbral de outlier**: estructural (>= 5%)
- **Unidad**: establecimientos
- **Fuente oficial**: Ministerio de Educación (MINEDUC) — Centro de Estudios / Servicio Local de Educación Pública (SLEP Aysén) (https://datosabiertos.mineduc.cl/)
- **Frecuencia / Modo**: Anual · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Tortel: 1 -> 0 (Caída a 0 desde 1)

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11303` | Tortel | 1 | 0 | -1 | -100,0% | SI (Caída a 0 desde 1) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 1 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
