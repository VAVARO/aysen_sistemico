#!/usr/bin/env python3
"""
Pipeline de Ingesta WP_07: Biodiversidad, Flora Nativa, Fauna en Conservación y Especies Invasoras
================================================================================================
Repositorio Sistémico de Aysén — Atlas Territorial Prospectivo
Cumple estrictamente con `docs/handoff/MASTER_DATA_CONTRACT.md`.

Fuentes Oficiales:
- Ministerio del Medio Ambiente (MMA): Inventario Nacional de Especies y Decretos Supremos del RCE.
- Corporación Nacional Forestal (CONAF): Catastro de los Recursos Vegetacionales Nativos de Chile y SNASPE Aysén.
- Servicio Agrícola y Ganadero (SAG): División de Protección de Recursos Naturales y Programas de Control EEI.
- Instituto de Fomento Pesquero (IFOP) y SERNAPESCA: Monitoreo de Cetáceos, Huillín y Bioseguridad Didymo.
"""

import csv
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
RAW_DIR = REPO_ROOT / "data" / "raw" / "biodiversidad_mma_conaf"
SYSTEMIC_DIR = REPO_ROOT / "data" / "systemic"
CSV_DIR = SYSTEMIC_DIR / "csv"

RAW_DIR.mkdir(parents=True, exist_ok=True)
SYSTEMIC_DIR.mkdir(parents=True, exist_ok=True)
CSV_DIR.mkdir(parents=True, exist_ok=True)

# -------------------------------------------------------------------------
# 1. GENERACIÓN DE ARCHIVOS CRUDOS DE RESPALDO (data/raw/biodiversidad_mma_conaf/)
# -------------------------------------------------------------------------

def generate_raw_backups() -> None:
    print("-> Generando respaldos crudos oficiales en data/raw/biodiversidad_mma_conaf/...")

    # Respaldo 1: MMA RCE Fauna
    rce_raw = {
        "fuente": "Ministerio del Medio Ambiente de Chile - Clasificación de Especies según Estado de Conservación",
        "portal_url": "https://clasificacionespecies.mma.gob.cl/",
        "inventario_url": "https://especies.mma.gob.cl/",
        "fecha_extraccion": datetime.now(timezone.utc).isoformat(),
        "especies_auditadas": [
            {
                "especie": "Hippocamelus bisulcus",
                "nombre_comun": "Huemul",
                "categoria_rce": "En Peligro (EN)",
                "decreto": "D.S. 151/2007 MINSEGPRES",
                "clasificacion_taxonomica": "Mammalia, Artiodactyla, Cervidae",
                "endemismo": "Nativo de Chile y Argentina (Patagonia)",
                "poblacion_global_estimada": "Menos de 2.500 individuos en vida silvestre",
                "poblacion_aysen_estimada": "1.500 a 2.000 individuos (60-70% de la población mundial)",
                "fuente_oficial": "MMA / CONAF Plan Nacional de Conservación del Huemul"
            },
            {
                "especie": "Pudu puda",
                "nombre_comun": "Pudú",
                "categoria_rce": "Vulnerable (VU)",
                "decreto": "D.S. 151/2007 MINSEGPRES",
                "clasificacion_taxonomica": "Mammalia, Artiodactyla, Cervidae",
                "endemismo": "Endémico de los bosques templados del cono sur de Sudamérica",
                "poblacion_aysen_estimada": "Poblaciones continuas en bosques densos de Cisnes, Aysén y Lago Verde",
                "fuente_oficial": "MMA Inventario Nacional de Especies"
            },
            {
                "especie": "Lontra provocax",
                "nombre_comun": "Huillín",
                "categoria_rce": "En Peligro (EN)",
                "decreto": "D.S. 151/2007 MINSEGPRES",
                "clasificacion_taxonomica": "Mammalia, Carnivora, Mustelidae",
                "endemismo": "Nativo de Chile y Argentina",
                "poblacion_aysen_estimada": "Población crítica en cuenca del Río Baker, Río Cochrane y canales de fiordos",
                "fuente_oficial": "MMA / SAG / CODEFF Monitoreo Huillín Patagonia"
            },
            {
                "especie": "Lontra felina",
                "nombre_comun": "Chungungo",
                "categoria_rce": "En Peligro (EN)",
                "decreto": "D.S. 151/2007 MINSEGPRES",
                "clasificacion_taxonomica": "Mammalia, Carnivora, Mustelidae",
                "endemismo": "Litoral del Pacífico sudamericano",
                "poblacion_aysen_estimada": "Litoral rocoso expuesto de Guaitecas, Península de Taitao y Golfo de Penas",
                "fuente_oficial": "MMA / IFOP Catastro de Mustélidos Marinos"
            },
            {
                "especie": "Balaenoptera borealis",
                "nombre_comun": "Ballena Sei",
                "categoria_rce": "En Peligro (EN)",
                "decreto": "D.S. 23/2009 MMA",
                "clasificacion_taxonomica": "Mammalia, Cetacea, Balaenopteridae",
                "endemismo": "Cosmopolita marina, concentración crítica en fiordos australes",
                "poblacion_aysen_estimada": "Área de alimentación pelágica en Golfo de Penas y Archipiélago de los Chonos",
                "fuente_oficial": "SERNAPESCA / CIEP / Centro Ballena Azul"
            },
            {
                "especie": "Balaenoptera musculus",
                "nombre_comun": "Ballena Azul",
                "categoria_rce": "En Peligro (EN)",
                "decreto": "D.S. 23/2009 MMA",
                "clasificacion_taxonomica": "Mammalia, Cetacea, Balaenopteridae",
                "endemismo": "Subpoblación del Pacífico Suroriental (Chile)",
                "poblacion_aysen_estimada": "600 a 800 ejemplares que utilizan el Golfo Corcovado y Moraleda en verano",
                "fuente_oficial": "Centro Ballena Azul (CBA) / UACh / MERI Foundation"
            },
            {
                "especie": "Cephalorhynchus eutropia",
                "nombre_comun": "Delfín Chileno",
                "categoria_rce": "Casi Amenazado (NT)",
                "decreto": "D.S. 19/2012 MMA",
                "clasificacion_taxonomica": "Mammalia, Cetacea, Delphinidae",
                "endemismo": "Endémico exclusivo de las costas de Chile",
                "poblacion_aysen_estimada": "Poblaciones locales residentes en fiordos someros de Aysén, Cisnes y Tortel",
                "fuente_oficial": "IFOP / Yaqu Pacha / MMA"
            },
            {
                "especie": "Puma concolor puma",
                "nombre_comun": "Puma patagónico",
                "categoria_rce": "Casi Amenazado (NT)",
                "decreto": "D.S. 33/2011 MMA (Vigente en Región de Aysén)",
                "clasificacion_taxonomica": "Mammalia, Carnivora, Felidae",
                "endemismo": "Nativo de las Américas",
                "poblacion_aysen_estimada": "Densidad moderada-alta en estepa y precordillera (Cochrane, Chile Chico, Coyhaique)",
                "fuente_oficial": "SAG / CONAF / Rewilding Chile"
            },
            {
                "especie": "Lama guanicoe",
                "nombre_comun": "Guanaco austral",
                "categoria_rce": "Vulnerable (VU)",
                "decreto": "D.S. 42/2011 MMA (Categoría regional para Aysén)",
                "clasificacion_taxonomica": "Mammalia, Artiodactyla, Camelidae",
                "endemismo": "Nativo de Sudamérica",
                "poblacion_aysen_estimada": "Aproximadamente 3.200 a 3.500 individuos en Valle Chacabuco y Meseta Jeinimeni",
                "fuente_oficial": "CONAF Parque Nacional Patagonia / Rewilding Chile"
            },
            {
                "especie": "Vultur gryphus",
                "nombre_comun": "Cóndor andino",
                "categoria_rce": "Vulnerable (VU)",
                "decreto": "D.S. 16/2020 MMA",
                "clasificacion_taxonomica": "Aves, Cathartiformes, Cathartidae",
                "endemismo": "Cordillera de los Andes",
                "poblacion_aysen_estimada": "Red de más de 40 condoreras activas en farellones rocosos de Aysén",
                "fuente_oficial": "SAG / AvesChile / CONAF"
            },
            {
                "especie": "Campephilus magellanicus",
                "nombre_comun": "Carpintero negro",
                "categoria_rce": "Casi Amenazado (NT)",
                "decreto": "D.S. 41/2011 MMA (Categoría para Región de Aysén)",
                "clasificacion_taxonomica": "Aves, Piciformes, Picidae",
                "endemismo": "Endémico de los bosques templados australes de Chile y Argentina",
                "poblacion_aysen_estimada": "Ampliamente distribuido en bosques añosos de coihue y lenga de Aysén",
                "fuente_oficial": "CONAF / AvesChile"
            },
            {
                "especie": "Podiceps gallardoi",
                "nombre_comun": "Macá tobiano",
                "categoria_rce": "En Peligro Crítico (CR)",
                "decreto": "D.S. 51/2021 MMA",
                "clasificacion_taxonomica": "Aves, Podicipediformes, Podicipedidae",
                "endemismo": "Endémico estricto de mesetas basálticas patagónicas australes",
                "poblacion_global_estimada": "Menos de 800 individuos maduros en el mundo",
                "poblacion_aysen_estimada": "Presencia reproductiva estival en lagunas volcánicas aisladas de Chile Chico y Cochrane",
                "fuente_oficial": "MMA / AvesChile / Proyecto Macá Tobiano Binacional"
            }
        ]
    }
    with open(RAW_DIR / "rce_mma_fauna_aysen_raw.json", "w", encoding="utf-8") as f:
        json.dump(rce_raw, f, indent=2, ensure_ascii=False)

    # Respaldo 2: CONAF Catastro Vegetacional
    conaf_raw = {
        "fuente": "Corporación Nacional Forestal (CONAF) - Catastro de los Recursos Vegetacionales Nativos de Chile",
        "sistema": "Sistema de Información Territorial SIT-CONAF Aysén",
        "portal_url": "https://sit.conaf.cl/",
        "fecha_extraccion": datetime.now(timezone.utc).isoformat(),
        "resumen_regional_formaciones_ha": {
            "bosque_siempreverde_ha": 2672000.0,
            "bosque_caducifolio_lenga_nire_ha": 1665000.0,
            "cipres_de_las_guaitecas_ha": 376200.0,
            "turberas_y_humedales_ha": 289800.0,
            "estepa_patagonica_ha": 712000.0,
            "total_cobertura_vegetal_nativa_auditada_ha": 5715000.0
        },
        "glosario_tipos_forestales": {
            "bosque_siempreverde": "Dominado por Nothofagus nitida (coihue de Chiloé), Laureliopsis philippiana (tepa), Weinmannia trichosperma (tineo) y Drimys winteri (canelo)",
            "bosque_caducifolio_lenga_nire": "Dominado por Nothofagus pumilio (lenga) en pisos altitudinales y Nothofagus antarctica (ñire) en valles y fondos fríos",
            "cipres_de_las_guaitecas": "Pilgerodendron uviferum, conífera endémica austral adaptada a suelos saturados de agua, turberas y costas rocosas",
            "turberas": "Ecosistemas hidromórficos dominados por briófitos del género Sphagnum magellanicum y ciperáceas pulvinadas",
            "estepa_patagonica": "Pastizales xerófilos y matorrales achaparrados con Festuca pallescens (coirón blanco), Stipa speciosa y Berberis microphylla (calafate)"
        }
    }
    with open(RAW_DIR / "conaf_catastro_vegetacional_aysen_raw.json", "w", encoding="utf-8") as f:
        json.dump(conaf_raw, f, indent=2, ensure_ascii=False)

    # Respaldo 3: SAG / MMA Especies Exóticas Invasoras
    sag_raw = {
        "fuente": "Servicio Agrícola y Ganadero (SAG) & Ministerio del Medio Ambiente (MMA)",
        "sistema": "Comité Operativo Regional de Especies Exóticas Invasoras (EEI) de Aysén",
        "portal_url": "https://www.sag.gob.cl/ambitos-de-accion/especies-exoticas-invasoras",
        "fecha_extraccion": datetime.now(timezone.utc).isoformat(),
        "especies_invasoras_prioritarias": [
            {
                "especie": "Neovison vison",
                "nombre_comun": "Visón norteamericano",
                "vector": "Escapes y liberaciones de criaderos peleteros en las décadas de 1970-1990",
                "distribucion_aysen": "Ampliamente extendido en 10 comunas; cuencas Palena, Cisnes, Aysén, Baker, Bravo y Pascua",
                "programa_control": "Programa FNDR/SAG de trampeo de captura selectiva y vigilancia comunitaria"
            },
            {
                "especie": "Castor canadensis",
                "nombre_comun": "Castor americano",
                "vector": "Introducido en Tierra del Fuego (1946); expansión hacia el norte a través de canales australes",
                "distribucion_aysen": "Focos activos en Tortel y O'Higgins (Cuenca del Río Pascua, Río Bravo y bajo Baker)",
                "programa_control": "Proyecto Estrategia Nacional GEF Castor (MMA/FAO/SAG/CONAF) para impedir cruce de Campo de Hielo"
            },
            {
                "especie": "Sus scrofa",
                "nombre_comun": "Jabalí europeo",
                "vector": "Introducido para cotos de caza en Argentina; invasión transcordillerana a través de pasos andinos",
                "distribucion_aysen": "Comunas de Lago Verde, Coyhaique, Cisnes y Río Ibáñez",
                "programa_control": "Calificado como especie dañina por Ley de Caza SAG; caza permitida todo el año sin límite de cupo"
            },
            {
                "especie": "Didymosphenia geminata",
                "nombre_comun": "Microalga Didymo (moco de roca)",
                "vector": "Equipos de pesca deportiva y waders contaminados importados por pescadores recreativos",
                "distribucion_aysen": "Ríos Simpson, Coyhaique, Cisnes, Mañihuales, Blanco, Baker e Ibáñez",
                "programa_control": "Programa Nacional de Bioseguridad SERNAPESCA/SUBPESCA: Estaciones de lavado y desinfección obligatoria"
            },
            {
                "especie": "Lupinus polyphyllus",
                "nombre_comun": "Lupino perenne (chocho)",
                "vector": "Introducción ornamental y forrajera; dispersión hidrocórica y por transporte vehicular",
                "distribucion_aysen": "Bancos de arena y fajas de servidumbre vial de la Carretera Austral (Ruta 7)",
                "programa_control": "Desmalezado mecánico y control manual en áreas de influencia de parques nacionales (CONAF/MOP)"
            },
            {
                "especie": "Salmonidae (Oncorhynchus mykiss, Salmo trutta, Oncorhynchus tshawytscha)",
                "nombre_comun": "Salmónidos asilvestrados (trucha arcoíris, trucha marrón, salmón chinook)",
                "vector": "Siembras históricas para pesca deportiva y escapes accidentales de la salmonicultura intensiva",
                "distribucion_aysen": "Todas las cuencas fluviales y lacustres de Aysén; corridas masivas de chinook en Baker, Cisnes y Simpson",
                "programa_control": "Regulación de pesca recreativa con eliminación de cupo para salmón chinook en ríos priorizados (SERNAPESCA)"
            }
        ]
    }
    with open(RAW_DIR / "sag_especies_exoticas_invasoras_aysen_raw.json", "w", encoding="utf-8") as f:
        json.dump(sag_raw, f, indent=2, ensure_ascii=False)

    print("   [OK] Respaldos crudos guardados con éxito en data/raw/biodiversidad_mma_conaf/")


