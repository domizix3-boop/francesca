// Harness de teste: serve a raiz do projeto e abre o Chromium headless.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { chromium } from 'playwright-core';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.xml': 'application/xml',
  '.txt': 'text/plain', '.json': 'application/json', '.pdf': 'application/pdf',
};
const CHROME = join(os.homedir(), '.cache/ms-playwright/chromium-1140/chrome-linux/chrome');

let server, base, browser;

export async function start() {
  server = http.createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = normalize(join(ROOT, p));
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }).end(body);
    } catch { res.writeHead(404).end('not found'); }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });
}

export async function stop() {
  await browser?.close();
  await new Promise((r) => server.close(r));
}

/**
 * Abre uma página. Retorna { page, errors, context }.
 * opts: width, height, reducedMotion ('reduce'|'no-preference'), js (bool), skipIntro (bool, default true)
 */
export async function openPage(path = '/', opts = {}) {
  const { width = 1440, height = 900, reducedMotion = 'no-preference', js = true, skipIntro = true, hasTouch = false } = opts;
  const context = await browser.newContext({
    viewport: { width, height }, reducedMotion, javaScriptEnabled: js, hasTouch,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  if (skipIntro) await page.addInitScript(() => { try { sessionStorage.setItem('fr-intro', '1'); } catch {} });
  if (opts.routes) for (const [pattern, handler] of opts.routes) await page.route(pattern, handler);
  await page.goto(base + path, { waitUntil: 'load' });
  return { page, errors, context };
}

export const url = (p) => base + p;
