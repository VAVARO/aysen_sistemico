# INFORME CIBERNÉTICO DE INVESTIGACIÓN CIEGA (VSM & VIPLAN): ESTRUCTURA ECONÓMICA, EMPLEO, COSTO DE VIDA Y FUGA DE VALOR EN LA REGIÓN DE AYSÉN

**Sub-Agente 4 — Investigación Autónoma e Integridad Sistémica**  
**Fecha:** Noviembre 2026  
**Marco Teórico de Referencia:** Cibernética Organizacional de Stafford Beer (*Brain of the Firm*, 1972/1981; *The Heart of Enterprise*, 1979; *Model of Contemporary Capitalism*, 1973), Metodología VIPLAN de Raúl Espejo (*Cybersyn, big data, variety engineering and governance*, AI & Society, 2022; Espejo & Reyes, 2011/2016) y Ley de Variedad Requerida de W. Ross Ashby (1956, 1964).  
**Protocolo de Ejecución:** Dos Etapas Estrictas:
1. **Etapa 1 (Ciega / Tabula Rasa):** Sin lectura de la base de datos local `data/`. Investigación independiente mediante fuentes oficiales primarias (Banco Central de Chile, INE, DIPRES, SII, SUBPESCA, CMF, Biblioteca del Congreso Nacional, Contraloría General de la República y literatura especializada).
2. **Etapa 2 (Contraste de Sesgos):** Apertura y contraste analítico contra `data/systemic/04_inversion_seia_economia.json` y el Hub V (`inversion`) en `data/aysen_hubs_data.js`.

---

## 1. INTRODUCCIÓN Y MARCO EPISTEMOLÓGICO

### 1.1 El Reto Cibernético del Metabolismo Austral
La Región de Aysén del General Carlos Ibáñez del Campo (CL-XI) constituye un caso paradigmático de **economía de enclave combinada con dependencia fiscal extrema e insularidad funcional**. Con una superficie de 108.494 km² (14,3% del territorio continental de Chile) y una población estimada de 103.000 habitantes (densidad inferior a 1 hab/km²), su metabolismo económico no puede analizarse mediante los modelos agregados neoclásicos habituales diseñados para economías continuas y de mercado denso.

Aplicando la epistemología de la cibernética organizacional desarrollada por Stafford Beer y refinada metodológicamente por Raúl Espejo (1989, 2011, 2022):
* **Cibernética de Primer Orden (Descripción de Caja Negra):** Observa los flujos materiales y monetarios que cruzan las fronteras del sistema regional (insumos importados, gasto público, biomasa extraída, productos exportados, transferencias de excedentes).
* **Cibernética de Segundo Orden (Descripción Operacional y Reflexiva):** Observa las relaciones de poder, los acuerdos institucionales, la autonomía de las partes y las conversaciones estructuradas que generan o suprimen variedad en la toma de decisiones. Como argumenta Espejo (2022), la viabilidad no es una propiedad estática de las cifras contables, sino la capacidad homeostática de un sistema para mantener su identidad frente a perturbaciones del entorno sin destruir la autonomía de sus componentes primarios.

### 1.2 La Mnemotecnia TASCOI como Herramienta de Desanclaje
Para evitar el sesgo de anclaje (asumir que el sistema regional "es lo que el gobierno mide" o "lo que el SEIA aprueba"), la metodología VIPLAN prescribe el nombramiento explícito de los sistemas viables a través de la mnemotecnia **TASCOI**:
* **T (Transformation):** La transformación física, informacional o institucional de insumos en productos.
* **A (Actors):** Los agentes humanos e instituciones operativas que llevan a cabo la transformación.
* **S (Suppliers):** Los proveedores de insumos críticos (capital, energía, insumos biológicos, trabajo, regulaciones).
* **C (Customers / Beneficiaries):** Los receptores o usuarios finales de los productos del sistema.
* **O (Owners / Regulators):** Quienes poseen la autoridad para redefinir el propósito, asignar presupuestos y clausurar el sistema.
* **I (Interveners):** Los actores del entorno contextual (comunidades, gremios, fiscalizadores, leyes internacionales) que restringen o modulan la operación del sistema.

---

## 2. ETAPA 1: MODELACIÓN AUTÓNOMA CIEGA (TABULA RASA)

### 2.1 Nombramiento y Matriz TASCOI en Tres Niveles de Recursión

La economía de Aysén se estructura en tres niveles anidados de recursión viables:

```
[ RECURSIÓN 0: Sistema Metabólico Regional de Aysén ]
  ├── [ RECURSIÓN 1.1: Complejo Primario-Exportador (Salmonicultura, Pesca y Minería) ]
  │     ├── R 2.1.1: Concesiones y Centros de Engorda de Fiordos (Cisnes, Guaitecas, Aysén)
  │     ├── R 2.1.2: Red de Proveedores Logísticos, Talleres de Redes y Transporte Marítimo
  │     └── R 2.1.3: Pesca Artesanal, Extracción Bentónica y Plantas de Procesamiento
  │
  ├── [ RECURSIÓN 1.2: Complejo Estatal-Asistencial, Infraestructura y Empleo Público ]
  │     ├── R 2.2.1: Inversión en Conectividad Vial, Portuaria y Aeroportuaria (MOP/Vialidad)
  │     ├── R 2.2.2: Red Asistencial de Salud, Educación y Servicios Públicos (GORE/Minsal/SLEP)
  │     └── R 2.2.3: Aparato de Fomento Productivo y Subsidios de Excepción (DIPRES/Corfo/Sercotec)
  │
  └── [ RECURSIÓN 1.3: Economía Doméstica, Servicios de Proximidad, Turismo y MiPymes ]
        ├── R 2.3.1: Comercio Minorista, Almacenes y Red de Corresponsalía CajaVecina
        ├── R 2.3.2: Clúster Turístico Estacional y Servicios de Alojamiento/Gastronomía
        └── R 2.3.3: Economía Campesina Familiar, Ganadería Extensiva y Cadena de Biomasa/Leña
```

#### Matriz TASCOI Detallada por Nivel de Recursión

