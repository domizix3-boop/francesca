/* ImagePlaceholder: cada <figure class="media" data-media="id"> procura a foto real.
   Se o arquivo existe, mostra a foto; se não, mostra o placeholder de marca. */
import { PLACEHOLDERS } from './data.js';

function placeholder(id, p) {
  const el = document.createElement('div');
  el.className = 'ph';
  el.innerHTML = `
    <svg class="ph__icon" aria-hidden="true"><use href="#i-camera"/></svg>
    <span class="ph__title">Imagen aquí</span>
    <span class="ph__desc">${p.desc}</span>
    <span class="ph__path">#ph-${id} · ${p.src}</span>`;
  return el;
}

function load(fig, id, p) {
  const img = new Image();
  img.decoding = 'async';
  if (fig.hasAttribute('data-eager')) img.fetchPriority = 'high';
  img.alt = p.alt;
  img.onload = () => {
    fig.querySelector('.ph')?.remove();
    fig.prepend(img);
    fig.classList.add('is-loaded');
    fig.removeAttribute('role');
    fig.removeAttribute('aria-label');
  };
  img.src = p.src;
}

export function initMedia(root = document) {
  const lazy = [];
  root.querySelectorAll('figure.media[data-media]').forEach((fig) => {
    const id = fig.dataset.media;
    const p = PLACEHOLDERS[id];
    if (!p) return;
    fig.id ||= `ph-${id}`;
    fig.dataset.src = p.src;
    fig.setAttribute('role', 'img');
    fig.setAttribute('aria-label', `Imagen pendiente: ${p.desc}`);
    const ph = placeholder(id, p);
    ph.setAttribute('aria-hidden', 'true');
    fig.append(ph);
    if (fig.hasAttribute('data-eager') || !('IntersectionObserver' in window)) load(fig, id, p);
    else lazy.push([fig, id, p]);
  });
  if (!lazy.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const item = lazy.find(([f]) => f === e.target);
      if (item) load(...item);
      io.unobserve(e.target);
    });
  }, { rootMargin: '600px 0px' });
  lazy.forEach(([fig]) => io.observe(fig));
}
