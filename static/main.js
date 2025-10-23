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

/**
 * Inicializa animaciones al scroll
 * Observa elementos y les agrega clase cuando entran en viewport
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll(CONFIG.SELECTORS.HIDDEN_ELEMENTS);
  
  if (!elements.length) return;

  const observerOptions = {
    threshold: CONFIG.INTERSECTION_THRESHOLD,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(CONFIG.ANIMATION_CLASS);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

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

  /**
   * Inicializa todos los event listeners de modales
   */
  init() {
    this.attachCardListeners();
    this.attachCloseListeners();
    this.attachOutsideClickListener();
    this.attachKeyboardListener();
  }

  /**
   * Abre un modal por ID
   * @param {string} modalId - ID del modal
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.warn(`Modal con ID "${modalId}" no encontrado`);
      return;
    }

    // Cerrar modal anterior si existe
    if (this.activeModal) {
      this.closeModal(this.activeModal.id);
    }

    modal.classList.add(CONFIG.MODAL_ACTIVE_CLASS);
    modal.setAttribute('aria-hidden', 'false');
    this.activeModal = modal;
    document.body.style.overflow = 'hidden';

    // Trigger animación
    requestAnimationFrame(() => {
      modal.classList.add('open');
    });
  }

  /**
   * Cierra un modal por ID
   * @param {string} modalId - ID del modal
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove(CONFIG.MODAL_ACTIVE_CLASS);
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    this.activeModal = null;
    document.body.style.overflow = '';
  }

  /**
   * Cierra el modal activo
   */
  closeActiveModal() {
    if (this.activeModal) {
      this.closeModal(this.activeModal.id);
    }
  }

  /**
   * Vincula event listeners a las tarjetas
   */
  attachCardListeners() {
    const cards = document.querySelectorAll(CONFIG.SELECTORS.CARDS);
    
    cards.forEach(card => {
      // Click en la card completa
      card.addEventListener('click', (e) => {
        const modalId = card.getAttribute('data-modal');
        if (modalId) {
          this.openModal(modalId);
        }
      });

      // Click en el botón específico
      const button = card.querySelector(CONFIG.SELECTORS.CARD_BUTTONS);
      if (button) {
        button.addEventListener('click', (e) => {
          e.stopPropagation(); // Evitar doble click
          const modalId = card.getAttribute('data-modal');
          if (modalId) {
            this.openModal(modalId);
          }
        });
      }
    });
  }

  /**
   * Vincula event listeners a los botones cerrar
   */
  attachCloseListeners() {
    document.querySelectorAll(CONFIG.SELECTORS.CLOSE_BUTTONS).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = btn.closest(CONFIG.SELECTORS.MODALS);
        if (modal) {
          this.closeModal(modal.id);
        }
      });
    });
  }

  /**
   * Cierra modal al hacer clic fuera del contenido
   */
  attachOutsideClickListener() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal') && 
          e.target === this.activeModal) {
        this.closeActiveModal();
      }
    });
  }

  /**
   * Cierra modal al presionar ESC
   */
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

/**
 * Valida que el DOM esté listo
 * @param {Function} callback - Función a ejecutar
 */
function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

/**
 * Throttle para eventos frecuentes
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Tiempo mínimo entre ejecuciones (ms)
 * @returns {Function}
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Debounce para eventos de resize
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Retardo (ms)
 * @returns {Function}
 */
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// ============================================
// INICIALIZACIÓN
// ============================================

onDOMReady(() => {
  // Inicializar scroll animations
  initScrollAnimations();

  // Inicializar modal manager
  const modalManager = new ModalManager();

  // Log para debugging (remover en producción)
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ SILTOUR - Aplicación inicializada');
  }

  // Hacer disponible globalmente para debugging
  window.SiltourApp = {
    modalManager,
    config: CONFIG
  };
});

// ============================================
// EVENT LISTENERS ADICIONALES (OPCIONAL)
// ============================================

/**
 * Prevenir comportamientos no deseados
 */
window.addEventListener('beforeunload', (e) => {
  // Limpiar si es necesario
});

/**
 * Detectar cambios de orientación en mobile
 */
window.addEventListener('orientationchange', debounce(() => {
  console.log('Orientación cambiada');
}, 300));