---
id: respaldo_indicador_participacion_municipales_2024_pct
title: "Respaldo de Indicador — Participación Electoral Municipales 2024 (participacion_municipales_2024_pct)"
type: respaldo_indicador
variable_clave: "participacion_municipales_2024_pct"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "gobernanza"
hub_titulo: "IV. Gobernanza y Finanzas"
nodo_id: 17
unidad: "%"
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

# Respaldo de Indicador: `participacion_municipales_2024_pct`

- **Nombre**: Participación Electoral Municipales 2024
- **Hub / Nodo**: IV. Gobernanza y Finanzas · Nodo #17
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: %
- **Fuente oficial**: Servicio Electoral de Chile (SERVEL) / Tribunal Calificador de Elecciones (TRICEL) (https://www.servel.cl/)
- **Frecuencia / Modo**: Cuatrienal (Vigente 2024–2028) · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** O'Higgins: 88 -> 67,9 (Variación de -22,8% (umbral operativo >= 20%)); Chile Chico: 83,6 -> 58,4 (Variación de -30,1% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 84,2 | 72,8 | -11,4 | -13,5% | NO |
| `11102` | Lago Verde | 87,5 | 80,5 | -7 | -8,0% | NO |
| `11201` | Aysén | 82,8 | 75,1 | -7,70 | -9,3% | NO |
| `11202` | Cisnes | 83,1 | 77,9 | -5,20 | -6,3% | NO |
| `11203` | Guaitecas | 85,9 | 74,1 | -11,8 | -13,7% | NO |
| `11301` | Cochrane | 85,2 | 70,2 | -15 | -17,6% | NO |
| `11302` | O'Higgins | 88 | 67,9 | -20,1 | -22,8% | SI (Variación de -22,8% (umbral operativo >= 20%)) |
| `11303` | Tortel | 87,3 | 80,6 | -6,70 | -7,7% | NO |
| `11401` | Chile Chico | 83,6 | 58,4 | -25,2 | -30,1% | SI (Variación de -30,1% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 86,4 | 77,2 | -9,20 | -10,6% | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
