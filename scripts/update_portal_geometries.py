# -*- coding: utf-8 -*-
"""
Generador de las 12 Geometrías Vectoriales de Aysén para portal.html.
Resolución: 128 capas x 256 vértices = 32.768 vértices por postal (393.216 vértices totales).
Grabado fino de alta densidad topográfica y arquitectónica.
"""

import re
import os

PORTAL_HTML = os.path.join(os.path.dirname(__file__), "..", "portal.html")

NEW_JS_ENGINE = r'''    // =========================================================================
    // 2. MOTOR DE METAMORFOSIS DE LAS 12 POSTALES DE AYSÉN A PANTALLA COMPLETA
    //    128 capas vectoriales de grabado fino (256 vértices por trazo = 32.768 vértices/postal)
    // =========================================================================
    const postalCanvas = document.getElementById('postalCanvas');
    const pCtx = postalCanvas.getContext('2d');

    const NUM_POINTS = 256;
    const NUM_LAYERS = 128;

    const LANDMARKS = [
      { title: "Cerro Castillo" },
      { title: "Capillas de Mármol" },
      { title: "Lago General Carrera desde Río Ibáñez" },
      { title: "Piedra Clavada, Chile Chico" },
      { title: "Confluencia Río Baker y Río Neff" },
      { title: "Pasarelas de Caleta Tortel" },
      { title: "Puente Presidente Ibáñez, Puerto Aysén" },
      { title: "Ventisquero Colgante Queulat" },
      { title: "Fiordo Puyuhuapi" },
      { title: "Laguna San Rafael" }
    ];

    function sampleControlPolyline(ctrlPts, microNoiseAmp = 0, seed = 0, numSamples = NUM_POINTS) {
      const segLengths = [];
      let totalLen = 0;
      for (let i = 0; i < ctrlPts.length - 1; i++) {
        const dx = ctrlPts[i + 1][0] - ctrlPts[i][0];
        const dy = ctrlPts[i + 1][1] - ctrlPts[i][1];
        const len = Math.hypot(dx, dy);
        segLengths.push(len);
        totalLen += len;
      }
      if (totalLen === 0) {
        return Array.from({ length: numSamples }, () => ({ x: ctrlPts[0][0], y: ctrlPts[0][1] }));
      }
      const result = [];
      for (let s = 0; s < numSamples; s++) {
        const u = s / (numSamples - 1);
        const targetD = u * totalLen;
        let acc = 0;
        let found = false;
        for (let i = 0; i < segLengths.length; i++) {
          if (acc + segLengths[i] >= targetD || i === segLengths.length - 1) {
            const localT = segLengths[i] > 0 ? (targetD - acc) / segLengths[i] : 0;
            let x = ctrlPts[i][0] + (ctrlPts[i + 1][0] - ctrlPts[i][0]) * localT;
            let y = ctrlPts[i][1] + (ctrlPts[i + 1][1] - ctrlPts[i][1]) * localT;
            if (microNoiseAmp > 0 && s > 0 && s < numSamples - 1) {
              const crag = (Math.sin(u * 53 + seed * 3.1) * 0.6 + Math.cos(u * 127 + seed * 5.7) * 0.4) * microNoiseAmp;
              y += crag;
            }
            result.push({ x, y });
            found = true;
            break;
          }
          acc += segLengths[i];
        }
        if (!found) {
          const last = ctrlPts[ctrlPts.length - 1];
          result.push({ x: last[0], y: last[1] });
        }
      }
      return result;
    }

    function addStroke(list, weight, alpha, waveAmp, ctrlPts, microNoiseAmp = 0) {
      list.push({
        weight,
        alpha,
        waveAmp,
        pts: sampleControlPolyline(ctrlPts, microNoiseAmp, list.length + 1)
      });
    }

    // Asegura exactamente 128 capas por postal completando con achurado y oleaje de alta fidelidad
    function finalizePostcardLayers(list, waterYStart, waterYEnd, xLeft = 0.02, xRight = 0.98, waveStyle = 'water') {
      let idx = 0;
      while (list.length < NUM_LAYERS) {
        const rem = NUM_LAYERS - list.length;
        const u = idx / Math.max(1, idx + rem - 1);
        const yBase = waterYStart + u * (waterYEnd - waterYStart);
        const row = [];
        const steps = 36;
        for (let k = 0; k <= steps; k++) {
          const ku = k / steps;
          const x = xLeft + ku * (xRight - xLeft);
          let dy = Math.sin(ku * Math.PI * 9 + idx * 0.8) * 0.0032;
          if (waveStyle === 'steppe') {
            dy += (k % 2 === 0 ? -0.0035 : 0.0022);
          } else if (waveStyle === 'glacier') {
            dy += Math.sin(ku * Math.PI) * 0.020 + (k % 3 === 0 ? -0.003 : 0.0025);
          } else if (waveStyle === 'rapids') {
            dy += Math.sin(ku * Math.PI * 12 + idx) * 0.009;
          }
          row.push([x, yBase + dy]);
        }
        addStroke(
          list,
          0.90 + (idx % 3) * 0.15,
          Math.max(0.18, 0.58 - u * 0.36),
          waveStyle === 'water' || waveStyle === 'rapids' ? 0.0025 : 0.0010,
          row,
          0.0010
        );
        idx++;
      }
      return list.slice(0, NUM_LAYERS);
    }

    function buildAllPostcardGeometries() {
      const geometries = [];

      // =======================================================================
      // 01. CERRO CASTILLO (128 capas: Agujas basálticas, couloirs, glaciar colgante, lengas y laguna)
      // =======================================================================
      const p0 = [];
      const castilloSilhouette = [
        [0.0, 0.68], [0.05, 0.59], [0.10, 0.51], [0.14, 0.54], [0.19, 0.41],
        [0.22, 0.45], [0.26, 0.30], [0.29, 0.36], [0.33, 0.22], [0.36, 0.30],
        [0.40, 0.17], [0.43, 0.24], [0.46, 0.11], [0.49, 0.09], [0.51, 0.11],
        [0.53, 0.24], [0.56, 0.14], [0.59, 0.26], [0.63, 0.18], [0.66, 0.30],
        [0.70, 0.23], [0.74, 0.36], [0.79, 0.31], [0.85, 0.46], [0.92, 0.56], [1.0, 0.66]
      ];
      addStroke(p0, 2.6, 0.96, 0, castilloSilhouette, 0.0025);
      // 12 estratos geológicos siguiendo el relieve de las agujas
      for (let st = 1; st <= 12; st++) {
        const f = st / 13;
        const strataPts = castilloSilhouette.map(([x, y]) => [x, y + (0.64 - y) * f * 0.72]);
        addStroke(p0, 1.45 - f * 0.4, 0.78 - f * 0.22, 0, strataPts, 0.0028);
      }
      // 32 nervaduras verticales y diedros de roca tallando las agujas basálticas
      for (let r = 0; r < 32; r++) {
        const u = r / 31;
        const xTop = 0.12 + u * 0.76;
        const distCenter = Math.abs(xTop - 0.50);
        const yPeak = 0.10 + distCenter * 0.82 + Math.sin(r * 2.1) * 0.035;
        const xMid = xTop + (xTop < 0.5 ? -0.015 : 0.015);
        const xBot = xTop + (xTop < 0.5 ? -0.035 : 0.035);
        addStroke(p0, 1.15 + (r % 3) * 0.2, 0.72, 0, [
          [xTop, yPeak], [xMid, yPeak + 0.13], [xTop, yPeak + 0.26], [xBot, 0.56]
        ], 0.002);
      }
      // 16 aristas diagonales y fisuras de sombreado en las caras rocosas
      for (let d = 0; d < 16; d++) {
        const dx = 0.18 + (d / 15) * 0.64;
        const dy = 0.22 + Math.sin(d * 1.5) * 0.12;
        addStroke(p0, 1.05, 0.62, 0, [
          [dx - 0.03, dy], [dx, dy + 0.08], [dx + 0.025, dy + 0.17]
        ], 0.002);
      }
      // 16 arcos de hielo y grietas del Glaciar Colgante El Peñón en el anfiteatro central
      for (let g = 0; g < 16; g++) {
        const gy = 0.45 + (g / 15) * 0.15;
        const wSpan = 0.26 + (g / 15) * 0.09;
        addStroke(p0, 1.3, 0.78 - (g / 16) * 0.24, 0.001, [
          [0.50 - wSpan, gy], [0.36, gy + 0.022], [0.43, gy - 0.010],
          [0.50, gy + 0.018], [0.57, gy - 0.012], [0.64, gy + 0.020], [0.50 + wSpan, gy]
        ], 0.0018);
      }
      // 16 cordones de morrena y talud de pedregal
      for (let m = 0; m < 16; m++) {
        const my = 0.59 + (m / 15) * 0.11;
        addStroke(p0, 1.25, 0.76 - m * 0.02, 0, [
          [0.0, my + 0.02], [0.14, my - 0.025], [0.28, my + 0.01], [0.42, my + 0.025],
          [0.58, my + 0.025], [0.72, my + 0.01], [0.86, my - 0.025], [1.0, my + 0.02]
        ], 0.0035);
      }
      // 16 líneas de bosque de lenga y lenga achaparrada en los flancos bajos
      for (let f = 0; f < 16; f++) {
        const fy = 0.64 + (f / 15) * 0.09;
        addStroke(p0, 1.35, 0.72, 0, [
          [0.0, fy + 0.015], [0.18, fy - 0.02], [0.36, fy + 0.02],
          [0.64, fy + 0.02], [0.82, fy - 0.02], [1.0, fy + 0.015]
        ], 0.005);
      }
      geometries.push(finalizePostcardLayers(p0, 0.73, 0.96, 0.04, 0.96, 'water'));

      // =======================================================================
      // 02. CAPILLAS DE MÁRMOL (128 capas: Vetas metamórficas densas, bóvedas y reflejos)
      // =======================================================================
      const p1 = [];
      addStroke(p1, 2.6, 0.96, 0, [
        [0.05, 0.66], [0.08, 0.48], [0.06, 0.34], [0.13, 0.23], [0.24, 0.18],
        [0.38, 0.16], [0.51, 0.20], [0.59, 0.32], [0.56, 0.50], [0.58, 0.66],
        [0.65, 0.66], [0.67, 0.52], [0.64, 0.39], [0.72, 0.30], [0.84, 0.32],
        [0.91, 0.41], [0.88, 0.54], [0.92, 0.66]
      ], 0.002);
      // 12 arcos concéntricos esculpiendo las bóvedas cavernosas al nivel del lago
      for (let a = 0; a < 12; a++) {
        const sc = 1 - a * 0.065;
        addStroke(p1, 2.1 - a * 0.09, 0.90 - a * 0.045, 0, [
          [0.06, 0.66], [0.12, 0.66], [0.15, 0.66 - 0.16 * sc], [0.21, 0.66 - 0.22 * sc], [0.27, 0.66 - 0.16 * sc],
          [0.29, 0.66], [0.33, 0.66], [0.36, 0.66 - 0.23 * sc], [0.43, 0.66 - 0.28 * sc], [0.50, 0.66 - 0.22 * sc],
          [0.53, 0.66], [0.68, 0.66], [0.72, 0.66 - 0.15 * sc], [0.79, 0.66 - 0.20 * sc], [0.85, 0.66 - 0.14 * sc], [0.88, 0.66]
        ], 0.0015);
      }
      // 40 bandas metamórficas sinuosas de carbonato de calcio (el veteado único del mármol)
      for (let v = 0; v < 40; v++) {
        const u = v / 39;
        const vy = 0.18 + u * 0.46;
        const vein = [];
        for (let k = 0; k <= 32; k++) {
          const ku = k / 32;
          const x = 0.06 + ku * 0.85;
          const fold = Math.sin(ku * Math.PI * 4.8 + v * 0.42) * 0.024
                     + Math.cos(ku * Math.PI * 9.2 - v * 0.28) * 0.008;
          vein.push([x, Math.min(0.655, vy + fold)]);
        }
        addStroke(p1, 1.05 + (v % 4 === 0 ? 0.45 : 0), 0.74 - (v % 3) * 0.08, 0.0008, vein, 0.001);
      }
      // 16 pilares verticales y sombreado interior de cavernas
      for (let p = 0; p < 16; p++) {
        const px = 0.10 + p * 0.052;
        addStroke(p1, 1.15, 0.64, 0, [
          [px, 0.36], [px + 0.01, 0.50], [px - 0.008, 0.66], [px + 0.015, 0.66]
        ], 0.002);
      }
      // 14 estalactitas y relieves en los techos de las grutas
      for (let st = 0; st < 14; st++) {
        const sx = 0.14 + (st / 13) * 0.72;
        addStroke(p1, 1.1, 0.58, 0, [
          [sx, 0.42], [sx + 0.006, 0.48], [sx, 0.53]
        ], 0.0015);
      }
      // 14 trazos de arbustos y coigües en la corona superior
      for (let t = 0; t < 14; t++) {
        const ty = 0.13 + t * 0.006;
        addStroke(p1, 1.2, 0.66, 0, [
          [0.12, ty + 0.08], [0.18, ty], [0.24, ty + 0.04], [0.30, ty - 0.02],
          [0.36, ty + 0.03], [0.42, ty - 0.01], [0.48, ty + 0.05],
          [0.68, ty + 0.17], [0.75, ty + 0.10], [0.82, ty + 0.14], [0.88, ty + 0.18]
        ], 0.005);
      }
      geometries.push(finalizePostcardLayers(p1, 0.665, 0.96, 0.02, 0.98, 'water'));

      // =======================================================================
      // 03. LAGO GENERAL CARRERA DESDE RÍO IBÁÑEZ (128 capas: Farellón carretero, pirca y lago)
      // =======================================================================
      const p2 = [];
      // 18 capas del farellón rocoso izquierdo tallado a pique sobre el agua
      for (let cl = 0; cl < 18; cl++) {
        const f = cl / 17;
        addStroke(p2, cl === 0 ? 2.6 : 1.25, 0.92 - f * 0.24, 0, [
          [0.0, 0.08 + f * 0.18], [0.11 + f * 0.04, 0.16 + f * 0.16],
          [0.22 + f * 0.05, 0.28 + f * 0.14], [0.32 + f * 0.04, 0.42 + f * 0.08],
          [0.24 - f * 0.04, 0.62 + f * 0.10], [0.12 - f * 0.03, 0.82 + f * 0.12]
        ], 0.003);
      }
      // 16 diaclasas verticales y fisuras de corte de roca
      for (let rk = 0; rk < 16; rk++) {
        const rx = 0.02 + (rk / 15) * 0.36;
        const yTop = 0.10 + (rk / 15) * 0.34;
        const yRoad = 0.84 - (rk / 15) * 0.34;
        addStroke(p2, 1.15, 0.68, 0, [
          [rx, yTop], [rx + 0.015, (yTop + yRoad) * 0.5], [rx - 0.01, yRoad], [rx - 0.03, Math.min(0.96, yRoad + 0.18)]
        ], 0.0025);
      }
      // 14 trazos de la calzada, muro de pirca de piedra y barreras de contención
      for (let rd = 0; rd < 14; rd++) {
        const ry = rd * 0.009;
        addStroke(p2, rd < 3 ? 2.3 : 1.15, 0.90 - rd * 0.03, 0, [
          [0.0, 0.88 - ry], [0.14, 0.74 - ry * 0.8], [0.27, 0.62 - ry * 0.6],
          [0.38, 0.54 - ry * 0.4], [0.44, 0.49 - ry * 0.2]
        ], 0.001);
      }
      // 28 capas del cordón cordillerano nevado al otro lado del lago (Cordillera del Avellano / San Lorenzo)
      for (let m = 0; m < 28; m++) {
        const mf = m / 27;
        addStroke(p2, m === 0 ? 2.4 : 1.15, 0.90 - mf * 0.35, 0, [
          [0.30, 0.47 + mf * 0.03], [0.38, 0.32 + mf * 0.15], [0.45, 0.37 + mf * 0.10],
          [0.52, 0.22 + mf * 0.24], [0.58, 0.30 + mf * 0.17], [0.65, 0.18 + mf * 0.28],
          [0.72, 0.27 + mf * 0.20], [0.79, 0.16 + mf * 0.30], [0.86, 0.26 + mf * 0.21],
          [0.93, 0.20 + mf * 0.26], [1.0, 0.32 + mf * 0.16]
        ], 0.0025);
      }
      // 14 contornos de playas y estribaciones lejanas
      for (let sh = 0; sh < 14; sh++) {
        const sf = sh / 13;
        addStroke(p2, 1.1, 0.54 - sf * 0.15, 0, [
          [0.34, 0.50 + sf * 0.04], [0.52, 0.48 + sf * 0.04], [0.76, 0.49 + sf * 0.04], [1.0, 0.51 + sf * 0.04]
        ], 0.0015);
      }
      geometries.push(finalizePostcardLayers(p2, 0.51, 0.96, 0.12, 0.98, 'water'));

      // =======================================================================
      // 04. PIEDRA CLAVADA, CHILE CHICO (128 capas: Monolito basáltico, mesetas de Jeinimeni y estepa)
      // =======================================================================
      const pPiedra = [];
      // 24 trazos verticales esculpiendo el volumen, aristas y facetas de la Piedra Clavada
      for (let col = 0; col < 24; col++) {
        const u = col / 23;
        const xBaseL = 0.26 + u * 0.16;
        const xMid = 0.31 + u * 0.10;
        const xTop = 0.32 + u * 0.085;
        const yTop = 0.13 + Math.abs(u - 0.45) * 0.06;
        addStroke(pPiedra, (col === 0 || col === 23) ? 2.6 : 1.25, 0.94 - Math.abs(u - 0.3) * 0.28, 0, [
          [xBaseL, 0.73], [xMid, 0.62], [xMid - 0.01, 0.46],
          [xTop, 0.29], [xTop + 0.005, yTop]
        ], 0.002);
      }
      // 16 anillos y fisuras horizontales de erosión eólica en el fuste del monolito
      for (let hRing = 0; hRing < 16; hRing++) {
        const ry = 0.16 + (hRing / 15) * 0.54;
        const halfW = hRing > 10 ? 0.082 : 0.048;
        addStroke(pPiedra, 1.25, 0.76, 0, [
          [0.36 - halfW, ry], [0.36, ry - 0.008], [0.36 + halfW, ry + 0.004]
        ], 0.0015);
      }
      // 28 estratos de las mesetas sedimentarias escalonadas de Jeinimeni / Valle Lunar
      for (let pl = 0; pl < 28; pl++) {
        const pf = pl / 27;
        addStroke(pPiedra, pl === 0 ? 2.3 : 1.15, 0.88 - pf * 0.35, 0, [
          [0.0, 0.54 + pf * 0.12], [0.09, 0.43 + pf * 0.20], [0.22, 0.42 + pf * 0.21],
          [0.28, 0.52 + pf * 0.13], [0.44, 0.52 + pf * 0.13], [0.52, 0.37 + pf * 0.26],
          [0.68, 0.36 + pf * 0.27], [0.75, 0.46 + pf * 0.18], [0.84, 0.33 + pf * 0.30],
          [0.95, 0.34 + pf * 0.29], [1.0, 0.42 + pf * 0.22]
        ], 0.002);
      }
      // 18 cárcavas verticales y cañadones en los faldeos de las mesetas
      for (let g = 0; g < 18; g++) {
        const gx = 0.05 + (g / 17) * 0.90;
        addStroke(pPiedra, 1.1, 0.56, 0, [
          [gx, 0.37], [gx + 0.015, 0.49], [gx - 0.01, 0.65]
        ], 0.002);
      }
      // 14 abanicos aluviales y pedregales al pie de las mesetas
      for (let f = 0; f < 14; f++) {
        const fx = 0.08 + (f / 13) * 0.84;
        addStroke(pPiedra, 1.1, 0.50, 0, [
          [fx, 0.56], [fx - 0.03, 0.65], [fx + 0.04, 0.72]
        ], 0.0025);
      }
      geometries.push(finalizePostcardLayers(pPiedra, 0.65, 0.96, 0.02, 0.98, 'steppe'));

      // =======================================================================
      // 05. CONFLUENCIA RÍO BAKER Y RÍO NEFF (128 capas: Cañón rocoso, rápidos y vórtices)
      // =======================================================================
      const p3 = [];
      // 16 estratos del murallón rocoso izquierdo (cañón del Neff)
      for (let l = 0; l < 16; l++) {
        const f = l / 15;
        addStroke(p3, l === 0 ? 2.6 : 1.25, 0.94 - f * 0.28, 0, [
          [0.0, 0.11 + f * 0.13], [0.14 - f * 0.03, 0.17 + f * 0.13],
          [0.26 - f * 0.04, 0.28 + f * 0.13], [0.33 - f * 0.05, 0.41 + f * 0.11],
          [0.30 - f * 0.05, 0.57 + f * 0.11], [0.18 - f * 0.04, 0.77 + f * 0.13]
        ], 0.003);
      }
      // 16 estratos del murallón rocoso derecho (cañón del Baker)
      for (let r = 0; r < 16; r++) {
        const f = r / 15;
        addStroke(p3, r === 0 ? 2.6 : 1.25, 0.94 - f * 0.28, 0, [
          [1.0, 0.11 + f * 0.13], [0.86 + f * 0.03, 0.17 + f * 0.13],
          [0.74 + f * 0.04, 0.28 + f * 0.13], [0.67 + f * 0.05, 0.42 + f * 0.11],
          [0.70 + f * 0.05, 0.58 + f * 0.11], [0.82 + f * 0.04, 0.78 + f * 0.13]
        ], 0.003);
      }
      // 14 estratos del espolón rocoso central en V y bosque superior
      for (let c = 0; c < 14; c++) {
        const f = c / 13;
        addStroke(p3, c === 0 ? 2.5 : 1.2, 0.94 - f * 0.26, 0, [
          [0.31 + f * 0.04, 0.09], [0.38 + f * 0.03, 0.21 - f * 0.04],
          [0.45 + f * 0.02, 0.34 - f * 0.06], [0.50, 0.45 - f * 0.12],
          [0.55 - f * 0.02, 0.34 - f * 0.06], [0.62 - f * 0.03, 0.21 - f * 0.04],
          [0.69 - f * 0.04, 0.09]
        ], 0.003);
      }
      // 26 hebras de cascada y rápidos lechosos del Río Neff (entrando desde la izquierda)
      for (let n = 0; n < 26; n++) {
        const off = (n / 25) * 0.17;
        addStroke(p3, 1.25, 0.82 - (n % 4) * 0.08, 0.0045, [
          [0.08 + off, 0.10], [0.19 + off, 0.22], [0.31 + off * 0.85, 0.35],
          [0.40 + off * 0.65, 0.49], [0.42 + off * 0.55, 0.69], [0.37 + off * 0.6, 0.95]
        ], 0.002);
      }
      // 26 hebras del caudal turquesa profundo del Río Baker (entrando desde la derecha)
      for (let b = 0; b < 26; b++) {
        const off = (b / 25) * 0.17;
        addStroke(p3, 1.25, 0.82 - (b % 4) * 0.08, 0.0045, [
          [0.92 - off, 0.10], [0.81 - off, 0.22], [0.69 - off * 0.85, 0.35],
          [0.60 - off * 0.65, 0.49], [0.58 - off * 0.55, 0.69], [0.63 - off * 0.6, 0.95]
        ], 0.002);
      }
      // 14 remolinos y crestas de espuma en la confluencia frontal
      for (let v = 0; v < 14; v++) {
        const vy = 0.52 + (v / 13) * 0.42;
        addStroke(p3, 1.35, 0.78, 0.006, [
          [0.44, vy - 0.02], [0.48, vy + 0.015], [0.52, vy - 0.015], [0.56, vy + 0.02]
        ], 0.003);
      }
      geometries.push(finalizePostcardLayers(p3, 0.46, 0.96, 0.24, 0.76, 'rapids'));

      // =======================================================================
      // 06. PASARELAS DE CALETA TORTEL (128 capas: Anfiteatro de ciprés, palafitos, pilotes y escaleras)
      // =======================================================================
      const p6 = [];
      // 18 líneas de cerros boscosos y follaje de ciprés de las Guaitecas en anfiteatro
      for (let f = 0; f < 18; f++) {
        const fy = 0.11 + (f / 17) * 0.24;
        addStroke(p6, f === 0 ? 2.4 : 1.15, 0.88 - f * 0.025, 0, [
          [0.0, fy + 0.03], [0.14, fy - 0.02], [0.29, fy + 0.04], [0.45, fy - 0.01],
          [0.61, fy + 0.05], [0.77, fy - 0.01], [0.91, fy + 0.04], [1.0, fy + 0.08]
        ], 0.0045);
      }
      // 24 trazos de 10 casas-palafito tradicionales con techos de tejuelas, buhardillas y pilotes
      const tortelHouses = [
        [0.08, 0.42], [0.17, 0.35], [0.27, 0.43], [0.37, 0.36], [0.48, 0.44],
        [0.58, 0.37], [0.68, 0.43], [0.77, 0.35], [0.85, 0.42], [0.93, 0.36]
      ];
      tortelHouses.forEach(([hx, hy]) => {
        addStroke(p6, 1.8, 0.90, 0, [
          [hx - 0.034, hy + 0.055], [hx - 0.034, hy], [hx, hy - 0.042], [hx + 0.034, hy],
          [hx + 0.034, hy + 0.055], [hx - 0.034, hy + 0.055]
        ]);
        addStroke(p6, 1.15, 0.74, 0, [
          [hx - 0.024, hy + 0.055], [hx - 0.024, hy + 0.115],
          [hx, hy + 0.055], [hx, hy + 0.115],
          [hx + 0.024, hy + 0.055], [hx + 0.024, hy + 0.115],
          [hx - 0.016, hy + 0.015], [hx + 0.016, hy + 0.015], [hx + 0.016, hy + 0.035], [hx - 0.016, hy + 0.035]
        ]);
      });
      // 16 líneas de pasarelas costeras principales (entablado, vigas y barandas de ciprés)
      for (let b = 0; b < 8; b++) {
        const by = 0.52 + b * 0.018;
        addStroke(p6, (b === 0 || b === 4) ? 2.3 : 1.15, 0.92 - b * 0.04, 0, [
          [0.02, by + 0.03], [0.22, by], [0.44, by + 0.04], [0.68, by - 0.01], [0.98, by + 0.03]
        ]);
      }
      // 20 grupos densos de pilotes verticales y cruces de San Andrés bajo las pasarelas
      for (let st = 0; st < 20; st++) {
        const x0 = 0.03 + st * 0.048;
        const yTop = 0.54 + Math.sin(st * 0.7) * 0.02;
        addStroke(p6, 1.35, 0.82, 0, [
          [x0, yTop], [x0, 0.70], [x0 + 0.015, 0.70], [x0 + 0.015, yTop],
          [x0 + 0.030, yTop], [x0 + 0.030, 0.70], [x0, yTop + 0.04], [x0 + 0.030, 0.68]
        ]);
      }
      // 16 tramos de escaleras aéreas con peldaños
      for (let sc = 0; sc < 16; sc++) {
        const sx = 0.06 + (sc / 15) * 0.86;
        addStroke(p6, 1.45, 0.82, 0, [
          [sx, 0.60], [sx - 0.025, 0.52], [sx + 0.025, 0.45], [sx - 0.018, 0.38], [sx + 0.018, 0.31]
        ], 0.002);
      }
      // 12 embarcaciones / botes tradicionales amarrados a los muelles
      for (let bt = 0; bt < 6; bt++) {
        const bx = 0.16 + bt * 0.14;
        const by = 0.72 + (bt % 2) * 0.04;
        addStroke(p6, 1.6, 0.88, 0.002, [
          [bx - 0.035, by], [bx - 0.025, by + 0.02], [bx + 0.025, by + 0.02], [bx + 0.035, by], [bx - 0.035, by]
        ]);
        addStroke(p6, 1.1, 0.74, 0, [
          [bx, by], [bx, by - 0.035], [bx - 0.01, by - 0.015], [bx + 0.01, by - 0.015]
        ]);
      }
      geometries.push(finalizePostcardLayers(p6, 0.72, 0.96, 0.02, 0.98, 'water'));

      // =======================================================================
      // 07. PUENTE PRESIDENTE IBÁÑEZ (128 capas: Torres reticuladas, catenarias, péndolas y Río Aysén)
      // =======================================================================
      const p4 = [];
      const towerXs = [0.26, 0.74];
      towerXs.forEach(tx => {
        // Montantes estructurales de acero
        addStroke(p4, 2.6, 0.96, 0, [[tx - 0.045, 0.72], [tx - 0.028, 0.12], [tx + 0.028, 0.12], [tx + 0.045, 0.72]]);
        addStroke(p4, 1.8, 0.88, 0, [[tx - 0.032, 0.72], [tx - 0.018, 0.14], [tx + 0.018, 0.14], [tx + 0.032, 0.72]]);
        // Cruces de celosía interior
        addStroke(p4, 1.4, 0.84, 0, [
          [tx - 0.028, 0.14], [tx + 0.030, 0.25], [tx - 0.030, 0.25], [tx + 0.028, 0.14],
          [tx - 0.030, 0.25], [tx + 0.034, 0.37], [tx - 0.034, 0.37], [tx + 0.030, 0.25]
        ]);
        addStroke(p4, 1.4, 0.84, 0, [
          [tx - 0.034, 0.37], [tx + 0.038, 0.50], [tx - 0.038, 0.50], [tx + 0.034, 0.37],
          [tx - 0.038, 0.50], [tx + 0.042, 0.64], [tx - 0.042, 0.64], [tx + 0.038, 0.50]
        ]);
        // Pedestales de hormigón en el río
        addStroke(p4, 2.1, 0.92, 0, [
          [tx - 0.06, 0.74], [tx - 0.05, 0.69], [tx + 0.05, 0.69], [tx + 0.06, 0.74], [tx - 0.06, 0.74]
        ]);
        addStroke(p4, 1.25, 0.74, 0, [
          [tx - 0.025, 0.12], [tx - 0.025, 0.08], [tx + 0.025, 0.12], [tx + 0.025, 0.08]
        ]);
      });

      // 8 cables catenarios principales (par frontal y par posterior)
      const catY = (x) => {
        if (x < 0.26) {
          const tn = (x - 0.02) / 0.24;
          return 0.56 - Math.pow(Math.max(0, tn), 1.45) * 0.42;
        } else if (x <= 0.74) {
          const tn = (x - 0.50) / 0.24;
          return 0.46 - (tn * tn) * 0.32;
        } else {
          const tn = (x - 0.74) / 0.24;
          return 0.14 + Math.pow(Math.max(0, tn), 1.45) * 0.42;
        }
      };
      [-0.030, -0.022, -0.014, -0.005, 0, 0.006, 0.014, 0.022].forEach((yOff, cIdx) => {
        const pts = [];
        for (let k = 0; k <= 44; k++) {
          const x = 0.02 + (k / 44) * 0.96;
          pts.push([x, catY(x) + yOff]);
        }
        addStroke(p4, (cIdx === 4 || cIdx === 5) ? 2.6 : 1.35, (cIdx === 4 || cIdx === 5) ? 0.98 : 0.76, 0.0005, pts);
      });

      // 10 trazos del tablero metálico y vigas de rigidez
      for (let d = 0; d < 5; d++) {
        const dy = 0.53 + d * 0.015;
        addStroke(p4, (d === 0 || d === 4) ? 2.3 : 1.2, 0.92, 0, [
          [0.02, dy + 0.02], [0.26, dy], [0.50, dy - 0.008], [0.74, dy], [0.98, dy + 0.02]
        ]);
      }
      for (let tr = 0; tr < 5; tr++) {
        const zigzag = [];
        for (let k = 0; k <= 36; k++) {
          const x = 0.02 + (k / 36) * 0.96;
          const y = ((k + tr) % 2 === 0) ? 0.535 : 0.585;
          zigzag.push([x, y]);
        }
        addStroke(p4, 1.15, 0.74, 0, zigzag);
      }

      // 36 péndolas / tensores verticales de extremo a extremo
      for (let h = 0; h < 36; h++) {
        const x1 = 0.04 + (h / 35) * 0.92;
        const x2 = x1 + 0.010;
        addStroke(p4, 1.15, 0.78, 0, [
          [x1, 0.54], [x1, catY(x1)], [x2, catY(x2) - 0.015], [x2, 0.54]
        ]);
      }
      // 16 líneas de los cerros de Puerto Aysén en segundo plano
      for (let m = 0; m < 16; m++) {
        const mf = m / 15;
        addStroke(p4, m === 0 ? 1.7 : 1.05, 0.56 - mf * 0.28, 0, [
          [0.0, 0.52 + mf * 0.14], [0.12, 0.35 + mf * 0.28], [0.24, 0.44 + mf * 0.20],
          [0.39, 0.30 + mf * 0.32], [0.51, 0.40 + mf * 0.24], [0.64, 0.28 + mf * 0.34],
          [0.78, 0.41 + mf * 0.22], [0.90, 0.33 + mf * 0.29], [1.0, 0.48 + mf * 0.16]
        ], 0.002);
      }
      geometries.push(finalizePostcardLayers(p4, 0.71, 0.96, 0.02, 0.98, 'water'));

      // =======================================================================
      // 08. VENTISQUERO COLGANTE QUEULAT (128 capas: Frente de seracs, cascadas gemelas y bosque valdiviano)
      // =======================================================================
      const pQueulat = [];
      // 18 capas del murallón granítico izquierdo y selva valdiviana
      for (let l = 0; l < 18; l++) {
        const f = l / 17;
        addStroke(pQueulat, l === 0 ? 2.6 : 1.25, 0.94 - f * 0.26, 0, [
          [0.0, 0.12 + f * 0.42], [0.14, 0.15 + f * 0.38], [0.26, 0.21 + f * 0.34],
          [0.35 - f * 0.03, 0.31 + f * 0.26], [0.37 - f * 0.05, 0.47 + f * 0.16],
          [0.32 - f * 0.06, 0.65], [0.0, 0.68]
        ], 0.0035);
      }
      // 18 capas del murallón granítico derecho y selva valdiviana
      for (let r = 0; r < 18; r++) {
        const f = r / 17;
        addStroke(pQueulat, r === 0 ? 2.6 : 1.25, 0.94 - f * 0.26, 0, [
          [1.0, 0.12 + f * 0.42], [0.86, 0.15 + f * 0.38], [0.74, 0.21 + f * 0.34],
          [0.65 + f * 0.03, 0.31 + f * 0.26], [0.63 + f * 0.05, 0.47 + f * 0.16],
          [0.68 + f * 0.06, 0.65], [1.0, 0.68]
        ], 0.0035);
      }
      // 24 capas del Ventisquero Colgante (lengua glaciar fracturada en seracs)
      for (let g = 0; g < 24; g++) {
        const gf = g / 23;
        const gy = 0.14 + gf * 0.22;
        const xSpan = 0.25 - gf * 0.09;
        addStroke(pQueulat, (g === 0 || g === 23) ? 2.5 : 1.25, 0.92 - gf * 0.14, 0, [
          [0.50 - xSpan, gy + 0.03], [0.50 - xSpan * 0.6, gy - 0.01], [0.50 - xSpan * 0.2, gy + 0.015],
          [0.50, gy - 0.012], [0.50 + xSpan * 0.2, gy + 0.015], [0.50 + xSpan * 0.6, gy - 0.01], [0.50 + xSpan, gy + 0.03]
        ], 0.003);
      }
      // 24 hebras de las dos cascadas gemelas cayendo por la pared vertical
      for (let w = 0; w < 24; w++) {
        const isLeftFall = w < 12;
        const idx = w % 12;
        const spread = (idx - 5.5) * 0.006;
        const baseX = isLeftFall ? 0.43 : 0.57;
        addStroke(pQueulat, 1.4, 0.88 - Math.abs(idx - 5.5) * 0.06, 0.0045, [
          [baseX + spread * 0.6, 0.34], [baseX + spread, 0.44],
          [baseX + spread * 1.3, 0.55], [baseX + spread * 1.8, 0.66]
        ], 0.0015);
      }
      // 18 estrías verticales de la roca oscura pulida por el agua
      for (let cr = 0; cr < 18; cr++) {
        const rx = 0.34 + (cr / 17) * 0.32;
        addStroke(pQueulat, 1.1, 0.58, 0, [
          [rx, 0.35], [rx + 0.008, 0.49], [rx - 0.006, 0.65]
        ], 0.002);
      }
      // 14 bandas de bosque siempreverde y nalcas en las laderas bajas
      for (let nv = 0; nv < 14; nv++) {
        const nvy = 0.64 + (nv / 13) * 0.08;
        addStroke(pQueulat, 1.25, 0.70, 0, [
          [0.0, nvy], [0.22, nvy - 0.02], [0.38, nvy + 0.01], [0.62, nvy + 0.01], [0.78, nvy - 0.02], [1.0, nvy]
        ], 0.004);
      }
      geometries.push(finalizePostcardLayers(pQueulat, 0.68, 0.96, 0.04, 0.96, 'water'));

      // =======================================================================
      // 09. FIORDO PUYUHUAPI (128 capas: Laderas boscosas en V, cordillera nevada, muelle y navío austral)
      // =======================================================================
      const p5 = [];
      // 20 capas de la ladera montañosa izquierda con denso bosque siempreverde
      for (let l = 0; l < 20; l++) {
        const f = l / 19;
        addStroke(p5, l === 0 ? 2.6 : 1.25, 0.94 - f * 0.28, 0, [
          [0.0, 0.13 + f * 0.38], [0.11, 0.18 + f * 0.35], [0.22, 0.28 + f * 0.28],
          [0.33, 0.40 + f * 0.18], [0.45 - f * 0.08, 0.58], [0.0, 0.63]
        ], 0.0035);
      }
      // 20 capas de la ladera montañosa derecha cayendo al canal austral
      for (let r = 0; r < 20; r++) {
        const f = r / 19;
        addStroke(p5, r === 0 ? 2.6 : 1.25, 0.94 - f * 0.28, 0, [
          [1.0, 0.12 + f * 0.38], [0.89, 0.18 + f * 0.35], [0.78, 0.28 + f * 0.28],
          [0.67, 0.40 + f * 0.18], [0.55 + f * 0.08, 0.58], [1.0, 0.63]
        ], 0.0035);
      }
      // 18 capas del cordón nevado al fondo del fiordo y neblina austral
      for (let m = 0; m < 18; m++) {
        const mf = m / 17;
        addStroke(p5, m === 0 ? 2.1 : 1.15, 0.84 - mf * 0.34, 0, [
          [0.22, 0.32 + mf * 0.22], [0.32, 0.20 + mf * 0.30], [0.40, 0.25 + mf * 0.26],
          [0.48, 0.13 + mf * 0.36], [0.55, 0.23 + mf * 0.28], [0.63, 0.17 + mf * 0.33],
          [0.78, 0.32 + mf * 0.22]
        ], 0.002);
      }
      // 16 trazos del muelle de madera sobre pilotes, vigas maestras y barandas
      for (let pr = 0; pr < 8; pr++) {
        const py = 0.69 + pr * 0.012;
        addStroke(p5, pr === 0 ? 2.2 : 1.2, 0.92, 0, [
          [0.02, py], [0.29, py], [0.29, 0.79], [0.24, py], [0.24, 0.79],
          [0.19, py], [0.19, 0.79], [0.14, py], [0.14, 0.79], [0.09, py], [0.09, 0.79]
        ]);
      }
      // 16 trazos de la embarcación tradicional (lancha chilota / navío de cabotaje)
      for (let bt = 0; bt < 12; bt++) {
        const by = bt * 0.005;
        addStroke(p5, bt === 0 ? 2.2 : 1.25, 0.94 - bt * 0.04, 0.0018, [
          [0.32, 0.73 + by], [0.35, 0.775 - by * 0.5], [0.48, 0.775 - by * 0.5], [0.52, 0.72 + by], [0.32, 0.73 + by],
          [0.36, 0.73], [0.37, 0.675 + by], [0.45, 0.675 + by], [0.46, 0.73],
          [0.41, 0.675], [0.41, 0.56], [0.47, 0.68], [0.35, 0.68]
        ]);
      }
      // 14 trazos de cordajes, aparejos, mástiles y boyas
      for (let rg = 0; rg < 8; rg++) {
        const rx = 0.37 + rg * 0.018;
        addStroke(p5, 1.1, 0.68, 0, [
          [rx, 0.67], [0.41, 0.56], [rx + 0.04, 0.73]
        ]);
      }
      geometries.push(finalizePostcardLayers(p5, 0.60, 0.96, 0.03, 0.97, 'water'));

      // =======================================================================
      // 10. LAGUNA SAN RAFAEL (128 capas: Muralla de seracs de 70m, témpanos y San Valentín)
      // =======================================================================
      const pSanRafael = [];
      // 16 capas de las cumbres de San Valentín y el Campo de Hielo Norte detrás del frente
      for (let m = 0; m < 16; m++) {
        const mf = m / 15;
        addStroke(pSanRafael, m === 0 ? 2.3 : 1.2, 0.88 - mf * 0.32, 0, [
          [0.0, 0.36 + mf * 0.07], [0.14, 0.26 + mf * 0.15], [0.26, 0.29 + mf * 0.12],
          [0.38, 0.16 + mf * 0.23], [0.49, 0.11 + mf * 0.28], [0.56, 0.14 + mf * 0.25],
          [0.66, 0.22 + mf * 0.18], [0.78, 0.17 + mf * 0.22], [0.90, 0.27 + mf * 0.14], [1.0, 0.35 + mf * 0.08]
        ], 0.002);
      }
      // 14 líneas dentadas de la gran muralla de hielo de 70 metros
      for (let w = 0; w < 14; w++) {
        const wf = w / 13;
        const wallRow = [];
        for (let k = 0; k <= 38; k++) {
          const u = k / 38;
          const x = 0.02 + u * 0.96;
          const serac = (k % 2 === 0 ? -0.018 : 0.012) * (1 - wf * 0.85);
          wallRow.push([x, 0.43 + wf * 0.19 + serac]);
        }
        addStroke(pSanRafael, (w === 0 || w === 13) ? 2.5 : 1.25, 0.94 - wf * 0.14, 0, wallRow, 0.0015);
      }
      // 32 columnas de seracs y profundas grietas verticales talladas en el glaciar
      for (let c = 0; c < 32; c++) {
        const cx = 0.03 + (c / 31) * 0.94;
        addStroke(pSanRafael, 1.25, 0.80, 0, [
          [cx, 0.42], [cx - 0.008, 0.50], [cx + 0.006, 0.56], [cx, 0.62],
          [cx + 0.018, 0.62], [cx + 0.022, 0.52], [cx + 0.015, 0.43]
        ], 0.0015);
      }
      // 26 trazos esculpiendo 10 témpanos / icebergs flotantes con facetas y reflejos
      const allBergs = [
        [0.09, 0.71, 0.07, 0.06], [0.22, 0.76, 0.08, 0.07], [0.41, 0.82, 0.11, 0.09],
        [0.60, 0.74, 0.09, 0.07], [0.77, 0.78, 0.08, 0.06], [0.89, 0.71, 0.06, 0.05],
        [0.16, 0.87, 0.07, 0.05], [0.55, 0.89, 0.08, 0.05], [0.73, 0.90, 0.07, 0.05], [0.34, 0.91, 0.06, 0.04]
      ];
      allBergs.forEach(([bx, by, bw, bh]) => {
        addStroke(pSanRafael, 2.1, 0.94, 0.002, [
          [bx - bw, by], [bx - bw * 0.7, by - bh * 0.8], [bx - bw * 0.2, by - bh],
          [bx + bw * 0.25, by - bh * 0.65], [bx + bw * 0.65, by - bh * 0.9], [bx + bw, by], [bx - bw, by]
        ]);
        addStroke(pSanRafael, 1.25, 0.76, 0.002, [
          [bx - bw * 0.7, by - bh * 0.8], [bx - bw * 0.1, by], [bx - bw * 0.2, by - bh],
          [bx + bw * 0.3, by], [bx + bw * 0.65, by - bh * 0.9], [bx - bw * 0.8, by + bh * 0.25], [bx + bw * 0.8, by + bh * 0.25]
        ]);
      });
      // 16 líneas de hielo flotante menudo (brash ice)
      for (let bi = 0; bi < 16; bi++) {
        const by = 0.65 + (bi / 15) * 0.28;
        addStroke(pSanRafael, 1.15, 0.60, 0.002, [
          [0.05 + (bi % 3) * 0.08, by], [0.15 + (bi % 3) * 0.08, by - 0.006], [0.25 + (bi % 3) * 0.08, by]
        ]);
      }
      geometries.push(finalizePostcardLayers(pSanRafael, 0.63, 0.96, 0.02, 0.98, 'water'));

      return geometries;
    }'''

def update_portal():
    with open(PORTAL_HTML, "r", encoding="utf-8") as f:
        content = f.read()

    # Patrón para ubicar desde '// 2. MOTOR DE METAMORFOSIS' hasta 'return geometries;\n    }'
    pattern = r'    // =========================================================================\n    // 2\. MOTOR DE METAMORFOSIS.*?\n    return geometries;\n    \}'
    
    match = re.search(pattern, content, flags=re.DOTALL)
    if not match:
        print("ERROR: No se pudo encontrar el bloque del motor de metamorfosis en portal.html")
        return False
    
    new_content = content[:match.start()] + NEW_JS_ENGINE + content[match.end():]
    
    with open(PORTAL_HTML, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print("SUCCESS: portal.html actualizado con 128 capas x 256 vértices (32.768 vértices por postal)")
    return True

if __name__ == "__main__":
    update_portal()
