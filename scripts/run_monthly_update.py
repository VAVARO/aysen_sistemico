#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
run_monthly_update.py - Orquestador mensual de Aysen Sistemico.

Flujo:
  1. Conectores en vivo (live_api_connectors.py) y scripts scripts/ingesta/wp_NN_*.py.
  2. Circuit Breaker con Last-Known-Good: antes de tocar data/raw/ o data/systemic/ se
     guarda una copia en memoria. Si una etapa falla (timeout, 403/500, vacio, JSON
     corrupto, excepcion o salida de proceso distinta de 0) se restauran los archivos
     que esa etapa modifico y el resto de las fuentes continua. Tras 'umbral' fallos
     consecutivos en un mismo grupo (host o familia de scripts) el circuito se abre y
     las etapas restantes de ese grupo se omiten.
  3. Se actualizan source_watch_manifest.json, source_watch_report.md,
     provenance_catalog.json y auto_update_status.json con la fecha exacta de la
     corrida, el codigo HTTP real y el modo de extraccion (live_api | curated_fallback).
  4. Compuerta de calidad: recompilar data/aysen_hubs_data.js, validar el Data Lake y
     verificar la sincronia del bundle. Si la compuerta falla, se revierte TODO al
     estado inicial (la base nunca queda a medias) y el proceso sale con codigo 1.

Una fuente estatal caida NO es un error: la corrida termina con codigo 0 y el dato
anterior queda intacto. Solo una violacion de integridad da codigo 1.

Uso:
    python scripts/run_monthly_update.py [--skip-live] [--skip-wp] [--skip-gate] [--root RUTA]
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Sequence, Tuple
from urllib.parse import urlparse

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(SCRIPT_DIR / "ingesta"))

import live_api_connectors as live  # noqa: E402

WATCH_DIRS = ("data/raw", "data/systemic")
EXTRA_FILES = ("data/aysen_hubs_data.js",)
STATUS_RELPATH = "data/systemic/auto_update_status.json"
MANIFEST_RELPATH = "data/systemic/source_watch_manifest.json"
REPORT_RELPATH = "data/systemic/source_watch_report.md"
PROVENANCE_RELPATH = "data/systemic/provenance_catalog.json"

FREQUENCY_LABEL = "Mensual (d\u00eda 1 de cada mes)"
WP_SCRIPT_TIMEOUT = 600
REPORT_BEGIN = "<!-- AUTO-UPDATE-BEGIN -->"
REPORT_END = "<!-- AUTO-UPDATE-END -->"

EMOJI_RE = re.compile("[\U00010000-\U0010FFFF\u2600-\u27FF\u2300-\u23FF\u2B50-\u2B55\u200D\uFE0F]")


def utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(microsecond=0)


def log(msg: str) -> None:
    print(msg, flush=True)


# ---------------------------------------------------------------------------
# Last-Known-Good
# ---------------------------------------------------------------------------

