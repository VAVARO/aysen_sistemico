# scripts/build_dialogo_sistemas_complejos.py
import json
import os
from datetime import datetime

files = [
    (1, "Pregunta 1: Fundamentos de Sistemas Complejos Dinámicos vs. Capas Aisladas",
     r"C:\Users\alvar\.gemini\antigravity\brain\d2d6b783-4fb8-4a01-ba01-ed4f264c0a53\.system_generated\steps\163\output.txt"),
    (2, "Pregunta 2: Diagramas de Bucle Causal (CLD) y Mapeo Participativo (Barbrook-Johnson & Penn / PSMtoToC)",
     r"C:\Users\alvar\.gemini\antigravity\brain\0b9ef3f3-74db-4da5-8cf3-b6a3a1d4b958\.system_generated\steps\6\output.txt"),
    (3, "Pregunta 3: Modelo del Sistema Viable (VSM de Beer / Jackson) y Descentralización en Chile",
     r"C:\Users\alvar\.gemini\antigravity\brain\0b9ef3f3-74db-4da5-8cf3-b6a3a1d4b958\.system_generated\steps\10\output.txt"),
    (4, "Pregunta 4: Complejidad Coercitiva, Asimetría de Poder y Heurística Crítica de Sistemas (CSH de Ulrich)",
     r"C:\Users\alvar\.gemini\antigravity\brain\0b9ef3f3-74db-4da5-8cf3-b6a3a1d4b958\.system_generated\steps\14\output.txt"),
    (5, "Pregunta 5: Ruptura del Triángulo de Hierro y Evaluación Realista CMO (Pawson & Tilley)",
     r"C:\Users\alvar\.gemini\antigravity\brain\0b9ef3f3-74db-4da5-8cf3-b6a3a1d4b958\.system_generated\steps\18\output.txt"),
    (6, "Pregunta 6: Atractores Dominantes, Efecto Elástico y Palancas al 2030-2035 (Danny Burns / SAR)",
     r"C:\Users\alvar\.gemini\antigravity\brain\0b9ef3f3-74db-4da5-8cf3-b6a3a1d4b958\.system_generated\steps\26\output.txt"),
    (7, "Pregunta 7: El Hospital Regional de Coyhaique (HRC) y la Red de Salud como Sensor Sistémico",
     r"C:\Users\alvar\.gemini\antigravity\brain\0b9ef3f3-74db-4da5-8cf3-b6a3a1d4b958\.system_generated\steps\30\output.txt"),
    (8, "Pregunta 8: De un 'Mapa que Estorba' a un Escritorio de Modelamiento Sistémico y Relacional",
     r"C:\Users\alvar\.gemini\antigravity\brain\0b9ef3f3-74db-4da5-8cf3-b6a3a1d4b958\.system_generated\steps\34\output.txt"),
    (9, "Pregunta 9: Las 8 Preguntas de Evaluación en Complejidad y Superforecasting 2030-2035 (Larson)",
     r"C:\Users\alvar\.gemini\antigravity\brain\0b9ef3f3-74db-4da5-8cf3-b6a3a1d4b958\.system_generated\steps\38\output.txt"),
    (10, "Pregunta 10: Plano Maestro y Síntesis Arquitectónica para Reconstruir la Plataforma de Aysén",
     r"C:\Users\alvar\.gemini\antigravity\brain\0b9ef3f3-74db-4da5-8cf3-b6a3a1d4b958\.system_generated\steps\42\output.txt")
]

target_md = r"c:\AGY\SUPERFORECAST\docs\ideas\dialogo_10_preguntas_notebooklm_sistemas_complejos.md"
os.makedirs(os.path.dirname(target_md), exist_ok=True)

doc_lines = []

