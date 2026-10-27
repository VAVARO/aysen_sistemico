#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_laboratorio_drag_gpu_raf.py
=============================================================================
Auditoría y verificación de optimización de arrastre de ventanas en Laboratorio:
1. Arrastre de tarjetas analíticas en bindCardEvents:
   - Registro de startCardX y startCardY al iniciar drag.
   - Cálculo en espacio mundo virtual y actualización numérica en memoria de w.x y w.y.
   - Traslación vía GPU con translate3d(${dx}px, ${dy}px, 0) sin tocar left/top durante el movimiento.
   - Coalescencia rAF de updateConnections() con guardia connectionsPending y connectionsRafId.
   - Consolidación limpia al soltar: transform = '', asignación de left/top, updateConnections(), handleCardDropCollision(w) y autoSave().
   - Cancelación de rAF pendiente con cancelAnimationFrame al soltar (mouseup / touchend).
   - Soporte equivalente en eventos táctiles (touchstart, touchmove, touchend).
   - Bloqueo de arrastre si el lienzo está en modo grilla (AppState.dashboardViewMode === 'grid') o móvil apilado (isStackedLayout()).
2. Paneo y zoom de lienzo:
   - Erradicación de llamadas redundantes a updateConnections() en mousemove panning.
   - Erradicación de llamadas redundantes a updateConnections() en wheel zoom.
   - Erradicación de llamadas redundantes a updateConnections() en touchmove panning y pinch-to-zoom.
3. Tarjetas de reflexión (renderReflectionCardDOM):
   - Traslación vía GPU translate3d con coalescencia rAF.
   - Cancelación de rAF pendiente con cancelAnimationFrame al soltar.
   - Consolidación limpia al soltar en mouseup y touchend.
   - Bloqueo de arrastre en modo grilla y móvil apilado.
4. Robustez en colisiones y soltado de tarjetas (handleCardDropCollision):
   - Limpieza incondicional de la clase .drag-target-hover de todas las tarjetas.
   - Posicionamiento desplazado a la derecha (target.x + target.w + 50) y actualización síncrona de conexiones.
