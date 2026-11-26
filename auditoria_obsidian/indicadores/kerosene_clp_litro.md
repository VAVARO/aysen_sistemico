---
id: respaldo_indicador_kerosene_clp_litro
title: "Respaldo de Indicador — Precio Minorista Kerosene Doméstico CNE (19-Nov-2026) (kerosene_clp_litro)"
type: respaldo_indicador
variable_clave: "kerosene_clp_litro"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 13
unidad: "$/L"
en_lexico_oficial: true
ultimo_estado: "agregada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-agregada
---

# Respaldo de Indicador: `kerosene_clp_litro`

- **Nombre**: Precio Minorista Kerosene Doméstico CNE (19-Nov-2026)
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #13
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: $/L
- **Fuente oficial**: Comisión Nacional de Energía (CNE) — Sistema de Información de Precios en Línea (https://www.bencinaenlinea.cl/)
- **Frecuencia / Modo**: Semanal / Mensual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | N/D | 1.485 | 1.485 | N/A (desde 0) | NO |
| `11102` | Lago Verde | N/D | 1.530 | 1.530 | N/A (desde 0) | NO |
| `11201` | Aysén | N/D | 1.470 | 1.470 | N/A (desde 0) | NO |
| `11202` | Cisnes | N/D | 1.495 | 1.495 | N/A (desde 0) | NO |
| `11203` | Guaitecas | N/D | 1.535 | 1.535 | N/A (desde 0) | NO |
| `11301` | Cochrane | N/D | 1.525 | 1.525 | N/A (desde 0) | NO |
| `11302` | O'Higgins | N/D | 1.541 | 1.541 | N/A (desde 0) | NO |
| `11303` | Tortel | N/D | 1.538 | 1.538 | N/A (desde 0) | NO |
| `11401` | Chile Chico | N/D | 1.510 | 1.510 | N/A (desde 0) | NO |
| `11402` | Río Ibáñez | N/D | 1.505 | 1.505 | N/A (desde 0) | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `agregada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
