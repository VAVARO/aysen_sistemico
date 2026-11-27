---
id: respaldo_indicador_indice_envejecimiento
title: "Respaldo de Indicador — Índice de Envejecimiento Demográfico (indice_envejecimiento)"
type: respaldo_indicador
variable_clave: "indice_envejecimiento"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 23
unidad: "adultos/100 menores"
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

# Respaldo de Indicador: `indice_envejecimiento`

- **Nombre**: Índice de Envejecimiento Demográfico
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #23
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: adultos/100 menores
- **Fuente oficial**: Instituto Nacional de Estadísticas (INE) / Ministerio de Desarrollo Social y Familia (MDSF) (https://censo2024.ine.gob.cl/)
- **Frecuencia / Modo**: Decenal (Censo) / Bienal (CASEN) · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 78,5 -> 182,8 (Variación de +132,9% (umbral operativo >= 20%)); O'Higgins: 74 -> 41,7 (Variación de -43,6% (umbral operativo >= 20%)); Tortel: 71,5 -> 30,8 (Variación de -56,9% (umbral operativo >= 20%)); Chile Chico: 72,4 -> 92,9 (Variación de +28,3% (umbral operativo >= 20%)); Río Ibáñez: 79,1 -> 121,2 (Variación de +53,2% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11102` | Lago Verde | 78,5 | 182,8 | 104,3 | +132,9% | SI (Variación de +132,9% (umbral operativo >= 20%)) |
| `11201` | Aysén | 67,5 | 61,6 | -5,90 | -8,7% | NO |
| `11202` | Cisnes | 69,4 | 64,1 | -5,30 | -7,6% | NO |
| `11203` | Guaitecas | 58 | 56,5 | -1,50 | -2,6% | NO |
| `11301` | Cochrane | 67,5 | 65 | -2,50 | -3,7% | NO |
| `11302` | O'Higgins | 74 | 41,7 | -32,3 | -43,6% | SI (Variación de -43,6% (umbral operativo >= 20%)) |
| `11303` | Tortel | 71,5 | 30,8 | -40,7 | -56,9% | SI (Variación de -56,9% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 72,4 | 92,9 | 20,5 | +28,3% | SI (Variación de +28,3% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 79,1 | 121,2 | 42,1 | +53,2% | SI (Variación de +53,2% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 9 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
