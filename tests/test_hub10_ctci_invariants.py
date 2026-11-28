#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_hub10_ctci_invariants.py
=============================================================================
Suite de invariantes forenses Sprint 13 — Hub X (CTCi, Ciencia, Tecnologia,
Conocimiento e Innovacion: 16 Centros, 124 Investigadores, 179 Proyectos
[120 ANID + 59 CORFO], FIUT UAysen $10.484M, PATSER CIEP, Catastro NCA 2026
$1.683,1M, SIES 2.924, CDPR CORFO 2024-2026, Plan Aysen Azul, FIA, INAPI 252,
SEREMI Ciencia Aysen y Barometro N=465 con semaforo muestral).
CERO EMOJIS.
=============================================================================
"""

import json
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parent.parent
CUT_ORDER = ["11101", "11102", "11201", "11202", "11203", "11401", "11402", "11301", "11302", "11303"]

BUNDLE_PATH = ROOT / "data" / "aysen_hubs_data.js"
WP10_PATH = ROOT / "data" / "systemic" / "10_ctci_innovacion.json"
WP11_SCRIPT_PATH = ROOT / "scripts" / "ingesta" / "wp_11_ctci_anid_corfo.py"
CECAN_PATH = ROOT / "data" / "cecan_16_presets_aysen.json"
CRUCES_PATH = ROOT / "data" / "cruces_multivariables.json"
WIKI_HUB10_PATH = ROOT / "wiki" / "hubs" / "hub_10_ctci.md"
WIKI_N35_PATH = ROOT / "wiki" / "nodos" / "nodo_35.md"
WIKI_N36_PATH = ROOT / "wiki" / "nodos" / "nodo_36.md"
WIKI_N37_PATH = ROOT / "wiki" / "nodos" / "nodo_37.md"
WIKI_CONCEPT_PATH = ROOT / "wiki" / "conceptos" / "ecosistema_ctci_ciencia.md"


def load_bundle():
    raw = BUNDLE_PATH.read_text(encoding="utf-8")
    marker = "window.AYSEN_HUBS_DATA = "
    idx = raw.index(marker)
    payload = raw[idx + len(marker):].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


class TestHub10CtciInvariants(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle.get("comunas", [])
        cls.by_ine = {str(c["comuna_ine"]): c for c in cls.comunas}
        cls.ordered = [cls.by_ine[k] for k in CUT_ORDER]
        cls.nodos = {n["id"]: n for n in cls.bundle.get("nodos", [])}
        cls.wp10 = json.loads(WP10_PATH.read_text(encoding="utf-8"))
        cls.wp10_by_ine = {str(c["comuna_ine"]): c for c in cls.wp10["por_comuna"]}
        cls.wp11_script = WP11_SCRIPT_PATH.read_text(encoding="utf-8")
        cls.cecan = json.loads(CECAN_PATH.read_text(encoding="utf-8"))
        cls.cruces = json.loads(CRUCES_PATH.read_text(encoding="utf-8"))
        cls.wiki_hub10 = WIKI_HUB10_PATH.read_text(encoding="utf-8")
        cls.wiki_n35 = WIKI_N35_PATH.read_text(encoding="utf-8")
        cls.wiki_n36 = WIKI_N36_PATH.read_text(encoding="utf-8")
        cls.wiki_n37 = WIKI_N37_PATH.read_text(encoding="utf-8")
        cls.wiki_concept = WIKI_CONCEPT_PATH.read_text(encoding="utf-8")

    def test_01_cuadratura_16_centros_124_investigadores_179_proyectos_y_censo_2024(self):
        exp_pop = [57823, 882, 23170, 5335, 1598, 4950, 2671, 3492, 664, 563]
        exp_centros = [6, 1, 2, 1, 1, 1, 1, 1, 1, 1]
        exp_inv = [91, 1, 14, 4, 2, 3, 2, 3, 1, 3]
        exp_ctci = [102, 2, 31, 11, 4, 8, 5, 7, 3, 6]
        exp_anid = [74, 1, 17, 6, 3, 4, 4, 4, 2, 5]
        exp_anid_loc = [48, 0, 8, 3, 1, 2, 1, 2, 0, 3]
        exp_anid_ext = [26, 1, 9, 3, 2, 2, 3, 2, 2, 2]
        exp_corfo = [28, 1, 14, 5, 1, 4, 1, 3, 1, 1]

        self.assertEqual([self.wp10_by_ine[k]["poblacion_censo_2024"] for k in CUT_ORDER], exp_pop)
        self.assertEqual(sum(exp_pop), 101148)
        self.assertEqual(self.wp10["resumen_regional"]["poblacion_censo_2024_consolidado_ine"], 100745)

        self.assertEqual([self.wp10_by_ine[k]["datos"]["centros_y_estaciones_ctci_count"] for k in CUT_ORDER], exp_centros)
        self.assertEqual([c["centros_y_estaciones_ctci_count"] for c in self.ordered], exp_centros)
        self.assertEqual([self.wp10_by_ine[k]["datos"]["investigadores_residentes_est"] for k in CUT_ORDER], exp_inv)
        self.assertEqual([c["investigadores_residentes"] for c in self.ordered], exp_inv)
        self.assertEqual([c["total_proyectos_ctci"] for c in self.ordered], exp_ctci)
        self.assertEqual([c["proyectos_anid_n"] for c in self.ordered], exp_anid)
        self.assertEqual([c["proyectos_anid_locales_count"] for c in self.ordered], exp_anid_loc)
        self.assertEqual([c["proyectos_anid_extrarregionales_count"] for c in self.ordered], exp_anid_ext)
        self.assertEqual([c["proyectos_corfo_innova_count"] for c in self.ordered], exp_corfo)

        nodos_disk = self.wp10["nodos_georreferenciados"]
        self.assertEqual(len(nodos_disk), 16)
        self.assertEqual(sum(n["investigadores_radicados"] for n in nodos_disk), 124)
        self.assertIn("CTCI-NOD-16", {n["id"] for n in nodos_disk})
        self.assertIn("CTCI-NOD-16", self.wp11_script)
        for p in exp_pop:
            self.assertIn(str(p), self.wp11_script)

        hub_ctci = next(h for h in self.bundle["hubs"] if h["id"] == "ctci")
        self.assertIn("16 centros", hub_ctci["description"])
        self.assertNotIn("15 centros", hub_ctci["description"])

    def test_02_hitos_anid_fiut_patser_fondap_y_catastro_equipamiento_nca_2026(self):
        rr = self.wp10["resumen_regional"]
        hitos = rr["hitos_anid_minciencia_2025_2026"]
        self.assertAlmostEqual(hitos["fiut_etapa2_uaysen_2025_2035"]["monto_total_10_anos_mclp"], 10484.0, places=1)
        self.assertAlmostEqual(hitos["ciep_patser_y_basal_gore"]["monto_patser_2020_2025_mclp"], 2750.0, places=1)
        self.assertAlmostEqual(hitos["ciep_patser_y_basal_gore"]["presupuesto_basal_gore_2026_mclp"], 1599.0, places=1)
        self.assertIn("2026-2031", hitos["centros_fondap_interes_nacional_en_aysen"]["copas_coastal_udec"])

        nca = rr["catastro_equipamiento_critico_nca_2026"]
        self.assertEqual(nca["proyectos_fondequip_adjudicados_aysen"], 6)
        self.assertEqual(nca["equipos_criticos_residentes_aysen_count"], 9)
        self.assertEqual(nca["monto_total_equipos_criticos_residentes_aysen_clp"], 1683057705)
        self.assertEqual(nca["por_institucion_residente"]["uaysen"]["monto_clp"], 1295862096)
        self.assertEqual(nca["por_institucion_residente"]["ciep"]["monto_clp"], 330346929)
        self.assertEqual(nca["por_institucion_residente"]["inia_tamel_aike"]["monto_clp"], 56848680)
        self.assertEqual(sum(e["costo_clp"] for e in nca["equipos_residentes_detalle"]), 1683057705)
        self.assertEqual(len(nca["equipos_extrarregionales_instalados_en_aysen"]), 2)

    def test_03_reconciliacion_sies_2026_2924_nomina_ciep_melimoyu_exploradores_y_ct07(self):
        sies = self.wp10["resumen_regional"]["matricula_educacion_superior_sies"]
        self.assertEqual(sies["matricula_total_regional"], 2924)
        self.assertEqual(sies["matricula_pregrado_regional"] + sies["matricula_postgrado_regional"], 2924)
        self.assertEqual(sies["inacap_sede_coyhaique_estudiantes"], 1187)
        self.assertEqual(sies["universidad_de_aysen_estudiantes"], 1000)
        self.assertEqual(sies["cft_estatal_aysen_estudiantes"], 737)
        self.assertEqual([c["matricula_educacion_superior_sies_n"] for c in self.ordered], [2187, 0, 737, 0, 0, 0, 0, 0, 0, 0])

        ct07 = next(p for p in self.cecan["strategic_extra_presets"]["ctci"] if p["preset_id"] == "CT_07")
        ct07_blob = json.dumps(ct07, ensure_ascii=False)
        self.assertIn("2.924", ct07_blob)
        self.assertNotIn("2.327", ct07_blob)

        nodos_by_id = {n["id"]: n for n in self.wp10["nodos_georreferenciados"]}
        self.assertIn("47 personas", nodos_by_id["CTCI-NOD-01"]["vocacion_cientifica"])
        self.assertIn("Banco de Recursos Zoogenéticos", nodos_by_id["CTCI-NOD-03"]["vocacion_cientifica"])
        self.assertIn("Melimoyu", nodos_by_id["CTCI-NOD-07"]["nombre"])
        self.assertIn("Huinay", nodos_by_id["CTCI-NOD-07"]["vocacion_cientifica"])
        self.assertIn("08-10-2024", nodos_by_id["CTCI-NOD-08"]["vocacion_cientifica"])
        self.assertIn("Cerro Castillo", nodos_by_id["CTCI-NOD-09"]["nombre"])
        self.assertIn("11201", nodos_by_id["CTCI-NOD-09"]["vocacion_cientifica"])

    def test_04_financiamiento_descentralizado_cdpr_aysen_azul_fia_inapi_y_seremi_ciencia(self):
        rr = self.wp10["resumen_regional"]
        fin = rr["financiamiento_descentralizado_ctci"]
        cdpr = fin["cdpr_corfo_aysen"]
        self.assertAlmostEqual(cdpr["monto_ejecutado_2024_mclp"], 1930.0, places=1)
        self.assertAlmostEqual(cdpr["monto_ejecutado_2025_corfo_mclp"], 1885.0, places=1)
        self.assertAlmostEqual(cdpr["presupuesto_2026_mclp"], 2534.0, places=1)
        self.assertAlmostEqual(fin["plan_aysen_azul_transforma_litoral_2026"]["inversion_publico_privada_mclp"], 7500.0, places=1)
        self.assertEqual(fin["fia_innovacion_agraria"]["cerezos_chile_chico_ha"], 244)
        self.assertEqual(fin["fia_innovacion_agraria"]["cerezos_exportacion_ton"], 660)

        gob = rr["gobernanza_e_innovacion_regional_2024_2026"]
        self.assertIn("Gabriel Pérez Aros", gob["seremi_ciencia_aysen"]["seremi_titular_2026"])
        self.assertEqual(gob["propiedad_industrial_inapi_2026"]["marcas_residentes_2025"], 252)
        self.assertAlmostEqual(gob["propiedad_industrial_inapi_2026"]["crecimiento_anual_pct"], 63.0, places=1)

    def test_05_semaforo_barometro_ct05_ct06_y_limpieza_wiki_hub10(self):
        rr = self.wp10["resumen_regional"]
        self.assertAlmostEqual(rr["evaluacion_uaysen_promedio_regional_i8"], 5.08, places=2)
        self.assertAlmostEqual(rr["evaluacion_uaysen_media_muestral_n423_i8"], 4.98, places=2)
        self.assertAlmostEqual(rr["conocimiento_uaysen_pct_regional_i5"], 84.3, places=1)
        self.assertAlmostEqual(rr["aporte_universidades_pct_regional_f4g"], 66.4, places=1)

        for ine in CUT_ORDER:
            expected_sem = "verde" if ine in ("11101", "11201") else "rojo_baja_precision_n_menor_30"
            self.assertEqual(self.wp10_by_ine[ine]["datos"]["semaforo_muestral_barometro"], expected_sem)

        ct05 = next(p for p in self.cecan["extension_gallery"]["ctci_innovacion"]["presets"] if p["preset_id"] == "CT_05")
        ct06 = next(p for p in self.cecan["strategic_extra_presets"]["ctci"] if p["preset_id"] == "CT_06")
        self.assertIn("rojo_baja_precision_n_menor_30", ct05["what_it_shows"])
        self.assertIn("rojo_baja_precision_n_menor_30", ct06["what_it_shows"])
        ct05_cr = next(p for p in self.cruces["extension_gallery"]["ctci_innovacion"]["presets"] if p["preset_id"] == "CT_05")
        self.assertEqual(ct05_cr["config"]["mirror_series"]["structural_by_macrozona"], {"norte": 6.0, "centro": 106.0, "sur": 12.0})

        combined_wiki = "\n".join([self.wiki_hub10, self.wiki_n35, self.wiki_n36, self.wiki_n37, self.wiki_concept])
        self.assertNotIn("2.327", combined_wiki)
        self.assertNotIn("15 centros y estaciones", combined_wiki)
        self.assertNotRegex(combined_wiki, re.compile(r"179\s+proyectos\s+de\s+investigaci[oó]n\s+\(17\.326", re.I))
        for kw in ["FIUT", "10.484", "1.683", "FONDEQUIP", "2.924", "2.534", "7.500", "252", "Gabriel Pérez Aros"]:
            self.assertIn(kw, combined_wiki)


if __name__ == "__main__":
    unittest.main()
