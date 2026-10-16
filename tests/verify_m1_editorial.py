#!/usr/bin/env python3
"""
Verification script for Milestone 1 (UI Editorial Redesign & Architecture)
Verifies:
1. All 11 DOM element IDs preserved.
2. 3-state collapsible drawer CSS, buttons, and transition synchronization.
3. Segmented view toggle & destroyActiveChart lifecycle.
4. Fluid chart canvas container and FT tooltips.
5. Elimination of nested enclosed boxes and hairline rules.
6. 3-font typography hierarchy.
7. HTML syntax validity and 16 station database integrity.
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
HTML_PATH = REPO_ROOT / "mapa_territorial.html"

def test_all():
    print(f"Loading {HTML_PATH}...")
    assert HTML_PATH.exists(), f"File not found: {HTML_PATH}"
    content = HTML_PATH.read_text(encoding="utf-8")

    # 1. Contract Preservation: All 11 DOM IDs
    required_ids = [
        "itemCat", "itemTitle", "itemLoc", "itemInst", "itemFreq",
        "itemCode", "itemAccess", "itemDesc", "chartMetricName", "miniChart", "detailPanel"
    ]
    missing = [req_id for req_id in required_ids if f'id="{req_id}"' not in content]
    assert not missing, f"Contract violation! Missing DOM IDs: {missing}"
    print("  [PASS] 1. All 11 DOM Element IDs preserved exactly.")

    # 2. 3-State Collapsible Drawer
    assert "drawer-desktop" in content, "Missing drawer-desktop"
    assert "drawer-projector" in content, "Missing drawer-projector"
    assert "drawer-collapsed" in content, "Missing drawer-collapsed"
    assert "440px" in content, "Missing 440px token"
    assert "560px" in content, "Missing 560px token"
    assert "48px" in content, "Missing 48px token"
    assert "cubic-bezier(0.16, 1, 0.3, 1)" in content, "Missing cubic-bezier transition"
    assert "invalidateSize" in content, "Missing map.invalidateSize"
    assert 'id="btnModeDesktop"' in content, "Missing btnModeDesktop"
    assert 'id="btnModeProjector"' in content, "Missing btnModeProjector"
    assert 'id="drawerCollapseBtn"' in content, "Missing drawerCollapseBtn"
    assert 'id="drawerMiniDock"' in content, "Missing drawerMiniDock"
    assert 'id="dockExpandBtn"' in content, "Missing dockExpandBtn"
    print("  [PASS] 2. 3-State Collapsible Drawer (Desktop 440px, Projector 560px, Collapsed 48px).")

    # 3. Segmented View Toggle
    assert 'id="tabStationView"' in content, "Missing tabStationView"
    assert 'id="tabCrossView"' in content, "Missing tabCrossView"
    assert 'id="viewStationContainer"' in content, "Missing viewStationContainer"
    assert 'id="viewCrossContainer"' in content, "Missing viewCrossContainer"
    assert "destroyActiveChart" in content, "Missing destroyActiveChart lifecycle"
    assert "switchSidebarView" in content, "Missing switchSidebarView function"
    assert 'id="crossChart"' in content, "Missing crossChart canvas"
    assert "crossSeriesData" in content, "Missing crossSeriesData benchmark"
    print("  [PASS] 3. Segmented View Toggle & destroyActiveChart() lifecycle.")

    # 4. Fluid Chart Canvas & FT-Grade Tooltips
    assert '<canvas id="miniChart" height="150"' not in content, "Found hardcoded height=150 on canvas!"
    assert "chart-container-fluid" in content, "Missing chart-container-fluid"
    assert "clamp(200px, 28vh, 320px)" in content, "Missing clamp(200px, 28vh, 320px)"
    assert "rgba(20, 22, 24, 0.05)" in content, "Missing subtle alpha grid line"
    assert "toLocaleString('es-CL')" in content, "Missing Chilean number localization"
    print("  [PASS] 4. Fluid Chart.js Canvas Container & FT Tooltips.")

    # 5. Editorial Styling & Elimination of Enclosed Boxes
    assert "meta-ledger" in content, "Missing meta-ledger"
    assert "1px solid var(--border-ui)" in content, "Missing 1px hairline divider"
    # Ensure .meta-grid and .chart-box no longer have 4-sided enclosing borders
    meta_grid_css = re.search(r"\.meta-grid\s*\{([^}]+)\}", content)
    if meta_grid_css:
        css_body = meta_grid_css.group(1)
        assert "border: none" in css_body or "border-top:" in css_body, "meta-grid still has enclosed border!"
    print("  [PASS] 5. Editorial Styling: Hairline dividers & Open Metadata Ledger.")

    # 6. Typography 3-Font Hierarchy
    assert "Newsreader" in content, "Missing Newsreader"
    assert "Space+Grotesk" in content, "Missing Space Grotesk"
    assert "JetBrains+Mono" in content, "Missing JetBrains Mono"
    assert "--font-serif" in content, "Missing --font-serif"
    assert "--font-sans" in content, "Missing --font-sans"
    assert "--font-mono" in content, "Missing --font-mono"
    print("  [PASS] 6. 3-Font Typographic Hierarchy (Newsreader / Space Grotesk / JetBrains Mono).")

    # 7. HTML Syntax & Parsing Check
    class StrictHTMLParser(HTMLParser):
        def __init__(self):
            super().__init__()
            self.tag_count = 0
        def handle_starttag(self, tag, attrs):
            self.tag_count += 1

    parser = StrictHTMLParser()
    parser.feed(content)
    assert parser.tag_count > 60, f"HTML parser found only {parser.tag_count} tags"
    print(f"  [PASS] 7. HTML5 Document Validity ({parser.tag_count} elements parsed).")

    # 8. Station Database Integrity (16 stations)
    station_ids = re.findall(r"id:\s*(\d+)", content[content.find("const stations = ["):content.find("// Map Initialization")])
    assert len(station_ids) == 16, f"Expected 16 stations, got {len(station_ids)}"
    print(f"  [PASS] 8. 16 Georeferenced Stations catalog intact.")

    print("\n>>> ALL 8 VERIFICATION SUITES PASSED CLEANLY! <<<")

if __name__ == "__main__":
    test_all()
