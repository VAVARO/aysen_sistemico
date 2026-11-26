---
id: nodo_13
title: "Nodo #13 — Precios de Combustibles y Leña por Comuna (CNE)"
type: nodo
hub_id: energia
hub_roman: III
variables_clave:
  - gasolina_93_clp
  - precio_lena_m3
  - hogares_lena_pct
  - consumo_lena_m3_hogar_ano
fuentes_oficiales:
  - "Comisión Nacional de Energía (CNE) — Sistema de Información de Precios en Línea"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - nodo
  - hub-iii
---

# Nodo #13 — Precios de Combustibles y Leña por Comuna (CNE)

## Síntesis Compilada (Consultor IA)

Comparativa comunal de precios de gasolina 93 ($/litro), petróleo diesel ($/litro), porcentaje de sobrecosto respecto a Santiago y precio del metro cúbico de leña seca ($/m3). Al 19-nov-2026 (CNE), Aysén registra la gasolina 93 más cara de Chile ($1.696/L promedio regional; $1.652/L Coyhaique, $1.651/L Aysén), diésel $1.663/L y kerosene $1.497/L (shock FEPP +$282/L oct-2026), dependientes del único MBM activo Copec en Chacabuco (6.674 m³ activos / 10.474 m³ totales). En leña, INFOR BES N° 11 certifica 334.274 m³ sólidos/año (Coyhaique 147.080 m³s [44,0%], 68,8% hogares a 9,81 m³s/hogar tras 10.999 recambios PDA).

## Indicadores Comunales Verificados

| Comuna | Gasolina 93 ($/L) | Diesel ($/L) | Sobrecosto vs. Stgo | Precio Leña ($/m3) |
| --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | $1.652 | $1.595 | +10.8% | $48.000 |
| [[comunas/lago_verde|Lago Verde]] | $1.765 | $1.710 | +22.5% | $36.000 |
| [[comunas/aysen|Aysén]] | $1.651 | $1.585 | +11.2% | $46.000 |
| [[comunas/cisnes|Cisnes]] | $1.695 | $1.645 | +16.4% | $44.000 |
| [[comunas/guaitecas|Guaitecas]] | $1.785 | $1.740 | +26.2% | $52.000 |
| [[comunas/chile_chico|Chile Chico]] | $1.710 | $1.675 | +15.6% | $50.000 |
| [[comunas/rio_ibanez|Río Ibáñez]] | $1.705 | $1.668 | +14.8% | $44.000 |
| [[comunas/cochrane|Cochrane]] | $1.714 | $1.735 | +13.9% | $42.000 |
| [[comunas/ohiggins|O'Higgins]] | $1.812 | $1.802 | +30.8% | $36.000 |
| [[comunas/tortel|Tortel]] | $1.790 | $1.775 | +27.6% | $40.000 |

## Metadatos de Procedencia Institucional

- **Entidad Oficial**: Comisión Nacional de Energía (CNE) — Sistema de Información de Precios en Línea
- **Fecha de Corte**: Precios semanales en estaciones de servicio y catastro CNE de leña · Corte Octubre 2026
- **Método de Captura**: Reporte obligatorio de precios de venta a público informado por distribuidores minoristas a CNE
- **Subsistema VSM**: S1 · Flujo metabólico: energy

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hub Perteneciente**: [[hubs/hub_03_energia|Hub III — Energía, Sistemas Medianos Aislados, Matriz Térmica y Telecomunicaciones]]
- **Nodos Satélite Relacionados**: [[nodos/nodo_03|Nodo #03]] · [[nodos/nodo_24|Nodo #24]] · [[nodos/nodo_27|Nodo #27]] · [[nodos/nodo_30|Nodo #30]] · [[nodos/nodo_40|Nodo #40]]
- **Comunas de Aysén (10)**: [[comunas/coyhaique|Coyhaique]] · [[comunas/lago_verde|Lago Verde]] · [[comunas/aysen|Aysén]] · [[comunas/cisnes|Cisnes]] · [[comunas/guaitecas|Guaitecas]] · [[comunas/chile_chico|Chile Chico]] · [[comunas/rio_ibanez|Río Ibáñez]] · [[comunas/cochrane|Cochrane]] · [[comunas/ohiggins|O'Higgins]] · [[comunas/tortel|Tortel]]
- **ADRs de Referencia**: [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]] · [[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]
