#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_no_slop_hub_network.py
=============================================================================
Suite de verificación editorial y topológica anti-slop:
1. Cero emojis en index.html, laboratorio.html, data/aysen_hubs_data.js y scripts.
2. Cero palabras de relleno de IA en systemicBridges y límite <= 22 palabras por nota.
3. Ausencia de contenedor flotante .legend-overlay sobre el lienzo SVG en index.html
   y presencia de la franja superior plana integrada de filtros tipográficos y selector de eje.
4. Conexiones inter-hub bidireccionales y simétricas con grado entre 4 y 5 en los
   Hubs VIII (Salud), IX (Cultura) y X (CTCi), y para todos los 39 nodos.
5. Inclusión estricta de las 9 relaciones declaradas obligatorias.
6. Estilo plano de filas en el drawer (#drawer-related-list) sin tarjetas con borde ni sombras.
=============================================================================
"""

import os
import re
import json
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

EMOJI_REGEX = re.compile(
    r'[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]',
    flags=re.UNICODE
)

BLACKLIST = [
    'paradoja', 'fascinante', 'sinergia', 'holístico', 'holistico',
    'vibrante', 'crucial', 'fundamental', 'entramado', 'imperativo',
    'catalizador', 'complejidad multidimensional'
]

VALID_AXES = {
    'all',
    'energia_aire_salud',
    'ciencia_mar_clima',
    'conectividad_salud_rural',
    'cultura_turismo_educacion',
    'produccion_fisco_empleo'
}


class TestNoSlopHubNetwork(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Cargar aysen_hubs_data.js
        hubs_path = os.path.join(ROOT, 'data', 'aysen_hubs_data.js')
        with open(hubs_path, 'r', encoding='utf-8') as f:
            raw = f.read()
        start = raw.find('{')
        end = raw.rfind('}')
        cls.data = json.loads(raw[start:end+1])
        cls.nodos = cls.data.get('nodos', [])
        cls.hubs = cls.data.get('hubs', [])
        cls.bridges = cls.data.get('systemicBridges', [])
        cls.node_by_id = {n['id']: n for n in cls.nodos}

        # Cargar index.html
        index_path = os.path.join(ROOT, 'index.html')
        with open(index_path, 'r', encoding='utf-8') as f:
            cls.index_html = f.read()

        # Cargar laboratorio.html
        lab_path = os.path.join(ROOT, 'laboratorio.html')
        with open(lab_path, 'r', encoding='utf-8') as f:
            cls.lab_html = f.read()

    def test_01_zero_emojis(self):
        """Verifica CERO emojis Unicode en index.html, laboratorio.html, bundle y script."""
        files = [
            os.path.join(ROOT, 'index.html'),
            os.path.join(ROOT, 'laboratorio.html'),
            os.path.join(ROOT, 'data', 'aysen_hubs_data.js'),
            os.path.join(ROOT, 'scripts', 'build_aysen_hubs_bundle.cjs')
        ]
        for fpath in files:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            matches = EMOJI_REGEX.findall(content)
            self.assertEqual(len(matches), 0, f"Emojis detectados en {os.path.basename(fpath)}: {matches}")

    def test_02_zero_ai_cliches_in_systemic_bridges(self):
        """Verifica ausencia de clichés de IA y cumplimiento de límite <= 22 palabras por nota."""
        self.assertGreaterEqual(len(self.bridges), 40, "Deben existir puentes sistémicos inter-nodo")
        for b in self.bridges:
            note = b.get('relationNote', '')
            self.assertTrue(note, f"Puente {b} sin relationNote")
            words = note.split()
            self.assertLessEqual(
                len(words), 22,
                f"Nota supera las 22 palabras ({len(words)} palabras): '{note}'"
            )
            note_lower = note.lower()
            for cliché in BLACKLIST:
                self.assertNotIn(
                    cliché, note_lower,
                    f"Cliché de IA detectado ('{cliché}') en nota: '{note}'"
                )
            self.assertIn(b.get('axis'), VALID_AXES, f"Eje inválido '{b.get('axis')}' en puente {b}")
            self.assertTrue(b.get('varX'), f"Falta varX en puente {b}")
            self.assertTrue(b.get('varY'), f"Falta varY en puente {b}")

    def test_03_no_floating_legend_overlay_over_svg(self):
        """Verifica ausencia de .legend-overlay flotante sobre el SVG y presencia de franja plana."""
        # Comprobar que .legend-overlay no exista
        self.assertNotIn('legend-overlay', self.index_html, "index.html no debe contener la clase .legend-overlay")
        # Comprobar que dentro del d3-canvas-container no haya leyenda flotante
        canvas_match = re.search(r'<div[^>]*id="d3-canvas-container"[^>]*>(.*?)</div>\s*</div>\s*</div>', self.index_html, re.DOTALL)
        if canvas_match:
            inner_canvas = canvas_match.group(1)
            self.assertNotIn('d3-hubs-legend', inner_canvas, "d3-canvas-container no debe contener la leyenda flotante d3-hubs-legend")

        # Comprobar la existencia de la franja superior plana
        self.assertIn('id="d3-filter-strip"', self.index_html, "Debe existir la franja superior plana #d3-filter-strip")
        self.assertIn('id="d3-axis-selector"', self.index_html, "Debe existir el selector de eje #d3-axis-selector")
        self.assertIn('id="d3-hub-toggles"', self.index_html, "Deben existir los toggles tipográficos #d3-hub-toggles")
        # Comprobar tooltip reactivo sobrio
        self.assertIn('id="d3-tooltip"', self.index_html, "Debe existir #d3-tooltip")
        self.assertIn('#0f172a', self.index_html, "El tooltip debe tener fondo sobrio #0f172a")

    def test_04_hubs_viii_ix_x_bidirectional_inter_hub_connections(self):
        """Verifica que todos los nodos de Salud, Cultura y CTCi tengan entre 4 y 5 conexiones inter-hub bidireccionales."""
        target_nodes = {
            24: 'salud', 38: 'salud', 39: 'salud',
            32: 'cultura', 33: 'cultura', 34: 'cultura',
            35: 'ctci', 36: 'ctci', 37: 'ctci'
        }

        for nid, hub in target_nodes.items():
            node = self.node_by_id[nid]
            related = node.get('relatedNodeIds', [])
            self.assertGreaterEqual(
                len(related), 4,
                f"Nodo #{nid:02d} ({hub}) tiene {len(related)} conexiones, se requieren al menos 4"
            )
            self.assertLessEqual(
                len(related), 5,
                f"Nodo #{nid:02d} ({hub}) tiene {len(related)} conexiones, máximo permitido es 5"
            )

            for target_id in related:
                target_node = self.node_by_id[target_id]
                # Requisito inter-hub: deben pertenecer a distintos hubs
                self.assertNotEqual(
                    node['hubId'], target_node['hubId'],
                    f"Conexión #{nid:02d} ↔ #{target_id:02d} es intra-hub ({node['hubId']})"
                )
                # Requisito de simetría bidireccional
                self.assertIn(
                    nid, target_node.get('relatedNodeIds', []),
                    f"Falta simetría: #{nid} lista a #{target_id}, pero #{target_id} no lista a #{nid}"
                )
                # Requisito de existencia de puente en systemicBridges
                bridge = next(
                    (b for b in self.bridges if (b['source'] == nid and b['target'] == target_id) or (b['source'] == target_id and b['target'] == nid)),
                    None
                )
                self.assertIsNotNone(
                    bridge,
                    f"No existe objeto en systemicBridges para el enlace #{nid} ↔ #{target_id}"
                )

    def test_05_all_39_nodes_symmetry_and_degrees(self):
        """Verifica que los 39 nodos (#01 a #39) tengan entre 4 y 5 conexiones inter-hub 100% simétricas."""
        self.assertEqual(len(self.nodos), 39, "Deben existir exactamente 39 nodos")
        for node in self.nodos:
            nid = node['id']
            related = node.get('relatedNodeIds', [])
            self.assertGreaterEqual(len(related), 4, f"Nodo #{nid:02d} tiene menos de 4 conexiones ({len(related)})")
            self.assertLessEqual(len(related), 5, f"Nodo #{nid:02d} tiene más de 5 conexiones ({len(related)})")

            for rid in related:
                r_node = self.node_by_id[rid]
                self.assertNotEqual(node['hubId'], r_node['hubId'], f"Nodo #{nid} y #{rid} comparten hub {node['hubId']}")
                self.assertIn(nid, r_node.get('relatedNodeIds', []), f"Falta simetría entre #{nid} y #{rid}")

    def test_06_nine_mandatory_bridges_included(self):
        """Verifica la inclusión exacta de las 9 relaciones concretas especificadas en la tarea."""
        mandatory_pairs = [
            (38, 14, "Las postas rurales en comunas sin redundancia FOA dependen de enlaces satelitales para interconsulta con el Hospital de Coyhaique."),
            (24, 30, "Los episodios invernales sobre norma de MP2.5 en Coyhaique y Aysén incrementan las consultas respiratorias de urgencia."),
            (39, 12, "El costo eléctrico BT1 frena la calefacción limpia, sosteniendo la combustión de leña húmeda y la morbilidad respiratoria."),
            (32, 4, "Comunas con alta visitación a parques nacionales (Ibáñez, Tortel, Cisnes) registran baja infraestructura museográfica local."),
            (33, 18, "El fondo concursable del 8% FNDR constituye la principal vía de financiamiento cultural en comunas sin oferta privada."),
            (34, 25, "En localidades aisladas, las escuelas públicas SLEP y bibliotecas SNBP operan como la única infraestructura cultural activa."),
            (35, 28, "Más del 70% de los proyectos ANID ejecutados en cuencas y glaciares de Aysén son liderados por universidades extrarregionales."),
            (36, 6, "La actividad acuícola en Cisnes, Aysén y Guaitecas contrasta con la concentración de capacidades I+D en la comuna de Coyhaique."),
            (37, 20, "Los proyectos de innovación productiva CORFO buscan desarrollar proveedores locales para reducir la compra extrarregional.")
        ]

        for s, t, expected_note in mandatory_pairs:
            bridge = next(
                (b for b in self.bridges if (b['source'] == s and b['target'] == t) or (b['source'] == t and b['target'] == s)),
                None
            )
            self.assertIsNotNone(bridge, f"Relación obligatoria #{s} ↔ #{t} no encontrada en systemicBridges")
            self.assertEqual(
                bridge['relationNote'], expected_note,
                f"La nota del puente #{s} ↔ #{t} no coincide exactamente con el texto contractual requerido:\n"
                f"Esperado: {expected_note}\nActual:   {bridge['relationNote']}"
            )

    def test_07_drawer_flat_list_and_lab_cross_link(self):
        """Verifica filas planas con bordes de 1px en el Drawer y enlaces 'Cruzar en Laboratorio →'."""
        self.assertIn('Cruzar en Laboratorio →', self.index_html, "El drawer debe incluir enlaces 'Cruzar en Laboratorio →'")
        self.assertIn('laboratorio.html?varX=', self.index_html, "El enlace debe incluir parámetros varX y varY")
        self.assertIn('border-bottom: 1px solid #e2e8f0', self.index_html, "Las filas del drawer deben usar border-bottom: 1px solid #e2e8f0")
        self.assertIn('window.openDrawer = openDrawer', self.index_html, "openDrawer debe estar disponible globalmente")

    def test_08_d3_topology_hub_positions_and_force_link(self):
        """Verifica la cuadrícula 2x5 de hubPositions, strength: 0 en forceLink y curvas SVG en index.html."""
        # Franja superior integrada con estilo exacto
        self.assertIn(
            'style="border-bottom: 1px solid #e2e8f0; background: #ffffff; padding: 8px 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;"',
            self.index_html,
            "La franja superior debe tener el estilo de contenedor contractual exacto"
        )
        # hubPositions en 2 filas y 5 columnas
        self.assertIn('height * 0.28', self.index_html, "Fila superior de Hubs debe ubicarse en y: 0.28")
        self.assertIn('height * 0.72', self.index_html, "Fila inferior de Hubs debe ubicarse en y: 0.72")
        for x_ratio in ['0.13', '0.31', '0.50', '0.69', '0.87']:
            self.assertIn(f'width * {x_ratio}', self.index_html, f"Columna x: {x_ratio} debe existir en hubPositions")

        # forceLink inter-node con strength: 0
        self.assertRegex(
            self.index_html,
            r"if\s*\(\s*d\.type\s*===\s*['\"]inter-node['\"]\s*\)\s*return\s*0",
            "Los enlaces inter-node deben tener strength: 0 en forceLink"
        )
        # Trazo de aristas inter-node como curvas cuadráticas <path>
        self.assertIn('M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}', self.index_html, "Las aristas deben ser curvas cuadráticas <path>")
        # Tooltip con fuentes IBM Plex Mono y Sans
        self.assertIn('IBM Plex Mono', self.index_html, "El tooltip debe usar IBM Plex Mono en línea 1")
        self.assertIn('IBM Plex Sans', self.index_html, "El tooltip debe usar IBM Plex Sans en línea 2")


if __name__ == '__main__':
    unittest.main()

