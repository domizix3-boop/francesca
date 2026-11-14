# Prompt original do cliente (recebido em 2026-11-14)

> Fonte de verdade de conteúdo/identidade. Ajustes decididos depois estão em
> `docs/superpowers/specs/2026-11-14-francesca-site-design.md` (ex.: stack HTML/CSS/JS puro
> em vez de Next.js; referência visual = `assets/Siterefe2.jpg`).

**Instrução do usuário:** "Sua referência total será a imagem do site que está na pasta assets." (`assets/Siterefe2.jpg`)

---

# PROMPT: Site da Francesca Estética (clínica de estética em València, Espanha)

Você é um desenvolvedor front-end sênior com olho de designer. Construa o site institucional e de conversão da **Francesca Estética**: moderno, animado, cheio de microinterações, com acabamento de estúdio e **sem cara de site gerado por IA**. O site é em **espanhol da Espanha**. Este documento é a fonte de verdade: identidade, layout, textos, animações e critérios de aceite.

---

## 0. Antes de escrever código

1. Abra e estude a imagem de referência em `./reference/inspiracao.jpg`. Ela define **100% do layout, do ritmo, das formas e da sensação** do site (descrita na seção 2). Não reinterprete: replique a estrutura e o clima, trocando apenas conteúdo e marca.
2. O logo original está em `./public/brand/logo-original.jpg` (duas silhuetas circulares pretas com laços vermelhos, "francesca" em cursiva e "ESTÉTICA" em caixa alta, sobre creme). Use-o como referência para recriar os lockups em SVG/HTML (seção 3.5). Não deforme, não recolora o laço, não troque a tipografia do logo.
3. Faça um plano curto (estrutura de pastas, componentes, dependências) e só então implemente, na ordem da seção 11.
4. Todo conteúdo que eu não forneci fica marcado no código como `// TODO(cliente):` e centralizado em `src/data/site.ts`. Nunca invente depoimentos, prêmios, equipe, preços, fotos de pessoas ou logos de marcas parceiras.

---

## 1. Contexto do negócio

- **Nome:** Francesca Estética. Clínica de estética e medicina estética.
- **Conceito da marca:** "dois rostos, um laço". Atendimento para todos; o laço vermelho é o toque final, o detalhe que faz a diferença. Tagline: **"Belleza con detalle"**.
- **Tom de voz:** caloroso, elegante, próximo, natural. Resultados equilibrados, nada de promessas milagrosas. Espanhol de Espanha, tratamento por **"tú"**.
- **Endereço:** Edificio Geminis Center, Av. de les Corts Valencianes, 39, Planta 1, Campanar, 46015 València, Valencia, España.
- **WhatsApp:** +34 633 10 70 00 (link: `https://wa.me/34633107000?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20una%20cita%20en%20Francesca%20Est%C3%A9tica`).
- **A preencher depois:** correo, @instagram, horários, link do Google Maps, fotos reais, reseñas reais.
- **Objetivo do site:** apresentar a clínica com elegância e levar a visitante a **reservar por WhatsApp**. É a conversão principal; todo CTA primário aponta para ela.

### Serviços (use exatamente estes, sem inventar outros)
- **Rostro:** Higiene facial · Peeling facial · Mesoterapia facial Ultimate Microneedling · Radiofrecuencia · Ultrasonidos
- **Mirada y labios:** Micropigmentación (labios, cejas, eyeliner) · Lifting de pestañas
- **Medicina estética:** Botox · Ácido hialurónico (hidratación de labios y remodelación de pómulos) · Hilos PDO · Bioestimulador facial
- **Depilación:** Láser diodo · Cera · Eléctrica

> Atenção legal (Espanha): a publicidade ao público de medicamentos de prescrição, como a toxina botulínica, costuma ser restrita. Deixe o nome "Botox" **num único lugar**, a carta de tratamentos, num arquivo de dados fácil de editar, com `// TODO(cliente): confirmar com assessoria legal`. Nos destaques e títulos use "Medicina estética". Não use fotos de antes e depois, nem promessas de resultado.

---

## 2. Referência visual: o que replicar da imagem

A referência é um portfólio de uma única página, claro, quente e arejado. Replique:

