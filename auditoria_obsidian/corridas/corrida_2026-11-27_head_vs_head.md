---
id: auditoria_corrida_2026-11-27_head_vs_head
title: "Auditoría de Corrida — 2026-11-27 (HEAD vs HEAD)"
type: auditoria_corrida
fecha: "2026-11-27"
baseline: "HEAD"
actual: "HEAD"
semaforo: "ROJO"
total_indicadores: 249
modificados: 10
agregados: 1
eliminados: 0
sin_cambios: 238
alertas_alta: 10
alertas_media: 1
conectores_live_api: 5
conectores_fallback: 7
etapas_restauradas: 1
umbral_outlier_operativo_pct: 20
umbral_outlier_estructural_pct: 5
estado_revision_humana: "aprobada"
fecha_aprobacion_humana: "2026-11-27T19:11:45.294Z"
tags:
  - aysen-sistemico
  - auditoria-indicadores
  - semaforo-rojo
---

# Auditoría de Corrida de Indicadores — 2026-11-27

Comparación determinista: `HEAD` -> `HEAD` · Semáforo de revisión: **ROJO**.
Índice maestro: [[index_auditoria|Índice de Auditoría de Indicadores]].

## 1. Revisión Rápida (5 Minutos)

| Dimensión de Control | Resultado | Señal |
|---|---|---|
| Indicadores comunales evaluados | 249 actuales (248 en baseline) | 10 modificados · 1 agregados · 0 eliminados · 238 sin cambios |
| Umbrales de salto brusco | Estructural >= 5% · Operativo >= 20% | + transiciones 0/nulo y cambios de signo |
| Alertas para revisión humana | 11 (10 ALTA · 1 MEDIA) | Requiere cierre humano antes de merge a `main` si semáforo != VERDE |
| Salud de conectores automáticos | 5 live_api · 7 curated_fallback | 1 etapa(s) restaurada(s) · Última corrida API: `2026-11-02T12:13:30+00:00` |

### Checklist de Cierre Humano
- [ ] Revisar logs de GitHub Actions (`actualizacion_mensual.yml` / `verificacion.yml`) sin errores bloqueantes.
- [ ] Confirmar cobertura esperada de indicadores y conectores en `curated_fallback`.
- [ ] Validar cada outlier o variable nueva listada en la Sección 2 antes de aprobar el PR.
- [ ] Ejecutar `node scripts/obsidian_indicator_audit.cjs --approve-latest --sync-to-vault` para aprobar y fijar el nuevo baseline.

## 2. Qué Requiere Verificación Humana

- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/aeroevacuaciones_samu_n|aeroevacuaciones_samu_n]] (VIII. Salud): Coyhaique: 0 -> 12 (Transición desde 0 a 12)
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/camas_hospitalarias|camas_hospitalarias]] (VIII. Salud): Coyhaique: 167 -> 135 (Variación de -19,2% (umbral estructural >= 5%)); Aysén: 52 -> 56 (Variación de +7,7% (umbral estructural >= 5%)); Cisnes: 12 -> 8 (Variación de -33,3% (umbral estructural >= 5%)); Cochrane: 16 -> 7 (Variación de -56,3% (umbral estructural >= 5%)); Chile Chico: 14 -> 7 (Variación de -50,0% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/espera_no_ges_n|espera_no_ges_n]] (VIII. Salud): Coyhaique: 5.420 -> 8.120 (Variación de +49,8% (umbral operativo >= 20%)); Aysén: 2.450 -> 3.465 (Variación de +41,4% (umbral operativo >= 20%)); Guaitecas: 410 -> 268 (Variación de -34,6% (umbral operativo >= 20%)); Cochrane: 460 -> 617 (Variación de +34,1% (umbral operativo >= 20%)); Tortel: 112 -> 88 (Variación de -21,4% (umbral operativo >= 20%)); Chile Chico: 520 -> 682 (Variación de +31,2% (umbral operativo >= 20%)); Río Ibáñez: 280 -> 422 (Variación de +50,7% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/establecimientos_aps_n|establecimientos_aps_n]] (VIII. Salud): Coyhaique: 13 -> 12 (Variación de -7,7% (umbral estructural >= 5%)); Lago Verde: 5 -> 3 (Variación de -40,0% (umbral estructural >= 5%)); Aysén: 7 -> 6 (Variación de -14,3% (umbral estructural >= 5%)); Guaitecas: 3 -> 2 (Variación de -33,3% (umbral estructural >= 5%)); Cochrane: 3 -> 0 (Caída a 0 desde 3); O'Higgins: 3 -> 1 (Variación de -66,7% (umbral estructural >= 5%)); Tortel: 3 -> 1 (Variación de -66,7% (umbral estructural >= 5%)); Chile Chico: 4 -> 5 (Variación de +25,0% (umbral estructural >= 5%)); Río Ibáñez: 5 -> 7 (Variación de +40,0% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/mediana_espera_especialidad_dias|mediana_espera_especialidad_dias]] (VIII. Salud): Coyhaique: 218 -> 124 (Variación de -43,1% (umbral operativo >= 20%)); Lago Verde: 334 -> 186 (Variación de -44,3% (umbral operativo >= 20%)); Aysén: 242 -> 138 (Variación de -43,0% (umbral operativo >= 20%)); Cisnes: 274 -> 162 (Variación de -40,9% (umbral operativo >= 20%)); Guaitecas: 346 -> 194 (Variación de -43,9% (umbral operativo >= 20%)); Cochrane: 269 -> 146 (Variación de -45,7% (umbral operativo >= 20%)); O'Higgins: 305 -> 172 (Variación de -43,6% (umbral operativo >= 20%)); Tortel: 288 -> 148 (Variación de -48,6% (umbral operativo >= 20%)); Chile Chico: 262 -> 152 (Variación de -42,0% (umbral operativo >= 20%)); Río Ibáñez: 302 -> 168 (Variación de -44,4% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/mediana_espera_quirurgica_dias|mediana_espera_quirurgica_dias]] (VIII. Salud): Coyhaique: 318 -> 218 (Variación de -31,4% (umbral operativo >= 20%)); Lago Verde: 418 -> 284 (Variación de -32,1% (umbral operativo >= 20%)); Aysén: 354 -> 234 (Variación de -33,9% (umbral operativo >= 20%)); Cisnes: 412 -> 268 (Variación de -35,0% (umbral operativo >= 20%)); Guaitecas: 468 -> 312 (Variación de -33,3% (umbral operativo >= 20%)); Cochrane: 368 -> 242 (Variación de -34,2% (umbral operativo >= 20%)); O'Higgins: 436 -> 280 (Variación de -35,8% (umbral operativo >= 20%)); Tortel: 388 -> 258 (Variación de -33,5% (umbral operativo >= 20%)); Chile Chico: 364 -> 248 (Variación de -31,9% (umbral operativo >= 20%)); Río Ibáñez: 424 -> 276 (Variación de -34,9% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/postas_salud_rural|postas_salud_rural]] (VIII. Salud): Aysén: 4 -> 2 (Variación de -50,0% (umbral estructural >= 5%)); Cochrane: 1 -> 0 (Caída a 0 desde 1); Chile Chico: 2 -> 3 (Variación de +50,0% (umbral estructural >= 5%)); Río Ibáñez: 3 -> 5 (Variación de +66,7% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/tasa_mortalidad_cancer_vesicula_100k|tasa_mortalidad_cancer_vesicula_100k]] (VIII. Salud): Coyhaique: 10,8 -> 15,8 (Variación de +46,3% (umbral operativo >= 20%)); Lago Verde: 14,9 -> 21,4 (Variación de +43,6% (umbral operativo >= 20%)); Aysén: 12,1 -> 17,6 (Variación de +45,5% (umbral operativo >= 20%)); Cisnes: 12,4 -> 18,1 (Variación de +46,0% (umbral operativo >= 20%)); Guaitecas: 13,5 -> 19,5 (Variación de +44,4% (umbral operativo >= 20%)); Cochrane: 11,8 -> 17,2 (Variación de +45,8% (umbral operativo >= 20%)); O'Higgins: 11,6 -> 16,9 (Variación de +45,7% (umbral operativo >= 20%)); Tortel: 11,5 -> 16,6 (Variación de +44,3% (umbral operativo >= 20%)); Chile Chico: 13,2 -> 19,2 (Variación de +45,5% (umbral operativo >= 20%)); Río Ibáñez: 14,2 -> 20,6 (Variación de +45,1% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/tasa_mortalidad_suicidio_100k|tasa_mortalidad_suicidio_100k]] (VIII. Salud): Coyhaique: 13,4 -> 17,8 (Variación de +32,8% (umbral operativo >= 20%)); Lago Verde: 17,8 -> 23,4 (Variación de +31,5% (umbral operativo >= 20%)); Aysén: 15,6 -> 20,6 (Variación de +32,1% (umbral operativo >= 20%)); Cisnes: 14,8 -> 19,5 (Variación de +31,8% (umbral operativo >= 20%)); Guaitecas: 16,2 -> 21,3 (Variación de +31,5% (umbral operativo >= 20%)); Cochrane: 13,9 -> 18,3 (Variación de +31,7% (umbral operativo >= 20%)); O'Higgins: 14,2 -> 18,7 (Variación de +31,7% (umbral operativo >= 20%)); Tortel: 13,8 -> 18,2 (Variación de +31,9% (umbral operativo >= 20%)); Chile Chico: 14,5 -> 19,1 (Variación de +31,7% (umbral operativo >= 20%)); Río Ibáñez: 16,8 -> 22,1 (Variación de +31,5% (umbral operativo >= 20%))
- [ ] **[ALTA · ETAPA_RESTAURADA]** `pipeline_ingesta` (Infraestructura / Ingesta): 1 etapa(s) fueron restauradas por Circuit Breaker (Last-Known-Good) en la última corrida automática (2026-11-02T12:13:30+00:00).
- [ ] **[MEDIA · CONECTOR_FALLBACK]** `pipeline_ingesta` (Infraestructura / Ingesta): 7 conector(es) operaron en curated_fallback: cne_combustibles, cne_energia, subpesca, bbnn, conaf, sinca, dga_hidrologia. Los datos previos se conservaron, pero conviene verificar si hubo actualización oficial pendiente.

