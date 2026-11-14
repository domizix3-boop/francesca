# Francesca Estética: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** site estático de uma página (+3 páginas legais) da Francesca Estética, replicando `assets/Siterefe2.jpg` com a marca da clínica, e conversão por WhatsApp.

**Architecture:** HTML semântico estático em `index.html` (hero, textos e SEO no HTML para LCP). As partes repetitivas (marquee, cards, carta, opiniones, slots de imagem) são renderizadas por JS a partir de `js/data.js`. CSS em 4 camadas (tokens, base, components, sections). Animações em CSS + `IntersectionObserver`/rAF e scroll suave com Lenis local.

**Tech Stack:** HTML5, CSS moderno (custom properties, `clamp`, `backdrop-filter`), JS ES modules sem build, Lenis 1.1.x (vendor), fontes woff2 self-hosted (Allura, Cormorant Garamond, Jost), ícones Lucide inline. Testes: `node:test` + `playwright-core` com o Chromium em `~/.cache/ms-playwright/chromium-1140`.

**Spec:** `docs/superpowers/specs/2026-11-14-francesca-site-design.md` + `docs/prompt-original.md` (conteúdo e animações).

## Global Constraints
- Todo texto visível em **espanhol da Espanha**, tratamento "tú"; `lang="es-ES"`.
- WhatsApp: `https://wa.me/34633107000?text=…`. Todo CTA primário aponta para lá, com mensagem pré-preenchida.
- Tokens exatos: crema #FBF0E2, tinta #181513, arena #EEDFC9, rosa #EFCFC4, granate #A5242A, lazo #CF3B37, piedra #6A5F57, linea #E3D3BC, blanco #FFF9F1.
- Lazo nunca em texto pequeno; um ponto de vermelho por seção; glass só no cartão do hero e na navbar rolada.
- Nenhum dado inventado; "Botox" só em `SERVICES` (carta) com `// TODO(cliente): confirmar con asesoría legal`.
- Nenhuma foto de banco nem gerada; fotos = slots `.media` com placeholder.
- Só `transform`/`opacity` animados; `prefers-reduced-motion` desliga parallax, marquee, cursor, tilt e entradas.
- Sem scroll horizontal em 390px e 1440px; console sem erros.

## Review Focus
1. Usuário de teclado: abas, accordion, menu mobile e carrossel operáveis com Tab/Enter/setas, foco visível → teste de teclado na Task 6.
2. `prefers-reduced-motion: reduce`: conteúdo visível sem esperar animação (reveals não podem deixar nada com opacity 0) → teste na Task 9.
3. JS falhando ou lento: hero e textos principais legíveis sem JS (reveal só oculta se `html.js`) → teste na Task 2.
4. Imagem real colocada depois: slot mostra a foto e some o placeholder → teste na Task 3.
5. Mobile 390px: sem overflow horizontal (marquee, blobs, cards em carrossel) → teste na Task 10.

---

### Task 1: Base: tokens, fontes, fundo e harness de teste
**Files:** Create `index.html` (esqueleto), `css/tokens.css`, `css/base.css`, `assets/fonts/*.woff2`, `vendor/lenis.min.js`, `tests/package.json`, `tests/helpers.mjs`, `tests/site.test.mjs`, `.gitignore`
**Produces:** `tests/helpers.mjs` → `openPage(path='/', {width=1440,height=900, reducedMotion=false, js=true}) : Promise<{browser, page}>`, que serve a raiz do projeto num `http.createServer` estático numa porta livre. Os blobs ficam em `.blobs > .blob.blob--1|2|3`, e o grão em `body::after`.
- [ ] Teste: a página carrega com `lang="es-ES"`, `getComputedStyle(body).backgroundColor === 'rgb(251, 240, 226)'`, `document.fonts.check('16px Jost')` true após `fonts.ready`, 0 erros no console.
- [ ] Rodar `cd tests && npm test` → FAIL.
- [ ] Implementar: tokens, @font-face, reset, tipografia fluida, container de 1200px, blobs com drift, textura de ruído e skip-link.
- [ ] Rodar → PASS. Commit.

### Task 2: Navbar, Logo, Bow e Hero
**Files:** Modify `index.html`; Create `css/components.css`, `css/sections.css`, `js/data.js`, `js/main.js`
**Produces:** `SITE` em data.js (`name, tagline, whatsapp:{number,display,url(msg)}, address, email:null, instagram:null, maps:null, hours:null, cartaPdf:null, showReviews:false`) e `waUrl(msg:string):string`. Classes `.btn .btn--primary|--ghost`, `.btn-circle`, `.chip`, `.kicker` e o símbolo SVG `#bow`, usado como `<svg><use href="#bow"/></svg>`.
- [ ] Teste: o h1 tem o texto "Hola, somos" e "Francesca."; o botão primário do hero tem `href` começando por `https://wa.me/34633107000?text=`; a nav tem 5 links (Inicio, Tratamientos, La clínica, Opiniones, Contacto); com `js=false` o h1 tem opacity 1.
- [ ] FAIL → implementar o hero conforme o prompt §5.2 (duas colunas, slot circular, cartão de vidro "Reservas abiertas") e a navbar §5.1 (vidro após 80px, esconde ao descer) → PASS → commit.

