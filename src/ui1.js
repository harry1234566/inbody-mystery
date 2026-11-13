/* ================= 상태 ================= */
let mode = 'intro', busy = false, stage = 'intro', place = 'lobby', roomKey = null;
let current = null, result = null, demo = false, demoWhy = '';
const log = {start:0, wrong:0, firstTry:0, quizzes:0, hints:[]};
const sv = {level:null, under:null, msg:null, act:null};
const notes = []; const visited = new Set();
let ctx = {pbf:25, smi:7, sex:1, dm:1, df:1};
const val = x => typeof x === 'function' ? x(ctx) : x;
const sleep = ms => new Promise(r=>setTimeout(r, ms));

/* 아바타 옵션 */
const av = {skin:1, face:'round', eyes:'dot', brows:'soft', mouth:'smile', blush:true, wrinkle:false, spots:'none', style:'short', hair:0, hat:'none', hatC:1,
  top:'tee', topC:0, bottom:'pants', botC:0, glass:'none', beard:'none', acc:'none', bodyOn:true};
let body = {w:1, belly:0, h:1}, sexA = 1;
const avOpts = () => ({sex:sexA, skin:SKINS[av.skin], face:av.face, eyes:av.eyes, brows:av.brows, mouth:av.mouth, blush:av.blush, wrinkle:av.wrinkle, spots:av.spots,
  style:av.style, hair:HAIRC[av.hair][0], hat:av.hat, hatC:TOPC[av.hatC], top:av.top, topC:TOPC[av.topC], bottom:av.bottom, botC:BOTC[av.botC],
  glass:av.glass, beard:sexA===1 ? av.beard : 'none', acc:av.acc, body: healthy ? {w:1, belly:0, h: av.bodyOn ? body.h : 1} : av.bodyOn ? body : {w:1, belly:0, h:1}});
let healthy = false;
function rebuildPlayer(){
  const pos = player ? player.root.position.clone() : new THREE.Vector3(-1.5,0,3.2), f = player ? player.facing : Math.PI/4;
  if (player && player.root.parent) player.root.parent.remove(player.root);
  player = makePerson(avOpts()); player.root.position.copy(pos); player.facing = f; player.path = []; world.add(player.root);
}

/* ================= 화면 도우미 ================= */
let toastT; function toast(m){ const t = $('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(()=>t.classList.remove('on'), 2800); }
let ttsOn = false; const ttsOK = 'speechSynthesis' in window;
function speak(text){ if (!ttsOn || !ttsOK) return; try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g,'')); u.lang = 'ko-KR'; u.rate = 1.05; speechSynthesis.speak(u); } catch(e){} }
const fade = on => new Promise(r=>{ $('fade').classList.toggle('on', on); setTimeout(r, 480); });
let chapT;
function chapter(no, title, desc){ $('chapNo').textContent = no; $('chapTitle').textContent = title; if (desc!=null) $('chapDesc').textContent = desc; const c = $('chap'); c.classList.remove('min'); clearTimeout(chapT); if (MOBILE) chapT = setTimeout(()=>c.classList.add('min'), 5000); }
function objective(desc){ $('chapDesc').textContent = desc; const c = $('chap'); c.classList.remove('min'); clearTimeout(chapT); if (MOBILE) chapT = setTimeout(()=>c.classList.add('min'), 5000); }
const pill = t => $('pill').textContent = t;

