/* Montador de las páginas de NILA para publicarlas como artefactos.
 *
 * Cada artefacto envuelve lo que se publica en su propio <head>/<body>,
 * así que se publica sin esas etiquetas. Y entre artefactos no valen las
 * rutas de archivo: cada página vive en su propia URL, así que los
 * enlaces se reescriben y se abren en pestaña nueva (van dentro de un
 * marco y si no quedarían anidados).
 */
const fs = require('fs');
const path = require('path');

const PROY = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB';
const SALIDA = __dirname;

const URLS = {
  'index.html':   'https://claude.ai/artifact/Msb6nRSHRNWNAyeLCvsmoS',
  'eventos.html': 'https://claude.ai/artifact/DsEQtDoeznR2GEmRKKvqZt',
  'galeria.html': 'https://claude.ai/artifact/27V5CKt7uvBgNV6ZzP5cVk'          // se rellena al publicarla por primera vez
};

const FUERA = [
  /^<!doctype html>$/i, /^<\/?html/i, /^<\/?head>$/i, /^<\/?body>$/i,
  /^<meta charset/i, /^<meta name="viewport"/i, /^<link rel="icon"/i, /^<meta property="og:/i
];

const recorta = html =>
  html.split(/\r?\n/).filter(l => !FUERA.some(re => re.test(l.trim()))).join('\n').trim() + '\n';

const FUERA_MARCO = '" target="_blank" rel="noopener';

function enlaza(html, propio){
  for (const [archivo, url] of Object.entries(URLS)){
    if (archivo === propio) continue;                 // a sí misma no
    if (url.startsWith('@@')) continue;               // todavía sin publicar
    const re = new RegExp('href="' + archivo.replace('.', '\\.') + '(#[a-z]+)?"', 'g');
    html = html.replace(re, 'href="' + url + FUERA_MARCO + '"');
  }
  return html;
}

const SALIDAS = {
  'index.html':   'nila-rooftop.html',
  'eventos.html': 'nila-eventos.html',
  'galeria.html': 'nila-galeria.html'
};

for (const [fuente, destino] of Object.entries(SALIDAS)){
  const ruta = path.join(PROY, fuente);
  if (!fs.existsSync(ruta)){ console.log('(falta ' + fuente + ')'); continue; }
  let html = fs.readFileSync(ruta, 'utf8');
  html = enlaza(html, fuente);
  const salida = recorta(html);
  fs.writeFileSync(path.join(SALIDA, destino), salida, 'utf8');
  const kb = Math.round(Buffer.byteLength(salida) / 1024);
  console.log(fuente.padEnd(14) + ' -> ' + destino.padEnd(20) + kb + ' KB');
}

const pendientes = Object.entries(URLS).filter(([, u]) => u.startsWith('@@'));
if (pendientes.length){
  console.log('\nPendiente de URL (publícala y pon su enlace aquí): ' +
    pendientes.map(([a]) => a).join(', '));
}
