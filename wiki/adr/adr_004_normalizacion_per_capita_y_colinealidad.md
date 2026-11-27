---
id: adr_004_normalizacion_per_capita_y_colinealidad
title: "ADR-004 — Normalización Per Cápita y Prevención de Colinealidad Demográfica en Aysén"
type: adr
hub_id: social
hub_roman: VI
variables_clave:
  - poblacion_censo_2024
  - porcentaje_regional_pct
  - fndr_per_capita_mclp
  - presupuesto_per_capita_mclp
  - tarifa_bt1_clp
  - consumo_lena_m3_hogar_ano
fuentes_oficiales:
  - "INE — Censo de Población y Vivienda 2024 (100.745 habitantes)"
  - "SUBDERE — SINIM"
  - "CNE / INFOR — Tarifas Eléctricas y Consumo Residencial de Leña"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - adr
  - hub-vi
---

# ADR-004 — Normalización Per Cápita y Prevención de Colinealidad Demográfica en Aysén

## Síntesis Compilada (Consultor IA)

Debido a que Coyhaique concentra 57.823 de los 100.745 habitantes de Aysén (57,4%) y Puerto Aysén 23.170 (23,0%) (80,4% conjunto), cualquier cruce bruto entre dos variables de conteo absoluto (por ejemplo, número de empresas SII vs. matrícula escolar o presupuesto municipal total) produce coeficientes de determinación aparentes superiores a R² = 0,92 que solo reflejan el tamaño poblacional. Para evitar inferencias causales espurias, Aysén Sistémico incorpora normalización dinámica Per Cápita (por 1.000 habitantes), Participación % Regional y un filtro «Excluir Coyhaique (Outlier)» tanto en `laboratorio.html` como en `consultor.html`, priorizando cruces físicamente independientes como Tarifa Eléctrica BT1 ($/kWh) vs. Consumo Residencial de Leña (m³/hogar/año) o Tiempo de Derivación Médica (hrs) vs. Mediana de Espera Quirúrgica (días).

## Contexto, Decisión e Implicancias de Ingeniería

- **Contexto del Problema**: La hiperconcentración demográfica en la capital regional distorsiona las regresiones lineales ordinarias (OLS) sobre las 10 comunas.
- **Decisión Arquitectónica**: Exponer transformaciones de escala en un clic (`Bruto`, `Per Cápita`, `% Regional`, `Sin Coyhaique`) y documentar en cada tarjeta del Laboratorio y del Consultor la distinción entre volumen absoluto e intensidad per cápita.
- **Consecuencias y Verificación**: Visibilización del esfuerzo fiscal y de las brechas reales en comunas de baja población como Tortel, O'Higgins, Lago Verde y Guaitecas.

## Indicadores Comunales Verificados

| Comuna | Población Censo 2024 (hab.) | Participación Poblacional Regional (%) | Inversión FNDR Asignada Per Cápita (Miles $ CLP/hab) | Presupuesto Municipal Per Cápita (M$/hab) |
| --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 57.823 | 57,17 | 256,8 | 477,5 |
| [[comunas/lago_verde|Lago Verde]] | 882 | 0,87 | 2.494,3 | 3.765,4 |
| [[comunas/aysen|Aysén]] | 23.170 | 22,91 | 423 | 630,7 |
| [[comunas/cisnes|Cisnes]] | 5.335 | 5,27 | 1.049,7 | 1.496,8 |
| [[comunas/guaitecas|Guaitecas]] | 1.598 | 1,58 | 2.127,7 | 2.859,2 |
| [[comunas/chile_chico|Chile Chico]] | 4.950 | 4,89 | 989,9 | 1.208,4 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 2.671 | 2,64 | 1.535 | 2.341 |
| [[comunas/cochrane|Cochrane]] | 3.492 | 3,45 | 1.374,6 | 1.638,3 |
| [[comunas/ohiggins|O'Higgins]] | 664 | 0,66 | 3.614,5 | 8.017,7 |
| [[comunas/tortel|Tortel]] | 563 | 0,56 | 4.618,1 | 6.111,4 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hubs Impactados**: [[hubs/hub_03_energia|Hub III]] · [[hubs/hub_04_gobernanza|Hub IV]] · [[hubs/hub_05_inversion|Hub V]] · [[hubs/hub_06_social|Hub VI]] · [[hubs/hub_08_salud|Hub VIII]]
- **Comunas de Referencia**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]] · [[comunas/tortel|Tortel]] · [[comunas/ohiggins|O'Higgins]] · [[comunas/lago_verde|Lago Verde]] · [[comunas/guaitecas|Guaitecas]]
- **Conceptos Vinculados**: [[conceptos/financiamiento_municipal|financiamiento_municipal]] · [[conceptos/inversion_publica_regional|inversion_publica_regional]] · [[conceptos/sistema_electrico_energia|sistema_electrico_energia]]
