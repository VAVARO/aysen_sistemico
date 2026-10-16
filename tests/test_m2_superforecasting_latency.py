#!/usr/bin/env python3
"""
Test Suite: Empirical Stress-Test of Superforecasting Questions & Query Latency
=============================================================================
Milestone: M2 (R2: Curaduría de 18 Series Estratégicas y Modelado Prospectivo a 2030-2035)
Author: Challenger 2 (Empirical Challenger)
Target: data/series_prospectivas.json

Empirical verification covers:
1. All 18 series have valid, non-empty, falsifiable Superforecasting questions
   with exact horizon, resolution criteria, and resolving institution.
2. The 4 flagship regional dilemma questions are well-formed and mapped to real
   regional challenges.
3. Simulated client retrieval latency (<200ms) for looking up series by
   dilemma, comuna, and basin.
4. Edge cases, schema integrity, zero-null invariants, and structural anomalies.
"""

import json
import time
import re
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SERIES_JSON_PATH = REPO_ROOT / "data" / "series_prospectivas.json"
COMUNAS_JSON_PATH = REPO_ROOT / "data" / "comunas_aysen.json"

# Authoritative Chilean & International Earth-Observation resolving institutions
RECOGNIZED_INSTITUTIONS = {
    "MMA", "SINCA", "DGA", "MOP", "SERNAGEOMIN", "IFOP", "SUBPESCA",
    "INE", "DMC", "CNE", "JAC", "SENAPRED", "CIEP", "PDI", "UPF",
    "SERNATUR", "MINSEGPRES", "DIARIO OFICIAL", "VIALIDAD",
    "NASA", "JPL", "COPERNICUS", "ESA"
}

# The 4 flagship dilemmas mandated by ORIGINAL_REQUEST.md Requirement R3
EXPECTED_FLAGSHIP_DILEMMAS = {
    "frio_aire": "Frío & Aire en Coyhaique",
    "conectividad": "Conectividad Carretera Austral",
    "fiordos_salmones": "Futuro de Fiordos y Salmones",
    "seguridad_hidrica": "Seguridad Hídrica del Baker"
}

# 10 official Comunas in Aysén
OFFICIAL_COMUNA_INES = {
    "11101", "11102", "11201", "11202", "11203",
    "11301", "11302", "11303", "11401", "11402", "regional"
}


