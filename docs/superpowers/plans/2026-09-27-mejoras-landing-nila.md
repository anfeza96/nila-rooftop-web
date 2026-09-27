# Mejoras puntuales a la landing de NILA ROOFTOP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar 5 mejoras de contenido y diseño a `index.html` (Nosotros, Ambientes con foto, carta unificada a paleta oscura, testimonios reales, info práctica en Horarios) sin tocar el formulario de reservas, `carta.html`/`carta-data.json`, ni el copy existente que ya funciona.

**Architecture:** Un único archivo (`index.html`) con CSS embebido en `<style>` y JS embebido al final. Cada tarea agrega/edita un bloque de CSS (cerca del bloque afectado) y un bloque de HTML (en su lugar en el DOM), reutilizando clases y patrones visuales ya existentes en el propio archivo (`.puerta`, `.card`, `.rules`, `.hours`) en vez de inventar un sistema nuevo.

**Tech Stack:** HTML/CSS/JS vanilla, sin build ni frameworks. Servidor local de prueba: `node herramientas/servidor.js` (puerto 5178, configurado como `nila` en `.claude/launch.json`).

## Global Constraints

- Mantener la paleta dorado-sobre-oscuro definida en `:root` de `index.html` (`--ground`, `--gold`, `--sand`, `--terra`, `--cream`, `--muted`, `--faint`, `--ink`). No introducir colores nuevos fuera de esas variables.
- No modificar el formulario de reservas (`#reserva`, sección `.card-form` y su JS) ni su copy.
- No modificar `carta.html`, `herramientas/carta-template.html`, `carta-data.json` ni `herramientas/armar-carta.js` — la carta ya vive en paleta oscura en su propia página; lo que cambia acá es solo la vista previa de 2 platos dentro de `index.html`.
- No agregar dependencias JS ni librerías. Todo el código nuevo es HTML/CSS/JS vanilla en el mismo archivo.
- Toda imagen nueva debe tener un fallback visual en CSS (degradado), igual que el patrón ya usado en `.shot.ph` y `.tile-ig`, para que la sección nunca se vea rota si el archivo de imagen todavía no existe.
- Respetar `prefers-reduced-motion` — ya está resuelto globalmente por las reglas existentes en `:root`; no hace falta duplicar nada, solo no romper esas reglas.
- Verificar siempre sirviendo el archivo con `node herramientas/servidor.js` (puerto 5178) y navegando a `http://localhost:5178/index.html`. Nunca verificar abriendo el archivo con `file://` — ya está documentado en `herramientas/LEEME.md` que eso da falsos resultados (imágenes `lazy` no cargan, CSP se comporta distinto).
- Commits en español, uno por tarea, terminando con:
  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  ```

## Contenido ya acordado con el dueño (no inventar, usar tal cual)

- **Nosotros** (aprobado tal cual):
  > "Nació de la idea de mirar Cuenca desde otro ángulo: la última planta del Cardeca Business Center, convertida en terraza. NILA mezcla cocina de autor con coctelería y noches con DJ — no hay que elegir entre cenar bien y salir, las dos cosas pasan en la misma mesa."
- **Testimonios** (2 reseñas reales de Google, elegidas por el dueño de 3 candidatas revisadas en Maps el 27/09/2026; se limpiaron solo emoji/errores de tipeo, sin cambiar el sentido — esto se marca explícito en el Task 4 para que el dueño lo pueda revisar):
  - Patty Reivan: "Buena ubicación, ambiente acogedor y agradable, hay música en vivo y/o eventos especiales por temporadas. Ideal para compartir con amigos."
  - Felipe Zamora: "Excelente servicio, comida variada, vista espectacular de la ciudad y la seguridad es prioritaria en el local."
- **Info práctica** (dado por el dueño):
  - Vestimenta: Semi-formal, smart casual.
  - Edad: a partir de las 11:00 pm, ingreso solo mayores de 18 años.
  - Acceso: ascensor al último piso del Cardeca Business Center (ya mencionado en prosa en "El lugar"; acá se agrega como dato concreto y buscable).
- **Fotos de Ambiente 01 (Terraza) y Ambiente 02 (Interior):** no existen todavía en el repo (se revisaron todas las carpetas `img/`, `fuentes/` y `archivo/`; lo más cercano son fotos de gente cantando en la barra o de un evento de otra marca, ninguna sirve). El dueño va a mandar fotos nuevas. El Task 2 deja todo listo para que, apenas lleguen, alcance con guardarlas en `img/ambiente-terraza.webp` e `img/ambiente-interior.webp` — mientras tanto se ve un degradado de respaldo, no un hueco roto.

---

### Task 1: Sección "Nosotros" (nueva, entre el hero y "El lugar")

**Files:**
- Modify: `index.html` (HTML — insertar sección nueva; no requiere CSS nuevo, reutiliza `.section`, `.eyebrow`, `.h2`, `.lede` ya definidos)

**Interfaces:**
- Consumes: clases globales ya definidas en `:root`/`.eyebrow`/`.h2`/`.lede`/`.rise` (ninguna clase nueva).
- Produces: sección `<section id="nosotros">`, sin JS asociado (no la toca ningún script existente; el `IntersectionObserver` de nav-activo la ignora porque no hay `<a href="#nosotros">` en el nav — a propósito, no se pide agregar el link al menú).

- [ ] **Step 1: Insertar la sección en el HTML**

En `index.html`, justo después del cierre de la cinta de datos y antes del comentario `<!-- ════════ EL LUGAR ════════ -->` (busca esta secuencia exacta):

```html
    <div class="cell"><p class="k">Reservas</p><p class="v" id="c-tel"><a href="https://wa.me/593984958228" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">+593 98 495 8228</a></p></div>
  </div>
