---
id: respaldo_indicador_deficit_habitacional_cualitativo_n
title: "Respaldo de Indicador — Déficit Habitacional Cualitativo (MINVU) (deficit_habitacional_cualitativo_n)"
type: respaldo_indicador
variable_clave: "deficit_habitacional_cualitativo_n"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "social"
hub_titulo: "VI. Demografía, Educación y Sociedad"
nodo_id: 41
unidad: "viviendas"
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

# Respaldo de Indicador: `deficit_habitacional_cualitativo_n`

- **Nombre**: Déficit Habitacional Cualitativo (MINVU)
- **Hub / Nodo**: VI. Demografía, Educación y Sociedad · Nodo #41
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: viviendas
- **Fuente oficial**: MINVU / MDSF Registro Social de Hogares / DOH-MOP (https://www.minvu.gob.cl/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · VARIABLE_ELIMINADA]** La variable "deficit_habitacional_cualitativo_n" existía en el baseline y desapareció en la corrida actual. Verificar si fue renombrada o eliminada por error.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 2.893 | N/D | -2.893 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11102` | Lago Verde | 48 | N/D | -48 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11201` | Aysén | 1.168 | N/D | -1.168 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11202` | Cisnes | 281 | N/D | -281 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11203` | Guaitecas | 78 | N/D | -78 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11301` | Cochrane | 189 | N/D | -189 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11302` | O'Higgins | 38 | N/D | -38 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11303` | Tortel | 30 | N/D | -30 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11401` | Chile Chico | 272 | N/D | -272 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11402` | Río Ibáñez | 158 | N/D | -158 | -100,0% | SI (Variable eliminada del Data Lake) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `eliminada` · 10 comuna(s) con cambio/registro · alertas: 1.
- **2026-11-27** ([[corridas/corrida_2026-11-27_head_aprobado_vs_head|corrida_2026-11-27_head_aprobado_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
