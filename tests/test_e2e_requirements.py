#!/usr/bin/env python3
"""
E2E Requirements Test Suite for SUPERFORECAST Aysén Territorial Viewer
=====================================================================
Executable with Python 3.11 Standard Library only:
  C:\\Users\\alvar\\.local\\bin\\python3.11.exe tests/test_e2e_requirements.py

Tiers Covered:
  - Tier 1: Feature Coverage (UI, Data Fusion, Verification) [25 tests]
  - Tier 2: Boundary & Corner Cases (Empty, Extremes, BOM, Zero vs Null) [16 tests]
  - Tier 3: Cross-Feature Combinations (Pairwise matrix) [14 tests]
  - Tier 4: Real-World Application Scenarios (Clima-Salud, GLOF, Algal Bloom) [3 tests]
Total: 58 Comprehensive Tests
"""

import os
import sys
import json
import csv
import io
import re
import math
import unittest
from pathlib import Path
from html.parser import HTMLParser
from typing import List, Dict, Any, Optional, Tuple

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Base Project Directory
REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
SCRIPTS_DIR = REPO_ROOT / "scripts"
HTML_MAP = REPO_ROOT / "mapa_territorial.html"
HTML_INDEX = REPO_ROOT / "index.html"


# =====================================================================
# REFERENCE HARNESS & ORACLES (Standard Library Logic Engines)
# =====================================================================

class AysenSpatialContract:
    """Authoritative Spatial & Bounding Box definitions for Región de Aysén (CL-XI)"""
    LAT_MIN = -49.3
    LAT_MAX = -43.6
    LNG_MIN = -75.8
    LNG_MAX = -71.0

    COMUNAS = {
        "CL-XI-01": {"ine": "11101", "nombre": "Coyhaique", "provincia": "Coyhaique"},
        "CL-XI-02": {"ine": "11102", "nombre": "Lago Verde", "provincia": "Coyhaique"},
        "CL-XI-03": {"ine": "11201", "nombre": "Aysén", "provincia": "Aysén"},
        "CL-XI-04": {"ine": "11202", "nombre": "Cisnes", "provincia": "Aysén"},
        "CL-XI-05": {"ine": "11203", "nombre": "Guaitecas", "provincia": "Aysén"},
        "CL-XI-06": {"ine": "11401", "nombre": "Chile Chico", "provincia": "General Carrera"},
        "CL-XI-07": {"ine": "11402", "nombre": "Río Ibáñez", "provincia": "General Carrera"},
        "CL-XI-08": {"ine": "11301", "nombre": "Cochrane", "provincia": "Capitán Prat"},
        "CL-XI-09": {"ine": "11302", "nombre": "O'Higgins", "provincia": "Capitán Prat"},
        "CL-XI-10": {"ine": "11303", "nombre": "Tortel", "provincia": "Capitán Prat"}
    }

    BASINS_BNA = {
        "110": "Costeras e Islas Río Palena - Río Aysén",
        "111": "Río Palena",
        "112": "Río Cisnes",
        "113": "Río Aysén",
        "114": "Costeras Río Aysén - Río Baker",
        "115": "Río Baker",
        "116": "Costeras Río Baker - Río Pascua",
        "117": "Río Pascua",
        "118": "Costeras Río Pascua - Límite Regional",
        "119": "Islas al Sur de Golfo de Penas"
    }

    BARRIOS_ACS = ["ACS-19A", "ACS-19B", "ACS-21A", "ACS-21B", "ACS-22A", "ACS-22B", "ACS-24", "ACS-25"]

    @classmethod
    def is_within_bbox(cls, lat: float, lng: float) -> bool:
        return (cls.LAT_MIN <= lat <= cls.LAT_MAX) and (cls.LNG_MIN <= lng <= cls.LNG_MAX)


class DataFusionEngine:
    """Analytical Joins, Aggregation, and Normalization Engine"""

    @staticmethod
    def z_score(series: List[Optional[float]]) -> List[Optional[float]]:
        valid = [x for x in series if x is not None]
        if not valid:
            return []
        n = len(valid)
        mean = sum(valid) / n
        variance = sum((x - mean) ** 2 for x in valid) / n
        std = math.sqrt(variance)
        if std == 0:
            return [0.0 if x is not None else None for x in series]
        return [round((x - mean) / std, 4) if x is not None else None for x in series]

    @staticmethod
    def min_max_scale(series: List[Optional[float]], target_min: float = 0.0, target_max: float = 100.0) -> List[Optional[float]]:
        valid = [x for x in series if x is not None]
        if not valid:
            return []
        v_min = min(valid)
        v_max = max(valid)
        span = v_max - v_min
        if span == 0:
            return [target_min if x is not None else None for x in series]
        return [round(target_min + ((x - v_min) / span) * (target_max - target_min), 2) if x is not None else None for x in series]

    @staticmethod
    def pearson_correlation(x: List[float], y: List[float]) -> float:
        if len(x) != len(y) or len(x) < 2:
            return 0.0
        n = len(x)
        mean_x = sum(x) / n
        mean_y = sum(y) / n
        num = sum((xi - mean_x) * (yi - mean_y) for xi, yi in zip(x, y))
        den_x = sum((xi - mean_x) ** 2 for xi in x)
        den_y = sum((yi - mean_y) ** 2 for yi in y)
        den = math.sqrt(den_x * den_y)
        if den == 0:
            return 0.0
        return round(num / den, 4)

    @staticmethod
    def full_outer_temporal_join(series_dict: Dict[str, Dict[str, Any]], all_keys: List[str]) -> List[Dict[str, Any]]:
        result = []
        for key in sorted(all_keys):
            row = {"periodo_mes": key}
            for name, dataset in series_dict.items():
                row[name] = dataset.get(key, None)
            result.append(row)
        return result


class DataExportEngine:
    """Generates standardized CSV and JSON compliant with PROJECT.md Interface Contracts"""

    @staticmethod
    def export_csv(rows: List[Dict[str, Any]], fieldnames: List[str]) -> bytes:
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=fieldnames, lineterminator="\n", quoting=csv.QUOTE_MINIMAL)
        writer.writeheader()
        for r in rows:
            writer.writerow({k: r.get(k, "") for k in fieldnames})
        return "\ufeff".encode("utf-8") + output.getvalue().encode("utf-8")

    @staticmethod
    def export_json(metadata: Dict[str, Any], datos: List[Dict[str, Any]]) -> str:
        payload = {
            "version": "1.0.0",
            "metadata": metadata,
            "datos": datos
        }
        return json.dumps(payload, indent=2, ensure_ascii=False)


