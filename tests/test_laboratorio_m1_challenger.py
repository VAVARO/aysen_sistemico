#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_laboratorio_m1_challenger.py
=============================================================================
Empirical Challenger Test Harness for Milestone 1 in laboratorio.html:
1. Dropdown menus styling (position: fixed, z-index, no overflow-y clipping,
   viewport bound clamping, mutual exclusivity, click-outside, Escape, auto-close).
2. Complete 10 Comunas territorial slicer (#selectTerritorialSlicer, TERRITORIAL_SLICES,
   disjoint partitions, slug compatibility, Coyhaique outlier reset, clearAll reset,
   normStr phonetic normalization matching data/comunas_aysen.json).
3. Window counter logic (singular/plural grammatical correctness, minimized vs visible,
   renderSubDashboards invocation, and comprehensive lifecycle coverage).
=============================================================================
"""

import os
import re
import json
import unittest
import unicodedata

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
COMUNAS_JSON = os.path.join(ROOT_DIR, "data", "comunas_aysen.json")

CANONICAL_COMUNAS = [
    'Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas',
    'Chile Chico', 'Río Ibáñez', 'Cochrane', "O'Higgins", 'Tortel'
]

COMUNA_SLUGS = [
    'coyhaique', 'lago_verde', 'aysen', 'cisnes', 'guaitecas',
    'chile_chico', 'rio_ibanez', 'cochrane', 'ohiggins', 'tortel'
]


def norm_str(s):
    if not s:
        return ''
    s = unicodedata.normalize('NFD', str(s))
    s = re.sub(r'[\u0300-\u036f]', '', s)
    s = re.sub(r'[’\'`]', "'", s)
    return s.lower().strip()


class TestMilestone1Challenger(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            cls.html = f.read()

        with open(COMUNAS_JSON, "r", encoding="utf-8") as f:
            cls.comunas_data = json.load(f)

    # =========================================================================
    # 1. DROPDOWN MENUS STYLING & POSITIONING
    # =========================================================================

    def test_dropdown_css_fixed_and_high_zindex(self):
        """El menú desplegable debe tener position: fixed y z-index >= 100000 para no ser recortado."""
        m = re.search(r'\.dropdown-project-content\s*\{([^}]+)\}', self.html)
        self.assertIsNotNone(m, "Debe existir la regla CSS .dropdown-project-content")
        rule_body = m.group(1)

        self.assertIn("position: fixed", rule_body, ".dropdown-project-content debe usar position: fixed")
        
        # Extraer z-index
        z_match = re.search(r'z-index:\s*(\d+)', rule_body)
        self.assertIsNotNone(z_match, ".dropdown-project-content debe tener z-index explícito")
        z_val = int(z_match.group(1))
        self.assertGreaterEqual(z_val, 100000, f"z-index debe ser >= 100000 para sobrevolar ventanas (actual: {z_val})")

    def test_canvas_action_bar_no_overflow_y_clip(self):
        """La barra de acciones (.canvas-action-bar) debe preservar overflow-x: hidden y no tener overflow-y: hidden."""
        m = re.search(r'\.canvas-action-bar\s*\{([^}]+)\}', self.html)
        self.assertIsNotNone(m, "Debe existir la regla CSS .canvas-action-bar")
        rule_body = m.group(1)

        self.assertIn("overflow-x: hidden", rule_body, ".canvas-action-bar debe mantener overflow-x: hidden para evitar scroll horizontal")
        self.assertNotIn("overflow-y: hidden", rule_body, ".canvas-action-bar NO debe tener overflow-y: hidden para no recortar menús")

    def test_toggle_fixed_dropdown_function_and_bounding_rect(self):
        """toggleFixedDropdown debe calcular coordenadas con getBoundingClientRect() y aplicar clamping."""
        self.assertIn("function toggleFixedDropdown(btn, menu, alignRight", self.html, "toggleFixedDropdown debe estar definida con sus argumentos")
        self.assertIn("btn.getBoundingClientRect()", self.html, "Debe usar getBoundingClientRect() para posicionar dinámicamente")
        self.assertIn("menu.style.position = 'fixed'", self.html, "Debe asignar position = fixed dinámicamente")
        self.assertIn("menu.style.top = `${rect.bottom + 4}px`", self.html, "Debe ubicar el menú justo debajo del botón con 4px de margen")
        self.assertIn("menu.style.zIndex = '999999'", self.html, "Debe asignar zIndex 999999 dinámicamente")

        # Clamping para evitar desborde fuera de la pantalla
        self.assertIn("Math.max(8, window.innerWidth - rect.right)", self.html, "Debe proteger desborde derecho con Math.max(8, ...)")
        self.assertIn("Math.max(8, rect.left)", self.html, "Debe proteger desborde izquierdo con Math.max(8, ...)")

    def test_dropdown_mutual_exclusivity(self):
        """Abrir un menú debe cerrar automáticamente cualquier otro menú desplegable abierto."""
        m = re.search(r'function toggleFixedDropdown[^{]+\{([\s\S]+?)\n      \}', self.html)
        self.assertIsNotNone(m, "Debe encontrarse el cuerpo de toggleFixedDropdown")
        fn_body = m.group(1)

        self.assertIn("document.querySelectorAll('.dropdown-project-content.show').forEach(m => m.classList.remove('show'))",
                      fn_body, "toggleFixedDropdown debe cerrar cualquier menú previo abierto")

    def test_dropdown_click_outside_and_escape(self):
        """Debe existir un listener global en window para cerrar menús al hacer click afuera o presionar Escape."""
        # Click outside
        self.assertIn("window.addEventListener('click', () => {", self.html)
        self.assertIn("document.querySelectorAll('.dropdown-project-content.show').forEach(m => m.classList.remove('show'));", self.html)

        # Escape key
        self.assertIn("window.addEventListener('keydown', (e) => {", self.html)
        self.assertIn("if (e.key === 'Escape') {", self.html)

    def test_dropdown_menu_items_auto_close(self):
        """Seleccionar un ítem dentro de + Tarjeta o Proyecto debe cerrar el menú correspondiente."""
        # Ítems de + Tarjeta
        self.assertIn("closeAddMenu()", self.html, "closeAddMenu debe existir")
        for btn_id in ['btnAddChart', 'btnAddMap', 'btnAddTable', 'btnAddKPI']:
            self.assertRegex(self.html, rf"document\.getElementById\('{btn_id}'\)\.addEventListener\('click'[\s\S]+?closeAddMenu\(\)",
                             f"El botón {btn_id} debe invocar closeAddMenu()")

        # btnAddTimeline
        self.assertRegex(self.html, r"btnTimeline\.addEventListener\('click'[\s\S]+?closeAddMenu\(\)",
                         "btnAddTimeline (btnTimeline) debe invocar closeAddMenu()")

        # Ítems de Proyecto
        for proj_id in ['btnExportarJson', 'btnImportarJson', 'btnExportarReporte']:
            self.assertRegex(self.html, rf"document\.getElementById\('{proj_id}'\)\.addEventListener\('click'[\s\S]+?projectMenu\.classList\.remove\('show'\)",
                             f"El botón {proj_id} debe cerrar projectMenu al hacer click")

    # =========================================================================
    # 2. TERRITORIAL SLICER & 10 COMUNAS COMPLETE INTEGRITY
    # =========================================================================

    def test_select_territorial_slicer_attributes(self):
        """#selectTerritorialSlicer debe tener data-dimension='comuna' y data-total-count='10'."""
        m = re.search(r'<select[^>]*id="selectTerritorialSlicer"[^>]*>', self.html)
        self.assertIsNotNone(m, "#selectTerritorialSlicer debe existir en el DOM")
        tag = m.group(0)
        self.assertIn('data-dimension="comuna"', tag, "Debe tener data-dimension='comuna'")
        self.assertIn('data-total-count="10"', tag, "Debe tener data-total-count='10'")

    def test_select_territorial_slicer_optgroups_and_comunas(self):
        """#selectTerritorialSlicer debe tener los 3 optgroups y las 10 comunas individuales."""
        m = re.search(r'<select[^>]*id="selectTerritorialSlicer"[^>]*>([\s\S]+?)</select>', self.html)
        self.assertIsNotNone(m, "Debe encontrarse el contenido de #selectTerritorialSlicer")
        select_inner = m.group(1)

        # Optgroups
        self.assertIn('label="Provincias"', select_inner, "Debe incluir optgroup de Provincias")
        self.assertIn('label="Tipología Geográfica"', select_inner, "Debe incluir optgroup de Tipología Geográfica")
        self.assertIn('label="Comunas Individuales (10)"', select_inner, "Debe incluir optgroup de Comunas Individuales")

        # Comunas individuales en options
        for c_slug in COMUNA_SLUGS:
            val = f'comuna_{c_slug}'
            self.assertIn(f'value="{val}"', select_inner, f"Falta la opción {val} en #selectTerritorialSlicer")

        for c_name in CANONICAL_COMUNAS:
            self.assertIn(f'>{c_name}</option>', select_inner, f"Falta el label {c_name} en las opciones")

    def test_territorial_slices_disjoint_partitions_and_slugs(self):
        """TERRITORIAL_SLICES en JS debe particionar exactamente las 10 comunas y soportar todos los slugs."""
        m = re.search(r'const TERRITORIAL_SLICES = \{([\s\S]+?)\};', self.html)
        self.assertIsNotNone(m, "Debe encontrarse const TERRITORIAL_SLICES en el JS")
        slices_raw = m.group(1)

        def clean_val(v):
            return v.strip().strip("'\"").replace("\\'", "'")

        # 1. Provincias deben sumar 10 y ser disjuntas
        provincias = ['prov_coyhaique', 'prov_aysen', 'prov_gral_carrera', 'prov_capitan_prat']
        prov_comunas_all = []
        for p in provincias:
            m_p = re.search(rf'{p}:\s*\[([^\]]+)\]', slices_raw)
            self.assertIsNotNone(m_p, f"Falta provincia {p} en TERRITORIAL_SLICES")
            items = [clean_val(x) for x in m_p.group(1).split(',')]
            prov_comunas_all.extend(items)

        self.assertEqual(len(prov_comunas_all), 10, f"Las 4 provincias deben sumar exactamente 10 comunas (obtenidas: {len(prov_comunas_all)})")
        self.assertEqual(len(set(prov_comunas_all)), 10, "Las 4 provincias deben ser particiones disjuntas sin duplicados")
        self.assertEqual(set(prov_comunas_all), set(CANONICAL_COMUNAS), "Las provincias deben cubrir el 100% de las comunas canónicas")

        # 2. Tipologías deben sumar 10 y ser disjuntas
        tipologias = ['tipo_maritima', 'tipo_continental']
        tipo_comunas_all = []
        for t in tipologias:
            m_t = re.search(rf'{t}:\s*\[([^\]]+)\]', slices_raw)
            self.assertIsNotNone(m_t, f"Falta tipología {t} en TERRITORIAL_SLICES")
            items = [clean_val(x) for x in m_t.group(1).split(',')]
            tipo_comunas_all.extend(items)

        self.assertEqual(len(tipo_comunas_all), 10, f"Las 2 tipologías deben sumar exactamente 10 comunas (obtenidas: {len(tipo_comunas_all)})")
        self.assertEqual(len(set(tipo_comunas_all)), 10, "Las 2 tipologías deben ser disjuntas")
        self.assertEqual(set(tipo_comunas_all), set(CANONICAL_COMUNAS), "Las tipologías deben cubrir el 100% de las comunas canónicas")

        # 3. Comunas individuales: verificar comuna_<slug> y com_<slug>
        for slug in COMUNA_SLUGS:
            self.assertIn(f'comuna_{slug}:', slices_raw, f"Falta comuna_{slug} en TERRITORIAL_SLICES")
            self.assertIn(f'com_{slug}:', slices_raw, f"Falta com_{slug} en TERRITORIAL_SLICES")

        # 4. Inyección directa COMUNAS_ORDER.forEach
        self.assertIn("COMUNAS_ORDER.forEach(c => {", self.html, "Debe existir mapeo dinámico de nombres canónicos")
        self.assertIn("TERRITORIAL_SLICES[c] = [c];", self.html, "Debe asignar TERRITORIAL_SLICES[c] = [c]")

    def test_slicer_options_all_resolve_to_valid_comunas(self):
        """Cada opción de #selectTerritorialSlicer debe resolverse a una lista válida no vacía de comunas."""
        # Extraer todos los option values
        m = re.search(r'<select[^>]*id="selectTerritorialSlicer"[^>]*>([\s\S]+?)</select>', self.html)
        self.assertIsNotNone(m)
        options = re.findall(r'<option[^>]*value="([^"]+)"', m.group(1))
        self.assertGreaterEqual(len(options), 17, "Deben existir al menos 17 opciones en el slicer")

        m_slices = re.search(r'const TERRITORIAL_SLICES = \{([\s\S]+?)\};', self.html)
        slices_raw = m_slices.group(1)

        def clean_val(v):
            return v.strip().strip("'\"").replace("\\'", "'")

        parsed_slices = {}
        for line in slices_raw.splitlines():
            line = line.strip()
            if not line or line.startswith('//'):
                continue
            m_kv = re.match(r'([a-zA-Z0-9_]+)\s*:\s*\[([^\]]*)\]', line)
            if m_kv:
                k = m_kv.group(1)
                vals = [clean_val(x) for x in m_kv.group(2).split(',') if x.strip()]
                parsed_slices[k] = vals

        for opt in options:
            if opt == 'all':
                continue
            self.assertIn(opt, parsed_slices, f"La opción {opt} del slicer no está mapeada en TERRITORIAL_SLICES")
            resolved = parsed_slices[opt]
            self.assertGreater(len(resolved), 0, f"La opción {opt} resuelve a un array vacío")
            for c in resolved:
                self.assertIn(c, CANONICAL_COMUNAS, f"La comuna resuelta '{c}' no es canónica para la opción {opt}")

    def test_comunas_match_official_data_lake(self):
        """Las 10 comunas de TERRITORIAL_SLICES deben coincidir fonéticamente (normStr) con data/comunas_aysen.json."""
        official_names = [c["nombre"] for c in self.comunas_data["comunas"]]
        self.assertEqual(len(official_names), 10, "data/comunas_aysen.json debe tener 10 comunas")

        official_norms = {norm_str(name): name for name in official_names}
        canonical_norms = {norm_str(name): name for name in CANONICAL_COMUNAS}

        self.assertEqual(set(official_norms.keys()), set(canonical_norms.keys()),
                         "Las 10 comunas canónicas deben coincidir 1:1 fonéticamente con el Data Lake oficial")

    def test_slicer_all_resets_exclude_coyhaique(self):
        """Seleccionar 'all' en el slicer territorial debe desactivar AppState.excludeCoyhaique y remover .active."""
        m = re.search(r"selectSlicer\.addEventListener\('change',\s*\(e\)\s*=>\s*\{([\s\S]+?)\}\);", self.html)
        self.assertIsNotNone(m, "Debe encontrarse el listener change de selectSlicer")
        body = m.group(1)

        self.assertIn("if (e.target.value === 'all')", body, "Debe verificar e.target.value === 'all'")
        self.assertIn("AppState.excludeCoyhaique = false", body, "Debe poner AppState.excludeCoyhaique = false")
        self.assertIn("btnEx.classList.remove('active')", body, "Debe remover clase active de btnExcludeCoyhaique")

    def test_clear_all_resets_slicer_and_exclusion(self):
        """clearAll() debe restablecer AppState.territorialFilter a 'all', select.value a 'all' y apagar exclusión."""
        m = re.search(r"function clearAll\(\)\s*\{([\s\S]+?)\n      \}", self.html)
        self.assertIsNotNone(m, "Debe encontrarse function clearAll()")
        body = m.group(1)

        self.assertIn("AppState.territorialFilter = 'all'", body, "clearAll() debe reiniciar AppState.territorialFilter = 'all'")
        self.assertIn("AppState.excludeCoyhaique = false", body, "clearAll() debe reiniciar AppState.excludeCoyhaique = false")
        self.assertIn("selectSlicer.value = 'all'", body, "clearAll() debe reiniciar selectTerritorialSlicer.value = 'all'")
        self.assertIn("btnExclude.classList.remove('active')", body, "clearAll() debe remover clase active del botón")

    # =========================================================================
    # 3. WINDOW COUNTER SYNCHRONIZATION & LIFECYCLE
    # =========================================================================

    def test_update_status_calculation_and_grammar(self):
        """updateStatus debe calcular total, minCount y visibleCount, con gramática singular/plural exacta."""
        m = re.search(r"function updateStatus\(\)\s*\{([\s\S]+?)\n      \}", self.html)
        self.assertIsNotNone(m, "Debe encontrarse function updateStatus()")
        body = m.group(1)

        # Validar variables internas
        self.assertIn("const total = AppState.widgets ? AppState.widgets.length : 0", body)
        self.assertIn("const minCount = AppState.widgets ? AppState.widgets.filter(w => w.minimized).length : 0", body)
        self.assertIn("const visibleCount = total - minCount", body)

        # Validar casos de texto
        self.assertIn("statusEl.textContent = '0 ventanas'", body, "Caso 0 ventanas")
        self.assertIn("statusEl.textContent = `${total} ventana${total === 1 ? '' : 's'}`", body, "Caso todas visibles")
        self.assertIn("(${visibleCount} visible${visibleCount === 1 ? '' : 's'}, ${minCount} oculta${minCount === 1 ? '' : 's'})", body, "Caso con minimizadas")

        # Simulación del formato en Python para verificar invariantes de texto
        def format_status(total, min_count):
            visible = total - min_count
            if total == 0:
                return "0 ventanas"
            elif min_count == 0:
                return f"{total} ventana{'' if total == 1 else 's'}"
            else:
                s_tot = '' if total == 1 else 's'
                s_vis = '' if visible == 1 else 's'
                s_min = '' if min_count == 1 else 's'
                return f"{total} ventana{s_tot} ({visible} visible{s_vis}, {min_count} oculta{s_min})"

        self.assertEqual(format_status(0, 0), "0 ventanas")
        self.assertEqual(format_status(1, 0), "1 ventana")
        self.assertEqual(format_status(2, 0), "2 ventanas")
        self.assertEqual(format_status(1, 1), "1 ventana (0 visibles, 1 oculta)")
        self.assertEqual(format_status(2, 1), "2 ventanas (1 visible, 1 oculta)")
        self.assertEqual(format_status(2, 2), "2 ventanas (0 visibles, 2 ocultas)")
        self.assertEqual(format_status(5, 3), "5 ventanas (2 visibles, 3 ocultas)")

    def test_update_status_invokes_render_subdashboards(self):
        """updateStatus debe invocar renderSubDashboards() sincrónicamente para sincronizar los badges numéricos."""
        m = re.search(r"function updateStatus\(\)\s*\{([\s\S]+?)\n      \}", self.html)
        self.assertIsNotNone(m, "Debe encontrarse function updateStatus()")
        body = m.group(1)

        self.assertIn("if (typeof renderSubDashboards === 'function')", body, "Debe verificar existencia de renderSubDashboards")
        self.assertIn("renderSubDashboards()", body, "updateStatus debe invocar renderSubDashboards()")

    def test_update_status_called_in_all_lifecycle_functions(self):
        """updateStatus() debe invocarse en todos los métodos del ciclo de vida de tarjetas y mesas."""
        required_callers = [
            'createWidget',
            'removeWidget',
            'toggleMinimizeWidget',
            'toggleMaximizeWidget',
            'showAllHiddenWindows',
            'tileWindowsInGrid',
            'switchSubDashboard',
            'clearAll',
            'loadSavedOrPreset',
            'importJson'
        ]

        for fn in required_callers:
            # Buscar la cabecera de la función hasta el cierre de la función
            pattern = rf"function {fn}\s*\([^\)]*\)\s*\{{([\s\S]+?)\n      \}}"
            m = re.search(pattern, self.html)
            self.assertIsNotNone(m, f"Debe encontrarse function {fn}()")
            body = m.group(1)
            self.assertIn("updateStatus()", body, f"function {fn}() debe llamar a updateStatus()")


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    unittest.main()
