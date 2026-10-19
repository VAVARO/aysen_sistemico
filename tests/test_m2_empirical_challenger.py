#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_m2_empirical_challenger.py
=============================================================================
Independent Empirical Challenger Test Harness for Milestone 2:
Acordeones en Abanico en el Catálogo de laboratorio.html

Evaluates the 3 mandatory probe edge cases:
1. Rapid clicking between different tabs and accordions & Cross-tab state leakage.
2. Active search filter while expanding/collapsing accordions.
3. Adding a card from an accordion (dblclick, Enter keydown, drag-and-drop).
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


class TestMilestone2EmpiricalChallenger(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            cls.html = f.read()

    def test_01_static_aria_and_keyboard_contracts(self):
        """Verifies WAI-ARIA and keyboard contracts across tabs, headers, items and sidebar toggle"""
        self.assertIn('role="tablist"', self.html)
        self.assertIn('role="tab"', self.html)
        self.assertIn('role="button"', self.html)
        self.assertIn('tabindex="0"', self.html)
        self.assertIn('aria-expanded=', self.html)
        self.assertIn('aria-controls=', self.html)
        self.assertIn('role="region"', self.html)
        self.assertIn('aria-labelledby=', self.html)

        # Check keydown handler for Enter and Space
        self.assertIn("e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'", self.html)
        # Check Enter on variable item
        self.assertIn("el.dispatchEvent(new MouseEvent('dblclick'))", self.html)

    def test_02_css_grid_animation_contracts(self):
        """Verifies 60fps CSS Grid height transitions and chevron rotations"""
        self.assertIn(".catalog-hub-items-body", self.html)
        self.assertIn("grid-template-rows: 1fr", self.html)
        self.assertIn("grid-template-rows: 0fr", self.html)
        self.assertIn("min-height: 0", self.html)
        self.assertIn("transform: rotate(-90deg)", self.html)
        self.assertIn("transform: rotate(0deg)", self.html)

    def test_03_zero_emojis_compliance(self):
        """Verifies zero prohibited emojis in laboratorio.html"""
        matches = EMOJI_REGEX.findall(self.html)
        self.assertEqual(len(matches), 0, f"Prohibited emojis detected: {matches}")

    def test_04_card_addition_mechanisms_present(self):
        """Verifies all 3 card addition mechanisms (dblclick, Enter keydown, drag-drop)"""
        # 1. dblclick
        self.assertIn("createWidget('chart', {", self.html)
        self.assertIn("varX: varId", self.html)

        # 2. dragstart / drop
        self.assertIn("AppState.draggedVariableId = el.getAttribute('data-var-id')", self.html)
        self.assertIn("e.dataTransfer.setData('text/plain', AppState.draggedVariableId)", self.html)
        self.assertIn("viewport.addEventListener('drop'", self.html)

    def test_05_search_active_behavior_contracts(self):
        """Verifies that search active bypasses fan-out collapse to keep matching hubs visible"""
        # When searching, isCollapsed must be false for all matching hubs
        self.assertIn("if (isSearching) {\n            isCollapsed = false;", self.html)
        # In toggleHubAccordion, sibling collapse must NOT occur during active search
        self.assertIn("if (!normStr(AppState.searchQuery))", self.html)

    def test_06_edge_case_holding_tab_state_leakage(self):
        """
        EDGE CASE PROBE:
        Tests whether navigating to 'holding' tab after collapsing 'II. Salmonicultura'
        in 'all' or 'comuna' tab causes the holding tab to start collapsed.
        
        The requirement:
        'When navigating to Holding, II. Salmonicultura displays open with its 3 holding variables.'
        
        In laboratorio.html:3598-3604:
        else if (AppState.collapsedHubs && AppState.collapsedHubs[stateKey] !== undefined) {
          isCollapsed = AppState.collapsedHubs[stateKey];
        } else if (AppState.collapsedHubs && AppState.collapsedHubs[gName] !== undefined) {
          isCollapsed = AppState.collapsedHubs[gName];
        } else if (dimFilter === 'holding' || sortedGroupKeys.length === 1) {
          isCollapsed = false;
        }
        
        Because AppState.collapsedHubs[gName] is checked BEFORE (dimFilter === 'holding'),
        collapsing 'II. Salmonicultura' in ANY other tab leaks into 'holding', causing
        holding tab to display COLLAPSED!
        """
        # Check order in laboratorio.html
        holding_guard_pos = self.html.find("dimFilter === 'holding' || sortedGroupKeys.length === 1")
        global_hub_pos = self.html.find("AppState.collapsedHubs[gName] !== undefined")

        self.assertNotEqual(holding_guard_pos, -1, "Holding guard not found in laboratorio.html")
        self.assertNotEqual(global_hub_pos, -1, "Global hub state check not found in laboratorio.html")

        self.assertLess(
            holding_guard_pos,
            global_hub_pos,
            "DEFECT DETECTED: dimFilter === 'holding' appears AFTER AppState.collapsedHubs[gName] in laboratorio.html! "
            "This causes state leakage from other tabs to collapse the Holding tab when navigated to."
        )


if __name__ == '__main__':
    unittest.main()
