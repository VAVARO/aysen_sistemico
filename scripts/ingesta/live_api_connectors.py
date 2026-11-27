#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
live_api_connectors.py - Conectores de extraccion en vivo (APIs publicas abiertas).

Ocho conectores activos alimentan la actualizacion mensual de Aysen Sistemico:

  1. usgs                USGS Earthquake Catalog (GeoJSON)
  2. ckan_datos_gob      CKAN v3 de datos.gob.cl (DEIS, MINEDUC, SINIM, SERPAT)
  3. ckan_cne            CKAN v3 de Energia Abierta CNE (combustibles / energia)
  4. arcgis_subpesca     ArcGIS REST de Subpesca (concesiones de acuicultura)
  5. arcgis_bbnn         ArcGIS REST de Bienes Nacionales (tenencia de suelo)
  6. arcgis_conaf        ArcGIS REST de CONAF / SIT (cobertura vegetacional)
  7. sinca               SINCA MMA (calidad del aire, Coyhaique y Puerto Aysen)
  8. dga_hidrologia      DGA-MOP Red Hidrometrica (Baker en Bertrand/Colonia y Simpson)

Reglas comunes (innegociables):
  - timeout=12 s y cabecera User-Agent honesta (sin suplantar navegadores).
  - Un dato solo reemplaza al existente si la respuesta HTTP es 200, el cuerpo
    parsea, el esquema es el esperado y los valores numericos son > 0 y
    coherentes con la Region de Aysen (bounding box y comunas 11101 a 11402).
  - Un conector NUNCA lanza excepciones hacia el orquestador: devuelve un
    ConnectorResult con ok=False y modo 'curated_fallback'. El dato anterior
    queda intacto en disco (Last-Known-Good).
  - Solo biblioteca estandar: cero dependencias en produccion.

Los endpoints ArcGIS son candidatos configurables por variable de entorno
(AYSEN_ARCGIS_<CLAVE>_URLS, separados por coma) para corregirlos sin tocar codigo.
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent.parent

REQUEST_TIMEOUT = 12
USER_AGENT = "AysenSistemico-ActualizacionMensual/1.0 (datos abiertos; refresco mensual automatizado)"

MODE_LIVE = "live_api"
MODE_FALLBACK = "curated_fallback"

# Region de Aysen: bounding box de la consulta y comunas oficiales (codigos INE/SUBDERE).
AYSEN_BBOX = {"minlat": -49.5, "maxlat": -43.5, "minlon": -76.0, "maxlon": -71.0}
COMUNAS_AYSEN = {
    "11101": "Coyhaique",
    "11102": "Lago Verde",
    "11201": "Aysen",
    "11202": "Cisnes",
    "11203": "Guaitecas",
    "11301": "Cochrane",
    "11302": "O'Higgins",
    "11303": "Tortel",
    "11401": "Chile Chico",
    "11402": "Rio Ibanez",
}
REGION_CODE = "11"

USGS_URL = (
    "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"
    "&minlatitude=-49.5&maxlatitude=-43.5&minlongitude=-76.0&maxlongitude=-71.0"
    "&minmagnitude=2.5&starttime=2015-01-01"
)
USGS_RAW_RELPATH = Path("data/raw/social_ambiental/usgs_earthquakes_aysen_2015_2026.geojson")

CKAN_DATOS_GOB = "https://datos.gob.cl/api/3/action"
CKAN_CNE = "http://datos.energiaabierta.cl/api/3/action"

# Temas CKAN: cada uno produce un snapshot de metadatos y filas filtradas por Aysen.
CKAN_TOPICS: List[Dict[str, Any]] = [
    {"key": "cne_combustibles", "connector": "ckan_cne", "base_url": CKAN_CNE,
     "query": "combustibles precios", "nodes": [13],
     "raw_dir": "energia_telecom", "file": "ckan_cne_combustibles_snapshot.json"},
    {"key": "cne_energia", "connector": "ckan_cne", "base_url": CKAN_CNE,
     "query": "generacion electrica", "nodes": [11],
     "raw_dir": "energia_telecom", "file": "ckan_cne_energia_snapshot.json"},
    {"key": "deis_salud", "connector": "ckan_datos_gob", "base_url": CKAN_DATOS_GOB,
     "query": "salud deis", "nodes": [24],
     "raw_dir": "social_ambiental", "file": "ckan_deis_salud_snapshot.json"},
    {"key": "mineduc", "connector": "ckan_datos_gob", "base_url": CKAN_DATOS_GOB,
     "query": "mineduc", "nodes": [25],
     "raw_dir": "social_ambiental", "file": "ckan_mineduc_snapshot.json"},
    {"key": "sinim", "connector": "ckan_datos_gob", "base_url": CKAN_DATOS_GOB,
     "query": "finanzas municipales", "nodes": [15, 16],
     "raw_dir": "politico_sinim", "file": "ckan_sinim_snapshot.json"},
    {"key": "serpat", "connector": "ckan_datos_gob", "base_url": CKAN_DATOS_GOB,
     "query": "propiedad fiscal", "nodes": [22],
     "raw_dir": "territorio_concesiones", "file": "ckan_serpat_snapshot.json"},
]

