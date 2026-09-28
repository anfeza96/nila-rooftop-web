// Arma el mosaico de galeria.html: filas de fotos + el recuadro de Instagram al final.
// Uso: node herramientas/armar-galeria.js galeria.html
// Para sumar una foto: crear img/galeria/mini/NN.webp (480x600) y img/galeria/fotos/NN.webp
// (1080 px), agregar su línea a la lista y ajustar TAMANOS para que sume el total.
const fs = require('fs');
const archivo = process.argv[2];
const NBM = ' · Foto: NBM Experience Studio';
const O = 'Over 21', N = 'Noches como esta', C = 'Noches para compartir', T = 'Terraza del Despecho', B = 'En buena compañía';

// [id, peso, forma-en-celular, pie, alt, credito]
const fotos = [
  ['01', 1.35, 'alta', T, 'Letrero iluminado de NILA ROOFTOP', ''],
  ['02', 1,    '',     N, 'Amigas celebrando en la pista', NBM],
  ['03', 1,    '',     O, 'DJ en la cabina durante Over 21', NBM],
  ['04', 1.3,  'alta', B, 'Copa de vino en la terraza, con las luces de Cuenca de fondo', ''],
  ['05', 1,    '',     C, 'Celebración de cumpleaños con torta y champaña', ''],
  ['06', 1,    '',     O, 'Tres amigas en la pista durante Over 21', NBM],
  ['07', 1.3,  '',     'Risotto anticuchero', 'Risotto anticuchero de NILA ROOFTOP', ''],
  ['08', 1.4,  'ancha', N, 'La pista llena, con las luces en movimiento', NBM],
  ['09', 1,    '',     T, 'Karaoke en la Terraza del Despecho', ''],
  ['10', 1.4,  'alta', C, 'DJ frente a la rueda de luces rojas', ''],
  ['11', 1,    '',     B, 'Pareja en una mesa de la terraza', ''],
  ['12', 1,    '',     O, 'Cabina del DJ bajo el letrero de NILA', NBM],
  ['13', 1.25, '',     N, 'Grupo de amigas en la terraza', NBM],
  ['14', 1,    '',     C, 'Amigos en un reservado del interior', ''],
  ['15', 1.2,  '',     'Ensalada de pollo', 'Ensalada de pollo de NILA ROOFTOP', ''],
  ['16', 1,    '',     T, 'Amigas cantando y tomándose una selfie', ''],
  ['17', 1.4,  'ancha', N, 'Grupo frente a la cabina, bajo el letrero de NILA', NBM],
  ['18', 1,    '',     C, 'Grupo brindando junto a la barra', ''],
  ['19', 1,    '',     O, 'El DJ saluda desde la cabina', NBM],
  ['20', 1.3,  'alta', B, 'Dos amigas en una mesa de la terraza', ''],
  ['21', 1,    '',     C, 'Amigas bajo la luz cálida del interior', ''],
  ['22', 1,    '',     T, 'Pareja sonriendo en su mesa', ''],
  ['23', 1.2,  '',     O, 'DJ mezclando bajo las luces rojas', NBM],
  ['24', 1,    '',     N, 'Tres amigas posando en la pista', NBM],
  ['25', 1,    '',     C, 'Pareja abrazada en el interior', ''],
  ['26', 1.3,  'alta', B, 'Pareja sonriendo en su mesa de la terraza', ''],
  ['27', 1,    '',     O, 'Tres amigos abrazados en la pista', NBM],
  ['28', 1.35, '',     N, 'Los DJ saludan desde la cabina', NBM],
  ['29', 1,    '',     T, 'Dos amigas sonriendo en la terraza', ''],
  ['30', 1,    '',     C, 'Dos amigos brindando junto a la barra', ''],
  ['31', 1,    '',     O, 'Dos amigos con sus tragos en la fiesta', NBM],
  ['32', 1.25, '',     N, 'Amigas celebrando en la pista', NBM],
  ['33', 1.3,  'alta', B, 'Grupos de amigas compartiendo mesa', ''],
  ['60', 1.2,  '',     N, 'La pista vista desde la cabina', NBM],
  ['34', 1,    '',     O, 'El DJ elige la siguiente canción', NBM],
  ['35', 1,    '',     C, 'Pareja con sus cócteles', ''],
  ['36', 1.2,  '',     N, 'Amigos celebrando con una botella', NBM],
  ['37', 1.35, '',     T, 'Cantando al micrófono junto a la lámpara de mesa', ''],
  ['38', 1,    '',     O, 'Pareja abrazada en la pista', NBM],
  ['39', 1.4,  'ancha', N, 'Manos arriba en la pista', NBM],
  ['40', 1,    '',     C, 'Cuatro amigos en la terraza', ''],
  ['41', 1.3,  'alta', B, 'Mesas llenas en la terraza', ''],
  ['42', 1.25, 'ancha', O, 'Grupo de amigos posando junto a la pista', NBM],
  ['43', 1,    '',     N, 'Pareja posando en la fiesta', NBM],
  ['44', 1,    '',     C, 'Tres amigos con sus copas en la terraza', ''],
  ['45', 1.3,  '',     O, 'Cinco amigos posando bajo las luces', NBM],
  ['46', 1,    '',     N, 'Retrato en movimiento desde la cabina', NBM],
  ['47', 1.3,  'alta', T, 'Grupos de amigos en la terraza', ''],
  ['48', 1,    '',     O, 'Pareja posando en la fiesta', NBM],
  ['49', 1.35, 'alta', C, 'Grupos compartiendo mesa frente a las luces de Cuenca', ''],
  ['50', 1,    '',     N, 'Dos amigos bajo las luces violetas', NBM],
  ['51', 1,    '',     O, 'Tres amigos abrazados', NBM],
  ['52', 1.3,  'alta', B, 'Amigos en los sillones del interior', ''],
  ['53', 1.2,  '',     N, 'La pista en movimiento', NBM],
  ['54', 1,    '',     O, 'Tres amigos bajo las luces azules', NBM],
  ['55', 1,    '',     C, 'Amigas en la terraza, con la ciudad de fondo', ''],
  ['56', 1.25, '',     N, 'Saludo desde la cabina del DJ', NBM],
  ['57', 1,    '',     O, 'DJ concentrado en la mezcla', NBM],
  ['58', 1.3,  'alta', C, 'Grupos de amigos en la terraza', ''],
  ['59', 1,    '',     O, 'Brazos arriba al ritmo de la música', NBM],
];
const TAMANOS = [6, 6, 7, 5, 6, 6, 7, 6, 6, 5];   // la última fila suma el recuadro de Instagram
if (TAMANOS.reduce((a, b) => a + b) !== fotos.length) throw new Error('las filas no suman ' + fotos.length);

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const figura = ([id, w, forma, pie, alt, cred], primeraFila) => {
  const carga = primeraFila ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  return `        <figure class="marco${forma ? ' ' + forma : ''}" style="--w:${w}" tabindex="0" role="button" aria-label="Ver foto: ${esc(alt)}" data-src="img/galeria/fotos/${id}.webp" data-txt="${esc(pie + cred)}">
          <img src="img/galeria/mini/${id}.webp" alt="${esc(alt)}" width="480" height="600" ${carga} decoding="async">
          <figcaption class="pie-foto">${esc(pie)}</figcaption>
        </figure>`;
};
const IG = `        <a class="marco tile-ig ancha" style="--w:1.4" href="https://www.instagram.com/nila.rooftop/" target="_blank" rel="noopener">
          <span class="dentro">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            <b>@nila.rooftop</b>
            <em>33 mil personas ya nos siguen. Las fotos nuevas salen ahí primero.</em>
            <u>Ver el perfil</u>
          </span>
        </a>`;

let k = 0;
const filas = TAMANOS.map((t, i) => {
  const grupo = fotos.slice(k, k += t);
  const ultima = i === TAMANOS.length - 1;
  return `      <div class="fila${i % 2 ? ' baja' : ''}">\n` +
    grupo.map(f => figura(f, i === 0)).join('\n') + (ultima ? '\n' + IG : '') + '\n      </div>';
});
const bloque = '<div class="gal" id="gal">\n' + filas.join('\n') + '\n    </div>';

let html = fs.readFileSync(archivo, 'utf8');
const ini = html.indexOf('<div class="gal" id="gal">');
const finIG = html.indexOf('</a>', html.indexOf('<a class="marco tile-ig'));
if (ini < 0 || finIG < 0) throw new Error('no encontré la rejilla actual');
let fin = html.indexOf('</div>', finIG) + 6;      // cierra la última fila
fin = html.indexOf('</div>', fin) + 6;            // cierra .gal
html = html.slice(0, ini) + bloque + html.slice(fin);
fs.writeFileSync(archivo, html, 'utf8');
console.log('fotos:', fotos.length, '· filas:', filas.length);