- **Fundo:** base clara e quente com **manchas de gradiente suave e desfocado** (blobs) no canto superior direito e atrás do hero, em tons pêssego/rosado. Sensação de luz, nunca de neon.
- **Navbar:** logo à esquerda, 5 links centralizados em texto pequeno, **botão pílula** à direita com seta diagonal (↗). Sem caixa pesada.
- **Hero em duas colunas:**
  - Esquerda: saudação grande em duas linhas, **a segunda linha na cor de destaque** e com o ponto final em tom escuro; abaixo, subtítulo em duas linhas (uma em peso normal, outra com cidade em negrito); parágrafo curto; **dois botões**: um pílula preenchida com seta, um pílula com contorno e ícone.
  - Direita: **foto recortada em círculo grande**, com um **cartão de vidro (glassmorphism)** sobreposto no canto inferior direito, contendo um ponto de status colorido + "Available for work", texto curto com data em negrito, linha divisória fina e uma ação secundária com ícone circular ("Download Resume").
- **Faixa "Trusted by":** linha fina acima e abaixo, rótulo pequeno à esquerda e logos distribuídos na horizontal.
- **"Selected work":** kicker em caixa alta pequena na cor de destaque, título em 3 linhas à esquerda, botão pílula "View all projects" alinhado à direita, e **3 cards** lado a lado, cada um com imagem grande, **etiqueta flutuante** (chip) no canto superior direito, nome do projeto, categoria e **botão circular com seta** no canto inferior direito.
- **Faixa de depoimento:** bloco largo de cantos arredondados em gradiente suave, aspas grandes na cor de destaque, citação à esquerda, avatar + nome + cargo à direita e **três pontinhos** de paginação.
- **Rodapé CTA:** frase à esquerda, contatos no centro separados por linha vertical fina, **três ícones circulares** de redes sociais à direita.
- **Forma e ritmo:** cantos muito arredondados (cards 24 a 28px, botões pílula 999px), sombras suaves e difusas, bordas de 1px quase invisíveis, muito espaço em branco, grade sólida, tipografia leve e limpa.

### Como adaptar sem perder a referência
A referência é coral/pêssego. A marca é creme, rosa polvo e vermelho do laço. Isso é compatível: **o pêssego da imagem vira rosa polvo + um fio de vermelho Lazo**, sobre fundo creme. A estrutura, as formas e a atmosfera são as da imagem; as cores e as fontes são as da Francesca.

---

## 3. Sistema de design (tokens)

### 3.1 Cores (CSS variables em `:root`, espelhadas no Tailwind)
```
--crema:   #FBF0E2;  /* fundo principal */
--tinta:   #181513;  /* texto e logo */
--arena:   #EEDFC9;  /* cartões, divisores, áreas de destaque */
--rosa:    #EFCFC4;  /* rosa polvo: blobs, fundos suaves */
--granate: #A5242A;  /* botões, links, texto vermelho (6,5:1 sobre crema) */
--lazo:    #CF3B37;  /* vermelho do laço: só gráficos e texto GRANDE (4,3:1) */
--piedra:  #6A5F57;  /* texto secundário (5,5:1 sobre crema) */
--linea:   #E3D3BC;  /* linhas finas e bordas */
--blanco:  #FFF9F1;  /* superfície elevada (cards) */
```
Regras:
- Proporção aproximada: 55% crema, 22% tinta, 15% arena/rosa, resto vermelhos.
- **Um só ponto de vermelho por seção.** Se tudo é vermelho, o laço perde o sentido.
- Lazo **nunca** em texto pequeno. Texto vermelho pequeno é sempre Granate.
- Contraste mínimo AA em todo texto.

### 3.2 Fundo com blobs (receita)
No `body`, camadas fixas ou por seção, com `filter: blur(60px)` e `opacity` baixa:
- Blob 1 (topo direito, ~700px): `radial-gradient(circle at 30% 30%, var(--lazo) 0%, transparent 65%)` a **~28% de opacidade**, misturado com rosa.
- Blob 2 (atrás da foto do hero, ~600px): rosa polvo `#EFCFC4` a ~90%.
- Blob 3 (rodapé): arena.
- Os blobs **derivam lentamente** (translate/scale em 24 a 32s, `ease-in-out`, alternate). Evite aparência de "mancha de IA": nunca mais que 3 blobs visíveis ao mesmo tempo, nenhum roxo/azul.
- Sobre tudo, uma **textura de papel/ruído** (SVG feTurbulence ou PNG) a 3 a 4% de opacidade, lembrando o papel do logo.

