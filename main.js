/* ---------- MOBILE NAV ---------- */
function toggleMobileNav(){
  const panel = document.getElementById('mobilePanel');
  if(panel) panel.classList.toggle('open');
}

/* ---------- TICKER ---------- */
const tickerData = [
  {sym:'NIFTY 50', px:'24,812.40', chg:'+0.62%', up:true},
  {sym:'SENSEX', px:'81,204.15', chg:'+0.58%', up:true},
  {sym:'BANK NIFTY', px:'52,340.80', chg:'-0.21%', up:false},
  {sym:'TCS', px:'4,128.60', chg:'+1.14%', up:true},
  {sym:'RELIANCE', px:'2,945.30', chg:'-0.34%', up:false},
  {sym:'HDFC BANK', px:'1,742.90', chg:'+0.45%', up:true},
  {sym:'INFY', px:'1,872.10', chg:'+0.88%', up:true},
  {sym:'S&P 500', px:'6,142.75', chg:'+0.29%', up:true},
  {sym:'NASDAQ', px:'20,318.40', chg:'-0.15%', up:false},
  {sym:'CRUDE OIL', px:'74.62', chg:'-1.02%', up:false},
];
function renderTicker(){
  const track = document.getElementById('tickerTrack');
  if(!track) return;
  const build = () => tickerData.map(t => `
    <div class="ticker-item">
      <span class="sym">${t.sym}</span>
      <span class="px">${t.px}</span>
      <span class="chg ${t.up ? 'up' : 'down'}">${t.chg}</span>
    </div>`).join('');
  track.innerHTML = build() + build(); // duplicate for seamless loop
}

/* ---------- PROJECT CARD EXPAND ---------- */
function toggleCard(btn){
  const card = btn.closest('.project-card');
  const wasOpen = card.classList.contains('open');
  card.parentElement.querySelectorAll('.project-card.open').forEach(c => c.classList.remove('open'));
  if(!wasOpen) card.classList.add('open');
}

/* ---------- REPORTS LIBRARY ---------- */
const reportData = [
  {title:'Indian IT Services Sector Report', sub:'Initiation of coverage — full sector', sector:'sector', sectorLabel:'Sector Research', date:'2026-08-14', status:'live', body:'A sector-wide initiation covering valuation, margin trends, and demand outlook across major listed IT services firms.'},
  {title:'EV Supply Chain Thesis', sub:'Thematic research note', sector:'sector', sectorLabel:'Sector Research', date:'2026-07-02', status:'live', body:'Thematic mapping of the Indian EV and battery supply chain, screening for pure-play and second-order beneficiaries.'},
  {title:'Consumer Retail Coverage Note', sub:'Single-stock deep dive', sector:'equity', sectorLabel:'Equity Research', date:'2026-06-20', status:'live', body:'Earnings and valuation note on a leading Indian consumer retail name, with a modelled 12-month price target.'},
  {title:'Banking &amp; NBFC Q1 Review', sub:'Quarterly sector update', sector:'sector', sectorLabel:'Sector Research', date:'2026-09-10', status:'soon', body:'Coming soon.'},
  {title:'Pharma Export Themes', sub:'Thematic research note', sector:'sector', sectorLabel:'Sector Research', date:'2026-09-18', status:'soon', body:'Coming soon.'},
  {title:'Auto OEM Coverage Initiation', sub:'Multi-stock coverage', sector:'equity', sectorLabel:'Equity Research', date:'2026-09-25', status:'soon', body:'Coming soon.'},
];

let activeFilter = 'all';

function renderReports(){
  const searchEl = document.getElementById('reportSearch');
  const table = document.getElementById('reportTable');
  if(!table) return;
  const q = searchEl ? searchEl.value.toLowerCase() : '';
  table.querySelectorAll('.report-row:not(.hdr)').forEach(r => r.remove());

  reportData
    .filter(r => activeFilter === 'all' || r.sector === activeFilter)
    .filter(r => r.title.toLowerCase().includes(q))
    .forEach((r) => {
      const row = document.createElement('div');
      row.className = 'report-row';
      const actionHtml = r.status === 'live'
        ? `<button onclick="openModal(${reportData.indexOf(r)})">View</button><a href="#" onclick="event.preventDefault()">Download</a>`
        : `<span class="badge-soon">Coming soon</span>`;
      row.innerHTML = `
        <div class="r-title">${r.title}<span class="r-sub">${r.sub}</span></div>
        <div class="r-sector">${r.sectorLabel}</div>
        <div class="r-date mono">${r.date}</div>
        <div class="r-actions">${actionHtml}</div>
      `;
      table.appendChild(row);
    });
}

function filterReports(type, btn){
  activeFilter = type;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderReports();
}
function searchReports(){ renderReports(); }

/* ---------- MODAL ---------- */
function openModal(idx){
  const r = reportData[idx];
  document.getElementById('modalTitle').innerHTML = r.title;
  document.getElementById('modalMeta').textContent = r.sectorLabel + ' · ' + r.date;
  document.getElementById('modalBody').textContent = r.body;
  document.getElementById('reportModal').classList.add('open');
}
function closeModal(){
  const modal = document.getElementById('reportModal');
  if(modal) modal.classList.remove('open');
}
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderTicker();
  renderReports();
});
