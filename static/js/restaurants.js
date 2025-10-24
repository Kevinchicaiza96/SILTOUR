(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

  /* =========================
     MODALES (ya funcional)
  ========================= */
  const cards = $$('[data-modal-target]');
  const modals = $$('.modal');
  const closeBtns = $$('[data-close-modal]');
  let unlockFocus = null;
  let lastFocused = null;

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

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
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
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    if (location.hash && location.hash === '#' + modal.id) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  cards.forEach(card => {
    const targetSel = card.dataset.modalTarget;
    const modal = targetSel ? document.querySelector(targetSel) : null;
    if (!modal) return;
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

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      closeModal(modal);
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
    const content = modal.querySelector('.modal-content');
    if (content) content.addEventListener('click', e => e.stopPropagation());
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const open = document.querySelector('.modal.active');
      if (open) closeModal(open);
    }
  });

  window.addEventListener('load', () => {
    if (location.hash) {
      const targetModal = document.querySelector(location.hash);
      if (targetModal && targetModal.classList.contains('modal')) openModal(targetModal);
    }
  });

  /* =========================
     MENÚ HAMBURGUESA + SUBMENÚ MÓVIL
  ========================= */
  const hamburger = $('.hamburger-menu');
  const mobileMenu = $('.mobile-menu-pro');

  if (hamburger && mobileMenu) {
    hamburger.setAttribute('aria-expanded', 'false');

    // Abrir / cerrar menú móvil
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(mobileMenu.classList.contains('active')));
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Cerrar menú al hacer click en un enlace
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });

    // Submenús móviles (si los hay)
    mobileMenu.querySelectorAll('li').forEach(li => {
      const submenu = li.querySelector('ul');
      if (submenu) {
        li.firstElementChild.addEventListener('click', e => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            submenu.classList.toggle('open');
          }
        });
      }
    });

    // Reset en resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        mobileMenu.classList.remove('active');
        mobileMenu.querySelectorAll('ul').forEach(ul => ul.classList.remove('open'));
        hamburger.setAttribute('aria-expanded', 'false');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  }

  /* =========================
     ENH: enlaces "Get Directions" abren en nueva pestaña
  ========================= */
  $$('.modal .btn-map').forEach(a => a.setAttribute('target', '_blank'));
})();
