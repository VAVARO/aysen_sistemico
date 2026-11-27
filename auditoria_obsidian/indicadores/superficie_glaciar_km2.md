---
id: respaldo_indicador_superficie_glaciar_km2
title: "Respaldo de Indicador — Superficie de Glaciares DGA (superficie_glaciar_km2)"
type: respaldo_indicador
variable_clave: "superficie_glaciar_km2"
tipo_dato: "numeric"
nivel_umbral: "estructural"
umbral_outlier_pct: 5
hub: "biodiversidad"
hub_titulo: "VII. Biodiversidad, Clima y Riesgos"
nodo_id: 30
unidad: "km²"
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

# Respaldo de Indicador: `superficie_glaciar_km2`

- **Nombre**: Superficie de Glaciares DGA
- **Hub / Nodo**: VII. Biodiversidad, Clima y Riesgos · Nodo #30
- **Umbral de outlier**: estructural (>= 5%)
- **Unidad**: km²
- **Fuente oficial**: Sistema de Información Nacional de Calidad del Aire (SINCA MMA) / Dirección General de Aguas (DGA MOP) (https://sinca.mma.gob.cl/)
- **Frecuencia / Modo**: Horario / Continuo · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 42,5 -> 28,2 (Variación de -33,6% (umbral estructural >= 5%)); Lago Verde: 38,2 -> 64 (Variación de +67,5% (umbral estructural >= 5%)); Aysén: 1.850 -> 1.542,6 (Variación de -16,6% (umbral estructural >= 5%)); Cisnes: 480 -> 184,3 (Variación de -61,6% (umbral estructural >= 5%)); Cochrane: 890 -> 512,4 (Variación de -42,4% (umbral estructural >= 5%)); O'Higgins: 3.450 -> 2.284,2 (Variación de -33,8% (umbral estructural >= 5%)); Tortel: 2.680 -> 3.485,4 (Variación de +30,1% (umbral estructural >= 5%)); Chile Chico: 145 -> 238,5 (Variación de +64,5% (umbral estructural >= 5%)); Río Ibáñez: 460 -> 382 (Variación de -17,0% (umbral estructural >= 5%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 42,5 | 28,2 | -14,3 | -33,6% | SI (Variación de -33,6% (umbral estructural >= 5%)) |
| `11102` | Lago Verde | 38,2 | 64 | 25,8 | +67,5% | SI (Variación de +67,5% (umbral estructural >= 5%)) |
| `11201` | Aysén | 1.850 | 1.542,6 | -307,4 | -16,6% | SI (Variación de -16,6% (umbral estructural >= 5%)) |
| `11202` | Cisnes | 480 | 184,3 | -295,7 | -61,6% | SI (Variación de -61,6% (umbral estructural >= 5%)) |
| `11301` | Cochrane | 890 | 512,4 | -377,6 | -42,4% | SI (Variación de -42,4% (umbral estructural >= 5%)) |
| `11302` | O'Higgins | 3.450 | 2.284,2 | -1.165,8 | -33,8% | SI (Variación de -33,8% (umbral estructural >= 5%)) |
| `11303` | Tortel | 2.680 | 3.485,4 | 805,4 | +30,1% | SI (Variación de +30,1% (umbral estructural >= 5%)) |
| `11401` | Chile Chico | 145 | 238,5 | 93,5 | +64,5% | SI (Variación de +64,5% (umbral estructural >= 5%)) |
| `11402` | Río Ibáñez | 460 | 382 | -78 | -17,0% | SI (Variación de -17,0% (umbral estructural >= 5%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 9 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
