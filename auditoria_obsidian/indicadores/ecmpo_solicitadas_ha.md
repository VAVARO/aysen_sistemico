---
id: respaldo_indicador_ecmpo_solicitadas_ha
title: "Respaldo de Indicador — Superficie de Solicitudes ECMPO (ecmpo_solicitadas_ha)"
type: respaldo_indicador
variable_clave: "ecmpo_solicitadas_ha"
tipo_dato: "numeric"
nivel_umbral: "estructural"
umbral_outlier_pct: 5
hub: "salmonicultura"
hub_titulo: "II. Pesca, Acuicultura y Mar"
nodo_id: 8
unidad: "ha"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: true
ultima_corrida: "2026-11-25"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
  - requiere-verificacion
---

# Respaldo de Indicador: `ecmpo_solicitadas_ha`

- **Nombre**: Superficie de Solicitudes ECMPO
- **Hub / Nodo**: II. Pesca, Acuicultura y Mar · Nodo #8
- **Umbral de outlier**: estructural (>= 5%)
- **Unidad**: ha
- **Fuente oficial**: Servicio Nacional de Pesca y Acuicultura (SERNAPESCA) / SUBPESCA (https://www.sernapesca.cl/areas-de-accion/acuicultura/)
- **Frecuencia / Modo**: Trimestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-25_head_1_vs_head|Corrida 2026-11-25]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Guaitecas: 0 -> 148.000 (Transición desde 0 a 148.000); Tortel: 0 -> 18.500 (Transición desde 0 a 18.500)

## Comparación Comunal (HEAD~1 vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11203` | Guaitecas | 0 | 148.000 | 148.000 | N/A (desde 0) | SI (Transición desde 0 a 148.000) |
| `11303` | Tortel | 0 | 18.500 | 18.500 | N/A (desde 0) | SI (Transición desde 0 a 18.500) |

## Historial de Corridas

- **2026-11-25** ([[corridas/corrida_2026-11-25_head_1_vs_head|corrida_2026-11-25_head_1_vs_head]]): estado `modificada` · 2 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