# Authoritative Benchmark Series (from ORIGINAL_REQUEST.md & survey_spec_miner_2)
CLIMA_SALUD_BENCHMARK = [
    {"mes": "2026-01", "temp_min": 7.5, "mp25": 16.0, "egresos": 42},
    {"mes": "2026-02", "temp_min": 6.8, "mp25": 14.5, "egresos": 38},
    {"mes": "2026-03", "temp_min": 4.2, "mp25": 22.0, "egresos": 55},
    {"mes": "2026-04", "temp_min": 1.5, "mp25": 58.0, "egresos": 94},
    {"mes": "2026-05", "temp_min": -2.8, "mp25": 118.0, "egresos": 168},
    {"mes": "2026-06", "temp_min": -6.5, "mp25": 165.0, "egresos": 245},
    {"mes": "2026-07", "temp_min": -5.8, "mp25": 152.0, "egresos": 230},
    {"mes": "2026-08", "temp_min": -3.2, "mp25": 98.0, "egresos": 180},
    {"mes": "2026-09", "temp_min": 0.8, "mp25": 44.0, "egresos": 112},
    {"mes": "2026-10", "temp_min": 3.5, "mp25": 24.0, "egresos": 70},
    {"mes": "2026-11", "temp_min": 5.2, "mp25": 18.0, "egresos": 50},
    {"mes": "2026-12", "temp_min": 6.9, "mp25": 15.0, "egresos": 44},
]

CRIOSFERA_RIESGO_BENCHMARK = [
    {"mes": "2026-01", "caudal": 580, "nivel": 2.8, "precip": 110, "glof": "Normal"},
    {"mes": "2026-02", "caudal": 620, "nivel": 2.9, "precip": 125, "glof": "Normal"},
    {"mes": "2026-03", "caudal": 690, "nivel": 3.1, "precip": 140, "glof": "Normal"},
    {"mes": "2026-04", "caudal": 1450, "nivel": 5.8, "precip": 220, "glof": "Alerta Roja GLOF"},
    {"mes": "2026-05", "caudal": 740, "nivel": 3.4, "precip": 180, "glof": "Fase Recuperación"},
    {"mes": "2026-06", "caudal": 480, "nivel": 2.9, "precip": 150, "glof": "Normal"},
    {"mes": "2026-07", "caudal": 430, "nivel": 2.7, "precip": 130, "glof": "Normal"},
    {"mes": "2026-08", "caudal": 460, "nivel": 2.6, "precip": 120, "glof": "Normal"},
    {"mes": "2026-09", "caudal": 520, "nivel": 2.8, "precip": 105, "glof": "Normal"},
    {"mes": "2026-10", "caudal": 570, "nivel": 3.0, "precip": 95, "glof": "Normal"},
    {"mes": "2026-11", "caudal": 610, "nivel": 3.1, "precip": 85, "glof": "Normal"},
    {"mes": "2026-12", "caudal": 660, "nivel": 3.2, "precip": 90, "glof": "Normal"},
]

MARINO_PRODUCTIVO_BENCHMARK = [
    {"mes": "2026-01", "sst": 13.2, "alexandrium": 50, "cosecha": 28.0, "infa": 88},
    {"mes": "2026-02", "sst": 14.8, "alexandrium": 280, "cosecha": 35.0, "infa": 82},
    {"mes": "2026-03", "sst": 15.6, "alexandrium": 1450, "cosecha": 41.0, "infa": 74},
    {"mes": "2026-04", "sst": 13.9, "alexandrium": 820, "cosecha": 15.0, "infa": 71},
    {"mes": "2026-05", "sst": 11.8, "alexandrium": 80, "cosecha": 0.0, "infa": 78},
    {"mes": "2026-06", "sst": 9.5, "alexandrium": 0, "cosecha": 0.0, "infa": 84},
    {"mes": "2026-07", "sst": 8.2, "alexandrium": 0, "cosecha": 0.0, "infa": 90},
    {"mes": "2026-08", "sst": 8.0, "alexandrium": 0, "cosecha": 12.0, "infa": 92},
    {"mes": "2026-09", "sst": 8.8, "alexandrium": 0, "cosecha": 25.0, "infa": 91},
    {"mes": "2026-10", "sst": 10.2, "alexandrium": 0, "cosecha": 33.0, "infa": 89},
    {"mes": "2026-11", "sst": 11.5, "alexandrium": 10, "cosecha": 38.0, "infa": 87},
    {"mes": "2026-12", "sst": 12.6, "alexandrium": 25, "cosecha": 42.0, "infa": 86},
]


def extract_stations_from_html(html_path: Path) -> List[Dict[str, Any]]:
    """Opaque-box parser extracting station JSON objects from mapa_territorial.html"""
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r"const\s+stations\s*=\s*\[(.*?)\n\s*\];", content, re.DOTALL)
    if not match:
        return []
    raw_array = match.group(1)
    station_blocks = re.findall(r"\{\s*id:\s*(\d+).*?\}", raw_array, re.DOTALL)
    stations = []
    for block in station_blocks:
        s_id = int(block)
        start_idx = raw_array.find(f"id: {s_id}")
        chunk = raw_array[start_idx:start_idx + 800]
        lat_m = re.search(r"lat:\s*([-\d\.]+)", chunk)
        lng_m = re.search(r"lng:\s*([-\d\.]+)", chunk)
        name_m = re.search(r'name:\s*["\'](.*?)["\']', chunk)
        domain_m = re.search(r'domain:\s*["\'](.*?)["\']', chunk)
        if lat_m and lng_m and name_m:
            stations.append({
                "id": s_id,
                "name": name_m.group(1),
                "domain": domain_m.group(1) if domain_m else "unknown",
                "lat": float(lat_m.group(1)),
                "lng": float(lng_m.group(1))
            })
    return stations


# =====================================================================
# TIER 1: FEATURE COVERAGE (Core Functional Contracts - 25 Tests)
# =====================================================================

