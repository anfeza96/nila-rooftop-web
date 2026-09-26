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
- **Galería**: acepta fotos `img/galeria/01.jpg` … `12.jpg`; hoy no hay ninguna (ver `img/galeria/LEEME.txt`).
- **`og:url`**: no está en ninguna página; ahora que existe el dominio, se puede agregar `https://nilarooftop.com/…`.
