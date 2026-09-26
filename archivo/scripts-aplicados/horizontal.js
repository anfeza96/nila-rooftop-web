const fs = require('fs');
const F = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/index.html';
let h = fs.readFileSync(F, 'utf8');
const antes = h.length;

function quita(desde, hasta, etiqueta){
  const i = h.indexOf(desde);
  if (i === -1) throw new Error('No encontré inicio de: ' + etiqueta);
  const j = h.indexOf(hasta, i);
  if (j === -1) throw new Error('No encontré fin de: ' + etiqueta);
  h = h.slice(0, i) + h.slice(j + hasta.length);
}
function cambia(a, b, etiqueta){
  if (!h.includes(a)) throw new Error('No encontré: ' + etiqueta);
  h = h.replace(a, b);
}

/* ── 1. Fuera el botón hamburguesa y su panel ── */
quita('    <button class="menu-btn" id="menu-btn"', '</button>\n', 'botón de menú');
quita('  <div class="menu-panel" id="menu-panel" hidden>', '  </div>\n', 'panel de menú');
quita('/* ── Menú para pantallas pequeñas ── */', '@media (min-width:901px){ .menu-panel{ display:none !important; } }\n', 'CSS del menú');
quita("/* ── Menú de pantallas pequeñas ── */\n(function menu(){", "})();\n", 'JS del menú');

/* ── 2. Todas las secciones en la barra, en horizontal ── */
cambia(`    <div class="nav-links">
      <a href="#lugar">El lugar</a>
      <a href="#carta">Carta</a>
      <a href="eventos.html">Eventos</a>
      <a href="#galeria">Galería</a>
      <a href="#visita">Visítanos</a>
      <a href="#contacto">Contacto</a>
    </div>`,
`    <div class="nav-links">
      <a href="#lugar">El lugar</a>
      <a href="#carta">Carta</a>
      <a href="#noches">Noches</a>
      <a href="eventos.html">Eventos</a>
      <a href="#galeria">Galería</a>
      <a href="#reserva">Reservas</a>
      <a href="#visita">Horarios</a>
      <a href="#contacto">Contacto</a>
    </div>`, 'enlaces de la barra');

/* ── 3. La barra nunca se colapsa: en pantalla estrecha los enlaces
       pasan a una segunda fila que se desliza en horizontal ── */
cambia(`.nav-links{ display:flex; gap:28px; margin-left:auto; }`,
`.nav-links{ display:flex; gap:clamp(15px,1.7vw,26px); margin-left:auto; }`, 'gap de enlaces');

cambia(`@media (max-width:900px){ .nav-links{ display:none; } }`,
`/* En estrecho la barra se parte en dos filas y los enlaces se
   deslizan en horizontal: nunca se esconden detrás de un botón.
   El degradado del borde derecho avisa de que hay más. */
@media (max-width:900px){
  .nav-in{ height:auto; flex-wrap:wrap; padding-block:11px; gap:8px 14px; }
  .nav-logo{ order:1; }
  .nav-cta{ order:2; margin-left:auto; padding:9px 18px; }
  .nav-links{
    order:3; width:100%; margin-left:0; gap:19px;
    overflow-x:auto; scrollbar-width:none; padding-bottom:1px;
    -webkit-mask-image:linear-gradient(90deg,#000 86%,transparent);
            mask-image:linear-gradient(90deg,#000 86%,transparent);
  }
  .nav-links::-webkit-scrollbar{ display:none; }
  .nav-links a{ white-space:nowrap; flex:none; font-size:11px; padding:3px 0; }
  /* la barra es más alta al partirse en dos: los anclajes lo compensan */
  #inicio,#lugar,#carta,#noches,#galeria,#reserva,#visita,#contacto{ scroll-margin-top:112px; }
}`, 'media query de la barra');

fs.writeFileSync(F, h, 'utf8');
console.log('barra horizontal restaurada. Bytes: ' + antes + ' -> ' + h.length);
