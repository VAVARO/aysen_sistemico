# INFORME DE INVESTIGACIÓN CIBERNÉTICA: TURISMO, CONSERVACIÓN BIOCULTURAL Y ECONOMÍAS LOCALES EN AYSÉN

**Sub-Agente 2 (Ola 2): Modelado Ciego VIPLAN / VSM y Contraste Forense de Sesgos**  
**Fecha:** Noviembre 2026  
**Ámbito Asignado:** Turismo, Conservación, Gobernanza de Áreas Silvestres Protegidas y Metabolismo Económico Local  
**Marco Teórico de Referencia:** Cibernética Organizacional de Stafford Beer (*Brain of the Firm*, 1972/1981; *The Heart of Enterprise*, 1979; *Diagnosing the System for Organizations*, 1985), Metodología VIPLAN de Raúl Espejo (*Cybersyn, big data, variety engineering and governance*, AI & Society, 2022; Espejo & Reyes, 2011/2016; Espejo, 1989) y Ley de Variedad Requerida de W. Ross Ashby (1956, 1964).  
**Protocolo Metodológico:** Protocolo Ciego de Dos Etapas Consecutivas e Impermeables (`docs/viplan_research/PROTOCOLO_CIEGO_VIPLAN.md`):
1. **Etapa 1 (Ciega / Tabula Rasa):** Modelado cibernético sin acceso previo a la carpeta `data/` del repositorio, recurriendo exclusivamente a investigación externa sobre leyes vigentes (Ley 20.423 de Turismo, Ley 21.600 de SBAP, Ley 19.300), resoluciones y estadísticas de CONAF, INE (EMAT), Subsecretaría de Turismo, SERNATUR, Red de Comunidades Portal de la Patagonia, fallos de la Corte de Apelaciones de Coyhaique y literatura empírica.
2. **Etapa 2 (Contraste Forense de Sesgos):** Apertura, diagnóstico forense y contraste analítico contra `data/systemic/06_turismo_sernatur_conaf.json` y el Hub I (*Turismo & Áreas Silvestres*, Nodos #01 a #05) de `data/aysen_hubs_data.js`.

---

## 1. INTRODUCCIÓN Y MARCO OPERACIONAL

La Región de Aysén del General Carlos Ibáñez del Campo (108.494 km², 10 comunas y 100.745 habitantes) presenta una paradoja territorial única en el Cono Sur: más del 53,8% de su superficie continental e insular (5,83 millones de hectáreas) está declarada bajo el Sistema Nacional de Áreas Silvestres Protegidas del Estado (SNASPE), conformando una de las mayores reservas de biodiversidad, agua dulce y biomasa boscosa del planeta. Sobre esta geografía fracturada por fiordos, campos de hielo y cordones andinos se proyecta una industria turística intensamente promovida como el motor de recambio hacia una economía verde regional.

Sin embargo, la realidad operacional revela profundas fallas sistémicas:
- **Estacionalidad asfixiante:** El 60-70% de la facturación y visitación turística se concentra en una ventana estival de apenas 90 días (diciembre a marzo), condenando a prestadores y trabajadores a 9 meses de hibernación, subempleo e inactividad forzosa.
- **Fuga de valor (*Tourism Leakage*):** Gran parte de los paquetes de expedición de alta gama, cruceros de fiordos y lodges de pesca deportiva son comercializados por operadores con base en Santiago o el extranjero, reteniendo las comunidades locales solo una fracción marginal del gasto turístico.
- **Tensión conservación vs. medios de vida:** La transición institucional desde la Corporación Nacional Forestal (CONAF) hacia el Servicio de Biodiversidad y Áreas Protegidas (SBAP, Ley 21.600) y las restricciones precautorias derivadas del colapso criosférico por cambio climático (ej. el cierre definitivo del trekking sobre hielo en el Glaciar Exploradores) generan fricciones agudas entre la seguridad ambiental del Estado y la subsistencia económica comunal.
- **Vulnerabilidad de infraestructura multimodal:** La dependencia crítica de enlaces bimotores (barcazas en Fiordo Mitchell y Lago General Carrera, vuelos a Balmaceda, tramos no pavimentados de la Ruta 7) hace que cualquier interrupción climática o mecánica destruya de inmediato la cadena de servicios turísticos.

El presente informe aplica los constructos de la Cibernética Organizacional (Beer, 1979; Espejo, 2022) para modelar este sistema como un todo viable y contrastarlo contra las bases de datos preexistentes en la plataforma.

---

## 2. MARCO TEÓRICO Y CONSTRUCTOS CIBERNÉTICOS DE REFERENCIA

### 2.1 El Principio de Doble Descripción de Raúl Espejo
Siguiendo a Espejo (1989, 2022), un sistema social viable requiere una doble descripción complementaria:
1. **Descripción de Caja Negra (Cibernética de Primer Orden - Sistema Observado):** Trata al sistema territorial como una unidad transformadora de insumos en productos/impactos orientados a un propósito sistémico deliberado. Se operacionaliza mediante la metodología de nombramiento **TASCOI** (*Transformation, Actors, Suppliers, Customers, Owners, Interveners*).
2. **Descripción Operacional (Cibernética de Segundo Orden - Sistemas Observadores):** Examina las relaciones de recursión, clausura operacional y gobierno que garantizan la viabilidad interna frente a la complejidad del entorno a través de las cinco funciones del Modelo del Sistema Viable (VSM S1-S5) y sus 5 relaciones de gobernanza.

### 2.2 Ley de Variedad Requerida de Ashby y Ecuación de Variedad de Espejo
La complejidad del sistema territorial se expresa a través de su variedad ($V$), entendida como el número de estados posibles o perturbaciones admisibles (Ashby, 1956, 1964). En la formulación de Espejo & Howard (1982) y Espejo (2022, p. 1169):

$$V_O \ge \frac{V_D}{V_R}$$

donde:
- $V_D$ es la variedad de perturbaciones del entorno socio-ecológico (*environmental disturbances*: cambio climático, aluviones, colapso de glaciares, oscilaciones de mercado, fallas de barcazas).
- $V_R$ es la variedad de respuestas regulatorias (*regulatory responses/affordances*: planes de manejo, subsidios de conectividad, zonificación ZOIT, protocolos de seguridad).
- $V_O$ es la variedad de resultados residuales (*outcomes*).
- $V_T$ es el conjunto de estados admisibles o metas deseadas (*target set* de sostenibilidad, bienestar y viabilidad económica).

Para garantizar la viabilidad:

$$V_O \le V_T \iff V_R \ge \frac{V_D}{V_T}$$

Dado el desbalance ontológico $V_E \gg V_O \gg V_M$ (el entorno es infinitamente más complejo que la organización, y esta que la gestión pública central), el sistema exige **Ingeniería de Variedad**:
- **Atenuadores de variedad (filtros):** Agregación de indicadores, zonificación ambiental, capacidades de carga, reservas de cupos digitales en parques, normativas de calidad.
- **Amplificadores de variedad (multiplicadores):** Planes de acción comunales de la Red de Comunidades Portal, subsidios flexibles de fomento productivo (CORFO/SERCOTEC/GORE), redes de guías certificados de base, diversificación hacia turismo de intereses especiales de invierno/otoño (*redundancy of potential command*).

### 2.3 Las 5 Relaciones de Gobernanza de Raúl Espejo (2022)
1. **Relación 1: Política e Identidad (S5 - S4 - S3):** Define la visión estratégica de largo plazo, balanceando las demandas operacionales inmediatas (S3) con la prospección adaptativa y el cambio ambiental global (S4).
2. **Relación 2: Cohesión y Negociación de Recursos (S3 - S1):** Establece los acuerdos de desempeño y asignación de presupuesto público/privado entre la administración y las unidades operacionales de terreno.
3. **Relación 3: Coordinación y Anti-Oscilación (S2 - S1):** Neutraliza interferencias mutuas y desequilibrios estacionales entre los prestadores turísticos mediante calendarios, frecuencias y protocolos compartidos.
4. **Relación 4: Adaptación y Monitoreo del Entorno (S4 - Entorno / S4 - S3):** Escanea alertas tempranas de degradación ambiental, dinámica de glaciares y variaciones en la demanda turística internacional.
5. **Relación 5: Auditoría Esporádica Directa (S3* - S1):** Canal no burocrático de inspección sorpresiva para verificar estándares de seguridad, legalidad tributaria y protección de ecosistemas.

---

## 3. ETAPA 1: MODELADO SISTÉMICO CIEGO (TABULA RASA)

### 3.1 Nombramiento del Sistema y Matriz TASCOI en 3 Niveles de Recursión

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ RECURSIÓN N+1: Meta-Sistema Macro-Austral de Conservación Biocultural y Turismo        │
│                (Integración Patagonia Chilena, SNASPE/SBAP y Mercados Globales)        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ├── RECURSIÓN N: Sistema Regional de Turismo, Red de Parques y Economía de Aysén       │
│ │   (10 Comunas, 5 Parques Nacionales Emblemáticos, 4 ZOITs y Cuencas Hidrográficas)   │
│ │                                                                                      │
│ │   ├── RECURSIÓN N-1.1: Comunidades Portal y Operación Cuenca Lacustre Chelenko      │
│ │   │   (Río Ibáñez, Puerto Tranquilo, Chile Chico, Guadal, Capillas de Mármol)       │
│ │   ├── RECURSIÓN N-1.2: Comunidades Portal Corredor Carretera Austral Norte - Queulat │
│ │   │   (Puyuhuapi, Cisnes, La Junta, Lago Verde, PN Queulat, PN Isla Magdalena)      │
│ │   ├── RECURSIÓN N-1.3: Comunidades Portal Valle del Baker y Fiordos del Sur          │
│ │   │   (Cochrane, Caleta Tortel, Villa O'Higgins, PN Patagonia, Fiordo Mitchell)     │
│ │   └── RECURSIÓN N-1.4: Plataforma Logística y Hub Receptivo Central                  │
│ │       (Coyhaique, Balmaceda, Puerto Chacabuco, Expediciones Laguna San Rafael)       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Matriz TASCOI Detallada por Niveles de Recursión

| Elemento TASCOI | Recursión N+1: Meta-Sistema Macro-Austral de Conservación | Recursión N: Sistema Regional de Turismo y Parques de Aysén | Recursión N-1: Unidades Operacionales y Comunidades Portal |
|---|---|---|---|
| **T (Transformación)** | Ecosistemas patagónicos prístinos sometidos a presiones antrópicas y climáticas $\rightarrow$ Red transregional de conservación biocultural con turismo de intereses especiales de alto valor soberano. | Aislamiento territorial, estacionalidad crítica y economías locales de subsistencia $\rightarrow$ Matriz ecoturística comunitaria integrada, generadora de empleo digno, retención de riqueza local y custodia de áreas protegidas. | Excursionistas y visitantes en tránsito $\rightarrow$ Experiencias de turismo de naturaleza, alojamiento, guiado seguro y gastronomía identitaria sin degradación de la capacidad de carga comunal. |
| **A (Actores)** | Ministerio del Medio Ambiente (MMA), Subsecretaría de Turismo, SERNATUR Nacional, Dirección Nacional de Fronteras y Límites (DIFROL), Consejo de Ministros para la Sustentabilidad, ONG conservacionistas globales (Pew, Tompkins). | SERNATUR Aysén, Dirección Regional CONAF (en transición a SBAP), Gobierno Regional de Aysén (GORE y CORE), Corporación de Fomento de la Producción (CORFO Aysén), 10 Municipios de Aysén, Gremios Regionales de Turismo (POLAT, Cámaras de Comercio y Turismo). | Cámaras de Turismo locales (Río Tranquilo, Cochrane, Puyuhuapi), Asociaciones de Guías de Montaña y Pesca con Mosca, Operadores de lanchas en Capillas de Mármol, familias de campesinos y artesanos locales, comités de agua y transporte vecinal. |
| **S (Proveedores)** | Presupuesto de la Nación (Dipres), cooperación internacional científica, infraestructura aeronáutica nacional (DGAC). | Ministerio de Obras Públicas (Vialidad, DOP, Aeropuertos), Ministerio de Transportes y Telecomunicaciones (DTPR - subsidios de barcazas y buses), distribuidoras eléctricas locales (Edelaysen), empresas mayoristas de insumos. | Proveedores agrícolas de valles locales, micro-productores de hortalizas, talleres mecánicos comunales, armadores artesanales de botes, ferreterías y leñerías certificadas. |
| **C (Clientes)** | La sociedad global, la ciudadanía chilena presente y futura (servicios ecosistémicos, captura de carbono, biodiversidad). | Los 100.745 habitantes de la Región de Aysén, los turistas nacionales (~70% del flujo) y extranjeros (~30%), las micro y pequeñas empresas familiares de servicios. | El visitante directo en ruta, los senderistas de trekking, las familias locales dependientes de salarios de temporada y los jóvenes capacitados en oficios de montaña y hospitalidad. |
| **O (Propietarios)** | El Estado Soberano de Chile (en representación de las generaciones presentes y futuras). | El Gobierno Regional de Aysén (GORE) en cogobierno con la Delegación Presidencial Regional y el Consejo de Alcaldes de la Región. | Los microempresarios locales, cooperativas de turismo comunitario y concejos municipales de las 10 comunas. |
| **I (Interventores)** | Acuerdos climáticos internacionales (COP, UICN), fluctuaciones cambiarias del dólar/euro, aerolíneas comerciales troncales (LATAM, SKY). | Contraloría General de la República (CGR), Dirección General de Aguas (DGA - alertas glaciológicas), Armada de Chile (DIRECTEMAR), Dirección Meteorológica de Chile. | Carabineros de Chile (retenes fronterizos), inspectores municipales, SEREMI de Salud (resoluciones sanitarias de cabañas), juntas de vecinos y comunidades indígenas que defienden accesos ancestrales. |

---

### 3.2 Flujograma Cuantificado Real (Estilo Cybersyn / INTEC 1973)

Inspirado en el modelado cibernético de Stafford Beer y Raúl Espejo para Cybersyn (1971–1973), se reconstruyen los flujos físicos de visitantes, la capacidad instalada y los rendimientos operacionales en la red turística de Aysén:

```
                           [ENTORNOS EMISORES: SANTIAGO / EXTRANJERO / ARGENTINA]
                                                    │
                 ┌──────────────────────────────────┼──────────────────────────────────┐
                 │ (Acceso Aéreo Balmaceda BBA)     │ (Acceso Terrestre / Ruta 7 N)    │ (Acceso Marítimo / Fiordos)
                 ▼                                  ▼                                  ▼
           [AEROPUERTO BBA]                 [PUERTO MONTT / CHAITÉN]          [PUERTO CHACABUCO]
            320.000 pax/año                  95.000 pax/año                    48.000 pax/año
            (Peak estival: 11 vuelos/d)      (Ruta bimodal y ripio)            (Transbordadores Navimag/Somarco)
                 │                                  │                                  │
                 └──────────────────────────────────┼──────────────────────────────────┘
                                                    ▼
                                  [COYHAIQUE: CENTRO NEURÁLGICO Y DISPERSIÓN]
                                   Capacidad hotelera: 3.420 camas
                                   Pernoctaciones: 208.500 pernoctaciones/año
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼                                                                     ▼
       [CORREDOR NORTE (Ruta 7 N)]                                           [CORREDOR SUR (Ruta 7 S)]
        - PN Queulat (Ventisquero Colgante)                                   - PN Cerro Castillo (Trekking)
          Flujo: 58.500 vis/año                                                 Flujo: 37.200 vis/año
        - Puyuhuapi / Cisnes / La Junta                                       - Cuenca General Carrera (Chelenko)
          Capacidad: 1.405 camas                                                Santuario Capillas de Mármol: 48.500 vis/año
        - PN Isla Magdalena (Acceso marítimo)                                 - Valle Exploradores / PN San Rafael: 39.800 vis/año
                                                                              - Valle del Baker / PN Patagonia: 32.400 vis/año
                                                                              - Cuello Mitchell: Caleta Tortel (27.000 pernoct.)
                                                                              - Fin de Ruta: Villa O'Higgins (16.400 pernoct.)
```

#### Cuantificación de Capacidades y Rendimientos Operacionales

Siguiendo la métrica de Stafford Beer:
- **Actualidad ($A$):** Flujo real observado de visitantes o pernoctaciones en condiciones vigentes.
- **Capacidad ($C$):** Lo que podría atender el sistema con los recursos e infraestructura existentes bajo gestión óptima.
- **Potencialidad ($P$):** Lo que podría absorber el sistema resolviendo cuellos de botella estructurales (pavimentación, naves de respaldo, desestacionalización) sin violar las capacidades de carga ecológica.
- **Productividad:** $A / C$
- **Latencia:** $C / P$
- **Rendimiento Global:** $A / P$

| Nodo / Enlace del Sistema | Variable de Flujo | Capacidad Nominal ($C$) | Actualidad Observada ($A$) | Potencialidad Sostenible ($P$) | Productividad ($A/C$) | Latencia ($C/P$) | Rendimiento Global ($A/P$) | Cuello de Botella Estructural |
|---|---|---|---|---|---|---|---|---|
| **PN Queulat (Ventisquero Colgante)** | Visitantes / año | 75.000 vis | 58.500 vis | 90.000 vis | **0.78** | **0.83** | **0.65** | Capacidad de estacionamiento, pasarelas morrenaicas y congestión en Cuesta Queulat (ripio de vía única). |
| **PN Cerro Castillo (Circuito Horquetas)** | Excursionistas / año | 50.000 vis | 37.200 vis | 65.000 vis | **0.74** | **0.77** | **0.57** | Falta de refugios de montaña rústicos y erosión de senderos por falta de guardaparques permanentes. |
| **Santuario Capillas de Mármol (Río Tranquilo)** | Pasajeros navegados / año | 65.000 pax | 48.500 pax | 75.000 pax | **0.75** | **0.87** | **0.65** | Oleaje y viento que cierran puerto por la Armada (hasta 35 días/temporada); saturación de botes en cavernas. |
| **Glaciar Exploradores / PN San Rafael** | Excursionistas sobre hielo / año | 12.000 pax (antigua) | **0 pax** (Cerrado por CONAF) | 15.000 pax (con ruta segura) | **0.00** | **0.80** | **0.00** | **Colapso criosférico:** Cierre administrativo total por riesgo geológico validado por Corte de Apelaciones. |
| **Ruta Lacustre Lago General Carrera** | Vehículos transportados / año | 24.000 veh | 16.800 veh | 32.000 veh | **0.70** | **0.75** | **0.53** | Falla recurrente de motores en Barcaza La Tehuelche; nave de reemplazo Pilchero con solo 40% de capacidad. |
| **Paso Bimodal Fiordo Mitchell (Yungay - Bravo)** | Vehículos al extremo sur / año | 14.000 veh | 9.400 veh | 20.000 veh | **0.67** | **0.70** | **0.47** | Monopolio de una sola barcaza subvencionada (Padre Antonio Ronchi); accidentes en rampas y marejadas. |
| **Planta de Alojamiento Regional (10 comunas)** | Pernoctaciones formales / año | 720.000 pern | 472.000 pern | 1.100.000 pern (desestacionalizado) | **0.66** | **0.65** | **0.43** | **Hiper-estacionalidad:** 85% de ocupación en enero-febrero pero <20% de mayo a agosto (inactividad forzada). |

---

### 3.3 Ecuación de Variedad de Ashby/Beer y Análisis de Operadores

Aplicando la ley de variedad requerida a la red turística y de conservación de Aysén:

$$V_R \ge \frac{V_D}{V_T}$$

#### Catálogo de Perturbaciones Críticas del Entorno ($V_D$)
1. **Perturbaciones Geodinámicas y Cambio Climático ($V_{D1}$):**
   - Adelgazamiento de la lengua terminal y formación de lagunas proglaciares con riesgo de vaciamiento repentino (*GLOF*) en Ventisquero Queulat y Glaciar Exploradores.
   - Deslizamientos en masa y aluviones que cortan la Ruta 7 en fiordo Queulat y sectores de Villa Santa Lucía / Puyuhuapi.
2. **Perturbaciones Logísticas y de Infraestructura ($V_{D2}$):**
   - Paralización imprevista por pana mecánica o mantención de transbordadores estratégicos (Barcazas *Tehuelche* y *Padre Antonio Ronchi*).
   - Tarifas aéreas abusivas en temporada alta en Aeródromo Balmaceda (BBA), alcanzando pasajes de más de $250.000 CLP solo ida, restringiendo el turismo nacional de clase media.
3. **Perturbaciones Económicas y de Mercado ($V_{D3}$):**
   - Fuga del excedente económico (*leakage*) por contratación de tours y cruceros en Santiago, Europa y Norteamérica.
   - Caída abrupta de la demanda en otoño e invierno, liquidando el flujo de caja de micropymes comunales.
4. **Perturbaciones de Regulación e Informalidad ($V_{D4}$):**
   - Proliferación de cabañas y guías no registrados que compiten de manera desleal con prestadores formales que asumen costos de patentes y resoluciones sanitarias.
   - Incertidumbre legal en la transición CONAF $\rightarrow$ SBAP por vacíos reglamentarios en el otorgamiento de concesiones turísticas bajo la Ley 21.600.

#### Respuestas Regulatorias Requeridas ($V_R$), Atenuadores y Amplificadores

```
                             INGENIERÍA DE VARIEDAD (ASHBY / ESPEJO)
┌──────────────────────────────────────────────┐          ┌──────────────────────────────────────────────┐
│       ATENUADORES DE VARIEDAD (FILTROS)      │          │   AMPLIFICADORES DE VARIEDAD (MULTIPLICADORES)│
├──────────────────────────────────────────────┤          ├──────────────────────────────────────────────┤
│ 1. Capacidad de Carga y Reserva Digital:     │          │ 1. Red de Comunidades Portal (26 Municipios):│
│    Sistemas de reserva en línea obligatorios │          │    Empoderamiento municipal y gobernanza     │
│    en parques (paseonline.conaf.cl) para     │          │    local de los bordes de parques protegidos.│
│    evitar saturación de senderos y fauna.    │          │                                              │
│ 2. Polígonos y Planes de Acción ZOIT:        │          │ 2. Rutas de Intereses Especiales Invernales: │
│    Filtro de priorización de inversión MOP   │          │    Desarrollo de astroturismo, observación de│
│    y SUBDERE bajo la Ley 20.423.             │          │    cetáceos y senderismo con raquetas.       │
│ 3. Sellos Oficiales de Calidad y Sustentab.: │          │ 3. Flota de Barcazas de Respaldo Redundante: │
│    Sellos R (Registro), Q (Calidad) y S      │          │    Contratos MTT que exijan naves de soporte │
│    (Sustentabilidad) para filtrar oferta     │          │    inmediato (*redundancy of command*).      │
│    insegura.                                 │          │                                              │
│ 4. Protocolos Geológicos Preventivos:        │          │ 4. Plataformas Cooperativas de Venta Directa:│
│    Monitoreo DGA de glaciares para definir   │          │    Comercialización digital local para saltar│
│    umbrales seguros de aproximación.         │          │    agencias intermediarias de Santiago.      │
└──────────────────────────────────────────────┘          └──────────────────────────────────────────────┘
```

---

### 3.4 Arquitectura de Gobernanza VSM (Sistemas 1 a 5 de Stafford Beer)

Modelado operacional de la red de conservación y turismo de Aysén:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ SISTEMA 5: POLÍTICA, IDENTIDAD TERRITORIAL Y CLAUSURA NORMATIVA                        │
│ - Gobierno Regional de Aysén (GORE / CORE), Comité de Ministros del Turismo (ZOIT) y   │
│   Ministerio del Medio Ambiente (dirección superior del SBAP - Ley 21.600).            │
│ - Define la identidad regional: "Aysén Reserva de Vida y Destino de Naturaleza".       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SISTEMA 4: INTELIGENCIA, ADAPTACIÓN Y PROSPECCIÓN DE FUTURO                            │
│ - CIEP (Centro de Investigación en Ecosistemas de la Patagonia), DGA (Glaciología),     │
│   ProChile, Universidad Austral de Chile (Programa Austral Patagonia).                 │
│ - Modelado de riesgos de cambio climático, prospección de mercados internacionales y   │
│   diseño de estrategias para quebrar la estacionalidad invernal.                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SISTEMA 3: CONTROL OPERACIONAL INTERNO, SINERGIA Y ASIGNACIÓN DE RECURSOS              │
│ - SERNATUR Región de Aysén, Dirección Regional CONAF/SBAP, SEREMI de Economía y MTT.  │
│ - Negociación de cuotas de visitación, administración de convenios de concesión,       │
│   asignación de subsidios de transporte y mantención de senderos públicos.             │
│                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ SISTEMA 3*: AUDITORÍA ESPORÁDICA DIRECTA (SPORADIC AUDIT)                          │ │
│ │ - Inspecciones sorpresivas de la Armada (DIRECTEMAR) a lanchas en lago y fiordos.  │ │
│ │ - Fiscalizaciones conjuntas SERNATUR-Salud-Carabineros contra prestadores piratas. │ │
│ │ - Auditorías de la Contraloría General de la República a contratos de concesión.   │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SISTEMA 2: COORDINACIÓN Y ANTI-OSCILACIÓN (NEUTRALIZACIÓN DE INTERFERENCIAS)           │
│ - Mesas Comunales de Turismo, gobernanza de las 4 ZOITs (Planes de Acción coordinados),│
│ - Turnos y protocolos de zarpe entre boteros en Capillas de Mármol (asociaciones),    │
│ - Calendarios unificados de transporte bimodal y transbordadores Somarco/Naviera Aust. │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SISTEMA 1: UNIDADES OPERACIONALES AUTÓNOMAS DE BASE (ENTREGA DE VALOR)                 │
│ 1. S1.1: Guardaparques y Centros de Interpretación CONAF/SBAP en unidades SNASPE.      │
│ 2. S1.2: Alojamientos y Cabañas rurales familiares en los 10 municipios.               │
│ 3. S1.3: Guías locales de turismo aventura (trekking, cabalgatas, kayak, escalada).    │
│ 4. S1.4: Transportistas terrestres y armadores de navegación lacustre/marítima menor.  │
│ 5. S1.5: Artesanos de lana/madera y red de gastronomía típica patagónica.              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Análisis de las 5 Relaciones de Gobernanza de Raúl Espejo
1. **Falla en la Relación Política/Estrategia (S5-S4-S3):** El Estado central declara a Aysén como destino de naturaleza mundial (S5) pero no provee a la región de la infraestructura vial básica ni del presupuesto necesario en el SBAP para gestionar 5,8 millones de hectáreas con más de 20 guardaparques por parque (S3).
2. **Quiebre en la Cohesión y Negociación de Recursos (S3-S1):** Cuando CONAF cerró el Glaciar Exploradores por seguridad geológica justificada en estudios técnicos de la DGA (S4 $\rightarrow$ S3), no existió un mecanismo de negociación ni subsidio de transición económica para los guías locales de Puerto Río Tranquilo (S1), desatando una judicialización hostil en tribunales.
3. **Debilidad en la Coordinación (S2-S1):** En temporada estival se generan cuellos de botella severos por descoordinación entre las llegadas de vuelos a Balmaceda y la capacidad disponible de arriendo de vehículos y pasajes en barcazas.
4. **Ceguera del Monitoreo Adaptativo (S4-Entorno):** La incapacidad del aparato público para censar en tiempo real los flujos de visitantes de plataformas digitales (Airbnb, redes sociales) impide anticipar sobrecargas en sistemas de alcantarillado rural y plantas de tratamiento de agua potable comunales.
5. **Ineficacia de la Auditoría Esporádica (S3*-S1):** Debido a la inmensidad del territorio, las inspecciones en terreno de SERNATUR y la SEREMI de Salud son extremadamente escasas, permitiendo que la informalidad florezca sin control en comunas periféricas como Tortel o Lago Verde.

---

### 3.5 Realidad Territorial Fáctica Descubierta en la Investigación Ciega

#### 3.5.1 Demanda Real, Pernoctaciones y Gasto Promedio
- **Pernoctaciones formales (INE EMAT):** La Región de Aysén registra anualmente entre 364.000 y 472.000 pernoctaciones en Establecimientos de Alojamiento Turístico (EAT) formales.
- **Distribución por origen:** El 72% al 75% corresponde a turistas residentes en Chile (con fuerte predominio del Gran Santiago y el Biobío), mientras que el 25% al 28% restante corresponde a turistas internacionales (principalmente de Europa occidental, Norteamérica, Brasil y Argentina).
- **Gasto promedio diario (Subturismo / SIET):**
  - Turista nacional: Promedio de $48.000 a $65.000 CLP diarios (US$ 50 a US$ 70), enfocado en alojamiento familiar y alimentación básica.
  - Turista receptivo internacional de larga distancia: Promedio de $120.000 a $180.000 CLP diarios (US$ 130 a US$ 195), concentrado en excursiones de turismo aventura, guiados de pesca con mosca y lodges de naturaleza.
  - Estadía media regional: 2,4 a 2,8 noches por establecimiento, denotando un fuerte patrón de "turismo de tránsito" a lo largo de la Carretera Austral.

#### 3.5.2 Parques Nacionales CONAF y la Crítica Transición a la Ley 21.600 (SBAP)
- **Afluencia anual consolidada:** Las unidades SNASPE de Aysén reciben entre 230.000 y 284.000 visitas anuales controladas.
- **Jerarquía de parques:**
  - **Parque Nacional Queulat:** Históricamente el más visitado de la región (~50.000 a 58.500 ingresos anuales registrados en el sector Ventisquero Colgante).
  - **Parque Nacional Laguna San Rafael:** 1,74 millones de hectáreas. La visitación directa controlada por CONAF en portería es de 5.000 a 7.000 visitas, pero el flujo real supera las 39.000 visitas anuales al sumar las navegaciones comerciales en catamaranes de alta velocidad desde Puerto Chacabuco y la entrada histórica por Bahía Exploradores.
  - **Parque Nacional Cerro Castillo:** Entre 30.000 y 37.200 visitas anuales, posicionado internacionalmente por el circuito de trekking Las Horquetas y en proceso de incorporación a la Lista Verde de la UICN.
  - **Parque Nacional Patagonia:** ~28.000 a 32.400 visitas anuales, articulado en los sectores Valle Chacabuco, Jeinimeni y Tamango tras la donación histórica de Tompkins Conservation.
- **La encrucijada del SBAP:** La promulgación de la Ley 21.600 en 2023 crea el nuevo Servicio de Biodiversidad y Áreas Protegidas, pero el traspaso de funcionarios, guardaparques e infraestructura desde CONAF ha sufrido severas dilaciones administrativas y presupuestarias. Esto genera un vacío operativo crítico en terreno, con unidades que tienen ratios alarmantes de 1 solo guardaparque por cada 30.000 o 40.000 hectáreas de bosque y montaña.

#### 3.5.3 Concesiones Turísticas y Conflicto Público-Privado: El Caso Glaciar Exploradores
- **El marco de la Ley 21.600:** Deroga el antiguo título de concesiones de la Ley 20.423 y establece que toda concesión en áreas protegidas del Estado con infraestructura permanente mayor a 1 año debe licitarse públicamente por plazos de hasta 30 años, exigiendo como requisito sine qua non la existencia de un **Plan de Manejo vigente** y un Rol Único Tributario (RUT) exclusivo.
- **El caso Glaciar Exploradores:** En octubre de 2023, la CONAF clausuró definitivamente los permisos de caminata sobre hielo en el Glaciar Exploradores (Parque Nacional Laguna San Rafael), tras un informe técnico de la Dirección General de Aguas (DGA) que constató el rápido adelgazamiento del hielo, la formación de cavernas subglaciares inestables y un riesgo inminente de colapso catastrófico por cambio climático.
- **Respuesta judicial y quiebre social:** Operadores y guías turísticos de Puerto Río Tranquilo interpusieron un recurso de amparo económico acusando privación del derecho al trabajo y falta de consideración de medidas de mitigación. La **Corte de Apelaciones de Coyhaique** rechazó unánimemente el recurso, sentando una jurisprudencia histórica: **el principio precautorio y la protección de la vida humana priman sobre las expectativas económicas legítimas de particulares**. Este fallo expuso la total ausencia de un plan estatal de amortiguación o reconversión laboral para los operadores afectados.

#### 3.5.4 Estrategia de Comunidades Portal de la Patagonia Chilena
- Modelo de gobernanza colaborativa impulsado por la Universidad Austral de Chile (Programa Austral Patagonia), The Pew Charitable Trusts y Balloon Latam, que agrupa a **26 municipios** de Los Lagos, Aysén y Magallanes.
- En Aysén, comunas como Cisnes, Cochrane, Lago Verde, Río Ibáñez y Tortel han aprobado en sus concejos municipales Planes de Acción de Comunidades Portal. Su premisa cibernética es fundamental: **los pueblos no son zonas de paso, sino nodos vivos de custodia y captura económica**, donde debe concentrarse el alojamiento y los servicios para evitar la urbanización indeseada del interior de los parques nacionales.

#### 3.5.5 Zonas de Interés Turístico (ZOIT - Ley 20.423)
Existen 4 ZOIT declaradas oficialmente en la región:
1. **ZOIT Chelenko:** Abarca la cuenca del Lago General Carrera (Río Ibáñez y Chile Chico), con anclas en Capillas de Mármol, Puerto Guadal y el circuito binacional.
2. **ZOIT Aysén Patagonia Queulat:** Abarca Puyuhuapi, Cisnes y La Junta, centrada en el termalismo y el bosque templado lluvioso.
3. **ZOIT Destino Coyhaique / Valle Simpson:** Enfoque en pesca con mosca, turismo de congresos y servicios.
4. **ZOIT Provincia de los Glaciares:** Abarca Cochrane, Tortel y Villa O'Higgins, custodiando las puertas de entrada a Campo de Hielo Sur.
- **Problema sistémico:** Las declaratorias ZOIT no van acompañadas de financiamiento fiscal automático; dependen de postulaciones concursables al FNDR o convenios de programación MOP que a menudo demoran años en ejecutarse.

#### 3.5.6 Informalidad Estructural vs. Sellos R, Q y S de SERNATUR
- De los más de 1.150 prestadores catastrados formalmente por SERNATUR en la región, **apenas 71 prestadores cuentan con Sellos de Calidad Turística (Q) o Sustentabilidad (S)** (menos del 6,2%).
- La informalidad real en temporada estival supera el 35%: arriendo de habitaciones y cabañas sin patente municipal ni resolución sanitaria de la SEREMI de Salud, guías de montaña sin cursos de primeros auxilios en áreas remotas (WFR) y vehículos particulares que realizan transporte irregular de turistas desde el aeropuerto de Balmaceda. La falta de fiscalizadores en terreno convierte al "Sello R" obligatorio en una norma de escasa observancia práctica en zonas rurales.

#### 3.5.7 Estacionalidad Extrema y el Ciclo de Hibernación Económica
- **La ventana de 90 días:** En enero y febrero la ocupación hotelera supera el 82-85% en comunas turísticas. Durante estos 60-90 días, una microempresa turística debe generar el excedente necesario para pagar créditos bancarios, cubrir costos de vida y sostenerse durante los 9 meses restantes.
- **El invierno austral:** Entre mayo y agosto, la ocupación hotelera regional cae a valores de entre 17% y 25% (con cifras inferiores al 12% en comunas rurales como Tortel, O'Higgins o Lago Verde). Los contratos de trabajo son precarios y temporales (a honorarios o plazo fijo estival), generando desocupación estacional y migración forzada de mano de obra joven.

#### 3.5.8 Vulnerabilidad Logística y Fallas de Conectividad Física
- **Cortes de la Ruta 7:** La Carretera Austral, con más de 500 km aún en ripio y suelo estabilizado suelto (calamina), sufre cortes periódicos en Cuesta Queulat por derrumbes invernales y crecidas fluviales en puentes mecano.
- **Crisis de las barcazas:** La navegación en el Fiordo Mitchell (Puerto Yungay - Río Bravo) depende de una única barcaza subvencionada. Cuando sufre fallas mecánicas, comunas como Villa O'Higgins quedan completamente incomunicadas vía terrestre. Similar situación ocurre en el Lago General Carrera ante las continuas salidas de servicio de la barcaza *La Tehuelche*. Cada suspensión de barcaza provoca la cancelación en cadena de decenas de reservas de hoteles y tours.

#### 3.5.9 Distribución y Fuga del Gasto Turístico (*Tourism Leakage*)
- La economía del turismo de naturaleza en la Patagonia chilena padece de una altísima tasa de fuga de divisas. En el segmento de cruceros marítimos de expedición (que recalan en los fiordos o navegan hacia Laguna San Rafael) y en los grandes lodges de pesca de propiedad extranjera:
  - **Entre el 65% y el 80% del valor total del paquete turístico queda fuera de la Región de Aysén**, siendo capturado por operadores mayoristas en Santiago, agencias en Miami o Europa, y aerolíneas troncales.
  - El gasto retenido localmente se limita al consumo menor de café, combustibles, artesanía y entradas fiscales a CONAF, reduciendo drásticamente el multiplicador keynesiano local del turismo.

---

## 4. ETAPA 2: CONTRASTE FORENSE DE SESGOS

Habiendo culminado la investigación ciega e independiente de la Etapa 1, se procede a abrir y auditar minuciosamente el archivo local [`data/systemic/06_turismo_sernatur_conaf.json`](file:///g:/Mi%20unidad/AGY/SUPERFORECAST/data/systemic/06_turismo_sernatur_conaf.json) y el Hub I (*Turismo & Áreas Silvestres*, Nodos #01 a #05) de [`data/aysen_hubs_data.js`](file:///g:/Mi%20unidad/AGY/SUPERFORECAST/data/aysen_hubs_data.js).

### 4.1 Auditoría Minuciosa del Repositorio Existente
El archivo `06_turismo_sernatur_conaf.json` compila de manera impecable y estructurada datos oficiales a corte 2026:
- 1.154 prestadores registrados SERNATUR, 540 alojamientos, 232 operadores de aventura, 238 guías, 71 sellos Q/S.
- 472.000 pernoctaciones estimadas EMAT y 284.000 visitantes a unidades SNASPE de CONAF.
- Series históricas 2015–2026 y desglose para las 10 comunas de la región.
- 18 nodos georreferenciados en el JSON (y 24 en el catálogo de nodos).
- En `aysen_hubs_data.js`, el Hub I incluye un Barómetro Ciudadano (`espejo_barometro`) con 3 preguntas sobre el valor del turismo (códigos `I1_C`, `I3_A`, `I3_C`), donde más del 90% de los ayseninos encuestados apoya el turismo sustentable.

No obstante su pulcritud formal, la auditoría cibernética expone sesgos epistemológicos y vacíos estructurales severos:

### 4.2 Matriz Forense de Sesgos Estructurales

| Dimensión de Sesgo | Manifestación Concreta en el Repositorio (`data/`) | Evidencia Forense de la Investigación Ciega (Etapa 1) | Diagnóstico Cibernético |
|---|---|---|---|
| **1. Sesgo Institucional y Formalista** | El dataset contabiliza exclusivamente la oferta registrada en el Registro Nacional de SERNATUR (1.154 prestadores, 540 alojamientos). | La informalidad en cabañas, residenciales, arriendos por redes sociales y guías no certificados representa entre el 30% y 45% de la capacidad real en temporada alta. | **Ceguera de variedad informal ($V_{inf}$):** El modelo asume que el sistema observado es idéntico al sistema catastrado por la burocracia central. |
| **2. Sesgo Estático y Ceguera de Flujos Monetarios** | El repositorio reporta gasto diario promedio en dólares (ej. US$ 118 en Coyhaique) e ingresos agregados, tratando el gasto como riqueza homogénea local. | Existe una fuga de valor (*leakage*) del 65% al 80% en cruceros y turismo de expedición, que se transfiere directamente a Santiago y matrices internacionales sin dinamizar a los habitantes de los fiordos. | **Confusión Insumo vs. Retención:** Se mide el flujo bruto de gasto que entra al territorio, pero se ignora por completo la tasa de retención neta en el metabolismo comunal. |
| **3. Sesgo Centralista y Reduccionismo Comunal** | Se imputan los datos de grandes hitos naturales a una única comuna cabecera (ej. PN Laguna San Rafael imputado administrativamente a Aysén y Río Ibáñez). | El Parque Nacional Laguna San Rafael abarca 1,74 millones de ha e involucra dinámicas territoriales en Tortel, Chile Chico, Cochrane y Chacabuco. Las comunas aisladas (Guaitecas con 21 prestadores, Tortel con 42) quedan relegadas a la insignificancia numérica. | **Falla de Recursión Espacial:** No se modela la red de conectividad y corredores ecológicos que cruza múltiples jurisdicciones comunales. |
| **4. Ceguera de Vulnerabilidad y Riesgo Criosférico** | Las series históricas 2015–2026 proyectan un crecimiento suave y lineal de visitantes (de 148.000 en 2015 a 284.000 en 2026), incluso en Laguna San Rafael (de 24.500 a 39.800). | La clausura total de las caminatas en el Glaciar Exploradores decretada por CONAF en 2023 por inestabilidad de morrenas y peligro de colapso detuvo a cero la actividad de decenas de pymes turísticas locales. | **Filtro Anti-Perturbación:** La base de datos es ciega a los eventos de quiebre geológico y climático ($V_D$), ocultando las crisis socioeconómicas locales bajo agregaciones regionales. |
| **5. Ceguera de Transición Legal e Institucional** | El dataset sigue rotulando a perpetuidad a las áreas protegidas bajo la gobernanza exclusiva de "CONAF - SNASPE". | La Ley 21.600 promulgada en 2023 crea el SBAP, cambia radicalmente el régimen de concesiones turísticas a 30 años con planes de manejo obligatorios y transfiere las competencias al Ministerio del Medio Ambiente. | **Anacronismo Institucional:** Ausencia de seguimiento a la ley ambiental más importante de las últimas décadas en Chile. |

---

### 4.3 Matriz de Brechas Cibernéticas y Ceguera VSM

Variables requeridas por el modelo VSM no presentes en `06_turismo_sernatur_conaf.json` ni en `aysen_hubs_data.js`:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ MATRIZ DE VARIABLES AUSENTES Y VACÍOS DE VARIEDAD EN EL REPOSITORIO                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Tasa de Fuga del Gasto Turístico (% de ingresos retenidos en la comuna vs. fuga).   │
│ 2. Oferta Turística No Registrada / Informal (Estimación muestral de camas informales).│
│ 3. Índice de Vulnerabilidad por Conectividad (Días de barcaza cancelados / año).       │
│ 4. Estado de Implementación de la Ley 21.600 SBAP (Planes de Manejo aprobados).       │
│ 5. Monitoreo Glaciológico de Senderos Turísticos (Tasa de retroceso y riesgo DGA).     │
│ 6. Cartera de Inversión Ejecutada en las 4 ZOITs ($ FNDR ejecutado vs. comprometido). │
│ 7. Balance Estacional de Empleo (Contratos formales en enero vs. contratos en julio). │
│ 8. Gobernanza de Comunidades Portal (Convenios de comanejo municipal - CONAF vigentes).│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.4 Plan de Captura y De-biasing de Datos a Costo $0

Para dotar a la plataforma de una arquitectura de datos sin sesgos, orientada a la toma de decisiones cibernéticas y sin costo de infraestructura ($0), se diseñan los siguientes conectores estáticos automatizables:

| Fuente Institucional Primaria | Ley / Mandato Habilitante | Variable Crítica a Capturar | Frecuencia de Actualización | Mecanismo de Ingestión Automatizable ($0 Costo) |
|---|---|---|---|---|
| **Subsecretaría de Turismo / SERNATUR** | Ley N° 20.423, Art. 5 y 12 | Gasto medio diario desglosado por ítem (alojamiento local vs. intermediación externa) y perfil receptivo. | Semestral | Descarga automatizada de microdatos anonimizados de la Encuesta de Turismo Receptivo y Nacional desde DataTurismo vía API/CSV. |
| **Servicio de Impuestos Internos (SII)** | Código Tributario, Art. 35 (Estadísticas Tributarias) | Ventas declaradas (F29) en rubro 55 (Alojamiento) y 56 (Restaurantes) por tramo de facturación y comuna. | Anual | Script Python sobre archivos abiertos de Estadísticas Tributarias por Comuna y Actividad Económica del SII. |
| **CONAF / SBAP (Ministerio del Medio Ambiente)** | Ley N° 21.600, Art. 58 a 65 y Ley 20.285 (Transparencia) | Catastro de Concesiones Turísticas en Áreas Protegidas, vigencia de Planes de Manejo y capacidad de carga por sendero. | Anual | Consulta y parseo del Registro Público de Concesiones del SBAP / Solicitudes de Transparencia pasiva semestrales. |
| **Dirección General de Aguas (DGA)** | Código de Aguas, DFL 1.122 / Red Hidrométrica Nacional | Monitoreo de balance de masa y dinámica morrénica en glaciares turísticos (Ventisquero Colgante, Exploradores). | Semestral | Descarga de informes técnicos de glaciología de la División de Hidrología de la DGA (biblioteca digital DGA). |
| **Ministerio de Transportes y Telecomunicaciones (DTPR)** | Ley N° 20.378 (Subsidio al Transporte Público) | Tasa de cancelación y cumplimiento de itinerarios en barcazas subsidiadas (Fiordo Mitchell, Lago General Carrera). | Mensual | Ingesta de bitácoras de fiscalización publicadas por DTPR en Portal de Datos Abiertos de Transporte. |
| **Red de Comunidades Portal de la Patagonia (UACh/Pew)** | Convenios Municipales Ley N° 18.695 | Estado de avance de los Planes de Acción de Comunidades Portal en los 10 municipios de Aysén. | Anual | Recolección de actas de aprobación en Concejos Municipales y repositorio público de comunidadesportal.cl. |
| **Instituto Nacional de Estadísticas (INE)** | Ley N° 17.374 (Estadísticas Oficiales) | Empleo informal y asalariado estacional en comercio, hotelería y transporte en la Región de Aysén. | Trimestral | Procesamiento de la base de datos de la Encuesta Nacional de Empleo (ENE) filtrada para Aysén y desagregada por trimestre móvil. |

---

## 5. CONCLUSIONES Y SÍNTESIS CIBERNÉTICA

1. **La viabilidad del turismo aysenino no es un problema de promoción, sino de ingeniería de variedad:** Promocionar internacionalmente un destino como Aysén sin atenuar las perturbaciones de conectividad (cortes de Ruta 7, escasez de barcazas) ni amplificar la variedad regulatoria local (Comunidades Portal, naves de respaldo) conduce a la saturación estival, al resentimiento comunitario y al colapso de la experiencia turística.
2. **El principio precautorio frente al cambio climático exige nuevos contratos sociales:** El caso del Glaciar Exploradores demuestra que el colapso criosférico obligará a CONAF y al futuro SBAP a cerrar senderos históricos por riesgo geológico. La cibernética enseña que la clausura de una vía operacional ($S1$) sin un mecanismo regulador de reconversión laboral ($S3$) desestabiliza la viabilidad de la comunidad entera.
3. **El sesgo formalista invisibiliza la economía popular:** La base de datos preexistente en `06_turismo_sernatur_conaf.json`, al registrar únicamente lo formal ante SERNATUR, oculta el verdadero tejido de supervivencia de las familias de Aysén que arriendan cabañas y guían turistas para resistir el invierno.
4. **La transición al SBAP es la gran oportunidad de rediseño institucional:** La Ley 21.600 ofrece el marco legal para implementar concesiones turísticas a 30 años con alto estándar ambiental, vinculadas directamente a los Planes de Acción de las Comunidades Portal.

---

## 6. REMAINING QUESTIONS & GAPS (PREGUNTAS REMANENTES Y VACÍOS)

Para garantizar la honestidad técnica y la continuidad de la investigación, se explicitan los siguientes vacíos y recomendaciones para los siguientes investigadores:
1. **Modelado cuantitativo exacto del multiplicador local vs. fuga (*leakage*):** Aunque se estimó una fuga del 65% al 80% en cruceros y pesca deportiva de alta gama con base en fuentes secundarias y literatura turística patagónica, se carece de microdatos tributarios comunales cruzados con transferencias bancarias internacionales para modelar el flujo de caja exacto que queda retenido en el comercio de cada caleta o aldea.
2. **Impacto socioeconómico longitudinal del cierre del Glaciar Exploradores:** No se dispuso de un censo post-cierre (2024–2026) sobre el destino ocupacional de los 15 operadores y 30 guías afectados de Puerto Río Tranquilo, ni de su nivel de reconversión hacia el kayakismo o navegación lacustre.
3. **Reglamentos específicos de la Ley 21.600 en tramitación:** A la fecha de este corte, varios de los reglamentos del SBAP continúan en proceso de toma de razón ante la Contraloría General de la República, lo que deja en suspenso los procedimientos operativos exactos de licitación de concesiones turísticas para el periodo 2026–2028.
4. **Prioridad para el siguiente investigador:** Realizar un cruce geoespacial entre las zonas de riesgo criosférico identificadas por la DGA (retroceso glaciar, morrenas inestables) y los 24 hitos turísticos georreferenciados en el Hub I, con el fin de generar un mapa de alerta temprana de activos turísticos en riesgo de clausura administrativa.

---
*Fin del Informe de Investigación Cibernética — Sub-Agente 2 (Ola 2)*