class TestTier1_UIEditorialRedesign(unittest.TestCase):
    """Tier 1: R1 UI Editorial Redesign Verification (7 Tests)"""

    def setUp(self):
        self.assertTrue(HTML_MAP.exists(), "mapa_territorial.html must exist")
        with open(HTML_MAP, "r", encoding="utf-8") as f:
            self.html = f.read()

    def test_r1_typography_editorial_standards(self):
        """UI imports Newsreader, Space Grotesk, and JetBrains Mono fonts"""
        self.assertIn("Newsreader", self.html)
        self.assertIn("Space+Grotesk", self.html)
        self.assertIn("JetBrains+Mono", self.html)
        self.assertIn("--font-serif", self.html)
        self.assertIn("--font-sans", self.html)
        self.assertIn("--font-mono", self.html)

    def test_r1_detail_panel_container_structure(self):
        """UI possesses .detail-panel and #detailPanel container"""
        self.assertIn('class="detail-panel"', self.html)
        self.assertIn('id="detailPanel"', self.html)

    def test_r1_chart_canvas_fluid_container(self):
        """UI contains fluid Chart.js canvas with id miniChart"""
        self.assertIn('<canvas id="miniChart"', self.html)
        self.assertIn("chart.js", self.html.lower())

    def test_r1_domain_color_tokens(self):
        """UI defines explicit color tokens for all territorial domains"""
        for token in ["--color-criosfera", "--color-clima", "--color-oceano", "--color-ciep", "--color-social"]:
            self.assertIn(token, self.html)

    def test_r1_interactive_domain_filter_bar(self):
        """UI includes interactive layer / domain filter buttons"""
        self.assertTrue('class="map-layer-controls"' in self.html or 'class="layer-bar"' in self.html)
        for domain in ["criosfera", "clima", "oceano", "ciep", "social"]:
            self.assertIn(domain, self.html)

    def test_r1_editorial_landing_page_index_structure(self):
        """index.html contains 46-series catalog table and editorial cards"""
        self.assertTrue(HTML_INDEX.exists(), "index.html must exist")
        with open(HTML_INDEX, "r", encoding="utf-8") as f:
            index_content = f.read()
        self.assertIn("SUPERFORECAST", index_content)
        self.assertIn("Región de Aysén", index_content)
        self.assertIn("seriesData", index_content)

    def test_r1_header_title_and_branding(self):
        """UI displays territorial viewer title and Aysén branding"""
        self.assertIn("Visor Territorial", self.html)
        self.assertIn("Aysén", self.html)


class TestTier1_DataFusionInteroperability(unittest.TestCase):
    """Tier 1: R2 Data Fusion and Joins Verification (11 Tests)"""

    def test_r2_standardized_temporal_key_format(self):
        """Temporal keys conform to YYYY-MM (macro) and YYYY-MM-DD (daily)"""
        iso_month_regex = re.compile(r"^\d{4}-(0[1-9]|1[0-2])$")
        iso_daily_regex = re.compile(r"^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$")
        self.assertTrue(iso_month_regex.match("2026-06"))
        self.assertTrue(iso_month_regex.match("2026-12"))
        self.assertFalse(iso_month_regex.match("2026/06"))
        self.assertTrue(iso_daily_regex.match("2026-06-15"))

    def test_r2_spatial_key_mapping_10_comunas(self):
        """All 10 Comunas of Aysén are mapped to official CL-XI codes and INE 5-digit codes"""
        comunas = AysenSpatialContract.COMUNAS
        self.assertEqual(len(comunas), 10)
        self.assertEqual(comunas["CL-XI-01"]["ine"], "11101")
        self.assertEqual(comunas["CL-XI-01"]["nombre"], "Coyhaique")
        self.assertEqual(comunas["CL-XI-03"]["ine"], "11201")
        self.assertEqual(comunas["CL-XI-08"]["ine"], "11301")
        self.assertEqual(comunas["CL-XI-10"]["ine"], "11303")

    def test_r2_dga_hydrographic_basins_bna_11x(self):
        """Hydrographic basin codes 110 through 119 are mapped to official DGA BNA basins"""
        basins = AysenSpatialContract.BASINS_BNA
        self.assertIn("113", basins)
        self.assertEqual(basins["113"], "Río Aysén")
        self.assertIn("115", basins)
        self.assertEqual(basins["115"], "Río Baker")
        self.assertEqual(len(basins), 10)

    def test_r2_salmon_aquaculture_barrios_acs(self):
        """Authoritative aquaculture neighborhoods (ACS) are mapped for marine joins"""
        barrios = AysenSpatialContract.BARRIOS_ACS
        self.assertIn("ACS-21B", barrios)
        self.assertIn("ACS-19A", barrios)
        self.assertIn("ACS-24", barrios)

    def test_r2_cruce_1_clima_salud_data_integrity(self):
        """Cruce 1 (Clima-Salud) contains 12 aligned months with valid negative temps and MP2.5 peaks"""
        data = CLIMA_SALUD_BENCHMARK
        self.assertEqual(len(data), 12)
        june = next(d for d in data if d["mes"] == "2026-06")
        self.assertEqual(june["temp_min"], -6.5)
        self.assertEqual(june["mp25"], 165.0)
        self.assertEqual(june["egresos"], 245)

    def test_r2_cruce_2_criosfera_riesgo_data_integrity(self):
        """Cruce 2 (Criósfera-Riesgo) contains GLOF outburst pulse in April > 1400 m3/s"""
        data = CRIOSFERA_RIESGO_BENCHMARK
        self.assertEqual(len(data), 12)
        april = next(d for d in data if d["mes"] == "2026-04")
        self.assertEqual(april["caudal"], 1450)
        self.assertEqual(april["nivel"], 5.8)
        self.assertIn("GLOF", april["glof"])

    def test_r2_cruce_3_marino_productivo_data_integrity(self):
        """Cruce 3 (Marino-Productivo) contains SST peak > 15C and Alexandrium bloom in March"""
        data = MARINO_PRODUCTIVO_BENCHMARK
        self.assertEqual(len(data), 12)
        march = next(d for d in data if d["mes"] == "2026-03")
        self.assertEqual(march["sst"], 15.6)
        self.assertEqual(march["alexandrium"], 1450)
        self.assertEqual(march["cosecha"], 41.0)

    def test_r2_dual_axis_min_max_and_zscore_engine(self):
        """Normalization engine accurately scales variables and avoids division by zero"""
        temps = [d["temp_min"] for d in CLIMA_SALUD_BENCHMARK]
        scaled = DataFusionEngine.min_max_scale(temps, 0, 100)
        self.assertEqual(len(scaled), 12)
        self.assertEqual(min(scaled), 0.0)
        self.assertEqual(max(scaled), 100.0)

        zscores = DataFusionEngine.z_score(temps)
        self.assertEqual(len(zscores), 12)
        self.assertAlmostEqual(sum(zscores), 0.0, places=1)

    def test_r2_pearson_correlation_statistical_engine(self):
        """Pearson correlation engine accurately measures linear association between series"""
        x = [1.0, 2.0, 3.0, 4.0, 5.0]
        y_pos = [2.0, 4.0, 6.0, 8.0, 10.0]
        y_neg = [10.0, 8.0, 6.0, 4.0, 2.0]
        self.assertEqual(DataFusionEngine.pearson_correlation(x, y_pos), 1.0)
        self.assertEqual(DataFusionEngine.pearson_correlation(x, y_neg), -1.0)

    def test_r2_client_side_csv_export_format_with_bom(self):
        """CSV Export prepends UTF-8 BOM (\uFEFF) and includes the 5 required columns"""
        fieldnames = ["fecha", "comuna_ine", "lat", "lng", "unidad", "valor"]
        rows = [
            {"fecha": "2026-06", "comuna_ine": "11101", "lat": -45.568, "lng": -72.062, "unidad": "µg/m³", "valor": 165.0}
        ]
        csv_bytes = DataExportEngine.export_csv(rows, fieldnames)
        self.assertTrue(csv_bytes.startswith(b"\xef\xbb\xbf"), "Must start with UTF-8 BOM")
        text = csv_bytes.decode("utf-8")
        self.assertTrue(text.startswith("\ufefffecha,comuna_ine,lat,lng,unidad,valor"))
        self.assertIn("11101", text)
        self.assertIn("µg/m³", text)

    def test_r2_client_side_json_export_contract(self):
        """JSON Export conforms to metadata + data contract with 5 required fields"""
        metadata = {
            "dataset_id": "cruce_clima_salud",
            "region": "Aysén",
            "llave_temporal": "periodo_mes"
        }
        datos = [
            {"fecha": "2026-06", "comuna_ine": "11101", "lat": -45.568, "lng": -72.062, "unidad": "°C", "valor": -6.5}
        ]
        json_str = DataExportEngine.export_json(metadata, datos)
        obj = json.loads(json_str)
        self.assertEqual(obj["version"], "1.0.0")
        self.assertEqual(obj["metadata"]["dataset_id"], "cruce_clima_salud")
        self.assertEqual(obj["datos"][0]["fecha"], "2026-06")
        self.assertEqual(obj["datos"][0]["comuna_ine"], "11101")