### 3.3 Formas, sombras, vidro
- Raios: cards 28px (desktop) / 22px (mobile); botões 999px; chips 999px; imagens do card herdam o raio do topo.
- Sombras: `0 1px 2px rgba(24,21,19,.04), 0 12px 32px -12px rgba(24,21,19,.12)`. Sem sombra preta forte.
- **Glassmorphism só em 2 lugares:** o cartão do hero e a navbar quando rolada. `background: rgba(251,240,226,.55); backdrop-filter: blur(20px) saturate(1.2); border: 1px solid rgba(255,255,255,.6);`
- Bordas: 1px `--linea`.
- Espaçamento em grade de 8px; seções com `padding-block: clamp(72px, 10vw, 128px)`; container máx. 1200px.

### 3.4 Botões e componentes
- **Primário:** pílula, fundo Granate, texto Crema, 15px/500, padding 14×24, ícone de seta (↗ ou →) dentro. Hover: fundo escurece levemente, seta desliza.
- **Secundário:** pílula com contorno 1px Tinta a 25%, fundo transparente, ícone à direita.
- **Botão circular:** 40×40, borda 1px, seta; no hover vira Granate com seta Crema.
- **Chip/etiqueta:** pílula pequena, fundo `rgba(251,240,226,.85)` com blur, texto 12px.
- **Foco visível:** anel de 2px Granate com offset de 3px em tudo que é interativo.

### 3.5 Logo e laço
- **Lockup horizontal (navbar):** "francesca" em Allura (≈30px) + "ESTÉTICA" em Jost 9px, espaçamento 0.32em, empilhados. No lugar do ponto coral do "AM." da referência, o **laço** em Lazo, pequeno, ao lado.
- **Lockups claros e escuros** em HTML/SVG (texto vivo), para usar sobre fundo tinta e granate.
- **Laço (SVG reutilizável, componente `<Bow />`):**
```svg
<svg viewBox="0 0 60 30" aria-hidden="true">
  <polygon points="28,15 4,3 4,27" fill="currentColor"/>
  <polygon points="32,15 56,3 56,27" fill="currentColor"/>
  <rect x="25" y="9" width="10" height="12" rx="2" fill="currentColor"/>
</svg>
```
- Usos do laço: marca na navbar, separador entre itens da faixa de tratamentos, favicon, selo do preloader, detalhe do cursor, bullet de lista. **Nunca** como ícone genérico em toda parte.
- **Círculos pretos** (as "cabeças" do logo) como motivo decorativo pontual: preloader, divisor de seção, estados vazios.

---

## 4. Tipografia (via `next/font/google`)

- **Allura:** assinatura, nome da marca, no máximo uma frase curta por tela. Nunca parágrafos.
- **Cormorant Garamond** (500, 600, itálico 500): títulos. Hero: `clamp(56px, 9vw, 128px)`, `line-height: .95`, tracking levemente negativo. Itálico para a palavra de ênfase.
- **Jost** (400, 500): texto, navegação, botões, etiquetas. Etiquetas e kickers em caixa alta, `letter-spacing: .22em`, 12 a 13px (ecoando o "ESTÉTICA" do logo). Texto corrido 16 a 18px, `line-height: 1.6`.
- Hierarquia e tamanhos fluidos com `clamp()`. Máx. 68 caracteres por linha em parágrafos.
- A referência usa sans geométrica leve nos títulos; aqui o **peso leve e o espaço generoso** são mantidos, mas com as fontes da marca.

---

## 5. Estrutura da página e textos (espanhol)

Página única com âncoras, mais as páginas legais. Ordem e conteúdo:

