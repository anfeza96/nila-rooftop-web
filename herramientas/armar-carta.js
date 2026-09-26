/* Inyecta carta-data.json dentro de la plantilla y escribe carta.html.
 * Uso, desde la raíz del repo:  node herramientas/armar-carta.js
 * carta.html es un archivo generado: los cambios van en carta-data.json
 * (precios, platos, textos) o en herramientas/carta-template.html
 * (diseño y JavaScript), nunca en carta.html directamente. */
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const TPL  = path.join(__dirname, 'carta-template.html');
const DATA = path.join(RAIZ, 'carta-data.json');
const OUT  = path.join(RAIZ, 'carta.html');

const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));

// LF siempre: JSON.stringify produce LF, y una plantilla en CRLF (checkout en Windows) dejaría el archivo mezclado.
let tpl = fs.readFileSync(TPL, 'utf8').replace(/\r\n/g, '\n');
if (!tpl.includes('__CARTA_DATA_JSON__')) throw new Error('no encontré el placeholder en la plantilla');

// Con sangría, para que editar un precio sea cuestión de buscar el plato.
// Evita que un "</script>" literal dentro de un texto cierre la etiqueta.
const json = JSON.stringify(data, null, 2).replace(/<\/script/gi, '<\\/script');

tpl = tpl.replace('__CARTA_DATA_JSON__', json);
fs.writeFileSync(OUT, tpl, 'utf8');
console.log('carta.html escrito:', Math.round(Buffer.byteLength(tpl) / 1024), 'KB');
console.log('categorías:', data.categories.length, '· productos:', data.categories.reduce((n,c) => n + c.groups.reduce((m,g) => m + g.items.length, 0), 0));
