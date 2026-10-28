#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_drawer_gesture_timing.py
=============================================================================
Suite de pruebas automatizadas para el Plan 05:
Soporte Gestual Móvil con Descarte por Inercia y Sincronización de Tiempos
en el Bottom-Sheet de index.html (#concept-drawer).

Verifica:
1. Sincronización de tiempos en closeConceptDrawer() (>= 280ms y transición transitionend).
2. Marcado y propiedades del tirador móvil (#drawer-handle-bar, touch-action: none).
3. Presencia de manejadores de eventos gestuales/puntero (pointerdown/move/up/cancel y touch).
4. Arrastre en tiempo real y desactivación temporal de transiciones durante el desplazamiento.
5. Umbrales físicos de descarte por inercia (deltaY > 120px o velocity > 0.11 px/ms) y rebote.
6. Cumplimiento de tokens CSS y ausencia de emojis.
=============================================================================
"""

import os
import re
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH = os.path.join(ROOT_DIR, "index.html")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)


class TestDrawerGestureTiming(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            cls.html = f.read()

    def test_01_drawer_handle_markup_and_touch_action(self):
        """El tirador móvil #drawer-handle-bar debe existir con id y touch-action: none."""
        self.assertIn('id="drawer-handle-bar"', self.html, "Falta id='drawer-handle-bar' en el tirador móvil")
        
        # Buscar el bloque del tirador móvil
        handle_match = re.search(r'<div[^>]*id="drawer-handle-bar"[^>]*>', self.html)
        self.assertIsNotNone(handle_match, "No se encontró el elemento #drawer-handle-bar")
        handle_tag = handle_match.group(0)

        self.assertTrue(
            "touch-action: none" in handle_tag or "touch-none" in handle_tag,
            "El tirador móvil debe incluir touch-action: none o clase touch-none"
        )
        self.assertIn("cursor-pointer", handle_tag, "El tirador móvil debe tener clase cursor-pointer")
        self.assertIn("md:hidden", handle_tag, "El tirador móvil debe ser visible solo en pantallas móviles (<768px)")

    def test_02_close_concept_drawer_timing_synchronization(self):
        """closeConceptDrawer() debe sincronizar el cierre a >= 280ms y escuchar transitionend."""
        # Extraer el cuerpo de la función closeConceptDrawer
        func_match = re.search(r'function closeConceptDrawer\(\)\s*\{(.*?)\n\s*function', self.html, re.DOTALL)
        self.assertIsNotNone(func_match, "No se encontró la función closeConceptDrawer()")
        code = func_match.group(1)

        # 1. No debe existir el timeout prematuro de 200ms
        self.assertNotIn(", 200)", code, "closeConceptDrawer() no debe usar timeout de 200ms")
        self.assertNotIn(", 200", code, "closeConceptDrawer() no debe contener valor 200ms")

        # 2. Debe escuchar el evento native transitionend
        self.assertIn("addEventListener('transitionend'", code, "Debe escuchar el evento transitionend en el panel")

        # 3. El temporizador de fallback debe ser >= 280ms
        timeout_match = re.search(r'setTimeout\([^,]+,\s*(\d+)\)', code)
        self.assertIsNotNone(timeout_match, "Debe existir un setTimeout de sincronización defensiva en closeConceptDrawer()")
        delay = int(timeout_match.group(1))
        self.assertGreaterEqual(delay, 280, f"El retardo ({delay}ms) debe ser >= 280ms para cubrir la animación de salida")

        # 4. Limpieza de transformaciones residuales al cerrar
        self.assertIn("panel.style.transform = ''", code, "Debe limpiar transform inline al cerrar")
        self.assertIn("panel.style.transition = ''", code, "Debe limpiar transition inline al cerrar")

    def test_03_gesture_handlers_registration(self):
        """setupDrawerGestureDismiss debe registrar manejadores pointer y touch en el tirador."""
        self.assertIn("setupDrawerGestureDismiss()", self.html, "setupDrawerGestureDismiss debe ser invocado")
        
        # Extraer setupDrawerGestureDismiss
        func_match = re.search(r'function setupDrawerGestureDismiss\(\)\s*\{(.*?)\n\s*function', self.html, re.DOTALL)
        self.assertIsNotNone(func_match, "No se encontró la función setupDrawerGestureDismiss()")
        code = func_match.group(1)

        # Pointer Events
        self.assertIn("handle.addEventListener('pointerdown'", code, "Falta pointerdown en el tirador")
        self.assertIn("handle.addEventListener('pointermove'", code, "Falta pointermove en el tirador")
        self.assertIn("handle.addEventListener('pointerup'", code, "Falta pointerup en el tirador")
        self.assertIn("handle.addEventListener('pointercancel'", code, "Falta pointercancel en el tirador")
        self.assertIn("setPointerCapture", code, "Debe capturar el puntero con setPointerCapture")
        self.assertIn("releasePointerCapture", code, "Debe liberar el puntero con releasePointerCapture")

        # Touch Events defensivos
        self.assertIn("handle.addEventListener('touchstart'", code, "Falta touchstart de respaldo")
        self.assertIn("handle.addEventListener('touchmove'", code, "Falta touchmove de respaldo")
        self.assertIn("handle.addEventListener('touchend'", code, "Falta touchend de respaldo")

    def test_04_drag_tracking_and_realtime_transform(self):
        """Durante el arrastre debe desactivar transition y trasladar con translateY en tiempo real."""
        func_match = re.search(r'function setupDrawerGestureDismiss\(\)\s*\{(.*?)\n\s*function', self.html, re.DOTALL)
        self.assertIsNotNone(func_match)
        code = func_match.group(1)

        # Registro de posición y tiempo inicial
        self.assertIn("startY = clientY", code, "Debe registrar startY en el inicio del toque")
        self.assertIn("startTime = performance.now()", code, "Debe registrar startTime = performance.now()")

        # Desactivación de transición durante el arrastre
        self.assertIn("panel.style.transition = 'none'", code, "Debe desactivar panel.style.transition = 'none' al iniciar arrastre")

        # Cálculo de deltaY unidireccional hacia abajo
        self.assertIn("Math.max(0, currentY - startY)", code, "Debe calcular deltaY = Math.max(0, currentY - startY)")

        # Traslación en tiempo real
        self.assertTrue(
            "translateY(' + deltaY + 'px)'" in code or "translateY(${deltaY}px)" in code,
            "Debe aplicar translateY con deltaY en panel.style.transform"
        )

    def test_05_inertia_thresholds_and_release_physics(self):
        """Al soltar el dedo debe evaluar inercia (deltaY > 120 o velocity > 0.11 px/ms) y restaurar var(--ease-drawer)."""
        func_match = re.search(r'function setupDrawerGestureDismiss\(\)\s*\{(.*?)\n\s*function', self.html, re.DOTALL)
        self.assertIsNotNone(func_match)
        code = func_match.group(1)

        # Restauración de token de física
        self.assertIn(
            "panel.style.transition = 'transform 0.28s var(--ease-drawer)'",
            code,
            "Debe restaurar transition con token var(--ease-drawer)"
        )

        # Cálculo de velocidad de inercia
        self.assertIn("performance.now() - startTime", code, "Debe calcular el tiempo transcurrido")
        self.assertIn("deltaY / elapsed", code, "Debe calcular velocity = deltaY / elapsed")

        # Umbrales contractuales: deltaY > 120 y velocity > 0.11
        self.assertTrue(
            re.search(r'deltaY\s*>\s*120', code) is not None,
            "Debe comprobar el umbral de distancia deltaY > 120"
        )
        self.assertTrue(
            re.search(r'velocity\s*>\s*0\.11', code) is not None,
            "Debe comprobar el umbral de velocidad velocity > 0.11"
        )

        # Acciones de descarte vs rebote
        self.assertIn("closeConceptDrawer()", code, "Debe invocar closeConceptDrawer() si supera el umbral")
        self.assertIn("translateY(0)", code, "Debe animar de vuelta a translateY(0) si no supera el umbral")

    def test_06_css_bottom_sheet_token_and_fluid_release(self):
        """El CSS para móvil debe usar el token var(--ease-drawer) y no bloquear transforms inline."""
        # CSS de #concept-drawer #drawer-panel
        self.assertRegex(
            self.html,
            r'#concept-drawer\s+#drawer-panel\s*\{[^}]*transition:\s*transform[^;]*var\(--ease-drawer\)',
            "CSS de #concept-drawer #drawer-panel debe usar var(--ease-drawer)"
        )

        # #concept-drawer.open #drawer-panel no debe tener !important en transform
        open_rule_match = re.search(r'#concept-drawer\.open\s+#drawer-panel\s*\{([^}]*)\}', self.html)
        self.assertIsNotNone(open_rule_match, "Debe existir regla CSS para #concept-drawer.open #drawer-panel")
        open_rule_content = open_rule_match.group(1)
        self.assertNotIn(
            "!important",
            open_rule_content,
            "#concept-drawer.open #drawer-panel no debe usar !important en transform para permitir gestos inline"
        )

    def test_07_zero_emojis_in_drawer_gesture_code(self):
        """index.html debe cumplir la política innegociable de cero emojis."""
        matches = EMOJI_REGEX.findall(self.html)
        self.assertEqual(len(matches), 0, f"Se detectaron emojis no permitidos en index.html: {matches}")


if __name__ == "__main__":
    unittest.main()
