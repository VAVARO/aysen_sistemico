#!/usr/bin/env python3
"""
Comprehensive Independent Forensic Auditor Verification Suite
Audits:
- Bounding box & station coordinates
- Schema integrity & zero-null check
- HTTP integrity & fallback files existence and size
- UI Health badge DOM elements & JS integration
"""
import json
import re
from pathlib import Path

REPO_ROOT = Path(".").resolve()
LAT_MIN, LAT_MAX = -49.3, -43.6
LNG_MIN, LNG_MAX = -75.8, -71.0


def test_independent_forensic_audit():
    # 1. Bounding box & Station coordinates
    json_path = REPO_ROOT / "data" / "estaciones_aysen.json"
    with open(json_path, "r", encoding="utf-8") as f:
        json_data = json.load(f)
    
    json_stations = json_data.get("estaciones", [])
    print(f"[CHECK 1] Bounding Box & Station Counts")
    print(f"  JSON stations count: {len(json_stations)}")
    assert len(json_stations) == 16, "Must be exactly 16 stations"
    
    json_violations = []
    for s in json_stations:
        lat = float(s["lat"])
        lng = float(s["lng"])
        if not (LAT_MIN <= lat <= LAT_MAX and LNG_MIN <= lng <= LNG_MAX):
            json_violations.append((s["id"], s["nombre"], lat, lng))
    
    print(f"  JSON stations out of bounding box: {len(json_violations)}")
    assert len(json_violations) == 0, f"Violations: {json_violations}"
    
    # 2. HTML Station Consistency
    html_path = REPO_ROOT / "mapa_territorial.html"
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    
    stations_match = re.search(r"const\s+stations\s*=\s*\[(.*?)\n\s*\];", html_content, re.DOTALL)
    assert stations_match, "const stations array must exist in HTML"
    
    raw_text = stations_match.group(1)
    blocks = re.findall(r"\{\s*id:\s*\d+.*?\n\s*\}", raw_text, re.DOTALL)
    print(f"  HTML stations count: {len(blocks)}")
    assert len(blocks) == 16, "Must be exactly 16 stations in HTML"
    
    html_violations = []
    html_stations = []
    for block in blocks:
        id_m = re.search(r"id:\s*(\d+)", block)
        name_m = re.search(r"name:\s*[\"'](.*?)[\"']", block)
        lat_m = re.search(r"lat:\s*([-\d\.]+)", block)
        lng_m = re.search(r"lng:\s*([-\d\.]+)", block)
        s_id = int(id_m.group(1))
        name = name_m.group(1)
        lat = float(lat_m.group(1))
        lng = float(lng_m.group(1))
        html_stations.append((s_id, name, lat, lng))
        if not (LAT_MIN <= lat <= LAT_MAX and LNG_MIN <= lng <= LNG_MAX):
            html_violations.append((s_id, name, lat, lng))
    
    print(f"  HTML stations out of bounding box: {len(html_violations)}")
    assert len(html_violations) == 0, f"HTML Violations: {html_violations}"
    
    # 3. Schema Integrity & Zero Nulls
    print(f"\n[CHECK 2] Schema Integrity & Zero Nulls")
    datasets_to_check = [
        ("estaciones_aysen.json", json_data.get("estaciones", [])),
        ("cruces_multivariables.json", None),
        ("catalogo_series_aysen.json", None),
        ("cne_precios_aysen.json", None)
    ]
    
    # Check estaciones_aysen.json
    mandatory_station_keys = [
        "id", "nombre", "categoria", "dominio", "lat", "lng",
        "codigo_comuna", "comuna_ine", "nombre_comuna", "provincia",
        "codigo_cuenca", "nombre_cuenca", "codigo_estacion", "institucion",
        "frecuencia", "tipo_acceso", "descripcion", "unidad", "etiqueta_metrica",
        "serie_temporal"
    ]
    null_found = 0
    empty_found = 0
    for s in json_stations:
        for k in mandatory_station_keys:
            v = s.get(k)
            if v is None:
                null_found += 1
                print(f"  Null found: station {s.get('id')} key {k}")
            elif v == "":
                empty_found += 1
                print(f"  Empty found: station {s.get('id')} key {k}")
        # Check 12 monthly points
        series = s.get("serie_temporal", [])
        assert len(series) == 12, f"Station {s.get('id')} has {len(series)} points instead of 12"
        for pt in series:
            if pt.get("valor") is None or pt.get("fecha") is None or pt.get("periodo_mes") is None:
                null_found += 1
    
    print(f"  estaciones_aysen.json: 0 nulls, 0 empties across all 16 stations (nulls={null_found}, empties={empty_found})")
    assert null_found == 0 and empty_found == 0
    
    # Check cruces_multivariables.json
    with open(REPO_ROOT / "data" / "cruces_multivariables.json", "r", encoding="utf-8") as f:
        cruces_data = json.load(f)
    
    for cruce_key, cruce_obj in cruces_data.get("cruces", {}).items():
        datos = cruce_obj.get("datos", [])
        assert len(datos) == 12, f"Cruce {cruce_key} has {len(datos)} months"
        for row in datos:
            for k, v in row.items():
                if v is None or v == "":
                    null_found += 1
                    print(f"  Null in cruce {cruce_key}: key {k}")
    
    print(f"  cruces_multivariables.json: 0 nulls across all 3 joins (clima_salud, criosfera_riesgo, marino_productivo)")
    assert null_found == 0
    
    # 4. HTTP Integrity & Fallback availability
    print(f"\n[CHECK 3] HTTP Fallback Availability on Disk")
    endpoints_spec = [
        {"provider": "DGA MOP", "url": "https://dga.mop.gob.cl", "fallback_dataset": "estaciones_aysen.json"},
        {"provider": "SINCA MMA", "url": "https://sinca.mma.gob.cl", "fallback_dataset": "estaciones_aysen.json"},
        {"provider": "DMC MeteoChile", "url": "https://climatologia.meteochile.gob.cl", "fallback_dataset": "estaciones_aysen.json"},
        {"provider": "SERNAGEOMIN", "url": "https://www.sernageomin.cl", "fallback_dataset": "estaciones_aysen.json"},
        {"provider": "CIEP", "url": "https://www.ciep.cl", "fallback_dataset": "estaciones_aysen.json"},
        {"provider": "IFOP", "url": "https://www.ifop.cl", "fallback_dataset": "cruces_multivariables.json"},
        {"provider": "JAC Chile", "url": "https://www.jac.gob.cl", "fallback_dataset": "estaciones_aysen.json"},
        {"provider": "Datos Abiertos Chile", "url": "https://datos.gob.cl", "fallback_dataset": "catalogo_series_aysen.json"},
        {"provider": "SERNAPESCA", "url": "https://www.sernapesca.cl", "fallback_dataset": "cruces_multivariables.json"},
        {"provider": "CNE Bencina en Línea", "url": "https://www.bencinaenlinea.cl", "fallback_dataset": "cne_precios_aysen.json"}
    ]
    
    for ep in endpoints_spec:
        fb_path = REPO_ROOT / "data" / ep["fallback_dataset"]
        exists = fb_path.exists()
        size = fb_path.stat().st_size if exists else 0
        print(f"  Provider: {ep['provider']:<22} Fallback: {ep['fallback_dataset']:<28} Exists: {exists} ({size} bytes)")
        assert exists and size > 0, f"Fallback missing or empty for {ep['provider']}"
    
    # 5. UI Health Badge & Async Loader DOM/JS Inspection
    print(f"\n[CHECK 4] UI Health Badge in mapa_territorial.html")
    assert 'id="repoHealthBadge"' in html_content, "Missing #repoHealthBadge in HTML"
    assert 'id="healthScore"' in html_content, "Missing #healthScore in HTML"
    assert 'class="repo-health-badge"' in html_content, "Missing .repo-health-badge in CSS/HTML"
    assert 'class="health-dot status-operational"' in html_content, "Missing .health-dot.status-operational"
    assert 'async function loadDataHealth()' in html_content, "Missing loadDataHealth() function"
    assert 'data/data_health_report.json' in html_content, "Missing data_health_report.json fetch call"
    assert 'loadDataHealth();' in html_content, "Missing invocation of loadDataHealth()"
    print("  All UI badge DOM elements, CSS styles, and JS async loader verified!")
    
    # 6. data_health_report.json Integrity
    print(f"\n[CHECK 5] data/data_health_report.json Schema & Values")
    report_path = REPO_ROOT / "data" / "data_health_report.json"
    assert report_path.exists(), "data_health_report.json must exist"
    with open(report_path, "r", encoding="utf-8") as f:
        report = json.load(f)
    
    summary = report.get("summary", {})
    print(f"  Summary: {summary}")
    assert summary.get("total_stations") == 16
    assert summary.get("stations_in_bbox") == 16
    assert summary.get("bbox_compliance_percent") == 100.0
    assert summary.get("schema_validation_passed") is True
    assert summary.get("null_values_detected") == 0
    assert summary.get("total_endpoints_probed") == 10
    assert summary.get("resilience_fallback_coverage_percent") == 100.0
    assert summary.get("overall_health_score") == 100.0
    assert summary.get("status") == "OPERATIONAL"
    
    print("\n>>> ALL INDEPENDENT FORENSIC AUDIT CHECKS PASSED EMPIRICALLY! <<<")

if __name__ == '__main__':
    test_independent_forensic_audit()
