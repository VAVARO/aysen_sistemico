---
id: respaldo_indicador_postas_salud_rural
title: "Respaldo de Indicador — Postas de Salud Rural (PSR) (postas_salud_rural)"
type: respaldo_indicador
variable_clave: "postas_salud_rural"
tipo_dato: "numeric"
nivel_umbral: "estructural"
umbral_outlier_pct: 5
hub: "salud"
hub_titulo: "VIII. Salud"
nodo_id: 38
unidad: "postas"
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

# Respaldo de Indicador: `postas_salud_rural`

- **Nombre**: Postas de Salud Rural (PSR)
- **Hub / Nodo**: VIII. Salud · Nodo #38
- **Umbral de outlier**: estructural (>= 5%)
- **Unidad**: postas
- **Fuente oficial**: Servicio de Salud Aysén (SSA) / DEIS MINSAL (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Aysén: 4 -> 2 (Variación de -50,0% (umbral estructural >= 5%)); Cochrane: 1 -> 0 (Caída a 0 desde 1); Chile Chico: 2 -> 3 (Variación de +50,0% (umbral estructural >= 5%)); Río Ibáñez: 3 -> 5 (Variación de +66,7% (umbral estructural >= 5%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11201` | Aysén | 4 | 2 | -2 | -50,0% | SI (Variación de -50,0% (umbral estructural >= 5%)) |
| `11301` | Cochrane | 1 | 0 | -1 | -100,0% | SI (Caída a 0 desde 1) |
| `11401` | Chile Chico | 2 | 3 | 1 | +50,0% | SI (Variación de +50,0% (umbral estructural >= 5%)) |
| `11402` | Río Ibáñez | 3 | 5 | 2 | +66,7% | SI (Variación de +66,7% (umbral estructural >= 5%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 4 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
