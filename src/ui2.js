/* ================= 접수: 안내·동의 ================= */
const play = () => { mode = 'play'; };
function openConsent(){
  const html = `<div class="steps" aria-hidden="true"><i class="on"></i><i></i><i></i><i></i></div>
    <p class="eyebrow">CHAPTER 02 · RECEPTION</p><h2>탐험 접수</h2>
    <div class="npc"><img src="${PIC.nurse}" alt=""><div><b>보건소 간호사</b><span>시작 전에 이 체험이 무엇인지, 내 정보가 어떻게 쓰이는지 알려 드릴게요.</span></div></div>
    <div class="box"><b>이 체험은</b><ul class="facts">
      <li>국민건강영양조사 2024 원시자료(40세 이상 3,187명)로 만든 연구모형이, 내 인바디(BIA) 결과가 병원 정밀 검사(DXA)와 <b>다르게 분류될 가능성</b>을 예측해요.</li>
      <li>방문자님은 <b>시민 조사관</b>이 되어 네 가지 방 중 하나에서 체성분과 관련된 <b>사회문제 4가지</b>를 풀고, <b>열쇠</b> 4개를 모아 방을 탈출해요. 열쇠마다 새겨진 제안은 마지막에 보건소장님께 정책 제안서로 전해져요. 약 10분.</li>
      <li>모든 설명에는 근거 문헌 번호와 ? 통계 설명 버튼이 있어요. ${statBtn('survey','자료와 분석 방법')}</li>
      <li><b>의학적 진단이 아니에요.</b> 방 배정은 교육용 분류예요.</li></ul></div>
    <details class="box"><summary>이용 대상과 필요한 정보</summary>
      <table class="req">
        <tr><th>대상</th><td>40세 이상, InBody 970 측정 결과. 그 밖에는 예시 값으로 체험해요.</td></tr>
        <tr><th>필수</th><td>성별, 나이, 키, 체중, 팔·다리 근육량 4개(또는 골격근지수 SMI), 체지방률</td></tr>
        <tr><th>권장</th><td>허리둘레. 없으면 허리둘레를 뺀 모형으로 계산해요.</td></tr>
        <tr><th>선택</th><td>위상각, 세포외수분비. 설명에만 써요.</td></tr>
        <tr><th>입력</th><td>결과지를 보며 숫자를 직접 입력해요.</td></tr></table></details>
    <div class="note" style="background:#fcefe9"><b>잠깐!</b> 심장박동기 등 삽입형 의료기기를 착용했다면 인바디를 측정하지 마세요(인바디 측정 유의사항). 이 체험은 예시 값으로 할 수 있어요.</div>
    <div class="box"><b>개인정보와 건강정보</b><ul class="facts">
      <li>입력값은 이 기기 안에서만 계산해요. 서버로 보내거나 저장하지 않고, 페이지를 닫으면 사라져요.</li>
      <li>결과를 이미지·PDF·텍스트로 저장할 때는 내가 고른 경우에만 수치가 들어가요. 이메일 전송은 없어요.</li></ul></div>
    <div class="box"><b>비교에 쓰는 자료</b><ul class="facts"><li>${DATA_INFO.source}, 40세 이상 BIA·DXA 동시 측정 ${DATA_INFO.n.toLocaleString()}명(남 ${DATA_INFO.nSex[1].toLocaleString()}, 여 ${DATA_INFO.nSex[2].toLocaleString()}).</li><li>복합표본 가중치(층·집락·검진 가중치)를 적용해 대한민국 40세 이상을 대표하도록 계산했어요. ${statBtn('datainfo','자료 정보')}</li><li>결과에 나오는 내 위치는 상대적 위치일 뿐 건강 상태를 확정하지 않아요.</li></ul></div>
    <label class="check"><input type="checkbox" id="agree"> 위 내용을 확인했고, 체성분 정보를 이 체험에 쓰는 데 동의해요.</label>
    <div class="row"><button class="btn ghost" id="goDemo" disabled>예시 값으로 체험</button><button class="btn" id="goInput" disabled>내 결과지로 접수하기</button></div>`;
  openSheet(html, {close:true, onClose:()=>{ if (stage==='intro') introHint(); }});
  $('agree').onchange = e=>{ $('goInput').disabled = $('goDemo').disabled = !e.target.checked; };
  $('goInput').onclick = ()=>{ demo = false; if (!log.start) log.start = performance.now(); openReception(); };
  $('goDemo').onclick = ()=>{ if (!log.start) log.start = performance.now(); sheetOnClose = null; useDemo('예시 값으로 체험하기를 골랐어요.'); };
}
function openReception(){
  recNode.querySelectorAll('.pN').forEach(i=>i.src = PIC.nurse);
  openSheet(recNode, {close:true, onClose:()=>{ if (stage==='intro') introHint(); }}); sheetOnClose = ()=>{ if (stage==='intro') introHint(); };
  chapter('CHAPTER 02 · RECEPTION', '접수 창구', '결과지를 보며 숫자를 입력하세요.'); pill('02 — 보건소 로비 · 접수 창구');
}

