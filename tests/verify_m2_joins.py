#!/usr/bin/env python3
"""
M2 Verification Suite: Cross-Database Interoperability & Join Engine (Requirement R2)
===================================================================================
Executes exhaustive tests validating:
1. Canonical dataset: data/estaciones_aysen.json
2. Benchmark joins dataset: data/cruces_multivariables.json
3. Viewer integration & Export engine: mapa_territorial.html
4. Statistical fidelity & Key normalization contracts

Compatible with Python 3.11 Standard Library.
"""

import os
import sys
import json
import re
import math
import unittest
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "data"
HTML_MAP = REPO_ROOT / "mapa_territorial.html"
ESTACIONES_JSON = DATA_DIR / "estaciones_aysen.json"
CRUCES_JSON = DATA_DIR / "cruces_multivariables.json"


# Aysén Geographic Boundaries (per ORIGINAL_REQUEST.md & survey_spec_miner_2)
BBOX_LAT_MIN = -49.3
BBOX_LAT_MAX = -43.6
BBOX_LNG_MIN = -75.8
BBOX_LNG_MAX = -71.0

VALID_COMUNAS_INE = {
    "11101": "Coyhaique",
    "11102": "Lago Verde",
    "11201": "Aysén",
    "11202": "Cisnes",
    "11203": "Guaitecas",
    "11301": "Cochrane",
    "11302": "O'Higgins",
    "11303": "Tortel",
    "11401": "Chile Chico",
    "11402": "Río Ibáñez"
}

VALID_CODIGOS_COMUNA = {
    f"CL-XI-{i:02d}" for i in range(1, 11)
}

VALID_CUENCAS = {f"11{i}" for i in range(10)}

EXPECTED_MONTHS = [f"2026-{m:02d}" for m in range(1, 13)]
EXPECTED_DATES = [f"2026-{m:02d}-15" for m in range(1, 13)]


def calculate_pearson_r(x, y):
    """Calculate Pearson correlation coefficient between two numeric lists."""
    if len(x) != len(y) or len(x) < 2:
        return 0.0
    n = len(x)
    mean_x = sum(x) / n
    mean_y = sum(y) / n
    num = sum((xi - mean_x) * (yi - mean_y) for xi, yi in zip(x, y))
    den_x = math.sqrt(sum((xi - mean_x) ** 2 for xi in x))
    den_y = math.sqrt(sum((yi - mean_y) ** 2 for yi in y))
    if den_x == 0 or den_y == 0:
        return 0.0
    return num / (den_x * den_y)


