#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/verify_ux_and_sources_redesign.py
=============================================================================
Suite de Verificación E2E de Ergonomía Visual, Layout de Tarjetas,
Zoom HUD, Modo Grilla vs Lienzo y Catálogo de Fuentes Oficiales.
=============================================================================
"""

import json
import os
import re
import sys
import unittest

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
BUNDLE_FILE = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
BUILD_SCRIPT = os.path.join(ROOT_DIR, "scripts", "build_aysen_hubs_bundle.cjs")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE,
)


class TestUXAndSourcesRedesign(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            cls.lab_html = f.read()

        with open(BUNDLE_FILE, "r", encoding="utf-8") as f:
            cls.bundle_text = f.read()

        with open(BUILD_SCRIPT, "r", encoding="utf-8") as f:
            cls.build_script = f.read()

        idx = cls.bundle_text.find("{")
        cls.bundle_data = json.loads(cls.bundle_text[idx:cls.bundle_text.rfind("}") + 1])

    def test_01_zero_data_lake_aysen(self):
        """Cero apariciones de 'Data Lake Aysén' en laboratorio.html, bundle y build script."""
        self.assertNotIn("Data Lake Aysén", self.lab_html)
        self.assertNotIn("Data Lake Aysén", self.bundle_text)
        self.assertNotIn("Data Lake Aysén", self.build_script)

    def test_02_all_22_official_sources_mapped(self):
        """Todas las 22 fuentes institucionales con sus URLs verificadas existen en build script y laboratorio."""
        required_sources = [
            ("sinim", "https://datos.sinim.gov.cl"),
            ("fndr", "https://www.dipres.gob.cl"),
            ("censo", "https://censo2024.ine.gob.cl"),
            ("casen", "https://observatorio.ministeriodesarrollosocial.gob.cl"),
            ("cead", "https://cead.spd.gob.cl"),
            ("deis", "https://deis.minsal.cl"),
            ("mineduc", "https://datosabiertos.mineduc.cl"),
            ("sernapesca", "https://www.sernapesca.cl"),
            ("sernageomin", "https://www.sernageomin.cl"),
            ("seia", "https://seia.sea.gob.cl"),
            ("sii", "https://www.sii.cl"),
            ("chilecompra", "https://datos-abiertos.chilecompra.cl"),
            ("sag", "https://www.sag.gob.cl"),
            ("cne", "https://www.cne.cl"),
            ("sec", "https://www.sec.cl"),
            ("subtel", "https://www.subtel.gob.cl"),
            ("sernatur", "https://www.sernatur.cl"),
            ("conaf", "https://www.conaf.cl"),
            ("sinca_mma", "https://sinca.mma.gob.cl"),
            ("mincap", "https://www.patrimoniocultural.gob.cl"),
            ("anid", "https://dataciencia.anid.cl"),
            ("barometro", "https://uaysen.cl"),
        ]
        for key, url in required_sources:
            self.assertIn(key, self.build_script, f"Falta clave {key} en build script")
            self.assertIn(url, self.build_script, f"Falta URL {url} en build script")
            self.assertIn(key, self.lab_html, f"Falta clave {key} en laboratorio.html")
            self.assertIn(url, self.lab_html, f"Falta URL {url} en laboratorio.html")

    def test_03_card_header_two_lines_and_multiline_title(self):
        """La cabecera de tarjeta debe tener 2 líneas (max 64px) y título con line-clamp 2."""
        self.assertIn(".widget-top-bar", self.lab_html)
        self.assertIn("max-height: 64px;", self.lab_html)
        self.assertIn(".widget-header-line1", self.lab_html)
        self.assertIn(".widget-header-line2", self.lab_html)
        self.assertIn("-webkit-line-clamp: 2;", self.lab_html)
        self.assertIn('class="widget-main-title"', self.lab_html)

    def test_04_ten_hubs_in_gallery_with_five_complete_visualizations(self):
        """Los 10 Hubs deben declarar los 5 formatos en orden: map, bar, scatter, line, special."""
        gallery = {**self.bundle_data.get("hubsGallery", {}), **self.bundle_data.get("extension_gallery", {})}
        expected_10_hubs = [
            "turismo", "salmonicultura", "energia", "gobernanza", "inversion",
            "social", "biodiversidad", "salud", "cultura_patrimonio", "ctci_innovacion"
        ]
        for h in expected_10_hubs:
            self.assertIn(h, gallery, f"Hub {h} debe existir en la galería")
            presets = gallery[h].get("presets", [])
            self.assertEqual(len(presets), 5, f"Hub {h} debe tener 5 presets")
            fmts = [p.get("format_type") for p in presets]
            self.assertEqual(fmts, ["map", "bar", "scatter", "line", "special"])

    def test_05_zoom_hud_and_dashboard_grid_mode_controls(self):
        """Presencia obligatoria de #canvasZoomHud y botón de Modo Grilla / Lienzo 2D."""
        self.assertIn('id="canvasZoomHud"', self.lab_html)
        self.assertIn('id="btnZoomOut"', self.lab_html)
        self.assertIn('id="btnZoomReset"', self.lab_html)
        self.assertIn('id="btnZoomIn"', self.lab_html)
        self.assertIn('id="btnZoomFit"', self.lab_html)
        self.assertIn('id="btnToggleDashboardMode"', self.lab_html)
        self.assertIn(".mode-dashboard-grid", self.lab_html)

    def test_06_synchronous_catalog_hydration(self):
        """renderSidebarCatalog() se debe ejecutar inmediatamente de forma síncrona antes de los fetches."""
        pos_catalog = self.lab_html.find("renderSidebarCatalog();")
        pos_fetch = self.lab_html.find("fetch('data/series_prospectivas.json')")
        self.assertNotEqual(pos_catalog, -1)
        self.assertNotEqual(pos_fetch, -1)
        self.assertLess(pos_catalog, pos_fetch, "renderSidebarCatalog debe ejecutarse antes del fetch asíncrono")

    def test_07_zero_emojis(self):
        """Cero emojis en los archivos modificados según regla innegociable de AGENTS.md."""
        self.assertFalse(EMOJI_REGEX.search(self.lab_html), "Emojis detectados en laboratorio.html")
        self.assertFalse(EMOJI_REGEX.search(self.build_script), "Emojis detectados en build script")


if __name__ == "__main__":
    unittest.main()
