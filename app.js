const app = document.querySelector('#app');
const sideNav = document.querySelector('#side-nav');
const breadcrumb = document.querySelector('#breadcrumb');
const sidebar = document.querySelector('.sidebar');
const menuButton = document.querySelector('#menu-button');
let catalog = [];

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);
const courseUrl = (id) => `#/ders/${encodeURIComponent(id)}`;
const icon = (course) => `<span class="subject-icon ${escapeHtml(course.color)}">${escapeHtml(course.short)}</span>`;
const badges = (groups) => `<div class="badges">${groups.map((group) => `<span class="badge">${escapeHtml(group)}</span>`).join('')}</div>`;

function renderNav(activeId) {
  sideNav.innerHTML = `<a class="nav-link ${activeId ? '' : 'active'}" href="#/"><span class="nav-icon">⌂</span><span class="nav-title">Genel Bakış</span></a>` +
    catalog.map((course) => `<a class="nav-link ${course.id === activeId ? 'active' : ''}" href="${courseUrl(course.id)}"><span class="nav-icon">${escapeHtml(course.short)}</span><span class="nav-title">${escapeHtml(course.title)}</span><span class="nav-count">${course.groups.length}</span></a>`).join('');
}

function courseCard(course) {
  return `<a class="course-card" href="${courseUrl(course.id)}" aria-label="${escapeHtml(course.title)} dersini aç">
    <div class="card-top">${icon(course)}<span class="card-arrow" aria-hidden="true">↗</span></div>
    <h3>${escapeHtml(course.title)}</h3>
    <p class="card-meta">${course.groups.length} grup · Ders ayrıntıları</p>
    ${badges(course.groups)}
  </a>`;
}

function renderHome() {
  const groupCount = catalog.reduce((sum, course) => sum + course.groups.length, 0);
  breadcrumb.textContent = 'GENEL BAKIŞ';
  renderNav();
  app.innerHTML = `<div class="hero"><div><div class="eyebrow">DERS VİZJA / AKADEMİK PANEL</div><h1>Derslerim, tek yerde.</h1><p class="intro">Derslerine ait hoca beklentilerini, puan sistemini ve ödevleri düzenli bir yerde takip et. Her dersin grup bilgisi yanında görünüyor.</p></div><div class="hero-art" aria-hidden="true"></div></div>
    <div class="stat-row"><div class="stat"><strong>${catalog.length}</strong><span>DERS</span></div><div class="stat"><strong>${groupCount}</strong><span>GRUP</span></div><div class="stat"><strong>4</strong><span>TAKİP ALANI</span></div></div>
    <div class="section-head"><div><h2>Ders listesi</h2><p>Bir derse girerek ayrıntılarını görüntüle.</p></div><input id="course-search" class="search" type="search" placeholder="Ders ara..." aria-label="Ders ara" /></div>
    <div id="course-grid" class="course-grid">${catalog.map(courseCard).join('')}</div>`;
  document.querySelector('#course-search').addEventListener('input', (event) => {
    const term = event.target.value.toLocaleLowerCase('tr').trim();
    const found = catalog.filter((course) => `${course.title} ${course.groups.join(' ')}`.toLocaleLowerCase('tr').includes(term));
    document.querySelector('#course-grid').innerHTML = found.length ? found.map(courseCard).join('') : '<div class="empty-search">Bu aramayla eşleşen ders bulunamadı.</div>';
  });
}

function textSection(text, emptyMessage) {
  return text ? `<p class="detail-copy">${escapeHtml(text)}</p>` : `<div class="empty-state">${emptyMessage}</div>`;
}

function listSection(items, emptyMessage, format) {
  return items?.length ? `<ul class="item-list">${items.map(format).join('')}</ul>` : `<div class="empty-state">${emptyMessage}</div>`;
}

async function renderCourse(course) {
  breadcrumb.textContent = course.title.toLocaleUpperCase('tr');
  renderNav(course.id);
  app.innerHTML = '<div class="empty-state">Ders bilgileri yükleniyor...</div>';
  try {
    const response = await fetch(`courses/${course.id}.json`);
    if (!response.ok) throw new Error('Ders dosyası okunamadı.');
    const data = await response.json();
    if (window.location.hash !== courseUrl(course.id)) return;
    app.innerHTML = `<a class="back-link" href="#/">← Tüm dersler</a>
      <div class="detail-header">${icon(course)}<div><div class="eyebrow">DERS DETAYI</div><h1>${escapeHtml(course.title)}</h1>${badges(course.groups)}</div></div>
      <div class="detail-grid">
        <section class="panel panel-wide"><div class="panel-label">01 / TAKİP</div><h2>Ödevler ve teslimler</h2>${listSection(data.assignments, 'Henüz ödev eklenmedi. Bu derse ait sohbetten ödev, son teslim tarihi ve durum bilgisi ekleyebilirsin.', (item) => `<li><span class="item-title">${escapeHtml(item.title)}</span>${item.description ? `<span class="item-sub">${escapeHtml(item.description)}</span>` : ''}${item.due ? `<span class="item-date">Teslim: ${escapeHtml(item.due)}</span>` : ''}${item.status ? `<span class="item-date">Durum: ${escapeHtml(item.status)}</span>` : ''}</li>`)}</section>
        <section class="panel"><div class="panel-label">02 / BEKLENTİLER</div><h2>Hocanın istedikleri</h2>${textSection(data.requirements, 'Dersin gereklilikleri henüz eklenmedi.')}</section>
        <section class="panel"><div class="panel-label">03 / DEĞERLENDİRME</div><h2>Puan sistemi</h2>${listSection(data.grading, 'Notlandırma bilgisi henüz eklenmedi.', (item) => `<li><span class="item-title">${escapeHtml(item.name)}${item.weight ? ` · ${escapeHtml(item.weight)}` : ''}</span>${item.note ? `<span class="item-sub">${escapeHtml(item.note)}</span>` : ''}</li>`)}</section>
        <section class="panel"><div class="panel-label">04 / BİLGİLER</div><h2>Ders notları</h2>${data.instructor ? `<p class="detail-copy"><strong>Hoca:</strong> ${escapeHtml(data.instructor)}</p>` : ''}${textSection(data.notes, 'Hoca, kaynaklar ve diğer önemli bilgiler henüz eklenmedi.')}</section>
      </div><p class="info-note">Bu sayfadaki bilgiler ilgili dersin ayrı veri dosyasından gelir. Yeni bilgi eklendikçe bu alanlar güncellenir.</p>`;
  } catch (error) {
    if (window.location.hash !== courseUrl(course.id)) return;
    app.innerHTML = `<a class="back-link" href="#/">← Tüm dersler</a><div class="error-panel">Ders bilgileri yüklenemedi. ${escapeHtml(error.message)}</div>`;
  }
}

function route() {
  sidebar.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  const match = /^#\/ders\/([a-z0-9-]+)$/.exec(window.location.hash);
  const course = match && catalog.find((item) => item.id === match[1]);
  if (course) renderCourse(course);
  else renderHome();
  window.scrollTo(0, 0);
}

menuButton.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
window.addEventListener('hashchange', route);

fetch('courses/index.json').then((response) => {
  if (!response.ok) throw new Error('Ders listesi okunamadı.');
  return response.json();
}).then((data) => {
  catalog = data;
  route();
}).catch((error) => {
  app.innerHTML = `<div class="error-panel">Ders listesi yüklenemedi. ${escapeHtml(error.message)}</div>`;
});
