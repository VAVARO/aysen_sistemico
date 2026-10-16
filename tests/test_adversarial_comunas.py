#!/usr/bin/env python3
"""
Adversarial Stress Test Suite for Milestone 1:
Base de Datos Estructural de las 10 Comunas de Aysén (data/comunas_aysen.json)

Agent: m1_challenger_1 (Empirical Challenger)
Target: data/comunas_aysen.json & cross-references to data/estaciones_aysen.json

Challenge Dimensions:
1. Boundary coordinate extremities against the Aysén regional bounding box [-49.3, -43.6] lat / [-75.8, -71.0] lng.
2. Schema completeness, presence of required keys, non-nullity, strict types, and reasonable physical/statistical ranges.
3. Mathematical consistency of demography (population density, regional percentages, land area).
4. Station ID cross-referencing and bi-directional integrity with data/estaciones_aysen.json.
5. Performance & latency stress: 1,000 rapid JSON parsing iterations and 10,000 client query lookups (<200ms threshold).
6. Adversarial edge cases: character encoding (UTF-8, Spanish accents), fuzzing queries, malformed keys.
"""

import sys
import os
import json
import time
import math
import random
import unittest
from pathlib import Path
from typing import List, Dict, Any, Set

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent
COMUNAS_JSON_PATH = REPO_ROOT / "data" / "comunas_aysen.json"
ESTACIONES_JSON_PATH = REPO_ROOT / "data" / "estaciones_aysen.json"

# Authoritative Bounding Box for Región de Aysén (CL-XI)
BBOX_LAT_MIN = -49.3
BBOX_LAT_MAX = -43.6
BBOX_LNG_MIN = -75.8
BBOX_LNG_MAX = -71.0

# Expected official INE Comuna codes and names
EXPECTED_COMUNAS = {
    "11101": {"codigo": "CL-XI-01", "nombre": "Coyhaique", "provincia": "Coyhaique"},
    "11102": {"codigo": "CL-XI-02", "nombre": "Lago Verde", "provincia": "Coyhaique"},
    "11201": {"codigo": "CL-XI-03", "nombre": "Aysén", "provincia": "Aysén"},
    "11202": {"codigo": "CL-XI-04", "nombre": "Cisnes", "provincia": "Aysén"},
    "11203": {"codigo": "CL-XI-05", "nombre": "Guaitecas", "provincia": "Aysén"},
    "11401": {"codigo": "CL-XI-06", "nombre": "Chile Chico", "provincia": "General Carrera"},
    "11402": {"codigo": "CL-XI-07", "nombre": "Río Ibáñez", "provincia": "General Carrera"},
    "11301": {"codigo": "CL-XI-08", "nombre": "Cochrane", "provincia": "Capitán Prat"},
    "11302": {"codigo": "CL-XI-09", "nombre": "O'Higgins", "provincia": "Capitán Prat"},
    "11303": {"codigo": "CL-XI-10", "nombre": "Tortel", "provincia": "Capitán Prat"},
}


