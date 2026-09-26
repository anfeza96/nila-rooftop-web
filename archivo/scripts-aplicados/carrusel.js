/* Carrusel de "Promos de la semana" en la portada, entre La carta y
 * Corporativos. Sustituye a la foto genérica "elige tu promo, desliza"
 * que había en la Galería — esa foto no representaba nada real, así
 * que sale de ahí y en su lugar entran 8 fotos reales de platos y
 * tragos, en un carrusel de verdad.
 */
const fs = require('fs');
const P = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/';

function cambia(h, a, b, etq){
  if (!h.includes(a)) throw new Error('no encontré: ' + etq);
  return h.split(a).join(b);
}

/* ══════════ 1. INDEX.HTML: el carrusel ══════════ */
let ix = fs.readFileSync(P + 'index.html', 'utf8');

const CSS_CARRUSEL = `
/* ── Carrusel "Promos de la semana" ──
   Base: una franja de scroll nativo con scroll-snap — funciona sin
   una sola línea de JS, con el dedo, en cualquier navegador. JS solo
   añade encima: avance automático, flechas y puntos. Si JS falla,
   la persona igual puede deslizar con el dedo o el ratón. */
.promos{ padding-block:clamp(50px,7vw,80px) clamp(60px,8vw,92px); }
.promos-head{ display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:20px 40px; }
.promos-nav{ display:flex; gap:10px; flex:none; }
.promos-flecha{
  width:44px; height:44px; border-radius:50%; border:1px solid var(--line);
  background:rgba(244,233,218,.04); color:var(--text); cursor:pointer;
  display:flex; align-items:center; justify-content:center; transition:background .2s, border-color .2s, opacity .2s;
}
.promos-flecha:hover{ background:var(--gold); border-color:var(--gold); color:#1B1408; }
.promos-flecha:disabled{ opacity:.32; cursor:default; }
.promos-flecha:disabled:hover{ background:rgba(244,233,218,.04); border-color:var(--line); color:var(--text); }
.promos-flecha svg{ width:18px; height:18px; }

.promos-pista{
  display:flex; gap:clamp(14px,1.8vw,22px); margin-top:clamp(26px,3.4vw,40px);
  overflow-x:auto; scroll-snap-type:x mandatory; scroll-padding-left:var(--gutter);
  padding-inline:var(--gutter); margin-inline:calc(var(--gutter) * -1);
  scrollbar-width:none; -webkit-overflow-scrolling:touch;
}
.promos-pista::-webkit-scrollbar{ display:none; }
.promo-slide{
  flex:0 0 auto; width:clamp(220px,30vw,340px); scroll-snap-align:start;
  position:relative; overflow:hidden; border-radius:4px; background:var(--ground-3);
  aspect-ratio:4/5;
}
.promo-slide img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.promo-slide .etq{
  position:absolute; left:0; right:0; bottom:0; padding:26px 16px 14px;
  background:linear-gradient(0deg, rgba(12,8,5,.86) 0%, transparent 100%);
  font-family:var(--f-brand); font-size:12.5px; letter-spacing:.04em; color:var(--cream);
}
.promos-puntos{ display:flex; gap:7px; justify-content:center; margin-top:22px; }
.promos-puntos button{
  width:7px; height:7px; padding:0; border-radius:50%; border:none; background:var(--line);
  cursor:pointer; transition:background .25s, width .25s;
}
.promos-puntos button[aria-current]{ background:var(--gold); width:20px; border-radius:4px; }
@media (max-width:700px){ .promos-nav{ display:none; } }
`;
const iStyle = ix.indexOf('</style>');
if (iStyle < 0) throw new Error('sin </style> en index.html');
ix = ix.slice(0, iStyle) + CSS_CARRUSEL + ix.slice(iStyle);

const FOTOS = [
  ['01-tomahawk.jpg',         'Tomahawk a la parrilla'],
  ['02-burger-date.jpg',      'Burger date'],
  ['03-coconut-sea.jpg',      'Coconut meets the sea'],
  ['04-mixology.jpg',         'The art of mixology'],
  ['05-burger-nila.jpg',      'Nila Burger'],
  ['06-spaghetti-yolanda.jpg','Spaghetti Yolanda'],
  ['07-langostino.jpg',       'Langostino a la parrilla'],
  ['08-pasta-italiana.jpg',   'The Italian side of Nila'],
];

const SLIDES = FOTOS.map(([archivo, etq], i) =>
  '      <div class="promo-slide" role="group" aria-label="' + (i + 1) + ' de ' + FOTOS.length + '">\n' +
  '        <img src="img/promos/' + archivo + '" alt="' + etq + ' — NILA ROOFTOP" loading="' + (i < 2 ? 'eager' : 'lazy') + '">\n' +
  '        <p class="etq">' + etq + '</p>\n' +
  '      </div>'
).join('\n');

const DOTS = FOTOS.map((_, i) =>
  '<button type="button" aria-label="Ir a la foto ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + '></button>'
).join('');

