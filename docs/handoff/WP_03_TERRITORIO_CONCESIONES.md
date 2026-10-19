# WP_03: Control del Territorio y Mar (Concesiones Acuícolas, Mineras y Tenencia de Tierra)

## 📋 Prompt de Traspaso (Copiar y pegar en un modelo económico / nueva sesión)

```text
Ejecuta el paquete de trabajo WP_03 para el repositorio de Aysén.
REGLA DE TOKENS: NO leas mapa_territorial.html, index.html, data/series_prospectivas.json ni la carpeta .agents/.
Lee ÚNICAMENTE:
1. docs/handoff/MASTER_DATA_CONTRACT.md
2. docs/handoff/WP_03_TERRITORIO_CONCESIONES.md

Tu tarea:
1. Crear y ejecutar el script `scripts/ingesta/wp_03_territorio_concesiones.py` en Python 3.11 estándar.
2. Descargar / guardar respaldos crudos en `data/raw/territorio_concesiones/` (SUBPESCA Concesiones de Acuicultura y Barrios ACS, SERNAGEOMIN Catastro Minero y Faenas en General Carrera/Coyhaique/Cisnes, SERNAPESCA Caletas y Desembarques, CONAF SNASPE, Bienes Nacionales Tierra Fiscal y Matriz de Holdings Salmoneros y RUTs).
3. Generar `data/systemic/03_concesiones_tierra_mar.json` con las 10 comunas (`11101` a `11303`) y al menos 18 nodos georreferenciados (Agrupaciones de Concesiones ACS, centros emblemáticos con RUT/Holding, caletas pesqueras artesanales, faenas/distritos mineros y parques nacionales/tierras fiscales).
4. Generar tabla de trazabilidad societaria en `data/systemic/csv/03_holdings_salmoneros_ruts_aysen.csv` con UTF-8 BOM.
5. Ejecutar `& "C:\Users\alvar\.local\bin\python3.11.exe" scripts/validate_data_lake.py --wp WP_03` hasta obtener `100% PASS`.
```

---

## 1. Fuentes Oficiales y Endpoints a Consultar / Almacenar en `data/raw/territorio_concesiones/`

1. **SUBPESCA / SERNAPESCA — Concesiones de Acuicultura, Barrios ACS y Caletas Artesanales**:
   - Visor y MapServer SUBPESCA: `https://mapas.subpesca.cl/ide/rest/services/` y `https://www.subpesca.cl/portal/619/w3-propertyvalue-50830.html`
   - Anuarios y Boletines SERNAPESCA (745 concesiones otorgadas en Aysén concentradas en las comunas de **Aysén, Cisnes y Guaitecas**, distribuidas en Barrios ACS 18A a 35).
   - **Caletas Pesqueras Artesanales y AMERB** (Melinka, Repollal, Puerto Aguirre, Caleta Andrade, Estero Copa, Puerto Cisnes, Puerto Gala, Puerto Gaviota, Puerto Raúl Marín Balmaceda, Puerto Chacabuco, Caleta Tortel): especies principales (erizo, luga, loco, merluza austral, congrio dorado).
2. **SUBPESCA / CMF / SERNAPESCA / SII — Matriz de Inteligencia Corporativa y RUTs de Concesiones**:
   - Respaldo crudo dedicado: `data/raw/territorio_concesiones/holdings_salmoneros_ruts_aysen.json`.
   - Mapeo de grupos controladores (Holdings matrices) versus razones sociales filiales y RUTs inscritos en SUBPESCA.
   - En Aysén las ~745 concesiones están formalmente inscritas bajo decenas de RUTs distintos resultantes de fusiones y adquisiciones históricas, pero son controladas por **12 grupos empresariales principales** (Top 3 concentra 51.7% y Top 5 concentra 70.1%).
