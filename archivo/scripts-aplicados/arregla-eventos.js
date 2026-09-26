const fs=require('fs'); const P='D:/Users/User/Desktop/CLAUDE/PAGINA WEB/';
let h=fs.readFileSync(P+'eventos.html','utf8');
function pon(a,b,e){ if(!h.includes(a)) throw new Error('no encontré: '+e); h=h.split(a).join(b); }
function corta(a,b,e){ const i=h.indexOf(a); if(i<0) throw new Error('inicio '+e);
  const j=h.indexOf(b,i); if(j<0) throw new Error('fin '+e); h=h.slice(0,i)+h.slice(j+b.length); }

/* 1. Menú completo y coherente con la portada */
pon(`      <a href="index.html">Portada</a>
      <a href="index.html#carta">Carta</a>
      <a href="eventos.html" aria-current="page">Eventos</a>
      <a href="index.html#visita">Horarios</a>
      <a href="index.html#contacto">Contacto</a>`,
`      <a href="index.html">Portada</a>
      <a href="index.html#carta">Carta</a>
      <a href="index.html#corporativos">Corporativos</a>
      <a href="eventos.html" aria-current="page">Eventos</a>
      <a href="galeria.html">Galería</a>
      <a href="index.html#visita">Horarios</a>
      <a href="index.html#contacto">Contacto</a>`, 'menú');

/* 2. Fuera el panel de añadir eventos */
corta('<!-- Panel de administración: solo aparece si eres el propietario -->','</section>','panel html');
corta('/* ══════════════════════════════════════════════════════════\n   6) Panel de autoservicio','  pintarAdmin();\n})();','panel js');
pon(`function pintarAdmin(){ if (typeof window.__pintarAdmin === 'function') window.__pintarAdmin(); }`,
    `function pintarAdmin(){ /* el panel de administración se retiró */ }`, 'pintarAdmin');
pon(`/* La plantilla de la página se inyecta al publicar el artefacto.
   Mientras valga el marcador de abajo, el panel de autoservicio
   queda desactivado (es el caso del archivo suelto y de Vercel). */
const PLANTILLA = "@@PLANTILLA@@";

`, '', 'plantilla');

fs.writeFileSync(P+'eventos.html',h,'utf8');
console.log('eventos.html: menú actualizado y panel retirado');