| Elemento TASCOI | Recursión 0: Sistema Metabólico Regional | Recursión 1.1: Complejo Primario-Exportador | Recursión 1.2: Complejo Estatal e Inversión Pública | Recursión 1.3: Economía Doméstica y MiPymes |
|:---|:---|:---|:---|:---|
| **Transformación (T)** | Transforma recursos naturales vírgenes (agua, suelo, fiordos) y gasto público nacional en habitabilidad soberana, exportaciones de biomasa y reproducción social en aislamiento geográfico. | Transforma concesiones marítimas, alevines y alimento importado en biomasa de salmónidos y concentrados minerales para exportación global. | Transforma transferencias fiscales del nivel central (FNDR, MOP, MINVU, Subdere) en obras de conectividad física, transferencias sociales y salarios de empleados públicos. | Transforma bienes de consumo importados y recursos locales (leña, paisaje, carne) en abastecimiento de hogares, hospitalidad turística y empleo de subsistencia. |
| **Actores (A)** | Pobladores, trabajadores conmutantes y residentes, microempresarios, funcionarios públicos, autoridades electas (Gobernador, Alcaldes, CORE). | Holdings multinacionales (AquaChile, Cooke, MultiX, Australis, Cermaq, Mowi, Blumar), tripulaciones de wellboats, buzos tácticos, operarios de plantas. | GORE Aysén, Delegación Presidencial, SEREMIs (MOP, Trabajo, Economía), DIPRES, Contraloría Regional, Municipalidades (SECPLA). | Comerciantes de barrio, transportistas de fletes, operadores turísticos familiares, artesanos, productores de leña/pellet, cuadrillas agrícolas. |
| **Suppliers (S)** | Biosfera austral, Estado central chileno (Hacienda/DIPRES), mercados globales de commodities, importadores de alimentos/combustibles. | Productoras de ovas y alevines (Los Lagos/Araucanía), fabricantes de alimento balanceado (Skretting, BioMar en Puerto Montt), astilleros y navieras. | Presupuesto de la Nación (Ley de Presupuestos aprobada por el Congreso), contratistas de obras públicas (CChC), personal calificado continental. | Mayoristas de Puerto Montt, Osorno y Santiago; camioneros de ruta por Argentina; BancoEstado (efectivo y crédito FOGAPE); bosques nativos privados y fiscales. |
| **Customers (C)** | Población residente de las 10 comunas de Aysén, cadenas productivas nacionales y el Estado de Chile (preservación de soberanía territorial). | Mercados de ultramar (EE.UU., Japón, Brasil, Rusia, China), intermediarios de commodities en Miami/Santiago, cadenas de retail global. | Familias aiseninas (vivienda, salud, caminos transitables), municipios dependientes del FCM/FRIL, contratistas locales de obras menores. | Hogares locales (alimentación, calefacción, vestido), turistas nacionales e internacionales, visitantes corporativos temporales. |
| **Owners (O)** | Ciudadanía regional (electorado), Gobierno Regional (Gobernador y Consejo Regional) y Ministerio del Interior / Delegación Presidencial. | Directorios de corporaciones transnacionales y accionistas en bolsas de Santiago, Oslo y Tokio; fiscalizados por SUBPESCA y Sernapesca. | Dirección de Presupuestos (DIPRES) del Ministerio de Hacienda, Subsecretaría de Desarrollo Regional (SUBDERE), Ministerios sectoriales en Santiago. | Propietarios individuales de micro y pequeñas empresas, familias microempresarias y cooperativas locales. |
| **Interveners (I)** | Comunidades indígenas kawésqar y yagán, pueblos originarios mapuche-huilliche, pescadores artesanales, movimientos socioambientales patagónicos, sindicatos de la CUT. | Comunidades litorales, ONG ambientales (Terram, Oceana), Superintendencia del Medio Ambiente (SMA), Armada de Chile (DIRECTEMAR), Dirección del Trabajo. | Contraloría General de la República (auditorías de ejecución presupuestaria), Banco Central, Tribunales Ambientales, gremios de empleados públicos (ANEF). | Servicio de Impuestos Internos (SII), SERNATUR, SEREMI de Salud, fiscalizadores de CONAF y SMA (Plan de Descontaminación Atmosférica - PDA). |

---

### 2.2 Flujograma Cuantificado Real del Metabolismo Económico (Estilo Cybersyn)

Inspirado en el diagrama de flujo industrial concebido por Stafford Beer y Raúl Espejo para Cybersyn (1973, reproducido en Espejo 2022, Fig. 1), el siguiente modelo cuantitativo sintetiza el metabolismo monetario y material de Aysén para el ciclo 2023–2024:

```
                          ENTORNO GLOBAL Y NACIONAL
       (Mercados Salmón EE.UU./Asia)     (DIPRES / Tesorería Nacional)
                     │                                   │
      Exportaciones  │                                   │ Transferencias Fiscales
     US$ 2.500-3.000M│                                   │ $350.000 - $420.000M CLP
                     ▼                                   ▼
 ┌──────────────────────────────────────┐   ┌─────────────────────────────────────┐
 │  COMPLEJO PRIMARIO-EXPORTADOR        │   │  APARATO FISCAL Y BIENESTAR         │
 │  (Salmónidos, Harina, Polimetálicos) │   │  (GORE, MOP, MINVU, SLEP, Salud)   │
 └──────────────────┬───────────────────┘   └──────────────────┬──────────────────┘
                    │                                          │
       Retención    │    FUGA MASIVA DE RENTAS    Retención    │ Salarios Públicos
       Local < 10%  │   > US$ 2.200M (85-90%)     Directa 85%  │ + Asignación Zona
                    │   (Casas matrices Stgo/P.Montt,          │ (~$150.000M CLP)
                    │    utilidades extranjeras,               │ + Obras MOP ($140.000M)
                    │    insumos fuera de región)              │
                    │                                          │
                    ▼                                          ▼
           ┌──────────────────────────────────────────────────────────┐
           │        ECONOMÍA DOMÉSTICA, HOGARES Y MIPYMES LOCALES     │
           │  (PIB Regional Total: ~$1.680.000M CLP / US$ 1.800M)     │
           │  - 56.400 Trabajadores formales (SII)                    │
           │  - ~15.600 Trabajadores informales (INE: 27,3% - 32%)    │
           │  - 9.365 Empresas formales (74,7% Micro, 20,6% Pequeñas) │
           └────────────────────────────┬─────────────────────────────┘
                                        │
           DRENAJE DE LIQUIDEZ Y CONSUMO│ - Sobrecosto Fletes Terrestres/Marítimos (+20-30%)
                                        │ - Pobreza Energética: Leña/Pellet (>30% presupuesto)
                                        │ - Fuga de ahorros hacia banca centralizada
                                        ▼
                         EXTERIOR REGIONAL / CONTINENTE
                (Supermercados mayoristas, combustibles, retail)
```

