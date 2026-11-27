---
id: auditoria_corrida_2026-11-27_head_aprobado_vs_head
title: "Auditoría de Corrida — 2026-11-27 (HEAD_APROBADO vs HEAD)"
type: auditoria_corrida
fecha: "2026-11-27"
baseline: "HEAD_APROBADO"
actual: "HEAD"
semaforo: "ROJO"
total_indicadores: 248
modificados: 28
agregados: 7
eliminados: 1
sin_cambios: 213
alertas_alta: 23
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

# Auditoría de Corrida de Indicadores — 2026-11-27

Comparación determinista: `HEAD_APROBADO` -> `HEAD` · Semáforo de revisión: **ROJO**.
Índice maestro: [[index_auditoria|Índice de Auditoría de Indicadores]].

## 1. Revisión Rápida (5 Minutos)

| Dimensión de Control | Resultado | Señal |
|---|---|---|
| Indicadores comunales evaluados | 248 actuales (242 en baseline) | 28 modificados · 7 agregados · 1 eliminados · 213 sin cambios |
| Umbrales de salto brusco | Estructural >= 5% · Operativo >= 20% | + transiciones 0/nulo y cambios de signo |
| Alertas para revisión humana | 24 (23 ALTA · 1 MEDIA) | Requiere cierre humano antes de merge a `main` si semáforo != VERDE |
| Salud de conectores automáticos | 5 live_api · 6 curated_fallback | 1 etapa(s) restaurada(s) · Última corrida API: `2026-11-02T12:13:30+00:00` |

### Checklist de Cierre Humano
- [ ] Revisar logs de GitHub Actions (`actualizacion_mensual.yml` / `verificacion.yml`) sin errores bloqueantes.
- [ ] Confirmar cobertura esperada de indicadores y conectores en `curated_fallback`.
- [ ] Validar cada outlier o variable nueva listada en la Sección 2 antes de aprobar el PR.
- [ ] Ejecutar `node scripts/obsidian_indicator_audit.cjs --approve-latest --sync-to-vault` para aprobar y fijar el nuevo baseline.

## 2. Qué Requiere Verificación Humana

- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/cobertura_ssr_apr_familias|cobertura_ssr_apr_familias]] (VI. Demografía, Educación y Sociedad): Coyhaique: 10.500 -> 3.350 (Variación de -68,1% (umbral operativo >= 20%)); Lago Verde: 620 -> 210 (Variación de -66,1% (umbral operativo >= 20%)); Aysén: 5.500 -> 1.790 (Variación de -67,5% (umbral operativo >= 20%)); Cisnes: 3.100 -> 1.050 (Variación de -66,1% (umbral operativo >= 20%)); Guaitecas: 1.420 -> 551 (Variación de -61,2% (umbral operativo >= 20%)); Cochrane: 1.450 -> 450 (Variación de -69,0% (umbral operativo >= 20%)); O'Higgins: 610 -> 174 (Variación de -71,5% (umbral operativo >= 20%)); Tortel: 480 -> 150 (Variación de -68,8% (umbral operativo >= 20%)); Chile Chico: 2.350 -> 780 (Variación de -66,8% (umbral operativo >= 20%)); Río Ibáñez: 2.050 -> 680 (Variación de -66,8% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/deficit_habitacional_cualitativo_n|deficit_habitacional_cualitativo_n]] (VI. Demografía, Educación y Sociedad): Coyhaique: 6.280 -> 2.893 (Variación de -53,9% (umbral operativo >= 20%)); Lago Verde: 300 -> 48 (Variación de -84,0% (umbral operativo >= 20%)); Aysén: 3.260 -> 1.168 (Variación de -64,2% (umbral operativo >= 20%)); Cisnes: 1.280 -> 281 (Variación de -78,0% (umbral operativo >= 20%)); Guaitecas: 680 -> 78 (Variación de -88,5% (umbral operativo >= 20%)); Cochrane: 810 -> 189 (Variación de -76,7% (umbral operativo >= 20%)); O'Higgins: 255 -> 38 (Variación de -85,1% (umbral operativo >= 20%)); Tortel: 375 -> 30 (Variación de -92,0% (umbral operativo >= 20%)); Chile Chico: 990 -> 272 (Variación de -72,5% (umbral operativo >= 20%)); Río Ibáñez: 770 -> 158 (Variación de -79,5% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/deficit_habitacional_cuantitativo_n|deficit_habitacional_cuantitativo_n]] (VI. Demografía, Educación y Sociedad): Coyhaique: 1.742 -> 1.128 (Variación de -35,2% (umbral operativo >= 20%)); Lago Verde: 32 -> 73 (Variación de +128,1% (umbral operativo >= 20%)); Aysén: 719 -> 330 (Variación de -54,1% (umbral operativo >= 20%)); Cisnes: 174 -> 109 (Variación de -37,4% (umbral operativo >= 20%)); Guaitecas: 89 -> 14 (Variación de -84,3% (umbral operativo >= 20%)); O'Higgins: 26 -> 4 (Variación de -84,6% (umbral operativo >= 20%)); Tortel: 39 -> 15 (Variación de -61,5% (umbral operativo >= 20%)); Chile Chico: 134 -> 86 (Variación de -35,8% (umbral operativo >= 20%)); Río Ibáñez: 81 -> 50 (Variación de -38,3% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/deficit_habitacional_total_por_1000_hab|deficit_habitacional_total_por_1000_hab]] (VI. Demografía, Educación y Sociedad): Coyhaique: 30,1 -> 19,5 (Variación de -35,2% (umbral operativo >= 20%)); Lago Verde: 41,1 -> 82,8 (Variación de +101,5% (umbral operativo >= 20%)); Aysén: 31 -> 14,2 (Variación de -54,2% (umbral operativo >= 20%)); Cisnes: 33,9 -> 20,4 (Variación de -39,8% (umbral operativo >= 20%)); Guaitecas: 55,7 -> 8,80 (Variación de -84,2% (umbral operativo >= 20%)); O'Higgins: 40,2 -> 6 (Variación de -85,1% (umbral operativo >= 20%)); Tortel: 77,2 -> 26,6 (Variación de -65,5% (umbral operativo >= 20%)); Chile Chico: 27,3 -> 17,4 (Variación de -36,3% (umbral operativo >= 20%)); Río Ibáñez: 29,7 -> 18,7 (Variación de -37,0% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/escuelas_rurales_multigrado_n|escuelas_rurales_multigrado_n]] (VI. Demografía, Educación y Sociedad): Tortel: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/establecimientos_educacion_conectados_n|establecimientos_educacion_conectados_n]] (III. Energía y Telecomunicaciones): Cochrane: 4 -> 2 (Variación de -50,0% (umbral estructural >= 5%)); O'Higgins: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%)); Tortel: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/establecimientos_escolares_n|establecimientos_escolares_n]] (VI. Demografía, Educación y Sociedad): Coyhaique: 33 -> 40 (Variación de +21,2% (umbral estructural >= 5%)); Lago Verde: 4 -> 3 (Variación de -25,0% (umbral estructural >= 5%)); Aysén: 18 -> 19 (Variación de +5,6% (umbral estructural >= 5%)); Cisnes: 9 -> 8 (Variación de -11,1% (umbral estructural >= 5%)); Cochrane: 4 -> 2 (Variación de -50,0% (umbral estructural >= 5%)); O'Higgins: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%)); Tortel: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/establecimientos_slep_aysen|establecimientos_slep_aysen]] (VI. Demografía, Educación y Sociedad): Coyhaique: 22 -> 17 (Variación de -22,7% (umbral estructural >= 5%)); Lago Verde: 4 -> 3 (Variación de -25,0% (umbral estructural >= 5%)); Cisnes: 8 -> 7 (Variación de -12,5% (umbral estructural >= 5%)); Cochrane: 4 -> 2 (Variación de -50,0% (umbral estructural >= 5%)); O'Higgins: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%)); Tortel: 2 -> 1 (Variación de -50,0% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/indice_envejecimiento|indice_envejecimiento]] (VI. Demografía, Educación y Sociedad): Lago Verde: 78,5 -> 182,8 (Variación de +132,9% (umbral operativo >= 20%)); O'Higgins: 74 -> 41,7 (Variación de -43,6% (umbral operativo >= 20%)); Tortel: 71,5 -> 30,8 (Variación de -56,9% (umbral operativo >= 20%)); Chile Chico: 72,4 -> 92,9 (Variación de +28,3% (umbral operativo >= 20%)); Río Ibáñez: 79,1 -> 121,2 (Variación de +53,2% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/liceos_urbanos_n|liceos_urbanos_n]] (VI. Demografía, Educación y Sociedad): Tortel: 1 -> 0 (Caída a 0 desde 1)
- [ ] **[ALTA · VARIABLE_ELIMINADA]** [[indicadores/matricula_ed_superior_sies|matricula_ed_superior_sies]] (X. CTCi e Innovación): La variable "matricula_ed_superior_sies" existía en el baseline y desapareció en la corrida actual. Verificar si fue renombrada o eliminada por error.
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/matricula_escolar|matricula_escolar]] (VI. Demografía, Educación y Sociedad): Lago Verde: 95 -> 54 (Variación de -43,2% (umbral operativo >= 20%)); Río Ibáñez: 450 -> 353 (Variación de -21,6% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/poblacion_censo_2024|poblacion_censo_2024]] (VI. Demografía, Educación y Sociedad): Lago Verde: 779 -> 882 (Variación de +13,2% (umbral estructural >= 5%)); Tortel: 505 -> 563 (Variación de +11,5% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/pobreza_multidim_pct|pobreza_multidim_pct]] (VI. Demografía, Educación y Sociedad): Lago Verde: 24,5 -> 18 (Variación de -26,5% (umbral operativo >= 20%)); Cisnes: 18,6 -> 12,3 (Variación de -33,9% (umbral operativo >= 20%)); O'Higgins: 22,8 -> 12,1 (Variación de -46,9% (umbral operativo >= 20%)); Tortel: 26,2 -> 12,3 (Variación de -53,1% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/ratio_pobreza_multidim_vs_ingresos|ratio_pobreza_multidim_vs_ingresos]] (VI. Demografía, Educación y Sociedad): Lago Verde: 27,2 -> 20 (Variación de -26,5% (umbral operativo >= 20%)); Cisnes: 3,70 -> 2,50 (Variación de -32,4% (umbral operativo >= 20%)); Guaitecas: 4,50 -> 3,60 (Variación de -20,0% (umbral operativo >= 20%)); O'Higgins: 2,50 -> 1,30 (Variación de -48,0% (umbral operativo >= 20%)); Tortel: 5,70 -> 2,70 (Variación de -52,6% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/sistemas_ssr_apr_n|sistemas_ssr_apr_n]] (VI. Demografía, Educación y Sociedad): Coyhaique: 12 -> 15 (Variación de +25,0% (umbral operativo >= 20%)); Lago Verde: 3 -> 2 (Variación de -33,3% (umbral operativo >= 20%)); Guaitecas: 2 -> 1 (Variación de -50,0% (umbral operativo >= 20%)); Cochrane: 4 -> 3 (Variación de -25,0% (umbral operativo >= 20%)); Tortel: 2 -> 1 (Variación de -50,0% (umbral operativo >= 20%)); Chile Chico: 4 -> 5 (Variación de +25,0% (umbral operativo >= 20%)); Río Ibáñez: 4 -> 5 (Variación de +25,0% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/tasa_dmcs_100k|tasa_dmcs_100k]] (VI. Demografía, Educación y Sociedad): Coyhaique: 2.150,4 -> 1.702 (Variación de -20,9% (umbral operativo >= 20%)); Lago Verde: 420 -> 1.422,3 (Variación de +238,6% (umbral operativo >= 20%)); Aysén: 1.980,2 -> 1.197,6 (Variación de -39,5% (umbral operativo >= 20%)); Cisnes: 1.120 -> 1.754,1 (Variación de +56,6% (umbral operativo >= 20%)); Guaitecas: 890 -> 1.862,2 (Variación de +109,2% (umbral operativo >= 20%)); Cochrane: 1.280 -> 748,5 (Variación de -41,5% (umbral operativo >= 20%)); O'Higgins: 650 -> 1.481,5 (Variación de +127,9% (umbral operativo >= 20%)); Tortel: 510 -> 1.202,7 (Variación de +135,8% (umbral operativo >= 20%)); Chile Chico: 1.340 -> 1.743,2 (Variación de +30,1% (umbral operativo >= 20%)); Río Ibáñez: 910 -> 1.695,5 (Variación de +86,3% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/tasa_vif_100k|tasa_vif_100k]] (VI. Demografía, Educación y Sociedad): Coyhaique: 940,8 -> 730,1 (Variación de -22,4% (umbral operativo >= 20%)); Lago Verde: 385 -> 548,2 (Variación de +42,4% (umbral operativo >= 20%)); Cisnes: 620 -> 749,3 (Variación de +20,9% (umbral operativo >= 20%)); O'Higgins: 410 -> 740,7 (Variación de +80,7% (umbral operativo >= 20%)); Tortel: 390 -> 687,3 (Variación de +76,2% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/ventas_sii_domicilio_local_muf|ventas_sii_domicilio_local_muf]] (V. Economía, Inversión y Suelo): Guaitecas: 240 -> 380 (Variación de +58,3% (umbral operativo >= 20%)); Cochrane: 790 -> 620 (Variación de -21,5% (umbral operativo >= 20%)); O'Higgins: 75 -> 170 (Variación de +126,7% (umbral operativo >= 20%)); Tortel: 85 -> 150 (Variación de +76,5% (umbral operativo >= 20%)); Río Ibáñez: 540 -> 410 (Variación de -24,1% (umbral operativo >= 20%))
- [ ] **[ALTA · ETAPA_RESTAURADA]** `pipeline_ingesta` (Infraestructura / Ingesta): 1 etapa(s) fueron restauradas por Circuit Breaker (Last-Known-Good) en la última corrida automática (2026-11-02T12:13:30+00:00).
- [ ] **[MEDIA · CONECTOR_FALLBACK]** `pipeline_ingesta` (Infraestructura / Ingesta): 6 conector(es) operaron en curated_fallback: cne_combustibles, cne_energia, subpesca, bbnn, conaf, sinca. Los datos previos se conservaron, pero conviene verificar si hubo actualización oficial pendiente.
- [ ] **[ALTA · COLINEALIDAD_ESPURIA_ACTIVA]** `hogares_censo_2024 ~ deficit_habitacional_cualitativo_n` (Transversal (Calidad Estadística)): [INVARIANTE_CERO_COLINEALIDAD_ACTIVA] Par activo colineal detectado sin etiqueta isAliasOf/isComplementOf: hogares_censo_2024 vs deficit_habitacional_cualitativo_n (r = 1.000000).
- [ ] **[ALTA · ERROR_CENSO_2024_HOGARES_VIVIENDAS_IAM]** [[indicadores/hogares_censo_2024|hogares_censo_2024]] (VI. Demografía, Educación y Sociedad): [ERROR_CENSO_2024_HOGARES_VIVIENDAS_IAM] Censo 2024 inconsistente: hogares=39964 (39964), vivTot=52294 (52294), vivOcu=0 (39631), IAM(LV=182.8, RI=121.2, Tor=30.8).
- [ ] **[ALTA · ERROR_MINVU_CECT_DEFICIT_HABITACIONAL]** `deficit_cuantitativo_minvu` (VI. Demografía, Educación y Sociedad): [ERROR_MINVU_CECT_DEFICIT_HABITACIONAL] Deficit MINVU inconsistente: sum=0 (1927), Coy=NaN, LV=NaN, Ays=NaN, Coc=NaN.

