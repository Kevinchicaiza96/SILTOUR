// Abrir modales
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-modal]');
const modals = document.querySelectorAll('.modal');

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        modal.classList.add('active');
    });
});

// Cerrar modales con botón
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.modal').classList.remove('active');
    });
});

// Cerrar modales haciendo click fuera del contenido
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.classList.remove('active');
    });
});

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
    if(e.key === "Escape") {
        modals.forEach(modal => modal.classList.remove('active'));
    }
});