/* ================= 아바타 ================= */
const TABS = [['body','체형'],['face','얼굴'],['hair','머리'],['wear','옷'],['acc','소품']];
let avTab = 'body';
function swRow(label, list, key, kind){
  const row = document.createElement('div'); row.className = 'optrow'; row.innerHTML = `<div class="ol">${label}</div>`; const sw = document.createElement('div'); sw.className = 'sw'; row.appendChild(sw);
  list.forEach((v,i)=>{ const b = document.createElement('button'); b.type = 'button'; const val = kind==='color' ? i : v[0];
    if (kind==='color'){ const c = Array.isArray(v) ? v[0] : v; b.style.background = c; b.setAttribute('aria-label', Array.isArray(v) ? v[1] : `${label} ${i+1}`); }
    else { b.className = 't'; b.textContent = v[1]; }
    b.setAttribute('aria-pressed', String(av[key]===val));
    b.onclick = ()=>{ av[key] = val; rebuildPlayer(); [...sw.children].forEach(c=>c.setAttribute('aria-pressed','false')); b.setAttribute('aria-pressed','true'); };
    sw.appendChild(b); });
  return row;
}
function renderAv(){
  const tabs = $('avTabs'); tabs.innerHTML = '';
  TABS.forEach(([k,l])=>{ const b = document.createElement('button'); b.textContent = l; b.setAttribute('aria-pressed', String(avTab===k)); b.onclick = ()=>{ avTab = k; renderAv(); }; tabs.appendChild(b); });
  const o = $('avOpts'); o.innerHTML = '';
  if (avTab==='body'){
    const bb = document.createElement('div'); bb.className = 'note'; const whtr = Number.isFinite(current.wc) ? (current.wc/current.ht).toFixed(2) : '-';
    bb.innerHTML = `<b>내 입력이 캐릭터에 반영된 방식</b><br>몸 너비 ← BMI ${f1(current.wt/((current.ht/100)**2))} · 배 ← 허리둘레/키 ${whtr} · 키 ← ${current.ht} cm`; o.appendChild(bb);
    o.appendChild(swRow('체형 반영', [[true,'키·체중·허리둘레 반영'],[false,'기본 체형']], 'bodyOn'));
    const p = document.createElement('p'); p.className = 'small'; p.innerHTML = '체형은 BMI와 허리둘레/키 비율을 범주 없이 연속적으로 비춰요. 체형으로 사람을 평가하지 않도록 중립적으로 표현했어요. 체형은 건강 상태를 뜻하지 않아요. 방을 탈출하면 꾸준한 실천을 상징하는 ‘미래의 나’ 모습으로 바뀌어요. ' + refTag([21]); o.appendChild(p); bindRefs(p);
    o.appendChild(swRow('피부색', SKINS, 'skin', 'color'));
  }
  if (avTab==='face'){ o.appendChild(swRow('얼굴형', FACE, 'face')); o.appendChild(swRow('눈', EYES, 'eyes')); o.appendChild(swRow('눈썹', BROWS, 'brows')); o.appendChild(swRow('입', MOUTH, 'mouth'));
    o.appendChild(swRow('볼터치', [[true,'있음'],[false,'없음']], 'blush')); o.appendChild(swRow('주름', [[false,'없음'],[true,'있음']], 'wrinkle')); o.appendChild(swRow('점·주근깨', SPOTS, 'spots')); }
  if (avTab==='hair'){ o.appendChild(swRow('머리 모양', HSTY, 'style')); o.appendChild(swRow('머리색', HAIRC, 'hair', 'color')); o.appendChild(swRow('모자', HATS, 'hat')); o.appendChild(swRow('모자·목도리 색', TOPC, 'hatC', 'color')); }
  if (avTab==='wear'){ o.appendChild(swRow('상의', TOPS, 'top')); o.appendChild(swRow('상의 색', TOPC, 'topC', 'color')); o.appendChild(swRow('하의', BOTTOMS, 'bottom')); o.appendChild(swRow('하의 색', BOTC, 'botC', 'color')); }
  if (avTab==='acc'){ o.appendChild(swRow('안경', GLASS, 'glass')); if (sexA===1) o.appendChild(swRow('수염', BEARD, 'beard')); o.appendChild(swRow('소품', ACC, 'acc')); }
}
function toAvatar(){
  sheetOnClose = null; stage = 'avatar'; mode = 'busy'; closeSheet();
  sexA = current.sex || 1; body = bodyFrom(current);
  const band = Number.isFinite(current.age) ? bandOf(current.age) : '40-49';
  Object.assign(av, {style: sexA===1 ? 'short' : 'bob', hair: band==='65+' ? 6 : band==='50-64' ? 4 : 1, wrinkle: band==='65+', beard:'none', bottom:'pants'});
  rebuildPlayer(); player.root.position.set(-0.7, 0, 1.0); player.path = []; player.facing = Math.PI/4;
  avTab = 'body'; renderAv(); $('side').hidden = false; dlgClose(); setSafe(); CAM.mode = 'close';
  chapter('CHAPTER 03 · MY CARD', '진료 카드 만들기', '나를 닮은 모습으로 꾸며 보세요.'); pill('03 — 보건소 로비 · 진료 카드');
}
$('avBack').onclick = ()=>{ $('side').hidden = true; CAM.mode = 'room'; setSafe(); stage = 'intro'; if (demo) openConsent(); else openReception(); };
$('avDone').onclick = ()=>{ $('side').hidden = true; CAM.mode = 'room'; setSafe(); PIC.me = portrait(avOpts()); toWaiting(); };

