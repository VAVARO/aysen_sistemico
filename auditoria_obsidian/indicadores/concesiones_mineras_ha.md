---
id: respaldo_indicador_concesiones_mineras_ha
title: "Respaldo de Indicador — Superficie de Concesiones Mineras SERNAGEOMIN (concesiones_mineras_ha)"
type: respaldo_indicador
variable_clave: "concesiones_mineras_ha"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "inversion"
hub_titulo: "V. Economía, Inversión y Suelo"
nodo_id: 21
unidad: "ha"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: true
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
  - requiere-verificacion
---

# Respaldo de Indicador: `concesiones_mineras_ha`

- **Nombre**: Superficie de Concesiones Mineras SERNAGEOMIN
- **Hub / Nodo**: V. Economía, Inversión y Suelo · Nodo #21
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: ha
- **Fuente oficial**: Servicio Nacional de Geología y Minería (SERNAGEOMIN) — Departamento de Propiedad Minera (https://www.sernageomin.cl/mineria/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 31.500 -> 21.573 (Variación de -31,5% (umbral operativo >= 20%)); Lago Verde: 8.900 -> 24.800 (Variación de +178,7% (umbral operativo >= 20%)); Cisnes: 16.800 -> 2.300 (Variación de -86,3% (umbral operativo >= 20%)); Guaitecas: 400 -> 0 (Caída a 0 desde 400); Cochrane: 9.800 -> 1.201 (Variación de -87,7% (umbral operativo >= 20%)); O'Higgins: 5.600 -> 9.800 (Variación de +75,0% (umbral operativo >= 20%)); Tortel: 3.200 -> 0 (Caída a 0 desde 3.200); Río Ibáñez: 19.600 -> 7.400 (Variación de -62,2% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 31.500 | 21.573 | -9.927 | -31,5% | SI (Variación de -31,5% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 8.900 | 24.800 | 15.900 | +178,7% | SI (Variación de +178,7% (umbral operativo >= 20%)) |
| `11201` | Aysén | 12.400 | 13.900 | 1.500 | +12,1% | NO |
| `11202` | Cisnes | 16.800 | 2.300 | -14.500 | -86,3% | SI (Variación de -86,3% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 400 | 0 | -400 | -100,0% | SI (Caída a 0 desde 400) |
| `11301` | Cochrane | 9.800 | 1.201 | -8.599 | -87,7% | SI (Variación de -87,7% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 5.600 | 9.800 | 4.200 | +75,0% | SI (Variación de +75,0% (umbral operativo >= 20%)) |
| `11303` | Tortel | 3.200 | 0 | -3.200 | -100,0% | SI (Caída a 0 desde 3.200) |
| `11401` | Chile Chico | 48.200 | 47.537 | -663 | -1,4% | NO |
| `11402` | Río Ibáñez | 19.600 | 7.400 | -12.200 | -62,2% | SI (Variación de -62,2% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
