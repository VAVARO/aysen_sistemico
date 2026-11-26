#!/usr/bin/env python3
"""
tests/test_hubs3_4_5_reengineering.py
=====================================
Suite de regresion integral para la reingenieria de los Hubs V (Inversion),
IV (Gobernanza) y III (Energia y Conectividad Multimodal).
Cubre: Data Lake compilado (data/aysen_hubs_data.js), Presets (data/cecan_16_presets_aysen.json),
Laboratorio Sistemico (laboratorio.html), Consultor de Datos (consultor.html + js/omniroute_client.js)
y lexico semantico (data/nl_lexicon_aysen.json).
"""

import json
import os
import subprocess
import unittest

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def run_node_script(js_body: str) -> dict:
    """Ejecuta un script Node en el root del proyecto y retorna JSON parseado de stdout."""
    proc = subprocess.run(
        ["node", "-e", js_body],
        cwd=ROOT_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=False,
    )
    if proc.returncode != 0:
        raise AssertionError(f"Node script fallo (exit {proc.returncode}):\nSTDERR:\n{proc.stderr}\nSTDOUT:\n{proc.stdout}")
    return json.loads(proc.stdout)


class TestHubs345Reengineering(unittest.TestCase):
    """Pruebas integradas de contrato para Hubs V, IV y III."""

    @classmethod
    def setUpClass(cls):
        with open(os.path.join(ROOT_DIR, "data", "cecan_16_presets_aysen.json"), "r", encoding="utf-8") as f:
            cls.presets = json.load(f)
        with open(os.path.join(ROOT_DIR, "data", "nl_lexicon_aysen.json"), "r", encoding="utf-8") as f:
            cls.lexicon = json.load(f)
        with open(os.path.join(ROOT_DIR, "laboratorio.html"), "r", encoding="utf-8") as f:
            cls.lab_html = f.read()
        with open(os.path.join(ROOT_DIR, "consultor.html"), "r", encoding="utf-8") as f:
            cls.consultor_html = f.read()

        snapshot_js = r"""
        const fs = require('fs');
        const vm = require('vm');
        const ctx = { console, window: {}, globalThis: null, Math, JSON, Date, Array, Object, Set, Map, RegExp, Number, String, Boolean };
        ctx.globalThis = ctx;
        ctx.window = ctx;
        vm.runInNewContext(fs.readFileSync('data/aysen_hubs_data.js', 'utf8'), ctx);
        const d = ctx.AYSEN_HUBS_DATA;
        const nodesById = {};
        [11, 12, 14, 15, 16, 19, 20, 21].forEach(id => {
          nodesById[id] = d.nodos.find(n => n.id === id);
        });
        process.stdout.write(JSON.stringify({
          comunas: d.comunas,
          nodesById,
          series: {
            pib_regional_nominal_mmclp: d.series?.pib_regional_nominal_mmclp || [],
            generacion_electrica_anual: d.series?.generacion_electrica_anual || [],
            fndr_asignado_vs_ejecutado_2015_2025: d.series?.fndr_asignado_vs_ejecutado_2015_2025 || [],
            emporcha_toneladas: d.series?.emporcha_toneladas || [],
          },
          layers: {
            proyectos_seia_puros: d.spatialNodesByLayer?.proyectos_seia_puros || [],
            mineria_faenas: d.spatialNodesByLayer?.mineria_faenas || [],
            aerodromos_dgac: d.spatialNodesByLayer?.aerodromos_dgac || [],
            gobernanza_obras: d.spatialNodesByLayer?.gobernanza_obras || [],
            centrales_electricas: d.spatialNodesByLayer?.centrales_electricas || [],
            centrales_electricas_puros: d.spatialNodesByLayer?.centrales_electricas_puros || [],
            nodos_foa: d.spatialNodesByLayer?.nodos_foa || [],
          }
        }));
        """
        cls.bundle = run_node_script(snapshot_js)

    def _assert_aysen_bbox(self, items, layer_name):
        for item in items:
            lat = item.get("lat")
            lon = item.get("lon")
            self.assertIsNotNone(lat, f"{layer_name}: {item.get('id')} sin lat")
            self.assertIsNotNone(lon, f"{layer_name}: {item.get('id')} sin lon")
            self.assertGreaterEqual(lat, -49.5, f"{layer_name}: {item.get('id')} lat fuera BBOX Aysen ({lat})")
            self.assertLessEqual(lat, -43.4, f"{layer_name}: {item.get('id')} lat fuera BBOX Aysen ({lat})")
            self.assertGreaterEqual(lon, -76.0, f"{layer_name}: {item.get('id')} lon fuera BBOX Aysen ({lon})")
            self.assertLessEqual(lon, -71.0, f"{layer_name}: {item.get('id')} lon fuera BBOX Aysen ({lon})")

    # ------------------------------------------------------------------
    # BLOQUE HUB V: INVERSION, SEIA, MINERIA Y ECONOMIA TERRITORIAL
    # ------------------------------------------------------------------
    def test_01_hub5_seia_mineria_y_aerodromos_espaciales(self):
        seia = self.bundle["layers"]["proyectos_seia_puros"]
        self.assertEqual(len(seia), 20)
        self._assert_aysen_bbox(seia, "proyectos_seia_puros")
        seia_04 = next((x for x in seia if str(x.get("id", "")).startswith("inv_seia-04")), None)
        self.assertIsNotNone(seia_04)
        self.assertGreater(seia_04["magnitudeValue"], 0)
        self.assertTrue(all(x.get("titular") for x in seia))
        self.assertGreaterEqual(len({x["magnitudeValue"] for x in seia}), 14)

        mineria = self.bundle["layers"]["mineria_faenas"]
        self.assertEqual(len(mineria), 5)
        self._assert_aysen_bbox(mineria, "mineria_faenas")
        for m in mineria:
            self.assertTrue(str(m.get("id", "")).startswith("inv_min_"))
            self.assertEqual(m.get("hubId"), "inversion")
            self.assertGreater(m.get("magnitudeValue", 0), 0)
            self.assertTrue(m.get("titular"))
        self.assertIn("mineria_faenas", self.lab_html)

        aero = self.bundle["layers"]["aerodromos_dgac"]
        self.assertEqual(len(aero), 10)
        self._assert_aysen_bbox(aero, "aerodromos_dgac")
        balm = next((x for x in aero if "balmaceda" in x.get("nombre", "").lower()), None)
        self.assertIsNotNone(balm)
        self.assertAlmostEqual(balm["lat"], -45.9160, places=3)
        self.assertAlmostEqual(balm["lon"], -71.6890, places=3)
        self.assertEqual(balm["magnitudeValue"], 605945)
        vidales = [x for x in aero if "teniente vidal" in x.get("nombre", "").lower()]
        self.assertEqual(len(vidales), 1)

    def test_02_hub5_nodos_reconciliados_metricas_y_presets(self):
        n19 = self.bundle["nodesById"]["19"]
        aysen_inv = n19["chartSpec"]["datasets"][0]["data"][2]
        self.assertEqual(aysen_inv, 1320)

        n20 = self.bundle["nodesById"]["20"]
        emp_bins = n20["chartSpec"]["datasets"][0]["data"]
        self.assertEqual(emp_bins, [10117, 2718, 515, 103])
        self.assertEqual(sum(emp_bins), 13453)
        self.assertIn("Ventas Anuales (Miles de UF)", n20["tableColumns"])

        n21 = self.bundle["nodesById"]["21"]
        chile_chico_ha = n21["chartSpec"]["datasets"][0]["data"][5]
        self.assertEqual(chile_chico_ha, 48200)
        for row in n21["tableRows"]:
            for cell in row:
                self.assertNotEqual(str(cell).strip(), "-", f"Celda placeholder '-' en Nodo 21: {row}")

        comunas = self.bundle["comunas"]
        self.assertEqual(sum(c["ventas_sii_muf"] for c in comunas), 131520)
        for c in comunas:
            for key in ("ventas_sii_muf", "ventas_por_empresa_uf", "inversion_por_proyecto_seia_mmusd", "suelo_fiscal_bbnn_pct", "suelo_privado_pct"):
                self.assertIn(key, c)
                self.assertIsInstance(c[key], (int, float))

        pib_series = self.bundle["series"]["pib_regional_nominal_mmclp"]
        self.assertEqual(len(pib_series), 12)
        self.assertEqual(pib_series[0]["valor"], 980000)
        self.assertEqual(pib_series[-1]["valor"], 1830000)

        inv_presets = self.presets["hubs_gallery"]["inversion"]["presets"]
        self.assertEqual([p["preset_id"] for p in inv_presets], [f"hub_04_0{i}" for i in range(1, 6)])
        p04_05 = inv_presets[4]
        self.assertEqual(p04_05["config"]["mirror_series"]["structural_by_macrozona"], {"centro": 80.8, "norte": 8.3, "sur": 10.9})

    # ------------------------------------------------------------------
    # BLOQUE HUB IV: GOBERNANZA, FINANZAS MUNICIPALES Y PER CAPITA
    # ------------------------------------------------------------------
    def test_03_hub4_per_capita_runtime_y_kpi_intensivos(self):
        runtime_js = r"""
        const fs = require('fs');
        const vm = require('vm');
        const ctx = { console, window: {}, globalThis: null, Math, JSON, Date, Array, Object, Set, Map, RegExp, Number, String, Boolean };
        ctx.globalThis = ctx;
        ctx.window = ctx;
        vm.runInNewContext(fs.readFileSync('data/aysen_hubs_data.js', 'utf8'), ctx);
        const d = ctx.AYSEN_HUBS_DATA;
        const lab = fs.readFileSync('laboratorio.html', 'utf8');

        const mCtx = lab.match(/const COMUNAS_CONTEXT_MAP = \{[\s\S]*?\n\s*\};/);
        const mAlias = lab.match(/const COMUNAS_DATA = COMUNAS_CONTEXT_MAP;/);
        if (!mCtx || !mAlias) throw new Error('Falta COMUNAS_CONTEXT_MAP o const COMUNAS_DATA');
        const mPc = lab.match(/const isRate = \(u, varId\)[\s\S]*?res\.unitY = nextUY;\s*\}\s*\}/);
        if (!mPc) throw new Error('Falta bloque Per Capita en laboratorio.html');
        const mKpi = lab.match(/const INTENSIVE_KPI_RE = \/[^\n]+;/);
        if (!mKpi) throw new Error('Falta INTENSIVE_KPI_RE en laboratorio.html');

        const labels = d.comunas.map(c => c.nombre);
        const fndrVals = d.comunas.map(c => c.fndr_mclp);
        const fn = new Function(
          'labels', 'fndrVals',
          `${mCtx[0]}
           ${mAlias[0]}
           const res = { mode: 'univariate', dim: 'comuna', labels, data: [...fndrVals], unit: 'M$ CLP' };
           const w = { varX: 'fndr_mclp' };
           ${mPc[0]}
           ${mKpi[0]}
           return {
             scaled: res.data,
             unit: res.unit,
             kpiMatches: {
               presidencial: INTENSIVE_KPI_RE.test('participacion_presidencial_2025_2v_pct'),
               gasolina: INTENSIVE_KPI_RE.test('gasolina_93_clp'),
               sinInternet: INTENSIVE_KPI_RE.test('hogares_sin_internet_fijo_pct'),
               mp25: INTENSIVE_KPI_RE.test('dias_sobre_norma_mp25')
             }
           };`
        );
        process.stdout.write(JSON.stringify(fn(labels, fndrVals)));
        """
        out = run_node_script(runtime_js)
        self.assertEqual(out["unit"], "Miles $ CLP/hab")
        self.assertAlmostEqual(min(out["scaled"]), 256.8, delta=0.5)
        self.assertAlmostEqual(max(out["scaled"]), 5148.5, delta=1.5)
        self.assertTrue(all(out["kpiMatches"].values()), f"Fallo KPI Promedio: {out['kpiMatches']}")
        self.assertIn("title: 'Presupuesto municipal por habitante (Miles $ CLP/hab)'", self.lab_html)

    def test_04_hub4_obras_nodos_derivadas_y_presets(self):
        obras = self.bundle["layers"]["gobernanza_obras"]
        self.assertEqual(len(obras), 13)
        self._assert_aysen_bbox(obras, "gobernanza_obras")
        for o in obras:
            self.assertNotEqual(o.get("magnitudeValue"), 4500, f"Placeholder 4500 en {o.get('id')}")
            self.assertTrue(o.get("titular"))

        n15 = self.bundle["nodesById"]["15"]
        p_by_comuna = {r[0]: (r[1], r[2], r[3], r[4]) for r in n15["tableRows"]}
        for interior in ["Coyhaique", "Lago Verde", "Chile Chico", "Río Ibáñez", "Cochrane", "O'Higgins"]:
            self.assertEqual(p_by_comuna[interior][2], "0", f"Patente acuicola no nula en {interior}")
        self.assertEqual(p_by_comuna["O'Higgins"][0], "2.150")
        self.assertEqual(p_by_comuna["Tortel"][0], "2.050")

        n16 = self.bundle["nodesById"]["16"]
        self.assertIn("Aporte FCM (M$)", n16["tableColumns"])
        fcm_vals = n16["chartSpec"]["datasets"][0]["data"]
        self.assertEqual(fcm_vals[9], 92.8)
        self.assertEqual(fcm_vals[8], 91.5)
        self.assertEqual(fcm_vals[1], 89.2)

        for c in self.bundle["comunas"]:
            for k in ("fndr_per_capita_mclp", "fndr_gore_2023_per_capita_mclp", "royalty_fet_peso_presupuesto_pct", "participacion_municipales_2024_pct", "ratio_padron_poblacion_pct"):
                self.assertIn(k, c)
                self.assertIsInstance(c[k], (int, float))

        fndr_series = self.bundle["series"]["fndr_asignado_vs_ejecutado_2015_2025"]
        row2020 = next(r for r in fndr_series if str(r["anio"]) == "2020")
        self.assertAlmostEqual(row2020["asignado_mclp"], 17714.6, places=1)
        self.assertAlmostEqual(row2020["gasto_actual_mclp"], 17510.2, places=1)

        gov_presets = self.presets["hubs_gallery"]["gobernanza"]["presets"]
        self.assertEqual([p["preset_id"] for p in gov_presets], [f"hub_01_0{i}" for i in range(1, 6)])
        idx2020 = gov_presets[3]["config"]["customChartSpec"]["labels"].index("2020")
        self.assertEqual(gov_presets[3]["config"]["customChartSpec"]["datasets"][1]["data"][idx2020], 17714.6)
        self.assertEqual(gov_presets[3]["config"]["customChartSpec"]["datasets"][2]["data"][idx2020], 17510.2)
        self.assertEqual(gov_presets[4]["config"]["mirror_series"]["structural_by_macrozona"], {"norte": 78.8, "centro": 62.8, "sur": 82.4})

    # ------------------------------------------------------------------
    # BLOQUE HUB III: ENERGIA, CONECTIVIDAD MULTIMODAL Y TELECOMUNICACIONES
    # ------------------------------------------------------------------
    def test_05_hub3_energia_telecom_espacial_y_reconciliacion(self):
        centrales = self.bundle["layers"]["centrales_electricas"]
        puros = self.bundle["layers"]["centrales_electricas_puros"]
        foa = self.bundle["layers"]["nodos_foa"]
        self.assertEqual(len(centrales), 24)
        self.assertEqual(len(puros), 16)
        self.assertEqual(len(foa), 8)
        self._assert_aysen_bbox(centrales, "centrales_electricas")

        chac_comb = next((x for x in centrales if x["id"] == "ene_nodo-combustibles-chacabuco"), None)
        self.assertIsNotNone(chac_comb)
        self.assertEqual(chac_comb["magnitudeValue"], 18500)
        sub_coy = next((x for x in centrales if x["id"] == "ene_nodo-elec-subestacion-coyhaique"), None)
        self.assertIsNotNone(sub_coy)
        self.assertEqual(sub_coy["magnitudeValue"], 66)
        for x in centrales:
            self.assertFalse(x.get("magnitudeValue") == 12 and "m3" in str(x.get("magnitudeUnit", "")))

        comunas = self.bundle["comunas"]
        self.assertEqual([c["costo_diesel_aislado_clp"] for c in comunas], [0, 560, 0, 380, 640, 0, 0, 0, 620, 680])
        self.assertEqual([c["subsidio_fiscal_diesel_kwh_clp"] for c in comunas], [0, 302, 0, 145, 375, 0, 0, 0, 358, 412])
        for c in comunas:
            self.assertLessEqual(c["ruta7_pavimentada_km"], c["red_vial_pavimentada_km"])
            self.assertNotIn("cabezas_bovinos_caf", c)
            self.assertNotIn("cabezas_ovinos_caf", c)
            self.assertNotIn("consumo_lena_m3_hogar_anio", c)
            self.assertIn("indice_aislamiento_multimodal", c)

        n11 = self.bundle["nodesById"]["11"]
        self.assertEqual(n11["chartSpec"]["datasets"][0]["data"], [74.9, 20.4, 3.2, 0.1])
        self.assertAlmostEqual(sum(n11["chartSpec"]["datasets"][0]["data"]), 98.6, places=1)
        n12 = self.bundle["nodesById"]["12"]
        self.assertEqual(n12["chartSpec"]["datasets"][0]["data"][2], 42.5)
        n14 = self.bundle["nodesById"]["14"]
        self.assertEqual(n14["chartSpec"]["datasets"][0]["data"], [c["internet_fijo_pct"] for c in comunas])
        for row in n14["tableRows"]:
            self.assertNotIn("Sin brecha critica", " ".join(str(x) for x in row))

        self.assertGreaterEqual(len(self.bundle["series"]["generacion_electrica_anual"]), 12)
        for emporcha_key in (
            "emporcha_carga_transbordadores_ton",
            "emporcha_carga_comercial_ton",
            "emporcha_graneles_mineros_ton",
            "emporcha_acuicultura_pesca_ton",
        ):
            self.assertIn(emporcha_key, self.lab_html)

        ene_presets = self.presets["hubs_gallery"]["energia"]["presets"]
        self.assertEqual([p["preset_id"] for p in ene_presets], [f"hub_02_0{i}" for i in range(1, 6)])
        self.assertEqual(ene_presets[3]["config"]["varX"], "generacion_hidro_gwh")
        self.assertEqual(ene_presets[3]["config"]["varY"], "generacion_diesel_gwh")

        for lex_key in ("subsidio_fiscal_diesel_kwh_clp", "indice_aislamiento_multimodal", "ventas_sii_muf", "suelo_privado_pct", "fndr_per_capita_mclp", "royalty_fet_peso_presupuesto_pct"):
            self.assertTrue(any(v.get("id") == lex_key for v in self.lexicon.get("variables", [])), f"Falta en lexicon: {lex_key}")

    # ------------------------------------------------------------------
    # BLOQUE CONSULTOR: QUERIES HUBS III, IV, V + CONTRATOS PRESERVADOS
    # ------------------------------------------------------------------
    def test_06_consultor_hubs_3_4_5_y_contratos_preservados(self):
        consultor_js = r"""
        const fs = require('fs');
        const vm = require('vm');
        const ctx = { console, window: {}, globalThis: null, Math, JSON, Date, Array, Object, Set, Map, RegExp, Number, String, Boolean };
        ctx.globalThis = ctx;
        ctx.window = ctx;
        vm.runInNewContext(fs.readFileSync('data/aysen_hubs_data.js', 'utf8'), ctx);
        vm.runInNewContext(fs.readFileSync('js/nl2chart_engine.js', 'utf8'), ctx);
        vm.runInNewContext(fs.readFileSync('js/omniroute_client.js', 'utf8'), ctx);
        const cli = ctx.OmniRouteClient;
        const consultorHtml = fs.readFileSync('consultor.html', 'utf8');
        const mUpd = consultorHtml.match(/function updateLabLink\(\)\s*\{[\s\S]*?\n\s{6}\}/);

        (async () => {
          const queries = {
            v1: await cli.query('¿Cómo han evolucionado los pasajeros del aeródromo de Balmaceda frente al PIB regional nominal de Aysén entre 2015 y 2026?'),
            v2: await cli.query('Cruza las empresas registradas en el SII con el porcentaje de compras locales, la fuga de compras extrarregionales y las sucursales bancarias o puntos CajaVecina'),
            v3: await cli.query('Compara las hectáreas de concesiones mineras con el Royalty Minero FET 2025, la inversión SEIA y el porcentaje de superficie SNASPE'),
            v4: await cli.query('Cruza las cabezas de ganado bovino y ovino con las subdivisiones prediales o parcelaciones SAG y el porcentaje de suelo privado'),
            iv1_roy: await cli.query('¿Cuánto recibieron las comunas de Aysén por el Fondo de Equidad Territorial del Royalty Minero en 2024 y 2025?'),
            iv1_dist: await cli.query('¿Cómo se distribuye el Fondo Común Municipal, el Royalty Minero FET 2025 y el FNDR per cápita entre las comunas?'),
            iv2: await cli.query('¿Cómo ha evolucionado la inversión anual del FNDR del GORE Aysén entre 2015 y 2025?'),
            iv3: await cli.query('¿Cuál es el cumplimiento de transparencia activa municipal CPLT 2026 en las 10 comunas de Aysén y qué relación tiene con el presupuesto municipal y la profesionalización de la planta?'),
            iii1: await cli.query('¿Cómo ha evolucionado la generación hidroeléctrica frente a la generación térmica diésel en Aysén entre 2015 y 2026?'),
            iii2: await cli.query('¿Cómo han evolucionado los pasajeros del aeródromo de Balmaceda y las toneladas de carga transferidas en Puerto Chacabuco EMPORCHA hasta 2026?'),
            iii3: await cli.query('¿Cuáles son las rutas de barcazas subsidiadas en Fiordo Mitchell, Lago General Carrera y Ruta Cordillera, sus frecuencias y qué pasa si falla la barcaza Padre Antonio Ronchi?'),
            iii4: await cli.query("Compara las horas de corte eléctrico SAIDI, la tarifa eléctrica BT1, el costo de generación diésel aislado y el subsidio fiscal diésel en Guaitecas, Tortel, O'Higgins, Lago Verde y Cisnes"),
            c_p2: await cli.query('Compara el PIB per capita de Coyhaique con el de Providencia'),
            c_ecmpo: await cli.query('solicitudes ecmpo ley lafkenche 620000 ha y concesiones en snaspe'),
            c_fndr_sec: await cli.query('inversion fndr devengada vs sectorial ministerial dipres'),
            c_barcaza: await cli.query('dependencia de barcaza en las comunas'),
            c_balm: await cli.query('¿Cómo evolucionaron los pasajeros en Balmaceda, cruceros en Chacabuco y visitas a parques SNASPE?')
          };

          const btnOpenInLab = { href: '' };
          let currentChartState = {};
          const ui = new Function(
            'btnOpenInLab', 'URL', 'window',
            `let currentChartState = {};
             const getState = () => currentChartState;
             ${mUpd[0]}
             return { setState: (s) => { currentChartState = s; }, updateLabLink };`
          )(btnOpenInLab, URL, { location: { href: 'http://localhost/consultor.html' } });

          ui.setState(Object.assign({}, queries.iii2.chart, { summary: queries.iii2.reply }));
          const urlIii2 = ui.updateLabLink();
          ui.setState(Object.assign({}, queries.v1.chart, { summary: queries.v1.reply }));
          const urlV1 = ui.updateLabLink();

          process.stdout.write(JSON.stringify({ queries, urlIii2, urlV1 }));
        })().catch(e => { console.error(e); process.exit(1); });
        """
        out = run_node_script(consultor_js)
        q = out["queries"]

        # Hub V
        self.assertEqual(q["v1"]["chart"]["type"], "line")
        self.assertEqual(q["v1"]["chart"]["varY"], "pib_regional_nominal_mmclp")
        self.assertIn("980.000", q["v1"]["reply"])
        self.assertNotIn("personas viven", q["v1"]["reply"].lower())

        v2_keys = {q["v2"]["chart"]["varX"], q["v2"]["chart"]["varY"], q["v2"]["chart"].get("varZ")}
        for m in (q["v2"]["chart"].get("multiCharts") or []):
            v2_keys.update([m.get("varX"), m.get("varY")])
        self.assertIn("empresas_sii", v2_keys)
        self.assertIn("compras_locales_pct", v2_keys)

        v3_keys = {q["v3"]["chart"]["varX"], q["v3"]["chart"]["varY"], q["v3"]["chart"].get("varZ")}
        for m in (q["v3"]["chart"].get("multiCharts") or []):
            v3_keys.update([m.get("varX"), m.get("varY")])
        self.assertEqual(v3_keys >= {"concesiones_mineras_ha", "fet_royalty_minero_2025_mclp", "inversion_seia_mmusd", "superficie_snaspe_pct"}, True)

        v4_keys = {q["v4"]["chart"]["varX"], q["v4"]["chart"]["varY"], q["v4"]["chart"].get("varZ")}
        for m in (q["v4"]["chart"].get("multiCharts") or []):
            v4_keys.update([m.get("varX"), m.get("varY")])
        self.assertEqual(v4_keys >= {"ganado_bovino_cabezas", "ganado_ovino_cabezas", "parcelaciones_sag_n", "suelo_privado_pct"}, True)

        # Hub IV
        self.assertIn("3.207,73", q["iv1_roy"]["reply"])
        self.assertIn("472,58", q["iv1_roy"]["reply"])
        self.assertIn("392,86", q["iv1_roy"]["reply"])
        self.assertIn("13,6%", q["iv1_roy"]["reply"])

        iv1d_keys = {q["iv1_dist"]["chart"]["varX"], q["iv1_dist"]["chart"]["varY"], q["iv1_dist"]["chart"].get("varZ")}
        for m in (q["iv1_dist"]["chart"].get("multiCharts") or []):
            iv1d_keys.update([m.get("varX"), m.get("varY")])
        self.assertEqual(iv1d_keys >= {"dependencia_fcm_pct", "fet_royalty_minero_2025_mclp", "fndr_per_capita_mclp"}, True)

        self.assertEqual(q["iv2"]["chart"]["type"], "line")
        self.assertTrue(bool(q["iv2"]["chart"].get("customTemporalSeries")))
        self.assertIn("31,5%", q["iv2"]["reply"])

        self.assertEqual(len(q["iv3"]["chart"].get("multiCharts") or []), 2)
        self.assertIn("0,19", q["iv3"]["reply"])
        self.assertIn("0,20", q["iv3"]["reply"])

        # Hub III
        self.assertEqual(q["iii1"]["chart"]["type"], "line")
        self.assertEqual(q["iii1"]["chart"]["varX"], "generacion_hidro_gwh")
        self.assertEqual(q["iii1"]["chart"]["varY"], "generacion_diesel_gwh")

        self.assertEqual(q["iii2"]["relatedHub"], "III")
        self.assertEqual(q["iii2"]["chart"]["varX"], "balmaceda_pasajeros_jac")
        self.assertEqual(q["iii2"]["chart"]["varY"], "emporcha_toneladas")
        self.assertIn("varY=emporcha_toneladas", out["urlIii2"])
        self.assertNotIn("emporcha_cruceros_hist", out["urlIii2"])
        self.assertIn("varY=pib_regional_nominal_mmclp", out["urlV1"])
        self.assertNotIn("visitantes_snaspe_conaf_hist", out["urlV1"])

        self.assertEqual(q["iii3"]["relatedHub"], "III")
        self.assertIn("Padre Antonio Ronchi", q["iii3"]["reply"])
        self.assertEqual(len(q["iii3"]["chart"].get("multiCharts") or []), 2)

        iii4_keys = {q["iii4"]["chart"]["varX"], q["iii4"]["chart"]["varY"], q["iii4"]["chart"].get("varZ")}
        for m in (q["iii4"]["chart"].get("multiCharts") or []):
            iii4_keys.update([m.get("varX"), m.get("varY")])
        self.assertEqual(iii4_keys, {"saidi_horas_anual", "tarifa_bt1_clp", "costo_diesel_aislado_clp", "subsidio_fiscal_diesel_kwh_clp"})
        self.assertEqual(len(q["iii4"]["chart"].get("focusComunas") or []), 5)

        # Contratos preservados
        self.assertIn("Providencia", q["c_p2"]["reply"])
        self.assertIn("620.000", q["c_ecmpo"]["reply"])
        self.assertIn("DIPRES", q["c_fndr_sec"]["reply"])
        self.assertEqual(q["c_barcaza"]["chart"]["varX"], "dependencia_barcaza_nivel")
        self.assertEqual(q["c_balm"]["chart"]["varY"], "visitantes_snaspe")


if __name__ == "__main__":
    unittest.main()
