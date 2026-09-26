/* Genera galeria.html reutilizando la cabecera, estilos, fondo, barra y
   pie de eventos.html, para que las tres páginas sean idénticas en marca. */
const fs = require('fs');
const P = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/';
const ev = fs.readFileSync(P + 'eventos.html', 'utf8');

function trozo(a, b){
  const i = ev.indexOf(a); const j = ev.indexOf(b, i);
  if (i < 0 || j < 0) throw new Error('no encontré ' + a.slice(0, 34));
  return ev.slice(i, j + b.length);
}

let cabecera = ev.slice(0, ev.indexOf('</style>'));
// La cabecera viene de eventos.html: hay que ponerle su propia identidad
cabecera = cabecera
  .replace("<title>Eventos — NILA ROOFTOP</title>", "<title>Galería — NILA ROOFTOP</title>")
  .replace(/<meta name="description"[^>]*>/,
    '<meta name="description" content="Galería de NILA ROOFTOP: la terraza, los platos y las noches. Cuenca, Ecuador.">');
const bg    = trozo('<div id="bg"', '</div>');
const nav   = trozo('<nav class="nav" id="nav">', '</nav>');
const pie   = trozo('<footer class="foot">', '</footer>');
const fondo = trozo('(function fondoVivo(){', '  medir();\n})();');

const CSS_GAL = `
/* ── Rejilla de la galería ── */
.gal{ display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr)); gap:12px; margin-top:40px; }
.gal .marco{ aspect-ratio:1; cursor:zoom-in; }
.gal .marco:nth-child(1){ grid-column:span 2; aspect-ratio:2/1; }
@media (max-width:620px){
  .gal{ grid-template-columns:1fr 1fr; }
  .gal .marco:nth-child(n){ grid-column:span 1; aspect-ratio:1; }
  .gal .marco:nth-child(1){ grid-column:span 2; aspect-ratio:3/2; }
}

.marco{ position:relative; overflow:hidden; border-radius:3px; background:var(--ground-3); }
.marco img{ position:absolute; left:0; top:-9%; width:100%; height:118%; object-fit:cover; will-change:transform;
  transform:translate3d(0, var(--py,0px), 0); transition:scale .7s cubic-bezier(.2,.7,.3,1), filter .7s ease; }
.marco::after{ content:""; position:absolute; inset:0; box-shadow:inset 0 0 0 1px var(--line-soft); pointer-events:none; z-index:3; }
.marco::before{ content:""; position:absolute; inset:0; z-index:2; pointer-events:none;
  background:linear-gradient(104deg, transparent 36%, rgba(244,233,218,.26) 47%, rgba(232,194,75,.16) 52%, transparent 62%);
  transform:translateX(-130%); transition:transform 1s cubic-bezier(.3,.7,.3,1); }
.marco:hover::before{ transform:translateX(130%); }
.marco:hover img{ scale:1.07; filter:saturate(1.12) brightness(1.04); }
@media (prefers-reduced-motion: no-preference){
  .js .marco{ clip-path:inset(0 0 100% 0); transition:clip-path 1.05s cubic-bezier(.16,.84,.26,1); }
  .js .marco.visto{ clip-path:inset(0 0 0 0); }
  .js .marco img{ scale:1.12; transition:scale 1.4s cubic-bezier(.16,.84,.26,1), filter .7s ease; }
  .js .marco.visto img{ scale:1; }
}
.marco .pie-foto{ position:absolute; left:0; right:0; bottom:0; z-index:4; padding:28px 16px 13px; margin:0;
  background:linear-gradient(180deg,transparent,rgba(12,8,5,.85)); opacity:0; transition:opacity .4s ease;
  font-family:var(--f-brand); font-size:11.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--cream); }
.marco:hover .pie-foto, .marco:focus-visible .pie-foto{ opacity:1; }
.marco.sin-foto{ background:linear-gradient(152deg,#C98B52,#A0492E 52%,#5A2718); }
.marco.sin-foto img{ display:none; }

/* Tarjeta final: lleva a Instagram */
.tile-ig{ display:flex; align-items:center; justify-content:center; text-decoration:none; cursor:pointer;
  background:linear-gradient(152deg,#C98B52,#A0492E 52%,#5A2718); }
.tile-ig .dentro{ display:flex; flex-direction:column; align-items:center; gap:9px; text-align:center; padding:24px; position:relative; z-index:3; }
.tile-ig svg{ width:26px; height:26px; color:var(--cream); }
.tile-ig b{ font-family:var(--f-brand); font-weight:300; font-size:17px; letter-spacing:.12em; color:var(--cream); }
.tile-ig em{ font-style:normal; font-size:12.5px; line-height:1.5; color:rgba(244,233,218,.82); max-width:26ch; }
.tile-ig u{ text-decoration:none; margin-top:6px; font-family:var(--f-brand); font-size:10px; letter-spacing:.24em;
  text-transform:uppercase; color:#1B1408; background:var(--gold); padding:6px 14px; }

/* Visor a pantalla completa */
.visor{ position:fixed; inset:0; z-index:200; background:rgba(12,8,5,.96); display:flex; align-items:center; justify-content:center; padding:24px; }
.visor img{ max-width:min(1100px,94vw); max-height:84vh; width:auto; border-radius:2px; }
.visor .cerrar{ position:absolute; top:calc(16px + env(safe-area-inset-top,0px)); right:16px; width:44px; height:44px;
  border-radius:999px; background:transparent; border:1px solid var(--line); color:var(--text); font-size:21px; cursor:pointer; }
.visor .mover{ position:absolute; top:50%; transform:translateY(-50%); width:48px; height:48px; border-radius:999px;
  background:rgba(21,15,11,.6); border:1px solid var(--line); color:var(--text); font-size:20px; cursor:pointer; }
.visor .previo{ left:14px; }
.visor .siguiente{ right:14px; }
.visor .rotulo{ position:absolute; left:0; right:0; bottom:calc(20px + env(safe-area-inset-bottom,0px)); text-align:center; margin:0;
  font-family:var(--f-brand); font-size:11.5px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); }
`;

