// Mobile menu, scroll reveal, and the WhatsApp booking form.
(function () {
  var b = document.querySelector('.burger'), n = document.querySelector('.nav');
  if (b && n) b.addEventListener('click', function () { n.classList.toggle('open'); b.setAttribute('aria-expanded', n.classList.contains('open')); });

  // Stagger children of .stagger and split hero headline into animated words.
  document.querySelectorAll('.stagger').forEach(function (g) { Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--d', (Math.min(i, 8) * 0.09) + 's'); }); });
  document.querySelectorAll('h1.words').forEach(function (h) {
    var i = 0;
    (function walk(n) { Array.prototype.slice.call(n.childNodes).forEach(function (c) {
      if (c.nodeType === 3) { var f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(function (t) {
        if (!t) return; if (/^\s+$/.test(t)) { f.appendChild(document.createTextNode(t)); return; }
        var o = document.createElement('span'); o.className = 'w'; var x = document.createElement('span'); x.textContent = t; x.style.setProperty('--i', i++); o.appendChild(x); f.appendChild(o); });
        n.replaceChild(f, c); } else if (c.nodeType === 1) walk(c); }); })(h);
  });
  // Gentle parallax on the hero photo.
  var hp = document.querySelector('.xhero picture img');
  if (hp && !matchMedia('(prefers-reduced-motion: reduce)').matches) window.addEventListener('scroll', function () { var y = window.scrollY; if (y < 900) hp.style.translate = '0 ' + (y * 0.25) + 'px'; }, { passive: true });

  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  } else els.forEach(function (e) { e.classList.add('in'); });

  // Doorstep price (same rule as Business Desk): up to 2 km 4500, up to 3 km 5000, then a straight line to 8000 at 10 km (rounded to 100); none above 10 km.
  function doorFee(v) { return v <= 2 ? 4500 : v <= 3 ? 5000 : Math.round((5000 + (v - 3) / 7 * 3000) / 100) * 100; }
  var km = document.getElementById('km'), out = document.getElementById('kmout');
  if (km && out) km.addEventListener('input', function () {
    var v = parseFloat(km.value);
    if (isNaN(v) || v < 0) { out.textContent = '—'; return; }
    if (v > 10) { out.textContent = 'Not available'; return; }
    var p = doorFee(v);
    out.textContent = '₹' + p.toLocaleString('en-IN');
  });

  // Pre-select course or centre from the link (?course=… or ?branch=…).
  var q = new URLSearchParams(location.search), names = { 'basic-scooty': 'Basic Scooty', 'advanced-scooty': 'Advanced Scooty', 'bike-training': 'Bike Training', 'doorstep-training': 'Doorstep Training', 'rto-preparation': 'RTO Test Preparation',
    'tollygunge': 'Tollygunge', 'rabindra-sarovar': 'Rabindra Sarovar', 'patuli': 'Patuli', 'new-town': 'New Town', 'barasat': 'Barasat', 'sodepur': 'Sodepur', 'howrah': 'Howrah' };
  var fc = document.getElementById('f-course'), fb = document.getElementById('f-branch');
  if (fc && names[q.get('course')]) fc.value = names[q.get('course')];
  if (fb && names[q.get('branch')]) fb.value = names[q.get('branch')];
  if (fc && fb && q.get('course') === 'doorstep-training') fb.value = 'Doorstep (my home)';

  var f = document.getElementById('book');
  if (f) f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var d = new FormData(f), lines = ['Hi Seekho 2 Wheeler, I want to book training.'];
    [['name', 'Name'], ['phone', 'Phone'], ['course', 'Course'], ['branch', 'Centre'], ['time', 'Preferred time'], ['note', 'Note']].forEach(function (k) {
      var v = (d.get(k[0]) || '').toString().trim(); if (v) lines.push(k[1] + ': ' + v);
    });
    window.open('https://wa.me/919748481630?text=' + encodeURIComponent(lines.join('\n')), '_blank');
  });

  // Rails (courses, reviews): arrow buttons scroll one card.
  document.querySelectorAll('[data-rail]').forEach(function (b) {
    b.addEventListener('click', function () {
      var r = document.getElementById('rail-' + b.dataset.rail); if (!r) return;
      var c = r.firstElementChild; r.scrollBy({ left: (c ? c.offsetWidth + 18 : 300) * +b.dataset.dir, behavior: 'smooth' });
    });
  });

  // Centre list -> map.
  var map = document.getElementById('cmap'), det = document.getElementById('cdet');
  document.querySelectorAll('.clist button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.clist button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      var cn = document.getElementById('cname'); if (cn) cn.textContent = b.dataset.name;
      if (map) map.src = 'https://www.google.com/maps?q=' + encodeURIComponent(b.dataset.q) + '&z=15&output=embed';
      if (det) det.href = '/branches/' + b.dataset.slug + '/';
    });
  });

  // Doorstep slider.
  var kr = document.getElementById('kmr'), kp = document.getElementById('kmp'), kv = document.getElementById('kmv');
  if (kr) { var upd = function () { var v = +kr.value; kv.textContent = v + ' km'; kr.style.setProperty('--p', (v * 10) + '%'); kp.textContent = '₹' + doorFee(v).toLocaleString('en-IN'); }; kr.addEventListener('input', upd); upd(); }

  // Count-up numbers.
  var cs = document.querySelectorAll('[data-count]');
  if (cs.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) {
      if (!e.isIntersecting) return; co.unobserve(e.target);
      var el = e.target, to = +el.dataset.count, plain = el.hasAttribute('data-plain'), from = plain ? to - 8 : 0, t0 = null, suf = el.textContent.replace(/[0-9,]/g, '');
      (function step(t) { t0 = t0 || t; var k = Math.min(1, (t - t0) / 1400), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
        el.textContent = (plain ? String(v) : v.toLocaleString('en-IN')) + suf; if (k < 1) requestAnimationFrame(step); })(performance.now());
    }); }, { threshold: .5 });
    cs.forEach(function (c) { co.observe(c); });
  }

  // Hero photo slider.
  var sl = document.querySelectorAll('.xhero .sl'), dots = document.querySelectorAll('.sdots button'), cur = 0, tmr;
  function go(n) { sl[cur].classList.remove('on'); dots[cur] && dots[cur].classList.remove('on'); cur = (n + sl.length) % sl.length; sl[cur].classList.add('on'); dots[cur] && dots[cur].classList.add('on'); }
  if (sl.length > 1) { tmr = setInterval(function () { go(cur + 1); }, 5500);
    dots.forEach(function (d, i) { d.addEventListener('click', function () { clearInterval(tmr); go(i); }); }); }

  // Rails: progress bar + mouse drag.
  document.querySelectorAll('.rail').forEach(function (r) {
    var bar = document.getElementById('bar-' + r.id.replace('rail-', ''));
    function upd() { if (!bar) return; var m = r.scrollWidth - r.clientWidth; bar.style.width = (m > 0 ? Math.max(12, (r.clientWidth / r.scrollWidth) * 100 + (r.scrollLeft / m) * (100 - (r.clientWidth / r.scrollWidth) * 100)) : 100) + '%'; }
    r.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
    var down = false, sx = 0, sl0 = 0, moved = false;
    r.addEventListener('mousedown', function (e) { down = true; moved = false; sx = e.pageX; sl0 = r.scrollLeft; r.classList.add('drag'); });
    window.addEventListener('mouseup', function () { down = false; r.classList.remove('drag'); });
    r.addEventListener('mousemove', function (e) { if (!down) return; var dx = e.pageX - sx; if (Math.abs(dx) > 5) moved = true; r.scrollLeft = sl0 - dx; });
    r.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
})();

