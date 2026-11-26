---
id: respaldo_indicador_puntos_cajavecina_bancoestado
title: "Respaldo de Indicador — Puntos CajaVecina BancoEstado (puntos_cajavecina_bancoestado)"
type: respaldo_indicador
variable_clave: "puntos_cajavecina_bancoestado"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "inversion"
hub_titulo: "V. Economía, Inversión y Suelo"
nodo_id: 20
unidad: "puntos"
en_lexico_oficial: true
ultimo_estado: "eliminada"
requiere_verificacion: true
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-eliminada
  - requiere-verificacion
---

# Respaldo de Indicador: `puntos_cajavecina_bancoestado`

- **Nombre**: Puntos CajaVecina BancoEstado
- **Hub / Nodo**: V. Economía, Inversión y Suelo · Nodo #20
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: puntos
- **Fuente oficial**: Servicio de Impuestos Internos (SII) — Subdirección de Estudios (https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · VARIABLE_ELIMINADA]** La variable "puntos_cajavecina_bancoestado" existía en el baseline y desapareció en la corrida actual. Verificar si fue renombrada o eliminada por error.

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 145 | N/D | -145 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11102` | Lago Verde | 14 | N/D | -14 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11201` | Aysén | 85 | N/D | -85 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11202` | Cisnes | 42 | N/D | -42 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11203` | Guaitecas | 20 | N/D | -20 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11301` | Cochrane | 34 | N/D | -34 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11302` | O'Higgins | 10 | N/D | -10 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11303` | Tortel | 12 | N/D | -12 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11401` | Chile Chico | 28 | N/D | -28 | -100,0% | SI (Variable eliminada del Data Lake) |
| `11402` | Río Ibáñez | 25 | N/D | -25 | -100,0% | SI (Variable eliminada del Data Lake) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `eliminada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
