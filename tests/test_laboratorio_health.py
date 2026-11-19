#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_laboratorio_health.py
=============================================================================
Suite de pruebas automatizadas para el módulo 'laboratorio.html'
(Laboratorio de Modelamiento Sistémico de Aysén).

Verifica:
1. Existencia e integridad de 'laboratorio.html'
2. Regla innegociable de CERO EMOJIS en interfaz y datos
3. Contratos DOM del layout de 3 paneles (Catálogo, Lienzo, Metacognición)
4. Navegación e hipervínculos bidireccionales entre los 4 módulos
5. Integridad del banco de 30 preguntas sistémicas (data/preguntas_metacognitivas.json)
6. Exportación CSV con UTF-8 BOM (\uFEFF) para compatibilidad con Excel
=============================================================================
"""

import os
import re
import json
import subprocess
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LABORATORIO_HTML = os.path.join(ROOT_DIR, "laboratorio.html")
PORTAL_HTML = os.path.join(ROOT_DIR, "portal.html")
SISTEMAS_HTML = os.path.join(ROOT_DIR, "sistemas_complejos.html")
INDEX_HTML = os.path.join(ROOT_DIR, "index.html")
PREGUNTAS_JSON = os.path.join(ROOT_DIR, "data", "preguntas_metacognitivas.json")

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)

class TestLaboratorioHealth(unittest.TestCase):

    def test_01_laboratorio_html_exists_and_clean(self):
        """Verifica existencia y tamaño del archivo laboratorio.html"""
        self.assertTrue(os.path.exists(LABORATORIO_HTML), "laboratorio.html debe existir en la raíz")
        size = os.path.getsize(LABORATORIO_HTML)
        self.assertGreater(size, 5000, f"laboratorio.html debe tener contenido sustancial (>5KB, tiene {size} bytes)")

    def test_02_zero_emojis_in_laboratorio(self):
        """Principio innegociable: CERO emojis en laboratorio.html y preguntas_metacognitivas.json"""
        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            content = f.read()
        emojis_found = EMOJI_REGEX.findall(content)
        self.assertEqual(len(emojis_found), 0, f"Se detectaron emojis prohibidos en laboratorio.html: {emojis_found}")

        if os.path.exists(PREGUNTAS_JSON):
            with open(PREGUNTAS_JSON, "r", encoding="utf-8") as f:
                json_content = f.read()
            json_emojis = EMOJI_REGEX.findall(json_content)
            self.assertEqual(len(json_emojis), 0, f"Se detectaron emojis en preguntas_metacognitivas.json: {json_emojis}")

        preguntas_js = os.path.join(ROOT_DIR, "data", "preguntas_metacognitivas.js")
        if os.path.exists(preguntas_js):
            with open(preguntas_js, "r", encoding="utf-8") as f:
                js_content = f.read()
            js_emojis = EMOJI_REGEX.findall(js_content)
            self.assertEqual(len(js_emojis), 0, f"Se detectaron emojis en preguntas_metacognitivas.js: {js_emojis}")

    def test_03_dom_contracts_three_panels(self):
        """Verifica la presencia de los contratos de los 3 paneles y sus elementos clave"""
        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            html = f.read()

        required_elements = [
            'id="brandHeader"',
            'class="brand-author-name"',
            'id="panelCatalogo"',
            'id="panelLienzo"',
            'id="panelMetacognicion"',
            'id="variablesTreeContainer"',
            'id="canvasGridStage"',
            'id="cardActiveQuestion"',
            'id="btnAddChart"',
            'id="btnAddMap"',
            'id="btnAddTable"',
            'id="btnAddKPI"',
            'id="btnEjemploSistemico"',
            'id="btnExportarJson"',
            'id="btnImportarJson"',
            'id="btnExportarReporte"',
            'id="txtAnalystNotes"',
            'id="accordionBody"'
        ]
        for elem in required_elements:
            self.assertIn(elem, html, f"El elemento contractual {elem} debe estar presente en laboratorio.html")

    def test_04_cross_module_navigation_integrity(self):
        """Verifica que todos los 4 módulos tengan enlaces cruzados hacia laboratorio.html"""
        with open(PORTAL_HTML, "r", encoding="utf-8") as f:
            portal = f.read()
        self.assertIn('href="laboratorio.html"', portal, "portal.html debe enlazar a laboratorio.html")

        with open(SISTEMAS_HTML, "r", encoding="utf-8") as f:
            sistemas = f.read()
        self.assertIn('href="laboratorio.html"', sistemas, "sistemas_complejos.html debe enlazar a laboratorio.html")

        with open(INDEX_HTML, "r", encoding="utf-8") as f:
            index = f.read()
        self.assertIn('href="laboratorio.html"', index, "index.html debe enlazar a laboratorio.html")

        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            lab = f.read()
        self.assertIn('href="portal.html"', lab, "laboratorio.html debe enlazar a portal.html")
        self.assertIn('href="sistemas_complejos.html"', lab, "laboratorio.html debe enlazar a sistemas_complejos.html")
        self.assertIn('href="index.html"', lab, "laboratorio.html debe enlazar a index.html")

    def test_05_questions_bank_structure(self):
        """Verifica la estructura y contenido del banco de 30 preguntas sistémicas"""
        self.assertTrue(os.path.exists(PREGUNTAS_JSON), "data/preguntas_metacognitivas.json debe existir")
        with open(PREGUNTAS_JSON, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertIn("preguntas", data, "El archivo debe contener el campo 'preguntas'")
        preguntas = data["preguntas"]
        self.assertEqual(len(preguntas), 30, f"Deben existir exactamente 30 preguntas (se encontraron {len(preguntas)})")

        for i, q in enumerate(preguntas, 1):
            self.assertEqual(q.get("id"), i, f"La pregunta en posición {i} debe tener id {i}")
            self.assertTrue(bool(q.get("pregunta")), f"Pregunta #{i} no puede tener texto vacío")
            self.assertTrue(bool(q.get("categoria")), f"Pregunta #{i} debe tener una categoría definida")
            self.assertIsInstance(q.get("disparadores"), list, f"Pregunta #{i} debe tener lista de disparadores")
            self.assertTrue(bool(q.get("reflexion_guia")), f"Pregunta #{i} debe tener reflexion_guia")

    def test_06_csv_export_bom_support(self):
        """Verifica que el exportador de CSV incluya el caracter UTF-8 BOM (\\uFEFF) para compatibilidad con Excel"""
        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            lab = f.read()
        self.assertIn('\\uFEFF', lab, "La función de exportación a CSV debe incluir UTF-8 BOM (\\uFEFF)")

    def test_07_barometro_filter_and_canonical_vars(self):
        """Verifica el botón de filtro Barómetro en el catálogo y las 8 variables canónicas en las 10 comunas"""
        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            lab = f.read()

        # Botón de filtro Barómetro en el panel de catálogo lateral
        self.assertIn('data-dim="barometro"', lab, "Debe existir el botón de filtro con data-dim='barometro'")
        self.assertIn('>Barómetro<', lab, "El botón debe tener la etiqueta 'Barómetro'")

        # Bundle cargado con las 8 variables del Barómetro en cada una de las 10 comunas
        bundle_file = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
        self.assertTrue(os.path.exists(bundle_file), "data/aysen_hubs_data.js debe existir")
        with open(bundle_file, "r", encoding="utf-8") as f:
            b_text = f.read()
        idx = b_text.find("window.AYSEN_HUBS_DATA = ")
        raw_json = b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n ")
        bundle = json.loads(raw_json)

        comunas = bundle.get("comunas", [])
        self.assertEqual(len(comunas), 10, "Deben existir 10 comunas en AYSEN_HUBS_DATA")

        baro_keys = [
            "barometro_confianza_institucional_pct",
            "barometro_redes_apoyo_comunitario_pct",
            "barometro_orgullo_identidad_pct",
            "barometro_prioridad_conectividad_pct",
            "barometro_tension_desarrollo_conservacion_pct",
            "barometro_intencion_migracion_juvenil_pct",
            "barometro_evaluacion_acceso_salud_pct",
            "barometro_preocupacion_contaminacion_lena_pct"
        ]

        for comuna in comunas:
            c_name = comuna.get("nombre") or comuna.get("nombre_comuna")
            for b_key in baro_keys:
                self.assertIn(b_key, comuna, f"Falta clave {b_key} en comuna {c_name}")
                val = comuna[b_key]
                self.assertIsNotNone(val, f"Clave {b_key} es None en comuna {c_name}")
                self.assertTrue(isinstance(val, (int, float)), f"Clave {b_key} no es numérica en {c_name}: {val}")
                self.assertGreaterEqual(val, 0.0, f"Clave {b_key} menor a 0 en {c_name}: {val}")
                self.assertLessEqual(val, 100.0, f"Clave {b_key} mayor a 100% en {c_name}: {val}")

    def test_08_render_barometro_en_10_mesas_hubs(self):
        """Verifica que las 10 mesas de Hubs tengan Tarjeta 5 (Barómetro) con variables reales en comunas"""
        presets_path = os.path.join(ROOT_DIR, "data", "cecan_16_presets_aysen.json")
        self.assertTrue(os.path.exists(presets_path), "data/cecan_16_presets_aysen.json debe existir")
        with open(presets_path, "r", encoding="utf-8") as f:
            presets_data = json.load(f)

        bundle_file = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
        with open(bundle_file, "r", encoding="utf-8") as f:
            b_text = f.read()
        idx = b_text.find("window.AYSEN_HUBS_DATA = ")
        bundle = json.loads(b_text[idx + len("window.AYSEN_HUBS_DATA = "):].rstrip(";\n "))
        comunas = bundle.get("comunas", [])
        self.assertEqual(len(comunas), 10, "Deben existir 10 comunas en AYSEN_HUBS_DATA")

        # 8 Hubs en hubs_gallery + 2 Hubs en extension_gallery = 10 Hubs
        hubs_gallery = presets_data.get("hubs_gallery", {})
        ext_gallery = presets_data.get("extension_gallery", {})
        total_hubs = {**hubs_gallery, **ext_gallery}
        self.assertEqual(len(total_hubs), 10, f"Deben existir 10 Hubs/mesas (8 hubs + 2 extensiones), encontrados {len(total_hubs)}")

        for hub_id, hub_info in total_hubs.items():
            presets = hub_info.get("presets", [])
            self.assertGreaterEqual(len(presets), 5, f"Hub {hub_id} debe tener al menos 5 presets")
            card5 = presets[4] # Tarjeta 5: Percepción / Barómetro
            cfg = card5.get("config", {})
            var_y = cfg.get("varY")
            self.assertIsNotNone(var_y, f"Tarjeta 5 del Hub {hub_id} no tiene varY definido")
            self.assertTrue(
                var_y.startswith("barometro_") or var_y in ("nota_percepcion_cultura_b4b", "percepcion_ctci_prioritaria_pct_i1i"),
                f"Tarjeta 5 del Hub {hub_id} debe apuntar a una variable barometro_* o espejo B4B/I1I, tiene '{var_y}'"
            )

            # Verificar que la variable existe en las 10 comunas con valor numérico válido
            for comuna in comunas:
                c_name = comuna.get("nombre") or comuna.get("nombre_comuna")
                self.assertIn(var_y, comuna, f"Variable {var_y} del Hub {hub_id} falta en comuna {c_name}")
                val = comuna[var_y]
                self.assertIsNotNone(val, f"Variable {var_y} es None en comuna {c_name}")
                self.assertTrue(isinstance(val, (int, float)), f"Variable {var_y} no es numérica en {c_name}")
                self.assertGreaterEqual(val, 0.0, f"Variable {var_y} < 0 en {c_name}")
                self.assertLessEqual(val, 100.0, f"Variable {var_y} > 100% en {c_name}")

            # Verificar que mirror_series está bien formado
            ms = cfg.get("mirror_series")
            self.assertIsNotNone(ms, f"Tarjeta 5 del Hub {hub_id} debe tener mirror_series")
            self.assertIn("por_macrozona", ms, f"mirror_series del Hub {hub_id} debe tener por_macrozona")
            for mz_key, mz_val in ms["por_macrozona"].items():
                pos_pct = mz_val.get("tasa_positiva_pct") if "tasa_positiva_pct" in mz_val else mz_val.get("positive_pct")
                self.assertIsNotNone(pos_pct, f"por_macrozona.{mz_key} debe tener tasa_positiva_pct o positive_pct en Hub {hub_id}")
                self.assertIsInstance(pos_pct, (int, float), f"pos_pct debe ser numérico en {hub_id}.{mz_key}")
                self.assertGreaterEqual(pos_pct, 0.0)
                self.assertLessEqual(pos_pct, 100.0)

    def test_09_salud_poblado_en_catalogo_lateral(self):
        """Verifica que VIII. Salud aparezca poblado en el catalogo lateral de laboratorio.html y en nl_lexicon_aysen.json."""
        lexicon_path = os.path.join(ROOT_DIR, "data", "nl_lexicon_aysen.json")
        self.assertTrue(os.path.exists(lexicon_path), "data/nl_lexicon_aysen.json debe existir")
        with open(lexicon_path, "r", encoding="utf-8") as f:
            lexicon = json.load(f)

        health_vars = [
            "urgencias_respiratorias_pct",
            "camas_hospitalarias",
            "medicos_por_mil_hab",
            "aeroevacuaciones_samu_n",
            "espera_no_ges_n",
            "traslado_coyhaique_hrs",
            "salud_principal"
        ]
        raw_vars = lexicon.get("variables", [])
        lex_vars = {v.get("id"): v for v in raw_vars if isinstance(v, dict) and "id" in v}
        for hv in health_vars:
            self.assertIn(hv, lex_vars, f"Variable de salud {hv} debe estar en nl_lexicon_aysen.json")
            self.assertEqual(lex_vars[hv].get("hub"), "salud", f"Variable {hv} debe tener hub='salud'")
            self.assertEqual(lex_vars[hv].get("hubTitle"), "VIII. Salud", f"Variable {hv} debe tener hubTitle='VIII. Salud'")

        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            html = f.read()

        self.assertIn("return 'salud';", html, "hubInference debe retornar 'salud'")
        self.assertIn("return 'cultura';", html, "hubInference debe retornar 'cultura'")
        self.assertIn("return 'ctci';", html, "hubInference debe retornar 'ctci'")
        self.assertIn("VIII. Salud", html, "laboratorio.html debe contener el titulo 'VIII. Salud'")

        # Verificar ejecucion real de hubInference sobre variables clave y series de salud
        node_script = """
        const fs = require('fs');
        const html = fs.readFileSync('laboratorio.html', 'utf8');

        // Extraer hubInference del HTML
        const m = html.match(/const hubInference = \\(([^)]*)\\) => \\{([\\s\\S]*?)\\n\\s*\\};/);
        if (!m) {
            console.error('hubInference declaration not found in laboratorio.html');
            process.exit(1);
        }
        const hubInference = new Function('k', m[2]);

        const saludVars = ['camas_hospitalarias', 'postas_salud_rural', 'establecimientos_aps_n', 'esperanza_vida_total_anos', 'cobertura_empam_pct', 'cobertura_pscv_pct'];
        for (const v of saludVars) {
            const res = hubInference(v);
            if (res !== 'salud') {
                console.error(`Expected salud for ${v}, got ${res}`);
                process.exit(2);
            }
        }

        const culturaVars = ['museos_count', 'fndr_8pct_cultura_mclp', 'participacion_cultural_pct_c2'];
        for (const v of culturaVars) {
            const res = hubInference(v);
            if (res !== 'cultura') {
                console.error(`Expected cultura for ${v}, got ${res}`);
                process.exit(3);
            }
        }

        const ctciVars = ['proyectos_ctci_total', 'proyectos_corfo_innova_count', 'proyectos_anid_locales_count'];
        for (const v of ctciVars) {
            const res = hubInference(v);
            if (res !== 'ctci') {
                console.error(`Expected ctci for ${v}, got ${res}`);
                process.exit(4);
            }
        }

        // Verificar clasificacion de series de salud en syncTemporalSeries
        if (!html.includes("id: 'urgencias_respiratorias_anuales_ssa'") || !html.includes("hubId: 'salud', hubTitle: 'VIII. Salud'")) {
            console.error('Series SSA must belong to hubId salud and VIII. Salud');
            process.exit(5);
        }

        // Verificar que syncSeriesDefs registra emporcha_toneladas, emporcha_cruceros, balmaceda_pasajeros_jac y barometro
        const requiredSeries = ['emporcha_toneladas', 'emporcha_cruceros', 'balmaceda_pasajeros_jac', 'barometro'];
        for (const s of requiredSeries) {
            if (!html.includes(`id: '${s}'`)) {
                console.error(`Serie ${s} missing in syncSeriesDefs`);
                process.exit(6);
            }
        }

        console.log('LABORATORIO_HEALTH_VERIFIED');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Error en test_09 laboratorio health:\n{proc.stderr}")
        self.assertIn("LABORATORIO_HEALTH_VERIFIED", proc.stdout)

    def test_10_laboratorio_6_mejoras_usabilidad(self):
        """Verifica los 6 bloques de mejoras de usabilidad, cruces, popups mapa, slicer KPI, sintesis y exportacion."""
        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            html = f.read()

        # 1. + Cruzar sin limite artificial, con buscador y drop bivariable
        self.assertIn('id="smartPopoverSearch"', html)
        self.assertIn('id="smartPopoverCount"', html)
        m_pop = re.search(r'function openSmartPopover\(w,\s*triggerEl\)\s*\{([\s\S]*?)\n\s{6}\}', html)
        self.assertTrue(m_pop, "Debe existir openSmartPopover")
        pop_body = m_pop.group(1)
        self.assertNotIn('.slice(0, 10)', pop_body, "openSmartPopover no debe recortar a 10 variables")
        self.assertNotIn('.slice(0, 17)', pop_body, "openSmartPopover no debe recortar a 17 variables")
        self.assertIn('renderPopoverList(w, compatible)', pop_body)
        self.assertIn("fuseVariableIntoWidget(w, varId)", html, "Drop en tarjeta existente debe asignar varY")

        # 2. Popups, tooltips y radio 25 km en Mapa sin autodestruir el mapa en clic
        self.assertIn("marker.bindTooltip(", html)
        self.assertIn("marker.bindPopup(", html)
        self.assertIn("keepSourceMap: true", html)
        self.assertIn("_updateMapHighlight", html)
        self.assertIn("nearbyNodes", html)

        # 3. Posicionamiento escalonado, barra Formato fija y sincronizacion de ventanas
        self.assertIn("showFloatingToolbarForCard(w.id, { forceShow: true })", html)
        self.assertIn("customChartSpec: cfg.customChartSpec || null", html)
        self.assertIn("updateFloatingToolbarPosition", html)

        # 4 & 5 & 6. Contratos DOM y funciones de sintesis, compartir URL y PNG
        for contract in [
            'id="btnCopyShareLink"',
            'id="btnShareWorkspaceUrl"',
            'id="tbBtnSynthesis"',
            'id="tbBtnPng"',
            'id="ctxExportPng"',
            'id="ctxCardSynthesis"',
            'function exportPng(',
            'function buildWorkspaceShareUrl(',
            'function copyWorkspaceShareUrl(',
            'function generateCardExecutiveSynthesis(',
            'function getOrderedQuestionPool(',
            "toDataURL('image/png')",
        ]:
            self.assertIn(contract, html, f"Falta contrato de mejora en laboratorio.html: {contract}")

        # Verificacion de ejecucion real en Node: sintaxis JS + filtro KPI + estadistica de sintesis + banco de preguntas
        node_test = r"""
        const fs = require('fs');
        const vm = require('vm');
        const html = fs.readFileSync('laboratorio.html', 'utf8');

        // 1. Verificar sintaxis limpia de todos los scripts embebidos
        const scripts = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
        if (scripts.length < 2) process.exit(1);
        scripts.forEach((m, idx) => {
          new vm.Script(m[1], { filename: 'lab_inline_' + idx + '.js' });
        });

        // 2. Extraer funciones clave y probar interseccion estricta slicer + excludeCoyhaique
        const normMatch = html.match(/function normStr\(s\)\s*\{[\s\S]*?\n\s{6}\}/);
        const fnNorm = new Function('return ' + normMatch[0])();
        const COMUNAS_ORDER = [
          'Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas',
          'Chile Chico', 'Río Ibáñez', 'Cochrane', "O'Higgins", 'Tortel'
        ];
        const SLICES = {
          all: COMUNAS_ORDER,
          prov_coyhaique: ['Coyhaique', 'Lago Verde'],
          tipo_maritima: ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel'],
          comuna_coyhaique: ['Coyhaique']
        };
        function filterSubset(sliceKey, excludeCoy) {
          let labels = [...COMUNAS_ORDER];
          if (sliceKey !== 'all' && SLICES[sliceKey]) {
            const allowedNorm = SLICES[sliceKey].map(a => fnNorm(a));
            labels = labels.filter(lbl => {
              const ln = fnNorm(lbl);
              return allowedNorm.some(a => a === ln || ln.includes(a) || a.includes(ln));
            });
          }
          if (excludeCoy) {
            labels = labels.filter(lbl => !fnNorm(lbl).includes('coyhaique'));
          }
          return labels;
        }
        const m4 = filterSubset('tipo_maritima', true);
        if (m4.length !== 4) { console.error('Expected 4 maritimas, got', m4); process.exit(2); }
        const pc1 = filterSubset('prov_coyhaique', true);
        if (pc1.length !== 1 || pc1[0] !== 'Lago Verde') { console.error('Expected [Lago Verde], got', pc1); process.exit(3); }
        const cc0 = filterSubset('comuna_coyhaique', true);
        if (cc0.length !== 0) { console.error('Expected 0 entities for Coyhaique + Sin Coyhaique, got', cc0); process.exit(4); }

        console.log('LABORATORIO_6_MEJORAS_VERIFIED');
        """
        proc = subprocess.run(
            ["node", "-e", node_test],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en verificacion Node de mejoras:\n{proc.stderr}\n{proc.stdout}")
        self.assertIn("LABORATORIO_6_MEJORAS_VERIFIED", proc.stdout)

    def test_11_due_diligence_turismo_y_propagacion_canonica(self):
        """Verifica numeracion canonica Hub I Turismo, propagacion de filtros en cables y nuevas variables/series turisticas."""
        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            lab_html = f.read()
        required_lab_snippets = [
            "function propagateTransformToConnectedWidgets(sourceW)",
            "propagateTransformToConnectedWidgets(w);",
            "if (wSource.excludeOutlierCoyhaique) wTarget.excludeOutlierCoyhaique = true;",
            "turismo: { num: 'I', title: 'Turismo y Áreas Silvestres' }",
            "function openHubGallery(hubId = 'turismo')",
            "{ id: 'turismo', num: 'I', name: 'Turismo y Áreas Silvestres' }",
            "'visitas_por_cama_turistica'",
            "'concentracion_estival_pct'",
            "'tarifa_adr_estimada_usd'",
            "'revpar_estimado_usd'",
            "'largo_pista_aerodromo_m'",
            "'operaciones_aerodromo_interior_anual'",
            "id: 'estacionalidad_mensual_emat'",
            "id: 'pn_queulat_visitas_hist'",
            "mode: 'bivariate',\n            key: 'comuna',\n            dim: 'comuna',"
        ]
        for snip in required_lab_snippets:
            self.assertIn(snip, lab_html, f"Falta fragmento obligatorio Due Diligence Turismo en laboratorio.html: {snip}")

        node_bundle_check = """
        const fs = require('fs'); const vm = require('vm');
        const ctx = { window: {} };
        vm.runInNewContext(fs.readFileSync('data/aysen_hubs_data.js', 'utf8'), ctx);
        const d = ctx.window.AYSEN_HUBS_DATA;
        if (d.hubsGallery?.turismo?.numeral !== 'I') { console.error('Expected turismo numeral I, got', d.hubsGallery?.turismo?.numeral); process.exit(2); }
        if (d.hubsGallery?.gobernanza?.numeral !== 'IV') { console.error('Expected gobernanza numeral IV, got', d.hubsGallery?.gobernanza?.numeral); process.exit(3); }
        if (!Array.isArray(d.series?.snaspe_por_parque_anual) || d.series.snaspe_por_parque_anual.length !== 12) process.exit(4);
        if (!Array.isArray(d.series?.parques_snaspe_unidades) || d.series.parques_snaspe_unidades.length < 5) process.exit(5);
        const cisnes = d.comunas.find(c => c.nombre === 'Cisnes');
        if (!cisnes || cisnes.visitas_por_cama_turistica !== 51.8 || cisnes.seia_plazo_dias !== 945) {
          console.error('Cisnes metrics mismatch:', cisnes?.visitas_por_cama_turistica, cisnes?.seia_plazo_dias);
          process.exit(6);
        }
        console.log('LABORATORIO_TURISMO_BUNDLE_OK');
        """
        proc = subprocess.run(["node", "-e", node_bundle_check], cwd=ROOT_DIR, capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, f"Fallo en validacion bundle turismo:\n{proc.stderr}\n{proc.stdout}")
        self.assertIn("LABORATORIO_TURISMO_BUNDLE_OK", proc.stdout)

    def test_12_correcciones_catalogo_sintesis_barometro_y_presets(self):
        """Verifica unidades/hubs de laboratorio, computeWidgetExecutiveStats bivariado, window.openSociodemoDrawer, filtro demografico reactivo, cards= con comunas/summary y los 7 presets alineados."""
        with open(LABORATORIO_HTML, "r", encoding="utf-8") as f:
            lab_html = f.read()

        for snippet in [
            "window.openSociodemoDrawer = openSociodemoDrawer;",
            "w.activeSociodemoFilter = { edu, nse, sexo, edad, macro };",
            "const EXPLICIT_VAR_META =",
            "id: 'holdings_salmoneros'",
            "id: 'biomasa_por_holding'",
            "id: 'emporcha_cruceros_hist'",
            "id: 'centros_activos_salmon_hist'",
            "id: 'dias_sobre_norma_mp25_hist'",
            "applyComunasUrlFilter(comunasParam);"
        ]:
            self.assertIn(snippet, lab_html, f"Falta fragmento en laboratorio.html: {snippet}")

        node_script = r"""
        const fs = require('fs');
        const vm = require('vm');
        const assert = require('assert');

        const html = fs.readFileSync('laboratorio.html', 'utf8');
        const consultorHtml = fs.readFileSync('consultor.html', 'utf8');

        // 1. Validar sintaxis JS limpia de todos los scripts embebidos
        for (const [fname, content] of [['laboratorio.html', html], ['consultor.html', consultorHtml]]) {
            const scripts = [...content.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
            scripts.forEach((m, idx) => {
                new vm.Script(m[1], { filename: `${fname}_inline_${idx}.js` });
            });
        }

        // 2. Verificar unitInference, hubInference y EXPLICIT_VAR_META
        const mHub = html.match(/const hubInference = \(k\) => \{([\s\S]*?)\n\s*\};/);
        const mUnit = html.match(/const unitInference = \(k\) => \{([\s\S]*?)\n\s*\};/);
        const mExp = html.match(/const EXPLICIT_VAR_META = (\{[\s\S]*?\n\s*\});/);
        assert(mHub && mUnit && mExp, 'Faltan hubInference, unitInference o EXPLICIT_VAR_META');

        const hubInference = new Function('k', mHub[1]);
        const unitInference = new Function('k', mUnit[1]);
        const EXPLICIT_VAR_META = (new Function('return ' + mExp[1]))();

        assert.strictEqual(EXPLICIT_VAR_META.participacion_cultural_pct_c2.unit, '%');
        assert.strictEqual(EXPLICIT_VAR_META.participacion_cultural_pct_c2.hubId, 'cultura');
        assert.strictEqual(EXPLICIT_VAR_META.evaluacion_uaysen_promedio_i8.unit, 'nota (1-7)');
        assert.strictEqual(EXPLICIT_VAR_META.evaluacion_uaysen_promedio_i8.hubId, 'ctci');
        assert.strictEqual(unitInference('traslado_coyhaique_hrs'), 'horas');
        assert.strictEqual(hubInference('traslado_coyhaique_hrs'), 'salud');
        assert.strictEqual(unitInference('ha_snaspe_por_guardaparque'), 'ha/guardaparque');
        assert.strictEqual(hubInference('ha_snaspe_por_guardaparque'), 'turismo');
        assert.strictEqual(unitInference('tarifa_adr_estimada_usd'), 'US$');
        assert.strictEqual(hubInference('tarifa_adr_estimada_usd'), 'turismo');
        assert.strictEqual(hubInference('innovacion_corfo_mclp'), 'ctci');

        // 3. Verificar computeWidgetExecutiveStats bivariado incluye ambas variables
        const mStats = html.match(/function computeWidgetExecutiveStats\(w\)\s*\{([\s\S]*?)\n\s{6}\}/);
        assert(mStats, 'Falta computeWidgetExecutiveStats');
        const mockDocument = { querySelector: () => ({ textContent: 'Región de Aysén' }) };
        const mockAppState = { territorialFilter: 'all', excludeCoyhaique: false };
        const mockPayload = {
            mode: 'bivariate',
            dim: 'comuna',
            labels: ['Coyhaique', 'Aysén', 'Cisnes'],
            dataX: [100, 50, 20],
            dataY: [5, 15, 25],
            nameX: 'Población',
            nameY: 'Presión Turística',
            unitX: 'hab',
            unitY: 'visitantes/hab'
        };
        const fnStats = new Function('getWidgetDataPayload', 'document', 'AppState', `return function computeWidgetExecutiveStats(w) { ${mStats[1]} };`)(
            () => mockPayload, mockDocument, mockAppState
        );
        const resStats = fnStats({ id: 1, title: 'Cruce Test', excludeOutlierCoyhaique: false });
        assert(resStats.pt1.includes('Población') && resStats.pt1.includes('Presión Turística'),
            'pt1 debe nombrar tanto varX como varY: ' + resStats.pt1);

        // 4. Verificar los 7 presets alineados en el bundle compilado
        const ctx = { window: {} };
        vm.runInNewContext(fs.readFileSync('data/aysen_hubs_data.js', 'utf8'), ctx);
        const d = ctx.window.AYSEN_HUBS_DATA;
        const allPresets = {};
        for (const gal of [d.hubsGallery, d.extension_gallery]) {
            for (const h of Object.values(gal || {})) {
                for (const p of (h.presets || [])) allPresets[p.preset_id] = p;
            }
        }
        assert.strictEqual(allPresets.hub_03_01.config.spatialLayer, 'concesiones_acuicolas_padron');
        assert.strictEqual(allPresets.hub_03_04.config.varY, 'centros_activos_salmon_hist');
        assert.strictEqual(allPresets.hub_04_01.config.spatialLayer, 'proyectos_seia_puros');
        assert.deepStrictEqual(
            allPresets.hub_04_04.config.customChartSpec.datasets[0].data,
            d.series.balmaceda_pasajeros_jac.map(r => r.pasajeros)
        );
        assert.strictEqual(allPresets.hub_05_01.config.showBuffers, false);
        assert.strictEqual(allPresets.hub_07_04.config.varY, 'dias_sobre_norma_mp25_hist');
        assert.strictEqual(allPresets.CP_05.is_perception_mirror, true);
        assert.strictEqual(allPresets.CP_05.config.varY, 'nota_percepcion_cultura_b4b');
        assert.strictEqual(allPresets.CT_05.config.varY, 'percepcion_ctci_prioritaria_pct_i1i');

        // 5. Verificar en runtime loadDataLakeAndCatalog() y getWidgetDataPayload(w)
        function extractFn(name) {
            const re = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`);
            const match = re.exec(html);
            assert(match, 'Falta funcion ' + name);
            let b = 0, st = false, end = match.index;
            for (let i = match.index; i < html.length; i++) {
                if (html[i] === '{') { b++; st = true; }
                else if (html[i] === '}') { b--; if (st && b === 0) { end = i + 1; break; } }
            }
            return html.slice(match.index, end);
        }

        const COMUNAS_ORDER = ['Coyhaique', 'Aysén', 'Cisnes', 'Chile Chico', 'Cochrane', 'Río Ibáñez', 'Guaitecas', 'Lago Verde', 'Tortel', "O'Higgins"];
        const runCtx = {
            window: ctx.window,
            console: { log: () => {}, warn: () => {}, error: () => {} },
            COMUNAS_ORDER,
            TERRITORIAL_SLICES: { all: COMUNAS_ORDER },
            document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
            fetch: async () => { throw new Error('offline-test'); },
            renderSidebarCatalog: () => {},
            getAutoexplanatoryVarInfo: (id, name, unit) => ({ title: name, unitLabel: unit }),
            resolveOfficialSource: () => ({ name: 'Oficial', collectionDate: '2026', url: 'https://datos.gob.cl' }),
            formatVarWithUnit: (n, u) => `${n} (${u})`,
            AppState: {
                hubsData: d,
                catalogItems: [],
                territorialFilter: 'all',
                excludeCoyhaique: false
            }
        };
        const runtimeCode = ['normStr', 'getHubTitleName', 'resolveCommunalVector', 'loadDataLakeAndCatalog', 'getWidgetDataPayload']
            .map(extractFn)
            .join('\n\n');
        vm.runInNewContext(runtimeCode, runCtx);

        (async () => {
            await runCtx.loadDataLakeAndCatalog();

            const itemEstadia = runCtx.AppState.catalogItems.find(x => x.id === 'estadia_promedio_dias');
            assert(itemEstadia && itemEstadia.hubId === 'turismo' && itemEstadia.aggMode === 'mean',
                'estadia_promedio_dias debe pertenecer a turismo con aggMode=mean');

            const pHold = runCtx.getWidgetDataPayload({ varX: 'holdings_salmoneros', varY: 'biomasa_por_holding', chartType: 'bar' });
            assert.strictEqual(pHold.dim, 'holding');
            assert.strictEqual(pHold.labels.length, 12);
            assert.strictEqual(pHold.labels[0], 'AquaChile');
            assert.strictEqual(pHold.dataX[0], 210);
            assert.strictEqual(pHold.dataY[0], 141937);

            const pCruc = runCtx.getWidgetDataPayload({ varX: 'emporcha_cruceros_hist', varY: 'visitantes_snaspe_conaf_hist', chartType: 'line' });
            assert.strictEqual(pCruc.dim, 'tiempo');
            assert.strictEqual(pCruc.labels.length, 8);
            assert.strictEqual(pCruc.labels[0], '2019');
            assert.strictEqual(pCruc.labels[7], '2026');

            const msCp05 = allPresets.CP_05.config.mirror_series;
            const pNse = runCtx.getWidgetDataPayload({
                varX: allPresets.CP_05.config.varX,
                varY: allPresets.CP_05.config.varY,
                chartType: 'bar',
                isPerceptionMirror: true,
                mirrorSeries: msCp05,
                activeSociodemoFilter: { edu: 'todos', nse: 'alto', sexo: 'todos', edad: 'todos', macro: 'todas' }
            });
            assert.strictEqual(pNse.dim, 'barometro_estrato');
            assert.deepStrictEqual(Array.from(pNse.labels), ['NSE Bajo', 'NSE Medio', 'NSE Alto']);
            assert.deepStrictEqual(Array.from(pNse.dataY), [msCp05.por_nse.bajo.tasa_positiva_pct, msCp05.por_nse.medio.tasa_positiva_pct, msCp05.por_nse.alto.tasa_positiva_pct]);

            const pMacro = runCtx.getWidgetDataPayload({
                varX: allPresets.CP_05.config.varX,
                varY: allPresets.CP_05.config.varY,
                chartType: 'bar',
                isPerceptionMirror: true,
                mirrorSeries: msCp05,
                activeSociodemoFilter: { edu: 'todos', nse: 'todos', sexo: 'todos', edad: 'todos', macro: 'sur' }
            });
            assert.strictEqual(pMacro.dim, 'barometro_estrato');
            assert.deepStrictEqual(Array.from(pMacro.dataX), [msCp05.structural_by_macrozona.centro, msCp05.structural_by_macrozona.norte, msCp05.structural_by_macrozona.sur]);

            console.log('LABORATORIO_AUDIT_FIXES_OK');
        })().catch(err => { console.error(err); process.exit(1); });
        """
        proc = subprocess.run(["node", "-e", node_script], cwd=ROOT_DIR, capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, f"Fallo en test_12:\n{proc.stderr}\n{proc.stdout}")
        self.assertIn("LABORATORIO_AUDIT_FIXES_OK", proc.stdout)


if __name__ == "__main__":
    unittest.main()

