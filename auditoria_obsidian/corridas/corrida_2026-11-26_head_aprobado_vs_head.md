---
id: auditoria_corrida_2026-11-26_head_aprobado_vs_head
title: "Auditoría de Corrida — 2026-11-26 (HEAD_APROBADO vs HEAD)"
type: auditoria_corrida
fecha: "2026-11-26"
baseline: "HEAD_APROBADO"
actual: "HEAD"
semaforo: "ROJO"
total_indicadores: 239
modificados: 7
agregados: 4
eliminados: 1
sin_cambios: 228
alertas_alta: 10
alertas_media: 1
conectores_live_api: 5
conectores_fallback: 6
etapas_restauradas: 1
umbral_outlier_operativo_pct: 20
umbral_outlier_estructural_pct: 5
estado_revision_humana: "pendiente"
tags:
  - aysen-sistemico
  - auditoria-indicadores
  - semaforo-rojo
---

# Auditoría de Corrida de Indicadores — 2026-11-26

Comparación determinista: `HEAD_APROBADO` -> `HEAD` · Semáforo de revisión: **ROJO**.
Índice maestro: [[index_auditoria|Índice de Auditoría de Indicadores]].

## 1. Revisión Rápida (5 Minutos)

| Dimensión de Control | Resultado | Señal |
|---|---|---|
| Indicadores comunales evaluados | 239 actuales (236 en baseline) | 7 modificados · 4 agregados · 1 eliminados · 228 sin cambios |
| Umbrales de salto brusco | Estructural >= 5% · Operativo >= 20% | + transiciones 0/nulo y cambios de signo |
| Alertas para revisión humana | 11 (10 ALTA · 1 MEDIA) | Requiere cierre humano antes de merge a `main` si semáforo != VERDE |
| Salud de conectores automáticos | 5 live_api · 6 curated_fallback | 1 etapa(s) restaurada(s) · Última corrida API: `2026-11-02T12:13:30+00:00` |

### Checklist de Cierre Humano
- [ ] Revisar logs de GitHub Actions (`actualizacion_mensual.yml` / `verificacion.yml`) sin errores bloqueantes.
- [ ] Confirmar cobertura esperada de indicadores y conectores en `curated_fallback`.
- [ ] Validar cada outlier o variable nueva listada en la Sección 2 antes de aprobar el PR.
- [ ] Ejecutar `node scripts/obsidian_indicator_audit.cjs --approve-latest --sync-to-vault` para aprobar y fijar el nuevo baseline.

## 2. Qué Requiere Verificación Humana

- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/dependencia_fcm_pct|dependencia_fcm_pct]] (IV. Gobernanza y Finanzas): Coyhaique: 46,5 -> 58,4 (Variación de +25,6% (umbral operativo >= 20%)); Cisnes: 74,5 -> 48,7 (Variación de -34,6% (umbral operativo >= 20%)); Chile Chico: 71,2 -> 86,5 (Variación de +21,5% (umbral operativo >= 20%))
- [ ] **[ALTA · VARIABLE_ELIMINADA]** [[indicadores/ingresos_mun_bcn_2025_mclp|ingresos_mun_bcn_2025_mclp]] (IV. Gobernanza y Finanzas): La variable "ingresos_mun_bcn_2025_mclp" existía en el baseline y desapareció en la corrida actual. Verificar si fue renombrada o eliminada por error.
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/ipp_per_capita_clp|ipp_per_capita_clp]] (IV. Gobernanza y Finanzas): Coyhaique: 245.565 -> 148.232 (Variación de -39,6% (umbral operativo >= 20%)); Lago Verde: 339.692 -> 552.952 (Variación de +62,8% (umbral operativo >= 20%)); Aysén: 289.478 -> 194.770 (Variación de -32,7% (umbral operativo >= 20%)); Cisnes: 302.813 -> 580.062 (Variación de +91,6% (umbral operativo >= 20%)); Guaitecas: 351.067 -> 528.924 (Variación de +50,7% (umbral operativo >= 20%)); Cochrane: 308.606 -> 145.419 (Variación de -52,9% (umbral operativo >= 20%)); O'Higgins: 282.455 -> 182.859 (Variación de -35,3% (umbral operativo >= 20%)); Tortel: 292.277 -> 222.455 (Variación de -23,9% (umbral operativo >= 20%)); Chile Chico: 317.059 -> 135.441 (Variación de -57,3% (umbral operativo >= 20%)); Río Ibáñez: 295.922 -> 185.784 (Variación de -37,2% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/participacion_municipales_2024_pct|participacion_municipales_2024_pct]] (IV. Gobernanza y Finanzas): O'Higgins: 88 -> 67,9 (Variación de -22,8% (umbral operativo >= 20%)); Chile Chico: 83,6 -> 58,4 (Variación de -30,1% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/presupuesto_mclp|presupuesto_mclp]] (IV. Gobernanza y Finanzas): Lago Verde: 2.450,2 -> 3.321,1 (Variación de +35,5% (umbral operativo >= 20%)); Cisnes: 6.100 -> 7.985,3 (Variación de +30,9% (umbral operativo >= 20%)); Guaitecas: 3.300 -> 4.569,0 (Variación de +38,5% (umbral operativo >= 20%)); Cochrane: 4.600 -> 5.721,0 (Variación de +24,4% (umbral operativo >= 20%)); O'Higgins: 2.150 -> 5.323,8 (Variación de +147,6% (umbral operativo >= 20%)); Tortel: 2.050 -> 3.440,7 (Variación de +67,8% (umbral operativo >= 20%)); Río Ibáñez: 3.950 -> 6.252,9 (Variación de +58,3% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/presupuesto_per_capita_mclp|presupuesto_per_capita_mclp]] (IV. Gobernanza y Finanzas): Lago Verde: 3.145,3 -> 4.263,2 (Variación de +35,5% (umbral operativo >= 20%)); Cisnes: 1.187,5 -> 1.554,5 (Variación de +30,9% (umbral operativo >= 20%)); Guaitecas: 2.065,1 -> 2.859,2 (Variación de +38,5% (umbral operativo >= 20%)); Cochrane: 1.330,2 -> 1.654,4 (Variación de +24,4% (umbral operativo >= 20%)); O'Higgins: 3.323 -> 8.228,4 (Variación de +147,6% (umbral operativo >= 20%)); Tortel: 4.059,4 -> 6.813,3 (Variación de +67,8% (umbral operativo >= 20%)); Río Ibáñez: 1.450,6 -> 2.296,3 (Variación de +58,3% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/royalty_fet_peso_presupuesto_pct|royalty_fet_peso_presupuesto_pct]] (IV. Gobernanza y Finanzas): Lago Verde: 11,6 -> 8,50 (Variación de -26,7% (umbral operativo >= 20%)); Cisnes: 5,10 -> 3,90 (Variación de -23,5% (umbral operativo >= 20%)); Guaitecas: 8,60 -> 6,20 (Variación de -27,9% (umbral operativo >= 20%)); Cochrane: 6,50 -> 5,20 (Variación de -20,0% (umbral operativo >= 20%)); O'Higgins: 13 -> 5,30 (Variación de -59,2% (umbral operativo >= 20%)); Tortel: 13,6 -> 8,10 (Variación de -40,4% (umbral operativo >= 20%)); Río Ibáñez: 7,60 -> 4,80 (Variación de -36,8% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `serie_fndr_asignado_vs_ejecutado_2015_2025__asignado_mclp` (Series Anuales (Último Corte)): 2025: 77.977 -> N/D (Dato pasó a nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `serie_fndr_asignado_vs_ejecutado_2015_2025__asignado_mclp` (Series Anuales (Último Corte)): 2026: N/D -> 81.812 (Aparición de dato antes nulo)
- [ ] **[ALTA · ETAPA_RESTAURADA]** `pipeline_ingesta` (Infraestructura / Ingesta): 1 etapa(s) fueron restauradas por Circuit Breaker (Last-Known-Good) en la última corrida automática (2026-11-02T12:13:30+00:00).
- [ ] **[MEDIA · CONECTOR_FALLBACK]** `pipeline_ingesta` (Infraestructura / Ingesta): 6 conector(es) operaron en curated_fallback: cne_combustibles, cne_energia, subpesca, bbnn, conaf, sinca. Los datos previos se conservaron, pero conviene verificar si hubo actualización oficial pendiente.

## 3. Qué Cambió en esta Corrida (Indicadores Comunales)

### 3.1 Indicadores Modificados (7)

