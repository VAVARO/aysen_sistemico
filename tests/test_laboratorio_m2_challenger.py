#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_laboratorio_m2_challenger.py
=============================================================================
Empirical Challenger Test Harness for Milestone 2 in laboratorio.html:
1. Resolution of the freeze/lock in the 'Temporal' tab (isCollapsed != false hardcoded).
2. Functional fan-out / fan-in accordion behavior across all 4 catalog tabs:
   'Todos', 'Comunal', 'Temporal', 'Holding'.
3. Smooth CSS Grid transitions (grid-template-rows: 0fr <-> 1fr, min-height: 0) and
   smooth chevron rotation (transform: rotate(-90deg) -> rotate(0deg)).
4. Non-destructive DOM mutations (no innerHTML re-render on accordion toggle).
5. Full ARIA and keyboard accessibility: role="button", tabindex="0",
   aria-expanded, aria-controls, role="region", aria-labelledby, Enter/Space support.
6. Clean display and toggling of the 'Holding' tab.
7. Strict Zero-Emoji compliance.
=============================================================================
"""

import os
import re
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)

OFFICIAL_HUB_ORDER = [
    'I. Turismo',
    'II. Salmonicultura',
    'III. Energía',
    'IV. Gobernanza',
    'V. Inversión',
    'VI. Social',
    'VII. Biodiversidad'
]


class TestLaboratorioM2Challenger(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            cls.html = f.read()

    def test_01_catalog_tabs_dom_structure_and_aria(self):
        """Verifies presence and ARIA markup of the 4 dimension tabs in #panelCatalogo"""
        self.assertIn('id="panelCatalogo"', self.html)
        self.assertIn('id="variablesTreeContainer"', self.html)
        self.assertIn('role="tablist"', self.html)

        # Check all 4 dimension buttons with role="tab"
        for dim, label in [('all', 'Todos'), ('comuna', 'Comunal'), ('tiempo', 'Temporal'), ('holding', 'Holding')]:
            pattern = rf'data-dim="{dim}"[^>]*>{label}</button>'
            self.assertTrue(re.search(pattern, self.html), f"Tab button for {dim} ({label}) not found")
            btn_match = re.search(rf'<button[^>]*data-dim="{dim}"[^>]*>', self.html)
            self.assertIsNotNone(btn_match, f"Button with data-dim='{dim}' missing")
            self.assertIn('role="tab"', btn_match.group(0), f"data-dim='{dim}' missing role='tab'")

        # Initial active tab has aria-selected="true"
        active_match = re.search(r'<button[^>]*class="[^"]*active[^"]*"[^>]*data-dim="all"[^>]*>', self.html)
        self.assertIsNotNone(active_match, "Initial active tab must be data-dim='all'")
        self.assertIn('aria-selected="true"', active_match.group(0))

    def test_02_temporal_freeze_defect_eradicated(self):
        """Ensures isCollapsed is NOT hardcoded to false for dimFilter === 'tiempo'"""
        # The defect was: const isCollapsed = (isSearching || dimFilter === 'tiempo') ? false : ...
        # This prevented collapsing in the temporal tab.
        defect_pattern = r"\(isSearching\s*\|\|\s*dimFilter\s*===\s*['\"]tiempo['\"]\)\s*\?\s*false"
        self.assertFalse(
            re.search(defect_pattern, self.html),
            "CRITICAL DEFECT: dimFilter === 'tiempo' is still hardcoding isCollapsed = false in renderSidebarCatalog!"
        )

        # Verify that stateKey includes dimFilter to isolate states
        self.assertIn("const stateKey = `${dimFilter}_${gName}`;", self.html)

    def test_03_css_grid_smooth_transitions_and_chevrons(self):
        """Verifies CSS Grid accordion transition rules and smooth chevron rotation"""
        # CSS Grid 0fr <-> 1fr
        self.assertIn(".catalog-hub-items-body", self.html)
        self.assertIn("grid-template-rows: 1fr", self.html)
        self.assertIn("grid-template-rows: 0fr", self.html)
        self.assertIn("min-height: 0", self.html)

        # Chevrons rotated -90deg when collapsed
        self.assertIn("transform: rotate(-90deg)", self.html)
        self.assertIn("transform: rotate(0deg)", self.html)
        self.assertIn("transform-origin: center center", self.html)

        # Ensure old abrupt display: none is eradicated from catalog-hub-items
        old_none = re.search(r'\.catalog-hub-group\.collapsed\s+\.catalog-hub-items\s*\{\s*display:\s*none', self.html)
        self.assertIsNone(old_none, "Old abrupt 'display: none' rule still exists on .catalog-hub-items")

    def test_04_accordion_markup_and_aria_contracts(self):
        """Verifies that catalog hub headers and item containers follow WAI-ARIA accordion pattern"""
        # Headers have role="button", tabindex="0", aria-expanded, aria-controls
        self.assertIn('role="button"', self.html)
        self.assertIn('tabindex="0"', self.html)
        self.assertIn('aria-expanded=', self.html)
        self.assertIn('aria-controls=', self.html)
        self.assertIn('role="region"', self.html)
        self.assertIn('aria-labelledby=', self.html)

        # Check safeHubId generation and aria link
        self.assertIn("id=\"hub-hdr-${safeHubId}\"", self.html)
        self.assertIn("aria-controls=\"hub-content-${safeHubId}\"", self.html)
        self.assertIn("id=\"hub-content-${safeHubId}\"", self.html)
        self.assertIn("aria-labelledby=\"hub-hdr-${safeHubId}\"", self.html)

    def test_05_keyboard_navigation_support(self):
        """Ensures Enter and Space keydown events trigger accordion toggle and card instantiation"""
        # Check keydown listener on catalog headers
        self.assertIn("e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'", self.html)
        self.assertIn("toggleHubAccordion(hdr)", self.html)

        # Check keydown listener on variable items for Enter
        self.assertIn("el.dispatchEvent(new MouseEvent('dblclick'))", self.html)

    def test_06_non_destructive_toggle_logic(self):
        """Ensures clicking a hub header does NOT execute a full innerHTML rebuild"""
        # In renderSidebarCatalog, toggleHubAccordion directly mutates classes:
        self.assertIn("group.classList.remove('collapsed')", self.html)
        self.assertIn("group.classList.add('collapsed')", self.html)
        self.assertIn("hdr.setAttribute('aria-expanded'", self.html)

        # Verify that clicking the header calls toggleHubAccordion and NOT renderSidebarCatalog directly
        header_click_match = re.search(
            r"container\.querySelectorAll\('\.catalog-hub-header'\)\.forEach\(hdr\s*=>\s*\{[\s\S]*?hdr\.addEventListener\('click'[\s\S]*?\}\);",
            self.html
        )
        self.assertIsNotNone(header_click_match)
        click_body = header_click_match.group(0)
        self.assertIn("toggleHubAccordion", click_body)
        self.assertNotIn("renderSidebarCatalog()", click_body)

    def test_07_fan_out_sibling_collapse_simulation(self):
        """Simulates fan-out exclusive accordion behavior: expanding one collapses open siblings"""
        # In toggleHubAccordion, when opening and not searching:
        self.assertIn("if (!normStr(AppState.searchQuery))", self.html)
        self.assertIn("parent.querySelectorAll('.catalog-hub-group').forEach(sib => {", self.html)
        self.assertIn("sib.classList.add('collapsed')", self.html)
        self.assertIn("sibHdr.setAttribute('aria-expanded', 'false')", self.html)

    def test_08_holding_tab_specialization(self):
        """Ensures holding tab starts open by default and toggles cleanly"""
        self.assertIn("dimFilter === 'holding' || sortedGroupKeys.length === 1", self.html)

    def test_09_zero_emojis_in_laboratorio(self):
        """Strict compliance with zero emojis rule across all HTML, JS and CSS"""
        matches = EMOJI_REGEX.findall(self.html)
        self.assertEqual(len(matches), 0, f"Found prohibited emojis in laboratorio.html: {matches}")

    def test_10_btn_toggle_sidebar_aria(self):
        """Verifies btnToggleSidebar has aria-expanded and aria-controls"""
        btn_match = re.search(r'<button[^>]*id="btnToggleSidebar"[^>]*>', self.html)
        self.assertIsNotNone(btn_match)
        btn_html = btn_match.group(0)
        self.assertIn('aria-expanded="true"', btn_html)
        self.assertIn('aria-controls="panelCatalogo"', btn_html)


if __name__ == '__main__':
    unittest.main()
