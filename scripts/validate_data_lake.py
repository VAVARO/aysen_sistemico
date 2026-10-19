#!/usr/bin/env python3
"""
Validador Automático y Generador CSV del Data Lake Sistémico de Aysén
=====================================================================
Verifica que cualquier paquete de trabajo (WP_01 a WP_05) ejecutado por
un modelo o script cumpla estrictamente con `docs/handoff/MASTER_DATA_CONTRACT.md`:
  1. Existencia de respaldos crudos en `data/raw/<dominio>/`
  2. Esquema JSON válido en `data/systemic/0X_*.json`
  3. Cobertura exacta de las 10 comunas oficiales de Aysén (11101..11303)
  4. Cero valores nulos en llaves estructurales y presencia de `source_url`
  5. Todos los `nodos_georreferenciados` dentro del Bounding Box de Aysén
     Lat [-49.3, -43.6], Lng [-75.8, -71.0]
  6. Generación automática de tablas CSV con UTF-8 BOM (`\\uFEFF`) en `data/systemic/csv/`

Uso:
  uv run python scripts/validate_data_lake.py --wp WP_01
  uv run python scripts/validate_data_lake.py --all
"""

import argparse
import csv
import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
RAW_DIR = DATA_DIR / "raw"
SYSTEMIC_DIR = DATA_DIR / "systemic"
CSV_OUT_DIR = SYSTEMIC_DIR / "csv"

BBOX_LAT_MIN = -49.3
BBOX_LAT_MAX = -43.6
BBOX_LNG_MIN = -75.8
BBOX_LNG_MAX = -71.0

EXPECTED_COMUNAS = {
    "11101": ("CL-XI-01", "Coyhaique"),
    "11102": ("CL-XI-02", "Lago Verde"),
    "11201": ("CL-XI-03", "Aysén"),
    "11202": ("CL-XI-04", "Cisnes"),
    "11203": ("CL-XI-05", "Guaitecas"),
    "11401": ("CL-XI-06", "Chile Chico"),
    "11402": ("CL-XI-07", "Río Ibáñez"),
    "11301": ("CL-XI-08", "Cochrane"),
    "11302": ("CL-XI-09", "O'Higgins"),
    "11303": ("CL-XI-10", "Tortel"),
}

WP_SPECS: Dict[str, Dict[str, Any]] = {
    "WP_01": {
        "title": "Poder Político, Autoridades y Finanzas Municipales (SINIM / BCN / SERVEL)",
        "raw_subdir": "politico_sinim",
        "json_file": "01_gob_poder_finanzas.json",
        "min_nodes": 10,
        "required_comuna_keys": ["autoridades", "finanzas_sinim", "inversion_publica"],
    },
    "WP_02": {
        "title": "Energía, Sistemas Aislados, Combustibles y Telecomunicaciones (CNE / SUBTEL)",
        "raw_subdir": "energia_telecom",
        "json_file": "02_energia_combustibles_telecom.json",
        "min_nodes": 12,
        "required_comuna_keys": ["sistema_electrico", "combustibles", "telecomunicaciones"],
    },
    "WP_03": {
        "title": "Control del Territorio y Mar: Concesiones Acuícolas, Mineras y Tierra (SUBPESCA / SERNAGEOMIN / CONAF / BBNN)",
        "raw_subdir": "territorio_concesiones",
        "json_file": "03_concesiones_tierra_mar.json",
        "min_nodes": 15,
        "required_comuna_keys": ["concesiones_acuicolas", "concesiones_mineras", "tenencia_tierra_conservacion"],
    },
    "WP_04": {
        "title": "Inversión SEIA, Estructura Empresarial SII, Empleo y Licitaciones (SEA / SII / MercadoPúblico / BCCh)",
        "raw_subdir": "inversion_economia",
        "json_file": "04_inversion_seia_economia.json",
        "min_nodes": 15,
        "required_comuna_keys": ["proyectos_seia", "estructura_empresarial_sii", "empleo_y_turismo"],
    },
    "WP_05": {
        "title": "Dinámica Social, Salud, Educación, Seguridad y Riesgos Activos (DEIS / MINEDUC / CEAD / USGS / FIRMS / IFOP)",
        "raw_subdir": "social_ambiental",
        "json_file": "05_social_salud_educacion_riesgos.json",
        "min_nodes": 15,
        "required_comuna_keys": ["salud_red_asistencial", "educacion_mineduc", "seguridad_cead", "riesgos_ambientales"],
    },
    "WP_06": {
        "title": "Turismo, Prestadores SERNATUR, ZOIT, Ocupación EMAT y Visitantes Parques SNASPE (SERNATUR / Subturismo / INE / CONAF)",
        "raw_subdir": "turismo_sernatur",
        "json_file": "06_turismo_sernatur_conaf.json",
        "min_nodes": 16,
        "required_comuna_keys": ["oferta_sernatur", "demanda_emat_visitantes", "zoit_y_atractivos"],
    },
    "WP_07": {
        "title": "Biodiversidad, Flora Nativa, Fauna en Conservación y Especies Invasoras (MMA / CONAF / SAG / IFOP)",
        "raw_subdir": "biodiversidad_mma_conaf",
        "json_file": "07_biodiversidad_flora_fauna_aysen.json",
        "min_nodes": 15,
        "required_comuna_keys": ["flora_y_formaciones_vegetacionales", "fauna_emblematica_conservacion", "especies_exoticas_invasoras"],
    },
}


