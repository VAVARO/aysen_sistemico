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
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 132 -> 213 (Variación de +61,4% (umbral operativo >= 20%)); Aysén: 9.890 -> 6.551 (Variación de -33,8% (umbral operativo >= 20%)); Guaitecas: 265 -> 349 (Variación de +31,7% (umbral operativo >= 20%)); Cochrane: 845 -> 475 (Variación de -43,8% (umbral operativo >= 20%)); O'Higgins: 98 -> 148 (Variación de +51,0% (umbral operativo >= 20%)); Tortel: 80 -> 145 (Variación de +81,3% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 20.950 | 22.351 | 1.401 | +6,7% | NO |
| `11102` | Lago Verde | 132 | 213 | 81 | +61,4% | SI (Variación de +61,4% (umbral operativo >= 20%)) |
| `11201` | Aysén | 9.890 | 6.551 | -3.339 | -33,8% | SI (Variación de -33,8% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 1.920 | 1.757 | -163 | -8,5% | NO |
| `11203` | Guaitecas | 265 | 349 | 84 | +31,7% | SI (Variación de +31,7% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 845 | 475 | -370 | -43,8% | SI (Variación de -43,8% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 98 | 148 | 50 | +51,0% | SI (Variación de +51,0% (umbral operativo >= 20%)) |
| `11303` | Tortel | 80 | 145 | 65 | +81,3% | SI (Variación de +81,3% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 1.140 | 965 | -175 | -15,4% | NO |
| `11402` | Río Ibáñez | 512 | 575 | 63 | +12,3% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.
- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