# Encabezado
doc_lines.append("# Diálogo de Profundización: 10 Preguntas sobre Sistemas Complejos Dinámicos, Cibernética Organizacional y Prospectiva Territorial para Aysén\n")
doc_lines.append("> **Origen y Metodología:** Investigación dialógica exhaustiva realizada contra el cuaderno de NotebookLM *\"Evaluating Complex Interventions: Challenges and Approaches\"* (ID: `81d2e6c4-8204-4401-ba86-e4689db32097`), compuesto por 34 fuentes científicas y documentales de frontera (Michael C. Jackson, Stafford Beer, Werner Ulrich, Pete Barbrook-Johnson & Alexandra Penn, Danny Burns, Ann Larson, Ray Pawson & Nick Tilley, Descentralización en Chile 1990-2025, y Gestión Clínica/Humanización del Hospital Regional de Coyhaique).")
doc_lines.append("> ")
doc_lines.append(f"> **Fecha:** Octubre 2026 | **Conversación ID en NotebookLM:** `c00ad078-b464-4214-9806-ad51c61e1420` | **Estado:** 10/10 Preguntas y Respuestas Completadas e Integradas.\n")

doc_lines.append("## Tabla de Contenidos\n")
for num, title, _ in files:
    slug = f"pregunta-{num}"
    doc_lines.append(f"- [{title}](#{slug})")
doc_lines.append("- [Síntesis Ejecutiva de Hallazgos y Hoja de Ruta de Reconstrucción](#sintesis-ejecutiva-de-hallazgos-y-hoja-de-ruta-de-reconstruccion)")
doc_lines.append("  - [1. El Diagnóstico Crítico: La Ceguera del Mapa Geográfico Tradicional](#1-el-diagnostico-critico-la-ceguera-del-mapa-geografico-tradicional)")
doc_lines.append("  - [2. Las 5 Vistas del Nuevo Escritorio Sistémico](#2-las-5-vistas-del-nuevo-escritorio-sistemico)")
doc_lines.append("  - [3. Malla Relacional Unificada de las 6 Bases de Datos](#3-malla-relacional-unificada-de-las-6-bases-de-datos)")
doc_lines.append("  - [4. El Motor Causal, Evaluativo y Dinámico](#4-el-motor-causal-evaluativo-y-dinamico)")
doc_lines.append("  - [5. El Manifiesto Anti-Slop: Las 6 Prohibiciones Innegociables](#5-el-manifiesto-anti-slop-las-6-prohibiciones-innegociables)")
doc_lines.append("  - [6. Hoja de Ruta para el Rediseño de la Plataforma de Aysén](#6-hoja-de-ruta-para-el-rediseno-de-la-plataforma-de-aysen)\n")
doc_lines.append("---\n")

# Preguntas y Respuestas
for num, title, path in files:
    slug = f"pregunta-{num}"
    with open(path, "r", encoding="utf-8") as fp:
        data = json.load(fp)
    
    q_text = data.get("question", "").strip()
    a_text = data.get("answer", "").strip()
    sources = data.get("sources_used", [])
    
    doc_lines.append(f"## {title} {{#{slug}}}\n")
    doc_lines.append("### Pregunta Formulada al Cuaderno\n")
    doc_lines.append(f"```text\n{q_text}\n```\n")
    doc_lines.append("### Respuesta Íntegra de NotebookLM\n")
    doc_lines.append(f"{a_text}\n")
    if sources:
        doc_lines.append(f"> *Fuentes utilizadas por el cuaderno en esta respuesta: {len(sources)} fuentes citadas.*\n")
    doc_lines.append("---\n")

