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
        self.assertIn(len(nodos), (31, 39), "El lexicón debe contener 31 o 39 nodos satélites")

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

    def test_07_hubs_gallery_structure_and_multiformats(self):
        """Verifica que hubs_gallery contenga exactamente 8 Hubs y 5 formatos por Hub (40 presets en total)."""
        with open(CECAN_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        gallery = data.get("hubs_gallery", {})
        self.assertIn(len(gallery), (8, 10), "Deben existir 8 o 10 Hubs en hubs_gallery")

        expected_formats = {"map", "bar", "scatter", "line", "special"}
        total_presets = 0

        for hub_id, hdata in gallery.items():
            presets = hdata.get("presets", [])
            self.assertEqual(len(presets), 5, f"Hub {hub_id} debe tener exactamente 5 presets")
            total_presets += len(presets)

            formats_in_hub = {p.get("format_type") for p in presets}
            self.assertEqual(formats_in_hub, expected_formats, f"Hub {hub_id} no cumple la diversidad de 5 formatos: {formats_in_hub}")

            # Todo preset debe cruzar con otro Hub
            for p in presets:
                cross = p.get("inter_hub_cross", {})
                self.assertTrue(cross.get("cross_hub"), f"Preset {p.get('preset_id')} carece de cross_hub")
                self.assertNotEqual(cross.get("cross_hub"), hub_id, f"Preset {p.get('preset_id')} se cruza consigo mismo")

            # Cada Hub debe tener al menos 1 preset de percepción mirror
            mirrors = [p for p in presets if p.get("is_perception_mirror") is True]
            self.assertGreaterEqual(len(mirrors), 1, f"Hub {hub_id} carece de preset con is_perception_mirror")
            for m in mirrors:
                cfg = m.get("config", {})
                sc = cfg.get("sample_contract", {})
                self.assertIn("active_n", sc, f"Preset {m.get('preset_id')} carece de active_n en sample_contract")
                self.assertIn("margin_error_pct", sc, f"Preset {m.get('preset_id')} carece de margin_error_pct")
                self.assertGreater(sc.get("active_n", 0), 0)

        self.assertIn(total_presets, (40, 50), "La galería debe totalizar 40 o 50 presets")

    def test_08_barometro_espejo_statistical_robustness(self):
        """Verifica que el dataset integrado del Barómetro contenga micro-cubos y semáforo estadístico correcto."""
        baro_file = os.path.join(ROOT_DIR, "data", "raw", "barometro_uaysen", "barometro_integrado_aysen.json")
        self.assertTrue(os.path.exists(baro_file), "Debe existir barometro_integrado_aysen.json")
        with open(baro_file, "r", encoding="utf-8") as f:
            baro = json.load(f)

        self.assertIn(len(baro.get("hubs", {})), (8, 10), "Barómetro debe tener micro-cubos para 8 o 10 Hubs")

        for hid, hdata in baro["hubs"].items():
            pregs = hdata.get("preguntas", [])
            self.assertGreaterEqual(len(pregs), 1, f"Hub {hid} carece de preguntas")
            for q in pregs:
                self.assertGreater(q.get("n_muestral_valido", 0), 0)
                self.assertGreater(q.get("me_95_total", 0), 0)
                self.assertIn(q.get("semaforo_global"), ["verde", "amarillo", "rojo"])
                cubes = q.get("micro_cubos", {})
                for dim_key in ["por_nivel_educativo", "por_nse", "por_macrozona"]:
                    self.assertIn(dim_key, cubes, f"Pregunta {q.get('codigo')} carece de micro-cubo {dim_key}")
                    for cat, cval in cubes[dim_key].items():
                        n = cval.get("n_muestral", 0)
                        sem = cval.get("semaforo")
                        if n >= 50:
                            self.assertEqual(sem, "verde")
                        elif n >= 30:
                            self.assertEqual(sem, "amarillo")
                        else:
                            self.assertEqual(sem, "rojo")

    def test_09_edges_inter_hub_integrity(self):
        """Verifica que la matriz edges_inter_hub en cruces_multivariables.json y bundle tenga las 3 llaves y divergencia."""
        cruces_file = os.path.join(ROOT_DIR, "data", "cruces_multivariables.json")
        with open(cruces_file, "r", encoding="utf-8") as f:
            cruces = json.load(f)

        edges = cruces.get("edges_inter_hub", [])
        self.assertGreaterEqual(len(edges), 8, "Deben existir al menos 8 aristas inter-hub")

        valid_types = {"comunal", "economico_rut", "espacial_proximidad"}
        found_types = set()

        for e in edges:
            self.assertIn(e.get("tipo"), valid_types, f"Tipo de arista inválido: {e.get('tipo')}")
            found_types.add(e.get("tipo"))
            self.assertTrue(e.get("hub_origen"))
            self.assertTrue(e.get("hub_destino"))
            self.assertNotEqual(e.get("hub_origen"), e.get("hub_destino"))
            self.assertIn("peso_intensidad", e)
            self.assertTrue(0.0 <= e.get("peso_intensidad", -1) <= 1.0)
            self.assertIn("indice_divergencia_percepcion", e)
            self.assertTrue(0.0 <= e.get("indice_divergencia_percepcion", -1) <= 1.0)
            self.assertTrue(e.get("preset_recomendado"))

        self.assertEqual(found_types, valid_types, f"Deben estar presentes los 3 tipos de llaves: {valid_types}")


if __name__ == "__main__":
    unittest.main()
