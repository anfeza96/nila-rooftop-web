# Herramientas y respaldo del sitio NILA ROOFTOP

Todo lo necesario para mantener el sitio vive en este repo. Nada depende de
carpetas temporales ni del disco de una computadora en particular.

## Carpetas

| Carpeta | Qué hay | ¿Se publica en el sitio? |
|---|---|---|
| raíz (`*.html`, `img/`, `video/`) | El sitio en sí | Sí |
| `herramientas/` | Scripts para generar y probar el sitio | No |
| `fuentes/` | Originales en mayor calidad (fotos, flyers, videos) | No |
| `archivo/` | Historial: primera versión del sitio, intento con React, scripts ya aplicados | No |
| `marca/` | Logo original editable (`.ai`) | No |

Lo que no se publica está listado en `.vercelignore`. El repo es público en
GitHub, así que todo lo de aquí se puede ver ahí.

## Cambiar la carta (precios, platos, textos)

`carta.html` es un archivo **generado**: nunca se edita a mano.

1. Editar `carta-data.json` (datos) o `herramientas/carta-template.html` (diseño y JavaScript).
2. Desde la raíz del repo: `node herramientas/armar-carta.js`
3. Probar con el servidor local, hacer commit y push. Vercel publica solo.

## Galería

`galeria.html` muestra un mosaico de 60 fotos (`img/galeria/mini/` y `img/galeria/fotos/`).
Las filas se generan con `node herramientas/armar-galeria.js galeria.html`; cómo sumar
fotos está en `img/galeria/LEEME.txt`.

## Temporada navideña (pestaña "Cenas navideñas")

La página `cenas-navidenas.html` y su pestaña roja en el menú son de temporada.

- `node herramientas/temporada-navidad.js ocultar`: quita la pestaña del menú de todas las páginas, apaga sus estilos (el menú vuelve a ser el de siempre) y hace que `/cenas-navidenas` lleve a la portada.
- `node herramientas/temporada-navidad.js mostrar`: la vuelve a poner tal cual.
- `node herramientas/temporada-navidad.js estado`: dice cómo está.

Después de ocultar o mostrar: revisar en local, commit y push. La página y sus fotos (`img/navidad/`) se quedan en el repositorio para el año siguiente.
Las fotos de `img/navidad/` tienen tres tamaños (480, 720 y 900 px; las de 2025, 400 y 720) y la página deja que el navegador elija.

## Probar el sitio en local

Abrir los `.html` con doble clic (`file://`) da resultados falsos.

- `node herramientas/servidor.js` → http://localhost:5178
- `node herramientas/servidor-headers.js` → http://localhost:5190, con los headers de seguridad de `vercel.json`. Usarlo antes de cambiar la CSP.

## Espejo en Claude (Artifact)

`node herramientas/unir.js` arma en `herramientas/salida-artefacto/` la versión
de una sola página que se publica como Artifact en claude.ai.

## Seguridad (`vercel.json`)

La CSP permite scripts inline (`'unsafe-inline'`) a propósito: cada página tiene
su JavaScript inline y con hashes, cualquier cambio de JS sin actualizar el hash
dejaría la carta en blanco en producción. Si se agrega un recurso externo nuevo
(otra fuente, un mapa embebido, analítica), hay que sumarlo a la CSP o el
navegador lo bloqueará.

## Pendientes conocidos

- **Clover Club** (carta, Coctelería clásica): tiene los mismos ingredientes que el Old Fashioned. Falta la receta real.
- **`og:url`**: no está en ninguna página; ahora que existe el dominio, se puede agregar `https://nilarooftop.com/…`.
