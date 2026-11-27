---
id: respaldo_indicador_glaciares_dga_n
title: "Respaldo de Indicador — Número de Glaciares Inventariados DGA (glaciares_dga_n)"
type: respaldo_indicador
variable_clave: "glaciares_dga_n"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "biodiversidad"
hub_titulo: "VII. Biodiversidad, Clima y Riesgos"
nodo_id: 30
unidad: "glaciares"
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

# Respaldo de Indicador: `glaciares_dga_n`

- **Nombre**: Número de Glaciares Inventariados DGA
- **Hub / Nodo**: VII. Biodiversidad, Clima y Riesgos · Nodo #30
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: glaciares
- **Fuente oficial**: Sistema de Información Nacional de Calidad del Aire (SINCA MMA) / Dirección General de Aguas (DGA MOP) (https://sinca.mma.gob.cl/)
- **Frecuencia / Modo**: Horario / Continuo · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 310 -> 121 (Variación de -61,0% (umbral operativo >= 20%)); Cisnes: 1.120 -> 785 (Variación de -29,9% (umbral operativo >= 20%)); Cochrane: 1.680 -> 1.310 (Variación de -22,0% (umbral operativo >= 20%)); O'Higgins: 2.240 -> 1.680 (Variación de -25,0% (umbral operativo >= 20%)); Tortel: 916 -> 2.140 (Variación de +133,6% (umbral operativo >= 20%)); Chile Chico: 410 -> 690 (Variación de +68,3% (umbral operativo >= 20%)); Río Ibáñez: 890 -> 1.120 (Variación de +25,8% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 310 | 121 | -189 | -61,0% | SI (Variación de -61,0% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 285 | 265 | -20 | -7,0% | NO |
| `11201` | Aysén | 2.450 | 2.190 | -260 | -10,6% | NO |
| `11202` | Cisnes | 1.120 | 785 | -335 | -29,9% | SI (Variación de -29,9% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 1.680 | 1.310 | -370 | -22,0% | SI (Variación de -22,0% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 2.240 | 1.680 | -560 | -25,0% | SI (Variación de -25,0% (umbral operativo >= 20%)) |
| `11303` | Tortel | 916 | 2.140 | 1.224 | +133,6% | SI (Variación de +133,6% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 410 | 690 | 280 | +68,3% | SI (Variación de +68,3% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 890 | 1.120 | 230 | +25,8% | SI (Variación de +25,8% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 9 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
