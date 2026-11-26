---
id: respaldo_indicador_estado_foa
title: "Respaldo de Indicador — Troncal de Fibra Óptica Austral (FOA) (estado_foa)"
type: respaldo_indicador
variable_clave: "estado_foa"
tipo_dato: "categorical"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 14
unidad: "infraestructura"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
---

# Respaldo de Indicador: `estado_foa`

- **Nombre**: Troncal de Fibra Óptica Austral (FOA)
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #14
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: infraestructura
- **Fuente oficial**: Subsecretaría de Telecomunicaciones (SUBTEL) — Proyecto FOA (https://www.subtel.gob.cl/)
- **Frecuencia / Modo**: Semestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | FOA Terrestre + Ramal Submarino (CTR / Conexión Troncal Austral) | Troncal Terrestre Silica Networks (FDT-2018-02) + Cable Submarino Austral GTD vía Puerto Chacabuco | N/D | N/A (desde 0) | NO |
| `11102` | Lago Verde | Radioenlace Microondas Digital + Starlink Institucional Subtel | Satelital Starlink / Radioenlace UHF (FTTH hogar en despliegue FDT-2025-03 hacia Lago Verde y Villa La Tapera) | N/D | N/A (desde 0) | NO |
| `11201` | Aysén | FOA Submarina (Punto Aterrizaje Chacabuco y Puerto Aguirre) + FOA Terrestre hacia Coyhaique | Cable Submarino Austral GTD / Telefónica del Sur (Puerto Chacabuco) + Red Troncal Regional Coyhaique | N/D | N/A (desde 0) | NO |
| `11202` | Cisnes | FOA Submarina (Aterrizaje Puerto Cisnes) + FOA Terrestre Carretera Austral | Red Troncal Terrestre Norte Ruta 7 (La Junta/Puyuhuapi/Cisnes) + adjudicación FDT-2025-03 Última Milla | N/D | N/A (desde 0) | NO |
| `11203` | Guaitecas | FOA Submarina (Punto de Aterrizaje Submarino Melinka de CTR/SUBTEL) | Radioenlace Microondas / Starlink + Proyecto Última Milla FDT-2025-03 (Melinka y Repollal, sin aterrizaje CTR) | N/D | N/A (desde 0) | NO |
| `11301` | Cochrane | FOA Terrestre (Nodo Cabecera Provincial Troncal Austral Cochrane) | Troncal Terrestre Silica Networks FDT-2018-02 (POIITs Puerto Bertrand, Cochrane y Los Ñadis) | N/D | N/A (desde 0) | NO |
| `11302` | O'Higgins | Radioenlace Digital UHF/Microondas + Satelital Starlink Subtel | Satelital Starlink / Radioenlace UHF (Fibra Tortel-Villa O'Higgins adjudicada D.O. 28-abr-2026; operación 1S-2028) | N/D | N/A (desde 0) | NO |
| `11303` | Tortel | FOA Submarina (Punto de Aterrizaje FOA Caleta Tortel) + FOA Terrestre desde Cochrane | Único Aterrizaje Submarino FOA CTR en Aysén (FDT-2017-01) + POIIT Silica FDT-2018-02 + FDT-2025-03 FTTH | N/D | N/A (desde 0) | NO |
| `11401` | Chile Chico | FOA Terrestre (Ramal Troncal General Carrera) | Troncal Terrestre Silica Networks FDT-2018-02 (POIITs Puerto Guadal, Mallín Grande y Chile Chico) | N/D | N/A (desde 0) | NO |
| `11402` | Río Ibáñez | FOA Terrestre (Troncal Carretera Austral con empalme en Cerro Castillo y Puerto Ibáñez) | Troncal Terrestre Silica Networks FDT-2018-02 (POIITs Cerro Castillo, Puerto Ibáñez, Bahía Murta y Río Tranquilo) | N/D | N/A (desde 0) | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