/* 초상 */
const PIC = {};
const iconPic = (bg, path) => 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="${bg}"/>${path}</svg>`);
PIC.tv = iconPic('#dfe8f0', '<rect x="22" y="28" width="52" height="34" rx="6" fill="#2f4858"/><rect x="27" y="33" width="42" height="24" rx="3" fill="#f4efe2"/><path d="M40 70h16" stroke="#2f4858" stroke-width="4" stroke-linecap="round"/>');
PIC.clue = iconPic('#e4efe8', '<circle cx="44" cy="44" r="16" fill="none" stroke="#2f6f5e" stroke-width="6"/><path d="M56 56l12 12" stroke="#2f6f5e" stroke-width="7" stroke-linecap="round"/>');
PIC.lock = iconPic('#efe9da', '<rect x="30" y="44" width="36" height="28" rx="6" fill="#3d4a4c"/><path d="M36 44v-8a12 12 0 0 1 24 0v8" fill="none" stroke="#3d4a4c" stroke-width="6"/>');

/* ================= 대화 ================= */
const WHO = {'간호사':'nurse', '의사':'doctor', '대기실 TV':'tv', '안내':'clue', '나':'me'};
function dlgOpen(who, wide){ const d = $('dlg'); d.hidden = false; document.body.classList.add('dlgon'); d.classList.toggle('wide', !!wide); $('dlgWho').textContent = who === '간호사' ? '보건소 간호사' : who === '의사' ? '보건소 의사' : who;
  $('dlgPic').src = PIC[WHO[who]] || PIC.clue; document.querySelector('#dlg .body').scrollTop = 0; setSafe(); }
function dlgClose(){ $('dlg').hidden = true; document.body.classList.remove('dlgon'); setSafe(); }
/* say: 대화. free=true면 플레이어가 움직일 수 있음 */
/* 지난 설명 기록: 대화·퀴즈 해설·결과·마무리 페이지를 모두 모아 앞뒤로 다시 볼 수 있게 */
const HIST = [];
function hist(who, title, html){ html = String(html).replace(/<div class="row">[\s\S]*$/,'').replace(/ id="[^"]*"/g,''); const last = HIST[HIST.length-1]; if (last && last.html===html) return; HIST.push({who, title:title||'', html}); }
function backBtn(skip){ const idx = HIST.length - 1 - (skip ? 1 : 0); if (idx < 0) return null; const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ghost sm back'; b.textContent = '‹ 지난 설명'; b.onclick = ()=>openHistory(idx); return b; }
function say(who, text, o={}){
  return new Promise(res=>{
    dlgOpen(who, o.wide); $('dlgTitle').innerHTML = o.title ? esc(o.title) : ''; $('dlgText').innerHTML = text; $('dlgExtra').innerHTML = o.extra || ''; $('dlgOpts').innerHTML = '';
    const foot = $('dlgFoot'); foot.innerHTML = ''; const bs = o.btns || ['다음'];
    const bk = backBtn(); if (bk) foot.appendChild(bk); hist(who, o.title, text + (o.extra || ''));
    bs.forEach((b,i)=>{ const el = document.createElement('button'); el.className = 'btn' + (i < bs.length-1 ? ' ghost' : ''); el.textContent = b; el.onclick = ()=>{ if (!o.keep) dlgClose(); res(i); }; foot.appendChild(el); });
    bindRefs($('dlg')); bindStats($('dlg')); speak(text); setTimeout(()=>{ const l = foot.lastChild; if (l && !MOBILE) l.focus({preventScroll:true}); }, 50);
    if (!o.free) mode = 'busy';
  });
}
const norm = s => String(s).replace(/[\s.,!?'"“”‘’()\[\]%]/g,'').toLowerCase();
function refsHTML(ids){ return `<div class="refs"><span>근거</span>${refTag(ids)}</div>`; }
function quiz(q){
  return new Promise(res=>{
    mode = 'busy'; let tries = 0; const t0 = performance.now();
    dlgOpen(`사회문제 ${q.issue} · ${ISSUE[q.issue]}`, true); $('dlgPic').src = PIC.clue;
    const ask = (retry)=>{
      $('dlgTitle').textContent = q.title;
      $('dlgText').innerHTML = (retry ? `<span style="color:var(--warn);font-weight:700">다시 생각해 볼까요? ${esc(q.hint)}</span><br>` : '') + esc(val(q.q));
      $('dlgExtra').innerHTML = q.sign ? `<div class="sign">${esc(q.sign).replace('[ ]','<span class="blank">?</span>')}</div>` : '';
      $('dlgFoot').innerHTML = ''; const box = $('dlgOpts'); box.innerHTML = ''; speak($('dlgText').textContent);
      if (q.kind==='short'){
        box.innerHTML = '<div class="qlab" style="margin-top:0">고장 난 안내판 빈칸 복구</div><div class="ans"><input id="shortIn" autocomplete="off" placeholder="빈칸에 들어갈 말" aria-label="빈칸 답"><button class="btn sm" id="shortOk">복구</button></div>'
          + (q.chips ? `<div class="pick" aria-label="보기">${q.chips.map(c=>`<button type="button" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : '');
        const go = ()=>{ const a = norm($('shortIn').value); if (!a) return; tries++; const cands = [a, a.replace(/(이|가|을|를|은|는|의|일|회|번|입니다|이요|요)$/,'')];
          if (cands.some(c=>q.short.map(norm).includes(c))) done(); else { ask(true); } };
        box.querySelectorAll('.pick button').forEach(b=>b.onclick = ()=>{ $('shortIn').value = b.dataset.v; go(); });
        $('shortOk').onclick = go; $('shortIn').addEventListener('keydown', e=>{ if (e.key==='Enter') go(); }); if (!MOBILE) setTimeout(()=>$('shortIn') && $('shortIn').focus(), 60);
      } else val(q.opts).forEach((o,i)=>{ const b = document.createElement('button'); b.className = 'opt'; b.textContent = `${i+1}. ${o}`;
        b.onclick = ()=>{ tries++; if (i===q.ans) done(); else { b.classList.add('no'); b.disabled = true; $('dlgText').innerHTML = `<span style="color:var(--warn);font-weight:700">다시 생각해 볼까요? ${esc(q.hint)}</span><br>` + esc(val(q.q)); } }; box.appendChild(b); });
    };
    const done = ()=>{
      log.quizzes++; if (tries===1) log.firstTry++; log.wrong += tries-1; log.hints.push({id:q.id, tries, sec:Math.round((performance.now()-t0)/1000)});
      $('dlgOpts').innerHTML = ''; $('dlgTitle').textContent = q.kind==='short' ? `안내판 복구 완료: "${q.ansText}"` : '정답이에요!';
      $('dlgText').innerHTML = esc(val(q.ok));
      $('dlgExtra').innerHTML = (q.sign ? `<div class="sign">${esc(q.sign).replace('[ ]', `<span class="blank">${esc(q.ansText)}</span>`)}</div>` : '') + (q.id==='C1' ? `<div class="camp"><b>캠페인</b>${esc(q.camp)}</div>` : '') + refsHTML(q.refs);
      if (q.id!=='C1'){ $('dlgExtra').innerHTML += `<div class="pcard"><b>${KEY_SVG} 열쇠 획득! 열쇠에 새겨진 제안 · ${Q_LVL[q.id]} 단계</b>${esc(q.camp)}</div>`; }
      if (Q_STAT[q.id]) $('dlgExtra').innerHTML += `<div class="refs"><span>통계로 보기</span>${statBtn(Q_STAT[q.id], STATS[Q_STAT[q.id]].t)}</div>`;
      bindRefs($('dlg')); bindStats($('dlg')); speak(val(q.ok)); document.querySelector('#dlg .body').scrollTop = 0;
      addNote({id:q.id, title:q.title, lesson:q.lesson, refs:q.refs, issue:q.issue});
      hist(`사회문제 ${q.issue} · ${ISSUE[q.issue]}`, q.title, $('dlgText').innerHTML + $('dlgExtra').innerHTML);
      if (q.id!=='C1' && !cards.some(c=>c.id===q.id)) cards.push({id:q.id, lvl:Q_LVL[q.id], text:q.camp, issue:q.issue, title:q.title});
      const foot = $('dlgFoot'); foot.innerHTML = ''; const b = document.createElement('button'); b.className = 'btn'; b.textContent = q.id==='C1' ? '다음' : '열쇠 받기'; const bk = backBtn(true); if (bk) foot.appendChild(bk); b.onclick = ()=>{ dlgClose(); res(); }; foot.appendChild(b); if (!MOBILE) b.focus({preventScroll:true});
    };
    ask(false);
  });
}
function addNote(n){ if (notes.some(x=>x.id===n.id)) return; notes.push(n); const c = $('noteN'); c.hidden = false; c.textContent = notes.length; }
function bindRefs(root){ root.querySelectorAll('.ref, sup.r').forEach(b=>b.onclick = e=>{ e.stopPropagation(); openNotebook('refs', +b.dataset.ref); }); }

/* ================= 시트 ================= */
const hold = document.createElement('div'); hold.hidden = true; document.body.appendChild(hold);
let sheetStack = [];
function openSheet(content, o={}){
  const p = $('panel'); [...p.children].forEach(ch=>{ if (ch.dataset && ch.dataset.keep) hold.appendChild(ch); }); p.innerHTML = '';
  p.className = 'panel card' + (o.wide ? ' wide' : '');
  if (typeof content === 'string') p.innerHTML = content; else p.appendChild(content);
  if (o.close){ const x = document.createElement('button'); x.className = 'x'; x.setAttribute('aria-label','닫기'); x.textContent = '×'; x.onclick = ()=>closeSheet(); p.appendChild(x); }
  $('sheet').hidden = false; p.scrollTop = 0; bindRefs(p); bindStats(p); sheetOnClose = o.onClose || null; setSafe(); return p;
}
let sheetOnClose = null;
function closeSheet(){ const p = $('panel'); [...p.children].forEach(ch=>{ if (ch.dataset && ch.dataset.keep) hold.appendChild(ch); }); $('sheet').hidden = true; const f = sheetOnClose; sheetOnClose = null; setSafe(); if (f) f(); }
addEventListener('keydown', e=>{ if (e.key==='Escape' && !$('sheet').hidden && $('panel').querySelector('.x')) closeSheet(); });

/* 화면 안전 영역 → 카메라 */
function setSafe(){
  const d = $('dlg'), side = $('side');
  const top = MOBILE ? 150 : 120;
  let b = MOBILE ? 50 : 80, r = 20;
  if (!d.hidden) b = Math.max(b, d.offsetHeight + (MOBILE ? 20 : 90));
  if (!side.hidden){ if (MOBILE) b = side.offsetHeight + 20; else r = side.offsetWidth + 40; }
  CAM.safe = {t: side.hidden ? top : (MOBILE ? 70 : 100), b, l: MOBILE ? 10 : 30, r, fitB: MOBILE ? b : 24};
}
new ResizeObserver(()=>setSafe()).observe($('dlg'));

/* ================= 입력 ================= */
const FIELDS = {age:[19,100,'세'], ht:[100,230,'cm'], wt:[20,250,'kg'], wc:[40,200,'cm'], ra:[0.5,8,'kg'], la:[0.5,8,'kg'], rl:[2,20,'kg'], ll:[2,20,'kg'], smi:[3,15,'kg/m²'], pbf:[3,70,'%'], pha:[2,12,'°'], ecw:[0.30,0.45,'']};
let sex = null, mmode = 'limb'; const flags = {};
const recNode = document.createElement('div'); recNode.dataset.keep = '1'; recNode.appendChild($('tplReception').content.cloneNode(true)); hold.appendChild(recNode);
function segInit(id, cb){ const el = $(id); el.querySelectorAll('button').forEach(b=>b.onclick=()=>{ el.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false')); b.setAttribute('aria-pressed','true'); cb(b.dataset.v); }); }
function segSet(id, v){ $(id).querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.v===String(v)))); }
segInit('segSex', v=>{ sex = +v; $('b_sex').innerHTML = ''; });
segInit('segMode', v=>{ mmode = v; document.querySelectorAll('[data-g]').forEach(f=>f.hidden = f.dataset.g !== v); });
const num = s => { if (s==null) return NaN; s = String(s).trim().replace(',', '.'); return s==='' ? NaN : Number(s); };
function setBadge(k, kind){ const f = document.querySelector(`.field[data-k="${k}"] .l`); if (!f) return; f.querySelectorAll('.badge').forEach(b=>b.remove());
  if (kind){ const b = document.createElement('span'); b.className = 'badge' + (kind==='check'?' w':''); b.textContent = kind==='check' ? '확인 필요' : '결과지에서 읽음'; f.appendChild(b); } }
Object.keys(FIELDS).forEach(k=>{ $('f_'+k).addEventListener('input', ()=>{ setBadge(k, null); flags[k] = null; checkField(k); }); });
function checkField(k){
  const fld = document.querySelector(`.field[data-k="${k}"]`); const wrap = fld.querySelector('.unitwrap'), msg = fld.querySelector('.msg');
  const v = num($('f_'+k).value), [lo,hi,u] = FIELDS[k]; wrap.classList.remove('bad','warn'); msg.className = 'msg'; msg.textContent = '';
  if (!Number.isFinite(v)){ if ($('f_'+k).value.trim()){ wrap.classList.add('bad'); msg.textContent = '숫자로 입력해 주세요.'; return false; } return null; }
  if (k==='ht' && v>1 && v<2.5){ wrap.classList.add('warn'); msg.className='msg w'; msg.textContent = `미터로 입력한 것 같아요. ${Math.round(v*1000)/10} cm가 맞나요?`; return false; }
  if (k==='pbf' && v>0 && v<1){ wrap.classList.add('warn'); msg.className='msg w'; msg.textContent = `비율로 읽힌 것 같아요. ${Math.round(v*1000)/10}%가 맞나요?`; return false; }
  if (k==='ecw' && v>=1 && v<1000){ wrap.classList.add('warn'); msg.className='msg w'; msg.textContent = '세포외수분비는 0.36~0.40 정도의 소수예요. 소수점을 확인해 주세요.'; return false; }
  if (v<lo || v>hi){ wrap.classList.add('bad'); msg.textContent = `보통 ${lo}~${hi}${u} 범위예요. 단위와 소수점을 확인해 주세요.`; return false; }
  if (flags[k]==='check'){ wrap.classList.add('warn'); msg.className='msg w'; msg.textContent = '사진에서 읽은 값이 흐릿했어요. 결과지와 같은지 확인해 주세요.'; }
  return true;
}
function readForm(){
  const v = {sex, mode:mmode, dev:$('f_dev').value}; let ok = true; const missing = [];
  for (const k of Object.keys(FIELDS)) v[k] = num($('f_'+k).value);
  const need = ['age','ht','wt','pbf', ...(mmode==='limb' ? ['ra','la','rl','ll'] : ['smi'])];
  if (!sex) missing.push('성별');
  need.forEach(k=>{ const r = checkField(k); if (r===null){ missing.push(document.querySelector(`.field[data-k="${k}"] .l`).childNodes[0].textContent.trim()); ok = false; } else if (r===false) ok = false; });
  ['wc','pha','ecw'].forEach(k=>{ if (checkField(k)===false) ok = false; });
  return {v, ok: ok && !missing.length, missing};
}
$('form').addEventListener('submit', e=>{
  e.preventDefault(); const {v, ok, missing} = readForm(); const m = $('formMsg'); m.className = 'msg';
  if (!ok){ m.textContent = missing.length ? `빈 칸을 채워 주세요: ${missing.join(', ')}` : '표시된 칸을 확인해 주세요.'; const first = document.querySelector('#panel .unitwrap.bad, #panel .unitwrap.warn'); if (first) first.scrollIntoView({block:'center', behavior:'smooth'}); return; }
  m.textContent = '';
  if (v.age < 40) return useDemo('39세 이하는 연구모형 적용 대상이 아니라서 예시 값으로 체험해요.');
  if (v.dev==='other') return useDemo('연구모형은 InBody 970 측정값으로 만들어져서, 다른 기기는 예시 값으로 체험해요.');
  current = v; demo = false; toAvatar();
});
$('backStart').onclick = ()=>openConsent();
function useDemo(why){
  demo = true; demoWhy = why;
  current = {sex:1, age:55, ht:176, wt:66, wc:82, mode:'limb', ra:2.9, la:2.9, rl:8.6, ll:8.5, pbf:22.5, pha:NaN, ecw:NaN, dev:'970'};
  toast(why); toAvatar();
}

