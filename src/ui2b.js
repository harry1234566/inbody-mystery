/* ================= 로비 장면 (이야기: 시민 조사관 → 열쇠 → 보건소장께 제안서) ================= */
function lobbyHS(){
  clearHS();
  addHS({id:'nurse', label:'접수 · 간호사', icon:'talk', pos:[0.6,2.75,-2.6], stand:[0.6,-1.35], look:[0.6,-3.3],
    main:()=>stage==='intro' || stage==='consult', show:()=>stage!=='avatar',
    use: async ()=>{
      if (stage==='intro'){ openConsent(); return; }
      if (stage==='consult' || stage==='door'){ showResult(); return; }
      if (stage==='tv'){ await say('간호사', '접수됐어요! 상담 준비하는 동안 왼쪽 벽의 <b>대기실 TV</b>에서 첫 단서를 찾아보세요.'); play(); return; }
      if (stage==='end'){ deliver(); return; }
      await say('간호사', '오른쪽 위 <b>탐험 수첩</b>에 모은 단서, 열쇠, 근거 문헌, 통계 설명이 모두 있어요.'); play(); }});
  addHS({id:'tv', label:'대기실 TV', pos:[-7.7,3.15,-2.4], stand:[-6.5,-2.4], look:[-8,-2.4], pov:true, ty:2.0, main:()=>stage==='tv', show:()=>!['intro','avatar'].includes(stage), done:()=>notes.some(n=>n.id==='C1'),
    use: async ()=>{
      if (stage==='tv'){ chapter('CHAPTER 04 · WAITING ROOM', '대기실의 단서', '대기실 TV의 캠페인 퀴즈를 풀어 보세요.');
        await say('대기실 TV', '보건소 캠페인 방송: "방탈출 게임: 인바디 미스터리! 인바디 숫자 하나에 숨은 이야기를 함께 풀어 봐요." 첫 단서를 찾아보세요.', {btns:['풀어 보기']}); await quiz(Q.C1);
        stage = 'consult'; await say('간호사', '첫 단서를 찾으셨네요. 숫자 하나로 단정하면 안 되는 이유예요. 이제 방문자님 결과를 같이 볼게요. <b>접수 창구</b>로 와 주세요.'); objective('접수 창구에서 결과 상담을 받으세요.'); pill('04 — 보건소 로비 · 대기실'); play(); return; }
      await say('대기실 TV', `다시 보기: ${esc(Q.C1.lesson)}`, {extra:refsHTML(Q.C1.refs) + `<div class="refs"><span>통계로 보기</span>${statBtn('kappa', STATS.kappa.t)}</div>`}); play(); }});
  addHS({id:'inbody', label:'체성분 측정기', pos:[-6.7,2.2,-4.8], stand:[-5.6,-3.9], look:[-6.7,-4.8], pov:true, ty:1.2, show:()=>!['intro','avatar'].includes(stage), done:()=>notes.some(n=>n.id==='inbody'), use:()=>clue('inbody')});
  addHS({id:'board', label:'동네 건강 게시판', pos:[6.9,2.95,-5.9], stand:[6.4,-4.7], look:[6.9,-6], pov:true, ty:1.85, show:()=>!['intro','avatar'].includes(stage), done:()=>notes.some(n=>n.id==='board'), use:()=>clue('board')});
  for (const [k,d] of Object.entries(DOORS)){ const R = ROOMS[k]; const L = d.side==='L';
    addHS({id:'door_'+k, icon:'door', label:`${R.no} · ${R.name}`, pos: L ? [-7.9,3.35,d.u] : [d.u,3.35,-5.9], stand: L ? [-6.75,d.u] : [d.u,-4.75], look: L ? [-8,d.u] : [d.u,-6],
      show:()=>result && result.room===k && (stage==='door'), main:()=>stage==='door', use:()=>enterRoom(k)}); }
  addHS({id:'doctor', label:'보건소장 · 의사', icon:'talk', pos:[-2.4,2.75,-1.7], stand:[-2.0,-0.45], look:[-2.4,-1.7], pov:true, ty:1.55, show:()=>stage==='doctor' || stage==='end', main:()=>stage==='doctor',
    use: async ()=>{ if (stage==='doctor') await ending(); else { await say('의사', '제안서 고마워요. 결과와 제안서는 언제든 다시 받아 볼 수 있어요.', {btns:['결과 받아보기']}); deliver(); } }});
}
async function clue(id){
  const c = CLUES[id]; addNote({id, title:c.title, lesson:c.lesson, refs:c.refs});
  const st = id==='inbody' ? 'bia_dxa' : 'survey';
  await say('안내', c.html, {title:`${c.name} · ${c.title}`, extra:refsHTML(c.refs) + `<div class="refs"><span>통계로 보기</span>${statBtn(st, STATS[st].t)}</div>`, wide:true}); play();
}
function introHint(){ play(); say('간호사', '안녕하세요, 집현전 보건소예요! <b>방탈출 게임: 인바디 미스터리</b>에 오신 걸 환영해요. 요즘 우리 동네엔 인바디 숫자 하나로 "난 괜찮다" 안심하거나 "큰일 났다" 걱정하는 분이 많아요. 보건소장님이 <b>"숫자 너머 내 몸 바로알기" 정책 제안서</b>를 만들고 계신데, 방문자님이 <b>시민 조사관</b>이 되어 단서를 모아 주실래요? 먼저 접수부터 도와드릴게요.', {btns:['접수하기'], free:true}).then(()=>{ if (stage==='intro') openConsent(); }); }

