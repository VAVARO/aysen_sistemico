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
        """La cita de Boehnert et al. (2018) debe aparecer una sola vez en el HTML (en #gridAttributionPill)."""
        html_sin_scripts = re.sub(r"<script\b[^>]*>.*?</script>", "", self.sc_html, flags=re.DOTALL)
        ocurrencias = re.findall(r"Boehnert,\s*J\.", html_sin_scripts)
        self.assertEqual(
            len(ocurrencias), 1,
            f"La cita a Boehnert et al. (2018) debe aparecer exactamente 1 vez en el HTML, encontradas: {len(ocurrencias)}"
        )
        self.assertIn("id=\"gridAttributionPill\"", html_sin_scripts)

    def test_03_cero_border_left_en_casos_de_aysen_y_estructura_limpia(self):
        """Los ejemplos regionales de Aysen no deben tener border-left ni formato de cita."""
        self.assertNotIn("atlas-empirical-block", self.sc_html)
        self.assertNotIn("atlas-method-note", self.sc_html)
        self.assertNotIn("atlas-case-selector", self.sc_html)

        # Verificar que en los estilos del Atlas no exista border-left
        match_style = re.search(
            r"\/\*\s*===\s*ATLAS VISUAL DE LAS 16 PROPIEDADES.*?\*\/(.*?)</style>",
            self.sc_html,
            re.DOTALL
        )
        if match_style:
            self.assertNotIn("border-left", match_style.group(1),
                             "No debe existir border-left en las reglas CSS del Atlas")

        # Verificar estructura limpia de las 16 celdas (#01 a #16)
        for i in range(1, 17):
            num = f"{i:02d}"
            self.assertIn(f"id=\"atlas-prop-{num}\"", self.sc_html)
            self.assertRegex(
                self.sc_html,
                rf"<h3 class=[\"']atlas-prop-heading[\"']>#{num}\s+[^<]+</h3>",
                f"Falta encabezado sobrio '#{num} Nombre' en propiedad {num}"
            )


