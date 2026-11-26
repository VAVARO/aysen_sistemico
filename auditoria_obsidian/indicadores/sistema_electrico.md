---
id: respaldo_indicador_sistema_electrico
title: "Respaldo de Indicador — Subsistema Eléctrico de Abastecimiento (sistema_electrico)"
type: respaldo_indicador
variable_clave: "sistema_electrico"
tipo_dato: "categorical"
nivel_umbral: "operativo"
umbral_outlier_pct: 20
hub: "energia"
hub_titulo: "III. Energía y Telecomunicaciones"
nodo_id: 12
unidad: "subsistema"
en_lexico_oficial: true
ultimo_estado: "modificada"
requiere_verificacion: false
ultima_corrida: "2026-11-26"
tags:
  - aysen-sistemico
  - respaldo-indicador
  - estado-modificada
---

# Respaldo de Indicador: `sistema_electrico`

- **Nombre**: Subsistema Eléctrico de Abastecimiento
- **Hub / Nodo**: III. Energía y Telecomunicaciones · Nodo #12
- **Umbral de outlier**: operativo (>= 20%)
- **Unidad**: subsistema
- **Fuente oficial**: Superintendencia de Electricidad y Combustibles (SEC) / CNE (https://www.sec.cl/)
- **Frecuencia / Modo**: Anual · `curated_fallback`
- **Última auditoría**: [[corridas/corrida_2026-11-26_head_vs_head|Corrida 2026-11-26]] · [[index_auditoria|Índice de Auditoría]]

## Alertas Activas en esta Corrida

Sin alertas activas en la corrida más reciente.

## Comparación Comunal (HEAD vs HEAD)

| INE | Comuna | Anterior | Actual | Delta | Delta % | Outlier |
|---|---|---|---|---|---|---|
| `11102` | Lago Verde | Sistema Palena - La Junta (Edelaysen) y Autoproducción Lago Verde | Fracción Sistema Mediano Palena y Micro-redes La Tapera / Amengual | N/D | N/A (desde 0) | NO |
| `11201` | Aysén | Sistema Mediano de Aysén (SMA) e Islas Huichas Aislado | SMA Continental, Autogeneración El Toqui e Islas Huichas (SSAA) | N/D | N/A (desde 0) | NO |
| `11202` | Cisnes | Sistema Mediano Palena - Cisnes (Edelaysen) | SM Puerto Cisnes (1.67 MW), SM Palena (0.80 MW) y 3 SSAA Litorales (0.36 MW) | N/D | N/A (desde 0) | NO |
| `11203` | Guaitecas | Sistema Aislado Insular Melinka | Sistema Aislado Municipal Melinka-Repollal | N/D | N/A (desde 0) | NO |
| `11301` | Cochrane | Sistema Mediano General Carrera - Cochrane (Edelaysen) | Sistema Mediano General Carrera - Cochrane (SMGC) | N/D | N/A (desde 0) | NO |
| `11302` | O'Higgins | Sistema Aislado Villa O'Higgins | Sistema Aislado Municipal Villa O'Higgins | N/D | N/A (desde 0) | NO |
| `11303` | Tortel | Sistema Aislado Caleta Tortel | Sistema Aislado Municipal Caleta Tortel | N/D | N/A (desde 0) | NO |
| `11402` | Río Ibáñez | Sistema Mediano de Aysén (Interconexión Ramal Sur) | Ramal Sur SMA / Respaldo Local Cerro Castillo-Puerto Ibáñez | N/D | N/A (desde 0) | NO |

## Historial de Corridas

- **2026-11-26** ([[corridas/corrida_2026-11-26_head_vs_head|corrida_2026-11-26_head_vs_head]]): estado `modificada` · 8 comuna(s) con cambio/registro · alertas: 0.

## Revisión Humana (Notas Preservadas)

<!-- Escribe aquí tus observaciones de auditoría; este bloque se conserva automáticamente en futuras corridas. -->
- [ ] Verificado contra fuente oficial.
