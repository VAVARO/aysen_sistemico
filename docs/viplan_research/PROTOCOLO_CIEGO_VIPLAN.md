# Protocolo Común de Investigación Cibernética: VIPLAN y VSM para Aysén
**Metodología de Modelado Sistémico Ciego (Tabula Rasa) y Contraste Forense de Sesgos**  
*Basado en la Cibernética Organizacional de Stafford Beer (1972, 1979, 1985) y el Método VIPLAN de Raúl Espejo (1989, 2011, 2020, 2022)*

---

## 1. Fundamentos Epistemológicos y Marco Teórico

El presente protocolo operacionaliza el enfoque cibernético organizacional desarrollado por **Stafford Beer** en el proyecto Cybersyn (1971–1973) y formalizado por **Raúl Espejo** a través del método y metodología **VIPLAN** (*Viable Plan*, Espejo 1989; Espejo y Reyes 2011, 2016; Espejo 2020, 2022).

### 1.1 Principio de Doble Descripción (Caja Negra y Descripción Operacional)
1. **Descripción de Caja Negra (Cibernética de Primer Orden - Sistema Observado):**
   - Modela la relación del sistema con su entorno en términos de insumos (*inputs*), transformaciones operacionales (*transformations*) y productos/impactos (*outputs*), bajo el supuesto de propósitos compartidos.
   - Utiliza la herramienta de nombramiento de sistemas **TASCOI** (*Transformation, Actors, Suppliers, Customers, Owners, Interveners*).
2. **Descripción Operacional (Cibernética de Segundo Orden - Sistemas Observadores):**
   - Modela las relaciones internas de producción de autonomía, viabilidad y gobierno en cinco funciones sistémicas (Sistemas 1 a 5 de Beer) y sus canales de comunicación e interacción recíproca.
   - Examina los acoplamientos estructurales, la clausura operacional y la autopoiesis relacional entre actores.

### 1.2 Ley de Variedad Requerida de Ashby y Ecuación de Variedad de Espejo
La complejidad se define como la variedad de estados distinguibles ($V$). Por la Ley de Requisite Variety (Ashby, 1956, 1964):
$$\text{"Solo la variedad puede absorber o destruir variedad"}$$

En la formulación de Espejo y Howard (1982) y Espejo (2022):
$$V_O \ge \frac{V_D}{V_R}$$
donde:
- $V_D$: Variedad de perturbaciones del entorno (*environmental disturbances*).
- $V_R$: Variedad de respuestas del sistema regulador (*regulatory responses / affordances*).
- $V_O$: Variedad residual resultante de resultados (*outcomes*).
- $V_T$: Variedad objetivo admisible o estados deseables (*target / desirable states*).

Para que la regulación sea efectiva y el sistema sea viable:
$$V_O \le V_T \implies \frac{V_D}{V_R} \le V_T \iff V_R \ge \frac{V_D}{V_T}$$

En sistemas socio-territoriales complejos existe un desbalance intrínseco de variedades:
$$V_E \gg V_O \gg V_M$$
donde $V_E$ es la variedad ambiental, $V_O$ la variedad de la organización operacional y $V_M$ la variedad de la gestión/gobierno. Para equilibrar estas brechas se requiere **Ingeniería de Variedad**:
- **Atenuadores de variedad (filtros):** Agregación de datos, protocolos estándar, zonificación, priorización algorítmica, normas y autorregulación comunitaria.
- **Amplificadores de variedad (multiplicadores):** Tecnologías de sensorización, alertas casi en tiempo real, descentralización del mando (*redundancy of potential command*), subsidios flexibles, logística de emergencia, empoderamiento de actores de base.

---

## 2. Protocolo de Dos Etapas: Regla de Cero Sesgo de Anclaje

Para garantizar que el modelo territorial no sea un mero reflejo o racionalización de los datos preexistentes en el repositorio, la investigación se rige estrictamente por dos etapas consecutivas e infranqueables.