</div>

<!-- ════════ EL LUGAR ════════ -->
```

Reemplazar por:

```html
    <div class="cell"><p class="k">Reservas</p><p class="v" id="c-tel"><a href="https://wa.me/593984958228" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">+593 98 495 8228</a></p></div>
  </div>
</div>

<!-- ════════ NOSOTROS ════════ -->
<section class="section" id="nosotros" style="padding-block:clamp(50px,6vw,80px)">
  <div class="wrap">
    <p class="eyebrow rise">Nosotros</p>
    <h2 class="h2 rise titulo">Nació de la idea de mirar<br>Cuenca desde otro ángulo.</h2>
    <p class="lede rise">La última planta del Cardeca Business Center, convertida en terraza. NILA mezcla cocina de autor con coctelería y noches con DJ — no hay que elegir entre cenar bien y salir, las dos cosas pasan en la misma mesa.</p>
  </div>
</section>

<!-- ════════ EL LUGAR ════════ -->
```

- [ ] **Step 2: Verificar con el servidor local**

Iniciar el servidor (`preview_start` con la config `nila` de `.claude/launch.json`, o `node herramientas/servidor.js` desde la raíz del repo), navegar a `http://localhost:5178/index.html`, y con `get_page_text` confirmar que aparece el texto "Nació de la idea de mirar" entre el bloque de la cinta de datos y "Cuenca se ve mejor desde arriba." Tomar una captura para confirmar que el bloque entra con la misma animación `rise` que el resto (aparece al hacer scroll, no de golpe).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Agrega la seccion Nosotros entre el hero y El lugar

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Tarjetas "Ambiente 01 / Ambiente 02" con imagen de fondo

**Files:**
- Modify: `index.html` (CSS — reemplazar el bloque `AMBIENTES`; HTML — reemplazar el bloque `.two`)

**Interfaces:**
- Consumes: ninguna clase nueva de otra tarea.
- Produces: clases `.amb-img`, `.amb-in` (nuevas); `.two` y `.amb` cambian de significado (dejan de ser tarjetas planas y pasan a ser tarjetas con foto de fondo) pero mantienen los mismos nombres, así que el JS de aparición (`REJILLAS` incluye `.two`) sigue funcionando sin tocarlo — itera sobre los hijos directos de `.two`, que siguen siendo los dos `.amb`.
- Fotos esperadas (todavía no existen): `img/ambiente-terraza.webp`, `img/ambiente-interior.webp`. Hasta que el dueño las mande, se ve el degradado de respaldo definido en el CSS de este task.

