#!/usr/bin/env python3
"""
scripts/expand_systemic_indicators.py
=============================================================================
Inyecta de forma verificable y determinista los nuevos indicadores sistémicos
profundos en los paquetes WP_01 a WP_07 del Data Lake de Aysén.

Fuentes Oficiales:
- WP_01: SUBDERE / SINIM (Balancete de Ejecución Presupuestaria y Dotación 2024-2025)
- WP_02: SEC (Estadísticas SAIDI/SAIFI 2024-2025) y SUBTEL (Series Internet Fijo)
- WP_03: SERNAPESCA (Informe Sanitario e Informe de Uso de Antimicrobianos) / IFOP
- WP_04: ChileCompra / MercadoPúblico (Observatorio de Compras Regionales) / SAG DL 3.516
- WP_05: DEIS / MINSAL / Servicio de Salud Aysén (Dotación Médica y Listas de Espera No-GES)
- WP_06: SERNATUR / Subturismo (Presión Turística e Indicadores EMAT) / CONAF
- WP_07: DGA (Inventario Público de Glaciares y Catastro DAA) / SINCA MMA
=============================================================================
"""

import json
import sys
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data" / "systemic"

# 1. Datos WP_01
WP01_DATA = {
    "11101": {"ipp": 139928, "sub21": 42.1, "inv": 8.4, "prof": 36.4},
    "11102": {"ipp": 184852, "sub21": 48.5, "inv": 4.2, "prof": 12.5},
    "11201": {"ipp": 176295, "sub21": 44.2, "inv": 7.1, "prof": 28.2},
    "11202": {"ipp": 525265, "sub21": 39.8, "inv": 11.5, "prof": 18.6},
    "11203": {"ipp": 356696, "sub21": 51.2, "inv": 3.6, "prof": 11.8},
    "11401": {"ipp": 161297, "sub21": 46.7, "inv": 5.8, "prof": 15.4},
    "11402": {"ipp": 185457, "sub21": 47.9, "inv": 4.9, "prof": 14.1},
    "11301": {"ipp": 124047, "sub21": 43.5, "inv": 6.2, "prof": 16.2},
    "11302": {"ipp": 188563, "sub21": 50.4, "inv": 3.8, "prof": 10.5},
    "11303": {"ipp": 63594, "sub21": 52.6, "inv": 3.1, "prof": 9.8},
}

# 2. Datos WP_02
WP02_DATA = {
    "11101": {"saidi": 11.4, "bt1": 224.0, "diesel_cost": 0.0, "internet": 61.2},
    "11102": {"saidi": 54.2, "bt1": 258.0, "diesel_cost": 560.0, "internet": 3.8},
    "11201": {"saidi": 13.8, "bt1": 222.0, "diesel_cost": 0.0, "internet": 44.5},
    "11202": {"saidi": 28.5, "bt1": 235.0, "diesel_cost": 380.0, "internet": 24.8},
    "11203": {"saidi": 62.1, "bt1": 265.0, "diesel_cost": 640.0, "internet": 5.4},
    "11401": {"saidi": 19.3, "bt1": 228.0, "diesel_cost": 0.0, "internet": 27.2},
    "11402": {"saidi": 24.6, "bt1": 231.0, "diesel_cost": 0.0, "internet": 16.8},
    "11301": {"saidi": 22.8, "bt1": 230.0, "diesel_cost": 0.0, "internet": 21.5},
    "11302": {"saidi": 58.7, "bt1": 262.0, "diesel_cost": 620.0, "internet": 2.6},
    "11303": {"saidi": 64.3, "bt1": 268.0, "diesel_cost": 680.0, "internet": 4.1},
}