class TestM2CanonicalStations(unittest.TestCase):
    """Validates data/estaciones_aysen.json schema and completeness (16 stations)"""

    @classmethod
    def setUpClass(cls):
        cls.assertTrue(ESTACIONES_JSON.exists(), f"File {ESTACIONES_JSON} must exist")
        with open(ESTACIONES_JSON, "r", encoding="utf-8") as f:
            cls.data = json.load(f)

    def test_01_json_root_structure(self):
        """Root structure contains version, dataset_id, and 16 stations"""
        self.assertEqual(self.data.get("version"), "1.0.0")
        self.assertEqual(self.data.get("dataset_id"), "estaciones_aysen_canonical")
        self.assertEqual(self.data.get("total_estaciones"), 16)
        self.assertIn("estaciones", self.data)
        self.assertEqual(len(self.data["estaciones"]), 16)

    def test_02_bounding_box_compliance(self):
        """All 16 stations are strictly within Aysén bounding box"""
        for s in self.data["estaciones"]:
            lat = s.get("lat")
            lng = s.get("lng")
            self.assertIsNotNone(lat, f"Station {s.get('id')} has no lat")
            self.assertIsNotNone(lng, f"Station {s.get('id')} has no lng")
            self.assertTrue(
                BBOX_LAT_MIN <= lat <= BBOX_LAT_MAX,
                f"Station {s.get('id')} lat {lat} outside [{BBOX_LAT_MIN}, {BBOX_LAT_MAX}]"
            )
            self.assertTrue(
                BBOX_LNG_MIN <= lng <= BBOX_LNG_MAX,
                f"Station {s.get('id')} lng {lng} outside [{BBOX_LNG_MIN}, {BBOX_LNG_MAX}]"
            )

    def test_03_standardized_spatial_keys(self):
        """All 16 stations have valid codigo_comuna, comuna_ine, and codigo_cuenca"""
        for s in self.data["estaciones"]:
            s_id = s.get("id")
            cod_comuna = s.get("codigo_comuna")
            comuna_ine = s.get("comuna_ine")
            cod_cuenca = s.get("codigo_cuenca")

            self.assertIn(cod_comuna, VALID_CODIGOS_COMUNA, f"Station {s_id} invalid codigo_comuna: {cod_comuna}")
            self.assertIn(comuna_ine, VALID_COMUNAS_INE, f"Station {s_id} invalid comuna_ine: {comuna_ine}")
            self.assertIn(cod_cuenca, VALID_CUENCAS, f"Station {s_id} invalid codigo_cuenca: {cod_cuenca}")

            # Marine stations check
            barrio_acs = s.get("codigo_barrio_acs")
            if s.get("dominio") in ["oceano", "marino"]:
                self.assertIsNotNone(barrio_acs, f"Marine station {s_id} should have codigo_barrio_acs")
                self.assertTrue(barrio_acs.startswith("ACS-"), f"Station {s_id} invalid ACS code {barrio_acs}")

    def test_04_temporal_series_integrity(self):
        """All 16 stations have exactly 12 non-null monthly values for 2026"""
        for s in self.data["estaciones"]:
            s_id = s.get("id")
            series = s.get("serie_temporal")
            self.assertIsInstance(series, list, f"Station {s_id} missing serie_temporal list")
            self.assertEqual(len(series), 12, f"Station {s_id} series must have 12 months, found {len(series)}")

            for idx, item in enumerate(series):
                self.assertEqual(item.get("periodo_mes"), EXPECTED_MONTHS[idx])
                self.assertEqual(item.get("fecha"), EXPECTED_DATES[idx])
                self.assertIsInstance(item.get("valor"), (int, float), f"Station {s_id} month {idx} non-numeric valor")
                self.assertIsNotNone(item.get("unidad"), f"Station {s_id} month {idx} missing unidad")
                self.assertEqual(item.get("unidad"), s.get("unidad"))

    def test_05_no_null_mandatory_fields(self):
        """Zero null values in mandatory descriptive fields across all 16 stations"""
        mandatory_fields = [
            "id", "nombre", "categoria", "dominio", "lat", "lng",
            "codigo_comuna", "comuna_ine", "nombre_comuna", "provincia",
            "codigo_cuenca", "nombre_cuenca", "codigo_estacion", "institucion",
            "frecuencia", "tipo_acceso", "descripcion", "unidad", "etiqueta_metrica"
        ]
        for s in self.data["estaciones"]:
            for field in mandatory_fields:
                self.assertIsNotNone(s.get(field), f"Station {s.get('id')} field '{field}' is None")
                self.assertNotEqual(s.get(field), "", f"Station {s.get('id')} field '{field}' is empty string")


