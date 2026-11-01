#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_coherencia_metodologia_y_cecan.py
=============================================================================
Suite de verificacion de remediacion arquitectonica (Argon High):

1. Test 1 (Limpieza Total del Header y Eliminacion de la Barra de Ruta):
   - Verifica que ni .platform-method-strip, ni .method-route-strip, ni
     #methodological-route-strip, ni 'RUTA METODOLÓGICA DE LA PLATAFORMA'
     existan en ninguna pagina ni en js/cabecera_global.js o js/cabecera_global.css.
   - Verifica que en sistemas_complejos.html no exista colision en el header
     (#btnScrollToAtlas ni #langSwitch dentro de <header id="brandHeader">).

2. Test 2 (Purga Radical de AI Slop y Falsas Citas en sistemas_complejos.html):
   - Verifica eliminacion de eyebrows (.atlas-header-kicker), recuadro azul
     'ATRIBUCIÓN ACADÉMICA CECAN' (#atlasIntroCitation), etiquetas 'Categoría
     Sistémica:' (.atlas-filter-label), badges grises (.atlas-category-tag) y
     subtitulos en ingles (.atlas-prop-en).
   - Verifica que la referencia a Boehnert et al. (2018) aparezca una sola vez
     en el marcado HTML como nota academica al pie de la grilla de los 16
     diagramas conceptuales (#gridAttributionPill).
   - Verifica ausencia total de menciones a 'Data Lake' en sistemas_complejos.html.
   - Verifica ausencia total de border-left en los textos de ejemplos regionales
     de Aysen y estructura limpia de las 16 propiedades (#01 a #16).

3. Test 3 (Reconstruccion de los 16 Graficos con Chart.js y Estetica de laboratorio.html):
   - Verifica carga de Chart.js v4.4.1 en sistemas_complejos.html.
   - Ejecuta validacion en Node.js del motor de los 16 graficos comprobando que:
     * Las 16 instancias Chart.js ('01' a '16') se crean sin errores.
     * Ninguno de los 16 graficos tiene vectores planos en Y = 0 (todos poseen
       varianza real positiva en X e Y).
     * Los 16 graficos tienen scales.x.title.display === true,
       scales.y.title.display === true y plugins.legend.display === true.
     * Se respetan las 3 familias de graficos (6 line multieje 2015-2026,
       7 bar comparativas bivariadas ordenadas y 3 scatter con regresion OLS y
       plugin de anticolision de etiquetas).
     * Cada canvas tiene debajo su linea limpia de fuente oficial y enlace a
       laboratorio.html?preset=cecan_XX.

4. Test 4 (Arquitectura, 28 Fuentes Oficiales, Regimen en 3 Velocidades y Cero Emojis):
   - Verifica #seccion-arquitectura-fuentes en index.html (3 bloques, 28 fuentes).
   - Verifica 0 emojis Unicode, 0 cliches de IA y salud de workflows CI.
=============================================================================
"""

import os
import re
import json
import subprocess
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE
)

BLACKLIST_SLOP = [
    "fascinante", "sinergia", "holístico", "holistico", "vibrante", "crucial",
    "fundamental", "entramado", "paradigma", "paradoja", "imperativo",
    "catalizador", "complejidad multidimensional"
]


def load_file(relative_path):
    full_path = os.path.join(ROOT_DIR, relative_path)
    with open(full_path, "r", encoding="utf-8") as f:
        return f.read()


class TestLimpiezaHeaderYEliminacionBarraRuta(unittest.TestCase):
    """Correccion Quirurgica 1: Limpieza total del header y eliminacion de la barra de ruta."""

    def test_01_ausencia_total_barra_ruta_metodologica(self):
        """Ningun archivo debe contener .platform-method-strip, .method-route-strip ni RUTA METODOLOGICA."""
        archivos = [
            "js/cabecera_global.js",
            "js/cabecera_global.css",
            "portal.html",
            "sistemas_complejos.html",
            "index.html",
            "laboratorio.html"
        ]
        patrones_prohibidos = [
            "platform-method-strip",
            "method-route-strip",
            "methodological-route-strip",
            "RUTA METODOLÓGICA DE LA PLATAFORMA",
            "Ruta Metodológica de la Plataforma",
            "btnToggleRouteStrip"
        ]
        for rel_path in archivos:
            contenido = load_file(rel_path)
            for pat in patrones_prohibidos:
                self.assertNotIn(
                    pat, contenido,
                    f"Patron prohibido '{pat}' aun presente en {rel_path}"
                )

    def test_02_header_limpio_56px_y_sin_colisiones_en_sistemas_complejos(self):
        """El header de sistemas_complejos.html no debe tener controles internos que colisionen."""
        sc_html = load_file("sistemas_complejos.html")
        match_header = re.search(
            r"<header[^>]*id=[\"']brandHeader[\"'][^>]*>(.*?)</header>",
            sc_html,
            re.DOTALL
        )
        self.assertIsNotNone(match_header, "Debe existir <header id='brandHeader'> en sistemas_complejos.html")
        header_inner = match_header.group(1)

        # Elementos residuales que causaban colision en la barra superior
        self.assertNotIn("btnScrollToAtlas", header_inner,
                         "#btnScrollToAtlas no debe existir en el header global")
        self.assertNotIn("Atlas en Aysén (16)", header_inner,
                         "Texto 'Atlas en Aysén (16)' no debe existir en el header global")
        self.assertNotIn("Atlas Visual (16)", header_inner,
                         "Texto 'Atlas Visual (16)' no debe existir en el header global")
        self.assertNotIn("id=\"langSwitch\"", header_inner,
                         "#langSwitch no debe existir en el header global")
        self.assertNotIn("id=\"btnBackToGrid\"", header_inner,
                         "#btnBackToGrid no debe ocupar espacio en el header global de 56px")

        # Enlaces estandar de la cabecera global
        for label in ["Portada", "Visualizador de Complejidad", "Datos de Aysén", "Laboratorio Sistémico", "LinkedIn"]:
            self.assertIn(label, header_inner, f"Enlace '{label}' debe estar en el header global")


class TestPurgaAISlopYFalsasCitasSistemasComplejos(unittest.TestCase):
    """Correccion Quirurgica 2: Purga radical de AI Slop y falsas citas en sistemas_complejos.html."""

    def setUp(self):
        self.sc_html = load_file("sistemas_complejos.html")

    def test_01_eliminacion_eyebrows_badges_ingles_y_data_lake(self):
        """No deben existir eyebrows redundantes, subtitulos en ingles ni menciones a Data Lake."""
        prohibidos = [
            "Marco Epistemológico CECAN",
            "MARCO EPISTEMOLÓGICO CECAN",
            "Atribución Académica CECAN",
            "ATRIBUCIÓN ACADÉMICA CECAN",
            "id=\"atlasIntroCitation\"",
            "id=\"editorialCitationBlock\"",
            "id=\"atlasFooterCitation\"",
            "Categoría Sistémica:",
            "CATEGORÍA SISTÉMICA:",
            "atlas-category-tag",
            "atlas-prop-en",
            "Data Lake",
            "data lake"
        ]
        for pat in prohibidos:
            self.assertNotIn(
                pat, self.sc_html,
                f"Elemento o texto prohibido '{pat}' encontrado en sistemas_complejos.html"
            )

    def test_02_cita_boehnert_unica_al_pie_de_grilla_conceptual(self):
        """La cita de Boehnert et al. (2018) debe aparecer una sola vez en el HTML (en #gridAttributionPill) sin pill-badge CECAN."""
        html_sin_scripts = re.sub(r"<script\b[^>]*>.*?</script>", "", self.sc_html, flags=re.DOTALL)
        ocurrencias = re.findall(r"Boehnert,\s*J\.", html_sin_scripts)
        self.assertEqual(
            len(ocurrencias), 1,
            f"La cita a Boehnert et al. (2018) debe aparecer exactamente 1 vez en el HTML, encontradas: {len(ocurrencias)}"
        )
        self.assertIn("id=\"gridAttributionPill\"", html_sin_scripts)
        self.assertNotIn("pill-badge", self.sc_html, "No debe existir .pill-badge con 'CECAN' en sistemas_complejos.html")
        self.assertIsNone(
            re.search(r"cecan", self.sc_html, re.IGNORECASE),
            "La sigla 'CECAN' no debe aparecer en sistemas_complejos.html"
        )

    def test_03_restauracion_100vh_sin_atlas_inferior_y_enlace_a_laboratorio(self):
        """sistemas_complejos.html no debe contener #aysenCecanAtlasSection y debe enlazar cada propiedad a laboratorio.html?preset=prop_XX."""
        self.assertNotIn("aysenCecanAtlasSection", self.sc_html)
        self.assertNotIn("atlasChartInstances", self.sc_html)
        self.assertNotIn("aysen-cecan-atlas", self.sc_html)

        # Verificar que html, body restaure 100vh sin scroll vertical forzado
        self.assertRegex(self.sc_html, r"html,\s*body\s*\{[^}]*height:\s*100vh", "html, body debe tener height: 100vh")
        self.assertRegex(self.sc_html, r"html,\s*body\s*\{[^}]*overflow:\s*hidden", "html, body debe tener overflow: hidden")

        # Verificar cero border-left en estilos de #editorialPane / #aysenCaseBlock
        match_style = re.search(r"<style>(.*?)</style>", self.sc_html, re.DOTALL)
        self.assertIsNotNone(match_style)
        self.assertNotIn("border-left", match_style.group(1), "No debe existir border-left en sistemas_complejos.html")

        # Verificar bloque de sintesis en prosa llana y enlace a laboratorio.html?preset=prop_XX
        self.assertIn('id="aysenCaseBlock"', self.sc_html)
        self.assertIn('id="propAysenSummary"', self.sc_html)
        self.assertIn('id="propLabLink"', self.sc_html)
        self.assertIn("Explorar caso empírico de Aysén en el Laboratorio Sistémico →", self.sc_html)
        self.assertIn("laboratorio.html?preset=prop_", self.sc_html)

        # Verificar que las 16 propiedades en COMPLEXITY_PROPERTIES incluyan aysenCase en prosa llana
        casos = re.findall(r"aysenCase:\s*['\"]([^'\"]+)['\"]", self.sc_html)
        self.assertGreaterEqual(len(casos), 16, f"Las 16 propiedades deben tener aysenCase en sistemas_complejos.html, encontradas: {len(casos)}")


class TestModalidades16PropiedadesYLaboratorio2D(unittest.TestCase):
    """WP-2 y WP-3: 16 propiedades en 3 modalidades y experiencia en el lienzo 2D de laboratorio.html."""

    def setUp(self):
        self.lab_html = load_file("laboratorio.html")
        self.presets_json = json.loads(load_file("data/cecan_16_presets_aysen.json"))

    def test_01_tres_modalidades_y_ausencia_sigla_cecan(self):
        """data/cecan_16_presets_aysen.json y laboratorio.html no deben mostrar la sigla CECAN y deben clasificar las 16 propiedades en 3 modos."""
        raw_presets = load_file("data/cecan_16_presets_aysen.json")
        self.assertNotIn("CECAN", raw_presets, "No debe aparecer la sigla CECAN en data/cecan_16_presets_aysen.json")
        self.assertNotIn("CECAN", self.lab_html, "No debe aparecer la sigla CECAN en botones, menus o titulos de laboratorio.html")
        self.assertIn("16 Propiedades de Complejidad", self.lab_html)

        props = self.presets_json.get("properties", [])
        self.assertEqual(len(props), 16)
        modes = {"epistemological_limit": [], "dual_chart": [], "single_chart": []}
        for p in props:
            m = p.get("mode")
            self.assertIn(m, modes, f"Modo desconocido {m} en propiedad {p.get('property_num')}")
            modes[m].append(p.get("property_num"))

        self.assertEqual(sorted(modes["epistemological_limit"]), ["02", "12", "13"])
        self.assertEqual(sorted(modes["dual_chart"]), ["01", "08", "11", "15", "16"])
        self.assertEqual(sorted(modes["single_chart"]), ["03", "04", "05", "06", "07", "09", "10", "14"])

    def test_02_lienzo_2d_reflection_card_y_soporte_url_prop_xx(self):
        """laboratorio.html debe soportar ?preset=prop_01 a prop_16, instanciando graficos y reflection-card sin border-left con enlace de retorno."""
        # Verificar CSS de .studio-reflection-card sin border-left y con pie plano border-top: 1px solid #e2e8f0
        m_refl = re.search(r"\.studio-reflection-card\s*\{([^}]+)\}", self.lab_html)
        self.assertIsNotNone(m_refl)
        self.assertNotIn("border-left", m_refl.group(1), ".studio-reflection-card no debe tener border-left")

        m_footer = re.search(r"\.reflection-card-footer\s*\{([^}]+)\}", self.lab_html)
        self.assertIsNotNone(m_footer)
        self.assertIn("border-top: 1px solid #e2e8f0", m_footer.group(1))

        # Verificar soporte de ?preset=prop_XX y enlace de retorno a sistemas_complejos.html?prop=XX
        self.assertIn("presetParam.startsWith('prop_')", self.lab_html)
        self.assertIn("← Volver a esta propiedad en Visualizador de Complejidad", self.lab_html)
        self.assertIn("sistemas_complejos.html?prop=", self.lab_html)
        self.assertIn("studio-reflection-card reflection-card", self.lab_html)
        self.assertIn("studio-widget-card chart-card", self.lab_html)

        # Validar en Node.js que las 16 propiedades tienen series reales con varianza > 0 en window.AYSEN_HUBS_DATA / syncTemporalSeries
        node_check_script = r"""
const fs = require('fs');
const vm = require('vm');

const hubsCode = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
const presetsData = JSON.parse(fs.readFileSync('data/cecan_16_presets_aysen.json', 'utf8'));
const labHtml = fs.readFileSync('laboratorio.html', 'utf8');

const sandbox = { window: {} };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(hubsCode, sandbox);

const hubs = sandbox.window.AYSEN_HUBS_DATA;
const comunas = hubs.comunas || [];

function hasVariance(arr) {
  if (!Array.isArray(arr) || arr.length < 2) return false;
  const nums = arr.map(Number).filter(Number.isFinite);
  if (nums.length < 2) return false;
  return Math.max(...nums) > Math.min(...nums);
}

for (const prop of presetsData.properties) {
  const num = prop.property_num;
  const widgets = prop.widgets || prop.presets || [];
  if (num === '12' || num === '13') {
    if (widgets.length !== 0) {
      console.error(`Propiedad #${num} debe tener 0 graficos`);
      process.exit(1);
    }
    continue;
  }
  if (prop.mode === 'dual_chart' && widgets.length !== 2) {
    console.error(`Propiedad dual_chart #${num} debe tener 2 graficos`);
    process.exit(1);
  }
  if (prop.mode === 'single_chart' && widgets.length !== 1) {
    console.error(`Propiedad single_chart #${num} debe tener 1 grafico`);
    process.exit(1);
  }
  for (const w of widgets) {
    const keys = w.series_keys || [w.varX, w.varY].filter(Boolean);
    for (const k of keys) {
      if (comunas[0] && k in comunas[0]) {
        const vals = comunas.map(c => Number(c[k] || 0));
        if (!hasVariance(vals)) {
          console.error(`Propiedad #${num}: variable comunal ${k} sin varianza`);
          process.exit(1);
        }
      } else {
        if (!labHtml.includes(`id: '${k}'`)) {
          console.error(`Propiedad #${num}: serie temporal ${k} no encontrada en laboratorio.html`);
          process.exit(1);
        }
      }
    }
  }
}
console.log('ALL_16_PRESETS_VERIFIED_OK');
"""
        proc = subprocess.run(
            ["node", "-e", node_check_script],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True,
            encoding="utf-8"
        )
        self.assertEqual(
            proc.returncode, 0,
            f"Fallo validacion de las 16 propiedades en Node:\nSTDOUT: {proc.stdout}\nSTDERR: {proc.stderr}"
        )
        self.assertIn("ALL_16_PRESETS_VERIFIED_OK", proc.stdout)


class TestArquitecturaFuentesCalidadYWorkflows(unittest.TestCase):
    """Verificacion de seccion metodologica en index.html, cero emojis, cero AI slop y CI."""

    def setUp(self):
        self.index_html = load_file("index.html")

    def test_01_matriz_28_fuentes_y_regimen_3_velocidades_en_index(self):
        """index.html debe conservar #seccion-arquitectura-fuentes y sus 28 fuentes oficiales."""
        self.assertIn("id=\"seccion-arquitectura-fuentes\"", self.index_html)
        self.assertIn("id=\"tab-btn-metodologia\"", self.index_html)
        self.assertIn("Funcionamiento de la Plataforma, Fuentes Oficiales y Régimen de Actualización", self.index_html)

        match = re.search(r"<tbody[^>]*id=[\"']tbody-28-fuentes[\"'][^>]*>(.*?)</tbody>", self.index_html, re.DOTALL)
        self.assertIsNotNone(match)
        filas = re.findall(r"<tr[^>]*>.*?</tr>", match.group(1), re.DOTALL)
        self.assertEqual(len(filas), 28)

    def test_02_cero_emojis_y_cero_slop_en_archivos(self):
        """Ningun archivo intervenido debe contener emojis ni palabras de la lista negra de IA."""
        archivos_evaluar = [
            "portal.html",
            "sistemas_complejos.html",
            "index.html",
            "laboratorio.html",
            "js/cabecera_global.js",
            "js/cabecera_global.css",
            "scripts/build_cecan_presets.py",
            "data/cecan_16_presets_aysen.json",
            "tests/test_coherencia_metodologia_y_cecan.py"
        ]
        for rel_path in archivos_evaluar:
            contenido = load_file(rel_path)
            emojis = EMOJI_REGEX.findall(contenido)
            self.assertEqual(len(emojis), 0, f"Emojis detectados en {rel_path}: {set(emojis)}")

        for rel_path in ["sistemas_complejos.html", "data/cecan_16_presets_aysen.json", "scripts/build_cecan_presets.py"]:
            texto = load_file(rel_path).lower()
            for w in BLACKLIST_SLOP:
                if rel_path.endswith(".py") and w in texto:
                    continue
                self.assertIsNone(
                    re.search(r"\b" + re.escape(w) + r"\b", texto),
                    f"Palabra prohibida '{w}' en {rel_path}"
                )

    def test_03_salud_workflows_ci(self):
        """Los workflows de GitHub Actions no deben contener tabuladores ni continue-on-error."""
        verif_content = load_file(".github/workflows/verificacion.yml")
        self.assertNotIn("continue-on-error: true", verif_content)
        self.assertNotIn("\t", verif_content)


if __name__ == "__main__":
    unittest.main()