async function toWaiting(){
  stage = 'tv'; play(); dlgClose(); showInfo();
  chapter('CHAPTER 04 · WAITING ROOM', '대기실의 단서', '왼쪽 벽의 대기실 TV를 조사하세요.'); pill('04 — 보건소 로비 · 대기실');
  await say('간호사', '진료 카드 완성! 결과 상담을 준비할게요. 그동안 <b>대기실 TV</b>에서 첫 단서를 찾고, 측정기와 게시판도 둘러보세요. 왼쪽 <b>내 정보</b> 카드에서 입력값의 의미도 볼 수 있어요.', {btns:['둘러보기']}); play();
}

/* ================= 결과 상담: 예측 + 내 수치 범위 + 계산 과정(참고문헌) ================= */
const pctTxt = p => p < 0.01 ? '1% 미만' : p > 0.99 ? '99% 이상' : Math.round(p*100) + '%';
const per100 = p => Math.max(0, Math.min(100, Math.round(p*100)));
function iconArray(p, avg){ const n = per100(p), a = per100(avg); let h = '<div class="iconarr" aria-hidden="true">'; for (let i=0;i<100;i++) h += `<i class="${i<n?'on':''}${i===a-1?' avg':''}"></i>`; return h + '</div>'; }
const sup = ids => ids.map(i=>`<sup class="r" data-ref="${i}">[${i}]</sup>`).join('');
const f2 = x => (Math.round(x*100)/100).toFixed(2);
function procHTML(v, r){
  const R = ROOMS[r.room], sd = CFG.sd[r.sx], sxT = r.sx===1 ? '남성' : '여성';
  const smiStep = v.mode==='smi' ? `근육지수(SMI): 결과지 값 <b>${f1(r.smi)}</b> kg/m²` : `근육지수(SMI) = 팔·다리 근육량 합 ÷ 키² = (${[v.ra,v.la,v.rl,v.ll].map(f1).join(' + ')}) ÷ ${(v.ht/100).toFixed(2)}² = <b>${f1(r.smi)}</b> kg/m²`;
  const steps = [
    [`BMI = 체중 ÷ 키² = ${f1(v.wt)} ÷ ${(v.ht/100).toFixed(2)}² = <b>${f1(r.bmi)}</b> kg/m²`, [10], 'ranges'],
    [smiStep, [1,27], 'bia_dxa'],
    [`근육 상대 기준선: ${sxT}·${r.band}세 가중 하위 20% = ${f2(r.cut.smi)} kg/m² → 거리 = (${f1(r.smi)} − ${f2(r.cut.smi)}) ÷ ${f2(sd.smi)} = <b>${r.dist_m.toFixed(2)} SD</b>`, [1,7], 'distance'],
    [`체지방 상대 기준선: ${sxT}·${r.band}세 가중 상위 20% = ${f1(r.cut.pbf)}% → 거리 = (${f1(r.cut.pbf)} − ${f1(v.pbf)}) ÷ ${f2(sd.pbf)} = <b>${r.dist_f.toFixed(2)} SD</b>`, [1], 'relative'],
    [`BIA 분류: 근육 <b>${r.bm ? '상대적 하위군' : '하위군 아님'}</b>, 체지방 <b>${r.bf ? '상대적 상위군' : '상위군 아님'}</b>`, [1], 'kappa'],
    [`연구모형(${r.sx===1?'남':'여'}성 · ${r.bm?'하위군→아님':'아님→하위군'} 근육 모형${r.hasWc ? '' : ', 허리둘레 제외'} / ${r.bf?'상위군→아님':'아님→상위군'} 체지방 모형) → DXA로 재면 분류가 바뀔 확률: 근육 <b>${pctTxt(r.pm)}</b>, 체지방 <b>${pctTxt(r.pf)}</b>`, [1,18,19], 'model'],
    [`방 배정 규칙: 바뀔 확률 50% 이상이면 그 축의 분류를 바꿈 → <b>${R.no} · ${R.name}</b>`, [1], 'rule50']];
  const used = [...new Set(steps.flatMap(s=>s[1]))].sort((a,b)=>a-b);
  return `<ol class="proc">${steps.map(([t,rf,st])=>`<li>${t}${sup(rf)} ${statBtn(st)}</li>`).join('')}</ol>
    <ol class="foot">${used.map(i=>`<li value="${i}">${esc(REFS[i].t)}</li>`).join('')}</ol>`;
}
function showResult(){
  result = result || predict(current); const R = ROOMS[result.room];
  ctx = {pbf:current.pbf, smi:result.smi, sex:result.sx, dm:result.dist_m, df:result.dist_f}; renderInfo();
  const ax = [
    {name:'근육', p:result.pm, avg:result.rm, bia: result.bm ? 'BIA 기준: 근육 상대적 하위군' : 'BIA 기준: 근육 상대적 하위군 아님', q: result.bm ? 'DXA로 쟀다면 하위군이 아닐 가능성' : 'DXA로 쟀다면 하위군일 가능성'},
    {name:'체지방', p:result.pf, avg:result.rf, bia: result.bf ? 'BIA 기준: 체지방 상대적 상위군' : 'BIA 기준: 체지방 상대적 상위군 아님', q: result.bf ? 'DXA로 쟀다면 상위군이 아닐 가능성' : 'DXA로 쟀다면 상위군일 가능성'}];
  const fs = factors(current, result); if (current.dev==='unknown') fs.push('측정 기기를 모른다고 했어요. InBody 970이 아니면 결과가 맞지 않을 수 있어요.');
  const html = `<div class="steps" aria-hidden="true"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div>
    <p class="eyebrow">CHAPTER 05 · CONSULTATION</p><h2>예측 결과와 추가 DXA 검사 고려 안내</h2>
    <div class="npc"><img src="${PIC.nurse}" alt=""><div><b>보건소 간호사</b><span>진단이 아니라, 연구모형이 내 인바디 결과를 DXA와 비교해 예측한 내용이에요.</span></div></div>
    ${demo ? `<p><span class="ex">체험 모드 · 예시 값</span> <span class="small">${esc(demoWhy)}</span></p>` : ''}
    <div class="small">연구모형이 예측한 상대적 분류 유형 <b>(게임의 방을 정하기 위한 교육용 분류)</b> ${statBtn('rule50','방은 어떻게 정해요?')}</div>
    <div class="type">${R.no} · ${R.name}</div>
    <p class="small">${R.why}</p>
    ${ax.map(a=>`<div class="axis"><div class="top"><span class="name">${a.name} ${statBtn('model')}</span><span class="bia">${a.bia}</span></div>
      <div class="q">${a.q} <span class="pct">${pctTxt(a.p)}</span></div>${iconArray(a.p, a.avg)}
      <div class="small">나와 비슷한 사람 100명 중 약 ${per100(a.p)}명꼴(초록 점)이에요. 같은 성별·연령대에서 같은 BIA 분류였던 사람들은 평균 ${per100(a.avg)}명꼴(노란 테두리)이었어요.</div></div>`).join('')}
    <h3>내 수치는 어디쯤? ${statBtn('ranges','그래프 보는 법')}</h3>
    ${myGauges(current, result)}
    ${dataInfoBox(result)}
    ${result.ext && result.ext.length ? `<div class="posn warnx"><b>입력값 확인</b> 아래 값은 연구 자료의 대부분(가중 1~99%)이 있는 범위 밖이라, 확률은 참고로만 보세요.<ul class="facts">${result.ext.map(t=>`<li>${t}</li>`).join('')}</ul></div>` : ''}
    <h3>주요 판단 요인 ${statBtn('distance')} ${statBtn('shape','체형')}</h3><ul class="facts">${fs.map(t=>`<li>${t}</li>`).join('')}</ul>
    <h3>계산 과정 ${statBtn('model','모형 자세히')}</h3>${procHTML(current, result)}
    <div class="trust"><b>이 분류를 얼마나 믿을 수 있나요?</b><dl>
      <dt>목적</dt><dd>게임의 방을 정하기 위한 교육용 분류예요. 진단이나 검사 권고에 쓰지 않아요.</dd>
      <dt>자료</dt><dd>${DATA_INFO.source}, 40세 이상 ${DATA_INFO.n.toLocaleString()}명(남 ${DATA_INFO.nSex[1].toLocaleString()}, 여 ${DATA_INFO.nSex[2].toLocaleString()}), 복합표본 가중치(wt_itvex) 적용. ${statBtn('datainfo')}</dd>
      <dt>적용 대상</dt><dd>40세 이상, InBody 970 측정값. 다른 기기나 연령에는 맞지 않을 수 있어요.</dd>
      <dt>기준</dt><dd>같은 성별·연령대 안의 상대적 위치(근육 하위 20%, 체지방 상위 20%). ${statBtn('relative')}</dd>
      <dt>성능</dt><dd>중첩 교차검증 AUC: 근육 0.89~0.92, 체지방 0.84, 반대 방향 0.70~0.81. 보정 기울기 0.85~0.98. ${statBtn('model')}</dd>
      <dt>불확실성</dt><dd>2024년 한 해 자료로 만든 모형이라 외부 검증은 아직이에요. 같은 조건의 사람도 실제 결과는 달라질 수 있어요.</dd></dl>
      ${refsHTML([1,28,7,18,19,20])}</div>
    <p class="say">${CONSULT}</p>
    <div class="row"><button class="btn" id="toRoomBtn">${stage==='consult' ? `조사 구역으로: ${R.no} · ${R.name}` : '닫기'}</button></div>`;
  openSheet(html, {close:stage!=='consult', wide:true}); hist('간호사', '예측 결과와 계산 과정', html);
  chapter('CHAPTER 05 · CONSULTATION', '결과 상담', '예측 결과를 확인하세요.'); pill('05 — 보건소 로비 · 결과 상담');
  $('toRoomBtn').onclick = ()=>{ closeSheet(); if (stage!=='consult') return; stage = 'door';
    objective(`${R.no} · ${R.name} 문으로 가세요.`); pill(`05 — 보건소 로비 → ${R.name}`);
    say('간호사', `방문자님의 조사 구역은 <b>${R.name}</b>(${R.space})이에요. 이 방에서는 ${R.focus}을 조사해요. 미션 4개를 풀 때마다 <b>열쇠</b>가 하나씩 모이고, 4개가 모이면 출구가 열려요. 열쇠마다 새겨진 제안이 보건소장님께 드릴 제안서가 돼요.`, {btns:['조사하러 가기']}).then(play); };
}

