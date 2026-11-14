/* Consentimiento de cookies (RGPD/LSSI). No se carga ningún script de terceros
   hasta que la persona acepte. Para añadir analítica, cárgala dentro de loadAnalytics(). */

const KEY = 'fr-consent';
const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v) => { try { localStorage.setItem(KEY, v); } catch {} };

function loadAnalytics() {
  // TODO(cliente): si se usa analítica (p. ej. GA4 o Plausible), cargarla aquí.
}

/** Evento de analítica (solo con consentimiento). Uso: trackEvent('whatsapp_click', { from: 'hero' }) */
window.trackEvent = (name, data = {}) => {
  if (read() !== 'all') return;
  if (typeof window.gtag === 'function') window.gtag('event', name, data);
  window.dataLayer?.push({ event: name, ...data });
};

export function initCookies() {
  const consent = read();
  if (consent === 'all') { loadAnalytics(); return; }
  if (consent) return;

  const box = document.createElement('div');
  box.className = 'cookies';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-live', 'polite');
  box.setAttribute('aria-label', 'Preferencias de cookies');
  box.innerHTML = `
    <p>Usamos cookies técnicas para que la web funcione y, solo si nos das permiso, cookies de análisis para saber cómo se usa. <a href="cookies.html">Más información</a></p>
    <div class="cookies__actions">
      <button class="btn btn--ghost" type="button" data-c="necessary"><span>Rechazar</span></button>
      <button class="btn btn--primary" type="button" data-c="all"><span>Aceptar</span></button>
    </div>`;
  document.body.append(box);
  document.body.classList.add('has-cookies');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    write(b.dataset.c);
    if (b.dataset.c === 'all') loadAnalytics();
    box.classList.add('is-leaving');
    document.body.classList.remove('has-cookies');
    setTimeout(() => box.remove(), 340);
  });
}

/** Para la página de cookies: permite cambiar la elección. */
export function resetConsent() {
  try { localStorage.removeItem(KEY); } catch {}
}
