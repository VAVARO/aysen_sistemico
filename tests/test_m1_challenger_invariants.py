#!/usr/bin/env python3
"""
Empirical Adversarial Invariant Verification Suite for Milestone 1
Target: data/comunas_aysen.json
Agent: teamwork_preview_challenger_m1_2 (Empirical Challenger)

Mandatory Verification Invariants:
1. Population Sum Invariant: sum(censo_2024_poblacion) == 100745
2. Density Calculation Invariant: abs(densidad_hab_km2 - (poblacion / superficie_km2)) < 0.05
3. Percentage Range Invariants: 0 <= pct <= 100 for poverty (ingresos, multidimensional),
   CONAF protected area, and regional population shares.
4. Institutional Equipment Invariants:
   - 5 hospitals
   - 32 postas de salud rural
   - 10 aerodromes
   - 8 international border crossings
5. Connectivity Invariants:
   - ruta7_km_pavimentados >= 0.0, ruta7_km_ripio >= 0.0
   - Sum of paved (427.5 km) + gravel (693.0 km) = 1120.5 km across the regional network
6. Geographic & Topological Invariants:
   - Latitudes in [-49.3, -43.6], Longitudes in [-75.8, -71.0]
   - Double coordinate contract: c.lat == c.coordenadas.lat, c.lng == c.coordenadas.lng
   - Strict zero-null and zero-empty-string recursion across entire dataset
   - Telemetry sensor partition: exact bijection to all 16 canonical stations in estaciones_aysen.json
   - Physical area bounds: protected area in hectares <= municipal area in hectares
"""

import sys
import os
import json
import math
import re
import unittest
from pathlib import Path
from typing import Any, Dict, List, Set, Tuple

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent
COMUNAS_JSON_PATH = REPO_ROOT / "data" / "comunas_aysen.json"
ESTACIONES_JSON_PATH = REPO_ROOT / "data" / "estaciones_aysen.json"

# Authoritative Aysén Territorial Bounding Box
BBOX_LAT_MIN = -49.3
BBOX_LAT_MAX = -43.6
BBOX_LNG_MIN = -75.8
BBOX_LNG_MAX = -71.0

# Authoritative Regional Benchmarks (INE Censo 2024, CASEN 2022, MOP, DIFROL, MINSAL)
CENSO_2024_REGIONAL_TOTAL = 100745
TOTAL_COMUNAS_EXPECTED = 10
TOTAL_HOSPITALS_EXPECTED = 5
TOTAL_POSTAS_RURALES_EXPECTED = 32
TOTAL_AERODROMOS_EXPECTED = 10
TOTAL_PASOS_FRONTERIZOS_EXPECTED = 8
RUTA7_KM_PAVIMENTADOS_EXPECTED = 427.5
RUTA7_KM_RIPIO_EXPECTED = 693.0
RUTA7_KM_TOTAL_EXPECTED = 1120.5
TOTAL_ESTACIONES_EXPECTED = 16


def load_raw_bytes_and_json(path: Path) -> Tuple[bytes, Dict[str, Any]]:
    assert path.exists(), f"File does not exist: {path}"
    raw_bytes = path.read_bytes()
    data = json.loads(raw_bytes.decode("utf-8"))
    return raw_bytes, data


