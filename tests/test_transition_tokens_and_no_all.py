#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_transition_tokens_and_no_all.py
------------------------------------------
Suite de verificación automatizada del Plan 04:
1. Centralización de tokens canónicos de movimiento físico en js/cabecera_global.css (:root).
2. Erradicación global de 'transition: all' en las reglas CSS de:
   - js/cabecera_global.css
   - portal.html
   - sistemas_complejos.html
   - laboratorio.html
   - index.html
3. Presencia de retroalimentación táctil (:active { transform: scale(...); }) en:
   - .brand-pill
   - .btn-editorial
   - .btn-action-tool
   - botones y elementos interactivos clave
4. Enlace universal de cabecera_global.css en los 4 módulos principales.
"""

import os
import re
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class TestTransitionTokensAndNoAll(unittest.TestCase):

    def setUp(self):
        self.cabecera_path = os.path.join(BASE_DIR, "js", "cabecera_global.css")
        self.portal_path = os.path.join(BASE_DIR, "portal.html")
        self.sistemas_path = os.path.join(BASE_DIR, "sistemas_complejos.html")
        self.laboratorio_path = os.path.join(BASE_DIR, "laboratorio.html")
        self.index_path = os.path.join(BASE_DIR, "index.html")

        with open(self.cabecera_path, "r", encoding="utf-8") as f:
            self.cabecera_css = f.read()
        with open(self.portal_path, "r", encoding="utf-8") as f:
            self.portal_html = f.read()
        with open(self.sistemas_path, "r", encoding="utf-8") as f:
            self.sistemas_html = f.read()
        with open(self.laboratorio_path, "r", encoding="utf-8") as f:
            self.laboratorio_html = f.read()
        with open(self.index_path, "r", encoding="utf-8") as f:
            self.index_html = f.read()

    def test_01_canonical_tokens_in_cabecera_global_css(self):
        """Verifica que js/cabecera_global.css declare formalmente los tokens canónicos en :root"""
        root_match = re.search(r":root\s*\{([^}]+)\}", self.cabecera_css)
        self.assertIsNotNone(root_match, "No se encontró el bloque :root en js/cabecera_global.css")
        root_block = root_match.group(1)

        expected_tokens = {
            "--ease-out": "cubic-bezier(0.23, 1, 0.32, 1)",
            "--ease-in-out": "cubic-bezier(0.77, 0, 0.175, 1)",
            "--ease-drawer": "cubic-bezier(0.32, 0.72, 0, 1)",
            "--duration-fast": "140ms",
            "--duration-normal": "200ms",
        }

        for token, val in expected_tokens.items():
            self.assertIn(token, root_block, f"Token {token} faltante en :root de js/cabecera_global.css")
            self.assertIn(val, root_block, f"Valor {val} faltante para {token} en js/cabecera_global.css")

    def test_02_brand_pill_and_mobile_menu_btn_in_cabecera(self):
        """Verifica que .brand-pill y .mobile-menu-btn usen propiedades explícitas y tengan :active"""
        self.assertNotIn("transition: all", self.cabecera_css, "js/cabecera_global.css contiene 'transition: all'")
        
        # Verificar que .brand-pill tiene transiciones explícitas
        self.assertRegex(
            self.cabecera_css,
            r"\.brand-pill\s*\{[^}]*transition:[^;]*background-color[^;]*transform",
            ".brand-pill debe tener propiedades de transición explícitas (background-color, transform, etc.)"
        )
        
        # Verificar feedback :active en .brand-pill
        self.assertRegex(
            self.cabecera_css,
            r"\.brand-pill:active\s*\{[^}]*transform:\s*scale\(0\.97\)",
            ".brand-pill:active debe aplicar transform: scale(0.97)"
        )

        # Verificar feedback :active en .mobile-menu-btn
        self.assertRegex(
            self.cabecera_css,
            r"\.mobile-menu-btn:active\s*\{[^}]*transform:\s*scale\(0\.97\)",
            ".mobile-menu-btn:active debe aplicar transform: scale(0.97)"
        )

    def test_03_zero_transition_all_in_all_target_files(self):
        """Verifica que ninguna regla CSS declare 'transition: all' en los 5 archivos del Plan 04"""
        files = {
            "js/cabecera_global.css": self.cabecera_css,
            "portal.html": self.portal_html,
            "sistemas_complejos.html": self.sistemas_html,
            "laboratorio.html": self.laboratorio_html,
            "index.html": self.index_html,
        }

        transition_all_pattern = re.compile(r"transition\s*:\s*all\b", re.IGNORECASE)

        for filename, content in files.items():
            matches = []
            for i, line in enumerate(content.splitlines(), start=1):
                if transition_all_pattern.search(line):
                    matches.append((i, line.strip()))
            self.assertEqual(
                len(matches), 0,
                f"Se detectaron {len(matches)} ocurrencias de 'transition: all' en {filename}:\n" +
                "\n".join(f"  L{m[0]}: {m[1]}" for m in matches)
            )

    def test_04_active_scale_tactile_feedback_on_key_buttons(self):
        """Verifica que los botones clave cuenten con :active { transform: scale(...); }"""
        # portal.html: .btn-editorial
        self.assertRegex(
            self.portal_html,
            r"\.btn-editorial:active\s*\{[^}]*transform:\s*scale\(0\.97\)",
            ".btn-editorial:active debe estar definido con scale(0.97) en portal.html"
        )

        # laboratorio.html: .btn-action-tool
        self.assertRegex(
            self.laboratorio_html,
            r"\.btn-action-tool:active\s*\{[^}]*transform:\s*scale\(0\.97\)",
            ".btn-action-tool:active debe estar definido con scale(0.97) en laboratorio.html"
        )

        # laboratorio.html: controles de tarjeta
        self.assertRegex(
            self.laboratorio_html,
            r"\.card-ctrl-btn:active\s*\{[^}]*transform:\s*scale\(",
            ".card-ctrl-btn:active debe estar definido con scale() en laboratorio.html"
        )

        # sistemas_complejos.html: .lang-btn
        self.assertRegex(
            self.sistemas_html,
            r"\.lang-btn:active\s*\{[^}]*transform:\s*scale\(",
            ".lang-btn:active debe estar definido con scale() en sistemas_complejos.html"
        )

    def test_05_explicit_transitions_on_btn_editorial_and_btn_action_tool(self):
        """Verifica propiedades compuestas explícitas en .btn-editorial y .btn-action-tool"""
        # .btn-editorial
        btn_editorial_match = re.search(r"\.btn-editorial\s*\{([^}]+)\}", self.portal_html)
        self.assertIsNotNone(btn_editorial_match, ".btn-editorial no encontrado en portal.html")
        btn_editorial_rules = btn_editorial_match.group(1)
        self.assertNotIn("transition: all", btn_editorial_rules)
        self.assertIn("background-color", btn_editorial_rules)
        self.assertIn("border-color", btn_editorial_rules)
        self.assertIn("transform", btn_editorial_rules)

        # .btn-action-tool
        btn_action_match = re.search(r"\.btn-action-tool\s*\{([^}]+)\}", self.laboratorio_html)
        self.assertIsNotNone(btn_action_match, ".btn-action-tool no encontrado en laboratorio.html")
        btn_action_rules = btn_action_match.group(1)
        self.assertNotIn("transition: all", btn_action_rules)
        self.assertIn("background-color", btn_action_rules)
        self.assertIn("border-color", btn_action_rules)
        self.assertIn("transform", btn_action_rules)

    def test_06_cabecera_global_css_linked_in_all_pages(self):
        """Verifica que las 4 páginas importan js/cabecera_global.css para asegurar los tokens globales"""
        pages = {
            "portal.html": self.portal_html,
            "sistemas_complejos.html": self.sistemas_html,
            "laboratorio.html": self.laboratorio_html,
            "index.html": self.index_html,
        }
        for name, html in pages.items():
            self.assertIn(
                'href="js/cabecera_global.css"', html,
                f"{name} no enlaza js/cabecera_global.css"
            )


if __name__ == "__main__":
    unittest.main()
