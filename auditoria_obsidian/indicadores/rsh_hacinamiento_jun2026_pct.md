---
id: respaldo_indicador_rsh_hacinamiento_jun2026_pct
title: "Respaldo de Indicador — Hogares Hacinados en Registro Social de Hogares (Jun 2026) (rsh_hacinamiento_jun2026_pct)"
type: respaldo_indicador
variable_clave: "rsh_hacinamiento_jun2026_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 23
unidad: "%"
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

# Respaldo de Indicador: `rsh_hacinamiento_jun2026_pct`

- **Nombre**: Hogares Hacinados en Registro Social de Hogares (Jun 2026)
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #23
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: %
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / Ministerio de Desarrollo Social y Familia (MDSF) (https://censo2024.ine.gob.cl/)
- **Frecuencia / Modo**: Decenal (Censo) / Bienal (CASEN) · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Tortel: 7,40 -> 9 (Variación de +21,6% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 6,20 | 6,70 | 0,50 | +8,1% | NO |
| `11202` | Cisnes | 3,80 | 3,90 | 0,10 | +2,6% | NO |
| `11203` | Guaitecas | 10,1 | 11 | 0,90 | +8,9% | NO |
| `11302` | O'Higgins | 5,10 | 4,60 | -0,50 | -9,8% | NO |
| `11303` | Tortel | 7,40 | 9 | 1,60 | +21,6% | SI (Variación de +21,6% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 5,60 | 5,90 | 0,30 | +5,4% | NO |
| `11402` | Río Ibáñez | 4,70 | 4,90 | 0,20 | +4,3% | NO |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 7 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
