/* ================= 사람 (치비 스타일, 체형 연속 반영) ================= */
const SKINS = ['#fbe2cb','#f3cfae','#e5b892','#cf9a71','#a8714f','#7a4b33'];
const HAIRC = [['#2a2421','검정'],['#4b3427','흑갈색'],['#7a5236','갈색'],['#b08a5f','밝은 갈색'],['#6c6a66','반백'],['#a7a49e','회색'],['#ebe7df','흰머리'],['#8a3b22','적갈색']];
const HSTY = [['short','짧은'],['buzz','스포츠'],['part','가르마'],['swept','넘긴'],['bob','단발'],['perm','파마'],['bun','올림'],['pony','묶음'],['long','긴 머리'],['thin','숱 적은'],['bald','민머리']];
const FACE = [['round','둥근'],['oval','갸름'],['square','각진']];
const EYES = [['dot','동그란'],['smile','웃는'],['big','반짝'],['calm','차분한'],['lash','속눈썹']];
const BROWS = [['soft','부드러운'],['straight','일자'],['bold','진한']];
const MOUTH = [['smile','미소'],['grin','활짝'],['flat','담담']];
const GLASS = [['none','없음'],['round','둥근테'],['square','사각테'],['half','반무테']];
const BEARD = [['none','없음'],['mus','콧수염'],['goatee','턱수염'],['full','덥수룩']];
const HATS = [['none','없음'],['cap','야구모자'],['beanie','비니'],['bucket','벙거지']];
const TOPS = [['tee','티셔츠'],['cardigan','카디건'],['hoodie','후드'],['shirt','셔츠'],['vest','조끼']];
const BOTTOMS = [['pants','바지'],['skirt','치마'],['shorts','반바지']];
const TOPC = ['#3f7f6a','#e08a6a','#5b7fbf','#e9c46a','#8b72b8','#6b7280','#f1ece2','#c45b6a','#2f4858'];
const BOTC = ['#3b4455','#6b5b4e','#9aa5b1','#2f3e46','#c9b79c','#556b5a'];
const ACC = [['none','없음'],['cane','지팡이'],['bag','가방'],['scarf','목도리'],['earring','귀걸이'],['watch','시계']];
const SPOTS = [['none','없음'],['freckle','주근깨'],['mole','점']];
const clamp = (x,a,b) => Math.max(a, Math.min(b, x));

/* 입력값 → 체형 (BMI·허리둘레/키·키를 연속적으로 반영, 범주 낙인 없이) */
function bodyFrom(v){
  const sx = v.sex || 1, bmi = v.wt/((v.ht/100)**2);
  const w = Number.isFinite(bmi) ? clamp(1 + (bmi-22)*0.045, 0.84, 1.55) : 1;
  const whtr = Number.isFinite(v.wc) && Number.isFinite(v.ht) ? v.wc/v.ht : NaN;
  const belly = Number.isFinite(whtr) ? clamp((whtr-0.46)*3.4, 0, 0.62) : clamp((bmi-23)*0.06, 0, 0.55);
  const mean = CFG.means[sx] ? CFG.means[sx].ht : (sx===1 ? 171 : 158);
  const h = Number.isFinite(v.ht) ? clamp(v.ht/mean, 0.9, 1.1) : 1;
  return {w, belly: Number.isFinite(belly) ? belly : 0, h};
}

