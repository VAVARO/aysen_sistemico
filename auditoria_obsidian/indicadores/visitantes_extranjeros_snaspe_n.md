---
id: respaldo_indicador_visitantes_extranjeros_snaspe_n
title: "Respaldo de Indicador — Número de Visitantes Extranjeros SNASPE (visitantes_extranjeros_snaspe_n)"
type: respaldo_indicador
variable_clave: "visitantes_extranjeros_snaspe_n"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "turismo"
hub_titulo: "I. Turismo y Áreas Silvestres"
nodo_id: 4
unidad: "visitantes"
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

# Respaldo de Indicador: `visitantes_extranjeros_snaspe_n`

- **Nombre**: Número de Visitantes Extranjeros SNASPE
- **Hub / Nodo**: I. Turismo y Áreas Silvestres · Nodo #4
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: visitantes
- **Fuente oficial**: Corporación Nacional Forestal (CONAF) — Gerencia de Áreas Silvestres Protegidas (https://www.conaf.cl/centro-documental/visitacion-ap-2025/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 10.318 -> 5.679 (Variación de -45,0% (umbral operativo >= 20%)); Lago Verde: 261 -> 0 (Caída a 0 desde 261); Aysén: 10.123 -> 2.410 (Variación de -76,2% (umbral operativo >= 20%)); Cisnes: 26.643 -> 10.632 (Variación de -60,1% (umbral operativo >= 20%)); Guaitecas: 432 -> 0 (Caída a 0 desde 432); Cochrane: 15.842 -> 4.385 (Variación de -72,3% (umbral operativo >= 20%)); O'Higgins: 6.820 -> 0 (Caída a 0 desde 6.820); Tortel: 6.106 -> 0 (Caída a 0 desde 6.106); Chile Chico: 13.167 -> 2.541 (Variación de -80,7% (umbral operativo >= 20%)); Río Ibáñez: 19.680 -> 7.587 (Variación de -61,4% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 10.318 | 5.679 | -4.639 | -45,0% | SI (Variación de -45,0% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 261 | 0 | -261 | -100,0% | SI (Caída a 0 desde 261) |
| `11201` | Aysén | 10.123 | 2.410 | -7.713 | -76,2% | SI (Variación de -76,2% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 26.643 | 10.632 | -16.011 | -60,1% | SI (Variación de -60,1% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 432 | 0 | -432 | -100,0% | SI (Caída a 0 desde 432) |
| `11301` | Cochrane | 15.842 | 4.385 | -11.457 | -72,3% | SI (Variación de -72,3% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 6.820 | 0 | -6.820 | -100,0% | SI (Caída a 0 desde 6.820) |
| `11303` | Tortel | 6.106 | 0 | -6.106 | -100,0% | SI (Caída a 0 desde 6.106) |
| `11401` | Chile Chico | 13.167 | 2.541 | -10.626 | -80,7% | SI (Variación de -80,7% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 19.680 | 7.587 | -12.093 | -61,4% | SI (Variación de -61,4% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
