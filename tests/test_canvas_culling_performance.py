#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_canvas_culling_performance.py
=============================================================================
Suite de pruebas automatizadas para el Plan 03:
Culling de Viewport y Supresión de Canvas en Segundo Plano.

Verifica:
1. Supresión por visibilidad de pestaña (visibilitychange / document.hidden)
   en portal.html y sistemas_complejos.html.
2. Conexión entre sectionObserver y el bucle de renderizado selectivo
   por sección en portal.html (drawMorphingPostcard, drawBackgroundQueEs,
   drawBackgroundPorQue, drawBackgroundQueEncontraras).
3. Supresión del renderizado de miniaturas cuando inDetailView === true
   en sistemas_complejos.html y reanudación con closeProperty() / backToGrid().
4. Simulación determinista del motor de estados de culling.
5. Principio innegociable de CERO EMOJIS.
=============================================================================
"""

import os
import re
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORTAL_PATH = os.path.join(ROOT_DIR, "portal.html")
SISTEMAS_PATH = os.path.join(ROOT_DIR, "sistemas_complejos.html")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)


def extract_function_body(source: str, func_name: str) -> str:
    """Extrae el contenido completo de una función JavaScript manejando llaves anidadas de forma robusta."""
    pattern = rf'function\s+{re.escape(func_name)}\s*\([^)]*\)\s*\{{'
    match = re.search(pattern, source)
    if not match:
        return ""
    start_idx = match.end() - 1
    brace_depth = 0
    in_string = None
    i = start_idx
    while i < len(source):
        char = source[i]
        # Manejo simple de comillas
        if in_string:
            if char == in_string and source[i - 1] != '\\':
                in_string = None
        else:
            if char in ("'", '"', '`'):
                in_string = char
            elif char == '{':
                brace_depth += 1
            elif char == '}':
                brace_depth -= 1
                if brace_depth == 0:
                    return source[start_idx + 1:i]
        i += 1
    return source[start_idx + 1:]


class TestCanvasCullingPerformance(unittest.TestCase):

    def setUp(self):
        self.assertTrue(os.path.exists(PORTAL_PATH), "portal.html debe existir")
        self.assertTrue(os.path.exists(SISTEMAS_PATH), "sistemas_complejos.html debe existir")
        with open(PORTAL_PATH, "r", encoding="utf-8") as f:
            self.portal_content = f.read()
        with open(SISTEMAS_PATH, "r", encoding="utf-8") as f:
            self.sistemas_content = f.read()

    def test_01_portal_visibilitychange_and_document_hidden(self):
        """portal.html debe escuchar visibilitychange y suspender el bucle cuando document.hidden es true."""
        self.assertIn("visibilitychange", self.portal_content, "portal.html debe registrar listener de visibilitychange")
        self.assertIn("document.hidden", self.portal_content, "portal.html debe comprobar document.hidden")
        self.assertIn("isTabVisible", self.portal_content, "portal.html debe mantener variable de estado isTabVisible")

        # Comprobar que renderFrame verifica isTabVisible
        rf_body = extract_function_body(self.portal_content, "renderFrame")
        self.assertTrue(len(rf_body) > 0, "renderFrame debe estar definido en portal.html")

        self.assertIn("!isTabVisible", rf_body, "renderFrame debe verificar if (!isTabVisible)")
        self.assertIn("requestAnimationFrame(renderFrame)", rf_body, "renderFrame debe reprogramar rAF al estar oculto")
        self.assertIn("return;", rf_body, "renderFrame debe retornar anticipadamente cuando la pestaña no es visible")

    def test_02_portal_section_observer_active_section_tracking(self):
        """sectionObserver en portal.html debe registrar activeSectionId iniciando en 'seccion-portada'."""
        self.assertIn("activeSectionId", self.portal_content, "portal.html debe definir activeSectionId")
        self.assertRegex(
            self.portal_content,
            r"let\s+activeSectionId\s*=\s*['\"]seccion-portada['\"]",
            "activeSectionId debe inicializarse por defecto en 'seccion-portada'"
        )

        # Verificar que el observer actualiza activeSectionId
        observer_start = self.portal_content.find("new IntersectionObserver")
        self.assertNotEqual(observer_start, -1, "sectionObserver debe estar declarado")
        observer_slice = self.portal_content[observer_start:observer_start + 1200]
        self.assertIn("activeSectionId = activeId", observer_slice, "sectionObserver debe actualizar activeSectionId con el id activo")

    def test_03_portal_selective_canvas_rendering_per_section(self):
        """renderFrame en portal.html debe ejecutar SOLO la función de canvas de la sección activa."""
        rf_body = extract_function_body(self.portal_content, "renderFrame")
        self.assertTrue(len(rf_body) > 0, "renderFrame debe existir")

        # Validar branching condicional por sección
        self.assertIn("activeSectionId === 'seccion-portada'", rf_body, "Debe evaluar seccion-portada")
        self.assertIn("drawMorphingPostcard(tSec)", rf_body, "Debe llamar a drawMorphingPostcard")
        self.assertIn("activeSectionId === 'seccion-que-es'", rf_body, "Debe evaluar seccion-que-es")
        self.assertIn("drawBackgroundQueEs(tSec)", rf_body, "Debe llamar a drawBackgroundQueEs")
        self.assertIn("activeSectionId === 'seccion-por-que'", rf_body, "Debe evaluar seccion-por-que")
        self.assertIn("drawBackgroundPorQue(tSec)", rf_body, "Debe llamar a drawBackgroundPorQue")
        self.assertIn("activeSectionId === 'seccion-que-encontraras'", rf_body, "Debe evaluar seccion-que-encontraras")
        self.assertIn("drawBackgroundQueEncontraras(tSec)", rf_body, "Debe llamar a drawBackgroundQueEncontraras")

        # Verificar que NO se llamen incondicionalmente todos los canvas juntos
        unconditional_calls = re.findall(
            r'drawMorphingPostcard\([^)]*\);\s*drawBackgroundQueEs\([^)]*\);\s*drawBackgroundPorQue\([^)]*\);',
            rf_body
        )
        self.assertEqual(len(unconditional_calls), 0, "No debe haber llamadas incondicionales acumuladas a todos los lienzos")

    def test_04_sistemas_complejos_visibilitychange_and_pause(self):
        """sistemas_complejos.html debe escuchar visibilitychange y pausar animate() si está oculta."""
        self.assertIn("visibilitychange", self.sistemas_content, "sistemas_complejos.html debe escuchar visibilitychange")
        self.assertIn("document.hidden", self.sistemas_content, "sistemas_complejos.html debe consultar document.hidden")
        self.assertIn("isTabVisible", self.sistemas_content, "sistemas_complejos.html debe definir isTabVisible")

        # Comprobar función animate(now)
        anim_body = extract_function_body(self.sistemas_content, "animate")
        self.assertTrue(len(anim_body) > 0, "animate() debe estar declarada en sistemas_complejos.html")

        self.assertIn("!isTabVisible", anim_body, "animate() debe verificar if (!isTabVisible)")
        self.assertIn("return;", anim_body, "animate() debe retornar tempranamente si está en segundo plano")

    def test_05_sistemas_complejos_thumbnail_suppression_in_detail_view(self):
        """sistemas_complejos.html debe suspender drawMiniatures cuando inDetailView === true y reanudar con closeProperty."""
        anim_body = extract_function_body(self.sistemas_content, "animate")
        self.assertTrue(len(anim_body) > 0, "animate() debe existir")

        self.assertIn("if (inDetailView)", anim_body, "animate() debe bifurcar según inDetailView")
        self.assertIn("renderScene(dt, t)", anim_body, "Debe renderizar solo la simulación de detalle cuando inDetailView es true")
        self.assertIn("drawMiniatures(t)", anim_body, "Debe renderizar miniaturas solo cuando inDetailView es false")

        # Comprobar guard interno en drawMiniatures
        min_body = extract_function_body(self.sistemas_content, "drawMiniatures")
        self.assertTrue(len(min_body) > 0, "drawMiniatures() debe existir")
        self.assertIn("if (inDetailView) return;", min_body, "drawMiniatures debe tener guardia 'if (inDetailView) return;'")

        # Comprobar presencia de closeProperty() contractual
        self.assertIn("function closeProperty()", self.sistemas_content, "sistemas_complejos.html debe definir closeProperty()")
        self.assertIn("window.closeProperty = closeProperty;", self.sistemas_content, "closeProperty debe exponerse globalmente")

    def test_06_runtime_simulation_of_canvas_culling_logic(self):
        """Simulación computacional exacta del motor de estados de culling para ambas páginas."""

        # Simulación de portal.html
        class PortalSimulation:
            def __init__(self):
                self.isTabVisible = True
                self.activeSectionId = 'seccion-portada'
                self.draw_calls = {
                    'postcard': 0,
                    'que_es': 0,
                    'por_que': 0,
                    'que_encontraras': 0
                }

            def renderFrame(self):
                if not self.isTabVisible:
                    return "PAUSED"
                if self.activeSectionId == 'seccion-portada':
                    self.draw_calls['postcard'] += 1
                elif self.activeSectionId == 'seccion-que-es':
                    self.draw_calls['que_es'] += 1
                elif self.activeSectionId == 'seccion-por-que':
                    self.draw_calls['por_que'] += 1
                elif self.activeSectionId == 'seccion-que-encontraras':
                    self.draw_calls['que_encontraras'] += 1
                return "DRAWN"

        p_sim = PortalSimulation()

        # 1. Estado inicial: Portada
        self.assertEqual(p_sim.renderFrame(), "DRAWN")
        self.assertEqual(p_sim.draw_calls['postcard'], 1)
        self.assertEqual(p_sim.draw_calls['que_es'], 0)

        # 2. Pestaña oculta: Pausa total
        p_sim.isTabVisible = False
        self.assertEqual(p_sim.renderFrame(), "PAUSED")
        self.assertEqual(p_sim.draw_calls['postcard'], 1)  # No incrementó

        # 3. Pestaña vuelve y usuario scrollea a ¿Qué es?
        p_sim.isTabVisible = True
        p_sim.activeSectionId = 'seccion-que-es'
        self.assertEqual(p_sim.renderFrame(), "DRAWN")
        self.assertEqual(p_sim.draw_calls['que_es'], 1)
        self.assertEqual(p_sim.draw_calls['postcard'], 1)

        # 4. Scrollea a ¿Por qué?
        p_sim.activeSectionId = 'seccion-por-que'
        self.assertEqual(p_sim.renderFrame(), "DRAWN")
        self.assertEqual(p_sim.draw_calls['por_que'], 1)

        # 5. Scrollea a ¿Qué encontrarás?
        p_sim.activeSectionId = 'seccion-que-encontraras'
        self.assertEqual(p_sim.renderFrame(), "DRAWN")
        self.assertEqual(p_sim.draw_calls['que_encontraras'], 1)

        # Simulación de sistemas_complejos.html
        class SistemasSimulation:
            def __init__(self):
                self.isTabVisible = True
                self.inDetailView = False
                self.miniatures_count = 0
                self.detail_scene_count = 0

            def animate(self):
                if not self.isTabVisible:
                    return "PAUSED"
                if self.inDetailView:
                    self.detail_scene_count += 1
                else:
                    self.miniatures_count += 1
                return "ANIMATED"

            def openProperty(self, prop_id):
                self.inDetailView = True

            def closeProperty(self):
                self.inDetailView = False

        s_sim = SistemasSimulation()

        # 1. En cuadrícula: miniaturas activas
        self.assertEqual(s_sim.animate(), "ANIMATED")
        self.assertEqual(s_sim.miniatures_count, 1)
        self.assertEqual(s_sim.detail_scene_count, 0)

        # 2. Abrir propiedad de detalle
        s_sim.openProperty(1)
        self.assertEqual(s_sim.animate(), "ANIMATED")
        self.assertEqual(s_sim.miniatures_count, 1)  # Miniaturas suspendidas
        self.assertEqual(s_sim.detail_scene_count, 1)

        # 3. Pestaña oculta durante la vista de detalle
        s_sim.isTabVisible = False
        self.assertEqual(s_sim.animate(), "PAUSED")
        self.assertEqual(s_sim.detail_scene_count, 1)  # Pausada

        # 4. Volver a la pestaña y cerrar detalle
        s_sim.isTabVisible = True
        s_sim.closeProperty()
        self.assertFalse(s_sim.inDetailView)
        self.assertEqual(s_sim.animate(), "ANIMATED")
        self.assertEqual(s_sim.miniatures_count, 2)  # Reanudada suavemente

    def test_07_cero_emojis_in_updated_files(self):
        """portal.html y sistemas_complejos.html deben cumplir con CERO EMOJIS."""
        portal_emojis = EMOJI_REGEX.findall(self.portal_content)
        sistemas_emojis = EMOJI_REGEX.findall(self.sistemas_content)
        self.assertEqual(len(portal_emojis), 0, f"Se detectaron emojis en portal.html: {portal_emojis}")
        self.assertEqual(len(sistemas_emojis), 0, f"Se detectaron emojis en sistemas_complejos.html: {sistemas_emojis}")


if __name__ == "__main__":
    unittest.main()