- [ ] **Step 1: Reemplazar el CSS de `AMBIENTES`**

Buscar este bloque (sección `/* ───────────── AMBIENTES ───────────── */`):

```css
/* ───────────── AMBIENTES ───────────── */
.two{ display:grid; grid-template-columns:1fr 1fr; gap:1px; margin-top:44px; background:var(--line-soft); border:1px solid var(--line-soft); }
@media (max-width:720px){ .two{ grid-template-columns:1fr; } }
.amb{ background:var(--ground); padding:clamp(26px,3.6vw,40px); }
.amb .n{ font-family:var(--f-brand); font-size:10px; letter-spacing:.3em; text-transform:uppercase; color:var(--gold); margin:0 0 14px; }
.amb h3{ font-size:clamp(23px,3vw,31px); margin:0 0 12px; }
.amb p{ margin:0; color:var(--muted); font-size:15px; }
```

Reemplazar por (misma técnica de foto + degradado + texto encima que ya usan `.puerta` y el carrusel "Se antoja, ¿verdad?"; así las tarjetas se ven parte de la misma familia visual del sitio):

```css
/* ───────────── AMBIENTES ─────────────
   Tarjetas con foto de fondo, mismo lenguaje visual que .puerta y el
   carrusel de promos: foto a sangre, degradado oscuro, texto encima.
   El degradado de fondo es el respaldo mientras no exista la foto real
   — así nunca se ve un hueco roto, solo un color de marca. */
.two{ display:grid; grid-template-columns:1fr 1fr; gap:clamp(14px,2vw,22px); margin-top:44px; }
@media (max-width:720px){ .two{ grid-template-columns:1fr; } }
.amb{
  position:relative; overflow:hidden; border-radius:4px; border:1px solid var(--line-soft);
  min-height:clamp(280px,32vw,380px); display:flex; align-items:flex-end;
  background:linear-gradient(150deg,#C98B52,#A0492E 55%,#3A1B12);
}
.amb-img{
  position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:0;
  transition:scale .8s cubic-bezier(.2,.7,.3,1), filter .8s ease;
}
.amb::after{
  content:""; position:absolute; inset:0; z-index:1; pointer-events:none;
  background:linear-gradient(170deg, rgba(21,15,11,.30) 0%, rgba(21,15,11,.70) 55%, rgba(12,8,5,.92) 100%);
}
.amb:hover .amb-img{ scale:1.06; filter:saturate(1.1) brightness(1.04); }
.amb-in{ position:relative; z-index:2; padding:clamp(26px,3.6vw,40px); }
.amb .n{ font-family:var(--f-brand); font-size:10px; letter-spacing:.3em; text-transform:uppercase; color:var(--gold); margin:0 0 14px; }
.amb h3{ font-size:clamp(23px,3vw,31px); margin:0 0 12px; color:var(--cream); }
.amb p{ margin:0; color:rgba(244,233,218,.82); font-size:15px; }
```

- [ ] **Step 2: Reemplazar el HTML de las dos tarjetas**

Buscar:

```html
    <div class="two rise">
      <div class="amb">
        <p class="n">Ambiente 01</p>
        <h3>Terraza</h3>
        <p>Espacio cerrado, no a cielo abierto — la ciudad se ve completa a través de ventanales de piso a techo. Aquí aparece la magia: show de luces profesional, una barra grande, mesas en lounge y la consola del DJ. Es la zona que primero se llena; si vienes por el atardecer, reserva.</p>
      </div>
      <div class="amb">
        <p class="n">Ambiente 02</p>
        <h3>Interior</h3>
        <p>Mesa puesta, luz cálida y música al volumen justo para oírse sin levantar la voz. Para cenar sin prisa, para una mesa larga, o para cuando Cuenca decide llover.</p>
      </div>
    </div>
```

Reemplazar por:

