// Serves the Seekho 2 Wheeler static site (Hostinger Node.js web app). No dependencies.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, PORT = process.env.PORT || 3000;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.json': 'application/json' };
const HIDDEN = new Set(['server.js', 'package.json', 'README.md']);
function send(res, file, code) {
  const ext = path.extname(file);
  res.writeHead(code, { 'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=604800' });
  fs.createReadStream(file).pipe(res);
}
http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(req.url.split('?')[0]); } catch { p = '/'; }
  const f = path.normalize(path.join(ROOT, p));
  if (!f.startsWith(ROOT) || p.includes('/.') || HIDDEN.has(path.basename(f))) return send(res, path.join(ROOT, '404.html'), 404);
  fs.stat(f, (e, s) => {
    if (!e && s.isFile()) return send(res, f, 200);
    if (!e && s.isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' }); return res.end(); }
      const i = path.join(f, 'index.html');
      if (fs.existsSync(i)) return send(res, i, 200);
    }
    send(res, path.join(ROOT, '404.html'), 404);
  });
}).listen(PORT, () => console.log('Seekho site on ' + PORT));
