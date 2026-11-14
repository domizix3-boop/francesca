/* =========================================================================
   Francesca Estética: TODOS os textos, contatos e serviços editáveis.
   Edite aqui; o resto do site lê deste arquivo.
   ========================================================================= */

export const SITE = {
  name: 'Francesca Estética',
  tagline: 'Belleza con detalle',
  whatsapp: {
    number: '34633107000',
    display: '+34 633 10 70 00',
    defaultMsg: 'Hola, me gustaría reservar una cita en Francesca Estética',
  },
  address: {
    building: 'Edificio Geminis Center',
    street: 'Av. de les Corts Valencianes, 39, Planta 1',
    district: 'Campanar',
    postcode: '46015',
    city: 'València',
    region: 'Valencia',
    country: 'ES',
  },
  email: null,      // TODO(cliente): correo de contacto
  instagram: null,  // TODO(cliente): URL de Instagram, ej. 'https://www.instagram.com/usuario/'
  maps: null,       // TODO(cliente): enlace de Google Maps de la ficha
  hours: null,      // TODO(cliente): horario, ej. [{ days: 'Lunes a viernes', time: '10:00–20:00' }]
  cartaPdf: null,   // TODO(cliente): 'assets/carta-tratamientos.pdf' cuando exista el PDF
  domain: 'https://www.francescaestetica.es', // TODO(cliente): dominio real (canonical, sitemap, og)
  showReviews: false, // TODO(cliente): true cuando haya reseñas reales en REVIEWS
};

/** Enlace de WhatsApp con mensaje prellenado. */
export function waUrl(msg = SITE.whatsapp.defaultMsg) {
  return `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(msg)}`;
}

/** Enlace de mapas: el de la ficha si existe; si no, búsqueda por dirección. */
export function mapsUrl() {
  if (SITE.maps) return SITE.maps;
  const a = SITE.address;
  return 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(`${a.building}, ${a.street}, ${a.postcode} ${a.city}`);
}

export const CATEGORIES = [
  { id: 'rostro', label: 'Rostro' },
  { id: 'mirada', label: 'Mirada y labios' },
  { id: 'medicina', label: 'Medicina estética' },
  { id: 'depilacion', label: 'Depilación' },
];

const ask = (name) => `Hola, me gustaría información sobre ${name} en Francesca Estética`;

// TODO(cliente): revisar las descripciones (cortas, neutras, sin promesas de resultado).
export const SERVICES = [
  { id: 'higiene', cat: 'rostro', name: 'Higiene facial', desc: 'Limpieza profunda para una piel fresca y equilibrada.' },
  { id: 'peeling', cat: 'rostro', name: 'Peeling facial', desc: 'Renovación suave de la capa más superficial de la piel, para un tono más uniforme.' },
  { id: 'mesoterapia', cat: 'rostro', name: 'Mesoterapia facial Ultimate Microneedling', desc: 'Microneedling con activos seleccionados para renovar y reactivar tu piel.' },
  { id: 'radiofrecuencia', cat: 'rostro', name: 'Radiofrecuencia', desc: 'Calor controlado, sin agujas, para cuidar la firmeza de la piel.' },
  { id: 'ultrasonidos', cat: 'rostro', name: 'Ultrasonidos', desc: 'Tecnología de ultrasonidos para cuidar y tonificar el rostro.' },

  { id: 'micropigmentacion', cat: 'mirada', name: 'Micropigmentación (labios, cejas, eyeliner)', desc: 'Pigmento semipermanente para definir labios, cejas o mirada con un acabado natural.' },
  { id: 'lifting-pestanas', cat: 'mirada', name: 'Lifting de pestañas', desc: 'Curvatura natural para tus pestañas, sin extensiones.' },

  // TODO(cliente): confirmar con asesoría legal el uso del nombre «Botox» (medicamento de prescripción).
  { id: 'toxina', cat: 'medicina', name: 'Botox', desc: 'Tratamiento de medicina estética para las líneas de expresión, siempre tras una valoración previa.' },
  { id: 'hialuronico', cat: 'medicina', name: 'Ácido hialurónico (hidratación de labios y remodelación de pómulos)', desc: 'Hidratación de labios y remodelación de pómulos, siempre tras una valoración previa.' },
  { id: 'hilos', cat: 'medicina', name: 'Hilos PDO', desc: 'Hilos reabsorbibles que dan soporte a los tejidos del rostro, tras una valoración previa.' },
  { id: 'bioestimulador', cat: 'medicina', name: 'Bioestimulador facial', desc: 'Tratamiento que acompaña la calidad de la piel desde dentro, tras una valoración previa.' },

  { id: 'laser', cat: 'depilacion', name: 'Láser diodo', desc: 'Depilación láser por sesiones, para zonas grandes y pequeñas.' },
  { id: 'cera', cat: 'depilacion', name: 'Cera', desc: 'Depilación con cera, rápida y cuidadosa.' },
  { id: 'electrica', cat: 'depilacion', name: 'Eléctrica', desc: 'Depilación eléctrica, vello a vello, para zonas concretas.' },
].map((s) => ({ ...s, msg: ask(s.name.replace(/ \(.*\)$/, '')) }));

