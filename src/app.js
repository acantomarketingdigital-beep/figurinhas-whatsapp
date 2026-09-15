// ============================================================
// APP — header, botão flutuante, barra fixa mobile, tracking geral
// ============================================================
import { CONFIG } from "./config.js";
import { initUTMs, trackEvent } from "./tracking.js";
import { initQuiz } from "./quiz.js";

function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initGenericWhatsappButton() {
  document.querySelectorAll("[data-generic-whatsapp]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const message = "Olá! Gostaria de saber mais sobre as figurinhas personalizadas.";
      const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
      trackEvent("whatsapp_click", { source: "floating_button" });
      window.open(url, "_blank", "noopener");
    });
  });
}

function initStickyMobileBar() {
  const bar = document.getElementById("sticky-cta");
  const hero = document.getElementById("hero");
  if (!bar || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      bar.classList.toggle("is-visible", !entry.isIntersecting);
    },
    { rootMargin: "-10% 0px 0px 0px" }
  );
  observer.observe(hero);
}

function initPricingViewTracking() {
  const pricing = document.getElementById("precos");
  if (!pricing) return;
  let fired = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !fired) {
        fired = true;
        trackEvent("view_pricing");
        observer.disconnect();
      }
    },
    { threshold: 0.25 }
  );
  observer.observe(pricing);
}

function initSmoothAnchorScroll() {
  const header = document.querySelector(".site-header");
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href").slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 0) + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

function init() {
  initUTMs();
  trackEvent("page_view", { page_path: window.location.pathname });

  initQuiz();
  initMobileMenu();
  initGenericWhatsappButton();
  initStickyMobileBar();
  initPricingViewTracking();
  initSmoothAnchorScroll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