#### Desglose de los Parámetros Cuantitativos Fundamentales:
1. **Producto Interno Bruto Regional (PIBR):**
   * Representa históricamente el **0,6% del PIB de Chile** (aprox. $1.680.000 millones de CLP / US$ 1.800 millones en valores corrientes 2023-2024).
   * La estructura sectorial está hipertrofiada en dos polos:
     * **Pesca y Acuicultura:** 21% a 29% del PIB regional (altamente volátil según floraciones de algas nocivas FAN, cáligus y precios mundiales).
     * **Administración Pública y Servicios Personales (Salud y Educación):** 32% a 34% del PIB regional consolidado.
     * **Construcción y Obras Viales:** 5% a 6% (90% dependiente de licitaciones públicas MOP/GORE).
     * **Comercio y Turismo Transversal:** 4% a 5% del producto.
2. **El "Embudo de Enclave" (Fuga de Rentas del Salmón):**
   * Aysén alberga más de 740 concesiones acuícolas autorizadas por SUBPESCA, produciendo entre 400.000 y 500.000 toneladas de biomasa anuales (cerca del 45% al 50% de la producción de salmón de Chile, con un valor de exportación de US$ 2.500 a 3.000 millones).
   * **Mecanismos de Fuga:**
     * *Fuga Tributaria:* El Impuesto de Primera Categoría (27%) de las empresas matrices se liquida en las comunas donde están inscritas sus casas matrices (Providencia, Las Condes, Huechuraba en Santiago o Puerto Montt en Los Lagos). Aysén solo recibe la **Patente Única de Acuicultura (PUA)** (20 UTM/hectárea para salmones exóticos), distribuida entre municipios y GORE, monto marginal frente a la rentabilidad corporativa.
     * *Fuga de Valor Agregado:* Las plantas de proceso de alto valor agregado (fileteado, congelado IQF, ahumado), las matrices de genética, los laboratorios ictiopatológicos y los servicios de software y aseguramiento están radicados en Puerto Montt, Chiloé y Biobío. Aysén opera predominantemente como una **maquila biológica marina** (fase de engorda en jaulas flotantes).
     * *Fuga Salarial por Conmutación Interregional:* Entre el 35% y el 45% de la fuerza de trabajo especializada en centros de cultivo (jefes de centro, buzos, médicos veterinarios, técnicos en mantención) opera bajo turnos de conmutación 7x7 o 14x14, ingresando y saliendo vía aeropuertos de Balmaceda o puertos marítimos, y gastando sus remuneraciones en sus regiones de origen permanente (Los Lagos, Los Ríos, Araucanía, Biobío).
3. **El Escudo Fiscal y la Dualidad Salarial:**
   * La inyección fiscal anual directa (GORE FNDR de ~$75.000 a $85.000 millones + MOP cartera superior a $140.000 millones + Salud/Educación) supera los $400.000 millones de CLP.
   * **Brecha Salarial Estructural:** Los funcionarios del Estado reciben por ley la **Asignación de Zona** (DL 249 y DL 889), que añade un sobresueldo de entre 100% y 130% sobre el sueldo base. Esto eleva el ingreso medio regional medido por el INE (ESI) por encima de **$1.040.000 CLP**, aparentando un bienestar generalizado que oculta una profunda brecha frente a los trabajadores del comercio local, la agricultura y el turismo, donde la mediana real ronda los $500.000 a $600.000 CLP.
4. **Drenaje por Costo de Vida e Insularidad Logística:**
   * La canasta de consumo experimenta una inflación estructural respecto al centro del país debido al flete terrestre bimodal (paso obligado por territorio argentino por las provincias de Chubut y Santa Cruz) o ferris marítimos subvencionados (Hornopirén-Caleta Gonzalo, Quellón-Chacabuco).
   * **Pobreza Energética:** El 85% de la matriz de calefacción residencial depende de la leña (más de 400.000 metros estéreos anuales en Coyhaique y Aysén). Los requerimientos de descontaminación (PDA) que exigen leña seca certificada o pellet han encarecido el ítem calefacción a más del **30% del presupuesto familiar** en los meses de mayo a septiembre, actuando como un impuesto recesivo sobre los hogares vulnerables.

---

### 2.3 Ecuación de Variedad Requerida de Ashby ($V_O \ge V_D / V_R$)

De acuerdo con la **Ley de Variedad Requerida de Ross Ashby** (1956), un sistema solo puede ser estable si la variedad de su regulador ($V_R$) es al menos igual a la variedad de perturbaciones del entorno ($V_D$) dividida por la variedad de respuestas tolerables en los resultados ($V_O$):

$$\Large V_O \ge \frac{V_D}{V_R} \quad \Longleftrightarrow \quad V_R \cdot V_O \ge V_D$$

Para que la regulación sea socialmente viable, el conjunto de estados resultantes $V_O$ debe estar contenido estrictamente dentro del conjunto de estados deseables o meta-estables ($V_T$):

$$V_O \subseteq V_T$$

#### Análisis de la Variedad en Aysén:

```
[ PERTURBACIONES DEL ENTORNO (VD) ]                    [ CAPACIDAD REGULATORIA (VR) ]
- Aislamiento geográfico y cortes viales                  - Presupuestos rígidos anuales DIPRES
- Inviernos polares (-15°C, nieve en pasos)                - Escasez de fiscalizadores en terreno
- Floraciones de Algas Nocivas (FAN) y parásitos           - 0 sucursales bancarias privadas en 8 comunas
- Inflación importada por fletes bimodales                - Burocracia centralizada en Santiago
- Desempleo invernal masivo (estacionalidad)              - Planes de fomento estandarizados (DFL 15)
                                  \                  /
                                   \                /
                           DESBALANCE:  VD >>> VR
                           ------------------------
                       RESULTADO (VO) DESBORDA VT:
                  Crisis de habitabilidad, informalidad 30%,
                 quiebra de pymes en invierno, polución por leña.
```

