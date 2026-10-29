#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_hub_dashboard_and_canonical_vars.py
=============================================================================
Suite de Verificación E2E para el Lanzador de Dashboards por Hub (5 gráficos),
resolución canónica de varX/varY en los 50 presets (40 Hubs + 10 Extensión),
renderizado de los 5 formatos (map, bar, scatter, line, special),
createReflectionCard(cfg) y jerarquía de z-index en laboratorio.html.
=============================================================================
"""

import json
import os
import re
import sys
import unittest
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
LAB_HTML = ROOT_DIR / "laboratorio.html"
HUBS_BUNDLE = ROOT_DIR / "data" / "aysen_hubs_data.js"

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE,
)


class TestHubDashboardAndCanonicalVars(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.lab_html = LAB_HTML.read_text(encoding="utf-8")
        b_text = HUBS_BUNDLE.read_text(encoding="utf-8")
        idx = b_text.find("window.AYSEN_HUBS_DATA = ")
        raw_json = b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
        cls.bundle = json.loads(raw_json)

        # Build the exact set of canonical communal & temporal variable IDs available in AppState.catalogItems
        cls.communal_ids = set()
        if cls.bundle.get("comunas"):
            c0 = cls.bundle["comunas"][0]
            non_num = {
                "id", "comuna_ine", "codigo_comuna", "nombre", "nombre_comuna", "provincia",
                "cabecera", "cuenca_bna", "unidades_snaspe", "dependencia_barcaza",
                "salud_principal", "aerodromo", "alcalde", "partido_alcalde", "sistema_electrico",
                "estado_foa", "zoit_nombre",
            }
            for k, v in c0.items():
                if k not in non_num and isinstance(v, (int, float)):
                    cls.communal_ids.add(k)

        ext = cls.bundle.get("extension_modules", {})
        for mod_key in ("cultura_patrimonio", "ctci_innovacion"):
            por_comuna = ext.get(mod_key, {}).get("por_comuna", [])
            if por_comuna:
                datos = por_comuna[0].get("datos", {})
                for k, v in datos.items():
                    if isinstance(v, (int, float)):
                        cls.communal_ids.add(k)

        # Extract synchronous temporal IDs registered in laboratorio.html
        cls.temporal_ids = set(
            re.findall(r"id:\s*'([a-z0-9_]+)'", cls.lab_html)
        ) - cls.communal_ids

    def test_01_all_50_presets_resolve_canonical_varX_and_varY(self):
        """Los 50 presets (40 canónicos + 10 extensión) deben usar llaves canónicas reales en varX y varY."""
        hubs_gallery = self.bundle.get("hubsGallery", {})
        ext_gallery = self.bundle.get("extension_gallery", {})

        self.assertIn(len(hubs_gallery), (8, 10), "Deben existir 8 o 10 Hubs en hubsGallery")
        self.assertIn(len(ext_gallery), (0, 2), "Deben existir 0 o 2 módulos en extension_gallery")

        all_hubs = {**hubs_gallery, **ext_gallery}
        forbidden_keys = {"nombre_comuna", "agno", "agno_fallo", "undefined", "null", ""}

        total_checked = 0
        for hub_id, hub_obj in all_hubs.items():
            presets = hub_obj.get("presets", [])
            self.assertEqual(len(presets), 5, f"Hub {hub_id} debe tener exactamente 5 presets")
            formats = [p.get("format_type") for p in presets]
            self.assertEqual(
                formats,
                ["map", "bar", "scatter", "line", "special"],
                f"Hub {hub_id} debe tener los 5 formatos en orden exacto",
            )

            for p in presets:
                total_checked += 1
                pid = p.get("preset_id")
                fmt = p.get("format_type")
                cfg = p.get("config", {})
                vx = cfg.get("varX")
                vy = cfg.get("varY")

                self.assertIsNotNone(vx, f"{pid} ({fmt}) tiene varX None")
                self.assertNotIn(vx, forbidden_keys, f"{pid} ({fmt}) usa llave prohibida en varX: {vx}")

                if fmt in ("map", "bar", "scatter", "special"):
                    self.assertIn(
                        vx,
                        self.communal_ids,
                        f"{pid} ({fmt}): varX='{vx}' no existe en variables comunales canónicas",
                    )
                    if fmt in ("bar", "scatter"):
                        self.assertIsNotNone(vy, f"{pid} ({fmt}) debe tener varY bivariado")
                        self.assertNotIn(vy, forbidden_keys, f"{pid} ({fmt}) usa llave prohibida en varY: {vy}")
                        self.assertIn(
                            vy,
                            self.communal_ids,
                            f"{pid} ({fmt}): varY='{vy}' no existe en variables comunales canónicas",
                        )
                    if fmt == "scatter":
                        self.assertTrue(cfg.get("showAverage"), f"{pid} (scatter) debe activar showAverage (4 cuadrantes)")
                        self.assertTrue(cfg.get("showTrend"), f"{pid} (scatter) debe activar showTrend (regresión lineal)")
                    if fmt == "special":
                        ms = cfg.get("mirror_series")
                        self.assertIsInstance(ms, dict, f"{pid} (special) debe incluir mirror_series")
                        self.assertIn("por_macrozona", ms, f"{pid} mirror_series sin por_macrozona")
                        self.assertIn("por_nivel_educativo", ms, f"{pid} mirror_series sin por_nivel_educativo")
                        self.assertIn("por_nse", ms, f"{pid} mirror_series sin por_nse")

                elif fmt == "line":
                    self.assertIn(
                        vx,
                        self.temporal_ids,
                        f"{pid} (line): varX='{vx}' no está registrado en series temporales de laboratorio.html",
                    )
                    self.assertIsNotNone(vy, f"{pid} (line) debe tener varY temporal para doble eje")
                    self.assertIn(
                        vy,
                        self.temporal_ids,
                        f"{pid} (line): varY='{vy}' no está registrado en series temporales de laboratorio.html",
                    )
                    cs = cfg.get("customChartSpec")
                    self.assertIsInstance(cs, dict, f"{pid} (line) debe incluir customChartSpec")
                    self.assertEqual(len(cs.get("labels", [])), 12, f"{pid} customChartSpec debe tener 12 años (2015-2026)")
                    self.assertEqual(len(cs.get("datasets", [])), 2, f"{pid} customChartSpec debe tener 2 datasets multieje")

        self.assertEqual(total_checked, 50, "Se deben haber auditado exactamente 50 presets")

    def test_02_hero_launcher_and_full_hub_dashboard_implementation(self):
        """Verificar implementación de renderHeroHubsLauncher, loadFullHubDashboard y createReflectionCard."""
        required_snippets = [
            'id="heroHubsLauncherGrid"',
            'id="btnLoadFullHubDashboard"',
            "function renderHeroHubsLauncher()",
            "function loadFullHubDashboard(hubId)",
            "function createReflectionCard(cfg = {})",
            "function instantiatePresetWidget(",
            "{ x: 60,   y: 50,  w: 480, h: 360 }",
            "{ x: 570,  y: 50,  w: 480, h: 360 }",
            "{ x: 1080, y: 50,  w: 480, h: 360 }",
            "{ x: 60,   y: 440, w: 730, h: 360 }",
            "{ x: 820,  y: 440, w: 740, h: 360 }",
        ]
        for snip in required_snippets:
            self.assertIn(snip, self.lab_html, f"Falta fragmento obligatorio en laboratorio.html: {snip}")

    def test_03_z_index_hierarchy_and_zero_emojis(self):
        """Verificar que modalHubGallery (3200) y barometroSociodemoDrawer (3100) superan a context-toolbar (150)."""
        self.assertIn("z-index: 3200 !important;", self.lab_html)
        self.assertIn("z-index: 3100 !important;", self.lab_html)
        self.assertNotIn(".context-toolbar {\n      z-index: 1200;\n    }", self.lab_html)

        emojis = EMOJI_REGEX.findall(self.lab_html)
        self.assertEqual(len(emojis), 0, f"Se detectaron emojis en laboratorio.html: {emojis}")


if __name__ == "__main__":
    unittest.main()
