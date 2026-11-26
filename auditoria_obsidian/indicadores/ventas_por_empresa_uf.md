---
id: respaldo_indicador_ventas_por_empresa_uf
title: "Respaldo de Indicador — Ventas Promedio por Empresa SII (ventas_por_empresa_uf)"
type: respaldo_indicador
variable_clave: "ventas_por_empresa_uf"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "inversion"
hub_titulo: "V. Economía, Inversión y Suelo"
nodo_id: 20
unidad: "UF/empresa"
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

# Respaldo de Indicador: `ventas_por_empresa_uf`

- **Nombre**: Ventas Promedio por Empresa SII
- **Hub / Nodo**: V. Economía, Inversión y Suelo · Nodo #20
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: UF/empresa
- **Fuente oficial**: Servicio de Impuestos Internos (SII) — Subdirección de Estudios (https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 8.762 -> 6.365 (Variación de -27,4% (umbral operativo >= 20%)); Lago Verde: 5.921 -> 3.814 (Variación de -35,6% (umbral operativo >= 20%)); Aysén: 26.762 -> 19.789 (Variación de -26,1% (umbral operativo >= 20%)); Cisnes: 14.677 -> 10.168 (Variación de -30,7% (umbral operativo >= 20%)); Guaitecas: 14.327 -> 10.124 (Variación de -29,3% (umbral operativo >= 20%)); Cochrane: 14.915 -> 8.943 (Variación de -40,0% (umbral operativo >= 20%)); O'Higgins: 9.298 -> 5.521 (Variación de -40,6% (umbral operativo >= 20%)); Tortel: 8.125 -> 4.643 (Variación de -42,9% (umbral operativo >= 20%)); Chile Chico: 15.750 -> 9.722 (Variación de -38,3% (umbral operativo >= 20%)); Río Ibáñez: 13.445 -> 7.656 (Variación de -43,1% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 8.762 | 6.365 | -2.397 | -27,4% | SI (Variación de -27,4% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 5.921 | 3.814 | -2.107 | -35,6% | SI (Variación de -35,6% (umbral operativo >= 20%)) |
| `11201` | Aysén | 26.762 | 19.789 | -6.973 | -26,1% | SI (Variación de -26,1% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 14.677 | 10.168 | -4.509 | -30,7% | SI (Variación de -30,7% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 14.327 | 10.124 | -4.203 | -29,3% | SI (Variación de -29,3% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 14.915 | 8.943 | -5.972 | -40,0% | SI (Variación de -40,0% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 9.298 | 5.521 | -3.777 | -40,6% | SI (Variación de -40,6% (umbral operativo >= 20%)) |
| `11303` | Tortel | 8.125 | 4.643 | -3.482 | -42,9% | SI (Variación de -42,9% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 15.750 | 9.722 | -6.028 | -38,3% | SI (Variación de -38,3% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 13.445 | 7.656 | -5.789 | -43,1% | SI (Variación de -43,1% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
