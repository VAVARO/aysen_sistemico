---
id: respaldo_indicador_dias_sobre_norma_mp25
title: "Respaldo de Indicador — Días Sobre Norma MP2.5 Calidad del Aire (dias_sobre_norma_mp25)"
type: respaldo_indicador
variable_clave: "dias_sobre_norma_mp25"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "biodiversidad"
hub_titulo: "VII. Biodiversidad, Clima y Riesgos"
nodo_id: 30
unidad: "días/año"
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

# Respaldo de Indicador: `dias_sobre_norma_mp25`

- **Nombre**: Días Sobre Norma MP2.5 Calidad del Aire
- **Hub / Nodo**: VII. Biodiversidad, Clima y Riesgos · Nodo #30
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: días/año
- **Fuente oficial**: Sistema de Información Nacional de Calidad del Aire (SINCA MMA) / Dirección General de Aguas (DGA MOP) (https://sinca.mma.gob.cl/)
- **Frecuencia / Modo**: Horario / Continuo · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 12 -> N/D (Dato pasó a nulo); Aysén: 34 -> 16 (Variación de -52,9% (umbral operativo >= 20%)); Cisnes: 16 -> N/D (Dato pasó a nulo); Guaitecas: 4 -> N/D (Dato pasó a nulo); Cochrane: 22 -> N/D (Dato pasó a nulo); O'Higgins: 8 -> N/D (Dato pasó a nulo); Tortel: 10 -> N/D (Dato pasó a nulo); Chile Chico: 18 -> N/D (Dato pasó a nulo); Río Ibáñez: 14 -> N/D (Dato pasó a nulo)

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11102` | Lago Verde | 12 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11201` | Aysén | 34 | 16 | -18 | -52,9% | SI (Variación de -52,9% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 16 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11203` | Guaitecas | 4 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11301` | Cochrane | 22 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11302` | O'Higgins | 8 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11303` | Tortel | 10 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11401` | Chile Chico | 18 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11402` | Río Ibáñez | 14 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 9 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