/* ================= 조사 지점 ================= */
const ICON = {
  search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>',
  talk:'<svg viewBox="0 0 24 24"><path d="M5 6h14v9H10l-4 3v-3H5z"/></svg>',
  door:'<svg viewBox="0 0 24 24"><path d="M7 3h10v18H7z"/><circle cx="14" cy="12" r="1"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg>',
  lock:'<svg viewBox="0 0 24 24"><rect x="6" y="11" width="12" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>'
};
function addHS(h){ const el = document.createElement('button'); el.className = 'hs'; el.type = 'button';
  el.innerHTML = `<span class="c">${ICON[h.icon||'search']}</span><span class="l"><span class="lt"></span><span class="e">E</span></span>`;
  el.onclick = e=>{ e.stopPropagation(); goUse(h); }; $('hs').appendChild(el); h.el = el; HS.push(h); return h; }
function clearHS(){ $('hs').innerHTML = ''; }
async function goUse(h){
  if (busy || mode!=='play') return; if (h.lock && h.lock()){ toast(h.lockMsg ? h.lockMsg() : '아직 열 수 없어요'); return; }
  busy = true; await walkTo(h.stand[0], h.stand[1]); if (h.look) player.facing = Math.atan2(h.look[0]-player.root.position.x, h.look[1]-player.root.position.z);
  const pv = h.pov && povEnabled; if (pv) await povIn(h);
  try { await h.use(); } finally { if (pv && POV.on){ const m = mode; mode = 'busy'; await povOut(); busy = false; mode = m; } busy = false; }
}