/* Month-end offer (owner, 25 Nov 2026): floating "Offer" pill bottom-left; tap opens the poster.
   Shows only from FROM to TO (India date), never on /book/ or /app/. To end early, set TO to an earlier date. */
(function () {
  var O = { id: 'monthend-2026-11', from: '2026-11-25', to: '2026-11-30', poster: '/assets/img/offers/s2w-monthend-nov2026.jpg?v=1' };
  var p = location.pathname;
  if (p.indexOf('/book') === 0 || p.indexOf('/app') === 0) return;
  var today = new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);
  if (today < O.from || today > O.to) return;
  function st(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  var css = '.ofr{position:fixed;left:14px;bottom:14px;z-index:65;font-family:inherit}' +
    '.ofr-pill{display:flex;align-items:center;gap:10px;border:0;cursor:pointer;background:#e5254d;color:#fff;border-radius:999px;padding:11px 16px 11px 13px;font:800 15px/1.15 inherit;text-align:left;box-shadow:0 10px 28px rgba(229,37,77,.45),0 0 0 3px #fff;animation:ofr-in .5s cubic-bezier(.2,.8,.2,1) both}' +
    '.ofr-pill b{display:block;font-size:15px;letter-spacing:.02em}.ofr-pill small{display:block;font-weight:700;font-size:12.5px;opacity:.92}' +
    '.ofr-dot{position:relative;width:11px;height:11px;border-radius:50%;background:#ffc514;flex:none}.ofr-dot:after{content:"";position:absolute;inset:-5px;border-radius:50%;border:2px solid #ffc514;animation:ofr-ping 1.6s ease-out infinite}' +
    '.ofr-x{position:absolute;top:-9px;right:-9px;width:24px;height:24px;border-radius:50%;border:0;background:#fff;color:#082a6b;font-size:16px;line-height:1;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25)}' +
    '.ofr-bg{position:fixed;inset:0;z-index:90;background:rgba(8,20,45,.72);display:flex;align-items:center;justify-content:center;padding:16px;animation:ofr-fade .25s both}' +
    '.ofr-card{position:relative;width:min(440px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.4);animation:ofr-pop .3s cubic-bezier(.2,.8,.2,1) both}' +
    '.ofr-card img{display:block;width:100%;height:auto}.ofr-acts{display:grid;gap:8px;padding:12px}' +
    '.ofr-acts a{display:flex;justify-content:center;align-items:center;gap:8px;padding:13px;border-radius:12px;font-weight:800;text-decoration:none;font-size:16px}' +
    '.ofr-wa{background:#19b45a;color:#fff}.ofr-call{background:#082a6b;color:#fff}' +
    '.ofr-close{position:sticky;top:10px;float:right;margin:10px 10px -44px 0;width:34px;height:34px;border-radius:50%;border:0;background:rgba(8,20,45,.75);color:#fff;font-size:22px;line-height:1;cursor:pointer;z-index:2}' +
    '@keyframes ofr-in{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}@keyframes ofr-ping{from{transform:scale(.5);opacity:.8}to{transform:scale(1.7);opacity:0}}' +
    '@keyframes ofr-fade{from{opacity:0}}@keyframes ofr-pop{from{transform:translateY(12px) scale(.96);opacity:0}}' +
    '@media (prefers-reduced-motion:reduce){.ofr-pill,.ofr-bg,.ofr-card,.ofr-dot:after{animation:none}}';
  var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  var wa = 'https://wa.me/919748481630?text=' + encodeURIComponent('Hi Seekho 2 Wheeler, I want the Month End Offer (₹3000 instead of ₹4000). Please share the details.');
  var root = document.createElement('div'); root.className = 'ofr';
  root.innerHTML = '<button class="ofr-pill" type="button" aria-haspopup="dialog"><span class="ofr-dot" aria-hidden="true"></span><span><b>OFFER · Flat ₹1000 off</b><small>Month end · till 30 Nov</small></span></button>' +
    '<button class="ofr-x" type="button" aria-label="Hide offer">×</button>';
  document.body.appendChild(root);
  var bg = null;
  function close() { if (bg) { bg.remove(); bg = null; } }
  function open() {
    st('ofr-seen:' + O.id, '1');
    bg = document.createElement('div'); bg.className = 'ofr-bg';
    bg.innerHTML = '<div class="ofr-card" role="dialog" aria-modal="true" aria-label="Month End Offer: flat ₹1000 off, ₹4000 now ₹3000, till 30 November">' +
      '<button class="ofr-close" type="button" aria-label="Close">×</button><img src="' + O.poster + '" alt="Seekho 2 Wheeler Month End Offer: flat ₹1000 off on scooty and bike training, ₹4000 now ₹3000, valid till 30th November" width="1080" height="1350">' +
      '<div class="ofr-acts"><a class="ofr-wa" href="' + wa + '" target="_blank" rel="noopener">Claim on WhatsApp</a><a class="ofr-call" href="tel:+919748481630">Call 97484 81630</a></div></div>';
    bg.addEventListener('click', function (e) { if (e.target === bg || e.target.className === 'ofr-close') close(); });
    document.body.appendChild(bg);
  }
  root.querySelector('.ofr-pill').addEventListener('click', open);
  root.querySelector('.ofr-x').addEventListener('click', function () { root.remove(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  if (!st('ofr-seen:' + O.id)) setTimeout(function () { if (!bg && document.visibilityState === 'visible') open(); }, 6000);
})();
