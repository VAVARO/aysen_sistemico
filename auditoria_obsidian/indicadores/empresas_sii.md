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
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 5.535 -> 7.620 (Variación de +37,7% (umbral operativo >= 20%)); Lago Verde: 76 -> 118 (Variación de +55,3% (umbral operativo >= 20%)); Aysén: 2.100 -> 2.840 (Variación de +35,2% (umbral operativo >= 20%)); Cisnes: 620 -> 895 (Variación de +44,4% (umbral operativo >= 20%)); Guaitecas: 171 -> 242 (Variación de +41,5% (umbral operativo >= 20%)); Cochrane: 295 -> 492 (Variación de +66,8% (umbral operativo >= 20%)); O'Higgins: 57 -> 96 (Variación de +68,4% (umbral operativo >= 20%)); Tortel: 48 -> 84 (Variación de +75,0% (umbral operativo >= 20%)); Chile Chico: 400 -> 648 (Variación de +62,0% (umbral operativo >= 20%)); Río Ibáñez: 238 -> 418 (Variación de +75,6% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 5.535 | 7.620 | 2.085 | +37,7% | SI (Variación de +37,7% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 76 | 118 | 42 | +55,3% | SI (Variación de +55,3% (umbral operativo >= 20%)) |
| `11201` | Aysén | 2.100 | 2.840 | 740 | +35,2% | SI (Variación de +35,2% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 620 | 895 | 275 | +44,4% | SI (Variación de +44,4% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 171 | 242 | 71 | +41,5% | SI (Variación de +41,5% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 295 | 492 | 197 | +66,8% | SI (Variación de +66,8% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 57 | 96 | 39 | +68,4% | SI (Variación de +68,4% (umbral operativo >= 20%)) |
| `11303` | Tortel | 48 | 84 | 36 | +75,0% | SI (Variación de +75,0% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 400 | 648 | 248 | +62,0% | SI (Variación de +62,0% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 238 | 418 | 180 | +75,6% | SI (Variación de +75,6% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
