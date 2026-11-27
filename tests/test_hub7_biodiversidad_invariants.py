#!/usr/bin/env python3
"""Suite de invariantes forenses Sprint 10 para el Hub VII (Biodiversidad, Criósfera, Aire, Hidrología, Volcanismo) y Wiki/SIES."""

import json
import re
import unittest
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_bundle():
    text = (ROOT / "data" / "aysen_hubs_data.js").read_text(encoding="utf-8")
    prefix = "window.AYSEN_HUBS_DATA = "
    idx = text.find(prefix)
    assert idx >= 0, "Falta window.AYSEN_HUBS_DATA = "
    body = text[idx + len(prefix):].strip()
    if body.endswith(";"):
        body = body[:-1].strip()
    return json.loads(body)


class TestHub7BiodiversidadInvariants(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle["comunas"]
        cls.by_ine = {str(c["comuna_ine"]): c for c in cls.comunas}
        cls.nodos = {int(n["id"]): n for n in cls.bundle["nodos"] if n.get("id") is not None}
        cls.wp07 = json.loads((ROOT / "data" / "systemic" / "07_biodiversidad_flora_fauna_aysen.json").read_text(encoding="utf-8"))
        cls.sinca_dga = json.loads((ROOT / "data" / "raw" / "biodiversidad_mma_conaf" / "sinca_mma_dga_series_ambientales_aysen.json").read_text(encoding="utf-8"))
        cls.rnvv = json.loads((ROOT / "data" / "raw" / "social_ambiental" / "sernageomin_rnvv_volcanes_aysen.json").read_text(encoding="utf-8"))
        cls.estaciones = json.loads((ROOT / "data" / "estaciones_aysen.json").read_text(encoding="utf-8"))
        cls.auto_status = json.loads((ROOT / "data" / "systemic" / "auto_update_status.json").read_text(encoding="utf-8"))
        cls.provenance = json.loads((ROOT / "data" / "systemic" / "provenance_catalog.json").read_text(encoding="utf-8"))

    def test_a_conaf_2026_cuatro_tipos_forestales(self):
        self.assertAlmostEqual(sum(c["bosque_nativo_ha"] for c in self.comunas), 5152384.3, places=1)
        c26 = self.wp07["resumen_regional"]["catastro_vegetacional_conaf_2026"]
        self.assertAlmostEqual(c26["superficie_catastrada_ha"], 10667211.5, places=1)
        self.assertAlmostEqual(c26["subuso_bosques_total_ha"], 5189923.8, places=1)
        self.assertAlmostEqual(c26["bosque_nativo_ha"], 5152384.3, places=1)
        tipos = c26["tipos_forestales_bosque_nativo_ha"]
        self.assertAlmostEqual(tipos["coihue_de_magallanes"], 882420.0, places=1)
        self.assertAlmostEqual(sum(tipos.values()), 5152384.3, places=1)

        n27 = self.nodos[27]
        labels_joined = " | ".join(n27["chartSpec"]["labels"])
        self.assertRegex(labels_joined, re.compile(r"Coihue de Magallanes", re.I))
        self.assertRegex(labels_joined, re.compile(r"Siempreverde", re.I))
        self.assertRegex(labels_joined, re.compile(r"Lenga", re.I))
        self.assertRegex(labels_joined, re.compile(r"Cipr", re.I))
        data4 = n27["chartSpec"]["datasets"][0]["data"][:4]
        self.assertAlmostEqual(sum(data4), 5152384.3, places=1)
        self.assertIn(882420.0, data4)

    def test_b_criosfera_ipg_2022_dga(self):
        self.assertAlmostEqual(sum(c["superficie_glaciar_km2"] for c in self.comunas), 8721.6, places=1)
        self.assertAlmostEqual(sum(c["superficie_glaciares_km2"] for c in self.comunas), 8721.6, places=1)
        self.assertEqual(sum(c["glaciares_dga_n"] for c in self.comunas), 10301)
        self.assertEqual(self.by_ine["11303"]["superficie_glaciar_km2"], 3485.4)
        self.assertEqual(self.by_ine["11302"]["superficie_glaciar_km2"], 2284.2)
        self.assertEqual(self.by_ine["11203"]["glaciares_dga_n"], 0)
        crio = self.wp07["resumen_regional"]["criosfera_ipg_2022_dga"]
        self.assertEqual(crio["glaciares_n"], 10301)
        self.assertAlmostEqual(crio["superficie_glaciar_km2"], 8721.6, places=1)

    def test_c_fauna_rce_20_proceso_y_eei_sat_castor(self):
        rce = self.wp07["resumen_regional"]["fauna_conservacion_rce"]
        self.assertEqual(rce["taxones_nativos_nomina_aysen"], 154)
        self.assertEqual(rce["especies_amenaza_directa_cr_en_vu"], 64)
        huemul_vals = [
            row["fauna_conservacion_conaf_mma"]["poblacion_estimada_huemul_regional"]
            for row in self.sinca_dga["series_ambientales_regionales"]
        ]
        self.assertTrue(all(750 <= v <= 1000 for v in huemul_vals), f"Huemul fuera de 750-1000: {huemul_vals}")

        castor_presentes = [
            c["nombre_comuna"] for c in self.wp07["por_comuna"]
            if c["datos"]["especies_exoticas_invasoras"]["castor_canadiense"]["presente"]
        ]
        self.assertEqual(castor_presentes, [])

        n29 = self.nodos[29]
        self.assertEqual(n29["chartSpec"]["datasets"][0]["data"][5], 0)
        jabali = next(e for e in self.wp07["catastro_especies_exoticas_invasoras"] if "jabal" in e["nombre_comun"].lower())
        jabali_txt = " ".join(jabali["cuencas_y_comunas_afectadas"]) + " " + jabali["programas_control_activos_sag_mma"]
        self.assertRegex(jabali_txt, re.compile(r"Ib[aá][nñ]ez|Cerro Castillo", re.I))
        didymo = next(e for e in self.wp07["catastro_especies_exoticas_invasoras"] if "didymo" in e["nombre_comun"].lower())
        didymo_txt = " ".join(didymo["cuencas_y_comunas_afectadas"]) + " " + didymo["programas_control_activos_sag_mma"]
        for cu in ("110", "111", "113", "114", "115", "117"):
            self.assertIn(cu, didymo_txt)

    def test_d_sinca_emrp_exclusivo_coyhaique_y_aysen(self):
        coy = self.by_ine["11101"]
        ays = self.by_ine["11201"]
        self.assertEqual(coy["estaciones_sinca_emrp_n"], 2)
        self.assertEqual(coy["episodios_gec_mp25_anual"], 97)
        self.assertEqual(coy["episodios_gec_mp25_2024"], 87)
        self.assertEqual(coy["dias_sobre_norma_mp25"], 87)
        self.assertEqual(ays["estaciones_sinca_emrp_n"], 1)
        self.assertEqual(ays["dias_sobre_norma_mp25"], 16)
        self.assertEqual(ays["episodios_gec_mp25_anual"], 16)

        for ine, c in self.by_ine.items():
            if ine in ("11101", "11201"):
                continue
            self.assertEqual(c["estaciones_sinca_emrp_n"], 0, ine)
            self.assertIsNone(c["dias_sobre_norma_mp25"], ine)
            self.assertIsNone(c["episodios_gec_mp25_anual"], ine)
            self.assertIsNone(c["episodios_gec_mp25_2024"], ine)

    def test_e_hidrograma_baker_dga_sin_futuro_y_8_conectores(self):
        n30 = self.nodos[30]
        baker_data = n30["chartSpec"]["datasets"][1]["data"]
        self.assertEqual(len(baker_data), 12)
        self.assertEqual(baker_data[1], 675)
        self.assertEqual(max(baker_data), 675)
        self.assertEqual(baker_data[7], 395)
        self.assertEqual(min(baker_data), 395)
        self.assertFalse(any("2026-12" in str(r[0]) for r in n30["tableRows"]))

        est_list = self.estaciones["estaciones"] if isinstance(self.estaciones, dict) else self.estaciones
        est1 = next(e for e in est_list if e["id"] == 1)
        self.assertIn("11530000-8", est1.get("codigo_estacion") or est1.get("codigo", ""))
        now_ym = datetime.now(timezone.utc).strftime("%Y-%m")
        serie = est1.get("serie_temporal") or est1.get("serie", [])
        vals = [p["valor"] for p in serie]
        self.assertEqual(max(vals), 675)
        self.assertEqual(min(vals), 395)
        max_pt = max(serie, key=lambda p: p["valor"])
        min_pt = min(serie, key=lambda p: p["valor"])
        self.assertTrue(max_pt["periodo_mes"].endswith("-02"))
        self.assertTrue(min_pt["periodo_mes"].endswith("-08"))
        self.assertTrue(all(p["fecha"][:7] <= now_ym for p in serie))

        mapa_html = (ROOT / "mapa_territorial.html").read_text(encoding="utf-8")
        m = re.search(r"11530000-8[\s\S]{0,600}?chartData:\s*\[([^\]]+)\]", mapa_html)
        self.assertIsNotNone(m)
        mapa_vals = [float(x.strip()) for x in m.group(1).split(",")]
        self.assertEqual(mapa_vals[1], 675)
        self.assertEqual(mapa_vals[7], 395)

        self.assertEqual(self.auto_status["activeApiConnectors"], 8)
        self.assertEqual(self.bundle["meta"]["autoUpdate"]["activeApiConnectors"], 8)
        self.assertTrue(any(c.get("key") == "dga_hidrologia" for c in self.auto_status["connectors"]))
        n30_prov = next(n for n in self.provenance["nodes"] if n["id"] == 30)["provenance"]
        self.assertIn("dga_hidrologia", n30_prov.get("activeConnectors", []))

    def test_f_volcanismo_rnvv_5_hudson_12_y_wiki_nodo36_sies(self):
        volcs = self.rnvv["volcanes_activos_aysen"]
        self.assertEqual(len(volcs), 5)
        hudson = next(v for v in volcs if "hudson" in v["id"].lower())
        self.assertEqual(hudson["ranking_riesgo_sernageomin"], 12)
        self.assertIn("Categoría I", hudson.get("categoria_riesgo_rnvv", ""))
        self.assertFalse(any("arenales" in v["id"].lower() for v in volcs))
        excl_txt = self.rnvv.get("excluidos_sin_erupcion_holocena_confirmada", [{}])[0].get("nombre", "")
        self.assertIn("Arenales", excl_txt)

        volc_layer = self.bundle["spatialNodesByLayer"]["volcanes_sismos"]
        self.assertEqual(len(volc_layer), 41)
        hudson_node = next(n for n in volc_layer if "hudson" in str(n.get("id", "")).lower())
        self.assertGreater(hudson_node["magnitudeValue"], 0)

        n36_md = (ROOT / "wiki" / "nodos" / "nodo_36.md").read_text(encoding="utf-8")
        self.assertIn("2.924", n36_md)
        self.assertNotIn("2.327", n36_md)


if __name__ == "__main__":
    unittest.main(verbosity=2)
