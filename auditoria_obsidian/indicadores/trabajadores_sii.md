---
id: respaldo_indicador_trabajadores_sii
title: "Respaldo de Indicador — Trabajadores Dependientes Informados al SII (trabajadores_sii)"
type: respaldo_indicador
variable_clave: "trabajadores_sii"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "inversion"
hub_titulo: "V. Economía, Inversión y Suelo"
nodo_id: 20
unidad: "trabajadores"
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

# Respaldo de Indicador: `trabajadores_sii`

- **Nombre**: Trabajadores Dependientes Informados al SII
- **Hub / Nodo**: V. Economía, Inversión y Suelo · Nodo #20
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: trabajadores
- **Fuente oficial**: Servicio de Impuestos Internos (SII) — Subdirección de Estudios (https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 33.650 -> 20.950 (Variación de -37,7% (umbral operativo >= 20%)); Lago Verde: 460 -> 132 (Variación de -71,3% (umbral operativo >= 20%)); Aysén: 12.780 -> 9.890 (Variación de -22,6% (umbral operativo >= 20%)); Cisnes: 3.770 -> 1.920 (Variación de -49,1% (umbral operativo >= 20%)); Guaitecas: 1.040 -> 265 (Variación de -74,5% (umbral operativo >= 20%)); Cochrane: 1.790 -> 845 (Variación de -52,8% (umbral operativo >= 20%)); O'Higgins: 345 -> 98 (Variación de -71,6% (umbral operativo >= 20%)); Tortel: 295 -> 80 (Variación de -72,9% (umbral operativo >= 20%)); Chile Chico: 2.430 -> 1.140 (Variación de -53,1% (umbral operativo >= 20%)); Río Ibáñez: 1.445 -> 512 (Variación de -64,6% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 33.650 | 20.950 | -12.700 | -37,7% | SI (Variación de -37,7% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 460 | 132 | -328 | -71,3% | SI (Variación de -71,3% (umbral operativo >= 20%)) |
| `11201` | Aysén | 12.780 | 9.890 | -2.890 | -22,6% | SI (Variación de -22,6% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 3.770 | 1.920 | -1.850 | -49,1% | SI (Variación de -49,1% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 1.040 | 265 | -775 | -74,5% | SI (Variación de -74,5% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 1.790 | 845 | -945 | -52,8% | SI (Variación de -52,8% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 345 | 98 | -247 | -71,6% | SI (Variación de -71,6% (umbral operativo >= 20%)) |
| `11303` | Tortel | 295 | 80 | -215 | -72,9% | SI (Variación de -72,9% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 2.430 | 1.140 | -1.290 | -53,1% | SI (Variación de -53,1% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 1.445 | 512 | -933 | -64,6% | SI (Variación de -64,6% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
