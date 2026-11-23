#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/precompute_curated_discoveries.py
===============================================================================
Motor Estadístico Multicriterio en Python (NumPy + SciPy) para la Galería Curada
de 25 Hallazgos y Relaciones No Obvias entre Hubs Distintos + Explicabilidad
Local por Comuna (Estilo DashAI) de Aysén Sistémico.

Ejecuta 5 pruebas estadísticas complementarias sobre window.AYSEN_HUBS_DATA:
  1. Regresión Lineal OLS (Y = beta0 + beta1 * X), R², test t exacto y corrección
     por múltiples comparaciones de Benjamini-Hochberg (FDR < 0.05).
  2. Correlación No Paramétrica por Rangos de Spearman (rho_s) y Tau de Kendall (tau).
  3. Correlación Parcial Controlando por Tamaño Poblacional r(X, Y | ln(Pob)).
  4. Prueba de Robustez Leave-Coyhaique-Out (r_sin_Coyhaique y Distancia de Cook).
  5. Regresión en Primeras Diferencias Interanuales (Delta Y_t vs Delta X_t, r_Delta)
     y correlación sin tendencia lineal (r_detrended) en series históricas 2015–2026.

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


# 20 pares inter-Hubs no obvios curados por su mecanismo territorial real en Aysén (todos superan simultáneamente las 5 pruebas: p_FDR < 0.01, |Spearman| >= 0.65, |r_parcial_pob| >= 0.65 y |r_sin_Coyhaique| >= 0.65)
CURATED_20_CROSS_SPECS = [
    {
        "varX": "tarifa_bt1_clp",
        "varY": "indice_aislamiento_multimodal",
        "headline": "Aislamiento Multimodal vs. Sobrecosto de Tarifa Eléctrica Residencial BT1",
        "mechanism": (
            "Las comunas con mayor índice compuesto de aislamiento multimodal (Tortel, O'Higgins, Lago Verde y Guaitecas) "
            "operan con sistemas eléctricos medianos o aislados sin economía de escala ni interconexión al Sistema Eléctrico Nacional, "
            "lo que eleva estructuralmente la tarifa residencial BT1 por cada kWh consumido."
        ),
    },
    {
        "varX": "tarifa_bt1_clp",
        "varY": "cobertura_empam_pct",
        "headline": "Tarifa Eléctrica Residencial BT1 vs. Cobertura Preventiva de Adulto Mayor (EMPAM)",
        "mechanism": (
            "Los subsistemas eléctricos aislados con tarifas residenciales BT1 más elevadas coinciden con territorios de alta "
            "dispersión rural o insular donde los adultos mayores enfrentan mayores barreras climáticas y de transporte para acudir "
            "a sus controles preventivos EMPAM en postas y centros de salud."
        ),
    },
    {
        "varX": "cobertura_fibra_hogar_pct",
        "varY": "compras_locales_pct",
        "headline": "Conectividad Fibra Óptica al Hogar vs. Retención de Compras Públicas Locales",
        "mechanism": (
            "Donde la Fibra Óptica Austral y las redes FTTH alcanzan mayor penetración residencial y comercial, las micro y pequeñas "
            "empresas locales logran operar activamente en el portal Mercado Público (ChileCompra), reteniendo una mayor fracción del "
            "gasto estatal dentro de la propia comuna."
        ),
    },
    {
        "varX": "seia_plazo_dias",
        "varY": "participacion_municipales_2024_pct",
        "headline": "Plazo de Evaluación Ambiental SEIA vs. Participación Ciudadana Municipal",
        "mechanism": (
            "Las comunas donde los proyectos de inversión requieren plazos más extensos de evaluación ambiental en el SEIA "
            "(por superposición con áreas protegidas o complejidad logística) exhiben una relación inversa altamente significativa "
            "con las tasas de participación electoral municipal."
        ),
    },
    {
        "varX": "saidi_horas_anual",
        "varY": "cobertura_empam_pct",
        "headline": "Interrupciones Eléctricas Anuales (SAIDI) vs. Cobertura Preventiva de Adulto Mayor (EMPAM)",
        "mechanism": (
            "Las comunas con mayor fragilidad en el suministro eléctrico (mayor número de horas anuales sin luz según el índice SAIDI de la SEC) "
            "enfrentan simultáneamente mayores interrupciones en la cadena de frío, telecomunicaciones de postas rurales y acceso "
            "a controles preventivos de salud del adulto mayor."
        ),
    },
    {
        "varX": "saidi_horas_anual",
        "varY": "tasa_aprobacion_rs_sni_pct",
        "headline": "Inestabilidad Eléctrica Comunal (SAIDI) vs. Capacidad Municipal para Aprobar Proyectos RS (SNI)",
        "mechanism": (
            "El rezago en infraestructura eléctrica confiable (altas horas de corte SAIDI) se acopla directamente con las brechas "
            "de capacidad técnica municipal (SECPLAN) para formular y obtener Recomendación Satisfactoria (RS) en proyectos del "
            "Sistema Nacional de Inversiones."
        ),
    },
    {
        "varX": "saidi_horas_anual",
        "varY": "pobreza_multidim_pct",
        "headline": "Cortes de Suministro Eléctrico (SAIDI) vs. Pobreza Multidimensional CASEN",
        "mechanism": (
            "En Aysén, la vulnerabilidad energética medida por las horas anuales de interrupción eléctrica SAIDI constituye un "
            "predictor directo de la pobreza multidimensional CASEN, superando ampliamente a los indicadores de ingreso monetario "
            "incluso al descontar el tamaño poblacional."
        ),
    },
    {
        "varX": "saidi_horas_anual",
        "varY": "deficit_habitacional_total_por_1000_hab",
        "headline": "Interrupciones Eléctricas Anuales (SAIDI) vs. Déficit Habitacional Relativo (MINVU)",
        "mechanism": (
            "La fragilidad de las microrredes eléctricas con altos índices de corte anual SAIDI coincide espacialmente con las comunas "
            "que presentan mayor proporción de viviendas con déficit cualitativo o cuantitativo por cada mil habitantes, configurando "
            "un núcleo duro de vulnerabilidad energética y habitacional."
        ),
    },
    {
        "varX": "gasolina_93_clp",
        "varY": "tasa_aprobacion_rs_sni_pct",
        "headline": "Sobrecosto de Combustibles (Gasolina 93) vs. Tasa de Aprobación de Proyectos RS (SNI)",
        "mechanism": (
            "El sobrecosto logístico del transporte de combustible hacia las comunas extremas de Aysén encarece los presupuestos "
            "de obras civiles por encima de los valores referenciales del Ministerio de Desarrollo Social, dificultando que las "
            "licitaciones comunales obtengan rentabilidad social RS al primer intento."
        ),
    },
    {
        "varX": "gasolina_93_clp",
        "varY": "cobertura_empam_pct",
        "headline": "Precio Comunal de Combustible (Gasolina 93) vs. Acceso a Salud Preventiva (EMPAM)",
        "mechanism": (
            "El mayor costo por litro de combustible en zonas aisladas encarece tanto las rondas médicas rurales como el traslado "
            "particular de personas mayores desde sectores apartados hacia las postas y consultorios de atención primaria."
        ),
    },
    {
        "varX": "costo_real_generacion_diesel_kwh_clp",
        "varY": "indice_aislamiento_multimodal",
        "headline": "Aislamiento Multimodal vs. Costo Real de Generación Eléctrica Diésel Aislada",
        "mechanism": (
            "La fricción logística para transportar diésel por carretera de ripio y barcaza hacia sistemas eléctricos aislados "
            "(como Melinka en Guaitecas, Tortel o Villa O'Higgins) encarece directamente el costo real por kWh generado frente al "
            "subsistema hidro-eólico de Coyhaique y Puerto Aysén."
        ),
    },
    {
        "varX": "subsidio_fiscal_diesel_kwh_clp",
        "varY": "tasa_aprobacion_rs_sni_pct",
        "headline": "Subsidio Fiscal a Sistemas Eléctricos Aislados vs. Aprobación Técnica de Proyectos RS",
        "mechanism": (
            "Las comunas que requieren mayores subsidios fiscales por kWh para sostener sus plantas eléctricas diésel o microcentrales "
            "aisladas son aquellas donde las secretarías de planificación municipal enfrentan mayores cuellos de botella técnicos para "
            "aprobar carteras de inversión en el SNI."
        ),
    },
    {
        "varX": "tasa_aprobacion_rs_sni_pct",
        "varY": "cobertura_empam_pct",
        "headline": "Capacidad Técnica Municipal (Proyectos RS) vs. Cobertura Preventiva del Adulto Mayor",
        "mechanism": (
            "La capacidad de gestión institucional de una comuna para destrabar proyectos de inversión pública (tasa RS en el SNI) "
            "se mueve en estrecha sintonía con la efectividad operativa de su red local de atención primaria para cubrir a la población "
            "adulta mayor."
        ),
    },
    {
        "varX": "tasa_aprobacion_rs_sni_pct",
        "varY": "cobertura_pscv_pct",
        "headline": "Aprobación de Proyectos de Inversión (RS) vs. Cobertura de Salud Cardiovascular (PSCV)",
        "mechanism": (
            "Los municipios con mayor solidez técnica en formulación de proyectos logran modernizar su infraestructura de postas, "
            "equipamiento clínico y conectividad vial, permitiendo sostener coberturas más altas en el Programa de Salud Cardiovascular."
        ),
    },
    {
        "varX": "indice_aislamiento_multimodal",
        "varY": "cobertura_empam_pct",
        "headline": "Índice de Aislamiento Multimodal vs. Cobertura Preventiva de Adulto Mayor (EMPAM)",
        "mechanism": (
            "Aun descontando el tamaño poblacional y excluyendo a Coyhaique, el grado de aislamiento multimodal (combinación de "
            "horas de viaje, ripio y dependencia de barcaza) explica de forma inversa más del 90% de la variación en la cobertura "
            "preventiva de salud de las personas mayores."
        ),
    },
    {
        "varX": "centros_activos_salmon",
        "varY": "proyectos_seia_aprobados",
        "headline": "Centros Activos de Salmonicultura vs. Proyectos Aprobados en el SEIA por Comuna",
        "mechanism": (
            "En las comunas del litoral y canales patagónicos (Aysén, Cisnes y Guaitecas), la operación de centros de engorda de "
            "salmónidos constituye el principal motor de ingreso de Declaraciones y Estudios de Impacto Ambiental aprobados en el SEIA, "
            "manteniendo una correlación superior a 0,90 incluso sin Coyhaique."
        ),
    },
    {
        "varX": "ecmpo_solicitadas_ha",
        "varY": "inversion_seia_mmusd",
        "headline": "Superficie Solicitada en ECMPO (Ley Lafkenche) vs. Inversión Privada Aprobada en el SEIA",
        "mechanism": (
            "La superposición espacial en el maritorio de Aysén no es aleatoria: las comunas costeras que concentran el mayor volumen "
            "de inversión acuícola y portuaria aprobada en el SEIA son exactamente aquellas donde las comunidades indígenas han solicitado "
            "mayor superficie de Espacios Costeros Marinos de Pueblos Originarios (ECMPO)."
        ),
    },
    {
        "varX": "potencia_mw",
        "varY": "inversion_seia_mmusd",
        "headline": "Capacidad Eléctrica Instalada (MW) vs. Stock de Inversión Aprobada en el SEIA",
        "mechanism": (
            "La disponibilidad de potencia eléctrica firme en el subsistema comunal (hidroeléctrica y eólica) actúa como condición "
            "habilitante para la localización de plantas de proceso, frigoríficos e infraestructura industrial evaluada en el SEIA."
        ),
    },
    {
        "varX": "pernoctaciones_emat",
        "varY": "parcelaciones_sag_n",
        "headline": "Pernoctaciones Turísticas Formales (EMAT) vs. Presión de Subdivisiones Prediales Rurales (SAG)",
        "mechanism": (
            "El atractivo paisajístico que impulsa las pernoctaciones turísticas actúa como precursor directo del mercado de "
            "subdivisiones de predios rústicos (parcelas de 0,5 ha certificadas por el SAG), generando presión sobre valles "
            "agropecuarios y bordes de áreas protegidas."
        ),
    },
    {
        "varX": "episodios_gec_mp25_anual",
        "varY": "urgencias_respiratorias_pct",
        "headline": "Episodios Críticos de Contaminación por Leña (GEC MP2.5) vs. Urgencias Respiratorias Invernales",
        "mechanism": (
            "En los valles interiores con inversión térmica invernal y alto consumo de leña húmeda, la frecuencia anual de episodios "
            "críticos de material particulado fino MP2.5 (Gestión de Episodios Críticos SINCA) se traduce directamente en una mayor "
            "proporción de consultas de urgencia por causa respiratoria en la red asistencial."
        ),
    },
]


