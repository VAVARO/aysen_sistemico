#!/usr/bin/env python3
"""Suite de invariantes forenses del Hub IV (Gobernanza y Finanzas Municipales) — Sprint 7."""

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_bundle():
    txt = (ROOT / "data" / "aysen_hubs_data.js").read_text(encoding="utf-8")
    idx = txt.index("window.AYSEN_HUBS_DATA = ") + len("window.AYSEN_HUBS_DATA = ")
    return json.loads(txt[idx:].strip().rstrip(";"))


def parse_cl_num(val) -> float:
    s = str(val or "0").strip().replace("$", "").replace("%", "").replace(".", "").replace(",", ".")
    return float(s) if s else 0.0


class TestHub4GobernanzaFinanzasInvariants(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle["comunas"]
        cls.by_ine = {str(c["comuna_ine"]): c for c in cls.comunas}
        cls.by_name = {c["nombre"]: c for c in cls.comunas}
        cls.sys01 = json.loads((ROOT / "data" / "systemic" / "01_gob_poder_finanzas.json").read_text(encoding="utf-8"))
        cls.sys02 = json.loads((ROOT / "data" / "systemic" / "02_energia_combustibles_telecom.json").read_text(encoding="utf-8"))
        cls.wp01_py = (ROOT / "scripts" / "ingesta" / "wp_01_gobernanza_finanzas.py").read_text(encoding="utf-8")
        cls.hub04_wiki = (ROOT / "wiki" / "hubs" / "hub_04_gobernanza.md").read_text(encoding="utf-8")

    def test_01_municipal_budget_fcm_ipp_accounting_consistency(self):
        """SUM(presupuesto_mclp) == 84820.68, 0 comunas con presupuesto <= FCM, Cisnes 48.7% / Tortel 95.4% y IPP/hab exactos."""
        total_pres = round(sum(float(c["presupuesto_mclp"]) for c in self.comunas), 2)
        self.assertAlmostEqual(total_pres, 84820.68, places=2)

        for c in self.comunas:
            ine = str(c["comuna_ine"])
            pres = float(c["presupuesto_mclp"])
            fcm = float(c["fcm_bcn_2025_mclp"])
            ipp = float(c["ipp_bcn_2025_mclp"])
            self.assertGreater(pres, fcm, f"Imposibilidad contable: {c['nombre']} presupuesto {pres} <= FCM {fcm}")
            self.assertGreater(pres, fcm + 0.5 * ipp, f"{c['nombre']} presupuesto no cubre FCM + 0.5*IPP")
            self.assertAlmostEqual(pres, float(c["ingresos_mun_bcn_2025_mclp"]), places=2)
            expected_dep = round(fcm / (ipp + fcm) * 100.0, 1)
            self.assertAlmostEqual(float(c["dependencia_fcm_pct"]), expected_dep, delta=0.15, msg=f"FCM% en {ine}")

        self.assertAlmostEqual(float(self.by_ine["11202"]["dependencia_fcm_pct"]), 48.7, places=1)
        self.assertAlmostEqual(float(self.by_ine["11303"]["dependencia_fcm_pct"]), 95.4, places=1)

        self.assertEqual(int(self.by_ine["11202"]["ipp_per_capita_clp"]), 558534)
        self.assertEqual(int(self.by_ine["11102"]["ipp_per_capita_clp"]), 488379)
        self.assertEqual(int(self.by_ine["11203"]["ipp_per_capita_clp"]), 528924)
        self.assertEqual(int(self.by_ine["11401"]["ipp_per_capita_clp"]), 134210)

    def test_02_zero_aquaculture_patents_in_inland_communes(self):
        """0 M$ patentes acuicolas en 6 comunas interiores y Tortel (01_gob + Nodo #15), cifras oficiales en litoral y parche espacial Hub III."""
        n15 = next(n for n in self.bundle["nodos"] if n["id"] == 15)
        n15_by_name = {row[0]: parse_cl_num(row[3]) for row in n15["tableRows"]}
        wp01_by_ine = {str(c["comuna_ine"]): c["datos"]["finanzas_sinim"] for c in self.sys01["por_comuna"]}

        zero_ines = ("11101", "11102", "11401", "11402", "11301", "11302", "11303")
        for ine in zero_ines:
            cname = self.by_ine[ine]["nombre"]
            self.assertEqual(float(wp01_by_ine[ine]["ingresos_patentes_acuicolas_mclp"]), 0.0, f"WP01 acuicola > 0 en {cname}")
            self.assertEqual(n15_by_name[cname], 0.0, f"Nodo #15 acuicola > 0 en {cname}")

        self.assertAlmostEqual(float(wp01_by_ine["11202"]["ingresos_patentes_acuicolas_mclp"]), 1928.64, places=2)
        self.assertAlmostEqual(n15_by_name["Cisnes"], 1928.64, places=2)
        self.assertAlmostEqual(float(wp01_by_ine["11201"]["ingresos_patentes_acuicolas_mclp"]), 1516.33, places=2)
        self.assertAlmostEqual(n15_by_name["Aysén"], 1516.33, places=2)
        self.assertAlmostEqual(float(wp01_by_ine["11203"]["ingresos_patentes_acuicolas_mclp"]), 184.15, places=2)
        self.assertAlmostEqual(n15_by_name["Guaitecas"], 184.15, places=2)

        # Verificacion cruzada del parche espacial Hub III (Bloque 1)
        forbidden_elec_keys = {"capacidad_m3", "buque_abastecedor", "capacidad_diseno_tbps", "operador_troncal", "tension_kv"}
        for n in self.sys02["nodos_georreferenciados"]:
            if str(n.get("id", "")).startswith("nodo-elec-") and n["id"] != "nodo-elec-subestacion-coyhaique":
                overlap = set(n.get("atributos", {}).keys()) & forbidden_elec_keys
                self.assertEqual(overlap, set(), f"Contaminacion espacial residual en {n['id']}: {overlap}")

    def test_03_royalty_minero_fet_and_zero_fcmi(self):
        """SUM(fet_royalty_minero_2025_mclp) == 3207.73, FCMI == 0 y pesos sobre ingresos BCN 84820.68 M$."""
        total_fet25 = round(sum(float(c["fet_royalty_minero_2025_mclp"]) for c in self.comunas), 2)
        self.assertAlmostEqual(total_fet25, 3207.73, places=2)
        self.assertEqual(float(self.sys01["resumen_regional"]["fcmi_comunas_mineras_regional_2024_2026_mclp"]), 0.0)
        self.assertAlmostEqual(float(self.sys01["resumen_regional"]["fet_royalty_minero_total_regional_2024_mclp"]), 1377.71, places=2)
        self.assertAlmostEqual(float(self.sys01["resumen_regional"]["fet_royalty_minero_1s_2026_abril_mclp"]), 1652.0, places=1)

        self.assertAlmostEqual(float(self.by_ine["11302"]["royalty_fet_peso_presupuesto_pct"]), 5.3, places=1)
        self.assertAlmostEqual(float(self.by_ine["11303"]["royalty_fet_peso_presupuesto_pct"]), 8.1, places=1)
        self.assertAlmostEqual(float(self.by_ine["11102"]["royalty_fet_peso_presupuesto_pct"]), 8.5, places=1)
        self.assertAlmostEqual(float(self.by_ine["11101"]["royalty_fet_peso_presupuesto_pct"]), 1.7, places=1)

    def test_04_fndr_series_2015_2026_and_wiki_reconciliation(self):
        """Cierres oficiales FNDR 2023-2027 (61579.2/61548.0, 44765.5, 73863.0 / 92.0%, 80748.0) y Wiki limpia de 80.001,3."""
        fndr_series = {str(r["anio"]): r for r in self.bundle["series"]["fndr_asignado_vs_ejecutado_2015_2025"]}
        self.assertAlmostEqual(float(fndr_series["2023"]["gasto_actual_mclp"]), 61579.2, places=1)
        self.assertAlmostEqual(float(fndr_series["2024"]["asignado_mclp"]), 75543.0, places=1)
        self.assertAlmostEqual(float(fndr_series["2024"]["gasto_actual_mclp"]), 44765.5, places=1)
        self.assertAlmostEqual(float(fndr_series["2025"]["asignado_mclp"]), 80200.0, places=1)
        self.assertAlmostEqual(float(fndr_series["2025"]["gasto_actual_mclp"]), 73863.0, places=1)
        self.assertAlmostEqual(float(fndr_series["2025"]["tasa_ejecucion_pct"]), 92.0, places=1)

        dip = self.bundle["goreFndrSeries"]["dipres_ley_presupuestos_fndr"]
        self.assertAlmostEqual(float(dip["2027_acuerdo_hacienda_mclp"]), 80748.0, places=1)
        self.assertAlmostEqual(float(self.sys01["resumen_regional"]["ejecucion_fndr_2023_devengado_mclp"]), 61548.0, places=1)
        self.assertAlmostEqual(float(self.sys01["resumen_regional"]["presupuesto_fndr_2027_acuerdo_hacienda_mclp"]), 80748.0, places=1)

        self.assertNotIn("80.001,3", self.hub04_wiki)
        self.assertIn("84.820,68", self.hub04_wiki)
        self.assertIn("73.863,0", self.hub04_wiki)

    def test_05_servel_2024_2025_participation_and_authorities_sync(self):
        """Participacion SERVEL oct-2024 (58.4%-80.6%, 72.9% reg), DPR Luz Maria Vicuna y sin exautoridades en wp_01."""
        expected_part = {
            "11401": 58.4,
            "11302": 67.9,
            "11301": 70.2,
            "11101": 72.8,
            "11203": 74.1,
            "11201": 75.1,
            "11402": 77.2,
            "11202": 77.9,
            "11102": 80.5,
            "11303": 80.6,
        }
        for ine, exp in expected_part.items():
            self.assertAlmostEqual(float(self.by_ine[ine]["participacion_municipales_2024_pct"]), exp, places=1)

        dpr_node = next(n for n in self.sys01["nodos_georreferenciados"] if n["id"] == "node_dpr_aysen")
        self.assertIn("Luz María Vicuña Figueroa", dpr_node["atributos"]["delegado_presidencial"])

        for stale in ("Rodrigo Araya Morales", "Julio Uribe Alvarado", "Marcos Silva Miranda", "Luperciano Muñoz González", "Abel Becerra Vidal", "Roberto Recabal Cárcamo", "Nelson Opazo López", "David Sandoval Plaza", "Marcia Raphael Mora"):
            self.assertNotIn(stale, self.wp01_py, f"Exautoridad residual en wp_01_gobernanza_finanzas.py: {stale}")

    def test_06_cplt_2026_gore_vs_municipal_and_cgr_milestones(self):
        """CPLT 2026 (73.8% municipal vs 99.9% GORE Aysen) y 6 hitos CGR (CGR-GUA-01..CGR-REG-06)."""
        cplt = self.bundle["cpltTransparencia2026"]
        self.assertAlmostEqual(float(cplt["promedio_regional_aysen_pct"]), 73.8, places=1)
        self.assertAlmostEqual(float(cplt["gore_aysen_cplt_2026"]["transparencia_activa_2026_pct"]), 99.9, places=1)
        self.assertAlmostEqual(float(cplt["gore_aysen_cplt_2026"]["brecha_gore_vs_promedio_municipal_pts"]), 26.1, places=1)

        hitos_ids = [h["id"] for h in self.sys01["resumen_regional"]["hitos_control_cgr_y_jurisdiccional"]]
        self.assertEqual(hitos_ids, ["CGR-GUA-01", "CGR-TOR-02", "CGR-GOR-03", "CGR-COY-04", "CGR-COY-05", "CGR-REG-06"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
