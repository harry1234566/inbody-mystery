/* ================= 탐험 수첩 ================= */
function pushSheet(){ if ($('sheet').hidden) return null; const p = $('panel'), frag = document.createDocumentFragment(); while (p.firstChild) frag.appendChild(p.firstChild); const sv_ = {frag, cls:p.className, onClose:sheetOnClose, scroll:p.scrollTop}; sheetOnClose = null; return sv_; }
function popSheet(s){ const p = $('panel'); p.innerHTML = ''; p.className = s.cls; p.appendChild(s.frag); $('sheet').hidden = false; sheetOnClose = s.onClose; p.scrollTop = s.scroll; setSafe(); }
function openNotebook(tab='clues', hl=null, saved){
  if (saved===undefined) saved = pushSheet();
  const T = [['card','내 카드'],['clues',`단서 ${notes.length}`],['cards',`열쇠 ${cards.length}`],['hist','지난 설명'],['stats','통계 설명'],['data','자료 정보'],['refs','근거 문헌'],['design','설계 근거']];
  const R = result ? ROOMS[result.room] : null;
  let body = '';
  if (tab==='card') body = `<div class="npc"><img src="${PIC.me || ''}" alt="" style="width:72px;height:72px"><div><b>나의 진료 카드</b><span>${R ? `${R.no} · ${R.name}${demo ? ' (예시 값)' : ''}` : '아직 접수 전이에요'}</span></div></div>
     ${R ? `<p class="small">${R.why}</p><div class="box"><b>이 방의 다짐</b><ul class="facts">${R.pledges.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>` : ''}
     <p class="small">입력한 건강 수치는 이 기기 안에서만 쓰이고 수첩에는 남기지 않아요.</p>`;
  if (tab==='clues') body = notes.length ? notes.map(n=>`<div class="clue">${n.issue ? `<span class="tagI">${n.issue} ${ISSUE[n.issue]}</span>` : '<span class="tagI" style="background:var(--green)">로비 단서</span>'}<b>${esc(n.lesson)}</b><div class="s">${refTag(n.refs)}</div></div>`).join('') : '<p class="small">아직 모은 단서가 없어요. 반짝이는 표시를 조사해 보세요.</p>';
  if (tab==='refs') body = `<p class="small">문항, 결과 안내, 정책 제안에 쓴 근거예요. 1번은 팀 집현전의 분석이에요.</p><ol class="reflist">${Object.entries(REFS).map(([k,r])=>`<li id="ref${k}" value="${k}"${+k===hl?' class="hl"':''}>${esc(r.t)}${r.u ? ` <a href="${r.u}" target="_blank" rel="noopener">링크</a>` : ''}</li>`).join('')}</ol>`;
  if (tab==='cards') body = cards.length ? '<p class="small">퀴즈를 풀 때마다 모은 열쇠와 거기 새겨진 제안이에요. 마지막에 보건소장님께 제안서로 전해요.</p>' + cards.map(c=>`<div class="pcard"><b>${c.issue} ${ISSUE[c.issue]} → ${c.lvl} 단계</b>${esc(c.text)}</div>`).join('') : '<p class="small">아직 열쇠가 없어요. 방의 미션을 풀면 모여요.</p>';
  if (tab==='hist') body = HIST.length ? '<p class="small">지금까지 본 설명을 처음부터 다시 볼 수 있어요.</p><div class="chips">' + HIST.map((h,i)=>`<button type="button" data-h="${i}">${i+1}. ${esc(h.title || h.who)}</button>`).join('') + '</div>' : '<p class="small">아직 본 설명이 없어요.</p>';
  if (tab==='stats') body = '<p class="small">이 게임의 바탕이 된 집현전의 통계 분석이에요. 누르면 설명과 그래프를 볼 수 있어요.</p><div class="chips">' + Object.entries(STATS).map(([k,v])=>`<button type="button" data-stat="${k}">? ${esc(v.t)}</button>`).join('') + '</div>';
  if (tab==='data') body = dataInfoTable() + posNotice();
  if (tab==='design') body = DESIGN.map(([t,d,r])=>`<div class="clue"><b>${t}</b><span class="small">${d}</span><div class="s">${refTag(r)}</div></div>`).join('') + '<p class="small">이 체험은 교육·캠페인용이며 의학적 진단이 아니에요.</p>';
  openSheet(`<p class="eyebrow">FIELD NOTES</p><h2>탐험 수첩</h2><div class="tabs nb-tabs">${T.map(([k,l])=>`<button data-t="${k}" aria-pressed="${k===tab}">${l}</button>`).join('')}</div>${body}`, {close:true, wide:true, onClose: saved ? ()=>popSheet(saved) : null});
  $('panel').querySelectorAll('[data-t]').forEach(b=>b.onclick = ()=>openNotebook(b.dataset.t, null, saved));
  $('panel').querySelectorAll('[data-h]').forEach(b=>b.onclick = ()=>openHistory(+b.dataset.h));
  if (hl){ const el = $('ref'+hl); if (el) setTimeout(()=>el.scrollIntoView({block:'center'}), 30); }
}
$('noteBtn').onclick = ()=>openNotebook(notes.length ? 'clues' : 'card');

/* ================= 지도 ================= */
$('mapBtn').onclick = ()=>{
  const saved = pushSheet();
  const my = result ? result.room : null;
  const room = (k, x, y) => { const R = ROOMS[k], on = my===k, v = visited.has(k);
    return `<g><rect x="${x}" y="${y}" width="150" height="86" rx="14" fill="${on ? R.door : '#f4f1e8'}" stroke="${on ? R.accent : '#d9d2bf'}" stroke-width="2"/>
      <text x="${x+75}" y="${y+38}" text-anchor="middle" font-size="15" font-weight="700" fill="${on ? '#fff' : '#3b4440'}">${R.no} · ${R.name}</text>
      <text x="${x+75}" y="${y+62}" text-anchor="middle" font-size="12" fill="${on ? '#fff' : '#7a837d'}">${on ? (v ? '탈출 완료 ✓' : '나의 방') : R.space}</text></g>`; };
  const here = place==='room' ? (my==='balance'||my==='fat' ? (my==='balance'?[95,123]:[95,233]) : (my==='muscle'?[355,40]:[515,40])) : [355,240];
  openSheet(`<p class="eyebrow">MAP</p><h2>집현전 보건소 안내도</h2>
    <div class="map"><svg viewBox="0 0 680 380" font-family="Noto Sans KR, sans-serif">
      <rect x="190" y="110" width="470" height="250" rx="22" fill="#eef3ec" stroke="#b7cdb2" stroke-width="2"/>
      <text x="425" y="300" text-anchor="middle" font-size="18" font-weight="800" fill="#2f6f5e">보건소 로비</text>
      <text x="425" y="325" text-anchor="middle" font-size="12" fill="#5f6b64">접수 · 대기실 TV · 측정기 · 게시판</text>
      ${room('balance', 20, 120)}${room('fat', 20, 230)}${room('muscle', 280, 4)}${room('both', 440, 4)}
      <circle cx="${here[0]}" cy="${here[1]}" r="11" fill="#e9c46a" stroke="#fff" stroke-width="3"/><text x="${here[0]+16}" y="${here[1]+5}" font-size="13" font-weight="700" fill="#1f2b26">현재 위치</text>
    </svg></div>
    <p class="small">${my ? `연구모형이 정한 방은 <b>${ROOMS[my].name}</b>이에요. 네 방 모두 같은 사회문제 ①~④를 다른 시선으로 다뤄요.` : '접수와 결과 상담을 마치면 내 방이 정해져요.'}</p>`, {close:true, onClose: saved ? ()=>popSheet(saved) : null});
};

/* ================= 도움말 ================= */
$('helpBtn').onclick = ()=>{
  const saved = pushSheet();
  openSheet(`<p class="eyebrow">HELP</p><h2>도움말</h2><ul class="facts">
    <li><b>이동</b> 바닥을 누르면 그곳으로 걸어가요. PC는 WASD·방향키도 돼요.</li>
    <li><b>조사</b> 동그란 표시를 누르면 걸어가서 조사해요. PC는 가까이에서 E 키.</li>
    <li><b>열쇠</b> 방의 미션 4개를 풀면 열쇠 조각 4개가 모여 출구가 열려요.</li>
    <li><b>탐험 수첩</b> 모은 단서와 모든 근거 문헌을 볼 수 있어요.</li></ul>
    <div class="qlab">글씨 크기</div><div class="seg" style="margin:6px 0 10px">${FZ.map(([z,l],i)=>`<button type="button" data-fz="${i}" aria-pressed="${i===fzI}">${l}</button>`).join('')}</div>
    <label class="check"><input type="checkbox" id="ttsChk" ${ttsOn?'checked':''}> 음성 안내 켜기 (화면의 글을 읽어 줘요)</label>
    <label class="check"><input type="checkbox" id="povChk" ${povEnabled?'checked':''}> 조사할 때 캐릭터 시점으로 가까이 보기</label>
    <div class="acts"><button class="btn ghost" id="hpAgain">처음부터 다시 하기</button></div>
    <p class="small">교육·캠페인용 체험이며 의학적 진단이 아닙니다. 입력값은 저장하지 않아요. TEAM 집현전 · 성균관대학교 2026-2 융합연구학점제</p>`, {close:true, onClose: saved ? ()=>popSheet(saved) : null});
  $('panel').querySelectorAll('[data-fz]').forEach(b=>b.onclick = ()=>setFz(+b.dataset.fz));
  $('povChk').onchange = e=>{ povEnabled = e.target.checked; };
  confirmBtn($('hpAgain'), ()=>{ sheetOnClose = null; closeSheet(); restart(); });
  $('ttsChk').onchange = e=>{ if (!ttsOK){ toast('이 브라우저에서는 음성 안내를 지원하지 않아요'); e.target.checked = false; return; } ttsOn = e.target.checked; if (ttsOn) speak('음성 안내를 켰어요.'); else try { speechSynthesis.cancel(); } catch(_){} };
};

/* ================= 글씨 크기 ================= */
const FZ = [[0.9,'작게'],[1,'보통'],[1.15,'크게'],[1.3,'아주 크게']];
let fzI = 1; try { const v = +localStorage.getItem('im_fz'); if (v >= 0 && v < FZ.length) fzI = v; } catch(e){}
function setFz(i, quiet){ fzI = i; document.documentElement.style.setProperty('--fz', FZ[i][0]); $('fzT').textContent = '글씨 ' + FZ[i][1]; try { localStorage.setItem('im_fz', i); } catch(e){} setSafe(); if (!quiet) toast(`글씨 크기: ${FZ[i][1]}`);
  document.querySelectorAll('[data-fz]').forEach(b=>b.setAttribute('aria-pressed', String(+b.dataset.fz===i))); }
setFz(fzI, true);
$('fzBtn').onclick = ()=>setFz((fzI+1) % FZ.length);

/* ================= 음악 (오르골 느낌, WebAudio) ================= */
let actx = null, musicOn = false, musicT = null, master = null, bar = 0;
const NOTE = n => 440*Math.pow(2, (n-69)/12);
const SONG = [[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]];
function pluck(f, t, v=0.06, d=1.6){ const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t+0.02); g.gain.exponentialRampToValueAtTime(0.0008, t+d); o.connect(g); g.connect(master); o.start(t); o.stop(t+d+0.05); }
function musicLoop(){ if (!musicOn) return; const t0 = actx.currentTime + 0.05, ch = SONG[bar++ % 4];
  pluck(NOTE(ch[0]-12), t0, 0.05, 3.2); [0,1,2,3,2,1].forEach((k,i)=>pluck(NOTE(ch[k]+12), t0 + i*0.5, 0.035, 1.4)); musicT = setTimeout(musicLoop, 3000); }
