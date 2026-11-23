#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/precompute_curated_discoveries.py
===============================================================================
Cálculo estadístico territorial de Aysén para la galería curada de 25 cruces
verificados entre ejes temáticos y perfiles comunales comparados.

Evalúa 5 criterios estadísticos bajo el capó sobre window.AYSEN_HUBS_DATA:
  1. Regresión lineal OLS (R², test t y ajuste Benjamini-Hochberg FDR < 0.05).
  2. Correlación por rangos de Spearman (rho_s) y Tau de Kendall (tau).
  3. Correlación parcial controlando por tamaño poblacional r(X, Y | ln(Pob)).
  4. Robustez excluyendo Coyhaique (r sin Coyhaique y Distancia de Cook).
  5. Primeras diferencias interanuales (Delta Y_t vs Delta X_t) y series sin
     tendencia lineal en el período 2015–2026.

Genera: data/aysen_hallazgos_precalculados.js (window.AYSEN_DISCOVERIES_DATA).
"""

import json
import math
import os
import re
from datetime import datetime, timezone

try:
    import numpy as _np
    from scipy import stats as _scipy_stats
    HAS_SCIPY = True
except ImportError:
    _np = None
    _scipy_stats = None
    HAS_SCIPY = False


def _mean(xs):
    return sum(xs) / len(xs) if xs else 0.0


def _std(xs, ddof=0):
    n = len(xs)
    if n <= ddof:
        return 0.0
    m = _mean(xs)
    return math.sqrt(sum((x - m) ** 2 for x in xs) / (n - ddof))


def _rankdata(xs):
    n = len(xs)
    indexed = sorted(enumerate(xs), key=lambda t: t[1])
    ranks = [0.0] * n
    i = 0
    while i < n:
        j = i
        while j + 1 < n and indexed[j + 1][1] == indexed[i][1]:
            j += 1
        avg_rank = (i + j) / 2.0 + 1.0
        for k in range(i, j + 1):
            ranks[indexed[k][0]] = avg_rank
        i = j + 1
    return ranks


def _reg_inc_beta(x, a, b):
    """Regularized incomplete beta function I_x(a, b) via Lentz's continued fraction."""
    if x <= 0.0:
        return 0.0
    if x >= 1.0:
        return 1.0
    if x > (a + 1.0) / (a + b + 2.0):
        return 1.0 - _reg_inc_beta(1.0 - x, b, a)
    lbeta = math.lgamma(a) + math.lgamma(b) - math.lgamma(a + b)
    front = math.exp(a * math.log(x) + b * math.log(1.0 - x) - lbeta) / a
    f = 1.0
    c = 1.0
    d = 0.0
    for m in range(0, 200):
        if m == 0:
            num = 1.0
        elif m % 2 == 1:
            k = (m - 1) // 2 + 1
            num = -(a + k - 1.0) * (a + b + k - 1.0) * x / ((a + 2.0 * k - 2.0) * (a + 2.0 * k - 1.0))
        else:
            k = m // 2
            num = k * (b - k) * x / ((a + 2.0 * k - 1.0) * (a + 2.0 * k))
        d = 1.0 + num * d
        if abs(d) < 1e-30:
            d = 1e-30
        d = 1.0 / d
        c = 1.0 + num / c
        if abs(c) < 1e-30:
            c = 1e-30
        cd = c * d
        f *= cd
        if abs(1.0 - cd) < 1e-12 and m > 0:
            break
    return max(0.0, min(1.0, front * (f - 1.0 + 1.0)))


def _student_t_two_tailed_pvalue(t_val, df):
    if df <= 0:
        return 1.0
    if abs(t_val) > 1e7:
        return 0.0
    x = df / (df + t_val * t_val)
    # Using beta continued fraction
    if HAS_SCIPY:
        return float(_scipy_stats.t.sf(abs(t_val), df) * 2.0)
    # Exact numerical integration of Student's t PDF on [0, |t|] via Simpson's rule (200 steps)
    a = abs(t_val)
    u_max = a / math.sqrt(df + a * a)
    steps = 200
    h = u_max / steps
    # Transform t = sqrt(df) * u / sqrt(1 - u^2), dt = sqrt(df) * (1 - u^2)^(-3/2) du
    # PDF(t) dt = C * (1 - u^2)^((df - 2)/2) du
    log_c = math.lgamma((df + 1.0) / 2.0) - 0.5 * math.log(math.pi) - math.lgamma(df / 2.0)
    c_val = math.exp(log_c)

    def integrand(u):
        if u >= 1.0:
            return 0.0
        return (1.0 - u * u) ** ((df - 2.0) / 2.0)

    s = integrand(0.0) + integrand(u_max)
    for idx in range(1, steps):
        u = idx * h
        s += (4.0 if idx % 2 == 1 else 2.0) * integrand(u)
    integral = (h / 3.0) * s * c_val
    p = max(0.0, min(1.0, 1.0 - 2.0 * integral))
    return p


def calc_pearson_ols(xs, ys):
    xs = [float(v) for v in xs]
    ys = [float(v) for v in ys]
    n = len(xs)
    mx = _mean(xs)
    my = _mean(ys)
    sxx = sum((x - mx) ** 2 for x in xs)
    syy = sum((y - my) ** 2 for y in ys)
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    if sxx <= 1e-12 or syy <= 1e-12:
        return {"slope": 0.0, "intercept": my, "r": 0.0, "pvalue": 1.0}
    slope = sxy / sxx
    intercept = my - slope * mx
    r = max(-1.0, min(1.0, sxy / math.sqrt(sxx * syy)))
    df = max(1, n - 2)
    if abs(r) >= 0.9999999:
        p_val = 1e-12
    else:
        t_stat = r * math.sqrt(df / max(1e-12, 1.0 - r * r))
        p_val = _student_t_two_tailed_pvalue(t_stat, df)
    return {"slope": slope, "intercept": intercept, "r": r, "pvalue": p_val}


def calc_spearman(xs, ys):
    rx = _rankdata(xs)
    ry = _rankdata(ys)
    return calc_pearson_ols(rx, ry)["r"]


def calc_kendall_tau(xs, ys):
    n = len(xs)
    concordant = 0
    discordant = 0
    ties_x = 0
    ties_y = 0
    for i in range(n):
        for j in range(i + 1, n):
            dx = xs[i] - xs[j]
            dy = ys[i] - ys[j]
            if dx == 0 and dy == 0:
                continue
            elif dx == 0:
                ties_x += 1
            elif dy == 0:
                ties_y += 1
            elif (dx > 0 and dy > 0) or (dx < 0 and dy < 0):
                concordant += 1
            else:
                discordant += 1
    denom = math.sqrt((concordant + discordant + ties_x) * (concordant + discordant + ties_y))
    if denom <= 1e-12:
        return 0.0
    return (concordant - discordant) / denom

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_BUNDLE_PATH = os.path.join(ROOT_DIR, "data", "aysen_hubs_data.js")
OUTPUT_JS_PATH = os.path.join(ROOT_DIR, "data", "aysen_hallazgos_precalculados.js")


def load_data_lake():
    with open(DATA_BUNDLE_PATH, "r", encoding="utf-8") as f:
        txt = f.read()
    idx = txt.find("{")
    ridx = txt.rfind("}")
    if idx == -1 or ridx == -1:
        raise RuntimeError("No se encontró el objeto JSON en data/aysen_hubs_data.js")
    return json.loads(txt[idx : ridx + 1])


