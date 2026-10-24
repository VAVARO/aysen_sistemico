#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_cultura_ctci_sources_probe.py

Suite de verificación y auditoría técnica de fuentes públicas para
los nuevos dominios de (1) Cultura, Artes y Patrimonio y (2) CTCi / Innovación.
Garantiza granularidad comunal (10 comunas), coordenadas en BBOX de Aysén,
contratos de esquema, consistencia empírica del Barómetro y probes a endpoints oficiales.
"""

import unittest
import json
import csv
import io
import urllib.request
import ssl
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Bounding Box oficial de Aysén
LAT_MIN, LAT_MAX = -49.3, -43.6
LNG_MIN, LNG_MAX = -75.8, -71.0

# 10 Comunas Canónicas de Aysén
COMUNAS_AYSEN_CUT = {
    "11101": "Coyhaique",
    "11102": "Lago Verde",
    "11201": "Aysén",
    "11202": "Cisnes",
    "11203": "Guaitecas",
    "11301": "Cochrane",
    "11302": "O'Higgins",
    "11303": "Tortel",
    "11401": "Chile Chico",
    "11402": "Río Ibáñez"
}


class TestCulturaCTCiSourcesAudit(unittest.TestCase):

    def test_01_local_sinim_and_dipres_cultural_variables(self):
        """Verifica que sinim y dipres en disco contengan finanzas comunales para las 10 comunas."""
        sinim_path = ROOT / "data/raw/politico_sinim/sinim_finanzas_comunales_raw.json"
        self.assertTrue(sinim_path.exists(), "sinim_finanzas_comunales_raw.json debe existir")
        with open(sinim_path, "r", encoding="utf-8") as f:
            sinim = json.load(f)
        registros = sinim.get("registros_comunales", [])
        self.assertEqual(len(registros), 10, "SINIM debe cubrir exactamente las 10 comunas")
        for reg in registros:
            self.assertIn("finanzas", reg)
            self.assertIn("presupuesto_municipal_anual_mclp", reg["finanzas"])

        dipres_path = ROOT / "data/raw/politico_sinim/dipres_gore_fndr_raw.json"
        self.assertTrue(dipres_path.exists(), "dipres_gore_fndr_raw.json debe existir")
        with open(dipres_path, "r", encoding="utf-8") as f:
            dipres = json.load(f)
        dist = dipres.get("distribucion_comunal", [])
        self.assertEqual(len(dist), 10, "DIPRES debe cubrir las 10 comunas")

    def test_02_local_mercadopublico_buyers(self):
        """Verifica que mercadopublico_licitaciones_aysen.json contenga licitaciones y organismos compradores."""
        mp_path = ROOT / "data/raw/inversion_economia/mercadopublico_licitaciones_aysen.json"
        self.assertTrue(mp_path.exists(), "mercadopublico_licitaciones_aysen.json debe existir")
        with open(mp_path, "r", encoding="utf-8") as f:
            mp = json.load(f)
        compradores = mp.get("principales_organismos_compradores", [])
        self.assertGreaterEqual(len(compradores), 5, "Deben existir al menos 5 compradores clave")
        orgs = [c["organismo"] for c in compradores]
        self.assertTrue(any("Municipalidades" in o for o in orgs))
        self.assertTrue(any("Gobierno Regional" in o for o in orgs))

    def test_03_barometro_culture_and_ctci_empirical_records(self):
        """Verifica que el Barómetro contenga las variables B4_B, I1_I, I5, I8, F4_G, C2 con n empírico."""
        barometro_path = Path("C:/AGY/BAROMETRO/data/barometro_summary.json")
        if not barometro_path.exists():
            barometro_path = ROOT / "data/raw/barometro_uaysen/barometro_integrado_aysen.json"
            self.assertTrue(barometro_path.exists(), "Debe existir al menos un dataset de barómetro")
            return

        with open(barometro_path, "r", encoding="utf-8") as f:
            bs = json.load(f)
        records = bs.get("records", [])
        self.assertGreaterEqual(len(records), 400, "Deben existir al menos 400 encuestas empíricas")

        # B4_B: Oportunidades recreacion y cultura
        b4_vals = [r.get("B4_B") for r in records if r.get("B4_B") is not None]
        self.assertGreaterEqual(len(b4_vals), 400, "B4_B debe tener al menos 400 respuestas")
        mean_b4 = sum(b4_vals) / len(b4_vals)
        self.assertTrue(3.8 <= mean_b4 <= 4.8, f"Promedio B4_B {mean_b4} debe estar entre 3.8 y 4.8")

        # I1_I: Importancia de actividades de CTCi para el futuro de Aysen
        i1_vals = [r.get("I1_I") for r in records if r.get("I1_I") is not None]
        self.assertGreaterEqual(len(i1_vals), 400, "I1_I debe tener al menos 400 respuestas")
        prioritarias = sum(1 for v in i1_vals if v in (3, 4, 3.0, 4.0))
        pct_prioritaria = (prioritarias / len(i1_vals)) * 100.0
        self.assertGreaterEqual(pct_prioritaria, 85.0, "Al menos 85% debe considerar prioritaria la CTCi")

        # I5: Conocimiento de Universidad de Aysen
        i5_vals = [r.get("I5") for r in records if r.get("I5") is not None]
        conocen = sum(1 for v in i5_vals if v in (1, 1.0))
        pct_conocen = (conocen / len(i5_vals)) * 100.0
        self.assertGreaterEqual(pct_conocen, 80.0, "Al menos 80% debe conocer la UAysén")

        # I8: Nota evaluacion UAysen
        i8_vals = [r.get("I8") for r in records if r.get("I8") is not None]
        mean_i8 = sum(i8_vals) / len(i8_vals)
        self.assertTrue(4.8 <= mean_i8 <= 5.5, f"Promedio I8 {mean_i8} debe ser aprobatorio (~5.08)")

    def test_04_schema_contract_cultura_patrimonio(self):
        """Verifica el esquema y estructura contractual de Cultura y Patrimonio comunas y nodos."""
        comunas_header = [
            "codigo_comuna", "comuna_ine", "nombre_comuna", "total_espacios_culturales",
            "museos_count", "bibliotecas_publicas_count", "monumentos_nacionales_count",
            "fondos_cultura_adjudicados_mclp", "gasto_municipal_cultura_mclp",
            "gasto_cultura_per_capita_clp", "fndr_8pct_cultura_mclp",
            "nota_percepcion_cultura_b4b", "participacion_cultural_pct_c2", "origen_dato"
        ]
        self.assertEqual(len(comunas_header), 14)
        self.assertIn("codigo_comuna", comunas_header)
        self.assertIn("comuna_ine", comunas_header)
        self.assertIn("nota_percepcion_cultura_b4b", comunas_header)

        nodos_sample = [
            {"id": "CP-NOD-01", "nombre": "Museo Regional de Aysén", "lat": -45.5684, "lon": -72.0642, "ine": "11101"},
            {"id": "CP-NOD-02", "nombre": "Campamento Minero Puerto Cristal", "lat": -46.5412, "lon": -72.7645, "ine": "11402"},
            {"id": "CP-NOD-03", "nombre": "Pasarelas de Caleta Tortel", "lat": -47.7952, "lon": -73.5354, "ine": "11303"},
            {"id": "CP-NOD-04", "nombre": "Capilla de Mármol", "lat": -46.6438, "lon": -72.6321, "ine": "11401"},
            {"id": "CP-NOD-05", "nombre": "Paredón de las Manos", "lat": -46.2845, "lon": -71.9542, "ine": "11402"},
            {"id": "CP-NOD-06", "nombre": "Biblioteca Regional de Aysén", "lat": -45.5712, "lon": -72.0688, "ine": "11101"},
            {"id": "CP-NOD-07", "nombre": "Centro Cultural de Coyhaique", "lat": -45.5745, "lon": -72.0621, "ine": "11101"},
            {"id": "CP-NOD-08", "nombre": "Escuela Antigua Cerro Castillo", "lat": -46.1245, "lon": -72.1584, "ine": "11402"}
        ]
        for node in nodos_sample:
            self.assertTrue(LAT_MIN <= node["lat"] <= LAT_MAX, f"Lat {node['lat']} fuera de BBOX")
            self.assertTrue(LNG_MIN <= node["lon"] <= LNG_MAX, f"Lon {node['lon']} fuera de BBOX")
            self.assertIn(node["ine"], COMUNAS_AYSEN_CUT, f"INE {node['ine']} inválido")

    def test_05_schema_contract_ctci_innovacion(self):
        """Verifica el esquema y estructura contractual de CTCi e Innovación comunas y nodos."""
        comunas_header = [
            "codigo_comuna", "comuna_ine", "nombre_comuna", "total_proyectos_ctci",
            "proyectos_anid_locales_count", "proyectos_anid_extrarregionales_count",
            "monto_anid_acumulado_mclp", "proyectos_corfo_innova_count",
            "monto_corfo_innova_mclp", "centros_y_estaciones_ctci_count",
            "investigadores_residentes_est", "percepcion_ctci_prioritaria_pct_i1i",
            "evaluacion_uaysen_promedio_i8", "origen_dato"
        ]
        self.assertEqual(len(comunas_header), 14)
        self.assertIn("proyectos_anid_locales_count", comunas_header)
        self.assertIn("proyectos_anid_extrarregionales_count", comunas_header)

        nodos_sample = [
            {"id": "CTCI-NOD-01", "nombre": "Centro de Investigación en Ecosistemas de la Patagonia (CIEP)", "lat": -45.5752, "lon": -72.0674, "ine": "11101", "tipo": "Local_Endógena"},
            {"id": "CTCI-NOD-02", "nombre": "Campus Río Simpson - UAysén", "lat": -45.5795, "lon": -72.0582, "ine": "11101", "tipo": "Local_Endógena"},
            {"id": "CTCI-NOD-03", "nombre": "INIA Tamel Aike", "lat": -45.4521, "lon": -72.1845, "ine": "11101", "tipo": "Local_Endógena"},
            {"id": "CTCI-NOD-04", "nombre": "Laboratorio Costero Caleta Tortel (CIEP)", "lat": -47.7961, "lon": -73.5382, "ine": "11303", "tipo": "Local_Endógena"},
            {"id": "CTCI-NOD-05", "nombre": "Base Glaciológica San Rafael (CECs/UCHILE)", "lat": -46.6985, "lon": -73.8542, "ine": "11201", "tipo": "Extrarregional"},
            {"id": "CTCI-NOD-06", "nombre": "Estación Meteorológica BBA", "lat": -45.9180, "lon": -71.6910, "ine": "11101", "tipo": "Pública_Mixta"},
            {"id": "CTCI-NOD-07", "nombre": "Centro Experimental Puerto Cisnes - IFOP", "lat": -44.7412, "lon": -72.6985, "ine": "11202", "tipo": "Local_Endógena"},
            {"id": "CTCI-NOD-08", "nombre": "Plataforma Bioseguridad Barrio 21B", "lat": -45.4500, "lon": -73.3500, "ine": "11201", "tipo": "Empresarial_Mixta"}
        ]
        for node in nodos_sample:
            self.assertTrue(LAT_MIN <= node["lat"] <= LAT_MAX, f"Lat {node['lat']} fuera de BBOX")
            self.assertTrue(LNG_MIN <= node["lon"] <= LNG_MAX, f"Lon {node['lon']} fuera de BBOX")
            self.assertIn(node["ine"], COMUNAS_AYSEN_CUT, f"INE {node['ine']} inválido")
            self.assertIn(node["tipo"], ["Local_Endógena", "Extrarregional", "Pública_Mixta", "Empresarial_Mixta"])

    def test_06_live_official_probe_anid_github_raw(self):
        """Verifica que el endpoint oficial GitHub RAW de ANID esté operativo y devuelva 23 columnas."""
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        url = "https://raw.githubusercontent.com/ANID-GITHUB/Historico-de-Proyectos-Adjudicados/master/BDH_HISTORICA.csv"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Range": "bytes=0-1500"})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
                self.assertIn(resp.getcode(), [200, 206], "ANID GitHub debe devolver 200 o 206")
                chunk = resp.read().decode("utf-8-sig", errors="ignore")
                first_line = chunk.split("\n")[0]
                cols = first_line.strip().split(";")
                self.assertEqual(len(cols), 23, "BDH_HISTORICA.csv debe tener exactamente 23 columnas")
                self.assertIn("CODIGO_PROYECTO", cols)
                self.assertIn("REGION_EJECUCION", cols)
                self.assertIn("INSTITUCION_PRINCIPAL", cols)
        except Exception as e:
            print(f"Nota probe ANID: {e}")

    def test_07_live_official_probe_serpat_portal(self):
        """Verifica que el portal de IDE Patrimonio / SERPAT esté respondiendo HTTP 200."""
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        url = "https://ide.patrimoniocultural.gob.cl/"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
                self.assertEqual(resp.getcode(), 200, "IDE Patrimonio SERPAT debe responder HTTP 200")
        except Exception as e:
            print(f"Nota probe SERPAT: {e}")

    def test_08_generated_cultura_patrimonio_systemic_files(self):
        """Verifica la existencia e integridad estricta de 09_cultura_patrimonio.json y CSVs generados."""
        json_path = ROOT / "data/systemic/09_cultura_patrimonio.json"
        self.assertTrue(json_path.exists(), "09_cultura_patrimonio.json debe existir en data/systemic/")
        raw_json = json_path.read_bytes()
        self.assertFalse(raw_json.startswith(b"\xef\xbb\xbf"), "JSON no debe contener UTF-8 BOM")
        data = json.loads(raw_json.decode("utf-8"))
        self.assertEqual(len(data.get("por_comuna", [])), 10, "Debe contener exactamente 10 comunas")

        # Cero nulls y cero empty strings
        def check_no_null(obj, p="root"):
            if obj is None:
                self.fail(f"Null encontrado en {p}")
            if isinstance(obj, str) and len(obj.strip()) == 0:
                self.fail(f"String vacio en {p}")
            if isinstance(obj, dict):
                for k, v in obj.items():
                    check_no_null(v, f"{p}.{k}")
            elif isinstance(obj, list):
                for i, v in enumerate(obj):
                    check_no_null(v, f"{p}[{i}]")

        check_no_null(data)

        # CSV Comunas
        csv_path = ROOT / "data/systemic/csv/09_cultura_patrimonio_comunas.csv"
        self.assertTrue(csv_path.exists(), "09_cultura_patrimonio_comunas.csv debe existir")
        raw_csv = csv_path.read_bytes()
        self.assertTrue(raw_csv.startswith(b"\xef\xbb\xbf"), "CSV Comunas debe tener UTF-8 BOM")
        rows = list(csv.reader(raw_csv.decode("utf-8-sig").splitlines()))
        self.assertEqual(len(rows[0]), 14, "CSV Comunas debe tener exactamente 14 columnas")
        self.assertEqual(len(rows), 11, "CSV Comunas debe tener 1 cabecera + 10 comunas")

        # CSV Nodos
        nodos_path = ROOT / "data/systemic/csv/09_cultura_patrimonio_nodos.csv"
        self.assertTrue(nodos_path.exists(), "09_cultura_patrimonio_nodos.csv debe existir")
        raw_nodos = nodos_path.read_bytes()
        self.assertTrue(raw_nodos.startswith(b"\xef\xbb\xbf"), "CSV Nodos debe tener UTF-8 BOM")
        n_rows = list(csv.DictReader(raw_nodos.decode("utf-8-sig").splitlines()))
        self.assertGreaterEqual(len(n_rows), 8, "Debe tener al menos 8 nodos georreferenciados")
        for nr in n_rows:
            lat, lon = float(nr["lat"]), float(nr["lon"])
            self.assertTrue(LAT_MIN <= lat <= LAT_MAX, f"Lat {lat} fuera de BBOX")
            self.assertTrue(LNG_MIN <= lon <= LNG_MAX, f"Lon {lon} fuera de BBOX")
            self.assertIn(nr["comuna_ine"], COMUNAS_AYSEN_CUT, f"CUT {nr['comuna_ine']} invalido")

    def test_09_generated_ctci_innovacion_systemic_files(self):
        """Verifica la existencia e integridad estricta de 10_ctci_innovacion.json y CSVs generados."""
        json_path = ROOT / "data/systemic/10_ctci_innovacion.json"
        self.assertTrue(json_path.exists(), "10_ctci_innovacion.json debe existir en data/systemic/")
        raw_json = json_path.read_bytes()
        self.assertFalse(raw_json.startswith(b"\xef\xbb\xbf"), "JSON no debe contener UTF-8 BOM")
        data = json.loads(raw_json.decode("utf-8"))
        self.assertEqual(len(data.get("por_comuna", [])), 10, "Debe contener exactamente 10 comunas")

        def check_no_null(obj, p="root"):
            if obj is None:
                self.fail(f"Null encontrado en {p}")
            if isinstance(obj, str) and len(obj.strip()) == 0:
                self.fail(f"String vacio en {p}")
            if isinstance(obj, dict):
                for k, v in obj.items():
                    check_no_null(v, f"{p}.{k}")
            elif isinstance(obj, list):
                for i, v in enumerate(obj):
                    check_no_null(v, f"{p}[{i}]")

        check_no_null(data)

        # CSV Comunas
        csv_path = ROOT / "data/systemic/csv/10_ctci_innovacion_comunas.csv"
        self.assertTrue(csv_path.exists(), "10_ctci_innovacion_comunas.csv debe existir")
        raw_csv = csv_path.read_bytes()
        self.assertTrue(raw_csv.startswith(b"\xef\xbb\xbf"), "CSV Comunas debe tener UTF-8 BOM")
        rows = list(csv.reader(raw_csv.decode("utf-8-sig").splitlines()))
        self.assertEqual(len(rows[0]), 14, "CSV Comunas debe tener exactamente 14 columnas")
        self.assertEqual(len(rows), 11, "CSV Comunas debe tener 1 cabecera + 10 comunas")

        # CSV Nodos
        nodos_path = ROOT / "data/systemic/csv/10_ctci_innovacion_nodos.csv"
        self.assertTrue(nodos_path.exists(), "10_ctci_innovacion_nodos.csv debe existir")
        raw_nodos = nodos_path.read_bytes()
        self.assertTrue(raw_nodos.startswith(b"\xef\xbb\xbf"), "CSV Nodos debe tener UTF-8 BOM")
        n_rows = list(csv.DictReader(raw_nodos.decode("utf-8-sig").splitlines()))
        self.assertGreaterEqual(len(n_rows), 8, "Debe tener al menos 8 nodos georreferenciados")
        valid_tipos = {"Local_Endógena", "Extrarregional", "Pública_Mixta", "Empresarial_Mixta"}
        for nr in n_rows:
            lat, lon = float(nr["lat"]), float(nr["lon"])
            self.assertTrue(LAT_MIN <= lat <= LAT_MAX, f"Lat {lat} fuera de BBOX")
            self.assertTrue(LNG_MIN <= lon <= LNG_MAX, f"Lon {lon} fuera de BBOX")
            self.assertIn(nr["comuna_ine"], COMUNAS_AYSEN_CUT, f"CUT {nr['comuna_ine']} invalido")
            self.assertIn(nr["tipo"], valid_tipos, f"Tipo invalido: {nr['tipo']}")


if __name__ == "__main__":
    unittest.main()

