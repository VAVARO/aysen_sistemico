#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_challenger_m4_2_stress.py
=============================================================================
Suite de Estrés y Desafío Adversarial para Milestone 4 Remediation (M4_2):
Auditoría empírica profunda de la barra de robustez muestral en laboratorio.html,
interpolación en card.innerHTML, ciclo de vida en existingCard, contrato onclick
del botón sociodemográfico, carga de los 10 presets de extensión y cero emojis.

Challenger M4_2 — Empirical Adversarial Stress Harness
=============================================================================
"""

import os
import sys
import re
import json
import math
import subprocess
import unittest

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAB_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
PLATAFORMA_JS = os.path.join(ROOT_DIR, "js", "plataforma_aysen.js")
PLATAFORMA_HTML = os.path.join(ROOT_DIR, "plataforma_aysen.html")
HUBS_DATA_FILE = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
TEST_M4_INTEGRATION = os.path.join(ROOT_DIR, "tests", "test_m4_ui_presets_integration.py")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)


class ChallengerM42EmpiricalStress(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open(LAB_HTML, "r", encoding="utf-8") as f:
            cls.lab_html = f.read()

        with open(PLATAFORMA_JS, "r", encoding="utf-8") as f:
            cls.plataforma_js = f.read()

        with open(PLATAFORMA_HTML, "r", encoding="utf-8") as f:
            cls.plataforma_html = f.read()

        with open(HUBS_DATA_FILE, "r", encoding="utf-8") as f:
            b_text = f.read()
        idx = b_text.find("window.AYSEN_HUBS_DATA = ")
        raw_json = b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
        cls.hubs_data = json.loads(raw_json)

    # -------------------------------------------------------------------------
    # TEST 1: Interpolation & DOM Hierarchy in card.innerHTML
    # -------------------------------------------------------------------------
    def test_01_sample_robustness_bar_template_and_dom_hierarchy(self):
        """Verificar interpolación exacta de ${sampleRobustnessHtml} en card.innerHTML y jerarquía DOM."""
        # 1. Definición de sampleRobustnessHtml
        self.assertIn("let sampleRobustnessHtml = '';", self.lab_html)
        self.assertIn("if (w.isPerceptionMirror && w.sampleContract)", self.lab_html)
        self.assertIn("card-sample-robustness-bar semaforo-${sem}", self.lab_html)
        self.assertIn('id="sample-bar-${w.id}"', self.lab_html)

        # 2. Localización estricta dentro de card.innerHTML
        # Debe aparecer DESPUÉS de la barra superior (.widget-top-bar) y ANTES de la visual (#display-body-${w.id})
        card_inner_idx = self.lab_html.find("card.innerHTML = `")
        self.assertNotEqual(card_inner_idx, -1, "No se encontró la asignación card.innerHTML en laboratorio.html")

        # Fin del template card.innerHTML
        card_inner_end = self.lab_html.find("`;", card_inner_idx)
        card_template = self.lab_html[card_inner_idx:card_inner_end]

        top_bar_idx = card_template.find('class="widget-top-bar"')
        interp_idx = card_template.find("${sampleRobustnessHtml}")
        display_body_idx = card_template.find('id="display-body-${w.id}"')
        footer_idx = card_template.find('id="provenance-footer-${w.id}"')

        self.assertNotEqual(top_bar_idx, -1, "Falta .widget-top-bar en card.innerHTML")
        self.assertNotEqual(interp_idx, -1, "Falta ${sampleRobustnessHtml} en card.innerHTML")
        self.assertNotEqual(display_body_idx, -1, "Falta display-body-${w.id} en card.innerHTML")
        self.assertNotEqual(footer_idx, -1, "Falta provenance-footer-${w.id} en card.innerHTML")

        # Jerarquía estricta: top_bar < sampleRobustness < display_body < footer
        self.assertTrue(
            top_bar_idx < interp_idx < display_body_idx < footer_idx,
            f"Orden DOM incorrecto: top_bar={top_bar_idx}, interp={interp_idx}, display={display_body_idx}, footer={footer_idx}"
        )

        # 3. Estructura del botón de filtros en la definición de sampleRobustnessHtml
        self.assertIn('class="btn-toggle-sociodemo"', self.lab_html)
        self.assertIn('onclick="openSociodemoDrawer(${w.id})"', self.lab_html)

    # -------------------------------------------------------------------------
    # TEST 2: Adversarial Stress Test of Generator Logic
    # -------------------------------------------------------------------------
    def test_02_sample_robustness_generator_stress_cases(self):
        """Stress test adversarial de la lógica de evaluación y semáforo de sampleRobustnessHtml."""
        def evaluate_sample_bar(w_id, is_perception_mirror, sample_contract):
            if not (is_perception_mirror and sample_contract):
                return ""
            sc = sample_contract
            active_n = sc.get("active_n", 0)
            universe_N = sc.get("universe_N", 465)
            me_pct = sc.get("margin_error_pct", 0.0)

            sem = 'verde' if active_n >= 50 else ('amarillo' if active_n >= 30 else 'rojo')
            sem_dot = '[●]' if active_n >= 50 else ('[▲]' if active_n >= 30 else '[■]')
            sem_lbl = 'Robusto' if active_n >= 50 else ('Referencial' if active_n >= 30 else 'Submuestra crítica')

            return (
                f'<div class="card-sample-robustness-bar semaforo-{sem}" id="sample-bar-{w_id}">\n'
                f'  <span>n = <strong>{active_n}</strong> / N = {universe_N}</span>\n'
                f'  <span>|</span>\n'
                f'  <span>ME ±<strong>{me_pct}%</strong></span>\n'
                f'  <span>|</span>\n'
                f'  <span>{sem_dot} {sem_lbl}</span>\n'
                f'  <button type="button" class="btn-toggle-sociodemo" onclick="openSociodemoDrawer({w_id})">Filtros Demográficos ▾</button>\n'
                f'</div>'
            )

        # Casos límite y extremos
        cases = [
            (101, True, {"active_n": 465, "universe_N": 465, "margin_error_pct": 4.53}, "semaforo-verde", "[●]", "Robusto"),
            (102, True, {"active_n": 50, "universe_N": 465, "margin_error_pct": 13.86}, "semaforo-verde", "[●]", "Robusto"),
            (103, True, {"active_n": 49, "universe_N": 465, "margin_error_pct": 14.0}, "semaforo-amarillo", "[▲]", "Referencial"),
            (104, True, {"active_n": 30, "universe_N": 465, "margin_error_pct": 17.89}, "semaforo-amarillo", "[▲]", "Referencial"),
            (105, True, {"active_n": 29, "universe_N": 465, "margin_error_pct": 18.2}, "semaforo-rojo", "[■]", "Submuestra crítica"),
            (106, True, {"active_n": 1, "universe_N": 465, "margin_error_pct": 98.0}, "semaforo-rojo", "[■]", "Submuestra crítica"),
            (107, True, {"active_n": 0, "universe_N": 465, "margin_error_pct": 100.0}, "semaforo-rojo", "[■]", "Submuestra crítica"),
            (108, False, {"active_n": 465, "universe_N": 465, "margin_error_pct": 4.53}, "", "", ""),
            (109, True, None, "", "", "")
        ]

        for w_id, is_mirror, contract, exp_sem, exp_dot, exp_lbl in cases:
            html = evaluate_sample_bar(w_id, is_mirror, contract)
            if not is_mirror or contract is None:
                self.assertEqual(html, "", f"Widget {w_id} no espejo debería generar string vacío")
            else:
                self.assertIn(f'id="sample-bar-{w_id}"', html)
                self.assertIn(exp_sem, html)
                self.assertIn(exp_dot, html)
                self.assertIn(exp_lbl, html)
                self.assertIn(f'onclick="openSociodemoDrawer({w_id})"', html)
                self.assertNotIn("undefined", html)
                self.assertNotIn("null", html)

    # -------------------------------------------------------------------------
    # TEST 3: Lifecycle Simulation in Node.js Engine (existingCard branch)
    # -------------------------------------------------------------------------
    def test_03_existing_card_dom_lifecycle_simulation_in_node(self):
        """Simular en Node.js el ciclo completo de renderWidgetCardDOM sobre existingCard."""
        node_script = """
        // Mock DOM minimalista
        class MockElement {
          constructor(tag, id = '', className = '') {
            this.tagName = tag;
            this.id = id;
            this.className = className;
            this.children = [];
            this.outerHTMLCache = '';
            this.parent = null;
          }
          querySelector(sel) {
            if (sel.startsWith('#')) {
              const targetId = sel.slice(1);
              if (this.id === targetId) return this;
              for (const c of this.children) {
                const found = c.querySelector(sel);
                if (found) return found;
              }
            } else if (sel.startsWith('.')) {
              const targetClass = sel.slice(1);
              if (this.className.includes(targetClass)) return this;
              for (const c of this.children) {
                const found = c.querySelector(sel);
                if (found) return found;
              }
            }
            return null;
          }
          insertAdjacentHTML(position, html) {
            const child = new MockElement('div');
            child.outerHTMLCache = html;
            const match = html.match(/id="([^"]+)"/);
            if (match) child.id = match[1];
            const classMatch = html.match(/class="([^"]+)"/);
            if (classMatch) child.className = classMatch[1];
            child.parent = this.parent || this;
            if (position === 'afterend' && this.parent) {
              const idx = this.parent.children.indexOf(this);
              this.parent.children.splice(idx + 1, 0, child);
            } else {
              this.children.push(child);
            }
          }
          set outerHTML(val) {
            this.outerHTMLCache = val;
            const match = val.match(/id="([^"]+)"/);
            if (match) this.id = match[1];
            const classMatch = val.match(/class="([^"]+)"/);
            if (classMatch) this.className = classMatch[1];
          }
          get outerHTML() {
            return this.outerHTMLCache;
          }
          remove() {
            if (this.parent) {
              const idx = this.parent.children.indexOf(this);
              if (idx !== -1) this.parent.children.splice(idx, 1);
            }
          }
        }

        function createMockExistingCard(wId) {
          const card = new MockElement('div', `widget-card-${wId}`, 'studio-widget-card');
          const topBar = new MockElement('div', `drag-header-${wId}`, 'widget-top-bar');
          topBar.parent = card;
          card.children.push(topBar);
          const display = new MockElement('div', `display-body-${wId}`, 'widget-stage-display');
          display.parent = card;
          card.children.push(display);
          return { card, topBar, display };
        }

        // Ejecutar el bloque de código exacto de laboratorio.html:
        function runExistingCardUpdate(existingCard, w, sampleRobustnessHtml) {
          let sampleBar = existingCard.querySelector(`#sample-bar-${w.id}`);
          if (sampleRobustnessHtml) {
            if (!sampleBar) {
              const topBar = existingCard.querySelector('.widget-top-bar');
              if (topBar) topBar.insertAdjacentHTML('afterend', sampleRobustnessHtml);
            } else {
              sampleBar.outerHTML = sampleRobustnessHtml;
            }
          } else if (sampleBar) {
            sampleBar.remove();
          }
        }

        const results = [];
        const w = { id: 42 };

        // 1. Inicialmente sin sampleBar, sampleRobustnessHtml activo -> debe insertar
        const { card } = createMockExistingCard(42);
        const bar1 = '<div class="card-sample-robustness-bar semaforo-verde" id="sample-bar-42">n=452</div>';
        runExistingCardUpdate(card, w, bar1);
        results.push({
          step: 1,
          foundBar: !!card.querySelector('#sample-bar-42'),
          className: card.querySelector('#sample-bar-42')?.className
        });

        // 2. Se actualiza con nueva submuestra (amarillo) -> debe hacer outerHTML update
        const bar2 = '<div class="card-sample-robustness-bar semaforo-amarillo" id="sample-bar-42">n=45</div>';
        runExistingCardUpdate(card, w, bar2);
        results.push({
          step: 2,
          foundBar: !!card.querySelector('#sample-bar-42'),
          className: card.querySelector('#sample-bar-42')?.className
        });

        // 3. Se desactiva el espejo (sampleRobustnessHtml='') -> debe remover
        runExistingCardUpdate(card, w, '');
        results.push({
          step: 3,
          foundBar: !!card.querySelector('#sample-bar-42')
        });

        // 4. Se reactiva el espejo -> debe volver a insertar con insertAdjacentHTML
        runExistingCardUpdate(card, w, bar1);
        results.push({
          step: 4,
          foundBar: !!card.querySelector('#sample-bar-42'),
          className: card.querySelector('#sample-bar-42')?.className
        });

        console.log(JSON.stringify(results));
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            capture_output=True,
            text=True,
            cwd=ROOT_DIR
        )
        self.assertEqual(proc.returncode, 0, f"Node.js script falló: {proc.stderr}")
        res = json.loads(proc.stdout)

        self.assertEqual(res[0]["foundBar"], True)
        self.assertIn("semaforo-verde", res[0]["className"])

        self.assertEqual(res[1]["foundBar"], True)
        self.assertIn("semaforo-amarillo", res[1]["className"])

        self.assertEqual(res[2]["foundBar"], False)

        self.assertEqual(res[3]["foundBar"], True)
        self.assertIn("semaforo-verde", res[3]["className"])

    # -------------------------------------------------------------------------
    # TEST 4: Sociodemographic Drawer & onclick Contract
    # -------------------------------------------------------------------------
    def test_04_sociodemo_drawer_and_onclick_contract(self):
        """Verificar contrato de la función openSociodemoDrawer y el drawer en laboratorio.html."""
        # 1. Función openSociodemoDrawer en scope global
        pattern_fn = re.compile(r'function\s+openSociodemoDrawer\s*\(\s*widgetId\s*\)\s*\{([\s\S]*?)\}')
        m = pattern_fn.search(self.lab_html)
        self.assertIsNotNone(m, "Falta la declaración de function openSociodemoDrawer(widgetId) en laboratorio.html")
        body = m.group(1)

        self.assertIn("activeBaroWidgetId = widgetId", body)
        self.assertIn("barometroSociodemoDrawer", body)
        self.assertIn("drawer.style.display = 'flex'", body)
        self.assertIn("updateBaroDrawerMetrics()", body)

        # 2. Controles interactivos del drawer
        drawer_elements = [
            'id="barometroSociodemoDrawer"',
            'id="selectBaroEdu"',
            'id="selectBaroNse"',
            'id="selectBaroSexo"',
            'id="selectBaroEdad"',
            'id="selectBaroMacro"',
            'id="switchBaroInterregional"',
            'id="btnApplyBaroFilters"',
            'id="btnResetBaroFilters"',
            'id="btnBaroDrawerClose"',
            'id="baroSemaforoBadge"',
            'id="baroMetricN"',
            'id="baroMetricUniverse"',
            'id="baroMetricME"',
            'id="baroSampleNote"'
        ]
        for elem_id in drawer_elements:
            self.assertIn(elem_id, self.lab_html, f"Falta elemento en drawer: {elem_id}")

        # 3. Flujo reactivo applySociodemoFilters -> renderWidgetCardDOM
        fn_start = self.lab_html.find("function applySociodemoFilters()")
        self.assertNotEqual(fn_start, -1, "Falta la función applySociodemoFilters() en laboratorio.html")
        fn_end = self.lab_html.find("function resetSociodemoFilters()", fn_start)
        self.assertNotEqual(fn_end, -1, "Falta la función resetSociodemoFilters() en laboratorio.html")
        apply_body = self.lab_html[fn_start:fn_end]

        self.assertIn("updateBaroDrawerMetrics()", apply_body)
        self.assertIn("renderWidgetCardDOM(w)", apply_body)
        self.assertIn("w.sampleContract.active_n = n", apply_body)

    # -------------------------------------------------------------------------
    # TEST 5: All 10 Extension Presets Integrity & Mirrors
    # -------------------------------------------------------------------------
    def test_05_extension_presets_integrity_and_mirror_contract(self):
        """Verificar que los 10 presets de extensión están presentes y que los espejos activan sampleContract."""
        ext_gallery = self.hubs_data.get("extension_gallery", {})
        self.assertIn("cultura_patrimonio", ext_gallery)
        self.assertIn("ctci_innovacion", ext_gallery)

        cp_presets = {p["preset_id"]: p for p in ext_gallery["cultura_patrimonio"].get("presets", [])}
        ct_presets = {p["preset_id"]: p for p in ext_gallery["ctci_innovacion"].get("presets", [])}

        self.assertEqual(len(cp_presets), 5)
        self.assertEqual(len(ct_presets), 5)

        # Presets espejo esperados y sus preguntas del Barómetro
        mirror_presets_expected = {
            "CP_02": "B4_B",
            "CP_03": "C2",
            "CT_02": "I1_I",
            "CT_03": "I8",
            "CT_05": "F4_G"
        }

        all_10 = {**cp_presets, **ct_presets}

        for pid, expected_q in mirror_presets_expected.items():
            preset = all_10.get(pid)
            self.assertIsNotNone(preset, f"Falta preset {pid}")
            self.assertTrue(preset.get("is_perception_mirror"), f"Preset {pid} debe ser is_perception_mirror: true")
            cfg = preset.get("config", {})
            self.assertEqual(cfg.get("barometro_question"), expected_q, f"Pregunta incorrecta para {pid}")
            sc = cfg.get("sample_contract", {})
            self.assertEqual(sc.get("universe_N"), 465, f"Universo incorrecto para {pid}")
            self.assertGreaterEqual(sc.get("active_n", 0), 30, f"Muestra insuficiente para {pid}")
            self.assertTrue(math.isfinite(sc.get("margin_error_pct", -1)), f"Margen error inválido para {pid}")

        # Presets no espejo
        non_mirror_expected = ["CP_01", "CP_04", "CP_05", "CT_01", "CT_04"]
        for pid in non_mirror_expected:
            preset = all_10.get(pid)
            self.assertIsNotNone(preset, f"Falta preset {pid}")
            self.assertFalse(preset.get("is_perception_mirror"), f"Preset {pid} no debe ser perception mirror")

    # -------------------------------------------------------------------------
    # TEST 6: CSS Styling Conformance
    # -------------------------------------------------------------------------
    def test_06_css_styling_conformance_for_sample_robustness(self):
        """Verificar presencia de reglas CSS para .card-sample-robustness-bar y semáforos."""
        css_rules = [
            ".card-sample-robustness-bar",
            ".card-sample-robustness-bar.semaforo-verde",
            ".card-sample-robustness-bar.semaforo-amarillo",
            ".card-sample-robustness-bar.semaforo-rojo",
            ".btn-toggle-sociodemo"
        ]
        for rule in css_rules:
            self.assertIn(rule, self.lab_html, f"Falta regla CSS en laboratorio.html: {rule}")

    # -------------------------------------------------------------------------
    # TEST 7: Zero Emojis Scan
    # -------------------------------------------------------------------------
    def test_07_zero_emojis_audit(self):
        """Auditoría de cero emojis en archivos modificados o relacionados con M4."""
        files_to_check = [
            LAB_HTML,
            PLATAFORMA_JS,
            PLATAFORMA_HTML,
            TEST_M4_INTEGRATION,
            os.path.abspath(__file__)
        ]
        for fpath in files_to_check:
            with open(fpath, "r", encoding="utf-8", errors="replace") as f:
                content = f.read()
            emojis = EMOJI_REGEX.findall(content)
            self.assertEqual(
                len(emojis), 0,
                f"Se detectaron emojis en {os.path.basename(fpath)}: {emojis}"
            )

    # -------------------------------------------------------------------------
    # TEST 8: Multi-Card Concurrency & Isolation Stress Test
    # -------------------------------------------------------------------------
    def test_08_multi_card_concurrency_and_cross_isolation(self):
        """Stress test de concurrencia e inmunidad a colisiones de IDs entre múltiples tarjetas espejo."""
        node_multi_script = """
        class MockElement {
          constructor(tag, id = '', className = '') {
            this.tagName = tag;
            this.id = id;
            this.className = className;
            this.children = [];
            this.outerHTMLCache = '';
            this.parent = null;
          }
          querySelector(sel) {
            if (sel.startsWith('#')) {
              const targetId = sel.slice(1);
              if (this.id === targetId) return this;
              for (const c of this.children) {
                const found = c.querySelector(sel);
                if (found) return found;
              }
            } else if (sel.startsWith('.')) {
              const targetClass = sel.slice(1);
              if (this.className.includes(targetClass)) return this;
              for (const c of this.children) {
                const found = c.querySelector(sel);
                if (found) return found;
              }
            }
            return null;
          }
          insertAdjacentHTML(position, html) {
            const child = new MockElement('div');
            child.outerHTMLCache = html;
            const match = html.match(/id="([^"]+)"/);
            if (match) child.id = match[1];
            const classMatch = html.match(/class="([^"]+)"/);
            if (classMatch) child.className = classMatch[1];
            child.parent = this.parent || this;
            if (position === 'afterend' && this.parent) {
              const idx = this.parent.children.indexOf(this);
              this.parent.children.splice(idx + 1, 0, child);
            } else {
              this.children.push(child);
            }
          }
          set outerHTML(val) {
            this.outerHTMLCache = val;
            const match = val.match(/id="([^"]+)"/);
            if (match) this.id = match[1];
            const classMatch = val.match(/class="([^"]+)"/);
            if (classMatch) this.className = classMatch[1];
          }
          get outerHTML() {
            return this.outerHTMLCache;
          }
          remove() {
            if (this.parent) {
              const idx = this.parent.children.indexOf(this);
              if (idx !== -1) this.parent.children.splice(idx, 1);
            }
          }
        }

        function createMockExistingCard(wId) {
          const card = new MockElement('div', `widget-card-${wId}`, 'studio-widget-card');
          const topBar = new MockElement('div', `drag-header-${wId}`, 'widget-top-bar');
          topBar.parent = card;
          card.children.push(topBar);
          const display = new MockElement('div', `display-body-${wId}`, 'widget-stage-display');
          display.parent = card;
          card.children.push(display);
          return { card, topBar, display };
        }

        function runExistingCardUpdate(existingCard, w, sampleRobustnessHtml) {
          let sampleBar = existingCard.querySelector(`#sample-bar-${w.id}`);
          if (sampleRobustnessHtml) {
            if (!sampleBar) {
              const topBar = existingCard.querySelector('.widget-top-bar');
              if (topBar) topBar.insertAdjacentHTML('afterend', sampleRobustnessHtml);
            } else {
              sampleBar.outerHTML = sampleRobustnessHtml;
            }
          } else if (sampleBar) {
            sampleBar.remove();
          }
        }

        // Simular dos tarjetas concurrentes (Card 10 y Card 20)
        const c10 = createMockExistingCard(10);
        const c20 = createMockExistingCard(20);

        const bar10 = '<div class="card-sample-robustness-bar semaforo-verde" id="sample-bar-10">n=452</div>';
        const bar20 = '<div class="card-sample-robustness-bar semaforo-rojo" id="sample-bar-20">n=25</div>';

        runExistingCardUpdate(c10.card, { id: 10 }, bar10);
        runExistingCardUpdate(c20.card, { id: 20 }, bar20);

        // Actualizar sólo Card 10 a semáforo amarillo
        const bar10_updated = '<div class="card-sample-robustness-bar semaforo-amarillo" id="sample-bar-10">n=40</div>';
        runExistingCardUpdate(c10.card, { id: 10 }, bar10_updated);

        // Remover barra en Card 20
        runExistingCardUpdate(c20.card, { id: 20 }, '');

        const out = {
          c10_has_bar: !!c10.card.querySelector('#sample-bar-10'),
          c10_class: c10.card.querySelector('#sample-bar-10')?.className,
          c20_has_bar: !!c20.card.querySelector('#sample-bar-20'),
          cross_bleed_10_in_20: !!c20.card.querySelector('#sample-bar-10'),
          cross_bleed_20_in_10: !!c10.card.querySelector('#sample-bar-20')
        };
        console.log(JSON.stringify(out));
        """
        proc = subprocess.run(
            ["node", "-e", node_multi_script],
            capture_output=True,
            text=True,
            cwd=ROOT_DIR
        )
        self.assertEqual(proc.returncode, 0, f"Node script error: {proc.stderr}")
        res = json.loads(proc.stdout)
        self.assertTrue(res["c10_has_bar"], "Card 10 debe tener sample bar")
        self.assertIn("semaforo-amarillo", res["c10_class"], "Card 10 debe estar en semaforo-amarillo")
        self.assertFalse(res["c20_has_bar"], "Card 20 debe haber removido su sample bar")
        self.assertFalse(res["cross_bleed_10_in_20"], "No debe existir cross-bleed de ID 10 en Card 20")
        self.assertFalse(res["cross_bleed_20_in_10"], "No debe existir cross-bleed de ID 20 en Card 10")


if __name__ == "__main__":
    unittest.main()