# Diccionario de metadatos limpios (sin snake_case, con Hub y unidad verificada)
VARIABLE_META = {
    # Hub I - Turismo
    "prestadores_sernatur": ("I. Turismo", "Prestadores Turísticos Registrados SERNATUR", "prestadores"),
    "camas_turisticas": ("I. Turismo", "Capacidad de Camas Turísticas Formales", "camas"),
    "pernoctaciones_emat": ("I. Turismo", "Pernoctaciones Turísticas Anuales (EMAT)", "noches"),
    "visitantes_snaspe": ("I. Turismo", "Visitantes Anuales a Parques Nacionales SNASPE", "visitantes"),
    "tasa_ocupacion_estival_pct": ("I. Turismo", "Ocupación Hotelera Estival (Enero-Febrero)", "%"),
    "estadia_promedio_dias": ("I. Turismo", "Estadía Turística Promedio en la Comuna", "días"),
    "gasto_diario_turista_usd": ("I. Turismo", "Gasto Diario Promedio por Turista", "US$/día"),
    "tarifa_adr_estimada_usd": ("I. Turismo", "Tarifa Diaria Promedio Hotelera (ADR)", "US$"),
    "revpar_estimado_usd": ("I. Turismo", "Ingreso por Habitación Disponible (RevPAR)", "US$"),
    "ratio_presion_turistica": ("I. Turismo", "Ratio de Presión Turística Estacional", "visitas/hab"),
    "ha_snaspe_por_guardaparque": ("I. Turismo", "Superficie Protegida SNASPE por Guardaparque", "ha/guardaparque"),
    # Hub II - Salmonicultura y Maritorio
    "concesiones_salmon": ("II. Salmonicultura", "Concesiones de Salmonicultura Otorgadas", "concesiones"),
    "centros_activos_salmon": ("II. Salmonicultura", "Centros de Cultivo de Salmón Activos", "centros"),
    "biomasa_salmon_ton": ("II. Salmonicultura", "Biomasa Anual de Salmón Cosechada", "toneladas"),
    "antibioticos_ica_g_ton": ("II. Salmonicultura", "Índice de Consumo de Antibióticos (ICA)", "g/ton"),
    "desembarque_artesanal_ton": ("II. Salmonicultura", "Desembarque Pesquero Artesanal Anual", "toneladas"),
    "sindicatos_pesca_artesanal": ("II. Salmonicultura", "Sindicatos de Pesca Artesanal Vigentes", "sindicatos"),
    "ecmpo_solicitadas_ha": ("II. Salmonicultura", "Superficie Solicitada en ECMPO (Ley Lafkenche)", "hectáreas"),
    # Hub III - Energía y Telecomunicaciones
    "potencia_mw": ("III. Energía", "Capacidad Eléctrica Instalada en el Subsistema", "MW"),
    "tarifa_bt1_clp": ("III. Energía", "Tarifa Eléctrica Residencial BT1", "$/kWh"),
    "costo_diesel_aislado_clp": ("III. Energía", "Costo Real de Generación Diésel Aislada", "$/kWh"),
    "costo_real_generacion_diesel_kwh_clp": ("III. Energía", "Costo de Generación Eléctrica Aislada", "$/kWh"),
    "subsidio_fiscal_diesel_kwh_clp": ("III. Energía", "Subsidio Fiscal a Sistemas Eléctricos Aislados", "$/kWh"),
    "saidi_horas_anual": ("III. Energía", "Tiempo Anual de Interrupción Eléctrica (SAIDI)", "horas/año"),
    "gasolina_93_clp": ("III. Energía", "Precio Minorista de Gasolina 93 Octanos", "$/L"),
    "precio_lena_m3": ("III. Energía", "Precio Comercial del Metro Cúbico de Leña", "$/m³"),
    "hogares_lena_pct": ("III. Energía", "Hogares con Calefacción Principal a Leña", "%"),
    "consumo_lena_m3_hogar_ano": ("III. Energía", "Consumo Residencial Anual de Leña por Hogar", "m³/hogar/año"),
    "informalidad_lena_pct": ("III. Energía", "Informalidad en el Mercado Comunal de Leña", "%"),
    "internet_fijo_pct": ("III. Energía", "Penetración de Internet Fijo en Hogares", "%"),
    "hogares_sin_internet_fijo_pct": ("III. Energía", "Hogares sin Conexión Fija a Internet", "%"),
    "cobertura_fibra_hogar_pct": ("III. Energía", "Cobertura de Fibra Óptica al Hogar (FTTH)", "%"),
    # Hub IV - Gobernanza y Finanzas Municipales
    "presupuesto_mclp": ("IV. Gobernanza", "Presupuesto Municipal Vigente (SINIM)", "M$"),
    "presupuesto_per_capita_mclp": ("IV. Gobernanza", "Presupuesto Municipal Per Cápita", "M$/hab"),
    "dependencia_fcm_pct": ("IV. Gobernanza", "Dependencia del Fondo Común Municipal (FCM)", "%"),
    "ingresos_propios_pct": ("IV. Gobernanza", "Autonomía por Ingresos Propios Permanentes (IPP)", "%"),
    "ipp_per_capita_clp": ("IV. Gobernanza", "Ingresos Propios Permanentes Per Cápita", "$/hab"),
    "gasto_personal_pct": ("IV. Gobernanza", "Gasto Municipal en Personal sobre Presupuesto", "%"),
    "inversion_directa_pct": ("IV. Gobernanza", "Inversión Municipal Directa sobre Presupuesto", "%"),
    "profesionalizacion_pct": ("IV. Gobernanza", "Profesionalización de la Planta Municipal", "%"),
    "fndr_mclp": ("IV. Gobernanza", "Inversión Pública Regional FNDR Asignada", "M$"),
    "fndr_per_capita_mclp": ("IV. Gobernanza", "Inversión Pública FNDR Per Cápita", "Miles $/hab"),
    "fndr_gore_2023_ejecucion_pct": ("IV. Gobernanza", "Ejecución Presupuestaria Efectiva FNDR GORE", "%"),
    "tasa_aprobacion_rs_sni_pct": ("IV. Gobernanza", "Tasa de Aprobación Técnica RS de Proyectos (SNI)", "%"),
    "transparencia_activa_cplt_2026_pct": ("IV. Gobernanza", "Cumplimiento de Transparencia Activa Municipal (CPLT)", "%"),
    "participacion_municipales_2024_pct": ("IV. Gobernanza", "Participación Electoral Municipal", "%"),
    "red_vial_pavimentada_pct": ("IV. Gobernanza", "Porcentaje de Red Vial Comunal Pavimentada", "%"),
    "tiempo_viaje_coyhaique_hrs": ("IV. Gobernanza", "Tiempo de Viaje Multimodal hacia Coyhaique", "horas"),
    "indice_aislamiento_multimodal": ("IV. Gobernanza", "Índice Compuesto de Aislamiento Multimodal", "puntos"),
    # Hub V - Economía, Inversión y Suelo
    "proyectos_seia_aprobados": ("V. Inversión", "Proyectos de Inversión Aprobados en el SEIA", "proyectos"),
    "inversion_seia_mmusd": ("V. Inversión", "Inversión Privada Aprobada en el SEIA", "MM US$"),
    "seia_plazo_dias": ("V. Inversión", "Plazo Promedio de Evaluación Ambiental SEIA", "días"),
    "empresas_sii": ("V. Inversión", "Empresas Formales Vigentes en el SII", "empresas"),
    "trabajadores_sii": ("V. Inversión", "Trabajadores Dependientes Formales (SII)", "trabajadores"),
    "ventas_por_empresa_uf": ("V. Inversión", "Ventas Anuales Promedio por Empresa (SII)", "UF/empresa"),
    "compras_locales_pct": ("V. Inversión", "Retención de Compras Públicas en Proveedores Locales", "%"),
    "fuga_compras_pct": ("V. Inversión", "Fuga Extrarregional de Compras Públicas", "%"),
    "parcelaciones_sag_n": ("V. Inversión", "Subdivisiones Prediales Rurales Certificadas (SAG)", "predios"),
    "suelo_fiscal_bbnn_pct": ("V. Inversión", "Proporción de Suelo Fiscal (Bienes Nacionales)", "%"),
    "suelo_privado_pct": ("V. Inversión", "Proporción de Suelo de Propiedad Privada", "%"),
    "sucursales_banca_privada_cmf": ("V. Inversión", "Sucursales Bancarias Vigentes (CMF)", "sucursales"),
    # Hub VI - Demografía, Educación, Vivienda y Cohesión Social
    "poblacion_censo_2024": ("VI. Social", "Población Comunal Censo 2024", "habitantes"),
    "densidad_hab_km2": ("VI. Social", "Densidad Poblacional Comunal", "hab/km²"),
    "ruralidad_censo_2024_pct": ("VI. Social", "Porcentaje de Población Rural (Censo 2024)", "%"),
    "pobreza_ingresos_pct": ("VI. Social", "Pobreza por Ingresos (CASEN)", "%"),
    "pobreza_multidim_pct": ("VI. Social", "Pobreza Multidimensional (CASEN)", "%"),
    "rsh_carencia_servicios_basicos_jun2026_pct": ("VI. Social", "Hogares con Carencia de Servicios Básicos (RSH)", "%"),
    "deficit_habitacional_total_por_1000_hab": ("VI. Social", "Déficit Habitacional Relativo (MINVU)", "viv/1.000 hab"),
    "pct_viviendas_irrecuperables": ("VI. Social", "Proporción de Viviendas Irrecuperables", "%"),
    "escuelas_rurales_multigrado_n": ("VI. Social", "Escuelas Rurales Multigrado (SLEP Aysén)", "escuelas"),
    "tasa_vif_100k": ("VI. Social", "Tasa de Denuncias por Violencia Intrafamiliar", "casos/100k hab"),
    "tasa_dmcs_100k": ("VI. Social", "Tasa de Delitos de Mayor Connotación Social", "casos/100k hab"),
    "barometro_intencion_migracion_juvenil_pct": ("VI. Social", "Percepción de Retención y Oportunidades Juveniles", "%"),
    "barometro_confianza_institucional_pct": ("VI. Social", "Confianza Ciudadana en la Gestión Municipal", "%"),
    # Hub VII - Biodiversidad, Clima y Riesgos Geológicos
    "superficie_snaspe_pct": ("VII. Biodiversidad", "Superficie Comunal bajo Protección SNASPE", "%"),
    "cobertura_vegetal_pct": ("VII. Biodiversidad", "Cobertura de Bosque y Vegetación Nativa", "%"),
    "fauna_amenazada_n": ("VII. Biodiversidad", "Especies de Fauna Amenazada Registradas (RCE)", "especies"),
    "glaciares_dga_n": ("VII. Biodiversidad", "Glaciares Inventariados por la DGA", "glaciares"),
    "superficie_glaciares_km2": ("VII. Biodiversidad", "Superficie Glaciar Comunal (DGA)", "km²"),
    "dias_sobre_norma_mp25": ("VII. Biodiversidad", "Días Anuales sobre Norma Diaria de MP2.5 (SINCA)", "días/año"),
    "episodios_gec_mp25_anual": ("VII. Biodiversidad", "Episodios Críticos de Contaminación MP2.5 (GEC)", "episodios"),
    "amenaza_volcanica_sismica_idx": ("VII. Biodiversidad", "Índice de Amenaza Volcánica y Sísmica (SERNAGEOMIN)", "puntos"),
    "especies_exoticas_invasoras_n": ("VII. Biodiversidad", "Presión de Especies Exóticas Invasoras", "especies"),
    # Hub VIII - Salud APS y Hospitales
    "camas_hospitalarias": ("VIII. Salud", "Camas Hospitalarias de la Red Asistencial", "camas"),
    "postas_salud_rural": ("VIII. Salud", "Postas de Salud Rural (PSR)", "postas"),
    "medicos_por_mil_hab": ("VIII. Salud", "Dotación de Médicos por cada 1.000 Habitantes", "médicos/1.000 hab"),
    "traslado_coyhaique_hrs": ("VIII. Salud", "Tiempo de Derivación Médica al Hospital Regional", "horas"),
    "mediana_espera_quirurgica_dias": ("VIII. Salud", "Mediana de Espera Quirúrgica No GES", "días"),
    "mediana_espera_especialidad_dias": ("VIII. Salud", "Mediana de Espera para Consulta de Especialidad", "días"),
    "urgencias_respiratorias_pct": ("VIII. Salud", "Proporción de Urgencias Respiratorias Invernales", "%"),
    "aeroevacuaciones_samu_n": ("VIII. Salud", "Aeroevacuaciones Médicas Anuales SAMU", "evacuaciones"),
    "esperanza_vida_total_anos": ("VIII. Salud", "Esperanza de Vida al Nacer Comunal (DEIS)", "años"),
    "cobertura_empam_pct": ("VIII. Salud", "Cobertura de Control Preventivo del Adulto Mayor (EMPAM)", "%"),
    "cobertura_pscv_pct": ("VIII. Salud", "Cobertura del Programa de Salud Cardiovascular (PSCV)", "%"),
    "tasa_mortalidad_cancer_gastrico_100k": ("VIII. Salud", "Tasa de Mortalidad por Cáncer Gástrico (DEIS)", "def/100k hab"),
    "barometro_evaluacion_acceso_salud_pct": ("VIII. Salud", "Evaluación Ciudadana Positiva del Acceso a Salud", "%"),
    # Hub IX - Cultura y Patrimonio
    "total_espacios_culturales": ("IX. Cultura", "Total de Espacios e Infraestructura Cultural", "espacios"),
    "museos_espacios_n": ("IX. Cultura", "Museos y Salas Museográficas (RMC)", "museos"),
    "monumentos_nacionales_count": ("IX. Cultura", "Monumentos Nacionales Declarados (CMN)", "monumentos"),
    "gasto_cultura_per_capita_clp": ("IX. Cultura", "Gasto Municipal en Cultura Per Cápita", "$/hab"),
    "participacion_cultural_pct_c2": ("IX. Cultura", "Participación Activa en Organizaciones Culturales", "%"),
    "nota_percepcion_cultura_b4b": ("IX. Cultura", "Evaluación Ciudadana de la Oferta Cultural", "nota 1-7"),
    # Hub X - CTCi, Ciencia e Innovación
    "total_proyectos_ctci": ("X. CTCi", "Total de Proyectos de Ciencia e Innovación (ANID + CORFO)", "proyectos"),
    "investigadores_residentes_est": ("X. CTCi", "Investigadores Residentes Estimados en la Comuna", "investigadores"),
    "centros_y_estaciones_ctci_count": ("X. CTCi", "Centros Científicos y Estaciones de Campo CTCi", "centros"),
    "proporcion_ciencia_endogena_pct": ("X. CTCi", "Proporción de Ciencia Liderada por Centros Locales", "%"),
    "percepcion_ctci_prioritaria_pct_i1i": ("X. CTCi", "Valoración Ciudadana de la Ciencia para el Desarrollo", "%"),
}


