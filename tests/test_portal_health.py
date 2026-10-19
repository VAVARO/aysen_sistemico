"""
Prueba de integridad y verificación del Home / Portal de Aysén (portal.html).
Verifica:
- 12 postales georeferenciadas de la Región de Aysén.
- Número de capas (layers) y puntos de muestreo (points).
- Elementos estructurales de marca personal: Álvaro Contreras Barrios en header.
- Enlaces de navegación a sistemas_complejos.html e index.html.
- Secciones Snap Click (Portada, ¿Qué es?, ¿Por qué?).
"""

import os
import re
import unittest

PORTAL_PATH = os.path.join(os.path.dirname(__file__), "..", "portal.html")

class TestPortalAysen(unittest.TestCase):
    def setUp(self):
        self.assertTrue(os.path.exists(PORTAL_PATH), "portal.html debe existir en la raíz del repositorio")
        with open(PORTAL_PATH, "r", encoding="utf-8") as f:
            self.content = f.read()

    def test_brand_header_author_name(self):
        """El header debe incluir explícitamente el nombre del autor 'Álvaro Contreras Barrios'."""
        self.assertIn("Álvaro Contreras Barrios", self.content)
        self.assertIn("brand-dot", self.content)
        self.assertIn("brandHeader", self.content)

    def test_navigation_links_to_platform_modules(self):
        """Debe contener enlaces limpios a sistemas_complejos.html e index.html."""
        self.assertIn('href="sistemas_complejos.html"', self.content)
        self.assertIn('href="index.html"', self.content)

    def test_ten_aysen_landmarks(self):
        """Deben estar declaradas exactamente las 10 postales icónicas solicitadas."""
        expected_landmarks = [
            "Cerro Castillo",
            "Capillas de Mármol",
            "Lago General Carrera desde Río Ibáñez",
            "Piedra Clavada, Chile Chico",
            "Confluencia Río Baker y Río Neff",
            "Pasarelas de Caleta Tortel",
            "Puente Presidente Ibáñez, Puerto Aysén",
            "Ventisquero Colgante Queulat",
            "Fiordo Puyuhuapi",
            "Laguna San Rafael"
        ]
        found_landmarks = re.findall(r'title:\s*"([^"]+)"', self.content)
        self.assertEqual(len(found_landmarks), 10, f"Se esperaban 10 postales, se encontraron {len(found_landmarks)}: {found_landmarks}")
        for lmk in expected_landmarks:
            self.assertIn(lmk, found_landmarks, f"Postal faltante: {lmk}")

    def test_snap_sections(self):
        """Deben existir las 4 secciones Snap Click requeridas."""
        self.assertIn('id="seccion-portada"', self.content)
        self.assertIn('id="seccion-que-es"', self.content)
        self.assertIn('id="seccion-por-que"', self.content)
        self.assertIn('id="seccion-que-encontraras"', self.content)
        self.assertIn('Aysén como un Sistema', self.content)
        self.assertIn('¿Qué es un Sistema Complejo Dinámico?', self.content)
        self.assertIn('¿Por qué hacemos esto?', self.content)
        self.assertIn('¿Qué encontrarás acá?', self.content)
        self.assertIn('Visualizador de la Complejidad', self.content)
        self.assertIn('Datos de Aysén', self.content)
        self.assertIn('Laboratorio', self.content)
        self.assertIn('Have fun!', self.content)

    def test_high_density_vector_resolution(self):
        """Verifica que el número de capas y puntos por trazo cumpla con alta resolución."""
        layers_match = re.search(r'const NUM_LAYERS\s*=\s*(\d+);', self.content)
        points_match = re.search(r'const NUM_POINTS\s*=\s*(\d+);', self.content)
        self.assertIsNotNone(layers_match, "NUM_LAYERS debe estar definido")
        self.assertIsNotNone(points_match, "NUM_POINTS debe estar definido")
        layers = int(layers_match.group(1))
        points = int(points_match.group(1))
        self.assertGreaterEqual(layers, 96, f"NUM_LAYERS ({layers}) debe ser >= 96")
        self.assertGreaterEqual(points, 192, f"NUM_POINTS ({points}) debe ser >= 192")
        print(f"Resolución de dibujo: {layers} capas x {points} puntos = {layers * points} vértices por postal")

if __name__ == "__main__":
    unittest.main()
