---
id: respaldo_indicador_cajavecina_puntos_n
title: "Respaldo de Indicador — Puntos CajaVecina BancoEstado (CMF) (cajavecina_puntos_n)"
type: respaldo_indicador
variable_clave: "cajavecina_puntos_n"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "inversion"
hub_titulo: "V. Economía, Inversión y Suelo"
nodo_id: 20
unidad: "puntos"
en_lexico_oficial: true
ultimo_estado: "agregada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-agregada
---

# Respaldo de Indicador: `cajavecina_puntos_n`

- **Nombre**: Puntos CajaVecina BancoEstado (CMF)
- **Hub / Nodo**: V. Economía, Inversión y Suelo · Nodo #20
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: puntos
- **Fuente oficial**: Servicio de Impuestos Internos (SII) — Subdirección de Estudios (https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | N/D | 145 | 145 | N/A (desde 0) | NO |
| `11102` | Lago Verde | N/D | 14 | 14 | N/A (desde 0) | NO |
| `11201` | Aysén | N/D | 85 | 85 | N/A (desde 0) | NO |
| `11202` | Cisnes | N/D | 42 | 42 | N/A (desde 0) | NO |
| `11203` | Guaitecas | N/D | 20 | 20 | N/A (desde 0) | NO |
| `11301` | Cochrane | N/D | 34 | 34 | N/A (desde 0) | NO |
| `11302` | O'Higgins | N/D | 10 | 10 | N/A (desde 0) | NO |
| `11303` | Tortel | N/D | 12 | 12 | N/A (desde 0) | NO |
| `11401` | Chile Chico | N/D | 28 | 28 | N/A (desde 0) | NO |
| `11402` | Río Ibáñez | N/D | 25 | 25 | N/A (desde 0) | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `agregada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
