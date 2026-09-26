/* Eventos y Galería conservaban la regla que escondía el menú en
   pantallas estrechas — resto de cuando la barra tenía botón de
   hamburguesa. Se sustituye por el mismo comportamiento de la portada:
   la barra se parte en dos filas y los enlaces se deslizan en horizontal. */
const fs = require('fs');
const P = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/';

const VIEJO = '@media (max-width:860px){ .nav-links{ display:none; } }';
const NUEVO = `/* En estrecho la barra se parte en dos filas y los enlaces se
   deslizan en horizontal: nunca se esconden detrás de un botón. */
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
}`;

for (const archivo of ['eventos.html', 'galeria.html']){
  let h = fs.readFileSync(P + archivo, 'utf8');
  if (!h.includes(VIEJO)) throw new Error('no encontré la regla vieja en ' + archivo);
  h = h.split(VIEJO).join(NUEVO);
  // que los enlaces respiren igual que en la portada
  h = h.split('.nav-links{ display:flex; gap:26px; margin-left:auto; }')
       .join('.nav-links{ display:flex; gap:clamp(15px,1.7vw,26px); margin-left:auto; }');
  fs.writeFileSync(P + archivo, h, 'utf8');
  console.log(archivo + ': menú horizontal en estrecho');
}
