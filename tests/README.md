# Pruebas del repositorio

Todas las pruebas Python se ejecutan desde la raíz del repositorio con la ruta explícita del intérprete:

```powershell
& "C:\Users\alvar\.local\bin\python3.11.exe" tests/<archivo>.py
```

**Estado** (verificado el 22-oct-2026): `vigente` = corre en verde hoy; `núcleo` = además forma parte de la verificación rápida de `AGENTS.md` y del CI (`.github/workflows/verificacion.yml`); `legado` = prueba adversarial o de hito histórico, redundante con las suites núcleo, se conserva como referencia; `manual` = requiere Chrome headless con CDP (no corre en CI).

## Suites núcleo

| Archivo | Qué cubre | Cómo se corre | Estado |
|---|---|---|---|
| `test_e2e_requirements.py` | 58 pruebas de requisitos del Visor Territorial (datos, DOM contractual, CSV, comunas, series) | `python tests/test_e2e_requirements.py` | núcleo |
| `test_laboratorio_audit.py` | 7 pruebas de auditoría del Laboratorio: topbar, catálogo, motor gráfico | `python tests/test_laboratorio_audit.py` | núcleo |
| `test_laboratorio_health.py` | 6 pruebas de salud del Laboratorio: IDs contractuales, estructura | `python tests/test_laboratorio_health.py` | núcleo |
| `test_portal_health.py` | 5 pruebas de la Portada: cabecera, postales, secciones | `python tests/test_portal_health.py` | núcleo |
| `verify_m1_editorial.py` | 8 verificaciones editoriales del Visor Territorial (cabecera, drawer, IDs) | `python tests/verify_m1_editorial.py` | núcleo |
| `test_mobile_responsive_e2e.py` | 7 pruebas de adaptación móvil: menú, touch targets de 44px, dock del Laboratorio | `python tests/test_mobile_responsive_e2e.py` | vigente |
| `test_cecan_presets_and_nl2chart.py` | 6 pruebas de presets CECAN y consulta en lenguaje natural | `python tests/test_cecan_presets_and_nl2chart.py` | vigente |
| `test_nl2chart_engine.py` | 14 pruebas unitarias del motor de lenguaje natural a gráfico | `python tests/test_nl2chart_engine.py` | vigente |

## Laboratorio: pruebas por hito

| Archivo | Qué cubre | Cómo se corre | Estado |
|---|---|---|---|
| `test_laboratorio_m1_challenger.py` | Segmentador territorial, reinicio de lienzo, normalización de nombres, contador de ventanas | `python tests/test_laboratorio_m1_challenger.py` | legado (en verde) |
| `test_laboratorio_m2_challenger.py` | Acordeones del catálogo y pestañas | `python tests/test_laboratorio_m2_challenger.py` | legado (en verde) |
| `test_laboratorio_m2_deep_stress.py` | Estrés adversarial de acordeones y estado de pestañas | `python tests/test_laboratorio_m2_deep_stress.py` | legado (en verde) |
| `test_laboratorio_m3_challenger.py` | Formato de ejes y títulos de gráficos | `python tests/test_laboratorio_m3_challenger.py` | legado (en verde) |
| `test_laboratorio_m4_challenger.py` | Barra flotante arrastrable, dock superior, ocultar sin deseleccionar | `python tests/test_laboratorio_m4_challenger.py` | legado (en verde) |
| `test_m2_empirical_challenger.py` | Fuga de estado colapsado entre pestañas del catálogo | `python tests/test_m2_empirical_challenger.py` | legado (en verde) |
| `test_m3_adversarial_deep_probe.py` | Casos límite de `formatAxisTitle` y motor de ejes | `python tests/test_m3_adversarial_deep_probe.py` | legado (en verde) |
| `test_m3_empirical_stress_harness.py` | Arnés empírico de estrés del hito 3 | `python tests/test_m3_empirical_stress_harness.py` | legado (en verde) |
| `simulate_m2_accordion.cjs` | Simulación Node de cambio rápido de pestañas y acordeones | `node tests/simulate_m2_accordion.cjs` | legado |

