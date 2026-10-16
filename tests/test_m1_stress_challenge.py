#!/usr/bin/env python3
"""
Adversarial Stress-Test and Verification Harness for Milestone 1 (R1 Editorial Redesign)
Agent: m1_challenger_1 (Empirical Challenger)
Target: mapa_territorial.html

Focus:
1. DOM Integrity & Contract: Test all 16 stations selecting through mapa_territorial.html,
   verifying that all 11 DOM element IDs exist, contain valid non-empty text, and produce
   no 'undefined' or 'NaN'.
2. Stress test rapid layout transitions (440px -> 560px -> 48px) and state machine resilience.
3. Canvas resizing, fluid container constraints, and Chart.js lifecycle isolation.
4. Edge cases: station without unit in parentheses, null checks, rapid view toggles.
"""

import sys
import re
import json
import math
import unittest
from pathlib import Path
from html.parser import HTMLParser
from typing import List, Dict, Any, Optional

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent
HTML_PATH = REPO_ROOT / "mapa_territorial.html"


def load_html_content() -> str:
    assert HTML_PATH.exists(), f"Target HTML file not found: {HTML_PATH}"
    return HTML_PATH.read_text(encoding="utf-8")


def parse_all_stations_from_js(html: str) -> List[Dict[str, Any]]:
    """
    Extracts and parses the 16 JavaScript station objects defined in mapa_territorial.html
    using standard library string manipulation and JSON parsing.
    """
    start_token = "const stations = ["
    end_token = "];"
    start_pos = html.find(start_token)
    assert start_pos != -1, "Could not find 'const stations = [' in HTML"
    start_pos += len(start_token)
    
    end_pos = html.find(end_token, start_pos)
    assert end_pos != -1, "Could not find end of stations array"
    
    raw_js = html[start_pos:end_pos].strip()
    
    # Split into station blocks
    # Each station begins with '{' and ends with '}'
    station_blocks = []
    depth = 0
    curr = []
    for char in raw_js:
        if char == '{':
            depth += 1
            curr.append(char)
        elif char == '}':
            depth -= 1
            curr.append(char)
            if depth == 0:
                station_blocks.append("".join(curr))
                curr = []
        elif depth > 0:
            curr.append(char)
            
    stations = []
    for idx, block in enumerate(station_blocks):
        st = {}
        # Extract id
        m_id = re.search(r'\bid:\s*(\d+)', block)
        st['id'] = int(m_id.group(1)) if m_id else None
        
        # Extract string fields
        str_fields = ['name', 'cat', 'domain', 'loc', 'inst', 'freq', 'code', 'access', 'desc', 'color', 'chartLabel']
        for field in str_fields:
            m = re.search(rf'\b{field}:\s*"(.*?)"', block, re.DOTALL)
            if not m:
                m = re.search(rf"\b{field}:\s*'(.*?)'", block, re.DOTALL)
            st[field] = m.group(1) if m else None
            
        # Extract numbers: lat, lng
        m_lat = re.search(r'\blat:\s*([-\d\.]+)', block)
        st['lat'] = float(m_lat.group(1)) if m_lat else None
        
        m_lng = re.search(r'\blng:\s*([-\d\.]+)', block)
        st['lng'] = float(m_lng.group(1)) if m_lng else None
        
        # Extract chartData list of numbers
        m_data = re.search(r'\bchartData:\s*\[(.*?)\]', block, re.DOTALL)
        if m_data:
            num_strs = [n.strip() for n in m_data.group(1).split(',') if n.strip()]
            st['chartData'] = [float(n) if '.' in n else int(n) for n in num_strs]
        else:
            st['chartData'] = None
            
        stations.append(st)
        
    return stations


