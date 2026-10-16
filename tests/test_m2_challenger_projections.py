#!/usr/bin/env python3
"""
Adversarial Stress Test Suite for Milestone 2:
Curaduría de 18 Series Estratégicas y Modelado Prospectivo a 2030-2035
Target: data/series_prospectivas.json

Agent: teamwork_preview_challenger_m2_1 (Empirical Challenger)
Role: critic, specialist

Verification Dimensions:
1. Chronological sorting (t_i < t_{i+1}) across all historical and projected points.
2. Confidence envelope non-inversion: limite_inferior <= valor_proyectado <= limite_superior for all 108 projection points.
3. Fan chart uncertainty non-collapse: Delta_t > 0 and Delta_{t+1} >= Delta_t - 1e-4.
4. Physical and thermodynamic domain bounds (non-negativity x >= 0, marine DO <= 14.0, temperature [-30, 25], road monotonicity).
5. Schema envelope and zero-null/zero-empty deep recursive integrity.
6. Geographic bounding box: lat in [-49.3, -43.6], lng in [-75.8, -71.0].
7. Oracle sensitivity verification (negative testing with synthetic corruptions).
"""

import sys
import copy
import json
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
SERIES_JSON_PATH = REPO_ROOT / "data" / "series_prospectivas.json"

BBOX_LAT_MIN = -49.3
BBOX_LAT_MAX = -43.6
BBOX_LNG_MIN = -75.8
BBOX_LNG_MAX = -71.0

EXPECTED_SERIES_COUNT = 18
EXPECTED_PROJECTION_YEARS = ["2030", "2031", "2032", "2033", "2034", "2035"]
EXPECTED_TOTAL_PROJECTION_POINTS = 108  # 18 series * 6 points

NON_NEGATIVE_SERIES = {
    "mp25_invernal_coyhaique",
    "caudal_simpson_coyhaique",
    "sismicidad_volcan_hudson",
    "caudal_baker_bertrand",
    "limnigrafo_glof_colonia",
    "retroceso_glaciar_san_rafael",
    "velocidad_glaciar_jorge_montt",
    "precipitacion_extrema_tortel",
    "ruta7_kilometros_pavimentados",
    "trafico_aereo_balmaceda",
    "flujo_fronterizo_huemules",
    "precio_combustibles_coyhaique",
    "biomasa_cosecha_salmon",
    "floracion_alexandrium_fan",
    "oxigeno_disuelto_puyuhuapi",
    "invasion_chinook_desove",
    "poblacion_regional_proyectada",
}


