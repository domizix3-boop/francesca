import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { start, stop, openPage } from './helpers.mjs';

before(start);
after(stop);

// 404 das fotos ainda não entregues é esperado (os slots mostram placeholder).
const realErrors = (errs) => errs.filter((e) => !/Failed to load resource/.test(e));
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');

// ---------- Task 1: base ----------
test('base: es-ES, fundo crema, fontes, sem erros', async () => {
  const { page, errors, context } = await openPage('/');
  assert.equal(await page.getAttribute('html', 'lang'), 'es-ES');
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(251, 240, 226)');
  await page.evaluate(() => document.fonts.ready);
  assert.ok(await page.evaluate(() => document.fonts.check('16px Jost')));
  assert.ok(await page.evaluate(() => document.fonts.check('italic 500 40px "Cormorant Garamond"')));
  assert.equal(await page.locator('.blobs .blob').count(), 3);
  assert.deepEqual(realErrors(errors), []);
  await context.close();
});

// ---------- Task 2: navbar + hero ----------
test('hero: h1, CTA WhatsApp e nav com 5 links', async () => {
  const { page, context } = await openPage('/');
  const h1 = await page.locator('h1').innerText();
  assert.match(h1, /Hola, somos/);
  assert.match(h1, /Francesca\./);
  const href = await page.locator('.hero .btn--primary').getAttribute('href');
  assert.ok(href.startsWith('https://wa.me/34633107000?text='), href);
  const links = await page.locator('.nav__links a').evaluateAll((as) => as.map((a) => a.textContent.trim()));
  assert.deepEqual(links, ['Inicio', 'Tratamientos', 'La clínica', 'Opiniones', 'Contacto']);
  // Sem reseñas reais, o link "Opiniones" fica oculto (sem link morto).
  assert.equal(await page.locator('.nav__links a[href="#opiniones"]').isVisible(), false);
  assert.match(await page.locator('.hero-card').innerText(), /Reservas abiertas/);
  await context.close();
});

test('sem JS o hero continua legível', async () => {
  const { page, context } = await openPage('/', { js: false });
  assert.equal(await page.locator('h1').evaluate((el) => getComputedStyle(el).opacity), '1');
  assert.ok(await page.locator('h1').isVisible());
  await context.close();
});

test('navbar vira pílula de vidro após 80px', async () => {
  const { page, context } = await openPage('/');
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(400);
  assert.ok(await page.locator('.nav').evaluate((el) => el.classList.contains('is-scrolled')));
  await context.close();
});

// ---------- Task 3: ImagePlaceholder ----------
test('placeholder: hero mostra IMAGEN AQUÍ e caminho', async () => {
  const { page, context } = await openPage('/');
  const ph = page.locator('#ph-hero .ph');
  await ph.waitFor();
  const t = await ph.innerText();
  assert.match(t, /IMAGEN AQUÍ/i);
  assert.match(t, /assets\/images\/hero\.jpg/);
  assert.ok(await page.locator('#ph-hero .ph svg').count() >= 1);
  await context.close();
});

test('placeholder: com arquivo real, mostra a foto', async () => {
  const { page, context } = await openPage('/', {
    routes: [['**/assets/images/hero.jpg', (r) => r.fulfill({ body: PNG, contentType: 'image/png' })]],
  });
  await page.locator('#ph-hero.is-loaded img').waitFor();
  assert.equal(await page.locator('#ph-hero .ph').count(), 0);
  await context.close();
});

// ---------- Task 4: marquee + cards ----------
test('marquee e cards destacados', async () => {
  const { page, context } = await openPage('/');
  const mq = await page.locator('.marquee').innerText();
  assert.match(mq, /Higiene facial/);
  assert.match(mq, /Láser diodo/);
  assert.doesNotMatch(mq, /Botox/);
  const chips = await page.locator('.feat-card .chip').allInnerTexts();
  assert.deepEqual(chips.map((s) => s.trim()), ['Mirada y labios', 'Rostro', 'Medicina estética']);
  const botoxOutside = await page.evaluate(() => {
    const clone = document.body.cloneNode(true);
    clone.querySelector('#carta')?.remove();
    return /Botox/.test(clone.textContent);
  });
  assert.equal(botoxOutside, false);
  await context.close();
});

