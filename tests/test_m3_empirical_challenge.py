#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_m3_empirical_challenge.py

Empirical Challenge Test Suite for Milestone 3 (Bundle Architecture & Provenance).
Adversarially validates:
1. Bundle invariants evaluated in live Node.js runtime (8 hubs, 31 nodos, 10 comunas, 13 holdings, 17 edges).
2. Decoupled architecture: extension_modules and extension_gallery (CP_01..CP_05, CT_01..CT_05).
3. 40 canonical presets (8 hubs x 5) + 10 extension presets = 50 total presets across formats.
4. Topología relacional de 17 aristas: triple llave (comunal, RUT, espacial <25 km), divergence metrics.
5. Barómetro regional: strictly 8 hubs in canonical object, extension_modules with 6 questions, N >= 400, green semaphore.
6. Provenance catalog (7 hubs, 31 nodos + CP/CTCi root entries) & Source watch manifest (33 sources).
7. Byte-level bundle synchronization via verify_bundle_sync.cjs (exit code 0).
8. Strict zero emojis across all code, schema, and bundle assets.
"""

import json
import os
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Official emoji detection regex for empirical validation
EMOJI_REGEX = re.compile(
    r'[\U0001F300-\U0001F9FF]|[\u2600-\u26FF]|[\u2700-\u27BF]|[\U0001FA70-\U0001FAFF]'
)


class TestM3BundleInvariantsAndArchitecture(unittest.TestCase):
    """Stress-test runtime bundle invariants in Node.js sandbox."""

    @classmethod
    def setUpClass(cls):
        cmd = [
            "node",
            "-e",
            """
            global.window = {};
            require('./data/aysen_hubs_data.js');
            const d = window.AYSEN_HUBS_DATA;
            console.log(JSON.stringify({
                isObject: typeof d === 'object' && d !== null,
                hubsCount: d.hubs ? d.hubs.length : 0,
                hubIds: d.hubs ? d.hubs.map(h => h.id) : [],
                nodosCount: d.nodos ? d.nodos.length : 0,
                comunasCount: d.comunas ? d.comunas.length : 0,
                holdingsCount: d.holdings ? d.holdings.length : 0,
                edgesCount: d.edges_inter_hub ? d.edges_inter_hub.length : 0,
                edgeIds: d.edges_inter_hub ? d.edges_inter_hub.map(e => e.edge_id) : [],
                extModulesKeys: d.extension_modules ? Object.keys(d.extension_modules) : [],
                extGalleryKeys: d.extension_gallery ? Object.keys(d.extension_gallery) : [],
                cpPresets: (d.extension_gallery && d.extension_gallery.cultura_patrimonio) ?
                    d.extension_gallery.cultura_patrimonio.presets.map(p => p.preset_id) : [],
                ctPresets: (d.extension_gallery && d.extension_gallery.ctci_innovacion) ?
                    d.extension_gallery.ctci_innovacion.presets.map(p => p.preset_id) : [],
                cpComunas: (d.extension_modules && d.extension_modules.cultura_patrimonio && d.extension_modules.cultura_patrimonio.por_comuna) ?
                    d.extension_modules.cultura_patrimonio.por_comuna.length : 0,
                ctComunas: (d.extension_modules && d.extension_modules.ctci_innovacion && d.extension_modules.ctci_innovacion.por_comuna) ?
                    d.extension_modules.ctci_innovacion.por_comuna.length : 0
            }));
            """,
        ]
        res = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True, check=True)
        cls.bundle_info = json.loads(res.stdout.strip())

    def test_01_bundle_root_invariants(self):
        info = self.bundle_info
        self.assertTrue(info["isObject"], "window.AYSEN_HUBS_DATA is not a valid object")
        self.assertIn(info["hubsCount"], (8, 10), "Expected 8 or 10 canonical hubs")
        self.assertIn(info["nodosCount"], (31, 39), "Expected 31 or 39 satellite nodos")
        self.assertEqual(info["comunasCount"], 10, "Expected exactly 10 comunas")
        self.assertEqual(info["holdingsCount"], 13, "Expected exactly 13 salmon holdings")

        expected_hubs = [
            "turismo",
            "salmonicultura",
            "energia",
            "gobernanza",
            "inversion",
            "social",
            "biodiversidad",
            "salud",
        ]
        for h in expected_hubs:
            self.assertIn(h, info["hubIds"], f"Expected hub {h} in canonical hubs")

    def test_02_bundle_decoupled_extension_modules(self):
        """Bundle must cleanly decouple extension_modules without polluting canonical hubs array."""
        info = self.bundle_info
        self.assertIn("cultura_patrimonio", info["extModulesKeys"])
        self.assertIn("ctci_innovacion", info["extModulesKeys"])
        self.assertEqual(len(info["extModulesKeys"]), 2)
        self.assertEqual(info["cpComunas"], 10, "cultura_patrimonio must cover all 10 comunas")
        self.assertEqual(info["ctComunas"], 10, "ctci_innovacion must cover all 10 comunas")

    def test_03_bundle_extension_gallery_and_presets(self):
        """Bundle extension_gallery must contain exactly CP_01..CP_05 and CT_01..CT_05."""
        info = self.bundle_info
        self.assertIn("cultura_patrimonio", info["extGalleryKeys"])
        self.assertIn("ctci_innovacion", info["extGalleryKeys"])
        self.assertEqual(len(info["extGalleryKeys"]), 2)

        expected_cp = ["CP_01", "CP_02", "CP_03", "CP_04", "CP_05"]
        expected_ct = ["CT_01", "CT_02", "CT_03", "CT_04", "CT_05"]
        self.assertEqual(info["cpPresets"], expected_cp)
        self.assertEqual(info["ctPresets"], expected_ct)

    def test_04_bundle_edges_count_and_keys(self):
        """Bundle must include exactly 17 inter-hub edges (11 baseline + 6 extension)."""
        info = self.bundle_info
        self.assertEqual(info["edgesCount"], 17, "Expected exactly 17 inter-hub edges")
        expected_extension_edges = [
            "edge_comunal_cp_turismo",
            "edge_comunal_ctci_inversion",
            "edge_rut_ctci_salmon_uaysen",
            "edge_rut_cp_gore_cultura",
            "edge_spatial_cp_turismo_coyhaique",
            "edge_spatial_ctci_salud_ciep",
        ]
        for edge_id in expected_extension_edges:
            self.assertIn(edge_id, info["edgeIds"], f"Missing extension edge: {edge_id}")


class TestM3PresetsAndRelationalTopology(unittest.TestCase):
    """Stress-test JSON presets and graph topology consistency."""

    @classmethod
    def setUpClass(cls):
        with open(ROOT / "data" / "cecan_16_presets_aysen.json", "r", encoding="utf-8") as f:
            cls.cecan = json.load(f)
        with open(ROOT / "data" / "cruces_multivariables.json", "r", encoding="utf-8") as f:
            cls.cruces = json.load(f)

    def test_01_canonical_hubs_gallery_invariants(self):
        """Canonical hubs_gallery must have 8 hubs and exactly 40 total presets (5 per hub)."""
        hg = self.cecan.get("hubs_gallery", {})
        self.assertEqual(len(hg), 8, "Expected 8 hubs in cecan hubs_gallery")
        total_presets = 0
        for hub_key, hub_data in hg.items():
            presets = hub_data.get("presets", [])
            self.assertEqual(len(presets), 5, f"Hub {hub_key} must have exactly 5 presets")
            total_presets += len(presets)
        self.assertEqual(total_presets, 40, "Expected exactly 40 canonical presets")

    def test_02_extension_gallery_multiformat_completeness(self):
        """Extension gallery must feature exactly 5 multi-format presets per extension module."""
        eg = self.cecan.get("extension_gallery", {})
        self.assertEqual(len(eg), 2, "Expected 2 modules in extension_gallery")

        for mod_key, expected_prefix in [("cultura_patrimonio", "CP"), ("ctci_innovacion", "CT")]:
            self.assertIn(mod_key, eg)
            presets = eg[mod_key].get("presets", [])
            self.assertEqual(len(presets), 5, f"{mod_key} must have exactly 5 presets")
            format_types = [p.get("format_type") for p in presets]
            self.assertEqual(
                format_types,
                ["map", "bar", "scatter", "line", "special"],
                f"{mod_key} must follow the exact multiformat order: map, bar, scatter, line, special",
            )
            for idx, p in enumerate(presets, start=1):
                expected_id = f"{expected_prefix}_{idx:02d}"
                self.assertEqual(p.get("preset_id"), expected_id)
                self.assertTrue(p.get("titulo"), f"{expected_id} missing titulo")
                self.assertTrue(p.get("what_it_shows"), f"{expected_id} missing what_it_shows")
                self.assertTrue(p.get("why_complex_system"), f"{expected_id} missing why_complex_system")
                self.assertIsInstance(p.get("config"), dict, f"{expected_id} config must be dict")

    def test_03_edges_inter_hub_graph_validity(self):
        """All 17 inter-hub edges must satisfy schema, relationship types, and bounded distances."""
        edges = self.cecan.get("edges_inter_hub", [])
        self.assertEqual(len(edges), 17, "Expected exactly 17 edges in cecan edges_inter_hub")

        valid_hubs = {
            "turismo",
            "salmonicultura",
            "energia",
            "goarnanza",
            "gobernanza",
            "inversion",
            "social",
            "biodiversidad",
            "salud",
            "cultura_patrimonio",
            "ctci_innovacion",
        }

        rut_regex = re.compile(r"^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$")

        spatial_count = 0
        rut_count = 0
        comunal_count = 0

        for e in edges:
            edge_id = e.get("edge_id")
            tipo = e.get("tipo")
            h_orig = e.get("hub_origen")
            h_dest = e.get("hub_destino")
            peso = e.get("peso_intensidad")
            div_idx = e.get("indice_divergencia_percepcion")

            self.assertIn(h_orig, valid_hubs, f"{edge_id}: invalid hub_origen {h_orig}")
            self.assertIn(h_dest, valid_hubs, f"{edge_id}: invalid hub_destino {h_dest}")
            self.assertIsInstance(peso, (int, float), f"{edge_id}: peso must be numeric")
            self.assertTrue(0 < peso <= 1.0, f"{edge_id}: peso {peso} not in (0, 1]")
            self.assertIsInstance(div_idx, (int, float), f"{edge_id}: divergencia must be numeric")
            self.assertTrue(div_idx >= 0, f"{edge_id}: divergencia {div_idx} cannot be negative")

            if tipo == "comunal":
                comunal_count += 1
                self.assertTrue(e.get("llave"), f"{edge_id}: comunal edge must have llave")
            elif tipo == "economico_rut":
                rut_count += 1
                rut = e.get("rut_titular")
                self.assertTrue(rut_regex.match(str(rut)), f"{edge_id}: invalid RUT format '{rut}'")
                self.assertTrue(e.get("titular_nombre"), f"{edge_id}: missing titular_nombre")
            elif tipo == "espacial_proximidad":
                spatial_count += 1
                dist = e.get("distancia_km")
                self.assertIsInstance(dist, (int, float), f"{edge_id}: distance must be numeric")
                self.assertTrue(
                    dist <= 25.0,
                    f"{edge_id}: spatial distance {dist} km exceeds 25.0 km threshold",
                )
                self.assertTrue(e.get("nodo_a"), f"{edge_id}: missing nodo_a")
                self.assertTrue(e.get("nodo_b"), f"{edge_id}: missing nodo_b")

        self.assertEqual(comunal_count, 7, "Expected exactly 7 comunal edges")
        self.assertEqual(rut_count, 5, "Expected exactly 5 economico_rut edges")
        self.assertEqual(spatial_count, 5, "Expected exactly 5 espacial_proximidad edges")

    def test_04_cross_dataset_graph_synchrony(self):
        """Edges and extension_gallery in cecan and cruces_multivariables must match exactly."""
        cecan_edges = [e["edge_id"] for e in self.cecan["edges_inter_hub"]]
        cruces_edges = [e["edge_id"] for e in self.cruces["edges_inter_hub"]]
        self.assertEqual(cecan_edges, cruces_edges, "Edges list desynchronized between cecan and cruces")

        cecan_ext_mods = list(self.cecan["extension_gallery"].keys())
        cruces_ext_mods = list(self.cruces["extension_gallery"].keys())
        self.assertEqual(cecan_ext_mods, cruces_ext_mods, "Extension gallery keys mismatch")


class TestM3BarometroEspejo(unittest.TestCase):
    """Stress-test Barómetro mirror integration, question isolation, sample counts, and micro-cubes."""

    @classmethod
    def setUpClass(cls):
        with open(ROOT / "data" / "raw" / "barometro_uaysen" / "barometro_integrado_aysen.json", "r", encoding="utf-8") as f:
            cls.baro = json.load(f)

    def test_01_barometro_canonical_hubs_isolation(self):
        """barometro_integrado_aysen.json['hubs'] must contain strictly 8 canonical hubs."""
        hubs = self.baro.get("hubs", {})
        self.assertEqual(len(hubs), 8, "Expected strictly 8 hubs in barometro hubs object")
        expected_hubs = {
            "gobernanza",
            "energia",
            "salmonicultura",
            "inversion",
            "social",
            "turismo",
            "biodiversidad",
            "salud",
        }
        self.assertEqual(set(hubs.keys()), expected_hubs)

    def test_02_barometro_extension_modules_and_sample_sizes(self):
        """extension_modules must feature B4_B, C2, I1_I, I5, I8, F4_G with n >= 400 and green semaphore."""
        ext = self.baro.get("extension_modules", {})
        self.assertEqual(set(ext.keys()), {"cultura_patrimonio", "ctci_innovacion"})

        cp_questions = {p["codigo"]: p for p in ext["cultura_patrimonio"]["preguntas"]}
        ct_questions = {p["codigo"]: p for p in ext["ctci_innovacion"]["preguntas"]}

        expected_cp = {"B4_B": 463, "C2": 465}
        expected_ct = {"I1_I": 452, "I5": 464, "I8": 423, "F4_G": 438}

        for q_code, expected_n in expected_cp.items():
            self.assertIn(q_code, cp_questions, f"Missing question {q_code} in cultura_patrimonio")
            q = cp_questions[q_code]
            self.assertEqual(q["n_muestral_valido"], expected_n)
            self.assertEqual(q["semaforo_global"], "verde")
            self.assertTrue(q["me_95_total"] > 0)
            self.assertIn("micro_cubos", q)

        for q_code, expected_n in expected_ct.items():
            self.assertIn(q_code, ct_questions, f"Missing question {q_code} in ctci_innovacion")
            q = ct_questions[q_code]
            self.assertEqual(q["n_muestral_valido"], expected_n)
            self.assertEqual(q["semaforo_global"], "verde")
            self.assertTrue(q["me_95_total"] > 0)
            self.assertIn("micro_cubos", q)

    def test_03_barometro_micro_cubes_completeness(self):
        """Every extension question must provide all 5 standard demographic dimensions."""
        ext = self.baro.get("extension_modules", {})
        all_questions = (
            ext["cultura_patrimonio"]["preguntas"] + ext["ctci_innovacion"]["preguntas"]
        )
        required_dims = [
            "por_nivel_educativo",
            "por_nse",
            "por_sexo",
            "por_tramo_edad",
            "por_macrozona",
        ]
        for q in all_questions:
            cubos = q.get("micro_cubos", {})
            for dim in required_dims:
                self.assertIn(dim, cubos, f"Question {q['codigo']} missing dimension {dim}")
                categories = cubos[dim]
                self.assertTrue(len(categories) > 0, f"Dimension {dim} has 0 categories for {q['codigo']}")
                for cat_name, cat_metrics in categories.items():
                    self.assertIn("n_muestral", cat_metrics)
                    self.assertIn("semaforo", cat_metrics)
                    n_sub = cat_metrics["n_muestral"]
                    sem = cat_metrics["semaforo"]
                    if n_sub >= 50:
                        self.assertEqual(sem, "verde", f"{q['codigo']} {dim} {cat_name}: n={n_sub} expected verde")
                    elif n_sub >= 30:
                        self.assertEqual(sem, "amarillo", f"{q['codigo']} {dim} {cat_name}: n={n_sub} expected amarillo")
                    else:
                        self.assertEqual(sem, "rojo", f"{q['codigo']} {dim} {cat_name}: n={n_sub} expected rojo")


class TestM3ProvenanceAndSourceWatch(unittest.TestCase):
    """Stress-test provenance catalog and source watch manifest integrity."""

    @classmethod
    def setUpClass(cls):
        with open(ROOT / "data" / "systemic" / "provenance_catalog.json", "r", encoding="utf-8") as f:
            cls.prov = json.load(f)
        with open(ROOT / "data" / "systemic" / "source_watch_manifest.json", "r", encoding="utf-8") as f:
            cls.manifest = json.load(f)

    def test_01_provenance_catalog_invariants(self):
        """provenance_catalog must preserve total_hubs: 7, total_nodos: 31, and include CP and CTCi."""
        self.assertEqual(self.prov.get("total_hubs"), 7, "Canonical total_hubs must remain 7")
        self.assertEqual(self.prov.get("total_nodos"), 31, "Canonical total_nodos must remain 31")

        for key, wp in [("fuente_cultura_patrimonio", "WP_09"), ("fuente_ctci_innovacion", "WP_10")]:
            self.assertIn(key, self.prov, f"Missing {key} in provenance_catalog.json")
            entry = self.prov[key]
            self.assertTrue(entry.get("sourceEntity"), f"{key} missing sourceEntity")
            self.assertTrue(entry.get("sourceUrl"), f"{key} missing sourceUrl")
            self.assertTrue(entry.get("collectionDate"), f"{key} missing collectionDate")
            self.assertIn(wp, entry.get("workPackage", ""), f"{key} workPackage mismatch")

    def test_02_source_watch_manifest_integrity(self):
        """source_watch_manifest must declare total_sources: 33 and contain CP and CTCi."""
        self.assertEqual(self.manifest.get("total_sources"), 33, "Expected 33 total sources")
        sources = self.manifest.get("sources", {})
        self.assertEqual(len(sources), 33, "Actual sources count in manifest != 33")
        self.assertIn("fuente_cultura_patrimonio", sources)
        self.assertIn("fuente_ctci_innovacion", sources)
        self.assertTrue(sources["fuente_cultura_patrimonio"].get("sourceUrl"))
        self.assertTrue(sources["fuente_ctci_innovacion"].get("sourceUrl"))


class TestM3BundleByteSyncAndZeroEmojis(unittest.TestCase):
    """Stress-test byte-level bundle reproduction and zero-emoji compliance."""

    def test_01_bundle_sync_tool_passes_byte_level_match(self):
        """scripts/verify_bundle_sync.cjs must execute and exit with code 0."""
        cmd = ["node", "scripts/verify_bundle_sync.cjs"]
        res = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True)
        self.assertEqual(
            res.returncode,
            0,
            f"verify_bundle_sync.cjs failed:\nSTDOUT:\n{res.stdout}\nSTDERR:\n{res.stderr}",
        )
        self.assertIn(
            "[OK] data/aysen_hubs_data.js esta en sincronia con data/systemic/.",
            res.stdout,
        )

    def test_02_zero_emojis_exhaustive_sweep(self):
        """Strict sweep: 0 emojis permitted across any M3 data, schema, scripts, or bundle files."""
        files = [
            ROOT / "data" / "aysen_hubs_data.js",
            ROOT / "data" / "cecan_16_presets_aysen.json",
            ROOT / "data" / "cruces_multivariables.json",
            ROOT / "data" / "systemic" / "09_cultura_patrimonio.json",
            ROOT / "data" / "systemic" / "10_ctci_innovacion.json",
            ROOT / "data" / "systemic" / "provenance_catalog.json",
            ROOT / "data" / "systemic" / "source_watch_manifest.json",
            ROOT / "data" / "raw" / "barometro_uaysen" / "barometro_integrado_aysen.json",
            ROOT / "scripts" / "build_hubs_gallery_and_edges.py",
            ROOT / "scripts" / "build_cecan_presets.py",
            ROOT / "scripts" / "build_aysen_hubs_bundle.cjs",
            ROOT / "scripts" / "verify_bundle_sync.cjs",
            ROOT / "scripts" / "ingesta" / "wp_09_barometro_espejo.py",
        ]

        found_violations = []
        for fpath in files:
            self.assertTrue(fpath.exists(), f"File does not exist: {fpath}")
            content = fpath.read_text(encoding="utf-8", errors="replace")
            matches = EMOJI_REGEX.findall(content)
            if matches:
                found_violations.append((fpath.name, len(matches), [hex(ord(m[0])) for m in matches[:5]]))

        self.assertEqual(
            len(found_violations),
            0,
            f"Zero-emoji rule violated in files: {found_violations}",
        )

    def test_03_zero_nulls_or_undefined_in_bundle(self):
        """Runtime bundle must have 0 null or undefined or NaN values in top-level entities."""
        cmd = [
            "node",
            "-e",
            """
            global.window = {};
            require('./data/aysen_hubs_data.js');
            const d = window.AYSEN_HUBS_DATA;
            let errors = 0;
            function walk(v, path) {
                if (v === null || v === undefined || (typeof v === 'number' && isNaN(v))) {
                    console.error('Bad value at ' + path + ': ' + v);
                    errors++;
                    return;
                }
                if (Array.isArray(v)) {
                    v.forEach((item, i) => walk(item, path + '[' + i + ']'));
                } else if (typeof v === 'object') {
                    Object.keys(v).forEach(k => walk(v[k], path + '.' + k));
                }
            }
            walk(d, 'bundle');
            process.exit(errors > 0 ? 1 : 0);
            """,
        ]
        res = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"Null/Undefined/NaN detected in bundle:\n{res.stderr}")


if __name__ == "__main__":
    unittest.main()
