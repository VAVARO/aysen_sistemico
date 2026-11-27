#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_hub9_cultura_invariants.py
=============================================================================
Suite de invariantes forenses Sprint 12 — Hub IX (Cultura, Artes & Patrimonio,
Catastro CMN 16/23, RMC 16/27, MRA 36.173, SNBP 16/31.221, Gasto Censo 2024,
MINCAP 2022-2026, Indigena 29,0%, CONADI 47 SIIC, 25 PCC y Barometro N=465).
CERO EMOJIS.
=============================================================================
"""

import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parent.parent
CUT_ORDER = ["11101", "11102", "11201", "11202", "11203", "11401", "11402", "11301", "11302", "11303"]

BUNDLE_PATH = ROOT / "data" / "aysen_hubs_data.js"
WP09_PATH = ROOT / "data" / "systemic" / "09_cultura_patrimonio.json"
WP05_PATH = ROOT / "data" / "systemic" / "05_social_salud_educacion_riesgos.json"
BARO_PATH = ROOT / "data" / "raw" / "barometro_uaysen" / "barometro_integrado_aysen.json"
LEX_PATH = ROOT / "data" / "nl_lexicon_aysen.json"
WIKI_HUB9_PATH = ROOT / "wiki" / "hubs" / "hub_09_cultura.md"
WIKI_N32_PATH = ROOT / "wiki" / "nodos" / "nodo_32.md"
WIKI_N33_PATH = ROOT / "wiki" / "nodos" / "nodo_33.md"
WIKI_N34_PATH = ROOT / "wiki" / "nodos" / "nodo_34.md"


def load_bundle():
    raw = BUNDLE_PATH.read_text(encoding="utf-8")
    marker = "window.AYSEN_HUBS_DATA = "
    idx = raw.index(marker)
    payload = raw[idx + len(marker):].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


class TestHub9CulturaInvariants(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle.get("comunas", [])
        cls.by_ine = {str(c["comuna_ine"]): c for c in cls.comunas}
        cls.ordered = [cls.by_ine[k] for k in CUT_ORDER]
        cls.nodos = {n["id"]: n for n in cls.bundle.get("nodos", [])}
        cls.wp09 = json.loads(WP09_PATH.read_text(encoding="utf-8"))
        cls.wp05 = json.loads(WP05_PATH.read_text(encoding="utf-8"))
        cls.baro = json.loads(BARO_PATH.read_text(encoding="utf-8"))
        cls.lex = json.loads(LEX_PATH.read_text(encoding="utf-8"))
        cls.wiki_hub9 = WIKI_HUB9_PATH.read_text(encoding="utf-8")
        cls.wiki_n32 = WIKI_N32_PATH.read_text(encoding="utf-8")
        cls.wiki_n33 = WIKI_N33_PATH.read_text(encoding="utf-8")
        cls.wiki_n34 = WIKI_N34_PATH.read_text(encoding="utf-8")

    def test_01_catastro_cmn_16_declaratorias_23_bienes_y_capilla_marmol_rio_ibanez(self):
        expected_cmn = [2, 1, 5, 1, 0, 0, 4, 1, 0, 2]
        expected_bienes = [9, 1, 5, 1, 0, 0, 4, 1, 0, 2]
        self.assertEqual([c["monumentos_nacionales_count"] for c in self.ordered], expected_cmn)
        self.assertEqual(sum(c["monumentos_nacionales_count"] for c in self.ordered), 16)

        wp09_by_ine = {str(c["comuna_ine"]): c["datos"] for c in self.wp09["por_comuna"]}
        self.assertEqual([wp09_by_ine[k]["monumentos_nacionales_bienes_count"] for k in CUT_ORDER], expected_bienes)
        self.assertEqual(sum(wp09_by_ine[k]["monumentos_nacionales_bienes_count"] for k in CUT_ORDER), 23)
        self.assertEqual(self.by_ine["11401"]["monumentos_nacionales_count"], 0)
        self.assertEqual(self.by_ine["11102"]["monumentos_nacionales_count"], 1)
        self.assertEqual(self.by_ine["11202"]["monumentos_nacionales_count"], 1)
        self.assertEqual(self.by_ine["11301"]["monumentos_nacionales_count"], 1)

        marmol = next(n for n in self.wp09["nodos_georreferenciados"] if n["id"] == "CP-NOD-04")
        self.assertEqual(marmol["comuna_ine"], "11402")
        self.assertEqual(marmol["codigo_comuna"], "CL-XI-07")

        cul_spatial = {n["id"]: n for n in self.bundle.get("spatialNodesByLayer", {}).get("museos_cultura", [])}
        self.assertEqual(cul_spatial["cul_CP-NOD-04"]["comuna_ine"], "11402")

    def test_02_catastro_rmc_16_museos_27_red_mra_36173_y_snbp_16_bibliotecas_54_espacios(self):
        expected_rmc = [8, 0, 1, 0, 0, 2, 2, 2, 1, 0]
        expected_red = [9, 0, 1, 1, 1, 4, 6, 3, 2, 0]
        expected_bib = [2, 1, 3, 3, 1, 2, 1, 1, 1, 1]
        expected_tot = [14, 3, 10, 5, 1, 4, 7, 5, 2, 3]

        self.assertEqual([c["museos_count"] for c in self.ordered], expected_rmc)
        self.assertEqual(sum(c["museos_count"] for c in self.ordered), 16)
        self.assertEqual([c["bibliotecas_snbp_n"] for c in self.ordered], expected_bib)
        self.assertEqual([c["bibliotecas_publicas_count"] for c in self.ordered], expected_bib)
        self.assertEqual(sum(c["bibliotecas_snbp_n"] for c in self.ordered), 16)
        self.assertEqual([c["total_espacios_culturales"] for c in self.ordered], expected_tot)
        self.assertEqual(sum(c["total_espacios_culturales"] for c in self.ordered), 54)

        wp09_by_ine = {str(c["comuna_ine"]): c["datos"] for c in self.wp09["por_comuna"]}
        self.assertEqual([wp09_by_ine[k]["museos_red_regional_count"] for k in CUT_ORDER], expected_red)
        self.assertEqual(sum(wp09_by_ine[k]["museos_red_regional_count"] for k in CUT_ORDER), 27)

        res = self.wp09["resumen_regional"]
        self.assertEqual(res["visitas_museo_regional_aysen_2025"], 36173)
        self.assertEqual(res["prestamos_fisicos_snbp_2024"], 31221)
        self.assertEqual(res["socios_activos_snbp_2024"], 7591)
        self.assertEqual(res["sesiones_biblioredes_2024"], 28344)

        cul_spatial = {n["id"]: n for n in self.bundle.get("spatialNodesByLayer", {}).get("museos_cultura", [])}
        self.assertEqual(cul_spatial["cul_CP-NOD-01"]["magnitudeValue"], 36173)
        self.assertEqual(cul_spatial["cul_CP-NOD-06"]["magnitudeValue"], 18199)

    def test_03_gasto_cultural_per_capita_censo_2024_y_fondos_mincap_2022_2026(self):
        expected_gpc = [11850, 43537, 9305, 15445, 25782, 15111, 19693, 17869, 32831, 32860]
        self.assertEqual([c["gasto_cultura_per_capita_clp"] for c in self.ordered], expected_gpc)
        self.assertEqual([c["gasto_cultural_per_capita_clp"] for c in self.ordered], expected_gpc)
        for c in self.ordered:
            calc = round((c["gasto_municipal_cultura_mclp"] * 1_000_000) / c["poblacion_censo_2024"])
            self.assertEqual(c["gasto_cultura_per_capita_clp"], calc)

        par = self.wp09["resumen_regional"]["paradoja_gasto_cultural_rural_urbano"]
        self.assertEqual(par["gasto_per_capita_lago_verde_clp"], 43537)
        self.assertEqual(par["gasto_per_capita_tortel_clp"], 32860)

        fin = self.wp09["resumen_regional"]["financiamiento_cultural_detalle_2022_2026"]
        self.assertEqual(fin["convocatorias_anuales_mincap"]["2024"]["proyectos_seleccionados"], 54)
        self.assertEqual(fin["convocatorias_anuales_mincap"]["2025"]["proyectos_seleccionados"], 57)
        self.assertAlmostEqual(fin["convocatorias_anuales_mincap"]["2025"]["monto_total_mclp"], 1007.0, places=1)
        self.assertEqual(fin["paocc_2025_2026"]["organizaciones_2026"], 5)
        self.assertEqual(fin["red_cultura_2026"]["espacios_comunitarios_jul_2026"], 7)
        self.assertEqual(fin["red_cultura_2026"]["transferencia_municipios_nov_2026_clp"], 61000000)
        self.assertEqual(fin["fndr_8pct_gore_aysen"]["iniciativas_adjudicadas_2025"], 355)

    def test_04_demografia_indigena_censo_2024_conadi_47_siic_y_25_pcc_enpccl_62(self):
        expected_orig = [25.7, 28.2, 34.7, 34.9, 57.9, 26.0, 32.4, 24.5, 28.4, 40.2]
        expected_pcc = [6, 0, 1, 3, 0, 3, 4, 4, 3, 1]
        self.assertEqual([c["pueblos_originarios_pct_censo_2024"] for c in self.ordered], expected_orig)
        self.assertEqual([c["autoidentificacion_indigena_pct"] for c in self.ordered], expected_orig)
        self.assertEqual([c["puntos_cultura_comunitaria_pcc_n"] for c in self.ordered], expected_pcc)
        self.assertEqual(sum(c["puntos_cultura_comunitaria_pcc_n"] for c in self.ordered), 25)

        po = self.wp09["resumen_regional"]["pueblos_originarios"]
        self.assertAlmostEqual(po["autoidentificacion_regional_pct"], 29.0, places=1)
        self.assertEqual(po["poblacion_indigena_censo_2024"], 29230)
        self.assertEqual(po["total_comunidades_conadi_registradas"], 47)
        self.assertEqual(po["familias_comunidades_conadi_siic"], 490)
        self.assertEqual(po["total_organizaciones_indigenas_comunidades_y_asociaciones"], 74)
        self.assertAlmostEqual(self.wp09["resumen_regional"]["participacion_cultural_urbana_enpccl_2024_pct"], 62.0, places=1)

        # Paridad Hub VI (05_social_salud_educacion_riesgos.json)
        wp05_by_ine = {str(c["comuna_ine"]): c["datos"]["demografia_censo_2024"]["pueblos_originarios_pct_censo_2024"] for c in self.wp05["por_comuna"]}
        self.assertEqual([wp05_by_ine[k] for k in CUT_ORDER], expected_orig)

        # Etiquetas isAliasOf en nl_lexicon_aysen.json para 0 colinealidad activa
        lex_by_id = {v["id"]: v for v in self.lex["variables"]}
        self.assertEqual(lex_by_id["autoidentificacion_indigena_pct"].get("isAliasOf"), "pueblos_originarios_pct_censo_2024")
        self.assertEqual(lex_by_id["bibliotecas_publicas_count"].get("isAliasOf"), "bibliotecas_snbp_n")
        self.assertNotIn("isAliasOf", lex_by_id["bibliotecas_snbp_n"])
        self.assertIn("puntos_cultura_comunitaria_pcc_n", lex_by_id)

    def test_05_barometro_b4b_404_semaforo_muestral_y_wiki_hub09_limpia(self):
        self.assertAlmostEqual(self.wp09["resumen_regional"]["nota_percepcion_cultura_microdatos_b4b"], 4.04, places=2)
        self.assertAlmostEqual(self.wp09["resumen_regional"]["tasa_positiva_cultura_b4b_pct"], 40.2, places=1)
        self.assertEqual(self.baro.get("comuna_cut_mapping_version"), "preserved_10_cuts_11101_to_11402")
        self.assertEqual(len(self.baro.get("semaforo_muestral_comunal", {})), 10)

        wp09_by_ine = {str(c["comuna_ine"]): c["datos"] for c in self.wp09["por_comuna"]}
        self.assertEqual(wp09_by_ine["11101"]["semaforo_muestral_barometro"], "verde")
        self.assertEqual(wp09_by_ine["11201"]["semaforo_muestral_barometro"], "verde")
        for rural_cut in ["11102", "11202", "11203", "11401", "11402", "11301", "11302", "11303"]:
            self.assertEqual(wp09_by_ine[rural_cut]["semaforo_muestral_barometro"], "rojo_baja_precision_n_menor_30")

        combined = "\n".join([self.wiki_hub9, self.wiki_n32, self.wiki_n33, self.wiki_n34])
        self.assertNotIn("18 espacios museográficos inscritos en el Registro de Museos de Chile", combined)
        self.assertIn("36.173", combined)
        self.assertIn("47 Comunidades", combined)
        self.assertIn("25", self.wiki_n34)
        self.assertIn("40.2%", self.wiki_n34)


if __name__ == "__main__":
    unittest.main(verbosity=2)
