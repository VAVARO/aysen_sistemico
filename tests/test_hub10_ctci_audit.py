#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_hub10_ctci_audit.py
=============================================================================
Suite de auditoria integral Hub X: Ciencia, Tecnologia, Conocimiento e
Innovacion (Bloques 1 a 4).
=============================================================================
"""

import json
import math
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


def pearson(xs, ys):
    n = len(xs)
    mx = sum(xs) / n
    my = sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = math.sqrt(sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys))
    return num / den if den else 0.0


class TestHub10CtciAudit(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle.get("comunas", [])
        cls.ext = cls.bundle.get("extension_modules", {}).get("ctci_innovacion", {})

    def test_01_cero_llaves_undefined_y_cuadratura_16_124(self):
        required_keys = [
            "proyectos_ctci_total", "total_proyectos_ctci",
            "investigadores_residentes", "investigadores_residentes_est",
            "monto_anid_mclp", "monto_anid_acumulado_mclp",
            "innovacion_corfo_mclp", "monto_corfo_innova_mclp",
            "aporte_universidades_f4g_pct", "proporcion_ciencia_endogena_pct",
            "matricula_educacion_superior_sies_n",
        ]
        for k in required_keys:
            self.assertTrue(all(isinstance(c.get(k), (int, float)) for c in self.comunas), f"Falta {k} en comunas")

        self.assertEqual(sum(c["total_proyectos_ctci"] for c in self.comunas), 179)
        self.assertEqual(sum(c["investigadores_residentes"] for c in self.comunas), 124)
        self.assertAlmostEqual(sum(c["monto_anid_acumulado_mclp"] for c in self.comunas), 17326.8, places=1)
        self.assertAlmostEqual(sum(c["monto_corfo_innova_mclp"] for c in self.comunas), 8450.0, places=1)
        self.assertEqual(sum(c["matricula_educacion_superior_sies_n"] for c in self.comunas), 2327)

        centros = self.bundle.get("spatialNodesByLayer", {}).get("centros_ctci", [])
        self.assertEqual(len(centros), 16)
        self.assertTrue(any(n.get("id") == "ctci_CTCI-NOD-16" for n in centros))
        self.assertEqual(sum(n.get("magnitudeValue", 0) for n in centros), 124)
        self.assertEqual(self.ext.get("resumen_regional", {}).get("centros_y_estaciones_ctci_total"), 16)

    def test_02_presets_ct_01_a_07_y_correlacion(self):
        presets = {p["preset_id"]: p for p in self.bundle["hubsGallery"]["ctci"]["presets"]}
        self.assertEqual(len(presets), 7)
        for i in range(1, 8):
            self.assertIn(f"CT_0{i}", presets)

        r_ct03 = pearson(
            [c["proyectos_corfo_innova_count"] for c in self.comunas],
            [c[presets["CT_03"]["config"]["varY"]] for c in self.comunas],
        )
        self.assertGreater(r_ct03, 0.98)
        self.assertEqual(presets["CT_05"]["config"]["varX"], "investigadores_residentes")
        macro = presets["CT_05"]["config"]["mirror_series"]["structural_by_macrozona"]
        self.assertEqual(macro, {"norte": 6.0, "centro": 106.0, "sur": 12.0})

    def test_03_consultor_hub10_queries(self):
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
          const r1 = await client.query('Compara proyectos CORFO Innova, monto de innovación CORFO, empresas SII y evaluación ciudadana de la Universidad de Aysén');
          const k1 = [r1.chart.varX, r1.chart.varY, r1.chart.varZ, r1.chart.varW].filter(Boolean);
          for (const k of ['proyectos_corfo_innova_count', 'innovacion_corfo_mclp', 'empresas_sii', 'evaluacion_uaysen_promedio_i8']) {
            assert(k1.includes(k), 'Falta ' + k + ' en ' + JSON.stringify(k1));
          }

          const r2 = await client.query('Compara la percepción ciudadana de prioridad de la ciencia CTCi, evaluación de la UAysén e investigadores residentes');
          const k2 = [r2.chart.varX, r2.chart.varY, r2.chart.varZ].filter(Boolean);
          for (const k of ['percepcion_ctci_prioritaria_pct_i1i', 'evaluacion_uaysen_promedio_i8', 'investigadores_residentes']) {
            assert(k2.includes(k), 'Falta ' + k + ' en ' + JSON.stringify(k2));
          }
          assert(!k2.includes('poblacion_censo_2024'), 'No debe insertar poblacion_censo_2024');

          const r3 = await client.query('Qué centros científicos y estaciones de campo como CIEP, UAysén, INIA Tamel Aike, INFOR, IFOP, CECs y Estación Patagonia UC operan en Aysén');
          assert.strictEqual(r3.chart.customCategoryData, true);
          assert(r3.reply.includes('16 centros') && r3.reply.includes('124 investigadores'));
          assert(!r3.reply.includes('pellet') && !r3.reply.includes('565.456'));
          console.log('HUB10_CONSULTOR_OK');
        })().catch(e => { console.error(e); process.exit(1); });
        """
        res = subprocess.run(["node", "-e", node_script], cwd=ROOT_DIR, capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(res.returncode, 0, f"Hub10 Consultor test failed:\n{res.stderr}\n{res.stdout}")
        self.assertIn("HUB10_CONSULTOR_OK", res.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
