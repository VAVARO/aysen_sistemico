/**
 * ==============================================================================
 * ATLAS TERRITORIAL PROSPECTIVO DE AYSÉN — MOTOR SISTÉMICO Y MODELO DE DATOS
 * ==============================================================================
 * WP_07: Rediseño Fino de Experiencia de Usuario, Asistente "¿Qué estás buscando?"
 * y Modelo de Tablas Interactivo (Estilo Power BI)
 * 
 * Reglas de diseño aplicadas:
 *   - Apple WWDC Fluid Interfaces & Pointer-Down Immediate Response
 *   - Emil Kowalski Animation Decision Framework (0ms keyboard search, custom cubic-bezier)
 *   - Power BI Model View (Schema Boxes, Foreign Keys, Click-to-Join, Excel CSV BOM)
 * ==============================================================================
 */

(function () {
    'use strict';

    // Estado global del subsistema
    window.AysenSystemicData = {
        wp01: null,
        wp02: null,
        wp03: null,
        wp04: null,
        wp05: null,
        wp06: null,
        isLoaded: false
    };

    let systemicMarkersGroup = null;
    let activeMapLayers = {
        gob: true,
        energy: false,
        mar: true,
        econ: false,
        turismo: true,
        social: false
    };

    let activeDimension = 'gob';
    let currentModelPreset = 'preset_sinim_salmon_turismo';
    let selectedModelTables = ['comunas', 'wp01', 'wp03_holdings', 'wp06'];

    // ==========================================================================
    // 1. CARGA RESILIENTE DE LOS 6 DATASETS DEL DATA LAKE
    // ==========================================================================
    async function fetchJsonDataset(path) {
        try {
            const resp = await fetch(path);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return await resp.json();
        } catch (err) {
            console.warn(`[Systemic Atlas] Advertencia cargando ${path}:`, err);
            return null;
        }
    }

    async function initSystemicDataLake() {
        console.log('[Systemic Atlas] Iniciando ingesta de los 6 datasets + holdings...');
        const [wp01, wp02, wp03, wp04, wp05, wp06, holdingsData] = await Promise.all([
            fetchJsonDataset('data/systemic/01_gob_poder_finanzas.json'),
            fetchJsonDataset('data/systemic/02_energia_combustibles_telecom.json'),
            fetchJsonDataset('data/systemic/03_concesiones_tierra_mar.json'),
            fetchJsonDataset('data/systemic/04_inversion_seia_economia.json'),
            fetchJsonDataset('data/systemic/05_social_salud_educacion_riesgos.json'),
            fetchJsonDataset('data/systemic/06_turismo_sernatur_conaf.json'),
            fetchJsonDataset('data/raw/territorio_concesiones/holdings_salmoneros_ruts_aysen.json')
        ]);

        window.AysenSystemicData.wp01 = wp01;
        window.AysenSystemicData.wp02 = wp02;
        window.AysenSystemicData.wp03 = wp03;
        window.AysenSystemicData.wp04 = wp04;
        window.AysenSystemicData.wp05 = wp05;
        window.AysenSystemicData.wp06 = wp06;
        window.AysenSystemicData.holdings = holdingsData;
        window.AysenSystemicData.isLoaded = true;

        console.log('[Systemic Atlas] Datasets listos en memoria.');

        // Inicializar componentes una vez cargados los datos
        initMapLayers();
        initSearchAssistant();
        renderActiveComunaDimensions();
        renderModelView();
    }

    // ==========================================================================
    // 2. CAPAS GEORREFERENCIADAS EN EL MAPA (140+ NODOS SISTÉMICOS)
    // ==========================================================================
    const LAYER_CONFIG = {
        gob: {
            label: 'Municipios & GORE',
            color: '#19483A',
            icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"/></svg>',
            getNodes: (d) => d.wp01 ? d.wp01.nodos_georreferenciados || [] : []
        },
        energy: {
            label: 'Centrales & FOA',
            color: '#9E4300',
            icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
            getNodes: (d) => d.wp02 ? d.wp02.nodos_georreferenciados || [] : []
        },
        mar: {
            label: 'Holdings Salmoneros & Caletas',
            color: '#0E58A8',
            icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24"/></svg>',
            getNodes: (d) => d.wp03 ? d.wp03.nodos_georreferenciados || [] : []
        },
        econ: {
            label: 'Inversión SEIA',
            color: '#374151',
            icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
            getNodes: (d) => d.wp04 ? d.wp04.nodos_georreferenciados || [] : []
        },
        turismo: {
            label: 'Turismo SERNATUR & ZOIT',
            color: '#0F766E',
            icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>',
            getNodes: (d) => d.wp06 ? d.wp06.nodos_georreferenciados || [] : []
        },
        social: {
            label: 'Salud, Volcanes & Sismos',
            color: '#6D28D9',
            icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
            getNodes: (d) => d.wp05 ? d.wp05.nodos_georreferenciados || [] : []
        }
    };

    function initMapLayers() {
        if (!window.map || typeof L === 'undefined') {
            setTimeout(initMapLayers, 300);
            return;
        }

        if (!systemicMarkersGroup) {
            systemicMarkersGroup = L.layerGroup().addTo(window.map);
        }

        // Configuración táctil en móviles para evitar bloqueo de scroll de página
        if (window.innerWidth <= 768 && window.map) {
            if (window.map.scrollWheelZoom) window.map.scrollWheelZoom.disable();
            if (window.map.touchZoom) window.map.touchZoom.enable();
            const mapContainer = window.map.getContainer ? window.map.getContainer() : null;
            if (mapContainer) {
                mapContainer.style.touchAction = 'pan-y';
            }
        }

        renderMapLayerControl();
        updateMapMarkers();
    }

    function renderMapLayerControl() {
        let bar = document.getElementById('mapSystemicLayerBar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'mapSystemicLayerBar';
            bar.className = 'map-systemic-layer-bar';
            const mapContainer = document.getElementById('map');
            if (mapContainer) mapContainer.appendChild(bar);
        }

        let html = '';
        for (const [key, conf] of Object.entries(LAYER_CONFIG)) {
            const nodes = conf.getNodes(window.AysenSystemicData);
            const isActive = activeMapLayers[key];
            html += `
                <button type="button" class="layer-toggle-pill ${isActive ? 'active' : ''}" data-layer="${key}" onclick="window.toggleSystemicMapLayer('${key}')">
                    ${conf.icon}
                    <span>${conf.label}</span>
                    <span class="layer-count-badge">${nodes.length}</span>
                </button>
            `;
        }
        bar.innerHTML = html;
    }

    window.toggleSystemicMapLayer = function (key) {
        activeMapLayers[key] = !activeMapLayers[key];
        renderMapLayerControl();
        updateMapMarkers();
    };

    function updateMapMarkers() {
        if (!systemicMarkersGroup || !window.map) return;
        systemicMarkersGroup.clearLayers();

        // Ocultar marcadores antiguos (pasos fronterizos / estaciones) cuando se filtre una capa como SEIA
        const activeCount = Object.values(activeMapLayers).filter(Boolean).length;
        if (window.map && window.markersGroup) {
            if (activeMapLayers.econ && activeCount === 1) {
                if (window.map.hasLayer(window.markersGroup)) {
                    window.map.removeLayer(window.markersGroup);
                }
            } else if (activeCount > 0 && !activeMapLayers.gob && !activeMapLayers.mar && !activeMapLayers.turismo) {
                if (window.map.hasLayer(window.markersGroup)) {
                    window.map.removeLayer(window.markersGroup);
                }
            } else if (activeCount === 0) {
                if (!window.map.hasLayer(window.markersGroup)) {
                    window.map.addLayer(window.markersGroup);
                }
            }
        }

        for (const [key, conf] of Object.entries(LAYER_CONFIG)) {
            if (!activeMapLayers[key]) continue;
            const nodes = conf.getNodes(window.AysenSystemicData);

            nodes.forEach(node => {
                if (!node.lat || !node.lng) return;

                const marker = L.circleMarker([node.lat, node.lng], {
                    radius: 6,
                    fillColor: conf.color,
                    color: '#FFFFFF',
                    weight: 2,
                    opacity: 0.95,
                    fillOpacity: 0.85
                });

                const popupHtml = `
                    <div style="font-family: 'Space Grotesk', -apple-system, sans-serif; min-width: 200px; padding: 4px 2px;">
                        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${conf.color}; font-weight: 700; text-transform: uppercase;">
                            ${node.tipo || conf.label}
                        </div>
                        <div style="font-size: 14px; font-weight: 700; color: #141618; margin: 3px 0 6px;">
                            ${node.nombre || node.id}
                        </div>
                        <div style="font-size: 11px; color: #4A515D; line-height: 1.4;">
                            ${formatNodeAttributes(node.atributos)}
                        </div>
                        ${node.source_url ? `
                            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #E3E4DC;">
                                <a href="${node.source_url}" target="_blank" rel="noopener noreferrer" style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #0E58A8; text-decoration: none; font-weight: 600;">
                                    ↗ Ver Fuente Oficial Verificada
                                </a>
                            </div>
                        ` : ''}
                    </div>
                `;

                marker.bindPopup(popupHtml);
                systemicMarkersGroup.addLayer(marker);
            });
        }
    }

    function formatNodeAttributes(attrs) {
        if (!attrs) return '';
        return Object.entries(attrs)
            .slice(0, 3)
            .map(([k, v]) => `<strong>${formatAttrKey(k)}:</strong> ${v}`)
            .join('<br>');
    }

    function formatAttrKey(key) {
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // ==========================================================================
    // 3. ASISTENTE INICIAL "¿QUÉ ESTÁS BUSCANDO EN AYSÉN?" (MODAL & BUSCADOR 0MS)
    // ==========================================================================
    function initSearchAssistant() {
        createAssistantModalDOM();
        setupKeyboardShortcuts();
    }

    function createAssistantModalDOM() {
        if (document.getElementById('searchAssistantBackdrop')) return;

        const backdrop = document.createElement('div');
        backdrop.id = 'searchAssistantBackdrop';
        backdrop.className = 'assistant-backdrop';

        backdrop.innerHTML = `
            <div class="assistant-modal" role="dialog" aria-modal="true" aria-labelledby="assistantModalTitle">
                <div class="assistant-modal-header">
                    <div class="assistant-modal-title-wrap">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#141618" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <h2 class="assistant-modal-title" id="assistantModalTitle">¿Qué estás buscando en Aysén?</h2>
                    </div>
                    <button type="button" class="assistant-modal-close-btn" aria-label="Cerrar modal" onclick="window.closeSearchAssistant()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="assistant-search-box">
                    <div class="assistant-search-input-wrap">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" id="universalSearchInput" class="assistant-search-input" placeholder="Buscar al instante por RUT (86.247.400-7), empresa, comuna, alcalde, central o proyecto..." autocomplete="off">
                    </div>
                    <div class="assistant-search-hint">
                        <span>Búsquedas frecuentes:</span>
                        <span class="search-sample-tag" onclick="window.applyAssistantQuickSearch('AquaChile')">AquaChile</span>
                        <span class="search-sample-tag" onclick="window.applyAssistantQuickSearch('86.247.400-7')">86.247.400-7</span>
                        <span class="search-sample-tag" onclick="window.applyAssistantQuickSearch('Cisnes')">Cisnes</span>
                        <span class="search-sample-tag" onclick="window.applyAssistantQuickSearch('Queulat')">Queulat</span>
                        <span class="search-sample-tag" onclick="window.applyAssistantQuickSearch('Edelaysen')">Edelaysen</span>
                        <span class="search-sample-tag" onclick="window.applyAssistantQuickSearch('SINIM')">SINIM</span>
                    </div>
                </div>

                <div class="assistant-modal-body">
                    <!-- Vista A: Resultados de búsqueda instantánea (0ms) -->
                    <div id="assistantSearchResults" class="assistant-results-container"></div>

                    <!-- Vista B: 5 Rutas Guiadas en 2 Pasos -->
                    <div id="assistantGuidedRoutes" class="assistant-routes-grid">
                        <!-- Ruta 1 -->
                        <div class="assistant-route-card">
                            <div class="route-card-header" onclick="window.navigateRoute('comunas')">
                                <div class="route-card-title-group">
                                    <div class="route-icon-box" style="background:#EBF3ED; color:#19483A;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"/></svg>
                                    </div>
                                    <div>
                                        <div class="route-card-title">1. Radiografía de las 10 Comunas</div>
                                        <div class="route-card-desc">Censo 2024, conectividad Ruta 7, pobreza CASEN y equipamiento comunal.</div>
                                    </div>
                                </div>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A8494"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                            <div class="route-suboptions-tray">
                                <span class="route-suboption-pill" onclick="window.selectAndCloseComuna('CL-XI-01')">Coyhaique</span>
                                <span class="route-suboption-pill" onclick="window.selectAndCloseComuna('CL-XI-03')">Puerto Aysén</span>
                                <span class="route-suboption-pill" onclick="window.selectAndCloseComuna('CL-XI-04')">Cisnes</span>
                                <span class="route-suboption-pill" onclick="window.selectAndCloseComuna('CL-XI-05')">Guaitecas</span>
                                <span class="route-suboption-pill" onclick="window.selectAndCloseComuna('CL-XI-07')">Río Ibáñez</span>
                                <span class="route-suboption-pill" onclick="window.selectAndCloseComuna('CL-XI-10')">Caleta Tortel</span>
                                <span class="route-suboption-pill" onclick="window.selectAndCloseComuna('CL-XI-09')">Villa O'Higgins</span>
                            </div>
                        </div>

                        <!-- Ruta 2 -->
                        <div class="assistant-route-card">
                            <div class="route-card-header">
                                <div class="route-card-title-group">
                                    <div class="route-icon-box" style="background:#EBF2FA; color:#0E58A8;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24"/></svg>
                                    </div>
                                    <div>
                                        <div class="route-card-title">2. Empresas, Concesiones, Inversión y Poder Político</div>
                                        <div class="route-card-desc">12 holdings y 42 RUTs salmoneros, SEIA, minería y finanzas municipales SINIM.</div>
                                    </div>
                                </div>
                            </div>
                            <div class="route-suboptions-tray">
                                <span class="route-suboption-pill" onclick="window.navigateModelQuickJoin('preset_holdings_ruts')">Matriz 12 Holdings & 42 RUTs Salmoneros</span>
                                <span class="route-suboption-pill" onclick="window.navigateModelQuickJoin('preset_seia_empleo_casen')">Inversión SEIA & Empleo SII</span>
                                <span class="route-suboption-pill" onclick="window.navigateModelQuickJoin('preset_sinim_salmon_turismo')">Finanzas SINIM × Holdings Salmoneros</span>
                                <span class="route-suboption-pill" onclick="window.applyAssistantQuickSearch('Minería')">Concesiones Mineras & BBNN</span>
                            </div>
                        </div>

                        <!-- Ruta 3 -->
                        <div class="assistant-route-card">
                            <div class="route-card-header">
                                <div class="route-card-title-group">
                                    <div class="route-icon-box" style="background:#E6F4F2; color:#0F766E;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
                                    </div>
                                    <div>
                                        <div class="route-card-title">3. Turismo SERNATUR, Energía, Telecom y Servicios</div>
                                        <div class="route-card-desc">Prestadores inscritos, ZOIT, ocupación EMAT, sistemas eléctricos y salud.</div>
                                    </div>
                                </div>
                            </div>
                            <div class="route-suboptions-tray">
                                <span class="route-suboption-pill" onclick="window.applyAssistantQuickSearch('ZOIT')">Zonas de Interés Turístico (ZOIT)</span>
                                <span class="route-suboption-pill" onclick="window.applyAssistantQuickSearch('Parque Nacional')">Parques SNASPE & EMAT</span>
                                <span class="route-suboption-pill" onclick="window.navigateModelQuickJoin('preset_energia_salud')">Energía Aislada × Salud Aeromédica</span>
                                <span class="route-suboption-pill" onclick="window.applyAssistantQuickSearch('Fibra Óptica')">Conectividad Fibra Óptica Austral (FOA)</span>
                            </div>
                        </div>

                        <!-- Ruta 4 -->
                        <div class="assistant-route-card" onclick="window.navigateRoute('cross')">
                            <div class="route-card-header">
                                <div class="route-card-title-group">
                                    <div class="route-icon-box" style="background:#FAF0E6; color:#9E4300;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                                    </div>
                                    <div>
                                        <div class="route-card-title">4. Agua, Clima, Riesgos Naturales y Proyecciones 2030–2035</div>
                                        <div class="route-card-desc">Ríos Baker y Simpson, glaciares GLOF, sismos USGS, volcanes y 18 series prospectivas.</div>
                                    </div>
                                </div>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A8494"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                        </div>

                        <!-- Ruta 5 -->
                        <div class="assistant-route-card" onclick="window.navigateRoute('model')">
                            <div class="route-card-header">
                                <div class="route-card-title-group">
                                    <div class="route-icon-box" style="background:#F2EDFA; color:#6D28D9;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                                    </div>
                                    <div>
                                        <div class="route-card-title">5. Relaciones entre Bases de Datos (Modelo Estilo Power BI)</div>
                                        <div class="route-card-desc">Diagrama de cajas relacionales, llaves de unión (comuna_ine, cuenca, holding) y cruces en vivo con exportación a Excel.</div>
                                    </div>
                                </div>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A8494"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);

        // Event listener para búsqueda universal instantánea (0ms de latencia)
        const searchInput = document.getElementById('universalSearchInput');
        searchInput.addEventListener('input', function () {
            executeUniversalInstantSearch(this.value.trim());
        });

        // Cerrar haciendo clic en el backdrop
        backdrop.addEventListener('click', function (e) {
            if (e.target === backdrop) window.closeSearchAssistant();
        });
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function (e) {
            // Tecla escape cierra el modal
            if (e.key === 'Escape') {
                window.closeSearchAssistant();
            }
            // Atajo para abrir búsqueda: '/' o 'k' con ctrl/cmd
            if (((e.key === 'k' || e.key === 'f') && (e.ctrlKey || e.metaKey)) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                window.openSearchAssistant();
            }
        });
    }

    window.openSearchAssistant = function () {
        const backdrop = document.getElementById('searchAssistantBackdrop');
        if (!backdrop) return;
        backdrop.classList.add('active');
        const input = document.getElementById('universalSearchInput');
        if (input) {
            setTimeout(() => input.focus(), 50);
        }
    };

    window.closeSearchAssistant = function () {
        const backdrop = document.getElementById('searchAssistantBackdrop');
        if (!backdrop) return;
        backdrop.classList.remove('active');
    };

    window.applyAssistantQuickSearch = function (text) {
        const input = document.getElementById('universalSearchInput');
        if (!input) return;
        input.value = text;
        executeUniversalInstantSearch(text);
        input.focus();
    };

    window.navigateRoute = function (routeKey) {
        window.closeSearchAssistant();
        if (typeof window.switchSidebarView === 'function') {
            if (routeKey === 'comunas') window.switchSidebarView('station');
            else if (routeKey === 'cross') window.switchSidebarView('cross');
            else if (routeKey === 'model') window.switchSidebarView('model');
        }
    };

    window.selectAndCloseComuna = function (comunaCode) {
        window.closeSearchAssistant();
        if (typeof window.switchSidebarView === 'function') {
            window.switchSidebarView('station');
        }
        if (typeof window.selectComuna === 'function') {
            window.selectComuna(comunaCode);
        }
    };

    window.navigateModelQuickJoin = function (presetId) {
        window.closeSearchAssistant();
        if (typeof window.switchSidebarView === 'function') {
            window.switchSidebarView('model');
        }
        window.applyModelPreset(presetId);
    };

    // Buscador universal instantáneo (0ms)
    function executeUniversalInstantSearch(query) {
        const resultsEl = document.getElementById('assistantSearchResults');
        const routesEl = document.getElementById('assistantGuidedRoutes');
        if (!resultsEl || !routesEl) return;

        if (!query || query.length < 2) {
            resultsEl.classList.remove('active');
            resultsEl.innerHTML = '';
            routesEl.style.display = 'grid';
            return;
        }

        routesEl.style.display = 'none';
        resultsEl.classList.add('active');

        const q = query.toLowerCase();
        const matches = {
            comunas: [],
            holdings: [],
            ruts: [],
            nodos: [],
            seia: []
        };

        // 1. Buscar en Comunas
        if (window.comunasData && Array.isArray(window.comunasData)) {
            window.comunasData.forEach(c => {
                if (c.nombre_comuna.toLowerCase().includes(q) || c.cabecera.toLowerCase().includes(q) || c.codigo_comuna.toLowerCase().includes(q) || c.comuna_ine.includes(q)) {
                    matches.comunas.push({
                        title: c.nombre_comuna,
                        subtitle: `Cabecera: ${c.cabecera} · Censo: ${c.poblacion_censo_2024.toLocaleString('es-CL')} hab`,
                        badge: c.codigo_comuna,
                        action: () => window.selectAndCloseComuna(c.codigo_comuna)
                    });
                }
            });
        }

        // 2. Buscar en Holdings y RUTs Salmoneros
        const holdingsData = window.AysenSystemicData.holdings || (window.AysenSystemicData.wp03 && window.AysenSystemicData.wp03.holdings_salmoneros_matriz_ruts ? { holdings: window.AysenSystemicData.wp03.holdings_salmoneros_matriz_ruts } : null);
        if (holdingsData && holdingsData.holdings) {
            holdingsData.holdings.forEach(h => {
                const hName = h.empresa_madre || h.nombre_fantasia || '';
                const matchHolding = hName.toLowerCase().includes(q) || (h.grupo_empresarial && h.grupo_empresarial.toLowerCase().includes(q));

                if (matchHolding) {
                    matches.holdings.push({
                        title: `${h.nombre_fantasia} (${h.empresa_madre})`,
                        subtitle: `${h.grupo_empresarial} · ~${h.concesiones_estimadas_aysen} concesiones (${h.pct_concesiones_regional}% regional)`,
                        badge: 'Holding Salmonero',
                        action: () => window.navigateModelQuickJoin('preset_holdings_ruts')
                    });
                }

                // Buscar dentro de las filiales y RUTs
                if (h.filiales_y_ruts) {
                    h.filiales_y_ruts.forEach(filial => {
                        const cleanRut = (filial.rut || '').replace(/[\.\-]/g, '').toLowerCase();
                        const cleanQuery = q.replace(/[\.\-]/g, '');

                        if (filial.razon_social.toLowerCase().includes(q) || cleanRut.includes(cleanQuery) || (filial.rut && filial.rut.toLowerCase().includes(q))) {
                            matches.ruts.push({
                                title: `${filial.razon_social} (RUT: ${filial.rut})`,
                                subtitle: `Filial de ${h.nombre_fantasia} · ${filial.rol_societario}`,
                                badge: filial.rut,
                                action: () => window.navigateModelQuickJoin('preset_holdings_ruts')
                            });
                        }
                    });
                }
            });
        }

        // 3. Buscar en Nodos Georreferenciados (150+ nodos)
        for (const [layerKey, conf] of Object.entries(LAYER_CONFIG)) {
            const nodes = conf.getNodes(window.AysenSystemicData);
            nodes.forEach(n => {
                const nName = n.nombre || n.id || '';
                if (nName.toLowerCase().includes(q) || (n.tipo && n.tipo.toLowerCase().includes(q))) {
                    matches.nodos.push({
                        title: nName,
                        subtitle: `${n.tipo || conf.label} · Comuna: ${n.codigo_comuna}`,
                        badge: conf.label,
                        action: () => {
                            window.closeSearchAssistant();
                            if (window.map && n.lat && n.lng) {
                                window.map.flyTo([n.lat, n.lng], 11, { duration: 0.8 });
                            }
                        }
                    });
                }
            });
        }

        // Renderizar resultados
        let html = '';
        const totalCount = matches.comunas.length + matches.holdings.length + matches.ruts.length + matches.nodos.length;

        if (totalCount === 0) {
            html = `
                <div style="padding: 32px 16px; text-align: center; color: #707A8A;">
                    <div style="font-family: var(--font-serif, Georgia, serif); font-size: 16px; color: #141618; margin-bottom: 4px;">No se encontraron resultados para "${query}"</div>
                    <div style="font-size: 12px;">Intenta buscando por comuna, holding (AquaChile, Mowi), RUT o atractivo turístico.</div>
                </div>
            `;
        } else {
            html += `<div style="font-family: var(--font-mono, monospace); font-size: 11px; color: #586375; margin-bottom: 12px;">${totalCount} resultados instantáneos:</div>`;

            if (matches.comunas.length > 0) {
                html += renderResultGroup('Comunas de Aysén', matches.comunas);
            }
            if (matches.holdings.length > 0) {
                html += renderResultGroup('Holdings Salmoneros (Empresas Madres)', matches.holdings);
            }
            if (matches.ruts.length > 0) {
                html += renderResultGroup('Filiales & RUTs Titulares', matches.ruts);
            }
            if (matches.nodos.length > 0) {
                html += renderResultGroup('Infraestructura, Turismo y Nodos Territoriales', matches.nodos.slice(0, 8));
            }
        }

        resultsEl.innerHTML = html;

        // Asignar listeners a los ítems renderizados
        const items = resultsEl.querySelectorAll('.search-result-item');
        items.forEach((item, index) => {
            const allItems = [
                ...matches.comunas,
                ...matches.holdings,
                ...matches.ruts,
                ...matches.nodos.slice(0, 8)
            ];
            if (allItems[index] && allItems[index].action) {
                item.addEventListener('click', allItems[index].action);
            }
        });
    }

    function renderResultGroup(title, list) {
        return `
            <div class="search-result-group">
                <div class="search-result-group-title">${title}</div>
                ${list.map(item => `
                    <div class="search-result-item">
                        <div class="search-result-main">
                            <div class="search-result-title">${item.title}</div>
                            <div class="search-result-subtitle">${item.subtitle}</div>
                        </div>
                        <span class="search-result-badge">${item.badge}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ==========================================================================
    // 4. DIMENSIONES SISTÉMICAS EN RADIOGRAFÍA COMUNAL (#viewStationContainer)
    // ==========================================================================
    function renderActiveComunaDimensions() {
        const container = document.getElementById('comunaSystemicExplorerContainer');
        if (!container) return;

        const currentComunaCode = window.activeComuna ? window.activeComuna.codigo_comuna : 'CL-XI-01';
        const currentComunaIne = window.activeComuna ? String(window.activeComuna.comuna_ine) : '11101';
        const comunaName = window.activeComuna ? window.activeComuna.nombre_comuna : 'Coyhaique';

        const dimensions = [
            { id: 'gob', num: 'Dimensión 1', label: 'Gobernanza & Finanzas SINIM' },
            { id: 'energy', num: 'Dimensión 2', label: 'Energía & Telecom FOA' },
            { id: 'mar', num: 'Dimensión 3', label: 'Concesiones, RUTs & Tierra' },
            { id: 'econ', num: 'Dimensión 4', label: 'Inversión SEIA & Empleo' },
            { id: 'turismo', num: 'Dimensión 5', label: 'Turismo SERNATUR & ZOIT' },
            { id: 'social', num: 'Dimensión 6', label: 'Salud, Riesgos & USGS' },
        ];

        let html = `
            <div class="comuna-systemic-explorer">
                <div class="comuna-systemic-header">
                    <div class="comuna-systemic-title">Dimensiones Sistémicas: ${comunaName}</div>
                    <button type="button" class="comuna-expand-btn btn-tactile" onclick="window.toggleDrawerExpanded()">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                        <span>Ampliar Panel (820px)</span>
                    </button>
                </div>

                <div class="dim-tabs-strip">
                    ${dimensions.map(d => `
                        <button type="button" class="dim-tab-btn ${activeDimension === d.id ? 'active' : ''}" onclick="window.switchComunaDimension('${d.id}')">
                            <span class="dim-num">${d.num}</span>
                            <span>${d.label}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="dim-card-panel">
                    ${renderDimensionContent(activeDimension, currentComunaIne, currentComunaCode)}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    function renderDimensionContent(dimId, comunaIne, comunaCode) {
        const sys = window.AysenSystemicData;

        if (dimId === 'gob') {
            const data = getComunaDataInDataset(sys.wp01, comunaIne);
            const aut = data ? data.autoridades || {} : {};
            const fin = data ? data.finanzas_sinim || {} : {};
            const inv = data ? data.inversion_publica || {} : {};

            return `
                <div class="dim-card-meta-row">
                    <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: #19483A;">GOBERNANZA LOCAL Y FINANZAS MUNICIPALES (SINIM / SUBDERE / BCN)</span>
                    <a href="https://www.sinim.gov.cl" target="_blank" rel="noopener noreferrer" class="dim-source-link">↗ Fuente SINIM</a>
                </div>
                <div class="dim-stats-grid">
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Alcalde / Alcaldesa</div>
                        <div class="dim-stat-val" style="font-size: 14px;">${aut.alcalde_nombre || 'N/D'}</div>
                        <div class="dim-stat-sub">${aut.alcalde_partido_pacto || ''}</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Presupuesto Municipal</div>
                        <div class="dim-stat-val tabular-numbers">$${(fin.presupuesto_municipal_anual_mclp || 0).toLocaleString('es-CL')} M$</div>
                        <div class="dim-stat-sub">Ingresos propios: $${(fin.ingresos_propios_mclp || 0).toLocaleString('es-CL')} M$</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Dependencia FCM</div>
                        <div class="dim-stat-val tabular-numbers">${fin.dependencia_fondo_comun_municipal_pct || 0}%</div>
                        <div class="dim-stat-sub">Aporte Fondo Común Municipal</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Inversión FNDR Regional</div>
                        <div class="dim-stat-val tabular-numbers">$${(inv.inversion_fndr_gore_mclp || 0).toLocaleString('es-CL')} M$</div>
                        <div class="dim-stat-sub">Cartera de proyectos GORE</div>
                    </div>
                </div>
            `;
        }

        if (dimId === 'energy') {
            const data = getComunaDataInDataset(sys.wp02, comunaIne);
            const ele = data ? data.sistema_electrico || {} : {};
            const comb = data ? data.combustibles || {} : {};
            const tel = data ? data.telecomunicaciones || {} : {};

            return `
                <div class="dim-card-meta-row">
                    <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: #9E4300;">ENERGÍA, COMBUSTIBLES Y TELECOMUNICACIONES (CNE / SUBTEL)</span>
                    <a href="https://www.cne.cl" target="_blank" rel="noopener noreferrer" class="dim-source-link">↗ Fuente CNE</a>
                </div>
                <div class="dim-stats-grid">
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Subsistema Eléctrico</div>
                        <div class="dim-stat-val" style="font-size: 14px;">${ele.nombre_sistema || 'Aislado'}</div>
                        <div class="dim-stat-sub">Operador: ${ele.empresa_distribuidora || 'Edelaysen'}</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Potencia Instalada</div>
                        <div class="dim-stat-val tabular-numbers">${ele.potencia_instalada_mw || 0} MW</div>
                        <div class="dim-stat-sub">Matriz: ${ele.tipo_generacion_predominante || 'Térmica/Hidro'}</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Gasolina 93 / Diésel</div>
                        <div class="dim-stat-val tabular-numbers">$${comb.precio_gasolina_93_promedio_clp || 0} / $${comb.precio_diesel_promedio_clp || 0}</div>
                        <div class="dim-stat-sub">Por litro al consumidor</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Fibra Óptica Austral</div>
                        <div class="dim-stat-val" style="font-size: 13px;">${tel.conexion_troncal_foa ? 'Conectado (FOA)' : 'Microondas / Satélite'}</div>
                        <div class="dim-stat-sub">4G/5G: ${Array.isArray(tel.operadores_moviles_4g_5g) ? tel.operadores_moviles_4g_5g.join(', ') : 'Operativo'}</div>
                    </div>
                </div>
            `;
        }

        if (dimId === 'mar') {
            const data = getComunaDataInDataset(sys.wp03, comunaIne);
            const acu = data ? data.concesiones_acuicolas || {} : {};
            const min = data ? data.concesiones_mineras || {} : {};
            const tier = data ? data.tenencia_tierra_conservacion || {} : {};

            return `
                <div class="dim-card-meta-row">
                    <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: #0E58A8;">CONCESIONES ACUÍCOLAS, HOLDINGS Y TIERRA (SUBPESCA / SERNAGEOMIN)</span>
                    <a href="https://www.subpesca.cl" target="_blank" rel="noopener noreferrer" class="dim-source-link">↗ Fuente SUBPESCA</a>
                </div>
                <div class="dim-stats-grid">
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Concesiones Salmoneras</div>
                        <div class="dim-stat-val tabular-numbers">${acu.concesiones_otorgadas_total || 0}</div>
                        <div class="dim-stat-sub">En trámite: ${acu.concesiones_en_tramite || 0}</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Barrios Sanitarios (ACS)</div>
                        <div class="dim-stat-val" style="font-size: 13px;">${Array.isArray(acu.barrios_acs_asociados) ? acu.barrios_acs_asociados.slice(0, 3).join(', ') : 'N/A'}</div>
                        <div class="dim-stat-sub">Agrupaciones de Concesiones</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Superficie SNASPE</div>
                        <div class="dim-stat-val tabular-numbers">${tier.superficie_snaspe_pct || 0}%</div>
                        <div class="dim-stat-sub">Áreas protegidas del Estado</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Concesiones Mineras</div>
                        <div class="dim-stat-val tabular-numbers">${min.concesiones_explotacion_activas || 0} exp. / ${min.concesiones_exploracion_activas || 0} expl.</div>
                        <div class="dim-stat-sub">Catastro SERNAGEOMIN</div>
                    </div>
                </div>
            `;
        }

        if (dimId === 'econ') {
            const data = getComunaDataInDataset(sys.wp04, comunaIne);
            const seia = data ? data.proyectos_seia || {} : {};
            const sii = data ? data.estructura_empresarial_sii || {} : {};
            const emp = data ? data.empleo_y_turismo || {} : {};

            return `
                <div class="dim-card-meta-row">
                    <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: #374151;">INVERSIÓN SEIA, EMPLEO Y ESTRUCTURA EMPRESARIAL (SEA / SII)</span>
                    <a href="https://www.sea.gob.cl" target="_blank" rel="noopener noreferrer" class="dim-source-link">↗ Portal SEIA</a>
                </div>
                <div class="dim-stats-grid">
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Inversión SEIA Aprobada</div>
                        <div class="dim-stat-val tabular-numbers">$${(seia.inversion_aprobada_historica_mm_usd || 0).toLocaleString('es-CL')} MM USD</div>
                        <div class="dim-stat-sub">${seia.proyectos_aprobados_total || 0} proyectos aprobados</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Empresas con Ventas (SII)</div>
                        <div class="dim-stat-val tabular-numbers">${(sii.empresas_con_ventas_total || 0).toLocaleString('es-CL')}</div>
                        <div class="dim-stat-sub">Grandes/Medianas: ${sii.empresas_grandes_y_medianas || 0}</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Trabajadores Dependientes</div>
                        <div class="dim-stat-val tabular-numbers">${(sii.trabajadores_dependientes_total || 0).toLocaleString('es-CL')}</div>
                        <div class="dim-stat-sub">Sueldo medio: $${(emp.ingreso_medio_mensual_clp || 0).toLocaleString('es-CL')}</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Empleo Sector Público</div>
                        <div class="dim-stat-val tabular-numbers">${emp.proporcion_empleo_publico_pct || 0}%</div>
                        <div class="dim-stat-sub">De la fuerza laboral ocupada</div>
                    </div>
                </div>
            `;
        }

        if (dimId === 'turismo') {
            const data = getComunaDataInDataset(sys.wp06, comunaIne);
            const ofe = data ? data.oferta_sernatur || {} : {};
            const dem = data ? data.demanda_emat_visitantes || {} : {};
            const zoi = data ? data.zoit_y_atractivos || {} : {};

            return `
                <div class="dim-card-meta-row">
                    <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: #0F766E;">TURISMO, PRESTADORES SERNATUR, ZOIT Y EMAT (SERNATUR / INE / CONAF)</span>
                    <a href="https://serviciosturisticos.sernatur.cl" target="_blank" rel="noopener noreferrer" class="dim-source-link">↗ Registro SERNATUR</a>
                </div>
                <div class="dim-stats-grid">
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Prestadores SERNATUR</div>
                        <div class="dim-stat-val tabular-numbers">${ofe.prestadores_registrados_total || 0}</div>
                        <div class="dim-stat-sub">Alojamientos: ${ofe.alojamientos_turisticos_sernatur || 0} · Aventura: ${ofe.operadores_turismo_aventura || 0}</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Pernoctaciones EMAT</div>
                        <div class="dim-stat-val tabular-numbers">${(dem.pernoctaciones_anuales_emat || 0).toLocaleString('es-CL')}</div>
                        <div class="dim-stat-sub">Llegadas anuales: ${(dem.llegadas_turistas_anual || 0).toLocaleString('es-CL')}</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Ocupación Estival</div>
                        <div class="dim-stat-val tabular-numbers">${dem.ocupacion_alta_enero_febrero_pct || 0}%</div>
                        <div class="dim-stat-sub">Invierno: ${dem.ocupacion_baja_invierno_pct || 0}%</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">ZOIT & Parques</div>
                        <div class="dim-stat-val" style="font-size: 13px;">${zoi.pertenece_a_zoit ? zoi.nombre_zoit : 'Sin ZOIT'}</div>
                        <div class="dim-stat-sub">Visitantes SNASPE: ${(dem.visitantes_snaspe_conaf_anual || 0).toLocaleString('es-CL')}</div>
                    </div>
                </div>
                ${zoi.atractivos_ancla ? `
                    <div style="font-size: 11px; color: #4B5563; margin-top: 6px;">
                        <strong>Atractivos ancla:</strong> ${zoi.atractivos_ancla.join(' · ')}
                    </div>
                ` : ''}
            `;
        }

        if (dimId === 'social') {
            const data = getComunaDataInDataset(sys.wp05, comunaIne);
            const sal = data ? data.salud_red_asistencial || {} : {};
            const edu = data ? data.educacion_mineduc || {} : {};
            const seg = data ? data.seguridad_cead || {} : {};
            const rie = data ? data.riesgos_ambientales || {} : {};

            return `
                <div class="dim-card-meta-row">
                    <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: #6D28D9;">SALUD, EDUCACIÓN, SEGURIDAD Y RIESGOS (DEIS / MINEDUC / USGS)</span>
                    <a href="https://deis.minsal.cl" target="_blank" rel="noopener noreferrer" class="dim-source-link">↗ Fuente DEIS</a>
                </div>
                <div class="dim-stats-grid">
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Hospital Derivación</div>
                        <div class="dim-stat-val" style="font-size: 13px;">${sal.hospital_base_derivacion || 'Hospital Regional Coyhaique'}</div>
                        <div class="dim-stat-sub">Traslado terrestre: ${sal.tiempo_traslado_terrestre_urgencia_horas || 0} hrs</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Evacuación Aeromédica</div>
                        <div class="dim-stat-val" style="font-size: 13px;">${sal.requiere_evacuacion_aeromedica_critica ? 'Frecuente (SAMU / FACh)' : 'Terrestre habilitada'}</div>
                        <div class="dim-stat-sub">Postas rurales: ${sal.postas_rurales_activas || 0}</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Educación SLEP</div>
                        <div class="dim-stat-val tabular-numbers">${edu.establecimientos_escolares_total || 0} colegios</div>
                        <div class="dim-stat-sub">Matrícula: ${(edu.matricula_escolar_total || 0).toLocaleString('es-CL')} estudiantes</div>
                    </div>
                    <div class="dim-stat-cell">
                        <div class="dim-stat-label">Vigilancia Volcánica & USGS</div>
                        <div class="dim-stat-val" style="font-size: 13px;">${Array.isArray(rie.volcanes_en_rango_influencia) ? rie.volcanes_en_rango_influencia.slice(0, 2).join(', ') : 'Vigilancia SENAPRED'}</div>
                        <div class="dim-stat-sub">Nivel de sismicidad: ${rie.nivel_riesgo_sismico || 'Moderado'}</div>
                    </div>
                </div>
            `;
        }

        return '';
    }

    function getComunaDataInDataset(ds, ine) {
        if (!ds || !ds.por_comuna) return null;
        const found = ds.por_comuna.find(c => String(c.comuna_ine) === String(ine));
        return found ? found.datos : null;
    }

    window.switchComunaDimension = function (dimId) {
        activeDimension = dimId;
        renderActiveComunaDimensions();
    };

    window.toggleDrawerExpanded = function () {
        document.body.classList.toggle('drawer-expanded');
        if (window.map) {
            setTimeout(() => window.map.invalidateSize(), 220);
        }
    };

    // ==========================================================================
    // 5. PESTAÑA 4: MODELO DE RELACIONES DE DATOS (POWER BI STYLE)
    // ==========================================================================
    const MODEL_TABLES = [
        {
            id: 'comunas',
            name: 'comunas_aysen',
            desc: 'Tabla Maestra Territorial (10 comunas)',
            rows: 10,
            pk: 'comuna_ine',
            fields: [
                { name: 'comuna_ine', key: 'pk' },
                { name: 'codigo_comuna', key: 'fk' },
                { name: 'nombre_comuna' },
                { name: 'codigo_cuenca', key: 'fk' },
                { name: 'poblacion_censo_2024' },
                { name: 'pobreza_casen_pct' }
            ]
        },
        {
            id: 'wp01',
            name: '01_gob_poder_finanzas',
            desc: 'SINIM, SERVEL, FNDR',
            rows: 10,
            pk: 'comuna_ine',
            fields: [
                { name: 'comuna_ine', key: 'pk' },
                { name: 'alcalde_nombre' },
                { name: 'presupuesto_municipal_mclp' },
                { name: 'dependencia_fcm_pct' },
                { name: 'inversion_fndr_mclp' }
            ]
        },
        {
            id: 'wp02',
            name: '02_energia_telecom',
            desc: 'CNE, Edelaysen, FOA',
            rows: 10,
            pk: 'comuna_ine',
            fields: [
                { name: 'comuna_ine', key: 'pk' },
                { name: 'sistema_electrico' },
                { name: 'potencia_instalada_mw' },
                { name: 'precio_diesel_clp' },
                { name: 'fibra_optica_foa' }
            ]
        },
        {
            id: 'wp03_holdings',
            name: '03_holdings_salmoneros',
            desc: '12 Matrices ↔ 42 RUTs',
            rows: 13,
            pk: 'holding_id',
            fields: [
                { name: 'holding_id', key: 'pk' },
                { name: 'empresa_madre' },
                { name: 'nombre_fantasia' },
                { name: 'concesiones_estimadas' },
                { name: 'pct_concesiones_regional' }
            ]
        },
        {
            id: 'wp04',
            name: '04_inversion_seia_economia',
            desc: 'SEA Proyectos, SII Empleo',
            rows: 10,
            pk: 'comuna_ine',
            fields: [
                { name: 'comuna_ine', key: 'pk' },
                { name: 'inversion_aprobada_mm_usd' },
                { name: 'empresas_sii_total' },
                { name: 'trabajadores_dependientes' },
                { name: 'empleo_publico_pct' }
            ]
        },
        {
            id: 'wp05',
            name: '05_social_salud_riesgos',
            desc: 'DEIS Hospitales, USGS, CEAD',
            rows: 10,
            pk: 'comuna_ine',
            fields: [
                { name: 'comuna_ine', key: 'pk' },
                { name: 'hospital_derivacion' },
                { name: 'horas_traslado_urgencia' },
                { name: 'evacuacion_aeromedica' },
                { name: 'volcanes_influencia' }
            ]
        },
        {
            id: 'wp06',
            name: '06_turismo_sernatur_conaf',
            desc: 'SERNATUR Prestadores, ZOIT, EMAT',
            rows: 10,
            pk: 'comuna_ine',
            fields: [
                { name: 'comuna_ine', key: 'pk' },
                { name: 'prestadores_sernatur' },
                { name: 'pernoctaciones_emat' },
                { name: 'ocupacion_estival_pct' },
                { name: 'nombre_zoit', key: 'fk' }
            ]
        }
    ];

    function renderModelView() {
        const container = document.getElementById('viewModelContainer');
        if (!container) return;

        let html = `
            <div class="model-view-header">
                <div class="model-view-title">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#141618" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                        <path d="M3 9h18M9 21V9"></path>
                    </svg>
                    <span>Modelo Relacional de Tablas (Estilo Power BI)</span>
                </div>
                <div class="model-view-subtitle">
                    Explora la arquitectura de datos del Atlas de Aysén: tablas normalizadas unidas mediante llaves relacionales primarias y foráneas (<code>comuna_ine</code>, <code>codigo_cuenca</code>, <code>holding_id</code>). Construye cruces analíticos (JOIN) en vivo y descárgalos a Excel.
                </div>
            </div>

            <!-- Cruces Rápidos Preconfigurados -->
            <div class="model-presets-container">
                <div class="model-presets-title">Cruces Analíticos Rápidos:</div>
                <div class="model-presets-strip">
                    <button type="button" class="quick-join-btn ${currentModelPreset === 'preset_sinim_salmon_turismo' ? 'active' : ''}" onclick="window.applyModelPreset('preset_sinim_salmon_turismo')">
                        <span>Finanzas SINIM × Concesiones Salmoneras × Turismo SERNATUR</span>
                    </button>
                    <button type="button" class="quick-join-btn ${currentModelPreset === 'preset_holdings_ruts' ? 'active' : ''}" onclick="window.applyModelPreset('preset_holdings_ruts')">
                        <span>Matriz 12 Holdings Madres y sus 42 RUTs Filiales</span>
                    </button>
                    <button type="button" class="quick-join-btn ${currentModelPreset === 'preset_energia_salud' ? 'active' : ''}" onclick="window.applyModelPreset('preset_energia_salud')">
                        <span>Energía Aislada × Salud y Derivación Aeromédica</span>
                    </button>
                    <button type="button" class="quick-join-btn ${currentModelPreset === 'preset_seia_empleo_casen' ? 'active' : ''}" onclick="window.applyModelPreset('preset_seia_empleo_casen')">
                        <span>Inversión SEIA × Empleo SII y Pobreza CASEN</span>
                    </button>
                </div>
            </div>

            <!-- Diagrama de Cajas de Tablas (Power BI Model View Canvas) -->
            <div class="model-diagram-canvas">
                ${MODEL_TABLES.map(t => {
                    const isSelected = selectedModelTables.includes(t.id);
                    return `
                        <div class="table-box-card ${isSelected ? 'selected' : ''}" id="tableBox_${t.id}">
                            <div class="table-box-header">
                                <span class="table-box-name">${t.name}</span>
                                <input type="checkbox" class="table-box-check" ${isSelected ? 'checked' : ''} onchange="window.toggleTableSelection('${t.id}')">
                            </div>
                            <div class="table-box-fields">
                                ${t.fields.map(f => `
                                    <div class="field-row">
                                        <span>${f.name}</span>
                                        ${f.key === 'pk' ? '<span class="key-badge-pk">PK</span>' : ''}
                                        ${f.key === 'fk' ? '<span class="key-badge-fk">FK</span>' : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Tabla Cruzada Resultante (JOIN) -->
            <div class="joined-results-section">
                <div class="joined-results-header">
                    <div>
                        <div class="joined-table-title" id="joinedTableTitle">Tabla Cruzada (JOIN) en Vivo</div>
                        <div style="font-size: 11px; color: #626D7C; font-family: var(--font-mono); margin-top: 3px;" id="joinedTableSubtitle">
                            Llave relacional: comuna_ine · 10 registros consolidados
                        </div>
                    </div>
                    <button type="button" class="export-join-btn btn-tactile" onclick="window.exportCurrentJoinToExcel()">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        <span>Descargar este cruce en Excel (CSV UTF-8 BOM)</span>
                    </button>
                </div>

                <div class="joined-table-wrapper" id="joinedTableWrapper">
                    ${buildJoinedTableHtml()}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    window.applyModelPreset = function (presetId) {
        currentModelPreset = presetId;
        if (presetId === 'preset_sinim_salmon_turismo') {
            selectedModelTables = ['comunas', 'wp01', 'wp06'];
        } else if (presetId === 'preset_holdings_ruts') {
            selectedModelTables = ['wp03_holdings'];
        } else if (presetId === 'preset_energia_salud') {
            selectedModelTables = ['comunas', 'wp02', 'wp05'];
        } else if (presetId === 'preset_seia_empleo_casen') {
            selectedModelTables = ['comunas', 'wp04'];
        }
        renderModelView();
    };

    window.toggleTableSelection = function (tableId) {
        currentModelPreset = 'custom';
        if (selectedModelTables.includes(tableId)) {
            selectedModelTables = selectedModelTables.filter(id => id !== tableId);
        } else {
            selectedModelTables.push(tableId);
        }
        renderModelView();
    };

    function buildJoinedTableHtml() {
        if (currentModelPreset === 'preset_holdings_ruts' || (selectedModelTables.length === 1 && selectedModelTables[0] === 'wp03_holdings')) {
            return buildHoldingsAndRutsTableHtml();
        }

        // Tabla comunal combinada por comuna_ine
        const comunas = window.comunasData || [];
        const sys = window.AysenSystemicData;

        let headers = ['INE', 'Comuna', 'Población'];
        if (selectedModelTables.includes('wp01')) {
            headers.push('Alcalde (SINIM)', 'Presupuesto M$', 'Dep. FCM %');
        }
        if (selectedModelTables.includes('wp02')) {
            headers.push('Sistema Eléctrico', 'Potencia MW', 'Diésel $/L');
        }
        if (selectedModelTables.includes('wp04')) {
            headers.push('SEIA MM USD', 'Empresas SII', 'Empleo Público %');
        }
        if (selectedModelTables.includes('wp05')) {
            headers.push('Hospital Derivación', 'Horas Urgencia', 'Aeromédica');
        }
        if (selectedModelTables.includes('wp06')) {
            headers.push('Prestadores SERNATUR', 'Pernoctaciones EMAT', 'Ocupación Verano %', 'ZOIT');
        }

        const rows = comunas.map(c => {
            const ine = String(c.comuna_ine);
            let rowCols = [
                `<span class="badge-code">${c.comuna_ine}</span>`,
                `<strong>${c.nombre_comuna}</strong>`,
                `<span class="tabular-numbers">${c.poblacion_censo_2024.toLocaleString('es-CL')}</span>`
            ];

            if (selectedModelTables.includes('wp01')) {
                const d = getComunaDataInDataset(sys.wp01, ine);
                const aut = d ? d.autoridades || {} : {};
                const fin = d ? d.finanzas_sinim || {} : {};
                rowCols.push(
                    aut.alcalde_nombre || 'N/D',
                    `<span class="tabular-numbers">$${(fin.presupuesto_municipal_anual_mclp || 0).toLocaleString('es-CL')}</span>`,
                    `<span class="tabular-numbers">${fin.dependencia_fondo_comun_municipal_pct || 0}%</span>`
                );
            }

            if (selectedModelTables.includes('wp02')) {
                const d = getComunaDataInDataset(sys.wp02, ine);
                const ele = d ? d.sistema_electrico || {} : {};
                const com = d ? d.combustibles || {} : {};
                rowCols.push(
                    ele.nombre_sistema || 'Aislado',
                    `<span class="tabular-numbers">${ele.potencia_instalada_mw || 0}</span>`,
                    `<span class="tabular-numbers">$${com.precio_diesel_promedio_clp || 0}</span>`
                );
            }

            if (selectedModelTables.includes('wp04')) {
                const d = getComunaDataInDataset(sys.wp04, ine);
                const sei = d ? d.proyectos_seia || {} : {};
                const sii = d ? d.estructura_empresarial_sii || {} : {};
                const emp = d ? d.empleo_y_turismo || {} : {};
                rowCols.push(
                    `<span class="tabular-numbers">$${(sei.inversion_aprobada_historica_mm_usd || 0).toLocaleString('es-CL')}</span>`,
                    `<span class="tabular-numbers">${(sii.empresas_con_ventas_total || 0).toLocaleString('es-CL')}</span>`,
                    `<span class="tabular-numbers">${emp.proporcion_empleo_publico_pct || 0}%</span>`
                );
            }

            if (selectedModelTables.includes('wp05')) {
                const d = getComunaDataInDataset(sys.wp05, ine);
                const sal = d ? d.salud_red_asistencial || {} : {};
                rowCols.push(
                    sal.hospital_base_derivacion || 'Hospital Regional Coyhaique',
                    `<span class="tabular-numbers">${sal.tiempo_traslado_terrestre_urgencia_horas || 0} hrs</span>`,
                    sal.requiere_evacuacion_aeromedica_critica ? 'Frecuente' : 'Ruta terrestre'
                );
            }

            if (selectedModelTables.includes('wp06')) {
                const d = getComunaDataInDataset(sys.wp06, ine);
                const ofe = d ? d.oferta_sernatur || {} : {};
                const dem = d ? d.demanda_emat_visitantes || {} : {};
                const zoi = d ? d.zoit_y_atractivos || {} : {};
                rowCols.push(
                    `<span class="tabular-numbers">${ofe.prestadores_registrados_total || 0}</span>`,
                    `<span class="tabular-numbers">${(dem.pernoctaciones_anuales_emat || 0).toLocaleString('es-CL')}</span>`,
                    `<span class="tabular-numbers">${dem.ocupacion_alta_enero_febrero_pct || 0}%</span>`,
                    zoi.pertenece_a_zoit ? zoi.nombre_zoit : 'Sin ZOIT'
                );
            }

            return `<tr>${rowCols.map(c => `<td>${c}</td>`).join('')}</tr>`;
        });

        return `
            <table class="data-table-systemic">
                <thead>
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${rows.join('')}
                </tbody>
            </table>
        `;
    }

    function buildHoldingsAndRutsTableHtml() {
        const wp03 = window.AysenSystemicData.wp03;
        const holdings = (window.AysenSystemicData.holdings && window.AysenSystemicData.holdings.holdings) ||
                         (wp03 && wp03.holdings_salmoneros_matriz_ruts ? wp03.holdings_salmoneros_matriz_ruts : []);

        let rows = [];
        holdings.forEach(h => {
            const filiales = h.filiales_y_ruts || [];
            filiales.forEach(f => {
                rows.push(`
                    <tr>
                        <td><strong>${h.nombre_fantasia}</strong></td>
                        <td>${h.empresa_madre}</td>
                        <td class="tabular-numbers"><strong>${f.rut}</strong></td>
                        <td>${f.razon_social}</td>
                        <td>${f.rol_societario || 'Filial operativa'}</td>
                        <td class="tabular-numbers">${h.concesiones_estimadas_aysen || 0}</td>
                        <td class="tabular-numbers">${h.pct_concesiones_regional || 0}%</td>
                        <td>${Array.isArray(f.comunas_aysen) ? f.comunas_aysen.join(', ') : 'Aysén'}</td>
                        <td>${Array.isArray(f.barrios_acs) ? f.barrios_acs.join(', ') : 'N/A'}</td>
                    </tr>
                `);
            });
        });

        return `
            <table class="data-table-systemic">
                <thead>
                    <tr>
                        <th>Holding / Marca</th>
                        <th>Empresa Madre</th>
                        <th>RUT Filial</th>
                        <th>Razón Social Filial</th>
                        <th>Rol Societario</th>
                        <th>Concesiones Aysén</th>
                        <th>% Regional</th>
                        <th>Comunas Operación</th>
                        <th>Barrios Sanitarios (ACS)</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.join('')}
                </tbody>
            </table>
        `;
    }

    // Exportación a Excel con UTF-8 BOM (\uFEFF)
    window.exportCurrentJoinToExcel = function () {
        let csvContent = '\uFEFF';
        const table = document.querySelector('.joined-table-wrapper table');
        if (!table) return;

        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('th, td');
            const rowData = [];
            cols.forEach(col => {
                let text = col.innerText.replace(/"/g, '""').trim();
                rowData.push(`"${text}"`);
            });
            csvContent += rowData.join(';') + '\r\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aysen_cruce_relacional_${currentModelPreset}_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // ==========================================================================
    // 6. INTEGRACIÓN CON LAS PESTAÑAS EXISTENTES Y SELECTOR COMUNAL
    // ==========================================================================
    // Interceptar o complementar selectComuna
    const originalSelectComuna = window.selectComuna;
    window.selectComuna = function (comunaCode) {
        if (typeof originalSelectComuna === 'function') {
            originalSelectComuna(comunaCode);
        }
        renderActiveComunaDimensions();
    };

    // Interceptar switchSidebarView para manejar la 4ta pestaña ('model')
    const originalSwitchSidebarView = window.switchSidebarView;
    window.switchSidebarView = function (mode) {
        const tabModel = document.getElementById('tabModelView');
        const viewModel = document.getElementById('viewModelContainer');

        if (mode === 'model') {
            // Desactivar pestañas 1, 2, 3
            ['tabStationView', 'tabCrossView', 'tabDownloadsView'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.classList.remove('active');
                    el.setAttribute('aria-selected', 'false');
                }
            });
            ['viewStationContainer', 'viewCrossContainer', 'viewDownloadsContainer'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });

            if (tabModel) {
                tabModel.classList.add('active');
                tabModel.setAttribute('aria-selected', 'true');
            }
            if (viewModel) {
                viewModel.style.display = 'flex';
            }

            // Destruir charts para evitar colisiones según contrato
            if (typeof window.destroyActiveChart === 'function') {
                window.destroyActiveChart();
            }

            renderModelView();
            return;
        }

        // Si es cualquiera de las 3 contractuales, ocultar la 4ta y delegar
        if (tabModel) {
            tabModel.classList.remove('active');
            tabModel.setAttribute('aria-selected', 'false');
        }
        if (viewModel) {
            viewModel.style.display = 'none';
        }

        if (typeof originalSwitchSidebarView === 'function') {
            originalSwitchSidebarView(mode);
        }
    };

    // Iniciar carga tras DOMContentLoaded o inmediatamente si ya cargó
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSystemicDataLake);
    } else {
        initSystemicDataLake();
    }

})();
