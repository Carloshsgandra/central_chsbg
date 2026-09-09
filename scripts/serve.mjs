import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const port = Number(process.env.PORT || 4173);
const cloudOrigin = new URL(process.env.NETLIFY_SITE_URL || 'https://javaduolingochg.netlify.app').origin;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp' };

createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname.startsWith('/.netlify/identity') || pathname === '/api/progress') {
    try {
      const headers = new Headers();
      Object.entries(request.headers).forEach(([name, value]) => {
        if (value !== undefined && !['host', 'connection', 'content-length', 'accept-encoding'].includes(name)) headers.set(name, Array.isArray(value) ? value.join(', ') : value);
      });
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const body = chunks.length ? Buffer.concat(chunks) : undefined;
      const upstream = await fetch(new URL(`${requestUrl.pathname}${requestUrl.search}`, cloudOrigin), {
        method: request.method,
        headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : body,
        redirect: 'manual',
      });
      const responseHeaders = {};
      upstream.headers.forEach((value, name) => {
        if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(name)) responseHeaders[name] = value;
      });
      response.writeHead(upstream.status, responseHeaders);
      response.end(Buffer.from(await upstream.arrayBuffer()));
    } catch (error) {
      response.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify({ error: `Serviço remoto indisponível: ${error.message}` }));
    }
    return;
  }

  let target = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!target.startsWith(`${root}${sep}`) && target !== resolve(root, 'index.html')) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(await readFile(target));
  } catch {
    response.writeHead(200, { 'Content-Type': types['.html'], 'Cache-Control': 'no-cache' });
    response.end(await readFile(resolve(root, 'index.html')));
  }
}).listen(port, '127.0.0.1', () => console.log(`JavaFlow disponível em http://127.0.0.1:${port}`));