class TestComunasAdversarialIntegrity(unittest.TestCase):
    """Adversarial validation of data/comunas_aysen.json structure and rules."""

    @classmethod
    def setUpClass(cls):
        assert COMUNAS_JSON_PATH.exists(), f"Missing dataset: {COMUNAS_JSON_PATH}"
        assert ESTACIONES_JSON_PATH.exists(), f"Missing dataset: {ESTACIONES_JSON_PATH}"

        with open(COMUNAS_JSON_PATH, "r", encoding="utf-8") as f:
            cls.raw_text = f.read()
            cls.data = json.loads(cls.raw_text)

        with open(ESTACIONES_JSON_PATH, "r", encoding="utf-8") as f:
            cls.estaciones_data = json.loads(f.read())

        cls.comunas = cls.data.get("comunas", [])

    # -------------------------------------------------------------------------
    # Dimension 1: Bounding Box & Coordinate Extremities
    # -------------------------------------------------------------------------
    def test_top_level_bounding_box_spec(self):
        """Top-level bounding box must strictly match authoritative [-49.3, -43.6] / [-75.8, -71.0]."""
        bbox = self.data.get("bounding_box")
        self.assertIsInstance(bbox, dict, "Top-level 'bounding_box' must be a dictionary")
        lat_b = bbox.get("lat_bounds")
        lng_b = bbox.get("lng_bounds")
        self.assertEqual(lat_b, [BBOX_LAT_MIN, BBOX_LAT_MAX], f"Invalid lat_bounds: {lat_b}")
        self.assertEqual(lng_b, [BBOX_LNG_MIN, BBOX_LNG_MAX], f"Invalid lng_bounds: {lng_b}")

    def test_all_comuna_coordinates_within_regional_bbox(self):
        """Every comuna must have coordinates strictly within the Aysén regional bounding box."""
        for c in self.comunas:
            name = c.get("nombre", "UNKNOWN")
            coords = c.get("coordenadas")
            self.assertIsInstance(coords, dict, f"Comuna {name} missing 'coordenadas' dict")
            
            lat = coords.get("lat")
            lng = coords.get("lng")
            self.assertIsInstance(lat, (float, int), f"Comuna {name} invalid lat: {lat}")
            self.assertIsInstance(lng, (float, int), f"Comuna {name} invalid lng: {lng}")

            # Also check root-level lat/lng aliases if present
            self.assertAlmostEqual(c.get("lat"), lat, places=4, msg=f"Comuna {name} lat mismatch")
            self.assertAlmostEqual(c.get("lng"), lng, places=4, msg=f"Comuna {name} lng mismatch")

            # Strict bounds checking
            self.assertGreaterEqual(
                lat, BBOX_LAT_MIN,
                f"Comuna {name} lat {lat} is south of regional minimum {BBOX_LAT_MIN}"
            )
            self.assertLessEqual(
                lat, BBOX_LAT_MAX,
                f"Comuna {name} lat {lat} is north of regional maximum {BBOX_LAT_MAX}"
            )
            self.assertGreaterEqual(
                lng, BBOX_LNG_MIN,
                f"Comuna {name} lng {lng} is west of regional minimum {BBOX_LNG_MIN}"
            )
            self.assertLessEqual(
                lng, BBOX_LNG_MAX,
                f"Comuna {name} lng {lng} is east of regional maximum {BBOX_LNG_MAX}"
            )

    def test_coordinate_extremities_geographic_realism(self):
        """Verify the physical plausibility of geographical extremes (northmost, southmost, westmost, eastmost)."""
        lats = {c["nombre"]: c["coordenadas"]["lat"] for c in self.comunas}
        lngs = {c["nombre"]: c["coordenadas"]["lng"] for c in self.comunas}

        # Furthest North in Aysén must be Guaitecas or Lago Verde (> -44.5)
        northmost = max(lats.items(), key=lambda x: x[1])
        self.assertIn(northmost[0], ["Guaitecas", "Lago Verde"], f"Unexpected northmost comuna: {northmost}")
        self.assertGreater(northmost[1], -44.5)

        # Furthest South in Aysén must be O'Higgins or Tortel (< -47.5)
        southmost = min(lats.items(), key=lambda x: x[1])
        self.assertIn(southmost[0], ["O'Higgins", "Tortel"], f"Unexpected southmost comuna: {southmost}")
        self.assertLess(southmost[1], -48.0)

        # Furthest West in Aysén should be maritime/coastal archipelagos (Guaitecas, Tortel, Aysén)
        westmost = min(lngs.items(), key=lambda x: x[1])
        self.assertIn(westmost[0], ["Guaitecas", "Tortel", "Aysén"], f"Unexpected westmost comuna: {westmost}")
        self.assertLess(westmost[1], -73.0)

        # Furthest East in Aysén should be border comunas (Chile Chico, Lago Verde, Río Ibáñez)
        eastmost = max(lngs.items(), key=lambda x: x[1])
        self.assertIn(eastmost[0], ["Chile Chico", "Lago Verde", "Río Ibáñez", "Coyhaique"], f"Unexpected eastmost: {eastmost}")
        self.assertGreater(eastmost[1], -72.0)

    # -------------------------------------------------------------------------
    # Dimension 2: Schema, Types, Non-Nullity & Field Presence
    # -------------------------------------------------------------------------
    def test_top_level_metadata(self):
        """Top-level dataset attributes must be complete and non-null."""
        required_top_keys = [
            "$schema", "version", "dataset_id", "titulo", "region",
            "total_comunas", "fecha_actualizacion", "bounding_box",
            "fuentes_oficiales", "comunas"
        ]
        for k in required_top_keys:
            self.assertIn(k, self.data, f"Missing top-level key: {k}")
            self.assertIsNotNone(self.data[k], f"Top-level key '{k}' is null")

        self.assertEqual(self.data["total_comunas"], 10, "Total comunas must be 10")
        self.assertEqual(len(self.comunas), 10, f"Expected 10 comuna objects, found {len(self.comunas)}")
        self.assertGreaterEqual(len(self.data["fuentes_oficiales"]), 5, "At least 5 official sources cited")

    def test_zero_nulls_recursive_scan(self):
        """Recursive scan of entire JSON tree to ensure zero None/null values anywhere."""
        def check_no_nulls(obj, path="root"):
            if obj is None:
                self.fail(f"Null value found at path '{path}'")
            elif isinstance(obj, dict):
                for k, v in obj.items():
                    check_no_nulls(v, f"{path}.{k}")
            elif isinstance(obj, list):
                for idx, item in enumerate(obj):
                    check_no_nulls(item, f"{path}[{idx}]")

        check_no_nulls(self.data)

    def test_all_comuna_fields_and_subcontracts(self):
        """Every comuna must strictly satisfy the interface contract in PROJECT.md."""
        required_schema = {
            "codigo_comuna": str,
            "comuna_ine": str,
            "nombre": str,
            "provincia": str,
            "cabecera": str,
            "cuenca_principal_bna": str,
            "coordenadas": dict,
            "demografia": dict,
            "pobreza_casen": dict,
            "conservacion_conaf": dict,
            "conectividad": dict,
            "equipamiento_critico": dict,
            "sensores_asociados_ids": list,
        }

        demografia_schema = {
            "censo_2024_poblacion": int,
            "superficie_km2": (float, int),
            "densidad_hab_km2": (float, int),
        }

        casen_schema = {
            "pobreza_ingresos_pct": (float, int),
            "pobreza_multidimensional_pct": (float, int),
            "fuente": str,
        }

        conaf_schema = {
            "superficie_protegida_pct": (float, int),
            "unidades_snaspe": list,
        }

        conectividad_schema = {
            "ruta7_km_pavimentados": (float, int),
            "ruta7_km_ripio": (float, int),
            "dependencia_barcaza": str,
            "descripcion_acceso": str,
        }

        equipamiento_schema = {
            "salud_principal": str,
            "total_postas_rurales": int,
            "aerodromo_dgac": str,
            "paso_fronterizo": str,
        }

        seen_codigos = set()
        seen_ine = set()

        for c in self.comunas:
            name = c.get("nombre", "UNKNOWN")

            # Check root fields
            for field, ftype in required_schema.items():
                self.assertIn(field, c, f"Comuna {name} missing field '{field}'")
                self.assertIsInstance(c[field], ftype, f"Comuna {name} field '{field}' wrong type")
                if isinstance(c[field], str):
                    self.assertTrue(len(c[field].strip()) > 0, f"Comuna {name} field '{field}' is empty string")

            # Uniqueness of identifiers
            self.assertNotIn(c["codigo_comuna"], seen_codigos, f"Duplicate codigo_comuna: {c['codigo_comuna']}")
            self.assertNotIn(c["comuna_ine"], seen_ine, f"Duplicate comuna_ine: {c['comuna_ine']}")
            seen_codigos.add(c["codigo_comuna"])
            seen_ine.add(c["comuna_ine"])

            # Verify against official INE catalogue
            ine = c["comuna_ine"]
            self.assertIn(ine, EXPECTED_COMUNAS, f"Unknown comuna_ine '{ine}'")
            self.assertEqual(c["codigo_comuna"], EXPECTED_COMUNAS[ine]["codigo"])
            self.assertEqual(c["nombre"], EXPECTED_COMUNAS[ine]["nombre"])
            self.assertEqual(c["provincia"], EXPECTED_COMUNAS[ine]["provincia"])

            # Demografia sub-schema
            demo = c["demografia"]
            for df, dft in demografia_schema.items():
                self.assertIn(df, demo, f"Comuna {name} demografia missing '{df}'")
                self.assertIsInstance(demo[df], dft, f"Comuna {name} demografia '{df}' wrong type")

            # CASEN sub-schema
            casen = c["pobreza_casen"]
            for cf, cft in casen_schema.items():
                self.assertIn(cf, casen, f"Comuna {name} CASEN missing '{cf}'")
                self.assertIsInstance(casen[cf], cft, f"Comuna {name} CASEN '{cf}' wrong type")

            # CONAF sub-schema
            conaf = c["conservacion_conaf"]
            for kf, kft in conaf_schema.items():
                self.assertIn(kf, conaf, f"Comuna {name} CONAF missing '{kf}'")
                self.assertIsInstance(conaf[kf], kft, f"Comuna {name} CONAF '{kf}' wrong type")
            self.assertTrue(len(conaf["unidades_snaspe"]) > 0, f"Comuna {name} has no SNASPE units")

            # Conectividad sub-schema
            con = c["conectividad"]
            for ctf, ctt in conectividad_schema.items():
                self.assertIn(ctf, con, f"Comuna {name} conectividad missing '{ctf}'")
                self.assertIsInstance(con[ctf], ctt, f"Comuna {name} conectividad '{ctf}' wrong type")

            # Equipamiento sub-schema
            eq = c["equipamiento_critico"]
            for ef, eft in equipamiento_schema.items():
                self.assertIn(ef, eq, f"Comuna {name} equipamiento missing '{ef}'")
                self.assertIsInstance(eq[ef], eft, f"Comuna {name} equipamiento '{ef}' wrong type")

    # -------------------------------------------------------------------------
    # Dimension 3: Physical & Mathematical Feasibility Ranges
    # -------------------------------------------------------------------------
    def test_demographic_mathematical_consistency(self):
        """Demographic values must obey physical bounds and mathematical definitions."""
        total_pob = sum(c["demografia"]["censo_2024_poblacion"] for c in self.comunas)
        total_sup = sum(c["demografia"]["superficie_km2"] for c in self.comunas)

        # Censo 2024 Aysén total population should be around 100,000 - 105,000
        self.assertGreater(total_pob, 95000, f"Total regional population too low: {total_pob}")
        self.assertLess(total_pob, 115000, f"Total regional population too high: {total_pob}")

        # Total regional surface area of Aysén is ~108,494 km²
        self.assertGreater(total_sup, 100000.0, f"Total regional surface area too low: {total_sup}")
        self.assertLess(total_sup, 115000.0, f"Total regional surface area too high: {total_sup}")

        # Individual comuna density checks: densidad == censo_2024_poblacion / superficie_km2
        for c in self.comunas:
            name = c["nombre"]
            pob = c["demografia"]["censo_2024_poblacion"]
            sup = c["demografia"]["superficie_km2"]
            dens = c["demografia"]["densidad_hab_km2"]

            self.assertGreater(pob, 0, f"Comuna {name} population must be positive")
            self.assertGreater(sup, 0, f"Comuna {name} surface must be positive")
            expected_density = pob / sup
            self.assertAlmostEqual(
                dens, expected_density, delta=0.06,
                msg=f"Comuna {name} density ({dens}) does not match pop/sup ({expected_density:.4f})"
            )

    def test_poverty_and_conservation_percentages_in_bounds(self):
        """CASEN poverty percentages and CONAF conservation percentages must be within [0, 100]."""
        for c in self.comunas:
            name = c["nombre"]
            p_ing = c["pobreza_casen"]["pobreza_ingresos_pct"]
            p_mul = c["pobreza_casen"]["pobreza_multidimensional_pct"]
            p_aspe = c["conservacion_conaf"]["superficie_protegida_pct"]

            self.assertTrue(0.0 <= p_ing <= 50.0, f"Comuna {name} income poverty out of range: {p_ing}")
            self.assertTrue(0.0 <= p_mul <= 50.0, f"Comuna {name} multidimensional poverty out of range: {p_mul}")
            self.assertTrue(0.0 <= p_aspe <= 100.0, f"Comuna {name} ASPE percentage out of range: {p_aspe}")

            # Conservation reality in Aysén: wilderness areas are vast (>15% in every comuna)
            self.assertGreaterEqual(p_aspe, 15.0, f"Comuna {name} ASPE unrealistically low: {p_aspe}%")

    # -------------------------------------------------------------------------
    # Dimension 3b: Strict PROJECT.md Infrastructure Contract Invariants
    # -------------------------------------------------------------------------
    def test_project_md_exact_infrastructure_counts(self):
        """
        Verify the exact infrastructure invariants from PROJECT.md line 6:
        '5 hospitals, 32 postas, 10 aerodromes, 8 border passes for all 10 comunas'
        """
        hospitals = [
            c["equipamiento_critico"]["salud_principal"]
            for c in self.comunas
            if "hospital" in c["equipamiento_critico"]["salud_principal"].lower()
        ]
        self.assertEqual(len(hospitals), 5, f"Expected exactly 5 hospitals across region, found {len(hospitals)}: {hospitals}")

        total_postas = sum(c["equipamiento_critico"]["total_postas_rurales"] for c in self.comunas)
        self.assertEqual(total_postas, 32, f"Expected exactly 32 rural postas across region, found {total_postas}")

        # Postas list items count must match total_postas_rurales for each comuna
        for c in self.comunas:
            name = c["nombre"]
            n_postas = c["equipamiento_critico"]["total_postas_rurales"]
            postas_list = c["equipamiento_critico"].get("postas_rurales", [])
            self.assertEqual(
                len(postas_list), n_postas,
                f"Comuna {name} postas_rurales count ({len(postas_list)}) != total_postas_rurales ({n_postas})"
            )

        # All 10 comunas have DGAC aerodromes
        aerodromos = [c["equipamiento_critico"]["aerodromo_dgac"] for c in self.comunas]
        self.assertEqual(len(aerodromos), 10)
        for aero in aerodromos:
            self.assertTrue(len(aero.strip()) > 0, "Aerodromo string cannot be empty")

        # Border passes check (either specific pass or explicit geographical justification)
        border_comunas = [
            c for c in self.comunas
            if not c["equipamiento_critico"]["paso_fronterizo"].lower().startswith("sin pasos")
        ]
        self.assertEqual(len(border_comunas), 6, f"Expected 6 comunas with border passes, found {len(border_comunas)}")

    def test_multithreaded_concurrent_read_query_stress(self):
        """Stress-test concurrent read and query execution across 50 simultaneous threads."""
        import concurrent.futures

        def worker_query_task(worker_id: int):
            for _ in range(200):
                # Parse
                obj = json.loads(self.raw_text)
                comunas = obj["comunas"]
                self.assertEqual(len(comunas), 10)
                # Random lookup
                target = random.choice(comunas)
                c_ine = target["comuna_ine"]
                found = next((x for x in comunas if x["comuna_ine"] == c_ine), None)
                self.assertIsNotNone(found)
                self.assertEqual(found["nombre"], target["nombre"])
            return worker_id

        with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
            futures = [executor.submit(worker_query_task, i) for i in range(50)]
            for f in concurrent.futures.as_completed(futures):
                res = f.result()
                self.assertIsInstance(res, int)

    # -------------------------------------------------------------------------
    # Dimension 4: Cross-Referencing with data/estaciones_aysen.json
    # -------------------------------------------------------------------------
    def test_station_cross_referencing_integrity(self):
        """All station IDs in 'sensores_asociados_ids' must exist in data/estaciones_aysen.json."""
        canonical_estaciones = self.estaciones_data.get("estaciones", [])
        self.assertEqual(len(canonical_estaciones), 16, "Canonical stations catalog must have 16 stations")
        canonical_ids = {st["id"]: st for st in canonical_estaciones}

        referenced_ids: Set[int] = set()

        for c in self.comunas:
            name = c["nombre"]
            comuna_ine = c["comuna_ine"]
            st_ids = c.get("sensores_asociados_ids", [])
            self.assertIsInstance(st_ids, list, f"Comuna {name} sensores_asociados_ids must be a list")

            # Check each referenced station ID
            for sid in st_ids:
                self.assertIsInstance(sid, int, f"Comuna {name} has non-integer sensor ID: {sid}")
                self.assertIn(sid, canonical_ids, f"Comuna {name} references non-existent station ID: {sid}")

                # Verify bi-directional consistency
                station = canonical_ids[sid]
                self.assertEqual(
                    station.get("comuna_ine"), comuna_ine,
                    f"Station {sid} ({station.get('nombre')}) belongs to INE {station.get('comuna_ine')}, "
                    f"but is referenced by comuna {name} ({comuna_ine})"
                )

                # Check for duplicate station references across comunas
                self.assertNotIn(sid, referenced_ids, f"Station {sid} is associated with multiple comunas!")
                referenced_ids.add(sid)

        # Verify that all 16 stations in estaciones_aysen.json with a valid comuna_ine are accounted for
        stations_with_comuna = [st for st in canonical_estaciones if st.get("comuna_ine")]
        for st in stations_with_comuna:
            st_id = st["id"]
            self.assertIn(
                st_id, referenced_ids,
                f"Station {st_id} ({st.get('nombre')}) in comuna {st.get('nombre_comuna')} is not referenced in comunas_aysen.json"
            )

    # -------------------------------------------------------------------------
    # Dimension 5: Latency, Parsing & Simulated Client Lookups
    # -------------------------------------------------------------------------
    def test_rapid_json_parsing_stress_1000_iterations(self):
        """Parse comunas_aysen.json 1,000 times consecutively; mean latency must be < 5ms, max < 50ms."""
        latencies = []
        for _ in range(1000):
            t0 = time.perf_counter()
            parsed = json.loads(self.raw_text)
            elapsed_ms = (time.perf_counter() - t0) * 1000
            latencies.append(elapsed_ms)
            self.assertEqual(parsed["total_comunas"], 10)

        mean_ms = sum(latencies) / len(latencies)
        p99_ms = sorted(latencies)[int(len(latencies) * 0.99)]
        max_ms = max(latencies)

        print(f"\n[LATENCY STRESS] JSON Parse: Mean = {mean_ms:.3f}ms | P99 = {p99_ms:.3f}ms | Max = {max_ms:.3f}ms")
        self.assertLess(mean_ms, 5.0, f"Mean JSON parse latency too high: {mean_ms:.3f}ms")
        self.assertLess(max_ms, 50.0, f"Max JSON parse latency spike too high: {max_ms:.3f}ms")

    def test_simulated_client_querying_stress_10000_iterations(self):
        """
        Simulate 10,000 random client queries (by ID, INE, name, spatial point-in-radius).
        Contract requires client profile display in < 200ms. In-memory queries must be < 1ms.
        """
        # Build in-memory indexes
        by_codigo = {c["codigo_comuna"]: c for c in self.comunas}
        by_ine = {c["comuna_ine"]: c for c in self.comunas}
        by_name = {c["nombre"].lower(): c for c in self.comunas}

        query_latencies = []
        codigos = list(by_codigo.keys())
        ines = list(by_ine.keys())
        names = list(by_name.keys())

        random.seed(42)

        for _ in range(10000):
            q_type = random.choice(["codigo", "ine", "name", "nearest"])
            t0 = time.perf_counter()

            if q_type == "codigo":
                key = random.choice(codigos)
                res = by_codigo.get(key)
                self.assertIsNotNone(res)
            elif q_type == "ine":
                key = random.choice(ines)
                res = by_ine.get(key)
                self.assertIsNotNone(res)
            elif q_type == "name":
                key = random.choice(names)
                res = by_name.get(key)
                self.assertIsNotNone(res)
            else:  # Nearest neighbor query
                q_lat = random.uniform(BBOX_LAT_MIN, BBOX_LAT_MAX)
                q_lng = random.uniform(BBOX_LNG_MIN, BBOX_LNG_MAX)
                res = min(
                    self.comunas,
                    key=lambda c: (c["coordenadas"]["lat"] - q_lat)**2 + (c["coordenadas"]["lng"] - q_lng)**2
                )
                self.assertIsNotNone(res)

            elapsed_ms = (time.perf_counter() - t0) * 1000
            query_latencies.append(elapsed_ms)

        mean_q_ms = sum(query_latencies) / len(query_latencies)
        p99_q_ms = sorted(query_latencies)[int(len(query_latencies) * 0.99)]
        max_q_ms = max(query_latencies)

        print(f"[QUERY STRESS] 10k Lookups: Mean = {mean_q_ms:.4f}ms | P99 = {p99_q_ms:.4f}ms | Max = {max_q_ms:.4f}ms")
        # Ensure far under 200ms contract limit
        self.assertLess(mean_q_ms, 0.5, f"Mean query time exceeded 0.5ms: {mean_q_ms:.4f}ms")
        self.assertLess(max_q_ms, 20.0, f"Max query spike exceeded 20ms: {max_q_ms:.4f}ms")

    # -------------------------------------------------------------------------
    # Dimension 6: Adversarial Edge Cases, Encoding & Fuzzing
    # -------------------------------------------------------------------------
    def test_utf8_encoding_and_spanish_characters(self):
        """Ensure Spanish accents and punctuation (á, é, í, ó, ú, ñ, O'Higgins) are preserved without corruption."""
        raw_bytes = COMUNAS_JSON_PATH.read_bytes()
        # Ensure it decodes cleanly as strict UTF-8
        decoded_text = raw_bytes.decode("utf-8")
        self.assertNotIn("\ufffd", decoded_text, "Corrupted replacement character found in UTF-8 stream")

        # Specific Chilean toponym checks
        expected_substrings = [
            "Coyhaique", "Aysén", "Ibáñez", "O'Higgins", "Guaitecas",
            "Río Simpson", "Bahía Murta", "Puerto Aysén", "Caleta Tortel",
            "Áreas Silvestres Protegidas"
        ]
        for sub in expected_substrings:
            self.assertIn(sub, decoded_text, f"Expected substring '{sub}' missing or corrupted in text")

        # Check for typical mojibake patterns
        mojibake_patterns = ["Ã¡", "Ã©", "Ã­", "Ã³", "Ãº", "Ã±", "&nbsp;", "&amp;"]
        for bad in mojibake_patterns:
            self.assertNotIn(bad, decoded_text, f"Mojibake pattern '{bad}' detected in dataset!")

    def test_fuzzing_resilience_on_queries(self):
        """Fuzz lookup handlers with malformed, boundary, and injection strings."""
        by_codigo = {c["codigo_comuna"]: c for c in self.comunas}

        def client_lookup(key: Any) -> Any:
            """Simulates a client-side or API resolver querying by codigo_comuna."""
            if not isinstance(key, (str, int)):
                return None
            return by_codigo.get(str(key))

        malformed_inputs = [
            "", "   ", None, "CL-XI-99", "11101' OR 1=1 --", "<script>alert(1)</script>",
            "\x00", "\n\r", "CL-xi-01", 11101, -1, 3.14159, {}, [], True, False
        ]

        for bad in malformed_inputs:
            # Query by codigo_comuna should return None, never crash
            try:
                res = client_lookup(bad)
                self.assertIsNone(res, f"Unexpected match for malformed input: {bad}")
            except Exception as e:
                self.fail(f"Lookup crashed on malformed input '{bad}': {e}")


def run_adversarial_suite():
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestComunasAdversarialIntegrity)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    print("\n" + "=" * 75)
    print(f"ADVERSARIAL STRESS SUITE RESULTS: Ran {result.testsRun} tests.")
    if result.wasSuccessful():
        print(">>> VERDICT: ALL ADVERSARIAL STRESS TESTS PASSED CLEANLY (APPROVE) <<<")
    else:
        print(f">>> VERDICT: VULNERABILITIES DETECTED ({len(result.failures)} failures, {len(result.errors)} errors) (FAIL) <<<")
    print("=" * 75)

    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_adversarial_suite()
    sys.exit(0 if success else 1)