### 5.1 Navbar
- Logo (lockup + laço) · links: **Inicio · Tratamientos · La clínica · Opiniones · Contacto** · botão pílula **"Reservar cita ↗"** (WhatsApp).
- Rolando: vira pílula flutuante de vidro, centralizada, com sombra suave; esconde ao rolar para baixo e volta ao rolar para cima.
- Mobile: botão de menu que abre **overlay de tela cheia** (fundo crema, links grandes em Cormorant, entrada em cascata, laço girando devagar), botão "Reservar cita" fixo no fim.

### 5.2 Hero (replica a referência)
- H1, duas linhas: **"Hola, somos"** / **"Francesca."** (a segunda em itálico Cormorant, cor **Lazo**, com o **ponto final em Tinta**, como o "Alex Morgan." da imagem).
- Subtítulo (2 linhas): "Clínica de estética en València," / **"en Campanar."** (negrito no lugar).
- Parágrafo: "Cuidamos cada detalle de tu piel con técnicas seguras y un trato cercano. Belleza con detalle."
- Botões: **"Reservar por WhatsApp →"** (primário) e **"Ver tratamientos"** (secundário, ícone de seta para baixo).
- **Foto circular** grande à direita (`border-radius: 50%`, ~480 a 520px no desktop). Use foto real da clínica/tratamentos em `public/images/hero.jpg`. Enquanto não houver, renderize um **placeholder de marca**: círculo em gradiente rosa/arena com as duas silhuetas (dois círculos pretos e os laços) em SVG. **Não use fotos de banco de imagens de pessoas.**
- **Cartão de vidro** sobreposto (canto inferior direito da foto): ponto pulsante Lazo + "Reservas abiertas"; texto "Escríbenos por WhatsApp y elige tu horario."; linha divisória; ação com ícone circular **"Descargar carta de tratamientos"** (baixa `public/carta-tratamientos.pdf`; `// TODO(cliente)` gerar o PDF).

### 5.3 Faixa de tratamientos (substitui "Trusted by")
- Rótulo à esquerda: **"Nuestros tratamientos"**.
- À direita, **marquee infinito** com os nomes dos serviços em Cormorant itálico, separados por pequenos laços em Lazo. Pausa no hover. Linhas finas `--linea` em cima e embaixo. Não use logos de empresas.

### 5.4 Tratamientos destacados (replica "Selected work")
- Kicker: **"TRATAMIENTOS DESTACADOS"** (Granate).
- Título (3 linhas): "Cuidados pensados / para realzar, / no para cambiar."
- Botão pílula à direita: **"Ver todos los tratamientos →"** (rola para a carta).
- **3 cards:**
  1. Micropigmentación · "Labios, cejas y eyeliner" · chip **"Mirada y labios"**
  2. Mesoterapia facial Ultimate Microneedling · "Renueva y reactiva tu piel" · chip **"Rostro"**
  3. Ácido hialurónico · "Hidratación de labios y remodelación de pómulos" · chip **"Medicina estética"**
- Imagens: placeholders de marca (gradiente rosa/arena com padrão sutil de círculos) até haver fotos reais. `// TODO(cliente)`.
- Botão circular com seta em cada card. Card inteiro é clicável (abre a categoria correspondente na carta).

### 5.5 La clínica (seção que a referência não tem; acrescente no mesmo estilo)
- Layout assimétrico: coluna de texto + imagem recortada com um **círculo preto grande** ao fundo (motivo do logo) e laço Lazo no canto.
- Kicker: "LA CLÍNICA". Título: **"Dos caras, un lazo."**
- Texto: "En Francesca Estética creemos que la belleza está en los detalles. Atendemos a todas las personas, con cercanía, técnica y un resultado que se ve natural: el toque final que marca la diferencia."
- Três linhas curtas com contador discreto, sem inventar números: "Para todas las personas" · "Técnicas seguras" · "Trato cercano".
- `// TODO(cliente)`: histórias, equipe e formação reais, se quiserem incluir.

### 5.6 Carta de tratamientos (interativa)
- Título: **"Carta de tratamientos"**.
- **Abas por categoria** (Rostro · Mirada y labios · Medicina estética · Depilación) com indicador deslizante (`layoutId`).
- Cada aba mostra uma **lista com linhas finas** (visual da lista do cliente): nome do serviço à esquerda, seta circular à direita. Clique expande uma linha (accordion) com descrição curta + botão **"Preguntar por WhatsApp"** com mensagem pré-preenchida sobre aquele tratamiento.
- Descrições curtas, neutras, sem promessa clínica. Ex.: Higiene facial, "Limpieza profunda para una piel fresca y equilibrada."
- Dados em `src/data/services.ts` (id, categoria, nome, descrição, mensagem).

