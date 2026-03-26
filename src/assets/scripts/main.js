/**
 * Import dependencies from node_modules
 * see commented examples below
 */

// import 'some-node-module';
// import SomeModule from 'some-node-module';

/**
 * Write any other JavaScript below
 */

import { animate } from "motion";


const tabList = document.querySelector(".racons__tabpanel");

if (tabList) {
    // Crea l'indicador
    const indicator = document.createElement("span");
    indicator.className = "racons__tab-indicator";
    indicator.setAttribute("aria-hidden", "true");
    tabList.appendChild(indicator);

    const raconsSection = document.querySelector(".racons");
    const tabs = Array.from(tabList.querySelectorAll('.racons__tab-btn'));
    const cards = Array.from(raconsSection.querySelectorAll(".racons__cards > li"));

    // Aplica la variant per modificar el color segons la categoria
    function applyTabVariant(tabKey) {
        if (!raconsSection) return;
        raconsSection.classList.remove("racons--patrimoni", "racons--natura");
        if (tabKey === "patrimoni" || tabKey === "natura") {
            raconsSection.classList.add(`racons--${tabKey}`);
        }
    };

    // Mou i redimensiona l'indicador del tab actiu
    function updateIndicator(tab, withAnimation = true) {
        if (!indicator || !tab) return;

        const tabRect = tab.getBoundingClientRect();
        const x = tab.offsetLeft;
        const y = tab.offsetTop;

        indicator.style.top = `${y}px`;
        indicator.style.height = `${tabRect.height}px`;

        if (withAnimation) {
            animate(indicator, { x, width: tabRect.width }, { duration: 0.35, easing: "ease-in-out" });
        } else {
            indicator.style.transform = `translateX(${x}px)`;
            indicator.style.width = `${tabRect.width}px`;
        }
    };

    function setActiveTab(tab, withAnimation = true) {
        tabs.forEach((btn) => {
            const isActive = btn === tab;
            btn.classList.toggle("racons__tab-btn--active", isActive);
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        const category = tab?.dataset?.tab;
        applyTabVariant(category);
        // Filtra les targetes per categoria
        cards.forEach((card) => { card.hidden = card.dataset.category !== category; });

        updateIndicator(tab, withAnimation);
    };


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