function makePerson(o){
  o = Object.assign({sex:1, skin:SKINS[1], hair:'#2a2421', style:'short', face:'round', eyes:'dot', brows:'soft', mouth:'smile', blush:true,
    glass:'none', beard:'none', hat:'none', top:'tee', topC:'#3f7f6a', bottom:'pants', botC:'#3b4455', acc:'none', spots:'none', wrinkle:false,
    body:{w:1, belly:0, h:1}, coat:false, hatC:'#e08a6a'}, o);
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const fem = o.sex===2, w = o.body.w, bel = o.body.belly;
  const skin = M(o.skin, 0.75), top = M(o.topC, 0.92), bot = M(o.botC, 0.92), dark = M('#2b2622', 0.6), hairM = M(o.hair, 0.85);
  const P = (x,y,z,parent=body) => [x,y,z,parent];
  const add = (geo, mat, x, y, z, parent=body) => { const m = new THREE.Mesh(geo, mat); m.position.set(x,y,z); m.castShadow = true; m.receiveShadow = false; parent.add(m); return m; };

  /* 몸통 */
  const rh = (fem ? 0.245 : 0.225)*w, rw = (fem ? 0.2 : 0.215)*w + bel*0.07, rc = (fem ? 0.215 : 0.235)*(0.88+0.12*w) + bel*0.02, rs = (fem ? 0.2 : 0.235)*(0.9+0.1*w);
  const prof = [[0,0.34],[rh*0.8,0.345],[rh,0.42],[rw,0.6],[rc,0.78],[rs,0.88],[0.1,0.95],[0,0.96]].map(p=>new THREE.Vector2(p[0],p[1]));
  const torsoMat = o.coat ? M('#fbfbf8', 0.85) : top;
  const torso = add(new THREE.LatheGeometry(prof, 28), torsoMat, 0,0,0); torso.scale.z = 0.8 + bel*0.15;
  const hip = add(new THREE.LatheGeometry([[0,0.32],[rh*0.85,0.325],[rh*1.03,0.42],[rh*0.99,0.5],[0,0.5]].map(p=>new THREE.Vector2(p[0],p[1])), 28), bot, 0,0,0); hip.scale.z = 0.82 + bel*0.12;
  if (bel > 0.05){ const b = add(sph(0.2 + bel*0.17, 20, 16), torsoMat, 0, 0.57, rw*0.42 + bel*0.05); b.scale.set(1.15, 0.95, 0.75); }
  if (fem){ const ch = add(sph(0.16, 16, 12), torsoMat, 0, 0.76, rc*0.45); ch.scale.set(1.3, 0.62, 0.55); }
  const front = (rw*0.82 + bel*0.12)*(0.8+bel*0.15);
  // 상의 디테일
  if (o.coat){ add(new THREE.LatheGeometry([[0,0.2],[rh*1.18,0.2],[rh*1.12,0.4],[rw*1.06,0.6],[0,0.6]].map(p=>new THREE.Vector2(p[0],p[1])), 28), M('#fbfbf8',0.85), 0,0,0).scale.z = 0.86;
    const inner = add(box(0.12, 0.3, 0.02), top, 0, 0.78, rc*0.8); add(box(0.09,0.05,0.02), M(o.badge||'#e08a6a'), 0.13, 0.76, rc*0.8);
    [-1,1].forEach(sd=>{ const l = add(box(0.06,0.3,0.02), M('#ecece6'), sd*0.08, 0.72, rc*0.78); l.rotation.z = sd*0.25; }); }
  else if (o.top==='cardigan'){ add(box(0.1, 0.42, 0.02), M('#f4f0e6'), 0, 0.68, front+0.005); [0.58,0.7,0.82].forEach(y=>add(sph(0.016,8,6), M('#e2c27a'), 0.07, y, front+0.02)); }
  else if (o.top==='hoodie'){ const hd = add(new THREE.TorusGeometry(0.15, 0.06, 10, 20), top, 0, 0.92, -0.08); hd.rotation.x = Math.PI/2.4; add(rbox(0.26,0.12,0.04,0.02), M(shade(o.topC,-0.06)), 0, 0.55, front);
    [-0.04,0.04].forEach(x=>add(cyl(0.008,0.008,0.14,6), M('#f4f0e6'), x, 0.82, front-0.01)); }
  else if (o.top==='shirt'){ [-1,1].forEach(sd=>{ const c = add(box(0.1,0.05,0.04), M('#fbfaf6'), sd*0.06, 0.93, 0.07); c.rotation.z = sd*-0.5; }); add(box(0.015,0.4,0.01), M(shade(o.topC,-0.1)), 0, 0.7, front); }
  else if (o.top==='vest'){ [-1,1].forEach(sd=>{ const v = add(box(0.05,0.3,0.02), M('#f4f0e6'), sd*0.05, 0.8, rc*0.82); v.rotation.z = sd*0.35; }); }
  else add(new THREE.TorusGeometry(0.085, 0.015, 6, 16), M(shade(o.topC,-0.08)), 0, 0.94, 0).rotation.x = Math.PI/2;
  add(cyl(0.065,0.07,0.12,12), skin, 0, 0.98, 0);

  /* 다리 */
  const legR = 0.075*(0.82+0.18*w), legs = [-1,1].map(sd=>{ const g = new THREE.Group(); g.position.set(sd*0.105*Math.min(w,1.25), 0.36, 0); root.add(g);
    if (o.bottom==='pants') add(cyl(legR, legR*0.92, 0.3, 12), bot, 0, -0.15, 0, g);
    else if (o.bottom==='shorts'){ add(cyl(legR*1.08, legR*1.05, 0.12, 12), bot, 0, -0.06, 0, g); add(cyl(legR*0.85, legR*0.8, 0.2, 12), skin, 0, -0.2, 0, g); }
    else add(cyl(legR*0.85, legR*0.8, 0.3, 12), M(shade(o.skin,-0.02),0.7), 0, -0.15, 0, g);
    const sh = add(rbox(0.15, 0.08, 0.24, 0.035), M(o.shoe||'#4a4440', 0.7), 0, -0.31, 0.035, g); return g; });
  if (o.bottom==='skirt'){ const sk = add(new THREE.LatheGeometry([[0,0.5],[rh*1.02,0.5],[rh*1.32,0.24],[0,0.24]].map(p=>new THREE.Vector2(p[0],p[1])), 28), bot, 0,0,0); sk.scale.z = 0.85; }

  /* 팔 */
  const armR = 0.058*(0.85+0.15*w);
  const arms = [-1,1].map(sd=>{ const g = new THREE.Group(); g.position.set(sd*(rs+0.035), 0.88, 0); body.add(g); g.userData.base = sd*(0.1 + 0.12*(w-1) + bel*0.12); g.rotation.z = g.userData.base;
    const sleeveC = o.coat ? M('#fbfbf8',0.85) : o.top==='vest' ? M('#f4f0e6') : top;
    if (o.top==='tee' && !o.coat){ add(cyl(armR*1.15, armR*1.1, 0.16, 12), sleeveC, 0, -0.08, 0, g); add(cyl(armR*0.85, armR*0.8, 0.22, 10), skin, 0, -0.26, 0, g); }
    else add(cyl(armR*1.05, armR*0.95, 0.36, 12), sleeveC, 0, -0.17, 0, g);
    add(sph(0.06, 12, 10), skin, 0, -0.38, 0, g);
    if (o.acc==='watch' && sd<0) add(box(0.07,0.04,0.09), M('#2d3a3a'), 0, -0.32, 0, g);
    return g; });

  /* 머리 */
  const head = new THREE.Group(); head.position.y = 1.23; body.add(head);
  const R = 0.37; const hs = {round:[1,0.97,0.97], oval:[0.93,1.05,0.95], square:[1.05,0.95,0.97]}[o.face] || [1,1,1];
  const skull = add(sph(R, 32, 24), skin, 0,0,0, head); skull.scale.set(...hs);
  const fz = R*hs[2]*0.93;
  [-1,1].forEach(sd=>{ const e = add(sph(0.065, 12, 10), skin, sd*R*hs[0]*0.97, -0.03, 0, head); e.scale.set(0.5,1,0.8); });
  add(sph(0.026, 10, 8), M(shade(o.skin,-0.06),0.7), 0, -0.075, fz+0.03, head);
  const eyesG = new THREE.Group(); head.add(eyesG);
  [-1,1].forEach(sd=>{ const x = sd*0.135, y = -0.01, z = fz;
    if (o.eyes==='smile'){ const t = add(new THREE.TorusGeometry(0.042, 0.012, 6, 14, Math.PI), dark, x, y-0.01, z, eyesG); t.scale.z = 0.5; }
    else if (o.eyes==='big'){ add(sph(0.06,14,10), M('#ffffff',0.4), x, y, z-0.01, eyesG).scale.set(1,1.15,0.45); add(sph(0.045,12,10), dark, x, y-0.005, z+0.012, eyesG).scale.set(1,1.15,0.45); add(sph(0.014,6,6), M('#ffffff',0.3), x+0.015, y+0.022, z+0.03, eyesG); }
    else if (o.eyes==='calm'){ add(sph(0.045,12,8), dark, x, y, z, eyesG).scale.set(1.1,0.4,0.4); }
    else { add(sph(0.042,12,10), dark, x, y, z, eyesG).scale.set(0.9,1.2,0.45); add(sph(0.012,6,6), M('#ffffff',0.3), x+0.012, y+0.02, z+0.02, eyesG);
      if (o.eyes==='lash'){ const l = add(box(0.03,0.01,0.01), dark, x+sd*0.045, y+0.035, z, eyesG); l.rotation.z = sd*0.6; } }
    const bc = o.hair==='#ebe7df' ? '#bcb6aa' : o.hair;
    const bw = o.brows==='bold' ? 0.032 : 0.02, br = add(box(0.11, bw, 0.02), M(bc,0.8), x, 0.105, z-0.01, head);
    br.rotation.z = o.brows==='straight' ? 0 : sd*-0.18;
    if (o.blush) add(sph(0.05,10,8), M('#f1a49a',0.8), sd*0.215, -0.09, z-0.04, head).scale.set(1,0.55,0.3);
    if (o.wrinkle){ [0,1].forEach(k=>{ const wl = add(box(0.05,0.008,0.008), M(shade(o.skin,-0.15)), x+sd*0.07, y-0.01+k*0.022, z-0.03, head); wl.rotation.z = sd*(k? 0.4 : -0.3); }); }
    if (o.spots==='freckle') [0,1,2].forEach(k=>add(sph(0.009,6,6), M(shade(o.skin,-0.22)), sd*(0.17+k*0.025), -0.07-(k%2)*0.02, z-0.02, head));
  });
  if (o.spots==='mole') add(sph(0.012,6,6), M('#5a3d2e'), 0.1, -0.17, fz-0.01, head);
  if (o.wrinkle) add(box(0.16,0.008,0.008), M(shade(o.skin,-0.12)), 0, 0.2, fz-0.07, head);
  if (o.mouth==='grin'){ const mo = add(new THREE.SphereGeometry(0.05, 14, 8, 0, Math.PI*2, Math.PI/2, Math.PI/2), M('#b5453f',0.6), 0, -0.135, fz-0.005, head); mo.scale.set(1,0.75,0.4); }
  else if (o.mouth==='flat') add(box(0.06,0.012,0.01), M('#9c4a40'), 0, -0.15, fz+0.005, head);
  else { const m = add(new THREE.TorusGeometry(0.04, 0.011, 6, 14, Math.PI), M('#9c4a40',0.6), 0, -0.13, fz-0.002, head); m.rotation.z = Math.PI; m.scale.z = 0.5; }

  /* 머리카락 */
  const Rh = R*1.06; const hm = hairM;
  const part = (r, ps, pl, ts, tl, x=0, y=0.02, z=-0.01) => add(new THREE.SphereGeometry(r, 30, 20, ps, pl, ts, tl), hm, x, y, z, head);
  const cap = (th, r=Rh) => part(r, 0, Math.PI*2, 0, th);
  const back = (th, r=Rh) => part(r, Math.PI, Math.PI, 0, th);
  const st = o.hat==='none' ? o.style : 'hidden'; /* 모자를 쓰면 머리카락은 그리지 않음 */
  if (st==='hidden' && !['bald','none'].includes(o.style)) back(1.85, R*1.02); /* 모자 아래로 밀어 넣은 짧은 뒷머리: 모자 밖으로 나오지 않음 */
  if (st==='short'){ cap(1.12); back(1.95); add(sph(0.16,14,10), hm, 0.1, 0.3, 0.24, head).scale.set(1.5,0.55,0.8); }
  if (st==='buzz'){ cap(1.2, R*1.02); back(1.85, R*1.02); }
  if (st==='part'){ cap(1.15); back(2.0); add(sph(0.2,14,10), hm, -0.15, 0.27, 0.22, head).scale.set(1.35,0.5,0.85); }
  if (st==='swept'){ cap(1.08); back(1.95); add(sph(0.22,14,10), hm, 0, 0.33, 0.12, head).scale.set(1.35,0.65,1.1); }
  if (st==='bob'){ cap(1.32); back(2.35); [-1,1].forEach(sd=>add(sph(0.16,12,10), hm, sd*0.3, -0.08, 0.05, head).scale.set(0.55,1.25,0.95)); }
  if (st==='perm'){ cap(1.2); back(2.05); for (let i=0;i<16;i++){ const a = i/16*Math.PI*2; add(sph(0.11,10,8), hm, Math.cos(a)*0.34, 0.2+(i%2)*0.08, Math.sin(a)*0.3-0.04, head); } }
  if (st==='curly'){ cap(1.3, Rh*1.03); for (let i=0;i<26;i++){ const a = i/26*Math.PI*2*2.1, yy = 0.3 - (i/26)*0.5; add(sph(0.12,10,8), hm, Math.cos(a)*0.37, yy, Math.sin(a)*0.34 - 0.06, head); } }
  if (st==='bun'){ cap(1.3); back(2.0); add(sph(0.16,16,12), hm, 0, 0.36, -0.3, head); }
  if (st==='pony'){ cap(1.3); back(1.95); const t = add(sph(0.12,14,10), hm, 0, -0.08, -0.42, head); t.scale.set(0.8,1.9,0.8); add(new THREE.TorusGeometry(0.05,0.02,6,12), M(o.topC), 0, 0.12, -0.4, head).rotation.x = 1.2; }
  if (st==='long'){ cap(1.34); back(2.5); add(rbox(0.66,0.55,0.18,0.08), hm, 0, -0.42, -0.24, head); [-1,1].forEach(sd=>add(rbox(0.12,0.5,0.2,0.05), hm, sd*0.33, -0.28, 0.0, head)); }
  if (st==='thin'){ part(Rh, Math.PI*0.7, Math.PI*1.6, 1.05, 0.95); add(box(0.2,0.012,0.04), hm, 0.02, R*0.98, 0.05, head); }
  /* 모자 */
  if (o.hat==='cap'){ const hc = M(o.hatC,0.85); add(new THREE.SphereGeometry(R*1.1, 28, 16, 0, Math.PI*2, 0, 1.25), hc, 0, 0.04, -0.01, head); const b = add(cyl(0.26,0.26,0.025,24, ), hc, 0, 0.17, 0.32, head); b.scale.set(1,1,0.75); }
  if (o.hat==='beanie'){ const hc = M(o.hatC,0.95); add(new THREE.SphereGeometry(R*1.12, 28, 16, 0, Math.PI*2, 0, 1.4), hc, 0, 0.03, 0, head); const rim = add(new THREE.TorusGeometry(R*1.05, 0.05, 8, 28), M(shade(o.hatC,-0.06)), 0, 0.09, 0, head); rim.rotation.x = Math.PI/2; add(sph(0.08,12,10), M(shade(o.hatC,0.1)), 0, 0.44, 0, head); }
  if (o.hat==='bucket'){ const hc = M(o.hatC,0.95); add(cyl(0.3, 0.38, 0.26, 24), hc, 0, 0.3, 0, head); add(cyl(0.53, 0.53, 0.025, 28), hc, 0, 0.17, 0, head); }
  /* 안경 */
  if (o.glass!=='none'){ const gm = M('#2d2a26',0.5); [-1,1].forEach(sd=>{ const x = sd*0.135;
      if (o.glass==='square'){ const r = add(new THREE.TorusGeometry(0.075, 0.011, 6, 4), gm, x, -0.01, fz+0.04, head); r.rotation.z = Math.PI/4; r.scale.set(1.15,0.85,1); }
      else if (o.glass==='half'){ const r = add(new THREE.TorusGeometry(0.07, 0.012, 6, 14, Math.PI), gm, x, -0.015, fz+0.04, head); }
      else add(new THREE.TorusGeometry(0.068, 0.01, 6, 20), gm, x, -0.01, fz+0.04, head);
      const arm = add(box(0.012,0.012,0.2), gm, sd*0.22, 0.0, fz-0.08, head); });
    add(box(0.07,0.012,0.012), gm, 0, 0.0, fz+0.045, head); }
  /* 수염 */
  if (o.beard==='mus') add(rbox(0.15,0.035,0.05,0.015), hm, 0, -0.1, fz+0.01, head);
  if (o.beard==='goatee') add(sph(0.06,12,10), hm, 0, -0.25, fz-0.04, head).scale.set(1,0.8,0.6);
  if (o.beard==='full'){ add(new THREE.SphereGeometry(R*1.03, 26, 14, 0, Math.PI, Math.PI*0.56, Math.PI*0.36), hm, 0, -0.01, 0.0, head); add(rbox(0.16,0.035,0.05,0.015), hm, 0, -0.1, fz+0.01, head); }
  /* 소품 */
  let cane = null;
  if (o.acc==='cane'){ cane = new THREE.Group(); cane.position.set(0.36*Math.max(1,w*0.95), 0, 0.16); root.add(cane);
    add(cyl(0.022,0.022,0.86,8), M('#7a5537',0.6), 0, 0.43, 0, cane); const hk = add(new THREE.TorusGeometry(0.06,0.02,6,12,Math.PI), M('#7a5537',0.6), -0.06, 0.86, 0, cane); }
  if (o.acc==='bag'){ const s = add(new THREE.TorusGeometry(rc*1.05, 0.012, 6, 30), M('#7a5537'), 0, 0.68, 0); s.rotation.set(Math.PI/2, 0.55, 0); s.scale.set(1, 0.85, 1); add(rbox(0.2,0.16,0.07,0.03), M('#9a6b45'), rh+0.06, 0.48, 0.05); }
  if (o.acc==='scarf'){ const s = add(new THREE.TorusGeometry(0.13, 0.05, 8, 20), M(o.hatC), 0, 0.93, 0); s.rotation.x = Math.PI/2; add(rbox(0.08,0.22,0.04,0.02), M(o.hatC), 0.07, 0.8, 0.13); }
  if (o.acc==='earring') [-1,1].forEach(sd=>add(sph(0.018,8,6), M('#e2c27a',0.3), sd*R*0.97, -0.1, 0.02, head));
  if (o.stetho){ const s = add(new THREE.TorusGeometry(0.15,0.012,6,20,Math.PI), M('#3d4a5c'), 0, 0.88, 0.16); s.rotation.z = Math.PI; add(sph(0.03,8,6), M('#9aa5b1',0.3), 0.06, 0.72, rc*0.85); }

  root.scale.setScalar((o.body.h || 1)*1.12);
  return {root, body, legs, arms, head, eyesG, cane, phase:Math.random()*6, walking:false, facing:0, wave:false, sit:false, blinkT:2+Math.random()*3, opts:o};
}
function animPerson(p, dt, now){
  if (p.walking) p.phase += dt*10;
  const sw = p.walking ? Math.sin(p.phase)*0.6 : 0;
  if (p.sit){ p.legs.forEach(l=>l.rotation.x = -1.45); }
  else { p.legs[0].rotation.x = sw; p.legs[1].rotation.x = -sw; }
  p.arms[0].rotation.x = -sw*0.7; p.arms[1].rotation.x = p.cane ? 0 : sw*0.7;
  p.arms[0].rotation.z = p.arms[0].userData.base;
  p.arms[1].rotation.z = p.wave ? -2.5 + Math.sin(now/130)*0.3 : p.arms[1].userData.base;
  p.body.position.y = p.walking ? Math.abs(Math.sin(p.phase))*0.045 : Math.sin(now/600 + p.phase)*0.008;
  p.head.rotation.z = p.walking ? 0 : Math.sin(now/1700 + p.phase)*0.04;
  p.blinkT -= dt; if (p.blinkT < 0){ p.eyesG.scale.y = 0.12; if (p.blinkT < -0.12){ p.eyesG.scale.y = 1; p.blinkT = 2.5 + Math.random()*3; } }
  p.root.rotation.y = p.facing;
}

/* 얼굴 사진(대화창 초상) */
let pr = null;
function portrait(opts){
  try {
    if (!pr){ pr = new THREE.WebGLRenderer({antialias:true, alpha:true, preserveDrawingBuffer:true}); pr.setSize(192,192); pr.outputEncoding = THREE.sRGBEncoding; pr.setClearColor(0,0); }
    const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xffffff, 0xe0d6c4, 0.95)); const d = new THREE.DirectionalLight(0xffffff, 0.45); d.position.set(-2,3,4); sc.add(d);
    const p = makePerson(Object.assign({}, opts, {body:{w:1, belly:0, h:1}})); sc.add(p.root); p.root.updateMatrixWorld(true);
    const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 20); cam.position.set(0.25, 1.32, 2.6); cam.lookAt(0, 1.12, 0);
    pr.render(sc, cam); return pr.domElement.toDataURL('image/png');
  } catch(e){ return ''; }
}
