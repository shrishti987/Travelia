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

  const readStorage = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Storage can be unavailable in private browsing modes.
    }
  };

  const themeBtn = document.getElementById("theme-toggle");
  const savedTheme = readStorage("theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const activeTheme = savedTheme || preferredTheme;

  document.body.setAttribute("data-theme", activeTheme);
  updateThemeIcon(activeTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme = document.body.getAttribute("data-theme") || "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      document.body.setAttribute("data-theme", nextTheme);
      writeStorage("theme", nextTheme);
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
  let navTicking = false;

  function updateNavbarShadow() {
    if (!navbar) return;
    navbar.classList.toggle("navbar-scrolled", window.scrollY > 20);
    navTicking = false;
  }

  updateNavbarShadow();
  window.addEventListener("scroll", () => {
    if (navTicking) return;
    navTicking = true;
    window.requestAnimationFrame(updateNavbarShadow);
  }, { passive: true });

  document.querySelectorAll(".alert").forEach((alert) => {
    setTimeout(() => {
      alert.classList.add("fade");
      setTimeout(() => {
        if (alert.isConnected) alert.remove();
      }, 500);
    }, 4500);
  });

  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("imagePreview");
  let previewUrl = "";

  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = URL.createObjectURL(file);
      imagePreview.src = previewUrl;
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

  const listingGrid = document.getElementById("listingGrid");
  const densityButtons = document.querySelectorAll("[data-density]");

  if (listingGrid && densityButtons.length > 0) {
    const applyDensity = (density) => {
      const isCompact = density === "compact";
      listingGrid.classList.toggle("is-dense", isCompact);

      densityButtons.forEach((button) => {
        const isActive = button.dataset.density === density;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      writeStorage("listingDensity", density);
    };

    applyDensity(readStorage("listingDensity") || "comfort");

    densityButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyDensity(button.dataset.density || "comfort");
      });
    });
  }

  document.querySelectorAll(".booking-form[data-nightly-rate]").forEach((form) => {
    const checkIn = form.querySelector('input[name="checkIn"]');
    const checkOut = form.querySelector('input[name="checkOut"]');
    const totalTarget = document.querySelector("[data-booking-total]");
    const nightsTarget = document.querySelector("[data-booking-nights]");
    const nightlyRate = Number(form.dataset.nightlyRate || 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayValue = today.toISOString().slice(0, 10);

    if (!checkIn || !checkOut || !totalTarget || !nightsTarget) return;

    checkIn.min = todayValue;
    checkOut.min = todayValue;

    const updateEstimate = () => {
      if (checkIn.value) {
        checkOut.min = checkIn.value;
      }

      const start = new Date(checkIn.value);
      const end = new Date(checkOut.value);
      const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));

      if (!Number.isFinite(nights) || nights <= 0) {
        totalTarget.textContent = "Choose dates";
        nightsTarget.textContent = "";
        return;
      }

      const total = nights * nightlyRate;
      totalTarget.textContent = "Rs. " + total.toLocaleString("en-IN");
      nightsTarget.textContent = nights + " night" + (nights === 1 ? "" : "s") + " before taxes and fees";
    };

    checkIn.addEventListener("change", updateEstimate);
    checkOut.addEventListener("change", updateEstimate);
    updateEstimate();
  });

  document.querySelectorAll(".js-share-listing").forEach((button) => {
    button.addEventListener("click", async () => {
      const url = new URL(button.dataset.path || window.location.pathname, window.location.origin).toString();
      const title = button.dataset.title || document.title;
      const defaultHtml = button.dataset.defaultHtml || button.innerHTML;
      button.dataset.defaultHtml = defaultHtml;

      try {
        if (navigator.share) {
          await navigator.share({ title, url });
        } else {
          await copyText(url);
          button.innerHTML = '<i class="fa-solid fa-check"></i> Link copied';
          setTimeout(() => {
            button.innerHTML = defaultHtml;
          }, 1800);
        }
      } catch (error) {
        button.innerHTML = '<i class="fa-solid fa-link"></i> Copy failed';
        setTimeout(() => {
          button.innerHTML = defaultHtml;
        }, 1800);
      }
    });
  });

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  const mapTargets = document.querySelectorAll(".travelia-mini-map, .travelia-detail-map");

  if (window.L && mapTargets.length > 0) {
    const initMap = (mapEl) => {
      if (mapEl.dataset.ready === "true") return;

      const lat = Number(mapEl.dataset.lat || 30.3165);
      const lng = Number(mapEl.dataset.lng || 78.0322);
      const isDetailMap = mapEl.classList.contains("travelia-detail-map");
      const map = L.map(mapEl, {
        zoomControl: isDetailMap,
        scrollWheelZoom: false,
        attributionControl: isDetailMap
      }).setView([lat, lng], isDetailMap ? 13 : 11);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(map);

      if (isDetailMap) {
        const popupLabel = document.createElement("strong");
        popupLabel.textContent = mapEl.dataset.label || "Travelia stay";
        L.marker([lat, lng]).addTo(map).bindPopup(popupLabel).openPopup();
      } else {
        [
          [lat, lng, "Verified stays"],
          [lat + 0.04, lng + 0.06, "Local activities"],
          [lat - 0.035, lng + 0.03, "Events"],
          [lat + 0.02, lng - 0.05, "Marketplace pickup"]
        ].forEach(([markerLat, markerLng, label]) => {
          L.marker([markerLat, markerLng]).addTo(map).bindPopup(label);
        });
      }

      mapEl.dataset.ready = "true";
      setTimeout(() => map.invalidateSize(), 150);
    };

    if ("IntersectionObserver" in window) {
      const mapObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          initMap(entry.target);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "180px" });

      mapTargets.forEach((mapEl) => mapObserver.observe(mapEl));
    } else {
      mapTargets.forEach(initMap);
    }
  }
});
