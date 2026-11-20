import os
import subprocess
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class TestHub2SalmoniculturaReengineering(unittest.TestCase):
    """Pruebas de regresion integrales para la reingenieria de los 5 bloques del Hub II."""

    def test_01_block1_reconciliacion_padron_snaspe_holdings_y_nodos(self):
        node_script = r"""
        const assert = require('assert');
        const fs = require('fs');
        const vm = require('vm');
        const path = require('path');

        const ctx = { window: {} };
        vm.runInNewContext(fs.readFileSync(path.join(process.cwd(), 'data/aysen_hubs_data.js'), 'utf8'), ctx);
        const D = ctx.window.AYSEN_HUBS_DATA;

        // 1.1 concesiones_acuicolas_en_snaspe comunal exacto (suma 312)
        const snaspeVec = Array.from(D.comunas.map(c => c.concesiones_acuicolas_en_snaspe));
        assert.deepStrictEqual(snaspeVec, [0, 0, 112, 96, 92, 0, 0, 0, 0, 12]);
        assert.strictEqual(snaspeVec.reduce((a, b) => a + b, 0), 312);

        // 1.2 Reconciliacion 1:1 entre holdings (745), holdingsPorComuna (412/218/98/17) y padron georreferenciado
        const expectComunaTotals = { '11201': 412, '11202': 218, '11203': 98, '11303': 17 };
        const byHoldingFromComuna = {};
        Object.entries(expectComunaTotals).forEach(([ine, expectedSum]) => {
          const list = D.holdingsPorComuna[ine] || [];
          const actualSum = list.reduce((a, h) => a + Number(h.concesiones_comuna || 0), 0);
          assert.strictEqual(actualSum, expectedSum, `holdingsPorComuna[${ine}] = ${actualSum}, esperado ${expectedSum}`);
          list.forEach(h => {
            byHoldingFromComuna[h.holding_id] = (byHoldingFromComuna[h.holding_id] || 0) + Number(h.concesiones_comuna || 0);
          });
        });

        assert.strictEqual(D.holdings.length, 13);
        const totalHoldingsConc = D.holdings.reduce((a, h) => a + Number(h.total_concesiones_aysen || 0), 0);
        assert.strictEqual(totalHoldingsConc, 745);
        D.holdings.forEach(h => {
          assert.strictEqual(
            byHoldingFromComuna[h.holding_id],
            h.total_concesiones_aysen,
            `Holding ${h.holding_id}: comuna sum ${byHoldingFromComuna[h.holding_id]} != ${h.total_concesiones_aysen}`
          );
        });

        const pad = D.concesionesPadronCompact;
        assert.strictEqual(pad.total, 745);
        assert.strictEqual(pad.activos, 245);
        assert.strictEqual(pad.en_snaspe, 312);
        assert.strictEqual(pad.rows.length, 745);

        const padBioSum = pad.rows.reduce((a, r) => a + Number(r.split('|')[8] || 0), 0);
        assert.strictEqual(padBioSum, 503500);

        const padHoldCounts = {};
        pad.rows.forEach(r => {
          const hName = pad.holdings[Number(r.split('|')[3])].split('|')[0];
          padHoldCounts[hName] = (padHoldCounts[hName] || 0) + 1;
        });
        assert.strictEqual(padHoldCounts['AquaChile'], 210);
        assert.strictEqual(padHoldCounts['Mowi Chile'], 95);
        assert.strictEqual(padHoldCounts['Multi X'], 80);
        assert.strictEqual(padHoldCounts['Cermaq Chile'], 75);
        assert.strictEqual(padHoldCounts['Salmones Blumar'], 62);
        assert.strictEqual(padHoldCounts['Australis Seafoods'], 46);
        assert.strictEqual(padHoldCounts['Salmones Camanchaca'], 38);
        assert.strictEqual(padHoldCounts['Salmones Yadrán'], 31);
        assert.strictEqual(padHoldCounts['Invermar'], 27);
        assert.strictEqual(padHoldCounts['Salmones Austral'], 24);
        assert.strictEqual(padHoldCounts['Salmones Antártica'], 20);
        assert.strictEqual(padHoldCounts['Cooke Aquaculture Chile'], 18);
        assert.strictEqual(padHoldCounts['Titulares Menores'], 19);

        assert.strictEqual(D.holdings.reduce((a, h) => a + Number(h.concesiones_snaspe || 0), 0), 312);
        assert.strictEqual(D.holdings.reduce((a, h) => a + Number(h.centros_activos_estimados || 0), 0), 245);

        // 1.3 Nodos #06 y #07 sincronizados con el padron canonico
        const n6 = D.nodos.find(n => n.id === 6);
        const n7 = D.nodos.find(n => n.id === 7);
        assert.deepStrictEqual(Array.from(n6.chartSpec.labels.slice(0, 4)), ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel']);
        assert.deepStrictEqual(Array.from(n6.chartSpec.datasets[0].data.slice(0, 4)), [412, 218, 98, 17]);
        assert.deepStrictEqual(Array.from(n6.chartSpec.datasets[1].data.slice(0, 4)), [135, 78, 32, 0]);
        assert.strictEqual(n7.tableRows.length, 12);
        assert.strictEqual(n7.chartSpec.labels.length, 12);
        assert(n7.tableRows.some(r => r[0].includes('Salmones Austral') && String(r[3]) === '24'));
        assert(n7.tableRows.some(r => r[0].includes('Salmones Antártica') && String(r[3]) === '20'));

        // Selector #map-aqua-filter-${w.id} en laboratorio.html expone los 13 holdings
        const labHtml = fs.readFileSync(path.join(process.cwd(), 'laboratorio.html'), 'utf8');
        ['Invermar', 'Salmones Austral', 'Salmones Antártica', 'Cooke', 'Titulares Menores'].forEach(hVal => {
          assert(labHtml.includes(`value="holding:${hVal}"`), `Falta opcion holding:${hVal} en laboratorio.html`);
        });
        console.log('BLOCK1_OK');
        """
        proc = subprocess.run(["node", "-e", node_script], cwd=ROOT_DIR, capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, f"Fallo Block 1:\n{proc.stderr}\n{proc.stdout}")
        self.assertIn("BLOCK1_OK", proc.stdout)

    def test_02_blocks2_3_4_presets_kpi_y_variables_laboratorio(self):
        node_script = r"""
        const assert = require('assert');
        const fs = require('fs');
        const vm = require('vm');
        const path = require('path');

        const html = fs.readFileSync(path.join(process.cwd(), 'laboratorio.html'), 'utf8');
        const bundleCode = fs.readFileSync(path.join(process.cwd(), 'data/aysen_hubs_data.js'), 'utf8');

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

        const elements = {};
        const makeEl = (id) => {
          if (!elements[id]) {
            elements[id] = {
              id, innerHTML: '', textContent: '', value: 'all', style: {},
              classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
              setAttribute() {}, getAttribute() { return ''; }, addEventListener() {},
              querySelector: () => null, querySelectorAll: () => [], appendChild() {},
              closest: () => null, getContext: () => ({})
            };
          }
          return elements[id];
        };

        const bundleCtx = { window: {} };
        vm.runInNewContext(bundleCode, bundleCtx);
        const D = bundleCtx.window.AYSEN_HUBS_DATA;
        const COMUNAS_ORDER = ['Coyhaique', 'Aysén', 'Cisnes', 'Chile Chico', 'Cochrane', 'Río Ibáñez', 'Guaitecas', 'Lago Verde', 'Tortel', "O'Higgins"];
        const capturedCharts = [];

        const runCtx = {
          window: bundleCtx.window,
          console: { log: () => {}, warn: () => {}, error: () => {} },
          Math, Date, Array, Object, String, Number, Boolean, Set, Map, JSON, RegExp,
          COMUNAS_ORDER,
          TERRITORIAL_SLICES: {
            all: COMUNAS_ORDER,
            tipo_maritima: ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel']
          },
          CLEAR_VAR_LABELS: {},
          AYSEN_HUBS_DATA: D,
          document: {
            getElementById: (id) => makeEl(id),
            querySelector: (sel) => {
              const m = sel.match(/#selectTerritorialSlicer option\[value="([^"]+)"\]/);
              if (m && m[1] === 'tipo_maritima') return { textContent: 'Comunas Marítimas (4)' };
              if (m && m[1] === 'all') return { textContent: 'Todas las comunas (10)' };
              return null;
            },
            querySelectorAll: () => [],
            createElement: () => makeEl('dyn_' + Math.random())
          },
          fetch: async () => { throw new Error('offline-test'); },
          renderSidebarCatalog: () => {},
          clearWidgetMapTimers: () => {},
          getHubColor: () => '#00357f',
          getAutoexplanatoryVarInfo: (id, name, unit) => ({ title: name, unitLabel: unit }),
          resolveOfficialSource: () => ({ name: 'Oficial', collectionDate: '2026', url: 'https://datos.gob.cl' }),
          formatVarWithUnit: (n, u) => `${n} (${u})`,
          toggleCrossHighlight: () => {},
          Chart: function MockChart(ctx, cfg) {
            this.config = cfg;
            this.destroy = () => {};
            capturedCharts.push(cfg);
          },
          AppState: {
            hubsData: D,
            catalogItems: [],
            territorialFilter: 'all',
            _userSelectedTerritorialFilter: false,
            excludeCoyhaique: false,
            activeHighlightEntity: null
          }
        };
        const runtimeCode = [
          'normStr', 'getHubTitleName', 'formatAxisTitle', 'resolveCommunalVector',
          'loadDataLakeAndCatalog', 'getWidgetDataPayload', 'computeWidgetExecutiveStats', 'renderWidgetVisual'
        ].map(extractFn).join('\n\n');
        vm.runInNewContext(runtimeCode, runCtx);

        (async () => {
          await runCtx.loadDataLakeAndCatalog();
          const cat = runCtx.AppState.catalogItems;

          // Block 4: Las 15 variables desbloqueadas del Hub II estan en el catalogo con dim y unit correctos
          const expectedVars = {
            concentracion_salmon_top3_pct: 'tiempo',
            concentracion_salmon_top5_pct: 'tiempo',
            propiedad_capital_extranjero_salmon_pct: 'tiempo',
            tsm_fiordo_puyuhuapi_c: 'tiempo',
            alertas_fan_dias_ano: 'tiempo',
            tasa_ocupacion_concesiones_pct: 'comuna',
            proporcion_concesiones_en_snaspe_pct: 'comuna',
            desembarque_artesanal_ton: 'comuna',
            trabajadores_sii_por_centro_activo: 'comuna',
            pesca_ind_fraccionamiento_art_pct: 'pesqueria',
            pesca_ind_fraccionamiento_ind_pct: 'pesqueria',
            pesca_ind_valor_sancion_utm: 'pesqueria',
            pesca_ind_impuesto_43ter_utm: 'pesqueria',
            centros_activos_por_holding: 'holding',
            concesiones_snaspe_por_holding: 'holding'
          };
          Object.entries(expectedVars).forEach(([vid, expDim]) => {
            const it = cat.find(v => v.id === vid && !v.isAlias);
            assert(it, `Variable ${vid} no registrada en catalogo`);
            assert.strictEqual(it.dim, expDim, `Variable ${vid} dim ${it.dim} != ${expDim}`);
            assert.strictEqual(it.hubId, 'salmonicultura', `Variable ${vid} hubId != salmonicultura`);
          });

          // Consistencia 2026 en series.biomasa_cosecha_salmon y centros_activos_salmon_hist
          const bioHist = cat.find(v => v.id === 'biomasa_cosecha_salmon' && !v.isAlias);
          const ctrHist = cat.find(v => v.id === 'centros_activos_salmon_hist' && !v.isAlias);
          assert.strictEqual(bioHist.chartSpec.datasets[0].data[11], 503.5);
          assert.strictEqual(ctrHist.chartSpec.datasets[0].data[11], 245);

          // Block 2.1 presets
          const hub2Presets = D.hubsGallery.salmonicultura.presets;
          const byId = Object.fromEntries(hub2Presets.map(p => [p.preset_id, p]));
          assert.deepStrictEqual(Array.from(byId.hub_03_01.config.activeOverlays), ['snaspe_polygons', 'ecmpo_polygons', 'zoit_polygons', 'caletas_puertos']);
          assert.strictEqual(byId.hub_03_02.config.defaultTerritorialSlice, 'tipo_maritima');
          assert.strictEqual(byId.hub_03_03.config.defaultTerritorialSlice, 'tipo_maritima');
          assert.strictEqual(byId.hub_03_04.config.customChartSpec.datasets.length, 3);
          assert.strictEqual(byId.hub_03_04.config.customChartSpec.datasets[0].data[11], 503500.0);
          assert.strictEqual(byId.hub_03_04.config.customChartSpec.datasets[1].data[11], 245);
          assert.deepStrictEqual({ ...byId.hub_03_05.config.mirror_series.structural_by_macrozona }, { centro: 52.6, norte: 45.7, sur: 1.7 });

          // Verificar hub_03_02 y hub_03_03 slice maritimo por defecto (4 comunas) y r >= 0.90 en hub_03_03
          runCtx.AppState.territorialFilter = 'all';
          runCtx.AppState._userSelectedTerritorialFilter = false;
          const p02 = runCtx.getWidgetDataPayload({
            varX: byId.hub_03_02.config.varX,
            varY: byId.hub_03_02.config.varY,
            defaultTerritorialSlice: 'tipo_maritima',
            filterComunas: ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel'],
            chartType: 'bar'
          });
          assert.deepStrictEqual(Array.from(p02.labels), ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel']);

          const w03 = {
            id: 903, type: 'chart', chartType: 'scatter',
            varX: byId.hub_03_03.config.varX,
            varY: byId.hub_03_03.config.varY,
            defaultTerritorialSlice: 'tipo_maritima',
            filterComunas: ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel']
          };
          const st03 = runCtx.computeWidgetExecutiveStats(w03);
          assert.strictEqual(st03.n, 4);
          assert(st03.pearsonR >= 0.90, `hub_03_03 r debe ser >= 0.90, got ${st03.pearsonR}`);

          // hub_03_04 scope wording en dim='tiempo' y 3 datasets en renderWidgetVisual
          const w04 = {
            id: 904, type: 'chart', chartType: 'line',
            varX: 'biomasa_cosecha_salmon', varY: 'centros_activos_salmon_hist',
            customChartSpec: byId.hub_03_04.config.customChartSpec,
            showAverage: true, showTrend: true
          };
          const st04 = runCtx.computeWidgetExecutiveStats(w04);
          assert(!st04.pt3.includes('Todas las comunas (10)'), 'No debe decir Todas las comunas en serie temporal');
          assert(st04.pt3.includes('ventana temporal evaluada (2015–2026)'), st04.pt3);

          capturedCharts.length = 0;
          makeEl('display-body-904');
          runCtx.renderWidgetVisual(w04);
          assert.strictEqual(capturedCharts.length, 1);
          assert(capturedCharts[0].data.datasets.length >= 3, 'hub_03_04 debe graficar >=3 datasets incluyendo FAN');

          // hub_03_05 vista por defecto Macrozona sin activeSociodemoFilter
          const p05 = runCtx.getWidgetDataPayload({
            varX: 'biomasa_salmon_ton',
            varY: 'barometro_tension_desarrollo_conservacion_pct',
            chartType: 'bar',
            isPerceptionMirror: true,
            mirrorSeries: byId.hub_03_05.config.mirror_series
          });
          assert.strictEqual(p05.dim, 'barometro_estrato');
          assert.strictEqual(p05.unitX, '%');
          assert.deepStrictEqual(Array.from(p05.dataX), [52.6, 45.7, 1.7]);

          // Block 3: KPI Promedio en variables intensivas/porcentuales
          const kpiCases = [
            { id: 910, varX: 'concesiones_salmon', varY: 'dependencia_fcm_pct', defaultTerritorialSlice: 'tipo_maritima' },
            { id: 911, varX: 'biomasa_salmon_ton', varY: 'barometro_tension_desarrollo_conservacion_pct', isPerceptionMirror: true, mirrorSeries: byId.hub_03_05.config.mirror_series },
            { id: 912, varX: 'antibioticos_ica_g_ton', defaultTerritorialSlice: 'tipo_maritima' },
            { id: 913, varX: 'ipp_per_capita_clp', defaultTerritorialSlice: 'tipo_maritima' },
            { id: 914, varX: 'tasa_ocupacion_concesiones_pct', defaultTerritorialSlice: 'tipo_maritima' }
          ];
          kpiCases.forEach(kc => {
            const kw = { ...kc, type: 'kpi' };
            const kEl = makeEl(`display-body-${kc.id}`);
            runCtx.renderWidgetVisual(kw);
            assert(kEl.innerHTML.includes('· Promedio ('), `KPI ${kc.varY || kc.varX} debe mostrar Promedio, HTML: ${kEl.innerHTML}`);
            assert(!kEl.innerHTML.includes('· Total ('), `KPI ${kc.varY || kc.varX} NO debe mostrar Total`);
          });

          // Block 4.4 pesqueria bivariate payload
          const pFish = runCtx.getWidgetDataPayload({
            id: 915, type: 'chart', chartType: 'bar',
            varX: 'pesca_ind_fraccionamiento_art_pct',
            varY: 'pesca_ind_fraccionamiento_ind_pct'
          });
          assert.strictEqual(pFish.dim, 'pesqueria');
          assert.strictEqual(pFish.labels.length, 9);
          assert.strictEqual(pFish.dataX[0], 63);
          assert.strictEqual(pFish.dataY[0], 37);

          console.log('BLOCKS234_OK');
        })().catch(e => { console.error(e); process.exit(1); });
        """
        proc = subprocess.run(["node", "-e", node_script], cwd=ROOT_DIR, capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, f"Fallo Blocks 2/3/4:\n{proc.stderr}\n{proc.stdout}")
        self.assertIn("BLOCKS234_OK", proc.stdout)

    def test_03_block5_consultor_multiactor_fixes(self):
        node_script = r"""
        const assert = require('assert');
        const fs = require('fs');
        const vm = require('vm');
        const path = require('path');

        const lex = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/nl_lexicon_aysen.json'), 'utf8'));
        const sandbox = {
          window: { location: { href: 'http://localhost/' } },
          navigator: {}, console,
          fetch: async () => ({ ok: false }),
          URL, URLSearchParams, Set, Map, RegExp, Math, Number, String, Array, Object, JSON
        };
        sandbox.global = sandbox;
        vm.createContext(sandbox);
        vm.runInContext(fs.readFileSync(path.join(process.cwd(), 'data/aysen_hubs_data.js'), 'utf8'), sandbox);
        vm.runInContext(fs.readFileSync(path.join(process.cwd(), 'js/nl2chart_engine.js'), 'utf8'), sandbox);
        if (sandbox.window.NL2ChartEngine && sandbox.window.NL2ChartEngine.initWithData) sandbox.window.NL2ChartEngine.initWithData(lex);
        vm.runInContext(fs.readFileSync(path.join(process.cwd(), 'js/omniroute_client.js'), 'utf8'), sandbox);

        const client = sandbox.window.OmniRouteClient;
        client.refreshMemory(sandbox.window.AYSEN_HUBS_DATA);

        // 5.1 Comparacion explicita de 4 variables no secuestrada por potencia_mw
        const r1 = client.resolveClosedWorldDeterministic(
          'Compara la biomasa de salmón cosechada, centros activos de salmón, inversión aprobada SEIA y trabajadores SII en las comunas marítimas de Aysén, Cisnes, Guaitecas y Tortel'
        );
        const r1Vars = [r1.chart.varX, r1.chart.varY, r1.chart.varZ, r1.chart.varW];
        assert(r1Vars.includes('biomasa_salmon_ton'), 'Falta biomasa_salmon_ton: ' + r1Vars);
        assert(r1Vars.includes('centros_activos_salmon'), 'Falta centros_activos_salmon: ' + r1Vars);
        assert(r1Vars.includes('inversion_seia_mmusd'), 'Falta inversion_seia_mmusd: ' + r1Vars);
        assert(r1Vars.includes('trabajadores_sii'), 'Falta trabajadores_sii: ' + r1Vars);
        assert(!r1Vars.includes('potencia_mw'), 'No debe secuestrar con potencia_mw');
        assert.deepStrictEqual(Array.from(r1.chart.focusComunas), ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel']);

        // 5.2 concesiones_acuicolas_en_snaspe + superficie_snaspe_pct + antibioticos_ica_g_ton
        const r2 = client.resolveClosedWorldDeterministic(
          'Cruza las concesiones acuícolas en SNASPE con el porcentaje de superficie SNASPE y la intensidad de antibióticos ICA en las comunas de Aysén'
        );
        assert.strictEqual(r2.chart.varX, 'concesiones_acuicolas_en_snaspe');
        assert.strictEqual(r2.chart.varY, 'antibioticos_ica_g_ton');
        assert.strictEqual(r2.chart.varZ, 'superficie_snaspe_pct');
        assert.deepStrictEqual(Array.from(r2.chart.focusComunas), ['Aysén', 'Cisnes', 'Guaitecas', 'Tortel']);
        assert(r2.reply.includes('112/412') && r2.reply.includes('96/218') && r2.reply.includes('92/98') && r2.reply.includes('12/17'));

        // 5.3 Prioridad ecmpo_solicitadas_ha + amerb_operativas + sindicatos_pesca_artesanal + concesiones_salmon
        const r3 = client.resolveClosedWorldDeterministic(
          'Compara las hectáreas de ECMPO solicitadas, sindicatos de pesca artesanal, áreas de manejo AMERB operativas y concesiones de salmón'
        );
        const r3Vars = [r3.chart.varX, r3.chart.varY, r3.chart.varZ, r3.chart.varW];
        assert(r3Vars.includes('ecmpo_solicitadas_ha'), 'Falta ecmpo_solicitadas_ha: ' + r3Vars);
        assert(r3Vars.includes('sindicatos_pesca_artesanal'), 'Falta sindicatos_pesca_artesanal: ' + r3Vars);
        assert(r3Vars.includes('amerb_operativas'), 'Falta amerb_operativas: ' + r3Vars);
        assert(r3Vars.includes('concesiones_salmon'), 'Falta concesiones_salmon: ' + r3Vars);

        // 5.4 Pesquerias Ley 21.752 / Art. 43 ter y desembarque por caleta (Nodos #08 y #10)
        const r4 = client.resolveClosedWorldDeterministic(
          '¿Cómo se distribuye el fraccionamiento entre pesca artesanal e industrial en merluza del sur y congrio dorado y cuánto desembarque artesanal tienen las caletas de Aysén?'
        );
        assert(r4.reply.includes('21.752') && r4.reply.includes('37%') && r4.reply.includes('63%'));
        assert(r4.reply.includes('77') && r4.reply.includes('83') && r4.reply.includes('3,234') && r4.reply.includes('3,486'));
        assert(r4.reply.includes('Puerto Chacabuco') && r4.reply.includes('14.850') && r4.reply.includes('Melinka') && r4.reply.includes('8.920'));
        assert(Array.isArray(r4.chart.multiCharts) && r4.chart.multiCharts.length === 2);
        assert.strictEqual(r4.chart.multiCharts[0].varX, 'pesca_ind_fraccionamiento_art_pct');
        assert.strictEqual(r4.chart.multiCharts[1].varX, 'desembarque_artesanal_ton');

        console.log('BLOCK5_OK');
        """
        proc = subprocess.run(["node", "-e", node_script], cwd=ROOT_DIR, capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, f"Fallo Block 5:\n{proc.stderr}\n{proc.stdout}")
        self.assertIn("BLOCK5_OK", proc.stdout)


if __name__ == "__main__":
    unittest.main()