def ensure_directories() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    SYSTEMIC_DIR.mkdir(parents=True, exist_ok=True)
    CSV_OUT_DIR.mkdir(parents=True, exist_ok=True)
    for spec in WP_SPECS.values():
        (RAW_DIR / spec["raw_subdir"]).mkdir(parents=True, exist_ok=True)


def flatten_dict(d: Dict[str, Any], parent_key: str = "", sep: str = "_") -> Dict[str, Any]:
    items: List[Tuple[str, Any]] = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        elif isinstance(v, list):
            if all(isinstance(x, (str, int, float, bool)) for x in v):
                items.append((new_key, " | ".join(str(x) for x in v)))
            else:
                items.append((new_key, json.dumps(v, ensure_ascii=False)))
        else:
            items.append((new_key, v))
    return dict(items)


def export_wp_to_csv(wp_id: str, data: Dict[str, Any], json_filename: str) -> List[Path]:
    """Exporta `por_comuna` y `nodos_georreferenciados` a archivos CSV UTF-8 BOM para Excel."""
    stem = Path(json_filename).stem
    generated_files: List[Path] = []

    # 1. CSV Comunal
    por_comuna = data.get("por_comuna", [])
    if por_comuna:
        flat_rows = []
        all_headers: List[str] = []
        for row in por_comuna:
            base = {
                "codigo_comuna": row.get("codigo_comuna"),
                "comuna_ine": row.get("comuna_ine"),
                "nombre_comuna": row.get("nombre_comuna"),
                "provincia": row.get("provincia"),
                "codigo_cuenca": row.get("codigo_cuenca"),
                "lat": row.get("lat"),
                "lng": row.get("lng"),
                "source_url": row.get("source_url"),
            }
            datos_flat = flatten_dict(row.get("datos", {}))
            merged = {**base, **datos_flat}
            for h in merged.keys():
                if h not in all_headers:
                    all_headers.append(h)
            flat_rows.append(merged)

        comuna_csv_path = CSV_OUT_DIR / f"{stem}_comunas.csv"
        with open(comuna_csv_path, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=all_headers)
            writer.writeheader()
            writer.writerows(flat_rows)
        generated_files.append(comuna_csv_path)

    # 2. CSV Nodos Georreferenciados
    nodos = data.get("nodos_georreferenciados", [])
    if nodos:
        flat_nodes = []
        node_headers: List[str] = []
        for n in nodos:
            base_n = {
                "id": n.get("id"),
                "nombre": n.get("nombre"),
                "tipo": n.get("tipo"),
                "codigo_comuna": n.get("codigo_comuna"),
                "comuna_ine": n.get("comuna_ine"),
                "lat": n.get("lat"),
                "lng": n.get("lng"),
                "source_url": n.get("source_url"),
            }
            attr_flat = flatten_dict(n.get("atributos", {}))
            merged_n = {**base_n, **attr_flat}
            for h in merged_n.keys():
                if h not in node_headers:
                    node_headers.append(h)
            flat_nodes.append(merged_n)

        nodes_csv_path = CSV_OUT_DIR / f"{stem}_nodos.csv"
        with open(nodes_csv_path, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=node_headers)
            writer.writeheader()
            writer.writerows(flat_nodes)
        generated_files.append(nodes_csv_path)

    return generated_files


