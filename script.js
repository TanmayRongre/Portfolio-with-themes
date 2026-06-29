// --- Cursor Elements ---
const cursorDot = document.querySelector("#data-cursor-dot");
const cursorOutline = document.querySelector("#data-cursor-outline");

// --- Touch Device Detection --- (checks the desktop or tablet or mobile)
const isTouchDevice = window.matchMedia(
  "(hover: none) and (pointer: coarse)",
).matches;

// --- if mobile or tablet, no cursor style ---
if (isTouchDevice || !cursorDot || !cursorOutline) {
  document.documentElement.style.setProperty("cursor", "auto", "important");
  if (cursorDot) cursorDot.style.display = "none";
  if (cursorOutline) cursorOutline.style.display = "none";
}

// --- Cursor Tracking ---
else {
  window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate(
      { left: `${posX}px`, top: `${posY}px` },
      { duration: 500, fill: "both" },
    );
  });

  // --- Cursor Hover State ---     (elements using the effect)
  const interactiveElements = document.querySelectorAll(
    "a, button, input, textarea, .portal-btn, .verify-btn, .hire-button, .submit-btn, .service-item, .cert-card, .project-card, .social-icon-btn",
  );

  //adding removing effect (for all elements above)
  interactiveElements.forEach((el) => {
    //add effect
    el.addEventListener("mouseenter", () => {
      cursorDot.classList.add("cursor-hover");
      cursorOutline.classList.add("cursor-hover");
    });

    //remove effect
    el.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("cursor-hover");
      cursorOutline.classList.remove("cursor-hover");
    });
  });
}

