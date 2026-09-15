// ============================================================
// TRACKING — dataLayer, eventos e captura de UTMs
// ============================================================
// Estrutura pronta para Google Tag Manager, GA4 e Meta Pixel.
// Veja o README.md para saber onde colar os IDs/snippets.

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];
const CLICK_ID_KEYS = ["fbclid", "gclid"];
const UTM_STORAGE_KEY = "figurinhas_utms_v1";

window.dataLayer = window.dataLayer || [];

/**
 * Envia um evento para o dataLayer (GTM) e, se existir, para o gtag (GA4)
 * e para o Meta Pixel (fbq). Nunca envie dados pessoais sensíveis aqui.
 */
export function trackEvent(eventName, data = {}) {
  const payload = { event: eventName, ...data };
  window.dataLayer.push(payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, data);
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, data);
  }

  if (window.__DEBUG_TRACKING__) {
    // eslint-disable-next-line no-console
    console.info("[trackEvent]", eventName, data);
  }
}

/** Lê UTMs/click-ids da URL atual (se existirem). */
function readUtmsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const found = {};
  let hasAny = false;

  [...UTM_KEYS, ...CLICK_ID_KEYS].forEach((key) => {
    const value = params.get(key);
    if (value) {
      found[key] = value;
      hasAny = true;
    }
  });

  return hasAny ? found : null;
}

/**
 * Captura UTMs da URL na primeira visita da sessão e mantém salvas em
 * localStorage durante toda a jornada, mesmo que o usuário navegue sem
 * os parâmetros na URL depois.
 */
export function initUTMs() {
  const fromUrl = readUtmsFromUrl();

  if (fromUrl) {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
    return fromUrl;
  }

  return getStoredUTMs();
}

export function getStoredUTMs() {
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}
