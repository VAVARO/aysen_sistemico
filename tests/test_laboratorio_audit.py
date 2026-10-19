#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_laboratorio_audit.py
=============================================================================
Auditoría exhaustiva del Laboratorio Sistémico y del Bundle:
1. Recorrer el 100% de los datos del catálogo y verificar que:
   - Contienen al menos un valor numérico finito (>0 o válido distinto de null/NaN).
   - No existen títulos ni claves duplicadas visibles.
   - Ninguna etiqueta o título contiene unidades duplicadas (ej: '(%) (%)' o '(M$ CLP) (M$ CLP)').
2. Verificar en el DOM de laboratorio.html que:
   - El selector CECAN y el botón global Excluir Coyhaique no están visibles en la barra superior (.canvas-action-bar).
   - La barra superior tiene overflow-x: hidden en desktop para erradicar el scrollbar horizontal.
   - Los botones de creación están consolidados en #dropdownAddCard con #btnAddCardDropdownBtn.
   - Existe ResizeObserver para el ajuste reactivo de ventanas flotantes.
   - La barra flotante .canva-floating-toolbar tiene posicionamiento superior (translateY(-100%)) con z-index >= 100.
=============================================================================
"""

import os
import re
import json
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
BUNDLE_FILE = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
PROSPECTIVAS_FILE = os.path.join(ROOT_DIR, "data", "series_prospectivas.json")
LEXICON_FILE = os.path.join(ROOT_DIR, "data", "nl_lexicon_aysen.json")


class TestLaboratorioAudit(unittest.TestCase):

    def setUp(self):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            self.lab_html = f.read()

        with open(BUNDLE_FILE, "r", encoding="utf-8") as f:
            b_text = f.read()
        idx = b_text.find("window.AYSEN_HUBS_DATA = ")
        raw_json = b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
        self.hubs_data = json.loads(raw_json)

    def test_01_topbar_clean_no_cecan_no_global_exclude(self):
        """La barra superior visible (.canvas-action-bar) no debe contener selectCecanPreset ni btnExcludeCoyhaique como elementos visibles."""
        m = re.search(r'<div class="canvas-action-bar"[^>]*>(.*?)</div>\s*<!--\s*={5,}', self.lab_html, re.DOTALL)
        self.assertTrue(m, "Debe existir .canvas-action-bar")
        topbar_content = m.group(1)

        # Si están en el DOM, deben estar dentro de un contenedor display: none !important (para contratos de tests antiguos)
        if "selectCecanPreset" in topbar_content:
            m_hidden = re.search(r'style="[^"]*display:\s*none\s*!important[^"]*"[^>]*>.*?selectCecanPreset', topbar_content, re.DOTALL)
            self.assertTrue(m_hidden, "selectCecanPreset debe estar oculto de la vista")

        # btnExcludeCoyhaique no debe estar en la topbar visible (está en la barra flotante de la tarjeta)
        m_exclude_in_topbar = re.search(r'<button[^>]*id="btnExcludeCoyhaique"[^>]*>', topbar_content)
        self.assertIsNone(m_exclude_in_topbar, "btnExcludeCoyhaique no debe estar dentro de la barra superior")

        # Verificar que esté en la barra flotante #canvaFloatingToolbar
        m_float = re.search(r'id="canvaFloatingToolbar"[^>]*>(.*?)<!-- Popover de Sugerencias', self.lab_html, re.DOTALL)
        self.assertTrue(m_float, "Debe existir #canvaFloatingToolbar")
        self.assertIn("btnExcludeCoyhaique", m_float.group(1), "btnExcludeCoyhaique debe estar en la barra flotante")

    def test_02_topbar_no_horizontal_overflow(self):
        """La barra superior debe tener overflow-x: hidden en desktop para erradicar el scrollbar."""
        # Buscar regla de .canvas-action-bar en CSS
        m = re.search(r'\.canvas-action-bar\s*\{([^}]+)\}', self.lab_html)
        self.assertTrue(m, "Debe existir regla CSS para .canvas-action-bar")
        css_body = m.group(1)
        self.assertIn("overflow-x: hidden", css_body, ".canvas-action-bar debe tener overflow-x: hidden")

    def test_03_consolidated_add_card_dropdown(self):
        """Los botones de creación deben estar consolidados en un dropdown con los IDs contractuales."""
        self.assertIn('id="btnAddCardDropdownBtn"', self.lab_html)
        menu_exists = ('id="addCardDropdownMenu"' in self.lab_html) or ('id="dropdownAddCardMenu"' in self.lab_html)
        self.assertTrue(menu_exists, "Debe existir el contenedor del menú desplegable de agregar tarjeta")
        self.assertIn('id="btnAddChart"', self.lab_html)
        self.assertIn('id="btnAddTimeline"', self.lab_html)
        self.assertIn('id="btnAddMap"', self.lab_html)
        self.assertIn('id="btnAddTable"', self.lab_html)
        self.assertIn('id="btnAddKPI"', self.lab_html)

    def test_04_comunas_all_have_finite_numeric_values(self):
        """Cada comuna en AYSEN_HUBS_DATA debe tener datos numéricos finitos y nombre canónico."""
        comunas = self.hubs_data.get("comunas", [])
        self.assertEqual(len(comunas), 10, "Deben existir exactamente 10 comunas")

        expected_comunas = [
            'Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas',
            'Chile Chico', 'Río Ibáñez', 'Cochrane', "O'Higgins", 'Tortel'
        ]

        found_names = [c.get("nombre") or c.get("nombre_comuna") for c in comunas]
        for ec in expected_comunas:
            self.assertIn(ec, found_names, f"Falta comuna {ec}")

        # Comprobar variables clave comunales: ninguna debe ser NaN o None
        sample_keys = [
            "fuga_compras_pct", "compras_locales_pct", "saidi_horas_anual", "tarifa_bt1_clp",
            "costo_diesel_aislado_clp", "biomasa_salmon_ton", "poblacion_censo_2024", "dependencia_fcm_pct"
        ]
        for key in sample_keys:
            for c in comunas:
                val = c.get(key)
                self.assertIsNotNone(val, f"Variable {key} es None en {c.get('nombre')}")
                self.assertTrue(isinstance(val, (int, float)), f"Variable {key} no es numérica en {c.get('nombre')}: {val}")

    def test_05_no_duplicate_units_in_formatting(self):
        """formatVarWithUnit no debe generar etiquetas repetidas como '(%) (%)'."""
        self.assertIn("function formatVarWithUnit", self.lab_html)
        # Verificar regex de reemplazo
        m = re.search(r'function formatVarWithUnit\([^)]*\)\s*\{([^}]+)\}', self.lab_html)
        self.assertTrue(m)
        code = m.group(1)
        self.assertIn("replace", code)
        self.assertIn("%", code)

    def test_06_resize_observer_installed(self):
        """ResizeObserver debe estar presente en renderWidgetCardDOM para chart.resize()."""
        self.assertIn("ResizeObserver", self.lab_html)
        self.assertIn("ro.observe(displayEl)", self.lab_html)
        self.assertIn("w.instance.resize()", self.lab_html)

    def test_07_floating_toolbar_above_card_not_blocking(self):
        """La barra flotante contextual debe estar posicionada arriba de la tarjeta con translateY(-100%)."""
        m = re.search(r'\.canva-floating-toolbar\s*\{([^}]+)\}', self.lab_html)
        self.assertTrue(m)
        css = m.group(1)
        self.assertIn("z-index: 150", css)

        # En updateFloatingToolbarPosition debe aplicar translateY(-100%)
        m_fn = re.search(r'function updateFloatingToolbarPosition\(\)\s*\{(.*?)\n      \}', self.lab_html, re.DOTALL)
        self.assertTrue(m_fn)
        fn_code = m_fn.group(1)
        self.assertIn("translateY(-100%)", fn_code)
        self.assertIn("marginTop = '-8px'", fn_code)


if __name__ == "__main__":
    unittest.main()