```html
    <div class="two rise">
      <div class="amb">
        <img class="amb-img" src="img/ambiente-terraza.webp" alt="Terraza de NILA ROOFTOP" loading="lazy">
        <div class="amb-in">
          <p class="n">Ambiente 01</p>
          <h3>Terraza</h3>
          <p>Espacio cerrado, no a cielo abierto — la ciudad se ve completa a través de ventanales de piso a techo. Aquí aparece la magia: show de luces profesional, una barra grande, mesas en lounge y la consola del DJ. Es la zona que primero se llena; si vienes por el atardecer, reserva.</p>
        </div>
      </div>
      <div class="amb">
        <img class="amb-img" src="img/ambiente-interior.webp" alt="Interior de NILA ROOFTOP" loading="lazy">
        <div class="amb-in">
          <p class="n">Ambiente 02</p>
          <h3>Interior</h3>
          <p>Mesa puesta, luz cálida y música al volumen justo para oírse sin levantar la voz. Para cenar sin prisa, para una mesa larga, o para cuando Cuenca decide llover.</p>
        </div>
      </div>
    </div>
```

- [ ] **Step 3: Verificar con el servidor local**

Navegar a `http://localhost:5178/index.html#lugar`. Como las dos imágenes todavía no existen, `read_console_messages` va a mostrar dos 404 de imagen — es esperado en este punto del plan; confirmar que aun así las tarjetas se ven bien (degradado + texto legible, sin huecos rotos ni overflow). Tomar captura en desktop y con `resize_window` a 375px de ancho para confirmar que las tarjetas se apilan en una columna y no generan scroll horizontal.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Rediseña Ambiente 01/02 como tarjetas con foto de fondo

Deja listos los nombres de archivo img/ambiente-terraza.webp e
img/ambiente-interior.webp; mientras no existan se ve el degradado
de respaldo, no un hueco roto.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

- [ ] **Step 5 (cuando el dueño mande las fotos): reemplazarlas y verificar**

Guardar los dos archivos reales en `img/ambiente-terraza.webp` e `img/ambiente-interior.webp` (mismo nombre, para no tocar el HTML otra vez), recargar `http://localhost:5178/index.html#lugar`, confirmar con `read_network_requests` que ambas responden 200, tomar captura, y commitear solo esos dos binarios:

```bash
git add img/ambiente-terraza.webp img/ambiente-interior.webp
git commit -m "Agrega las fotos reales de Terraza e Interior

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Unificar "La carta" a la paleta oscura + limpiar el placeholder residual

**Files:**
- Modify: `index.html` (HTML — quitar `class="light"` de la sección y los dos bloques `.ph-t`; CSS — recolorear `.dish p` y `.dish .tagline`)

**Interfaces:**
- Consumes: nada nuevo.
- Produces: nada que otra tarea use; es autocontenida.
- **Nota:** esto es solo el bloque de vista previa de 2 platos dentro de `index.html` (sección `#carta`). La página completa de la carta (`carta.html`) ya está en paleta oscura desde antes — no se toca.

- [ ] **Step 1: Quitar la clase `light` de la sección**

Buscar:

```html
<!-- ════════ CARTA ════════ -->
<section class="section light" id="carta">
```

Reemplazar por:

```html
<!-- ════════ CARTA ════════ -->
<section class="section" id="carta">
```

- [ ] **Step 2: Recolorear el texto y el tagline de los platos**

Buscar (bloque `/* ───────────── CARTA ───────────── */`):

```css
.dish h3{ font-size:clamp(20px,2.4vw,26px); margin:18px 0 5px; }
.dish p{ margin:0; color:#5C4636; font-size:14.5px; }
.dish .tagline{ font-family:var(--f-script); font-size:26px; color:var(--terra); line-height:1; margin:0 0 2px; }
```

Reemplazar por:

```css
.dish h3{ font-size:clamp(20px,2.4vw,26px); margin:18px 0 5px; }
.dish p{ margin:0; color:var(--muted); font-size:14.5px; }
.dish .tagline{ font-family:var(--f-script); font-size:26px; color:var(--gold); line-height:1; margin:0 0 2px; }
```

