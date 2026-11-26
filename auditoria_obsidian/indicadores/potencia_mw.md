---
id: respaldo_indicador_potencia_mw
title: "Respaldo de Indicador — Potencia Eléctrica Instalada Comunal (potencia_mw)"
type: respaldo_indicador
variable_clave: "potencia_mw"
tipo_dato: "numeric"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 11
unidad: "MW"
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

# Respaldo de Indicador: `potencia_mw`

- **Nombre**: Potencia Eléctrica Instalada Comunal
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #11
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: MW
- **Fuente oficial**: Comisión Nacional de Energía (CNE) — Plataforma Energía Abierta (https://energiaabierta.cl/)
- **Frecuencia / Modo**: Trimestral · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

- [ ] **[ALTA · OUTLIER_SALTO]** Coyhaique: 26,8 -> 34,0 (Variación de +26,7% (umbral operativo >= 20%)); Lago Verde: 1,40 -> 0,35 (Variación de -75,0% (umbral operativo >= 20%)); Aysén: 42,5 -> 18,5 (Variación de -56,5% (umbral operativo >= 20%)); Cisnes: 6,80 -> 2,83 (Variación de -58,4% (umbral operativo >= 20%)); Guaitecas: 2,80 -> 1,45 (Variación de -48,2% (umbral operativo >= 20%)); Cochrane: 5,80 -> 2,54 (Variación de -56,2% (umbral operativo >= 20%)); Tortel: 1,20 -> 0,95 (Variación de -20,8% (umbral operativo >= 20%)); Chile Chico: 7,50 -> 3,90 (Variación de -48,0% (umbral operativo >= 20%)); Río Ibáñez: 2,40 -> 1,40 (Variación de -41,7% (umbral operativo >= 20%)) · [NORMATIVA · CAMBIO_REGULATORIO_DOCUMENTADO] Catastro CNE / Grupo Saesa / CIEP 2025-2026 (67,10 MW operativos; erradicación nodo aeródromo WPA/SCAS; Art. 173 LGSE SSAA <= 1,50 MW)

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11101` | Coyhaique | 26,8 | 34,0 | 7,15 | +26,7% | SI (Variación de +26,7% (umbral operativo >= 20%)) |
| `11102` | Lago Verde | 1,40 | 0,35 | -1,05 | -75,0% | SI (Variación de -75,0% (umbral operativo >= 20%)) |
| `11201` | Aysén | 42,5 | 18,5 | -24,0 | -56,5% | SI (Variación de -56,5% (umbral operativo >= 20%)) |
| `11202` | Cisnes | 6,80 | 2,83 | -3,97 | -58,4% | SI (Variación de -58,4% (umbral operativo >= 20%)) |
| `11203` | Guaitecas | 2,80 | 1,45 | -1,35 | -48,2% | SI (Variación de -48,2% (umbral operativo >= 20%)) |
| `11301` | Cochrane | 5,80 | 2,54 | -3,26 | -56,2% | SI (Variación de -56,2% (umbral operativo >= 20%)) |
| `11302` | O'Higgins | 1,40 | 1,25 | -0,15 | -10,7% | NO |
| `11303` | Tortel | 1,20 | 0,95 | -0,25 | -20,8% | SI (Variación de -20,8% (umbral operativo >= 20%)) |
| `11401` | Chile Chico | 7,50 | 3,90 | -3,60 | -48,0% | SI (Variación de -48,0% (umbral operativo >= 20%)) |
| `11402` | Río Ibáñez | 2,40 | 1,40 | -1 | -41,7% | SI (Variación de -41,7% (umbral operativo >= 20%)) |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 10 comuna(s) con cambio/registro · alertas: 1.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