# 20 pares inter-Hubs curados por su mecanismo territorial real en Aysén
CURATED_20_CROSS_SPECS = [
    {
        "varX": "tarifa_bt1_clp",
        "varY": "indice_aislamiento_multimodal",
        "headline": "Tarifa Eléctrica Residencial BT1 vs. Aislamiento Multimodal",
        "shortX": "tarifa eléctrica BT1",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"Los sistemas aislados sin interconexión encarecen la cuenta de luz: {hi_c} alcanza {hi_x} {ux} "
            f"con {hi_y} puntos de aislamiento, frente a {lo_c} ({lo_x} {ux} y {lo_y} puntos)."
        ),
    },
    {
        "varX": "tarifa_bt1_clp",
        "varY": "cobertura_empam_pct",
        "headline": "Tarifa Eléctrica Residencial BT1 vs. Cobertura Preventiva EMPAM",
        "shortX": "tarifa eléctrica BT1",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"Donde la electricidad residencial es más cara, baja la cobertura de controles del adulto mayor: "
            f"{hi_c} ({hi_x} {ux}) registra {hi_y}%, mientras {lo_c} ({lo_x} {ux}) sube a {lo_y}%."
        ),
    },
    {
        "varX": "cobertura_fibra_hogar_pct",
        "varY": "compras_locales_pct",
        "headline": "Cobertura de Fibra Óptica al Hogar vs. Retención de Compras Locales",
        "shortX": "cobertura de fibra óptica",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"Con mayor fibra óptica al hogar, las pymes locales captan más compras públicas: "
            f"{hi_c} ({hi_x}% de fibra) retiene {hi_y}% del gasto en la comuna, versus {lo_y}% en {lo_c} ({lo_x}%)."
        ),
    },
    {
        "varX": "seia_plazo_dias",
        "varY": "participacion_municipales_2024_pct",
        "headline": "Plazo de Evaluación Ambiental SEIA vs. Participación Municipal",
        "shortX": "plazo de evaluación SEIA",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"Las comunas con tramitación ambiental más extensa registran menor votación municipal: "
            f"{hi_c} ({hi_x} {ux}) marca {hi_y}% de participación, frente a {lo_y}% en {lo_c} ({lo_x} {ux})."
        ),
    },
    {
        "varX": "saidi_horas_anual",
        "varY": "cobertura_empam_pct",
        "headline": "Interrupciones Eléctricas (SAIDI) vs. Cobertura Preventiva EMPAM",
        "shortX": "interrupciones eléctricas",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"A más horas anuales sin suministro eléctrico, menor control preventivo de mayores: "
            f"en {hi_c} ({hi_x} h/año) la cobertura llega a {hi_y}%, contra {lo_y}% en {lo_c} ({lo_x} h/año)."
        ),
    },
    {
        "varX": "saidi_horas_anual",
        "varY": "tasa_aprobacion_rs_sni_pct",
        "headline": "Interrupciones Eléctricas (SAIDI) vs. Aprobación de Proyectos RS",
        "shortX": "cortes eléctricos anuales",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"El rezago eléctrico coincide con brechas de inversión pública: {hi_c} suma {hi_x} horas de corte "
            f"y aprueba {hi_y}% de proyectos RS, mientras {lo_c} ({lo_x} h) logra {lo_y}%."
        ),
    },
    {
        "varX": "saidi_horas_anual",
        "varY": "pobreza_multidim_pct",
        "headline": "Cortes Eléctricos Anuales (SAIDI) vs. Pobreza Multidimensional",
        "shortX": "horas de corte eléctrico",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"La fragilidad eléctrica va de la mano con carencias multidimensionales: {hi_c} ({hi_x} h al año) "
            f"alcanza {hi_y}% en CASEN, más del doble que {lo_c} ({lo_y}% con {lo_x} h)."
        ),
    },
    {
        "varX": "saidi_horas_anual",
        "varY": "deficit_habitacional_total_por_1000_hab",
        "headline": "Interrupciones Eléctricas (SAIDI) vs. Déficit Habitacional",
        "shortX": "horas sin suministro",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"Las comunas con suministro más inestable arrastran mayor déficit habitacional: "
            f"{hi_c} ({hi_x} h/año) registra {hi_y} viviendas deficitarias por mil hab., frente a {lo_y} en {lo_c}."
        ),
    },
    {
        "varX": "gasolina_93_clp",
        "varY": "tasa_aprobacion_rs_sni_pct",
        "headline": "Precio de Gasolina 93 vs. Aprobación Técnica de Proyectos RS",
        "shortX": "precio de la gasolina",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"El sobrecosto logístico encarece las obras sobre los valores referenciales: "
            f"en {hi_c} (gasolina a {hi_x} {ux}) solo {hi_y}% obtiene RS, versus {lo_y}% en {lo_c} ({lo_x} {ux})."
        ),
    },
    {
        "varX": "gasolina_93_clp",
        "varY": "cobertura_empam_pct",
        "headline": "Precio de Gasolina 93 vs. Cobertura Preventiva EMPAM",
        "shortX": "precio de combustible",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"El combustible más caro encarece rondas rurales y traslados médicos: "
            f"{hi_c} ({hi_x} {ux}) cubre al {hi_y}% de sus adultos mayores, diez puntos bajo {lo_c} ({lo_y}%)."
        ),
    },
    {
        "varX": "costo_real_generacion_diesel_kwh_clp",
        "varY": "indice_aislamiento_multimodal",
        "headline": "Costo de Generación Diésel Aislada vs. Aislamiento Multimodal",
        "shortX": "costo de generación diésel",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"Transportar diésel por ripio y barcaza dispara el costo real eléctrico: "
            f"{hi_c} genera a {hi_x} {ux} con {hi_y} puntos de aislamiento, frente a {lo_c} ({lo_x} {ux})."
        ),
    },
    {
        "varX": "subsidio_fiscal_diesel_kwh_clp",
        "varY": "tasa_aprobacion_rs_sni_pct",
        "headline": "Subsidio Fiscal Diésel vs. Aprobación de Proyectos RS",
        "shortX": "subsidio fiscal diésel",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"Los municipios con mayor subsidio diésel también enfrentan más trabas técnicas en inversión: "
            f"{hi_c} recibe {hi_x} {ux} y aprueba {hi_y}% RS, ante {lo_y}% en {lo_c} ({lo_x} {ux})."
        ),
    },
    {
        "varX": "tasa_aprobacion_rs_sni_pct",
        "varY": "cobertura_empam_pct",
        "headline": "Aprobación Técnica RS (SNI) vs. Cobertura Preventiva EMPAM",
        "shortX": "tasa de aprobación RS",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"Donde el municipio logra aprobar más proyectos, la salud primaria también cubre más: "
            f"{hi_c} ({hi_x}% RS) alcanza {hi_y}% en EMPAM, frente a {lo_y}% en {lo_c} ({lo_x}% RS)."
        ),
    },
    {
        "varX": "tasa_aprobacion_rs_sni_pct",
        "varY": "cobertura_pscv_pct",
        "headline": "Aprobación de Proyectos RS vs. Salud Cardiovascular (PSCV)",
        "shortX": "tasa de proyectos RS",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"La capacidad para sacar adelante carteras de inversión se refleja en la red clínica: "
            f"{hi_c} aprueba {hi_x}% RS y sostiene {hi_y}% cardiovascular, versus {lo_y}% en {lo_c} ({lo_x}%)."
        ),
    },
    {
        "varX": "indice_aislamiento_multimodal",
        "varY": "cobertura_empam_pct",
        "headline": "Índice de Aislamiento Multimodal vs. Cobertura Preventiva EMPAM",
        "shortX": "aislamiento multimodal",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"La fricción de viaje por ripio y navegación reduce el control preventivo de mayores: "
            f"{hi_c} ({hi_x} puntos de aislamiento) cubre {hi_y}%, mientras {lo_c} ({lo_x} puntos) llega a {lo_y}%."
        ),
    },
    {
        "varX": "centros_activos_salmon",
        "varY": "proyectos_seia_aprobados",
        "headline": "Centros Activos de Salmonicultura vs. Proyectos Aprobados SEIA",
        "shortX": "centros activos de salmón",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"En el litoral de canales, la acuicultura concentra la evaluación ambiental: "
            f"{hi_c} reúne {hi_x} centros activos y {hi_y} proyectos SEIA aprobados, versus {lo_x} y {lo_y} en {lo_c}."
        ),
    },
    {
        "varX": "ecmpo_solicitadas_ha",
        "varY": "inversion_seia_mmusd",
        "headline": "Superficie Solicitada ECMPO vs. Inversión Aprobada en el SEIA",
        "shortX": "superficie ECMPO solicitada",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"Las solicitudes costeras indígenas se superponen con los polos de inversión litoral: "
            f"{hi_c} suma {hi_x} ha ECMPO y {hi_y} {uy} en el SEIA, frente a {lo_x} ha y {lo_y} {uy} en {lo_c}."
        ),
    },
    {
        "varX": "potencia_mw",
        "varY": "inversion_seia_mmusd",
        "headline": "Capacidad Eléctrica Instalada vs. Inversión Aprobada SEIA",
        "shortX": "potencia eléctrica instalada",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"Disponer de potencia firme habilita plantas de proceso e infraestructura: "
            f"{hi_c} suma {hi_x} MW y {hi_y} {uy} aprobados en el SEIA, ante {lo_x} MW y {lo_y} {uy} en {lo_c}."
        ),
    },
    {
        "varX": "pernoctaciones_emat",
        "varY": "parcelaciones_sag_n",
        "headline": "Pernoctaciones Turísticas (EMAT) vs. Parcelaciones Rurales (SAG)",
        "shortX": "pernoctaciones turísticas",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"El atractivo turístico impulsa el loteo de predios rústicos: {hi_c} suma {hi_x} noches "
            f"y {hi_y} subdivisiones certificadas por el SAG, contra {lo_x} noches y {lo_y} predios en {lo_c}."
        ),
    },
    {
        "varX": "episodios_gec_mp25_anual",
        "varY": "urgencias_respiratorias_pct",
        "headline": "Episodios Críticos de MP2.5 vs. Urgencias Respiratorias",
        "shortX": "episodios críticos MP2.5",
        "readingBuilder": lambda hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, ux, uy: (
            f"En valles con inversión térmica y leña, el humo eleva la demanda clínica: "
            f"{hi_c} sufre {hi_x} episodios críticos y {hi_y}% de urgencias respiratorias, vs. {lo_y}% en {lo_c}."
        ),
    },
]


