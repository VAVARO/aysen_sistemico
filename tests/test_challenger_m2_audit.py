#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_challenger_m2_audit.py
=============================================================================
Suite de Auditoría y Desafío Empírico Adversarial para Milestone 2 (M2)
Dominio: Ingesta de Datos WP_09 (Cultura y Patrimonio) y WP_10 (CTCi e Innovación)

Verifica empíricamente:
1. 0 nulls y 0 strings vacíos recursivos en 09_cultura_patrimonio.json y 10_ctci_innovacion.json.
2. Cobertura estricta de las 10 comunas canónicas de Aysén (11101 a 11402).
3. Exactamente 14 columnas contractuales en CSVs comunales sin valores vacíos.
4. Presencia de marca UTF-8 BOM (\uFEFF) en los 4 archivos CSV y ausencia en JSONs.
5. Cumplimiento estricto del Bounding Box de Aysén [-49.3, -43.6] Lat, [-75.8, -71.0] Lng.
6. Partición analítica determinística entre CTCi Local Endógena y Extrarregional.
7. Cero emojis en todos los archivos de datos, CSVs y scripts generadores.
8. Invariantes matemáticas, de rango, unicidad de IDs y consistencia cruzada JSON vs. CSV.
=============================================================================
"""

import os
import sys
import json
import csv
import re
import math
import unittest
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent
SYSTEMIC_DIR = ROOT / "data" / "systemic"
CSV_DIR = SYSTEMIC_DIR / "csv"
SCRIPTS_DIR = ROOT / "scripts" / "ingesta"

# Constantes geográficas y administrativas canónicas de Aysén
LAT_MIN, LAT_MAX = -49.3, -43.6
LNG_MIN, LNG_MAX = -75.8, -71.0

COMUNAS_AYSEN_CANONICAS = {
    "11101": ("CL-XI-01", "Coyhaique"),
    "11102": ("CL-XI-02", "Lago Verde"),
    "11201": ("CL-XI-03", "Aysén"),
    "11202": ("CL-XI-04", "Cisnes"),
    "11203": ("CL-XI-05", "Guaitecas"),
    "11401": ("CL-XI-06", "Chile Chico"),
    "11402": ("CL-XI-07", "Río Ibáñez"),
    "11301": ("CL-XI-08", "Cochrane"),
    "11302": ("CL-XI-09", "O'Higgins"),
    "11303": ("CL-XI-10", "Tortel")
}

EXPECTED_CULTURA_COMUNAS_COLS = [
    "codigo_comuna", "comuna_ine", "nombre_comuna", "total_espacios_culturales",
    "museos_count", "bibliotecas_publicas_count", "monumentos_nacionales_count",
    "fondos_cultura_adjudicados_mclp", "gasto_municipal_cultura_mclp",
    "gasto_cultura_per_capita_clp", "fndr_8pct_cultura_mclp",
    "nota_percepcion_cultura_b4b", "participacion_cultural_pct_c2", "origen_dato"
]

EXPECTED_CTCI_COMUNAS_COLS = [
    "codigo_comuna", "comuna_ine", "nombre_comuna", "total_proyectos_ctci",
    "proyectos_anid_locales_count", "proyectos_anid_extrarregionales_count",
    "monto_anid_acumulado_mclp", "proyectos_corfo_innova_count",
    "monto_corfo_innova_mclp", "centros_y_estaciones_ctci_count",
    "investigadores_residentes_est", "percepcion_ctci_prioritaria_pct_i1i",
    "evaluacion_uaysen_promedio_i8", "origen_dato"
]

EXPECTED_CULTURA_NODOS_COLS = [
    "id", "nombre", "tipo", "codigo_comuna", "comuna_ine", "lat", "lng", "lon",
    "source_url", "categoria", "subcategoria", "descripcion", "origen_dato"
]

EXPECTED_CTCI_NODOS_COLS = [
    "id", "nombre", "tipo", "codigo_comuna", "comuna_ine", "lat", "lng", "lon",
    "source_url", "categoria", "vocacion_cientifica", "institucion_titular",
    "investigadores_radicados", "origen_dato"
]

# Regex preciso para bloques Unicode de emojis pictográficos
EMOJI_PATTERN = re.compile(
    r"[\U0001F300-\U0001F5FF]"  # Misc Symbols and Pictographs
    r"|[\U0001F600-\U0001F64F]"  # Emoticons
    r"|[\U0001F680-\U0001F6FF]"  # Transport and Map
    r"|[\U0001F700-\U0001F77F]"  # Alchemical
    r"|[\U0001F780-\U0001F7FF]"  # Geometric Shapes Ext
    r"|[\U0001F800-\U0001F8FF]"  # Supplemental Arrows-C
    r"|[\U0001F900-\U0001F9FF]"  # Supplemental Symbols and Pictographs
    r"|[\U0001FA00-\U0001FA6F]"  # Chess Symbols
    r"|[\U0001FA70-\U0001FAFF]"  # Symbols and Pictographs Ext-A
    r"|[\U00002600-\U000026FF]"  # Misc Symbols
    r"|[\U00002700-\U000027BF]"  # Dingbats
)


class TestChallengerM2Audit(unittest.TestCase):
    """Batería exhaustiva de estrés empírico sobre los productos de datos de M2."""

    @classmethod
    def setUpClass(cls):
        cls.json_cultura = SYSTEMIC_DIR / "09_cultura_patrimonio.json"
        cls.json_ctci = SYSTEMIC_DIR / "10_ctci_innovacion.json"
        cls.csv_cultura_comunas = CSV_DIR / "09_cultura_patrimonio_comunas.csv"
        cls.csv_cultura_nodos = CSV_DIR / "09_cultura_patrimonio_nodos.csv"
        cls.csv_ctci_comunas = CSV_DIR / "10_ctci_innovacion_comunas.csv"
        cls.csv_ctci_nodos = CSV_DIR / "10_ctci_innovacion_nodos.csv"
        cls.script_cultura = SCRIPTS_DIR / "wp_10_cultura_patrimonio.py"
        cls.script_ctci = SCRIPTS_DIR / "wp_11_ctci_anid_corfo.py"

        for p in [cls.json_cultura, cls.json_ctci, cls.csv_cultura_comunas,
                  cls.csv_cultura_nodos, cls.csv_ctci_comunas, cls.csv_ctci_nodos,
                  cls.script_cultura, cls.script_ctci]:
            if not p.exists():
                raise FileNotFoundError(f"Archivo requerido no existe: {p}")

        with open(cls.json_cultura, "r", encoding="utf-8") as f:
            cls.data_cultura = json.load(f)
        with open(cls.json_ctci, "r", encoding="utf-8") as f:
            cls.data_ctci = json.load(f)

    # -------------------------------------------------------------------------
    # 1. TEST ZERO NULLS & ZERO EMPTY STRINGS RECURSIVOS
    # -------------------------------------------------------------------------
    def test_01_zero_nulls_and_empty_strings_cultura_json(self):
        """Verifica recursivamente que 09_cultura_patrimonio.json no tenga nulls, NaNs ni strings vacíos."""
        def check_node(val, path="root"):
            self.assertIsNotNone(val, f"Null detectado en {path}")
            if isinstance(val, str):
                self.assertGreater(len(val.strip()), 0, f"String vacío detectado en {path}")
            elif isinstance(val, float):
                self.assertFalse(math.isnan(val), f"NaN detectado en {path}")
                self.assertFalse(math.isinf(val), f"Inf detectado en {path}")
            elif isinstance(val, dict):
                self.assertGreater(len(val), 0, f"Diccionario vacío detectado en {path}")
                for k, v in val.items():
                    self.assertIsInstance(k, str, f"Clave no string en {path}")
                    self.assertGreater(len(k.strip()), 0, f"Clave vacía en {path}")
                    check_node(v, f"{path}.{k}")
            elif isinstance(val, list):
                self.assertGreater(len(val), 0, f"Lista vacía detectada en {path}")
                for idx, item in enumerate(val):
                    check_node(item, f"{path}[{idx}]")

        check_node(self.data_cultura)

    def test_02_zero_nulls_and_empty_strings_ctci_json(self):
        """Verifica recursivamente que 10_ctci_innovacion.json no tenga nulls, NaNs ni strings vacíos."""
        def check_node(val, path="root"):
            self.assertIsNotNone(val, f"Null detectado en {path}")
            if isinstance(val, str):
                self.assertGreater(len(val.strip()), 0, f"String vacío detectado en {path}")
            elif isinstance(val, float):
                self.assertFalse(math.isnan(val), f"NaN detectado en {path}")
                self.assertFalse(math.isinf(val), f"Inf detectado en {path}")
            elif isinstance(val, dict):
                self.assertGreater(len(val), 0, f"Diccionario vacío detectado en {path}")
                for k, v in val.items():
                    self.assertIsInstance(k, str, f"Clave no string en {path}")
                    self.assertGreater(len(k.strip()), 0, f"Clave vacía en {path}")
                    check_node(v, f"{path}.{k}")
            elif isinstance(val, list):
                self.assertGreater(len(val), 0, f"Lista vacía detectada en {path}")
                for idx, item in enumerate(val):
                    check_node(item, f"{path}[{idx}]")

        check_node(self.data_ctci)

    # -------------------------------------------------------------------------
    # 2. TEST COMUNA COVERAGE (10 COMUNAS CANONICAS 11101-11402)
    # -------------------------------------------------------------------------
    def test_03_comuna_coverage_in_cultura_and_ctci_jsons(self):
        """Verifica que por_comuna en ambos JSONs cubra exactamente las 10 comunas canónicas sin repeticiones."""
        for label, d in [("Cultura", self.data_cultura), ("CTCi", self.data_ctci)]:
            comunas = d.get("por_comuna", [])
            self.assertEqual(len(comunas), 10, f"{label} debe tener exactamente 10 comunas")

            cuts = [c["comuna_ine"] for c in comunas]
            self.assertEqual(len(set(cuts)), 10, f"{label} contiene códigos CUT duplicados")
            self.assertEqual(set(cuts), set(COMUNAS_AYSEN_CANONICAS.keys()),
                             f"{label} no contiene exactamente las 10 comunas oficiales de Aysén")

            for c in comunas:
                cut = c["comuna_ine"]
                exp_codigo, exp_nombre = COMUNAS_AYSEN_CANONICAS[cut]
                self.assertEqual(c["codigo_comuna"], exp_codigo, f"Código comuna no calza en {cut}")
                self.assertEqual(c["nombre_comuna"], exp_nombre, f"Nombre comuna no calza en {cut}")

    def test_04_comuna_coverage_in_both_comunal_csvs(self):
        """Verifica que ambos CSVs comunales tengan 1 cabecera + 10 comunas canónicas."""
        for label, path in [("Cultura Comunas", self.csv_cultura_comunas),
                            ("CTCi Comunas", self.csv_ctci_comunas)]:
            with open(path, "r", encoding="utf-8-sig") as f:
                reader = list(csv.reader(f))
            self.assertEqual(len(reader), 11, f"{label} debe tener exactamente 11 líneas (1 cabecera + 10 comunas)")
            header = reader[0]
            rows = reader[1:]

            cut_idx = header.index("comuna_ine")
            cuts = [r[cut_idx] for r in rows]
            self.assertEqual(set(cuts), set(COMUNAS_AYSEN_CANONICAS.keys()),
                             f"{label} no cubre exactamente las 10 comunas oficiales")

    # -------------------------------------------------------------------------
    # 3. TEST EXACT 14 COLUMNS CONTRACT
    # -------------------------------------------------------------------------
    def test_05_exact_14_columns_cultura_comunas_csv(self):
        """Verifica contrato de exactamente 14 columnas en 09_cultura_patrimonio_comunas.csv."""
        with open(self.csv_cultura_comunas, "r", encoding="utf-8-sig") as f:
            reader = list(csv.reader(f))
        header = reader[0]
        self.assertEqual(len(header), 14, f"Cultura Comunas debe tener exactamente 14 columnas, tiene {len(header)}")
        self.assertEqual(header, EXPECTED_CULTURA_COMUNAS_COLS, "Encabezado de Cultura Comunas no coincide con contrato")

        for idx, row in enumerate(reader[1:], start=2):
            self.assertEqual(len(row), 14, f"Línea {idx} de Cultura Comunas no tiene 14 columnas")
            for col_idx, val in enumerate(row):
                self.assertGreater(len(val.strip()), 0,
                                   f"Línea {idx}, columna {header[col_idx]} contiene valor vacío")

    def test_06_exact_14_columns_ctci_comunas_csv(self):
        """Verifica contrato de exactamente 14 columnas en 10_ctci_innovacion_comunas.csv."""
        with open(self.csv_ctci_comunas, "r", encoding="utf-8-sig") as f:
            reader = list(csv.reader(f))
        header = reader[0]
        self.assertEqual(len(header), 14, f"CTCi Comunas debe tener exactamente 14 columnas, tiene {len(header)}")
        self.assertEqual(header, EXPECTED_CTCI_COMUNAS_COLS, "Encabezado de CTCi Comunas no coincide con contrato")

        for idx, row in enumerate(reader[1:], start=2):
            self.assertEqual(len(row), 14, f"Línea {idx} de CTCi Comunas no tiene 14 columnas")
            for col_idx, val in enumerate(row):
                self.assertGreater(len(val.strip()), 0,
                                   f"Línea {idx}, columna {header[col_idx]} contiene valor vacío")

    # -------------------------------------------------------------------------
    # 4. TEST UTF-8 BOM ON ALL 4 CSVS AND NO BOM IN JSONS
    # -------------------------------------------------------------------------
    def test_07_utf8_bom_on_all_four_csv_files(self):
        """Verifica presencia de cabecera UTF-8 BOM (\\uFEFF) en los 4 archivos CSV para Excel."""
        for path in [self.csv_cultura_comunas, self.csv_cultura_nodos,
                     self.csv_ctci_comunas, self.csv_ctci_nodos]:
            raw_bytes = path.read_bytes()
            self.assertTrue(raw_bytes.startswith(b"\xef\xbb\xbf"),
                            f"Archivo {path.name} NO inicia con UTF-8 BOM (\\uFEFF)")
            decoded = raw_bytes.decode("utf-8-sig")
            self.assertFalse(decoded.startswith("\ufeff"), "utf-8-sig debe consumir la marca BOM")

    def test_08_no_bom_in_json_files(self):
        """Verifica que los archivos JSON sistémicos NO contengan UTF-8 BOM."""
        for path in [self.json_cultura, self.json_ctci]:
            raw_bytes = path.read_bytes()
            self.assertFalse(raw_bytes.startswith(b"\xef\xbb\xbf"),
                             f"Archivo {path.name} contiene BOM indebido")

    # -------------------------------------------------------------------------
    # 5. TEST BOUNDING BOX COMPLIANCE ON ALL NODAL DATASETS
    # -------------------------------------------------------------------------
    def test_09_bbox_compliance_cultura_nodos(self):
        """Verifica que todos los nodos patrimoniales estén estrictamente dentro del BBOX de Aysén."""
        with open(self.csv_cultura_nodos, "r", encoding="utf-8-sig") as f:
            reader = list(csv.DictReader(f))
        self.assertGreaterEqual(len(reader), 10, "Debe haber al menos 10 nodos patrimoniales")
        ids_seen = set()
        for node in reader:
            node_id = node["id"]
            self.assertNotIn(node_id, ids_seen, f"ID duplicado en Cultura: {node_id}")
            ids_seen.add(node_id)

            lat = float(node["lat"])
            lon = float(node["lon"])
            self.assertTrue(LAT_MIN <= lat <= LAT_MAX,
                            f"Nodo Cultura {node_id} lat {lat} fuera de BBOX [{LAT_MIN}, {LAT_MAX}]")
            self.assertTrue(LNG_MIN <= lon <= LNG_MAX,
                            f"Nodo Cultura {node_id} lon {lon} fuera de BBOX [{LNG_MIN}, {LNG_MAX}]")
            self.assertIn(node["comuna_ine"], COMUNAS_AYSEN_CANONICAS,
                          f"Nodo Cultura {node_id} tiene comuna_ine inválida {node['comuna_ine']}")
            self.assertTrue(node["source_url"].startswith("http"),
                            f"URL no válida en {node_id}: {node['source_url']}")

    def test_10_bbox_compliance_ctci_nodos(self):
        """Verifica que todos los nodos CTCi estén estrictamente dentro del BBOX de Aysén."""
        with open(self.csv_ctci_nodos, "r", encoding="utf-8-sig") as f:
            reader = list(csv.DictReader(f))
        self.assertGreaterEqual(len(reader), 10, "Debe haber al menos 10 nodos CTCi")
        ids_seen = set()
        for node in reader:
            node_id = node["id"]
            self.assertNotIn(node_id, ids_seen, f"ID duplicado en CTCi: {node_id}")
            ids_seen.add(node_id)

            lat = float(node["lat"])
            lon = float(node["lon"])
            self.assertTrue(LAT_MIN <= lat <= LAT_MAX,
                            f"Nodo CTCi {node_id} lat {lat} fuera de BBOX [{LAT_MIN}, {LAT_MAX}]")
            self.assertTrue(LNG_MIN <= lon <= LNG_MAX,
                            f"Nodo CTCi {node_id} lon {lon} fuera de BBOX [{LNG_MIN}, {LNG_MAX}]")
            self.assertIn(node["comuna_ine"], COMUNAS_AYSEN_CANONICAS,
                          f"Nodo CTCi {node_id} tiene comuna_ine inválida {node['comuna_ine']}")
            self.assertTrue(node["source_url"].startswith("http"),
                            f"URL no válida en {node_id}: {node['source_url']}")

    # -------------------------------------------------------------------------
    # 6. TEST DETERMINISTIC CTCI PARTITION (LOCAL ENDOGENA VS EXTRARREGIONAL)
    # -------------------------------------------------------------------------
    def test_11_deterministic_ctci_partition_logic(self):
        """Verifica la partición determinística estricta entre CTCi Local Endógena y Extrarregional."""
        resumen = self.data_ctci["resumen_regional"]
        locales = resumen["total_proyectos_anid_locales"]
        extrarregionales = resumen["total_proyectos_anid_extrarregionales"]
        
        self.assertEqual(locales, 68, "Proyectos locales endógenos ANID debe ser exactamente 68")
        self.assertEqual(extrarregionales, 52, "Proyectos extrarregionales ANID debe ser exactamente 52")
        self.assertEqual(locales + extrarregionales, 120, "Total proyectos ANID regional debe sumar 120 exactos")

        # Suma comunal
        comunas = self.data_ctci["por_comuna"]
        sum_loc = sum(c["datos"]["proyectos_anid_locales_count"] for c in comunas)
        sum_ext = sum(c["datos"]["proyectos_anid_extrarregionales_count"] for c in comunas)
        self.assertEqual(sum_loc, 68, f"Suma comunal de proyectos locales ({sum_loc}) no coincide con 68")
        self.assertEqual(sum_ext, 52, f"Suma comunal de proyectos extrarregionales ({sum_ext}) no coincide con 52")

        # Desglose de instituciones principales
        adj = self.data_ctci.get("resumen_anid_adjudicaciones", {})
        ciep = adj.get("adjudicaciones_ciep", 0)
        uaysen = adj.get("adjudicaciones_uaysen", 0)
        uach = adj.get("adjudicaciones_uach", 0)
        uchile = adj.get("adjudicaciones_uchile", 0)
        otras = adj.get("adjudicaciones_otras_instituciones", 0)

        self.assertEqual(ciep, 34, "CIEP debe tener 34 proyectos")
        self.assertEqual(uaysen, 22, "UAysén debe tener 22 proyectos")
        self.assertEqual(uach, 32, "UACh debe tener 32 proyectos")
        self.assertEqual(uchile, 3, "UChile debe tener 3 proyectos")
        self.assertEqual(ciep + uaysen + uach + uchile + otras, 120, "Suma de adjudicaciones debe ser 120")

        # Verificar nodos
        with open(self.csv_ctci_nodos, "r", encoding="utf-8-sig") as f:
            nodos = list(csv.DictReader(f))
        
        valid_tipos = {"Local_Endógena", "Extrarregional", "Pública_Mixta", "Empresarial_Mixta"}
        for n in nodos:
            self.assertIn(n["tipo"], valid_tipos, f"Tipo de nodo inválido: {n['tipo']}")

        tipos_count = {t: sum(1 for n in nodos if n["tipo"] == t) for t in valid_tipos}
        self.assertGreater(tipos_count["Local_Endógena"], 0, "Debe haber nodos clasificados como Local_Endógena")
        self.assertGreater(tipos_count["Extrarregional"], 0, "Debe haber nodos clasificados como Extrarregional")

    # -------------------------------------------------------------------------
    # 7. TEST ZERO EMOJIS IN ALL M2 CODE AND DATA FILES
    # -------------------------------------------------------------------------
    def test_12_zero_emojis_in_all_m2_files(self):
        """Verifica que ningún archivo de datos, CSV o script de M2 contenga emojis."""
        files_to_check = [
            self.json_cultura,
            self.json_ctci,
            self.csv_cultura_comunas,
            self.csv_cultura_nodos,
            self.csv_ctci_comunas,
            self.csv_ctci_nodos,
            self.script_cultura,
            self.script_ctci
        ]

        for p in files_to_check:
            text = p.read_text(encoding="utf-8-sig")
            matches = EMOJI_PATTERN.findall(text)
            self.assertEqual(len(matches), 0,
                             f"Se encontraron {len(matches)} emojis en {p.name}: {matches[:5]}")

    # -------------------------------------------------------------------------
    # 8. TEST MATHEMATICAL / ARITHMETIC INVARIANTS & CROSS-TABLE CONSISTENCY
    # -------------------------------------------------------------------------
    def test_13_cultura_per_capita_and_regional_sums_invariant(self):
        """Verifica que el gasto per cápita sea consistente con la población de cada comuna."""
        pob_by_cut = {c["comuna_ine"]: c["poblacion_censo_2024"]
                      for c in self.data_cultura["por_comuna"] if "poblacion_censo_2024" in c}
        
        # Si no viene en por_comuna directamente, extraer de COMUNAS_METADATA del script
        if not pob_by_cut:
            sys.path.insert(0, str(SCRIPTS_DIR))
            import wp_10_cultura_patrimonio as wp10
            pob_by_cut = {c["comuna_ine"]: c["poblacion_censo_2024"] for c in wp10.COMUNAS_METADATA}

        self.assertEqual(sum(pob_by_cut.values()), 100745, "La suma regional de población Censo 2024 debe ser 100.745")

        for c in self.data_cultura["por_comuna"]:
            cut = c["comuna_ine"]
            d = c["datos"]
            pob = pob_by_cut[cut]
            gasto_mun = d["gasto_municipal_cultura_mclp"]
            per_capita_calculado = round((gasto_mun * 1_000_000.0) / pob)
            self.assertEqual(d["gasto_cultura_per_capita_clp"], per_capita_calculado,
                             f"Gasto per cápita en comuna {cut} no calza con gasto municipal / población")

            # Percepciones en rango
            self.assertTrue(1.0 <= d["nota_percepcion_cultura_b4b"] <= 7.0,
                            f"Nota B4_B fuera de escala chilena 1-7 en {cut}")
            self.assertTrue(0.0 <= d["participacion_cultural_pct_c2"] <= 100.0,
                            f"Participación C2 fuera de rango 0-100% en {cut}")

        resumen = self.data_cultura["resumen_regional"]
        sum_espacios = sum(c["datos"]["total_espacios_culturales"] for c in self.data_cultura["por_comuna"])
        self.assertEqual(resumen["total_espacios_culturales_regional"], sum_espacios,
                         "Total espacios regional no coincide con suma de comunas")

    def test_14_ctci_total_projects_and_percentages_invariant(self):
        """Verifica que la suma de proyectos de CTCi sea exacta en cada comuna y regionalmente."""
        for c in self.data_ctci["por_comuna"]:
            cut = c["comuna_ine"]
            d = c["datos"]
            anid_total = d["proyectos_anid_locales_count"] + d["proyectos_anid_extrarregionales_count"]
            corfo_total = d["proyectos_corfo_innova_count"]
            self.assertEqual(d["total_proyectos_ctci"], anid_total + corfo_total,
                             f"Total proyectos CTCi en {cut} no cuadra con suma ANID + CORFO")

            self.assertTrue(0.0 <= d["percepcion_ctci_prioritaria_pct_i1i"] <= 100.0,
                            f"Porcentaje I1_I fuera de rango en {cut}")
            self.assertTrue(1.0 <= d["evaluacion_uaysen_promedio_i8"] <= 7.0,
                            f"Nota I8 fuera de rango en {cut}")

    def test_15_csv_json_exact_data_alignment(self):
        """Verifica concordancia bidireccional exacta 1:1 entre JSON y CSV para cada comuna."""
        with open(self.csv_cultura_comunas, "r", encoding="utf-8-sig") as f:
            csv_cultura = {r["comuna_ine"]: r for r in csv.DictReader(f)}
        for c in self.data_cultura["por_comuna"]:
            cut = c["comuna_ine"]
            csv_row = csv_cultura[cut]
            d = c["datos"]
            self.assertEqual(int(csv_row["total_espacios_culturales"]), d["total_espacios_culturales"])
            self.assertEqual(int(csv_row["museos_count"]), d["museos_count"])
            self.assertEqual(int(csv_row["bibliotecas_publicas_count"]), d["bibliotecas_publicas_count"])
            self.assertEqual(int(csv_row["monumentos_nacionales_count"]), d["monumentos_nacionales_count"])
            self.assertAlmostEqual(float(csv_row["fondos_cultura_adjudicados_mclp"]), d["fondos_cultura_adjudicados_mclp"], places=1)
            self.assertAlmostEqual(float(csv_row["gasto_municipal_cultura_mclp"]), d["gasto_municipal_cultura_mclp"], places=1)
            self.assertEqual(int(csv_row["gasto_cultura_per_capita_clp"]), d["gasto_cultura_per_capita_clp"])

        with open(self.csv_ctci_comunas, "r", encoding="utf-8-sig") as f:
            csv_ctci = {r["comuna_ine"]: r for r in csv.DictReader(f)}
        for c in self.data_ctci["por_comuna"]:
            cut = c["comuna_ine"]
            csv_row = csv_ctci[cut]
            d = c["datos"]
            self.assertEqual(int(csv_row["total_proyectos_ctci"]), d["total_proyectos_ctci"])
            self.assertEqual(int(csv_row["proyectos_anid_locales_count"]), d["proyectos_anid_locales_count"])
            self.assertEqual(int(csv_row["proyectos_anid_extrarregionales_count"]), d["proyectos_anid_extrarregionales_count"])
            self.assertAlmostEqual(float(csv_row["monto_anid_acumulado_mclp"]), d["monto_anid_acumulado_mclp"], places=1)
            self.assertEqual(int(csv_row["proyectos_corfo_innova_count"]), d["proyectos_corfo_innova_count"])
            self.assertAlmostEqual(float(csv_row["monto_corfo_innova_mclp"]), d["monto_corfo_innova_mclp"], places=1)


if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestChallengerM2Audit)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("\n" + "=" * 80)
    print(f"CHALLENGER M2 EMPIRICAL AUDIT SUMMARY: Ran {result.testsRun} tests.")
    if result.wasSuccessful():
        print("VERDICT: APPROVE (All empirical stress tests and invariants PASSED)")
        sys.exit(0)
    else:
        print("VERDICT: REJECT (Failures or errors detected during stress-testing)")
        sys.exit(1)
