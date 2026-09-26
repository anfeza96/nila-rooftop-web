/* Sustituye el isotipo dibujado a mano (3 trazos de mariposa) por el
 * isotipo real de la marca (nila-rooftop-isotipo-blanco-rgb.svg), en
 * todas las páginas del sitio y en la plantilla fuente de carta.html.
 * Se mantiene el tamaño ya puesto en cada lugar (nav, hero, pie de
 * página): eso lo controla el CSS existente (width/height por clase),
 * no el viewBox, así que no hay que tocar el CSS.
 */
const fs = require('fs');

const PROY = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/';
const TPL  = 'C:/Users/User/AppData/Local/Temp/claude/D--Users-User-Desktop-CLAUDE-PAGINA-WEB/471b6c7c-54d5-4876-86da-bcaead0d63f8/scratchpad/carta-template.html';

const VIEWBOX_NUEVO = '0 0 156.166 142.3839';
const PATH_NUEVO = 'M151.804,36.5492c-7.9934-12.4274-26.5083-15.4301-38.0885-6.1932-12.6717,10.1605-11.5238,28.5691-9.8996,43.1066,1.6158.7618,3.2726,1.4211,4.9601,1.9232-1.6069-11.2154-2.0177-25.0807,6.5995-33.6478,8.841-8.0377,23.2633.2905,24.8311,10.9621,1.5281,13.4325-10.8931,28.5025-24.7077,28.5307-11.1005-.2891-20.5052-8.0356-28.9133-14.6377-.8507,1.7592-1.7047,3.5253-2.5415,5.3016,6.3219,5.3891,13.382,10.1863,21.4355,12.5094,10.086,54.3826-51.5042,47.489-30.1527-3.5567,4.5414-11.4144,11.3128-22.5525,14.9378-34.3166C97.1734,26.7093,91.0993.9313,67.7796.1863c-27.5197-2.6947-39.1605,24.343-33.5069,48.394,2.4254-1.0111,4.9225-1.8378,7.464-2.4493.0544-43.2242,57.6092-30.4976,37.9894,15.0509-8.7458-6.8753-19.2847-12.5351-30.7407-11.3887C27.0878,51.7118,4.166,70.3219.2725,92.3353c-3.7259,23.655,31.7376,40.0583,46.4486,20.6093,12.0381-17.7003-.8363-38.1031-3.7853-56.5416,12.1696-2.7878,24.6147,2.6707,34.2183,9.9098-63.0114,87.1075,61.9017,107.122,34.0268,19.3073,26.8216,4.74,56.2663-22.7529,40.6232-49.071ZM39.2397,91.4068c-4.0354,14.2306-21.9505,11.0696-22.9828-2.8498-1.3034-12.7827,8.8184-24.7117,19.9973-29.8755,1.9251,10.6824,5.9741,21.9069,2.9855,32.7254Z';

// Bloque "sencillo" (nav-logo y foot-logo): idéntico en todas las
// páginas, stroke-width 2.8, sin clase propia en el <svg>.
const VIEJO_SENCILLO =
  '<svg viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="2.8" aria-hidden="true">\n' +
  '        <path d="M32 28c-6-9-11-13-17-11-6 2-7 9-3 13 4 4 12 3 20-2z" stroke-linejoin="round"/>\n' +
  '        <path d="M32 28c6-9 11-13 17-11 6 2 7 9 3 13-4 4-12 3-20-2z" stroke-linejoin="round"/>\n' +
  '        <path d="M32 28c-5 8-5 15 0 18 5-3 5-10 0-18z" stroke-linejoin="round"/>\n' +
  '      </svg>';
const NUEVO_SENCILLO =
  '<svg viewBox="' + VIEWBOX_NUEVO + '" fill="currentColor" aria-hidden="true">\n' +
  '        <path d="' + PATH_NUEVO + '"/>\n' +
  '      </svg>';

// Bloque del hero (logo-butterfly): solo en index.html, stroke-width 2.4.
const VIEJO_HERO =
  '<svg class="logo-butterfly" viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">\n' +
  '        <path d="M32 28c-6-9-11-13-17-11-6 2-7 9-3 13 4 4 12 3 20-2z" stroke-linejoin="round"/>\n' +
  '        <path d="M32 28c6-9 11-13 17-11 6 2 7 9 3 13-4 4-12 3-20-2z" stroke-linejoin="round"/>\n' +
  '        <path d="M32 28c-5 8-5 15 0 18 5-3 5-10 0-18z" stroke-linejoin="round"/>\n' +
  '      </svg>';
const NUEVO_HERO =
  '<svg class="logo-butterfly" viewBox="' + VIEWBOX_NUEVO + '" fill="currentColor" aria-hidden="true">\n' +
  '        <path d="' + PATH_NUEVO + '"/>\n' +
  '      </svg>';

function procesa(ruta){
  let h = fs.readFileSync(ruta, 'utf8');
  const antesSencillo = h.split(VIEJO_SENCILLO).length - 1;
  const antesHero = h.split(VIEJO_HERO).length - 1;
  if (antesSencillo === 0 && antesHero === 0){
    console.log(ruta.split('/').pop() + ': no encontré el isotipo viejo (¿ya cambiado?)');
    return;
  }
  h = h.split(VIEJO_HERO).join(NUEVO_HERO);
  h = h.split(VIEJO_SENCILLO).join(NUEVO_SENCILLO);
  fs.writeFileSync(ruta, h, 'utf8');
  console.log(ruta.split('/').pop() + ': ' + antesSencillo + ' sencillo(s) + ' + antesHero + ' hero -> reemplazados');
}

[
  PROY + 'index.html',
  PROY + 'eventos.html',
  PROY + 'galeria.html',
  PROY + 'carta.html',
  TPL
].forEach(procesa);
