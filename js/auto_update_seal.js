/* Sello sobrio de actualizacion mensual automatica.
   Lee window.AYSEN_HUBS_DATA.meta.autoUpdate (generado por scripts/build_aysen_hubs_bundle.cjs
   a partir de data/systemic/auto_update_status.json) y rellena #autoUpdateSeal. */
(function () {
  'use strict';

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    try {
      return d.toLocaleDateString('es-CL', {
        day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Santiago'
      }).replace(/\//g, '-');
    } catch (e) {
      return iso.slice(0, 10);
    }
  }

  function render() {
    var el = document.getElementById('autoUpdateSeal');
    if (!el) return;
    var data = window.AYSEN_HUBS_DATA;
    var meta = data && data.meta && data.meta.autoUpdate;
    if (!meta) { el.hidden = true; return; }
    var parts = [];
    var fecha = meta.lastRun ? formatDate(meta.lastRun) : null;
    parts.push(fecha ? '\u00daltima revisi\u00f3n autom\u00e1tica ' + fecha : 'Revisi\u00f3n autom\u00e1tica pendiente');
    parts.push('Ciclo ' + String(meta.frequency || 'Mensual').replace(/^Mensual/, 'mensual') + ' activo');
    if (meta.activeApiConnectors) parts.push(meta.activeApiConnectors + ' conectores API');
    if (meta.totalSources) parts.push(meta.totalSources + ' fuentes vigiladas');
    el.textContent = parts.join(' \u00b7 ');
    el.hidden = false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
