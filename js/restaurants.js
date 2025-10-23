// static/js/script.js
// Modales accesibles + menú hamburguesa para restaurants.html
// (Funciona con la estructura HTML que me diste)
(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------------------------
     UTILIDADES
  --------------------------- */
  const isFocusable = el => el && el.matches('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])');

  function trapFocus(container) {
    const focusables = $$(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      container
    ).filter(el => el.offsetParent !== null);
    if (!focusables.length) return () => {};
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    function handle(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }

  /* ---------------------------
     MODALES
  --------------------------- */
  const cards = $$('[data-modal-target]');
  const modals = $$('.modal');
  const closeBtns = $$('[data-close-modal]');
  let unlockFocus = null;
  let lastFocused = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden'; // bloquear scroll
    // focus al primer interactivo
    const firstFocus = Array.from(modal.querySelectorAll('*')).find(isFocusable);
    if (firstFocus) firstFocus.focus();
    unlockFocus = trapFocus(modal);
    history.replaceState(null, '', '#' + (modal.id || ''));
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (typeof unlockFocus === 'function') unlockFocus();
    unlockFocus = null;
    // restaurar foco
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    // limpiar hash sin forzar recarga
    if (location.hash && location.hash === '#' + modal.id) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  // Abrir tarjetas (click + teclado)
  cards.forEach(card => {
    const targetSel = card.dataset.modalTarget;
    const modal = targetSel ? document.querySelector(targetSel) : null;
    if (!modal) return;

    // make card keyboard operable
    card.setAttribute('role', 'button');
    card.setAttribute('aria-controls', modal.id || '');
    card.addEventListener('click', () => openModal(modal));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(modal);
      }
    });
  });

  // Cerrar con los botones de cierre
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      closeModal(modal);
    });
  });

  // Cerrar al click en overlay
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    // prevenir que clicks dentro del contenido burbujen al overlay
    const content = modal.querySelector('.modal-content');
    if (content) {
      content.addEventListener('click', (e) => e.stopPropagation());
    }
  });

  // Teclado global: Esc para cerrar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const open = document.querySelector('.modal.active');
      if (open) closeModal(open);
    }
  });

  // Si la página carga con hash #modalX abre el modal correspondiente
  window.addEventListener('load', () => {
    if (location.hash) {
      const targetModal = document.querySelector(location.hash);
      if (targetModal && targetModal.classList.contains('modal')) {
        openModal(targetModal);
      }
    }
  });

  /* ---------------------------
     MENÚ HAMBURGUESA (móvil)
  --------------------------- */
  const hamburger = $('.hamburger-menu');
  const navList = $('.nav-links-pro ul');

  if (hamburger && navList) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      // toggling simple: añadir clase o inline style
      if (!expanded) {
        navList.style.display = 'flex';
        navList.style.flexDirection = 'column';
        navList.style.gap = '10px';
        navList.style.background = 'rgba(0,0,0,0.6)';
        navList.style.position = 'absolute';
        navList.style.right = '20px';
        navList.style.top = '60px';
        navList.style.padding = '12px';
        navList.style.borderRadius = '8px';
      } else {
        navList.style.display = '';
        navList.style.position = '';
        navList.style.right = '';
        navList.style.top = '';
        navList.style.padding = '';
        navList.style.borderRadius = '';
        navList.style.background = '';
        navList.style.flexDirection = '';
      }
    });

    // Asegurar que el nav vuelve a su estado normal en resize desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navList.style.display = '';
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------
     ENH: enlaces "Get Directions" en modales abren en nueva pestaña (ya lo hacen),
     pero nos aseguramos que tengan target si alguien los quita en el HTML.
  --------------------------- */
  $$('.modal .btn-map').forEach(a => a.setAttribute('target', '_blank'));

  /* ---------------------------
     PREVENCIÓN: si JS está deshabilitado los modales siguen en DOM,
     pero sin interactividad. Nada más que hacer.
  --------------------------- */

})();

// ============================
// 📱 MENÚ HAMBURGUESA
// ============================
const menuBtn = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links-pro');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuBtn.querySelector('i').classList.toggle('fa-bars');
  menuBtn.querySelector('i').classList.toggle('fa-times');
});