# Sección Final de Síntesis y Rediseño
doc_lines.append("""## Síntesis Ejecutiva de Hallazgos y Hoja de Ruta de Reconstrucción

Esta sección consolida las lecciones maestras de las 10 preguntas y define la arquitectura de software, bases de datos y experiencia de usuario (UI/UX) para transformar el actual visor geográfico de Aysén en un verdadero **Observatorio de Sistemas Complejos Dinámicos y Prospectiva 2030-2035**.

### 1. El Diagnóstico Crítico: La Ceguera del Mapa Geográfico Tradicional

El reclamo fundacional de nuestro usuario (*"el mapa molesta principalmente y no deja apreciar la dimensión relacional tipo Power BI ni la complejidad del sistema"*) encuentra total respaldo científico en la literatura de Sistemas Complejos:

1. **Confusión entre contigüidad espacial y causalidad funcional:** Colocar pines sobre un mapa de Leaflet presupone que lo que está cerca en el espacio físico está interconectado causalmente. En un sistema adaptativo complejo como Aysén, la causalidad real opera a través de redes institucionales, flujos presupuestarios de Santiago (DIPRES/FONASA/SUBDERE), decisiones de holding corporativos concentrados (12 holdings controlando el 97,4% de las 745 concesiones) y derivaciones de pacientes de postas rurales hacia el único hospital de alta complejidad (HRC en Coyhaique). Un polígono municipal no explica por qué Tortel colapsa en invierno o por qué Guaitecas depende en un 80% del Fondo Común Municipal.
2. **La trampa del 'Horrendograma' Cartográfico:** Superponer 20 capas GIS simultáneas (concesiones, cuencas BNA, estaciones de monitoreo, caminos, proyectos SEIA) genera saturación cognitiva sin entregar inteligibilidad. No permite entender la dirección de la influencia, las polaridades de enlace (+/-), las demoras temporales (*lags*) ni los puntos de apalancamiento (*leverage points*).
3. **El mapa debe ser degradado a una vista auxiliar secundaria:** El núcleo de la herramienta no debe ser el mapa, sino la red relacional multivariable, los grafos causales (CLD), las matrices de adyacencia y los diagramas Sankey de flujos. El mapa geográfico solo debe responder cuando el usuario selecciona un nodo o un bucle, iluminando pasivamente en una esquina dónde se manifiesta físicamente el fenómeno.

---

### 2. Las 5 Vistas del Nuevo Escritorio Sistémico

Inspirado en Power BI, Kumu, Gephi y las metodologías PSM de Barbrook-Johnson & Penn y PSMtoToC de Wilkinson et al., la nueva interfaz se estructurará en 5 vistas maestras sincronizadas:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ESCRITORIO DE MODELAMIENTO SISTÉMICO - AYSÉN 2030-2035                                                  │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [V1: Consola Dinámica CLD] [V2: Explorador PSM] [V3: Matriz CMO] [V4: Superforecasting] [V5: SIG Aux] │
├────────────────────────────────────────┬───────────────────────────────────┬───────────────────────────┤
│ PANEL PRINCIPAL RELACIONAL             │ MATRICES & SANKEY                 │ VISTA AUXILIAR SECUNDARIA │
│                                        │                                   │                           │
│ • Lienzo de Grafo Causal Cíclico       │ • Diagrama Sankey de Flujos       │ • Mini-Mapa GIS Leaflet   │
│   (Force-Directed Layout)              │   (Presupuesto FCM -> Fondos)     │   (Resalta comunas según  │
│ • Filtros Upstream / Downstream        │ • Matriz de Adyacencia / Impactos │    el nodo seleccionado)  │
│ • Detección de Bucles R y B            │ • Desglose por RUT / Holding      │ • Ficha de Indicadores    │
│ • Marcadores de Delays (//)            │ • Tabla de Evidencias Empíricas   │   Territoriales (10 com.) │
└────────────────────────────────────────┴───────────────────────────────────┴───────────────────────────┘
```

1. **Vista 1: Consola de Dinámica Causal y Bucles Retroalimentados (CLD Engine):**
   - Lienzo interactivo que visualiza el motor central del sistema territorial.
   - Nodos formulados como variables nominales (capaces de subir o bajar).
   - Aristas orientadas con polaridades explícitas (S/+ para misma dirección, O/- para dirección contraria).
   - Destacado visual de bucles de refuerzo (R1 a R3) y de equilibrio (B1) con sus retardos temporales críticos (//).
2. **Vista 2: Explorador de Flujos Causales y Centralidad de Redes (PSM Submaps):**
   - Filtrado dinámico para descomponer mapas complejos en submapas legibles:
     - *Upstream Analysis*: Selección de una variable resultado (ej. Lista de Espera GES) y aislamiento automático de todas sus causas a 1, 2 o 3 pasos.
     - *Downstream Analysis*: Selección de una política o inversión (ej. inyección FNDR o Fibra Óptica FOA) y proyección visual de todos sus impactos indirectos.
     - *Centrality Metrics*: Algoritmos de In-degree (vulnerabilidad), Out-degree (palancas del sistema) y Betweenness (cuellos de botella).
3. **Vista 3: Matriz Contexto-Mecanismo-Resultado (CMO Realista) & Reconfiguración Territorial:**
   - Explorador de configuraciones CMO de Pawson & Tilley para romper con la falsa premisa de "¿funciona o no la política X?".
   - Permite comparar cómo una misma intervención detona mecanismos divergentes según el contexto local (Coyhaique urbano vs. Guaitecas/Tortel archipielágico y aislado).
4. **Vista 4: Simulación de Bifurcaciones y Escenarios Prospectivos (Superforecasting 2030-2035):**
   - Módulo de preguntas de pronóstico sistémico multivariable basadas en las 8 preguntas de Ann Larson.
   - Monitoreo de umbrales críticos (*tipping points*) y bifurcaciones donde choques ambientales o económicos desestabilizan el atractor dominante y empujan hacia atractores alternativos.
5. **Vista 5: Dashboard Territorio-Espacial Auxiliar (Capa SIG Minimizado):**
   - Subordinado totalmente al lienzo analítico. Solo resalta comunas, cuencas BNA o recintos hospitalarios cuando son activados en las relaciones sistémicas.

---

### 3. Malla Relacional Unificada de las 6 Bases de Datos

Para que el usuario pueda pinchar cualquier elemento y ver la propagación del impacto en tiempo real, se establece el siguiente esquema relacional integrado:

```mermaid
erDiagram
    COMUNA ||--o{ CUENCA_BNA : "contiene"
    COMUNA ||--o{ ESTABLECIMIENTO_SALUD : "aloja"
    COMUNA ||--o{ PROYECTO_SEIA : "recibe"
    COMUNA ||--o{ ZOIT_TURISMO : "delimita"
    COMUNA ||--o{ SINIM_FINANZAS : "liquida"
    HOLDING_ACUICOLA ||--o{ RUT_CORPORATIVO : "controla"
    RUT_CORPORATIVO ||--o{ CONCESION_SALMON : "titular"
    CONCESION_SALMON ||--o{ BARRIO_ACS : "agrupa"
    PROYECTO_SEIA }o--|| RUT_CORPORATIVO : "tramita"
    PROYECTO_SEIA ||--o{ NODO_ELECTRICO_FOA : "demanda"
    ESTABLECIMIENTO_SALUD ||--o{ DERIVACION_CLINICA : "origina_o_recibe"
    DERIVACION_CLINICA }o--|| HRC_SUBDIRECCION : "satura"
```

#### Campos Pivote Fundamentales:
1. **`CUT_Comuna` (Código Único Territorial INE - 11101 a 11402):** Llave primaria comunal que unifica presupuestos SINIM, población Censo 2024, caracterización CASEN, y ordenamiento territorial.
2. **`RUT_Holding` / `RUT_Titular` (Agrupación de los 42 RUTs bajo los 12 Holdings matrices):** Llave que transparenta la concentración económica del 97,4% de las 745 concesiones y cruza la titularidad de proyectos en el SEIA.
3. **`ID_Establecimiento_DEIS` & `COD_GRD`:** Conecta la red de postas y consultorios municipales con los 5 subdepartamentos de la Subdirección Médica del Hospital Regional de Coyhaique (`BBDD - Sheet1.pdf`).
4. **`Codigo_BNA_Cuenca`:** Llave de delimitación hidro-ecológica que conecta los impactos de descargas, zonas anaeróbicas y disponibilidad hídrica con los municipios y concesiones.
5. **`ID_Proyecto_SEIA`:** Identifica proyectos evaluados (acumulando 3.355 MM USD), su estado RCA y su demanda sobre nodos energéticos y viales.

---

### 4. El Motor Causal, Evaluativo y Dinámico

El backend de la plataforma se estructurará sobre tres componentes computacionales desacoplados del visor estático:

1. **Motor de Grafos y Álgebra de Matrices (Network Engine):**
   - Modela la red territorial como un grafo dirigido ponderado cíclico.
   - Aplica algoritmos de cálculo de caminos mínimos, flujos máximos y descomposición espectral para identificar centralidades en tiempo real.
2. **Evaluador Realista de Funciones de Activación Contextual:**
   - Las aristas causales no son números fijos; se evalúan como funciones condicionadas por el contexto comunal:
     $$w_{i \to j} = f(Contexto_{k}, Mecanismo_{m})$$
   - Si la comuna es calificada como "aislamiento extremo", el peso del retraso logístico o de aversión al riesgo se incrementa, modelando formalmente por qué la misma política produce resultados opuestos en Coyhaique frente a Tortel o Melinka.
3. **Módulo de Superforecasting de Bifurcaciones 2030-2035:**
   - En lugar de proyectar regresiones lineales univariadas ($R^2$), el motor formula preguntas de torneos con umbrales multivariables cruzados, simulando la transición de fase entre atractores subóptimos y atractores alternativos.

---

### 5. El Manifiesto Anti-Slop: Las 6 Prohibiciones Innegociables

Para preservar el rigor científico y evitar la degradación de la herramienta hacia un portal genérico de visualización ("AI Slop" o tecnocracia vacía), se establecen 6 mandamientos arquitectónicos:

1. 🚫 **PROHIBICIÓN 1: La Regresión Lineal Descontextualizada.** Queda terminantemente prohibido proyectar series de tiempo territoriales como extrapolaciones lineales aisladas sin explicitar los bucles de retroalimentación y la coevolución de actores.
2. 🚫 **PROHIBICIÓN 2: El Mapa como Fin en Sí Mismo ("Horrendogramas").** Queda prohibido poner al mapa geográfico en el centro de la experiencia de usuario o desplegar marañas de capas ininteligibles que paralicen la toma de decisiones.
3. 🚫 **PROHIBICIÓN 3: El Triángulo de Hierro de la Evaluación.** Queda prohibido evaluar intervenciones territoriales reduciéndolas al cumplimiento rígido de costo, plazo e indicadores fijos, ignorando la adaptación al contexto.
4. 🚫 **PROHIBICIÓN 4: La Neutralidad Valorativa Ficticia.** Queda prohibido presentar datos de concentración económica o impacto ambiental sin aplicar los Juicios de Frontera (CSH de Ulrich), explicitando quién se beneficia, quién asume los costos y qué alternativas normativas existen ("Es" vs. "Debería ser").
5. 🚫 **PROHIBICIÓN 5: La Deshumanización Médica en Salud.** Queda prohibido reducir la gestión hospitalaria del HRC a producción de camas o trámites burocráticos, ignorando las dimensiones relacionales, el agotamiento del personal y el desarraigo de los pacientes rurales.
6. 🚫 **PROHIBICIÓN 6: La Exigencia de Contrafácticos Mecanicistas.** Queda prohibido desestimar la evaluación de programas territoriales por no poseer un grupo de control de laboratorio, adoptando en su lugar la Teoría de Cambio Basada en Sistemas y la Evaluación Realista.

---

### 6. Hoja de Ruta para el Rediseño de la Plataforma de Aysén

1. **Fase 1: Mapeo Relacional de Datos y Limpieza de Esquemas:** Consolidar el archivo unificado de relaciones cruzando las tablas de `BBDD - Sheet1.pdf`, las 10 comunas, los 12 holdings / 42 RUTs, los proyectos SEIA y los registros de salud del HRC.
2. **Fase 2: Prototipado del Escritorio Relacional (Lienzo Causal + Sankey):** Reemplazar la jerarquía de Leaflet en la web, dejando un contenedor principal de visualización de redes (utilizando bibliotecas como Cytoscape.js, D3.js o Vis.js) y confinando el mapa a un panel contextual colapsable.
3. **Fase 3: Implementación de Módulos de Submapas (Upstream/Downstream):** Habilitar las consultas interactivas para que al hacer clic en cualquier variable (ej. Dependencia FCM o Camas HRC) se ilumine instantáneamente su cuenca causal.
4. **Fase 4: Despliegue de los Torneos de Superforecasting 2030-2035:** Integrar las preguntas de bifurcación multivariables en la interfaz pública para abrir el torneo territorial de predicción prospectiva.
""")

content_str = "\n".join(doc_lines)
with open(target_md, "w", encoding="utf-8") as fp:
    fp.write(content_str)

print(f"Documento generado exitosamente en: {target_md}")
print(f"Total líneas: {len(doc_lines)} | Total caracteres: {len(content_str)}")
