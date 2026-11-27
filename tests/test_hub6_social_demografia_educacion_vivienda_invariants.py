#!/usr/bin/env python3
"""Suite de invariantes forenses del Hub VI (Desarrollo Social, Censo 2024, CASEN, MINVU, DOH-MOP, SLEP/SIES y CEAD) — Sprint 9."""

import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CUT_ORDER = ["11101", "11102", "11201", "11202", "11203", "11401", "11402", "11301", "11302", "11303"]


def load_bundle():
    txt = (ROOT / "data" / "aysen_hubs_data.js").read_text(encoding="utf-8")
    idx = txt.index("window.AYSEN_HUBS_DATA = ") + len("window.AYSEN_HUBS_DATA = ")
    return json.loads(txt[idx:].strip().rstrip(";"))


class TestHub6SocialDemografiaEducacionViviendaInvariants(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle["comunas"]
        cls.by_ine = {str(c["comuna_ine"]): c for c in cls.comunas}
        cls.ordered = [cls.by_ine[k] for k in CUT_ORDER]
        cls.nodos = {n["id"]: n for n in cls.bundle["nodos"]}
        cls.sys05 = json.loads((ROOT / "data" / "systemic" / "05_social_salud_educacion_riesgos.json").read_text(encoding="utf-8"))
        cls.sys08 = json.loads((ROOT / "data" / "systemic" / "08_desagregaciones_sectoriales_aysen.json").read_text(encoding="utf-8"))
        cls.sys04 = json.loads((ROOT / "data" / "systemic" / "04_inversion_seia_economia.json").read_text(encoding="utf-8"))
        cls.lexicon = json.loads((ROOT / "data" / "nl_lexicon_aysen.json").read_text(encoding="utf-8"))
        cls.hub06_wiki = (ROOT / "wiki" / "hubs" / "hub_06_social.md").read_text(encoding="utf-8")

    def test_01_censo_2024_demografia_hogares_viviendas_iam(self):
        """Hogares=39964, viviendas=52294 (39631 ocupadas), IAM, masculinidad 97.9 y residuos Sprint 8."""
        self.assertEqual([c["poblacion_censo_2024"] for c in self.ordered], [57823, 882, 23170, 5335, 1598, 4950, 2671, 3492, 664, 563])
        self.assertEqual(sum(c["poblacion_censo_2024"] for c in self.ordered), 101148)
        self.assertEqual(self.bundle["censo2024DemografiaResumen"]["poblacion_regional_total"], 100745)

        self.assertEqual(sum(c["hogares_censo_2024"] for c in self.ordered), 39964)
        self.assertEqual(sum(c["viviendas_totales_censo_2024"] for c in self.ordered), 52294)
        self.assertEqual(sum(c["viviendas_ocupadas_censo_2024"] for c in self.ordered), 39631)

        self.assertAlmostEqual(float(self.by_ine["11102"]["indice_envejecimiento"]), 182.8, places=1)
        self.assertAlmostEqual(float(self.by_ine["11402"]["indice_envejecimiento"]), 121.2, places=1)
        self.assertAlmostEqual(float(self.by_ine["11303"]["indice_envejecimiento"]), 30.8, places=1)
        self.assertAlmostEqual(float(self.bundle["censo2024DemografiaResumen"]["indice_masculinidad_regional"]), 97.9, places=1)
        self.assertEqual([c["pueblos_originarios_pct_censo_2024"] for c in self.ordered], [25.7, 28.2, 34.7, 34.9, 57.9, 26.0, 32.4, 24.5, 28.4, 40.2])
        self.assertEqual([c["inmigrantes_internacionales_pct_censo_2024"] for c in self.ordered], [4.3, 2.8, 3.5, 3.6, 1.4, 4.1, 2.9, 2.5, 3.6, 3.3])

        # Limpieza Bloque 0 (residuos Sprint 8)
        for c in self.sys04["por_comuna"]:
            self.assertNotIn("ventas_anuales_domicilio_local_miles_uf", c["datos"]["estructura_empresarial_sii"])
        self.assertAlmostEqual(sum(float(c["ventas_sii_domicilio_local_muf"]) for c in self.ordered), 25800.0, places=1)
        lex_by_id = {v["id"]: v for v in self.lexicon["variables"]}
        self.assertNotIn("isAliasOf", lex_by_id["matricula_educacion_superior_sies_n"])
        self.assertEqual(lex_by_id["matricula_ed_superior_sies"].get("isAliasOf"), "matricula_educacion_superior_sies_n")

    def test_02_casen_2022_2024_pobreza_y_rsh(self):
        """CASEN 2022 BCN, Nueva Metodologia CASEN 2024 (ene-2026) y vectores RSH oficiales."""
        self.assertEqual([c["pobreza_ingresos_pct"] for c in self.ordered], [2.9, 0.9, 5.3, 5.0, 6.1, 6.2, 7.0, 6.3, 9.2, 4.6])
        self.assertEqual([c["pobreza_multidim_pct"] for c in self.ordered], [14.0, 18.0, 12.8, 12.3, 22.2, 16.3, 18.8, 14.3, 12.1, 12.3])
        self.assertEqual([c["rsh_carencia_servicios_basicos_jun2026_pct"] for c in self.ordered], [11.5, 33.9, 11.7, 12.0, 26.1, 9.6, 14.4, 15.8, 14.4, 44.0])
        self.assertEqual([c["rsh_hacinamiento_jun2026_pct"] for c in self.ordered], [6.7, 3.6, 5.0, 3.9, 11.0, 5.9, 4.9, 5.8, 4.6, 9.0])

        casen24 = self.bundle.get("casen2024NuevaMetodologia") or self.sys05["resumen_regional"].get("casen_2024_nueva_metodologia")
        self.assertIsNotNone(casen24)
        self.assertAlmostEqual(float(casen24["pobreza_ingresos_regional_2024_pct"]), 14.3, places=1)
        self.assertAlmostEqual(float(casen24["pobreza_multidimensional_regional_2024_pct"]), 12.1, places=1)
        pubs = casen24["comunas_publicadas_bcn_2026"]
        self.assertAlmostEqual(float(pubs["11102"]["pobreza_ingresos_2024_pct"]), 15.1, places=1)
        self.assertAlmostEqual(float(pubs["11201"]["pobreza_multidim_2024_pct"]), 12.2, places=1)
        self.assertAlmostEqual(float(pubs["11301"]["pobreza_multidim_2024_pct"]), 9.9, places=1)

    def test_03_minvu_deficit_cuantitativo_cualitativo_y_peh_2026(self):
        """Deficit cuantitativo CECT=1927, 4 componentes, cualitativo=12.9% (5155), 10 campamentos y PEH 1671 (129.2%)."""
        self.assertEqual([c["deficit_habitacional_cuantitativo_n"] for c in self.ordered], [1128, 73, 330, 109, 14, 86, 50, 118, 4, 15])
        self.assertEqual(sum(c["deficit_habitacional_cuantitativo_n"] for c in self.ordered), 1927)
        self.assertEqual([c["deficit_cuantitativo_pct_hogares"] for c in self.ordered], [5.0, 19.6, 3.6, 5.0, 2.3, 4.1, 4.1, 8.1, 1.4, 6.5])
        self.assertEqual(sum(c["deficit_habitacional_cualitativo_n"] for c in self.ordered), 5155)

        hab_res = self.sys05["resumen_regional"]["habitat_y_deficit_habitacional_minvu"]
        self.assertEqual(hab_res["viviendas_irrecuperables_cantidad"], 609)
        self.assertEqual(hab_res["hogares_allegados_cantidad"], 333)
        self.assertEqual(hab_res["nucleos_allegados_hacinados_cantidad"], 326)
        self.assertEqual(hab_res["viviendas_hacinamiento_no_ampliable_cantidad"], 659)
        self.assertEqual(hab_res["deficit_cuantitativo_metodologia_historica_2024"], 1254)
        self.assertEqual(hab_res["campamentos_minvu_2024_total"], 10)
        self.assertEqual(hab_res["campamentos_minvu_2024_hogares"], 244)
        self.assertEqual(hab_res["plan_emergencia_habitacional_meta_entrega"], 1293)
        self.assertEqual(hab_res["peh_viviendas_terminadas_feb2026"], 1671)
        self.assertAlmostEqual(float(hab_res["peh_cumplimiento_feb2026_pct"]), 129.2, places=1)

        # Verificar preservacion anti-regresion en WP_08
        for key in ("salud_mental_y_uhce_hrc", "mortalidad_oncologica_digestiva", "listas_espera_sigte"):
            self.assertIn(key, self.sys08["resumen_regional"])

    def test_04_ssr_apr_doh_personas_vs_familias_ceiling(self):
        """47 comites SSR/APR, 28.833 personas y 9.185 familias (< hogares_censo_2024 en las 10 comunas)."""
        self.assertEqual(sum(c["sistemas_ssr_apr_n"] for c in self.ordered), 47)
        self.assertEqual(sum(c["beneficiarios_ssr_apr_doh"] for c in self.ordered), 28833)
        self.assertEqual(sum(c["cobertura_ssr_apr_familias"] for c in self.ordered), 9185)
        self.assertEqual(int(self.by_ine["11203"]["cobertura_ssr_apr_familias"]), 551)

        for c in self.ordered:
            self.assertLess(
                c["cobertura_ssr_apr_familias"],
                c["hogares_censo_2024"],
                f"Familias SSR exceden hogares Censo 2024 en {c['nombre']}",
            )
            self.assertGreater(c["beneficiarios_ssr_apr_doh"], c["cobertura_ssr_apr_familias"])

        lex_by_id = {v["id"]: v for v in self.lexicon["variables"]}
        self.assertNotIn("isAliasOf", lex_by_id["beneficiarios_ssr_apr_doh"])

    def test_05_educacion_slep_mineduc_y_sies_2026(self):
        """86 colegios (55 SLEP + 31 part./CAD), 22.087 alumnos, Tortel 1 escuela/0 liceos y 2.924 SIES 2026."""
        self.assertEqual(sum(c["establecimientos_escolares_n"] for c in self.ordered), 86)
        self.assertEqual(sum(c["establecimientos_slep_aysen"] for c in self.ordered), 55)
        self.assertEqual(sum(c["matricula_escolar"] for c in self.ordered), 22087)
        self.assertEqual(sum(c["matricula_slep_aysen_n"] for c in self.ordered), 8939)
        self.assertEqual(sum(c["matricula_educacion_superior_sies_n"] for c in self.ordered), 2924)
        self.assertEqual(self.by_ine["11101"]["matricula_educacion_superior_sies_n"], 2187)
        self.assertEqual(self.by_ine["11201"]["matricula_educacion_superior_sies_n"], 737)

        self.assertEqual(self.by_ine["11303"]["establecimientos_escolares_n"], 1)
        self.assertEqual(self.by_ine["11303"]["escuelas_rurales_multigrado_n"], 1)
        self.assertEqual(self.by_ine["11303"]["liceos_urbanos_n"], 0)

        tortel_sys05 = next(c for c in self.sys05["por_comuna"] if c["comuna_ine"] == "11303")
        self.assertFalse(tortel_sys05["datos"]["educacion_mineduc"]["tiene_educacion_media_completa"])

        n25 = self.nodos[25]
        ds0 = n25["chartSpec"]["datasets"][0]["data"]
        ds1 = n25["chartSpec"]["datasets"][1]["data"]
        self.assertEqual([a + b for a, b in zip(ds0, ds1)], [c["establecimientos_escolares_n"] for c in self.ordered])

        ed_reg = self.sys05["resumen_regional"]["educacion_publica_slep_aysen"]
        self.assertAlmostEqual(float(ed_reg["paes_admision_2026"]["m1"]), 627.4, places=1)
        self.assertAlmostEqual(float(ed_reg["paes_admision_2026"]["lectora"]), 600.2, places=1)

    def test_06_seguridad_cead_vif_sin_multiplos_sinteticos(self):
        """Tasas CEAD DMCS y VIF oficiales con decimales verificados y cero multiplos redondos sinteticos."""
        banned = {420.0, 1120.0, 890.0, 1340.0, 910.0, 1280.0, 650.0, 510.0, 385.0, 620.0, 540.0, 710.0, 480.0, 690.0, 410.0, 390.0}
        dmcs = [float(c["tasa_dmcs_100k"]) for c in self.ordered]
        vif = [float(c["tasa_vif_100k"]) for c in self.ordered]
        self.assertEqual(set(dmcs) & banned, set())
        self.assertEqual(set(vif) & banned, set())
        self.assertEqual(dmcs, [1702.0, 1422.3, 1197.6, 1754.1, 1862.2, 1743.2, 1695.5, 748.5, 1481.5, 1202.7])
        self.assertEqual(vif, [730.1, 548.2, 1157.9, 749.3, 496.6, 755.4, 552.9, 773.1, 740.7, 687.3])

        cead_reg = self.sys05["resumen_regional"]["seguridad_cead_2023_2025"]
        self.assertAlmostEqual(float(cead_reg["vif_regional_serie_100k"]["2023"]["aysen"]), 691.6, places=1)
        self.assertAlmostEqual(float(cead_reg["vif_regional_serie_100k"]["2024"]["aysen"]), 809.9, places=1)
        self.assertAlmostEqual(float(cead_reg["vif_regional_serie_100k"]["2025"]["aysen"]), 709.9, places=1)

    def test_07_wiki_hub06_y_consultor_omniroute_sincronizados(self):
        """Wiki Hub VI corregida (57.823/23.170, 47 SSR) y respuestas deterministas OmniRoute sincronizadas."""
        self.assertIn("57.823", self.hub06_wiki)
        self.assertIn("23.170", self.hub06_wiki)
        self.assertNotIn("61.210", self.hub06_wiki)
        self.assertNotIn("25.009", self.hub06_wiki)
        self.assertNotIn("43 Sistemas Sanitarios Rurales", self.hub06_wiki)

        node_script = """
        const fs = require('fs');
        const assert = require('assert');
        global.window = {};
        eval(fs.readFileSync('data/aysen_hubs_data.js', 'utf8'));
        const lex = JSON.parse(fs.readFileSync('data/nl_lexicon_aysen.json', 'utf8'));
        eval(fs.readFileSync('js/nl2chart_engine.js', 'utf8'));
        eval(fs.readFileSync('js/omniroute_client.js', 'utf8'));
        const cli = global.window.OmniRouteClient;
        cli.init(global.window.AYSEN_HUBS_DATA, lex);

        (async () => {
          const rViv = await cli.query('Cual es el deficit habitacional cuantitativo y cualitativo MINVU y cierre del PEH en Aysen?');
          assert(rViv.reply.includes('1.927') && rViv.reply.includes('1.671') && !rViv.reply.includes('3.147'), rViv.reply);

          const rSsr = await cli.query('Cuantos comites de agua potable rural SSR APR y familias existen en Aysen?');
          assert(rSsr.reply.includes('47') && rSsr.reply.includes('28.833') && rSsr.reply.includes('9.185'), rSsr.reply);

          const rSlep = await cli.query('Como opera el SLEP Aysen y cual es la matricula de educacion superior SIES 2026?');
          assert(rSlep.reply.includes('2.924') && rSlep.reply.includes('86') && !rSlep.reply.includes('2.327'), rSlep.reply);
          console.log('HUB6_SYNC_OK');
        })().catch(e => { console.error(e); process.exit(1); });
        """
        proc = subprocess.run(["node", "-e", node_script], cwd=ROOT, capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(proc.returncode, 0, f"Fallo en OmniRoute Hub VI:\n{proc.stderr}\n{proc.stdout}")
        self.assertIn("HUB6_SYNC_OK", proc.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