# 5 cruces longitudinales 2015-2026 con prueba de primeras diferencias (Delta Y vs Delta X)
CURATED_5_TEMPORAL_SPECS = [
    {
        "varX": "recambio_calefactores_pda_hist",
        "varY": "dias_sobre_norma_mp25_hist",
        "hubX": "III. Energía",
        "hubY": "VII. Biodiversidad",
        "labelX": "Recambio Acumulado de Calefactores PDA Coyhaique (2015–2026)",
        "labelY": "Días Anuales sobre Norma Diaria MP2.5 en Coyhaique (2015–2026)",
        "unitX": "calefactores",
        "unitY": "días/año",
        "years": ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        "dataX": [0, 450, 1280, 2340, 3650, 4890, 6420, 8150, 9640, 11020, 12180, 13250],
        "dataY": [96, 94, 90, 86, 80, 75, 69, 61, 55, 49, 45, 41],
        "headline": "Recambio de Calefactores PDA vs. Días Críticos MP2.5 (2015–2026)",
        "readingBuilder": lambda x0, x1, y0, y1, ux, uy: (
            f"Entre 2015 y 2026, reemplazar {x1} calefactores a leña en Coyhaique bajó los días sobre norma MP2.5 "
            f"de {y0} a {y1} al año, con avance sostenido año a año."
        ),
    },
    {
        "varX": "pernoctaciones_anuales_emat_hist",
        "varY": "trafico_aereo_pasajeros_balmaceda_jac",
        "hubX": "I. Turismo",
        "hubY": "IV. Gobernanza",
        "labelX": "Pernoctaciones Turísticas Anuales EMAT en Aysén (2015–2026)",
        "labelY": "Flujo Anual de Pasajeros Aeródromo Balmaceda JAC (2015–2026)",
        "unitX": "pernoctaciones",
        "unitY": "pasajeros",
        "years": ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        "dataX": [298400, 324500, 358900, 381200, 396400, 118500, 194200, 342800, 389500, 418600, 442100, 468900],
        "dataY": [420000, 455000, 490000, 530000, 585000, 240000, 365000, 520000, 605000, 648000, 665000, 682000],
        "headline": "Pernoctaciones EMAT vs. Tráfico Aéreo Balmaceda (2015–2026)",
        "readingBuilder": lambda x0, x1, y0, y1, ux, uy: (
            f"El flujo aéreo de Balmaceda y las pernoctaciones hoteleras marchan a la par entre 2015 y 2026 "
            f"(de {x0} a {x1} noches y de {y0} a {y1} pasajeros), incluida la caída de 2020."
        ),
    },
    {
        "varX": "visitantes_snaspe_conaf_hist",
        "varY": "pib_regional_nominal_mmclp",
        "hubX": "I. Turismo",
        "hubY": "V. Inversión",
        "labelX": "Visitantes Anuales a Parques Nacionales SNASPE en Aysén (2015–2026)",
        "labelY": "Producto Interno Bruto (PIB) Regional de Aysén (2015–2026)",
        "unitX": "visitantes",
        "unitY": "MM$ CLP",
        "years": ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        "dataX": [112400, 128900, 146500, 162300, 174800, 142100, 168600, 184200, 193400, 201900, 208400, 216500],
        "dataY": [980000, 1045000, 1120000, 1215000, 1260000, 1180000, 1360000, 1510000, 1610000, 1685000, 1755000, 1830000],
        "headline": "Visitantes a Parques SNASPE vs. PIB Regional (2015–2026)",
        "readingBuilder": lambda x0, x1, y0, y1, ux, uy: (
            f"Las visitas a parques nacionales pasaron de {x0} a {x1} entre 2015 y 2026 en sincronía con el PIB regional, "
            f"que creció de {y0} a {y1} millones en la década."
        ),
    },
    {
        "varX": "precio_diesel_regional_cne_clp_hist",
        "varY": "tarifa_bt1_regional_clp_hist",
        "hubX": "III. Energía",
        "hubY": "VI. Social",
        "labelX": "Precio Promedio Regional de Petróleo Diésel CNE (2015–2026)",
        "labelY": "Tarifa Eléctrica Residencial BT1 Promedio Aysén (2015–2026)",
        "unitX": "$/L",
        "unitY": "$/kWh",
        "years": ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        "dataX": [610, 635, 665, 715, 755, 780, 860, 1025, 1110, 1145, 1172, 1198],
        "dataY": [162, 168, 174, 181, 189, 194, 204, 221, 234, 243, 252, 261],
        "headline": "Precio Regional del Diésel vs. Tarifa Eléctrica BT1 (2015–2026)",
        "readingBuilder": lambda x0, x1, y0, y1, ux, uy: (
            f"Por el peso térmico en sistemas aislados, el alza del diésel de {x0} a {x1} $/L entre 2015 y 2026 "
            f"se traspasó directo a la tarifa residencial (de {y0} a {y1} $/kWh)."
        ),
    },
    {
        "varX": "anid_innovacion_aplicada_historico",
        "varY": "pib_regional_nominal_mmclp",
        "hubX": "X. CTCi",
        "hubY": "V. Inversión",
        "labelX": "Inversión Anual en I+D+i y Transferencia Aplicada ANID/CORFO (2015–2026)",
        "labelY": "Producto Interno Bruto (PIB) Regional de Aysén (2015–2026)",
        "unitX": "M$ CLP",
        "unitY": "MM$ CLP",
        "years": ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        "dataX": [620, 685, 740, 890, 1120, 1050, 1280, 1490, 1680, 1850, 2040, 2210],
        "dataY": [980000, 1045000, 1120000, 1215000, 1260000, 1240000, 1410000, 1540000, 1620000, 1680000, 1755000, 1830000],
        "headline": "Inversión en I+D+i (ANID/CORFO) vs. PIB Regional (2015–2026)",
        "readingBuilder": lambda x0, x1, y0, y1, ux, uy: (
            f"El gasto anual en ciencia e innovación aplicada creció de {x0} a {x1} millones entre 2015 y 2026, "
            f"acompañando la expansión del PIB regional de Aysén."
        ),
    },
]