# Servicios ArcGIS REST (candidatos por orden de preferencia).
ARCGIS_TARGETS: List[Dict[str, Any]] = [
    {"key": "subpesca", "connector": "arcgis_subpesca", "nodes": [6],
     "raw_dir": "territorio_concesiones", "file": "subpesca_arcgis_live_snapshot.json",
     "candidates": [
         "https://geoportal.subpesca.cl/server/rest/services/IDE_PUBLICO/SRMPUB_ACUICULTURA_SALMONES/MapServer/0",
         "https://ide.subpesca.cl/arcgis/rest/services/IDE_PUBLICO/SRMPUB_ACUICULTURA/MapServer/0",
     ]},
    {"key": "bbnn", "connector": "arcgis_bbnn", "nodes": [22],
     "raw_dir": "territorio_concesiones", "file": "bienes_nacionales_arcgis_live_snapshot.json",
     "candidates": [
         "https://ide.bienes.cl/arcgis/rest/services/IDE_MBN/PropiedadFiscal/MapServer/0",
         "https://idembn.bienes.cl/arcgis/rest/services/PropiedadFiscal/MapServer/0",
     ]},
    {"key": "conaf", "connector": "arcgis_conaf", "nodes": [27],
     "raw_dir": "biodiversidad_mma_conaf", "file": "conaf_sit_arcgis_live_snapshot.json",
     "candidates": [
         "https://sit.conaf.cl/server/rest/services/Catastro/CatastroVegetacional/MapServer/0",
         "https://ide.conaf.cl/arcgis/rest/services/Catastro/MapServer/0",
     ]},
]

SINCA_LIST_URL = "https://sinca.mma.gob.cl/index.php/json/listadomapa2k19/"
SINCA_STATIONS = {"coyhaique": "Coyhaique", "puerto aysen": "Puerto Aysen"}
SINCA_RAW_RELPATH = Path("data/raw/biodiversidad_mma_conaf/sinca_aire_live_snapshot.json")

DGA_HIDROLOGIA_CANDIDATES = (
    "https://rest-sit.mop.gob.cl/arcgis/rest/services/DGA/Red_Hidrometrica/MapServer/0",
    "https://dga.mop.gob.cl/api/v1/hidrometria/aysen",
)
DGA_STATIONS_AYSEN: Dict[str, Dict[str, Any]] = {
    "11530000-8": {"id": 1, "nombre": "Rio Baker en Lago Bertrand", "comuna_ine": "11301", "min_m3s": 150.0, "max_m3s": 2500.0},
    "11542001-1": {"id": 2, "nombre": "Rio Baker en Bajo Colonia", "comuna_ine": "11301", "min_m3s": 0.5, "max_m3s": 25.0},
    "11317001-K": {"id": 5, "nombre": "Rio Simpson en Coyhaique", "comuna_ine": "11101", "min_m3s": 5.0, "max_m3s": 800.0},
}
DGA_RAW_RELPATH = Path("data/raw/biodiversidad_mma_conaf/dga_hidrologia_live_snapshot.json")

CONNECTOR_IDS = (
    "usgs", "ckan_datos_gob", "ckan_cne",
    "arcgis_subpesca", "arcgis_bbnn", "arcgis_conaf", "sinca",
    "dga_hidrologia",
)


# ---------------------------------------------------------------------------
# Tipos y capa HTTP
# ---------------------------------------------------------------------------

@dataclass
class HttpResponse:
    url: str
    status: int            # codigo HTTP real; 0 si no hubo respuesta (DNS, timeout, TLS)
    body: bytes = b""
    elapsed_s: float = 0.0
    error: str = ""


@dataclass
class ConnectorResult:
    connector: str
    key: str
    nodes: List[int] = field(default_factory=list)
    ok: bool = False
    mode: str = MODE_FALLBACK
    http_status: Optional[int] = None
    url: str = ""
    checked_at: str = ""
    elapsed_s: float = 0.0
    error: str = ""
    metrics: Dict[str, Any] = field(default_factory=dict)
    updated_files: List[str] = field(default_factory=list)
    data: Any = field(default=None, repr=False)

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d.pop("data", None)
        return d


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def http_get(url: str, timeout: float = REQUEST_TIMEOUT,
             headers: Optional[Dict[str, str]] = None) -> HttpResponse:
    """GET con timeout estricto. Nunca lanza: los fallos se informan en la respuesta."""
    hdrs = {"User-Agent": USER_AGENT, "Accept": "application/json, */*;q=0.5"}
    if headers:
        hdrs.update(headers)
    started = time.monotonic()
    req = urllib.request.Request(url, headers=hdrs)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read()
            return HttpResponse(url, int(resp.status), body, time.monotonic() - started)
    except urllib.error.HTTPError as he:
        return HttpResponse(url, int(he.code), b"", time.monotonic() - started, f"HTTP {he.code} {he.reason}")
    except Exception as exc:  # DNS, timeout, TLS, reset
        return HttpResponse(url, 0, b"", time.monotonic() - started, f"{type(exc).__name__}: {exc}")