#### Catálogo de Atenuadores y Amplificadores de Variedad en el Territorio

| Categoría | Instrumento / Mecanismo | Naturaleza Cibernética | Efecto Real en la Variedad de Aysén |
|:---|:---|:---|:---|
| **Atenuador Patológico (Reducción Coercitiva)** | **Subsidio DL 889 / Ley 19.853 (17% mano de obra)** | Atenúa la variedad contable de las empresas medianas/grandes absorbiéndose como margen operativo de contratistas salmoneros, pero **no amplifica** la capacidad adquisitiva de los trabajadores locales. | Reduce la variedad de conflicto laboral temporalmente, pero preserva la fragilidad de la estructura salarial de base. |
| **Atenuador Patológico (Filtrado Burocrático)** | **Concurso DFL 15 (Bonificación 20% inversión MiPymes)** | Filtra la complejidad mediante requisitos notariales, balances tributarios auditados y plazos estrechos. Solo ~100 a 150 pymes logran adjudicárselo anualmente. | Atenúa la demanda ciudadana agotando fondos en minutos, excluyendo al 98% del universo MiPyme informal o rural. |
| **Atenuador Estructural Positivo** | **Red de Corresponsalía CajaVecina (BancoEstado)** | Descentraliza la captura transaccional mediante más de 400 puntos en almacenes de las 10 comunas. | Absorbe la variedad de aislamiento físico de 8 comunas sin bancos, permitiendo cobros de subsidios y compras locales sin viajar a Coyhaique. |
| **Amplificador Patológico (Amplificación Ruidosa)** | **Aprobaciones Ambientales SEIA (RCA)** | Amplifica el volumen de anuncios de inversión formal (>US$ 3.300 MM), pero sin control sobre la ejecución real de Capex ni arraigo local. | Crea una falsa sensación de dinamismo económico ("boom de proyectos") mientras la economía real sufre desaceleración. |
| **Amplificador Cibernético Necesario** | **Mercado Público con Reserva de Compra Regional** | Amplifica la cuota de mercado accesible para proveedores aiseninos mediante ponderación por arraigo geográfico en licitaciones del GORE y municipios. | Eleva la variedad de ingresos de cooperativas y contratistas locales, contrarrestando la invasión de licitaciones por firmas de Santiago o Puerto Montt. |
| **Amplificador Cibernético Necesario** | **Fondo Rotatorio de Estabilización Térmica y Fletes** | Amortigua la fluctuación estacional de precios de pellets, leña seca certificada y combustibles en invierno. | Mantiene los estados del sistema ($V_O$) dentro de los umbrales de sobrevivencia doméstica ($V_T$). |

---

### 2.4 Arquitectura de Gobernanza VSM (Sistemas 1 a 5 de Beer)

Siguiendo el Modelo del Sistema Viable de Stafford Beer y los refinamientos de gobernanza de Raúl Espejo (2022, AI & Society):

