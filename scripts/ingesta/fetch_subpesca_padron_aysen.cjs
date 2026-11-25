#!/usr/bin/env node
/**
 * scripts/ingesta/fetch_subpesca_padron_aysen.cjs
 * ============================================================================
 * Ingesta oficial desde el servidor ArcGIS Enterprise activo de SUBPESCA:
 * https://geoportal.subpesca.cl/server/rest/services/IDE_PUBLICO/SRMPUB_ACUICULTURA_SALMONES/MapServer/0/query
 *
 * Notas tecnicas de interoperabilidad:
 * - No usar resultRecordCount ni resultOffset (el servidor responde 400).
 * - Los campos vienen calificados con prefijo de tabla; se normalizan con split('.').pop().
 * - Las geometrias son poligonos (esriGeometryPolygon); se calcula centroide WGS84.
 * - Si el entorno no tiene salida de red, conserva el snapshot local existente sin fallar.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_PATH = path.join(ROOT, 'data', 'raw', 'territorio_concesiones', 'padron_real_subpesca_aysen.json');
const ENDPOINT = 'https://geoportal.subpesca.cl/server/rest/services/IDE_PUBLICO/SRMPUB_ACUICULTURA_SALMONES/MapServer/0/query';

const WHERE_CLAUSE =
  "REP_SUBPESCA2.ADM_UOT.PULLINQUE4_T_ACUICULTURA.REGION LIKE '%AYSEN%' " +
  "OR (REP_SUBPESCA2.ADM_UOT.PULLINQUE4_T_ACUICULTURA.N_CODIGOCENTRO >= 110000 " +
  "AND REP_SUBPESCA2.ADM_UOT.PULLINQUE4_T_ACUICULTURA.N_CODIGOCENTRO < 120000)";

function normalizeAttributes(rawAttrs) {
  const clean = {};
  if (!rawAttrs || typeof rawAttrs !== 'object') return clean;
  Object.entries(rawAttrs).forEach(([k, v]) => {
    const shortKey = String(k).split('.').pop();
    clean[shortKey] = typeof v === 'string' ? v.trim() : v;
  });
  return clean;
}

function mapComunaIne(rawComuna) {
  const c = String(rawComuna || '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (c.includes('AISEN') || c.includes('AYSEN')) return { ine: '11201', nombre: 'Aysén' };
  if (c.includes('CISNES')) return { ine: '11202', nombre: 'Cisnes' };
  if (c.includes('GUAITECAS')) return { ine: '11203', nombre: 'Guaitecas' };
  if (c.includes('TORTEL')) return { ine: '11303', nombre: 'Tortel' };
  return { ine: '11201', nombre: rawComuna ? String(rawComuna).trim() : 'Aysén' };
}

function computeRingCentroid(geometry) {
  if (!geometry || typeof geometry !== 'object') return null;
  if (Number.isFinite(geometry.y) && Number.isFinite(geometry.x)) {
    return { lat: Number(geometry.y.toFixed(4)), lon: Number(geometry.x.toFixed(4)) };
  }
  const ring = Array.isArray(geometry.rings) && Array.isArray(geometry.rings[0]) ? geometry.rings[0] : null;
  if (!ring || ring.length === 0) return null;
  let pts = ring;
  if (pts.length > 1) {
    const first = pts[0];
    const last = pts[pts.length - 1];
    if (first[0] === last[0] && first[1] === last[1]) {
      pts = pts.slice(0, -1);
    }
  }
  if (pts.length === 0) return null;
  let sumLon = 0;
  let sumLat = 0;
  pts.forEach(pt => {
    sumLon += Number(pt[0]) || 0;
    sumLat += Number(pt[1]) || 0;
  });
  const lat = Number((sumLat / pts.length).toFixed(4));
  const lon = Number((sumLon / pts.length).toFixed(4));
  if (lat < -49.4 || lat > -43.6 || lon < -75.9 || lon > -71.1) return null;
  return { lat, lon };
}

function formatEpochDate(ms) {
  if (ms === null || ms === undefined || !Number.isFinite(Number(ms))) return null;
  try {
    return new Date(Number(ms)).toISOString().slice(0, 10);
  } catch (_) {
    return null;
  }
}

async function run() {
  const url = `${ENDPOINT}?where=${encodeURIComponent(WHERE_CLAUSE)}&outFields=*&returnGeometry=true&outSR=4326&f=json`;
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    const payload = await resp.json();
    if (payload.error) {
      throw new Error(payload.error.message || 'ArcGIS query error');
    }
    const features = Array.isArray(payload.features) ? payload.features : [];
    if (features.length === 0) {
      throw new Error('La respuesta ArcGIS no devolvio features.');
    }

    const porComuna = {};
    const registros = [];
    features.forEach(f => {
      const attrs = normalizeAttributes(f.attributes);
      const centroid = computeRingCentroid(f.geometry);
      if (!centroid) return;
      const comInfo = mapComunaIne(attrs.COMUNA);
      porComuna[comInfo.nombre] = (porComuna[comInfo.nombre] || 0) + 1;
      const rawAcs = String(attrs.AGRUPCONCESIONESID || '').trim();
      const acsCode = rawAcs ? (rawAcs.toUpperCase().startsWith('ACS-') ? rawAcs.toUpperCase() : `ACS-${rawAcs.toUpperCase()}`) : 'ACS-21A';
      registros.push({
        codigo_centro: String(attrs.N_CODIGOCENTRO || '').trim(),
        agrupacion_acs: acsCode,
        titular: String(attrs.TITULAR || 'Titular Acuícola').trim(),
        pert: String(attrs.N_PERT || '').trim(),
        comuna: comInfo.nombre,
        comuna_ine: comInfo.ine,
        toponimio: String(attrs.TOPONIMIO || '').trim(),
        especies: String(attrs.ESPECIES || '').trim(),
        grupo_especie: String(attrs.T_GRUPOESPECIE || 'SALMONES').trim(),
        superficie_ha: Number(attrs.SUPERFICIEPOLIGONO) || 0,
        tipo_porcion: attrs.C_TIPOPORCION ?? null,
        estado_tramite: String(attrs.T_ESTADOTRAMITE || '').trim(),
        resol_ssp: String(attrs.N_RESOLSSP || '').trim(),
        f_resol_ssp: formatEpochDate(attrs.F_RESOLSSP),
        resol_ssffaa: attrs.N_RESOLSSFFAA !== undefined && attrs.N_RESOLSSFFAA !== null ? String(attrs.N_RESOLSSFFAA) : '',
        f_resol_ssffaa: formatEpochDate(attrs.F_RESOLSSFFAA),
        lat: centroid.lat,
        lon: centroid.lon
      });
    });

    const outObj = {
      fuente: 'SUBPESCA IDE Publico (SRMPUB_ACUICULTURA_SALMONES)',
      endpoint: ENDPOINT,
      fecha_extraccion: new Date().toISOString(),
      total_registros: registros.length,
      por_comuna: porComuna,
      registros
    };

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, JSON.stringify(outObj, null, 2) + '\n', 'utf8');
    console.log(`[OK] Padrón real SUBPESCA guardado (${registros.length} registros): ${JSON.stringify(porComuna)}`);
  } catch (err) {
    if (fs.existsSync(OUT_PATH)) {
      console.log(`[WARN] Sin acceso a geoportal.subpesca.cl (${err.message}); se conserva snapshot local existente.`);
      return;
    }
    console.log(`[WARN] Sin acceso a geoportal.subpesca.cl (${err.message}); se usara respaldo determinista en compilacion.`);
  }
}

run();
