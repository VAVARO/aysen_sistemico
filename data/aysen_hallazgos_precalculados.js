/**
 * data/aysen_hallazgos_precalculados.js
 * Relaciones estadísticas curadas entre ejes temáticos y perfiles comunales comparados de Aysén.
 * Generado por: python scripts/precompute_curated_discoveries.py
 */
(function (root) {
  'use strict';
  const data = {
  "generatedAt": "2026-11-26T15:37:20Z",
  "methodology": {
    "engine": "Cálculo estadístico territorial de Aysén",
    "testsApplied": [
      "1. Regresión lineal (R², pendiente y control de falsos positivos Benjamini-Hochberg FDR < 0,05)",
      "2. Correlación por rangos de Spearman y Tau de Kendall",
      "3. Correlación parcial controlando por tamaño poblacional (Censo 2024)",
      "4. Robustez excluyendo Coyhaique y análisis de observaciones influyentes",
      "5. Variación interanual y series sin tendencia lineal (2015–2026)"
    ],
    "totalCuratedDiscoveries": 25,
    "crossComunalCount": 20,
    "temporalCouplingCount": 5,
    "comunasExplainCount": 10
  },
  "curatedDiscoveries": [
    {
      "id": "disc_01",
      "order": 1,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Escuelas Rurales Multigrado vs. Postas de Salud Rural",
      "headline": "Escuelas Rurales Multigrado vs. Postas de Salud Rural",
      "hubX": "VI. Social",
      "hubY": "VIII. Salud",
      "varX": "escuelas_rurales_multigrado_n",
      "varY": "postas_salud_rural",
      "labelX": "Escuelas Rurales Multigrado (SLEP Aysén)",
      "labelY": "Postas de Salud Rural (PSR)",
      "unitX": "escuelas",
      "unitY": "postas",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        12.0,
        3.0,
        6.0,
        5.0,
        2.0,
        2.0,
        2.0,
        1.0,
        1.0,
        2.0
      ],
      "dataY": [
        7.0,
        3.0,
        4.0,
        4.0,
        1.0,
        2.0,
        3.0,
        1.0,
        1.0,
        1.0
      ],
      "regressionLine": {
        "slopeBeta1": 0.54492,
        "interceptBeta0": 0.7383,
        "rSquaredPct": 89.2,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "En comunas con mayor ruralidad dispersa, la red escolar multigrado y las postas de salud crecen juntas: Coyhaique suma 12,0 escuelas y 7,0 postas, frente a 1,0 y 1,0 en Cochrane.",
      "plainExplanation": "En comunas con mayor ruralidad dispersa, la red escolar multigrado y las postas de salud crecen juntas: Coyhaique suma 12,0 escuelas y 7,0 postas, frente a 1,0 y 1,0 en Cochrane.",
      "notable_commune": "Caso atípico: Río Ibáñez registra +1,2 postas por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 7.0,
          "expectedY": 7.28,
          "diffY": -0.28,
          "zResid": -0.46,
          "note": "Coyhaique registra 7,0 postas, 0,3 postas por debajo de lo esperado según su nivel de escuelas rurales multigrado."
        },
        "Lago Verde": {
          "actualY": 3.0,
          "expectedY": 2.37,
          "diffY": 0.63,
          "zResid": 1.03,
          "note": "Lago Verde registra 3,0 postas, 0,6 postas por encima de lo esperado según su nivel de escuelas rurales multigrado."
        },
        "Aysén": {
          "actualY": 4.0,
          "expectedY": 4.01,
          "diffY": -0.01,
          "zResid": -0.01,
          "note": "Aysén (4,0 postas) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cisnes": {
          "actualY": 4.0,
          "expectedY": 3.46,
          "diffY": 0.54,
          "zResid": 0.88,
          "note": "Cisnes registra 4,0 postas, 0,5 postas por encima de lo esperado según su nivel de escuelas rurales multigrado."
        },
        "Guaitecas": {
          "actualY": 1.0,
          "expectedY": 1.83,
          "diffY": -0.83,
          "zResid": -1.36,
          "note": "Guaitecas registra 1,0 postas, 0,8 postas por debajo de lo esperado según su nivel de escuelas rurales multigrado."
        },
        "Chile Chico": {
          "actualY": 2.0,
          "expectedY": 1.83,
          "diffY": 0.17,
          "zResid": 0.28,
          "note": "Chile Chico (2,0 postas) se ubica prácticamente en línea con la tendencia regional."
        },
        "Río Ibáñez": {
          "actualY": 3.0,
          "expectedY": 1.83,
          "diffY": 1.17,
          "zResid": 1.93,
          "note": "Río Ibáñez registra 3,0 postas, 1,2 postas por encima de lo esperado según su nivel de escuelas rurales multigrado."
        },
        "Cochrane": {
          "actualY": 1.0,
          "expectedY": 1.28,
          "diffY": -0.28,
          "zResid": -0.47,
          "note": "Cochrane registra 1,0 postas, 0,3 postas por debajo de lo esperado según su nivel de escuelas rurales multigrado."
        },
        "O'Higgins": {
          "actualY": 1.0,
          "expectedY": 1.28,
          "diffY": -0.28,
          "zResid": -0.47,
          "note": "O'Higgins registra 1,0 postas, 0,3 postas por debajo de lo esperado según su nivel de escuelas rurales multigrado."
        },
        "Tortel": {
          "actualY": 1.0,
          "expectedY": 1.83,
          "diffY": -0.83,
          "zResid": -1.36,
          "note": "Tortel registra 1,0 postas, 0,8 postas por debajo de lo esperado según su nivel de escuelas rurales multigrado."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 89% · r = +0,94 · Sin Coyhaique: +0,87 · Control pob.: +0,83",
      "statProofBadges": {
        "fuerzaExplicativaPct": 89,
        "pearsonR": 0.944,
        "spearmanRho": 0.902,
        "kendallTau": 0.853,
        "partialCorrPop": 0.835,
        "rWithoutCoyhaique": 0.869,
        "firstDiffCorrDelta": 0.835,
        "pValueFdr": 5.8e-05,
        "veredictoSimple": "R² 89% · r = +0,94 · Sin Coyhaique: +0,87 · Control pob.: +0,83"
      }
    },
    {
      "id": "disc_02",
      "order": 2,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Tarifa Eléctrica Residencial BT1 vs. Cobertura Preventiva EMPAM",
      "headline": "Tarifa Eléctrica Residencial BT1 vs. Cobertura Preventiva EMPAM",
      "hubX": "III. Energía",
      "hubY": "VIII. Salud",
      "varX": "tarifa_bt1_clp",
      "varY": "cobertura_empam_pct",
      "labelX": "Tarifa Eléctrica Residencial BT1",
      "labelY": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
      "unitX": "$/kWh",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        287.8,
        294.0,
        287.8,
        292.4,
        312.0,
        289.5,
        289.5,
        291.2,
        308.0,
        318.0
      ],
      "dataY": [
        80.8,
        71.8,
        78.4,
        76.5,
        70.6,
        79.4,
        75.9,
        77.8,
        69.1,
        68.4
      ],
      "regressionLine": {
        "slopeBeta1": -0.35971,
        "interceptBeta0": 181.7124,
        "rSquaredPct": 80.0,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "Donde la electricidad residencial es más cara, baja la cobertura de controles del adulto mayor: Tortel (318 $/kWh) registra 68,4%, mientras Coyhaique (287,8 $/kWh) sube a 80,8%.",
      "plainExplanation": "Donde la electricidad residencial es más cara, baja la cobertura de controles del adulto mayor: Tortel (318 $/kWh) registra 68,4%, mientras Coyhaique (287,8 $/kWh) sube a 80,8%.",
      "notable_commune": "Caso atípico: Lago Verde registra –4,2 % por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 80.8,
          "expectedY": 78.19,
          "diffY": 2.61,
          "zResid": 1.36,
          "note": "Coyhaique registra 80,8 %, 2,6 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Lago Verde": {
          "actualY": 71.8,
          "expectedY": 75.96,
          "diffY": -4.16,
          "zResid": -2.17,
          "note": "Lago Verde registra 71,8 %, 4,2 % por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Aysén": {
          "actualY": 78.4,
          "expectedY": 78.19,
          "diffY": 0.21,
          "zResid": 0.11,
          "note": "Aysén (78,4 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cisnes": {
          "actualY": 76.5,
          "expectedY": 76.53,
          "diffY": -0.03,
          "zResid": -0.02,
          "note": "Cisnes (76,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 70.6,
          "expectedY": 69.48,
          "diffY": 1.12,
          "zResid": 0.58,
          "note": "Guaitecas registra 70,6 %, 1,1 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Chile Chico": {
          "actualY": 79.4,
          "expectedY": 77.58,
          "diffY": 1.82,
          "zResid": 0.95,
          "note": "Chile Chico registra 79,4 %, 1,8 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Río Ibáñez": {
          "actualY": 75.9,
          "expectedY": 77.58,
          "diffY": -1.68,
          "zResid": -0.87,
          "note": "Río Ibáñez registra 75,9 %, 1,7 % por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Cochrane": {
          "actualY": 77.8,
          "expectedY": 76.96,
          "diffY": 0.84,
          "zResid": 0.44,
          "note": "Cochrane (77,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 69.1,
          "expectedY": 70.92,
          "diffY": -1.82,
          "zResid": -0.95,
          "note": "O'Higgins registra 69,1 %, 1,8 % por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Tortel": {
          "actualY": 68.4,
          "expectedY": 67.32,
          "diffY": 1.08,
          "zResid": 0.56,
          "note": "Tortel registra 68,4 %, 1,1 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 80% · r = –0,89 · Sin Coyhaique: –0,90 · Control pob.: –0,80",
      "statProofBadges": {
        "fuerzaExplicativaPct": 80,
        "pearsonR": -0.894,
        "spearmanRho": -0.909,
        "kendallTau": -0.796,
        "partialCorrPop": -0.795,
        "rWithoutCoyhaique": -0.896,
        "firstDiffCorrDelta": -0.795,
        "pValueFdr": 0.000572,
        "veredictoSimple": "R² 80% · r = –0,89 · Sin Coyhaique: –0,90 · Control pob.: –0,80"
      }
    },
    {
      "id": "disc_03",
      "order": 3,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Cobertura de Fibra Óptica al Hogar vs. Retención de Compras Locales",
      "headline": "Cobertura de Fibra Óptica al Hogar vs. Retención de Compras Locales",
      "hubX": "III. Energía",
      "hubY": "V. Inversión",
      "varX": "cobertura_fibra_hogar_pct",
      "varY": "compras_locales_pct",
      "labelX": "Cobertura de Fibra Óptica al Hogar (FTTH)",
      "labelY": "Retención de Compras Públicas en Proveedores Locales",
      "unitX": "%",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        68.4,
        0.0,
        54.2,
        24.8,
        2.4,
        36.5,
        21.4,
        39.2,
        0.0,
        2.1
      ],
      "dataY": [
        58.4,
        22.1,
        54.6,
        38.2,
        24.5,
        41.2,
        32.8,
        44.5,
        18.4,
        21.0
      ],
      "regressionLine": {
        "slopeBeta1": 0.57698,
        "interceptBeta0": 21.2032,
        "rSquaredPct": 98.2,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Con mayor fibra óptica al hogar, las pymes locales captan más compras públicas: Coyhaique (68,4% de fibra) retiene 58,4% del gasto en la comuna, versus 22,1% en Lago Verde (0,0%).",
      "plainExplanation": "Con mayor fibra óptica al hogar, las pymes locales captan más compras públicas: Coyhaique (68,4% de fibra) retiene 58,4% del gasto en la comuna, versus 22,1% en Lago Verde (0,0%).",
      "notable_commune": "Caso atípico: O'Higgins registra –2,8 % por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 58.4,
          "expectedY": 60.67,
          "diffY": -2.27,
          "zResid": -1.24,
          "note": "Coyhaique registra 58,4 %, 2,3 % por debajo de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Lago Verde": {
          "actualY": 22.1,
          "expectedY": 21.2,
          "diffY": 0.9,
          "zResid": 0.49,
          "note": "Lago Verde registra 22,1 %, 0,9 % por encima de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Aysén": {
          "actualY": 54.6,
          "expectedY": 52.48,
          "diffY": 2.12,
          "zResid": 1.16,
          "note": "Aysén registra 54,6 %, 2,1 % por encima de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Cisnes": {
          "actualY": 38.2,
          "expectedY": 35.51,
          "diffY": 2.69,
          "zResid": 1.47,
          "note": "Cisnes registra 38,2 %, 2,7 % por encima de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Guaitecas": {
          "actualY": 24.5,
          "expectedY": 22.59,
          "diffY": 1.91,
          "zResid": 1.05,
          "note": "Guaitecas registra 24,5 %, 1,9 % por encima de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Chile Chico": {
          "actualY": 41.2,
          "expectedY": 42.26,
          "diffY": -1.06,
          "zResid": -0.58,
          "note": "Chile Chico registra 41,2 %, 1,1 % por debajo de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Río Ibáñez": {
          "actualY": 32.8,
          "expectedY": 33.55,
          "diffY": -0.75,
          "zResid": -0.41,
          "note": "Río Ibáñez (32,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cochrane": {
          "actualY": 44.5,
          "expectedY": 43.82,
          "diffY": 0.68,
          "zResid": 0.37,
          "note": "Cochrane (44,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 18.4,
          "expectedY": 21.2,
          "diffY": -2.8,
          "zResid": -1.53,
          "note": "O'Higgins registra 18,4 %, 2,8 % por debajo de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Tortel": {
          "actualY": 21.0,
          "expectedY": 22.41,
          "diffY": -1.41,
          "zResid": -0.77,
          "note": "Tortel registra 21,0 %, 1,4 % por debajo de lo esperado según su nivel de cobertura de fibra óptica."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 98% · r = +0,99 · Sin Coyhaique: +0,99 · Control pob.: +0,88",
      "statProofBadges": {
        "fuerzaExplicativaPct": 98,
        "pearsonR": 0.991,
        "spearmanRho": 0.979,
        "kendallTau": 0.944,
        "partialCorrPop": 0.88,
        "rWithoutCoyhaique": 0.99,
        "firstDiffCorrDelta": 0.88,
        "pValueFdr": 0.0,
        "veredictoSimple": "R² 98% · r = +0,99 · Sin Coyhaique: +0,99 · Control pob.: +0,88"
      }
    },
    {
      "id": "disc_04",
      "order": 4,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Plazo de Evaluación Ambiental SEIA vs. Participación Municipal",
      "headline": "Plazo de Evaluación Ambiental SEIA vs. Participación Municipal",
      "hubX": "V. Inversión",
      "hubY": "IV. Gobernanza",
      "varX": "seia_plazo_dias",
      "varY": "participacion_municipales_2024_pct",
      "labelX": "Plazo Promedio de Evaluación Ambiental SEIA",
      "labelY": "Participación Electoral Municipal",
      "unitX": "días",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        890.0,
        780.0,
        960.0,
        945.0,
        820.0,
        880.0,
        810.0,
        850.0,
        760.0,
        740.0
      ],
      "dataY": [
        84.2,
        87.5,
        82.8,
        83.1,
        85.9,
        83.6,
        86.4,
        85.2,
        88.0,
        87.3
      ],
      "regressionLine": {
        "slopeBeta1": -0.02463,
        "interceptBeta0": 106.1793,
        "rSquaredPct": 94.0,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "Las comunas con tramitación ambiental más extensa registran menor votación municipal: Aysén (960 días) marca 82,8% de participación, frente a 87,3% en Tortel (740 días).",
      "plainExplanation": "Las comunas con tramitación ambiental más extensa registran menor votación municipal: Aysén (960 días) marca 82,8% de participación, frente a 87,3% en Tortel (740 días).",
      "notable_commune": "Caso atípico: Chile Chico registra –0,9 % por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 84.2,
          "expectedY": 84.25,
          "diffY": -0.05,
          "zResid": -0.12,
          "note": "Coyhaique (84,2 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Lago Verde": {
          "actualY": 87.5,
          "expectedY": 86.96,
          "diffY": 0.54,
          "zResid": 1.21,
          "note": "Lago Verde registra 87,5 %, 0,5 % por encima de lo esperado según su nivel de plazo de evaluación SEIA."
        },
        "Aysén": {
          "actualY": 82.8,
          "expectedY": 82.53,
          "diffY": 0.27,
          "zResid": 0.61,
          "note": "Aysén registra 82,8 %, 0,3 % por encima de lo esperado según su nivel de plazo de evaluación SEIA."
        },
        "Cisnes": {
          "actualY": 83.1,
          "expectedY": 82.9,
          "diffY": 0.2,
          "zResid": 0.45,
          "note": "Cisnes registra 83,1 %, 0,2 % por encima de lo esperado según su nivel de plazo de evaluación SEIA."
        },
        "Guaitecas": {
          "actualY": 85.9,
          "expectedY": 85.98,
          "diffY": -0.08,
          "zResid": -0.18,
          "note": "Guaitecas (85,9 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 83.6,
          "expectedY": 84.5,
          "diffY": -0.9,
          "zResid": -2.03,
          "note": "Chile Chico registra 83,6 %, 0,9 % por debajo de lo esperado según su nivel de plazo de evaluación SEIA."
        },
        "Río Ibáñez": {
          "actualY": 86.4,
          "expectedY": 86.23,
          "diffY": 0.17,
          "zResid": 0.39,
          "note": "Río Ibáñez (86,4 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cochrane": {
          "actualY": 85.2,
          "expectedY": 85.24,
          "diffY": -0.04,
          "zResid": -0.09,
          "note": "Cochrane (85,2 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 88.0,
          "expectedY": 87.46,
          "diffY": 0.54,
          "zResid": 1.22,
          "note": "O'Higgins registra 88,0 %, 0,5 % por encima de lo esperado según su nivel de plazo de evaluación SEIA."
        },
        "Tortel": {
          "actualY": 87.3,
          "expectedY": 87.95,
          "diffY": -0.65,
          "zResid": -1.46,
          "note": "Tortel registra 87,3 %, 0,6 % por debajo de lo esperado según su nivel de plazo de evaluación SEIA."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 94% · r = –0,97 · Sin Coyhaique: –0,97 · Control pob.: –0,90",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": -0.97,
        "spearmanRho": -0.952,
        "kendallTau": -0.867,
        "partialCorrPop": -0.904,
        "rWithoutCoyhaique": -0.968,
        "firstDiffCorrDelta": -0.904,
        "pValueFdr": 9e-06,
        "veredictoSimple": "R² 94% · r = –0,97 · Sin Coyhaique: –0,97 · Control pob.: –0,90"
      }
    },
    {
      "id": "disc_05",
      "order": 5,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Interrupciones Eléctricas (SAIDI) vs. Cobertura Preventiva EMPAM",
      "headline": "Interrupciones Eléctricas (SAIDI) vs. Cobertura Preventiva EMPAM",
      "hubX": "III. Energía",
      "hubY": "VIII. Salud",
      "varX": "saidi_horas_anual",
      "varY": "cobertura_empam_pct",
      "labelX": "Tiempo Anual de Interrupción Eléctrica (SAIDI)",
      "labelY": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
      "unitX": "horas/año",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        11.4,
        54.2,
        13.8,
        28.5,
        62.1,
        19.3,
        24.6,
        22.8,
        58.7,
        64.3
      ],
      "dataY": [
        80.8,
        71.8,
        78.4,
        76.5,
        70.6,
        79.4,
        75.9,
        77.8,
        69.1,
        68.4
      ],
      "regressionLine": {
        "slopeBeta1": -0.20756,
        "interceptBeta0": 82.336,
        "rSquaredPct": 95.6,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "A más horas anuales sin suministro eléctrico, menor control preventivo de mayores: en Tortel (64,3 h/año) la cobertura llega a 68,4%, contra 80,8% en Coyhaique (11,4 h/año).",
      "plainExplanation": "A más horas anuales sin suministro eléctrico, menor control preventivo de mayores: en Tortel (64,3 h/año) la cobertura llega a 68,4%, contra 80,8% en Coyhaique (11,4 h/año).",
      "notable_commune": "Caso atípico: Río Ibáñez registra –1,3 % por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 80.8,
          "expectedY": 79.97,
          "diffY": 0.83,
          "zResid": 0.92,
          "note": "Coyhaique registra 80,8 %, 0,8 % por encima de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Lago Verde": {
          "actualY": 71.8,
          "expectedY": 71.09,
          "diffY": 0.71,
          "zResid": 0.79,
          "note": "Lago Verde registra 71,8 %, 0,7 % por encima de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Aysén": {
          "actualY": 78.4,
          "expectedY": 79.47,
          "diffY": -1.07,
          "zResid": -1.19,
          "note": "Aysén registra 78,4 %, 1,1 % por debajo de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Cisnes": {
          "actualY": 76.5,
          "expectedY": 76.42,
          "diffY": 0.08,
          "zResid": 0.09,
          "note": "Cisnes (76,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 70.6,
          "expectedY": 69.45,
          "diffY": 1.15,
          "zResid": 1.28,
          "note": "Guaitecas registra 70,6 %, 1,2 % por encima de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Chile Chico": {
          "actualY": 79.4,
          "expectedY": 78.33,
          "diffY": 1.07,
          "zResid": 1.19,
          "note": "Chile Chico registra 79,4 %, 1,1 % por encima de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Río Ibáñez": {
          "actualY": 75.9,
          "expectedY": 77.23,
          "diffY": -1.33,
          "zResid": -1.48,
          "note": "Río Ibáñez registra 75,9 %, 1,3 % por debajo de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Cochrane": {
          "actualY": 77.8,
          "expectedY": 77.6,
          "diffY": 0.2,
          "zResid": 0.22,
          "note": "Cochrane (77,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 69.1,
          "expectedY": 70.15,
          "diffY": -1.05,
          "zResid": -1.17,
          "note": "O'Higgins registra 69,1 %, 1,1 % por debajo de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Tortel": {
          "actualY": 68.4,
          "expectedY": 68.99,
          "diffY": -0.59,
          "zResid": -0.66,
          "note": "Tortel registra 68,4 %, 0,6 % por debajo de lo esperado según su nivel de interrupciones eléctricas."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 96% · r = –0,98 · Sin Coyhaique: –0,97 · Control pob.: –0,90",
      "statProofBadges": {
        "fuerzaExplicativaPct": 96,
        "pearsonR": -0.978,
        "spearmanRho": -0.964,
        "kendallTau": -0.867,
        "partialCorrPop": -0.9,
        "rWithoutCoyhaique": -0.975,
        "firstDiffCorrDelta": -0.9,
        "pValueFdr": 4e-06,
        "veredictoSimple": "R² 96% · r = –0,98 · Sin Coyhaique: –0,97 · Control pob.: –0,90"
      }
    },
    {
      "id": "disc_06",
      "order": 6,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Interrupciones Eléctricas (SAIDI) vs. Aprobación de Proyectos RS",
      "headline": "Interrupciones Eléctricas (SAIDI) vs. Aprobación de Proyectos RS",
      "hubX": "III. Energía",
      "hubY": "IV. Gobernanza",
      "varX": "saidi_horas_anual",
      "varY": "tasa_aprobacion_rs_sni_pct",
      "labelX": "Tiempo Anual de Interrupción Eléctrica (SAIDI)",
      "labelY": "Tasa de Aprobación Técnica RS de Proyectos (SNI)",
      "unitX": "horas/año",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        11.4,
        54.2,
        13.8,
        28.5,
        62.1,
        19.3,
        24.6,
        22.8,
        58.7,
        64.3
      ],
      "dataY": [
        45.0,
        28.0,
        42.0,
        35.0,
        22.0,
        36.0,
        34.0,
        35.0,
        20.0,
        18.0
      ],
      "regressionLine": {
        "slopeBeta1": -0.41713,
        "interceptBeta0": 46.5043,
        "rSquaredPct": 93.0,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "El rezago eléctrico coincide con brechas de inversión pública: Tortel suma 64,3 horas de corte y aprueba 18,0% de proyectos RS, mientras Coyhaique (11,4 h) logra 45,0%.",
      "plainExplanation": "El rezago eléctrico coincide con brechas de inversión pública: Tortel suma 64,3 horas de corte y aprueba 18,0% de proyectos RS, mientras Coyhaique (11,4 h) logra 45,0%.",
      "notable_commune": "Caso atípico: Lago Verde registra +4,1 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 45.0,
          "expectedY": 41.75,
          "diffY": 3.25,
          "zResid": 1.41,
          "note": "Coyhaique registra 45,0 %, 3,3 % por encima de lo esperado según su nivel de cortes eléctricos anuales."
        },
        "Lago Verde": {
          "actualY": 28.0,
          "expectedY": 23.9,
          "diffY": 4.1,
          "zResid": 1.78,
          "note": "Lago Verde registra 28,0 %, 4,1 % por encima de lo esperado según su nivel de cortes eléctricos anuales."
        },
        "Aysén": {
          "actualY": 42.0,
          "expectedY": 40.75,
          "diffY": 1.25,
          "zResid": 0.54,
          "note": "Aysén registra 42,0 %, 1,3 % por encima de lo esperado según su nivel de cortes eléctricos anuales."
        },
        "Cisnes": {
          "actualY": 35.0,
          "expectedY": 34.62,
          "diffY": 0.38,
          "zResid": 0.17,
          "note": "Cisnes (35,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 22.0,
          "expectedY": 20.6,
          "diffY": 1.4,
          "zResid": 0.61,
          "note": "Guaitecas registra 22,0 %, 1,4 % por encima de lo esperado según su nivel de cortes eléctricos anuales."
        },
        "Chile Chico": {
          "actualY": 36.0,
          "expectedY": 38.45,
          "diffY": -2.45,
          "zResid": -1.07,
          "note": "Chile Chico registra 36,0 %, 2,5 % por debajo de lo esperado según su nivel de cortes eléctricos anuales."
        },
        "Río Ibáñez": {
          "actualY": 34.0,
          "expectedY": 36.24,
          "diffY": -2.24,
          "zResid": -0.97,
          "note": "Río Ibáñez registra 34,0 %, 2,2 % por debajo de lo esperado según su nivel de cortes eléctricos anuales."
        },
        "Cochrane": {
          "actualY": 35.0,
          "expectedY": 36.99,
          "diffY": -1.99,
          "zResid": -0.87,
          "note": "Cochrane registra 35,0 %, 2,0 % por debajo de lo esperado según su nivel de cortes eléctricos anuales."
        },
        "O'Higgins": {
          "actualY": 20.0,
          "expectedY": 22.02,
          "diffY": -2.02,
          "zResid": -0.88,
          "note": "O'Higgins registra 20,0 %, 2,0 % por debajo de lo esperado según su nivel de cortes eléctricos anuales."
        },
        "Tortel": {
          "actualY": 18.0,
          "expectedY": 19.68,
          "diffY": -1.68,
          "zResid": -0.73,
          "note": "Tortel registra 18,0 %, 1,7 % por debajo de lo esperado según su nivel de cortes eléctricos anuales."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 93% · r = –0,96 · Sin Coyhaique: –0,96 · Control pob.: –0,84",
      "statProofBadges": {
        "fuerzaExplicativaPct": 93,
        "pearsonR": -0.965,
        "spearmanRho": -0.967,
        "kendallTau": -0.899,
        "partialCorrPop": -0.844,
        "rWithoutCoyhaique": -0.964,
        "firstDiffCorrDelta": -0.844,
        "pValueFdr": 1.3e-05,
        "veredictoSimple": "R² 93% · r = –0,96 · Sin Coyhaique: –0,96 · Control pob.: –0,84"
      }
    },
    {
      "id": "disc_07",
      "order": 7,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Cortes Eléctricos Anuales (SAIDI) vs. Pobreza Multidimensional",
      "headline": "Cortes Eléctricos Anuales (SAIDI) vs. Pobreza Multidimensional",
      "hubX": "III. Energía",
      "hubY": "VI. Social",
      "varX": "saidi_horas_anual",
      "varY": "pobreza_multidim_pct",
      "labelX": "Tiempo Anual de Interrupción Eléctrica (SAIDI)",
      "labelY": "Pobreza Multidimensional (CASEN)",
      "unitX": "horas/año",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        11.4,
        54.2,
        13.8,
        28.5,
        62.1,
        19.3,
        24.6,
        22.8,
        58.7,
        64.3
      ],
      "dataY": [
        11.8,
        24.5,
        15.2,
        18.6,
        27.4,
        16.2,
        19.8,
        15.0,
        22.8,
        26.2
      ],
      "regressionLine": {
        "slopeBeta1": 0.23721,
        "interceptBeta0": 11.2174,
        "rSquaredPct": 90.7,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "La fragilidad eléctrica va de la mano con carencias multidimensionales: Tortel (64,3 h al año) alcanza 26,2% en CASEN, más del doble que Coyhaique (11,8% con 11,4 h).",
      "plainExplanation": "La fragilidad eléctrica va de la mano con carencias multidimensionales: Tortel (64,3 h al año) alcanza 26,2% en CASEN, más del doble que Coyhaique (11,8% con 11,4 h).",
      "notable_commune": "Caso atípico: Río Ibáñez registra +2,7 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 11.8,
          "expectedY": 13.92,
          "diffY": -2.12,
          "zResid": -1.38,
          "note": "Coyhaique registra 11,8 %, 2,1 % por debajo de lo esperado según su nivel de horas de corte eléctrico."
        },
        "Lago Verde": {
          "actualY": 24.5,
          "expectedY": 24.07,
          "diffY": 0.43,
          "zResid": 0.28,
          "note": "Lago Verde (24,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Aysén": {
          "actualY": 15.2,
          "expectedY": 14.49,
          "diffY": 0.71,
          "zResid": 0.46,
          "note": "Aysén registra 15,2 %, 0,7 % por encima de lo esperado según su nivel de horas de corte eléctrico."
        },
        "Cisnes": {
          "actualY": 18.6,
          "expectedY": 17.98,
          "diffY": 0.62,
          "zResid": 0.4,
          "note": "Cisnes (18,6 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 27.4,
          "expectedY": 25.95,
          "diffY": 1.45,
          "zResid": 0.95,
          "note": "Guaitecas registra 27,4 %, 1,5 % por encima de lo esperado según su nivel de horas de corte eléctrico."
        },
        "Chile Chico": {
          "actualY": 16.2,
          "expectedY": 15.8,
          "diffY": 0.4,
          "zResid": 0.26,
          "note": "Chile Chico (16,2 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Río Ibáñez": {
          "actualY": 19.8,
          "expectedY": 17.05,
          "diffY": 2.75,
          "zResid": 1.79,
          "note": "Río Ibáñez registra 19,8 %, 2,7 % por encima de lo esperado según su nivel de horas de corte eléctrico."
        },
        "Cochrane": {
          "actualY": 15.0,
          "expectedY": 16.63,
          "diffY": -1.63,
          "zResid": -1.06,
          "note": "Cochrane registra 15,0 %, 1,6 % por debajo de lo esperado según su nivel de horas de corte eléctrico."
        },
        "O'Higgins": {
          "actualY": 22.8,
          "expectedY": 25.14,
          "diffY": -2.34,
          "zResid": -1.52,
          "note": "O'Higgins registra 22,8 %, 2,3 % por debajo de lo esperado según su nivel de horas de corte eléctrico."
        },
        "Tortel": {
          "actualY": 26.2,
          "expectedY": 26.47,
          "diffY": -0.27,
          "zResid": -0.18,
          "note": "Tortel (26,2 %) se ubica prácticamente en línea con la tendencia regional."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 91% · r = +0,95 · Sin Coyhaique: +0,95 · Control pob.: +0,80",
      "statProofBadges": {
        "fuerzaExplicativaPct": 91,
        "pearsonR": 0.952,
        "spearmanRho": 0.927,
        "kendallTau": 0.778,
        "partialCorrPop": 0.802,
        "rWithoutCoyhaique": 0.95,
        "firstDiffCorrDelta": 0.802,
        "pValueFdr": 3.7e-05,
        "veredictoSimple": "R² 91% · r = +0,95 · Sin Coyhaique: +0,95 · Control pob.: +0,80"
      }
    },
    {
      "id": "disc_08",
      "order": 8,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Interrupciones Eléctricas (SAIDI) vs. Déficit Habitacional",
      "headline": "Interrupciones Eléctricas (SAIDI) vs. Déficit Habitacional",
      "hubX": "III. Energía",
      "hubY": "VI. Social",
      "varX": "saidi_horas_anual",
      "varY": "deficit_habitacional_total_por_1000_hab",
      "labelX": "Tiempo Anual de Interrupción Eléctrica (SAIDI)",
      "labelY": "Déficit Habitacional Relativo (MINVU)",
      "unitX": "horas/año",
      "unitY": "viv/1.000 hab",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        11.4,
        54.2,
        13.8,
        28.5,
        62.1,
        19.3,
        24.6,
        22.8,
        58.7,
        64.3
      ],
      "dataY": [
        30.1,
        41.1,
        31.0,
        33.9,
        55.7,
        27.3,
        29.7,
        32.1,
        40.2,
        77.2
      ],
      "regressionLine": {
        "slopeBeta1": 0.59271,
        "interceptBeta0": 18.5104,
        "rSquaredPct": 65.6,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Las comunas con suministro más inestable arrastran mayor déficit habitacional: Tortel (64,3 h/año) registra 77,2 viviendas deficitarias por mil hab., frente a 30,1 en Coyhaique.",
      "plainExplanation": "Las comunas con suministro más inestable arrastran mayor déficit habitacional: Tortel (64,3 h/año) registra 77,2 viviendas deficitarias por mil hab., frente a 30,1 en Coyhaique.",
      "notable_commune": "Caso atípico: Tortel registra +20,6 viv/1.000 hab por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 30.1,
          "expectedY": 25.27,
          "diffY": 4.83,
          "zResid": 0.56,
          "note": "Coyhaique registra 30,1 viv/1.000 hab, 4,8 viv/1.000 hab por encima de lo esperado según su nivel de horas sin suministro."
        },
        "Lago Verde": {
          "actualY": 41.1,
          "expectedY": 50.64,
          "diffY": -9.54,
          "zResid": -1.1,
          "note": "Lago Verde registra 41,1 viv/1.000 hab, 9,5 viv/1.000 hab por debajo de lo esperado según su nivel de horas sin suministro."
        },
        "Aysén": {
          "actualY": 31.0,
          "expectedY": 26.69,
          "diffY": 4.31,
          "zResid": 0.5,
          "note": "Aysén registra 31,0 viv/1.000 hab, 4,3 viv/1.000 hab por encima de lo esperado según su nivel de horas sin suministro."
        },
        "Cisnes": {
          "actualY": 33.9,
          "expectedY": 35.4,
          "diffY": -1.5,
          "zResid": -0.17,
          "note": "Cisnes (33,9 viv/1.000 hab) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 55.7,
          "expectedY": 55.32,
          "diffY": 0.38,
          "zResid": 0.04,
          "note": "Guaitecas (55,7 viv/1.000 hab) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 27.3,
          "expectedY": 29.95,
          "diffY": -2.65,
          "zResid": -0.31,
          "note": "Chile Chico (27,3 viv/1.000 hab) se ubica prácticamente en línea con la tendencia regional."
        },
        "Río Ibáñez": {
          "actualY": 29.7,
          "expectedY": 33.09,
          "diffY": -3.39,
          "zResid": -0.39,
          "note": "Río Ibáñez (29,7 viv/1.000 hab) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cochrane": {
          "actualY": 32.1,
          "expectedY": 32.02,
          "diffY": 0.08,
          "zResid": 0.01,
          "note": "Cochrane (32,1 viv/1.000 hab) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 40.2,
          "expectedY": 53.3,
          "diffY": -13.1,
          "zResid": -1.51,
          "note": "O'Higgins registra 40,2 viv/1.000 hab, 13,1 viv/1.000 hab por debajo de lo esperado según su nivel de horas sin suministro."
        },
        "Tortel": {
          "actualY": 77.2,
          "expectedY": 56.62,
          "diffY": 20.58,
          "zResid": 2.38,
          "note": "Tortel registra 77,2 viv/1.000 hab, 20,6 viv/1.000 hab por encima de lo esperado según su nivel de horas sin suministro."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 66% · r = +0,81 · Sin Coyhaique: +0,81 · Control pob.: +0,69",
      "statProofBadges": {
        "fuerzaExplicativaPct": 66,
        "pearsonR": 0.81,
        "spearmanRho": 0.855,
        "kendallTau": 0.733,
        "partialCorrPop": 0.691,
        "rWithoutCoyhaique": 0.808,
        "firstDiffCorrDelta": 0.691,
        "pValueFdr": 0.004693,
        "veredictoSimple": "R² 66% · r = +0,81 · Sin Coyhaique: +0,81 · Control pob.: +0,69"
      }
    },
    {
      "id": "disc_09",
      "order": 9,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Precio de Gasolina 93 vs. Aprobación Técnica de Proyectos RS",
      "headline": "Precio de Gasolina 93 vs. Aprobación Técnica de Proyectos RS",
      "hubX": "III. Energía",
      "hubY": "IV. Gobernanza",
      "varX": "gasolina_93_clp",
      "varY": "tasa_aprobacion_rs_sni_pct",
      "labelX": "Precio Minorista de Gasolina 93 Octanos",
      "labelY": "Tasa de Aprobación Técnica RS de Proyectos (SNI)",
      "unitX": "$/L",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        1652.0,
        1765.0,
        1651.0,
        1695.0,
        1785.0,
        1710.0,
        1705.0,
        1714.0,
        1812.0,
        1790.0
      ],
      "dataY": [
        45.0,
        28.0,
        42.0,
        35.0,
        22.0,
        36.0,
        34.0,
        35.0,
        20.0,
        18.0
      ],
      "regressionLine": {
        "slopeBeta1": -0.15706,
        "interceptBeta0": 302.8885,
        "rSquaredPct": 95.2,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "El sobrecosto logístico encarece las obras sobre los valores referenciales: en O'Higgins (gasolina a 1.812 $/L) solo 20,0% obtiene RS, versus 42,0% en Aysén (1.651 $/L).",
      "plainExplanation": "El sobrecosto logístico encarece las obras sobre los valores referenciales: en O'Higgins (gasolina a 1.812 $/L) solo 20,0% obtiene RS, versus 42,0% en Aysén (1.651 $/L).",
      "notable_commune": "Caso atípico: Tortel registra –3,7 % por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 45.0,
          "expectedY": 43.42,
          "diffY": 1.58,
          "zResid": 0.83,
          "note": "Coyhaique registra 45,0 %, 1,6 % por encima de lo esperado según su nivel de precio de la gasolina."
        },
        "Lago Verde": {
          "actualY": 28.0,
          "expectedY": 25.67,
          "diffY": 2.33,
          "zResid": 1.22,
          "note": "Lago Verde registra 28,0 %, 2,3 % por encima de lo esperado según su nivel de precio de la gasolina."
        },
        "Aysén": {
          "actualY": 42.0,
          "expectedY": 43.58,
          "diffY": -1.58,
          "zResid": -0.83,
          "note": "Aysén registra 42,0 %, 1,6 % por debajo de lo esperado según su nivel de precio de la gasolina."
        },
        "Cisnes": {
          "actualY": 35.0,
          "expectedY": 36.67,
          "diffY": -1.67,
          "zResid": -0.88,
          "note": "Cisnes registra 35,0 %, 1,7 % por debajo de lo esperado según su nivel de precio de la gasolina."
        },
        "Guaitecas": {
          "actualY": 22.0,
          "expectedY": 22.53,
          "diffY": -0.53,
          "zResid": -0.28,
          "note": "Guaitecas (22,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 36.0,
          "expectedY": 34.31,
          "diffY": 1.69,
          "zResid": 0.89,
          "note": "Chile Chico registra 36,0 %, 1,7 % por encima de lo esperado según su nivel de precio de la gasolina."
        },
        "Río Ibáñez": {
          "actualY": 34.0,
          "expectedY": 35.1,
          "diffY": -1.1,
          "zResid": -0.58,
          "note": "Río Ibáñez registra 34,0 %, 1,1 % por debajo de lo esperado según su nivel de precio de la gasolina."
        },
        "Cochrane": {
          "actualY": 35.0,
          "expectedY": 33.68,
          "diffY": 1.32,
          "zResid": 0.69,
          "note": "Cochrane registra 35,0 %, 1,3 % por encima de lo esperado según su nivel de precio de la gasolina."
        },
        "O'Higgins": {
          "actualY": 20.0,
          "expectedY": 18.29,
          "diffY": 1.71,
          "zResid": 0.9,
          "note": "O'Higgins registra 20,0 %, 1,7 % por encima de lo esperado según su nivel de precio de la gasolina."
        },
        "Tortel": {
          "actualY": 18.0,
          "expectedY": 21.75,
          "diffY": -3.75,
          "zResid": -1.97,
          "note": "Tortel registra 18,0 %, 3,7 % por debajo de lo esperado según su nivel de precio de la gasolina."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 95% · r = –0,98 · Sin Coyhaique: –0,97 · Control pob.: –0,82",
      "statProofBadges": {
        "fuerzaExplicativaPct": 95,
        "pearsonR": -0.976,
        "spearmanRho": -0.9,
        "kendallTau": -0.764,
        "partialCorrPop": -0.82,
        "rWithoutCoyhaique": -0.97,
        "firstDiffCorrDelta": -0.82,
        "pValueFdr": 5e-06,
        "veredictoSimple": "R² 95% · r = –0,98 · Sin Coyhaique: –0,97 · Control pob.: –0,82"
      }
    },
    {
      "id": "disc_10",
      "order": 10,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Tarifa Eléctrica Residencial BT1 vs. Aprobación Técnica de Proyectos RS",
      "headline": "Tarifa Eléctrica Residencial BT1 vs. Aprobación Técnica de Proyectos RS",
      "hubX": "III. Energía",
      "hubY": "IV. Gobernanza",
      "varX": "tarifa_bt1_clp",
      "varY": "tasa_aprobacion_rs_sni_pct",
      "labelX": "Tarifa Eléctrica Residencial BT1",
      "labelY": "Tasa de Aprobación Técnica RS de Proyectos (SNI)",
      "unitX": "$/kWh",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        287.8,
        294.0,
        287.8,
        292.4,
        312.0,
        289.5,
        289.5,
        291.2,
        308.0,
        318.0
      ],
      "dataY": [
        45.0,
        28.0,
        42.0,
        35.0,
        22.0,
        36.0,
        34.0,
        35.0,
        20.0,
        18.0
      ],
      "regressionLine": {
        "slopeBeta1": -0.752,
        "interceptBeta0": 254.8598,
        "rSquaredPct": 84.2,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "Las comunas con Sistemas Aislados y mayor tarifa BT1 enfrentan mayores brechas para lograr aprobación RS en el SNI: Tortel (318 $/kWh) alcanza 18,0% RS, frente a 45,0% en Coyhaique (287,8 $/kWh).",
      "plainExplanation": "Las comunas con Sistemas Aislados y mayor tarifa BT1 enfrentan mayores brechas para lograr aprobación RS en el SNI: Tortel (318 $/kWh) alcanza 18,0% RS, frente a 45,0% en Coyhaique (287,8 $/kWh).",
      "notable_commune": "Caso atípico: Coyhaique registra +6,6 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 45.0,
          "expectedY": 38.43,
          "diffY": 6.57,
          "zResid": 1.9,
          "note": "Coyhaique registra 45,0 %, 6,6 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Lago Verde": {
          "actualY": 28.0,
          "expectedY": 33.77,
          "diffY": -5.77,
          "zResid": -1.67,
          "note": "Lago Verde registra 28,0 %, 5,8 % por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Aysén": {
          "actualY": 42.0,
          "expectedY": 38.43,
          "diffY": 3.57,
          "zResid": 1.03,
          "note": "Aysén registra 42,0 %, 3,6 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Cisnes": {
          "actualY": 35.0,
          "expectedY": 34.97,
          "diffY": 0.03,
          "zResid": 0.01,
          "note": "Cisnes (35,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 22.0,
          "expectedY": 20.24,
          "diffY": 1.76,
          "zResid": 0.51,
          "note": "Guaitecas registra 22,0 %, 1,8 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Chile Chico": {
          "actualY": 36.0,
          "expectedY": 37.16,
          "diffY": -1.16,
          "zResid": -0.33,
          "note": "Chile Chico (36,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Río Ibáñez": {
          "actualY": 34.0,
          "expectedY": 37.16,
          "diffY": -3.16,
          "zResid": -0.91,
          "note": "Río Ibáñez registra 34,0 %, 3,2 % por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Cochrane": {
          "actualY": 35.0,
          "expectedY": 35.88,
          "diffY": -0.88,
          "zResid": -0.25,
          "note": "Cochrane (35,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 20.0,
          "expectedY": 23.24,
          "diffY": -3.24,
          "zResid": -0.94,
          "note": "O'Higgins registra 20,0 %, 3,2 % por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Tortel": {
          "actualY": 18.0,
          "expectedY": 15.72,
          "diffY": 2.28,
          "zResid": 0.66,
          "note": "Tortel registra 18,0 %, 2,3 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 84% · r = –0,92 · Sin Coyhaique: –0,94 · Control pob.: –0,97",
      "statProofBadges": {
        "fuerzaExplicativaPct": 84,
        "pearsonR": -0.918,
        "spearmanRho": -0.93,
        "kendallTau": -0.828,
        "partialCorrPop": -0.97,
        "rWithoutCoyhaique": -0.937,
        "firstDiffCorrDelta": -0.97,
        "pValueFdr": 0.000239,
        "veredictoSimple": "R² 84% · r = –0,92 · Sin Coyhaique: –0,94 · Control pob.: –0,97"
      }
    },
    {
      "id": "disc_11",
      "order": 11,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Profesionalización Municipal vs. Dotación Médica Comunal",
      "headline": "Profesionalización Municipal vs. Dotación Médica Comunal",
      "hubX": "IV. Gobernanza",
      "hubY": "VIII. Salud",
      "varX": "profesionalizacion_pct",
      "varY": "medicos_por_mil_hab",
      "labelX": "Profesionalización de la Planta Municipal",
      "labelY": "Dotación de Médicos por cada 1.000 Habitantes",
      "unitX": "%",
      "unitY": "médicos/1.000 hab",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        36.4,
        12.5,
        28.2,
        18.6,
        11.8,
        15.4,
        14.1,
        16.2,
        10.5,
        9.8
      ],
      "dataY": [
        3.12,
        0.82,
        1.74,
        1.15,
        0.95,
        1.28,
        0.88,
        1.42,
        0.78,
        0.85
      ],
      "regressionLine": {
        "slopeBeta1": 0.07888,
        "interceptBeta0": -0.0695,
        "rSquaredPct": 89.8,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Los municipios con mayor planta profesional también sostienen mayor dotación médica: Coyhaique (36,4% profesional) alcanza 3,1 médicos/1.000 hab, frente a 0,8 en Tortel (9,8%).",
      "plainExplanation": "Los municipios con mayor planta profesional también sostienen mayor dotación médica: Coyhaique (36,4% profesional) alcanza 3,1 médicos/1.000 hab, frente a 0,8 en Tortel (9,8%).",
      "notable_commune": "Caso atípico: Aysén registra –0,4 médicos/1.000 hab por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 3.12,
          "expectedY": 2.8,
          "diffY": 0.32,
          "zResid": 1.48,
          "note": "Coyhaique registra 3,1 médicos/1.000 hab, 0,3 médicos/1.000 hab por encima de lo esperado según su nivel de profesionalización municipal."
        },
        "Lago Verde": {
          "actualY": 0.82,
          "expectedY": 0.92,
          "diffY": -0.1,
          "zResid": -0.45,
          "note": "Lago Verde (0,8 médicos/1.000 hab) se ubica prácticamente en línea con la tendencia regional."
        },
        "Aysén": {
          "actualY": 1.74,
          "expectedY": 2.15,
          "diffY": -0.41,
          "zResid": -1.93,
          "note": "Aysén registra 1,7 médicos/1.000 hab, 0,4 médicos/1.000 hab por debajo de lo esperado según su nivel de profesionalización municipal."
        },
        "Cisnes": {
          "actualY": 1.15,
          "expectedY": 1.4,
          "diffY": -0.25,
          "zResid": -1.15,
          "note": "Cisnes registra 1,1 médicos/1.000 hab, 0,2 médicos/1.000 hab por debajo de lo esperado según su nivel de profesionalización municipal."
        },
        "Guaitecas": {
          "actualY": 0.95,
          "expectedY": 0.86,
          "diffY": 0.09,
          "zResid": 0.41,
          "note": "Guaitecas (0,9 médicos/1.000 hab) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 1.28,
          "expectedY": 1.15,
          "diffY": 0.13,
          "zResid": 0.63,
          "note": "Chile Chico registra 1,3 médicos/1.000 hab, 0,1 médicos/1.000 hab por encima de lo esperado según su nivel de profesionalización municipal."
        },
        "Río Ibáñez": {
          "actualY": 0.88,
          "expectedY": 1.04,
          "diffY": -0.16,
          "zResid": -0.76,
          "note": "Río Ibáñez registra 0,9 médicos/1.000 hab, 0,2 médicos/1.000 hab por debajo de lo esperado según su nivel de profesionalización municipal."
        },
        "Cochrane": {
          "actualY": 1.42,
          "expectedY": 1.21,
          "diffY": 0.21,
          "zResid": 0.98,
          "note": "Cochrane registra 1,4 médicos/1.000 hab, 0,2 médicos/1.000 hab por encima de lo esperado según su nivel de profesionalización municipal."
        },
        "O'Higgins": {
          "actualY": 0.78,
          "expectedY": 0.76,
          "diffY": 0.02,
          "zResid": 0.1,
          "note": "O'Higgins (0,8 médicos/1.000 hab) se ubica prácticamente en línea con la tendencia regional."
        },
        "Tortel": {
          "actualY": 0.85,
          "expectedY": 0.7,
          "diffY": 0.15,
          "zResid": 0.68,
          "note": "Tortel registra 0,8 médicos/1.000 hab, 0,1 médicos/1.000 hab por encima de lo esperado según su nivel de profesionalización municipal."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 90% · r = +0,95 · Sin Coyhaique: +0,90 · Control pob.: +0,73",
      "statProofBadges": {
        "fuerzaExplicativaPct": 90,
        "pearsonR": 0.948,
        "spearmanRho": 0.879,
        "kendallTau": 0.733,
        "partialCorrPop": 0.726,
        "rWithoutCoyhaique": 0.895,
        "firstDiffCorrDelta": 0.726,
        "pValueFdr": 4.8e-05,
        "veredictoSimple": "R² 90% · r = +0,95 · Sin Coyhaique: +0,90 · Control pob.: +0,73"
      }
    },
    {
      "id": "disc_12",
      "order": 12,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Subsidio Fiscal Diésel vs. Aprobación de Proyectos RS",
      "headline": "Subsidio Fiscal Diésel vs. Aprobación de Proyectos RS",
      "hubX": "III. Energía",
      "hubY": "IV. Gobernanza",
      "varX": "subsidio_fiscal_diesel_kwh_clp",
      "varY": "tasa_aprobacion_rs_sni_pct",
      "labelX": "Subsidio Fiscal a Sistemas Eléctricos Aislados",
      "labelY": "Tasa de Aprobación Técnica RS de Proyectos (SNI)",
      "unitX": "$/kWh",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        0.0,
        246.0,
        192.0,
        245.0,
        328.0,
        0.0,
        0.0,
        0.0,
        312.0,
        362.0
      ],
      "dataY": [
        45.0,
        28.0,
        42.0,
        35.0,
        22.0,
        36.0,
        34.0,
        35.0,
        20.0,
        18.0
      ],
      "regressionLine": {
        "slopeBeta1": -0.04573,
        "interceptBeta0": 39.2056,
        "rSquaredPct": 57.6,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "Los municipios con mayor subsidio diésel también enfrentan más trabas técnicas en inversión: Tortel recibe 362 $/kWh y aprueba 18,0% RS, ante 45,0% en Coyhaique (0 $/kWh).",
      "plainExplanation": "Los municipios con mayor subsidio diésel también enfrentan más trabas técnicas en inversión: Tortel recibe 362 $/kWh y aprueba 18,0% RS, ante 45,0% en Coyhaique (0 $/kWh).",
      "notable_commune": "Caso atípico: Aysén registra +11,6 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 45.0,
          "expectedY": 39.21,
          "diffY": 5.79,
          "zResid": 1.02,
          "note": "Coyhaique registra 45,0 %, 5,8 % por encima de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Lago Verde": {
          "actualY": 28.0,
          "expectedY": 27.96,
          "diffY": 0.04,
          "zResid": 0.01,
          "note": "Lago Verde (28,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Aysén": {
          "actualY": 42.0,
          "expectedY": 30.43,
          "diffY": 11.57,
          "zResid": 2.04,
          "note": "Aysén registra 42,0 %, 11,6 % por encima de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Cisnes": {
          "actualY": 35.0,
          "expectedY": 28.0,
          "diffY": 7.0,
          "zResid": 1.23,
          "note": "Cisnes registra 35,0 %, 7,0 % por encima de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Guaitecas": {
          "actualY": 22.0,
          "expectedY": 24.21,
          "diffY": -2.21,
          "zResid": -0.39,
          "note": "Guaitecas (22,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 36.0,
          "expectedY": 39.21,
          "diffY": -3.21,
          "zResid": -0.56,
          "note": "Chile Chico registra 36,0 %, 3,2 % por debajo de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Río Ibáñez": {
          "actualY": 34.0,
          "expectedY": 39.21,
          "diffY": -5.21,
          "zResid": -0.92,
          "note": "Río Ibáñez registra 34,0 %, 5,2 % por debajo de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Cochrane": {
          "actualY": 35.0,
          "expectedY": 39.21,
          "diffY": -4.21,
          "zResid": -0.74,
          "note": "Cochrane registra 35,0 %, 4,2 % por debajo de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "O'Higgins": {
          "actualY": 20.0,
          "expectedY": 24.94,
          "diffY": -4.94,
          "zResid": -0.87,
          "note": "O'Higgins registra 20,0 %, 4,9 % por debajo de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Tortel": {
          "actualY": 18.0,
          "expectedY": 22.65,
          "diffY": -4.65,
          "zResid": -0.82,
          "note": "Tortel registra 18,0 %, 4,7 % por debajo de lo esperado según su nivel de subsidio fiscal diésel."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 58% · r = –0,76 · Sin Coyhaique: –0,71 · Control pob.: –0,68",
      "statProofBadges": {
        "fuerzaExplicativaPct": 58,
        "pearsonR": -0.759,
        "spearmanRho": -0.8,
        "kendallTau": -0.676,
        "partialCorrPop": -0.679,
        "rWithoutCoyhaique": -0.708,
        "firstDiffCorrDelta": -0.679,
        "pValueFdr": 0.010916,
        "veredictoSimple": "R² 58% · r = –0,76 · Sin Coyhaique: –0,71 · Control pob.: –0,68"
      }
    },
    {
      "id": "disc_13",
      "order": 13,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Aprobación Técnica RS (SNI) vs. Cobertura Preventiva EMPAM",
      "headline": "Aprobación Técnica RS (SNI) vs. Cobertura Preventiva EMPAM",
      "hubX": "IV. Gobernanza",
      "hubY": "VIII. Salud",
      "varX": "tasa_aprobacion_rs_sni_pct",
      "varY": "cobertura_empam_pct",
      "labelX": "Tasa de Aprobación Técnica RS de Proyectos (SNI)",
      "labelY": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
      "unitX": "%",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        45.0,
        28.0,
        42.0,
        35.0,
        22.0,
        36.0,
        34.0,
        35.0,
        20.0,
        18.0
      ],
      "dataY": [
        80.8,
        71.8,
        78.4,
        76.5,
        70.6,
        79.4,
        75.9,
        77.8,
        69.1,
        68.4
      ],
      "regressionLine": {
        "slopeBeta1": 0.47475,
        "interceptBeta0": 59.9153,
        "rSquaredPct": 93.5,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Donde el municipio logra aprobar más proyectos, la salud primaria también cubre más: Coyhaique (45,0% RS) alcanza 80,8% en EMPAM, frente a 68,4% en Tortel (18,0% RS).",
      "plainExplanation": "Donde el municipio logra aprobar más proyectos, la salud primaria también cubre más: Coyhaique (45,0% RS) alcanza 80,8% en EMPAM, frente a 68,4% en Tortel (18,0% RS).",
      "notable_commune": "Caso atípico: Chile Chico registra +2,4 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 80.8,
          "expectedY": 81.28,
          "diffY": -0.48,
          "zResid": -0.44,
          "note": "Coyhaique (80,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Lago Verde": {
          "actualY": 71.8,
          "expectedY": 73.21,
          "diffY": -1.41,
          "zResid": -1.29,
          "note": "Lago Verde registra 71,8 %, 1,4 % por debajo de lo esperado según su nivel de tasa de aprobación RS."
        },
        "Aysén": {
          "actualY": 78.4,
          "expectedY": 79.85,
          "diffY": -1.45,
          "zResid": -1.34,
          "note": "Aysén registra 78,4 %, 1,5 % por debajo de lo esperado según su nivel de tasa de aprobación RS."
        },
        "Cisnes": {
          "actualY": 76.5,
          "expectedY": 76.53,
          "diffY": -0.03,
          "zResid": -0.03,
          "note": "Cisnes (76,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 70.6,
          "expectedY": 70.36,
          "diffY": 0.24,
          "zResid": 0.22,
          "note": "Guaitecas (70,6 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 79.4,
          "expectedY": 77.01,
          "diffY": 2.39,
          "zResid": 2.2,
          "note": "Chile Chico registra 79,4 %, 2,4 % por encima de lo esperado según su nivel de tasa de aprobación RS."
        },
        "Río Ibáñez": {
          "actualY": 75.9,
          "expectedY": 76.06,
          "diffY": -0.16,
          "zResid": -0.14,
          "note": "Río Ibáñez (75,9 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cochrane": {
          "actualY": 77.8,
          "expectedY": 76.53,
          "diffY": 1.27,
          "zResid": 1.17,
          "note": "Cochrane registra 77,8 %, 1,3 % por encima de lo esperado según su nivel de tasa de aprobación RS."
        },
        "O'Higgins": {
          "actualY": 69.1,
          "expectedY": 69.41,
          "diffY": -0.31,
          "zResid": -0.29,
          "note": "O'Higgins (69,1 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Tortel": {
          "actualY": 68.4,
          "expectedY": 68.46,
          "diffY": -0.06,
          "zResid": -0.06,
          "note": "Tortel (68,4 %) se ubica prácticamente en línea con la tendencia regional."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 94% · r = +0,97 · Sin Coyhaique: +0,96 · Control pob.: +0,83",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.967,
        "spearmanRho": 0.985,
        "kendallTau": 0.944,
        "partialCorrPop": 0.834,
        "rWithoutCoyhaique": 0.959,
        "firstDiffCorrDelta": 0.834,
        "pValueFdr": 1e-05,
        "veredictoSimple": "R² 94% · r = +0,97 · Sin Coyhaique: +0,96 · Control pob.: +0,83"
      }
    },
    {
      "id": "disc_14",
      "order": 14,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Aprobación de Proyectos RS vs. Salud Cardiovascular (PSCV)",
      "headline": "Aprobación de Proyectos RS vs. Salud Cardiovascular (PSCV)",
      "hubX": "IV. Gobernanza",
      "hubY": "VIII. Salud",
      "varX": "tasa_aprobacion_rs_sni_pct",
      "varY": "cobertura_pscv_pct",
      "labelX": "Tasa de Aprobación Técnica RS de Proyectos (SNI)",
      "labelY": "Cobertura del Programa de Salud Cardiovascular (PSCV)",
      "unitX": "%",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        45.0,
        28.0,
        42.0,
        35.0,
        22.0,
        36.0,
        34.0,
        35.0,
        20.0,
        18.0
      ],
      "dataY": [
        74.8,
        67.8,
        70.2,
        71.8,
        66.4,
        74.1,
        68.9,
        73.4,
        63.4,
        63.9
      ],
      "regressionLine": {
        "slopeBeta1": 0.39573,
        "interceptBeta0": 57.0046,
        "rSquaredPct": 78.5,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "La capacidad para sacar adelante carteras de inversión se refleja en la red clínica: Coyhaique aprueba 45,0% RS y sostiene 74,8% cardiovascular, versus 63,9% en Tortel (18,0%).",
      "plainExplanation": "La capacidad para sacar adelante carteras de inversión se refleja en la red clínica: Coyhaique aprueba 45,0% RS y sostiene 74,8% cardiovascular, versus 63,9% en Tortel (18,0%).",
      "notable_commune": "Caso atípico: Aysén registra –3,4 % por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 74.8,
          "expectedY": 74.81,
          "diffY": -0.01,
          "zResid": -0.01,
          "note": "Coyhaique (74,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Lago Verde": {
          "actualY": 67.8,
          "expectedY": 68.08,
          "diffY": -0.28,
          "zResid": -0.16,
          "note": "Lago Verde (67,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Aysén": {
          "actualY": 70.2,
          "expectedY": 73.63,
          "diffY": -3.43,
          "zResid": -1.9,
          "note": "Aysén registra 70,2 %, 3,4 % por debajo de lo esperado según su nivel de tasa de proyectos RS."
        },
        "Cisnes": {
          "actualY": 71.8,
          "expectedY": 70.86,
          "diffY": 0.94,
          "zResid": 0.52,
          "note": "Cisnes registra 71,8 %, 0,9 % por encima de lo esperado según su nivel de tasa de proyectos RS."
        },
        "Guaitecas": {
          "actualY": 66.4,
          "expectedY": 65.71,
          "diffY": 0.69,
          "zResid": 0.38,
          "note": "Guaitecas (66,4 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 74.1,
          "expectedY": 71.25,
          "diffY": 2.85,
          "zResid": 1.58,
          "note": "Chile Chico registra 74,1 %, 2,8 % por encima de lo esperado según su nivel de tasa de proyectos RS."
        },
        "Río Ibáñez": {
          "actualY": 68.9,
          "expectedY": 70.46,
          "diffY": -1.56,
          "zResid": -0.86,
          "note": "Río Ibáñez registra 68,9 %, 1,6 % por debajo de lo esperado según su nivel de tasa de proyectos RS."
        },
        "Cochrane": {
          "actualY": 73.4,
          "expectedY": 70.86,
          "diffY": 2.54,
          "zResid": 1.41,
          "note": "Cochrane registra 73,4 %, 2,5 % por encima de lo esperado según su nivel de tasa de proyectos RS."
        },
        "O'Higgins": {
          "actualY": 63.4,
          "expectedY": 64.92,
          "diffY": -1.52,
          "zResid": -0.84,
          "note": "O'Higgins registra 63,4 %, 1,5 % por debajo de lo esperado según su nivel de tasa de proyectos RS."
        },
        "Tortel": {
          "actualY": 63.9,
          "expectedY": 64.13,
          "diffY": -0.23,
          "zResid": -0.13,
          "note": "Tortel (63,9 %) se ubica prácticamente en línea con la tendencia regional."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 78% · r = +0,89 · Sin Coyhaique: +0,85 · Control pob.: +0,67",
      "statProofBadges": {
        "fuerzaExplicativaPct": 78,
        "pearsonR": 0.886,
        "spearmanRho": 0.912,
        "kendallTau": 0.809,
        "partialCorrPop": 0.67,
        "rWithoutCoyhaique": 0.854,
        "firstDiffCorrDelta": 0.67,
        "pValueFdr": 0.000726,
        "veredictoSimple": "R² 78% · r = +0,89 · Sin Coyhaique: +0,85 · Control pob.: +0,67"
      }
    },
    {
      "id": "disc_15",
      "order": 15,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Índice de Aislamiento Multimodal vs. Cobertura Preventiva EMPAM",
      "headline": "Índice de Aislamiento Multimodal vs. Cobertura Preventiva EMPAM",
      "hubX": "IV. Gobernanza",
      "hubY": "VIII. Salud",
      "varX": "indice_aislamiento_multimodal",
      "varY": "cobertura_empam_pct",
      "labelX": "Índice Compuesto de Aislamiento Multimodal",
      "labelY": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
      "unitX": "puntos",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        1.1,
        67.5,
        5.8,
        19.2,
        77.6,
        30.6,
        22.7,
        23.6,
        86.4,
        81.4
      ],
      "dataY": [
        80.8,
        71.8,
        78.4,
        76.5,
        70.6,
        79.4,
        75.9,
        77.8,
        69.1,
        68.4
      ],
      "regressionLine": {
        "slopeBeta1": -0.13025,
        "interceptBeta0": 80.2871,
        "rSquaredPct": 90.6,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "La fricción de viaje por ripio y navegación reduce el control preventivo de mayores: O'Higgins (86,4 puntos de aislamiento) cubre 69,1%, mientras Coyhaique (1,1 puntos) llega a 80,8%.",
      "plainExplanation": "La fricción de viaje por ripio y navegación reduce el control preventivo de mayores: O'Higgins (86,4 puntos de aislamiento) cubre 69,1%, mientras Coyhaique (1,1 puntos) llega a 80,8%.",
      "notable_commune": "Caso atípico: Chile Chico registra +3,1 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 80.8,
          "expectedY": 80.14,
          "diffY": 0.66,
          "zResid": 0.5,
          "note": "Coyhaique registra 80,8 %, 0,7 % por encima de lo esperado según su nivel de aislamiento multimodal."
        },
        "Lago Verde": {
          "actualY": 71.8,
          "expectedY": 71.5,
          "diffY": 0.3,
          "zResid": 0.23,
          "note": "Lago Verde (71,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Aysén": {
          "actualY": 78.4,
          "expectedY": 79.53,
          "diffY": -1.13,
          "zResid": -0.86,
          "note": "Aysén registra 78,4 %, 1,1 % por debajo de lo esperado según su nivel de aislamiento multimodal."
        },
        "Cisnes": {
          "actualY": 76.5,
          "expectedY": 77.79,
          "diffY": -1.29,
          "zResid": -0.98,
          "note": "Cisnes registra 76,5 %, 1,3 % por debajo de lo esperado según su nivel de aislamiento multimodal."
        },
        "Guaitecas": {
          "actualY": 70.6,
          "expectedY": 70.18,
          "diffY": 0.42,
          "zResid": 0.32,
          "note": "Guaitecas (70,6 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 79.4,
          "expectedY": 76.3,
          "diffY": 3.1,
          "zResid": 2.36,
          "note": "Chile Chico registra 79,4 %, 3,1 % por encima de lo esperado según su nivel de aislamiento multimodal."
        },
        "Río Ibáñez": {
          "actualY": 75.9,
          "expectedY": 77.33,
          "diffY": -1.43,
          "zResid": -1.09,
          "note": "Río Ibáñez registra 75,9 %, 1,4 % por debajo de lo esperado según su nivel de aislamiento multimodal."
        },
        "Cochrane": {
          "actualY": 77.8,
          "expectedY": 77.21,
          "diffY": 0.59,
          "zResid": 0.45,
          "note": "Cochrane (77,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 69.1,
          "expectedY": 69.03,
          "diffY": 0.07,
          "zResid": 0.05,
          "note": "O'Higgins (69,1 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Tortel": {
          "actualY": 68.4,
          "expectedY": 69.68,
          "diffY": -1.28,
          "zResid": -0.98,
          "note": "Tortel registra 68,4 %, 1,3 % por debajo de lo esperado según su nivel de aislamiento multimodal."
        }
      },
      "methodologicalCaveat": "Nota metodológica: el Índice de Aislamiento Multimodal es un indicador sintético (25% SAIDI, 25% brecha de internet fijo, 25% tiempo de viaje a Coyhaique y 25% sobrecosto de combustible) cruzado aquí contra cobertura preventiva de salud externa.",
      "metrics_line": "R² 91% · r = –0,95 · Sin Coyhaique: –0,94 · Control pob.: –0,76",
      "statProofBadges": {
        "fuerzaExplicativaPct": 91,
        "pearsonR": -0.952,
        "spearmanRho": -0.83,
        "kendallTau": -0.689,
        "partialCorrPop": -0.762,
        "rWithoutCoyhaique": -0.94,
        "firstDiffCorrDelta": -0.762,
        "pValueFdr": 3.7e-05,
        "veredictoSimple": "R² 91% · r = –0,95 · Sin Coyhaique: –0,94 · Control pob.: –0,76"
      }
    },
    {
      "id": "disc_16",
      "order": 16,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Centros Activos de Salmonicultura vs. Proyectos Aprobados SEIA",
      "headline": "Centros Activos de Salmonicultura vs. Proyectos Aprobados SEIA",
      "hubX": "II. Salmonicultura",
      "hubY": "V. Inversión",
      "varX": "centros_activos_salmon",
      "varY": "proyectos_seia_aprobados",
      "labelX": "Centros de Cultivo de Salmón Activos",
      "labelY": "Proyectos de Inversión Aprobados en el SEIA",
      "unitX": "centros",
      "unitY": "proyectos",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        0.0,
        0.0,
        135.0,
        78.0,
        32.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0
      ],
      "dataY": [
        118.0,
        9.0,
        254.0,
        122.0,
        86.0,
        41.0,
        27.0,
        33.0,
        14.0,
        18.0
      ],
      "regressionLine": {
        "slopeBeta1": 1.49344,
        "interceptBeta0": 35.6106,
        "rSquaredPct": 81.8,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "En el litoral de canales, la acuicultura concentra la evaluación ambiental: Aysén reúne 135 centros activos y 254 proyectos SEIA aprobados, versus 0 y 118 en Coyhaique.",
      "plainExplanation": "En el litoral de canales, la acuicultura concentra la evaluación ambiental: Aysén reúne 135 centros activos y 254 proyectos SEIA aprobados, versus 0 y 118 en Coyhaique.",
      "notable_commune": "Caso atípico: Coyhaique registra +82,4 proyectos por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 118.0,
          "expectedY": 35.61,
          "diffY": 82.39,
          "zResid": 2.66,
          "note": "Coyhaique registra 118 proyectos, 82,4 proyectos por encima de lo esperado según su nivel de centros activos de salmón."
        },
        "Lago Verde": {
          "actualY": 9.0,
          "expectedY": 35.61,
          "diffY": -26.61,
          "zResid": -0.86,
          "note": "Lago Verde registra 9 proyectos, 26,6 proyectos por debajo de lo esperado según su nivel de centros activos de salmón."
        },
        "Aysén": {
          "actualY": 254.0,
          "expectedY": 237.23,
          "diffY": 16.77,
          "zResid": 0.54,
          "note": "Aysén registra 254 proyectos, 16,8 proyectos por encima de lo esperado según su nivel de centros activos de salmón."
        },
        "Cisnes": {
          "actualY": 122.0,
          "expectedY": 152.1,
          "diffY": -30.1,
          "zResid": -0.97,
          "note": "Cisnes registra 122 proyectos, 30,1 proyectos por debajo de lo esperado según su nivel de centros activos de salmón."
        },
        "Guaitecas": {
          "actualY": 86.0,
          "expectedY": 83.4,
          "diffY": 2.6,
          "zResid": 0.08,
          "note": "Guaitecas (86 proyectos) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 41.0,
          "expectedY": 35.61,
          "diffY": 5.39,
          "zResid": 0.17,
          "note": "Chile Chico (41 proyectos) se ubica prácticamente en línea con la tendencia regional."
        },
        "Río Ibáñez": {
          "actualY": 27.0,
          "expectedY": 35.61,
          "diffY": -8.61,
          "zResid": -0.28,
          "note": "Río Ibáñez (27 proyectos) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cochrane": {
          "actualY": 33.0,
          "expectedY": 35.61,
          "diffY": -2.61,
          "zResid": -0.08,
          "note": "Cochrane (33 proyectos) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 14.0,
          "expectedY": 35.61,
          "diffY": -21.61,
          "zResid": -0.7,
          "note": "O'Higgins registra 14 proyectos, 21,6 proyectos por debajo de lo esperado según su nivel de centros activos de salmón."
        },
        "Tortel": {
          "actualY": 18.0,
          "expectedY": 35.61,
          "diffY": -17.61,
          "zResid": -0.57,
          "note": "Tortel registra 18 proyectos, 17,6 proyectos por debajo de lo esperado según su nivel de centros activos de salmón."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 82% · r = +0,91 · Sin Coyhaique: +0,98 · Control pob.: +0,96",
      "statProofBadges": {
        "fuerzaExplicativaPct": 82,
        "pearsonR": 0.905,
        "spearmanRho": 0.753,
        "kendallTau": 0.669,
        "partialCorrPop": 0.96,
        "rWithoutCoyhaique": 0.982,
        "firstDiffCorrDelta": 0.96,
        "pValueFdr": 0.000404,
        "veredictoSimple": "R² 82% · r = +0,91 · Sin Coyhaique: +0,98 · Control pob.: +0,96"
      }
    },
    {
      "id": "disc_17",
      "order": 17,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Superficie Solicitada ECMPO vs. Inversión Aprobada en el SEIA",
      "headline": "Superficie Solicitada ECMPO vs. Inversión Aprobada en el SEIA",
      "hubX": "II. Salmonicultura",
      "hubY": "V. Inversión",
      "varX": "ecmpo_solicitadas_ha",
      "varY": "inversion_seia_mmusd",
      "labelX": "Superficie Solicitada en ECMPO (Ley Lafkenche)",
      "labelY": "Inversión Privada Aprobada en el SEIA",
      "unitX": "hectáreas",
      "unitY": "MM US$",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        0.0,
        0.0,
        393000.0,
        227000.0,
        148000.0,
        0.0,
        0.0,
        0.0,
        0.0,
        18500.0
      ],
      "dataY": [
        495.6,
        31.4,
        1320.0,
        525.0,
        245.0,
        310.0,
        142.0,
        172.0,
        48.0,
        66.5
      ],
      "regressionLine": {
        "slopeBeta1": 0.00247,
        "interceptBeta0": 141.0051,
        "rSquaredPct": 75.3,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Las solicitudes costeras indígenas se superponen con los polos de inversión litoral: Aysén suma 393.000 ha ECMPO y 1.320 MM US$ en el SEIA, frente a 0 ha y 495,6 MM US$ en Coyhaique.",
      "plainExplanation": "Las solicitudes costeras indígenas se superponen con los polos de inversión litoral: Aysén suma 393.000 ha ECMPO y 1.320 MM US$ en el SEIA, frente a 0 ha y 495,6 MM US$ en Coyhaique.",
      "notable_commune": "Caso atípico: Coyhaique registra +354,6 MM US$ por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 495.6,
          "expectedY": 141.01,
          "diffY": 354.59,
          "zResid": 1.94,
          "note": "Coyhaique registra 495,6 MM US$, 354,6 MM US$ por encima de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Lago Verde": {
          "actualY": 31.4,
          "expectedY": 141.01,
          "diffY": -109.61,
          "zResid": -0.6,
          "note": "Lago Verde registra 31,4 MM US$, 109,6 MM US$ por debajo de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Aysén": {
          "actualY": 1320.0,
          "expectedY": 1113.11,
          "diffY": 206.89,
          "zResid": 1.13,
          "note": "Aysén registra 1.320 MM US$, 206,9 MM US$ por encima de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Cisnes": {
          "actualY": 525.0,
          "expectedY": 702.5,
          "diffY": -177.5,
          "zResid": -0.97,
          "note": "Cisnes registra 525 MM US$, 177,5 MM US$ por debajo de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Guaitecas": {
          "actualY": 245.0,
          "expectedY": 507.09,
          "diffY": -262.09,
          "zResid": -1.44,
          "note": "Guaitecas registra 245 MM US$, 262,1 MM US$ por debajo de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Chile Chico": {
          "actualY": 310.0,
          "expectedY": 141.01,
          "diffY": 168.99,
          "zResid": 0.93,
          "note": "Chile Chico registra 310 MM US$, 169 MM US$ por encima de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Río Ibáñez": {
          "actualY": 142.0,
          "expectedY": 141.01,
          "diffY": 0.99,
          "zResid": 0.01,
          "note": "Río Ibáñez (142 MM US$) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cochrane": {
          "actualY": 172.0,
          "expectedY": 141.01,
          "diffY": 30.99,
          "zResid": 0.17,
          "note": "Cochrane (172 MM US$) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 48.0,
          "expectedY": 141.01,
          "diffY": -93.01,
          "zResid": -0.51,
          "note": "O'Higgins registra 48,0 MM US$, 93,0 MM US$ por debajo de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Tortel": {
          "actualY": 66.5,
          "expectedY": 186.77,
          "diffY": -120.27,
          "zResid": -0.66,
          "note": "Tortel registra 66,5 MM US$, 120,3 MM US$ por debajo de lo esperado según su nivel de superficie ECMPO solicitada."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 75% · r = +0,87 · Sin Coyhaique: +0,93 · Control pob.: +0,93",
      "statProofBadges": {
        "fuerzaExplicativaPct": 75,
        "pearsonR": 0.868,
        "spearmanRho": 0.574,
        "kendallTau": 0.49,
        "partialCorrPop": 0.933,
        "rWithoutCoyhaique": 0.926,
        "firstDiffCorrDelta": 0.933,
        "pValueFdr": 0.00123,
        "veredictoSimple": "R² 75% · r = +0,87 · Sin Coyhaique: +0,93 · Control pob.: +0,93"
      }
    },
    {
      "id": "disc_18",
      "order": 18,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Capacidad Eléctrica Instalada vs. Tejido Empresarial Formal (SII)",
      "headline": "Capacidad Eléctrica Instalada vs. Tejido Empresarial Formal (SII)",
      "hubX": "III. Energía",
      "hubY": "V. Inversión",
      "varX": "potencia_mw",
      "varY": "empresas_sii",
      "labelX": "Capacidad Eléctrica Instalada en el Subsistema",
      "labelY": "Empresas Formales Vigentes en el SII",
      "unitX": "MW",
      "unitY": "empresas",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        33.95,
        0.35,
        18.48,
        2.83,
        1.45,
        3.9,
        1.4,
        2.54,
        1.25,
        0.95
      ],
      "dataY": [
        7620.0,
        118.0,
        2840.0,
        895.0,
        242.0,
        648.0,
        418.0,
        492.0,
        96.0,
        84.0
      ],
      "regressionLine": {
        "slopeBeta1": 211.44335,
        "interceptBeta0": -73.4849,
        "rSquaredPct": 97.1,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "El respaldo eléctrico en Sistemas Medianos se concentra donde existe mayor actividad empresarial formal: Coyhaique reúne 34,0 MW y 7.620 empresas, ante 0,3 MW y 118 empresas en Lago Verde.",
      "plainExplanation": "El respaldo eléctrico en Sistemas Medianos se concentra donde existe mayor actividad empresarial formal: Coyhaique reúne 34,0 MW y 7.620 empresas, ante 0,3 MW y 118 empresas en Lago Verde.",
      "notable_commune": "Caso atípico: Aysén registra –994 empresas por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 7620.0,
          "expectedY": 7105.02,
          "diffY": 514.98,
          "zResid": 1.35,
          "note": "Coyhaique registra 7.620 empresas, 515 empresas por encima de lo esperado según su nivel de potencia eléctrica instalada."
        },
        "Lago Verde": {
          "actualY": 118.0,
          "expectedY": 0.52,
          "diffY": 117.48,
          "zResid": 0.31,
          "note": "Lago Verde (118 empresas) se ubica prácticamente en línea con la tendencia regional."
        },
        "Aysén": {
          "actualY": 2840.0,
          "expectedY": 3833.99,
          "diffY": -993.99,
          "zResid": -2.6,
          "note": "Aysén registra 2.840 empresas, 994 empresas por debajo de lo esperado según su nivel de potencia eléctrica instalada."
        },
        "Cisnes": {
          "actualY": 895.0,
          "expectedY": 524.9,
          "diffY": 370.1,
          "zResid": 0.97,
          "note": "Cisnes registra 895 empresas, 370,1 empresas por encima de lo esperado según su nivel de potencia eléctrica instalada."
        },
        "Guaitecas": {
          "actualY": 242.0,
          "expectedY": 233.11,
          "diffY": 8.89,
          "zResid": 0.02,
          "note": "Guaitecas (242 empresas) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 648.0,
          "expectedY": 751.14,
          "diffY": -103.14,
          "zResid": -0.27,
          "note": "Chile Chico (648 empresas) se ubica prácticamente en línea con la tendencia regional."
        },
        "Río Ibáñez": {
          "actualY": 418.0,
          "expectedY": 222.54,
          "diffY": 195.46,
          "zResid": 0.51,
          "note": "Río Ibáñez registra 418 empresas, 195,5 empresas por encima de lo esperado según su nivel de potencia eléctrica instalada."
        },
        "Cochrane": {
          "actualY": 492.0,
          "expectedY": 463.58,
          "diffY": 28.42,
          "zResid": 0.07,
          "note": "Cochrane (492 empresas) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 96.0,
          "expectedY": 190.82,
          "diffY": -94.82,
          "zResid": -0.25,
          "note": "O'Higgins (96,0 empresas) se ubica prácticamente en línea con la tendencia regional."
        },
        "Tortel": {
          "actualY": 84.0,
          "expectedY": 127.39,
          "diffY": -43.39,
          "zResid": -0.11,
          "note": "Tortel (84,0 empresas) se ubica prácticamente en línea con la tendencia regional."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 97% · r = +0,98 · Sin Coyhaique: +0,98 · Control pob.: +0,95",
      "statProofBadges": {
        "fuerzaExplicativaPct": 97,
        "pearsonR": 0.985,
        "spearmanRho": 0.939,
        "kendallTau": 0.822,
        "partialCorrPop": 0.947,
        "rWithoutCoyhaique": 0.982,
        "firstDiffCorrDelta": 0.947,
        "pValueFdr": 1e-06,
        "veredictoSimple": "R² 97% · r = +0,98 · Sin Coyhaique: +0,98 · Control pob.: +0,95"
      }
    },
    {
      "id": "disc_19",
      "order": 19,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Pernoctaciones Turísticas (EMAT) vs. Parcelaciones Rurales (SAG)",
      "headline": "Pernoctaciones Turísticas (EMAT) vs. Parcelaciones Rurales (SAG)",
      "hubX": "I. Turismo",
      "hubY": "V. Inversión",
      "varX": "pernoctaciones_emat",
      "varY": "parcelaciones_sag_n",
      "labelX": "Pernoctaciones Turísticas Anuales (EMAT)",
      "labelY": "Subdivisiones Prediales Rurales Certificadas (SAG)",
      "unitX": "noches",
      "unitY": "predios",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        138400.0,
        2800.0,
        58200.0,
        44800.0,
        2300.0,
        26500.0,
        51400.0,
        22800.0,
        6439.0,
        10400.0
      ],
      "dataY": [
        3240.0,
        185.0,
        1120.0,
        490.0,
        15.0,
        980.0,
        1280.0,
        390.0,
        140.0,
        65.0
      ],
      "regressionLine": {
        "slopeBeta1": 0.02288,
        "interceptBeta0": -42.3459,
        "rSquaredPct": 93.8,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "El atractivo turístico impulsa el loteo de predios rústicos: Coyhaique suma 138.400 noches y 3.240 subdivisiones certificadas por el SAG, contra 2.300 noches y 15 predios en Guaitecas.",
      "plainExplanation": "El atractivo turístico impulsa el loteo de predios rústicos: Coyhaique suma 138.400 noches y 3.240 subdivisiones certificadas por el SAG, contra 2.300 noches y 15 predios en Guaitecas.",
      "notable_commune": "Caso atípico: Cisnes registra –492,6 predios por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 3240.0,
          "expectedY": 3123.96,
          "diffY": 116.04,
          "zResid": 0.5,
          "note": "Coyhaique registra 3.240 predios, 116 predios por encima de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Lago Verde": {
          "actualY": 185.0,
          "expectedY": 21.71,
          "diffY": 163.29,
          "zResid": 0.71,
          "note": "Lago Verde registra 185 predios, 163,3 predios por encima de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Aysén": {
          "actualY": 1120.0,
          "expectedY": 1289.15,
          "diffY": -169.15,
          "zResid": -0.73,
          "note": "Aysén registra 1.120 predios, 169,1 predios por debajo de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Cisnes": {
          "actualY": 490.0,
          "expectedY": 982.59,
          "diffY": -492.59,
          "zResid": -2.14,
          "note": "Cisnes registra 490 predios, 492,6 predios por debajo de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Guaitecas": {
          "actualY": 15.0,
          "expectedY": 10.27,
          "diffY": 4.73,
          "zResid": 0.02,
          "note": "Guaitecas (15 predios) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 980.0,
          "expectedY": 563.92,
          "diffY": 416.08,
          "zResid": 1.8,
          "note": "Chile Chico registra 980 predios, 416,1 predios por encima de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Río Ibáñez": {
          "actualY": 1280.0,
          "expectedY": 1133.58,
          "diffY": 146.42,
          "zResid": 0.63,
          "note": "Río Ibáñez registra 1.280 predios, 146,4 predios por encima de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Cochrane": {
          "actualY": 390.0,
          "expectedY": 479.27,
          "diffY": -89.27,
          "zResid": -0.39,
          "note": "Cochrane (390 predios) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 140.0,
          "expectedY": 104.97,
          "diffY": 35.03,
          "zResid": 0.15,
          "note": "O'Higgins (140 predios) se ubica prácticamente en línea con la tendencia regional."
        },
        "Tortel": {
          "actualY": 65.0,
          "expectedY": 195.58,
          "diffY": -130.58,
          "zResid": -0.57,
          "note": "Tortel registra 65 predios, 130,6 predios por debajo de lo esperado según su nivel de pernoctaciones turísticas."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 94% · r = +0,97 · Sin Coyhaique: +0,87 · Control pob.: +0,89",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.968,
        "spearmanRho": 0.927,
        "kendallTau": 0.778,
        "partialCorrPop": 0.887,
        "rWithoutCoyhaique": 0.866,
        "firstDiffCorrDelta": 0.887,
        "pValueFdr": 1e-05,
        "veredictoSimple": "R² 94% · r = +0,97 · Sin Coyhaique: +0,87 · Control pob.: +0,89"
      }
    },
    {
      "id": "disc_20",
      "order": 20,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Episodios Críticos de MP2.5 vs. Urgencias Respiratorias",
      "headline": "Episodios Críticos de MP2.5 vs. Urgencias Respiratorias",
      "hubX": "VII. Biodiversidad",
      "hubY": "VIII. Salud",
      "varX": "episodios_gec_mp25_anual",
      "varY": "urgencias_respiratorias_pct",
      "labelX": "Episodios Críticos de Contaminación MP2.5 (GEC)",
      "labelY": "Proporción de Urgencias Respiratorias Invernales",
      "unitX": "episodios",
      "unitY": "%",
      "labels": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Chile Chico",
        "Río Ibáñez",
        "Cochrane",
        "O'Higgins",
        "Tortel"
      ],
      "dataX": [
        41.0,
        2.0,
        14.0,
        4.0,
        0.0,
        5.0,
        3.0,
        8.0,
        1.0,
        2.0
      ],
      "dataY": [
        44.5,
        18.2,
        28.6,
        21.4,
        22.8,
        20.5,
        19.8,
        24.2,
        16.5,
        17.8
      ],
      "regressionLine": {
        "slopeBeta1": 0.64713,
        "interceptBeta0": 18.2529,
        "rSquaredPct": 94.2,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "En valles con inversión térmica y leña, el humo eleva la demanda clínica: Coyhaique sufre 41 episodios críticos y 44,5% de urgencias respiratorias, vs. 22,8% en Guaitecas.",
      "plainExplanation": "En valles con inversión térmica y leña, el humo eleva la demanda clínica: Coyhaique sufre 41 episodios críticos y 44,5% de urgencias respiratorias, vs. 22,8% en Guaitecas.",
      "notable_commune": "Caso atípico: Guaitecas registra +4,5 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 44.5,
          "expectedY": 44.79,
          "diffY": -0.29,
          "zResid": -0.15,
          "note": "Coyhaique (44,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Lago Verde": {
          "actualY": 18.2,
          "expectedY": 19.55,
          "diffY": -1.35,
          "zResid": -0.72,
          "note": "Lago Verde registra 18,2 %, 1,3 % por debajo de lo esperado según su nivel de episodios críticos MP2.5."
        },
        "Aysén": {
          "actualY": 28.6,
          "expectedY": 27.31,
          "diffY": 1.29,
          "zResid": 0.69,
          "note": "Aysén registra 28,6 %, 1,3 % por encima de lo esperado según su nivel de episodios críticos MP2.5."
        },
        "Cisnes": {
          "actualY": 21.4,
          "expectedY": 20.84,
          "diffY": 0.56,
          "zResid": 0.3,
          "note": "Cisnes (21,4 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 22.8,
          "expectedY": 18.25,
          "diffY": 4.55,
          "zResid": 2.43,
          "note": "Guaitecas registra 22,8 %, 4,5 % por encima de lo esperado según su nivel de episodios críticos MP2.5."
        },
        "Chile Chico": {
          "actualY": 20.5,
          "expectedY": 21.49,
          "diffY": -0.99,
          "zResid": -0.53,
          "note": "Chile Chico registra 20,5 %, 1,0 % por debajo de lo esperado según su nivel de episodios críticos MP2.5."
        },
        "Río Ibáñez": {
          "actualY": 19.8,
          "expectedY": 20.19,
          "diffY": -0.39,
          "zResid": -0.21,
          "note": "Río Ibáñez (19,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cochrane": {
          "actualY": 24.2,
          "expectedY": 23.43,
          "diffY": 0.77,
          "zResid": 0.41,
          "note": "Cochrane (24,2 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 16.5,
          "expectedY": 18.9,
          "diffY": -2.4,
          "zResid": -1.28,
          "note": "O'Higgins registra 16,5 %, 2,4 % por debajo de lo esperado según su nivel de episodios críticos MP2.5."
        },
        "Tortel": {
          "actualY": 17.8,
          "expectedY": 19.55,
          "diffY": -1.75,
          "zResid": -0.93,
          "note": "Tortel registra 17,8 %, 1,7 % por debajo de lo esperado según su nivel de episodios críticos MP2.5."
        }
      },
      "methodologicalCaveat": "Nota metodológica: asociación transversal sobre las 10 comunas de Aysén entre registros administrativos independientes (correlación estadística no implica causalidad directa).",
      "metrics_line": "R² 94% · r = +0,97 · Sin Coyhaique: +0,83 · Control pob.: +0,90",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.971,
        "spearmanRho": 0.729,
        "kendallTau": 0.674,
        "partialCorrPop": 0.902,
        "rWithoutCoyhaique": 0.832,
        "firstDiffCorrDelta": 0.902,
        "pValueFdr": 9e-06,
        "veredictoSimple": "R² 94% · r = +0,97 · Sin Coyhaique: +0,83 · Control pob.: +0,90"
      }
    },
    {
      "id": "disc_21",
      "order": 21,
      "category": "acoplamiento_temporal_2015_2026",
      "dim": "tiempo",
      "title": "Recambio de Calefactores PDA vs. Días Críticos MP2.5 (2015–2026)",
      "headline": "Recambio de Calefactores PDA vs. Días Críticos MP2.5 (2015–2026)",
      "hubX": "III. Energía",
      "hubY": "VII. Biodiversidad",
      "varX": "recambio_calefactores_pda_hist",
      "varY": "dias_sobre_norma_mp25_hist",
      "labelX": "Recambio Acumulado de Calefactores PDA Coyhaique (2015–2026)",
      "labelY": "Días Anuales sobre Norma Diaria MP2.5 en Coyhaique (2015–2026)",
      "unitX": "calefactores",
      "unitY": "días/año",
      "labels": [
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
        "2025",
        "2026"
      ],
      "dataX": [
        0.0,
        450.0,
        1280.0,
        2340.0,
        3650.0,
        4890.0,
        6420.0,
        8150.0,
        9640.0,
        11020.0,
        12180.0,
        13250.0
      ],
      "dataY": [
        96.0,
        94.0,
        90.0,
        86.0,
        80.0,
        75.0,
        69.0,
        61.0,
        55.0,
        49.0,
        45.0,
        41.0
      ],
      "regressionLine": {
        "slopeBeta1": -0.00418,
        "interceptBeta0": 95.5981,
        "rSquaredPct": 100.0,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "Entre 2015 y 2026, reemplazar 13.250 calefactores a leña en Coyhaique bajó los días sobre norma MP2.5 de 96,0 a 41,0 al año, con avance sostenido año a año.",
      "plainExplanation": "Entre 2015 y 2026, reemplazar 13.250 calefactores a leña en Coyhaique bajó los días sobre norma MP2.5 de 96,0 a 41,0 al año, con avance sostenido año a año.",
      "notable_commune": "",
      "residualsByComuna": {},
      "methodologicalCaveat": "Nota metodológica: serie 2015–2026 reconstruida con interpolación entre hitos administrativos; la variabilidad meteorológica invernal interanual no está modelada en el ajuste lineal.",
      "metrics_line": "R² 100% · r = –1,00 · Sin 2020: –1,00 · Variación anual: –0,95",
      "statProofBadges": {
        "fuerzaExplicativaPct": 100,
        "pearsonR": -1.0,
        "spearmanRho": -1.0,
        "kendallTau": -1.0,
        "partialCorrPop": -0.95,
        "rWithoutCoyhaique": -1.0,
        "firstDiffCorrDelta": -0.95,
        "pValueFdr": 0.0,
        "veredictoSimple": "R² 100% · r = –1,00 · Sin 2020: –1,00 · Variación anual: –0,95"
      }
    },
    {
      "id": "disc_22",
      "order": 22,
      "category": "acoplamiento_temporal_2015_2026",
      "dim": "tiempo",
      "title": "Pernoctaciones EMAT vs. Tráfico Aéreo Balmaceda (2015–2026)",
      "headline": "Pernoctaciones EMAT vs. Tráfico Aéreo Balmaceda (2015–2026)",
      "hubX": "I. Turismo",
      "hubY": "IV. Gobernanza",
      "varX": "pernoctaciones_anuales_emat_hist",
      "varY": "balmaceda_pasajeros_jac",
      "labelX": "Pernoctaciones Turísticas Anuales EMAT en Aysén (2015–2026)",
      "labelY": "Flujo Anual de Pasajeros Aeródromo Balmaceda JAC (2015–2026)",
      "unitX": "pernoctaciones",
      "unitY": "pasajeros",
      "labels": [
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
        "2025",
        "2026"
      ],
      "dataX": [
        284100.0,
        302400.0,
        324800.0,
        341200.0,
        352800.0,
        108400.0,
        178500.0,
        312600.0,
        338400.0,
        351200.0,
        364039.0,
        364039.0
      ],
      "dataY": [
        446000.0,
        482000.0,
        535000.0,
        592000.0,
        678660.0,
        252810.0,
        375174.0,
        408402.0,
        594114.0,
        625501.0,
        605945.0,
        620000.0
      ],
      "regressionLine": {
        "slopeBeta1": 1.44969,
        "interceptBeta0": 80343.7779,
        "rSquaredPct": 82.6,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "El tráfico aéreo de Balmaceda y las pernoctaciones EMAT marchan acoplados entre 2015 y 2026 (de 284.100 a 364.039 noches y de 446.000 a 620.000 pasajeros), reflejando la contracción de 2020 y el rebote post-pandemia.",
      "plainExplanation": "El tráfico aéreo de Balmaceda y las pernoctaciones EMAT marchan acoplados entre 2015 y 2026 (de 284.100 a 364.039 noches y de 446.000 a 620.000 pasajeros), reflejando la contracción de 2020 y el rebote post-pandemia.",
      "notable_commune": "",
      "residualsByComuna": {},
      "methodologicalCaveat": "Nota metodológica: acoplamiento longitudinal 2015–2026 con tramos reconstruidos entre hitos oficiales; las métricas ilustran trayectoria agregada y no 12 mediciones anuales independientes.",
      "metrics_line": "R² 83% · r = +0,91 · Sin 2020: +0,83 · Variación anual: +0,87",
      "statProofBadges": {
        "fuerzaExplicativaPct": 83,
        "pearsonR": 0.909,
        "spearmanRho": 0.914,
        "kendallTau": 0.779,
        "partialCorrPop": 0.866,
        "rWithoutCoyhaique": 0.835,
        "firstDiffCorrDelta": 0.866,
        "pValueFdr": 6e-05,
        "veredictoSimple": "R² 83% · r = +0,91 · Sin 2020: +0,83 · Variación anual: +0,87"
      }
    },
    {
      "id": "disc_23",
      "order": 23,
      "category": "acoplamiento_temporal_2015_2026",
      "dim": "tiempo",
      "title": "Visitantes a Parques SNASPE vs. Tráfico Aéreo Balmaceda (2015–2026)",
      "headline": "Visitantes a Parques SNASPE vs. Tráfico Aéreo Balmaceda (2015–2026)",
      "hubX": "I. Turismo",
      "hubY": "IV. Gobernanza",
      "varX": "visitantes_snaspe_conaf_hist",
      "varY": "balmaceda_pasajeros_jac",
      "labelX": "Visitantes Anuales a Áreas Silvestres Protegidas SNASPE CONAF (2015–2026)",
      "labelY": "Flujo Anual de Pasajeros Aeródromo Balmaceda JAC (2015–2026)",
      "unitX": "visitantes",
      "unitY": "pasajeros",
      "labels": [
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
        "2025",
        "2026"
      ],
      "dataX": [
        64200.0,
        71400.0,
        79500.0,
        88200.0,
        96400.0,
        22400.0,
        44800.0,
        72500.0,
        81900.0,
        84500.0,
        86117.0,
        86117.0
      ],
      "dataY": [
        446000.0,
        482000.0,
        535000.0,
        592000.0,
        678660.0,
        252810.0,
        375174.0,
        408402.0,
        594114.0,
        625501.0,
        605945.0,
        620000.0
      ],
      "regressionLine": {
        "slopeBeta1": 5.73415,
        "interceptBeta0": 98402.39,
        "rSquaredPct": 89.8,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Las visitas oficiales CONAF en parques SNASPE (de 64.200 a 86.117) evolucionan acopladas al flujo aéreo de Balmaceda (de 446.000 a 620.000 pasajeros) entre 2015 y 2026.",
      "plainExplanation": "Las visitas oficiales CONAF en parques SNASPE (de 64.200 a 86.117) evolucionan acopladas al flujo aéreo de Balmaceda (de 446.000 a 620.000 pasajeros) entre 2015 y 2026.",
      "notable_commune": "",
      "residualsByComuna": {},
      "methodologicalCaveat": "Nota metodológica: acoplamiento longitudinal 2015–2026 con tramos reconstruidos entre hitos oficiales; las métricas ilustran trayectoria agregada y no 12 mediciones anuales independientes.",
      "metrics_line": "R² 90% · r = +0,95 · Sin 2020: +0,92 · Variación anual: +0,93",
      "statProofBadges": {
        "fuerzaExplicativaPct": 90,
        "pearsonR": 0.947,
        "spearmanRho": 0.886,
        "kendallTau": 0.748,
        "partialCorrPop": 0.925,
        "rWithoutCoyhaique": 0.915,
        "firstDiffCorrDelta": 0.925,
        "pValueFdr": 9e-06,
        "veredictoSimple": "R² 90% · r = +0,95 · Sin 2020: +0,92 · Variación anual: +0,93"
      }
    },
    {
      "id": "disc_24",
      "order": 24,
      "category": "acoplamiento_temporal_2015_2026",
      "dim": "tiempo",
      "title": "Precio Regional del Diésel vs. Tarifa Eléctrica BT1 (2015–2026)",
      "headline": "Precio Regional del Diésel vs. Tarifa Eléctrica BT1 (2015–2026)",
      "hubX": "III. Energía",
      "hubY": "VI. Social",
      "varX": "precio_diesel_regional_cne_clp_hist",
      "varY": "tarifa_bt1_regional_clp_hist",
      "labelX": "Precio Promedio Regional de Petróleo Diésel CNE (2015–2026)",
      "labelY": "Tarifa Eléctrica Residencial BT1 Promedio Aysén (2015–2026)",
      "unitX": "$/L",
      "unitY": "$/kWh",
      "labels": [
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
        "2025",
        "2026"
      ],
      "dataX": [
        610.0,
        635.0,
        665.0,
        715.0,
        755.0,
        780.0,
        860.0,
        1025.0,
        1110.0,
        1145.0,
        1172.0,
        1198.0
      ],
      "dataY": [
        162.0,
        168.0,
        174.0,
        181.0,
        189.0,
        194.0,
        204.0,
        221.0,
        234.0,
        243.0,
        252.0,
        261.0
      ],
      "regressionLine": {
        "slopeBeta1": 0.15091,
        "interceptBeta0": 72.732,
        "rSquaredPct": 98.6,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Por el peso térmico en sistemas aislados, el alza del diésel de 610 a 1.198 $/L entre 2015 y 2026 se traspasó directo a la tarifa residencial (de 162 a 261 $/kWh).",
      "plainExplanation": "Por el peso térmico en sistemas aislados, el alza del diésel de 610 a 1.198 $/L entre 2015 y 2026 se traspasó directo a la tarifa residencial (de 162 a 261 $/kWh).",
      "notable_commune": "",
      "residualsByComuna": {},
      "methodologicalCaveat": "Nota metodológica: acoplamiento longitudinal 2015–2026 con tramos reconstruidos entre hitos oficiales; las métricas ilustran trayectoria agregada y no 12 mediciones anuales independientes.",
      "metrics_line": "R² 99% · r = +0,99 · Sin 2020: +0,99 · Variación anual: +0,90",
      "statProofBadges": {
        "fuerzaExplicativaPct": 99,
        "pearsonR": 0.993,
        "spearmanRho": 1.0,
        "kendallTau": 1.0,
        "partialCorrPop": 0.901,
        "rWithoutCoyhaique": 0.994,
        "firstDiffCorrDelta": 0.901,
        "pValueFdr": 0.0,
        "veredictoSimple": "R² 99% · r = +0,99 · Sin 2020: +0,99 · Variación anual: +0,90"
      }
    },
    {
      "id": "disc_25",
      "order": 25,
      "category": "acoplamiento_temporal_2015_2026",
      "dim": "tiempo",
      "title": "Inversión en I+D+i (ANID/CORFO) vs. PIB Regional (2015–2026)",
      "headline": "Inversión en I+D+i (ANID/CORFO) vs. PIB Regional (2015–2026)",
      "hubX": "X. CTCi",
      "hubY": "V. Inversión",
      "varX": "anid_innovacion_aplicada_historico",
      "varY": "pib_regional_nominal_mmclp",
      "labelX": "Inversión Anual en I+D+i y Transferencia Aplicada ANID/CORFO (2015–2026)",
      "labelY": "Producto Interno Bruto (PIB) Regional de Aysén (2015–2026)",
      "unitX": "M$ CLP",
      "unitY": "MM$ CLP",
      "labels": [
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
        "2025",
        "2026"
      ],
      "dataX": [
        620.0,
        685.0,
        740.0,
        890.0,
        1120.0,
        1050.0,
        1280.0,
        1490.0,
        1680.0,
        1850.0,
        2040.0,
        2210.0
      ],
      "dataY": [
        980000.0,
        1045000.0,
        1120000.0,
        1215000.0,
        1260000.0,
        1240000.0,
        1410000.0,
        1540000.0,
        1620000.0,
        1680000.0,
        1755000.0,
        1830000.0
      ],
      "regressionLine": {
        "slopeBeta1": 525.09706,
        "interceptBeta0": 706217.1299,
        "rSquaredPct": 98.5,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "El gasto anual en ciencia e innovación aplicada creció de 620 a 2.210 millones entre 2015 y 2026, acompañando la expansión del PIB regional de Aysén.",
      "plainExplanation": "El gasto anual en ciencia e innovación aplicada creció de 620 a 2.210 millones entre 2015 y 2026, acompañando la expansión del PIB regional de Aysén.",
      "notable_commune": "",
      "residualsByComuna": {},
      "methodologicalCaveat": "Nota metodológica: acoplamiento longitudinal 2015–2026 con tramos reconstruidos entre hitos oficiales; las métricas ilustran trayectoria agregada y no 12 mediciones anuales independientes.",
      "metrics_line": "R² 98% · r = +0,99 · Sin 2020: +0,99 · Variación anual: +0,69",
      "statProofBadges": {
        "fuerzaExplicativaPct": 98,
        "pearsonR": 0.993,
        "spearmanRho": 1.0,
        "kendallTau": 1.0,
        "partialCorrPop": 0.691,
        "rWithoutCoyhaique": 0.993,
        "firstDiffCorrDelta": 0.691,
        "pValueFdr": 0.0,
        "veredictoSimple": "R² 98% · r = +0,99 · Sin 2020: +0,99 · Variación anual: +0,69"
      }
    }
  ],
  "comunasExplain": {
    "Coyhaique": {
      "comuna": "Coyhaique",
      "provincia": "Coyhaique",
      "poblacionCenso2024": 57823,
      "porcentajeRegionalPct": 57.4,
      "topAboveRegionalMean": [
        {
          "varKey": "total_proyectos_ctci",
          "hub": "X. CTCi",
          "label": "Total de Proyectos de Ciencia e Innovación (ANID + CORFO)",
          "unit": "proyectos",
          "comunaValue": 102.0,
          "regionalMean": 17.9,
          "zScore": 2.89,
          "diffVsMeanPct": 469.8,
          "plainSummary": "Total de Proyectos de Ciencia e Innovación (ANID + CORFO): 102,0 proyectos (promedio regional: 17,9 proyectos)"
        },
        {
          "varKey": "dias_sobre_norma_mp25",
          "hub": "VII. Biodiversidad",
          "label": "Días Anuales sobre Norma Diaria de MP2.5 (SINCA)",
          "unit": "días/año",
          "comunaValue": 87.0,
          "regionalMean": 22.5,
          "zScore": 2.82,
          "diffVsMeanPct": 286.7,
          "plainSummary": "Días Anuales sobre Norma Diaria de MP2.5 (SINCA): 87,0 días/año (promedio regional: 22,5 días/año)"
        },
        {
          "varKey": "medicos_por_mil_hab",
          "hub": "VIII. Salud",
          "label": "Dotación de Médicos por cada 1.000 Habitantes",
          "unit": "médicos/1.000 hab",
          "comunaValue": 3.12,
          "regionalMean": 1.3,
          "zScore": 2.7,
          "diffVsMeanPct": 140.2,
          "plainSummary": "Dotación de Médicos por cada 1.000 Habitantes: 3,1 médicos/1.000 hab (promedio regional: 1,3 médicos/1.000 hab)"
        },
        {
          "varKey": "suelo_privado_pct",
          "hub": "V. Inversión",
          "label": "Proporción de Suelo de Propiedad Privada",
          "unit": "%",
          "comunaValue": 62.3,
          "regionalMean": 19.95,
          "zScore": 2.45,
          "diffVsMeanPct": 212.3,
          "plainSummary": "Proporción de Suelo de Propiedad Privada: 62,3 % (promedio regional: 19,9 %)"
        },
        {
          "varKey": "profesionalizacion_pct",
          "hub": "IV. Gobernanza",
          "label": "Profesionalización de la Planta Municipal",
          "unit": "%",
          "comunaValue": 36.4,
          "regionalMean": 17.35,
          "zScore": 2.35,
          "diffVsMeanPct": 109.8,
          "plainSummary": "Profesionalización de la Planta Municipal: 36,4 % (promedio regional: 17,4 %)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "consumo_lena_m3_hogar_ano",
          "hub": "III. Energía",
          "label": "Consumo Residencial Anual de Leña por Hogar",
          "unit": "m³/hogar/año",
          "comunaValue": 9.81,
          "regionalMean": 13.62,
          "zScore": -2.33,
          "diffVsMeanPct": -28.0,
          "plainSummary": "Consumo Residencial Anual de Leña por Hogar: 9,8 m³/hogar/año (promedio regional: 13,6 m³/hogar/año)"
        },
        {
          "varKey": "dependencia_fcm_pct",
          "hub": "IV. Gobernanza",
          "label": "Dependencia del Fondo Común Municipal (FCM)",
          "unit": "%",
          "comunaValue": 46.5,
          "regionalMean": 75.79,
          "zScore": -1.98,
          "diffVsMeanPct": -38.6,
          "plainSummary": "Dependencia del Fondo Común Municipal (FCM): 46,5 % (promedio regional: 75,8 %)"
        },
        {
          "varKey": "superficie_snaspe_pct",
          "hub": "VII. Biodiversidad",
          "label": "Superficie Comunal bajo Protección SNASPE",
          "unit": "%",
          "comunaValue": 19.2,
          "regionalMean": 56.22,
          "zScore": -1.9,
          "diffVsMeanPct": -65.8,
          "plainSummary": "Superficie Comunal bajo Protección SNASPE: 19,2 % (promedio regional: 56,2 %)"
        },
        {
          "varKey": "mediana_espera_quirurgica_dias",
          "hub": "VIII. Salud",
          "label": "Mediana de Espera Quirúrgica No GES",
          "unit": "días",
          "comunaValue": 318.0,
          "regionalMean": 395.0,
          "zScore": -1.81,
          "diffVsMeanPct": -19.5,
          "plainSummary": "Mediana de Espera Quirúrgica No GES: 318,0 días (promedio regional: 395,0 días)"
        },
        {
          "varKey": "pobreza_multidim_pct",
          "hub": "VI. Social",
          "label": "Pobreza Multidimensional (CASEN)",
          "unit": "%",
          "comunaValue": 11.8,
          "regionalMean": 19.75,
          "zScore": -1.58,
          "diffVsMeanPct": -40.3,
          "plainSummary": "Pobreza Multidimensional (CASEN): 11,8 % (promedio regional: 19,8 %)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Chile Chico",
          "provincia": "General Carrera",
          "similitudPct": 56
        },
        {
          "comuna": "Aysén",
          "provincia": "Aysén",
          "similitudPct": 54
        }
      ],
      "narrativeDigest": "Coyhaique (Coyhaique, 57.823 hab.) destaca sobre la media regional en Total de Proyectos de Ciencia e Innovación (ANID + CORFO) (102,0 proyectos) y Días Anuales sobre Norma Diaria de MP2.5 (SINCA), mientras presenta sus valores más bajos frente al promedio en Consumo Residencial Anual de Leña por Hogar. Sus perfiles territoriales más parecidos son Chile Chico (56%) y Aysén (54%)."
    },
    "Lago Verde": {
      "comuna": "Lago Verde",
      "provincia": "Coyhaique",
      "poblacionCenso2024": 779,
      "porcentajeRegionalPct": 0.77,
      "topAboveRegionalMean": [
        {
          "varKey": "gasto_cultura_per_capita_clp",
          "hub": "IX. Cultura",
          "label": "Gasto Municipal en Cultura Per Cápita",
          "unit": "$/hab",
          "comunaValue": 49294.0,
          "regionalMean": 23518.0,
          "zScore": 2.14,
          "diffVsMeanPct": 109.6,
          "plainSummary": "Gasto Municipal en Cultura Per Cápita: 49294,0 $/hab (promedio regional: 23518,0 $/hab)"
        },
        {
          "varKey": "rsh_carencia_servicios_basicos_jun2026_pct",
          "hub": "VI. Social",
          "label": "Hogares con Carencia de Servicios Básicos (RSH)",
          "unit": "%",
          "comunaValue": 33.9,
          "regionalMean": 18.71,
          "zScore": 1.55,
          "diffVsMeanPct": 81.2,
          "plainSummary": "Hogares con Carencia de Servicios Básicos (RSH): 33,9 % (promedio regional: 18,7 %)"
        },
        {
          "varKey": "ruralidad_censo_2024_pct",
          "hub": "VI. Social",
          "label": "Porcentaje de Población Rural (Censo 2024)",
          "unit": "%",
          "comunaValue": 100.0,
          "regionalMean": 52.89,
          "zScore": 1.2,
          "diffVsMeanPct": 89.1,
          "plainSummary": "Porcentaje de Población Rural (Censo 2024): 100,0 % (promedio regional: 52,9 %)"
        },
        {
          "varKey": "presupuesto_per_capita_mclp",
          "hub": "IV. Gobernanza",
          "label": "Presupuesto Municipal Per Cápita",
          "unit": "M$/hab",
          "comunaValue": 3145.3,
          "regionalMean": 1873.43,
          "zScore": 1.09,
          "diffVsMeanPct": 67.9,
          "plainSummary": "Presupuesto Municipal Per Cápita: 3145,3 M$/hab (promedio regional: 1873,4 M$/hab)"
        },
        {
          "varKey": "suelo_privado_pct",
          "hub": "V. Inversión",
          "label": "Proporción de Suelo de Propiedad Privada",
          "unit": "%",
          "comunaValue": 37.3,
          "regionalMean": 19.95,
          "zScore": 1.0,
          "diffVsMeanPct": 87.0,
          "plainSummary": "Proporción de Suelo de Propiedad Privada: 37,3 % (promedio regional: 19,9 %)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "proporcion_ciencia_endogena_pct",
          "hub": "X. CTCi",
          "label": "Proporción de Ciencia Liderada por Centros Locales",
          "unit": "%",
          "comunaValue": 0.0,
          "regionalMean": 38.03,
          "zScore": -1.74,
          "diffVsMeanPct": -100.0,
          "plainSummary": "Proporción de Ciencia Liderada por Centros Locales: 0,0 % (promedio regional: 38,0 %)"
        },
        {
          "varKey": "amenaza_volcanica_sismica_idx",
          "hub": "VII. Biodiversidad",
          "label": "Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN)",
          "unit": "puntos",
          "comunaValue": 42.0,
          "regionalMean": 69.67,
          "zScore": -1.59,
          "diffVsMeanPct": -39.7,
          "plainSummary": "Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN): 42,0 puntos (promedio regional: 69,7 puntos)"
        },
        {
          "varKey": "tasa_ocupacion_estival_pct",
          "hub": "I. Turismo",
          "label": "Ocupación Hotelera Estival (Enero-Febrero)",
          "unit": "%",
          "comunaValue": 64.5,
          "regionalMean": 76.41,
          "zScore": -1.46,
          "diffVsMeanPct": -15.6,
          "plainSummary": "Ocupación Hotelera Estival (Enero-Febrero): 64,5 % (promedio regional: 76,4 %)"
        },
        {
          "varKey": "ventas_por_empresa_uf",
          "hub": "V. Inversión",
          "label": "Ventas Anuales Promedio por Empresa (SII)",
          "unit": "UF/empresa",
          "comunaValue": 3814.0,
          "regionalMean": 8674.5,
          "zScore": -1.13,
          "diffVsMeanPct": -56.0,
          "plainSummary": "Ventas Anuales Promedio por Empresa (SII): 3814,0 UF/empresa (promedio regional: 8674,5 UF/empresa)"
        },
        {
          "varKey": "superficie_snaspe_pct",
          "hub": "VII. Biodiversidad",
          "label": "Superficie Comunal bajo Protección SNASPE",
          "unit": "%",
          "comunaValue": 34.5,
          "regionalMean": 56.22,
          "zScore": -1.12,
          "diffVsMeanPct": -38.6,
          "plainSummary": "Superficie Comunal bajo Protección SNASPE: 34,5 % (promedio regional: 56,2 %)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "O'Higgins",
          "provincia": "Capitán Prat",
          "similitudPct": 63
        },
        {
          "comuna": "Guaitecas",
          "provincia": "Aysén",
          "similitudPct": 59
        }
      ],
      "narrativeDigest": "Lago Verde (Coyhaique, 779 hab.) destaca sobre la media regional en Gasto Municipal en Cultura Per Cápita (49294,0 $/hab) y Hogares con Carencia de Servicios Básicos (RSH), mientras presenta sus valores más bajos frente al promedio en Proporción de Ciencia Liderada por Centros Locales. Sus perfiles territoriales más parecidos son O'Higgins (63%) y Guaitecas (59%)."
    },
    "Aysén": {
      "comuna": "Aysén",
      "provincia": "Aysén",
      "poblacionCenso2024": 23170,
      "porcentajeRegionalPct": 23.0,
      "topAboveRegionalMean": [
        {
          "varKey": "ventas_por_empresa_uf",
          "hub": "V. Inversión",
          "label": "Ventas Anuales Promedio por Empresa (SII)",
          "unit": "UF/empresa",
          "comunaValue": 19789.0,
          "regionalMean": 8674.5,
          "zScore": 2.58,
          "diffVsMeanPct": 128.1,
          "plainSummary": "Ventas Anuales Promedio por Empresa (SII): 19789,0 UF/empresa (promedio regional: 8674,5 UF/empresa)"
        },
        {
          "varKey": "concesiones_salmon",
          "hub": "II. Salmonicultura",
          "label": "Concesiones de Salmonicultura Otorgadas",
          "unit": "concesiones",
          "comunaValue": 412.0,
          "regionalMean": 74.5,
          "zScore": 2.58,
          "diffVsMeanPct": 453.0,
          "plainSummary": "Concesiones de Salmonicultura Otorgadas: 412,0 concesiones (promedio regional: 74,5 concesiones)"
        },
        {
          "varKey": "biomasa_salmon_ton",
          "hub": "II. Salmonicultura",
          "label": "Biomasa Anual de Salmón Cosechada",
          "unit": "toneladas",
          "comunaValue": 265000.0,
          "regionalMean": 50350.0,
          "zScore": 2.38,
          "diffVsMeanPct": 426.3,
          "plainSummary": "Biomasa Anual de Salmón Cosechada: 265000,0 toneladas (promedio regional: 50350,0 toneladas)"
        },
        {
          "varKey": "transparencia_activa_cplt_2026_pct",
          "hub": "IV. Gobernanza",
          "label": "Cumplimiento de Transparencia Activa Municipal (CPLT)",
          "unit": "%",
          "comunaValue": 96.09,
          "regionalMean": 73.77,
          "zScore": 1.42,
          "diffVsMeanPct": 30.3,
          "plainSummary": "Cumplimiento de Transparencia Activa Municipal (CPLT): 96,1 % (promedio regional: 73,8 %)"
        },
        {
          "varKey": "compras_locales_pct",
          "hub": "V. Inversión",
          "label": "Retención de Compras Públicas en Proveedores Locales",
          "unit": "%",
          "comunaValue": 54.6,
          "regionalMean": 35.57,
          "zScore": 1.41,
          "diffVsMeanPct": 53.5,
          "plainSummary": "Retención de Compras Públicas en Proveedores Locales: 54,6 % (promedio regional: 35,6 %)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "dependencia_fcm_pct",
          "hub": "IV. Gobernanza",
          "label": "Dependencia del Fondo Común Municipal (FCM)",
          "unit": "%",
          "comunaValue": 52.8,
          "regionalMean": 75.79,
          "zScore": -1.55,
          "diffVsMeanPct": -30.3,
          "plainSummary": "Dependencia del Fondo Común Municipal (FCM): 52,8 % (promedio regional: 75,8 %)"
        },
        {
          "varKey": "participacion_cultural_pct_c2",
          "hub": "IX. Cultura",
          "label": "Participación Activa en Organizaciones Culturales",
          "unit": "%",
          "comunaValue": 40.4,
          "regionalMean": 63.22,
          "zScore": -1.25,
          "diffVsMeanPct": -36.1,
          "plainSummary": "Participación Activa en Organizaciones Culturales: 40,4 % (promedio regional: 63,2 %)"
        },
        {
          "varKey": "gasto_cultura_per_capita_clp",
          "hub": "IX. Cultura",
          "label": "Gasto Municipal en Cultura Per Cápita",
          "unit": "$/hab",
          "comunaValue": 9306.0,
          "regionalMean": 23518.0,
          "zScore": -1.18,
          "diffVsMeanPct": -60.4,
          "plainSummary": "Gasto Municipal en Cultura Per Cápita: 9306,0 $/hab (promedio regional: 23518,0 $/hab)"
        },
        {
          "varKey": "indice_aislamiento_multimodal",
          "hub": "IV. Gobernanza",
          "label": "Índice Compuesto de Aislamiento Multimodal",
          "unit": "puntos",
          "comunaValue": 5.8,
          "regionalMean": 41.59,
          "zScore": -1.14,
          "diffVsMeanPct": -86.1,
          "plainSummary": "Índice Compuesto de Aislamiento Multimodal: 5,8 puntos (promedio regional: 41,6 puntos)"
        },
        {
          "varKey": "saidi_horas_anual",
          "hub": "III. Energía",
          "label": "Tiempo Anual de Interrupción Eléctrica (SAIDI)",
          "unit": "horas/año",
          "comunaValue": 13.8,
          "regionalMean": 35.97,
          "zScore": -1.1,
          "diffVsMeanPct": -61.6,
          "plainSummary": "Tiempo Anual de Interrupción Eléctrica (SAIDI): 13,8 horas/año (promedio regional: 36,0 horas/año)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Cisnes",
          "provincia": "Aysén",
          "similitudPct": 65
        },
        {
          "comuna": "Chile Chico",
          "provincia": "General Carrera",
          "similitudPct": 60
        }
      ],
      "narrativeDigest": "Aysén (Aysén, 23.170 hab.) destaca sobre la media regional en Ventas Anuales Promedio por Empresa (SII) (19789,0 UF/empresa) y Concesiones de Salmonicultura Otorgadas, mientras presenta sus valores más bajos frente al promedio en Dependencia del Fondo Común Municipal (FCM). Sus perfiles territoriales más parecidos son Cisnes (65%) y Chile Chico (60%)."
    },
    "Cisnes": {
      "comuna": "Cisnes",
      "provincia": "Aysén",
      "poblacionCenso2024": 5137,
      "porcentajeRegionalPct": 5.1,
      "topAboveRegionalMean": [
        {
          "varKey": "biomasa_salmon_ton",
          "hub": "II. Salmonicultura",
          "label": "Biomasa Anual de Salmón Cosechada",
          "unit": "toneladas",
          "comunaValue": 185000.0,
          "regionalMean": 50350.0,
          "zScore": 1.49,
          "diffVsMeanPct": 267.4,
          "plainSummary": "Biomasa Anual de Salmón Cosechada: 185000,0 toneladas (promedio regional: 50350,0 toneladas)"
        },
        {
          "varKey": "concesiones_salmon",
          "hub": "II. Salmonicultura",
          "label": "Concesiones de Salmonicultura Otorgadas",
          "unit": "concesiones",
          "comunaValue": 218.0,
          "regionalMean": 74.5,
          "zScore": 1.1,
          "diffVsMeanPct": 192.6,
          "plainSummary": "Concesiones de Salmonicultura Otorgadas: 218,0 concesiones (promedio regional: 74,5 concesiones)"
        },
        {
          "varKey": "amenaza_volcanica_sismica_idx",
          "hub": "VII. Biodiversidad",
          "label": "Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN)",
          "unit": "puntos",
          "comunaValue": 88.6,
          "regionalMean": 69.67,
          "zScore": 1.09,
          "diffVsMeanPct": 27.2,
          "plainSummary": "Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN): 88,6 puntos (promedio regional: 69,7 puntos)"
        },
        {
          "varKey": "superficie_snaspe_pct",
          "hub": "VII. Biodiversidad",
          "label": "Superficie Comunal bajo Protección SNASPE",
          "unit": "%",
          "comunaValue": 71.2,
          "regionalMean": 56.22,
          "zScore": 0.77,
          "diffVsMeanPct": 26.6,
          "plainSummary": "Superficie Comunal bajo Protección SNASPE: 71,2 % (promedio regional: 56,2 %)"
        },
        {
          "varKey": "cobertura_pscv_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura del Programa de Salud Cardiovascular (PSCV)",
          "unit": "%",
          "comunaValue": 71.8,
          "regionalMean": 69.47,
          "zScore": 0.6,
          "diffVsMeanPct": 3.4,
          "plainSummary": "Cobertura del Programa de Salud Cardiovascular (PSCV): 71,8 % (promedio regional: 69,5 %)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "tasa_ocupacion_estival_pct",
          "hub": "I. Turismo",
          "label": "Ocupación Hotelera Estival (Enero-Febrero)",
          "unit": "%",
          "comunaValue": 70.0,
          "regionalMean": 76.41,
          "zScore": -0.78,
          "diffVsMeanPct": -8.4,
          "plainSummary": "Ocupación Hotelera Estival (Enero-Febrero): 70,0 % (promedio regional: 76,4 %)"
        },
        {
          "varKey": "transparencia_activa_cplt_2026_pct",
          "hub": "IV. Gobernanza",
          "label": "Cumplimiento de Transparencia Activa Municipal (CPLT)",
          "unit": "%",
          "comunaValue": 61.6,
          "regionalMean": 73.77,
          "zScore": -0.78,
          "diffVsMeanPct": -16.5,
          "plainSummary": "Cumplimiento de Transparencia Activa Municipal (CPLT): 61,6 % (promedio regional: 73,8 %)"
        },
        {
          "varKey": "indice_aislamiento_multimodal",
          "hub": "IV. Gobernanza",
          "label": "Índice Compuesto de Aislamiento Multimodal",
          "unit": "puntos",
          "comunaValue": 19.2,
          "regionalMean": 41.59,
          "zScore": -0.72,
          "diffVsMeanPct": -53.8,
          "plainSummary": "Índice Compuesto de Aislamiento Multimodal: 19,2 puntos (promedio regional: 41,6 puntos)"
        },
        {
          "varKey": "suelo_privado_pct",
          "hub": "V. Inversión",
          "label": "Proporción de Suelo de Propiedad Privada",
          "unit": "%",
          "comunaValue": 8.4,
          "regionalMean": 19.95,
          "zScore": -0.67,
          "diffVsMeanPct": -57.9,
          "plainSummary": "Proporción de Suelo de Propiedad Privada: 8,4 % (promedio regional: 19,9 %)"
        },
        {
          "varKey": "rsh_carencia_servicios_basicos_jun2026_pct",
          "hub": "VI. Social",
          "label": "Hogares con Carencia de Servicios Básicos (RSH)",
          "unit": "%",
          "comunaValue": 12.2,
          "regionalMean": 18.71,
          "zScore": -0.67,
          "diffVsMeanPct": -34.8,
          "plainSummary": "Hogares con Carencia de Servicios Básicos (RSH): 12,2 % (promedio regional: 18,7 %)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Chile Chico",
          "provincia": "General Carrera",
          "similitudPct": 72
        },
        {
          "comuna": "Cochrane",
          "provincia": "Capitán Prat",
          "similitudPct": 70
        }
      ],
      "narrativeDigest": "Cisnes (Aysén, 5.137 hab.) destaca sobre la media regional en Biomasa Anual de Salmón Cosechada (185000,0 toneladas) y Concesiones de Salmonicultura Otorgadas, mientras presenta sus valores más bajos frente al promedio en Ocupación Hotelera Estival (Enero-Febrero). Sus perfiles territoriales más parecidos son Chile Chico (72%) y Cochrane (70%)."
    },
    "Guaitecas": {
      "comuna": "Guaitecas",
      "provincia": "Aysén",
      "poblacionCenso2024": 1598,
      "porcentajeRegionalPct": 1.59,
      "topAboveRegionalMean": [
        {
          "varKey": "tiempo_viaje_coyhaique_hrs",
          "hub": "IV. Gobernanza",
          "label": "Tiempo de Viaje Multimodal hacia Coyhaique",
          "unit": "horas",
          "comunaValue": 18.0,
          "regionalMean": 6.12,
          "zScore": 2.24,
          "diffVsMeanPct": 194.1,
          "plainSummary": "Tiempo de Viaje Multimodal hacia Coyhaique: 18,0 horas (promedio regional: 6,1 horas)"
        },
        {
          "varKey": "suelo_fiscal_bbnn_pct",
          "hub": "V. Inversión",
          "label": "Proporción de Suelo Fiscal (Bienes Nacionales)",
          "unit": "%",
          "comunaValue": 42.1,
          "regionalMean": 23.83,
          "zScore": 2.21,
          "diffVsMeanPct": 76.7,
          "plainSummary": "Proporción de Suelo Fiscal (Bienes Nacionales): 42,1 % (promedio regional: 23,8 %)"
        },
        {
          "varKey": "traslado_coyhaique_hrs",
          "hub": "VIII. Salud",
          "label": "Tiempo de Derivación Médica al Hospital Regional",
          "unit": "horas",
          "comunaValue": 14.0,
          "regionalMean": 5.25,
          "zScore": 2.11,
          "diffVsMeanPct": 166.7,
          "plainSummary": "Tiempo de Derivación Médica al Hospital Regional: 14,0 horas (promedio regional: 5,2 horas)"
        },
        {
          "varKey": "red_vial_pavimentada_pct",
          "hub": "IV. Gobernanza",
          "label": "Porcentaje de Red Vial Comunal Pavimentada",
          "unit": "%",
          "comunaValue": 43.9,
          "regionalMean": 18.92,
          "zScore": 1.75,
          "diffVsMeanPct": 132.0,
          "plainSummary": "Porcentaje de Red Vial Comunal Pavimentada: 43,9 % (promedio regional: 18,9 %)"
        },
        {
          "varKey": "mediana_espera_quirurgica_dias",
          "hub": "VIII. Salud",
          "label": "Mediana de Espera Quirúrgica No GES",
          "unit": "días",
          "comunaValue": 468.0,
          "regionalMean": 395.0,
          "zScore": 1.72,
          "diffVsMeanPct": 18.5,
          "plainSummary": "Mediana de Espera Quirúrgica No GES: 468,0 días (promedio regional: 395,0 días)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "tasa_ocupacion_estival_pct",
          "hub": "I. Turismo",
          "label": "Ocupación Hotelera Estival (Enero-Febrero)",
          "unit": "%",
          "comunaValue": 62.0,
          "regionalMean": 76.41,
          "zScore": -1.76,
          "diffVsMeanPct": -18.9,
          "plainSummary": "Ocupación Hotelera Estival (Enero-Febrero): 62,0 % (promedio regional: 76,4 %)"
        },
        {
          "varKey": "ruralidad_censo_2024_pct",
          "hub": "VI. Social",
          "label": "Porcentaje de Población Rural (Censo 2024)",
          "unit": "%",
          "comunaValue": 8.1,
          "regionalMean": 52.89,
          "zScore": -1.14,
          "diffVsMeanPct": -84.7,
          "plainSummary": "Porcentaje de Población Rural (Censo 2024): 8,1 % (promedio regional: 52,9 %)"
        },
        {
          "varKey": "tasa_aprobacion_rs_sni_pct",
          "hub": "IV. Gobernanza",
          "label": "Tasa de Aprobación Técnica RS de Proyectos (SNI)",
          "unit": "%",
          "comunaValue": 22.0,
          "regionalMean": 31.5,
          "zScore": -1.09,
          "diffVsMeanPct": -30.2,
          "plainSummary": "Tasa de Aprobación Técnica RS de Proyectos (SNI): 22,0 % (promedio regional: 31,5 %)"
        },
        {
          "varKey": "cobertura_empam_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
          "unit": "%",
          "comunaValue": 70.6,
          "regionalMean": 74.87,
          "zScore": -1.0,
          "diffVsMeanPct": -5.7,
          "plainSummary": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM): 70,6 % (promedio regional: 74,9 %)"
        },
        {
          "varKey": "cobertura_fibra_hogar_pct",
          "hub": "III. Energía",
          "label": "Cobertura de Fibra Óptica al Hogar (FTTH)",
          "unit": "%",
          "comunaValue": 2.4,
          "regionalMean": 24.9,
          "zScore": -0.97,
          "diffVsMeanPct": -90.4,
          "plainSummary": "Cobertura de Fibra Óptica al Hogar (FTTH): 2,4 % (promedio regional: 24,9 %)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Lago Verde",
          "provincia": "Coyhaique",
          "similitudPct": 59
        },
        {
          "comuna": "O'Higgins",
          "provincia": "Capitán Prat",
          "similitudPct": 57
        }
      ],
      "narrativeDigest": "Guaitecas (Aysén, 1.598 hab.) destaca sobre la media regional en Tiempo de Viaje Multimodal hacia Coyhaique (18,0 horas) y Proporción de Suelo Fiscal (Bienes Nacionales), mientras presenta sus valores más bajos frente al promedio en Ocupación Hotelera Estival (Enero-Febrero). Sus perfiles territoriales más parecidos son Lago Verde (59%) y O'Higgins (57%)."
    },
    "Chile Chico": {
      "comuna": "Chile Chico",
      "provincia": "General Carrera",
      "poblacionCenso2024": 4905,
      "porcentajeRegionalPct": 4.87,
      "topAboveRegionalMean": [
        {
          "varKey": "cobertura_pscv_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura del Programa de Salud Cardiovascular (PSCV)",
          "unit": "%",
          "comunaValue": 74.1,
          "regionalMean": 69.47,
          "zScore": 1.19,
          "diffVsMeanPct": 6.7,
          "plainSummary": "Cobertura del Programa de Salud Cardiovascular (PSCV): 74,1 % (promedio regional: 69,5 %)"
        },
        {
          "varKey": "esperanza_vida_total_anos",
          "hub": "VIII. Salud",
          "label": "Esperanza de Vida al Nacer Comunal (DEIS)",
          "unit": "años",
          "comunaValue": 81.3,
          "regionalMean": 80.29,
          "zScore": 1.17,
          "diffVsMeanPct": 1.3,
          "plainSummary": "Esperanza de Vida al Nacer Comunal (DEIS): 81,3 años (promedio regional: 80,3 años)"
        },
        {
          "varKey": "cobertura_empam_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
          "unit": "%",
          "comunaValue": 79.4,
          "regionalMean": 74.87,
          "zScore": 1.06,
          "diffVsMeanPct": 6.1,
          "plainSummary": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM): 79,4 % (promedio regional: 74,9 %)"
        },
        {
          "varKey": "proporcion_ciencia_endogena_pct",
          "hub": "X. CTCi",
          "label": "Proporción de Ciencia Liderada por Centros Locales",
          "unit": "%",
          "comunaValue": 50.0,
          "regionalMean": 38.03,
          "zScore": 0.55,
          "diffVsMeanPct": 31.5,
          "plainSummary": "Proporción de Ciencia Liderada por Centros Locales: 50,0 % (promedio regional: 38,0 %)"
        },
        {
          "varKey": "tasa_aprobacion_rs_sni_pct",
          "hub": "IV. Gobernanza",
          "label": "Tasa de Aprobación Técnica RS de Proyectos (SNI)",
          "unit": "%",
          "comunaValue": 36.0,
          "regionalMean": 31.5,
          "zScore": 0.52,
          "diffVsMeanPct": 14.3,
          "plainSummary": "Tasa de Aprobación Técnica RS de Proyectos (SNI): 36,0 % (promedio regional: 31,5 %)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "costo_diesel_aislado_clp",
          "hub": "III. Energía",
          "label": "Costo Real de Generación Diésel Aislada",
          "unit": "$/kWh",
          "comunaValue": 0.0,
          "regionalMean": 345.5,
          "zScore": -1.2,
          "diffVsMeanPct": -100.0,
          "plainSummary": "Costo Real de Generación Diésel Aislada: 0,0 $/kWh (promedio regional: 345,5 $/kWh)"
        },
        {
          "varKey": "transparencia_activa_cplt_2026_pct",
          "hub": "IV. Gobernanza",
          "label": "Cumplimiento de Transparencia Activa Municipal (CPLT)",
          "unit": "%",
          "comunaValue": 57.46,
          "regionalMean": 73.77,
          "zScore": -1.04,
          "diffVsMeanPct": -22.1,
          "plainSummary": "Cumplimiento de Transparencia Activa Municipal (CPLT): 57,5 % (promedio regional: 73,8 %)"
        },
        {
          "varKey": "consumo_lena_m3_hogar_ano",
          "hub": "III. Energía",
          "label": "Consumo Residencial Anual de Leña por Hogar",
          "unit": "m³/hogar/año",
          "comunaValue": 11.95,
          "regionalMean": 13.62,
          "zScore": -1.02,
          "diffVsMeanPct": -12.3,
          "plainSummary": "Consumo Residencial Anual de Leña por Hogar: 11,9 m³/hogar/año (promedio regional: 13,6 m³/hogar/año)"
        },
        {
          "varKey": "rsh_carencia_servicios_basicos_jun2026_pct",
          "hub": "VI. Social",
          "label": "Hogares con Carencia de Servicios Básicos (RSH)",
          "unit": "%",
          "comunaValue": 9.7,
          "regionalMean": 18.71,
          "zScore": -0.92,
          "diffVsMeanPct": -48.2,
          "plainSummary": "Hogares con Carencia de Servicios Básicos (RSH): 9,7 % (promedio regional: 18,7 %)"
        },
        {
          "varKey": "deficit_habitacional_total_por_1000_hab",
          "hub": "VI. Social",
          "label": "Déficit Habitacional Relativo (MINVU)",
          "unit": "viv/1.000 hab",
          "comunaValue": 27.3,
          "regionalMean": 39.83,
          "zScore": -0.85,
          "diffVsMeanPct": -31.5,
          "plainSummary": "Déficit Habitacional Relativo (MINVU): 27,3 viv/1.000 hab (promedio regional: 39,8 viv/1.000 hab)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Cochrane",
          "provincia": "Capitán Prat",
          "similitudPct": 82
        },
        {
          "comuna": "Cisnes",
          "provincia": "Aysén",
          "similitudPct": 72
        }
      ],
      "narrativeDigest": "Chile Chico (General Carrera, 4.905 hab.) destaca sobre la media regional en Cobertura del Programa de Salud Cardiovascular (PSCV) (74,1 %) y Esperanza de Vida al Nacer Comunal (DEIS), mientras presenta sus valores más bajos frente al promedio en Costo Real de Generación Diésel Aislada. Sus perfiles territoriales más parecidos son Cochrane (82%) y Cisnes (72%)."
    },
    "Río Ibáñez": {
      "comuna": "Río Ibáñez",
      "provincia": "General Carrera",
      "poblacionCenso2024": 2723,
      "porcentajeRegionalPct": 2.7,
      "topAboveRegionalMean": [
        {
          "varKey": "transparencia_activa_cplt_2026_pct",
          "hub": "IV. Gobernanza",
          "label": "Cumplimiento de Transparencia Activa Municipal (CPLT)",
          "unit": "%",
          "comunaValue": 100.0,
          "regionalMean": 73.77,
          "zScore": 1.67,
          "diffVsMeanPct": 35.6,
          "plainSummary": "Cumplimiento de Transparencia Activa Municipal (CPLT): 100,0 % (promedio regional: 73,8 %)"
        },
        {
          "varKey": "amenaza_volcanica_sismica_idx",
          "hub": "VII. Biodiversidad",
          "label": "Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN)",
          "unit": "puntos",
          "comunaValue": 91.5,
          "regionalMean": 69.67,
          "zScore": 1.25,
          "diffVsMeanPct": 31.3,
          "plainSummary": "Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN): 91,5 puntos (promedio regional: 69,7 puntos)"
        },
        {
          "varKey": "ratio_presion_turistica",
          "hub": "I. Turismo",
          "label": "Ratio de Presión Turística Estacional",
          "unit": "visitas/hab",
          "comunaValue": 19.24,
          "regionalMean": 8.83,
          "zScore": 1.21,
          "diffVsMeanPct": 117.8,
          "plainSummary": "Ratio de Presión Turística Estacional: 19,2 visitas/hab (promedio regional: 8,8 visitas/hab)"
        },
        {
          "varKey": "ruralidad_censo_2024_pct",
          "hub": "VI. Social",
          "label": "Porcentaje de Población Rural (Censo 2024)",
          "unit": "%",
          "comunaValue": 100.0,
          "regionalMean": 52.89,
          "zScore": 1.2,
          "diffVsMeanPct": 89.1,
          "plainSummary": "Porcentaje de Población Rural (Censo 2024): 100,0 % (promedio regional: 52,9 %)"
        },
        {
          "varKey": "mediana_espera_quirurgica_dias",
          "hub": "VIII. Salud",
          "label": "Mediana de Espera Quirúrgica No GES",
          "unit": "días",
          "comunaValue": 424.0,
          "regionalMean": 395.0,
          "zScore": 0.68,
          "diffVsMeanPct": 7.3,
          "plainSummary": "Mediana de Espera Quirúrgica No GES: 424,0 días (promedio regional: 395,0 días)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "costo_diesel_aislado_clp",
          "hub": "III. Energía",
          "label": "Costo Real de Generación Diésel Aislada",
          "unit": "$/kWh",
          "comunaValue": 0.0,
          "regionalMean": 345.5,
          "zScore": -1.2,
          "diffVsMeanPct": -100.0,
          "plainSummary": "Costo Real de Generación Diésel Aislada: 0,0 $/kWh (promedio regional: 345,5 $/kWh)"
        },
        {
          "varKey": "traslado_coyhaique_hrs",
          "hub": "VIII. Salud",
          "label": "Tiempo de Derivación Médica al Hospital Regional",
          "unit": "horas",
          "comunaValue": 1.5,
          "regionalMean": 5.25,
          "zScore": -0.9,
          "diffVsMeanPct": -71.4,
          "plainSummary": "Tiempo de Derivación Médica al Hospital Regional: 1,5 horas (promedio regional: 5,2 horas)"
        },
        {
          "varKey": "participacion_cultural_pct_c2",
          "hub": "IX. Cultura",
          "label": "Participación Activa en Organizaciones Culturales",
          "unit": "%",
          "comunaValue": 47.6,
          "regionalMean": 63.22,
          "zScore": -0.86,
          "diffVsMeanPct": -24.7,
          "plainSummary": "Participación Activa en Organizaciones Culturales: 47,6 % (promedio regional: 63,2 %)"
        },
        {
          "varKey": "tiempo_viaje_coyhaique_hrs",
          "hub": "IV. Gobernanza",
          "label": "Tiempo de Viaje Multimodal hacia Coyhaique",
          "unit": "horas",
          "comunaValue": 1.7,
          "regionalMean": 6.12,
          "zScore": -0.84,
          "diffVsMeanPct": -72.2,
          "plainSummary": "Tiempo de Viaje Multimodal hacia Coyhaique: 1,7 horas (promedio regional: 6,1 horas)"
        },
        {
          "varKey": "tarifa_bt1_clp",
          "hub": "III. Energía",
          "label": "Tarifa Eléctrica Residencial BT1",
          "unit": "$/kWh",
          "comunaValue": 289.5,
          "regionalMean": 297.02,
          "zScore": -0.71,
          "diffVsMeanPct": -2.5,
          "plainSummary": "Tarifa Eléctrica Residencial BT1: 289,5 $/kWh (promedio regional: 297,0 $/kWh)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Chile Chico",
          "provincia": "General Carrera",
          "similitudPct": 69
        },
        {
          "comuna": "Cisnes",
          "provincia": "Aysén",
          "similitudPct": 68
        }
      ],
      "narrativeDigest": "Río Ibáñez (General Carrera, 2.723 hab.) destaca sobre la media regional en Cumplimiento de Transparencia Activa Municipal (CPLT) (100,0 %) y Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN), mientras presenta sus valores más bajos frente al promedio en Costo Real de Generación Diésel Aislada. Sus perfiles territoriales más parecidos son Chile Chico (69%) y Cisnes (68%)."
    },
    "Cochrane": {
      "comuna": "Cochrane",
      "provincia": "Capitán Prat",
      "poblacionCenso2024": 3458,
      "porcentajeRegionalPct": 3.43,
      "topAboveRegionalMean": [
        {
          "varKey": "cobertura_pscv_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura del Programa de Salud Cardiovascular (PSCV)",
          "unit": "%",
          "comunaValue": 73.4,
          "regionalMean": 69.47,
          "zScore": 1.01,
          "diffVsMeanPct": 5.7,
          "plainSummary": "Cobertura del Programa de Salud Cardiovascular (PSCV): 73,4 % (promedio regional: 69,5 %)"
        },
        {
          "varKey": "suelo_fiscal_bbnn_pct",
          "hub": "V. Inversión",
          "label": "Proporción de Suelo Fiscal (Bienes Nacionales)",
          "unit": "%",
          "comunaValue": 31.4,
          "regionalMean": 23.83,
          "zScore": 0.91,
          "diffVsMeanPct": 31.8,
          "plainSummary": "Proporción de Suelo Fiscal (Bienes Nacionales): 31,4 % (promedio regional: 23,8 %)"
        },
        {
          "varKey": "cobertura_empam_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
          "unit": "%",
          "comunaValue": 77.8,
          "regionalMean": 74.87,
          "zScore": 0.68,
          "diffVsMeanPct": 3.9,
          "plainSummary": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM): 77,8 % (promedio regional: 74,9 %)"
        },
        {
          "varKey": "compras_locales_pct",
          "hub": "V. Inversión",
          "label": "Retención de Compras Públicas en Proveedores Locales",
          "unit": "%",
          "comunaValue": 44.5,
          "regionalMean": 35.57,
          "zScore": 0.66,
          "diffVsMeanPct": 25.1,
          "plainSummary": "Retención de Compras Públicas en Proveedores Locales: 44,5 % (promedio regional: 35,6 %)"
        },
        {
          "varKey": "cobertura_fibra_hogar_pct",
          "hub": "III. Energía",
          "label": "Cobertura de Fibra Óptica al Hogar (FTTH)",
          "unit": "%",
          "comunaValue": 39.2,
          "regionalMean": 24.9,
          "zScore": 0.62,
          "diffVsMeanPct": 57.4,
          "plainSummary": "Cobertura de Fibra Óptica al Hogar (FTTH): 39,2 % (promedio regional: 24,9 %)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "amenaza_volcanica_sismica_idx",
          "hub": "VII. Biodiversidad",
          "label": "Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN)",
          "unit": "puntos",
          "comunaValue": 48.0,
          "regionalMean": 69.67,
          "zScore": -1.24,
          "diffVsMeanPct": -31.1,
          "plainSummary": "Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN): 48,0 puntos (promedio regional: 69,7 puntos)"
        },
        {
          "varKey": "costo_diesel_aislado_clp",
          "hub": "III. Energía",
          "label": "Costo Real de Generación Diésel Aislada",
          "unit": "$/kWh",
          "comunaValue": 0.0,
          "regionalMean": 345.5,
          "zScore": -1.2,
          "diffVsMeanPct": -100.0,
          "plainSummary": "Costo Real de Generación Diésel Aislada: 0,0 $/kWh (promedio regional: 345,5 $/kWh)"
        },
        {
          "varKey": "pobreza_multidim_pct",
          "hub": "VI. Social",
          "label": "Pobreza Multidimensional (CASEN)",
          "unit": "%",
          "comunaValue": 15.0,
          "regionalMean": 19.75,
          "zScore": -0.95,
          "diffVsMeanPct": -24.1,
          "plainSummary": "Pobreza Multidimensional (CASEN): 15,0 % (promedio regional: 19,8 %)"
        },
        {
          "varKey": "transparencia_activa_cplt_2026_pct",
          "hub": "IV. Gobernanza",
          "label": "Cumplimiento de Transparencia Activa Municipal (CPLT)",
          "unit": "%",
          "comunaValue": 60.58,
          "regionalMean": 73.77,
          "zScore": -0.84,
          "diffVsMeanPct": -17.9,
          "plainSummary": "Cumplimiento de Transparencia Activa Municipal (CPLT): 60,6 % (promedio regional: 73,8 %)"
        },
        {
          "varKey": "ruralidad_censo_2024_pct",
          "hub": "VI. Social",
          "label": "Porcentaje de Población Rural (Censo 2024)",
          "unit": "%",
          "comunaValue": 21.8,
          "regionalMean": 52.89,
          "zScore": -0.79,
          "diffVsMeanPct": -58.8,
          "plainSummary": "Porcentaje de Población Rural (Censo 2024): 21,8 % (promedio regional: 52,9 %)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Chile Chico",
          "provincia": "General Carrera",
          "similitudPct": 82
        },
        {
          "comuna": "Cisnes",
          "provincia": "Aysén",
          "similitudPct": 70
        }
      ],
      "narrativeDigest": "Cochrane (Capitán Prat, 3.458 hab.) destaca sobre la media regional en Cobertura del Programa de Salud Cardiovascular (PSCV) (73,4 %) y Proporción de Suelo Fiscal (Bienes Nacionales), mientras presenta sus valores más bajos frente al promedio en Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN). Sus perfiles territoriales más parecidos son Chile Chico (82%) y Cisnes (70%)."
    },
    "O'Higgins": {
      "comuna": "O'Higgins",
      "provincia": "Capitán Prat",
      "poblacionCenso2024": 647,
      "porcentajeRegionalPct": 0.64,
      "topAboveRegionalMean": [
        {
          "varKey": "superficie_glaciar_km2",
          "hub": "VII. Biodiversidad",
          "label": "Superficie Glaciar Comunal (DGA)",
          "unit": "km²",
          "comunaValue": 3450.0,
          "regionalMean": 1003.57,
          "zScore": 2.09,
          "diffVsMeanPct": 243.8,
          "plainSummary": "Superficie Glaciar Comunal (DGA): 3450,0 km² (promedio regional: 1003,6 km²)"
        },
        {
          "varKey": "indice_aislamiento_multimodal",
          "hub": "IV. Gobernanza",
          "label": "Índice Compuesto de Aislamiento Multimodal",
          "unit": "puntos",
          "comunaValue": 86.4,
          "regionalMean": 41.59,
          "zScore": 1.43,
          "diffVsMeanPct": 107.7,
          "plainSummary": "Índice Compuesto de Aislamiento Multimodal: 86,4 puntos (promedio regional: 41,6 puntos)"
        },
        {
          "varKey": "presupuesto_per_capita_mclp",
          "hub": "IV. Gobernanza",
          "label": "Presupuesto Municipal Per Cápita",
          "unit": "M$/hab",
          "comunaValue": 3323.0,
          "regionalMean": 1873.43,
          "zScore": 1.24,
          "diffVsMeanPct": 77.4,
          "plainSummary": "Presupuesto Municipal Per Cápita: 3323,0 M$/hab (promedio regional: 1873,4 M$/hab)"
        },
        {
          "varKey": "ruralidad_censo_2024_pct",
          "hub": "VI. Social",
          "label": "Porcentaje de Población Rural (Censo 2024)",
          "unit": "%",
          "comunaValue": 100.0,
          "regionalMean": 52.89,
          "zScore": 1.2,
          "diffVsMeanPct": 89.1,
          "plainSummary": "Porcentaje de Población Rural (Censo 2024): 100,0 % (promedio regional: 52,9 %)"
        },
        {
          "varKey": "fndr_per_capita_mclp",
          "hub": "IV. Gobernanza",
          "label": "Inversión Pública FNDR Per Cápita",
          "unit": "Miles $/hab",
          "comunaValue": 3709.4,
          "regionalMean": 1947.24,
          "zScore": 1.2,
          "diffVsMeanPct": 90.5,
          "plainSummary": "Inversión Pública FNDR Per Cápita: 3709,4 Miles $/hab (promedio regional: 1947,2 Miles $/hab)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "proporcion_ciencia_endogena_pct",
          "hub": "X. CTCi",
          "label": "Proporción de Ciencia Liderada por Centros Locales",
          "unit": "%",
          "comunaValue": 0.0,
          "regionalMean": 38.03,
          "zScore": -1.74,
          "diffVsMeanPct": -100.0,
          "plainSummary": "Proporción de Ciencia Liderada por Centros Locales: 0,0 % (promedio regional: 38,0 %)"
        },
        {
          "varKey": "cobertura_pscv_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura del Programa de Salud Cardiovascular (PSCV)",
          "unit": "%",
          "comunaValue": 63.4,
          "regionalMean": 69.47,
          "zScore": -1.56,
          "diffVsMeanPct": -8.7,
          "plainSummary": "Cobertura del Programa de Salud Cardiovascular (PSCV): 63,4 % (promedio regional: 69,5 %)"
        },
        {
          "varKey": "cobertura_empam_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
          "unit": "%",
          "comunaValue": 69.1,
          "regionalMean": 74.87,
          "zScore": -1.35,
          "diffVsMeanPct": -7.7,
          "plainSummary": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM): 69,1 % (promedio regional: 74,9 %)"
        },
        {
          "varKey": "tasa_aprobacion_rs_sni_pct",
          "hub": "IV. Gobernanza",
          "label": "Tasa de Aprobación Técnica RS de Proyectos (SNI)",
          "unit": "%",
          "comunaValue": 20.0,
          "regionalMean": 31.5,
          "zScore": -1.32,
          "diffVsMeanPct": -36.5,
          "plainSummary": "Tasa de Aprobación Técnica RS de Proyectos (SNI): 20,0 % (promedio regional: 31,5 %)"
        },
        {
          "varKey": "compras_locales_pct",
          "hub": "V. Inversión",
          "label": "Retención de Compras Públicas en Proveedores Locales",
          "unit": "%",
          "comunaValue": 18.4,
          "regionalMean": 35.57,
          "zScore": -1.27,
          "diffVsMeanPct": -48.3,
          "plainSummary": "Retención de Compras Públicas en Proveedores Locales: 18,4 % (promedio regional: 35,6 %)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Tortel",
          "provincia": "Capitán Prat",
          "similitudPct": 66
        },
        {
          "comuna": "Lago Verde",
          "provincia": "Coyhaique",
          "similitudPct": 63
        }
      ],
      "narrativeDigest": "O'Higgins (Capitán Prat, 647 hab.) destaca sobre la media regional en Superficie Glaciar Comunal (DGA) (3450,0 km²) y Índice Compuesto de Aislamiento Multimodal, mientras presenta sus valores más bajos frente al promedio en Proporción de Ciencia Liderada por Centros Locales. Sus perfiles territoriales más parecidos son Tortel (66%) y Lago Verde (63%)."
    },
    "Tortel": {
      "comuna": "Tortel",
      "provincia": "Capitán Prat",
      "poblacionCenso2024": 505,
      "porcentajeRegionalPct": 0.5,
      "topAboveRegionalMean": [
        {
          "varKey": "deficit_habitacional_total_por_1000_hab",
          "hub": "VI. Social",
          "label": "Déficit Habitacional Relativo (MINVU)",
          "unit": "viv/1.000 hab",
          "comunaValue": 77.2,
          "regionalMean": 39.83,
          "zScore": 2.53,
          "diffVsMeanPct": 93.8,
          "plainSummary": "Déficit Habitacional Relativo (MINVU): 77,2 viv/1.000 hab (promedio regional: 39,8 viv/1.000 hab)"
        },
        {
          "varKey": "ratio_presion_turistica",
          "hub": "I. Turismo",
          "label": "Ratio de Presión Turística Estacional",
          "unit": "visitas/hab",
          "comunaValue": 28.12,
          "regionalMean": 8.83,
          "zScore": 2.25,
          "diffVsMeanPct": 218.4,
          "plainSummary": "Ratio de Presión Turística Estacional: 28,1 visitas/hab (promedio regional: 8,8 visitas/hab)"
        },
        {
          "varKey": "fndr_per_capita_mclp",
          "hub": "IV. Gobernanza",
          "label": "Inversión Pública FNDR Per Cápita",
          "unit": "Miles $/hab",
          "comunaValue": 5148.5,
          "regionalMean": 1947.24,
          "zScore": 2.18,
          "diffVsMeanPct": 164.4,
          "plainSummary": "Inversión Pública FNDR Per Cápita: 5148,5 Miles $/hab (promedio regional: 1947,2 Miles $/hab)"
        },
        {
          "varKey": "participacion_cultural_pct_c2",
          "hub": "IX. Cultura",
          "label": "Participación Activa en Organizaciones Culturales",
          "unit": "%",
          "comunaValue": 100.0,
          "regionalMean": 63.22,
          "zScore": 2.02,
          "diffVsMeanPct": 58.2,
          "plainSummary": "Participación Activa en Organizaciones Culturales: 100,0 % (promedio regional: 63,2 %)"
        },
        {
          "varKey": "rsh_carencia_servicios_basicos_jun2026_pct",
          "hub": "VI. Social",
          "label": "Hogares con Carencia de Servicios Básicos (RSH)",
          "unit": "%",
          "comunaValue": 38.1,
          "regionalMean": 18.71,
          "zScore": 1.98,
          "diffVsMeanPct": 103.6,
          "plainSummary": "Hogares con Carencia de Servicios Básicos (RSH): 38,1 % (promedio regional: 18,7 %)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "tasa_aprobacion_rs_sni_pct",
          "hub": "IV. Gobernanza",
          "label": "Tasa de Aprobación Técnica RS de Proyectos (SNI)",
          "unit": "%",
          "comunaValue": 18.0,
          "regionalMean": 31.5,
          "zScore": -1.55,
          "diffVsMeanPct": -42.9,
          "plainSummary": "Tasa de Aprobación Técnica RS de Proyectos (SNI): 18,0 % (promedio regional: 31,5 %)"
        },
        {
          "varKey": "suelo_fiscal_bbnn_pct",
          "hub": "V. Inversión",
          "label": "Proporción de Suelo Fiscal (Bienes Nacionales)",
          "unit": "%",
          "comunaValue": 11.2,
          "regionalMean": 23.83,
          "zScore": -1.53,
          "diffVsMeanPct": -53.0,
          "plainSummary": "Proporción de Suelo Fiscal (Bienes Nacionales): 11,2 % (promedio regional: 23,8 %)"
        },
        {
          "varKey": "cobertura_empam_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
          "unit": "%",
          "comunaValue": 68.4,
          "regionalMean": 74.87,
          "zScore": -1.51,
          "diffVsMeanPct": -8.6,
          "plainSummary": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM): 68,4 % (promedio regional: 74,9 %)"
        },
        {
          "varKey": "esperanza_vida_total_anos",
          "hub": "VIII. Salud",
          "label": "Esperanza de Vida al Nacer Comunal (DEIS)",
          "unit": "años",
          "comunaValue": 79.0,
          "regionalMean": 80.29,
          "zScore": -1.5,
          "diffVsMeanPct": -1.6,
          "plainSummary": "Esperanza de Vida al Nacer Comunal (DEIS): 79,0 años (promedio regional: 80,3 años)"
        },
        {
          "varKey": "cobertura_pscv_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura del Programa de Salud Cardiovascular (PSCV)",
          "unit": "%",
          "comunaValue": 63.9,
          "regionalMean": 69.47,
          "zScore": -1.43,
          "diffVsMeanPct": -8.0,
          "plainSummary": "Cobertura del Programa de Salud Cardiovascular (PSCV): 63,9 % (promedio regional: 69,5 %)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "O'Higgins",
          "provincia": "Capitán Prat",
          "similitudPct": 66
        },
        {
          "comuna": "Lago Verde",
          "provincia": "Coyhaique",
          "similitudPct": 56
        }
      ],
      "narrativeDigest": "Tortel (Capitán Prat, 505 hab.) destaca sobre la media regional en Déficit Habitacional Relativo (MINVU) (77,2 viv/1.000 hab) y Ratio de Presión Turística Estacional, mientras presenta sus valores más bajos frente al promedio en Tasa de Aprobación Técnica RS de Proyectos (SNI). Sus perfiles territoriales más parecidos son O'Higgins (66%) y Lago Verde (56%)."
    }
  }
};
  if (root) {
    root.AYSEN_DISCOVERIES_DATA = data;
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = data;
  }
})(typeof window !== 'undefined' ? window : globalThis);