3. **SERNAGEOMIN — Catastro de Concesiones Mineras y Faenas en Aysén**:
   - Catastro Minero Online / Anuario de la Minería de Chile (`https://www.sernageomin.cl/anuario-de-la-mineria-de-chile/` y `https://catastrominero.sernageomin.cl/`).
   - Polos mineros históricos y activos en Aysén:
     - **Mina El Toqui** (Mañihuales / Comuna de Coyhaique-Aysén: zinc, plomo, oro, plata).
     - **Distrito Cerro Bayo / Laguna Verde y Fachinal** (Comuna de Chile Chico: oro y plata, exploración y planes de cierre/reactivación).
     - **Mina Silva / Puerto Cristal** (Lago General Carrera, Comuna de Río Ibáñez: patrimonio e historial polimetálico) y **Katterfeld / Ñirehuao**.
4. **CONAF, Bienes Nacionales y SAG — Tenencia de la Tierra en Aysén**:
   - IDE Bienes Nacionales (`https://ide.bienes.cl/`) y Catastro SNASPE CONAF (`https://www.conaf.cl/parques-nacionales/`):
     - Aysén tiene ~10,8 millones de hectáreas; más del **50% es SNASPE (Parques y Reservas Nacionales)**, cerca del **25% es propiedad fiscal adicional de Bienes Nacionales / Campos de Hielo**, y solo una fracción es propiedad privada agrícola/ganadera o sujeta a subdivisión predial rústica (DL 3.516 SAG).

---

## 2. Esquema Requerido por Comuna en `data/systemic/03_concesiones_tierra_mar.json`

Dentro de cada elemento de `por_comuna[i].datos`, incluir obligatoriamente los 3 bloques exigidos por `validate_data_lake.py`:

```json
"datos": {
  "concesiones_acuicolas": {
    "aplica_borde_costero_maritimo": true,
    "concesiones_otorgadas_total": 412,
    "centros_operativos_activos": 135,
    "barrios_acs_presentes": ["ACS-21A", "ACS-21B", "ACS-24"],
    "caletas_pesqueras_artesanales": ["Puerto Aguirre", "Caleta Andrade", "Puerto Chacabuco"],
    "desembarque_artesanal_ton_anual": 4850,
    "holdings_controladores_y_ruts": [
      {
        "holding_id": "holding_aquachile",
        "nombre_fantasia": "AquaChile",
        "empresa_madre": "Agrosuper S.A.",
        "pais_matriz": "Chile",
        "concesiones_estimadas_en_comuna": 125,
        "barrios_acs_locales": ["ACS-21A", "ACS-21B", "ACS-22A", "ACS-22B", "ACS-24", "ACS-25"],
        "filiales_activas": [
          {"razon_social": "Empresas AquaChile S.A.", "rut": "86.247.400-7"},
          {"razon_social": "Exportadora Los Fiordos Limitada", "rut": "79.872.420-7"},
          {"razon_social": "AquaChile Maullín Limitada", "rut": "79.728.530-7"},
          {"razon_social": "Aguas Claras S.A.", "rut": "96.509.550-0"},
          {"razon_social": "Salmones Chiloé S.A.", "rut": "96.535.920-6"}
        ]
      }
    ]
  },
  "concesiones_mineras": {
    "concesiones_explotacion_vigentes": 42,
    "concesiones_exploracion_vigentes": 68,
    "superficie_minera_ha": 28400,
    "yacimientos_o_distritos_principales": ["El Toqui (sector norte)"],
    "minerales_interes": ["Zinc", "Oro", "Plata", "Plomo"],
    "nivel_actividad_minera": "Media / Histórica / Exploración / Nula"
  },
  "tenencia_tierra_conservacion": {
    "superficie_comunal_ha": 2979640,
    "snaspe_conaf_pct": 63.4,
    "tierra_fiscal_bienes_nacionales_pct": 24.0,
    "propiedad_privada_y_subdivision_pct": 12.6,
    "presion_parcelacion_rural_sag": "Alta en valles fluviales / Baja en zona insular",
    "unidades_conservacion": ["Parque Nacional Laguna San Rafael", "Reserva Nacional Las Guaitecas"]
  }
}
```

