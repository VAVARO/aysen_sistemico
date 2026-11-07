#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_laboratorio_health.py
=============================================================================
Suite de pruebas automatizadas para el módulo 'laboratorio.html'
(Laboratorio de Modelamiento Sistémico de Aysén).

Verifica:
1. Existencia e integridad de 'laboratorio.html'
2. Regla innegociable de CERO EMOJIS en interfaz y datos
3. Contratos DOM del layout de 3 paneles (Catálogo, Lienzo, Metacognición)
4. Navegación e hipervínculos bidireccionales entre los 4 módulos
5. Integridad del banco de 30 preguntas sistémicas (data/preguntas_metacognitivas.json)
6. Exportación CSV con UTF-8 BOM (\uFEFF) para compatibilidad con Excel
=============================================================================
"""

import os
import re
import json
import subprocess
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LABORATORIO_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
PORTAL_HTML = os.path.join(ROOT_DIR, "portal.html")
SISTEMAS_HTML = os.path.join(ROOT_DIR, "sistemas_complejos.html")
INDEX_HTML = os.path.join(ROOT_DIR, "index.html")
PREGUNTAS_JSON = os.path.join(ROOT_DIR, "data", "preguntas_metacognitivas.json")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)

class TestLaboratorioHealth(unittest.TestCase):

    def test_01_laboratorio_html_exists_and_clean(self):
        """Verifica existencia y tamaño del archivo laboratorio.html"""
        self.assertTrue(os.path.exists(LABORATORIO_HTML), "laboratorio.html debe existir en la raíz")
        size = os.path.getsize(LABORATORIO_HTML)
        self.assertGreater(size, 5000, f"laboratorio.html debe tener contenido sustancial (>5KB, tiene {size} bytes)")

    def test_02_zero_emojis_in_laboratorio(self):
        """Principio innegociable: CERO emojis en laboratorio.html y preguntas_metacognitivas.json"""
        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            content = f.read()
        emojis_found = EMOJI_REGEX.findall(content)
        self.assertEqual(len(emojis_found), 0, f"Se detectaron emojis prohibidos en laboratorio.html: {emojis_found}")

        if os.path.exists(PREGUNTAS_JSON):
            with open(PREGUNTAS_JSON, "r", encoding="utf-8") as f:
                json_content = f.read()
            json_emojis = EMOJI_REGEX.findall(json_content)
            self.assertEqual(len(json_emojis), 0, f"Se detectaron emojis en preguntas_metacognitivas.json: {json_emojis}")

        preguntas_js = os.path.join(ROOT_DIR, "data", "preguntas_metacognitivas.js")
        if os.path.exists(preguntas_js):
            with open(preguntas_js, "r", encoding="utf-8") as f:
                js_content = f.read()
            js_emojis = EMOJI_REGEX.findall(js_content)
            self.assertEqual(len(js_emojis), 0, f"Se detectaron emojis en preguntas_metacognitivas.js: {js_emojis}")

    def test_03_dom_contracts_three_panels(self):
        """Verifica la presencia de los contratos de los 3 paneles y sus elementos clave"""
        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            html = f.read()

        required_elements = [
            'id="brandHeader"',
            'class="brand-author-name"',
            'id="panelCatalogo"',
            'id="panelLienzo"',
            'id="panelMetacognicion"',
            'id="variablesTreeContainer"',
            'id="canvasGridStage"',
            'id="cardActiveQuestion"',
            'id="btnAddChart"',
            'id="btnAddMap"',
            'id="btnAddTable"',
            'id="btnAddKPI"',
            'id="btnEjemploSistemico"',
            'id="btnExportarJson"',
            'id="btnImportarJson"',
            'id="btnExportarReporte"',
            'id="txtAnalystNotes"',
            'id="accordionBody"'
        ]
        for elem in required_elements:
            self.assertIn(elem, html, f"El elemento contractual {elem} debe estar presente en laboratorio.html")

    def test_04_cross_module_navigation_integrity(self):
        """Verifica que todos los 4 módulos tengan enlaces cruzados hacia laboratorio.html"""
        with open(PORTAL_HTML, "r", encoding="utf-8") as f:
            portal = f.read()
        self.assertIn('href="laboratorio.html"', portal, "portal.html debe enlazar a laboratorio.html")

        with open(SISTEMAS_HTML, "r", encoding="utf-8") as f:
            sistemas = f.read()
        self.assertIn('href="laboratorio.html"', sistemas, "sistemas_complejos.html debe enlazar a laboratorio.html")

        with open(INDEX_HTML, "r", encoding="utf-8") as f:
            index = f.read()
        self.assertIn('href="laboratorio.html"', index, "index.html debe enlazar a laboratorio.html")

        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            lab = f.read()
        self.assertIn('href="portal.html"', lab, "laboratorio.html debe enlazar a portal.html")
        self.assertIn('href="sistemas_complejos.html"', lab, "laboratorio.html debe enlazar a sistemas_complejos.html")
        self.assertIn('href="index.html"', lab, "laboratorio.html debe enlazar a index.html")

    def test_05_questions_bank_structure(self):
        """Verifica la estructura y contenido del banco de 30 preguntas sistémicas"""
        self.assertTrue(os.path.exists(PREGUNTAS_JSON), "data/preguntas_metacognitivas.json debe existir")
        with open(PREGUNTAS_JSON, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertIn("preguntas", data, "El archivo debe contener el campo 'preguntas'")
        preguntas = data["preguntas"]
        self.assertEqual(len(preguntas), 30, f"Deben existir exactamente 30 preguntas (se encontraron {len(preguntas)})")

        for i, q in enumerate(preguntas, 1):
            self.assertEqual(q.get("id"), i, f"La pregunta en posición {i} debe tener id {i}")
            self.assertTrue(bool(q.get("pregunta")), f"Pregunta #{i} no puede tener texto vacío")
            self.assertTrue(bool(q.get("categoria")), f"Pregunta #{i} debe tener una categoría definida")
            self.assertIsInstance(q.get("disparadores"), list, f"Pregunta #{i} debe tener lista de disparadores")
            self.assertTrue(bool(q.get("reflexion_guia")), f"Pregunta #{i} debe tener reflexion_guia")

    def test_06_csv_export_bom_support(self):
        """Verifica que el exportador de CSV incluya el caracter UTF-8 BOM (\\uFEFF) para compatibilidad con Excel"""
        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            lab = f.read()
        self.assertIn('\\uFEFF', lab, "La función de exportación a CSV debe incluir UTF-8 BOM (\\uFEFF)")

    def test_07_barometro_filter_and_canonical_vars(self):
        """Verifica el botón de filtro Barómetro en el catálogo y las 8 variables canónicas en las 10 comunas"""
        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            lab = f.read()

        # Botón de filtro Barómetro en el panel de catálogo lateral
        self.assertIn('data-dim="barometro"', lab, "Debe existir el botón de filtro con data-dim='barometro'")
        self.assertIn('>Barómetro<', lab, "El botón debe tener la etiqueta 'Barómetro'")

        # Bundle cargado con las 8 variables del Barómetro en cada una de las 10 comunas
        bundle_file = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
        self.assertTrue(os.path.exists(bundle_file), "data/aysen_hubs_data.js debe existir")
        with open(bundle_file, "r", encoding="utf-8") as f:
            b_text = f.read()
        idx = b_text.find("window.AYSEN_HUBS_DATA = ")
        raw_json = b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
        bundle = json.loads(raw_json)

        comunas = bundle.get("comunas", [])
        self.assertEqual(len(comunas), 10, "Deben existir 10 comunas en AYSEN_HUBS_DATA")

        baro_keys = [
            "barometro_confianza_institucional_pct",
            "barometro_redes_apoyo_comunitario_pct",
            "barometro_orgullo_identidad_pct",
            "barometro_prioridad_conectividad_pct",
            "barometro_tension_desarrollo_conservacion_pct",
            "barometro_intencion_migracion_juvenil_pct",
            "barometro_evaluacion_acceso_salud_pct",
            "barometro_preocupacion_contaminacion_lena_pct"
        ]

        for comuna in comunas:
            c_name = comuna.get("nombre") or comuna.get("nombre_comuna")
            for b_key in baro_keys:
                self.assertIn(b_key, comuna, f"Falta clave {b_key} en comuna {c_name}")
                val = comuna[b_key]
                self.assertIsNotNone(val, f"Clave {b_key} es None en comuna {c_name}")
                self.assertTrue(isinstance(val, (int, float)), f"Clave {b_key} no es numérica en {c_name}: {val}")
                self.assertGreaterEqual(val, 0.0, f"Clave {b_key} menor a 0 en {c_name}: {val}")
                self.assertLessEqual(val, 100.0, f"Clave {b_key} mayor a 100% en {c_name}: {val}")

    def test_08_render_barometro_en_10_mesas_hubs(self):
        """Verifica que las 10 mesas de Hubs tengan Tarjeta 5 (Barómetro) con variables reales en comunas"""
        presets_path = os.path.join(ROOT_DIR, "data", "cecan_16_presets_aysen.json")
        self.assertTrue(os.path.exists(presets_path), "data/cecan_16_presets_aysen.json debe existir")
        with open(presets_path, "r", encoding="utf-8") as f:
            presets_data = json.load(f)

        bundle_file = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
        with open(bundle_file, "r", encoding="utf-8") as f:
            b_text = f.read()
        idx = b_text.find("window.AYSEN_HUBS_DATA = ")
        bundle = json.loads(b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n "))
        comunas = bundle.get("comunas", [])
        self.assertEqual(len(comunas), 10, "Deben existir 10 comunas en AYSEN_HUBS_DATA")

        # 8 Hubs en hubs_gallery + 2 Hubs en extension_gallery = 10 Hubs
        hubs_gallery = presets_data.get("hubs_gallery", {})
        ext_gallery = presets_data.get("extension_gallery", {})
        total_hubs = {**hubs_gallery, **ext_gallery}
        self.assertEqual(len(total_hubs), 10, f"Deben existir 10 Hubs/mesas (8 hubs + 2 extensiones), encontrados {len(total_hubs)}")

        for hub_id, hub_info in total_hubs.items():
            presets = hub_info.get("presets", [])
            self.assertGreaterEqual(len(presets), 5, f"Hub {hub_id} debe tener al menos 5 presets")
            card5 = presets[4] # Tarjeta 5: Percepción / Barómetro
            cfg = card5.get("config", {})
            var_y = cfg.get("varY")
            self.assertIsNotNone(var_y, f"Tarjeta 5 del Hub {hub_id} no tiene varY definido")
            self.assertTrue(var_y.startswith("barometro_"), f"Tarjeta 5 del Hub {hub_id} debe apuntar a una variable barometro_*, tiene '{var_y}'")

            # Verificar que la variable existe en las 10 comunas con valor numérico válido
            for comuna in comunas:
                c_name = comuna.get("nombre") or comuna.get("nombre_comuna")
                self.assertIn(var_y, comuna, f"Variable {var_y} del Hub {hub_id} falta en comuna {c_name}")
                val = comuna[var_y]
                self.assertIsNotNone(val, f"Variable {var_y} es None en comuna {c_name}")
                self.assertTrue(isinstance(val, (int, float)), f"Variable {var_y} no es numérica en {c_name}")
                self.assertGreaterEqual(val, 0.0, f"Variable {var_y} < 0 en {c_name}")
                self.assertLessEqual(val, 100.0, f"Variable {var_y} > 100% en {c_name}")

            # Verificar que mirror_series está bien formado
            ms = cfg.get("mirror_series")
            self.assertIsNotNone(ms, f"Tarjeta 5 del Hub {hub_id} debe tener mirror_series")
            self.assertIn("por_macrozona", ms, f"mirror_series del Hub {hub_id} debe tener por_macrozona")
            for mz_key, mz_val in ms["por_macrozona"].items():
                pos_pct = mz_val.get("tasa_positiva_pct") if "tasa_positiva_pct" in mz_val else mz_val.get("positive_pct")
                self.assertIsNotNone(pos_pct, f"por_macrozona.{mz_key} debe tener tasa_positiva_pct o positive_pct en Hub {hub_id}")
                self.assertIsInstance(pos_pct, (int, float), f"pos_pct debe ser numérico en {hub_id}.{mz_key}")
                self.assertGreaterEqual(pos_pct, 0.0)
                self.assertLessEqual(pos_pct, 100.0)

    def test_09_salud_poblado_en_catalogo_lateral(self):
        """Verifica que VIII. Salud aparezca poblado en el catalogo lateral de laboratorio.html y en nl_lexicon_aysen.json."""
        lexicon_path = os.path.join(ROOT_DIR, "data", "nl_lexicon_aysen.json")
        self.assertTrue(os.path.exists(lexicon_path), "data/nl_lexicon_aysen.json debe existir")
        with open(lexicon_path, "r", encoding="utf-8") as f:
            lexicon = json.load(f)

        health_vars = [
            "urgencias_respiratorias_pct",
            "camas_hospitalarias",
            "medicos_por_mil_hab",
            "aeroevacuaciones_samu_n",
            "espera_no_ges_n",
            "traslado_coyhaique_hrs",
            "salud_principal"
        ]
        raw_vars = lexicon.get("variables", [])
        lex_vars = {v.get("id"): v for v in raw_vars if isinstance(v, dict) and "id" in v}
        for hv in health_vars:
            self.assertIn(hv, lex_vars, f"Variable de salud {hv} debe estar en nl_lexicon_aysen.json")
            self.assertEqual(lex_vars[hv].get("hub"), "salud", f"Variable {hv} debe tener hub='salud'")
            self.assertEqual(lex_vars[hv].get("hubTitle"), "VIII. Salud", f"Variable {hv} debe tener hubTitle='VIII. Salud'")

        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            html = f.read()

        self.assertIn("return 'salud';", html, "hubInference debe retornar 'salud'")
        self.assertIn("return 'cultura';", html, "hubInference debe retornar 'cultura'")
        self.assertIn("return 'ctci';", html, "hubInference debe retornar 'ctci'")
        self.assertIn("VIII. Salud", html, "laboratorio.html debe contener el titulo 'VIII. Salud'")

        # Verificar ejecucion real de hubInference sobre variables clave y series de salud
        node_script = """
        const fs = require('fs');
        const html = fs.readFileSync('laboratorio.html', 'utf8');

        // Extraer hubInference del HTML
        const m = html.match(/const hubInference = \\(([^)]*)\\) => \\{([\\s\\S]*?)\\n\\s*\\};/);
        if (!m) {
            console.error('hubInference declaration not found in laboratorio.html');
            process.exit(1);
        }
        const hubInference = new Function('k', m[2]);

        const saludVars = ['camas_hospitalarias', 'postas_salud_rural', 'establecimientos_aps_n', 'esperanza_vida_total_anos', 'cobertura_empam_pct', 'cobertura_pscv_pct'];
        for (const v of saludVars) {
            const res = hubInference(v);
            if (res !== 'salud') {
                console.error(`Expected salud for ${v}, got ${res}`);
                process.exit(2);
            }
        }

        const culturaVars = ['museos_count', 'fndr_8pct_cultura_mclp', 'participacion_cultural_pct_c2'];
        for (const v of culturaVars) {
            const res = hubInference(v);
            if (res !== 'cultura') {
                console.error(`Expected cultura for ${v}, got ${res}`);
                process.exit(3);
            }
        }

        const ctciVars = ['proyectos_ctci_total', 'proyectos_corfo_innova_count', 'proyectos_anid_locales_count'];
        for (const v of ctciVars) {
            const res = hubInference(v);
            if (res !== 'ctci') {
                console.error(`Expected ctci for ${v}, got ${res}`);
                process.exit(4);
            }
        }

        // Verificar clasificacion de series de salud en syncTemporalSeries
        if (!html.includes("id: 'urgencias_respiratorias_anuales_ssa'") || !html.includes("hubId: 'salud', hubTitle: 'VIII. Salud'")) {
            console.error('Series SSA must belong to hubId salud and VIII. Salud');
            process.exit(5);
        }

        // Verificar que syncSeriesDefs registra emporcha_toneladas, emporcha_cruceros, balmaceda_pasajeros_jac y barometro
        const requiredSeries = ['emporcha_toneladas', 'emporcha_cruceros', 'balmaceda_pasajeros_jac', 'barometro'];
        for (const s of requiredSeries) {
            if (!html.includes(`id: '${s}'`)) {
                console.error(`Serie ${s} missing in syncSeriesDefs`);
                process.exit(6);
            }
        }

        console.log('LABORATORIO_HEALTH_VERIFIED');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Error en test_09 laboratorio health:\n{proc.stderr}")
        self.assertIn("LABORATORIO_HEALTH_VERIFIED", proc.stdout)


if __name__ == "__main__":
    unittest.main()