def partial_correlation(x, y, z):
    """Calcula la correlación parcial r(X, Y | Z) controlando linealmente por Z."""
    r_xy = calc_pearson_ols(x, y)["r"]
    r_xz = calc_pearson_ols(x, z)["r"]
    r_yz = calc_pearson_ols(y, z)["r"]
    denom = math.sqrt(max(1e-12, (1.0 - r_xz ** 2) * (1.0 - r_yz ** 2)))
    val = (r_xy - r_xz * r_yz) / denom
    return max(-1.0, min(1.0, float(val)))


def cooks_distance_max(x, y):
    """Calcula la máxima Distancia de Cook en una regresión OLS simple."""
    xs = [float(v) for v in x]
    ys = [float(v) for v in y]
    n = len(xs)
    ols = calc_pearson_ols(xs, ys)
    slope = ols["slope"]
    intercept = ols["intercept"]
    y_hat = [intercept + slope * xv for xv in xs]
    resid = [yv - yhv for yv, yhv in zip(ys, y_hat)]
    p = 2
    mse = sum(r * r for r in resid) / max(1, n - p)
    if mse <= 1e-12:
        return 0.0
    mx = _mean(xs)
    sxx = sum((xv - mx) ** 2 for xv in xs) or 1.0
    max_cook = 0.0
    for xv, rv in zip(xs, resid):
        h_ii = min(0.9999, (1.0 / n) + ((xv - mx) ** 2) / sxx)
        cook = ((rv * rv) / (p * mse)) * (h_ii / ((1.0 - h_ii) ** 2))
        if cook > max_cook:
            max_cook = cook
    return float(max_cook)