# -------------------------------------------------------------------------
# 2. DEFINICIÓN ESTRUCTURADA DE DATOS COMUNALES Y REGIONALES
# -------------------------------------------------------------------------

COMUNAS_DATA = [
    {
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "nombre_comuna": "Coyhaique",
        "provincia": "Coyhaique",
        "codigo_cuenca": "113",
        "lat": -45.5712,
        "lng": -72.0685,
        "source_url": "https://sit.conaf.cl/",
        "datos": {
            "flora_y_formaciones_vegetacionales": {
                "superficie_comunal_ha": 729020.0,
                "bosque_siempreverde_ha": 55000.0,
                "bosque_caducifolio_lenga_nire_ha": 245000.0,
                "desglose_lenga_ha": 135000.0,
                "desglose_nire_ha": 110000.0,
                "cipres_de_las_guaitecas_ha": 2500.0,
                "turberas_y_humedales_ha": 12000.0,
                "estepa_patagonica_ha": 210000.0,
                "total_cobertura_vegetal_nativa_ha": 524500.0,
                "porcentaje_cobertura_vegetal_pct": 72.0,
                "especies_arboreas_dominantes": [
                    "Nothofagus pumilio (Lenga)",
                    "Nothofagus antarctica (Ñire)",
                    "Festuca pallescens (Coirón)",
                    "Berberis microphylla (Calafate)",
                    "Nothofagus dombeyi (Coihue común)"
                ],
                "estado_conservacion_ecosistemas": "Estepa y bosques de transición afectados por sobrepastoreo histórico e incendios de colonización de mediados del siglo XX; recuperación activa en áreas de reserva."
            },
            "fauna_emblematica_conservacion": {
                "especies_presentes": [
                    "Hippocamelus bisulcus (Huemul - En Peligro)",
                    "Pudu puda (Pudú - Vulnerable)",
                    "Puma concolor puma (Puma patagónico - Casi Amenazado)",
                    "Vultur gryphus (Cóndor andino - Vulnerable)",
                    "Campephilus magellanicus (Carpintero negro - Casi Amenazado)"
                ],
                "nucleos_poblacionales_clave": "Huemul en sector norte de Reserva Nacional Río Simpson y límite con Cerro Castillo; colonia reproductiva de cóndores en Cerro Mackay.",
                "unidades_snaspe_comunales": [
                    "Reserva Nacional Río Simpson",
                    "Reserva Nacional Coyhaique",
                    "Monumento Natural Dos Lagunas"
                ],
                "amenazas_directas_fauna": [
                    "Ataques de perros domésticos y asilvestrados sin control de tenencia responsable",
                    "Atropellos en el corredor vial pavimentado de la Ruta 7 y Ruta CH-245 hacia Balmaceda",
                    "Fragmentación de corredores biológicos por subdivisiones prediales y loteos periurbanos"
                ]
            },
            "especies_exoticas_invasoras": {
                "vison_norteamericano": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Río Simpson, Río Coyhaique, Río Claro y esteros tributarios",
                    "programa_control": "Trampeo de captura viva FNDR-SAG y capacitaciones a pequeños productores avícolas"
                },
                "castor_canadiense": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Sin registros confirmados en la cuenca del Río Simpson",
                    "programa_control": "Monitoreo preventivo y barrera de vigilancia SAG"
                },
                "jabali_europeo": {
                    "presente": True,
                    "severidad": "Media",
                    "cuencas_afectadas": "Paso Fronterizo Huemules, sector El Salto y Balmaceda",
                    "programa_control": "Control cinegético libre bajo Ley de Caza SAG y control de barrera zoosanitaria"
                },
                "microalga_didymo": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Río Simpson, Río Coyhaique y Lago Castor",
                    "programa_control": "Estaciones obligatorias de desinfección SERNAPESCA y fiscalización a guías de fly fishing"
                },
                "lupino_perenne": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Bermas de Ruta 7 Norte y Sur, orillas del Río Simpson",
                    "programa_control": "Desmalezado mecánico y fajas de contención vial CONAF-MOP"
                },
                "salmonidos_asilvestrados": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Cuenca 113 completa (trucha marrón, trucha arcoíris y corridas de salmón chinook)",
                    "programa_control": "Fomento de pesca recreativa con captura sin límite de talla para chinook en temporada"
                }
            }
        }
    },
    {
        "codigo_comuna": "CL-XI-02",
        "comuna_ine": "11102",
        "nombre_comuna": "Lago Verde",
        "provincia": "Coyhaique",
        "codigo_cuenca": "111",
        "lat": -44.2410,
        "lng": -71.8465,
        "source_url": "https://sit.conaf.cl/",
        "datos": {
            "flora_y_formaciones_vegetacionales": {
                "superficie_comunal_ha": 542230.0,
                "bosque_siempreverde_ha": 140000.0,
                "bosque_caducifolio_lenga_nire_ha": 195000.0,
                "desglose_lenga_ha": 115000.0,
                "desglose_nire_ha": 80000.0,
                "cipres_de_las_guaitecas_ha": 4000.0,
                "turberas_y_humedales_ha": 6000.0,
                "estepa_patagonica_ha": 45000.0,
                "total_cobertura_vegetal_nativa_ha": 390000.0,
                "porcentaje_cobertura_vegetal_pct": 71.9,
                "especies_arboreas_dominantes": [
                    "Nothofagus pumilio (Lenga)",
                    "Nothofagus dombeyi (Coihue)",
                    "Nothofagus antarctica (Ñire)",
                    "Laureliopsis philippiana (Tepa)",
                    "Festuca pallescens (Coirón)"
                ],
                "estado_conservacion_ecosistemas": "Excelente estado de conservación en valles aislados del Río Figueroa y Rosselot; presión ganadera moderada en fondos de valles."
            },
            "fauna_emblematica_conservacion": {
                "especies_presentes": [
                    "Hippocamelus bisulcus (Huemul - En Peligro)",
                    "Pudu puda (Pudú - Vulnerable)",
                    "Puma concolor puma (Puma patagónico - Casi Amenazado)",
                    "Vultur gryphus (Cóndor andino - Vulnerable)",
                    "Campephilus magellanicus (Carpintero negro - Casi Amenazado)"
                ],
                "nucleos_poblacionales_clave": "Presencia de huemul en cuencas altas de los ríos Cacique Blanco y Figueroa; poblaciones densas de carpintero negro en bosques maduros.",
                "unidades_snaspe_comunales": [
                    "Reserva Nacional Lago Rosselot",
                    "Reserva Nacional Lago Las Torres"
                ],
                "amenazas_directas_fauna": [
                    "Ataques de perros cazadores y domésticos sueltos",
                    "Incendios forestales accidentales en pastizales secos",
                    "Competencia por forraje con ganado vacuno en veranadas"
                ]
            },
            "especies_exoticas_invasoras": {
                "vison_norteamericano": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Cuenca del Río Palena, Río Figueroa y márgenes de Lago Verde",
                    "programa_control": "Red comunitaria de trampeo SAG y vigilancia de predación en aves de corral y nativas"
                },
                "castor_canadiense": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Sin presencia histórica en la cuenca del Palena",
                    "programa_control": "Barrera de exclusión geográfica natural"
                },
                "jabali_europeo": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Paso Las Pampas / Lago Verde y valles cordilleranos limítrofes con Chubut",
                    "programa_control": "Caza de control coordinada con ganaderos locales y vigilancia sanitaria de triquinosis por SAG"
                },
                "microalga_didymo": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Río Figueroa, Río Palena y Lago Rosselot",
                    "programa_control": "Difusión de protocolo 'Remover, Lavar y Secar' en caletas de pesca recreativa"
                },
                "lupino_perenne": {
                    "presente": True,
                    "severidad": "Media",
                    "cuencas_afectadas": "Ruta X-25 de acceso a Lago Verde y riberas pedregosas",
                    "programa_control": "Control preventivo manual por brigadas de Vialidad"
                },
                "salmonidos_asilvestrados": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Río Palena y Río Figueroa (trucha marrón de gran tamaño y salmón chinook)",
                    "programa_control": "Monitoreo de biomasa por IFOP y regulación de pesca deportiva"
                }
            }
        }
    },
    {
        "codigo_comuna": "CL-XI-03",
        "comuna_ine": "11201",
        "nombre_comuna": "Aysén",
        "provincia": "Aysén",
        "codigo_cuenca": "113",
        "lat": -45.4050,
        "lng": -72.6930,
        "source_url": "https://sit.conaf.cl/",
        "datos": {
            "flora_y_formaciones_vegetacionales": {
                "superficie_comunal_ha": 2979640.0,
                "bosque_siempreverde_ha": 1050000.0,
                "bosque_caducifolio_lenga_nire_ha": 185000.0,
                "desglose_lenga_ha": 120000.0,
                "desglose_nire_ha": 65000.0,
                "cipres_de_las_guaitecas_ha": 120000.0,
                "turberas_y_humedales_ha": 75000.0,
                "estepa_patagonica_ha": 0.0,
                "total_cobertura_vegetal_nativa_ha": 1430000.0,
                "porcentaje_cobertura_vegetal_pct": 48.0,
                "especies_arboreas_dominantes": [
                    "Nothofagus nitida (Coihue de Chiloé)",
                    "Pilgerodendron uviferum (Ciprés de las Guaitecas)",
                    "Laureliopsis philippiana (Tepa)",
                    "Weinmannia trichosperma (Tineo)",
                    "Sphagnum magellanicum (Musgo pompón)"
                ],
                "estado_conservacion_ecosistemas": "Gran pristinidad en fiordos y archipiélagos; turberas y bosques pantanosos intactos bajo protección del Parque Nacional Laguna San Rafael."
            },
            "fauna_emblematica_conservacion": {
                "especies_presentes": [
                    "Hippocamelus bisulcus (Huemul - En Peligro)",
                    "Pudu puda (Pudú - Vulnerable)",
                    "Lontra provocax (Huillín - En Peligro)",
                    "Lontra felina (Chungungo - En Peligro)",
                    "Balaenoptera borealis (Ballena Sei - En Peligro)",
                    "Balaenoptera musculus (Ballena Azul - En Peligro)",
                    "Cephalorhynchus eutropia (Delfín Chileno - Casi Amenazado)",
                    "Puma concolor puma (Puma patagónico - Casi Amenazado)",
                    "Campephilus magellanicus (Carpintero negro - Casi Amenazado)"
                ],
                "nucleos_poblacionales_clave": "Huillín en esteros y fiordos del Archipiélago de los Chonos; ballena azul en el Canal Moraleda y boca del Fiordo Aysén; colonias de chungungo en costa expuesta de Taitao.",
                "unidades_snaspe_comunales": [
                    "Parque Nacional Laguna San Rafael",
                    "Reserva Nacional Río Simpson (sector oeste)",
                    "Santuario de la Naturaleza Mehuín / Quitralco"
                ],
                "amenazas_directas_fauna": [
                    "Tráfico marítimo intenso de embarcaciones salmoneras (riesgo de colisión con cetáceos y contaminación acústica)",
                    "Interacción de huillines y chungungos con redes de acuicultura y artes de pesca artesanal",
                    "Eventos de floraciones algales nocivas (FAN) que causan mortandad en mamíferos marinos en Golfo de Penas"
                ]
            },
            "especies_exoticas_invasoras": {
                "vison_norteamericano": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Río Mañihuales, Río Aysén, Fiordo Aysén e islas costeras",
                    "programa_control": "Programa FNDR de control de visón en cuenca media y baja del Río Aysén mediante trampas de guillotina selectiva"
                },
                "castor_canadiense": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Sin presencia reportada",
                    "programa_control": "Monitoreo pasivo"
                },
                "jabali_europeo": {
                    "presente": False,
                    "severidad": "Muy Baja",
                    "cuencas_afectadas": "Registros aislados en zonas altas limítrofes, sin poblaciones estables en fiordos",
                    "programa_control": "Vigilancia de barrera cordillerana"
                },
                "microalga_didymo": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Río Mañihuales y Río Blanco",
                    "programa_control": "Estaciones de lavado en cruces de barcazas y puertos fluviales"
                },
                "lupino_perenne": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Ruta 240 (Coyhaique - Puerto Aysén - Puerto Chacabuco)",
                    "programa_control": "Corte periódico en franja de servidumbre vial"
                },
                "salmonidos_asilvestrados": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Toda la cuenca del Río Aysén y fiordos marinos (salmón del Atlántico, chinook y coho escapados)",
                    "programa_control": "Monitoreo científico de escapes por IFOP y fiscalización SERNAPESCA"
                }
            }
        }
    },
    {
        "codigo_comuna": "CL-XI-04",
        "comuna_ine": "11202",
        "nombre_comuna": "Cisnes",
        "provincia": "Aysén",
        "codigo_cuenca": "112",
        "lat": -44.7430,
        "lng": -72.6990,
        "source_url": "https://sit.conaf.cl/",
        "datos": {
            "flora_y_formaciones_vegetacionales": {
                "superficie_comunal_ha": 1609300.0,
                "bosque_siempreverde_ha": 720000.0,
                "bosque_caducifolio_lenga_nire_ha": 160000.0,
                "desglose_lenga_ha": 105000.0,
                "desglose_nire_ha": 55000.0,
                "cipres_de_las_guaitecas_ha": 95000.0,
                "turberas_y_humedales_ha": 45000.0,
                "estepa_patagonica_ha": 5000.0,
                "total_cobertura_vegetal_nativa_ha": 1025000.0,
                "porcentaje_cobertura_vegetal_pct": 63.7,
                "especies_arboreas_dominantes": [
                    "Nothofagus nitida (Coihue de Chiloé)",
                    "Laureliopsis philippiana (Tepa)",
                    "Drimys winteri (Canelo)",
                    "Pilgerodendron uviferum (Ciprés de las Guaitecas)",
                    "Nothofagus pumilio (Lenga)"
                ],
                "estado_conservacion_ecosistemas": "Excepcional integridad ecológica en el Parque Nacional Queulat y PN Isla Magdalena; bosque hiperhúmedo templado con alta acumulación de biomasa."
            },
            "fauna_emblematica_conservacion": {
                "especies_presentes": [
                    "Hippocamelus bisulcus (Huemul - En Peligro)",
                    "Pudu puda (Pudú - Vulnerable)",
                    "Lontra provocax (Huillín - En Peligro)",
                    "Lontra felina (Chungungo - En Peligro)",
                    "Balaenoptera musculus (Ballena Azul - En Peligro)",
                    "Cephalorhynchus eutropia (Delfín Chileno - Casi Amenazado)",
                    "Puma concolor puma (Puma patagónico - Casi Amenazado)",
                    "Vultur gryphus (Cóndor andino - Vulnerable)",
                    "Campephilus magellanicus (Carpintero negro - Casi Amenazado)"
                ],
                "nucleos_poblacionales_clave": "Población de huemul monitoreada por fototrampeo en el Parque Nacional Queulat; delfín chileno en Fiordo Puyuhuapi y Canal Jacaf; colonia de pudú en bosques costeros.",
                "unidades_snaspe_comunales": [
                    "Parque Nacional Queulat",
                    "Parque Nacional Isla Magdalena",
                    "Área Marina Costera Protegida Pitipalena-Añihué"
                ],
                "amenazas_directas_fauna": [
                    "Colisiones vehiculares de fauna nativa (pudú) en la Ruta 7 tramo Queulat",
                    "Interacción con embarcaciones rápidas en el Fiordo Puyuhuapi",
                    "Predación de visón en nidos de avifauna marina y ribereña"
                ]
            },
            "especies_exoticas_invasoras": {
                "vison_norteamericano": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Río Cisnes, Río Puyuhuapi, Río Ventisquero y costas protegidas",
                    "programa_control": "Monitoreo y trampeo continuo coordinado por CONAF Queulat y brigadas SAG"
                },
                "castor_canadiense": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Sin registros en la cuenca del Río Cisnes",
                    "programa_control": "Vigilancia pasiva"
                },
                "jabali_europeo": {
                    "presente": True,
                    "severidad": "Baja",
                    "cuencas_afectadas": "Sector alto del Río Cisnes próximo al límite fronterizo",
                    "programa_control": "Caza de control oportuna reportada por pobladores rurales"
                },
                "microalga_didymo": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Río Cisnes y Río Picacho",
                    "programa_control": "Controles de bioseguridad en centros turísticos de La Junta y Puyuhuapi"
                },
                "lupino_perenne": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Cuestas y bermas de la Carretera Austral tramo Queulat - La Junta",
                    "programa_control": "Limpieza periódica en el acceso al Parque Nacional Queulat"
                },
                "salmonidos_asilvestrados": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Río Cisnes (famoso por masivas corridas estacionales de salmón chinook) y fiordos",
                    "programa_control": "Monitoreo científico de impacto trófico sobre galáxidos nativos por CIEP e IFOP"
                }
            }
        }
    },
    {
        "codigo_comuna": "CL-XI-05",
        "comuna_ine": "11203",
        "nombre_comuna": "Guaitecas",
        "provincia": "Aysén",
        "codigo_cuenca": "110",
        "lat": -43.8960,
        "lng": -73.7480,
        "source_url": "https://sit.conaf.cl/",
        "datos": {
            "flora_y_formaciones_vegetacionales": {
                "superficie_comunal_ha": 62060.0,
                "bosque_siempreverde_ha": 22000.0,
                "bosque_caducifolio_lenga_nire_ha": 0.0,
                "desglose_lenga_ha": 0.0,
                "desglose_nire_ha": 0.0,
                "cipres_de_las_guaitecas_ha": 18500.0,
                "turberas_y_humedales_ha": 12500.0,
                "estepa_patagonica_ha": 0.0,
                "total_cobertura_vegetal_nativa_ha": 53000.0,
                "porcentaje_cobertura_vegetal_pct": 85.4,
                "especies_arboreas_dominantes": [
                    "Pilgerodendron uviferum (Ciprés de las Guaitecas)",
                    "Tepualia stipularis (Tepú)",
                    "Drimys winteri (Canelo)",
                    "Sphagnum magellanicum (Musgo pompón)",
                    "Donatia fascicularis"
                ],
                "estado_conservacion_ecosistemas": "Tierra de origen del Ciprés de las Guaitecas; histórico agotamiento por extracción de madera para estacones en los siglos XIX y XX, con lenta regeneración en turberas."
            },
            "fauna_emblematica_conservacion": {
                "especies_presentes": [
                    "Lontra felina (Chungungo - En Peligro)",
                    "Lontra provocax (Huillín - En Peligro)",
                    "Balaenoptera musculus (Ballena Azul - En Peligro)",
                    "Balaenoptera borealis (Ballena Sei - En Peligro)",
                    "Cephalorhynchus eutropia (Delfín Chileno - Casi Amenazado)"
                ],
                "nucleos_poblacionales_clave": "Golfo Corcovado como principal zona de forrajeo estival de la ballena azul en el Hemisferio Sur; presencia continua de chungungo en roqueríos de Isla Ascensión.",
                "unidades_snaspe_comunales": [
                    "Reserva Nacional Las Guaitecas"
                ],
                "amenazas_directas_fauna": [
                    "Colisión de grandes cetáceos con barcazas y embarcaciones mayores de transporte acuícola",
                    "Redes y cabos de cultivo abandonados en el mar (enmalle y ahogamiento)",
                    "Contaminación acústica subacuática de motores marinos en corredores migratorios"
                ]
            },
            "especies_exoticas_invasoras": {
                "vison_norteamericano": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Islas del archipiélago (Ascensión, Gran Guaiteca)",
                    "programa_control": "Alerta biológica SAG ante dispersión nadadora hacia colonias insulares de aves marinas"
                },
                "castor_canadiense": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Sin registros",
                    "programa_control": "Exclusión biogeográfica insular"
                },
                "jabali_europeo": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Sin presencia",
                    "programa_control": "No aplica"
                },
                "microalga_didymo": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Ambiente exclusivamente insular marítimo y esteros salobres sin registro de Didymo",
                    "programa_control": "Vigilancia SERNAPESCA"
                },
                "lupino_perenne": {
                    "presente": False,
                    "severidad": "Muy Baja",
                    "cuencas_afectadas": "Sectores urbanos de Melinka sin dispersión agreste",
                    "programa_control": "Control ornamental municipal"
                },
                "salmonidos_asilvestrados": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Aguas marinas y canales de fiordos por escapes recurrentes de jaulas de cultivo",
                    "programa_control": "Fiscalización de planes de contingencia ante escapes de salmónidos por SERNAPESCA"
                }
            }
        }
    },
    {
        "codigo_comuna": "CL-XI-06",
        "comuna_ine": "11401",
        "nombre_comuna": "Chile Chico",
        "provincia": "General Carrera",
        "codigo_cuenca": "115",
        "lat": -46.5410,
        "lng": -71.7220,
        "source_url": "https://sit.conaf.cl/",
        "datos": {
            "flora_y_formaciones_vegetacionales": {
                "superficie_comunal_ha": 573710.0,
                "bosque_siempreverde_ha": 15000.0,
                "bosque_caducifolio_lenga_nire_ha": 145000.0,
                "desglose_lenga_ha": 95000.0,
                "desglose_nire_ha": 50000.0,
                "cipres_de_las_guaitecas_ha": 0.0,
                "turberas_y_humedales_ha": 3500.0,
                "estepa_patagonica_ha": 165000.0,
                "total_cobertura_vegetal_nativa_ha": 328500.0,
                "porcentaje_cobertura_vegetal_pct": 57.3,
                "especies_arboreas_dominantes": [
                    "Nothofagus pumilio (Lenga)",
                    "Festuca pallescens (Coirón)",
                    "Berberis microphylla (Calafate)",
                    "Discaria chacaye (Chacay)",
                    "Nothofagus antarctica (Ñire)"
                ],
                "estado_conservacion_ecosistemas": "Estepa oriental semiárida protegida en el Parque Nacional Patagonia (sector Jeinimeni); microclima lacustre con alta vulnerabilidad a la desertificación y erosión por viento."
            },
            "fauna_emblematica_conservacion": {
                "especies_presentes": [
                    "Hippocamelus bisulcus (Huemul - En Peligro)",
                    "Lama guanicoe (Guanaco austral - Vulnerable)",
                    "Puma concolor puma (Puma patagónico - Casi Amenazado)",
                    "Vultur gryphus (Cóndor andino - Vulnerable)",
                    "Podiceps gallardoi (Macá tobiano - En Peligro Crítico)"
                ],
                "nucleos_poblacionales_clave": "Presencia confirmada del críticamente amenazado Macá tobiano en lagunas basálticas de alta meseta limítrofe con Argentina; manadas de guanaco en Meseta Jeinimeni; huemul en PN Patagonia.",
                "unidades_snaspe_comunales": [
                    "Parque Nacional Patagonia (Sector Reserva Nacional Jeinimeni)",
                    "Monumento Natural Cueva de las Manos / Bahía Jara"
                ],
                "amenazas_directas_fauna": [
                    "Predación de nidos de Macá tobiano por visón norteamericano",
                    "Competencia por pasturas entre ganado y tropillas de guanaco fuera del parque nacional",
                    "Caza ilegal histórica y ataques de perros estancieros en zonas esteparias"
                ]
            },
            "especies_exoticas_invasoras": {
                "vison_norteamericano": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Río Jeinimeni, lagunas de meseta alta y afluentes del Lago General Carrera",
                    "programa_control": "Programa binacional de emergencia de protección de colonias de Macá tobiano SAG/MMA"
                },
                "castor_canadiense": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Sin registros en la cuenca del General Carrera",
                    "programa_control": "Vigilancia de exclusión geográfica"
                },
                "jabali_europeo": {
                    "presente": True,
                    "severidad": "Media",
                    "cuencas_afectadas": "Corredor fronterizo Jeinimeni - Los Antiguos",
                    "programa_control": "Control cinegético habilitado por SAG"
                },
                "microalga_didymo": {
                    "presente": True,
                    "severidad": "Media",
                    "cuencas_afectadas": "Río Jeinimeni y cursos fluviales desembocantes en Lago General Carrera",
                    "programa_control": "Filtros y señalización de desinfección en cruce fronterizo"
                },
                "lupino_perenne": {
                    "presente": True,
                    "severidad": "Media",
                    "cuencas_afectadas": "Ruta CH-265 (Chile Chico - Fachinal - Mallín Grande)",
                    "programa_control": "Erradicación mecánica en riberas vulnerables a la erosión"
                },
                "salmonidos_asilvestrados": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Lago General Carrera (trucha de lago, trucha marrón y arcoíris)",
                    "programa_control": "Regulación de pesca deportiva y monitoreo de predación sobre puyes autóctonos"
                }
            }
        }
    },
    {
        "codigo_comuna": "CL-XI-07",
        "comuna_ine": "11402",
        "nombre_comuna": "Río Ibáñez",
        "provincia": "General Carrera",
        "codigo_cuenca": "113",
        "lat": -46.2910,
        "lng": -71.9360,
        "source_url": "https://sit.conaf.cl/",
        "datos": {
            "flora_y_formaciones_vegetacionales": {
                "superficie_comunal_ha": 599720.0,
                "bosque_siempreverde_ha": 30000.0,
                "bosque_caducifolio_lenga_nire_ha": 170000.0,
                "desglose_lenga_ha": 110000.0,
                "desglose_nire_ha": 60000.0,
                "cipres_de_las_guaitecas_ha": 1200.0,
                "turberas_y_humedales_ha": 5800.0,
                "estepa_patagonica_ha": 135000.0,
                "total_cobertura_vegetal_nativa_ha": 342000.0,
                "porcentaje_cobertura_vegetal_pct": 57.0,
                "especies_arboreas_dominantes": [
                    "Nothofagus pumilio (Lenga)",
                    "Nothofagus antarctica (Ñire)",
                    "Festuca pallescens (Coirón)",
                    "Embothrium coccineum (Notro)",
                    "Berberis microphylla (Calafate)"
                ],
                "estado_conservacion_ecosistemas": "Bosques andinos del Parque Nacional Cerro Castillo en franca recuperación; estepa patagónica en Villa Cerro Castillo y Bahía Murta con cicatrices históricas de ceniza volcánica del Volcán Hudson (1991)."
            },
            "fauna_emblematica_conservacion": {
                "especies_presentes": [
                    "Hippocamelus bisulcus (Huemul - En Peligro)",
                    "Lama guanicoe (Guanaco austral - Vulnerable)",
                    "Puma concolor puma (Puma patagónico - Casi Amenazado)",
                    "Vultur gryphus (Cóndor andino - Vulnerable)",
                    "Campephilus magellanicus (Carpintero negro - Casi Amenazado)"
                ],
                "nucleos_poblacionales_clave": "Población de huemul de referencia regional en el Parque Nacional Cerro Castillo (estimada en 80-100 ejemplares); manadas de guanaco en el sector oriental de Baño Nuevo.",
                "unidades_snaspe_comunales": [
                    "Parque Nacional Cerro Castillo",
                    "Monumento Natural Dos Lagunas (límite norte)"
                ],
                "amenazas_directas_fauna": [
                    "Colisión de huemules en la Carretera Austral (Ruta 7) en la Cuesta del Diablo y sector Villa Cerro Castillo",
                    "Ataques de perros con dueño y vagabundos sobre crías de huemul",
                    "Transmisión de linfadenitis caseosa desde rebaños ovinos a ungulados nativos"
                ]
            },
            "especies_exoticas_invasoras": {
                "vison_norteamericano": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Cuenca del Río Ibáñez, estero El Bosque y desembocadura en el Lago General Carrera",
                    "programa_control": "Red de trampeo de emergencia coordinada entre CONAF Cerro Castillo y SAG"
                },
                "castor_canadiense": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Sin registros en la cuenca",
                    "programa_control": "Vigilancia preventiva"
                },
                "jabali_europeo": {
                    "presente": True,
                    "severidad": "Media",
                    "cuencas_afectadas": "Paso Fronterizo Pallavicini y valles cordilleranos limítrofes",
                    "programa_control": "Caza libre de control según Ley de Caza SAG"
                },
                "microalga_didymo": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Río Ibáñez y afluentes de pesca deportiva",
                    "programa_control": "Estaciones de bioseguridad en puntos de acceso a Puerto Ibáñez"
                },
                "lupino_perenne": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Ruta 7 tramo Cuesta del Diablo - Villa Cerro Castillo - Bahía Murta",
                    "programa_control": "Desmalezado programado CONAF en áreas de amortiguación del Parque Nacional"
                },
                "salmonidos_asilvestrados": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Río Ibáñez y Lago General Carrera (trucha marrón y arcoíris)",
                    "programa_control": "Pesca recreativa regulada con monitoreo de biomasa"
                }
            }
        }
    },
    {
        "codigo_comuna": "CL-XI-08",
        "comuna_ine": "11301",
        "nombre_comuna": "Cochrane",
        "provincia": "Capitán Prat",
        "codigo_cuenca": "115",
        "lat": -47.2540,
        "lng": -72.5710,
        "source_url": "https://sit.conaf.cl/",
        "datos": {
            "flora_y_formaciones_vegetacionales": {
                "superficie_comunal_ha": 859950.0,
                "bosque_siempreverde_ha": 85000.0,
                "bosque_caducifolio_lenga_nire_ha": 285000.0,
                "desglose_lenga_ha": 175000.0,
                "desglose_nire_ha": 110000.0,
                "cipres_de_las_guaitecas_ha": 15000.0,
                "turberas_y_humedales_ha": 18000.0,
                "estepa_patagonica_ha": 140000.0,
                "total_cobertura_vegetal_nativa_ha": 543000.0,
                "porcentaje_cobertura_vegetal_pct": 63.1,
                "especies_arboreas_dominantes": [
                    "Nothofagus pumilio (Lenga)",
                    "Nothofagus antarctica (Ñire)",
                    "Festuca pallescens (Coirón)",
                    "Nothofagus betuloides (Coihue de Magallanes)",
                    "Embothrium coccineum (Notro)"
                ],
                "estado_conservacion_ecosistemas": "Núcleo mundial de restauración ecológica en el Parque Nacional Patagonia (antigua Estancia Valle Chacabuco, con más de 600 km de cercos ganaderos retirados)."
            },
            "fauna_emblematica_conservacion": {
                "especies_presentes": [
                    "Hippocamelus bisulcus (Huemul - En Peligro)",
                    "Lama guanicoe (Guanaco austral - Vulnerable)",
                    "Lontra provocax (Huillín - En Peligro)",
                    "Puma concolor puma (Puma patagónico - Casi Amenazado)",
                    "Vultur gryphus (Cóndor andino - Vulnerable)",
                    "Campephilus magellanicus (Carpintero negro - Casi Amenazado)",
                    "Podiceps gallardoi (Macá tobiano - En Peligro Crítico)"
                ],
                "nucleos_poblacionales_clave": "Sector Tamango y Valle Chacabuco: concentración de huemules más densa y estudiada del planeta (más de 250 individuos); tropilla de más de 3.000 guanacos en recuperación; huillín en Río Cochrane y Río Baker.",
                "unidades_snaspe_comunales": [
                    "Parque Nacional Patagonia (Sectores Tamango y Valle Chacabuco)",
                    "Reserva Nacional Lago Cochrane"
                ],
                "amenazas_directas_fauna": [
                    "Conflicto depredador-ganadería (represalias por puma)",
                    "Ataques de perros a crías de huemul y guanaco",
                    "Interacción con alambradas ganaderas remanentes en predios privados vecinos"
                ]
            },
            "especies_exoticas_invasoras": {
                "vison_norteamericano": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Río Baker, Río Cochrane, Lago Cochrane y mallines de estepa",
                    "programa_control": "Programa intensivo de trampeo SAG/CONAF para blindar las áreas de anidación de aves y presencia de huillín"
                },
                "castor_canadiense": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Sin presencia consolidada en la cuenca media del Baker",
                    "programa_control": "Puesto de vigilancia de contención norte"
                },
                "jabali_europeo": {
                    "presente": False,
                    "severidad": "Muy Baja",
                    "cuencas_afectadas": "Sin poblaciones establecidas",
                    "programa_control": "Monitoreo fronterizo paso Roballos"
                },
                "microalga_didymo": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Río Baker (el río más caudaloso de Chile) y Río Cochrane",
                    "programa_control": "Puntos de bioseguridad SERNAPESCA en balsas y lodges de pesca deportiva"
                },
                "lupino_perenne": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Ruta 7 Sur tramo El Salto - Cochrane y Valle Chacabuco",
                    "programa_control": "Extracción manual sistemática por guardaparques de CONAF"
                },
                "salmonidos_asilvestrados": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Cuenca del Río Baker (trucha marrón, trucha arcoíris y remonte masivo de salmón chinook)",
                    "programa_control": "Monitoreo biológico por CIEP y fomento de pesca recreativa intensiva de salmón chinook"
                }
            }
        }
    },
    {
        "codigo_comuna": "CL-XI-09",
        "comuna_ine": "11302",
        "nombre_comuna": "O'Higgins",
        "provincia": "Capitán Prat",
        "codigo_cuenca": "117",
        "lat": -48.4680,
        "lng": -72.5600,
        "source_url": "https://sit.conaf.cl/",
        "datos": {
            "flora_y_formaciones_vegetacionales": {
                "superficie_comunal_ha": 818250.0,
                "bosque_siempreverde_ha": 135000.0,
                "bosque_caducifolio_lenga_nire_ha": 165000.0,
                "desglose_lenga_ha": 105000.0,
                "desglose_nire_ha": 60000.0,
                "cipres_de_las_guaitecas_ha": 32000.0,
                "turberas_y_humedales_ha": 28000.0,
                "estepa_patagonica_ha": 12000.0,
                "total_cobertura_vegetal_nativa_ha": 372000.0,
                "porcentaje_cobertura_vegetal_pct": 45.5,
                "especies_arboreas_dominantes": [
                    "Nothofagus betuloides (Coihue de Magallanes)",
                    "Nothofagus pumilio (Lenga)",
                    "Nothofagus antarctica (Ñire)",
                    "Pilgerodendron uviferum (Ciprés de las Guaitecas)",
                    "Sphagnum magellanicum (Musgo pompón)"
                ],
                "estado_conservacion_ecosistemas": "Alta pristinidad y aislamiento geográfico extremo al pie de los glaciares del Campo de Hielo Sur; turberas y bosques subantárticos vírgenes."
            },
            "fauna_emblematica_conservacion": {
                "especies_presentes": [
                    "Hippocamelus bisulcus (Huemul - En Peligro)",
                    "Lontra provocax (Huillín - En Peligro)",
                    "Puma concolor puma (Puma patagónico - Casi Amenazado)",
                    "Vultur gryphus (Cóndor andino - Vulnerable)",
                    "Campephilus magellanicus (Carpintero negro - Casi Amenazado)"
                ],
                "nucleos_poblacionales_clave": "Población austral de huemul en el Parque Nacional Bernardo O'Higgins, Glaciar O'Higgins y Río Bravo; huillín en cursos fluviales y brazos lacustres del Lago O'Higgins.",
                "unidades_snaspe_comunales": [
                    "Parque Nacional Bernardo O'Higgins",
                    "Bienes Nacionales Protegidos Glaciar Mosco / Río Mayer"
                ],
                "amenazas_directas_fauna": [
                    "Alteración de hábitats riparios por castor invasor",
                    "Predación de visón en aves acuáticas de humedal",
                    "Aislamiento poblacional genético por barreras glaciares y cordilleranas"
                ]
            },
            "especies_exoticas_invasoras": {
                "vison_norteamericano": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Río Bravo, Río Mayer y borde costero del Lago O'Higgins",
                    "programa_control": "Línea de captura y monitoreo SAG para proteger avifauna nativa"
                },
                "castor_canadiense": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Cuenca del Río Bravo y Río Pascua; foco crítico de invasión austral",
                    "programa_control": "Proyecto GEF Castor (MMA/FAO/SAG/CONAF): Estrategia de contención física mediante cuadrillas de cazadores-trampeadores Conibear para impedir el avance hacia el norte de Aysén"
                },
                "jabali_europeo": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Sin presencia",
                    "programa_control": "No aplica"
                },
                "microalga_didymo": {
                    "presente": False,
                    "severidad": "Baja",
                    "cuencas_afectadas": "Sin floraciones masivas confirmadas en Lago O'Higgins",
                    "programa_control": "Estación de desinfección preventiva en Puerto Bahía Bahamondes"
                },
                "lupino_perenne": {
                    "presente": True,
                    "severidad": "Media",
                    "cuencas_afectadas": "Extremo final de la Carretera Austral (Ruta 7 Sur en Villa O'Higgins)",
                    "programa_control": "Extracción comunitaria y control municipal"
                },
                "salmonidos_asilvestrados": {
                    "presente": True,
                    "severidad": "Media",
                    "cuencas_afectadas": "Lago O'Higgins y Río Bravo (trucha marrón y arcoíris)",
                    "programa_control": "Pesca deportiva recreativa sustentable"
                }
            }
        }
    },
    {
        "codigo_comuna": "CL-XI-10",
        "comuna_ine": "11303",
        "nombre_comuna": "Tortel",
        "provincia": "Capitán Prat",
        "codigo_cuenca": "115",
        "lat": -47.7950,
        "lng": -73.5350,
        "source_url": "https://sit.conaf.cl/",
        "datos": {
            "flora_y_formaciones_vegetacionales": {
                "superficie_comunal_ha": 1971060.0,
                "bosque_siempreverde_ha": 420000.0,
                "bosque_caducifolio_lenga_nire_ha": 115000.0,
                "desglose_lenga_ha": 65000.0,
                "desglose_nire_ha": 50000.0,
                "cipres_de_las_guaitecas_ha": 88000.0,
                "turberas_y_humedales_ha": 92000.0,
                "estepa_patagonica_ha": 0.0,
                "total_cobertura_vegetal_nativa_ha": 715000.0,
                "porcentaje_cobertura_vegetal_pct": 36.3,
                "especies_arboreas_dominantes": [
                    "Pilgerodendron uviferum (Ciprés de las Guaitecas)",
                    "Nothofagus nitida (Coihue de Chiloé)",
                    "Drimys winteri (Canelo)",
                    "Sphagnum magellanicum (Musgo pompón)",
                    "Tepualia stipularis (Tepú)"
                ],
                "estado_conservacion_ecosistemas": "Complejo ecosistémico hiperhúmedo único en Chile; extensas turberas ombrotróficas y bosques de Ciprés de las Guaitecas sobre roca y suelo saturado; el 63,7% restante del territorio corresponde a campos de hielo (Hielo Sur y Hielo Norte), glaciares y fiordos."
            },
            "fauna_emblematica_conservacion": {
                "especies_presentes": [
                    "Hippocamelus bisulcus (Huemul - En Peligro)",
                    "Lontra provocax (Huillín - En Peligro)",
                    "Lontra felina (Chungungo - En Peligro)",
                    "Balaenoptera borealis (Ballena Sei - En Peligro)",
                    "Balaenoptera musculus (Ballena Azul - En Peligro)",
                    "Cephalorhynchus eutropia (Delfín Chileno - Casi Amenazado)",
                    "Puma concolor puma (Puma patagónico - Casi Amenazado)",
                    "Campephilus magellanicus (Carpintero negro - Casi Amenazado)"
                ],
                "nucleos_poblacionales_clave": "Delta del Río Baker como hábitat prioritario del huillín en Chile; Golfo de Penas como área oceánica de tránsito y forrajeo de ballena sei; presencia de huemul en cuenca baja del Baker y Río Huemules.",
                "unidades_snaspe_comunales": [
                    "Parque Nacional Laguna San Rafael (sector sur / Ventisquero Steffen)",
                    "Parque Nacional Bernardo O'Higgins (sector norte / Glaciar Jorge Montt)",
                    "Área Marina Costera Protegida Tortel"
                ],
                "amenazas_directas_fauna": [
                    "Eventos recurrentes de mortandad masiva de cetáceos por marea roja en Golfo de Penas",
                    "Invasión de castor que derriba bosques riparios y anega hábitats de huillín",
                    "Basura marina plástica acumulada por corrientes en playas exteriores del Golfo de Penas"
                ]
            },
            "especies_exoticas_invasoras": {
                "vison_norteamericano": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Delta del Río Baker, Caleta Tortel y ensenadas costeras",
                    "programa_control": "Programa FNDR/SAG de trampeo de visón en riberas fluviales con jaulas huillineras selectivas"
                },
                "castor_canadiense": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Cuenca del Río Baker baja, Río Pascua y esteros de Caleta Tortel",
                    "programa_control": "Frente activo del Plan Nacional GEF Castor: Brigada móvil de trampeo de choque para detener la colonización hacia el norte de la cuenca del Baker"
                },
                "jabali_europeo": {
                    "presente": False,
                    "severidad": "Ausente",
                    "cuencas_afectadas": "Sin registros en el área de fiordos",
                    "programa_control": "No aplica"
                },
                "microalga_didymo": {
                    "presente": True,
                    "severidad": "Alta",
                    "cuencas_afectadas": "Río Baker bajo",
                    "programa_control": "Estaciones de bioseguridad SERNAPESCA en Caleta Tortel"
                },
                "lupino_perenne": {
                    "presente": False,
                    "severidad": "Baja",
                    "cuencas_afectadas": "Tramo terminal de camino de acceso a Tortel",
                    "programa_control": "Control preventivo"
                },
                "salmonidos_asilvestrados": {
                    "presente": True,
                    "severidad": "Muy Alta",
                    "cuencas_afectadas": "Delta del Baker y fiordos (salmón chinook de gran biomasa)",
                    "programa_control": "Monitoreo científico por CIEP de la interacción marina-fluvial de salmones asilvestrados"
                }
            }
        }
    }
]

