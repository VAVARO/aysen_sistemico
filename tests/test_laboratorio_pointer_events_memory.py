#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_laboratorio_pointer_events_memory.py
=============================================================================
Auditoría y verificación de Arquitectura de Puntero Unificada y Cero Listeners Zombi
en Laboratorio Sistémico (laboratorio.html):

1. Unificación con Pointer Events y Pointer Capture en bindCardEvents:
   - Uso de pointerdown, pointermove, pointerup, pointercancel y lostpointercapture.
   - Invocación de header.setPointerCapture(e.pointerId) y releasePointerCapture.
   - Cero listeners permanentes en window (0 llamadas a window.addEventListener en bindCardEvents).
   - Coalescencia rAF de updateConnections() con connectionsPending y connectionsRafId.
   - Limpieza de rAF con cancelAnimationFrame(connectionsRafId) al soltar.
   - Cláusulas de guarda para layout apilado y modo grilla.

2. Unificación en Redimensionado (resizeHandle):
   - Uso de pointerdown, pointermove, pointerup, pointercancel y lostpointercapture en resizeHandle.
   - Invocación de resizeHandle.setPointerCapture(e.pointerId) y releasePointerCapture.
   - Coalescencia rAF para resize() / invalidateSize() / updateConnections() con resizePending y resizeRafId.
   - Limpieza de rAF con cancelAnimationFrame(resizeRafId) al soltar.
   - Cero listeners permanentes en window para el redimensionador.

3. Unificación en Tarjetas de Reflexión (renderReflectionCardDOM):
   - Uso de pointerdown, pointermove, pointerup, pointercancel y lostpointercapture en card.
   - Invocación de card.setPointerCapture(e.pointerId) y releasePointerCapture.
   - Cero listeners permanentes en window en renderReflectionCardDOM.
   - Coalescencia rAF y cancelación al soltar.

4. Limpieza del Ciclo de Vida y Prevención de Fugas de Memoria:
   - Declaración de hook _cleanup en cada widget (w._cleanup) y reflexión (r._cleanup).
   - Invocación de w._cleanup() en removeWidget.
   - Invocación de r._cleanup() en removeReflectionCard.
   - Invocación de _cleanup() en clearAll para todos los widgets y reflexiones.

5. Contrato CSS touch-action:
   - touch-action: none en .studio-widget-card, .card-resize-handle y .studio-reflection-card.
