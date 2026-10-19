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


if __name__ == "__main__":
    unittest.main()