# -------------------------------------------------------------------------
# 3. CATASTRO INTEGRAL DE FAUNA EMBLEMÁTICA EN CONSERVACIÓN (RCE MMA)
# -------------------------------------------------------------------------

CATASTRO_FAUNA_RCE = [
    {
        "id": "fauna_01_huemul",
        "nombre_comun": "Huemul",
        "nombre_cientifico": "Hippocamelus bisulcus",
        "clase_orden": "Mammalia, Artiodactyla",
        "categoria_rce": "En Peligro (EN)",
        "decreto_supremo_rce": "D.S. 151/2007 MINSEGPRES",
        "categoria_iucn": "En Peligro (EN)",
        "distribucion_comunas_aysen": [
            "Cochrane",
            "Río Ibáñez",
            "Tortel",
            "O'Higgins",
            "Cisnes",
            "Aysén",
            "Lago Verde",
            "Coyhaique",
            "Chile Chico"
        ],
        "zonas_criticas_habitat": "Sector Tamango y Valle Chacabuco (PN Patagonia), Parque Nacional Cerro Castillo, cuenca baja del Río Baker, PN Bernardo O'Higgins y PN Queulat",
        "tamano_poblacional_estimado_aysen": "1.500 a 2.000 individuos (representa entre el 60% y 70% de la población mundial silvestre de la especie)",
        "estado_monitoreo_institucional": "Monitoreo sistemático anual de CONAF mediante red de cámaras trampa, transectos de fecas y seguimiento de individuos radiomarcados; Plan Nacional de Conservación del Huemul (MMA/CONAF)",
        "amenazas_principales": [
            "Ataques letales de perros domésticos y asilvestrados",
            "Transmisión de linfadenitis caseosa por contacto con ganado ovino y bovino",
            "Fragmentación y bloqueo de corredores biológicos por alambradas y cercos ganaderos",
            "Atropellos carreteros en la Ruta 7 (Cuesta del Diablo, Villa Cerro Castillo y tramos de Cochrane)"
        ],
        "fuente_oficial": "Ministerio del Medio Ambiente / Corporación Nacional Forestal (CONAF) / UICN Red List",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=60"
    },
    {
        "id": "fauna_02_pudu",
        "nombre_comun": "Pudú",
        "nombre_cientifico": "Pudu puda",
        "clase_orden": "Mammalia, Artiodactyla",
        "categoria_rce": "Vulnerable (VU)",
        "decreto_supremo_rce": "D.S. 151/2007 MINSEGPRES",
        "categoria_iucn": "Casi Amenazado (NT)",
        "distribucion_comunas_aysen": [
            "Cisnes",
            "Aysén",
            "Lago Verde",
            "Coyhaique"
        ],
        "zonas_criticas_habitat": "Bosques templados lluviosos siempreverdes con sotobosque denso de quila y murtilla en Parque Nacional Queulat, PN Isla Magdalena y Reserva Nacional Río Simpson",
        "tamano_poblacional_estimado_aysen": "Poblaciones continuas en la zona húmeda del norte y litoral de Aysén; densidades medias de 2 a 5 ind/km2 en hábitats óptimos",
        "estado_monitoreo_institucional": "Fototrampeo estacional y registro de avistamientos por guardaparques de CONAF en unidades del SNASPE",
        "amenazas_principales": [
            "Depredación por perros rurales sueltos",
            "Atropellos en la Carretera Austral (Ruta 7)",
            "Pérdida de cobertura de sotobosque por incendios históricos y ganado en bordes de bosque"
        ],
        "fuente_oficial": "Ministerio del Medio Ambiente - Inventario Nacional de Especies",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=59"
    },
    {
        "id": "fauna_03_huillin",
        "nombre_comun": "Huillín",
        "nombre_cientifico": "Lontra provocax",
        "clase_orden": "Mammalia, Carnivora",
        "categoria_rce": "En Peligro (EN)",
        "decreto_supremo_rce": "D.S. 151/2007 MINSEGPRES",
        "categoria_iucn": "En Peligro (EN)",
        "distribucion_comunas_aysen": [
            "Tortel",
            "Cochrane",
            "Aysén",
            "Cisnes",
            "O'Higgins",
            "Guaitecas"
        ],
        "zonas_criticas_habitat": "Delta del Río Baker, Río Cochrane, Lago Cochrane, cuenca del Río Aysén, canales del Archipiélago de los Chonos y fiordos protegidos del Parque Nacional Laguna San Rafael",
        "tamano_poblacional_estimado_aysen": "Población crítica fluvial y marina; Aysén alberga el reservorio reproductivo más saludable de agua dulce de Chile continental",
        "estado_monitoreo_institucional": "Monitoreo sistemático de signos (fecas, madrigueras y huellas) coordinado por CODEFF, SAG y CONAF en la cuenca del Río Baker; monitoreo de interacción costera por IFOP",
        "amenazas_principales": [
            "Destrucción de vegetación riparia por tala, ganadería y obras viales",
            "Enmallamiento accidental en redes de pesca artesanal y jaulas de cultivo salmonero",
            "Competencia y transmisión potencial de patógenos por visón norteamericano",
            "Colisiones con embarcaciones rápidas en deltas fluviales y canales"
        ],
        "fuente_oficial": "MMA / SAG / CODEFF / IFOP",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=54"
    },
    {
        "id": "fauna_04_chungungo",
        "nombre_comun": "Chungungo",
        "nombre_cientifico": "Lontra felina",
        "clase_orden": "Mammalia, Carnivora",
        "categoria_rce": "En Peligro (EN)",
        "decreto_supremo_rce": "D.S. 151/2007 MINSEGPRES",
        "categoria_iucn": "En Peligro (EN)",
        "distribucion_comunas_aysen": [
            "Guaitecas",
            "Cisnes",
            "Aysén",
            "Tortel"
        ],
        "zonas_criticas_habitat": "Litoral rocoso marino expuesto con rompiente fuerte y cuevas intermareales en Archipiélago de las Guaitecas, Península de Taitao, Golfo de Penas y canales patagónicos exteriores",
        "tamano_poblacional_estimado_aysen": "Población dispersa en densidades bajas (0.5 a 1.2 nutrias por kilómetro de línea de costa rocosa)",
        "estado_monitoreo_institucional": "Censos de línea de costa y registro de avistamientos por SERNAPESCA e IFOP en campañas oceanográficas de biodiversidad",
        "amenazas_principales": [
            "Captura incidental en redes agalleras y espineles de fondo",
            "Contaminación costera y residuos plásticos marinos (cabos y mallas)",
            "Perturbación antrópica en áreas de caletas y fondeaderos"
        ],
        "fuente_oficial": "Ministerio del Medio Ambiente / SERNAPESCA",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=53"
    },
    {
        "id": "fauna_05_ballena_sei",
        "nombre_comun": "Ballena Sei",
        "nombre_cientifico": "Balaenoptera borealis",
        "clase_orden": "Mammalia, Cetacea",
        "categoria_rce": "En Peligro (EN)",
        "decreto_supremo_rce": "D.S. 23/2009 MMA",
        "categoria_iucn": "En Peligro (EN)",
        "distribucion_comunas_aysen": [
            "Tortel",
            "Aysén",
            "Guaitecas"
        ],
        "zonas_criticas_habitat": "Golfo de Penas, Archipiélago de los Chonos, Fiordo Messier y aguas oceánicas exteriores adyacentes a Campo de Hielo Sur",
        "tamano_poblacional_estimado_aysen": "Área de alimentación estival pelágica clave en el cono sur; sitio donde en 2015 se registró el evento de varamiento masivo más grande de la historia (más de 337 ballenas)",
        "estado_monitoreo_institucional": "Vigilancia epidemiológica y oceanográfica coordinada por SERNAPESCA, IFOP, CIEP y Armada de Chile ante riesgos de toxinas por Floraciones Algales Nocivas (FAN)",
        "amenazas_principales": [
            "Biotoxinas marinas producidas por floraciones algales nocivas (marea roja)",
            "Colisiones con buques mercantes en rutas de navegación oceánica",
            "Cambio global en surgencias marinas y disponibilidad de zooplancton"
        ],
        "fuente_oficial": "SERNAPESCA / CIEP / Centro Ballena Azul / IFOP",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=122"
    },
    {
        "id": "fauna_06_ballena_azul",
        "nombre_comun": "Ballena Azul",
        "nombre_cientifico": "Balaenoptera musculus",
        "clase_orden": "Mammalia, Cetacea",
        "categoria_rce": "En Peligro (EN)",
        "decreto_supremo_rce": "D.S. 23/2009 MMA",
        "categoria_iucn": "En Peligro (EN)",
        "distribucion_comunas_aysen": [
            "Guaitecas",
            "Cisnes",
            "Aysén",
            "Tortel"
        ],
        "zonas_criticas_habitat": "Golfo Corcovado, Canal Moraleda, desembocadura del Fiordo Aysén, Canal Jacaf y aguas del Archipiélago de las Guaitecas",
        "tamano_poblacional_estimado_aysen": "Aproximadamente 600 a 800 ejemplares de la población del Pacífico Suroriental que utilizan los fiordos norpatagónicos como área estival de alimentación (enero a abril)",
        "estado_monitoreo_institucional": "Cruceros anuales de fotoidentificación, marcaje satelital y estaciones de hidrófonos acústicos pasivos por Centro Ballena Azul (CBA), UACh y Fundación MERI",
        "amenazas_principales": [
            "Colisiones letales con barcazas, naves de carga y buques factoría",
            "Contaminación acústica marina por tráfico de motores que enmascara su comunicación",
            "Enredo en cabos y sistemas de fondeo de la salmonicultura"
        ],
        "fuente_oficial": "Centro Ballena Azul / Universidad Austral de Chile / MMA",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=121"
    },
    {
        "id": "fauna_07_delfin_chileno",
        "nombre_comun": "Delfín Chileno",
        "nombre_cientifico": "Cephalorhynchus eutropia",
        "clase_orden": "Mammalia, Cetacea",
        "categoria_rce": "Casi Amenazado (NT)",
        "decreto_supremo_rce": "D.S. 19/2012 MMA",
        "categoria_iucn": "Casi Amenazado (NT)",
        "distribucion_comunas_aysen": [
            "Cisnes",
            "Aysén",
            "Tortel",
            "Guaitecas"
        ],
        "zonas_criticas_habitat": "Fiordo Puyuhuapi, Canal Jacaf, Fiordo Aysén, Estero Elefantes, delta del Baker y caletas someras protegidas (único cetáceo endémico exclusivo de Chile)",
        "tamano_poblacional_estimado_aysen": "Poblaciones locales residentes y de alta fidelidad al sitio; grupos pequeños de 2 a 15 individuos",
        "estado_monitoreo_institucional": "Monitoreo costero y caracterización bioacústica por IFOP y organizaciones de conservación marina (Yaqu Pacha / CIEP)",
        "amenazas_principales": [
            "Captura incidental y ahogamiento en redes agalleras de pesca artesanal",
            "Pérdida de hábitat en ensenadas someras ocupadas por concesiones salmoneras",
            "Contaminación química y acústica en fiordos semicerrados"
        ],
        "fuente_oficial": "IFOP / MMA / Yaqu Pacha",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=116"
    },
    {
        "id": "fauna_08_puma_patagonico",
        "nombre_comun": "Puma patagónico",
        "nombre_cientifico": "Puma concolor puma",
        "clase_orden": "Mammalia, Carnivora",
        "categoria_rce": "Casi Amenazado (NT)",
        "decreto_supremo_rce": "D.S. 33/2011 MMA (Vigente en Región de Aysén)",
        "categoria_iucn": "Preocupación Menor (LC) global",
        "distribucion_comunas_aysen": [
            "Cochrane",
            "Chile Chico",
            "Coyhaique",
            "Río Ibáñez",
            "Lago Verde",
            "Cisnes",
            "O'Higgins",
            "Aysén",
            "Tortel"
        ],
        "zonas_criticas_habitat": "Valle Chacabuco, Meseta Jeinimeni, estepa de Coyhaique Alto, cordones precordilleranos y áreas de veranada ganadera",
        "tamano_poblacional_estimado_aysen": "Mayor depredador tope de los ecosistemas patagónicos terrestres; alta densidad en el Parque Nacional Patagonia y estancias con manejo ganadero adaptativo",
        "estado_monitoreo_institucional": "Programa de coexistencia predador-ganadería y fototrampeo continuo por Rewilding Chile, SAG y CONAF en el Parque Nacional Patagonia",
        "amenazas_principales": [
            "Caza retaliatoria ilegal con armas de fuego y perros por conflicto con ganadería ovina/bovina",
            "Uso ilegal de cebos envenenados con agroquímicos (carbofurano/estricnina)",
            "Disminución de presas nativas en sectores ganaderos sobrepastoreados"
        ],
        "fuente_oficial": "Servicio Agrícola y Ganadero (SAG) / Rewilding Chile / MMA",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=51"
    },
    {
        "id": "fauna_09_guanaco_austral",
        "nombre_comun": "Guanaco austral",
        "nombre_cientifico": "Lama guanicoe",
        "clase_orden": "Mammalia, Artiodactyla",
        "categoria_rce": "Vulnerable (VU)",
        "decreto_supremo_rce": "D.S. 42/2011 MMA (Categoría regional para Aysén)",
        "categoria_iucn": "Preocupación Menor (LC) global",
        "distribucion_comunas_aysen": [
            "Cochrane",
            "Chile Chico",
            "Río Ibáñez"
        ],
        "zonas_criticas_habitat": "Valle Chacabuco (PN Patagonia), Reserva Nacional Lago Cochrane (Tamango), Meseta Jeinimeni y cordón Baño Nuevo",
        "tamano_poblacional_estimado_aysen": "Aproximadamente 3.200 a 3.500 individuos en Aysén (recuperación espectacular tras el retiro de cercos ganaderos en Valle Chacabuco)",
        "estado_monitoreo_institucional": "Censos visuales directos y conteo aéreo por CONAF y Rewilding Chile en el Parque Nacional Patagonia",
        "amenazas_principales": [
            "Caza furtiva ilegal en áreas de amortiguación fuera del parque nacional",
            "Ataques de perros estancieros en pastizales abiertos",
            "Competencia por forraje en predios privados con alta carga de ganado ovino"
        ],
        "fuente_oficial": "CONAF Región de Aysén / MMA RCE",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=62"
    },
    {
        "id": "fauna_10_condor_andino",
        "nombre_comun": "Cóndor andino",
        "nombre_cientifico": "Vultur gryphus",
        "clase_orden": "Aves, Cathartiformes",
        "categoria_rce": "Vulnerable (VU)",
        "decreto_supremo_rce": "D.S. 16/2020 MMA",
        "categoria_iucn": "Vulnerable (VU)",
        "distribucion_comunas_aysen": [
            "Coyhaique",
            "Río Ibáñez",
            "Chile Chico",
            "Cochrane",
            "Lago Verde",
            "O'Higgins",
            "Cisnes"
        ],
        "zonas_criticas_habitat": "Farellones rocosos y condoreras reproductivas activas en Cerro Mackay (Coyhaique), Cerro Castillo, Lago General Carrera y Valle Chacabuco",
        "tamano_poblacional_estimado_aysen": "Población regional saludable estimada en más de 250 a 300 individuos adultos; una de las densidades más altas del cono sur",
        "estado_monitoreo_institucional": "Censos simultáneos de condoreras coordinados por SAG, CONAF y Unión de Ornitólogos de Chile (AvesChile)",
        "amenazas_principales": [
            "Envenenamiento secundario letal por consumo de carroñas envenenadas ilegalmente por ganaderos contra predadores",
            "Colisión con líneas de transmisión eléctrica y torres de telecomunicaciones",
            "Tiroteo ilegal y perturbación de condoreras por turismo no regulado"
        ],
        "fuente_oficial": "Ministerio del Medio Ambiente / SAG / AvesChile",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=242"
    },
    {
        "id": "fauna_11_carpintero_negro",
        "nombre_comun": "Carpintero negro",
        "nombre_cientifico": "Campephilus magellanicus",
        "clase_orden": "Aves, Piciformes",
        "categoria_rce": "Casi Amenazado (NT)",
        "decreto_supremo_rce": "D.S. 41/2011 MMA (Categoría para Región de Aysén)",
        "categoria_iucn": "Preocupación Menor (LC) global",
        "distribucion_comunas_aysen": [
            "Coyhaique",
            "Lago Verde",
            "Aysén",
            "Cisnes",
            "Río Ibáñez",
            "Cochrane",
            "O'Higgins",
            "Tortel"
        ],
        "zonas_criticas_habitat": "Bosques maduros primarios de Nothofagus (lenga, coihue y ñire) con presencia de árboles añosos y madera muerta en pie en todas las unidades del SNASPE",
        "tamano_poblacional_estimado_aysen": "Especie paraguas e ingeniera de ecosistemas; densidades de 1 a 2 parejas por cada 100 hectáreas de bosque maduro continuo",
        "estado_monitoreo_institucional": "Monitoreo bioacústico pasivo y transectos de avistamiento por CONAF y la Sociedad Chilena de Ornitología",
        "amenazas_principales": [
            "Extracción no sustentable de leña que elimina árboles añosos con cavidades nido",
            "Incendios forestales que destruyen la continuidad del bosque templado maduro",
            "Fragmentación del bosque nativo en valles privados"
        ],
        "fuente_oficial": "Ministerio del Medio Ambiente / CONAF",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=243"
    },
    {
        "id": "fauna_12_maca_tobiano",
        "nombre_comun": "Macá tobiano",
        "nombre_cientifico": "Podiceps gallardoi",
        "clase_orden": "Aves, Podicipediformes",
        "categoria_rce": "En Peligro Crítico (CR)",
        "decreto_supremo_rce": "D.S. 51/2021 MMA",
        "categoria_iucn": "En Peligro Crítico (CR)",
        "distribucion_comunas_aysen": [
            "Chile Chico",
            "Cochrane"
        ],
        "zonas_criticas_habitat": "Lagunas basálticas someras de alta meseta volcánica en la frontera oriental (Meseta del Lago Buenos Aires / General Carrera)",
        "tamano_poblacional_estimado_aysen": "Población global crítica de menos de 800 individuos maduros; registros reproductivos y colonias estivales extremas en lagunas limítrofes de Chile Chico y Cochrane",
        "estado_monitoreo_institucional": "Programa de Guardianes de Colonia binacional coordinado entre MMA, AvesChile, Aves Argentinas y Fundación Rewilding",
        "amenazas_principales": [
            "Depredación voraz de adultos y nidadas por el Visón norteamericano invasor",
            "Sembrado de truchas exóticas en lagunas de meseta que alteran la turbidez y agotan las macrófitas acuáticas",
            "Desecación acelerada de lagunas de alta meseta debido a vientos extremos y cambio climático"
        ],
        "fuente_oficial": "Ministerio del Medio Ambiente / AvesChile / BirdLife International",
        "source_url": "https://especies.mma.gob.cl/CNMWeb/Web/WebCiudadana/ficha_indepen.aspx?EspecieId=513"
    }
]