def parse_json(resp: HttpResponse) -> Any:
    """Devuelve el JSON del cuerpo o None si el cuerpo no es JSON valido (p. ej. HTML)."""
    if not resp.body:
        return None
    try:
        return json.loads(resp.body.decode("utf-8-sig"))
    except (UnicodeDecodeError, ValueError):
        return None


def _result(connector: str, key: str, nodes: Iterable[int], url: str) -> ConnectorResult:
    return ConnectorResult(connector=connector, key=key, nodes=list(nodes), url=url, checked_at=utc_now_iso())


def _fail(res: ConnectorResult, resp: Optional[HttpResponse], reason: str) -> ConnectorResult:
    res.ok = False
    res.mode = MODE_FALLBACK
    if resp is not None:
        res.http_status = resp.status or None
        res.elapsed_s = round(resp.elapsed_s, 2)
        res.error = reason if not resp.error else f"{reason} ({resp.error})"
    else:
        res.error = reason
    return res


def _atomic_write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    os.replace(tmp, path)


def _norm(text: Any) -> str:
    s = unicodedata.normalize("NFKD", str(text)).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"\s+", " ", s).strip().lower()


def _to_float(value: Any) -> Optional[float]:
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        txt = value.strip().replace(" ", "")
        if re.fullmatch(r"-?\d+(\.\d+)?", txt):
            return float(txt)
        if re.fullmatch(r"-?\d+,\d+", txt):
            return float(txt.replace(",", "."))
    return None


# ---------------------------------------------------------------------------
# 1. USGS
# ---------------------------------------------------------------------------

def validate_usgs_geojson(data: Any) -> Dict[str, Any]:
    """Valida esquema GeoJSON y coherencia territorial. Devuelve features validas y metricas."""
    if not isinstance(data, dict) or data.get("type") != "FeatureCollection":
        raise ValueError("no es un FeatureCollection GeoJSON")
    feats = data.get("features")
    if not isinstance(feats, list) or not feats:
        raise ValueError("lista de features vacia")
    valid = []
    for f in feats:
        try:
            mag = _to_float(f["properties"]["mag"])
            lon, lat = f["geometry"]["coordinates"][0], f["geometry"]["coordinates"][1]
            t = f["properties"]["time"]
        except (KeyError, TypeError, IndexError):
            continue
        if mag is None or mag <= 0 or not isinstance(t, (int, float)):
            continue
        if not (AYSEN_BBOX["minlat"] <= lat <= AYSEN_BBOX["maxlat"]
                and AYSEN_BBOX["minlon"] <= lon <= AYSEN_BBOX["maxlon"]):
            continue
        valid.append(f)
    if not valid:
        raise ValueError("ningun feature valido dentro del bounding box de Aysen")
    if len(valid) < 0.9 * len(feats):
        raise ValueError(f"demasiados features invalidos ({len(feats) - len(valid)} de {len(feats)})")
    top = max(valid, key=lambda f: f["properties"]["mag"])
    return {
        "features": valid,
        "total_events": len(valid),
        "max_magnitude": float(top["properties"]["mag"]),
        "max_magnitude_place": top["properties"].get("place"),
        "max_magnitude_time_ms": top["properties"].get("time"),
    }


def fetch_usgs_earthquakes_aysen(root: Optional[Path] = None, write: bool = True) -> ConnectorResult:
    """Consulta USGS, valida y (si es valido) reemplaza el GeoJSON crudo de Aysen."""
    root = Path(root) if root else REPO_ROOT
    res = _result("usgs", "usgs", [31], USGS_URL)
    resp = http_get(USGS_URL)
    if resp.status != 200:
        return _fail(res, resp, "USGS no respondio 200")
    data = parse_json(resp)
    if data is None:
        return _fail(res, resp, "USGS devolvio un cuerpo que no es JSON")
    try:
        info = validate_usgs_geojson(data)
    except ValueError as exc:
        return _fail(res, resp, f"USGS invalido: {exc}")

    target = root / USGS_RAW_RELPATH
    previous = _count_previous_usgs(target)
    if previous and info["total_events"] < 0.8 * previous:
        return _fail(res, resp, f"USGS devolvio {info['total_events']} eventos frente a {previous} previos")

    data["features"] = info["features"]
    if isinstance(data.get("metadata"), dict):
        data["metadata"]["count"] = info["total_events"]
    if write:
        _atomic_write_json(target, data)
        res.updated_files.append(USGS_RAW_RELPATH.as_posix())
    res.ok, res.mode = True, MODE_LIVE
    res.http_status, res.elapsed_s = resp.status, round(resp.elapsed_s, 2)
    res.metrics = {k: info[k] for k in ("total_events", "max_magnitude", "max_magnitude_place", "max_magnitude_time_ms")}
    res.data = data
    return res


