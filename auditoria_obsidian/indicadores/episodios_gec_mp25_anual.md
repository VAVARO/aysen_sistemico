---
id: respaldo_indicador_episodios_gec_mp25_anual
title: "Respaldo de Indicador — Episodios Críticos MP2,5 (GEC) Anuales (episodios_gec_mp25_anual)"
type: respaldo_indicador
variable_clave: "episodios_gec_mp25_anual"
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

# Respaldo de Indicador: `episodios_gec_mp25_anual`

- **Nombre**: Episodios Críticos MP2,5 (GEC) Anuales
- **Hub / Nodo**: VII. Biodiversidad, Clima y Riesgos · Nodo #30
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: días/año
- **Fuente oficial**: Sistema de Información Nacional de Calidad del Aire (SINCA MMA) / Dirección General de Aguas (DGA MOP) (https://sinca.mma.gob.cl/)
- **Frecuencia / Modo**: Horario / Continuo · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 41 -> 97 (Variación de +136,6% (umbral operativo >= 20%)); Lago Verde: 2 -> N/D (Dato pasó a nulo); Cisnes: 4 -> N/D (Dato pasó a nulo); Guaitecas: 0 -> N/D (Dato pasó a nulo); Cochrane: 8 -> N/D (Dato pasó a nulo); O'Higgins: 1 -> N/D (Dato pasó a nulo); Tortel: 2 -> N/D (Dato pasó a nulo); Chile Chico: 5 -> N/D (Dato pasó a nulo); Río Ibáñez: 3 -> N/D (Dato pasó a nulo)

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 41 | 97 | 56 | +136,6% | SI (Variación de +136,6% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 2 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11201` | Aysén | 14 | 16 | 2 | +14,3% | NO |
| `11202` | Cisnes | 4 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11203` | Guaitecas | 0 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11301` | Cochrane | 8 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11302` | O'Higgins | 1 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11303` | Tortel | 2 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11401` | Chile Chico | 5 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |
| `11402` | Río Ibáñez | 3 | N/D | N/D | N/A (desde 0) | SI (Dato pasó a nulo) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
