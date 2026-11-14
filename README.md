# Francesca Estética: site

Site de uma página (mais as páginas legais) em HTML, CSS e JS puro. Sem build e sem dependências em produção.

## Como ver localmente
Os módulos JS precisam ser servidos por http (abrir o arquivo com dois cliques não funciona):

```bash
cd francesca
npx serve .          # ou: python3 -m http.server 8080
```

## Onde editar cada coisa
| O quê | Onde |
|---|---|
| WhatsApp, endereço, e-mail, Instagram, Maps, horário, PDF da carta, domínio | `js/data.js` → `SITE` |
| Serviços da carta (nome, descrição, mensagem do WhatsApp) | `js/data.js` → `SERVICES` |
| Faixa animada / 3 tratamentos em destaque | `js/data.js` → `MARQUEE`, `FEATURED` |
| Reseñas (ativar com `showReviews: true`) | `js/data.js` → `REVIEWS` |
| Passos de "Cómo reservar" | `js/data.js` → `STEPS` |
| Textos do hero, La clínica e rodapé | `index.html` |
| Cores, fontes e raios | `css/tokens.css` |
| Textos legais (completar os campos em vermelho) | `aviso-legal.html`, `privacidad.html`, `cookies.html` |

Procure `TODO(cliente)` no projeto para ver tudo o que está pendente.

Prévia da seção de opiniões (sem reseñas reais): `index.html?preview=opiniones`.

## Como colocar as fotos
Salve cada foto **com o nome exato** em `assets/images/`. O site detecta sozinho e tira o placeholder "IMAGEN AQUÍ", sem precisar mexer no código.

| Id do placeholder | Arquivo | Tamanho recomendado | Formato |
|---|---|---|---|
| `#ph-hero` | `assets/images/hero.jpg` | 1200 × 1200 | círculo (hero) |
| `#ph-trat-micropigmentacion` | `assets/images/tratamiento-micropigmentacion.jpg` | 1200 × 1000 | card |
| `#ph-trat-mesoterapia` | `assets/images/tratamiento-mesoterapia.jpg` | 1200 × 1000 | card |
| `#ph-trat-hialuronico` | `assets/images/tratamiento-hialuronico.jpg` | 1200 × 1000 | card |
| `#ph-clinica` | `assets/images/clinica.jpg` | 1200 × 1500 | arco vertical |
| (compartilhamento) | `assets/og.jpg` | 1200 × 630 | prévia no WhatsApp/Facebook |

Dicas:
- Use JPG com qualidade 80 ou WebP. Se usar WebP, troque a extensão em `PLACEHOLDERS`.
- Mantenha cada foto abaixo de 300 KB.
- Use fotos com a mesma temperatura de cor quente.
- Não use fotos de antes e depois.

## Publicar
É um site estático: arraste a pasta (sem `tests/` e `docs/`) para o Netlify Drop ou o Cloudflare Pages, ou envie para qualquer hospedagem.

Antes de publicar, troque o domínio provisório `francescaestetica.es` pelo real nestes lugares:
- `index.html` (canonical, og:url, og:image e JSON-LD);
- `sitemap.xml`;
- `robots.txt`;
- `SITE.domain`.

## Testes (desenvolvimento)
```bash
cd tests && npm install && npm test     # 20 testes no Chromium headless
node shoot.mjs                           # capturas em tests/shots/
```