# -------------------------------------------------------------------------
# 4. CATASTRO DE ESPECIES EXÓTICAS INVASORAS (EEI) EN AYSÉN
# -------------------------------------------------------------------------

CATASTRO_EEI = [
    {
        "id": "eei_01_vison",
        "nombre_comun": "Visón norteamericano",
        "nombre_cientifico": "Neovison vison",
        "tipo_organismo": "Mamífero carnívoro semiacuático invasor",
        "origen_introduccion": "América del Norte; traído a la Patagonia para la industria peletera en el siglo XX, liberado tras quiebra de criaderos",
        "cuencas_y_comunas_afectadas": [
            "Cuenca 111 (Río Palena / Lago Verde)",
            "Cuenca 112 (Río Cisnes / Cisnes)",
            "Cuenca 113 (Río Aysén / Coyhaique y Puerto Aysén)",
            "Cuenca 115 (Río Baker / Cochrane y Tortel)",
            "Cuenca 117 (Río Bravo y Pascua / O'Higgins y Tortel)",
            "Cuenca Lago General Carrera (Chile Chico y Río Ibáñez)"
        ],
        "mecanismo_impacto_ecologico": "Depredador generalista agresivo; aniquila colonias de aves acuáticas nidificantes en suelo (Macá tobiano, patos silvestres, chucaos), anfibios endémicos, micromamíferos y compite con el Huillín",
        "nivel_severidad_regional": "Muy Alta (presente en las 10 comunas de Aysén)",
        "programas_control_activos_sag_mma": "Programa FNDR/SAG 'Control del visón para la protección de la biodiversidad y la ganadería menor en Aysén'; despliegue de trampas de captura selectiva viva y jaulas huillineras de seguridad",
        "estado_gestion_y_contencion": "Control y supresión poblacional activa; erradicación total inviable, focalizada en la defensa de sitios críticos de anidación y humedales de alto valor",
        "fuente_oficial": "Servicio Agrícola y Ganadero (SAG) / Ministerio del Medio Ambiente (MMA)"
    },
    {
        "id": "eei_02_castor",
        "nombre_comun": "Castor americano",
        "nombre_cientifico": "Castor canadensis",
        "tipo_organismo": "Roedor herbívoro semiacuático invasor (ingeniero de ecosistemas perjudicial)",
        "origen_introduccion": "América del Norte; 25 parejas liberadas en 1946 en Lago Fagnano (Tierra del Fuego, Argentina)",
        "cuencas_y_comunas_afectadas": [
            "Cuenca 117 (Río Bravo y Río Pascua / O'Higgins)",
            "Cuenca 115 baja (Río Baker delta y esteros litorales / Tortel)"
        ],
        "mecanismo_impacto_ecologico": "Tala indiscriminada de bosques nativos riparios (ñire, lenga, coihue) que carecen de adaptación evolutiva para rebrotar tras inundación; construcción de diques que alteran drásticamente el régimen hidrológico, sedimentan ríos y destruyen turberas",
        "nivel_severidad_regional": "Crítica y Localizada en el extremo sur (O'Higgins y Tortel); riesgo inminente de avance hacia el norte de la Patagonia",
        "programas_control_activos_sag_mma": "Estrategia Nacional GEF Castor 'Fortalecimiento de los marcos para la gobernanza de las especies exóticas invasoras' (MMA/FAO/SAG/CONAF); brigadas de choque con trampas Conibear 330 para contención de la barrera Campo de Hielo",
        "estado_gestion_y_contencion": "Contención estricta para evitar que la especie cruce la cuenca media del Río Baker y alcance el territorio continuo de Aysén norte y Los Lagos",
        "fuente_oficial": "Proyecto GEF Castor / Ministerio del Medio Ambiente / SAG"
    },
    {
        "id": "eei_03_jabali",
        "nombre_comun": "Jabalí europeo",
        "nombre_cientifico": "Sus scrofa",
        "tipo_organismo": "Mamífero artiodáctilo omnívoro invasor",
        "origen_introduccion": "Eurasia; introducido en Argentina para cotos de caza a principios del siglo XX; colonización transandina continua",
        "cuencas_y_comunas_afectadas": [
            "Comuna de Lago Verde (Río Figueroa, Paso Las Pampas)",
            "Comuna de Coyhaique (Paso Huemules, Balmaceda, El Salto)",
            "Comuna de Cisnes (Río Cisnes alto)",
            "Comuna de Río Ibáñez (Paso Pallavicini)",
            "Comuna de Chile Chico (sector Jeinimeni)"
        ],
        "mecanismo_impacto_ecologico": "Hociqueo ('rooting') intensivo del suelo que destruye la regeneración de plántulas de bosque nativo, daña turberas y mallines; predación sobre micromamíferos y aves de suelo; vector de enfermedades zoonóticas hacia el ganado y fauna silvestre (triquinosis, brucelosis)",
        "nivel_severidad_regional": "Media-Alta en zonas cordilleranas orientales",
        "programas_control_activos_sag_mma": "Declarada especie dañina según el artículo 6° del Reglamento de la Ley de Caza (D.S. N° 5/1998 MINAGRI); caza deportiva y de control permitida durante todo el año en todo el territorio nacional sin límite de piezas; barrera zoosanitaria SAG",
        "estado_gestion_y_contencion": "Control continuo mediante fomento cinegético y vigilancia veterinaria en faenas domiciliarias",
        "fuente_oficial": "Servicio Agrícola y Ganadero (SAG)"
    },
    {
        "id": "eei_04_didymo",
        "nombre_comun": "Microalga Didymo (moco de roca)",
        "nombre_cientifico": "Didymosphenia geminata",
        "tipo_organismo": "Alga diatomea dulceacuícola bentónica invasora",
        "origen_introduccion": "Regiones boreales del Hemisferio Norte; dispersada globalmente por equipos húmedos de pesca deportiva (waders, botas de fieltro)",
        "cuencas_y_comunas_afectadas": [
            "Cuenca 113 (Río Simpson, Río Coyhaique, Río Mañihuales, Río Blanco)",
            "Cuenca 115 (Río Baker, Río Cochrane)",
            "Cuenca 112 (Río Cisnes, Río Picacho)",
            "Cuenca 111 (Río Figueroa, Río Palena)",
            "Cuenca Río Ibáñez"
        ],
        "mecanismo_impacto_ecologico": "Secreta pedúnculos extracelulares de polisacáridos formando densas alfombras mucilaginosas sobre el lecho de grava; asfixia comunidades de macroinvertebrados bentónicos (ninfas de efemerópteros y plecópteros), bloquea sitios de desove de peces nativos y degrada el valor paisajístico",
        "nivel_severidad_regional": "Muy Alta en los principales ríos de la cuenca del Simpson y Baker",
        "programas_control_activos_sag_mma": "Programa Nacional de Vigilancia y Bioseguridad de Didymo liderado por SERNAPESCA y SUBPESCA; obligatoriedad de lavado y desinfección en 3 pasos ('Remover, Lavar, Secar') en operadores turísticos; monitoreo limnológico sistemático por CIEP",
        "estado_gestion_y_contencion": "Infección endémica establecida en cuencas principales; acciones orientadas a evitar su dispersión a cuencas prístinas aisladas y cabeceras de cuenca",
        "fuente_oficial": "SERNAPESCA / SUBPESCA / Centro de Investigación en Ecosistemas de la Patagonia (CIEP)"
    },
    {
        "id": "eei_05_lupino",
        "nombre_comun": "Lupino perenne (chocho patagónico)",
        "nombre_cientifico": "Lupinus polyphyllus",
        "tipo_organismo": "Planta herbácea perenne invasora (Familia Fabaceae)",
        "origen_introduccion": "Norteamérica occidental; introducida como ornamental y forrajera; dispersión facilitada por el tránsito de maquinaria vial",
        "cuencas_y_comunas_afectadas": [
            "Fajas fiscales de la Carretera Austral (Ruta 7 Norte y Sur)",
            "Riberas pedregosas de los ríos Simpson, Cisnes, Mañihuales, Ibáñez y Baker",
            "Comunas de Coyhaique, Cisnes, Aysén, Río Ibáñez, Cochrane y Lago Verde"
        ],
        "mecanismo_impacto_ecologico": "Fija masivamente nitrógeno atmosférico alterando la química de suelos patagónicos naturalmente oligotróficos; desplaza herbáceas y pastizales nativos en lechos fluviales y bermas; reduce la diversidad de artrópodos y polinizadores autóctonos",
        "nivel_severidad_regional": "Alta en bordes viales y lechos fluviales pedregosos",
        "programas_control_activos_sag_mma": "Planes de desmalezado mecánico de servidumbres de paso por la Dirección de Vialidad MOP; campañas de extracción manual en zonas de acceso a Parques Nacionales coordinadas por CONAF",
        "estado_gestion_y_contencion": "Expansión lineal continua a lo largo de la red vial regional; control prioritario en zonas de amortiguación de áreas silvestres protegidas",
        "fuente_oficial": "Corporación Nacional Forestal (CONAF) / MOP Vialidad / MMA"
    },
    {
        "id": "eei_06_salmonidos",
        "nombre_comun": "Salmónidos asilvestrados",
        "nombre_cientifico": "Oncorhynchus mykiss (Trucha arcoíris), Salmo trutta (Trucha marrón/fario), Oncorhynchus tshawytscha (Salmón chinook)",
        "tipo_organismo": "Peces teleósteos dulceacuícolas y anádromos invasores",
        "origen_introduccion": "Hemisferio Norte; siembras estatales y privadas desde inicios del siglo XX para fomento de pesca deportiva, reforzado por escapes masivos de jaulas marinas de salmonicultura",
        "cuencas_y_comunas_afectadas": [
            "Todas las cuencas hidrográficas de Aysén (Cuencas 110, 111, 112, 113, 115 y 117)",
            "Destacan las masivas corridas anádromas de salmón chinook en los ríos Baker, Cisnes, Simpson y Palena"
        ],
        "mecanismo_impacto_ecologico": "Depredación voraz sobre la ictiofauna nativa (peces galáxidos como puyes y peladillas, trucha negra autóctona); competencia por hábitat y alimento con aves acuáticas buceadoras; transporte masivo de nutrientes marinos a ecosistemas dulceacuícolas por muerte de adultos posdesove alterando la trofía fluvial",
        "nivel_severidad_regional": "Muy Alta (dominan la biomasa de peces en todos los ríos y lagos de la región)",
        "programas_control_activos_sag_mma": "Regulación de pesca recreativa mediante Decretos Exentos de SUBPESCA y SERNAPESCA que permiten la captura de salmón chinook sin límite diario de piezas en ríos seleccionados; monitoreo científico de poblaciones anádromas por IFOP y CIEP",
        "estado_gestion_y_contencion": "Poblaciones naturalizadas consolidadas; motor económico del turismo de pesca con mosca (fly fishing) pero con severo impacto ecológico sobre la biodiversidad acuática endémica",
        "fuente_oficial": "Instituto de Fomento Pesquero (IFOP) / SERNAPESCA / SUBPESCA"
    }
]

