/* Carrusel de "Nila Signature Events" — sustituye la única foto que
 * había junto al bloque de cotización por WhatsApp. A diferencia del
 * carrusel de comida (que recorta todo a 4:5 para verse parejo), estas
 * son fotos de evento real con gente: recortarlas corta caras. Por eso
 * aquí cada foto conserva su propio ancho según su proporción real —
 * la altura es fija, el ancho se ajusta solo, nada se recorta.
 */
const fs = require('fs');
const P = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/';

function cambia(h, a, b, etq){
  if (!h.includes(a)) throw new Error('no encontré: ' + etq);
  return h.split(a).join(b);
}

let ix = fs.readFileSync(P + 'index.html', 'utf8');

/* ══════════ CSS ══════════ */
const CSS_CORP = `
/* ── Carrusel "Nila Signature Events" ──
   Fotos de evento real: si se recortan a un marco fijo, cortan caras.
   Por eso aquí la altura es fija y cada foto conserva su propio ancho
   según su proporción original — nada se recorta, solo se desliza. */
.corp-carrusel{ position:relative; }
.corp-pista{
  display:flex; gap:12px; height:clamp(230px,34vw,360px);
  overflow-x:auto; scroll-snap-type:x mandatory;
  scrollbar-width:none; -webkit-overflow-scrolling:touch; border-radius:4px;
}
.corp-pista::-webkit-scrollbar{ display:none; }
.corp-slide{
  flex:0 0 auto; height:100%; scroll-snap-align:start;
  border-radius:4px; overflow:hidden; background:var(--ground-3);
}
.corp-slide img{ display:block; height:100%; width:auto; max-width:none; }
.corp-nav{ display:flex; gap:8px; justify-content:flex-end; margin-top:12px; }
.corp-nav .promos-flecha{ width:38px; height:38px; }
.corp-nav .promos-flecha svg{ width:16px; height:16px; }
.corp-puntos{ margin-top:14px; justify-content:flex-start; }
`;
const iStyle = ix.indexOf('</style>');
if (iStyle < 0) throw new Error('sin </style> en index.html');
ix = ix.slice(0, iStyle) + CSS_CORP + ix.slice(iStyle);

/* ══════════ HTML ══════════ */
const FOTOS = [
  ['01-cheers-grupo.jpg',      'Brindis del equipo Farmasi en Nila Signature Events'],
  ['02-portada-evento.jpg',    'Evento corporativo en la terraza de NILA'],
  ['03-brindis-microfono.jpg', 'Dinámica con micrófono durante el evento'],
  ['04-conversacion.jpg',      'Invitadas conversando en el evento corporativo'],
  ['05-ambiente.jpg',          'Ambiente de la terraza durante el evento'],
  ['06-servicios.jpg',         'Eventos privados, corporativos y catering — Nila Signature Events'],
  ['07-detalle-flores.jpg',    'Detalle de decoración floral del evento'],
];

const SLIDES = FOTOS.map(([archivo, alt], i) =>
  '        <div class="corp-slide" role="group" aria-label="' + (i + 1) + ' de ' + FOTOS.length + '">\n' +
  '          <img src="img/corporativos/' + archivo + '" alt="' + alt + '" loading="' + (i === 0 ? 'eager' : 'lazy') + '">\n' +
  '        </div>'
).join('\n');

const DOTS = FOTOS.map((_, i) =>
  '<button type="button" aria-label="Ir a la foto ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + '></button>'
).join('');

const VIEJO =
  '      <div class="shot corp-foto rise" style="aspect-ratio:16/10"><img src="img/textura-promo.jpg" alt="Nila Signature Events" loading="lazy"><div class="ph-t"><span>Foto pendiente</span><b>img/corporativos.jpg</b></div></div>\n';

const NUEVO =
  '      <div class="corp-carrusel rise">\n' +
  '        <div class="corp-pista" id="corp-pista">\n' +
  SLIDES + '\n' +
  '        </div>\n' +
  '        <div class="corp-nav">\n' +
  '          <button type="button" class="promos-flecha" id="corp-prev" aria-label="Foto anterior">\n' +
  '            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 5l-7 7 7 7"/></svg>\n' +
  '          </button>\n' +
  '          <button type="button" class="promos-flecha" id="corp-next" aria-label="Foto siguiente">\n' +
  '            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5l7 7-7 7"/></svg>\n' +
  '          </button>\n' +
  '        </div>\n' +
  '        <div class="promos-puntos corp-puntos" id="corp-puntos">' + DOTS + '</div>\n' +
  '      </div>\n';

if (!ix.includes(VIEJO)) throw new Error('no encontré la foto de corporativos a reemplazar');
ix = ix.replace(VIEJO, NUEVO);

/* ══════════ JS ══════════ */
const JS_CORP = `
/* ══════ Carrusel "Nila Signature Events" ══════
   Mismo mecanismo que el de comida (deslizar + avance automático que
   se detiene al tocar), pero midiendo el ancho real de cada foto en
   vez de asumir que todas miden lo mismo — aquí nada está recortado,
   así que los anchos varían. */
(function(){
  const pista = document.getElementById('corp-pista');
  if (!pista) return;
  const slides = Array.from(pista.children);
  const puntos = Array.from(document.querySelectorAll('#corp-puntos button'));
  const btnPrev = document.getElementById('corp-prev');
  const btnNext = document.getElementById('corp-next');
  const menos = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function indiceActual(){
    const centro = pista.scrollLeft;
    let mejor = 0, dist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - centro);
      if (d < dist){ dist = d; mejor = i; }
    });
    return mejor;
  }
  function irA(i){
    i = Math.max(0, Math.min(slides.length - 1, i));
    pista.scrollTo({ left: slides[i].offsetLeft, behavior:'smooth' });
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

  if (menos) return;

  let reloj = null, activo = true;
  function avanza(){
    const i = indiceActual();
    irA(i >= slides.length - 1 ? 0 : i + 1);
  }
  function arranca(){ detén(); reloj = setInterval(avanza, 4500); }
  function detén(){ if (reloj) clearInterval(reloj); reloj = null; }

  ['pointerdown','touchstart','mouseenter','focusin'].forEach(ev =>
    pista.addEventListener(ev, detén, { passive:true }));
  pista.addEventListener('mouseleave', () => { if (activo) arranca(); });

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

ix = cambia(ix, '\npreparaRise();', JS_CORP + '\npreparaRise();', 'final del script (carrusel corp)');

fs.writeFileSync(P + 'index.html', ix, 'utf8');
console.log('index.html: carrusel de Nila Signature Events añadido');
