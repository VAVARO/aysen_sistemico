# WP_01: Poder Político, Autoridades y Finanzas Municipales (10 Comunas de Aysén)

## 📋 Prompt de Traspaso (Copiar y pegar en un modelo económico / nueva sesión)

```text
Ejecuta el paquete de trabajo WP_01 para el repositorio de Aysén.
REGLA DE TOKENS: NO leas mapa_territorial.html, index.html, data/series_prospectivas.json ni la carpeta .agents/.
Lee ÚNICAMENTE:
1. docs/handoff/MASTER_DATA_CONTRACT.md
2. docs/handoff/WP_01_GOBERNANZA_FINANZAS.md

Tu tarea:
1. Crear y ejecutar el script `scripts/ingesta/wp_01_gobernanza_finanzas.py` en Python 3.11 estándar.
2. Descargar / guardar respaldos crudos verificables en `data/raw/politico_sinim/` (consultando BCN Reportes Comunales, SINIM SUBDERE, DIPRES FNDR y SERVEL, con fallback estructurado auditable si algún endpoint bloquea requests automatizados).
3. Generar `data/systemic/01_gob_poder_finanzas.json` con cobertura 10/10 comunas (`11101` a `11303`) y al menos 12 nodos georreferenciados (10 municipalidades + Gobierno Regional de Aysén + Delegación Presidencial Regional).
4. Ejecutar `uv run python scripts/validate_data_lake.py --wp WP_01` hasta obtener `100% PASS`.
```

---

## 1. Fuentes Oficiales y Endpoints a Consultar / Almacenar en `data/raw/politico_sinim/`

1. **Biblioteca del Congreso Nacional (BCN) — Reportes Estadísticos Comunales y Parlamentarios**:
   - URLs por comuna:
     - Coyhaique (`11101`): `https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11101`
     - Lago Verde (`11102`): `https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11102`
     - Aysén (`11201`): `https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11201`
     - Cisnes (`11202`): `https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11202`
     - Guaitecas (`11203`): `https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11203`
     - Chile Chico (`11401`): `https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11401`
     - Río Ibáñez (`11402`): `https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11402`
     - Cochrane (`11301`): `https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11301`
     - O'Higgins (`11302`): `https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11302`
     - Tortel (`11303`): `https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2024&idcom=11303`
2. **SINIM (Sistema Nacional de Información Municipal - SUBDERE)**:
   - Portal de Datos Municipales: `https://datos.sinim.gov.cl/`
   - Variables críticas por comuna:
     - Ingresos Totales Municipales (`M$`)
     - Dependencia del Fondo Común Municipal (`dependencia_fcm_pct`, % sobre ingresos propios + FCM)
     - Ingresos Propios Permanentes (`ipp_m_pesos`, incluyendo patentes municipales y acuícolas)
     - Gasto Municipal por Habitante (`gasto_per_capita_miles_clp`)
3. **SERVEL / Autoridades Regionales y Comunales Vigentes (Periodo 2024–2028 / 2022–2026)**:
   - Gobernador/a Regional de Aysén, Delegado/a Presidencial Regional, Senadores (Circunscripción 14 Aysén) y Diputados (Distrito 27 Aysén).
   - Alcalde/sa en ejercicio en cada una de las 10 comunas, partido/pacto político, porcentaje de votación obtenida, número de concejales y participación electoral comunal.
4. **DIPRES / GORE Aysén (FNDR e Inversión Pública)**:
   - Ejecución presupuestaria del Gobierno Regional de Aysén (FNDR) y cartera de inversión pública regional/comunal (`https://www.dipres.gob.cl`).

---

## 2. Esquema Requerido por Comuna en `data/systemic/01_gob_poder_finanzas.json`

Dentro de cada elemento de `por_comuna[i].datos`, incluir obligatoriamente los 3 bloques exigidos por `validate_data_lake.py`:

```json
"datos": {
  "autoridades": {
    "alcalde_nombre": "Nombre Apellido",
    "alcalde_partido_pacto": "Partido / Pacto",
    "periodo_alcaldia": "2024-2028",
    "concejo_municipal_cupos": 6,
    "participacion_electoral_pct": 82.4,
    "fuente_electoral": "SERVEL / BCN"
  },
  "finanzas_sinim": {
    "presupuesto_municipal_anual_mclp": 18500,
    "presupuesto_per_capita_miles_clp": 320.0,
    "dependencia_fcm_pct": 42.5,
    "ingresos_patentes_acuicolas_mineras_mclp": 1450,
    "autonomia_financiera_nivel": "Media-Alta / Baja (Alta dependencia FCM)",
    "anio_referencia_sinim": 2024
  },
  "inversion_publica": {
    "fndr_asignado_estimado_mclp": 4200,
    "subdere_pmu_pmb_mclp": 850,
    "principales_focos_inversion": ["Pavimentación", "Saneamiento sanitario", "Postas rurales"]
  }
}
```

## 3. Nodos Georreferenciados Mínimos (`nodos_georreferenciados`)
Al menos **12 nodos** dentro del Bounding Box de Aysén:
- Las 10 Ilustres Municipalidades (con coordenadas exactas de su edificio consistorial, nombre del alcalde, presupuesto y link a su ficha BCN/SINIM).
- El Gobierno Regional de Aysén (GORE Aysén en Coyhaique, con presupuesto FNDR y autoridades regionales/parlamentarios).
- La Delegación Presidencial Regional de Aysén / Contraloría Regional.
