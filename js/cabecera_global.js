/**
 * Cabecera global unificada de la plataforma (Alvaro Contreras Barrios).
 *
 * El marcado de <header class="brand-header"> es estatico en cada pagina (las suites de
 * verificacion lo leen del HTML y la cabecera debe existir sin JavaScript). Este modulo
 * inyecta el contenido de .brand-header si el contenedor esta vacio, marca el enlace
 * activo y fija el titulo corto del modulo.
 *
 * Uso: montarCabecera({ tituloModulo: 'Portada', activo: 'portal.html' });
 */
(function (root) {
  'use strict';

  function nombreArchivo(href) {
    return String(href || '').split('#')[0].split('?')[0].split('/').pop();
  }

  function generarHtmlCabecera(tituloModulo) {
    var modTitle = tituloModulo || 'Portada';
    return '<div class="brand-header-inner">' +
      '<div class="brand-left">' +
        '<span class="brand-dot"></span>' +
        '<a href="portal.html" class="brand-author-name" title="Volver al inicio">Álvaro Contreras Barrios</a>' +
        '<span class="brand-divider">|</span>' +
        '<span class="brand-module-title">' + modTitle + '</span>' +
      '</div>' +
      '<div class="brand-right">' +
        '<nav class="brand-nav-pills" aria-label="Navegación principal">' +
          '<a href="portal.html" class="brand-pill">Portada</a>' +
          '<a href="sistemas_complejos.html" class="brand-pill">Visualizador de Complejidad</a>' +
          '<a href="index.html" class="brand-pill">Datos de Aysén</a>' +
          '<a href="laboratorio.html" class="brand-pill">Laboratorio Sistémico</a>' +
          '<a href="https://www.linkedin.com/in/alvarocontrerasbarrios/" target="_blank" rel="noopener noreferrer" class="brand-pill" title="Visitar perfil de LinkedIn de Álvaro Contreras Barrios">' +
            '<span>LinkedIn</span>' +
            '<span class="pill-arrow">↗</span>' +
          '</a>' +
        '</nav>' +
        '<button class="mobile-menu-btn" id="btnMobileMenu" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="mobileNavDrawer" type="button">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="3" y1="6" x2="21" y2="6"></line>' +
            '<line x1="3" y1="12" x2="21" y2="12"></line>' +
            '<line x1="3" y1="18" x2="21" y2="18"></line>' +
          '</svg>' +
        '</button>' +
      '</div>' +
    '</div>';
  }

  function montarCabecera(opciones) {
    if (typeof document === 'undefined') return null;
    var cfg = opciones || {};
    var cabecera = document.querySelector('header.brand-header');
    if (!cabecera) return null;

    if (!cabecera.querySelector('.brand-header-inner')) {
      cabecera.innerHTML = generarHtmlCabecera(cfg.tituloModulo);
    }

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