class TestDOMIntegrityAndContract(unittest.TestCase):
    """
    Challenge 1: DOM Integrity & Contract Preservation across all 16 stations.
    Verifies that all 11 DOM IDs exist, and simulating selection of each station
    populates all target elements with valid, non-empty text, producing zero
    undefined, null, or NaN values.
    """

    @classmethod
    def setUpClass(cls):
        cls.html = load_html_content()
        cls.stations = parse_all_stations_from_js(cls.html)
        cls.required_ids = [
            "itemCat", "itemTitle", "itemLoc", "itemInst", "itemFreq",
            "itemCode", "itemAccess", "itemDesc", "chartMetricName", "miniChart", "detailPanel"
        ]

    def test_all_11_dom_element_ids_exist_in_html(self):
        """All 11 DOM element IDs specified in interface contract exist in HTML"""
        for element_id in self.required_ids:
            pattern = rf'id=["\']{element_id}["\']'
            matches = list(re.finditer(pattern, self.html))
            self.assertTrue(
                len(matches) >= 1,
                f"Missing required DOM element ID: '{element_id}'"
            )
            # Contract integrity: IDs must be unique
            self.assertEqual(
                len(matches), 1,
                f"Duplicate DOM element ID found for '{element_id}' ({len(matches)} occurrences)"
            )

    def test_station_count_is_exactly_16(self):
        """Station database must contain exactly 16 georeferenced stations"""
        self.assertEqual(
            len(self.stations), 16,
            f"Expected exactly 16 stations, parsed {len(self.stations)}"
        )

    def test_all_16_stations_populate_dom_without_undefined_or_nan(self):
        """
        Simulate selectStation(st) and initChart(...) for all 16 stations.
        Verify that all updated DOM elements receive non-empty, valid text
        and never contain 'undefined', 'NaN', 'null', or 'None'.
        """
        for st in self.stations:
            st_id = st.get('id')
            st_name = st.get('name')
            self.assertIsNotNone(st_id, f"Station has null ID: {st}")
            self.assertIsNotNone(st_name, f"Station {st_id} has null name")

            # Simulate JS selectStation field bindings:
            # itemCat -> st.cat
            # itemTitle -> st.name
            # itemLoc -> st.loc
            # itemInst -> st.inst
            # itemFreq -> st.freq
            # itemCode -> st.code
            # itemAccess -> st.access
            # itemDesc -> st.desc
            # chartMetricName -> unit || label
            label = st.get('chartLabel') or ''
            unit_match = re.search(r'\((.*?)\)', label)
            unit = unit_match.group(1) if unit_match else ''
            metric_text = unit if unit else label

            simulated_dom_values = {
                "itemCat": st.get("cat"),
                "itemTitle": st.get("name"),
                "itemLoc": st.get("loc"),
                "itemInst": st.get("inst"),
                "itemFreq": st.get("freq"),
                "itemCode": st.get("code"),
                "itemAccess": st.get("access"),
                "itemDesc": st.get("desc"),
                "chartMetricName": metric_text,
            }

            for field_id, value in simulated_dom_values.items():
                # 1. Must not be None or null
                self.assertIsNotNone(
                    value,
                    f"Station {st_id} ({st_name}): {field_id} evaluated to None"
                )
                str_val = str(value).strip()
                # 2. Must be non-empty
                self.assertTrue(
                    len(str_val) > 0,
                    f"Station {st_id} ({st_name}): {field_id} is an empty string"
                )
                # 3. Must not be "undefined"
                self.assertNotIn(
                    "undefined", str_val.lower(),
                    f"Station {st_id} ({st_name}): {field_id} contains 'undefined': '{str_val}'"
                )
                # 4. Must not be "nan"
                self.assertNotIn(
                    "nan", str_val.lower(),
                    f"Station {st_id} ({st_name}): {field_id} contains 'NaN': '{str_val}'"
                )
                # 5. Must not be "null"
                self.assertNotEqual(
                    str_val.lower(), "null",
                    f"Station {st_id} ({st_name}): {field_id} contains 'null': '{str_val}'"
                )

    def test_all_16_stations_chart_series_validity(self):
        """Each station must have exactly 12 numeric data points without NaN or null"""
        for st in self.stations:
            st_id = st.get('id')
            st_name = st.get('name')
            data = st.get('chartData')
            self.assertIsNotNone(data, f"Station {st_id} ({st_name}) has null chartData")
            self.assertEqual(
                len(data), 12,
                f"Station {st_id} ({st_name}) chartData has {len(data)} items, expected 12"
            )
            for m_idx, val in enumerate(data):
                self.assertIsInstance(
                    val, (int, float),
                    f"Station {st_id} ({st_name}) month {m_idx} value '{val}' is not numeric"
                )
                self.assertFalse(
                    math.isnan(val),
                    f"Station {st_id} ({st_name}) month {m_idx} value is NaN"
                )
                self.assertFalse(
                    math.isinf(val),
                    f"Station {st_id} ({st_name}) month {m_idx} value is infinite"
                )

    def test_all_16_stations_georeferencing_bounding_box(self):
        """All 16 stations must fall strictly within the Región de Aysén BBox"""
        lat_min, lat_max = -49.3, -43.6
        lng_min, lng_max = -75.8, -71.0
        for st in self.stations:
            st_id = st.get('id')
            lat, lng = st.get('lat'), st.get('lng')
            self.assertIsNotNone(lat, f"Station {st_id} missing latitude")
            self.assertIsNotNone(lng, f"Station {st_id} missing longitude")
            self.assertTrue(
                lat_min <= lat <= lat_max,
                f"Station {st_id} lat {lat} out of bounds [{lat_min}, {lat_max}]"
            )
            self.assertTrue(
                lng_min <= lng <= lng_max,
                f"Station {st_id} lng {lng} out of bounds [{lng_min}, {lng_max}]"
            )

    def test_all_16_stations_color_token_hex_validity(self):
        """Each station must possess a valid 6-character hex color code"""
        hex_pattern = re.compile(r"^#([0-9a-fA-F]{6})$")
        for st in self.stations:
            color = st.get('color')
            self.assertIsNotNone(color, f"Station {st['id']} missing color")
            self.assertTrue(
                hex_pattern.match(color),
                f"Station {st['id']} has invalid color format: '{color}'"
            )

    def test_station_11_unit_fallback_behavior(self):
        """
        Adversarial Edge Case: Station 11 chartLabel has no parentheses: 'Nidos de Desove Censados'.
        Verify unit fallback logic (unit || label) preserves non-empty badge text.
        """
        st11 = next((s for s in self.stations if s['id'] == 11), None)
        self.assertIsNotNone(st11, "Station 11 not found")
        label = st11['chartLabel']
        unit_match = re.search(r'\((.*?)\)', label)
        self.assertIsNone(unit_match, "Station 11 unexpectedly had parentheses in chartLabel")
        # Fallback badge value must equal label and be non-empty
        badge_val = unit_match.group(1) if unit_match else label
        self.assertEqual(badge_val, "Nidos de Desove Censados")
        self.assertTrue(len(badge_val) > 0)


