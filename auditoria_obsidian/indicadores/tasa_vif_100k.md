---
id: respaldo_indicador_tasa_vif_100k
title: "Respaldo de Indicador — Tasa Denuncias Violencia Intrafamiliar (VIF) (tasa_vif_100k)"
type: respaldo_indicador
variable_clave: "tasa_vif_100k"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 26
unidad: "casos/100k hab"
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

# Respaldo de Indicador: `tasa_vif_100k`

- **Nombre**: Tasa Denuncias Violencia Intrafamiliar (VIF)
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #26
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: casos/100k hab
- **Fuente oficial**: Subsecretaría de Prevención del Delito (SPD) — Centro de Estudios y Análisis del Delito (CEAD) (https://cead.minsegpublica.gob.cl/)
- **Frecuencia / Modo**: Trimestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 940,8 -> 730,1 (Variación de -22,4% (umbral operativo >= 20%)); Lago Verde: 385 -> 548,2 (Variación de +42,4% (umbral operativo >= 20%)); Cisnes: 620 -> 749,3 (Variación de +20,9% (umbral operativo >= 20%)); O'Higgins: 410 -> 740,7 (Variación de +80,7% (umbral operativo >= 20%)); Tortel: 390 -> 687,3 (Variación de +76,2% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 940,8 | 730,1 | -210,7 | -22,4% | SI (Variación de -22,4% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 385 | 548,2 | 163,2 | +42,4% | SI (Variación de +42,4% (umbral operativo >= 20%)) |
| `11201` | Aysén | 1.080,5 | 1.157,9 | 77,4 | +7,2% | NO |
| `11202` | Cisnes | 620 | 749,3 | 129,3 | +20,9% | SI (Variación de +20,9% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 540 | 496,6 | -43,4 | -8,0% | NO |
| `11301` | Cochrane | 690 | 773,1 | 83,1 | +12,0% | NO |
| `11302` | O'Higgins | 410 | 740,7 | 330,7 | +80,7% | SI (Variación de +80,7% (umbral operativo >= 20%)) |
| `11303` | Tortel | 390 | 687,3 | 297,3 | +76,2% | SI (Variación de +76,2% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 710 | 755,4 | 45,4 | +6,4% | NO |
| `11402` | Río Ibáñez | 480 | 552,9 | 72,9 | +15,2% | NO |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
