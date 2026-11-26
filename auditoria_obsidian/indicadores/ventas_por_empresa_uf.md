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
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Guaitecas: 10.124 -> 17.014 (Variación de +68,1% (umbral operativo >= 20%)); Tortel: 4.643 -> 2.806 (Variación de -39,6% (umbral operativo >= 20%)); Río Ibáñez: 7.656 -> 5.546 (Variación de -27,6% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 6.365 | 6.701 | 336 | +5,3% | NO |
| `11102` | Lago Verde | 3.814 | 3.782 | -32 | -0,8% | NO |
| `11201` | Aysén | 19.789 | 21.009 | 1.220 | +6,2% | NO |
| `11203` | Guaitecas | 10.124 | 17.014 | 6.890 | +68,1% | SI (Variación de +68,1% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 8.943 | 8.478 | -465 | -5,2% | NO |
| `11302` | O'Higgins | 5.521 | 4.862 | -659 | -11,9% | NO |
| `11303` | Tortel | 4.643 | 2.806 | -1.837 | -39,6% | SI (Variación de -39,6% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 9.722 | 9.648 | -74 | -0,8% | NO |
| `11402` | Río Ibáñez | 7.656 | 5.546 | -2.110 | -27,6% | SI (Variación de -27,6% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 9 comuna(s) con cambio/registro · alertas: 1.
- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
