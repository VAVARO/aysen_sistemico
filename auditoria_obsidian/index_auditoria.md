---
id: index_auditoria_indicadores
title: "Índice de Auditoría y Respaldos por Indicador — Aysén Sistémico"
type: index_auditoria
updated_at: "2026-11-26"
total_corridas: 2
total_fichas_indicadores: 48
tags:
  - aysen-sistemico
  - auditoria-indicadores
---

# Índice de Auditoría y Respaldos por Indicador

Bitácora estructurada para auditar cambios en los indicadores comunales, Barrios ACS, Holdings, Padrón SUBPESCA y Series Anuales de Aysén Sistémico en revisiones rápidas de 5 minutos.

## Corridas Registradas

- [[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]
- [[corridas/corrida_2026-11-25_head_1_vs_head|corrida_2026-11-25_head_1_vs_head]]

## Fichas de Respaldo por Indicador (Modificados / Nuevos / Alertados)

- [[indicadores/alojamientos_turisticos_rnpst_n|alojamientos_turisticos_rnpst_n]]
- [[indicadores/centros_infa_anaerobica_n|centros_infa_anaerobica_n]]
- [[indicadores/cobertura_empam_pct|cobertura_empam_pct]]
- [[indicadores/cobertura_fibra_hogar_pct|cobertura_fibra_hogar_pct]]
- [[indicadores/cobertura_pscv_pct|cobertura_pscv_pct]]
- [[indicadores/concentracion_estival_pct|concentracion_estival_pct]]
- [[indicadores/desembarque_muelles_total_ton|desembarque_muelles_total_ton]]
- [[indicadores/ecmpo_solicitadas_ha|ecmpo_solicitadas_ha]]
- [[indicadores/ecmpo_traslape_acuicola_n|ecmpo_traslape_acuicola_n]]
- [[indicadores/empleo_act_turismo_n|empleo_act_turismo_n]]
- [[indicadores/empleo_directo_acuicola_n|empleo_directo_acuicola_n]]
- [[indicadores/empresas_act_turismo_sii_n|empresas_act_turismo_sii_n]]
- [[indicadores/empresas_sii|empresas_sii]]
- [[indicadores/estadia_promedio_dias|estadia_promedio_dias]]
- [[indicadores/estadia_regional_viaje_dias|estadia_regional_viaje_dias]]
- [[indicadores/gasto_diario_turista_usd|gasto_diario_turista_usd]]
- [[indicadores/guias_turismo_rnpst_n|guias_turismo_rnpst_n]]
- [[indicadores/llegadas_por_cama_turistica|llegadas_por_cama_turistica]]
- [[indicadores/llegadas_turistas_emat_n|llegadas_turistas_emat_n]]
- [[indicadores/mediana_espera_especialidad_dias|mediana_espera_especialidad_dias]]
- [[indicadores/mediana_espera_quirurgica_dias|mediana_espera_quirurgica_dias]]
- [[indicadores/nota_ciclo_productivo|nota_ciclo_productivo]]
- [[indicadores/operadores_aventura_rnpst_n|operadores_aventura_rnpst_n]]
- [[indicadores/patente_acuicola_pua_mclp|patente_acuicola_pua_mclp]]
- [[indicadores/pernoctaciones_emat|pernoctaciones_emat]]
- [[indicadores/peso_pua_ingresos_propios_pct|peso_pua_ingresos_propios_pct]]
- [[indicadores/prestadores_sernatur|prestadores_sernatur]]
- [[indicadores/prestadores_vigencia_patente_pct|prestadores_vigencia_patente_pct]]
- [[indicadores/restaurantes_turisticos_rnpst_n|restaurantes_turisticos_rnpst_n]]
- [[indicadores/revpar_emat_clp|revpar_emat_clp]]
- [[indicadores/revpar_estimado_usd|revpar_estimado_usd]]
- [[indicadores/sancionatorios_sma_acuicolas_n|sancionatorios_sma_acuicolas_n]]
- [[indicadores/superficie_concesionada_mar_ha|superficie_concesionada_mar_ha]]
- [[indicadores/tarifa_adr_emat_clp|tarifa_adr_emat_clp]]
- [[indicadores/tarifa_adr_estimada_usd|tarifa_adr_estimada_usd]]
- [[indicadores/tasa_ocupacion_emat_estival_pct|tasa_ocupacion_emat_estival_pct]]
- [[indicadores/tasa_ocupacion_estival_pct|tasa_ocupacion_estival_pct]]
- [[indicadores/tasa_ocupacion_invernal_pct|tasa_ocupacion_invernal_pct]]
- [[indicadores/trabajadores_sii|trabajadores_sii]]
- [[indicadores/trabajadores_sii_por_centro_activo|trabajadores_sii_por_centro_activo]]
- [[indicadores/ventas_act_turismo_uf|ventas_act_turismo_uf]]
- [[indicadores/ventas_por_empresa_uf|ventas_por_empresa_uf]]
- [[indicadores/visitantes_atractivos_totales_n|visitantes_atractivos_totales_n]]
- [[indicadores/visitantes_extranjeros_snaspe_n|visitantes_extranjeros_snaspe_n]]
- [[indicadores/visitantes_snaspe|visitantes_snaspe]]
- [[indicadores/visitas_por_cama_turistica|visitas_por_cama_turistica]]
- [[indicadores/visitas_por_pernoctacion_ratio|visitas_por_pernoctacion_ratio]]
- [[indicadores/zoit_nombre|zoit_nombre]]

## Consulta Rápida Dataview (Pendientes de Verificación)

```dataview
TABLE ultimo_estado AS "Estado", hub_titulo AS "Hub", nivel_umbral AS "Umbral", ultima_corrida AS "Corrida"
FROM #respaldo-indicador AND #requiere-verificacion
SORT ultima_corrida DESC
```