---

## 3. Nodos Georreferenciados Mínimos (`nodos_georreferenciados`)

Al menos **18 nodos** dentro del Bounding Box de Aysén (`[-49.3, -43.6]`, `[-75.8, -71.0]`):
- Agrupaciones de Concesiones de Salmónidos (ACS) en Guaitecas (ACS-17), Canal Puyuhuapi (ACS-18A), Canal Jacaf (ACS-19A), Canal Moraleda (ACS-21A), Fiordo Aysén (ACS-22A) y Estero Quitralco (ACS-24), con indicación de holdings y RUTs principales.
- Centros de Cultivo y Plantas Emblemáticas georreferenciadas con Holding + Empresa Madre + Razón Social + RUT titular:
  * Planta Chacabuco AquaChile (RUT 86.247.400-7 / Agrosuper)
  * Centro Cupquelán Cooke Aquaculture (RUT 96.926.970-8 / Cooke Inc. Canadá)
  * Centro Isla Melchor Mowi Chile (RUT 96.633.780-K / Mowi ASA Noruega)
  * Centro Canal Jacaf Camanchaca (RUT 76.065.596-1 / Fiordo Blanco RUT 96.540.710-3)
  * Centro Puyuhuapi Blumar (RUT 76.653.690-5 / Ice Val RUT 78.587.260-6)
  * Centro Melinka / Gran Guaiteca Yadrán (RUT 96.550.920-8 / Yadran Cultivos Marinos RUT 96.549.610-6)
  * Centro Canal Moraleda Multi X (RUT 79.891.160-0 / Multiexport Foods RUT 76.672.100-1)
  * Centro Canal Errázuriz Cermaq (RUT 79.784.980-4 / Mitsubishi Corporation)
  * Planta Chacabuco Salmones Antártica (RUT 86.100.500-3 / Nissui Japón)
  * Centro Jacaf Poniente Australis Mar (RUT 76.003.885-7 / Joyvio Food China)
  * Centro Moraleda Sur Invermar (RUT 79.797.990-2 / Alimar)
  * Centro Seno Gala Salmones Austral (RUT 79.559.220-2 / Trusal RUT 96.566.740-7)