// --- Scroll Reveal Animation (Using Scroll Event Listener) ---
document.addEventListener("DOMContentLoaded", function () {

  // ============================================================
  //  THEME MANAGER
  // ============================================================
  (function () {
    const html = document.documentElement;

    // --- DOM refs ---
    const toggleBtn      = document.getElementById("themeToggleBtn");
    const toggleIcon     = document.getElementById("themeToggleIcon");
    const panel          = document.getElementById("themePanel");
    const closeBtn       = document.getElementById("themePanelClose");
    const modeBtns       = document.querySelectorAll(".theme-mode-btn");
    const customSection  = document.getElementById("themeCustomSection");
    const presets        = document.querySelectorAll(".preset-swatch");
    const colorPicker    = document.getElementById("customColorPicker");
    const hexDisplay     = document.getElementById("customColorHex");
    const applyBtn       = document.getElementById("applyCustomColor");

    // --- Saved state keys ---
    const STORAGE_MODE   = "tr-theme-mode";
    const STORAGE_ACCENT = "tr-theme-accent";

    const MODE_ICONS = {
      dark:   "🌑",
      light:  "☀️",
      custom: "🎨",
    };

    // --- Utility: hex → rgba glow ---
    function hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // --- Apply accent color to CSS variables ---
    function applyAccent(hex) {
      html.style.setProperty("--web-color", hex);
      html.style.setProperty("--web-color-glow", hexToRgba(hex, 0.4));
      html.style.setProperty("--hover-shadow", `0 15px 35px ${hexToRgba(hex, 0.2)}`);

      // Sync color picker and hex display
      if (colorPicker) colorPicker.value = hex;
      if (hexDisplay)  hexDisplay.textContent = hex.toUpperCase();

      // Mark the matching preset swatch as selected
      presets.forEach((sw) => {
        sw.classList.toggle("selected", sw.dataset.color.toUpperCase() === hex.toUpperCase());
      });

      localStorage.setItem(STORAGE_ACCENT, hex);
    }

    // --- Reset accent to root default (dark/light modes) ---
    function resetAccent() {
      html.style.removeProperty("--web-color");
      html.style.removeProperty("--web-color-glow");
      html.style.removeProperty("--hover-shadow");
      presets.forEach((sw) => sw.classList.remove("selected"));
    }

    // --- Apply a full theme mode ---
    function applyMode(mode, accent) {
      // Set data-theme attribute on <html>
      if (mode === "light") {
        html.setAttribute("data-theme", "light");
      } else {
        html.removeAttribute("data-theme");
      }

      // Update toggle icon
      if (toggleIcon) toggleIcon.textContent = MODE_ICONS[mode] || "🌑";

      // Update active pill
      modeBtns.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.mode === mode);
      });

      // Show/hide custom section
      if (customSection) {
        customSection.classList.toggle("visible", mode === "custom");
      }

      // Apply accent if custom; else reset to CSS root default
      if (mode === "custom" && accent) {
        applyAccent(accent);
      } else {
        resetAccent();
      }

      localStorage.setItem(STORAGE_MODE, mode);
    }

    // --- Panel open / close ---
    function openPanel() {
      panel.classList.add("panel-open");
      panel.setAttribute("aria-hidden", "false");
    }

    function closePanel() {
      panel.classList.remove("panel-open");
      panel.setAttribute("aria-hidden", "true");
    }

    function togglePanel() {
      panel.classList.contains("panel-open") ? closePanel() : openPanel();
    }

    // --- Close panel on outside click ---
    document.addEventListener("click", (e) => {
      if (panel && toggleBtn && !panel.contains(e.target) && !toggleBtn.contains(e.target)) {
        closePanel();
      }
    });

    // --- Event listeners ---
    if (toggleBtn) toggleBtn.addEventListener("click", (e) => { e.stopPropagation(); togglePanel(); });
    if (closeBtn)  closeBtn.addEventListener("click", closePanel);

    modeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode   = btn.dataset.mode;
        const accent = localStorage.getItem(STORAGE_ACCENT) || "#FF4A1C";
        applyMode(mode, accent);
      });
    });

    // Preset swatches — instant apply + persist
    presets.forEach((sw) => {
      sw.addEventListener("click", () => {
        applyAccent(sw.dataset.color);
      });
    });

    // Color picker — live preview on drag/change (no persist yet)
    if (colorPicker) {
      colorPicker.addEventListener("input", () => {
        if (hexDisplay) hexDisplay.textContent = colorPicker.value.toUpperCase();
        // Live preview: update CSS vars without saving to localStorage yet
        html.style.setProperty("--web-color", colorPicker.value);
        html.style.setProperty("--web-color-glow", hexToRgba(colorPicker.value, 0.4));
        presets.forEach((sw) => sw.classList.remove("selected"));
      });
    }

    // Apply button — confirms and persists color picker value
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        applyAccent(colorPicker.value);
      });
    }

    // --- Init: restore saved mode and accent on page load ---
    const savedMode   = localStorage.getItem(STORAGE_MODE)   || "dark";
    const savedAccent = localStorage.getItem(STORAGE_ACCENT) || "#FF4A1C";

    // Sync color picker initial value
    if (colorPicker) {
      colorPicker.value = savedAccent;
      if (hexDisplay) hexDisplay.textContent = savedAccent.toUpperCase();
    }

    applyMode(savedMode, savedAccent);

  })(); // end theme manager IIFE

  // ============================================================
  //  SCROLL REVEAL
  // ============================================================

  const revealTargets = document.querySelectorAll(
    ".project-card, .projects-header, .service-item, .cert-card, .about-top-row, .hero-content, .contact-layout-container, .about-certificates, .projects-grid",
  );

  // Initial state: hide everything
  revealTargets.forEach((el) => el.classList.add("reveal-up"));

  function checkScroll() {
    const triggerBottom = window.innerHeight - 40; // Mimics the -40px rootMargin

    revealTargets.forEach((el) => {
      // Skip elements that are already fully revealed
      if (el.classList.contains("in-view")) return;

      //see current position of elememt top
      const elementTop = el.getBoundingClientRect().top;

      // Check if the top of the element has crossed into the viewport
      if (elementTop < triggerBottom) {
        // Staggering Logic: Find unrevealed siblings in the same parent container
        const siblings = [
          ...(el.parentElement || document.body).querySelectorAll(
            ".reveal-up:not(.in-view)",
          ),
        ];

        setTimeout(
          () => {
            el.classList.add("in-view");
          },
          siblings.indexOf(el) * 90,
        );
      }
    });
  }
  // Run once on load in case items are already visible on screen
  checkScroll();

  // Optimized Scroll Listener
  let isScrolling = false;
  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        checkScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // ============================================================
  //  ID CARD SPRING PHYSICS
  // ============================================================

  const nameCard = document.getElementById("name-card");
  if (nameCard && !isTouchDevice) {
    nameCard.style.animation = "none";

    // Spring state
    let rotX = 0,
      rotY = 0,
      scale = 1; // current values
    let velX = 0,
      velY = 0,
      velS = 0; // velocities
    let targetX = 0,
      targetY = 0,
      targetS = 1; // targets
    let isHovered = false;
    let mouseRX = 0,
      mouseRY = 0; // hover targets from mouse
    const STIFFNESS = 0.1; // spring stiffness  (0‥1, higher = snappier)
    const DAMPING = 0.72; // velocity damping  (0‥1, higher = less bounce)
    const IDLE_AMP_X = 1.8; // idle float amplitude X (deg)
    const IDLE_AMP_Y = 1.2; // idle float amplitude Y (deg)
    const IDLE_SPEED = 0.0004; // radians per ms

    let lastTime = null;
    let elapsed = 0;

    function tick(now) {
      if (lastTime !== null) {
        const dt = Math.min(now - lastTime, 50); // cap delta to prevent jumps on tab refocus
        elapsed += dt;
      }
      lastTime = now;

      if (isHovered) {
        targetX = mouseRX;
        targetY = mouseRY;
        targetS = 1.03;
      } else {
        // Idle: slow sine-wave pendulum
        targetX = Math.sin(elapsed * IDLE_SPEED * 0.7) * IDLE_AMP_X;
        targetY = Math.cos(elapsed * IDLE_SPEED) * IDLE_AMP_Y;
        targetS = 1;
      }

      // Spring integration
      velX = (velX + (targetX - rotX) * STIFFNESS) * DAMPING;
      velY = (velY + (targetY - rotY) * STIFFNESS) * DAMPING;
      velS = (velS + (targetS - scale) * STIFFNESS) * DAMPING;
      rotX += velX;
      rotY += velY;
      scale += velS;

      nameCard.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(3)}deg) rotateY(${rotY.toFixed(3)}deg) scale(${scale.toFixed(4)})`;

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // Track mouse position — update targets, not transform directly
    nameCard.addEventListener("mousemove", (e) => {
      const rect = nameCard.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      mouseRX = -ny * 14; // tilt up to ±14°
      mouseRY = nx * 14;
    });

    nameCard.addEventListener("mouseenter", () => {
      isHovered = true;
      nameCard.style.boxShadow =
        "0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(255,74,28,0.35)";
    });

    nameCard.addEventListener("mouseleave", () => {
      isHovered = false;
      nameCard.style.boxShadow = "";
      // No timeout needed — spring naturally decays to idle float
    });
  }
});
