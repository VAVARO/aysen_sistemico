---
id: respaldo_indicador_matricula_ed_superior_sies
title: "Respaldo de Indicador — Matrícula Educación Superior SIES (Comuna) (matricula_ed_superior_sies)"
type: respaldo_indicador
variable_clave: "matricula_ed_superior_sies"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "ctci"
hub_titulo: "X. CTCi e Innovación"
nodo_id: 37
unidad: "estudiantes"
en_lexico_oficial: true
ultimo_estado: "eliminada"
requiere_verificacion: true
ultima_corrida: "2026-11-27"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-eliminada
  - requiere-verificacion
---

# Respaldo de Indicador: `matricula_ed_superior_sies`

- **Nombre**: Matrícula Educación Superior SIES (Comuna)
- **Hub / Nodo**: X. CTCi e Innovación · Nodo #37
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: estudiantes
- **Fuente oficial**: CORFO DataInnovación / FIA / MinCiencia (https://datainnovacion.corfo.cl/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_aprobado_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · VARIABLE_ELIMINADA]** La variable "matricula_ed_superior_sies" existía en el baseline y desapareció en la corrida actual. Verificar si fue renombrada o eliminada por error.

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 2.010 | N/D | -2.010 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11102` | Lago Verde | 0 | N/D | -0 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11201` | Aysén | 317 | N/D | -317 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11202` | Cisnes | 0 | N/D | -0 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11203` | Guaitecas | 0 | N/D | -0 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11301` | Cochrane | 0 | N/D | -0 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11302` | O'Higgins | 0 | N/D | -0 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11303` | Tortel | 0 | N/D | -0 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11401` | Chile Chico | 0 | N/D | -0 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11402` | Río Ibáñez | 0 | N/D | -0 | -100,0% | SI (Variable eliminada del Data Lake) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `eliminada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
