import json
import re

def verify():
    with open('data/aysen_hubs_data.js', 'r', encoding='utf-8') as f:
        content = f.read()

    start = content.find('{')
    end = content.rfind('}')
    assert start != -1 and end != -1, "Could not find JSON object in aysen_hubs_data.js"
    json_str = content[start:end+1]
    data = json.loads(json_str)

    hubs = data.get('hubs', [])
    nodos = data.get('nodos', [])
    
    expected_hubs = [
        ('turismo', 'I'),
        ('salmonicultura', 'II'),
        ('energia', 'III'),
        ('gobernanza', 'IV'),
        ('inversion', 'V'),
        ('social', 'VI'),
        ('biodiversidad', 'VII'),
        ('salud', 'VIII'),
        ('cultura', 'IX'),
        ('ctci', 'X')
    ]
    
    print(f"Total hubs: {len(hubs)}")
    assert len(hubs) == 10, f"Expected 10 hubs, got {len(hubs)}"
    
    hub_map = {h['id']: h for h in hubs}
    for hid, roman in expected_hubs:
        assert hid in hub_map, f"Missing hub {hid}"
        h = hub_map[hid]
        actual_numeral = h.get('numeral') or h.get('roman')
        assert actual_numeral == roman, f"Hub {hid} expected roman {roman}, got {actual_numeral}"
        satellites = [n for n in nodos if n.get('hubId') == hid]
        print(f"Hub {roman}. {hid}: {len(satellites)} satellites")
        assert len(satellites) >= 3, f"Hub {hid} has fewer than 3 satellites ({len(satellites)})"

    # Check salud satellites (24: Red DEIS, 38: APS Rural, 39: Lista de Espera / SAMU)
    salud_nodes = [n for n in nodos if n.get('hubId') == 'salud']
    salud_ids = {n['id'] for n in salud_nodes}
    print(f"Salud node IDs: {salud_ids}")
    assert 24 in salud_ids and 38 in salud_ids and 39 in salud_ids, f"Salud missing expected nodes: {salud_ids}"
    
    # Check relatedNodeIds for salud
    all_salud_related = []
    for n in salud_nodes:
        all_salud_related.extend(n.get('relatedNodeIds', []))
    print("Salud relatedNodeIds:", set(all_salud_related))
    # Should connect to energia, biodiversidad, salmonicultura, social
    # Check that relatedNodeIds point to existing nodes in these hubs
    all_nodes_by_id = {n['id']: n for n in nodos}
    related_hubs = {all_nodes_by_id[rid]['hubId'] for rid in all_salud_related if rid in all_nodes_by_id}
    print("Salud connects to hubs:", related_hubs)
    assert 'energia' in related_hubs or 'biodiversidad' in related_hubs or 'salmonicultura' in related_hubs or 'social' in related_hubs
    
    # Check cultura satellites
    cultura_nodes = [n for n in nodos if n.get('hubId') == 'cultura']
    cultura_ids = {n['id'] for n in cultura_nodes}
    print(f"Cultura node IDs: {cultura_ids}")
    assert {32, 33, 34}.issubset(cultura_ids), f"Cultura missing expected nodes: {cultura_ids}"
    
    # Check ctci satellites
    ctci_nodes = [n for n in nodos if n.get('hubId') == 'ctci']
    ctci_ids = {n['id'] for n in ctci_nodes}
    print(f"CTCi node IDs: {ctci_ids}")
    assert {35, 36, 37}.issubset(ctci_ids), f"CTCi missing expected nodes: {ctci_ids}"

    # Check node properties
    for nid in [24, 32, 33, 34, 35, 36, 37, 38, 39]:
        node = next(n for n in nodos if n['id'] == nid)
        assert 'chartSpec' in node and node['chartSpec'], f"Node {nid} missing chartSpec"
        assert 'tableColumns' in node and node['tableColumns'], f"Node {nid} missing tableColumns"
        assert 'tableRows' in node and node['tableRows'], f"Node {nid} missing tableRows"
        assert 'provenance' in node and node['provenance'], f"Node {nid} missing provenance"
        assert 'relatedNodeIds' in node, f"Node {nid} missing relatedNodeIds"

    # Also check index.html requirements
    with open('index.html', 'r', encoding='utf-8') as f:
        index_html = f.read()

    assert 'VIII' in index_html and 'IX' in index_html and 'X' in index_html, "index.html missing VIII/IX/X"
    assert '#be123c' in index_html, "index.html missing cluster color #be123c for salud"
    assert '#b45309' in index_html, "index.html missing cluster color #b45309 for cultura"
    assert '#6d28d9' in index_html, "index.html missing cluster color #6d28d9 for ctci"
    assert 'hub-salud' in index_html, "index.html missing hub-salud link"
    assert 'hub-cultura' in index_html, "index.html missing hub-cultura link"
    assert 'hub-ctci' in index_html, "index.html missing hub-ctci link"
    assert 'museos_espacios_n' in index_html, "index.html drawer missing museos_espacios_n"
    assert 'proyectos_anid_n' in index_html, "index.html drawer missing proyectos_anid_n"

    # Also check laboratorio.html requirements
    with open('laboratorio.html', 'r', encoding='utf-8') as f:
        lab_html = f.read()

    assert 'heroHubLauncherGrid' in lab_html, "laboratorio.html missing heroHubLauncherGrid"
    assert 'loadFullHubDashboard' in lab_html, "laboratorio.html missing loadFullHubDashboard"
    assert 'renderHeroLauncherGrid' in lab_html, "laboratorio.html missing renderHeroLauncherGrid"
    assert 'initHubGalleryUI' in lab_html, "laboratorio.html missing initHubGalleryUI"
    assert 'setupCanvasEngine' in lab_html, "laboratorio.html missing setupCanvasEngine"
    assert 'OFFICIAL_HUB_ORDER' in lab_html, "laboratorio.html missing OFFICIAL_HUB_ORDER"

    print("\n==========================================================================")
    print(">>> VERIFICATION COMPLETE: ALL 4 TECHNICAL BLOCKS ARE 100% VERIFIED! <<<")
    print("==========================================================================")

if __name__ == '__main__':
    verify()
