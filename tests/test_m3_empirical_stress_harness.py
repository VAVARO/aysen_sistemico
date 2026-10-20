#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_m3_empirical_stress_harness.py
=============================================================================
EMPIRICAL CHALLENGER STRESS HARNESS — Milestone 3 (Chart.js Formatting & Layout)

Adversarial Stress Testing of:
1. Exact JavaScript implementation of formatAxisTitle executed via Node.js
   on all territorial datasets:
   - 31 nodos from data/aysen_hubs_data.js
   - 18 series from data/series_prospectivas.json
   - 21 variables from js/plataforma_aysen.js VARIABLE_CATALOG
   - 31 provenance catalog items
2. Boundary and hostile inputs:
   - Nested parentheses
   - Regex metacharacters in unit: '.*+?^${}()|[]\\' and '$/kWh'
   - Substring collision ('m' in 'Consumo', 'ha' in 'Habitantes')
   - Off-by-one lengths around maxLen (25, 27, 28, 29, 30)
   - Unicode & accents ('Ocupación', 'µg/m³', '°C', 'km²')
   - Null, undefined, empty strings, pure whitespace
3. Canvas and Scale Layout Padding Invariants across all 7 chart sites.
4. Legend and Tick Typography Invariants (Inter, JetBrains Mono, NO Space Grotesk).
=============================================================================
"""

import os
import re
import json
import subprocess
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
PLATAFORMA_JS = os.path.join(ROOT_DIR, "js", "plataforma_aysen.js")
BUNDLE_FILE = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
SERIES_FILE = os.path.join(ROOT_DIR, "data", "series_prospectivas.json")
PROVENANCE_FILE = os.path.join(ROOT_DIR, "data", "systemic", "provenance_catalog.json")


def extract_js_format_axis_title(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    m = re.search(r'(function formatAxisTitle\(name,\s*unit,\s*maxLen\s*=\s*28\)\s*\{[\s\S]+?return base;\s*\})', content)
    if not m:
        raise ValueError(f"Could not find formatAxisTitle in {file_path}")
    return m.group(1)


def run_node_js_format_axis_title(js_func, test_cases):
    """
    Executes the exact JS function in Node.js against an array of test cases:
    test_cases: list of dicts with {"name": ..., "unit": ..., "maxLen": ... (optional)}
    """
    runner_code = f"""
    {js_func}
    const cases = {json.dumps(test_cases, ensure_ascii=False)};
    const results = cases.map(c => {{
      const maxL = c.maxLen !== undefined ? c.maxLen : 28;
      const res = formatAxisTitle(c.name, c.unit, maxL);
      return {{
        inputName: c.name,
        inputUnit: c.unit,
        maxLen: maxL,
        result: res
      }};
    }});
    console.log(JSON.stringify(results));
    """
    proc = subprocess.run(
        ["node", "-e", runner_code],
        capture_output=True,
        text=True,
        cwd=ROOT_DIR,
        encoding="utf-8"
    )
    if proc.returncode != 0:
        raise RuntimeError(f"Node execution failed:\n{proc.stderr}")
    return json.loads(proc.stdout)


class TestMilestone3EmpiricalChallenger(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            cls.lab_html = f.read()

        with open(PLATAFORMA_JS, "r", encoding="utf-8") as f:
            cls.plat_js = f.read()

        cls.lab_js_func = extract_js_format_axis_title(LAB_HTML)
        cls.plat_js_func = extract_js_format_axis_title(PLATAFORMA_JS)

        # Collect all 49+ variables from official data sources
        cls.dataset_variables = []

        # 1. Series prospectivas (18 variables)
        if os.path.exists(SERIES_FILE):
            with open(SERIES_FILE, "r", encoding="utf-8") as f:
                sp = json.load(f)
            for s in sp.get("series", []):
                cls.dataset_variables.append({
                    "name": s.get("nombre", ""),
                    "unit": s.get("unidad", ""),
                    "source": "series_prospectivas"
                })

        # 2. Bundle hubs / nodos (31 variables)
        if os.path.exists(BUNDLE_FILE):
            with open(BUNDLE_FILE, "r", encoding="utf-8") as f:
                b_text = f.read()
            idx = b_text.find("window.AYSEN_HUBS_DATA = ")
            if idx != -1:
                raw_json = b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
                hubs_data = json.loads(raw_json)
                for n in hubs_data.get("nodos", []):
                    cs = n.get("chartSpec") or {}
                    cls.dataset_variables.append({
                        "name": n.get("titulo") or n.get("nombre", ""),
                        "unit": cs.get("unit") or n.get("unidad", ""),
                        "source": "bundle_nodos"
                    })

        # 3. Provenance catalog (31 items)
        if os.path.exists(PROVENANCE_FILE):
            with open(PROVENANCE_FILE, "r", encoding="utf-8") as f:
                prov = json.load(f)
            for item in prov.get("nodes", []):
                cls.dataset_variables.append({
                    "name": item.get("title", "") or item.get("variable", ""),
                    "unit": item.get("unit", "") or item.get("unidad", ""),
                    "source": "provenance_catalog"
                })

        # 4. VARIABLE_CATALOG in plataforma_aysen.js
        vcat_matches = re.findall(
            r'\{\s*id:\s*[\'"][^\'"]+[\'"],\s*name:\s*[\'"]([^\'"]+)[\'"],\s*unit:\s*[\'"]([^\'"]*)[\'"]',
            cls.plat_js
        )
        for name, unit in vcat_matches:
            cls.dataset_variables.append({
                "name": name,
                "unit": unit,
                "source": "plataforma_vcat"
            })

    def test_01_all_dataset_variables_executed_in_node_js(self):
        """Run all data lake variables through the exact JS formatAxisTitle implementation in Node.js."""
        self.assertGreaterEqual(len(self.dataset_variables), 49, "Must probe at least 49 unique variables")

        cases = [{"name": v["name"], "unit": v["unit"]} for v in self.dataset_variables if v["name"]]

        # Test both JS functions (laboratorio and plataforma)
        for js_func, label in [(self.lab_js_func, "laboratorio.html"), (self.plat_js_func, "plataforma_aysen.js")]:
            results = run_node_js_format_axis_title(js_func, cases)

            for r in results:
                name = r["inputName"]
                unit = r["inputUnit"]
                res = r["result"]

                # Extract base and unit from result
                m = re.match(r'^(.*?)(?:\s*\((.*?)\))?$', res)
                self.assertIsNotNone(m, f"[{label}] Malformed result for '{name}': '{res}'")
                base = m.group(1)
                res_unit = m.group(2) if m.group(2) is not None else ""

                # Invariant 1: Base string <= 28 characters
                self.assertLessEqual(
                    len(base), 28,
                    f"[{label}] Base exceeded 28 chars: len({base})={len(base)} from original '{name}'"
                )

                # Invariant 2: Base does not end with space before ellipsis
                if "..." in base:
                    self.assertFalse(base.endswith(" ..."), f"[{label}] Trailing space before ellipsis in '{base}'")
                    self.assertTrue(base.endswith("..."), f"[{label}] Ellipsis missing at end in '{base}'")

                # Invariant 3: Unit properly appended
                if unit and str(unit).strip():
                    self.assertEqual(
                        res_unit, str(unit).strip(),
                        f"[{label}] Unit mismatch for '{name}'. Expected '{unit}', got '{res_unit}' in '{res}'"
                    )
                else:
                    self.assertEqual(res_unit, "", f"[{label}] Unexpected unit in '{res}' for empty unit")

                # Invariant 4: No duplicate units like '(%) (%)' or '(km) (km)'
                if unit:
                    esc_u = re.escape(str(unit).strip())
                    dup_pattern = rf'\({esc_u}\)\s*\({esc_u}\)'
                    self.assertIsNone(
                        re.search(dup_pattern, res),
                        f"[{label}] Duplicate unit detected in: '{res}'"
                    )

    def test_02_hostile_boundary_and_adversarial_inputs(self):
        """Stress-test formatAxisTitle against adversarial edge cases."""
        adversarial_cases = [
            # 1. Exact length boundaries
            {"name": "1234567890123456789012345", "unit": "km", "expected_base": "1234567890123456789012345"},  # 25
            {"name": "123456789012345678901234567", "unit": "km", "expected_base": "123456789012345678901234567"},  # 27
            {"name": "1234567890123456789012345678", "unit": "km", "expected_base": "1234567890123456789012345678"},  # 28
            {"name": "12345678901234567890123456789", "unit": "km", "expected_base": "1234567890123456789012345..."},  # 29 -> 25 + '...'
            {"name": "123456789012345678901234 6789", "unit": "km", "expected_base": "123456789012345678901234..."},  # 25th is space -> trimmed
            # 2. Redundant embedded units in name
            {"name": "Población Comunal (%)", "unit": "%", "expected_base": "Población Comunal"},
            {"name": "Población Comunal (% )", "unit": "%", "expected_base": "Población Comunal"},
            {"name": "Inversión Pública (M$ CLP)", "unit": "M$ CLP", "expected_base": "Inversión Pública"},
            {"name": "Inversión Pública (M$  CLP)", "unit": "M$ CLP", "expected_base": "Inversión Pública"},
            {"name": "Superficie Protegida (ha)", "unit": "ha", "expected_base": "Superficie Protegida"},
            {"name": "Consumo Residencial (horas/año)", "unit": "horas/año", "expected_base": "Consumo Residencial"},
            # 3. Units with regex metacharacters
            {"name": "Tarifa Eléctrica ($/litro)", "unit": "$/litro", "expected_base": "Tarifa Eléctrica"},
            {"name": "Métrica Compleja (a*b+c?)", "unit": "a*b+c?", "expected_base": "Métrica Compleja"},
            {"name": "Métrica Con Corchetes [X]", "unit": "[X]", "expected_base": "Métrica Con Corchetes [X]"},
            # 4. Empty / null / whitespace inputs
            {"name": "", "unit": "km", "expected_res": ""},
            {"name": None, "unit": "km", "expected_res": ""},
            {"name": "Solo Nombre", "unit": "", "expected_res": "Solo Nombre"},
            {"name": "Solo Nombre", "unit": "   ", "expected_res": "Solo Nombre"},
            {"name": "Solo Nombre", "unit": None, "expected_res": "Solo Nombre"},
            # 5. Massive 500-char string
            {"name": "Superforecast" * 40, "unit": "pts", "maxLen": 28},
            # 6. Custom maxLen overrides
            {"name": "Nombre Relativamente Corto", "unit": "ha", "maxLen": 15, "expected_base": "Nombre Relat..."},
        ]

        for js_func, label in [(self.lab_js_func, "laboratorio.html"), (self.plat_js_func, "plataforma_aysen.js")]:
            results = run_node_js_format_axis_title(js_func, adversarial_cases)

            for i, r in enumerate(results):
                case = adversarial_cases[i]
                res = r["result"]

                if "expected_res" in case:
                    self.assertEqual(res, case["expected_res"], f"[{label}] Failed case: {case}")
                    continue

                m = re.match(r'^(.*?)(?:\s*\((.*?)\))?$', res)
                self.assertIsNotNone(m, f"[{label}] Malformed result for case {case}: '{res}'")
                base = m.group(1)

                if "expected_base" in case:
                    self.assertEqual(base, case["expected_base"], f"[{label}] Failed expected_base: {case}, got '{base}'")

                # Invariant: Base never exceeds requested maxLen
                target_max = case.get("maxLen", 28)
                self.assertLessEqual(len(base), target_max, f"[{label}] Base exceeds {target_max}: '{base}'")

                # Check unit
                if case.get("unit"):
                    self.assertTrue(res.endswith(f"({case['unit']})"), f"[{label}] Result missing unit: '{res}'")

    def test_03_all_seven_charts_layout_padding_invariants(self):
        """
        Verify all 7 chart instances have layout.padding meeting the editorial standard:
        - top >= 12
        - bottom >= 14
        - left >= 14
        - right >= 18 (univariate) / >= 22 (bivariate dual-axis)
        """
        # --- Laboratorio charts: 3 types (scatter, line, bar) ---
        lab_paddings = re.findall(r'layout:\s*\{\s*padding:\s*\{([^}]+)\}\s*\}', self.lab_html)
        self.assertGreaterEqual(len(lab_paddings), 3, "laboratorio.html must configure at least 3 chart layout paddings")

        for p_str in lab_paddings:
            self.assertIn("top: 12", p_str, f"laboratorio top padding must be 12: {p_str}")
            self.assertIn("bottom: 14", p_str, f"laboratorio bottom padding must be 14: {p_str}")
            self.assertIn("left: 14", p_str, f"laboratorio left padding must be 14: {p_str}")
            # right is 18 (scatter univariate) or conditional 18/22 (line & bar)
            self.assertTrue("right: 18" in p_str or "22 : 18" in p_str, f"laboratorio right padding invalid: {p_str}")

        # --- Plataforma charts: 4 types (EMAT, multiannual, communal bar, bubble) ---
        plat_paddings = re.findall(r'layout:\s*\{\s*padding:\s*\{([^}]+)\}\s*\}', self.plat_js)
        self.assertGreaterEqual(len(plat_paddings), 4, "plataforma_aysen.js must configure 4 chart layout paddings")

        for p_str in plat_paddings:
            self.assertIn("top: 12", p_str, f"plataforma top padding must be 12: {p_str}")
            self.assertIn("bottom: 14", p_str, f"plataforma bottom padding must be 14: {p_str}")
            self.assertIn("left: 14", p_str, f"plataforma left padding must be 14: {p_str}")
            self.assertTrue("right: 18" in p_str or "right: 22" in p_str or "22 : 18" in p_str,
                            f"plataforma right padding invalid: {p_str}")

    def test_04_ticks_and_title_padding_invariants(self):
        """
        Verify scale ticks and scale title paddings to guarantee zero collision:
        - x.ticks.padding: 4
        - y.ticks.padding: 6
        - x.title.padding: top: 8, bottom: 2
        - y.title.padding: top: 0, bottom: 6
        - y1.title.padding: top: 6, bottom: 0
        """
        # Check in laboratorio.html
        self.assertIn("padding: 4", self.lab_html, "X ticks padding 4 must be present")
        self.assertIn("padding: 6", self.lab_html, "Y ticks padding 6 must be present")
        self.assertIn("padding: { top: 8, bottom: 2 }", self.lab_html, "X title padding must be present")
        self.assertIn("padding: { top: 0, bottom: 6 }", self.lab_html, "Y title padding must be present")
        self.assertIn("padding: { top: 6, bottom: 0 }", self.lab_html, "Y1 title padding must be present")

        # Check in js/plataforma_aysen.js
        self.assertIn("padding: 4", self.plat_js, "X ticks padding 4 must be present in JS")
        self.assertIn("padding: 6", self.plat_js, "Y ticks padding 6 must be present in JS")
        self.assertIn("padding: { top: 8, bottom: 2 }", self.plat_js, "X title padding must be present in JS")
        self.assertIn("padding: { top: 0, bottom: 6 }", self.plat_js, "Y title padding must be present in JS")
        self.assertIn("padding: { top: 6, bottom: 0 }", self.plat_js, "Y1 title padding must be present in JS")

    def test_05_typography_invariants_no_space_grotesk_in_charts(self):
        """
        Verify absence of 'Space Grotesk' in Chart.js options, and presence of:
        - Inter for legends, tooltips, axis titles, X ticks
        - JetBrains Mono for numeric Y/Y1 ticks
        """
        # Ensure 'Space Grotesk' is NOT used in Chart configurations
        chart_space_grotesk_lab = re.findall(r'family:\s*[\'"][^\'"]*Space Grotesk[^\'"]*[\'"]', self.lab_html)
        self.assertEqual(
            len(chart_space_grotesk_lab), 0,
            f"Space Grotesk found in laboratorio.html chart configs: {chart_space_grotesk_lab}"
        )

        chart_space_grotesk_plat = re.findall(r'family:\s*[\'"][^\'"]*Space Grotesk[^\'"]*[\'"]', self.plat_js)
        self.assertEqual(
            len(chart_space_grotesk_plat), 0,
            f"Space Grotesk found in plataforma_aysen.js chart configs: {chart_space_grotesk_plat}"
        )

        # Ensure Inter is used in legends
        self.assertIn("family: \"'Inter', sans-serif\"", self.lab_html)
        self.assertIn("family: \"'Inter', sans-serif\"", self.plat_js)

        # Ensure JetBrains Mono is used for numeric ticks
        self.assertIn("family: \"'JetBrains Mono', monospace\"", self.lab_html)
        self.assertIn("family: \"'JetBrains Mono', monospace\"", self.plat_js)

    def test_06_legend_boxwidth_and_padding_standards(self):
        """
        Ensure legend labels have boxWidth: 10, font size 9.5, padding 8 across all charts.
        """
        legend_pat = r'labels:\s*\{\s*boxWidth:\s*10,\s*font:\s*\{\s*size:\s*9\.5,\s*family:\s*"\'Inter\',\s*sans-serif"\s*\},\s*padding:\s*8\s*\}'
        self.assertRegex(self.lab_html, legend_pat, "laboratorio.html must use standardized editorial legend styling")
        self.assertRegex(self.plat_js, legend_pat, "js/plataforma_aysen.js must use standardized editorial legend styling")


if __name__ == "__main__":
    unittest.main()