$('musicBtn').onclick = ()=>{ try { if (!actx){ actx = new (window.AudioContext||window.webkitAudioContext)(); master = actx.createGain(); master.gain.value = 0.7; master.connect(actx.destination); }
  musicOn = !musicOn; $('musicBtn').setAttribute('aria-pressed', String(musicOn)); if (musicOn){ actx.resume(); musicLoop(); } else clearTimeout(musicT); } catch(e){ toast('이 브라우저에서는 음악을 재생할 수 없어요'); } };

/* ================= 조작 ================= */
const keys = new Set(); const KEYMAP = {ArrowUp:'u',KeyW:'u',ArrowDown:'d',KeyS:'d',ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r'};
const isTyping = () => /INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||'');
addEventListener('keydown', e=>{
  if (isTyping()) return;
  if (mode!=='play' || !$('sheet').hidden) return;
  if (KEYMAP[e.code]){ keys.add(KEYMAP[e.code]); player.path = []; if (walkRes){ const r = walkRes; walkRes = null; r(); } e.preventDefault(); }
  if (e.code==='Space'){ e.preventDefault(); doJump(); }
  if (e.code==='KeyE' && !busy){ const p = player.root.position; const vis = HS.filter(h=>h.el.style.display!=='none').sort((a,b)=>Math.hypot(p.x-a.stand[0],p.z-a.stand[1])-Math.hypot(p.x-b.stand[0],p.z-b.stand[1]));
    if (vis[0] && Math.hypot(p.x-vis[0].stand[0], p.z-vis[0].stand[1]) < 1.6) goUse(vis[0]); else toast('가까이에 조사할 곳이 없어요. 동그란 표시로 가 보세요'); }
});
addEventListener('keyup', e=>{ if (KEYMAP[e.code]) keys.delete(KEYMAP[e.code]); }); addEventListener('blur', ()=>keys.clear());
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), ground = new THREE.Plane(new THREE.Vector3(0,1,0), 0), hitP = new THREE.Vector3();
const marker = new THREE.Mesh(new THREE.RingGeometry(0.16,0.27,28), new THREE.MeshBasicMaterial({color:0x2f6f5e, transparent:true, opacity:.75, side:THREE.DoubleSide, depthWrite:false}));
marker.rotation.x = -Math.PI/2; marker.visible = false; scene.add(marker);
let downAt = null;
renderer.domElement.addEventListener('pointerdown', e=>{ downAt = {x:e.clientX, y:e.clientY}; });
renderer.domElement.addEventListener('pointerup', e=>{
  if (mode!=='play' || busy || !downAt || !$('sheet').hidden) return; const moved = Math.hypot(e.clientX-downAt.x, e.clientY-downAt.y); downAt = null; if (moved > 12) return;
  const r = renderer.domElement.getBoundingClientRect(); ndc.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1);
  ray.setFromCamera(ndc, camera); if (!ray.ray.intersectPlane(ground, hitP)) return;
  const x = clamp(hitP.x, -RM.W/2+0.4, RM.W/2-0.4), z = clamp(hitP.z, -RM.D/2+0.4, RM.D/2-0.4);
  player.path = findPath(player.root.position.x, player.root.position.z, x, z); marker.position.set(x, 0.03, z); marker.visible = true;
});

