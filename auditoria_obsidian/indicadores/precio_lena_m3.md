---
id: respaldo_indicador_precio_lena_m3
title: "Respaldo de Indicador — Precio Metro Cúbico de Leña Seca (precio_lena_m3)"
type: respaldo_indicador
variable_clave: "precio_lena_m3"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 13
unidad: "CLP/m³"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
---

# Respaldo de Indicador: `precio_lena_m3`

- **Nombre**: Precio Metro Cúbico de Leña Seca
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #13
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: CLP/m³
- **Fuente oficial**: Comisión Nacional de Energía (CNE) — Sistema de Información de Precios en Línea (https://www.bencinaenlinea.cl/)
- **Frecuencia / Modo**: Semanal / Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11102` | Lago Verde | 38.000 | 36.000 | -2.000 | -5,3% | NO |
| `11202` | Cisnes | 42.000 | 44.000 | 2.000 | +4,8% | NO |
| `11203` | Guaitecas | 55.000 | 52.000 | -3.000 | -5,5% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 3 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
