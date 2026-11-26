#!/usr/bin/env python3
"""
tests/test_hub1_turismo_and_cross_hub_integrity.py
===============================================================================
Suite de Integridad Forense — Hub I (Turismo y SNASPE), Puertas Multimodales,
Saneamiento Transversal 10 Hubs y Paridad Obsidian Vault (Sprint 5).
"""

import json
import math
import os
import subprocess
import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
BUNDLE_PATH = ROOT_DIR / "data" / "aysen_hubs_data.js"
TURISMO_JSON_PATH = ROOT_DIR / "data" / "systemic" / "06_turismo_sernatur_conaf.json"
CONECT_JSON_PATH = ROOT_DIR / "data" / "systemic" / "11_conectividad_infraestructura_multimodal.json"
LEXICON_PATH = ROOT_DIR / "data" / "nl_lexicon_aysen.json"
LABORATORIO_HTML = ROOT_DIR / "laboratorio.html"

CANONICAL_10_HUB_TITLES = {
    "I. Turismo y Áreas Silvestres",
    "II. Pesca, Acuicultura y Mar",
    "III. Energía y Telecomunicaciones",
    "IV. Gobernanza y Finanzas",
    "V. Economía, Inversión y Suelo",
    "VI. Demografía, Educación y Sociedad",
    "VII. Biodiversidad, Clima y Riesgos",
    "VIII. Salud",
    "IX. Cultura y Patrimonio",
    "X. CTCi e Innovación",
}


def load_bundle_json():
    proc = subprocess.run(
        [
            "node",
            "-e",
            (
                "const fs=require('fs'),vm=require('vm');"
                "const c={window:{}};"
                "vm.runInNewContext(fs.readFileSync('data/aysen_hubs_data.js','utf8'),c);"
                "process.stdout.write(JSON.stringify(c.window.AYSEN_HUBS_DATA));"
            ),
        ],
        cwd=ROOT_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=True,
    )
    return json.loads(proc.stdout)


def pearson_r(xs, ys):
    n = len(xs)
    mx = sum(xs) / n
    my = sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    dx = sum((x - mx) ** 2 for x in xs)
    dy = sum((y - my) ** 2 for y in ys)
    if dx <= 1e-12 or dy <= 1e-12:
        return 0.0
    return num / math.sqrt(dx * dy)


