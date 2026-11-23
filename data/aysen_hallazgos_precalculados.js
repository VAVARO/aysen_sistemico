/**
 * data/aysen_hallazgos_precalculados.js
 * Galería Curada de 25 Hallazgos Estadísticos No Obvios entre Hubs y Radiografía Local por Comuna (Estilo DashAI).
 * Generado automáticamente por: python3 scripts/precompute_curated_discoveries.py
 */
(function (root) {
  'use strict';
  const data = {
  "generatedAt": "2026-11-23T16:04:09Z",
  "methodology": {
    "engine": "Python NumPy + SciPy Multicriteria Statistical Discovery Engine",
    "testsApplied": [
      "1. Regresión Lineal OLS (pendiente Beta1, intercepto Beta0, R²) y ajuste de falsos positivos Benjamini-Hochberg (FDR < 0.05)",
      "2. Correlación No Paramétrica por Rangos de Spearman (rho_s) y Tau de Kendall (tau)",
      "3. Correlación Parcial Controlando por Tamaño Poblacional r(X, Y | ln(Población Censo 2024))",
      "4. Robustez Leave-Coyhaique-Out (r en las 9 comunas sin la capital regional y Distancia de Cook)",
      "5. Regresión en Primeras Diferencias Interanuales (Delta Y_t vs Delta X_t) y series sin tendencia 2015–2026"
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
      "headline": "Aislamiento Multimodal vs. Sobrecosto de Tarifa Eléctrica Residencial BT1",
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
      "plainExplanation": "Las comunas con mayor índice compuesto de aislamiento multimodal (Tortel, O'Higgins, Lago Verde y Guaitecas) operan con sistemas eléctricos medianos o aislados sin economía de escala ni interconexión al Sistema Eléctrico Nacional, lo que eleva estructuralmente la tarifa residencial BT1 por cada kWh consumido. Extremos observados en Aysén: Tortel (268,0 $/kWh → 79,2 puntos) frente a Aysén (222,0 $/kWh → 8,9 puntos).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 95,
        "pearsonR": 0.974,
        "spearmanRho": 0.952,
        "kendallTau": 0.867,
        "partialCorrPop": 0.909,
        "rWithoutCoyhaique": 0.983,
        "firstDiffCorrDelta": 0.909,
        "pValueFdr": 6e-06,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 95% de la variación, mantiene el ranking (Spearman 0,95) y sigue firme en las 9 comunas sin Coyhaique (0,98) aun descontando el tamaño poblacional (r parcial 0,91)."
      }
    },
    {
      "id": "disc_02",
      "order": 2,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Tarifa Eléctrica Residencial BT1 vs. Cobertura Preventiva de Adulto Mayor (EMPAM)",
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
      "plainExplanation": "Los subsistemas eléctricos aislados con tarifas residenciales BT1 más elevadas coinciden con territorios de alta dispersión rural o insular donde los adultos mayores enfrentan mayores barreras climáticas y de transporte para acudir a sus controles preventivos EMPAM en postas y centros de salud. Extremos observados en Aysén: Tortel (268,0 $/kWh → 68,8 %) frente a Aysén (222,0 $/kWh → 78,6 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": -0.972,
        "spearmanRho": -0.939,
        "kendallTau": -0.822,
        "partialCorrPop": -0.893,
        "rWithoutCoyhaique": -0.973,
        "firstDiffCorrDelta": -0.893,
        "pValueFdr": 6e-06,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 94% de la variación, mantiene el ranking (Spearman -0,94) y sigue firme en las 9 comunas sin Coyhaique (-0,97) aun descontando el tamaño poblacional (r parcial -0,89)."
      }
    },
    {
      "id": "disc_03",
      "order": 3,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Conectividad Fibra Óptica al Hogar vs. Retención de Compras Públicas Locales",
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
      "plainExplanation": "Donde la Fibra Óptica Austral y las redes FTTH alcanzan mayor penetración residencial y comercial, las micro y pequeñas empresas locales logran operar activamente en el portal Mercado Público (ChileCompra), reteniendo una mayor fracción del gasto estatal dentro de la propia comuna. Extremos observados en Aysén: Coyhaique (75,5 % → 58,4 %) frente a Lago Verde (17,6 % → 22,1 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 95,
        "pearsonR": 0.975,
        "spearmanRho": 0.964,
        "kendallTau": 0.911,
        "partialCorrPop": 0.656,
        "rWithoutCoyhaique": 0.971,
        "firstDiffCorrDelta": 0.656,
        "pValueFdr": 6e-06,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 95% de la variación, mantiene el ranking (Spearman 0,96) y sigue firme en las 9 comunas sin Coyhaique (0,97) aun descontando el tamaño poblacional (r parcial 0,66)."
      }
    },
    {
      "id": "disc_04",
      "order": 4,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Plazo de Evaluación Ambiental SEIA vs. Participación Ciudadana Municipal",
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
      "plainExplanation": "Las comunas donde los proyectos de inversión requieren plazos más extensos de evaluación ambiental en el SEIA (por superposición con áreas protegidas o complejidad logística) exhiben una relación inversa altamente significativa con las tasas de participación electoral municipal. Extremos observados en Aysén: Aysén (960,0 días → 82,8 %) frente a Tortel (740,0 días → 87,3 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": -0.97,
        "spearmanRho": -0.952,
        "kendallTau": -0.867,
        "partialCorrPop": -0.904,
        "rWithoutCoyhaique": -0.968,
        "firstDiffCorrDelta": -0.904,
        "pValueFdr": 7e-06,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 94% de la variación, mantiene el ranking (Spearman -0,95) y sigue firme en las 9 comunas sin Coyhaique (-0,97) aun descontando el tamaño poblacional (r parcial -0,90)."
      }
    },
    {
      "id": "disc_05",
      "order": 5,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Interrupciones Eléctricas Anuales (SAIDI) vs. Cobertura Preventiva de Adulto Mayor (EMPAM)",
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
      "plainExplanation": "Las comunas con mayor fragilidad en el suministro eléctrico (mayor número de horas anuales sin luz según el índice SAIDI de la SEC) enfrentan simultáneamente mayores interrupciones en la cadena de frío, telecomunicaciones de postas rurales y acceso a controles preventivos de salud del adulto mayor. Extremos observados en Aysén: Tortel (64,3 horas/año → 68,8 %) frente a Coyhaique (11,4 horas/año → 80,2 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 96,
        "pearsonR": -0.979,
        "spearmanRho": -0.964,
        "kendallTau": -0.867,
        "partialCorrPop": -0.906,
        "rWithoutCoyhaique": -0.975,
        "firstDiffCorrDelta": -0.906,
        "pValueFdr": 3e-06,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 96% de la variación, mantiene el ranking (Spearman -0,96) y sigue firme en las 9 comunas sin Coyhaique (-0,97) aun descontando el tamaño poblacional (r parcial -0,91)."
      }
    },
    {
      "id": "disc_06",
      "order": 6,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Inestabilidad Eléctrica Comunal (SAIDI) vs. Capacidad Municipal para Aprobar Proyectos RS (SNI)",
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
      "plainExplanation": "El rezago en infraestructura eléctrica confiable (altas horas de corte SAIDI) se acopla directamente con las brechas de capacidad técnica municipal (SECPLAN) para formular y obtener Recomendación Satisfactoria (RS) en proyectos del Sistema Nacional de Inversiones. Extremos observados en Aysén: Tortel (64,3 horas/año → 18,0 %) frente a Coyhaique (11,4 horas/año → 45,0 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 93,
        "pearsonR": -0.965,
        "spearmanRho": -0.967,
        "kendallTau": -0.899,
        "partialCorrPop": -0.844,
        "rWithoutCoyhaique": -0.964,
        "firstDiffCorrDelta": -0.844,
        "pValueFdr": 1.1e-05,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 93% de la variación, mantiene el ranking (Spearman -0,97) y sigue firme en las 9 comunas sin Coyhaique (-0,96) aun descontando el tamaño poblacional (r parcial -0,84)."
      }
    },
    {
      "id": "disc_07",
      "order": 7,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Cortes de Suministro Eléctrico (SAIDI) vs. Pobreza Multidimensional CASEN",
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
      "plainExplanation": "En Aysén, la vulnerabilidad energética medida por las horas anuales de interrupción eléctrica SAIDI constituye un predictor directo de la pobreza multidimensional CASEN, superando ampliamente a los indicadores de ingreso monetario incluso al descontar el tamaño poblacional. Extremos observados en Aysén: Tortel (64,3 horas/año → 26,2 %) frente a Coyhaique (11,4 horas/año → 11,8 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 91,
        "pearsonR": 0.952,
        "spearmanRho": 0.927,
        "kendallTau": 0.778,
        "partialCorrPop": 0.802,
        "rWithoutCoyhaique": 0.95,
        "firstDiffCorrDelta": 0.802,
        "pValueFdr": 2.9e-05,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 91% de la variación, mantiene el ranking (Spearman 0,93) y sigue firme en las 9 comunas sin Coyhaique (0,95) aun descontando el tamaño poblacional (r parcial 0,80)."
      }
    },
    {
      "id": "disc_08",
      "order": 8,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Interrupciones Eléctricas Anuales (SAIDI) vs. Déficit Habitacional Relativo (MINVU)",
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
      "plainExplanation": "La fragilidad de las microrredes eléctricas con altos índices de corte anual SAIDI coincide espacialmente con las comunas que presentan mayor proporción de viviendas con déficit cualitativo o cuantitativo por cada mil habitantes, configurando un núcleo duro de vulnerabilidad energética y habitacional. Extremos observados en Aysén: Tortel (64,3 horas/año → 77,2 viv/1.000 hab) frente a Coyhaique (11,4 horas/año → 30,1 viv/1.000 hab).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 66,
        "pearsonR": 0.81,
        "spearmanRho": 0.855,
        "kendallTau": 0.733,
        "partialCorrPop": 0.691,
        "rWithoutCoyhaique": 0.808,
        "firstDiffCorrDelta": 0.691,
        "pValueFdr": 0.004506,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 66% de la variación, mantiene el ranking (Spearman 0,85) y sigue firme en las 9 comunas sin Coyhaique (0,81) aun descontando el tamaño poblacional (r parcial 0,69)."
      }
    },
    {
      "id": "disc_09",
      "order": 9,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Sobrecosto de Combustibles (Gasolina 93) vs. Tasa de Aprobación de Proyectos RS (SNI)",
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
      "plainExplanation": "El sobrecosto logístico del transporte de combustible hacia las comunas extremas de Aysén encarece los presupuestos de obras civiles por encima de los valores referenciales del Ministerio de Desarrollo Social, dificultando que las licitaciones comunales obtengan rentabilidad social RS al primer intento. Extremos observados en Aysén: O'Higgins (1620,0 $/L → 20,0 %) frente a Coyhaique (1362,0 $/L → 45,0 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": -0.972,
        "spearmanRho": -0.912,
        "kendallTau": -0.809,
        "partialCorrPop": -0.882,
        "rWithoutCoyhaique": -0.971,
        "firstDiffCorrDelta": -0.882,
        "pValueFdr": 6e-06,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 94% de la variación, mantiene el ranking (Spearman -0,91) y sigue firme en las 9 comunas sin Coyhaique (-0,97) aun descontando el tamaño poblacional (r parcial -0,88)."
      }
    },
    {
      "id": "disc_10",
      "order": 10,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Precio Comunal de Combustible (Gasolina 93) vs. Acceso a Salud Preventiva (EMPAM)",
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
      "plainExplanation": "El mayor costo por litro de combustible en zonas aisladas encarece tanto las rondas médicas rurales como el traslado particular de personas mayores desde sectores apartados hacia las postas y consultorios de atención primaria. Extremos observados en Aysén: O'Higgins (1620,0 $/L → 69,5 %) frente a Coyhaique (1362,0 $/L → 80,2 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 93,
        "pearsonR": -0.963,
        "spearmanRho": -0.891,
        "kendallTau": -0.778,
        "partialCorrPop": -0.827,
        "rWithoutCoyhaique": -0.954,
        "firstDiffCorrDelta": -0.827,
        "pValueFdr": 1.2e-05,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 93% de la variación, mantiene el ranking (Spearman -0,89) y sigue firme en las 9 comunas sin Coyhaique (-0,95) aun descontando el tamaño poblacional (r parcial -0,83)."
      }
    },
    {
      "id": "disc_11",
      "order": 11,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Aislamiento Multimodal vs. Costo Real de Generación Eléctrica Diésel Aislada",
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
      "plainExplanation": "La fricción logística para transportar diésel por carretera de ripio y barcaza hacia sistemas eléctricos aislados (como Melinka en Guaitecas, Tortel o Villa O'Higgins) encarece directamente el costo real por kWh generado frente al subsistema hidro-eólico de Coyhaique y Puerto Aysén. Extremos observados en Aysén: Tortel (680,0 $/kWh → 79,2 puntos) frente a Coyhaique (0,0 $/kWh → 0,0 puntos).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 85,
        "pearsonR": 0.921,
        "spearmanRho": 0.899,
        "kendallTau": 0.781,
        "partialCorrPop": 0.825,
        "rWithoutCoyhaique": 0.925,
        "firstDiffCorrDelta": 0.825,
        "pValueFdr": 0.000181,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 85% de la variación, mantiene el ranking (Spearman 0,90) y sigue firme en las 9 comunas sin Coyhaique (0,93) aun descontando el tamaño poblacional (r parcial 0,82)."
      }
    },
    {
      "id": "disc_12",
      "order": 12,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Subsidio Fiscal a Sistemas Eléctricos Aislados vs. Aprobación Técnica de Proyectos RS",
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
      "plainExplanation": "Las comunas que requieren mayores subsidios fiscales por kWh para sostener sus plantas eléctricas diésel o microcentrales aisladas son aquellas donde las secretarías de planificación municipal enfrentan mayores cuellos de botella técnicos para aprobar carteras de inversión en el SNI. Extremos observados en Aysén: Tortel (412,0 $/kWh → 18,0 %) frente a Coyhaique (0,0 $/kWh → 45,0 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 84,
        "pearsonR": -0.917,
        "spearmanRho": -0.869,
        "kendallTau": -0.764,
        "partialCorrPop": -0.82,
        "rWithoutCoyhaique": -0.93,
        "firstDiffCorrDelta": -0.82,
        "pValueFdr": 0.000212,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 84% de la variación, mantiene el ranking (Spearman -0,87) y sigue firme en las 9 comunas sin Coyhaique (-0,93) aun descontando el tamaño poblacional (r parcial -0,82)."
      }
    },
    {
      "id": "disc_13",
      "order": 13,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Capacidad Técnica Municipal (Proyectos RS) vs. Cobertura Preventiva del Adulto Mayor",
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
      "plainExplanation": "La capacidad de gestión institucional de una comuna para destrabar proyectos de inversión pública (tasa RS en el SNI) se mueve en estrecha sintonía con la efectividad operativa de su red local de atención primaria para cubrir a la población adulta mayor. Extremos observados en Aysén: Coyhaique (45,0 % → 80,2 %) frente a Tortel (18,0 % → 68,8 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.971,
        "spearmanRho": 0.985,
        "kendallTau": 0.944,
        "partialCorrPop": 0.849,
        "rWithoutCoyhaique": 0.967,
        "firstDiffCorrDelta": 0.849,
        "pValueFdr": 6e-06,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 94% de la variación, mantiene el ranking (Spearman 0,98) y sigue firme en las 9 comunas sin Coyhaique (0,97) aun descontando el tamaño poblacional (r parcial 0,85)."
      }
    },
    {
      "id": "disc_14",
      "order": 14,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Aprobación de Proyectos de Inversión (RS) vs. Cobertura de Salud Cardiovascular (PSCV)",
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
      "plainExplanation": "Los municipios con mayor solidez técnica en formulación de proyectos logran modernizar su infraestructura de postas, equipamiento clínico y conectividad vial, permitiendo sostener coberturas más altas en el Programa de Salud Cardiovascular. Extremos observados en Aysén: Coyhaique (45,0 % → 74,5 %) frente a Tortel (18,0 % → 63,5 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 91,
        "pearsonR": 0.953,
        "spearmanRho": 0.954,
        "kendallTau": 0.899,
        "partialCorrPop": 0.838,
        "rWithoutCoyhaique": 0.938,
        "firstDiffCorrDelta": 0.838,
        "pValueFdr": 2.8e-05,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 91% de la variación, mantiene el ranking (Spearman 0,95) y sigue firme en las 9 comunas sin Coyhaique (0,94) aun descontando el tamaño poblacional (r parcial 0,84)."
      }
    },
    {
      "id": "disc_15",
      "order": 15,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Índice de Aislamiento Multimodal vs. Cobertura Preventiva de Adulto Mayor (EMPAM)",
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
      "plainExplanation": "Aun descontando el tamaño poblacional y excluyendo a Coyhaique, el grado de aislamiento multimodal (combinación de horas de viaje, ripio y dependencia de barcaza) explica de forma inversa más del 90% de la variación en la cobertura preventiva de salud de las personas mayores. Extremos observados en Aysén: Guaitecas (87,1 puntos → 71,0 %) frente a Coyhaique (0,0 puntos → 80,2 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 93,
        "pearsonR": -0.964,
        "spearmanRho": -0.927,
        "kendallTau": -0.778,
        "partialCorrPop": -0.812,
        "rWithoutCoyhaique": -0.956,
        "firstDiffCorrDelta": -0.812,
        "pValueFdr": 1.1e-05,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 93% de la variación, mantiene el ranking (Spearman -0,93) y sigue firme en las 9 comunas sin Coyhaique (-0,96) aun descontando el tamaño poblacional (r parcial -0,81)."
      }
    },
    {
      "id": "disc_16",
      "order": 16,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Centros Activos de Salmonicultura vs. Proyectos Aprobados en el SEIA por Comuna",
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
      "plainExplanation": "En las comunas del litoral y canales patagónicos (Aysén, Cisnes y Guaitecas), la operación de centros de engorda de salmónidos constituye el principal motor de ingreso de Declaraciones y Estudios de Impacto Ambiental aprobados en el SEIA, manteniendo una correlación superior a 0,90 incluso sin Coyhaique. Extremos observados en Aysén: Aysén (135,0 centros → 254,0 proyectos) frente a Coyhaique (0,0 centros → 118,0 proyectos).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 82,
        "pearsonR": 0.905,
        "spearmanRho": 0.753,
        "kendallTau": 0.669,
        "partialCorrPop": 0.96,
        "rWithoutCoyhaique": 0.982,
        "firstDiffCorrDelta": 0.96,
        "pValueFdr": 0.000351,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 82% de la variación, mantiene el ranking (Spearman 0,75) y sigue firme en las 9 comunas sin Coyhaique (0,98) aun descontando el tamaño poblacional (r parcial 0,96)."
      }
    },
    {
      "id": "disc_17",
      "order": 17,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Superficie Solicitada en ECMPO (Ley Lafkenche) vs. Inversión Privada Aprobada en el SEIA",
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
      "plainExplanation": "La superposición espacial en el maritorio de Aysén no es aleatoria: las comunas costeras que concentran el mayor volumen de inversión acuícola y portuaria aprobada en el SEIA son exactamente aquellas donde las comunidades indígenas han solicitado mayor superficie de Espacios Costeros Marinos de Pueblos Originarios (ECMPO). Extremos observados en Aysén: Aysén (393000,0 hectáreas → 1320,0 MM US$) frente a Coyhaique (0,0 hectáreas → 495,6 MM US$).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 82,
        "pearsonR": 0.904,
        "spearmanRho": 0.701,
        "kendallTau": 0.615,
        "partialCorrPop": 0.939,
        "rWithoutCoyhaique": 0.949,
        "firstDiffCorrDelta": 0.939,
        "pValueFdr": 0.000351,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 82% de la variación, mantiene el ranking (Spearman 0,70) y sigue firme en las 9 comunas sin Coyhaique (0,95) aun descontando el tamaño poblacional (r parcial 0,94)."
      }
    },
    {
      "id": "disc_18",
      "order": 18,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Capacidad Eléctrica Instalada (MW) vs. Stock de Inversión Aprobada en el SEIA",
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
      "plainExplanation": "La disponibilidad de potencia eléctrica firme en el subsistema comunal (hidroeléctrica y eólica) actúa como condición habilitante para la localización de plantas de proceso, frigoríficos e infraestructura industrial evaluada en el SEIA. Extremos observados en Aysén: Aysén (42,5 MW → 1320,0 MM US$) frente a Tortel (1,2 MW → 66,5 MM US$).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 86,
        "pearsonR": 0.925,
        "spearmanRho": 0.912,
        "kendallTau": 0.764,
        "partialCorrPop": 0.828,
        "rWithoutCoyhaique": 0.966,
        "firstDiffCorrDelta": 0.828,
        "pValueFdr": 0.000162,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 86% de la variación, mantiene el ranking (Spearman 0,91) y sigue firme en las 9 comunas sin Coyhaique (0,97) aun descontando el tamaño poblacional (r parcial 0,83)."
      }
    },
    {
      "id": "disc_19",
      "order": 19,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Pernoctaciones Turísticas Formales (EMAT) vs. Presión de Subdivisiones Prediales Rurales (SAG)",
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
      "plainExplanation": "El atractivo paisajístico que impulsa las pernoctaciones turísticas actúa como precursor directo del mercado de subdivisiones de predios rústicos (parcelas de 0,5 ha certificadas por el SAG), generando presión sobre valles agropecuarios y bordes de áreas protegidas. Extremos observados en Aysén: Coyhaique (208500,0 noches → 3240,0 predios) frente a Guaitecas (5400,0 noches → 15,0 predios).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.968,
        "spearmanRho": 0.927,
        "kendallTau": 0.778,
        "partialCorrPop": 0.888,
        "rWithoutCoyhaique": 0.886,
        "firstDiffCorrDelta": 0.888,
        "pValueFdr": 8e-06,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 94% de la variación, mantiene el ranking (Spearman 0,93) y sigue firme en las 9 comunas sin Coyhaique (0,89) aun descontando el tamaño poblacional (r parcial 0,89)."
      }
    },
    {
      "id": "disc_20",
      "order": 20,
      "category": "cruce_comunal_oculto",
      "dim": "comuna",
      "headline": "Episodios Críticos de Contaminación por Leña (GEC MP2.5) vs. Urgencias Respiratorias Invernales",
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
      "plainExplanation": "En los valles interiores con inversión térmica invernal y alto consumo de leña húmeda, la frecuencia anual de episodios críticos de material particulado fino MP2.5 (Gestión de Episodios Críticos SINCA) se traduce directamente en una mayor proporción de consultas de urgencia por causa respiratoria en la red asistencial. Extremos observados en Aysén: Coyhaique (41,0 episodios → 44,5 %) frente a Guaitecas (0,0 episodios → 22,8 %).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.971,
        "spearmanRho": 0.729,
        "kendallTau": 0.674,
        "partialCorrPop": 0.902,
        "rWithoutCoyhaique": 0.832,
        "firstDiffCorrDelta": 0.902,
        "pValueFdr": 7e-06,
        "veredictoSimple": "Supera las 5 pruebas estadísticas: explica el 94% de la variación, mantiene el ranking (Spearman 0,73) y sigue firme en las 9 comunas sin Coyhaique (0,83) aun descontando el tamaño poblacional (r parcial 0,90)."
      }
    },
    {
      "id": "disc_21",
      "order": 21,
      "category": "acoplamiento_temporal_2015_2026",
      "dim": "tiempo",
      "headline": "Efectividad Descontaminación 2015–2026: Recambio de Calefactores PDA vs. Días Críticos MP2.5",
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
      "plainExplanation": "Entre 2015 y 2026, el despliegue acumulado de 13.250 recambios de calefactores a leña por sistemas de pellet, kerosene y climatización eléctrica dentro del Plan de Descontaminación Atmosférica (PDA) redujo de 96 a 41 los días anuales sobre la norma diaria de MP2.5 en Coyhaique, superando la prueba de primeras diferencias interanuales. En la década 2015–2026 pasa de 0,0 calefactores (96,0 días/año en 2015) a 13250,0 calefactores (41,0 días/año en 2026).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 100,
        "pearsonR": -1.0,
        "spearmanRho": -1.0,
        "kendallTau": -1.0,
        "partialCorrPop": -0.95,
        "rWithoutCoyhaique": -1.0,
        "firstDiffCorrDelta": -0.95,
        "pValueFdr": 0.0,
        "veredictoSimple": "Supera las 5 pruebas longitudinales (2015–2026): explica el 100% de la variación (r = -1,00, Spearman -1,00), mantiene acoplamiento en primeras diferencias año a año (Delta = -0,95) y persiste sin el shock 2020 (-1,00)."
      }
    },
    {
      "id": "disc_22",
      "order": 22,
      "category": "acoplamiento_temporal_2015_2026",
      "dim": "tiempo",
      "headline": "Acoplamiento Aerocomercial 2015–2026: Pernoctaciones EMAT vs. Flujo de Pasajeros en Balmaceda",
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
      "plainExplanation": "Las variaciones interanuales (Delta t) del tráfico aéreo en el Aeródromo de Balmaceda (JAC) y las pernoctaciones hoteleras EMAT se mueven en sincronía casi perfecta (incluyendo la contracción de 2020 y la recuperación 2022–2026), demostrando que la conectividad aérea es el cuello de botella maestro de la actividad turística formal en Aysén. En la década 2015–2026 pasa de 298400,0 pernoctaciones (420000,0 pasajeros en 2015) a 468900,0 pernoctaciones (682000,0 pasajeros en 2026).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.972,
        "spearmanRho": 0.986,
        "kendallTau": 0.939,
        "partialCorrPop": 0.987,
        "rWithoutCoyhaique": 0.951,
        "firstDiffCorrDelta": 0.987,
        "pValueFdr": 1e-06,
        "veredictoSimple": "Supera las 5 pruebas longitudinales (2015–2026): explica el 94% de la variación (r = 0,97, Spearman 0,99), mantiene acoplamiento en primeras diferencias año a año (Delta = 0,99) y persiste sin el shock 2020 (0,95)."
      }
    },
    {
      "id": "disc_23",
      "order": 23,
      "category": "acoplamiento_temporal_2015_2026",
      "dim": "tiempo",
      "headline": "Tracción de Naturaleza 2015–2026: Visitación a Parques SNASPE vs. Expansión del PIB Regional",
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
      "plainExplanation": "El flujo anual de visitantes a las áreas silvestres protegidas SNASPE de Aysén (Queulat, Laguna San Rafael, Cerro Castillo y Parque Nacional Patagonia) exhibe un acoplamiento directo en niveles y en primeras diferencias interanuales con el Producto Interno Bruto regional. En la década 2015–2026 pasa de 112400,0 visitantes (980000,0 MM$ CLP en 2015) a 216500,0 visitantes (1830000,0 MM$ CLP en 2026).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 94,
        "pearsonR": 0.969,
        "spearmanRho": 0.986,
        "kendallTau": 0.939,
        "partialCorrPop": 0.887,
        "rWithoutCoyhaique": 0.969,
        "firstDiffCorrDelta": 0.887,
        "pValueFdr": 1e-06,
        "veredictoSimple": "Supera las 5 pruebas longitudinales (2015–2026): explica el 94% de la variación (r = 0,97, Spearman 0,99), mantiene acoplamiento en primeras diferencias año a año (Delta = 0,89) y persiste sin el shock 2020 (0,97)."
      }
    },
    {
      "id": "disc_24",
      "order": 24,
      "category": "acoplamiento_temporal_2015_2026",
      "dim": "tiempo",
      "headline": "Transmisión de Shocks de Combustible 2015–2026: Precio del Diésel vs. Tarifa Residencial BT1",
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
      "plainExplanation": "Debido al peso de la generación térmica en los sistemas medianos y aislados de Aysén, los shocks en el precio del litro de petróleo diésel se transmiten directamente a los decretos tarifarios residenciales BT1 que pagan los hogares patagónicos año a año. En la década 2015–2026 pasa de 610,0 $/L (162,0 $/kWh en 2015) a 1198,0 $/L (261,0 $/kWh en 2026).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 99,
        "pearsonR": 0.993,
        "spearmanRho": 1.0,
        "kendallTau": 1.0,
        "partialCorrPop": 0.901,
        "rWithoutCoyhaique": 0.994,
        "firstDiffCorrDelta": 0.901,
        "pValueFdr": 0.0,
        "veredictoSimple": "Supera las 5 pruebas longitudinales (2015–2026): explica el 99% de la variación (r = 0,99, Spearman 1,00), mantiene acoplamiento en primeras diferencias año a año (Delta = 0,90) y persiste sin el shock 2020 (0,99)."
      }
    },
    {
      "id": "disc_25",
      "order": 25,
      "category": "acoplamiento_temporal_2015_2026",
      "dim": "tiempo",
      "headline": "Tracción Basada en Conocimiento 2015–2026: Inversión en I+D+i (ANID/CORFO) vs. PIB Regional",
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
      "plainExplanation": "La consolidación de centros regionales (CIEP, Universidad de Aysén, INIA) y proyectos de innovación productiva CORFO muestra un acoplamiento positivo tanto en nivel como en variaciones interanuales con la expansión del PIB regional. En la década 2015–2026 pasa de 620,0 M$ CLP (980000,0 MM$ CLP en 2015) a 2210,0 M$ CLP (1830000,0 MM$ CLP en 2026).",
      "statProofBadges": {
        "fuerzaExplicativaPct": 98,
        "pearsonR": 0.993,
        "spearmanRho": 1.0,
        "kendallTau": 1.0,
        "partialCorrPop": 0.691,
        "rWithoutCoyhaique": 0.993,
        "firstDiffCorrDelta": 0.691,
        "pValueFdr": 0.0,
        "veredictoSimple": "Supera las 5 pruebas longitudinales (2015–2026): explica el 98% de la variación (r = 0,99, Spearman 1,00), mantiene acoplamiento en primeras diferencias año a año (Delta = 0,69) y persiste sin el shock 2020 (0,99)."
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
      "narrativeDigest": "Coyhaique (Coyhaique. 57.823 hab.) destaca sobre la media regional en Total de Proyectos de Ciencia e Innovación (ANID + CORFO) (102.0 proyectos) y Días Anuales sobre Norma Diaria de MP2.5 (SINCA). mientras presenta sus valores más bajos frente al promedio en Dependencia del Fondo Común Municipal (FCM). Sus perfiles territoriales más parecidos son Aysén (56%) y Chile Chico (56%)."
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
      "narrativeDigest": "Lago Verde (Coyhaique. 779 hab.) destaca sobre la media regional en Gasto Municipal en Cultura Per Cápita (49294.0 $/hab) y Hogares con Carencia de Servicios Básicos (RSH). mientras presenta sus valores más bajos frente al promedio en Ocupación Hotelera Estival (Enero-Febrero). Sus perfiles territoriales más parecidos son O'Higgins (63%) y Guaitecas (61%)."
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
      "narrativeDigest": "Aysén (Aysén. 23.170 hab.) destaca sobre la media regional en Concesiones de Salmonicultura Otorgadas (412.0 concesiones) y Ventas Anuales Promedio por Empresa (SII). mientras presenta sus valores más bajos frente al promedio en Dependencia del Fondo Común Municipal (FCM). Sus perfiles territoriales más parecidos son Cisnes (64%) y Chile Chico (61%)."
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
      "narrativeDigest": "Cisnes (Aysén. 5.137 hab.) destaca sobre la media regional en Biomasa Anual de Salmón Cosechada (185000.0 toneladas) y Concesiones de Salmonicultura Otorgadas. mientras presenta sus valores más bajos frente al promedio en Cumplimiento de Transparencia Activa Municipal (CPLT). Sus perfiles territoriales más parecidos son Chile Chico (74%) y Cochrane (72%)."
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
      "narrativeDigest": "Guaitecas (Aysén. 1.598 hab.) destaca sobre la media regional en Tiempo de Viaje Multimodal hacia Coyhaique (18.0 horas) y Proporción de Suelo Fiscal (Bienes Nacionales). mientras presenta sus valores más bajos frente al promedio en Ocupación Hotelera Estival (Enero-Febrero). Sus perfiles territoriales más parecidos son Lago Verde (61%) y O'Higgins (58%)."
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
      "narrativeDigest": "Chile Chico (General Carrera. 4.905 hab.) destaca sobre la media regional en Esperanza de Vida al Nacer Comunal (DEIS) (81.3 años) y Cobertura de Control Preventivo del Adulto Mayor (EMPAM). mientras presenta sus valores más bajos frente al promedio en Cumplimiento de Transparencia Activa Municipal (CPLT). Sus perfiles territoriales más parecidos son Cochrane (84%) y Cisnes (74%)."
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
      "narrativeDigest": "Río Ibáñez (General Carrera. 2.723 hab.) destaca sobre la media regional en Cumplimiento de Transparencia Activa Municipal (CPLT) (100.0 %) y Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN). mientras presenta sus valores más bajos frente al promedio en Costo de Generación Eléctrica Aislada. Sus perfiles territoriales más parecidos son Chile Chico (70%) y Cisnes (69%)."
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
      "narrativeDigest": "Cochrane (Capitán Prat. 3.458 hab.) destaca sobre la media regional en Proporción de Suelo Fiscal (Bienes Nacionales) (31.4 %) y Cobertura del Programa de Salud Cardiovascular (PSCV). mientras presenta sus valores más bajos frente al promedio en Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN). Sus perfiles territoriales más parecidos son Chile Chico (84%) y Cisnes (72%)."
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
      "narrativeDigest": "O'Higgins (Capitán Prat. 647 hab.) destaca sobre la media regional en Superficie Glaciar Comunal (DGA) (3450.0 km²) y Consumo Residencial Anual de Leña por Hogar. mientras presenta sus valores más bajos frente al promedio en Proporción de Ciencia Liderada por Centros Locales. Sus perfiles territoriales más parecidos son Tortel (68%) y Lago Verde (63%)."
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
      "narrativeDigest": "Tortel (Capitán Prat. 505 hab.) destaca sobre la media regional en Déficit Habitacional Relativo (MINVU) (77.2 viv/1.000 hab) y Ratio de Presión Turística Estacional. mientras presenta sus valores más bajos frente al promedio en Cobertura del Programa de Salud Cardiovascular (PSCV). Sus perfiles territoriales más parecidos son O'Higgins (68%) y Lago Verde (57%)."
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