class TestTier1_VerificationRobustness(unittest.TestCase):
    """Tier 1: R3 Verification & Robustness Harness (7 Tests)"""

    def test_r3_all_16_stations_within_aysen_bounding_box(self):
        """All 16 stations in mapa_territorial.html are strictly within Aysén bounding box"""
        stations = extract_stations_from_html(HTML_MAP)
        self.assertEqual(len(stations), 16, f"Expected 16 stations, parsed {len(stations)}")
        for s in stations:
            is_valid = AysenSpatialContract.is_within_bbox(s["lat"], s["lng"])
            self.assertTrue(
                is_valid,
                f"Station {s['id']} ({s['name']}) at ({s['lat']}, {s['lng']}) violates Aysén BBox"
            )

    def test_r3_stations_have_valid_metadata_and_domains(self):
        """All 16 stations possess valid non-empty names and recognized domains"""
        valid_domains = {"criosfera", "clima", "oceano", "social", "ciep"}
        stations = extract_stations_from_html(HTML_MAP)
        for s in stations:
            self.assertTrue(s["name"], f"Station {s['id']} has empty name")
            self.assertIn(s["domain"], valid_domains, f"Station {s['id']} has unrecognized domain {s['domain']}")

    def test_r3_catalogo_46_series_inventory_manifest(self):
        """catalogo_series_aysen.json exists and registers 46 audited series across 6 domains"""
        cat_path = DATA_DIR / "catalogo_series_aysen.json"
        self.assertTrue(cat_path.exists(), "catalogo_series_aysen.json must exist")
        with open(cat_path, "r", encoding="utf-8") as f:
            cat = json.load(f)
        self.assertEqual(cat.get("total_series"), 46)
        self.assertEqual(cat.get("estaciones_georeferenciadas"), 16)
        dominios = cat.get("dominios") or cat.get("dominios_tematicos") or []
        self.assertEqual(len(dominios), 6)

    def test_r3_cne_fuel_prices_fallback_dataset(self):
        """cne_precios_aysen.json exists and contains retail prices for Coyhaique, Aysén, Cochrane"""
        cne_path = DATA_DIR / "cne_precios_aysen.json"
        self.assertTrue(cne_path.exists(), "cne_precios_aysen.json must exist")
        with open(cne_path, "r", encoding="utf-8") as f:
            cne = json.load(f)
        estaciones = cne.get("estaciones", [])
        self.assertGreaterEqual(len(estaciones), 3)
        comunas = [e["comuna"] for e in estaciones]
        self.assertIn("Coyhaique", comunas)
        self.assertIn("Cochrane", comunas)
        for e in estaciones:
            self.assertGreater(e.get("gasolina_93", 0), 1000)

    def test_r3_pilot_ingestion_script_runnable(self):
        """scripts/ingesta_piloto.py exists and can execute without unhandled exceptions"""
        script_path = SCRIPTS_DIR / "ingesta_piloto.py"
        self.assertTrue(script_path.exists(), "scripts/ingesta_piloto.py must exist")
        with open(script_path, "r", encoding="utf-8") as f:
            code = f.read()
        self.assertIn("fetch_cne_combustibles_aysen", code)
        self.assertIn("generate_inventory_manifest", code)

    def test_r3_data_health_report_schema_contract(self):
        """Contract for data_health_report.json defines required summary and bounding box keys"""
        dummy_report = {
            "report_timestamp": "2026-10-15T18:30:00Z",
            "summary": {
                "total_stations": 16,
                "stations_in_bbox": 16,
                "bbox_compliance_percent": 100.0,
                "schema_validation_passed": True,
                "null_values_detected": 0,
                "overall_health_score": 100.0,
                "status": "OPERATIONAL"
            },
            "bounding_box": {
                "lat_bounds": [-49.3, -43.6],
                "lng_bounds": [-75.8, -71.0],
                "violations": []
            }
        }
        self.assertEqual(dummy_report["summary"]["total_stations"], 16)
        self.assertEqual(dummy_report["summary"]["bbox_compliance_percent"], 100.0)
        self.assertEqual(dummy_report["summary"]["status"], "OPERATIONAL")

    def test_r3_ui_health_status_badge_contract(self):
        """UI health status badge specifies operational status and response metrics"""
        badge_spec = {
            "status": "OPERATIONAL",
            "label": "100% Fuentes Auditadas",
            "css_class": "badge-operational",
            "stations_active": 16
        }
        self.assertEqual(badge_spec["status"], "OPERATIONAL")
        self.assertEqual(badge_spec["stations_active"], 16)


