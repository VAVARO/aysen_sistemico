---
id: auditoria_corrida_2026-11-26_head_vs_head
title: "Auditoría de Corrida — 2026-11-26 (HEAD vs HEAD)"
type: auditoria_corrida
fecha: "2026-11-26"
baseline: "HEAD"
actual: "HEAD"
semaforo: "ROJO"
total_indicadores: 234
modificados: 23
agregados: 15
eliminados: 0
sin_cambios: 196
alertas_alta: 27
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

Comparación determinista: `HEAD` -> `HEAD` · Semáforo de revisión: **ROJO**.
Índice maestro: [[index_auditoria|Índice de Auditoría de Indicadores]].

## 1. Revisión Rápida (5 Minutos)

| Dimensión de Control | Resultado | Señal |
|---|---|---|
| Indicadores comunales evaluados | 234 actuales (219 en baseline) | 23 modificados · 15 agregados · 0 eliminados · 196 sin cambios |
| Umbrales de salto brusco | Estructural >= 5% · Operativo >= 20% | + transiciones 0/nulo y cambios de signo |
| Alertas para revisión humana | 28 (27 ALTA · 1 MEDIA) | Requiere cierre humano antes de merge a `main` si semáforo != VERDE |
| Salud de conectores automáticos | 5 live_api · 6 curated_fallback | 1 etapa(s) restaurada(s) · Última corrida API: `2026-11-02T12:13:30+00:00` |

### Checklist de Cierre Humano
- [ ] Revisar logs de GitHub Actions (`actualizacion_mensual.yml` / `verificacion.yml`) sin errores bloqueantes.
- [ ] Confirmar cobertura esperada de indicadores y conectores en `curated_fallback`.
- [ ] Validar cada outlier o variable nueva listada en la Sección 2 antes de aprobar el PR.
- [ ] Ejecutar `node scripts/obsidian_indicator_audit.cjs --approve-latest --sync-to-vault` para aprobar y fijar el nuevo baseline.

## 2. Qué Requiere Verificación Humana

- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/cobertura_fibra_hogar_pct|cobertura_fibra_hogar_pct]] (III. Energía y Telecomunicaciones): Lago Verde: 17,6 -> 0,80 (Variación de -95,5% (umbral operativo >= 20%)); Cisnes: 43,6 -> 24,8 (Variación de -43,1% (umbral operativo >= 20%)); Guaitecas: 31,8 -> 2,40 (Variación de -92,5% (umbral operativo >= 20%)); Cochrane: 51,4 -> 39,2 (Variación de -23,7% (umbral operativo >= 20%)); O'Higgins: 23,2 -> 1,50 (Variación de -93,5% (umbral operativo >= 20%)); Tortel: 27,5 -> 2,10 (Variación de -92,4% (umbral operativo >= 20%)); Chile Chico: 47,9 -> 36,5 (Variación de -23,8% (umbral operativo >= 20%)); Río Ibáñez: 35,2 -> 21,4 (Variación de -39,2% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/concentracion_estival_pct|concentracion_estival_pct]] (I. Turismo y Áreas Silvestres): Coyhaique: 70,2 -> 54,8 (Variación de -21,9% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/empresas_sii|empresas_sii]] (V. Economía, Inversión y Suelo): Coyhaique: 5.535 -> 7.620 (Variación de +37,7% (umbral operativo >= 20%)); Lago Verde: 76 -> 118 (Variación de +55,3% (umbral operativo >= 20%)); Aysén: 2.100 -> 2.840 (Variación de +35,2% (umbral operativo >= 20%)); Cisnes: 620 -> 895 (Variación de +44,4% (umbral operativo >= 20%)); Guaitecas: 171 -> 242 (Variación de +41,5% (umbral operativo >= 20%)); Cochrane: 295 -> 492 (Variación de +66,8% (umbral operativo >= 20%)); O'Higgins: 57 -> 96 (Variación de +68,4% (umbral operativo >= 20%)); Tortel: 48 -> 84 (Variación de +75,0% (umbral operativo >= 20%)); Chile Chico: 400 -> 648 (Variación de +62,0% (umbral operativo >= 20%)); Río Ibáñez: 238 -> 418 (Variación de +75,6% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/estadia_promedio_dias|estadia_promedio_dias]] (I. Turismo y Áreas Silvestres): Coyhaique: 2,70 -> 1,89 (Variación de -30,0% (umbral operativo >= 20%)); Aysén: 2,30 -> 1,83 (Variación de -20,4% (umbral operativo >= 20%)); Cochrane: 2,50 -> 1,92 (Variación de -23,2% (umbral operativo >= 20%)); O'Higgins: 2,80 -> 1,92 (Variación de -31,4% (umbral operativo >= 20%)); Chile Chico: 2,40 -> 1,88 (Variación de -21,7% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/gasto_diario_turista_usd|gasto_diario_turista_usd]] (I. Turismo y Áreas Silvestres): Coyhaique: 118 -> 64 (Variación de -45,8% (umbral operativo >= 20%)); Aysén: 135 -> 96 (Variación de -28,9% (umbral operativo >= 20%)); Cisnes: 145 -> 108 (Variación de -25,5% (umbral operativo >= 20%)); Guaitecas: 85 -> 66 (Variación de -22,4% (umbral operativo >= 20%)); Cochrane: 130 -> 104 (Variación de -20,0% (umbral operativo >= 20%)); Chile Chico: 125 -> 74 (Variación de -40,8% (umbral operativo >= 20%)); Río Ibáñez: 150 -> 114 (Variación de -24,0% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/pernoctaciones_emat|pernoctaciones_emat]] (I. Turismo y Áreas Silvestres): Coyhaique: 208.500 -> 138.400 (Variación de -33,6% (umbral operativo >= 20%)); Lago Verde: 6.800 -> 2.800 (Variación de -58,8% (umbral operativo >= 20%)); Aysén: 98.400 -> 58.200 (Variación de -40,9% (umbral operativo >= 20%)); Cisnes: 74.200 -> 44.800 (Variación de -39,6% (umbral operativo >= 20%)); Guaitecas: 5.400 -> 2.300 (Variación de -57,4% (umbral operativo >= 20%)); Cochrane: 49.200 -> 22.800 (Variación de -53,7% (umbral operativo >= 20%)); O'Higgins: 16.400 -> 6.439 (Variación de -60,7% (umbral operativo >= 20%)); Tortel: 27.000 -> 10.400 (Variación de -61,5% (umbral operativo >= 20%)); Chile Chico: 58.600 -> 26.500 (Variación de -54,8% (umbral operativo >= 20%)); Río Ibáñez: 86.200 -> 51.400 (Variación de -40,4% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/prestadores_sernatur|prestadores_sernatur]] (I. Turismo y Áreas Silvestres): Aysén: 185 -> 126 (Variación de -31,9% (umbral operativo >= 20%)); Cisnes: 138 -> 215 (Variación de +55,8% (umbral operativo >= 20%)); Chile Chico: 95 -> 231 (Variación de +143,2% (umbral operativo >= 20%)); Río Ibáñez: 132 -> 445 (Variación de +237,1% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/revpar_estimado_usd|revpar_estimado_usd]] (I. Turismo y Áreas Silvestres): Coyhaique: 79,6 -> 18,9 (Variación de -76,3% (umbral operativo >= 20%)); Lago Verde: 28 -> 8 (Variación de -71,4% (umbral operativo >= 20%)); Aysén: 83,7 -> 21,7 (Variación de -74,1% (umbral operativo >= 20%)); Cisnes: 87,7 -> 21,4 (Variación de -75,6% (umbral operativo >= 20%)); Guaitecas: 39,4 -> 9,30 (Variación de -76,4% (umbral operativo >= 20%)); Cochrane: 73,9 -> 17,4 (Variación de -76,5% (umbral operativo >= 20%)); O'Higgins: 72,7 -> 10,7 (Variación de -85,3% (umbral operativo >= 20%)); Tortel: 62,9 -> 11,2 (Variación de -82,2% (umbral operativo >= 20%)); Chile Chico: 76,7 -> 14,2 (Variación de -81,5% (umbral operativo >= 20%)); Río Ibáñez: 90,1 -> 14,5 (Variación de -83,9% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/tarifa_adr_estimada_usd|tarifa_adr_estimada_usd]] (I. Turismo y Áreas Silvestres): Coyhaique: 159 -> 71,1 (Variación de -55,3% (umbral operativo >= 20%)); Lago Verde: 92 -> 52,4 (Variación de -43,0% (umbral operativo >= 20%)); Aysén: 182 -> 85,5 (Variación de -53,0% (umbral operativo >= 20%)); Cisnes: 196 -> 89,4 (Variación de -54,4% (umbral operativo >= 20%)); Guaitecas: 115 -> 56,2 (Variación de -51,1% (umbral operativo >= 20%)); Cochrane: 176 -> 77,7 (Variación de -55,9% (umbral operativo >= 20%)); O'Higgins: 186 -> 61,7 (Variación de -66,8% (umbral operativo >= 20%)); Tortel: 155 -> 58,5 (Variación de -62,3% (umbral operativo >= 20%)); Chile Chico: 169 -> 62,7 (Variación de -62,9% (umbral operativo >= 20%)); Río Ibáñez: 203 -> 65,7 (Variación de -67,6% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/tasa_ocupacion_invernal_pct|tasa_ocupacion_invernal_pct]] (I. Turismo y Áreas Silvestres): Lago Verde: 12 -> 8,50 (Variación de -29,2% (umbral operativo >= 20%)); Guaitecas: 14,5 -> 11,2 (Variación de -22,8% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/trabajadores_sii|trabajadores_sii]] (V. Economía, Inversión y Suelo): Coyhaique: 33.650 -> 20.950 (Variación de -37,7% (umbral operativo >= 20%)); Lago Verde: 460 -> 132 (Variación de -71,3% (umbral operativo >= 20%)); Aysén: 12.780 -> 9.890 (Variación de -22,6% (umbral operativo >= 20%)); Cisnes: 3.770 -> 1.920 (Variación de -49,1% (umbral operativo >= 20%)); Guaitecas: 1.040 -> 265 (Variación de -74,5% (umbral operativo >= 20%)); Cochrane: 1.790 -> 845 (Variación de -52,8% (umbral operativo >= 20%)); O'Higgins: 345 -> 98 (Variación de -71,6% (umbral operativo >= 20%)); Tortel: 295 -> 80 (Variación de -72,9% (umbral operativo >= 20%)); Chile Chico: 2.430 -> 1.140 (Variación de -53,1% (umbral operativo >= 20%)); Río Ibáñez: 1.445 -> 512 (Variación de -64,6% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/trabajadores_sii_por_centro_activo|trabajadores_sii_por_centro_activo]] (II. Pesca, Acuicultura y Mar): Aysén: 94,7 -> 73,3 (Variación de -22,6% (umbral operativo >= 20%)); Cisnes: 48,3 -> 24,6 (Variación de -49,1% (umbral operativo >= 20%)); Guaitecas: 32,5 -> 8,30 (Variación de -74,5% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/ventas_por_empresa_uf|ventas_por_empresa_uf]] (V. Economía, Inversión y Suelo): Coyhaique: 8.762 -> 6.365 (Variación de -27,4% (umbral operativo >= 20%)); Lago Verde: 5.921 -> 3.814 (Variación de -35,6% (umbral operativo >= 20%)); Aysén: 26.762 -> 19.789 (Variación de -26,1% (umbral operativo >= 20%)); Cisnes: 14.677 -> 10.168 (Variación de -30,7% (umbral operativo >= 20%)); Guaitecas: 14.327 -> 10.124 (Variación de -29,3% (umbral operativo >= 20%)); Cochrane: 14.915 -> 8.943 (Variación de -40,0% (umbral operativo >= 20%)); O'Higgins: 9.298 -> 5.521 (Variación de -40,6% (umbral operativo >= 20%)); Tortel: 8.125 -> 4.643 (Variación de -42,9% (umbral operativo >= 20%)); Chile Chico: 15.750 -> 9.722 (Variación de -38,3% (umbral operativo >= 20%)); Río Ibáñez: 13.445 -> 7.656 (Variación de -43,1% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/visitantes_extranjeros_snaspe_n|visitantes_extranjeros_snaspe_n]] (I. Turismo y Áreas Silvestres): Coyhaique: 10.318 -> 5.679 (Variación de -45,0% (umbral operativo >= 20%)); Lago Verde: 261 -> 0 (Caída a 0 desde 261); Aysén: 10.123 -> 2.410 (Variación de -76,2% (umbral operativo >= 20%)); Cisnes: 26.643 -> 10.632 (Variación de -60,1% (umbral operativo >= 20%)); Guaitecas: 432 -> 0 (Caída a 0 desde 432); Cochrane: 15.842 -> 4.385 (Variación de -72,3% (umbral operativo >= 20%)); O'Higgins: 6.820 -> 0 (Caída a 0 desde 6.820); Tortel: 6.106 -> 0 (Caída a 0 desde 6.106); Chile Chico: 13.167 -> 2.541 (Variación de -80,7% (umbral operativo >= 20%)); Río Ibáñez: 19.680 -> 7.587 (Variación de -61,4% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/visitantes_snaspe|visitantes_snaspe]] (I. Turismo y Áreas Silvestres): Coyhaique: 38.500 -> 21.190 (Variación de -45,0% (umbral operativo >= 20%)); Lago Verde: 1.800 -> 0 (Caída a 0 desde 1.800); Aysén: 29.600 -> 7.048 (Variación de -76,2% (umbral operativo >= 20%)); Cisnes: 64.200 -> 25.619 (Variación de -60,1% (umbral operativo >= 20%)); Guaitecas: 2.400 -> 0 (Caída a 0 desde 2.400); Cochrane: 35.600 -> 9.853 (Variación de -72,3% (umbral operativo >= 20%)); O'Higgins: 12.400 -> 0 (Caída a 0 desde 12.400); Tortel: 14.200 -> 0 (Caída a 0 desde 14.200); Chile Chico: 34.200 -> 6.600 (Variación de -80,7% (umbral operativo >= 20%)); Río Ibáñez: 41.000 -> 15.807 (Variación de -61,4% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/visitas_por_cama_turistica|visitas_por_cama_turistica]] (I. Turismo y Áreas Silvestres): Coyhaique: 11,3 -> 6,20 (Variación de -45,1% (umbral operativo >= 20%)); Lago Verde: 10,9 -> 0 (Caída a 0 desde 10,9); Aysén: 16 -> 3,80 (Variación de -76,3% (umbral operativo >= 20%)); Cisnes: 51,8 -> 20,7 (Variación de -60,0% (umbral operativo >= 20%)); Guaitecas: 16,6 -> 0 (Caída a 0 desde 16,6); Cochrane: 51,6 -> 14,3 (Variación de -72,3% (umbral operativo >= 20%)); O'Higgins: 51,7 -> 0 (Caída a 0 desde 51,7); Tortel: 39,4 -> 0 (Caída a 0 desde 39,4); Chile Chico: 43,8 -> 8,50 (Variación de -80,6% (umbral operativo >= 20%)); Río Ibáñez: 35,7 -> 13,7 (Variación de -61,6% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/visitas_por_pernoctacion_ratio|visitas_por_pernoctacion_ratio]] (I. Turismo y Áreas Silvestres): Lago Verde: 0,26 -> 0 (Caída a 0 desde 0,26); Aysén: 0,30 -> 0,12 (Variación de -60,0% (umbral operativo >= 20%)); Cisnes: 0,87 -> 0,57 (Variación de -34,5% (umbral operativo >= 20%)); Guaitecas: 0,44 -> 0 (Caída a 0 desde 0,44); Cochrane: 0,72 -> 0,43 (Variación de -40,3% (umbral operativo >= 20%)); O'Higgins: 0,76 -> 0 (Caída a 0 desde 0,76); Tortel: 0,53 -> 0 (Caída a 0 desde 0,53); Chile Chico: 0,58 -> 0,25 (Variación de -56,9% (umbral operativo >= 20%)); Río Ibáñez: 0,48 -> 0,31 (Variación de -35,4% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `serie_emporcha_cruceros__pasajeros_cruceros` (Series Anuales (Último Corte)): ultimo: 28.500 -> 22.093 (Variación de -22,5% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `serie_emporcha_cruceros__tripulantes` (Series Anuales (Último Corte)): ultimo: 12.400 -> 9.850 (Variación de -20,6% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `serie_snaspe_por_parque_anual__otras_unidades` (Series Anuales (Último Corte)): 2026: 116.100 -> 24.238 (Variación de -79,1% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `serie_snaspe_por_parque_anual__pernoctaciones_emat` (Series Anuales (Último Corte)): 2026: 472.000 -> 364.039 (Variación de -22,9% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `serie_snaspe_por_parque_anual__pn_cerro_castillo` (Series Anuales (Último Corte)): 2026: 37.200 -> 13.907 (Variación de -62,6% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `serie_snaspe_por_parque_anual__pn_laguna_san_rafael` (Series Anuales (Último Corte)): 2026: 39.800 -> 5.900 (Variación de -85,2% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `serie_snaspe_por_parque_anual__pn_patagonia` (Series Anuales (Último Corte)): 2026: 32.400 -> 16.453 (Variación de -49,2% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `serie_snaspe_por_parque_anual__pn_queulat` (Series Anuales (Último Corte)): 2026: 58.500 -> 25.619 (Variación de -56,2% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `serie_snaspe_por_parque_anual__visitantes_snaspe_total` (Series Anuales (Último Corte)): 2026: 284.000 -> 86.117 (Variación de -69,7% (umbral operativo >= 20%))
- [ ] **[ALTA · ETAPA_RESTAURADA]** `pipeline_ingesta` (Infraestructura / Ingesta): 1 etapa(s) fueron restauradas por Circuit Breaker (Last-Known-Good) en la última corrida automática (2026-11-02T12:13:30+00:00).
- [ ] **[MEDIA · CONECTOR_FALLBACK]** `pipeline_ingesta` (Infraestructura / Ingesta): 6 conector(es) operaron en curated_fallback: cne_combustibles, cne_energia, subpesca, bbnn, conaf, sinca. Los datos previos se conservaron, pero conviene verificar si hubo actualización oficial pendiente.

## 3. Qué Cambió en esta Corrida (Indicadores Comunales)

### 3.1 Indicadores Modificados (23)

| Indicador | Hub / Nodo | Nivel Umbral | Comuna | Anterior | Actual | Delta | Delta % | Outlier | Respaldo |
|---|---|---|---|---|---|---|---|---|---|
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Coyhaique | 80,2 | 80,8 | 0,60 | +0,7% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Lago Verde | 72,1 | 71,8 | -0,30 | -0,4% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Aysén | 78,6 | 78,4 | -0,20 | -0,3% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Guaitecas | 71 | 70,6 | -0,40 | -0,6% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Cochrane | 77,4 | 77,8 | 0,40 | +0,5% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | O'Higgins | 69,5 | 69,1 | -0,40 | -0,6% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Tortel | 68,8 | 68,4 | -0,40 | -0,6% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Chile Chico | 79,1 | 79,4 | 0,30 | +0,4% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_empam_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Río Ibáñez | 75,8 | 75,9 | 0,10 | +0,1% | NO | [[indicadores/cobertura_empam_pct|Ficha]] |
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Coyhaique | 75,5 | 68,4 | -7,10 | -9,4% | NO | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Lago Verde | 17,6 | 0,80 | -16,8 | -95,5% | SI | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Aysén | 61,8 | 54,2 | -7,60 | -12,3% | NO | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Cisnes | 43,6 | 24,8 | -18,8 | -43,1% | SI | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Guaitecas | 31,8 | 2,40 | -29,4 | -92,5% | SI | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Cochrane | 51,4 | 39,2 | -12,2 | -23,7% | SI | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | O'Higgins | 23,2 | 1,50 | -21,7 | -93,5% | SI | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Tortel | 27,5 | 2,10 | -25,4 | -92,4% | SI | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Chile Chico | 47,9 | 36,5 | -11,4 | -23,8% | SI | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Río Ibáñez | 35,2 | 21,4 | -13,8 | -39,2% | SI | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Coyhaique | 74,5 | 74,8 | 0,30 | +0,4% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Lago Verde | 68 | 67,8 | -0,20 | -0,3% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Aysén | 71,2 | 70,2 | -1 | -1,4% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Cisnes | 70,4 | 71,8 | 1,40 | +2,0% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Guaitecas | 65,8 | 66,4 | 0,60 | +0,9% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Cochrane | 72,1 | 73,4 | 1,30 | +1,8% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | O'Higgins | 64,2 | 63,4 | -0,80 | -1,2% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Tortel | 63,5 | 63,9 | 0,40 | +0,6% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Chile Chico | 73 | 74,1 | 1,10 | +1,5% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `cobertura_pscv_pct` | VIII. Salud (Nodo #38) | operativo (20%) | Río Ibáñez | 69,8 | 68,9 | -0,90 | -1,3% | NO | [[indicadores/cobertura_pscv_pct|Ficha]] |
| `concentracion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Coyhaique | 70,2 | 54,8 | -15,4 | -21,9% | SI | [[indicadores/concentracion_estival_pct|Ficha]] |
| `concentracion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Lago Verde | 82,9 | 81,2 | -1,70 | -2,1% | NO | [[indicadores/concentracion_estival_pct|Ficha]] |
| `concentracion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Aysén | 71,6 | 61,4 | -10,2 | -14,2% | NO | [[indicadores/concentracion_estival_pct|Ficha]] |
| `concentracion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cisnes | 82,3 | 77,8 | -4,50 | -5,5% | NO | [[indicadores/concentracion_estival_pct|Ficha]] |
| `concentracion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Guaitecas | 81,5 | 69,5 | -12 | -14,7% | NO | [[indicadores/concentracion_estival_pct|Ficha]] |
| `concentracion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cochrane | 83,5 | 80,4 | -3,10 | -3,7% | NO | [[indicadores/concentracion_estival_pct|Ficha]] |
| `concentracion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | O'Higgins | 92 | 88,2 | -3,80 | -4,1% | NO | [[indicadores/concentracion_estival_pct|Ficha]] |
| `concentracion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Tortel | 88,5 | 86,8 | -1,70 | -1,9% | NO | [[indicadores/concentracion_estival_pct|Ficha]] |
| `concentracion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Chile Chico | 79,6 | 74,6 | -5 | -6,3% | NO | [[indicadores/concentracion_estival_pct|Ficha]] |
| `concentracion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Río Ibáñez | 86 | 85,6 | -0,40 | -0,5% | NO | [[indicadores/concentracion_estival_pct|Ficha]] |
| `empresas_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Coyhaique | 5.535 | 7.620 | 2.085 | +37,7% | SI | [[indicadores/empresas_sii|Ficha]] |
| `empresas_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Lago Verde | 76 | 118 | 42 | +55,3% | SI | [[indicadores/empresas_sii|Ficha]] |
| `empresas_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Aysén | 2.100 | 2.840 | 740 | +35,2% | SI | [[indicadores/empresas_sii|Ficha]] |
| `empresas_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Cisnes | 620 | 895 | 275 | +44,4% | SI | [[indicadores/empresas_sii|Ficha]] |
| `empresas_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Guaitecas | 171 | 242 | 71 | +41,5% | SI | [[indicadores/empresas_sii|Ficha]] |
| `empresas_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Cochrane | 295 | 492 | 197 | +66,8% | SI | [[indicadores/empresas_sii|Ficha]] |
| `empresas_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | O'Higgins | 57 | 96 | 39 | +68,4% | SI | [[indicadores/empresas_sii|Ficha]] |
| `empresas_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Tortel | 48 | 84 | 36 | +75,0% | SI | [[indicadores/empresas_sii|Ficha]] |
| `empresas_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Chile Chico | 400 | 648 | 248 | +62,0% | SI | [[indicadores/empresas_sii|Ficha]] |
| `empresas_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Río Ibáñez | 238 | 418 | 180 | +75,6% | SI | [[indicadores/empresas_sii|Ficha]] |
| `estadia_promedio_dias` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Coyhaique | 2,70 | 1,89 | -0,81 | -30,0% | SI | [[indicadores/estadia_promedio_dias|Ficha]] |
| `estadia_promedio_dias` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Lago Verde | 2 | 1,87 | -0,13 | -6,5% | NO | [[indicadores/estadia_promedio_dias|Ficha]] |
| `estadia_promedio_dias` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Aysén | 2,30 | 1,83 | -0,47 | -20,4% | SI | [[indicadores/estadia_promedio_dias|Ficha]] |
| `estadia_promedio_dias` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cisnes | 2,10 | 1,82 | -0,28 | -13,3% | NO | [[indicadores/estadia_promedio_dias|Ficha]] |
| `estadia_promedio_dias` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Guaitecas | 2,30 | 1,92 | -0,38 | -16,5% | NO | [[indicadores/estadia_promedio_dias|Ficha]] |
| `estadia_promedio_dias` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cochrane | 2,50 | 1,92 | -0,58 | -23,2% | SI | [[indicadores/estadia_promedio_dias|Ficha]] |
| `estadia_promedio_dias` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | O'Higgins | 2,80 | 1,92 | -0,88 | -31,4% | SI | [[indicadores/estadia_promedio_dias|Ficha]] |
| `estadia_promedio_dias` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Tortel | 1,90 | 1,78 | -0,12 | -6,3% | NO | [[indicadores/estadia_promedio_dias|Ficha]] |
| `estadia_promedio_dias` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Chile Chico | 2,40 | 1,88 | -0,52 | -21,7% | SI | [[indicadores/estadia_promedio_dias|Ficha]] |
| `estadia_promedio_dias` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Río Ibáñez | 2,10 | 1,77 | -0,33 | -15,7% | NO | [[indicadores/estadia_promedio_dias|Ficha]] |
| `gasto_diario_turista_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Coyhaique | 118 | 64 | -54 | -45,8% | SI | [[indicadores/gasto_diario_turista_usd|Ficha]] |
| `gasto_diario_turista_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Lago Verde | 68 | 58 | -10 | -14,7% | NO | [[indicadores/gasto_diario_turista_usd|Ficha]] |
| `gasto_diario_turista_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Aysén | 135 | 96 | -39 | -28,9% | SI | [[indicadores/gasto_diario_turista_usd|Ficha]] |
| `gasto_diario_turista_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cisnes | 145 | 108 | -37 | -25,5% | SI | [[indicadores/gasto_diario_turista_usd|Ficha]] |
| `gasto_diario_turista_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Guaitecas | 85 | 66 | -19 | -22,4% | SI | [[indicadores/gasto_diario_turista_usd|Ficha]] |
| `gasto_diario_turista_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cochrane | 130 | 104 | -26 | -20,0% | SI | [[indicadores/gasto_diario_turista_usd|Ficha]] |
| `gasto_diario_turista_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | O'Higgins | 138 | 112 | -26 | -18,8% | NO | [[indicadores/gasto_diario_turista_usd|Ficha]] |
| `gasto_diario_turista_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Tortel | 115 | 95 | -20 | -17,4% | NO | [[indicadores/gasto_diario_turista_usd|Ficha]] |
| `gasto_diario_turista_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Chile Chico | 125 | 74 | -51 | -40,8% | SI | [[indicadores/gasto_diario_turista_usd|Ficha]] |
| `gasto_diario_turista_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Río Ibáñez | 150 | 114 | -36 | -24,0% | SI | [[indicadores/gasto_diario_turista_usd|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Coyhaique | 235 | 218 | -17 | -7,2% | NO | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Lago Verde | 312 | 334 | 22 | +7,1% | NO | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Aysén | 254 | 242 | -12 | -4,7% | NO | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Cisnes | 278 | 274 | -4 | -1,4% | NO | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Guaitecas | 318 | 346 | 28 | +8,8% | NO | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Cochrane | 285 | 269 | -16 | -5,6% | NO | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | O'Higgins | 304 | 305 | 1 | +0,3% | NO | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Tortel | 294 | 288 | -6 | -2,0% | NO | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Chile Chico | 268 | 262 | -6 | -2,2% | NO | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Río Ibáñez | 292 | 302 | 10 | +3,4% | NO | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Coyhaique | 342 | 318 | -24 | -7,0% | NO | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Lago Verde | 425 | 418 | -7 | -1,6% | NO | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Aysén | 365 | 354 | -11 | -3,0% | NO | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Cisnes | 388 | 412 | 24 | +6,2% | NO | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Guaitecas | 438 | 468 | 30 | +6,8% | NO | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Cochrane | 392 | 368 | -24 | -6,1% | NO | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | O'Higgins | 416 | 436 | 20 | +4,8% | NO | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Tortel | 402 | 388 | -14 | -3,5% | NO | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Chile Chico | 378 | 364 | -14 | -3,7% | NO | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Río Ibáñez | 404 | 424 | 20 | +5,0% | NO | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `pernoctaciones_emat` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Coyhaique | 208.500 | 138.400 | -70.100 | -33,6% | SI | [[indicadores/pernoctaciones_emat|Ficha]] |
| `pernoctaciones_emat` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Lago Verde | 6.800 | 2.800 | -4.000 | -58,8% | SI | [[indicadores/pernoctaciones_emat|Ficha]] |
| `pernoctaciones_emat` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Aysén | 98.400 | 58.200 | -40.200 | -40,9% | SI | [[indicadores/pernoctaciones_emat|Ficha]] |
| `pernoctaciones_emat` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cisnes | 74.200 | 44.800 | -29.400 | -39,6% | SI | [[indicadores/pernoctaciones_emat|Ficha]] |
| `pernoctaciones_emat` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Guaitecas | 5.400 | 2.300 | -3.100 | -57,4% | SI | [[indicadores/pernoctaciones_emat|Ficha]] |
| `pernoctaciones_emat` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cochrane | 49.200 | 22.800 | -26.400 | -53,7% | SI | [[indicadores/pernoctaciones_emat|Ficha]] |
| `pernoctaciones_emat` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | O'Higgins | 16.400 | 6.439 | -9.961 | -60,7% | SI | [[indicadores/pernoctaciones_emat|Ficha]] |
| `pernoctaciones_emat` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Tortel | 27.000 | 10.400 | -16.600 | -61,5% | SI | [[indicadores/pernoctaciones_emat|Ficha]] |
| `pernoctaciones_emat` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Chile Chico | 58.600 | 26.500 | -32.100 | -54,8% | SI | [[indicadores/pernoctaciones_emat|Ficha]] |
| `pernoctaciones_emat` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Río Ibáñez | 86.200 | 51.400 | -34.800 | -40,4% | SI | [[indicadores/pernoctaciones_emat|Ficha]] |
| `prestadores_sernatur` | I. Turismo y Áreas Silvestres (Nodo #1) | operativo (20%) | Coyhaique | 412 | 489 | 77 | +18,7% | NO | [[indicadores/prestadores_sernatur|Ficha]] |
| `prestadores_sernatur` | I. Turismo y Áreas Silvestres (Nodo #1) | operativo (20%) | Lago Verde | 24 | 26 | 2 | +8,3% | NO | [[indicadores/prestadores_sernatur|Ficha]] |
| `prestadores_sernatur` | I. Turismo y Áreas Silvestres (Nodo #1) | operativo (20%) | Aysén | 185 | 126 | -59 | -31,9% | SI | [[indicadores/prestadores_sernatur|Ficha]] |
| `prestadores_sernatur` | I. Turismo y Áreas Silvestres (Nodo #1) | operativo (20%) | Cisnes | 138 | 215 | 77 | +55,8% | SI | [[indicadores/prestadores_sernatur|Ficha]] |
| `prestadores_sernatur` | I. Turismo y Áreas Silvestres (Nodo #1) | operativo (20%) | Guaitecas | 21 | 25 | 4 | +19,0% | NO | [[indicadores/prestadores_sernatur|Ficha]] |
| `prestadores_sernatur` | I. Turismo y Áreas Silvestres (Nodo #1) | operativo (20%) | Cochrane | 83 | 96 | 13 | +15,7% | NO | [[indicadores/prestadores_sernatur|Ficha]] |
| `prestadores_sernatur` | I. Turismo y Áreas Silvestres (Nodo #1) | operativo (20%) | O'Higgins | 29 | 31 | 2 | +6,9% | NO | [[indicadores/prestadores_sernatur|Ficha]] |
| `prestadores_sernatur` | I. Turismo y Áreas Silvestres (Nodo #1) | operativo (20%) | Tortel | 42 | 44 | 2 | +4,8% | NO | [[indicadores/prestadores_sernatur|Ficha]] |
| `prestadores_sernatur` | I. Turismo y Áreas Silvestres (Nodo #1) | operativo (20%) | Chile Chico | 95 | 231 | 136 | +143,2% | SI | [[indicadores/prestadores_sernatur|Ficha]] |
| `prestadores_sernatur` | I. Turismo y Áreas Silvestres (Nodo #1) | operativo (20%) | Río Ibáñez | 132 | 445 | 313 | +237,1% | SI | [[indicadores/prestadores_sernatur|Ficha]] |
| `revpar_estimado_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Coyhaique | 79,6 | 18,9 | -60,7 | -76,3% | SI | [[indicadores/revpar_estimado_usd|Ficha]] |
| `revpar_estimado_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Lago Verde | 28 | 8 | -20 | -71,4% | SI | [[indicadores/revpar_estimado_usd|Ficha]] |
| `revpar_estimado_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Aysén | 83,7 | 21,7 | -62 | -74,1% | SI | [[indicadores/revpar_estimado_usd|Ficha]] |
| `revpar_estimado_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cisnes | 87,7 | 21,4 | -66,3 | -75,6% | SI | [[indicadores/revpar_estimado_usd|Ficha]] |
| `revpar_estimado_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Guaitecas | 39,4 | 9,30 | -30,1 | -76,4% | SI | [[indicadores/revpar_estimado_usd|Ficha]] |
| `revpar_estimado_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cochrane | 73,9 | 17,4 | -56,5 | -76,5% | SI | [[indicadores/revpar_estimado_usd|Ficha]] |
| `revpar_estimado_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | O'Higgins | 72,7 | 10,7 | -62 | -85,3% | SI | [[indicadores/revpar_estimado_usd|Ficha]] |
| `revpar_estimado_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Tortel | 62,9 | 11,2 | -51,7 | -82,2% | SI | [[indicadores/revpar_estimado_usd|Ficha]] |
| `revpar_estimado_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Chile Chico | 76,7 | 14,2 | -62,5 | -81,5% | SI | [[indicadores/revpar_estimado_usd|Ficha]] |
| `revpar_estimado_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Río Ibáñez | 90,1 | 14,5 | -75,6 | -83,9% | SI | [[indicadores/revpar_estimado_usd|Ficha]] |
| `tarifa_adr_estimada_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Coyhaique | 159 | 71,1 | -87,9 | -55,3% | SI | [[indicadores/tarifa_adr_estimada_usd|Ficha]] |
| `tarifa_adr_estimada_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Lago Verde | 92 | 52,4 | -39,6 | -43,0% | SI | [[indicadores/tarifa_adr_estimada_usd|Ficha]] |
| `tarifa_adr_estimada_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Aysén | 182 | 85,5 | -96,5 | -53,0% | SI | [[indicadores/tarifa_adr_estimada_usd|Ficha]] |
| `tarifa_adr_estimada_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cisnes | 196 | 89,4 | -106,6 | -54,4% | SI | [[indicadores/tarifa_adr_estimada_usd|Ficha]] |
| `tarifa_adr_estimada_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Guaitecas | 115 | 56,2 | -58,8 | -51,1% | SI | [[indicadores/tarifa_adr_estimada_usd|Ficha]] |
| `tarifa_adr_estimada_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cochrane | 176 | 77,7 | -98,3 | -55,9% | SI | [[indicadores/tarifa_adr_estimada_usd|Ficha]] |
| `tarifa_adr_estimada_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | O'Higgins | 186 | 61,7 | -124,3 | -66,8% | SI | [[indicadores/tarifa_adr_estimada_usd|Ficha]] |
| `tarifa_adr_estimada_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Tortel | 155 | 58,5 | -96,5 | -62,3% | SI | [[indicadores/tarifa_adr_estimada_usd|Ficha]] |
| `tarifa_adr_estimada_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Chile Chico | 169 | 62,7 | -106,3 | -62,9% | SI | [[indicadores/tarifa_adr_estimada_usd|Ficha]] |
| `tarifa_adr_estimada_usd` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Río Ibáñez | 203 | 65,7 | -137,3 | -67,6% | SI | [[indicadores/tarifa_adr_estimada_usd|Ficha]] |
| `tasa_ocupacion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Coyhaique | 76,5 | 89,9 | 13,4 | +17,5% | NO | [[indicadores/tasa_ocupacion_estival_pct|Ficha]] |
| `tasa_ocupacion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Lago Verde | 58,2 | 64,5 | 6,30 | +10,8% | NO | [[indicadores/tasa_ocupacion_estival_pct|Ficha]] |
| `tasa_ocupacion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Aysén | 72,1 | 84,2 | 12,1 | +16,8% | NO | [[indicadores/tasa_ocupacion_estival_pct|Ficha]] |
| `tasa_ocupacion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cisnes | 84,5 | 70 | -14,5 | -17,2% | NO | [[indicadores/tasa_ocupacion_estival_pct|Ficha]] |
| `tasa_ocupacion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Guaitecas | 64 | 62 | -2 | -3,1% | NO | [[indicadores/tasa_ocupacion_estival_pct|Ficha]] |
| `tasa_ocupacion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cochrane | 81 | 79,4 | -1,60 | -2,0% | NO | [[indicadores/tasa_ocupacion_estival_pct|Ficha]] |
| `tasa_ocupacion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | O'Higgins | 86,5 | 80,5 | -6 | -6,9% | NO | [[indicadores/tasa_ocupacion_estival_pct|Ficha]] |
| `tasa_ocupacion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Tortel | 85 | 78,6 | -6,40 | -7,5% | NO | [[indicadores/tasa_ocupacion_estival_pct|Ficha]] |
| `tasa_ocupacion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Chile Chico | 82 | 76,2 | -5,80 | -7,1% | NO | [[indicadores/tasa_ocupacion_estival_pct|Ficha]] |
| `tasa_ocupacion_estival_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Río Ibáñez | 89,2 | 78,8 | -10,4 | -11,7% | NO | [[indicadores/tasa_ocupacion_estival_pct|Ficha]] |
| `tasa_ocupacion_invernal_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Coyhaique | 32,4 | 28,4 | -4 | -12,3% | NO | [[indicadores/tasa_ocupacion_invernal_pct|Ficha]] |
| `tasa_ocupacion_invernal_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Lago Verde | 12 | 8,50 | -3,50 | -29,2% | SI | [[indicadores/tasa_ocupacion_invernal_pct|Ficha]] |
| `tasa_ocupacion_invernal_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Aysén | 28,6 | 24,6 | -4 | -14,0% | NO | [[indicadores/tasa_ocupacion_invernal_pct|Ficha]] |
| `tasa_ocupacion_invernal_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cisnes | 18,2 | 15,8 | -2,40 | -13,2% | NO | [[indicadores/tasa_ocupacion_invernal_pct|Ficha]] |
| `tasa_ocupacion_invernal_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Guaitecas | 14,5 | 11,2 | -3,30 | -22,8% | SI | [[indicadores/tasa_ocupacion_invernal_pct|Ficha]] |
| `tasa_ocupacion_invernal_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cochrane | 16 | 13,8 | -2,20 | -13,7% | NO | [[indicadores/tasa_ocupacion_invernal_pct|Ficha]] |
| `tasa_ocupacion_invernal_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | O'Higgins | 7,50 | 6,80 | -0,70 | -9,3% | NO | [[indicadores/tasa_ocupacion_invernal_pct|Ficha]] |
| `tasa_ocupacion_invernal_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Tortel | 11 | 9,20 | -1,80 | -16,4% | NO | [[indicadores/tasa_ocupacion_invernal_pct|Ficha]] |
| `tasa_ocupacion_invernal_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Chile Chico | 21 | 17,5 | -3,50 | -16,7% | NO | [[indicadores/tasa_ocupacion_invernal_pct|Ficha]] |
| `tasa_ocupacion_invernal_pct` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Río Ibáñez | 14,5 | 12,4 | -2,10 | -14,5% | NO | [[indicadores/tasa_ocupacion_invernal_pct|Ficha]] |
| `trabajadores_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Coyhaique | 33.650 | 20.950 | -12.700 | -37,7% | SI | [[indicadores/trabajadores_sii|Ficha]] |
| `trabajadores_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Lago Verde | 460 | 132 | -328 | -71,3% | SI | [[indicadores/trabajadores_sii|Ficha]] |
| `trabajadores_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Aysén | 12.780 | 9.890 | -2.890 | -22,6% | SI | [[indicadores/trabajadores_sii|Ficha]] |
| `trabajadores_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Cisnes | 3.770 | 1.920 | -1.850 | -49,1% | SI | [[indicadores/trabajadores_sii|Ficha]] |
| `trabajadores_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Guaitecas | 1.040 | 265 | -775 | -74,5% | SI | [[indicadores/trabajadores_sii|Ficha]] |
| `trabajadores_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Cochrane | 1.790 | 845 | -945 | -52,8% | SI | [[indicadores/trabajadores_sii|Ficha]] |
| `trabajadores_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | O'Higgins | 345 | 98 | -247 | -71,6% | SI | [[indicadores/trabajadores_sii|Ficha]] |
| `trabajadores_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Tortel | 295 | 80 | -215 | -72,9% | SI | [[indicadores/trabajadores_sii|Ficha]] |
| `trabajadores_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Chile Chico | 2.430 | 1.140 | -1.290 | -53,1% | SI | [[indicadores/trabajadores_sii|Ficha]] |
| `trabajadores_sii` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Río Ibáñez | 1.445 | 512 | -933 | -64,6% | SI | [[indicadores/trabajadores_sii|Ficha]] |
| `trabajadores_sii_por_centro_activo` | II. Pesca, Acuicultura y Mar (Nodo #6) | operativo (20%) | Aysén | 94,7 | 73,3 | -21,4 | -22,6% | SI | [[indicadores/trabajadores_sii_por_centro_activo|Ficha]] |
| `trabajadores_sii_por_centro_activo` | II. Pesca, Acuicultura y Mar (Nodo #6) | operativo (20%) | Cisnes | 48,3 | 24,6 | -23,7 | -49,1% | SI | [[indicadores/trabajadores_sii_por_centro_activo|Ficha]] |
| `trabajadores_sii_por_centro_activo` | II. Pesca, Acuicultura y Mar (Nodo #6) | operativo (20%) | Guaitecas | 32,5 | 8,30 | -24,2 | -74,5% | SI | [[indicadores/trabajadores_sii_por_centro_activo|Ficha]] |
| `ventas_por_empresa_uf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Coyhaique | 8.762 | 6.365 | -2.397 | -27,4% | SI | [[indicadores/ventas_por_empresa_uf|Ficha]] |
| `ventas_por_empresa_uf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Lago Verde | 5.921 | 3.814 | -2.107 | -35,6% | SI | [[indicadores/ventas_por_empresa_uf|Ficha]] |
| `ventas_por_empresa_uf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Aysén | 26.762 | 19.789 | -6.973 | -26,1% | SI | [[indicadores/ventas_por_empresa_uf|Ficha]] |
| `ventas_por_empresa_uf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Cisnes | 14.677 | 10.168 | -4.509 | -30,7% | SI | [[indicadores/ventas_por_empresa_uf|Ficha]] |
| `ventas_por_empresa_uf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Guaitecas | 14.327 | 10.124 | -4.203 | -29,3% | SI | [[indicadores/ventas_por_empresa_uf|Ficha]] |
| `ventas_por_empresa_uf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Cochrane | 14.915 | 8.943 | -5.972 | -40,0% | SI | [[indicadores/ventas_por_empresa_uf|Ficha]] |
| `ventas_por_empresa_uf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | O'Higgins | 9.298 | 5.521 | -3.777 | -40,6% | SI | [[indicadores/ventas_por_empresa_uf|Ficha]] |
| `ventas_por_empresa_uf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Tortel | 8.125 | 4.643 | -3.482 | -42,9% | SI | [[indicadores/ventas_por_empresa_uf|Ficha]] |
| `ventas_por_empresa_uf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Chile Chico | 15.750 | 9.722 | -6.028 | -38,3% | SI | [[indicadores/ventas_por_empresa_uf|Ficha]] |
| `ventas_por_empresa_uf` | V. Economía, Inversión y Suelo (Nodo #20) | operativo (20%) | Río Ibáñez | 13.445 | 7.656 | -5.789 | -43,1% | SI | [[indicadores/ventas_por_empresa_uf|Ficha]] |
| `visitantes_extranjeros_snaspe_n` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Coyhaique | 10.318 | 5.679 | -4.639 | -45,0% | SI | [[indicadores/visitantes_extranjeros_snaspe_n|Ficha]] |
| `visitantes_extranjeros_snaspe_n` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Lago Verde | 261 | 0 | -261 | -100,0% | SI | [[indicadores/visitantes_extranjeros_snaspe_n|Ficha]] |
| `visitantes_extranjeros_snaspe_n` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Aysén | 10.123 | 2.410 | -7.713 | -76,2% | SI | [[indicadores/visitantes_extranjeros_snaspe_n|Ficha]] |
| `visitantes_extranjeros_snaspe_n` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Cisnes | 26.643 | 10.632 | -16.011 | -60,1% | SI | [[indicadores/visitantes_extranjeros_snaspe_n|Ficha]] |
| `visitantes_extranjeros_snaspe_n` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Guaitecas | 432 | 0 | -432 | -100,0% | SI | [[indicadores/visitantes_extranjeros_snaspe_n|Ficha]] |
| `visitantes_extranjeros_snaspe_n` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Cochrane | 15.842 | 4.385 | -11.457 | -72,3% | SI | [[indicadores/visitantes_extranjeros_snaspe_n|Ficha]] |
| `visitantes_extranjeros_snaspe_n` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | O'Higgins | 6.820 | 0 | -6.820 | -100,0% | SI | [[indicadores/visitantes_extranjeros_snaspe_n|Ficha]] |
| `visitantes_extranjeros_snaspe_n` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Tortel | 6.106 | 0 | -6.106 | -100,0% | SI | [[indicadores/visitantes_extranjeros_snaspe_n|Ficha]] |
| `visitantes_extranjeros_snaspe_n` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Chile Chico | 13.167 | 2.541 | -10.626 | -80,7% | SI | [[indicadores/visitantes_extranjeros_snaspe_n|Ficha]] |
| `visitantes_extranjeros_snaspe_n` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Río Ibáñez | 19.680 | 7.587 | -12.093 | -61,4% | SI | [[indicadores/visitantes_extranjeros_snaspe_n|Ficha]] |
| `visitantes_snaspe` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Coyhaique | 38.500 | 21.190 | -17.310 | -45,0% | SI | [[indicadores/visitantes_snaspe|Ficha]] |
| `visitantes_snaspe` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Lago Verde | 1.800 | 0 | -1.800 | -100,0% | SI | [[indicadores/visitantes_snaspe|Ficha]] |
| `visitantes_snaspe` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Aysén | 29.600 | 7.048 | -22.552 | -76,2% | SI | [[indicadores/visitantes_snaspe|Ficha]] |
| `visitantes_snaspe` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Cisnes | 64.200 | 25.619 | -38.581 | -60,1% | SI | [[indicadores/visitantes_snaspe|Ficha]] |
| `visitantes_snaspe` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Guaitecas | 2.400 | 0 | -2.400 | -100,0% | SI | [[indicadores/visitantes_snaspe|Ficha]] |
| `visitantes_snaspe` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Cochrane | 35.600 | 9.853 | -25.747 | -72,3% | SI | [[indicadores/visitantes_snaspe|Ficha]] |
| `visitantes_snaspe` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | O'Higgins | 12.400 | 0 | -12.400 | -100,0% | SI | [[indicadores/visitantes_snaspe|Ficha]] |
| `visitantes_snaspe` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Tortel | 14.200 | 0 | -14.200 | -100,0% | SI | [[indicadores/visitantes_snaspe|Ficha]] |
| `visitantes_snaspe` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Chile Chico | 34.200 | 6.600 | -27.600 | -80,7% | SI | [[indicadores/visitantes_snaspe|Ficha]] |
| `visitantes_snaspe` | I. Turismo y Áreas Silvestres (Nodo #4) | operativo (20%) | Río Ibáñez | 41.000 | 15.807 | -25.193 | -61,4% | SI | [[indicadores/visitantes_snaspe|Ficha]] |
| `visitas_por_cama_turistica` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Coyhaique | 11,3 | 6,20 | -5,10 | -45,1% | SI | [[indicadores/visitas_por_cama_turistica|Ficha]] |
| `visitas_por_cama_turistica` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Lago Verde | 10,9 | 0 | -10,9 | -100,0% | SI | [[indicadores/visitas_por_cama_turistica|Ficha]] |
| `visitas_por_cama_turistica` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Aysén | 16 | 3,80 | -12,2 | -76,3% | SI | [[indicadores/visitas_por_cama_turistica|Ficha]] |
| `visitas_por_cama_turistica` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cisnes | 51,8 | 20,7 | -31,1 | -60,0% | SI | [[indicadores/visitas_por_cama_turistica|Ficha]] |
| `visitas_por_cama_turistica` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Guaitecas | 16,6 | 0 | -16,6 | -100,0% | SI | [[indicadores/visitas_por_cama_turistica|Ficha]] |
| `visitas_por_cama_turistica` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cochrane | 51,6 | 14,3 | -37,3 | -72,3% | SI | [[indicadores/visitas_por_cama_turistica|Ficha]] |
| `visitas_por_cama_turistica` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | O'Higgins | 51,7 | 0 | -51,7 | -100,0% | SI | [[indicadores/visitas_por_cama_turistica|Ficha]] |
| `visitas_por_cama_turistica` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Tortel | 39,4 | 0 | -39,4 | -100,0% | SI | [[indicadores/visitas_por_cama_turistica|Ficha]] |
| `visitas_por_cama_turistica` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Chile Chico | 43,8 | 8,50 | -35,3 | -80,6% | SI | [[indicadores/visitas_por_cama_turistica|Ficha]] |
| `visitas_por_cama_turistica` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Río Ibáñez | 35,7 | 13,7 | -22,0 | -61,6% | SI | [[indicadores/visitas_por_cama_turistica|Ficha]] |
| `visitas_por_pernoctacion_ratio` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Coyhaique | 0,18 | 0,15 | -0,03 | -16,7% | NO | [[indicadores/visitas_por_pernoctacion_ratio|Ficha]] |
| `visitas_por_pernoctacion_ratio` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Lago Verde | 0,26 | 0 | -0,26 | -100,0% | SI | [[indicadores/visitas_por_pernoctacion_ratio|Ficha]] |
| `visitas_por_pernoctacion_ratio` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Aysén | 0,30 | 0,12 | -0,18 | -60,0% | SI | [[indicadores/visitas_por_pernoctacion_ratio|Ficha]] |
| `visitas_por_pernoctacion_ratio` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cisnes | 0,87 | 0,57 | -0,30 | -34,5% | SI | [[indicadores/visitas_por_pernoctacion_ratio|Ficha]] |
| `visitas_por_pernoctacion_ratio` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Guaitecas | 0,44 | 0 | -0,44 | -100,0% | SI | [[indicadores/visitas_por_pernoctacion_ratio|Ficha]] |
| `visitas_por_pernoctacion_ratio` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Cochrane | 0,72 | 0,43 | -0,29 | -40,3% | SI | [[indicadores/visitas_por_pernoctacion_ratio|Ficha]] |
| `visitas_por_pernoctacion_ratio` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | O'Higgins | 0,76 | 0 | -0,76 | -100,0% | SI | [[indicadores/visitas_por_pernoctacion_ratio|Ficha]] |
| `visitas_por_pernoctacion_ratio` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Tortel | 0,53 | 0 | -0,53 | -100,0% | SI | [[indicadores/visitas_por_pernoctacion_ratio|Ficha]] |
| `visitas_por_pernoctacion_ratio` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Chile Chico | 0,58 | 0,25 | -0,33 | -56,9% | SI | [[indicadores/visitas_por_pernoctacion_ratio|Ficha]] |
| `visitas_por_pernoctacion_ratio` | I. Turismo y Áreas Silvestres (Nodo #3) | operativo (20%) | Río Ibáñez | 0,48 | 0,31 | -0,17 | -35,4% | SI | [[indicadores/visitas_por_pernoctacion_ratio|Ficha]] |
| `zoit_nombre` | I. Turismo y Áreas Silvestres (Nodo #2) | operativo (20%) | Coyhaique | Sin declaratoria ZOIT vigente (Coyhaique opera como hub regional de servicios sin decreto ZOIT) | Sin declaratoria ZOIT (Destino Priorizado SERNATUR Coyhaique - Puerto Aysén) | N/D | N/A (desde 0) | NO | [[indicadores/zoit_nombre|Ficha]] |
| `zoit_nombre` | I. Turismo y Áreas Silvestres (Nodo #2) | operativo (20%) | Aysén | ZOIT Aysén Patagonia Queulat (Sector Sur) | Sin declaratoria ZOIT (Destino Priorizado SERNATUR Coyhaique - Puerto Aysén y Portal Marítimo PN Laguna San Rafael) | N/D | N/A (desde 0) | NO | [[indicadores/zoit_nombre|Ficha]] |

### 3.2 Indicadores Agregados (15)

| Indicador | Tipo | Hub | Comunas con valor != 0 | En léxico oficial | Respaldo |
|---|---|---|---|---|---|
| `alojamientos_turisticos_rnpst_n` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/alojamientos_turisticos_rnpst_n|Ficha]] |
| `empleo_act_turismo_n` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/empleo_act_turismo_n|Ficha]] |
| `empresas_act_turismo_sii_n` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/empresas_act_turismo_sii_n|Ficha]] |
| `estadia_regional_viaje_dias` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/estadia_regional_viaje_dias|Ficha]] |
| `guias_turismo_rnpst_n` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/guias_turismo_rnpst_n|Ficha]] |
| `llegadas_por_cama_turistica` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/llegadas_por_cama_turistica|Ficha]] |
| `llegadas_turistas_emat_n` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/llegadas_turistas_emat_n|Ficha]] |
| `operadores_aventura_rnpst_n` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/operadores_aventura_rnpst_n|Ficha]] |
| `prestadores_vigencia_patente_pct` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/prestadores_vigencia_patente_pct|Ficha]] |
| `restaurantes_turisticos_rnpst_n` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/restaurantes_turisticos_rnpst_n|Ficha]] |
| `revpar_emat_clp` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/revpar_emat_clp|Ficha]] |
| `tarifa_adr_emat_clp` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/tarifa_adr_emat_clp|Ficha]] |
| `tasa_ocupacion_emat_estival_pct` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/tasa_ocupacion_emat_estival_pct|Ficha]] |
| `ventas_act_turismo_uf` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/ventas_act_turismo_uf|Ficha]] |
| `visitantes_atractivos_totales_n` | numeric | I. Turismo y Áreas Silvestres | 10 / 10 | SI | [[indicadores/visitantes_atractivos_totales_n|Ficha]] |

