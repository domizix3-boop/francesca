// Screenshots para inspeção visual: node shoot.mjs
import { mkdir } from 'node:fs/promises';
import { start, stop, openPage } from './helpers.mjs';
await mkdir(new URL('./shots/', import.meta.url), { recursive: true });
await start();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const { page, context } = await openPage('/', { width: w, height: h, hasTouch: w < 1024 });
  await page.evaluate(() => { try { localStorage.setItem('fr-consent', 'necessary'); } catch {} document.querySelector('.cookies')?.remove(); });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `shots/${w}-hero.png` });
  // revela tudo para a captura de página inteira
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    document.querySelectorAll('[data-reveal],[data-reveal-lines]').forEach((e) => e.classList.add('is-in'));
    scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `shots/${w}-full.png`, fullPage: true });
  await context.close();
}
await stop();
console.log('ok');
