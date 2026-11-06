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
    return '<div class="brand-header-inner global-header-inner">' +
      '<div class="brand-left global-header-brand">' +
        '<span class="brand-dot"></span>' +
        '<a href="portal.html" class="brand-author-name" title="Volver al inicio">Álvaro Contreras Barrios</a>' +
      '</div>' +
      '<div class="brand-right global-header-nav">' +
        '<nav class="brand-nav-pills" aria-label="Navegación principal">' +
          '<a href="portal.html" class="brand-pill">Portada</a>' +
          '<a href="sistemas_complejos.html" class="brand-pill">Visualizador de Complejidad</a>' +
          '<a href="index.html" class="brand-pill">Datos de Aysén</a>' +
          '<a href="laboratorio.html" class="brand-pill">Laboratorio Sistémico</a>' +
          '<a href="consultor.html" class="brand-pill">Consultor de Datos</a>' +
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
    var cabecera = document.querySelector('header.brand-header, header.global-header');
    if (!cabecera) return null;

    if (!cabecera.querySelector('.brand-header-inner, .global-header-inner')) {
      cabecera.innerHTML = generarHtmlCabecera(cfg.tituloModulo);
    } else {
      // Eliminar del DOM cualquier subtitulo de seccion y divisor | que colisionen con los enlaces
      cabecera.querySelectorAll('.global-header-section, .brand-module-title, .brand-divider').forEach(function (el) {
        el.remove();
      });
    }

    // Garantizar que el enlace a consultor.html exista en .brand-nav-pills si el HTML estatico no lo contenia
    var navPills = cabecera.querySelector('.brand-nav-pills');
    if (navPills && !navPills.querySelector('a[href*="consultor.html"]')) {
      var consultorA = document.createElement('a');
      consultorA.href = 'consultor.html';
      consultorA.className = 'brand-pill';
      consultorA.textContent = 'Consultor de Datos';
      var linkedIn = navPills.querySelector('a[href*="linkedin"]');
      if (linkedIn) navPills.insertBefore(consultorA, linkedIn);
      else navPills.appendChild(consultorA);
    }

    var mobileLinks = document.querySelector('#mobileNavDrawer .mobile-nav-links');
    if (mobileLinks && !mobileLinks.querySelector('a[href*="consultor.html"]')) {
      var mobileConsultor = document.createElement('a');
      mobileConsultor.href = 'consultor.html';
      mobileConsultor.className = 'mobile-nav-link';
      mobileConsultor.innerHTML = '<span class="mobile-nav-num">05</span><span class="mobile-nav-text">Consultor de Datos</span><span class="mobile-nav-arrow">→</span>';
      var linkedInMob = mobileLinks.querySelector('a[href*="linkedin"]');
      if (linkedInMob) {
        var numSpan = linkedInMob.querySelector('.mobile-nav-num');
        if (numSpan) numSpan.textContent = '06';
        mobileLinks.insertBefore(mobileConsultor, linkedInMob);
      } else {
        mobileLinks.appendChild(mobileConsultor);
      }
    }

    if (cfg.activo) {
      cabecera.querySelectorAll('.brand-nav-pills .brand-pill').forEach(function (enlace) {
        var esActivo = nombreArchivo(enlace.getAttribute('href')) === cfg.activo;
        enlace.classList.toggle('active', esActivo);
        if (esActivo) enlace.setAttribute('aria-current', 'page');
        else enlace.removeAttribute('aria-current');
      });
      if (mobileLinks) {
        mobileLinks.querySelectorAll('.mobile-nav-link').forEach(function (link) {
          var esActivo = nombreArchivo(link.getAttribute('href')) === cfg.activo;
          link.classList.toggle('active', esActivo);
        });
      }
    }
    return cabecera;
  }

  root.montarCabecera = montarCabecera;
  if (typeof module !== 'undefined' && module.exports) module.exports = { montarCabecera: montarCabecera };
})(typeof window !== 'undefined' ? window : globalThis);