def _count_previous_usgs(path: Path) -> int:
    try:
        prev = json.loads(path.read_text(encoding="utf-8-sig"))
        prev_url = str((prev.get("metadata") or {}).get("url", ""))
        if "minmagnitude=2.5" not in prev_url:
            return 0  # consulta previa con otro umbral: no comparable
        return len(prev.get("features", []))
    except Exception:
        return 0


# ---------------------------------------------------------------------------
# 2 y 3. CKAN (datos.gob.cl y Energia Abierta CNE)
# ---------------------------------------------------------------------------

def _row_in_aysen(row: Dict[str, Any]) -> bool:
    """Una fila pertenece a Aysen si su region es 11 / Aysen o su comuna esta en 11101..11402."""
    for key, value in row.items():
        k = _norm(key)
        v = _norm(value)
        if not v:
            continue
        if re.search(r"(^|_)(cod(igo)?_?)?region($|_)|^reg$|^region", k):
            if v in {"11", "11.0", "xi"} or "aysen" in v:
                return True
        if "comuna" in k:
            if v.split(".")[0] in COMUNAS_AYSEN:
                return True
            if any(_norm(n) == v for n in COMUNAS_AYSEN.values()):
                return True
    return False


_IDENTIFIER_KEY = re.compile(r"(^_?id$|_id$|region|comuna|provincia|codigo|^cod|anio|^ano$|year|periodo|"
                             r"^mes$|rut|^lat|^lon|telefono|folio)", re.I)


def _has_positive_number(rows: List[Dict[str, Any]]) -> bool:
    """Hay al menos un valor numerico > 0 en una columna de medida (no en codigos ni identificadores)."""
    for row in rows:
        for key, value in row.items():
            if _IDENTIFIER_KEY.search(_norm(key)):
                continue
            num = _to_float(value)
            if num is not None and num > 0:
                return True
    return False

def fetch_ckan_datos_gob(query: str, resource_id: Optional[str] = None, *,
                         base_url: str = CKAN_DATOS_GOB, key: str = "ckan",
                         connector: str = "ckan_datos_gob", nodes: Iterable[int] = (),
                         raw_dir: str = "social_ambiental", filename: Optional[str] = None,
                         root: Optional[Path] = None, rows: int = 5,
                         write: bool = True) -> ConnectorResult:
    """
    Consulta CKAN v3: package_search (metadatos de recursos vigentes) y, si se entrega
    resource_id, datastore_search filtrado a la Region de Aysen. Solo escribe si la
    respuesta es 200, success=true, hay paquetes y (con datastore) filas de Aysen con
    al menos un valor numerico positivo.
    """
    root = Path(root) if root else REPO_ROOT
    search_url = f"{base_url}/package_search?{urllib.parse.urlencode({'q': query, 'rows': rows})}"
    res = _result(connector, key, nodes, search_url)

    resp = http_get(search_url)
    if resp.status != 200:
        return _fail(res, resp, "CKAN package_search no respondio 200")
    body = parse_json(resp)
    if not isinstance(body, dict) or body.get("success") is not True or not isinstance(body.get("result"), dict):
        return _fail(res, resp, "CKAN devolvio un cuerpo sin success=true")
    result = body["result"]
    total = _to_float(result.get("count"))
    packages = result.get("results")
    if total is None or total <= 0 or not isinstance(packages, list) or not packages:
        return _fail(res, resp, "CKAN sin paquetes para la consulta")

    resources: List[Dict[str, Any]] = []
    for pkg in packages:
        for r in pkg.get("resources", []) or []:
            if str(r.get("state", "active")).lower() == "deleted":
                continue
            resources.append({
                "package": pkg.get("name"),
                "package_title": pkg.get("title"),
                "organization": (pkg.get("organization") or {}).get("title"),
                "metadata_modified": pkg.get("metadata_modified"),
                "resource_id": r.get("id"),
                "resource_name": r.get("name"),
                "format": r.get("format"),
                "url": r.get("url"),
                "datastore_active": bool(r.get("datastore_active")),
            })
    if not resources:
        return _fail(res, resp, "CKAN sin recursos vigentes")

    snapshot: Dict[str, Any] = {
        "source": base_url, "query": query, "fetched_at": res.checked_at,
        "http_status": resp.status, "packages_found": int(total),
        "resources": resources[:40], "aysen_rows": [],
        "aysen_filter": {"region": REGION_CODE, "comunas": sorted(COMUNAS_AYSEN)},
    }
    res.metrics = {"packages_found": int(total), "resources": len(resources)}

    if resource_id:
        ds_url = f"{base_url}/datastore_search?{urllib.parse.urlencode({'resource_id': resource_id, 'limit': 1000})}"
        ds = http_get(ds_url)
        if ds.status != 200:
            return _fail(res, ds, "CKAN datastore_search no respondio 200")
        ds_body = parse_json(ds)
        records = (ds_body or {}).get("result", {}).get("records") if isinstance(ds_body, dict) else None
        if not isinstance(records, list) or not records:
            return _fail(res, ds, "CKAN datastore_search sin registros")
        aysen_rows = [r for r in records if isinstance(r, dict) and _row_in_aysen(r)]
        if not aysen_rows or not _has_positive_number(aysen_rows):
            return _fail(res, ds, "CKAN sin filas de Aysen con valores numericos positivos")
        snapshot["resource_id"] = resource_id
        snapshot["aysen_rows"] = aysen_rows[:500]
        res.metrics["aysen_rows"] = len(aysen_rows)
        res.url = ds_url

    if write and filename:
        target = root / "data" / "raw" / raw_dir / filename
        _atomic_write_json(target, snapshot)
        res.updated_files.append(target.relative_to(root).as_posix())
    res.ok, res.mode = True, MODE_LIVE
    res.http_status, res.elapsed_s = resp.status, round(resp.elapsed_s, 2)
    res.data = snapshot
    return res


