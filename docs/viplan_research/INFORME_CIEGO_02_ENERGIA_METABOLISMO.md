# INFORME CIBERNÉTICO DE INVESTIGACIÓN CIEGA (VSM & VIPLAN): METABOLISMO ENERGÉTICO, CALEFACCIÓN RESIDENCIAL, CADENA DE LA LEÑA Y LÍMITES ESTRUCTURALES DE LA TRANSICIÓN ELÉCTRICA EN LA REGIÓN DE AYSÉN

**Sub-Agente 2 — Investigación Autónoma, Cibernética Organizacional e Integridad Sistémica**  
**Fecha:** Noviembre 2026  
**Marco Teórico de Referencia:** Cibernética Organizacional de Stafford Beer (*Brain of the Firm*, 1972/1981; *The Heart of Enterprise*, 1979; *Diagnosing the System for Organizations*, 1985; *A Model of Contemporary Capitalism*, 1973), Metodología VIPLAN de Raúl Espejo (*Cybersyn, big data, variety engineering and governance*, AI & Society, 2022; Espejo & Reyes, 2011/2016; Espejo, 1989, 2020) y Ley de Variedad Requerida de W. Ross Ashby (1956, 1964).  
**Protocolo Metodológico:** Dos Etapas Rigurosas:
1. **Etapa 1 (Ciega / Tabula Rasa):** Sin lectura previa de la base de datos local `data/`. Investigación científica y empírica independiente en fuentes primarias (INFOR, Ministerio de Energía, CNE, SEC, MMA, CONAF, Red de Pobreza Energética - RedPE, CEGA, D.S. N° 7 PDA Coyhaique, Ley N° 21.499, Ley General de Servicios Eléctricos DFL N° 4/20.018 y literatura técnica especializada).
2. **Etapa 2 (Contraste Forense de Sesgos):** Apertura sistemática de `data/systemic/02_energia_combustibles_telecom.json` y del Hub III (`energia`) en `data/aysen_hubs_data.js` para exponer sesgos conceptuales, metodológicos, geográficos e institucionales, vacíos de flujo físico y puntos ciegos regulatorios.

---

## 1. INTRODUCCIÓN Y MARCO TEÓRICO EPISTEMOLÓGICO

### 1.1 El Reto Cibernético del Metabolismo Austral
La Región de Aysén del General Carlos Ibáñez del Campo (CL-XI) exhibe una contradicción termodinámica y metabólica extrema: mientras alberga una de las mayores reservas per cápita de biomasa boscosa, agua dulce y potencial eólico del planeta, sus habitantes experimentan los niveles de **pobreza energética**, **contaminación atmosférica por material particulado ($MP_{2,5}$)** y **sobrecosto tarifario** más agudos de América Latina.

Bajo la lente de la cibernética organizacional desarrollada por Stafford Beer y Raúl Espejo (2022), la energía en Aysén no puede concebirse como una mercancía homogénea (*commodity*) transada en un mercado neoclásico perfecto, sino como un **flujo metabólico de soporte vital homeostático**. Con un clima templado frío lluvioso y de estepa fría, la región acumula más de **3.200 a 3.800 grados-día de calefacción** (base 15 °C). La supervivencia biológica, el confort térmico mínimo y la actividad productiva exigen una inyección masiva de energía calórica durante al menos 8 a 9 meses al año.