// ---------- Task 5: carta ----------
test('carta: card abre categoria, accordion e teclado', async () => {
  const { page, context } = await openPage('/');
  await page.locator('.feat-card', { hasText: 'Ácido hialurónico' }).click();
  await page.waitForTimeout(300);
  assert.equal(await page.locator('[role="tab"]', { hasText: 'Medicina estética' }).getAttribute('aria-selected'), 'true');
  assert.match(await page.locator('#carta').innerText(), /Botox/);

  await page.locator('[role="tab"]', { hasText: 'Rostro' }).click();
  const btn = page.locator('.menu-item__btn', { hasText: 'Higiene facial' });
  await btn.click();
  assert.equal(await btn.getAttribute('aria-expanded'), 'true');
  const wa = page.locator('.menu-item.is-open a.btn');
  assert.match(await wa.innerText(), /Preguntar por WhatsApp/);
  assert.match(decodeURIComponent(await wa.getAttribute('href')), /Higiene facial/);

  await page.locator('[role="tab"]', { hasText: 'Rostro' }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[role="tab"]', { hasText: 'Mirada y labios' }).getAttribute('aria-selected'), 'true');
  await context.close();
});

// ---------- Task 6: opiniones, rodapé, fab ----------
test('opiniones oculta por padrão; preview mostra', async () => {
  let { page, context } = await openPage('/');
  assert.equal(await page.locator('#opiniones').isVisible(), false);
  await context.close();
  ({ page, context } = await openPage('/?preview=opiniones'));
  assert.ok(await page.locator('#opiniones').isVisible());
  assert.match(await page.locator('#opiniones').innerText(), /Aquí irá una reseña real de Google/);
  await context.close();
});

test('rodapé com contatos e FAB de WhatsApp', async () => {
  const { page, context } = await openPage('/');
  const f = await page.locator('footer').innerText();
  assert.match(f, /\+34 633 10 70 00/);
  assert.match(f, /Av\. de les Corts Valencianes, 39/);
  assert.equal(await page.locator('.wa-fab').evaluate((el) => el.classList.contains('is-visible')), false);
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(400);
  assert.ok(await page.locator('.wa-fab').evaluate((el) => el.classList.contains('is-visible')));
  await context.close();
});

test('teclado: skip-link primeiro, depois a navegação', async () => {
  const { page, context } = await openPage('/');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.className), 'skip-link');
  await page.keyboard.press('Tab');
  assert.ok(await page.evaluate(() => !!document.activeElement.closest('.nav')));
  await context.close();
});

// ---------- Task 7: motion ----------
test('motion: reveals completam, progresso, menu mobile', async () => {
  let { page, context } = await openPage('/');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(1600);
  const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')]
    .filter((el) => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })
    .filter((el) => getComputedStyle(el).opacity !== '1').length);
  assert.equal(hidden, 0);
  const sx = await page.locator('.progress').evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
  assert.ok(sx > 0);
  await context.close();

  ({ page, context } = await openPage('/', { width: 390, height: 844, hasTouch: true }));
  await page.locator('.nav__toggle').click();
  assert.equal(await page.locator('.nav__toggle').getAttribute('aria-expanded'), 'true');
  assert.ok(await page.locator('#menu').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.nav__toggle').getAttribute('aria-expanded'), 'false');
  await context.close();
});

test('preloader roda na primeira visita e some', async () => {
  const { page, context } = await openPage('/', { skipIntro: false });
  assert.ok(await page.locator('.preloader').count() === 1);
  await page.waitForTimeout(2200);
  assert.equal(await page.locator('.preloader').count(), 0);
  await context.close();
});

// ---------- Task 8: SEO, legal, cookies ----------
test('SEO e JSON-LD', async () => {
  const { page, context } = await openPage('/');
  assert.equal(await page.title(), 'Francesca Estética | Clínica de estética en València (Campanar)');
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  assert.equal(ld['@type'], 'HealthAndBeautyBusiness');
  assert.equal(ld.telephone, '+34633107000');
  assert.ok(await page.locator('meta[name="description"]').getAttribute('content'));
  assert.ok(await page.locator('meta[property="og:title"]').getAttribute('content'));
  await context.close();
});

test('cookies: banner e consentimento', async () => {
  const { page, context } = await openPage('/');
  const banner = page.locator('.cookies');
  await banner.waitFor({ state: 'visible' });
  await banner.locator('button', { hasText: 'Aceptar' }).click();
  assert.equal(await page.evaluate(() => localStorage.getItem('fr-consent')), 'all');
  await page.waitForTimeout(500);
  assert.equal(await banner.isVisible(), false);
  await context.close();
});

test('páginas legais em es-ES', async () => {
  for (const p of ['/aviso-legal.html', '/privacidad.html', '/cookies.html']) {
    const { page, errors, context } = await openPage(p);
    assert.equal(await page.getAttribute('html', 'lang'), 'es-ES', p);
    assert.ok((await page.locator('h1').innerText()).length > 3, p);
    assert.deepEqual(realErrors(errors), [], p);
    await context.close();
  }
  for (const f of ['sitemap.xml', 'robots.txt']) await readFile(new URL('../' + f, import.meta.url));
});

// ---------- Task 9: reduced motion + responsivo ----------
test('reduced motion: nada escondido, marquee parado, sem cursor', async () => {
  const { page, context } = await openPage('/', { reducedMotion: 'reduce' });
  assert.equal(await page.locator('h1').evaluate((el) => getComputedStyle(el).opacity), '1');
  assert.equal(await page.locator('.marquee__track').evaluate((el) => getComputedStyle(el).animationName), 'none');
  assert.equal(await page.locator('.cursor').count(), 0);
  const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')]
    .filter((el) => getComputedStyle(el).opacity !== '1').length);
  assert.equal(hidden, 0);
  await context.close();
});

for (const [w, h] of [[390, 844], [768, 1024], [1440, 900]]) {
  test(`sem scroll horizontal em ${w}px`, async () => {
    const { page, errors, context } = await openPage('/', { width: w, height: h, hasTouch: w < 1024 });
    await page.waitForTimeout(300);
    const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    assert.ok(sw <= iw, `scrollWidth ${sw} > ${iw}`);
    assert.deepEqual(realErrors(errors), []);
    await context.close();
  });
}