const HTML_CARRUSEL =
'<!-- ════════ PROMOS DE LA SEMANA ════════ -->\n' +
'<section class="section promos" id="promos">\n' +
'  <div class="wrap">\n' +
'    <div class="promos-head rise">\n' +
'      <div>\n' +
'        <p class="eyebrow">Promos de la semana</p>\n' +
'        <h2 class="h2 titulo">Se antoja, ¿verdad?</h2>\n' +
'      </div>\n' +
'      <div class="promos-nav">\n' +
'        <button type="button" class="promos-flecha" id="promos-prev" aria-label="Foto anterior">\n' +
'          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 5l-7 7 7 7"/></svg>\n' +
'        </button>\n' +
'        <button type="button" class="promos-flecha" id="promos-next" aria-label="Foto siguiente">\n' +
'          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5l7 7-7 7"/></svg>\n' +
'        </button>\n' +
'      </div>\n' +
'    </div>\n' +
'\n' +
'    <div class="promos-pista rise" id="promos-pista">\n' +
SLIDES + '\n' +
'    </div>\n' +
'\n' +
'    <div class="promos-puntos" id="promos-puntos">' + DOTS + '</div>\n' +
'  </div>\n' +
'</section>\n' +
'\n';

const ANCLA = '<!-- ════════ EVENTOS CORPORATIVOS ════════ -->';
if (!ix.includes(ANCLA)) throw new Error('no encontré el ancla de corporativos');
ix = ix.replace(ANCLA, HTML_CARRUSEL + ANCLA);

/* ══════════ 2. JS: avance automático + flechas + puntos ══════════ */
const JS_CARRUSEL = `
/* ══════ Carrusel "Promos de la semana" ══════
   La base (deslizar con el dedo) ya funciona solo con el scroll-snap
   del CSS. Esto solo añade: avance automático cada 4.5s, que se
   detiene en cuanto alguien toca o pasa el ratón por encima, los
   puntos de abajo y las flechas de arriba. Si "menos movimiento" está
   activo, no avanza solo — pero sigue siendo un carrusel deslizable. */
(function(){
  const pista = document.getElementById('promos-pista');
  if (!pista) return;
  const slides = Array.from(pista.children);
  const puntos = Array.from(document.querySelectorAll('#promos-puntos button'));
  const btnPrev = document.getElementById('promos-prev');
  const btnNext = document.getElementById('promos-next');
  const menos = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function indiceActual(){
    const centro = pista.scrollLeft + pista.clientWidth / 2;
    let mejor = 0, dist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs((s.offsetLeft + s.offsetWidth / 2) - centro);
      if (d < dist){ dist = d; mejor = i; }
    });
    return mejor;
  }
  function irA(i){
    i = Math.max(0, Math.min(slides.length - 1, i));
    pista.scrollTo({ left: slides[i].offsetLeft - (pista.clientWidth - slides[i].clientWidth) / 2, behavior:'smooth' });
  }
  function marcaPunto(){
    const i = indiceActual();
    puntos.forEach((p, j) => { if (j === i) p.setAttribute('aria-current','true'); else p.removeAttribute('aria-current'); });
    if (btnPrev) btnPrev.disabled = i === 0;
    if (btnNext) btnNext.disabled = i === slides.length - 1;
  }

  puntos.forEach((p, i) => p.addEventListener('click', () => irA(i)));
  if (btnPrev) btnPrev.addEventListener('click', () => irA(indiceActual() - 1));
  if (btnNext) btnNext.addEventListener('click', () => irA(indiceActual() + 1));

  let marcando = false;
  pista.addEventListener('scroll', () => {
    if (marcando) return; marcando = true;
    requestAnimationFrame(() => { marcaPunto(); marcando = false; });
  }, { passive:true });
  marcaPunto();

  if (menos) return; // sin avance automático si piden menos movimiento

  let reloj = null, activo = true;
  function avanza(){
    const i = indiceActual();
    irA(i >= slides.length - 1 ? 0 : i + 1);
  }
  function arranca(){ detén(); reloj = setInterval(avanza, 4500); }
  function detén(){ if (reloj) clearInterval(reloj); reloj = null; }

  ['pointerdown','touchstart','mouseenter','focusin'].forEach(ev =>
    pista.addEventListener(ev, detén, { passive:true }));
  ['mouseleave'].forEach(ev => pista.addEventListener(ev, () => { if (activo) arranca(); }));

  // se detiene también si la sección sale de pantalla, para no gastar batería de más
  function revisaVisible(){
    const r = pista.getBoundingClientRect();
    const visible = r.bottom > 0 && r.top < window.innerHeight;
    if (visible === activo) return;
    activo = visible;
    if (visible) arranca(); else detén();
  }
  window.addEventListener('scroll', revisaVisible, { passive:true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) detén(); else if (activo) arranca(); });

  revisaVisible();
  if (activo) arranca();
})();
`;

ix = cambia(ix, '\npreparaRise();', JS_CARRUSEL + '\npreparaRise();', 'final del script (carrusel)');

fs.writeFileSync(P + 'index.html', ix, 'utf8');
console.log('index.html: carrusel de promos añadido');

/* ══════════ 3. GALERIA.HTML: fuera la foto que no representaba nada ══════════ */
let gal = fs.readFileSync(P + 'galeria.html', 'utf8');
const BLOQUE_PROMOS =
  '      <figure class="marco" tabindex="0" data-src="img/galeria/promos.jpg" data-txt="Promos de la semana">\n' +
  '        <img src="img/galeria/promos.jpg" alt="Promos de la semana — NILA ROOFTOP" loading="lazy">\n' +
  '      </figure>\n' +
  '\n';
if (!gal.includes(BLOQUE_PROMOS)) throw new Error('no encontré el bloque de promos en galeria.html');
gal = gal.replace(BLOQUE_PROMOS, '');
fs.writeFileSync(P + 'galeria.html', gal, 'utf8');
console.log('galeria.html: foto "elige tu promo" retirada de la cuadrícula');