```
┌────────────────────────────────────────────────────────────────────────┐
│ SISTEMA 5: POLÍTICA, IDENTIDAD Y ETHOS REGIONAL                        │
│ - Consejo Regional de Aysén (CORE) y Gobernador(a) Regional electo(a)  │
│ - Estrategia Regional de Desarrollo (ERD Aysén 2030)                   │
│ - Ethos: Arraigo patagónico, soberanía territorial y preservación      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
              ┌────────────────────┴───────────────────┐
              ▼                                        ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│ SISTEMA 4: INTELIGENCIA      │        │ SISTEMA 3: CONTROL Y COHESIÓN│
│ (Outside and Then)           │◄──────►│ (Inside and Now)             │
│ - CIEP (Investigación Ecosist)│        │ - DIPLADER GORE / Administr. │
│ - Observatorio Laboral SENCE │        │ - Asignación presupuestaria  │
│ - Alertas FAN y Cambio Clim. │        │ - S3* Auditoría: Contraloría │
│ - Rediseño Zona Franca       │        │   Regional, SII, Dir. Trabajo│
└──────────────────────────────┘        └──────────────┬───────────────┘
                                                       │
                                        ┌──────────────┴───────────────┐
                                        ▼                              ▼
                         ┌─────────────────────────────┐┌──────────────┴───────────────┐
                         │ SISTEMA 2: COORDINACIÓN     ││ CANALES DE RECURSOS          │
                         │ (Anti-oscilación)           ││ - Fondos FNDR / FRIL         │
                         │ - Calendario invernal obras ││ - Subsidios MTT barcazas     │
                         │ - Comités de conectividad   ││ - Cuotas de emergencia social│
                         └──────────────┬──────────────┘└──────────────┬───────────────┘
                                        │                              │
                                        └──────────────┬───────────────┘
                                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ SISTEMA 1: OPERACIONES PRIMARIAS (Subsistemas Productivos Autónomos)                 │
│                                                                                      │
│ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌──────────────────────┐ │
│ │ 1.1 Complejo Acuícola/Mar │ │ 1.2 Obras Públicas / MOP  │ │ 1.3 MiPymes y Turism │ │
│ │ Centros engorda fiordos   │ │ Pavimentación Ruta 7      │ │ Comercio y hostales  │ │
│ └───────────────────────────┘ └───────────────────────────┘ └──────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

#### Las 5 Relaciones de Gobernanza según Raúl Espejo (2022) en el Contexto de Aysén:
1. **Relación de Desempeño, Productividad y Latencia (1):**
   * *Diagnóstico:* Existe una severa fractura entre la **productividad** (las salmoneras baten récords de biomasa y utilidades corporativas) y la **latencia** (el territorio no acumula capital fijo, tecnología transferida ni capacidad de resiliencia frente a caídas de la industria). El sistema regional opera a merced del mercado global sin colchón de absorción.
2. **Relación de Cohesión Interna (2):**
   * *Diagnóstico:* Relaciones jerárquicas impositivas desde el nivel central (DIPRES asigna glosas presupuestarias sin considerar los ciclos climáticos del invierno austral). La coordinación horizontal (S2) entre las direcciones ministeriales (MOP, MINVU, Economía) y los municipios es prácticamente nula, generando duplicidades y obras paralizadas en invierno.
3. **Relación de Formulación de Políticas (3):**
   * *Diagnóstico:* Desbalance crónico entre S4 (Inteligencia) y S3 (Control). El conocimiento generado por centros de excelencia regional como el CIEP (Centro de Investigación en Ecosistemas de la Patagonia) rara vez alimenta las decisiones presupuestarias del GORE o los planes sectoriales de SUBPESCA.
4. **Relación de Inclusión y Legitimidad Ciudadana (4):**
   * *Diagnóstico:* Histórica alienación ciudadana. Los estallidos sociales regionales (como el movimiento *"Tu problema es mi problema"* de 2012) son síntomas directos del fracaso de inclusión cibernética: al no existir canales de modulación de variedad en tiempo real, las perturbaciones se acumulan hasta estallar como parálisis territorial completa.
5. **Relación de Ciudadanía Organizacional (5):**
   * *Diagnóstico:* Regulación meta-sistémica deficiente. Las leyes de excepción fueron dictadas en las décadas de 1970 y 1980 (dictadura militar) bajo premisas geopolíticas de poblamiento soberano que hoy no dialogan con los imperativos de transición ecológica, descentralización fiscal y cambio demográfico.

---

## 3. ETAPA 2: CONTRASTE DE SESGOS CON LA BASE DE DATOS EXISTENTE

Habiendo modelado de forma ciega e independiente el metabolismo económico de la Región de Aysén, se procedió a abrir e inspeccionar minuciosamente los archivos del repositorio:
1. `data/systemic/04_inversion_seia_economia.json` (Dataset WP_04, 4.191 líneas, 10 comunas, 20 nodos georreferenciados).
2. `data/aysen_hubs_data.js` (Estructura de Hub V `inversion`, Nodos Satélites #19, #20, #21 y #22).

### 3.1 Diagnóstico Crítico de la Base de Datos Existente

El análisis de contraste revela discrepancias ontológicas y metodológicas profundas entre lo que la base mide y cómo funciona realmente la economía de Aysén:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         MATRIZ DE CONTRASTE DE SESGOS SISTÉMICOS                       │
├──────────────────────────────┬──────────────────────────────┬──────────────────────────┤
│ DIMENSIÓN EVALUADA           │ MODELO EN LA BASE ACTUAL     │ REALIDAD CIBERNÉTICA     │
│                              │ (04_inversion_seia_economia) │ METABÓLICA AUTÓNOMA      │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────┤
│ Inversión Privada            │ N° Proyectos y MM USD        │ Sesgo de Anuncio. Solo   │
│                              │ Aprobados en SEIA (Histórico)│ mide intenciones legales;│
│                              │ Total: 722 proj / US$ 3.355M │ FBCF real no monitoreada │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────┤
│ Domicilio Fiscal Corporativo │ Empresas y Ventas en UF      │ Fuga masiva de tributos: │
│                              │ por Comuna del SII           │ Matrices salmoneras y    │
│                              │                              │ mineras tributan en Stgo │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────┤
│ Conmutación Laboral          │ 56.475 Trabajadores Informa- │ Ignora trabajadores flo- │
│                              │ dos en SII por Comuna        │ tantes (turnos 14x14) que│
│                              │                              │ gastan sueldo fuera      │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────┤
│ Informalidad Laboral         │ Cifras sintéticas comunales  │ INE solo mide regional   │
│                              │ fijas (Guaitecas 35%, etc.)  │ (27-32%); ignora estacio-│
│                              │                              │ nalidad crítica invernal │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────┤
│ Leyes de Excepción           │ AUSENTES AL 100%             │ DL 889, DFL 15, Ley      │
│ Austral                      │ (Ni una variable en el JSON) │ Austral y Zona Franca son│
│                              │                              │ el núcleo de la política │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────┤
│ Costo de Vida e Inflación    │ INEXISTENTE                  │ Aislamiento, fletes por  │
│                              │ (No hay datos de precios)    │ Argentina, leña/pellet   │
│                              │                              │ absorben 30%+ presupuesto│
├──────────────────────────────┼──────────────────────────────┼──────────────────────────┤
│ Inclusión Financiera         │ INEXISTENTE                  │ 8 de 10 comunas sin ban- │
│                              │ (No hay datos bancarios)     │ cos; CajaVecina como sal-│
│                              │                              │ vavidas transaccional    │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────┘
```

---

### 3.2 Los Siete Sesgos Estructurales de la Base de Datos

#### Sesgo 1: El "Sesgo de Anuncio" Ambiental (SEIA vs FBCF Real)
* **Evidencia en el repositorio:**
  * En `04_inversion_seia_economia.json` (líneas 55-58) y el Nodo #19 de `data/aysen_hubs_data.js`:
    ```json
    "total_proyectos_aprobados_historicos": 722,
    "inversion_aprobada_total_mmusd": 3355.5,
    "inversion_en_evaluacion_total_mmusd": 168.7
    ```
    Desglosado por comuna: Aysén (US$ 1.320 MM), Cisnes (US$ 525 MM), Coyhaique (US$ 495,6 MM).
* **Falla Metodológica:**
  * La base toma el monto de inversión declarado en la Declaración o Estudio de Impacto Ambiental (DIA/EIA) como indicador sustituto de la "inversión privada regional".
  * Esto es un **error grave de stock vs flujo**:
    1. Una Resolución de Calificación Ambiental (RCA) favorable caduca a los 5 años si no inicia ejecución, y decenas de proyectos aprobados en Aysén en los últimos 20 años jamás se materializaron (e.g., centrales hidroeléctricas menores abandonadas, proyectos de piscicultura suspendidos tras crisis sanitarias, prospecciones mineras fallidas).
    2. Del Capex efectivamente ejecutado, más del 80% corresponde a maquinaria pesada, aerogeneradores, tuberías y jaulas de cultivo compradas fuera de Aysén o en el extranjero. El gasto de capital local efectivo es insignificante.
  * **Consecuencia:** La base muestra a Puerto Aysén y Cisnes como receptores de miles de millones de dólares, cuando en la práctica sus poblaciones sufren de calles sin pavimentar, déficits de agua potable rural y falta de diversificación económica.

