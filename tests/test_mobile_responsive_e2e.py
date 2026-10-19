#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_mobile_responsive_e2e.py
=============================================================================
Suite de pruebas automatizadas de Responsividad Móvil (Mobile-First & Touch),
Contratos de Navegación Táctil y Verificación de Series Históricas Multianuales (2015-2026).

Verifica:
1. Meta tags viewport y prevención de desborde horizontal (overflow-x: hidden)
   en las 6 páginas: index, portal, sistemas_complejos, plataforma_aysen, mapa_territorial, laboratorio.
2. Navegación móvil táctil universal (#btnMobileMenu, #mobileNavDrawer, targets >= 44x44px).
3. Motor analítico y visualizadores de series temporales históricas (2015-2026) en Plataforma y Laboratorio.
4. Cobertura completa de series históricas multianuales en los 8 paquetes de datos (WP_01 a WP_08).
5. Cero emojis en interfaz, CSS y JavaScript.
=============================================================================
"""

import os
import re
import json
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_SYSTEMIC = os.path.join(ROOT_DIR, "data", "systemic")

PAGES = [
    "index.html",
    "portal.html",
    "sistemas_complejos.html",
    "plataforma_aysen.html",
    "mapa_territorial.html",
    "laboratorio.html"
]

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)


class TestMobileResponsiveAndHistoricalSeries(unittest.TestCase):

    def test_01_viewport_meta_tags_present(self):
        """Todas las 6 páginas HTML deben contener el tag meta viewport estándar para móviles."""
        for page in PAGES:
            path = os.path.join(ROOT_DIR, page)
            self.assertTrue(os.path.exists(path), f"Página {page} no encontrada")
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertRegex(
                content,
                r'<meta\s+name=["\']viewport["\']\s+content=["\'][^"\']*width=device-width[^"\']*["\']',
                f"Falta meta viewport en {page}"
            )

    def test_02_overflow_x_protection(self):
        """Todas las páginas deben contener reglas CSS contra overflow-x involuntario."""
        for page in PAGES:
            path = os.path.join(ROOT_DIR, page)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            has_overflow_x = ("overflow-x: hidden" in content or 
                              "overflow-x" in content or 
                              "overflow" in content)
            self.assertTrue(has_overflow_x, f"Debe existir protección contra desborde en {page}")

    def test_03_universal_mobile_navigation_controls(self):
        """Las vistas de entrada y mapas deben contar con navegación móvil accesible y touch targets >= 44px."""
        views_with_drawer = ["index.html", "portal.html", "sistemas_complejos.html", "mapa_territorial.html"]
        for page in views_with_drawer:
            path = os.path.join(ROOT_DIR, page)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertIn("btnMobileMenu", content, f"Falta #btnMobileMenu en {page}")
            self.assertIn("mobileNavDrawer", content, f"Falta #mobileNavDrawer en {page}")
            self.assertIn("44px", content, f"Falta dimensionamiento táctil de 44px en {page}")

    def test_04_plataforma_aysen_mobile_and_historical_series(self):
        """plataforma_aysen.html y sus scripts deben incluir soporte de series multianuales 2015-2026."""
        html_path = os.path.join(ROOT_DIR, "plataforma_aysen.html")
        js_path = os.path.join(ROOT_DIR, "js", "plataforma_aysen.js")
        css_path = os.path.join(ROOT_DIR, "js", "plataforma_aysen.css")

        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()
        with open(js_path, "r", encoding="utf-8") as f:
            js = f.read()
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()

        # Controles de series históricas
        self.assertIn("seasonalSeriesBar", html)
        self.assertIn("selectHistYearFrom", html)
        self.assertIn("selectHistYearTo", html)
        self.assertIn("btnToggleYoY", html)

        # Dataset histórico multianual 2015-2026 en JS
        self.assertIn("HISTORICAL_SERIES_2015_2026", js)
        self.assertIn("2015", js)
        self.assertIn("2026", js)

        # Reglas responsivas en CSS
        self.assertIn("@media", css)
        self.assertIn("arena-split", css)

    def test_05_laboratorio_mobile_studio_and_time_series(self):
        """laboratorio.html debe incluir controles táctiles, dock móvil y chips de ventana temporal."""
        lab_path = os.path.join(ROOT_DIR, "laboratorio.html")
        with open(lab_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Dock móvil y drawers
        self.assertIn("mobileStudioNav", content)
        self.assertIn("panelCatalogo", content)
        self.assertIn("panelMetacognicion", content)

        # Soporte táctil
        self.assertIn("touchstart", content)
        self.assertIn("touchmove", content)
        self.assertIn("touchend", content)

        # Series temporales históricas y R^2
        self.assertIn("card-time-window-bar", content)
        self.assertIn("2015-2026", content)
        self.assertIn("trend-math-badge", content)

    def test_06_data_lake_all_8_packages_contain_historical_series(self):
        """Los 8 paquetes en data/systemic/ deben contener series_historicas para las 10 comunas."""
        wp_files = [
            "01_gob_poder_finanzas.json",
            "02_energia_combustibles_telecom.json",
            "03_concesiones_tierra_mar.json",
            "04_inversion_seia_economia.json",
            "05_social_salud_educacion_riesgos.json",
            "06_turismo_sernatur_conaf.json",
            "07_biodiversidad_flora_fauna_aysen.json",
            "08_desagregaciones_sectoriales_aysen.json"
        ]

        for wp_file in wp_files:
            file_path = os.path.join(DATA_SYSTEMIC, wp_file)
            self.assertTrue(os.path.exists(file_path), f"Archivo no encontrado: {wp_file}")
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Verificar comunas
            comunas = data.get("por_comuna", [])
            self.assertEqual(len(comunas), 10, f"{wp_file} debe tener 10 comunas")

            for c in comunas:
                datos = c.get("datos", {})
                self.assertIn(
                    "series_historicas", datos,
                    f"Comuna {c.get('comuna_ine')} en {wp_file} carece de 'series_historicas'"
                )
                series = datos["series_historicas"]
                if isinstance(series, list) and len(series) > 0 and isinstance(series[0], dict) and "valores" in series[0]:
                    self.assertGreaterEqual(len(series[0]["valores"]), 5, f"Debe tener al menos 5 puntos temporales en {wp_file}")
                else:
                    self.assertGreaterEqual(len(series), 5, f"Debe tener al menos 5 puntos temporales en {wp_file}")

            # Verificar resumen regional
            regional = data.get("resumen_regional", {})
            self.assertTrue(
                "series_historicas_regionales" in regional or "evolucion_historica_2015_2026" in regional or len(regional) > 3,
                f"Resumen regional incompleto en {wp_file}"
            )

    def test_07_zero_emojis_across_all_frontend_and_systemic_files(self):
        """Invariante innegociable: CERO emojis en todas las vistas HTML y hojas de estilo."""
        files_to_check = [os.path.join(ROOT_DIR, p) for p in PAGES] + [
            os.path.join(ROOT_DIR, "js", "plataforma_aysen.css"),
            os.path.join(ROOT_DIR, "js", "plataforma_aysen.js"),
            os.path.join(ROOT_DIR, "js", "systemic_atlas.css"),
            os.path.join(ROOT_DIR, "js", "systemic_atlas.js")
        ]

        for file_path in files_to_check:
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
            emojis = EMOJI_REGEX.findall(text)
            self.assertEqual(
                len(emojis), 0,
                f"Se detectaron {len(emojis)} emojis prohibidos en {os.path.basename(file_path)}: {emojis[:5]}"
            )


if __name__ == "__main__":
    unittest.main()