class TestHub1TurismoAndCrossHubIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = load_bundle_json()
        cls.comunas = cls.bundle["comunas"]
        cls.turismo_raw = json.loads(TURISMO_JSON_PATH.read_text(encoding="utf-8"))
        cls.conect_raw = json.loads(CONECT_JSON_PATH.read_text(encoding="utf-8"))
        cls.lexicon = json.loads(LEXICON_PATH.read_text(encoding="utf-8"))

    def test_01_hub1_emat_and_rnpst_reconciliation(self):
        """Reconcilia EMAT (364.039 pern., 196.611 llegadas) y RNPST (1.728 servicios)."""
        sum_pern = sum(c["pernoctaciones_emat"] for c in self.comunas)
        sum_lleg = sum(c["llegadas_turistas_emat_n"] for c in self.comunas)
        self.assertEqual(sum_pern, 364039)
        self.assertEqual(sum_lleg, 196611)

        mens = self.bundle["seriesMensualesEmat"]
        self.assertEqual(len(mens), 12)
        self.assertEqual(sum(m["pernoctaciones_total"] for m in mens), 364039)
        self.assertEqual(sum(m["llegadas_pasajeros_total"] for m in mens), 196611)
        for m in mens:
            self.assertNotEqual(
                m["llegadas_pasajeros_total"],
                m["pernoctaciones_total"],
                f"Mes {m['mes']} iguala llegadas y pernoctaciones",
            )

        rnpst_total = sum(c["prestadores_sernatur"] for c in self.comunas)
        self.assertEqual(rnpst_total, 1728)
        for c in self.comunas:
            self.assertGreater(c.get("prestadores_vigencia_patente_pct", 0), 0)

    def test_02_hub1_no_synthetic_collinearity(self):
        """Verifica eliminacion de multiplicador ADR 1.35x, formula estival sintetica y rangos ADR/RevPAR."""
        gasto = [float(c["gasto_diario_turista_usd"]) for c in self.comunas]
        adr_usd = [float(c["tarifa_adr_estimada_usd"]) for c in self.comunas]
        r_gasto_adr = pearson_r(gasto, adr_usd)
        self.assertLess(abs(r_gasto_adr), 0.90, f"Colinealidad residual gasto vs ADR: r={r_gasto_adr:.4f}")

        max_formula_match = 0
        diffs = []
        for c in self.comunas:
            o_est = float(c["tasa_ocupacion_estival_pct"])
            o_inv = float(c["tasa_ocupacion_invernal_pct"])
            old_synth = (o_est / (o_est + o_inv)) * 100.0
            d = abs(float(c["concentracion_estival_pct"]) - old_synth)
            diffs.append(d)
            if d < 1.0:
                max_formula_match += 1
        self.assertLessEqual(max_formula_match, 2, "Persiste formula sintetica (oEst/(oEst+oInv))*100")
        self.assertGreater(sum(diffs) / len(diffs), 5.0, "Concentracion estival demasiado cercana a formula sintetica")

        total_pern = sum(c["pernoctaciones_emat"] for c in self.comunas)
        weighted_adr = sum(c["tarifa_adr_emat_clp"] * c["pernoctaciones_emat"] for c in self.comunas) / total_pern
        weighted_revpar = sum(c["revpar_emat_clp"] * c["pernoctaciones_emat"] for c in self.comunas) / total_pern
        self.assertAlmostEqual(weighted_adr, 70213, delta=250)
        self.assertAlmostEqual(weighted_revpar, 17203, delta=150)

    def test_03_snaspe_dimension_and_conaf_parity(self):
        """Verifica paridad 86.117 visitas CONAF, N=19 unidadesSnaspe, 41 guardaparques y dim:'snaspe'."""
        self.assertEqual(sum(c["visitantes_snaspe"] for c in self.comunas), 86117)
        snaspe = self.bundle.get("unidadesSnaspe", [])
        self.assertEqual(len(snaspe), 19)
        self.assertEqual(sum(u["visitantes_anuales_n"] for u in snaspe), 86117)
        self.assertEqual(sum(u["guardaparques_permanentes_n"] for u in snaspe), 41)

        by_name = {u["nombre"]: u for u in snaspe}
        self.assertEqual(by_name["RN Las Guaitecas"]["concesiones_salmon_dentro_n"], 312)
        self.assertEqual(by_name["PN Isla Magdalena"]["concesiones_salmon_dentro_n"], 4)
        self.assertEqual(by_name["PN Laguna San Rafael"]["concesiones_salmon_dentro_n"], 2)
        self.assertEqual(sum(u["concesiones_salmon_dentro_n"] for u in snaspe), 318)

        lab_txt = LABORATORIO_HTML.read_text(encoding="utf-8")
        for v_id in [
            "snaspe_superficie_ha",
            "snaspe_visitantes_anuales_n",
            "snaspe_guardaparques_permanentes_n",
            "snaspe_concesiones_salmon_dentro_n",
            "snaspe_superficie_salmon_ha",
            "snaspe_inversion_pdze_mclp",
        ]:
            self.assertIn(v_id, lab_txt)
        self.assertIn("dim: 'snaspe'", lab_txt)

    def test_04_zoit_and_multimodal_gateways(self):
        """Verifica exclusion legal de Aysen de ZOIT Queulat y puertas multimodales JAC/PDI/EMPORCHA."""
        por_com = {c["comuna_ine"]: c for c in self.turismo_raw["por_comuna"]}
        def get_zoit(row):
            return row.get("datos", {}).get("zoit_y_atractivos") or row.get("zonas_interes_turistico_zoit") or {}
        self.assertFalse(get_zoit(por_com["11201"])["pertenece_a_zoit"])
        self.assertNotIn("Queulat", get_zoit(por_com["11201"])["nombre_zoit"])
        self.assertTrue(get_zoit(por_com["11202"])["pertenece_a_zoit"])
        self.assertTrue(get_zoit(por_com["11102"])["pertenece_a_zoit"])

        jac_by_yr = {str(r["periodo"]): r["pasajeros"] for r in self.bundle["series"]["balmaceda_pasajeros_jac"]}
        self.assertEqual(jac_by_yr["2025"], 605945)

        pdi = self.bundle["series"]["pasos_fronterizos_pdi_aysen"]
        self.assertEqual(pdi["total_personas_controladas"], 350257)
        by_paso = {r["paso"]: r["controlados"] for r in pdi["por_paso"]}
        self.assertEqual(by_paso["Paso Jeinimeni"], 233327)
        self.assertEqual(by_paso["Paso Coyhaique Alto"], 63045)
        self.assertEqual(by_paso["Paso Huemules"], 53885)

        cruc_by_s = {r["temporada"]: r for r in self.bundle["series"]["emporcha_cruceros"]}
        self.assertEqual(cruc_by_s["2024-2025"]["pasajeros_cruceros"], 22093)
        self.assertEqual(cruc_by_s["2024-2025"]["recaladas_cruceros"], 29)

    def test_05_cross_hub_anti_corruption_audit(self):
        """Audita 0 duplicados r=1.0 activos, SII asimetrico CV>0.25, SUBTEL!=FTTH y 100% clasificacion."""
        sum_emp = sum(c["empresas_sii"] for c in self.comunas)
        sum_trab = sum(c["trabajadores_sii"] for c in self.comunas)
        self.assertEqual(sum_emp, 13453)
        self.assertEqual(sum_trab, 35832)
        ratios = [c["trabajadores_sii"] / c["empresas_sii"] for c in self.comunas]
        mean_ratio = sum(ratios) / len(ratios)
        std_ratio = math.sqrt(sum((x - mean_ratio) ** 2 for x in ratios) / len(ratios))
        cv_ratio = std_ratio / mean_ratio
        self.assertGreater(cv_ratio, 0.25, f"CV ratio trabajadores/empresa demasiado bajo: {cv_ratio:.4f}")

        net_fijo = [float(c["internet_fijo_pct"]) for c in self.comunas]
        fibra = [float(c["cobertura_fibra_hogar_pct"]) for c in self.comunas]
        r_net_fibra = pearson_r(net_fijo, fibra)
        self.assertLess(r_net_fibra, 0.995, f"internet_fijo_pct sigue colineal con FTTH: r={r_net_fibra:.5f}")

        # Verificar 0 pares duplicados activos (r == 1.0000) en catalogo no-alias de laboratorio.html
        node_dup_check = r"""
        const fs = require('fs'), vm = require('vm');
        const html = fs.readFileSync('laboratorio.html', 'utf8');
        const d = JSON.parse(fs.readFileSync(0, 'utf8'));
        function extractFn(name) {
            const re = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`);
            const match = re.exec(html);
            let b = 0, st = false, end = match.index;
            for (let i = match.index; i < html.length; i++) {
                if (html[i] === '{') { b++; st = true; }
                else if (html[i] === '}') { b--; if (st && b === 0) { end = i + 1; break; } }
            }
            return html.slice(match.index, end);
        }
        const COMUNAS_ORDER = ['Coyhaique', 'Aysén', 'Cisnes', 'Chile Chico', 'Cochrane', 'Río Ibáñez', 'Guaitecas', 'Lago Verde', 'Tortel', "O'Higgins"];
        const lexJson = JSON.parse(fs.readFileSync('data/nl_lexicon_aysen.json', 'utf8'));
        const runCtx = {
            window: { AYSEN_HUBS_DATA: d, NL2ChartEngine: { init: async () => {}, getLexicon: () => lexJson } },
            console: { log: () => {}, warn: () => {}, error: () => {} },
            COMUNAS_ORDER,
            document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
            fetch: async () => { throw new Error('offline'); },
            renderSidebarCatalog: () => {},
            getAutoexplanatoryVarInfo: (id, name, unit) => ({ title: name, unitLabel: unit }),
            resolveOfficialSource: () => ({ name: 'Oficial', collectionDate: '2026', url: 'https://datos.gob.cl' }),
            formatVarWithUnit: (n, u) => `${n} (${u})`,
            AppState: { hubsData: d, catalogItems: [] }
        };
        vm.runInNewContext(['normStr', 'getHubTitleName', 'loadDataLakeAndCatalog'].map(extractFn).join('\n\n'), runCtx);
        runCtx.loadDataLakeAndCatalog().then(() => {
            const activeCom = runCtx.AppState.catalogItems.filter(v => !v.isAlias && v.dim === 'comuna' && Array.isArray(v.data) && v.data.length === 10);
            const exactDups = [];
            const seen = new Map();
            for (const it of activeCom) {
                const sig = JSON.stringify(it.data.map(x => Number(x.toFixed(6))));
                if (seen.has(sig)) exactDups.push([seen.get(sig), it.id]);
                else seen.set(sig, it.id);
            }
            if (exactDups.length > 0) {
                console.error('Active duplicate pairs:', exactDups);
                process.exit(2);
            }
            const snaspeVars = runCtx.AppState.catalogItems.filter(v => v.dim === 'snaspe');
            if (snaspeVars.length !== 6) {
                console.error('Expected 6 snaspe vars, got', snaspeVars.length);
                process.exit(3);
            }
            console.log('LAB_DEDUP_AND_SNASPE_OK', activeCom.length);
        });
        """
        proc = subprocess.run(
            ["node", "-e", node_dup_check],
            input=json.dumps(self.bundle),
            cwd=ROOT_DIR,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        self.assertEqual(proc.returncode, 0, f"Fallo en dedup laboratorio:\n{proc.stderr}\n{proc.stdout}")

        # Verificar 100% clasificacion en nl_lexicon_aysen.json bajo exactamente 10 Hub titles
        hub_titles = {v.get("hubTitle") for v in self.lexicon["variables"]}
        self.assertEqual(hub_titles, CANONICAL_10_HUB_TITLES)

        audit_check = subprocess.run(
            [
                "node",
                "-e",
                (
                    "const audit=require('./scripts/obsidian_indicator_audit.cjs');"
                    "const b=audit.loadBundleFromFile('data/aysen_hubs_data.js');"
                    "const {varMap}=audit.buildMetadataCatalog();"
                    "const s=audit.extractSnapshotFromBundle(b);"
                    "const u=Object.keys(s.indicators).filter(k=>!varMap.get(k)||String(varMap.get(k).hubTitle).includes('Sin clasificar'));"
                    "if(u.length){console.error('Unclassified:',u);process.exit(4);}"
                    "console.log('AUDIT_COUNT',Object.keys(s.indicators).length);"
                ),
            ],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        self.assertEqual(audit_check.returncode, 0, f"Indicadores sin clasificar:\n{audit_check.stderr}")

    def test_06_obsidian_wiki_and_audit_parity(self):
        """Verifica auditoria Obsidian, Karpathy Wiki y paridad 100% con Obsidian Vault local."""
        for script in [
            "tests/test_obsidian_indicator_audit.cjs",
            "tests/test_karpathy_llm_wiki_obsidian.cjs",
        ]:
            proc = subprocess.run(["node", script], cwd=ROOT_DIR, capture_output=True, text=True, encoding="utf-8")
            self.assertEqual(proc.returncode, 0, f"{script} fallo:\n{proc.stdout}\n{proc.stderr}")

        vault_root = Path(r"G:\Mi unidad\AGY\Obsidian Vault")
        if vault_root.exists():
            pairs = [
                (ROOT_DIR / "wiki", vault_root / "Aysen_Sistemico", (".md",)),
                (ROOT_DIR / "auditoria_obsidian", vault_root / "Aysen_Sistemico_Auditoria", (".md",)),
            ]
            for src_dir, dst_dir, exts in pairs:
                self.assertTrue(dst_dir.exists(), f"Falta directorio Vault: {dst_dir}")
                for src_file in src_dir.rglob("*"):
                    if not src_file.is_file() or src_file.suffix.lower() not in exts:
                        continue
                    rel = src_file.relative_to(src_dir)
                    if rel.parts[0] == ".obsidian":
                        continue
                    dst_file = dst_dir / rel
                    self.assertTrue(dst_file.exists(), f"Falta archivo en Vault: {dst_file}")
                    self.assertEqual(
                        src_file.read_bytes(),
                        dst_file.read_bytes(),
                        f"Desincronizacion byte a byte entre {src_file} y {dst_file}",
                    )


if __name__ == "__main__":
    unittest.main()
