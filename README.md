# Francesca Estética: sitio web

Web de una página (+ páginas legales) en HTML, CSS y JS puro. Sin build y sin dependencias en producción.

## Cómo verlo en local
Los módulos JS necesitan servirse por http (no abras el archivo con doble clic):

```bash
cd francesca
npx serve .          # o: python3 -m http.server 8080
```

## Dónde se edita cada cosa
| Qué | Dónde |
|---|---|
| WhatsApp, dirección, correo, Instagram, Maps, horario, PDF de la carta, dominio | `js/data.js` → `SITE` |
| Servicios de la carta (nombre, descripción, mensaje de WhatsApp) | `js/data.js` → `SERVICES` |
| Franja animada / 3 tratamientos destacados | `js/data.js` → `MARQUEE`, `FEATURED` |
| Reseñas (activar con `showReviews: true`) | `js/data.js` → `REVIEWS` |
| Pasos de «Cómo reservar» | `js/data.js` → `STEPS` |
| Textos del hero, La clínica, pie | `index.html` |
| Colores, tipografías, radios | `css/tokens.css` |
| Textos legales (completar los campos en rojo) | `aviso-legal.html`, `privacidad.html`, `cookies.html` |

Busca `TODO(cliente)` en el proyecto para ver todo lo pendiente.

Vista previa de la sección de opiniones (sin reseñas reales): `index.html?preview=opiniones`.

## Cómo poner las fotos
Guarda cada foto **con el nombre exacto** en `assets/images/`. El sitio la detecta sola y quita el marcador «IMAGEN AQUÍ». No hace falta tocar código.

| Id del marcador | Archivo | Tamaño recomendado | Forma |
|---|---|---|---|
| `#ph-hero` | `assets/images/hero.jpg` | 1200 × 1200 | círculo (hero) |
| `#ph-trat-micropigmentacion` | `assets/images/tratamiento-micropigmentacion.jpg` | 1200 × 1000 | tarjeta |
| `#ph-trat-mesoterapia` | `assets/images/tratamiento-mesoterapia.jpg` | 1200 × 1000 | tarjeta |
| `#ph-trat-hialuronico` | `assets/images/tratamiento-hialuronico.jpg` | 1200 × 1000 | tarjeta |
| `#ph-clinica` | `assets/images/clinica.jpg` | 1200 × 1500 | arco vertical |
| (compartir en redes) | `assets/og.jpg` | 1200 × 630 | imagen para WhatsApp/Facebook |

Consejos: JPG de calidad 80 o WebP (si usas WebP, cambia la extensión en `PLACEHOLDERS`), menos de 300 KB cada una, con la misma temperatura de color cálida. Sin fotos de antes y después.

## Publicar
Es un sitio estático: arrastra la carpeta (sin `tests/` ni `docs/`) a Netlify Drop o a Cloudflare Pages, o súbela a cualquier hosting. Antes de publicar, cambia el dominio en `index.html` (canonical, og:url, og:image, JSON-LD), `sitemap.xml`, `robots.txt` y `SITE.domain`.

## Tests (desarrollo)
```bash
cd tests && npm install && npm test     # 20 pruebas en Chromium headless
node shoot.mjs                           # capturas en tests/shots/
```
