---
id: auditoria_corrida_2026-11-26_head_vs_head
title: "Auditoría de Corrida — 2026-11-26 (HEAD vs HEAD)"
type: auditoria_corrida
fecha: "2026-11-26"
baseline: "HEAD"
actual: "HEAD"
semaforo: "ROJO"
total_indicadores: 236
modificados: 16
agregados: 7
eliminados: 0
sin_cambios: 213
alertas_alta: 37
alertas_media: 1
conectores_live_api: 5
conectores_fallback: 6
etapas_restauradas: 1
umbral_outlier_operativo_pct: 20
umbral_outlier_estructural_pct: 5
estado_revision_humana: "aprobada"
fecha_aprobacion_humana: "2026-11-26T15:51:34.665Z"
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
| Indicadores comunales evaluados | 236 actuales (229 en baseline) | 16 modificados · 7 agregados · 0 eliminados · 213 sin cambios |
| Umbrales de salto brusco | Estructural >= 5% · Operativo >= 20% | + transiciones 0/nulo y cambios de signo |
| Alertas para revisión humana | 38 (37 ALTA · 1 MEDIA) | Requiere cierre humano antes de merge a `main` si semáforo != VERDE |
| Salud de conectores automáticos | 5 live_api · 6 curated_fallback | 1 etapa(s) restaurada(s) · Última corrida API: `2026-11-02T12:13:30+00:00` |

### Checklist de Cierre Humano
- [ ] Revisar logs de GitHub Actions (`actualizacion_mensual.yml` / `verificacion.yml`) sin errores bloqueantes.
- [ ] Confirmar cobertura esperada de indicadores y conectores en `curated_fallback`.
- [ ] Validar cada outlier o variable nueva listada en la Sección 2 antes de aprobar el PR.
- [ ] Ejecutar `node scripts/obsidian_indicator_audit.cjs --approve-latest --sync-to-vault` para aprobar y fijar el nuevo baseline.

## 2. Qué Requiere Verificación Humana

- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/cobertura_fibra_hogar_pct|cobertura_fibra_hogar_pct]] (III. Energía y Telecomunicaciones): Lago Verde: 0,80 -> 0 (Caída a 0 desde 0,80); O'Higgins: 1,50 -> 0 (Caída a 0 desde 1,50) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Informe Nacional FDT SUBTEL 3T-2026 / Adjudicaciones Tortel-O'Higgins (1S-2028) y FDT-2025-03 (33 localidades)
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/conexiones_fijas_subtel_jun2026_n|conexiones_fijas_subtel_jun2026_n]] (III. Energía y Telecomunicaciones): Lago Verde: 189 -> 68 (Variación de -64,0% (umbral operativo >= 20%)); O'Higgins: 272 -> 72 (Variación de -73,5% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Series SUBTEL Junio 2026 (26.294 conexiones fijas regionales) reconciliadas con Censo 2024
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/conexiones_residenciales_subtel_jun2026_n|conexiones_residenciales_subtel_jun2026_n]] (III. Energía y Telecomunicaciones): Lago Verde: 159 -> 56 (Variación de -64,8% (umbral operativo >= 20%)); O'Higgins: 249 -> 58 (Variación de -76,7% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Series SUBTEL Junio 2026 (24.782 residenciales <= hogares Censo 2024 por comuna)
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/consumo_lena_m3_hogar_ano|consumo_lena_m3_hogar_ano]] (III. Energía y Telecomunicaciones): Coyhaique: 14,5 -> 9,81 (Variación de -32,3% (umbral operativo >= 20%)); Lago Verde: 21 -> 15,1 (Variación de -28,1% (umbral operativo >= 20%)); Cisnes: 18,5 -> 14,0 (Variación de -24,6% (umbral operativo >= 20%)); Guaitecas: 19 -> 13,1 (Variación de -31,1% (umbral operativo >= 20%)); Cochrane: 18 -> 14,4 (Variación de -20,3% (umbral operativo >= 20%)); O'Higgins: 22 -> 15,5 (Variación de -29,5% (umbral operativo >= 20%)); Tortel: 21,5 -> 15,2 (Variación de -29,3% (umbral operativo >= 20%)); Chile Chico: 16,5 -> 12,0 (Variación de -27,6% (umbral operativo >= 20%)); Río Ibáñez: 19,5 -> 14,1 (Variación de -27,9% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] INFOR Observatorio BES N° 11 (conversión estéreos -> m³ sólidos factor ~0,64) / PDA Res. Ex. 8.940/2026
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/consumo_lena_m3_solidos_anual|consumo_lena_m3_solidos_anual]] (III. Energía y Telecomunicaciones): Coyhaique: 248.800 -> 147.080 (Variación de -40,9% (umbral operativo >= 20%)); Lago Verde: 16.200 -> 4.740 (Variación de -70,7% (umbral operativo >= 20%)); Aysén: 128.500 -> 91.453 (Variación de -28,8% (umbral operativo >= 20%)); Cisnes: 38.400 -> 26.882 (Variación de -30,0% (umbral operativo >= 20%)); Guaitecas: 18.200 -> 6.417 (Variación de -64,7% (umbral operativo >= 20%)); Cochrane: 34.800 -> 17.816 (Variación de -48,8% (umbral operativo >= 20%)); O'Higgins: 11.556 -> 3.829 (Variación de -66,9% (umbral operativo >= 20%)); Tortel: 14.000 -> 2.920 (Variación de -79,1% (umbral operativo >= 20%)); Chile Chico: 32.600 -> 19.108 (Variación de -41,4% (umbral operativo >= 20%)); Río Ibáñez: 22.400 -> 14.029 (Variación de -37,4% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] INFOR Observatorio BES N° 11 (334.274 m³ sólidos/año) / Ley 21.499 / Anteproyecto PDA Coyhaique Res. Ex. 8.940/2026
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/costo_diesel_aislado_clp|costo_diesel_aislado_clp]] (III. Energía y Telecomunicaciones): Aysén: 0 -> 480 (Transición desde 0 a 480); Cisnes: 380 -> 495 (Variación de +30,3% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Art. 173° LGSE / Pliegos SSAA FNDR GORE-SUBDERE (reconciliación 6 comunas con micro-redes aisladas)
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/gasolina_93_clp|gasolina_93_clp]] (III. Energía y Telecomunicaciones): Coyhaique: 1.362 -> 1.652 (Variación de +21,3% (umbral operativo >= 20%)); Aysén: 1.375 -> 1.651 (Variación de +20,1% (umbral operativo >= 20%)); Cochrane: 1.410 -> 1.714 (Variación de +21,6% (umbral operativo >= 20%)); Río Ibáñez: 1.420 -> 1.705 (Variación de +20,1% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Bandas MEPCO Ley 20.765 / CNE Bencina en Línea corte 19-nov-2026 (promedio regional $1.696/L)
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/hogares_lena_pct|hogares_lena_pct]] (III. Energía y Telecomunicaciones): Coyhaique: 92,4 -> 68,8 (Variación de -25,5% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] INFOR / MMA 10.999 recambios de calefactores al 25-ago-2026 / PDA Res. Ex. 8.940/2026
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/indice_aislamiento_multimodal|indice_aislamiento_multimodal]] (III. Energía y Telecomunicaciones): Coyhaique: 0 -> 1,10 (Transición desde 0 a 1,10); Aysén: 8,90 -> 5,80 (Variación de -34,8% (umbral operativo >= 20%)); Cisnes: 33 -> 19,2 (Variación de -41,8% (umbral operativo >= 20%)); Río Ibáñez: 31 -> 22,7 (Variación de -26,8% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/internet_fijo_pct|internet_fijo_pct]] (III. Energía y Telecomunicaciones): Cisnes: 43,6 -> 72,5 (Variación de +66,3% (umbral operativo >= 20%)); Guaitecas: 31,8 -> 51,9 (Variación de +63,2% (umbral operativo >= 20%)); Río Ibáñez: 35,2 -> 52,4 (Variación de +48,9% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/potencia_mw|potencia_mw]] (III. Energía y Telecomunicaciones): Coyhaique: 26,8 -> 34,0 (Variación de +26,7% (umbral operativo >= 20%)); Lago Verde: 1,40 -> 0,35 (Variación de -75,0% (umbral operativo >= 20%)); Aysén: 42,5 -> 18,5 (Variación de -56,5% (umbral operativo >= 20%)); Cisnes: 6,80 -> 2,83 (Variación de -58,4% (umbral operativo >= 20%)); Guaitecas: 2,80 -> 1,45 (Variación de -48,2% (umbral operativo >= 20%)); Cochrane: 5,80 -> 2,54 (Variación de -56,2% (umbral operativo >= 20%)); Tortel: 1,20 -> 0,95 (Variación de -20,8% (umbral operativo >= 20%)); Chile Chico: 7,50 -> 3,90 (Variación de -48,0% (umbral operativo >= 20%)); Río Ibáñez: 2,40 -> 1,40 (Variación de -41,7% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Catastro CNE / Grupo Saesa / CIEP 2025-2026 (67,10 MW operativos; erradicación nodo aeródromo WPA/SCAS; Art. 173 LGSE SSAA <= 1,50 MW)
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/subsidio_fiscal_diesel_kwh_clp|subsidio_fiscal_diesel_kwh_clp]] (III. Energía y Telecomunicaciones): Aysén: 0 -> 192 (Transición desde 0 a 192); Cisnes: 145 -> 245 (Variación de +69,0% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Subsidio operación diésel FNDR/SUBDERE en SSAA y micro-redes litorales/insulares
- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/tarifa_bt1_clp|tarifa_bt1_clp]] (III. Energía y Telecomunicaciones): Coyhaique: 224 -> 287,8 (Variación de +28,5% (umbral operativo >= 20%)); Aysén: 222 -> 287,8 (Variación de +29,6% (umbral operativo >= 20%)); Cisnes: 235 -> 292,4 (Variación de +24,4% (umbral operativo >= 20%)); Cochrane: 230 -> 291,2 (Variación de +26,6% (umbral operativo >= 20%)); Chile Chico: 228 -> 289,5 (Variación de +27,0% (umbral operativo >= 20%)); Río Ibáñez: 231 -> 289,5 (Variación de +25,3% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Decreto N° 8T MinEnergía 19-ago-2026 / Pliego Edelaysen Nov-2026 (Leyes PEC/MPC 21.472 y 21.667)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-AUTOGEN-EL-TOQUI-DIESEL: N/D -> 4 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-AUTOGEN-EL-TOQUI-HIDRO: N/D -> 2 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-DIESEL-CHILE-CHICO: 4,80 -> 2,90 (Variación de -39,6% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-DIESEL-COCHRANE: 3,80 -> 1,90 (Variación de -50,0% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-DIESEL-MELINKA: 2,80 -> 1,45 (Variación de -48,2% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-DIESEL-PUERTO-AGUIRRE: 2,20 -> 0,48 (Variación de -78,2% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-DIESEL-PUERTO-CISNES: 3,50 -> 1,67 (Variación de -52,3% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-DIESEL-TORTEL: 1,10 -> N/D (Dato pasó a nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-HIBRIDA-CALETA-TORTEL: N/D -> 0,95 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-HIBRIDA-RIO-MOSCO-OHIGGINS: N/D -> 1,25 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-HIDRO-EL-TRARO: N/D -> 0,64 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-HIDRO-LAGO-ATRAVESADO: 0,80 -> 11 (Variación de +1275,0% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-HIDRO-MANIHUALES: 3,40 -> N/D (Dato pasó a nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-HIDRO-RIO-AYSEN: 12,5 -> N/D (Dato pasó a nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-HIDRO-RIO-AYSEN-HIST: N/D -> 2 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-HIDRO-RIO-MOSCO: 0,60 -> N/D (Dato pasó a nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-LOCAL-LAGO-VERDE: N/D -> 0,35 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-RESPALDO-RIO-IBANEZ: N/D -> 1,40 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-SM-PALENA-LA-JUNTA-PUYUHUAPI: N/D -> 0,80 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_CENTRAL-TERMICA-CHACABUCO: 23,5 -> 10 (Variación de -57,4% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_MICROCENTRAL-SSAA-LITORAL-CISNES: N/D -> 0,36 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_PARQUE-EOLICO-ALTO-BAGUALES: 3,20 -> 1,98 (Variación de -38,1% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `centrales_potencia_mw` (Centrales Eléctricas CNE (MW)): ene_cne_PLANTA-SOLAR-EL-BLANCO: N/D -> 2,99 (Aparición de dato antes nulo)
- [ ] **[ALTA · ETAPA_RESTAURADA]** `pipeline_ingesta` (Infraestructura / Ingesta): 1 etapa(s) fueron restauradas por Circuit Breaker (Last-Known-Good) en la última corrida automática (2026-11-02T12:13:30+00:00).
- [ ] **[MEDIA · CONECTOR_FALLBACK]** `pipeline_ingesta` (Infraestructura / Ingesta): 6 conector(es) operaron en curated_fallback: cne_combustibles, cne_energia, subpesca, bbnn, conaf, sinca. Los datos previos se conservaron, pero conviene verificar si hubo actualización oficial pendiente.

## 3. Qué Cambió en esta Corrida (Indicadores Comunales)

### 3.1 Indicadores Modificados (16)

| Indicador | Hub / Nodo | Nivel Umbral | Comuna | Anterior | Actual | Delta | Delta % | Outlier | Respaldo |
|---|---|---|---|---|---|---|---|---|---|
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Lago Verde | 0,80 | 0 | -0,80 | -100,0% | SI | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `cobertura_fibra_hogar_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | O'Higgins | 1,50 | 0 | -1,50 | -100,0% | SI | [[indicadores/cobertura_fibra_hogar_pct|Ficha]] |
| `conexiones_fijas_subtel_jun2026_n` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Coyhaique | 15.785 | 15.986 | 201 | +1,3% | NO | [[indicadores/conexiones_fijas_subtel_jun2026_n|Ficha]] |
| `conexiones_fijas_subtel_jun2026_n` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Lago Verde | 189 | 68 | -121 | -64,0% | SI | [[indicadores/conexiones_fijas_subtel_jun2026_n|Ficha]] |
| `conexiones_fijas_subtel_jun2026_n` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Aysén | 5.748 | 5.868 | 120 | +2,1% | NO | [[indicadores/conexiones_fijas_subtel_jun2026_n|Ficha]] |
| `conexiones_fijas_subtel_jun2026_n` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | O'Higgins | 272 | 72 | -200 | -73,5% | SI | [[indicadores/conexiones_fijas_subtel_jun2026_n|Ficha]] |
| `conexiones_residenciales_subtel_jun2026_n` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Coyhaique | 15.088 | 15.279 | 191 | +1,3% | NO | [[indicadores/conexiones_residenciales_subtel_jun2026_n|Ficha]] |
| `conexiones_residenciales_subtel_jun2026_n` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Lago Verde | 159 | 56 | -103 | -64,8% | SI | [[indicadores/conexiones_residenciales_subtel_jun2026_n|Ficha]] |
| `conexiones_residenciales_subtel_jun2026_n` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Aysén | 5.353 | 5.456 | 103 | +1,9% | NO | [[indicadores/conexiones_residenciales_subtel_jun2026_n|Ficha]] |
| `conexiones_residenciales_subtel_jun2026_n` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | O'Higgins | 249 | 58 | -191 | -76,7% | SI | [[indicadores/conexiones_residenciales_subtel_jun2026_n|Ficha]] |
| `consumo_lena_m3_hogar_ano` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Coyhaique | 14,5 | 9,81 | -4,69 | -32,3% | SI | [[indicadores/consumo_lena_m3_hogar_ano|Ficha]] |
| `consumo_lena_m3_hogar_ano` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Lago Verde | 21 | 15,1 | -5,90 | -28,1% | SI | [[indicadores/consumo_lena_m3_hogar_ano|Ficha]] |
| `consumo_lena_m3_hogar_ano` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Aysén | 15 | 13,2 | -1,80 | -12,0% | NO | [[indicadores/consumo_lena_m3_hogar_ano|Ficha]] |
| `consumo_lena_m3_hogar_ano` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Cisnes | 18,5 | 14,0 | -4,55 | -24,6% | SI | [[indicadores/consumo_lena_m3_hogar_ano|Ficha]] |
| `consumo_lena_m3_hogar_ano` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Guaitecas | 19 | 13,1 | -5,90 | -31,1% | SI | [[indicadores/consumo_lena_m3_hogar_ano|Ficha]] |
| `consumo_lena_m3_hogar_ano` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Cochrane | 18 | 14,4 | -3,65 | -20,3% | SI | [[indicadores/consumo_lena_m3_hogar_ano|Ficha]] |
| `consumo_lena_m3_hogar_ano` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | O'Higgins | 22 | 15,5 | -6,50 | -29,5% | SI | [[indicadores/consumo_lena_m3_hogar_ano|Ficha]] |
| `consumo_lena_m3_hogar_ano` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Tortel | 21,5 | 15,2 | -6,30 | -29,3% | SI | [[indicadores/consumo_lena_m3_hogar_ano|Ficha]] |
| `consumo_lena_m3_hogar_ano` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Chile Chico | 16,5 | 12,0 | -4,55 | -27,6% | SI | [[indicadores/consumo_lena_m3_hogar_ano|Ficha]] |
| `consumo_lena_m3_hogar_ano` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Río Ibáñez | 19,5 | 14,1 | -5,45 | -27,9% | SI | [[indicadores/consumo_lena_m3_hogar_ano|Ficha]] |
| `consumo_lena_m3_solidos_anual` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Coyhaique | 248.800 | 147.080 | -101.720 | -40,9% | SI | [[indicadores/consumo_lena_m3_solidos_anual|Ficha]] |
| `consumo_lena_m3_solidos_anual` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Lago Verde | 16.200 | 4.740 | -11.460 | -70,7% | SI | [[indicadores/consumo_lena_m3_solidos_anual|Ficha]] |
| `consumo_lena_m3_solidos_anual` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Aysén | 128.500 | 91.453 | -37.047 | -28,8% | SI | [[indicadores/consumo_lena_m3_solidos_anual|Ficha]] |
| `consumo_lena_m3_solidos_anual` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Cisnes | 38.400 | 26.882 | -11.518 | -30,0% | SI | [[indicadores/consumo_lena_m3_solidos_anual|Ficha]] |
| `consumo_lena_m3_solidos_anual` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Guaitecas | 18.200 | 6.417 | -11.783 | -64,7% | SI | [[indicadores/consumo_lena_m3_solidos_anual|Ficha]] |
| `consumo_lena_m3_solidos_anual` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Cochrane | 34.800 | 17.816 | -16.984 | -48,8% | SI | [[indicadores/consumo_lena_m3_solidos_anual|Ficha]] |
| `consumo_lena_m3_solidos_anual` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | O'Higgins | 11.556 | 3.829 | -7.727 | -66,9% | SI | [[indicadores/consumo_lena_m3_solidos_anual|Ficha]] |
| `consumo_lena_m3_solidos_anual` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Tortel | 14.000 | 2.920 | -11.080 | -79,1% | SI | [[indicadores/consumo_lena_m3_solidos_anual|Ficha]] |
| `consumo_lena_m3_solidos_anual` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Chile Chico | 32.600 | 19.108 | -13.492 | -41,4% | SI | [[indicadores/consumo_lena_m3_solidos_anual|Ficha]] |
| `consumo_lena_m3_solidos_anual` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Río Ibáñez | 22.400 | 14.029 | -8.371 | -37,4% | SI | [[indicadores/consumo_lena_m3_solidos_anual|Ficha]] |
| `costo_diesel_aislado_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Lago Verde | 560 | 540 | -20 | -3,6% | NO | [[indicadores/costo_diesel_aislado_clp|Ficha]] |
| `costo_diesel_aislado_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Aysén | 0 | 480 | 480 | N/A (desde 0) | SI | [[indicadores/costo_diesel_aislado_clp|Ficha]] |
| `costo_diesel_aislado_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Cisnes | 380 | 495 | 115 | +30,3% | SI | [[indicadores/costo_diesel_aislado_clp|Ficha]] |
| `estado_foa` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Coyhaique | FOA Terrestre + Ramal Submarino (CTR / Conexión Troncal Austral) | Troncal Terrestre Silica Networks (FDT-2018-02) + Cable Submarino Austral GTD vía Puerto Chacabuco | N/D | N/A (desde 0) | NO | [[indicadores/estado_foa|Ficha]] |
| `estado_foa` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Lago Verde | Radioenlace Microondas Digital + Starlink Institucional Subtel | Satelital Starlink / Radioenlace UHF (FTTH hogar en despliegue FDT-2025-03 hacia Lago Verde y Villa La Tapera) | N/D | N/A (desde 0) | NO | [[indicadores/estado_foa|Ficha]] |
| `estado_foa` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Aysén | FOA Submarina (Punto Aterrizaje Chacabuco y Puerto Aguirre) + FOA Terrestre hacia Coyhaique | Cable Submarino Austral GTD / Telefónica del Sur (Puerto Chacabuco) + Red Troncal Regional Coyhaique | N/D | N/A (desde 0) | NO | [[indicadores/estado_foa|Ficha]] |
| `estado_foa` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Cisnes | FOA Submarina (Aterrizaje Puerto Cisnes) + FOA Terrestre Carretera Austral | Red Troncal Terrestre Norte Ruta 7 (La Junta/Puyuhuapi/Cisnes) + adjudicación FDT-2025-03 Última Milla | N/D | N/A (desde 0) | NO | [[indicadores/estado_foa|Ficha]] |
| `estado_foa` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Guaitecas | FOA Submarina (Punto de Aterrizaje Submarino Melinka de CTR/SUBTEL) | Radioenlace Microondas / Starlink + Proyecto Última Milla FDT-2025-03 (Melinka y Repollal, sin aterrizaje CTR) | N/D | N/A (desde 0) | NO | [[indicadores/estado_foa|Ficha]] |
| `estado_foa` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Cochrane | FOA Terrestre (Nodo Cabecera Provincial Troncal Austral Cochrane) | Troncal Terrestre Silica Networks FDT-2018-02 (POIITs Puerto Bertrand, Cochrane y Los Ñadis) | N/D | N/A (desde 0) | NO | [[indicadores/estado_foa|Ficha]] |
| `estado_foa` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | O'Higgins | Radioenlace Digital UHF/Microondas + Satelital Starlink Subtel | Satelital Starlink / Radioenlace UHF (Fibra Tortel-Villa O'Higgins adjudicada D.O. 28-abr-2026; operación 1S-2028) | N/D | N/A (desde 0) | NO | [[indicadores/estado_foa|Ficha]] |
| `estado_foa` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Tortel | FOA Submarina (Punto de Aterrizaje FOA Caleta Tortel) + FOA Terrestre desde Cochrane | Único Aterrizaje Submarino FOA CTR en Aysén (FDT-2017-01) + POIIT Silica FDT-2018-02 + FDT-2025-03 FTTH | N/D | N/A (desde 0) | NO | [[indicadores/estado_foa|Ficha]] |
| `estado_foa` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Chile Chico | FOA Terrestre (Ramal Troncal General Carrera) | Troncal Terrestre Silica Networks FDT-2018-02 (POIITs Puerto Guadal, Mallín Grande y Chile Chico) | N/D | N/A (desde 0) | NO | [[indicadores/estado_foa|Ficha]] |
| `estado_foa` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Río Ibáñez | FOA Terrestre (Troncal Carretera Austral con empalme en Cerro Castillo y Puerto Ibáñez) | Troncal Terrestre Silica Networks FDT-2018-02 (POIITs Cerro Castillo, Puerto Ibáñez, Bahía Murta y Río Tranquilo) | N/D | N/A (desde 0) | NO | [[indicadores/estado_foa|Ficha]] |
| `gasolina_93_clp` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Coyhaique | 1.362 | 1.652 | 290 | +21,3% | SI | [[indicadores/gasolina_93_clp|Ficha]] |
| `gasolina_93_clp` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Lago Verde | 1.520 | 1.765 | 245 | +16,1% | NO | [[indicadores/gasolina_93_clp|Ficha]] |
| `gasolina_93_clp` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Aysén | 1.375 | 1.651 | 276 | +20,1% | SI | [[indicadores/gasolina_93_clp|Ficha]] |
| `gasolina_93_clp` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Cisnes | 1.440 | 1.695 | 255 | +17,7% | NO | [[indicadores/gasolina_93_clp|Ficha]] |
| `gasolina_93_clp` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Guaitecas | 1.560 | 1.785 | 225 | +14,4% | NO | [[indicadores/gasolina_93_clp|Ficha]] |
| `gasolina_93_clp` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Cochrane | 1.410 | 1.714 | 304 | +21,6% | SI | [[indicadores/gasolina_93_clp|Ficha]] |
| `gasolina_93_clp` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | O'Higgins | 1.620 | 1.812 | 192 | +11,9% | NO | [[indicadores/gasolina_93_clp|Ficha]] |
| `gasolina_93_clp` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Tortel | 1.580 | 1.790 | 210 | +13,3% | NO | [[indicadores/gasolina_93_clp|Ficha]] |
| `gasolina_93_clp` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Chile Chico | 1.430 | 1.710 | 280 | +19,6% | NO | [[indicadores/gasolina_93_clp|Ficha]] |
| `gasolina_93_clp` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Río Ibáñez | 1.420 | 1.705 | 285 | +20,1% | SI | [[indicadores/gasolina_93_clp|Ficha]] |
| `hogares_lena_pct` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Coyhaique | 92,4 | 68,8 | -23,6 | -25,5% | SI | [[indicadores/hogares_lena_pct|Ficha]] |
| `hogares_lena_pct` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Lago Verde | 98,2 | 98,1 | -0,10 | -0,1% | NO | [[indicadores/hogares_lena_pct|Ficha]] |
| `hogares_lena_pct` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Aysén | 87,8 | 84,5 | -3,30 | -3,8% | NO | [[indicadores/hogares_lena_pct|Ficha]] |
| `hogares_lena_pct` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Cisnes | 95,1 | 94 | -1,10 | -1,2% | NO | [[indicadores/hogares_lena_pct|Ficha]] |
| `hogares_lena_pct` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Guaitecas | 94,6 | 94,2 | -0,40 | -0,4% | NO | [[indicadores/hogares_lena_pct|Ficha]] |
| `hogares_lena_pct` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Cochrane | 96 | 95,5 | -0,50 | -0,5% | NO | [[indicadores/hogares_lena_pct|Ficha]] |
| `hogares_lena_pct` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | O'Higgins | 99,1 | 98,8 | -0,30 | -0,3% | NO | [[indicadores/hogares_lena_pct|Ficha]] |
| `hogares_lena_pct` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Tortel | 98,4 | 98,5 | 0,10 | +0,1% | NO | [[indicadores/hogares_lena_pct|Ficha]] |
| `hogares_lena_pct` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Chile Chico | 82,3 | 82 | -0,30 | -0,4% | NO | [[indicadores/hogares_lena_pct|Ficha]] |
| `indice_aislamiento_multimodal` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Coyhaique | 0 | 1,10 | 1,10 | N/A (desde 0) | SI | [[indicadores/indice_aislamiento_multimodal|Ficha]] |
| `indice_aislamiento_multimodal` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Aysén | 8,90 | 5,80 | -3,10 | -34,8% | SI | [[indicadores/indice_aislamiento_multimodal|Ficha]] |
| `indice_aislamiento_multimodal` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Cisnes | 33 | 19,2 | -13,8 | -41,8% | SI | [[indicadores/indice_aislamiento_multimodal|Ficha]] |
| `indice_aislamiento_multimodal` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Guaitecas | 87,1 | 77,6 | -9,50 | -10,9% | NO | [[indicadores/indice_aislamiento_multimodal|Ficha]] |
| `indice_aislamiento_multimodal` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Cochrane | 28,7 | 23,6 | -5,10 | -17,8% | NO | [[indicadores/indice_aislamiento_multimodal|Ficha]] |
| `indice_aislamiento_multimodal` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | O'Higgins | 86,6 | 86,4 | -0,20 | -0,2% | NO | [[indicadores/indice_aislamiento_multimodal|Ficha]] |
| `indice_aislamiento_multimodal` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Tortel | 79,2 | 81,4 | 2,20 | +2,8% | NO | [[indicadores/indice_aislamiento_multimodal|Ficha]] |
| `indice_aislamiento_multimodal` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Chile Chico | 27,9 | 30,6 | 2,70 | +9,7% | NO | [[indicadores/indice_aislamiento_multimodal|Ficha]] |
| `indice_aislamiento_multimodal` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Río Ibáñez | 31 | 22,7 | -8,30 | -26,8% | SI | [[indicadores/indice_aislamiento_multimodal|Ficha]] |
| `internet_fijo_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Coyhaique | 75,5 | 70,1 | -5,40 | -7,2% | NO | [[indicadores/internet_fijo_pct|Ficha]] |
| `internet_fijo_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Lago Verde | 17,6 | 17,5 | -0,10 | -0,6% | NO | [[indicadores/internet_fijo_pct|Ficha]] |
| `internet_fijo_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Aysén | 61,8 | 66,5 | 4,70 | +7,6% | NO | [[indicadores/internet_fijo_pct|Ficha]] |
| `internet_fijo_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Cisnes | 43,6 | 72,5 | 28,9 | +66,3% | SI | [[indicadores/internet_fijo_pct|Ficha]] |
| `internet_fijo_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Guaitecas | 31,8 | 51,9 | 20,1 | +63,2% | SI | [[indicadores/internet_fijo_pct|Ficha]] |
| `internet_fijo_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Cochrane | 51,4 | 60,8 | 9,40 | +18,3% | NO | [[indicadores/internet_fijo_pct|Ficha]] |
| `internet_fijo_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Tortel | 27,5 | 22,1 | -5,40 | -19,6% | NO | [[indicadores/internet_fijo_pct|Ficha]] |
| `internet_fijo_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Chile Chico | 47,9 | 40,4 | -7,50 | -15,7% | NO | [[indicadores/internet_fijo_pct|Ficha]] |
| `internet_fijo_pct` | III. Energía y Telecomunicaciones (Nodo #14) | operativo (20%) | Río Ibáñez | 35,2 | 52,4 | 17,2 | +48,9% | SI | [[indicadores/internet_fijo_pct|Ficha]] |
| `potencia_mw` | III. Energía y Telecomunicaciones (Nodo #11) | operativo (20%) | Coyhaique | 26,8 | 34,0 | 7,15 | +26,7% | SI | [[indicadores/potencia_mw|Ficha]] |
| `potencia_mw` | III. Energía y Telecomunicaciones (Nodo #11) | operativo (20%) | Lago Verde | 1,40 | 0,35 | -1,05 | -75,0% | SI | [[indicadores/potencia_mw|Ficha]] |
| `potencia_mw` | III. Energía y Telecomunicaciones (Nodo #11) | operativo (20%) | Aysén | 42,5 | 18,5 | -24,0 | -56,5% | SI | [[indicadores/potencia_mw|Ficha]] |
| `potencia_mw` | III. Energía y Telecomunicaciones (Nodo #11) | operativo (20%) | Cisnes | 6,80 | 2,83 | -3,97 | -58,4% | SI | [[indicadores/potencia_mw|Ficha]] |
| `potencia_mw` | III. Energía y Telecomunicaciones (Nodo #11) | operativo (20%) | Guaitecas | 2,80 | 1,45 | -1,35 | -48,2% | SI | [[indicadores/potencia_mw|Ficha]] |
| `potencia_mw` | III. Energía y Telecomunicaciones (Nodo #11) | operativo (20%) | Cochrane | 5,80 | 2,54 | -3,26 | -56,2% | SI | [[indicadores/potencia_mw|Ficha]] |
| `potencia_mw` | III. Energía y Telecomunicaciones (Nodo #11) | operativo (20%) | O'Higgins | 1,40 | 1,25 | -0,15 | -10,7% | NO | [[indicadores/potencia_mw|Ficha]] |
| `potencia_mw` | III. Energía y Telecomunicaciones (Nodo #11) | operativo (20%) | Tortel | 1,20 | 0,95 | -0,25 | -20,8% | SI | [[indicadores/potencia_mw|Ficha]] |
| `potencia_mw` | III. Energía y Telecomunicaciones (Nodo #11) | operativo (20%) | Chile Chico | 7,50 | 3,90 | -3,60 | -48,0% | SI | [[indicadores/potencia_mw|Ficha]] |
| `potencia_mw` | III. Energía y Telecomunicaciones (Nodo #11) | operativo (20%) | Río Ibáñez | 2,40 | 1,40 | -1 | -41,7% | SI | [[indicadores/potencia_mw|Ficha]] |
| `precio_lena_m3` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Lago Verde | 38.000 | 36.000 | -2.000 | -5,3% | NO | [[indicadores/precio_lena_m3|Ficha]] |
| `precio_lena_m3` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Cisnes | 42.000 | 44.000 | 2.000 | +4,8% | NO | [[indicadores/precio_lena_m3|Ficha]] |
| `precio_lena_m3` | III. Energía y Telecomunicaciones (Nodo #13) | operativo (20%) | Guaitecas | 55.000 | 52.000 | -3.000 | -5,5% | NO | [[indicadores/precio_lena_m3|Ficha]] |
| `sistema_electrico` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Lago Verde | Sistema Palena - La Junta (Edelaysen) y Autoproducción Lago Verde | Fracción Sistema Mediano Palena y Micro-redes La Tapera / Amengual | N/D | N/A (desde 0) | NO | [[indicadores/sistema_electrico|Ficha]] |
| `sistema_electrico` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Aysén | Sistema Mediano de Aysén (SMA) e Islas Huichas Aislado | SMA Continental, Autogeneración El Toqui e Islas Huichas (SSAA) | N/D | N/A (desde 0) | NO | [[indicadores/sistema_electrico|Ficha]] |
| `sistema_electrico` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Cisnes | Sistema Mediano Palena - Cisnes (Edelaysen) | SM Puerto Cisnes (1.67 MW), SM Palena (0.80 MW) y 3 SSAA Litorales (0.36 MW) | N/D | N/A (desde 0) | NO | [[indicadores/sistema_electrico|Ficha]] |
| `sistema_electrico` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Guaitecas | Sistema Aislado Insular Melinka | Sistema Aislado Municipal Melinka-Repollal | N/D | N/A (desde 0) | NO | [[indicadores/sistema_electrico|Ficha]] |
| `sistema_electrico` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Cochrane | Sistema Mediano General Carrera - Cochrane (Edelaysen) | Sistema Mediano General Carrera - Cochrane (SMGC) | N/D | N/A (desde 0) | NO | [[indicadores/sistema_electrico|Ficha]] |
| `sistema_electrico` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | O'Higgins | Sistema Aislado Villa O'Higgins | Sistema Aislado Municipal Villa O'Higgins | N/D | N/A (desde 0) | NO | [[indicadores/sistema_electrico|Ficha]] |
| `sistema_electrico` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Tortel | Sistema Aislado Caleta Tortel | Sistema Aislado Municipal Caleta Tortel | N/D | N/A (desde 0) | NO | [[indicadores/sistema_electrico|Ficha]] |
| `sistema_electrico` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Río Ibáñez | Sistema Mediano de Aysén (Interconexión Ramal Sur) | Ramal Sur SMA / Respaldo Local Cerro Castillo-Puerto Ibáñez | N/D | N/A (desde 0) | NO | [[indicadores/sistema_electrico|Ficha]] |
| `subsidio_fiscal_diesel_kwh_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Lago Verde | 302 | 246 | -56 | -18,5% | NO | [[indicadores/subsidio_fiscal_diesel_kwh_clp|Ficha]] |
| `subsidio_fiscal_diesel_kwh_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Aysén | 0 | 192 | 192 | N/A (desde 0) | SI | [[indicadores/subsidio_fiscal_diesel_kwh_clp|Ficha]] |
| `subsidio_fiscal_diesel_kwh_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Cisnes | 145 | 245 | 100 | +69,0% | SI | [[indicadores/subsidio_fiscal_diesel_kwh_clp|Ficha]] |
| `subsidio_fiscal_diesel_kwh_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Guaitecas | 375 | 328 | -47 | -12,5% | NO | [[indicadores/subsidio_fiscal_diesel_kwh_clp|Ficha]] |
| `subsidio_fiscal_diesel_kwh_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | O'Higgins | 358 | 312 | -46 | -12,8% | NO | [[indicadores/subsidio_fiscal_diesel_kwh_clp|Ficha]] |
| `subsidio_fiscal_diesel_kwh_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Tortel | 412 | 362 | -50 | -12,1% | NO | [[indicadores/subsidio_fiscal_diesel_kwh_clp|Ficha]] |
| `tarifa_bt1_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Coyhaique | 224 | 287,8 | 63,8 | +28,5% | SI | [[indicadores/tarifa_bt1_clp|Ficha]] |
| `tarifa_bt1_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Lago Verde | 258 | 294 | 36 | +14,0% | NO | [[indicadores/tarifa_bt1_clp|Ficha]] |
| `tarifa_bt1_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Aysén | 222 | 287,8 | 65,8 | +29,6% | SI | [[indicadores/tarifa_bt1_clp|Ficha]] |
| `tarifa_bt1_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Cisnes | 235 | 292,4 | 57,4 | +24,4% | SI | [[indicadores/tarifa_bt1_clp|Ficha]] |
| `tarifa_bt1_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Guaitecas | 265 | 312 | 47 | +17,7% | NO | [[indicadores/tarifa_bt1_clp|Ficha]] |
| `tarifa_bt1_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Cochrane | 230 | 291,2 | 61,2 | +26,6% | SI | [[indicadores/tarifa_bt1_clp|Ficha]] |
| `tarifa_bt1_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | O'Higgins | 262 | 308 | 46 | +17,6% | NO | [[indicadores/tarifa_bt1_clp|Ficha]] |
| `tarifa_bt1_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Tortel | 268 | 318 | 50 | +18,7% | NO | [[indicadores/tarifa_bt1_clp|Ficha]] |
| `tarifa_bt1_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Chile Chico | 228 | 289,5 | 61,5 | +27,0% | SI | [[indicadores/tarifa_bt1_clp|Ficha]] |
| `tarifa_bt1_clp` | III. Energía y Telecomunicaciones (Nodo #12) | operativo (20%) | Río Ibáñez | 231 | 289,5 | 58,5 | +25,3% | SI | [[indicadores/tarifa_bt1_clp|Ficha]] |

### 3.2 Indicadores Agregados (7)

| Indicador | Tipo | Hub | Comunas con valor != 0 | En léxico oficial | Respaldo |
|---|---|---|---|---|---|
| `cobertura_subsidio_electrico_hogares_n` | numeric | III. Energía y Telecomunicaciones | 10 / 10 | SI | [[indicadores/cobertura_subsidio_electrico_hogares_n|Ficha]] |
| `cobertura_subsidio_electrico_pct` | numeric | III. Energía y Telecomunicaciones | 10 / 10 | SI | [[indicadores/cobertura_subsidio_electrico_pct|Ficha]] |
| `diesel_clp_litro` | numeric | III. Energía y Telecomunicaciones | 10 / 10 | SI | [[indicadores/diesel_clp_litro|Ficha]] |
| `hogares_censo_2024` | numeric | VI. Demografía, Educación y Sociedad | 10 / 10 | SI | [[indicadores/hogares_censo_2024|Ficha]] |
| `kerosene_clp_litro` | numeric | III. Energía y Telecomunicaciones | 10 / 10 | SI | [[indicadores/kerosene_clp_litro|Ficha]] |
| `potencia_ernc_en_construccion_mw` | numeric | III. Energía y Telecomunicaciones | 2 / 10 | SI | [[indicadores/potencia_ernc_en_construccion_mw|Ficha]] |
| `ratio_costo_calefaccion_electrica_vs_lena` | numeric | III. Energía y Telecomunicaciones | 10 / 10 | SI | [[indicadores/ratio_costo_calefaccion_electrica_vs_lena|Ficha]] |

## 4. Qué Quedó Igual (Resumen por 10 Hubs Canónicos)

**213 indicadores comunales** mantuvieron valores idénticos en las 10 comunas de Aysén. No se generan fichas individuales vacías para evitar ruido en el grafo de Obsidian.

| Hub Canónico | Indicadores sin cambios |
|---|---|
| I. Turismo y Áreas Silvestres | 31 |
| II. Pesca, Acuicultura y Mar | 23 |
| III. Energía y Telecomunicaciones | 6 |
| IV. Gobernanza y Finanzas | 42 |
| IX. Cultura y Patrimonio | 15 |
| V. Economía, Inversión y Suelo | 18 |
| VI. Demografía, Educación y Sociedad | 30 |
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
| Series Anuales (Último Corte) | 64 | 5 | 0 | 0 | 59 |
| Centrales Eléctricas CNE (MW) | 1 | 1 | 0 | 0 | 0 |

### Cambios Detectados en Ámbitos Extendidos

| Ámbito | Métrica | Entidad / Periodo | Estado | Anterior | Actual | Outlier |
|---|---|---|---|---|---|---|
| Series Anuales (Último Corte) | `serie_acuicultura__centros_salmonicolas_activos_ciclo` | 2026 | modificada | 245 | 240 | NO |
| Series Anuales (Último Corte) | `serie_acuicultura__cosecha_salmon_atlantico_ton` | 2026 | modificada | 402.800 | 348.000 | NO |
| Series Anuales (Último Corte) | `serie_acuicultura__cosecha_salmon_coho_ton` | 2026 | modificada | 81.000 | 70.000 | NO |
| Series Anuales (Último Corte) | `serie_acuicultura__cosecha_salmonidos_total_ton` | 2026 | modificada | 503.500 | 435.000 | NO |
| Series Anuales (Último Corte) | `serie_acuicultura__cosecha_trucha_arcoiris_ton` | 2026 | modificada | 19.700 | 17.000 | NO |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-AUTOGEN-EL-TOQUI-DIESEL | modificada | N/D | 4 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-AUTOGEN-EL-TOQUI-HIDRO | modificada | N/D | 2 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-DIESEL-CHILE-CHICO | modificada | 4,80 | 2,90 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-DIESEL-COCHRANE | modificada | 3,80 | 1,90 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-DIESEL-MELINKA | modificada | 2,80 | 1,45 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-DIESEL-PUERTO-AGUIRRE | modificada | 2,20 | 0,48 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-DIESEL-PUERTO-CISNES | modificada | 3,50 | 1,67 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-DIESEL-TORTEL | modificada | 1,10 | N/D | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-HIBRIDA-CALETA-TORTEL | modificada | N/D | 0,95 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-HIBRIDA-RIO-MOSCO-OHIGGINS | modificada | N/D | 1,25 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-HIDRO-EL-TRARO | modificada | N/D | 0,64 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-HIDRO-LAGO-ATRAVESADO | modificada | 0,80 | 11 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-HIDRO-MANIHUALES | modificada | 3,40 | N/D | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-HIDRO-RIO-AYSEN | modificada | 12,5 | N/D | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-HIDRO-RIO-AYSEN-HIST | modificada | N/D | 2 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-HIDRO-RIO-MOSCO | modificada | 0,60 | N/D | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-LOCAL-LAGO-VERDE | modificada | N/D | 0,35 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-RESPALDO-RIO-IBANEZ | modificada | N/D | 1,40 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-SM-PALENA-LA-JUNTA-PUYUHUAPI | modificada | N/D | 0,80 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-TERMICA-CHACABUCO | modificada | 23,5 | 10 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_CENTRAL-TERMICA-TEHUELCHE | modificada | 19,8 | 18,0 | NO |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_MICROCENTRAL-SSAA-LITORAL-CISNES | modificada | N/D | 0,36 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_PARQUE-EOLICO-ALTO-BAGUALES | modificada | 3,20 | 1,98 | SI |
| Centrales Eléctricas CNE (MW) | `centrales_potencia_mw` | ene_cne_PLANTA-SOLAR-EL-BLANCO | modificada | N/D | 2,99 | SI |

## 6. Detalle de Conectores en `curated_fallback`

| Conector | Modo | HTTP | Nodos | Motivo registrado |
|---|---|---|---|---|
| `cne_combustibles` | `curated_fallback` | N/A | #13 | CKAN package_search no respondio 200 (URLError: <urlopen error [Errno -2] Name or service not known>) |
| `cne_energia` | `curated_fallback` | N/A | #11 | CKAN package_search no respondio 200 (URLError: <urlopen error [Errno -2] Name or service not known>) |
| `subpesca` | `curated_fallback` | 404 | #6 | 2 candidato(s) fallaron: sin respuesta / 404 |
| `bbnn` | `curated_fallback` | N/A | #22 | 2 candidato(s) fallaron: sin respuesta / sin respuesta |
| `conaf` | `curated_fallback` | N/A | #27 | 2 candidato(s) fallaron: 404 / sin respuesta |
| `sinca` | `curated_fallback` | 403 | #30 | SINCA no respondio 200 (HTTP 403 Forbidden) |

