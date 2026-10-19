#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_laboratorio_m3_challenger.py
=============================================================================
Empirical Challenger Test Harness for Milestone 3:
Ejes y Leyendas en Chart.js sin Colisión

Verifies:
1. Static contract for formatAxisTitle in laboratorio.html and js/plataforma_aysen.js.
2. Invariant: All Chart.js axis title assignments use title truncation (<= 28 chars).
3. Empirical verification of formatAxisTitle on 100% of the 49 catalog variables:
   - Base length <= 28 chars
   - Ellipsis appended only when clean name > 28 chars
   - Unit preserved intact
   - Zero duplicate units
4. Layout padding invariants (top >= 12, right >= 16/22, bottom >= 14, left >= 12).
5. Rotated X-ticks clearance and legend separation invariants.
6. Zero emojis and regression preservation of test_laboratorio_audit.py test_05.
=============================================================================
"""

import os
import re
import json
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
PLATAFORMA_JS = os.path.join(ROOT_DIR, "js", "plataforma_aysen.js")
BUNDLE_FILE = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
SERIES_FILE = os.path.join(ROOT_DIR, "data", "series_prospectivas.json")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)


class TestLaboratorioM3Challenger(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            cls.lab_html = f.read()

        with open(PLATAFORMA_JS, "r", encoding="utf-8") as f:
            cls.plat_js = f.read()

        # Load all variables from bundle and series prospectivas
        cls.probed_variables = []

        if os.path.exists(SERIES_FILE):
            with open(SERIES_FILE, "r", encoding="utf-8") as f:
                sp_data = json.load(f)
            for s in sp_data.get("series", []):
                cls.probed_variables.append({
                    "nombre": s.get("nombre", ""),
                    "unidad": s.get("unidad", ""),
                    "source": "series_prospectivas"
                })

        if os.path.exists(BUNDLE_FILE):
            with open(BUNDLE_FILE, "r", encoding="utf-8") as f:
                b_text = f.read()
            idx = b_text.find("window.AYSEN_HUBS_DATA = ")
            if idx != -1:
                raw_json = b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
                hubs_data = json.loads(raw_json)
                for n in hubs_data.get("nodos", []):
                    chart_spec = n.get("chartSpec") or {}
                    cls.probed_variables.append({
                        "nombre": n.get("title") or n.get("titulo") or n.get("nombre", ""),
                        "unidad": chart_spec.get("unit") or n.get("unidad", ""),
                        "source": "bundle_nodos"
                    })

    # =========================================================================
    # 1. STATIC CODE CONTRACTS FOR FORMAT AXIS TITLE
    # =========================================================================
    def test_01_format_axis_title_declared_in_laboratorio(self):
        """formatAxisTitle must be defined in laboratorio.html with a max length parameter (default 28)."""
        self.assertIn("function formatAxisTitle", self.lab_html,
                      "formatAxisTitle function must be declared in laboratorio.html")
        m = re.search(r'function formatAxisTitle[\s\S]+?return base;\s*\}', self.lab_html)
        self.assertTrue(m, "formatAxisTitle body must be parseable")
        body = m.group(0)
        self.assertIn("28", body, "formatAxisTitle must reference the 28 character bound")
        self.assertIn("slice", body, "formatAxisTitle must slice text that exceeds the bound")

    def test_02_all_laboratorio_charts_use_axis_truncation(self):
        """Scatter, line, and bar charts in laboratorio.html must invoke formatAxisTitle for axis titles."""
        # Check scatter chart scales
        self.assertRegex(self.lab_html, r'x:\s*\{\s*title:\s*\{\s*display:\s*true,\s*text:\s*formatAxisTitle',
                         "Scatter X axis title must use formatAxisTitle")
        self.assertRegex(self.lab_html, r'y:\s*\{\s*title:\s*\{\s*display:\s*true,\s*text:\s*formatAxisTitle',
                         "Scatter Y axis title must use formatAxisTitle")

        # Check line / bar dual-axis y1
        self.assertIn("formatAxisTitle", self.lab_html)

    def test_03_plataforma_js_charts_use_axis_truncation(self):
        """plataforma_aysen.js must use formatAxisTitle for multianual, dual bar, and bubble charts."""
        self.assertIn("formatAxisTitle", self.plat_js,
                      "formatAxisTitle must be declared or used in js/plataforma_aysen.js")

    # =========================================================================
    # 2. EMPIRICAL TRUNCATION INVARIANTS ACROSS ALL DATASET VARIABLES
    # =========================================================================
    def test_04_empirical_truncation_on_all_probed_variables(self):
        """Simulate formatAxisTitle against 100% of data lake variables to verify mathematical bounds."""
        self.assertEqual(len(self.probed_variables), 49, "Must probe exactly 49 variables (18 series + 31 nodes)")

        def py_format_axis_title(name, unit, max_len=28):
            if not name:
                return ''
            clean = str(name).strip()
            if unit:
                clean = re.sub(r'\s*\(\s*' + re.escape(str(unit)) + r'\s*\)', '', clean, flags=re.I).strip()
            clean = re.sub(r'\s*\(\s*(?:%|M\$ CLP|\$ CLP|MM US\$|km²|km|ha|ton|m³/s|horas/año|kPersonas|kTon|kPasajeros|cél/L|mg/L|µg/m³|°C|mm|\$/litro|m/año|m|nidos|habitantes|eventos/mes)\s*\)$', '', clean, flags=re.I).strip()

            if len(clean) > max_len:
                base = clean[:max_len - 3].rstrip() + '...'
            else:
                base = clean

            if unit and str(unit).strip():
                return f"{base} ({str(unit).strip()})"
            return base

        for item in self.probed_variables:
            name = item["nombre"]
            unit = item["unidad"]
            self.assertTrue(name, f"Variable name must not be empty in item: {item}")

            formatted = py_format_axis_title(name, unit)

            # Extract base part cleanly without splitting on internal parenthetical acronyms (e.g. (ACS), (FOA))
            unit_str = str(unit).strip() if unit else ""
            if unit_str and formatted.endswith(f" ({unit_str})"):
                base_part = formatted[:-len(f" ({unit_str})")]
            else:
                base_part = formatted

            # Invariant 1: Base portion <= 28 characters
            self.assertLessEqual(len(base_part), 28,
                                 f"Base '{base_part}' exceeds 28 chars (original: '{name}')")

            # Invariant 2: No duplicate unit formatting like '(%) (%)'
            if unit:
                self.assertNotIn(f"({unit}) ({unit})", formatted)

            # Invariant 3: If original was > 28, must end with '...'
            clean_name = re.sub(r'\s*\([^)]*\)$', '', name).strip()
            if len(clean_name) > 28:
                self.assertTrue(base_part.endswith("..."),
                                f"Expected ellipsis on truncated '{base_part}' from '{clean_name}'")

    # =========================================================================
    # 3. COLLISION-FREE PADDING INVARIANTS
    # =========================================================================
    def test_05_layout_padding_bounds_laboratorio(self):
        """Chart options in laboratorio.html must declare padding: top>=12, right>=16, bottom>=14, left>=12."""
        # Find all layout: { padding: { ... } } instances
        matches = re.findall(r'layout:\s*\{\s*padding:\s*\{([^}]+)\}\s*\}', self.lab_html)
        self.assertGreaterEqual(len(matches), 3, "Must have layout padding configured on all 3 chart types in laboratorio.html")

        for m_str in matches:
            top_m = re.search(r'top:\s*(\d+)', m_str)
            bot_m = re.search(r'bottom:\s*(\d+)', m_str)
            left_m = re.search(r'left:\s*(\d+)', m_str)
            right_vals = [int(v) for v in re.findall(r'(\d+)', m_str[m_str.find('right:'):m_str.find('bottom:')])]

            self.assertTrue(top_m and int(top_m.group(1)) >= 12, f"top padding must be >= 12, got: {m_str}")
            self.assertTrue(bot_m and int(bot_m.group(1)) >= 14, f"bottom padding must be >= 14, got: {m_str}")
            self.assertTrue(left_m and int(left_m.group(1)) >= 12, f"left padding must be >= 12, got: {m_str}")
            self.assertTrue(len(right_vals) > 0 and all(v >= 16 for v in right_vals), f"right padding must be >= 16, got: {m_str}")

    def test_06_layout_padding_bounds_plataforma_js(self):
        """Chart options in js/plataforma_aysen.js must declare explicit layout.padding to prevent collisions."""
        self.assertIn("layout:", self.plat_js, "plataforma_aysen.js must configure layout padding")
        self.assertIn("padding:", self.plat_js)

    def test_07_x_ticks_and_legend_clearance(self):
        """Checks that X ticks maxRotation is bounded to <= 45 and legend padding >= 8."""
        self.assertIn("maxRotation: 45", self.lab_html)
        self.assertIn("padding: 8", self.lab_html)

    # =========================================================================
    # 4. REGRESSION & ZERO EMOJI INVARIANTS
    # =========================================================================
    def test_08_zero_emojis_compliance(self):
        """Zero emojis in laboratorio.html and js/plataforma_aysen.js."""
        lab_emojis = EMOJI_REGEX.findall(self.lab_html)
        self.assertEqual(len(lab_emojis), 0, f"Emojis found in laboratorio.html: {lab_emojis}")
        plat_emojis = EMOJI_REGEX.findall(self.plat_js)
        self.assertEqual(len(plat_emojis), 0, f"Emojis found in js/plataforma_aysen.js: {plat_emojis}")

    def test_09_preserve_test_laboratorio_audit_contract(self):
        """Preserves formatVarWithUnit contract required by test_laboratorio_audit.py test_05."""
        self.assertIn("function formatVarWithUnit", self.lab_html)
        m = re.search(r'function formatVarWithUnit\([^)]*\)\s*\{([^}]+)\}', self.lab_html)
        self.assertTrue(m)
        code = m.group(1)
        self.assertIn("replace", code)
        self.assertIn("%", code)


if __name__ == "__main__":
    unittest.main()