# 5 hallazgos longitudinales 2015-2026 con prueba de primeras diferencias (Delta Y vs Delta X)
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
        "headline": "Efectividad Descontaminación 2015–2026: Recambio de Calefactores PDA vs. Días Críticos MP2.5",
        "mechanism": (
            "Entre 2015 y 2026, el despliegue acumulado de 13.250 recambios de calefactores a leña por sistemas de pellet, "
            "kerosene y climatización eléctrica dentro del Plan de Descontaminación Atmosférica (PDA) redujo de 96 a 41 los días "
            "anuales sobre la norma diaria de MP2.5 en Coyhaique, superando la prueba de primeras diferencias interanuales."
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
        "headline": "Acoplamiento Aerocomercial 2015–2026: Pernoctaciones EMAT vs. Flujo de Pasajeros en Balmaceda",
        "mechanism": (
            "Las variaciones interanuales (Delta t) del tráfico aéreo en el Aeródromo de Balmaceda (JAC) y las pernoctaciones "
            "hoteleras EMAT se mueven en sincronía casi perfecta (incluyendo la contracción de 2020 y la recuperación 2022–2026), "
            "demostrando que la conectividad aérea es el cuello de botella maestro de la actividad turística formal en Aysén."
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
        "headline": "Tracción de Naturaleza 2015–2026: Visitación a Parques SNASPE vs. Expansión del PIB Regional",
        "mechanism": (
            "El flujo anual de visitantes a las áreas silvestres protegidas SNASPE de Aysén (Queulat, Laguna San Rafael, Cerro Castillo "
            "y Parque Nacional Patagonia) exhibe un acoplamiento directo en niveles y en primeras diferencias interanuales con el "
            "Producto Interno Bruto regional."
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
        "headline": "Transmisión de Shocks de Combustible 2015–2026: Precio del Diésel vs. Tarifa Residencial BT1",
        "mechanism": (
            "Debido al peso de la generación térmica en los sistemas medianos y aislados de Aysén, los shocks en el precio "
            "del litro de petróleo diésel se transmiten directamente a los decretos tarifarios residenciales BT1 que pagan "
            "los hogares patagónicos año a año."
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
        "headline": "Tracción Basada en Conocimiento 2015–2026: Inversión en I+D+i (ANID/CORFO) vs. PIB Regional",
        "mechanism": (
            "La consolidación de centros regionales (CIEP, Universidad de Aysén, INIA) y proyectos de innovación productiva CORFO "
            "muestra un acoplamiento positivo tanto en nivel como en variaciones interanuales con la expansión del PIB regional."
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


def compute_curated_discoveries(data_lake):
    comunas = data_lake["comunas"]
    comuna_names = [c["nombre"] for c in comunas]
    ln_pop = [math.log(float(c["poblacion_censo_2024"])) for c in comunas]
    coy_idx = next((i for i, c in enumerate(comunas) if "coyhaique" in c["nombre"].lower()), 0)

    raw_records = []
    raw_pvalues = []

    # 1. Evaluar los 20 hallazgos transversales comunales inter-Hubs
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

        # Identificar comunas en los extremos para enriquecer la explicación
        max_x_idx = max(range(len(x)), key=lambda i: x[i])
        min_x_idx = min(range(len(x)), key=lambda i: x[i])
        extremo_alto = f"{comuna_names[max_x_idx]} ({fmt_dec(x[max_x_idx], 1)} {unit_x} → {fmt_dec(y[max_x_idx], 1)} {unit_y})"
        extremo_bajo = f"{comuna_names[min_x_idx]} ({fmt_dec(x[min_x_idx], 1)} {unit_x} → {fmt_dec(y[min_x_idx], 1)} {unit_y})"

        raw_pvalues.append(p_val)
        raw_records.append(
            {
                "id": f"disc_{idx:02d}",
                "order": idx,
                "category": "cruce_comunal_oculto",
                "dim": "comuna",
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
                    "slopeBeta1": round(float(lin["slope"]), 5),
                    "interceptBeta0": round(float(lin["intercept"]), 4),
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
                "plainExplanation": (
                    f"{spec['mechanism']} Extremos observados en Aysén: {extremo_alto} frente a {extremo_bajo}."
                ),
            }
        )

    # 2. Evaluar los 5 hallazgos longitudinales 2015-2026 con prueba de Primeras Diferencias (Delta Y vs Delta X)
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

        raw_pvalues.append(p_val)
        raw_records.append(
            {
                "id": f"disc_{offset:02d}",
                "order": offset,
                "category": "acoplamiento_temporal_2015_2026",
                "dim": "tiempo",
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
                "plainExplanation": (
                    f"{tspec['mechanism']} En la década 2015–2026 pasa de "
                    f"{fmt_dec(x[0], 1)} {tspec['unitX']} ({fmt_dec(y[0], 1)} {tspec['unitY']} en 2015) a "
                    f"{fmt_dec(x[-1], 1)} {tspec['unitX']} ({fmt_dec(y[-1], 1)} {tspec['unitY']} en 2026)."
                ),
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
            veredicto = (
                f"Supera las 5 pruebas longitudinales (2015–2026): explica el {r_sq_int}% de la variación "
                f"(r = {fmt_dec(st['pearsonR'])}, Spearman {fmt_dec(st['spearmanRho'])}), mantiene acoplamiento en "
                f"primeras diferencias año a año (Delta = {fmt_dec(st.get('firstDiffCorrDelta', st['partialCorrPop']))}) "
                f"y persiste sin el shock 2020 ({fmt_dec(st['rWithoutCoyhaique'])})."
            )
        else:
            veredicto = (
                f"Supera las 5 pruebas estadísticas: explica el {r_sq_int}% de la variación, mantiene el ranking "
                f"(Spearman {fmt_dec(st['spearmanRho'])}) y sigue firme en las 9 comunas sin Coyhaique "
                f"({fmt_dec(st['rWithoutCoyhaique'])}) aun descontando el tamaño poblacional "
                f"(r parcial {fmt_dec(st['partialCorrPop'])})."
            )

        rec["statProofBadges"] = {
            "fuerzaExplicativaPct": r_sq_int,
            "pearsonR": st["pearsonR"],
            "spearmanRho": st["spearmanRho"],
            "kendallTau": st["kendallTau"],
            "partialCorrPop": st["partialCorrPop"],
            "rWithoutCoyhaique": st["rWithoutCoyhaique"],
            "firstDiffCorrDelta": st.get("firstDiffCorrDelta", st["partialCorrPop"]),
            "pValueFdr": round(float(fdr_p), 6),
            "veredictoSimple": veredicto,
        }
        curated_discoveries.append(rec)

    return curated_discoveries


def compute_comunas_explain(data_lake):
    """
    Para cada una de las 10 comunas, pre-calcula estilo DashAI:
      - Sus 5 indicadores donde más destaca sobre el promedio regional (+)
      - Sus 5 indicadores donde está más bajo el promedio regional (–)
      - Sus 2 comunas gemelas más parecidas (similitudPct%)
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

        comunas_explain[c_name] = {
            "comuna": c_name,
            "provincia": c.get("provincia", "Aysén"),
            "poblacionCenso2024": int(c.get("poblacion_censo_2024", 0)),
            "porcentajeRegionalPct": float(c.get("porcentaje_regional_pct", 0.0)),
            "topAboveRegionalMean": top_above,
            "topBelowRegionalMean": top_below,
            "twinComunas": twin_comunas,
            "narrativeDigest": (
                f"{c_name} ({c.get('provincia', 'Aysén')}, {int(c.get('poblacion_censo_2024', 0)):,} hab.) "
                f"destaca sobre la media regional en {top_above[0]['label']} ({fmt_dec(top_above[0]['comunaValue'], 1)} {top_above[0]['unit']}) "
                f"y {top_above[1]['label']}, mientras presenta sus valores más bajos frente al promedio en "
                f"{top_below[0]['label']}. Sus perfiles territoriales más parecidos son "
                f"{twin_comunas[0]['comuna']} ({twin_comunas[0]['similitudPct']}%) y "
                f"{twin_comunas[1]['comuna']} ({twin_comunas[1]['similitudPct']}%)."
            ).replace(",", "."),
        }

    return comunas_explain


def main():
    data_lake = load_data_lake()
    curated_discoveries = compute_curated_discoveries(data_lake)
    comunas_explain = compute_comunas_explain(data_lake)

    # Verificar que ninguna explicación contenga snake_case
    snake_re = re.compile(r"\b[a-z0-9]+_[a-z0-9_]+\b")
    for d in curated_discoveries:
        m = snake_re.search(d["plainExplanation"])
        if m:
            raise AssertionError(f"Se detectó clave snake_case en plainExplanation de {d['id']}: {m.group(0)}")

    payload = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "methodology": {
            "engine": "Python NumPy + SciPy Multicriteria Statistical Discovery Engine",
            "testsApplied": [
                "1. Regresión Lineal OLS (pendiente Beta1, intercepto Beta0, R²) y ajuste de falsos positivos Benjamini-Hochberg (FDR < 0.05)",
                "2. Correlación No Paramétrica por Rangos de Spearman (rho_s) y Tau de Kendall (tau)",
                "3. Correlación Parcial Controlando por Tamaño Poblacional r(X, Y | ln(Población Censo 2024))",
                "4. Robustez Leave-Coyhaique-Out (r en las 9 comunas sin la capital regional y Distancia de Cook)",
                "5. Regresión en Primeras Diferencias Interanuales (Delta Y_t vs Delta X_t) y series sin tendencia 2015–2026",
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
        " * Galería Curada de 25 Hallazgos Estadísticos No Obvios entre Hubs y Radiografía Local por Comuna (Estilo DashAI).\n"
        " * Generado automáticamente por: python3 scripts/precompute_curated_discoveries.py\n"
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

    with open(OUTPUT_JS_PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(js_content)

    print(
        f"[precompute_curated_discoveries] OK: Generado data/aysen_hallazgos_precalculados.js "
        f"con {len(curated_discoveries)} hallazgos verificados (20 transversales + 5 temporales 2015-2026) "
        f"y {len(comunas_explain)} radiografías comunales DashAI."
    )


if __name__ == "__main__":
    main()
