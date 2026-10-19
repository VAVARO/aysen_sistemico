# Visualizador de Sistemas Complejos (CECAN 16)

## Planteamiento del Problema
¿Cómo transformar las 16 propiedades estáticas del documento *The Visual Representation of Complexity* (`CECANV.4.pdf`) en una pieza visual e interactiva en 3D con estética *Swiss Paper / Museo*, donde cualquier persona pueda explorar y manipular cómo se comporta un sistema complejo sin ruido visual, sin jerga inventada y sin patrones genéricos ("AI slop")?

## Dirección Acordada
1. **Vista Inicial (Matriz 4×4 Silenciosa):**
   Cuadrícula limpia sobre papel marfil/piedra (`#F5F3EE`) con líneas divisorias capilares (`1px solid #E2DFD7`). Cada celda contiene únicamente el número (`01`–`16`), el nombre de la propiedad y su figura geométrica viva en movimiento sutil. Sin párrafos, sin etiquetas accesorias ("badges/pills"), sin íconos decorativos ni emojis.
2. **Vista de Propiedad (65% Lienzo 3D / 35% Texto CECAN):**
   Al seleccionar una propiedad, la vista pasa al escenario interactivo:
   - **Lienzo 3D (65%):** Un único conjunto de nodos, trazos y malla tridimensional que se reconfigura de forma continua al cambiar entre propiedades y responde directamente al cursor (rotación suave y perturbación directa sobre la figura).
   - **Columna Editorial (35%):** Muestra únicamente el título, la definición, la lista de *Examples* (donde hacer clic en cada ejemplo ajusta los parámetros físicos de la figura 3D para reflejar ese caso) y los *Learning Points* del documento original, con selector `ES / EN`.

## Reglas Estrictas Anti-AI-Slop
- Cero emojis, cero "badges" o "pills" redondeados de colores, cero "eyebrows" grandilocuentes (nada de *"INTERACTIVE COMPLEXITY ENGINE"* o *"MODO LABORATORIO"*).
- Tipografía sobria de catálogo de museo / diseño editorial suizo: jerarquía dada por tamaño, peso y espaciado, no por cajas ni gradientes.
- Solo el texto exacto de `CECANV.4.pdf` (en español e inglés original).

## Alcance del Prototipo Inicial (PoC)
Probar el diseño, la transición desde la grilla y el motor 3D continuo con **4 propiedades representativas** de las distintas geometrías del documento antes de completar las 16:
- `01. Feedback` (Bucles reforzador y regulador)
- `04. Levers and hubs` (Red con nodo central y colapso en cascada)
- `06. Domains of stability` (Paisaje 3D con cuencas de atracción y esfera)
- `08. Path dependency` (Árbol de bifurcaciones secuenciales)
