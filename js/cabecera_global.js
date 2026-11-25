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
          '<a href="portal.html" class="brand-pill" aria-label="Ir a Portada">Portada</a>' +
          '<a href="sistemas_complejos.html" class="brand-pill" aria-label="Ir al Visualizador de Complejidad">Visualizador de Complejidad</a>' +
          '<a href="index.html" class="brand-pill" aria-label="Ir a Datos de Aysén">Datos de Aysén</a>' +
          '<a href="laboratorio.html" class="brand-pill" aria-label="Ir al Laboratorio Sistémico">Laboratorio Sistémico</a>' +
          '<a href="consultor.html" class="brand-pill" aria-label="Ir al Consultor de Datos">Consultor de Datos</a>' +
          '<a href="https://www.linkedin.com/in/alvarocontrerasbarrios/" target="_blank" rel="noopener noreferrer" class="brand-pill" aria-label="Visitar perfil de LinkedIn de Álvaro Contreras Barrios" title="Visitar perfil de LinkedIn de Álvaro Contreras Barrios">' +
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

  function generarHtmlDrawerMovil() {
    return '<div id="mobileNavDrawer" class="mobile-nav-drawer" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Menú de navegación principal">' +
      '<div class="mobile-nav-backdrop" id="mobileNavBackdrop"></div>' +
      '<div class="mobile-nav-panel" id="mobileNavPanel">' +
        '<div class="mobile-nav-header">' +
          '<div class="mobile-nav-brand">' +
            '<span class="brand-dot"></span>' +
            '<span class="mobile-nav-author">Álvaro Contreras Barrios</span>' +
          '</div>' +
          '<button class="mobile-nav-close" id="btnMobileClose" aria-label="Cerrar menú de navegación" type="button">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<line x1="18" y1="6" x2="6" y2="18"></line>' +
              '<line x1="6" y1="6" x2="18" y2="18"></line>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="mobile-nav-kicker">Plataforma Sistémica de Aysén</div>' +
        '<nav class="mobile-nav-links" aria-label="Navegación móvil">' +
          '<a href="portal.html" class="mobile-nav-link" aria-label="Ir a Portada">' +
            '<span class="mobile-nav-num">01</span>' +
            '<span class="mobile-nav-text">Portada</span>' +
            '<span class="mobile-nav-arrow">→</span>' +
          '</a>' +
          '<a href="sistemas_complejos.html" class="mobile-nav-link" aria-label="Ir al Visualizador de Complejidad">' +
            '<span class="mobile-nav-num">02</span>' +
            '<span class="mobile-nav-text">Visualizador de Complejidad</span>' +
            '<span class="mobile-nav-arrow">→</span>' +
          '</a>' +
          '<a href="index.html" class="mobile-nav-link" aria-label="Ir a Datos de Aysén">' +
            '<span class="mobile-nav-num">03</span>' +
            '<span class="mobile-nav-text">Datos de Aysén</span>' +
            '<span class="mobile-nav-arrow">→</span>' +
          '</a>' +
          '<a href="laboratorio.html" class="mobile-nav-link" aria-label="Ir al Laboratorio Sistémico">' +
            '<span class="mobile-nav-num">04</span>' +
            '<span class="mobile-nav-text">Laboratorio Sistémico</span>' +
            '<span class="mobile-nav-arrow">→</span>' +
          '</a>' +
          '<a href="consultor.html" class="mobile-nav-link" aria-label="Ir al Consultor de Datos">' +
            '<span class="mobile-nav-num">05</span>' +
            '<span class="mobile-nav-text">Consultor de Datos</span>' +
            '<span class="mobile-nav-arrow">→</span>' +
          '</a>' +
          '<a href="https://www.linkedin.com/in/alvarocontrerasbarrios/" target="_blank" rel="noopener noreferrer" class="mobile-nav-link" aria-label="Visitar perfil de LinkedIn">' +
            '<span class="mobile-nav-num">06</span>' +
            '<span class="mobile-nav-text">LinkedIn</span>' +
            '<span class="mobile-nav-arrow">↗</span>' +
          '</a>' +
        '</nav>' +
      '</div>' +
    '</div>';
  }

  function openMobileNav() {
    if (typeof document === 'undefined') return;
    var drawer = document.getElementById('mobileNavDrawer');
    var btn = document.getElementById('btnMobileMenu');
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    if (typeof document === 'undefined') return;
    var drawer = document.getElementById('mobileNavDrawer');
    var btn = document.getElementById('btnMobileMenu');
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function bindMobileNavEvents() {
    if (typeof document === 'undefined') return;
    var drawer = document.getElementById('mobileNavDrawer');
    var btnMenu = document.getElementById('btnMobileMenu');
    if (btnMenu && !btnMenu.dataset.mobileNavBound) {
      btnMenu.dataset.mobileNavBound = '1';
      btnMenu.addEventListener('click', openMobileNav);
    }
    if (!drawer || drawer.dataset.mobileNavBound) return;
    drawer.dataset.mobileNavBound = '1';

    var btnClose = document.getElementById('btnMobileClose');
    var backdrop = document.getElementById('mobileNavBackdrop');
    if (btnClose) btnClose.addEventListener('click', closeMobileNav);
    if (backdrop) backdrop.addEventListener('click', closeMobileNav);

    var linksWrap = drawer.querySelector('.mobile-nav-links');
    if (linksWrap) {
      linksWrap.addEventListener('click', function (e) {
        if (e.target && e.target.closest('.mobile-nav-link')) {
          closeMobileNav();
        }
      });
    }

    if (typeof root !== 'undefined' && root && !root.__mobileNavEscBound) {
      root.__mobileNavEscBound = true;
      root.addEventListener('keydown', function (e) {
        var activeDrawer = document.getElementById('mobileNavDrawer');
        if (e.key === 'Escape' && activeDrawer && activeDrawer.classList.contains('open')) {
          closeMobileNav();
        }
      });
    }
  }

  function montarCabecera(opciones) {
    if (typeof document === 'undefined') return null;
    var cfg = opciones || {};
    var cabecera = document.querySelector('header.brand-header, header.global-header');
    if (!cabecera) return null;

    var inner = cabecera.querySelector('.brand-header-inner, .global-header-inner');
    if (!inner) {
      cabecera.innerHTML = generarHtmlCabecera(cfg.tituloModulo);
    } else {
      // Eliminar del DOM cualquier subtitulo de seccion y divisor | que colisionen con los enlaces
      cabecera.querySelectorAll('.global-header-section, .brand-module-title, .brand-divider').forEach(function (el) {
        el.remove();
      });
      if (!document.getElementById('btnMobileMenu')) {
        var brandRight = inner.querySelector('.brand-right, .global-header-nav');
        if (!brandRight) {
          brandRight = document.createElement('div');
          brandRight.className = 'brand-right global-header-nav';
          inner.appendChild(brandRight);
        }
        brandRight.insertAdjacentHTML(
          'beforeend',
          '<button class="mobile-menu-btn" id="btnMobileMenu" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="mobileNavDrawer" type="button">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<line x1="3" y1="6" x2="21" y2="6"></line>' +
              '<line x1="3" y1="12" x2="21" y2="12"></line>' +
              '<line x1="3" y1="18" x2="21" y2="18"></line>' +
            '</svg>' +
          '</button>'
        );
      }
    }

    if (!document.getElementById('mobileNavDrawer') && document.body) {
      document.body.insertAdjacentHTML('beforeend', generarHtmlDrawerMovil());
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

    // Inicialización universal e idempotente del menú hamburguesa móvil (#btnMobileMenu -> #mobileNavDrawer)
    var btnMobileMenu = document.getElementById('btnMobileMenu');
    var mobileNavDrawer = document.getElementById('mobileNavDrawer');
    var btnMobileClose = document.getElementById('btnMobileClose');
    var mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

    if (btnMobileMenu && mobileNavDrawer && !btnMobileMenu._hasUniversalMobileNav) {
      btnMobileMenu._hasUniversalMobileNav = true;

      var openMobileNav = function (ev) {
        if (ev) ev.stopPropagation();
        mobileNavDrawer.classList.add('open');
        mobileNavDrawer.setAttribute('aria-hidden', 'false');
        btnMobileMenu.setAttribute('aria-expanded', 'true');
      };

      var closeMobileNav = function () {
        mobileNavDrawer.classList.remove('open');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
        btnMobileMenu.setAttribute('aria-expanded', 'false');
      };

      btnMobileMenu.addEventListener('click', openMobileNav);
      if (btnMobileClose) btnMobileClose.addEventListener('click', closeMobileNav);
      if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

      window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
          closeMobileNav();
        }
      });

      mobileNavDrawer.querySelectorAll('.mobile-nav-link').forEach(function (link) {
        link.addEventListener('click', closeMobileNav);
      });
    }

    bindMobileNavEvents();
    return cabecera;
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        bindMobileNavEvents();
      });
    } else {
      bindMobileNavEvents();
    }
  }

  root.montarCabecera = montarCabecera;
  root.openMobileNav = openMobileNav;
  root.closeMobileNav = closeMobileNav;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { montarCabecera: montarCabecera, openMobileNav: openMobileNav, closeMobileNav: closeMobileNav };
  }
})(typeof window !== 'undefined' ? window : globalThis);