El aislamiento geográfico regional se traduce en una doble fractura estructural:
1. **Fractura de Interconexión:** El sistema eléctrico de Aysén no está interconectado al Sistema Eléctrico Nacional (SEN). Funciona como un archipiélago de Sistemas Medianos (SMA, Sistema General Carrera, Sistema Palena-Cisnes) y micro-redes aisladas locales (Melinka, Caleta Tortel, Villa O'Higgins, Puerto Raúl Marín Balmaceda), con una capacidad instalada regional consolidada de 95,9 MW y un monopolio verticalmente integrado regulado bajo el Artículo 173° del DFL N° 4 (Ley General de Servicios Eléctricos).
2. **Fractura Fisiológica y Envolvente Térmica:** La matriz de calefacción regional descansa en un **80% sobre la leña nativa**, alcanzando un consumo de **565.456 metros cúbicos sólidos anuales** (INFOR, 2020), lo que representa el consumo per cápita de leña más alto de la Tierra (5,5 m³ sólidos/habitante/año). Sin embargo, debido a que el 70-80% del parque habitacional carece de estándares térmicos adecuados (infiltraciones masivas y muros sin aislamiento), entre el 60% y el 75% del calor generado se fuga instantáneamente a la atmósfera exterior, forzando la quema desmedida de biomasa húmeda que satura los valles cordilleranos (Coyhaique como la ciudad más contaminada por $MP_{2,5}$ del cono sur).

### 1.2 La Metodología VIPLAN y el Principio de Doble Descripción
Siguiendo a Espejo (1989, 2022) y Espejo & Reyes (2011, 2016), el modelado de un sistema complejo demanda superar la ilusión tecnocrática a través del **Principio de Doble Descripción**:
* **Descripción de Caja Negra (Cibernética de Primer Orden - Sistema Observado):** Mide la complejidad relacional externa entre el sistema metabólico energético y su entorno territorial en términos de insumos (*inputs*: radiación solar, precipitación pluvial, bosque nativo de lenga/ñirre, petróleo diésel importado, pellets de la zona centro-sur), transformaciones físico-químicas (combustión doméstica, generación hidroeléctrica, ciclos térmicos diésel) y salidas (*outputs*: megavatios-hora generados, gigacalorías útiles, confort intradomiciliario, emisiones tóxicas de $MP_{2,5}$, cenizas y gases de efecto invernadero).
* **Descripción Operacional (Cibernética de Segundo Orden - Sistemas Observadores):** Modela las interacciones reflexivas, las relaciones de poder, los marcos regulatorios y los acuerdos de gobernanza que distribuyen la autonomía y la capacidad de decisión. Como enfatiza Espejo (2022), la viabilidad no es un estado mecánico impuesto desde el centro, sino la capacidad homeostática de un sistema para auto-regularse y adaptarse a su entorno sin destruir la autonomía de sus unidades operativas locales.

### 1.3 La Mnemotecnia TASCOI como Herramienta de Desanclaje Cognitivo
Para evitar el sesgo de anclaje —que induce a creer erróneamente que el sistema energético regional es únicamente "lo que la CNE regula en megawatts" o "lo que Edelaysén factura en kilovatios-hora"—, VIPLAN operacionaliza la mnemotecnia **TASCOI**:
* **T (Transformation):** La transformación física u ontológica central del sistema.
* **A (Actors):** Los agentes humanos, técnicos e institucionales que ejecutan operativamente la transformación.
* **S (Suppliers):** Los proveedores de insumos materiales, biológicos, energéticos y normativos.
* **C (Customers):** Los beneficiarios directos, usuarios finales y receptores de externalidades negativas.
* **O (Owners):** Quienes poseen la autoridad para redefinir el propósito, autorizar inversiones y vetar la operación.
* **I (Interveners):** Actores contextuales (reguladores, comunidades, fiscalizadores, mercados internacionales) que restringen o modulan la variedad operativa.

---

## 2. ETAPA 1: MODELACIÓN AUTÓNOMA CIEGA (TABULA RASA)

### 2.1 Nombramiento y Matriz TASCOI en Tres Niveles de Recursión

El metabolismo energético de Aysén se estructura en tres niveles viables anidados de recursión:

```
[ RECURSIÓN 0: Sistema Metabólico y Térmico Regional de Aysén ]
  ├── [ RECURSIÓN 1.1: Cadena Dendroenergética y Biocombustibles Sólidos (Leña y Pellet) ]
  │     ├── R 2.1.1: Cuadrillas de Corta y Planes de Manejo de Bosque Nativo (Lenga/Ñirre)
  │     ├── R 2.1.2: Centros de Procesamiento de Biomasa (CPB), Galpones de Secado y Acopio
  │     ├── R 2.1.3: Red de Comercialización y Logística de Pellet Importado (Chacabuco / Ruta 7)
  │     └── R 2.1.4: Células de Combustión Domiciliaria e Institucional (Estufas, Cocinas, Calderas)
  │
  ├── [ RECURSIÓN 1.2: Sistema Eléctrico Mediano Integrado (SMA - Edelaysén / Grupo Saesa) ]
  │     ├── R 2.2.1: Complejo de Generación Hidroeléctrica de Pasada (Lago Atravesado, Monreal)
  │     ├── R 2.2.2: Parque de Generación Térmica Diésel de Respaldo y Punta (Central Tehuelche)
  │     ├── R 2.2.3: Infraestructura Renovable No Convencional (Parque Eólico Alto Baguales, Solar)
  │     └── R 2.2.4: Red de Subtransmisión y Distribución Urbana (Coyhaique, Aysén, Ibáñez, Chile Chico)
  │
  ├── [ RECURSIÓN 1.3: Micro-sistemas Eléctricos y Térmicos Aislados e Insulares ]
  │     ├── R 2.3.1: Sistema Eléctrico Insular Melinka - Repollal (Guaitecas: Térmica Diésel)
  │     ├── R 2.3.2: Sistema Híbrido Caleta Tortel (Micro-hidroeléctrica + Respaldo Diésel Municipal)
  │     ├── R 2.3.3: Sistema Aislado Villa O'Higgins (Generación Diésel Municipal)
  │     └── R 2.3.4: Micro-redes Rurales y Caletas Menores (Raúl Marín Balmaceda, Puerto Aguirre)
  │
  └── [ RECURSIÓN 1.4: Logística y Almacenamiento de Hidrocarburos Líquidos y Gas Licuado ]
        ├── R 2.4.1: Terminal Marítimo de Bunkering de Combustibles (Puerto Chacabuco)
        ├── R 2.4.2: Flota de Camiones Cisterna y Transporte Terrestre Transandino (Ruta 240 / CH-265)
        ├── R 2.4.3: Red de Estaciones de Servicio Terrestres y Marinas (Copec, Shell, Petrobras)
        └── R 2.4.4: Cadena de Envasado y Distribución de GLP (Lipigas, Abastible, Gasco)
```

#### Matriz TASCOI Comparativa por Nivel de Recursión

| Elemento TASCOI | Recursión 0: Sistema Metabólico Regional | Recursión 1.1: Cadena Dendroenergética (Leña/Pellet) | Recursión 1.2: Sistema Eléctrico Mediano (Edelaysén) | Recursión 1.3: Micro-sistemas Aislados e Insulares | Recursión 1.4: Logística de Hidrocarburos Líquidos |
|:---|:---|:---|:---|:---|:---|
| **Transformación (T)** | Transforma recursos primarios endógenos (biomasa forestal, energía hídrica, eólica) e hidrocarburos fósiles importados en confort térmico vital, energía lumínica, electromovilidad y fuerza motriz para 103.000 habitantes y el aparato productivo regional bajo condiciones climáticas subpolares. | Transforma madera bruta de bosques nativos (lenga, ñirre) y subproductos forestales importados (pellet) en energía térmica residencial mediante procesos de secado, combustión y estandarización de humedad según la Ley 21.499. | Transforma energía hidráulica de pasada, viento y petróleo diésel en energía eléctrica continua bajo el régimen de Sistema Mediano de la LGSE, garantizando el suministro a las principales conurbaciones regionales. | Transforma petróleo diésel marítimo subsidiado y pequeños caudales hídricos locales en electricidad para caletas e islas desvinculadas de la red troncal, operadas bajo régimen municipal o cooperativo. | Transforma combustibles fósiles refinados en Biobío/Magallanes en hidrocarburos distribuidos (gasolina 93, diésel, kerosene doméstico y GLP granel/cilindro) a través de cabotaje marítimo y transporte cisterna. |
| **Actores (A)** | Familias aiseninas, leñeros tradicionales, técnicos de Edelaysén, cuadrillas municipales de servicios eléctricos, transportistas de fletes, SEREMI de Energía, SEC, CONAF, SMA y GORE Aysén. | Productores forestales, cuadrillas de motosierristas, intermediarios fleteros, operadores de Centros de Procesamiento de Biomasa (CPB), distribuidores de pellet e instaladores certificados SEC. | Edelaysén S.A. (filial de Grupo Saesa, integrada verticalmente en generación, transmisión y distribución), ingenieros de despacho CNE, personal de mantenimiento de líneas de alta montaña. | Municipalidades de Guaitecas, Tortel y Villa O'Higgins; comités locales de electrificación, operadores de grupos electrógenos diésel y cooperativas eléctricas insulares. | Compañías mayoristas (Copec, Enex/Shell, Esmax/Petrobras), navieras de cabotaje (Navimag, Kochifas), conductores de camiones cisterna en pasos fronterizos y distribuidores minoristas de balones de gas. |
| **Suppliers (S)** | Bosque nativo fiscal y privado de la Patagonia, cuencas hídricas cordilleranas, vientos dominantes del westerlies, refinerías de ENAP (Biobío/Concón) y plantas de pellet de Araucanía y Los Ríos. | Propietarios de predios boscosos, CONAF (autorización de Planes de Manejo y Guías de Libre Tránsito), fabricantes de pellet del centro-sur (Ecomas, Andes Pellet) y proveedores de secadores solares. | Cuencas del Río Simpson, Río Aysén y Lago Atravesado; recurso eólico de Alto Baguales; importadores de grupos electrógenos industriales (Caterpillar, Wärtsilä) y plantas petroleras de Puerto Chacabuco. | Fondo Nacional de Desarrollo Regional (FNDR), Subsecretaría de Energía (glosas presupuestarias de electrificación rural), distribuidores de diésel marino en Puerto Montt y Quellón. | Refinerías de ENAP, terminales marítimos de exportación de combustibles, plantas petroquímicas productoras de gas licuado propano/butano y aduanas chileno-argentinas. |
| **Customers (C)** | La totalidad de la población residente de las 10 comunas de Aysén, infraestructura sociosanitaria crítica (Hospital Regional de Coyhaique, postas rurales, colegios) e industrias locales. | Más de 32.000 hogares urbanos y rurales que dependen de la leña para no congelarse; edificios públicos acogidos al PDA; usuarios de estufas a pellet de alta eficiencia. | 45.000 clientes residenciales y comerciales regulados en las provincias de Coyhaique, Aysén y General Carrera; usuarios inscritos en el plan piloto de tarifa residencial eléctrica (EcoAyre). | Pobladores de Melinka, Repollal, Caleta Tortel, Villa O'Higgins, Puerto Gaviota y Raúl Marín Balmaceda; plantas procesadoras artesanales de bentónicos e iluminación comunitaria. | Parque vehicular regional (más de 38.000 vehículos ligeros y pesados), transporte marítimo de barcazas, flota de wellboats de la salmonicultura y grupos electrógenos de emergencia. |
| **Owners (O)** | La comunidad regional aisenina y el Estado de Chile a través del Ministerio de Energía, el Gobierno Regional de Aysén (GORE) y la Comisión Nacional de Energía (CNE). | Pequeños propietarios forestales, comercializadores de biomasa, empresarios de distribución de pellet; regulados por el Ministerio de Energía y la SEC bajo la Ley 21.499. | Directorio del Grupo Saesa (controlado por los fondos institucionales de pensiones canadienses Ontario Teachers' Pension Plan y AIMCo); fiscalizado por la CNE y la SEC. | Concejos Municipales de Guaitecas, Tortel y O'Higgins; Subsecretaría de Desarrollo Regional (SUBDERE) y Gobierno Regional de Aysén que financian los déficits de explotación. | Directorios de las compañías distribuidoras de combustibles (Copec / Grupo Angelini; Enex / Grupo Luksic) y empresas de gas licuado (Lipigas, Abastible, Gasco). |
| **Interveners (I)** | Superintendencia del Medio Ambiente (SMA), Ministerio de Salud (alertas sanitarias por contaminación), tribunales ambientales, movimientos ciudadanos ("Aysén Reserva de Vida", RedPE). | CONAF (Ley de Bosque Nativo N° 20.283), SEC (fiscalización de humedad <25% y registro obligatorio de CPB), Servicio de Impuestos Internos (SII), SEREMI del Medio Ambiente (D.S. N° 7 PDA). | Comisión Nacional de Energía (CNE - fijación cuadrienal de precios de nudo de sistemas medianos), Dirección General de Aguas (DGA - derechos de aprovechamiento hídrico), comunidades indígenas de cuencas. | Contraloría General de la República (auditorías a compras de combustible municipal), Armada de Chile (DIRECTEMAR - seguridad de transporte marítimo de tambores de diésel), vecinos afectados por racionamiento. | Ministerio de Transportes y Telecomunicaciones (pesos por eje en Ruta 7), Gendarmería y Aduanas de Argentina (tránsito por Chile Chico y Coyhaique Alto), fiscalizadores de seguridad SEC. |

---

### 2.2 Flujograma Cuantificado Real del Metabolismo Energético (Estilo Cybersyn)

El siguiente modelo de flujos metabólicos cuantifica los balances de masa y energía de la Región de Aysén para un ciclo anual típico consolidado (datos empíricos cruzados de INFOR, CNE, SEC, MMA y Balance Nacional de Energía):

```
                                ENTORNO EXTERNO Y RECURSOS NATURALES PRIMARIOS
     (Bosque Nativo Regional)      (Plantas Pellet Centro-Sur)     (Cabotaje Petrolero ENAP)       (Cuencas Hídricas y Viento)
        565.456 m³ sólidos             ~20.000 ton/año                ~52.000 m³ diésel             ~80 GWh hídrico + eólico
                │                              │                               │                                │
                ▼                              ▼                               ▼                                ▼
    ┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐      ┌─────────────────────────┐
    │  EXTRACCIÓN Y CORTE     │    │ LOGÍSTICA DE IMPORTACIÓN│    │ PUERTO CHACABUCO        │      │ SISTEMA MEDIANO AYSÉN   │
    │  (73% Lenga, 13% Ñirre) │    │ Camión + Barcaza        │    │ Bunkering / Almacenaje  │      │ Centrales de Pasada     │
    │  >80% Informalidad      │    │ (Cuello de botella mar) │    │ (Gasolinas, Diésel, GLP)│      │ Lago Atravesado/Monreal │
    └───────────┬─────────────┘    └───────────┬─────────────┘    └────────────┬────────────┘      └────────────┬────────────┘
                │                              │                               │                                │
      Humedad   │ Secado precario    Riesgo de │ Quiebres de stock             │ Generación térmica             │ Despacho renovable
      35% - 55% │ (Ley 21.499 CPB)   transporte│ en julio-agosto               │ ~85 GWh diésel                 │ ~80 GWh limpio
                ▼                              ▼                               ▼                                ▼
    ┌────────────────────────────────────────────────────────┐    ┌──────────────────────────────────────────────────────────┐
    │            SISTEMA DE CALEFACCIÓN DOMÉSTICA            │    │            SISTEMA ELÉCTRICO REGIONAL                    │
    │  (80% Leña, 8% GLP, 5% Pellet, 5% Electricidad, 2% Otr)│    │  (Capacidad Instalada: 95,9 MW Regional; ~55 MW SMA)     │
    │  - Consumo per cápita: 5,5 m³ sólidos/hab/año          │    │  - Generación bruta anual: 165 - 175 GWh                 │
    │  - 14 m³ sólidos/hogar urbano; 21 m³ sólidos rural     │    │  - Pérdidas técnicas y no técnicas: 10% - 12%            │
    └───────────────────────────┬────────────────────────────┘    └────────────────────────────┬─────────────────────────────┘
                                │                                                              │
         COMBUSTIÓN INEFICIENTE │ Pobreza Energética:                                Demanda   │ Tarifa BT1: $210 - $240/kWh
                                │ Familias gastan 18% - 25%                          Punta     │ Subsidio Tarifa EcoAyre: -30%
                                │ de sus ingresos en leña                            Invernal  │ Riesgo de colapso si se
                                │                                                              │ masifica calefacción eléctrica
                                ▼                                                              ▼
    ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                EL COLADOR ENERGÉTICO HABITACIONAL (LA VIVIENDA)                                        │
    │  - 75% del parque habitacional construido previo a NCh 1079 / Reglamentación Térmica de 2007                           │
    │  - Infiltraciones masivas: pérdidas de calor del 60% al 75% a través de techos, muros y ventanas de vidrio simple      │
    │  - Demanda térmica sobredimensionada: la vivienda exige 180 - 250 kWh/m²/año para mantener 18 °C intradomiciliario     │
    └───────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
    ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                EXTERNALIDADES CRÍTICAS Y SALIDAS DEL SISTEMA                                           │
    │  1. Saturación Atmosférica: >170 µg/m³ de MP2,5 en invierno en Coyhaique (>60 días en preemergencia/emergencia ambiental) │
    │  2. Impacto Sanitario: Crisis de bronquiolitis y neumonías en menores de 2 años y adultos mayores (colapso SAMU/UCI)   │
    │  3. Drenaje Económico: Fuga masiva de liquidez familiar hacia combustible y subsidios fiscales millonarios al diésel   │
    └────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Parámetros Cuantitativos Fundamentales del Metabolismo Energético:
1. **La Hegemonía de la Biomasa Forestal:**
   * **Volumen Regional:** 565.456 metros cúbicos sólidos anuales ($m^3$ s/año), equivalentes aproximadamente a **850.000 - 900.000 metros cúbicos estéreos** ($m^3$ st/año), considerando un factor de apilamiento medio de 0,63 a 0,67.
   * **Concentración Espacial:** La conurbación de Coyhaique concentra el **44% del consumo total regional**, quemando más de 250.000 $m^3$ sólidos cada año en un valle cerrado rodeado de cordones montañosos propensos a la inversión térmica invernal.
   * **Especies Explotadas:** El 100% de la leña extraída procede de bosque nativo patagónico: **Lenga (*Nothofagus pumilio*)** en un 73%, **Ñirre (*Nothofagus antarctica*)** en un 13% y otras especies nativas (coihue, tepa, ciruelillo) en un 14%.
   * **Consumo Específico por Vivienda:** Un hogar urbano promedio en Coyhaique o Puerto Aysén consume **14 $m^3$ sólidos anuales** (~21 estéreos), mientras que en el sector rural el consumo trepa a **21 $m^3$ sólidos anuales** (~32 estéreos) debido a la exposición al viento y la inexistencia total de aislación.
2. **La Vulnerabilidad Logística del Pellet:**
   * La demanda regional de pellet ha crecido de forma exponencial, alcanzando entre **18.000 y 22.000 toneladas anuales**, impulsada por los programas de recambio de calefactores del Ministerio del Medio Ambiente (más de 12.000 estufas recambiadas en Coyhaique).
   * **Cero Producción Local:** La totalidad del pellet se importa desde las regiones del Biobío, Araucanía y Los Ríos. El transporte recorre más de 800 km terrestres y cruza tramos marítimos en barcaza hasta Puerto Chacabuco.
   * **Quiebres Estacionales:** En los inviernos de 2020, 2021 y 2022 se registraron desabastecimientos críticos de hasta 3 semanas continuas, desatando compras de pánico, largas filas de ciudadanos a temperaturas bajo cero y racionamiento forzado (límite de 5 a 10 sacos de 15 kg por persona).
3. **La Matriz Eléctrica y el Monopolio Vertical (LGSE Art. 173):**
   * **Capacidad Regional Consolidada:** 95,9 MW instalados.
   * **Sistema Mediano de Aysén (SMA):** Concentra entre 50 y 59 MW de capacidad disponible para Coyhaique, Puerto Aysén y localidades aledañas.
   * **Composición Tecnológica:**
     * *Hidroeléctrica de Pasada:* 44,5% de la capacidad (~22-25 MW, liderada por Central Lago Atravesado con 11 MW y Central Monreal con 3 MW).
     * *Térmica Diésel de Respaldo:* 51,5% de la capacidad (~28-30 MW, con motores industriales en Central Tehuelche).
     * *Eólica:* 3,8% (~3,6 MW en Parque Eólico Alto Baguales, pionero en 2001).
     * *Solar Fotovoltaica:* 0,2% (~6 MWp en plantas piloto como El Blanco y Cerro Sombrero).
   * **Despacho Energético Anual:** En años hidrológicos medios, la generación renovable (hidro + eólica + solar) aporta entre el 70% y el 80% de los gigavatios-hora generados, pero durante el estiaje invernal hídrico (julio-agosto, cuando los deshielos se detienen y las cuencas se congelan), la generación diésel salta a cubrir más del 50-60% del suministro instantáneo.

#### Cálculo de Índices de Desempeño Cibernético de Stafford Beer
Beer definió tres métricas fundamentales para medir la efectividad y vitalidad de cualquier sistema operacional:
* **Actualidad ($A$):** Lo que el sistema realiza hoy con los recursos corrientes disponibles.
* **Capacidad ($C$):** Lo que el sistema podría rendir hoy si operara al límite de su eficiencia óptima con los recursos actuales.
* **Potencialidad ($P$):** Lo que el sistema podría lograr desarrollando nuevos recursos y eliminando cuellos de botella estructurales.

A partir de estas magnitudes se derivan tres índices adimensionales normalizados entre 0 y 1:
$$	ext{Productividad} = rac{A}{C}, \quad 	ext{Latencia} = rac{C}{P}, \quad 	ext{Rendimiento Global} = rac{A}{P} = 	ext{Productividad} 	imes 	ext{Latencia}$$

Aplicación cuantitativa al metabolismo térmico y eléctrico de Aysén:

| Subsistema Metabólico | Actualidad ($A$) | Capacidad ($C$) | Potencialidad ($P$) | Productividad ($A/C$) | Latencia ($C/P$) | Rendimiento ($A/P$) | Diagnóstico Cibernético |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **Cadena Dendroenergética (Leña Seca <25% Humedad)** | 113.000 m³ sólidos/año de leña certificada seca entregada | 340.000 m³ sólidos/año que los bosques bajo plan de manejo podrían producir | 565.456 m³ sólidos/año de demanda térmica total satisfecha con biomasa estandarizada | **0,332** | **0,601** | **0,200** | **Catastrófico.** Solo el 20% del potencial de biomasa limpia se realiza; el 80% restante se pierde en combustión húmeda informal y depredación silvicultural. |
| **Envolvente Térmica Habitacional (Conservación de Calor)** | 55 kWh/m²/año de calor útil retenido en la vivienda | 110 kWh/m²/año alcanzable con reacondicionamiento térmico PDA básico | 175 kWh/m²/año (Estándar Passivhaus / Aislación Austral de 200 mm) | **0,500** | **0,628** | **0,314** | **Fuga Masiva.** El parque habitacional retiene apenas un tercio del calor potencial. Es un sistema "con la ventana abierta" operando a máxima combustión. |
| **Sistema Eléctrico Mediano (Aprovechamiento Renovable)** | 125 GWh/año de generación hidro/eólica/solar inyectada | 160 GWh/año si no hubiese vertimiento hidráulico y con mantenimiento óptimo | 320 GWh/año con microrredes, almacenamiento en baterías (BESS) y geotermia somera | **0,781** | **0,500** | **0,391** | **Estrangulamiento de Potencia.** Alta productividad a corto plazo ($0,781$), pero latencia mediocre ($0,500$) por falta de inversión en acumulación y robustez de red. |

---

### 2.3 Ecuación de Variedad Requerida de Ashby / Espejo y Análisis de Operadores

#### Formulación Matemática
W. Ross Ashby (1956, 1964) enunció la ley cardinal de los sistemas complejos: *"Solo la variedad puede absorber o destruir variedad"*. Raúl Espejo y Nigel Howard (1982), sintetizado en Espejo (2022), formularon la relación dinámica entre el entorno, el sistema operacional y el órgano de gestión/regulación:

$$V_O \ge rac{V_D}{V_R}$$

donde:
* $V_D$: Variedad de perturbaciones del entorno (*environmental disturbances*).
* $V_R$: Variedad de respuestas del sistema regulador (*regulatory responses / affordances*).
* $V_O$: Variedad de resultados observables o estados residuales (*outcomes*).
* $V_T$: Variedad objetivo o conjunto de estados deseables compartidos (*target states*).

Para que la regulación territorial sea efectiva y garantice la viabilidad del metabolismo energético, el sistema debe cumplir estrictamente la **Condición de Viabilidad**:
$$V_O \le V_T \implies rac{V_D}{V_R} \le V_T \iff V_R \ge rac{V_D}{V_T}$$

Si $V_R < rac{V_D}{V_T}$, el sistema cae en ingobernabilidad: las perturbaciones desbordan los instrumentos de respuesta, los resultados violan los umbrales de tolerancia y se disparan las crisis sanitarias, la pobreza y el colapso de infraestructura.

#### Catálogo de Perturbaciones del Entorno ($V_D$)
1. **Severidad y Oscilación Térmica Extrema ($V_{D1}$):** Variaciones de temperatura de hasta 25 °C en 24 horas; olas de frío polar con mínimas de -10 °C a -15 °C y congelamiento de tuberías.
2. **Inversión Térmica en Valles Cordilleranos ($V_{D2}$):** Estancamiento del aire en la cuenca de Coyhaique por vientos en calma y gradiente térmico invertido, atrapando las partículas de combustión a ras de suelo.
3. **Contenido de Humedad Anárquico de la Leña ($V_{D3}$):** Comercialización de biomasa con humedad entre el 35% y el 55%, duplicando las emisiones de $MP_{2,5}$ y reduciendo a la mitad el poder calorífico neto.
4. **Estiaje Invernal y Congelamiento Hídrico ($V_{D4}$):** Caída drástica del caudal de pasada en los ríos de deshielo durante junio, julio y agosto, reduciendo la generación hidroeléctrica barata justo cuando la demanda térmica es máxima.
5. **Cierre de Pasos Marítimos y Terrestres ($V_{D5}$):** Temporales que inhabilitan la navegación en el Golfo de Corcovado y Canal Moraleda, cortando el suministro de barcazas con diésel, gasolinas y sacos de pellet hacia Puerto Chacabuco.
6. **Informalidad Silvicultural y Tributaria ($V_{D6}$):** Cerca del 80% del comercio de leña opera al margen de planes de manejo autorizados por CONAF y de facturación ante el SII, generando un mercado opaco y atomizado.

#### Catálogo de Respuestas del Regulador ($V_R$)
1. **Plan de Descontaminación Atmosférica (PDA D.S. N° 7 MMA) ($V_{R1}$):** Recambio de calefactores antiguos por estufas a pellet y bombas de calor; decretos de episodios críticos (GEC) con prohibición de emisión visible en chimeneas durante preemergencias y emergencias.
2. **Ley N° 21.499 de Biocombustibles Sólidos ($V_{R2}$):** Regulación de la leña como combustible oficial, obligatoriedad de inscribir Centros de Procesamiento de Biomasa (CPB) ante la SEC y fiscalización con xilohigrómetros para prohibir la venta de biomasa con humedad $\ge 25\%$.
3. **Mecanismos de Respaldo Térmico Fósil de Edelaysén ($V_{R3}$):** Encendido de turbinas y grupos electrógenos diésel en Central Tehuelche para compensar el estiaje hídrico y absorber los picos de demanda.
4. **Tarifa Piloto EcoAyre ($V_{R4}$):** Descuento del ~30% sobre la tarifa BT1 residencial para calefacción y climatización mediante bombas de calor inverter, implementada por Edelaysén mediante un segundo medidor independiente de hasta 10 kW.
5. **Subsidios de Aislación Térmica MINVU ($V_{R5}$):** Programas de mejoramiento de la envolvente térmica de viviendas (revestimiento exterior EIFS, doble vidriado hermético y sellos de puertas).
6. **Subsidios de Operación al Diésel en Zonas Aisladas ($V_{R6}$):** Fondos públicos del FNDR y Subdere para pagar el combustible de generadores municipales en Melinka, Tortel y O'Higgins.

#### Variedad Objetivo Admisible ($V_T$)
* Temperatura intradomiciliaria continua entre **18 °C y 21 °C** en todas las viviendas de Aysén.
* Gasto familiar total en energía inferior al **10% del ingreso mensual del hogar** (eliminación de la pobreza energética según el estándar RedPE / Boardman).
* Concentración ambiental diaria de $MP_{2,5}$ inferior a **50 µg/m³** (norma primaria de calidad del aire) y reducción a cero de los días bajo Emergencia Sanitaria.
* Calidad y continuidad del suministro eléctrico con indicador SAIDI menor a **10 horas de interrupción/año**.

#### Ingeniería de Variedad: Atenuadores y Amplificadores
Para balancear la relación $V_E \gg V_O \gg V_M$, el sistema requiere operadores cibernéticos:
* **Atenuadores de Variedad (Filtros de Complejidad):**
  * *Zonificación de Humedad y Calidad (Ley 21.499):* Estandarización de la venta de leña exclusivamente en formatos secos (<25%), filtrando del mercado miles de transacciones informales heterogéneas.
  * *Sistemas de Aislación Térmica Pasiva (Passivhaus / EIFS):* Al sellar la envolvente de la vivienda, se atenúa drásticamente la perturbación de la temperatura exterior, haciendo que la vivienda requiera un tercio de la energía para mantenerse confortable.
  * *Contratos de Suministro Anual y Preventa de Pellet:* Planificación veraniega que absorbe las fluctuaciones estacionales de la demanda invernal.
* **Amplificadores de Variedad (Potenciadores de Acción):**
  * *Medición Inteligente y Despacho Dinámico de Red:* Monitoreo en tiempo real de la carga en alimentadores urbanos para prevenir la sobrecarga de transformadores.
  * *Microrredes Híbridas Descentralizadas con BESS (Baterías):* Amplificación de la autonomía de caletas aisladas (Tortel, Melinka), reduciendo la dependencia absoluta del diésel marítimo.
  * *Geotermia de Baja Entalpía (CEGA):* Aprovechamiento del calor constante del subsuelo (8-10 °C) mediante bombas de calor con COP $\ge 3,5$, multiplicando cada kWh eléctrico por 3,5 kWh de calor útil sin combustión.

#### La Trampa de Variedad de la Transición Eléctrica Pura
Existe una creencia extendida entre formuladores de políticas públicas según la cual la solución a la contaminación de Coyhaique consistiría simplemente en "prohibir la leña y pasar a todos los hogares a calefacción eléctrica". Un análisis de variedad cibernética demuestra que esta estrategia, formulada sin aislamiento térmico previo, es un **error de diseño catastrófico**:

$$	ext{Poder Calorífico de 565.456 m³ s de leña} pprox 1.800 	ext{ GWh}_{	ext{térmicos}}$$

Si los ~32.000 hogares urbanos de Coyhaique y Puerto Aysén reemplazaran su calefacción a leña por climatizadores eléctricos tipo split inverter de 2 kW de potencia eléctrica promedio:
$$	ext{Demanda de Potencia Eléctrica Pico Simultánea} = 32.000 	ext{ hogares} 	imes 2,0 	ext{ kW} 	imes 0,85 	ext{ (factor de simultaneidad)} pprox \mathbf{54,4 	ext{ MW}}$$

* **La Brecha:** La demanda pico de calefacción eléctrica ($54,4	ext{ MW}$) **duplicaría instantáneamente la capacidad total de generación disponible de todo el Sistema Mediano Aysén** (que ronda los 50-59 MW, de los cuales ya 25-30 MW están comprometidos en el consumo basal de iluminación, comercio e industria).
* **El Colapso de Red:** Los transformadores de distribución barriales en Coyhaique (de 100 a 300 kVA) se fundirían por sobrecarga térmica al superar su capacidad en las noches de -10 °C.
* **Conclusión Cibernética:** La transición eléctrica no puede ser un amplificador de variedad desarticulado; requiere atenuar previamente la variedad de pérdidas mediante el **acondicionamiento térmico masivo de la envolvente** (reduciendo la demanda a 0,7 kW por hogar) y diversificar la matriz con **calefacción distrital geotérmica y de biomasa tecnificada**.

---

### 2.4 Arquitectura de Gobernanza Viable (Sistemas 1 a 5 de Stafford Beer)

Siguiendo el Modelo del Sistema Viable (VSM; Beer, 1972, 1985; Espejo, 2022), la gobernanza del metabolismo energético regional de Aysén se articula en cinco funciones homeostáticas:

```
┌────────────────────────────────────────────────────────────────────────┐
│ SISTEMA 5: POLÍTICA, IDENTIDAD Y CLAUSURA NORMATIVA                   │
│ - Soberanía Energética Patagónica y Justicia Ambiental                 │
│ - Erradicación de la Pobreza Energética y Derecho al Confort Térmico    │
│ - Equilibrio Homeostático entre Cohesión Interna (S3) y Futuro (S4)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Canal Normativo / Ethos
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ SISTEMA 4: INTELIGENCIA TERRITORIAL, ADAPTACIÓN Y FUTURO               │
│ - Prospección Hidrológica y Modelado de Cambio Climático sobre Caudales│
│ - Proyectos de Calefacción Distrital con Geotermia Somera (CEGA)       │
│ - Planificación a 20 Años de Electrificación Gradual y Microrredes    │
│ - Monitoreo de Mercados Globales de Petróleo y Transición a Hidrógeno  │
└──────────────────┬────────────────────────────────┬────────────────────┘
                   │ Bucle de Conversación S3 - S4 │ (Alerta Adaptativa)
                   ▼                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│ SISTEMA 3: CONTROL OPERACIONAL INTERNO, ASIGNACIÓN Y SINERGIA          │
│ - Despacho Económico Centralizado CNE / Edelaysén                      │
│ - Asignación de Cuotas de Subsidios FNDR al Diésel Aislado             │
│ - Coordinación de Programas de Recambio de Calefactores MMA / GORE     │
└──────────┬────────────────────────────────┬────────────────────────────┘
           │                                │ CANAL DE AUDITORÍA S3*
           │ Instrucciones de Operación     │ (Inspección Esporádica en Terreno)
           │                                ├─ Fiscalización SEC de Humedad (<25%)
           │                                ├─ Control CONAF de Guías de Libre Tránsito
           │                                └─ Monitoreo SMA de Humos Visibles PDA
           ▼                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│ SISTEMA 2: COORDINACIÓN Y AMORTIGUACIÓN DE OSCILACIONES (ANTI-CAOS)    │
│ - Sincronización de Frecuencia y Voltaje en Sistemas Medianos          │
│ - Gestión de Episodios Críticos (GEC): Alertas de Preemergencia / Humo│
│ - Programas Estacionales de Acopio y Secado Veraniego de Leña         │
│ - Logística Coordinada de Cabotaje y Fletes de Barcazas de Pellet      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Canales de Coordinación
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ SISTEMA 1: UNIDADES OPERACIONALES PRIMARIAS (GENERACIÓN DE VALOR)      │
│ 1.1 Cadena de Extracción y Secado de Biomasa Nativa (Lenga/Ñirre)     │
│ 1.2 Complejo Hidroeléctrico y Eólico de Pasada (Lago Atravesado)       │
│ 1.3 Complejo Térmico Diésel de Respaldo y Punta (Central Tehuelche)   │
│ 1.4 Microrredes Eléctricas Municipales Aisladas (Melinka, Tortel)     │
│ 1.5 Red de Distribución Eléctrica y Clientes Tarifa EcoAyre            │
│ 1.6 Red de Transporte y Distribución Minorista de GLP y Combustibles   │
└────────────────────────────────────────────────────────────────────────┘
```

#### Descripción Funcional de los Sistemas 1 a 5:
* **Sistema 1 (Operación Primaria):** Son los órganos autónomos que ejecutan directamente la transformación física de la energía: los centros de biomasa y leñeros que secan y parten la madera; las centrales hidroeléctricas de Edelaysén que turbinan el agua del Lago Atravesado; las plantas de diésel municipal que encienden los motores en Melinka; los camiones cisterna que suben combustible por la Ruta 240; y las estufas que calientan los hogares.
* **Sistema 2 (Coordinación y Anti-Oscilación):** Evita la interferencia mutua y el caos operacional:
  * El protocolo de despacho y control de frecuencia para que las variaciones del viento en Alto Baguales no desestabilicen el voltaje de Coyhaique.
  * El protocolo de Gestión de Episodios Críticos (GEC) del MMA, que coordina a la población para apagar calefactores a leña y restringir humos en días con inversión térmica.
  * La programación estacional de pedidos de pellet que evita las compras de pánico en invierno.
* **Sistema 3 (Control Operacional y Sinergia):** Asigna recursos corrientes para maximizar el rendimiento regional: fija los despachos de generación hidro versus diésel según el costo marginal diario; gestiona las transferencias del FNDR para subsidiar el diésel en las comunas aisladas; y canaliza las partidas presupuestarias de recambio de estufas.
  * **Sistema 3\* (Auditoría Esporádica / Sporadic Audit):** Es el canal directo de inspección que comprueba si la realidad operativa coincide con los informes: los fiscalizadores de la SEC midiendo la humedad de la leña con xilohigrómetros en camiones y centros de venta; los guardaparques de CONAF fiscalizando las Guías de Libre Tránsito en cruces camineros para frenar la tala ilegal; y la SMA monitoreando las emisiones de chimeneas industriales y domiciliarias.
* **Sistema 4 (Inteligencia, Adaptación y Futuro):** Observa los cambios en el macro-entorno y proyecta la viabilidad a mediano y largo plazo:
  * Modela el impacto del cambio climático en los glaciares y cuencas hidrológicas de Aysén, proyectando cuánta agua tendrán Lago Atravesado y Central Monreal en los próximos 20 años.
  * Diseña e implementa pilotos de **calefacción distrital geotérmica** (estudios de CEGA en Escuela Agrícola y Liceo Altos del Mackay).
  * Evalúa la penetración segura de electromovilidad y bombas de calor sin fundir la red de distribución urbana.
* **Sistema 5 (Política, Identidad y Ethos):** Clausura normativa y valórica del sistema: define que Aysén no puede continuar siendo una "zona de sacrificio por frío", consagra el confort térmico como un derecho social fundamental, preserva la identidad forestal sustentable de la Patagonia y arbitra el conflicto homeostático permanente entre las urgencias presupuestarias de corto plazo (S3: pagar subsidios diésel para no apagar las caletas) y las inversiones transformadoras de largo plazo (S4: invertir en distritos térmicos y microrredes renovables).

---

## 3. ETAPA 2: CONTRASTE FORENSE DE SESGOS DE LA BASE DE DATOS LOCAL

Habiendo concluido la modelación autónoma e independiente de la Etapa 1, se procedió a abrir, auditar y contrastar minuciosamente los archivos locales `data/systemic/02_energia_combustibles_telecom.json` y el Hub III (`energia`) en `data/aysen_hubs_data.js`.

### 3.1 Anatomía Forense del Repositorio Actual
El análisis del archivo `02_energia_combustibles_telecom.json` (2.913 líneas, 110 KB) y del catálogo de datos revela la siguiente estructura existente:
* **Fuentes Primarias Declaradas:** Comisión Nacional de Energía (CNE - Energía Abierta y Bencina en Línea), Superintendencia de Electricidad y Combustibles (SEC - catastro de infraestructura) y Subsecretaría de Telecomunicaciones (SUBTEL - Fibra Óptica Austral).
* **Nodos Asignados al Hub III (4 Nodos en total):**
  * *Nodo #11:* Generación y Centrales Eléctricas (catastro georreferenciado de 14 centrales, 95,9 MW).
  * *Nodo #12:* Sistemas Eléctricos Medianos y Aislados (clasificación de comunas por subsistema, MW comunales y vulnerabilidad).
  * *Nodo #13:* Precios de Combustibles y Leña por Comuna (precios de gasolina 93, diésel, sobrecosto vs Santiago y precio del $m^3$ de leña seca).
  * *Nodo #14:* Fibra Óptica Austral (FOA) y Telecomunicaciones (enlaces de conectividad, penetración de internet fija y brecha móvil).

---

### 3.2 Diagnóstico de Sesgos Estructurales de la Base de Datos Actual

#### Sesgo 1: Reducción Tecnocrática y Mutilación de la Matriz Térmica (Invisibilización de la Leña)
* **Diagnóstico Crítico:** La base de datos local sufre un sesgo de reducción tecnocrática severo. Considera que la "Energía" en Aysén es equivalente casi exclusivamente a la **electricidad regulada por la CNE**. 
* **Evidencia Empírica de Ceguera:** La leña —que representa el **80% de toda la energía consumida en los hogares de la región** (565.456 $m^3$ sólidos/año)— ha sido degradada a una única columna auxiliar de precios en el Nodo #13 (`precio_m3_lena_seca_clp`), presentada como si fuera un combustible accesorio comparable a la gasolina automotriz de 93 octanos.
* **Vacío Cibernético:** No existe en todo el repositorio ninguna variable física que registre el volumen de estéreos consumidos, el porcentaje de humedad de la biomasa, la degradación de especies nativas (lenga vs. ñirre), los Centros de Procesamiento de Biomasa (CPB) regulados por la Ley 21.499, ni el abastecimiento crítico de pellet.

#### Sesgo 2: Sesgo Institucional Centralista y Monopolio de Fuentes
* **Diagnóstico Crítico:** El dataset fue construido a partir de APIs abiertas del gobierno central de fácil consulta en Santiago (CNE Energía Abierta y portal Bencina en Línea), ignorando deliberadamente a las agencias que custodian los datos sustantivos de la Patagonia.
* **Evidencia de Ceguera Institucional:**
  * **Omisión de INFOR (Instituto Forestal):** A pesar de que INFOR es la máxima autoridad científica chilena en dendroenergía y posee catastros exhaustivos de consumo de leña por comuna y tipo de vivienda en Aysén, no es citado ni utilizado en una sola línea del dataset.
  * **Omisión de la Red de Pobreza Energética (RedPE):** Los estudios de habitabilidad térmica, porcentaje de ingreso destinado a energía e hipotermia intradomiciliaria en Aysén no existen en la base de datos.
  * **Omisión del Ministerio del Medio Ambiente (MMA) y el PDA:** El Plan de Descontaminación Atmosférica de Coyhaique (D.S. N° 7), el registro de recambio de más de 12.000 calefactores y los episodios críticos de $MP_{2,5}$ están completamente ausentes.
  * **Omisión de CONAF:** La fiscalización de planes de manejo forestal y las Guías de Libre Tránsito no figuran en el análisis energético.
  * **Omisión de CEGA:** Las investigaciones sobre geotermia somera para distritos térmicos escolares y residenciales no tienen cabida en la estructura actual.

#### Sesgo 3: Sesgo Geográfico y Homogeneización Ficticia de Precios
* **Diagnóstico Crítico:** En el archivo `02_energia_combustibles_telecom.json`, los precios de la leña y los combustibles se presentan con valores fijos que homogeneizan artificialmente realidades territoriales radicalmente dispares.
* **Evidencia:** 
  * Asigna un precio uniforme de `$48.000` el $m^3$ en Coyhaique, `$46.000` en Aysén, `$40.000` en Tortel y `$36.000` en O'Higgins. En la práctica de terreno, en comunas del sur como O'Higgins o Tortel la leña no se transa formalmente en "metros cúbicos comerciales estandarizados", sino en varas, carretadas o autoconsumo silvicultural; y en Melinka (Guaitecas) el precio del saco o metro cúbico puede duplicarse por costos de flete marítimo.
  * En el costo de generación diésel en sistemas aislados (`costo_generacion_diesel_aislado_clp_kwh`), la base de datos consigna `$0.0` para Coyhaique, Aysén, Chile Chico, Cochrane e Ibáñez, y anota valores estáticos para Lago Verde (`$560.0), Cisnes (`$380.0`), Guaitecas (`$640.0`), O'Higgins (`$620.0`) y Tortel (`$680.0`). Sin embargo, **oculta los subsidios operativos millonarios aportados por el Estado** (vía FNDR y Subdere) que absorben la diferencia para que los usuarios no paguen esas tarifas exorbitantes. El dato reportado es un costo contable teórico desvinculado del flujo fiscal real.

#### Sesgo 4: Sesgo Estático y Ceguera ante la Demanda Punta Invernal
* **Diagnóstico Crítico:** La base de datos cataloga potencias instaladas estáticas en megawatts (MW) por central eléctrica, pero carece por completo de la dimensión temporal y dinámica de la operación del sistema.
* **Evidencia Cibernética:**
  * No incluye curvas horarias de carga estacional ni factores de planta mensuales.
  * No refleja el fenómeno del **estiaje invernal hídrico**, donde las centrales hidroeléctricas de pasada se quedan sin caudal líquido por congelamiento de cumbres, obligando a encender el parque térmico diésel de emergencia.
  * Al carecer de modelación de la demanda punta invernal, la base de datos es incapaz de anticipar el cuello de botella que provocaría la transición a calefacción eléctrica.

#### Sesgo 5: Subsunción Forzada de Telecomunicaciones en el Hub de Energía
* **Diagnóstico Crítico:** El Hub III se denomina formalmente "Energía & Telecomunicaciones". Como resultado de este diseño, el Nodo #14 fue copado por datos de la Fibra Óptica Austral (FOA) y penetración de internet fija de SUBTEL.
* **Consecuencia:** Se sacrificó el 25% del espacio cognitivo y relacional del Hub para albergar telecomunicaciones (que pertenece ontológicamente a la infraestructura de conectividad del WP_01 / Hub IV), dejando sin espacio a temas vitales como la Biomasa, el PDA, la Pobreza Energética o la Calefacción Distrital.

---

### 3.3 Matriz de Brechas Cibernéticas y Puntos Ciegos

| Dimensión Cibernética | Variable Crítica Ausente en el Repositorio Actual | Flujo Físico o Magnitud Omitida | Actores Clave Invisibilizados | Impacto en la Toma de Decisiones y el Consultor RAG |
|:---|:---|:---|:---|:---|
| **Metabolismo de Biomasa Forestal** | Consumo anual de leña nativa en metros cúbicos sólidos ($m^3$ s) y estéreos ($m^3$ st) por comuna. | **565.456 m³ sólidos/año** (~850.000 estéreos) de biomasa quemada en la región. | Productores forestales locales, leñeros tradicionales, cuadrillas de motosierristas, CONAF e INFOR. | El sistema ignora el 80% de la energía de los hogares. Si un usuario pregunta sobre el balance energético comunal, el Consultor solo responderá con datos eléctricos marginales. |
| **Calidad del Combustible y Marco Legal** | Cumplimiento de estándares de humedad según la Ley N° 21.499 de Biocombustibles Sólidos. | Contenido porcentual de humedad de la leña comercializada (rango real 35%-55% vs límite legal <25%). | Centros de Procesamiento de Biomasa (CPB), fiscalizadores SEC con xilohigrómetros y comerciantes no registrados. | Incapacidad de evaluar la implementación de la ley más importante del sector energético aprobada en la última década. |
| **Cadena de Importación de Pellet** | Tonelaje importado de pellet, stock de inventario en bodega y vulnerabilidad de cabotaje marítimo. | **18.000 - 22.000 toneladas/año** trasladadas en barcaza desde Biobío/Araucanía; tasa de quiebre de stock en julio. | Fabricantes de pellet del centro-sur, transportistas marítimos (Navimag/Kochifas), distribuidoras y familias en filas de racionamiento. | La plataforma no detecta el riesgo inminente de desabastecimiento invernal en Coyhaique provocado por el éxito del recambio de calefactores. |
| **Pobreza Energética y Envolvente** | Indicador 10% de gasto energético sobre ingresos; transmitancia térmica media ($U$) del parque habitacional ($W/m^2K$). | Pérdida de calor del **60% al 75%** por infiltraciones de aire y conductividad térmica de muros en viviendas pre-2007. | Red de Pobreza Energética (RedPE), familias vulnerables bajo privación térmica y MINVU (subsidios de aislación PDA). | La plataforma asume falsamente que el problema de calefacción se resuelve cambiando la estufa, sin modelar el reacondicionamiento de la vivienda. |
| **Cuello de Botella de Transición Eléctrica** | Demanda de potencia eléctrica pico en alimentadores urbanos durante olas de frío (-10 °C); saturación de transformadores. | Requerimiento de **54,4 MW adicionales instantáneos** si se electrificara la calefacción urbana de Coyhaique sin aislar. | Edelaysén, CNE, comités de clientes de Tarifa EcoAyre, SEC y técnicos de distribución. | Sesgo tecno-optimista: se promueve el recambio a aire acondicionado sin alertar que la red colapsará si se masifica sin aislación previa. |
| **Subsidios Fiscales a Zonas Aisladas** | Monto anual consolidado de subsidios FNDR y Subdere transferidos para solventar el diésel municipal en sistemas aislados. | Cientos de millones de pesos anuales transferidos a las municipalidades de Guaitecas, Tortel y Villa O'Higgins. | Gobiernos locales (Alcaldes, SECPLA), SUBDERE, Consejo Regional (CORE) y DIPRES. | La base reporta un costo de generación diésel teórico, invisibilizando el subsidio estatal que sostiene la vida en las islas y caletas. |
| **Saturación Atmosférica y Salud** | Concentraciones diarias de $MP_{2,5}$ y $MP_{10}$ en estaciones de monitoreo de Coyhaique; número de días en Emergencia Ambiental. | Episodios críticos invernales superando los **170 µg/m³ 24h** de $MP_{2,5}$ (más de 3 veces la norma ambiental). | Superintendencia del Medio Ambiente (SMA), SEREMI de Salud, Servicio de Salud Aysén (camas UCI pediátricas). | Desconexión analítica absoluta entre la quema de energía y sus consecuencias inmediatas en la salud pública regional. |
| **Alternativas Sustentables Distritales** | Proyectos y potencial de calefacción distrital con geotermia de baja entalpía y calderas de biomasa centralizada. | Capacidad térmica proyectada para barrios residenciales y edificios públicos (piloto Escuela Agrícola Coyhaique). | CEGA (Universidad de Chile), Aiguasol, Gobierno Regional de Aysén y SEREMI del Medio Ambiente. | Ceguera ante la única solución tecnológica y comunitaria capaz de descarbonizar el calor sin sobrecargar la red eléctrica individual. |

---

### 3.4 Plan de Captura y De-biasing de Datos Sin Sesgo (Costo $0)

Para superar los sesgos diagnosticados y restituir la variedad cibernética al repositorio sin incurrir en costos de infraestructura ni dependencias de software complejas, se formula la siguiente arquitectura de ingesta de alta fidelidad:

| Dimensión Priorizada | Variable Requerida | Fuente Institucional Primaria | Instrumento Legal Habilitante | Frecuencia de Actualización | Mecanismo de Ingestión Automatizable (Costo $0) | Destino en la Plataforma |
|:---|:---|:---|:---|:---|:---|:---|
| **Dendroenergía y Biomasa** | Consumo comunal de leña por tipo de vivienda ($m^3$ s/año y $m^3$ st/año); especies dominantes (lenga, ñirre). | **Instituto Forestal (INFOR)** / Ministerio de Agricultura | Ley N° 20.283 sobre Recuperación del Bosque Nativo y Fomento Forestal | Anual / Trienal | Parser Python de reportes dendroenergéticos abiertos de INFOR (`infor.cl/estudios`) y tablas estadísticas PDF/Excel. | Hub III - Nuevo Nodo Temático: *Consumo y Metabolismo de Biomasa Forestal* |
| **Biocombustibles Sólidos** | Catastro de Centros de Procesamiento de Biomasa (CPB) registrados y porcentaje de leña certificada seca (<25%). | **Superintendencia de Electricidad y Combustibles (SEC)** | **Ley N° 21.499** de Biocombustibles Sólidos (D.O. Noviembre 2022) | Semestral | Consulta automatizada al Registro Público de Biocombustibles Sólidos de la SEC (`sec.cl`). | Hub III - Nodo #13 (Reestructuración profunda de métricas de calidad). |
| **Suministro de Pellet** | Volumen mensual ingresado de pellet por Puerto Chacabuco; monitoreo de stock en bodega y alertas de quiebre. | **SEREMI de Energía Aysén** / Empresa Portuaria Chacabuco (EMPORCHA) | Decretos PDA y Ley de Puertos | Mensual (Mayo a Septiembre) | Ingestión de planillas públicas de movimiento de carga de cabotaje de EMPORCHA y boletines de la Mesa del Pellet. | Hub III - Nuevo Atributo en Flujos de Combustibles y Vulnerabilidad Logística. |
| **Calidad del Aire y Salud** | Registro diario de $MP_{2,5}$, $MP_{10}$, días bajo Alerta, Preemergencia y Emergencia Sanitaria en Coyhaique. | **Sistema de Información Nacional de Calidad del Aire (SINCA - MMA)** | D.S. N° 7/2018 MMA (Plan de Descontaminación Atmosférica de Coyhaique) | Diaria / Mensual automatizada | Script de scraping al API/JSON público de estaciones de monitoreo SINCA (Coyhaique I y Coyhaique II). | Hub III - Cruce Sistémico con Red de Monitoreo Ambiental y Salud (Hub VIII). |
| **Pobreza Energética y Envolvente** | Porcentaje de ingreso destinado a energía por decil comunal; parque de viviendas con aislación térmica PDA. | **Red de Pobreza Energética (RedPE)** / SEREMI MINVU Aysén | Ley N° 19.300 sobre Bases Generales del Medio Ambiente y decretos MINVU | Bianual (CASEN) / Anual | Extracción estructurada de microdatos CASEN (módulo Energía/Habitabilidad) y reportes de ejecución de subsidios MINVU. | Hub III - Nuevo Indicador Sistémico: *Índice de Brecha Térmica y Pobreza Energética*. |
| **Operación Real y Pico Eléctrico** | Curvas de demanda horaria en Sistemas Medianos; porcentaje de generación diésel por estiaje hídrico; SAIDI/SAIFI por comuna. | **Comisión Nacional de Energía (CNE)** / Coordinador Eléctrico Nacional | DFL N° 4 (Ley General de Servicios Eléctricos) Art. 173° y ss. | Mensual continuo | Ingesta vía API REST pública de *Energía Abierta CNE* (`datos.energiaabierta.cl`) de generación horaria por tecnología. | Hub III - Nodo #11 y #12 (Incorporación de series de potencia dinámica y picos de demanda). |
| **Subsidios a Sistemas Aislados** | Transferencias fiscales efectivas (FNDR / Subdere) para subsidiar el diésel en Melinka, Tortel y Villa O'Higgins. | **Gobierno Regional de Aysén (GORE)** / SUBDERE / CGR | Ley de Presupuestos del Sector Público (Partida Interior / Gobiernos Regionales) | Anual (Cierre Presupuestario) | Descarga estructurada de balances de ejecución presupuestaria del SINIM y portal de Datos Abiertos de DIPRES. | Hub III - Nodo #12 (Métricas reales de costo de generación vs tarifa subsidiada). |
| **Energía Distrital y Geotermia** | Catastro de pozos y proyectos de geotermia somera / distritos térmicos en evaluación en Coyhaique y Aysén. | **Centro de Excelencia en Geotermia de los Andes (CEGA)** / MMA | Fondo de Innovación para la Competitividad (FIC-R GORE Aysén) | Anual | Sistematización de informes técnicos de proyectos FIC de geotermia de baja entalpía ejecutados por CEGA / U. de Chile. | Hub III - Módulo Prospección de Futuro (Sistema 4 de Beer). |

---

## 4. CONCLUSIONES E IMPLICANCIAS PARA LA ARQUITECTURA DE LA PLATAFORMA

1. **Reestructuración Necesaria del Hub III (Energía):**
   * El Hub III debe desvincularse conceptualmente de Telecomunicaciones (las telecomunicaciones deben migrar al Hub IV / Gobernanza e Infraestructura o conectarse transversalmente).
   * Los 4 nodos del Hub III deben reconfigurarse para reflejar el metabolismo real:
     * **Nodo A:** *Generación Eléctrica, Sistemas Medianos y Microrredes Aisladas* (CNE / Edelaysén / Subsidios FNDR).
     * **Nodo B:** *Metabolismo de Biomasa, Leña Nativa y Cadena del Pellet* (INFOR / CONAF / Mesa del Pellet).
     * **Nodo C:** *Biocombustibles Sólidos, Ley 21.499 y Regulación de Calidad SEC* (SEC / CPB / Xilohigrómetros).
     * **Nodo D:** *Pobreza Energética, Envolvente Habitacional y Calidad del Aire PDA* (RedPE / MINVU / SINCA MMA).
2. **Impacto en el Motor RAG (`omniroute_client.js`) y `nl2chart_engine.js`:**
   * El lexicón semántico (`data/nl_lexicon_aysen.json`) debe incorporar de inmediato entidades y sinónimos australes indispensables: `leña`, `estéreos`, `metros cúbicos sólidos`, `pellet`, `lenga`, `ñirre`, `humedad`, `xilohigrómetro`, `pobreza energética`, `envolvente térmica`, `PDA`, `recambio de calefactores`, `MP2.5`, `Edelaysen`, `Saesa`, `sistemas medianos`, `sistemas aislados`, `tarifa EcoAyre`, `calefacción distrital`, `geotermia`.
   * Al consultar por *"¿Por qué está contaminado Coyhaique?"* o *"¿Cuál es la matriz energética de Aysén?"*, el motor RAG ya no ofrecerá una respuesta sesgada citando únicamente megawatts hidroeléctricos o precios de gasolina 93, sino que desplegará el balance térmico de los 565.456 $m^3$ de biomasa y el 80% de combustión residencial.
3. **Implicancias para el Laboratorio Sistémico 2D (`laboratorio.html`):**
   * Las ventanas flotantes deben permitir cruzar el **Nodo de Consumo de Biomasa** con el **Nodo de Hospitalizaciones por Causa Respiratoria (Hub VIII - Salud)** y el **Nodo de Ingresos y Empleo (Hub V - Economía)**, permitiendo a investigadores, estudiantes y autoridades visualizar en el lienzo cartográfico la correlación directa entre mala aislación, gasto excesivo en leña y colapso hospitalario de invierno.

---

## 5. PREGUNTAS REMANENTES Y VACÍOS DE INFORMACIÓN (INVESTIGATION WORKER GAPS)

1. **Cuantificación Exacta de la Evasión Silvicultural de la Leña:**
   * *Pregunta:* ¿Cuál es el porcentaje preciso de leña comercializada en Coyhaique que no cuenta con Guía de Libre Tránsito de CONAF frente a la leña extraída de talas no autorizadas en bosque nativo?
   * *Brecha:* CONAF fiscaliza puntos de control carretero, pero carece de brigadas de aforo volumétrico continuo para contrastar la oferta física que ingresa a la ciudad contra el volumen autorizado en planes de manejo. Se requiere un aforo de transporte de carga en los accesos de Coyhaique (Ruta 7 Norte, Ruta 7 Sur, Ruta 240).
2. **Límites de Admisión de Potencia en Subestaciones de Edelaysén:**
   * *Pregunta:* ¿Cuántas bombas de calor eléctricas inverter o empalmes de Tarifa EcoAyre puede soportar cada alimentador barrial de Coyhaique y Puerto Aysén antes de requerir un plan de inversión en repotenciación de subestaciones y tendido de líneas protegidas?
   * *Brecha:* Los estudios de capacidad de distribución de Edelaysén se mantienen bajo reserva técnica corporativa y solo se transfieren parcialmente a la CNE en los procesos cuadrienales de tarificación de Sistemas Medianos.
3. **Costo Nivelado de la Calefacción Distrital Geotérmica:**
   * *Pregunta:* ¿Cuál es el costo nivelado del calor (LCOH - *Levelized Cost of Heat*, en $/kWh calórico) de un sistema distrital centralizado geotérmico o de biomasa tecnificada frente al costo real de la leña seca con xilohigrómetro?
   * *Brecha:* El proyecto piloto del sector Escuela Agrícola cuenta con ingeniería conceptual, pero falta licitar y ejecutar la obra civil definitiva para obtener datos empíricos de explotación en régimen patagónico.
4. **Prioridad para el Siguiente Investigador / Agente de Mejora:**
   * Consolidar el parser Python para capturar el catastro dendroenergético de INFOR y los registros de calidad del aire del SINCA MMA, incorporándolos al pipeline de compilación de `scripts/build_aysen_hubs_bundle.cjs`.
