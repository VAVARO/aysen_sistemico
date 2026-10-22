/**
 * Cabecera global unificada de la plataforma (Alvaro Contreras Barrios).
 *
 * El marcado de <header class="brand-header"> es estatico en cada pagina (las suites de
 * verificacion lo leen del HTML y la cabecera debe existir sin JavaScript). Este modulo
 * solo marca el enlace activo y fija el titulo corto del modulo.
 *
 * Uso: montarCabecera({ tituloModulo: 'Portada', activo: 'portal.html' });
 */
(function (root) {
  'use strict';

  function nombreArchivo(href) {
    return String(href || '').split('#')[0].split('?')[0].split('/').pop();
  }

  function montarCabecera(opciones) {
    var cfg = opciones || {};
    var cabecera = document.querySelector('header.brand-header');
    if (!cabecera) return null;

    if (cfg.tituloModulo) {
      var titulo = cabecera.querySelector('.brand-module-title');
      if (titulo && titulo.textContent.trim() !== cfg.tituloModulo) {
        titulo.textContent = cfg.tituloModulo;
      }
    }

    if (cfg.activo) {
      cabecera.querySelectorAll('.brand-nav-pills .brand-pill').forEach(function (enlace) {
        var esActivo = nombreArchivo(enlace.getAttribute('href')) === cfg.activo;
        enlace.classList.toggle('active', esActivo);
        if (esActivo) enlace.setAttribute('aria-current', 'page');
        else enlace.removeAttribute('aria-current');
      });
    }
    return cabecera;
  }

  root.montarCabecera = montarCabecera;
  if (typeof module !== 'undefined' && module.exports) module.exports = { montarCabecera: montarCabecera };
})(typeof window !== 'undefined' ? window : globalThis);