def _pick_datastore_resource(snapshot: Dict[str, Any]) -> Optional[str]:
    for r in snapshot.get("resources", []):
        if r.get("datastore_active") and r.get("resource_id"):
            return r["resource_id"]
    return None


def fetch_ckan_topic(topic: Dict[str, Any], root: Optional[Path] = None, write: bool = True) -> ConnectorResult:
    """Un tema CKAN: metadatos de recursos y, si hay datastore, filas filtradas a Aysen."""
    base = Path(root) if root else REPO_ROOT
    common = dict(base_url=topic["base_url"], key=topic["key"], connector=topic["connector"],
                  nodes=topic["nodes"], raw_dir=topic["raw_dir"], filename=topic["file"],
                  root=base, write=False)
    meta = fetch_ckan_datos_gob(topic["query"], None, **common)
    if not meta.ok:
        return meta
    rid = _pick_datastore_resource(meta.data)
    if rid:
        rows_res = fetch_ckan_datos_gob(topic["query"], rid, **common)
        # Las filas de Aysen son deseables, no obligatorias: si faltan se conservan los metadatos.
        if rows_res.ok:
            meta = rows_res
    if write:
        target = base / "data" / "raw" / topic["raw_dir"] / topic["file"]
        _atomic_write_json(target, meta.data)
        meta.updated_files.append(target.relative_to(base).as_posix())
    return meta


def fetch_ckan_topics(root: Optional[Path] = None, write: bool = True) -> List[ConnectorResult]:
    """Ejecuta todos los temas CKAN configurados."""
    return [fetch_ckan_topic(t, root, write) for t in CKAN_TOPICS]

# ---------------------------------------------------------------------------
# 4. ArcGIS REST (Subpesca, Bienes Nacionales, CONAF/SIT)
# ---------------------------------------------------------------------------

def _arcgis_candidates(target: Dict[str, Any]) -> List[str]:
    env = os.environ.get(f"AYSEN_ARCGIS_{target['key'].upper()}_URLS", "").strip()
    if env:
        return [u.strip() for u in env.split(",") if u.strip()]
    return list(target["candidates"])


def fetch_arcgis_layer_count(layer_url: str) -> ConnectorResult:
    """Consulta un layer ArcGIS con where=1=1 y returnCountOnly=true."""
    base = layer_url.rstrip("/")
    url = f"{base}/query?where=1%3D1&returnCountOnly=true&f=json"
    res = _result("arcgis", "layer", [], url)
    resp = http_get(url)
    if resp.status != 200:
        return _fail(res, resp, "ArcGIS no respondio 200")
    body = parse_json(resp)
    if not isinstance(body, dict):
        return _fail(res, resp, "ArcGIS devolvio un cuerpo que no es JSON (posible pagina HTML)")
    if "error" in body:  # ArcGIS responde 200 con {"error": {...}} ante fallas logicas
        return _fail(res, resp, f"ArcGIS error logico: {body['error']}")
    count = _to_float(body.get("count"))
    if count is None or count <= 0 or count != int(count) or count > 50_000_000:
        return _fail(res, resp, f"ArcGIS count no valido: {body.get('count')!r}")
    res.ok, res.mode = True, MODE_LIVE
    res.http_status, res.elapsed_s = resp.status, round(resp.elapsed_s, 2)
    res.metrics = {"count": int(count)}
    return res