### 5.7 Opiniones (replica a faixa de depoimento)
- Bloco largo com gradiente suave rosa→arena, aspas grandes em Lazo, citação à esquerda, avatar (iniciais, sem foto) + nome + "Clienta" à direita, **três pontinhos** de paginação e arrastar para trocar.
- Conteúdo vem de `src/data/reviews.ts`. **Sem reseñas reais, a seção não aparece** (flag `showReviews = false`). `// TODO(cliente)`: importar reseñas reais do Google, com consentimento.

### 5.8 Cómo reservar (3 passos, enxuto)
- "1. Escríbenos por WhatsApp · 2. Elige tu horario · 3. Ven a conocernos." Linha conectando os passos que se desenha ao rolar. Texto sugerido, `// TODO(cliente)`: confirmar o processo real.

### 5.9 Rodapé CTA (replica o rodapé da referência)
- Frase à esquerda (Cormorant): **"Reserva tu cita y cuéntanos qué te gustaría realzar."**
- Centro, separados por linha vertical fina: **WhatsApp +34 633 10 70 00** e **Edificio Geminis Center, Av. de les Corts Valencianes, 39, Planta 1, 46015 València**.
- Direita: **3 ícones circulares** (WhatsApp, Instagram, Google Maps). `// TODO(cliente)`: URLs de Instagram e Maps.
- Abaixo: logo claro, "© 2026 Francesca Estética", links **Aviso legal · Política de privacidad · Cookies**.
- **Botão flutuante de WhatsApp** (pílula Granate no canto inferior direito, aparece após 600px de scroll; no mobile vira barra inferior discreta).

---

## 6. Animações e interações

Biblioteca: **Framer Motion** (`motion`) para componentes, **Lenis** para scroll suave, CSS para blobs/marquee. Curva padrão `cubic-bezier(.22, 1, .36, 1)`; durações 500 a 900ms. **Sem bounce, sem elástico exagerado, sem confete.** Respeite `prefers-reduced-motion`: desligue parallax, marquee e entradas, mantendo apenas fades curtos.

1. **Preloader de marca** (só na primeira visita da sessão, máx. ~1.4s, pulável): dois círculos pretos deslizam para o centro, o laço Lazo "cai" entre eles, o conjunto se transforma no logo e a tela sobe em cortina (clip-path). Depois o hero entra.
2. **Hero:** as linhas do H1 entram com máscara (cada linha sobe de dentro de um `overflow: hidden`), com atraso em cascata. O ponto final aparece por último. A foto circular **abre de dentro para fora** (`clip-path: circle()`) com leve scale de 1.08→1; o cartão de vidro entra deslizando, depois flutua 6px em loop lento. Blobs derivam continuamente.
3. **Parallax sutil:** foto do hero e blobs movem em velocidades diferentes (≤ 40px). O laço da navbar balança 8° no hover.
4. **Botões:** efeito **magnético leve** (segue o cursor em ≤ 8px), preenchimento que varre da esquerda no hover, seta que sai de um lado e reentra do outro.
5. **Cursor personalizado (apenas ponteiro fino):** ponto pequeno que segue com atraso suave; sobre cards vira um círculo com "Ver" em Jost; sobre botões some. Desligado em touch.
6. **Cards:** inclinação 3D mínima (≤ 4°) seguindo o mouse, zoom 1→1.06 na imagem, chip desliza para cima, botão circular gira de −45° a 0° e preenche de Granate.
7. **Marquee:** velocidade constante, pausa no hover, desacelera ao rolar rápido.
8. **Revelações ao rolar:** `whileInView`, uma vez, `translateY(24px)`+fade com stagger de 70ms. Títulos de seção revelam por linha, como no hero. Nada pisca de novo ao voltar a rolar.
9. **Navbar:** transição para pílula de vidro ao passar 80px; esconde/mostra conforme a direção do scroll; sublinhado fino que acompanha a seção ativa.
10. **Barra de progresso de leitura:** linha de 2px em Granate no topo.
11. **Carta de tratamientos:** indicador de aba deslizante; troca de lista com fade+shift curto; accordion com altura animada.
12. **Opiniones:** arrastável, com mola suave, pontinhos que preenchem; troca automática a cada 7s, pausa no hover/foco.
13. **Passos "Cómo reservar":** linha que se desenha ao rolar (`pathLength`).
14. **Menu mobile:** overlay com cortina, links em cascata, laço girando devagar.
15. **Micro-feedback:** botão de WhatsApp "respira" uma vez ao aparecer; links com sublinhado que cresce do centro; foco visível por teclado em tudo.