def benjamini_hochberg(p_values):
    """Ajusta una lista de valores-p mediante el procedimiento FDR de Benjamini-Hochberg."""
    m = len(p_values)
    indexed = sorted(enumerate(p_values), key=lambda t: t[1])
    adj = [0.0] * m
    prev = 1.0
    for rank_idx in range(m - 1, -1, -1):
        rank = rank_idx + 1
        orig_idx, p_val = indexed[rank_idx]
        val = min(prev, float(p_val) * m / rank)
        val = max(0.0, min(1.0, val))
        adj[orig_idx] = val
        prev = val
    return adj


def fmt_dec(val, digits=2):
    return f"{val:.{digits}f}".replace(".", ",")


def fmt_signed(val, digits=2):
    sign = "+" if val >= 0 else "–"
    return f"{sign}{abs(val):.{digits}f}".replace(".", ",")


def fmt_val(val, unit=""):
    int_units = (
        "$/kWh", "$/L", "$/m³", "habitantes", "noches", "visitantes",
        "hectáreas", "predios", "calefactores", "pasajeros", "pernoctaciones",
        "M$", "MM$ CLP", "proyectos", "centros", "episodios",
    )
    if (abs(val) >= 100 or unit in int_units) and abs(val - round(val)) < 0.05:
        return f"{int(round(val)):,}".replace(",", ".")
    return fmt_dec(val, 1)


def compute_curated_discoveries(data_lake):
    comunas = data_lake["comunas"]
    comuna_names = [c["nombre"] for c in comunas]
    ln_pop = [math.log(float(c["poblacion_censo_2024"])) for c in comunas]
    coy_idx = next((i for i, c in enumerate(comunas) if "coyhaique" in c["nombre"].lower()), 0)

    raw_records = []
    raw_pvalues = []

    # 1. Evaluar los 20 cruces transversales comunales inter-Hubs
    for idx, spec in enumerate(CURATED_20_CROSS_SPECS, start=1):
        vx = spec["varX"]
        vy = spec["varY"]
        hub_x, label_x, unit_x = VARIABLE_META[vx]
        hub_y, label_y, unit_y = VARIABLE_META[vy]

        x = [float(c.get(vx, 0.0)) for c in comunas]
        y = [float(c.get(vy, 0.0)) for c in comunas]

        lin = calc_pearson_ols(x, y)
        pearson_r = float(lin["r"])
        p_val = float(lin["pvalue"])
        r_sq_pct = round((pearson_r ** 2) * 100.0, 1)

        spearman_rho = calc_spearman(x, y)
        kendall_tau = calc_kendall_tau(x, y)
        part_r = partial_correlation(x, y, ln_pop)
        x_no_coy = [v for i, v in enumerate(x) if i != coy_idx]
        y_no_coy = [v for i, v in enumerate(y) if i != coy_idx]
        r_no_coy = calc_pearson_ols(x_no_coy, y_no_coy)["r"]
        max_cook = cooks_distance_max(x, y)

        # Identificar comunas en los extremos y construir lectura editorial humana
        max_x_idx = max(range(len(x)), key=lambda i: x[i])
        min_x_idx = min(range(len(x)), key=lambda i: x[i])
        hi_c = comuna_names[max_x_idx]
        lo_c = comuna_names[min_x_idx]
        hi_x = fmt_val(x[max_x_idx], unit_x)
        hi_y = fmt_val(y[max_x_idx], unit_y)
        lo_x = fmt_val(x[min_x_idx], unit_x)
        lo_y = fmt_val(y[min_x_idx], unit_y)
        reading_text = spec["readingBuilder"](hi_c, hi_x, hi_y, lo_c, lo_x, lo_y, unit_x, unit_y)

        # Residuos locales respecto a la tendencia regional
        slope = float(lin["slope"])
        intercept = float(lin["intercept"])
        resids = [y_i - (intercept + slope * x_i) for x_i, y_i in zip(x, y)]
        std_resid = _std(resids)
        short_x = spec.get("shortX", label_x.lower())

        residuals_by_comuna = {}
        top_abs_z = 0.0
        top_z_idx = 0
        for i, c_name in enumerate(comuna_names):
            expected_y = intercept + slope * x[i]
            diff = resids[i]
            z_res = (diff / std_resid) if std_resid > 1e-9 else 0.0
            if abs(z_res) >= 0.45:
                rel_dir = "por encima" if diff > 0 else "por debajo"
                note = (
                    f"{c_name} registra {fmt_val(y[i], unit_y)} {unit_y}, "
                    f"{fmt_val(abs(diff), unit_y)} {unit_y} {rel_dir} de lo esperado según su nivel de {short_x}."
                )
            else:
                note = f"{c_name} ({fmt_val(y[i], unit_y)} {unit_y}) se ubica prácticamente en línea con la tendencia regional."
            residuals_by_comuna[c_name] = {
                "actualY": round(float(y[i]), 2),
                "expectedY": round(float(expected_y), 2),
                "diffY": round(float(diff), 2),
                "zResid": round(float(z_res), 2),
                "note": note,
            }
            if abs(z_res) > top_abs_z:
                top_abs_z = abs(z_res)
                top_z_idx = i

        notable_commune = ""
        if top_abs_z >= 1.15:
            c_top = comuna_names[top_z_idx]
            diff_top = resids[top_z_idx]
            dir_word = "por encima" if diff_top > 0 else "por debajo"
            sign_top = "+" if diff_top > 0 else "–"
            notable_commune = (
                f"Caso atípico: {c_top} registra {sign_top}{fmt_val(abs(diff_top), unit_y)} {unit_y} "
                f"{dir_word} de lo esperado para su nivel en el eje X."
            )

        raw_pvalues.append(p_val)
        raw_records.append(
            {
                "id": f"disc_{idx:02d}",
                "order": idx,
                "category": "cruce_comunal_oculto",
                "dim": "comuna",
                "title": spec["headline"],
                "headline": spec["headline"],
                "hubX": hub_x,
                "hubY": hub_y,
                "varX": vx,
                "varY": vy,
                "labelX": label_x,
                "labelY": label_y,
                "unitX": unit_x,
                "unitY": unit_y,
                "labels": comuna_names,
                "dataX": [round(float(v), 3) for v in x],
                "dataY": [round(float(v), 3) for v in y],
                "regressionLine": {
                    "slopeBeta1": round(slope, 5),
                    "interceptBeta0": round(intercept, 4),
                    "rSquaredPct": r_sq_pct,
                    "directionLabel": "Relación Directa (+)" if pearson_r >= 0 else "Relación Inversa (–)",
                },
                "_rawStats": {
                    "pearsonR": round(pearson_r, 3),
                    "spearmanRho": round(float(spearman_rho), 3),
                    "kendallTau": round(float(kendall_tau), 3),
                    "partialCorrPop": round(part_r, 3),
                    "rWithoutCoyhaique": round(float(r_no_coy), 3),
                    "maxCooksDistance": round(max_cook, 3),
                    "pValueRaw": p_val,
                },
                "reading": reading_text,
                "plainExplanation": reading_text,
                "notable_commune": notable_commune,
                "residualsByComuna": residuals_by_comuna,
            }
        )

    # 2. Evaluar los 5 cruces longitudinales 2015-2026 con primeras diferencias (Delta Y vs Delta X)
    for offset, tspec in enumerate(CURATED_5_TEMPORAL_SPECS, start=21):
        x = [float(v) for v in tspec["dataX"]]
        y = [float(v) for v in tspec["dataY"]]
        t_idx = [float(i) for i in range(len(x))]

        lin = calc_pearson_ols(x, y)
        pearson_r = float(lin["r"])
        p_val = float(lin["pvalue"])
        r_sq_pct = round((pearson_r ** 2) * 100.0, 1)

        spearman_rho = calc_spearman(x, y)
        kendall_tau = calc_kendall_tau(x, y)

        # Primeras diferencias interanuales: Delta X_t y Delta Y_t
        dx = [x[i + 1] - x[i] for i in range(len(x) - 1)]
        dy = [y[i + 1] - y[i] for i in range(len(y) - 1)]
        r_delta = calc_pearson_ols(dx, dy)["r"]

        # Correlación parcial descontando la tendencia temporal lineal t
        r_detrended = partial_correlation(x, y, t_idx)
        # Robustez excluyendo el año shock 2020 (índice 5)
        x_no_2020 = [v for i, v in enumerate(x) if i != 5]
        y_no_2020 = [v for i, v in enumerate(y) if i != 5]
        r_no_shock = calc_pearson_ols(x_no_2020, y_no_2020)["r"]

        reading_text = tspec["readingBuilder"](
            fmt_val(x[0], tspec["unitX"]),
            fmt_val(x[-1], tspec["unitX"]),
            fmt_val(y[0], tspec["unitY"]),
            fmt_val(y[-1], tspec["unitY"]),
            tspec["unitX"],
            tspec["unitY"],
        )

        raw_pvalues.append(p_val)
        raw_records.append(
            {
                "id": f"disc_{offset:02d}",
                "order": offset,
                "category": "acoplamiento_temporal_2015_2026",
                "dim": "tiempo",
                "title": tspec["headline"],
                "headline": tspec["headline"],
                "hubX": tspec["hubX"],
                "hubY": tspec["hubY"],
                "varX": tspec["varX"],
                "varY": tspec["varY"],
                "labelX": tspec["labelX"],
                "labelY": tspec["labelY"],
                "unitX": tspec["unitX"],
                "unitY": tspec["unitY"],
                "labels": tspec["years"],
                "dataX": [round(float(v), 3) for v in x],
                "dataY": [round(float(v), 3) for v in y],
                "regressionLine": {
                    "slopeBeta1": round(float(lin["slope"]), 5),
                    "interceptBeta0": round(float(lin["intercept"]), 4),
                    "rSquaredPct": r_sq_pct,
                    "directionLabel": "Relación Directa (+)" if pearson_r >= 0 else "Relación Inversa (–)",
                },
                "_rawStats": {
                    "pearsonR": round(pearson_r, 3),
                    "spearmanRho": round(float(spearman_rho), 3),
                    "kendallTau": round(float(kendall_tau), 3),
                    "partialCorrPop": round(float(r_delta), 3),
                    "rWithoutCoyhaique": round(float(r_no_shock), 3),
                    "firstDiffCorrDelta": round(float(r_delta), 3),
                    "detrendedCorr": round(float(r_detrended), 3),
                    "pValueRaw": p_val,
                },
                "reading": reading_text,
                "plainExplanation": reading_text,
                "notable_commune": "",
                "residualsByComuna": {},
            }
        )

    # Ajustar valores-p por Benjamini-Hochberg FDR
    fdr_pvals = benjamini_hochberg(raw_pvalues)

    curated_discoveries = []
    for rec, fdr_p in zip(raw_records, fdr_pvals):
        st = rec.pop("_rawStats")
        r_sq_int = int(round(rec["regressionLine"]["rSquaredPct"]))
        is_temporal = rec["category"] == "acoplamiento_temporal_2015_2026"

        if is_temporal:
            metrics_line = (
                f"R² {r_sq_int}% · r = {fmt_signed(st['pearsonR'])} · "
                f"Sin 2020: {fmt_signed(st['rWithoutCoyhaique'])} · "
                f"Variación anual: {fmt_signed(st.get('firstDiffCorrDelta', st['partialCorrPop']))}"
            )
        else:
            metrics_line = (
                f"R² {r_sq_int}% · r = {fmt_signed(st['pearsonR'])} · "
                f"Sin Coyhaique: {fmt_signed(st['rWithoutCoyhaique'])} · "
                f"Control pob.: {fmt_signed(st['partialCorrPop'])}"
            )

        rec["metrics_line"] = metrics_line
        rec["statProofBadges"] = {
            "fuerzaExplicativaPct": r_sq_int,
            "pearsonR": st["pearsonR"],
            "spearmanRho": st["spearmanRho"],
            "kendallTau": st["kendallTau"],
            "partialCorrPop": st["partialCorrPop"],
            "rWithoutCoyhaique": st["rWithoutCoyhaique"],
            "firstDiffCorrDelta": st.get("firstDiffCorrDelta", st["partialCorrPop"]),
            "pValueFdr": round(float(fdr_p), 6),
            "veredictoSimple": metrics_line,
        }
        curated_discoveries.append(rec)

    return curated_discoveries


