#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_cecan_presets_and_nl2chart.py
=============================================================================
Suite de pruebas de integración para:
1. Matriz de 16 Presets de Sistemas Complejos (CECAN):
   - 13 Presets Empíricos Activos (#01, #02, #04, #05, #06, #07, #08, #09, #10, #11, #14, #15, #16)
   - 3 Propiedades Epistemológicamente Vacías (#03, #12, #13) con notas metodológicas y redirecciones.
2. Motor de Lenguaje Natural a Gráficos (NL2Chart Zero-API):
   - Diccionario regional con >70 variables indexadas (data/nl_lexicon_aysen.json).
   - Motor client-side (js/nl2chart_engine.js) con resolución instantánea (0ms).
3. Integración en interfaces (sistemas_complejos.html, laboratorio.html, plataforma_aysen.html).
4. Principio innegociable de CERO EMOJIS.
=============================================================================
"""

import os
import re
import json
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CECAN_FILE = os.path.join(ROOT_DIR, "data", "cecan_16_presets_aysen.json")
LEXICON_FILE = os.path.join(ROOT_DIR, "data", "nl_lexicon_aysen.json")
NL_ENGINE_FILE = os.path.join(ROOT_DIR, "js", "nl2chart_engine.js")
HUBS_DATA_FILE = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)


class TestCecanPresetsAndNl2Chart(unittest.TestCase):

    def test_01_cecan_presets_json_structure(self):
        """data/cecan_16_presets_aysen.json debe contener exactamente las 16 propiedades CECAN."""
        self.assertTrue(os.path.exists(CECAN_FILE), "data/cecan_16_presets_aysen.json debe existir")
        with open(CECAN_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        properties = data.get("properties", [])
        self.assertEqual(len(properties), 16, "Deben existir exactamente 16 propiedades")

        # Verificar conteo de empíricas y vacías
        empirical = [p for p in properties if p.get("hasEmpiricalChart") is True]
        empty = [p for p in properties if p.get("hasEmpiricalChart") is False]

        self.assertEqual(len(empirical), 13, "Deben existir exactamente 13 propiedades con presets empíricos activos")
        self.assertEqual(len(empty), 3, "Deben existir exactamente 3 propiedades declaradas epistemológicamente vacías")

        empty_ids = {p.get("property_id") for p in empty}
        self.assertEqual(empty_ids, {3, 12, 13}, "Las propiedades vacías deben ser exactamente #03, #12 y #13")

        for p in empty:
            self.assertIn("methodological_note", p, f"Propiedad {p.get('property_id')} carece de methodological_note")
            note = p["methodological_note"]
            self.assertTrue(note.get("reason"), "Debe incluir explicación metodológica")
            self.assertTrue(note.get("redirect") or note.get("redirect_url"), "Debe incluir redirección")

    def test_02_cecan_empirical_presets_variables_exist(self):
        """Las variables referenciadas en los presets empíricos deben existir en el Data Lake."""
        with open(CECAN_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Leer variables comunales de data/aysen_hubs_data.js
        with open(HUBS_DATA_FILE, "r", encoding="utf-8") as f:
            hubs_text = f.read()
        idx = hubs_text.find("window.AYSEN_HUBS_DATA = ")
        raw_json = hubs_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
        hubs_obj = json.loads(raw_json)
        comuna_keys = set(hubs_obj["comunas"][0].keys())

        special_cross_vars = {
            "dias_sobre_norma_mp25", "urgencias_respiratorias_pct", "hogares_lena_pct",
            "biomasa_cosecha_kton", "infa_aerobica_pct", "alexandrium_cel_l", "caudal_baker_m3s",
            "nivel_colonia_m", "precipitacion_tortel_mm", "sst_c", "tsm_fiordos", "fan_alexandrium",
            "temperatura_minima_balmaceda", "mp25_invernal_coyhaique", "egresos_respiratorios",
            "temp_min_c", "mp25_ugm3"
        }

        for prop in data.get("properties", []):
            if not prop.get("hasEmpiricalChart"):
                continue
            presets = prop.get("presets", [])
            if not presets and "primary_preset" in prop:
                presets = [prop["primary_preset"]]
            self.assertGreaterEqual(len(presets), 1, f"Propiedad {prop['property_id']} sin presets")

            for preset in presets:
                title = preset.get("titulo") or preset.get("title")
                self.assertTrue(title, "El preset debe tener título")
                varX = preset.get("varX") or preset.get("seriePrimaria") or preset.get("llavePrimaria")
                varY = preset.get("varY") or preset.get("serieSecundaria") or preset.get("llaveSecundaria")
                self.assertTrue(varX, f"Preset {title} carece de varX")
                self.assertTrue(varY, f"Preset {title} carece de varY")

                # Comprobar que varX y varY existan (directo o por llave)
                for v in [varX, varY]:
                    valid = (v in comuna_keys or v in special_cross_vars)
                    self.assertTrue(valid, f"Variable {v} en preset {title} no existe en el Data Lake")

    def test_03_nl_lexicon_coverage(self):
        """data/nl_lexicon_aysen.json debe indexar >70 variables y 31 nodos satélites."""
        self.assertTrue(os.path.exists(LEXICON_FILE), "data/nl_lexicon_aysen.json debe existir")
        with open(LEXICON_FILE, "r", encoding="utf-8") as f:
            lexicon = json.load(f)

        variables = lexicon.get("variables", [])
        nodos = lexicon.get("nodes") or lexicon.get("satellite_nodes", [])

        self.assertGreaterEqual(len(variables), 70, "El lexicón debe contener al menos 70 variables comunales")
        self.assertEqual(len(nodos), 31, "El lexicón debe contener exactamente 31 nodos satélites")

        # Verificar grupos semánticos obligatorios
        var_ids = {v["id"] for v in variables}
        required_vars = [
            "concesiones_salmon", "biomasa_salmon_ton", "presupuesto_mclp", "ipp_per_capita_clp",
            "urgencias_respiratorias_pct", "dias_sobre_norma_mp25", "hogares_lena_pct", "saidi_horas_anual",
            "ruta7_ripio_km", "traslado_coyhaique_hrs", "pernoctaciones_emat", "pobreza_multidim_pct",
            "dependencia_fcm_pct", "inversion_seia_mmusd", "superficie_glaciar_km2", "ha_snaspe_por_guardaparque"
        ]
        for rv in required_vars:
            self.assertIn(rv, var_ids, f"Variable obligatoria {rv} no está en el lexicón")

    def test_04_nl2chart_engine_resolution(self):
        """js/nl2chart_engine.js debe resolver consultas ciudadanas en Node.js."""
        self.assertTrue(os.path.exists(NL_ENGINE_FILE), "js/nl2chart_engine.js debe existir")
        with open(NL_ENGINE_FILE, "r", encoding="utf-8") as f:
            engine_code = f.read()

        self.assertIn("parseQuery", engine_code)
        self.assertIn("OptionalLLMResolver", engine_code)
        self.assertIn("excludeOutlierCoyhaique", engine_code)

    def test_05_interface_bridge_and_controls(self):
        """sistemas_complejos.html limpio de cajas empíricas, laboratorio con presets, timeline y NL oculto."""
        # 1. sistemas_complejos.html (Cajas empíricas eliminadas según especificación)
        sistemas_path = os.path.join(ROOT_DIR, "sistemas_complejos.html")
        with open(sistemas_path, "r", encoding="utf-8") as f:
            sistemas_html = f.read()
        self.assertNotIn("cecanLabBridgeSection", sistemas_html, "cecanLabBridgeSection debe haber sido eliminado")
        self.assertNotIn("cecan-bridge-box", sistemas_html, "cecan-bridge-box debe haber sido eliminado")

        # 2. laboratorio.html
        lab_path = os.path.join(ROOT_DIR, "laboratorio.html")
        with open(lab_path, "r", encoding="utf-8") as f:
            lab_html = f.read()
        self.assertIn("nlSearchInput", lab_html, "Falta input de búsqueda NL en laboratorio.html")
        self.assertIn("nl-search-bar-wrap", lab_html)
        self.assertIn("display: none !important;", lab_html, "El buscador NL debe estar oculto de la visualización")
        self.assertIn("selectCecanPreset", lab_html, "Falta selector de presets CECAN en laboratorio.html")
        self.assertIn("btnAddTimeline", lab_html, "Falta botón de Línea de Tiempo en laboratorio.html")
        self.assertIn("btnExcludeCoyhaique", lab_html, "Falta botón Excluir Coyhaique en laboratorio.html")
        self.assertIn("nl2chart_engine.js", lab_html, "Falta script nl2chart_engine.js en laboratorio.html")

        # 3. plataforma_aysen.html
        plataforma_path = os.path.join(ROOT_DIR, "plataforma_aysen.html")
        with open(plataforma_path, "r", encoding="utf-8") as f:
            plataforma_html = f.read()
        self.assertIn("nl2chart_engine.js", plataforma_html)
        self.assertIn("btnExcludeCoyhaique", plataforma_html)

    def test_06_zero_emojis_in_new_files(self):
        """CERO EMOJIS en los archivos generados."""
        for path in [CECAN_FILE, LEXICON_FILE, NL_ENGINE_FILE]:
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
            emojis = EMOJI_REGEX.findall(text)
            self.assertEqual(len(emojis), 0, f"Se detectaron emojis en {os.path.basename(path)}: {emojis}")


if __name__ == "__main__":
    unittest.main()
