// Serves the Seekho 2 Wheeler static site (Hostinger Node.js web app). No dependencies.
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const ROOT = __dirname, PORT = process.env.PORT || 3000;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.json': 'application/json' };
const HIDDEN = new Set(['server.js', 'package.json', 'README.md', 'redirects.txt']);
// Old site addresses (from .htaccess "Redirect 301 /old /new") keep working.
const REDIRECTS = {};
try { fs.readFileSync(path.join(ROOT, 'redirects.txt'), 'utf8').split('\n').forEach(l => { const m = l.match(/^Redirect 301 (\S+) (\S+)/); if (m) REDIRECTS[m[1].replace(/\/$/, '')] = m[2]; }); } catch (e) {}
const TEXT = new Set(['.html', '.css', '.js', '.svg', '.xml', '.txt', '.json']);
function send(res, file, code, req) {
  const ext = path.extname(file);
  const ae = (req && req.headers['accept-encoding']) || '';
  const enc = TEXT.has(ext) ? (/\bbr\b/.test(ae) ? 'br' : /\bgzip\b/.test(ae) ? 'gzip' : '') : '';
  const h = {};
  if (enc) { h['Content-Encoding'] = enc; h['Vary'] = 'Accept-Encoding'; }
  res.writeHead(code, { ...h, 'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : (ext === '.css' || ext === '.js') ? 'public, max-age=31536000, immutable' : 'public, max-age=2592000' });
  const st = fs.createReadStream(file);
  if (enc === 'br') st.pipe(zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } })).pipe(res);
  else if (enc === 'gzip') st.pipe(zlib.createGzip({ level: 6 })).pipe(res);
  else st.pipe(res);
}
http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(req.url.split('?')[0]); } catch { p = '/'; }
  const r = REDIRECTS[p.replace(/\/$/, '')];
  if (r) { res.writeHead(301, { Location: r }); return res.end(); }
  const f = path.normalize(path.join(ROOT, p));
  if (!f.startsWith(ROOT) || p.includes('/.') || HIDDEN.has(path.basename(f))) return send(res, path.join(ROOT, '404.html'), 404, req);
  fs.stat(f, (e, s) => {
    if (!e && s.isFile()) return send(res, f, 200, req);
    if (!e && s.isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' }); return res.end(); }
      const i = path.join(f, 'index.html');
      if (fs.existsSync(i)) return send(res, i, 200, req);
    }
    send(res, path.join(ROOT, '404.html'), 404, req);
  });
}).listen(PORT, () => console.log('Seekho site on ' + PORT));
