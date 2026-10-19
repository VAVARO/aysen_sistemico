# MASTER DATA CONTRACT — Repositorio Sistémico de Aysén

> **REGLA ESTRICTA DE AHORRO DE TOKENS PARA AGENTES Y MODELOS EJECUTORES:**
> 1. **PROHIBIDO** leer `mapa_territorial.html`, `index.html`, `data/series_prospectivas.json` o la carpeta `.agents/`. Esos archivos son grandes y no se necesitan para construir la base de datos local.
> 2. Lee **únicamente** este archivo (`docs/handoff/MASTER_DATA_CONTRACT.md`) y el archivo `docs/handoff/WP_0X_*.md` que se te haya asignado.
> 3. Tu único entregable es:
>    - Un script de extracción reproducible en `scripts/ingesta/wp_0X_*.py` (usando Python 3.11 estándar).
>    - Los archivos crudos descargados en `data/raw/<dominio>/`.
>    - El archivo JSON normalizado en `data/systemic/0X_*.json` (y su par CSV UTF-8 BOM).
>    - Ejecutar `uv run python scripts/validate_data_lake.py --wp WP_0X` hasta que devuelva `100% PASS`.

---

## 1. Diccionario Maestro de las 10 Comunas de Aysén (Llaves Obligatorias)

Todo registro comunal en cualquier archivo de `data/systemic/*.json` **DEBE** incluir exactamente estas llaves identificadoras:

| `codigo_comuna` | `comuna_ine` | `nombre_comuna` | `provincia` | `cabecera` | `codigo_cuenca` | `lat` (Cabecera) | `lng` (Cabecera) | Población Censo 2024 |
|---|---|---|---|---|---|---|---|---|
| `CL-XI-01` | `11101` | `Coyhaique` | `Coyhaique` | `Coyhaique` | `113` | `-45.5712` | `-72.0685` | `57823` |
| `CL-XI-02` | `11102` | `Lago Verde` | `Coyhaique` | `Lago Verde` | `111` | `-44.2410` | `-71.8465` | `779` |
| `CL-XI-03` | `11201` | `Aysén` | `Aysén` | `Puerto Aysén` | `113` | `-45.4050` | `-72.6930` | `23170` |
| `CL-XI-04` | `11202` | `Cisnes` | `Aysén` | `Puerto Cisnes` | `112` | `-44.7430` | `-72.6990` | `5137` |
| `CL-XI-05` | `11203` | `Guaitecas` | `Aysén` | `Melinka` | `110` | `-43.8960` | `-73.7480` | `1598` |
| `CL-XI-06` | `11401` | `Chile Chico` | `General Carrera` | `Chile Chico` | `115` | `-46.5410` | `-71.7220` | `4905` |
| `CL-XI-07` | `11402` | `Río Ibáñez` | `General Carrera` | `Puerto Ingeniero Ibáñez` | `113` | `-46.2910` | `-71.9360` | `2723` |
| `CL-XI-08` | `11301` | `Cochrane` | `Capitán Prat` | `Cochrane` | `115` | `-47.2540` | `-72.5710` | `3458` |
| `CL-XI-09` | `11302` | `O'Higgins` | `Capitán Prat` | `Villa O'Higgins` | `117` | `-48.4680` | `-72.5600` | `647` |
| `CL-XI-10` | `11303` | `Tortel` | `Capitán Prat` | `Caleta Tortel` | `115` | `-47.7950` | `-73.5350` | `505` |

- **Para datos de alcance regional general**: usar `codigo_comuna: "CL-XI-REG"`, `comuna_ine: "regional"`.
- **Polígono Geográfico (Bounding Box) estricto de Aysén**:
  - `lat` en `[-49.3, -43.6]`
  - `lng` en `[-75.8, -71.0]`

---

## 2. Estructura Estándar de Todo Archivo en `data/systemic/0X_*.json`

Cada archivo generado en `data/systemic/` debe respetar esta envoltura superior:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "version": "1.0.0",
  "work_package": "WP_0X",
  "dataset_id": "nombre_snake_case",
  "titulo": "Título descriptivo del dominio sistémico",
  "region": "Aysén del General Carlos Ibáñez del Campo (CL-XI)",
  "fecha_extraccion": "YYYY-MM-DDTHH:MM:SSZ",
  "fuentes_primarias": [
    {
      "institucion": "Nombre Institución",
      "sistema": "SINIM / SEIA / CNE / SUBPESCA / BCN",
      "url_origen": "https://...",
      "metodo_extraccion": "API REST / ArcGIS GeoJSON / Descarga Tabulado Oficial",
      "archivo_raw_local": "data/raw/..."
    }
  ],
  "resumen_regional": { ... },
  "por_comuna": [
    {
      "codigo_comuna": "CL-XI-01",
      "comuna_ine": "11101",
      "nombre_comuna": "Coyhaique",
      "provincia": "Coyhaique",
      "codigo_cuenca": "113",
      "lat": -45.5712,
      "lng": -72.0685,
      "source_url": "https://...",
      "datos": { ... }
    }
  ],
  "nodos_georreferenciados": [
    {
      "id": "identificador_unico",
      "nombre": "Nombre de la planta / proyecto / concesión / antena",
      "tipo": "Categoría",
      "codigo_comuna": "CL-XI-01",
      "comuna_ine": "11101",
      "lat": -45.5712,
      "lng": -72.0685,
      "atributos": { ... },
      "source_url": "https://..."
    }
  ]
}
```

---

## 3. Reglas Inquebrantables de Calidad de Datos

1. **Prohibido inventar datos (Cero Alucinación)**:
   - Si una API pública requiere token privado o está caída en el momento de ejecución, el script debe guardar el estado HTTP en `data/raw/` y poblar con los datos oficiales verificados de los catastros/reportes públicos (BCN, SINIM, CNE, SEA, SUBPESCA, INE), citando siempre el año exacto del dato y su `source_url` verificable.
2. **Trazabilidad para Investigación Externa (`source_url`)**:
   - Cada comuna y cada nodo importante debe tener un campo `source_url` real que permita a un investigador humano abrir la fuente primaria en su navegador con 1 clic.
3. **Cobertura Comunal 10/10**:
   - La lista `por_comuna` debe contener **siempre las 10 comunas de Aysén** (`11101` a `11303`), sin omitir comunas pequeñas como Lago Verde, Guaitecas, Tortel u O'Higgins.
4. **Exportación Dual (JSON + CSV Excel UTF-8 BOM)**:
   - Al correr `uv run python scripts/validate_data_lake.py --wp WP_0X`, el validador verificará el JSON y generará automáticamente los archivos `.csv` con cabecera `\uFEFF` (UTF-8 BOM) en `data/systemic/csv/` listos para abrir en Microsoft Excel.
