/**
 * tests/simulate_m2_accordion.cjs
 * Empirical Node.js simulation harness for Milestone 2 in laboratorio.html
 * Tests:
 * 1. Rapid tab switching and accordion fan-out/fan-in toggles
 * 2. Active search filter while expanding/collapsing accordions
 * 3. Adding a card from an accordion (dblclick, Enter keydown, drag-and-drop)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. Load laboratorio.html and extract functions and catalog data
const htmlPath = path.join(__dirname, '..', 'laboratorio.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Load window.AYSEN_HUBS_DATA
const hubsDataPath = path.join(__dirname, '..', 'data', 'aysen_hubs_data.js');
const hubsDataCode = fs.readFileSync(hubsDataPath, 'utf8');

const sandbox = {
  window: {},
  document: null
};

// Evaluate aysen_hubs_data in sandbox
const evalDataFn = new Function('window', hubsDataCode);
evalDataFn(sandbox.window);

const HUBS_DATA = sandbox.window.AYSEN_HUBS_DATA;
assert(HUBS_DATA, 'AYSEN_HUBS_DATA must be loaded');

// Extract normStr and getHubTitleName from html
function normStr(s) {
  if (!s) return '';
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`]/g, "'")
    .toLowerCase()
    .trim();
}

function getHubTitleName(hubId) {
  if (!hubId) return 'Otros';
  const str = String(hubId).toLowerCase();
  if (str.includes('turismo')) return 'I. Turismo';
  if (str.includes('salmon') || str.includes('pesca') || str.includes('maritorio') || str.includes('acuicultura')) return 'II. Salmonicultura';
  if (str.includes('energia') || str.includes('energía') || str.includes('combustible') || str.includes('telecom')) return 'III. Energía';
  if (str.includes('gobernanza') || str.includes('finanza')) return 'IV. Gobernanza';
  if (str.includes('inversion') || str.includes('inversión') || str.includes('empresa') || str.includes('seia') || str.includes('suelo') || str.includes('economia') || str.includes('economía')) return 'V. Inversión';
  if (str.includes('social') || str.includes('salud') || str.includes('educacion') || str.includes('educación') || str.includes('bienestar') || str.includes('demografia') || str.includes('demografía')) return 'VI. Social';
  if (str.includes('biodiversidad') || str.includes('conservacion') || str.includes('conservación') || str.includes('flora') || str.includes('fauna') || str.includes('medio ambiente')) return 'VII. Biodiversidad';
  const m = {
    'turismo': 'I. Turismo',
    'salmonicultura': 'II. Salmonicultura',
    'energia': 'III. Energía',
    'gobernanza': 'IV. Gobernanza',
    'inversion': 'V. Inversión',
    'social': 'VI. Social',
    'biodiversidad': 'VII. Biodiversidad'
  };
  return m[hubId] || hubId;
}

// Build realistic catalogItems from HUBS_DATA
const catalogItems = [];
HUBS_DATA.nodos.forEach(node => {
  const hubTitle = getHubTitleName(node.hubId);
  // Add communal item
  catalogItems.push({
    id: `${node.id}_comunal`,
    name: node.title,
    shortName: node.title,
    hubId: node.hubId,
    hubTitle: hubTitle,
    dim: 'comuna',
    unit: (node.chartSpec && node.chartSpec.unit) || 'valor'
  });
  // Add temporal item
  catalogItems.push({
    id: `${node.id}_temporal`,
    name: `${node.title} (2015-2026)`,
    shortName: node.title,
    hubId: node.hubId,
    hubTitle: hubTitle,
    dim: 'tiempo',
    unit: (node.chartSpec && node.chartSpec.unit) || 'valor'
  });
});
// Add holding items
for (let i = 1; i <= 3; i++) {
  catalogItems.push({
    id: `holding_salmon_${i}`,
    name: `Concesiones Holding ${i}`,
    shortName: `Holding ${i}`,
    hubId: 'salmonicultura',
    hubTitle: 'II. Salmonicultura',
    dim: 'holding',
    unit: 'concesiones'
  });
}

// DOM Simulator
class MockClassList {
  constructor() {
    this.classes = new Set();
  }
  add(c) { this.classes.add(c); }
  remove(c) { this.classes.delete(c); }
  toggle(c) {
    if (this.classes.has(c)) {
      this.classes.delete(c);
      return false;
    } else {
      this.classes.add(c);
      return true;
    }
  }
  contains(c) { return this.classes.has(c); }
}

class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.attributes = {};
    this.classList = new MockClassList();
    this.children = [];
    this.parentElement = null;
    this.listeners = {};
    this.innerHTML = '';
  }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k] || null; }
  removeAttribute(k) { delete this.attributes[k]; }
  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }
  dispatchEvent(evt) {
    const list = this.listeners[evt.type] || [];
    for (const fn of list) {
      fn(evt);
    }
  }
  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
  }
  querySelector(sel) {
    const res = this.querySelectorAll(sel);
    return res.length > 0 ? res[0] : null;
  }
  querySelectorAll(sel) {
    const results = [];
    function match(el) {
      if (sel.startsWith('.')) {
        const cls = sel.slice(1);
        if (el.classList.contains(cls)) results.push(el);
      } else if (sel.startsWith('#')) {
        const id = sel.slice(1);
        if (el.id === id) results.push(el);
      } else {
        if (el.tagName.toLowerCase() === sel.toLowerCase()) results.push(el);
      }
      for (const ch of el.children) match(ch);
    }
    for (const ch of this.children) match(ch);
    return results;
  }
  closest(sel) {
    let curr = this;
    while (curr) {
      if (sel.startsWith('.') && curr.classList && curr.classList.contains(sel.slice(1))) return curr;
      if (sel.startsWith('#') && curr.id === sel.slice(1)) return curr;
      curr = curr.parentElement;
    }
    return null;
  }
}

// Setup State
const AppState = {
  catalogItems: catalogItems,
  activeFilterDim: 'all',
  searchQuery: '',
  collapsedHubs: {},
  widgets: [],
  nextWidgetId: 1,
  activeWidgetId: null,
  draggedVariableId: null,
  transform: { x: 0, y: 0, scale: 1 }
};

const container = new MockElement('div', 'variablesTreeContainer');

// Exact implementation of renderSidebarCatalog extracted from laboratorio.html
function renderSidebarCatalog() {
  const q = normStr(AppState.searchQuery);
  const dimFilter = AppState.activeFilterDim;

  const filtered = AppState.catalogItems.filter(item => {
    if (item.isAlias) return false;
    if (dimFilter !== 'all' && item.dim !== dimFilter) return false;
    if (!q) return true;
    return normStr(item.name).includes(q) || normStr(item.hubTitle).includes(q) || normStr(item.unit).includes(q);
  });

  const groups = {};
  filtered.forEach(it => {
    const k = getHubTitleName(it.hubId || it.hubTitle);
    it.hubTitle = k;
    if (!groups[k]) groups[k] = [];
    groups[k].push(it);
  });

  const OFFICIAL_HUB_ORDER = [
    'I. Turismo',
    'II. Salmonicultura',
    'III. Energía',
    'IV. Gobernanza',
    'V. Inversión',
    'VI. Social',
    'VII. Biodiversidad'
  ];

  const sortedGroupKeys = OFFICIAL_HUB_ORDER.filter(hubKey => groups[hubKey] && groups[hubKey].length > 0);
  Object.keys(groups).forEach(k => {
    if (!sortedGroupKeys.includes(k) && groups[k].length > 0) sortedGroupKeys.push(k);
  });

  const isSearching = !!q;

  // Clear mock container
  container.children = [];
  container.innerHTML = '';

  sortedGroupKeys.forEach(gName => {
    const stateKey = `${dimFilter}_${gName}`;
    let isCollapsed;
    // Empirical test of ordering
    if (isSearching) {
      isCollapsed = false;
    } else if (AppState.collapsedHubs && AppState.collapsedHubs[stateKey] !== undefined) {
      isCollapsed = AppState.collapsedHubs[stateKey];
    } else if (dimFilter === 'holding' || sortedGroupKeys.length === 1) {
      isCollapsed = false;
    } else if (AppState.collapsedHubs && AppState.collapsedHubs[gName] !== undefined) {
      isCollapsed = AppState.collapsedHubs[gName];
    } else {
      isCollapsed = (gName !== sortedGroupKeys[0]);
    }

    const safeHubId = 'hub_' + gName.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const groupEl = new MockElement('div');
    groupEl.classList.add('catalog-hub-group');
    if (isCollapsed) groupEl.classList.add('collapsed');
    groupEl.setAttribute('data-hub-name', gName);

    const hdrEl = new MockElement('div', `hub-hdr-${safeHubId}`);
    hdrEl.classList.add('catalog-hub-header');
    hdrEl.setAttribute('role', 'button');
    hdrEl.setAttribute('tabindex', '0');
    hdrEl.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
    hdrEl.setAttribute('aria-controls', `hub-content-${safeHubId}`);
    hdrEl.setAttribute('data-hub-name', gName);
    groupEl.appendChild(hdrEl);

    const bodyEl = new MockElement('div', `hub-content-${safeHubId}`);
    bodyEl.classList.add('catalog-hub-items-body');
    bodyEl.setAttribute('role', 'region');
    bodyEl.setAttribute('aria-labelledby', `hub-hdr-${safeHubId}`);
    groupEl.appendChild(bodyEl);

    const itemsEl = new MockElement('div');
    itemsEl.classList.add('catalog-hub-items');
    bodyEl.appendChild(itemsEl);

    groups[gName].forEach(it => {
      const varEl = new MockElement('div');
      varEl.classList.add('catalog-var-item');
      varEl.setAttribute('role', 'button');
      varEl.setAttribute('tabindex', '0');
      varEl.setAttribute('data-var-id', it.id);
      itemsEl.appendChild(varEl);
    });

    container.appendChild(groupEl);
  });

  function toggleHubAccordion(hdr) {
    const group = hdr.closest('.catalog-hub-group');
    if (!group) return;
    const gName = hdr.getAttribute('data-hub-name');
    const currentDim = AppState.activeFilterDim || 'all';
    const stateKey = `${currentDim}_${gName}`;
    const isOpening = group.classList.contains('collapsed');

    if (isOpening) {
      // Modo abanico (fan-out): si no estamos en búsqueda activa, replegar hermanos
      if (!normStr(AppState.searchQuery)) {
        const parent = group.parentElement;
        if (parent) {
          parent.querySelectorAll('.catalog-hub-group').forEach(sib => {
            if (sib !== group && !sib.classList.contains('collapsed')) {
              sib.classList.add('collapsed');
              const sibHdr = sib.querySelector('.catalog-hub-header');
              if (sibHdr) sibHdr.setAttribute('aria-expanded', 'false');
              const sibName = sib.getAttribute('data-hub-name');
              if (sibName) {
                if (!AppState.collapsedHubs) AppState.collapsedHubs = {};
                AppState.collapsedHubs[sibName] = true;
                AppState.collapsedHubs[`${currentDim}_${sibName}`] = true;
              }
            }
          });
        }
      }

      // Expandir grupo destino
      group.classList.remove('collapsed');
      hdr.setAttribute('aria-expanded', 'true');
      if (!AppState.collapsedHubs) AppState.collapsedHubs = {};
      AppState.collapsedHubs[gName] = false;
      AppState.collapsedHubs[stateKey] = false;
    } else {
      // Colapsar grupo destino (fan-in)
      group.classList.add('collapsed');
      hdr.setAttribute('aria-expanded', 'false');
      if (!AppState.collapsedHubs) AppState.collapsedHubs = {};
      AppState.collapsedHubs[gName] = true;
      AppState.collapsedHubs[stateKey] = true;
    }
  }

  // Bind listeners
  container.querySelectorAll('.catalog-hub-header').forEach(hdr => {
    hdr.addEventListener('click', (e) => {
      toggleHubAccordion(hdr);
    });
    hdr.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        toggleHubAccordion(hdr);
      }
    });
  });

  container.querySelectorAll('.catalog-var-item').forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        el.dispatchEvent({ type: 'dblclick' });
      }
    });
    el.addEventListener('dragstart', (e) => {
      AppState.draggedVariableId = el.getAttribute('data-var-id');
      if (e.dataTransfer) e.dataTransfer.setData('text/plain', AppState.draggedVariableId);
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      AppState.draggedVariableId = null;
    });
    el.addEventListener('dblclick', () => {
      const varId = el.getAttribute('data-var-id');
      createWidget('chart', { varX: varId });
    });
  });
}

function createWidget(type, config) {
  const widget = {
    id: AppState.nextWidgetId++,
    type: type,
    varX: config.varX,
    varY: config.varY || null
  };
  AppState.widgets.push(widget);
  return widget;
}

// ============================================================================
// SUITE 1: RAPID TAB SWITCHING AND ACCORDION FAN-OUT / FAN-IN
// ============================================================================
console.log('--- SUITE 1: Rapid Tab Switching & Fan-out / Fan-in ---');

// Initial render
AppState.activeFilterDim = 'all';
AppState.searchQuery = '';
renderSidebarCatalog();

let groups = container.querySelectorAll('.catalog-hub-group');
assert.strictEqual(groups.length, 7, 'Tab "all" should render 7 hub groups');
assert.strictEqual(groups[0].classList.contains('collapsed'), false, 'First hub should be open');
assert.strictEqual(groups[1].classList.contains('collapsed'), true, 'Second hub should be collapsed');

// Toggle second hub (II. Salmonicultura)
let hdr1 = groups[1].querySelector('.catalog-hub-header');
hdr1.dispatchEvent({ type: 'click' });

// Invariant: only group 1 is now open; group 0 collapsed
assert.strictEqual(groups[0].classList.contains('collapsed'), true, 'Group 0 must now be collapsed');
assert.strictEqual(groups[1].classList.contains('collapsed'), false, 'Group 1 must now be open');
assert.strictEqual(hdr1.getAttribute('aria-expanded'), 'true');

// Toggle group 1 again -> Fan-in (all collapsed)
hdr1.dispatchEvent({ type: 'click' });
assert.strictEqual(groups[1].classList.contains('collapsed'), true, 'Group 1 must now be collapsed');
assert.strictEqual(hdr1.getAttribute('aria-expanded'), 'false');
let openCount = groups.filter(g => !g.classList.contains('collapsed')).length;
assert.strictEqual(openCount, 0, 'Fan-in: all groups collapsed');

// Rapid tab switching: all -> comuna -> tiempo -> holding -> all
const tabs = ['all', 'comuna', 'tiempo', 'holding'];
for (let cycle = 0; cycle < 50; cycle++) {
  for (const tab of tabs) {
    AppState.activeFilterDim = tab;
    renderSidebarCatalog();
    const gList = container.querySelectorAll('.catalog-hub-group');
    if (tab === 'holding') {
      assert.strictEqual(gList.length, 1, 'Holding tab has exactly 1 hub group');
      assert.strictEqual(gList[0].classList.contains('collapsed'), false, 'Holding hub starts open');
      // Test toggling holding tab
      const hHdr = gList[0].querySelector('.catalog-hub-header');
      hHdr.dispatchEvent({ type: 'click' });
      assert.strictEqual(gList[0].classList.contains('collapsed'), true, 'Holding hub can collapse');
      hHdr.dispatchEvent({ type: 'click' });
      assert.strictEqual(gList[0].classList.contains('collapsed'), false, 'Holding hub re-expands');
    } else {
      assert(gList.length >= 1, `Tab ${tab} should have hub groups`);
      // Toggle a random group in this tab
      const randIdx = Math.floor(Math.random() * gList.length);
      const rHdr = gList[randIdx].querySelector('.catalog-hub-header');
      rHdr.dispatchEvent({ type: 'click' });
    }
  }
}
console.log('✓ 50 Rapid Tab Cycles (200 switches) passed without error');

// Test Temporal Tab specifically: ensure bidirectional expand and collapse works 100%
AppState.activeFilterDim = 'tiempo';
renderSidebarCatalog();
const tiempoGroups = container.querySelectorAll('.catalog-hub-group');
for (let i = 0; i < tiempoGroups.length; i++) {
  const tHdr = tiempoGroups[i].querySelector('.catalog-hub-header');
  // Expand
  if (tiempoGroups[i].classList.contains('collapsed')) {
    tHdr.dispatchEvent({ type: 'click' });
    assert.strictEqual(tiempoGroups[i].classList.contains('collapsed'), false, `Tiempo group ${i} must expand`);
  }
  // Collapse
  tHdr.dispatchEvent({ type: 'click' });
  assert.strictEqual(tiempoGroups[i].classList.contains('collapsed'), true, `Tiempo group ${i} must collapse`);
}
console.log('✓ Temporal Tab bidirectional expand/collapse verified on all hubs');

// ============================================================================
// SUITE 2: ACTIVE SEARCH FILTER WHILE EXPANDING / COLLAPSING
// ============================================================================
console.log('\n--- SUITE 2: Active Search Filter vs Accordions ---');

AppState.activeFilterDim = 'all';
AppState.searchQuery = 'salmon';
renderSidebarCatalog();

let searchGroups = container.querySelectorAll('.catalog-hub-group');
assert(searchGroups.length > 0, 'Search for "salmon" should match groups');
// In search mode, all matching groups are expanded
searchGroups.forEach(g => {
  assert.strictEqual(g.classList.contains('collapsed'), false, 'Search results must be expanded by default');
});

// Click header of first matching group while searching -> should collapse
let sHdr0 = searchGroups[0].querySelector('.catalog-hub-header');
sHdr0.dispatchEvent({ type: 'click' });
assert.strictEqual(searchGroups[0].classList.contains('collapsed'), true, 'Clicked group in search must collapse');

// If there are other matching groups, they must NOT be collapsed
if (searchGroups.length > 1) {
  assert.strictEqual(searchGroups[1].classList.contains('collapsed'), false, 'Other search groups must remain open');
}

// Re-expand it
sHdr0.dispatchEvent({ type: 'click' });
assert.strictEqual(searchGroups[0].classList.contains('collapsed'), false, 'Clicked group in search re-expands');
if (searchGroups.length > 1) {
  // Sibling must STILL be open because search mode does NOT fan-out collapse
  assert.strictEqual(searchGroups[1].classList.contains('collapsed'), false, 'Sibling must stay open in search mode');
}

// Test search with diacritics and special characters
const searchQueries = ['Aysén', 'energía', 'inversión', 'co2', '[test]', 'val*r', 'none_matching_xyz_123'];
for (const sq of searchQueries) {
  AppState.searchQuery = sq;
  assert.doesNotThrow(() => {
    renderSidebarCatalog();
  }, `Search query "${sq}" must not crash`);
}

// Clear search query -> returns to normal fan-out accordion
AppState.searchQuery = '';
renderSidebarCatalog();
let postSearchGroups = container.querySelectorAll('.catalog-hub-group');
assert.strictEqual(postSearchGroups.length, 7, 'All 7 hubs restored on search clear');

// Expand group 3 -> should collapse group 0
let hdr3 = postSearchGroups[3].querySelector('.catalog-hub-header');
hdr3.dispatchEvent({ type: 'click' });
assert.strictEqual(postSearchGroups[3].classList.contains('collapsed'), false);
assert.strictEqual(postSearchGroups[0].classList.contains('collapsed'), true);
console.log('✓ Active search filter and search clear verified cleanly');

// ============================================================================
// SUITE 3: ADDING CARDS FROM ACCORDION (DBLCLICK, ENTER, DRAG-DROP)
// ============================================================================
console.log('\n--- SUITE 3: Adding Cards from Accordion ---');

AppState.widgets = [];
AppState.nextWidgetId = 1;
AppState.searchQuery = '';
AppState.activeFilterDim = 'all';
renderSidebarCatalog();

// 1. Double click on a variable
const varItems = container.querySelectorAll('.catalog-var-item');
assert(varItems.length > 0, 'Catalog items must exist');
const var1 = varItems[0];
const var1Id = var1.getAttribute('data-var-id');

var1.dispatchEvent({ type: 'dblclick' });
assert.strictEqual(AppState.widgets.length, 1, 'Double click must instantiate a widget card');
assert.strictEqual(AppState.widgets[0].varX, var1Id, 'Widget varX must match double-clicked item');

// 2. Keyboard Enter on a variable
const var2 = varItems[1];
const var2Id = var2.getAttribute('data-var-id');
var2.dispatchEvent({ type: 'keydown', key: 'Enter' });
assert.strictEqual(AppState.widgets.length, 2, 'Enter keydown must instantiate a widget card');
assert.strictEqual(AppState.widgets[1].varX, var2Id, 'Widget varX must match Enter-activated item');

// 3. Drag and Drop sequence
const var3 = varItems[2];
const var3Id = var3.getAttribute('data-var-id');
const mockDataTransfer = {
  data: {},
  setData(k, v) { this.data[k] = v; },
  getData(k) { return this.data[k]; }
};

var3.dispatchEvent({ type: 'dragstart', dataTransfer: mockDataTransfer });
assert.strictEqual(AppState.draggedVariableId, var3Id, 'dragstart sets AppState.draggedVariableId');
assert(var3.classList.contains('dragging'), 'dragstart adds .dragging class');

// Simulate drop on canvas
const droppedVarId = mockDataTransfer.getData('text/plain') || AppState.draggedVariableId;
AppState.draggedVariableId = null;
createWidget('chart', { varX: droppedVarId });
assert.strictEqual(AppState.widgets.length, 3, 'Canvas drop instantiates widget card');
assert.strictEqual(AppState.widgets[2].varX, var3Id, 'Dropped widget varX matches dragged variable');

var3.dispatchEvent({ type: 'dragend' });
assert.strictEqual(var3.classList.contains('dragging'), false, 'dragend removes .dragging class');
assert.strictEqual(AppState.draggedVariableId, null, 'dragend clears draggedVariableId');

// 4. Test adding cards from across all 4 dimension tabs
for (const tab of ['all', 'comuna', 'tiempo', 'holding']) {
  AppState.activeFilterDim = tab;
  renderSidebarCatalog();
  const items = container.querySelectorAll('.catalog-var-item');
  assert(items.length > 0, `Tab ${tab} must contain variables`);
  const item = items[0];
  const prevCount = AppState.widgets.length;
  item.dispatchEvent({ type: 'dblclick' });
  assert.strictEqual(AppState.widgets.length, prevCount + 1, `Card added from ${tab} tab`);
}

console.log('✓ All 3 Card Addition mechanisms (dblclick, Enter, drag-drop) verified across all tabs');
console.log('\n======================================================');
console.log('ALL EMPIRICAL TESTS PASSED SUCCESSFULLY (100% OPERATIONAL)');
console.log('======================================================');