def fetch_arcgis_target(target: Dict[str, Any], root: Optional[Path] = None, write: bool = True) -> ConnectorResult:
    """Prueba los candidatos de un servicio y actualiza su snapshot solo si el conteo es valido."""
    root = Path(root) if root else REPO_ROOT
    candidates = _arcgis_candidates(target)
    res = _result(target["connector"], target["key"], target["nodes"], candidates[0] if candidates else "")
    last_fail: Optional[ConnectorResult] = None
    attempts: List[Dict[str, Any]] = []
    for layer_url in candidates:
        probe = fetch_arcgis_layer_count(layer_url)
        attempts.append({"layer_url": layer_url, "http_status": probe.http_status, "ok": probe.ok,
                         "error": probe.error})
        if not probe.ok:
            last_fail = probe
            continue
        meta = http_get(layer_url.rstrip("/") + "?f=json")
        meta_json = parse_json(meta) if meta.status == 200 else None
        layer_name = meta_json.get("name") if isinstance(meta_json, dict) else None
        res.url, res.ok, res.mode = probe.url, True, MODE_LIVE
        res.http_status, res.elapsed_s = probe.http_status, probe.elapsed_s
        res.metrics = {"count": probe.metrics["count"], "layer_name": layer_name, "attempts": attempts}
        if write:
            out = root / "data" / "raw" / target["raw_dir"] / target["file"]
            _atomic_write_json(out, {
                "endpoint": layer_url, "query_url": probe.url, "status_http": probe.http_status,
                "count": probe.metrics["count"], "layer_name": layer_name,
                "extraction_mode": MODE_LIVE, "timestamp": res.checked_at,
            })
            res.updated_files.append(out.relative_to(root).as_posix())
        return res
    res.url = last_fail.url if last_fail else res.url
    res.ok, res.mode = False, MODE_FALLBACK
    res.http_status = last_fail.http_status if last_fail else None
    res.error = f"{len(attempts)} candidato(s) fallaron: " + " | ".join(
        str(a["http_status"] or "sin respuesta") for a in attempts)
    res.metrics = {"attempts": attempts}
    return res


def fetch_arcgis_rest_aysen(root: Optional[Path] = None, write: bool = True) -> List[ConnectorResult]:
    """Ejecuta todos los servicios ArcGIS REST configurados (Subpesca, Bienes Nacionales, CONAF/SIT)."""
    return [fetch_arcgis_target(t, root, write) for t in ARCGIS_TARGETS]

# ---------------------------------------------------------------------------
# 5. SINCA (calidad del aire)
# ---------------------------------------------------------------------------

_POLLUTANT_KEY = re.compile(r"(pm ?2[.,_]?5|mp ?2[.,_]?5|pm ?10|mp ?10)", re.I)


def _collect_station_readings(node: Any, out: Dict[str, float]) -> None:
    """Recorre recursivamente un registro de estacion y recoge valores PM2.5 / PM10 numericos."""
    if isinstance(node, dict):
        for k, v in node.items():
            num = _to_float(v)
            if num is not None and _POLLUTANT_KEY.search(str(k)):
                out[_norm(k)] = num
            else:
                _collect_station_readings(v, out)
    elif isinstance(node, list):
        for item in node:
            _collect_station_readings(item, out)


def parse_sinca_stations(payload: Any) -> Dict[str, Dict[str, float]]:
    """Extrae lecturas positivas de Coyhaique y Puerto Aysen desde el JSON de listado de SINCA."""
    stations = payload if isinstance(payload, list) else (payload or {}).get("estaciones") if isinstance(payload, dict) else None
    if not isinstance(stations, list):
        return {}
    found: Dict[str, Dict[str, float]] = {}
    for st in stations:
        if not isinstance(st, dict):
            continue
        name = _norm(st.get("nombre") or st.get("name") or st.get("estacion") or "")
        for needle, label in SINCA_STATIONS.items():
            if needle in name:
                readings: Dict[str, float] = {}
                _collect_station_readings(st, readings)
                positive = {k: v for k, v in readings.items() if 0 < v < 2000}
                if positive:
                    found[label] = positive
    return found