class TestM2MultivariableCrosses(unittest.TestCase):
    """Validates data/cruces_multivariables.json benchmark joins"""

    @classmethod
    def setUpClass(cls):
        cls.assertTrue(CRUCES_JSON.exists(), f"File {CRUCES_JSON} must exist")
        with open(CRUCES_JSON, "r", encoding="utf-8") as f:
            cls.data = json.load(f)

    def test_01_three_benchmark_joins_exist(self):
        """File contains clima_salud, criosfera_riesgo, and marino_productivo"""
        cruces = self.data.get("cruces", {})
        self.assertIn("clima_salud", cruces)
        self.assertIn("criosfera_riesgo", cruces)
        self.assertIn("marino_productivo", cruces)

    def test_02_clima_salud_synthesis(self):
        """Cruce 1: Clima-Salud contains negative Temp-MP2.5 and positive MP2.5-Egresos correlation"""
        cs = self.data["cruces"]["clima_salud"]
        self.assertEqual(cs.get("comuna_ine"), "11101")
        self.assertEqual(cs.get("codigo_comuna"), "CL-XI-01")
        self.assertEqual(len(cs.get("datos", [])), 12)

        # Check alert threshold
        umbral = cs.get("umbral_alerta", {})
        self.assertEqual(umbral.get("variable"), "mp25_ugm3")
        self.assertEqual(umbral.get("umbral_critico"), 110.0)
        self.assertIn("2026-06", umbral.get("meses_alerta", []))

        # Statistical correlation validation
        temps = [d["temp_min_c"] for d in cs["datos"]]
        mp25 = [d["mp25_ugm3"] for d in cs["datos"]]
        egresos = [d["egresos_respiratorios"] for d in cs["datos"]]

        r_temp_mp25 = calculate_pearson_r(temps, mp25)
        r_mp25_egresos = calculate_pearson_r(mp25, egresos)

        self.assertLess(r_temp_mp25, -0.80, "Temperature and MP2.5 should have strong negative correlation (r < -0.80)")
        self.assertGreater(r_mp25_egresos, 0.90, "MP2.5 and Egresos should have strong positive correlation (r > 0.90)")

    def test_03_criosfera_riesgo_synthesis(self):
        """Cruce 2: Criósfera-Riesgo records 2026-04 GLOF event above 1200 m³/s"""
        cr = self.data["cruces"]["criosfera_riesgo"]
        self.assertEqual(cr.get("comuna_ine"), "11301")
        self.assertEqual(cr.get("codigo_cuenca"), "115")
        self.assertEqual(len(cr.get("datos", [])), 12)

        umbral = cr.get("umbral_alerta", {})
        self.assertEqual(umbral.get("variable"), "caudal_m3s")
        self.assertEqual(umbral.get("umbral_critico"), 1200.0)
        self.assertEqual(umbral.get("meses_alerta"), ["2026-04"])

        # Check April GLOF peak
        april_data = next(d for d in cr["datos"] if d["periodo_mes"] == "2026-04")
        self.assertGreaterEqual(april_data["caudal_m3s"], 1200.0)
        self.assertIn("GLOF", april_data["estado_glof"])

    def test_04_marino_productivo_synthesis(self):
        """Cruce 3: Marino-Productivo records March/April Alexandrium toxic bloom > 500 cél/L"""
        mp = self.data["cruces"]["marino_productivo"]
        self.assertEqual(mp.get("comuna_ine"), "11201")
        self.assertEqual(mp.get("codigo_barrio_acs"), "ACS-21B")
        self.assertEqual(len(mp.get("datos", [])), 12)

        umbral = mp.get("umbral_alerta", {})
        self.assertEqual(umbral.get("variable"), "alexandrium_cel_l")
        self.assertEqual(umbral.get("umbral_critico"), 500.0)

        # Check March peak and harvest collapse in May/June
        march_data = next(d for d in mp["datos"] if d["periodo_mes"] == "2026-03")
        self.assertGreaterEqual(march_data["alexandrium_cel_l"], 500.0)

        may_data = next(d for d in mp["datos"] if d["periodo_mes"] == "2026-05")
        self.assertEqual(may_data["biomasa_cosecha_kton"], 0.0)


