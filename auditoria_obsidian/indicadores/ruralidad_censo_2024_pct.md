---
id: respaldo_indicador_ruralidad_censo_2024_pct
title: "Respaldo de Indicador — Porcentaje de Población Rural Censo 2024 (INE) (ruralidad_censo_2024_pct)"
type: respaldo_indicador
variable_clave: "ruralidad_censo_2024_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 23
unidad: "%"
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

# Respaldo de Indicador: `ruralidad_censo_2024_pct`

- **Nombre**: Porcentaje de Población Rural Censo 2024 (INE)
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #23
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: %
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / Ministerio de Desarrollo Social y Familia (MDSF) (https://censo2024.ine.gob.cl/)
- **Frecuencia / Modo**: Decenal (Censo) / Bienal (CASEN) · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 19 -> 12,1 (Variación de -36,3% (umbral operativo >= 20%)); Cisnes: 28,1 -> 54 (Variación de +92,2% (umbral operativo >= 20%)); Guaitecas: 8,10 -> 26 (Variación de +221,0% (umbral operativo >= 20%)); Río Ibáñez: 100 -> 72 (Variación de -28,0% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 19 | 12,1 | -6,90 | -36,3% | SI (Variación de -36,3% (umbral operativo >= 20%)) |
| `11201` | Aysén | 14,7 | 15,4 | 0,70 | +4,8% | NO |
| `11202` | Cisnes | 28,1 | 54 | 25,9 | +92,2% | SI (Variación de +92,2% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 8,10 | 26 | 17,9 | +221,0% | SI (Variación de +221,0% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 21,8 | 22 | 0,20 | +0,9% | NO |
| `11401` | Chile Chico | 37,2 | 35 | -2,20 | -5,9% | NO |
| `11402` | Río Ibáñez | 100 | 72 | -28 | -28,0% | SI (Variación de -28,0% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 7 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
