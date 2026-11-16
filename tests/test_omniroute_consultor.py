#!/usr/bin/env python3
"""
tests/test_omniroute_consultor.py
=================================
Suite de pruebas para el motor de inteligencia artificial OmniRoute y la seccion
conversacional Consultor de Datos Territorial (consultor.html).
"""

import os
import re
import json
import subprocess
import unittest

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EMOJI_PATTERN = re.compile(r"[\U00010000-\U0010ffff]", flags=re.UNICODE)


class TestOmniRouteConsultor(unittest.TestCase):
    """Pruebas de integracion y contratos tecnicos para OmniRoute y Consultor de Datos."""

    def setUp(self):
        self.consultor_path = os.path.join(ROOT_DIR, "consultor.html")
        self.client_path = os.path.join(ROOT_DIR, "js", "omniroute_client.js")
        self.cabecera_path = os.path.join(ROOT_DIR, "js", "cabecera_global.js")
        self.setup_doc_path = os.path.join(ROOT_DIR, "docs", "OMNIROUTE_SETUP.md")
        self.start_sh_path = os.path.join(ROOT_DIR, "scripts", "start_omniroute.sh")
        self.env_example_path = os.path.join(ROOT_DIR, ".env.omniroute.example")
        self.laboratorio_path = os.path.join(ROOT_DIR, "laboratorio.html")

    def test_01_archivos_requeridos_existen(self):
        """Verifica la existencia de todos los archivos nucleares del motor y la seccion."""
        self.assertTrue(os.path.exists(self.consultor_path), "consultor.html debe existir")
        self.assertTrue(os.path.exists(self.client_path), "js/omniroute_client.js debe existir")
        self.assertTrue(os.path.exists(self.setup_doc_path), "docs/OMNIROUTE_SETUP.md debe existir")
        self.assertTrue(os.path.exists(self.start_sh_path), "scripts/start_omniroute.sh debe existir")
        self.assertTrue(os.path.exists(self.env_example_path), ".env.omniroute.example debe existir")

    def test_02_ausencia_total_de_emojis(self):
        """Verifica que ninguno de los archivos creados o modificados contenga emojis prohibidos."""
        files_to_check = [
            self.consultor_path,
            self.client_path,
            self.cabecera_path,
            self.setup_doc_path,
            self.start_sh_path,
            self.env_example_path
        ]
        for fpath in files_to_check:
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
                emojis = EMOJI_PATTERN.findall(content)
                self.assertEqual(
                    len(emojis), 0,
                    f"Se detectaron {len(emojis)} emojis en {os.path.basename(fpath)}"
                )

    def test_03_cabecera_global_incluye_consultor(self):
        """Verifica que js/cabecera_global.js declare el enlace 'Consultor de Datos' hacia consultor.html."""
        with open(self.cabecera_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("consultor.html", content, "cabecera_global.js debe enlazar consultor.html")
        self.assertIn("Consultor de Datos", content, "cabecera_global.js debe tener la etiqueta 'Consultor de Datos'")
        # Mantener los 5 enlaces estándar inalterados
        for label in ["Portada", "Visualizador de Complejidad", "Datos de Aysén", "Laboratorio Sistémico", "LinkedIn"]:
            self.assertIn(label, content, f"cabecera_global.js debe conservar el enlace '{label}'")

    def test_04_consultor_html_estructura_y_layout(self):
        """Verifica que consultor.html cumpla con el layout de 100vh y los dos paneles."""
        with open(self.consultor_path, "r", encoding="utf-8") as f:
            html = f.read()

        # Scripts y dependencias
        self.assertIn("data/aysen_hubs_data.js", html)
        self.assertIn("js/omniroute_client.js", html)
        self.assertIn("chart.umd.min.js", html)
        self.assertIn("js/cabecera_global.js", html)
        self.assertIn("js/cabecera_global.css", html)

        # Paneles 50% / 50%
        self.assertIn("panel-chat", html)
        self.assertIn("panel-evidence", html)
        self.assertIn("consultorCanvas", html)

        # 4 consultas sugeridas
        self.assertIn("¿Cuáles son las comunas con mayor dependencia del Fondo Común Municipal", html)
        self.assertIn("Muéstrame la evolución histórica de las visitas a Parques Nacionales", html)
        self.assertIn("Cruza el porcentaje de hogares que calefaccionan con leña", html)
        self.assertIn("¿Qué comunas concentran la biomasa de salmonicultura", html)

        # Controles y boton de Laboratorio
        self.assertIn("btnViewChart", html)
        self.assertIn("btnViewTable", html)
        self.assertNotIn("btnToggleCoyhaique", html)
        self.assertNotIn("btnChartBar", html)
        self.assertNotIn("btnChartLine", html)
        self.assertNotIn("btnChartScatter", html)
        self.assertIn("btnOpenInLab", html)
        self.assertIn("laboratorio.html", html)

    def test_05_omniroute_client_en_nodejs(self):
        """Verifica la inicializacion y el comportamiento de Mundo Cerrado de OmniRouteClient en Node.js."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        const ok = client.init(sandbox.AYSEN_HUBS_DATA);
        if (!ok) {
            console.error('Failed to init');
            process.exit(1);
        }
        const idx = client.getIndex();
        if (idx.comunas.length !== 10) {
            console.error('Comunas count != 10:', idx.comunas.length);
            process.exit(2);
        }
        if (idx.fuentes.length < 28) {
            console.error('Fuentes count < 28:', idx.fuentes.length);
            process.exit(3);
        }

        // Probar resolucion de consulta sugerida 1
        const r1 = client.resolveClosedWorldDeterministic('¿Cuáles son las comunas con mayor dependencia del Fondo Común Municipal y cómo se comparan con sus ingresos propios?');
        if (!r1.chart.render || r1.chart.varX !== 'dependencia_fcm_pct') {
            console.error('Invalid r1 chart spec:', r1.chart);
            process.exit(4);
        }

        // Probar mundo cerrado ante variable inexistente
        const rUnknown = client.resolveClosedWorldDeterministic('dato_inventado_totalmente_inexistente_123');
        if (!rUnknown.reply.includes('no forma parte de las fuentes oficiales')) {
            console.error('Closed world breach, reply was:', rUnknown.reply);
            process.exit(5);
        }

        console.log('NODE_CLIENT_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Error ejecutando js/omniroute_client.js en Node:\n{proc.stderr}")
        self.assertIn("NODE_CLIENT_OK", proc.stdout)

    def test_06_laboratorio_html_soporta_parametros_url_consultor(self):
        """Verifica que laboratorio.html procese los parametros varX, varY, type, excludeCoyhaique y summary."""
        with open(self.laboratorio_path, "r", encoding="utf-8") as f:
            html = f.read()

        self.assertIn("params.get('varX')", html)
        self.assertIn("params.get('varY')", html)
        self.assertIn("params.get('type')", html)
        self.assertIn("params.get('excludeCoyhaique')", html)
        self.assertIn("params.get('summary')", html)
        self.assertIn("js/omniroute_client.js", html)

    def test_07_extractor_json_resiliente_markdown(self):
        """Verifica que extractJsonFromResponse maneje respuestas Markdown y texto previo/posterior."""
        node_script = """
        const client = require('./js/omniroute_client.js');
        const extract = client.extractJsonFromResponse;
        if (typeof extract !== 'function') {
            console.error('extractJsonFromResponse is not exported');
            process.exit(1);
        }

        // Caso 1: JSON Puro
        const p1 = extract('{"reply": "Directo", "sources": []}');
        if (!p1 || p1.reply !== 'Directo') process.exit(2);

        // Caso 2: Bloque Markdown ```json ... ```
        const p2 = extract('```json\\n{"reply": "Markdown", "relatedHub": "II"}\\n```');
        if (!p2 || p2.reply !== 'Markdown' || p2.relatedHub !== 'II') process.exit(3);

        // Caso 3: Texto conversacional previo y posterior
        const p3 = extract('Analisis territorial:\\n{"reply": "Envuelto", "chart": {"render": true}}\\nSaludos cordiales.');
        if (!p3 || p3.reply !== 'Envuelto' || !p3.chart.render) process.exit(4);

        console.log('JSON_EXTRACTOR_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en extractJsonFromResponse:\n{proc.stderr}")
        self.assertIn("JSON_EXTRACTOR_OK", proc.stdout)

    def test_08_resolucion_4_consultas_sugeridas_e_integridad_hubs(self):
        """Verifica que las 4 consultas sugeridas resuelvan variables reales y hubs correctos."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        client.init(sandbox.AYSEN_HUBS_DATA);

        const q1 = client.resolveClosedWorldDeterministic('¿Cuáles son las comunas con mayor dependencia del Fondo Común Municipal y cómo se comparan con sus ingresos propios?');
        if (q1.chart.varX !== 'dependencia_fcm_pct' || q1.relatedHub !== 'IV') process.exit(1);

        const q2 = client.resolveClosedWorldDeterministic('Muéstrame la evolución histórica de las visitas a Parques Nacionales y noches de alojamiento turístico entre 2015 y 2026');
        if (q2.chart.varX !== 'visitantes_snaspe' || q2.relatedHub !== 'I') process.exit(2);

        const q3 = client.resolveClosedWorldDeterministic('Cruza el porcentaje de hogares que calefaccionan con leña y los días con contaminación crítica MP2.5');
        if (q3.chart.varX !== 'hogares_lena_pct' || q3.relatedHub !== 'VII') process.exit(3);

        const q4 = client.resolveClosedWorldDeterministic('¿Qué comunas concentran la biomasa de salmonicultura y cómo contrasta con la inversión pública regional?');
        if (q4.chart.varX !== 'biomasa_salmon_ton' || q4.relatedHub !== 'II') process.exit(4);

        console.log('SUGGESTIONS_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en resolucion de consultas sugeridas:\n{proc.stderr}")
        self.assertIn("SUGGESTIONS_OK", proc.stdout)

    def test_09_mapeo_10_hubs_y_prompt_completo(self):
        """Verifica el mapeo de variables a los 10 Hubs (I al X) y que el System Prompt no este truncado."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        client.init(sandbox.AYSEN_HUBS_DATA);

        const getHub = client.getHubForVariable;
        if (getHub('prestadores_sernatur') !== 'I') process.exit(1);
        if (getHub('biomasa_salmon_ton') !== 'II') process.exit(2);
        if (getHub('potencia_mw') !== 'III') process.exit(3);
        if (getHub('fndr_mclp') !== 'IV') process.exit(4);
        if (getHub('inversion_seia_mmusd') !== 'V') process.exit(5);
        if (getHub('poblacion_censo_2024') !== 'VI') process.exit(6);
        if (getHub('glaciares_dga_n') !== 'VII') process.exit(7);
        if (getHub('camas_hospitalarias') !== 'VIII') process.exit(8);
        if (getHub('museos_espacios_n') !== 'IX') process.exit(9);
        if (getHub('proyectos_anid_n') !== 'X') process.exit(10);

        const prompt = client.buildSystemPrompt();
        if (!prompt.includes('39 Nodos Satélites')) process.exit(11);
        if (!prompt.includes('glaciares_dga_n')) process.exit(12);

        console.log('HUBS_PROMPT_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en mapeo de 10 hubs o prompt:\n{proc.stderr}")
        self.assertIn("HUBS_PROMPT_OK", proc.stdout)

    def test_10_clean_emojis_script_incluye_nuevos_archivos(self):
        """Verifica que scripts/clean_emojis.py proteja consultor.html y js/omniroute_client.js."""
        cleaner_path = os.path.join(ROOT_DIR, "scripts", "clean_emojis.py")
        with open(cleaner_path, "r", encoding="utf-8") as f:
            code = f.read()
        self.assertIn("consultor.html", code)
        self.assertIn("js/omniroute_client.js", code)

    def test_11_seguridad_no_modal_ni_api_key(self):
        """Verifica que no exista boton de configuracion de API Key ni modal ni avisos tecnicos en consultor.html."""
        with open(self.consultor_path, "r", encoding="utf-8") as f:
            html = f.read()

        # Prohibida la exposicion de campos de API Key, endpoint o modal de configuracion
        self.assertNotIn("btnOpenCfg", html, "consultor.html no debe incluir #btnOpenCfg")
        self.assertNotIn("cfgModal", html, "consultor.html no debe incluir #cfgModal")
        self.assertNotIn("Configurar Conexión OmniRoute", html, "consultor.html no debe mostrar texto de modal de configuracion")
        self.assertNotIn("Resuelto con índice local verificado de Aysén Sistémico (OmniRoute en localhost:20128 no detectado)", html,
                         "consultor.html no debe mostrar avisos tecnicos de localhost")

        # Contencion de layout del canvas pane
        self.assertIn("consultor-canvas-pane", html, "panel-evidence debe tener clase consultor-canvas-pane")
        self.assertIn("height: calc(100vh - 56px)", html, "panel-evidence debe contenerse en height calc(100vh - 56px)")
        self.assertIn("height: 340px", html, "chart-stage debe tener altura fija de 340px")

    def test_12_motor_bivariado_y_dual_axis(self):
        """Verifica que consultor.html implemente soporte bivariado con doble eje Y y dispersion con plugin."""
        with open(self.consultor_path, "r", encoding="utf-8") as f:
            html = f.read()

        # Doble eje Y
        self.assertIn("yAxisID: 'y'", html, "datasets deben asignar eje y primario")
        self.assertIn("yAxisID: 'y1'", html, "dataset secundario debe asignar eje y1")
        self.assertIn("scatterPointLabelsPlugin", html, "debe registrar plugin de etiquetas de puntos de dispersion")
        self.assertIn("Tendencia (r =", html, "debe calcular linea de tendencia en dispersion")
        self.assertIn("formatAxisLabel", html, "debe usar formateador seguro de etiquetas sin duplicacion de unidades")
        self.assertNotIn("(%) (%)", html, "no deben existir duplicaciones de simbolos de porcentaje")

    def test_13_resolucion_poblacion_censo_2024(self):
        """Verifica que consultas de personas/poblacion resuelvan a poblacion_censo_2024 con las 10 comunas."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        client.init(sandbox.AYSEN_HUBS_DATA);

        const r = client.resolveClosedWorldDeterministic('¿cuántas personas viven en cada comuna?');
        if (!r.chart.render || r.chart.varX !== 'poblacion_censo_2024') {
            console.error('Expected poblacion_censo_2024, got:', r.chart);
            process.exit(1);
        }
        if (!r.reply.includes('100.745') && !r.reply.includes('100,745')) {
            console.error('Expected regional population in reply, got:', r.reply);
            process.exit(2);
        }
        const comunasEsperadas = ['Coyhaique', 'Aysén', 'Cisnes', 'Chile Chico', 'Cochrane'];
        for (const c of comunasEsperadas) {
            if (!r.reply.includes(c)) {
                console.error('Missing expected comuna ' + c + ' in reply:', r.reply);
                process.exit(3);
            }
        }
        console.log('POBLACION_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo resolviendo poblacion censo 2024:\n{proc.stderr}")
        self.assertIn("POBLACION_OK", proc.stdout)

    def test_14_estaciones_terrestres_auditadas(self):
        """Verifica que las coordenadas de estaciones y hospitales esten en tierra firme."""
        with open(os.path.join(ROOT_DIR, "data", "estaciones_aysen.json"), "r", encoding="utf-8") as f:
            estaciones_doc = json.load(f)
        estaciones = estaciones_doc.get("estaciones", []) if isinstance(estaciones_doc, dict) else estaciones_doc

        # Verificar estaciones previamente auditadas
        san_rafael = next((e for e in estaciones if "San Rafael" in e.get("nombre", "")), None)
        self.assertIsNotNone(san_rafael)
        self.assertAlmostEqual(san_rafael["lat"], -46.634, places=2)
        lon_val = san_rafael.get("lng", san_rafael.get("lon"))
        self.assertAlmostEqual(lon_val, -73.850, places=2)

        # Verificar hospitales oficiales DEIS en tierra firme
        with open(os.path.join(ROOT_DIR, "data", "systemic", "08_desagregaciones_sectoriales_aysen.json"), "r", encoding="utf-8") as f:
            sec8 = json.load(f)
        hosp_coyhaique = next((h for h in sec8.get("nodos_georreferenciados", []) if "Regional" in h.get("nombre", "")), None)
        self.assertIsNotNone(hosp_coyhaique)
        self.assertAlmostEqual(hosp_coyhaique["lat"], -45.5712, places=3)
        lon_hosp = hosp_coyhaique.get("lng", hosp_coyhaique.get("lon"))
        self.assertAlmostEqual(lon_hosp, -72.0685, places=3)

    def test_15_distincion_region_vs_comuna_y_preguntas_estructurales(self):
        """Verifica que preguntas regionales respondan a nivel de 10 comunas y solo menciones explicitas activen comunas individuales."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        client.init(sandbox.AYSEN_HUBS_DATA);

        // 1. Consulta estructural básica sobre la region
        const rStruct = client.resolveClosedWorldDeterministic('¿cuántas comunas tiene Aysén?');
        if (!rStruct.reply.includes('10 comunas')) {
            console.error('Expected 10 comunas in reply, got:', rStruct.reply);
            process.exit(1);
        }
        if (!rStruct.reply.includes('100.745') && !rStruct.reply.includes('100,745')) {
            console.error('Expected 100.745 inhabitants in reply, got:', rStruct.reply);
            process.exit(2);
        }
        if (rStruct.reply.includes('Ficha Territorial: Comuna de Aysén') || rStruct.reply.includes('cuenta con 23.170')) {
            console.error('Should not return individual comuna profile for regional query, got:', rStruct.reply);
            process.exit(3);
        }
        if (rStruct.chart.varX !== 'poblacion_censo_2024' || rStruct.chart.varY !== 'superficie_km2') {
            console.error('Expected bivariate chart poblacion vs superficie, got:', rStruct.chart);
            process.exit(4);
        }

        // 2. Variaciones estructurales
        const structuralVariants = [
            '¿cuáles son las comunas?',
            '¿cuáles son las 10 comunas?',
            'comunas de Aysén',
            'división comunal',
            '¿cuáles son las provincias de Aysén?'
        ];
        for (const q of structuralVariants) {
            const res = client.resolveClosedWorldDeterministic(q);
            if (!res.reply.includes('10 comunas') && !res.reply.includes('4 provincias')) {
                console.error('Expected structural response for query:', q, 'got:', res.reply);
                process.exit(5);
            }
        }

        // 3. Población regional (Aysén región sin especificar comuna)
        const rPobReg = client.resolveClosedWorldDeterministic('¿cuál es la población de Aysén?');
        if (!rPobReg.reply.includes('100.745') && !rPobReg.reply.includes('100,745')) {
            console.error('Expected regional population for Aysén query, got:', rPobReg.reply);
            process.exit(6);
        }

        // 4. Población comunal explícita (Puerto Aysén / Comuna de Aysén)
        const rPobPtoAysen = client.resolveClosedWorldDeterministic('¿cuál es la población de Puerto Aysén?');
        if (!rPobPtoAysen.reply.includes('23.170')) {
            console.error('Expected Puerto Aysén population (23.170), got:', rPobPtoAysen.reply);
            process.exit(7);
        }

        const rPobComAysen = client.resolveClosedWorldDeterministic('¿cuál es la población de la comuna de Aysén?');
        if (!rPobComAysen.reply.includes('23.170')) {
            console.error('Expected Comuna de Aysén population (23.170), got:', rPobComAysen.reply);
            process.exit(8);
        }

        // 5. Consulta explícita por comuna individual (perfil territorial)
        const rComuna = client.resolveClosedWorldDeterministic('¿cómo está la comuna de Aysén?');
        if (!rComuna.reply.includes('comuna de Aysén cuenta con') || !rComuna.reply.includes('23.170')) {
            console.error('Expected individual comuna profile for comuna de Aysén, got:', rComuna.reply);
            process.exit(9);
        }

        const rPtoAysen = client.resolveClosedWorldDeterministic('¿cómo está Puerto Aysén?');
        if (!rPtoAysen.reply.includes('comuna de Aysén cuenta con') || !rPtoAysen.reply.includes('23.170')) {
            console.error('Expected individual comuna profile for Puerto Aysén, got:', rPtoAysen.reply);
            process.exit(10);
        }

        const rCisnes = client.resolveClosedWorldDeterministic('¿cómo está Cisnes?');
        if (!rCisnes.reply.includes('comuna de Cisnes cuenta con') || !rCisnes.reply.includes('5.137')) {
            console.error('Expected individual comuna profile for Cisnes, got:', rCisnes.reply);
            process.exit(11);
        }

        console.log('STRUCTURAL_QUERY_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en distincion region vs comuna:\n{proc.stderr}")
        self.assertIn("STRUCTURAL_QUERY_OK", proc.stdout)

    def test_16_respuestas_concisas_sin_ai_slop(self):
        """Verifica que ninguna respuesta contenga términos prohibidos ni supere los 650 caracteres."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        client.init(sandbox.AYSEN_HUBS_DATA);

        const testQueries = [
            '¿Cuáles son las comunas con mayor dependencia del Fondo Común Municipal y cómo se comparan con sus ingresos propios?',
            'Muéstrame la evolución histórica de las visitas a Parques Nacionales y noches de alojamiento turístico entre 2015 y 2026',
            'Cruza el porcentaje de hogares que calefaccionan con leña y los días con contaminación crítica MP2.5',
            '¿Qué comunas concentran la biomasa de salmonicultura y cómo contrasta con la inversión pública regional?',
            '¿cuántas personas viven en cada comuna?',
            '¿cuántas comunas tiene Aysén?',
            '¿cuáles son las provincias de Aysén?',
            '¿qué datos tiene la plataforma?',
            '¿cómo está Cisnes?',
            '¿cómo está Puerto Aysén?',
            '¿cómo está la comuna de Aysén?',
            '¿cuál es la población de Aysén?',
            '¿cuál es la población de Puerto Aysén?',
            'superficie territorial de las comunas',
            '¿cuántas camas hospitalarias hay en Coyhaique?',
            'indicador_totalmente_inexistente_999'
        ];

        const prohibitedTerms = [
            'Data Lake',
            'Perfil Territorial Verificado',
            'Mundo Cerrado',
            'registros auditados'
        ];

        for (const q of testQueries) {
            const res = client.resolveClosedWorldDeterministic(q);
            if (!res || typeof res.reply !== 'string') {
                console.error('Invalid reply object for query:', q);
                process.exit(1);
            }
            for (const term of prohibitedTerms) {
                if (res.reply.toLowerCase().includes(term.toLowerCase())) {
                    console.error('Forbidden term "' + term + '" in reply for:', q, '\\nReply was:\\n', res.reply);
                    process.exit(2);
                }
            }
            if (res.reply.length > 650) {
                console.error('Reply exceeds 650 chars (' + res.reply.length + ') for query:', q, '\\nReply was:\\n', res.reply);
                process.exit(3);
            }
        }

        console.log('RESPUESTAS_CONCISAS_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en verificacion de respuestas concisas sin slop:\n{proc.stderr}")
        self.assertIn("RESPUESTAS_CONCISAS_OK", proc.stdout)

    def test_17_autodescubrimiento_rag_nuevas_variables_y_colecciones(self):
        """Verifica que el motor RAG en memoria auto-descubra columnas y colecciones futuras sin hardcoding."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const data = sandbox.AYSEN_HUBS_DATA;
        const client = require('./js/omniroute_client.js');

        // Inyectar una columna totalmente nueva en comunas y una coleccion futura
        data.comunas.forEach((c, idx) => {
            c.hidrogeno_verde_potencial_mw = (idx + 1) * 15;
            c.cobertura_5g_futura_pct = 50 + idx * 4;
        });
        data.catastroGeotermicoFuturo = [
            { id: 'GEO-1', nombre: 'Campo Hudson', potencia_mw: 120 },
            { id: 'GEO-2', nombre: 'Campo Puyuhuapi', potencia_mw: 85 }
        ];

        client.refreshMemory(data);
        const idx = client.getIndex();

        // 1. Verificar indexacion automatica de unidad y regla de agregacion (sum vs avg)
        const vH2 = idx.variablesByKey['hidrogeno_verde_potencial_mw'];
        const v5G = idx.variablesByKey['cobertura_5g_futura_pct'];
        if (!vH2 || vH2.unit !== 'MW' || vH2.aggregation !== 'sum') {
            console.error('Failed to infer metadata for hidrogeno_verde_potencial_mw:', vH2);
            process.exit(1);
        }
        if (!v5G || v5G.unit !== '%' || v5G.aggregation !== 'avg') {
            console.error('Failed to infer metadata for cobertura_5g_futura_pct:', v5G);
            process.exit(2);
        }

        // 2. Consultar la nueva variable y verificar sintesis dinamica desde memoria
        const resH2 = client.resolveClosedWorldDeterministic('¿Cuál es el hidrogeno verde potencial en las comunas?');
        if (resH2.chart.varX !== 'hidrogeno_verde_potencial_mw' || !resH2.reply.includes('825 MW')) {
            console.error('Failed dynamic synthesis for new column:', resH2);
            process.exit(3);
        }

        // 3. Verificar que la nueva coleccion haya sido indexada
        const foundCol = idx.customCollections.find(c => c.key === 'catastroGeotermicoFuturo');
        if (!foundCol || foundCol.count !== 2) {
            console.error('Failed to index custom collection catastroGeotermicoFuturo:', foundCol);
            process.exit(4);
        }

        console.log('DYNAMIC_RAG_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en autodescubrimiento RAG:\n{proc.stderr}")
        self.assertIn("DYNAMIC_RAG_OK", proc.stdout)

    def test_18_perfil_comunal_rico_cisnes(self):
        """Test 1 (Perfil Comunal Rico): 'cuentame sobre la comuna de Cisnes' devuelve perfil de 4 bloques con demografia, salmonicultura, finanzas, salud y energia."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        client.init(sandbox.AYSEN_HUBS_DATA);
        client.clearConversationMemory();

        const res = client.resolveClosedWorldDeterministic('cuéntame sobre la comuna de Cisnes');
        const r = res.reply || '';

        const requiredSnippets = [
            '5.137',
            '16.093',
            '218 concesiones',
            '78 centros activos',
            '185.000 ton',
            '74,5% dependencia FCM',
            '12 camas',
            '980 alumnos',
            '95,1% leña'
        ];
        for (const s of requiredSnippets) {
            if (!r.includes(s)) {
                console.error('Missing expected snippet in Cisnes profile:', s, '\\nReply was:\\n', r);
                process.exit(1);
            }
        }

        if (!Array.isArray(res.chart.comunaProfileRows) || res.chart.comunaProfileRows.length < 20) {
            console.error('Expected comunaProfileRows table data for Cisnes, got:', res.chart.comunaProfileRows?.length);
            process.exit(2);
        }

        console.log('CISNES_PROFILE_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en perfil comunal rico de Cisnes:\n{proc.stderr}")
        self.assertIn("CISNES_PROFILE_OK", proc.stdout)

    def test_19_seguimiento_conversacional_comuna_sector(self):
        """Test 2 (Seguimiento Conversacional Comuna x Sector): tras consultar por Cisnes, preguntar por su relacion con la salmonicultura mantiene Cisnes y cita SERNAPESCA/SUBPESCA."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        client.init(sandbox.AYSEN_HUBS_DATA);

        for (const followUpQ of ['¿y cuál es su relación con la salmonicultura?', 'y cuál es la relación que tiene Cisnes respecto a la salmonicultura?']) {
            client.clearConversationMemory();
            client.resolveClosedWorldDeterministic('cuéntame sobre la comuna de Cisnes');
            const res = client.resolveClosedWorldDeterministic(followUpQ);
            const r = res.reply || '';

            const expected = ['Cisnes', '218', '78', '185.000', 'AquaChile', 'Mowi Chile', 'Multi X'];
            for (const token of expected) {
                if (!r.includes(token)) {
                    console.error('Missing expected token in Cisnes salmonicultura crossing:', token, '\\nReply was:\\n', r);
                    process.exit(1);
                }
            }

            if (res.chart.varX !== 'concesiones_salmon' || res.chart.varY !== 'biomasa_salmon_ton') {
                console.error('Expected bivariate salmon chart, got:', res.chart);
                process.exit(2);
            }

            const srcText = JSON.stringify(res.sources || []);
            if (!srcText.includes('SERNAPESCA') || srcText.includes('CNE') || srcText.includes('CEAD')) {
                console.error('Invalid sources for Cisnes salmonicultura:', res.sources);
                process.exit(3);
            }
        }

        // Verify 3-turn comuna->sector->comuna switch preserves sector context
        client.clearConversationMemory();
        client.resolveClosedWorldDeterministic('cuéntame sobre la comuna de Cisnes');
        client.resolveClosedWorldDeterministic('¿y en salud?');
        const turn3 = client.resolveClosedWorldDeterministic('¿y en Coyhaique?');
        if (!turn3.reply.includes('Coyhaique') || !turn3.reply.toLowerCase().includes('salud y red asistencial')) {
            console.error('Turn 3 failed to preserve salud sector on comuna switch:', turn3.reply);
            process.exit(4);
        }

        console.log('FOLLOWUP_SECTOR_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en seguimiento conversacional Comuna x Sector:\n{proc.stderr}")
        self.assertIn("FOLLOWUP_SECTOR_OK", proc.stdout)

    def test_20_distribucion_concesiones_empresas_holdings(self):
        """Test 3 (Distribucion por Empresas / Holdings y Pesquerias): responde y grafica los 12 holdings salmoneros madres con customCategoryData y soporta pesquerias/cuotas."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        client.init(sandbox.AYSEN_HUBS_DATA);

        const queries = [
            '¿cómo se distribuyen las concesiones salmoneras según empresas?',
            'pregunté por empresas o holdings, no comunas'
        ];

        for (const q of queries) {
            const res = client.resolveClosedWorldDeterministic(q);
            const r = res.reply || '';
            if (r.length > 650) {
                console.error('Holdings reply exceeded 650 chars (' + r.length + '):\\n' + r);
                process.exit(1);
            }
            for (const hName of ['AquaChile', 'Multi X', 'Blumar', 'Mowi Chile', 'Cermaq Chile', 'Australis Mar', 'Yadran', 'Salmones Ice Val']) {
                if (!r.includes(hName)) {
                    console.error('Missing holding ' + hName + ' in reply for ' + q + ':\\n' + r);
                    process.exit(1);
                }
            }
            if (!res.chart || !res.chart.customCategoryData || !Array.isArray(res.chart.labels) || res.chart.labels.length !== 12) {
                console.error('Expected customCategoryData with 12 holding labels, got:', res.chart);
                process.exit(2);
            }
            if (!Array.isArray(res.chart.datasets) || res.chart.datasets.length < 2 || res.chart.datasets[1].yAxisID !== 'y1') {
                console.error('Expected 2 datasets (concesiones + biomasa y1), got:', res.chart.datasets);
                process.exit(3);
            }
        }

        const fishRes = client.resolveClosedWorldDeterministic('cuotas industriales en Aysén');
        if (!fishRes.reply.includes('Merluza del Sur') || !fishRes.reply.includes('Congrio Dorado') || fishRes.reply.length > 650) {
            console.error('Fishery quota query failed:', fishRes.reply);
            process.exit(4);
        }

        console.log('HOLDINGS_QUERY_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en consulta por empresas/holdings salmoneros:\n{proc.stderr}")
        self.assertIn("HOLDINGS_QUERY_OK", proc.stdout)

    def test_21_mapeo_exacto_fuentes_sin_contaminacion(self):
        """Test 4 (Mapeo Exacto de Fuentes sin Contaminacion): 'ranking de comunas por cantidad de habitantes' y '¿cuántos habitantes tiene cada comuna?' citan solo INE Censo 2024."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        client.init(sandbox.AYSEN_HUBS_DATA);

        for (const q of ['ranking de comunas por cantidad de habitantes', '¿cuántos habitantes tiene cada comuna?']) {
            client.clearConversationMemory();
            const res = client.resolveClosedWorldDeterministic(q);
            if (!Array.isArray(res.sources) || res.sources.length !== 1) {
                console.error('Expected exactly 1 source for habitantes query "' + q + '", got:', res.sources);
                process.exit(1);
            }
            const s0 = res.sources[0];
            if (!s0.institucion.includes('INE') || !s0.institucion.includes('Censo de Población y Vivienda 2024')) {
                console.error('Expected INE Censo 2024 source, got:', s0);
                process.exit(2);
            }
            const rawSourcesStr = JSON.stringify(res.sources);
            for (const forbidden of ['CEAD', 'Violencia Intrafamiliar', 'DEIS', 'CNE', 'poblacion_censo_2024']) {
                if (rawSourcesStr.includes(forbidden)) {
                    console.error('Forbidden cross-citation or snake_case in sources:', forbidden, rawSourcesStr);
                    process.exit(3);
                }
            }
        }

        console.log('EXACT_PROVENANCE_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en mapeo exacto 1-a-1 de fuentes oficiales:\n{proc.stderr}")
        self.assertIn("EXACT_PROVENANCE_OK", proc.stdout)

    def test_22_cero_claves_crudas_sin_tildes_y_cero_corte_2026(self):
        """Test 5 (Cero Claves Crudas sin Tildes y Cero Corte 17-Oct-2026): verifica CANONICAL_LABELS y limpieza de consultor.html."""
        with open(self.consultor_path, "r", encoding="utf-8") as f:
            html = f.read()

        self.assertNotIn("Corte 17-Oct-2026", html, "consultor.html no debe contener 'Corte 17-Oct-2026'")
        self.assertNotIn("Formato es-CL", html, "consultor.html no debe contener 'Formato es-CL'")
        self.assertIn("white-space: normal", html, "consultor.html debe aplicar white-space: normal en subtitulo y badges")
        self.assertIn("customCategoryData", html, "consultor.html debe soportar customCategoryData para los 12 holdings")
        self.assertIn("comunaProfileRows", html, "consultor.html debe soportar comunaProfileRows para fichas comunales")

        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        client.init(sandbox.AYSEN_HUBS_DATA);

        const badStrings = [
            'Dependencia fcm',
            'Poblacion censo 2024',
            'Biomasa salmon',
            'Concesiones salmon'
        ];

        const queries = [
            '¿Cuáles son las comunas con mayor dependencia del Fondo Común Municipal y cómo se comparan con sus ingresos propios?',
            'ranking de comunas por cantidad de habitantes',
            '¿Qué comunas concentran la biomasa de salmonicultura y cómo contrasta con la inversión pública regional?',
            'concesiones de salmonicultura por comuna'
        ];

        for (const q of queries) {
            const res = client.resolveClosedWorldDeterministic(q);
            const combined = (res.reply || '') + ' | ' + (res.chart?.title || '');
            for (const bad of badStrings) {
                if (combined.toLowerCase().includes(bad.toLowerCase())) {
                    console.error('Found unaccented raw label "' + bad + '" in output for query "' + q + '":\\n' + combined);
                    process.exit(1);
                }
            }
        }

        console.log('CANONICAL_LABELS_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en verificacion de etiquetas canonicas con tildes:\n{proc.stderr}")
        self.assertIn("CANONICAL_LABELS_OK", proc.stdout)

    def test_23_conectividad_multimodal_y_barometro_en_omniroute(self):
        """Verifica que js/omniroute_client.js resuelva consultas sobre conectividad multimodal, reportes oficiales y Barometro."""
        node_script = """
        const fs = require('fs');
        const content = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
        const sandbox = {};
        eval(content.replace('window.', 'sandbox.'));
        const client = require('./js/omniroute_client.js');
        const ok = client.init(sandbox.AYSEN_HUBS_DATA);
        if (!ok) {
            console.error('Failed to init client');
            process.exit(1);
        }

        // 1. Verificar variables clave en comunas de AYSEN_HUBS_DATA
        const comunas = sandbox.AYSEN_HUBS_DATA.comunas;
        const requiredVars = [
            'red_vial_total_km',
            'red_vial_pavimentada_km',
            'red_vial_ripio_km',
            'red_vial_tierra_km',
            'red_vial_pavimentada_pct',
            'distancia_coyhaique_km',
            'tiempo_viaje_coyhaique_hrs',
            'dependencia_barcaza_nivel',
            'hogares_sin_internet_fijo_pct',
            'cobertura_fibra_hogar_pct',
            'establecimientos_educacion_conectados_n',
            'deficit_habitacional_cuantitativo_n',
            'deficit_habitacional_cualitativo_n',
            'sistemas_ssr_apr_n',
            'cobertura_ssr_apr_familias',
            'ganado_bovino_cabezas',
            'ganado_ovino_cabezas',
            'bosque_nativo_ha',
            'plantaciones_ha',
            'consumo_lena_m3_hogar_ano',
            'superficie_glaciares_km2',
            'esperanza_vida_total_anos',
            'cobertura_empam_pct',
            'cobertura_pscv_pct',
            'barometro_confianza_institucional_pct',
            'barometro_redes_apoyo_comunitario_pct',
            'barometro_orgullo_identidad_pct',
            'barometro_prioridad_conectividad_pct',
            'barometro_tension_desarrollo_conservacion_pct',
            'barometro_intencion_migracion_juvenil_pct',
            'barometro_evaluacion_acceso_salud_pct',
            'barometro_preocupacion_contaminacion_lena_pct'
        ];

        for (const v of requiredVars) {
            for (const c of comunas) {
                if (c[v] === undefined || c[v] === null || typeof c[v] !== 'number' || isNaN(c[v])) {
                    console.error('Missing or non-numeric var ' + v + ' in comuna ' + c.nombre);
                    process.exit(2);
                }
            }
        }

        // 2. Verificar series temporales de conectividad y barometro
        const series = sandbox.AYSEN_HUBS_DATA.series || {};
        const requiredSeries = [
            'balmaceda_pasajeros_jac',
            'emporcha_toneladas',
            'emporcha_cruceros',
            'barometro'
        ];
        for (const s of requiredSeries) {
            if (!series[s]) {
                console.error('Missing series ' + s);
                process.exit(3);
            }
        }

        // 3. Probar resolucion de consultas cerradas
        const testQueries = [
            { q: 'red vial pavimentada en aysen', expectedVar: 'red_vial_pavimentada_km' },
            { q: 'dependencia de barcaza en las comunas', expectedVar: 'dependencia_barcaza_nivel' },
            { q: 'distancia a coyhaique por comuna', expectedVar: 'distancia_coyhaique_km' },
            { q: 'cobertura de fibra optica al hogar', expectedVar: 'cobertura_fibra_hogar_pct' },
            { q: 'hogares sin conexion a internet fijo por comuna', expectedVar: 'hogares_sin_internet_fijo_pct' },
            { q: 'deficit habitacional cuantitativo por comuna minvu', expectedVar: 'deficit_habitacional_cuantitativo_n' },
            { q: 'control adulto mayor empam en aysen', expectedVar: 'cobertura_empam_pct' },
            { q: 'salud cardiovascular pscv por comuna', expectedVar: 'cobertura_pscv_pct' },
            { q: 'ganado bovino por comuna', expectedVar: 'ganado_bovino_cabezas' },
            { q: 'superficie de glaciares dga', expectedVar: 'superficie_glaciares_km2' },
            { q: 'barometro patagonia confianza institucional uaysen', expectedVar: 'barometro_confianza_institucional_pct' },
            { q: 'barometro orgullo regional aysen', expectedVar: 'barometro_orgullo_identidad_pct' },
            { q: 'esperanza de vida al nacer por comuna minsal', expectedVar: 'esperanza_vida_total_anos' },
            { q: 'consumo residencial de lena por comuna aysen', expectedVar: 'consumo_lena_m3_hogar_ano' }
        ];

        for (const t of testQueries) {
            const res = client.resolveClosedWorldDeterministic(t.q);
            if (!res.chart.render) {
                console.error('Query did not render chart:', t.q);
                process.exit(4);
            }
            if (res.chart.varX !== t.expectedVar && res.chart.varY !== t.expectedVar) {
                console.error('Query ' + t.q + ' resolved to varX=' + res.chart.varX + ' varY=' + res.chart.varY + ' instead of ' + t.expectedVar);
                process.exit(5);
            }
        }

        // 4. Probar consultas sectoriales compuestas
        const secResCon = client.resolveClosedWorldDeterministic('conectividad en aysen');
        if (!secResCon.chart.render || !secResCon.chart.varX) {
            console.error('Sector conectividad query failed');
            process.exit(6);
        }
        const secResBar = client.resolveClosedWorldDeterministic('barometro en aysen');
        if (!secResBar.chart.render || !secResBar.chart.varX) {
            console.error('Sector barometro query failed');
            process.exit(7);
        }

        console.log('OMNIROUTE_MULTIMODAL_BARO_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Error en test_23 omniroute:\n{proc.stderr}")
        self.assertIn("OMNIROUTE_MULTIMODAL_BARO_OK", proc.stdout)

    def test_24_barometro_sintesis_multidimensional_y_repregunta_conversacional(self):
        """Verifica que consultas amplias al Barometro UAysen retornen sintesis multidimensional y la repregunta mantenga el contexto."""
        node_script = """
        const fs = require('fs');
        const path = require('path');

        global.window = {
            addEventListener: () => {},
            dispatchEvent: () => {}
        };
        global.document = {
            addEventListener: () => {},
            getElementById: () => null
        };

        const bundleCode = fs.readFileSync(path.join(process.cwd(), 'data/aysen_hubs_data.js'), 'utf8');
        eval(bundleCode);

        const clientCode = fs.readFileSync(path.join(process.cwd(), 'js/omniroute_client.js'), 'utf8');
        eval(clientCode);

        const client = global.window.OmniRouteClient || window.OmniRouteClient;
        if (!client) {
            console.error('OmniRouteClient not exported');
            process.exit(1);
        }

        const res = client.resolveClosedWorldDeterministic('dame datos del barometro de la u de aysen');
        if (!res || !res.reply) {
            console.error('No reply returned for barometro query');
            process.exit(2);
        }
        if (!res.chart || !res.chart.render) {
            console.error('Barometro query must render chart');
            process.exit(3);
        }
        if (!res.reply.includes('Barometro') && !res.reply.includes('regional')) {
            console.error('Reply does not mention Barometro or regional stats');
            process.exit(4);
        }

        const followRes = client.resolveClosedWorldDeterministic('¿y no tienes mas datos?');
        if (!followRes || !followRes.reply) {
            console.error('No follow up response returned');
            process.exit(5);
        }
        if (followRes.reply.includes('No encontre datos') || followRes.reply.includes('inexistente')) {
            console.error('Follow-up lost context and failed: ' + followRes.reply);
            process.exit(6);
        }
        if (!followRes.chart || !followRes.chart.render) {
            console.error('Follow-up query must maintain active chart render');
            process.exit(7);
        }
        if (followRes.chart.varX === res.chart.varX && followRes.chart.varY === res.chart.varY) {
            console.error('Follow-up chart indicators did not rotate from initial query');
            process.exit(8);
        }

        console.log('BAROMETRO_CONVERSATIONAL_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Error en test_24 omniroute:\n{proc.stderr}")
        self.assertIn("BAROMETRO_CONVERSATIONAL_OK", proc.stdout)

    def test_25_consultor_html_inicia_con_estado_vacio(self):
        """Verifica que consultor.html inicie con #emptyEvidenceState y currentChartState.render = false."""
        with open(self.consultor_path, "r", encoding="utf-8") as f:
            html = f.read()

        self.assertIn('id="emptyEvidenceState"', html, "consultor.html debe tener el contenedor #emptyEvidenceState")
        self.assertIn('class="empty-evidence"', html, "consultor.html debe tener estilos .empty-evidence")
        self.assertIn('render: false', html, "consultor.html debe inicializar currentChartState con render: false")

    def test_26_variables_reconciliadas_single_source_of_truth(self):
        """Verifica que las 14 variables territoriales reconciliadas resuelvan deterministicamente con fuentes y graficos."""
        node_script = """
        const fs = require('fs');
        const path = require('path');

        global.window = {};
        const bundleCode = fs.readFileSync(path.join(process.cwd(), 'data/aysen_hubs_data.js'), 'utf8');
        eval(bundleCode);

        const clientCode = fs.readFileSync(path.join(process.cwd(), 'js/omniroute_client.js'), 'utf8');
        eval(clientCode);

        const client = global.window.OmniRouteClient || window.OmniRouteClient;
        if (!client) {
            console.error('OmniRouteClient not exported');
            process.exit(1);
        }
        client.init(global.window.AYSEN_HUBS_DATA);

        const testCases = [
            {
                topic: 'lena_pellet',
                query: 'demanda de pellet y consumo de lena infor sec',
                expectedKeywords: ['INFOR', 'SEC', 'pellet'],
                expectedSource: 'INFOR'
            },
            {
                topic: 'deficit_habitacional',
                query: 'deficit habitacional cuantitativo y cualitativo minvu',
                expectedKeywords: ['MINVU', 'cuantitativo', 'cualitativo'],
                expectedSource: 'MINVU'
            },
            {
                topic: 'agua_ssr_apr',
                query: 'comites y beneficiarios de agua rural ssr apr doh mop',
                expectedKeywords: ['DOH', 'SSR', '47 comités'],
                expectedSource: 'DOH'
            },
            {
                topic: 'pobreza_casen',
                query: 'pobreza multidimensional vs ingresos casen mdsf',
                expectedKeywords: ['CASEN', 'MDSF', 'Multidimensional'],
                expectedSource: 'MDSF'
            },
            {
                topic: 'listas_espera',
                query: 'listas de espera de especialidad y quirurgica sigte minsal',
                expectedKeywords: ['SIGTE', '11.420'],
                expectedSource: 'SIGTE'
            },
            {
                topic: 'oncologia_salud_mental',
                query: 'cancer gastrico vesicula y tasa de suicidio deis minsal',
                expectedKeywords: ['DEIS', 'Gástrico', 'suicidio'],
                expectedSource: 'DEIS'
            },
            {
                topic: 'red_asistencial_camas',
                query: 'camas hospitalarias hrc 167 de 261 y postas de salud rural 27 psr',
                expectedKeywords: ['167 camas', '27 Postas'],
                expectedSource: 'DEIS'
            },
            {
                topic: 'educacion_slep_sies',
                query: 'slep aysen traspaso 2024 66 establecimientos y matricula sies',
                expectedKeywords: ['SLEP', '66', 'SIES'],
                expectedSource: 'SLEP'
            },
            {
                topic: 'ecmpo_snaspe',
                query: 'solicitudes ecmpo ley lafkenche 620000 ha y concesiones en snaspe',
                expectedKeywords: ['620.000 ha', '312', 'Guaitecas'],
                expectedSource: 'SUBPESCA'
            },
            {
                topic: 'ganaderia_censo',
                query: 'existencias ganaderas bovinas y ovinas odepa',
                expectedKeywords: ['ODEPA', '130.832', '177.934'],
                expectedSource: 'ODEPA'
            },
            {
                topic: 'inversion_fndr_sectorial',
                query: 'inversion fndr devengada vs sectorial ministerial dipres',
                expectedKeywords: ['DIPRES', 'FNDR'],
                expectedSource: 'DIPRES'
            },
            {
                topic: 'bancarizacion_cajavecina',
                query: 'bancarizacion y cobertura cajavecina cmf bancoestado',
                expectedKeywords: ['CMF', 'BancoEstado', 'CajaVecina'],
                expectedSource: 'CMF'
            },
            {
                topic: 'glofs_glaciares',
                query: 'glofs en cuenca baker cachet 2 dga y glaciar exploradores',
                expectedKeywords: ['GLOF', 'Cachet 2', 'Exploradores'],
                expectedSource: 'DGA'
            },
            {
                topic: 'zoits_oficiales',
                query: 'las 3 zoits oficiales decretadas subturismo sernatur',
                expectedKeywords: ['Subturismo', 'Chelenko', 'Glaciares'],
                expectedSource: 'Turismo'
            }
        ];

        (async () => {
            for (const tc of testCases) {
                const res = client.resolveClosedWorldDeterministic(tc.query);
                if (!res || !res.reply) {
                    console.error('FAIL topic ' + tc.topic + ': No reply returned');
                    process.exit(2);
                }
                if (!res.chart || !res.chart.render) {
                    console.error('FAIL topic ' + tc.topic + ': Chart not rendered');
                    process.exit(3);
                }
                for (const kw of tc.expectedKeywords) {
                    if (!res.reply.includes(kw)) {
                        console.error('FAIL topic ' + tc.topic + ': Reply missing keyword ' + kw + ' in: ' + res.reply);
                        process.exit(4);
                    }
                }
                const srcMatch = (res.sources || []).some(s => (s.institucion || '').includes(tc.expectedSource) || (s.clave || '').includes(tc.expectedSource));
                if (!srcMatch) {
                    console.error('FAIL topic ' + tc.topic + ': Sources missing ' + tc.expectedSource + '; sources:', res.sources);
                    process.exit(5);
                }

                const resQuery = await client.query(tc.query);
                if (!resQuery || resQuery.reply !== res.reply || !resQuery.chart?.render) {
                    console.error('FAIL topic ' + tc.topic + ': client.query did not match deterministic resolution');
                    process.exit(6);
                }
            }

            console.log('RECONCILED_VARIABLES_SST_OK');
        })();
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Error en test_26 omniroute:\n{proc.stderr}")
        self.assertIn("RECONCILED_VARIABLES_SST_OK", proc.stdout)

    def test_27_consultas_indirectas_y_cero_hardcodeo_fuentes(self):
        """Verifica resolucion semantica de consultas indirectas y eliminacion de hardcodeo de 28 fuentes y escala de cabecera."""
        with open(self.consultor_path, "r", encoding="utf-8") as f:
            html = f.read()

        self.assertNotIn("28 fuentes oficiales", html, "consultor.html no debe hardcodear '28 fuentes oficiales'")
        self.assertIn("JetBrains+Mono", html, "consultor.html debe cargar JetBrains Mono para la cabecera global")
        self.assertNotRegex(html, r"html,\s*body\s*\{[^}]*font-size:\s*14px", "html/body en consultor.html no debe fijar font-size: 14px")

        node_script = """
        const fs = require('fs');
        const path = require('path');

        global.window = {};
        eval(fs.readFileSync(path.join(process.cwd(), 'data/aysen_hubs_data.js'), 'utf8'));
        eval(fs.readFileSync(path.join(process.cwd(), 'js/omniroute_client.js'), 'utf8'));

        const client = global.window.OmniRouteClient || window.OmniRouteClient;
        client.init(global.window.AYSEN_HUBS_DATA);
        const idx = client.getIndex();
        if (idx.fuentes.length <= 28) {
            console.error('Expected dynamic fuente catalog > 28, got:', idx.fuentes.length);
            process.exit(1);
        }

        const prompt = client.buildSystemPrompt();
        if (prompt.includes('28 fuentes oficiales')) {
            console.error('System prompt still hardcodes 28 fuentes oficiales');
            process.exit(2);
        }

        const indirectCases = [
            {
                q: 'cuántos perros hay en Aysen',
                expectedKeywords: ['huemules', '130.832', '177.934'],
                forbiddenSources: ['SERNAPESCA']
            },
            {
                q: 'cuáles son los principales nudos críticos en materia energética en Aysén',
                expectedKeywords: ['98,6 MW', 'SAIDI', 'leña', 'MP2.5'],
                forbiddenSources: ['SERNAPESCA']
            },
            {
                q: 'cuáles son las principales rutas por las que entran insumos a la región de Aysén',
                expectedKeywords: ['RN40', 'Chacabuco', '468.200', '3.386,4'],
                forbiddenSources: ['SERNAPESCA']
            },
            {
                q: 'cuántos árboles hay en Aysén?',
                expectedKeywords: ['4.832.500', '5.723.000', 'CONAF'],
                forbiddenSources: ['SERNAPESCA']
            }
        ];

        for (const tc of indirectCases) {
            const res = client.resolveClosedWorldDeterministic(tc.q);
            if (!res || !res.reply || !res.chart || !res.chart.render) {
                console.error('Indirect query failed to render chart/reply:', tc.q, res);
                process.exit(3);
            }
            if (res.reply.length > 650) {
                console.error('Indirect reply exceeded 650 chars:', tc.q, res.reply.length);
                process.exit(4);
            }
            for (const kw of tc.expectedKeywords) {
                if (!res.reply.includes(kw)) {
                    console.error('Missing keyword ' + kw + ' for query ' + tc.q + ': ' + res.reply);
                    process.exit(5);
                }
            }
            const srcStr = JSON.stringify(res.sources || []);
            for (const f of tc.forbiddenSources) {
                if (srcStr.includes(f)) {
                    console.error('Forbidden source ' + f + ' for query ' + tc.q + ': ' + srcStr);
                    process.exit(6);
                }
            }
        }

        console.log('INDIRECT_QUERIES_AND_DYNAMIC_SOURCES_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Error en test_27 omniroute:\n{proc.stderr}")
        self.assertIn("INDIRECT_QUERIES_AND_DYNAMIC_SOURCES_OK", proc.stdout)

    def test_28_recuperacion_semantica_general_y_stemming(self):
        """Verifica el atlas panoramico, stemming morfologico y recuperacion semantica para consultas coloquiales sin reglas ad-hoc."""
        node_script = """
        const fs = require('fs');
        const path = require('path');

        global.window = {};
        eval(fs.readFileSync(path.join(process.cwd(), 'data/aysen_hubs_data.js'), 'utf8'));
        eval(fs.readFileSync(path.join(process.cwd(), 'js/omniroute_client.js'), 'utf8'));

        const client = global.window.OmniRouteClient || window.OmniRouteClient;
        client.init(global.window.AYSEN_HUBS_DATA);
        const idx = client.getIndex();

        if (!Array.isArray(idx.panoramicIndicators) || idx.panoramicIndicators.length < 100) {
            console.error('Expected panoramicIndicators >= 100, got:', idx.panoramicIndicators?.length);
            process.exit(1);
        }
        if (!idx.panoramicNodesAndMilestones || !idx.panoramicNodesAndMilestones.includes('Nodos (39)')) {
            console.error('Missing panoramicNodesAndMilestones summary');
            process.exit(2);
        }

        const colloquialCases = [
            {
                q: '¿Dónde cuesta más conseguir casa o vivienda propia en Aysén?',
                expectedAnyVar: ['deficit_habitacional_cuantitativo_n', 'deficit_habitacional_cuantitativo_minvu']
            },
            {
                q: '¿En qué comunas hay más abuelos o población envejecida?',
                expectedAnyVar: ['indice_envejecimiento']
            },
            {
                q: '¿Dónde se corta más la luz o hay más apagones en Aysén?',
                expectedAnyVar: ['saidi_horas_anual']
            },
            {
                q: '¿Dónde hay más tensión entre cuidar la naturaleza y la economía?',
                expectedAnyVar: ['barometro_tension_desarrollo_conservacion_pct']
            },
            {
                q: '¿Dónde faltan más doctores por cada mil habitantes en Aysén?',
                expectedAnyVar: ['medicos_por_mil_hab']
            },
            {
                q: '¿Qué comunas tienen más puntos de CajaVecina para sacar plata?',
                expectedAnyVar: ['puntos_cajavecina_bancoestado']
            },
            {
                q: '¿En qué comunas hay más glaciares y reservas de hielo?',
                expectedAnyVar: ['glaciares_dga_n', 'superficie_glaciares_km2', 'superficie_glaciar_km2']
            }
        ];

        for (const tc of colloquialCases) {
            const res = client.resolveClosedWorldDeterministic(tc.q);
            const hit = res && res.chart && res.chart.render &&
                (tc.expectedAnyVar.includes(res.chart.varX) || tc.expectedAnyVar.includes(res.chart.varY));
            if (!hit) {
                console.error('Colloquial query failed:', tc.q, 'got varX=' + res?.chart?.varX, 'varY=' + res?.chart?.varY, 'reply=' + res?.reply);
                process.exit(3);
            }
        }

        // Verificar que una consulta verdaderamente inexistente siga declarando ausencia en mundo cerrado
        const rAlien = client.resolveClosedWorldDeterministic('¿Cuántas naves espaciales interplanetarias existen en Júpiter?');
        if (!rAlien || rAlien.chart.render !== false || !rAlien.reply.includes('no forma parte de las fuentes oficiales')) {
            console.error('Expected closed-world rejection for out-of-domain query, got:', rAlien);
            process.exit(4);
        }

        console.log('GENERAL_SEMANTIC_RAG_AND_STEMMING_OK');
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Error en test_28 omniroute:\n{proc.stderr}")
        self.assertIn("GENERAL_SEMANTIC_RAG_AND_STEMMING_OK", proc.stdout)

    def test_29_auditoria_9_casos_borde_y_bloques_1_a_4(self):
        """
        Verifica contratos HTML de Bloques 1-4 en consultor.html y los 9 casos borde
        de la auditoria empirica (subset ranking, localidades, ingles/PM2.5, guardrails,
        holdings 726/745, multiCharts y modo comuna unica) en resolveClosedWorldDeterministic y query().
        """
        with open(os.path.join(ROOT_DIR, "consultor.html"), "r", encoding="utf-8") as f:
            html_content = f.read()

        required_html_tokens = [
            "btnScopeFilter",
            "multiChartGrid",
            "emptyEvidenceReason",
            "destroyActiveCharts",
            "onlyFocusedComunas",
            "Promise.race",
            "de 745 concesiones regionales; 19 otros titulares"
        ]
        for token in required_html_tokens:
            self.assertIn(token, html_content, f"Falta token contractual de Bloques 1-4 en consultor.html: {token}")

        node_script = r"""
        const fs = require('fs');
        const path = require('path');
        const assert = require('assert');

        global.window = global;
        global.location = { protocol: 'http:', hostname: 'localhost' };
        global.fetch = async () => { throw new Error('offline-test'); };

        eval(fs.readFileSync(path.join(process.cwd(), 'data/aysen_hubs_data.js'), 'utf8'));
        eval(fs.readFileSync(path.join(process.cwd(), 'js/nl2chart_engine.js'), 'utf8'));
        const lexicon = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/nl_lexicon_aysen.json'), 'utf8'));
        if (global.NL2ChartEngine && typeof global.NL2ChartEngine.setLexicon === 'function') {
            global.NL2ChartEngine.setLexicon(lexicon);
        }
        eval(fs.readFileSync(path.join(process.cwd(), 'js/omniroute_client.js'), 'utf8'));

        const client = global.OmniRouteClient;
        client.init(global.AYSEN_HUBS_DATA);

        (async () => {
            // 1. Subset ranking & sum (P6): 3 comunas menos pobladas
            const p6Queries = [
                client.resolveClosedWorldDeterministic('¿Qué porcentaje de la población regional representan las 3 comunas menos pobladas de Aysén y cuál es su suma total?'),
                await client.query('¿Qué porcentaje de la población regional representan las 3 comunas menos pobladas de Aysén y cuál es su suma total?')
            ];
            for (const r of p6Queries) {
                assert(r && r.reply, 'P6 sin reply');
                assert(r.reply.includes('Tortel') && r.reply.includes("O'Higgins") && r.reply.includes('Lago Verde'), 'P6 debe listar Tortel, O\'Higgins y Lago Verde: ' + r.reply);
                assert(r.reply.includes('1.931') && r.reply.includes('1,917%'), 'P6 debe calcular 1.931 hab. y 1,917%: ' + r.reply);
                assert(!r.reply.includes('Guaitecas') && !r.reply.includes('2.740'), 'P6 no debe incluir Guaitecas ni 2.740: ' + r.reply);
            }

            // 2. Localidades sub-comunales (P9.2): Puerto Río Tranquilo vs Puyuhuapi
            const p92 = await client.query('Compara Puerto Río Tranquilo vs Puyuhuapi');
            assert(p92 && p92.reply, 'P9.2 sin reply');
            assert(p92.reply.includes('Río Ibáñez') && p92.reply.includes('Cisnes'), 'P9.2 debe mapear a Río Ibáñez y Cisnes: ' + p92.reply);
            assert(p92.reply.includes('Nota:'), 'P9.2 debe incluir nota territorial de localidad: ' + p92.reply);
            assert(p92.chart && Array.isArray(p92.chart.focusComunas), 'P9.2 debe poblar focusComunas');
            assert(p92.chart.focusComunas.includes('Río Ibáñez') && p92.chart.focusComunas.includes('Cisnes'), 'focusComunas debe incluir Río Ibáñez y Cisnes');

            // 3. Ingles + PM2.5 + Scatter (P7)
            const p7 = await client.query('Show me a scatter plot comparing firewood heating dependency and PM2.5 critical days across the 10 communes of Aysén');
            assert(p7 && p7.chart && p7.chart.render === true, 'P7 debe renderizar grafico');
            assert.strictEqual(p7.chart.type, 'scatter', 'P7 debe producir scatter');
            const p7Vars = [p7.chart.varX, p7.chart.varY];
            assert(p7Vars.includes('hogares_lena_pct') && p7Vars.includes('dias_sobre_norma_mp25'), 'P7 variables esperadas: ' + p7Vars.join(','));

            // 4. Jailbreak fuera de dominio (P4) -> render false
            const p4 = await client.query('¿Cuál fue el candidato ganador en Chile o cuánto cuesta un pasaje aéreo Santiago Coyhaique?');
            assert(p4 && p4.chart && p4.chart.render === false, 'P4 debe devolver chart.render === false');

            // 5. Meta-consulta de frescura (P8) -> render false y menciona 17 de octubre de 2026
            const p8 = await client.query('¿Hasta qué fecha están actualizados estos datos y de dónde provienen?');
            assert(p8 && p8.chart && p8.chart.render === false, 'P8 debe devolver chart.render === false');
            assert(p8.reply.includes('17 de octubre de 2026'), 'P8 debe indicar corte 17 de octubre de 2026: ' + p8.reply);

            // 6. Desempleo ausente (P3) y PIB/Providencia con proxy SII (P2)
            const p3 = await client.query('¿Cuál es la tasa de desempleo comunal en Aysén?');
            assert(p3 && p3.chart && p3.chart.render === false, 'P3 desempleo debe devolver chart.render === false');

            const p2 = await client.query('¿Cómo se compara el PIB per cápita de Coyhaique respecto a Providencia?');
            assert(p2 && p2.reply, 'P2 sin reply');
            assert(/PIB/i.test(p2.reply) && /Providencia/i.test(p2.reply), 'P2 debe explicitar ausencia de PIB y Providencia: ' + p2.reply);
            assert(p2.reply.includes('SII') || p2.reply.includes('empresas'), 'P2 debe ofrecer proxy SII: ' + p2.reply);
            assert(p2.chart && p2.chart.singleComunaMode === true, 'P2 debe activar singleComunaMode para Coyhaique');
            assert(p2.chart.varX === 'empresas_sii' || p2.chart.varY === 'trabajadores_sii', 'P2 debe usar proxy SII');

            // 7. Reconciliacion de holdings salmoneros (P9.3)
            const p93 = client.resolveClosedWorldDeterministic('¿Cuántas concesiones y centros de cultivo tiene cada holding salmonero en Aysén?');
            assert(p93 && p93.chart && Array.isArray(p93.chart.holdingRows) && p93.chart.holdingRows.length === 12, 'P9.3 debe listar 12 holdings');
            const sum12 = p93.chart.holdingRows.reduce((s, row) => s + Number(row.concesiones || 0), 0);
            assert.strictEqual(sum12, 726, 'Los 12 holdings principales deben sumar 726 concesiones, got ' + sum12);
            assert(p93.reply.includes('726') && p93.reply.includes('745'), 'P9.3 reply debe reconciliar 726 y 745: ' + p93.reply);

            // 8. Multi-charts, Modo Comuna Unica y Consulta Nominal sin Grafico (Bloques 1 y 4)
            const lagoVerdePerfil = await client.query('cuéntame sobre Lago Verde');
            assert(lagoVerdePerfil && lagoVerdePerfil.chart && lagoVerdePerfil.chart.singleComunaMode === true, 'Perfil Lago Verde debe activar singleComunaMode');
            assert(Array.isArray(lagoVerdePerfil.chart.multiCharts) && lagoVerdePerfil.chart.multiCharts.length === 4, 'Perfil Lago Verde debe generar 4 multiCharts');

            const corr3 = await client.query('¿Existe correlación entre las visitas a parques nacionales SNASPE, la biomasa de salmón cosechada y la esperanza de vida al nacer por comuna?');
            assert(corr3 && corr3.chart && Array.isArray(corr3.chart.multiCharts) && corr3.chart.multiCharts.length === 2, 'Correlacion 3 variables debe generar 2 multiCharts');
            assert(corr3.reply.includes('Prom: 80,3') || corr3.reply.includes('80,3'), 'Correlacion 3 variables debe reportar promedio 80,3 para esperanza de vida: ' + corr3.reply);

            const nominalAlcalde = await client.query('¿Quién es el alcalde de Lago Verde?');
            assert(nominalAlcalde && nominalAlcalde.chart && nominalAlcalde.chart.render === false, 'Consulta nominal de alcalde debe devolver chart.render === false');

            const c01Canon = await client.query('¿Cuáles son las comunas con mayor dependencia del Fondo Común Municipal y cómo se comparan con sus ingresos propios?');
            assert(c01Canon && c01Canon.chart && c01Canon.chart.render === true, 'Consulta 01 canonica debe renderizar');
            const c01CanonVars = [c01Canon.chart.varX, c01Canon.chart.varY];
            assert(c01CanonVars.includes('dependencia_fcm_pct') && c01CanonVars.includes('ipp_per_capita_clp'), 'Consulta 01 canonica vars: ' + c01CanonVars.join(','));

            const c01Gasto = await client.query('¿Las comunas más dependientes del FCM muestran un gasto municipal per cápita mayor o menor que las menos dependientes?');
            assert(c01Gasto && c01Gasto.chart && c01Gasto.chart.render === true, 'Consulta FCM vs gasto debe renderizar');
            const c01GastoVars = [c01Gasto.chart.varX, c01Gasto.chart.varY];
            assert(c01GastoVars.includes('dependencia_fcm_pct') && c01GastoVars.includes('presupuesto_per_capita_mclp'), 'Consulta FCM vs gasto vars: ' + c01GastoVars.join(','));

            const c02 = await client.query('¿Cuál es la tendencia temporal del turismo en Aysén desde 2018 hasta 2026?');
            assert(c02 && c02.chart && c02.chart.type === 'line', 'Consulta 02 debe usar grafico de linea temporal');
            assert(!/no (?:dispone|cuenta con) (?:de )?(?:serie|datos anuales)/i.test(c02.reply), 'Consulta 02 no debe negar serie anual: ' + c02.reply);

            console.log('AUDITORIA_9_CASOS_BLOQUES_1_A_4_OK');
        })().catch(err => {
            console.error(err);
            process.exit(1);
        });
        """
        proc = subprocess.run(
            ["node", "-e", node_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        self.assertEqual(proc.returncode, 0, f"Error en test_29:\n{proc.stderr}\n{proc.stdout}")
        self.assertIn("AUDITORIA_9_CASOS_BLOQUES_1_A_4_OK", proc.stdout)


if __name__ == "__main__":
    unittest.main()

