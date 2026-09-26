/* Destaca Eventos y Galería en la barra de las tres páginas, y añade
   dos accesos grandes al final de la portada. */
const fs = require('fs');
const P = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/';

const CSS_PILDORA = `
/* ── Eventos y Galería: son páginas aparte, y deben verse ──
   Van en pastilla dorada, el mismo recurso que NILA usa como marcador
   en sus flyers. Entre etiquetas de texto plano, la pastilla dice
   "esto te lleva a otro sitio" sin necesidad de explicarlo. */
.nav-links a.aparte{
  color:var(--gold); border:1px solid rgba(232,194,75,.45); border-radius:999px;
  padding:6px 15px; margin:-6px 0; background:rgba(232,194,75,.08);
  transition:background .25s, border-color .25s, color .25s;
}
.nav-links a.aparte::after{ display:none; }   /* la pastilla sustituye al subrayado */
.nav-links a.aparte:hover, .nav-links a.aparte:focus-visible{
  background:var(--gold); border-color:var(--gold); color:#1B1408;
}
.nav-links a.aparte[aria-current]{ background:var(--gold); border-color:var(--gold); color:#1B1408; }
@media (max-width:900px){ .nav-links a.aparte{ padding:5px 13px; margin:0; } }
`;

/* ── 1. Pastilla en las tres páginas ── */
for (const archivo of ['index.html', 'eventos.html', 'galeria.html']){
  let h = fs.readFileSync(P + archivo, 'utf8');

  h = h.replace('<a href="eventos.html">Eventos</a>', '<a class="aparte" href="eventos.html">Eventos</a>');
  h = h.replace('<a href="eventos.html" aria-current="page">Eventos</a>',
                '<a class="aparte" href="eventos.html" aria-current="page">Eventos</a>');
  h = h.replace('<a href="galeria.html">Galería</a>', '<a class="aparte" href="galeria.html">Galería</a>');
  h = h.replace('<a href="galeria.html" aria-current="page">Galería</a>',
                '<a class="aparte" href="galeria.html" aria-current="page">Galería</a>');

  // el CSS va justo antes del cierre del <style>
  const i = h.indexOf('</style>');
  if (i < 0) throw new Error('sin </style> en ' + archivo);
  h = h.slice(0, i) + CSS_PILDORA + h.slice(i);

  fs.writeFileSync(P + archivo, h, 'utf8');
  console.log(archivo + ': pastillas puestas');
}

/* ── 2. Dos accesos grandes al final de la portada ── */
let h = fs.readFileSync(P + 'index.html', 'utf8');

const CSS_PUERTAS = `
/* ── Accesos a las otras dos páginas, al cierre ── */
.puertas{ display:grid; grid-template-columns:1fr 1fr; gap:clamp(14px,2vw,22px); margin-top:8px; }
@media (max-width:760px){ .puertas{ grid-template-columns:1fr; } }
.puerta{
  position:relative; overflow:hidden; border-radius:4px; text-decoration:none;
  min-height:clamp(210px,26vw,280px); display:flex; align-items:flex-end;
  border:1px solid var(--line-soft); isolation:isolate;
}
.puerta img{
  position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:-2;
  transition:scale .8s cubic-bezier(.2,.7,.3,1), filter .8s ease;
}
.puerta::after{
  content:""; position:absolute; inset:0; z-index:-1;
  background:linear-gradient(170deg, rgba(21,15,11,.35) 0%, rgba(21,15,11,.72) 55%, rgba(12,8,5,.92) 100%);
}
.puerta:hover img, .puerta:focus-visible img{ scale:1.07; filter:saturate(1.12) brightness(1.05); }
.puerta-in{ padding:clamp(22px,3vw,32px); width:100%; }
.puerta .k{
  font-family:var(--f-brand); font-size:10px; letter-spacing:.3em; text-transform:uppercase;
  color:var(--gold); margin:0 0 9px;
}
.puerta h3{ font-size:clamp(23px,3vw,31px); margin:0 0 8px; color:var(--cream); }
.puerta p{ margin:0 0 18px; color:rgba(244,233,218,.8); font-size:14.5px; max-width:34ch; }
.puerta .ir{
  display:inline-flex; align-items:center; gap:9px;
  font-family:var(--f-brand); font-size:11px; letter-spacing:.2em; text-transform:uppercase; font-weight:500;
  background:var(--gold); color:#1B1408; padding:11px 20px; border-radius:999px;
  transition:transform .25s cubic-bezier(.2,.8,.2,1);
}
.puerta:hover .ir, .puerta:focus-visible .ir{ transform:translateX(5px); }
`;

const i = h.indexOf('</style>');
h = h.slice(0, i) + CSS_PUERTAS + h.slice(i);

const PUERTAS = `<!-- ════════ ACCESOS A LAS OTRAS PÁGINAS ════════ -->
<section class="section" id="mas" style="padding-top:0">
  <div class="wrap">
    <p class="eyebrow rise">Sigue explorando</p>
    <h2 class="h2 rise titulo">Hay más arriba.</h2>

    <div class="puertas rise">
      <a class="puerta" href="galeria.html">
        <img src="img/plato-risotto.jpg" alt="" loading="lazy">
        <span class="puerta-in">
          <span class="k">Galería</span>
          <h3>Visita nuestra galería</h3>
          <p>Los platos, la terraza y las noches, en fotos que puedes abrir a pantalla completa.</p>
          <span class="ir">Ver la galería &rarr;</span>
        </span>
      </a>

      <a class="puerta" href="eventos.html">
        <img src="img/evento-tommax.jpg" alt="" loading="lazy">
        <span class="puerta-in">
          <span class="k">Agenda</span>
          <h3>Visita nuestros eventos</h3>
          <p>Lo que viene en la terraza, con fecha, cuenta atrás y reserva en un clic.</p>
          <span class="ir">Ver los eventos &rarr;</span>
        </span>
      </a>
    </div>
  </div>
</section>

`;

const ancla = '<footer class="foot">';
if (!h.includes(ancla)) throw new Error('no encontré el pie');
h = h.replace(ancla, PUERTAS + ancla);

fs.writeFileSync(P + 'index.html', h, 'utf8');
console.log('index.html: accesos añadidos al cierre');
