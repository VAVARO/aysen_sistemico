---
id: respaldo_indicador_costo_diesel_aislado_clp
title: "Respaldo de Indicador — Costo de Generación Diésel Aislado (costo_diesel_aislado_clp)"
type: respaldo_indicador
variable_clave: "costo_diesel_aislado_clp"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 12
unidad: "CLP/kWh"
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

# Respaldo de Indicador: `costo_diesel_aislado_clp`

- **Nombre**: Costo de Generación Diésel Aislado
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #12
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: CLP/kWh
- **Fuente oficial**: Superintendencia de Electricidad y Combustibles (SEC) / CNE (https://www.sec.cl/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Aysén: 0 -> 480 (Transición desde 0 a 480); Cisnes: 380 -> 495 (Variación de +30,3% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Art. 173° LGSE / Pliegos SSAA FNDR GORE-SUBDERE (reconciliación 6 comunas con micro-redes aisladas)

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11102` | Lago Verde | 560 | 540 | -20 | -3,6% | NO |
| `11201` | Aysén | 0 | 480 | 480 | N/A (desde 0) | SI (Transición desde 0 a 480) |
| `11202` | Cisnes | 380 | 495 | 115 | +30,3% | SI (Variación de +30,3% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 3 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