def validate_work_package(wp_id: str) -> Tuple[bool, List[str]]:
    if wp_id not in WP_SPECS:
        return False, [f"Paquete desconocido: {wp_id}. Opciones: {list(WP_SPECS.keys())}"]

    spec = WP_SPECS[wp_id]
    errors: List[str] = []
    json_path = SYSTEMIC_DIR / spec["json_file"]
    raw_dir = RAW_DIR / spec["raw_subdir"]

    # 1. Check raw directory has files
    if not raw_dir.exists() or not any(raw_dir.iterdir()):
        errors.append(f"[{wp_id}] Carpeta cruda vacía o inexistente: {raw_dir.relative_to(REPO_ROOT)}")

    # 2. Check systemic JSON exists and is valid JSON
    if not json_path.exists():
        errors.append(f"[{wp_id}] Archivo JSON no encontrado: {json_path.relative_to(REPO_ROOT)}")
        return False, errors

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        errors.append(f"[{wp_id}] Error parseando JSON ({json_path.name}): {e}")
        return False, errors

    # 3. Top-level contract fields
    for req_field in ["version", "work_package", "dataset_id", "titulo", "fecha_extraccion", "fuentes_primarias", "por_comuna", "nodos_georreferenciados"]:
        if req_field not in data or data[req_field] is None:
            errors.append(f"[{wp_id}] Falta campo superior obligatorio: '{req_field}'")

    if data.get("work_package") != wp_id:
        errors.append(f"[{wp_id}] 'work_package' debe ser '{wp_id}', encontrado: '{data.get('work_package')}'")

    fuentes = data.get("fuentes_primarias", [])
    if not isinstance(fuentes, list) or len(fuentes) == 0:
        errors.append(f"[{wp_id}] 'fuentes_primarias' debe ser una lista no vacía.")

    # 4. Validate 10 comunas coverage
    por_comuna = data.get("por_comuna", [])
    seen_ine = set()
    if not isinstance(por_comuna, list) or len(por_comuna) != 10:
        errors.append(f"[{wp_id}] 'por_comuna' debe tener exactamente 10 comunas (encontradas: {len(por_comuna) if isinstance(por_comuna, list) else 0})")
    else:
        for c in por_comuna:
            ine = str(c.get("comuna_ine", ""))
            cod = str(c.get("codigo_comuna", ""))
            if ine not in EXPECTED_COMUNAS:
                errors.append(f"[{wp_id}] comuna_ine inválido: '{ine}'")
                continue
            seen_ine.add(ine)
            exp_cod, _ = EXPECTED_COMUNAS[ine]
            if cod != exp_cod:
                errors.append(f"[{wp_id}] codigo_comuna '{cod}' no coincide con '{exp_cod}' para INE {ine}")

            lat = c.get("lat")
            lng = c.get("lng")
            if not isinstance(lat, (int, float)) or not (BBOX_LAT_MIN <= float(lat) <= BBOX_LAT_MAX):
                errors.append(f"[{wp_id}] Comuna {ine} lat fuera de rango Aysén: {lat}")
            if not isinstance(lng, (int, float)) or not (BBOX_LNG_MIN <= float(lng) <= BBOX_LNG_MAX):
                errors.append(f"[{wp_id}] Comuna {ine} lng fuera de rango Aysén: {lng}")

            if not str(c.get("source_url", "")).startswith("http"):
                errors.append(f"[{wp_id}] Comuna {ine} sin 'source_url' HTTP válido")

            datos = c.get("datos", {})
            if not isinstance(datos, dict):
                errors.append(f"[{wp_id}] Comuna {ine} 'datos' debe ser un objeto dict")
            else:
                for req_k in spec["required_comuna_keys"]:
                    if req_k not in datos or datos[req_k] in (None, "", {}, []):
                        errors.append(f"[{wp_id}] Comuna {ine} falta bloque obligatorio datos.{req_k}")

        missing_ine = set(EXPECTED_COMUNAS.keys()) - seen_ine
        if missing_ine:
            errors.append(f"[{wp_id}] Faltan comunas INE: {sorted(missing_ine)}")

    # 5. Validate georeferenced nodes
    nodos = data.get("nodos_georreferenciados", [])
    if not isinstance(nodos, list) or len(nodos) < spec["min_nodes"]:
        errors.append(
            f"[{wp_id}] 'nodos_georreferenciados' tiene {len(nodos) if isinstance(nodos, list) else 0} nodos; mínimo requerido: {spec['min_nodes']}"
        )
    else:
        seen_ids = set()
        for idx, n in enumerate(nodos):
            nid = n.get("id")
            if not nid or nid in seen_ids:
                errors.append(f"[{wp_id}] Nodo #{idx} con id nulo o duplicado: '{nid}'")
            seen_ids.add(nid)

            lat = n.get("lat")
            lng = n.get("lng")
            if not isinstance(lat, (int, float)) or not (BBOX_LAT_MIN <= float(lat) <= BBOX_LAT_MAX):
                errors.append(f"[{wp_id}] Nodo '{nid}' lat fuera de Bounding Box Aysén: {lat}")
            if not isinstance(lng, (int, float)) or not (BBOX_LNG_MIN <= float(lng) <= BBOX_LNG_MAX):
                errors.append(f"[{wp_id}] Nodo '{nid}' lng fuera de Bounding Box Aysén: {lng}")

            if not str(n.get("source_url", "")).startswith("http"):
                errors.append(f"[{wp_id}] Nodo '{nid}' sin 'source_url' HTTP válido")

    # 6. Export CSVs if valid
    if not errors:
        csv_files = export_wp_to_csv(wp_id, data, spec["json_file"])
        print(f"  [CSV] Exportados {len(csv_files)} archivos CSV UTF-8 BOM en data/systemic/csv/")

    return len(errors) == 0, errors