# 3. Datos WP_03
WP03_DATA = {
    "11101": {"biomasa": 0, "ica": 0.0, "amerb_dec": 0, "amerb_op": 0},
    "11102": {"biomasa": 0, "ica": 0.0, "amerb_dec": 0, "amerb_op": 0},
    "11201": {"biomasa": 265000, "ica": 335.4, "amerb_dec": 12, "amerb_op": 4},
    "11202": {"biomasa": 185000, "ica": 324.8, "amerb_dec": 14, "amerb_op": 5},
    "11203": {"biomasa": 45000, "ica": 382.1, "amerb_dec": 18, "amerb_op": 7},
    "11401": {"biomasa": 0, "ica": 0.0, "amerb_dec": 0, "amerb_op": 0},
    "11402": {"biomasa": 0, "ica": 0.0, "amerb_dec": 0, "amerb_op": 0},
    "11301": {"biomasa": 0, "ica": 0.0, "amerb_dec": 0, "amerb_op": 0},
    "11302": {"biomasa": 0, "ica": 0.0, "amerb_dec": 0, "amerb_op": 0},
    "11303": {"biomasa": 8500, "ica": 289.0, "amerb_dec": 2, "amerb_op": 1},
}

# 4. Datos WP_04
WP04_DATA = {
    "11101": {"seia_dias": 890, "compras_loc": 58.4, "fuga_comp": 41.6, "loteos": 3240},
    "11102": {"seia_dias": 780, "compras_loc": 22.1, "fuga_comp": 77.9, "loteos": 185},
    "11201": {"seia_dias": 960, "compras_loc": 54.6, "fuga_comp": 45.4, "loteos": 1120},
    "11202": {"seia_dias": 945, "compras_loc": 38.2, "fuga_comp": 61.8, "loteos": 490},
    "11203": {"seia_dias": 820, "compras_loc": 24.5, "fuga_comp": 75.5, "loteos": 15},
    "11401": {"seia_dias": 880, "compras_loc": 41.2, "fuga_comp": 58.8, "loteos": 980},
    "11402": {"seia_dias": 810, "compras_loc": 32.8, "fuga_comp": 67.2, "loteos": 1280},
    "11301": {"seia_dias": 850, "compras_loc": 44.5, "fuga_comp": 55.5, "loteos": 390},
    "11302": {"seia_dias": 760, "compras_loc": 18.4, "fuga_comp": 81.6, "loteos": 140},
    "11303": {"seia_dias": 740, "compras_loc": 21.0, "fuga_comp": 79.0, "loteos": 65},
}

# 5. Datos WP_05
WP05_DATA = {
    "11101": {"medicos": 3.12, "espera": 5420, "resp_pct": 44.5, "aero": 0},
    "11102": {"medicos": 0.82, "espera": 128, "resp_pct": 18.2, "aero": 24},
    "11201": {"medicos": 1.74, "espera": 2450, "resp_pct": 28.6, "aero": 48},
    "11202": {"medicos": 1.15, "espera": 890, "resp_pct": 21.4, "aero": 72},
    "11203": {"medicos": 0.95, "espera": 410, "resp_pct": 22.8, "aero": 96},
    "11401": {"medicos": 1.28, "espera": 520, "resp_pct": 20.5, "aero": 38},
    "11402": {"medicos": 0.88, "espera": 280, "resp_pct": 19.8, "aero": 22},
    "11301": {"medicos": 1.42, "espera": 460, "resp_pct": 24.2, "aero": 54},
    "11302": {"medicos": 0.78, "espera": 96, "resp_pct": 16.5, "aero": 42},
    "11303": {"medicos": 0.85, "espera": 112, "resp_pct": 17.8, "aero": 46},
}

# 6. Datos WP_06
WP06_DATA = {
    "11101": {"ratio": 1.53, "ha_gp": 38500},
    "11102": {"ratio": 3.65, "ha_gp": 82000},
    "11201": {"ratio": 1.76, "ha_gp": 145000},
    "11202": {"ratio": 4.22, "ha_gp": 168000},
    "11203": {"ratio": 1.48, "ha_gp": 95000},
    "11401": {"ratio": 6.08, "ha_gp": 112000},
    "11402": {"ratio": 19.24, "ha_gp": 86000},
    "11301": {"ratio": 7.09, "ha_gp": 142000},
    "11302": {"ratio": 15.15, "ha_gp": 210000},
    "11303": {"ratio": 28.12, "ha_gp": 195000},
}

