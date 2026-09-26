const fs = require('fs');
const F = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/index.html';
let h = fs.readFileSync(F, 'utf8');

function pon(busca, nuevo, etiqueta){
  const i = h.indexOf(busca);
  if (i === -1) throw new Error('No encontré: ' + etiqueta);
  h = h.slice(0, i) + nuevo + h.slice(i + busca.length);
}

/* ─────────── 1. CSS ─────────── */
const CSS_NUEVO = `
/* Los anclajes deben quedar por debajo de la barra fija, si no el
   título de la sección se esconde detrás de ella al saltar. */
#inicio,#lugar,#carta,#noches,#galeria,#reserva,#visita,#contacto{ scroll-margin-top:86px; }

/* ── Índice de secciones del hero ── */
.indice{
  margin-top:clamp(28px,3.6vw,42px); max-width:860px;
  display:grid; grid-template-columns:repeat(auto-fit,minmax(112px,1fr)); gap:0 clamp(10px,1.8vw,24px);
}
.indice a{
  position:relative; display:block; padding:13px 0 12px; text-decoration:none;
  font-family:var(--f-brand); font-size:11px; letter-spacing:.17em; text-transform:uppercase;
  color:var(--muted); border-top:1px solid var(--line); transition:color .25s;
}
.indice a::after{
  content:""; position:absolute; left:0; right:100%; top:-1px; height:1px;
  background:var(--gold); transition:right .4s cubic-bezier(.2,.8,.2,1);
}
.indice a:hover, .indice a:focus-visible{ color:var(--cream); }
.indice a:hover::after, .indice a:focus-visible::after{ right:0; }

/* ── Menú para pantallas pequeñas ── */
.menu-btn{
  display:none; margin-left:auto; align-items:center; gap:9px; cursor:pointer;
  background:transparent; border:1px solid var(--line); border-radius:999px; padding:9px 16px;
  font-family:var(--f-brand); font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:var(--text);
}
.menu-btn svg{ width:14px; height:14px; }
.menu-btn .cerrar{ display:none; }
.menu-btn[aria-expanded="true"] .abrir{ display:none; }
.menu-btn[aria-expanded="true"] .cerrar{ display:block; }
.menu-panel{
  position:fixed; inset:calc(70px + env(safe-area-inset-top,0px)) 0 0 0; z-index:65;
  background:rgba(12,8,5,.97); backdrop-filter:blur(18px);
  padding:22px var(--gutter) calc(30px + env(safe-area-inset-bottom,0px));
  overflow-y:auto; display:flex; flex-direction:column; gap:2px;
}
.menu-panel a{
  display:flex; align-items:center; justify-content:space-between; gap:14px;
  padding:17px 2px; text-decoration:none; color:var(--text);
  font-family:var(--f-brand); font-weight:300; font-size:20px; letter-spacing:.04em;
  border-bottom:1px solid var(--line-soft);
}
.menu-panel a span{ font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--faint); }
.menu-panel a:active{ color:var(--gold); }
.menu-panel .btn{ margin-top:22px; justify-content:center; }
@media (max-width:900px){ .menu-btn{ display:inline-flex; } .nav-cta{ display:none; } }
@media (min-width:901px){ .menu-panel{ display:none !important; } }

/* ── Entrada del hero al cargar ──
   Es una animación que corre sola al abrir la página: nunca se queda
   esperando a nada, así que el contenido no puede quedar invisible. */
@media (prefers-reduced-motion: no-preference){
  .hero-in > *{ animation:entra .95s cubic-bezier(.16,.84,.26,1) both; }
  .hero-in > *:nth-child(1){ animation-delay:.08s; }
  .hero-in > *:nth-child(2){ animation-delay:.20s; }
  .hero-in > *:nth-child(3){ animation-delay:.34s; }
  .hero-in > *:nth-child(4){ animation-delay:.46s; }
  .hero-in > *:nth-child(5){ animation-delay:.58s; }
}
@keyframes entra{ from{ opacity:0; transform:translateY(22px); } to{ opacity:1; transform:none; } }
`;

/* Motor de aparición nuevo: sustituye el bloque .rise antiguo */
const RISE_VIEJO = `.rise{ opacity:1; transform:none; }
@media (prefers-reduced-motion: no-preference){
  .js .rise{ opacity:0; transform:translateY(16px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.7,.3,1); }
  .js .rise.in{ opacity:1; transform:none; }
}`;

const RISE_NUEVO = `.rise{ opacity:1; transform:none; }
@media (prefers-reduced-motion: no-preference){
  .js .rise{
    opacity:0; transform:translateY(26px);
    transition:opacity .85s cubic-bezier(.16,.84,.26,1) var(--d,0ms),
               transform .85s cubic-bezier(.16,.84,.26,1) var(--d,0ms);
  }
  /* Los títulos entran con un poco más de recorrido */
  .js .rise.titulo{ transform:translateY(34px); }
  .js .rise.in{ opacity:1; transform:none; }
}` + CSS_NUEVO;

pon(RISE_VIEJO, RISE_NUEVO, 'bloque .rise');

/* ─────────── 2. Botón de menú en la barra ─────────── */
pon(
`    <a class="nav-cta" href="#reserva">Reservar</a>
  </div>
</nav>`,
`    <a class="nav-cta" href="#reserva">Reservar</a>
    <button class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="menu-panel">
      <svg class="abrir" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      <svg class="cerrar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
      Menú
    </button>
  </div>
  <div class="menu-panel" id="menu-panel" hidden>
    <a href="#lugar">El lugar <span>La terraza</span></a>
    <a href="#carta">La carta <span>Cocina</span></a>
    <a href="#noches">Noches <span>NILA PROD</span></a>
    <a href="eventos.html">Eventos <span>Agenda</span></a>
    <a href="#galeria">Galería <span>Fotos</span></a>
    <a href="#visita">Horarios <span>Y cómo llegar</span></a>
    <a href="#contacto">Contacto <span>Escríbenos</span></a>
    <a class="btn btn-terra" href="#reserva">Reservar mesa</a>
  </div>
</nav>`, 'botón de menú');

/* ─────────── 3. Índice en el hero ─────────── */
pon(
`      <a class="btn btn-line" href="https://www.instagram.com/nila.rooftop/" target="_blank" rel="noopener">@nila.rooftop</a>
    </div>`,
`      <a class="btn btn-line" href="https://www.instagram.com/nila.rooftop/" target="_blank" rel="noopener">@nila.rooftop</a>
    </div>

    <nav class="indice" aria-label="Secciones de la página">
      <a href="#lugar">El lugar</a>
      <a href="#carta">La carta</a>
      <a href="#noches">Noches</a>
      <a href="eventos.html">Eventos</a>
      <a href="#galeria">Galería</a>
      <a href="#reserva">Reservas</a>
      <a href="#visita">Horarios</a>
      <a href="#contacto">Contacto</a>
    </nav>`, 'índice del hero');

fs.writeFileSync(F, h, 'utf8');
console.log('CSS, menú e índice: OK');
