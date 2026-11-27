---
id: respaldo_indicador_aeroevacuaciones_samu_n
title: "Respaldo de Indicador — Aeroevacuaciones Médicas SAMU Anuales (aeroevacuaciones_samu_n)"
type: respaldo_indicador
variable_clave: "aeroevacuaciones_samu_n"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "salud"
hub_titulo: "VIII. Salud"
nodo_id: 24
unidad: "evacuaciones"
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

# Respaldo de Indicador: `aeroevacuaciones_samu_n`

- **Nombre**: Aeroevacuaciones Médicas SAMU Anuales
- **Hub / Nodo**: VIII. Salud · Nodo #24
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: evacuaciones
- **Fuente oficial**: Ministerio de Salud (MINSAL) — Departamento de Estadísticas e Información de Salud (DEIS) / Servicio de Salud Aysén (SSA) (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Mensual · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 0 -> 12 (Transición desde 0 a 12)

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 0 | 12 | 12 | N/A (desde 0) | SI (Transición desde 0 a 12) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 1 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