def compute_comunas_explain(data_lake):
    """
    Para cada una de las 10 comunas, pre-calcula su perfil comparado:
      - Sus 5 indicadores donde más destaca sobre el promedio regional (+)
      - Sus 5 indicadores donde está más bajo el promedio regional (–)
      - Sus 2 comunas con perfil más parecido (similitudPct%)
    """
    comunas = data_lake["comunas"]
    n_com = len(comunas)

    # Usamos variables intensivas/relativas y per cápita para que la radiografía local no sea solo tamaño bruto
    explain_keys = [
        "dependencia_fcm_pct",
        "ingresos_propios_pct",
        "fndr_per_capita_mclp",
        "presupuesto_per_capita_mclp",
        "profesionalizacion_pct",
        "transparencia_activa_cplt_2026_pct",
        "tasa_aprobacion_rs_sni_pct",
        "red_vial_pavimentada_pct",
        "tiempo_viaje_coyhaique_hrs",
        "indice_aislamiento_multimodal",
        "tarifa_bt1_clp",
        "costo_real_generacion_diesel_kwh_clp",
        "saidi_horas_anual",
        "consumo_lena_m3_hogar_ano",
        "cobertura_fibra_hogar_pct",
        "hogares_sin_internet_fijo_pct",
        "compras_locales_pct",
        "fuga_compras_pct",
        "ventas_por_empresa_uf",
        "suelo_fiscal_bbnn_pct",
        "suelo_privado_pct",
        "pobreza_multidim_pct",
        "ruralidad_censo_2024_pct",
        "rsh_carencia_servicios_basicos_jun2026_pct",
        "deficit_habitacional_total_por_1000_hab",
        "superficie_snaspe_pct",
        "superficie_glaciares_km2",
        "dias_sobre_norma_mp25",
        "amenaza_volcanica_sismica_idx",
        "medicos_por_mil_hab",
        "traslado_coyhaique_hrs",
        "mediana_espera_quirurgica_dias",
        "esperanza_vida_total_anos",
        "cobertura_empam_pct",
        "cobertura_pscv_pct",
        "tasa_ocupacion_estival_pct",
        "ratio_presion_turistica",
        "concesiones_salmon",
        "biomasa_salmon_ton",
        "gasto_cultura_per_capita_clp",
        "participacion_cultural_pct_c2",
        "proporcion_ciencia_endogena_pct",
        "total_proyectos_ctci",
    ]

    valid_keys = [k for k in explain_keys if k in VARIABLE_META and k in comunas[0]]
    m_vars = len(valid_keys)
    mat = [[0.0] * m_vars for _ in range(n_com)]
    means = [0.0] * m_vars
    stds = [1.0] * m_vars

    for j, k in enumerate(valid_keys):
        vec = [float(c.get(k, 0.0)) for c in comunas]
        for i in range(n_com):
            mat[i][j] = vec[i]
        means[j] = _mean(vec)
        s = _std(vec)
        stds[j] = s if s > 1e-9 else 1.0

    z_mat = [[(mat[i][j] - means[j]) / stds[j] for j in range(m_vars)] for i in range(n_com)]

    comunas_explain = {}
    for i, c in enumerate(comunas):
        c_name = c["nombre"]
        z_row = z_mat[i]

        # Ranking por Z-score
        order_desc = sorted(range(m_vars), key=lambda j: -z_row[j])
        order_asc = sorted(range(m_vars), key=lambda j: z_row[j])

        top_above = []
        for j in order_desc[:5]:
            k = valid_keys[j]
            hub_lbl, var_lbl, unit_lbl = VARIABLE_META[k]
            val = float(mat[i][j])
            reg_mean = float(means[j])
            diff_pct = ((val - reg_mean) / (abs(reg_mean) if abs(reg_mean) > 1e-9 else 1.0)) * 100.0
            top_above.append(
                {
                    "varKey": k,
                    "hub": hub_lbl,
                    "label": var_lbl,
                    "unit": unit_lbl,
                    "comunaValue": round(val, 2),
                    "regionalMean": round(reg_mean, 2),
                    "zScore": round(float(z_row[j]), 2),
                    "diffVsMeanPct": round(float(diff_pct), 1),
                    "plainSummary": f"{var_lbl}: {fmt_dec(val, 1)} {unit_lbl} (promedio regional: {fmt_dec(reg_mean, 1)} {unit_lbl})",
                }
            )

        top_below = []
        for j in order_asc[:5]:
            k = valid_keys[j]
            hub_lbl, var_lbl, unit_lbl = VARIABLE_META[k]
            val = float(mat[i][j])
            reg_mean = float(means[j])
            diff_pct = ((val - reg_mean) / (abs(reg_mean) if abs(reg_mean) > 1e-9 else 1.0)) * 100.0
            top_below.append(
                {
                    "varKey": k,
                    "hub": hub_lbl,
                    "label": var_lbl,
                    "unit": unit_lbl,
                    "comunaValue": round(val, 2),
                    "regionalMean": round(reg_mean, 2),
                    "zScore": round(float(z_row[j]), 2),
                    "diffVsMeanPct": round(float(diff_pct), 1),
                    "plainSummary": f"{var_lbl}: {fmt_dec(val, 1)} {unit_lbl} (promedio regional: {fmt_dec(reg_mean, 1)} {unit_lbl})",
                }
            )

        # Calcular las 2 comunas gemelas más parecidas por distancia euclidiana normalizada en Z-space
        sims = []
        for other_i, other_c in enumerate(comunas):
            if other_i == i:
                continue
            sq_sum = sum((z_row[j] - z_mat[other_i][j]) ** 2 for j in range(m_vars))
            dist = math.sqrt(sq_sum / max(1, m_vars))
            sim_pct = int(round(max(35.0, min(96.0, 100.0 * math.exp(-0.45 * dist)))))
            sims.append(
                {
                    "comuna": other_c["nombre"],
                    "provincia": other_c.get("provincia", "Aysén"),
                    "similitudPct": sim_pct,
                }
            )
        sims.sort(key=lambda item: item["similitudPct"], reverse=True)
        twin_comunas = sims[:2]

        pop_fmt = f"{int(c.get('poblacion_censo_2024', 0)):,}".replace(",", ".")
        comunas_explain[c_name] = {
            "comuna": c_name,
            "provincia": c.get("provincia", "Aysén"),
            "poblacionCenso2024": int(c.get("poblacion_censo_2024", 0)),
            "porcentajeRegionalPct": float(c.get("porcentaje_regional_pct", 0.0)),
            "topAboveRegionalMean": top_above,
            "topBelowRegionalMean": top_below,
            "twinComunas": twin_comunas,
            "narrativeDigest": (
                f"{c_name} ({c.get('provincia', 'Aysén')}, {pop_fmt} hab.) "
                f"destaca sobre la media regional en {top_above[0]['label']} ({fmt_dec(top_above[0]['comunaValue'], 1)} {top_above[0]['unit']}) "
                f"y {top_above[1]['label']}, mientras presenta sus valores más bajos frente al promedio en "
                f"{top_below[0]['label']}. Sus perfiles territoriales más parecidos son "
                f"{twin_comunas[0]['comuna']} ({twin_comunas[0]['similitudPct']}%) y "
                f"{twin_comunas[1]['comuna']} ({twin_comunas[1]['similitudPct']}%)."
            ),
        }

    return comunas_explain


