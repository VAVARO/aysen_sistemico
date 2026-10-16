import json

with open("data/comunas_aysen.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print(f"{'Comuna':<15} | {'Pop 2024':<9} | {'Sup km2':<9} | {'Densidad':<8} | {'CASEN Ing':<9} | {'Multidim':<8} | {'SNASPE %':<8} | {'R7 Pav/Rip (km)':<15}")
print("-" * 95)
for c in d["comunas"]:
    demo = c["demografia"]
    casen = c["pobreza_casen"]
    conaf = c["conservacion_conaf"]
    r7 = c["conectividad"]
    print(f"{c['nombre']:<15} | {demo['censo_2024_poblacion']:<9} | {demo['superficie_km2']:<9} | {demo['densidad_hab_km2']:<8} | {casen['pobreza_ingresos_pct']:<9}% | {casen['pobreza_multidimensional_pct']:<8}% | {conaf['superficie_protegida_pct']:<8}% | {r7['ruta7_km_pavimentados']:.1f} / {r7['ruta7_km_ripio']:.1f}")