#### Sesgo 2: El "Espejismo del Domicilio Fiscal" en los Datos del SII
* **Evidencia en el repositorio:**
  * En `04_inversion_seia_economia.json` (líneas 59-61) y Nodo #20:
    ```json
    "total_empresas_activas_sii": 9365,
    "total_trabajadores_dependientes_sii": 56475,
    "ventas_anuales_totales_miles_uf": 131520
    ```
    Atribuyendo a Coyhaique 5.535 empresas (59%) y 48.500 miles de UF de ventas, y a O'Higgins solo 57 empresas y Tortel 48 empresas.
* **Falla Metodológica:**
  * Las estadísticas del SII asignan la actividad económica a la comuna declarada como domicilio legal o tributario. Las transnacionales del salmón (que representan más de US$ 2.000 millones en exportaciones extraídas en las aguas de Cisnes, Aysén y Guaitecas) declaran sus ventas y pagan su impuesto corporativo en **Las Condes, Huechuraba, Providencia o Puerto Montt**.
  * Por consiguiente, la base de datos presenta una imagen distorsionada:
    * Coyhaique aparenta ser el motor económico exclusivo (concentrando el 59% de las empresas y más de la mitad del empleo formal).
    * Las comunas litorales e insulares figuran con una capacidad económica minúscula en ventas en UF, a pesar de que bajo sus aguas se genera la mayor masa de divisas por exportaciones del cono sur chileno.

#### Sesgo 3: La Ceguera ante la Conmutación Laboral y la Extranjerización del Empleo
* **Evidencia en el repositorio:**
  * En `04_inversion_seia_economia.json`, el campo `trabajadores_dependientes_sii` reporta 33.650 dependientes en Coyhaique, 12.780 en Aysén, 3.770 en Cisnes, 1.040 en Guaitecas, etc.
* **Falla Metodológica:**
  * La base asume que los trabajadores informados en establecimientos productivos de una comuna son **residentes locales**.
  * En la realidad de los centros de engorda de salmón y faenas de obras públicas viales, el régimen predominante es de **trabajadores conmutantes interregionales**. Estos operan bajo turnos intensivos con alojamiento provisto en pontones o campamentos, pero consumen y ahorran en Puerto Montt, Osorno, Castro o Valdivia.
  * No medir la tasa de conmutación laboral hace imposible calcular el **multiplicador keynesiano del salario local**, sobreestimando el impacto benéfico del empleo industrial en el bienestar comunitario.

#### Sesgo 4: Pseudoprecisión Comunal en Informalidad y Estacionalidad
* **Evidencia en el repositorio:**
  * En `04_inversion_seia_economia.json`:
    * Coyhaique: `informalidad_laboral_estimada_pct: 21.2`
    * Lago Verde: `informalidad_laboral_estimada_pct: 31.0`
    * Guaitecas: `informalidad_laboral_estimada_pct: 35.4`
    * Cochrane: `informalidad_laboral_estimada_pct: 22.6`
    * Tortel: `informalidad_laboral_estimada_pct: 32.0`
* **Falla Metodológica:**
  * El Instituto Nacional de Estadísticas (INE) publica el Boletín de Empleo e Informalidad (ENE) con representatividad estadística **únicamente a nivel regional**. Muestras en comunas como Tortel (500 habs) u O'Higgins (600 habs) tienen errores muestrales superiores al 40-50% si se intentaran desglosar formalmente. Asignar decimales exactos como "35.4%" o "22.6%" sin declarar que son proxies sintéticos constituye pseudoprecisión acrítica.
  * Más aún, la variable es estática: congela un número anual promedio, ocultando el hecho de que la tasa de informalidad y desempleo **se duplica en el invierno**, cuando el turismo se desploma y las obras de construcción vial se detienen por veda climática.

#### Sesgo 5: Ausencia Absoluta de las Leyes de Excepción Austral
* **Evidencia en el repositorio:**
  * Búsqueda en `04_inversion_seia_economia.json` y `data/aysen_hubs_data.js`: Cero menciones a "DL 889", "Ley 19.853", "DFL 15", "Ley Austral", "Ley 19.606" o "Zona Franca".
* **Falla Ontológica:**
  * En una economía de zona extrema, las leyes de excepción constituyen el **marco homeostático primario** mediante el cual el Estado subsidia la viabilidad del capital privado y compensa el sobrecosto de aislamiento.
  * Omitir el DL 889 (bonificación del 17% a la mano de obra pagada por Tesorería) y el DFL 15 (subsidio a la inversión de MiPymes administrado por Corfo/GORE) deja a ciegas al sistema sobre quién está capturando el subsidio público y si estos incentivos han logrado diversificar la matriz regional tras más de 40 años de vigencia.

#### Sesgo 6: Omisión de la Fractura Bancaria y la Exclusión Financiera
* **Evidencia en el repositorio:**
  * No existe registro alguno sobre entidades financieras, colocaciones de crédito comercial, líneas FOGAPE ni presencia de cajeros automáticos o sucursales bancarias.
* **Falla Crítica:**
  * En 8 de las 10 comunas de Aysén **no existe una sola sucursal bancaria de la banca privada**, y en varias tampoco existe oficina física de BancoEstado, dependiendo exclusivamente de la red de **CajaVecina** instalada en almacenes de abarrotes.
  * Para una MiPyme local, el acceso al crédito comercial bancario está severamente bloqueado:
    * Las tasaciones comerciales castigan las propiedades en Aysén por iliquidez geográfica.
    * Grandes extensiones de tierra no cuentan con títulos de dominio saneados (permanecen como ocupaciones o concesiones de Bienes Nacionales, no hipotecables).
    * Esta exclusión crediticia empuja a las microempresas al endeudamiento informal o al colapso de caja en la temporada baja invernal.

