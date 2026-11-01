#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pruebas del sistema de actualizacion mensual por API (Circuit Breaker / Last-Known-Good).

Cubre:
  - Conectores: respuesta exitosa actualiza el dato; caidas de red, 403/500, vacio,
    HTML y valores incoherentes dejan el archivo intacto.
  - Orquestador: una fuente caida no interrumpe a las demas, el manifiesto, la
    procedencia y el estado registran codigo HTTP y modo reales, y una compuerta
    fallida revierte toda la base.
  - Workflow de GitHub Actions: programacion, permisos y pasos exigidos.

Sin red ni dependencias externas: se sustituye live_api_connectors.http_get.
Ejecutar:  python tests/test_monthly_api_updater.py   (o pytest)
"""

import inspect
import json
import re
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "scripts" / "ingesta"))

import live_api_connectors as live  # noqa: E402
import run_monthly_update as monthly  # noqa: E402

WORKFLOW = ROOT / ".github" / "workflows" / "actualizacion_mensual.yml"
HTTP_UNAVAILABLE = live.HttpResponse("", 0, b"", 0.0, "URLError: timed out")


def feature(mag=3.1, lon=-72.5, lat=-45.6, place="30 km N of Coyhaique, Chile", t=1_700_000_000_000):
    return {"type": "Feature", "properties": {"mag": mag, "place": place, "time": t},
            "geometry": {"type": "Point", "coordinates": [lon, lat, 10.0]}}


def usgs_body(features, url_suffix="&minmagnitude=2.5"):
    return json.dumps({"type": "FeatureCollection",
                       "metadata": {"url": "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson" + url_suffix,
                                    "status": 200, "count": len(features)},
                       "features": features}).encode("utf-8")


def ok_json(url, payload, status=200):
    return live.HttpResponse(url, status, json.dumps(payload).encode("utf-8"), 0.1)


class FakeNetwork:
    """Sustituye http_get: mapa de prefijo de URL -> respuesta; el resto cae (sin respuesta)."""

    def __init__(self, routes=None):
        self.routes = routes or {}
        self.calls = []

    def __call__(self, url, timeout=live.REQUEST_TIMEOUT, headers=None):
        self.calls.append((url, timeout, dict(headers or {})))
        for prefix, response in self.routes.items():
            if url.startswith(prefix):
                return response(url) if callable(response) else response
        return live.HttpResponse(url, 0, b"", 0.0, "URLError: sin ruta en la prueba")


class TempRepoCase(unittest.TestCase):
    """Repositorio minimo en un directorio temporal con un dato valido por fuente."""

    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="aysen_monthly_"))
        self.addCleanup(shutil.rmtree, self.tmp, True)
        self._orig_http = live.http_get
        self.addCleanup(setattr, live, "http_get", self._orig_http)

        self.usgs_path = self.tmp / live.USGS_RAW_RELPATH
        self.usgs_path.parent.mkdir(parents=True)
        self.usgs_path.write_bytes(usgs_body([feature(3.0), feature(4.2), feature(2.9)]))

        sysdir = self.tmp / "data" / "systemic"
        sysdir.mkdir(parents=True)
        (sysdir / "01_gob_poder_finanzas.json").write_text(
            json.dumps({"comunas": [{"ine": str(i)} for i in range(10)], "version": 1}), encoding="utf-8")
        (sysdir / "source_watch_manifest.json").write_text(json.dumps({
            "generated_at": "2026-01-01T00:00:00+00:00", "total_sources": 3,
            "sources": {"31": {"sha256": "x", "sourceUrl": "https://earthquake.usgs.gov/"},
                        "30": {"sha256": "x", "sourceUrl": "https://sinca.mma.gob.cl/"},
                        "1": {"sha256": "x", "sourceUrl": "https://serviciosturisticos.sernatur.cl/"}}}), encoding="utf-8")
        (sysdir / "provenance_catalog.json").write_text(json.dumps({"nodes": [
            {"id": 31, "provenance": {"sourceUrl": "https://earthquake.usgs.gov/"}},
            {"id": 30, "provenance": {"sourceUrl": "https://sinca.mma.gob.cl/"}},
            {"id": 1, "provenance": {"sourceUrl": "https://serviciosturisticos.sernatur.cl/"}}]}), encoding="utf-8")

    def install(self, routes=None):
        net = FakeNetwork(routes)
        live.http_get = net
        return net

    def snapshot_bytes(self):
        return {p.relative_to(self.tmp).as_posix(): p.read_bytes()
                for p in (self.tmp / "data").rglob("*") if p.is_file()}


# ---------------------------------------------------------------------------
# Conectores
# ---------------------------------------------------------------------------

class TestConnectorContract(unittest.TestCase):
    def test_timeout_12_and_clean_user_agent(self):
        self.assertEqual(live.REQUEST_TIMEOUT, 12)
        self.assertEqual(inspect.signature(live.http_get).parameters["timeout"].default, 12)
        ua = live.USER_AGENT
        self.assertNotIn("Mozilla", ua)
        self.assertNotIn("Chrome", ua)
        self.assertTrue(ua.startswith("AysenSistemico"))

    def test_seven_connectors_and_required_functions(self):
        self.assertEqual(len(live.CONNECTOR_IDS), 7)
        for fn in ("fetch_usgs_earthquakes_aysen", "fetch_ckan_datos_gob",
                   "fetch_arcgis_rest_aysen", "fetch_sinca_air_quality_aysen"):
            self.assertTrue(callable(getattr(live, fn)), fn)
        self.assertIn("minmagnitude=2.5", live.USGS_URL)
        self.assertIn("starttime=2015-01-01", live.USGS_URL)
        self.assertEqual(live.CKAN_DATOS_GOB, "https://datos.gob.cl/api/3/action")
        self.assertEqual(live.CKAN_CNE, "http://datos.energiaabierta.cl/api/3/action")
        self.assertEqual(len(live.COMUNAS_AYSEN), 10)
        self.assertEqual(sorted(live.COMUNAS_AYSEN)[0], "11101")
        self.assertEqual(sorted(live.COMUNAS_AYSEN)[-1], "11402")


class TestUsgsConnector(TempRepoCase):
    def test_success_updates_file_and_recomputes_totals(self):
        feats = [feature(2.7), feature(5.4, place="80 km W of Cochrane, Chile"), feature(3.3)]
        net = self.install({"https://earthquake.usgs.gov": live.HttpResponse("", 200, usgs_body(feats), 0.2)})
        res = live.fetch_usgs_earthquakes_aysen(self.tmp)
        self.assertTrue(res.ok)
        self.assertEqual(res.mode, "live_api")
        self.assertEqual(res.http_status, 200)
        self.assertEqual(res.metrics["total_events"], 3)
        self.assertEqual(res.metrics["max_magnitude"], 5.4)
        written = json.loads(self.usgs_path.read_text(encoding="utf-8"))
        self.assertEqual(len(written["features"]), 3)
        self.assertEqual(net.calls[0][1], 12)  # timeout real de la solicitud

    def test_every_failure_mode_leaves_last_known_good_untouched(self):
        before = self.usgs_path.read_bytes()
        cases = {
            "http_403": live.HttpResponse("", 403, b"", 0.1, "HTTP 403 Forbidden"),
            "http_500": live.HttpResponse("", 500, b"", 0.1, "HTTP 500"),
            "timeout": live.HttpResponse("", 0, b"", 12.0, "TimeoutError"),
            "empty_features": live.HttpResponse("", 200, usgs_body([]), 0.1),
            "html_body": live.HttpResponse("", 200, b"<html><body>mantenimiento</body></html>", 0.1),
            "zero_magnitude": live.HttpResponse("", 200, usgs_body([feature(0.0), feature(-1.0)]), 0.1),
            "outside_aysen": live.HttpResponse("", 200, usgs_body([feature(4.0, lon=-70.0, lat=-33.4)]), 0.1),
            "corrupt_json": live.HttpResponse("", 200, b'{"type": "FeatureCollection", "features": [', 0.1),
        }
        for name, response in cases.items():
            with self.subTest(name):
                self.install({"https://earthquake.usgs.gov": response})
                res = live.fetch_usgs_earthquakes_aysen(self.tmp)
                self.assertFalse(res.ok, name)
                self.assertEqual(res.mode, "curated_fallback")
                self.assertEqual(self.usgs_path.read_bytes(), before, f"{name}: el dato previo cambio")

    def test_suspicious_shrink_is_rejected(self):
        self.usgs_path.write_bytes(usgs_body([feature(3.0 + i / 10) for i in range(20)]))
        before = self.usgs_path.read_bytes()
        self.install({"https://earthquake.usgs.gov": live.HttpResponse("", 200, usgs_body([feature(3.0)]), 0.1)})
        res = live.fetch_usgs_earthquakes_aysen(self.tmp)
        self.assertFalse(res.ok)
        self.assertEqual(self.usgs_path.read_bytes(), before)


class TestCkanConnector(TempRepoCase):
    SEARCH = {"success": True, "result": {"count": 2, "results": [{
        "name": "establecimientos-salud", "title": "Establecimientos de Salud",
        "metadata_modified": "2026-09-01T00:00:00", "organization": {"title": "MINSAL"},
        "resources": [{"id": "res-1", "name": "Establecimientos", "format": "CSV", "url": "https://x/y.csv",
                       "datastore_active": True, "state": "active"},
                      {"id": "res-old", "name": "Antiguo", "format": "CSV", "state": "deleted"}]}]}}

    def datastore(self, records):
        return {"success": True, "result": {"records": records}}

    def test_success_extracts_metadata_and_filters_aysen_rows(self):
        records = [{"_id": 1, "region": "11", "comuna": "11101", "camas": 167},
                   {"_id": 2, "region": "13", "comuna": "13101", "camas": 900},
                   {"_id": 3, "codigo_region": "11", "comuna": "Cochrane", "camas": 12},
                   {"_id": 4, "region": "Aysén", "comuna": "11201", "camas": 0}]
        self.install({
            "https://datos.gob.cl/api/3/action/package_search": ok_json("", self.SEARCH),
            "https://datos.gob.cl/api/3/action/datastore_search": ok_json("", self.datastore(records)),
        })
        res = live.fetch_ckan_datos_gob("salud deis", "res-1", key="deis", nodes=[24],
                                        raw_dir="social_ambiental", filename="ckan_deis.json", root=self.tmp)
        self.assertTrue(res.ok)
        snap = json.loads((self.tmp / "data/raw/social_ambiental/ckan_deis.json").read_text(encoding="utf-8"))
        self.assertEqual([r["_id"] for r in snap["aysen_rows"]], [1, 3, 4])
        self.assertEqual(len(snap["resources"]), 1)  # el recurso eliminado no cuenta como vigente

    def test_rows_without_aysen_or_without_positive_values_fail(self):
        for records in ([{"_id": 1, "region": "13", "camas": 5}],
                        [{"_id": 1, "region": "11", "camas": 0, "comuna": "11101"}]):
            with self.subTest(records=records):
                self.install({
                    "https://datos.gob.cl/api/3/action/package_search": ok_json("", self.SEARCH),
                    "https://datos.gob.cl/api/3/action/datastore_search": ok_json("", self.datastore(records)),
                })
                res = live.fetch_ckan_datos_gob("x", "res-1", key="k", raw_dir="social_ambiental",
                                                filename="k.json", root=self.tmp)
                self.assertFalse(res.ok)
                self.assertFalse((self.tmp / "data/raw/social_ambiental/k.json").exists())

    def test_unsuccessful_or_unreachable_ckan_falls_back(self):
        for response in (ok_json("", {"success": False, "error": {"message": "x"}}),
                         live.HttpResponse("", 500, b"", 0.1, "HTTP 500"), HTTP_UNAVAILABLE):
            self.install({"http://datos.energiaabierta.cl": response})
            res = live.fetch_ckan_datos_gob("combustibles", None, base_url=live.CKAN_CNE, key="cne",
                                            connector="ckan_cne", raw_dir="energia_telecom",
                                            filename="cne.json", root=self.tmp)
            self.assertFalse(res.ok)
            self.assertEqual(res.mode, "curated_fallback")


class TestArcgisAndSinca(TempRepoCase):
    def target(self, key):
        return next(t for t in live.ARCGIS_TARGETS if t["key"] == key)

    def test_valid_count_updates_snapshot(self):
        layer = self.target("subpesca")["candidates"][0]
        self.install({layer + "/query": ok_json("", {"count": 745}),
                      layer + "?f=json": ok_json("", {"name": "Acuicultura"})})
        res = live.fetch_arcgis_target(self.target("subpesca"), self.tmp)
        self.assertTrue(res.ok)
        self.assertEqual(res.metrics["count"], 745)
        out = self.tmp / "data/raw/territorio_concesiones" / self.target("subpesca")["file"]
        self.assertEqual(json.loads(out.read_text(encoding="utf-8"))["count"], 745)

    def test_invalid_arcgis_answers_do_not_write(self):
        bad = {
            "html_200": live.HttpResponse("", 200, b"<!DOCTYPE html><html></html>", 0.1),
            "logical_error_200": ok_json("", {"error": {"code": 400, "message": "Invalid URL"}}),
            "zero_count": ok_json("", {"count": 0}),
            "negative_count": ok_json("", {"count": -5}),
            "text_count": ok_json("", {"count": "muchos"}),
            "http_404": live.HttpResponse("", 404, b"", 0.1, "HTTP 404"),
            "unreachable": HTTP_UNAVAILABLE,
        }
        for name, response in bad.items():
            with self.subTest(name):
                self.install({"https://": response})
                res = live.fetch_arcgis_target(self.target("conaf"), self.tmp)
                self.assertFalse(res.ok, name)
                out = self.tmp / "data/raw/biodiversidad_mma_conaf" / self.target("conaf")["file"]
                self.assertFalse(out.exists(), name)

    def test_sinca_valid_and_forbidden(self):
        stations = [{"nombre": "Coyhaique I", "region": "Aysén",
                     "realtime": [{"parametro": "PM2,5", "mp25": 38.5}]},
                    {"nombre": "Puerto Aysén", "pm10": 22.0},
                    {"nombre": "Santiago", "mp25": 55.0}]
        self.install({live.SINCA_LIST_URL: ok_json("", stations)})
        res = live.fetch_sinca_air_quality_aysen(self.tmp)
        self.assertTrue(res.ok)
        self.assertEqual(sorted(res.metrics["stations"]), ["Coyhaique", "Puerto Aysen"])
        self.assertTrue((self.tmp / live.SINCA_RAW_RELPATH).exists())

        (self.tmp / live.SINCA_RAW_RELPATH).unlink()
        self.install({live.SINCA_LIST_URL: live.HttpResponse("", 403, b"", 0.1, "HTTP 403 Forbidden")})
        res = live.fetch_sinca_air_quality_aysen(self.tmp)
        self.assertFalse(res.ok)
        self.assertEqual(res.http_status, 403)
        self.assertFalse((self.tmp / live.SINCA_RAW_RELPATH).exists())


# ---------------------------------------------------------------------------
# Circuit Breaker y Last-Known-Good
# ---------------------------------------------------------------------------

class TestCircuitBreakerUnit(unittest.TestCase):
    def test_opens_after_threshold_and_success_resets(self):
        cb = monthly.CircuitBreaker(threshold=2)
        self.assertTrue(cb.allow("host"))
        cb.record_failure("host")
        self.assertTrue(cb.allow("host"))
        cb.record_failure("host")
        self.assertFalse(cb.allow("host"))
        self.assertEqual(cb.state("host"), "open")
        self.assertTrue(cb.allow("otro"))  # grupos independientes
        cb.failures["host"] = 1
        cb.record_success("host")
        self.assertTrue(cb.allow("host"))


class TestOrchestratorProtection(TempRepoCase):
    def make(self, **kw):
        kw.setdefault("run_wp", False)
        kw.setdefault("run_gate", False)
        kw.setdefault("run_live", False)
        return monthly.MonthlyUpdater(self.tmp, **kw)

    def test_failed_stage_restores_modified_and_removes_new_files(self):
        up = self.make()
        up.lkg.capture()
        good = (self.tmp / "data/systemic/01_gob_poder_finanzas.json").read_bytes()

        def corrupt():
            (self.tmp / "data/systemic/01_gob_poder_finanzas.json").write_text("{ roto", encoding="utf-8")
            (self.tmp / "data/raw/social_ambiental/basura.json").write_text("{}", encoding="utf-8")
            return None

        stage = up.protected("etapa_mala", "ingesta_script", "g", corrupt)
        self.assertEqual(stage["status"], "restored")
        self.assertEqual((self.tmp / "data/systemic/01_gob_poder_finanzas.json").read_bytes(), good)
        self.assertFalse((self.tmp / "data/raw/social_ambiental/basura.json").exists())

        # la siguiente etapa sigue funcionando
        def fine():
            (self.tmp / "data/raw/social_ambiental/nuevo.json").write_text('{"a": 1}', encoding="utf-8")
            return None

        self.assertEqual(up.protected("etapa_buena", "ingesta_script", "g2", fine)["status"], "ok")
        self.assertTrue((self.tmp / "data/raw/social_ambiental/nuevo.json").exists())

    def test_exception_and_nonzero_failures_restore_and_open_circuit(self):
        up = self.make(breaker_threshold=2)
        up.lkg.capture()
        before = self.snapshot_bytes()

        def boom():
            (self.tmp / "data/systemic/01_gob_poder_finanzas.json").write_text("[]", encoding="utf-8")
            raise RuntimeError("fallo del script")

        self.assertEqual(up.protected("a", "ingesta_script", "wp", boom)["status"], "restored")
        self.assertEqual(up.protected("b", "ingesta_script", "wp", lambda: "codigo de salida 1")["status"], "restored")
        self.assertEqual(up.protected("c", "ingesta_script", "wp", lambda: None)["status"], "skipped_open_circuit")
        self.assertEqual(self.snapshot_bytes(), before)

    def test_validation_rejects_data_loss(self):
        up = self.make()
        up.lkg.capture()
        before = self.snapshot_bytes()

        def drops_keys():
            (self.tmp / "data/systemic/01_gob_poder_finanzas.json").write_text('{"otra": 1}', encoding="utf-8")

        self.assertEqual(up.protected("pierde_claves", "ingesta_script", "g", drops_keys)["status"], "restored")
        self.assertEqual(self.snapshot_bytes(), before)

    def test_usgs_success_other_sources_down_keeps_everything_else(self):
        feats = [feature(2.6), feature(6.1, place="100 km SW of Chile Chico"), feature(3.9)]
        self.install({"https://earthquake.usgs.gov": live.HttpResponse("", 200, usgs_body(feats), 0.1),
                      "https://sinca.mma.gob.cl": live.HttpResponse("", 403, b"", 0.1, "HTTP 403")})
        before = self.snapshot_bytes()
        up = self.make(run_live=True)
        self.assertEqual(up.run(), 0)

        after = self.snapshot_bytes()
        changed = {k for k in after if before.get(k) != after[k]}
        self.assertIn(live.USGS_RAW_RELPATH.as_posix(), changed)
        self.assertIn("data/systemic/source_watch_manifest.json", changed)
        self.assertEqual(after["data/systemic/01_gob_poder_finanzas.json"],
                         before["data/systemic/01_gob_poder_finanzas.json"])

        manifest = json.loads((self.tmp / "data/systemic/source_watch_manifest.json").read_text(encoding="utf-8"))
        usgs, sinca, other = manifest["sources"]["31"], manifest["sources"]["30"], manifest["sources"]["1"]
        self.assertEqual((usgs["extraction_mode"], usgs["http_status"]), ("live_api", 200))
        self.assertEqual((sinca["extraction_mode"], sinca["http_status"]), ("curated_fallback", 403))
        self.assertEqual(other["extraction_mode"], "curated_fallback")
        self.assertEqual(manifest["generated_at"], up.run_at.isoformat())

        prov = json.loads((self.tmp / "data/systemic/provenance_catalog.json").read_text(encoding="utf-8"))
        node31 = next(n for n in prov["nodes"] if n["id"] == 31)["provenance"]
        self.assertEqual(node31["extractionMode"], "live_api")
        self.assertEqual(node31["lastHttpStatus"], 200)
        self.assertEqual(node31["lastAutoUpdateISO"], up.run_at.isoformat())

        status = json.loads((self.tmp / monthly.STATUS_RELPATH).read_text(encoding="utf-8"))
        self.assertEqual(status["activeApiConnectors"], 7)
        self.assertEqual(status["totalSources"], 3)
        self.assertEqual(status["lastRun"], up.run_at.isoformat())
        self.assertEqual(status["usgs"]["max_magnitude"], 6.1)
        report = (self.tmp / monthly.REPORT_RELPATH).read_text(encoding="utf-8")
        self.assertIn("usgs/usgs | live_api | 200", report)
        self.assertIn("sinca/sinca | curated_fallback | 403", report)

    def test_total_network_outage_loses_no_data(self):
        self.install({})  # todo cae
        before = self.snapshot_bytes()
        up = self.make(run_live=True)
        self.assertEqual(up.run(), 0)
        after = self.snapshot_bytes()
        metadata = {monthly.MANIFEST_RELPATH, monthly.PROVENANCE_RELPATH, monthly.REPORT_RELPATH,
                    monthly.STATUS_RELPATH}
        for rel, content in before.items():
            if rel not in metadata:
                self.assertEqual(after[rel], content, f"{rel} cambio durante una caida total")
        status = json.loads((self.tmp / monthly.STATUS_RELPATH).read_text(encoding="utf-8"))
        self.assertEqual(status["summary"]["live_api"], 0)
        self.assertTrue(all(c["mode"] == "curated_fallback" for c in status["connectors"]))
        # el circuito se abrio para el host caido: las etapas siguientes se omiten sin timeouts
        self.assertTrue(any(s["status"] != "ok" or s["detail"] for s in status["stages"]))

    def test_report_section_is_replaced_not_duplicated(self):
        self.install({})
        for _ in range(2):
            self.make(run_live=True).run()
        report = (self.tmp / monthly.REPORT_RELPATH).read_text(encoding="utf-8")
        self.assertEqual(report.count(monthly.REPORT_BEGIN), 1)
        self.assertEqual(report.count(monthly.REPORT_END), 1)

    def test_failed_quality_gate_rolls_back_whole_base(self):
        feats = [feature(2.6), feature(6.1), feature(3.9)]
        self.install({"https://earthquake.usgs.gov": live.HttpResponse("", 200, usgs_body(feats), 0.1)})
        before = self.snapshot_bytes()
        up = self.make(run_live=True, run_gate=True)
        up.quality_gate = lambda: False
        self.assertEqual(up.run(), 1)
        self.assertEqual(self.snapshot_bytes(), before, "la base debe volver al estado inicial")


# ---------------------------------------------------------------------------
# Workflow de GitHub Actions
# ---------------------------------------------------------------------------

class TestMonthlyWorkflow(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.text = WORKFLOW.read_text(encoding="utf-8")

    def test_file_exists_and_has_no_tabs(self):
        self.assertTrue(WORKFLOW.is_file())
        self.assertNotIn("\t", self.text)

    def test_schedule_is_day_one_at_0900_utc_and_manual_dispatch(self):
        self.assertRegex(self.text, r"(?m)^\s*-\s*cron:\s*'0 9 1 \* \*'\s*$")
        self.assertRegex(self.text, r"(?m)^\s*workflow_dispatch:")

    def test_permissions_allow_pushing_data(self):
        self.assertRegex(self.text, r"(?ms)^permissions:\s*\n\s+contents:\s*write")

    def test_required_steps_in_order(self):
        order = ["python3 scripts/run_monthly_update.py",
                 "python3 scripts/validate_data_lake.py",
                 "node scripts/verify_bundle_sync.cjs",
                 "git status --porcelain data/"]
        positions = [self.text.find(s) for s in order]
        self.assertTrue(all(p >= 0 for p in positions), positions)
        self.assertEqual(positions, sorted(positions))
        self.assertIn('git commit -m "chore(data): actualización mensual automática desde APIs oficiales"', self.text)
        self.assertRegex(self.text, r"(?m)^\s+git push\s*$")

    def test_no_step_ignores_errors(self):
        self.assertNotIn("continue-on-error", self.text)

    def test_parses_as_yaml_when_pyyaml_is_available(self):
        try:
            import yaml  # type: ignore
        except ImportError:
            self.skipTest("PyYAML no instalado")
        doc = yaml.safe_load(self.text)
        triggers = doc.get("on", doc.get(True))
        self.assertEqual(triggers["schedule"][0]["cron"], "0 9 1 * *")
        self.assertIn("workflow_dispatch", triggers)
        self.assertEqual(doc["permissions"]["contents"], "write")


# ---------------------------------------------------------------------------
# Sello en el bundle y en las interfaces
# ---------------------------------------------------------------------------

class TestAutoUpdateSeal(unittest.TestCase):
    def test_builder_exposes_meta_auto_update(self):
        src = (ROOT / "scripts" / "build_aysen_hubs_bundle.cjs").read_text(encoding="utf-8")
        self.assertIn("meta: { autoUpdate: metaAutoUpdate }", src)
        for key in ("frequency", "lastRun", "activeApiConnectors", "totalSources"):
            self.assertIn(key, src)

    def test_bundle_carries_the_seal_data(self):
        text = (ROOT / "data" / "aysen_hubs_data.js").read_text(encoding="utf-8")
        self.assertRegex(text, r'"autoUpdate":\s*\{')
        self.assertIn("Mensual (día 1 de cada mes)", text)
        self.assertRegex(text, r'"activeApiConnectors":\s*7')

    def test_pages_render_flat_seal_without_emojis(self):
        for page in ("index.html", "laboratorio.html"):
            html = (ROOT / page).read_text(encoding="utf-8")
            self.assertIn('id="autoUpdateSeal"', html, page)
            self.assertIn("js/auto_update_seal.js", html, page)
        css = (ROOT / "css" / "apple-design.css").read_text(encoding="utf-8")
        self.assertRegex(css, r"\.auto-update-seal\s*\{[^}]*IBM Plex Mono")
        js = (ROOT / "js" / "auto_update_seal.js").read_text(encoding="utf-8")
        self.assertIsNone(re.search("[\U00010000-\U0010FFFF\u2600-\u27FF]", js))


if __name__ == "__main__":
    unittest.main(verbosity=2)