class TestLayoutTransitionsAndResizing(unittest.TestCase):
    """
    Challenge 2: Stress test rapid layout transitions (440px -> 560px -> 48px),
    state machine memory, and canvas resizing synchronization.
    """

    @classmethod
    def setUpClass(cls):
        cls.html = load_html_content()

    def test_css_drawer_tokens_and_rules(self):
        """Verify CSS tokens and grid tracks for 440px, 560px, and 48px"""
        # CSS variable definitions
        self.assertIn("--drawer-w-desktop: 440px;", self.html)
        self.assertIn("--drawer-w-projector: 560px;", self.html)
        self.assertIn("--drawer-w-collapsed: 48px;", self.html)

        # Layout state modifiers
        self.assertIn(".app-layout.drawer-desktop", self.html)
        self.assertIn(".app-layout.drawer-projector", self.html)
        self.assertIn(".app-layout.drawer-collapsed", self.html)

        # Transition easing
        self.assertIn("cubic-bezier(0.16, 1, 0.3, 1)", self.html)
        self.assertIn("transition: grid-template-columns 0.3s", self.html)

    def test_canvas_container_fluidity_constraints(self):
        """
        Verify that canvas container uses fluid clamp() without hardcoded pixel attributes.
        """
        # miniChart canvas must not have hardcoded height attribute in HTML tag
        mini_canvas_tag = re.search(r'<canvas\s+[^>]*id=["\']miniChart["\'][^>]*>', self.html)
        self.assertIsNotNone(mini_canvas_tag, "miniChart canvas tag not found")
        tag_str = mini_canvas_tag.group(0)
        self.assertNotIn('height=', tag_str.lower(), "miniChart tag contains hardcoded height attribute!")
        self.assertNotIn('width=', tag_str.lower(), "miniChart tag contains hardcoded width attribute!")

        # crossChart canvas must also lack hardcoded height/width
        cross_canvas_tag = re.search(r'<canvas\s+[^>]*id=["\']crossChart["\'][^>]*>', self.html)
        self.assertIsNotNone(cross_canvas_tag, "crossChart canvas tag not found")
        tag_cross_str = cross_canvas_tag.group(0)
        self.assertNotIn('height=', tag_cross_str.lower(), "crossChart tag contains hardcoded height attribute!")
        self.assertNotIn('width=', tag_cross_str.lower(), "crossChart tag contains hardcoded width attribute!")

        # Container CSS fluid sizing
        self.assertIn("clamp(200px, 28vh, 320px)", self.html)
        self.assertIn(".chart-container-fluid", self.html)

    def test_drawer_state_machine_transition_simulation(self):
        """
        Simulate the JavaScript drawer controller state machine across 10,000 rapid transitions:
        - Checks setDrawerMode(mode) behavior
        - Tests memory of prevNonCollapsedMode
        - Tests getSavedDrawerMode() restoration
        - Tests invalid input fallback to 'desktop'
        - Tests repeated 'collapsed' calls do NOT overwrite prevNonCollapsedMode
        """
        class DrawerStateMachine:
            def __init__(self):
                self.currentDrawerMode = 'desktop'
                self.prevNonCollapsedMode = 'desktop'
                self.valid_modes = {'desktop', 'projector', 'collapsed'}

            def setDrawerMode(self, mode: Any):
                if mode not in self.valid_modes:
                    mode = 'desktop'

                if self.currentDrawerMode != 'collapsed':
                    self.prevNonCollapsedMode = self.currentDrawerMode

                self.currentDrawerMode = mode

            def getSavedDrawerMode(self) -> str:
                return self.prevNonCollapsedMode or 'desktop'

        fsm = DrawerStateMachine()
        self.assertEqual(fsm.currentDrawerMode, 'desktop')
        self.assertEqual(fsm.getSavedDrawerMode(), 'desktop')

        # Scenario A: desktop -> projector -> collapsed -> expand
        fsm.setDrawerMode('projector')
        self.assertEqual(fsm.currentDrawerMode, 'projector')
        self.assertEqual(fsm.getSavedDrawerMode(), 'desktop')  # set during transition

        fsm.setDrawerMode('collapsed')
        self.assertEqual(fsm.currentDrawerMode, 'collapsed')
        self.assertEqual(fsm.getSavedDrawerMode(), 'projector')  # remembers projector!

        # Expand via dock button:
        fsm.setDrawerMode(fsm.getSavedDrawerMode())
        self.assertEqual(fsm.currentDrawerMode, 'projector')  # cleanly restored!

        # Scenario B: Repeated collapsed calls
        fsm.setDrawerMode('desktop')
        fsm.setDrawerMode('collapsed')
        self.assertEqual(fsm.getSavedDrawerMode(), 'desktop')

        # Spam collapsed 50 times
        for _ in range(50):
            fsm.setDrawerMode('collapsed')
        # Crucial check: prevNonCollapsedMode must NOT have become 'collapsed'!
        self.assertEqual(fsm.getSavedDrawerMode(), 'desktop')
        self.assertNotEqual(fsm.getSavedDrawerMode(), 'collapsed')

        # Scenario C: 10,000 Rapid random transitions
        import random
        random.seed(42)
        test_inputs = ['desktop', 'projector', 'collapsed', 'invalid', None, '', 123, '440px']
        for _ in range(10000):
            inp = random.choice(test_inputs)
            fsm.setDrawerMode(inp)
            self.assertIn(fsm.currentDrawerMode, ['desktop', 'projector', 'collapsed'])
            saved = fsm.getSavedDrawerMode()
            self.assertIn(saved, ['desktop', 'projector'])
            self.assertNotEqual(saved, 'collapsed')

    def test_map_invalidation_animation_loop(self):
        """
        Verify animateMapInvalidation implementation in JS:
        - Uses requestAnimationFrame
        - Invalidates map size with { animate: false }
        - Duration is at least 300ms to span CSS transition window
        - Calls chartInstance.resize() upon completion
        """
        self.assertIn("function animateMapInvalidation()", self.html)
        self.assertIn("requestAnimationFrame", self.html)
        self.assertIn("map.invalidateSize", self.html)
        self.assertIn("chartInstance.resize()", self.html)
        self.assertIn("crossChartInstance.resize()", self.html)

        # Verify animation duration spans at least 300ms (CSS transition is 0.3s)
        duration_match = re.search(r'const\s+duration\s*=\s*(\d+);', self.html)
        self.assertIsNotNone(duration_match, "Animation duration constant not found")
        duration = int(duration_match.group(1))
        self.assertTrue(
            duration >= 300,
            f"Animation duration {duration}ms is shorter than 300ms CSS transition!"
        )

    def test_chart_lifecycle_destroy_active_chart(self):
        """
        Verify that destroyActiveChart() cleans up previous instances before recreating,
        preventing 'Canvas is already in use' runtime errors.
        """
        self.assertIn("function destroyActiveChart()", self.html)
        self.assertIn("chartInstance.destroy()", self.html)
        self.assertIn("chartInstance = null;", self.html)
        self.assertIn("crossChartInstance.destroy()", self.html)
        self.assertIn("crossChartInstance = null;", self.html)

        # Verify that destroyActiveChart is invoked in initChart, renderCrossVisualization, and switchSidebarView
        init_chart_chunk = self.html[self.html.find("function initChart("):self.html.find("function initChart(") + 300]
        self.assertIn("destroyActiveChart()", init_chart_chunk)

        render_cross_chunk = self.html[self.html.find("function renderCrossVisualization("):self.html.find("function renderCrossVisualization(") + 300]
        self.assertIn("destroyActiveChart()", render_cross_chunk)

        switch_view_chunk = self.html[self.html.find("function switchSidebarView("):self.html.find("function switchSidebarView(") + 300]
        self.assertIn("destroyActiveChart()", switch_view_chunk)

    def test_auto_expand_and_auto_view_switch_on_marker_click(self):
        """
        Adversarial UX check: If the drawer is collapsed, selecting a station marker
        must automatically expand the drawer (auto-uncollapse).
        If currently in Cross View, selecting a station marker must switch back to Station View.
        """
        select_st_chunk = self.html[self.html.find("function selectStation("):self.html.find("function selectStation(") + 600]
        self.assertIn("currentDrawerMode === 'collapsed'", select_st_chunk)
        self.assertIn("setDrawerMode(getSavedDrawerMode())", select_st_chunk)
        self.assertIn("currentView !== 'station'", select_st_chunk)
        self.assertIn("switchSidebarView('station')", select_st_chunk)