## 3. Qué Cambió en esta Corrida (Indicadores Comunales)

### 3.1 Indicadores Modificados (28)

| Indicador | Hub / Nodo | Nivel Umbral | Comuna | Anterior | Actual | Delta | Delta % | Outlier | Respaldo |
|---|---|---|---|---|---|---|---|---|---|
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Coyhaique | 80,8 | 80,2 | -0,60 | -0,7% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Lago Verde | 71,8 | 72,1 | 0,30 | +0,4% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Aysén | 78,4 | 78,6 | 0,20 | +0,3% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Guaitecas | 70,6 | 71 | 0,40 | +0,6% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Cochrane | 77,8 | 77,4 | -0,40 | -0,5% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | O'Higgins | 69,1 | 69,5 | 0,40 | +0,6% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Tortel | 68,4 | 68,8 | 0,40 | +0,6% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Chile Chico | 79,4 | 79,1 | -0,30 | -0,4% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Río Ibáñez | 75,9 | 75,8 | -0,10 | -0,1% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Coyhaique | 74,8 | 74,5 | -0,30 | -0,4% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Lago Verde | 67,8 | 68 | 0,20 | +0,3% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Aysén | 70,2 | 71,2 | 1 | +1,4% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Cisnes | 71,8 | 70,4 | -1,40 | -1,9% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Guaitecas | 66,4 | 65,8 | -0,60 | -0,9% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Cochrane | 73,4 | 72,1 | -1,30 | -1,8% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | O'Higgins | 63,4 | 64,2 | 0,80 | +1,3% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Tortel | 63,9 | 63,5 | -0,40 | -0,6% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Chile Chico | 74,1 | 73 | -1,10 | -1,5% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Río Ibáñez | 68,9 | 69,8 | 0,90 | +1,3% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_ssr_apr_familias` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Coyhaique | 10.500 | 3.350 | -7.150 | -68,1% | SI | [[indicadores/cobertura_ssr_apr_familias|Ficha]] |
| `cobertura_ssr_apr_familias` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Lago Verde | 620 | 210 | -410 | -66,1% | SI | [[indicadores/cobertura_ssr_apr_familias|Ficha]] |
| `cobertura_ssr_apr_familias` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Aysén | 5.500 | 1.790 | -3.710 | -67,5% | SI | [[indicadores/cobertura_ssr_apr_familias|Ficha]] |
| `cobertura_ssr_apr_familias` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cisnes | 3.100 | 1.050 | -2.050 | -66,1% | SI | [[indicadores/cobertura_ssr_apr_familias|Ficha]] |
| `cobertura_ssr_apr_familias` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Guaitecas | 1.420 | 551 | -869 | -61,2% | SI | [[indicadores/cobertura_ssr_apr_familias|Ficha]] |
| `cobertura_ssr_apr_familias` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cochrane | 1.450 | 450 | -1.000 | -69,0% | SI | [[indicadores/cobertura_ssr_apr_familias|Ficha]] |
| `cobertura_ssr_apr_familias` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | O'Higgins | 610 | 174 | -436 | -71,5% | SI | [[indicadores/cobertura_ssr_apr_familias|Ficha]] |
| `cobertura_ssr_apr_familias` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Tortel | 480 | 150 | -330 | -68,8% | SI | [[indicadores/cobertura_ssr_apr_familias|Ficha]] |
| `cobertura_ssr_apr_familias` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Chile Chico | 2.350 | 780 | -1.570 | -66,8% | SI | [[indicadores/cobertura_ssr_apr_familias|Ficha]] |
| `cobertura_ssr_apr_familias` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Río Ibáñez | 2.050 | 680 | -1.370 | -66,8% | SI | [[indicadores/cobertura_ssr_apr_familias|Ficha]] |
| `cobertura_subsidio_electrico_pct` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Coyhaique | 35,9 | 34,9 | -1 | -2,8% | NO | [[indicadores/cobertura_subsidio_electrico_pct|Ficha]] |
| `cobertura_subsidio_electrico_pct` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Lago Verde | 25,6 | 22 | -3,60 | -14,1% | NO | [[indicadores/cobertura_subsidio_electrico_pct|Ficha]] |
| `cobertura_subsidio_electrico_pct` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Aysén | 38,9 | 35,2 | -3,70 | -9,5% | NO | [[indicadores/cobertura_subsidio_electrico_pct|Ficha]] |
| `cobertura_subsidio_electrico_pct` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Cisnes | 36,3 | 34,2 | -2,10 | -5,8% | NO | [[indicadores/cobertura_subsidio_electrico_pct|Ficha]] |
| `cobertura_subsidio_electrico_pct` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Guaitecas | 28,5 | 24,4 | -4,10 | -14,4% | NO | [[indicadores/cobertura_subsidio_electrico_pct|Ficha]] |
| `cobertura_subsidio_electrico_pct` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Cochrane | 34,2 | 30,4 | -3,80 | -11,1% | NO | [[indicadores/cobertura_subsidio_electrico_pct|Ficha]] |
| `cobertura_subsidio_electrico_pct` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | O'Higgins | 19,2 | 16,4 | -2,80 | -14,6% | NO | [[indicadores/cobertura_subsidio_electrico_pct|Ficha]] |
| `cobertura_subsidio_electrico_pct` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Tortel | 20,5 | 17,3 | -3,20 | -15,6% | NO | [[indicadores/cobertura_subsidio_electrico_pct|Ficha]] |
| `cobertura_subsidio_electrico_pct` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Chile Chico | 30,3 | 28 | -2,30 | -7,6% | NO | [[indicadores/cobertura_subsidio_electrico_pct|Ficha]] |
| `cobertura_subsidio_electrico_pct` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Río Ibáñez | 32,1 | 27,6 | -4,50 | -14,0% | NO | [[indicadores/cobertura_subsidio_electrico_pct|Ficha]] |
| `deficit_habitacional_cualitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Coyhaique | 6.280 | 2.893 | -3.387 | -53,9% | SI | [[indicadores/deficit_habitacional_cualitativo_n|Ficha]] |
| `deficit_habitacional_cualitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Lago Verde | 300 | 48 | -252 | -84,0% | SI | [[indicadores/deficit_habitacional_cualitativo_n|Ficha]] |
| `deficit_habitacional_cualitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Aysén | 3.260 | 1.168 | -2.092 | -64,2% | SI | [[indicadores/deficit_habitacional_cualitativo_n|Ficha]] |
| `deficit_habitacional_cualitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Cisnes | 1.280 | 281 | -999 | -78,0% | SI | [[indicadores/deficit_habitacional_cualitativo_n|Ficha]] |
| `deficit_habitacional_cualitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Guaitecas | 680 | 78 | -602 | -88,5% | SI | [[indicadores/deficit_habitacional_cualitativo_n|Ficha]] |
| `deficit_habitacional_cualitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Cochrane | 810 | 189 | -621 | -76,7% | SI | [[indicadores/deficit_habitacional_cualitativo_n|Ficha]] |
| `deficit_habitacional_cualitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | O'Higgins | 255 | 38 | -217 | -85,1% | SI | [[indicadores/deficit_habitacional_cualitativo_n|Ficha]] |
| `deficit_habitacional_cualitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Tortel | 375 | 30 | -345 | -92,0% | SI | [[indicadores/deficit_habitacional_cualitativo_n|Ficha]] |
| `deficit_habitacional_cualitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Chile Chico | 990 | 272 | -718 | -72,5% | SI | [[indicadores/deficit_habitacional_cualitativo_n|Ficha]] |
| `deficit_habitacional_cualitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Río Ibáñez | 770 | 158 | -612 | -79,5% | SI | [[indicadores/deficit_habitacional_cualitativo_n|Ficha]] |
| `deficit_habitacional_cuantitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Coyhaique | 1.742 | 1.128 | -614 | -35,2% | SI | [[indicadores/deficit_habitacional_cuantitativo_n|Ficha]] |
| `deficit_habitacional_cuantitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Lago Verde | 32 | 73 | 41 | +128,1% | SI | [[indicadores/deficit_habitacional_cuantitativo_n|Ficha]] |
| `deficit_habitacional_cuantitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Aysén | 719 | 330 | -389 | -54,1% | SI | [[indicadores/deficit_habitacional_cuantitativo_n|Ficha]] |
| `deficit_habitacional_cuantitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Cisnes | 174 | 109 | -65 | -37,4% | SI | [[indicadores/deficit_habitacional_cuantitativo_n|Ficha]] |
| `deficit_habitacional_cuantitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Guaitecas | 89 | 14 | -75 | -84,3% | SI | [[indicadores/deficit_habitacional_cuantitativo_n|Ficha]] |
| `deficit_habitacional_cuantitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Cochrane | 111 | 118 | 7 | +6,3% | NO | [[indicadores/deficit_habitacional_cuantitativo_n|Ficha]] |
| `deficit_habitacional_cuantitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | O'Higgins | 26 | 4 | -22 | -84,6% | SI | [[indicadores/deficit_habitacional_cuantitativo_n|Ficha]] |
| `deficit_habitacional_cuantitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Tortel | 39 | 15 | -24 | -61,5% | SI | [[indicadores/deficit_habitacional_cuantitativo_n|Ficha]] |
| `deficit_habitacional_cuantitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Chile Chico | 134 | 86 | -48 | -35,8% | SI | [[indicadores/deficit_habitacional_cuantitativo_n|Ficha]] |
| `deficit_habitacional_cuantitativo_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Río Ibáñez | 81 | 50 | -31 | -38,3% | SI | [[indicadores/deficit_habitacional_cuantitativo_n|Ficha]] |
| `deficit_habitacional_total_por_1000_hab` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Coyhaique | 30,1 | 19,5 | -10,6 | -35,2% | SI | [[indicadores/deficit_habitacional_total_por_1000_hab|Ficha]] |
| `deficit_habitacional_total_por_1000_hab` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Lago Verde | 41,1 | 82,8 | 41,7 | +101,5% | SI | [[indicadores/deficit_habitacional_total_por_1000_hab|Ficha]] |
| `deficit_habitacional_total_por_1000_hab` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Aysén | 31 | 14,2 | -16,8 | -54,2% | SI | [[indicadores/deficit_habitacional_total_por_1000_hab|Ficha]] |
| `deficit_habitacional_total_por_1000_hab` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cisnes | 33,9 | 20,4 | -13,5 | -39,8% | SI | [[indicadores/deficit_habitacional_total_por_1000_hab|Ficha]] |
| `deficit_habitacional_total_por_1000_hab` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Guaitecas | 55,7 | 8,80 | -46,9 | -84,2% | SI | [[indicadores/deficit_habitacional_total_por_1000_hab|Ficha]] |
| `deficit_habitacional_total_por_1000_hab` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cochrane | 32,1 | 33,8 | 1,70 | +5,3% | NO | [[indicadores/deficit_habitacional_total_por_1000_hab|Ficha]] |
| `deficit_habitacional_total_por_1000_hab` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | O'Higgins | 40,2 | 6 | -34,2 | -85,1% | SI | [[indicadores/deficit_habitacional_total_por_1000_hab|Ficha]] |
| `deficit_habitacional_total_por_1000_hab` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Tortel | 77,2 | 26,6 | -50,6 | -65,5% | SI | [[indicadores/deficit_habitacional_total_por_1000_hab|Ficha]] |
| `deficit_habitacional_total_por_1000_hab` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Chile Chico | 27,3 | 17,4 | -9,90 | -36,3% | SI | [[indicadores/deficit_habitacional_total_por_1000_hab|Ficha]] |
| `deficit_habitacional_total_por_1000_hab` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Río Ibáñez | 29,7 | 18,7 | -11 | -37,0% | SI | [[indicadores/deficit_habitacional_total_por_1000_hab|Ficha]] |
| `escuelas_rurales_multigrado_n` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Tortel | 2 | 1 | -1 | -50,0% | SI | [[indicadores/escuelas_rurales_multigrado_n|Ficha]] |
| `establecimientos_educacion_conectados_n` | III. Energía y Telecomunicaciones (Nodo #14) | estructural (5%) | Cochrane | 4 | 2 | -2 | -50,0% | SI | [[indicadores/establecimientos_educacion_conectados_n|Ficha]] |
| `establecimientos_educacion_conectados_n` | III. Energía y Telecomunicaciones (Nodo #14) | estructural (5%) | O'Higgins | 2 | 1 | -1 | -50,0% | SI | [[indicadores/establecimientos_educacion_conectados_n|Ficha]] |
| `establecimientos_educacion_conectados_n` | III. Energía y Telecomunicaciones (Nodo #14) | estructural (5%) | Tortel | 2 | 1 | -1 | -50,0% | SI | [[indicadores/establecimientos_educacion_conectados_n|Ficha]] |
| `establecimientos_escolares_n` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Coyhaique | 33 | 40 | 7 | +21,2% | SI | [[indicadores/establecimientos_escolares_n|Ficha]] |
| `establecimientos_escolares_n` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Lago Verde | 4 | 3 | -1 | -25,0% | SI | [[indicadores/establecimientos_escolares_n|Ficha]] |
| `establecimientos_escolares_n` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Aysén | 18 | 19 | 1 | +5,6% | SI | [[indicadores/establecimientos_escolares_n|Ficha]] |
| `establecimientos_escolares_n` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Cisnes | 9 | 8 | -1 | -11,1% | SI | [[indicadores/establecimientos_escolares_n|Ficha]] |
| `establecimientos_escolares_n` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Cochrane | 4 | 2 | -2 | -50,0% | SI | [[indicadores/establecimientos_escolares_n|Ficha]] |
| `establecimientos_escolares_n` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | O'Higgins | 2 | 1 | -1 | -50,0% | SI | [[indicadores/establecimientos_escolares_n|Ficha]] |
| `establecimientos_escolares_n` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Tortel | 2 | 1 | -1 | -50,0% | SI | [[indicadores/establecimientos_escolares_n|Ficha]] |
| `establecimientos_slep_aysen` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Coyhaique | 22 | 17 | -5 | -22,7% | SI | [[indicadores/establecimientos_slep_aysen|Ficha]] |
| `establecimientos_slep_aysen` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Lago Verde | 4 | 3 | -1 | -25,0% | SI | [[indicadores/establecimientos_slep_aysen|Ficha]] |
| `establecimientos_slep_aysen` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Cisnes | 8 | 7 | -1 | -12,5% | SI | [[indicadores/establecimientos_slep_aysen|Ficha]] |
| `establecimientos_slep_aysen` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Cochrane | 4 | 2 | -2 | -50,0% | SI | [[indicadores/establecimientos_slep_aysen|Ficha]] |
| `establecimientos_slep_aysen` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | O'Higgins | 2 | 1 | -1 | -50,0% | SI | [[indicadores/establecimientos_slep_aysen|Ficha]] |
| `establecimientos_slep_aysen` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Tortel | 2 | 1 | -1 | -50,0% | SI | [[indicadores/establecimientos_slep_aysen|Ficha]] |
| `fndr_gore_2023_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Lago Verde | 1.615,6 | 1.427 | -188,6 | -11,7% | NO | [[indicadores/fndr_gore_2023_per_capita_mclp|Ficha]] |
| `fndr_gore_2023_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Cisnes | 922,3 | 888,1 | -34,2 | -3,7% | NO | [[indicadores/fndr_gore_2023_per_capita_mclp|Ficha]] |
| `fndr_gore_2023_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Cochrane | 1.126,2 | 1.115,2 | -11 | -1,0% | NO | [[indicadores/fndr_gore_2023_per_capita_mclp|Ficha]] |
| `fndr_gore_2023_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | O'Higgins | 1.775,3 | 1.729,8 | -45,5 | -2,6% | NO | [[indicadores/fndr_gore_2023_per_capita_mclp|Ficha]] |
| `fndr_gore_2023_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Tortel | 3.595,7 | 3.225,3 | -370,4 | -10,3% | NO | [[indicadores/fndr_gore_2023_per_capita_mclp|Ficha]] |
| `fndr_gore_2023_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Chile Chico | 545,5 | 540,5 | -5 | -0,9% | NO | [[indicadores/fndr_gore_2023_per_capita_mclp|Ficha]] |
| `fndr_gore_2023_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Río Ibáñez | 1.187,8 | 1.210,9 | 23,1 | +1,9% | NO | [[indicadores/fndr_gore_2023_per_capita_mclp|Ficha]] |
| `fndr_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Lago Verde | 2.824,1 | 2.494,3 | -329,8 | -11,7% | NO | [[indicadores/fndr_per_capita_mclp|Ficha]] |
| `fndr_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Cisnes | 1.090,1 | 1.049,7 | -40,4 | -3,7% | NO | [[indicadores/fndr_per_capita_mclp|Ficha]] |
| `fndr_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Cochrane | 1.388,1 | 1.374,6 | -13,5 | -1,0% | NO | [[indicadores/fndr_per_capita_mclp|Ficha]] |
| `fndr_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | O'Higgins | 3.709,4 | 3.614,5 | -94,9 | -2,6% | NO | [[indicadores/fndr_per_capita_mclp|Ficha]] |
| `fndr_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Tortel | 5.148,5 | 4.618,1 | -530,4 | -10,3% | NO | [[indicadores/fndr_per_capita_mclp|Ficha]] |
| `fndr_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Chile Chico | 999 | 989,9 | -9,10 | -0,9% | NO | [[indicadores/fndr_per_capita_mclp|Ficha]] |
| `fndr_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #18) | operativo (20%) | Río Ibáñez | 1.505,7 | 1.535 | 29,3 | +1,9% | NO | [[indicadores/fndr_per_capita_mclp|Ficha]] |
| `hogares_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Coyhaique | 21.800 | 22.423 | 623 | +2,9% | NO | [[indicadores/hogares_censo_2024|Ficha]] |
| `hogares_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Lago Verde | 320 | 373 | 53 | +16,6% | NO | [[indicadores/hogares_censo_2024|Ficha]] |
| `hogares_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Aysén | 8.200 | 9.057 | 857 | +10,5% | NO | [[indicadores/hogares_censo_2024|Ficha]] |
| `hogares_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cisnes | 2.050 | 2.180 | 130 | +6,3% | NO | [[indicadores/hogares_censo_2024|Ficha]] |
| `hogares_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Guaitecas | 520 | 606 | 86 | +16,5% | NO | [[indicadores/hogares_censo_2024|Ficha]] |
| `hogares_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cochrane | 1.300 | 1.462 | 162 | +12,5% | NO | [[indicadores/hogares_censo_2024|Ficha]] |
| `hogares_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | O'Higgins | 250 | 292 | 42 | +16,8% | NO | [[indicadores/hogares_censo_2024|Ficha]] |
| `hogares_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Tortel | 195 | 231 | 36 | +18,5% | NO | [[indicadores/hogares_censo_2024|Ficha]] |
| `hogares_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Chile Chico | 1.950 | 2.109 | 159 | +8,2% | NO | [[indicadores/hogares_censo_2024|Ficha]] |
| `hogares_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Río Ibáñez | 1.060 | 1.231 | 171 | +16,1% | NO | [[indicadores/hogares_censo_2024|Ficha]] |
| `indice_envejecimiento` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Lago Verde | 78,5 | 182,8 | 104,3 | +132,9% | SI | [[indicadores/indice_envejecimiento|Ficha]] |
| `indice_envejecimiento` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Aysén | 67,5 | 61,6 | -5,90 | -8,7% | NO | [[indicadores/indice_envejecimiento|Ficha]] |
| `indice_envejecimiento` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cisnes | 69,4 | 64,1 | -5,30 | -7,6% | NO | [[indicadores/indice_envejecimiento|Ficha]] |
| `indice_envejecimiento` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Guaitecas | 58 | 56,5 | -1,50 | -2,6% | NO | [[indicadores/indice_envejecimiento|Ficha]] |
| `indice_envejecimiento` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cochrane | 67,5 | 65 | -2,50 | -3,7% | NO | [[indicadores/indice_envejecimiento|Ficha]] |
| `indice_envejecimiento` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | O'Higgins | 74 | 41,7 | -32,3 | -43,6% | SI | [[indicadores/indice_envejecimiento|Ficha]] |
| `indice_envejecimiento` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Tortel | 71,5 | 30,8 | -40,7 | -56,9% | SI | [[indicadores/indice_envejecimiento|Ficha]] |
| `indice_envejecimiento` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Chile Chico | 72,4 | 92,9 | 20,5 | +28,3% | SI | [[indicadores/indice_envejecimiento|Ficha]] |
| `indice_envejecimiento` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Río Ibáñez | 79,1 | 121,2 | 42,1 | +53,2% | SI | [[indicadores/indice_envejecimiento|Ficha]] |
| `indice_masculinidad` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Coyhaique | 96,8 | 95 | -1,80 | -1,9% | NO | [[indicadores/indice_masculinidad|Ficha]] |
| `indice_masculinidad` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Lago Verde | 122,4 | 121,3 | -1,10 | -0,9% | NO | [[indicadores/indice_masculinidad|Ficha]] |
| `indice_masculinidad` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Aysén | 104,2 | 98,9 | -5,30 | -5,1% | NO | [[indicadores/indice_masculinidad|Ficha]] |
| `indice_masculinidad` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cisnes | 117,2 | 102,3 | -14,9 | -12,7% | NO | [[indicadores/indice_masculinidad|Ficha]] |
| `indice_masculinidad` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Guaitecas | 118,5 | 115,7 | -2,80 | -2,4% | NO | [[indicadores/indice_masculinidad|Ficha]] |
| `indice_masculinidad` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cochrane | 114,5 | 106 | -8,50 | -7,4% | NO | [[indicadores/indice_masculinidad|Ficha]] |
| `indice_masculinidad` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | O'Higgins | 124,6 | 104,7 | -19,9 | -16,0% | NO | [[indicadores/indice_masculinidad|Ficha]] |
| `indice_masculinidad` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Tortel | 125,2 | 114 | -11,2 | -8,9% | NO | [[indicadores/indice_masculinidad|Ficha]] |
| `indice_masculinidad` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Chile Chico | 111 | 102,1 | -8,90 | -8,0% | NO | [[indicadores/indice_masculinidad|Ficha]] |
| `indice_masculinidad` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Río Ibáñez | 116,4 | 107,4 | -9 | -7,7% | NO | [[indicadores/indice_masculinidad|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Lago Verde | 552.952 | 488.379 | -64.573 | -11,7% | NO | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cisnes | 580.062 | 558.534 | -21.528 | -3,7% | NO | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cochrane | 145.419 | 144.003 | -1.416 | -1,0% | NO | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | O'Higgins | 182.859 | 178.178 | -4.681 | -2,6% | NO | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Tortel | 222.455 | 199.538 | -22.917 | -10,3% | NO | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Chile Chico | 135.441 | 134.210 | -1.231 | -0,9% | NO | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `ipp_per_capita_clp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Río Ibáñez | 185.784 | 189.401 | 3.617 | +1,9% | NO | [[indicadores/ipp_per_capita_clp|Ficha]] |
| `liceos_urbanos_n` | VI. Demografía, Educación y Sociedad (Nodo #25) | estructural (5%) | Tortel | 1 | 0 | -1 | -100,0% | SI | [[indicadores/liceos_urbanos_n|Ficha]] |
| `matricula_escolar` | VI. Demografía, Educación y Sociedad (Nodo #25) | operativo (20%) | Coyhaique | 13.450 | 13.284 | -166 | -1,2% | NO | [[indicadores/matricula_escolar|Ficha]] |
| `matricula_escolar` | VI. Demografía, Educación y Sociedad (Nodo #25) | operativo (20%) | Lago Verde | 95 | 54 | -41 | -43,2% | SI | [[indicadores/matricula_escolar|Ficha]] |
| `matricula_escolar` | VI. Demografía, Educación y Sociedad (Nodo #25) | operativo (20%) | Aysén | 4.850 | 5.286 | 436 | +9,0% | NO | [[indicadores/matricula_escolar|Ficha]] |
| `matricula_escolar` | VI. Demografía, Educación y Sociedad (Nodo #25) | operativo (20%) | Cisnes | 980 | 1.011 | 31 | +3,2% | NO | [[indicadores/matricula_escolar|Ficha]] |
| `matricula_escolar` | VI. Demografía, Educación y Sociedad (Nodo #25) | operativo (20%) | Guaitecas | 320 | 290 | -30 | -9,4% | NO | [[indicadores/matricula_escolar|Ficha]] |
| `matricula_escolar` | VI. Demografía, Educación y Sociedad (Nodo #25) | operativo (20%) | Cochrane | 750 | 740 | -10 | -1,3% | NO | [[indicadores/matricula_escolar|Ficha]] |
| `matricula_escolar` | VI. Demografía, Educación y Sociedad (Nodo #25) | operativo (20%) | O'Higgins | 120 | 123 | 3 | +2,5% | NO | [[indicadores/matricula_escolar|Ficha]] |
| `matricula_escolar` | VI. Demografía, Educación y Sociedad (Nodo #25) | operativo (20%) | Tortel | 85 | 82 | -3 | -3,5% | NO | [[indicadores/matricula_escolar|Ficha]] |
| `matricula_escolar` | VI. Demografía, Educación y Sociedad (Nodo #25) | operativo (20%) | Chile Chico | 890 | 864 | -26 | -2,9% | NO | [[indicadores/matricula_escolar|Ficha]] |
| `matricula_escolar` | VI. Demografía, Educación y Sociedad (Nodo #25) | operativo (20%) | Río Ibáñez | 450 | 353 | -97 | -21,6% | SI | [[indicadores/matricula_escolar|Ficha]] |
| `poblacion_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | estructural (5%) | Lago Verde | 779 | 882 | 103 | +13,2% | SI | [[indicadores/poblacion_censo_2024|Ficha]] |
| `poblacion_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | estructural (5%) | Cisnes | 5.137 | 5.335 | 198 | +3,9% | NO | [[indicadores/poblacion_censo_2024|Ficha]] |
| `poblacion_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | estructural (5%) | Cochrane | 3.458 | 3.492 | 34 | +1,0% | NO | [[indicadores/poblacion_censo_2024|Ficha]] |
| `poblacion_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | estructural (5%) | O'Higgins | 647 | 664 | 17 | +2,6% | NO | [[indicadores/poblacion_censo_2024|Ficha]] |
| `poblacion_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | estructural (5%) | Tortel | 505 | 563 | 58 | +11,5% | SI | [[indicadores/poblacion_censo_2024|Ficha]] |
| `poblacion_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | estructural (5%) | Chile Chico | 4.905 | 4.950 | 45 | +0,9% | NO | [[indicadores/poblacion_censo_2024|Ficha]] |
| `poblacion_censo_2024` | VI. Demografía, Educación y Sociedad (Nodo #23) | estructural (5%) | Río Ibáñez | 2.723 | 2.671 | -52 | -1,9% | NO | [[indicadores/poblacion_censo_2024|Ficha]] |
| `pobreza_multidim_pct` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Coyhaique | 11,8 | 14 | 2,20 | +18,6% | NO | [[indicadores/pobreza_multidim_pct|Ficha]] |
| `pobreza_multidim_pct` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Lago Verde | 24,5 | 18 | -6,50 | -26,5% | SI | [[indicadores/pobreza_multidim_pct|Ficha]] |
| `pobreza_multidim_pct` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Aysén | 15,2 | 12,8 | -2,40 | -15,8% | NO | [[indicadores/pobreza_multidim_pct|Ficha]] |
| `pobreza_multidim_pct` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cisnes | 18,6 | 12,3 | -6,30 | -33,9% | SI | [[indicadores/pobreza_multidim_pct|Ficha]] |
| `pobreza_multidim_pct` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Guaitecas | 27,4 | 22,2 | -5,20 | -19,0% | NO | [[indicadores/pobreza_multidim_pct|Ficha]] |
| `pobreza_multidim_pct` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cochrane | 15 | 14,3 | -0,70 | -4,7% | NO | [[indicadores/pobreza_multidim_pct|Ficha]] |
| `pobreza_multidim_pct` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | O'Higgins | 22,8 | 12,1 | -10,7 | -46,9% | SI | [[indicadores/pobreza_multidim_pct|Ficha]] |
| `pobreza_multidim_pct` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Tortel | 26,2 | 12,3 | -13,9 | -53,1% | SI | [[indicadores/pobreza_multidim_pct|Ficha]] |
| `pobreza_multidim_pct` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Chile Chico | 16,2 | 16,3 | 0,10 | +0,6% | NO | [[indicadores/pobreza_multidim_pct|Ficha]] |
| `pobreza_multidim_pct` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Río Ibáñez | 19,8 | 18,8 | -1 | -5,1% | NO | [[indicadores/pobreza_multidim_pct|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Lago Verde | 4.263,2 | 3.765,4 | -497,8 | -11,7% | NO | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cisnes | 1.554,5 | 1.496,8 | -57,7 | -3,7% | NO | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Cochrane | 1.654,4 | 1.638,3 | -16,1 | -1,0% | NO | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | O'Higgins | 8.228,4 | 8.017,7 | -210,7 | -2,6% | NO | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Tortel | 6.813,3 | 6.111,4 | -701,9 | -10,3% | NO | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Chile Chico | 1.219,5 | 1.208,4 | -11,1 | -0,9% | NO | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `presupuesto_per_capita_mclp` | IV. Gobernanza y Finanzas (Nodo #15) | operativo (20%) | Río Ibáñez | 2.296,3 | 2.341 | 44,7 | +1,9% | NO | [[indicadores/presupuesto_per_capita_mclp|Ficha]] |
| `ratio_padron_poblacion_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Lago Verde | 146,5 | 129,4 | -17,1 | -11,7% | NO | [[indicadores/ratio_padron_poblacion_pct|Ficha]] |
| `ratio_padron_poblacion_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Cisnes | 94,2 | 90,7 | -3,50 | -3,7% | NO | [[indicadores/ratio_padron_poblacion_pct|Ficha]] |
| `ratio_padron_poblacion_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Cochrane | 100,1 | 99,1 | -1 | -1,0% | NO | [[indicadores/ratio_padron_poblacion_pct|Ficha]] |
| `ratio_padron_poblacion_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | O'Higgins | 122,7 | 119,6 | -3,10 | -2,5% | NO | [[indicadores/ratio_padron_poblacion_pct|Ficha]] |
| `ratio_padron_poblacion_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Tortel | 124,8 | 111,9 | -12,9 | -10,3% | NO | [[indicadores/ratio_padron_poblacion_pct|Ficha]] |
| `ratio_padron_poblacion_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Chile Chico | 128,1 | 126,9 | -1,20 | -0,9% | NO | [[indicadores/ratio_padron_poblacion_pct|Ficha]] |
| `ratio_padron_poblacion_pct` | IV. Gobernanza y Finanzas (Nodo #17) | operativo (20%) | Río Ibáñez | 112,9 | 115,1 | 2,20 | +1,9% | NO | [[indicadores/ratio_padron_poblacion_pct|Ficha]] |
| `ratio_pobreza_multidim_vs_ingresos` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Coyhaique | 4,10 | 4,80 | 0,70 | +17,1% | NO | [[indicadores/ratio_pobreza_multidim_vs_ingresos|Ficha]] |
| `ratio_pobreza_multidim_vs_ingresos` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Lago Verde | 27,2 | 20 | -7,20 | -26,5% | SI | [[indicadores/ratio_pobreza_multidim_vs_ingresos|Ficha]] |
| `ratio_pobreza_multidim_vs_ingresos` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Aysén | 2,90 | 2,40 | -0,50 | -17,2% | NO | [[indicadores/ratio_pobreza_multidim_vs_ingresos|Ficha]] |
| `ratio_pobreza_multidim_vs_ingresos` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cisnes | 3,70 | 2,50 | -1,20 | -32,4% | SI | [[indicadores/ratio_pobreza_multidim_vs_ingresos|Ficha]] |
| `ratio_pobreza_multidim_vs_ingresos` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Guaitecas | 4,50 | 3,60 | -0,90 | -20,0% | SI | [[indicadores/ratio_pobreza_multidim_vs_ingresos|Ficha]] |
| `ratio_pobreza_multidim_vs_ingresos` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Cochrane | 2,40 | 2,30 | -0,10 | -4,2% | NO | [[indicadores/ratio_pobreza_multidim_vs_ingresos|Ficha]] |
| `ratio_pobreza_multidim_vs_ingresos` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | O'Higgins | 2,50 | 1,30 | -1,20 | -48,0% | SI | [[indicadores/ratio_pobreza_multidim_vs_ingresos|Ficha]] |
| `ratio_pobreza_multidim_vs_ingresos` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Tortel | 5,70 | 2,70 | -3 | -52,6% | SI | [[indicadores/ratio_pobreza_multidim_vs_ingresos|Ficha]] |
| `ratio_pobreza_multidim_vs_ingresos` | VI. Demografía, Educación y Sociedad (Nodo #23) | operativo (20%) | Río Ibáñez | 2,80 | 2,70 | -0,10 | -3,6% | NO | [[indicadores/ratio_pobreza_multidim_vs_ingresos|Ficha]] |
| `sistemas_ssr_apr_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Coyhaique | 12 | 15 | 3 | +25,0% | SI | [[indicadores/sistemas_ssr_apr_n|Ficha]] |
| `sistemas_ssr_apr_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Lago Verde | 3 | 2 | -1 | -33,3% | SI | [[indicadores/sistemas_ssr_apr_n|Ficha]] |
| `sistemas_ssr_apr_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Cisnes | 6 | 5 | -1 | -16,7% | NO | [[indicadores/sistemas_ssr_apr_n|Ficha]] |
| `sistemas_ssr_apr_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Guaitecas | 2 | 1 | -1 | -50,0% | SI | [[indicadores/sistemas_ssr_apr_n|Ficha]] |
| `sistemas_ssr_apr_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Cochrane | 4 | 3 | -1 | -25,0% | SI | [[indicadores/sistemas_ssr_apr_n|Ficha]] |
| `sistemas_ssr_apr_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Tortel | 2 | 1 | -1 | -50,0% | SI | [[indicadores/sistemas_ssr_apr_n|Ficha]] |
| `sistemas_ssr_apr_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Chile Chico | 4 | 5 | 1 | +25,0% | SI | [[indicadores/sistemas_ssr_apr_n|Ficha]] |
| `sistemas_ssr_apr_n` | VI. Demografía, Educación y Sociedad (Nodo #41) | operativo (20%) | Río Ibáñez | 4 | 5 | 1 | +25,0% | SI | [[indicadores/sistemas_ssr_apr_n|Ficha]] |
| `tasa_dmcs_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Coyhaique | 2.150,4 | 1.702 | -448,4 | -20,9% | SI | [[indicadores/tasa_dmcs_100k|Ficha]] |
| `tasa_dmcs_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Lago Verde | 420 | 1.422,3 | 1.002,3 | +238,6% | SI | [[indicadores/tasa_dmcs_100k|Ficha]] |
| `tasa_dmcs_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Aysén | 1.980,2 | 1.197,6 | -782,6 | -39,5% | SI | [[indicadores/tasa_dmcs_100k|Ficha]] |
| `tasa_dmcs_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Cisnes | 1.120 | 1.754,1 | 634,1 | +56,6% | SI | [[indicadores/tasa_dmcs_100k|Ficha]] |
| `tasa_dmcs_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Guaitecas | 890 | 1.862,2 | 972,2 | +109,2% | SI | [[indicadores/tasa_dmcs_100k|Ficha]] |
| `tasa_dmcs_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Cochrane | 1.280 | 748,5 | -531,5 | -41,5% | SI | [[indicadores/tasa_dmcs_100k|Ficha]] |
| `tasa_dmcs_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | O'Higgins | 650 | 1.481,5 | 831,5 | +127,9% | SI | [[indicadores/tasa_dmcs_100k|Ficha]] |
| `tasa_dmcs_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Tortel | 510 | 1.202,7 | 692,7 | +135,8% | SI | [[indicadores/tasa_dmcs_100k|Ficha]] |
| `tasa_dmcs_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Chile Chico | 1.340 | 1.743,2 | 403,2 | +30,1% | SI | [[indicadores/tasa_dmcs_100k|Ficha]] |
| `tasa_dmcs_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Río Ibáñez | 910 | 1.695,5 | 785,5 | +86,3% | SI | [[indicadores/tasa_dmcs_100k|Ficha]] |
| `tasa_vif_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Coyhaique | 940,8 | 730,1 | -210,7 | -22,4% | SI | [[indicadores/tasa_vif_100k|Ficha]] |
| `tasa_vif_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Lago Verde | 385 | 548,2 | 163,2 | +42,4% | SI | [[indicadores/tasa_vif_100k|Ficha]] |
| `tasa_vif_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Aysén | 1.080,5 | 1.157,9 | 77,4 | +7,2% | NO | [[indicadores/tasa_vif_100k|Ficha]] |
| `tasa_vif_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Cisnes | 620 | 749,3 | 129,3 | +20,9% | SI | [[indicadores/tasa_vif_100k|Ficha]] |
| `tasa_vif_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Guaitecas | 540 | 496,6 | -43,4 | -8,0% | NO | [[indicadores/tasa_vif_100k|Ficha]] |
| `tasa_vif_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Cochrane | 690 | 773,1 | 83,1 | +12,0% | NO | [[indicadores/tasa_vif_100k|Ficha]] |
| `tasa_vif_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | O'Higgins | 410 | 740,7 | 330,7 | +80,7% | SI | [[indicadores/tasa_vif_100k|Ficha]] |
| `tasa_vif_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Tortel | 390 | 687,3 | 297,3 | +76,2% | SI | [[indicadores/tasa_vif_100k|Ficha]] |
| `tasa_vif_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Chile Chico | 710 | 755,4 | 45,4 | +6,4% | NO | [[indicadores/tasa_vif_100k|Ficha]] |
| `tasa_vif_100k` | VI. Demografía, Educación y Sociedad (Nodo #26) | operativo (20%) | Río Ibáñez | 480 | 552,9 | 72,9 | +15,2% | NO | [[indicadores/tasa_vif_100k|Ficha]] |
| `ventas_sii_domicilio_local_muf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Cisnes | 1.420 | 1.450 | 30 | +2,1% | NO | [[indicadores/ventas_sii_domicilio_local_muf|Ficha]] |
| `ventas_sii_domicilio_local_muf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Guaitecas | 240 | 380 | 140 | +58,3% | SI | [[indicadores/ventas_sii_domicilio_local_muf|Ficha]] |
| `ventas_sii_domicilio_local_muf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Cochrane | 790 | 620 | -170 | -21,5% | SI | [[indicadores/ventas_sii_domicilio_local_muf|Ficha]] |
| `ventas_sii_domicilio_local_muf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | O'Higgins | 75 | 170 | 95 | +126,7% | SI | [[indicadores/ventas_sii_domicilio_local_muf|Ficha]] |
| `ventas_sii_domicilio_local_muf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Tortel | 85 | 150 | 65 | +76,5% | SI | [[indicadores/ventas_sii_domicilio_local_muf|Ficha]] |
| `ventas_sii_domicilio_local_muf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Chile Chico | 1.210 | 1.180 | -30 | -2,5% | NO | [[indicadores/ventas_sii_domicilio_local_muf|Ficha]] |
| `ventas_sii_domicilio_local_muf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Río Ibáñez | 540 | 410 | -130 | -24,1% | SI | [[indicadores/ventas_sii_domicilio_local_muf|Ficha]] |

### 3.2 Indicadores Agregados (7)

| Indicador | Tipo | Hub | Comunas con valor != 0 | En léxico oficial | Respaldo |
|---|---|---|---|---|---|
| `beneficiarios_ssr_apr_doh` | numeric | VI. Demografía, Educación y Sociedad | 10 / 10 | SI | [[indicadores/beneficiarios_ssr_apr_doh|Ficha]] |
| `deficit_cuantitativo_pct_hogares` | numeric | VI. Demografía, Educación y Sociedad | 10 / 10 | SI | [[indicadores/deficit_cuantitativo_pct_hogares|Ficha]] |
| `inmigrantes_internacionales_pct_censo_2024` | numeric | VI. Demografía, Educación y Sociedad | 10 / 10 | SI | [[indicadores/inmigrantes_internacionales_pct_censo_2024|Ficha]] |
| `matricula_educacion_superior_sies_n` | numeric | X. CTCi e Innovación | 2 / 10 | SI | [[indicadores/matricula_educacion_superior_sies_n|Ficha]] |
| `matricula_slep_aysen_n` | numeric | VI. Demografía, Educación y Sociedad | 10 / 10 | SI | [[indicadores/matricula_slep_aysen_n|Ficha]] |
| `pueblos_originarios_pct_censo_2024` | numeric | VI. Demografía, Educación y Sociedad | 10 / 10 | SI | [[indicadores/pueblos_originarios_pct_censo_2024|Ficha]] |
| `viviendas_totales_censo_2024` | numeric | VI. Demografía, Educación y Sociedad | 10 / 10 | SI | [[indicadores/viviendas_totales_censo_2024|Ficha]] |

### 3.3 Indicadores Eliminados (1)

| Indicador | Tipo | Hub | Acción requerida | Respaldo |
|---|---|---|---|---|
| `matricula_ed_superior_sies` | numeric | X. CTCi e Innovación | Confirmar si fue renombrado o eliminado por error | [[indicadores/matricula_ed_superior_sies|Ficha]] |

## 4. Qué Quedó Igual (Resumen por 10 Hubs Canónicos)

**213 indicadores comunales** mantuvieron valores idénticos en las 10 comunas de Aysén. No se generan fichas individuales vacías para evitar ruido en el grafo de Obsidian.

| Hub Canónico | Indicadores sin cambios |
|---|---|
| I. Turismo y Áreas Silvestres | 31 |
| II. Pesca, Acuicultura y Mar | 23 |
| III. Energía y Telecomunicaciones | 26 |
| IV. Gobernanza y Finanzas | 40 |
| IX. Cultura y Patrimonio | 15 |
| V. Economía, Inversión y Suelo | 20 |
| VI. Demografía, Educación y Sociedad | 13 |
| VII. Biodiversidad, Clima y Riesgos | 15 |
| VIII. Salud | 17 |
| X. CTCi e Innovación | 13 |

## 5. Cobertura Extendida (Barrios ACS, Holdings, Padrón SUBPESCA y Series Anuales)

| Ámbito Estructural | Series/Métricas Actuales | Modificadas | Agregadas | Eliminadas | Sin cambios |
|---|---|---|---|---|---|
| Barrios ACS (N=18) | 8 | 0 | 0 | 0 | 8 |
| Unidades SNASPE (N=19) | 6 | 0 | 0 | 0 | 6 |
| Holdings Salmoneros (N=13) | 7 | 0 | 0 | 0 | 7 |
| Invariantes Padrón SUBPESCA | 5 | 0 | 0 | 0 | 5 |
| Series Anuales (Último Corte) | 67 | 0 | 0 | 0 | 67 |
| Centrales Eléctricas CNE (MW) | 1 | 0 | 0 | 0 | 1 |

## 6. Detalle de Conectores en `curated_fallback`

| Conector | Modo | HTTP | Nodos | Motivo registrado |
|---|---|---|---|---|
| `cne_combustibles` | `curated_fallback` | N/A | #13 | CKAN package_search no respondio 200 (URLError: <urlopen error [Errno -2] Name or service not known>) |
| `cne_energia` | `curated_fallback` | N/A | #11 | CKAN package_search no respondio 200 (URLError: <urlopen error [Errno -2] Name or service not known>) |
| `subpesca` | `curated_fallback` | 404 | #6 | 2 candidato(s) fallaron: sin respuesta / 404 |
| `bbnn` | `curated_fallback` | N/A | #22 | 2 candidato(s) fallaron: sin respuesta / sin respuesta |
| `conaf` | `curated_fallback` | N/A | #27 | 2 candidato(s) fallaron: 404 / sin respuesta |
| `sinca` | `curated_fallback` | 403 | #30 | SINCA no respondio 200 (HTTP 403 Forbidden) |

