#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_challenger_m4_stress.py
=============================================================================
Suite de estrés y verificación adversarial profunda para Milestone 4 (R4):
Integración de UI y Presets (Cultura & Patrimonio y CTCi & Innovación)
en Laboratorio Sistémico (laboratorio.html) y Plataforma Aysén (js/plataforma_aysen.js).

Challenger M4 — Adversarial Challenge & Stress Harness
=============================================================================
"""

import os
import sys
import re
import json
import math
import unittest
from urllib.parse import parse_qs, urlparse

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
PLATAFORMA_JS = os.path.join(ROOT_DIR, "js", "plataforma_aysen.js")
PLATAFORMA_HTML = os.path.join(ROOT_DIR, "plataforma_aysen.html")
INDEX_HTML = os.path.join(ROOT_DIR, "index.html")
HUBS_DATA_FILE = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
WP09_FILE = os.path.join(ROOT_DIR, "data", "systemic", "09_cultura_patrimonio.json")
WP10_FILE = os.path.join(ROOT_DIR, "data", "systemic", "10_ctci_innovacion.json")
PROVENANCE_FILE = os.path.join(ROOT_DIR, "data", "systemic", "provenance_catalog.json")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)

COMUNAS_CUT = [
    "11101", "11102", "11201", "11202", "11203",
    "11301", "11302", "11303", "11401", "11402"
]


class ChallengerM4StressTestSuite(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            cls.lab_html = f.read()

        with open(PLATAFORMA_JS, "r", encoding="utf-8") as f:
            cls.plataforma_js = f.read()

        with open(PLATAFORMA_HTML, "r", encoding="utf-8") as f:
            cls.plataforma_html = f.read()

        with open(INDEX_HTML, "r", encoding="utf-8") as f:
            cls.index_html = f.read()

        with open(HUBS_DATA_FILE, "r", encoding="utf-8") as f:
            b_text = f.read()
        idx = b_text.find("window.AYSEN_HUBS_DATA = ")
        raw_json = b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
        cls.hubs_data = json.loads(raw_json)

        with open(WP09_FILE, "r", encoding="utf-8") as f:
            cls.wp09_data = json.load(f)

        with open(WP10_FILE, "r", encoding="utf-8") as f:
            cls.wp10_data = json.load(f)

        with open(PROVENANCE_FILE, "r", encoding="utf-8") as f:
            cls.provenance = json.load(f)

    # -------------------------------------------------------------------------
    # TEST 1: Strict Zero Emojis Scan Across All M4 Files
    # -------------------------------------------------------------------------
    def test_01_strict_zero_emojis_audit(self):
        """Auditoría de cero emojis en código, plantillas y fuentes de M4."""
        target_files = [
            ("laboratorio.html", LAB_HTML),
            ("js/plataforma_aysen.js", PLATAFORMA_JS),
            ("plataforma_aysen.html", PLATAFORMA_HTML),
            ("index.html", INDEX_HTML),
            ("data/aysen_hubs_data.js", HUBS_DATA_FILE),
            ("data/systemic/09_cultura_patrimonio.json", WP09_FILE),
            ("data/systemic/10_ctci_innovacion.json", WP10_FILE),
            ("tests/test_m4_ui_presets_integration.py", os.path.join(ROOT_DIR, "tests", "test_m4_ui_presets_integration.py")),
            ("scripts/build_cecan_presets.py", os.path.join(ROOT_DIR, "scripts", "build_cecan_presets.py")),
            ("scripts/build_hubs_gallery_and_edges.py", os.path.join(ROOT_DIR, "scripts", "build_hubs_gallery_and_edges.py")),
            ("scripts/build_aysen_hubs_bundle.cjs", os.path.join(ROOT_DIR, "scripts", "build_aysen_hubs_bundle.cjs"))
        ]

        total_violations = 0
        violation_report = []

        for rel_path, full_path in target_files:
            if not os.path.exists(full_path):
                continue
            with open(full_path, "r", encoding="utf-8", errors="replace") as f:
                content = f.read()
            matches = EMOJI_REGEX.findall(content)
            if matches:
                total_violations += len(matches)
                violation_report.append(f"{rel_path}: {len(matches)} emojis -> {matches[:5]}")

        self.assertEqual(
            total_violations, 0,
            f"Se encontraron {total_violations} emojis prohibidos:\n" + "\n".join(violation_report)
        )

    # -------------------------------------------------------------------------
    # TEST 2: Contractual DOM IDs & UI Elements Integrity & Uniqueness
    # -------------------------------------------------------------------------
    def test_02_contractual_dom_ids_uniqueness_and_presence(self):
        """Verificar presencia y unicidad estricta de todos los IDs contractuales de UI."""
        # Invariant contract IDs in index.html
        index_critical_ids = [
            "repoHealthBadge", "healthScore", "btnModeDesktop", "btnModeProjector",
            "crossAlertBanner", "crossAlertTitle", "crossAlertText", "miniChart", "crossChart"
        ]
        for iid in index_critical_ids:
            pattern = re.compile(rf'id=["\']{iid}["\']')
            matches = pattern.findall(self.index_html)
            self.assertGreaterEqual(len(matches), 1, f"Falta ID contractual en index.html: {iid}")

        # Contractual IDs in laboratorio.html
        lab_critical_ids = [
            "brandHeader", "panelCatalogo", "panelLienzo", "panelMetacognicion",
            "variablesTreeContainer", "canvasGridStage", "studioConnectionsSvg",
            "workspaceWindowTabs", "heroEmptyCanvas", "canvaFloatingToolbar",
            "tbBtnAverage", "tbBtnTrend", "tbBtnReflection", "btnExcludeCoyhaique",
            # Hub Gallery IDs
            "modalHubGallery", "hubGalleryTitle", "hubGalleryTabs", "hubGalleryCardsGrid", "btnHubGalleryClose",
            # Barómetro Sociodemo Drawer IDs
            "barometroSociodemoDrawer", "baroDrawerTitle", "baroDrawerSubtitle", "btnBaroDrawerClose",
            "baroLiveSampleBox", "baroSemaforoBadge", "baroMetricN", "baroMetricUniverse", "baroMetricME",
            "baroSampleNote", "selectBaroEdu", "selectBaroNse", "selectBaroSexo", "selectBaroEdad",
            "selectBaroMacro", "switchBaroInterregional", "btnApplyBaroFilters", "btnResetBaroFilters"
        ]

        for cid in lab_critical_ids:
            pattern = re.compile(rf'id=["\']{cid}["\']')
            matches = pattern.findall(self.lab_html)
            self.assertGreaterEqual(len(matches), 1, f"Falta ID contractual obligatorio en laboratorio.html: {cid}")
            self.assertEqual(len(matches), 1, f"El ID '{cid}' está duplicado {len(matches)} veces en laboratorio.html")

        # In plataforma_aysen.html
        plat_critical_ids = [
            "btnJoinModeComunas", "btnJoinModeHoldings", "btnJoinModeInterHub",
            "modelTableSearch", "liveJoinTable", "liveJoinTableHead", "liveJoinTableBody"
        ]
        for pid in plat_critical_ids:
            pattern = re.compile(rf'id=["\']{pid}["\']')
            matches = pattern.findall(self.plataforma_html)
            self.assertGreaterEqual(len(matches), 1, f"Falta ID en plataforma_aysen.html: {pid}")
            self.assertEqual(len(matches), 1, f"El ID '{pid}' está duplicado en plataforma_aysen.html")

    # -------------------------------------------------------------------------
    # TEST 3: Extension Gallery Presets Deep Stress Test
    # -------------------------------------------------------------------------
    def test_03_extension_gallery_presets_deep_audit(self):
        """Stress test exhaustivo de los 10 presets de extensión CP_01..05 y CT_01..05."""
        ext_gallery = self.hubs_data.get("extension_gallery", {})
        self.assertIn("cultura_patrimonio", ext_gallery)
        self.assertIn("ctci_innovacion", ext_gallery)

        expected_cp = ["CP_01", "CP_02", "CP_03", "CP_04", "CP_05"]
        expected_ct = ["CT_01", "CT_02", "CT_03", "CT_04", "CT_05"]

        cp_presets = ext_gallery["cultura_patrimonio"].get("presets", [])
        ct_presets = ext_gallery["ctci_innovacion"].get("presets", [])

        self.assertEqual([p["preset_id"] for p in cp_presets], expected_cp)
        self.assertEqual([p["preset_id"] for p in ct_presets], expected_ct)

        all_10_presets = cp_presets + ct_presets
        valid_formats = {"map", "bar", "scatter", "line", "special"}

        for p in all_10_presets:
            pid = p.get("preset_id")
            # 1. Structure checks
            self.assertTrue(pid, "Preset carece de preset_id")
            self.assertTrue(p.get("titulo"), f"Preset {pid} carece de titulo")
            self.assertTrue(p.get("what_it_shows"), f"Preset {pid} carece de what_it_shows")
            self.assertTrue(p.get("why_complex_system"), f"Preset {pid} carece de why_complex_system")
            self.assertIn(p.get("format_type"), valid_formats, f"Preset {pid} formato inválido: {p.get('format_type')}")
            
            # 2. Inter-hub cross metadata
            cross = p.get("inter_hub_cross")
            self.assertIsInstance(cross, dict, f"Preset {pid} carece de inter_hub_cross")
            self.assertTrue(cross.get("cross_hub"), f"Preset {pid} inter_hub_cross sin cross_hub")
            self.assertTrue(cross.get("descripcion"), f"Preset {pid} inter_hub_cross sin descripcion")

            # 3. Config checks
            cfg = p.get("config", {})
            self.assertIsInstance(cfg, dict, f"Preset {pid} config debe ser un dict")

            # 4. Perception mirror stress test
            if p.get("is_perception_mirror"):
                q_code = cfg.get("barometro_question")
                self.assertTrue(q_code, f"Preset espejo {pid} carece de barometro_question en config")
                contract = cfg.get("sample_contract")
                self.assertIsInstance(contract, dict, f"Preset {pid} carece de sample_contract")
                n = contract.get("active_n")
                N = contract.get("universe_N")
                me = contract.get("margin_error_pct")
                self.assertIsNotNone(n, f"Preset {pid} sample_contract sin active_n")
                self.assertIsNotNone(N, f"Preset {pid} sample_contract sin universe_N")
                self.assertIsNotNone(me, f"Preset {pid} sample_contract sin margin_error_pct")
                self.assertEqual(N, 465, f"Preset {pid} universe_N debe ser 465")
                self.assertGreaterEqual(n, 30, f"Preset {pid} submuestra menor a umbral mínimo n=30")
                self.assertLessEqual(n, N, f"Preset {pid} active_n excede universo N")

                # Verify standard survey sampling margin of error: ME = 1.96 * sqrt(0.25 / n) * 100 = 98 / sqrt(n)
                calc_me = 98.0 / math.sqrt(n)
                self.assertAlmostEqual(
                    me, calc_me, delta=0.08,
                    msg=f"Margen de error de {pid} ({me}%) discrepa de la fórmula survey ({calc_me:.2f}%)"
                )

    # -------------------------------------------------------------------------
    # TEST 4: Micro-cubos Barómetro & Sample Engine Stress Test
    # -------------------------------------------------------------------------
    def test_04_micro_cubos_and_sample_robustness_stress_test(self):
        """Stress test de los micro-cubos sociodemográficos y clasificaciones de semáforo."""
        pattern = re.compile(r'const\s+BAROMETRO_MICRO_CUBOS\s*=\s*(\{[\s\S]*?\n\s*\};)')
        m = pattern.search(self.lab_html)
        self.assertIsNotNone(m, "No se encontró la definición de BAROMETRO_MICRO_CUBOS en laboratorio.html")

        # Required mirror questions
        required_questions = ["B4_B", "C2", "I1_I", "I5", "I8", "F4_G", "G1_A", "B3_B"]
        for q in required_questions:
            self.assertIn(f"'{q}'", self.lab_html, f"Falta pregunta obligatoria en BAROMETRO_MICRO_CUBOS: {q}")

        # Adversarial math tests on robustness rules
        test_samples = [
            (465, 465, "verde", "[●] Muestra Robusta", False, False),
            (452, 465, "verde", "[●] Muestra Robusta", False, False),
            (100, 465, "verde", "[●] Muestra Robusta", False, False),
            (50, 465, "verde", "[●] Muestra Robusta", False, False),
            (49, 465, "amarillo", "[▲] Muestra Referencial", False, True),
            (30, 465, "amarillo", "[▲] Muestra Referencial", False, True),
            (29, 465, "rojo", "[■] Submuestra Crítica", True, False),
            (10, 465, "rojo", "[■] Submuestra Crítica", True, False),
            (1, 465, "rojo", "[■] Submuestra Crítica", True, False)
        ]

        for n, N, exp_sem, exp_lbl, exp_crit, exp_ref in test_samples:
            fpc = math.sqrt((N - n) / (N - 1)) if N > n else 1.0
            me = (1.96 * math.sqrt(0.25 / n) * fpc * 100)
            sem = 'verde' if n >= 50 else ('amarillo' if n >= 30 else 'rojo')
            lbl = 'Muestra Robusta' if n >= 50 else ('Muestra Referencial' if n >= 30 else 'Submuestra Crítica')
            icon = '[●]' if sem == 'verde' else ('[▲]' if sem == 'amarillo' else '[■]')
            full_lbl = f"{icon} {lbl}"

            self.assertEqual(sem, exp_sem, f"Fallo semáforo para n={n}")
            self.assertEqual(full_lbl, exp_lbl, f"Fallo label para n={n}")
            self.assertEqual(n < 30, exp_crit)
            self.assertEqual(30 <= n < 50, exp_ref)
            self.assertTrue(math.isfinite(me), f"Margen de error no finito para n={n}")

    # -------------------------------------------------------------------------
    # TEST 5: Inter-Hub Relational Edges & Deep Links Stress Test
    # -------------------------------------------------------------------------
    def test_05_interhub_edges_and_deep_links_stress_test(self):
        """Stress test de las 17 aristas inter-hub y sus enlaces de acción a laboratorio.html."""
        edges = self.hubs_data.get("edges_inter_hub", [])
        self.assertEqual(len(edges), 17, f"Deben existir exactamente 17 aristas inter-hub, encontradas {len(edges)}")

        canonical_hubs = set(self.hubs_data.get("hubsGallery", {}).keys())
        extension_modules = set(self.hubs_data.get("extension_gallery", {}).keys())
        all_valid_hubs = canonical_hubs | extension_modules

        # Collect all valid presets
        all_valid_presets = set()
        for h, data in self.hubs_data.get("hubsGallery", {}).items():
            for p in data.get("presets", []):
                all_valid_presets.add(p.get("preset_id"))
        for h, data in self.hubs_data.get("extension_gallery", {}).items():
            for p in data.get("presets", []):
                all_valid_presets.add(p.get("preset_id"))

        valid_edge_types = {"comunal", "economico_rut", "espacial_proximidad"}

        # Verify each edge
        for idx, edge in enumerate(edges):
            eid = edge.get("edge_id") or edge.get("id")
            h_orig = edge.get("hub_origen")
            h_dest = edge.get("hub_destino")
            p_rec = edge.get("preset_recomendado")
            tipo = edge.get("tipo")
            desc = edge.get("descripcion")
            peso = edge.get("peso_intensidad")
            div = edge.get("indice_divergencia_percepcion")

            self.assertTrue(eid, f"Arista #{idx} sin ID")
            self.assertIn(h_orig, all_valid_hubs, f"Arista {eid} hub_origen '{h_orig}' no existe en hubs ni extensiones")
            self.assertIn(h_dest, all_valid_hubs, f"Arista {eid} hub_destino '{h_dest}' no existe en hubs ni extensiones")
            self.assertIn(p_rec, all_valid_presets, f"Arista {eid} preset_recomendado '{p_rec}' no existe en la galería de presets")
            self.assertIn(tipo, valid_edge_types, f"Arista {eid} tipo de llave inválido: {tipo}")
            self.assertTrue(desc, f"Arista {eid} carece de descripcion")
            self.assertGreater(peso, 0.0, f"Arista {eid} peso debe ser > 0")
            self.assertLessEqual(peso, 1.0, f"Arista {eid} peso no debe superar 1.0")
            self.assertGreaterEqual(div, 0.0, f"Arista {eid} divergencia debe ser >= 0")
            self.assertLessEqual(div, 1.0, f"Arista {eid} divergencia no debe superar 1.0")

            # Simulate Deep Link parsing
            raw_url = f"laboratorio.html?hub={h_orig}&preset={p_rec}"
            parsed = urlparse(raw_url)
            qs = parse_qs(parsed.query)
            self.assertEqual(qs.get("hub"), [h_orig])
            self.assertEqual(qs.get("preset"), [p_rec])

    # -------------------------------------------------------------------------
    # TEST 6: VARIABLE_CATALOG Groups 8 & 9 and Data Resolution Stress Test
    # -------------------------------------------------------------------------
    def test_06_variable_catalog_extension_resolution_stress_test(self):
        """Stress test de resolución de datos comunales para todas las variables de Cultura y CTCi."""
        wp09_comunas = self.wp09_data.get("por_comuna", [])
        wp10_comunas = self.wp10_data.get("por_comuna", [])

        self.assertEqual(len(wp09_comunas), 10, "WP_09 debe contener exactamente 10 comunas")
        self.assertEqual(len(wp10_comunas), 10, "WP_10 debe contener exactamente 10 comunas")

        wp09_by_ine = {str(c["comuna_ine"]): c.get("datos", {}) for c in wp09_comunas}
        wp10_by_ine = {str(c["comuna_ine"]): c.get("datos", {}) for c in wp10_comunas}

        # Check Group 8 variables
        group8_vars = [
            ("total_espacios_culturales", int, lambda d: d.get("total_espacios_culturales", 0)),
            ("gasto_cultura_per_capita_clp", (int, float), lambda d: d.get("gasto_cultura_per_capita_clp", 0)),
            ("fondos_cultura_adjudicados_mclp", (int, float), lambda d: d.get("fondos_cultura_adjudicados_mclp", 0)),
            ("participacion_cultural_pct_c2", (int, float), lambda d: d.get("participacion_cultural_pct_c2", 0))
        ]

        for vname, vtype, getter in group8_vars:
            for ine in COMUNAS_CUT:
                d = wp09_by_ine.get(ine)
                self.assertIsNotNone(d, f"Comuna CUT {ine} ausente en WP_09")
                val = getter(d)
                self.assertIsInstance(val, vtype, f"Variable {vname} para comuna {ine} no es {vtype}: {val}")
                self.assertFalse(math.isnan(float(val)), f"Variable {vname} para comuna {ine} es NaN")
                self.assertGreaterEqual(float(val), 0.0, f"Variable {vname} para comuna {ine} es negativa: {val}")

        # Check Group 9 variables
        group9_vars = [
            ("total_proyectos_ctci", int, lambda d: d.get("total_proyectos_ctci", 0)),
            ("proyectos_anid_locales_count", int, lambda d: d.get("proyectos_anid_locales_count", 0)),
            ("monto_anid_acumulado_mclp", (int, float), lambda d: d.get("monto_anid_acumulado_mclp", 0)),
            ("percepcion_ctci_prioritaria_pct_i1i", (int, float), lambda d: d.get("percepcion_ctci_prioritaria_pct_i1i", 0))
        ]

        for vname, vtype, getter in group9_vars:
            for ine in COMUNAS_CUT:
                d = wp10_by_ine.get(ine)
                self.assertIsNotNone(d, f"Comuna CUT {ine} ausente en WP_10")
                val = getter(d)
                self.assertIsInstance(val, vtype, f"Variable {vname} para comuna {ine} no es {vtype}: {val}")
                self.assertFalse(math.isnan(float(val)), f"Variable {vname} para comuna {ine} es NaN")
                self.assertGreaterEqual(float(val), 0.0, f"Variable {vname} para comuna {ine} es negativa: {val}")

    # -------------------------------------------------------------------------
    # TEST 7: Laboratorio Catalog Injection & Preset Loader Coverage
    # -------------------------------------------------------------------------
    def test_07_laboratorio_catalog_injection_and_preset_loader_coverage(self):
        """Verificar que laboratorio.html inyecta todas las variables requeridas en AppState.catalogItems."""
        expected_injected_vars = [
            # Cultura
            "total_espacios_culturales", "museos_count", "bibliotecas_publicas_count",
            "monumentos_nacionales_count", "gasto_cultura_per_capita_clp",
            "gasto_municipal_cultura_mclp", "fondos_cultura_adjudicados_mclp",
            "fndr_8pct_cultura_mclp", "participacion_cultural_pct_c2", "nota_percepcion_cultura_b4b",
            "monto_adjudicado_mclp",
            # CTCi
            "total_proyectos_ctci", "proyectos_anid_locales_count", "proyectos_anid_extrarregionales_count",
            "monto_anid_acumulado_mclp", "proyectos_corfo_innova_count", "monto_corfo_innova_mclp",
            "centros_y_estaciones_ctci_count", "investigadores_residentes_est",
            "evaluacion_uaysen_promedio_i8", "percepcion_ctci_prioritaria_pct_i1i",
            "anid_macroareas_ocde_historico"
        ]

        for var_id in expected_injected_vars:
            self.assertIn(f"'{var_id}'", self.lab_html, f"Variable {var_id} no inyectada en catálogo de laboratorio.html")

        # Verify loadHubPresetById has logic handling both canonical and extension presets
        self.assertIn("function loadHubPresetById(presetId)", self.lab_html)
        self.assertIn("extension_gallery", self.lab_html)
        self.assertIn("openSociodemoDrawer", self.lab_html)
        self.assertIn("createReflectionCard", self.lab_html)
        self.assertIn("addConnection(chartWidget.id, refCard.id, 'bivariate')", self.lab_html)

        # Verify URL param handling covers both ?preset= and ?hub=
        self.assertIn("const presetParam = params.get('preset');", self.lab_html)
        self.assertIn("const hubParam = params.get('hub');", self.lab_html)

    # -------------------------------------------------------------------------
    # TEST 8: Decoupled Architecture Invariants & Data Governance
    # -------------------------------------------------------------------------
    def test_08_decoupled_architecture_and_data_lake_invariants(self):
        """Verificar preservación estricta de invariantes canónicas (8 hubs, 31 nodos, 40 presets)."""
        # Canonical Hubs invariant
        hubs = self.hubs_data.get("hubs", [])
        self.assertEqual(len(hubs), 8, f"Invariante rota: len(hubs) debe ser 8, es {len(hubs)}")

        # Canonical Nodes invariant
        nodos = self.hubs_data.get("nodos", [])
        self.assertEqual(len(nodos), 31, f"Invariante rota: len(nodos) debe ser 31, es {len(nodos)}")

        # Canonical Gallery invariant
        hubs_gallery = self.hubs_data.get("hubsGallery", {})
        self.assertEqual(len(hubs_gallery), 8, f"Invariante rota: hubsGallery debe tener 8 hubs, tiene {len(hubs_gallery)}")
        for hid, hdata in hubs_gallery.items():
            self.assertEqual(len(hdata.get("presets", [])), 5, f"Hub canónico {hid} debe tener 5 presets")

        # Extension modules invariant
        ext_modules = self.hubs_data.get("extension_modules", {})
        self.assertEqual(len(ext_modules), 2, "extension_modules debe tener exactamente 2 módulos")
        self.assertIn("cultura_patrimonio", ext_modules)
        self.assertIn("ctci_innovacion", ext_modules)

        # Provenance catalog registration
        self.assertIn("fuente_cultura_patrimonio", self.provenance)
        self.assertIn("fuente_ctci_innovacion", self.provenance)

        # CSV files UTF-8 BOM
        for csv_rel in [
            "data/systemic/csv/09_cultura_patrimonio_comunas.csv",
            "data/systemic/csv/09_cultura_patrimonio_nodos.csv",
            "data/systemic/csv/10_ctci_innovacion_comunas.csv",
            "data/systemic/csv/10_ctci_innovacion_nodos.csv"
        ]:
            csv_path = os.path.join(ROOT_DIR, csv_rel)
            self.assertTrue(os.path.exists(csv_path), f"Falta archivo CSV: {csv_rel}")
            with open(csv_path, "rb") as f:
                header = f.read(3)
                self.assertEqual(header, b'\xef\xbb\xbf', f"CSV {csv_rel} no contiene UTF-8 BOM")


if __name__ == "__main__":
    unittest.main()