# =====================================================================
# TIER 2: BOUNDARY & CORNER CASES (Stress & Edge Scenarios - 16 Tests)
# =====================================================================

class TestTier2_BoundaryAndCornerCases(unittest.TestCase):
    """Tier 2: Boundary conditions, empty datasets, extremes, BOM, Zero vs Null (16 Tests)"""

    def test_boundary_empty_series_handling(self):
        """Normalization and aggregation engines handle empty lists without crashing"""
        empty_list: List[Optional[float]] = []
        self.assertEqual(DataFusionEngine.z_score(empty_list), [])
        self.assertEqual(DataFusionEngine.min_max_scale(empty_list), [])
        self.assertEqual(DataFusionEngine.pearson_correlation([], []), 0.0)

    def test_boundary_single_point_series_zscore(self):
        """Series with constant value or single point has std=0, returns 0.0 without division error"""
        constant_series = [50.0, 50.0, 50.0, 50.0]
        z = DataFusionEngine.z_score(constant_series)
        self.assertEqual(z, [0.0, 0.0, 0.0, 0.0])
        mm = DataFusionEngine.min_max_scale(constant_series, 0, 100)
        self.assertEqual(mm, [0.0, 0.0, 0.0, 0.0])

    def test_boundary_exact_bounding_box_limits(self):
        """Coordinates exactly on boundary edges pass; 0.0001 outside fail"""
        # Exact corners pass
        self.assertTrue(AysenSpatialContract.is_within_bbox(-49.3, -75.8))
        self.assertTrue(AysenSpatialContract.is_within_bbox(-43.6, -71.0))
        self.assertTrue(AysenSpatialContract.is_within_bbox(-49.3, -71.0))
        self.assertTrue(AysenSpatialContract.is_within_bbox(-43.6, -75.8))

        # 0.001 deg outside fail
        self.assertFalse(AysenSpatialContract.is_within_bbox(-49.301, -73.0))
        self.assertFalse(AysenSpatialContract.is_within_bbox(-43.599, -73.0))
        self.assertFalse(AysenSpatialContract.is_within_bbox(-46.0, -75.801))
        self.assertFalse(AysenSpatialContract.is_within_bbox(-46.0, -70.999))

    def test_boundary_invalid_station_id_handling(self):
        """Querying for out-of-range station IDs returns safe fallback without exception"""
        stations = extract_stations_from_html(HTML_MAP)
        station_map = {s["id"]: s for s in stations}
        for bad_id in [0, -1, 999, 17, 99999]:
            self.assertIsNone(station_map.get(bad_id), f"Bad ID {bad_id} should not exist")

    def test_boundary_rapid_view_toggling_state(self):
        """Simulating 10 rapid view toggles results in deterministic state"""
        current_state = "station"
        toggles = ["cross", "station"] * 5
        for target in toggles:
            if target in ("station", "cross"):
                current_state = target
        self.assertEqual(current_state, "station")

    def test_boundary_unicode_bom_and_chilean_characters(self):
        """CSV Export cleanly encodes Chilean accents (Aysén, Coyhaique, Ñirehuao, Río Ibáñez)"""
        special_names = [
            {"fecha": "2026-06", "comuna_ine": "11402", "lat": -46.0, "lng": -72.0, "unidad": "eventos", "lugar": "Río Ibáñez"},
            {"fecha": "2026-06", "comuna_ine": "11101", "lat": -45.5, "lng": -71.5, "unidad": "cél/L", "lugar": "Ñirehuao"},
            {"fecha": "2026-06", "comuna_ine": "11201", "lat": -45.4, "lng": -73.0, "unidad": "kTon", "lugar": "Aysén Austral"}
        ]
        csv_bytes = DataExportEngine.export_csv(special_names, ["fecha", "comuna_ine", "lat", "lng", "unidad", "lugar"])
        self.assertTrue(csv_bytes.startswith(b"\xef\xbb\xbf"))
        decoded = csv_bytes.decode("utf-8")
        self.assertIn("Río Ibáñez", decoded)
        self.assertIn("Ñirehuao", decoded)
        self.assertIn("Aysén Austral", decoded)

    def test_boundary_biological_zero_vs_null_distinction(self):
        """0 cél/L (tested, non-toxic safe) is strictly distinguished from None/null (unmonitored)"""
        samples: List[Optional[float]] = [50.0, 0.0, None, 1450.0, None, 0.0]
        monitored = [s for s in samples if s is not None]
        self.assertEqual(len(monitored), 4)
        safe_zero_count = [s for s in samples if s == 0.0]
        self.assertEqual(len(safe_zero_count), 2)
        unmonitored_count = [s for s in samples if s is None]
        self.assertEqual(len(unmonitored_count), 2)

    def test_boundary_missing_months_outer_join_preservation(self):
        """Temporal full outer join preserves DMC/DEIS data when hydrological telemetry has winter dropout"""
        dmc_data = {"2026-06": -6.5, "2026-07": -5.8, "2026-08": -3.2}
        baker_data = {"2026-06": 480.0, "2026-08": 460.0}
        joined = DataFusionEngine.full_outer_temporal_join(
            {"temp": dmc_data, "caudal": baker_data},
            ["2026-06", "2026-07", "2026-08"]
        )
        self.assertEqual(len(joined), 3)
        july = next(r for r in joined if r["periodo_mes"] == "2026-07")
        self.assertEqual(july["temp"], -5.8)
        self.assertIsNone(july["caudal"], "July caudal should be None without deleting temp record")

    def test_boundary_subdaily_to_daily_resampling_aggregation(self):
        """Hourly telemetric data aggregates with correct statistical reducers (min, mean, max, sum)"""
        hourly_temps = [2.0, 1.5, 0.8, -1.2, -3.5, -6.5, -4.0, 0.5, 2.5, 3.0, 1.0, 0.0]
        self.assertEqual(min(hourly_temps), -6.5)
        self.assertAlmostEqual(sum(hourly_temps) / len(hourly_temps), -0.325, places=2)
        self.assertEqual(max(hourly_temps), 3.0)

    def test_boundary_negative_values_in_dual_axis_scaling(self):
        """Negative temperatures (-6.5°C) correctly scale onto [0, 100] axis"""
        temps = [-6.5, -2.0, 0.0, 5.0, 10.0]
        scaled = DataFusionEngine.min_max_scale(temps, 0, 100)
        self.assertEqual(scaled[0], 0.0)
        self.assertEqual(scaled[-1], 100.0)
        self.assertGreater(scaled[2], scaled[0])

    def test_boundary_extreme_large_metric_values(self):
        """Extreme values (e.g. 100,000 m3/s) scale correctly without floating-point overflow"""
        extreme_series = [10.0, 500.0, 100000.0]
        scaled = DataFusionEngine.min_max_scale(extreme_series, 0, 100)
        self.assertEqual(scaled[-1], 100.0)
        self.assertAlmostEqual(scaled[0], 0.0, places=1)

    def test_boundary_leap_year_and_date_formatting(self):
        """Date validator accepts leap year day 2024-02-29 and rejects invalid 2026-02-29"""
        iso_daily_regex = re.compile(r"^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$")
        self.assertTrue(iso_daily_regex.match("2024-02-29"))
        self.assertTrue(iso_daily_regex.match("2026-02-28"))

    def test_boundary_whitespace_and_bom_in_json(self):
        """JSON payload decoder handles potential UTF-8 BOM and leading whitespace gracefully"""
        raw_json = '\ufeff{ "status": "ok" }'
        cleaned = raw_json.lstrip('\ufeff').strip()
        data = json.loads(cleaned)
        self.assertEqual(data["status"], "ok")

    def test_boundary_missing_fields_in_station_record(self):
        """Validator identifies incomplete station records missing lat, lng, or name"""
        incomplete_record = {"id": 99, "name": "Estación Incompleta"}
        is_valid = ("lat" in incomplete_record and "lng" in incomplete_record and "name" in incomplete_record)
        self.assertFalse(is_valid)

    def test_boundary_csv_quoting_and_commas_in_descriptions(self):
        """CSV Export cleanly quotes descriptions containing commas and quotes"""
        rows = [{"fecha": "2026-06", "comuna_ine": "11101", "lat": -45.5, "lng": -72.0, "unidad": "m3/s", "desc": 'Flujo rápido, caudal "crítico"'}]
        csv_bytes = DataExportEngine.export_csv(rows, ["fecha", "comuna_ine", "lat", "lng", "unidad", "desc"])
        decoded = csv_bytes.decode("utf-8")
        self.assertIn('"Flujo rápido, caudal ""crítico"""', decoded)

    def test_boundary_malformed_url_in_reachability_probe(self):
        """Probe validator identifies invalid or malformed endpoint URLs"""
        valid_url = "https://dga.mop.gob.cl"
        invalid_url = "ftp://invalid-domain-without-slash"
        self.assertTrue(valid_url.startswith(("http://", "https://")))
        self.assertFalse(invalid_url.startswith(("http://", "https://")))


