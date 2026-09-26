const fs = require('fs');
const F = 'D:/Users/User/Desktop/CLAUDE/PAGINA WEB/index.html';
let h = fs.readFileSync(F, 'utf8');
function pon(a,b,etq){ if(!h.includes(a)) throw new Error('No encontré: '+etq); h = h.replace(a,b); }

/* ── #lugar: el texto entra línea por línea, no como un solo bloque ── */
pon(
`      <div class="rise">
        <p class="eyebrow">El lugar</p>
        <h2 class="h2">Cuenca se ve mejor<br>desde arriba.</h2>
        <p class="lede">NILA ocupa la última planta`,
`      <div>
        <p class="eyebrow rise">El lugar</p>
        <h2 class="h2 rise titulo">Cuenca se ve mejor<br>desde arriba.</h2>
        <p class="lede rise">NILA ocupa la última planta`, '#lugar apertura');

pon(
`        <p class="lede">La terraza cambia de carácter con la hora. A las cinco es luz dorada`,
`        <p class="lede rise">La terraza cambia de carácter con la hora. A las cinco es luz dorada`, '#lugar párrafo 2');

pon(
`        <p class="lede">No hace falta elegir entre cenar bien y salir. Aquí las dos cosas ocurren en la misma mesa.</p>
        <div class="hero-actions" style="margin-top:30px">`,
`        <p class="lede rise">No hace falta elegir entre cenar bien y salir. Aquí las dos cosas ocurren en la misma mesa.</p>
        <div class="hero-actions rise" style="margin-top:30px">`, '#lugar párrafo 3 y botón');

/* ── #reserva: mismo tratamiento ── */
pon(
`    <div class="rise">
      <p class="eyebrow">Reservas</p>
      <h2 class="h2">Aparta tu mesa<br>en un minuto.</h2>
      <p class="lede">Llena los datos y te llevamos a WhatsApp con el mensaje ya escrito. No hay formularios que se pierden ni correos sin respuesta: contestamos por el mismo chat.</p>
      <ul class="rules">`,
`    <div>
      <p class="eyebrow rise">Reservas</p>
      <h2 class="h2 rise titulo">Aparta tu mesa<br>en un minuto.</h2>
      <p class="lede rise">Llena los datos y te llevamos a WhatsApp con el mensaje ya escrito. No hay formularios que se pierden ni correos sin respuesta: contestamos por el mismo chat.</p>
      <ul class="rules rise">`, '#reserva apertura');

/* ── #visita: las dos columnas (horarios / cómo llegar) ── */
pon(
`    <div class="rise">
      <p class="eyebrow">Horarios</p>
      <h2 class="h2">Cuándo estamos.</h2>
      <ul class="hours" id="hours"></ul>
      <p class="aviso" id="hours-aviso" hidden></p>
      <p class="note" style="color:#7A6250">Los horarios de días especiales y feriados se anuncian en Instagram.</p>
    </div>
    <div class="rise">
      <p class="eyebrow">Cómo llegar</p>
      <h2 class="h2">Dónde estamos.</h2>`,
`    <div>
      <p class="eyebrow rise">Horarios</p>
      <h2 class="h2 rise titulo">Cuándo estamos.</h2>
      <ul class="hours rise" id="hours"></ul>
      <p class="aviso" id="hours-aviso" hidden></p>
      <p class="note" style="color:#7A6250">Los horarios de días especiales y feriados se anuncian en Instagram.</p>
    </div>
    <div>
      <p class="eyebrow rise">Cómo llegar</p>
      <h2 class="h2 rise titulo">Dónde estamos.</h2>`, '#visita apertura');

fs.writeFileSync(F, h, 'utf8');
console.log('bloques separados: OK');
