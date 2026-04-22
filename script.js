const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

let all = [], activeTag = 'all', q = '';

async function init() {
  all = await fetch('links.json').then(r => r.json());
  buildTags();
  render();
}

/* ── Tags ── */
function buildTags() {
  const counts = {};
  all.forEach(l => l.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const wrap = document.getElementById('tags');
  wrap.innerHTML = '';
  wrap.appendChild(tagBtn('all', 'Tudo', all.length));
  sorted.forEach(([t, n]) => wrap.appendChild(tagBtn(t, t.replace('#', ''), n)));
}

function tagBtn(value, label, count) {
  const b = document.createElement('button');
  b.className = 'tag-btn' + (value === activeTag ? ' active' : '');
  b.innerHTML = `${label}<span class="tag-btn-count">${count}</span>`;
  b.onclick = () => {
    activeTag = value;
    document.querySelectorAll('.tag-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    render();
  };
  return b;
}

/* ── Render ── */
function render() {
  const sq = q.toLowerCase();
  const filtered = all.filter(l => {
    const mt = activeTag === 'all' || l.tags.includes(activeTag);
    const mq = !sq
      || l.title.toLowerCase().includes(sq)
      || (l.description || '').toLowerCase().includes(sq)
      || l.tags.some(t => t.toLowerCase().includes(sq));
    return mt && mq;
  });

  const countEl = document.getElementById('count');
  if (countEl) countEl.textContent = `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`;

  const main = document.getElementById('main');

  if (!filtered.length) {
    main.innerHTML = '<div class="empty">Nenhum resultado encontrado.</div>';
    return;
  }

  /* group by year + month, descending */
  const groups = {};
  filtered.forEach(l => {
    const d = new Date(l.addedAt + 'T12:00:00');
    const k = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    if (!groups[k]) groups[k] = { year: d.getFullYear(), month: d.getMonth(), items: [] };
    groups[k].items.push(l);
  });

  main.innerHTML = '';
  Object.keys(groups).sort().reverse().forEach(k => {
    const { year, month, items } = groups[k];
    const sec = document.createElement('div');
    sec.className = 'month-group';
    sec.innerHTML = `
      <div class="month-header">
        <span class="month-label">${MONTHS[month]} · ${year}</span>
        <div class="month-line"></div>
        <span class="month-count">${items.length} ${items.length === 1 ? 'item' : 'itens'}</span>
      </div>
      <div class="masonry"></div>
    `;
    const grid = sec.querySelector('.masonry');
    items.forEach(l => grid.appendChild(makeCard(l)));
    main.appendChild(sec);
  });
}

/* ── Helpers ── */
const GENERIC_TAGS = new Set(['professional','open-source','self-hosted','tools','reference','tutorial','content','marketing']);

function unsplashUrl(tags, title) {
  const keywords = tags
    .map(t => t.replace('#', ''))
    .filter(t => !GENERIC_TAGS.has(t))
    .slice(0, 3);
  if (!keywords.length) keywords.push(title.split(' ')[0]);
  return `https://source.unsplash.com/800x450/?${encodeURIComponent(keywords.join(','))}`;
}

function grad(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (id.charCodeAt(i) + ((h << 5) - h)) | 0;
  const hue = ((h >>> 0) % 300) + 20;
  const hue2 = (hue + 70) % 360;
  return `linear-gradient(140deg, hsl(${hue},42%,18%) 0%, hsl(${hue2},32%,9%) 100%)`;
}

function host(url) {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return ''; }
}

function gradFallback(id, title, domain) {
  const g = grad(id);
  return `
    <div class="card-nothumb">
      <div class="nt-bg" style="background:${g}"></div>
      <div class="nt-grain"></div>
      <div class="nt-scrim"></div>
      <div class="nt-title-bg">${title}</div>
      <span class="nt-domain">${domain}</span>
    </div>`;
}

window.onImgErr = (img, id, title, domain) => {
  img.closest('.card-img-wrap').outerHTML = gradFallback(id, title, domain);
};

function makeCard(l) {
  const a = document.createElement('a');
  a.className = 'card';
  a.href = l.url;
  a.target = '_blank';
  a.rel = 'noopener';

  const domain = host(l.url);
  const safeTitle = l.title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  const safeDomain = domain.replace(/'/g, "\\'");

  const thumbSrc = l.thumbnail || unsplashUrl(l.tags, l.title);

  let media = `<div class="card-img-wrap">
    <img class="card-img" src="${thumbSrc}" alt="${l.title}" loading="lazy"
      onerror="onImgErr(this,'${l.id}','${safeTitle}','${safeDomain}')">
  </div>`;

  const pills = l.tags.slice(0, 3).map(t =>
    `<span class="pill">${t.replace('#', '')}</span>`
  ).join('');

  a.innerHTML = `${media}
    <div class="card-body">
      <div class="card-title">${l.title}</div>
      ${l.description ? `<div class="card-desc">${l.description}</div>` : ''}
      <div class="card-footer">
        <div class="card-pills">${pills}</div>
        <span class="card-arrow">↗</span>
      </div>
    </div>`;

  return a;
}

document.getElementById('search').addEventListener('input', e => {
  q = e.target.value;
  render();
});

init();
