---
id: respaldo_indicador_salud_principal
title: "Respaldo de Indicador — Establecimiento de Salud Principal Comunal (salud_principal)"
type: respaldo_indicador
variable_clave: "salud_principal"
tipo_dato: "categorical"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "salud"
hub_titulo: "VIII. Salud"
nodo_id: 24
unidad: "establecimiento"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: false
ultima_corrida: "2026-11-27"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
---

# Respaldo de Indicador: `salud_principal`

- **Nombre**: Establecimiento de Salud Principal Comunal
- **Hub / Nodo**: VIII. Salud · Nodo #24
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: establecimiento
- **Fuente oficial**: Ministerio de Salud (MINSAL) — Departamento de Estadísticas e Información de Salud (DEIS) / Servicio de Salud Aysén (SSA) (https://deis.minsal.cl/)
- **Frecuencia / Modo**: Mensual · `live_api`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11102` | Lago Verde | Sin hospital en la comuna (Atencion Primaria Rural) | Sin hospital en la comuna (3 PSR dependientes del DAP SSA) | N/D | N/A (desde 0) | NO |
| `11203` | Guaitecas | Sin hospital en el archipielago (Cobertura por CESFAM Melinka) | Sin hospital en el archipielago (Posta de Salud Rural Melinka con SUR, DEIS SSA) | N/D | N/A (desde 0) | NO |
| `11301` | Cochrane | Hospital Comunitario de Cochrane (Hospital Lord Cochrane) | Hospital Lord Cochrane | N/D | N/A (desde 0) | NO |
| `11302` | O'Higgins | Sin hospital en la comuna (Posta Rural de Aislamiento Extremo) | Sin hospital en la comuna (PSR Villa O'Higgins con 2 medicos EDF permanentes jun-2026) | N/D | N/A (desde 0) | NO |
| `11303` | Tortel | Sin hospital en la comuna (Posta Rural de Dificil Acceso en Pasarelas) | Sin hospital en la comuna (PSR Caleta Tortel en pasarelas de cipres) | N/D | N/A (desde 0) | NO |
| `11401` | Chile Chico | Hospital Familiar y Comunitario San Jose / Dr. Leopoldo Ortega Rodriguez de Chile Chico | Hospital Dr. Leopoldo Ortega Rodriguez de Chile Chico | N/D | N/A (desde 0) | NO |
| `11402` | Río Ibáñez | Sin hospital en la comuna (Atencion Primaria con CESFAM y Postas) | Sin hospital en la comuna (5 PSR y 2 EMR dependientes del DAP SSA) | N/D | N/A (desde 0) | NO |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 7 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