/* ================= 루프 ================= */
const clock3 = new THREE.Clock(); let T = 0;
const UP = new THREE.Vector3(-1,0,-1).normalize(), RIGHT = new THREE.Vector3(1,0,-1).normalize();
/* 점프 */
const J = {y:0, v:0};
function doJump(){ if (mode!=='play' || busy || !$('sheet').hidden || J.y > 0.001) return; J.v = 4.6; }
$('jumpBtn').onclick = e=>{ e.stopPropagation(); doJump(); };
function stepJump(dt){ if (J.y <= 0 && J.v <= 0){ J.y = 0; return; } J.v -= 13*dt; J.y += J.v*dt; if (J.y < 0){ J.y = 0; J.v = 0; } player.root.position.y = J.y; }
function step(dt){
  let mx = 0, mz = 0; if (keys.has('u')){ mx += UP.x; mz += UP.z; } if (keys.has('d')){ mx -= UP.x; mz -= UP.z; } if (keys.has('r')){ mx += RIGHT.x; mz += RIGHT.z; } if (keys.has('l')){ mx -= RIGHT.x; mz -= RIGHT.z; }
  const L = Math.hypot(mx, mz);
  if (L > 0.1){ mx /= L; mz /= L; const sp = 3.4*dt, p = player.root.position; let nx = p.x + mx*sp, nz = p.z + mz*sp;
    if (walkable(nx, nz)){ p.x = nx; p.z = nz; } else if (walkable(nx, p.z)) p.x = nx; else if (walkable(p.x, nz)) p.z = nz;
    player.walking = true; player.facing = lerpAngle(player.facing, Math.atan2(mx, mz), Math.min(1, dt*14)); marker.visible = false; }
  else if (!stepPath(dt)){ player.walking = false; marker.visible = false; }
}
/* ================= 캐릭터 꾸미기 미리보기 (확대·천천히 회전) ================= */
const PV = (()=>{
  const wrap = document.createElement('div'); wrap.id = 'avPrev'; wrap.hidden = true; wrap.setAttribute('aria-hidden','true');
  wrap.innerHTML = '<span>미리보기</span>'; document.body.appendChild(wrap);
  const r = new THREE.WebGLRenderer({antialias:true, alpha:true}); r.setPixelRatio(Math.min(window.devicePixelRatio||1, 2)); r.outputEncoding = THREE.sRGBEncoding; r.setClearColor(0x000000, 0); wrap.appendChild(r.domElement);
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xfffdf6, 0xe4dccb, 0.95));
  const k1 = new THREE.DirectionalLight(0xfff1dc, 0.7); k1.position.set(-3, 6, 5); sc.add(k1);
  const k2 = new THREE.DirectionalLight(0xe8f0ff, 0.28); k2.position.set(4, 3, -4); sc.add(k2);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.05, 48), new THREE.MeshStandardMaterial({color:lin('#e6dfcf'), roughness:0.95})); disc.position.y = -0.03; sc.add(disc);
  const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 60); let person = null, ang = -0.5, top = 2, mid = 1;
  const api = { on:false, wrap,
    set(){ if (person) sc.remove(person.root); person = makePerson(avOpts()); person.facing = ang; sc.add(person.root);
      person.root.rotation.y = 0; person.root.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(person.root); top = bb.max.y; mid = top/2; },
    show(v){ api.on = !!v; wrap.hidden = !v; document.body.classList.toggle('avon', !!v); if (v) api.set(); },
    frame(dt, now){ if (!api.on || !person) return; const w = wrap.clientWidth, h = wrap.clientHeight; if (!w || !h) return;
      const pr = r.getPixelRatio(); if (r.domElement.width !== Math.round(w*pr) || r.domElement.height !== Math.round(h*pr)) r.setSize(w, h, false);
      ang += dt*0.55; person.facing = ang; person.walking = false; animPerson(person, dt, now);
      cam.aspect = w/h; const need = Math.max(top*1.18, (top*1.18)*0.62/cam.aspect); const d = (need/2)/Math.tan(cam.fov*Math.PI/360);
      cam.position.set(0, mid + top*0.08, d); cam.lookAt(0, mid, 0); cam.updateProjectionMatrix(); r.render(sc, cam); }
  };
  window.__PV = api; return api;
})();
function frame(){
  const dt = Math.min(clock3.getDelta(), 0.05); T += dt; const now = performance.now();
  for (let i=tasks.length-1;i>=0;i--){ const k = tasks[i]; k.t += dt; const p = Math.min(1, k.t/k.dur); k.fn(p); if (p>=1){ tasks.splice(i,1); k.res(); } }
  if (player){ if (mode==='play' || busy) step(dt); else if (player.path && player.path.length) stepPath(dt); else player.walking = false; }
  if (stage==='avatar' && player) player.facing = lerpAngle(player.facing, Math.PI/4, Math.min(1, dt*6));
  if (player) stepJump(dt);
  [player, nurse, doctor, ...visitors].forEach(p=>p && animPerson(p, dt, now));
  if (player && J.y > 0.01){ player.legs[0].rotation.x = -0.7; player.legs[1].rotation.x = 0.35; player.arms[0].rotation.z = player.arms[0].userData.base - 0.9; player.arms[1].rotation.z = player.arms[1].userData.base + 0.9; }
  for (let i=FX.length-1;i>=0;i--){ const f = FX[i]; f.t += dt; const k = f.t/f.life; if (k >= 1){ f.m.parent && f.m.parent.remove(f.m); FX.splice(i,1); continue; } f.step(f, k); }
  document.body.classList.toggle('playing', mode==='play' && !busy && $('sheet').hidden && $('dlg').hidden && $('side').hidden);
  if (poofAt){ projV.copy(poofAt).project(camera); const el = $('poof'); el.style.left = ((projV.x+1)/2*W_) + 'px'; el.style.top = ((1-projV.y)/2*H_) + 'px'; }
  if (nurse && player && place==='lobby'){ nurse.facing = lerpAngle(nurse.facing, Math.atan2(player.root.position.x-nurse.root.position.x, player.root.position.z-nurse.root.position.z)*0.5, dt*2); }
  if (marker.visible) marker.material.opacity = 0.5 + Math.sin(T*6)*0.25;
  updateCamera(dt); updateHS();
  updatePOV(); renderer.render(scene, POV.on ? PERSP : camera); PV.frame(dt, now); requestAnimationFrame(frame);
}