const FOTOS = [
  { src: 'img/galeria/risotto.jpg',     txt: 'Risotto anticuchero' },
  { src: 'img/galeria/promos.jpg',      txt: 'Promos de la semana' },
  { src: 'img/galeria/ensalada.jpg',    txt: 'Ensalada de pollo' },
  { src: 'img/galeria/tommax.jpg',      txt: 'Noche TOMMAX' },
  { src: 'img/galeria/aniversario.jpg', txt: 'The Anniversary' }
];

/* Doce huecos libres: basta con dejar 01.jpg ... 12.jpg en img/galeria/
   y aparecen solos. Los que no existan se borran al cargar, sin dejar
   hueco ni aviso. */
for (let i = 1; i <= 12; i++){
  const n = String(i).padStart(2, '0');
  FOTOS.push({ src: 'img/galeria/' + n + '.jpg', txt: 'NILA ROOFTOP', opcional: true });
}

const celdas = FOTOS.map(f =>
'      <figure class="marco" tabindex="0"' + (f.opcional ? ' data-opcional="1"' : '') + ' data-src="' + f.src + '" data-txt="' + f.txt + '">\n' +
'        <img src="' + f.src + '" alt="' + f.txt + ' — NILA ROOFTOP" loading="lazy">\n' +
'        <figcaption class="pie-foto">' + f.txt + '</figcaption>\n' +
'      </figure>').join('\n');

const navGal = nav
  .replace('<a href="eventos.html" aria-current="page">Eventos</a>', '<a href="eventos.html">Eventos</a>')
  .replace('<a href="galeria.html">Galería</a>', '<a href="galeria.html" aria-current="page">Galería</a>');

const D = '$';   // para no pelearme con las plantillas al escribir el script