=============================================================================
"""

import os
import re
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")


class TestLaboratorioDragGpuRaf(unittest.TestCase):

    def setUp(self):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            self.lab_html = f.read()

    def test_01_bind_card_events_gpu_drag_and_raf_coalescing(self):
        """bindCardEvents debe usar translate3d, rAF coalescing y consolidación al soltar."""
        m = re.search(r'function bindCardEvents\(w,\s*card\)\s*\{(.*?)\n\s*// Redimensionado Libre 2D', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m, "Debe existir function bindCardEvents(w, card)")
        code = m.group(1)

        # Registro de posición inicial
        self.assertIn("startCardX = w.x", code)
        self.assertIn("startCardY = w.y", code)

        # Actualización de w.x, w.y y GPU transform durante mousemove
        self.assertIn("w.x = currentWorldX", code)
        self.assertIn("w.y = currentWorldY", code)
        self.assertIn("translate3d(", code)

        # Coalescencia rAF
        self.assertIn("connectionsPending", code)
        self.assertIn("requestAnimationFrame", code)

        # Consolidación al soltar en mouseup
        self.assertIn("card.style.transform = ''", code)
        self.assertIn("card.style.left = `${w.x}px`", code)
        self.assertIn("card.style.top = `${w.y}px`", code)
        self.assertIn("handleCardDropCollision(w)", code)

    def test_02_bind_card_events_touch_drag_parity(self):
        """El arrastre táctil de tarjetas debe usar la misma arquitectura GPU + rAF."""
        m = re.search(r'function bindCardEvents\(w,\s*card\)\s*\{(.*?)\n\s*// Redimensionado Libre 2D', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m)
        code = m.group(1)

        self.assertIn("touchStartCardX = w.x", code)
        self.assertIn("touchStartCardY = w.y", code)
        self.assertIn("w.x = currentWorldX", code)
        self.assertIn("w.y = currentWorldY", code)
        self.assertIn("translate3d(", code)

    def test_03_canvas_pan_and_zoom_no_redundant_connections(self):
        """El paneo y zoom de lienzo no deben invocar updateConnections()."""
        # 1. mousemove panning
        m_pan = re.search(r'if\s*\(AppState\.isPanning\)\s*\{([\s\S]*?)\}\s*\n\s*\}\);\s*\n\s*window\.addEventListener\(\'mouseup\'', self.lab_html)
        self.assertIsNotNone(m_pan, "Debe encontrar el bloque if (AppState.isPanning) en mousemove")
        pan_code = m_pan.group(1)
        self.assertNotIn("updateConnections()", pan_code, "mousemove panning no debe invocar updateConnections()")

        # 2. wheel zoom
        m_wheel = re.search(r'viewport\.addEventListener\(\'wheel\',\s*\(e\)\s*=>\s*\{([\s\S]*?)\},\s*\{\s*passive:\s*false\s*\}\);', self.lab_html)
        self.assertIsNotNone(m_wheel, "Debe encontrar listener de wheel")
        wheel_code = m_wheel.group(1)
        self.assertNotIn("updateConnections()", wheel_code, "wheel zoom no debe invocar updateConnections()")

        # 3. touchmove panning y zoom
        m_touchmove = re.search(r'window\.addEventListener\(\'touchmove\',\s*\(e\)\s*=>\s*\{([\s\S]*?)\},\s*\{\s*passive:\s*false\s*\}\);', self.lab_html)
        self.assertIsNotNone(m_touchmove, "Debe encontrar listener de touchmove")
        touch_code = m_touchmove.group(1)
        self.assertNotIn("updateConnections()", touch_code, "touchmove pan/zoom no debe invocar updateConnections()")

    def test_04_reflection_cards_gpu_drag_and_raf(self):
        """renderReflectionCardDOM debe usar traslación GPU translate3d con coalescencia rAF."""
        m = re.search(r'function renderReflectionCardDOM\(r\)\s*\{(.*?)\n\s*function cycleReflectionQuestion', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m, "Debe existir function renderReflectionCardDOM(r)")
        code = m.group(1)

        self.assertIn("startCardX = r.x", code)
        self.assertIn("startCardY = r.y", code)
        self.assertIn("r.x = currentWorldX", code)
        self.assertIn("r.y = currentWorldY", code)
        self.assertIn("translate3d(", code)
        self.assertIn("connectionsPending", code)
        self.assertIn("requestAnimationFrame", code)
        self.assertIn("card.style.transform = ''", code)
        self.assertIn("card.style.left = `${r.x}px`", code)
        self.assertIn("card.style.top = `${r.y}px`", code)

    def test_05_cancel_animation_frame_on_release(self):
        """Al soltar la tarjeta (mouseup/touchend), se debe cancelar el rAF pendiente para evitar ticks obsoletos."""
        m_card = re.search(r'function bindCardEvents\(w,\s*card\)\s*\{(.*?)\n\s*// Redimensionado Libre 2D', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_card)
        card_code = m_card.group(1)
        self.assertIn("cancelAnimationFrame(connectionsRafId)", card_code, "bindCardEvents debe invocar cancelAnimationFrame")

        m_refl = re.search(r'function renderReflectionCardDOM\(r\)\s*\{(.*?)\n\s*function cycleReflectionQuestion', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_refl)
        refl_code = m_refl.group(1)
        self.assertIn("cancelAnimationFrame(connectionsRafId)", refl_code, "renderReflectionCardDOM debe invocar cancelAnimationFrame")

    def test_06_handle_card_drop_collision_hover_cleanup_and_sequencing(self):
        """handleCardDropCollision debe limpiar .drag-target-hover y actualizar conexiones tras posicionar."""
        m_col = re.search(r'function handleCardDropCollision\(sourceW\)\s*\{(.*?)\n\s*// ===', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_col, "Debe existir function handleCardDropCollision(sourceW)")
        col_code = m_col.group(1)

        # Debe limpiar drag-target-hover para no dejar bordes punteados colgados en tarjetas
        self.assertIn("classList.remove('drag-target-hover')", col_code, "Debe limpiar drag-target-hover al soltar")

        # Debe actualizar conexiones tras desplazar la tarjeta fuente
        idx_shift = col_code.find("sourceW.x = target.x + target.w + 50")
        idx_update = col_code.find("updateConnections()")
        self.assertTrue(idx_shift > 0, "Debe desplazar sourceW.x al colisionar")
        self.assertTrue(idx_update > idx_shift, "updateConnections() debe ejecutarse tras el desplazamiento")

    def test_07_grid_and_stacked_mode_drag_guards(self):
        """No se debe permitir arrastrar tarjetas en modo grilla o en vista apilada móvil."""
        m_card = re.search(r'function bindCardEvents\(w,\s*card\)\s*\{(.*?)\n\s*// Redimensionado Libre 2D', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_card)
        card_code = m_card.group(1)
        self.assertIn("AppState.dashboardViewMode === 'grid'", card_code)

        m_refl = re.search(r'function renderReflectionCardDOM\(r\)\s*\{(.*?)\n\s*function cycleReflectionQuestion', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_refl)
        refl_code = m_refl.group(1)
        self.assertIn("AppState.dashboardViewMode === 'grid'", refl_code)
        self.assertIn("isStackedLayout()", refl_code)


if __name__ == "__main__":
    unittest.main()