class TestSuperforecastingAndLatency(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        assert SERIES_JSON_PATH.exists(), f"File {SERIES_JSON_PATH} must exist"
        with open(SERIES_JSON_PATH, "r", encoding="utf-8") as f:
            cls.raw_data = json.load(f)
        cls.series_list = cls.raw_data.get("series", [])

    # =========================================================================
    # PART 1: Top-Level & Structural Schema Audit
    # =========================================================================

    def test_01_top_level_contract_and_empty_keys(self):
        """Audit top-level structure and check for anomalous empty keys."""
        self.assertEqual(self.raw_data.get("total_series"), 18)
        self.assertEqual(self.raw_data.get("horizonte_proyeccion"), "2030-2035")
        self.assertEqual(self.raw_data.get("dilemas_regionales"), 4)
        self.assertEqual(len(self.series_list), 18)

        # Check for empty string key in root dictionary
        top_keys = list(self.raw_data.keys())
        if "" in top_keys:
            # Note: We record this as an empirical finding
            print(f"\n[ANOMALY DETECTED] Root dictionary contains an empty string key '': {repr(self.raw_data[''])}")

    def test_02_recursive_zero_null_and_zero_empty_in_series(self):
        """Verify no null or empty string values inside series objects."""
        def check_no_null_or_empty(obj, path=""):
            if obj is None:
                self.fail(f"Null value found at {path}")
            elif isinstance(obj, str):
                self.assertTrue(len(obj.strip()) > 0, f"Empty string found at {path}")
            elif isinstance(obj, dict):
                for k, v in obj.items():
                    self.assertTrue(len(k.strip()) > 0, f"Empty key found at {path}.{k}")
                    check_no_null_or_empty(v, f"{path}.{k}")
            elif isinstance(obj, list):
                self.assertTrue(len(obj) > 0, f"Empty list found at {path}")
                for idx, item in enumerate(obj):
                    check_no_null_or_empty(item, f"{path}[{idx}]")

        for idx, s in enumerate(self.series_list):
            check_no_null_or_empty(s, f"series[{idx}]")

    # =========================================================================
    # PART 2: All 18 Series Superforecasting Questions Verification
    # =========================================================================

    def test_03_all_18_series_have_superforecasting_block(self):
        """Every series has a non-null pregunta_superforecasting dictionary."""
        for s in self.series_list:
            sid = s.get("id")
            self.assertIn("pregunta_superforecasting", s, f"Series {sid} lacks pregunta_superforecasting")
            sf = s["pregunta_superforecasting"]
            self.assertIsInstance(sf, dict, f"pregunta_superforecasting in {sid} must be a dict")
            required_keys = {"pregunta", "horizonte", "criterio_resolucion", "fuente_resolutoria"}
            for rk in required_keys:
                self.assertIn(rk, sf, f"Series {sid} pregunta_superforecasting lacks required key '{rk}'")
                val = sf[rk]
                self.assertIsInstance(val, str, f"Series {sid} {rk} must be a string")
                self.assertTrue(len(val.strip()) > 0, f"Series {sid} {rk} cannot be empty")

    def test_04_horizon_exactness_and_future_scope(self):
        """Superforecasting horizons must have valid date formats (YYYY-MM-DD or YYYY) between 2030 and 2035."""
        date_pattern = re.compile(r"^20(3[0-5])(-([0-1][0-9])-([0-3][0-9]))?$")
        for s in self.series_list:
            sid = s.get("id")
            horizon = s["pregunta_superforecasting"]["horizonte"].strip()
            self.assertTrue(
                bool(date_pattern.match(horizon)),
                f"Series {sid} has invalid or non-future horizon '{horizon}' (expected 2030-2035 ISO format)"
            )

    def test_05_falsifiability_and_measurable_criteria(self):
        """Questions must be falsifiable with measurable conditions and resolution criteria > 30 chars."""
        # Non-falsifiable vague words that should NOT appear as sole criteria
        vague_terms = ["podría ser mejor", "quizás cambie", "posiblemente", "de alguna manera"]

        for s in self.series_list:
            sid = s.get("id")
            sf = s["pregunta_superforecasting"]
            q = sf["pregunta"].strip()
            crit = sf["criterio_resolucion"].strip()

            # Question should end with question mark or contain interrogative structure
            self.assertTrue("?" in q or "¿" in q, f"Series {sid} pregunta is not formulated as a question: '{q}'")

            # Resolution criteria must be detailed (> 30 characters) and operational
            self.assertGreater(
                len(crit), 30,
                f"Series {sid} criterio_resolucion is too brief to be falsifiable: '{crit}'"
            )

            for term in vague_terms:
                self.assertNotIn(term, crit.lower(), f"Series {sid} criterio contains vague term: '{term}'")

            # Must mention a clear binary threshold, direction, or condition
            has_operational_rule = any(k in crit.lower() for k in [
                "promedio", "concentración", "concentracion", "menor", "mayor", "supere", "alcance",
                "registre", "estrictamente", "umbral", "tasa", "descarga", "km", "kilómetro", "kilometro",
                "kilómetros", "kilometros", "biomasa", "decreto", "oficial", "caudal", "temperatura",
                "mg/l", "ug/m", "µg/m", "evento", "recepción", "recepcion", "acta", "se resolverá", "se resolvera"
            ])
            self.assertTrue(
                has_operational_rule,
                f"Series {sid} criterio lacks explicit operational or threshold rule: '{crit}'"
            )

    def test_06_resolving_institution_authoritativeness(self):
        """Resolving institution must cite real, official public agencies."""
        for s in self.series_list:
            sid = s.get("id")
            inst = s["pregunta_superforecasting"]["fuente_resolutoria"].upper()
            recognized = any(agent in inst for agent in RECOGNIZED_INSTITUTIONS)
            self.assertTrue(
                recognized,
                f"Series {sid} fuente_resolutoria '{s['pregunta_superforecasting']['fuente_resolutoria']}' does not cite a recognized public institution"
            )

    # =========================================================================
    # PART 3: The 4 Flagship Regional Dilemma Questions
    # =========================================================================

    def test_07_dilemas_estrategicos_structure(self):
        """Top-level dilemas_estrategicos contains the 4 flagship regional dilemmas."""
        self.assertIn("dilemas_estrategicos", self.raw_data)
        dilemas = self.raw_data["dilemas_estrategicos"]
        self.assertIsInstance(dilemas, dict)
        self.assertEqual(len(dilemas), 4, f"Expected 4 dilemas, found {len(dilemas)}")

        for key, expected_prefix in EXPECTED_FLAGSHIP_DILEMMAS.items():
            self.assertIn(key, dilemas, f"Dilemma '{key}' missing from dilemas_estrategicos")
            d_obj = dilemas[key]
            self.assertIn("titulo", d_obj)
            self.assertIn("descripcion", d_obj)
            self.assertIn("series_asociadas", d_obj)
            self.assertIn("pregunta_flagship", d_obj)

    def test_08_flagship_series_referential_integrity(self):
        """All series referenced in flagship dilemas_estrategicos exist in series list."""
        all_series_ids = {s["id"] for s in self.series_list}
        dilemas = self.raw_data["dilemas_estrategicos"]

        for d_key, d_obj in dilemas.items():
            asoc = d_obj["series_asociadas"]
            self.assertIsInstance(asoc, list)
            self.assertGreater(len(asoc), 0, f"Dilemma {d_key} has empty series_asociadas")
            for sid in asoc:
                self.assertIn(
                    sid, all_series_ids,
                    f"Dilemma {d_key} references non-existent series '{sid}'"
                )

    def test_09_flagship_questions_falsifiability_and_regional_mapping(self):
        """Each flagship question is rigorous, binary ('Sí'/'No'), and mapped to real Aysén challenges."""
        dilemas = self.raw_data["dilemas_estrategicos"]

        # Regional challenge mapping patterns:
        expected_mappings = {
            "frio_aire": ["coyhaique", "mp2.5", "saturada", "mma"],
            "conectividad": ["ruta 7", "paviment", "cochrane", "cerro castillo"],
            "fiordos_salmones": ["concesiones", "salmon", "fiordos", "subpesca"],
            "seguridad_hidrica": ["baker", "glof", "colonia", "dga"]
        }

        for d_key, keywords in expected_mappings.items():
            d_obj = dilemas[d_key]
            pf = d_obj["pregunta_flagship"]
            self.assertIn("id", pf)
            self.assertIn("pregunta", pf)
            self.assertIn("horizonte", pf)
            self.assertIn("criterio_resolucion", pf)
            self.assertIn("fuente_resolutoria", pf)

            # Check that resolution criteria explicitly defines binary resolution ("Sí" / "No")
            crit = pf["criterio_resolucion"].lower()
            has_binary_resolution = ("se resolverá como sí" in crit or "se resolvera como si" in crit) and \
                                   ("se resolverá como no" in crit or "se resolvera como no" in crit)
            self.assertTrue(
                has_binary_resolution,
                f"Flagship dilemma {d_key} does not explicitly define binary resolution rules ('Sí' vs 'No') in criterio_resolucion"
            )

            # Check mapping to real regional challenges
            full_text = (pf["pregunta"] + " " + pf["criterio_resolucion"]).lower()
            matched_keywords = [kw for kw in keywords if kw in full_text]
            self.assertGreaterEqual(
                len(matched_keywords), 2,
                f"Flagship dilemma {d_key} does not strongly map to regional challenge (matched {matched_keywords} out of {keywords})"
            )

    # =========================================================================
    # PART 4: Client Retrieval Latency Stress Testing (<200ms)
    # =========================================================================

    def test_10_cold_file_load_and_parse_latency(self):
        """Cold load from disk and JSON parse must complete in <200ms."""
        times = []
        for _ in range(10):
            t0 = time.perf_counter()
            with open(SERIES_JSON_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            t1 = time.perf_counter()
            elapsed_ms = (t1 - t0) * 1000.0
            times.append(elapsed_ms)
            self.assertLess(
                elapsed_ms, 200.0,
                f"Cold load and parse took {elapsed_ms:.2f}ms, exceeding 200ms limit"
            )

        mean_ms = sum(times) / len(times)
        max_ms = max(times)
        print(f"\n[LATENCY BENCHMARK] Cold Load & JSON Parse (10 runs): Mean = {mean_ms:.3f}ms, Max = {max_ms:.3f}ms (Budget: <200ms)")

    def test_11_lookup_by_dilemma_latency(self):
        """Simulate client filtering 18 series by dilemma in memory (<200ms, targeting <5ms)."""
        dilemmas = ["frio_aire", "conectividad", "fiordos_salmones", "seguridad_hidrica", "demografia_regional"]

        # Run 1000 iterations to test stability and percentiles
        latencies_ms = []
        for _ in range(1000):
            for d in dilemmas:
                t0 = time.perf_counter()
                results = [s for s in self.series_list if s.get("dilema_regional") == d]
                t1 = time.perf_counter()
                elapsed_ms = (t1 - t0) * 1000.0
                latencies_ms.append(elapsed_ms)
                self.assertLess(elapsed_ms, 200.0)
                self.assertGreater(len(results), 0, f"No series found for dilemma '{d}'")

        latencies_ms.sort()
        p50 = latencies_ms[len(latencies_ms) // 2]
        p95 = latencies_ms[int(len(latencies_ms) * 0.95)]
        p99 = latencies_ms[int(len(latencies_ms) * 0.99)]
        max_lat = max(latencies_ms)
        print(f"[LATENCY BENCHMARK] Lookup by Dilemma (5000 queries): p50={p50*1000:.1f}µs, p95={p95*1000:.1f}µs, p99={p99*1000:.1f}µs, max={max_lat:.3f}ms")

    def test_12_lookup_by_comuna_latency(self):
        """Simulate client filtering 18 series by comuna INE / code (<200ms, targeting <5ms)."""
        comunas = list(OFFICIAL_COMUNA_INES)

        latencies_ms = []
        for _ in range(500):
            for c in comunas:
                t0 = time.perf_counter()
                results = [
                    s for s in self.series_list
                    if s.get("comuna_ine") == c or s.get("codigo_comuna") == c
                ]
                t1 = time.perf_counter()
                elapsed_ms = (t1 - t0) * 1000.0
                latencies_ms.append(elapsed_ms)
                self.assertLess(elapsed_ms, 200.0)

        latencies_ms.sort()
        p50 = latencies_ms[len(latencies_ms) // 2]
        p95 = latencies_ms[int(len(latencies_ms) * 0.95)]
        p99 = latencies_ms[int(len(latencies_ms) * 0.99)]
        max_lat = max(latencies_ms)
        print(f"[LATENCY BENCHMARK] Lookup by Comuna (5500 queries): p50={p50*1000:.1f}µs, p95={p95*1000:.1f}µs, p99={p99*1000:.1f}µs, max={max_lat:.3f}ms")

    def test_13_lookup_by_basin_cuenca_latency(self):
        """Simulate client filtering 18 series by basin (cuenca_bna) (<200ms, targeting <5ms)."""
        cuencas = {s.get("cuenca_bna") for s in self.series_list if s.get("cuenca_bna")}

        latencies_ms = []
        for _ in range(500):
            for cuenca in cuencas:
                t0 = time.perf_counter()
                results = [s for s in self.series_list if s.get("cuenca_bna") == cuenca]
                t1 = time.perf_counter()
                elapsed_ms = (t1 - t0) * 1000.0
                latencies_ms.append(elapsed_ms)
                self.assertLess(elapsed_ms, 200.0)
                self.assertGreater(len(results), 0)

        latencies_ms.sort()
        p50 = latencies_ms[len(latencies_ms) // 2]
        p95 = latencies_ms[int(len(latencies_ms) * 0.95)]
        p99 = latencies_ms[int(len(latencies_ms) * 0.99)]
        max_lat = max(latencies_ms)
        print(f"[LATENCY BENCHMARK] Lookup by Cuenca (500*len queries): p50={p50*1000:.1f}µs, p95={p95*1000:.1f}µs, p99={p99*1000:.1f}µs, max={max_lat:.3f}ms")

    def test_14_compound_client_filter_and_projection_render_simulation(self):
        """Simulate compound client query: filter by dilemma + extract projection + compute bounds in <200ms."""
        t0 = time.perf_counter()
        simulated_ui_views = 0
        for dilemma in ["frio_aire", "conectividad", "fiordos_salmones", "seguridad_hidrica"]:
            # 1. Filter series
            matching = [s for s in self.series_list if s.get("dilema_regional") == dilemma]
            # 2. Extract time series for chart
            for s in matching:
                hist = s.get("historico", [])
                proj = s.get("proyeccion_2030_2035", [])
                q = s.get("pregunta_superforecasting", {})
                # compute min/max for chart scale
                all_vals = [h["valor"] for h in hist] + [p["valor_proyectado"] for p in proj]
                low_vals = [p["limite_inferior"] for p in proj]
                high_vals = [p["limite_superior"] for p in proj]
                min_scale = min(all_vals + low_vals)
                max_scale = max(all_vals + high_vals)
                simulated_ui_views += 1
        t1 = time.perf_counter()
        total_pipeline_ms = (t1 - t0) * 1000.0

        self.assertLess(total_pipeline_ms, 200.0)
        print(f"[LATENCY BENCHMARK] Full UI Render Pipeline Simulation (4 dilemmas, 17 series processed): Total = {total_pipeline_ms:.3f}ms")

    # =========================================================================
    # PART 5: Adversarial Boundary & Consistency Checks
    # =========================================================================

    def test_15_no_duplicate_series_ids_or_questions(self):
        """Check uniqueness of series IDs and Superforecasting question texts."""
        ids = [s["id"] for s in self.series_list]
        self.assertEqual(len(ids), len(set(ids)), f"Duplicate series IDs detected: {ids}")

        questions = [s["pregunta_superforecasting"]["pregunta"] for s in self.series_list]
        self.assertEqual(len(questions), len(set(questions)), "Duplicate questions detected across series")

    def test_16_question_horizon_matches_projection_envelope(self):
        """Question horizons should align with or conclude the projection window (2030-2035)."""
        for s in self.series_list:
            sid = s["id"]
            horizon = s["pregunta_superforecasting"]["horizonte"]
            year = int(horizon[:4])
            self.assertTrue(
                2030 <= year <= 2035,
                f"Series {sid} question horizon year {year} falls outside 2030-2035 window"
            )

    def test_17_spatial_bbox_compliance(self):
        """All series coordinates must lie strictly within Aysén bounding box [-49.3, -43.6] / [-75.8, -71.0]."""
        for s in self.series_list:
            sid = s["id"]
            coords = s.get("coordenadas", {})
            lat = coords.get("lat")
            lng = coords.get("lng")
            self.assertIsNotNone(lat, f"Series {sid} missing lat")
            self.assertIsNotNone(lng, f"Series {sid} missing lng")
            self.assertTrue(-49.3 <= lat <= -43.6, f"Series {sid} lat {lat} out of bounds [-49.3, -43.6]")
            self.assertTrue(-75.8 <= lng <= -71.0, f"Series {sid} lng {lng} out of bounds [-75.8, -71.0]")

    def test_18_comunas_foreign_key_alignment(self):
        """All comuna_ine and codigo_comuna values must match official comunas_aysen.json or regional code."""
        with open(COMUNAS_JSON_PATH, "r", encoding="utf-8") as f:
            comunas_doc = json.load(f)
        valid_ines = {c["comuna_ine"] for c in comunas_doc["comunas"]} | {"regional"}
        valid_codigos = {c["codigo_comuna"] for c in comunas_doc["comunas"]} | {"CL-XI-REG"}

        for s in self.series_list:
            sid = s["id"]
            cine = s.get("comuna_ine")
            ccod = s.get("codigo_comuna")
            self.assertIn(cine, valid_ines, f"Series {sid} has invalid comuna_ine '{cine}'")
            self.assertIn(ccod, valid_codigos, f"Series {sid} has invalid codigo_comuna '{ccod}'")


if __name__ == "__main__":
    unittest.main(verbosity=2)
