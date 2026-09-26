const fs = require('fs');
const F = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/index.html';
let h = fs.readFileSync(F, 'utf8');

function pon(busca, nuevo, etiqueta){
  const i = h.indexOf(busca);
  if (i === -1) throw new Error('No encontré: ' + etiqueta);
  h = h.slice(0, i) + nuevo + h.slice(i + busca.length);
}

const VIEJO = `(function rise(){
  const els = $$('.rise');
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || quieto){ els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((es,obs) => es.forEach(en => {
    if (en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
  }), { rootMargin:'0px 0px -10% 0px', threshold:.06 });
  els.forEach(e => io.observe(e));
  setTimeout(() => els.forEach(e => e.classList.add('in')), 3000);   // red de seguridad
})();`;

const NUEVO = `/* ── Aparición al hacer scroll ──
   Cada bloque entra cuando asoma por abajo. Las rejillas se reparten
   en cascada: las tarjetas no aparecen de golpe, sino una tras otra.
   La visibilidad se mide con getBoundingClientRect; un
   IntersectionObserver era más elegante, pero hay entornos donde no
   llega a disparar y el efecto se quedaba muerto sin avisar. */
let porAparecer = [];

(function preparaRise(){
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Rejillas cuyos hijos entran escalonados en vez de todo el bloque a la vez
  const REJILLAS = ['.facts', '.two', '.dishes', '.nights', '.gal', '.cards', '.rules', '.hours', '.brands'];
  REJILLAS.forEach(sel => $$(sel).forEach(cont => {
    cont.classList.remove('rise');               // ya no anima el contenedor: animan sus hijos
    [...cont.children].forEach((hijo, i) => {
      hijo.classList.add('rise');
      hijo.style.setProperty('--d', Math.min(i, 8) * 75 + 'ms');
    });
  }));

  // Los títulos de sección entran con algo más de recorrido
  $$('.section-title, .h2').forEach(t => t.classList.add('titulo'));

  // Dentro de cada sección, lo que va suelto entra en cascada
  $$('.section').forEach(sec => {
    let n = 0;
    $$(':scope > .wrap > .rise, :scope > .wrap > * > .rise', sec).forEach(el => {
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', Math.min(n++, 6) * 65 + 'ms');
    });
  });

  porAparecer = $$('.rise');
  if (quieto){ porAparecer.forEach(e => e.classList.add('in')); porAparecer = []; return; }

  // Red de seguridad: si algo fallara, a los 5 s todo queda visible igualmente
  setTimeout(() => { porAparecer.forEach(e => e.classList.add('in')); porAparecer = []; }, 5000);
})();

function revisaRise(){
  if (!porAparecer.length) return;
  const alto = window.innerHeight;
  if (!alto) return;
  const gatillo = alto * 0.88;                   // asoma un 12% antes del borde inferior
  const quedan = [];
  for (const el of porAparecer){
    const r = el.getBoundingClientRect();
    if (r.top < gatillo) el.classList.add('in'); // ya asomó (o quedó por encima)
    else quedan.push(el);
  }
  porAparecer = quedan;
}`;

pon(VIEJO, NUEVO, 'función rise');

/* El scroll ya movía el parallax de las fotos; le colgamos además la
   revisión de los bloques que entran, y el menú de pantallas pequeñas. */
pon(
`  addEventListener('scroll', pedir, { passive:true });
  addEventListener('resize', pedir, { passive:true });
  mover();
})();`,
`  addEventListener('scroll', pedir, { passive:true });
  addEventListener('resize', pedir, { passive:true });
  mover();
})();

/* ── Menú de pantallas pequeñas ── */
(function menu(){
  const btn = $('#menu-btn'), panel = $('#menu-panel');
  if (!btn || !panel) return;
  const cierra = () => {
    panel.hidden = true; btn.setAttribute('aria-expanded','false'); document.body.style.overflow = '';
  };
  btn.addEventListener('click', () => {
    if (btn.getAttribute('aria-expanded') === 'true'){ cierra(); return; }
    panel.hidden = false; btn.setAttribute('aria-expanded','true'); document.body.style.overflow = 'hidden';
  });
  panel.addEventListener('click', e => { if (e.target.closest('a')) cierra(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) cierra(); });
  addEventListener('resize', () => { if (innerWidth > 900 && !panel.hidden) cierra(); }, { passive:true });
})();

/* El scroll dispara también la aparición de los bloques */
addEventListener('scroll', revisaRise, { passive:true });
addEventListener('resize', revisaRise, { passive:true });
revisaRise();
requestAnimationFrame(revisaRise);`, 'menú y enganche');

fs.writeFileSync(F, h, 'utf8');
console.log('motor de aparición + menú: OK');
