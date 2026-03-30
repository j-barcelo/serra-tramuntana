/**
 * Import dependencies from node_modules
 * see commented examples below
 */

// import 'some-node-module';
// import SomeModule from 'some-node-module';

/**
 * Write any other JavaScript below
 */

import { animate, inView  } from "motion";

/* ══════════════════════════════════════
    Tabs amb animacions
   ══════════════════════════════════════ */
const tabList = document.querySelector(".racons__tabpanel");

if (tabList) {
  // Crea l'indicador
    const indicator = document.createElement("span");
    indicator.className = "racons__tab-indicator";
    indicator.setAttribute("aria-hidden", "true");
    tabList.appendChild(indicator);

  const raconsSection = document.querySelector(".racons");
  const tabs = Array.from(tabList.querySelectorAll('.racons__tab-btn'));
  const panels = Array.from(raconsSection.querySelectorAll("div[role='tabpanel']"));

  // Aplica la variant per modificar el color segons la categoria
  function applyTabVariant(tabKey) {
    if (!raconsSection) return;
    raconsSection.classList.remove("racons--patrimoni", "racons--natura");
    if (tabKey === "patrimoni" || tabKey === "natura") {
      raconsSection.classList.add(`racons--${tabKey}`);
    }
  }

  // Mou i redimensiona l'indicador del tab actiu
  function updateIndicator(tab, withAnimation = true) {
    if (!indicator || !tab) return;

    const tabRect = tab.getBoundingClientRect();
    const x = tab.offsetLeft;
    const y = tab.offsetTop;

    indicator.style.top = `${y}px`;
    indicator.style.height = `${tabRect.height}px`;

    if (withAnimation) {
      animate(indicator, { x, width: tabRect.width }, { duration: 0.35, easing: "easeInOut" });
    } else {
      indicator.style.transform = `translateX(${x}px)`;
      indicator.style.width = `${tabRect.width}px`;
    }
  }

  function setActiveTab(tab, withAnimation = true) {
    tabs.forEach((btn) => {
      const isActive = btn === tab;
      btn.classList.toggle("racons__tab-btn--active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    const category = tab?.dataset?.tab;
    applyTabVariant(category);
    // Mostra/oculta els panels corresponents
    panels.forEach((panel) => { panel.hidden = panel.id !== `tab-${category}`;});
    updateIndicator(tab, withAnimation);
  }

  // Inicialització (sense animació)
  const initialTab = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
  if (initialTab) setActiveTab(initialTab, false);

  tabs.forEach((tab) => { tab.addEventListener("click", () => setActiveTab(tab)) });

  // Recalcula l'indicador en resize
  window.addEventListener("resize", () => {
    const activeTab = tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
    if (activeTab) updateIndicator(activeTab, false);
  });
}


/* ══════════════════════════════════════
    Previsualització d'enllaços
   ══════════════════════════════════════ */
const preview = document.createElement("div");
preview.className = "preview";
document.body.appendChild(preview);

let rafId = null; // Control del requestAnimationFrame

function initPreview(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const key = el.dataset.previewKey?.trim();
      if (!key) return;

      preview.className = `preview preview--${key}`;
      updatePosition(0, 0)

      animate(preview, { opacity: [0, 1], scale: [0.9, 1], y: [10, 0] }, { duration: 0.25, easing: [0.34, 1.56, 0.64, 1] });
    });

    el.addEventListener("mousemove", (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {updatePosition(e.clientX, e.clientY)});
    });

    el.addEventListener("mouseleave", () => {
      animate( preview, { opacity: [1, 0], scale: [1, 0.9], y: [0, 8] }, { duration: 0.2 });
    });
  });
};

function updatePosition(x, y) {
  preview.style.left = `${x + 20}px`;
  preview.style.top = `${y - 80}px`;
};

initPreview("[data-preview-key]");

/* ══════════════════════════════════════
    Animacions hero section
   ══════════════════════════════════════ */
animate(".hero__location", { opacity: [0, 1], y: [-20, 0] }, { duration: 0.4, delay: 0.1, easing: "easeOut" });
animate(".hero__container h1", { opacity: [0, 1], y: [40, 0] }, { duration: 0.5, delay: 0.3, easing: [0.25, 0.1, 0.25, 1] });
animate(".hero__description", { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, delay: 0.4, easing: "easeOut" });
animate(".hero__btn", { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, delay: 0.6, easing: "easeOut" });

inView(".hero__btn", (el) => {
  let interval = setInterval(() => {
    animate(el, { rotate: [0, 20, -20, 0] }, { duration: 0.6});
  }, 5000);

  return () => clearInterval(interval);
});