- Caletas Pesqueras Artesanales clave (Melinka, Puerto Gala, Puerto Gaviota, Puerto Aguirre, Puerto Cisnes, Caleta Tortel).
- Yacimientos y distritos mineros (Mina El Toqui, Distrito Cerro Bayo, Fachinal, Puerto Cristal).
- Parques Nacionales y Polígonos Fiscales Estratégicos (PN Queulat, PN Cerro Castillo, PN Patagonia, PN Laguna San Rafael, PN Bernardo O'Higgins).

---

## 4. Matriz de Inteligencia Corporativa: Holdings Salmoneros y RUTs en Aysén

Exportación dual en `data/systemic/csv/03_holdings_salmoneros_ruts_aysen.csv` (UTF-8 BOM `\uFEFF` para Excel):

| Holding / Nombre Fantasía | Empresa Madre Controladora | País Matriz | Concesiones Aysén (Est.) | % Reg. | Razones Sociales Filiales y RUTs Operativos en Aysén |
|---|---|---|---|---|---|
| **AquaChile** | Agrosuper S.A. (Familia Vial) | Chile | 210 | 28.2% | Empresas AquaChile S.A. (`86.247.400-7`), Exportadora Los Fiordos Ltda. (`79.872.420-7`), AquaChile Maullín Ltda. (`79.728.530-7`), Aguas Claras S.A. (`96.509.550-0`), Salmones Chiloé S.A. (`96.535.920-6`), AquaChile Magallanes SpA (`78.754.560-2`), AquaChile SpA (`76.852.140-9`) |
| **Mowi Chile** | Mowi ASA (Bergen) | Noruega | 95 | 12.8% | Mowi Chile S.A. (ex Marine Harvest Chile S.A., `96.633.780-K`) |
| **Multi X** | Multiexport Foods S.A. / Mitsui / Cargill | Chile / Japón / EE.UU. | 80 | 10.7% | Multiexport Foods S.A. (`76.672.100-1`), Multi X S.A. / Salmones Multiexport (`79.891.160-0`), Multiexport Patagonia S.A. (`76.769.420-2`), Soc. Inv. Isla Victoria Ltda. (`76.004.634-5`), Multiexport Pacific Farms S.A. (`76.259.377-7`) |
| **Cermaq Chile** | Mitsubishi Corporation | Japón | 75 | 10.1% | Cermaq Chile S.A. / Cultivos Marinos Chiloé (`79.784.980-4`), Mainstream Chile S.A. (`77.424.630-4`), Salmones Andes S.A. (`96.502.180-9`) |
| **Cooke Aquaculture** | Cooke Inc. (New Brunswick) | Canadá | 26 | 3.5% | Cooke Aquaculture Chile S.A. (ex Salmones Cupquelán S.A., `96.926.970-8`) |
| **Salmones Blumar** | Blumar S.A. (Yaconi-Santa Cruz / Sarquis) | Chile | 62 | 8.3% | Blumar S.A. (`80.860.400-0`), Salmones Blumar S.A. (`76.653.690-5`), Salmones Ice Val Ltda. (`78.587.260-6`), Inversiones Ice-Val Ltda. (`78.795.440-3`), Salmones Blumar Magallanes SpA (`76.794.340-7`) |
| **Australis Seafoods** | Joyvio Food Co. / Legend Holdings | China | 58 | 7.8% | Australis Seafoods S.A. (`76.012.392-7`), Australis Mar S.A. (`76.003.885-7`), Acuícola Cordillera Ltda. (`76.787.060-4`), Salmones Islas del Sur Ltda. (`76.787.110-4`), Landcatch Chile S.A. (`76.090.483-K`) |
| **Salmones Camanchaca** | Cía. Pesquera Camanchaca S.A. | Chile | 48 | 6.4% | Cía. Pesquera Camanchaca S.A. (`93.711.000-6`), Salmones Camanchaca S.A. (`76.065.596-1`), Fiordo Blanco S.A. (`96.540.710-3`) |
| **Invermar** | Alimentos Marinos S.A. (Alimar / Izquierdo) | Chile | 36 | 4.8% | Invermar S.A. (`79.797.990-2`), Salmones Froward Ltda. (`76.140.476-8`), Cultivos Marinos Lago Yelcho SpA (`76.749.470-K`) |
| **Salmones Yadrán** | Pesquera Yadrán S.A. (Familia Briones) | Chile | 40 | 5.4% | Pesquera Yadrán S.A. (`82.975.200-K`), Cultivos Yadrán S.A. (`96.550.920-8`), Yadran Cultivos Marinos S.A. (`96.549.610-6`), Yadrán Cisnes S.A. (`96.883.350-2`) |
| **Salmones Austral** | Salmones Austral S.A. (Navarro / Hurtado / Puchi) | Chile | 34 | 4.6% | Salmones Austral S.A. (`76.296.099-0`), Trusal S.A. (`96.566.740-7`), Salmones Pacific Star S.A. (`79.559.220-2`) |
| **Salmones Antártica** | Nippon Suisan Kaisha Ltd. (Nissui) | Japón | 28 | 3.8% | Salmones Antártica S.A. (`86.100.500-3`) |
| **Otros Menores** | Titulares Independientes / Artesanales | Chile | 19 | 2.6% | Concesionarios individuales y en descanso sanitario prolongado (`77.102.390-8` y otros) |
| **TOTAL REGIONAL** | **12 Holdings + Titulares Menores** | — | **745** | **100.0%** | **42 razones sociales y RUTs mapeados con trazabilidad a Empresa Madre** |
