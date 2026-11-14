/* Arranque */
import { initMedia } from './media.js';
import { bindSite, renderAll, initUI } from './ui.js';
import { initMotion } from './motion.js';
import { initCookies } from './cookies.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

renderAll();
bindSite();
initMedia();
initUI();
initCookies();
initMotion({ reduced });
