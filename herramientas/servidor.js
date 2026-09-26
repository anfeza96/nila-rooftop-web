// Servidor local del sitio, sin headers extra.  Uso: node herramientas/servidor.js  → http://localhost:5178
// Abrir los .html con doble clic (file://) da resultados falsos; probar siempre con un servidor.
const http = require('http'), fs = require('fs'), path = require('path');
const RAIZ = path.resolve(__dirname, '..');
const TIPOS = {'.html':'text/html; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.json':'application/json','.txt':'text/plain','.webp':'image/webp','.mp4':'video/mp4','.webm':'video/webm','.svg':'image/svg+xml'};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(RAIZ, p);
  if (!f.startsWith(RAIZ)) { res.writeHead(403); return res.end('no'); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, {'Content-Type': TIPOS[path.extname(f).toLowerCase()] || 'application/octet-stream'});
    res.end(d);
  });
}).listen(5178, () => console.log('servidor en http://localhost:5178'));