/* ================= 방 ================= */
async function enterRoom(k){
  const d = DOORS[k], R = ROOMS[k]; mode = 'busy';
  await openDoor(d, 1); const L = d.side==='L'; await walkTo(L ? -7.3 : d.u, L ? d.u : -5.3); await fade(true);
  roomKey = k; place = 'room'; visited.add(k); buildRoom(k); roomHS(k); player.root.position.set(ROOM_DOOR_U, 0, -4.4); player.facing = 0; player.path = [];
  DOORS.exit.open = 1; DOORS.exit.piv.rotation.y = -1.35; CAM.init = false; updateCamera(0);
  $('keyChip').hidden = false; updateKeys(); await fade(false);
  chapter(`CHAPTER 06 · ${R.en}`, R.name, '미션 4개를 풀어 열쇠를 모으세요.'); pill(`06 — ${R.space} · ${R.name}`);
  await openDoor(DOORS.exit, 0); toast('문이 잠겼어요! 열쇠 4개를 모으면 열려요');
  const fs = factors(current, result).slice(0,3);
  await say('안내', `${R.space}에 들어왔어요. 이 방의 정책 과제는 <b>"${R.camp}"</b>예요. 미션 4개는 각각 사회문제 ①인바디 숫자 미스터리 ②검사 접근성 ③잘못된 정보 ④체형 편견과 이어져요. 반짝이는 표시를 눌러 시작하세요.`, {btns:['조사 시작'], wide:true, title:'이 방에 온 이유',
    extra:`<div class="box"><ul class="facts"><li>${R.why}</li>${fs.map(t=>`<li>${t}</li>`).join('')}</ul></div><p class="small">교육용 분류이며 의학적 진단이 아니에요. ${statBtn('rule50','방 배정 규칙')}</p>`});
  play();
}
const PROP_TY = {inbody:1.15, chart:1.2, sign:1.3, bench:0.85, dxa:0.8, tape:1.3, mirror:1.2, frame:1.15, ruler:1.4, grip:0.9, dumbbell:0.95, poster:1.15, hanger:1.2, laptop:1.0, scale:0.9, rx:1.15};
function roomHS(k){
  clearHS(); const R = ROOMS[k];
  R.qs.forEach((qid,i)=>{ const sl = SLOTS[i], q = Q[qid];
    addHS({id:qid, label:`${i+1}. ${q.name}`, pos:[sl.p[0], sl.y, sl.p[1]], stand:sl.s, look:sl.p, pov:true, ty:PROP_TY[PROPSET[k][i]] || 1.1, main:()=>true, done:()=>!!q.solved,
      use: async ()=>{ if (q.solved){ await say('안내', esc(q.lesson), {title:q.title, extra:refsHTML(q.refs) + (Q_STAT[q.id] ? `<div class="refs"><span>통계로 보기</span>${statBtn(Q_STAT[q.id], STATS[Q_STAT[q.id]].t)}</div>` : '')}); play(); return; }
        await quiz(q); q.solved = true; updateKeys(); const n = R.qs.filter(id=>Q[id].solved).length;
        toast(n===4 ? '🔑 열쇠 4개 완성! 출구로 가 보세요' : `🔑 열쇠를 얻었어요 (${n}/4)`); if (n===4) objective('출구 문을 눌러 제안서를 들고 나가세요.'); play(); }}); });
  addHS({id:'exit', icon:'door', label:()=>`출구 · 🔑 ${R.qs.filter(id=>Q[id].solved).length}/4`, pos:[ROOM_DOOR_U, 3.35, -4.9], stand:[ROOM_DOOR_U, -3.75], look:[ROOM_DOOR_U,-5],
    lock:()=>!R.qs.every(id=>Q[id].solved), lockMsg:()=>'미션 4개를 풀어 열쇠를 모두 모으면 문이 열려요', main:()=>R.qs.every(id=>Q[id].solved), use:exitRoom});
}
function updateKeys(){ if (!roomKey) return; const n = ROOMS[roomKey].qs.filter(id=>Q[id].solved).length; [...$('keyChip').querySelectorAll('i')].forEach((el,i)=>el.classList.toggle('on', i<n));
  if (DOORS.slots) DOORS.slots.forEach((m,i)=>{ m.color.copy(lin(i<n ? '#f2c14e' : '#bfb49a')); m.emissive = lin(i<n ? '#8a6420' : '#000000'); }); }
