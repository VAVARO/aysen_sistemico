#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_hub9_cultura_audit.py
=============================================================================
Suite de auditoria integral Hub IX: Cultura, Artes, Patrimonio e Identidad
(Bloques 1 a 5).
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


class TestHub9CulturaAudit(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle.get("comunas", [])
        cls.nodos = {n["id"]: n for n in cls.bundle.get("nodos", [])}
        cls.ext = cls.bundle.get("extension_modules", {}).get("cultura_patrimonio", {})

    def test_01_reconciliacion_per_capita_cultural(self):
        expected = [11850, 43537, 9305, 15445, 25782, 15111, 19693, 17869, 32831, 32860]
        self.assertEqual([c["gasto_cultura_per_capita_clp"] for c in self.comunas], expected)
        n33_vals = [int(str(r[4]).replace(".", "").replace(",", "").strip()) for r in self.nodos[33]["tableRows"]]
        self.assertEqual(n33_vals, expected)
        ext_vals = [c["datos"]["gasto_cultura_per_capita_clp"] for c in self.ext.get("por_comuna", [])]
        self.assertEqual(ext_vals, expected)

    def test_02_cuadratura_54_espacios_y_pueblos_originarios(self):
        n32 = self.nodos[32]
        for row in n32["tableRows"]:
            self.assertEqual(int(row[1]) + int(row[2]) + int(row[3]) + int(row[4]), int(row[5]))
        self.assertEqual(sum(int(r[1]) for r in n32["tableRows"]), 16)
        self.assertEqual(sum(int(r[2]) for r in n32["tableRows"]), 16)
        self.assertEqual(sum(int(r[3]) for r in n32["tableRows"]), 16)
        self.assertEqual(sum(int(r[5]) for r in n32["tableRows"]), 54)
        self.assertEqual(sum(c["museos_espacios_n"] for c in self.comunas), 54)

        n34 = self.nodos[34]
        cols_joined = " ".join(n34.get("tableColumns", []))
        self.assertIn("Autoidentificación Indígena", cols_joined)
        self.assertIn("CONADI", cols_joined)
        self.assertIn("PCC", cols_joined)
        self.assertEqual(sum(int(r[4]) for r in n34["tableRows"]), 74)
        self.assertEqual(sum(int(r[5]) for r in n34["tableRows"]), 25)
        self.assertEqual(self.ext["resumen_regional"]["pueblos_originarios"]["total_comunidades_conadi_registradas"], 47)
        self.assertAlmostEqual(max(float(str(r[3]).replace("%", "").replace(",", ".").strip()) for r in n34["tableRows"]), 57.9, places=1)
        self.assertAlmostEqual(self.ext["resumen_regional"]["pueblos_originarios"]["autoidentificacion_regional_pct"], 29.0, places=1)
        self.assertEqual(sum(c["organizaciones_comunitarias_n"] for c in self.comunas), 392)
        self.assertEqual(sum(c["cultores_patrimonio_inmaterial_n"] for c in self.comunas), 313)

    def test_03_capa_museos_cultura_y_presets(self):
        mc = self.bundle.get("spatialNodesByLayer", {}).get("museos_cultura", [])
        self.assertEqual(len(mc), 18)
        self.assertFalse(any(n.get("magnitudeValue") == 20 and "hito" in str(n.get("magnitudeUnit", "")).lower() for n in mc))
        self.assertTrue(all(n.get("hubId") == "cultura" for n in mc))

        presets = {p["preset_id"]: p for p in self.bundle["hubsGallery"]["cultura"]["presets"]}
        self.assertEqual(len(presets), 7)
        for i in range(1, 8):
            self.assertIn(f"CP_0{i}", presets)
        self.assertEqual(presets["CP_03"]["config"]["varX"], "gasto_cultura_per_capita_clp")
        r_cp03 = pearson(
            [c["gasto_cultura_per_capita_clp"] for c in self.comunas],
            [c["participacion_cultural_pct_c2"] for c in self.comunas],
        )
        self.assertGreater(r_cp03, 0.75)
        macro = presets["CP_05"]["config"]["mirror_series"]["structural_by_macrozona"]
        self.assertEqual(macro, {"norte": 20613.5, "centro": 21564.0, "sur": 23672.8})

    def test_04_consultor_hub9_queries(self):
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
          const r1 = await client.query('Compara fondos de cultura MINCAP adjudicados, FNDR 8% cultura, gasto municipal en cultura y gasto cultural per cápita en Coyhaique, Aysén, Lago Verde, Tortel y O Higgins');
          const k1 = [r1.chart.varX, r1.chart.varY, r1.chart.varZ, r1.chart.varW].filter(Boolean);
          for (const k of ['fondos_cultura_adjudicados_mclp', 'fndr_8pct_cultura_mclp', 'gasto_municipal_cultura_mclp', 'gasto_cultura_per_capita_clp']) {
            assert(k1.includes(k), 'Falta ' + k + ' en ' + JSON.stringify(k1));
          }
          assert(!k1.includes('presupuesto_per_capita_mclp') && !k1.includes('ingresos_propios_per_capita_clp'));

          const r2 = await client.query('patrimonio cultural inmaterial SIGPA, tejueleros de ciprés, carpinteros de ribera, Baño Nuevo, Paredón de las Manos y Chilesaurus');
          assert.strictEqual(r2.chart.customCategoryData, true);
          assert(r2.reply.includes('313') && r2.reply.includes('Baño Nuevo') && r2.reply.includes('Chilesaurus'));
          console.log('HUB9_CONSULTOR_OK');
        })().catch(e => { console.error(e); process.exit(1); });
        """
        res = subprocess.run(["node", "-e", node_script], cwd=ROOT_DIR, capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(res.returncode, 0, f"Hub9 Consultor test failed:\n{res.stderr}\n{res.stdout}")
        self.assertIn("HUB9_CONSULTOR_OK", res.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