class LastKnownGood:
    """Copia en memoria del ultimo estado valido de data/raw/, data/systemic/ y el bundle."""

    def __init__(self, root: Path, watch_dirs: Sequence[str] = WATCH_DIRS,
                 extra_files: Sequence[str] = EXTRA_FILES) -> None:
        self.root = Path(root)
        self.watch_dirs = tuple(watch_dirs)
        self.extra_files = tuple(extra_files)
        self.baseline: Dict[str, bytes] = {}
        self.good: Dict[str, bytes] = {}

    def _rels(self) -> List[str]:
        rels: List[str] = []
        for d in self.watch_dirs:
            base = self.root / d
            if base.exists():
                rels.extend(p.relative_to(self.root).as_posix() for p in base.rglob("*") if p.is_file())
        rels.extend(f for f in self.extra_files if (self.root / f).is_file())
        return sorted(set(r for r in rels if not r.endswith(".tmp")))

    def scan(self) -> Dict[str, Tuple[int, int]]:
        sig = {}
        for rel in self._rels():
            st = (self.root / rel).stat()
            sig[rel] = (st.st_size, st.st_mtime_ns)
        return sig

    def capture(self) -> None:
        self.baseline = {rel: (self.root / rel).read_bytes() for rel in self._rels()}
        self.good = dict(self.baseline)

    @staticmethod
    def diff(before: Dict[str, Tuple[int, int]], after: Dict[str, Tuple[int, int]]) -> List[str]:
        changed = [r for r in after if before.get(r) != after[r]]
        changed += [r for r in before if r not in after]
        return sorted(set(changed))

    def changed_since(self, before: Dict[str, Tuple[int, int]]) -> List[str]:
        """Archivos cuyo contenido difiere realmente del ultimo estado bueno."""
        out = []
        for rel in self.diff(before, self.scan()):
            path = self.root / rel
            if path.is_file():
                if self.good.get(rel) != path.read_bytes():
                    out.append(rel)
            elif rel in self.good:
                out.append(rel)
        return out

    def _restore_from(self, store: Dict[str, bytes], rels: Sequence[str]) -> None:
        for rel in rels:
            path = self.root / rel
            if rel in store:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(store[rel])
            elif path.exists():
                path.unlink()  # archivo nuevo creado por la etapa fallida

    def restore(self, rels: Sequence[str]) -> None:
        self._restore_from(self.good, rels)

    def commit(self, rels: Sequence[str]) -> None:
        for rel in rels:
            path = self.root / rel
            if path.is_file():
                self.good[rel] = path.read_bytes()
            else:
                self.good.pop(rel, None)

    def restore_all(self) -> List[str]:
        current = set(self._rels())
        rels = sorted(current | set(self.baseline))
        touched = [r for r in rels
                   if (r not in self.baseline) or (not (self.root / r).is_file())
                   or (self.baseline[r] != (self.root / r).read_bytes())]
        self._restore_from(self.baseline, touched)
        self.good = dict(self.baseline)
        return touched


# ---------------------------------------------------------------------------
# Circuit Breaker
# ---------------------------------------------------------------------------

class CircuitBreaker:
    """Abre el circuito de un grupo tras `threshold` fallos consecutivos; un exito lo reinicia."""

    CLOSED, OPEN = "closed", "open"

    def __init__(self, threshold: int = 2) -> None:
        self.threshold = threshold
        self.failures: Dict[str, int] = {}

    def state(self, group: str) -> str:
        return self.OPEN if self.failures.get(group, 0) >= self.threshold else self.CLOSED

    def allow(self, group: str) -> bool:
        return self.state(group) == self.CLOSED

    def record_success(self, group: str) -> None:
        self.failures[group] = 0

    def record_failure(self, group: str) -> None:
        self.failures[group] = self.failures.get(group, 0) + 1


# ---------------------------------------------------------------------------
# Validacion de lo que escribe una etapa
# ---------------------------------------------------------------------------

def validate_changed_files(root: Path, lkg: LastKnownGood, rels: Sequence[str]) -> List[str]:
    """Devuelve la lista de problemas encontrados en los archivos modificados por una etapa."""
    problems: List[str] = []
    for rel in rels:
        path = Path(root) / rel
        if not path.is_file():
            if rel.startswith("data/systemic/"):
                problems.append(f"{rel}: archivo sistemico eliminado")
            continue
        raw = path.read_bytes()
        if not raw.strip():
            problems.append(f"{rel}: archivo vacio")
            continue
        lower = rel.lower()
        if lower.endswith((".json", ".geojson")):
            try:
                new = json.loads(raw.decode("utf-8-sig"))
            except (UnicodeDecodeError, ValueError) as exc:
                problems.append(f"{rel}: JSON corrupto ({exc})")
                continue
            if new in ({}, [], None):
                problems.append(f"{rel}: JSON vacio")
                continue
            if lower.endswith(".geojson") and not (isinstance(new, dict) and new.get("features")):
                problems.append(f"{rel}: GeoJSON sin features")
            old_bytes = lkg.good.get(rel)
            if old_bytes is not None and isinstance(new, dict):
                try:
                    old = json.loads(old_bytes.decode("utf-8-sig"))
                except (UnicodeDecodeError, ValueError):
                    old = None
                if isinstance(old, dict):
                    lost = sorted(set(old) - set(new))
                    if lost:
                        problems.append(f"{rel}: perdio claves {lost[:5]}")
                    for k, v in old.items():
                        nv = new.get(k)
                        if isinstance(v, list) and len(v) >= 4 and isinstance(nv, list) and len(nv) < 0.5 * len(v):
                            problems.append(f"{rel}: la lista '{k}' se redujo de {len(v)} a {len(nv)}")
        if lower.endswith((".json", ".geojson", ".md", ".csv")):
            text = raw.decode("utf-8", errors="ignore")
            if EMOJI_RE.search(text):
                problems.append(f"{rel}: contiene emojis")
    return problems


