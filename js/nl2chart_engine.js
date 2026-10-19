/**
 * js/nl2chart_engine.js
 * ============================================================================
 * Motor de Traducción de Lenguaje Natural a Gráficos (NL2Chart) para Aysén Sistémico
 * Arquitectura: 100% Client-Side, Zero-API, Latencia 0ms, Costo $0, CERO EMOJIS
 * Autor: Álvaro Contreras Barrios
 * Fecha: 17-Oct-2026
 *
 * Mapea expresiones cotidianas, modismos chilenos y consultas ciudadanas legas
 * a variables canónicas, satélites y configuraciones de gráficos para
 * laboratorio.html y plataforma_aysen.html.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NL2ChartEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. ADAPTADOR OPCIONAL DESACOPLADO PARA LLM (DESACTIVADO POR DEFECTO)
  // --------------------------------------------------------------------------
  class OptionalLLMResolver {
    constructor(options = {}) {
      this.enabled = Boolean(options.enabled);
      this.apiKey = options.apiKey || null;
      this.endpoint = options.endpoint || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
      this.model = options.model || 'gemini-2.5-flash';
      this.timeoutMs = options.timeoutMs || 4000;
    }

    configure(config = {}) {
      if (typeof config.enabled === 'boolean') this.enabled = config.enabled;
      if (config.apiKey !== undefined) this.apiKey = config.apiKey;
      if (config.endpoint) this.endpoint = config.endpoint;
      if (config.model) this.model = config.model;
      if (config.timeoutMs) this.timeoutMs = config.timeoutMs;
      return this;
    }

    isEnabled() {
      return Boolean(this.enabled && this.apiKey);
    }

    async resolve(queryText, candidates = []) {
      if (!this.isEnabled()) {
        return {
          resolved: false,
          reason: 'OptionalLLMResolver no esta activo o carece de apiKey valida.'
        };
      }

      try {
        const promptText = `Eres un clasificador semantico para el observatorio de Aysen.
Analiza la siguiente consulta y selecciona la variable o cruce mas adecuado entre las opciones disponibles.
Consulta: "${queryText}"
Opciones disponibles:
${candidates.map(c => `- ID: ${c.id} (${c.name}, Hub: ${c.hub})`).slice(0, 15).join('\n')}

Responde UNICAMENTE en formato JSON plano:
{"varX": "id_var_x", "varY": "id_var_y_o_null", "chartType": "scatter|bar|temporal|holding", "confidence": 0.85, "explanation": "Breve explicacion"}`;

        const url = `${this.endpoint}?key=${encodeURIComponent(this.apiKey)}`;
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), this.timeoutMs) : null;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller ? controller.signal : undefined,
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        });

        if (timer) clearTimeout(timer);
        if (!response.ok) {
          return { resolved: false, reason: `HTTP Error ${response.status}` };
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return { resolved: true, data: parsed };
        }
        return { resolved: false, reason: 'No se pudo parsear respuesta JSON del modelo.' };
      } catch (err) {
        return { resolved: false, reason: err.message || 'Error en conexion con endpoint LLM.' };
      }
    }
  }

  // --------------------------------------------------------------------------
  // 2. ESTADO DEL LÉXICO, ÍNDICE EN MEMORIA Y NORMALIZACIÓN
  // --------------------------------------------------------------------------
  let _lexicon = null;
  let _tokenIndex = null;
  let _allIndexedSynonyms = null;
  const _llmResolver = new OptionalLLMResolver();

  function normalizeText(text) {
    if (!text) return '';
    return String(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina tildes y diacríticos
      .replace(/[^a-z0-9\s_-]/g, ' ')   // Puntuación a espacios
      .replace(/\s+/g, ' ')            // Colapsar espacios múltiples
      .trim();
  }

  function _buildIndex() {
    if (!_lexicon || !Array.isArray(_lexicon.variables)) {
      _tokenIndex = null;
      _allIndexedSynonyms = null;
      return;
    }

    const tokenMap = new Map();
    const allEntries = [];

    for (const v of _lexicon.variables) {
      const synList = v.synonyms || [];
      for (const syn of synList) {
        const nSyn = normalizeText(syn);
        if (!nSyn || nSyn.length < 2) continue;

        const words = nSyn.split(' ').filter(Boolean);
        const wordCount = words.length;

        // Ponderación base según longitud del n-grama
        let weight = 0.85;
        if (wordCount >= 4) weight = 0.99;
        else if (wordCount === 3) weight = 0.96;
        else if (wordCount === 2) weight = 0.93;
        else if (nSyn === normalizeText(v.id) || nSyn === normalizeText(v.shortName)) weight = 0.95;

        // Ajustes de especificidad y prioridad contractual
        if ((nSyn === 'concesiones' || nSyn === 'jaulas' || nSyn === 'cultivo de salmon' || nSyn === 'concesiones de salmones' || nSyn === 'concesiones de salmon') && v.id === 'concesiones_salmon') weight += 0.08;
        if ((nSyn === 'biomasa' || nSyn === 'cosecha de salmon' || nSyn === 'toneladas de salmon' || nSyn === 'biomasa salmon') && v.id === 'biomasa_salmon_ton') weight += 0.08;
        if ((nSyn === 'pago de patente' || nSyn === 'patentes' || nSyn === 'ingresos propios' || nSyn === 'ipp' || nSyn === 'pago de patentes') && v.id === 'ipp_per_capita_clp') weight += 0.09;
        if ((nSyn === 'plata municipal' || nSyn === 'presupuesto municipal' || nSyn === 'presupuesto') && v.id === 'presupuesto_mclp') weight += 0.08;
        if ((nSyn === 'presupuesto per capita' || nSyn === 'presupuesto por habitante') && v.id === 'presupuesto_per_capita_mclp') weight += 0.09;
        if ((nSyn === 'problemas respiratorios' || nSyn === 'urgencias' || nSyn === 'enfermedades de invierno' || nSyn === 'urgencias respiratorias') && v.id === 'urgencias_respiratorias_pct') weight += 0.08;
        if ((nSyn === 'hospitalizados' || nSyn === 'camas' || nSyn === 'camas hospitalarias' || nSyn === 'hospitales') && v.id === 'camas_hospitalarias') weight += 0.08;
        if ((nSyn === 'contaminacion' || nSyn === 'humo' || nSyn === 'aire sucio' || nSyn === 'smog' || nSyn === 'mp25') && v.id === 'dias_sobre_norma_mp25') weight += 0.08;
        if ((nSyn === 'estufas' || nSyn === 'calefaccion a lena' || nSyn === 'estufas a lena' || nSyn === 'lena') && v.id === 'hogares_lena_pct') weight += 0.07;
        if ((nSyn === 'precio lena' || nSyn === 'metro de lena' || nSyn === 'precio de lena') && v.id === 'precio_lena_m3') weight += 0.08;
        if ((nSyn === 'cortes de luz' || nSyn === 'apagones' || nSyn === 'interrupciones electricas' || nSyn === 'saidi') && v.id === 'saidi_horas_anual') weight += 0.09;
        if ((nSyn === 'tarifa de luz' || nSyn === 'boleta de luz' || nSyn === 'tarifa bt1' || nSyn === 'tarifa electrica bt1') && v.id === 'tarifa_bt1_clp') weight += 0.08;
        if ((nSyn === 'diesel aislado' || nSyn === 'costo diesel' || nSyn === 'generador diesel') && v.id === 'costo_diesel_aislado_clp') weight += 0.08;
        if ((nSyn === 'caminos de ripio' || nSyn === 'ripio' || nSyn === 'ruta 7 ripio') && v.id === 'ruta7_ripio_km') weight += 0.08;
        if ((nSyn === 'aislamiento' || nSyn === 'horas de viaje' || nSyn === 'distancia' || nSyn === 'horas a coyhaique') && v.id === 'traslado_coyhaique_hrs') weight += 0.08;
        if ((nSyn === 'ruta 7 pavimentada' || nSyn === 'pavimento' || nSyn === 'asfalto' || nSyn === 'carretera austral') && v.id === 'ruta7_pavimentada_km') weight += 0.08;
        if ((nSyn === 'turismo' || nSyn === 'turistas' || nSyn === 'pernoctaciones' || nSyn === 'ocupacion' || nSyn === 'ocupacion hotelera') && v.id === 'pernoctaciones_emat') weight += 0.07;
        if ((nSyn === 'presion turistica' || nSyn === 'turistas por habitante' || nSyn === 'ratio presion turistica') && v.id === 'ratio_presion_turistica') weight += 0.08;
        if ((nSyn === 'parques' || nSyn === 'visitantes' || nSyn === 'visitas parques' || nSyn === 'visitantes parques') && v.id === 'visitantes_snaspe') weight += 0.08;
        if ((nSyn === 'hoteles' || nSyn === 'prestadores' || nSyn === 'prestadores sernatur' || nSyn === 'alojamientos turisticos') && v.id === 'prestadores_sernatur') weight += 0.08;
        if ((nSyn === 'pobreza' || nSyn === 'casen' || nSyn === 'vulnerabilidad' || nSyn === 'pobreza multidimensional' || nSyn === 'pobreza casen') && v.id === 'pobreza_multidim_pct') weight += 0.08;
        if ((nSyn === 'ingresos' || nSyn === 'pobreza por ingresos' || nSyn === 'linea de la pobreza' || nSyn === 'bajos ingresos') && v.id === 'pobreza_ingresos_pct') weight += 0.08;
        if ((nSyn === 'dependencia' || nSyn === 'fcm' || nSyn === 'fondo comun municipal' || nSyn === 'aporte del estado') && v.id === 'dependencia_fcm_pct') weight += 0.09;
        if ((nSyn === 'inversion' || nSyn === 'plata seia' || nSyn === 'inversion seia' || nSyn === 'millones de dolares seia') && v.id === 'inversion_seia_mmusd') weight += 0.08;
        if ((nSyn === 'proyectos' || nSyn === 'proyectos seia' || nSyn === 'proyectos aprobados' || nSyn === 'seia') && v.id === 'proyectos_seia_aprobados') weight += 0.08;
        if ((nSyn === 'glaciares' || nSyn === 'hielo' || nSyn === 'campos de hielo' || nSyn === 'superficie glaciar') && v.id === 'superficie_glaciar_km2') weight += 0.08;
        if ((nSyn === 'agua' || nSyn === 'derechos de agua' || nSyn === 'daa no consuntivos') && v.id === 'daa_no_consuntivos_m3s') weight += 0.08;
        if ((nSyn === 'guardaparques' || nSyn === 'guardaparque' || nSyn === 'conaf' || nSyn === 'conaf guardaparques') && v.id === 'ha_snaspe_por_guardaparque') weight += 0.08;
        if ((nSyn === 'protegido' || nSyn === 'snaspe' || nSyn === 'areas protegidas' || nSyn === 'territorio protegido') && v.id === 'superficie_snaspe_pct') weight += 0.08;
        if ((nSyn === 'medicos' || nSyn === 'doctores' || nSyn === 'posta' || nSyn === 'salud' || nSyn === 'atencion medica') && v.id === 'medicos_por_mil_hab') weight += 0.08;
        if ((nSyn === 'samu' || nSyn === 'aeroevacuaciones' || nSyn === 'evacuacion medica' || nSyn === 'aeroevacuaciones samu') && v.id === 'aeroevacuaciones_samu_n') weight += 0.09;
        if ((nSyn === 'lista de espera' || nSyn === 'espera no ges' || nSyn === 'espera') && v.id === 'espera_no_ges_n') weight += 0.08;

        const entry = {
          syn,
          nSyn,
          words,
          wordCount,
          variable: v,
          weight
        };

        allEntries.push(entry);

        for (const w of words) {
          if (!tokenMap.has(w)) tokenMap.set(w, []);
          tokenMap.get(w).push(entry);
        }
      }
    }

    _allIndexedSynonyms = allEntries;
    _tokenIndex = tokenMap;
  }

  // Carga automática del léxico en entorno Node.js
  if (typeof module === 'object' && module.exports) {
    try {
      const fs = require('fs');
      const path = require('path');
      const defaultPath = path.resolve(__dirname, '../data/nl_lexicon_aysen.json');
      if (fs.existsSync(defaultPath)) {
        _lexicon = JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
        _buildIndex();
      }
    } catch (_) {
      // Ignorar si fs no está disponible
    }
  } else if (typeof window !== 'undefined' && window.NL_LEXICON_AYSEN) {
    _lexicon = window.NL_LEXICON_AYSEN;
    _buildIndex();
  }

  // --------------------------------------------------------------------------
  // 3. MOTOR PRINCIPAL NL2ChartEngine
  // --------------------------------------------------------------------------
  const NL2ChartEngine = {
    OptionalLLMResolver: OptionalLLMResolver,
    llm: _llmResolver,

    setLexicon(data) {
      if (data && typeof data === 'object' && Array.isArray(data.variables)) {
        _lexicon = data;
        _buildIndex();
        return true;
      }
      return false;
    },

    getLexicon() {
      return _lexicon;
    },

    async init(pathOrUrl = 'data/nl_lexicon_aysen.json') {
      if (_lexicon && Array.isArray(_lexicon.variables)) {
        return _lexicon;
      }
      if (typeof fetch === 'function') {
        try {
          const resp = await fetch(pathOrUrl);
          if (resp.ok) {
            _lexicon = await resp.json();
            _buildIndex();
            if (typeof window !== 'undefined') {
              window.NL_LEXICON_AYSEN = _lexicon;
            }
            return _lexicon;
          }
        } catch (e) {
          console.warn('[NL2ChartEngine] No se pudo cargar lexico desde URL:', e);
        }
      }
      return _lexicon;
    },

    getVariableById(id) {
      if (!_lexicon || !Array.isArray(_lexicon.variables)) return null;
      return _lexicon.variables.find(v => v.id === id || v.canonicalId === id) || null;
    },

    searchVariables(term, limit = 5) {
      if (!_lexicon || !Array.isArray(_lexicon.variables) || !term) return [];
      const nTerm = normalizeText(term);
      const matches = [];

      for (const v of _lexicon.variables) {
        let score = 0;
        if (normalizeText(v.id) === nTerm || normalizeText(v.name) === nTerm) {
          score = 1.0;
        } else if (normalizeText(v.name).includes(nTerm)) {
          score = 0.8;
        } else {
          for (const syn of v.synonyms || []) {
            const nSyn = normalizeText(syn);
            if (nSyn === nTerm) {
              score = Math.max(score, 0.95);
            } else if (nSyn.includes(nTerm) || nTerm.includes(nSyn)) {
              score = Math.max(score, 0.7);
            }
          }
        }
        if (score > 0) {
          matches.push({ variable: v, score });
        }
      }

      matches.sort((a, b) => b.score - a.score);
      return matches.slice(0, limit).map(m => m.variable);
    },

    /**
     * Función principal: parseQuery(queryText)
     * Interpreta la consulta en lenguaje natural y genera la configuración del gráfico.
     * Latencia: sub-milisegundo (0ms). Costo: $0. Cero APIs externas requeridas.
     */
    parseQuery(queryText) {
      if (!queryText || typeof queryText !== 'string' || !queryText.trim()) {
        return {
          success: false,
          confidence: 0.0,
          query: queryText || '',
          chartType: 'bar',
          varX: null,
          varY: null,
          varZ: null,
          excludeOutlierCoyhaique: false,
          explanation: 'Consulta vacia o invalida.',
          matchedTokens: []
        };
      }

      const lex = _lexicon;
      if (!lex || !Array.isArray(lex.variables) || !_tokenIndex) {
        return {
          success: false,
          confidence: 0.0,
          query: queryText,
          chartType: 'bar',
          varX: null,
          varY: null,
          varZ: null,
          excludeOutlierCoyhaique: false,
          explanation: 'Lexico semantico no inicializado.',
          matchedTokens: []
        };
      }

      const rawQuery = queryText;
      const normQuery = normalizeText(rawQuery);
      const queryWords = normQuery.split(' ').filter(Boolean);

      // A) Detección de intenciones globales
      const intentKeys = lex.intentKeywords || {};
      const temporalKeywords = intentKeys.temporal || [
        'tiempo', 'historia', 'evolucion', 'anos', 'ano', 'meses', '2015', '2026', 'historico', 'mensual', 'tendencia'
      ];
      const holdingKeywords = intentKeys.holding || [
        'holding', 'holdings', 'duenos', 'dueños', 'aquachile', 'aqua chile', 'mowi', 'multix', 'holding salmonero', 'empresas salmoneras'
      ];
      const outlierKeywords = intentKeys.exclude_coyhaique || [
        'sin coyhaique', 'excluir coyhaique', 'sacar coyhaique', 'quitar coyhaique', 'sin la capital'
      ];
      const scatterKeywords = intentKeys.scatter || [
        'dispersion', 'scatter', 'correlacion', 'cruce', 'relacion', 'frente a', 'vs', 'versus'
      ];
      const barKeywords = intentKeys.bar || [
        'ranking', 'barras', 'bar', 'comparar', 'comparativa', 'distribucion'
      ];

      const isTemporalIntent = temporalKeywords.some(k => normQuery.includes(normalizeText(k)));
      const isHoldingIntent = holdingKeywords.some(k => normQuery.includes(normalizeText(k)));
      const explicitExcludeCoyhaique = outlierKeywords.some(k => normQuery.includes(normalizeText(k)));
      const wantsScatter = scatterKeywords.some(k => normQuery.includes(normalizeText(k)));
      const wantsBar = barKeywords.some(k => normQuery.includes(normalizeText(k)));

      // B) Búsqueda acelerada de candidatos mediante el índice inverso de tokens
      const candidateSet = new Set();
      for (const w of queryWords) {
        const list = _tokenIndex.get(w);
        if (list) {
          for (let i = 0; i < list.length; i++) {
            candidateSet.add(list[i]);
          }
        }
      }

      // Comprobar coincidencia exacta con límites de palabra en la consulta normalizada
      const synonymMatches = [];
      for (const cand of candidateSet) {
        let searchFrom = 0;
        while (searchFrom < normQuery.length) {
          const idx = normQuery.indexOf(cand.nSyn, searchFrom);
          if (idx === -1) break;

          const beforeOk = (idx === 0) || (normQuery[idx - 1] === ' ');
          const afterIdx = idx + cand.nSyn.length;
          const afterOk = (afterIdx === normQuery.length) || (normQuery[afterIdx] === ' ');

          if (beforeOk && afterOk) {
            synonymMatches.push({
              variable: cand.variable,
              matchedToken: cand.syn,
              nSyn: cand.nSyn,
              startIdx: idx,
              endIdx: afterIdx,
              wordCount: cand.wordCount,
              weight: cand.weight
            });
          }
          searchFrom = idx + 1;
        }
      }

      // C) Desambiguación y Selección de Spans No Superpuestos
      // Ordenar por longitud de palabras (descendente) y peso
      synonymMatches.sort((a, b) => (b.wordCount - a.wordCount) || (b.weight - a.weight) || (a.startIdx - b.startIdx));

      const selectedSpans = [];
      const usedVarIds = new Set();

      for (const m of synonymMatches) {
        if (usedVarIds.has(m.variable.id)) continue;

        // Comprobar solapamiento espacial de tokens
        const overlaps = selectedSpans.some(s => (m.startIdx < s.endIdx && m.endIdx > s.startIdx));
        if (!overlaps) {
          selectedSpans.push(m);
          usedVarIds.add(m.variable.id);
        }
      }

      // Ordenar según aparición en el texto
      selectedSpans.sort((a, b) => a.startIdx - b.startIdx);

      // D) Asignación de varX, varY y varZ
      let varXObj = null;
      let varYObj = null;
      let varZObj = null;
      const matchedTokens = [];

      if (selectedSpans.length > 0) {
        const first = selectedSpans[0];
        varXObj = {
          id: first.variable.id,
          name: first.variable.name,
          unit: first.variable.unit,
          hub: first.variable.hub,
          hubTitle: first.variable.hubTitle,
          dim: first.variable.dim,
          outlierBiased: Boolean(first.variable.outlierBiased),
          nodeId: first.variable.nodeId,
          canonicalId: first.variable.canonicalId
        };
        matchedTokens.push(first.matchedToken);
      }

      if (selectedSpans.length > 1) {
        const second = selectedSpans[1];
        varYObj = {
          id: second.variable.id,
          name: second.variable.name,
          unit: second.variable.unit,
          hub: second.variable.hub,
          hubTitle: second.variable.hubTitle,
          dim: second.variable.dim,
          outlierBiased: Boolean(second.variable.outlierBiased),
          nodeId: second.variable.nodeId,
          canonicalId: second.variable.canonicalId
        };
        matchedTokens.push(second.matchedToken);
      }

      if (selectedSpans.length > 2) {
        const third = selectedSpans[2];
        varZObj = {
          id: third.variable.id,
          name: third.variable.name,
          unit: third.variable.unit
        };
        matchedTokens.push(third.matchedToken);
      }

      // E) Determinación del tipo de gráfico (chartType)
      let chartType = 'bar';
      let confidence = 0.0;

      if (isTemporalIntent) {
        chartType = 'temporal';
        confidence = varXObj ? Math.min(0.95, selectedSpans[0].weight + 0.02) : 0.80;
      } else if (isHoldingIntent) {
        chartType = 'holding';
        confidence = varXObj ? Math.min(0.95, selectedSpans[0].weight + 0.02) : 0.85;
      } else if (varXObj && varYObj) {
        // Cruce bivariado detectado
        if (wantsBar) {
          chartType = 'bar';
        } else if (wantsScatter) {
          chartType = 'scatter';
        } else {
          // Por defecto en laboratorio, dos variables continuas comunales se visualizan en dispersión
          chartType = 'scatter';
        }
        confidence = Math.min(0.98, ((selectedSpans[0].weight + selectedSpans[1].weight) / 2));
      } else if (varXObj) {
        // Variable única
        chartType = 'bar';
        confidence = Math.min(0.92, selectedSpans[0].weight);
      } else {
        // No se identificaron variables
        confidence = 0.15;
      }

      // F) Detección de sesgo y exclusión de Coyhaique
      let excludeOutlierCoyhaique = false;
      if (explicitExcludeCoyhaique) {
        excludeOutlierCoyhaique = true;
      } else if (varXObj && varXObj.outlierBiased) {
        excludeOutlierCoyhaique = true;
      } else if (varYObj && varYObj.outlierBiased) {
        excludeOutlierCoyhaique = true;
      }

      // G) Generación de explicación editorial
      let explanation = '';
      if (!varXObj) {
        explanation = 'No se reconocieron variables especificas en la consulta. Intente nombrar variables como salmones, patentes, lena, o cortes de luz.';
      } else if (chartType === 'temporal') {
        explanation = `Modo temporal sugerido: Evolucion historica de ${varXObj.name}`;
      } else if (chartType === 'holding') {
        explanation = `Modo holdings sugerido: Concentracion y participacion corporativa de ${varXObj.name}`;
      } else if (varXObj && varYObj) {
        explanation = `Cruce detectado: ${varXObj.name} vs. ${varYObj.name}`;
        if (excludeOutlierCoyhaique) {
          explanation += ' (se sugiere excluir Coyhaique para evitar distorsion de escala regional)';
        }
      } else {
        explanation = `Distribucion comunal: ${varXObj.name} en las 10 comunas de Aysen`;
        if (excludeOutlierCoyhaique) {
          explanation += ' (con recomendacion de filtrar Coyhaique por sesgo capitalino)';
        }
      }

      const success = Boolean(varXObj && confidence >= 0.35);

      return {
        success,
        confidence: Number(confidence.toFixed(2)),
        query: rawQuery,
        chartType,
        varX: varXObj,
        varY: varYObj,
        varZ: varZObj,
        excludeOutlierCoyhaique,
        explanation,
        matchedTokens
      };
    }
  };

  return NL2ChartEngine;
}));