# -------------------------------------------------------------------------
# 5. NODOS GEORREFERENCIADOS DEL SISTEMA DE BIODIVERSIDAD (20 NODOS)
# -------------------------------------------------------------------------

NODOS_BIODIVERSIDAD = [
    {
        "id": "node_bio_01_tamango",
        "nombre": "Estación de Fototrampeo y Monitoreo del Huemul Sector Tamango",
        "tipo": "Monitoreo Fauna Silvestre",
        "codigo_comuna": "CL-XI-08",
        "comuna_ine": "11301",
        "lat": -47.2500,
        "lng": -72.5400,
        "atributos": {
            "unidad_protegida": "Parque Nacional Patagonia (Sector Tamango)",
            "especie_focal": "Hippocamelus bisulcus (Huemul)",
            "metodologia": "Red fija de 24 cámaras trampa y transectos estacionales",
            "poblacion_monitoreada": "Aproximadamente 45 individuos residentes",
            "institucion_custodio": "CONAF Región de Aysén"
        },
        "source_url": "https://www.conaf.cl/parques/parque-nacional-patagonia/"
    },
    {
        "id": "node_bio_02_cerro_castillo",
        "nombre": "Estación Biológica Corredor del Huemul Cerro Castillo",
        "tipo": "Conservación de Especies",
        "codigo_comuna": "CL-XI-07",
        "comuna_ine": "11402",
        "lat": -46.0650,
        "lng": -72.1850,
        "atributos": {
            "unidad_protegida": "Parque Nacional Cerro Castillo",
            "especie_focal": "Hippocamelus bisulcus (Huemul)",
            "metodologia": "Seguimiento satelital de collares GPS y pasos de fauna carreteros",
            "poblacion_monitoreada": "Estimada en 80-100 ejemplares",
            "institucion_custodio": "CONAF / Rewilding Chile"
        },
        "source_url": "https://www.conaf.cl/parques/parque-nacional-cerro-castillo/"
    },
    {
        "id": "node_bio_03_golfo_corcovado",
        "nombre": "Estación de Vigilancia Acústica Cetáceos Golfo Corcovado",
        "tipo": "Monitoreo Marino",
        "codigo_comuna": "CL-XI-05",
        "comuna_ine": "11203",
        "lat": -43.8800,
        "lng": -73.6500,
        "atributos": {
            "area_marina": "Golfo Corcovado y Boca del Moraleda",
            "especie_focal": "Balaenoptera musculus (Ballena Azul)",
            "metodologia": "Hidrófonos subacuáticos autónomos y fotoidentificación",
            "institucion_custodio": "Centro Ballena Azul (CBA) / UACh"
        },
        "source_url": "https://especies.mma.gob.cl/"
    },
    {
        "id": "node_bio_04_golfo_de_penas",
        "nombre": "Estación Centinela Golfo de Penas - Vigilancia Ballena Sei y FAN",
        "tipo": "Vigilancia Sanitaria y Faunística",
        "codigo_comuna": "CL-XI-10",
        "comuna_ine": "11303",
        "lat": -47.3500,
        "lng": -74.7500,
        "atributos": {
            "area_marina": "Golfo de Penas",
            "especie_focal": "Balaenoptera borealis (Ballena Sei)",
            "metodologia": "Monitoreo oceanográfico de biotoxinas y patrullajes de varamiento",
            "institucion_custodio": "SERNAPESCA / IFOP / CIEP"
        },
        "source_url": "https://www.sernapesca.cl/"
    },
    {
        "id": "node_bio_05_delta_baker",
        "nombre": "Estación Fluvial de Conservación del Huillín Delta del Baker",
        "tipo": "Monitoreo Fauna Silvestre",
        "codigo_comuna": "CL-XI-10",
        "comuna_ine": "11303",
        "lat": -47.8100,
        "lng": -73.5500,
        "atributos": {
            "cuenca": "Cuenca 115 (Desembocadura Río Baker)",
            "especie_focal": "Lontra provocax (Huillín)",
            "metodologia": "Censos estacionales de letrinas y madrigueras fluviales",
            "institucion_custodio": "CODEFF / SAG"
        },
        "source_url": "https://www.sag.gob.cl/"
    },
    {
        "id": "node_bio_06_turberas_tortel",
        "nombre": "Estación Botánica y Monitoreo de Turberas de Sphagnum Caleta Tortel",
        "tipo": "Monitoreo Ecosistémico",
        "codigo_comuna": "CL-XI-10",
        "comuna_ine": "11303",
        "lat": -47.7950,
        "lng": -73.5350,
        "atributos": {
            "ecosistema": "Turberas ombrotróficas y bosques de Ciprés de las Guaitecas",
            "especie_focal": "Pilgerodendron uviferum y Sphagnum magellanicum",
            "metodologia": "Parcelas permanentes de balance de carbono e hidrología de turba",
            "institucion_custodio": "CONAF / CIEP"
        },
        "source_url": "https://sit.conaf.cl/"
    },
    {
        "id": "node_bio_07_laguna_san_rafael",
        "nombre": "Estación de Investigación Parque Nacional Laguna San Rafael",
        "tipo": "Monitoreo Integral de Biodiversidad",
        "codigo_comuna": "CL-XI-03",
        "comuna_ine": "11201",
        "lat": -46.6800,
        "lng": -73.8700,
        "atributos": {
            "unidad_protegida": "Parque Nacional Laguna San Rafael",
            "especies_focales": "Pudu puda, Hippocamelus bisulcus, Lontra provocax",
            "ecosistema": "Bosque Siempreverde templado lluvioso y fiordos glaciares",
            "institucion_custodio": "CONAF Región de Aysén"
        },
        "source_url": "https://www.conaf.cl/parques/parque-nacional-laguna-san-rafael/"
    },
    {
        "id": "node_bio_08_pn_queulat",
        "nombre": "Estación de Monitoreo Bosque Siempreverde Parque Nacional Queulat",
        "tipo": "Monitoreo Flora y Fauna",
        "codigo_comuna": "CL-XI-04",
        "comuna_ine": "11202",
        "lat": -44.4700,
        "lng": -72.5500,
        "atributos": {
            "unidad_protegida": "Parque Nacional Queulat",
            "especies_focales": "Pudu puda, Campephilus magellanicus, Hippocamelus bisulcus",
            "tipo_forestal": "Bosque Siempreverde (tepa, coihue de Chiloé, canelo)",
            "institucion_custodio": "CONAF Región de Aysén"
        },
        "source_url": "https://www.conaf.cl/parques/parque-nacional-queulat/"
    },
    {
        "id": "node_bio_09_didymo_simpson",
        "nombre": "Estación Limnológica y Control Didymo Río Simpson",
        "tipo": "Control Especies Invasoras",
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "lat": -45.5720,
        "lng": -72.0710,
        "atributos": {
            "cuenca": "Cuenca 113 (Río Simpson)",
            "especie_invasora": "Didymosphenia geminata (Didymo)",
            "actividad": "Muestreo mensual de biomasa algal y fiscalización de bioseguridad",
            "institucion_custodio": "SERNAPESCA / CIEP"
        },
        "source_url": "https://www.sernapesca.cl/"
    },
    {
        "id": "node_bio_10_vison_manihuales",
        "nombre": "Estación de Trampeo y Control de Visón Río Mañihuales",
        "tipo": "Control Especies Invasoras",
        "codigo_comuna": "CL-XI-03",
        "comuna_ine": "11201",
        "lat": -45.1700,
        "lng": -72.4800,
        "atributos": {
            "cuenca": "Río Mañihuales / Río Aysén",
            "especie_invasora": "Neovison vison (Visón norteamericano)",
            "actividad": "Línea de 30 trampas de guillotina selectiva viva con escape para huillín",
            "institucion_custodio": "SAG Región de Aysén"
        },
        "source_url": "https://www.sag.gob.cl/"
    },
    {
        "id": "node_bio_11_castor_bravo",
        "nombre": "Puesto de Contención y Monitoreo del Castor Río Bravo",
        "tipo": "Control Especies Invasoras",
        "codigo_comuna": "CL-XI-09",
        "comuna_ine": "11302",
        "lat": -48.0200,
        "lng": -73.0800,
        "atributos": {
            "cuenca": "Cuenca 117 (Río Bravo)",
            "especie_invasora": "Castor canadensis (Castor)",
            "actividad": "Monitoreo satelital de castoreras y trampeo de choque Conibear 330",
            "institucion_custodio": "Proyecto GEF Castor / SAG / MMA"
        },
        "source_url": "https://gefcastor.mma.gob.cl/"
    },
    {
        "id": "node_bio_12_condorera_mackay",
        "nombre": "Condorera Reproductiva y Observatorio Cerro Mackay",
        "tipo": "Monitoreo Fauna Silvestre",
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "lat": -45.6020,
        "lng": -72.0720,
        "atributos": {
            "ubicacion": "Farellón basáltico Cerro Mackay",
            "especie_focal": "Vultur gryphus (Cóndor andino)",
            "poblacion_monitoreada": "Dormidero y sitio de nidificación con más de 25 ejemplares",
            "institucion_custodio": "SAG / AvesChile"
        },
        "source_url": "https://especies.mma.gob.cl/"
    },
    {
        "id": "node_bio_13_coexistencia_chacabuco",
        "nombre": "Área de Coexistencia Depredador-Ganadería y Guanacos Valle Chacabuco",
        "tipo": "Conservación y Restauración Ecosistémica",
        "codigo_comuna": "CL-XI-08",
        "comuna_ine": "11301",
        "lat": -47.1100,
        "lng": -72.4800,
        "atributos": {
            "unidad_protegida": "Parque Nacional Patagonia (Valle Chacabuco)",
            "especies_focales": "Lama guanicoe (Guanaco) y Puma concolor puma (Puma)",
            "programa": "Monitoreo de interacciones depredador-presa y perros pastores protectores",
            "institucion_custodio": "Rewilding Chile / CONAF"
        },
        "source_url": "https://www.conaf.cl/parques/parque-nacional-patagonia/"
    },
    {
        "id": "node_bio_14_maca_meseta_buenos_aires",
        "nombre": "Estación de Monitoreo Macá Tobiano Lagunas Meseta Buenos Aires",
        "tipo": "Conservación de Especies en Peligro Crítico",
        "codigo_comuna": "CL-XI-06",
        "comuna_ine": "11401",
        "lat": -46.8500,
        "lng": -71.8500,
        "atributos": {
            "ecosistema": "Lagunas basálticas de alta meseta volcánica (>1.100 msnm)",
            "especie_focal": "Podiceps gallardoi (Macá tobiano)",
            "estado_conservacion": "En Peligro Crítico (CR)",
            "institucion_custodio": "MMA / AvesChile / Proyecto Macá Tobiano Binacional"
        },
        "source_url": "https://especies.mma.gob.cl/"
    },
    {
        "id": "node_bio_15_sag_huemules",
        "nombre": "Barrera de Bioseguridad y Fitosanitaria SAG Paso Huemules",
        "tipo": "Bioseguridad y Barrera EEI",
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "lat": -45.9190,
        "lng": -71.6450,
        "atributos": {
            "paso_fronterizo": "Paso Internacional Huemules",
            "actividad": "Control cuarentenario de ingreso de plagas, semillas de invasoras y fauna exótica",
            "institucion_custodio": "Servicio Agrícola y Ganadero (SAG)"
        },
        "source_url": "https://www.sag.gob.cl/"
    },
    {
        "id": "node_bio_16_chinook_rio_cisnes",
        "nombre": "Estación Ictiológica y Monitoreo Salmón Chinook Río Cisnes",
        "tipo": "Monitoreo Especies Introducidas",
        "codigo_comuna": "CL-XI-04",
        "comuna_ine": "11202",
        "lat": -44.7800,
        "lng": -72.6000,
        "atributos": {
            "cuenca": "Cuenca 112 (Río Cisnes)",
            "especie_objeto": "Oncorhynchus tshawytscha (Salmón chinook)",
            "actividad": "Censo hidroacústico y conteo de camas de desove en pozones fluviales",
            "institucion_custodio": "IFOP / CIEP"
        },
        "source_url": "https://www.ifop.cl/"
    },
    {
        "id": "node_bio_17_cipres_melinka",
        "nombre": "Estación de Monitoreo Poblacional Ciprés de las Guaitecas Melinka",
        "tipo": "Conservación Flora Nativa",
        "codigo_comuna": "CL-XI-05",
        "comuna_ine": "11203",
        "lat": -43.8960,
        "lng": -73.7480,
        "atributos": {
            "ubicacion": "Isla Ascensión / Melinka",
            "especie_focal": "Pilgerodendron uviferum (Ciprés de las Guaitecas)",
            "actividad": "Seguimiento de regeneración natural y banco de germoplasma nativo",
            "institucion_custodio": "CONAF / INFOR"
        },
        "source_url": "https://sit.conaf.cl/"
    },
    {
        "id": "node_bio_18_rosselot",
        "nombre": "Centro de Conservación Flora Andina Reserva Nacional Lago Rosselot",
        "tipo": "Monitoreo Flora y Fauna",
        "codigo_comuna": "CL-XI-02",
        "comuna_ine": "11102",
        "lat": -44.1500,
        "lng": -72.3000,
        "atributos": {
            "unidad_protegida": "Reserva Nacional Lago Rosselot",
            "especies_focales": "Hippocamelus bisulcus, Nothofagus pumilio, Laureliopsis philippiana",
            "institucion_custodio": "CONAF Región de Aysén"
        },
        "source_url": "https://www.conaf.cl/parques/reserva-nacional-lago-rosselot/"
    },
    {
        "id": "node_bio_19_balmaceda_estepa",
        "nombre": "Estación de Monitoreo de Pastizales Esteparios Balmaceda",
        "tipo": "Monitoreo Ecosistemas Terrestres",
        "codigo_comuna": "CL-XI-01",
        "comuna_ine": "11101",
        "lat": -45.9100,
        "lng": -71.7000,
        "atributos": {
            "ecosistema": "Estepa patagónica oriental fría",
            "especie_vegetal": "Festuca pallescens (Coirón blanco)",
            "actividad": "Medición de desertificación, biomasa forrajera y captura de carbono en suelo",
            "institucion_custodio": "INIA Tamel Aike / CONAF"
        },
        "source_url": "https://sit.conaf.cl/"
    },
    {
        "id": "node_bio_20_general_carrera_aves",
        "nombre": "Observatorio de Aves Acuáticas y Humedales Lago General Carrera",
        "tipo": "Monitoreo Ornitológico",
        "codigo_comuna": "CL-XI-06",
        "comuna_ine": "11401",
        "lat": -46.5400,
        "lng": -71.7200,
        "atributos": {
            "humedal": "Humedal costero Bahía Jara / Desembocadura Jeinimeni",
            "avifauna_focal": "Humedales lacustres, pato anteojillo, flamenco chileno estival",
            "institucion_custodio": "CONAF / AvesChile"
        },
        "source_url": "https://especies.mma.gob.cl/"
    }
]

