#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_hub8_salud_audit.py
=============================================================================
Suite de auditoria integral Hub VIII: Salud, Red Asistencial y Mortalidad
(Bloques 1 a 5).
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


class TestHub8SaludAudit(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle.get("comunas", [])
        cls.nodos = {n["id"]: n for n in cls.bundle.get("nodos", [])}
        cls.hosp = cls.bundle.get("spatialNodesByLayer", {}).get("hospitales_postas", [])

    def test_01_cero_vectores_planos_y_promedios_oficiales(self):
        expected_means = {
            "mediana_espera_especialidad_dias": 159.0,
            "mediana_espera_quirurgica_dias": 262.0,
            "tasa_mortalidad_cancer_gastrico_100k": 18.4,
            "tasa_mortalidad_cancer_vesicula_100k": 18.29,
            "tasa_mortalidad_suicidio_100k": 19.9,
        }
        for key, target_mean in expected_means.items():
            vals = [c[key] for c in self.comunas]
            self.assertGreaterEqual(len(set(vals)), 8, f"Vector plano detectado en {key}")
            self.assertAlmostEqual(sum(vals) / len(vals), target_mean, places=1, msg=f"Media incorrecta en {key}")

    def test_02_consistencia_postas_aps_y_hospitales(self):
        self.assertEqual(sum(c["postas_salud_rural"] for c in self.comunas), 27)
        self.assertEqual(sum(c["postas_rurales_psr_n"] for c in self.comunas), 27)
        self.assertEqual(sum(self.nodos[38]["chartSpec"]["datasets"][0]["data"]), 27)
        self.assertEqual(sum(c["establecimientos_aps_n"] for c in self.comunas), 44)

        psr_nodes = [n for n in self.hosp if n.get("tipo") == "Posta de Salud Rural (APS)"]
        emr_nodes = [n for n in self.hosp if n.get("tipo") == "Estación Médico Rural (EMR)"]
        hosp_nodes = [n for n in self.hosp if "Hospital" in str(n.get("tipo", ""))]
        self.assertEqual(len(psr_nodes), 27)
        self.assertEqual(len(emr_nodes), 9)
        self.assertEqual(len(hosp_nodes), 5)

        camas_vals = sorted([n.get("magnitudeValue") for n in hosp_nodes], reverse=True)
        self.assertEqual(camas_vals, [135, 56, 8, 7, 7])
        self.assertFalse(any("35 box APS" in f"{n.get('magnitudeValue')} {n.get('magnitudeUnit')}" for n in hosp_nodes))

    def test_03_presets_hub8_y_textos(self):
        presets = {p["preset_id"]: p for p in self.bundle["hubsGallery"]["salud"]["presets"]}
        self.assertEqual(len(presets), 7)
        for pid in [f"hub_08_0{i}" for i in range(1, 8)]:
            self.assertIn(pid, presets)
        macro = presets["hub_08_05"]["config"]["mirror_series"]["structural_by_macrozona"]
        self.assertEqual(macro, {"norte": 1.05, "centro": 1.89, "sur": 1.04})
        self.assertIn("3,48", presets["hub_08_05"]["what_it_shows"])
        self.assertIn("30 camas", presets["hub_08_02"]["what_it_shows"])
        self.assertEqual(presets["hub_08_02"]["subtype"], "grouped_bar")

    def test_04_consultor_hub8_queries(self):
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
          const r1 = await client.query('Compara postas de salud rural, establecimientos APS, índice de envejecimiento y médicos por mil habitantes por comuna');
          const k1 = [r1.chart.varX, r1.chart.varY, r1.chart.varZ, r1.chart.varW].filter(Boolean);
          assert(k1.includes('establecimientos_aps_n'), 'Falta establecimientos_aps_n: ' + JSON.stringify(k1));
          assert(!k1.includes('densidad_hab_km2'), 'densidad_hab_km2 no debe desplazarse aqui');

          const r2 = await client.query('Compara camas psiquiátricas UHCE, tasa de mortalidad por suicidio, cáncer gástrico y evaluación ciudadana del acceso a salud del Barómetro');
          const k2 = [r2.chart.varX, r2.chart.varY, r2.chart.varZ, r2.chart.varW].filter(Boolean);
          assert(k2.includes('barometro_evaluacion_acceso_salud_pct'), 'Falta barometro_evaluacion_acceso_salud_pct: ' + JSON.stringify(k2));
          assert(!k2.includes('barometro_confianza_institucional_pct'));

          const r3 = await client.query('Cuál es el tiempo de traslado a Coyhaique en ambulancia y las aeroevacuaciones SAMU por comuna');
          assert.strictEqual(r3.chart.varX, 'traslado_coyhaique_hrs');
          assert(r3.reply.includes('14'), 'Debe reportar 14 hrs en Guaitecas para traslado medico');
          console.log('HUB8_CONSULTOR_OK');
        })().catch(e => { console.error(e); process.exit(1); });
        """
        res = subprocess.run(["node", "-e", node_script], cwd=ROOT_DIR, capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(res.returncode, 0, f"Hub8 Consultor test failed:\n{res.stderr}\n{res.stdout}")
        self.assertIn("HUB8_CONSULTOR_OK", res.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
