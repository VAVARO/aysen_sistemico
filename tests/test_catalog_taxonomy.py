#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_catalog_taxonomy.py
=============================================================================
Suite de validacion para la reorganizacion taxonomica, renominacion clara y
subcategorizacion (10 Hubs, 41 Nodos Satelite, 30 Subcategorias subGroup) de
Aysen Sistemico:
1. 41 nodos unicos en AYSEN_HUBS_DATA.nodos (sin colision #24/#38) + Hubs VI/VII.
2. Unificacion exacta de 10 hubId canonicos en AppState.catalogItems (sin
   cultura_patrimonio ni ctci_innovacion sueltas).
3. Reubicacion de las 18+ variables mal clasificadas y marcado de alias.
4. CLEAR_VAR_LABELS, BARO_HIST_TITLES y correccion de unidades (0 'unidades' o
   'horas/ano' erroneas).
5. Asignacion completa de las 30 subcategorias (subGroup, 3 por Hub) y filtrado
   reactivo en #variablesTreeContainer y #smartPopover / #smartPopoverSearch.
6. Cero emojis y sincronizacion con CANONICAL_LABELS de js/omniroute_client.js.
=============================================================================
"""

import json
import os
import re
import subprocess
import tempfile
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

EMOJI_REGEX = re.compile(
    r"[\U00010000-\U0010ffff]|[\u2600-\u27ff]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\u200d\ufe0f]",
    flags=re.UNICODE,
)


def extract_lab_main_script():
    lab_path = os.path.join(ROOT_DIR, "laboratorio.html")
    with open(lab_path, "r", encoding="utf-8") as f:
        html = f.read()
    scripts = re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", html, flags=re.S)
    for sc in scripts:
        if "const AppState =" in sc and "async function loadDataLakeAndCatalog()" in sc:
            return sc
    raise RuntimeError("No se encontro el script principal de laboratorio.html")


class TestCatalogTaxonomy(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.main_script = extract_lab_main_script()

        harness = r"""
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = %s;

function makeMockEl(id) {
  const listeners = {};
  const attrs = {};
  const classes = new Set();
  const el = {
    id: id || '',
    value: '',
    innerHTML: '',
    textContent: '',
    style: {},
    classList: {
      add: (c) => classes.add(c),
      remove: (c) => classes.delete(c),
      contains: (c) => classes.has(c),
      toggle: (c) => classes.has(c) ? classes.delete(c) : classes.add(c)
    },
    setAttribute: (k, v) => { attrs[k] = String(v); },
    getAttribute: (k) => attrs[k] || null,
    addEventListener: (ev, fn) => {
      if (!listeners[ev]) listeners[ev] = [];
      listeners[ev].push(fn);
    },
    dispatchEvent: (ev) => {
      const fns = listeners[ev.type] || [];
      fns.forEach(fn => fn(ev));
    },
    trigger: (evName) => {
      const fns = listeners[evName] || [];
      fns.forEach(fn => fn({ type: evName, stopPropagation: () => {}, preventDefault: () => {} }));
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    focus: () => {},
    getBoundingClientRect: () => ({ left: 100, right: 200, top: 100, bottom: 130, width: 100, height: 30 })
  };
  return el;
}

const domMap = {
  variablesTreeContainer: makeMockEl('variablesTreeContainer'),
  smartPopover: makeMockEl('smartPopover'),
  popoverListContainer: makeMockEl('popoverListContainer'),
  smartPopoverSearch: makeMockEl('smartPopoverSearch'),
  smartPopoverCount: makeMockEl('smartPopoverCount'),
  inputBuscarVariable: makeMockEl('inputBuscarVariable'),
  canvasGridStage: makeMockEl('canvasGridStage'),
  heroEmptyCanvas: makeMockEl('heroEmptyCanvas'),
  cardActiveQuestion: makeMockEl('cardActiveQuestion'),
  accordionQuestionsContainer: makeMockEl('accordionQuestionsContainer')
};

const ctx = {
  console,
  Math,
  Date,
  JSON,
  Set,
  Map,
  Array,
  Object,
  Number,
  String,
  Boolean,
  RegExp,
  Promise,
  parseFloat,
  parseInt,
  isNaN,
  isFinite,
  encodeURIComponent,
  decodeURIComponent,
  setTimeout: (fn) => { if (typeof fn === 'function') fn(); return 1; },
  clearTimeout: () => {},
  fetch: async (relUrl) => {
    const cleanRel = String(relUrl).split('?')[0];
    const absPath = path.join(ROOT, cleanRel);
    if (!fs.existsSync(absPath)) {
      return { ok: false, status: 404, json: async () => ({}), text: async () => '' };
    }
    const raw = fs.readFileSync(absPath, 'utf8');
    return {
      ok: true,
      status: 200,
      json: async () => JSON.parse(raw),
      text: async () => raw
    };
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  navigator: { clipboard: { writeText: async () => {} } },
  document: {
    getElementById: (id) => {
      if (!domMap[id]) domMap[id] = makeMockEl(id);
      return domMap[id];
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: (tag) => makeMockEl(tag),
    body: makeMockEl('body'),
    addEventListener: () => {}
  },
  DOMParser: class {
    parseFromString() { return { body: makeMockEl('parsed') }; }
  }
};
ctx.window = ctx;
ctx.globalThis = ctx;
ctx.innerWidth = 1440;
ctx.innerHeight = 900;
ctx.addEventListener = () => {};

// Load bundle and nl2chart engine
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data/aysen_hubs_data.js'), 'utf8'), ctx);
if (fs.existsSync(path.join(ROOT, 'js/nl2chart_engine.js'))) {
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js/nl2chart_engine.js'), 'utf8'), ctx);
}

const mainCode = fs.readFileSync(%s, 'utf8')
  .replace(/window\.addEventListener\('DOMContentLoaded',\s*init\);/g, `window.__TEST_API = {
    AppState,
    SUBGROUP_ORDER_BY_HUB,
    CLEAR_VAR_LABELS,
    BARO_HIST_TITLES,
    resolveCatalogSubGroup,
    loadDataLakeAndCatalog,
    renderSidebarCatalog,
    openSmartPopover,
    renderPopoverList
  };`);

vm.runInNewContext(mainCode, ctx);

(async () => {
  const api = ctx.__TEST_API;
  await api.loadDataLakeAndCatalog();

  const items = api.AppState.catalogItems || [];
  const nonAlias = items.filter(i => !i.isAlias);
  const aliasItems = items.filter(i => i.isAlias);

  // Full sidebar render (all dims)
  api.AppState.activeFilterDim = 'all';
  api.AppState.searchQuery = '';
  api.renderSidebarCatalog();
  const sidebarAllHtml = domMap.variablesTreeContainer.innerHTML;

  // Filtered sidebar render ("Guardaparque")
  api.AppState.searchQuery = 'Guardaparque';
  api.renderSidebarCatalog();
  const sidebarGuardHtml = domMap.variablesTreeContainer.innerHTML;

  // Filtered sidebar render by subGroup name ("Vialidad y Conectividad Multimodal")
  api.AppState.searchQuery = 'Vialidad y Conectividad Multimodal';
  api.renderSidebarCatalog();
  const sidebarSgHtml = domMap.variablesTreeContainer.innerHTML;

  // Popover "+ Cruzar" render and search
  api.AppState.searchQuery = '';
  const sampleWidget = { id: 'w1', varX: 'poblacion_censo_2024', varY: null };
  api.openSmartPopover(sampleWidget, null);
  const popoverAllHtml = domMap.popoverListContainer.innerHTML;

  domMap.smartPopoverSearch.value = 'Guardaparque';
  domMap.smartPopoverSearch.trigger('input');
  const popoverGuardHtml = domMap.popoverListContainer.innerHTML;
  const popoverGuardCount = domMap.smartPopoverCount.textContent;

  const summary = {
    nodosCount: ctx.AYSEN_HUBS_DATA.nodos.length,
    nodos: ctx.AYSEN_HUBS_DATA.nodos.map(n => ({ id: n.id, hubId: n.hubId, title: n.title })),
    hubs: ctx.AYSEN_HUBS_DATA.hubs.map(h => ({ id: h.id, title: h.title })),
    subGroupOrderByHub: api.SUBGROUP_ORDER_BY_HUB,
    clearVarLabels: api.CLEAR_VAR_LABELS,
    baroHistTitles: api.BARO_HIST_TITLES,
    fdtSubGroup: api.resolveCatalogSubGroup({ id: 'fdt_ultima_milla_aprobado', hubId: 'energia' }),
    nonAlias: nonAlias.map(i => ({ id: i.id, hubId: i.hubId, hubTitle: i.hubTitle, subGroup: i.subGroup, unit: i.unit, name: i.name, dim: i.dim })),
    aliasIds: aliasItems.map(i => ({ id: i.id, hubId: i.hubId, isAlias: i.isAlias })),
    sidebarAllHtml,
    sidebarGuardHtml,
    sidebarSgHtml,
    popoverAllHtml,
    popoverGuardHtml,
    popoverGuardCount
  };
  console.log(JSON.stringify(summary));
})().catch(err => {
  console.error(err);
  process.exit(1);
});
"""

        fd_js, path_js = tempfile.mkstemp(suffix=".js")
        os.close(fd_js)
        fd_runner, path_runner = tempfile.mkstemp(suffix=".js")
        os.close(fd_runner)
        try:
            with open(path_js, "w", encoding="utf-8") as f:
                f.write(cls.main_script)
            runner_code = harness % (json.dumps(ROOT_DIR), json.dumps(path_js))
            with open(path_runner, "w", encoding="utf-8") as f:
                f.write(runner_code)
            res = subprocess.run(
                ["node", path_runner],
                capture_output=True,
                text=True,
                encoding="utf-8",
                timeout=30,
            )
            if res.returncode != 0:
                raise RuntimeError(f"Node harness failed ({res.returncode}): {res.stderr}")
            cls.data = json.loads(res.stdout)
        finally:
            if os.path.exists(path_js):
                os.unlink(path_js)
            if os.path.exists(path_runner):
                os.unlink(path_runner)

    def test_01_41_unique_nodes_and_hub_titles(self):
        """Verifica 41 nodos sin colision de titulos (#24/#38) y nuevos titulos Hub VI/VII."""
        nodos = self.data["nodos"]
        self.assertEqual(len(nodos), 41, f"Se esperaban 41 nodos, hay {len(nodos)}")

        titles = [n["title"] for n in nodos]
        self.assertEqual(len(titles), len(set(titles)), f"Hay titulos duplicados en nodos: {titles}")

        by_id = {n["id"]: n for n in nodos}
        self.assertEqual(
            by_id[24]["title"],
            "Red Hospitalaria Regional y Camas Críticas (5 Hospitales · 261 Camas)",
        )
        self.assertEqual(
            by_id[38]["title"],
            "Atención Primaria Rural: 27 Postas (PSR), 20 EMR y Rondas Médicas",
        )
        self.assertEqual(
            by_id[32]["title"],
            "Patrimonio Protegido, Museos (RMC) y Bibliotecas (SNBP)",
        )
        self.assertEqual(
            by_id[34]["title"],
            "Infraestructura Cultural Comunitaria, Participación y Pueblos Originarios",
        )
        self.assertEqual(by_id[40]["hubId"], "gobernanza")
        self.assertEqual(
            by_id[40]["title"],
            "Red Vial Austral (Ruta 7), Conectividad Marítima y Aeródromos",
        )
        self.assertEqual(by_id[41]["hubId"], "social")
        self.assertEqual(
            by_id[41]["title"],
            "Déficit Habitacional (MINVU) y Sistemas Sanitarios Rurales (SSR/APR)",
        )

        hubs_by_id = {h["id"]: h["title"] for h in self.data["hubs"]}
        self.assertEqual(hubs_by_id["social"], "VI. Demografía, Educación, Vivienda & Cohesión")
        self.assertEqual(hubs_by_id["biodiversidad"], "VII. Biodiversidad, Clima & Riesgos Geológicos")

    def test_02_canonical_10_hubs_without_split_keys(self):
        """AppState.catalogItems sin alias debe agruparse exactamente en los 10 hubId canonicos."""
        expected_hubs = {
            "turismo", "salmonicultura", "energia", "gobernanza", "inversion",
            "social", "biodiversidad", "salud", "cultura", "ctci",
        }
        found_hubs = {it["hubId"] for it in self.data["nonAlias"]}
        self.assertEqual(found_hubs, expected_hubs, f"Hubs encontrados en catalogo: {sorted(found_hubs)}")
        self.assertNotIn("cultura_patrimonio", found_hubs)
        self.assertNotIn("ctci_innovacion", found_hubs)

    def test_03_relocated_variables_and_hidden_aliases(self):
        """Verifica la reubicacion de las variables mal clasificadas y el marcado de alias."""
        by_id = {it["id"]: it for it in self.data["nonAlias"]}
        expected_hubs = {
            # Turismo
            "tarifa_adr_emat_clp": "turismo",
            "revpar_emat_clp": "turismo",
            "estadia_promedio_dias": "turismo",
            "tasa_ocupacion_estival_pct": "turismo",
            "tasa_ocupacion_invernal_pct": "turismo",
            "concentracion_estival_pct": "turismo",
            "visitas_por_pernoctacion_ratio": "turismo",
            "ha_snaspe_por_guardaparque": "turismo",
            # Energia
            "penetracion_internet_fijo_subtel_pct_hist": "energia",
            # Gobernanza
            "largo_pista_aerodromo_m": "gobernanza",
            "operaciones_aerodromo_interior_anual": "gobernanza",
            "fondos_concursables_gore_2023_n": "gobernanza",
            "fondos_concursables_gore_2023_mclp": "gobernanza",
            "barometro_confianza_institucional_pct": "gobernanza",
            "barometro_confianza_institucional_pct_hist": "gobernanza",
            "barometro_prioridad_conectividad_pct": "gobernanza",
            "barometro_prioridad_conectividad_pct_hist": "gobernanza",
            "balmaceda_pasajeros_jac": "gobernanza",
            "tiempo_viaje_coyhaique_hrs": "gobernanza",
            # Biodiversidad
            "barometro_tension_desarrollo_conservacion_pct": "biodiversidad",
            "barometro_tension_desarrollo_conservacion_pct_hist": "biodiversidad",
            "mp25_coyhaique_mensual": "biodiversidad",
            # Social
            "juntas_vecinos_activas": "social",
            # Salud
            "traslado_coyhaique_hrs": "salud",
        }
        for var_id, exp_hub in expected_hubs.items():
            self.assertIn(var_id, by_id, f"Falta variable no-alias esperada: {var_id}")
            self.assertEqual(by_id[var_id]["hubId"], exp_hub, f"{var_id} en hub incorrecto: {by_id[var_id]['hubId']}")

        alias_id_set = {x["id"] for x in self.data["aliasIds"]}
        for hidden_k in (
            "tarifa_adr_estimada_usd", "revpar_estimado_usd",
            "hogares_sin_internet_fijo_pct", "ingresos_propios_pct", "fuga_compras_pct",
            "costo_kwh_termico_util_lena_clp", "costo_kwh_termico_util_kerosene_clp",
        ):
            self.assertIn(hidden_k, alias_id_set, f"Se esperaba {hidden_k} oculto como alias/complemento")

        self.assertEqual(
            self.data["clearVarLabels"]["fdt_ultima_milla_aprobado"]["hubId"],
            "energia",
            "fdt_ultima_milla_aprobado debe estar clasificada en energia",
        )
        self.assertEqual(
            self.data["fdtSubGroup"],
            "3C. Telecomunicaciones y Brecha Digital",
            "fdt_ultima_milla_aprobado debe resolverse en subGroup 3C",
        )

        # Alias que NO deben duplicarse como items primarios
        hidden_aliases = {
            "trafico_aereo_pasajeros_balmaceda_jac",
            "innovacion_corfo_mclp",
            "pobreza_ingresos_casen_pct",
            "pobreza_multidimensional_casen_pct",
            "gasto_cultural_per_capita_clp",
            "deficit_habitacional_cuantitativo_minvu",
            "deficit_habitacional_cualitativo_minvu",
            "comites_ssr_apr_doh",
            "beneficiarios_ssr_apr_doh",
            "cabezas_bovinos_caf",
            "cabezas_ovinos_caf",
            "consumo_lena_m3_hogar_anio",
        }
        for al in hidden_aliases:
            self.assertNotIn(al, by_id, f"El alias {al} no debe exponerse como item no-alias")

    def test_04_clear_labels_barometro_titles_and_units(self):
        """Verifica unidades limpias, 0 errores 'unidades'/'horas/ano' y titulos legibles de Barometro."""
        by_id = {it["id"]: it for it in self.data["nonAlias"]}

        for it in self.data["nonAlias"]:
            vid = it["id"]
            unit = it["unit"]
            if re.search(r"_pct(_[a-z0-9]+)?$", vid, re.I):
                self.assertIn("%", unit, f"{vid} tiene unidad {unit} en vez de %")
            if vid.endswith("_usd"):
                self.assertEqual(unit, "US$", f"{vid} unidad incorrecta: {unit}")
            if vid.endswith("_hrs"):
                self.assertEqual(unit, "horas", f"{vid} unidad incorrecta: {unit}")
            if vid != "saidi_horas_anual":
                self.assertNotEqual(unit, "horas/año", f"Unidad horas/ano inesperada en {vid}")

        exact_units = {
            "medicos_por_mil_hab": "médicos/1.000 hab",
            "ha_snaspe_por_guardaparque": "ha/guardaparque",
            "evaluacion_uaysen_promedio_i8": "nota (1-7)",
            "nota_percepcion_cultura_b4b": "nota (1-7)",
            "largo_pista_aerodromo_m": "metros",
            "operaciones_aerodromo_interior_anual": "operaciones/año",
            "dependencia_barcaza_nivel": "nivel (0-3)",
            "amerb_decretadas": "áreas",
            "amerb_operativas": "áreas",
            "espera_no_ges_n": "interconsultas",
            "establecimientos_escolares_n": "colegios",
            "establecimientos_slep_aysen": "colegios",
            "indice_envejecimiento": "adultos/100 niños",
            "indice_masculinidad": "hombres/100 mujeres",
            "daa_consuntivos_m3s": "m³/s",
            "daa_no_consuntivos_m3s": "m³/s",
            "total_proyectos_ctci": "proyectos",
            "proyectos_anid_n": "proyectos",
        }
        for vid, exp_u in exact_units.items():
            self.assertEqual(by_id[vid]["unit"], exp_u, f"Unidad esperada para {vid}: {exp_u}, obt: {by_id[vid]['unit']}")

        for b_key in self.data["baroHistTitles"]:
            self.assertIn(b_key, by_id, f"Falta serie historica {b_key}")
            self.assertTrue(
                by_id[b_key]["name"].startswith("Serie Barómetro (2018–2026): "),
                f"Titulo inesperado en {b_key}: {by_id[b_key]['name']}",
            )
            self.assertNotIn("Evolución Anual barometro", by_id[b_key]["name"])

    def test_05_30_subgroups_assigned_and_reactive_search(self):
        """Todos los 10 Hubs tienen exactamente 3 subGroups poblados y el filtrado reactivo funciona."""
        sg_order = self.data["subGroupOrderByHub"]
        self.assertEqual(len(sg_order), 10)
        all_valid_sgs = {sg for lst in sg_order.values() for sg in lst}
        self.assertEqual(len(all_valid_sgs), 30, "Deben existir exactamente 30 subcategorias")

        populated_by_hub = {h: set() for h in sg_order}
        for it in self.data["nonAlias"]:
            sg = it.get("subGroup")
            self.assertTrue(sg, f"Item {it['id']} no tiene subGroup asignado")
            self.assertIn(sg, sg_order[it["hubId"]], f"{it['id']} tiene subGroup '{sg}' ajeno a hub {it['hubId']}")
            populated_by_hub[it["hubId"]].add(sg)

        for hub_id, expected_sgs in sg_order.items():
            self.assertEqual(
                populated_by_hub[hub_id],
                set(expected_sgs),
                f"Hub {hub_id} no poblo sus 3 subGroups completos: {populated_by_hub[hub_id]}",
            )

        # Render completo en sidebar contiene los 30 subgrupos
        sidebar_all = self.data["sidebarAllHtml"]
        for sg in all_valid_sgs:
            self.assertIn(f'data-subgroup="{sg}"', sidebar_all, f"Falta subgrupo {sg} en sidebar HTML")

        # Busqueda en sidebar por palabra clave
        sidebar_guard = self.data["sidebarGuardHtml"]
        self.assertIn('data-subgroup="1C. Brechas de Capacidad y Presión Territorial"', sidebar_guard)
        self.assertIn('data-var-id="ha_snaspe_por_guardaparque"', sidebar_guard)
        self.assertNotIn('data-subgroup="8C.', sidebar_guard)

        # Busqueda por nombre exacto de subGrupo
        sidebar_sg = self.data["sidebarSgHtml"]
        self.assertIn('data-subgroup="4C. Vialidad y Conectividad Multimodal"', sidebar_sg)
        self.assertIn('data-var-id="ruta7_pavimentada_km"', sidebar_sg)

        # Popover + Cruzar y su buscador reactivo #smartPopoverSearch
        popover_all = self.data["popoverAllHtml"]
        self.assertIn('<details class="popover-subgroup"', popover_all)
        popover_guard = self.data["popoverGuardHtml"]
        self.assertIn('data-subgroup="1C. Brechas de Capacidad y Presión Territorial"', popover_guard)
        self.assertIn('data-var-id="ha_snaspe_por_guardaparque"', popover_guard)
        self.assertNotIn('data-subgroup="8C.', popover_guard)
        self.assertIn("1 de", self.data["popoverGuardCount"])

    def test_06_omniroute_and_zero_emojis(self):
        """Verifica sincronizacion de CANONICAL_LABELS y regla CERO emojis."""
        with open(os.path.join(ROOT_DIR, "js", "omniroute_client.js"), "r", encoding="utf-8") as f:
            omni = f.read()
        for key in (
            "indice_envejecimiento",
            "indice_masculinidad",
            "establecimientos_slep_aysen",
            "fondos_cultura_adjudicados_mclp",
            "total_proyectos_ctci",
            "red_vial_pavimentada_km",
            "barometro_confianza_institucional_pct_hist",
        ):
            self.assertIn(f"{key}:", omni, f"Falta {key} en CANONICAL_LABELS de omniroute_client.js")
        self.assertNotIn("39 Nodos Satélites", omni)

        for rel in (
            "laboratorio.html",
            "index.html",
            "js/omniroute_client.js",
            "scripts/build_aysen_hubs_bundle.cjs",
            "data/systemic/provenance_catalog.json",
            "data/nl_lexicon_aysen.json",
            "tests/test_catalog_taxonomy.py",
        ):
            with open(os.path.join(ROOT_DIR, rel), "r", encoding="utf-8") as f:
                txt = f.read()
            self.assertEqual(EMOJI_REGEX.findall(txt), [], f"Emoji prohibido en {rel}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
