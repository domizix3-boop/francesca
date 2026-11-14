/* Renderização a partir de data.js + componentes interativos (nav, menu, abas, opiniones, FAB) */
import { SITE, waUrl, mapsUrl, CATEGORIES, SERVICES, MARQUEE, FEATURED, REVIEWS, STEPS } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const track = (from) => window.trackEvent?.('whatsapp_click', { from });

/* ---------- Contatos e links a partir de SITE ---------- */
export function bindSite() {
  $$('[data-wa]').forEach((a) => {
    a.href = waUrl(a.dataset.waMsg || undefined);
    a.addEventListener('click', () => track(a.dataset.waFrom || 'link'));
  });
  $$('[data-maps]').forEach((a) => { a.href = mapsUrl(); });
  $$('[data-instagram]').forEach((a) => {
    if (SITE.instagram) a.href = SITE.instagram;
    else a.closest('[data-instagram-item]')?.setAttribute('hidden', '');
  });
  const a = SITE.address;
  $$('[data-site="phone"]').forEach((el) => { el.textContent = SITE.whatsapp.display; });
  $$('[data-site="address"]').forEach((el) => { el.textContent = `${a.building}, ${a.street}, ${a.postcode} ${a.city}`; });
  $$('[data-carta]').forEach((el) => {
    if (SITE.cartaPdf) { el.href = SITE.cartaPdf; el.setAttribute('download', ''); }
    else el.addEventListener('click', (e) => { e.preventDefault(); openCategory(CATEGORIES[0].id); });
  });
}

/* ---------- Franja ---------- */
function renderMarquee() {
  const track = $('[data-marquee] .marquee__track');
  if (!track) return;
  const group = (hidden) => `<div class="marquee__group"${hidden ? ' aria-hidden="true"' : ''}>${MARQUEE.map((n) =>
    `<span class="marquee__item">${esc(n)}</span><svg class="marquee__sep" viewBox="0 0 60 30" aria-hidden="true"><use href="#bow"/></svg>`).join('')}</div>`;
  track.innerHTML = group(false) + group(true);
}

/* ---------- Destacados ---------- */
function renderFeatured() {
  const grid = $('[data-featured]');
  if (!grid) return;
  grid.innerHTML = FEATURED.map((f, i) => `
    <a class="feat-card" href="#carta" data-cat="${f.cat}" data-reveal style="--delay:${i * 70}ms">
      <span class="chip">${esc(f.chip)}</span>
      <figure class="media" data-media="${f.media}"></figure>
      <span class="feat-card__body">
        <span>
          <span class="feat-card__name" style="display:block">${esc(f.name)}</span>
          <span class="feat-card__sub">${esc(f.sub)}</span>
        </span>
        <span class="btn-circle" aria-hidden="true"><svg><use href="#i-arrow-r"/></svg></span>
      </span>
    </a>`).join('');
  $$('.feat-card', grid).forEach((card) => card.addEventListener('click', (e) => {
    e.preventDefault();
    openCategory(card.dataset.cat);
  }));
}

/* ---------- Carta: abas + acordeão ---------- */
let tabsApi = null;