class TestM2ViewerAndExportEngine(unittest.TestCase):
    """Validates mapa_territorial.html UI cross-viewer, alert banner, and export functions"""

    @classmethod
    def setUpClass(cls):
        cls.assertTrue(HTML_MAP.exists(), f"File {HTML_MAP} must exist")
        with open(HTML_MAP, "r", encoding="utf-8") as f:
            cls.html = f.read()

    def test_01_export_functions_defined(self):
        """All 4 client-side export functions are implemented"""
        expected_funcs = [
            "exportCurrentStationCSV",
            "exportCurrentStationJSON",
            "exportCrossDataCSV",
            "exportCrossDataJSON"
        ]
        for fn in expected_funcs:
            pattern = rf"function\s+{fn}\s*\("
            self.assertRegex(self.html, pattern, f"Function {fn}() must be declared in mapa_territorial.html")

    def test_02_export_buttons_bound_in_dom(self):
        """DOM includes export buttons with click bindings"""
        self.assertIn('onclick="exportCurrentStationCSV()"', self.html)
        self.assertIn('onclick="exportCurrentStationJSON()"', self.html)
        self.assertIn('onclick="exportCrossDataCSV()"', self.html)
        self.assertIn('onclick="exportCrossDataJSON()"', self.html)

    def test_03_export_csv_includes_utf8_bom(self):
        """CSV exporters prepend \\uFEFF (UTF-8 BOM) for Microsoft Excel compatibility"""
        # Station CSV
        self.assertIn(r"\uFEFFfecha,comuna_ine,lat,lng,unidad", self.html)
        # Cross CSV
        self.assertIn(r"\uFEFFfecha,comuna_ine,lat,lng,unidad", self.html)

    def test_04_export_contract_normalized_keys(self):
        """Mandatory 5 keys (fecha, comuna_ine, lat, lng, unidad) strictly present in CSV and JSON exports"""
        required_keys = ["fecha", "comuna_ine", "lat", "lng", "unidad"]
        for key in required_keys:
            self.assertIn(key, self.html, f"Normalized key '{key}' must be referenced in export logic")

        # In Station JSON export
        self.assertIn("comuna_ine: comunaIne", self.html)
        self.assertIn("unidad: unit", self.html)

        # In Cross JSON export
        self.assertIn("comuna_ine: comunaIne", self.html)
        self.assertIn("unidad: unidad", self.html)

    def test_05_threshold_alert_banner_elements_exist(self):
        """DOM contains crossAlertBanner elements for dynamic alert notifications"""
        alert_elements = [
            'id="crossAlertBanner"',
            'id="crossAlertIcon"',
            'id="crossAlertTitle"',
            'id="crossAlertText"'
        ]
        for el in alert_elements:
            self.assertIn(el, self.html, f"Alert element {el} must exist in HTML")

    def test_06_dual_axis_chartjs_configuration(self):
        """Chart configuration establishes y1 and y2 dual axes with separate scaling and colors"""
        self.assertIn("y1: {", self.html)
        self.assertIn("y2: {", self.html)
        self.assertIn("position: 'left'", self.html)
        self.assertIn("position: 'right'", self.html)

    def test_07_station_catalog_enriched_with_spatial_keys(self):
        """All 16 stations in JS array contain normalized spatial keys"""
        match = re.search(r"const\s+stations\s*=\s*\[(.*?)\n\s*\];", self.html, re.DOTALL)
        self.assertIsNotNone(match, "stations array must be declared")
        raw_array = match.group(1)

        for i in range(1, 17):
            start = raw_array.find(f"id: {i}")
            self.assertNotEqual(start, -1, f"Station id {i} not found in stations array")
            chunk = raw_array[start:start + 1200]
            self.assertIn("codigo_comuna:", chunk, f"Station {i} missing codigo_comuna")
            self.assertIn("comuna_ine:", chunk, f"Station {i} missing comuna_ine")
            self.assertIn("codigo_cuenca:", chunk, f"Station {i} missing codigo_cuenca")
            self.assertIn("unidad:", chunk, f"Station {i} missing unidad")


class TestM2CrossDatabaseConsistency(unittest.TestCase):
    """Validates referential integrity and consistency across JSON assets and HTML"""

    def test_01_station_ids_and_coords_match(self):
        """16 stations in estaciones_aysen.json match 16 stations in mapa_territorial.html"""
        with open(ESTACIONES_JSON, "r", encoding="utf-8") as f:
            canon = json.load(f)["estaciones"]

        with open(HTML_MAP, "r", encoding="utf-8") as f:
            html = f.read()

        match = re.search(r"const\s+stations\s*=\s*\[(.*?)\n\s*\];", html, re.DOTALL)
        raw_array = match.group(1)

        self.assertEqual(len(canon), 16)
        for s in canon:
            s_id = s["id"]
            start = raw_array.find(f"id: {s_id}")
            self.assertNotEqual(start, -1)
            chunk = raw_array[start:start + 1200]

            lat_m = re.search(r"lat:\s*([-\d\.]+)", chunk)
            lng_m = re.search(r"lng:\s*([-\d\.]+)", chunk)
            ine_m = re.search(r"comuna_ine:\s*['\"](\d+)['\"]", chunk)

            self.assertAlmostEqual(float(lat_m.group(1)), s["lat"], places=3)
            self.assertAlmostEqual(float(lng_m.group(1)), s["lng"], places=3)
            self.assertEqual(ine_m.group(1), s["comuna_ine"])

    def test_02_cross_datasets_match_authoritative_benchmarks(self):
        """Multivariable joins in cruces_multivariables.json match the 12-month benchmarks"""
        with open(CRUCES_JSON, "r", encoding="utf-8") as f:
            cruces = json.load(f)["cruces"]

        cs = cruces["clima_salud"]["datos"]
        self.assertEqual(len(cs), 12)
        # Check specific values from canonical benchmark
        self.assertEqual(cs[5]["mp25_ugm3"], 165.0)  # June peak
        self.assertEqual(cs[5]["temp_min_c"], -6.5)

        cr = cruces["criosfera_riesgo"]["datos"]
        self.assertEqual(cr[3]["caudal_m3s"], 1450)  # April GLOF peak

        mp = cruces["marino_productivo"]["datos"]
        self.assertEqual(mp[2]["alexandrium_cel_l"], 1450)  # March peak


if __name__ == "__main__":
    unittest.main(verbosity=2)
