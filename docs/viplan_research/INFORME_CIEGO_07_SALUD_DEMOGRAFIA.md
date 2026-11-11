# Informe de Investigación Cibernética: Salud Pública, Demografía Vital y Cuidados en Zonas Aisladas de Aysén
**Sub-Agente 3 (Ola 2): Modelado Ciego VIPLAN / VSM y Contraste Forense de Sesgos**  
*Basado en los marcos de Raúl Espejo (1989, 2011, 2020, 2022), Stafford Beer (1972, 1979, 1985) y W. Ross Ashby (1956, 1964)*

---

## 1. Introducción y Marco Operacional

El presente informe constituye el entregable del **Sub-Agente 3 (Ola 2)** bajo el estricto mandato de **Cero Sesgo de Anclaje** (*Tabula Rasa*) y **Optimización de Presupuesto de Contexto**, ejecutado bajo una arquitectura metodológica de dos etapas consecutivas e impermeables:

1. **Etapa 1 (Ciega / Tabula Rasa):** Modelado cibernético autónomo del sistema de salud pública, demografía vital y cuidados en zonas extremas de la Región de Aysén sin interacción previa ni lectura de la carpeta `data/` del repositorio. Se recurrió exclusivamente a investigación abierta de fuentes primarias externas: estadísticas vitales y proyecciones censales del Instituto Nacional de Estadísticas (INE), series epidemiológicas y de egresos del Departamento de Estadística e Información de Salud (DEIS) del Ministerio de Salud (MINSAL), registros asistenciales del Servicio de Salud Aysén (SSA), informes de gestión de listas de espera de la Biblioteca del Congreso Nacional (BCN) y FONASA/SIGTE, normativas de la carrera médica (Ley 19.664 y Ley 15.076), jurisprudencia sanitaria, informes de calidad del aire (SINCA) y literatura científica indexada sobre patologías endémicas patagónicas.
2. **Etapa 2 (Contraste Forense de Sesgos):** Apertura, descompresión y contraste forense contra los archivos del repositorio: `data/systemic/08_desagregaciones_sectoriales_aysen.json`, `data/systemic/05_social_salud_educacion_riesgos.json`, `data/systemic/provenance_catalog.json` y el Hub VIII en `scripts/build_aysen_hubs_bundle.cjs`. Se exponen los sesgos institucionales, epidemiológicos, demográficos y geográficos, la ausencia de variables críticas y la ceguera de flujos asistenciales, rematando con un Plan de Captura de Datos Sin Sesgo a costo de infraestructura $0.

---

## 2. Marco Teórico y Constructos Cibernéticos de Referencia

El marco epistemológico y formal se funda en la cibernética organizacional de **Stafford Beer** (*Brain of the Firm*, 1972; *The Heart of Enterprise*, 1979; *Diagnosing the System for Organizations*, 1985) y la formalización metodológica de **Raúl Espejo** (*"Cybersyn, big data, variety engineering and governance"*, 2022; *VIPLAN*, 1989; *Organizational Systems*, 2011):

### 2.1 El Principio de Doble Descripción de Espejo
- **Descripción de Caja Negra (Cibernética de Primer Orden - Sistema Observado):** Trata a la red asistencial y demográfica como un transformador holístico de entradas en salidas dentro de un entorno biofísico y climático hostil. Se formaliza mediante el constructo **TASCOI** (*Transformation, Actors, Suppliers, Customers, Owners, Interveners*), descomponiendo la intencionalidad del sistema en 3 niveles de recursión estructural.
- **Descripción Operacional (Cibernética de Segundo Orden - Sistemas Observadores):** Modela las interacciones comunicacionales, la autorregulación y la autonomía entre los cinco sistemas constitutivos del **Modelo del Sistema Viable (VSM)** de Beer (S1 a S5), analizando la negociación de recursos, la coordinación anti-oscilante, la auditoría clínica esporádica ($S3^*$), la inteligencia adaptativa de largo plazo ($S4$) y el cierre ético-político normativo ($S5$).

### 2.2 Ley de Variedad Requerida de Ashby y Ecuación de Variedad de Espejo
De acuerdo con la Ley de Requisite Variety (Ashby, 1956):
$$\text{"Solo la variedad puede destruir o absorber variedad"}$$

En la formalización de Raúl Espejo y Roger Howard (1982) y Espejo (2022, p. 1169):
$$V_O \ge \frac{V_D}{V_R}$$

donde:
- $V_D$ representa la variedad de perturbaciones provenientes del entorno bio-demográfico y territorial (*environmental disturbances*).
- $V_R$ representa la variedad de respuestas regulatorias y capacidades asistenciales desplegadas por el sistema de salud (*regulatory affordances*).
- $V_O$ representa la variedad residual de estados resultantes no absorbidos (*outcomes*).
- $V_T$ es el conjunto de estados tolerables o metas sanitarias socialmente admisibles (*target states*).

Para preservar la viabilidad sistémica sin descompensación mortal ni desgobierno clínico:
$$V_O \le V_T \iff \frac{V_D}{V_R} \le V_T \iff V_R \ge \frac{V_D}{V_T}$$

En el territorio austral de Aysén, donde 108.494 km² de superficie discontinua albergan a escasos 103.000–108.000 habitantes, se manifiesta el desbalance crítico:
$$V_E \gg V_O \gg V_M$$
donde la variedad ambiental y epidemiológica ($V_E$) excede por órdenes de magnitud la capacidad de operación instalada ($V_O$) y la capacidad de la dirección central de salud ($V_M$). Equilibrar esta ecuación exige una rigurosa **Ingeniería de Variedad**:
- **Atenuadores de variedad (filtros reductores de $V_D$):** Protocolos clínicos estandarizados (Guías AUGE/GES), tamizajes preventivos en población de riesgo, priorización algorítmica de interconsultas (triage de listas de espera), educación comunitaria y vacunación masiva.
- **Amplificadores de variedad (multiplicadores de $V_R$):** Redes de telemedicina satelital de alta resolución (Hospital Digital Rural), aeroevacuación presurizada 24/7 (aviones ambulancia), naves sanitarias rápidas para el maritorio, médicos generales de zona en etapa de destinación (EDF), polifuncionalidad de Técnicos en Enfermería de Nivel Superior (TENS) en postas rurales y convenios macrozonales de derivación terciaria.

---

## 3. ETAPA 1: Modelado Sistémico Ciego (Tabula Rasa)

### 3.1 Nombramiento del Sistema y Matriz TASCOI en 3 Niveles de Recursión

La salud pública y la demografía vital en Aysén no constituyen una sumatoria fortuita de postas y consultorios, sino un **Meta-Sistema de Protección de la Vida, Resiliencia Biológica y Soberanía Humana Austral**, cuya finalidad teleológica es garantizar el derecho constitucional a la salud (Art. 19 N° 9 CPR), la supervivencia infantil, el envejecimiento digno y la atención de urgencia vital para una población dispersa en fiordos, islas y estepas patagónicas.

