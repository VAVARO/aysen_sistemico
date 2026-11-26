---
id: auditoria_corrida_2026-11-25_head_1_vs_head
title: "Auditoría de Corrida — 2026-11-25 (HEAD~1 vs HEAD)"
type: auditoria_corrida
fecha: "2026-11-25"
baseline: "HEAD~1"
actual: "HEAD"
semaforo: "ROJO"
total_indicadores: 237
modificados: 1
agregados: 9
eliminados: 0
sin_cambios: 227
alertas_alta: 54
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

# Auditoría de Corrida de Indicadores — 2026-11-25

Comparación determinista: `HEAD~1` -> `HEAD` · Semáforo de revisión: **ROJO**.
Índice maestro: [[index_auditoria|Índice de Auditoría de Indicadores]].

## 1. Revisión Rápida (5 Minutos)

| Dimensión de Control | Resultado | Señal |
|---|---|---|
| Indicadores comunales evaluados | 237 actuales (228 en baseline) | 1 modificados · 9 agregados · 0 eliminados · 227 sin cambios |
| Umbrales de salto brusco | Estructural >= 5% · Operativo >= 20% | + transiciones 0/nulo y cambios de signo |
| Alertas para revisión humana | 55 (54 ALTA · 1 MEDIA) | Requiere cierre humano antes de merge a `main` si semáforo != VERDE |
| Salud de conectores automáticos | 5 live_api · 6 curated_fallback | 1 etapa(s) restaurada(s) · Última corrida API: `2026-11-02T12:13:30+00:00` |

### Checklist de Cierre Humano
- [ ] Revisar logs de GitHub Actions (`actualizacion_mensual.yml` / `verificacion.yml`) sin errores bloqueantes.
- [ ] Confirmar cobertura esperada de indicadores y conectores en `curated_fallback`.
- [ ] Validar cada outlier o variable nueva listada en la Sección 2 antes de aprobar el PR.
- [ ] Ejecutar `node scripts/obsidian_indicator_audit.cjs --approve-latest --sync-to-vault` para aprobar y fijar el nuevo baseline.

## 2. Qué Requiere Verificación Humana

