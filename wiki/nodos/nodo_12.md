---
id: nodo_12
title: "Nodo #12 — Sistemas Eléctricos Medianos y Aislados"
type: nodo
hub_id: energia
hub_roman: III
variables_clave:
  - saidi_horas_anual
  - tarifa_bt1_clp
fuentes_oficiales:
  - "Superintendencia de Electricidad y Combustibles (SEC) / CNE"
updated_at: "2026-11-23"
tags:
  - aysen-sistemico
  - nodo
  - hub-iii
---

# Nodo #12 — Sistemas Eléctricos Medianos y Aislados

## Síntesis Compilada (Consultor IA)

Detalle comunal del subsistema eléctrico al que pertenece cada territorio (Sistema Mediano de Aysén, Sistema Mediano General Carrera o Micro-redes Aisladas), potencia instalada en MW y vulnerabilidad de suministro. Coyhaique (33,95 MW) y Aysén (18,48 MW) articulan el Sistema Mediano de Aysén (SMA) dentro de 67,10 MW regionales operativos junto a General Carrera (3,90 MW Chile Chico, 2,54 MW Cochrane) y Sistemas Aislados <= 1,50 MW (Art. 173° LGSE): Melinka (1,45 MW), O'Higgins (1,25 MW), Tortel (0,95 MW), Puerto Aguirre (0,48 MW) y micro-redes Cisnes/Lago Verde. Pliego BT1 Edelaysen nov-2026 Decreto N° 8T: $287,8/kWh en Coyhaique/Aysén (+13.448 hogares con Subsidio Eléctrico).

## Indicadores Comunales Verificados

| Comuna | Subsistema Eléctrico | Tipo de Red | Potencia Comunal (MW) | Vulnerabilidad |
| --- | --- | --- | --- | --- |
| [[comunas/coyhaique|Coyhaique]] | Sistema Mediano de Aysén (SMA) | Sistema Mediano Interconectado Regional | 33.95 MW | Media (Dependencia de diésel para puntas de demanda y estiaje invernal hídrico) |
| [[comunas/lago_verde|Lago Verde]] | Fracción Sistema Mediano Palena y Micro-redes La Tapera / Amengual | Sistema Mediano Extendido / Aislado Cordillerano | 0.35 MW | Alta (Línea de distribución vulnerable a nevadas, temporales y caídas de árboles) |
| [[comunas/aysen|Aysén]] | SMA Continental, Autogeneración El Toqui e Islas Huichas (SSAA) | Sistema Mediano (Continental) y Sistema Aislado Insular (Aguirre) | 18.48 MW | Media-Baja en continente; Alta en archipiélago Islas Huichas por flete marítimo |
| [[comunas/cisnes|Cisnes]] | SM Puerto Cisnes (1.67 MW), SM Palena (0.80 MW) y 3 SSAA Litorales (0.36 MW) | Sistema Mediano Costero-Norte | 2.83 MW | Alta (Riesgo de corte vial en Cuesta Queulat / Barcazas y aislamiento de caletas) |
| [[comunas/guaitecas|Guaitecas]] | Sistema Aislado Municipal Melinka-Repollal | Sistema Aislado Municipal Insular | 1.45 MW | Crítica (Dependencia absoluta de barcaza de combustible desde Quellón; riesgo de racionamiento por temporal marítimo) |
| [[comunas/chile_chico|Chile Chico]] | Sistema Mediano General Carrera (SMGC) | Sistema Mediano Lacustre | 3.9 MW | Media-Alta (Dependencia de barcaza lacustre o tránsito internacional por Argentina) |
| [[comunas/rio_ibanez|Río Ibáñez]] | Ramal Sur SMA / Respaldo Local Cerro Castillo-Puerto Ibáñez | Sistema Mediano Interconectado | 1.4 MW | Media (Línea de transmisión expuesta a nevadas y viento blanco en Portezuelo Ibáñez) |
| [[comunas/cochrane|Cochrane]] | Sistema Mediano General Carrera - Cochrane (SMGC) | Sistema Mediano Austral | 2.54 MW | Media-Alta (Fin del anillo de transmisión lacustre y alta distancia terrestre de logística) |
| [[comunas/ohiggins|O'Higgins]] | Sistema Aislado Municipal Villa O'Higgins | Sistema Aislado Municipal Extremo | 1.25 MW | Extrema (Término austral de Ruta 7; congelamiento de bocatoma en invierno y cruce marítimo-lacustre en barcaza Puerto Yungay) |
| [[comunas/tortel|Tortel]] | Sistema Aislado Municipal Caleta Tortel | Sistema Aislado Municipal - Fluvial | 0.95 MW | Muy Alta (Poblado de pasarelas peatonales; combustible descargado en tambores y lanchas fluviales) |

## Metadatos de Procedencia Institucional

- **Entidad Oficial**: Superintendencia de Electricidad y Combustibles (SEC) / CNE
- **Fecha de Corte**: Informe Técnico de Sistemas Medianos de Aysén y Sistemas Aislados · Corte Julio 2026
- **Método de Captura**: Auditorías de calidad de suministro eléctrico e informes de operación de Edelaysen
- **Subsistema VSM**: S2 · Flujo metabólico: energy

## Conexiones Sistémicas (`[[Wikilinks]]`)

- **Catálogo Maestro**: [[index|Índice Maestro de la Wiki]] · [[log|Bitácora Cronológica (Wiki Log)]]
- **Hub Perteneciente**: [[hubs/hub_03_energia|Hub III — Energía, Sistemas Medianos Aislados, Matriz Térmica y Telecomunicaciones]]
- **Nodos Satélite Relacionados**: [[nodos/nodo_02|Nodo #02]] · [[nodos/nodo_16|Nodo #16]] · [[nodos/nodo_28|Nodo #28]] · [[nodos/nodo_39|Nodo #39]] · [[nodos/nodo_41|Nodo #41]]
- **Comunas de Aysén (10)**: [[comunas/coyhaique|Coyhaique]] · [[comunas/lago_verde|Lago Verde]] · [[comunas/aysen|Aysén]] · [[comunas/cisnes|Cisnes]] · [[comunas/guaitecas|Guaitecas]] · [[comunas/chile_chico|Chile Chico]] · [[comunas/rio_ibanez|Río Ibáñez]] · [[comunas/cochrane|Cochrane]] · [[comunas/ohiggins|O'Higgins]] · [[comunas/tortel|Tortel]]
- **ADRs de Referencia**: [[adr/adr_002_reconciliacion_38_fuentes_invariantes|ADR-002]] · [[adr/adr_006_workflow_karpathy_llm_wiki_obsidian|ADR-006]]
