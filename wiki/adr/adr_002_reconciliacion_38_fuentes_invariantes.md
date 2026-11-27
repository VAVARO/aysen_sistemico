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
  - "DGA-MOP — Inventario Público de Glaciares IPG 2022 / SOCHICRI oct-2025 (10.301 glaciares / 8.721,6 km²)"
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

Tras auditar los 10 Hubs, se establecieron invariantes numéricos únicos en todo el repositorio para eliminar discrepancias entre tablas comunales, nodos satélite y respuestas del Consultor IA: (1) Salmonicultura: 13 holdings salmoneros madres con 745 concesiones otorgadas en las 4 comunas costeras, 245 centros operativos activos y 503.500 toneladas de biomasa cosechada; (2) Criósfera DGA (IPG 2022 / SOCHICRI oct-2025): 10.301 glaciares y 8.721,6 km² de superficie glaciar regional (~1.235,6 km³ agua equivalente); (3) Salud Rural: 27 Postas de Salud Rural (PSR) y 5 hospitales con 261 camas; (4) Ecosistema CTCi: 16 centros científicos con 124 investigadores residentes y 179 proyectos totales (120 ANID + 59 CORFO); (5) Finanzas GORE y Municipales: ingresos municipales BCN/SINIM 2025 de 84.820,68 M$ (FCM 41.753,32 M$ brutos), FNDR 2025 devengado de 73.863,0 M$ (92,0%) y acuerdo Hacienda 2027 en 80.748,0 M$; (6) Economía, Inversión y Suelo (Hub V — Sprint 8): PIB nominal BCCh 2025 de 1.991.000 MM$ (+8,5% real, 13 actividades, 1T 2026 -2,6% real), demografía SII (13.453 empresas / 35.832 trabajadores en 2025; 5 tramos UF BCN 2024 sobre 12.953 empresas; 25.800 MUF domicilio local vs. 131.520 MUF valor bruto de producción), SEIA sin alucinaciones extrarregionales y sincronía 1:1 (Cuenta Pública SEA 2025), ChileCompra 2026 YTD (228.874,2 M$), SERNAGEOMIN (356 conc. / 128.511 ha), ODEPA (144.118 bovinos / 177.972 ovinos) y CONAF 2026 (10.667.211,5 ha / 5.152.384,3 ha bosque nativo); (7) Desarrollo Social (Hub VI — Sprint 9): Censo 2024 (100.745 hab. INE / 39.964 hogares / 52.294 viviendas / IAM 66,2), MINVU CECT (1.927 cuantitativo / 12,9% cualitativo = 5.155 / 10 campamentos / PEH 1.671 = 129,2%), DOH-MOP (47 SSR / 28.833 personas / 9.185 familias), Educación (86 colegios; 55 SLEP + 10 VTF; 2.924 SIES 2026) y CEAD VIF oficial 2023–2025; y (8) Biodiversidad, Criósfera, Aire e Hidrología (Hub VII — Sprint 10): CONAF 2026 (4 tipos forestales sumando 5.152.384,3 ha incl. Coihue de Magallanes 882.420,0 ha; 5.189.923,8 ha subuso Bosques), 20° Proceso RCE oct-2026 (154 taxones, 64 en amenaza directa; Huemul 750–1.000 en Aysén y < 1.500 global; Ballena Azul < 250; Huillín EN VI–X / IC XI–XII), EEI (Castor 0 comunas invadidas con SAT mar-2025; Jabalí 6 comunas; Didymo 6 cuencas BNA D.Ac. N° 414/2024), SINCA EMRP únicamente en Coyhaique (97 GEC 2026 / 87 en 2024) y Puerto Aysén (16 días base 2022 / 34 en 2018), régimen nivo-glacial DGA Río Baker BNA 11530000-8 (Feb 675 m³/s, Ago 395 m³/s; 8° conector dga_hidrologia) y 5 volcanes RNVV en Aysén (Hudson #12 Cat. I; exclusión Cerro Arenales).

## Contexto, Decisión e Implicancias de Ingeniería

- **Contexto del Problema**: Los catastros administrativos chilenos publican cortes temporales distintos (por ejemplo, concesiones acuícolas otorgadas vs. operativas, o presupuesto FNDR ley inicial vs. devengado anual), lo que inducía contradicciones aparentes cuando un analista cruzaba dos módulos.
- **Decisión Arquitectónica**: Unificar cada magnitud bajo una clave tipada canónica en `window.AYSEN_HUBS_DATA` y bloquear mediante linter cualquier cifra heredada de versiones preliminares.
- **Consecuencias y Verificación**: Paridad matemática del 100% entre `index.html`, `laboratorio.html`, `consultor.html` y la `wiki/` en Obsidian.

## Indicadores Comunales Verificados

| Comuna | Concesiones de Salmonicultura | Centros de Cultivo Activos | Biomasa de Salmón Cosechada (ton) | Superficie de Glaciares DGA (km²) |
| --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | 0 | 0 | 0 | 28,2 |
| [[comunas/lago_verde|Lago Verde]] | 0 | 0 | 0 | 64 |
| [[comunas/aysen|Aysén]] | 412 | 135 | 265.000 | 1.542,6 |
| [[comunas/cisnes|Cisnes]] | 218 | 78 | 185.000 | 184,3 |
| [[comunas/guaitecas|Guaitecas]] | 98 | 32 | 45.000 | 0 |
| [[comunas/chile_chico|Chile Chico]] | 0 | 0 | 0 | 238,5 |
| [[comunas/rio_ibanez|Río Ibáñez]] | 0 | 0 | 0 | 382 |
| [[comunas/cochrane|Cochrane]] | 0 | 0 | 0 | 512,4 |
| [[comunas/ohiggins|O'Higgins]] | 0 | 0 | 0 | 2.284,2 |
| [[comunas/tortel|Tortel]] | 17 | 0 | 8.500 | 3.485,4 |

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hubs Impactados**: [[hubs/hub_02_salmonicultura|Hub II]] · [[hubs/hub_04_gobernanza|Hub IV]] · [[hubs/hub_07_biodiversidad|Hub VII]] · [[hubs/hub_08_salud|Hub VIII]] · [[hubs/hub_10_ctci|Hub X]]
- **Comunas de Referencia**: [[comunas/coyhaique|Coyhaique]] · [[comunas/aysen|Aysén]] · [[comunas/cisnes|Cisnes]] · [[comunas/guaitecas|Guaitecas]] · [[comunas/tortel|Tortel]] · [[comunas/ohiggins|O'Higgins]]
- **Conceptos Vinculados**: [[conceptos/modelo_salmonicultor|modelo_salmonicultor]] · [[conceptos/ecosistema_ctci_ciencia|ecosistema_ctci_ciencia]] · [[conceptos/red_asistencial_salud|red_asistencial_salud]] · [[conceptos/volcan_hudson_y_campos_de_hielo|volcan_hudson_y_campos_de_hielo]]