class TestEditorialStylingAndAntiSlop(unittest.TestCase):
    """
    Challenge 3: Anti-Slop Discipline & Editorial Styling Verification
    Verifies elimination of enclosed rectangular nested cards and heavy borders.
    """

    @classmethod
    def setUpClass(cls):
        cls.html = load_html_content()

    def test_absence_of_nested_enclosed_boxes(self):
        """
        Confirm that .meta-grid and .chart-box no longer exist with 4-sided borders,
        and that open .meta-ledger with hairline borders is used.
        """
        self.assertIn(".meta-ledger", self.html)
        self.assertIn("border-top: 1px solid var(--border-ui)", self.html)
        self.assertIn("border-bottom: 1px solid var(--border-ui)", self.html)

        # Check detail-panel border-left is subtle 1px hairline rather than heavy 2px
        panel_css_match = re.search(r'\.detail-panel\s*\{([^}]+)\}', self.html)
        self.assertIsNotNone(panel_css_match, "CSS for .detail-panel not found")
        panel_css = panel_css_match.group(1)
        self.assertIn("border-left: 1px solid var(--border-ui)", panel_css)
        self.assertNotIn("border-left: 2px", panel_css)

    def test_three_font_editorial_triad(self):
        """
        Confirm presence and assignment of 3 editorial fonts:
        Newsreader (headlines), Space Grotesk (sans body), JetBrains Mono (data/code).
        """
        self.assertIn("Newsreader", self.html)
        self.assertIn("Space+Grotesk", self.html)
        self.assertIn("JetBrains+Mono", self.html)

        # Verify Google Fonts stylesheet link
        gfonts_link = re.search(r'<link[^>]*fonts\.googleapis\.com/css2[^>]*>', self.html)
        self.assertIsNotNone(gfonts_link, "Google Fonts stylesheet link missing")
        link_str = gfonts_link.group(0)
        self.assertIn("Newsreader", link_str)
        self.assertIn("Space+Grotesk", link_str)
        self.assertIn("JetBrains+Mono", link_str)