def fetch_sinca_air_quality_aysen(root: Optional[Path] = None, write: bool = True) -> ConnectorResult:
    """Consulta SINCA y actualiza el snapshot ambiental si hay lecturas validas (>0)."""
    root = Path(root) if root else REPO_ROOT
    res = _result("sinca", "sinca", [30], SINCA_LIST_URL)
    resp = http_get(SINCA_LIST_URL)
    if resp.status != 200:
        return _fail(res, resp, "SINCA no respondio 200")
    payload = parse_json(resp)
    if payload is None:
        return _fail(res, resp, "SINCA devolvio un cuerpo que no es JSON")
    found = parse_sinca_stations(payload)
    if not found:
        return _fail(res, resp, "SINCA sin lecturas validas para Coyhaique ni Puerto Aysen")
    res.ok, res.mode = True, MODE_LIVE
    res.http_status, res.elapsed_s = resp.status, round(resp.elapsed_s, 2)
    res.metrics = {"stations": sorted(found), "missing": sorted(set(SINCA_STATIONS.values()) - set(found)),
                   "readings": found}
    if write:
        _atomic_write_json(root / SINCA_RAW_RELPATH, {
            "endpoint": SINCA_LIST_URL, "status_http": resp.status, "extraction_mode": MODE_LIVE,
            "timestamp": res.checked_at, "estaciones": found,
        })
        res.updated_files.append(SINCA_RAW_RELPATH.as_posix())
    return res


# ---------------------------------------------------------------------------
# 6. DGA-MOP Red Hidrometrica Aysen (BNA 11530000-8, 11542001-1, 11317001-K)
# ---------------------------------------------------------------------------

def _dga_candidates() -> List[str]:
    env = os.environ.get("AYSEN_DGA_HIDROLOGIA_URLS", "").strip()
    if env:
        return [u.strip() for u in env.split(",") if u.strip()]
    return list(DGA_HIDROLOGIA_CANDIDATES)


def _in_aysen_bbox(lat: Optional[float], lon: Optional[float]) -> bool:
    if lat is None or lon is None:
        return False
    return (
        AYSEN_BBOX["minlat"] <= lat <= AYSEN_BBOX["maxlat"]
        and AYSEN_BBOX["minlon"] <= lon <= AYSEN_BBOX["maxlon"]
    )


def _extract_dga_records(payload: Any) -> Dict[str, Dict[str, Any]]:
    """Extrae lecturas hidrologicas validas de Aysen desde JSON ArcGIS REST o JSON DGA."""
    if isinstance(payload, dict) and isinstance(payload.get("features"), list):
        items = payload["features"]
    elif isinstance(payload, dict) and isinstance(payload.get("estaciones"), list):
        items = payload["estaciones"]
    elif isinstance(payload, list):
        items = payload
    else:
        return {}

    found: Dict[str, Dict[str, Any]] = {}
    for item in items:
        if not isinstance(item, dict):
            continue
        attrs = item.get("attributes") if isinstance(item.get("attributes"), dict) else item
        geom = item.get("geometry") if isinstance(item.get("geometry"), dict) else {}
        code_raw = str(
            attrs.get("COD_BNA") or attrs.get("codigo_estacion") or attrs.get("codigo_bna")
            or attrs.get("cod_bna") or attrs.get("bna") or ""
        ).strip()
        code = re.sub(r"^BNA\s+", "", code_raw, flags=re.I)
        if code not in DGA_STATIONS_AYSEN:
            continue

        lat = _to_float(attrs.get("LATITUD") or attrs.get("lat") or geom.get("y"))
        lon = _to_float(attrs.get("LONGITUD") or attrs.get("lng") or attrs.get("lon") or geom.get("x"))
        if lat is not None and lon is not None and not _in_aysen_bbox(lat, lon):
            continue

        val = None
        for vk in ("caudal_m3s", "CAUDAL_M3S", "caudal", "CAUDAL", "nivel_m", "NIVEL_M", "valor", "VALOR", "altura_m"):
            cand = _to_float(attrs.get(vk))
            if cand is not None:
                val = cand
                break

        meta = DGA_STATIONS_AYSEN[code]
        if val is None or val <= 0 or not (meta["min_m3s"] <= val <= meta["max_m3s"]):
            continue

        found[code] = {
            "id": meta["id"],
            "codigo_bna": code,
            "nombre": meta["nombre"],
            "comuna_ine": meta["comuna_ine"],
            "valor": round(val, 2),
            "unidad": "m" if code == "11542001-1" else "m\u00b3/s",
        }
    return found


