const fs = require('fs');
const F = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/index.html';
let h = fs.readFileSync(F, 'utf8');
function pon(a,b,etq){ if(!h.includes(a)) throw new Error('No encontré: '+etq); h = h.replace(a,b); }

/* ── 1. CSS: difuminado real + movimiento más notorio ── */
pon(
`  .js .rise{
    opacity:0; transform:translateY(26px);
    transition:opacity .85s cubic-bezier(.16,.84,.26,1) var(--d,0ms),
               transform .85s cubic-bezier(.16,.84,.26,1) var(--d,0ms);
  }
  /* Los títulos entran con un poco más de recorrido */
  .js .rise.titulo{ transform:translateY(34px); }
  .js .rise.in{ opacity:1; transform:none; }`,
`  .js .rise{
    opacity:0; transform:translateY(38px); filter:blur(9px);
    transition:opacity 1s cubic-bezier(.16,.84,.26,1) var(--d,0ms),
               transform 1s cubic-bezier(.16,.84,.26,1) var(--d,0ms),
               filter 1s cubic-bezier(.16,.84,.26,1) var(--d,0ms);
    will-change:opacity, transform, filter;
  }
  /* Los títulos entran con un poco más de recorrido */
  .js .rise.titulo{ transform:translateY(48px); filter:blur(12px); }
  .js .rise.in{ opacity:1; transform:none; filter:blur(0); }`, 'transición del rise');

/* ── 2. JS: la cascada mira TODO el interior de la sección, sin
   limitarse a un nivel de anidamiento (antes se quedaba corta si el
   texto estaba envuelto en un div extra) ── */
pon(
`    $$(':scope > .wrap > .rise, :scope > .wrap > * > .rise', sec).forEach(el => {
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', Math.min(n++, 6) * 65 + 'ms');
    });`,
`    $$('.rise', sec).forEach(el => {
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', Math.min(n++, 7) * 90 + 'ms');
    });`, 'cascada por sección');

fs.writeFileSync(F, h, 'utf8');
console.log('CSS y cascada: OK');