function renderCarta() {
  const host = $('[data-carta-menu]');
  if (!host) return;
  host.innerHTML = `
    <div class="tabs" role="tablist" aria-label="Categorías de tratamientos" data-reveal>
      <span class="tabs__ind" aria-hidden="true"></span>
      ${CATEGORIES.map((c, i) => `<button class="tab" role="tab" type="button" id="tab-${c.id}" aria-controls="panel-${c.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-cat="${c.id}">${esc(c.label)}</button>`).join('')}
    </div>
    ${CATEGORIES.map((c, i) => `
      <div class="tabpanel" role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}"${i ? ' hidden' : ''}>
        <ul class="menu-list">
          ${SERVICES.filter((s) => s.cat === c.id).map((s) => `
            <li class="menu-item">
              <button class="menu-item__btn" type="button" aria-expanded="false" aria-controls="srv-${s.id}">
                <span class="menu-item__name">${esc(s.name)}</span>
                <span class="btn-circle" aria-hidden="true"><svg><use href="#i-plus"/></svg></span>
              </button>
              <div class="menu-item__panel" id="srv-${s.id}" role="region" aria-label="${esc(s.name)}">
                <div class="menu-item__inner">
                  <div class="menu-item__content">
                    <p class="menu-item__desc">${esc(s.desc)}</p>
                    <a class="btn btn--primary" href="${waUrl(s.msg)}" target="_blank" rel="noopener" data-wa-from="carta-${s.id}" tabindex="-1">
                      <span>Preguntar por WhatsApp</span><svg class="btn__icon" aria-hidden="true"><use href="#i-arrow-ur"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>`).join('')}
        </ul>
      </div>`).join('')}`;

  const tabs = $$('[role="tab"]', host);
  const ind = $('.tabs__ind', host);
  const list = $('.tabs', host);

  const moveInd = () => {
    const cur = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
    if (!cur) return;
    ind.style.width = `${cur.offsetWidth}px`;
    ind.style.transform = `translateX(${cur.offsetLeft}px)`;
  };
  const select = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (on) { panel.hidden = false; panel.style.animation = 'none'; void panel.offsetWidth; panel.style.animation = ''; }
      else panel.hidden = true;
    });
    if (focus) tab.focus();
    tab.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    moveInd();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const k = e.key;
      let n = null;
      if (k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      else if (k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (k === 'Home') n = tabs[0];
      else if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });
  list.addEventListener('scroll', moveInd, { passive: true });
  new ResizeObserver(moveInd).observe(list);
  document.fonts?.ready.then(moveInd);
  moveInd();

  // Acordeão
  $$('.menu-item__btn', host).forEach((btn) => btn.addEventListener('click', () => {
    const item = btn.closest('.menu-item');
    const open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    $('a.btn', item).tabIndex = open ? 0 : -1;
  }));
  $$('a.btn[data-wa-from]', host).forEach((a) => a.addEventListener('click', () => track(a.dataset.waFrom)));

  tabsApi = { select: (cat) => { const t = tabs.find((x) => x.dataset.cat === cat); if (t) select(t); } };
}

export function openCategory(cat) {
  tabsApi?.select(cat);
  const target = $('#carta');
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: -40 });
  else target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

/* ---------- Opiniones ---------- */
function renderReviews() {
  const section = $('#opiniones');
  const band = $('[data-reviews]');
  if (!section || !band) return;
  const preview = new URLSearchParams(location.search).get('preview') === 'opiniones';
  let items = SITE.showReviews ? REVIEWS : [];
  let sample = false;
  if (!items.length && preview) {
    sample = true;
    items = [1, 2, 3].map((n) => ({ text: 'Aquí irá una reseña real de Google, con el permiso de la clienta.', name: `Reseña ${n}`, role: 'Clienta' }));
  }
  if (!items.length) {
    $$('[data-reviews-link]').forEach((a) => a.setAttribute('hidden', ''));
    return;
  }
  section.hidden = false;
  band.setAttribute('role', 'region');
  band.setAttribute('aria-roledescription', 'carrusel');
  band.setAttribute('aria-label', 'Opiniones de clientas');
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  band.innerHTML = `
    <div class="reviews__track" aria-live="polite">
      ${items.map((r, i) => `
        <figure class="review${sample ? ' is-sample' : ''}" role="group" aria-roledescription="reseña" aria-label="${i + 1} de ${items.length}"${i ? ' aria-hidden="true"' : ''}>
          <span class="review__mark" aria-hidden="true">“</span>
          <blockquote class="review__text">${esc(r.text)}</blockquote>
          <figcaption class="review__who">
            <span class="review__avatar" aria-hidden="true">${esc(initials(r.name))}</span>
            <span><span class="review__name" style="display:block">${esc(r.name)}</span><span class="review__role">${esc(r.role || 'Clienta')}</span></span>
          </figcaption>
        </figure>`).join('')}
    </div>
    <div class="reviews__dots">
      ${items.map((_, i) => `<button class="reviews__dot" type="button" aria-label="Ver reseña ${i + 1}"${i ? '' : ' aria-current="true"'}></button>`).join('')}
    </div>`;
  initCarousel(band, items.length);
}

function initCarousel(band, n) {
  const trackEl = $('.reviews__track', band);
  const dots = $$('.reviews__dot', band);
  const slides = $$('.review', band);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0;
  let timer = null;
  const go = (k) => {
    i = (k + n) % n;
    trackEl.style.transform = `translateX(${-i * 100}%)`;
    dots.forEach((d, j) => (j === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    slides.forEach((s, j) => (j === i ? s.removeAttribute('aria-hidden') : s.setAttribute('aria-hidden', 'true')));
  };
  const stop = () => { clearInterval(timer); timer = null; };
  const play = () => { if (reduced || n < 2) return; stop(); timer = setInterval(() => go(i + 1), 7000); };
  dots.forEach((d, j) => d.addEventListener('click', () => { go(j); play(); }));
  band.addEventListener('pointerenter', stop);
  band.addEventListener('pointerleave', play);
  band.addEventListener('focusin', stop);
  band.addEventListener('focusout', play);
  band.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { go(i + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(i - 1); e.preventDefault(); }
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));

  // Arrastar com mola suave (transition de saída) e flick por velocidade
  let x0 = null; let t0 = 0; let dx = 0;
  band.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    x0 = e.clientX; t0 = performance.now(); dx = 0;
    band.setPointerCapture(e.pointerId);
    trackEl.style.transition = 'none';
  });
  band.addEventListener('pointermove', (e) => {
    if (x0 === null) return;
    dx = e.clientX - x0;
    const edge = (i === 0 && dx > 0) || (i === n - 1 && dx < 0);
    const d = edge ? dx * 0.3 : dx;
    trackEl.style.transform = `translateX(calc(${-i * 100}% + ${d}px))`;
  });
  const end = () => {
    if (x0 === null) return;
    const v = Math.abs(dx) / (performance.now() - t0);
    trackEl.style.transition = '';
    if (Math.abs(dx) > 60 || v > 0.11) go(dx < 0 ? Math.min(i + 1, n - 1) : Math.max(i - 1, 0));
    else go(i);
    x0 = null;
  };
  band.addEventListener('pointerup', end);
  band.addEventListener('pointercancel', end);
  play();
}

/* ---------- Pasos ---------- */
function renderSteps() {
  const list = $('[data-steps]');
  if (!list) return;
  list.innerHTML = STEPS.map((s, i) => `
    <li class="step" data-reveal style="--delay:${i * 90}ms">
      <span class="step__num" aria-hidden="true">${i + 1}</span>
      <h3 class="step__title">${esc(s.title)}</h3>
      <p class="step__text">${esc(s.text)}</p>
    </li>`).join('');
  const cta = document.createElement('div');
  cta.className = 'steps__cta';
  cta.innerHTML = `<a class="btn btn--primary" data-magnetic data-wa data-wa-from="pasos" target="_blank" rel="noopener" href="${waUrl()}"><span>Escríbenos por WhatsApp</span><svg class="btn__icon" aria-hidden="true"><use href="#i-arrow-r"/></svg></a>`;
  list.closest('.steps__wrap').after(cta);
}

/* ---------- Nav: estado, direção, seção ativa ---------- */
function initNav() {
  const nav = $('[data-nav]');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 80);
    if (!nav.classList.contains('is-menu-open') && !nav.contains(document.activeElement)) {
      if (y > 400 && y > lastY + 4) nav.classList.add('is-hidden');
      else if (y < lastY - 4 || y < 400) nav.classList.remove('is-hidden');
    }
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));
  onScroll();

  const links = $$('.nav__links a');
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const sections = [...map.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove('is-active'));
      map.get(e.target.id)?.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => io.observe(s));
}

/* ---------- Menu móvel ---------- */
function initMenu() {
  const nav = $('[data-nav]');
  const btn = $('.nav__toggle');
  const menu = $('#menu');
  if (!btn || !menu) return;
  let closeTimer;
  const open = () => {
    clearTimeout(closeTimer);
    menu.hidden = false;
    nav.classList.add('is-menu-open');
    nav.classList.remove('is-hidden');
    btn.setAttribute('aria-expanded', 'true');
    btn.querySelector('.sr-only').textContent = 'Cerrar menú';
    document.documentElement.style.overflow = 'hidden';
    window.__lenis?.stop();
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
    $('a', menu)?.focus({ preventScroll: true });
  };
  const close = (returnFocus = true) => {
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.querySelector('.sr-only').textContent = 'Menú';
    nav.classList.remove('is-menu-open');
    document.documentElement.style.overflow = '';
    window.__lenis?.start();
    closeTimer = setTimeout(() => { menu.hidden = true; }, 650);
    if (returnFocus) btn.focus({ preventScroll: true });
  };
  btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? close() : open()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') close(); });
  $$('a', menu).forEach((a) => a.addEventListener('click', () => close(false)));
  // Mantém o foco dentro do menu (botão + links)
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const items = [btn, ...$$('a:not([hidden])', menu)];
    const idx = items.indexOf(document.activeElement);
    if (e.shiftKey && idx <= 1 && document.activeElement === items[1]) { e.preventDefault(); btn.focus(); }
    if (!e.shiftKey && idx === items.length - 1) { e.preventDefault(); btn.focus(); }
  });
}

/* ---------- FAB WhatsApp ---------- */
function initFab() {
  const fab = $('.wa-fab');
  if (!fab) return;
  let shown = false;
  const onScroll = () => {
    const v = scrollY > 600;
    fab.classList.toggle('is-visible', v);
    if (v && !shown) { shown = true; fab.classList.add('breathe'); }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Âncoras internas ---------- */
function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target || target.hidden) return;
    if (window.__lenis) {
      e.preventDefault();
      window.__lenis.scrollTo(id === '#inicio' ? 0 : target, { offset: -40 });
      history.replaceState(null, '', id);
    }
  });
}

export function renderAll() {
  renderMarquee();
  renderFeatured();
  renderCarta();
  renderReviews();
  renderSteps();
}

export function initUI() {
  initNav();
  initMenu();
  initFab();
  initAnchors();
}