## 4. Qué Quedó Igual (Resumen por 10 Hubs Canónicos)

**196 indicadores comunales** mantuvieron valores idénticos en las 10 comunas de Aysén. No se generan fichas individuales vacías para evitar ruido en el grafo de Obsidian.

| Hub Canónico | Indicadores sin cambios |
|---|---|
| I. Turismo y Áreas Silvestres | 4 |
| II. Pesca, Acuicultura y Mar | 22 |
| III. Energía y Telecomunicaciones | 22 |
| IV. Gobernanza y Finanzas | 43 |
| IX. Cultura y Patrimonio | 15 |
| V. Economía, Inversión y Suelo | 16 |
| VI. Demografía, Educación y Sociedad | 30 |
| VII. Biodiversidad, Clima y Riesgos | 15 |
| VIII. Salud | 15 |
| X. CTCi e Innovación | 14 |

## 5. Cobertura Extendida (Barrios ACS, Holdings, Padrón SUBPESCA y Series Anuales)

| Ámbito Estructural | Series/Métricas Actuales | Modificadas | Agregadas | Eliminadas | Sin cambios |
|---|---|---|---|---|---|
| Barrios ACS (N=18) | 8 | 0 | 0 | 0 | 8 |
| Unidades SNASPE (N=19) | 6 | 0 | 6 | 0 | 0 |
| Holdings Salmoneros (N=13) | 7 | 0 | 0 | 0 | 7 |
| Invariantes Padrón SUBPESCA | 5 | 0 | 0 | 0 | 5 |
| Series Anuales (Último Corte) | 64 | 11 | 8 | 0 | 45 |

