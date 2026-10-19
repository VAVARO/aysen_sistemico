# WP_02: Energía, Sistemas Aislados, Combustibles y Telecomunicaciones

## 📋 Prompt de Traspaso (Copiar y pegar en un modelo económico / nueva sesión)

```text
Ejecuta el paquete de trabajo WP_02 para el repositorio de Aysén.
REGLA DE TOKENS: NO leas mapa_territorial.html, index.html, data/series_prospectivas.json ni la carpeta .agents/.
Lee ÚNICAMENTE:
1. docs/handoff/MASTER_DATA_CONTRACT.md
2. docs/handoff/WP_02_ENERGIA_TELECOM.md

Tu tarea:
1. Crear y ejecutar el script `scripts/ingesta/wp_02_energia_telecom.py` en Python 3.11 estándar.
2. Descargar / guardar respaldos crudos en `data/raw/energia_telecom/` (API CNE Combustibles y Generación, Catastro de Centrales Eléctricas de Aysén, Sistemas Medianos y Aislados Edelaysen, y Nodos Fibra Óptica Austral / Antenas SUBTEL).
3. Generar `data/systemic/02_energia_combustibles_telecom.json` con las 10 comunas (`11101` a `11303`) y al menos 16 nodos georreferenciados (centrales hidroeléctricas, eólicas, diésel aisladas, subestaciones, servicentros y nodos troncales FOA).
4. Ejecutar `uv run python scripts/validate_data_lake.py --wp WP_02` hasta obtener `100% PASS`.
```

---

## 1. Fuentes Oficiales y Endpoints a Consultar / Almacenar en `data/raw/energia_telecom/`

1. **Comisión Nacional de Energía (CNE) & Energía Abierta**:
   - API Combustibles Vehiculares y GLP/Leña Región 11: `https://api.cne.cl/v3/combustibles/vehicular/estaciones?region=11` y `https://www.bencinaenlinea.cl`
   - Portal de Datos Abiertos CNE: `http://datos.energiaabierta.cl/` y `https://www.cne.cl/estadisticas/electricidad/`
   - **Sistemas Eléctricos Medianos (SSMM) y Aislados de Aysén (Edelaysen / Grupo Saesa y Cooperativas/Municipales)**:
     - *Sistema Mediano de Aysén (SMA)*: Conecta Coyhaique, Puerto Aysén, Puerto Chacabuco, Mañihuales, Villa Ortega, El Blanco, Balmaceda, Puerto Ibáñez y Cerro Castillo.
     - *Sistema Mediano General Carrera (SMGC)*: Conecta Chile Chico, Guadal, Mallín Grande, Puerto Bertrand y Cochrane.
     - *Sistema Mediano Palena / La Junta*: Sector norte (Cisnes / La Junta / Puyuhuapi / Lago Verde).
     - *Sistemas Aislados Insulares y Australes (Autoproducción / Municipal / Diésel-Minihidro)*: Melinka (Guaitecas), Islas Huichas (Puerto Aguirre / Caleta Andrade / Estero Copa), Caleta Tortel, Villa O'Higgins (Central Río Mosco / Diésel).
2. **Catastro Georreferenciado de Centrales de Generación en Aysén**:
   - Central Hidroeléctrica Río Aysén / Cabo Juan Román / Lago Atravesado / Río Mañihuales / Los Maquis (Guadal) / Río Azul / Río Mosco (O'Higgins).
   - Parques Eólicos: Alto Baguales (Coyhaique), Parque Eólico La Cabaña / Chile Chico.
   - Centrales Térmicas Diésel (respaldo y sistemas insulares): Tehuelche (Coyhaique), Chacabuco, Chile Chico, Cochrane, Melinka, Puerto Aguirre, Puerto Cisnes, La Junta, Caleta Tortel.
3. **SUBTEL (Subsecretaría de Telecomunicaciones) — Fibra Óptica Austral (FOA) y Cobertura Móvil**:
   - Portal Estadístico SUBTEL: `https://www.subtel.gob.cl/estudios-y-estadisticas/`
   - **Fibra Óptica Austral (FOA)**: Troncal submarino (Quellón - Melinka - Puerto Cisnes - Puerto Aguirre - Puerto Chacabuco - Caleta Tortel) y Troncal Terrestre (Balmaceda - Coyhaique - Cerro Castillo - Río Tranquilo - Cochrane - Chile Chico - Puerto Ibáñez).

---

## 2. Esquema Requerido por Comuna en `data/systemic/02_energia_combustibles_telecom.json`

Dentro de cada elemento de `por_comuna[i].datos`, incluir obligatoriamente los 3 bloques exigidos por `validate_data_lake.py`:

```json
"datos": {
  "sistema_electrico": {
    "subsistema_nombre": "Sistema Mediano de Aysén (Edelaysen)",
    "tipo_red": "Sistema Mediano / Sistema Aislado Insular",
    "operador_distribucion": "Edelaysen / Municipalidad",
    "potencia_instalada_comunal_mw": 34.5,
    "matriz_fuentes": ["Hidroeléctrica de pasada", "Eólica", "Diésel de respaldo"],
    "vulnerabilidad_suministro": "Baja / Media / Alta (Dependencia de barcaza de diésel)",
    "matriz_calefaccion_hogar_lena_pct": 86.0
  },
  "combustibles": {
    "estaciones_servicio_cantidad": 8,
    "gasolina_93_clp_litro": 1390,
    "diesel_clp_litro": 1140,
    "sobrecosto_vs_santiago_pct": 11.5,
    "precio_m3_lena_seca_clp": 48000,
    "abastecimiento_logistico": "Planta Chacabuco / Camión cisterna Ruta 7 / Barcaza subsidiada"
  },
  "telecomunicaciones": {
    "conectado_fibra_optica_austral_foa": true,
    "tipo_enlace_troncal": "FOA Terrestre / FOA Submarina / Microondas-Satelital",
    "operadores_moviles_4g_5g": ["Entel", "Movistar", "WOM"],
    "localidades_con_brecha_digital": ["Lago Atravesado", "Arroyo El Gato"]
  }
}
```

## 3. Nodos Georreferenciados Mínimos (`nodos_georreferenciados`)
Al menos **16 nodos** dentro del Bounding Box de Aysén:
- Principales centrales eléctricas (Alto Baguales, Tehuelche, Lago Atravesado, Mañihuales, Los Maquis en Guadal, Central Hidro Río Mosco en Villa O'Higgins, Central Diésel Melinka, Central Puerto Aguirre, Central Tortel, Central Cochrane).
- Nodos de aterrizaje submarino y terrestre de la Fibra Óptica Austral (FOA Melinka, FOA Puerto Aguirre, FOA Chacabuco, FOA Tortel, FOA Cochrane, FOA Chile Chico).
