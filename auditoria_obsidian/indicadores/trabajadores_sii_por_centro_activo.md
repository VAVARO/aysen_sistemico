---
id: respaldo_indicador_trabajadores_sii_por_centro_activo
title: "Respaldo de Indicador — Trabajadores SII por Centro Acuícola Activo (trabajadores_sii_por_centro_activo)"
type: respaldo_indicador
variable_clave: "trabajadores_sii_por_centro_activo"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "salmonicultura"
hub_titulo: "II. Pesca, Acuicultura y Mar"
nodo_id: 6
unidad: "trabajadores/centro"
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

# Respaldo de Indicador: `trabajadores_sii_por_centro_activo`

- **Nombre**: Trabajadores SII por Centro Acuícola Activo
- **Hub / Nodo**: II. Pesca, Acuicultura y Mar · Nodo #6
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: trabajadores/centro
- **Fuente oficial**: Subsecretaría de Pesca y Acuicultura (SUBPESCA) / Servicio Nacional de Pesca y Acuicultura (SERNAPESCA) (https://www.subpesca.cl/portal/619/w3-propertyvalue-50834.html)
- **Frecuencia / Modo**: Trimestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Aysén: 94,7 -> 73,3 (Variación de -22,6% (umbral operativo >= 20%)); Cisnes: 48,3 -> 24,6 (Variación de -49,1% (umbral operativo >= 20%)); Guaitecas: 32,5 -> 8,30 (Variación de -74,5% (umbral operativo >= 20%))

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11201` | Aysén | 94,7 | 73,3 | -21,4 | -22,6% | SI (Variación de -22,6% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 48,3 | 24,6 | -23,7 | -49,1% | SI (Variación de -49,1% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 32,5 | 8,30 | -24,2 | -74,5% | SI (Variación de -74,5% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 3 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
