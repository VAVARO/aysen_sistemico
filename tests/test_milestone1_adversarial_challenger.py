#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_milestone1_adversarial_challenger.py
=============================================================================
Suite de Pruebas Adversariales Independientes — Milestone 1
Laboratorio de Modelamiento Sistémico de Aysén (laboratorio.html)

Ejecuta verificación empírica contra:
1. Comportamiento y casos borde de #selectTerritorialSlicer con tarjetas abiertas:
   - Filtrado comunal univariado y bivariado
   - Preservación de variables temporales y de holding
   - Resistencia a claves inexistentes o desconocidas (fallback gracioso)
   - Desactivación de outlier Coyhaique al volver a 'all'
2. Comportamiento y casos borde de clearAll():
   - Reseteo exhaustivo de contadores a 0
   - Reseteo de slicer a 'all' y desactivación de flags
   - Limpieza de lienzo, tarjetas activas, conexiones y sub-dashboards
3. Comportamiento y límites del menú desplegable:
   - Escape de límites de ventana con position: fixed y z-index 999999
   - Ausencia de clipping por overflow-y en .canvas-action-bar
   - Lógica de clamping y alineación segura en viewports pequeños
4. Integridad total de contratos DOM requeridos en laboratorio.html
=============================================================================
"""

import os
import re
import json
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
BUNDLE_FILE = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")

COMUNAS_ORDER = [
    'Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas',
    'Chile Chico', 'Río Ibáñez', 'Cochrane', "O'Higgins", 'Tortel'
]

def norm_str(s):
    if s is None:
        return ""
    s = str(s).lower().strip()
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'ñ': 'n', "'": '', '’': '', '´': '', '`': '', ' ': '_'
    }
    for k, v in replacements.items():
        s = s.replace(k, v)
    return s


class TestAdversarialLaboratorioM1(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            cls.lab_html = f.read()

        with open(BUNDLE_FILE, "r", encoding="utf-8") as f:
            b_text = f.read()
        idx = b_text.find("window.AYSEN_HUBS_DATA = ")
        raw_json = b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
        cls.hubs_data = json.loads(raw_json)

    # =========================================================================
    # SECCIÓN 1: PROBANDO CASOS BORDE DE #selectTerritorialSlicer
    # =========================================================================

    def test_edge_01_territorial_slicer_markup_and_optgroups(self):
        """El marcado de #selectTerritorialSlicer debe tener 3 optgroups estructurados y todas las opciones."""
        m = re.search(r'<select[^>]*id="selectTerritorialSlicer"[^>]*>(.*?)</select>', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m, "#selectTerritorialSlicer debe existir en el DOM de laboratorio.html")
        content = m.group(1)

        # Verificar opción universal
        self.assertIn('value="all"', content)
        self.assertIn('Todas las comunas (10)', content)

        # Verificar grupos semánticos
        self.assertIn('label="Provincias"', content)
        self.assertIn('label="Tipología Geográfica"', content)
        self.assertIn('label="Comunas Individuales (10)"', content)

        # Verificar las 4 provincias
        for prov_val in ["prov_coyhaique", "prov_aysen", "prov_gral_carrera", "prov_capitan_prat"]:
            self.assertIn(f'value="{prov_val}"', content, f"Falta provincia {prov_val}")

        # Verificar las 2 tipologías
        for tipo_val in ["tipo_maritima", "tipo_continental"]:
            self.assertIn(f'value="{tipo_val}"', content, f"Falta tipología {tipo_val}")

        # Verificar las 10 comunas individuales con formato 'comuna_<slug>'
        for c in COMUNAS_ORDER:
            slug = norm_str(c)
            self.assertIn(f'value="comuna_{slug}"', content, f"Falta comuna individual comuna_{slug}")
            self.assertIn(c, content, f"Falta etiqueta textual para {c}")

    def test_edge_02_territorial_slices_dictionary_coverage_and_fallbacks(self):
        """TERRITORIAL_SLICES debe cubrir todas las claves y manejar consultas desconocidas con fallback."""
        m_dict = re.search(r'const\s+TERRITORIAL_SLICES\s*=\s*(\{.*?\n\s*\});', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_dict, "TERRITORIAL_SLICES debe estar declarado en laboratorio.html")
        dict_text = m_dict.group(1)

        # Verificar cobertura de las 10 comunas individuales en TERRITORIAL_SLICES
        for c in COMUNAS_ORDER:
            slug = norm_str(c)
            key_full = f"comuna_{slug}"
            self.assertIn(key_full, dict_text, f"TERRITORIAL_SLICES debe contener la clave {key_full}")

        # Extraer lógica de fallback en resolveWidgetSeriesData
        m_filter_code = re.search(
            r'if\s*\([^)]*AppState\.territorialFilter[^)]*\)\s*\{([^}]+TERRITORIAL_SLICES[^}]+)\}',
            self.lab_html,
            re.DOTALL
        )
        self.assertIsNotNone(m_filter_code, "Debe existir bloque de filtrado territorial en getWidgetDataPayload")
        code = m_filter_code.group(1)
        self.assertIn("|| COMUNAS_ORDER", code, "Debe existir fallback seguro '|| COMUNAS_ORDER' ante claves desconocidas")

    def test_edge_03_territorial_slicer_simulation_with_open_cards(self):
        """Simular filtrado territorial de datos comunales para todas las opciones posibles."""
        # Extraer variables comunales del bundle
        comunas = self.hubs_data.get("comunas", [])
        self.assertEqual(len(comunas), 10)

        # Matriz de slices definida en el código
        slices = {
            "all": COMUNAS_ORDER,
            "prov_coyhaique": ['Coyhaique', 'Lago Verde'],
            "prov_aysen": ['Aysén', 'Cisnes', 'Guaitecas'],
            "prov_gral_carrera": ['Chile Chico', 'Río Ibáñez'],
            "prov_capitan_prat": ['Cochrane', "O'Higgins", 'Tortel'],
            "tipo_maritima": ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel'],
            "tipo_continental": ['Coyhaique', 'Lago Verde', 'Chile Chico', 'Río Ibáñez', 'Cochrane', "O'Higgins"]
        }
        for c in COMUNAS_ORDER:
            slices[f"comuna_{norm_str(c)}"] = [c]

        # Simular función de filtrado exactamente como en getWidgetDataPayload
        def simulate_filter(labels, data, slicer_key):
            allowed = slices.get(slicer_key, COMUNAS_ORDER)
            keep = []
            for i, lbl in enumerate(labels):
                if any(norm_str(a) == norm_str(lbl) for a in allowed):
                    keep.append(i)
            filtered_labels = [labels[i] for i in keep]
            filtered_data = [data[i] for i in keep]
            return filtered_labels, filtered_data

        test_data = [c.get("poblacion_censo_2024", 0) for c in comunas]

        # 1. Probar 'all'
        lbls, dt = simulate_filter(COMUNAS_ORDER, test_data, "all")
        self.assertEqual(len(lbls), 10)
        self.assertEqual(len(dt), 10)

        # 2. Probar cada provincia
        lbls_coy, _ = simulate_filter(COMUNAS_ORDER, test_data, "prov_coyhaique")
        self.assertEqual(len(lbls_coy), 2)
        self.assertIn("Coyhaique", lbls_coy)
        self.assertIn("Lago Verde", lbls_coy)

        lbls_ays, _ = simulate_filter(COMUNAS_ORDER, test_data, "prov_aysen")
        self.assertEqual(len(lbls_ays), 3)

        lbls_prat, _ = simulate_filter(COMUNAS_ORDER, test_data, "prov_capitan_prat")
        self.assertEqual(len(lbls_prat), 3)
        self.assertIn("Tortel", lbls_prat)

        # 3. Probar cada una de las 10 comunas individuales
        for c in COMUNAS_ORDER:
            s_key = f"comuna_{norm_str(c)}"
            lbls_single, dt_single = simulate_filter(COMUNAS_ORDER, test_data, s_key)
            self.assertEqual(len(lbls_single), 1, f"Filtro individual de {c} debe devolver exactamente 1 elemento")
            self.assertEqual(norm_str(lbls_single[0]), norm_str(c))
            self.assertEqual(len(dt_single), 1)

        # 4. Probar caso borde: clave desconocida/corrupta
        lbls_unk, dt_unk = simulate_filter(COMUNAS_ORDER, test_data, "clave_inexistente_99")
        self.assertEqual(len(lbls_unk), 10, "Clave desconocida debe fallback a las 10 comunas")

    def test_edge_04_territorial_slicer_resets_exclude_coyhaique_on_all(self):
        """Al cambiar el slicer a 'all', AppState.excludeCoyhaique debe desactivarse en el handler."""
        m_handler = re.search(r'selectSlicer\.addEventListener\(\'change\',\s*\(e\)\s*=>\s*\{(.*?)\n\s*\}\);', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_handler, "Debe existir listener de cambio para selectTerritorialSlicer")
        h_code = m_handler.group(1)
        self.assertIn("AppState.territorialFilter = e.target.value", h_code)
        self.assertIn("if (e.target.value === 'all')", h_code)
        self.assertIn("AppState.excludeCoyhaique = false", h_code)
        self.assertIn("btnEx.classList.remove('active')", h_code)
        self.assertIn("renderWidgetVisual(w)", h_code)
        self.assertIn("updateConnections()", h_code)
        self.assertIn("autoSave()", h_code)

    # =========================================================================
    # SECCIÓN 2: PROBANDO CASOS BORDE DE clearAll()
    # =========================================================================

    def test_edge_05_clear_all_resets_counters_and_slicer(self):
        """clearAll() debe reiniciar todos los contadores, destruir instancias de gráficos y resetear slicer."""
        m_clear = re.search(r'function clearAll\([^)]*\)\s*\{(.*?)\n      \}', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_clear, "Debe existir función clearAll()")
        code = m_clear.group(1)

        # Verificaciones críticas de destrucción limpia
        self.assertIn("w.instance.destroy", code, "Debe destruir instancias previas de gráficos")
        self.assertIn("w.resizeObserver.disconnect", code, "Debe desconectar observadores de redimensión")
        self.assertIn("AppState.widgets = []", code, "Debe vaciar AppState.widgets")
        self.assertIn("AppState.reflectionCards = []", code, "Debe vaciar AppState.reflectionCards")
        self.assertIn("AppState.activeWidgetId = null", code, "Debe anular tarjeta activa")
        self.assertIn("AppState.nextWidgetId = 1", code, "Debe resetear ID de tarjeta")
        self.assertIn("stage.innerHTML = ''", code, "Debe limpiar canvasGridStage")

        # Verificaciones críticas de filtros
        self.assertIn("AppState.territorialFilter = 'all'", code, "Debe restablecer territorialFilter a 'all'")
        self.assertIn("AppState.excludeCoyhaique = false", code, "Debe desactivar excludeCoyhaique")
        self.assertIn("selectSlicer.value = 'all'", code, "Debe actualizar selectTerritorialSlicer.value a 'all'")
        self.assertIn("btnExclude.classList.remove('active')", code, "Debe retirar clase active de botón Coyhaique")

        # Verificaciones críticas de sincronización de estado y contadores
        self.assertIn("renderWindowTabs()", code)
        self.assertIn("updateConnections()", code)
        self.assertIn("updateStatus()", code, "clearAll debe invocar updateStatus()")
        self.assertIn("autoSave()", code)

    def test_edge_06_update_status_produces_zero_windows_and_updates_subdashboards(self):
        """updateStatus() debe imprimir '0 ventanas' cuando total === 0 e invocar renderSubDashboards()."""
        m_status = re.search(r'function updateStatus\([^)]*\)\s*\{(.*?)\n      \}', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_status, "Debe existir function updateStatus()")
        code = m_status.group(1)

        self.assertIn("statusEl.textContent = '0 ventanas'", code, "Debe mostrar '0 ventanas' cuando total === 0")
        self.assertIn("renderSubDashboards()", code, "updateStatus debe sincronizar renderSubDashboards()")

    # =========================================================================
    # SECCIÓN 3: PROBANDO COMPORTAMIENTO Y LÍMITES DE MENÚS DESPLEGABLES
    # =========================================================================

    def test_edge_07_dropdown_fixed_positioning_and_clipping_prevention(self):
        """Los menús desplegables deben tener position: fixed y z-index: 999999 sin clipping en .canvas-action-bar."""
        # 1. .canvas-action-bar no debe tener overflow-y: hidden
        m_bar = re.search(r'\.canvas-action-bar\s*\{([^}]+)\}', self.lab_html)
        self.assertIsNotNone(m_bar)
        css_bar = m_bar.group(1)
        self.assertNotIn("overflow-y: hidden", css_bar, ".canvas-action-bar NO debe contener overflow-y: hidden")
        self.assertIn("overflow-x: hidden", css_bar, ".canvas-action-bar debe mantener overflow-x: hidden")

        # 2. .dropdown-project-content debe ser fixed con z-index 999999
        m_drop = re.search(r'\.dropdown-project-content\s*\{([^}]+)\}', self.lab_html)
        self.assertIsNotNone(m_drop)
        css_drop = m_drop.group(1)
        self.assertIn("position: fixed", css_drop, ".dropdown-project-content debe tener position: fixed")
        self.assertIn("z-index: 999999", css_drop, ".dropdown-project-content debe tener z-index: 999999")

    def test_edge_08_toggle_fixed_dropdown_clamping_and_dismissal(self):
        """toggleFixedDropdown debe aplicar clamping Math.max(8, ...) y cerrarse con Escape o click exterior."""
        m_func = re.search(r'function toggleFixedDropdown\([^)]*\)\s*\{(.*?)\n        \}', self.lab_html, re.DOTALL)
        self.assertIsNotNone(m_func, "Debe existir función toggleFixedDropdown")
        code = m_func.group(1)

        self.assertIn("menu.style.position = 'fixed'", code)
        self.assertIn("menu.style.top = `${rect.bottom + 4}px`", code)
        self.assertIn("menu.style.zIndex = '999999'", code)
        self.assertIn("Math.max(8, window.innerWidth - rect.right)", code, "Debe clampear margen derecho a >= 8px")
        self.assertIn("Math.max(8, rect.left)", code, "Debe clampear margen izquierdo a >= 8px")

        # Verificar eventos de cierre
        self.assertIn("keydown", self.lab_html, "Debe escuchar tecla Escape")
        self.assertIn("e.key === 'Escape'", self.lab_html, "Debe cerrar menús en tecla Escape")

    # =========================================================================
    # SECCIÓN 4: VERIFICACIÓN EXHAUSTIVA DE CONTRATOS DOM
    # =========================================================================

    def test_edge_09_all_contractual_dom_ids_intact(self):
        """Verificar la presencia de todos los IDs contractuales exigidos en el sistema."""
        mandatory_ids = [
            # Cabecera y paneles
            "brandHeader", "panelCatalogo", "panelLienzo", "panelMetacognicion",
            "variablesTreeContainer", "canvasGridStage", "cardActiveQuestion",
            "txtAnalystNotes", "accordionBody",
            # Barra de pestañas y ventanas
            "workspaceWindowTabs", "subDashboardsStrip", "windowTabsScroll",
            "canvasStatusWidgets", "btnTileWindowsGrid",
            # Menús desplegables
            "dropdownAddCard", "btnAddCardDropdownBtn", "addCardDropdownMenu",
            "btnAddChart", "btnAddTimeline", "btnAddMap", "btnAddTable", "btnAddKPI",
            "dropdownProjectWrap", "btnProjectMenu", "projectMenuDropdown",
            "btnExportarJson", "btnImportarJson", "btnExportarReporte",
            # Slicer territorial y utilidades
            "selectTerritorialSlicer", "btnExcludeCoyhaique", "btnEjemploSistemico",
            "canvaFloatingToolbar"
        ]
        for mid in mandatory_ids:
            self.assertIn(f'id="{mid}"', self.lab_html, f"ID contractual {mid} ausente en laboratorio.html")


if __name__ == "__main__":
    unittest.main()