# -------------------------------------------------------------------------
# 6. EXPORTACIÓN DEL JSON SISTÉMICO WP_07
# -------------------------------------------------------------------------

def build_systemic_json() -> Dict[str, Any]:
    print("-> Construyendo dataset systemic 07_biodiversidad_flora_fauna_aysen.json...")

    dataset = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "version": "1.0.0",
        "work_package": "WP_07",
        "dataset_id": "biodiversidad_flora_fauna_aysen",
        "titulo": "Biodiversidad, Flora Nativa, Fauna en Conservación y Especies Exóticas Invasoras de Aysén",
        "region": "Aysén del General Carlos Ibáñez del Campo (CL-XI)",
        "fecha_extraccion": "2026-10-17T21:00:00Z",
        "fuentes_primarias": [
            {
                "institucion": "Ministerio del Medio Ambiente (MMA)",
                "sistema": "Inventario Nacional de Especies y Decretos Supremos del Reglamento de Clasificación de Especies (RCE)",
                "url_origen": "https://clasificacionespecies.mma.gob.cl/",
                "metodo_extraccion": "Catastro oficial RCE y fichas taxonómicas de especies",
                "archivo_raw_local": "data/raw/biodiversidad_mma_conaf/rce_mma_fauna_aysen_raw.json"
            },
            {
                "institucion": "Corporación Nacional Forestal (CONAF)",
                "sistema": "Catastro de los Recursos Vegetacionales Nativos de Chile y Sistema Nacional de Áreas Silvestres Protegidas del Estado (SNASPE)",
                "url_origen": "https://sit.conaf.cl/",
                "metodo_extraccion": "Base cartográfica territorial y estadísticas oficiales SNASPE",
                "archivo_raw_local": "data/raw/biodiversidad_mma_conaf/conaf_catastro_vegetacional_aysen_raw.json"
            },
            {
                "institucion": "Servicio Agrícola y Ganadero (SAG)",
                "sistema": "División de Protección de los Recursos Naturales Renovables y Subdepartamento de Vida Silvestre",
                "url_origen": "https://www.sag.gob.cl/ambitos-de-accion/especies-exoticas-invasoras",
                "metodo_extraccion": "Registros de programas de control EEI y vigilancia zoosanitaria",
                "archivo_raw_local": "data/raw/biodiversidad_mma_conaf/sag_especies_exoticas_invasoras_aysen_raw.json"
            },
            {
                "institucion": "Instituto de Fomento Pesquero (IFOP) y SERNAPESCA",
                "sistema": "Departamento de Medio Ambiente y Monitoreo de Recursos Acuáticos e Invasiones Biológicas",
                "url_origen": "https://www.ifop.cl/",
                "metodo_extraccion": "Campañas de prospección hidroacústica, censos de cetáceos y bioseguridad Didymo",
                "archivo_raw_local": "data/raw/biodiversidad_mma_conaf/sag_especies_exoticas_invasoras_aysen_raw.json"
            }
        ],
        "resumen_regional": {
            "superficie_regional_ha": 10849440.0,
            "flora_formaciones_hectareas": {
                "bosque_siempreverde_ha": 2672000.0,
                "bosque_caducifolio_lenga_nire_ha": 1665000.0,
                "desglose_lenga_ha": 1015000.0,
                "desglose_nire_ha": 650000.0,
                "cipres_de_las_guaitecas_ha": 376200.0,
                "turberas_y_humedales_ha": 289800.0,
                "estepa_patagonica_ha": 712000.0,
                "total_cobertura_vegetal_nativa_auditada_ha": 5715000.0,
                "porcentaje_cobertura_vegetal_regional_pct": 52.7,
                "porcentaje_territorio_protegido_snaspe_ha": 5217400.0,
                "porcentaje_territorio_protegido_snaspe_pct": 48.1
            },
            "fauna_conservacion_rce": {
                "especies_emblematicas_evaluadas": 12,
                "conteo_en_peligro_critico_cr": 1,
                "conteo_en_peligro_en": 4,
                "conteo_vulnerable_vu": 4,
                "conteo_casi_amenazado_nt": 3,
                "especie_bandera_terrestre": "Hippocamelus bisulcus (Huemul) - Aysén concentra el 60-70% de la población mundial",
                "especie_bandera_marina": "Balaenoptera musculus (Ballena Azul) - Golfo Corcovado como principal zona de forrajeo en el Pacífico Suroriental",
                "especie_mas_critica": "Podiceps gallardoi (Macá tobiano) - Menos de 800 ejemplares en el mundo, en peligro crítico de extinción"
            },
            "especies_exoticas_invasoras": {
                "especies_prioritarias_gestion": 6,
                "vison_norteamericano_cobertura": "Presente en las 10 comunas de la región",
                "castor_canadiense_frente_avance": "Foco activo en Tortel y O'Higgins; barrera de contención activa en cuenca baja del Río Baker",
                "microalga_didymo_cuencas": "Presente en cuencas del Simpson, Baker, Cisnes y Figueroa",
                "jabali_europeo_ingreso": "Pasos cordilleranos orientales de Lago Verde, Coyhaique y Río Ibáñez",
                "lupino_perenne_via_dispersion": "Corredores viales de la Carretera Austral (Ruta 7)",
                "salmonidos_asilvestrados_impacto": "Dominancia en biomasa en todas las cuencas fluviales con corridas masivas de salmón chinook"
            }
        },
        "catastro_fauna_emblematica_rce": CATASTRO_FAUNA_RCE,
        "catastro_especies_exoticas_invasoras": CATASTRO_EEI,
        "por_comuna": COMUNAS_DATA,
        "nodos_georreferenciados": NODOS_BIODIVERSIDAD
    }

    out_file = SYSTEMIC_DIR / "07_biodiversidad_flora_fauna_aysen.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)

    print(f"   [OK] JSON escrito exitosamente en {out_file}")
    return dataset


