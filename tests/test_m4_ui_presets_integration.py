#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_m4_ui_presets_integration.py
=============================================================================
Suite de verificación automatizada para Milestone 4 (R4):
Integración de UI y Presets para Cultura y Patrimonio y CTCi e Innovación
en Laboratorio Sistémico (laboratorio.html) y Plataforma Aysén (js/plataforma_aysen.js).
=============================================================================
"""

import os
import sys
import re
import json
import unittest

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
PLATAFORMA_JS = os.path.join(ROOT_DIR, "js", "plataforma_aysen.js")
PLATAFORMA_HTML = os.path.join(ROOT_DIR, "plataforma_aysen.html")
HUBS_DATA_FILE = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
WP09_FILE = os.path.join(ROOT_DIR, "data", "systemic", "09_cultura_patrimonio.json")
WP10_FILE = os.path.join(ROOT_DIR, "data", "systemic", "10_ctci_innovacion.json")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)


class TestM4UIPresetsIntegration(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            cls.lab_html = f.read()

        with open(PLATAFORMA_JS, "r", encoding="utf-8") as f:
            cls.plataforma_js = f.read()

        with open(PLATAFORMA_HTML, "r", encoding="utf-8") as f:
            cls.plataforma_html = f.read()

        with open(HUBS_DATA_FILE, "r", encoding="utf-8") as f:
            b_text = f.read()
        idx = b_text.find("window.AYSEN_HUBS_DATA = ")
        raw_json = b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
        cls.hubs_data = json.loads(raw_json)

    def test_01_zero_emojis_in_all_m4_files(self):
        """Principio innegociable: CERO emojis en laboratorio.html, plataforma_aysen.js y plataforma_aysen.html."""
        for fpath, content in [
            ("laboratorio.html", self.lab_html),
            ("js/plataforma_aysen.js", self.plataforma_js),
            ("plataforma_aysen.html", self.plataforma_html)
        ]:
            emojis = EMOJI_REGEX.findall(content)
            self.assertEqual(len(emojis), 0, f"Se detectaron emojis en {fpath}: {emojis}")

    def test_02_contractual_dom_ids_in_laboratorio(self):
        """laboratorio.html debe preservar intactos los contratos DOM de la galería y el barómetro."""
        required_dom_ids = [
            'id="modalHubGallery"',
            'id="hubGalleryTitle"',
            'id="hubGalleryTabs"',
            'id="hubGalleryCardsGrid"',
            'id="barometroSociodemoDrawer"',
            'id="baroSemaforoBadge"',
            'id="baroMetricN"',
            'id="baroMetricUniverse"',
            'id="baroMetricME"',
            'id="baroSampleNote"',
            'id="selectBaroEdu"',
            'id="selectBaroNse"',
            'id="selectBaroSexo"',
            'id="selectBaroEdad"',
            'id="selectBaroMacro"',
            'id="switchBaroInterregional"',
            'id="btnApplyBaroFilters"',
            'id="btnResetBaroFilters"',
            'id="btnBaroDrawerClose"'
        ]
        for dom_id in required_dom_ids:
            self.assertIn(dom_id, self.lab_html, f"Falta ID contractual en laboratorio.html: {dom_id}")

    def test_03_laboratorio_gallery_tabs_cover_extension_modules(self):
        """renderHubGalleryTabs() debe incluir pestañas para los 8 hubs canónicos y los 2 módulos de extensión."""
        self.assertIn("cultura_patrimonio", self.lab_html)
        self.assertIn("ctci_innovacion", self.lab_html)
        self.assertIn("renderHubGalleryTabs", self.lab_html)
        self.assertIn("extension_gallery", self.lab_html)
        self.assertIn("Cultura & Patrimonio", self.lab_html)
        self.assertIn("CTCi & Innovación", self.lab_html)

    def test_04_load_hub_preset_supports_cp_and_ct_presets(self):
        """loadHubPresetById(presetId) debe soportar los 10 presets de extensión CP_01..05 y CT_01..05."""
        ext_gallery = self.hubs_data.get("extension_gallery", {})
        self.assertIn("cultura_patrimonio", ext_gallery)
        self.assertIn("ctci_innovacion", ext_gallery)

        cp_presets = ext_gallery["cultura_patrimonio"].get("presets", [])
        ct_presets = ext_gallery["ctci_innovacion"].get("presets", [])
        self.assertEqual(len(cp_presets), 5, "Deben existir exactamente 5 presets en cultura_patrimonio")
        self.assertEqual(len(ct_presets), 5, "Deben existir exactamente 5 presets en ctci_innovacion")

        cp_ids = [p.get("preset_id") or p.get("id") for p in cp_presets]
        ct_ids = [p.get("preset_id") or p.get("id") for p in ct_presets]
        self.assertEqual(cp_ids, ["CP_01", "CP_02", "CP_03", "CP_04", "CP_05"])
        self.assertEqual(ct_ids, ["CT_01", "CT_02", "CT_03", "CT_04", "CT_05"])

        # Verificar que loadHubPresetById busca en extension_gallery
        self.assertIn("extension_gallery", self.lab_html)
        self.assertIn("is_perception_mirror", self.lab_html)

    def test_05_barometro_micro_cubos_and_sample_metrics(self):
        """laboratorio.html debe contener BAROMETRO_MICRO_CUBOS con estratificación n/N, ME95, badges y barra de robustez."""
        self.assertIn("BAROMETRO_MICRO_CUBOS", self.lab_html)
        
        # Mirror keys
        for key in ["B4_B", "C2", "I1_I", "I5", "I8", "F4_G"]:
            self.assertIn(f"'{key}'", self.lab_html)

        # Robustness badges and indicators
        self.assertIn("[●] Muestra Robusta", self.lab_html)
        self.assertIn("[●]", self.lab_html)
        self.assertIn("[▲]", self.lab_html)
        self.assertIn("[■]", self.lab_html)

        # Robustness bar rendering and DOM interpolation into card.innerHTML & existingCard
        self.assertIn("${sampleRobustnessHtml}", self.lab_html, "sampleRobustnessHtml debe estar interpolado en card.innerHTML")
        self.assertIn("card-sample-robustness-bar", self.lab_html)
        self.assertIn("btn-toggle-sociodemo", self.lab_html)
        self.assertIn("openSociodemoDrawer", self.lab_html)
        self.assertIn("sample-bar-", self.lab_html)
        self.assertIn("sampleBar.outerHTML = sampleRobustnessHtml", self.lab_html, "existingCard debe actualizar sampleRobustnessHtml")

    def test_06_plataforma_js_variable_catalog_extension_groups(self):
        """VARIABLE_CATALOG en plataforma_aysen.js debe contener grupos 8 (Cultura) y 9 (CTCi)."""
        self.assertIn("8. Cultura, Artes y Patrimonio (SERPAT / MINCAP / Barómetro)", self.plataforma_js)
        self.assertIn("9. CTCi e Innovación (ANID / MinCiencia / CORFO / Barómetro)", self.plataforma_js)
        for var_key in [
            "total_espacios_culturales",
            "gasto_cultura_per_capita_clp",
            "fondos_cultura_adjudicados_mclp",
            "participacion_cultural_pct_c2",
            "total_proyectos_ctci",
            "proyectos_anid_locales_count",
            "monto_anid_acumulado_mclp",
            "percepcion_ctci_prioritaria_pct_i1i"
        ]:
            self.assertIn(var_key, self.plataforma_js, f"Falta variable de extensión en catálogo: {var_key}")

    def test_07_plataforma_js_load_all_datasets_and_interhub_mode(self):
        """loadAllDatasets() debe cargar wp09, wp10 y AppState.edgesInterHub, y soportar modo interhub."""
        self.assertIn("09_cultura_patrimonio.json", self.plataforma_js)
        self.assertIn("10_ctci_innovacion.json", self.plataforma_js)
        self.assertIn("AppState.wp09", self.plataforma_js)
        self.assertIn("AppState.wp10", self.plataforma_js)
        self.assertIn("AppState.edgesInterHub", self.plataforma_js)

        # 17 aristas inter-hub en bundle
        edges = self.hubs_data.get("edges_inter_hub", [])
        self.assertEqual(len(edges), 17, f"Deben existir exactamente 17 aristas inter-hub, encontradas: {len(edges)}")

        # Enlaces de acción hacia laboratorio.html con hub y preset
        self.assertIn("laboratorio.html?hub=", self.plataforma_js)
        self.assertIn("preset_recomendado", self.plataforma_js)


if __name__ == "__main__":
    unittest.main()
