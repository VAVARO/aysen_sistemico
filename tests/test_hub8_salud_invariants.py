#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_hub8_salud_invariants.py
=============================================================================
Suite de invariantes forenses Sprint 11 — Hub VIII (Salud APS, Red SSA,
SIGTE T3 2026, Aeroevacuaciones SAMU, Epidemiologia DEIS y cierre Sprint 10).
CERO EMOJIS.
=============================================================================
"""

import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUNDLE_PATH = ROOT / "data" / "aysen_hubs_data.js"
WP08_PATH = ROOT / "data" / "systemic" / "08_desagregaciones_sectoriales_aysen.json"
WP05_PATH = ROOT / "data" / "systemic" / "05_social_salud_educacion_riesgos.json"
MINSAL_DET_PATH = ROOT / "data" / "raw" / "informes_territoriales" / "salud_determinantes_sociales_minsal.json"
ESTACIONES_PATH = ROOT / "data" / "estaciones_aysen.json"
WIKI_HUB8_PATH = ROOT / "wiki" / "hubs" / "hub_08_salud.md"


def load_bundle():
    raw = BUNDLE_PATH.read_text(encoding="utf-8")
    marker = "window.AYSEN_HUBS_DATA = "
    idx = raw.index(marker)
    payload = raw[idx + len(marker):].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


class TestHub8SaludInvariants(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle.get("comunas", [])
        cls.by_ine = {str(c["comuna_ine"]): c for c in cls.comunas}
        cls.wp08 = json.loads(WP08_PATH.read_text(encoding="utf-8"))
        cls.wp05 = json.loads(WP05_PATH.read_text(encoding="utf-8"))
        cls.minsal_det = json.loads(MINSAL_DET_PATH.read_text(encoding="utf-8"))
        cls.estaciones = json.loads(ESTACIONES_PATH.read_text(encoding="utf-8"))
        cls.wiki_hub8 = WIKI_HUB8_PATH.read_text(encoding="utf-8")

    def test_01_red_hospitalaria_213_camas_8_pabellones_y_nombre_chile_chico(self):
        expected_camas = {
            "11101": 135, "11102": 0, "11201": 56, "11202": 8, "11203": 0,
            "11401": 7, "11402": 0, "11301": 7, "11302": 0, "11303": 0,
        }
        self.assertEqual(sum(c["camas_hospitalarias"] for c in self.comunas), 213)
        for ine, exp in expected_camas.items():
            self.assertEqual(self.by_ine[ine]["camas_hospitalarias"], exp)

        wp08_by_ine = {str(c["comuna_ine"]): c["datos"]["salud_diferenciada"] for c in self.wp08["por_comuna"]}
        self.assertEqual(wp08_by_ine["11101"]["red_hospitalaria"]["quirofanos_totales"], 4)
        self.assertEqual(wp08_by_ine["11101"]["red_hospitalaria"]["sillones_hemodialisis"], 18)
        self.assertEqual(wp08_by_ine["11101"]["red_hospitalaria"]["camas_con_ampliacion_upc_pediatrica_jun2026"], 141)
        total_pab = sum(v["red_hospitalaria"]["quirofanos_totales"] for v in wp08_by_ine.values())
        self.assertEqual(total_pab, 8)

        # Erradicacion total de "San Jose" en Chile Chico y presencia del nombre oficial DEIS
        chile_chico_hosp = wp08_by_ine["11401"]["red_hospitalaria"]["establecimiento_hospitalario"]
        self.assertIn("Leopoldo Ortega", chile_chico_hosp)
        self.assertNotIn("San José", chile_chico_hosp)
        self.assertNotIn("San Jose", chile_chico_hosp)

        gob_salud = self.bundle.get("gob_salud_sistema") or self.wp08["resumen_regional"].get("gob_salud_sistema", {})
        self.assertIn("0%", str(gob_salud.get("dependencia_aps_y_hospitalaria", "")))
        self.assertEqual(gob_salud.get("clinicas_privadas_hospitalizacion_general"), 0)
        self.assertEqual(gob_salud.get("convenio_programacion_gore_minsal", {}).get("monto_total_mm_clp"), 195000)

    def test_02_catastro_aps_deis_27_psr_4_cesfam_4_cecosf_9_emr_2_cosam(self):
        expected_psr = {
            "11101": 7, "11102": 3, "11201": 2, "11202": 4, "11203": 1,
            "11301": 0, "11302": 1, "11303": 1, "11401": 3, "11402": 5,
        }
        self.assertEqual(sum(c["postas_rurales_psr_n"] for c in self.comunas), 27)
        self.assertEqual(sum(c["postas_salud_rural"] for c in self.comunas), 27)
        for ine, exp in expected_psr.items():
            self.assertEqual(self.by_ine[ine]["postas_rurales_psr_n"], exp)
            self.assertEqual(self.by_ine[ine]["postas_salud_rural"], exp)

        s_res = self.wp08["resumen_regional"]["salud_resumen"]
        self.assertEqual(s_res["total_cesfam"], 4)
        self.assertEqual(s_res["total_cecosf"], 4)
        self.assertEqual(s_res["total_emr_ssa"], 9)
        self.assertEqual(s_res["total_cosam"], 2)

        wp08_aps = {str(c["comuna_ine"]): c["datos"]["salud_diferenciada"]["atencion_primaria_aps"] for c in self.wp08["por_comuna"]}
        self.assertEqual(sum(a["cesfam_total"] for a in wp08_aps.values()), 4)
        self.assertEqual(wp08_aps["11203"]["cesfam_total"], 0)
        self.assertEqual(wp08_aps["11402"]["cesfam_total"], 0)
        self.assertIn("CESFAM La Junta", " ".join(wp08_aps["11202"]["cesfam_nombres"]))
        self.assertIn("CESFAM Puerto Aysen", " ".join(wp08_aps["11201"]["cesfam_nombres"]))
        self.assertEqual(wp08_aps["11101"]["cecosf_total"], 1)
        self.assertEqual(wp08_aps["11201"]["cecosf_total"], 3)
        self.assertEqual(sum(a["estaciones_medico_rurales_total"] for a in wp08_aps.values()), 9)

    def test_03_listas_espera_sigte_t3_2026(self):
        self.assertEqual(sum(c["espera_no_ges_n"] for c in self.comunas), 14751)
        sig = self.wp08["resumen_regional"]["listas_espera_sigte"]
        self.assertEqual(sig["cne_no_ges_ssa_t3_2026"], 14751)
        self.assertEqual(sig["iq_no_ges_ssa_t3_2026"], 3608)
        self.assertEqual(sig["odontologia_no_ges_ssa_dic2024"], 6870)
        self.assertEqual(sig["retrasos_ges_ssa_t3_2026"], 524)
        self.assertEqual(sig["mediana_espera_cne_dias"], 159)
        self.assertEqual(sig["mediana_espera_quirurgica_dias"], 262)
        self.assertEqual(sig["mediana_espera_odontologica_dias"], 242)
        self.assertEqual(sig["mediana_retraso_ges_dias"], 88)

        cne_meds = [c["mediana_espera_especialidad_dias"] for c in self.comunas]
        iq_meds = [c["mediana_espera_quirurgica_dias"] for c in self.comunas]
        self.assertAlmostEqual(sum(cne_meds) / len(cne_meds), 159.0, places=2)
        self.assertAlmostEqual(sum(iq_meds) / len(iq_meds), 262.0, places=2)

    def test_04_aeroevacuaciones_samu_y_reconciliacion_minsal(self):
        self.assertEqual(sum(c["aeroevacuaciones_samu_n"] for c in self.comunas), 454)
        self.assertEqual(self.by_ine["11101"]["aeroevacuaciones_secundarias_interregionales_n"], 45)
        self.assertEqual(sum(c["aeroevacuaciones_secundarias_interregionales_n"] for c in self.comunas), 45)

        wp05_aero = {str(r["comuna_ine"]): r["datos"]["salud_red_asistencial"]["aeroevacuaciones_samu_anual"] for r in self.wp05["por_comuna"]}
        det_aero = {str(r["comuna_ine"]): r["aeroevacuaciones_samu_anual"] for r in self.minsal_det["por_comuna"]}
        self.assertEqual(sum(wp05_aero.values()), 454)
        self.assertEqual(sum(det_aero.values()), 454)
        for ine, val in wp05_aero.items():
            self.assertEqual(det_aero[ine], val, f"Discrepancia SAMU en {ine}")
            self.assertEqual(self.by_ine[ine]["aeroevacuaciones_samu_n"], val)

    def test_05_epidemiologia_dotacion_barometro_nodo39_y_estaciones(self):
        suic_vals = [c["tasa_mortalidad_suicidio_100k"] for c in self.comunas]
        vesic_vals = [c["tasa_mortalidad_cancer_vesicula_100k"] for c in self.comunas]
        self.assertAlmostEqual(sum(suic_vals) / len(suic_vals), 19.9, places=2)
        self.assertAlmostEqual(sum(vesic_vals) / len(vesic_vals), 18.29, places=2)

        s_res = self.wp08["resumen_regional"]["salud_resumen"]
        self.assertAlmostEqual(s_res["medicos_rnpi_por_mil_hab"], 5.54, places=2)
        self.assertAlmostEqual(s_res["medicos_red_publica_ssa_por_mil_hab"], 1.80, places=2)
        self.assertEqual(s_res["uaysen_carreras_medicina_n"], 0)

        salud_hub = next(h for h in self.bundle["hubs"] if h["id"] == "salud")
        q_codes = [q.get("codigo") for q in (salud_hub.get("espejo_barometro") or {}).get("preguntas", [])]
        self.assertNotIn("B3_B", q_codes)
        self.assertIn("I4_A", q_codes)

        # Nodo #39 debe graficar espera_no_ges_n y aeroevacuaciones SAMU
        nodo39 = next(n for n in self.bundle["nodos"] if n["id"] == 39)
        self.assertEqual(sum(nodo39["chartSpec"]["datasets"][0]["data"]), 14751)
        self.assertEqual(sum(nodo39["chartSpec"]["datasets"][1]["data"]), 454)

        # Cierre residual Sprint 10: cero registros "2026-12" en las 16 estaciones
        self.assertEqual(len(self.estaciones["estaciones"]), 16)
        for st in self.estaciones["estaciones"]:
            months = [r.get("periodo_mes") for r in st.get("serie_temporal", [])]
            self.assertNotIn("2026-12", months, f"Fecha futura 2026-12 detectada en estacion {st.get('id')}")
            self.assertEqual(len(months), 12)

        # Wiki Hub VIII
        self.assertIn("213", self.wiki_hub8)
        self.assertIn("19,9", self.wiki_hub8)
        self.assertIn("14.751", self.wiki_hub8)


if __name__ == "__main__":
    unittest.main(verbosity=2)
