/**
 * data/aysen_hallazgos_precalculados.js
 * Relaciones estadísticas curadas entre ejes temáticos y perfiles comunales comparados de Aysén.
 * Generado por: python scripts/precompute_curated_discoveries.py
 */
(function (root) {
  'use strict';
  const data = {
  "generatedAt": "2026-11-23T18:11:31Z",
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
      "title": "Tarifa Eléctrica Residencial BT1 vs. Aislamiento Multimodal",
      "headline": "Tarifa Eléctrica Residencial BT1 vs. Aislamiento Multimodal",
      "hubX": "III. Energía",
      "hubY": "IV. Gobernanza",
      "varX": "tarifa_bt1_clp",
      "varY": "indice_aislamiento_multimodal",
      "labelX": "Tarifa Eléctrica Residencial BT1",
      "labelY": "Índice Compuesto de Aislamiento Multimodal",
      "unitX": "$/kWh",
      "unitY": "puntos",
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
        224.0,
        258.0,
        222.0,
        235.0,
        265.0,
        228.0,
        231.0,
        230.0,
        262.0,
        268.0
      ],
      "dataY": [
        0.0,
        67.5,
        8.9,
        33.0,
        87.1,
        27.9,
        31.0,
        28.7,
        86.6,
        79.2
      ],
      "regressionLine": {
        "slopeBeta1": 1.69824,
        "interceptBeta0": -366.494,
        "rSquaredPct": 94.9,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Los sistemas aislados sin interconexión encarecen la cuenta de luz: Tortel alcanza 268 $/kWh con 79,2 puntos de aislamiento, frente a Aysén (222 $/kWh y 8,9 puntos).",
      "plainExplanation": "Los sistemas aislados sin interconexión encarecen la cuenta de luz: Tortel alcanza 268 $/kWh con 79,2 puntos de aislamiento, frente a Aysén (222 $/kWh y 8,9 puntos).",
      "notable_commune": "Caso atípico: Coyhaique registra –13,9 puntos por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 0.0,
          "expectedY": 13.91,
          "diffY": -13.91,
          "zResid": -2.0,
          "note": "Coyhaique registra 0,0 puntos, 13,9 puntos por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Lago Verde": {
          "actualY": 67.5,
          "expectedY": 71.65,
          "diffY": -4.15,
          "zResid": -0.6,
          "note": "Lago Verde registra 67,5 puntos, 4,2 puntos por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Aysén": {
          "actualY": 8.9,
          "expectedY": 10.52,
          "diffY": -1.62,
          "zResid": -0.23,
          "note": "Aysén (8,9 puntos) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cisnes": {
          "actualY": 33.0,
          "expectedY": 32.59,
          "diffY": 0.41,
          "zResid": 0.06,
          "note": "Cisnes (33,0 puntos) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 87.1,
          "expectedY": 83.54,
          "diffY": 3.56,
          "zResid": 0.51,
          "note": "Guaitecas registra 87,1 puntos, 3,6 puntos por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Chile Chico": {
          "actualY": 27.9,
          "expectedY": 20.71,
          "diffY": 7.19,
          "zResid": 1.04,
          "note": "Chile Chico registra 27,9 puntos, 7,2 puntos por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Río Ibáñez": {
          "actualY": 31.0,
          "expectedY": 25.8,
          "diffY": 5.2,
          "zResid": 0.75,
          "note": "Río Ibáñez registra 31,0 puntos, 5,2 puntos por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Cochrane": {
          "actualY": 28.7,
          "expectedY": 24.1,
          "diffY": 4.6,
          "zResid": 0.66,
          "note": "Cochrane registra 28,7 puntos, 4,6 puntos por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "O'Higgins": {
          "actualY": 86.6,
          "expectedY": 78.45,
          "diffY": 8.15,
          "zResid": 1.17,
          "note": "O'Higgins registra 86,6 puntos, 8,2 puntos por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Tortel": {
          "actualY": 79.2,
          "expectedY": 88.63,
          "diffY": -9.43,
          "zResid": -1.36,
          "note": "Tortel registra 79,2 puntos, 9,4 puntos por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        }
      },
      "metrics_line": "R² 95% · r = +0,97 · Sin Coyhaique: +0,98 · Control pob.: +0,91",
      "statProofBadges": {
        "fuerzaExplicativaPct": 95,
        "pearsonR": 0.974,
        "spearmanRho": 0.952,
        "kendallTau": 0.867,
        "partialCorrPop": 0.909,
        "rWithoutCoyhaique": 0.983,
        "firstDiffCorrDelta": 0.909,
        "pValueFdr": 6e-06,
        "veredictoSimple": "R² 95% · r = +0,97 · Sin Coyhaique: +0,98 · Control pob.: +0,91"
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
        224.0,
        258.0,
        222.0,
        235.0,
        265.0,
        228.0,
        231.0,
        230.0,
        262.0,
        268.0
      ],
      "dataY": [
        80.2,
        72.1,
        78.6,
        76.5,
        71.0,
        79.1,
        75.8,
        77.4,
        69.5,
        68.8
      ],
      "regressionLine": {
        "slopeBeta1": -0.2199,
        "interceptBeta0": 128.1824,
        "rSquaredPct": 94.4,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "Donde la electricidad residencial es más cara, baja la cobertura de controles del adulto mayor: Tortel (268 $/kWh) registra 68,8%, mientras Aysén (222 $/kWh) sube a 78,6%.",
      "plainExplanation": "Donde la electricidad residencial es más cara, baja la cobertura de controles del adulto mayor: Tortel (268 $/kWh) registra 68,8%, mientras Aysén (222 $/kWh) sube a 78,6%.",
      "notable_commune": "Caso atípico: Río Ibáñez registra –1,6 % por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 80.2,
          "expectedY": 78.92,
          "diffY": 1.28,
          "zResid": 1.36,
          "note": "Coyhaique registra 80,2 %, 1,3 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Lago Verde": {
          "actualY": 72.1,
          "expectedY": 71.45,
          "diffY": 0.65,
          "zResid": 0.69,
          "note": "Lago Verde registra 72,1 %, 0,7 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Aysén": {
          "actualY": 78.6,
          "expectedY": 79.36,
          "diffY": -0.76,
          "zResid": -0.81,
          "note": "Aysén registra 78,6 %, 0,8 % por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Cisnes": {
          "actualY": 76.5,
          "expectedY": 76.51,
          "diffY": -0.01,
          "zResid": -0.01,
          "note": "Cisnes (76,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 71.0,
          "expectedY": 69.91,
          "diffY": 1.09,
          "zResid": 1.16,
          "note": "Guaitecas registra 71,0 %, 1,1 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Chile Chico": {
          "actualY": 79.1,
          "expectedY": 78.04,
          "diffY": 1.06,
          "zResid": 1.12,
          "note": "Chile Chico registra 79,1 %, 1,1 % por encima de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Río Ibáñez": {
          "actualY": 75.8,
          "expectedY": 77.38,
          "diffY": -1.58,
          "zResid": -1.69,
          "note": "Río Ibáñez registra 75,8 %, 1,6 % por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Cochrane": {
          "actualY": 77.4,
          "expectedY": 77.6,
          "diffY": -0.2,
          "zResid": -0.22,
          "note": "Cochrane (77,4 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 69.5,
          "expectedY": 70.57,
          "diffY": -1.07,
          "zResid": -1.14,
          "note": "O'Higgins registra 69,5 %, 1,1 % por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        },
        "Tortel": {
          "actualY": 68.8,
          "expectedY": 69.25,
          "diffY": -0.45,
          "zResid": -0.48,
          "note": "Tortel registra 68,8 %, 0,4 % por debajo de lo esperado según su nivel de tarifa eléctrica BT1."
        }
      },
      "metrics_line": "R² 94% · r = –0,97 · Sin Coyhaique: –0,97 · Control pob.: –0,89",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": -0.972,
        "spearmanRho": -0.939,
        "kendallTau": -0.822,
        "partialCorrPop": -0.893,
        "rWithoutCoyhaique": -0.973,
        "firstDiffCorrDelta": -0.893,
        "pValueFdr": 6e-06,
        "veredictoSimple": "R² 94% · r = –0,97 · Sin Coyhaique: –0,97 · Control pob.: –0,89"
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
        75.5,
        17.6,
        61.8,
        43.6,
        31.8,
        47.9,
        35.2,
        51.4,
        23.2,
        27.5
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
        "slopeBeta1": 0.76593,
        "interceptBeta0": 3.7456,
        "rSquaredPct": 95.0,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Con mayor fibra óptica al hogar, las pymes locales captan más compras públicas: Coyhaique (75,5% de fibra) retiene 58,4% del gasto en la comuna, versus 22,1% en Lago Verde (17,6%).",
      "plainExplanation": "Con mayor fibra óptica al hogar, las pymes locales captan más compras públicas: Coyhaique (75,5% de fibra) retiene 58,4% del gasto en la comuna, versus 22,1% en Lago Verde (17,6%).",
      "notable_commune": "Caso atípico: Lago Verde registra +4,9 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 58.4,
          "expectedY": 61.57,
          "diffY": -3.17,
          "zResid": -1.05,
          "note": "Coyhaique registra 58,4 %, 3,2 % por debajo de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Lago Verde": {
          "actualY": 22.1,
          "expectedY": 17.23,
          "diffY": 4.87,
          "zResid": 1.61,
          "note": "Lago Verde registra 22,1 %, 4,9 % por encima de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Aysén": {
          "actualY": 54.6,
          "expectedY": 51.08,
          "diffY": 3.52,
          "zResid": 1.16,
          "note": "Aysén registra 54,6 %, 3,5 % por encima de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Cisnes": {
          "actualY": 38.2,
          "expectedY": 37.14,
          "diffY": 1.06,
          "zResid": 0.35,
          "note": "Cisnes (38,2 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 24.5,
          "expectedY": 28.1,
          "diffY": -3.6,
          "zResid": -1.19,
          "note": "Guaitecas registra 24,5 %, 3,6 % por debajo de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Chile Chico": {
          "actualY": 41.2,
          "expectedY": 40.43,
          "diffY": 0.77,
          "zResid": 0.25,
          "note": "Chile Chico (41,2 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Río Ibáñez": {
          "actualY": 32.8,
          "expectedY": 30.71,
          "diffY": 2.09,
          "zResid": 0.69,
          "note": "Río Ibáñez registra 32,8 %, 2,1 % por encima de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Cochrane": {
          "actualY": 44.5,
          "expectedY": 43.11,
          "diffY": 1.39,
          "zResid": 0.46,
          "note": "Cochrane registra 44,5 %, 1,4 % por encima de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "O'Higgins": {
          "actualY": 18.4,
          "expectedY": 21.52,
          "diffY": -3.12,
          "zResid": -1.03,
          "note": "O'Higgins registra 18,4 %, 3,1 % por debajo de lo esperado según su nivel de cobertura de fibra óptica."
        },
        "Tortel": {
          "actualY": 21.0,
          "expectedY": 24.81,
          "diffY": -3.81,
          "zResid": -1.26,
          "note": "Tortel registra 21,0 %, 3,8 % por debajo de lo esperado según su nivel de cobertura de fibra óptica."
        }
      },
      "metrics_line": "R² 95% · r = +0,97 · Sin Coyhaique: +0,97 · Control pob.: +0,66",
      "statProofBadges": {
        "fuerzaExplicativaPct": 95,
        "pearsonR": 0.975,
        "spearmanRho": 0.964,
        "kendallTau": 0.911,
        "partialCorrPop": 0.656,
        "rWithoutCoyhaique": 0.971,
        "firstDiffCorrDelta": 0.656,
        "pValueFdr": 6e-06,
        "veredictoSimple": "R² 95% · r = +0,97 · Sin Coyhaique: +0,97 · Control pob.: +0,66"
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
      "metrics_line": "R² 94% · r = –0,97 · Sin Coyhaique: –0,97 · Control pob.: –0,90",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": -0.97,
        "spearmanRho": -0.952,
        "kendallTau": -0.867,
        "partialCorrPop": -0.904,
        "rWithoutCoyhaique": -0.968,
        "firstDiffCorrDelta": -0.904,
        "pValueFdr": 7e-06,
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
        80.2,
        72.1,
        78.6,
        76.5,
        71.0,
        79.1,
        75.8,
        77.4,
        69.5,
        68.8
      ],
      "regressionLine": {
        "slopeBeta1": -0.19328,
        "interceptBeta0": 81.8524,
        "rSquaredPct": 95.9,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "A más horas anuales sin suministro eléctrico, menor control preventivo de mayores: en Tortel (64,3 h/año) la cobertura llega a 68,8%, contra 80,2% en Coyhaique (11,4 h/año).",
      "plainExplanation": "A más horas anuales sin suministro eléctrico, menor control preventivo de mayores: en Tortel (64,3 h/año) la cobertura llega a 68,8%, contra 80,2% en Coyhaique (11,4 h/año).",
      "notable_commune": "Caso atípico: Río Ibáñez registra –1,3 % por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 80.2,
          "expectedY": 79.65,
          "diffY": 0.55,
          "zResid": 0.68,
          "note": "Coyhaique registra 80,2 %, 0,6 % por encima de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Lago Verde": {
          "actualY": 72.1,
          "expectedY": 71.38,
          "diffY": 0.72,
          "zResid": 0.89,
          "note": "Lago Verde registra 72,1 %, 0,7 % por encima de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Aysén": {
          "actualY": 78.6,
          "expectedY": 79.19,
          "diffY": -0.59,
          "zResid": -0.72,
          "note": "Aysén registra 78,6 %, 0,6 % por debajo de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Cisnes": {
          "actualY": 76.5,
          "expectedY": 76.34,
          "diffY": 0.16,
          "zResid": 0.19,
          "note": "Cisnes (76,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 71.0,
          "expectedY": 69.85,
          "diffY": 1.15,
          "zResid": 1.42,
          "note": "Guaitecas registra 71,0 %, 1,2 % por encima de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Chile Chico": {
          "actualY": 79.1,
          "expectedY": 78.12,
          "diffY": 0.98,
          "zResid": 1.21,
          "note": "Chile Chico registra 79,1 %, 1,0 % por encima de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Río Ibáñez": {
          "actualY": 75.8,
          "expectedY": 77.1,
          "diffY": -1.3,
          "zResid": -1.6,
          "note": "Río Ibáñez registra 75,8 %, 1,3 % por debajo de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Cochrane": {
          "actualY": 77.4,
          "expectedY": 77.45,
          "diffY": -0.05,
          "zResid": -0.06,
          "note": "Cochrane (77,4 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 69.5,
          "expectedY": 70.51,
          "diffY": -1.01,
          "zResid": -1.24,
          "note": "O'Higgins registra 69,5 %, 1,0 % por debajo de lo esperado según su nivel de interrupciones eléctricas."
        },
        "Tortel": {
          "actualY": 68.8,
          "expectedY": 69.42,
          "diffY": -0.62,
          "zResid": -0.77,
          "note": "Tortel registra 68,8 %, 0,6 % por debajo de lo esperado según su nivel de interrupciones eléctricas."
        }
      },
      "metrics_line": "R² 96% · r = –0,98 · Sin Coyhaique: –0,97 · Control pob.: –0,91",
      "statProofBadges": {
        "fuerzaExplicativaPct": 96,
        "pearsonR": -0.979,
        "spearmanRho": -0.964,
        "kendallTau": -0.867,
        "partialCorrPop": -0.906,
        "rWithoutCoyhaique": -0.975,
        "firstDiffCorrDelta": -0.906,
        "pValueFdr": 3e-06,
        "veredictoSimple": "R² 96% · r = –0,98 · Sin Coyhaique: –0,97 · Control pob.: –0,91"
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
      "metrics_line": "R² 93% · r = –0,96 · Sin Coyhaique: –0,96 · Control pob.: –0,84",
      "statProofBadges": {
        "fuerzaExplicativaPct": 93,
        "pearsonR": -0.965,
        "spearmanRho": -0.967,
        "kendallTau": -0.899,
        "partialCorrPop": -0.844,
        "rWithoutCoyhaique": -0.964,
        "firstDiffCorrDelta": -0.844,
        "pValueFdr": 1.1e-05,
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
      "metrics_line": "R² 91% · r = +0,95 · Sin Coyhaique: +0,95 · Control pob.: +0,80",
      "statProofBadges": {
        "fuerzaExplicativaPct": 91,
        "pearsonR": 0.952,
        "spearmanRho": 0.927,
        "kendallTau": 0.778,
        "partialCorrPop": 0.802,
        "rWithoutCoyhaique": 0.95,
        "firstDiffCorrDelta": 0.802,
        "pValueFdr": 2.9e-05,
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
      "metrics_line": "R² 66% · r = +0,81 · Sin Coyhaique: +0,81 · Control pob.: +0,69",
      "statProofBadges": {
        "fuerzaExplicativaPct": 66,
        "pearsonR": 0.81,
        "spearmanRho": 0.855,
        "kendallTau": 0.733,
        "partialCorrPop": 0.691,
        "rWithoutCoyhaique": 0.808,
        "firstDiffCorrDelta": 0.691,
        "pValueFdr": 0.004506,
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
        1362.0,
        1520.0,
        1375.0,
        1440.0,
        1560.0,
        1430.0,
        1420.0,
        1410.0,
        1620.0,
        1580.0
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
        "slopeBeta1": -0.09825,
        "interceptBeta0": 176.0905,
        "rSquaredPct": 94.5,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "El sobrecosto logístico encarece las obras sobre los valores referenciales: en O'Higgins (gasolina a 1.620 $/L) solo 20,0% obtiene RS, versus 45,0% en Coyhaique (1.362 $/L).",
      "plainExplanation": "El sobrecosto logístico encarece las obras sobre los valores referenciales: en O'Higgins (gasolina a 1.620 $/L) solo 20,0% obtiene RS, versus 45,0% en Coyhaique (1.362 $/L).",
      "notable_commune": "Caso atípico: O'Higgins registra +3,1 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 45.0,
          "expectedY": 42.28,
          "diffY": 2.72,
          "zResid": 1.33,
          "note": "Coyhaique registra 45,0 %, 2,7 % por encima de lo esperado según su nivel de precio de la gasolina."
        },
        "Lago Verde": {
          "actualY": 28.0,
          "expectedY": 26.75,
          "diffY": 1.25,
          "zResid": 0.61,
          "note": "Lago Verde registra 28,0 %, 1,2 % por encima de lo esperado según su nivel de precio de la gasolina."
        },
        "Aysén": {
          "actualY": 42.0,
          "expectedY": 41.0,
          "diffY": 1.0,
          "zResid": 0.49,
          "note": "Aysén registra 42,0 %, 1,0 % por encima de lo esperado según su nivel de precio de la gasolina."
        },
        "Cisnes": {
          "actualY": 35.0,
          "expectedY": 34.61,
          "diffY": 0.39,
          "zResid": 0.19,
          "note": "Cisnes (35,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 22.0,
          "expectedY": 22.82,
          "diffY": -0.82,
          "zResid": -0.4,
          "note": "Guaitecas (22,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 36.0,
          "expectedY": 35.6,
          "diffY": 0.4,
          "zResid": 0.2,
          "note": "Chile Chico (36,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Río Ibáñez": {
          "actualY": 34.0,
          "expectedY": 36.58,
          "diffY": -2.58,
          "zResid": -1.26,
          "note": "Río Ibáñez registra 34,0 %, 2,6 % por debajo de lo esperado según su nivel de precio de la gasolina."
        },
        "Cochrane": {
          "actualY": 35.0,
          "expectedY": 37.56,
          "diffY": -2.56,
          "zResid": -1.25,
          "note": "Cochrane registra 35,0 %, 2,6 % por debajo de lo esperado según su nivel de precio de la gasolina."
        },
        "O'Higgins": {
          "actualY": 20.0,
          "expectedY": 16.93,
          "diffY": 3.07,
          "zResid": 1.5,
          "note": "O'Higgins registra 20,0 %, 3,1 % por encima de lo esperado según su nivel de precio de la gasolina."
        },
        "Tortel": {
          "actualY": 18.0,
          "expectedY": 20.86,
          "diffY": -2.86,
          "zResid": -1.4,
          "note": "Tortel registra 18,0 %, 2,9 % por debajo de lo esperado según su nivel de precio de la gasolina."
        }
      },
      "metrics_line": "R² 94% · r = –0,97 · Sin Coyhaique: –0,97 · Control pob.: –0,88",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": -0.972,
        "spearmanRho": -0.912,
        "kendallTau": -0.809,
        "partialCorrPop": -0.882,
        "rWithoutCoyhaique": -0.971,
        "firstDiffCorrDelta": -0.882,
        "pValueFdr": 6e-06,
        "veredictoSimple": "R² 94% · r = –0,97 · Sin Coyhaique: –0,97 · Control pob.: –0,88"
      }
    },
    {
      "id": "disc_10",
      "order": 10,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Precio de Gasolina 93 vs. Cobertura Preventiva EMPAM",
      "headline": "Precio de Gasolina 93 vs. Cobertura Preventiva EMPAM",
      "hubX": "III. Energía",
      "hubY": "VIII. Salud",
      "varX": "gasolina_93_clp",
      "varY": "cobertura_empam_pct",
      "labelX": "Precio Minorista de Gasolina 93 Octanos",
      "labelY": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
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
        1362.0,
        1520.0,
        1375.0,
        1440.0,
        1560.0,
        1430.0,
        1420.0,
        1410.0,
        1620.0,
        1580.0
      ],
      "dataY": [
        80.2,
        72.1,
        78.6,
        76.5,
        71.0,
        79.1,
        75.8,
        77.4,
        69.5,
        68.8
      ],
      "regressionLine": {
        "slopeBeta1": -0.04441,
        "interceptBeta0": 140.2607,
        "rSquaredPct": 92.7,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "El combustible más caro encarece rondas rurales y traslados médicos: O'Higgins (1.620 $/L) cubre al 69,5% de sus adultos mayores, diez puntos bajo Coyhaique (80,2%).",
      "plainExplanation": "El combustible más caro encarece rondas rurales y traslados médicos: O'Higgins (1.620 $/L) cubre al 69,5% de sus adultos mayores, diez puntos bajo Coyhaique (80,2%).",
      "notable_commune": "Caso atípico: Chile Chico registra +2,3 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 80.2,
          "expectedY": 79.77,
          "diffY": 0.43,
          "zResid": 0.4,
          "note": "Coyhaique (80,2 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Lago Verde": {
          "actualY": 72.1,
          "expectedY": 72.75,
          "diffY": -0.65,
          "zResid": -0.61,
          "note": "Lago Verde registra 72,1 %, 0,7 % por debajo de lo esperado según su nivel de precio de combustible."
        },
        "Aysén": {
          "actualY": 78.6,
          "expectedY": 79.19,
          "diffY": -0.59,
          "zResid": -0.55,
          "note": "Aysén registra 78,6 %, 0,6 % por debajo de lo esperado según su nivel de precio de combustible."
        },
        "Cisnes": {
          "actualY": 76.5,
          "expectedY": 76.31,
          "diffY": 0.19,
          "zResid": 0.18,
          "note": "Cisnes (76,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 71.0,
          "expectedY": 70.98,
          "diffY": 0.02,
          "zResid": 0.02,
          "note": "Guaitecas (71,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 79.1,
          "expectedY": 76.75,
          "diffY": 2.35,
          "zResid": 2.18,
          "note": "Chile Chico registra 79,1 %, 2,3 % por encima de lo esperado según su nivel de precio de combustible."
        },
        "Río Ibáñez": {
          "actualY": 75.8,
          "expectedY": 77.2,
          "diffY": -1.4,
          "zResid": -1.3,
          "note": "Río Ibáñez registra 75,8 %, 1,4 % por debajo de lo esperado según su nivel de precio de combustible."
        },
        "Cochrane": {
          "actualY": 77.4,
          "expectedY": 77.64,
          "diffY": -0.24,
          "zResid": -0.22,
          "note": "Cochrane (77,4 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 69.5,
          "expectedY": 68.31,
          "diffY": 1.19,
          "zResid": 1.1,
          "note": "O'Higgins registra 69,5 %, 1,2 % por encima de lo esperado según su nivel de precio de combustible."
        },
        "Tortel": {
          "actualY": 68.8,
          "expectedY": 70.09,
          "diffY": -1.29,
          "zResid": -1.2,
          "note": "Tortel registra 68,8 %, 1,3 % por debajo de lo esperado según su nivel de precio de combustible."
        }
      },
      "metrics_line": "R² 93% · r = –0,96 · Sin Coyhaique: –0,95 · Control pob.: –0,83",
      "statProofBadges": {
        "fuerzaExplicativaPct": 93,
        "pearsonR": -0.963,
        "spearmanRho": -0.891,
        "kendallTau": -0.778,
        "partialCorrPop": -0.827,
        "rWithoutCoyhaique": -0.954,
        "firstDiffCorrDelta": -0.827,
        "pValueFdr": 1.2e-05,
        "veredictoSimple": "R² 93% · r = –0,96 · Sin Coyhaique: –0,95 · Control pob.: –0,83"
      }
    },
    {
      "id": "disc_11",
      "order": 11,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Costo de Generación Diésel Aislada vs. Aislamiento Multimodal",
      "headline": "Costo de Generación Diésel Aislada vs. Aislamiento Multimodal",
      "hubX": "III. Energía",
      "hubY": "IV. Gobernanza",
      "varX": "costo_real_generacion_diesel_kwh_clp",
      "varY": "indice_aislamiento_multimodal",
      "labelX": "Costo de Generación Eléctrica Aislada",
      "labelY": "Índice Compuesto de Aislamiento Multimodal",
      "unitX": "$/kWh",
      "unitY": "puntos",
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
        560.0,
        0.0,
        380.0,
        640.0,
        0.0,
        0.0,
        0.0,
        620.0,
        680.0
      ],
      "dataY": [
        0.0,
        67.5,
        8.9,
        33.0,
        87.1,
        27.9,
        31.0,
        28.7,
        86.6,
        79.2
      ],
      "regressionLine": {
        "slopeBeta1": 0.09499,
        "interceptBeta0": 17.6334,
        "rSquaredPct": 84.9,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Transportar diésel por ripio y barcaza dispara el costo real eléctrico: Tortel genera a 680 $/kWh con 79,2 puntos de aislamiento, frente a Coyhaique (0 $/kWh).",
      "plainExplanation": "Transportar diésel por ripio y barcaza dispara el costo real eléctrico: Tortel genera a 680 $/kWh con 79,2 puntos de aislamiento, frente a Coyhaique (0 $/kWh).",
      "notable_commune": "Caso atípico: Cisnes registra –20,7 puntos por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 0.0,
          "expectedY": 17.63,
          "diffY": -17.63,
          "zResid": -1.48,
          "note": "Coyhaique registra 0,0 puntos, 17,6 puntos por debajo de lo esperado según su nivel de costo de generación diésel."
        },
        "Lago Verde": {
          "actualY": 67.5,
          "expectedY": 70.83,
          "diffY": -3.33,
          "zResid": -0.28,
          "note": "Lago Verde (67,5 puntos) se ubica prácticamente en línea con la tendencia regional."
        },
        "Aysén": {
          "actualY": 8.9,
          "expectedY": 17.63,
          "diffY": -8.73,
          "zResid": -0.73,
          "note": "Aysén registra 8,9 puntos, 8,7 puntos por debajo de lo esperado según su nivel de costo de generación diésel."
        },
        "Cisnes": {
          "actualY": 33.0,
          "expectedY": 53.73,
          "diffY": -20.73,
          "zResid": -1.74,
          "note": "Cisnes registra 33,0 puntos, 20,7 puntos por debajo de lo esperado según su nivel de costo de generación diésel."
        },
        "Guaitecas": {
          "actualY": 87.1,
          "expectedY": 78.43,
          "diffY": 8.67,
          "zResid": 0.73,
          "note": "Guaitecas registra 87,1 puntos, 8,7 puntos por encima de lo esperado según su nivel de costo de generación diésel."
        },
        "Chile Chico": {
          "actualY": 27.9,
          "expectedY": 17.63,
          "diffY": 10.27,
          "zResid": 0.86,
          "note": "Chile Chico registra 27,9 puntos, 10,3 puntos por encima de lo esperado según su nivel de costo de generación diésel."
        },
        "Río Ibáñez": {
          "actualY": 31.0,
          "expectedY": 17.63,
          "diffY": 13.37,
          "zResid": 1.12,
          "note": "Río Ibáñez registra 31,0 puntos, 13,4 puntos por encima de lo esperado según su nivel de costo de generación diésel."
        },
        "Cochrane": {
          "actualY": 28.7,
          "expectedY": 17.63,
          "diffY": 11.07,
          "zResid": 0.93,
          "note": "Cochrane registra 28,7 puntos, 11,1 puntos por encima de lo esperado según su nivel de costo de generación diésel."
        },
        "O'Higgins": {
          "actualY": 86.6,
          "expectedY": 76.53,
          "diffY": 10.07,
          "zResid": 0.85,
          "note": "O'Higgins registra 86,6 puntos, 10,1 puntos por encima de lo esperado según su nivel de costo de generación diésel."
        },
        "Tortel": {
          "actualY": 79.2,
          "expectedY": 82.23,
          "diffY": -3.03,
          "zResid": -0.25,
          "note": "Tortel (79,2 puntos) se ubica prácticamente en línea con la tendencia regional."
        }
      },
      "metrics_line": "R² 85% · r = +0,92 · Sin Coyhaique: +0,93 · Control pob.: +0,82",
      "statProofBadges": {
        "fuerzaExplicativaPct": 85,
        "pearsonR": 0.921,
        "spearmanRho": 0.899,
        "kendallTau": 0.781,
        "partialCorrPop": 0.825,
        "rWithoutCoyhaique": 0.925,
        "firstDiffCorrDelta": 0.825,
        "pValueFdr": 0.000181,
        "veredictoSimple": "R² 85% · r = +0,92 · Sin Coyhaique: +0,93 · Control pob.: +0,82"
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
        302.0,
        0.0,
        145.0,
        375.0,
        0.0,
        0.0,
        0.0,
        358.0,
        412.0
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
        "slopeBeta1": -0.04639,
        "interceptBeta0": 38.8845,
        "rSquaredPct": 84.1,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "Los municipios con mayor subsidio diésel también enfrentan más trabas técnicas en inversión: Tortel recibe 412 $/kWh y aprueba 18,0% RS, ante 45,0% en Coyhaique (0 $/kWh).",
      "plainExplanation": "Los municipios con mayor subsidio diésel también enfrentan más trabas técnicas en inversión: Tortel recibe 412 $/kWh y aprueba 18,0% RS, ante 45,0% en Coyhaique (0 $/kWh).",
      "notable_commune": "Caso atípico: Coyhaique registra +6,1 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 45.0,
          "expectedY": 38.88,
          "diffY": 6.12,
          "zResid": 1.76,
          "note": "Coyhaique registra 45,0 %, 6,1 % por encima de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Lago Verde": {
          "actualY": 28.0,
          "expectedY": 24.88,
          "diffY": 3.12,
          "zResid": 0.9,
          "note": "Lago Verde registra 28,0 %, 3,1 % por encima de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Aysén": {
          "actualY": 42.0,
          "expectedY": 38.88,
          "diffY": 3.12,
          "zResid": 0.9,
          "note": "Aysén registra 42,0 %, 3,1 % por encima de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Cisnes": {
          "actualY": 35.0,
          "expectedY": 32.16,
          "diffY": 2.84,
          "zResid": 0.82,
          "note": "Cisnes registra 35,0 %, 2,8 % por encima de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Guaitecas": {
          "actualY": 22.0,
          "expectedY": 21.49,
          "diffY": 0.51,
          "zResid": 0.15,
          "note": "Guaitecas (22,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 36.0,
          "expectedY": 38.88,
          "diffY": -2.88,
          "zResid": -0.83,
          "note": "Chile Chico registra 36,0 %, 2,9 % por debajo de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Río Ibáñez": {
          "actualY": 34.0,
          "expectedY": 38.88,
          "diffY": -4.88,
          "zResid": -1.41,
          "note": "Río Ibáñez registra 34,0 %, 4,9 % por debajo de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Cochrane": {
          "actualY": 35.0,
          "expectedY": 38.88,
          "diffY": -3.88,
          "zResid": -1.12,
          "note": "Cochrane registra 35,0 %, 3,9 % por debajo de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "O'Higgins": {
          "actualY": 20.0,
          "expectedY": 22.28,
          "diffY": -2.28,
          "zResid": -0.66,
          "note": "O'Higgins registra 20,0 %, 2,3 % por debajo de lo esperado según su nivel de subsidio fiscal diésel."
        },
        "Tortel": {
          "actualY": 18.0,
          "expectedY": 19.77,
          "diffY": -1.77,
          "zResid": -0.51,
          "note": "Tortel registra 18,0 %, 1,8 % por debajo de lo esperado según su nivel de subsidio fiscal diésel."
        }
      },
      "metrics_line": "R² 84% · r = –0,92 · Sin Coyhaique: –0,93 · Control pob.: –0,82",
      "statProofBadges": {
        "fuerzaExplicativaPct": 84,
        "pearsonR": -0.917,
        "spearmanRho": -0.869,
        "kendallTau": -0.764,
        "partialCorrPop": -0.82,
        "rWithoutCoyhaique": -0.93,
        "firstDiffCorrDelta": -0.82,
        "pValueFdr": 0.000212,
        "veredictoSimple": "R² 84% · r = –0,92 · Sin Coyhaique: –0,93 · Control pob.: –0,82"
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
        80.2,
        72.1,
        78.6,
        76.5,
        71.0,
        79.1,
        75.8,
        77.4,
        69.5,
        68.8
      ],
      "regressionLine": {
        "slopeBeta1": 0.44339,
        "interceptBeta0": 60.9331,
        "rSquaredPct": 94.4,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Donde el municipio logra aprobar más proyectos, la salud primaria también cubre más: Coyhaique (45,0% RS) alcanza 80,2% en EMPAM, frente a 68,8% en Tortel (18,0% RS).",
      "plainExplanation": "Donde el municipio logra aprobar más proyectos, la salud primaria también cubre más: Coyhaique (45,0% RS) alcanza 80,2% en EMPAM, frente a 68,8% en Tortel (18,0% RS).",
      "notable_commune": "Caso atípico: Chile Chico registra +2,2 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 80.2,
          "expectedY": 80.89,
          "diffY": -0.69,
          "zResid": -0.72,
          "note": "Coyhaique registra 80,2 %, 0,7 % por debajo de lo esperado según su nivel de tasa de aprobación RS."
        },
        "Lago Verde": {
          "actualY": 72.1,
          "expectedY": 73.35,
          "diffY": -1.25,
          "zResid": -1.32,
          "note": "Lago Verde registra 72,1 %, 1,2 % por debajo de lo esperado según su nivel de tasa de aprobación RS."
        },
        "Aysén": {
          "actualY": 78.6,
          "expectedY": 79.56,
          "diffY": -0.96,
          "zResid": -1.01,
          "note": "Aysén registra 78,6 %, 1,0 % por debajo de lo esperado según su nivel de tasa de aprobación RS."
        },
        "Cisnes": {
          "actualY": 76.5,
          "expectedY": 76.45,
          "diffY": 0.05,
          "zResid": 0.05,
          "note": "Cisnes (76,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 71.0,
          "expectedY": 70.69,
          "diffY": 0.31,
          "zResid": 0.33,
          "note": "Guaitecas (71,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 79.1,
          "expectedY": 76.9,
          "diffY": 2.2,
          "zResid": 2.33,
          "note": "Chile Chico registra 79,1 %, 2,2 % por encima de lo esperado según su nivel de tasa de aprobación RS."
        },
        "Río Ibáñez": {
          "actualY": 75.8,
          "expectedY": 76.01,
          "diffY": -0.21,
          "zResid": -0.22,
          "note": "Río Ibáñez (75,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cochrane": {
          "actualY": 77.4,
          "expectedY": 76.45,
          "diffY": 0.95,
          "zResid": 1.0,
          "note": "Cochrane registra 77,4 %, 0,9 % por encima de lo esperado según su nivel de tasa de aprobación RS."
        },
        "O'Higgins": {
          "actualY": 69.5,
          "expectedY": 69.8,
          "diffY": -0.3,
          "zResid": -0.32,
          "note": "O'Higgins (69,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Tortel": {
          "actualY": 68.8,
          "expectedY": 68.91,
          "diffY": -0.11,
          "zResid": -0.12,
          "note": "Tortel (68,8 %) se ubica prácticamente en línea con la tendencia regional."
        }
      },
      "metrics_line": "R² 94% · r = +0,97 · Sin Coyhaique: +0,97 · Control pob.: +0,85",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.971,
        "spearmanRho": 0.985,
        "kendallTau": 0.944,
        "partialCorrPop": 0.849,
        "rWithoutCoyhaique": 0.967,
        "firstDiffCorrDelta": 0.849,
        "pValueFdr": 6e-06,
        "veredictoSimple": "R² 94% · r = +0,97 · Sin Coyhaique: +0,97 · Control pob.: +0,85"
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
        74.5,
        68.0,
        71.2,
        70.4,
        65.8,
        73.0,
        69.8,
        72.1,
        64.2,
        63.5
      ],
      "regressionLine": {
        "slopeBeta1": 0.38981,
        "interceptBeta0": 56.971,
        "rSquaredPct": 90.8,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "La capacidad para sacar adelante carteras de inversión se refleja en la red clínica: Coyhaique aprueba 45,0% RS y sostiene 74,5% cardiovascular, versus 63,5% en Tortel (18,0%).",
      "plainExplanation": "La capacidad para sacar adelante carteras de inversión se refleja en la red clínica: Coyhaique aprueba 45,0% RS y sostiene 74,5% cardiovascular, versus 63,5% en Tortel (18,0%).",
      "notable_commune": "Caso atípico: Aysén registra –2,1 % por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 74.5,
          "expectedY": 74.51,
          "diffY": -0.01,
          "zResid": -0.01,
          "note": "Coyhaique (74,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Lago Verde": {
          "actualY": 68.0,
          "expectedY": 67.89,
          "diffY": 0.11,
          "zResid": 0.11,
          "note": "Lago Verde (68,0 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Aysén": {
          "actualY": 71.2,
          "expectedY": 73.34,
          "diffY": -2.14,
          "zResid": -1.99,
          "note": "Aysén registra 71,2 %, 2,1 % por debajo de lo esperado según su nivel de tasa de proyectos RS."
        },
        "Cisnes": {
          "actualY": 70.4,
          "expectedY": 70.61,
          "diffY": -0.21,
          "zResid": -0.2,
          "note": "Cisnes (70,4 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 65.8,
          "expectedY": 65.55,
          "diffY": 0.25,
          "zResid": 0.23,
          "note": "Guaitecas (65,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 73.0,
          "expectedY": 71.0,
          "diffY": 2.0,
          "zResid": 1.85,
          "note": "Chile Chico registra 73,0 %, 2,0 % por encima de lo esperado según su nivel de tasa de proyectos RS."
        },
        "Río Ibáñez": {
          "actualY": 69.8,
          "expectedY": 70.22,
          "diffY": -0.42,
          "zResid": -0.39,
          "note": "Río Ibáñez (69,8 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cochrane": {
          "actualY": 72.1,
          "expectedY": 70.61,
          "diffY": 1.49,
          "zResid": 1.38,
          "note": "Cochrane registra 72,1 %, 1,5 % por encima de lo esperado según su nivel de tasa de proyectos RS."
        },
        "O'Higgins": {
          "actualY": 64.2,
          "expectedY": 64.77,
          "diffY": -0.57,
          "zResid": -0.53,
          "note": "O'Higgins registra 64,2 %, 0,6 % por debajo de lo esperado según su nivel de tasa de proyectos RS."
        },
        "Tortel": {
          "actualY": 63.5,
          "expectedY": 63.99,
          "diffY": -0.49,
          "zResid": -0.45,
          "note": "Tortel registra 63,5 %, 0,5 % por debajo de lo esperado según su nivel de tasa de proyectos RS."
        }
      },
      "metrics_line": "R² 91% · r = +0,95 · Sin Coyhaique: +0,94 · Control pob.: +0,84",
      "statProofBadges": {
        "fuerzaExplicativaPct": 91,
        "pearsonR": 0.953,
        "spearmanRho": 0.954,
        "kendallTau": 0.899,
        "partialCorrPop": 0.838,
        "rWithoutCoyhaique": 0.938,
        "firstDiffCorrDelta": 0.838,
        "pValueFdr": 2.8e-05,
        "veredictoSimple": "R² 91% · r = +0,95 · Sin Coyhaique: +0,94 · Control pob.: +0,84"
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
        0.0,
        67.5,
        8.9,
        33.0,
        87.1,
        27.9,
        31.0,
        28.7,
        86.6,
        79.2
      ],
      "dataY": [
        80.2,
        72.1,
        78.6,
        76.5,
        71.0,
        79.1,
        75.8,
        77.4,
        69.5,
        68.8
      ],
      "regressionLine": {
        "slopeBeta1": -0.12513,
        "interceptBeta0": 80.5297,
        "rSquaredPct": 92.9,
        "directionLabel": "Relación Inversa (–)"
      },
      "reading": "La fricción de viaje por ripio y navegación reduce el control preventivo de mayores: Guaitecas (87,1 puntos de aislamiento) cubre 71,0%, mientras Coyhaique (0,0 puntos) llega a 80,2%.",
      "plainExplanation": "La fricción de viaje por ripio y navegación reduce el control preventivo de mayores: Guaitecas (87,1 puntos de aislamiento) cubre 71,0%, mientras Coyhaique (0,0 puntos) llega a 80,2%.",
      "notable_commune": "Caso atípico: Chile Chico registra +2,1 % por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 80.2,
          "expectedY": 80.53,
          "diffY": -0.33,
          "zResid": -0.31,
          "note": "Coyhaique (80,2 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Lago Verde": {
          "actualY": 72.1,
          "expectedY": 72.08,
          "diffY": 0.02,
          "zResid": 0.02,
          "note": "Lago Verde (72,1 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Aysén": {
          "actualY": 78.6,
          "expectedY": 79.42,
          "diffY": -0.82,
          "zResid": -0.77,
          "note": "Aysén registra 78,6 %, 0,8 % por debajo de lo esperado según su nivel de aislamiento multimodal."
        },
        "Cisnes": {
          "actualY": 76.5,
          "expectedY": 76.4,
          "diffY": 0.1,
          "zResid": 0.09,
          "note": "Cisnes (76,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Guaitecas": {
          "actualY": 71.0,
          "expectedY": 69.63,
          "diffY": 1.37,
          "zResid": 1.29,
          "note": "Guaitecas registra 71,0 %, 1,4 % por encima de lo esperado según su nivel de aislamiento multimodal."
        },
        "Chile Chico": {
          "actualY": 79.1,
          "expectedY": 77.04,
          "diffY": 2.06,
          "zResid": 1.95,
          "note": "Chile Chico registra 79,1 %, 2,1 % por encima de lo esperado según su nivel de aislamiento multimodal."
        },
        "Río Ibáñez": {
          "actualY": 75.8,
          "expectedY": 76.65,
          "diffY": -0.85,
          "zResid": -0.8,
          "note": "Río Ibáñez registra 75,8 %, 0,9 % por debajo de lo esperado según su nivel de aislamiento multimodal."
        },
        "Cochrane": {
          "actualY": 77.4,
          "expectedY": 76.94,
          "diffY": 0.46,
          "zResid": 0.44,
          "note": "Cochrane (77,4 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 69.5,
          "expectedY": 69.69,
          "diffY": -0.19,
          "zResid": -0.18,
          "note": "O'Higgins (69,5 %) se ubica prácticamente en línea con la tendencia regional."
        },
        "Tortel": {
          "actualY": 68.8,
          "expectedY": 70.62,
          "diffY": -1.82,
          "zResid": -1.72,
          "note": "Tortel registra 68,8 %, 1,8 % por debajo de lo esperado según su nivel de aislamiento multimodal."
        }
      },
      "metrics_line": "R² 93% · r = –0,96 · Sin Coyhaique: –0,96 · Control pob.: –0,81",
      "statProofBadges": {
        "fuerzaExplicativaPct": 93,
        "pearsonR": -0.964,
        "spearmanRho": -0.927,
        "kendallTau": -0.778,
        "partialCorrPop": -0.812,
        "rWithoutCoyhaique": -0.956,
        "firstDiffCorrDelta": -0.812,
        "pValueFdr": 1.1e-05,
        "veredictoSimple": "R² 93% · r = –0,96 · Sin Coyhaique: –0,96 · Control pob.: –0,81"
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
      "metrics_line": "R² 82% · r = +0,91 · Sin Coyhaique: +0,98 · Control pob.: +0,96",
      "statProofBadges": {
        "fuerzaExplicativaPct": 82,
        "pearsonR": 0.905,
        "spearmanRho": 0.753,
        "kendallTau": 0.669,
        "partialCorrPop": 0.96,
        "rWithoutCoyhaique": 0.982,
        "firstDiffCorrDelta": 0.96,
        "pValueFdr": 0.000351,
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
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0
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
        "slopeBeta1": 0.00257,
        "interceptBeta0": 176.4611,
        "rSquaredPct": 81.6,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Las solicitudes costeras indígenas se superponen con los polos de inversión litoral: Aysén suma 393.000 ha ECMPO y 1.320 MM US$ en el SEIA, frente a 0 ha y 495,6 MM US$ en Coyhaique.",
      "plainExplanation": "Las solicitudes costeras indígenas se superponen con los polos de inversión litoral: Aysén suma 393.000 ha ECMPO y 1.320 MM US$ en el SEIA, frente a 0 ha y 495,6 MM US$ en Coyhaique.",
      "notable_commune": "Caso atípico: Coyhaique registra +319,1 MM US$ por encima de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 495.6,
          "expectedY": 176.46,
          "diffY": 319.14,
          "zResid": 2.03,
          "note": "Coyhaique registra 495,6 MM US$, 319,1 MM US$ por encima de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Lago Verde": {
          "actualY": 31.4,
          "expectedY": 176.46,
          "diffY": -145.06,
          "zResid": -0.92,
          "note": "Lago Verde registra 31,4 MM US$, 145,1 MM US$ por debajo de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Aysén": {
          "actualY": 1320.0,
          "expectedY": 1184.88,
          "diffY": 135.12,
          "zResid": 0.86,
          "note": "Aysén registra 1.320 MM US$, 135,1 MM US$ por encima de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Cisnes": {
          "actualY": 525.0,
          "expectedY": 758.93,
          "diffY": -233.93,
          "zResid": -1.48,
          "note": "Cisnes registra 525 MM US$, 233,9 MM US$ por debajo de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Guaitecas": {
          "actualY": 245.0,
          "expectedY": 176.46,
          "diffY": 68.54,
          "zResid": 0.44,
          "note": "Guaitecas (245 MM US$) se ubica prácticamente en línea con la tendencia regional."
        },
        "Chile Chico": {
          "actualY": 310.0,
          "expectedY": 176.46,
          "diffY": 133.54,
          "zResid": 0.85,
          "note": "Chile Chico registra 310 MM US$, 133,5 MM US$ por encima de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Río Ibáñez": {
          "actualY": 142.0,
          "expectedY": 176.46,
          "diffY": -34.46,
          "zResid": -0.22,
          "note": "Río Ibáñez (142 MM US$) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cochrane": {
          "actualY": 172.0,
          "expectedY": 176.46,
          "diffY": -4.46,
          "zResid": -0.03,
          "note": "Cochrane (172 MM US$) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 48.0,
          "expectedY": 176.46,
          "diffY": -128.46,
          "zResid": -0.82,
          "note": "O'Higgins registra 48,0 MM US$, 128,5 MM US$ por debajo de lo esperado según su nivel de superficie ECMPO solicitada."
        },
        "Tortel": {
          "actualY": 66.5,
          "expectedY": 176.46,
          "diffY": -109.96,
          "zResid": -0.7,
          "note": "Tortel registra 66,5 MM US$, 110 MM US$ por debajo de lo esperado según su nivel de superficie ECMPO solicitada."
        }
      },
      "metrics_line": "R² 82% · r = +0,90 · Sin Coyhaique: +0,95 · Control pob.: +0,94",
      "statProofBadges": {
        "fuerzaExplicativaPct": 82,
        "pearsonR": 0.904,
        "spearmanRho": 0.701,
        "kendallTau": 0.615,
        "partialCorrPop": 0.939,
        "rWithoutCoyhaique": 0.949,
        "firstDiffCorrDelta": 0.939,
        "pValueFdr": 0.000351,
        "veredictoSimple": "R² 82% · r = +0,90 · Sin Coyhaique: +0,95 · Control pob.: +0,94"
      }
    },
    {
      "id": "disc_18",
      "order": 18,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "title": "Capacidad Eléctrica Instalada vs. Inversión Aprobada SEIA",
      "headline": "Capacidad Eléctrica Instalada vs. Inversión Aprobada SEIA",
      "hubX": "III. Energía",
      "hubY": "V. Inversión",
      "varX": "potencia_mw",
      "varY": "inversion_seia_mmusd",
      "labelX": "Capacidad Eléctrica Instalada en el Subsistema",
      "labelY": "Inversión Privada Aprobada en el SEIA",
      "unitX": "MW",
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
        26.8,
        1.4,
        42.5,
        6.8,
        2.8,
        7.5,
        2.4,
        5.8,
        1.4,
        1.2
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
        "slopeBeta1": 26.00892,
        "interceptBeta0": 79.1021,
        "rSquaredPct": 85.5,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Disponer de potencia firme habilita plantas de proceso e infraestructura: Aysén suma 42,5 MW y 1.320 MM US$ aprobados en el SEIA, ante 1,2 MW y 66,5 MM US$ en Tortel.",
      "plainExplanation": "Disponer de potencia firme habilita plantas de proceso e infraestructura: Aysén suma 42,5 MW y 1.320 MM US$ aprobados en el SEIA, ante 1,2 MW y 66,5 MM US$ en Tortel.",
      "notable_commune": "Caso atípico: Coyhaique registra –280,5 MM US$ por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 495.6,
          "expectedY": 776.14,
          "diffY": -280.54,
          "zResid": -2.0,
          "note": "Coyhaique registra 495,6 MM US$, 280,5 MM US$ por debajo de lo esperado según su nivel de potencia eléctrica instalada."
        },
        "Lago Verde": {
          "actualY": 31.4,
          "expectedY": 115.51,
          "diffY": -84.11,
          "zResid": -0.6,
          "note": "Lago Verde registra 31,4 MM US$, 84,1 MM US$ por debajo de lo esperado según su nivel de potencia eléctrica instalada."
        },
        "Aysén": {
          "actualY": 1320.0,
          "expectedY": 1184.48,
          "diffY": 135.52,
          "zResid": 0.97,
          "note": "Aysén registra 1.320 MM US$, 135,5 MM US$ por encima de lo esperado según su nivel de potencia eléctrica instalada."
        },
        "Cisnes": {
          "actualY": 525.0,
          "expectedY": 255.96,
          "diffY": 269.04,
          "zResid": 1.92,
          "note": "Cisnes registra 525 MM US$, 269 MM US$ por encima de lo esperado según su nivel de potencia eléctrica instalada."
        },
        "Guaitecas": {
          "actualY": 245.0,
          "expectedY": 151.93,
          "diffY": 93.07,
          "zResid": 0.66,
          "note": "Guaitecas registra 245 MM US$, 93,1 MM US$ por encima de lo esperado según su nivel de potencia eléctrica instalada."
        },
        "Chile Chico": {
          "actualY": 310.0,
          "expectedY": 274.17,
          "diffY": 35.83,
          "zResid": 0.26,
          "note": "Chile Chico (310 MM US$) se ubica prácticamente en línea con la tendencia regional."
        },
        "Río Ibáñez": {
          "actualY": 142.0,
          "expectedY": 141.52,
          "diffY": 0.48,
          "zResid": 0.0,
          "note": "Río Ibáñez (142 MM US$) se ubica prácticamente en línea con la tendencia regional."
        },
        "Cochrane": {
          "actualY": 172.0,
          "expectedY": 229.95,
          "diffY": -57.95,
          "zResid": -0.41,
          "note": "Cochrane (172 MM US$) se ubica prácticamente en línea con la tendencia regional."
        },
        "O'Higgins": {
          "actualY": 48.0,
          "expectedY": 115.51,
          "diffY": -67.51,
          "zResid": -0.48,
          "note": "O'Higgins registra 48,0 MM US$, 67,5 MM US$ por debajo de lo esperado según su nivel de potencia eléctrica instalada."
        },
        "Tortel": {
          "actualY": 66.5,
          "expectedY": 110.31,
          "diffY": -43.81,
          "zResid": -0.31,
          "note": "Tortel (66,5 MM US$) se ubica prácticamente en línea con la tendencia regional."
        }
      },
      "metrics_line": "R² 86% · r = +0,93 · Sin Coyhaique: +0,97 · Control pob.: +0,83",
      "statProofBadges": {
        "fuerzaExplicativaPct": 86,
        "pearsonR": 0.925,
        "spearmanRho": 0.912,
        "kendallTau": 0.764,
        "partialCorrPop": 0.828,
        "rWithoutCoyhaique": 0.966,
        "firstDiffCorrDelta": 0.828,
        "pValueFdr": 0.000162,
        "veredictoSimple": "R² 86% · r = +0,93 · Sin Coyhaique: +0,97 · Control pob.: +0,83"
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
        208500.0,
        6800.0,
        98400.0,
        74200.0,
        5400.0,
        58600.0,
        86200.0,
        49200.0,
        16400.0,
        27000.0
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
        "slopeBeta1": 0.01552,
        "interceptBeta0": -188.3189,
        "rSquaredPct": 93.6,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "El atractivo turístico impulsa el loteo de predios rústicos: Coyhaique suma 208.500 noches y 3.240 subdivisiones certificadas por el SAG, contra 5.400 noches y 15 predios en Guaitecas.",
      "plainExplanation": "El atractivo turístico impulsa el loteo de predios rústicos: Coyhaique suma 208.500 noches y 3.240 subdivisiones certificadas por el SAG, contra 5.400 noches y 15 predios en Guaitecas.",
      "notable_commune": "Caso atípico: Cisnes registra –473,2 predios por debajo de lo esperado para su nivel en el eje X.",
      "residualsByComuna": {
        "Coyhaique": {
          "actualY": 3240.0,
          "expectedY": 3047.51,
          "diffY": 192.49,
          "zResid": 0.82,
          "note": "Coyhaique registra 3.240 predios, 192,5 predios por encima de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Lago Verde": {
          "actualY": 185.0,
          "expectedY": -82.79,
          "diffY": 267.79,
          "zResid": 1.15,
          "note": "Lago Verde registra 185 predios, 267,8 predios por encima de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Aysén": {
          "actualY": 1120.0,
          "expectedY": 1338.81,
          "diffY": -218.81,
          "zResid": -0.94,
          "note": "Aysén registra 1.120 predios, 218,8 predios por debajo de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Cisnes": {
          "actualY": 490.0,
          "expectedY": 963.23,
          "diffY": -473.23,
          "zResid": -2.02,
          "note": "Cisnes registra 490 predios, 473,2 predios por debajo de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Guaitecas": {
          "actualY": 15.0,
          "expectedY": -104.51,
          "diffY": 119.51,
          "zResid": 0.51,
          "note": "Guaitecas registra 15 predios, 119,5 predios por encima de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Chile Chico": {
          "actualY": 980.0,
          "expectedY": 721.13,
          "diffY": 258.87,
          "zResid": 1.11,
          "note": "Chile Chico registra 980 predios, 258,9 predios por encima de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Río Ibáñez": {
          "actualY": 1280.0,
          "expectedY": 1149.47,
          "diffY": 130.53,
          "zResid": 0.56,
          "note": "Río Ibáñez registra 1.280 predios, 130,5 predios por encima de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "Cochrane": {
          "actualY": 390.0,
          "expectedY": 575.24,
          "diffY": -185.24,
          "zResid": -0.79,
          "note": "Cochrane registra 390 predios, 185,2 predios por debajo de lo esperado según su nivel de pernoctaciones turísticas."
        },
        "O'Higgins": {
          "actualY": 140.0,
          "expectedY": 66.2,
          "diffY": 73.8,
          "zResid": 0.32,
          "note": "O'Higgins (140 predios) se ubica prácticamente en línea con la tendencia regional."
        },
        "Tortel": {
          "actualY": 65.0,
          "expectedY": 230.71,
          "diffY": -165.71,
          "zResid": -0.71,
          "note": "Tortel registra 65 predios, 165,7 predios por debajo de lo esperado según su nivel de pernoctaciones turísticas."
        }
      },
      "metrics_line": "R² 94% · r = +0,97 · Sin Coyhaique: +0,89 · Control pob.: +0,89",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.968,
        "spearmanRho": 0.927,
        "kendallTau": 0.778,
        "partialCorrPop": 0.888,
        "rWithoutCoyhaique": 0.886,
        "firstDiffCorrDelta": 0.888,
        "pValueFdr": 8e-06,
        "veredictoSimple": "R² 94% · r = +0,97 · Sin Coyhaique: +0,89 · Control pob.: +0,89"
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
      "metrics_line": "R² 94% · r = +0,97 · Sin Coyhaique: +0,83 · Control pob.: +0,90",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.971,
        "spearmanRho": 0.729,
        "kendallTau": 0.674,
        "partialCorrPop": 0.902,
        "rWithoutCoyhaique": 0.832,
        "firstDiffCorrDelta": 0.902,
        "pValueFdr": 7e-06,
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
      "varY": "trafico_aereo_pasajeros_balmaceda_jac",
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
        298400.0,
        324500.0,
        358900.0,
        381200.0,
        396400.0,
        118500.0,
        194200.0,
        342800.0,
        389500.0,
        418600.0,
        442100.0,
        468900.0
      ],
      "dataY": [
        420000.0,
        455000.0,
        490000.0,
        530000.0,
        585000.0,
        240000.0,
        365000.0,
        520000.0,
        605000.0,
        648000.0,
        665000.0,
        682000.0
      ],
      "regressionLine": {
        "slopeBeta1": 1.26957,
        "interceptBeta0": 79715.6517,
        "rSquaredPct": 94.5,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "El flujo aéreo de Balmaceda y las pernoctaciones hoteleras marchan a la par entre 2015 y 2026 (de 298.400 a 468.900 noches y de 420.000 a 682.000 pasajeros), incluida la caída de 2020.",
      "plainExplanation": "El flujo aéreo de Balmaceda y las pernoctaciones hoteleras marchan a la par entre 2015 y 2026 (de 298.400 a 468.900 noches y de 420.000 a 682.000 pasajeros), incluida la caída de 2020.",
      "notable_commune": "",
      "residualsByComuna": {},
      "metrics_line": "R² 94% · r = +0,97 · Sin 2020: +0,95 · Variación anual: +0,99",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.972,
        "spearmanRho": 0.986,
        "kendallTau": 0.939,
        "partialCorrPop": 0.987,
        "rWithoutCoyhaique": 0.951,
        "firstDiffCorrDelta": 0.987,
        "pValueFdr": 1e-06,
        "veredictoSimple": "R² 94% · r = +0,97 · Sin 2020: +0,95 · Variación anual: +0,99"
      }
    },
    {
      "id": "disc_23",
      "order": 23,
      "category": "acoplamiento_temporal_2015_2026",
      "dim": "tiempo",
      "title": "Visitantes a Parques SNASPE vs. PIB Regional (2015–2026)",
      "headline": "Visitantes a Parques SNASPE vs. PIB Regional (2015–2026)",
      "hubX": "I. Turismo",
      "hubY": "V. Inversión",
      "varX": "visitantes_snaspe_conaf_hist",
      "varY": "pib_regional_nominal_mmclp",
      "labelX": "Visitantes Anuales a Parques Nacionales SNASPE en Aysén (2015–2026)",
      "labelY": "Producto Interno Bruto (PIB) Regional de Aysén (2015–2026)",
      "unitX": "visitantes",
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
        112400.0,
        128900.0,
        146500.0,
        162300.0,
        174800.0,
        142100.0,
        168600.0,
        184200.0,
        193400.0,
        201900.0,
        208400.0,
        216500.0
      ],
      "dataY": [
        980000.0,
        1045000.0,
        1120000.0,
        1215000.0,
        1260000.0,
        1180000.0,
        1360000.0,
        1510000.0,
        1610000.0,
        1685000.0,
        1755000.0,
        1830000.0
      ],
      "regressionLine": {
        "slopeBeta1": 8.58341,
        "interceptBeta0": -80013.6329,
        "rSquaredPct": 93.9,
        "directionLabel": "Relación Directa (+)"
      },
      "reading": "Las visitas a parques nacionales pasaron de 112.400 a 216.500 entre 2015 y 2026 en sincronía con el PIB regional, que creció de 980.000 a 1.830.000 millones en la década.",
      "plainExplanation": "Las visitas a parques nacionales pasaron de 112.400 a 216.500 entre 2015 y 2026 en sincronía con el PIB regional, que creció de 980.000 a 1.830.000 millones en la década.",
      "notable_commune": "",
      "residualsByComuna": {},
      "metrics_line": "R² 94% · r = +0,97 · Sin 2020: +0,97 · Variación anual: +0,89",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.969,
        "spearmanRho": 0.986,
        "kendallTau": 0.939,
        "partialCorrPop": 0.887,
        "rWithoutCoyhaique": 0.969,
        "firstDiffCorrDelta": 0.887,
        "pValueFdr": 1e-06,
        "veredictoSimple": "R² 94% · r = +0,97 · Sin 2020: +0,97 · Variación anual: +0,89"
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
          "varKey": "hogares_sin_internet_fijo_pct",
          "hub": "III. Energía",
          "label": "Hogares sin Conexión Fija a Internet",
          "unit": "%",
          "comunaValue": 24.5,
          "regionalMean": 58.45,
          "zScore": -1.98,
          "diffVsMeanPct": -58.1,
          "plainSummary": "Hogares sin Conexión Fija a Internet: 24,5 % (promedio regional: 58,5 %)"
        },
        {
          "varKey": "mediana_espera_quirurgica_dias",
          "hub": "VIII. Salud",
          "label": "Mediana de Espera Quirúrgica No GES",
          "unit": "días",
          "comunaValue": 342.0,
          "regionalMean": 395.0,
          "zScore": -1.95,
          "diffVsMeanPct": -13.4,
          "plainSummary": "Mediana de Espera Quirúrgica No GES: 342,0 días (promedio regional: 395,0 días)"
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
          "varKey": "fuga_compras_pct",
          "hub": "V. Inversión",
          "label": "Fuga Extrarregional de Compras Públicas",
          "unit": "%",
          "comunaValue": 41.6,
          "regionalMean": 64.43,
          "zScore": -1.69,
          "diffVsMeanPct": -35.4,
          "plainSummary": "Fuga Extrarregional de Compras Públicas: 41,6 % (promedio regional: 64,4 %)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Aysén",
          "provincia": "Aysén",
          "similitudPct": 56
        },
        {
          "comuna": "Chile Chico",
          "provincia": "General Carrera",
          "similitudPct": 56
        }
      ],
      "narrativeDigest": "Coyhaique (Coyhaique, 57.823 hab.) destaca sobre la media regional en Total de Proyectos de Ciencia e Innovación (ANID + CORFO) (102,0 proyectos) y Días Anuales sobre Norma Diaria de MP2.5 (SINCA), mientras presenta sus valores más bajos frente al promedio en Dependencia del Fondo Común Municipal (FCM). Sus perfiles territoriales más parecidos son Aysén (56%) y Chile Chico (56%)."
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
          "varKey": "hogares_sin_internet_fijo_pct",
          "hub": "III. Energía",
          "label": "Hogares sin Conexión Fija a Internet",
          "unit": "%",
          "comunaValue": 82.4,
          "regionalMean": 58.45,
          "zScore": 1.4,
          "diffVsMeanPct": 41.0,
          "plainSummary": "Hogares sin Conexión Fija a Internet: 82,4 % (promedio regional: 58,5 %)"
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
          "comunaValue": 425.0,
          "regionalMean": 395.0,
          "zScore": 1.1,
          "diffVsMeanPct": 7.6,
          "plainSummary": "Mediana de Espera Quirúrgica No GES: 425,0 días (promedio regional: 395,0 días)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "tasa_ocupacion_estival_pct",
          "hub": "I. Turismo",
          "label": "Ocupación Hotelera Estival (Enero-Febrero)",
          "unit": "%",
          "comunaValue": 58.2,
          "regionalMean": 77.9,
          "zScore": -2.03,
          "diffVsMeanPct": -25.3,
          "plainSummary": "Ocupación Hotelera Estival (Enero-Febrero): 58,2 % (promedio regional: 77,9 %)"
        },
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
          "varKey": "cobertura_fibra_hogar_pct",
          "hub": "III. Energía",
          "label": "Cobertura de Fibra Óptica al Hogar (FTTH)",
          "unit": "%",
          "comunaValue": 17.6,
          "regionalMean": 41.55,
          "zScore": -1.4,
          "diffVsMeanPct": -57.6,
          "plainSummary": "Cobertura de Fibra Óptica al Hogar (FTTH): 17,6 % (promedio regional: 41,5 %)"
        },
        {
          "varKey": "ventas_por_empresa_uf",
          "hub": "V. Inversión",
          "label": "Ventas Anuales Promedio por Empresa (SII)",
          "unit": "UF/empresa",
          "comunaValue": 5921.0,
          "regionalMean": 13198.2,
          "zScore": -1.31,
          "diffVsMeanPct": -55.1,
          "plainSummary": "Ventas Anuales Promedio por Empresa (SII): 5921,0 UF/empresa (promedio regional: 13198,2 UF/empresa)"
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
          "similitudPct": 61
        }
      ],
      "narrativeDigest": "Lago Verde (Coyhaique, 779 hab.) destaca sobre la media regional en Gasto Municipal en Cultura Per Cápita (49294,0 $/hab) y Hogares con Carencia de Servicios Básicos (RSH), mientras presenta sus valores más bajos frente al promedio en Ocupación Hotelera Estival (Enero-Febrero). Sus perfiles territoriales más parecidos son O'Higgins (63%) y Guaitecas (61%)."
    },
    "Aysén": {
      "comuna": "Aysén",
      "provincia": "Aysén",
      "poblacionCenso2024": 23170,
      "porcentajeRegionalPct": 23.0,
      "topAboveRegionalMean": [
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
          "varKey": "ventas_por_empresa_uf",
          "hub": "V. Inversión",
          "label": "Ventas Anuales Promedio por Empresa (SII)",
          "unit": "UF/empresa",
          "comunaValue": 26762.0,
          "regionalMean": 13198.2,
          "zScore": 2.43,
          "diffVsMeanPct": 102.8,
          "plainSummary": "Ventas Anuales Promedio por Empresa (SII): 26762,0 UF/empresa (promedio regional: 13198,2 UF/empresa)"
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
          "varKey": "ingresos_propios_pct",
          "hub": "IV. Gobernanza",
          "label": "Autonomía por Ingresos Propios Permanentes (IPP)",
          "unit": "%",
          "comunaValue": 47.2,
          "regionalMean": 24.21,
          "zScore": 1.55,
          "diffVsMeanPct": 95.0,
          "plainSummary": "Autonomía por Ingresos Propios Permanentes (IPP): 47,2 % (promedio regional: 24,2 %)"
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
          "varKey": "consumo_lena_m3_hogar_ano",
          "hub": "III. Energía",
          "label": "Consumo Residencial Anual de Leña por Hogar",
          "unit": "m³/hogar/año",
          "comunaValue": 15.0,
          "regionalMean": 18.55,
          "zScore": -1.43,
          "diffVsMeanPct": -19.1,
          "plainSummary": "Consumo Residencial Anual de Leña por Hogar: 15,0 m³/hogar/año (promedio regional: 18,6 m³/hogar/año)"
        },
        {
          "varKey": "fuga_compras_pct",
          "hub": "V. Inversión",
          "label": "Fuga Extrarregional de Compras Públicas",
          "unit": "%",
          "comunaValue": 45.4,
          "regionalMean": 64.43,
          "zScore": -1.41,
          "diffVsMeanPct": -29.5,
          "plainSummary": "Fuga Extrarregional de Compras Públicas: 45,4 % (promedio regional: 64,4 %)"
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
          "varKey": "hogares_sin_internet_fijo_pct",
          "hub": "III. Energía",
          "label": "Hogares sin Conexión Fija a Internet",
          "unit": "%",
          "comunaValue": 38.2,
          "regionalMean": 58.45,
          "zScore": -1.18,
          "diffVsMeanPct": -34.6,
          "plainSummary": "Hogares sin Conexión Fija a Internet: 38,2 % (promedio regional: 58,5 %)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Cisnes",
          "provincia": "Aysén",
          "similitudPct": 64
        },
        {
          "comuna": "Chile Chico",
          "provincia": "General Carrera",
          "similitudPct": 61
        }
      ],
      "narrativeDigest": "Aysén (Aysén, 23.170 hab.) destaca sobre la media regional en Concesiones de Salmonicultura Otorgadas (412,0 concesiones) y Ventas Anuales Promedio por Empresa (SII), mientras presenta sus valores más bajos frente al promedio en Dependencia del Fondo Común Municipal (FCM). Sus perfiles territoriales más parecidos son Cisnes (64%) y Chile Chico (61%)."
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
          "varKey": "tasa_ocupacion_estival_pct",
          "hub": "I. Turismo",
          "label": "Ocupación Hotelera Estival (Enero-Febrero)",
          "unit": "%",
          "comunaValue": 84.5,
          "regionalMean": 77.9,
          "zScore": 0.68,
          "diffVsMeanPct": 8.5,
          "plainSummary": "Ocupación Hotelera Estival (Enero-Febrero): 84,5 % (promedio regional: 77,9 %)"
        }
      ],
      "topBelowRegionalMean": [
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
        },
        {
          "varKey": "ruralidad_censo_2024_pct",
          "hub": "VI. Social",
          "label": "Porcentaje de Población Rural (Censo 2024)",
          "unit": "%",
          "comunaValue": 28.1,
          "regionalMean": 52.89,
          "zScore": -0.63,
          "diffVsMeanPct": -46.9,
          "plainSummary": "Porcentaje de Población Rural (Censo 2024): 28,1 % (promedio regional: 52,9 %)"
        },
        {
          "varKey": "gasto_cultura_per_capita_clp",
          "hub": "IX. Cultura",
          "label": "Gasto Municipal en Cultura Per Cápita",
          "unit": "$/hab",
          "comunaValue": 16040.0,
          "regionalMean": 23518.0,
          "zScore": -0.62,
          "diffVsMeanPct": -31.8,
          "plainSummary": "Gasto Municipal en Cultura Per Cápita: 16040,0 $/hab (promedio regional: 23518,0 $/hab)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Chile Chico",
          "provincia": "General Carrera",
          "similitudPct": 74
        },
        {
          "comuna": "Cochrane",
          "provincia": "Capitán Prat",
          "similitudPct": 72
        }
      ],
      "narrativeDigest": "Cisnes (Aysén, 5.137 hab.) destaca sobre la media regional en Biomasa Anual de Salmón Cosechada (185000,0 toneladas) y Concesiones de Salmonicultura Otorgadas, mientras presenta sus valores más bajos frente al promedio en Cumplimiento de Transparencia Activa Municipal (CPLT). Sus perfiles territoriales más parecidos son Chile Chico (74%) y Cochrane (72%)."
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
          "comunaValue": 438.0,
          "regionalMean": 395.0,
          "zScore": 1.58,
          "diffVsMeanPct": 10.9,
          "plainSummary": "Mediana de Espera Quirúrgica No GES: 438,0 días (promedio regional: 395,0 días)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "tasa_ocupacion_estival_pct",
          "hub": "I. Turismo",
          "label": "Ocupación Hotelera Estival (Enero-Febrero)",
          "unit": "%",
          "comunaValue": 64.0,
          "regionalMean": 77.9,
          "zScore": -1.43,
          "diffVsMeanPct": -17.8,
          "plainSummary": "Ocupación Hotelera Estival (Enero-Febrero): 64,0 % (promedio regional: 77,9 %)"
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
          "comunaValue": 71.0,
          "regionalMean": 74.9,
          "zScore": -0.98,
          "diffVsMeanPct": -5.2,
          "plainSummary": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM): 71,0 % (promedio regional: 74,9 %)"
        },
        {
          "varKey": "cobertura_pscv_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura del Programa de Salud Cardiovascular (PSCV)",
          "unit": "%",
          "comunaValue": 65.8,
          "regionalMean": 69.25,
          "zScore": -0.97,
          "diffVsMeanPct": -5.0,
          "plainSummary": "Cobertura del Programa de Salud Cardiovascular (PSCV): 65,8 % (promedio regional: 69,2 %)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Lago Verde",
          "provincia": "Coyhaique",
          "similitudPct": 61
        },
        {
          "comuna": "O'Higgins",
          "provincia": "Capitán Prat",
          "similitudPct": 58
        }
      ],
      "narrativeDigest": "Guaitecas (Aysén, 1.598 hab.) destaca sobre la media regional en Tiempo de Viaje Multimodal hacia Coyhaique (18,0 horas) y Proporción de Suelo Fiscal (Bienes Nacionales), mientras presenta sus valores más bajos frente al promedio en Ocupación Hotelera Estival (Enero-Febrero). Sus perfiles territoriales más parecidos son Lago Verde (61%) y O'Higgins (58%)."
    },
    "Chile Chico": {
      "comuna": "Chile Chico",
      "provincia": "General Carrera",
      "poblacionCenso2024": 4905,
      "porcentajeRegionalPct": 4.87,
      "topAboveRegionalMean": [
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
          "comunaValue": 79.1,
          "regionalMean": 74.9,
          "zScore": 1.06,
          "diffVsMeanPct": 5.6,
          "plainSummary": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM): 79,1 % (promedio regional: 74,9 %)"
        },
        {
          "varKey": "cobertura_pscv_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura del Programa de Salud Cardiovascular (PSCV)",
          "unit": "%",
          "comunaValue": 73.0,
          "regionalMean": 69.25,
          "zScore": 1.05,
          "diffVsMeanPct": 5.4,
          "plainSummary": "Cobertura del Programa de Salud Cardiovascular (PSCV): 73,0 % (promedio regional: 69,2 %)"
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
          "varKey": "costo_real_generacion_diesel_kwh_clp",
          "hub": "III. Energía",
          "label": "Costo de Generación Eléctrica Aislada",
          "unit": "$/kWh",
          "comunaValue": 0.0,
          "regionalMean": 288.0,
          "zScore": -0.97,
          "diffVsMeanPct": -100.0,
          "plainSummary": "Costo de Generación Eléctrica Aislada: 0,0 $/kWh (promedio regional: 288,0 $/kWh)"
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
        },
        {
          "varKey": "consumo_lena_m3_hogar_ano",
          "hub": "III. Energía",
          "label": "Consumo Residencial Anual de Leña por Hogar",
          "unit": "m³/hogar/año",
          "comunaValue": 16.5,
          "regionalMean": 18.55,
          "zScore": -0.83,
          "diffVsMeanPct": -11.1,
          "plainSummary": "Consumo Residencial Anual de Leña por Hogar: 16,5 m³/hogar/año (promedio regional: 18,6 m³/hogar/año)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Cochrane",
          "provincia": "Capitán Prat",
          "similitudPct": 84
        },
        {
          "comuna": "Cisnes",
          "provincia": "Aysén",
          "similitudPct": 74
        }
      ],
      "narrativeDigest": "Chile Chico (General Carrera, 4.905 hab.) destaca sobre la media regional en Esperanza de Vida al Nacer Comunal (DEIS) (81,3 años) y Cobertura de Control Preventivo del Adulto Mayor (EMPAM), mientras presenta sus valores más bajos frente al promedio en Cumplimiento de Transparencia Activa Municipal (CPLT). Sus perfiles territoriales más parecidos son Cochrane (84%) y Cisnes (74%)."
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
          "varKey": "tasa_ocupacion_estival_pct",
          "hub": "I. Turismo",
          "label": "Ocupación Hotelera Estival (Enero-Febrero)",
          "unit": "%",
          "comunaValue": 89.2,
          "regionalMean": 77.9,
          "zScore": 1.17,
          "diffVsMeanPct": 14.5,
          "plainSummary": "Ocupación Hotelera Estival (Enero-Febrero): 89,2 % (promedio regional: 77,9 %)"
        }
      ],
      "topBelowRegionalMean": [
        {
          "varKey": "costo_real_generacion_diesel_kwh_clp",
          "hub": "III. Energía",
          "label": "Costo de Generación Eléctrica Aislada",
          "unit": "$/kWh",
          "comunaValue": 0.0,
          "regionalMean": 288.0,
          "zScore": -0.97,
          "diffVsMeanPct": -100.0,
          "plainSummary": "Costo de Generación Eléctrica Aislada: 0,0 $/kWh (promedio regional: 288,0 $/kWh)"
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
          "varKey": "deficit_habitacional_total_por_1000_hab",
          "hub": "VI. Social",
          "label": "Déficit Habitacional Relativo (MINVU)",
          "unit": "viv/1.000 hab",
          "comunaValue": 29.7,
          "regionalMean": 39.83,
          "zScore": -0.69,
          "diffVsMeanPct": -25.4,
          "plainSummary": "Déficit Habitacional Relativo (MINVU): 29,7 viv/1.000 hab (promedio regional: 39,8 viv/1.000 hab)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "Chile Chico",
          "provincia": "General Carrera",
          "similitudPct": 70
        },
        {
          "comuna": "Cisnes",
          "provincia": "Aysén",
          "similitudPct": 69
        }
      ],
      "narrativeDigest": "Río Ibáñez (General Carrera, 2.723 hab.) destaca sobre la media regional en Cumplimiento de Transparencia Activa Municipal (CPLT) (100,0 %) y Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN), mientras presenta sus valores más bajos frente al promedio en Costo de Generación Eléctrica Aislada. Sus perfiles territoriales más parecidos son Chile Chico (70%) y Cisnes (69%)."
    },
    "Cochrane": {
      "comuna": "Cochrane",
      "provincia": "Capitán Prat",
      "poblacionCenso2024": 3458,
      "porcentajeRegionalPct": 3.43,
      "topAboveRegionalMean": [
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
          "varKey": "cobertura_pscv_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura del Programa de Salud Cardiovascular (PSCV)",
          "unit": "%",
          "comunaValue": 72.1,
          "regionalMean": 69.25,
          "zScore": 0.8,
          "diffVsMeanPct": 4.1,
          "plainSummary": "Cobertura del Programa de Salud Cardiovascular (PSCV): 72,1 % (promedio regional: 69,2 %)"
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
          "varKey": "cobertura_empam_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
          "unit": "%",
          "comunaValue": 77.4,
          "regionalMean": 74.9,
          "zScore": 0.63,
          "diffVsMeanPct": 3.3,
          "plainSummary": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM): 77,4 % (promedio regional: 74,9 %)"
        },
        {
          "varKey": "esperanza_vida_total_anos",
          "hub": "VIII. Salud",
          "label": "Esperanza de Vida al Nacer Comunal (DEIS)",
          "unit": "años",
          "comunaValue": 80.8,
          "regionalMean": 80.29,
          "zScore": 0.59,
          "diffVsMeanPct": 0.6,
          "plainSummary": "Esperanza de Vida al Nacer Comunal (DEIS): 80,8 años (promedio regional: 80,3 años)"
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
          "varKey": "costo_real_generacion_diesel_kwh_clp",
          "hub": "III. Energía",
          "label": "Costo de Generación Eléctrica Aislada",
          "unit": "$/kWh",
          "comunaValue": 0.0,
          "regionalMean": 288.0,
          "zScore": -0.97,
          "diffVsMeanPct": -100.0,
          "plainSummary": "Costo de Generación Eléctrica Aislada: 0,0 $/kWh (promedio regional: 288,0 $/kWh)"
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
          "similitudPct": 84
        },
        {
          "comuna": "Cisnes",
          "provincia": "Aysén",
          "similitudPct": 72
        }
      ],
      "narrativeDigest": "Cochrane (Capitán Prat, 3.458 hab.) destaca sobre la media regional en Proporción de Suelo Fiscal (Bienes Nacionales) (31,4 %) y Cobertura del Programa de Salud Cardiovascular (PSCV), mientras presenta sus valores más bajos frente al promedio en Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN). Sus perfiles territoriales más parecidos son Chile Chico (84%) y Cisnes (72%)."
    },
    "O'Higgins": {
      "comuna": "O'Higgins",
      "provincia": "Capitán Prat",
      "poblacionCenso2024": 647,
      "porcentajeRegionalPct": 0.64,
      "topAboveRegionalMean": [
        {
          "varKey": "superficie_glaciares_km2",
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
          "varKey": "consumo_lena_m3_hogar_ano",
          "hub": "III. Energía",
          "label": "Consumo Residencial Anual de Leña por Hogar",
          "unit": "m³/hogar/año",
          "comunaValue": 22.0,
          "regionalMean": 18.55,
          "zScore": 1.39,
          "diffVsMeanPct": 18.6,
          "plainSummary": "Consumo Residencial Anual de Leña por Hogar: 22,0 m³/hogar/año (promedio regional: 18,6 m³/hogar/año)"
        },
        {
          "varKey": "indice_aislamiento_multimodal",
          "hub": "IV. Gobernanza",
          "label": "Índice Compuesto de Aislamiento Multimodal",
          "unit": "puntos",
          "comunaValue": 86.6,
          "regionalMean": 44.99,
          "zScore": 1.36,
          "diffVsMeanPct": 92.5,
          "plainSummary": "Índice Compuesto de Aislamiento Multimodal: 86,6 puntos (promedio regional: 45,0 puntos)"
        },
        {
          "varKey": "fuga_compras_pct",
          "hub": "V. Inversión",
          "label": "Fuga Extrarregional de Compras Públicas",
          "unit": "%",
          "comunaValue": 81.6,
          "regionalMean": 64.43,
          "zScore": 1.27,
          "diffVsMeanPct": 26.6,
          "plainSummary": "Fuga Extrarregional de Compras Públicas: 81,6 % (promedio regional: 64,4 %)"
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
          "comunaValue": 64.2,
          "regionalMean": 69.25,
          "zScore": -1.42,
          "diffVsMeanPct": -7.3,
          "plainSummary": "Cobertura del Programa de Salud Cardiovascular (PSCV): 64,2 % (promedio regional: 69,2 %)"
        },
        {
          "varKey": "cobertura_empam_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
          "unit": "%",
          "comunaValue": 69.5,
          "regionalMean": 74.9,
          "zScore": -1.36,
          "diffVsMeanPct": -7.2,
          "plainSummary": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM): 69,5 % (promedio regional: 74,9 %)"
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
          "similitudPct": 68
        },
        {
          "comuna": "Lago Verde",
          "provincia": "Coyhaique",
          "similitudPct": 63
        }
      ],
      "narrativeDigest": "O'Higgins (Capitán Prat, 647 hab.) destaca sobre la media regional en Superficie Glaciar Comunal (DGA) (3450,0 km²) y Consumo Residencial Anual de Leña por Hogar, mientras presenta sus valores más bajos frente al promedio en Proporción de Ciencia Liderada por Centros Locales. Sus perfiles territoriales más parecidos son Tortel (68%) y Lago Verde (63%)."
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
          "varKey": "cobertura_pscv_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura del Programa de Salud Cardiovascular (PSCV)",
          "unit": "%",
          "comunaValue": 63.5,
          "regionalMean": 69.25,
          "zScore": -1.61,
          "diffVsMeanPct": -8.3,
          "plainSummary": "Cobertura del Programa de Salud Cardiovascular (PSCV): 63,5 % (promedio regional: 69,2 %)"
        },
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
          "varKey": "cobertura_empam_pct",
          "hub": "VIII. Salud",
          "label": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)",
          "unit": "%",
          "comunaValue": 68.8,
          "regionalMean": 74.9,
          "zScore": -1.53,
          "diffVsMeanPct": -8.1,
          "plainSummary": "Cobertura de Control Preventivo del Adulto Mayor (EMPAM): 68,8 % (promedio regional: 74,9 %)"
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
          "varKey": "esperanza_vida_total_anos",
          "hub": "VIII. Salud",
          "label": "Esperanza de Vida al Nacer Comunal (DEIS)",
          "unit": "años",
          "comunaValue": 79.0,
          "regionalMean": 80.29,
          "zScore": -1.5,
          "diffVsMeanPct": -1.6,
          "plainSummary": "Esperanza de Vida al Nacer Comunal (DEIS): 79,0 años (promedio regional: 80,3 años)"
        }
      ],
      "twinComunas": [
        {
          "comuna": "O'Higgins",
          "provincia": "Capitán Prat",
          "similitudPct": 68
        },
        {
          "comuna": "Lago Verde",
          "provincia": "Coyhaique",
          "similitudPct": 57
        }
      ],
      "narrativeDigest": "Tortel (Capitán Prat, 505 hab.) destaca sobre la media regional en Déficit Habitacional Relativo (MINVU) (77,2 viv/1.000 hab) y Ratio de Presión Turística Estacional, mientras presenta sus valores más bajos frente al promedio en Cobertura del Programa de Salud Cardiovascular (PSCV). Sus perfiles territoriales más parecidos son O'Higgins (68%) y Lago Verde (57%)."
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
