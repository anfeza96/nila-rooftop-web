/* Dos videos verticales de telón de fondo en la portada. Solo en index.html. */
const fs = require('fs');
const P = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/';

function cambia(h, a, b, etq){
  if (!h.includes(a)) throw new Error('no encontré: ' + etq);
  return h.split(a).join(b);
}

let h = fs.readFileSync(P + 'index.html', 'utf8');

/* ── 1. El degradado cede el fondo a los videos y queda de respaldo ── */
h = cambia(h,
  '  position:absolute; inset:-14% -6%; z-index:-3;',
  '  position:absolute; inset:-14% -6%; z-index:-4;',
  'capa del degradado');

/* ── 2. El logotipo deja de depender de la fusión ── */
h = cambia(h,
`/* ── Logotipo real ──
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
}`,
`/* ── Logotipo real ──
   El archivo trae la tinta en negro sobre fondo transparente, así que
   basta con teñirlo de blanco: brightness(0) aplana cualquier color a
   negro e invert(1) lo sube a blanco, sin tocar la transparencia. Nada
   de modos de fusión: sobre video darían problemas y cuestan tarjeta
   gráfica. */
.logo-real{ margin:0; line-height:0; }
.logo-real img{
  width:clamp(230px,50vw,600px); height:auto; max-width:100%;
  filter:brightness(0) invert(1);
  /* un halo muy leve para despegarlo de las zonas claras del video */
  -webkit-filter:brightness(0) invert(1);
}`,
  'CSS del logotipo');

/* ── 3. Estilos de los videos ── */
const CSS_VIDEO = `
/* ── Videos de la portada ──
   Dos piezas verticales, una al lado de la otra, detrás del logotipo.
   Son telón de fondo: sin sonido, sin controles y fuera del alcance del
   ratón. Debajo queda el degradado de .hero-bg, que es lo que se ve
   mientras cargan o si el navegador bloquea la reproducción automática. */
.hero-video{
  position:absolute; inset:0; z-index:-3;
  display:grid; grid-template-columns:1fr 1fr;
}
.hero-video video{
  display:block; width:100%; height:100%; object-fit:cover;
  pointer-events:none;
}
/* La capa que los baja de tono. Va en CSS y no horneada en el archivo
   para poder graduarla sin volver a convertir los videos. */
.hero-video::after{
  content:""; position:absolute; inset:0;
  background:linear-gradient(180deg,
    rgba(12,8,5,.60) 0%, rgba(12,8,5,.50) 38%, rgba(12,8,5,.74) 100%);
}
/* Quien pide menos movimiento se queda con el degradado de siempre */
@media (prefers-reduced-motion: reduce){
  .hero-video{ display:none; }
}
`;
const iStyle = h.indexOf('</style>');
if (iStyle < 0) throw new Error('sin </style>');
h = h.slice(0, iStyle) + CSS_VIDEO + h.slice(iStyle);

/* ── 4. Marcado, justo detrás del degradado ── */
h = cambia(h,
`  <div class="hero-bg" aria-hidden="true"><i></i></div>`,
`  <div class="hero-bg" aria-hidden="true"><i></i></div>
  <div class="hero-video" aria-hidden="true">
    <video autoplay muted loop playsinline preload="auto" disablepictureinpicture tabindex="-1">
      <source src="video/hero-terraza.mp4" type="video/mp4">
    </video>
    <video autoplay muted loop playsinline preload="auto" disablepictureinpicture tabindex="-1">
      <source src="video/hero-comida.mp4" type="video/mp4">
    </video>
  </div>`,
  'marcado del hero');

/* ── 5. Arranque y ahorro de batería ── */
const JS_VIDEO = `
/* ══════ Videos de la portada ══════
   Tres cosas: insistir si el navegador bloquea el arranque automático,
   parar cuando la portada sale de pantalla (dos videos en bucle sobre un
   celular consumen batería y provocan tirones al desplazarse) y no tocar
   nada si el visitante pidió menos movimiento. */
(function(){
  const menos = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cinta = Array.from(document.querySelectorAll('.hero-video video'));
  if (!cinta.length) return;

  if (menos.matches){ cinta.forEach(v => { v.pause(); v.removeAttribute('autoplay'); }); return; }

  const arranca = () => cinta.forEach(v => { const p = v.play(); if (p) p.catch(() => {}); });

  /* Safari en ahorro de energía y algún Android niegan el arranque hasta
     que hay un gesto. El primero que haga el visitante sirve. */
  arranca();
  const alPrimerGesto = () => {
    arranca();
    ['touchstart','click','keydown','scroll'].forEach(e =>
      window.removeEventListener(e, alPrimerGesto));
  };
  ['touchstart','click','keydown','scroll'].forEach(e =>
    window.addEventListener(e, alPrimerGesto, { once:false, passive:true }));

  /* Pausa fuera de pantalla. Se mide directamente en cada desplazamiento
     porque IntersectionObserver no siempre dispara en vistas previas. */
  const portada = document.querySelector('.hero');
  let corriendo = true;
  function revisaVideos(){
    if (!portada) return;
    const r = portada.getBoundingClientRect();
    const visible = r.bottom > 0 && r.top < window.innerHeight;
    if (visible === corriendo) return;
    corriendo = visible;
    cinta.forEach(v => { if (visible){ const p = v.play(); if (p) p.catch(() => {}); } else v.pause(); });
  }
  window.addEventListener('scroll', revisaVideos, { passive:true });
  document.addEventListener('visibilitychange', () => {
    cinta.forEach(v => { if (document.hidden) v.pause(); else { const p = v.play(); if (p) p.catch(() => {}); } });
  });
})();
`;

h = cambia(h, '\npreparaRise();', JS_VIDEO + '\npreparaRise();', 'final del script');

fs.writeFileSync(P + 'index.html', h, 'utf8');
console.log('index.html: videos de portada montados');
