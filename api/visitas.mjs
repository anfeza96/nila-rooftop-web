// Contador de visitas del sitio (función de Vercel).
// Guarda un único número en Upstash Redis: no hay IP, ni cookies, ni ningún dato de quien visita.
//   GET  /api/visitas  → { total }            (solo lee)
//   POST /api/visitas  → { total }            (suma 1 y devuelve el nuevo total)
// Cada navegador cuenta una vez al día; eso lo decide el script del pie de página.
const CLAVE = 'nila:visitas';

async function redis(comando) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('falta la base de datos');
  const r = await fetch(`${url}/${comando}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!r.ok) throw new Error('redis ' + r.status);
  return Number((await r.json()).result) || 0;
}

const responde = (total, estado = 200) => new Response(JSON.stringify({ total }), {
  status: estado,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export async function GET() {
  try { return responde(await redis(`get/${CLAVE}`)); } catch { return responde(null, 503); }
}

export async function POST(request) {
  // Solo suma si la petición viene del propio sitio; lo demás solo lee.
  const mismoSitio = request.headers.get('sec-fetch-site') === 'same-origin';
  try { return responde(await redis(`${mismoSitio ? 'incr' : 'get'}/${CLAVE}`)); } catch { return responde(null, 503); }
}