=============================================================================
"""

import os
import re
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")


class TestLaboratorioPointerEventsMemory(unittest.TestCase):

    def setUp(self):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            self.lab_html = f.read()

    def test_01_bind_card_events_pointer_architecture_and_zero_window_listeners(self):
        """bindCardEvents debe usar Pointer Events con pointer capture y 0 listeners en window."""
        m = re.search(r'function bindCardEvents\(w,\s*card\)\s*\{(.*?)\n\s*// Título editable', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m, "Debe existir function bindCardEvents(w, card)")
        code = m.group(1)

        # Cero listeners en window dentro de bindCardEvents
        self.assertNotIn("window.addEventListener", code, "bindCardEvents NO debe registrar listeners en window")

        # Pointer Events en header
        self.assertIn("header.addEventListener('pointerdown'", code)
        self.assertIn("header.addEventListener('pointermove'", code)
        self.assertIn("header.addEventListener('pointerup'", code)
        self.assertIn("header.addEventListener('pointercancel'", code)
        self.assertIn("header.addEventListener('lostpointercapture'", code)

        # Pointer Capture
        self.assertIn("header.setPointerCapture(e.pointerId)", code)
        self.assertIn("header.releasePointerCapture(e.pointerId)", code)

        # Coalescencia rAF de conexiones y cancelación
        self.assertIn("connectionsPending", code)
        self.assertIn("connectionsRafId = requestAnimationFrame", code)
        self.assertIn("cancelAnimationFrame(connectionsRafId)", code)

        # Hook de limpieza en widget
        self.assertIn("w._cleanup = () =>", code)

    def test_02_resize_handle_pointer_architecture_and_raf_coalescing(self):
        """resizeHandle debe usar Pointer Events, pointer capture y coalescencia rAF para resize()."""
        m = re.search(r'// Redimensionado Libre 2D(.*?)\n\s*w\._cleanup =', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m, "Debe existir bloque de Redimensionado Libre 2D")
        code = m.group(1)

        # Cero listeners en window en redimensionado
        self.assertNotIn("window.addEventListener", code, "El redimensionado NO debe registrar listeners en window")

        # Pointer Events en resizeHandle
        self.assertIn("resizeHandle.addEventListener('pointerdown'", code)
        self.assertIn("resizeHandle.addEventListener('pointermove'", code)
        self.assertIn("resizeHandle.addEventListener('pointerup'", code)
        self.assertIn("resizeHandle.addEventListener('pointercancel'", code)
        self.assertIn("resizeHandle.addEventListener('lostpointercapture'", code)

        # Pointer Capture en resizeHandle
        self.assertIn("resizeHandle.setPointerCapture(e.pointerId)", code)
        self.assertIn("resizeHandle.releasePointerCapture(e.pointerId)", code)

        # Coalescencia rAF en redimensionado
        self.assertIn("resizePending", code)
        self.assertIn("resizeRafId = requestAnimationFrame", code)
        self.assertIn("cancelAnimationFrame(resizeRafId)", code)
        self.assertIn("w.instance.resize()", code)
        self.assertIn("w.instance.invalidateSize()", code)

    def test_03_reflection_cards_pointer_architecture_and_zero_window_listeners(self):
        """renderReflectionCardDOM debe usar Pointer Events con pointer capture y 0 listeners en window."""
        m = re.search(r'function renderReflectionCardDOM\(r\)\s*\{(.*?)\n\s*function cycleReflectionQuestion', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m, "Debe existir function renderReflectionCardDOM(r)")
        code = m.group(1)

        # Cero listeners en window en renderReflectionCardDOM
        self.assertNotIn("window.addEventListener", code, "renderReflectionCardDOM NO debe registrar listeners en window")

        # Pointer Events en card de reflexión
        self.assertIn("card.addEventListener('pointerdown'", code)
        self.assertIn("card.addEventListener('pointermove'", code)
        self.assertIn("card.addEventListener('pointerup'", code)
        self.assertIn("card.addEventListener('pointercancel'", code)
        self.assertIn("card.addEventListener('lostpointercapture'", code)

        # Pointer Capture
        self.assertIn("card.setPointerCapture(e.pointerId)", code)
        self.assertIn("card.releasePointerCapture(e.pointerId)", code)

        # Coalescencia rAF y cancelación
        self.assertIn("connectionsPending", code)
        self.assertIn("requestAnimationFrame", code)
        self.assertIn("cancelAnimationFrame(connectionsRafId)", code)

        # Hook de limpieza en reflexión
        self.assertIn("r._cleanup = () =>", code)

    def test_04_card_lifecycle_cleanup_hooks(self):
        """removeWidget, removeReflectionCard y clearAll deben invocar los hooks de limpieza _cleanup."""
        # 1. removeWidget
        m_rw = re.search(r'function removeWidget\(widgetId,\s*opts\s*=\s*\{\}\)\s*\{(.*?)\n\s*function updateStatus', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_rw, "Debe existir function removeWidget")
        rw_code = m_rw.group(1)
        self.assertIn("w._cleanup()", rw_code, "removeWidget debe invocar w._cleanup()")

        # 2. removeReflectionCard
        m_rr = re.search(r'function removeReflectionCard\(rId\)\s*\{(.*?)\n\s*function addConnection', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_rr, "Debe existir function removeReflectionCard")
        rr_code = m_rr.group(1)
        self.assertIn("r._cleanup()", rr_code, "removeReflectionCard debe invocar r._cleanup()")

        # 3. clearAll
        m_ca = re.search(r'function clearAll\(opts\s*=\s*\{\}\)\s*\{(.*?)\n\s*// ===', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_ca, "Debe existir function clearAll")
        ca_code = m_ca.group(1)
        self.assertIn("w._cleanup()", ca_code, "clearAll debe invocar w._cleanup() para todos los widgets")
        self.assertIn("r._cleanup()", ca_code, "clearAll debe invocar r._cleanup() para todas las reflexiones")

    def test_05_css_touch_action_none_on_draggable_and_resizable_elements(self):
        """Los elementos arrastrables y redimensionables deben tener touch-action: none en CSS."""
        # 1. .studio-widget-card (regla base de tarjeta)
        m_card = re.search(r'^\s*\.studio-widget-card\s*\{([^}]*)\}', self.lab_html, re.MULTILINE)
        self.assertIsNotNone(m_card)
        self.assertIn("touch-action: none", m_card.group(1))

        # 2. .card-resize-handle
        m_resize = re.search(r'\.card-resize-handle\s*\{([^}]*)\}', self.lab_html)
        self.assertIsNotNone(m_resize)
        self.assertIn("touch-action: none", m_resize.group(1))

        # 3. .studio-reflection-card
        m_refl = re.search(r'\.studio-reflection-card\s*\{([^}]*)\}', self.lab_html)
        self.assertIsNotNone(m_refl)
        self.assertIn("touch-action: none", m_refl.group(1))


if __name__ == "__main__":
    unittest.main()