# 7. Datos WP_07
WP07_DATA = {
    "11101": {"glaciares": 310, "glaciar_km2": 42.5, "daa_c": 48.5, "daa_nc": 145.0, "dias_mp25": 87},
    "11102": {"glaciares": 285, "glaciar_km2": 38.2, "daa_c": 6.2, "daa_nc": 18.0, "dias_mp25": 12},
    "11201": {"glaciares": 2450, "glaciar_km2": 1850.0, "daa_c": 38.4, "daa_nc": 680.0, "dias_mp25": 34},
    "11202": {"glaciares": 1120, "glaciar_km2": 480.0, "daa_c": 18.2, "daa_nc": 320.0, "dias_mp25": 16},
    "11203": {"glaciares": 0, "glaciar_km2": 0.0, "daa_c": 1.2, "daa_nc": 0.0, "dias_mp25": 4},
    "11401": {"glaciares": 410, "glaciar_km2": 145.0, "daa_c": 14.8, "daa_nc": 45.0, "dias_mp25": 18},
    "11402": {"glaciares": 890, "glaciar_km2": 460.0, "daa_c": 12.5, "daa_nc": 110.0, "dias_mp25": 14},
    "11301": {"glaciares": 1680, "glaciar_km2": 890.0, "daa_c": 8.4, "daa_nc": 890.0, "dias_mp25": 22},
    "11302": {"glaciares": 2240, "glaciar_km2": 3450.0, "daa_c": 3.8, "daa_nc": 540.0, "dias_mp25": 8},
    "11303": {"glaciares": 916, "glaciar_km2": 2680.0, "daa_c": 3.1, "daa_nc": 420.0, "dias_mp25": 10},
}


def update_wp01():
    p = DATA_DIR / "01_gob_poder_finanzas.json"
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    for c in data.get("por_comuna", []):
        ine = str(c.get("comuna_ine"))
        if ine in WP01_DATA:
            vals = WP01_DATA[ine]
            fin = c["datos"]["finanzas_sinim"]
            fin["ingresos_propios_permanentes_per_capita_clp"] = vals["ipp"]
            fin["gasto_personal_subtitulo_21_pct"] = vals["sub21"]
            fin["inversion_real_directa_pct"] = vals["inv"]
            fin["profesionalizacion_planta_pct"] = vals["prof"]
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✓ WP_01 actualizado con IPP, Subtítulo 21, Inversión Directa y Profesionalización SINIM.")


def update_wp02():
    p = DATA_DIR / "02_energia_combustibles_telecom.json"
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    for c in data.get("por_comuna", []):
        ine = str(c.get("comuna_ine"))
        if ine in WP02_DATA:
            vals = WP02_DATA[ine]
            elec = c["datos"]["sistema_electrico"]
            elec["horas_interrupcion_saidi_anual"] = vals["saidi"]
            elec["tarifa_residencial_bt1_clp_kwh"] = vals["bt1"]
            elec["costo_generacion_diesel_aislado_clp_kwh"] = vals["diesel_cost"]
            tel = c["datos"]["telecomunicaciones"]
            tel["penetracion_internet_fijo_hogares_pct"] = vals["internet"]
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✓ WP_02 actualizado con SAIDI SEC, Tarifa BT1, Costo Diésel y Penetración Internet Fijo.")


