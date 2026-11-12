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

  // Doorstep price: up to 3 km 4500, +500 per extra km (rounded up), max 8000, none above 10 km.
  var km = document.getElementById('km'), out = document.getElementById('kmout');
  if (km && out) km.addEventListener('input', function () {
    var v = parseFloat(km.value);
    if (isNaN(v) || v < 0) { out.textContent = '—'; return; }
    if (v > 10) { out.textContent = 'Not available'; return; }
    var p = v <= 3 ? 4500 : Math.min(8000, 4500 + Math.ceil(v - 3) * 500);
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
  if (kr) { var upd = function () { var v = +kr.value; kv.textContent = v + ' km'; kp.textContent = '₹' + (v <= 3 ? 4500 : Math.min(8000, 4500 + (v - 3) * 500)).toLocaleString('en-IN'); }; kr.addEventListener('input', upd); upd(); }

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
})();
