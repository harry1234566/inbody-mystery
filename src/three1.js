/* ================= 3D 기본: 아이소메트릭 디오라마 ================= */
const stageEl = $('stage');
const MOBILE = matchMedia('(pointer:coarse)').matches || Math.min(innerWidth, innerHeight) < 560;
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, MOBILE ? 2 : 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 0);
stageEl.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-10,10,10,-10,0.1,300);
const CAM_DIR = new THREE.Vector3(1, 0.9, 1).normalize();
camera.position.copy(CAM_DIR).multiplyScalar(80); camera.lookAt(0,0,0); camera.updateMatrixWorld();

const hemi = new THREE.HemisphereLight(0xfffdf6, 0xe4dccb, 0.78); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1dc, 0.62);
sun.position.set(-9, 18, 6); sun.castShadow = true;
sun.shadow.mapSize.set(MOBILE ? 1024 : 2048, MOBILE ? 1024 : 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03; sun.shadow.radius = 4;
Object.assign(sun.shadow.camera, {left:-13,right:13,top:13,bottom:-13,near:1,far:60}); scene.add(sun); scene.add(sun.target);
const fill = new THREE.DirectionalLight(0xe8f0ff, 0.16); fill.position.set(10, 6, 12); scene.add(fill);

let W_ = 0, H_ = 0;
function resize(){ W_ = stageEl.clientWidth; H_ = stageEl.clientHeight; renderer.setSize(W_, H_, false); }
addEventListener('resize', resize); resize();

/* 재질·형상 캐시 */
const lin = hex => new THREE.Color(hex).convertSRGBToLinear();
const MATS = {};
function M(hex, rough=0.9, extra){ const k = hex + '|' + rough + (extra ? JSON.stringify(extra) : ''); if (MATS[k]) return MATS[k];
  const m = new THREE.MeshStandardMaterial({color:lin(hex), roughness:rough, metalness:0});
  if (extra){ if (extra.emissive){ m.emissive = lin(extra.emissive); m.emissiveIntensity = extra.ei || 0.6; } if (extra.opacity!=null){ m.transparent = true; m.opacity = extra.opacity; } if (extra.side) m.side = THREE.DoubleSide; }
  return MATS[k] = m; }
const GC = {}; const G = (k, f) => GC[k] || (GC[k] = f());
const box = (w,h,d) => G(`b${w},${h},${d}`, ()=>new THREE.BoxGeometry(w,h,d));
const cyl = (a,b,h,s=24) => G(`c${a},${b},${h},${s}`, ()=>new THREE.CylinderGeometry(a,b,h,s));
const sph = (r,a=24,b=18) => G(`s${r},${a},${b}`, ()=>new THREE.SphereGeometry(r,a,b));
function rbox(w,h,d,r=0.06){ return G(`r${w},${h},${d},${r}`, ()=>{
  const b = Math.max(0.004, Math.min(r, d/2-0.004, w/2-0.004, h/2-0.004));
  const sw = w-2*b, sh = h-2*b, rr = Math.max(0.0005, Math.min(r*0.6, sw/2-0.0005, sh/2-0.0005));
  const s = new THREE.Shape(), x0 = -sw/2, y0 = -sh/2;
  s.moveTo(x0+rr,y0); s.lineTo(x0+sw-rr,y0); s.quadraticCurveTo(x0+sw,y0,x0+sw,y0+rr); s.lineTo(x0+sw,y0+sh-rr); s.quadraticCurveTo(x0+sw,y0+sh,x0+sw-rr,y0+sh);
  s.lineTo(x0+rr,y0+sh); s.quadraticCurveTo(x0,y0+sh,x0,y0+sh-rr); s.lineTo(x0,y0+rr); s.quadraticCurveTo(x0,y0,x0+rr,y0);
  const g = new THREE.ExtrudeGeometry(s, {depth:Math.max(0.001,d-2*b), bevelEnabled:true, bevelThickness:b, bevelSize:b, bevelSegments:3, curveSegments:3});
  g.translate(0,0,-Math.max(0.001,d-2*b)/2); g.computeVertexNormals(); return g; }); }
function mesh(geo, mat, x=0,y=0,z=0, parent, shadow=true){ const m = new THREE.Mesh(geo, mat); m.position.set(x,y,z); m.castShadow = shadow; m.receiveShadow = true; (parent||world).add(m); return m; }
function grp(x=0,y=0,z=0,ry=0,parent){ const g = new THREE.Group(); g.position.set(x,y,z); g.rotation.y = ry; (parent||world).add(g); return g; }

/* 글씨 텍스처 (Noto Sans KR) */
const FONT = '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif';
function canvasTex(w, h, draw){ const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t; }
function rr(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }
/* lines: [[text, size(rel), weight, color]] */
function textPlane(w, h, bg, lines, opt={}){
  const S = 256, cw = Math.round(S*w), ch = Math.round(S*h);
  const t = canvasTex(cw, ch, (g)=>{
    if (bg){ g.fillStyle = bg; if (opt.radius){ rr(g,0,0,cw,ch,opt.radius*S); g.fill(); } else g.fillRect(0,0,cw,ch); }
    if (opt.bar){ g.fillStyle = opt.bar; g.fillRect(0,0,cw,Math.round(ch*0.08)); }
    const tot = lines.reduce((s,l)=>s + (l[1]||1)*S*0.22*1.35, 0); let y = (ch - tot)/2 + (opt.dy||0)*S;
    g.textAlign = opt.align || 'center'; g.textBaseline = 'middle';
    for (const [tx, sz=1, wt=500, col='#2a2f2b'] of lines){ let fs = sz*S*0.22; g.font = `${wt} ${fs}px ${FONT}`;
      while (g.measureText(tx).width > cw*0.9 && fs > 8){ fs -= 2; g.font = `${wt} ${fs}px ${FONT}`; }
      g.fillStyle = col; y += sz*S*0.22*1.35/2; g.fillText(tx, opt.align==='left' ? cw*0.06 : cw/2, y); y += sz*S*0.22*1.35/2; }
    if (opt.after) opt.after(g, cw, ch);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), new THREE.MeshBasicMaterial({map:t, transparent:!!opt.radius, toneMapped:false}));
  return m;
}

/* 바닥 타일 */
function tileTex(base, grout, n){ return canvasTex(1024, 1024, (g)=>{
  const s = 1024/4; g.fillStyle = grout; g.fillRect(0,0,1024,1024);
  const c = new THREE.Color(base);
  for (let i=0;i<4;i++) for (let j=0;j<4;j++){ const k = 1 + (((i*7+j*13+n)%5)-2)*0.006; g.fillStyle = `rgb(${Math.min(255,c.r*255*k)|0},${Math.min(255,c.g*255*k)|0},${Math.min(255,c.b*255*k)|0})`; g.fillRect(i*s+3, j*s+3, s-6, s-6); }
}); }

/* ================= 세계 ================= */
let world = null, RM = {W:16, D:12}, OB = [], HS = [], DOORS = {};
const OPEN = new Set();
function clearWorld(){ if (world) scene.remove(world); world = new THREE.Group(); scene.add(world); OB = []; HS = []; DOORS = {}; }
const block = (x0,z0,x1,z1) => OB.push({x0:Math.min(x0,x1), z0:Math.min(z0,z1), x1:Math.max(x0,x1), z1:Math.max(z0,z1)});
const blockC = (x,z,hw,hd) => block(x-hw, z-hd, x+hw, z+hd);

function shell(W, D, P){
  RM = {W, D}; const T = 0.32, H = 3.3;
  mesh(rbox(W+T*2+0.3, 0.55, D+T*2+0.3, 0.14), M(P.slab||'#e4d9c3'), -0.15,-0.275,-0.15, world, false);
  const ft = tileTex(P.floor, P.grout, W|0); ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(W/4, D/4);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({map:ft, roughness:0.95})); fl.rotation.x = -Math.PI/2; fl.position.y = 0.002; fl.receiveShadow = true; world.add(fl);
  // 앞쪽 턱
  mesh(rbox(W+T+0.12, 0.14, 0.2, 0.05), M(P.cap||'#eadbbd'), -T/2, 0.07, D/2+0.1, world, false);
  mesh(rbox(0.2, 0.14, D+T+0.12, 0.05), M(P.cap||'#eadbbd'), W/2+0.1, 0.07, -T/2, world, false);
  // 벽
  const wm = M(P.wall, 0.95);
  mesh(box(T, H, D+T), wm, -W/2-T/2, H/2, -T/2, world, false);
  mesh(box(W, H, T), wm, 0, H/2, -D/2-T/2, world, false);
  const wn = M(P.wain, 0.9), rl = M(P.rail||'#e3d3b3', 0.8);
  mesh(box(0.05, 1.0, D), wn, -W/2+0.025, 0.5, 0, world, false);
  mesh(box(W, 1.0, 0.05), wn, 0, 0.5, -D/2+0.025, world, false);
  mesh(rbox(0.1, 0.08, D, 0.02), rl, -W/2+0.05, 1.02, 0, world, false);
  mesh(rbox(W, 0.08, 0.1, 0.02), rl, 0, 1.02, -D/2+0.05, world, false);
  mesh(box(0.06, 0.1, D), M('#d9ccb3'), -W/2+0.03, 0.05, 0, world, false);
  mesh(box(W, 0.1, 0.06), M('#d9ccb3'), 0, 0.05, -D/2+0.03, world, false);
  // 벽 윗면 마감
  const cp = M(P.cap||'#eadbbd', 0.8);
  mesh(rbox(T+0.16, 0.16, D+T+0.16, 0.05), cp, -W/2-T/2, H+0.08, -T/2, world, false);
  mesh(rbox(W+T+0.16, 0.16, T+0.16, 0.05), cp, -T/2, H+0.08, -D/2-T/2, world, false);
  sun.target.position.set(0,0,0); sun.position.set(-9, 18, 6);
}
/* 벽에 붙이는 그룹: L = 왼쪽 벽(x=-W/2, u는 z), B = 뒤쪽 벽(z=-D/2, u는 x). 로컬 +z가 방 안쪽 */
function onWall(side, u, y){ const g = new THREE.Group(); if (side==='L'){ g.position.set(-RM.W/2+0.03, y, u); g.rotation.y = Math.PI/2; } else g.position.set(u, y, -RM.D/2+0.03); world.add(g); return g; }
const wallPt = (side, u, out) => side==='L' ? [-RM.W/2+out, u] : [u, -RM.D/2+out];

