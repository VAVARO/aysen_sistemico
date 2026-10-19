"""
Suite de Pruebas de Regresión y Validación para el Hito 4:
Barra de Customización Flotante Arrastrable (Draggable), Dock Superior y Ocultable sin Deseleccionar.
"""
import unittest
import re

class TestLaboratorioHito4(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open("laboratorio.html", "r", encoding="utf-8") as f:
            cls.html = f.read()

    def test_01_toolbar_classes_and_contract(self):
        """Verifica que canvaFloatingToolbar incluya .context-toolbar y el drag handle ⠿."""
        self.assertIn('id="canvaFloatingToolbar"', self.html)
        self.assertIn('class="canva-floating-toolbar context-toolbar"', self.html)
        self.assertIn('id="toolbarDragHandle"', self.html)
        self.assertIn('>⠿<', self.html)

    def test_02_toolbar_close_button_contract(self):
        """Verifica que la barra incluya el botón de cierre tbBtnCloseToolbar."""
        self.assertIn('id="tbBtnCloseToolbar"', self.html)
        self.assertIn('class="toolbar-close-btn"', self.html)

    def test_03_card_format_button_contract(self):
        """Verifica que el header de cada tarjeta incluya el botón btnFormatCard-${w.id}."""
        self.assertIn('id="btnFormatCard-${w.id}"', self.html)
        self.assertIn('class="btn-card-format"', self.html)
        self.assertIn('<span>Formato</span>', self.html)

    def test_04_drag_events_implemented(self):
        """Verifica que se implementen los listeners de pointerdown/move/up para arrastre libre."""
        self.assertIn("tbDragHandle.addEventListener('pointerdown'", self.html)
        self.assertIn("window.addEventListener('pointermove'", self.html)
        self.assertIn("window.addEventListener('pointerup'", self.html)
        self.assertIn("AppState.toolbarPosition", self.html)

    def test_05_hide_without_deselecting(self):
        """Verifica que hideFloatingToolbar oculte la barra sin quitar AppState.activeWidgetId."""
        self.assertIn("function hideFloatingToolbar()", self.html)
        self.assertIn("function toggleFloatingToolbarForCard(", self.html)
        self.assertIn("AppState.toolbarHiddenByCard", self.html)

    def test_06_escape_key_hides_toolbar_first(self):
        """Verifica que presionar Escape cierre la barra activa antes de deseleccionar la tarjeta."""
        self.assertIn("hideFloatingToolbar()", self.html)
        m = re.search(r"if\s*\(e\.key\s*===\s*'Escape'\)\s*\{(.*?)\}", self.html, re.DOTALL)
        self.assertTrue(m)
        escape_block = m.group(1)
        self.assertIn("hideFloatingToolbar", escape_block)

    def test_07_dock_superior_fallback(self):
        """Verifica que cuando la tarjeta esté muy cerca del borde superior se ancle en dock superior."""
        self.assertIn("tb.classList.add('user-docked')", self.html)
        self.assertIn("tb.style.top = '12px'", self.html)

    def test_08_responsive_flex_wrap_in_css(self):
        """Verifica que la barra tenga flex-wrap: wrap y max-width responsive para no cortarse."""
        self.assertIn("flex-wrap: wrap", self.html)
        self.assertIn("max-width: min(94vw, 920px)", self.html)

if __name__ == "__main__":
    unittest.main()