```
┌────────────────────────────────────────────────────────┐
│ ETAPA 1: CIEGA (TABULA RASA)                           │
│ - PROHIBIDO abrir carpeta `data/`                      │
│ - Fuentes externas: Leyes, Decretos, MTT, MOP, DOH,     │
│   CONAF, SERNATUR, CGR, prensa regional, literatura    │
│ - Construcción VSM + VIPLAN + Flujograma Cuantificado │
└───────────────────────────┬────────────────────────────┘
                            │ (Modelo completado)
                            ▼
┌────────────────────────────────────────────────────────┐
│ ETAPA 2: CONTRASTE FORENSE DE SESGOS                   │
│ - Apertura de `data/systemic/` y `data/aysen_hubs...`  │
│ - Auditoría de sesgos (geográfico, metodológico, etc.) │
│ - Identificación de vacíos de variedad y ceguera VSM   │
│ - Plan de captura y balanceo de datos de alta fidelidad│
└────────────────────────────────────────────────────────┘
```

---

## 3. Requerimientos Metodológicos de la Etapa 1 (Ciega)

Cada agente de investigación debe desarrollar independientemente los siguientes 4 bloques:

### 3.1 Nombramiento y Matriz TASCOI en 3 Niveles de Recursión
Identificación rigurosa de las transformaciones clave a tres escalas anidadas:
- **Recursión $N+1$ (Nivel Macro / Regional):** El sistema territorial de Aysén integrado a la nación y el cono sur.
- **Recursión $N$ (Nivel Foco):** El subsistema funcional sectorial en estudio (ej. Red Logística Multimodal, Red de Salud y Cuidados, Red Hidro-Ecológica, Matriz Productivo-Comunitaria).
- **Recursión $N-1$ (Nivel Operacional Local):** Nodos territoriales, cuencas, comunas, cooperativas o unidades de prestación directa.

Para cada nivel se formaliza la tupla **TASCOI**:
- **T (Transformation):** Proceso de transformación ontológica: Insumos brutos $\rightarrow$ Operación $\rightarrow$ Bienestar / Estados resultantes.
- **A (Actors):** Agentes humanos e institucionales que ejecutan la transformación.
- **S (Suppliers):** Proveedores de insumos materiales, energéticos, normativos o informativos.
- **C (Customers):** Destinatarios directos, beneficiarios y receptores de externalidades.
- **O (Owners):** Titulares del sistema con poder de rediseño, veto o reasignación patrimonial.
- **I (Interveners):** Actores del macroentorno que imponen restricciones, regulaciones o perturbaciones.

### 3.2 Flujograma Cuantificado Real (Estilo Cybersyn / INTEC 1973)
Reconstrucción de la topología real de flujos:
- Identificación de nodos fuente, enlaces de transporte/distribución, cuellos de botella e inventarios críticos.
- Métricas operacionales cuantitativas:
  - **Actualidad ($A$):** Lo que actualmente rinde o transporta el sistema con recursos presentes.
  - **Capacidad ($C$):** Lo que podría rendir con los recursos existentes bajo óptima gestión.
  - **Potencialidad ($P$):** Lo que podría lograr desarrollando nuevos recursos o eliminando cuellos de botella estructurales.
  - **Índices de Stafford Beer:**
    - Productividad $= A / C$
    - Latencia $= C / P$
    - Rendimiento global $= A / P$

### 3.3 Ecuación de Variedad de Ashby/Beer y Análisis de Operadores
- Catálogo de **Perturbaciones Críticas ($V_D$):** Eventos climáticos extremos, fallas de barcazas, huelgas, cortes de ruta por aluvión, desabastecimiento de diésel, brechas satelitales.
- Catálogo de **Respuestas del Regulador ($V_R$):** Contratos de reemplazo, subsidios a la demanda, almacenamiento estratégico, conectividad satelital Starlink, aeromédicos.
- Identificación de **Atenuadores** y **Amplificadores** de variedad existentes vs. faltantes.