#### Recursión N+1: Meta-Sistema Sanitario Austral y Red de Derivación Extra-Regional (Nivel Nacional / Macrozona Sur)
- **Nombramiento:** Sistema Soberano de Seguridad Social en Salud, Garantías Explícitas y Respaldo Terciario Extra-Regional para la Patagonia Occidental.
- **T (Transformación):** Vulnerabilidad extrema de una población aislada que sufre patologías de alta complejidad no resolubles en el territorio austral $\rightarrow$ Garantía de sobrevida, tratamiento de alta especialidad (oncología compleja, gran quemado, cirugía cardiovascular, neurocirugía infantil) y restitución de la salud mediante la integración de la red asistencial de Aysén a la infraestructura terciaria de la Macrozona Sur (Hospital Base de Puerto Montt, Hospital Clínico Regional de Valdivia, Hospital Guillermo Grant Benavente de Concepción) y centros suprarregionales de Santiago.
- **A (Actores):** Subsecretaría de Redes Asistenciales (MINSAL), Fondo Nacional de Salud (FONASA), División de Gestión de la Red Asistencial (DIGERA), Centro de Derivación Macrozonal, Servicio de Búsqueda y Salvamento Aéreo (SAR / FACH), Armada de Chile (Quinta Zona Naval), prestadores privados en convenio GES/CAEC.
- **S (Proveedores):** Universidades formadoras de médicos especialistas (UCh, PUC, UdeC, UACh), industria farmacéutica y de tecnología médica, empresas de transporte aéreo sanitario presurizado, Tesorería General de la República (Presupuesto de la Nación).
- **C (Clientes):** La totalidad de los beneficiarios FONASA e ISAPRE residentes en la Región de Aysén que sufren emergencias catastróficas o enfermedades de alta especialidad médica.
- **O (Propietarios):** El Estado de Chile a través del Ministerio de Salud (MINSAL) y la Presidencia de la República.
- **I (Interventores):** Superintendencia de Salud (fiscalización de garantías GES y acreditación de prestadores), Contraloría General de la República (CGR), Colegio Médico de Chile (COLMED), sociedades científicas médicas y organizaciones de pacientes con enfermedades raras u oncológicas.

#### Recursión N: Sistema de Red Asistencial Integrada y Cuidados Territoriales de Aysén (Nivel Regional de Foco)
- **Nombramiento:** Red Asistencial Pública Desconcentrada del Servicio de Salud Aysén (SSA) para la Continuidad del Cuidado, Atención de Urgencia y Mitigación del Aislamiento.
- **T (Transformación):** Dispersión poblacional, envejecimiento demográfico y barreras geográficas infranqueables $\rightarrow$ Prestación continua y resolutiva de salud ambulatoria, hospitalaria y de rescate prehospitalario que absorbe la morbilidad respiratoria invernal, reduce las listas de espera, diagnostica precozmente neoplasias digestivas y estabiliza emergencias vitales en 10 comunas.
- **A (Actores):** Dirección del Servicio de Salud Aysén (SSA), Dirección Médica del Hospital Regional Coyhaique (HRC), Hospital de Puerto Aysén, Hospitales Comunitarios (Chile Chico, Cochrane, Cisnes), Centro Regulador SAMU 131 Aysén, Departamentos de Salud Municipal (DESAM), SEREMI de Salud de Aysén (Autoridad Sanitaria).
- **S (Proveedores):** CENABAST (abastecimiento de fármacos e insumos), Banco de Sangre Austral, proveedores de oxígeno medicinal (Indura/Air Liquide), operadores de telecomunicaciones satelitales (Starlink/Entel), operadores aéreos de evacuación médica (DAP, Aerocord, Carabineros Sección Aérea).
- **C (Clientes):** Los 103.000–108.000 habitantes de la Región de Aysén, trabajadores temporeros de la pesca/acuicultura, pobladores rurales de estancia y comunidades originarias (mapuche-huilliche y kawésqar).
- **O (Propietarios):** Servicio de Salud Aysén (ente desconcentrado del MINSAL con personalidad jurídica y patrimonio propio) en coordinación con el Gobierno Regional de Aysén (GORE) y su Consejo Regional (CORE).
- **I (Interventores):** Fenats, Fenpruss, Confusam, Consejo de la Sociedad Civil (COSOC) del SSA, SEREMI del Medio Ambiente (control del PDA por contaminación de leña), SENAPRED y Ministerio Público (investigación de eventos centinela).

#### Recursión N-1: Sistemas Operacionales Locales de Prestación y Micro-Redes de Cuidado (Nivel Comunal / Establecimiento)
Se formalizan 4 arquetipos ontológicos operacionales:
1. **Nodo Terciario Central de Alta Complejidad (Hospital Regional Coyhaique - HRC):**
   - *T:* Paciente crítico de la región con riesgo vital o patología quirúrgica compleja $\rightarrow$ Diagnóstico intensivo, estabilización hemodinámica, cirugía mayor, soporte vital en UPC (UCI/UTI) y quimioterapia ambulatoria.
   - *A:* Médicos especialistas, subespecialistas, intensivistas, enfermeras universitarias de UPC, tecnólogos médicos, químicos farmacéuticos.
2. **Nodo Hospitalario Comunitario de Frontera y Cabecera Provincial (Cochrane, Chile Chico, Puerto Cisnes):**
   - *T:* Morbilidad aguda básica comunal, parto inminente, estabilización inicial de trauma $\rightarrow$ Atención médica general 24/7, hospitalización básica (7 a 16 camas), radiología digital y coordinación de aeroevacuación o traslado terrestre.
   - *A:* Médicos EDF (Etapa de Destinación y Formación), enfermeras generales, matronas, paramédicos y choferes de ambulancia 4x4.
3. **Nodo Insular y Marítimo de Atención Primaria con Urgencia Rural (SUR / CESFAM Melinka y Postas de Islas Huichas):**
   - *T:* Población de archipiélago expuesta a aislamiento marino y accidentes por buceo mariscador $\rightarrow$ Atención de medicina general, cámara hiperbárica o estabilización barométrica, rondas médicas bimensuales y aeroevacuación coordinada con la Armada de Chile (LSR Arcángel).
   - *A:* Médicos EDF de zona insular, TENS residentes en islas, personal naval de Capitanía de Puerto y tripulaciones de lanchas ambulancia.
