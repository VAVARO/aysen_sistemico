---
id: adr_002_reconciliacion_38_fuentes_invariantes
title: "ADR-002 — Reconciliación de 38 Fuentes Oficiales e Invariantes Estadísticos Antialucinación"
type: adr
hub_id: salmonicultura
hub_roman: II
variables_clave:
  - concesiones_salmon
  - centros_activos_salmon
  - biomasa_salmon_ton
  - superficie_glaciares_km2
  - postas_salud_rural
  - centros_y_estaciones_ctci_count
  - investigadores_residentes_est
  - fndr_mclp
fuentes_oficiales:
  - "SUBPESCA / SERNAPESCA — Catastro Acuícola Reconciliado"
  - "DGA-MOP — Inventario Público de Glaciares (10.035,7 km²)"
  - "DEIS - MINSAL / Servicio de Salud Aysén — 27 Postas de Salud Rural y 261 Camas"
  - "ANID / CORFO / CIEP / UAysén — 16 Centros CTCi y 124 Investigadores Residentes"
  - "DIPRES / GORE Aysén — Ejecución Presupuestaria FNDR"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - adr
  - hub-ii
---

# ADR-002 — Reconciliación de 38 Fuentes Oficiales e Invariantes Estadísticos Antialucinación

## Síntesis Compilada (Consultor IA)

Tras auditar los 10 Hubs con 50 perfiles de usuarios expertos, se establecieron invariantes numéricos únicos en todo el repositorio para eliminar discrepancias entre tablas comunales, nodos satélite y respuestas del Consultor IA: (1) Salmonicultura: 13 holdings salmoneros madres con 745 concesiones otorgadas en las 4 comunas costeras (793 en el catastro histórico ampliado con relocalizaciones), 245 centros operativos activos y 503.500 toneladas de biomasa cosechada; (2) Criósfera DGA: 10.035,7 km² de superficie glaciar regional; (3) Salud Rural: exactamente 27 Postas de Salud Rural (PSR) y 5 hospitales con 261 camas; (4) Ecosistema CTCi: 16 centros científicos y estaciones de campo con 124 investigadores residentes y 179 proyectos totales (120 ANID + 59 CORFO); y (5) Finanzas GORE y Municipales: ingresos municipales BCN/SINIM 2025 de 84.820,68 M$ (FCM 41.753,32 M$ brutos; 68,5% ponderada / 77,5% simple), y distinción explícita entre el récord devengado FNDR GORE 2025 (73.863,0 M$ / 92,0% sobre 80.200,0 M$ vigentes), el cierre 2024 (44.765,5 M$ / 59,3%), las transferencias e inversión directa 2023 (61.579,2 M$ CKAN / 61.548,0 M$ DIPRES sobre 68.333,7 M$) y el acuerdo Hacienda 2027 (80.748,0 M$).

## Contexto, Decisión e Implicancias de Ingeniería

- **Contexto del Problema**: Los catastros administrativos chilenos publican cortes temporales distintos (por ejemplo, concesiones acuícolas otorgadas vs. operativas, o presupuesto FNDR ley inicial vs. devengado anual), lo que inducía contradicciones aparentes cuando un analista cruzaba dos módulos.
- **Decisión Arquitectónica**: Unificar cada magnitud bajo una clave tipada canónica en `window.AYSEN_HUBS_DATA` y bloquear mediante linter cualquier cifra heredada de versiones preliminares.
- **Consecuencias y Verificación**: Paridad matemática del 100% entre `index.html`, `laboratorio.html`, `consultor.html` y la `wiki/` en Obsidian.

## Indicadores Comunales Verificados

| Comuna | Concesiones de Salmonicultura | Centros de Cultivo Activos | Biomasa de Salmón Cosechada (ton) | Superficie de Glaciares DGA (km²) |
| --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 0 | 0 | 0 | 42,5 |
| [[comunas/lago_verde|Lago Verde]] | 0 | 0 | 0 | 38,2 |
| [[comunas/aysen|Aysén]] | 412 | 135 | 265.000 | 1.850 |
| [[comunas/cisnes|Cisnes]] | 218 | 78 | 185.000 | 480 |
| [[comunas/guaitecas|Guaitecas]] | 98 | 32 | 45.000 | 0 |
| [[comunas/chile_chico|Chile Chico]] | 0 | 0 | 0 | 145 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 0 | 0 | 0 | 460 |
| [[comunas/cochrane|Cochrane]] | 0 | 0 | 0 | 890 |
| [[comunas/ohiggins|O'Higgins]] | 0 | 0 | 0 | 3.450 |
| [[comunas/tortel|Tortel]] | 17 | 0 | 8.500 | 2.680 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hubs Impactados**: [[hubs/hub_02_salmonicultura|Hub II]] · [[hubs/hub_04_gobernanza|Hub IV]] · [[hubs/hub_07_biodiversidad|Hub VII]] · [[hubs/hub_08_salud|Hub VIII]] · [[hubs/hub_10_ctci|Hub X]]
- **Comunas de Referencia**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]] · [[comunas/cisnes|Cisnes]] · [[comunas/guaitecas|Guaitecas]] · [[comunas/tortel|Tortel]] · [[comunas/ohiggins|O'Higgins]]
- **Conceptos Vinculados**: [[conceptos/modelo_salmonicultor|modelo_salmonicultor]] · [[conceptos/ecosistema_ctci_ciencia|ecosistema_ctci_ciencia]] · [[conceptos/red_asistencial_salud|red_asistencial_salud]] · [[conceptos/volcan_hudson_y_campos_de_hielo|volcan_hudson_y_campos_de_hielo]]