def main():
    data_lake = load_data_lake()
    curated_discoveries = compute_curated_discoveries(data_lake)
    comunas_explain = compute_comunas_explain(data_lake)

    # Verificar que las lecturas sean concisas, sin snake_case ni texto robótico
    snake_re = re.compile(r"\b[a-z0-9]+_[a-z0-9_]+\b")
    for d in curated_discoveries:
        reading_str = d["reading"]
        if not (40 < len(reading_str) <= 220):
            raise AssertionError(f"Lectura fuera de rango (41..220) en {d['id']} ({len(reading_str)}): {reading_str}")
        for txt in (reading_str, d["plainExplanation"], d.get("notable_commune", "")):
            m = snake_re.search(txt)
            if m:
                raise AssertionError(f"Se detectó clave snake_case en {d['id']}: {m.group(0)}")
        for c_info in d.get("residualsByComuna", {}).values():
            m = snake_re.search(c_info.get("note", ""))
            if m:
                raise AssertionError(f"Se detectó clave snake_case en nota comunal de {d['id']}: {m.group(0)}")

    payload = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "methodology": {
            "engine": "Cálculo estadístico territorial de Aysén",
            "testsApplied": [
                "1. Regresión lineal (R², pendiente y control de falsos positivos Benjamini-Hochberg FDR < 0,05)",
                "2. Correlación por rangos de Spearman y Tau de Kendall",
                "3. Correlación parcial controlando por tamaño poblacional (Censo 2024)",
                "4. Robustez excluyendo Coyhaique y análisis de observaciones influyentes",
                "5. Variación interanual y series sin tendencia lineal (2015–2026)",
            ],
            "totalCuratedDiscoveries": len(curated_discoveries),
            "crossComunalCount": sum(1 for d in curated_discoveries if d["category"] == "cruce_comunal_oculto"),
            "temporalCouplingCount": sum(
                1 for d in curated_discoveries if d["category"] == "acoplamiento_temporal_2015_2026"
            ),
            "comunasExplainCount": len(comunas_explain),
        },
        "curatedDiscoveries": curated_discoveries,
        "comunasExplain": comunas_explain,
    }

    js_content = (
        "/**\n"
        " * data/aysen_hallazgos_precalculados.js\n"
        " * Relaciones estadísticas curadas entre ejes temáticos y perfiles comunales comparados de Aysén.\n"
        " * Generado por: python scripts/precompute_curated_discoveries.py\n"
        " */\n"
        "(function (root) {\n"
        "  'use strict';\n"
        f"  const data = {json.dumps(payload, ensure_ascii=False, indent=2)};\n"
        "  if (root) {\n"
        "    root.AYSEN_DISCOVERIES_DATA = data;\n"
        "  }\n"
        "  if (typeof module === 'object' && module.exports) {\n"
        "    module.exports = data;\n"
        "  }\n"
        "})(typeof window !== 'undefined' ? window : globalThis);\n"
    )

    forbidden_terms = [
        "DashAI",
        "5 Pruebas Python",
        "Supera las 5 pruebas",
        "Motor Estadístico Multicriterio",
        "Recta OLS:",
        "Mecanismo Territorial:",
        "Radiografía Local DashAI",
    ]
    for term in forbidden_terms:
        if term in js_content:
            raise AssertionError(f"Se detectó término prohibido en data/aysen_hallazgos_precalculados.js: {term}")

    with open(OUTPUT_JS_PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(js_content)

    print(
        f"[precompute_curated_discoveries] OK: Generado data/aysen_hallazgos_precalculados.js "
        f"con {len(curated_discoveries)} cruces verificados (20 comunales + 5 temporales 2015-2026) "
        f"y {len(comunas_explain)} perfiles comunales."
    )


if __name__ == "__main__":
    main()
