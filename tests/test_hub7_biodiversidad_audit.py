#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_hub7_biodiversidad_audit.py
=============================================================================
Suite de auditoria integral Hub VII: Biodiversidad, Clima y Riesgos
Geologicos (Bloques 1 a 5).
=============================================================================
"""

import json
import os
import subprocess
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUNDLE_PATH = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")


def load_bundle():
    with open(BUNDLE_PATH, "r", encoding="utf-8") as f:
        text = f.read()
    idx = text.find("window.AYSEN_HUBS_DATA = ")
    raw = text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
    return json.loads(raw)


class TestHub7BiodiversidadAudit(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle.get("comunas", [])
        cls.nodos = {n["id"]: n for n in cls.bundle.get("nodos", [])}
        cls.layers = cls.bundle.get("spatialNodesByLayer", {})

    def test_01_reconciliacion_mp25_glaciares_y_bosques(self):
        coy = next(c for c in self.comunas if c["nombre"] == "Coyhaique")
        presets = {p["preset_id"]: p for p in self.bundle["hubsGallery"]["biodiversidad"]["presets"]}
        self.assertEqual(len(presets), 7)
        for pid in [f"hub_07_0{i}" for i in range(1, 8)]:
            self.assertIn(pid, presets)

        ds = presets["hub_07_04"]["config"]["customChartSpec"]["datasets"]
        self.assertEqual(len(ds), 3)
        self.assertEqual(ds[1]["data"][-1], coy["dias_sobre_norma_mp25"])
        self.assertEqual(ds[1]["data"][-1], 87)
        self.assertEqual(ds[2]["data"][-1], coy["episodios_gec_mp25_anual"])
        self.assertEqual(ds[2]["data"][-1], 41)

        g1 = [c["superficie_glaciar_km2"] for c in self.comunas]
        g2 = [c["superficie_glaciares_km2"] for c in self.comunas]
        self.assertEqual(g1, g2)
        self.assertAlmostEqual(sum(g1), 10035.7, places=1)

        for c in self.comunas:
            self.assertLessEqual(c["bosque_nativo_ha"], c["cobertura_vegetal_nativa_ha"])
        self.assertEqual(sum(c["cobertura_vegetal_nativa_ha"] for c in self.comunas), 5723000)
        self.assertEqual(sum(c["bosque_nativo_ha"] for c in self.comunas), 4713200)

        macro75 = presets["hub_07_05"]["config"]["mirror_series"]["structural_by_macrozona"]
        self.assertEqual(macro75, {"norte": 58.5, "centro": 39.0, "sur": 65.6})
        self.assertEqual(presets["hub_07_03"]["config"]["varY"], "consumo_lena_m3_solidos_anual")

    def test_02_destruncamiento_nodo29_y_nuevas_variables(self):
        n29 = self.nodos[29]
        for row in n29.get("tableRows", []):
            for cell in row:
                self.assertNotIn("...", str(cell), f"Celda truncada en Nodo #29: {cell}")

        for k in ("especies_exoticas_invasoras_n", "episodios_gec_mp25_anual", "expedientes_fiscalizacion_sma_n", "amenaza_volcanica_sismica_idx"):
            self.assertTrue(all(isinstance(c.get(k), (int, float)) for c in self.comunas), f"Falta {k} en comunas")
        self.assertEqual(sum(c["expedientes_fiscalizacion_sma_n"] for c in self.comunas), 282)

    def test_03_capas_espaciales_saneadas(self):
        self.assertEqual(len(self.layers.get("fauna_rce_sitios", [])), 20)
        self.assertEqual(len(self.layers.get("estaciones_dga_sinca", [])), 12)
        est_mon = self.layers.get("estaciones_monitoreo", [])
        self.assertEqual(len(est_mon), 32)
        for bad_id in ("est_sensor_13", "est_sensor_14", "est_sensor_15", "est_sensor_16"):
            self.assertFalse(any(str(n.get("id")) == bad_id for n in est_mon))
        self.assertFalse(any(n.get("magnitudeValue") == 25 and str(n.get("id", "")).startswith("fauna_") for n in est_mon))

        volc = self.layers.get("volcanes_sismos", [])
        self.assertEqual(len(volc), 42)
        self.assertTrue(all(n.get("hubId") == "biodiversidad" for n in volc))
        usgs = [n for n in volc if "Sismo" in str(n.get("tipo", "")) or "USGS" in str(n.get("tipo", ""))]
        self.assertGreaterEqual(len({n.get("nombre_comuna") for n in usgs}), 3)

        sma = self.layers.get("justicia_sma", [])
        self.assertEqual(len(sma), 10)
        self.assertTrue(all(n.get("hubId") == "biodiversidad" for n in sma))

    def test_04_consultor_hub7_queries_y_promedios(self):
        node_script = """
        const fs = require('fs');
        const assert = require('assert');
        global.window = {};
        eval(fs.readFileSync('data/aysen_hubs_data.js', 'utf8'));
        const lex = JSON.parse(fs.readFileSync('data/nl_lexicon_aysen.json', 'utf8'));
        eval(fs.readFileSync('js/nl2chart_engine.js', 'utf8'));
        eval(fs.readFileSync('js/omniroute_client.js', 'utf8'));
        const client = global.window.OmniRouteClient;
        client.init(global.window.AYSEN_HUBS_DATA, lex);

        (async () => {
          const r1 = await client.query('Cuál es la relación entre volcanes activos RNVV, sismos USGS y expedientes de fiscalización SMA por comuna');
          assert.strictEqual(client.detectReconciledTopicIntent(r1.reply.toLowerCase(), 'Cuál es la relación entre volcanes activos RNVV, sismos USGS y expedientes de fiscalización SMA por comuna', []), 'volcanes_sismos_justicia_sma');
          assert(r1.chart.varX !== 'centros_activos_salmon' && r1.chart.varY !== 'centros_activos_salmon');
          assert(r1.reply.includes('Hudson') && r1.reply.includes('282') && r1.reply.includes('396'));

          const r2 = await client.query('Qué especies exóticas invasoras (visón, castor, didymo, chinook) afectan los parques SNASPE en Aysén');
          assert.strictEqual(client.detectReconciledTopicIntent('que especies exoticas invasoras vison castor didymo chinook afectan los parques snaspe en aysen', '', []), 'especies_exoticas_invasoras');
          assert(r2.reply.includes('Visón') && r2.reply.includes('Didymo') && r2.chart.varX === 'especies_exoticas_invasoras_n');

          const r3 = await client.query('Cuántas especies de fauna amenazada RCE hay y cuántos días sobre norma MP2.5 registra cada comuna');
          assert(r3.reply.includes('6,3') && r3.reply.includes('22,5'), 'Debe reportar promedio comunal, no suma: ' + r3.reply);
          assert(!r3.reply.includes('Total regional: 63') && !r3.reply.includes('Total regional: 225'));
          console.log('HUB7_CONSULTOR_OK');
        })().catch(e => { console.error(e); process.exit(1); });
        """
        res = subprocess.run(["node", "-e", node_script], cwd=ROOT_DIR, capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(res.returncode, 0, f"Hub7 Consultor test failed:\n{res.stderr}\n{res.stdout}")
        self.assertIn("HUB7_CONSULTOR_OK", res.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