def fetch_dga_hidrologia_aysen(root: Optional[Path] = None, write: bool = True) -> ConnectorResult:
    """Consulta la Red Hidrometrica DGA-MOP para estaciones de Aysen (sin meses futuros)."""
    root = Path(root) if root else REPO_ROOT
    candidates = _dga_candidates()
    first_url = candidates[0] if candidates else ""
    res = _result("dga_hidrologia", "dga_hidrologia", [30], first_url)
    last_fail: Optional[ConnectorResult] = None
    attempts: List[Dict[str, Any]] = []

    for base_url in candidates:
        query_url = base_url.rstrip("/")
        if "MapServer" in query_url and "/query" not in query_url:
            query_url = f"{query_url}/query?where=COD_REG%3D11&outFields=*&f=json"
        probe = _result("dga_hidrologia", "dga_hidrologia", [30], query_url)
        resp = http_get(query_url)
        if resp.status != 200:
            last_fail = _fail(probe, resp, "DGA Hidro no respondio 200")
            attempts.append({"url": query_url, "http_status": resp.status, "ok": False, "error": last_fail.error})
            continue
        payload = parse_json(resp)
        if payload is None:
            last_fail = _fail(probe, resp, "DGA Hidro devolvio un cuerpo que no es JSON")
            attempts.append({"url": query_url, "http_status": resp.status, "ok": False, "error": last_fail.error})
            continue
        if isinstance(payload, dict) and "error" in payload:
            last_fail = _fail(probe, resp, f"DGA Hidro error logico: {payload['error']}")
            attempts.append({"url": query_url, "http_status": resp.status, "ok": False, "error": last_fail.error})
            continue

        matched = _extract_dga_records(payload)
        if not matched:
            last_fail = _fail(probe, resp, "DGA Hidro sin lecturas fisicas validas en Aysen")
            attempts.append({"url": query_url, "http_status": resp.status, "ok": False, "error": last_fail.error})
            continue

        now_iso = utc_now_iso()
        cur_ym = now_iso[:7]
        cur_ymd = now_iso[:10]
        res.url = query_url
        res.ok = True
        res.mode = MODE_LIVE
        res.http_status = resp.status
        res.elapsed_s = round(resp.elapsed_s, 2)
        res.metrics = {
            "stations_matched": sorted(matched.keys()),
            "stations_count": len(matched),
            "readings": matched,
        }

        if write:
            _atomic_write_json(root / DGA_RAW_RELPATH, {
                "endpoint": query_url,
                "status_http": resp.status,
                "extraction_mode": MODE_LIVE,
                "timestamp": res.checked_at,
                "estaciones": matched,
            })
            res.updated_files.append(DGA_RAW_RELPATH.as_posix())

            est_path = root / "data" / "estaciones_aysen.json"
            if est_path.is_file():
                try:
                    est_doc = json.loads(est_path.read_text(encoding="utf-8-sig"))
                    changed_est = False
                    for st in est_doc.get("estaciones", []):
                        raw_code = str(st.get("codigo_estacion") or "")
                        bna = re.sub(r"^BNA\s+", "", raw_code, flags=re.I).strip()
                        if bna not in matched:
                            continue
                        serie = [
                            pt for pt in (st.get("serie_temporal") or [])
                            if str(pt.get("periodo_mes", "")) <= cur_ym
                            and str(pt.get("fecha", "")) <= cur_ymd
                        ]
                        val_num = matched[bna]["valor"]
                        existing_cur = next((pt for pt in serie if pt.get("periodo_mes") == cur_ym), None)
                        if existing_cur is not None:
                            existing_cur["valor"] = val_num
                            existing_cur["fecha"] = cur_ymd
                        else:
                            serie.append({
                                "periodo_mes": cur_ym,
                                "fecha": cur_ymd,
                                "valor": val_num,
                                "unidad": st.get("unidad") or matched[bna]["unidad"],
                            })
                        st["serie_temporal"] = serie[-12:]
                        changed_est = True
                    if changed_est:
                        est_doc["fecha_actualizacion"] = res.checked_at
                        _atomic_write_json(est_path, est_doc)
                        res.updated_files.append("data/estaciones_aysen.json")
                except Exception:
                    pass
        return res

    res.url = last_fail.url if last_fail else first_url
    res.ok = False
    res.mode = MODE_FALLBACK
    res.http_status = last_fail.http_status if last_fail else None
    res.error = last_fail.error if last_fail else "DGA Hidro sin candidatos configurados"
    res.metrics = {"attempts": attempts}
    return res


# ---------------------------------------------------------------------------
# Ejecucion agregada
# ---------------------------------------------------------------------------

def run_all_live_connectors(root: Optional[Path] = None, write: bool = True) -> List[ConnectorResult]:
    """Ejecuta los ocho conectores; cada uno aislado de los demas."""
    results: List[ConnectorResult] = []
    for name, call in (
        ("usgs", lambda: [fetch_usgs_earthquakes_aysen(root, write)]),
        ("ckan", lambda: fetch_ckan_topics(root, write)),
        ("arcgis", lambda: fetch_arcgis_rest_aysen(root, write)),
        ("sinca", lambda: [fetch_sinca_air_quality_aysen(root, write)]),
        ("dga_hidrologia", lambda: [fetch_dga_hidrologia_aysen(root, write)]),
    ):
        try:
            results.extend(call())
        except Exception as exc:  # defensa final: un conector jamas debe tumbar el resto
            r = _result(name, name, [], "")
            r.error = f"excepcion no controlada: {type(exc).__name__}: {exc}"
            results.append(r)
    return results


if __name__ == "__main__":
    for r in run_all_live_connectors(write=False):
        print(f"[{'OK' if r.ok else 'FALLBACK'}] {r.connector}/{r.key} http={r.http_status} {r.error}")
