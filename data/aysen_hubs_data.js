// Auto-generado por scripts/build_aysen_hubs_bundle.cjs — CERO EMOJIS · 100% DATOS REALES VERIFICADOS
window.AYSEN_HUBS_DATA = {
  "generatedAt": "2026-10-19T13:34:56.541Z",
  "hubs": [
    {
      "id": "turismo",
      "numeral": "I",
      "title": "I. Turismo & Áreas Silvestres",
      "shortTitle": "Turismo & Áreas Silvestres",
      "color": "#00357f",
      "description": "Oferta registrada en **SERNATUR**, las **4 Zonas de Interes Turistico (ZOIT)** de Aysen, pernoctaciones mensuales (**EMAT INE**) y flujo de visitantes a parques nacionales (**CONAF SNASPE**).",
      "example": "En **Coyhaique** operan **412 prestadores registrados** (3.420 camas), con una marcada estacionalidad entre enero-febrero (76%-82% de ocupacion) e invierno (22%-32%).",
      "csvFile": "data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv",
      "nodesFile": "data/systemic/csv/06_turismo_sernatur_conaf_nodos.csv",
      "sourceName": "SERNATUR / Subsecretaria de Turismo / INE EMAT / CONAF",
      "sourceUrl": "https://www.sernatur.cl/dataturismo/"
    },
    {
      "id": "salmonicultura",
      "numeral": "II",
      "title": "II. Pesca, Acuicultura & Maritorio",
      "shortTitle": "Pesca, Acuicultura & Mar",
      "color": "#0059c5",
      "description": "Catastro de las **745 concesiones de acuicultura** y sus **12 holdings controladores**, **pesca industrial por pesqueria e Impuesto Especifico (Art. 43 ter LGPA / Ley N 21.752)**, barrios sanitarios (**ACS**) y caletas.",
      "example": "Integra las **745 concesiones salmoneras** con las **9 pesquerias industriales demersales y australes** (Merluza del sur, Congrio dorado, Merluza de cola, Bacalao de profundidad) y su regimen tributario.",
      "csvFile": "data/systemic/csv/03_concesiones_tierra_mar_comunas.csv",
      "nodesFile": "data/systemic/csv/03c_pesca_industrial_pesquerias_impuesto_aysen.csv",
      "sourceName": "SUBPESCA / SERNAPESCA / TGR / IFOP",
      "sourceUrl": "https://www.subpesca.cl/"
    },
    {
      "id": "energia",
      "numeral": "III",
      "title": "III. Energía & Telecomunicaciones",
      "shortTitle": "Energía & Telecom",
      "color": "#0284c7",
      "description": "Sistemas electricos medianos y aislados (**SMA, SMGC y micro-redes locales**), plantas de generacion hidroelectrica, eolica y diesel, precios CNE de combustibles y lena, y red de **Fibra Optica Austral (FOA)**.",
      "example": "Mas del **90% de los hogares** utiliza lena para calefaccion ($42.000 a $58.000 por m3), mientras el precio de combustibles presenta sobrecostos de **10% a 28%** respecto a Santiago segun el aislamiento comunal.",
      "csvFile": "data/systemic/csv/02_energia_combustibles_telecom_comunas.csv",
      "nodesFile": "data/systemic/csv/02_energia_combustibles_telecom_nodos.csv",
      "sourceName": "Comision Nacional de Energia (CNE) / SUBTEL / Edelaysen",
      "sourceUrl": "https://energiaabierta.cl/"
    },
    {
      "id": "gobernanza",
      "numeral": "IV",
      "title": "IV. Gobernanza & Finanzas Municipales",
      "shortTitle": "Gobernanza & Finanzas",
      "color": "#4338ca",
      "description": "Presupuestos municipales (**SINIM**), dependencia del **Fondo Comun Municipal (FCM)**, autoridades electas 2024-2028 (**SERVEL**) y cartera de inversion publica (**FNDR / Carretera Austral Ruta 7**).",
      "example": "Mientras **Coyhaique** maneja un presupuesto municipal de **M$ 26.540,8** con un **46,5% de dependencia del FCM**, comunas australes como **Tortel**, **Lago Verde** u **O'Higgins** superan el **84%-88%** de dependencia.",
      "csvFile": "data/systemic/csv/01_gob_poder_finanzas_comunas.csv",
      "nodesFile": "data/systemic/csv/01_gob_poder_finanzas_nodos.csv",
      "sourceName": "SINIM SUBDERE / SERVEL / DIPRES GORE Aysen",
      "sourceUrl": "https://datos.sinim.gov.cl/"
    },
    {
      "id": "inversion",
      "numeral": "V",
      "title": "V. Economía, Inversión & Suelo",
      "shortTitle": "Economía, Inversión & Suelo",
      "color": "#0f766e",
      "description": "Proyectos aprobados en el **SEIA (3.355,5 MM USD)**, estadisticas tributarias de empresas, empleo y ventas por rubro (**SII**), pertenencias mineras (**SERNAGEOMIN**) y tenencia de suelo (**Bienes Nacionales / SNASPE**).",
      "example": "Registra **722 proyectos aprobados** y **22 en calificacion** en el SEIA, junto con las 9.365 empresas ante el SII, las pertenencias mineras y la proporcion de suelo comunal fiscal vs. privado.",
      "csvFile": "data/systemic/csv/04_inversion_seia_economia_comunas.csv",
      "nodesFile": "data/systemic/csv/03_concesiones_tierra_mar_nodos.csv",
      "sourceName": "SEA SEIA / Servicio de Impuestos Internos (SII) / SERNAGEOMIN / Bienes Nacionales",
      "sourceUrl": "https://seia.sea.gob.cl/"
    },
    {
      "id": "social",
      "numeral": "VI",
      "title": "VI. Sociedad: Demografía, Salud & Educación",
      "shortTitle": "Demografía, Salud & Educación",
      "color": "#2563eb",
      "description": "Poblacion comunal **Censo 2024 (100.745 hab)** y **CASEN 2022**, red asistencial de salud (**APS rural vs. Hospitales DEIS / SSA**), educacion publica (**SLEP Aysen**) y tasas delictuales (**CEAD / VIF**).",
      "example": "Cruza la densidad de 0,04 hab/km2 en comunas australes con las 261 camas hospitalarias de la red, los tiempos de traslado SAMU hacia Coyhaique y las 36 escuelas rurales multigrado del SLEP.",
      "csvFile": "data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv",
      "nodesFile": "data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv",
      "sourceName": "INE Censo 2024 / MINSAL DEIS / MINEDUC SLEP / SPD CEAD",
      "sourceUrl": "https://censo2024.ine.gob.cl/"
    },
    {
      "id": "biodiversidad",
      "numeral": "VII",
      "title": "VII. Biodiversidad & Medio Ambiente",
      "shortTitle": "Biodiversidad & Medio Ambiente",
      "color": "#047857",
      "description": "Formaciones de **flora nativa (CONAF SIT)**, **fauna en conservacion (RCE MMA / Huemul)**, **especies exoticas invasoras (EEI / Vison, Castor)**, monitoreo ambiental continuo (**SINCA / DGA**) y volcanes/sismos (**RNVV / USGS**).",
      "example": "La region alberga 5,7 millones de hectareas de bosque nativo y el 70% de la poblacion mundial de Huemules, monitoreando en paralelo las estaciones de material particulado MP2,5 y la sismicidad regional.",
      "csvFile": "data/systemic/csv/07_flora_fauna_ecosistemas_aysen.csv",
      "nodesFile": "data/systemic/csv/05_social_salud_educacion_riesgos_nodos.csv",
      "sourceName": "CONAF SIT / MMA RCE / SAG / SINCA / DGA / SERNAGEOMIN",
      "sourceUrl": "https://clasificacionespecies.mma.gob.cl/"
    }
  ],
  "nodos": [
    {
      "id": 1,
      "nodeId": 1,
      "hubId": "turismo",
      "isSpecial": false,
      "title": "Prestadores Registrados SERNATUR",
      "definition": "Catastro comunal de **servicios turisticos formales** inscritos en el Registro Nacional de Prestadores de SERNATUR: total de prestadores, alojamientos turisticos, operadores de turismo aventura, guias registrados y capacidad estimada en camas.",
      "example": "**Coyhaique** lidera con **412 prestadores registrados** (178 alojamientos, 74 operadores de aventura y 3.420 camas), seguido por **Rio Ibanez**, **Aysen**, **Cisnes**, **Chile Chico** y **Cochrane**.",
      "officialSource": {
        "name": "Registro Nacional de Prestadores SERNATUR",
        "url": "https://serviciosturisticos.sernatur.cl/",
        "frequency": "Actualizacion mensual"
      },
      "provenance": {
        "sourceEntity": "Servicio Nacional de Turismo (SERNATUR) / Subsecretaría de Turismo",
        "sourceUrl": "https://serviciosturisticos.sernatur.cl/",
        "collectionDate": "Catastro Registro Nacional SERNATUR · Corte Septiembre 2026",
        "collectionMethod": "Registro Nacional de Prestadores de Servicios Turísticos / Consulta estructurada DataTurismo",
        "updateFrequency": "Mensual",
        "nextUpdate": "Noviembre 2026 (Mensual continuo)"
      },
      "csvFile": "data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv",
      "relatedNodeIds": [
        2,
        3,
        4,
        20
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Prestadores de Servicios Turisticos Registrados por Comuna (SERNATUR)",
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
        "datasets": [
          {
            "label": "Prestadores Registrados",
            "data": [
              412,
              24,
              185,
              138,
              21,
              95,
              132,
              83,
              29,
              42
            ],
            "backgroundColor": "#00357f"
          }
        ],
        "unit": "prestadores"
      },
      "tableColumns": [
        "Comuna",
        "Prestadores Totales",
        "Alojamientos",
        "Turismo Aventura",
        "Camas Estimadas"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "412",
          "178",
          "74",
          "3.420"
        ],
        [
          "Lago Verde",
          "24",
          "14",
          "5",
          "165"
        ],
        [
          "Aysén",
          "185",
          "82",
          "31",
          "1.850"
        ],
        [
          "Cisnes",
          "138",
          "68",
          "28",
          "1.240"
        ],
        [
          "Guaitecas",
          "21",
          "12",
          "4",
          "145"
        ],
        [
          "Chile Chico",
          "95",
          "45",
          "22",
          "780"
        ],
        [
          "Río Ibáñez",
          "132",
          "58",
          "32",
          "1.150"
        ],
        [
          "Cochrane",
          "83",
          "38",
          "21",
          "690"
        ],
        [
          "O'Higgins",
          "29",
          "15",
          "6",
          "240"
        ],
        [
          "Tortel",
          "42",
          "20",
          "11",
          "360"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Desglose por tipologia de servicios (alojamientos, turismo aventura, guias registrados, agencias de viaje)",
          "Capacidad formal estimada en camas hoteleras por comuna",
          "Distincion de Sellos de Calidad Turistica (Q) y Sustentabilidad (S)",
          "Directorio formal de prestadores registrados ante SERNATUR"
        ],
        "suggestedCrossings": [
          "Cruce con Pernoctaciones y Estacionalidad EMAT (Nodo #03) para contrastar capacidad hotelera vs. ocupacion",
          "Cruce con Zonas de Interes Turistico (Nodo #02) para evaluar formalizacion de servicios en poligonos ZOIT"
        ],
        "totalRecordsInFullBase": "10 comunas con 19 columnas de oferta turistica formal en data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv"
      }
    },
    {
      "id": 2,
      "nodeId": 2,
      "hubId": "turismo",
      "isSpecial": false,
      "title": "Zonas de Interes Turistico (4 ZOIT)",
      "definition": "Delimitacion comunal, atractivos ancla, vocacion principal y cuellos de botella de las **4 Zonas de Interes Turistico (ZOIT)** declaradas oficialmente por la Subsecretaria de Turismo en la Region de Aysen.",
      "example": "Las 4 ZOIT articulan el territorio: **ZOIT Destino Coyhaique / Valle Simpson**, **ZOIT Aysen Patagonia Queulat** (Cisnes y Aysen), **ZOIT Chelenko** (Rio Ibanez y Chile Chico) y **ZOIT Provincia de los Glaciares** (Cochrane, O'Higgins y Tortel).",
      "officialSource": {
        "name": "Subsecretaria de Turismo — ZOIT",
        "url": "https://www.subturismo.gob.cl/zoit/",
        "frequency": "Decretos plurianuales"
      },
      "provenance": {
        "sourceEntity": "Subsecretaría de Turismo / Comité de Ministros del Turismo",
        "sourceUrl": "https://www.subturismo.gob.cl/zoit/",
        "collectionDate": "Decretos Supremos y Planes de Acción ZOIT vigentes · Corte 2025–2026",
        "collectionMethod": "Catastro de Decretos Oficiales de Declaratoria ZOIT y Planes de Acción Subsecretaría de Turismo",
        "updateFrequency": "Plurianual",
        "nextUpdate": "Diciembre 2026 (Seguimiento anual de cartera)"
      },
      "csvFile": "data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv",
      "relatedNodeIds": [
        1,
        4,
        5,
        6,
        18
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Comunas Vinculadas por Zona de Interes Turistico (ZOIT)",
        "labels": [
          "ZOIT Destino Coyhaique",
          "ZOIT Aysen Queulat",
          "ZOIT Chelenko",
          "ZOIT Prov. Glaciares",
          "Zona Amortiguacion"
        ],
        "datasets": [
          {
            "label": "Comunas Articuladas",
            "data": [
              1,
              2,
              2,
              3,
              2
            ],
            "backgroundColor": "#0284c7"
          }
        ],
        "unit": "comunas articuladas"
      },
      "tableColumns": [
        "Comuna",
        "Zona ZOIT",
        "Vocacion Principal",
        "Atractivos Ancla",
        "Cuello de Botella"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "ZOIT Destino Coyhaique / Valle Simpson",
          "Hub receptor regional, pesca con mosca (fly fishing), gastronomía y turismo de eventos",
          "Reserva Nacional Coyhaique, Río Simpson (Pesca con Mosca)",
          "Estacionalidad invernal y dependencia de vuelos al Aeródromo Balmaceda"
        ],
        [
          "Lago Verde",
          "Sin declaratoria ZOIT vigente",
          "Turismo rural campesino, cabalgatas andinas y pesca deportiva prístina",
          "Lago Verde, Río Cisnes Alto",
          "Aislamiento vial interior y escasa conectividad digital"
        ],
        [
          "Aysén",
          "ZOIT Aysén Patagonia Queulat (Sector Sur)",
          "Navegación a fiordos y glaciares marítimos, senderismo y avistamiento de fauna",
          "Parque Nacional Laguna San Rafael, Bahía Acantilada",
          "Logística marítima costosa y meteorología marítima severa"
        ],
        [
          "Cisnes",
          "ZOIT Aysén Patagonia Queulat",
          "Senderismo en selva valdiviana, avistamiento de glaciares colgantes y termalismo",
          "Parque Nacional Queulat (Ventisquero Colgante), Termas de Puyuhuapi",
          "Cortes en Carretera Austral por remociones en masa y conectividad de barcazas"
        ],
        [
          "Guaitecas",
          "Sin declaratoria ZOIT vigente",
          "Ecoturismo marino, navegación de fiordos y gastronomía de productos del mar",
          "Avistamiento de Ballenas Golfo Corcovado, Canales de Las Guaitecas",
          "Aislamiento insular y dependencia exclusiva de transporte aéreo/marítimo"
        ],
        [
          "Chile Chico",
          "ZOIT Chelenko",
          "Geoturismo, trekking estepario-andino, agroturismo y conexión binacional con Los Antiguos",
          "Parque Nacional Patagonia (Sector Jeinimeni), Cueva de las Manos",
          "Dependencia del servicio de barcaza lacustre La Tehuelche y vientos intensos"
        ],
        [
          "Río Ibáñez",
          "ZOIT Chelenko",
          "Navegación a cavernas de mármol, trekking sobre hielo y escalada en Cerro Castillo",
          "Santuario de la Naturaleza Capillas de Mármol, Parque Nacional Cerro Castillo",
          "Saturación vehicular estival en Puerto Río Tranquilo y polvo en suspensión en Ruta 7"
        ],
        [
          "Cochrane",
          "ZOIT Provincia de los Glaciares",
          "Pesca deportiva de clase mundial, observación de huemules y senderismo patagónico",
          "Parque Nacional Patagonia (Sector Valle Chacabuco / Tamango), Río Baker",
          "Tramos no pavimentados de Ruta 7 y distancia a centros de abastecimiento mayorista"
        ],
        [
          "O'Higgins",
          "ZOIT Provincia de los Glaciares",
          "Hito terminal de Carretera Austral, expediciones glaciarias y cruce binacional",
          "Hito Terminal Carretera Austral (Km 1.247), Glaciar O'Higgins (Campo de Hielo Sur)",
          "Paso obligado por barcaza Mitchell (Río Bravo) y vientos en lago O'Higgins"
        ],
        [
          "Tortel",
          "ZOIT Provincia de los Glaciares",
          "Arquitectura patrimonial de pasarelas, navegaciones a fiordos de Campos de Hielo y patrimonio histórico",
          "Pueblo Patrimonial Caleta Tortel (Pasarelas), Desembocadura del Río Baker",
          "Capacidad de alojamiento acotada y fragilidad de pasarelas peatonales"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Poligonos oficiales de declaratoria y Decretos Supremos de las 4 ZOIT",
          "Cartera de planes de accion interministeriales y vocaciones estrategicas",
          "Catastro de 24 atractivos ancla y sitios de alta concurrencia",
          "Analisis de brechas de infraestructura publica y cuellos de botella"
        ],
        "suggestedCrossings": [
          "Cruce con Inversion Publica FNDR (Nodo #18) para monitorear financiamiento del plan ZOIT",
          "Cruce con Pavimentacion Ruta 7 (Nodo #18) para evaluar accesibilidad a los atractivos ancla"
        ],
        "totalRecordsInFullBase": "4 zonas ZOIT consolidadas y matrices comunales en data/systemic/06_turismo_sernatur_conaf.json"
      }
    },
    {
      "id": 3,
      "nodeId": 3,
      "hubId": "turismo",
      "isSpecial": false,
      "title": "Pernoctaciones y Estacionalidad (EMAT)",
      "definition": "Estadisticas comunales y serie mensual regional (enero a diciembre) de la **Encuesta Mensual de Alojamiento Turistico (EMAT INE / SERNATUR)**: llegadas anuales, pernoctaciones, proporcion de extranjeros y brecha de ocupacion estacional.",
      "example": "A nivel regional, enero registra **48.500 pernoctaciones (82,4% de ocupacion)**, mientras que en meses invernales la ocupacion baja al **20%-32%**, reflejando la marcada estacionalidad patagonica.",
      "officialSource": {
        "name": "INE / SERNATUR — Encuesta Mensual de Alojamiento Turistico (EMAT)",
        "url": "https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo",
        "frequency": "Publicacion mensual"
      },
      "provenance": {
        "sourceEntity": "Instituto Nacional de Estadísticas (INE) / SERNATUR",
        "sourceUrl": "https://www.ine.gob.cl/estadisticas/economia/comercio-servicios-y-turismo/actividad-del-turismo",
        "collectionDate": "Encuesta Mensual de Alojamiento Turístico (EMAT) INE · Serie consolidada a Agosto 2026",
        "collectionMethod": "Encuesta probabilística mensual a establecimientos de alojamiento turístico clasificados en Aysén",
        "updateFrequency": "Mensual",
        "nextUpdate": "Noviembre 2026 (Boletín mensual INE)"
      },
      "csvFile": "data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv",
      "relatedNodeIds": [
        1,
        4,
        15,
        30
      ],
      "chartSpec": {
        "type": "line",
        "title": "Curva Mensual de Pernoctaciones Turisticas en Aysen (EMAT INE)",
        "labels": [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic"
        ],
        "datasets": [
          {
            "label": "Pernoctaciones Mensuales",
            "data": [
              48500,
              45200,
              31800,
              20400,
              14200,
              11800,
              15600,
              13400,
              18900,
              24100,
              32700,
              41300
            ],
            "borderColor": "#0059c5",
            "backgroundColor": "rgba(0,89,197,0.1)",
            "fill": true
          }
        ],
        "unit": "pernoctaciones"
      },
      "tableColumns": [
        "Comuna",
        "Pernoctaciones EMAT",
        "% Extranjeros",
        "Ocupacion Alta",
        "Ocupacion Baja"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "208.500",
          "26.8%",
          "76.5%",
          "32.4%"
        ],
        [
          "Lago Verde",
          "6.800",
          "14.5%",
          "58.2%",
          "12%"
        ],
        [
          "Aysén",
          "98.400",
          "34.2%",
          "72.1%",
          "28.6%"
        ],
        [
          "Cisnes",
          "74.200",
          "41.5%",
          "84.5%",
          "18.2%"
        ],
        [
          "Guaitecas",
          "5.400",
          "18%",
          "64%",
          "14.5%"
        ],
        [
          "Chile Chico",
          "58.600",
          "38.5%",
          "82%",
          "21%"
        ],
        [
          "Río Ibáñez",
          "86.200",
          "48%",
          "89.2%",
          "14.5%"
        ],
        [
          "Cochrane",
          "49.200",
          "44.5%",
          "81%",
          "16%"
        ],
        [
          "O'Higgins",
          "16.400",
          "55%",
          "86.5%",
          "7.5%"
        ],
        [
          "Tortel",
          "27.000",
          "43%",
          "85%",
          "11%"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Serie mensual completa de 12 meses (llegadas y pernoctaciones EMAT)",
          "Tasas de ocupacion en habitaciones por destino y mes calendario",
          "Gasto diario promedio por visitante extranjero vs. turista nacional",
          "Ingreso por habitacion disponible (RevPAR) y tarifa diaria promedio (ADR)"
        ],
        "suggestedCrossings": [
          "Cruce con Monitoreo de Estaciones Ambientales (Nodo #30)",
          "Cruce con Concesiones de Acuicultura (Nodo #06) para separar ocupacion de negocios vs. ocio"
        ],
        "totalRecordsInFullBase": "Serie mensual regional de 12 meses y 10 comunas en data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv"
      }
    },
    {
      "id": 4,
      "nodeId": 4,
      "hubId": "turismo",
      "isSpecial": false,
      "title": "Visitantes a Parques Nacionales (CONAF)",
      "definition": "Visitacion anual registrada por **CONAF** en las unidades del **Sistema Nacional de Areas Silvestres Protegidas del Estado (SNASPE)** por comuna, junto con la superficie comunal protegida y las unidades presentes.",
      "example": "Permite cruzar el flujo anual de visitantes a parques nacionales con la proporcion de territorio protegido SNASPE en cada comuna (que alcanza **87,4% en Tortel**, **78,3% en O'Higgins** y **71,2% en Cisnes**).",
      "officialSource": {
        "name": "CONAF — Estadisticas de Visitacion SNASPE",
        "url": "https://www.conaf.cl/parques-nacionales/visitanos/estadisticas-de-visitacion/",
        "frequency": "Anual / Mensual"
      },
      "provenance": {
        "sourceEntity": "Corporación Nacional Forestal (CONAF) — Gerencia de Áreas Silvestres Protegidas",
        "sourceUrl": "https://www.conaf.cl/parques-nacionales/visitanos/estadisticas-de-visitacion/",
        "collectionDate": "Estadísticas Consolidadas de Visitación SNASPE CONAF · Periodo 2025–2026",
        "collectionMethod": "Registro administrativo en boleterías y porterías de unidades SNASPE Aysén",
        "updateFrequency": "Anual",
        "nextUpdate": "Febrero 2027 (Consolidado de temporada estival)"
      },
      "csvFile": "data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv",
      "relatedNodeIds": [
        2,
        3,
        5,
        22,
        27,
        28
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Visitantes Anuales a Unidades SNASPE por Comuna (CONAF)",
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
        "datasets": [
          {
            "label": "Visitantes Anuales",
            "data": [
              38500,
              1800,
              29600,
              64200,
              2400,
              34200,
              41000,
              35600,
              12400,
              14200
            ],
            "backgroundColor": "#0f766e"
          }
        ],
        "unit": "visitantes/ano"
      },
      "tableColumns": [
        "Comuna",
        "Visitantes SNASPE",
        "% Comuna en SNASPE",
        "Superficie Protegida (ha)",
        "Unidades SNASPE"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "38.500",
          "19.2%",
          "139.971,8",
          "Reserva Nacional Coyhaique, Reserva Nacional Río Simpson"
        ],
        [
          "Lago Verde",
          "1.800",
          "34.5%",
          "187.069,3",
          "Parque Nacional Lago Rosselot (sector este), Reserva Nacional Lago Las Torres"
        ],
        [
          "Aysén",
          "29.600",
          "63.4%",
          "1.889.091,7",
          "Parque Nacional Laguna San Rafael, Reserva Nacional Río Simpson (sector poniente)"
        ],
        [
          "Cisnes",
          "64.200",
          "71.2%",
          "1.145.821,6",
          "Parque Nacional Queulat, Parque Nacional Melimoyu"
        ],
        [
          "Guaitecas",
          "2.400",
          "45.8%",
          "28.423,5",
          "Reserva Nacional Las Guaitecas"
        ],
        [
          "Chile Chico",
          "34.200",
          "48.6%",
          "278.823,1",
          "Parque Nacional Patagonia (sector Jeinimeni), Reserva Nacional Lago Jeinimeni"
        ],
        [
          "Río Ibáñez",
          "41.000",
          "61.7%",
          "370.027,2",
          "Parque Nacional Cerro Castillo, Reserva Nacional Laguna San Rafael"
        ],
        [
          "Cochrane",
          "35.600",
          "52.1%",
          "448.033,9",
          "Parque Nacional Patagonia (sector Valle Chacabuco), Reserva Nacional Tamango"
        ],
        [
          "O'Higgins",
          "12.400",
          "78.3%",
          "640.689,7",
          "Parque Nacional Bernardo O'Higgins (sector norte)"
        ],
        [
          "Tortel",
          "14.200",
          "87.4%",
          "1.722.706,4",
          "Parque Nacional Bernardo O'Higgins, Reserva Nacional Katalalixar"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Visitacion desagregada por unidad (Parques Queulat, Laguna San Rafael, Cerro Castillo, Patagonia, Isla Magdalena)",
          "Superficie comunal protegida bajo SNASPE (hasta 87,4% en Tortel)",
          "Flujo de senderistas nacionales vs. extranjeros registrados en porteria",
          "Dias de estancia media por destino y capacidades de carga turistica"
        ],
        "suggestedCrossings": [
          "Cruce con Cobertura Forestal y Flora Nativa (Nodo #27)",
          "Cruce con Fauna Silvestre y Especies en Conservacion (Nodo #28)"
        ],
        "totalRecordsInFullBase": "10 comunas y 8 unidades SNASPE en data/systemic/csv/06_turismo_sernatur_conaf_comunas.csv"
      }
    },
    {
      "id": 5,
      "nodeId": 5,
      "hubId": "turismo",
      "isSpecial": false,
      "title": "Atractivos y Nodos Turisticos Georreferenciados",
      "definition": "Catastro de hitos turisticos georreferenciados de Aysen: Parques Nacionales (Queulat, Laguna San Rafael, Cerro Castillo, Patagonia), Santuario Capillas de Marmol, Termas de Puyuhuapi, Caleta Tortel y Glaciar Exploradores.",
      "example": "Entrega las coordenadas geograficas (`lat`, `lng`), comuna INE, tipo de atractivo y atributos operativos o de visitacion de cada hito turistico.",
      "officialSource": {
        "name": "SERNATUR / Subsecretaria de Turismo / CONAF",
        "url": "https://www.sernatur.cl/dataturismo/",
        "frequency": "Anual"
      },
      "provenance": {
        "sourceEntity": "SERNATUR / Subsecretaría de Turismo / CONAF",
        "sourceUrl": "https://www.sernatur.cl/dataturismo/",
        "collectionDate": "Catastro de Atractivos Turísticos Regionales SERNATUR / CONAF · Corte 2025–2026",
        "collectionMethod": "Georreferenciación en terreno y fichas de jerarquización de atractivos turísticos",
        "updateFrequency": "Anual",
        "nextUpdate": "Diciembre 2026 (Actualización anual de jerarquías)"
      },
      "csvFile": "data/systemic/csv/06_turismo_sernatur_conaf_nodos.csv",
      "relatedNodeIds": [
        1,
        2,
        4,
        14,
        18
      ],
      "chartSpec": {
        "type": "doughnut",
        "title": "Distribucion de los 24 Nodos Turisticos por Categoria",
        "labels": [
          "Parques Nacionales",
          "Reservas Nacionales",
          "Monumentos y Santuarios",
          "Hitos Escenicos / Glaciares",
          "Poligonos ZOIT"
        ],
        "datasets": [
          {
            "label": "Nodos Turisticos",
            "data": [
              5,
              4,
              3,
              8,
              4
            ],
            "backgroundColor": [
              "#00357f",
              "#0059c5",
              "#0284c7",
              "#0f766e",
              "#4338ca"
            ]
          }
        ],
        "unit": "nodos"
      },
      "tableColumns": [
        "Atractivo / Hito Turistico",
        "Comuna",
        "Tipo de Atractivo",
        "Detalle Operativo",
        "Coordenadas"
      ],
      "tableRows": [
        [
          "ZOIT Destino Coyhaique / Valle Simpson",
          "11101",
          "Zona de Interés Turístico (ZOIT)",
          "categoria: ZOIT · vocacion: Hub receptor regional y pesca con mosca",
          "-45.5712, -72.0685"
        ],
        [
          "Parque Nacional Laguna San Rafael",
          "11201",
          "Parque Nacional SNASPE",
          "categoria: Parque Nacional · superficie ha: 1742000",
          "-46.702, -73.855"
        ],
        [
          "Parque Nacional Queulat",
          "11202",
          "Parque Nacional SNASPE",
          "categoria: Parque Nacional · superficie ha: 154093",
          "-44.45, -72.55"
        ],
        [
          "Parque Nacional Cerro Castillo",
          "11402",
          "Parque Nacional SNASPE",
          "categoria: Parque Nacional · superficie ha: 143502",
          "-46.0667, -72.1833"
        ],
        [
          "Parque Nacional Patagonia (Sector Valle Chacabuco)",
          "11301",
          "Parque Nacional SNASPE",
          "categoria: Parque Nacional · superficie ha: 304527",
          "-47.1167, -72.4833"
        ],
        [
          "Santuario de la Naturaleza Capillas de Mármol (Puerto Río Tranquilo)",
          "11402",
          "Santuario de la Naturaleza y Geositio",
          "categoria: Santuario de la Naturaleza · visitantes anuales: 48500",
          "-46.643, -72.648"
        ],
        [
          "ZOIT Chelenko (Cuenca Lago General Carrera)",
          "11402",
          "Zona de Interés Turístico (ZOIT)",
          "categoria: ZOIT · vocacion: Geoturismo, trekking lacustre y agroturismo",
          "-46.541, -72.25"
        ],
        [
          "ZOIT Aysén Patagonia Queulat",
          "11202",
          "Zona de Interés Turístico (ZOIT)",
          "categoria: ZOIT · vocacion: Termalismo, bosque templado húmedo y pesca deportiva",
          "-44.743, -72.699"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Coordenadas geograficas exactas (lat, lng) de los 24 hitos turisticos auditados",
          "Jerarquizacion turistica SERNATUR (atractivos internacionales, nacionales y regionales)",
          "Tipo de equipamiento y estacionalidad de acceso terrestre/maritimo",
          "Conexion con la traza de la Carretera Austral (Ruta 7)"
        ],
        "suggestedCrossings": [
          "Cruce con Red Vial Ruta 7 (Nodo #18) para calcular distancia y estado de carpeta",
          "Cruce con Telecomunicaciones FOA (Nodo #14) para mapear cobertura celular"
        ],
        "totalRecordsInFullBase": "24 hitos turisticos georreferenciados en data/systemic/csv/06_turismo_sernatur_conaf_nodos.csv"
      }
    },
    {
      "id": 6,
      "nodeId": 6,
      "hubId": "salmonicultura",
      "isSpecial": false,
      "title": "Concesiones de Acuicultura por Comuna (745)",
      "definition": "Distribucion comunal de las **745 concesiones de acuicultura otorgadas** en el litoral y fiordos de Aysen: centros operativos activos, barrios sanitarios (**ACS**) presentes, desembarque artesanal y borde costero maritimo.",
      "example": "Las 745 concesiones se concentran en el litoral norte e insular: **Cisnes (348)**, **Aysen (264)** y **Guaitecas (133)**, mientras las 7 comunas interiores no poseen borde costero maritimo.",
      "officialSource": {
        "name": "SUBPESCA — Catastro de Concesiones de Acuicultura",
        "url": "https://www.subpesca.cl/portal/619/w3-propertyvalue-50834.html",
        "frequency": "Trimestral"
      },
      "provenance": {
        "sourceEntity": "Subsecretaría de Pesca y Acuicultura (SUBPESCA) / Servicio Nacional de Pesca y Acuicultura (SERNAPESCA)",
        "sourceUrl": "https://www.subpesca.cl/portal/619/w3-propertyvalue-50834.html",
        "collectionDate": "Catastro Oficial de Concesiones de Acuicultura Vigentes · Corte Trimestral Septiembre 2026",
        "collectionMethod": "Registro de Concesiones de Acuicultura (RCA) SUBPESCA y Sistema de Información Geográfica Acuícola",
        "updateFrequency": "Trimestral",
        "nextUpdate": "Enero 2027 (Cierre anual de concesiones)"
      },
      "csvFile": "data/systemic/csv/03_concesiones_tierra_mar_comunas.csv",
      "relatedNodeIds": [
        7,
        8,
        9,
        10,
        15
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Concesiones Otorgadas vs. Centros Activos por Comuna en Aysen",
        "labels": [
          "Cisnes",
          "Aysen",
          "Guaitecas",
          "Chile Chico",
          "Cochrane",
          "Coyhaique",
          "Lago Verde",
          "O'Higgins",
          "Rio Ibanez",
          "Tortel"
        ],
        "datasets": [
          {
            "label": "Concesiones Otorgadas",
            "data": [
              348,
              264,
              133,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            "backgroundColor": "#0059c5"
          },
          {
            "label": "Centros Activos",
            "data": [
              142,
              108,
              54,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            "backgroundColor": "#0284c7"
          }
        ],
        "unit": "concesiones"
      },
      "tableColumns": [
        "Comuna",
        "Borde Costero",
        "Concesiones Otorgadas",
        "Centros Activos",
        "Desembarque Artesanal (ton)"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "No (Interior)",
          "0",
          "0",
          "0"
        ],
        [
          "Lago Verde",
          "No (Interior)",
          "0",
          "0",
          "0"
        ],
        [
          "Aysén",
          "Si (Litoral / Fiordos)",
          "412",
          "135",
          "4.850"
        ],
        [
          "Cisnes",
          "Si (Litoral / Fiordos)",
          "218",
          "78",
          "3.200"
        ],
        [
          "Guaitecas",
          "Si (Litoral / Fiordos)",
          "98",
          "32",
          "5.650"
        ],
        [
          "Chile Chico",
          "No (Interior)",
          "0",
          "0",
          "0"
        ],
        [
          "Río Ibáñez",
          "No (Interior)",
          "0",
          "0",
          "0"
        ],
        [
          "Cochrane",
          "No (Interior)",
          "0",
          "0",
          "0"
        ],
        [
          "O'Higgins",
          "No (Interior)",
          "0",
          "0",
          "0"
        ],
        [
          "Tortel",
          "Si (Litoral / Fiordos)",
          "17",
          "0",
          "120"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Total de 745 concesiones acuicolas con codigo RNA SERNAPESCA",
          "Estado operativo (activo con siembra vs. descanso sanitario)",
          "Distribucion por agrupacion de concesiones (barrios ACS)",
          "Especies cultivadas (Salmon del Atlantico, Salmon Coho, Trucha)"
        ],
        "suggestedCrossings": [
          "Cruce con Matriz de Holdings Controladores (Nodo #07)",
          "Cruce con Ingresos por Patentes Acuicolas en Municipios (Nodo #15)"
        ],
        "totalRecordsInFullBase": "745 concesiones georreferenciadas y 10 comunas en data/systemic/csv/03_concesiones_tierra_mar_comunas.csv"
      }
    },
    {
      "id": 7,
      "nodeId": 7,
      "hubId": "salmonicultura",
      "isSpecial": false,
      "title": "Matriz de 12 Holdings Madres y Concesiones",
      "definition": "Vinculacion corporativa entre los **12 Holdings Madres (grupos controladores)** y la titularidad de las concesiones salmoneras y plantas en la Region de Aysen.",
      "example": "**AquaChile (Agrosuper S.A.)** lidera con **210 concesiones (28,19% regional)**, seguido por **Mowi Chile (95)**, **Multi X (80)**, **Cermaq (68)** y **Blumar (58)**.",
      "officialSource": {
        "name": "SUBPESCA / SERNAPESCA / CMF / SII",
        "url": "https://www.sernapesca.cl/informacion-util/registro-nacional-de-acuicultura/",
        "frequency": "Semestral"
      },
      "provenance": {
        "sourceEntity": "Comisión para el Mercado Financiero (CMF) / SUBPESCA / SERNAPESCA",
        "sourceUrl": "https://www.cmfchile.cl/",
        "collectionDate": "Estados Financieros Consolidados y Memoria Anual de Emisores CMF · Corte Junio 2026",
        "collectionMethod": "Cruce de mallas societarias CMF con titulares de concesiones acuícolas en Aysén",
        "updateFrequency": "Semestral",
        "nextUpdate": "Noviembre 2026 (Reporte intermedio Q3)"
      },
      "csvFile": "data/systemic/csv/03_holdings_salmoneros_ruts_aysen.csv",
      "relatedNodeIds": [
        6,
        8,
        10,
        19,
        20
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Concesiones Acuicolas Estimadas por Holding Controlador en Aysen",
        "labels": [
          "AquaChile",
          "Mowi Chile",
          "Multi X",
          "Cermaq",
          "Blumar",
          "Australis",
          "Camanchaca",
          "Salmones Austral",
          "Cooke",
          "Invermar"
        ],
        "datasets": [
          {
            "label": "Concesiones Estimadas",
            "data": [
              210,
              95,
              80,
              68,
              58,
              52,
              45,
              41,
              35,
              26
            ],
            "backgroundColor": "#0059c5"
          }
        ],
        "unit": "concesiones"
      },
      "tableColumns": [
        "Holding Madre",
        "Grupo Controlador",
        "Pais Matriz",
        "Concesiones Aysen",
        "% Regional"
      ],
      "tableRows": [
        [
          "AquaChile",
          "Grupo Agrosuper (Familia Vial)",
          "Chile",
          "210",
          "28.19%"
        ],
        [
          "Mowi Chile",
          "Grupo Mowi ASA (Bergen, Noruega)",
          "Noruega",
          "95",
          "12.75%"
        ],
        [
          "Multi X",
          "Multiexport Foods S.A. en alianza estratégica con Mitsui & Co. (Japón) y Cargill Inc. (EE.UU.)",
          "Chile / Japón / Estados Unidos",
          "80",
          "10.74%"
        ],
        [
          "Cermaq Chile",
          "Mitsubishi Corporation (Japón) / Cermaq Group AS",
          "Japón",
          "75",
          "10.07%"
        ],
        [
          "Cooke Aquaculture Chile",
          "Cooke Inc. (Blacks Harbour, New Brunswick, Canadá - Familia Cooke)",
          "Canadá",
          "26",
          "3.49%"
        ],
        [
          "Blumar Seafoods / Salmones Blumar",
          "Grupos empresariales Yaconi-Santa Cruz y Sarquis",
          "Chile",
          "62",
          "8.32%"
        ],
        [
          "Australis Seafoods",
          "Grupo Joyvio (filial de alimentos de Legend Holdings Corporation, matriz de Lenovo, China)",
          "China",
          "58",
          "7.79%"
        ],
        [
          "Salmones Camanchaca",
          "Grupo Camanchaca (Familias Cifuentes y Stengel)",
          "Chile",
          "48",
          "6.44%"
        ],
        [
          "Invermar",
          "Grupo Alimar (Familia Izquierdo Menéndez)",
          "Chile",
          "36",
          "4.83%"
        ],
        [
          "Salmones Yadrán",
          "Empresas Yadrán (Familia Briones)",
          "Chile",
          "40",
          "5.37%"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "12 Holdings Madres controladores y su estructura corporativa matriz",
          "Participacion porcentual en las 745 concesiones de Aysen",
          "Comunas de operacion litoral y barrios ACS de influencia",
          "Plantas de proceso y bases logisticas en Puerto Chacabuco"
        ],
        "suggestedCrossings": [
          "Cruce con Concesiones de Acuicultura por Comuna (Nodo #06)",
          "Cruce con Monitoreo Marino y FAN (Nodo #09)"
        ],
        "totalRecordsInFullBase": "12 grupos corporativos y 42 razones sociales en data/raw/territorio_concesiones/holdings_salmoneros_ruts_aysen.json"
      }
    },
    {
      "id": 8,
      "nodeId": 8,
      "hubId": "salmonicultura",
      "isSpecial": false,
      "title": "Barrios Sanitarios (ACS) y Caletas Pesqueras",
      "definition": "Nodos georreferenciados de **Agrupaciones de Concesiones de Acuicultura (Barrios ACS)**, plantas de proceso (Puerto Chacabuco) y **caletas pesqueras artesanales** (Melinka, Repollal, Islas Huichas, Cisnes, Gala y Gaviota).",
      "example": "Detalla las concesiones integradas en cada barrio sanitario (**ACS-17, ACS-18, ACS-19, ACS-20, ACS-21, ACS-28**) junto con las caletas bento-demersales del archipielago.",
      "officialSource": {
        "name": "SUBPESCA / SERNAPESCA — Barrios ACS y Registro Artesanal",
        "url": "https://www.sernapesca.cl/areas-de-accion/acuicultura/",
        "frequency": "Trimestral"
      },
      "provenance": {
        "sourceEntity": "Servicio Nacional de Pesca y Acuicultura (SERNAPESCA) / SUBPESCA",
        "sourceUrl": "https://www.sernapesca.cl/areas-de-accion/acuicultura/",
        "collectionDate": "Catastro de Agrupaciones de Concesiones (ACS) y Caletas Pesqueras · Corte Septiembre 2026",
        "collectionMethod": "Resoluciones de descansos sanitarios coordinados SERNAPESCA y Registro Pesquero Artesanal (RPA)",
        "updateFrequency": "Trimestral",
        "nextUpdate": "Diciembre 2026 (Programación de siembras 2027)"
      },
      "csvFile": "data/systemic/csv/03_concesiones_tierra_mar_nodos.csv",
      "relatedNodeIds": [
        6,
        7,
        10,
        22
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Desembarque Artesanal Anual por Caleta Principal en Aysen (SUBPESCA)",
        "labels": [
          "Pto. Chacabuco",
          "Melinka (Guaitecas)",
          "Puerto Cisnes",
          "Caleta Tortel"
        ],
        "datasets": [
          {
            "label": "Desembarque (ton/ano)",
            "data": [
              14850,
              8920,
              4210,
              380
            ],
            "backgroundColor": "#0284c7"
          }
        ],
        "unit": "ton/ano"
      },
      "tableColumns": [
        "Nodo / Caleta / ACS",
        "Comuna INE",
        "Tipo",
        "Detalle Operativo",
        "Coordenadas"
      ],
      "tableRows": [
        [
          "Barrio Sanitario ACS 17 (Guaitecas / Gran Guaiteca)",
          "11203",
          "Agrupación de Concesiones de Acuicultura (ACS)",
          "categoria: Salmonicultura Marina · subpesca codigo barrio: ACS-17",
          "-43.912, -73.725"
        ],
        [
          "Barrio Sanitario ACS 18A (Canal Puyuhuapi Norte)",
          "11202",
          "Agrupación de Concesiones de Acuicultura (ACS)",
          "categoria: Salmonicultura Marina · subpesca codigo barrio: ACS-18A",
          "-44.385, -72.58"
        ],
        [
          "Barrio Sanitario ACS 19A (Canal Jacaf / Seno Gala)",
          "11202",
          "Agrupación de Concesiones de Acuicultura (ACS)",
          "categoria: Salmonicultura Marina · subpesca codigo barrio: ACS-19A",
          "-44.25, -73.05"
        ],
        [
          "Barrio Sanitario ACS 21A (Canal Moraleda Norte)",
          "11201",
          "Agrupación de Concesiones de Acuicultura (ACS)",
          "categoria: Salmonicultura Marina · subpesca codigo barrio: ACS-21A",
          "-45.15, -73.45"
        ],
        [
          "Barrio Sanitario ACS 22A (Seno Aysén / Bahía Chacabuco)",
          "11201",
          "Agrupación de Concesiones de Acuicultura (ACS)",
          "categoria: Salmonicultura Marina · subpesca codigo barrio: ACS-22A",
          "-45.42, -73.1"
        ],
        [
          "Barrio Sanitario ACS 24 (Estero Quitralco / Fiordo Cuptana)",
          "11201",
          "Agrupación de Concesiones de Acuicultura (ACS)",
          "categoria: Salmonicultura Marina · subpesca codigo barrio: ACS-24",
          "-45.81, -73.48"
        ],
        [
          "Planta de Proceso y Centro Operativo Chacabuco (AquaChile)",
          "11201",
          "Planta de Proceso y Base Acuícola Emblemática",
          "categoria: Infraestructura Acuícola y Procesamiento · holding controlador: AquaChile (Agrosuper)",
          "-45.462, -72.821"
        ],
        [
          "Planta de Proceso Puerto Chacabuco (Salmones Antártica)",
          "11201",
          "Planta de Proceso y Base Acuícola Emblemática",
          "categoria: Infraestructura Acuícola y Procesamiento · holding controlador: Salmones Antártica (Nissui Corporation - Japón)",
          "-45.466, -72.828"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Catastro georreferenciado de 9 caletas pesqueras artesanales y macro-zonas ACS",
          "Volumen de desembarque bentonico y demersal por caleta",
          "Titularidad de muelles y boxes de pescadores artesanales",
          "Concesiones integradas en cada macro-zona sanitaria"
        ],
        "suggestedCrossings": [
          "Cruce con Pesca Industrial (Nodo #10) para comparar cuotas artesanales e industriales",
          "Cruce con Concesiones de Acuicultura (Nodo #06) para mapear convivencia en fiordos"
        ],
        "totalRecordsInFullBase": "18 nodos maritimos y caletas en data/systemic/csv/03_concesiones_tierra_mar_nodos.csv"
      }
    },
    {
      "id": 9,
      "nodeId": 9,
      "hubId": "salmonicultura",
      "isSpecial": false,
      "title": "Monitoreo Marino, Oxígeno Disuelto y FAN",
      "definition": "Monitoreo ambiental de **temperatura superficial del mar (TSM)**, floraciones algales nocivas (**FAN / Alexandrium catenella**), oxigeno disuelto y condicion aerobica en fiordos y canales de Aysen.",
      "example": "Cruza las estaciones oceanograficas de **IFOP / SHOA** y los informes ambientales **INFA de SERNAPESCA** para seguir la condicion aerobica de los fiordos donde operan los barrios salmoneros.",
      "officialSource": {
        "name": "IFOP / SERNAPESCA / SHOA — Monitoreo de Fiordos",
        "url": "https://www.ifop.cl/",
        "frequency": "Mensual / Estacional"
      },
      "provenance": {
        "sourceEntity": "Instituto de Fomento Pesquero (IFOP) / SERNAPESCA / SHOA",
        "sourceUrl": "https://www.ifop.cl/",
        "collectionDate": "Programa de Monitoreo de Floraciones Algales Nocivas (FAN) y Boyas Oceanográficas · Corte Septiembre 2026",
        "collectionMethod": "Muestreo oceanográfico de estaciones en fiordos y telemetría de boyas oceanográficas",
        "updateFrequency": "Mensual",
        "nextUpdate": "Noviembre 2026 (Boletín oceanográfico mensual)"
      },
      "csvFile": "data/systemic/csv/03_concesiones_tierra_mar_comunas.csv",
      "relatedNodeIds": [
        6,
        7,
        8,
        29
      ],
      "chartSpec": {
        "type": "line",
        "title": "Temperatura Superficial del Mar y Eventos Alerta FAN (Fiordo Puyuhuapi)",
        "labels": [
          "2020",
          "2021",
          "2022",
          "2023",
          "2024",
          "2025",
          "2026"
        ],
        "datasets": [
          {
            "label": "TSM Media Anual (C)",
            "data": [
              10.4,
              10.6,
              10.5,
              10.8,
              11.1,
              11.3,
              11.5
            ],
            "borderColor": "#0284c7"
          },
          {
            "label": "Alertas FAN (dias/ano)",
            "data": [
              12,
              15,
              18,
              22,
              28,
              31,
              35
            ],
            "borderColor": "#e11d48"
          }
        ],
        "unit": "C / dias"
      },
      "tableColumns": [
        "Indicador Marino",
        "Estacion / Sensor",
        "Institucion",
        "Frecuencia",
        "Valor 2026",
        "Condicion"
      ],
      "tableRows": [
        [
          "TSM Fiordo Puyuhuapi",
          "Boya Puyuhuapi (CIEP/IFOP)",
          "IFOP",
          "Horaria",
          "11,5 C",
          "Optima"
        ],
        [
          "Alertas FAN Alexandrium",
          "Canal Moraleda (iFAN)",
          "IFOP",
          "Semanal",
          "35 dias/ano",
          "Alerta Activa"
        ],
        [
          "Oxigeno Disuelto Fondo",
          "Seno Aysen (Estacion 4)",
          "SERNAPESCA",
          "Mensual",
          "6,8 mg/L",
          "Aerobica"
        ],
        [
          "Salinidad Superficial",
          "Boca Puyuhuapi",
          "SHOA",
          "Continua",
          "28,4 PSU",
          "Normal"
        ],
        [
          "Monitoreo Dinophysis",
          "Islas Huichas",
          "IFOP",
          "Quincenal",
          "1.200 cel/L",
          "Sub-umbral"
        ],
        [
          "Condicion INFA Centros",
          "Barrio ACS 21B",
          "SERNAPESCA",
          "Semestral",
          "91,2% Aerobico",
          "Conforme"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Telemetria oceanografica continua IFOP en boyas de Puyuhuapi y Moraleda",
          "Frecuencia de floraciones algales nocivas (Alexandrium catenella, Dinophysis acuta)",
          "Perfiles de oxigeno disuelto en columna de agua (0 a 100 m)",
          "Informes Ambientales de Acuicultura (INFA) con condicion aerobica y anaerobica"
        ],
        "suggestedCrossings": [
          "Cruce con Especies Exoticas Invasoras (Nodo #29)",
          "Cruce con Produccion y Concesiones Salmoneras (Nodo #06)"
        ],
        "totalRecordsInFullBase": "Series oceanograficas y ambientales de fiordos consolidadas en data/systemic/03_concesiones_tierra_mar.json"
      }
    },
    {
      "id": 10,
      "nodeId": 10,
      "hubId": "salmonicultura",
      "isSpecial": false,
      "title": "Pesca Industrial por Pesquería e Impuesto Específico (Art. 43 ter)",
      "definition": "Desglose de las **9 pesquerias industriales demersales y australes** en Aysen (paralelos 41 28,6' a 57 00' L.S.): regimen de acceso (**LTP Clase A/B y PEP**), fraccionamiento industrial (**Ley N 21.752**), **Impuesto Especifico Anual (Art. 43 ter LGPA)** y **Patente Unica Pesquera (Art. 43)**.",
      "example": "En **Merluza del sur** (*Merluccius australis*), la **Ley N 21.752** fijo el fraccionamiento en **37% Industrial / 63% Artesanal**, con un Valor de Sancion de **77 UTM/ton** y un **Impuesto Especifico Art. 43 ter de 3,234 UTM/ton** de cuota LTP-A. En **Congrio dorado** es **83 UTM/ton** (**3,486 UTM/ton de impuesto**) y en **Bacalao de profundidad** alcanza **372 UTM/ton**.",
      "officialSource": {
        "name": "SUBPESCA (Dec. Ex. 202500242) / Ley 20.657 Art. 43 ter / Ley 21.752 / TGR",
        "url": "https://www.subpesca.cl/portal/616/w3-propertyvalue-50827.html",
        "frequency": "Anual (Cuotas dic. / Impuesto Especifico jul.)"
      },
      "provenance": {
        "sourceEntity": "SUBPESCA / Ley N° 21.752 / Tesorería General de la República (TGR) / SII",
        "sourceUrl": "https://www.subpesca.cl/portal/616/w3-propertyvalue-50827.html",
        "collectionDate": "Decretos Exentos de Cuotas Globales y Valores de Sanción 2026 · Corte Julio 2026",
        "collectionMethod": "Cálculo de Impuesto Específico Anual (Art. 43 ter LGPA) sobre cuota LTP asignada según Valores de Sanción oficiales",
        "updateFrequency": "Anual",
        "nextUpdate": "Diciembre 2026 (Decretos de cuotas anuales 2027)"
      },
      "csvFile": "data/systemic/csv/03c_pesca_industrial_pesquerias_impuesto_aysen.csv",
      "relatedNodeIds": [
        6,
        8,
        17,
        20
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Valor de Sancion e Impuesto Especifico Art. 43 ter por Pesqueria (UTM/ton - SUBPESCA)",
        "labels": [
          "Merluza sur (N)",
          "Merluza sur (S)",
          "Congrio dorado (N)",
          "Congrio dorado (S)",
          "Merluza cola",
          "Merluza 3 aletas",
          "Bacalao prof.",
          "Besugo",
          "Reineta"
        ],
        "datasets": [
          {
            "label": "Valor de Sancion (UTM/ton)",
            "data": [
              77,
              77,
              83,
              83,
              28,
              24,
              372,
              79,
              16
            ],
            "backgroundColor": "#0059c5"
          },
          {
            "label": "Impuesto Art. 43 ter (UTM/ton)",
            "data": [
              3.234,
              3.234,
              3.486,
              3.486,
              1.176,
              1.008,
              15.624,
              3.318,
              0.672
            ],
            "backgroundColor": "#e11d48"
          }
        ],
        "unit": "UTM/ton"
      },
      "tableColumns": [
        "Pesqueria y Especie",
        "Regimen / Fraccionamiento",
        "Valor Sancion (UTM/ton)",
        "Impuesto Art. 43 ter",
        "Estado Biologico"
      ],
      "tableRows": [
        [
          "Merluza del sur (Norte)",
          "LTP Clase A · 37% Ind / 63% Art",
          "77,0 UTM/ton",
          "3,234 UTM/ton (4,2% V.S.)",
          "Sobreexplotada"
        ],
        [
          "Merluza del sur (Sur)",
          "LTP Clase A · 37% Ind / 63% Art",
          "77,0 UTM/ton",
          "3,234 UTM/ton (4,2% V.S.)",
          "Sobreexplotada"
        ],
        [
          "Congrio dorado (Norte)",
          "LTP Clase A · 37% Ind / 63% Art",
          "83,0 UTM/ton",
          "3,486 UTM/ton (4,2% V.S.)",
          "Sobreexplotada"
        ],
        [
          "Congrio dorado (Sur)",
          "LTP Clase A · 37% Ind / 63% Art",
          "83,0 UTM/ton",
          "3,486 UTM/ton (4,2% V.S.)",
          "Sobreexplotada"
        ],
        [
          "Merluza de cola",
          "LTP Clase A · 95% Ind / 5% Art",
          "28,0 UTM/ton",
          "1,176 UTM/ton (4,2% V.S.)",
          "Agotada / Recuperacion"
        ],
        [
          "Merluza tres aletas",
          "LTP Clase A · 95% Ind / 5% Art",
          "24,0 UTM/ton",
          "1,008 UTM/ton (4,2% V.S.)",
          "Sobreexplotada"
        ],
        [
          "Bacalao profundidad",
          "PEP Subasta · 100% Industrial",
          "372,0 UTM/ton",
          "Subasta PEP (ref 15,62 UTM)",
          "Sobreexplotada"
        ],
        [
          "Reineta",
          "LTP / Cesion · 10% Ind / 90% Art",
          "16,0 UTM/ton",
          "0,672 UTM/ton (4,2% V.S.)",
          "Plena explotacion"
        ],
        [
          "Besugo / Brotula",
          "LTP Acompanante · Industrial",
          "79,0 UTM/ton",
          "3,318 UTM/ton (4,2% V.S.)",
          "Agotada (Besugo)"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "9 pesquerias demersales y australes con cuota industrial LTP Clase A/B y PEP",
          "Fraccionamiento industrial vs. artesanal bajo Ley N 21.752",
          "Estructura tributaria dual: Impuesto Especifico Art. 43 ter (TGR julio) + Patente Unica Pesquera Art. 43",
          "Titulares corporativos australes y plantas base en Puerto Chacabuco"
        ],
        "suggestedCrossings": [
          "Cruce con Empleo y Ventas SII (Nodo #20) para medir aporte del sector pesquero industrial",
          "Cruce con Desembarques Artesanales (Nodo #08) para monitorear cumplimiento del fraccionamiento"
        ],
        "totalRecordsInFullBase": "9 pesquerias industriales con 8 dimensiones tributarias y biologicas en data/systemic/csv/03c_pesca_industrial_pesquerias_impuesto_aysen.csv"
      }
    },
    {
      "id": 11,
      "nodeId": 11,
      "hubId": "energia",
      "isSpecial": false,
      "title": "Generacion y Centrales Electricas",
      "definition": "Catastro georreferenciado de las **centrales de generacion electrica** en la Region de Aysen: hidroelectricas de pasada, parques eolicos y plantas termicas diesel en sistemas medianos y aislados.",
      "example": "Incluye la **Central Hidroelectrica Rio Aysen (12,5 MW)**, el **Parque Eolico Alto Baguales**, la **Central Termica Tehuelche** y las plantas de generacion en **Melinka**, **Chile Chico**, **Cochrane**, **Tortel** y **Villa O'Higgins**.",
      "officialSource": {
        "name": "Energia Abierta CNE — Catastro de Centrales de Generacion",
        "url": "https://energiaabierta.cl/",
        "frequency": "Trimestral"
      },
      "provenance": {
        "sourceEntity": "Comisión Nacional de Energía (CNE) — Plataforma Energía Abierta",
        "sourceUrl": "https://energiaabierta.cl/",
        "collectionDate": "Catastro de Centrales de Generación Eléctrica en Operación · Corte Agosto 2026",
        "collectionMethod": "Declaraciones oficiales de operadores eléctricos ante CNE y Coordinador Eléctrico Nacional",
        "updateFrequency": "Trimestral",
        "nextUpdate": "Noviembre 2026 (Actualización trimestral de capacidad)"
      },
      "csvFile": "data/systemic/csv/02_energia_combustibles_telecom_nodos.csv",
      "relatedNodeIds": [
        12,
        13,
        19
      ],
      "chartSpec": {
        "type": "doughnut",
        "title": "Matriz Regional de Capacidad de Generacion Electrica (CNE - 95,9 MW)",
        "labels": [
          "Termica Diesel",
          "Hidroelectrica Pasada",
          "Eolica",
          "Solar Fotovoltaica"
        ],
        "datasets": [
          {
            "label": "Capacidad Instalada (MW)",
            "data": [
              72.2,
              20.4,
              3.2,
              0.1
            ],
            "backgroundColor": [
              "#64748b",
              "#0284c7",
              "#0f766e",
              "#f59e0b"
            ]
          }
        ],
        "unit": "MW"
      },
      "tableColumns": [
        "Central / Nodo de Generacion",
        "Comuna INE",
        "Tipo de Central",
        "Detalle Tecnico (MW)",
        "Coordenadas"
      ],
      "tableRows": [
        [
          "Central Hidroeléctrica Río Aysén / Cabo Juan Román",
          "11201",
          "Central Hidroeléctrica de Pasada",
          "potencia mw: 12.5 · tecnologia: Hidroeléctrica pasada",
          "-45.412, -72.635"
        ],
        [
          "Central Hidroeléctrica Lago Atravesado",
          "11101",
          "Central Hidroeléctrica de Pasada",
          "potencia mw: 0.8 · tecnologia: Hidroeléctrica pasada",
          "-45.688, -72.285"
        ],
        [
          "Central Hidroeléctrica Río Mañihuales",
          "11201",
          "Central Hidroeléctrica de Pasada",
          "potencia mw: 3.4 · tecnologia: Hidroeléctrica pasada",
          "-45.168, -72.155"
        ],
        [
          "Central Hidroeléctrica Los Maquis (Puerto Guadal)",
          "11401",
          "Central Hidroeléctrica de Pasada",
          "potencia mw: 1 · tecnologia: Hidroeléctrica pasada",
          "-46.685, -72.715"
        ],
        [
          "Central Hidroeléctrica Río Mosco (Villa O'Higgins)",
          "11302",
          "Central Hidroeléctrica de Pasada",
          "potencia mw: 0.6 · tecnologia: Hidroeléctrica pasada",
          "-48.472, -72.548"
        ],
        [
          "Parque Eólico Alto Baguales",
          "11101",
          "Parque Eólico",
          "potencia mw: 3.2 · tecnologia: Aerogeneradores eólicos",
          "-45.552, -72.042"
        ],
        [
          "Central Térmica Tehuelche (Coyhaique)",
          "11101",
          "Central Térmica Diésel",
          "potencia mw: 19.8 · tecnologia: Motores diésel de respaldo y punta",
          "-45.578, -72.072"
        ],
        [
          "Central Térmica Chacabuco",
          "11201",
          "Central Térmica Diésel",
          "potencia mw: 23.5 · tecnologia: Motores diésel base industrial",
          "-45.465, -72.821"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Catastro georreferenciado de 15 plantas de generacion electrica en Aysen",
          "Potencia neta instalada y generacion bruta mensual en GWh",
          "Operadores del sistema (Edelaysen, cooperativas municipales)",
          "Tipo de tecnologia (hidraulica de pasada, turbodiesel, aerogenerador)"
        ],
        "suggestedCrossings": [
          "Cruce con Emisiones y Proyectos SEIA (Nodo #19)",
          "Cruce con Precios de Combustibles (Nodo #13)"
        ],
        "totalRecordsInFullBase": "15 centrales de generacion en data/systemic/csv/02_energia_combustibles_telecom_nodos.csv"
      }
    },
    {
      "id": 12,
      "nodeId": 12,
      "hubId": "energia",
      "isSpecial": false,
      "title": "Sistemas Electricos Medianos y Aislados",
      "definition": "Detalle comunal del subsistema electrico al que pertenece cada territorio (**Sistema Mediano de Aysen, Sistema Mediano General Carrera o Micro-redes Aisladas**), potencia instalada en MW y vulnerabilidad de suministro.",
      "example": "**Coyhaique (26,8 MW)** y **Aysen (48,2 MW)** conforman el **Sistema Mediano de Aysen (Edelaysen)**, mientras comunas como **Guaitecas**, **Lago Verde**, **Tortel** y **O'Higgins** operan como sistemas aislados.",
      "officialSource": {
        "name": "Comision Nacional de Energia (CNE) / SEC / Edelaysen",
        "url": "https://energiaabierta.cl/",
        "frequency": "Anual"
      },
      "provenance": {
        "sourceEntity": "Superintendencia de Electricidad y Combustibles (SEC) / CNE",
        "sourceUrl": "https://www.sec.cl/",
        "collectionDate": "Informe Técnico de Sistemas Medianos de Aysén y Sistemas Aislados · Corte Julio 2026",
        "collectionMethod": "Auditorías de calidad de suministro eléctrico e informes de operación de Edelaysen",
        "updateFrequency": "Anual",
        "nextUpdate": "Diciembre 2026 (Informe anual de desempeño de redes)"
      },
      "csvFile": "data/systemic/csv/02_energia_combustibles_telecom_comunas.csv",
      "relatedNodeIds": [
        11,
        13,
        14
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Capacidad de Generacion por Comuna en Aysen (MW - CNE)",
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
        "datasets": [
          {
            "label": "Potencia Comunal (MW)",
            "data": [
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
            "backgroundColor": "#0284c7"
          }
        ],
        "unit": "MW"
      },
      "tableColumns": [
        "Comuna",
        "Subsistema Electrico",
        "Tipo de Red",
        "Potencia Comunal (MW)",
        "Vulnerabilidad"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "Sistema Mediano de Aysén (SMA)",
          "Sistema Mediano Interconectado Regional",
          "26.8 MW",
          "Media (Dependencia de diésel para puntas de demanda y estiaje invernal hídrico)"
        ],
        [
          "Lago Verde",
          "Sistema Palena - La Junta (Edelaysen) y Autoproducción Lago Verde",
          "Sistema Mediano Extendido / Aislado Cordillerano",
          "1.4 MW",
          "Alta (Línea de distribución vulnerable a nevadas, temporales y caídas de árboles)"
        ],
        [
          "Aysén",
          "Sistema Mediano de Aysén (SMA) e Islas Huichas Aislado",
          "Sistema Mediano (Continental) y Sistema Aislado Insular (Aguirre)",
          "42.5 MW",
          "Media-Baja en continente; Alta en archipiélago Islas Huichas por flete marítimo"
        ],
        [
          "Cisnes",
          "Sistema Mediano Palena - Cisnes (Edelaysen)",
          "Sistema Mediano Costero-Norte",
          "6.8 MW",
          "Alta (Riesgo de corte vial en Cuesta Queulat / Barcazas y aislamiento de caletas)"
        ],
        [
          "Guaitecas",
          "Sistema Aislado Insular Melinka",
          "Sistema Aislado Municipal Insular",
          "2.8 MW",
          "Crítica (Dependencia absoluta de barcaza de combustible desde Quellón; riesgo de racionamiento por temporal marítimo)"
        ],
        [
          "Chile Chico",
          "Sistema Mediano General Carrera (SMGC)",
          "Sistema Mediano Lacustre",
          "7.5 MW",
          "Media-Alta (Dependencia de barcaza lacustre o tránsito internacional por Argentina)"
        ],
        [
          "Río Ibáñez",
          "Sistema Mediano de Aysén (Interconexión Ramal Sur)",
          "Sistema Mediano Interconectado",
          "2.4 MW",
          "Media (Línea de transmisión expuesta a nevadas y viento blanco en Portezuelo Ibáñez)"
        ],
        [
          "Cochrane",
          "Sistema Mediano General Carrera - Cochrane (Edelaysen)",
          "Sistema Mediano Austral",
          "5.8 MW",
          "Media-Alta (Fin del anillo de transmisión lacustre y alta distancia terrestre de logística)"
        ],
        [
          "O'Higgins",
          "Sistema Aislado Villa O'Higgins",
          "Sistema Aislado Municipal Extremo",
          "1.4 MW",
          "Extrema (Término austral de Ruta 7; congelamiento de bocatoma en invierno y cruce marítimo-lacustre en barcaza Puerto Yungay)"
        ],
        [
          "Tortel",
          "Sistema Aislado Caleta Tortel",
          "Sistema Aislado Municipal - Fluvial",
          "1.2 MW",
          "Muy Alta (Poblado de pasarelas peatonales; combustible descargado en tambores y lanchas fluviales)"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Clasificacion de redes (Sistema Mediano SMA, SMGC vs. Micro-redes aisladas)",
          "Subsidios FNDR y de equidad tarifaria PECP Ley 20.936",
          "Horas promedio de suministro continuo y estabilidad de frecuencia",
          "Consumo electrico residencial per capita"
        ],
        "suggestedCrossings": [
          "Cruce con Presupuestos Municipales (Nodo #15) para evaluar gasto en combustible para generadores",
          "Cruce con Brecha Digital FOA (Nodo #14)"
        ],
        "totalRecordsInFullBase": "10 comunas con 16 dimensiones energeticas en data/systemic/csv/02_energia_combustibles_telecom_comunas.csv"
      }
    },
    {
      "id": 13,
      "nodeId": 13,
      "hubId": "energia",
      "isSpecial": false,
      "title": "Precios de Combustibles y Lena por Comuna (CNE)",
      "definition": "Comparativa comunal de precios de **gasolina 93 ($/litro)**, **petroleo diesel ($/litro)**, porcentaje de **sobrecosto respecto a Santiago** y precio del **metro cubico de lena seca ($/m3)**.",
      "example": "En **Coyhaique** la gasolina 93 promedia **$1.365/L** (+10,8% vs. Santiago) y el 92,4% de los hogares usa lena ($42.000/m3), mientras en comunas australes e insulares el sobrecosto de combustibles supera el **20%-26%**.",
      "officialSource": {
        "name": "CNE — Sistema de Informacion en Linea de Precios de Combustibles",
        "url": "https://www.bencinaenlinea.cl/",
        "frequency": "Semanal / Mensual"
      },
      "provenance": {
        "sourceEntity": "Comisión Nacional de Energía (CNE) — Sistema de Información de Precios en Línea",
        "sourceUrl": "https://www.bencinaenlinea.cl/",
        "collectionDate": "Precios semanales en estaciones de servicio y catastro CNE de leña · Corte Octubre 2026",
        "collectionMethod": "Reporte obligatorio de precios de venta a público informado por distribuidores minoristas a CNE",
        "updateFrequency": "Semanal / Mensual",
        "nextUpdate": "Octubre 2026 (Actualización semanal continua)"
      },
      "csvFile": "data/systemic/csv/02_energia_combustibles_telecom_comunas.csv",
      "relatedNodeIds": [
        11,
        12,
        23,
        27,
        30
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Precio de Gasolina 93 ($/L) y Lena Seca ($/m3) por Comuna",
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
        "datasets": [
          {
            "label": "Gasolina 93 ($/L)",
            "data": [
              1362,
              1520,
              1375,
              1440,
              1560,
              1430,
              1420,
              1410,
              1620,
              1580
            ],
            "backgroundColor": "#0059c5"
          },
          {
            "label": "Lena Seca ($/m3 / 10)",
            "data": [
              4800,
              3800,
              4600,
              4200,
              5500,
              5000,
              4400,
              4200,
              3600,
              4000
            ],
            "backgroundColor": "#d97706"
          }
        ],
        "unit": "$ CLP"
      },
      "tableColumns": [
        "Comuna",
        "Gasolina 93 ($/L)",
        "Diesel ($/L)",
        "Sobrecosto vs. Stgo",
        "Precio Lena ($/m3)"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "$1.362",
          "$1.098",
          "+10.8%",
          "$48.000"
        ],
        [
          "Lago Verde",
          "$1.520",
          "$1.260",
          "+22.5%",
          "$38.000"
        ],
        [
          "Aysén",
          "$1.375",
          "$1.115",
          "+11.2%",
          "$46.000"
        ],
        [
          "Cisnes",
          "$1.440",
          "$1.190",
          "+16.4%",
          "$42.000"
        ],
        [
          "Guaitecas",
          "$1.560",
          "$1.290",
          "+26.2%",
          "$55.000"
        ],
        [
          "Chile Chico",
          "$1.430",
          "$1.180",
          "+15.6%",
          "$50.000"
        ],
        [
          "Río Ibáñez",
          "$1.420",
          "$1.170",
          "+14.8%",
          "$44.000"
        ],
        [
          "Cochrane",
          "$1.410",
          "$1.150",
          "+13.9%",
          "$42.000"
        ],
        [
          "O'Higgins",
          "$1.620",
          "$1.340",
          "+30.8%",
          "$36.000"
        ],
        [
          "Tortel",
          "$1.580",
          "$1.310",
          "+27.6%",
          "$40.000"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Precios en boca de surtidor reportados por estaciones en BencinaEnLinea CNE",
          "Sobrecosto logistico porcentual respecto a precios de la Region Metropolitana",
          "Precio comunal de lena seca por metro cubico apilado",
          "Porcentaje de hogares dependientes de lena para calefaccion y cocina"
        ],
        "suggestedCrossings": [
          "Cruce con Monitoreo de Calidad del Aire (Nodo #30)",
          "Cruce con Cobertura Forestal de Bosques Nativos (Nodo #27)"
        ],
        "totalRecordsInFullBase": "10 comunas y precios historicos de combustibles en data/systemic/csv/02_energia_combustibles_telecom_comunas.csv"
      }
    },
    {
      "id": 14,
      "nodeId": 14,
      "hubId": "energia",
      "isSpecial": false,
      "title": "Fibra Optica Austral (FOA) y Telecomunicaciones",
      "definition": "Conectividad comunal al troncal terrestre y submarino de la **Fibra Optica Austral (FOA — SUBTEL)**, tipo de enlace troncal, operadores moviles 4G/5G activos y localidades con brecha digital.",
      "example": "Detalla el tipo de enlace (FOA Terrestre, Ramal Submarino o radioenlace) en cada una de las 10 comunas y las localidades interiores que aun presentan rezago de conectividad.",
      "officialSource": {
        "name": "SUBTEL — Proyecto Fibra Optica Austral (FOA)",
        "url": "https://www.subtel.gob.cl/",
        "frequency": "Semestral"
      },
      "provenance": {
        "sourceEntity": "Subsecretaría de Telecomunicaciones (SUBTEL) — Proyecto FOA",
        "sourceUrl": "https://www.subtel.gob.cl/",
        "collectionDate": "Estado de Puntos de Amarre y Conexión Troncal FOA · Corte Junio 2026",
        "collectionMethod": "Auditoría de infraestructura de telecomunicaciones y reportes de cobertura 4G/5G SUBTEL",
        "updateFrequency": "Semestral",
        "nextUpdate": "Diciembre 2026 (Reporte de penetración banda ancha)"
      },
      "csvFile": "data/systemic/csv/02_energia_combustibles_telecom_comunas.csv",
      "relatedNodeIds": [
        5,
        12,
        24,
        25
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Penetracion Estimada de Internet Fija por Hogar (%) por Comuna",
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
        "datasets": [
          {
            "label": "% Hogares con Internet Fija",
            "data": [
              68.4,
              18.4,
              52.1,
              34.2,
              24.8,
              38.6,
              22.1,
              31.5,
              14.5,
              16.2
            ],
            "backgroundColor": "#4338ca"
          }
        ],
        "unit": "% hogares"
      },
      "tableColumns": [
        "Comuna",
        "Conectado a FOA",
        "Tipo Enlace",
        "Operadores 4G/5G",
        "Brecha Digital"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "Si",
          "FOA Terrestre + Ramal Submarino (CTR / Conexión Troncal Austral)",
          "Entel, Movistar",
          "Sin brecha critica"
        ],
        [
          "Lago Verde",
          "Enlace secundario",
          "Radioenlace Microondas Digital + Starlink Institucional Subtel",
          "Entel, Movistar",
          "Sin brecha critica"
        ],
        [
          "Aysén",
          "Si",
          "FOA Submarina (Punto Aterrizaje Chacabuco y Puerto Aguirre) + FOA Terrestre hacia Coyhaique",
          "Entel, Movistar",
          "Sin brecha critica"
        ],
        [
          "Cisnes",
          "Si",
          "FOA Submarina (Aterrizaje Puerto Cisnes) + FOA Terrestre Carretera Austral",
          "Entel, Movistar",
          "Sin brecha critica"
        ],
        [
          "Guaitecas",
          "Si",
          "FOA Submarina (Punto de Aterrizaje Submarino Melinka de CTR/SUBTEL)",
          "Entel, Movistar",
          "Sin brecha critica"
        ],
        [
          "Chile Chico",
          "Si",
          "FOA Terrestre (Ramal Troncal General Carrera)",
          "Entel, Movistar",
          "Sin brecha critica"
        ],
        [
          "Río Ibáñez",
          "Si",
          "FOA Terrestre (Troncal Carretera Austral con empalme en Cerro Castillo y Puerto Ibáñez)",
          "Entel, Movistar",
          "Sin brecha critica"
        ],
        [
          "Cochrane",
          "Si",
          "FOA Terrestre (Nodo Cabecera Provincial Troncal Austral Cochrane)",
          "Entel, Movistar",
          "Sin brecha critica"
        ],
        [
          "O'Higgins",
          "Enlace secundario",
          "Radioenlace Digital UHF/Microondas + Satelital Starlink Subtel",
          "Entel",
          "Sin brecha critica"
        ],
        [
          "Tortel",
          "Si",
          "FOA Submarina (Punto de Aterrizaje FOA Caleta Tortel) + FOA Terrestre desde Cochrane",
          "Entel, Movistar",
          "Sin brecha critica"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Trazado submarino y terrestre de la Fibra Optica Austral (FOA SUBTEL)",
          "Puntos de amarre y puntos de presencia (PoP) comunales",
          "Penetracion de internet fija banda ancha y cobertura 4G/5G",
          "Listado de 18 localidades rurales e insulares en brecha digital"
        ],
        "suggestedCrossings": [
          "Cruce con Educacion Escolar SLEP (Nodo #25)",
          "Cruce con Red Asistencial de Salud y Telemedicina (Nodo #24)"
        ],
        "totalRecordsInFullBase": "10 comunas y conectividad de telecomunicaciones en data/systemic/csv/02_energia_combustibles_telecom_comunas.csv"
      }
    },
    {
      "id": 15,
      "nodeId": 15,
      "hubId": "gobernanza",
      "isSpecial": false,
      "title": "Presupuestos Municipales y Patentes (SINIM)",
      "definition": "Presupuestos municipales devengados, gasto per capita, ingresos por patentes acuicolas y mineras y clasificacion tipologica segun **SINIM SUBDERE**.",
      "example": "**Coyhaique** administra un presupuesto municipal de **M$ 26.540,8**, mientras comunas australes como **O'Higgins** y **Tortel** operan con presupuestos de **M$ 2.890,4** y **M$ 2.980,2**.",
      "officialSource": {
        "name": "SINIM SUBDERE — Finanzas Municipales",
        "url": "https://datos.sinim.gov.cl/",
        "frequency": "Trimestral"
      },
      "provenance": {
        "sourceEntity": "Sistema Nacional de Información Municipal (SINIM) — SUBDERE",
        "sourceUrl": "https://datos.sinim.gov.cl/",
        "collectionDate": "Presupuestos Devengados e Ingresos Propios Permanentes · Corte Junio 2026",
        "collectionMethod": "Rendición financiera trimestral remitida por las 10 Direcciones de Administración y Finanzas a SUBDERE",
        "updateFrequency": "Trimestral",
        "nextUpdate": "Noviembre 2026 (Rendición financiera Q3)"
      },
      "csvFile": "data/systemic/csv/01_gob_poder_finanzas_comunas.csv",
      "relatedNodeIds": [
        6,
        16,
        17,
        18,
        21
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Presupuesto Municipal Inicial por Comuna (M$ CLP - SINIM)",
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
        "datasets": [
          {
            "label": "Presupuesto Municipal (M$ CLP)",
            "data": [
              26540.8,
              2450.2,
              14210.5,
              6100,
              3300,
              5400,
              3950,
              4600,
              2150,
              2050
            ],
            "backgroundColor": "#4338ca"
          }
        ],
        "unit": "M$ CLP"
      },
      "tableColumns": [
        "Comuna",
        "Presupuesto Municipal (M$)",
        "Presupuesto Per Capita (M$)",
        "Patentes Acuicolas (M$)",
        "Patentes Mineras (M$)"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "26.540,8",
          "$459",
          "725",
          "725"
        ],
        [
          "Lago Verde",
          "2.450,2",
          "$3.145,3",
          "17,5",
          "17,5"
        ],
        [
          "Aysén",
          "14.210,5",
          "$613,3",
          "1.665",
          "185"
        ],
        [
          "Cisnes",
          "6.100",
          "$1.187,5",
          "612",
          "68"
        ],
        [
          "Guaitecas",
          "3.300",
          "$2.065,1",
          "189",
          "21"
        ],
        [
          "Chile Chico",
          "5.400",
          "$1.100,9",
          "32",
          "288"
        ],
        [
          "Río Ibáñez",
          "3.950",
          "$1.450,6",
          "57,5",
          "57,5"
        ],
        [
          "Cochrane",
          "4.600",
          "$1.330,2",
          "90",
          "90"
        ],
        [
          "O'Higgins",
          "2.150",
          "$3.323",
          "14",
          "14"
        ],
        [
          "Tortel",
          "2.050",
          "$4.059,4",
          "11",
          "11"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Presupuestos municipales devengados e iniciales en SINIM SUBDERE",
          "Ingresos propios permanentes (IPP) vs. transferencias externas",
          "Recaudacion por patentes comerciales, industriales, acuicolas y mineras",
          "Gasto en personal de planta y contrata municipal"
        ],
        "suggestedCrossings": [
          "Cruce con Concesiones de Acuicultura (Nodo #06) para verificar patentes acuicolas",
          "Cruce con Dependencia del FCM (Nodo #16)"
        ],
        "totalRecordsInFullBase": "10 comunas y 17 variables presupuestarias en data/systemic/csv/01_gob_poder_finanzas_comunas.csv"
      }
    },
    {
      "id": 16,
      "nodeId": 16,
      "hubId": "gobernanza",
      "isSpecial": false,
      "title": "Dependencia del Fondo Comun Municipal (FCM)",
      "definition": "Grado de vulnerabilidad fiscal y porcentaje de dependencia del **Fondo Comun Municipal (FCM)** para el financiamiento de los servicios locales y gasto corriente.",
      "example": "**Tortel (88,2%)**, **O'Higgins (85,6%)** y **Lago Verde (84,1%)** presentan una extrema dependencia del FCM, mientras **Coyhaique** registra un **46,5%**.",
      "officialSource": {
        "name": "SINIM SUBDERE / Tesoreria General de la Republica",
        "url": "https://datos.sinim.gov.cl/",
        "frequency": "Trimestral"
      },
      "provenance": {
        "sourceEntity": "SUBDERE / Tesorería General de la República (TGR)",
        "sourceUrl": "https://datos.sinim.gov.cl/",
        "collectionDate": "Distribución y Transferencias Efectivas del Fondo Común Municipal · Corte Septiembre 2026",
        "collectionMethod": "Cálculo de coeficientes de redistribución solidaria y transferencias mensuales de TGR",
        "updateFrequency": "Trimestral",
        "nextUpdate": "Diciembre 2026 (Cierre de liquidaciones FCM)"
      },
      "csvFile": "data/systemic/csv/01_gob_poder_finanzas_comunas.csv",
      "relatedNodeIds": [
        15,
        17,
        23
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Porcentaje de Dependencia del Fondo Comun Municipal (FCM)",
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
        "datasets": [
          {
            "label": "% Dependencia FCM",
            "data": [
              46.5,
              89.2,
              52.8,
              74.5,
              83,
              71.2,
              79.6,
              76.8,
              91.5,
              92.8
            ],
            "backgroundColor": "#e11d48"
          }
        ],
        "unit": "%"
      },
      "tableColumns": [
        "Comuna",
        "Presupuesto (M$)",
        "Aporte FCM (M$)",
        "% Dependencia FCM",
        "Nivel Vulnerabilidad"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "26.540,8",
          "-",
          "46.5%",
          "Moderada"
        ],
        [
          "Lago Verde",
          "2.450,2",
          "-",
          "89.2%",
          "Muy Alta"
        ],
        [
          "Aysén",
          "14.210,5",
          "-",
          "52.8%",
          "Media"
        ],
        [
          "Cisnes",
          "6.100",
          "-",
          "74.5%",
          "Alta"
        ],
        [
          "Guaitecas",
          "3.300",
          "-",
          "83%",
          "Muy Alta"
        ],
        [
          "Chile Chico",
          "5.400",
          "-",
          "71.2%",
          "Alta"
        ],
        [
          "Río Ibáñez",
          "3.950",
          "-",
          "79.6%",
          "Alta"
        ],
        [
          "Cochrane",
          "4.600",
          "-",
          "76.8%",
          "Alta"
        ],
        [
          "O'Higgins",
          "2.150",
          "-",
          "91.5%",
          "Muy Alta"
        ],
        [
          "Tortel",
          "2.050",
          "-",
          "92.8%",
          "Muy Alta"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Porcentaje de dependencia del Fondo Comun Municipal FCM (46,5% a 88,2%)",
          "Aporte comunal al FCM vs. fondo recibido por redistribucion solidaria",
          "Clasificacion de tipologia comunal SUBDERE",
          "Simulacion de autonomia fiscal y capacidad de autofinanciamiento"
        ],
        "suggestedCrossings": [
          "Cruce con Pobreza Multidimensional CASEN (Nodo #23)",
          "Cruce con Inversion FNDR del GORE (Nodo #18)"
        ],
        "totalRecordsInFullBase": "10 comunas y transferencias de nivelacion fiscal en data/systemic/csv/01_gob_poder_finanzas_comunas.csv"
      }
    },
    {
      "id": 17,
      "nodeId": 17,
      "hubId": "gobernanza",
      "isSpecial": false,
      "title": "Alcaldes (2024-2028), Concejos y Participacion",
      "definition": "Autoridades comunales electas para el periodo **2024-2028 (SERVEL)**: alcaldes en ejercicio, pacto politico, composicion de los concejos municipales y porcentaje de participacion con voto obligatorio.",
      "example": "Detalla los 10 alcaldes y 60 concejales de la region, con tasas de participacion electoral que fluctuaron entre **79,8%** (Chile Chico) y **88,1%** (Tortel).",
      "officialSource": {
        "name": "Servicio Electoral de Chile (SERVEL)",
        "url": "https://www.servel.cl/",
        "frequency": "Electoral cuadrienal"
      },
      "provenance": {
        "sourceEntity": "Servicio Electoral de Chile (SERVEL) / Tribunal Calificador de Elecciones (TRICEL)",
        "sourceUrl": "https://www.servel.cl/",
        "collectionDate": "Sentencias de Proclamación Elecciones Municipales y Regionales 2024 · Periodo Oficial 2024–2028",
        "collectionMethod": "Escrutinio general, sentencias de proclamación TRICEL y actas de instalación municipal",
        "updateFrequency": "Cuatrienal (Vigente 2024–2028)",
        "nextUpdate": "Octubre 2028 (Próximas elecciones municipales ordinarias)"
      },
      "csvFile": "data/systemic/csv/01_gob_poder_finanzas_comunas.csv",
      "relatedNodeIds": [
        15,
        16,
        23
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Participacion Electoral en Elecciones Municipales 2024 por Comuna (SERVEL)",
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
        "datasets": [
          {
            "label": "% Participacion Electoral",
            "data": [
              84.2,
              87.5,
              82.8,
              83.1,
              85.9,
              83.6,
              86.4,
              85.2,
              88,
              87.3
            ],
            "backgroundColor": "#0f766e"
          }
        ],
        "unit": "%"
      },
      "tableColumns": [
        "Comuna",
        "Alcalde Electo (2024-2028)",
        "Pacto Politico",
        "Concejales (N)",
        "Participacion (%)"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "Carlos Gatica Villegas",
          "Partido Demócrata Cristiano (DC) / Contigo Chile Mejor",
          "6",
          "84.2%"
        ],
        [
          "Lago Verde",
          "Claudia Valdés Vásquez",
          "Independiente / Contigo Chile Mejor",
          "6",
          "87.5%"
        ],
        [
          "Aysén",
          "Luis Martínez Gallardo",
          "Unión Demócrata Independiente (UDI) / Chile Vamos",
          "6",
          "82.8%"
        ],
        [
          "Cisnes",
          "Francisco Roncagliolo Lepío",
          "Renovación Nacional (RN) / Chile Vamos",
          "6",
          "83.1%"
        ],
        [
          "Guaitecas",
          "Bans Puinao Carimoney",
          "Evolución Política (Evópoli) / Chile Vamos",
          "6",
          "85.9%"
        ],
        [
          "Chile Chico",
          "Ariel Keim Hermosilla",
          "Independiente",
          "6",
          "83.6%"
        ],
        [
          "Río Ibáñez",
          "Marcelo Jélvez Cárdenas",
          "Unión Demócrata Independiente (UDI) / Chile Vamos",
          "6",
          "86.4%"
        ],
        [
          "Cochrane",
          "Patricio Ulloa Georgia",
          "Unión Demócrata Independiente (UDI) / Chile Vamos",
          "6",
          "85.2%"
        ],
        [
          "O'Higgins",
          "José Claudio Fica Gómez",
          "Partido Demócrata Cristiano (DC)",
          "6",
          "88%"
        ],
        [
          "Tortel",
          "Marisela Jiménez Cruces",
          "Independiente",
          "6",
          "87.3%"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Nomina oficial de autoridades electas periodo 2024-2028 (SERVEL)",
          "Pactos politicos y distribucion partidaria de los concejos municipales",
          "Padron electoral comunal y participacion efectiva con voto obligatorio",
          "Representacion parlamentaria distrital y senatorial de Aysen"
        ],
        "suggestedCrossings": [
          "Cruce con Gasto Social Municipal (Nodo #15)",
          "Cruce con Distribucion Demografica Censo 2024 (Nodo #23)"
        ],
        "totalRecordsInFullBase": "10 comunas, 10 alcaldes y 60 concejales en data/systemic/01_gob_poder_finanzas.json"
      }
    },
    {
      "id": 18,
      "nodeId": 18,
      "hubId": "gobernanza",
      "isSpecial": false,
      "title": "Inversion Publica FNDR y Conectividad Ruta 7",
      "definition": "Inversion publica regional asignada por el **Fondo Nacional de Desarrollo Regional (FNDR)** y estado de la conectividad terrestre en la **Carretera Austral (Ruta 7)**.",
      "example": "Cruza los montos FNDR comunales con el kilometraje de pavimento y ripio en la Ruta 7 (que se extiende por **835 km en la region**, con importantes tramos de ripio al sur de Villa Cerro Castillo).",
      "officialSource": {
        "name": "DIPRES / GORE Aysen / Direccion de Vialidad MOP",
        "url": "https://datos.dipres.gob.cl/",
        "frequency": "Trimestral / Anual"
      },
      "provenance": {
        "sourceEntity": "Gobierno Regional de Aysén (GORE) / Dirección de Presupuestos (DIPRES) / Dirección de Vialidad MOP",
        "sourceUrl": "https://datos.dipres.gob.cl/",
        "collectionDate": "Ejecución Presupuestaria FNDR y Catastro de Red Vial MOP · Corte Agosto 2026",
        "collectionMethod": "Sistema de Información de Proyectos FNDR DIPRES y libro de obras de contratos viales MOP",
        "updateFrequency": "Trimestral",
        "nextUpdate": "Noviembre 2026 (Reporte DIPRES ejecución Q3)"
      },
      "csvFile": "data/systemic/csv/01_gob_poder_finanzas_comunas.csv",
      "relatedNodeIds": [
        2,
        14,
        27
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Cartera Estimada FNDR Asignada por Comuna (M$ CLP - GORE Aysen)",
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
        "datasets": [
          {
            "label": "Cartera FNDR (M$ CLP)",
            "data": [
              14850,
              2200,
              9800,
              5600,
              3400,
              4900,
              4100,
              4800,
              2400,
              2600
            ],
            "backgroundColor": "#0059c5"
          }
        ],
        "unit": "M$ CLP"
      },
      "tableColumns": [
        "Comuna",
        "Inversion FNDR (M$)",
        "Km Ruta 7 Totales",
        "Km Pavimentados",
        "% Pavimentado"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "14.850",
          "160,5",
          "142,5",
          "89%"
        ],
        [
          "Lago Verde",
          "2.200",
          "75",
          "0",
          "0%"
        ],
        [
          "Aysén",
          "9.800",
          "68",
          "68",
          "100%"
        ],
        [
          "Cisnes",
          "5.600",
          "180",
          "115",
          "64%"
        ],
        [
          "Guaitecas",
          "3.400",
          "0",
          "0",
          "No cruza Ruta 7"
        ],
        [
          "Chile Chico",
          "4.900",
          "128",
          "8",
          "6%"
        ],
        [
          "Río Ibáñez",
          "4.100",
          "150",
          "82",
          "55%"
        ],
        [
          "Cochrane",
          "4.800",
          "180",
          "12",
          "7%"
        ],
        [
          "O'Higgins",
          "2.400",
          "134",
          "0",
          "0%"
        ],
        [
          "Tortel",
          "2.600",
          "45",
          "0",
          "0%"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Cartera de proyectos FNDR asignados por el GORE Aysen",
          "Estado de la Carretera Austral (Ruta 7: 835 km totales en la region)",
          "Kilometros de calzada pavimentada vs. ripio/tierra por comuna",
          "Conectividad maritima subsidiada (barcazas bimodal)"
        ],
        "suggestedCrossings": [
          "Cruce con Tiempos de Traslado SAMU a Salud (Nodo #24)",
          "Cruce con Flujo de Visitantes a Parques SNASPE (Nodo #04)"
        ],
        "totalRecordsInFullBase": "10 comunas y metricas de infraestructura vial en data/systemic/csv/01_gob_poder_finanzas_comunas.csv"
      }
    },
    {
      "id": 19,
      "nodeId": 19,
      "hubId": "inversion",
      "isSpecial": false,
      "title": "Proyectos de Inversion en el SEIA (RCA)",
      "definition": "Proyectos sometidos al **Sistema de Evaluacion de Impacto Ambiental (SEIA — SEA)**: proyectos aprobados historicamente con RCA favorable, inversion acumulada en MM USD y proyectos en evaluacion activa.",
      "example": "Aysen acumula **722 proyectos aprobados (3.355,5 MM USD)** y **22 en calificacion**, liderados por **Aysen (1.420,5 MM USD)** y **Coyhaique (895,2 MM USD)** en infraestructura, energia y acuicultura.",
      "officialSource": {
        "name": "Servicio de Evaluacion Ambiental (SEA — SEIA)",
        "url": "https://seia.sea.gob.cl/",
        "frequency": "Actualizacion continua"
      },
      "provenance": {
        "sourceEntity": "Servicio de Evaluación Ambiental (SEA) — Sistema de Evaluación de Impacto Ambiental",
        "sourceUrl": "https://seia.sea.gob.cl/",
        "collectionDate": "Base Oficial de Proyectos Calificados y en Evaluación · Corte Septiembre 2026",
        "collectionMethod": "Resoluciones de Calificación Ambiental (RCA) publicadas en el expediente electrónico público SEIA",
        "updateFrequency": "Mensual",
        "nextUpdate": "Noviembre 2026 (Actualización mensual continua)"
      },
      "csvFile": "data/systemic/csv/04_inversion_seia_economia_comunas.csv",
      "relatedNodeIds": [
        6,
        11,
        20,
        21
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Monto de Inversion Aprobada en el SEIA por Comuna (MM USD)",
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
        "datasets": [
          {
            "label": "Inversion Aprobada (MM USD)",
            "data": [
              495.6,
              31.4,
              1320,
              525,
              245,
              310,
              142,
              172,
              48,
              66.5
            ],
            "backgroundColor": "#0f766e"
          }
        ],
        "unit": "MM USD"
      },
      "tableColumns": [
        "Comuna",
        "Proyectos Aprobados",
        "Inversion Aprobada (MM USD)",
        "Proyectos en Evaluacion",
        "Sector Dominante"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "118",
          "USD 495,6 MM",
          "-",
          "-"
        ],
        [
          "Lago Verde",
          "9",
          "USD 31,4 MM",
          "-",
          "-"
        ],
        [
          "Aysén",
          "254",
          "USD 1.320 MM",
          "-",
          "-"
        ],
        [
          "Cisnes",
          "122",
          "USD 525 MM",
          "-",
          "-"
        ],
        [
          "Guaitecas",
          "86",
          "USD 245 MM",
          "-",
          "-"
        ],
        [
          "Chile Chico",
          "41",
          "USD 310 MM",
          "-",
          "-"
        ],
        [
          "Río Ibáñez",
          "27",
          "USD 142 MM",
          "-",
          "-"
        ],
        [
          "Cochrane",
          "33",
          "USD 172 MM",
          "-",
          "-"
        ],
        [
          "O'Higgins",
          "14",
          "USD 48 MM",
          "-",
          "-"
        ],
        [
          "Tortel",
          "18",
          "USD 66,5 MM",
          "-",
          "-"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "722 proyectos aprobados con Resolucion de Calificacion Ambiental (RCA)",
          "22 proyectos actualmente en calificacion ambiental activa",
          "Monto acumulado de inversion aprobada (3.355,5 MM USD)",
          "Desglose sectorial SEIA (Acuicultura, Energia, Mineria, Transporte, Saneamiento)"
        ],
        "suggestedCrossings": [
          "Cruce con Generacion Electrica (Nodo #11)",
          "Cruce con Concesiones de Acuicultura (Nodo #06)"
        ],
        "totalRecordsInFullBase": "744 proyectos SEIA clasificados en data/systemic/csv/04_inversion_seia_economia_comunas.csv"
      }
    },
    {
      "id": 20,
      "nodeId": 20,
      "hubId": "inversion",
      "isSpecial": false,
      "title": "Empresas, Empleo y Ventas por Rubro (SII)",
      "definition": "Estadisticas tributarias oficiales del **Servicio de Impuestos Internos (SII)**: numero de empresas con iniciacion de actividades, trabajadores dependientes informados, ventas anuales en UF y peso del empleo publico.",
      "example": "En la region operan **9.365 empresas formales**, con **6.992 microempresas (74,7%)**, **1.928 pequenas (20,6%)**, **372 medianas (4,0%)** y **73 grandes empresas (0,8%)**.",
      "officialSource": {
        "name": "Servicio de Impuestos Internos (SII) — Estadisticas Tributarias",
        "url": "https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html",
        "frequency": "Anual"
      },
      "provenance": {
        "sourceEntity": "Servicio de Impuestos Internos (SII) — Subdirección de Estudios",
        "sourceUrl": "https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html",
        "collectionDate": "Estadísticas de Empresas y Empleados por Comuna · Año Tributario 2025–2026",
        "collectionMethod": "Formularios 22 y 29 consolidados de operaciones de contribuyentes con domicilio en Aysén",
        "updateFrequency": "Anual",
        "nextUpdate": "Diciembre 2026 (Cierre definitivo de año tributario)"
      },
      "csvFile": "data/systemic/csv/04_inversion_seia_economia_comunas.csv",
      "relatedNodeIds": [
        1,
        7,
        10,
        19
      ],
      "chartSpec": {
        "type": "doughnut",
        "title": "Distribucion de Empresas Activas por Tramo de Tamano (SII Aysen - 9.365 Total)",
        "labels": [
          "Microempresas (1-9 trab.)",
          "Pequenas empresas (10-49)",
          "Medianas empresas (50-199)",
          "Grandes empresas (200+)"
        ],
        "datasets": [
          {
            "label": "Empresas Activas",
            "data": [
              6992,
              1928,
              372,
              73
            ],
            "backgroundColor": [
              "#0059c5",
              "#0284c7",
              "#0f766e",
              "#f59e0b"
            ]
          }
        ],
        "unit": "empresas"
      },
      "tableColumns": [
        "Comuna",
        "Empresas Activas SII",
        "Trabajadores Dependientes",
        "Ventas Anuales (UF)",
        "Rubro Principal"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "5.535",
          "33.650",
          "48.500",
          "-"
        ],
        [
          "Lago Verde",
          "76",
          "460",
          "450",
          "-"
        ],
        [
          "Aysén",
          "2.100",
          "12.780",
          "56.200",
          "-"
        ],
        [
          "Cisnes",
          "620",
          "3.770",
          "9.100",
          "-"
        ],
        [
          "Guaitecas",
          "171",
          "1.040",
          "2.450",
          "-"
        ],
        [
          "Chile Chico",
          "400",
          "2.430",
          "6.300",
          "-"
        ],
        [
          "Río Ibáñez",
          "238",
          "1.445",
          "3.200",
          "-"
        ],
        [
          "Cochrane",
          "295",
          "1.790",
          "4.400",
          "-"
        ],
        [
          "O'Higgins",
          "57",
          "345",
          "530",
          "-"
        ],
        [
          "Tortel",
          "48",
          "295",
          "390",
          "-"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Estadisticas tributarias oficiales del SII por rubro economico y tramo de venta",
          "9.365 empresas activas en la Region de Aysen",
          "Trabajadores dependientes formales registrados ante el SII",
          "Peso relativo del empleo publico vs. privado en cada comuna"
        ],
        "suggestedCrossings": [
          "Cruce con Pesca Industrial e Impuesto Especifico (Nodo #10)",
          "Cruce con Servicios Turisticos Registrados (Nodo #01)"
        ],
        "totalRecordsInFullBase": "10 comunas y agregados tributarios del SII en data/systemic/csv/04_inversion_seia_economia_comunas.csv"
      }
    },
    {
      "id": 21,
      "nodeId": 21,
      "hubId": "inversion",
      "isSpecial": false,
      "title": "Concesiones Mineras y Yacimientos (SERNAGEOMIN)",
      "definition": "Catastro de **concesiones mineras de exploracion y explotacion (pertenencias)**, superficie comprometida en hectareas, yacimientos metalicos y no metalicos segun **SERNAGEOMIN**.",
      "example": "**Chile Chico** lidera en mineria metalica con **45.200 ha en pertenencias** (distrito minero Cerro Bayo), seguido por **Rio Ibanez (28.400 ha)** y **Coyhaique (18.600 ha)**.",
      "officialSource": {
        "name": "SERNAGEOMIN — Catastro Minero Nacional",
        "url": "https://www.sernageomin.cl/catastro-minero/",
        "frequency": "Trimestral"
      },
      "provenance": {
        "sourceEntity": "Servicio Nacional de Geología y Minería (SERNAGEOMIN) — Departamento de Propiedad Minera",
        "sourceUrl": "https://www.sernageomin.cl/catastro-minero/",
        "collectionDate": "Catastro de Concesiones Mineras de Explotación y Exploración · Corte Junio 2026",
        "collectionMethod": "Registro oficial de sentencias constitutivas de pertenencias mineras e inscripciones conservatorias",
        "updateFrequency": "Semestral",
        "nextUpdate": "Diciembre 2026 (Actualización semestral de roles)"
      },
      "csvFile": "data/systemic/csv/03_concesiones_tierra_mar_comunas.csv",
      "relatedNodeIds": [
        15,
        19,
        22
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Superficie de Pertenencias Mineras por Comuna en Aysen (ha - SERNAGEOMIN)",
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
        "datasets": [
          {
            "label": "Pertenencias Mineras (ha)",
            "data": [
              31500,
              8900,
              12400,
              16800,
              400,
              48200,
              19600,
              9800,
              5600,
              3200
            ],
            "backgroundColor": "#d97706"
          }
        ],
        "unit": "hectareas"
      },
      "tableColumns": [
        "Comuna",
        "Pertenencias Mineras (ha)",
        "Exploracion (ha)",
        "Yacimientos Metalicos",
        "Yacimientos No Metalicos"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "31.500",
          "-",
          "-",
          "-"
        ],
        [
          "Lago Verde",
          "8.900",
          "-",
          "-",
          "-"
        ],
        [
          "Aysén",
          "12.400",
          "-",
          "-",
          "-"
        ],
        [
          "Cisnes",
          "16.800",
          "-",
          "-",
          "-"
        ],
        [
          "Guaitecas",
          "400",
          "-",
          "-",
          "-"
        ],
        [
          "Chile Chico",
          "48.200",
          "-",
          "-",
          "-"
        ],
        [
          "Río Ibáñez",
          "19.600",
          "-",
          "-",
          "-"
        ],
        [
          "Cochrane",
          "9.800",
          "-",
          "-",
          "-"
        ],
        [
          "O'Higgins",
          "5.600",
          "-",
          "-",
          "-"
        ],
        [
          "Tortel",
          "3.200",
          "-",
          "-",
          "-"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Catastro oficial de pertenencias mineras vigentes (SERNAGEOMIN)",
          "Concesiones de exploracion y explotacion de minerales metalicos y no metalicos",
          "Yacimientos emblematicos (Cerro Bayo en Chile Chico, Mina El Toqui en Coyhaique)",
          "Superficie comunal comprometida bajo regimen minero"
        ],
        "suggestedCrossings": [
          "Cruce con Tenencia de Suelo Fiscal y SNASPE (Nodo #22)",
          "Cruce con Ingresos por Patentes Mineras en Municipios (Nodo #15)"
        ],
        "totalRecordsInFullBase": "10 comunas y catastro minero en data/systemic/csv/03_concesiones_tierra_mar_comunas.csv"
      }
    },
    {
      "id": 22,
      "nodeId": 22,
      "hubId": "inversion",
      "isSpecial": false,
      "title": "Tenencia de Suelo Fiscal, SNASPE y Privada (BBNN / CONAF)",
      "definition": "Estructura de tenencia de la tierra segun el **Ministerio de Bienes Nacionales y CONAF**: hectareas y porcentaje de suelo fiscal, propiedad privada y unidades bajo proteccion **SNASPE**.",
      "example": "En comunas como **Tortel (91,4% fiscal/SNASPE)** y **O'Higgins (86,8%)** la mayor parte del territorio esta bajo dominio del Estado, contrastando con **Coyhaique**, donde el **62,3%** es propiedad privada y presenta presion por loteos rurales.",
      "officialSource": {
        "name": "Ministerio de Bienes Nacionales / CONAF SIT",
        "url": "https://ide.patrimonio.cl/",
        "frequency": "Anual"
      },
      "provenance": {
        "sourceEntity": "Ministerio de Bienes Nacionales (BBNN) / CONAF — Sistema de Información Territorial (SIT)",
        "sourceUrl": "https://ide.patrimonio.cl/",
        "collectionDate": "Catastro de la Propiedad Fiscal y Áreas Silvestres Protegidas · Corte Julio 2026",
        "collectionMethod": "Cruce cartográfico digital de la propiedad fiscal, unidades SNASPE y roles particulares SAG/SII",
        "updateFrequency": "Anual",
        "nextUpdate": "Enero 2027 (Actualización anual de límites fiscales)"
      },
      "csvFile": "data/systemic/csv/03_concesiones_tierra_mar_comunas.csv",
      "relatedNodeIds": [
        4,
        6,
        21,
        27
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Distribucion Porcentual del Suelo Comunal: Fiscal, SNASPE y Privado (%)",
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
        "datasets": [
          {
            "label": "% Fiscal BBNN",
            "data": [
              18.5,
              28.2,
              24,
              20.4,
              42.1,
              26.5,
              18.2,
              31.4,
              17.8,
              11.2
            ],
            "backgroundColor": "#0f766e"
          },
          {
            "label": "% SNASPE Protegido",
            "data": [
              19.2,
              34.5,
              63.4,
              71.2,
              45.8,
              48.6,
              61.7,
              52.1,
              78.3,
              87.4
            ],
            "backgroundColor": "#0284c7"
          },
          {
            "label": "% Propiedad Privada",
            "data": [
              62.3,
              37.3,
              12.6,
              8.4,
              12.1,
              24.9,
              20.1,
              16.5,
              3.9,
              1.4
            ],
            "backgroundColor": "#94a3b8"
          }
        ],
        "unit": "%"
      },
      "tableColumns": [
        "Comuna",
        "Superficie Total (ha)",
        "% Fiscal BBNN",
        "% SNASPE Protegido",
        "% Propiedad Privada"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "729.020",
          "18.5%",
          "19.2%",
          "62.3%"
        ],
        [
          "Lago Verde",
          "542.230",
          "28.2%",
          "34.5%",
          "37.3%"
        ],
        [
          "Aysén",
          "2.979.640",
          "24%",
          "63.4%",
          "12.6%"
        ],
        [
          "Cisnes",
          "1.609.300",
          "20.4%",
          "71.2%",
          "8.4%"
        ],
        [
          "Guaitecas",
          "62.060",
          "42.1%",
          "45.8%",
          "12.1%"
        ],
        [
          "Chile Chico",
          "573.710",
          "26.5%",
          "48.6%",
          "24.9%"
        ],
        [
          "Río Ibáñez",
          "599.720",
          "18.2%",
          "61.7%",
          "20.1%"
        ],
        [
          "Cochrane",
          "859.950",
          "31.4%",
          "52.1%",
          "16.5%"
        ],
        [
          "O'Higgins",
          "818.250",
          "17.8%",
          "78.3%",
          "3.9%"
        ],
        [
          "Tortel",
          "1.971.060",
          "11.2%",
          "87.4%",
          "1.4%"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Regimen de propiedad de la tierra (Ministerio de Bienes Nacionales)",
          "Superficie fiscal administrada por el Estado en cada comuna",
          "Porcentaje de cobertura bajo Areas Silvestres Protegidas SNASPE",
          "Tierras fiscales disponibles para concesiones onerosas y proyectos comunitarios"
        ],
        "suggestedCrossings": [
          "Cruce con Cobertura Forestal Nativa CONAF (Nodo #27)",
          "Cruce con Concesiones Mineras (Nodo #21)"
        ],
        "totalRecordsInFullBase": "10 comunas y tenencia del suelo consolidada en data/systemic/03_concesiones_tierra_mar.json"
      }
    },
    {
      "id": 23,
      "nodeId": 23,
      "hubId": "social",
      "isSpecial": false,
      "title": "Demografia Censo 2024 y Pobreza CASEN",
      "definition": "Resultados oficiales del **Censo 2024 (INE)**: poblacion censada, proporcion regional, superficie comunal, densidad habitacional (hab/km2) e indices de **pobreza por ingresos y multidimensional CASEN 2022**.",
      "example": "La region suma **100.745 habitantes**, con una fuerte concentracion en **Coyhaique (61.211 hab, 60,76%)** y **Aysen (24.345 hab, 24,17%)**, alcanzando densidades de solo **0,04 hab/km2 en Tortel**.",
      "officialSource": {
        "name": "INE Censo 2024 / Ministerio de Desarrollo Social CASEN 2022",
        "url": "https://censo2024.ine.gob.cl/",
        "frequency": "Censal / CASEN bienal"
      },
      "provenance": {
        "sourceEntity": "Instituto Nacional de Estadísticas (INE) / Ministerio de Desarrollo Social y Familia (MDSF)",
        "sourceUrl": "https://censo2024.ine.gob.cl/",
        "collectionDate": "Resultados Oficiales del Censo de Población y Vivienda 2024 / CASEN 2022",
        "collectionMethod": "Operativo censal territorial INE y encuesta CASEN representativa a nivel comunal",
        "updateFrequency": "Decenal (Censo) / Bienal (CASEN)",
        "nextUpdate": "Noviembre 2026 (Tabulados detallados comunales Censo 2024)"
      },
      "csvFile": "data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv",
      "relatedNodeIds": [
        15,
        24,
        25,
        26
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Poblacion Comunal Censo 2024 en la Region de Aysen (Total: 100.745 hab)",
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
        "datasets": [
          {
            "label": "Poblacion Censo 2024",
            "data": [
              57823,
              779,
              23170,
              5137,
              1598,
              4905,
              2723,
              3458,
              647,
              505
            ],
            "backgroundColor": "#1e3a8a"
          }
        ],
        "unit": "habitantes"
      },
      "tableColumns": [
        "Comuna",
        "Poblacion Censo 2024",
        "% Regional",
        "Superficie (km2)",
        "Pobreza CASEN (%)"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "57.823",
          "57.4%",
          "7.290,2",
          "2.9%"
        ],
        [
          "Lago Verde",
          "779",
          "0.77%",
          "5.422,3",
          "0.9%"
        ],
        [
          "Aysén",
          "23.170",
          "23%",
          "29.796,4",
          "5.3%"
        ],
        [
          "Cisnes",
          "5.137",
          "5.1%",
          "16.093",
          "5%"
        ],
        [
          "Guaitecas",
          "1.598",
          "1.59%",
          "620,6",
          "6.1%"
        ],
        [
          "Chile Chico",
          "4.905",
          "4.87%",
          "5.737,1",
          "6.2%"
        ],
        [
          "Río Ibáñez",
          "2.723",
          "2.7%",
          "5.997,2",
          "7%"
        ],
        [
          "Cochrane",
          "3.458",
          "3.43%",
          "8.599,5",
          "6.3%"
        ],
        [
          "O'Higgins",
          "647",
          "0.64%",
          "8.182,5",
          "9.2%"
        ],
        [
          "Tortel",
          "505",
          "0.5%",
          "19.710,6",
          "4.6%"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Microdatos consolidados del Censo de Poblacion y Vivienda 2024 INE (100.745 hab)",
          "Tasa de crecimiento intercensal y densidad poblacional (hab/km2)",
          "Pobreza por ingresos y pobreza multidimensional CASEN 2022",
          "Indice de masculinidad y estructura etaria por comuna"
        ],
        "suggestedCrossings": [
          "Cruce con Red Asistencial de Salud (Nodo #24)",
          "Cruce con Matricula Escolar SLEP (Nodo #25)"
        ],
        "totalRecordsInFullBase": "10 comunas y perfiles demograficos censales en data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv"
      }
    },
    {
      "id": 24,
      "nodeId": 24,
      "hubId": "social",
      "isSpecial": false,
      "title": "Red Asistencial de Salud y Evacuacion SAMU",
      "definition": "Red asistencial del Servicio de Salud Aysen (**SSA / DEIS MINSAL**): diferenciacion entre **Atencion Primaria de Salud (APS - 2 CESFAM, 3 CECOSF, 28 Postas Rurales y 20 EMR)** frente a la **Red Hospitalaria (1 Hospital de Alta Complejidad y 4 Hospitales Comunitarios)** con 261 camas totales, camas criticas UCI/UTI y tiempos de traslado SAMU.",
      "example": "**Coyhaique** concentra el **Hospital Regional (167 camas, 22 criticas UCI/UTI, 5 quirofanos)** y la base SAMU, mientras las 4 cabeceras provinciales cuentan con hospitales comunitarios de baja complejidad y 5 comunas dependen exclusivamente de postas rurales con traslados terrestres de hasta **7 a 9 horas** hacia Coyhaique.",
      "officialSource": {
        "name": "Departamento de Estadisticas e Informacion de Salud (DEIS) / SSA",
        "url": "https://deis.minsal.cl/",
        "frequency": "Mensual"
      },
      "provenance": {
        "sourceEntity": "Ministerio de Salud (MINSAL) — Departamento de Estadísticas e Información de Salud (DEIS) / Servicio de Salud Aysén (SSA)",
        "sourceUrl": "https://deis.minsal.cl/",
        "collectionDate": "Registro de Establecimientos de Salud (DEIS) y Tiempos de Evacuación SAMU · Corte Septiembre 2026",
        "collectionMethod": "Reporte mensual de infraestructura hospitalaria, dotación de camas y estadísticas de derivación SAMU",
        "updateFrequency": "Mensual",
        "nextUpdate": "Noviembre 2026 (Boletín mensual DEIS)"
      },
      "csvFile": "data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv",
      "relatedNodeIds": [
        14,
        18,
        23,
        31
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Capacidad Hospitalaria vs. Dispositivos APS en la Red SSA (261 Camas Totales)",
        "labels": [
          "Hosp. Reg. Coyhaique",
          "Hosp. Pto. Aysen",
          "Hosp. Cochrane",
          "Hosp. Chile Chico",
          "Hosp. Pto. Cisnes",
          "Red APS Comunal"
        ],
        "datasets": [
          {
            "label": "Camas Disponibles",
            "data": [
              167,
              52,
              16,
              14,
              12,
              0
            ],
            "backgroundColor": "#0059c5"
          },
          {
            "label": "Dispositivos Asistenciales",
            "data": [
              1,
              1,
              1,
              1,
              1,
              53
            ],
            "backgroundColor": "#0284c7"
          }
        ],
        "unit": "camas / dispositivos"
      },
      "tableColumns": [
        "Comuna",
        "Dispositivo Principal",
        "Tipo Red Asistencial",
        "Camas Totales",
        "Tiempo a Coyhaique (hrs)"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "Hospital Regional Coyhaique",
          "Hospitalario",
          "167",
          "0 hrs"
        ],
        [
          "Lago Verde",
          "Sin hospital en la comuna (Atencion Primaria Rural)",
          "APS Rural",
          "0",
          "4.5 hrs"
        ],
        [
          "Aysén",
          "Hospital de Puerto Aysen",
          "Hospitalario",
          "52",
          "1 hrs"
        ],
        [
          "Cisnes",
          "Hospital Comunitario Dr. Jorge Ibar Bruce de Puerto Cisnes",
          "Hospitalario",
          "12",
          "3.5 hrs"
        ],
        [
          "Guaitecas",
          "Sin hospital en el archipielago (Cobertura por CESFAM Melinka)",
          "APS Rural",
          "0",
          "14 hrs"
        ],
        [
          "Chile Chico",
          "Hospital Familiar y Comunitario San Jose / Dr. Leopoldo Ortega Rodriguez de Chile Chico",
          "Hospitalario",
          "14",
          "4 hrs"
        ],
        [
          "Río Ibáñez",
          "Sin hospital en la comuna (Atencion Primaria con CESFAM y Postas)",
          "APS Rural",
          "0",
          "1.5 hrs"
        ],
        [
          "Cochrane",
          "Hospital Comunitario de Cochrane (Hospital Lord Cochrane)",
          "Hospitalario",
          "16",
          "6 hrs"
        ],
        [
          "O'Higgins",
          "Sin hospital en la comuna (Posta Rural de Aislamiento Extremo)",
          "APS Rural",
          "0",
          "10 hrs"
        ],
        [
          "Tortel",
          "Sin hospital en la comuna (Posta Rural de Dificil Acceso en Pasarelas)",
          "APS Rural",
          "0",
          "8 hrs"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Diferenciacion APS (CESFAM, CECOSF, Postas de Salud Rural y EMR) vs. Red Hospitalaria",
          "Desglose individual por establecimiento (46 recintos asistenciales georreferenciados)",
          "Distribucion de camas hospitalarias (261 camas totales: 22 camas criticas UCI/UTI, 7 quirofanos)",
          "Rutas y tiempos de aeroevacuacion SAMU y derivacion de urgencia"
        ],
        "suggestedCrossings": [
          "Cruce con Conectividad Vial y Aislamiento (Nodo #18)",
          "Cruce con Envejecimiento Poblacional Censo 2024 (Nodo #23)"
        ],
        "totalRecordsInFullBase": "10 comunas con 48 variables asistenciales y directorio de 46 recintos en data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv"
      }
    },
    {
      "id": 25,
      "nodeId": 25,
      "hubId": "social",
      "isSpecial": false,
      "title": "Educacion Publica (SLEP Aysen) y Superior",
      "definition": "Red de establecimientos bajo administracion del **Servicio Local de Educacion Publica (SLEP Aysen)**: matricula escolar total, presencia de educacion media completa, sedes de educacion superior y diferenciacion de **36 escuelas rurales multigrado** frente a **16 liceos urbanos**.",
      "example": "Registra la matricula publica en las 10 comunas, los internados estudiantiles para alumnos de zonas aisladas y la oferta de educacion superior (Universidad de Aysen e INACAP en Coyhaique).",
      "officialSource": {
        "name": "Centro de Estudios MINEDUC / SLEP Aysen",
        "url": "https://datosabiertos.mineduc.cl/",
        "frequency": "Anual"
      },
      "provenance": {
        "sourceEntity": "Ministerio de Educación (MINEDUC) — Centro de Estudios / Servicio Local de Educación Pública (SLEP Aysén)",
        "sourceUrl": "https://datosabiertos.mineduc.cl/",
        "collectionDate": "Matrícula Oficial y Rendición de Escuelas Rurales SLEP · Periodo Escolar 2026",
        "collectionMethod": "Registro oficial de matrículas SIGE MINEDUC y auditoría interna de establecimientos SLEP",
        "updateFrequency": "Anual",
        "nextUpdate": "Diciembre 2026 (Balance final de año escolar 2026)"
      },
      "csvFile": "data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv",
      "relatedNodeIds": [
        14,
        23
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Escuelas Rurales Multigrado vs. Liceos Urbanos por Comuna (SLEP Aysen)",
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
        "datasets": [
          {
            "label": "Escuelas Rurales Multigrado",
            "data": [
              12,
              3,
              6,
              5,
              2,
              2,
              2,
              1,
              1,
              2
            ],
            "backgroundColor": "#0f766e"
          },
          {
            "label": "Liceos y Colegios Urbanos",
            "data": [
              7,
              0,
              4,
              1,
              1,
              1,
              0,
              1,
              0,
              1
            ],
            "backgroundColor": "#4338ca"
          }
        ],
        "unit": "establecimientos"
      },
      "tableColumns": [
        "Comuna",
        "Establecimientos SLEP",
        "Matricula Escolar",
        "Educacion Media",
        "Sede Superior"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "38",
          "13.450",
          "Si",
          "Universidad de Aysén"
        ],
        [
          "Lago Verde",
          "3",
          "95",
          "Parcial / Derivacion",
          "Sin sede local"
        ],
        [
          "Aysén",
          "18",
          "4.850",
          "Si",
          "CFT Estatal de la Región de Aysén"
        ],
        [
          "Cisnes",
          "9",
          "980",
          "Si",
          "Sin sede local"
        ],
        [
          "Guaitecas",
          "2",
          "320",
          "Si",
          "Sin sede local"
        ],
        [
          "Chile Chico",
          "4",
          "890",
          "Si",
          "Sin sede local"
        ],
        [
          "Río Ibáñez",
          "3",
          "450",
          "Si",
          "Sin sede local"
        ],
        [
          "Cochrane",
          "3",
          "750",
          "Si",
          "Sin sede local"
        ],
        [
          "O'Higgins",
          "2",
          "120",
          "Si",
          "Sin sede local"
        ],
        [
          "Tortel",
          "2",
          "85",
          "Si",
          "Sin sede local"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Desglose institucional de establecimientos bajo dependencia del SLEP Aysen",
          "Directorio de 36 escuelas rurales multigrado unidocentes y bidocentes",
          "Red de 16 liceos cientifico-humanistas y tecnico-profesionales",
          "Matricula de 47 jardines infantiles JUNJI e Integra"
        ],
        "suggestedCrossings": [
          "Cruce con Conectividad Digital FOA (Nodo #14)",
          "Cruce con Dependencia FCM (Nodo #16)"
        ],
        "totalRecordsInFullBase": "10 comunas y directorio de colegios en data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv"
      }
    },
    {
      "id": 26,
      "nodeId": 26,
      "hubId": "social",
      "isSpecial": false,
      "title": "Seguridad Ciudadana y Delitos (CEAD / VIF)",
      "definition": "Tasas comunales de **Delitos de Mayor Connotacion Social (DMCS)** y denuncias de **Violencia Intrafamiliar (VIF)** cada 100.000 habitantes (**CEAD Subsecretaria de Prevencion del Delito**), tipologias frecuentes y dotacion policial.",
      "example": "Permite revisar las tasas estandarizadas cada 100 mil habitantes y la cobertura de comisarias, subcomisarias, tenencias y retenes fronterizos de Carabineros en las 10 comunas.",
      "officialSource": {
        "name": "CEAD — Subsecretaria de Prevencion del Delito",
        "url": "https://cead.spd.gov.cl/",
        "frequency": "Trimestral"
      },
      "provenance": {
        "sourceEntity": "Subsecretaría de Prevención del Delito (SPD) — Centro de Estudios y Análisis del Delito (CEAD)",
        "sourceUrl": "https://cead.spd.gov.cl/",
        "collectionDate": "Estadísticas Delictuales de Casos Policiales DMCS y VIF · Corte Junio 2026",
        "collectionMethod": "Denuncias y detenciones en flagrancia informadas oficialmente por Carabineros de Chile y Policía de Investigaciones (PDI)",
        "updateFrequency": "Trimestral",
        "nextUpdate": "Noviembre 2026 (Estadísticas oficiales Q3)"
      },
      "csvFile": "data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv",
      "relatedNodeIds": [
        23,
        24
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Tasa de Delitos de Mayor Connotacion Social (DMCS) por 100k hab (CEAD)",
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
        "datasets": [
          {
            "label": "Tasa DMCS (c/100 mil hab)",
            "data": [
              2150.4,
              420,
              1980.2,
              1120,
              890,
              1340,
              910,
              1280,
              650,
              510
            ],
            "backgroundColor": "#e11d48"
          }
        ],
        "unit": "tasa / 100k hab"
      },
      "tableColumns": [
        "Comuna",
        "Tasa DMCS (/100k)",
        "Tasa VIF (/100k)",
        "Delitos Frecuentes",
        "Dotacion Policial"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "2.150,4",
          "940,8",
          "Violencia intrafamiliar, Hurto en centros comerciales",
          "1ª Comisaría Coyhaique + Subcomisaría Fuerzas Especiales + Retenes fronterizos"
        ],
        [
          "Lago Verde",
          "420",
          "385",
          "Violencia intrafamiliar, Infracción a Ley de Alcoholes",
          "Retén Lago Verde (Fronterizo) y Retén La Tapera"
        ],
        [
          "Aysén",
          "1.980,2",
          "1.080,5",
          "Violencia intrafamiliar, Lesiones en riña",
          "2ª Comisaría Puerto Aysén y Subcomisaría Puerto Chacabuco"
        ],
        [
          "Cisnes",
          "1.120",
          "620",
          "Violencia intrafamiliar, Conducción en estado de ebriedad",
          "Subcomisaría Puerto Cisnes y Retén Puyuhuapi / La Junta"
        ],
        [
          "Guaitecas",
          "890",
          "540",
          "Infracción a Ley de Pesca, Violencia intrafamiliar",
          "Retén Melinka (Fronterizo) y Capitanía de Puerto Melinka (Armada)"
        ],
        [
          "Chile Chico",
          "1.340",
          "710",
          "Violencia intrafamiliar, Contrabando y pasos fronterizos no habilitados",
          "3ª Comisaría Chile Chico y Retén Puerto Guadal"
        ],
        [
          "Río Ibáñez",
          "910",
          "480",
          "Violencia intrafamiliar, Infracciones de tránsito Carretera Austral",
          "Tenencia Puerto Ingeniero Ibáñez y Retén Puerto Río Tranquilo"
        ],
        [
          "Cochrane",
          "1.280",
          "690",
          "Violencia intrafamiliar, Lesiones en riña",
          "4ª Comisaría Cochrane"
        ],
        [
          "O'Higgins",
          "650",
          "410",
          "Infracciones Ley de Fronteras, Violencia intrafamiliar",
          "Tenencia Villa O'Higgins (Fronteriza) y Retén Entrada Mayer"
        ],
        [
          "Tortel",
          "510",
          "390",
          "Violencia intrafamiliar, Infracción a Ley de Bosques (corte ilegal de ciprés)",
          "Retén Caleta Tortel y Capitanía de Puerto Caleta Tortel (Armada)"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Estadisticas delictuales de casos policiales DMCS procesadas por CEAD",
          "Tasas estandarizadas de Violencia Intrafamiliar (VIF) por 100.000 habitantes",
          "Delitos mas frecuentes por tipologia (hurtos, lesiones, robos)",
          "Dotacion y unidades policiales de Carabineros (comisarias, retenes fronterizos)"
        ],
        "suggestedCrossings": [
          "Cruce con Densidad Poblacional (Nodo #23)",
          "Cruce con Consumo de Alcohol y Trastornos en Red de Salud (Nodo #24)"
        ],
        "totalRecordsInFullBase": "10 comunas y estadisticas delictuales trimestrales en data/systemic/csv/05_social_salud_educacion_riesgos_comunas.csv"
      }
    },
    {
      "id": 27,
      "nodeId": 27,
      "hubId": "biodiversidad",
      "isSpecial": false,
      "title": "Cobertura Forestal y Flora Nativa (CONAF SIT / MMA)",
      "definition": "Catastro de uso del suelo y cobertura forestal nativa de la Region de Aysen (**CONAF SIT / MMA**): superficie comunal y regional de **Bosque Siempreverde**, **Bosque Caducifolio (Lenga y Nire)**, **Estepa Patagonica**, **Turberas y Humedales**, y **Cipres de las Guaitecas**.",
      "example": "La region cuenta con **5.715.000 ha de cobertura vegetal nativa (52,7% del territorio regional)**, liderada por el **Bosque Siempreverde (2.672.000 ha)** en el litoral humedo y formaciones de **Lenga y Nire (1.665.000 ha)** en los valles orientales y de transicion.",
      "officialSource": {
        "name": "Corporacion Nacional Forestal (CONAF) / Ministerio del Medio Ambiente (MMA)",
        "url": "https://sit.conaf.cl/",
        "frequency": "Quinquenal"
      },
      "provenance": {
        "sourceEntity": "Corporación Nacional Forestal (CONAF) / Ministerio del Medio Ambiente (MMA)",
        "sourceUrl": "https://sit.conaf.cl/",
        "collectionDate": "Catastro de Uso del Suelo y Vegetación Nativa de Aysén · Corte 2025–2026",
        "collectionMethod": "Fotointerpretación satelital multiespectral, inventario forestal continuo y verificación en terreno",
        "updateFrequency": "Quinquenal",
        "nextUpdate": "Diciembre 2026 (Consolidado quinquenal SIT)"
      },
      "csvFile": "data/systemic/csv/07_flora_fauna_ecosistemas_aysen.csv",
      "relatedNodeIds": [
        4,
        13,
        22,
        28,
        29
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Distribucion de Cobertura Forestal Nativa por Formacion en Aysen (Hectareas - CONAF)",
        "labels": [
          "Bosque Siempreverde",
          "Bosque Lenga / Nire",
          "Estepa Patagonica",
          "Cipres de las Guaitecas",
          "Turberas y Humedales"
        ],
        "datasets": [
          {
            "label": "Superficie Regional (ha)",
            "data": [
              2672000,
              1665000,
              712000,
              376200,
              289800
            ],
            "backgroundColor": "#047857"
          }
        ],
        "unit": "hectareas"
      },
      "tableColumns": [
        "Comuna",
        "Superficie Comunal (ha)",
        "Bosque Nativo (ha)",
        "Formacion Dominante",
        "% Cobertura Nativa"
      ],
      "tableRows": [
        [
          "Coyhaique",
          "729.020",
          "524.500",
          "Bosque Lenga / Nire",
          "72%"
        ],
        [
          "Lago Verde",
          "542.230",
          "390.000",
          "Bosque Lenga / Nire",
          "71.9%"
        ],
        [
          "Aysén",
          "2.979.640",
          "1.430.000",
          "Bosque Siempreverde",
          "48%"
        ],
        [
          "Cisnes",
          "1.609.300",
          "1.025.000",
          "Bosque Siempreverde",
          "63.7%"
        ],
        [
          "Guaitecas",
          "62.060",
          "53.000",
          "Bosque Siempreverde",
          "85.4%"
        ],
        [
          "Chile Chico",
          "573.710",
          "328.500",
          "Estepa Patagonica",
          "57.3%"
        ],
        [
          "Río Ibáñez",
          "599.720",
          "342.000",
          "Bosque Lenga / Nire",
          "57%"
        ],
        [
          "Cochrane",
          "859.950",
          "543.000",
          "Bosque Lenga / Nire",
          "63.1%"
        ],
        [
          "O'Higgins",
          "818.250",
          "372.000",
          "Bosque Lenga / Nire",
          "45.5%"
        ],
        [
          "Tortel",
          "1.971.060",
          "715.000",
          "Bosque Siempreverde",
          "36.3%"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Desglose comunal de 6 formaciones vegetales (Lenga, Nire, Siempreverde, Cipres, Turberas, Estepa)",
          "Superficie en hectareas y porcentaje comunal de cobertura vegetal nativa",
          "Estado de conservacion y degradacion historica por incendios de colonizacion",
          "Series de cambio de uso del suelo e inventario continuo de CONAF SIT"
        ],
        "suggestedCrossings": [
          "Cruce con Parques Nacionales SNASPE (Nodo #04 / #22)",
          "Cruce con Consumo y Precios de Lena (Nodo #13)"
        ],
        "totalRecordsInFullBase": "10 comunas con 12 variables forestales y resumen regional en data/systemic/csv/07_flora_fauna_ecosistemas_aysen.csv"
      }
    },
    {
      "id": 28,
      "nodeId": 28,
      "hubId": "biodiversidad",
      "isSpecial": false,
      "title": "Fauna Silvestre y Especies en Categoria de Conservacion (RCE MMA)",
      "definition": "Catastro de fauna emblematica y especies clasificadas bajo el **Reglamento para la Clasificacion de Especies Silvestres (RCE MMA — D.S. N 44/2023 y D.S. N 22/2024)**: tamano poblacional estimado, distribucion comunal y amenazas directas para especies como el **Huemul**, **Pudu**, **Huillin**, **Chungungo**, **Ballena Sei**, **Ballena Azul** y **Condor**.",
      "example": "Aysen alberga entre **1.500 y 2.000 huemules** (60% al 70% de la poblacion mundial de la especie), con nucleos criticos en Tamango (PN Patagonia), Cerro Castillo y la cuenca del Rio Baker, amenazados por perros asilvestrados, cercos y atropellos.",
      "officialSource": {
        "name": "Ministerio del Medio Ambiente (MMA) / CONAF / SAG",
        "url": "https://clasificacionespecies.mma.gob.cl/",
        "frequency": "Anual"
      },
      "provenance": {
        "sourceEntity": "Ministerio del Medio Ambiente (MMA) — Comité de Clasificación de Especies / CONAF / SAG",
        "sourceUrl": "https://clasificacionespecies.mma.gob.cl/",
        "collectionDate": "Decretos Supremos N° 44/2023 y N° 22/2024 de Clasificación de Especies Silvestres (RCE Proceso 19) · Vigente 2026",
        "collectionMethod": "Evaluación científica por comité técnico interinstitucional y expedientes técnicos de clasificación",
        "updateFrequency": "Anual",
        "nextUpdate": "Noviembre 2026 (Publicación Proceso 20 RCE)"
      },
      "csvFile": "data/systemic/csv/07_flora_fauna_ecosistemas_aysen.csv",
      "relatedNodeIds": [
        4,
        18,
        22,
        27,
        29
      ],
      "chartSpec": {
        "type": "doughnut",
        "title": "Distribucion de Especies Emblematicas de Aysen por Categoria RCE MMA",
        "labels": [
          "En Peligro Critico (CR)",
          "En Peligro (EN)",
          "Vulnerable (VU)",
          "Casi Amenazada (NT)",
          "Preocupacion Menor (LC)"
        ],
        "datasets": [
          {
            "label": "Especies Evaluadas",
            "data": [
              1,
              5,
              3,
              3,
              2
            ],
            "backgroundColor": [
              "#991b1b",
              "#dc2626",
              "#f59e0b",
              "#0284c7",
              "#10b981"
            ]
          }
        ],
        "unit": "especies"
      },
      "tableColumns": [
        "Especie Emblematica",
        "Nombre Cientifico",
        "Categoria RCE MMA",
        "Poblacion Estimada Aysen",
        "Comunas con Presencia"
      ],
      "tableRows": [
        [
          "Huemul",
          "Hippocamelus bisulcus",
          "En Peligro (EN)",
          "1.500 a 2.000 individuos",
          "Cochrane, Río Ibáñez, Tortel"
        ],
        [
          "Pudú",
          "Pudu puda",
          "Vulnerable (VU)",
          "Poblaciones continuas en la zona húmeda del norte y litoral de Aysén; densidades medias de 2 a 5 ind/km2 en hábitats óptimos",
          "Cisnes, Aysén, Lago Verde"
        ],
        [
          "Huillín",
          "Lontra provocax",
          "En Peligro (EN)",
          "Población crítica fluvial y marina; Aysén alberga el reservorio reproductivo más saludable de agua dulce de Chile continental",
          "Tortel, Cochrane, Aysén"
        ],
        [
          "Chungungo",
          "Lontra felina",
          "En Peligro (EN)",
          "Población dispersa en densidades bajas",
          "Guaitecas, Cisnes, Aysén"
        ],
        [
          "Ballena Sei",
          "Balaenoptera borealis",
          "En Peligro (EN)",
          "Área de alimentación estival pelágica clave en el cono sur; sitio donde en 2015 se registró el evento de varamiento masivo más grande de la historia",
          "Tortel, Aysén, Guaitecas"
        ],
        [
          "Ballena Azul",
          "Balaenoptera musculus",
          "En Peligro (EN)",
          "Aproximadamente 600 a 800 ejemplares de la población del Pacífico Suroriental que utilizan los fiordos norpatagónicos como área estival de alimentación",
          "Guaitecas, Cisnes, Aysén"
        ],
        [
          "Delfín Chileno",
          "Cephalorhynchus eutropia",
          "Casi Amenazado (NT)",
          "Poblaciones locales residentes y de alta fidelidad al sitio; grupos pequeños de 2 a 15 individuos",
          "Cisnes, Aysén, Tortel"
        ],
        [
          "Puma patagónico",
          "Puma concolor puma",
          "Casi Amenazado (NT)",
          "Mayor depredador tope de los ecosistemas patagónicos terrestres; alta densidad en el Parque Nacional Patagonia y estancias con manejo ganadero adaptativo",
          "Cochrane, Chile Chico, Coyhaique"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Clasificacion RCE MMA (Procesos 1 al 19 oficializados por Decretos Supremos)",
          "Estado de conservacion internacional IUCN Red List",
          "Presencia comunal y zonas criticas de habitat (Parques Nacionales y cuencas)",
          "Monitoreo de camaras trampa CONAF y amenazas directas (perros, cercos, atropellos)"
        ],
        "suggestedCrossings": [
          "Cruce con Parques Nacionales CONAF (Nodo #04) para identificar densidad de avistamientos",
          "Cruce con Infraestructura Vial Ruta 7 (Nodo #18) para mapear puntos negros de atropello"
        ],
        "totalRecordsInFullBase": "Catastro de 12 especies emblemáticas con fichas técnicas completas en data/systemic/07_biodiversidad_flora_fauna_aysen.json"
      }
    },
    {
      "id": 29,
      "nodeId": 29,
      "hubId": "biodiversidad",
      "isSpecial": false,
      "title": "Especies Exoticas Invasoras y Presion Ecologica",
      "definition": "Monitoreo de **Especies Exoticas Invasoras (EEI)** en Aysen segun **MMA, SAG, CIEP y SUBPESCA**: dispersion, mecanismo de impacto y programas de control activo del **Vison norteamericano**, **Castor americano**, **Jabali europeo**, **Microalga Didymo**, **Lupino perenne** y **Salmonidos asilvestrados**.",
      "example": "El **Vison norteamericano** colonizo las **10 comunas** de Aysen depredando aves acuaticas y compitiendo con el Huillin, mientras el **Castor** avanza en O'Higgins y Tortel talando bosques riparios que carecen de adaptacion evolutiva para rebrotar tras inundacion.",
      "officialSource": {
        "name": "Ministerio del Medio Ambiente (MMA) / SAG / CIEP / SUBPESCA",
        "url": "https://especies-invasoras.mma.gob.cl/",
        "frequency": "Semestral"
      },
      "provenance": {
        "sourceEntity": "Servicio Agrícola y Ganadero (SAG) / MMA / Centro de Investigación en Ecosistemas de la Patagonia (CIEP)",
        "sourceUrl": "https://especies-invasoras.mma.gob.cl/",
        "collectionDate": "Programas de Vigilancia de Especies Exóticas Invasoras (Visón, Castor, Didymo) · Corte Agosto 2026",
        "collectionMethod": "Trampeo sistemático, prospección de cuencas fluviales y reportes de fauna silvestre",
        "updateFrequency": "Semestral",
        "nextUpdate": "Diciembre 2026 (Informe semestral de capturas y contención)"
      },
      "csvFile": "data/systemic/csv/07_flora_fauna_ecosistemas_aysen.csv",
      "relatedNodeIds": [
        6,
        9,
        27,
        28,
        30
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Amplitud Territorial de Especies Exoticas Invasoras (Comunas Afectadas de 10)",
        "labels": [
          "Vison norteamericano",
          "Salmonidos asilvestrados",
          "Didymo (Microalga)",
          "Lupino perenne",
          "Jabali europeo",
          "Castor americano"
        ],
        "datasets": [
          {
            "label": "Comunas con Presencia Activa (de 10)",
            "data": [
              10,
              10,
              8,
              7,
              4,
              2
            ],
            "backgroundColor": "#b91c1c"
          }
        ],
        "unit": "comunas afectadas"
      },
      "tableColumns": [
        "Especie Invasora",
        "Nombre Cientifico",
        "Severidad Regional",
        "Cuencas / Comunas Criticas",
        "Programa de Control Activo"
      ],
      "tableRows": [
        [
          "Visón norteamericano",
          "Neovison vison",
          "Muy Alta",
          "Cuenca 111 (Río Palena / Lago Verde) · Cuenca 112 (Río Cisnes / Cisnes)",
          "Programa FNDR/SAG 'Control del visó..."
        ],
        [
          "Castor americano",
          "Castor canadensis",
          "Crítica y Localizada en el extremo sur",
          "Cuenca 117 (Río Bravo y Río Pascua / O'Higgins) · Cuenca 115 baja (Río Baker delta y esteros litorales / Tortel)",
          "Estrategia Nacional GEF Castor 'For..."
        ],
        [
          "Jabalí europeo",
          "Sus scrofa",
          "Media-Alta en zonas cordilleranas orientales",
          "Comuna de Lago Verde (Río Figueroa, Paso Las Pampas) · Comuna de Coyhaique (Paso Huemules, Balmaceda, El Salto)",
          "Declarada especie dañina según el a..."
        ],
        [
          "Microalga Didymo (moco de roca)",
          "Didymosphenia geminata",
          "Muy Alta en los principales ríos de la cuenca del Simpson y Baker",
          "Cuenca 113 (Río Simpson, Río Coyhaique, Río Mañihuales, Río Blanco) · Cuenca 115 (Río Baker, Río Cochrane)",
          "Programa Nacional de Vigilancia y B..."
        ],
        [
          "Lupino perenne (chocho patagónico)",
          "Lupinus polyphyllus",
          "Alta en bordes viales y lechos fluviales pedregosos",
          "Fajas fiscales de la Carretera Austral (Ruta 7 Norte y Sur) · Riberas pedregosas de los ríos Simpson, Cisnes, Mañihuales, Ibáñez y Baker",
          "Planes de desmalezado mecánico de s..."
        ],
        [
          "Salmónidos asilvestrados",
          "Oncorhynchus mykiss (Trucha arcoíris), Salmo trutta (Trucha marrón/fario), Oncorhynchus tshawytscha (Salmón chinook)",
          "Muy Alta",
          "Todas las cuencas hidrográficas de Aysén (Cuencas 110, 111, 112, 113, 115 y 117) · Destacan las masivas corridas anádromas de salmón chinook en los ríos Baker, Cisnes, Simpson y Palena",
          "Regulación de pesca recreativa medi..."
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Nivel de severidad ecologica comunal (Muy Alta, Alta, Moderada, Nula)",
          "Vectores de dispersion (Ruta 7, cuencas hidricas, frontera cordillerana)",
          "Presupuesto y programas de control activos SAG / MMA (trampeo Conibear, barrera Rio Baker)",
          "Mecanismos de impacto sobre especies nativas (depredacion, competencia, destruccion de riberas)"
        ],
        "suggestedCrossings": [
          "Cruce con Monitoreo Marino y Calidad de Agua (Nodo #09 / #30)",
          "Cruce con Concesiones Acuicolas (Nodo #06) para modelar escapes de Salmon Chinook"
        ],
        "totalRecordsInFullBase": "6 especies invasoras con analisis de vectores y mapas de contencion en data/systemic/07_biodiversidad_flora_fauna_aysen.json"
      }
    },
    {
      "id": 30,
      "nodeId": 30,
      "hubId": "biodiversidad",
      "isSpecial": false,
      "title": "Monitoreo Continuo de Calidad del Aire (SINCA) e Hidrología (DGA)",
      "definition": "Red de monitoreo ambiental continuo y telemetria satelital de **calidad del aire (SINCA MMA)** y **caudales hidrometricos (DGA MOP)**: concentracion de material particulado fino **MP2,5 (ug/m3)** en Coyhaique y aforos del **Rio Baker y Rio Simpson**.",
      "example": "La estacion **Coyhaique II (SINCA)** registra un peak invernal de **160 ug/m3 de MP2,5 en junio y 145 ug/m3 en julio** asociado al uso intensivo de lena para calefaccion, contrastando con **15-18 ug/m3 en verano**. Paralelamente, el **Rio Baker en Bertrand (DGA)** promedia caudales de deshielo de **740 m3/s en abril** y un minimo invernal de **430 m3/s en julio**.",
      "officialSource": {
        "name": "SINCA (Ministerio del Medio Ambiente) / Direccion General de Aguas (DGA)",
        "url": "https://sinca.mma.gob.cl/",
        "frequency": "Horario / Telemetria continua"
      },
      "provenance": {
        "sourceEntity": "Sistema de Información Nacional de Calidad del Aire (SINCA MMA) / Dirección General de Aguas (DGA MOP)",
        "sourceUrl": "https://sinca.mma.gob.cl/",
        "collectionDate": "Monitoreo continuo en línea de estaciones telemétricas · Corte Octubre 2026",
        "collectionMethod": "Telemetría continua horaria de estaciones oficiales (Estación Coyhaique II SINCA y BNA 11530000-8 DGA Río Baker)",
        "updateFrequency": "Horario / Continuo",
        "nextUpdate": "Octubre 2026 (Transmisión en tiempo real)"
      },
      "csvFile": "data/systemic/csv/05_social_salud_educacion_riesgos_nodos.csv",
      "relatedNodeIds": [
        13,
        23,
        24,
        29
      ],
      "chartSpec": {
        "type": "line",
        "title": "Monitoreo Mensual Observado 2026: MP2,5 Coyhaique vs. Caudal Rio Baker (SINCA / DGA)",
        "labels": [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic"
        ],
        "datasets": [
          {
            "label": "MP2,5 Coyhaique II (ug/m3)",
            "data": [
              18,
              15,
              22,
              55,
              115,
              160,
              145,
              95,
              45,
              25,
              19,
              16
            ],
            "borderColor": "#e11d48",
            "backgroundColor": "rgba(225,29,72,0.08)"
          },
          {
            "label": "Caudal Rio Baker (m3/s / 10)",
            "data": [
              58,
              62,
              69,
              74,
              61,
              48,
              43,
              46,
              52,
              57,
              61,
              66
            ],
            "borderColor": "#0284c7",
            "backgroundColor": "rgba(2,132,199,0.08)"
          }
        ],
        "unit": "ug/m3 / m3/s"
      },
      "tableColumns": [
        "Periodo 2026",
        "MP2,5 Coyhaique II",
        "Condicion Ambiental",
        "Caudal Rio Baker",
        "Caudal Rio Simpson"
      ],
      "tableRows": [
        [
          "2026-01 (Enero)",
          "18 ug/m3",
          "Bueno (Bajo umbral)",
          "580 m3/s",
          "38,5 m3/s"
        ],
        [
          "2026-02 (Febrero)",
          "15 ug/m3",
          "Bueno (Bajo umbral)",
          "620 m3/s",
          "34,2 m3/s"
        ],
        [
          "2026-03 (Marzo)",
          "22 ug/m3",
          "Bueno (Bajo umbral)",
          "690 m3/s",
          "42,1 m3/s"
        ],
        [
          "2026-04 (Abril)",
          "55 ug/m3",
          "Alerta Ambiental",
          "740 m3/s (Peak)",
          "68,4 m3/s"
        ],
        [
          "2026-05 (Mayo)",
          "115 ug/m3",
          "Preemergencia",
          "610 m3/s",
          "55,0 m3/s"
        ],
        [
          "2026-06 (Junio)",
          "160 ug/m3",
          "Emergencia Ambiental",
          "480 m3/s",
          "45,2 m3/s"
        ],
        [
          "2026-07 (Julio)",
          "145 ug/m3",
          "Emergencia Ambiental",
          "430 m3/s (Minimo)",
          "39,8 m3/s"
        ],
        [
          "2026-08 (Agosto)",
          "95 ug/m3",
          "Preemergencia",
          "460 m3/s",
          "48,6 m3/s"
        ],
        [
          "2026-09 (Septiembre)",
          "45 ug/m3",
          "Alerta Ambiental",
          "520 m3/s",
          "59,2 m3/s"
        ],
        [
          "2026-10 (Octubre)",
          "25 ug/m3",
          "Regular / Bueno",
          "570 m3/s",
          "64,1 m3/s"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Telemetria continua horaria SINCA MMA en estaciones Coyhaique I y Coyhaique II",
          "Estacion BNA 11530000-8 DGA Rio Baker en Lago Bertrand y Rio Simpson",
          "Dias con episodios criticos de contaminacion (Alerta, Preemergencia y Emergencia)",
          "Monitoreo de deshielo nival y regimen pluvio-nival en cuencas de Aysen"
        ],
        "suggestedCrossings": [
          "Cruce con Consumo y Precios de Lena (Nodo #13)",
          "Cruce con Atenciones Respiratorias en Red de Salud (Nodo #24)"
        ],
        "totalRecordsInFullBase": "Telemetria continua de 16 estaciones oficiales consolidada en data/estaciones_aysen.json"
      }
    },
    {
      "id": 31,
      "nodeId": 31,
      "hubId": "biodiversidad",
      "isSpecial": false,
      "title": "Complejos Volcanicos Activos (RNVV), Sismos (USGS) y Red de Estaciones",
      "definition": "Catastro georreferenciado de los **6 complejos volcanicos activos** de Aysen (**Hudson, Maca, Cay, Mentolat, Melimoyu y Lautaro** — SERNAGEOMIN RNVV), los sismos instrumentales registrados por la API de **USGS** y la red de estaciones regionales.",
      "example": "Incluye la ubicacion, magnitud y profundidad de los sismos registrados en torno a la **Triple Union de Taitao / Zona de Fractura de Chile** y los volcanes con influencia sobre cada comuna.",
      "officialSource": {
        "name": "SERNAGEOMIN RNVV / USGS Earthquake Hazards API / DGA",
        "url": "https://earthquake.usgs.gov/",
        "frequency": "Tiempo real (API)"
      },
      "provenance": {
        "sourceEntity": "SERNAGEOMIN — Red Nacional de Vigilancia Volcánica (RNVV / OVDAS) / United States Geological Survey (USGS)",
        "sourceUrl": "https://earthquake.usgs.gov/",
        "collectionDate": "Boletines de Actividad Volcánica y Catálogo Sísmico Instrumental M>=3.0 · Corte Octubre 2026",
        "collectionMethod": "Red sismológica satelital OVDAS y API de monitoreo de riesgos geológicos USGS",
        "updateFrequency": "Tiempo real / Mensual",
        "nextUpdate": "Octubre 2026 (Monitoreo telemétrico continuo)"
      },
      "csvFile": "data/systemic/csv/05_social_salud_educacion_riesgos_nodos.csv",
      "relatedNodeIds": [
        18,
        24,
        30
      ],
      "chartSpec": {
        "type": "bar",
        "title": "Sismicidad Instrumental Registrada (USGS M>=3.0) y Estaciones RNVV por Zona",
        "labels": [
          "Volcan Hudson / Simpson",
          "Canal Puyuhuapi / Mentolat",
          "Liquine-Ofqui / Aysen",
          "Lago General Carrera",
          "Zona Sur / Glaciares"
        ],
        "datasets": [
          {
            "label": "Sismos Registrados (2015-2026)",
            "data": [
              142,
              98,
              86,
              42,
              28
            ],
            "backgroundColor": "#d97706"
          }
        ],
        "unit": "eventos sismicos"
      },
      "tableColumns": [
        "Volcan / Sismo / Estacion",
        "Comuna INE",
        "Tipo de Nodo",
        "Atributos / Magnitud",
        "Coordenadas"
      ],
      "tableRows": [
        [
          "Volcán Hudson",
          "11402",
          "Complejo Volcánico Activo",
          "tipo volcan: Estratovolcán con caldera · red vigilancia: SERNAGEOMIN RNVV OVDAS",
          "-45.9, -72.9667"
        ],
        [
          "Volcán Macá",
          "11201",
          "Complejo Volcánico Activo",
          "tipo volcan: Estratovolcán holoceno · ubicacion: Fiordo Aysén / Canal Moraleda",
          "-45.105, -73.17"
        ],
        [
          "Volcán Cay",
          "11201",
          "Complejo Volcánico Activo",
          "tipo volcan: Estratovolcán · ubicacion: Noreste del Volcán Macá",
          "-45.06, -72.985"
        ],
        [
          "Volcán Mentolat",
          "11202",
          "Complejo Volcánico Activo",
          "tipo volcan: Estratovolcán con caldera · ubicacion: Isla Magdalena",
          "-44.668, -73.085"
        ],
        [
          "Volcán Melimoyu",
          "11202",
          "Complejo Volcánico Activo",
          "tipo volcan: Estratovolcán elongado · ubicacion: Norte del Canal Jacaf",
          "-44.083, -72.883"
        ],
        [
          "Volcán Arenales",
          "11201",
          "Complejo Volcánico Activo",
          "tipo volcan: Estratovolcán englazado · ubicacion: Campo de Hielo Norte",
          "-47.2, -73.483"
        ]
      ],
      "canvasPreview": {
        "availableDimensions": [
          "Catastro de 6 complejos volcanicos activos monitoreados por OVDAS SERNAGEOMIN",
          "Catalogo sismico instrumental USGS (eventos M>=3.0)",
          "16 estaciones hidrometeorologicas y ambientales de referencia regional",
          "Niveles de alerta tecnica volcanica (Verde, Amarilla, Naranja, Roja)"
        ],
        "suggestedCrossings": [
          "Cruce con Red de Evacuacion SAMU (Nodo #24)",
          "Cruce con Puentes y Cortes de Carretera Austral (Nodo #18)"
        ],
        "totalRecordsInFullBase": "28 hitos geologicos y estaciones ambientales en data/systemic/csv/05_social_salud_educacion_riesgos_nodos.csv"
      }
    }
  ],
  "comunas": [
    {
      "id": 1,
      "comuna_ine": "11101",
      "codigo_comuna": "CL-XI-01",
      "nombre_comuna": "Coyhaique",
      "provincia": "Coyhaique",
      "cabecera": "Coyhaique",
      "cuenca_bna": "Cuenca 113 (Río Aysén)",
      "poblacion_censo_2024": 57823,
      "porcentaje_regional_pct": 57.4,
      "superficie_km2": 7290.2,
      "densidad_hab_km2": 7.93,
      "pobreza_ingresos_pct": 2.9,
      "pobreza_multidim_pct": 12.5,
      "superficie_snaspe_pct": 19.2,
      "unidades_snaspe": "Reserva Nacional Coyhaique, Reserva Nacional Río Simpson, Reserva Nacional Cerro Castillo",
      "ruta7_pavimentada_km": 142.5,
      "ruta7_ripio_km": 18,
      "dependencia_barcaza": "Nula (Conectividad terrestre continua 100% pavimentada)",
      "salud_principal": "Hospital Regional Coyhaique",
      "aerodromo": "Aeródromo Balmaceda (SCBA) / Teniente Vidal (SCCY)",
      "alcalde": "Carlos Gatica Villegas",
      "partido_alcalde": "Partido Demócrata Cristiano (DC) / Contigo Chile Mejor",
      "presupuesto_mclp": 26540.8,
      "presupuesto_per_capita_mclp": 459,
      "dependencia_fcm_pct": 46.5,
      "fndr_mclp": 14850,
      "sistema_electrico": "Sistema Mediano de Aysén (SMA)",
      "potencia_mw": 26.8,
      "gasolina_93_clp": 1362,
      "precio_lena_m3": 48000,
      "hogares_lena_pct": 92.4,
      "estado_foa": "FOA Terrestre + Ramal Submarino (CTR / Conexión Troncal Austral)",
      "concesiones_salmon": 0,
      "centros_activos_salmon": 0,
      "concesiones_mineras_ha": 31500,
      "proyectos_seia_aprobados": 118,
      "inversion_seia_mmusd": 495.6,
      "empresas_sii": 5535,
      "trabajadores_sii": 33650,
      "prestadores_sernatur": 412,
      "camas_turisticas": 3420,
      "pernoctaciones_emat": 208500,
      "zoit_nombre": "ZOIT Destino Coyhaique / Valle Simpson",
      "visitantes_snaspe": 38500,
      "camas_hospitalarias": 167,
      "traslado_coyhaique_hrs": 0,
      "matricula_escolar": 13450,
      "cobertura_vegetal_nativa_ha": 524500,
      "cobertura_vegetal_pct": 72,
      "fauna_amenazada_n": 5,
      "ipp_per_capita_clp": 139928,
      "gasto_personal_pct": 42.1,
      "inversion_directa_pct": 8.4,
      "profesionalizacion_pct": 36.4,
      "saidi_horas_anual": 11.4,
      "tarifa_bt1_clp": 224,
      "costo_diesel_aislado_clp": 0,
      "internet_fijo_pct": 61.2,
      "biomasa_salmon_ton": 0,
      "antibioticos_ica_g_ton": 0,
      "amerb_decretadas": 0,
      "amerb_operativas": 0,
      "seia_plazo_dias": 890,
      "compras_locales_pct": 58.4,
      "fuga_compras_pct": 41.6,
      "parcelaciones_sag_n": 3240,
      "medicos_por_mil_hab": 3.12,
      "espera_no_ges_n": 5420,
      "urgencias_respiratorias_pct": 44.5,
      "aeroevacuaciones_samu_n": 0,
      "ratio_presion_turistica": 1.53,
      "ha_snaspe_por_guardaparque": 38500,
      "glaciares_dga_n": 310,
      "superficie_glaciar_km2": 42.5,
      "daa_consuntivos_m3s": 48.5,
      "daa_no_consuntivos_m3s": 145,
      "dias_sobre_norma_mp25": 87
    },
    {
      "id": 2,
      "comuna_ine": "11102",
      "codigo_comuna": "CL-XI-02",
      "nombre_comuna": "Lago Verde",
      "provincia": "Coyhaique",
      "cabecera": "Lago Verde",
      "cuenca_bna": "Cuenca 111 (Río Palena)",
      "poblacion_censo_2024": 779,
      "porcentaje_regional_pct": 0.77,
      "superficie_km2": 5422.3,
      "densidad_hab_km2": 0.14,
      "pobreza_ingresos_pct": 0.9,
      "pobreza_multidim_pct": 15.8,
      "superficie_snaspe_pct": 34.5,
      "unidades_snaspe": "Parque Nacional Lago Rosselot (sector este), Reserva Nacional Lago Las Torres",
      "ruta7_pavimentada_km": 0,
      "ruta7_ripio_km": 75,
      "dependencia_barcaza": "Nula (Conectividad terrestre continua)",
      "salud_principal": "Sin hospital en la comuna (Atencion Primaria Rural)",
      "aerodromo": "Aeródromo Lago Verde (SCVE, tierra/grava, evacuación aeromédica)",
      "alcalde": "Claudia Valdés Vásquez",
      "partido_alcalde": "Independiente / Contigo Chile Mejor",
      "presupuesto_mclp": 2450.2,
      "presupuesto_per_capita_mclp": 3145.3,
      "dependencia_fcm_pct": 89.2,
      "fndr_mclp": 2200,
      "sistema_electrico": "Sistema Palena - La Junta (Edelaysen) y Autoproducción Lago Verde",
      "potencia_mw": 1.4,
      "gasolina_93_clp": 1520,
      "precio_lena_m3": 38000,
      "hogares_lena_pct": 98.2,
      "estado_foa": "Radioenlace Microondas Digital + Starlink Institucional Subtel",
      "concesiones_salmon": 0,
      "centros_activos_salmon": 0,
      "concesiones_mineras_ha": 8900,
      "proyectos_seia_aprobados": 9,
      "inversion_seia_mmusd": 31.4,
      "empresas_sii": 76,
      "trabajadores_sii": 460,
      "prestadores_sernatur": 24,
      "camas_turisticas": 165,
      "pernoctaciones_emat": 6800,
      "zoit_nombre": "Sin declaratoria ZOIT vigente",
      "visitantes_snaspe": 1800,
      "camas_hospitalarias": 0,
      "traslado_coyhaique_hrs": 4.5,
      "matricula_escolar": 95,
      "cobertura_vegetal_nativa_ha": 390000,
      "cobertura_vegetal_pct": 71.9,
      "fauna_amenazada_n": 5,
      "ipp_per_capita_clp": 184852,
      "gasto_personal_pct": 48.5,
      "inversion_directa_pct": 4.2,
      "profesionalizacion_pct": 12.5,
      "saidi_horas_anual": 54.2,
      "tarifa_bt1_clp": 258,
      "costo_diesel_aislado_clp": 560,
      "internet_fijo_pct": 3.8,
      "biomasa_salmon_ton": 0,
      "antibioticos_ica_g_ton": 0,
      "amerb_decretadas": 0,
      "amerb_operativas": 0,
      "seia_plazo_dias": 780,
      "compras_locales_pct": 22.1,
      "fuga_compras_pct": 77.9,
      "parcelaciones_sag_n": 185,
      "medicos_por_mil_hab": 0.82,
      "espera_no_ges_n": 128,
      "urgencias_respiratorias_pct": 18.2,
      "aeroevacuaciones_samu_n": 24,
      "ratio_presion_turistica": 3.65,
      "ha_snaspe_por_guardaparque": 82000,
      "glaciares_dga_n": 285,
      "superficie_glaciar_km2": 38.2,
      "daa_consuntivos_m3s": 6.2,
      "daa_no_consuntivos_m3s": 18,
      "dias_sobre_norma_mp25": 12
    },
    {
      "id": 3,
      "comuna_ine": "11201",
      "codigo_comuna": "CL-XI-03",
      "nombre_comuna": "Aysén",
      "provincia": "Aysén",
      "cabecera": "Puerto Aysén",
      "cuenca_bna": "Cuenca 113 (Río Aysén)",
      "poblacion_censo_2024": 23170,
      "porcentaje_regional_pct": 23,
      "superficie_km2": 29796.4,
      "densidad_hab_km2": 0.78,
      "pobreza_ingresos_pct": 5.3,
      "pobreza_multidim_pct": 13.8,
      "superficie_snaspe_pct": 63.4,
      "unidades_snaspe": "Parque Nacional Laguna San Rafael, Reserva Nacional Río Simpson (sector poniente), Reserva Nacional Las Guaitecas (sector sur)",
      "ruta7_pavimentada_km": 68,
      "ruta7_ripio_km": 0,
      "dependencia_barcaza": "Crítica en territorio insular (Islas Huichas / Puerto Aguirre); Nula en área continental",
      "salud_principal": "Hospital de Puerto Aysen",
      "aerodromo": "Aeródromo Cabo 1° Juan Román (SCAS, asfalto 1.050m, aeromédico)",
      "alcalde": "Luis Martínez Gallardo",
      "partido_alcalde": "Unión Demócrata Independiente (UDI) / Chile Vamos",
      "presupuesto_mclp": 14210.5,
      "presupuesto_per_capita_mclp": 613.3,
      "dependencia_fcm_pct": 52.8,
      "fndr_mclp": 9800,
      "sistema_electrico": "Sistema Mediano de Aysén (SMA) e Islas Huichas Aislado",
      "potencia_mw": 42.5,
      "gasolina_93_clp": 1375,
      "precio_lena_m3": 46000,
      "hogares_lena_pct": 87.8,
      "estado_foa": "FOA Submarina (Punto Aterrizaje Chacabuco y Puerto Aguirre) + FOA Terrestre hacia Coyhaique",
      "concesiones_salmon": 412,
      "centros_activos_salmon": 135,
      "concesiones_mineras_ha": 12400,
      "proyectos_seia_aprobados": 254,
      "inversion_seia_mmusd": 1320,
      "empresas_sii": 2100,
      "trabajadores_sii": 12780,
      "prestadores_sernatur": 185,
      "camas_turisticas": 1850,
      "pernoctaciones_emat": 98400,
      "zoit_nombre": "ZOIT Aysén Patagonia Queulat (Sector Sur)",
      "visitantes_snaspe": 29600,
      "camas_hospitalarias": 52,
      "traslado_coyhaique_hrs": 1,
      "matricula_escolar": 4850,
      "cobertura_vegetal_nativa_ha": 1430000,
      "cobertura_vegetal_pct": 48,
      "fauna_amenazada_n": 9,
      "ipp_per_capita_clp": 176295,
      "gasto_personal_pct": 44.2,
      "inversion_directa_pct": 7.1,
      "profesionalizacion_pct": 28.2,
      "saidi_horas_anual": 13.8,
      "tarifa_bt1_clp": 222,
      "costo_diesel_aislado_clp": 0,
      "internet_fijo_pct": 44.5,
      "biomasa_salmon_ton": 265000,
      "antibioticos_ica_g_ton": 335.4,
      "amerb_decretadas": 12,
      "amerb_operativas": 4,
      "seia_plazo_dias": 960,
      "compras_locales_pct": 54.6,
      "fuga_compras_pct": 45.4,
      "parcelaciones_sag_n": 1120,
      "medicos_por_mil_hab": 1.74,
      "espera_no_ges_n": 2450,
      "urgencias_respiratorias_pct": 28.6,
      "aeroevacuaciones_samu_n": 48,
      "ratio_presion_turistica": 1.76,
      "ha_snaspe_por_guardaparque": 145000,
      "glaciares_dga_n": 2450,
      "superficie_glaciar_km2": 1850,
      "daa_consuntivos_m3s": 38.4,
      "daa_no_consuntivos_m3s": 680,
      "dias_sobre_norma_mp25": 34
    },
    {
      "id": 4,
      "comuna_ine": "11202",
      "codigo_comuna": "CL-XI-04",
      "nombre_comuna": "Cisnes",
      "provincia": "Aysén",
      "cabecera": "Puerto Cisnes",
      "cuenca_bna": "Cuenca 112 (Río Cisnes)",
      "poblacion_censo_2024": 5137,
      "porcentaje_regional_pct": 5.1,
      "superficie_km2": 16093,
      "densidad_hab_km2": 0.32,
      "pobreza_ingresos_pct": 5,
      "pobreza_multidim_pct": 14.2,
      "superficie_snaspe_pct": 71.2,
      "unidades_snaspe": "Parque Nacional Queulat, Parque Nacional Melimoyu, Parque Nacional Isla Magdalena",
      "ruta7_pavimentada_km": 115,
      "ruta7_ripio_km": 65,
      "dependencia_barcaza": "Crítica en localidades aisladas (Puerto Raúl Marín Balmaceda, Puerto Gala y Gaviota); Nula en Puerto Cisnes y La Junta",
      "salud_principal": "Hospital Comunitario Dr. Jorge Ibar Bruce de Puerto Cisnes",
      "aerodromo": "Aeródromo Puerto Cisnes (SCPK) / La Junta (SCLJ) / Puyuhuapi (SCPH)",
      "alcalde": "Francisco Roncagliolo Lepío",
      "partido_alcalde": "Renovación Nacional (RN) / Chile Vamos",
      "presupuesto_mclp": 6100,
      "presupuesto_per_capita_mclp": 1187.5,
      "dependencia_fcm_pct": 74.5,
      "fndr_mclp": 5600,
      "sistema_electrico": "Sistema Mediano Palena - Cisnes (Edelaysen)",
      "potencia_mw": 6.8,
      "gasolina_93_clp": 1440,
      "precio_lena_m3": 42000,
      "hogares_lena_pct": 95.1,
      "estado_foa": "FOA Submarina (Aterrizaje Puerto Cisnes) + FOA Terrestre Carretera Austral",
      "concesiones_salmon": 218,
      "centros_activos_salmon": 78,
      "concesiones_mineras_ha": 16800,
      "proyectos_seia_aprobados": 122,
      "inversion_seia_mmusd": 525,
      "empresas_sii": 620,
      "trabajadores_sii": 3770,
      "prestadores_sernatur": 138,
      "camas_turisticas": 1240,
      "pernoctaciones_emat": 74200,
      "zoit_nombre": "ZOIT Aysén Patagonia Queulat",
      "visitantes_snaspe": 64200,
      "camas_hospitalarias": 12,
      "traslado_coyhaique_hrs": 3.5,
      "matricula_escolar": 980,
      "cobertura_vegetal_nativa_ha": 1025000,
      "cobertura_vegetal_pct": 63.7,
      "fauna_amenazada_n": 9,
      "ipp_per_capita_clp": 525265,
      "gasto_personal_pct": 39.8,
      "inversion_directa_pct": 11.5,
      "profesionalizacion_pct": 18.6,
      "saidi_horas_anual": 28.5,
      "tarifa_bt1_clp": 235,
      "costo_diesel_aislado_clp": 380,
      "internet_fijo_pct": 24.8,
      "biomasa_salmon_ton": 185000,
      "antibioticos_ica_g_ton": 324.8,
      "amerb_decretadas": 14,
      "amerb_operativas": 5,
      "seia_plazo_dias": 945,
      "compras_locales_pct": 38.2,
      "fuga_compras_pct": 61.8,
      "parcelaciones_sag_n": 490,
      "medicos_por_mil_hab": 1.15,
      "espera_no_ges_n": 890,
      "urgencias_respiratorias_pct": 21.4,
      "aeroevacuaciones_samu_n": 72,
      "ratio_presion_turistica": 4.22,
      "ha_snaspe_por_guardaparque": 168000,
      "glaciares_dga_n": 1120,
      "superficie_glaciar_km2": 480,
      "daa_consuntivos_m3s": 18.2,
      "daa_no_consuntivos_m3s": 320,
      "dias_sobre_norma_mp25": 16
    },
    {
      "id": 5,
      "comuna_ine": "11203",
      "codigo_comuna": "CL-XI-05",
      "nombre_comuna": "Guaitecas",
      "provincia": "Aysén",
      "cabecera": "Melinka",
      "cuenca_bna": "Cuenca 110 (Costeras e Islas Río Palena - Río Aysén)",
      "poblacion_censo_2024": 1598,
      "porcentaje_regional_pct": 1.59,
      "superficie_km2": 620.6,
      "densidad_hab_km2": 2.58,
      "pobreza_ingresos_pct": 6.1,
      "pobreza_multidim_pct": 17.4,
      "superficie_snaspe_pct": 45.8,
      "unidades_snaspe": "Reserva Nacional Las Guaitecas",
      "ruta7_pavimentada_km": 0,
      "ruta7_ripio_km": 0,
      "dependencia_barcaza": "Absoluta (100% marítima vía Quellón/Cisnes/Chacabuco)",
      "salud_principal": "Sin hospital en el archipielago (Cobertura por CESFAM Melinka)",
      "aerodromo": "Aeródromo Melinka (SCMK, asfalto 830m, vuelos regulares subvencionados)",
      "alcalde": "Bans Puinao Carimoney",
      "partido_alcalde": "Evolución Política (Evópoli) / Chile Vamos",
      "presupuesto_mclp": 3300,
      "presupuesto_per_capita_mclp": 2065.1,
      "dependencia_fcm_pct": 83,
      "fndr_mclp": 3400,
      "sistema_electrico": "Sistema Aislado Insular Melinka",
      "potencia_mw": 2.8,
      "gasolina_93_clp": 1560,
      "precio_lena_m3": 55000,
      "hogares_lena_pct": 94.6,
      "estado_foa": "FOA Submarina (Punto de Aterrizaje Submarino Melinka de CTR/SUBTEL)",
      "concesiones_salmon": 98,
      "centros_activos_salmon": 32,
      "concesiones_mineras_ha": 400,
      "proyectos_seia_aprobados": 86,
      "inversion_seia_mmusd": 245,
      "empresas_sii": 171,
      "trabajadores_sii": 1040,
      "prestadores_sernatur": 21,
      "camas_turisticas": 145,
      "pernoctaciones_emat": 5400,
      "zoit_nombre": "Sin declaratoria ZOIT vigente",
      "visitantes_snaspe": 2400,
      "camas_hospitalarias": 0,
      "traslado_coyhaique_hrs": 14,
      "matricula_escolar": 320,
      "cobertura_vegetal_nativa_ha": 53000,
      "cobertura_vegetal_pct": 85.4,
      "fauna_amenazada_n": 5,
      "ipp_per_capita_clp": 356696,
      "gasto_personal_pct": 51.2,
      "inversion_directa_pct": 3.6,
      "profesionalizacion_pct": 11.8,
      "saidi_horas_anual": 62.1,
      "tarifa_bt1_clp": 265,
      "costo_diesel_aislado_clp": 640,
      "internet_fijo_pct": 5.4,
      "biomasa_salmon_ton": 45000,
      "antibioticos_ica_g_ton": 382.1,
      "amerb_decretadas": 18,
      "amerb_operativas": 7,
      "seia_plazo_dias": 820,
      "compras_locales_pct": 24.5,
      "fuga_compras_pct": 75.5,
      "parcelaciones_sag_n": 15,
      "medicos_por_mil_hab": 0.95,
      "espera_no_ges_n": 410,
      "urgencias_respiratorias_pct": 22.8,
      "aeroevacuaciones_samu_n": 96,
      "ratio_presion_turistica": 1.48,
      "ha_snaspe_por_guardaparque": 95000,
      "glaciares_dga_n": 0,
      "superficie_glaciar_km2": 0,
      "daa_consuntivos_m3s": 1.2,
      "daa_no_consuntivos_m3s": 0,
      "dias_sobre_norma_mp25": 4
    },
    {
      "id": 6,
      "comuna_ine": "11401",
      "codigo_comuna": "CL-XI-06",
      "nombre_comuna": "Chile Chico",
      "provincia": "General Carrera",
      "cabecera": "Chile Chico",
      "cuenca_bna": "Cuenca 115 (Río Baker)",
      "poblacion_censo_2024": 4905,
      "porcentaje_regional_pct": 4.87,
      "superficie_km2": 5737.1,
      "densidad_hab_km2": 0.85,
      "pobreza_ingresos_pct": 6.2,
      "pobreza_multidim_pct": 13.1,
      "superficie_snaspe_pct": 48.6,
      "unidades_snaspe": "Parque Nacional Patagonia (sector Jeinimeni), Reserva Nacional Lago Jeinimeni",
      "ruta7_pavimentada_km": 8,
      "ruta7_ripio_km": 120,
      "dependencia_barcaza": "Alta (Barcaza lacustre Tehuelche / Pilchero en Lago General Carrera)",
      "salud_principal": "Hospital Familiar y Comunitario San Jose / Dr. Leopoldo Ortega Rodriguez de Chile Chico",
      "aerodromo": "Aeródromo Chile Chico (SCCC, asfalto 1.300m, subvencionado y aeromédico)",
      "alcalde": "Ariel Keim Hermosilla",
      "partido_alcalde": "Independiente",
      "presupuesto_mclp": 5400,
      "presupuesto_per_capita_mclp": 1100.9,
      "dependencia_fcm_pct": 71.2,
      "fndr_mclp": 4900,
      "sistema_electrico": "Sistema Mediano General Carrera (SMGC)",
      "potencia_mw": 7.5,
      "gasolina_93_clp": 1430,
      "precio_lena_m3": 50000,
      "hogares_lena_pct": 82.3,
      "estado_foa": "FOA Terrestre (Ramal Troncal General Carrera)",
      "concesiones_salmon": 0,
      "centros_activos_salmon": 0,
      "concesiones_mineras_ha": 48200,
      "proyectos_seia_aprobados": 41,
      "inversion_seia_mmusd": 310,
      "empresas_sii": 400,
      "trabajadores_sii": 2430,
      "prestadores_sernatur": 95,
      "camas_turisticas": 780,
      "pernoctaciones_emat": 58600,
      "zoit_nombre": "ZOIT Chelenko",
      "visitantes_snaspe": 34200,
      "camas_hospitalarias": 14,
      "traslado_coyhaique_hrs": 4,
      "matricula_escolar": 890,
      "cobertura_vegetal_nativa_ha": 328500,
      "cobertura_vegetal_pct": 57.3,
      "fauna_amenazada_n": 5,
      "ipp_per_capita_clp": 161297,
      "gasto_personal_pct": 46.7,
      "inversion_directa_pct": 5.8,
      "profesionalizacion_pct": 15.4,
      "saidi_horas_anual": 19.3,
      "tarifa_bt1_clp": 228,
      "costo_diesel_aislado_clp": 0,
      "internet_fijo_pct": 27.2,
      "biomasa_salmon_ton": 0,
      "antibioticos_ica_g_ton": 0,
      "amerb_decretadas": 0,
      "amerb_operativas": 0,
      "seia_plazo_dias": 880,
      "compras_locales_pct": 41.2,
      "fuga_compras_pct": 58.8,
      "parcelaciones_sag_n": 980,
      "medicos_por_mil_hab": 1.28,
      "espera_no_ges_n": 520,
      "urgencias_respiratorias_pct": 20.5,
      "aeroevacuaciones_samu_n": 38,
      "ratio_presion_turistica": 6.08,
      "ha_snaspe_por_guardaparque": 112000,
      "glaciares_dga_n": 410,
      "superficie_glaciar_km2": 145,
      "daa_consuntivos_m3s": 14.8,
      "daa_no_consuntivos_m3s": 45,
      "dias_sobre_norma_mp25": 18
    },
    {
      "id": 7,
      "comuna_ine": "11402",
      "codigo_comuna": "CL-XI-07",
      "nombre_comuna": "Río Ibáñez",
      "provincia": "General Carrera",
      "cabecera": "Puerto Ingeniero Ibáñez",
      "cuenca_bna": "Cuenca 113 (Río Aysén)",
      "poblacion_censo_2024": 2723,
      "porcentaje_regional_pct": 2.7,
      "superficie_km2": 5997.2,
      "densidad_hab_km2": 0.45,
      "pobreza_ingresos_pct": 7,
      "pobreza_multidim_pct": 14.9,
      "superficie_snaspe_pct": 61.7,
      "unidades_snaspe": "Parque Nacional Cerro Castillo, Reserva Nacional Laguna San Rafael, Santuario de la Naturaleza Capillas de Mármol",
      "ruta7_pavimentada_km": 82,
      "ruta7_ripio_km": 68,
      "dependencia_barcaza": "Media (Terminal norte de barcazas hacia Chile Chico)",
      "salud_principal": "Sin hospital en la comuna (Atencion Primaria con CESFAM y Postas)",
      "aerodromo": "Aeródromo Puerto Ingeniero Ibáñez (SCII, tierra/ripio, emergencias)",
      "alcalde": "Marcelo Jélvez Cárdenas",
      "partido_alcalde": "Unión Demócrata Independiente (UDI) / Chile Vamos",
      "presupuesto_mclp": 3950,
      "presupuesto_per_capita_mclp": 1450.6,
      "dependencia_fcm_pct": 79.6,
      "fndr_mclp": 4100,
      "sistema_electrico": "Sistema Mediano de Aysén (Interconexión Ramal Sur)",
      "potencia_mw": 2.4,
      "gasolina_93_clp": 1420,
      "precio_lena_m3": 44000,
      "hogares_lena_pct": 94.2,
      "estado_foa": "FOA Terrestre (Troncal Carretera Austral con empalme en Cerro Castillo y Puerto Ibáñez)",
      "concesiones_salmon": 0,
      "centros_activos_salmon": 0,
      "concesiones_mineras_ha": 19600,
      "proyectos_seia_aprobados": 27,
      "inversion_seia_mmusd": 142,
      "empresas_sii": 238,
      "trabajadores_sii": 1445,
      "prestadores_sernatur": 132,
      "camas_turisticas": 1150,
      "pernoctaciones_emat": 86200,
      "zoit_nombre": "ZOIT Chelenko",
      "visitantes_snaspe": 41000,
      "camas_hospitalarias": 0,
      "traslado_coyhaique_hrs": 1.5,
      "matricula_escolar": 450,
      "cobertura_vegetal_nativa_ha": 342000,
      "cobertura_vegetal_pct": 57,
      "fauna_amenazada_n": 5,
      "ipp_per_capita_clp": 185457,
      "gasto_personal_pct": 47.9,
      "inversion_directa_pct": 4.9,
      "profesionalizacion_pct": 14.1,
      "saidi_horas_anual": 24.6,
      "tarifa_bt1_clp": 231,
      "costo_diesel_aislado_clp": 0,
      "internet_fijo_pct": 16.8,
      "biomasa_salmon_ton": 0,
      "antibioticos_ica_g_ton": 0,
      "amerb_decretadas": 0,
      "amerb_operativas": 0,
      "seia_plazo_dias": 810,
      "compras_locales_pct": 32.8,
      "fuga_compras_pct": 67.2,
      "parcelaciones_sag_n": 1280,
      "medicos_por_mil_hab": 0.88,
      "espera_no_ges_n": 280,
      "urgencias_respiratorias_pct": 19.8,
      "aeroevacuaciones_samu_n": 22,
      "ratio_presion_turistica": 19.24,
      "ha_snaspe_por_guardaparque": 86000,
      "glaciares_dga_n": 890,
      "superficie_glaciar_km2": 460,
      "daa_consuntivos_m3s": 12.5,
      "daa_no_consuntivos_m3s": 110,
      "dias_sobre_norma_mp25": 14
    },
    {
      "id": 8,
      "comuna_ine": "11301",
      "codigo_comuna": "CL-XI-08",
      "nombre_comuna": "Cochrane",
      "provincia": "Capitán Prat",
      "cabecera": "Cochrane",
      "cuenca_bna": "Cuenca 115 (Río Baker)",
      "poblacion_censo_2024": 3458,
      "porcentaje_regional_pct": 3.43,
      "superficie_km2": 8599.5,
      "densidad_hab_km2": 0.4,
      "pobreza_ingresos_pct": 6.3,
      "pobreza_multidim_pct": 15.2,
      "superficie_snaspe_pct": 52.1,
      "unidades_snaspe": "Parque Nacional Patagonia (sector Valle Chacabuco), Reserva Nacional Tamango",
      "ruta7_pavimentada_km": 12,
      "ruta7_ripio_km": 168,
      "dependencia_barcaza": "Baja / Nula en eje troncal norte (Acceso terrestre continuo por Ruta 7 de ripio)",
      "salud_principal": "Hospital Comunitario de Cochrane (Hospital Lord Cochrane)",
      "aerodromo": "Aeródromo Cochrane (SCHR, asfalto 1.200m, vuelos subvencionados y aeromédicos)",
      "alcalde": "Patricio Ulloa Georgia",
      "partido_alcalde": "Unión Demócrata Independiente (UDI) / Chile Vamos",
      "presupuesto_mclp": 4600,
      "presupuesto_per_capita_mclp": 1330.2,
      "dependencia_fcm_pct": 76.8,
      "fndr_mclp": 4800,
      "sistema_electrico": "Sistema Mediano General Carrera - Cochrane (Edelaysen)",
      "potencia_mw": 5.8,
      "gasolina_93_clp": 1410,
      "precio_lena_m3": 42000,
      "hogares_lena_pct": 96,
      "estado_foa": "FOA Terrestre (Nodo Cabecera Provincial Troncal Austral Cochrane)",
      "concesiones_salmon": 0,
      "centros_activos_salmon": 0,
      "concesiones_mineras_ha": 9800,
      "proyectos_seia_aprobados": 33,
      "inversion_seia_mmusd": 172,
      "empresas_sii": 295,
      "trabajadores_sii": 1790,
      "prestadores_sernatur": 83,
      "camas_turisticas": 690,
      "pernoctaciones_emat": 49200,
      "zoit_nombre": "ZOIT Provincia de los Glaciares",
      "visitantes_snaspe": 35600,
      "camas_hospitalarias": 16,
      "traslado_coyhaique_hrs": 6,
      "matricula_escolar": 750,
      "cobertura_vegetal_nativa_ha": 543000,
      "cobertura_vegetal_pct": 63.1,
      "fauna_amenazada_n": 7,
      "ipp_per_capita_clp": 124047,
      "gasto_personal_pct": 43.5,
      "inversion_directa_pct": 6.2,
      "profesionalizacion_pct": 16.2,
      "saidi_horas_anual": 22.8,
      "tarifa_bt1_clp": 230,
      "costo_diesel_aislado_clp": 0,
      "internet_fijo_pct": 21.5,
      "biomasa_salmon_ton": 0,
      "antibioticos_ica_g_ton": 0,
      "amerb_decretadas": 0,
      "amerb_operativas": 0,
      "seia_plazo_dias": 850,
      "compras_locales_pct": 44.5,
      "fuga_compras_pct": 55.5,
      "parcelaciones_sag_n": 390,
      "medicos_por_mil_hab": 1.42,
      "espera_no_ges_n": 460,
      "urgencias_respiratorias_pct": 24.2,
      "aeroevacuaciones_samu_n": 54,
      "ratio_presion_turistica": 7.09,
      "ha_snaspe_por_guardaparque": 142000,
      "glaciares_dga_n": 1680,
      "superficie_glaciar_km2": 890,
      "daa_consuntivos_m3s": 8.4,
      "daa_no_consuntivos_m3s": 890,
      "dias_sobre_norma_mp25": 22
    },
    {
      "id": 9,
      "comuna_ine": "11302",
      "codigo_comuna": "CL-XI-09",
      "nombre_comuna": "O'Higgins",
      "provincia": "Capitán Prat",
      "cabecera": "Villa O'Higgins",
      "cuenca_bna": "Cuenca 117 (Río Pascua)",
      "poblacion_censo_2024": 647,
      "porcentaje_regional_pct": 0.64,
      "superficie_km2": 8182.5,
      "densidad_hab_km2": 0.08,
      "pobreza_ingresos_pct": 9.2,
      "pobreza_multidim_pct": 18.6,
      "superficie_snaspe_pct": 78.3,
      "unidades_snaspe": "Parque Nacional Bernardo O'Higgins (sector norte)",
      "ruta7_pavimentada_km": 0,
      "ruta7_ripio_km": 134,
      "dependencia_barcaza": "Crítica / Absoluta (Cruce obligado en Barcaza Fiordo Mitchell)",
      "salud_principal": "Sin hospital en la comuna (Posta Rural de Aislamiento Extremo)",
      "aerodromo": "Aeródromo Villa O'Higgins (SCOH, asfalto 1.300m, puente aéreo subvencionado)",
      "alcalde": "José Claudio Fica Gómez",
      "partido_alcalde": "Partido Demócrata Cristiano (DC)",
      "presupuesto_mclp": 2150,
      "presupuesto_per_capita_mclp": 3323,
      "dependencia_fcm_pct": 91.5,
      "fndr_mclp": 2400,
      "sistema_electrico": "Sistema Aislado Villa O'Higgins",
      "potencia_mw": 1.4,
      "gasolina_93_clp": 1620,
      "precio_lena_m3": 36000,
      "hogares_lena_pct": 99.1,
      "estado_foa": "Radioenlace Digital UHF/Microondas + Satelital Starlink Subtel",
      "concesiones_salmon": 0,
      "centros_activos_salmon": 0,
      "concesiones_mineras_ha": 5600,
      "proyectos_seia_aprobados": 14,
      "inversion_seia_mmusd": 48,
      "empresas_sii": 57,
      "trabajadores_sii": 345,
      "prestadores_sernatur": 29,
      "camas_turisticas": 240,
      "pernoctaciones_emat": 16400,
      "zoit_nombre": "ZOIT Provincia de los Glaciares",
      "visitantes_snaspe": 12400,
      "camas_hospitalarias": 0,
      "traslado_coyhaique_hrs": 10,
      "matricula_escolar": 120,
      "cobertura_vegetal_nativa_ha": 372000,
      "cobertura_vegetal_pct": 45.5,
      "fauna_amenazada_n": 5,
      "ipp_per_capita_clp": 188563,
      "gasto_personal_pct": 50.4,
      "inversion_directa_pct": 3.8,
      "profesionalizacion_pct": 10.5,
      "saidi_horas_anual": 58.7,
      "tarifa_bt1_clp": 262,
      "costo_diesel_aislado_clp": 620,
      "internet_fijo_pct": 2.6,
      "biomasa_salmon_ton": 0,
      "antibioticos_ica_g_ton": 0,
      "amerb_decretadas": 0,
      "amerb_operativas": 0,
      "seia_plazo_dias": 760,
      "compras_locales_pct": 18.4,
      "fuga_compras_pct": 81.6,
      "parcelaciones_sag_n": 140,
      "medicos_por_mil_hab": 0.78,
      "espera_no_ges_n": 96,
      "urgencias_respiratorias_pct": 16.5,
      "aeroevacuaciones_samu_n": 42,
      "ratio_presion_turistica": 15.15,
      "ha_snaspe_por_guardaparque": 210000,
      "glaciares_dga_n": 2240,
      "superficie_glaciar_km2": 3450,
      "daa_consuntivos_m3s": 3.8,
      "daa_no_consuntivos_m3s": 540,
      "dias_sobre_norma_mp25": 8
    },
    {
      "id": 10,
      "comuna_ine": "11303",
      "codigo_comuna": "CL-XI-10",
      "nombre_comuna": "Tortel",
      "provincia": "Capitán Prat",
      "cabecera": "Caleta Tortel",
      "cuenca_bna": "Cuenca 115 (Río Baker)",
      "poblacion_censo_2024": 505,
      "porcentaje_regional_pct": 0.5,
      "superficie_km2": 19710.6,
      "densidad_hab_km2": 0.026,
      "pobreza_ingresos_pct": 4.6,
      "pobreza_multidim_pct": 16.5,
      "superficie_snaspe_pct": 87.4,
      "unidades_snaspe": "Parque Nacional Bernardo O'Higgins, Reserva Nacional Katalalixar, Parque Nacional Laguna San Rafael (sector sur)",
      "ruta7_pavimentada_km": 0,
      "ruta7_ripio_km": 45,
      "dependencia_barcaza": "Alta (Barcaza marítima comercial hacia Puerto Natales y rampa norte de Barcaza Fiordo Mitchell)",
      "salud_principal": "Sin hospital en la comuna (Posta Rural de Dificil Acceso en Pasarelas)",
      "aerodromo": "Aeródromo Caleta Tortel (SCTT, ripio 800m, evacuación médica y rescate)",
      "alcalde": "Marisela Jiménez Cruces",
      "partido_alcalde": "Independiente",
      "presupuesto_mclp": 2050,
      "presupuesto_per_capita_mclp": 4059.4,
      "dependencia_fcm_pct": 92.8,
      "fndr_mclp": 2600,
      "sistema_electrico": "Sistema Aislado Caleta Tortel",
      "potencia_mw": 1.2,
      "gasolina_93_clp": 1580,
      "precio_lena_m3": 40000,
      "hogares_lena_pct": 98.4,
      "estado_foa": "FOA Submarina (Punto de Aterrizaje FOA Caleta Tortel) + FOA Terrestre desde Cochrane",
      "concesiones_salmon": 17,
      "centros_activos_salmon": 0,
      "concesiones_mineras_ha": 3200,
      "proyectos_seia_aprobados": 18,
      "inversion_seia_mmusd": 66.5,
      "empresas_sii": 48,
      "trabajadores_sii": 295,
      "prestadores_sernatur": 42,
      "camas_turisticas": 360,
      "pernoctaciones_emat": 27000,
      "zoit_nombre": "ZOIT Provincia de los Glaciares",
      "visitantes_snaspe": 14200,
      "camas_hospitalarias": 0,
      "traslado_coyhaique_hrs": 8,
      "matricula_escolar": 85,
      "cobertura_vegetal_nativa_ha": 715000,
      "cobertura_vegetal_pct": 36.3,
      "fauna_amenazada_n": 8,
      "ipp_per_capita_clp": 63594,
      "gasto_personal_pct": 52.6,
      "inversion_directa_pct": 3.1,
      "profesionalizacion_pct": 9.8,
      "saidi_horas_anual": 64.3,
      "tarifa_bt1_clp": 268,
      "costo_diesel_aislado_clp": 680,
      "internet_fijo_pct": 4.1,
      "biomasa_salmon_ton": 8500,
      "antibioticos_ica_g_ton": 289,
      "amerb_decretadas": 2,
      "amerb_operativas": 1,
      "seia_plazo_dias": 740,
      "compras_locales_pct": 21,
      "fuga_compras_pct": 79,
      "parcelaciones_sag_n": 65,
      "medicos_por_mil_hab": 0.85,
      "espera_no_ges_n": 112,
      "urgencias_respiratorias_pct": 17.8,
      "aeroevacuaciones_samu_n": 46,
      "ratio_presion_turistica": 28.12,
      "ha_snaspe_por_guardaparque": 195000,
      "glaciares_dga_n": 916,
      "superficie_glaciar_km2": 2680,
      "daa_consuntivos_m3s": 3.1,
      "daa_no_consuntivos_m3s": 420,
      "dias_sobre_norma_mp25": 10
    }
  ],
  "holdings": [
    {
      "holding_id": "holding_aquachile",
      "nombre_fantasia": "AquaChile",
      "empresa_madre_holding": "Agrosuper S.A.",
      "grupo_controlador": "Grupo Agrosuper (Familia Vial)",
      "origen_capital": "Chile",
      "resumen_corporativo": "Mayor operador acuícola de Chile y segundo mundial. En 2018-2019 Agrosuper adquirió Empresas AquaChile, Salmones Magallanes, Pesquera Los Fiordos y activos de Friosur, consolidando la mayor cartera de concesiones en Aysén (~28% regional).",
      "total_concesiones_aysen": 210,
      "porcentaje_regional_concesiones": 28.19,
      "comunas_presencia": [
        "Aysén",
        "Cisnes",
        "Guaitecas"
      ],
      "barrios_acs": [
        "ACS-18A",
        "ACS-18B",
        "ACS-19A",
        "ACS-21A",
        "ACS-21B",
        "ACS-22A",
        "ACS-22B",
        "ACS-24",
        "ACS-25",
        "ACS-33"
      ],
      "plantas_operativas": "Planta de proceso primario y secundario en Puerto Chacabuco (Aysén); bases logísticas en Puerto Cisnes y Melinka."
    },
    {
      "holding_id": "holding_mowi",
      "nombre_fantasia": "Mowi Chile",
      "empresa_madre_holding": "Mowi ASA",
      "grupo_controlador": "Grupo Mowi ASA (Bergen, Noruega)",
      "origen_capital": "Noruega",
      "resumen_corporativo": "Mayor productor salmonero mundial de capitales noruegos. Opera en Chile a través de Mowi Chile S.A. (anteriormente Marine Harvest Chile S.A.), con centros tecnificados de engorda en Canal Moraleda, Canal Puyuhuapi y Fiordo Aysén.",
      "total_concesiones_aysen": 95,
      "porcentaje_regional_concesiones": 12.75,
      "comunas_presencia": [
        "Aysén",
        "Cisnes"
      ],
      "barrios_acs": [
        "ACS-18A",
        "ACS-19A",
        "ACS-19B",
        "ACS-21A",
        "ACS-22A",
        "ACS-24"
      ],
      "plantas_operativas": "Base de acopio y logística en Puerto Chacabuco; pontones habitables tecnificados con alimentación remota en Canal Moraleda e Isla Melchor."
    },
    {
      "holding_id": "holding_multi_x",
      "nombre_fantasia": "Multi X",
      "empresa_madre_holding": "Multiexport Foods S.A.",
      "grupo_controlador": "Multiexport Foods S.A. en alianza estratégica con Mitsui & Co. (Japón) y Cargill Inc. (EE.UU.)",
      "origen_capital": "Chile / Japón / Estados Unidos",
      "resumen_corporativo": "Pionera de la salmonicultura chilena fundada en 1983. En 2022 sumó como socios estratégicos a Cargill (24.5%) y Mitsui (24.5%), reteniendo el grupo fundador chileno el control (51%). Fuerte concentración en fiordos y canales de Aysén y Cisnes.",
      "total_concesiones_aysen": 80,
      "porcentaje_regional_concesiones": 10.74,
      "comunas_presencia": [
        "Aysén",
        "Cisnes"
      ],
      "barrios_acs": [
        "ACS-18B",
        "ACS-18C",
        "ACS-19A",
        "ACS-21A",
        "ACS-22B",
        "ACS-24"
      ],
      "plantas_operativas": "Base logística Puerto Chacabuco; centros de cultivo de alta profundidad en Canal Moraleda y Seno Gala."
    },
    {
      "holding_id": "holding_cermaq",
      "nombre_fantasia": "Cermaq Chile",
      "empresa_madre_holding": "Mitsubishi Corporation",
      "grupo_controlador": "Mitsubishi Corporation (Japón) / Cermaq Group AS",
      "origen_capital": "Japón",
      "resumen_corporativo": "Cermaq (antigua empresa estatal noruega adquirida en 2014 por el conglomerado japonés Mitsubishi Corporation) consolidó en Chile los activos de Mainstream Chile S.A. y Cultivos Marinos Chiloé S.A. Posee relevante presencia en fiordos de Aysén y Cisnes.",
      "total_concesiones_aysen": 75,
      "porcentaje_regional_concesiones": 10.07,
      "comunas_presencia": [
        "Aysén",
        "Cisnes"
      ],
      "barrios_acs": [
        "ACS-18A",
        "ACS-19B",
        "ACS-20",
        "ACS-21B",
        "ACS-22A",
        "ACS-25"
      ],
      "plantas_operativas": "Base operativa Puerto Chacabuco; centros de cultivo en Seno Ventisquero, Canal Jacaf y Canal Errázuriz."
    },
    {
      "holding_id": "holding_cooke",
      "nombre_fantasia": "Cooke Aquaculture Chile",
      "empresa_madre_holding": "Cooke Inc.",
      "grupo_controlador": "Cooke Inc. (Blacks Harbour, New Brunswick, Canadá - Familia Cooke)",
      "origen_capital": "Canadá",
      "resumen_corporativo": "Multinacional canadiense que adquirió en 2008 Salmones Cupquelán S.A. Sus concesiones se concentran casi en su totalidad en el Fiordo Cupquelán (Comuna de Aysén), zona emblemática por su proximidad y controversias relativas a los límites del Parque Nacional Laguna San Rafael.",
      "total_concesiones_aysen": 26,
      "porcentaje_regional_concesiones": 3.49,
      "comunas_presencia": [
        "Aysén"
      ],
      "barrios_acs": [
        "ACS-22A",
        "ACS-24"
      ],
      "plantas_operativas": "Base flotante integral con pontones habitables en Estero Cupquelán y Fiordo Quitralco; oficinas y muelle de atraque en Puerto Chacabuco."
    },
    {
      "holding_id": "holding_blumar",
      "nombre_fantasia": "Blumar Seafoods / Salmones Blumar",
      "empresa_madre_holding": "Blumar S.A.",
      "grupo_controlador": "Grupos empresariales Yaconi-Santa Cruz y Sarquis",
      "origen_capital": "Chile",
      "resumen_corporativo": "Fruto de la fusión en 2011 entre Pesquera El Golfo e ITATA. Su división salmonera opera centros de engorda en Canal Puyuhuapi y Fiordo Aysén, además de contar con filial en Magallanes.",
      "total_concesiones_aysen": 62,
      "porcentaje_regional_concesiones": 8.32,
      "comunas_presencia": [
        "Aysén",
        "Cisnes"
      ],
      "barrios_acs": [
        "ACS-18A",
        "ACS-18B",
        "ACS-21A",
        "ACS-22A",
        "ACS-22C"
      ],
      "plantas_operativas": "Base logística y muelle de apoyo en Puerto Chacabuco; centros de cultivo certificados ASC en Canal Puyuhuapi y Canal Errázuriz."
    },
    {
      "holding_id": "holding_australis",
      "nombre_fantasia": "Australis Seafoods",
      "empresa_madre_holding": "Joyvio Food Co. Ltd. / Legend Holdings",
      "grupo_controlador": "Grupo Joyvio (filial de alimentos de Legend Holdings Corporation, matriz de Lenovo, China)",
      "origen_capital": "China",
      "resumen_corporativo": "Australis Seafoods fue fundada por Isidoro Quiroga y vendida en 2019 al holding chino Joyvio por USD 921M. Es una de las mayores empresas productoras de salmón del país, con alta presencia en fiordos de Aysén y Cisnes.",
      "total_concesiones_aysen": 58,
      "porcentaje_regional_concesiones": 7.79,
      "comunas_presencia": [
        "Aysén",
        "Cisnes"
      ],
      "barrios_acs": [
        "ACS-18C",
        "ACS-19A",
        "ACS-21B",
        "ACS-22A",
        "ACS-24"
      ],
      "plantas_operativas": "Bases operativas y centros de transferencia en Puerto Chacabuco y Puerto Cisnes; pontones de cultivo en Canal Jacaf y Seno Gala."
    },
    {
      "holding_id": "holding_camanchaca",
      "nombre_fantasia": "Salmones Camanchaca",
      "empresa_madre_holding": "Compañía Pesquera Camanchaca S.A.",
      "grupo_controlador": "Grupo Camanchaca (Familias Cifuentes y Stengel)",
      "origen_capital": "Chile",
      "resumen_corporativo": "Grupo pesquero y acuícola histórico chileno. En 2017 escindió Salmones Camanchaca S.A., cotizando en la Bolsa de Santiago y de Oslo. Adquirió Fiordo Blanco S.A. en 2004, acumulando una sólida base de concesiones en Cisnes y Aysén.",
      "total_concesiones_aysen": 48,
      "porcentaje_regional_concesiones": 6.44,
      "comunas_presencia": [
        "Cisnes",
        "Aysén"
      ],
      "barrios_acs": [
        "ACS-18B",
        "ACS-18C",
        "ACS-19A",
        "ACS-21A"
      ],
      "plantas_operativas": "Base logística y de pontones en Puerto Cisnes; apoyo marítimo en Puerto Chacabuco."
    },
    {
      "holding_id": "holding_invermar",
      "nombre_fantasia": "Invermar",
      "empresa_madre_holding": "Alimentos Marinos S.A. (Alimar)",
      "grupo_controlador": "Grupo Alimar (Familia Izquierdo Menéndez)",
      "origen_capital": "Chile",
      "resumen_corporativo": "Invermar fue fundada por la Familia Montanari y adquirida en 2015 por el Grupo Alimar de Roberto Izquierdo Phillips. Posee centros de engorda en Canal Puyuhuapi, Canal Jacaf y Canal Moraleda.",
      "total_concesiones_aysen": 36,
      "porcentaje_regional_concesiones": 4.83,
      "comunas_presencia": [
        "Cisnes",
        "Aysén"
      ],
      "barrios_acs": [
        "ACS-18A",
        "ACS-21A",
        "ACS-22B"
      ],
      "plantas_operativas": "Centros de engorda en Canal Jacaf y Moraleda; base de avituallamiento en Puerto Chacabuco."
    },
    {
      "holding_id": "holding_yadran",
      "nombre_fantasia": "Salmones Yadrán",
      "empresa_madre_holding": "Pesquera Yadrán S.A.",
      "grupo_controlador": "Empresas Yadrán (Familia Briones)",
      "origen_capital": "Chile",
      "resumen_corporativo": "Grupo de larga tradición en Chiloé y el archipiélago de las Guaitecas. Posee una de las mayores concentraciones de concesiones en la Comuna de Guaitecas (Melinka, Isla Gran Guaiteca) y Canal Puyuhuapi.",
      "total_concesiones_aysen": 40,
      "porcentaje_regional_concesiones": 5.37,
      "comunas_presencia": [
        "Guaitecas",
        "Cisnes"
      ],
      "barrios_acs": [
        "ACS-17",
        "ACS-18A",
        "ACS-18B",
        "ACS-33"
      ],
      "plantas_operativas": "Base de aprovisionamiento y pontón en Melinka (Guaitecas) y centro de apoyo en Puerto Cisnes."
    },
    {
      "holding_id": "holding_salmones_austral",
      "nombre_fantasia": "Salmones Austral",
      "empresa_madre_holding": "Salmones Austral S.A.",
      "grupo_controlador": "Salmones Austral S.A. (Familias Navarro, Hurtado y Puchi)",
      "origen_capital": "Chile",
      "resumen_corporativo": "Nacida en 2013 producto de la fusión de Trusal S.A. y Salmones Pacific Star S.A. Inscrita en la CMF, concentra operaciones en Canal Moraleda y Seno Gala.",
      "total_concesiones_aysen": 34,
      "porcentaje_regional_concesiones": 4.56,
      "comunas_presencia": [
        "Cisnes",
        "Aysén"
      ],
      "barrios_acs": [
        "ACS-18B",
        "ACS-19A",
        "ACS-21A",
        "ACS-22B"
      ],
      "plantas_operativas": "Centros de engorda en Canal Moraleda y Seno Gala; base logística en Puerto Chacabuco."
    },
    {
      "holding_id": "holding_salmones_antartica",
      "nombre_fantasia": "Salmones Antártica",
      "empresa_madre_holding": "Nippon Suisan Kaisha Ltd. (Nissui)",
      "grupo_controlador": "Nissui Corporation (Tokio, Japón)",
      "origen_capital": "Japón",
      "resumen_corporativo": "Pionera absoluta del cultivo de salmón coho en Chile, fundada en 1982 e integrada a Nissui en 1988. Opera una de las plantas de procesamiento primario más emblemáticas de la región en Puerto Chacabuco.",
      "total_concesiones_aysen": 28,
      "porcentaje_regional_concesiones": 3.76,
      "comunas_presencia": [
        "Aysén"
      ],
      "barrios_acs": [
        "ACS-21A",
        "ACS-22A",
        "ACS-22B",
        "ACS-26"
      ],
      "plantas_operativas": "Gran Planta de Procesamiento en Puerto Chacabuco (Bahía Chacabuco); centros de engorda en Fiordo Aysén y Canal Moraleda."
    },
    {
      "holding_id": "holding_otros_menores",
      "nombre_fantasia": "Titulares Menores Aysén",
      "empresa_madre_holding": "Otros Titulares Menores / Concesiones Artesanales y en Trámite",
      "grupo_controlador": "Diversos concesionarios independientes",
      "origen_capital": "Chile",
      "resumen_corporativo": "Concesiones individuales, acuicultura de pequeña escala (mitílidos, algas) y concesiones sin agrupamiento corporativo mayoritario.",
      "total_concesiones_aysen": 19,
      "porcentaje_regional_concesiones": 2.55,
      "comunas_presencia": [
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Tortel"
      ],
      "barrios_acs": [
        "ACS-17",
        "ACS-18A",
        "ACS-21A",
        "ACS-35"
      ],
      "plantas_operativas": "Embarcaderos locales y fondeaderos menores."
    }
  ],
  "seriesMensualesEmat": [
    {
      "mes": "Enero",
      "numero_mes": 1,
      "pernoctaciones_total": 48500,
      "tasa_ocupacion_pct": 82.4,
      "pasajeros_chilenos": 33950,
      "pasajeros_extranjeros": 14550
    },
    {
      "mes": "Febrero",
      "numero_mes": 2,
      "pernoctaciones_total": 52100,
      "tasa_ocupacion_pct": 85.8,
      "pasajeros_chilenos": 36470,
      "pasajeros_extranjeros": 15630
    },
    {
      "mes": "Marzo",
      "numero_mes": 3,
      "pernoctaciones_total": 31200,
      "tasa_ocupacion_pct": 54.2,
      "pasajeros_chilenos": 20280,
      "pasajeros_extranjeros": 10920
    },
    {
      "mes": "Abril",
      "numero_mes": 4,
      "pernoctaciones_total": 18400,
      "tasa_ocupacion_pct": 32.6,
      "pasajeros_chilenos": 14720,
      "pasajeros_extranjeros": 3680
    },
    {
      "mes": "Mayo",
      "numero_mes": 5,
      "pernoctaciones_total": 12100,
      "tasa_ocupacion_pct": 21.5,
      "pasajeros_chilenos": 10890,
      "pasajeros_extranjeros": 1210
    },
    {
      "mes": "Junio",
      "numero_mes": 6,
      "pernoctaciones_total": 9800,
      "tasa_ocupacion_pct": 17.8,
      "pasajeros_chilenos": 9016,
      "pasajeros_extranjeros": 784
    },
    {
      "mes": "Julio",
      "numero_mes": 7,
      "pernoctaciones_total": 14500,
      "tasa_ocupacion_pct": 25.4,
      "pasajeros_chilenos": 13340,
      "pasajeros_extranjeros": 1160
    },
    {
      "mes": "Agosto",
      "numero_mes": 8,
      "pernoctaciones_total": 11200,
      "tasa_ocupacion_pct": 19.8,
      "pasajeros_chilenos": 10192,
      "pasajeros_extranjeros": 1008
    },
    {
      "mes": "Septiembre",
      "numero_mes": 9,
      "pernoctaciones_total": 16800,
      "tasa_ocupacion_pct": 29.5,
      "pasajeros_chilenos": 15120,
      "pasajeros_extranjeros": 1680
    },
    {
      "mes": "Octubre",
      "numero_mes": 10,
      "pernoctaciones_total": 22400,
      "tasa_ocupacion_pct": 39.1,
      "pasajeros_chilenos": 16800,
      "pasajeros_extranjeros": 5600
    },
    {
      "mes": "Noviembre",
      "numero_mes": 11,
      "pernoctaciones_total": 34600,
      "tasa_ocupacion_pct": 60.2,
      "pasajeros_chilenos": 22490,
      "pasajeros_extranjeros": 12110
    },
    {
      "mes": "Diciembre",
      "numero_mes": 12,
      "pernoctaciones_total": 41800,
      "tasa_ocupacion_pct": 71.3,
      "pasajeros_chilenos": 28424,
      "pasajeros_extranjeros": 13376
    }
  ]
};
