/* ============================================================
SILVIA, CAUCA - Tourist Attractions JS
============================================================ */

// =======================
// 📱 MENÚ HAMBURGUESA
// =======================
const menuBtn = document.querySelector('.hamburger-menu');
const mobileMenu = document.querySelector('.mobile-menu-pro');
const menuIcon = menuBtn.querySelector('i');

// Verificamos que existan (evita errores si se reutiliza el JS en otras páginas)
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');

    // Alternar ícono (hamburguesa ↔ X)
    if (mobileMenu.classList.contains('active')) {
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-times');
    } else {
      menuIcon.classList.remove('fa-times');
      menuIcon.classList.add('fa-bars');
    }
  });

  // Cierra el menú si se hace clic en un enlace
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      menuIcon.classList.remove('fa-times');
      menuIcon.classList.add('fa-bars');
    });
  });
}

// =======================
// 🌐 SCROLL SUAVE (opcional)
// =======================
// Aplica desplazamiento suave a los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId.length > 1 && document.querySelector(targetId)) {
      e.preventDefault();
      document.querySelector(targetId).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// =======================
// 🔝 BOTÓN IR ARRIBA (opcional)
// =======================
const scrollBtn = document.createElement('button');
scrollBtn.classList.add('scroll-top-btn');
scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollBtn);

scrollBtn.style.cssText = `
  position: fixed;
  bottom: 25px;
  right: 25px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: var(--transition);
  z-index: 999;
`;

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollBtn.style.display = 'flex';
  } else {
    scrollBtn.style.display = 'none';
  }
});
