document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".needs-validation");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    });
  });

  const themeBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const activeTheme = savedTheme || preferredTheme;

  document.body.setAttribute("data-theme", activeTheme);
  updateThemeIcon(activeTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme = document.body.getAttribute("data-theme") || "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      document.body.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      updateThemeIcon(nextTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeBtn) return;

    themeBtn.innerHTML = theme === "dark"
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }

  const navbar = document.querySelector(".custom-navbar");

  function updateNavbarShadow() {
    if (!navbar) return;
    navbar.classList.toggle("navbar-scrolled", window.scrollY > 20);
  }

  updateNavbarShadow();
  window.addEventListener("scroll", updateNavbarShadow, { passive: true });

  document.querySelectorAll(".alert").forEach((alert) => {
    setTimeout(() => {
      alert.classList.add("fade");
      setTimeout(() => alert.remove(), 500);
    }, 4500);
  });

  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("imagePreview");

  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;

      imagePreview.src = URL.createObjectURL(file);
      imagePreview.style.display = "block";
    });
  }

  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.style.display = window.scrollY > 300 ? "flex" : "none";
    }, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
    });
  });

  if (window.L) {
    document.querySelectorAll(".travelia-mini-map").forEach((mapEl) => {
      if (mapEl.dataset.ready === "true") return;

      const lat = Number(mapEl.dataset.lat || 30.3165);
      const lng = Number(mapEl.dataset.lng || 78.0322);
      const map = L.map(mapEl, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false
      }).setView([lat, lng], 11);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18
      }).addTo(map);

      [
        [lat, lng, "Verified stays"],
        [lat + 0.04, lng + 0.06, "Local activities"],
        [lat - 0.035, lng + 0.03, "Events"],
        [lat + 0.02, lng - 0.05, "Marketplace pickup"]
      ].forEach(([markerLat, markerLng, label]) => {
        L.marker([markerLat, markerLng]).addTo(map).bindPopup(label);
      });

      mapEl.dataset.ready = "true";
      setTimeout(() => map.invalidateSize(), 150);
    });
  }
});