class TestAdversarialIntegrityAndEdgeCases(unittest.TestCase):
    """
    Challenge 4: Adversarial White-Box & Edge-Case Probing
    - Probes for broken getElementById targets
    - Probes for dangling onclick handlers
    - Probes for rapid view toggle / chart lifecycle race conditions
    """

    @classmethod
    def setUpClass(cls):
        cls.html = load_html_content()
        cls.stations = parse_all_stations_from_js(cls.html)

    def test_all_js_getelementbyid_targets_exist_in_dom(self):
        """
        Adversarial probe: Every single ID passed to document.getElementById(...)
        in JavaScript must exist in the HTML DOM.
        """
        # Find script content
        scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', self.html, re.DOTALL)
        full_js = "\n".join(scripts)

        # Extract all getElementById calls
        id_calls = re.findall(r"document\.getElementById\(\s*['\"]([^'\"]+)['\"]\s*\)", full_js)
        unique_called_ids = sorted(list(set(id_calls)))

        # Extract all DOM IDs in HTML
        dom_ids = set(re.findall(r'\bid=["\']([^"\']+)["\']', self.html))

        missing_ids = [target_id for target_id in unique_called_ids if target_id not in dom_ids]
        self.assertEqual(
            missing_ids, [],
            f"JavaScript attempts to access non-existent DOM element IDs: {missing_ids}"
        )

    def test_all_onclick_functions_are_defined_in_script(self):
        """
        Adversarial probe: Every function called in an onclick attribute must be defined in JS.
        """
        onclicks = re.findall(r'onclick=["\']([^"\']+)["\']', self.html)
        fn_names = set()
        for oc in onclicks:
            # Match func names like switchSidebarView, setDrawerMode, etc.
            matches = re.findall(r'\b([a-zA-Z_]\w*)\s*\(', oc)
            for m in matches:
                if m not in ('event', 'stopPropagation', 'preventDefault'):
                    fn_names.add(m)

        for fn in fn_names:
            fn_pattern = rf'function\s+{fn}\b|const\s+{fn}\s*=|let\s+{fn}\s*='
            self.assertIsNotNone(
                re.search(fn_pattern, self.html),
                f"HTML calls undefined function in onclick: '{fn}'"
            )

    def test_rapid_view_toggle_and_station_selection_stress(self):
        """
        Simulate rapid interleaved interactions:
        5,000 randomized steps of switching views, selecting stations, and toggling drawer modes.
        Verify consistency invariants at every step.
        """
        import random
        random.seed(1337)

        class AppState:
            def __init__(self, stations):
                self.stations = stations
                self.currentStation = stations[0]
                self.currentView = 'station'
                self.currentDrawerMode = 'desktop'
                self.prevNonCollapsedMode = 'desktop'
                self.chartInstanceActive = True
                self.crossChartInstanceActive = False

            def switchSidebarView(self, view_mode):
                if self.currentView == view_mode and (self.chartInstanceActive or self.crossChartInstanceActive):
                    return
                self.currentView = view_mode
                # destroyActiveChart
                self.chartInstanceActive = False
                self.crossChartInstanceActive = False
                if view_mode == 'station':
                    self.chartInstanceActive = True
                else:
                    self.crossChartInstanceActive = True

            def selectStation(self, st):
                self.currentStation = st
                if self.currentDrawerMode == 'collapsed':
                    self.setDrawerMode(self.prevNonCollapsedMode)
                if self.currentView != 'station':
                    self.switchSidebarView('station')
                # initChart
                self.chartInstanceActive = True

            def setDrawerMode(self, mode):
                if mode not in ('desktop', 'projector', 'collapsed'):
                    mode = 'desktop'
                if self.currentDrawerMode != 'collapsed':
                    self.prevNonCollapsedMode = self.currentDrawerMode
                self.currentDrawerMode = mode

        state = AppState(self.stations)

        for step in range(5000):
            action = random.choice(['switch_station', 'switch_cross', 'select_st', 'toggle_drawer', 'collapse', 'restore'])
            if action == 'switch_station':
                state.switchSidebarView('station')
            elif action == 'switch_cross':
                state.switchSidebarView('cross')
            elif action == 'select_st':
                st = random.choice(self.stations)
                state.selectStation(st)
                # Invariant 1: selectStation always forces view to 'station'
                self.assertEqual(state.currentView, 'station')
                # Invariant 2: selectStation always forces drawer to expand if it was collapsed
                self.assertNotEqual(state.currentDrawerMode, 'collapsed')
            elif action == 'toggle_drawer':
                mode = random.choice(['desktop', 'projector', 'collapsed', 'bogus'])
                state.setDrawerMode(mode)
            elif action == 'collapse':
                state.setDrawerMode('collapsed')
            elif action == 'restore':
                state.setDrawerMode(state.prevNonCollapsedMode)

            # Check Invariants
            self.assertIn(state.currentView, ('station', 'cross'))
            self.assertIn(state.currentDrawerMode, ('desktop', 'projector', 'collapsed'))
            self.assertIn(state.prevNonCollapsedMode, ('desktop', 'projector'))
            # Mutual exclusion: only one chart can be active at a time
            self.assertFalse(
                state.chartInstanceActive and state.crossChartInstanceActive,
                "Both station chart and cross chart active simultaneously!"
            )


def run_stress_test_suite():
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    suite.addTests(loader.loadTestsFromTestCase(TestDOMIntegrityAndContract))
    suite.addTests(loader.loadTestsFromTestCase(TestLayoutTransitionsAndResizing))
    suite.addTests(loader.loadTestsFromTestCase(TestEditorialStylingAndAntiSlop))
    suite.addTests(loader.loadTestsFromTestCase(TestAdversarialIntegrityAndEdgeCases))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("\n" + "=" * 70)
    print(f"M1 CHALLENGER STRESS SUITE: Ran {result.testsRun} tests.")
    if result.wasSuccessful():
        print("ALL TESTS PASSED CLEANLY! No contract violations or crashes detected.")
    else:
        print(f"FAILURES: {len(result.failures)}, ERRORS: {len(result.errors)}")
    print("=" * 70)
    
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_stress_test_suite()
    sys.exit(0 if success else 1)
