# Especificación de Diseño: Experiencia de Usuario y Modelo Relacional de Aysén

## Problema a Resolver (How Might We)
¿Cómo transformar el visor de Aysén desde una maqueta promocional hacia una herramienta de investigación real, simple y personalizada, que reciba al usuario preguntándole qué busca, le muestre solo lo relevante para su consulta conectado con su contexto territorial, e incluya un esquema interactivo de relaciones entre bases de datos (estilo Modelo de Tablas de Power BI) para entender cómo se cruzan las variables de la región?

## Dirección Recomendada
1. **Asistente Inicial "¿Qué estás buscando en Aysén?" (Árbol guiado de 2 pasos + Buscador directo de RUTs/empresas/comunas)**:
   - Permite entrar por 5 intenciones claras: (1) Mirar o comparar comunas, (2) Investigar empresas, RUTs salmoneros, inversiones SEIA y poder político, (3) Revisar energía, conectividad y servicios básicos, (4) Analizar agua, clima, riesgos y proyecciones 2030–2035, (5) Explorar el modelo de relaciones entre bases de datos y descargar cruces.
2. **Vista Personalizada Simple y Conectada**:
   - Muestra en el mapa y en el panel lateral/expandible únicamente las capas que responden a la búsqueda del usuario, acompañadas de un bloque de **"Datos relacionados en este lugar"** que cruza automáticamente alcaldes/presupuesto SINIM, sistema eléctrico, salud/conectividad e inversión SEIA para la comuna o nodo seleccionado.
3. **Vista Interactiva "Relaciones de Datos (Modelo estilo Power BI)"**:
   - Un diagrama visual de cajas que representa las 8 tablas del Data Lake (`data/comunas_aysen.json`, `data/series_prospectivas.json` y `data/systemic/01..05_*.json`), sus campos y las líneas que las conectan indicando explícitamente la llave de unión (`comuna_ine`, `codigo_cuenca`, `codigo_barrio_acs`, `holding_id` / `rut`).
   - Al hacer clic en dos o más tablas o en una llave de unión, genera en vivo la tabla combinada (`JOIN`) abajo y permite exportarla a Excel (CSV UTF-8 BOM).

## Supuestos Clave a Validar
- [x] Los 5 datasets de `data/systemic/` comparten el 100% de las llaves `comuna_ine` (`11101`..`11303`) y `codigo_comuna` (`CL-XI-01`..`10`), lo que permite hacer joins instantáneos en el navegador sin servidor.
- [ ] El usuario puede saltar en cualquier momento entre su Vista Personalizada, el Asistente de búsqueda y el Modelo de Tablas estilo Power BI con un solo clic.
- [ ] Todos los IDs del DOM contractuales existentes en `mapa_territorial.html` se preservan para mantener 100% en verde las suites `test_fuentes_integridad.py`, `verify_m1_editorial.py` y `test_e2e_requirements.py`.

## No Haremos (Not Doing List)
- **Nada de nombres artificiales tipo IA**: Prohibidos términos como "Espejo de Eslabones", "Workbench Cognitivo", "Auditoría Agéntica en Vivo".
- **No saturar la pantalla inicial con todas las capas encendidas**: El mapa parte limpio según la elección del usuario.
- **No duplicar megabytes de JSON dentro del HTML**: Se consumen los archivos de `data/systemic/*.json` de forma modular.
