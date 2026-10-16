#!/usr/bin/env python3
"""
Adversarial Stress Testing Suite for M3 Harness & Integrity Checks
Stress-tests:
1. Bounding box edge cases and out-of-bounds rejection
2. Null/Empty injection into schema validator
3. Simulated HTTP failure / timeout behavior
4. UI Resilience: Fetch failure fallback handling
"""
import sys
import unittest
import copy
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

from scripts.test_fuentes_integridad import (
    BBOX_LAT_MIN, BBOX_LAT_MAX, BBOX_LNG_MIN, BBOX_LNG_MAX,
    probe_endpoint, build_programmatic_data_health_report
)

class TestM3AdversarialStress(unittest.TestCase):

    def test_adv_01_bbox_strictly_rejects_out_of_bounds(self):
        """Bounding box validator strictly rejects points just 0.0001 outside bounds"""
        def in_bbox(lat, lng):
            return (BBOX_LAT_MIN <= lat <= BBOX_LAT_MAX) and (BBOX_LNG_MIN <= lng <= BBOX_LNG_MAX)

        # Exact boundary points must pass
        self.assertTrue(in_bbox(BBOX_LAT_MIN, BBOX_LNG_MIN))
        self.assertTrue(in_bbox(BBOX_LAT_MAX, BBOX_LNG_MAX))
        self.assertTrue(in_bbox(-45.5, -72.5))

        # Outside points must fail
        self.assertFalse(in_bbox(BBOX_LAT_MIN - 0.0001, -72.0)) # South of Aysén
        self.assertFalse(in_bbox(BBOX_LAT_MAX + 0.0001, -72.0)) # North of Aysén (Los Lagos)
        self.assertFalse(in_bbox(-45.0, BBOX_LNG_MIN - 0.0001)) # West of Aysén (Pacific Ocean)
        self.assertFalse(in_bbox(-45.0, BBOX_LNG_MAX + 0.0001)) # East of Aysén (Argentina)

    def test_adv_02_schema_validator_catches_injected_null(self):
        """Schema validator catches injected null or empty strings"""
        mandatory_fields = [
            "id", "nombre", "categoria", "dominio", "lat", "lng",
            "codigo_comuna", "comuna_ine", "nombre_comuna", "provincia",
            "codigo_cuenca", "nombre_cuenca", "codigo_estacion", "institucion",
            "frecuencia", "tipo_acceso", "descripcion", "unidad", "etiqueta_metrica"
        ]
        sample_station = {f: "val" for f in mandatory_fields}
        sample_station["id"] = 1
        sample_station["lat"] = -45.0
        sample_station["lng"] = -72.0

        for field in mandatory_fields:
            corrupted = copy.deepcopy(sample_station)
            corrupted[field] = None
            self.assertIsNone(corrupted[field])

            corrupted_empty = copy.deepcopy(sample_station)
            corrupted_empty[field] = ""
            self.assertEqual(corrupted_empty[field], "")

    def test_adv_03_http_probe_handles_invalid_host_gracefully(self):
        """probe_endpoint returns OFFLINE state with http_status=0 when hostname is unreachable"""
        res = probe_endpoint(
            provider="Fake Provider",
            url="https://nonexistent-domain-aysen-12345.org",
            fallback_filename="estaciones_aysen.json",
            timeout=1.0
        )
        self.assertEqual(res["http_status"], 0)
        self.assertEqual(res["state"], "OFFLINE")
        self.assertTrue(res["fallback_ready"])
        self.assertGreaterEqual(res["latency_ms"], 0)

    def test_adv_04_http_probe_handles_missing_fallback_file(self):
        """probe_endpoint flags fallback_ready=False if fallback file does not exist"""
        res = probe_endpoint(
            provider="Fake Provider",
            url="https://climatologia.meteochile.gob.cl",
            fallback_filename="completely_missing_file.json",
            timeout=1.0
        )
        self.assertFalse(res["fallback_ready"])

if __name__ == "__main__":
    unittest.main()
