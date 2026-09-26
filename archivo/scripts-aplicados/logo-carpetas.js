/* Coloca el logotipo real y apunta cada página a su carpeta de imágenes. */
const fs = require('fs');
const P = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/';

function cambia(h, a, b, etq){
  if (!h.includes(a)) throw new Error('no encontré: ' + etq);
  return h.split(a).join(b);
}

/* ══════════ PORTADA: logotipo real en el hero ══════════ */
let ix = fs.readFileSync(P + 'index.html', 'utf8');

ix = cambia(ix,
`      <h1 class="logo-word">NILA</h1>
      <p class="logo-sub">Rooftop</p>`,
`      <h1 class="logo-real"><img src="img/logotipo.webp" alt="NILA ROOFTOP" width="900" height="520"></h1>`,
'wordmark del hero');

const CSS_LOGO = `
/* ── Logotipo real ──
   El archivo viene en negro sobre fondo blanco y opaco. En vez de
   reprocesarlo, se invierte (letras a blanco, fondo a negro) y se
   funde en modo "screen", que vuelve invisible todo lo negro. El
   resultado son las letras blancas flotando sobre el degradado. */
.logo-real{ margin:0; line-height:0; }
.logo-real img{
  width:clamp(230px,50vw,600px); height:auto; max-width:100%;
  filter:invert(1);
  mix-blend-mode:screen;
}
/* Si el navegador no admite la fusión, el invertido por sí solo deja
   el logotipo sobre un rectángulo casi negro, que sigue siendo legible. */
@supports not (mix-blend-mode: screen){
  .logo-real img{ border-radius:3px; }
}
`;
ix = ix.slice(0, ix.indexOf('</style>')) + CSS_LOGO + ix.slice(ix.indexOf('</style>'));

// El logotipo es mejor carta de presentación al compartir que la foto de perfil
ix = cambia(ix, '<meta property="og:image" content="img/logo.jpg">',
                '<meta property="og:image" content="img/logotipo.webp">', 'og:image');

fs.writeFileSync(P + 'index.html', ix, 'utf8');
console.log('index.html: logotipo colocado');

/* ══════════ EVENTOS: carpeta propia ══════════ */
let ev = fs.readFileSync(P + 'eventos.html', 'utf8');
ev = cambia(ev, '"imagen": "img/evento-aniversario.jpg"', '"imagen": "img/eventos/aniversario.jpg"', 'flyer aniversario');
ev = cambia(ev, '"imagen": "img/evento-tommax.jpg"', '"imagen": "img/eventos/tommax.jpg"', 'flyer tommax');
// Recordatorio dentro del propio archivo, junto a los datos
ev = cambia(ev,
`     fecha: AAAA-MM-DD · hora: HH:MM (24h)`,
`     fecha: AAAA-MM-DD · hora: HH:MM (24h)
     Los flyers viven en img/eventos/ (ver LEEME.txt en esa carpeta)`,
'comentario de datos');
fs.writeFileSync(P + 'eventos.html', ev, 'utf8');
console.log('eventos.html: apunta a img/eventos/');