## 3. Qué Cambió en esta Corrida (Indicadores Comunales)

### 3.1 Indicadores Modificados (10)

| Indicador | Hub / Nodo | Nivel Umbral | Comuna | Anterior | Actual | Delta | Delta % | Outlier | Respaldo |
|---|---|---|---|---|---|---|---|---|---|
| `aeroevacuaciones_samu_n` | VIII. Salud (Nodo #24) | operativo (20%) | Coyhaique | 0 | 12 | 12 | N/A (desde 0) | SI | [[indicadores/aeroevacuaciones_samu_n|Ficha]] |
| `camas_hospitalarias` | VIII. Salud (Nodo #24) | estructural (5%) | Coyhaique | 167 | 135 | -32 | -19,2% | SI | [[indicadores/camas_hospitalarias|Ficha]] |
| `camas_hospitalarias` | VIII. Salud (Nodo #24) | estructural (5%) | Aysén | 52 | 56 | 4 | +7,7% | SI | [[indicadores/camas_hospitalarias|Ficha]] |
| `camas_hospitalarias` | VIII. Salud (Nodo #24) | estructural (5%) | Cisnes | 12 | 8 | -4 | -33,3% | SI | [[indicadores/camas_hospitalarias|Ficha]] |
| `camas_hospitalarias` | VIII. Salud (Nodo #24) | estructural (5%) | Cochrane | 16 | 7 | -9 | -56,3% | SI | [[indicadores/camas_hospitalarias|Ficha]] |
| `camas_hospitalarias` | VIII. Salud (Nodo #24) | estructural (5%) | Chile Chico | 14 | 7 | -7 | -50,0% | SI | [[indicadores/camas_hospitalarias|Ficha]] |
| `espera_no_ges_n` | VIII. Salud (Nodo #24) | operativo (20%) | Coyhaique | 5.420 | 8.120 | 2.700 | +49,8% | SI | [[indicadores/espera_no_ges_n|Ficha]] |
| `espera_no_ges_n` | VIII. Salud (Nodo #24) | operativo (20%) | Lago Verde | 128 | 148 | 20 | +15,6% | NO | [[indicadores/espera_no_ges_n|Ficha]] |
| `espera_no_ges_n` | VIII. Salud (Nodo #24) | operativo (20%) | Aysén | 2.450 | 3.465 | 1.015 | +41,4% | SI | [[indicadores/espera_no_ges_n|Ficha]] |
| `espera_no_ges_n` | VIII. Salud (Nodo #24) | operativo (20%) | Cisnes | 890 | 835 | -55 | -6,2% | NO | [[indicadores/espera_no_ges_n|Ficha]] |
| `espera_no_ges_n` | VIII. Salud (Nodo #24) | operativo (20%) | Guaitecas | 410 | 268 | -142 | -34,6% | SI | [[indicadores/espera_no_ges_n|Ficha]] |
| `espera_no_ges_n` | VIII. Salud (Nodo #24) | operativo (20%) | Cochrane | 460 | 617 | 157 | +34,1% | SI | [[indicadores/espera_no_ges_n|Ficha]] |
| `espera_no_ges_n` | VIII. Salud (Nodo #24) | operativo (20%) | O'Higgins | 96 | 106 | 10 | +10,4% | NO | [[indicadores/espera_no_ges_n|Ficha]] |
| `espera_no_ges_n` | VIII. Salud (Nodo #24) | operativo (20%) | Tortel | 112 | 88 | -24 | -21,4% | SI | [[indicadores/espera_no_ges_n|Ficha]] |
| `espera_no_ges_n` | VIII. Salud (Nodo #24) | operativo (20%) | Chile Chico | 520 | 682 | 162 | +31,2% | SI | [[indicadores/espera_no_ges_n|Ficha]] |
| `espera_no_ges_n` | VIII. Salud (Nodo #24) | operativo (20%) | Río Ibáñez | 280 | 422 | 142 | +50,7% | SI | [[indicadores/espera_no_ges_n|Ficha]] |
| `establecimientos_aps_n` | VIII. Salud (Nodo #38) | estructural (5%) | Coyhaique | 13 | 12 | -1 | -7,7% | SI | [[indicadores/establecimientos_aps_n|Ficha]] |
| `establecimientos_aps_n` | VIII. Salud (Nodo #38) | estructural (5%) | Lago Verde | 5 | 3 | -2 | -40,0% | SI | [[indicadores/establecimientos_aps_n|Ficha]] |
| `establecimientos_aps_n` | VIII. Salud (Nodo #38) | estructural (5%) | Aysén | 7 | 6 | -1 | -14,3% | SI | [[indicadores/establecimientos_aps_n|Ficha]] |
| `establecimientos_aps_n` | VIII. Salud (Nodo #38) | estructural (5%) | Guaitecas | 3 | 2 | -1 | -33,3% | SI | [[indicadores/establecimientos_aps_n|Ficha]] |
| `establecimientos_aps_n` | VIII. Salud (Nodo #38) | estructural (5%) | Cochrane | 3 | 0 | -3 | -100,0% | SI | [[indicadores/establecimientos_aps_n|Ficha]] |
| `establecimientos_aps_n` | VIII. Salud (Nodo #38) | estructural (5%) | O'Higgins | 3 | 1 | -2 | -66,7% | SI | [[indicadores/establecimientos_aps_n|Ficha]] |
| `establecimientos_aps_n` | VIII. Salud (Nodo #38) | estructural (5%) | Tortel | 3 | 1 | -2 | -66,7% | SI | [[indicadores/establecimientos_aps_n|Ficha]] |
| `establecimientos_aps_n` | VIII. Salud (Nodo #38) | estructural (5%) | Chile Chico | 4 | 5 | 1 | +25,0% | SI | [[indicadores/establecimientos_aps_n|Ficha]] |
| `establecimientos_aps_n` | VIII. Salud (Nodo #38) | estructural (5%) | Río Ibáñez | 5 | 7 | 2 | +40,0% | SI | [[indicadores/establecimientos_aps_n|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Coyhaique | 218 | 124 | -94 | -43,1% | SI | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Lago Verde | 334 | 186 | -148 | -44,3% | SI | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Aysén | 242 | 138 | -104 | -43,0% | SI | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Cisnes | 274 | 162 | -112 | -40,9% | SI | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Guaitecas | 346 | 194 | -152 | -43,9% | SI | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Cochrane | 269 | 146 | -123 | -45,7% | SI | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | O'Higgins | 305 | 172 | -133 | -43,6% | SI | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Tortel | 288 | 148 | -140 | -48,6% | SI | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Chile Chico | 262 | 152 | -110 | -42,0% | SI | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_especialidad_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Río Ibáñez | 302 | 168 | -134 | -44,4% | SI | [[indicadores/mediana_espera_especialidad_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Coyhaique | 318 | 218 | -100 | -31,4% | SI | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Lago Verde | 418 | 284 | -134 | -32,1% | SI | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Aysén | 354 | 234 | -120 | -33,9% | SI | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Cisnes | 412 | 268 | -144 | -35,0% | SI | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Guaitecas | 468 | 312 | -156 | -33,3% | SI | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Cochrane | 368 | 242 | -126 | -34,2% | SI | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | O'Higgins | 436 | 280 | -156 | -35,8% | SI | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Tortel | 388 | 258 | -130 | -33,5% | SI | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Chile Chico | 364 | 248 | -116 | -31,9% | SI | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `mediana_espera_quirurgica_dias` | VIII. Salud (Nodo #38) | operativo (20%) | Río Ibáñez | 424 | 276 | -148 | -34,9% | SI | [[indicadores/mediana_espera_quirurgica_dias|Ficha]] |
| `postas_salud_rural` | VIII. Salud (Nodo #38) | estructural (5%) | Aysén | 4 | 2 | -2 | -50,0% | SI | [[indicadores/postas_salud_rural|Ficha]] |
| `postas_salud_rural` | VIII. Salud (Nodo #38) | estructural (5%) | Cochrane | 1 | 0 | -1 | -100,0% | SI | [[indicadores/postas_salud_rural|Ficha]] |
| `postas_salud_rural` | VIII. Salud (Nodo #38) | estructural (5%) | Chile Chico | 2 | 3 | 1 | +50,0% | SI | [[indicadores/postas_salud_rural|Ficha]] |
| `postas_salud_rural` | VIII. Salud (Nodo #38) | estructural (5%) | Río Ibáñez | 3 | 5 | 2 | +66,7% | SI | [[indicadores/postas_salud_rural|Ficha]] |
| `salud_principal` | VIII. Salud (Nodo #24) | operativo (20%) | Lago Verde | Sin hospital en la comuna (Atencion Primaria Rural) | Sin hospital en la comuna (3 PSR dependientes del DAP SSA) | N/D | N/A (desde 0) | NO | [[indicadores/salud_principal|Ficha]] |
| `salud_principal` | VIII. Salud (Nodo #24) | operativo (20%) | Guaitecas | Sin hospital en el archipielago (Cobertura por CESFAM Melinka) | Sin hospital en el archipielago (Posta de Salud Rural Melinka con SUR, DEIS SSA) | N/D | N/A (desde 0) | NO | [[indicadores/salud_principal|Ficha]] |
| `salud_principal` | VIII. Salud (Nodo #24) | operativo (20%) | Cochrane | Hospital Comunitario de Cochrane (Hospital Lord Cochrane) | Hospital Lord Cochrane | N/D | N/A (desde 0) | NO | [[indicadores/salud_principal|Ficha]] |
| `salud_principal` | VIII. Salud (Nodo #24) | operativo (20%) | O'Higgins | Sin hospital en la comuna (Posta Rural de Aislamiento Extremo) | Sin hospital en la comuna (PSR Villa O'Higgins con 2 medicos EDF permanentes jun-2026) | N/D | N/A (desde 0) | NO | [[indicadores/salud_principal|Ficha]] |
| `salud_principal` | VIII. Salud (Nodo #24) | operativo (20%) | Tortel | Sin hospital en la comuna (Posta Rural de Dificil Acceso en Pasarelas) | Sin hospital en la comuna (PSR Caleta Tortel en pasarelas de cipres) | N/D | N/A (desde 0) | NO | [[indicadores/salud_principal|Ficha]] |
| `salud_principal` | VIII. Salud (Nodo #24) | operativo (20%) | Chile Chico | Hospital Familiar y Comunitario San Jose / Dr. Leopoldo Ortega Rodriguez de Chile Chico | Hospital Dr. Leopoldo Ortega Rodriguez de Chile Chico | N/D | N/A (desde 0) | NO | [[indicadores/salud_principal|Ficha]] |
| `salud_principal` | VIII. Salud (Nodo #24) | operativo (20%) | Río Ibáñez | Sin hospital en la comuna (Atencion Primaria con CESFAM y Postas) | Sin hospital en la comuna (5 PSR y 2 EMR dependientes del DAP SSA) | N/D | N/A (desde 0) | NO | [[indicadores/salud_principal|Ficha]] |
| `tasa_mortalidad_cancer_vesicula_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Coyhaique | 10,8 | 15,8 | 5 | +46,3% | SI | [[indicadores/tasa_mortalidad_cancer_vesicula_100k|Ficha]] |
| `tasa_mortalidad_cancer_vesicula_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Lago Verde | 14,9 | 21,4 | 6,50 | +43,6% | SI | [[indicadores/tasa_mortalidad_cancer_vesicula_100k|Ficha]] |
| `tasa_mortalidad_cancer_vesicula_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Aysén | 12,1 | 17,6 | 5,50 | +45,5% | SI | [[indicadores/tasa_mortalidad_cancer_vesicula_100k|Ficha]] |
| `tasa_mortalidad_cancer_vesicula_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Cisnes | 12,4 | 18,1 | 5,70 | +46,0% | SI | [[indicadores/tasa_mortalidad_cancer_vesicula_100k|Ficha]] |
| `tasa_mortalidad_cancer_vesicula_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Guaitecas | 13,5 | 19,5 | 6 | +44,4% | SI | [[indicadores/tasa_mortalidad_cancer_vesicula_100k|Ficha]] |
| `tasa_mortalidad_cancer_vesicula_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Cochrane | 11,8 | 17,2 | 5,40 | +45,8% | SI | [[indicadores/tasa_mortalidad_cancer_vesicula_100k|Ficha]] |
| `tasa_mortalidad_cancer_vesicula_100k` | VIII. Salud (Nodo #38) | operativo (20%) | O'Higgins | 11,6 | 16,9 | 5,30 | +45,7% | SI | [[indicadores/tasa_mortalidad_cancer_vesicula_100k|Ficha]] |
| `tasa_mortalidad_cancer_vesicula_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Tortel | 11,5 | 16,6 | 5,10 | +44,3% | SI | [[indicadores/tasa_mortalidad_cancer_vesicula_100k|Ficha]] |
| `tasa_mortalidad_cancer_vesicula_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Chile Chico | 13,2 | 19,2 | 6 | +45,5% | SI | [[indicadores/tasa_mortalidad_cancer_vesicula_100k|Ficha]] |
| `tasa_mortalidad_cancer_vesicula_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Río Ibáñez | 14,2 | 20,6 | 6,40 | +45,1% | SI | [[indicadores/tasa_mortalidad_cancer_vesicula_100k|Ficha]] |
| `tasa_mortalidad_suicidio_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Coyhaique | 13,4 | 17,8 | 4,40 | +32,8% | SI | [[indicadores/tasa_mortalidad_suicidio_100k|Ficha]] |
| `tasa_mortalidad_suicidio_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Lago Verde | 17,8 | 23,4 | 5,60 | +31,5% | SI | [[indicadores/tasa_mortalidad_suicidio_100k|Ficha]] |
| `tasa_mortalidad_suicidio_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Aysén | 15,6 | 20,6 | 5,00 | +32,1% | SI | [[indicadores/tasa_mortalidad_suicidio_100k|Ficha]] |
| `tasa_mortalidad_suicidio_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Cisnes | 14,8 | 19,5 | 4,70 | +31,8% | SI | [[indicadores/tasa_mortalidad_suicidio_100k|Ficha]] |
| `tasa_mortalidad_suicidio_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Guaitecas | 16,2 | 21,3 | 5,10 | +31,5% | SI | [[indicadores/tasa_mortalidad_suicidio_100k|Ficha]] |
| `tasa_mortalidad_suicidio_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Cochrane | 13,9 | 18,3 | 4,40 | +31,7% | SI | [[indicadores/tasa_mortalidad_suicidio_100k|Ficha]] |
| `tasa_mortalidad_suicidio_100k` | VIII. Salud (Nodo #38) | operativo (20%) | O'Higgins | 14,2 | 18,7 | 4,50 | +31,7% | SI | [[indicadores/tasa_mortalidad_suicidio_100k|Ficha]] |
| `tasa_mortalidad_suicidio_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Tortel | 13,8 | 18,2 | 4,40 | +31,9% | SI | [[indicadores/tasa_mortalidad_suicidio_100k|Ficha]] |
| `tasa_mortalidad_suicidio_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Chile Chico | 14,5 | 19,1 | 4,60 | +31,7% | SI | [[indicadores/tasa_mortalidad_suicidio_100k|Ficha]] |
| `tasa_mortalidad_suicidio_100k` | VIII. Salud (Nodo #38) | operativo (20%) | Río Ibáñez | 16,8 | 22,1 | 5,30 | +31,5% | SI | [[indicadores/tasa_mortalidad_suicidio_100k|Ficha]] |

### 3.2 Indicadores Agregados (1)

| Indicador | Tipo | Hub | Comunas con valor != 0 | En léxico oficial | Respaldo |
|---|---|---|---|---|---|
| `aeroevacuaciones_secundarias_interregionales_n` | numeric | VIII. Salud | 1 / 10 | SI | [[indicadores/aeroevacuaciones_secundarias_interregionales_n|Ficha]] |

## 4. Qué Quedó Igual (Resumen por 10 Hubs Canónicos)

**238 indicadores comunales** mantuvieron valores idénticos en las 10 comunas de Aysén. No se generan fichas individuales vacías para evitar ruido en el grafo de Obsidian.

| Hub Canónico | Indicadores sin cambios |
|---|---|
| I. Turismo y Áreas Silvestres | 31 |
| II. Pesca, Acuicultura y Mar | 23 |
| III. Energía y Telecomunicaciones | 28 |
| IV. Gobernanza y Finanzas | 45 |
| IX. Cultura y Patrimonio | 15 |
| V. Economía, Inversión y Suelo | 21 |
| VI. Demografía, Educación y Sociedad | 36 |
| VII. Biodiversidad, Clima y Riesgos | 16 |
| VIII. Salud | 9 |
| X. CTCi e Innovación | 14 |

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
| `dga_hidrologia` | `curated_fallback` | N/A | #30 | Esperando primera ejecucion mensual programada (climatologia DGA verificada en respaldo) |