- [ ] **[ALTA · OUTLIER_SALTO]** [[indicadores/ecmpo_solicitadas_ha|ecmpo_solicitadas_ha]] (II. Pesca, Acuicultura y Mar): Guaitecas: 0 -> 148.000 (Transición desde 0 a 148.000); Tortel: 0 -> 18.500 (Transición desde 0 a 18.500)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_biomasa_padron_ton` (Holdings Salmoneros (N=13)): Australis Seafoods: 33.448 -> 21.963 (Variación de -34,3% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_biomasa_padron_ton` (Holdings Salmoneros (N=13)): Cermaq Chile: 53.574 -> 33.888 (Variación de -36,7% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_biomasa_padron_ton` (Holdings Salmoneros (N=13)): Cooke Aquaculture Chile: 11.778 -> 35.350 (Variación de +200,1% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_biomasa_padron_ton` (Holdings Salmoneros (N=13)): Invermar: 21.670 -> 0 (Caída a 0 desde 21.670)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_biomasa_padron_ton` (Holdings Salmoneros (N=13)): Multi X: 57.500 -> 94.844 (Variación de +64,9% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_biomasa_padron_ton` (Holdings Salmoneros (N=13)): Salmones Austral: 16.923 -> 0 (Caída a 0 desde 16.923)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_biomasa_padron_ton` (Holdings Salmoneros (N=13)): Salmones Camanchaca: 28.382 -> 37.524 (Variación de +32,2% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_biomasa_padron_ton` (Holdings Salmoneros (N=13)): Salmones Yadrán: 18.361 -> 7.000 (Variación de -61,9% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_estimados` (Holdings Salmoneros (N=13)): Australis Seafoods: 16 -> 11 (Variación de -31,3% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_estimados` (Holdings Salmoneros (N=13)): Cermaq Chile: 25 -> 16 (Variación de -36,0% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_estimados` (Holdings Salmoneros (N=13)): Cooke Aquaculture Chile: 6 -> 18 (Variación de +200,0% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_estimados` (Holdings Salmoneros (N=13)): Invermar: 10 -> 0 (Caída a 0 desde 10)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_estimados` (Holdings Salmoneros (N=13)): Multi X: 27 -> 45 (Variación de +66,7% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_estimados` (Holdings Salmoneros (N=13)): Salmones Austral: 8 -> 0 (Caída a 0 desde 8)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_estimados` (Holdings Salmoneros (N=13)): Salmones Camanchaca: 13 -> 16 (Variación de +23,1% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_estimados` (Holdings Salmoneros (N=13)): Salmones Yadrán: 11 -> 5 (Variación de -54,5% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_estimados` (Holdings Salmoneros (N=13)): Titulares Menores Aysén: 1 -> 0 (Caída a 0 desde 1)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_padron` (Holdings Salmoneros (N=13)): Australis Seafoods: 16 -> 11 (Variación de -31,3% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_padron` (Holdings Salmoneros (N=13)): Cermaq Chile: 25 -> 16 (Variación de -36,0% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_padron` (Holdings Salmoneros (N=13)): Cooke Aquaculture Chile: 6 -> 18 (Variación de +200,0% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_padron` (Holdings Salmoneros (N=13)): Invermar: 10 -> 0 (Caída a 0 desde 10)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_padron` (Holdings Salmoneros (N=13)): Multi X: 27 -> 45 (Variación de +66,7% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_padron` (Holdings Salmoneros (N=13)): Salmones Austral: 8 -> 0 (Caída a 0 desde 8)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_padron` (Holdings Salmoneros (N=13)): Salmones Camanchaca: 13 -> 16 (Variación de +23,1% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_padron` (Holdings Salmoneros (N=13)): Salmones Yadrán: 11 -> 5 (Variación de -54,5% (umbral operativo >= 20%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_centros_activos_padron` (Holdings Salmoneros (N=13)): Titulares Menores Aysén: 1 -> 0 (Caída a 0 desde 1)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): AquaChile: 118 -> 106 (Variación de -10,2% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Australis Seafoods: 0 -> 15 (Transición desde 0 a 15)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Blumar Seafoods / Salmones Blumar: 36 -> 21 (Variación de -41,7% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Cermaq Chile: 35 -> 29 (Variación de -17,1% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Cooke Aquaculture Chile: 0 -> 10 (Transición desde 0 a 10)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Invermar: 0 -> 9 (Transición desde 0 a 9)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Mowi Chile: 48 -> 29 (Variación de -39,6% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Multi X: 27 -> 25 (Variación de -7,4% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Salmones Antártica: 0 -> 5 (Transición desde 0 a 5)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Salmones Austral: 5 -> 10 (Variación de +100,0% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Salmones Camanchaca: 7 -> 12 (Variación de +71,4% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Salmones Yadrán: 24 -> 27 (Variación de +12,5% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_concesiones_snaspe` (Holdings Salmoneros (N=13)): Titulares Menores Aysén: 12 -> 14 (Variación de +16,7% (umbral estructural >= 5%))
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): AquaChile: N/D -> 18 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Australis Seafoods: N/D -> 8 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Blumar Seafoods / Salmones Blumar: N/D -> 5 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Cermaq Chile: N/D -> 6 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Cooke Aquaculture Chile: N/D -> 3 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Invermar: N/D -> 2 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Mowi Chile: N/D -> 8 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Multi X: N/D -> 7 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Salmones Antártica: N/D -> 1 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Salmones Austral: N/D -> 2 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Salmones Camanchaca: N/D -> 3 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Salmones Yadrán: N/D -> 3 (Aparición de dato antes nulo)
- [ ] **[ALTA · OUTLIER_SALTO]** `holding_sancionatorios_sma_snifa` (Holdings Salmoneros (N=13)): Titulares Menores Aysén: N/D -> 0 (Aparición de dato antes nulo)
- [ ] **[ALTA · ETAPA_RESTAURADA]** `pipeline_ingesta` (Infraestructura / Ingesta): 1 etapa(s) fueron restauradas por Circuit Breaker (Last-Known-Good) en la última corrida automática (2026-11-02T12:13:30+00:00).
- [ ] **[MEDIA · CONECTOR_FALLBACK]** `pipeline_ingesta` (Infraestructura / Ingesta): 6 conector(es) operaron en curated_fallback: cne_combustibles, cne_energia, subpesca, bbnn, conaf, sinca. Los datos previos se conservaron, pero conviene verificar si hubo actualización oficial pendiente.

## 3. Qué Cambió en esta Corrida (Indicadores Comunales)

### 3.1 Indicadores Modificados (1)

| Indicador | Hub / Nodo | Nivel Umbral | Comuna | Anterior | Actual | Delta | Delta % | Outlier | Respaldo |
|---|---|---|---|---|---|---|---|---|---|
| `ecmpo_solicitadas_ha` | II. Pesca, Acuicultura y Mar (Nodo #8) | estructural (5%) | Guaitecas | 0 | 148.000 | 148.000 | N/A (desde 0) | SI | [[indicadores/ecmpo_solicitadas_ha|Ficha]] |
| `ecmpo_solicitadas_ha` | II. Pesca, Acuicultura y Mar (Nodo #8) | estructural (5%) | Tortel | 0 | 18.500 | 18.500 | N/A (desde 0) | SI | [[indicadores/ecmpo_solicitadas_ha|Ficha]] |

### 3.2 Indicadores Agregados (9)

| Indicador | Tipo | Hub | Comunas con valor != 0 | En léxico oficial | Respaldo |
|---|---|---|---|---|---|
| `centros_infa_anaerobica_n` | numeric | II. Pesca, Acuicultura y Mar | 3 / 10 | SI | [[indicadores/centros_infa_anaerobica_n|Ficha]] |
| `desembarque_muelles_total_ton` | numeric | II. Pesca, Acuicultura y Mar | 4 / 10 | SI | [[indicadores/desembarque_muelles_total_ton|Ficha]] |
| `ecmpo_traslape_acuicola_n` | numeric | II. Pesca, Acuicultura y Mar | 4 / 10 | SI | [[indicadores/ecmpo_traslape_acuicola_n|Ficha]] |
| `empleo_directo_acuicola_n` | numeric | II. Pesca, Acuicultura y Mar | 5 / 10 | SI | [[indicadores/empleo_directo_acuicola_n|Ficha]] |
| `nota_ciclo_productivo` | categorical | II. Pesca, Acuicultura y Mar | 10 / 10 | SI | [[indicadores/nota_ciclo_productivo|Ficha]] |
| `patente_acuicola_pua_mclp` | numeric | II. Pesca, Acuicultura y Mar | 4 / 10 | SI | [[indicadores/patente_acuicola_pua_mclp|Ficha]] |
| `peso_pua_ingresos_propios_pct` | numeric | II. Pesca, Acuicultura y Mar | 4 / 10 | SI | [[indicadores/peso_pua_ingresos_propios_pct|Ficha]] |
| `sancionatorios_sma_acuicolas_n` | numeric | II. Pesca, Acuicultura y Mar | 4 / 10 | SI | [[indicadores/sancionatorios_sma_acuicolas_n|Ficha]] |
| `superficie_concesionada_mar_ha` | numeric | II. Pesca, Acuicultura y Mar | 4 / 10 | SI | [[indicadores/superficie_concesionada_mar_ha|Ficha]] |

## 4. Qué Quedó Igual (Resumen por 10 Hubs Canónicos)

**227 indicadores comunales** mantuvieron valores idénticos en las 10 comunas de Aysén. No se generan fichas individuales vacías para evitar ruido en el grafo de Obsidian.

| Hub Canónico | Indicadores sin cambios |
|---|---|
| I. Turismo y Áreas Silvestres | 18 |
| II. Pesca, Acuicultura y Mar | 13 |
| III. Energía y Telecomunicaciones | 24 |
| IV. Gobernanza y Finanzas | 43 |
| IX. Cultura y Patrimonio | 18 |
| V. Economía, Inversión y Suelo | 19 |
| VI. Demografía, Educación y Sociedad | 37 |
| VII. Biodiversidad, Clima y Riesgos | 17 |
| VIII. Salud | 19 |
| X. CTCi e Innovación | 19 |

## 5. Cobertura Extendida (Barrios ACS, Holdings, Padrón SUBPESCA y Series Anuales)

| Ámbito Estructural | Series/Métricas Actuales | Modificadas | Agregadas | Eliminadas | Sin cambios |
|---|---|---|---|---|---|
| Barrios ACS (N=18) | 8 | 0 | 8 | 0 | 0 |
| Holdings Salmoneros (N=13) | 7 | 5 | 0 | 0 | 2 |
| Invariantes Padrón SUBPESCA | 5 | 0 | 0 | 0 | 5 |
| Series Anuales (Último Corte) | 56 | 0 | 22 | 0 | 34 |

### Cambios Detectados en Ámbitos Extendidos

| Ámbito | Métrica | Entidad / Periodo | Estado | Anterior | Actual | Outlier |
|---|---|---|---|---|---|---|
| Barrios ACS (N=18) | `acs_antibioticos_ica_g_ton` | múltiples | agregada | N/D | 18 registros | NO |
| Barrios ACS (N=18) | `acs_biomasa_cosechada_ton` | múltiples | agregada | N/D | 18 registros | NO |
| Barrios ACS (N=18) | `acs_centros_activos` | múltiples | agregada | N/D | 18 registros | NO |
| Barrios ACS (N=18) | `acs_concesiones_en_snaspe` | múltiples | agregada | N/D | 18 registros | NO |
| Barrios ACS (N=18) | `acs_concesiones_totales` | múltiples | agregada | N/D | 18 registros | NO |
| Barrios ACS (N=18) | `acs_densidad_max_kg_m3` | múltiples | agregada | N/D | 18 registros | NO |
| Barrios ACS (N=18) | `acs_infa_aerobica_pct` | múltiples | agregada | N/D | 18 registros | NO |
| Barrios ACS (N=18) | `acs_mortalidad_ciclo_pct` | múltiples | agregada | N/D | 18 registros | NO |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | AquaChile | modificada | 127.552 | 130.300 | NO |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Australis Seafoods | modificada | 33.448 | 21.963 | SI |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Blumar Seafoods / Salmones Blumar | modificada | 44.086 | 44.513 | NO |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Cermaq Chile | modificada | 53.574 | 33.888 | SI |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Cooke Aquaculture Chile | modificada | 11.778 | 35.350 | SI |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Invermar | modificada | 21.670 | 0 | SI |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Mowi Chile | modificada | 68.542 | 79.828 | NO |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Multi X | modificada | 57.500 | 94.844 | SI |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Salmones Antártica | modificada | 11.778 | 9.790 | NO |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Salmones Austral | modificada | 16.923 | 0 | SI |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Salmones Camanchaca | modificada | 28.382 | 37.524 | SI |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Salmones Yadrán | modificada | 18.361 | 7.000 | SI |
| Holdings Salmoneros (N=13) | `holding_biomasa_padron_ton` | Titulares Menores Aysén | modificada | 9.906 | 8.500 | NO |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | AquaChile | modificada | 69 | 74 | NO |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | Australis Seafoods | modificada | 16 | 11 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | Cermaq Chile | modificada | 25 | 16 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | Cooke Aquaculture Chile | modificada | 6 | 18 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | Invermar | modificada | 10 | 0 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | Mowi Chile | modificada | 32 | 34 | NO |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | Multi X | modificada | 27 | 45 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | Salmones Antártica | modificada | 6 | 5 | NO |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | Salmones Austral | modificada | 8 | 0 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | Salmones Camanchaca | modificada | 13 | 16 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | Salmones Yadrán | modificada | 11 | 5 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_estimados` | Titulares Menores Aysén | modificada | 1 | 0 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_padron` | AquaChile | modificada | 69 | 74 | NO |
| Holdings Salmoneros (N=13) | `holding_centros_activos_padron` | Australis Seafoods | modificada | 16 | 11 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_padron` | Cermaq Chile | modificada | 25 | 16 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_padron` | Cooke Aquaculture Chile | modificada | 6 | 18 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_padron` | Invermar | modificada | 10 | 0 | SI |
| Holdings Salmoneros (N=13) | `holding_centros_activos_padron` | Mowi Chile | modificada | 32 | 34 | NO |
| Holdings Salmoneros (N=13) | `holding_centros_activos_padron` | Multi X | modificada | 27 | 45 | SI |
| ... | *(53 cambios adicionales resumidos)* | - | - | - | - | - |

## 6. Detalle de Conectores en `curated_fallback`

| Conector | Modo | HTTP | Nodos | Motivo registrado |
|---|---|---|---|---|
| `cne_combustibles` | `curated_fallback` | N/A | #13 | CKAN package_search no respondio 200 (URLError: <urlopen error [Errno -2] Name or service not known>) |
| `cne_energia` | `curated_fallback` | N/A | #11 | CKAN package_search no respondio 200 (URLError: <urlopen error [Errno -2] Name or service not known>) |
| `subpesca` | `curated_fallback` | 404 | #6 | 2 candidato(s) fallaron: sin respuesta / 404 |
| `bbnn` | `curated_fallback` | N/A | #22 | 2 candidato(s) fallaron: sin respuesta / sin respuesta |
| `conaf` | `curated_fallback` | N/A | #27 | 2 candidato(s) fallaron: 404 / sin respuesta |
| `sinca` | `curated_fallback` | 403 | #30 | SINCA no respondio 200 (HTTP 403 Forbidden) |

