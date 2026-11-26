---
id: respaldo_indicador_empresas_sii
title: "Respaldo de Indicador — Empresas Activas Registradas ante SII (empresas_sii)"
type: respaldo_indicador
variable_clave: "empresas_sii"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "inversion"
hub_titulo: "V. Economía, Inversión y Suelo"
nodo_id: 20
unidad: "empresas"
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

# Respaldo de Indicador: `empresas_sii`

- **Nombre**: Empresas Activas Registradas ante SII
- **Hub / Nodo**: V. Economía, Inversión y Suelo · Nodo #20
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: empresas
- **Fuente oficial**: Servicio de Impuestos Internos (SII) — Subdirección de Estudios (https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Guaitecas: 242 -> 144 (Variación de -40,5% (umbral operativo >= 20%)); Tortel: 84 -> 139 (Variación de +65,5% (umbral operativo >= 20%)); Río Ibáñez: 418 -> 577 (Variación de +38,0% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 7.620 | 7.238 | -382 | -5,0% | NO |
| `11102` | Lago Verde | 118 | 119 | 1 | +0,8% | NO |
| `11201` | Aysén | 2.840 | 2.675 | -165 | -5,8% | NO |
| `11203` | Guaitecas | 242 | 144 | -98 | -40,5% | SI (Variación de -40,5% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 492 | 519 | 27 | +5,5% | NO |
| `11302` | O'Higgins | 96 | 109 | 13 | +13,5% | NO |
| `11303` | Tortel | 84 | 139 | 55 | +65,5% | SI (Variación de +65,5% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 648 | 653 | 5 | +0,8% | NO |
| `11402` | Río Ibáñez | 418 | 577 | 159 | +38,0% | SI (Variación de +38,0% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 9 comuna(s) con cambio/registro · alertas: 1.
- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
