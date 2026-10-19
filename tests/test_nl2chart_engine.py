#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_nl2chart_engine.py
=============================================================================
Suite de pruebas unitarias para el motor NL2ChartEngine y el léxico
semántico en cliente (Zero-API, 100% offline, 0ms, costo $0).
Autor: Álvaro Contreras Barrios
Fecha: 17-Oct-2026
=============================================================================
"""

import os
import re
import json
import subprocess
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEXICON_JSON = os.path.join(ROOT_DIR, "data", "nl_lexicon_aysen.json")
ENGINE_JS = os.path.join(ROOT_DIR, "js", "nl2chart_engine.js")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)

class TestNL2ChartEngine(unittest.TestCase):

    def test_01_lexicon_existence_and_cleanliness(self):
        """Verifica existencia, estructura JSON y cero emojis en el léxico"""
        self.assertTrue(os.path.exists(LEXICON_JSON), "data/nl_lexicon_aysen.json debe existir")
        with open(LEXICON_JSON, "r", encoding="utf-8") as f:
            content = f.read()

        emojis = EMOJI_REGEX.findall(content)
        self.assertEqual(len(emojis), 0, f"No deben existir emojis en nl_lexicon_aysen.json: {emojis}")

        data = json.loads(content)
        self.assertEqual(data.get("version"), "1.0.0")
        self.assertEqual(data.get("author"), "Álvaro Contreras Barrios")
        self.assertIn("variables", data)
        self.assertIn("nodes", data)
        self.assertGreaterEqual(len(data["variables"]), 70, "Debe contener al menos 70 variables indexadas")
        self.assertEqual(len(data["nodes"]), 31, "Debe indexar exactamente los 31 nodos satélites")

    def test_02_engine_code_cleanliness_and_exports(self):
        """Verifica que js/nl2chart_engine.js exista y no contenga emojis prohibidos"""
        self.assertTrue(os.path.exists(ENGINE_JS), "js/nl2chart_engine.js debe existir")
        with open(ENGINE_JS, "r", encoding="utf-8") as f:
            code = f.read()

        emojis = EMOJI_REGEX.findall(code)
        self.assertEqual(len(emojis), 0, f"No deben existir emojis en js/nl2chart_engine.js: {emojis}")
        self.assertIn("NL2ChartEngine", code)
        self.assertIn("parseQuery", code)
        self.assertIn("OptionalLLMResolver", code)

    def _run_node_engine(self, js_expr):
        """Helper para evaluar expresiones JS en Node con codificación UTF-8 explícita"""
        script = f"""
        const engine = require('./js/nl2chart_engine.js');
        const res = ({js_expr});
        console.log(JSON.stringify(res));
        """
        proc = subprocess.run(
            ["node", "-e", script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=True
        )
        return json.loads(proc.stdout.strip())


    def test_03_mandatory_mappings_salmon(self):
        """1. Concesiones, jaulas, salmones, salmoneras, cultivo de salmón -> concesiones_salmon / biomasa_salmon_ton"""
        res1 = self._run_node_engine("engine.parseQuery('concesiones de salmon')")
        self.assertTrue(res1["success"])
        self.assertEqual(res1["varX"]["id"], "concesiones_salmon")

        res2 = self._run_node_engine("engine.parseQuery('jaulas de cultivo de salmon')")
        self.assertTrue(res2["success"])
        self.assertEqual(res2["varX"]["id"], "concesiones_salmon")

        res3 = self._run_node_engine("engine.parseQuery('biomasa cosechada de salmones')")
        self.assertTrue(res3["success"])
        self.assertEqual(res3["varX"]["id"], "biomasa_salmon_ton")

    def test_04_mandatory_mappings_finanzas(self):
        """2. Patentes, pago de patente, ingresos propios, plata municipal, presupuesto"""
        res1 = self._run_node_engine("engine.parseQuery('pago de patente municipal')")
        self.assertTrue(res1["success"])
        self.assertEqual(res1["varX"]["id"], "ipp_per_capita_clp")

        res2 = self._run_node_engine("engine.parseQuery('plata municipal anual')")
        self.assertTrue(res2["success"])
        self.assertEqual(res2["varX"]["id"], "presupuesto_mclp")

        res3 = self._run_node_engine("engine.parseQuery('presupuesto por habitante')")
        self.assertTrue(res3["success"])
        self.assertEqual(res3["varX"]["id"], "presupuesto_per_capita_mclp")

    def test_05_mandatory_mappings_salud(self):
        """3. Problemas respiratorios, urgencias, hospitalizados, enfermedades de invierno"""
        res1 = self._run_node_engine("engine.parseQuery('problemas respiratorios de invierno')")
        self.assertTrue(res1["success"])
        self.assertEqual(res1["varX"]["id"], "urgencias_respiratorias_pct")

        res2 = self._run_node_engine("engine.parseQuery('hospitalizados y camas')")
        self.assertTrue(res2["success"])
        self.assertEqual(res2["varX"]["id"], "camas_hospitalarias")

    def test_06_mandatory_mappings_aire_calefaccion(self):
        """4. Contaminación, humo, aire sucio, leña, estufas, smog"""
        res1 = self._run_node_engine("engine.parseQuery('contaminacion del aire y humo')")
        self.assertTrue(res1["success"])
        self.assertEqual(res1["varX"]["id"], "dias_sobre_norma_mp25")

        res2 = self._run_node_engine("engine.parseQuery('estufas y calefaccion a lena')")
        self.assertTrue(res2["success"])
        self.assertEqual(res2["varX"]["id"], "hogares_lena_pct")

        res3 = self._run_node_engine("engine.parseQuery('precio metro de lena seca')")
        self.assertTrue(res3["success"])
        self.assertEqual(res3["varX"]["id"], "precio_lena_m3")

    def test_07_mandatory_mappings_electricidad(self):
        """5. Cortes de luz, apagones, interrupciones eléctricas, saidi"""
        res1 = self._run_node_engine("engine.parseQuery('cortes de luz y apagones saidi')")
        self.assertTrue(res1["success"])
        self.assertEqual(res1["varX"]["id"], "saidi_horas_anual")

        res2 = self._run_node_engine("engine.parseQuery('tarifa electrica bt1')")
        self.assertTrue(res2["success"])
        self.assertEqual(res2["varX"]["id"], "tarifa_bt1_clp")

        res3 = self._run_node_engine("engine.parseQuery('costo diesel generador aislado')")
        self.assertTrue(res3["success"])
        self.assertEqual(res3["varX"]["id"], "costo_diesel_aislado_clp")

    def test_08_mandatory_mappings_conectividad(self):
        """6. Caminos de ripio, ripio, aislamiento, horas de viaje, distancia, carretera austral"""
        res1 = self._run_node_engine("engine.parseQuery('caminos de ripio en carretera austral')")
        self.assertTrue(res1["success"])
        self.assertEqual(res1["varX"]["id"], "ruta7_ripio_km")

        res2 = self._run_node_engine("engine.parseQuery('horas de viaje y aislamiento')")
        self.assertTrue(res2["success"])
        self.assertEqual(res2["varX"]["id"], "traslado_coyhaique_hrs")

    def test_09_mandatory_mappings_turismo(self):
        """7. Turismo, turistas, hoteles, ocupación, parques, visitantes"""
        res1 = self._run_node_engine("engine.parseQuery('turistas y pernoctaciones')")
        self.assertTrue(res1["success"])
        self.assertEqual(res1["varX"]["id"], "pernoctaciones_emat")

        res2 = self._run_node_engine("engine.parseQuery('visitantes a parques nacionales')")
        self.assertTrue(res2["success"])
        self.assertEqual(res2["varX"]["id"], "visitantes_snaspe")

        res3 = self._run_node_engine("engine.parseQuery('hoteles y prestadores sernatur')")
        self.assertTrue(res3["success"])
        self.assertEqual(res3["varX"]["id"], "prestadores_sernatur")

    def test_10_mandatory_mappings_pobreza_fcm_inversion(self):
        """8, 9, 10. Pobreza CASEN, FCM, e Inversión SEIA"""
        res_pob = self._run_node_engine("engine.parseQuery('pobreza casen multidimensional')")
        self.assertTrue(res_pob["success"])
        self.assertEqual(res_pob["varX"]["id"], "pobreza_multidim_pct")

        res_fcm = self._run_node_engine("engine.parseQuery('dependencia del fondo comun municipal')")
        self.assertTrue(res_fcm["success"])
        self.assertEqual(res_fcm["varX"]["id"], "dependencia_fcm_pct")

        res_seia = self._run_node_engine("engine.parseQuery('inversion aprobada en el seia')")
        self.assertTrue(res_seia["success"])
        self.assertEqual(res_seia["varX"]["id"], "inversion_seia_mmusd")

    def test_11_mandatory_mappings_glaciares_conaf_salud(self):
        """11, 12, 13. Glaciares/Agua, Guardaparques/SNASPE, Médicos/SAMU"""
        res_glaciar = self._run_node_engine("engine.parseQuery('glaciares y campos de hielo')")
        self.assertTrue(res_glaciar["success"])
        self.assertEqual(res_glaciar["varX"]["id"], "superficie_glaciar_km2")

        res_snaspe = self._run_node_engine("engine.parseQuery('guardaparques de conaf en areas protegidas')")
        self.assertTrue(res_snaspe["success"])
        self.assertEqual(res_snaspe["varX"]["id"], "ha_snaspe_por_guardaparque")

        res_samu = self._run_node_engine("engine.parseQuery('aeroevacuaciones medicas samu')")
        self.assertTrue(res_samu["success"])
        self.assertEqual(res_samu["varX"]["id"], "aeroevacuaciones_samu_n")

    def test_12_intent_detection_temporal_and_holding(self):
        """Detección de modos temporal y holding"""
        res_temp = self._run_node_engine("engine.parseQuery('evolucion historica de contaminacion entre 2015 y 2026')")
        self.assertEqual(res_temp["chartType"], "temporal")
        self.assertIn("Modo temporal", res_temp["explanation"])

        res_hold = self._run_node_engine("engine.parseQuery('holdings de salmoneras como aquachile o mowi')")
        self.assertEqual(res_hold["chartType"], "holding")
        self.assertIn("Modo holdings", res_hold["explanation"])

    def test_13_bivariate_scatter_and_outlier_detection(self):
        """Cruce bivariado genera scatter y detecta sesgo de Coyhaique cuando corresponde"""
        res = self._run_node_engine("engine.parseQuery('caminos de ripio vs horas de viaje al hospital')")
        self.assertTrue(res["success"])
        self.assertEqual(res["chartType"], "scatter")
        self.assertEqual(res["varX"]["id"], "ruta7_ripio_km")
        self.assertEqual(res["varY"]["id"], "traslado_coyhaique_hrs")

        # Cruce con variable sesgada por Coyhaique (ej. camas hospitalarias)
        res_outlier = self._run_node_engine("engine.parseQuery('problemas respiratorios vs camas hospitalarias')")
        self.assertTrue(res_outlier["excludeOutlierCoyhaique"])
        self.assertIn("excluir Coyhaique", res_outlier["explanation"])

    def test_14_engine_submillisecond_performance(self):
        """Latencia instantánea: 500 consultas se ejecutan en menos de 500ms (<1ms/query)"""
        script = """
        const engine = require('./js/nl2chart_engine.js');
        const start = Date.now();
        for (let i = 0; i < 500; i++) {
          engine.parseQuery('concesiones de salmones vs pago de patente');
        }
        console.log(Date.now() - start);
        """
        proc = subprocess.run(["node", "-e", script], cwd=ROOT_DIR, capture_output=True, text=True, check=True)
        elapsed_ms = int(proc.stdout.strip())
        self.assertLess(elapsed_ms, 500, f"500 consultas tardaron {elapsed_ms}ms (debe ser < 500ms)")

if __name__ == "__main__":
    unittest.main()
