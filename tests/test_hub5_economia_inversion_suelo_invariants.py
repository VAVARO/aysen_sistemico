#!/usr/bin/env python3
"""Suite de invariantes forenses del Hub V (Economia, Inversion, SEIA, Mineria, CMF y Suelo) — Sprint 8."""

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_bundle():
    txt = (ROOT / "data" / "aysen_hubs_data.js").read_text(encoding="utf-8")
    idx = txt.index("window.AYSEN_HUBS_DATA = ") + len("window.AYSEN_HUBS_DATA = ")
    return json.loads(txt[idx:].strip().rstrip(";"))


class TestHub5EconomiaInversionSueloInvariants(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle["comunas"]
        cls.by_ine = {str(c["comuna_ine"]): c for c in cls.comunas}
        cls.sys03 = json.loads((ROOT / "data" / "systemic" / "03_concesiones_tierra_mar.json").read_text(encoding="utf-8"))
        cls.sys04 = json.loads((ROOT / "data" / "systemic" / "04_inversion_seia_economia.json").read_text(encoding="utf-8"))
        cls.sys07 = json.loads((ROOT / "data" / "systemic" / "07_biodiversidad_flora_fauna_aysen.json").read_text(encoding="utf-8"))
        cls.nodos = {n["id"]: n for n in cls.bundle["nodos"]}
        cls.hub5 = next(h for h in cls.bundle["hubs"] if h["id"] == "inversion")

    def test_01_bcch_pib_series_2018_2025_and_13_activities(self):
        """Serie oficial BCCh Cuentas Nacionales Regionales 2018-2025, encadenado, 1T 2026 -2.6%, FBCF +18.2%, PIB turistico y 13 actividades."""
        pib_nom = {str(r["periodo"]): float(r["valor"]) for r in self.bundle["series"]["pib_regional_nominal_mmclp"]}
        expected_nom = {
            "2018": 1228000,
            "2019": 1346000,
            "2020": 1104000,
            "2021": 1260000,
            "2022": 1490000,
            "2023": 1502000,
            "2024": 1672000,
            "2025": 1991000,
        }
        for yr, val in expected_nom.items():
            self.assertEqual(pib_nom[yr], val, f"PIB nominal BCCh {yr} != {val}")

        pib_real = {str(r["periodo"]): float(r["valor"]) for r in self.bundle["series"]["pib_regional_variacion_real_pct"]}
        self.assertAlmostEqual(pib_real["2022"], 3.8, places=1)
        self.assertAlmostEqual(pib_real["2023"], 3.8, places=1)
        self.assertAlmostEqual(pib_real["2024"], -0.2, places=1)
        self.assertAlmostEqual(pib_real["2025"], 8.5, places=1)
        self.assertAlmostEqual(pib_real["2026"], -2.6, places=1)

        cn = self.bundle["cuentasNacionalesBcch"]
        self.assertEqual(cn["pib_encadenado_mmclp"]["2022"], 1201780)
        self.assertEqual(cn["pib_encadenado_mmclp"]["2023"], 1247360)
        self.assertAlmostEqual(cn["fbcf_2025_variacion_real_pct"], 18.2, places=1)
        self.assertEqual(cn["pib_turistico_2025_mmclp"], 89200)
        self.assertAlmostEqual(cn["pib_turistico_2025_pct"], 4.5, places=1)

        acts = self.bundle["composicionPib13ActividadesBcch"]
        self.assertEqual(len(acts), 13)
        by_act = {a["actividad"]: (a["pct_2023"], a["pct_2025"]) for a in acts}
        self.assertEqual(by_act["Pesca y acuicultura"], (31.2, 27.2))
        self.assertEqual(by_act["Administración pública"], (17.5, 16.1))
        self.assertEqual(by_act["Minería"], (1.1, 3.8))
        self.assertEqual(by_act["Agropecuario-silvícola"], (1.0, 1.8))

    def test_02_sii_zero_contradiction_5_tranches_and_local_vs_gross_sales(self):
        """Sin contradicciones 9.365/56.475, series SII 2022-2025, 5 tramos UF BCN 2024 (12.953 emp) y ventas locales 25.800 MUF vs bruto 131.520 MUF."""
        ex = self.hub5["example"]
        self.assertNotIn("9.365", ex)
        self.assertNotIn("56.475", ex)

        res4 = self.sys04["resumen_regional"]
        self.assertEqual(res4["total_empresas_activas_sii"], 13453)
        self.assertEqual(res4["total_trabajadores_dependientes_sii"], 35832)

        ser_emp = next(s["valores"] for s in res4["series_historicas_regionales"] if s["indicador"] == "empresas_totales_regionales_sii")
        ser_trab = next(s["valores"] for s in res4["series_historicas_regionales"] if s["indicador"] == "trabajadores_dependientes_regionales_sii")
        emp_by_yr = {r["periodo"]: r["valor"] for r in ser_emp}
        trab_by_yr = {r["periodo"]: r["valor"] for r in ser_trab}
        self.assertEqual((emp_by_yr["2022"], trab_by_yr["2022"]), (12087, 35157))
        self.assertEqual((emp_by_yr["2023"], trab_by_yr["2023"]), (12451, 34370))
        self.assertEqual((emp_by_yr["2024"], trab_by_yr["2024"]), (12953, 35491))
        self.assertEqual((emp_by_yr["2025"], trab_by_yr["2025"]), (13453, 35832))

        self.assertEqual(self.by_ine["11101"]["empresas_sii"], 7238)
        self.assertEqual(self.by_ine["11101"]["trabajadores_sii"], 22351)
        self.assertEqual(self.by_ine["11201"]["empresas_sii"], 2675)
        self.assertEqual(self.by_ine["11201"]["trabajadores_sii"], 6551)
        self.assertEqual(self.by_ine["11302"]["empresas_sii"], 109)
        self.assertEqual(self.by_ine["11302"]["trabajadores_sii"], 148)

        n20 = self.nodos[20]
        self.assertEqual(len(n20["chartSpec"]["labels"]), 5)
        self.assertEqual(n20["chartSpec"]["datasets"][0]["data"], [8532, 1655, 186, 24, 2556])
        self.assertEqual(sum(n20["chartSpec"]["datasets"][0]["data"]), 12953)
        self.assertEqual(self.bundle["distribucionSii5TramosUf2024"]["total_trabajadores"], 35491)

        self.assertEqual(sum(c["ventas_sii_domicilio_local_muf"] for c in self.comunas), 25800)
        self.assertEqual(sum(c["ventas_sii_muf"] for c in self.comunas), 131520)

    def test_03_seia_no_los_condores_1to1_sync_clean_urls_and_sea_2025(self):
        """Cero Los Condores, cero id_expediente ficticio, sincronia 1:1 de 20 nodos SEIA y Cuenta Publica SEA 2024-2025."""
        wp04_nodes = self.sys04["nodos_georreferenciados"]
        sp_nodes = self.bundle["spatialNodesByLayer"]["proyectos_seia_puros"]
        self.assertEqual(len(wp04_nodes), 20)
        self.assertEqual(len(sp_nodes), 20)

        for n in wp04_nodes:
            self.assertNotIn("los-condores", n["id"].lower())
            self.assertNotIn("cóndores", n["nombre"].lower())
            self.assertNotIn("id_expediente=", n["source_url"])
        for sn in sp_nodes:
            self.assertNotIn("los-condores", sn["id"].lower())
            self.assertNotIn("cóndores", sn["nombre"].lower())
            self.assertNotIn("id_expediente=", sn.get("sourceUrl", ""))

        wp04_by_id = {f"inv_{n['id']}": float(n["atributos"]["monto_inversion_mmusd"]) for n in wp04_nodes}
        for sn in sp_nodes:
            self.assertIn(sn["id"], wp04_by_id)
            self.assertAlmostEqual(float(sn["magnitudeValue"]), wp04_by_id[sn["id"]], places=2)

        cp = self.bundle["cuentaPublicaSea2024_2025"]
        self.assertEqual((cp["proyectos_aprobados"], cp["proyectos_desistidos"], cp["proyectos_rechazados"], cp["consultas_pertinencia_resueltas"]), (3, 1, 0, 72))

    def test_04_sernageomin_356_concessions_128511_ha_and_real_holders(self):
        """Catastro minero SERNAGEOMIN: 356 concesiones (131 + 225), 128.511 ha, 0 ha Tortel/Guaitecas y titulares reales El Toqui / Cerro Bayo."""
        expected_ha = {
            "11401": 47537,
            "11102": 24800,
            "11101": 21573,
            "11201": 13900,
            "11302": 9800,
            "11402": 7400,
            "11202": 2300,
            "11301": 1201,
            "11303": 0,
            "11203": 0,
        }
        for ine, exp in expected_ha.items():
            self.assertEqual(self.by_ine[ine]["concesiones_mineras_ha"], exp, f"Mineria ha {ine}")
        self.assertEqual(sum(c["concesiones_mineras_ha"] for c in self.comunas), 128511)

        cat = self.bundle["catastroMineroSernageomin"]
        self.assertEqual((cat["concesiones_totales"], cat["explotacion"], cat["exploracion"], cat["superficie_ha"]), (356, 131, 225, 128511))

        faenas = {f["id"]: f for f in self.bundle["spatialNodesByLayer"]["mineria_faenas"]}
        self.assertIn("Sociedad Minera Pacífico del Sur SpA", faenas["inv_min_el_toqui"]["titular"])
        self.assertIn("506.948 UF", faenas["inv_min_el_toqui"]["titular"])
        self.assertIn("Andean Silver Limited", faenas["inv_min_cerro_bayo"]["titular"])
        self.assertIn("136 Moz AgEq", faenas["inv_min_cerro_bayo"]["titular"])

    def test_05_chilecompra_2024_2026_ytd_series(self):
        """Serie ChileCompra real: 230.850 M$ (2024, 46.142 OC), 238.400 M$ (2025, 58.57% EMT / 32.32% OP) y 228.874,2 M$ (2026 YTD, 31.973 OC)."""
        mp_ser = {str(r["periodo"]): float(r["valor"]) for r in self.bundle["series"]["transacciones_compras_publicas_mclp"]}
        self.assertAlmostEqual(mp_ser["2024"], 230850.0, places=1)
        self.assertAlmostEqual(mp_ser["2025"], 238400.0, places=1)
        self.assertAlmostEqual(mp_ser["2026"], 228874.2, places=1)

        cc = self.bundle["chilecompraMercadoPublico"]
        self.assertEqual(cc["2024"]["ordenes_compra"], 46142)
        self.assertAlmostEqual(cc["2025"]["participacion_emt_pct"], 58.57, places=2)
        self.assertAlmostEqual(cc["2025"]["participacion_obras_publicas_pct"], 32.32, places=2)
        self.assertEqual(cc["2026_ytd_22oct"]["ordenes_compra"], 31973)

    def test_06_cmf_banking_commune_exports_and_exception_laws_caps(self):
        """Exportacion CMF hacia D.comunas (sucursales, cajeros, CajaVecina), metricas CMF 2025 y topes de leyes de excepcion austral."""
        for c in self.comunas:
            self.assertIsInstance(c.get("sucursales_bancarias_n"), (int, float))
            self.assertIsInstance(c.get("cajeros_automaticos_n"), (int, float))
            self.assertIsInstance(c.get("cajavecina_puntos_n"), (int, float))
        self.assertEqual(sum(c["sucursales_bancarias_n"] for c in self.comunas), 12)
        self.assertEqual(sum(c["cajeros_automaticos_n"] for c in self.comunas), 47)
        self.assertEqual(sum(c["cajavecina_puntos_n"] for c in self.comunas), 415)

        cmf = self.bundle["inclusionFinancieraCmf2025"]
        self.assertEqual(cmf["locaciones_por_100k_adultos"], 66)
        self.assertEqual(cmf["instrumentos_ahorro_por_1000_hab"], 2051)

        ley = self.bundle["leyesExcepcionAustral"]
        self.assertEqual(ley["dl_889"]["tope_remuneracion_clp"], 271686)
        self.assertEqual(ley["dl_889"]["bonificacion_maxima_mensual_clp"], 46187)
        self.assertEqual(ley["gratificacion_zona"]["tope_grado_1a_eus_mensual_clp"], 720439)
        self.assertEqual(ley["dfl_15"]["tope_ventas_anuales_uf"], 40000)
        self.assertEqual(ley["ley_austral_df15_credito_tributario"]["vigente_hasta"], 2035)

    def test_07_odepa_livestock_conservation_and_conaf_2026_cadastre(self):
        """Conservacion exacta masa ganadera BCN/ODEPA (144.118 bovinos / 177.972 ovinos) y Catastro Vegetacional CONAF 2026."""
        self.assertEqual(sum(c["ganado_bovino_cabezas"] for c in self.comunas), 144118)
        self.assertEqual(sum(c["ganado_ovino_cabezas"] for c in self.comunas), 177972)

        conaf26 = self.bundle["catastroVegetacionalConaf2026"]
        self.assertAlmostEqual(conaf26["superficie_catastrada_ha"], 10667211.5, places=1)
        self.assertAlmostEqual(conaf26["bosque_nativo_ha"], 5152384.3, places=1)
        self.assertAlmostEqual(conaf26["bosques_en_snaspe_ha"], 2387525.4, places=1)
        self.assertAlmostEqual(sum(c["bosque_nativo_ha"] for c in self.comunas), 5152384.3, places=1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