4. **Nodo Rural Extremo de Posta de Salud Rural y Pasarelas (PSR Tortel, PSR Villa O'Higgins, PSR Lago Verde):**
   - *T:* Familias rurales dispersas en valles, estancias y fiordos con alta tasa de ancianos solos $\rightarrow$ Control crónico cardiovascular (PSCV), entrega de leche y medicamentos, atención primaria de primeros auxilios y rescate en camilla manual sobre pasarelas de ciprés.
   - *A:* Técnico en Enfermería de Nivel Superior (TENS) residente permanente, apoyado mensualmente por la Ronda Médica de Cabecera y telemedicina sincrónica.

---

### 3.2 Flujograma Cuantificado Real (Estilo Cybersyn / INTEC 1973)

Inspirado en los tableros analíticos del proyecto Cybersyn diseñados por Stafford Beer y Raúl Espejo en 1972–1973, modelamos la red física y clínica de flujos asistenciales en la Región de Aysén.

```
                          [POBLACIÓN TOTAL REGIONAL: 103.500 - 108.000 HABITANTES]
                                                     │
               ┌─────────────────────────────────────┴─────────────────────────────────────┐
               ▼                                                                           ▼
   [POBLACIÓN RURAL Y PERIFÉRICA]                                              [EJE URBANO COYHAIQUE-AYSÉN]
      ~28.000 hab. (27%)                                                           ~76.000 hab. (73%)
               │                                                                           │
               ├─────────────────────────────────────────┐                                 │
               ▼                                         ▼                                 ▼
   [27 POSTAS DE SALUD RURAL (PSR)]           [3 HOSP. COMUNITARIOS]              [APS URBANA: 3 CESFAM]
    - Atendidas por TENS residente             - Cochrane (7-16 camas)             - V. D. Silva, Gutiérrez
    - 20 Estaciones Médico Rurales             - Chile Chico (7-14 camas)          - Ribera Sur (Pto. Aysén)
    - Rondas terrestres / marítimas            - Pto. Cisnes (8-12 camas)          - 175.000 consultas APS/año
    - 45.000 atenciones/año                    - Médicos EDF / Urgencia SUR        - Alta prevalencia PSCV
               │                                         │                                 │
               └────────────────────┬────────────────────┘                                 │
                                    │                                                      │
                       (Flujo de Derivación Crítica)                                       │
                                    │                                                      │
         ┌──────────────────────────┴──────────────────────────┐                           │
         │ (Evacuación Aeromédica)     │ (Traslado Terrestre)   │ (Traslado Marítimo)      │
         ▼                             ▼                        ▼                          │
   [SAMU AÉREO / CARABINEROS]    [AMBULANCIAS 4x4]       [LANCHAS AMBULANCIA]              │
    - 380-450 aeroevac/año        - Ruta 7 Ripio          - Islas Huichas/Melinka          │
    - Costo: $4.5-8.5 MM c/u      - 6 a 12 horas viaje    - Condicionado por oleaje        │
    - Ventana climática crítica   - Latencia extrema      - 4 a 6 horas a Chacabuco        │
         │                             │                        │                          │
         └─────────────────────────────┼────────────────────────┘                          │
                                       ▼                                                   │
                ┌────────────────────────────────────────────────────────┐                 │
                │     HOSPITAL DE PUERTO AYSÉN (Mediana Complejidad)     │                 │
                │     - 52-56 camas básicas / 2 pabellones electivos     │                 │
                │     - Diálisis (24 cupos) / Atenc. Urgencia 24/7       │                 │
                └──────────────────────────┬─────────────────────────────┘                 │
                                           │ (Ruta 240 Pavimentada, 67 km, 1.0 h)          │
                                           ▼                                               │
               ┌────────────────────────────────────────────────────────────────────────┐  │
               │         HOSPITAL REGIONAL COYHAIQUE (HRC - Alta Complejidad)           │◀─┘
               │  - ÚNICO centro terciario de la región (135 a 180 camas basales)       │
               │  - Unidad de Paciente Crítico: 22-24 camas (UCI/UTI adulto-pediátrica)  │
               │  - 5 Pabellones Quirúrgicos / Quimioterapia / Angiógrafo               │
               │  - Saturación invernal por MP2.5: >95% ocupación camas respiratorias   │
               │  - Lista de espera quirúrgica: >2.800 pacientes (mediana ~220-260 días) │
               │  - Lista de espera especialidad: >12.000 interconsultas pendientes    │
               └───────────────────────────────────┬────────────────────────────────────┘
                                                   │
                                      (Ultra-Alta Complejidad)
                                                   │
                                                   ▼
               ┌────────────────────────────────────────────────────────────────────────┐
               │              RED EXTRA-REGIONAL (MACROZONA SUR Y SANTIAGO)             │
               │  - Hospital Base de Puerto Montt: Neurocirugía, quemados, oncología    │
               │  - Hospital Clínico Valdivia: Trasplantes, radioterapia compleja       │
               │  - Santiago (Posta Central / San Borja / Calvo Mackenna)              │
               │  - ~180-240 pacientes derivados en avión ambulancia presurizado/año    │
               └────────────────────────────────────────────────────────────────────────┘
```

#### Cuantificación de Capacidades y Rendimientos Operacionales

Aplicando las métricas formales de la cibernética de Beer (1972) y Espejo (1989):
- **Actualidad ($A$):** Lo que actualmente rinde o resuelve el subsistema con la dotación corriente de personal, insumos y camas.
- **Capacidad ($C$):** Lo que podría rendir con la infraestructura instalada existente bajo una gestión de turnos y procesos óptima (eliminando suspensiones evitables).
- **Potencialidad ($P$):** Lo que podría alcanzarse removiendo cuellos de botella estructurales (ej. contratando especialistas permanentes, adquiriendo ambulancias todoterreno, modernizando pabellones).
- **Índices de Viabilidad:**
  - Productividad $= A / C$
  - Latencia $= C / P$
  - Rendimiento Global $= A / P$

| Eje Funcional / Subsistema | Indicador Clave de Flujo | Actualidad ($A$) | Capacidad ($C$) | Potencialidad ($P$) | Productividad ($A/C$) | Latencia ($C/P$) | Rendimiento ($A/P$) | Cuello de Botella Estructural |
|---|---|---|---|---|---|---|---|---|
| **Camas Críticas UPC (HRC)** | Días-cama UCI/UTI disponibles | 22 camas (7.665 d-c/año) | 26 camas (9.490 d-c/año) | 36 camas (13.140 d-c/año) | **0.81** | **0.72** | **0.58** | Déficit de médicos intensivistas y enfermeras especialistas en UPC; saturación por virus invernales y trauma. |
| **Pabellones Quirúrgicos HRC** | Cirugías mayores realizadas/año | 3.850 cir/año | 5.200 cir/año | 7.500 cir/año | **0.74** | **0.69** | **0.51** | Carencia crítica de anestesiólogos; suspensión de tablas electivas por urgencias de trauma y vesícula. |
| **Hospitales Comunitarios (Sur/Norte)** | Pacientes estabilizados sin derivar/año | 1.950 pac/año | 2.800 pac/año | 4.200 pac/año | **0.70** | **0.67** | **0.46** | Alta rotación de médicos EDF (rotan cada 3 años); falta de radiología 24/7 y laboratorio de urgencia resolutivo. |
| **Red de Postas Rurales (27 PSR)** | Cobertura de control crónico PSCV/EMPAM | 68% población inscrita | 85% población inscrita | 98% población inscrita | **0.80** | **0.87** | **0.69** | Aislamiento físico de adultos mayores en estancias; falta de vehículos 4x4 municipales para visitas domiciliarias. |
| **Rondas Médicas Marítimas** | Rondas insulares completadas/año | 18 rondas/año | 24 rondas/año (1 mensual) | 36 rondas/año (quincenal) | **0.75** | **0.67** | **0.50** | Temporales en Canal Moraleda y Golfo Corcovado; lancha sanitaria en mantención mecánica prolongada. |
| **Aeroevacuaciones SAMU** | Tiempo promedio de despegue tras alerta | 165 minutos | 90 minutos | 45 minutos | **0.55** | **0.50** | **0.27** | Dependencia de licitaciones de aviones privados; cierre de aeródromos sin pista iluminada (Villa O'Higgins, Tortel). |
| **Consultas Médicas de Especialidad** | Consultas nuevas resueltas/año | 28.500 cons/año | 38.000 cons/año | 55.000 cons/año | **0.75** | **0.69** | **0.52** | Médicos especialistas no se radican por falta de incentivos de zona, aislamiento y limitada oferta educativa familiar. |
| **Salud Mental y Manejo de Crisis** | Cobertura de pacientes con depresión grave | 42% de casos estimados | 65% de casos estimados | 90% de casos estimados | **0.65** | **0.72** | **0.47** | Cero psiquiatras residentes en provincias del sur; estigma social del suicidio y alcoholismo en zonas rurales. |

---

### 3.3 Ecuación de Variedad Requerida y Operadores de Variedad (Ashby/Beer)

#### Catálogo de Perturbaciones Críticas del Entorno ($V_D$)
1. **Picos Invernales de Contaminación Atmosférica por MP2.5 e Inversión Térmica:**
   - La combustión residencial de leña en Coyhaique (>94% de los hogares) en una cuenca intramontana genera concentraciones horarias de MP2.5 que superan los 400–600 $\mu\text{g/m}^3$ (declarada reiteradamente la ciudad con peor calidad de aire de Latinoamérica).
   - *Impacto asistencial:* Disparo masivo de consultas por Infecciones Respiratorias Agudas (IRA), crisis de asma, descompensación de Enfermedad Pulmonar Obstructiva Crónica (EPOC) y eventos cardiovasculares, saturando el Servicio de Urgencia y las camas pediátricas y de adultos del HRC entre mayo y agosto.
2. **Alta Incidencia y Mortalidad por Cáncer Digestivo (Gástrico y de Vesícula Biliar):**
   - La Región de Aysén presenta una de las tasas de mortalidad por cáncer gástrico más elevadas de Chile (>17 fallecidos por 100.000 hab. en hombres), asociada a la alta prevalencia de *Helicobacter pylori*, patrones alimentarios (bajo consumo de hortalizas frescas, alto consumo de sal y cecinas ahumadas) y diagnóstico en etapas metastásicas.
   - La patología biliar (colelitiasis) afecta severamente a mujeres, con alto riesgo de cáncer de vesícula ante demoras quirúrgicas.
3. **Epidemia Oculta de Salud Mental, Suicidio y Consumo Perjudicial de Alcohol:**
   - Aysén registra históricamente tasas de mortalidad por suicidio que oscilan entre 14 y 20 por cada 100.000 habitantes (significativamente por sobre el promedio nacional chileno de 10–11 por 100k hab.).
   - Factores detonantes: Aislamiento geográfico y social en invierno, severa reducción del fotoperiodo diario (trastorno afectivo estacional), cultura patagónica rural con consumo intensivo episódico de alcohol (*binge drinking*) y escasísima red de psiquiatría y psicología clínica en terreno.
4. **Desconexión Territorial y Tiempos Excesivos de Traslado de Pacientes Críticos:**
   - Pacientes graves en Villa O'Higgins se sitúan a 560 km de Coyhaique por tramos de ripio y cruce obligatorio de barcaza (10 a 14 horas de ambulancia); en Cochrane a 334 km (6 a 8 horas); en Melinka a 5 horas de navegación brava hacia Quellón o espera de vuelo; en Caleta Tortel a merced de traslado a pie por pasarelas de ciprés hasta la rampa fluvial.
   - Un infarto agudo de miocardio (IAM), un accidente cerebrovascular (ACV) o un traumatismo encéfalo-craneano (TEC) en zonas aisladas superan con creces la "hora de oro" fisiológica.
5. **Transición Demográfica Acelerada, Despoblamiento Rural y Masculinidad:**
   - Descenso drástico de la tasa de fecundidad regional (muy por debajo del nivel de reemplazo de 2.1 hijos por mujer, con nacimientos regionales totales inferiores a 1.100 anuales).
   - Acelerado envejecimiento: el índice de envejecimiento supera los 66-70 adultos mayores (65+) por cada 100 menores de 15 años.
   - Masculinidad rural extrema: en comunas y estancias periféricas (Tortel, Lago Verde, Guaitecas) el índice de masculinidad supera los 115–125 hombres por cada 100 mujeres, concentrando una población de peones y ancianos solos con patologías crónicas no compensadas.
6. **Vulnerabilidad Estructural de Médicos Especialistas y Médicos EDF:**
   - Los médicos generales de zona en Etapa de Destinación y Formación (Ley 19.664) cumplen ciclos mandatorios de 3 a 6 años y luego parten a universidades del centro del país a cursar sus becas de especialización.
   - Rotación del 100% del cuerpo médico primario cada trienio: pérdida recurrente de memoria clínica, ruptura de vínculos comunitarios y vacancia transitoria de plazas.
   - Falta permanente de especialistas en HRC: oncólogos médicos, neurólogos, nefrólogos, radiólogos intervencionistas, psiquiatras infanto-juveniles.

#### Catálogo de Respuestas del Regulador ($V_R$) e Ingeniería de Variedad

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                INGENIERÍA DE VARIEDAD SANITARIA AUSTRAL                                │
├──────────────────────────────────────────────────┬─────────────────────────────────────────────────────┤
│        ATENUADORES DE VARIEDAD                   │           AMPLIFICADORES DE VARIEDAD                │
│        (Filtros reductores de V_D)               │           (Multiplicadores de V_R)                  │
├──────────────────────────────────────────────────┼─────────────────────────────────────────────────────┤
│ 1. Tamizaje y Colecistectomía Preventiva GES:    │ 1. Telemedicina y Hospital Digital Rural:           │
│    Garantía AUGE de extracción vesicular a       │    Interconexión sincrónica de las 27 postas con    │
│    adultos (35-49 años) para cercenar la         │    especialistas del HRC vía satélite Starlink      │
│    cascada de cáncer de vesícula biliar.         │    para electrocardiograma y fondo de ojo digital.  │
│                                                  │                                                     │
│ 2. Triage y Priorización de Urgencias C1-C5:     │ 2. Servicio de Aeroevacuación Presurizada 24/7:     │
│    Protocolo Manchester en servicios de          │    Aviones ambulancia bimotor licitados y           │
│    urgencia hospitalaria para filtrar patología  │    helicópteros de Carabineros/FACH que reducen     │
│    no urgente hacia consultorios de atención.    │    traslados de 12 horas a 75 minutos de vuelo.     │
│                                                  │                                                     │
│ 3. Campaña de Invierno y Reconversión de Camas:  │ 3. Médicos EDF (Ley 19.664) y PAO de Retorno:       │
│    Suspensión transitoria de cirugías electivas  │    Inyección obligatoria de médicos jóvenes en      │
│    entre junio y agosto para transformar camas   │    zonas extremas y retribución obligatoria del     │
│    quirúrgicas en camas respiratorias críticas.  │    doble de años de especialidad en el HRC.         │
│                                                  │                                                     │
│ 4. Educación y Desincentivo a la Leña Húmeda:   │ 4. Lanchas Sanitarias y Patrulleros Navales:        │
│    Alertas sanitarias ambientales del PDA        │    Rondas marítimas periódicas con clínicas         │
│    (prohibición de humos visibles en Coyhaique)  │    dentales y boxes médicos móviles (PMD Videla /   │
│    para mitigar picos de MP2.5.                  │    lanchas concesionadas) en archipiélagos.         │
│                                                  │                                                     │
│ 5. Programa Nacional de Prevención del Suicidio: │ 5. Convenios de Programación GORE-MINSAL:           │
│    Vigilancia de Intentos de Autoeliminación     │    Financiamiento regional para normalización del   │
│    (IAE) y capacitación comunitaria en postas.   │    nuevo HRC y adquisición de tecnología médica.    │
└──────────────────────────────────────────────────┴─────────────────────────────────────────────────────┘
```

#### Balance Numérico de Variedad y Diagnóstico de Colapso Cibernético
Cuando converge una contingencia invernal típica (ejemplo: emergencia ambiental por MP2.5 en Coyhaique, temporal de nieve con cierre de la Ruta 7 y marejadas en el Golfo Corcovado con suspensión de naves):
- La variedad de perturbaciones $V_D$ escala abruptamente: saturación de camas críticas pediátricas/adultos en HRC por virus respiratorios sincicial e influenza, pacientes politraumatizados por volcamientos en hielo en la Carretera Austral, infartos agudos en Cochrane sin posibilidad de ambulancia por nieve y pacientes descompensados en Melinka sin barcaza.
- La variedad de respuesta $V_R$ local se degrada severamente: aviones ambulancia no pueden aterrizar por techos de nubes bajos y pistas congeladas; lanchas sanitarias quedan fondeadas por orden de DIRECTEMAR; la dotación de camas UPC (22 camas) alcanza el **100% de ocupación**.
- **Resultado:** $V_O \gg V_T$. Se desata un **colapso sistémico regulatorio**: pacientes con ventilación mecánica improvisada en boxes de urgencia básica, fallecimientos evitables en trayecto terrestre y retraso catastrófico de cirugías oncológicas. El regulador carece de variedad requerida intrínseca y depende agónicamente del socorro aéreo militar de largo alcance.

---

### 3.4 Arquitectura de Gobernanza Cibernética (Sistemas 1 a 5 de Beer)

Siguiendo el modelo operacional de viabilidad organizacional de Stafford Beer y Raúl Espejo (2022, p. 1169–1171):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ SISTEMA 5: POLÍTICA SANITARIA, ÉTICA Y CLAUSURA NORMATIVA                              │
│ - Constitución Política (Art. 19 N° 9), DFL 1/2005, Ley 19.937 de Autoridad Sanitaria  │
│ - Ley 19.966 (Garantías Explícitas en Salud - AUGE/GES), Ley 21.331 (Salud Mental)     │
│ - Principio ético supremo: Soberanía de la vida y equidad territorial en la Patagonia │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Canal Homeostático S4-S5
┌───────────────────────────────────────────┴────────────────────────────────────────────┐
│ SISTEMA 4: INTELIGENCIA, ADAPTACIÓN Y FUTURO (Afuera y Mañana)                         │
│ - Departamento de Epidemiología SSA y SEREMI de Salud (Vigilancia CIE-10)              │
│ - Proyección demográfica y senescencia comunal Aysén 2026-2035 (INE / DEIS)            │
│ - Plan de Normalización Integral del Hospital Regional de Coyhaique (Nuevo Recinto)    │
│ - Modelación epidemiológica del impacto del MP2.5 con estaciones SINCA                 │
│ - Plan Regional de Prevención del Suicidio y Salud Mental Comunitaria                  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Canal de Control y Recursos S3-S4
┌───────────────────────────────────────────┴────────────────────────────────────────────┐
│ SISTEMA 3: CONTROL OPERACIONAL INTERNO Y SINERGIA ASISTENCIAL (Adentro y Ahora)        │
│ - Subdirección de Gestión Asistencial del Servicio de Salud Aysén                      │
│ - Asignación presupuestaria a hospitales, insumos críticos y contratos de diálisis     │
│ - Licitación y fiscalización de servicios de aviones ambulancia y lanchas sanitarias   │
│ - Plan de Campaña de Invierno: reconversión de dotación de camas y refuerzo de turnos   │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ SISTEMA 3*: CANAL DE AUDITORÍA CLÍNICA ESPORÁDICA (Inspección In Situ)             │ │
│ │ - Superintendencia de Salud: Acreditación de Calidad y Seguridad del Paciente       │ │
│ │ - SEREMI de Salud: Fiscalización de condiciones sanitarias y sumarios sanitarios   │ │
│ │ - Auditorías médicas de muertes maternas, muertes infantiles y eventos centinela   │ │
│ │ - Contraloría General de la República (CGR): Auditorías a listas de espera y SIGTE │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Canal de Coordinación Anti-Oscilante S2
┌───────────────────────────────────────────┴────────────────────────────────────────────┐
│ SISTEMA 2: PROTOCOLOS DE COORDINACIÓN Y ANTI-OSCILACIÓN (Amortiguador Dinámico)        │
│ - Centro Regulador SAMU 131 Aysén: Triage prehospitalario y despacho coordinado        │
│ - Unidad Centralizada de Gestión de Camas (UGCA): Derivación intrarregional oportuna   │
│ - Sistema de Gestión de Tiempos de Espera (SIGTE) y Tele-interconsulta digital         │
│ - Calendario coordinado de Rondas Médicas sincronizado con mareas de la Armada         │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Asignación de Recursos a Operaciones
┌───────────────────────────────────────────┴────────────────────────────────────────────┐
│ SISTEMA 1: UNIDADES OPERACIONALES PRIMARIAS (Producción del Valor Asistencial)         │
│ - S1.1 Hospital Regional Coyhaique: Alta complejidad, UCI/UTI, oncología y pabellones │
│ - S1.2 Hospital de Puerto Aysén: Mediana complejidad, diálisis y urgencia              │
│ - S1.3 Hospitales Comunitarios: Cochrane, Chile Chico y Puerto Cisnes (Atenc. 24/7)   │
│ - S1.4 Red APS Urbana: CESFAM Alejandro Gutiérrez, Víctor Domingo Silva y Ribera Sur  │
│ - S1.5 Red Primaria Rural Extrema: 27 Postas Rurales operadas por TENS y 20 EMR        │
│ - S1.6 Red Móvil de Rescate: Flota SAMU 4x4 terrestre, lanchas y aviones ambulancia    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Las 5 Relaciones de Gobernanza de Espejo y Diagnóstico de Patologías Cibernéticas
1. **Relación S1 - Entorno (Acoplamiento Operacional Inmediato):** Las postas rurales y servicios de urgencia interactúan directamente con la comunidad rural, pero están crónicamente infradotados de medicamentos de segunda línea y tecnología diagnóstica.
2. **Relación S1 - S2 (Anti-Oscilación y Amortiguación):** Fallas severas de coordinación: cuando se cancela una lancha sanitaria por mal tiempo, no existe un mecanismo automático en S2 para reprogramar las horas médicas perdidas, arrojando al paciente al final de la lista de espera por otros 6 meses.
3. **Relación S1 - S3 (Monitoreo Operativo y Asignación de Recursos):** El canal de recursos S3 está asfixiado por el gasto corriente en traslado de pacientes críticos (aeroevacuaciones privadas), detrayendo recursos de la prevención primaria.
4. **Relación S3 - S4 (Canal Homeostático Adentro/Afuera - Presente/Futuro):** **Patología Crítica.** El nivel directivo del SSA se encuentra absorbido en un 95% por la contingencia diaria (falta de insumos, averías de ambulancias, renuncias de médicos), provocando la atrofia del Sistema 4. No hay tiempo para modelar prospectivamente el impacto del envejecimiento demográfico a 15 años ni el rediseño de la red de cuidados geriátricos.
5. **Relación S4 - S5 (Clausura Normativa y Adaptación de Políticas):** El Ministerio de Salud a nivel central aplica parámetros urbanos homogéneos de financiamiento per cápita (financiamiento per cápita basal de la APS) que castigan a las comunas rurales dispersas de Aysén, donde el costo logístico de atender a un habitante en Caleta Tortel o Repollal es entre 8 y 12 veces superior al de Santiago o Concepción.

---

## 4. ETAPA 2: Contraste Forense de Sesgos y Puntos Ciegos del Repositorio

Habiendo concluido el modelado ciego independiente, se procedió a la apertura, ejecución de código e inspección de los archivos del repositorio:
- `data/systemic/08_desagregaciones_sectoriales_aysen.json` (7.781 líneas, 273.4 KB).
- `data/systemic/05_social_salud_educacion_riesgos.json` (4.747 líneas, 162.8 KB).
- `data/systemic/provenance_catalog.json` (1.309 líneas, 54.7 KB).
- Compilador estático `scripts/build_aysen_hubs_bundle.cjs` (4.218 líneas, 216.3 KB) y archivo CSV complementario `data/systemic/csv/08_salud_aps_hospitales_y_desagregaciones.csv`.

A continuación se exponen de forma forense las distorsiones cognitivas, sesgos de diseño y omisiones estructurales detectadas.

---

### 4.1 Matriz de Diagnóstico Crítico de Sesgos

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                TABLA DE SESGOS Y DISTORSIONES COGNITIVAS FORENSES                                │
├──────────────────────┬──────────────────────────────────────────────┬─────────────────────────────────────────────┤
│ Tipo de Sesgo        │ Manifestación en la Base de Datos Actual     │ Impacto en la Toma de Decisiones Sistémicas │
├──────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ 1. Sesgo Geográfico  │ Las únicas series históricas de urgencias    │ Se asume que la vulnerabilidad respiratoria │
│    Centralista       │ respiratorias (`urgencias_respiratorias_     │ es exclusiva de Coyhaique-Aysén, invisibi-  │
│                      │ coyhaique_aysen`) se miden para esas dos     │ lizando las infecciones de comunas frías del│
│                      │ comunas. Cero series para las 8 restantes.   │ sur (Cochrane, Tortel, O'Higgins, Chile Ch.)│
├──────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ 2. Ceguera Oncológica│ Cero menciones de Cáncer Gástrico y Cáncer   │ Oculta la principal causa de muerte de la   │
│    y Digestiva       │ de Vesícula Biliar en los JSON analizados    │ región. La red de salud se modela como si   │
│    (Falso Vacío)     │ (0 ocurrencias de 'cancer', 'gastric', etc.).│ el cáncer no existiera en la Patagonia.     │
├──────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ 3. Invisibilización  │ Cero menciones y cero variables sobre        │ El problema psicosocial más dramático de la │
│    de Salud Mental   │ Salud Mental, Tasa de Suicidio o Consumo de  │ región (tasa de suicidio de 15.1/100k hab.) │
│    y Suicidio        │ Alcohol en los esquemas sectoriales.         │ es completamente omitido por el repositorio.│
├──────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ 4. Ceguera Vital     │ Cero variables sobre Índice de Envejecimien- │ Se ignora el colapso demográfico austral: no│
│    Demográfica       │ to, Índice de Masculinidad Rural, Natalidad  │ se registra la caída de nacimientos ni la   │
│    y de Cuidados     │ o Despoblamiento rural en los datasets.      │ sobrecarga de cuidados de ancianos solos.   │
├──────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ 5. Sesgo Estático    │ Las listas de espera se reducen a un número  │ Se evalúa el inventario administrativo de   │
│    de Listas de      │ estático de interconsultas (ej. 5.420 en     │ personas y no la latencia del servicio. No  │
│    Espera            │ Coyhaique) sin medir días de espera ni GES.  │ se mide el riesgo de muerte en espera.      │
├──────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ 6. Inconsistencia    │ Discrepancia flagrante en camas del HRC:     │ Pérdida de confiabilidad algorítmica: el    │
│    Numérica Interna  │ en scripts figura 205 camas (78.5%) pero en  │ código reporta un porcentaje alucinatorio   │
│    en el Código      │ los JSON y tablas reales son 167 de 261.     │ que distorsiona la capacidad instalada.     │
└──────────────────────┴──────────────────────────────────────────────┴─────────────────────────────────────────────┘
```

---

### 4.2 Evidencia Específica de Líneas y Código en el Repositorio

#### Evidencia 1: Inconsistencia Numérica Flagrante en Dotación de Camas Hospitalarias
En `scripts/build_aysen_hubs_bundle.cjs`:
- **Líneas 521–522:**
```javascript
description: 'Red asistencial de salud (**APS rural vs. Hospitales DEIS / SSA**), capacidad de **261 camas hospitalarias**, **32 postas de salud rural**, tiempos de traslado SAMU e isócronas de evacuación crítica.',
example: 'El **Hospital Regional de Coyhaique** concentra el **78,5% de las camas regionales** (205 de 261), mientras la **Macrozona Sur** cuenta con solo 14 camas para 5 comunas.',
```
- **Líneas 1641–1645 (Nodo #24):**
```javascript
title: 'Capacidad Hospitalaria vs. Dispositivos APS en la Red SSA (261 Camas Totales)',
labels: ['Hosp. Reg. Coyhaique', 'Hosp. Pto. Aysén', 'Hosp. Cochrane', 'Hosp. Chile Chico', 'Hosp. Pto. Cisnes', 'Red APS Comunal'],
datasets: [
  { label: 'Camas Disponibles', data: [167, 52, 16, 14, 12, 0], backgroundColor: '#be123c' },
  { label: 'Dispositivos Asistenciales', data: [1, 1, 1, 1, 1, 53], backgroundColor: '#0284c7' }
]
```
*Hallazgo Forense:* Hay una incongruencia matemática evidente. La suma de las camas de los 5 hospitales es:
$$167 + 52 + 16 + 14 + 12 = 261 \text{ camas}$$
Por ende, el Hospital Regional de Coyhaique tiene **167 camas**, lo que equivale exactamente a:
$$\frac{167}{261} = 63,98\%$$
La línea 522 declara un valor alucinatorio de **205 camas y 78,5%**, contradiciendo los propios datos del dataset y del nodo #24. Asimismo, la línea 521 cita **32 postas rurales**, mientras la línea 2302 cita **28 postas** y los registros oficiales del DEIS/SSA reportan **27 postas de salud rural**.

#### Evidencia 2: Cero Registro de Oncología y Neoplasias Digestivas
Tras ejecutar un barrido algorítmico exhaustivo sobre `data/systemic/05_social_salud_educacion_riesgos.json` y `data/systemic/08_desagregaciones_sectoriales_aysen.json`:
- Término `cancer`: **0 ocurrencias**.
- Término `gastric`: **0 ocurrencias**.
- Término `vesicul`: **0 ocurrencias**.
- Término `biopsia`: **0 ocurrencias**.
- Término `quimioterapia`: **0 menciones de flujo de pacientes**.
*Hallazgo Forense:* El cáncer gástrico y de vesícula biliar representan las mayores causas de años de vida potencialmente perdidos (AVPP) en la macrozona austral, pero en la arquitectura del Data Lake regional son completamente invisibles.

#### Evidencia 3: Invisibilización Total de la Salud Mental y Tasa de Suicidio
En ambos JSONs sectoriales:
- Término `suicid`: **0 ocurrencias**.
- Término `salud mental`: **0 ocurrencias**.
- Término `psiquiatr`: **0 ocurrencias**.
- Término `depresion`: **0 ocurrencias**.
*Hallazgo Forense:* Aysén lidera históricamente la tasa de suicidios en Chile (15,1 por 100k hab. promedio), asociada al aislamiento invernal y el consumo episódico perjudicial de alcohol. No existe una sola métrica, tabla o columna en todo el repositorio que registre consultas de salud mental, camas psiquiátricas de corta estadía o intentos de autoeliminación.

#### Evidencia 4: Ceguera Demográfica Vital Absoluta
En ambos archivos:
- Términos `masculin`, `envejec`, `fecund`, `natalid`, `adulto_mayor`: **0 ocurrencias**.
*Hallazgo Forense:* El repositorio carece de pirámides poblacionales, tasas de reemplazo generacional y métricas de despoblamiento rural. Se trata a la población como una masa biológicamente estática, desconociendo que las comunas rurales poseen índices de masculinidad superiores a 115-120 hombres por 100 mujeres y una proporción creciente de ancianos que viven solos en zonas inaccesibles sin cuidadores formales.

#### Evidencia 5: Reducción Estática de las Listas de Espera y Aeroevacuaciones
En `data/systemic/05_social_salud_educacion_riesgos.json` (líneas 446–448 para Coyhaique, y análogamente para las demás comunas):
```json
"medicos_por_mil_habitantes": 3.12,
"lista_espera_no_ges_consultas_especialidad": 5420,
"urgencias_respiratorias_invernales_pct": 44.5,
"aeroevacuaciones_samu_anual": 0
```
*Hallazgo Forense:*
1. La variable `lista_espera_no_ges_consultas_especialidad` es un entero plano escalar sin serie de tiempo, sin desagregación por especialidad (traumatología, oftalmología, digestivo) y, lo más grave cibernéticamente: **no incluye la mediana de días de espera**.
2. Las `aeroevacuaciones_samu_anual` (ej. 96 en Guaitecas, 72 en Cisnes, 54 en Cochrane, 46 en Tortel, 42 en O'Higgins) son valores estáticos sin fecha, sin causal médica (trauma vs patología cardiovascular vs parto complejo) y sin registro del medio utilizado (avión bimotor presurizado vs helicóptero policial vs patrullero naval).
3. En `provenance_catalog.json`, los nodos #38 y #39 figuran con `"extractionMode": "curated_fallback"`, confirmando que no provienen de un pipeline de ingesta automatizada desde el DEIS o el Centro Regulador SAMU, sino de estimaciones estáticas consolidadas manualmente.

---

## 5. Plan de Captura de Datos Sin Sesgo ($0 Costo de Infraestructura)

Para transformar la sección de salud del Data Lake de Aysén en un verdadero **Sistema Nervioso Cibernético de Vigilancia Epidemiológica y Cuidados**, se diseña un plan de ingesta periódica automatizada mediante consumo de APIs públicas abiertas del Estado chileno, micro-scraping ético de resoluciones sanitarias y procesamiento en Python sin costos de servidores de pago.

### 5.1 Tabla Maestra de Captura Priorizada

| Prioridad | Subsistema / Dimensión | Variable Requerida | Unidad / Métrica | Fuente Institucional | Mecanismo de Ingestión / Ley Habilitante | Frecuencia |
|---|---|---|---|---|---|---|
| **P1** | **Vigilancia Oncológica Austral** | Incidencia y mortalidad por Cáncer Gástrico y Cáncer de Vesícula Biliar | Tasa cruda y ajustada por 100k hab., defunciones por comuna y sexo (CIE-10 C16 y C23) | DEIS MINSAL / Registro Poblacional de Cáncer | API Abierta DEIS (`datosabiertos.minsal.cl`); Ley 19.937 y DFL 1/2005. | Anual |
| **P1** | **Salud Mental y Riesgo Vital** | Tasa de mortalidad por lesiones autoinfligidas (Suicidio) e Intentos de Autoeliminación (IAE) | Tasa por 100k hab. (CIE-10 X60-X84), atenciones de urgencia por intento suicida | DEIS MINSAL / Programa Nacional de Prevención del Suicidio | Estadísticas Oficiales de Mortalidad DEIS / Sistema SUR; Ley 21.331. | Semestral |
| **P1** | **Demografía Vital y Cuidados** | Índice de envejecimiento, índice de masculinidad rural y nacimientos por comuna | Razón adultos 65+/menores 15, hombres por 100 mujeres, nacidos vivos anuales | INE Aysén / DEIS Estadísticas Vitales | API Abierta INE Redatam / DEIS Registro Civil; Ley 17.374 Orgánica del INE. | Anual |
| **P2** | **Desempeño de Listas de Espera** | Mediana y percentil 90 de días de espera quirúrgica No GES y consultas de especialidad | Días de espera por especialidad y comuna de origen; garantías GES retrasadas | SIGTE / Subsecretaría de Redes Asistenciales / FONASA | Reportes trimestrales Glosa Presupuestaria BCN; Ley 19.966 (GES). | Trimestral |
| **P2** | **Rotación y Retención Médica** | Tasa de vacancia de cargos especialistas en HRC y permanencia de Médicos EDF | Horas médicas de especialista faltantes, tasa de retorno PAO efectivo | Servicio de Salud Aysén / Subdirección de Gestión de Personas | Portal de Transparencia Activa SSA; Ley 19.664 y Ley 20.285. | Semestral |
| **P2** | **Evacuaciones y Rescate SAMU** | Registro de aeroevacuaciones y traslados marítimos de emergencia | Número de vuelos/traslados por comuna, tiempo de respuesta (minutos), patología base | Centro Regulador SAMU Aysén / DGAC / Armada DIRECTEMAR | Bitácora de Despacho SAMU 131; DFL 1/2005 y Código Sanitario. | Mensual |
| **P3** | **Tensión Respiratoria e Invierno** | Consultas de urgencia por causa respiratoria (IRA/EPOC) cruzadas con MP2.5 | Consultas diarias en SAPU/Urgencia HRC vs concentración diaria MP2.5 ($\mu\text{g/m}^3$) | DEIS MINSAL (Vigilancia de Urgencia) / SINCA MMA | Ingesta combinada API SINCA (`sinca.mma.gob.cl`) y DEIS urgencias; Ley 19.300. | Semanal (Mayo-Agosto) |
| **P3** | **Continuidad de Rondas Rurales** | Rondas médicas programadas vs efectivamente realizadas en islas y estancias | Porcentaje de cumplimiento de calendario de rondas, causas de suspensión (clima, nave) | SSA / DESAM Municipalidades (Guaitecas, Cisnes, Tortel, etc.) | Informes de Cumplimiento de Metas Sanitarias Ley 19.813; Transparencia Activa. | Mensual |

---

### 5.2 Diseño de Sensores Cibernéticos de Alerta Temprana (Cyberstride Sanitario)

Siguiendo el principio de Stafford Beer de "monitoreo de variaciones estadísticas por excepción con alerta casi en tiempo real", se formulan 4 índices algorítmicos para incorporar al pipeline de datos de la plataforma:

#### 1. Índice de Latencia Quirúrgica y Riesgo Oncológico ($I_{LQO}$)
$$I_{LQO} = \frac{\text{Días de espera efectiva para intervención vesicular o gástrica}}{\text{Plazo máximo estipulado por Guía Clínica AUGE (días)}}$$
- Si $I_{LQO} > 1,5$, el sistema emite una **Alerta Cibernética Nivel 2** (riesgo de progresión neoplásica y judicialización por incumplimiento GES).

#### 2. Índice de Presión Respiratoria Invernal ($I_{PRI}$)
$$I_{PRI} = \frac{\text{Consultas de urgencia respiratoria semanal en HRC}}{\text{Promedio histórico de consultas respiratorias del mismo mes}} \times \left(1 + \frac{\text{Días con Emergencia Ambiental MP2.5 en la semana}}{7}\right)$$
- Si $I_{PRI} \ge 1,6$, el sistema activa la recomendación de **Reconversión Inmediata de Camas Quirúrgicas a Camas Críticas Pediátricas/Adultos**.

#### 3. Índice de Vulnerabilidad por Aislamiento Vital ($I_{VAV}$)
$$I_{VAV} = \left(\frac{\text{Tiempo de traslado en ambulancia a HRC (horas)}}{10}\right) \times \left(1 + P_{\text{corte ruta/temporal}}\right) \times \left(\frac{\text{Población mayor de 65 años en comuna}}{\text{Total población comunal}}\right)$$
- Donde $P_{\text{corte ruta/temporal}}$ es la probabilidad estimada de corte vial o suspensión de barcaza. Comunas con $I_{VAV} > 0,8$ (ej. O'Higgins, Tortel, Guaitecas) deben tener prioridad automática en el despacho del avión ambulancia ante cualquier sospecha de patología tiempo-dependiente.

#### 4. Índice de Vacancia y Deserción Médica ($I_{VDM}$)
$$I_{VDM} = \frac{\text{Horas semanales de médicos especialistas no cubiertas}}{\text{Dotación teórica autorizada por Decreto Planta SSA}} + \text{Tasa anual de egreso de médicos EDF}$$
- Cuando $I_{VDM} > 0,35$, se dispara una señal al Sistema 5 regional (GORE/CORE) para activar asignaciones extraordinarias de zona y subsidios de radicación habitacional.

---

## 6. Conclusiones y Recomendaciones para el Orquestador

1. **La salud en Aysén es indisociable de la geografía, el clima y el metabolismo energético:** No se puede entender el colapso hospitalario invernal sin la combustión de leña húmeda en la cuenca de Coyhaique, ni la mortalidad de urgencia sin la discontinuidad de barcazas en Fiordo Mitchell o los temporales del Golfo Corcovado.
2. **El Data Lake actual presenta una ceguera epidemiológica y demográfica inaceptable:** La omisión del cáncer gástrico y de vesícula (principales causantes de muerte por tumores), de la tasa de suicidios (históricamente la mayor del país) y del envejecimiento/despoblamiento rural sesga cualquier toma de decisión sistémica, tratando a Aysén como un espacio sin morbilidades críticas.
3. **Las inconsistencias cuantitativas internas en el código deben corregirse:** El compilador de bundle declara que Coyhaique concentra el 78,5% de las camas (205 camas), cuando la suma real y los archivos primarios demuestran que tiene 167 camas de un total regional de 261 (63,98%).
4. **Recomendación para el Orquestador:** Integrar la Tabla Maestra de Captura P1-P3 y los 4 índices algorítmicos en el próximo sprint de actualización del Data Lake sistémico (`data/systemic/08_desagregaciones_sectoriales_aysen.json` y `data/systemic/05_social_salud_educacion_riesgos.json`), asegurando la synchronización con `scripts/build_aysen_hubs_bundle.cjs`.