/* ================= 시작 ================= */
try { await Promise.race([Promise.all([document.fonts.load(`700 40px "Noto Sans KR"`), document.fonts.load(`500 40px "Noto Sans KR"`)]), sleep(2500)]); } catch(e){}
clearWorld(); buildLobby(); rebuildPlayer(); lobbyHS();
PIC.nurse = portrait(NPC_N); PIC.doctor = portrait(NPC_D);
$('hud').hidden = false; setSafe(); CAM.init = false;
frame();
setTimeout(()=>{ $('loading').classList.add('off'); setTimeout(()=>$('loading').hidden = true, 700); introHint(); }, 500);
window.__dbg = {poof:()=>poofTransform(), posterSheet:()=>{ const ks = Object.keys(POSTERS); const cw = 420, ch = 504; const c = document.createElement('canvas'); c.width = cw*6; c.height = ch*Math.ceil(ks.length/6); const g = c.getContext('2d'); ks.forEach((k,i)=>{ const P = POSTERS[k]; g.save(); g.translate((i%6)*cw, Math.floor(i/6)*ch); g.fillStyle = PK.paper; g.fillRect(0,0,cw-6,ch-6); g.fillStyle = '#5f9e86'; g.fillRect(0,0,cw-6,ch*0.15); pText(g, P.t, cw/2, ch*0.075, ch*0.06, '#fff', 800); P.draw(g, cw*0.06, ch*0.2, cw*0.88, ch*0.56); pText(g, P.cap, cw/2, ch*0.86, ch*0.035, PK.ink, 700); pText(g, '근거: '+P.src, cw/2, ch*0.94, ch*0.028, PK.mut, 500); g.restore(); }); return c.toDataURL(); }, scene, PERSP, POV, build:k=>{ buildRoom(k); roomHS(k); roomKey=k; place='room'; stage='room'; mode='play'; dlgClose(); player.root.position.set(ROOM_DOOR_U,0,-3.6); CAM.init=false; }, forceRoom:k=>{ result = predict(current); result.room = k; }, Q, get stage(){return stage;}, set stage(v){stage=v;}, get result(){return result;}, get current(){return current;}, set current(v){current=v;}, player:()=>player, HS:()=>HS, goUse, useDemo, quiz, enterRoom, updateKeys, deliver, walkable, get roomKey(){return roomKey;}, set roomKey(v){roomKey=v;}, exitRoom, ending, showResult, notes, CAM, walkTo, openNotebook, get mode(){return mode;}, set mode(v){mode=v;}, get demo(){return demo;}, get HIST(){return HIST;}, setFz};