/** Nombres para la franja animada (sin «Botox»: solo aparece en la carta). */
export const MARQUEE = [
  'Higiene facial', 'Peeling facial', 'Ultimate Microneedling', 'Radiofrecuencia', 'Ultrasonidos',
  'Micropigmentación', 'Lifting de pestañas', 'Ácido hialurónico', 'Hilos PDO', 'Bioestimulador facial',
  'Láser diodo', 'Cera', 'Depilación eléctrica',
];

export const FEATURED = [
  { cat: 'mirada', chip: 'Mirada y labios', name: 'Micropigmentación', sub: 'Labios, cejas y eyeliner', media: 'trat-micropigmentacion' },
  { cat: 'rostro', chip: 'Rostro', name: 'Mesoterapia facial Ultimate Microneedling', sub: 'Renueva y reactiva tu piel', media: 'trat-mesoterapia' },
  { cat: 'medicina', chip: 'Medicina estética', name: 'Ácido hialurónico', sub: 'Hidratación de labios y remodelación de pómulos', media: 'trat-hialuronico' },
];

/**
 * Huecos de foto. Para poner la foto real, guarda el archivo en `src` (mismo nombre).
 * recommended = tamaño recomendado (ancho × alto) en píxeles.
 */
export const PLACEHOLDERS = {
  'hero': { src: 'assets/images/hero.jpg', desc: 'Foto principal de la clínica o de un tratamiento facial', alt: 'Tratamiento facial en la cabina de Francesca Estética', recommended: '1200 × 1200 (cuadrada; se recorta en círculo)' },
  'trat-micropigmentacion': { src: 'assets/images/tratamiento-micropigmentacion.jpg', desc: 'Foto de micropigmentación de labios', alt: 'Micropigmentación de labios en Francesca Estética', recommended: '1200 × 1000' },
  'trat-mesoterapia': { src: 'assets/images/tratamiento-mesoterapia.jpg', desc: 'Foto de tratamiento facial con microneedling', alt: 'Tratamiento de mesoterapia facial con microneedling', recommended: '1200 × 1000' },
  'trat-hialuronico': { src: 'assets/images/tratamiento-hialuronico.jpg', desc: 'Foto de tratamiento de labios o pómulos', alt: 'Tratamiento con ácido hialurónico en cabina', recommended: '1200 × 1000' },
  'clinica': { src: 'assets/images/clinica.jpg', desc: 'Foto de la cabina o la recepción de la clínica', alt: 'Cabina de Francesca Estética en Campanar, València', recommended: '1200 × 1500 (vertical)' },
};

/**
 * Reseñas reales (Google), con consentimiento. Formato:
 * { text: '...', name: 'Nombre A.', role: 'Clienta' }
 * TODO(cliente): importar reseñas reales. Sin reseñas, la sección no se muestra.
 */
export const REVIEWS = [];

/** Pasos de reserva. TODO(cliente): confirmar el proceso real. */
export const STEPS = [
  { title: 'Escríbenos por WhatsApp', text: 'Cuéntanos qué tratamiento te interesa o qué te gustaría mejorar.' },
  { title: 'Elige tu horario', text: 'Te proponemos los huecos libres y reservamos el que mejor te encaje.' },
  { title: 'Ven a conocernos', text: 'Te esperamos en Campanar, en la primera planta del Geminis Center.' },
];