| Indicador | Hub / Nodo | Nivel Umbral | Comuna | Anterior | Actual | Delta | Delta % | Outlier | Respaldo |
|---|---|---|---|---|---|---|---|---|---|
| `dependencia_fcm_pct` | IV. Gobernanza y Finanzas (Nodo #16) | operativo (20%) | Coyhaique | 46,5 | 58,4 | 11,9 | +25,6% | SI | [[indicadores/dependencia_fcm_pct|Ficha]] |
| `dependencia_fcm_pct` | IV. Gobernanza y Finanzas (Nodo #16) | operativo (20%) | Lago Verde | 89,2 | 83,9 | -5,30 | -5,9% | NO | [[indicadores/dependencia_fcm_pct|Ficha]] |
| `dependencia_fcm_pct` | IV. Gobernanza y Finanzas (Nodo #16) | operativo (20%) | Aysén | 52,8 | 61,1 | 8,30 | +15,7% | NO | [[indicadores/dependencia_fcm_pct|Ficha]] |
| `dependencia_fcm_pct` | IV. Gobernanza y Finanzas (Nodo #16) | operativo (20%) | Cisnes | 74,5 | 48,7 | -25,8 | -34,6% | SI | [[indicadores/dependencia_fcm_pct|Ficha]] |
| `dependencia_fcm_pct` | IV. Gobernanza y Finanzas (Nodo #16) | operativo (20%) | Guaitecas | 83 | 73,1 | -9,90 | -11,9% | NO | [[indicadores/dependencia_fcm_pct|Ficha]] |
| `dependencia_fcm_pct` | IV. Gobernanza y Finanzas (Nodo #16) | operativo (20%) | Cochrane | 76,8 | 85,7 | 8,90 | +11,6% | NO | [[indicadores/dependencia_fcm_pct|Ficha]] |
| `dependencia_fcm_pct` | IV. Gobernanza y Finanzas (Nodo #16) | operativo (20%) | O'Higgins | 91,5 | 95,3 | 3,80 | +4,2% | NO | [[indicadores/dependencia_fcm_pct|Ficha]] |
| `dependencia_fcm_pct` | IV. Gobernanza y Finanzas (Nodo #16) | operativo (20%) | Tortel | 92,8 | 95,4 | 2,60 | +2,8% | NO | [[indicadores/dependencia_fcm_pct|Ficha]] |
| `dependencia_fcm_pct` | IV. Gobernanza y Finanzas (Nodo #16) | operativo (20%) | Chile Chico | 71,2 | 86,5 | 15,3 | +21,5% | SI | [[indicadores/dependencia_fcm_pct|Ficha]] |
| `dependencia_fcm_pct` | IV. Gobernanza y Finanzas (Nodo #16) | operativo (20%) | Río Ibáñez | 79,6 | 86,6 | 7 | +8,8% | NO | [[indicadores/dependencia_fcm_pct|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Coyhaique | 245.565 | 148.232 | -97.333 | -39,6% | SI | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Lago Verde | 339.692 | 552.952 | 213.260 | +62,8% | SI | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Aysén | 289.478 | 194.770 | -94.708 | -32,7% | SI | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cisnes | 302.813 | 580.062 | 277.249 | +91,6% | SI | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Guaitecas | 351.067 | 528.924 | 177.857 | +50,7% | SI | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cochrane | 308.606 | 145.419 | -163.187 | -52,9% | SI | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | O'Higgins | 282.455 | 182.859 | -99.596 | -35,3% | SI | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Tortel | 292.277 | 222.455 | -69.822 | -23,9% | SI | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Chile Chico | 317.059 | 135.441 | -181.618 | -57,3% | SI | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Río Ibáñez | 295.922 | 185.784 | -110.138 | -37,2% | SI | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `participacion_municipales_2024_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Coyhaique | 84,2 | 72,8 | -11,4 | -13,5% | NO | [[indicadores/participacion_municipales_2024_pct|Ficha]] |
| `participacion_municipales_2024_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Lago Verde | 87,5 | 80,5 | -7 | -8,0% | NO | [[indicadores/participacion_municipales_2024_pct|Ficha]] |
| `participacion_municipales_2024_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Aysén | 82,8 | 75,1 | -7,70 | -9,3% | NO | [[indicadores/participacion_municipales_2024_pct|Ficha]] |
| `participacion_municipales_2024_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Cisnes | 83,1 | 77,9 | -5,20 | -6,3% | NO | [[indicadores/participacion_municipales_2024_pct|Ficha]] |
| `participacion_municipales_2024_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Guaitecas | 85,9 | 74,1 | -11,8 | -13,7% | NO | [[indicadores/participacion_municipales_2024_pct|Ficha]] |
| `participacion_municipales_2024_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Cochrane | 85,2 | 70,2 | -15 | -17,6% | NO | [[indicadores/participacion_municipales_2024_pct|Ficha]] |
| `participacion_municipales_2024_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | O'Higgins | 88 | 67,9 | -20,1 | -22,8% | SI | [[indicadores/participacion_municipales_2024_pct|Ficha]] |
| `participacion_municipales_2024_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Tortel | 87,3 | 80,6 | -6,70 | -7,7% | NO | [[indicadores/participacion_municipales_2024_pct|Ficha]] |
| `participacion_municipales_2024_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Chile Chico | 83,6 | 58,4 | -25,2 | -30,1% | SI | [[indicadores/participacion_municipales_2024_pct|Ficha]] |
| `participacion_municipales_2024_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Río Ibáñez | 86,4 | 77,2 | -9,20 | -10,6% | NO | [[indicadores/participacion_municipales_2024_pct|Ficha]] |
| `partido_alcalde` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Coyhaique | Partido Democrata Cristiano (DC) / Contigo Chile Mejor | Partido Demócrata Cristiano (DC) / Contigo Chile Mejor | N/D | N/A (desde 0) | NO | [[indicadores/partido_alcalde|Ficha]] |
| `partido_alcalde` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Lago Verde | Independiente / Contigo Chile Mejor | Independiente (cupo PPD) / Contigo Chile Mejor | N/D | N/A (desde 0) | NO | [[indicadores/partido_alcalde|Ficha]] |
| `partido_alcalde` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Aysén | Union Democrata Independiente (UDI) / Chile Vamos | Unión Demócrata Independiente (UDI) / Chile Vamos | N/D | N/A (desde 0) | NO | [[indicadores/partido_alcalde|Ficha]] |
| `partido_alcalde` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Cisnes | Renovacion Nacional (RN) / Chile Vamos | Renovación Nacional (RN) / Chile Vamos | N/D | N/A (desde 0) | NO | [[indicadores/partido_alcalde|Ficha]] |
| `partido_alcalde` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Guaitecas | Evolucion Politica (Evopoli) / Chile Vamos | Evolución Política (Evópoli) / Chile Vamos | N/D | N/A (desde 0) | NO | [[indicadores/partido_alcalde|Ficha]] |
| `partido_alcalde` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Cochrane | Independiente / Chile Vamos | Unión Demócrata Independiente (UDI) / Chile Vamos | N/D | N/A (desde 0) | NO | [[indicadores/partido_alcalde|Ficha]] |
| `partido_alcalde` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | O'Higgins | Partido Democrata Cristiano (DC) / Contigo Chile Mejor | Partido Demócrata Cristiano (DC) / Contigo Chile Mejor | N/D | N/A (desde 0) | NO | [[indicadores/partido_alcalde|Ficha]] |
| `partido_alcalde` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Tortel | Independiente | Independiente (Fuera de pacto) | N/D | N/A (desde 0) | NO | [[indicadores/partido_alcalde|Ficha]] |
| `partido_alcalde` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Chile Chico | Independiente | Independiente (Fuera de pacto) | N/D | N/A (desde 0) | NO | [[indicadores/partido_alcalde|Ficha]] |
| `partido_alcalde` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Río Ibáñez | Union Democrata Independiente (UDI) / Chile Vamos | Unión Demócrata Independiente (UDI) / Chile Vamos | N/D | N/A (desde 0) | NO | [[indicadores/partido_alcalde|Ficha]] |
| `presupuesto_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Coyhaique | 26.540,8 | 27.611 | 1.070,2 | +4,0% | NO | [[indicadores/presupuesto_mclp|Ficha]] |
| `presupuesto_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Lago Verde | 2.450,2 | 3.321,1 | 870,9 | +35,5% | SI | [[indicadores/presupuesto_mclp|Ficha]] |
| `presupuesto_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Aysén | 14.210,5 | 14.614,3 | 403,8 | +2,8% | NO | [[indicadores/presupuesto_mclp|Ficha]] |
| `presupuesto_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cisnes | 6.100 | 7.985,3 | 1.885,3 | +30,9% | SI | [[indicadores/presupuesto_mclp|Ficha]] |
| `presupuesto_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Guaitecas | 3.300 | 4.569,0 | 1.269,0 | +38,5% | SI | [[indicadores/presupuesto_mclp|Ficha]] |
| `presupuesto_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cochrane | 4.600 | 5.721,0 | 1.121,0 | +24,4% | SI | [[indicadores/presupuesto_mclp|Ficha]] |
| `presupuesto_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | O'Higgins | 2.150 | 5.323,8 | 3.173,8 | +147,6% | SI | [[indicadores/presupuesto_mclp|Ficha]] |
| `presupuesto_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Tortel | 2.050 | 3.440,7 | 1.390,7 | +67,8% | SI | [[indicadores/presupuesto_mclp|Ficha]] |
| `presupuesto_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Chile Chico | 5.400 | 5.981,7 | 581,7 | +10,8% | NO | [[indicadores/presupuesto_mclp|Ficha]] |
| `presupuesto_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Río Ibáñez | 3.950 | 6.252,9 | 2.302,9 | +58,3% | SI | [[indicadores/presupuesto_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Coyhaique | 459 | 477,5 | 18,5 | +4,0% | NO | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Lago Verde | 3.145,3 | 4.263,2 | 1.117,9 | +35,5% | SI | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Aysén | 613,3 | 630,7 | 17,4 | +2,8% | NO | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cisnes | 1.187,5 | 1.554,5 | 367 | +30,9% | SI | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Guaitecas | 2.065,1 | 2.859,2 | 794,1 | +38,5% | SI | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cochrane | 1.330,2 | 1.654,4 | 324,2 | +24,4% | SI | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | O'Higgins | 3.323 | 8.228,4 | 4.905,4 | +147,6% | SI | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Tortel | 4.059,4 | 6.813,3 | 2.753,9 | +67,8% | SI | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Chile Chico | 1.100,9 | 1.219,5 | 118,6 | +10,8% | NO | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Río Ibáñez | 1.450,6 | 2.296,3 | 845,7 | +58,3% | SI | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `royalty_fet_peso_presupuesto_pct` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Coyhaique | 1,80 | 1,70 | -0,10 | -5,6% | NO | [[indicadores/royalty_fet_peso_presupuesto_pct|Ficha]] |
| `royalty_fet_peso_presupuesto_pct` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Lago Verde | 11,6 | 8,50 | -3,10 | -26,7% | SI | [[indicadores/royalty_fet_peso_presupuesto_pct|Ficha]] |
| `royalty_fet_peso_presupuesto_pct` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Aysén | 2,80 | 2,70 | -0,10 | -3,6% | NO | [[indicadores/royalty_fet_peso_presupuesto_pct|Ficha]] |
| `royalty_fet_peso_presupuesto_pct` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cisnes | 5,10 | 3,90 | -1,20 | -23,5% | SI | [[indicadores/royalty_fet_peso_presupuesto_pct|Ficha]] |
| `royalty_fet_peso_presupuesto_pct` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Guaitecas | 8,60 | 6,20 | -2,40 | -27,9% | SI | [[indicadores/royalty_fet_peso_presupuesto_pct|Ficha]] |
| `royalty_fet_peso_presupuesto_pct` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cochrane | 6,50 | 5,20 | -1,30 | -20,0% | SI | [[indicadores/royalty_fet_peso_presupuesto_pct|Ficha]] |
| `royalty_fet_peso_presupuesto_pct` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | O'Higgins | 13 | 5,30 | -7,70 | -59,2% | SI | [[indicadores/royalty_fet_peso_presupuesto_pct|Ficha]] |
| `royalty_fet_peso_presupuesto_pct` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Tortel | 13,6 | 8,10 | -5,50 | -40,4% | SI | [[indicadores/royalty_fet_peso_presupuesto_pct|Ficha]] |
| `royalty_fet_peso_presupuesto_pct` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Chile Chico | 5,60 | 5,10 | -0,50 | -8,9% | NO | [[indicadores/royalty_fet_peso_presupuesto_pct|Ficha]] |
| `royalty_fet_peso_presupuesto_pct` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Río Ibáñez | 7,60 | 4,80 | -2,80 | -36,8% | SI | [[indicadores/royalty_fet_peso_presupuesto_pct|Ficha]] |

### 3.2 Indicadores Agregados (4)

| Indicador | Tipo | Hub | Comunas con valor != 0 | En léxico oficial | Respaldo |
|---|---|---|---|---|---|
| `fcm_bcn_2025_mclp` | numeric | IV. Gobernanza y Finanzas | 10 / 10 | SI | [[indicadores/fcm_bcn_2025_mclp|Ficha]] |
| `gastos_corrientes_bcn_pct` | numeric | IV. Gobernanza y Finanzas | 10 / 10 | SI | [[indicadores/gastos_corrientes_bcn_pct|Ficha]] |
| `ipp_bcn_2025_mclp` | numeric | IV. Gobernanza y Finanzas | 10 / 10 | SI | [[indicadores/ipp_bcn_2025_mclp|Ficha]] |
| `participacion_fcm_ingreso_total_pct` | numeric | IV. Gobernanza y Finanzas | 10 / 10 | SI | [[indicadores/participacion_fcm_ingreso_total_pct|Ficha]] |

### 3.3 Indicadores Eliminados (1)

| Indicador | Tipo | Hub | Acción requerida | Respaldo |
|---|---|---|---|---|
| `ingresos_mun_bcn_2025_mclp` | numeric | IV. Gobernanza y Finanzas | Confirmar si fue renombrado o eliminado por error | [[indicadores/ingresos_mun_bcn_2025_mclp|Ficha]] |

## 4. Qué Quedó Igual (Resumen por 10 Hubs Canónicos)

**228 indicadores comunales** mantuvieron valores idénticos en las 10 comunas de Aysén. No se generan fichas individuales vacías para evitar ruido en el grafo de Obsidian.

| Hub Canónico | Indicadores sin cambios |
|---|---|
| I. Turismo y Áreas Silvestres | 31 |
| II. Pesca, Acuicultura y Mar | 23 |
| III. Energía y Telecomunicaciones | 28 |
| IV. Gobernanza y Finanzas | 34 |
| IX. Cultura y Patrimonio | 15 |
| V. Economía, Inversión y Suelo | 18 |
| VI. Demografía, Educación y Sociedad | 31 |
| VII. Biodiversidad, Clima y Riesgos | 15 |
| VIII. Salud | 19 |
| X. CTCi e Innovación | 14 |

## 5. Cobertura Extendida (Barrios ACS, Holdings, Padrón SUBPESCA y Series Anuales)

| Ámbito Estructural | Series/Métricas Actuales | Modificadas | Agregadas | Eliminadas | Sin cambios |
|---|---|---|---|---|---|
| Barrios ACS (N=18) | 8 | 0 | 0 | 0 | 8 |
| Unidades SNASPE (N=19) | 6 | 0 | 0 | 0 | 6 |
| Holdings Salmoneros (N=13) | 7 | 0 | 0 | 0 | 7 |
| Invariantes Padrón SUBPESCA | 5 | 0 | 0 | 0 | 5 |
| Series Anuales (Último Corte) | 65 | 1 | 1 | 0 | 63 |
| Centrales Eléctricas CNE (MW) | 1 | 0 | 0 | 0 | 1 |

### Cambios Detectados en Ámbitos Extendidos

| Ámbito | Métrica | Entidad / Periodo | Estado | Anterior | Actual | Outlier |
|---|---|---|---|---|---|---|
| Series Anuales (Último Corte) | `serie_fndr_asignado_vs_ejecutado_2015_2025__asignado_mclp` | 2025 | modificada | 77.977 | N/D | SI |
| Series Anuales (Último Corte) | `serie_fndr_asignado_vs_ejecutado_2015_2025__asignado_mclp` | 2026 | modificada | N/D | 81.812 | SI |
| Series Anuales (Último Corte) | `serie_fndr_asignado_vs_ejecutado_2015_2025__marco_ajustado_mclp` | múltiples | agregada | N/D | 1 registros | NO |

## 6. Detalle de Conectores en `curated_fallback`

| Conector | Modo | HTTP | Nodos | Motivo registrado |
|---|---|---|---|---|
| `cne_combustibles` | `curated_fallback` | N/A | #13 | CKAN package_search no respondio 200 (URLError: <urlopen error [Errno -2] Name or service not known>) |
| `cne_energia` | `curated_fallback` | N/A | #11 | CKAN package_search no respondio 200 (URLError: <urlopen error [Errno -2] Name or service not known>) |
| `subpesca` | `curated_fallback` | 404 | #6 | 2 candidato(s) fallaron: sin respuesta / 404 |
| `bbnn` | `curated_fallback` | N/A | #22 | 2 candidato(s) fallaron: sin respuesta / sin respuesta |
| `conaf` | `curated_fallback` | N/A | #27 | 2 candidato(s) fallaron: 404 / sin respuesta |
| `sinca` | `curated_fallback` | 403 | #30 | SINCA no respondio 200 (HTTP 403 Forbidden) |

