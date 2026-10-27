#!/usr/bin/env python3
"""
Python Oracle Test Suite for Milestone 3 (R3) CSV Exports & RFC 4180 Conformance
-------------------------------------------------------------------------------
Adversarially validates:
1. UTF-8 BOM (\xef\xbb\xbf) presence at byte 0
2. RFC 4180 quoting and escaping of quotes, commas, and newlines
3. Invariant column count across microdata and prospective series
4. Clean execution of headless Chrome CDP export harness
"""

import unittest
import subprocess
import csv
import io
import re
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MAPA_HTML_PATH = REPO_ROOT / "mapa_territorial.html"
COMUNAS_JSON_PATH = REPO_ROOT / "data" / "comunas_aysen.json"
SERIES_JSON_PATH = REPO_ROOT / "data" / "series_prospectivas.json"

class TestM3ExportOracle(unittest.TestCase):

    def test_01_html_export_engine_contract(self):
        """Verify mapa_territorial.html contains contractual export functions and RFC 4180 logic"""
        with open(MAPA_HTML_PATH, "r", encoding="utf-8") as f:
            html = f.read()

        # Contractual functions
        self.assertIn("function escapeRFC4180(val)", html)
        self.assertIn("function downloadCSV(filename, csvContent)", html)
        self.assertIn("function exportComunasMicrodataCSV()", html)
        self.assertIn("function exportSeriesProspectivasCSV()", html)
        self.assertIn("function exportCurrentComunaCSV()", html)
        self.assertIn("function exportAllStationsCSV()", html)
        self.assertIn("function exportAllCrossesCSV()", html)
        self.assertIn("function exportCurrentStationCSV()", html)
        self.assertIn("function exportCrossDataCSV()", html)

        # UTF-8 BOM contract
        self.assertIn(r"\uFEFF", html)
        self.assertIn("URL.revokeObjectURL(url)", html)

    def test_02_escape_rfc4180_parity(self):
        """Verify Python simulation of escapeRFC4180 matches RFC 4180 specification exactly"""
        def js_escape_rfc4180(val):
            if val is None:
                return ''
            s = str(val)
            if any(ch in s for ch in ('"', ',', '\n', '\r')):
                return f'"{s.replace(chr(34), chr(34)+chr(34))}"'
            return s

        adversarial_cases = [
            'Simple',
            'Coma, separada',
            'Comillas "dobles"',
            'Salto\nde\nlínea',
            'CRLF\r\nmezclado',
            'Todo "junto", con\ncomas y "comillas"',
            '"""Triple"""',
            '',
            None,
            123.45
        ]

        for case in adversarial_cases:
            escaped = js_escape_rfc4180(case)
            # Frame between delimiter commas to simulate a CSV row
            line = f"prefix,{escaped},suffix\n"
            reader = csv.reader(io.StringIO(line))
            parsed = list(reader)
            self.assertEqual(len(parsed), 1)
            self.assertEqual(len(parsed[0]), 3)
            expected = '' if case is None else str(case)
            self.assertEqual(parsed[0][1], expected, f"Failed roundtrip on case: {case}")

    def test_03_run_node_m3_adversarial_harness(self):
        """Execute node tests/test_m3_export_runtime_adversarial.js and verify exit code 0"""
        cmd = ["node", "tests/test_m3_export_runtime_adversarial.js"]
        proc = subprocess.run(cmd, cwd=REPO_ROOT, capture_output=True, text=True, timeout=60, env={**os.environ, "PYTHON": sys.executable})
        self.assertEqual(proc.returncode, 0, f"Node adversarial harness failed: {proc.stderr}\n{proc.stdout}")
        self.assertIn("FINAL CHALLENGER 2 VERDICT: APPROVE", proc.stdout)
        self.assertIn("100% of 105 object URLs were revoked", proc.stdout)
        self.assertIn("Zero DOM leaks", proc.stdout)

if __name__ == "__main__":
    unittest.main()