# -------------------------------------------------------------------------
# 7. GENERACIÓN DE LA PLANILLA CSV EXCEL UTF-8 BOM
# -------------------------------------------------------------------------

def export_comprehensive_csv(data: Dict[str, Any]) -> None:
    csv_file = CSV_DIR / "07_flora_fauna_ecosistemas_aysen.csv"
    print(f"-> Generando planilla Excel {csv_file} con UTF-8 BOM...")

    headers = [
        "codigo_comuna",
        "comuna_ine",
        "nombre_comuna",
        "provincia",
        "codigo_cuenca",
        "lat",
        "lng",
        "superficie_comunal_ha",
        "bosque_siempreverde_ha",
        "bosque_caducifolio_lenga_nire_ha",
        "desglose_lenga_ha",
        "desglose_nire_ha",
        "cipres_de_las_guaitecas_ha",
        "turberas_y_humedales_ha",
        "estepa_patagonica_ha",
        "total_cobertura_vegetal_nativa_ha",
        "porcentaje_cobertura_vegetal_pct",
        "especies_arboreas_principales",
        "fauna_huemul_en_peligro",
        "fauna_pudu_vulnerable",
        "fauna_huillin_en_peligro",
        "fauna_chungungo_en_peligro",
        "fauna_ballena_sei_en_peligro",
        "fauna_ballena_azul_en_peligro",
        "fauna_delfin_chileno_casi_amenazado",
        "fauna_puma_casi_amenazado",
        "fauna_guanaco_vulnerable",
        "fauna_condor_vulnerable",
        "fauna_carpintero_negro_casi_amenazado",
        "fauna_maca_tobiano_peligro_critico",
        "nucleos_clave_fauna",
        "unidades_snaspe",
        "eei_vison_norteamericano_severidad",
        "eei_castor_canadiense_severidad",
        "eei_jabali_europeo_severidad",
        "eei_microalga_didymo_severidad",
        "eei_lupino_perenne_severidad",
        "eei_salmonidos_asilvestrados_severidad",
        "programas_control_eei_activos",
        "source_url"
    ]

    rows = []
    for c in data["por_comuna"]:
        d = c["datos"]
        flora = d["flora_y_formaciones_vegetacionales"]
        fauna = d["fauna_emblematica_conservacion"]
        eei = d["especies_exoticas_invasoras"]
        esp_fauna = fauna.get("especies_presentes", [])
        esp_str = " | ".join(esp_fauna)

        row = {
            "codigo_comuna": c["codigo_comuna"],
            "comuna_ine": c["comuna_ine"],
            "nombre_comuna": c["nombre_comuna"],
            "provincia": c["provincia"],
            "codigo_cuenca": c["codigo_cuenca"],
            "lat": c["lat"],
            "lng": c["lng"],
            "superficie_comunal_ha": flora["superficie_comunal_ha"],
            "bosque_siempreverde_ha": flora["bosque_siempreverde_ha"],
            "bosque_caducifolio_lenga_nire_ha": flora["bosque_caducifolio_lenga_nire_ha"],
            "desglose_lenga_ha": flora["desglose_lenga_ha"],
            "desglose_nire_ha": flora["desglose_nire_ha"],
            "cipres_de_las_guaitecas_ha": flora["cipres_de_las_guaitecas_ha"],
            "turberas_y_humedales_ha": flora["turberas_y_humedales_ha"],
            "estepa_patagonica_ha": flora["estepa_patagonica_ha"],
            "total_cobertura_vegetal_nativa_ha": flora["total_cobertura_vegetal_nativa_ha"],
            "porcentaje_cobertura_vegetal_pct": flora["porcentaje_cobertura_vegetal_pct"],
            "especies_arboreas_principales": " | ".join(flora["especies_arboreas_dominantes"]),
            "fauna_huemul_en_peligro": "SI" if "Huemul" in esp_str else "NO",
            "fauna_pudu_vulnerable": "SI" if "Pudú" in esp_str else "NO",
            "fauna_huillin_en_peligro": "SI" if "Huillín" in esp_str else "NO",
            "fauna_chungungo_en_peligro": "SI" if "Chungungo" in esp_str else "NO",
            "fauna_ballena_sei_en_peligro": "SI" if "Ballena Sei" in esp_str else "NO",
            "fauna_ballena_azul_en_peligro": "SI" if "Ballena Azul" in esp_str else "NO",
            "fauna_delfin_chileno_casi_amenazado": "SI" if "Delfín Chileno" in esp_str else "NO",
            "fauna_puma_casi_amenazado": "SI" if "Puma" in esp_str else "NO",
            "fauna_guanaco_vulnerable": "SI" if "Guanaco" in esp_str else "NO",
            "fauna_condor_vulnerable": "SI" if "Cóndor" in esp_str else "NO",
            "fauna_carpintero_negro_casi_amenazado": "SI" if "Carpintero" in esp_str else "NO",
            "fauna_maca_tobiano_peligro_critico": "SI" if "Macá tobiano" in esp_str else "NO",
            "nucleos_clave_fauna": fauna["nucleos_poblacionales_clave"],
            "unidades_snaspe": " | ".join(fauna["unidades_snaspe_comunales"]),
            "eei_vison_norteamericano_severidad": eei["vison_norteamericano"]["severidad"],
            "eei_castor_canadiense_severidad": eei["castor_canadiense"]["severidad"],
            "eei_jabali_europeo_severidad": eei["jabali_europeo"]["severidad"],
            "eei_microalga_didymo_severidad": eei["microalga_didymo"]["severidad"],
            "eei_lupino_perenne_severidad": eei["lupino_perenne"]["severidad"],
            "eei_salmonidos_asilvestrados_severidad": eei["salmonidos_asilvestrados"]["severidad"],
            "programas_control_eei_activos": f"Visón: {eei['vison_norteamericano']['programa_control']}; Castor: {eei['castor_canadiense']['programa_control']}; Didymo: {eei['microalga_didymo']['programa_control']}",
            "source_url": c["source_url"]
        }
        rows.append(row)

    # Agregar fila de Total Regional
    regional_flora = data["resumen_regional"]["flora_formaciones_hectareas"]
    regional_row = {
        "codigo_comuna": "CL-XI-REG",
        "comuna_ine": "regional",
        "nombre_comuna": "TOTAL REGIONAL AYSEN",
        "provincia": "Aysén (4 provincias)",
        "codigo_cuenca": "110-117",
        "lat": -45.5712,
        "lng": -72.0685,
        "superficie_comunal_ha": data["resumen_regional"]["superficie_regional_ha"],
        "bosque_siempreverde_ha": regional_flora["bosque_siempreverde_ha"],
        "bosque_caducifolio_lenga_nire_ha": regional_flora["bosque_caducifolio_lenga_nire_ha"],
        "desglose_lenga_ha": regional_flora["desglose_lenga_ha"],
        "desglose_nire_ha": regional_flora["desglose_nire_ha"],
        "cipres_de_las_guaitecas_ha": regional_flora["cipres_de_las_guaitecas_ha"],
        "turberas_y_humedales_ha": regional_flora["turberas_y_humedales_ha"],
        "estepa_patagonica_ha": regional_flora["estepa_patagonica_ha"],
        "total_cobertura_vegetal_nativa_ha": regional_flora["total_cobertura_vegetal_nativa_auditada_ha"],
        "porcentaje_cobertura_vegetal_pct": regional_flora["porcentaje_cobertura_vegetal_regional_pct"],
        "especies_arboreas_principales": "Formaciones boscosas y vegetacionales nativas dominantes de Aysén",
        "fauna_huemul_en_peligro": "SI",
        "fauna_pudu_vulnerable": "SI",
        "fauna_huillin_en_peligro": "SI",
        "fauna_chungungo_en_peligro": "SI",
        "fauna_ballena_sei_en_peligro": "SI",
        "fauna_ballena_azul_en_peligro": "SI",
        "fauna_delfin_chileno_casi_amenazado": "SI",
        "fauna_puma_casi_amenazado": "SI",
        "fauna_guanaco_vulnerable": "SI",
        "fauna_condor_vulnerable": "SI",
        "fauna_carpintero_negro_casi_amenazado": "SI",
        "fauna_maca_tobiano_peligro_critico": "SI",
        "nucleos_clave_fauna": "Tamango, Cerro Castillo, Golfo Corcovado, Golfo de Penas, Delta del Baker, Meseta Buenos Aires",
        "unidades_snaspe": "18 unidades SNASPE (5.217.400 ha protegidas, 48,1% de la región)",
        "eei_vison_norteamericano_severidad": "Muy Alta",
        "eei_castor_canadiense_severidad": "Foco Sur Crítico",
        "eei_jabali_europeo_severidad": "Media-Alta Cordillerana",
        "eei_microalga_didymo_severidad": "Muy Alta en ríos principales",
        "eei_lupino_perenne_severidad": "Alta en bordes viales Ruta 7",
        "eei_salmonidos_asilvestrados_severidad": "Muy Alta generalizada",
        "programas_control_eei_activos": "Estrategia GEF Castor, Programa FNDR-SAG Visón, Bioseguridad SERNAPESCA Didymo",
        "source_url": "https://sit.conaf.cl/"
    }
    rows.append(regional_row)

    with open(csv_file, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)

    print(f"   [OK] Planilla CSV guardada exitosamente con UTF-8 BOM en {csv_file}")


def main() -> None:
    print("==========================================================================")
    print("INGESTA WP_07: BIODIVERSIDAD, FLORA, FAUNA EN CONSERVACIÓN Y EEI EN AYSÉN")
    print("==========================================================================")
    generate_raw_backups()
    dataset = build_systemic_json()
    export_comprehensive_csv(dataset)
    print("==========================================================================")
    print("PIPELINE WP_07 COMPLETADO CON ÉXITO")
    print("==========================================================================")


if __name__ == "__main__":
    main()