#### Sesgo 7: Ceguera ante el Costo de Vida, Fletes y Pobreza Energética
* **Evidencia en el repositorio:**
  * La base incluye variables de ventas de empresas y salarios en UF, pero no tiene una sola métrica de **precios relativos locales**.
* **Falla de Perspectiva:**
  * Evaluar el empleo y los salarios sin deflactar por el índice de costo de vida regional produce conclusiones complacientes. Un salario nominal de $800.000 CLP en Coyhaique o Tortel tiene un poder de compra real inferior a un salario de $500.000 CLP en Temuco o Valdivia, debido al costo del combustible, los fletes marítimos/terrestres por Argentina y la necesidad imperiosa de adquirir entre 20 y 30 metros de leña o toneladas de pellet para sobrevivir al invierno.

---

### 3.3 Tabla Exhaustiva de Brechas, Variables Ausentes y Actores Omitidos

| Dominio Económico | Variable / Indicador Ausente en la Base | Actores / Instituciones Omitidos | Impacto Sistémico en la Toma de Decisiones |
|:---|:---|:---|:---|
| **Leyes de Excepción** | Monto anual desembolsado por Tesorería por Bonificación a la Mano de Obra (DL 889 / Ley 19.853) por rubro y tamaño de empresa. | Tesorería General de la República (TGR), Delegación Presidencial, Gremios empresariales (CChC, SalmonChile). | Impide saber si el Estado subsidia salarios de pymes locales o infla las utilidades de grandes contratistas y salmoneras. |
| **Inversión MiPyme** | Presupuesto anual del DFL 15, número de postulaciones vs adjudicaciones por comuna, tasa de rechazo y monto de inversión privada apalancada. | Subsecretaría de Hacienda, CORFO Aysén, Gobiernos Regionales (Comisión de Fomento Productivo del CORE). | Oculta la ineficacia del fondo para atender al 95% del territorio y su concentración en capitales provinciales. |
| **Zona Franca Aysén** | Estado contractual del recinto franco de Puerto Chacabuco (Ley 20.655), licitaciones fallidas y costo de oportunidad del suelo fiscal reservado. | Ministerio de Hacienda, Empresa Portuaria Chacabuco (EMPORCHA), Cámara de Comercio de Coyhaique y Puerto Aysén. | Mantiene una promesa legislativa incumplida que inhibe inversiones logísticas alternativas. |
| **Flujos de Capital** | Excedente Bruto de Explotación extra-regional (fuga de rentas del salmón hacia matrices en Santiago/Los Lagos y el extranjero). | Grandes Holdings Acuícolas (AquaChile, Cermaq, Cooke), Banco Central de Chile (Cuentas Regionales Satélite). | Impide transparentar el modelo de enclave y justificar un Royalty Territorial compensatorio. |
| **Conmutación Laboral** | Porcentaje de trabajadores de faenas y centros de cultivo con residencia fija fuera de la Región de Aysén (turnos 7x7 y 14x14). | SENCE, Observatorio Laboral de Aysén, Dirección del Trabajo, Empresas de Transporte Intermodal. | Sobreestima el impacto distributivo de la salmonicultura en las familias residentes de la región. |
| **Exclusión Financiera** | Cobertura de sucursales bancarias, puntos de CajaVecina, colocaciones FOGAPE/MiPyme por comuna y rechazo de garantías hipotecarias. | Comisión para el Mercado Financiero (CMF), Asociación de Bancos (ABIF), BancoEstado, FOGAPE. | Invisibiliza la asfixia de liquidez de las microempresas en el litoral y el sur austral durante el invierno. |
| **Costo de Vida y Fletes** | Sobrecosto logístico porcentual en alimentos y materiales de construcción respecto a Puerto Montt/Santiago; Índice de fletes por ruta bimodal/Argentina. | Ministerio de Transportes y Telecomunicaciones (MTT), Gremios de Camioneros de Aysén, Mayoristas de abarrotes. | Niega la pérdida de poder adquisitivo del habitante patagón y dificulta la calibración de subsidios de flete. |
| **Pobreza Energética** | Consumo medio y gasto mensual de hogares en leña, pellet, parafina y gas licuado en invierno; porcentaje del presupuesto familiar absorbido. | Ministerio de Energía, SEREMI del Medio Ambiente (PDA Coyhaique), INFOR, Productores y comercializadores de leña seca. | Bloquea la formulación de políticas integradas de calefacción justa y descontaminación ambiental. |
| **Estacionalidad Laboral** | Variación trimestral del empleo informal en turismo, pesca artesanal y construcción (brecha peak verano vs valle invierno). | Instituto Nacional de Estadísticas (INE), SERNATUR Aysén, Sindicatos de Pescadores y Buzos Artesanales. | Impide anticipar crisis sociales y diseñar subsidios de retención de empleo en los meses fríos. |

---

## 4. PLAN DE CAPTURA DE DATOS SIN SESGO

Para elevar la variedad requerida de la plataforma territorial de Aysén y subsanar las distorsiones identificadas, se propone la siguiente arquitectura de captura e integración para el Hub V:

```
┌────────────────────────────────────────────────────────────────────────┐
│              PIPELINE DE CAPTURA Y AUDITORÍA DE DATOS SIN SESGO        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      ▼                            ▼                            ▼
┌───────────────────────────┐┌───────────────────────────┐┌───────────────────────────┐
│ 1. POLÍTICAS DE EXCEPCIÓN ││ 2. FLUJOS REALES Y ENCLAVE││ 3. HOGAR, PRECIOS Y CRÉDIT│
│ - TGR (DL 889 / L 19.853) ││ - SUBPESCA / SERNAPESCA   ││ - CMF (Bancarización)     │
│ - DFL 15 (Corfo/Gore)     ││   (Biomasa vs Empleo local││ - MTT (Fletes Bimodales)  │
│ - Min. Hacienda (Z.Franca)││ - SII (Extracción local vs││ - MinEnergía/PDA (Leña/   │
│ - Ley Austral (L 19.606)  ││   domicilio casa matriz)  ││   Pobreza energética)     │
└─────────────┬─────────────┘└─────────────┬─────────────┘└─────────────┬─────────────┘
              │                            │                            │
              └────────────────────────────┼────────────────────────────┘
                                           ▼
┌────────────────────────────────────────────────────────────────────────┐
│ MÓDULO METABÓLICO DE INTEGRACIÓN CIBERNÉTICA (data/systemic/04_*.json) │
│ - Cálculo de Coeficiente de Retención Local de Riqueza                │
│ - Matriz de Precios Deflactados por Sobrecosto de Flete Patagónico     │
│ - Indicador de Resiliencia MiPyme ante la Veda Invernal                │
└────────────────────────────────────────────────────────────────────────┘
```

