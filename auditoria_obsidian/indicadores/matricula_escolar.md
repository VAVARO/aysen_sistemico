---
id: respaldo_indicador_matricula_escolar
title: "Respaldo de Indicador — Matrícula Escolar Total SLEP (matricula_escolar)"
type: respaldo_indicador
variable_clave: "matricula_escolar"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 25
unidad: "alumnos"
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

# Respaldo de Indicador: `matricula_escolar`

- **Nombre**: Matrícula Escolar Total SLEP
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #25
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: alumnos
- **Fuente oficial**: Ministerio de Educación (MINEDUC) — Centro de Estudios / Servicio Local de Educación Pública (SLEP Aysén) (https://datosabiertos.mineduc.cl/)
- **Frecuencia / Modo**: Anual · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Lago Verde: 95 -> 54 (Variación de -43,2% (umbral operativo >= 20%)); Río Ibáñez: 450 -> 353 (Variación de -21,6% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 13.450 | 13.284 | -166 | -1,2% | NO |
| `11102` | Lago Verde | 95 | 54 | -41 | -43,2% | SI (Variación de -43,2% (umbral operativo >= 20%)) |
| `11201` | Aysén | 4.850 | 5.286 | 436 | +9,0% | NO |
| `11202` | Cisnes | 980 | 1.011 | 31 | +3,2% | NO |
| `11203` | Guaitecas | 320 | 290 | -30 | -9,4% | NO |
| `11301` | Cochrane | 750 | 740 | -10 | -1,3% | NO |
| `11302` | O'Higgins | 120 | 123 | 3 | +2,5% | NO |
| `11303` | Tortel | 85 | 82 | -3 | -3,5% | NO |
| `11401` | Chile Chico | 890 | 864 | -26 | -2,9% | NO |
| `11402` | Río Ibáñez | 450 | 353 | -97 | -21,6% | SI (Variación de -21,6% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
