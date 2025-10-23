/* ============================================================
   SILVIA, CAUCA - Health Network Interaction Script
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ health.js cargado correctamente.");

  const hospitalCards = document.querySelectorAll(".hospital-card");

  // Efecto foco accesible
  hospitalCards.forEach(card => {
    card.addEventListener("focus", () => card.classList.add("focused"));
    card.addEventListener("blur", () => card.classList.remove("focused"));
  });

  // Animación de clic
  hospitalCards.forEach(card => {
    card.addEventListener("click", () => {
      card.classList.add("clicked");
      setTimeout(() => card.classList.remove("clicked"), 200);
    });
  });

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Alertas rápidas
  function showAlert(message) {
    const alertBox = document.createElement("div");
    alertBox.className = "alert-message";
    alertBox.textContent = message;
    document.body.appendChild(alertBox);

    setTimeout(() => alertBox.classList.add("visible"), 50);
    setTimeout(() => {
      alertBox.classList.remove("visible");
      setTimeout(() => alertBox.remove(), 400);
    }, 3000);
  }

  // Detecta cambios de conexión
  window.addEventListener("offline", () => showAlert("⚠️ Sin conexión. Algunas funciones pueden no estar disponibles."));
  window.addEventListener("online", () => showAlert("✅ Conexión restablecida."));

  // ===========================
  // MENÚ HAMBURGUESA (mobile)
  // ===========================
  const hamburger = document.querySelector(".hamburger-menu");
  const mobileMenu = document.querySelector(".mobile-menu-pro");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      hamburger.classList.toggle("open");
    });
  }
});
