# Francesca Estética: design do site

Data: 2026-11-14 · Status: aguardando aprovação

## Intenção
Site de uma página para a Francesca Estética (Campanar, València). Ele apresenta a clínica com elegância e leva a visitante a **reservar pelo WhatsApp**, a conversão principal. Público: clientes locais em Espanha. O texto é **somente em espanhol da Espanha** (tratamento por "tú", `lang="es-ES"`, +34).

Fonte de verdade de conteúdo, identidade, animações e critérios: `docs/prompt-original.md`. Este documento registra só o que foi decidido depois e como o prompt vira código sem framework.

## Metas, não-metas e anti-metas
- **Metas:** replicar a estrutura, o ritmo e o clima de `assets/Siterefe2.jpg` (é a "referência total"), com as cores, as fontes e o laço da Francesca. Implementar as 15 interações da seção 6 do prompt, mais SEO local, acessibilidade AA e a parte legal RGPD/LSSI.
- **Não-metas:** backend, agendamento online, analytics ativo (fica só o gancho de consentimento), versão em outros idiomas.
- **Anti-metas:**
  - inventar dados (reseñas, equipe, preços, números);
  - usar fotos de banco de imagens ou imagens geradas;
  - ter cara de site de IA (lista proibida na seção 7 do prompt);
  - promessas clínicas e "Botox" fora da carta.

## Abordagens consideradas
- **A. HTML, CSS e JS puro (escolhida pelo usuário):** segue a regra do `CLAUDE.md`, não tem build e publica em qualquer hospedagem estática. As animações saem com CSS e JS próprios, e o Lenis entra como arquivo local.
- **B. Next.js + TS + Tailwind (a do prompt):** traz otimização de imagens e dados tipados, mas exige build e dependências e pesa mais na manutenção. Foi rejeitada.

## Como o prompt vira código (decisões)
| Prompt (Next) | Neste projeto |
|---|---|
| `src/data/*.ts` | `js/data.js`: objeto `SITE` (contatos, textos, flags), `SERVICES`, `REVIEWS`, `PLACEHOLDERS`, todos com `// TODO(cliente)` |
| componentes React | funções JS que renderizam a partir de `data.js` (marquee, carta, cards, opiniones) e HTML semântico estático para o resto (SEO e LCP) |
| Framer Motion | CSS transitions/keyframes + `IntersectionObserver` + `requestAnimationFrame` (molas simples no JS) |
| `layoutId` nas abas | indicador posicionado via `transform` medido com `getBoundingClientRect` |
| `pathLength` | `stroke-dasharray`/`stroke-dashoffset` ligado ao scroll |
| Lenis | `vendor/lenis.min.js` local (versão fixa), carregado com `defer` |
| `next/font` | fontes **self-hosted** em `assets/fonts/` (woff2, subset latino, `font-display: swap`). Sem Google Fonts remoto, por causa do RGPD |
| `next/image` | `<img>` com `width`/`height`, `loading="lazy"` (o do hero usa `fetchpriority="high"`) |
| lucide-react | SVGs Lucide inline, stroke 1.5 |
| `public/images/` | `assets/images/` |
| `public/brand/logo-original.jpg` | não existe. O logo é recriado em texto vivo (Allura + Jost) + o laço SVG. Se o arquivo chegar, vai para `assets/brand/` para conferência |
| sitemap.ts / robots.ts | `sitemap.xml` / `robots.txt` estáticos (domínio `TODO(cliente)`) |
| `npm run build/lint` | validação HTML + checagem no navegador (390 e 1440px, console sem erros, sem scroll horizontal) |

## Estrutura de arquivos
```
index.html
aviso-legal.html · privacidad.html · cookies.html
css/ tokens.css · base.css · components.css · sections.css
js/  data.js · main.js (boot, Lenis, navbar, progresso, reveals) · ui.js (magnético, cursor, tilt,
     marquee, abas/accordion, opiniones, passos, preloader, cookies, fab)
vendor/ lenis.min.js
assets/ Siterefe2.jpg · fonts/ · images/ · brand/ · favicon.svg · carta-tratamientos.pdf (TODO)
sitemap.xml · robots.txt · README.md
```

## ImagePlaceholder (ajuste do usuário)
Cada foto é um "slot" `<figure class="media" data-id="…" data-src="assets/images/….jpg" data-desc="…">` com a proporção e o raio finais. Um script tenta carregar `data-src`:
- se o arquivo existe, mostra a foto;
- se não existe, renderiza o placeholder: gradiente rosa polvo/arena, ícone de câmera de traço fino, "IMAGEN AQUÍ" + descrição em Jost caixa alta, e o id e o caminho em texto discreto.

Para trocar, basta colocar o arquivo no caminho, sem editar código. O hero também usa esse placeholder: o ajuste do usuário vale mais que a "silhueta" do prompt. Os slots ficam listados em `PLACEHOLDERS` (data.js) e no README com o tamanho recomendado. São eles: hero (círculo), 3 cards e La clínica.

## Decisões minhas (para o usuário conferir)
1. **Opiniones:** a seção existe com o mesmo design da referência, mas fica oculta (`showReviews: false`) até haver reseñas reais. Para ver o layout, abra `index.html?preview=opiniones`. O cartão de exemplo diz "Aquí irá una reseña real de Google", sem texto inventado.
2. **Botón "Descargar carta":** enquanto o PDF não existir (`cartaPdf: null`), ele rola até a Carta de tratamientos em vez de baixar um arquivo inexistente.
3. **Analytics:** o banner de cookies registra o consentimento e expõe `window.trackEvent(origem)` nos cliques de WhatsApp. Nenhum script de terceiros é carregado.
4. **Workflow de design** (`CLAUDE.md`): na implementação vou consultar taste-skill → impeccable → emil-design-eng → ui-ux-pro-max → frontend-design.
5. **Ordem de trabalho:** a da seção 11 do prompt, com QA final em navegador e a lista de pendências do cliente.

## Fica para o construtor
Microcopy das descrições curtas de cada serviço (neutras, sem promessa clínica), timing fino das animações e o desenho exato do padrão de círculos nos placeholders.
