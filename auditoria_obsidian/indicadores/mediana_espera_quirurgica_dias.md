---
id: respaldo_indicador_mediana_espera_quirurgica_dias
title: "Respaldo de Indicador — Mediana de Espera Quirúrgica No GES (mediana_espera_quirurgica_dias)"
type: respaldo_indicador
variable_clave: "mediana_espera_quirurgica_dias"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "salud"
hub_titulo: "VIII. Salud"
nodo_id: 38
unidad: "días"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
---

# Respaldo de Indicador: `mediana_espera_quirurgica_dias`

- **Nombre**: Mediana de Espera Quirúrgica No GES
- **Hub / Nodo**: VIII. Salud · Nodo #38
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: días
- **Fuente oficial**: Servicio de Salud Aysén (SSA) / DEIS MINSAL (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 342 | 318 | -24 | -7,0% | NO |
| `11102` | Lago Verde | 425 | 418 | -7 | -1,6% | NO |
| `11201` | Aysén | 365 | 354 | -11 | -3,0% | NO |
| `11202` | Cisnes | 388 | 412 | 24 | +6,2% | NO |
| `11203` | Guaitecas | 438 | 468 | 30 | +6,8% | NO |
| `11301` | Cochrane | 392 | 368 | -24 | -6,1% | NO |
| `11302` | O'Higgins | 416 | 436 | 20 | +4,8% | NO |
| `11303` | Tortel | 402 | 388 | -14 | -3,5% | NO |
| `11401` | Chile Chico | 378 | 364 | -14 | -3,7% | NO |
| `11402` | Río Ibáñez | 404 | 424 | 20 | +5,0% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