# ---------------------------------------------------------------------------
# Orquestador
# ---------------------------------------------------------------------------

class MonthlyUpdater:
    def __init__(self, root: Path = REPO_ROOT, *, run_live: bool = True, run_wp: bool = True,
                 run_gate: bool = True, breaker_threshold: int = 2) -> None:
        self.root = Path(root)
        self.run_live = run_live
        self.run_wp = run_wp
        self.run_gate = run_gate
        self.lkg = LastKnownGood(self.root)
        self.breaker = CircuitBreaker(breaker_threshold)
        self.stages: List[Dict[str, Any]] = []
        self.results: List[live.ConnectorResult] = []
        self.run_at = utc_now()

    # -- ejecucion protegida de una etapa -------------------------------------
    def protected(self, name: str, kind: str, group: str,
                  fn: Callable[[], Optional[str]],
                  healthy: Optional[Callable[[], bool]] = None) -> Dict[str, Any]:
        """
        Ejecuta `fn` bajo Last-Known-Good. fn devuelve None (ok) o un texto de falla.
        `healthy` permite contar como fallo del circuito una etapa que no escribio nada
        invalido pero cuya fuente respondio mal (timeout, 403, vacio): no hay nada que
        restaurar, porque el conector nunca toco el dato, pero el host suma un fallo.
        """
        stage: Dict[str, Any] = {"name": name, "kind": kind, "group": group, "status": "ok",
                                 "detail": "", "changed_files": []}
        if not self.breaker.allow(group):
            stage.update(status="skipped_open_circuit",
                         detail=f"circuito abierto para '{group}' tras {self.breaker.threshold} fallos consecutivos")
            self.stages.append(stage)
            log(f"  [OMITIDO] {name}: {stage['detail']}")
            return stage
        before = self.lkg.scan()
        started = time.monotonic()
        failure: Optional[str] = None
        try:
            failure = fn()
        except Exception as exc:  # una etapa jamas puede tumbar el orquestador
            failure = f"excepcion {type(exc).__name__}: {exc}"
        changed = self.lkg.changed_since(before)
        if failure is None:
            problems = validate_changed_files(self.root, self.lkg, changed)
            if problems:
                failure = "validacion de salida fallida: " + "; ".join(problems[:4])
        stage["seconds"] = round(time.monotonic() - started, 1)
        if failure is not None:
            self.lkg.restore(changed)
            self.breaker.record_failure(group)
            stage.update(status="restored", detail=failure, changed_files=changed)
            log(f"  [RESTAURADO] {name}: {failure} ({len(changed)} archivo(s) devueltos al ultimo dato valido)")
        else:
            self.lkg.commit(changed)
            if healthy is None or healthy():
                self.breaker.record_success(group)
                label = "OK"
            else:
                self.breaker.record_failure(group)
                label = "RESPALDO"
                stage["detail"] = "fuente sin respuesta valida; se conserva el ultimo dato valido"
            stage.update(changed_files=changed)
            log(f"  [{label}] {name}: {len(changed)} archivo(s) actualizados")
        self.stages.append(stage)
        return stage

    # -- conectores en vivo ----------------------------------------------------
    def _live_jobs(self) -> List[Tuple[str, str, Callable[[], List[live.ConnectorResult]]]]:
        jobs: List[Tuple[str, str, Callable[[], List[live.ConnectorResult]]]] = [
            ("usgs", urlparse(live.USGS_URL).netloc,
             lambda: [live.fetch_usgs_earthquakes_aysen(self.root)]),
        ]
        for topic in live.CKAN_TOPICS:
            jobs.append((f"ckan:{topic['key']}", urlparse(topic["base_url"]).netloc,
                         lambda t=topic: [live.fetch_ckan_topic(t, self.root)]))
        for target in live.ARCGIS_TARGETS:
            cands = live._arcgis_candidates(target)
            host = urlparse(cands[0]).netloc if cands else target["key"]
            jobs.append((f"arcgis:{target['key']}", host,
                         lambda t=target: [live.fetch_arcgis_target(t, self.root)]))
        jobs.append(("sinca", urlparse(live.SINCA_LIST_URL).netloc,
                     lambda: [live.fetch_sinca_air_quality_aysen(self.root)]))
        return jobs

    def run_live_connectors(self) -> None:
        log("[1/4] Conectores en vivo (timeout=12 s por solicitud)")
        for name, group, call in self._live_jobs():
            produced: List[live.ConnectorResult] = []

            def fn(call=call, produced=produced) -> Optional[str]:
                produced.extend(call())
                return None

            stage = self.protected(name, "live_connector", group, fn,
                                   healthy=lambda produced=produced: bool(produced) and all(r.ok for r in produced))
            if stage["status"] == "ok":
                self.results.extend(produced)
                for r in produced:
                    log(f"      {r.connector}/{r.key}: {r.mode} http={r.http_status} {r.error[:90]}")
            else:
                self.results.extend(self._failed_results(name, stage))

    def _failed_results(self, name: str, stage: Dict[str, Any]) -> List[live.ConnectorResult]:
        """Convierte una etapa restaurada/omitida en resultados 'curated_fallback'."""
        kind, _, key = name.partition(":")
        key = key or kind
        nodes: List[int] = []
        connector = kind
        for t in live.CKAN_TOPICS:
            if t["key"] == key:
                nodes, connector = list(t["nodes"]), t["connector"]
        for t in live.ARCGIS_TARGETS:
            if t["key"] == key:
                nodes, connector = list(t["nodes"]), t["connector"]
        if key == "usgs":
            nodes = [31]
        if key == "sinca":
            nodes = [30]
        r = live.ConnectorResult(connector=connector, key=key, nodes=nodes, ok=False,
                                 mode=live.MODE_FALLBACK, checked_at=live.utc_now_iso(),
                                 error=stage["detail"])
        return [r]

    # -- scripts de ingesta ------------------------------------------------------
    def wp_scripts(self) -> List[Path]:
        return sorted((self.root / "scripts" / "ingesta").glob("wp_[0-9][0-9]_*.py"))

    def run_wp_scripts(self) -> None:
        scripts = self.wp_scripts()
        log(f"[2/4] Scripts de ingesta curada ({len(scripts)} paquetes wp_NN)")
        for script in scripts:
            def fn(script=script) -> Optional[str]:
                env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUTF8="1")
                try:
                    proc = subprocess.run([sys.executable, str(script)], cwd=str(self.root), env=env,
                                          capture_output=True, text=True, encoding="utf-8",
                                          errors="replace", timeout=WP_SCRIPT_TIMEOUT)
                except subprocess.TimeoutExpired:
                    return f"timeout de {WP_SCRIPT_TIMEOUT} s"
                if proc.returncode != 0:
                    tail = (proc.stderr or proc.stdout or "").strip().splitlines()[-1:] or ["sin salida"]
                    return f"codigo de salida {proc.returncode}: {tail[0][:160]}"
                return None

            self.protected(script.stem, "ingesta_script", "ingesta_wp", fn)

    # -- metadatos ---------------------------------------------------------------
    def _node_summary(self) -> Dict[str, Dict[str, Any]]:
        """Por nodo: modo, HTTP real y conectores. 'live_api' si algun conector lo refresco."""
        out: Dict[str, Dict[str, Any]] = {}
        for r in self.results:
            for n in r.nodes:
                cur = out.setdefault(str(n), {"extraction_mode": live.MODE_FALLBACK, "http_status": None,
                                              "connectors": []})
                cur["connectors"].append(f"{r.connector}/{r.key}")
                if r.ok:
                    cur["extraction_mode"] = live.MODE_LIVE
                    cur["http_status"] = r.http_status
                elif cur["extraction_mode"] != live.MODE_LIVE and cur["http_status"] is None:
                    cur["http_status"] = r.http_status
        return out

    def _read_json(self, rel: str) -> Optional[Any]:
        path = self.root / rel
        if not path.is_file():
            return None
        return json.loads(path.read_text(encoding="utf-8-sig"))

    def _write_json(self, rel: str, payload: Any) -> None:
        path = self.root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8", newline="\n") as fh:
            json.dump(payload, fh, indent=2, ensure_ascii=False)
            fh.write("\n")

    def update_metadata(self) -> None:
        log("[3/4] Actualizando manifiesto, reporte, procedencia y estado")
        run_iso = self.run_at.isoformat()
        nodes = self._node_summary()

        manifest = self._read_json(MANIFEST_RELPATH)
        total_sources = 0
        if isinstance(manifest, dict):
            manifest["generated_at"] = run_iso
            for sid, entry in manifest.get("sources", {}).items():
                info = nodes.get(sid, {})
                entry["last_run"] = run_iso
                if info.get("http_status") is not None:
                    entry["http_status"] = info.get("http_status")
                else:
                    entry.pop("http_status", None)
                entry["extraction_mode"] = info.get("extraction_mode", live.MODE_FALLBACK)
            total_sources = len(manifest.get("sources", {}))
            self._write_json(MANIFEST_RELPATH, manifest)

        prov = self._read_json(PROVENANCE_RELPATH)
        if isinstance(prov, dict):
            prov["ultima_actualizacion_automatica"] = run_iso
            for node in prov.get("nodes", []):
                info = nodes.get(str(node.get("id")), {})
                p = node.setdefault("provenance", {})
                p["lastAutoUpdateISO"] = run_iso
                if info.get("http_status") is not None:
                    p["lastHttpStatus"] = info.get("http_status")
                else:
                    p.pop("lastHttpStatus", None)
                p["extractionMode"] = info.get("extraction_mode", live.MODE_FALLBACK)
            self._write_json(PROVENANCE_RELPATH, prov)

        self._write_report()

        ok_n = sum(1 for r in self.results if r.ok)
        usgs = next((r for r in self.results if r.connector == "usgs" and r.ok), None)
        status = {
            "frequency": FREQUENCY_LABEL,
            "lastRun": run_iso,
            "activeApiConnectors": len(live.CONNECTOR_IDS),
            "totalSources": total_sources,
            "summary": {"live_api": ok_n, "curated_fallback": len(self.results) - ok_n,
                        "stages_restored": sum(1 for s in self.stages if s["status"] == "restored"),
                        "stages_skipped": sum(1 for s in self.stages if s["status"] == "skipped_open_circuit")},
            "usgs": usgs.metrics if usgs else None,
            "connectors": [r.to_dict() for r in self.results],
            "stages": [{k: v for k, v in s.items() if k != "changed_files"} | {"changed": len(s["changed_files"])}
                       for s in self.stages],
        }
        self._write_json(STATUS_RELPATH, status)

    def _write_report(self) -> None:
        rows = []
        for r in self.results:
            http = r.http_status if r.http_status is not None else "sin respuesta"
            err = (r.error or "").replace("|", "/")[:80]
            rows.append(f"| {r.connector}/{r.key} | {r.mode} | {http} | {', '.join(f'#{n}' for n in r.nodes)} | {err} |")
        block = "\n".join([
            REPORT_BEGIN,
            "## Actualizacion mensual automatica",
            "",
            f"- Corrida: {self.run_at.isoformat()}",
            f"- Ciclo: {FREQUENCY_LABEL}",
            f"- Conectores activos: {len(live.CONNECTOR_IDS)}",
            f"- Resultado: {sum(1 for r in self.results if r.ok)} en vivo, "
            f"{sum(1 for r in self.results if not r.ok)} con respaldo curado (ultimo dato valido)",
            "",
            "| Conector | Modo | HTTP | Nodos | Observacion |",
            "|---|---|---|---|---|",
            *rows,
            REPORT_END,
            "",
        ])
        path = self.root / REPORT_RELPATH
        existing = path.read_text(encoding="utf-8") if path.is_file() else "# Orden de Trabajo: Fuentes del Data Lake de Aysen\n\n"
        if REPORT_BEGIN in existing and REPORT_END in existing:
            head, rest = existing.split(REPORT_BEGIN, 1)
            tail = rest.split(REPORT_END, 1)[1].lstrip("\n")
            new = head + block + "\n" + tail
        else:
            lines = existing.split("\n", 1)
            new = lines[0] + "\n\n" + block + "\n" + (lines[1].lstrip("\n") if len(lines) > 1 else "")
        path.write_text(new.replace("\r\n", "\n"), encoding="utf-8", newline="\n")

    # -- compuerta de calidad ----------------------------------------------------
    def quality_gate(self) -> bool:
        log("[4/4] Compuerta de calidad")
        node = shutil.which("node")
        if not node:
            log("  [FALLO] node no esta disponible en PATH")
            return False
        steps = [
            ("recompilar data/aysen_hubs_data.js", [node, "scripts/build_aysen_hubs_bundle.cjs"]),
            ("validar Data Lake", [sys.executable, "scripts/validate_data_lake.py", "--all"]),
            ("verificar sincronia del bundle", [node, "scripts/verify_bundle_sync.cjs"]),
        ]
        env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUTF8="1")
        for label, cmd in steps:
            proc = subprocess.run(cmd, cwd=str(self.root), env=env, capture_output=True, text=True,
                                  encoding="utf-8", errors="replace", timeout=900)
            if proc.returncode != 0:
                tail = "\n".join((proc.stdout + proc.stderr).strip().splitlines()[-6:])
                log(f"  [FALLO] {label} (codigo {proc.returncode})\n{tail}")
                self.stages.append({"name": label, "kind": "gate", "status": "failed", "detail": tail})
                return False
            log(f"  [OK] {label}")
            self.stages.append({"name": label, "kind": "gate", "status": "ok", "detail": ""})
        return True

    # -- corrida completa --------------------------------------------------------
    def run(self) -> int:
        log(f"Actualizacion mensual Aysen Sistemico - {self.run_at.isoformat()}")
        self.lkg.capture()
        log(f"Last-Known-Good: {len(self.lkg.baseline)} archivos respaldados en memoria")
        if self.run_live:
            self.run_live_connectors()
        if self.run_wp:
            self.run_wp_scripts()
        self.update_metadata()
        if self.run_gate and not self.quality_gate():
            touched = self.lkg.restore_all()
            log(f"RESULTADO: compuerta fallida; base restaurada al estado inicial ({len(touched)} archivo(s)).")
            return 1
        live_n = sum(1 for r in self.results if r.ok)
        log(f"RESULTADO: actualizacion valida. Conectores en vivo: {live_n}/{len(self.results)}; "
            f"el resto conserva el ultimo dato valido.")
        return 0


def main(argv: Optional[Sequence[str]] = None) -> int:
    ap = argparse.ArgumentParser(description="Actualizacion mensual automatizada por API")
    ap.add_argument("--root", default=str(REPO_ROOT), help="raiz del repositorio (por defecto, la actual)")
    ap.add_argument("--skip-live", action="store_true", help="omitir conectores en vivo")
    ap.add_argument("--skip-wp", action="store_true", help="omitir scripts wp_NN")
    ap.add_argument("--skip-gate", action="store_true", help="omitir compuerta (solo desarrollo)")
    args = ap.parse_args(argv)
    updater = MonthlyUpdater(Path(args.root), run_live=not args.skip_live, run_wp=not args.skip_wp,
                             run_gate=not args.skip_gate)
    return updater.run()


if __name__ == "__main__":
    sys.exit(main())
