#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_spatial_multilayer_map.py
=============================================================================
Suite de QA Espacial (Frente 3):
Verifica el Sistema Cartográfico Multicapa y Bivariado en:
  - data/comunas_aysen.json (geometria_geojson de las 10 comunas)
  - scripts/build_aysen_hubs_bundle.cjs -> data/aysen_hubs_data.js
    (comunasGeoJSON, spatialNodes, spatialNodesByLayer, spatialLayersCatalog,
     localidadesCoords)
  - laboratorio.html (Nivel 1 L.geoJSON Coropleta + Nivel 2 L.circleMarker
     Nodos Georreferenciados + Nivel 3 L.circle Radios 25 km + Controles UI)
=============================================================================
"""

import json
import math
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_bundle_json():
    bundle_path = ROOT / "data" / "aysen_hubs_data.js"
    raw = bundle_path.read_text(encoding="utf-8")
    marker = "window.AYSEN_HUBS_DATA = "
    idx = raw.find(marker)
    assert idx != -1, "No se encontro window.AYSEN_HUBS_DATA en data/aysen_hubs_data.js"
    payload = raw[idx + len(marker):].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


class TestSpatialMultilayerMap(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle_json()
        cls.lab_html = (ROOT / "laboratorio.html").read_text(encoding="utf-8")

    def test_01_spatial_nodes_within_aysen_bounding_box_and_non_null(self):
        """El 100% de los puntos en spatialNodes cae dentro de Aysén [-49.5, -43.5] lat y [-76.0, -71.0] lon."""
        nodes = self.bundle.get("spatialNodes", [])
        self.assertGreaterEqual(len(nodes), 300, f"Se esperaban >= 300 nodos georreferenciados, hay {len(nodes)}")

        required_layers = {
            "concesiones_acuicolas",
            "centrales_electricas",
            "proyectos_seia",
            "hospitales_postas",
            "escuelas_slep",
            "volcanes_sismos",
            "parques_snaspe",
            "estaciones_monitoreo",
            "museos_cultura",
            "centros_ctci",
            "gobernanza_obras",
            "justicia_sma",
        }
        seen_layers = set()

        for n in nodes:
            nid = n.get("id")
            lat = n.get("lat")
            lon = n.get("lon")
            self.assertIsNotNone(lat, f"lat nulo en {nid}")
            self.assertIsNotNone(lon, f"lon nulo en {nid}")
            self.assertFalse(math.isnan(float(lat)) or math.isnan(float(lon)), f"NaN en coordenadas de {nid}")
            self.assertNotEqual((float(lat), float(lon)), (0.0, 0.0), f"Coordenada [0,0] en {nid}")
            self.assertGreaterEqual(float(lat), -49.5, f"Latitud al sur de Aysén en {nid}: {lat}")
            self.assertLessEqual(float(lat), -43.5, f"Latitud al norte de Aysén en {nid}: {lat}")
            self.assertGreaterEqual(float(lon), -76.0, f"Longitud al oeste de Aysén en {nid}: {lon}")
            self.assertLessEqual(float(lon), -71.0, f"Longitud al este de Aysén en {nid}: {lon}")

            seen_layers.add(n.get("layerKey"))
            self.assertTrue(str(n.get("nombre", "")).strip(), f"Nombre vacio en {nid}")
            self.assertTrue(str(n.get("titular", "")).strip(), f"Titular vacio en {nid}")
            self.assertGreater(float(n.get("magnitudeValue", 0)), 0, f"Magnitud no positiva en {nid}")

        self.assertEqual(required_layers - seen_layers, set(), f"Capas faltantes en spatialNodes: {required_layers - seen_layers}")

    def test_02_comunas_geojson_polygons_valid_and_in_bounds(self):
        """comunasGeoJSON debe contener las 10 comunas de Aysén con polígonos dentro del bounding box."""
        fc = self.bundle.get("comunasGeoJSON", {})
        self.assertEqual(fc.get("type"), "FeatureCollection")
        features = fc.get("features", [])
        self.assertEqual(len(features), 10, f"Se esperaban 10 polígonos comunales, hay {len(features)}")

        for feat in features:
            props = feat.get("properties", {})
            geom = feat.get("geometry", {})
            self.assertEqual(geom.get("type"), "Polygon")
            rings = geom.get("coordinates", [])
            self.assertGreaterEqual(len(rings), 1)
            self.assertGreaterEqual(len(rings[0]), 5, f"Polígono de {props.get('nombre')} con muy pocos vértices")
            for lon, lat in rings[0]:
                self.assertGreaterEqual(lat, -49.5)
                self.assertLessEqual(lat, -43.5)
                self.assertGreaterEqual(lon, -76.0)
                self.assertLessEqual(lon, -71.0)

    def test_03_localidades_aysen_coords_dictionary(self):
        """El geocodificador canónico LOCALIDADES_AYSEN_COORDS debe cubrir >= 45 localidades de Aysén."""
        locs = self.bundle.get("localidadesCoords", {})
        self.assertGreaterEqual(len(locs), 45, f"Se esperaban >= 45 localidades en localidadesCoords, hay {len(locs)}")
        for k in ["Melinka", "Repollal", "Puerto Aguirre", "Caleta Andrade", "Puerto Gala", "Puerto Gaviota",
                  "Puyuhuapi", "Puerto Cisnes", "La Junta", "Puerto Chacabuco", "Balmaceda",
                  "Villa Cerro Castillo", "Bahia Murta", "Puerto Rio Tranquilo", "Puerto Guadal",
                  "Puerto Bertrand", "Caleta Tortel", "Villa O'Higgins"]:
            self.assertIn(k, locs, f"Falta localidad canónica {k} en LOCALIDADES_AYSEN_COORDS")
            c = locs[k]
            self.assertTrue(-49.5 <= c["lat"] <= -43.5 and -76.0 <= c["lon"] <= -71.0)

    def test_04_map_presets_have_canonical_spatial_layers(self):
        """Los 10 presets [MAP] (#1 de cada Hub + CP_01 + CT_01) deben declarar spatialLayer válida."""
        by_layer = self.bundle.get("spatialNodesByLayer", {})
        hubs_gal = self.bundle.get("hubsGallery", {})
        ext_gal = self.bundle.get("extension_gallery", {})

        map_presets = []
        for g in list(hubs_gal.values()) + list(ext_gal.values()):
            for p in g.get("presets", []):
                if p.get("format_type") == "map":
                    map_presets.append(p)

        self.assertEqual(len(map_presets), 10, f"Se esperaban 10 presets format_type='map', hay {len(map_presets)}")
        for p in map_presets:
            cfg = p.get("config", {})
            sl = cfg.get("spatialLayer")
            self.assertIn(sl, by_layer, f"Preset {p.get('preset_id')} tiene spatialLayer inválida: {sl}")
            self.assertGreater(len(by_layer[sl]), 0, f"Capa {sl} vacía para preset {p.get('preset_id')}")

    def test_05_laboratorio_multilayer_leaflet_engine_and_ui_controls(self):
        """laboratorio.html debe integrar L.geoJSON, L.circleMarker, L.circle, selector de capas y leyenda."""
        self.assertIn("L.geoJSON(geojsonData", self.lab_html)
        self.assertIn("L.circle([bc.lat, bc.lon]", self.lab_html)
        self.assertIn("L.circleMarker([n.lat, n.lon]", self.lab_html)
        self.assertIn("map-spatial-layer-select", self.lab_html)
        self.assertIn("btn-map-buffer-toggle", self.lab_html)
        self.assertIn("map-bivariate-legend", self.lab_html)
        self.assertIn("resolveActiveSpatialLayerKey", self.lab_html)
        self.assertNotIn("Visualización Espacial No Aplicable", self.lab_html)


if __name__ == "__main__":
    unittest.main(verbosity=2)
