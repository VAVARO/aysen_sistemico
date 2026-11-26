---
id: respaldo_indicador_conexiones_residenciales_subtel_jun2026_n
title: "Respaldo de Indicador — Conexiones Residenciales de Internet Fija SUBTEL (Junio 2026) (conexiones_residenciales_subtel_jun2026_n)"
type: respaldo_indicador
variable_clave: "conexiones_residenciales_subtel_jun2026_n"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 14
unidad: "conexiones"
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

# Respaldo de Indicador: `conexiones_residenciales_subtel_jun2026_n`

- **Nombre**: Conexiones Residenciales de Internet Fija SUBTEL (Junio 2026)
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #14
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: conexiones
- **Fuente oficial**: Subsecretaría de Telecomunicaciones (SUBTEL) — Proyecto FOA (https://www.subtel.gob.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 159 -> 56 (Variación de -64,8% (umbral operativo >= 20%)); O'Higgins: 249 -> 58 (Variación de -76,7% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Series SUBTEL Junio 2026 (24.782 residenciales <= hogares Censo 2024 por comuna)

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 15.088 | 15.279 | 191 | +1,3% | NO |
| `11102` | Lago Verde | 159 | 56 | -103 | -64,8% | SI (Variación de -64,8% (umbral operativo >= 20%)) |
| `11201` | Aysén | 5.353 | 5.456 | 103 | +1,9% | NO |
| `11302` | O'Higgins | 249 | 58 | -191 | -76,7% | SI (Variación de -76,7% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 4 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
