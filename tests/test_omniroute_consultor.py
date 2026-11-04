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
        self.assertIn("btnChartBar", html)
        self.assertIn("btnChartLine", html)
        self.assertIn("btnChartScatter", html)
        self.assertIn("btnToggleCoyhaique", html)
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
        if (idx.fuentes.length !== 28) {
            console.error('Fuentes count != 28:', idx.fuentes.length);
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
        if (!rUnknown.reply.includes('no forma parte de las 28 fuentes oficiales')) {
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


if __name__ == "__main__":
    unittest.main()