### Cambios Detectados en Ámbitos Extendidos

| Ámbito | Métrica | Entidad / Periodo | Estado | Anterior | Actual | Outlier |
|---|---|---|---|---|---|---|
| Unidades SNASPE (N=19) | `snaspe_concesiones_salmon_dentro_n` | múltiples | agregada | N/D | 19 registros | NO |
| Unidades SNASPE (N=19) | `snaspe_guardaparques_permanentes_n` | múltiples | agregada | N/D | 19 registros | NO |
| Unidades SNASPE (N=19) | `snaspe_inversion_pdze_mclp` | múltiples | agregada | N/D | 19 registros | NO |
| Unidades SNASPE (N=19) | `snaspe_superficie_ha` | múltiples | agregada | N/D | 19 registros | NO |
| Unidades SNASPE (N=19) | `snaspe_superficie_salmon_ha` | múltiples | agregada | N/D | 19 registros | NO |
| Unidades SNASPE (N=19) | `snaspe_visitantes_anuales_n` | múltiples | agregada | N/D | 19 registros | NO |
| Series Anuales (Último Corte) | `serie_balmaceda_pasajeros_jac__capacidad_anual_pax` | múltiples | agregada | N/D | 1 registros | NO |
| Series Anuales (Último Corte) | `serie_balmaceda_pasajeros_jac__nuevo_terminal_m2` | múltiples | agregada | N/D | 1 registros | NO |
| Series Anuales (Último Corte) | `serie_balmaceda_pasajeros_jac__parcial_ene_may_2026` | múltiples | agregada | N/D | 1 registros | NO |
| Series Anuales (Último Corte) | `serie_balmaceda_pasajeros_jac__pasajeros` | 2026 | modificada | 682.000 | 620.000 | NO |
| Series Anuales (Último Corte) | `serie_balmaceda_pasajeros_jac__puentes_embarque` | múltiples | agregada | N/D | 1 registros | NO |
| Series Anuales (Último Corte) | `serie_emporcha_cruceros__caleta_tortel_pasajeros` | múltiples | agregada | N/D | 1 registros | NO |
| Series Anuales (Último Corte) | `serie_emporcha_cruceros__caleta_tortel_recaladas` | múltiples | agregada | N/D | 1 registros | NO |
| Series Anuales (Último Corte) | `serie_emporcha_cruceros__pasajeros_cruceros` | ultimo | modificada | 28.500 | 22.093 | SI |
| Series Anuales (Último Corte) | `serie_emporcha_cruceros__puerto_chacabuco_pasajeros` | múltiples | agregada | N/D | 1 registros | NO |
| Series Anuales (Último Corte) | `serie_emporcha_cruceros__puerto_chacabuco_recaladas` | múltiples | agregada | N/D | 1 registros | NO |
| Series Anuales (Último Corte) | `serie_emporcha_cruceros__recaladas_cruceros` | ultimo | modificada | 28 | 29 | NO |
| Series Anuales (Último Corte) | `serie_emporcha_cruceros__tripulantes` | ultimo | modificada | 12.400 | 9.850 | SI |
| Series Anuales (Último Corte) | `serie_snaspe_por_parque_anual__otras_unidades` | 2026 | modificada | 116.100 | 24.238 | SI |
| Series Anuales (Último Corte) | `serie_snaspe_por_parque_anual__pernoctaciones_emat` | 2026 | modificada | 472.000 | 364.039 | SI |
| Series Anuales (Último Corte) | `serie_snaspe_por_parque_anual__pn_cerro_castillo` | 2026 | modificada | 37.200 | 13.907 | SI |
| Series Anuales (Último Corte) | `serie_snaspe_por_parque_anual__pn_laguna_san_rafael` | 2026 | modificada | 39.800 | 5.900 | SI |
| Series Anuales (Último Corte) | `serie_snaspe_por_parque_anual__pn_patagonia` | 2026 | modificada | 32.400 | 16.453 | SI |
| Series Anuales (Último Corte) | `serie_snaspe_por_parque_anual__pn_queulat` | 2026 | modificada | 58.500 | 25.619 | SI |
| Series Anuales (Último Corte) | `serie_snaspe_por_parque_anual__visitantes_snaspe_total` | 2026 | modificada | 284.000 | 86.117 | SI |

## 6. Detalle de Conectores en `curated_fallback`

| Conector | Modo | HTTP | Nodos | Motivo registrado |
|---|---|---|---|---|
| `cne_combustibles` | `curated_fallback` | N/A | #13 | CKAN package_search no respondio 200 (URLError: <urlopen error [Errno -2] Name or service not known>) |
| `cne_energia` | `curated_fallback` | N/A | #11 | CKAN package_search no respondio 200 (URLError: <urlopen error [Errno -2] Name or service not known>) |
| `subpesca` | `curated_fallback` | 404 | #6 | 2 candidato(s) fallaron: sin respuesta / 404 |
| `bbnn` | `curated_fallback` | N/A | #22 | 2 candidato(s) fallaron: sin respuesta / sin respuesta |
| `conaf` | `curated_fallback` | N/A | #27 | 2 candidato(s) fallaron: 404 / sin respuesta |
| `sinca` | `curated_fallback` | 403 | #30 | SINCA no respondio 200 (HTTP 403 Forbidden) |