## Datos: comunas, series y exportación

| Archivo | Qué cubre | Cómo se corre | Estado |
|---|---|---|---|
| `test_adversarial_comunas.py` | Estrés adversarial de `data/comunas_aysen.json` | `python tests/test_adversarial_comunas.py` | legado (en verde) |
| `test_m1_challenger_invariants.py` | Invariantes de `data/comunas_aysen.json` | `python tests/test_m1_challenger_invariants.py` | legado (en verde) |
| `test_m2_challenger_projections.py` | Curaduría y proyecciones 2030–2035 de `data/series_prospectivas.json` | `python tests/test_m2_challenger_projections.py` | legado (en verde) |
| `test_m2_superforecasting_latency.py` | Preguntas de pronóstico y latencia de consulta | `python tests/test_m2_superforecasting_latency.py` | legado (en verde) |
| `verify_m2_joins.py` | Interoperabilidad y cruces entre bases | `python tests/verify_m2_joins.py` | legado (en verde) |
| `audit_m2_forensic.py` | Auditoría forense de integridad del hito 2 | `python tests/audit_m2_forensic.py` | legado (en verde) |
| `test_audit_probe.py` | Auditoría de bounding box, esquema, fallbacks y reporte de salud (reescribe `data/data_health_report.json`) | `python tests/test_audit_probe.py` | legado (en verde) |
| `test_m3_adversarial_stress.py` | Casos límite del arnés de integridad | `python tests/test_m3_adversarial_stress.py` | legado (en verde) |
| `test_m3_export_oracle.py` | Exportación CSV y conformidad RFC 4180 | `python tests/test_m3_export_oracle.py` | legado (en verde) |
| `questions_inspection.md` | Inspección documental de las 18 preguntas de pronóstico | no ejecutable | legado |

## Visor Territorial (`mapa_territorial.html`)

| Archivo | Qué cubre | Cómo se corre | Estado |
|---|---|---|---|
| `test_m1_stress_challenge.py` | Estrés del rediseño editorial del hito 1 | `python tests/test_m1_stress_challenge.py` | legado (en verde) |
| `test_milestone1_adversarial_challenger.py` | Pruebas adversariales del hito 1 | `python tests/test_milestone1_adversarial_challenger.py` | legado (en verde) |
| `test_m1_adversarial.js` | Ciclo de vida de Chart.js y reutilización de canvas bajo cambios rápidos | requiere Chrome headless | manual |
| `test_m1_adversarial_runtime.cjs` | Ejecución dinámica del hito 1 | requiere Chrome headless | manual |
| `test_m2_adversarial_forensic.cjs` | Integridad forense y estrés del hito 2 | requiere Chrome headless | manual |
| `test_m2_export_runtime.js` | Exportación en ejecución y cambio entre vistas (CDP) | requiere Chrome headless | manual |
| `test_m3_export_runtime_adversarial.js` | Motor de exportación CSV y RFC 4180 en ejecución | requiere Chrome headless | manual |
| `test_m3_stress.js` | Cambio rápido entre las 3 vistas de navegación | requiere Chrome headless | manual |
| `test_wp08_plataforma_runtime.js` | Plataforma WP_08 de extremo a extremo (errores JS, runtime) | requiere Chrome headless | manual |

## Otras verificaciones fuera de `tests/`

| Comando | Qué cubre |
|---|---|
| `python scripts/test_fuentes_integridad.py` | 37 pruebas de integridad de fuentes y del Data Lake (reescribe `data/data_health_report.json`, ignorado por git) |
| `python scripts/validate_data_lake.py --all` | Validación del Data Lake WP_01 a WP_07 |
| `node scripts/build_aysen_hubs_bundle.cjs` | Recompila `data/aysen_hubs_data.js` |