const cuerpo = [
'</style>',
'</head>',
'<body>',
'',
bg,
'',
navGal,
'',
'<header class="cab">',
'  <div class="wrap">',
'    <p class="eyebrow">Galería</p>',
'    <h1>Así se vive NILA</h1>',
'    <p class="sub">La terraza, por dentro</p>',
'  </div>',
'</header>',
'',
'<section class="section" style="padding-top:clamp(20px,2.6vw,32px)">',
'  <div class="wrap">',
'    <p class="lede">Platos, noches y la vista que hace que valga subir. Pulsa cualquier foto para verla a tamaño completo.</p>',
'    <div class="gal" id="gal">',
celdas,
'      <a class="marco tile-ig" href="https://www.instagram.com/nila.rooftop/" target="_blank" rel="noopener">',
'        <span class="dentro">',
'          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
'          <b>@nila.rooftop</b>',
'          <em>33 mil personas ya nos siguen. Las fotos nuevas salen ahí primero.</em>',
'          <u>Ver el perfil</u>',
'        </span>',
'      </a>',
'    </div>',
'  </div>',
'</section>',
'',
pie,
'',
'<script>',
"document.documentElement.classList.add('js');",
'',
'/* Seguro de vida: si algo fallara antes de montar las animaciones, se',
'   muestra todo sin efecto en vez de dejar la página en blanco. */',
'window.__galListo = false;',
"setTimeout(function(){ if(!window.__galListo) document.documentElement.classList.remove('js'); }, 4000);",
'',
'const ' + D + '  = (s,c=document) => c.querySelector(s);',
'const ' + D + D + ' = (s,c=document) => [...c.querySelectorAll(s)];',
D + "('#anio').textContent = new Date().getFullYear();",
'',
fondo,
'',
"addEventListener('scroll', () => { " + D + "('#nav').classList.toggle('stuck', scrollY > 40); pedirMover(); }, { passive:true });",
"addEventListener('resize', () => pedirMover(), { passive:true });",
'',
'/* ── Revelado y parallax de cada foto ── */',
'const marcos = ' + D + D + "('.marco');",
'(function preparaFotos(){',
"  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;",
'  marcos.forEach(m => {',
"    const img = m.querySelector('img');",
'    if (img){',
"      const fallo = () => {",
"        if (m.dataset.opcional){ m.remove(); return; }   // hueco libre sin usar",
"        m.classList.add('sin-foto');",
"      };",
'      if (img.complete){ if(!img.naturalWidth) fallo(); }',
"      else img.addEventListener('error', fallo, { once:true });",
'    }',
'  });',
"  if (quieto || !('IntersectionObserver' in window)){ marcos.forEach(m => m.classList.add('visto')); return; }",
'  const io = new IntersectionObserver((es,obs) => es.forEach(en => {',
"    if (en.isIntersecting){ en.target.classList.add('visto'); obs.unobserve(en.target); }",
"  }), { rootMargin:'0px 0px -8% 0px', threshold:.12 });",
'  marcos.forEach(m => io.observe(m));',
"  setTimeout(() => marcos.forEach(m => m.classList.add('visto')), 3500);",
'})();',
'',
'let pendiente = false;',
'function mover(){',
'  pendiente = false;',
'  const alto = window.innerHeight; if(!alto) return;',
'  for (const m of marcos){',
"    const img = m.querySelector('img'); if(!img) continue;",
'    const r = m.getBoundingClientRect(); if(!r.height) continue;',
'    if (r.bottom < -80 || r.top > alto + 80) continue;',
'    const avance = (r.top + r.height) / (alto + r.height);',
"    img.style.setProperty('--py', ((1 - avance*2) * r.height * 0.075).toFixed(1) + 'px');",
'  }',
'}',
'function pedirMover(){ if(!pendiente){ pendiente = true; requestAnimationFrame(mover); } }',
'mover();',
'',
'/* ── Visor a pantalla completa, con flechas y teclado ── */',
'(function visor(){',
"  const fotos = marcos.filter(m => m.tagName === 'FIGURE');",
'  if (!fotos.length) return;',
'  let abierto = null, indice = 0;',
'',
'  function pinta(){',
'    const f = fotos[indice];',
"    abierto.querySelector('img').src = f.dataset.src;",
"    abierto.querySelector('.rotulo').textContent = f.dataset.txt + '  ·  ' + (indice+1) + ' de ' + fotos.length;",
'  }',
'  function abre(i){',
'    indice = i;',
"    abierto = document.createElement('div');",
"    abierto.className = 'visor';",
'    abierto.innerHTML =',
'      \'<button class="cerrar" aria-label="Cerrar">&times;</button>\' +',
'      \'<button class="mover previo" aria-label="Anterior">&#8249;</button>\' +',
'      \'<img alt="">\' +',
'      \'<button class="mover siguiente" aria-label="Siguiente">&#8250;</button>\' +',
'      \'<p class="rotulo"></p>\';',
'    document.body.appendChild(abierto);',
"    document.body.style.overflow = 'hidden';",
'    pinta();',
"    abierto.querySelector('.cerrar').focus();",
"    abierto.addEventListener('click', e => {",
"      if (e.target.closest('.siguiente')){ indice = (indice+1) % fotos.length; pinta(); return; }",
"      if (e.target.closest('.previo')){ indice = (indice-1+fotos.length) % fotos.length; pinta(); return; }",
"      if (e.target.tagName === 'IMG') return;",
'      cierra();',
'    });',
'  }',
"  function cierra(){ if(!abierto) return; abierto.remove(); abierto = null; document.body.style.overflow = ''; }",
"  addEventListener('keydown', e => {",
'    if (!abierto) return;',
"    if (e.key === 'Escape') cierra();",
"    if (e.key === 'ArrowRight'){ indice = (indice+1) % fotos.length; pinta(); }",
"    if (e.key === 'ArrowLeft'){ indice = (indice-1+fotos.length) % fotos.length; pinta(); }",
'  });',
'  fotos.forEach((f,i) => {',
"    f.addEventListener('click', () => abre(i));",
"    f.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); abre(i); } });",
'  });',
'})();',
'',
'window.__galListo = true;',
'</scr' + 'ipt>',
'</body>',
'</html>',
''
].join('\n');

fs.writeFileSync(P + 'galeria.html', cabecera + CSS_GAL + cuerpo, 'utf8');
console.log('galeria.html creada: ' + Math.round((cabecera + CSS_GAL + cuerpo).length / 1024) + ' KB');
