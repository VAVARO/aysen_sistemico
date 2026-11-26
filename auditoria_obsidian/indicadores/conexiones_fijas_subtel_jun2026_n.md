---
id: respaldo_indicador_conexiones_fijas_subtel_jun2026_n
title: "Respaldo de Indicador — Conexiones Totales de Internet Fija SUBTEL (Junio 2026) (conexiones_fijas_subtel_jun2026_n)"
type: respaldo_indicador
variable_clave: "conexiones_fijas_subtel_jun2026_n"
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

# Respaldo de Indicador: `conexiones_fijas_subtel_jun2026_n`

- **Nombre**: Conexiones Totales de Internet Fija SUBTEL (Junio 2026)
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #14
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: conexiones
- **Fuente oficial**: Subsecretaría de Telecomunicaciones (SUBTEL) — Proyecto FOA (https://www.subtel.gob.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 189 -> 68 (Variación de -64,0% (umbral operativo >= 20%)); O'Higgins: 272 -> 72 (Variación de -73,5% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Series SUBTEL Junio 2026 (26.294 conexiones fijas regionales) reconciliadas con Censo 2024

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 15.785 | 15.986 | 201 | +1,3% | NO |
| `11102` | Lago Verde | 189 | 68 | -121 | -64,0% | SI (Variación de -64,0% (umbral operativo >= 20%)) |
| `11201` | Aysén | 5.748 | 5.868 | 120 | +2,1% | NO |
| `11302` | O'Higgins | 272 | 72 | -200 | -73,5% | SI (Variación de -73,5% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 4 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
