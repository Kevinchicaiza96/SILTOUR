// ==== Responsive Navbar ====
const hamburger = document.querySelector('.hamburger-menu');
const mobileMenu = document.querySelector('.mobile-menu-pro');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}

// ==== Modal Logic ====
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-modal]');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Función para abrir modal
function openModal(modal) {
  if (!modal) return;
  modal.classList.add('active');
  overlay.classList.add('active');
}

// Función para cerrar modal
function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');

  // Solo quitar overlay si no hay otros modales abiertos
  if (document.querySelectorAll('.modal.active').length === 0) {
    overlay.classList.remove('active');
  }
}

// Abrir modal al hacer clic en tarjeta
openModalButtons.forEach(button => {
  const modalSelector = button.dataset.modalTarget;
  const modal = document.querySelector(modalSelector);
  
  if (modal) {
    button.addEventListener('click', () => openModal(modal));
  }
});

// Cerrar modal con botón "×"
closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    closeModal(modal);
  });
});

// Cerrar modal al hacer clic fuera (overlay)
overlay.addEventListener('click', () => {
  document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal));
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal));
  }
});
