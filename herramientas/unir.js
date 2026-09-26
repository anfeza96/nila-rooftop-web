/* Arma la versión "espejo" del sitio para publicarla como Artifact de Claude.
 * Uso: node herramientas/unir.js  → escribe en herramientas/salida-artefacto/ (ignorada por git)
 *
 * index.html es la página del artefacto, así que se publica sin las etiquetas
 * envolventes: el artefacto pone las suyas. Las demás páginas viajan como
 * archivos vecinos completos en el mismo origen, así que los enlaces entre
 * páginas quedan tal cual y navegan en la misma ventana. */
const fs = require('fs');
const path = require('path');

const PROY = path.resolve(__dirname, '..');
const SALIDA = path.join(__dirname, 'salida-artefacto');
fs.mkdirSync(SALIDA, { recursive: true });

const FUERA = [
  /^<!doctype html>$/i, /^<\/?html/i, /^<\/?head>$/i, /^<\/?body>$/i,
  /^<meta charset/i, /^<meta name="viewport"/i, /^<link rel="icon"/i, /^<meta property="og:/i
];

const recorta = html =>
  html.split(/\r?\n/).filter(l => !FUERA.some(re => re.test(l.trim()))).join('\n').trim() + '\n';

const portada = recorta(fs.readFileSync(path.join(PROY, 'index.html'), 'utf8'));
fs.writeFileSync(path.join(SALIDA, 'nila-rooftop.html'), portada, 'utf8');

for (const f of ['eventos.html', 'galeria.html', 'carta.html', 'politica-privacidad.html']){
  fs.copyFileSync(path.join(PROY, f), path.join(SALIDA, f));
}

const fallos = [];
for (const f of ['nila-rooftop.html', 'eventos.html', 'galeria.html', 'carta.html', 'politica-privacidad.html']){
  const h = fs.readFileSync(path.join(SALIDA, f), 'utf8');
  const re = /<a[^>]+href="(index|eventos|galeria|carta)\.html[^"]*"[^>]*>/g;
  let m;
  while ((m = re.exec(h))){
    if (/target=/.test(m[0])) fallos.push(f + ': ' + m[0].slice(0, 90));
  }
  console.log(f.padEnd(26) + Math.round(Buffer.byteLength(h) / 1024) + ' KB');
}
console.log(fallos.length ? '\nEnlaces que abrirían pestaña:\n' + fallos.join('\n')
                          : '\nTodos los enlaces navegan en la misma ventana.');
