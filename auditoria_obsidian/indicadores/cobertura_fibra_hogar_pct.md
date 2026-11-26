---
id: respaldo_indicador_cobertura_fibra_hogar_pct
title: "Respaldo de Indicador — Cobertura de Fibra Óptica Residencial (cobertura_fibra_hogar_pct)"
type: respaldo_indicador
variable_clave: "cobertura_fibra_hogar_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 14
unidad: "%"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: true
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
  - requiere-verificacion
---

# Respaldo de Indicador: `cobertura_fibra_hogar_pct`

- **Nombre**: Cobertura de Fibra Óptica Residencial
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #14
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: %
- **Fuente oficial**: Subsecretaría de Telecomunicaciones (SUBTEL) — Proyecto FOA (https://www.subtel.gob.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 0,80 -> 0 (Caída a 0 desde 0,80); O'Higgins: 1,50 -> 0 (Caída a 0 desde 1,50) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Informe Nacional FDT SUBTEL 3T-2026 / Adjudicaciones Tortel-O'Higgins (1S-2028) y FDT-2025-03 (33 localidades)

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11102` | Lago Verde | 0,80 | 0 | -0,80 | -100,0% | SI (Caída a 0 desde 0,80) |
| `11302` | O'Higgins | 1,50 | 0 | -1,50 | -100,0% | SI (Caída a 0 desde 1,50) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 2 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
