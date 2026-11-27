---
id: respaldo_indicador_especies_exoticas_invasoras_n
title: "Respaldo de Indicador — Especies Exóticas Invasoras Registradas (especies_exoticas_invasoras_n)"
type: respaldo_indicador
variable_clave: "especies_exoticas_invasoras_n"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "biodiversidad"
hub_titulo: "VII. Biodiversidad, Clima y Riesgos"
nodo_id: 29
unidad: "especies"
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

# Respaldo de Indicador: `especies_exoticas_invasoras_n`

- **Nombre**: Especies Exóticas Invasoras Registradas
- **Hub / Nodo**: VII. Biodiversidad, Clima y Riesgos · Nodo #29
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: especies
- **Fuente oficial**: Servicio Agrícola y Ganadero (SAG) / MMA / Centro de Investigación en Ecosistemas de la Patagonia (CIEP) (https://especies-exoticas.mma.gob.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-27_head_vs_head|Corrida 2026-11-27]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** O'Higgins: 5 -> 4 (Variación de -20,0% (umbral operativo >= 20%)); Tortel: 4 -> 3 (Variación de -25,0% (umbral operativo >= 20%)); Chile Chico: 4 -> 5 (Variación de +25,0% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11302` | O'Higgins | 5 | 4 | -1 | -20,0% | SI (Variación de -20,0% (umbral operativo >= 20%)) |
| `11303` | Tortel | 4 | 3 | -1 | -25,0% | SI (Variación de -25,0% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 4 | 5 | 1 | +25,0% | SI (Variación de +25,0% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-27** ([[corridas/corrida_2026-11-27_head_vs_head|corrida_2026-11-27_head_vs_head]]): estado `modificada` · 3 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
