// Sirve el sitio aplicando los headers de vercel.json, para probar cambios de CSP antes de desplegar.
// Uso: node herramientas/servidor-headers.js  → http://localhost:5190
const http = require('http');
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(RAIZ, 'vercel.json'), 'utf8'));
// En http://localhost, upgrade-insecure-requests fuerza https y rompe la prueba; en producción (ya https) no cambia nada.
const cabeceras = config.headers.find(h => h.source === '/(.*)').headers.map(h =>
  h.key === 'Content-Security-Policy' ? { key: h.key, value: h.value.replace(/;\s*upgrade-insecure-requests/, '') } : h);

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.js': 'text/javascript',
  '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8'
};

http.createServer((req, res) => {
  cabeceras.forEach(h => res.setHeader(h.key, h.value));
  let ruta = decodeURIComponent(req.url.split('?')[0]);
  if (ruta.endsWith('/')) ruta += 'index.html';
  const archivo = path.join(RAIZ, path.normalize(ruta));
  if (!archivo.startsWith(RAIZ)) { res.writeHead(403); return res.end(); }
  fs.stat(archivo, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('404'); }
    const tipo = TIPOS[path.extname(archivo).toLowerCase()] || 'application/octet-stream';
    const rango = req.headers.range;
    if (rango) {
      const [a, b] = rango.replace('bytes=', '').split('-');
      const ini = parseInt(a, 10), fin = b ? parseInt(b, 10) : st.size - 1;
      res.writeHead(206, { 'Content-Type': tipo, 'Content-Range': `bytes ${ini}-${fin}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': fin - ini + 1 });
      return fs.createReadStream(archivo, { start: ini, end: fin }).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': tipo, 'Content-Length': st.size, 'Accept-Ranges': 'bytes' });
    fs.createReadStream(archivo).pipe(res);
  });
}).listen(5190, () => console.log('servidor con headers de vercel.json en http://localhost:5190'));
