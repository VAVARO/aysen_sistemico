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
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_aprobado_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Aysén: 73,3 -> 48,5 (Variación de -33,8% (umbral operativo >= 20%)); Guaitecas: 8,30 -> 10,9 (Variación de +31,3% (umbral operativo >= 20%))

## Comparación Comunal (HEAD_APROBADO vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11201` | Aysén | 73,3 | 48,5 | -24,8 | -33,8% | SI (Variación de -33,8% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 24,6 | 22,5 | -2,10 | -8,5% | NO |
| `11203` | Guaitecas | 8,30 | 10,9 | 2,60 | +31,3% | SI (Variación de +31,3% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_aprobado_vs_head|corrida_2026-11-26_head_aprobado_vs_head]]): estado `modificada` · 3 comuna(s) con cambio/registro · alertas: 1.
- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 3 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
