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

/* ---------- SPLASH CANVAS SHADER VISUALIZER ---------- */
function initSplashVisualizer() {
  const canvas = document.getElementById('splash-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.warn('WebGL not supported on this browser.');
    return;
  }

  // Vertex Shader: Fullscreen Quad
  const vsSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment Shader: Fluid Plasma Aurora mapped to theme colors
  const fsSource = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * snoise(st);
        st *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      st.x *= u_resolution.x / u_resolution.y;

      vec2 mouseNorm = u_mouse / u_resolution;

      vec2 q = vec2(0.0);
      q.x = fbm(st + 0.05 * u_time);
      q.y = fbm(st + vec2(1.0));

      vec2 r = vec2(0.0);
      r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time + mouseNorm.x * 0.2);
      r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.12 * u_time + mouseNorm.y * 0.2);

      float f = fbm(st + r);

      // Color Palette mapping (#0A0A0C, #5C63A0, #A9B4F5, #8FD4A8)
      vec3 c1 = vec3(0.039, 0.039, 0.047); 
      vec3 c2 = vec3(0.360, 0.388, 0.627); 
      vec3 c3 = vec3(0.662, 0.705, 0.960); 
      vec3 c4 = vec3(0.560, 0.831, 0.658); 

      vec3 color = mix(c1, c2, clamp(f * f * 4.0, 0.0, 1.0));
      color = mix(color, c3, clamp(length(q), 0.0, 1.0));
      color = mix(color, c4, clamp(length(r.x), 0.0, 1.0));

      float distFromCenter = distance(gl_FragCoord.xy / u_resolution.xy, vec2(0.5));
      float alpha = smoothstep(0.8, 0.2, distFromCenter);

      gl_FragColor = vec4(color * (f * 1.5 + 0.2), alpha * 0.85);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1, -1,  1,
    -1,  1,  1, -1,  1,  1,
  ]), gl.STATIC_DRAW);

  const posLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(posLocation);
  gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

  const resLoc = gl.getUniformLocation(program, 'u_resolution');
  const timeLoc = gl.getUniformLocation(program, 'u_time');
  const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = window.innerHeight - e.clientY;
  });

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  let startTime = performance.now();

  function render() {
    const currentTime = (performance.now() - startTime) * 0.001;

    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, currentTime);
    gl.uniform2f(mouseLoc, mouseX, mouseY);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  render();
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderTicker();
  renderReports();
  initSplashVisualizer();
});
