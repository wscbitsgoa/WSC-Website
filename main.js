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

/* ---------- SPLASH CANVAS SHADER VISUALIZER (RESPONSIVE MESH GRADIENT) ---------- */
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

  // Fragment Shader: Multi-point Interactive Mesh Gradient
  const fsSource = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    // Simplex Noise Function
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
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

    void main() {
      // Normalized UV coordinates
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      vec2 mouseNorm = u_mouse / u_resolution;

      // Mouse displacement field (Cursor influence)
      vec2 mouseOffset = st - mouseNorm;
      float mouseDist = length(mouseOffset);
      float mouseInfluence = smoothstep(0.4, 0.0, mouseDist);
      
      // Warp coordinates based on cursor proximity and organic noise
      vec2 warp = vec2(
        snoise(st * 2.0 + vec2(u_time * 0.15, 0.0)),
        snoise(st * 2.0 + vec2(0.0, u_time * 0.15))
      ) * 0.15;

      st += warp + (mouseOffset * mouseInfluence * 0.25);

      // Mesh Control Points (Orbiting Mesh Color Nodes)
      vec2 p1 = vec2(0.2 + 0.15 * sin(u_time * 0.3), 0.3 + 0.2 * cos(u_time * 0.2));
      vec2 p2 = vec2(0.8 + 0.1 * cos(u_time * 0.25), 0.7 + 0.15 * sin(u_time * 0.35));
      vec2 p3 = vec2(0.3 + 0.2 * cos(u_time * 0.4), 0.8 + 0.1 * sin(u_time * 0.2));
      vec2 p4 = vec2(0.7 + 0.15 * sin(u_time * 0.2), 0.2 + 0.2 * cos(u_time * 0.3));

      // Direct Cursor Color Point (attaches a mesh point to mouse position)
      vec2 pMouse = mouseNorm;

      // Calculate smooth influence weights for mesh nodes
      float w1 = 1.0 / (distance(st, p1) + 0.1);
      float w2 = 1.0 / (distance(st, p2) + 0.1);
      float w3 = 1.0 / (distance(st, p3) + 0.1);
      float w4 = 1.0 / (distance(st, p4) + 0.1);
      float wMouse = 1.0 / (distance(st, pMouse) + 0.15);

      // Color Palette (#0A0A0C, #5C63A0, #A9B4F5, #8FD4A8)
      vec3 c1 = vec3(0.039, 0.039, 0.047); // Dark base background
      vec3 c2 = vec3(0.360, 0.388, 0.627); // Deep accent
      vec3 c3 = vec3(0.662, 0.705, 0.960); // Light primary accent
      vec3 c4 = vec3(0.560, 0.831, 0.658); // Mint highlight accent

      // Blend colors based on inverse distance weights
      float totalWeight = w1 + w2 + w3 + w4 + wMouse;
      vec3 finalColor = (c1 * 0.5 + c2 * w1 + c3 * w2 + c4 * w3 + c2 * w4 + c3 * (wMouse * 0.8)) / totalWeight;

      // Subtle vignette towards edges
      float vignette = smoothstep(1.2, 0.2, length(st - vec2(0.5)));

      gl_FragColor = vec4(finalColor * vignette, 0.92);
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

  let targetMouseX = window.innerWidth / 2;
  let targetMouseY = window.innerHeight / 2;
  let currentMouseX = targetMouseX;
  let currentMouseY = targetMouseY;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = window.innerHeight - e.clientY; // Invert Y for WebGL coordinates
  });

  // Responsive Canvas Resize
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

    // Smooth cursor interpolation (Ease-out effect)
    currentMouseX += (targetMouseX - currentMouseX) * 0.08;
    currentMouseY += (targetMouseY - currentMouseY) * 0.08;

    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, currentTime);
    gl.uniform2f(mouseLoc, currentMouseX, currentMouseY);

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