Performance das animações: só `transform` e `opacity`; `will-change` pontual; sem animar `blur` em tempo real (os blobs já vêm desfocados); 60fps em celular médio.

---

## 7. "Sem cara de IA": regras de acabamento

- **Proibido:** gradientes roxo/azul, brilhos neon, glow em tudo, emojis como ícones, ícones genéricos em círculos coloridos, grade de "3 features com ícone e título centralizado" repetida em todas as seções, lorem ipsum, "Welcome to...", frases vazias tipo "soluciones innovadoras", sombras iguais em tudo, simetria perfeita em todas as seções.
- **Faça:** assimetria controlada, escala tipográfica com contraste forte (títulos enormes, textos pequenos e precisos), muito ar, alinhamentos de grade rigorosos, detalhes de artesão (laço, círculos, textura de papel, linhas finas), copy específica e humana, microcopy com personalidade ("Escríbenos, te respondemos encantadas"), imagens com a mesma temperatura de cor.
- Glassmorphism e blur só nos 2 lugares definidos. Vermelho Lazo em **um** ponto por seção.
- Ícones: um único conjunto de traço fino (Lucide ou Phosphor "light") com stroke de 1.5px, usados com parcimônia.
- Todo placeholder visual deve parecer **intencional** (gradiente de marca, motivo de círculos), nunca uma caixa cinza.

---

## 8. Stack e arquitetura

- **Next.js (App Router) + TypeScript + Tailwind CSS**, exportável como site estático (`output: 'export'`) para hospedar em Vercel/Netlify/Cloudflare Pages.
- Dependências enxutas: `motion`, `lenis`, `lucide-react`. Evite bibliotecas pesadas (GSAP só se for indispensável).
- Fontes via `next/font` (Allura, Cormorant Garamond, Jost), `display: swap`.
- Imagens com `next/image`, AVIF/WebP, `sizes` corretos, `priority` só no hero.
- Estrutura sugerida:
```
src/
  app/ (layout.tsx, page.tsx, aviso-legal/, privacidad/, cookies/, sitemap.ts, robots.ts)
  components/ (Navbar, Hero, TreatmentMarquee, FeaturedCards, Clinic, Menu, Reviews, Steps, Footer,
               WhatsAppFab, Preloader, Cursor, Bow, Logo, Blobs, Magnetic, Reveal)
  data/ (site.ts, services.ts, reviews.ts)
  styles/ (tokens.css)
public/ (brand/, images/, carta-tratamientos.pdf, favicon.svg)
reference/ (inspiracao.jpg)
```
- Tudo que é texto/contato em `src/data`, nada duplicado nos componentes.
- Mobile-first. Breakpoints: 390 · 768 · 1024 · 1440.

### Responsivo
- **Hero mobile:** texto primeiro; foto circular (~300px) logo abaixo, cartão de vidro sobreposto no canto inferior; botões em largura total.
- **Cards:** carrossel horizontal com snap no mobile.
- **Rodapé:** empilha; contatos em lista; ícones em linha.
- Sem scroll horizontal em nenhuma largura.

---

## 9. SEO, acessibilidade, performance e legal