(`#5C4636` era un marrón pensado para texto sobre fondo claro — sobre el fondo oscuro sería casi ilegible. `var(--muted)` es el mismo tono que usa el resto del sitio para texto secundario sobre oscuro. El tagline pasa de `--terra` a `--gold` para que tenga el mismo contraste que los demás textos en script del sitio, como `.hero-tag` y `.carta-foto .cap`.)

- [ ] **Step 3: Quitar el placeholder "Foto pendiente" (residual, nunca se muestra)**

Buscar:

```html
        <div class="shot"><img src="img/plato-risotto.webp" alt="Risotto anticuchero de NILA ROOFTOP" loading="lazy"><div class="ph-t"><span>Foto pendiente</span><b>img/plato-risotto.webp</b></div></div>
```

Reemplazar por:

```html
        <div class="shot"><img src="img/plato-risotto.webp" alt="Risotto anticuchero de NILA ROOFTOP" loading="lazy"></div>
```

Y buscar:

```html
        <div class="shot"><img src="img/plato-ensalada.webp" alt="Ensalada de pollo de NILA ROOFTOP" loading="lazy"><div class="ph-t"><span>Foto pendiente</span><b>img/plato-ensalada.webp</b></div></div>
```

Reemplazar por:

```html
        <div class="shot"><img src="img/plato-ensalada.webp" alt="Ensalada de pollo de NILA ROOFTOP" loading="lazy"></div>
```

(Este `<div class="ph-t">` solo se muestra cuando `.shot` tiene además la clase `ph`, que estos dos platos nunca tuvieron — las fotos reales ya existen en `img/`. Era markup muerto que quedó de una plantilla genérica.)

- [ ] **Step 4: Verificar con el servidor local**

Navegar a `http://localhost:5178/index.html#carta`. Con `read_page` confirmar que ya no aparece el texto "Foto pendiente" en ningún lado del documento. Tomar captura para confirmar que el fondo de la sección ahora es oscuro (igual que "El lugar" y "Promos"), que el texto de los platos se lee bien, y que el tagline dorado tiene buen contraste.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Unifica la seccion La carta a la paleta oscura del sitio

Tambien quita el markup muerto 'Foto pendiente' que nunca se
mostraba (las fotos reales ya existian).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Bloque de testimonios (prueba social)

**Files:**
- Modify: `index.html` (CSS — nuevo bloque `TESTIMONIOS`; HTML — nueva sección entre "Eventos corporativos" y "Reserva"; JS — agregar `.testi-grid` a la lista `REJILLAS`)

**Interfaces:**
- Consumes: `.section`, `.eyebrow`, `.h2`, `.lede`, `.rise` ya existentes.
- Produces: clases nuevas `.testi-grid`, `.testi`, `.quote-mark`, `.autor` (usadas solo acá).

- [ ] **Step 1: Agregar el CSS**

Insertar justo antes de `/* ── Eventos corporativos ── */` (buscar esa línea exacta) este bloque nuevo:

```css
/* ───────────── TESTIMONIOS ───────────── */
.testi-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr)); gap:1px; margin-top:44px; background:var(--line-soft); border:1px solid var(--line-soft); }
.testi{ background:var(--ground-2); padding:clamp(28px,3.6vw,38px); display:flex; flex-direction:column; gap:16px; }
.testi .quote-mark{ font-family:var(--f-script); font-size:44px; line-height:.6; color:var(--gold); }
.testi .txt{ margin:0; color:var(--text); font-size:16px; line-height:1.6; text-wrap:pretty; }
.testi .autor{ display:flex; align-items:baseline; justify-content:space-between; gap:10px; flex-wrap:wrap; }
.testi .autor b{ font-family:var(--f-brand); font-weight:400; font-size:13px; letter-spacing:.04em; color:var(--sand); }
.testi .autor span{ font-size:12px; color:var(--faint); }
```

- [ ] **Step 2: Agregar la sección HTML**

Buscar (cierre de "Eventos corporativos" y apertura de "Reserva"):