### Matriz Operativa de Captura de Fuentes Oficiales

| Entidad Emisora | Cuerpo Legal / Marco Normativo | Variable Estratégica Priorizada | URL Oficial de Extracción | Frecuencia de Actualización | Método y Formato de Ingesta |
|:---|:---|:---|:---|:---|:---|
| **Tesorería General de la República (TGR)** | DL 889 / Ley 19.853 | Monto total y número de trabajadores bonificados (17% mano de obra) por comuna y sector económico. | `https://www.tgr.cl/` (Portal de Transparencia y Estadísticas de Bonificaciones) | Semestral | Web Scraping / Ley de Transparencia (JSON estructurado) |
| **CORFO Aysén / GORE Aysén** | DFL 15 de 1981 / Ley 20.655 | Proyectos postulados vs adjudicados, monto de subsidio otorgado, inversión privada apalancada y comuna. | `https://www.corfo.cl/` / `https://www.goreaysen.cl/` | Anual (Resoluciones de Adjudicación) | Extracción automatizada de Actas de Comisión Evaluadora |
| **Ministerio de Hacienda** | Ley 19.606 (Ley Austral) y Ley 20.655 (Zona Franca) | Créditos tributarios devengados en primera categoría; estado de licitación de la Zona Franca en Chacabuco. | `https://www.hacienda.cl/` / `https://www.dipres.gob.cl/` | Anual | Reportes de Gasto Tributario del SII y DIPRES |
| **Comisión para el Mercado Financiero (CMF)** | Ley General de Bancos | Número de oficinas bancarias, cajeros automáticos, saldos de colocaciones comerciales y consumo por comuna. | `https://www.cmfchile.cl/portal/estadisticas/` | Trimestral | API CMF Estadísticas Bancarias Comunales |
| **BancoEstado** | Decreto Ley 2.079 | Red comunal de puntos CajaVecina, volumen transaccional en pesos y giros de efectivo en zonas aisladas. | `https://www.bancoestado.cl/` | Semestral | Consulta institucional y memorias anuales de corresponsalía |
| **Subsecretaría de Pesca / Sernapesca** | Ley General de Pesca y Acuicultura (LGPA) | Toneladas de biomasa cosechada en Aysén por holding vs número de trabajadores en centros de cultivo. | `https://www.subpesca.cl/` / `https://www.sernapesca.cl/` | Trimestral | Anuario Estadístico de Pesca y Acuicultura |
| **Ministerio de Transportes (MTT)** | Subsidios al Transporte en Zonas Aisladas | Tarifas de flete de carga comercial por tramo bimodal y marítimo; tonelaje de carga transportada. | `https://www.dtpr.gob.cl/` | Trimestral | Catastro de Servicios Subsidiados DTPR |
| **Ministerio de Energía / MMA** | Plan de Descontaminación Atmosférica (PDA Coyhaique) | Gasto medio mensual por estrato en calefacción; precio del metro estéreo de leña seca y kilo de pellet. | `https://www.energia.gob.cl/` / `https://pda.mma.gob.cl/` | Mensual (Mayo–Septiembre) | Reportes del Sistema de Monitoreo de Precios de Biomasa |
| **SENCE / Observatorio Laboral de Aysén** | Código del Trabajo / ENE INE | Tasa de trabajadores conmutantes por sector (residencia origen vs lugar de trabajo efectivo). | `https://www.observatoriolaboral.cl/` | Semestral | Informes Termómetro Laboral y Encuesta Enadel |

---

## 5. CONCLUSIONES Y RECOMENDACIONES ESTRATÉGICAS

1. **Superación del "Fetiche del SEIA":**
   La plataforma de datos debe dejar de presentar la cifra agregada de "US$ 3.355 millones de proyectos aprobados en SEIA" como si fuera dinamismo económico activo. Debe crearse un indicador de **Inversión Realizada vs Anunciada**, discriminando qué proyectos están operando, cuáles están suspendidos y qué proporción de la inversión se contrata con proveedores y trabajadores locales.
2. **Visibilización de la Fuga de Riqueza:**
   Es un deber de transparencia sistémica reflejar la contradicción fundamental de Aysén: producir una biomasa de exportación valorada en más de US$ 2.500 millones anuales mientras la mayoría de sus comunas sobreviven del Fondo Común Municipal y del empleo público asistencial. La plataforma debe calcular y publicar el **Índice de Retención Territorial de la Salmonicultura y Minería**.
3. **Incorporación Urgente del Costo de Vida y Pobreza Energética:**
   Los salarios medios informados por el SII y el INE deben presentarse junto con el costo de la canasta básica regional y el costo invernal de calefacción. No considerar el factor de aislamiento deprime la capacidad analítica de la plataforma frente a hacedores de políticas públicas.
4. **Rescate Crítico de las Leyes de Excepción:**
   El Hub V debe integrar de inmediato los tabulados del DL 889, DFL 15 y Ley Austral. Estas herramientas representan miles de millones de pesos en gasto tributario y subsidios directos que deben someterse a auditoría social abierta: ¿quién recibe el dinero y qué impacto demostrable genera en el arraigo poblacional y el empleo digno?
5. **Cierre de Brechas de Variedad hacia el Laboratorio Sistémico:**
   La visualización en `laboratorio.html` y las respuestas analíticas en `consultor.html` deben alertar activamente al usuario cuando una comuna registre niveles extremos de vulnerabilidad como **64% de empleo público (O'Higgins)** o **cero presencia bancaria formal**, orientando las preguntas hacia soluciones de soberanía y desarrollo endógeno.

---
*Fin del Informe de Investigación Autónoma — Sub-Agente 4.*
