const fs = require('fs');
const F = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/index.html';
let h = fs.readFileSync(F, 'utf8');

const PANEL = `  <div class="menu-panel" id="menu-panel" hidden>
    <a href="#lugar">El lugar <span>La terraza</span></a>
    <a href="#carta">La carta <span>Cocina</span></a>
    <a href="#noches">Noches <span>NILA PROD</span></a>
    <a href="eventos.html">Eventos <span>Agenda</span></a>
    <a href="#galeria">Galería <span>Fotos</span></a>
    <a href="#visita">Horarios <span>Y cómo llegar</span></a>
    <a href="#contacto">Contacto <span>Escríbenos</span></a>
    <a class="btn btn-terra" href="#reserva">Reservar mesa</a>
  </div>
`;

// 1. Quitarlo de dentro del <nav>
if (!h.includes(PANEL + '</nav>')) throw new Error('No encontré el panel dentro del nav');
h = h.replace(PANEL + '</nav>', '</nav>\n\n' + PANEL);

// 2. El panel ya no vive bajo la barra: se posiciona respecto a la ventana
const CSS_VIEJO = `.menu-panel{
  position:fixed; inset:calc(70px + env(safe-area-inset-top,0px)) 0 0 0; z-index:65;`;
const CSS_NUEVO = `/* Va fuera de <nav> a propósito: la barra lleva backdrop-filter, y esa
   propiedad hace que los hijos position:fixed se midan respecto a ella
   en lugar de respecto a la ventana. Dentro quedaba aplastado a 70px. */
.menu-panel{
  position:fixed; top:calc(70px + env(safe-area-inset-top,0px)); left:0; right:0; bottom:0; z-index:65;`;

if (!h.includes(CSS_VIEJO)) throw new Error('No encontré el CSS del panel');
h = h.replace(CSS_VIEJO, CSS_NUEVO);

fs.writeFileSync(F, h, 'utf8');
console.log('panel movido fuera del nav: OK');