```html
    </div>
  </div>
</section>

<!-- ════════ RESERVA ════════ -->
```

Reemplazar por:

```html
    </div>
  </div>
</section>

<!-- ════════ TESTIMONIOS ════════ -->
<section class="section" id="testimonios">
  <div class="wrap">
    <p class="eyebrow rise">Lo que dicen</p>
    <h2 class="h2 rise titulo">Cuencanos que ya subieron.</h2>
    <p class="lede rise">Extracto real de nuestras reseñas en <a href="https://maps.app.goo.gl/pejtRUZ2eF2BZgEW6" target="_blank" rel="noopener" style="color:var(--sand)">Google · 4,1 ★ 112 opiniones</a>.</p>

    <div class="testi-grid rise">
      <article class="testi">
        <span class="quote-mark" aria-hidden="true">&ldquo;</span>
        <p class="txt">Buena ubicación, ambiente acogedor y agradable, hay música en vivo y/o eventos especiales por temporadas. Ideal para compartir con amigos.</p>
        <div class="autor"><b>Patty Reivan</b><span>Google · Local Guide</span></div>
      </article>
      <article class="testi">
        <span class="quote-mark" aria-hidden="true">&ldquo;</span>
        <p class="txt">Excelente servicio, comida variada, vista espectacular de la ciudad y la seguridad es prioritaria en el local.</p>
        <div class="autor"><b>Felipe Zamora</b><span>Google</span></div>
      </article>
    </div>
  </div>
</section>

<!-- ════════ RESERVA ════════ -->
```

**Nota de transparencia para el dueño (revisar antes del commit):** las dos citas son las reseñas reales elegidas, con una limpieza mínima de puntuación (se sacó el emoji 👍 de la de Felipe y se corrigió "amig@s" → "amigos" y "evento especiales" → "eventos especiales" en la de Patty) sin cambiar nada del sentido. Si preferís dejarlas exactamente como están escritas en Google, avisá antes del Step 4 y se revierte esa limpieza.

- [ ] **Step 3: Agregar `.testi-grid` a la animación en cascada**

Buscar en el `<script>` final:

```js
  const REJILLAS = ['.facts', '.two', '.dishes', '.servicios', '.cards', '.rules', '.hours'];
```

Reemplazar por:

```js
  const REJILLAS = ['.facts', '.two', '.dishes', '.servicios', '.cards', '.rules', '.hours', '.testi-grid'];
```

- [ ] **Step 4: Verificar con el servidor local**

Navegar a `http://localhost:5178/index.html#testimonios`. Con `get_page_text` confirmar las dos citas y los dos nombres. Tomar captura en desktop y en 375px (`resize_window`) para confirmar que las tarjetas se apilan en una columna sin overflow. Confirmar con `read_console_messages` que no hay errores nuevos.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Agrega seccion de testimonios con 2 resenas reales de Google

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Info práctica en "Horarios" (vestimenta, edad, acceso)

**Files:**
- Modify: `index.html` (HTML — agregar bloque dentro de `#visita`; CSS — nueva clase `.practica`)

**Interfaces:**
- Consumes: nada nuevo.
- Produces: clase `.practica` (nueva, usada solo acá). No se reutiliza `.rules` porque esa clase está pensada para la sección oscura de Reservas — sus colores (`var(--muted)`, `var(--text)`) son casi invisibles sobre el fondo claro de `#visita`. `.practica` usa los mismos tonos que ya usa `.hours` en esta misma sección clara (`#5C4636`, `var(--ink)`).

- [ ] **Step 1: Agregar el CSS**

Buscar (bloque `/* ───────────── VISITA ───────────── */`), después de la última regla de `.hours` y antes de `.aviso`:

```css
.hours .h{ font-variant-numeric:tabular-nums; }
.hours .h.cerrado{ color:#9B8776; font-style:italic; }
.aviso{
```

Reemplazar por:

```css
.hours .h{ font-variant-numeric:tabular-nums; }
.hours .h.cerrado{ color:#9B8776; font-style:italic; }
.practica{ list-style:none; padding:0; margin:24px 0 0; }
.practica li{ display:flex; flex-wrap:wrap; gap:6px 12px; padding:12px 0; border-top:1px solid rgba(42,29,20,.12); font-size:14.5px; color:#5C4636; }
.practica li:last-child{ border-bottom:1px solid rgba(42,29,20,.12); }
.practica b{ color:var(--ink); font-weight:500; font-family:var(--f-brand); letter-spacing:.04em; flex:0 0 120px; }
.aviso{
```

- [ ] **Step 2: Agregar el bloque HTML**

Buscar:

```html
      <ul class="hours rise" id="hours"></ul>
      <p class="aviso" id="hours-aviso" hidden></p>
      <p class="note" style="color:#7A6250">Los horarios de días especiales y feriados se anuncian en Instagram.</p>
```

Reemplazar por:

```html
      <ul class="hours rise" id="hours"></ul>
      <p class="aviso" id="hours-aviso" hidden></p>
      <p class="note" style="color:#7A6250">Los horarios de días especiales y feriados se anuncian en Instagram.</p>

      <p style="margin:26px 0 10px;font-family:var(--f-brand);font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--terra)">Antes de venir</p>
      <ul class="practica rise">
        <li><b>Vestimenta</b> Semi-formal, smart casual.</li>
        <li><b>Edad</b> A partir de las 11:00 pm, ingreso solo a mayores de 18 años.</li>
        <li><b>Acceso</b> Ascensor al último piso del Cardeca Business Center.</li>
      </ul>
```

- [ ] **Step 3: Agregar `.practica` a la animación en cascada**

Buscar (ya editado en el Task 4, así que la línea actual es):

```js
  const REJILLAS = ['.facts', '.two', '.dishes', '.servicios', '.cards', '.rules', '.hours', '.testi-grid'];
```

Reemplazar por:

```js
  const REJILLAS = ['.facts', '.two', '.dishes', '.servicios', '.cards', '.rules', '.hours', '.testi-grid', '.practica'];
```

- [ ] **Step 4: Verificar con el servidor local**

Navegar a `http://localhost:5178/index.html#visita`. Con `get_page_text` confirmar que aparecen "Vestimenta", "Semi-formal, smart casual", "18 años" y "Ascensor al último piso". Tomar captura para confirmar que el texto se lee bien sobre el fondo claro (mismo tono que la tabla de horarios, no el tono claro que se usa sobre fondo oscuro).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Agrega vestimenta, edad minima y nota de acceso en Horarios

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: Verificación final y push

**Files:** ninguno (solo verificación de conjunto)

- [ ] **Step 1: Verificación visual completa de las 4 páginas afectadas por el orden del scroll**

Con el servidor local corriendo, navegar a `http://localhost:5178/index.html` desde arriba y hacer scroll completo hasta el pie, confirmando visualmente el orden: Hero → Nosotros → El lugar (con las 2 tarjetas de Ambiente) → La carta (oscura) → Promos → Corporativos → Testimonios → Reserva → Horarios (con info práctica) → Contacto → Sigue explorando → Pie. Confirmar que `carta.html`, `eventos.html` y `galeria.html` siguen intactos (no deberían tener cambios; solo abrir cada uno y confirmar que cargan 200 sin diferencias).

- [ ] **Step 2: Revisar consola y red**

Con `read_console_messages` confirmar 0 errores nuevos. Con `read_network_requests` filtrando `ambiente-` confirmar el estado de esas dos imágenes (404 si el dueño todavía no mandó las fotos — esperado en ese caso; 200 si ya se hizo el Step 5 del Task 2).

- [ ] **Step 3: Push**

```bash
git push
```

- [ ] **Step 4: Confirmar el deploy automático**

Avisar al dueño que el push disparó el deploy automático en Vercel (el repo es público, así que no hace falta re-autorizar nada), y ofrecer verificar con una petición HTTP directa a `https://nilarooftop.com` una vez que el deployment esté `READY`, igual que en verificaciones anteriores de esta misma conversación.