def main() -> int:
    ensure_directories()
    parser = argparse.ArgumentParser(description="Validador del Data Lake Sistémico de Aysén")
    parser.add_argument("--wp", type=str, help="Validar un paquete específico (ej. WP_01)")
    parser.add_argument("--all", action="store_true", help="Validar todos los paquetes WP_01 a WP_05")
    parser.add_argument("--init-dirs", action="store_true", help="Solo inicializar la estructura de directorios")
    args = parser.parse_args()

    if args.init_dirs:
        print("[OK] Estructura de carpetas data/raw/ y data/systemic/ inicializada.")
        return 0

    targets = list(WP_SPECS.keys()) if args.all else ([args.wp.upper()] if args.wp else list(WP_SPECS.keys()))
    all_passed = True

    print("=" * 72)
    print("AUDITORÍA DE CALIDAD — DATA LAKE SISTÉMICO DE AYSÉN")
    print("=" * 72)

    for wp_id in targets:
        title = WP_SPECS.get(wp_id, {}).get("title", wp_id)
        print(f"\n-> Evaluando {wp_id}: {title}")
        ok, errs = validate_work_package(wp_id)
        if ok:
            print(f"   [PASS] {wp_id} cumple 100% del contrato (10 comunas, nodos en BBOX, CSV generado).")
        else:
            all_passed = False
            print(f"   [FAIL] {wp_id} presenta {len(errs)} observaciones:")
            for e in errs[:15]:
                print(f"      - {e}")
            if len(errs) > 15:
                print(f"      ... y {len(errs) - 15} errores adicionales.")

    print("\n" + "=" * 72)
    if all_passed:
        print("RESULTADO GLOBAL: 100% PASS")
        return 0
    else:
        print("RESULTADO GLOBAL: PENDIENTE / CON OBSERVACIONES")
        return 1


if __name__ == "__main__":
    sys.exit(main())
