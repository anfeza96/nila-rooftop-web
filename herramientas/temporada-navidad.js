// Enciende o apaga la temporada navideña del sitio con un solo comando.
//
//   node herramientas/temporada-navidad.js ocultar   → quita la pestaña "Cenas navideñas"
//   node herramientas/temporada-navidad.js mostrar   → la vuelve a poner
//   node herramientas/temporada-navidad.js estado    → dice cómo está ahora
//
// Qué toca, y nada más:
//   1. El enlace de la pestaña en el menú de index, eventos, galería y la plantilla
//      de la carta. Va entre <!--temporada:navidad--> … <!--/temporada:navidad-->;
//      al ocultar se convierte en un comentario HTML.
//   2. El bloque <style data-temporada="navidad"> de esas páginas (los colores de la
//      pestaña y el ajuste de la barra para que quepa). Al ocultar se le pone
//      media="not all", así el navegador lo ignora y la barra vuelve a ser la de siempre.
//   3. vercel.json: al ocultar, /cenas-navidenas lleva a la portada, para que un enlace
//      viejo compartido por WhatsApp no termine en una página de temporada pasada.
//   4. Vuelve a armar carta.html desde su plantilla.
// La página cenas-navidenas.html y sus fotos se quedan en el repositorio para el año
// siguiente. Correrlo dos veces seguidas no cambia nada la segunda vez.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..');
const PAGINAS = ['index.html', 'eventos.html', 'galeria.html', 'herramientas/carta-template.html'];
const ENLACE_ON  = /<!--temporada:navidad-->(<a class="navidad"[^>]*>[^<]*<\/a>)<!--\/temporada:navidad-->/;
const ENLACE_OFF = /<!--temporada:navidad oculta (<a class="navidad"[^>]*>[^<]*<\/a>) \/temporada:navidad-->/;
const ESTILO_ON  = '<style data-temporada="navidad">';
const ESTILO_OFF = '<style data-temporada="navidad" media="not all">';

function estadoDe(html, archivo) {
  const on = ENLACE_ON.test(html), off = ENLACE_OFF.test(html);
  if (on === off) throw new Error(archivo + ': no encuentro la marca de la pestaña navideña (o está dos veces).');
  return on ? 'visible' : 'oculta';
}

// Se edita como texto para que vercel.json quede byte a byte igual al volver a mostrar.
const REDIR_TXT = `  "redirects": [
    { "source": "/cenas-navidenas", "destination": "/", "permanent": false },
    { "source": "/cenas-navidenas.html", "destination": "/", "permanent": false }
  ],
`;
function vercel(ocultar) {
  const ruta = path.join(RAIZ, 'vercel.json');
  let txt = fs.readFileSync(ruta, 'utf8');
  const tiene = txt.includes(REDIR_TXT);
  if (ocultar && !tiene) {
    if (/"redirects"/.test(txt)) throw new Error('vercel.json ya tiene otras redirecciones: agrega las de temporada a mano.');
    const i = txt.indexOf('  "headers"'); if (i < 0) throw new Error('vercel.json: no encuentro "headers".');
    txt = txt.slice(0, i) + REDIR_TXT + txt.slice(i);
  } else if (!ocultar && tiene) {
    txt = txt.split(REDIR_TXT).join('');
  }
  JSON.parse(txt);                       // si quedara mal escrito, se detiene antes de guardar
  fs.writeFileSync(ruta, txt, 'utf8');
}

const orden = process.argv[2];
if (!['ocultar', 'mostrar', 'estado'].includes(orden)) {
  console.log('Uso: node herramientas/temporada-navidad.js ocultar | mostrar | estado');
  process.exit(1);
}

for (const rel of PAGINAS) {
  const archivo = path.join(RAIZ, rel);
  let html = fs.readFileSync(archivo, 'utf8');
  const antes = estadoDe(html, rel);
  if (orden === 'estado') { console.log(rel.padEnd(36), antes); continue; }
  if (orden === 'ocultar') {
    html = html.replace(ENLACE_ON, '<!--temporada:navidad oculta $1 /temporada:navidad-->').split(ESTILO_ON).join(ESTILO_OFF);
  } else {
    html = html.replace(ENLACE_OFF, '<!--temporada:navidad-->$1<!--/temporada:navidad-->').split(ESTILO_OFF).join(ESTILO_ON);
  }
  if (!html.includes(orden === 'ocultar' ? ESTILO_OFF : ESTILO_ON)) throw new Error(rel + ': no encuentro el bloque de estilos de la temporada.');
  fs.writeFileSync(archivo, html, 'utf8');
  console.log(rel.padEnd(36), antes, '→', estadoDe(html, rel));
}

if (orden !== 'estado') {
  vercel(orden === 'ocultar');
  console.log('vercel.json'.padEnd(36), orden === 'ocultar' ? '/cenas-navidenas lleva a la portada' : 'sin redirección de temporada');
  execFileSync(process.execPath, [path.join(RAIZ, 'herramientas', 'armar-carta.js')], { cwd: RAIZ, stdio: 'inherit' });
  console.log('\nListo. Revisa en local y luego: git add -A && git commit && git push');
}