async function exitRoom(){
  mode = 'busy'; toast('🔑 열쇠 4개가 맞춰졌어요. 문이 열립니다!'); await sleep(500); await openDoor(DOORS.exit, 1); await walkTo(ROOM_DOOR_U, -4.75); await fade(true);
  const k = roomKey; place = 'lobby'; buildLobby(); lobbyHS(); const d = DOORS[k]; d.open = 1; d.piv.rotation.y = -1.35; const L = d.side==='L';
  player.root.position.set(L ? -7.2 : d.u, 0, L ? d.u : -5.2); player.facing = L ? Math.PI/2 : 0; player.path = [];
  doctor.root.visible = true; $('keyChip').hidden = true; stage = 'doctor'; CAM.init = false; updateCamera(0); await fade(false);
  chapter('CHAPTER 07 · THE PROPOSAL', '제안서 전달', '보건소장님께 정책 제안서를 전해 주세요.'); pill('07 — 보건소 로비 · 보건소장실 앞');
  await walkTo(L ? -6.2 : d.u, L ? d.u : -4.3); openDoor(d, 0);
  await poofTransform();
  await say('간호사', '펑! 열쇠 4개를 모두 모은 덕분에 한결 건강해진 모습이에요. 꾸준한 실천으로 만들 수 있는 <b>미래의 나</b>예요. 다만 진짜 건강은 겉모습이 아니라 근력, 허리둘레, 혈액 지표처럼 몸 안을 함께 봐야 알 수 있어요. 이제 보건소장님께 제안서를 전해 주세요.', {btns:['제안서 들고 가기']}); play();
}