/* ================= 가까이 보기: 캐릭터 시점 ================= */
const PERSP = new THREE.PerspectiveCamera(52, 1, 0.3, 120);
const POV = {on:false, from:new THREE.Vector3(), to:new THREE.Vector3(), look:new THREE.Vector3(), k:1};
let povEnabled = true; const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const quickFade = on => new Promise(r=>{ const f = $('fade'); f.classList.add('quick'); f.classList.toggle('on', on); setTimeout(r, 220); });
async function povIn(h){
  const p = player.root.position, s = player.root.scale.y;
  const tgt = new THREE.Vector3(h.look[0], h.ty != null ? h.ty : 1.2, h.look[1]);
  const eye = new THREE.Vector3(p.x, 1.25*s, p.z);
  const dir = new THREE.Vector3(tgt.x-eye.x, 0, tgt.z-eye.z); const dist = dir.length() || 1; dir.normalize();
  const vf = (W_ < H_ ? 66 : 54)*Math.PI/180, hf = 2*Math.atan(Math.tan(vf/2)*(W_/H_)), D = Math.max(2.9, 1.05/Math.tan(hf/2));
  POV.to.set(tgt.x, eye.y + 0.12, tgt.z).addScaledVector(dir, -D);
  POV.from.copy(eye).addScaledVector(dir, -2.6).add(new THREE.Vector3(0, 1.1, 0));
  POV.look.copy(tgt);
  CAM.focus = [tgt.x, tgt.y, tgt.z]; CAM.mode = 'focus'; if (!reduceMotion) await sleep(380);
  await quickFade(true); POV.on = true; POV.k = reduceMotion ? 1 : 0; await quickFade(false);
  if (!reduceMotion) await tween(0.75, k=>{ POV.k = 1 - Math.pow(1-k, 3); });
}
async function povOut(){
  if (!POV.on) return; await quickFade(true); POV.on = false; player.root.visible = true; CAM.mode = 'room'; CAM.focus = null; await quickFade(false);
  $('fade').classList.remove('quick');
}
const _pv = new THREE.Vector3();
function updatePOV(){
  if (!POV.on) return;
  _pv.lerpVectors(POV.from, POV.to, POV.k); PERSP.position.copy(_pv); PERSP.lookAt(POV.look);
  player.root.visible = POV.k < 0.55;
  PERSP.aspect = W_/H_; PERSP.fov = W_ < H_ ? 66 : 54;
  // 대화창에 가리지 않게 화면 중심을 위로
  const offY = clamp(((CAM.safe.b||0) - (CAM.safe.t||0))/2, 0, H_*0.28);
  PERSP.setViewOffset(W_, H_, 0, offY, W_, H_); PERSP.updateProjectionMatrix();
}
const projV = new THREE.Vector3();
function updateHS(){
  const show = mode==='play' && !busy && !POV.on && $('sheet').hidden; const p = player ? player.root.position : null;
  for (const h of HS){ const on = show && (!h.show || h.show()); h.el.style.display = on ? '' : 'none'; if (!on) continue;
    projV.set(...h.pos).project(camera); const x = (projV.x+1)/2*W_, y = (1-projV.y)/2*H_;
    h.el.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
    const lbl = typeof h.label==='function' ? h.label() : h.label; const lt = h.el.querySelector('.lt'); if (lt.textContent !== lbl) lt.textContent = lbl;
    const done = h.done && h.done(), lock = h.lock && h.lock(), main = !done && !lock && h.main && h.main();
    h.el.classList.toggle('done', !!done); h.el.classList.toggle('lock', !!lock); h.el.classList.toggle('main', !!main);
    const ic = done ? 'check' : lock ? 'lock' : (h.icon||'search'); if (h.el.dataset.ic !== ic){ h.el.querySelector('.c').innerHTML = ICON[ic]; h.el.dataset.ic = ic; }
    h.el.classList.toggle('near', !!p && Math.hypot(p.x-h.stand[0], p.z-h.stand[1]) < 1.0); }
}

/* ================= 이동 ================= */
let walkRes = null;
function walkTo(x, z){ return new Promise(res=>{ player.path = findPath(player.root.position.x, player.root.position.z, x, z); walkRes = res; if (!player.path.length){ walkRes = null; res(); } }); }
function stepPath(dt){
  if (!player.path || !player.path.length) return false; const [tx,tz] = player.path[0]; const p = player.root.position; const dx = tx-p.x, dz = tz-p.z, d = Math.hypot(dx,dz);
  const sp = 3.4*dt; if (d <= sp){ p.x = tx; p.z = tz; player.path.shift(); if (!player.path.length){ player.walking = false; if (walkRes){ const r = walkRes; walkRes = null; r(); } return true; } }
  else { p.x += dx/d*sp; p.z += dz/d*sp; player.facing = lerpAngle(player.facing, Math.atan2(dx,dz), Math.min(1, dt*14)); }
  player.walking = true; return true;
}
const lerpAngle = (a,b,k)=>{ let d = ((b-a+Math.PI)%(Math.PI*2))-Math.PI; if (d < -Math.PI) d += Math.PI*2; return a + d*k; };
const tasks = []; const tween = (dur, fn) => new Promise(res=>tasks.push({t:0, dur, fn, res}));
const openDoor = (d, to=1) => { const from = d.open; return tween(0.7, k=>{ d.open = from + (to-from)*k; d.piv.rotation.y = -1.35*d.open; }); };