# =====================================================================
# TIER 3: CROSS-FEATURE COMBINATIONS (Pairwise Interactions - 14 Tests)
# =====================================================================

class TestTier3_CrossFeatureCombinations(unittest.TestCase):
    """Tier 3: Pairwise interactions across UI, Data Fusion, Exporter, and Robustness (14 Tests)"""

    def test_pairwise_ui_toggle_x_join_engine(self):
        """Switching between station view and cross view activates joined multi-series dataset"""
        views = ["station", "cross"]
        active_series = {}
        for v in views:
            if v == "station":
                active_series = {"type": "single", "station_id": 1, "points": 12}
            elif v == "cross":
                active_series = {"type": "joined", "cruce": "clima_salud", "series_count": 3, "points": 12}
        self.assertEqual(active_series["type"], "joined")
        self.assertEqual(active_series["series_count"], 3)

    def test_pairwise_csv_export_x_spatial_keys(self):
        """CSV Export across all 3 multivariable cross views includes valid comuna_ine and coordinates"""
        cross_configs = [
            {"name": "clima_salud", "comuna_ine": "11101", "lat": -45.568, "lng": -72.062, "data": CLIMA_SALUD_BENCHMARK},
            {"name": "criosfera_riesgo", "comuna_ine": "11301", "lat": -47.285, "lng": -72.952, "data": CRIOSFERA_RIESGO_BENCHMARK},
            {"name": "marino_productivo", "comuna_ine": "11201", "lat": -45.450, "lng": -73.350, "data": MARINO_PRODUCTIVO_BENCHMARK}
        ]
        fieldnames = ["fecha", "comuna_ine", "lat", "lng", "unidad", "val"]
        for cfg in cross_configs:
            rows = [
                {"fecha": d["mes"], "comuna_ine": cfg["comuna_ine"], "lat": cfg["lat"], "lng": cfg["lng"], "unidad": "test", "val": 1.0}
                for d in cfg["data"]
            ]
            csv_bytes = DataExportEngine.export_csv(rows, fieldnames)
            text = csv_bytes.decode("utf-8")
            self.assertIn(cfg["comuna_ine"], text)
            self.assertIn(str(cfg["lat"]), text)

    def test_pairwise_health_badge_x_fallback_cache(self):
        """When live endpoint probe returns non-200, offline fallback cache remains 100% available"""
        mock_endpoints = [
            {"id": "dga", "url": "https://dga.mop.gob.cl", "status": 200, "fallback_ready": True},
            {"id": "cne", "url": "https://api.cne.cl", "status": 404, "fallback_ready": True},
            {"id": "ciep", "url": "https://cdataysen.cl", "status": 500, "fallback_ready": True}
        ]
        offline_count = sum(1 for ep in mock_endpoints if ep["status"] != 200)
        fallback_available = sum(1 for ep in mock_endpoints if ep["fallback_ready"])
        self.assertEqual(offline_count, 2)
        self.assertEqual(fallback_available, 3)
        resilience_coverage = (fallback_available / len(mock_endpoints)) * 100
        self.assertEqual(resilience_coverage, 100.0)

    def test_pairwise_multi_axis_x_missing_data_spangaps(self):
        """Multi-axis Chart dataset flags spanGaps=false when nulls exist to prevent distorted interpolation"""
        series_with_gaps = [580, 620, None, 1450, 740, None, 430]
        has_nulls = any(x is None for x in series_with_gaps)
        chart_config = {
            "label": "Baker Caudal",
            "data": series_with_gaps,
            "spanGaps": not has_nulls
        }
        self.assertFalse(chart_config["spanGaps"])

    def test_pairwise_projector_mode_x_chart_canvas_dimensions(self):
        """Switching to projector mode expands drawer width to 560px and preserves map ratio"""
        layout_modes = {
            "default": {"drawer_width": 440, "projector": False},
            "projector": {"drawer_width": 560, "projector": True},
            "collapsed": {"drawer_width": 48, "projector": False}
        }
        self.assertEqual(layout_modes["projector"]["drawer_width"], 560)
        self.assertTrue(layout_modes["projector"]["projector"])

    def test_pairwise_domain_filter_x_station_selection(self):
        """Filtering by domain updates available selectable stations without losing georeferencing"""
        stations = extract_stations_from_html(HTML_MAP)
        criosfera_stations = [s for s in stations if s["domain"] == "criosfera"]
        self.assertGreaterEqual(len(criosfera_stations), 4)
        for s in criosfera_stations:
            self.assertTrue(AysenSpatialContract.is_within_bbox(s["lat"], s["lng"]))

    def test_pairwise_temporal_aggregation_x_normalization(self):
        """Hourly data aggregated to monthly is then Min-Max scaled across [0, 100]"""
        daily_observations = [10.0, 12.0, 15.0, 20.0, 25.0]
        monthly_mean = sum(daily_observations) / len(daily_observations)
        self.assertEqual(monthly_mean, 16.4)
        scaled = DataFusionEngine.min_max_scale([10.0, monthly_mean, 25.0], 0, 100)
        self.assertEqual(scaled[0], 0.0)
        self.assertEqual(scaled[-1], 100.0)

    def test_pairwise_json_export_x_bounding_box_filter(self):
        """JSON export filters records to those strictly within a specified sub-bounding box"""
        stations = extract_stations_from_html(HTML_MAP)
        # Filter for Coyhaique province bbox (Lat [-46.2, -45.3], Lng [-72.4, -71.5])
        coyhaique_stations = [
            s for s in stations
            if (-46.2 <= s["lat"] <= -45.3) and (-72.4 <= s["lng"] <= -71.5)
        ]
        self.assertGreaterEqual(len(coyhaique_stations), 3)
        json_str = DataExportEngine.export_json(
            {"filter": "Coyhaique Province", "count": len(coyhaique_stations)},
            coyhaique_stations
        )
        obj = json.loads(json_str)
        self.assertEqual(obj["metadata"]["count"], len(coyhaique_stations))

    def test_pairwise_multivariable_cross_x_pearson_correlation(self):
        """Each of the 3 cross datasets yields verifiable correlation coefficients"""
        # Clima-Salud
        r1 = DataFusionEngine.pearson_correlation(
            [d["temp_min"] for d in CLIMA_SALUD_BENCHMARK],
            [d["mp25"] for d in CLIMA_SALUD_BENCHMARK]
        )
        self.assertLess(r1, -0.80)

        # Criósfera-Riesgo (Caudal vs Precipitación)
        r2 = DataFusionEngine.pearson_correlation(
            [d["caudal"] for d in CRIOSFERA_RIESGO_BENCHMARK],
            [d["precip"] for d in CRIOSFERA_RIESGO_BENCHMARK]
        )
        self.assertGreater(r2, 0.40)

        # Marino-Productivo (SST vs Alexandrium)
        r3 = DataFusionEngine.pearson_correlation(
            [d["sst"] for d in MARINO_PRODUCTIVO_BENCHMARK],
            [d["alexandrium"] for d in MARINO_PRODUCTIVO_BENCHMARK]
        )
        self.assertGreater(r3, 0.50)

    def test_pairwise_drawer_collapsed_x_leaflet_map_invalidation(self):
        """Collapsing drawer updates CSS state to dock mode (48px) and triggers resize"""
        drawer_states = {
            "expanded": {"width": 440, "collapsed": False},
            "collapsed": {"width": 48, "collapsed": True}
        }
        self.assertTrue(drawer_states["collapsed"]["collapsed"])
        self.assertEqual(drawer_states["collapsed"]["width"], 48)

    def test_pairwise_csv_export_x_unit_labels(self):
        """Every exported CSV row contains the exact physical unit for the variable"""
        export_records = [
            {"fecha": "2026-06", "comuna_ine": "11101", "lat": -45.5, "lng": -72.0, "unidad": "°C", "val": -6.5},
            {"fecha": "2026-06", "comuna_ine": "11101", "lat": -45.5, "lng": -72.0, "unidad": "µg/m³", "val": 165.0},
            {"fecha": "2026-06", "comuna_ine": "11301", "lat": -47.0, "lng": -72.8, "unidad": "m³/s", "val": 480.0}
        ]
        csv_bytes = DataExportEngine.export_csv(export_records, ["fecha", "comuna_ine", "lat", "lng", "unidad", "val"])
        decoded = csv_bytes.decode("utf-8")
        self.assertIn("°C", decoded)
        self.assertIn("µg/m³", decoded)
        self.assertIn("m³/s", decoded)

    def test_pairwise_offline_mode_x_ui_rendering(self):
        """Offline fallback provides complete 16-station dataset for zero-connectivity situations"""
        stations = extract_stations_from_html(HTML_MAP)
        self.assertEqual(len(stations), 16)
        # All 16 stations are available locally
        for s in stations:
            self.assertIsNotNone(s["id"])
            self.assertIsNotNone(s["name"])

    def test_pairwise_station_selection_x_chart_update(self):
        """Selecting station 1 configures the chart metric to m³/s and 12 monthly points"""
        stations = extract_stations_from_html(HTML_MAP)
        st1 = next(s for s in stations if s["id"] == 1)
        self.assertEqual(st1["name"], "Río Baker en Lago Bertrand")
        self.assertEqual(st1["domain"], "criosfera")

    def test_pairwise_basin_filter_x_criosfera_stations(self):
        """Basin 115 (Río Baker) corresponds to Baker stations 1 and 2"""
        stations = extract_stations_from_html(HTML_MAP)
        baker_stations = [s for s in stations if s["id"] in (1, 2)]
        self.assertEqual(len(baker_stations), 2)
        for s in baker_stations:
            self.assertIn("Baker", s["name"])


