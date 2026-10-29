#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_floating_toolbar_buttons.py
=============================================================================
Suite de verificacion automatizada para la Barra Flotante (#canvaFloatingToolbar)
en Laboratorio Sistemico (laboratorio.html).

Verifica:
1. Contratos DOM e IDs obligatorios en laboratorio.html.
2. Blindaje de eventos (event shielding) en #panelLienzo para evitar deseleccion.
3. Sincronizacion de targetWidgetId y getTargetToolbarWidget().
4. Ejecucion e interactividad por clics para tarjetas univariadas:
   - Visuales: tbBtnBar, tbBtnLine, tbBtnScatter, tbBtnMap, tbBtnTable, tbBtnKPI
   - Colores: .color-swatch-btn
   - Analitica: tbBtnAverage, tbBtnTrend, tbBtnReflection, tbBtnCsv, btnExcludeCoyhaique
   - Ranking y Escalas: tbBtnSortRank, tbBtnScalePct, tbBtnScaleZ, tbBtnScaleRaw
   - Cierre: tbBtnCloseToolbar
5. Ejecucion e interactividad para tarjetas de presets (w.customChartSpec):
   - Sincronizacion de color en datasets del spec
   - Transformaciones en getWidgetDataPayload (Sin Coyhaique, Escala %, Ranking desc)
6. Principio innegociable de CERO EMOJIS.
=============================================================================
"""

import os
import sys
import re
import json
import subprocess
import unittest

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
SIM_RUNNER = os.path.join(ROOT_DIR, "scripts", "run_toolbar_simulation.cjs")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)


class TestFloatingToolbarButtons(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            cls.lab_html = f.read()

        with open(SIM_RUNNER, "r", encoding="utf-8") as f:
            cls.sim_script = f.read()

        # Ejecutar simulacion en Node.js
        cmd = ["node", SIM_RUNNER]
        proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        cls.sim_exit_code = proc.returncode
        cls.sim_stdout = proc.stdout
        cls.sim_stderr = proc.stderr
        try:
            cls.sim_data = json.loads(proc.stdout)
        except Exception:
            cls.sim_data = {}

    def test_01_zero_emojis(self):
        """Principio innegociable: CERO emojis en laboratorio.html y scripts asociados."""
        for fpath, content in [("laboratorio.html", self.lab_html), ("run_toolbar_simulation.cjs", self.sim_script)]:
            emojis = EMOJI_REGEX.findall(content)
            self.assertEqual(len(emojis), 0, f"Se detectaron emojis en {fpath}: {emojis}")

    def test_02_contractual_dom_ids_and_classes(self):
        """Verifica la existencia de todos los elementos contractuales de la barra flotante en el HTML."""
        required_ids = [
            'id="canvaFloatingToolbar"',
            'id="toolbarDragHandle"',
            'id="tbBtnCloseToolbar"',
            'id="tbBtnBar"',
            'id="tbBtnLine"',
            'id="tbBtnScatter"',
            'id="tbBtnMap"',
            'id="tbBtnTable"',
            'id="tbBtnKPI"',
            'id="tbBtnAverage"',
            'id="tbBtnTrend"',
            'id="tbBtnReflection"',
            'id="tbBtnCsv"',
            'id="btnExcludeCoyhaique"',
            'id="tbBtnSortRank"',
            'id="tbBtnScaleRaw"',
            'id="tbBtnScalePct"',
            'id="tbBtnScaleZ"'
        ]
        for rid in required_ids:
            self.assertIn(rid, self.lab_html, f"Falta elemento contractual: {rid}")

        self.assertIn('class="color-swatch-btn"', self.lab_html, "Faltan botones de paleta de color .color-swatch-btn")
        self.assertIn('data-color="#00357f"', self.lab_html, "Falta swatch de color cobalto oficial")

    def test_03_event_shielding_and_target_helpers(self):
        """Verifica las clausulas de blindaje contra deseleccion en panelLienzo y sincronizacion de widget."""
        # 1. Blindaje en mousedown y touchstart de #panelLienzo
        self.assertIn("if (e.target.closest('#canvaFloatingToolbar, #smartPopover, .connection-action-popover')) return;", self.lab_html)

        # 2. Asignacion y recuperacion de dataset.targetWidgetId
        self.assertIn("tb.dataset.targetWidgetId = String(widgetId)", self.lab_html)
        self.assertIn("function getTargetToolbarWidget()", self.lab_html)
        self.assertIn("Number(tb.dataset.targetWidgetId)", self.lab_html)

        # 3. Inicializacion dedicada al inicio de init()
        self.assertIn("initFloatingToolbarEvents()", self.lab_html)
        self.assertIn("function initFloatingToolbarEvents()", self.lab_html)

    def test_04_univariate_interactions_simulation(self):
        """Verifica que el 100% de los botones respondan correctamente en tarjetas univariadas."""
        self.assertEqual(self.sim_exit_code, 0, f"La simulacion fallo: {self.sim_stderr}")
        univariate_results = self.sim_data.get("univariate", {})
        self.assertGreaterEqual(len(univariate_results), 15, "Deben haberse evaluado al menos 15 interacciones univariadas")

        for action_name, outcome in univariate_results.items():
            self.assertTrue(outcome.get("passed"), f"Fallo interaccion univariada: {action_name} - {outcome.get('details')}")

    def test_05_preset_card_interactions_simulation(self):
        """Verifica que las tarjetas de preset (customChartSpec) soporten paleta y transformaciones de datos."""
        self.assertEqual(self.sim_exit_code, 0, f"La simulacion fallo: {self.sim_stderr}")
        preset_results = self.sim_data.get("preset", {})
        self.assertGreaterEqual(len(preset_results), 4, "Deben haberse evaluado al menos 4 interacciones de presets")

        for action_name, outcome in preset_results.items():
            self.assertTrue(outcome.get("passed"), f"Fallo interaccion de preset: {action_name} - {outcome.get('details')}")

    def test_06_event_shielding_simulation(self):
        """Verifica la recuperacion de activeWidgetId y la proteccion de clics del lienzo en la simulacion."""
        self.assertEqual(self.sim_exit_code, 0, f"La simulacion fallo: {self.sim_stderr}")
        shielding_results = self.sim_data.get("shielding", {})
        for action_name, outcome in shielding_results.items():
            self.assertTrue(outcome.get("passed"), f"Fallo blindaje de eventos: {action_name} - {outcome.get('details')}")

    def test_07_no_duplicate_listeners_in_setup_events(self):
        """Verifica que setupEvents no contenga listeners redundantes que dupliquen ejecuciones."""
        # setupEvents no debe volver a declarar listeners para tbBtnReflection o tbDragHandle
        setup_idx = self.lab_html.find("function setupEvents()")
        self.assertNotEqual(setup_idx, -1, "No se encontro function setupEvents()")
        setup_body = self.lab_html[setup_idx:setup_idx + 8000]

        # Comprobar que en setupEvents NO se haga addEventListener('click' directo sobre tbBtnReflection
        self.assertNotIn("document.getElementById('tbBtnReflection').addEventListener('click'", setup_body)


if __name__ == "__main__":
    unittest.main()
