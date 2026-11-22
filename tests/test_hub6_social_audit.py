#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_hub6_social_audit.py
=============================================================================
Suite de auditoria integral Hub VI: Sociedad, Demografia, Educacion,
Vivienda y Seguridad (Bloques 1 a 4).
=============================================================================
"""

import json
import os
import re
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


class TestHub6SocialAudit(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle.get("comunas", [])
        cls.nodos = {n["id"]: n for n in cls.bundle.get("nodos", [])}

    def test_01_seguridad_educacion_y_ratios_en_comunas(self):
        self.assertEqual(len(self.comunas), 10)
        dmcs_vals = [c.get("tasa_dmcs_100k") for c in self.comunas]
        vif_vals = [c.get("tasa_vif_100k") for c in self.comunas]
        self.assertTrue(all(isinstance(v, (int, float)) and v > 0 for v in dmcs_vals))
        self.assertTrue(all(isinstance(v, (int, float)) and v > 0 for v in vif_vals))
        self.assertGreaterEqual(len(set(dmcs_vals)), 8)
        self.assertGreaterEqual(len(set(vif_vals)), 8)

        self.assertEqual(sum(c["escuelas_rurales_multigrado_n"] for c in self.comunas), 36)
        self.assertEqual(sum(c["liceos_urbanos_n"] for c in self.comunas), 16)
        self.assertEqual(sum(c["establecimientos_escolares_n"] for c in self.comunas), 84)

        for c in self.comunas:
            self.assertGreaterEqual(
                c["establecimientos_escolares_n"],
                c["establecimientos_slep_aysen"],
                f"Inconsistencia escolar en {c['nombre']}",
            )
            self.assertGreaterEqual(
                c["establecimientos_escolares_n"],
                c["establecimientos_educacion_conectados_n"],
                f"Inconsistencia conectividad escolar en {c['nombre']}",
            )
            self.assertIsNotNone(c.get("ratio_pobreza_multidim_vs_ingresos"))
            self.assertIsNotNone(c.get("deficit_habitacional_total_por_1000_hab"))

        by_name = {c["nombre"]: c for c in self.comunas}
        self.assertAlmostEqual(by_name["Lago Verde"]["ratio_pobreza_multidim_vs_ingresos"], 27.2, delta=0.5)
        self.assertGreater(by_name["Tortel"]["deficit_habitacional_total_por_1000_hab"], 70.0)

        series = self.bundle.get("series", {})
        vif_hist = [p["valor"] if isinstance(p, dict) else p for p in series.get("tasa_vif_regional_por_100k_hab", [])]
        dmcs_hist = [p["valor"] if isinstance(p, dict) else p for p in series.get("tasa_dmcs_regional_por_100k_hab", [])]
        self.assertEqual(len(vif_hist), 12)
        self.assertEqual(len(dmcs_hist), 12)
        self.assertAlmostEqual(vif_hist[5], 1056.4, delta=0.2)
        self.assertAlmostEqual(vif_hist[-1], 897.1, delta=0.2)
        self.assertAlmostEqual(dmcs_hist[5], 1706.5, delta=0.2)
        self.assertAlmostEqual(dmcs_hist[-1], 2107.8, delta=0.2)

    def test_02_capa_escuelas_slep_y_nodos_23_41(self):
        escuelas = self.bundle.get("spatialNodesByLayer", {}).get("escuelas_slep", [])
        self.assertEqual(len(escuelas), 57)

        part_sub = [n for n in escuelas if "Particular Subvencionado" in str(n.get("tipo", ""))]
        self.assertTrue(all("MINEDUC" in n.get("tipo", "") for n in part_sub))
        self.assertFalse(any("Liceo SLEP" in str(n.get("tipo", "")) and "Particular" in str(n.get("nombre", "")) for n in escuelas))

        # Cero matriculas escolares clonadas en 450
        self.assertFalse(any(n.get("magnitudeValue") == 450 and "Colegio" in str(n.get("tipo", "")) for n in escuelas))
        sies_tipos = {"Universidad Estatal", "Instituto Profesional / CFT", "Centro de Formación Técnica Estatal"}
        sies_nodes = [n for n in escuelas if n.get("tipo") in sies_tipos]
        self.assertEqual(len(sies_nodes), 3)
        sies_vals = sorted([n.get("magnitudeValue") for n in sies_nodes], reverse=True)
        self.assertEqual(sies_vals, [1360, 650, 317])
        self.assertEqual(sum(sies_vals), 2327)

        n23 = self.nodos[23]
        n23_json = json.dumps(n23, ensure_ascii=False)
        self.assertIn("57.823", n23_json)
        self.assertIn("23.170", n23_json)
        n41 = self.nodos[41]
        self.assertTrue(any("Beneficiarios SSR/APR (personas)" in str(col) for col in n41.get("tableColumns", [])))

    def test_03_presets_hub_social(self):
        presets = {p["preset_id"]: p for p in self.bundle.get("hubsGallery", {}).get("social", {}).get("presets", [])}
        self.assertEqual(presets["hub_05_01"]["config"]["spatialLayer"], "escuelas_slep")
        self.assertFalse(presets["hub_05_01"]["config"]["showBuffers"])
        self.assertEqual(presets["hub_05_01"]["config"].get("activeOverlays"), ["hospitales_postas", "ruta7_tramos"])
        self.assertNotIn("varY2", presets["hub_05_02"]["config"])
        self.assertEqual(presets["hub_05_03"]["config"]["varX"], "rsh_carencia_servicios_basicos_jun2026_pct")
        self.assertEqual(presets["hub_05_03"]["config"]["varY"], "pobreza_multidim_pct")
        self.assertIn("2020-2021", presets["hub_05_04"]["what_it_shows"].replace("–", "-"))
        macro = presets["hub_05_05"]["config"]["mirror_series"]["structural_by_macrozona"]
        self.assertEqual(macro, {"norte": 23.0, "centro": 17.2, "sur": 20.0})

    def test_04_consultor_hub6_queries(self):
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
          const r1 = await client.query('¿Cómo han evolucionado las denuncias de violencia intrafamiliar VIF frente a los delitos de mayor connotación social DMCS en Aysén entre 2015 y 2026 y cuáles son las tasas de VIF y DMCS por comuna?');
          assert.strictEqual(r1.chart.customTemporalSeries, true);
          assert(r1.reply.includes('1.056,4') && r1.reply.includes('897,1'), 'Falta pico VIF o cierre 2026');

          const r2 = await client.query('Compara la matrícula escolar SLEP, los establecimientos escolares SLEP, la matrícula de educación superior SIES y el porcentaje de hogares sin internet fijo');
          const keys2 = [r2.chart.varX, r2.chart.varY, r2.chart.varZ, r2.chart.varW].filter(Boolean);
          assert.strictEqual(new Set(keys2).size, 4, 'Faltan 4 variables en educacion/digital: ' + JSON.stringify(keys2));
          assert(keys2.includes('establecimientos_slep_aysen'));
          assert(keys2.includes('matricula_ed_superior_sies'));

          const r3 = await client.query('Compara el porcentaje de autoidentificación indígena, las comunidades indígenas CONADI, el índice de envejecimiento y el índice de masculinidad');
          const keys3 = [r3.chart.varX, r3.chart.varY, r3.chart.varZ, r3.chart.varW].filter(Boolean);
          assert.strictEqual(new Set(keys3).size, 4, 'Faltan 4 variables demograficas: ' + JSON.stringify(keys3));
          assert(keys3.includes('indice_masculinidad'));
          assert.strictEqual(r3.chart.multiCharts.length, 2);
          const pair1 = new Set([r3.chart.multiCharts[0].varX, r3.chart.multiCharts[0].varY]);
          const pair2 = new Set([r3.chart.multiCharts[1].varX, r3.chart.multiCharts[1].varY]);
          const intersection = [...pair1].filter(x => pair2.has(x));
          assert.strictEqual(intersection.length, 0, 'multiCharts no debe repetir variables entre tarjetas');
          console.log('HUB6_CONSULTOR_OK');
        })().catch(e => { console.error(e); process.exit(1); });
        """
        res = subprocess.run(["node", "-e", node_script], cwd=ROOT_DIR, capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(res.returncode, 0, f"Hub6 Consultor test failed:\n{res.stderr}\n{res.stdout}")
        self.assertIn("HUB6_CONSULTOR_OK", res.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
