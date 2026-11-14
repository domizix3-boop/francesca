/* Movimento: preloader, entrada do hero, reveals, magnético, cursor, tilt, parallax, progresso, linha dos passos, Lenis */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- Preloader de marca + entrada do hero ---------- */
function startHero() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.classList.add('is-ready');
    const card = $('.hero-card');
    if (card) setTimeout(() => card.classList.add('is-floating'), 1900);
  }));
}

function runPreloader(reduced) {
  if (!root.classList.contains('intro') || reduced) { root.classList.remove('intro'); startHero(); return; }
  try { sessionStorage.setItem('fr-intro', '1'); } catch {}
  const el = document.createElement('div');
  el.className = 'preloader';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="preloader__mark">
      <span class="preloader__head preloader__head--l"></span>
      <span class="preloader__head preloader__head--r"></span>
      <svg class="preloader__bow" viewBox="0 0 60 30"><use href="#bow"/></svg>
      <span class="preloader__word">francesca</span>
    </div>`;
  document.body.append(el);
  let done = false;
  const leave = () => {
    if (done) return;
    done = true;
    el.classList.add('is-leaving');
    root.classList.remove('intro');
    startHero();
    setTimeout(() => el.remove(), 720);
    removeEventListener('keydown', onKey);
  };
  const onKey = (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') leave(); };
  el.addEventListener('click', leave);
  addEventListener('keydown', onKey);
  setTimeout(leave, 1200);
}

/* ---------- Reveals ao rolar (uma vez, stagger 70ms) ---------- */
function initReveals() {
  const els = $$('[data-reveal], [data-reveal-lines]');
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target);
    batch.forEach((el, i) => {
      if (!el.style.getPropertyValue('--delay')) el.style.setProperty('--delay', `${i * 70}ms`);
      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });
  els.forEach((el) => io.observe(el));
  // Segurança: se algo ficou acima da dobra após um salto de âncora, revela também.
  addEventListener('scroll', () => {
    els.forEach((el) => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().bottom < 0) { el.classList.add('is-in'); io.unobserve(el); } });
  }, { passive: true });
}

/* ---------- Botões magnéticos (≤ 8px) ---------- */
function initMagnetic() {
  $$('[data-magnetic]').forEach((el) => {
    el.style.transition += ', translate 500ms cubic-bezier(.22,1,.36,1)';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = clamp((e.clientX - (r.left + r.width / 2)) * 0.2, -8, 8);
      const y = clamp((e.clientY - (r.top + r.height / 2)) * 0.3, -8, 8);
      el.style.translate = `${x}px ${y}px`;
    });
    el.addEventListener('pointerleave', () => { el.style.translate = '0 0'; });
  });
}

/* ---------- Cursor personalizado ---------- */
function initCursor() {
  const c = document.createElement('div');
  c.className = 'cursor is-hidden';
  c.setAttribute('aria-hidden', 'true');
  c.innerHTML = '<span class="cursor__label">Ver</span>';
  document.body.append(c);
  let x = -100; let y = -100; let cx = x; let cy = y; let raf = null;
  const loop = () => {
    cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
    c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(loop) : null;
  };
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    const t = e.target;
    const card = t.closest?.('.feat-card');
    const interactive = t.closest?.('a, button, [role="tab"], input, label');
    c.classList.toggle('is-view', !!card);
    c.classList.toggle('is-hidden', !card && !!interactive);
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener('pointerleave', () => c.classList.add('is-hidden'));
}

/* ---------- Cards: inclinação mínima (≤ 4°) ---------- */
function initTilt() {
  $$('.feat-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

/* ---------- Scroll: progresso, parallax, passos, marquee ---------- */
function initScrollFx(reduced) {
  const bar = $('.progress');
  const par = reduced ? [] : $$('[data-parallax]');
  const blobs = $('.blobs');
  const stepsLine = $('.steps__line');
  const marquee = $('.marquee__track');
  let anim = null;
  let lastY = scrollY; let lastT = performance.now(); let rate = 1;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;

    par.forEach((el) => {
      const r = el.getBoundingClientRect();
      const k = parseFloat(el.dataset.parallax) || 0;
      const p = clamp((r.top + r.height / 2 - innerHeight / 2) / innerHeight, -1, 1);
      el.style.translate = `0 ${(p * k).toFixed(1)}px`;
    });
    if (blobs && !reduced) blobs.style.translate = `0 ${clamp(y * 0.06, 0, 40).toFixed(1)}px`;

    if (stepsLine) {
      const r = stepsLine.getBoundingClientRect();
      const p = reduced ? 1 : clamp((innerHeight * 0.9 - r.top) / (innerHeight * 0.5), 0, 1);
      stepsLine.style.setProperty('--draw', (1 - p).toFixed(3));
    }

    // Marquee desacelera ao rolar rápido
    if (marquee && !reduced) {
      anim ||= marquee.getAnimations()[0];
      const now = performance.now();
      const v = Math.abs(y - lastY) / Math.max(1, now - lastT); // px/ms
      const target = clamp(1 - v * 0.35, 0.25, 1);
      rate += (target - rate) * 0.3;
      if (anim) anim.playbackRate = rate;
      lastY = y; lastT = now;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  // volta à velocidade normal quando o scroll para
  setInterval(() => {
    if (!anim || reduced || rate > 0.99) return;
    rate += (1 - rate) * 0.2;
    anim.playbackRate = rate;
  }, 120);
  update();
}

/* ---------- Lenis (scroll suave) ---------- */
function initLenis(reduced) {
  if (reduced) return;
  const boot = () => {
    if (!window.Lenis || window.__lenis) return;
    const lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  };
  if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
}

export function initMotion({ reduced }) {
  runPreloader(reduced);
  initReveals();
  initScrollFx(reduced);
  if (!reduced && finePointer()) {
    initMagnetic();
    initCursor();
    initTilt();
  }
  initLenis(reduced);
}