### 3.4 Arquitectura de Gobernanza (Sistemas 1 a 5 de Beer)
- **Sistema 1 (Operación Primaria):** Unidades operacionales autónomas que entregan el valor del sistema.
- **Sistema 2 (Coordinación y Anti-Oscilación):** Protocolos de despacho, calendarios de mareas/barcazas, frecuencias de buses, neutralización de interferencias mutuas.
- **Sistema 3 (Control Operacional Interno y Sinergia):** Asignación de recursos corrientes, monitoreo de desempeño, fiscalización de contratos MTT/MOP.
- **Sistema 3\* (Canal de Auditoría Esporádico / Sporadic Audit):** Inspección sorpresiva en terreno, fiscalización de seguridad marítima por DIRECTEMAR, muestreos de calidad de combustible o caminos.
- **Sistema 4 (Inteligencia, Adaptación y Futuro):** Monitoreo de cambio climático, planificación de infraestructura de 10-20 años, modelado de riesgos de aislamiento, prospección de rutas alternativas.
- **Sistema 5 (Política, Identidad y Clausura Normativa):** Definición de la vocación del sistema, equilibrio entre corto plazo (S3) y largo plazo (S4), asignación constitucional y legal de responsabilidades soberanas.

---

## 4. Requerimientos Metodológicos de la Etapa 2 (Contraste Forense de Sesgos)

Una vez completada la Etapa 1 sin haber abierto la carpeta `data/`, se procede a la auditoría forense del repositorio:

1. **Diagnóstico de Sesgos Estructurales:**
   - **Sesgo Geográfico / Centralista Regional:** ¿Los datos del repositorio se concentran desproporcionadamente en Coyhaique y Puerto Aysén, invisibilizando comunas periféricas (Tortel, O'Higgins, Melinka/Guaitecas, Lago Verde, Ibáñez)?
   - **Sesgo Sectorial / Corporativo:** ¿Se hiper-registra la actividad de grandes industrias (ej. salmonicultura, concesiones) mientras se sub-registran las economías locales, la leña informal, el cabotaje artesanal o la movilidad de pueblos originarios?
   - **Sesgo Estático vs. Dinámico (Falta de Flujos):** ¿La base de datos contiene inventarios estáticos en lugar de matrices de origen-destino, tiempos de tránsito estacionales, fallas de servicio y tasas de recurrencia de corte de conectividad?
   - **Sesgo Institucional:** ¿Se toma acríticamente lo que publican ministerios centrales (MTT, MOP, INE) ignorando datos de terreno, quejas vecinales, dictámenes de Contraloría y reportes de fiscalización marítima/vial?
2. **Matriz de Brechas Cibernéticas:**
   - Variables requeridas por el modelo VSM no presentes en `data/systemic/` ni en `aysen_hubs_data.js`.
   - Actores clave omitidos en el análisis.
3. **Plan de Captura y De-biasing de Datos:**
   - Tabla estricta con Fuente Institucional / Ley Habilitante / Variable Requerida / Frecuencia de Actualización / Mecanismo de Ingestión Automatizable a costo $0.

---

## 5. Salidas Contractuales

Cada Sub-Agente debe entregar un archivo markdown monográfico y exhaustivo con la siguiente nomenclatura:
- Sub-Agente 1: `docs/viplan_research/INFORME_CIEGO_01_CONECTIVIDAD_LOGISTICA.md`
- Sub-Agente 2: `docs/viplan_research/INFORME_CIEGO_02_PRODUCTIVO_ENERGIA.md`
- Sub-Agente 3: `docs/viplan_research/INFORME_CIEGO_03_SOCIO_ECOLOGICO_SALUD.md`
- Sub-Agente 4: `docs/viplan_research/INFORME_CIEGO_04_GOBERNANZA_DESCENTRALIZACION.md`

Todo informe debe incorporar citas legales explícitas, tablas de cuantificación de flujos reales, ecuaciones de balance de variedad resueltas y diagnósticos forenses fundados en evidencia empírica.