### Task 3: ImagePlaceholder (slots de foto)
**Files:** Create `js/media.js`; Modify `css/components.css`
**Produces:** `initMedia(root=document)`: para cada `figure.media[data-src]`, cria um `Image()`. No `load` insere `<img alt=data-alt>` e adiciona `.is-loaded`; no `error` renderiza `.ph` (ícone de câmera, "IMAGEN AQUÍ", `data-desc`, id + caminho). `PLACEHOLDERS` em data.js com `{id, src, desc, alt, shape, recommended}`.
- [ ] Teste: `#ph-hero .ph` contém "IMAGEN AQUÍ" e "assets/images/hero.jpg"; copiar uma imagem de teste para `assets/images/test-slot.jpg` (fixture no teste via rota do servidor) faz o slot ficar `.is-loaded` e sem `.ph`.
- [ ] FAIL → implementar → PASS → commit.

### Task 4: Faixa de tratamientos (marquee) e Tratamientos destacados (cards)
**Files:** Modify `index.html`, `js/data.js` (`SERVICES`: `{id, cat, name, desc, msg}` com as 4 categorias e exatamente os serviços do prompt §1), `css/sections.css`; Create `js/ui.js`
**Produces:** `CATEGORIES = [{id:'rostro',label:'Rostro'},{id:'mirada',label:'Mirada y labios'},{id:'medicina',label:'Medicina estética'},{id:'depilacion',label:'Depilación'}]`, `renderMarquee()`, `renderFeatured()`. Os cards são `<a href="#carta" data-cat=…>` e disparam `openCategory(cat)` (Task 5).
- [ ] Teste: o marquee contém "Higiene facial" e "Láser diodo" e não contém "Botox"; há 3 cards com os chips "Mirada y labios", "Rostro" e "Medicina estética"; a palavra "Botox" aparece só dentro de `#carta`.
- [ ] FAIL → implementar (o marquee duplica o conteúdo para o loop; os cards viram carrossel com snap em <768px) → PASS → commit.

### Task 5: La clínica e Carta de tratamientos
**Files:** Modify `index.html`, `js/ui.js`, `css/sections.css`
**Produces:** `openCategory(cat:string)`: ativa a aba, rola para `#carta` e anima o indicador. Accordion em `<button aria-expanded aria-controls>`.
- [ ] Teste: clicar no card "Ácido hialurónico" deixa a aba "Medicina estética" com `aria-selected="true"`; clicar em "Higiene facial" faz `aria-expanded="true"` e mostra o link "Preguntar por WhatsApp" com texto da mensagem contendo "Higiene facial"; ArrowRight na tablist move para a próxima aba.
- [ ] FAIL → implementar → PASS → commit.

### Task 6: Opiniones, Cómo reservar, rodapé e FAB
**Files:** Modify `index.html`, `js/data.js` (`REVIEWS=[]`), `js/ui.js`, `css/sections.css`
- [ ] Teste: `#opiniones` fica oculta por padrão e visível com `?preview=opiniones`, com o texto "Aquí irá una reseña real de Google"; o rodapé contém "+34 633 10 70 00" e "Av. de les Corts Valencianes, 39"; `.wa-fab` fica invisível em scrollY=0 e visível após scrollTo(0,800); teclado: Tab chega ao primeiro link da nav após o skip-link.
- [ ] FAIL → implementar (dots, arrastar, autoplay de 7s com pausa; linha dos passos com dashoffset no scroll) → PASS → commit.

### Task 7: Motion: reveals, magnético, cursor, tilt, progresso, parallax, preloader e menu mobile
**Files:** Create `js/motion.js`; Modify `css/components.css`
**Produces:** `initMotion({reduced:boolean})`. O preloader roda só se `sessionStorage['fr-intro']` não existir (com try/catch), dura no máximo 1.4s e é pulável por clique ou Esc.
- [ ] Teste: após 2s todos os `[data-reveal]` visíveis têm opacity 1; a barra `.progress` tem scaleX > 0 após rolar; com 390px, clicar em `.nav__toggle` abre `#menu` (`aria-expanded=true`) e Esc fecha.
- [ ] FAIL → implementar → PASS → commit.

### Task 8: SEO, JSON-LD, legal e cookies
**Files:** Create `aviso-legal.html`, `privacidad.html`, `cookies.html`, `sitemap.xml`, `robots.txt`, `assets/favicon.svg`, `js/cookies.js`; Modify `index.html`
- [ ] Teste: o title é "Francesca Estética | Clínica de estética en València (Campanar)"; o JSON-LD parseia com `@type` "HealthAndBeautyBusiness" e `telephone` "+34633107000"; o banner de cookies aparece e, ao clicar em "Aceptar", `localStorage['fr-consent']==='all'` e o banner some; as 3 páginas legais retornam 200 com `lang="es-ES"`.
- [ ] FAIL → implementar → PASS → commit.

### Task 9: Reduced motion e QA responsivo
- [ ] Teste: com `reducedMotion:'reduce'` o marquee fica sem animação (`animationName === 'none'`), não há `.cursor` e o h1 tem opacity 1 imediatamente; em 390 e 1440, `scrollWidth <= innerWidth`; screenshots em `tests/shots/` (ignorado no git) para inspeção visual contra a referência.
- [ ] Ajustar até PASS; comparar visualmente com `assets/Siterefe2.jpg` e corrigir as diferenças → commit.

### Task 10: README e lista de placeholders
- [ ] README: como rodar (`npx serve .` ou abrir por um servidor local), onde editar (`js/data.js`), como trocar imagens (tabela dos slots com caminho e tamanho) e como publicar (Netlify/Cloudflare Pages arrastando a pasta). Commit.
