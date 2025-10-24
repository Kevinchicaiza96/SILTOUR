// ======================
// MODALES
// ======================
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-modal]');
const modals = document.querySelectorAll('.modal');

// Abrir modales
openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        if(modal) modal.classList.add('active');
    });
});

// Cerrar modales con botón
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if(modal) modal.classList.remove('active');
    });
});

// Cerrar modales haciendo click fuera del contenido
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.classList.remove('active');
    });
});

// Cerrar modales con Escape
document.addEventListener('keydown', (e) => {
    if(e.key === "Escape") {
        modals.forEach(modal => modal.classList.remove('active'));
    }
});


// ======================
// MENÚ HAMBURGUESA
// ======================
const hamburger = document.querySelector('.hamburger-menu');
const mobileMenu = document.querySelector('.mobile-menu-pro');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');   // muestra/oculta menú móvil
        hamburger.classList.toggle('active');    // opcional: animación icono
    });

    // Cerrar menú móvil al hacer click en un link
    const links = mobileMenu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}
