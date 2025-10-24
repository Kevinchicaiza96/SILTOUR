/**
 * SILTOUR - Main Application Script
 */

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

const CONFIG = {
  INTERSECTION_THRESHOLD: 0.2,
  ANIMATION_CLASS: 'show',
  HIDDEN_CLASS: 'hidden',
  MODAL_ACTIVE_CLASS: 'active',
  SELECTORS: {
    HIDDEN_ELEMENTS: '.hidden',
    CARDS: '.card',
    MODALS: '.modal',
    CLOSE_BUTTONS: '.close',
    CARD_BUTTONS: '.card-button'
  }
};

// ============================================
// SCROLL ANIMATIONS - IntersectionObserver
// ============================================

function initScrollAnimations() {
  const elements = document.querySelectorAll(CONFIG.SELECTORS.HIDDEN_ELEMENTS);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(CONFIG.ANIMATION_CLASS);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: CONFIG.INTERSECTION_THRESHOLD,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// MODAL MANAGEMENT
// ============================================

class ModalManager {
  constructor() {
    this.activeModal = null;
    this.init();
  }

  init() {
    this.attachCardListeners();
    this.attachCloseListeners();
    this.attachOutsideClickListener();
    this.attachKeyboardListener();
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.warn(`Modal con ID "${modalId}" no encontrado`);
      return;
    }

    if (this.activeModal) this.closeModal(this.activeModal.id);

    modal.classList.add(CONFIG.MODAL_ACTIVE_CLASS);
    modal.setAttribute('aria-hidden', 'false');
    this.activeModal = modal;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => modal.classList.add('open'));
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove(CONFIG.MODAL_ACTIVE_CLASS, 'open');
    modal.setAttribute('aria-hidden', 'true');
    this.activeModal = null;
    document.body.style.overflow = '';
  }

  closeActiveModal() {
    if (this.activeModal) this.closeModal(this.activeModal.id);
  }

  attachCardListeners() {
    const cards = document.querySelectorAll(CONFIG.SELECTORS.CARDS);
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const modalId = card.getAttribute('data-modal');
        if (modalId) this.openModal(modalId);
      });

      const button = card.querySelector(CONFIG.SELECTORS.CARD_BUTTONS);
      if (button) {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const modalId = card.getAttribute('data-modal');
          if (modalId) this.openModal(modalId);
        });
      }
    });
  }

  attachCloseListeners() {
    document.querySelectorAll(CONFIG.SELECTORS.CLOSE_BUTTONS).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = btn.closest(CONFIG.SELECTORS.MODALS);
        if (modal) this.closeModal(modal.id);
      });
    });
  }

  attachOutsideClickListener() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal') && e.target === this.activeModal) {
        this.closeActiveModal();
      }
    });
  }

  attachKeyboardListener() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeActiveModal();
      }
    });
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// ============================================
// INICIALIZACIÓN
// ============================================

onDOMReady(() => {
  initScrollAnimations();
  const modalManager = new ModalManager();

  // ================================
  // MENÚ HAMBURGUESA (CORREGIDO)
  // ================================
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileMenu = document.querySelector('.mobile-menu-pro');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('open');
    });
  }

  console.log('✅ SILTOUR - Aplicación inicializada');
  window.SiltourApp = { modalManager, config: CONFIG };
});

// ============================================
// EVENTOS ADICIONALES
// ============================================

window.addEventListener('beforeunload', () => {
  // Limpieza si se requiere
});

window.addEventListener('orientationchange', debounce(() => {
  console.log('Orientación cambiada');
}, 300));
