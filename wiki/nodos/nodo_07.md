---
id: nodo_07
title: "Nodo #07 — Matriz de 13 holdings Madres y Concesiones"
type: nodo
hub_id: salmonicultura
hub_roman: II
variables_clave:
  - biomasa_salmon_ton
  - antibioticos_ica_g_ton
  - concesiones_acuicolas_en_snaspe
  - sancionatorios_sma_acuicolas_n
fuentes_oficiales:
  - "Comisión para el Mercado Financiero (CMF) / SUBPESCA / SERNAPESCA / SMA-SNIFA"
updated_at: "2026-11-25"
tags:
  - aysen-sistemico
  - nodo
  - hub-ii
---

# Nodo #07 — Matriz de 13 holdings Madres y Concesiones

## Síntesis Compilada (Consultor IA)

Vinculación corporativa entre los 13 holdings madres (grupos controladores), su titularidad sobre las 745 concesiones salmoneras, su superposición efectiva en SNASPE (312 concesiones totales) y sus expedientes sancionatorios SMA-SNIFA (66 casos) en Aysén. AquaChile (Agrosuper S.A.) lidera con 210 concesiones (28,19%, 106 en SNASPE, 18 SMA-SNIFA), seguido por Mowi Chile (95 conc., 29 SNASPE, 8 SMA), Multi X (80 conc., 25 SNASPE, 7 SMA), Cermaq Chile (75 conc., 29 SNASPE, 6 SMA), Salmones Blumar (62 conc., 21 SNASPE, 5 SMA), Australis Seafoods (46 conc., 15 SNASPE, 8 SMA por autodenuncia de sobreproducción) y Cooke Aquaculture Chile (18 conc., 10 en borde PN Laguna San Rafael / Estero Cupquelán, 3 SMA). Las métricas `biomasa_por_holding` y `centros_activos_por_holding` se explicitan como estimación proporcional por cartera SERNAPESCA/SUBPESCA.

## Indicadores Comunales Verificados

| Holding Madre | Grupo Controlador | País Matriz | Concesiones Aysén | % Regional | Concesiones SNASPE | Expedientes SMA-SNIFA |
| --- | --- | --- | --- | --- | --- | --- |
| AquaChile | Grupo Agrosuper (Familia Vial) | Chile | 210 | 28.19% | 106 | 18 |
| Mowi Chile | Grupo Mowi ASA (Bergen, Noruega) | Noruega | 95 | 12.75% | 29 | 8 |
| Multi X | Multiexport Foods S.A. con Mitsui y Cargill | Chile / Japón / Estados Unidos | 80 | 10.74% | 25 | 7 |
| Cermaq Chile | Mitsubishi Corporation (Japón) / Cermaq Group AS | Japón | 75 | 10.07% | 29 | 6 |
| Blumar Seafoods / Salmones Blumar | Grupos empresariales Yaconi-Santa Cruz y Sarquis | Chile | 62 | 8.32% | 21 | 5 |
| Australis Seafoods | Grupo Joyvio (Legend Holdings, China) | China | 46 | 6.17% | 15 | 8 |
| Salmones Camanchaca | Grupo Camanchaca (Familias Cifuentes y Stengel) | Chile | 38 | 5.1% | 12 | 3 |
| Salmones Yadrán | Empresas Yadrán (Familia Briones) | Chile | 31 | 4.16% | 27 | 3 |
| Invermar | Grupo Alimar (Familia Izquierdo Menéndez) | Chile | 27 | 3.62% | 9 | 2 |
| Salmones Austral | Salmones Austral S.A. (Navarro, Hurtado y Puchi) | Chile | 24 | 3.22% | 10 | 2 |
| Salmones Antártica | Nissui Corporation (Tokio, Japón) | Japón | 20 | 2.68% | 5 | 1 |
| Cooke Aquaculture Chile | Cooke Inc. (Canadá - Familia Cooke) | Canadá | 18 | 2.42% | 10 | 3 |

## Metadatos de Procedencia Institucional

- **Entidad Oficial**: Comisión para el Mercado Financiero (CMF) / SUBPESCA / SERNAPESCA
- **Fecha de Corte**: Estados Financieros Consolidados y Memoria Anual de Emisores CMF · Corte Junio 2026
- **Método de Captura**: Cruce de mallas societarias CMF con titulares de concesiones acuícolas en Aysén
- **Subsistema VSM**: S3 · Flujo metabólico: financial

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hub Perteneciente**: [[hubs/hub_02_salmonicultura|Hub II — Pesca, Acuicultura, Holdings Salmoneros y Maritorio]]
- **Nodos Satélite Relacionados**: [[nodos/nodo_16|Nodo #16]] · [[nodos/nodo_19|Nodo #19]] · [[nodos/nodo_20|Nodo #20]] · [[nodos/nodo_29|Nodo #29]]
- **Comunas de Aysén (10)**: [[comunas/coyhaique|Coyhaique]] · [[comunas/lago_verde|Lago Verde]] · [[comunas/aysen|Aysén]] · [[comunas/cisnes|Cisnes]] · [[comunas/guaitecas|Guaitecas]] · [[comunas/chile_chico|Chile Chico]] · [[comunas/rio_ibanez|Río Ibáñez]] · [[comunas/cochrane|Cochrane]] · [[comunas/ohiggins|O'Higgins]] · [[comunas/tortel|Tortel]]
- **ADRs de Referencia**: [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]] · [[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]