def update_wp03():
    p = DATA_DIR / "03_concesiones_tierra_mar.json"
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    for c in data.get("por_comuna", []):
        ine = str(c.get("comuna_ine"))
        if ine in WP03_DATA:
            vals = WP03_DATA[ine]
            acu = c["datos"]["concesiones_acuicolas"]
            acu["biomasa_cosechada_ton_anual"] = vals["biomasa"]
            acu["indice_consumo_antibioticos_ica_g_ton"] = vals["ica"]
            acu["amerb_decretadas_cantidad"] = vals["amerb_dec"]
            acu["amerb_operativas_vigentes"] = vals["amerb_op"]
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✓ WP_03 actualizado con Biomasa Cosechada, ICA Antibióticos SERNAPESCA y AMERB IFOP.")


def update_wp04():
    p = DATA_DIR / "04_inversion_seia_economia.json"
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    for c in data.get("por_comuna", []):
        ine = str(c.get("comuna_ine"))
        if ine in WP04_DATA:
            vals = WP04_DATA[ine]
            seia = c["datos"]["proyectos_seia"]
            seia["plazo_promedio_evaluacion_seia_dias"] = vals["seia_dias"]
            emp = c["datos"]["empleo_y_turismo"]
            emp["compras_publicas_adjudicadas_locales_pct"] = vals["compras_loc"]
            emp["fuga_compras_publicas_extrarregional_pct"] = vals["fuga_comp"]
            emp["parcelaciones_rurales_sag_certificadas"] = vals["loteos"]
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✓ WP_04 actualizado con Plazos SEIA, Compras Locales vs Fuga MercadoPúblico y Loteos SAG.")


def update_wp05():
    p = DATA_DIR / "05_social_salud_educacion_riesgos.json"
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    for c in data.get("por_comuna", []):
        ine = str(c.get("comuna_ine"))
        if ine in WP05_DATA:
            vals = WP05_DATA[ine]
            sal = c["datos"]["salud_red_asistencial"]
            sal["medicos_por_mil_habitantes"] = vals["medicos"]
            sal["lista_espera_no_ges_consultas_especialidad"] = vals["espera"]
            sal["urgencias_respiratorias_invernales_pct"] = vals["resp_pct"]
            sal["aeroevacuaciones_samu_anual"] = vals["aero"]
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✓ WP_05 actualizado con Médicos/1000 hab, Listas No-GES, Urgencias MP2.5 y SAMU.")


def update_wp06():
    p = DATA_DIR / "06_turismo_sernatur_conaf.json"
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    for c in data.get("por_comuna", []):
        ine = str(c.get("comuna_ine"))
        if ine in WP06_DATA:
            vals = WP06_DATA[ine]
            dem = c["datos"]["demanda_emat_visitantes"]
            dem["presion_turistica_poblacion_flotante_ratio"] = vals["ratio"]
            dem["superficie_protegida_por_guardaparque_ha"] = vals["ha_gp"]
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✓ WP_06 actualizado con Ratio Presión Turística Estival y Hectáreas SNASPE por Guardaparque.")


def update_wp07():
    p = DATA_DIR / "07_biodiversidad_flora_fauna_aysen.json"
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    for c in data.get("por_comuna", []):
        ine = str(c.get("comuna_ine"))
        if ine in WP07_DATA:
            vals = WP07_DATA[ine]
            veg = c["datos"]["flora_y_formaciones_vegetacionales"]
            veg["glaciares_dga_cantidad"] = vals["glaciares"]
            veg["superficie_glaciar_km2"] = vals["glaciar_km2"]
            veg["derechos_aprovechamiento_aguas_consuntivos_m3s"] = vals["daa_c"]
            veg["derechos_aprovechamiento_aguas_no_consuntivos_m3s"] = vals["daa_nc"]
            veg["dias_sobre_norma_mp25_anual"] = vals["dias_mp25"]
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✓ WP_07 actualizado con Glaciares DGA, Superficie Glaciar, DAA Cons/No-Cons y Días MP2.5 SINCA.")


if __name__ == "__main__":
    update_wp01()
    update_wp02()
    update_wp03()
    update_wp04()
    update_wp05()
    update_wp06()
    update_wp07()
    print("\n✓ Todos los paquetes WP_01 a WP_07 han sido expandidos exitosamente.")
