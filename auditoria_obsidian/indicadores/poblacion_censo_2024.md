---
id: respaldo_indicador_poblacion_censo_2024
title: "Respaldo de Indicador — Población Comunal Censo 2024 (poblacion_censo_2024)"
type: respaldo_indicador
variable_clave: "poblacion_censo_2024"
tipo_dato: "numeric"
nivel_umbral: "estructural"
umbral_outlier_pct: 5
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 23
unidad: "habitantes"
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

# Respaldo de Indicador: `poblacion_censo_2024`

- **Nombre**: Población Comunal Censo 2024
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #23
- **Umbral de outlier**: estructural (>= 5%)
- **Unidad**: habitantes
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / Ministerio de Desarrollo Social y Familia (MDSF) (https://censo2024.ine.gob.cl/)
- **Frecuencia / Modo**: Decenal (Censo) / Bienal (CASEN) · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 779 -> 882 (Variación de +13,2% (umbral estructural >= 5%)); Tortel: 505 -> 563 (Variación de +11,5% (umbral estructural >= 5%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11102` | Lago Verde | 779 | 882 | 103 | +13,2% | SI (Variación de +13,2% (umbral estructural >= 5%)) |
| `11202` | Cisnes | 5.137 | 5.335 | 198 | +3,9% | NO |
| `11301` | Cochrane | 3.458 | 3.492 | 34 | +1,0% | NO |
| `11302` | O'Higgins | 647 | 664 | 17 | +2,6% | NO |
| `11303` | Tortel | 505 | 563 | 58 | +11,5% | SI (Variación de +11,5% (umbral estructural >= 5%)) |
| `11401` | Chile Chico | 4.905 | 4.950 | 45 | +0,9% | NO |
| `11402` | Río Ibáñez | 2.723 | 2.671 | -52 | -1,9% | NO |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 7 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