/* ---------- 소품 ---------- */
const WOOD = '#d9b98c', WOOD2 = '#c9a374', CREAM = '#f6f1e6', WHITE = '#fbfaf6', DARK = '#3a3f3c';
function plant(x, z, s=1, kind=0){
  const g = grp(x,0,z, (x*3+z)%6);
  const pot = new THREE.LatheGeometry([new THREE.Vector2(0,0), new THREE.Vector2(0.26*s,0), new THREE.Vector2(0.33*s,0.42*s), new THREE.Vector2(0.35*s,0.5*s), new THREE.Vector2(0.3*s,0.5*s), new THREE.Vector2(0,0.48*s)], 28);
  mesh(pot, M(kind===1 ? '#d99a73' : '#efe9de', 0.85), 0,0,0, g);
  mesh(cyl(0.29*s,0.29*s,0.02,24), M('#6b5240'), 0,0.47*s,0, g);
  const greens = ['#4e8a52','#68a05e','#3f7746','#7bb06a'];
  const n = kind===2 ? 14 : 10;
  for (let i=0;i<n;i++){ const a = i/n*Math.PI*2 + (i%3)*0.3, L = (kind===2 ? 0.9 : 0.7 + (i%4)*0.12)*s, tilt = 0.35 + (i%3)*0.22;
    const lg = grp(0, 0.45*s, 0, a, g); const piv = new THREE.Group(); piv.rotation.x = tilt; lg.add(piv);
    const leaf = mesh(sph(0.5, 14, 10), M(greens[i%4], 0.8), 0, L*0.55, 0, piv); leaf.scale.set(kind===2 ? 0.12*s : 0.22*s, L*0.55*2, 0.05*s); }
  if (kind===2) for (let i=0;i<5;i++) mesh(cyl(0.015*s,0.02*s,0.6*s,6), M('#5d7a4c'), Math.cos(i)*0.06, 0.75*s, Math.sin(i)*0.06, g);
  blockC(x, z, 0.4*s, 0.4*s); return g;
}
function sofa(x, z, ry, color='#9dbd8b', seats=3){
  const g = grp(x,0,z,ry); const c = M(color, 0.95), c2 = M(shade(color,-0.06), 0.95); const L = seats*0.8 + 0.3;
  mesh(rbox(L, 0.36, 0.9, 0.1), c2, 0,0.3,0, g);
  for (let i=0;i<seats;i++) mesh(rbox(0.78, 0.16, 0.74, 0.08), c, -L/2+0.15+0.4+i*0.8, 0.55, 0.06, g);
  mesh(rbox(L, 0.62, 0.24, 0.1), c, 0, 0.72, -0.36, g);
  [-1,1].forEach(sd=>mesh(rbox(0.22, 0.52, 0.9, 0.09), c, sd*(L/2-0.05), 0.5, 0, g));
  [-1,1].forEach(sx=>[-1,1].forEach(sz=>mesh(cyl(0.035,0.03,0.14,8), M(WOOD2), sx*(L/2-0.15), 0.07, sz*0.33, g)));
  return g;
}
function shade(hex, k){ const c = new THREE.Color(hex); const h = {}; c.getHSL(h); c.setHSL(h.h, h.s, Math.max(0, Math.min(1, h.l + k))); return '#' + c.getHexString(); }
function table(x, z, w, d, h=0.5, ry=0, top=WOOD){
  const g = grp(x,0,z,ry); mesh(rbox(w, 0.08, d, 0.03), M(top, 0.75), 0, h, 0, g);
  [-1,1].forEach(sx=>[-1,1].forEach(sz=>mesh(cyl(0.035,0.03,h,8), M(WOOD2), sx*(w/2-0.1), h/2, sz*(d/2-0.1), g))); return g;
}
function chair(x, z, ry, color='#7fae9a'){
  const g = grp(x,0,z,ry); mesh(rbox(0.5,0.08,0.5,0.03), M(color), 0,0.45,0, g); mesh(rbox(0.5,0.5,0.07,0.03), M(color), 0,0.72,-0.22, g);
  [-1,1].forEach(sx=>[-1,1].forEach(sz=>mesh(cyl(0.025,0.025,0.45,6), M(WOOD2), sx*0.2,0.22,sz*0.2, g))); return g;
}
function bookshelf(x, z, ry, w=1.4, h=1.9){
  const g = grp(x,0,z,ry); const fr = M(CREAM, 0.85);
  mesh(rbox(w, h, 0.42, 0.03), M('#efe6d4'), 0, h/2, 0, g);
  const rows = 4; const cols = ['#7fae9a','#d98c6a','#e9c46a','#7d98c4','#b5a1cf','#f1ede4','#94b88a'];
  for (let r=0;r<rows;r++){ const y = 0.12 + r*(h-0.2)/rows; mesh(box(w-0.08, 0.04, 0.38), M('#e3d6bd'), 0, y, 0.03, g);
    let xx = -w/2+0.12; let i = r*3; while (xx < w/2-0.16){ const bw = 0.08 + ((i*7)%4)*0.02, bh = 0.26 + ((i*5)%3)*0.05; mesh(box(bw, bh, 0.26), M(cols[i%cols.length]), xx+bw/2, y+0.02+bh/2, 0.05, g); xx += bw+0.015; i++; if (i%5===0) xx += 0.12; } }
  return g;
}
function tv(side, u, y, lines, color='#2e5f52'){
  const g = onWall(side, u, y); mesh(rbox(2.1, 1.25, 0.1, 0.05), M('#2d312f', 0.5), 0,0,0.06, g, false);
  const p = textPlane(1.94, 1.1, '#f4efe2', lines, {bar:color}); p.position.z = 0.115; g.add(p); return g;
}
function board(side, u, y, w, h, lines, opt={}){
  const g = onWall(side, u, y); mesh(rbox(w+0.12, h+0.12, 0.07, 0.03), M(opt.frame||WOOD, 0.8), 0,0,0.035, g, false);
  const p = textPlane(w, h, opt.bg||'#fbf7ee', lines, {bar:opt.bar, align:opt.align}); p.position.z = 0.075; g.add(p); return g;
}
function windowWall(side, u, y, w=2.2, h=1.6){
  const g = onWall(side, u, y);
  const t = canvasTex(512, 384, (c, cw, ch)=>{ const gr = c.createLinearGradient(0,0,0,ch); gr.addColorStop(0,'#dfeee9'); gr.addColorStop(1,'#f5f2e6'); c.fillStyle = gr; c.fillRect(0,0,cw,ch);
    [['#a9c99a',90,330,140],['#8fb985',260,350,170],['#b9d6a8',420,340,130]].forEach(([col,x,yy,r])=>{ c.fillStyle = col; c.beginPath(); c.arc(x,yy,r,0,Math.PI*2); c.fill(); }); });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({map:t, toneMapped:false})); glass.position.z = 0.02; g.add(glass);
  const fr = M(WHITE, 0.7);
  mesh(rbox(w+0.2, 0.12, 0.16, 0.03), fr, 0, h/2+0.06, 0.08, g, false); mesh(rbox(w+0.3, 0.1, 0.3, 0.03), fr, 0, -h/2-0.05, 0.14, g, false);
  [-1,1].forEach(sd=>mesh(rbox(0.1, h+0.2, 0.14, 0.03), fr, sd*(w/2+0.05), 0, 0.07, g, false)); mesh(box(0.05, h, 0.08), fr, 0,0,0.05, g, false);
  for (let i=0;i<6;i++) mesh(box(w+0.1, 0.035, 0.06), M('#f3efe6',0.8), 0, h/2-0.12-i*0.06, 0.12, g, false);
  return g;
}
function clock(side, u, y){ const g = onWall(side, u, y); const c = mesh(cyl(0.32,0.32,0.07,32), M(WHITE), 0,0,0.04, g, false); c.rotation.x = Math.PI/2;
  const rim = mesh(new THREE.TorusGeometry(0.32,0.035,8,32), M('#4d5a55'), 0,0,0.08, g, false);
  const h1 = mesh(box(0.03,0.18,0.01), M(DARK), 0,0.07,0.09, g, false); h1.rotation.z = -0.6; h1.position.set(0.05,0.06,0.09);
  const h2 = mesh(box(0.025,0.25,0.01), M(DARK), 0,0.1,0.095, g, false); h2.rotation.z = 0.9; h2.position.set(-0.09,0.06,0.095); return g; }
