---
id: auditoria_corrida_2026-11-26_head_aprobado_vs_head
title: "Auditoría de Corrida — 2026-11-26 (HEAD_APROBADO vs HEAD)"
type: auditoria_corrida
fecha: "2026-11-26"
baseline: "HEAD_APROBADO"
actual: "HEAD"
semaforo: "ROJO"
total_indicadores: 242
modificados: 0
agregados: 0
eliminados: 0
sin_cambios: 242
alertas_alta: 1
alertas_media: 1
conectores_live_api: 5
conectores_fallback: 6
etapas_restauradas: 1
umbral_outlier_operativo_pct: 20
umbral_outlier_estructural_pct: 5
estado_revision_humana: "aprobada"
fecha_aprobacion_humana: "2026-11-26T23:35:18.789Z"
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
| Indicadores comunales evaluados | 242 actuales (242 en baseline) | 0 modificados · 0 agregados · 0 eliminados · 242 sin cambios |
| Umbrales de salto brusco | Estructural >= 5% · Operativo >= 20% | + transiciones 0/nulo y cambios de signo |
| Alertas para revisión humana | 2 (1 ALTA · 1 MEDIA) | Requiere cierre humano antes de merge a `main` si semáforo != VERDE |
| Salud de conectores automáticos | 5 live_api · 6 curated_fallback | 1 etapa(s) restaurada(s) · Última corrida API: `2026-11-02T12:13:30+00:00` |

### Checklist de Cierre Humano
- [ ] Revisar logs de GitHub Actions (`actualizacion_mensual.yml` / `verificacion.yml`) sin errores bloqueantes.
- [ ] Confirmar cobertura esperada de indicadores y conectores en `curated_fallback`.
- [ ] Validar cada outlier o variable nueva listada en la Sección 2 antes de aprobar el PR.
- [ ] Ejecutar `node scripts/obsidian_indicator_audit.cjs --approve-latest --sync-to-vault` para aprobar y fijar el nuevo baseline.

## 2. Qué Requiere Verificación Humana

- [ ] **[ALTA · ETAPA_RESTAURADA]** `pipeline_ingesta` (Infraestructura / Ingesta): 1 etapa(s) fueron restauradas por Circuit Breaker (Last-Known-Good) en la última corrida automática (2026-11-02T12:13:30+00:00).
- [ ] **[MEDIA · CONECTOR_FALLBACK]** `pipeline_ingesta` (Infraestructura / Ingesta): 6 conector(es) operaron en curated_fallback: cne_combustibles, cne_energia, subpesca, bbnn, conaf, sinca. Los datos previos se conservaron, pero conviene verificar si hubo actualización oficial pendiente.

## 3. Qué Cambió en esta Corrida (Indicadores Comunales)

Sin variaciones numéricas ni estructurales en `dataLake.comunas` respecto al baseline.
## 4. Qué Quedó Igual (Resumen por 10 Hubs Canónicos)

**242 indicadores comunales** mantuvieron valores idénticos en las 10 comunas de Aysén. No se generan fichas individuales vacías para evitar ruido en el grafo de Obsidian.

| Hub Canónico | Indicadores sin cambios |
|---|---|
| I. Turismo y Áreas Silvestres | 31 |
| II. Pesca, Acuicultura y Mar | 23 |
| III. Energía y Telecomunicaciones | 28 |
| IV. Gobernanza y Finanzas | 45 |
| IX. Cultura y Patrimonio | 15 |
| V. Economía, Inversión y Suelo | 21 |
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