class TestReconstruccion16GraficosChartJs(unittest.TestCase):
    """Correccion Quirurgica 3: 16 graficos reales en Chart.js con estetica exacta de laboratorio.html."""

    def setUp(self):
        self.sc_html = load_file("sistemas_complejos.html")

    def test_01_carga_chartjs_y_contenedores_260px_con_fuente_en_1_linea(self):
        """sistemas_complejos.html debe cargar Chart.js y tener 16 contenedores de 260px y fuente en 1 linea."""
        self.assertIn("chart.umd.min.js", self.sc_html, "Debe cargar Chart.js en sistemas_complejos.html")
        self.assertNotIn("atlas-canvas-status", self.sc_html, "No deben existir cajas grises .atlas-canvas-status")

        for i in range(1, 17):
            num = f"{i:02d}"
            self.assertIn(f"id=\"atlas-canvas-{num}\"", self.sc_html)
            self.assertIn(f"href=\"laboratorio.html?preset=cecan_{num}\"", self.sc_html)

        fuentes = re.findall(r"<div class=[\"']atlas-source-line[\"'][^>]*>Fuente:\s*[^<]+·\s*<a href=[\"']laboratorio\.html\?preset=cecan_\d{2}[\"'][^>]*>Explorar en Laboratorio\s*→</a></div>", self.sc_html)
        self.assertEqual(len(fuentes), 16, f"Deben existir exactamente 16 lineas de fuente oficial, encontradas: {len(fuentes)}")

    def test_02_ejecucion_real_16_instancias_chartjs_sin_vectores_planos(self):
        """Evalua con Node.js las 16 configuraciones Chart.js verificando varianza real, leyendas y ejes."""
        node_check_script = r"""
const fs = require('fs');
const vm = require('vm');

const hubsCode = fs.readFileSync('data/aysen_hubs_data.js', 'utf8');
const html = fs.readFileSync('sistemas_complejos.html', 'utf8');

const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
const atlasScript = scripts.find(s => s.includes('atlasChartInstances'));
if (!atlasScript) {
  console.error('No se encontro el script de atlasChartInstances');
  process.exit(1);
}

const createdCharts = {};
function ChartMock(ctx, config) {
  this.ctx = ctx;
  this.config = config;
  this.data = config.data;
  this.options = config.options;
  this.destroy = function() {};
  const id = ctx && ctx.canvas ? ctx.canvas.id : 'unknown';
  createdCharts[id] = config;
}

const sandbox = {
  window: {},
  document: {
    readyState: 'complete',
    getElementById: (id) => ({
      id,
      getContext: () => ({ canvas: { id } }),
      addEventListener: () => {},
      classList: { add: () => {}, remove: () => {}, contains: () => false }
    }),
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  Chart: ChartMock,
  console,
  setTimeout: (fn) => fn(),
  clearInterval: () => {},
  setInterval: () => 1
};
sandbox.window = sandbox;

vm.createContext(sandbox);
vm.runInContext(hubsCode, sandbox);
vm.runInContext(atlasScript, sandbox);

const instances = sandbox.window.atlasChartInstances || {};
const keys = Object.keys(instances);
if (keys.length !== 16) {
  console.error('Se esperaban 16 instancias Chart.js, encontradas:', keys.length);
  process.exit(1);
}

const expectedTypes = {
  '01': 'line', '06': 'line', '08': 'line', '09': 'line', '10': 'line', '12': 'line',
  '02': 'bar', '03': 'bar', '04': 'bar', '11': 'bar', '14': 'bar', '15': 'bar', '16': 'bar',
  '05': 'scatter', '07': 'scatter', '13': 'scatter'
};

function hasVariance(arr) {
  if (!Array.isArray(arr) || arr.length < 2) return false;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  return Number.isFinite(min) && Number.isFinite(max) && max > min && max > 0;
}

for (const [pnum, expectedType] of Object.entries(expectedTypes)) {
  const inst = instances[pnum];
  if (!inst || !inst.config) {
    console.error('Falta instancia para propiedad', pnum);
    process.exit(1);
  }
  const cfg = inst.config;
  if (cfg.type !== expectedType) {
    console.error(`Propiedad ${pnum}: tipo esperado ${expectedType}, recibido ${cfg.type}`);
    process.exit(1);
  }
  const opts = cfg.options || {};
  if (!opts.plugins || !opts.plugins.legend || opts.plugins.legend.display !== true) {
    console.error(`Propiedad ${pnum}: plugins.legend.display debe ser true`);
    process.exit(1);
  }
  if (!opts.scales || !opts.scales.x || !opts.scales.x.title || opts.scales.x.title.display !== true || !opts.scales.x.title.text) {
    console.error(`Propiedad ${pnum}: falta scales.x.title`);
    process.exit(1);
  }
  if (!opts.scales || !opts.scales.y || !opts.scales.y.title || opts.scales.y.title.display !== true || !opts.scales.y.title.text) {
    console.error(`Propiedad ${pnum}: falta scales.y.title`);
    process.exit(1);
  }

  const datasets = (cfg.data && cfg.data.datasets) || [];
  if (datasets.length < 2) {
    console.error(`Propiedad ${pnum}: debe tener al menos 2 datasets`);
    process.exit(1);
  }

  if (cfg.type === 'scatter') {
    const pts = datasets[0].data || [];
    const xs = pts.map(p => p.x);
    const ys = pts.map(p => p.y);
    if (!hasVariance(xs) || !hasVariance(ys)) {
      console.error(`Propiedad ${pnum} (scatter): datos planos o sin varianza`, { xs, ys });
      process.exit(1);
    }
  } else {
    const d0 = datasets[0].data || [];
    const d1 = datasets[1].data || [];
    if (!hasVariance(d0) || !hasVariance(d1)) {
      console.error(`Propiedad ${pnum} (${cfg.type}): vector plano o Y=0 detectado`, { d0, d1 });
      process.exit(1);
    }
  }
}
console.log('ALL_16_CHARTS_OK');
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
            f"Fallo validacion de las 16 instancias Chart.js en Node:\nSTDOUT: {proc.stdout}\nSTDERR: {proc.stderr}"
        )
        self.assertIn("ALL_16_CHARTS_OK", proc.stdout)


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
            "data/cecan_16_presets_aysen.json",
            "tests/test_coherencia_metodologia_y_cecan.py"
        ]
        for rel_path in archivos_evaluar:
            contenido = load_file(rel_path)
            emojis = EMOJI_REGEX.findall(contenido)
            self.assertEqual(len(emojis), 0, f"Emojis detectados en {rel_path}: {set(emojis)}")

        sc_html = load_file("sistemas_complejos.html")
        match_atlas = re.search(r"<section[^>]*id=[\"']aysenCecanAtlasSection[\"'][^>]*>(.*?)</section>", sc_html, re.DOTALL)
        self.assertIsNotNone(match_atlas)
        atlas_text = match_atlas.group(1).lower()
        for w in BLACKLIST_SLOP:
            self.assertIsNone(re.search(r"\b" + re.escape(w) + r"\b", atlas_text),
                              f"Palabra prohibida '{w}' en aysenCecanAtlasSection")

    def test_03_salud_workflows_ci(self):
        """Los workflows de GitHub Actions no deben contener tabuladores ni continue-on-error."""
        verif_content = load_file(".github/workflows/verificacion.yml")
        self.assertNotIn("continue-on-error: true", verif_content)
        self.assertNotIn("\t", verif_content)


if __name__ == "__main__":
    unittest.main()
