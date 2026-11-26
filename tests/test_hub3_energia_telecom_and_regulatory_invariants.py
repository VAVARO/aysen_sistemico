#!/usr/bin/env python3
"""Suite de invariantes forenses del Hub III (Energia, Termica, Combustibles, Telecom) y Regulación Sprint 6."""

import json
import math
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_bundle():
    txt = (ROOT / "data/aysen_hubs_data.js").read_text(encoding="utf-8")
    idx = txt.index("window.AYSEN_HUBS_DATA = ") + len("window.AYSEN_HUBS_DATA = ")
    return json.loads(txt[idx:].strip().rstrip(";"))


class TestHub3EnergiaTelecomAndRegulatoryInvariants(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle()
        cls.comunas = cls.bundle["comunas"]
        cls.by_ine = {str(c["comuna_ine"]): c for c in cls.comunas}
        cls.cne = json.loads((ROOT / "data/raw/energia_telecom/catastro_centrales_electricas_cne_edelaysen.json").read_text(encoding="utf-8"))
        cls.infra = json.loads((ROOT / "data/raw/energia_telecom/infraestructura_combustibles_red_electrica.json").read_text(encoding="utf-8"))
        cls.foa = json.loads((ROOT / "data/raw/energia_telecom/subtel_foa_conectividad_movil_catastro.json").read_text(encoding="utf-8"))
        cls.sys02 = json.loads((ROOT / "data/systemic/02_energia_combustibles_telecom.json").read_text(encoding="utf-8"))
        cls.lex = json.loads((ROOT / "data/nl_lexicon_aysen.json").read_text(encoding="utf-8"))

    def test_01_power_conservation_6710mw_zero_cabo_juan_and_ssaa_limit(self):
        """SUM(potencia_mw) == 67.10 MW exacto en comunas, resumen_regional y 21 unidades, 0 Cabo Juan, SSAA <= 1.50 MW."""
        raw_txt = json.dumps([self.cne["centrales"], self.sys02["nodos_georreferenciados"], self.bundle["nodos"], self.bundle["spatialNodesByLayer"]["centrales_electricas"]], ensure_ascii=False)
        self.assertNotIn("Cabo Juan Román", raw_txt)
        self.assertNotIn("Cabo Juan Roman", raw_txt)
        self.assertNotIn("CENTRAL-HIDRO-RIO-AYSEN\"", raw_txt)

        centrales = self.cne["centrales"]
        self.assertEqual(len(centrales), 21)
        by_id = {c["id"]: c for c in centrales}
        self.assertAlmostEqual(by_id["CENTRAL-HIDRO-LAGO-ATRAVESADO"]["potencia_mw"], 11.00, places=2)
        self.assertAlmostEqual(by_id["CENTRAL-TERMICA-TEHUELCHE"]["potencia_mw"], 17.98, places=2)
        self.assertAlmostEqual(by_id["CENTRAL-TERMICA-CHACABUCO"]["potencia_mw"], 10.00, places=2)
        self.assertAlmostEqual(by_id["PLANTA-SOLAR-EL-BLANCO"]["potencia_mw"], 2.99, places=2)
        self.assertAlmostEqual(by_id["CENTRAL-DIESEL-MELINKA"]["potencia_mw"], 1.45, places=2)
        self.assertAlmostEqual(by_id["CENTRAL-HIBRIDA-CALETA-TORTEL"]["potencia_mw"], 0.95, places=2)
        self.assertAlmostEqual(by_id["CENTRAL-DIESEL-PUERTO-AGUIRRE"]["potencia_mw"], 0.48, places=2)

        for c in centrales:
            sis = str(c.get("sistema", ""))
            if re.search(r"sistema\s+aislado", sis, re.I) and not re.search(r"sistema\s+mediano", sis, re.I):
                self.assertLessEqual(c["potencia_mw"], 1.50, f"SSAA > 1.50 MW: {c['id']} = {c['potencia_mw']}")

        sum_cne = round(sum(c["potencia_mw"] for c in centrales), 2)
        sum_com = round(sum(float(c["potencia_mw"]) for c in self.comunas), 2)
        sum_reg = round(float(self.sys02["resumen_regional"]["potencia_instalada_regional_total_mw"]), 2)
        self.assertAlmostEqual(sum_cne, 67.10, places=2)
        self.assertAlmostEqual(sum_com, 67.10, places=2)
        self.assertAlmostEqual(sum_reg, 67.10, places=2)
        self.assertAlmostEqual(sum(float(c["potencia_ernc_en_construccion_mw"]) for c in self.comunas), 18.98, places=2)

    def test_02_bt1_nov2026_subsidies_fuels_and_chacabuco_mbm(self):
        """BT1 Nov-2026 ($287,8), 13.448 hogares Subsidio Eléctrico, gasolina/kerosene Nov-2026 y MBM Copec 6.674 m3."""
        self.assertEqual(self.by_ine["11101"]["tarifa_bt1_clp"], 287.8)
        self.assertEqual(self.by_ine["11201"]["tarifa_bt1_clp"], 287.8)
        self.assertEqual(sum(int(c["cobertura_subsidio_electrico_hogares_n"]) for c in self.comunas), 13448)

        self.assertEqual(self.by_ine["11101"]["gasolina_93_clp"], 1652)
        self.assertAlmostEqual(self.sys02["resumen_regional"]["precio_promedio_gasolina_93_clp"], 1696.0, places=1)
        self.assertAlmostEqual(self.sys02["resumen_regional"]["precio_promedio_diesel_clp"], 1663.0, places=1)
        self.assertAlmostEqual(self.sys02["resumen_regional"]["precio_promedio_kerosene_clp"], 1497.0, places=1)

        chac = next(n for n in self.infra["nodos"] if n["id"] == "PLANT-COMB-PUERTO-CHACABUCO")
        self.assertEqual(chac["capacidad_m3"], 6674)
        self.assertEqual(chac["capacidad_total_instalada_m3"], 10474)
        self.assertNotIn("Petrobras", json.dumps([self.infra, self.sys02, self.bundle["spatialNodesByLayer"]["centrales_electricas"]]))

        self.assertIn("marcoRegulatorioEnergia", self.bundle)
        self.assertGreaterEqual(len(self.bundle["marcoRegulatorioEnergia"].get("hitos_normativos", [])), 7)

    def test_03_firewood_334274_m3s_and_demographic_households_cap(self):
        """Leña INFOR 334.274 m3s (Coyhaique 147.080 = 44,0%) y hogares implícitos <= 1,00 * hogares_censo_2024."""
        total_lena = sum(int(c["consumo_lena_m3_solidos_anual"]) for c in self.comunas)
        self.assertEqual(total_lena, 334274)
        self.assertEqual(self.by_ine["11101"]["consumo_lena_m3_solidos_anual"], 147080)
        self.assertAlmostEqual(147080 / 334274 * 100, 44.0, places=1)

        for c in self.comunas:
            hogares = float(c["hogares_censo_2024"])
            implied_lena = float(c["consumo_lena_m3_solidos_anual"]) / float(c["consumo_lena_m3_hogar_ano"])
            self.assertLessEqual(implied_lena, 1.005 * hogares, f"Hogares leña implícitos > 1.00x en {c['nombre']}")
            self.assertLessEqual(float(c["conexiones_residenciales_subtel_jun2026_n"]), hogares, f"SUBTEL res > hogares en {c['nombre']}")

    def test_04_subtel_foa_unique_ctr_tortel_and_fiber_parity(self):
        """Único aterrizaje CTR en Tortel, GTD Chacabuco, 14 POIITs Silica, FDT-2025-03/Tortel-O'Higgins y fibra 0% en Lago Verde/O'Higgins."""
        meta = self.foa["metadata"]
        self.assertEqual(meta["troncal_submarina_ctr_fdt_2017_01"]["unico_aterrizaje_aysen"], "FOA-NODO-TORTEL (Caleta Tortel)")
        self.assertEqual(len(meta["troncal_terrestre_silica_fdt_2018_02"]["poiits_oficiales_14"]), 14)

        ctr_nodes = [n for n in self.foa["nodos"] if "CTR" in n["operador"]]
        self.assertEqual(len(ctr_nodes), 1)
        self.assertEqual(ctr_nodes[0]["id"], "FOA-NODO-TORTEL")

        gtd = next((n for n in self.foa["nodos"] if n["id"] == "CABLE-SUBMARINO-GTD-CHACABUCO"), None)
        self.assertIsNotNone(gtd)
        ids = {n["id"] for n in self.foa["nodos"]}
        self.assertIn("FDT-FIBRA-TORTEL-OHIGGINS", ids)
        self.assertIn("FDT-ULTIMA-MILLA-33-LOC", ids)

        self.assertEqual(self.by_ine["11102"]["cobertura_fibra_hogar_pct"], 0.0)
        self.assertEqual(self.by_ine["11302"]["cobertura_fibra_hogar_pct"], 0.0)
        self.assertEqual(sum(int(c["conexiones_fijas_subtel_jun2026_n"]) for c in self.comunas), 26294)
        self.assertEqual(sum(int(c["conexiones_residenciales_subtel_jun2026_n"]) for c in self.comunas), 24782)

    def test_05_zero_active_affine_or_complement_collinearity(self):
        """Cero pares activos no-alias/complemento con colinealidad afín o complementaria |r| >= 0.9995."""
        excluded = {
            v["id"] for v in self.lex.get("variables", [])
            if v.get("isAliasOf") or v.get("isComplementOf")
        }
        active_keys = [
            k for k, val in self.comunas[0].items()
            if isinstance(val, (int, float)) and k not in excluded
        ]

        def pearson(xs, ys):
            n = len(xs)
            mx, my = sum(xs) / n, sum(ys) / n
            num = sum((a - mx) * (b - my) for a, b in zip(xs, ys))
            dx = sum((a - mx) ** 2 for a in xs)
            dy = sum((b - my) ** 2 for b in ys)
            return num / math.sqrt(dx * dy) if dx > 0 and dy > 0 else 0.0

        offenders = []
        for i, ka in enumerate(active_keys):
            xs = [float(c[ka]) for c in self.comunas]
            for kb in active_keys[i + 1:]:
                ys = [float(c[kb]) for c in self.comunas]
                r = pearson(xs, ys)
                if abs(r) < 0.9995:
                    continue
                if r <= -0.9995:
                    offenders.append((ka, kb, round(r, 6)))
                    continue
                # Positivo exacto/afín (excluyendo Coyhaique [0] y Aysén [2])
                n = len(xs)
                mx, my = sum(xs) / n, sum(ys) / n
                dx = sum((a - mx) ** 2 for a in xs)
                slope = sum((a - mx) * (b - my) for a, b in zip(xs, ys)) / dx
                intercept = my - slope * mx
                rng_y = (max(ys) - min(ys)) or 1.0
                max_rel = max(abs(b - (intercept + slope * a)) / rng_y for a, b in zip(xs, ys))
                xs2 = [v for idx, v in enumerate(xs) if idx not in (0, 2)]
                ys2 = [v for idx, v in enumerate(ys) if idx not in (0, 2)]
                r_no_ca = pearson(xs2, ys2)
                if abs(r_no_ca) >= 0.9995 and max_rel <= 0.0065:
                    offenders.append((ka, kb, round(r, 6)))

        self.assertEqual(offenders, [], f"Pares activos colineales sin etiquetar: {offenders}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