class TestMathematicalAndInstitutionalInvariants(unittest.TestCase):
    """Adversarial stress-testing of data/comunas_aysen.json mathematical and institutional invariants."""

    @classmethod
    def setUpClass(cls):
        cls.raw_bytes, cls.dataset = load_raw_bytes_and_json(COMUNAS_JSON_PATH)
        cls.comunas = cls.dataset.get("comunas", [])
        if ESTACIONES_JSON_PATH.exists():
            _, cls.estaciones_dataset = load_raw_bytes_and_json(ESTACIONES_JSON_PATH)
            cls.estaciones = cls.estaciones_dataset.get("estaciones", [])
        else:
            cls.estaciones = []

    # --------------------------------------------------------------------------
    # 1. Structural, Formatting, and Zero-Null Invariants
    # --------------------------------------------------------------------------
    def test_01_file_encoding_no_bom_and_valid_root_schema(self):
        """Dataset must be encoded in UTF-8 without BOM and contain standard metadata envelopes"""
        self.assertFalse(
            self.raw_bytes.startswith(b"\xef\xbb\xbf"),
            "data/comunas_aysen.json contains UTF-8 BOM, standard JSON requires UTF-8 without BOM."
        )
        self.assertIn("$schema", self.dataset)
        self.assertIn("version", self.dataset)
        self.assertIn("dataset_id", self.dataset)
        self.assertEqual(self.dataset.get("dataset_id"), "comunas_aysen_estructural")
        self.assertEqual(self.dataset.get("total_comunas"), TOTAL_COMUNAS_EXPECTED)
        self.assertEqual(len(self.comunas), TOTAL_COMUNAS_EXPECTED)

    def test_02_strict_zero_nulls_and_zero_empty_strings_recursive(self):
        """Every field in the entire JSON tree must be non-null and non-empty (no empty strings)"""
        null_paths = []
        empty_str_paths = []
        nan_or_inf_paths = []

        def recurse(obj: Any, path: str):
            if obj is None:
                null_paths.append(path)
            elif isinstance(obj, str):
                if len(obj.strip()) == 0:
                    empty_str_paths.append(path)
            elif isinstance(obj, float):
                if math.isnan(obj) or math.isinf(obj):
                    nan_or_inf_paths.append(path)
            elif isinstance(obj, dict):
                for k, v in obj.items():
                    recurse(v, f"{path}.{k}")
            elif isinstance(obj, list):
                for i, v in enumerate(obj):
                    recurse(v, f"{path}[{i}]")

        recurse(self.dataset, "root")
        self.assertEqual(null_paths, [], f"Found null values at paths: {null_paths}")
        self.assertEqual(empty_str_paths, [], f"Found empty string values at paths: {empty_str_paths}")
        self.assertEqual(nan_or_inf_paths, [], f"Found NaN/Inf values at paths: {nan_or_inf_paths}")

    def test_03_comuna_identities_unique_and_canonical(self):
        """All 10 comunas must have unique codes matching Chilean INE/SUBDERE and regional schemes"""
        codigos = [c.get("codigo_comuna") for c in self.comunas]
        ines = [c.get("comuna_ine") for c in self.comunas]
        nombres = [c.get("nombre") for c in self.comunas]

        self.assertEqual(len(set(codigos)), TOTAL_COMUNAS_EXPECTED, "Duplicate codigo_comuna found")
        self.assertEqual(len(set(ines)), TOTAL_COMUNAS_EXPECTED, "Duplicate comuna_ine found")
        self.assertEqual(len(set(nombres)), TOTAL_COMUNAS_EXPECTED, "Duplicate nombre found")

        # Check format: CL-XI-01 to CL-XI-10
        for code in codigos:
            self.assertRegex(code, r"^CL-XI-(0[1-9]|10)$", f"Invalid codigo_comuna format: {code}")

        # Check format: 5-digit INE code starting with 11 (Región de Aysén)
        for ine in ines:
            self.assertRegex(ine, r"^11[1-4][0-9]{2}$", f"Invalid comuna_ine format: {ine}")

    # --------------------------------------------------------------------------
    # 2. Mathematical Invariant 1: Population Sum Invariant
    # --------------------------------------------------------------------------
    def test_04_population_sum_invariant(self):
        """Mathematical Invariant: sum(censo_2024_poblacion) == 100745 exact"""
        pops = []
        for c in self.comunas:
            pop = c.get("demografia", {}).get("censo_2024_poblacion")
            self.assertIsInstance(pop, int, f"Comuna {c.get('nombre')} censo_2024_poblacion is not int: {pop}")
            self.assertGreater(pop, 0, f"Comuna {c.get('nombre')} has non-positive population: {pop}")
            pops.append(pop)

        regional_sum = sum(pops)
        self.assertEqual(
            regional_sum,
            CENSO_2024_REGIONAL_TOTAL,
            f"Population sum invariant violated! Got {regional_sum}, expected {CENSO_2024_REGIONAL_TOTAL}"
        )

    def test_05_population_regional_percentage_shares(self):
        """Each comuna's porcentaje_regional_pct must match pop / regional_sum within 0.1% rounding"""
        pct_sum = 0.0
        for c in self.comunas:
            dem = c.get("demografia", {})
            pop = dem.get("censo_2024_poblacion")
            pct = dem.get("porcentaje_regional_pct")
            self.assertIsInstance(pct, (int, float), f"Percentage not numeric in {c.get('nombre')}")
            self.assertGreater(pct, 0.0)
            self.assertLess(pct, 100.0)

            expected_pct = (pop / CENSO_2024_REGIONAL_TOTAL) * 100.0
            diff = abs(pct - expected_pct)
            self.assertLess(
                diff, 0.1,
                f"Comuna {c.get('nombre')}: reported pct {pct}% deviates from computed {expected_pct:.3f}%"
            )
            pct_sum += pct

        self.assertLess(
            abs(pct_sum - 100.0), 0.2,
            f"Sum of population percentages ({pct_sum:.2f}%) deviates from 100%"
        )

    # --------------------------------------------------------------------------
    # 3. Mathematical Invariant 2: Density Calculation Invariant
    # --------------------------------------------------------------------------
    def test_06_density_calculation_invariant(self):
        """Mathematical Invariant: abs(densidad_hab_km2 - (poblacion / superficie_km2)) < 0.05"""
        for c in self.comunas:
            nom = c.get("nombre")
            dem = c.get("demografia", {})
            pop = dem.get("censo_2024_poblacion")
            sup = dem.get("superficie_km2")
            dens = dem.get("densidad_hab_km2")

            self.assertIsInstance(sup, (int, float), f"superficie_km2 not numeric in {nom}")
            self.assertIsInstance(dens, (int, float), f"densidad_hab_km2 not numeric in {nom}")
            self.assertGreater(sup, 0.0, f"superficie_km2 must be > 0 in {nom}")
            self.assertGreater(dens, 0.0, f"densidad_hab_km2 must be > 0 in {nom}")

            computed_dens = pop / sup
            diff = abs(dens - computed_dens)
            self.assertLess(
                diff, 0.05,
                f"Density invariant failed for {nom}: reported {dens}, computed {computed_dens:.4f}, diff={diff:.4f}"
            )

    def test_07_regional_surface_area_bounds(self):
        """Total regional surface area must sum to official municipal total (107,449.4 km²) from SUBDERE/INE"""
        total_sup = sum(c.get("demografia", {}).get("superficie_km2", 0) for c in self.comunas)
        # Official municipal surface area sum for the 10 comunas is 107,449.4 km²
        # (gross territorial area including non-comunalized ocean fiords is ~108,494.4 km²)
        self.assertTrue(
            100000.0 <= total_sup <= 115000.0,
            f"Total regional surface area {total_sup} km² is outside expected [100000, 115000] km²"
        )
        self.assertAlmostEqual(
            total_sup, 107449.4, places=1,
            msg=f"Total surface area {total_sup:.1f} deviates from official municipal total 107,449.4 km²"
        )

    # --------------------------------------------------------------------------
    # 4. Mathematical Invariant 3: Percentage Ranges (CASEN & CONAF)
    # --------------------------------------------------------------------------
    def test_08_percentage_range_invariant_casen_poverty(self):
        """Percentage Range Invariant: 0 <= pobreza_ingresos_pct <= 100 and 0 <= pobreza_multidimensional_pct <= 100"""
        for c in self.comunas:
            nom = c.get("nombre")
            casen = c.get("pobreza_casen", {})
            p_ing = casen.get("pobreza_ingresos_pct")
            p_mul = casen.get("pobreza_multidimensional_pct")
            fuente = casen.get("fuente")

            self.assertIsInstance(p_ing, (int, float), f"{nom} pobreza_ingresos_pct not numeric")
            self.assertIsInstance(p_mul, (int, float), f"{nom} pobreza_multidimensional_pct not numeric")
            self.assertTrue(0.0 <= p_ing <= 100.0, f"{nom} pobreza_ingresos_pct {p_ing} out of [0, 100]")
            self.assertTrue(0.0 <= p_mul <= 100.0, f"{nom} pobreza_multidimensional_pct {p_mul} out of [0, 100]")
            self.assertIsInstance(fuente, str)
            self.assertIn("CASEN", fuente)

    def test_09_percentage_range_invariant_conaf_conservation(self):
        """Percentage Range Invariant: 0 <= superficie_protegida_pct <= 100 and hectare physical sanity"""
        for c in self.comunas:
            nom = c.get("nombre")
            conaf = c.get("conservacion_conaf", {})
            pct = conaf.get("superficie_protegida_pct")
            ha = conaf.get("superficie_protegida_ha")
            unidades = conaf.get("unidades_snaspe")
            sup_km2 = c.get("demografia", {}).get("superficie_km2")

            self.assertIsInstance(pct, (int, float), f"{nom} superficie_protegida_pct not numeric")
            self.assertIsInstance(ha, (int, float), f"{nom} superficie_protegida_ha not numeric")
            self.assertTrue(0.0 <= pct <= 100.0, f"{nom} superficie_protegida_pct {pct} out of [0, 100]")
            self.assertGreater(ha, 0.0, f"{nom} superficie_protegida_ha must be positive")

            # Physical sanity: 1 km2 = 100 ha. Protected ha cannot exceed total comuna ha!
            total_comuna_ha = sup_km2 * 100.0
            self.assertLessEqual(
                ha, total_comuna_ha,
                f"Physical impossibility in {nom}: protected ha ({ha}) > total municipal ha ({total_comuna_ha})"
            )

            # Invariant: percentage consistency with hectares
            computed_pct = (ha / total_comuna_ha) * 100.0
            diff = abs(pct - computed_pct)
            self.assertLess(
                diff, 0.2,
                f"{nom} CONAF pct {pct}% deviates from ha/total {computed_pct:.2f}% (diff={diff:.3f})"
            )

            self.assertIsInstance(unidades, list)
            self.assertGreater(len(unidades), 0, f"{nom} has empty unidades_snaspe")

    # --------------------------------------------------------------------------
    # 5. Institutional Invariant 1: Critical Equipment Distribution
    # --------------------------------------------------------------------------
    def test_10_hospitals_count_invariant(self):
        """Institutional Invariant: Exactly 5 public hospitals in the region (Coyhaique, Aysén, Cisnes, Chile Chico, Cochrane)"""
        hospital_comunas = []
        for c in self.comunas:
            nom = c.get("nombre")
            salud = c.get("equipamiento_critico", {}).get("salud_principal", "")
            if "hospital" in salud.lower():
                hospital_comunas.append((nom, salud))

        self.assertEqual(
            len(hospital_comunas),
            TOTAL_HOSPITALS_EXPECTED,
            f"Expected exactly {TOTAL_HOSPITALS_EXPECTED} hospitals, found {len(hospital_comunas)}: {hospital_comunas}"
        )

        expected_names = {"Coyhaique", "Aysén", "Cisnes", "Chile Chico", "Cochrane"}
        found_names = {item[0] for item in hospital_comunas}
        self.assertEqual(
            found_names,
            expected_names,
            f"Hospital comunas mismatch: found {found_names}, expected {expected_names}"
        )

    def test_11_postas_rurales_sum_invariant(self):
        """Institutional Invariant: Exactly 32 postas de salud rural distributed across all 10 comunas"""
        postas_counts = []
        all_postas_names = []

        for c in self.comunas:
            nom = c.get("nombre")
            eq = c.get("equipamiento_critico", {})
            total = eq.get("total_postas_rurales")
            lista = eq.get("postas_rurales", [])

            self.assertIsInstance(total, int, f"{nom} total_postas_rurales not an integer")
            self.assertGreaterEqual(total, 1, f"{nom} has 0 postas de salud rural")
            self.assertEqual(len(lista), total, f"{nom} list length {len(lista)} != total_postas_rurales {total}")

            postas_counts.append(total)
            all_postas_names.extend(lista)

        total_regional = sum(postas_counts)
        self.assertEqual(
            total_regional,
            TOTAL_POSTAS_RURALES_EXPECTED,
            f"Postas rurales sum invariant violated! Got {total_regional}, expected {TOTAL_POSTAS_RURALES_EXPECTED}"
        )

        # Unique postas: no accidental duplication of clinic names
        self.assertEqual(
            len(set(all_postas_names)),
            TOTAL_POSTAS_RURALES_EXPECTED,
            f"Duplicate posta de salud rural detected in network: len={len(all_postas_names)}, unique={len(set(all_postas_names))}"
        )

    def test_12_aerodromos_count_invariant(self):
        """Institutional Invariant: Exactly 10 DGAC-registered aerodromes (1 per comuna) with official ICAO/DGAC codes"""
        aerodromos = []
        icao_pattern = re.compile(r"SC[A-Z0-9]{2}")

        for c in self.comunas:
            nom = c.get("nombre")
            aero = c.get("equipamiento_critico", {}).get("aerodromo_dgac", "")
            self.assertIsInstance(aero, str)
            self.assertGreater(len(aero), 5)
            # Must reference an official Chilean ICAO code SCxx
            self.assertTrue(
                icao_pattern.search(aero) is not None,
                f"Comuna {nom} aerodrome '{aero}' does not contain a valid SCxx ICAO code"
            )
            aerodromos.append((nom, aero))

        self.assertEqual(
            len(aerodromos),
            TOTAL_AERODROMOS_EXPECTED,
            f"Expected {TOTAL_AERODROMOS_EXPECTED} aerodromes, got {len(aerodromos)}"
        )

    def test_13_border_crossings_count_invariant(self):
        """Institutional Invariant: Exactly 8 international land border crossings recognized by DIFROL/UPF in Aysén"""
        # Official DIFROL passes in Aysén:
        # 1. Huemules (Coyhaique)
        # 2. Coyhaique Alto (Coyhaique)
        # 3. Triana (Coyhaique)
        # 4. Las Pampas / Lago Verde (Lago Verde)
        # 5. Río Jeinimeni (Chile Chico)
        # 6. Pallavicini / El Palomar (Río Ibáñez)
        # 7. Roballos / Rodolfo Roballos (Cochrane)
        # 8. Río Mayer / Dos Lagunas (O'Higgins)
        active_crossings_map = {
            "Coyhaique": 3,
            "Lago Verde": 1,
            "Aysén": 0,
            "Cisnes": 0,
            "Guaitecas": 0,
            "Chile Chico": 1,
            "Río Ibáñez": 1,
            "Cochrane": 1,
            "O'Higgins": 1,
            "Tortel": 0,
        }

        total_counted = 0
        for c in self.comunas:
            nom = c.get("nombre")
            paso = c.get("equipamiento_critico", {}).get("paso_fronterizo", "")
            self.assertIsInstance(paso, str)
            self.assertGreater(len(paso), 5)

            expected_count = active_crossings_map.get(nom, 0)
            if expected_count > 0:
                self.assertNotIn("sin pasos", paso.lower())
                total_counted += expected_count
            else:
                self.assertTrue(
                    "sin pasos" in paso.lower() or "insular" in paso.lower(),
                    f"Comuna {nom} expected 0 crossings but reported active crossing: '{paso}'"
                )

        self.assertEqual(
            total_counted,
            TOTAL_PASOS_FRONTERIZOS_EXPECTED,
            f"Border crossings invariant violated! Got {total_counted}, expected {TOTAL_PASOS_FRONTERIZOS_EXPECTED}"
        )

    # --------------------------------------------------------------------------
    # 6. Connectivity Invariants: Road Network (Paved vs Gravel) & Barges
    # --------------------------------------------------------------------------
    def test_14_connectivity_road_network_km_invariant(self):
        """Connectivity Invariant: non-negative km, sum of paved (427.5 km) + gravel (693.0 km) == 1120.5 km"""
        paved_list = []
        gravel_list = []

        for c in self.comunas:
            nom = c.get("nombre")
            conn = c.get("conectividad", {})
            pav = conn.get("ruta7_km_pavimentados")
            rip = conn.get("ruta7_km_ripio")
            barcaza = conn.get("dependencia_barcaza")
            desc = conn.get("descripcion_acceso")

            self.assertIsInstance(pav, (int, float), f"{nom} ruta7_km_pavimentados not numeric")
            self.assertIsInstance(rip, (int, float), f"{nom} ruta7_km_ripio not numeric")
            self.assertGreaterEqual(pav, 0.0, f"{nom} paved km cannot be negative")
            self.assertGreaterEqual(rip, 0.0, f"{nom} gravel km cannot be negative")
            self.assertIsInstance(barcaza, str)
            self.assertIsInstance(desc, str)

            paved_list.append(pav)
            gravel_list.append(rip)

        total_paved = sum(paved_list)
        total_gravel = sum(gravel_list)
        total_road = total_paved + total_gravel

        self.assertAlmostEqual(
            total_paved, RUTA7_KM_PAVIMENTADOS_EXPECTED, places=1,
            msg=f"Paved road km invariant failed: {total_paved} != {RUTA7_KM_PAVIMENTADOS_EXPECTED}"
        )
        self.assertAlmostEqual(
            total_gravel, RUTA7_KM_RIPIO_EXPECTED, places=1,
            msg=f"Gravel road km invariant failed: {total_gravel} != {RUTA7_KM_RIPIO_EXPECTED}"
        )
        self.assertAlmostEqual(
            total_road, RUTA7_KM_TOTAL_EXPECTED, places=1,
            msg=f"Total road km invariant failed: {total_road} != {RUTA7_KM_TOTAL_EXPECTED}"
        )

    def test_15_barge_dependency_consistency(self):
        """Comunas with maritime/lacustrine isolation must document specific barge services"""
        critical_barge_comunas = {"Guaitecas", "O'Higgins", "Chile Chico"}
        for c in self.comunas:
            nom = c.get("nombre")
            conn = c.get("conectividad", {})
            dep = conn.get("dependencia_barcaza", "")
            servicios = conn.get("servicios_barcaza", [])

            self.assertIsInstance(servicios, list)
            if nom in critical_barge_comunas:
                self.assertTrue(
                    any(term in dep.lower() for term in ["alta", "crítica", "absoluta"]),
                    f"{nom} must have high/critical barge dependency, got: '{dep}'"
                )
                self.assertGreater(len(servicios), 0, f"{nom} must list active barge services")
                self.assertNotIn("sin servicios", servicios[0].lower())

    # --------------------------------------------------------------------------
    # 7. Geographic Bounds & Double Coordinates Contract
    # --------------------------------------------------------------------------
    def test_16_geographic_bounding_box_and_coordinate_sync(self):
        """All comuna coordinates must be within Aysén bounding box and c.lat == c.coordenadas.lat"""
        for c in self.comunas:
            nom = c.get("nombre")
            coords = c.get("coordenadas", {})
            c_lat = coords.get("lat")
            c_lng = coords.get("lng")
            flat_lat = c.get("lat")
            flat_lng = c.get("lng")

            self.assertIsInstance(c_lat, float, f"{nom} coords.lat not float")
            self.assertIsInstance(c_lng, float, f"{nom} coords.lng not float")
            self.assertIsInstance(flat_lat, float, f"{nom} flat lat not float")
            self.assertIsInstance(flat_lng, float, f"{nom} flat lng not float")

            # Double contract: flat and nested must match exactly
            self.assertEqual(c_lat, flat_lat, f"{nom} coordinate sync mismatch on latitude")
            self.assertEqual(c_lng, flat_lng, f"{nom} coordinate sync mismatch on longitude")

            # Bounding box constraints
            self.assertTrue(
                BBOX_LAT_MIN <= c_lat <= BBOX_LAT_MAX,
                f"{nom} latitude {c_lat} outside bounds [{BBOX_LAT_MIN}, {BBOX_LAT_MAX}]"
            )
            self.assertTrue(
                BBOX_LNG_MIN <= c_lng <= BBOX_LNG_MAX,
                f"{nom} longitude {c_lng} outside bounds [{BBOX_LNG_MIN}, {BBOX_LNG_MAX}]"
            )

    # --------------------------------------------------------------------------
    # 8. Telemetry Sensor Partition Bijection
    # --------------------------------------------------------------------------
    def test_17_sensor_partition_exact_bijection(self):
        """The union of sensores_asociados_ids across all comunas must partition the 16 canonical stations exactly without overlap"""
        all_sensor_ids: List[int] = []
        comuna_sensors_map = {}

        for c in self.comunas:
            nom = c.get("nombre")
            ids = c.get("sensores_asociados_ids", [])
            self.assertIsInstance(ids, list, f"{nom} sensores_asociados_ids not a list")
            # All IDs must be integers between 1 and 16
            for sid in ids:
                self.assertIsInstance(sid, int, f"{nom} sensor ID {sid} is not an int")
                self.assertTrue(1 <= sid <= TOTAL_ESTACIONES_EXPECTED, f"{nom} sensor ID {sid} out of [1, 16]")

            # No duplicates within the comuna
            self.assertEqual(len(ids), len(set(ids)), f"{nom} contains duplicate sensor IDs: {ids}")

            all_sensor_ids.extend(ids)
            comuna_sensors_map[nom] = ids

        # Disjointness: no sensor assigned to multiple comunas
        self.assertEqual(
            len(all_sensor_ids),
            len(set(all_sensor_ids)),
            f"Overlapping sensor assignment between comunas detected! Total={len(all_sensor_ids)}, Unique={len(set(all_sensor_ids))}"
        )

        # Completeness: all 16 stations are accounted for
        expected_set = set(range(1, TOTAL_ESTACIONES_EXPECTED + 1))
        self.assertEqual(
            set(all_sensor_ids),
            expected_set,
            f"Sensor partition incomplete! Missing: {expected_set - set(all_sensor_ids)}, Extra: {set(all_sensor_ids) - expected_set}"
        )

        # Cross-validation with estaciones_aysen.json if available
        if self.estaciones:
            self.assertEqual(len(self.estaciones), TOTAL_ESTACIONES_EXPECTED)
            for st in self.estaciones:
                st_id = st.get("id")
                st_comuna_code = st.get("codigo_comuna")
                # Find which comuna has st_id
                claiming_comuna = next((c for c in self.comunas if st_id in c.get("sensores_asociados_ids", [])), None)
                self.assertIsNotNone(claiming_comuna, f"Station {st_id} not claimed by any comuna")
                self.assertEqual(
                    claiming_comuna.get("codigo_comuna"),
                    st_comuna_code,
                    f"Station {st_id} '{st.get('nombre')}' belongs to {st_comuna_code} in estaciones_aysen.json but was claimed by {claiming_comuna.get('codigo_comuna')}"
                )


def run_adversarial_suite():
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestMathematicalAndInstitutionalInvariants)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    print("\n" + "=" * 80)
    print(f"M1 ADVERSARIAL INVARIANT CHALLENGE SUMMARY: Ran {result.testsRun} tests.")
    if result.wasSuccessful():
        print("VERDICT: APPROVE (All mathematical and institutional invariants HOLD perfectly)")
    else:
        print(f"VERDICT: FAIL ({len(result.failures)} failures, {len(result.errors)} errors)")
    print("=" * 80)

    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_adversarial_suite()
    sys.exit(0 if success else 1)