function dispenser(x, z, ry){ const g = grp(x,0,z,ry); mesh(rbox(0.5,1.05,0.5,0.06), M(WHITE), 0,0.53,0, g); mesh(rbox(0.36,0.2,0.08,0.03), M('#cfd8d6'), 0,0.8,0.26, g);
  mesh(cyl(0.2,0.22,0.5,24), M('#cfe6f0',0.2,{opacity:0.85}), 0,1.3,0, g); mesh(sph(0.025), M('#e05a4a'), -0.07,0.86,0.3, g); mesh(sph(0.025), M('#4a7fe0'), 0.07,0.86,0.3, g); blockC(x,z,0.35,0.35); return g; }
function rug(x, z, w, d, color){ const m = mesh(rbox(w, 0.025, d, 0.012), M(color, 1), x, 0.014, z, world, false); m.receiveShadow = true; return m; }
function inbodyMachine(g){
  mesh(rbox(0.9,0.12,1.0,0.05), M('#e9edee',0.6), 0,0.06,0, g);
  [-0.2,0.2].forEach(x=>mesh(rbox(0.28,0.02,0.48,0.02), M('#9aa6a6',0.4), x,0.13,0.12, g));
  mesh(rbox(0.22,1.0,0.2,0.05), M('#f2f4f3',0.6), 0,0.62,-0.38, g);
  mesh(rbox(0.85,0.42,0.28,0.06), M(WHITE,0.6), 0,1.28,-0.34, g);
  mesh(box(0.5,0.26,0.02), M('#2f6f5e',0.4,{emissive:'#2f6f5e',ei:0.35}), 0,1.32,-0.19, g);
  [-1,1].forEach(sd=>{ const h = mesh(cyl(0.035,0.035,0.38,10), M('#8c9796',0.4), sd*0.48,1.12,-0.18, g); h.rotation.x = Math.PI/2; });
}
function door(side, u, color, sign){
  const g = onWall(side, u, 0);
  mesh(rbox(1.5, 2.45, 0.12, 0.04), M('#e3d3b3', 0.8), 0, 1.22, 0.05, g, false);
  mesh(box(1.24, 2.26, 0.03), M('#5c5148'), 0, 1.13, 0.1, g, false);
  const piv = new THREE.Group(); piv.position.set(-0.62, 0, 0.12); g.add(piv);
  const pc = new THREE.MeshStandardMaterial({color:lin(color), roughness:0.85});
  mesh(rbox(1.22, 2.24, 0.07, 0.03), pc, 0.61, 1.12, 0, piv);
  mesh(rbox(0.7, 0.9, 0.02, 0.02), M(shade(color, 0.12)), 0.61, 1.45, 0.04, piv);
  const win = mesh(box(0.42, 0.34, 0.01), M('#e8f1ee', 0.3), 0.61, 1.62, 0.055, piv, false);
  mesh(sph(0.05), M('#e2c27a', 0.4), 1.05, 1.05, 0.08, piv);
  if (sign){ const p = textPlane(1.4, 0.34, color, [[sign, 1.05, 700, '#ffffff']], {radius:0.06}); p.position.set(0, 2.7, 0.08); g.add(p); }
  const pt = wallPt(side, u, 0); return {g, piv, side, u, open:0, x:pt[0], z:pt[1]};
}