- **SEO local (València/Campanar):** `<title>` "Francesca Estética | Clínica de estética en València (Campanar)", meta description, Open Graph e Twitter card, canonical, `lang="es-ES"`, `sitemap.xml`, `robots.txt`.
- **JSON-LD** `HealthAndBeautyBusiness` com nome, endereço completo, telefone, `sameAs` (redes), `openingHours` (`TODO`) e `makesOffer` com os serviços.
- **Acessibilidade (WCAG AA):** contraste, HTML semântico, `aria-label` em botões só-ícone, abas/accordion/carrossel navegáveis por teclado e com ARIA corretos, foco visível, `alt` descritivo, `prefers-reduced-motion`, alvos de toque ≥ 44px, skip-link.
- **Performance:** Lighthouse mobile ≥ 90 em Performance, ≥ 95 em Acessibilidade, SEO e Boas Práticas. LCP < 2.5s, CLS < 0.05. Carregar preloader/cursor/Lenis sem bloquear o primeiro render.
- **Legal (Espanha/UE):** banner de **cookies** conforme RGPD/LSSI (só carrega analytics após consentimento), páginas de Aviso legal, Política de privacidad e Cookies com campos `TODO(cliente)` (razão social, NIF, etc.). Eventos de analytics (consentidos) para cliques em WhatsApp, por seção de origem.
- Nada de fotos de antes e depois, nem alegações de saúde. Texto de medicina estética cauteloso.

---

## 10. Conteúdo pendente (deixe tudo pronto para plugar)

`TODO(cliente)`: fotos reais (hero, tratamentos, clínica), reseñas reais, correo, @instagram, link do Google Maps, horários, PDF da carta, razão social/NIF para os textos legais, confirmação legal sobre "Botox", confirmação do processo de reserva.

---

## 11. Ordem de trabalho e critérios de aceite

**Ordem:** (1) tokens, fontes, fundo com blobs e textura; (2) Logo, Bow, Navbar; (3) Hero completo; (4) faixa de tratamientos; (5) cards destacados; (6) La clínica; (7) carta com abas/accordion; (8) Opiniones; (9) Cómo reservar; (10) rodapé + WhatsApp flutuante; (11) preloader, cursor e polimento das animações; (12) SEO/JSON-LD/legal/cookies; (13) responsivo e QA.

**Critérios de aceite:**
- [ ] O hero é reconhecivelmente o da imagem de referência (duas colunas, ênfase na segunda linha, foto circular, cartão de vidro, dois botões pílula).
- [ ] Todas as seções da referência existem e foram adaptadas (faixa, cards com chip e botão circular, depoimento, rodapé CTA).
- [ ] Paleta, fontes e laço seguem a seção 3 e 4; vermelho Lazo só em um ponto por seção e nunca em texto pequeno.
- [ ] As 15 interações da seção 6 funcionam, com `prefers-reduced-motion` respeitado.
- [ ] Nenhum item proibido da seção 7. Nenhum dado inventado.
- [ ] Todo CTA primário abre o WhatsApp com mensagem pré-preenchida.
- [ ] `npm run build` e `npm run lint` passam sem erros; sem warnings de acessibilidade.
- [ ] Testado em 390px e 1440px, sem scroll horizontal; Lighthouse nas metas.
- [ ] Ao terminar, rode o site, confira cada seção no navegador e liste o que ainda depende do cliente.

Entregue com um README curto: como rodar, onde editar textos/contatos/serviços, como trocar as imagens e como publicar.

---

# AJUSTE IMPORTANTE SOBRE IMAGENS (mensagem do usuário)

Ainda não tenho as fotos. Não use fotos de banco de imagens nem gere imagens.
Em todo lugar onde entra foto (hero, cards de tratamientos, La clínica),
crie um componente <ImagePlaceholder /> reutilizável:
- fundo em gradiente suave rosa polvo/arena, com o mesmo raio e proporção
  que a foto final terá (círculo no hero, retângulo nos cards)
- um texto pequeno e discreto no centro, em Jost caixa alta:
  "IMAGEN AQUÍ" + a descrição do que vai entrar (ex.: "Foto de micropigmentación de labios")
- um ícone de câmera de traço fino acima do texto
- cada placeholder com um id e o caminho do arquivo esperado
  (ex.: public/images/hero.jpg), para eu só trocar o arquivo depois
Ao terminar, liste todos os placeholders com o caminho de cada imagem
e o tamanho recomendado (largura x altura).