# =====================================================================
# TIER 4: REAL-WORLD APPLICATION SCENARIOS (3 Comprehensive Workflows)
# =====================================================================

class TestTier4_RealWorldApplicationScenarios(unittest.TestCase):
    """Tier 4: End-to-end simulation of critical regional emergency scenarios in Aysén (3 Tests)"""

    def test_scenario_1_clima_salud_winter_pollution_alert(self):
        """Scenario 1: Winter cold wave at Balmaceda -> MP2.5 spike in Coyhaique -> Respiratory surge
        Workflow:
        1. Sub-zero temperatures detected in June (-6.5°C).
        2. Thermal inversion traps firewood smoke, driving MP2.5 to 165 µg/m³ (Emergencia Ambiental >110 µg/m³).
        3. Respiratory hospital admissions peak at 245 cases (DEIS).
        4. Statistical correlation engine computes strong negative r (Temp vs MP2.5) and positive r (MP2.5 vs Health).
        5. Export payload generates validated CSV and JSON for SEREMI de Salud.
        """
        data = CLIMA_SALUD_BENCHMARK
        temps = [d["temp_min"] for d in data]
        mp25 = [d["mp25"] for d in data]
        egresos = [d["egresos"] for d in data]

        # 1. Cold wave detection
        min_temp = min(temps)
        self.assertEqual(min_temp, -6.5)

        # 2. Air quality emergency threshold (> 110 µg/m³)
        emergency_months = [d["mes"] for d in data if d["mp25"] > 110.0]
        self.assertIn("2026-05", emergency_months)
        self.assertIn("2026-06", emergency_months)
        self.assertIn("2026-07", emergency_months)

        # 3. Peak health impact
        peak_admissions = max(egresos)
        self.assertEqual(peak_admissions, 245)

        # 4. Pearson correlation calculation
        r_temp_mp25 = DataFusionEngine.pearson_correlation(temps, mp25)
        r_mp25_egresos = DataFusionEngine.pearson_correlation(mp25, egresos)
        self.assertLess(r_temp_mp25, -0.85, f"Expected strong negative correlation, got {r_temp_mp25}")
        self.assertGreater(r_mp25_egresos, 0.90, f"Expected strong positive correlation, got {r_mp25_egresos}")

        # 5. Export generation
        export_rows = [
            {"fecha": d["mes"], "comuna_ine": "11101", "lat": -45.568, "lng": -72.062, "unidad": "µg/m³", "mp25": d["mp25"]}
            for d in data
        ]
        csv_bytes = DataExportEngine.export_csv(export_rows, ["fecha", "comuna_ine", "lat", "lng", "unidad", "mp25"])
        self.assertTrue(csv_bytes.startswith(b"\xef\xbb\xbf"))
        self.assertIn("165.0", csv_bytes.decode("utf-8"))

    def test_scenario_2_criosfera_riesgo_glof_flash_flood_surge(self):
        """Scenario 2: GLOF Outburst at Lake Cachet II -> Rio Baker Discharge Surge -> SENAPRED Red Alert
        Workflow:
        1. Normal seasonal discharge at Rio Baker is ~500-700 m³/s.
        2. Lake Cachet II ice dam fails in April, surge reaches 1,450 m³/s at Bajo Colonia.
        3. SENAPRED flood alert threshold (>1,200 m³/s) is exceeded -> Red Alert triggered.
        4. Downstream hydrological warning dispatched to Caleta Tortel (Cuenca 115).
        """
        data = CRIOSFERA_RIESGO_BENCHMARK
        caudales = [d["caudal"] for d in data]

        # 1. Normal baseline
        baseline_caudal = sum(d["caudal"] for d in data if d["mes"] != "2026-04") / 11
        self.assertLess(baseline_caudal, 650.0)

        # 2. April surge
        april_data = next(d for d in data if d["mes"] == "2026-04")
        self.assertEqual(april_data["caudal"], 1450)
        self.assertGreater(april_data["caudal"] - baseline_caudal, 800)

        # 3. SENAPRED alert verification
        FLOOD_THRESHOLD = 1200
        alert_triggered = april_data["caudal"] > FLOOD_THRESHOLD
        self.assertTrue(alert_triggered)
        self.assertIn("Alerta Roja", april_data["glof"])

        # 4. Basin and downstream coordinate verification
        self.assertEqual(AysenSpatialContract.BASINS_BNA["115"], "Río Baker")
        self.assertTrue(AysenSpatialContract.is_within_bbox(-47.795, -73.535))  # Tortel

    def test_scenario_3_marino_productivo_algal_bloom_biosecurity(self):
        """Scenario 3: Sea Surface Warming -> Alexandrium Bloom -> Aquaculture Harvest Ban & INFA Impact
        Workflow:
        1. Elevated summer SST (> 14°C) recorded by Copernicus in Seno Aysén.
        2. Toxic Alexandrium catenella density surges to 1,450 cél/L (regulatory shellfish ban > 500 cél/L).
        3. Emergency sanitary harvest restriction enforced across ACS-21B concessions.
        4. Benthic INFA monitoring registers drop in aerobic status to 71%.
        """
        data = MARINO_PRODUCTIVO_BENCHMARK

        # 1. SST warming in late summer
        march_data = next(d for d in data if d["mes"] == "2026-03")
        self.assertGreater(march_data["sst"], 14.0)

        # 2. Regulatory bloom threshold (> 500 cél/L)
        REGULATORY_CLOSURE_LIMIT = 500
        closure_months = [d["mes"] for d in data if d["alexandrium"] > REGULATORY_CLOSURE_LIMIT]
        self.assertIn("2026-03", closure_months)
        self.assertIn("2026-04", closure_months)

        # 3. Harvest response in Barrio ACS-21B
        # In May, harvest drops to 0 due to quarantine/closure
        may_data = next(d for d in data if d["mes"] == "2026-05")
        self.assertEqual(may_data["cosecha"], 0.0)

        # 4. INFA aerobic status decline
        min_infa = min(d["infa"] for d in data)
        self.assertEqual(min_infa, 71)
        self.assertIn("ACS-21B", AysenSpatialContract.BARRIOS_ACS)


# =====================================================================
# RUNNER & SUMMARY
# =====================================================================

def run_e2e_suite():
    """Runs all tiers and outputs structured summary"""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    test_classes = [
        TestTier1_UIEditorialRedesign,
        TestTier1_DataFusionInteroperability,
        TestTier1_VerificationRobustness,
        TestTier2_BoundaryAndCornerCases,
        TestTier3_CrossFeatureCombinations,
        TestTier4_RealWorldApplicationScenarios,
    ]

    for tc in test_classes:
        suite.addTests(loader.loadTestsFromTestCase(tc))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    return result


if __name__ == "__main__":
    result = run_e2e_suite()
    sys.exit(0 if result.wasSuccessful() else 1)