/* ================= 마무리: 내 결과 → 내 제안서 → 사회문제 → 보건소 실천 계획 → 팀 ================= */
function endPages(){
  const R = ROOMS[roomKey], mine = R.qs.map(id=>Q[id]); const myLv = new Set(cards.map(c=>c.lvl));
  const ISTAT = {'①':'absrel','②':'model','③':'bia_dxa','④':'shape'};
  return [
    ['나의 결과와 단서', `<p class="eyebrow">CHAPTER 07 · MY CLUES</p><h2>방문자님이 찾은 단서</h2>
      <div class="npc"><img src="${PIC.doctor}" alt=""><div><b>보건소장 · 의사</b><span>${R.doctor}</span></div></div>
      ${mine.map(q=>`<div class="clue"><span class="tagI">${q.issue} ${ISSUE[q.issue]}</span><b>${esc(q.lesson)}</b><div class="s">${refTag(q.refs)} ${Q_STAT[q.id] ? statBtn(Q_STAT[q.id]) : ''}</div></div>`).join('')}
      <p class="say">${CONSULT}</p>`],
    ['나의 정책 제안서', `<p class="eyebrow">CHAPTER 07 · MY PROPOSAL</p><h2>방문자님의 정책 제안서</h2>
      <p class="small">${R.name}에서 모은 열쇠 4개에 새겨진 제안이에요. 각 제안은 단서(연구 결과)에서 나왔어요.</p>
      ${cards.map(c=>`<div class="pcard"><b>${c.issue} ${ISSUE[c.issue]} → ${c.lvl} 단계</b>${esc(c.text)}<div class="s small">출발한 단서: ${esc(Q[c.id].title)}</div></div>`).join('') || '<p class="small">모은 열쇠가 없어요.</p>'}`],
    ['우리 사회의 4가지 문제', `<p class="eyebrow">CHAPTER 08 · OUR SOCIETY</p><h2>이건 나만의 문제가 아니에요</h2>
      <p class="small">방문자님의 열쇠에 새겨진 제안은 우리 사회가 함께 풀어야 할 네 가지 문제와 이어져요. 국민건강영양조사 2024 분석과 선행 연구로 확인한 내용이에요.</p>
      ${ISSUES.map(x=>`<div class="issue"><span class="k">${x.k}</span><div><h4>${x.name} ${statBtn(ISTAT[x.k])}</h4><p>${x.fact}</p><p class="why">${x.why}</p><div class="refs">${refTag(x.refs)}</div>${cards.filter(c=>c.issue===x.k).map(c=>`<div class="small" style="color:var(--green);font-weight:700">내 열쇠: ${esc(c.text)}</div>`).join('')}</div></div>`).join('')}`],
    ['보건소 실천 계획 3단계', `<p class="eyebrow">CHAPTER 08 · OUR PLAN</p><h2>보건소장님이 채택한 3단계 계획</h2>
      <p class="small">개인의 노력만으로는 부족해요. 이미 있는 검진·보건소·돌봄 자원을 체성분 결과와 잇는 것이 핵심이에요. 방문자님의 열쇠 제안이 들어간 단계에는 ✓ 표시가 있어요.</p>
      ${LEVELS.map(L=>`<div class="lvl"><h4>${myLv.has(L.h) ? '✓ ' : ''}${L.h} <small>${L.sub}</small></h4><ul>${L.items.map(([t,e])=>`<li>${t}<span class="ev">근거: ${e.map(x=>x==='팀' ? '팀 제안' : `[${x}] ${esc(REFS[x].s)}`).join(' · ')}</span></li>`).join('')}</ul></div>`).join('')}
      <p class="small">"팀 제안"은 연구 결과에서 출발한 집현전의 정책 제안이며, 효과는 아직 검증되지 않았어요.</p>`],
    ['집현전이 해낸 것', `<p class="eyebrow">TEAM 집현전 · 2026 URP</p><h2>이 게임 뒤의 연구</h2>
      <ul class="facts">
        <li>국민건강영양조사 2024의 40세 이상 3,187명을 복합표본 설계로 분석했어요. ${statBtn('survey')}</li>
        <li>같은 사람도 BIA와 DXA의 상대 분류가 엇갈렸어요(카파 0.53~0.62, 해소 31~38%). ${statBtn('kappa')} ${statBtn('ba','두 기기 차이')}</li>
        <li>엇갈림은 기준선과의 거리·키·마른 체형·몸통 지방과 관련됐어요. ${statBtn('shape')} ${statBtn('fat_signal')}</li>
        <li>간단한 정보로 그 가능성을 예측하는 모형을 만들고 중첩 교차검증했어요(AUC 0.84~0.92). ${statBtn('model')}</li>
        <li>같은 절대 기준을 두 기기에 쓰면 불일치가 훨씬 커진다는 민감도 분석으로 상대 기준의 이유를 확인했어요. ${statBtn('absrel')}</li></ul>
      <div class="box"><b>한계</b><p class="small" style="margin:4px 0 0">2024년 한 해 자료 · 외부 검증 전 · 40세 이상·InBody 970 기준 · 연관성 분석(인과 아님) · 체지방 20% 기준은 탐색적</p></div>
      <h3>이 체험의 설계 근거</h3>
      ${DESIGN.map(([t,d,r])=>`<div class="clue"><b>${t}</b><span class="small">${d}</span><div class="s">${refTag(r)}</div></div>`).join('')}`]
  ];
}
function pager(i, onDone){
  const pages = endPages(); i = clamp(i, 0, pages.length-1); const [t, html] = pages[i];
  openSheet(html + `<div class="nav"><button class="btn ghost" id="pgPrev" ${i===0?'disabled':''}>‹ 이전</button><span class="cnt">${i+1} / ${pages.length}</span><button class="btn" id="pgNext">${i===pages.length-1 ? '체험 평가로 ›' : '다음 ›'}</button></div>`, {wide:true});
  hist('보건소장', t, html);
  if (i===2){ chapter('CHAPTER 08 · OUR SOCIETY', '함께 푸는 숙제', '체성분 숫자를 둘러싼 4가지 사회문제'); pill('08 — 보건소 로비 · 우리 사회'); }
  $('pgPrev').onclick = ()=>pager(i-1, onDone); $('pgNext').onclick = ()=>{ if (i===pages.length-1){ closeSheet(); onDone(); } else pager(i+1, onDone); };
}
let endIdx = 0;
async function ending(){
  const R = ROOMS[roomKey]; mode = 'busy'; doctor.facing = Math.atan2(player.root.position.x-doctor.root.position.x, player.root.position.z-doctor.root.position.z);
  await say('의사', `시민 조사관님, 열쇠 ${cards.length}개로 인바디 미스터리를 풀고 방을 탈출하셨군요! 열쇠에 새겨진 제안을 모아 제안서를 만들어 볼게요. 먼저 방문자님 결과부터 정리해 볼게요. 연구모형이 예측한 상대적 분류 유형은 <b>${R.name}</b>이었어요.`, {btns:['제안서 펼치기']});
  pager(0, survey);
}
function survey(){
  stage = 'end'; player.wave = true; chapter('CHAPTER 09 · YOUR VOICE', '체험 평가', '1분이면 끝나요.'); pill('09 — 보건소 로비 · 체험 평가');
  const opt = (k, arr, h) => `<div class="chips${h?' h':''}" data-k="${k}">${arr.map((a,i)=>`<button type="button" data-i="${i}" aria-pressed="${sv[k]===i}">${a}</button>`).join('')}</div>`;
  openSheet(`<p class="eyebrow">CHAPTER 09 · YOUR VOICE</p><h2>체험 평가 (1분)</h2><p class="small">팀이 퀴즈 난이도와 메시지 전달을 개선하는 데 써요. 건강 수치는 들어가지 않아요.</p>
    <div class="qlab">1. 퀴즈 난이도는 어땠나요?</div>${opt('level',['쉬웠어요','적당했어요','어려웠어요'],true)}
    <div class="qlab">2. 인바디와 DXA 결과가 다를 수 있는 이유를 이해했나요?</div>${opt('under',['잘 이해했어요','조금 이해했어요','잘 모르겠어요'],true)}
    <div class="qlab">3. 가장 기억에 남는 사회문제는?</div>${opt('msg',ISSUES.map(x=>x.k+' '+x.name))}
    <div class="qlab">4. 가장 필요하다고 생각하는 변화는?</div>${opt('act',['개인: 같은 조건에서 재고, 근력·허리둘레 함께 보기','지역사회: 보건소 체성분 검사에 근력 검사·운동교실 연계','보건정책: 결과지 표준 안내와 검진 상담 연계'])}
    <div class="nav"><button class="btn ghost" id="svPrev">‹ 이전</button><button class="btn" id="svDone">다짐 고르기 ›</button></div>`, {wide:true});
  $('panel').querySelectorAll('.chips').forEach(g=>g.querySelectorAll('button').forEach(b=>b.onclick=()=>{ g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false')); b.setAttribute('aria-pressed','true'); sv[g.dataset.k] = +b.dataset.i; }));
  $('svPrev').onclick = ()=>pager(4, survey); $('svDone').onclick = pledgeCard;
}
function recordText(){
  const sec = Math.round((performance.now()-(log.start||performance.now()))/1000), m = Math.floor(sec/60), s = sec%60;
  const L = ['쉬움','적당','어려움'], U = ['잘 이해','조금 이해','모름'], A = ['개인','지역사회','보건정책'];
  return `[방탈출 게임: 인바디 미스터리 체험 기록] 방: ${ROOMS[roomKey].name}${demo?'(체험 모드)':''} | 소요 ${m}분 ${s}초 | 퀴즈 ${log.quizzes}개 중 첫 시도 정답 ${log.firstTry}개, 오답 ${log.wrong}회 | 단서 ${notes.length}개 | 난이도: ${sv.level==null?'-':L[sv.level]} | 이해: ${sv.under==null?'-':U[sv.under]} | 기억에 남는 문제: ${sv.msg==null?'-':ISSUES[sv.msg].name} | 필요한 변화: ${sv.act==null?'-':A[sv.act]} | 문항별 시도·초: ${log.hints.map(h=>`${h.id}:${h.tries}/${h.sec}s`).join(',')}`;
}
const pledged = new Set([0]);
function pledgeCard(){
  const R = ROOMS[roomKey];
  chapter('CHAPTER 10 · MY PLEDGE', '나의 다짐', '다짐을 고르고 결과를 받아 가세요.'); pill('10 — 보건소 로비 · 나의 다짐');
  openSheet(`<p class="eyebrow">CHAPTER 10 · MY PLEDGE</p><h2>나의 건강관리 다짐</h2><p class="small">제안서의 "개인" 단계는 방문자님의 실천에서 시작돼요. "${R.camp}"에 함께할 다짐을 골라 주세요.</p><div class="chips" id="chips"></div>
    <details class="box"><summary>체험 기록 보기 (팀 파일럿 테스트용)</summary><p class="small" id="recTxt" style="margin:6px 0;word-break:break-all"></p><button class="btn ghost sm" id="copyRec">기록 복사</button></details>
    <div class="nav"><button class="btn ghost" id="plPrev">‹ 이전</button><button class="btn" id="plNext">결과 받아보기 ›</button></div>`, {wide:true});
  R.pledges.forEach((p,i)=>{ const b = document.createElement('button'); b.textContent = p; b.setAttribute('aria-pressed', String(pledged.has(i)));
    b.onclick = ()=>{ pledged.has(i) ? pledged.delete(i) : pledged.add(i); b.setAttribute('aria-pressed', String(pledged.has(i))); }; $('chips').appendChild(b); });
  $('recTxt').textContent = recordText();
  $('copyRec').onclick = ()=>copyText(recordText(), '기록을 복사했어요');
  $('plPrev').onclick = survey; $('plNext').onclick = ()=>{ if (!pledged.size){ toast('다짐을 하나 이상 골라 주세요'); return; } deliver(); };
}
function restart(){
  player.wave = false; result = null; current = null; demo = false; roomKey = null; stage = 'intro'; place = 'lobby';
  Object.assign(log, {start:0, wrong:0, firstTry:0, quizzes:0, hints:[]}); Object.assign(sv, {level:null, under:null, msg:null, act:null}); notes.length = 0; cards.length = 0; HIST.length = 0; visited.clear(); pledged.clear(); pledged.add(0); $('noteN').hidden = true;
  Object.values(Q).forEach(q=>q.solved = false); PIC.me = ''; healthy = false; $('infoCard').hidden = true; $('infoBtn').hidden = true; $('keyChip').hidden = true;
  $('form').reset(); sex = null; segSet('segSex', 0); Object.keys(FIELDS).forEach(k=>checkField(k));
  buildLobby(); lobbyHS(); player.root.position.set(-1.5,0,3.2); player.facing = Math.PI/4; CAM.mode = 'room'; dlgClose();
  chapter('CHAPTER 01 · THE LOBBY', '인바디 미스터리의 시작', '접수 창구에서 탐험을 시작하세요.'); pill('01 — 보건소 로비 · 접수 / 상담'); introHint();
}

/* 펑! 연기 속에서 건강한 체형으로 */
const FX = []; let poofAt = null;
const smokeMat = () => new THREE.MeshBasicMaterial({color:0xfbfaf4, transparent:true, opacity:0.9, depthWrite:false});
async function poofTransform(){
  const p = player.root.position.clone(); poofAt = new THREE.Vector3(p.x, 1.2, p.z);
  const el = $('poof'); el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  for (let i=0;i<18;i++){ const a = i/18*Math.PI*2, r0 = 0.15 + Math.random()*0.2, m = new THREE.Mesh(sph(0.32, 14, 10), smokeMat()); m.position.set(p.x + Math.cos(a)*r0, 0.3 + Math.random()*1.3, p.z + Math.sin(a)*r0); world.add(m);
    const dir = new THREE.Vector3(Math.cos(a), 0.25 + Math.random()*0.5, Math.sin(a)).multiplyScalar(0.9 + Math.random()*0.6), s0 = 0.6 + Math.random()*0.6;
    FX.push({m, t:0, life:1.3 + Math.random()*0.4, step:(f,k)=>{ const e = 1 - Math.pow(1-k, 3); f.m.position.addScaledVector(dir, 0.016*(1-k)*3); f.m.scale.setScalar(s0*(0.5 + e*1.6)); f.m.material.opacity = 0.9*(1-k); }}); }
  try { navigator.vibrate && navigator.vibrate(60); } catch(e){}
  await sleep(380);
  healthy = true; const f = player.facing; rebuildPlayer(); player.facing = f;
  for (let i=0;i<14;i++){ const m = new THREE.Mesh(sph(0.06, 8, 6), M('#f2c14e', 0.4, {emissive:'#f2c14e', ei:0.9})); m.position.set(p.x + (Math.random()-0.5)*1.2, 0.4 + Math.random()*1.4, p.z + (Math.random()-0.5)*1.2); world.add(m);
    FX.push({m, t:0, life:1.1 + Math.random()*0.6, step:(f,k)=>{ f.m.position.y += 0.012; f.m.scale.setScalar(1 - k); }}); }
  player.wave = true; await sleep(1100); player.wave = false; poofAt = null; el.classList.remove('on');
  PIC.me = portrait(avOpts()); renderInfo();
}
