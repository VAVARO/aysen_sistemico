---
id: respaldo_indicador_subsidio_fiscal_diesel_kwh_clp
title: "Respaldo de Indicador — Subsidio Fiscal a Generación Diésel (subsidio_fiscal_diesel_kwh_clp)"
type: respaldo_indicador
variable_clave: "subsidio_fiscal_diesel_kwh_clp"
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

# Respaldo de Indicador: `subsidio_fiscal_diesel_kwh_clp`

- **Nombre**: Subsidio Fiscal a Generación Diésel
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #12
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: CLP/kWh
- **Fuente oficial**: Superintendencia de Electricidad y Combustibles (SEC) / CNE (https://www.sec.cl/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Aysén: 0 -> 192 (Transición desde 0 a 192); Cisnes: 145 -> 245 (Variación de +69,0% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Subsidio operación diésel FNDR/SUBDERE en SSAA y micro-redes litorales/insulares

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11102` | Lago Verde | 302 | 246 | -56 | -18,5% | NO |
| `11201` | Aysén | 0 | 192 | 192 | N/A (desde 0) | SI (Transición desde 0 a 192) |
| `11202` | Cisnes | 145 | 245 | 100 | +69,0% | SI (Variación de +69,0% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 375 | 328 | -47 | -12,5% | NO |
| `11302` | O'Higgins | 358 | 312 | -46 | -12,8% | NO |
| `11303` | Tortel | 412 | 362 | -50 | -12,1% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 6 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
