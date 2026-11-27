---
id: respaldo_indicador_ventas_sii_domicilio_local_muf
title: "Respaldo de Indicador — Ventas SII con Domicilio Tributario en Aysén (Miles de UF) (ventas_sii_domicilio_local_muf)"
type: respaldo_indicador
variable_clave: "ventas_sii_domicilio_local_muf"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "inversion"
hub_titulo: "V. Economía, Inversión y Suelo"
nodo_id: 20
unidad: "Miles de UF"
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

# Respaldo de Indicador: `ventas_sii_domicilio_local_muf`

- **Nombre**: Ventas SII con Domicilio Tributario en Aysén (Miles de UF)
- **Hub / Nodo**: V. Economía, Inversión y Suelo · Nodo #20
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: Miles de UF
- **Fuente oficial**: Servicio de Impuestos Internos (SII) — Subdirección de Estudios (https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Guaitecas: 240 -> 380 (Variación de +58,3% (umbral operativo >= 20%)); Cochrane: 790 -> 620 (Variación de -21,5% (umbral operativo >= 20%)); O'Higgins: 75 -> 170 (Variación de +126,7% (umbral operativo >= 20%)); Tortel: 85 -> 150 (Variación de +76,5% (umbral operativo >= 20%)); Río Ibáñez: 540 -> 410 (Variación de -24,1% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11202` | Cisnes | 1.420 | 1.450 | 30 | +2,1% | NO |
| `11203` | Guaitecas | 240 | 380 | 140 | +58,3% | SI (Variación de +58,3% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 790 | 620 | -170 | -21,5% | SI (Variación de -21,5% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 75 | 170 | 95 | +126,7% | SI (Variación de +126,7% (umbral operativo >= 20%)) |
| `11303` | Tortel | 85 | 150 | 65 | +76,5% | SI (Variación de +76,5% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 1.210 | 1.180 | -30 | -2,5% | NO |
| `11402` | Río Ibáñez | 540 | 410 | -130 | -24,1% | SI (Variación de -24,1% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 7 comuna(s) con cambio/registro · alertas: 1.
- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `agregada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