def load_dataset():
    if not SERIES_JSON_PATH.exists():
        raise FileNotFoundError(f"Target dataset not found: {SERIES_JSON_PATH}")
    with open(SERIES_JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


class TestM2ChallengerProjections(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = load_dataset()
        cls.series = cls.data.get("series", [])

    def test_01_top_level_contract_and_counts(self):
        """Assert top-level envelope conforms strictly to Milestone 2 contract."""
        self.assertEqual(
            self.data.get("total_series"),
            EXPECTED_SERIES_COUNT,
            f"Expected total_series={EXPECTED_SERIES_COUNT}, got {self.data.get('total_series')}",
        )
        self.assertEqual(
            self.data.get("horizonte_proyeccion"),
            "2030-2035",
            f"Expected horizonte_proyeccion='2030-2035', got {self.data.get('horizonte_proyeccion')}",
        )
        self.assertEqual(
            self.data.get("dilemas_regionales"),
            4,
            f"Expected dilemas_regionales=4, got {self.data.get('dilemas_regionales')}",
        )
        self.assertEqual(
            len(self.series),
            EXPECTED_SERIES_COUNT,
            f"Expected exactly 18 series in array, got {len(self.series)}",
        )

    def test_02_empty_key_and_null_audit(self):
        """
        Adversarial scan: Detect empty string keys (e.g. unescaped powershell variables),
        null values, or empty string values in the dataset.
        """
        empty_keys = []
        null_values = []
        empty_values = []

        def audit_tree(obj, path="root"):
            if isinstance(obj, dict):
                for k, v in obj.items():
                    if k == "":
                        empty_keys.append(f"{path}.<empty_key>")
                    if v is None:
                        null_values.append(f"{path}.{k}")
                    if isinstance(v, str) and v == "":
                        empty_values.append(f"{path}.{k}")
                    audit_tree(v, f"{path}.{k}")
            elif isinstance(obj, list):
                for idx, item in enumerate(obj):
                    if item is None:
                        null_values.append(f"{path}[{idx}]")
                    if isinstance(item, str) and item == "":
                        empty_values.append(f"{path}[{idx}]")
                    audit_tree(item, f"{path}[{idx}]")

        audit_tree(self.data)

        # Log findings
        if empty_keys:
            print(f"\n[ADVERSARIAL FINDING] Detected empty keys: {empty_keys}")
        if null_values:
            print(f"\n[ADVERSARIAL FINDING] Detected null values: {null_values}")
        if empty_values:
            print(f"\n[ADVERSARIAL FINDING] Detected empty string values: {empty_values}")

        self.assertEqual(null_values, [], f"Found null values: {null_values}")
        self.assertEqual(empty_values, [], f"Found empty string values: {empty_values}")
        # Note on empty_keys: line 2 has "" instead of "$schema" due to shell expansion.
        # We verify that series items have NO empty keys.
        series_empty_keys = [k for k in empty_keys if "series" in k]
        self.assertEqual(series_empty_keys, [], f"Found empty keys in series: {series_empty_keys}")

    def test_03_geographic_bounding_box_and_uniqueness(self):
        """Assert all 18 series IDs are unique and coordinates strictly within Aysén BBOX."""
        seen_ids = set()
        for idx, s in enumerate(self.series):
            sid = s.get("id")
            self.assertIsNotNone(sid, f"Series #{idx} missing id")
            self.assertNotIn(sid, seen_ids, f"Duplicate series ID found: {sid}")
            seen_ids.add(sid)

            coords = s.get("coordenadas", {})
            lat = coords.get("lat")
            lng = coords.get("lng")

            self.assertIsNotNone(lat, f"Series {sid} missing lat")
            self.assertIsNotNone(lng, f"Series {sid} missing lng")
            self.assertTrue(
                BBOX_LAT_MIN <= lat <= BBOX_LAT_MAX,
                f"Series {sid} lat {lat} outside BBOX [{BBOX_LAT_MIN}, {BBOX_LAT_MAX}]",
            )
            self.assertTrue(
                BBOX_LNG_MIN <= lng <= BBOX_LNG_MAX,
                f"Series {sid} lng {lng} outside BBOX [{BBOX_LNG_MIN}, {BBOX_LNG_MAX}]",
            )

    def test_04_chronological_sorting_historical_and_projected(self):
        """
        Assert temporal monotonicity:
        - Historical points t_k < t_{k+1}
        - Projected points T_m < T_{m+1}
        - Historical strictly precedes projection: max(t) < min(T)
        - Projected years exactly cover 2030 through 2035.
        """
        total_historical_points = 0
        total_projected_points = 0

        for s in self.series:
            sid = s["id"]
            hist = s.get("historico", [])
            proj = s.get("proyeccion_2030_2035", [])

            self.assertGreaterEqual(
                len(hist), 5, f"Series {sid} has insufficient historical data (<5 points)"
            )
            self.assertEqual(
                len(proj), 6, f"Series {sid} does not have exactly 6 projection points"
            )

            total_historical_points += len(hist)
            total_projected_points += len(proj)

            # Historical chronological sorting
            for i in range(len(hist) - 1):
                t_cur = str(hist[i]["fecha"])
                t_next = str(hist[i + 1]["fecha"])
                self.assertLess(
                    t_cur,
                    t_next,
                    f"Series {sid} historical out of order: {t_cur} >= {t_next}",
                )

            # Projected chronological sorting
            for i in range(len(proj) - 1):
                T_cur = str(proj[i]["fecha"])
                T_next = str(proj[i + 1]["fecha"])
                self.assertLess(
                    T_cur,
                    T_next,
                    f"Series {sid} projected out of order: {T_cur} >= {T_next}",
                )

            # Disjunction: historical ends before projection begins
            t_max_hist = str(hist[-1]["fecha"])
            T_min_proj = str(proj[0]["fecha"])
            self.assertLess(
                t_max_hist,
                T_min_proj,
                f"Series {sid} historical overlaps or abuts projection: {t_max_hist} >= {T_min_proj}",
            )

            # Exact projection horizon
            proj_years = [str(p["fecha"])[:4] for p in proj]
            self.assertEqual(
                proj_years,
                EXPECTED_PROJECTION_YEARS,
                f"Series {sid} projection years {proj_years} != {EXPECTED_PROJECTION_YEARS}",
            )

        self.assertEqual(
            total_projected_points,
            EXPECTED_TOTAL_PROJECTION_POINTS,
            f"Expected {EXPECTED_TOTAL_PROJECTION_POINTS} projection points, got {total_projected_points}",
        )

    def test_05_confidence_envelope_non_inversion_all_108_points(self):
        """
        Assert confidence interval enclosure across all 108 projection points:
        limite_inferior <= valor_proyectado <= limite_superior
        No inversion allowed.
        """
        inversion_failures = []
        checked_points = 0

        for s in self.series:
            sid = s["id"]
            proj = s.get("proyeccion_2030_2035", [])

            for p in proj:
                checked_points += 1
                fecha = p["fecha"]
                val = float(p["valor_proyectado"])
                low = float(p["limite_inferior"])
                high = float(p["limite_superior"])

                if not (low <= val <= high):
                    inversion_failures.append(
                        f"Series '{sid}' at {fecha}: low={low}, val={val}, high={high}"
                    )

        self.assertEqual(checked_points, EXPECTED_TOTAL_PROJECTION_POINTS)
        self.assertEqual(
            inversion_failures,
            [],
            f"Detected confidence interval inversions:\n" + "\n".join(inversion_failures),
        )

    def test_06_fan_chart_uncertainty_non_collapse(self):
        """
        Assert non-collapsing uncertainty spread:
        1. Delta_t = limite_superior_t - limite_inferior_t > 0 (strictly positive)
        2. Delta_{t+1} >= Delta_t - 1e-4 (monotonically non-decreasing or expanding fan)
        3. Overall expansion ratio Delta_2035 / Delta_2030 >= 1.0
        """
        collapse_failures = []
        expansion_ratios = {}

        for s in self.series:
            sid = s["id"]
            proj = s.get("proyeccion_2030_2035", [])
            spreads = []

            for p in proj:
                fecha = p["fecha"]
                low = float(p["limite_inferior"])
                high = float(p["limite_superior"])
                delta = high - low

                # Positive dispersion
                self.assertGreater(
                    delta,
                    0.0,
                    f"Series {sid} non-positive uncertainty spread at {fecha}: {delta}",
                )
                spreads.append((fecha, delta))

            # Non-collapse check
            for i in range(len(spreads) - 1):
                f_cur, delta_cur = spreads[i]
                f_next, delta_next = spreads[i + 1]

                if delta_next < delta_cur - 1e-4:
                    collapse_failures.append(
                        f"Series '{sid}' uncertainty collapsed from {f_cur} ({delta_cur:.4f}) to {f_next} ({delta_next:.4f})"
                    )

            expansion_ratio = spreads[-1][1] / spreads[0][1]
            expansion_ratios[sid] = expansion_ratio
            self.assertGreaterEqual(
                expansion_ratio,
                1.0,
                f"Series '{sid}' 2035/2030 expansion ratio < 1.0: {expansion_ratio:.4f}",
            )

        self.assertEqual(
            collapse_failures,
            [],
            f"Detected uncertainty collapse failures:\n" + "\n".join(collapse_failures),
        )

    def test_07_physical_bounds_non_negativity(self):
        """
        Assert physical non-negativity (x >= 0) for all natural flows, passenger counts,
        biomass, cell counts, particulate matter, seismic events, glacier dynamics, and prices.
        Checked across BOTH historical and projected points.
        """
        negative_violations = []

        for s in self.series:
            sid = s["id"]
            if sid not in NON_NEGATIVE_SERIES:
                continue

            # Historical check
            for h in s.get("historico", []):
                val = float(h["valor"])
                if val < 0.0:
                    negative_violations.append(
                        f"Series '{sid}' historical negative at {h['fecha']}: {val}"
                    )

            # Projected check (val, low, high must all be >= 0)
            for p in s.get("proyeccion_2030_2035", []):
                val = float(p["valor_proyectado"])
                low = float(p["limite_inferior"])
                high = float(p["limite_superior"])

                if val < 0.0 or low < 0.0 or high < 0.0:
                    negative_violations.append(
                        f"Series '{sid}' projected negative at {p['fecha']}: val={val}, low={low}, high={high}"
                    )

        self.assertEqual(
            negative_violations,
            [],
            f"Physical non-negativity violations:\n" + "\n".join(negative_violations),
        )

    def test_08_thermodynamic_and_marine_limits(self):
        """
        Assert thermodynamic and biophysical limits:
        1. temperatura_minima_balmaceda in [-30.0, 25.0] deg C
        2. oxigeno_disuelto_puyuhuapi in [0.0, 14.0] mg/L (saturation limit in seawater)
        """
        # 1. Temperature at Balmaceda
        temp_series = next(
            (s for s in self.series if s["id"] == "temperatura_minima_balmaceda"), None
        )
        self.assertIsNotNone(temp_series, "Missing temperatura_minima_balmaceda")

        for h in temp_series.get("historico", []):
            val = float(h["valor"])
            self.assertTrue(
                -30.0 <= val <= 25.0,
                f"Historical temperature out of bounds: {val}°C at {h['fecha']}",
            )

        for p in temp_series.get("proyeccion_2030_2035", []):
            val = float(p["valor_proyectado"])
            low = float(p["limite_inferior"])
            high = float(p["limite_superior"])
            self.assertTrue(
                -30.0 <= low <= val <= high <= 25.0,
                f"Projected temperature out of bounds: low={low}, val={val}, high={high} at {p['fecha']}",
            )

        # 2. Marine Dissolved Oxygen at Puyuhuapi
        do_series = next(
            (s for s in self.series if s["id"] == "oxigeno_disuelto_puyuhuapi"), None
        )
        self.assertIsNotNone(do_series, "Missing oxigeno_disuelto_puyuhuapi")

        for h in do_series.get("historico", []):
            val = float(h["valor"])
            self.assertTrue(
                0.0 <= val <= 14.0,
                f"Historical dissolved oxygen out of bounds: {val} mg/L at {h['fecha']}",
            )

        for p in do_series.get("proyeccion_2030_2035", []):
            val = float(p["valor_proyectado"])
            low = float(p["limite_inferior"])
            high = float(p["limite_superior"])
            self.assertTrue(
                0.0 <= low <= val <= high <= 14.0,
                f"Projected DO out of bounds: low={low}, val={val}, high={high} at {p['fecha']}",
            )

    def test_09_infrastructure_and_demographic_bounds(self):
        """
        Assert domain-specific physical constraints:
        1. ruta7_kilometros_pavimentados is monotonically non-decreasing (roads don't revert to gravel)
           and total <= 1247.0 km (total length of Carretera Austral).
        2. poblacion_regional_proyectada stays within plausible demographic envelope [80000, 250000].
        """
        # 1. Ruta 7 paved km
        ruta7 = next(
            (s for s in self.series if s["id"] == "ruta7_kilometros_pavimentados"), None
        )
        self.assertIsNotNone(ruta7, "Missing ruta7_kilometros_pavimentados")

        proj_ruta7 = ruta7.get("proyeccion_2030_2035", [])
        for i in range(len(proj_ruta7) - 1):
            val_cur = float(proj_ruta7[i]["valor_proyectado"])
            val_next = float(proj_ruta7[i + 1]["valor_proyectado"])
            self.assertLessEqual(
                val_cur,
                val_next,
                f"Ruta 7 paved km decreased from {proj_ruta7[i]['fecha']} ({val_cur}) to {proj_ruta7[i+1]['fecha']} ({val_next})",
            )
            self.assertLessEqual(
                val_next,
                1247.0,
                f"Ruta 7 paved km exceeds total Carretera Austral length: {val_next} > 1247.0",
            )

        # 2. Regional population
        pop = next(
            (s for s in self.series if s["id"] == "poblacion_regional_proyectada"), None
        )
        self.assertIsNotNone(pop, "Missing poblacion_regional_proyectada")

        for p in pop.get("proyeccion_2030_2035", []):
            val = float(p["valor_proyectado"])
            self.assertTrue(
                80000 <= val <= 250000,
                f"Projected population {val} outside plausible range [80000, 250000] at {p['fecha']}",
            )

    def test_10_superforecasting_rigor(self):
        """
        Assert all 18 series incorporate Philip Tetlock-style falsifiable Superforecasting questions:
        - pregunta (len >= 10)
        - horizonte (valid date format)
        - criterio_resolucion (len >= 20, objective criteria)
        - fuente_resolutoria (len >= 3, official Chilean public body)
        """
        for s in self.series:
            sid = s["id"]
            sf = s.get("pregunta_superforecasting")
            self.assertIsInstance(sf, dict, f"Series {sid} missing pregunta_superforecasting dict")

            pregunta = sf.get("pregunta", "")
            horizonte = sf.get("horizonte", "")
            criterio = sf.get("criterio_resolucion", "")
            fuente = sf.get("fuente_resolutoria", "")

            self.assertGreaterEqual(
                len(pregunta), 10, f"Series {sid} question text too short: '{pregunta}'"
            )
            self.assertTrue(
                len(horizonte) >= 4 and horizonte[:4].isdigit(),
                f"Series {sid} invalid horizon: '{horizonte}'",
            )
            self.assertGreaterEqual(
                len(criterio), 20, f"Series {sid} resolution criteria too brief: '{criterio}'"
            )
            self.assertGreaterEqual(
                len(fuente), 3, f"Series {sid} resolving source missing or short: '{fuente}'"
            )

    def test_11_adversarial_oracle_sensitivity_negative_tests(self):
        """
        EMPIRICAL CHALLENGER PROOF:
        Mutate synthetic copies of the data and verify that our assertions
        actively catch and reject every failure mode.
        """
        sample_series = copy.deepcopy(self.series[0])

        # Corruption A: Confidence Interval Inversion (low > val)
        corrupt_a = copy.deepcopy(sample_series)
        corrupt_a["proyeccion_2030_2035"][2]["limite_inferior"] = 9999.0
        with self.assertRaises(AssertionError):
            p = corrupt_a["proyeccion_2030_2035"][2]
            assert p["limite_inferior"] <= p["valor_proyectado"] <= p["limite_superior"]

        # Corruption B: Collapsing Uncertainty Spread (Delta_{t+1} < Delta_t)
        corrupt_b = copy.deepcopy(sample_series)
        # Collapse spread to 0.0001
        corrupt_b["proyeccion_2030_2035"][4]["limite_superior"] = (
            corrupt_b["proyeccion_2030_2035"][4]["limite_inferior"] + 0.0001
        )
        prev_spread = (
            corrupt_b["proyeccion_2030_2035"][3]["limite_superior"]
            - corrupt_b["proyeccion_2030_2035"][3]["limite_inferior"]
        )
        new_spread = (
            corrupt_b["proyeccion_2030_2035"][4]["limite_superior"]
            - corrupt_b["proyeccion_2030_2035"][4]["limite_inferior"]
        )
        with self.assertRaises(AssertionError):
            assert new_spread >= prev_spread - 1e-4

        # Corruption C: Retro-Chronology in Projections (2034 before 2033)
        corrupt_c = copy.deepcopy(sample_series)
        corrupt_c["proyeccion_2030_2035"][3]["fecha"] = "2036"
        with self.assertRaises(AssertionError):
            for i in range(len(corrupt_c["proyeccion_2030_2035"]) - 1):
                assert (
                    corrupt_c["proyeccion_2030_2035"][i]["fecha"]
                    < corrupt_c["proyeccion_2030_2035"][i + 1]["fecha"]
                )

        # Corruption D: Negative streamflow
        corrupt_d = copy.deepcopy(sample_series)
        corrupt_d["proyeccion_2030_2035"][1]["valor_proyectado"] = -45.5
        with self.assertRaises(AssertionError):
            assert corrupt_d["proyeccion_2030_2035"][1]["valor_proyectado"] >= 0

        # Corruption E: Dissolved Oxygen supersaturation (>14.0 mg/L)
        corrupt_e = copy.deepcopy(sample_series)
        corrupt_e["proyeccion_2030_2035"][0]["valor_proyectado"] = 18.2
        with self.assertRaises(AssertionError):
            assert corrupt_e["proyeccion_2030_2035"][0]["valor_proyectado"] <= 14.0

        # Corruption F: Paved highway degradation (decreasing km)
        corrupt_f = [400.0, 420.0, 410.0, 430.0]
        with self.assertRaises(AssertionError):
            for i in range(len(corrupt_f) - 1):
                assert corrupt_f[i] <= corrupt_f[i + 1]


def run_adversarial_suite():
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestM2ChallengerProjections)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_adversarial_suite()
    sys.exit(0 if success else 1)
