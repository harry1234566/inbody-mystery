/* ================= 통계 설명 · 지난 설명 ================= */
function openStat(k){
  const S = STATS[k]; if (!S) return; const saved = pushSheet();
  openSheet(`<p class="eyebrow">STATISTICS · 집현전 분석</p><h2>${esc(S.t)}</h2>${S.html()}${refsHTML(S.refs)}`, {close:true, wide:true, onClose: saved ? ()=>popSheet(saved) : null});
}
function openHistory(i, saved){
  if (!HIST.length) return; if (saved===undefined) saved = pushSheet(); i = clamp(i, 0, HIST.length-1); const h = HIST[i];
  openSheet(`<p class="eyebrow">지난 설명 다시 보기 · ${i+1} / ${HIST.length}</p><div class="small" style="color:var(--green);font-weight:700">${esc(h.who||'')}</div><h2>${esc(h.title||'')}</h2><div class="histbody">${h.html}</div>
    <div class="nav"><button class="btn ghost" id="hPrev" ${i===0?'disabled':''}>‹ 이전</button><span class="cnt">${i+1} / ${HIST.length}</span><button class="btn ghost" id="hNext" ${i===HIST.length-1?'disabled':''}>다음 ›</button></div>
    <div class="row"><button class="btn" id="hNow">지금 화면으로 돌아가기</button></div>`, {close:true, wide:true, onClose: saved ? ()=>popSheet(saved) : null});
  $('hPrev').onclick = ()=>openHistory(i-1, saved); $('hNext').onclick = ()=>openHistory(i+1, saved); $('hNow').onclick = ()=>closeSheet();
  $('panel').querySelectorAll('.histbody button:not(.ref):not(.qbtn)').forEach(b=>b.disabled = true);
}

/* ================= 내 정보 카드 (방 바깥 빈 공간 / 모바일은 버튼) ================= */
function infoBody(full){
  if (!current) return '<p class="small">접수 후에 보여요.</p>';
  const v = current, bmi = v.wt/((v.ht/100)**2), smi = v.mode==='smi' ? v.smi : (v.ra+v.la+v.rl+v.ll)/((v.ht/100)**2), R = result ? ROOMS[result.room] : null;
  const row = (k, val, st) => `<dt>${k}</dt><dd>${val}${st ? statBtn(st) : ''}</dd>`;
  return `<div class="npc" style="margin:8px 0"><img class="av" src="${PIC.me || ''}" alt="" style="width:52px;height:52px"><div><b>${R ? `${R.no} · ${R.name}` : '결과 상담 전'}</b><span class="small">${v.sex===1?'남성':'여성'} · ${v.age}세${demo ? ' · 예시 값' : ''}</span></div></div>
    <dl class="kv">${row('키', `${f1(v.ht)} cm`)}${row('체중', `${f1(v.wt)} kg`)}${row('BMI', `${f1(bmi)} kg/m²`, 'ranges')}${Number.isFinite(v.wc) ? row('허리둘레', `${f1(v.wc)} cm`, 'ranges') : row('허리둘레', '입력 안 함')}
      ${row('근육지수', `${f1(smi)} kg/m²`, 'relative')}${row('체지방률', `${f1(v.pbf)} %`, 'relative')}${Number.isFinite(v.pha) ? row('위상각', `${f1(v.pha)}°`, 'phase') : ''}${Number.isFinite(v.ecw) ? row('세포외수분비', `${v.ecw}`, 'phase') : ''}</dl>
    <p class="small"><b>캐릭터</b> 몸 너비 ← BMI, 배 ← 허리둘레/키, 키 ← 입력한 키.${healthy ? ' 탈출 후에는 실천으로 만들 "미래의 나" 모습으로 바뀌었어요(상징).' : ''} 체형은 건강 상태를 뜻하지 않아요. ${statBtn('ranges')}</p>
    <p class="small"><b>데이터의 의미</b> 모두 BIA(인바디) 값이에요. 같은 사람을 DXA로 재면 근육지수는 약 1 kg/m² 낮게(가중 평균 남 0.96, 여 1.01), 체지방률은 약 5.4~6.6%p 높게 나왔어요. ${statBtn('ba')}</p>
    <p class="small"><b>자료</b> ${DATA_INFO.source}, 40세 이상 ${DATA_INFO.n.toLocaleString()}명, 복합표본 가중치 적용. 단위: 키·허리둘레 cm, 체중 kg, BMI·근육지수 kg/m², 체지방률 %. ${statBtn('datainfo')}</p>
    <p class="small"><b>주의</b> 수치의 위치는 상대적 위치일 뿐 건강 상태를 확정하지 않아요.</p>
    ${full && result ? `<h3>내 수치는 어디쯤?</h3>${myGauges(current, result)}${posNotice()}` : ''}
    <div class="acts"><button class="btn ghost sm" data-act="ranges">내 수치 범위</button>${result ? '<button class="btn ghost sm" data-act="result">결과·계산 과정</button>' : ''}</div>`;
}
function bindInfo(root){ bindStats(root); bindRefs(root);
  root.querySelectorAll('[data-act]').forEach(b=>b.onclick = ()=>{ if (b.dataset.act==='result'){ const s = stage; showResult(); } else openRanges(); }); }
function openRanges(){ if (!result && current) result = null; const saved = pushSheet(); const r = result || predict(current);
  openSheet(`<p class="eyebrow">MY NUMBERS</p><h2>내 수치는 어디쯤?</h2>${myGauges(current, r)}${STATS.ranges.html()}${refsHTML([1,28,7,10,27])}`, {close:true, wide:true, onClose: saved ? ()=>popSheet(saved) : null}); }
let infoOpen = false;
function renderInfo(){
  const c = $('infoCard'); if (c.hidden) return;
  c.classList.toggle('closed', !infoOpen);
  c.innerHTML = `<button type="button" class="ih" aria-expanded="${infoOpen}">내 정보 · 데이터 의미 <span style="margin-left:auto">${infoOpen ? '▾' : '▸'}</span></button><div class="ib">${infoBody(false)}</div>`;
  c.querySelector('.ih').onclick = ()=>{ infoOpen = !infoOpen; renderInfo(); }; bindInfo(c);
}
function showInfo(){ $('infoCard').hidden = false; $('infoBtn').hidden = false; infoOpen = !MOBILE; renderInfo(); }
$('infoBtn').onclick = ()=>{ const saved = pushSheet(); openSheet(`<p class="eyebrow">MY CARD</p><h2>내 정보와 데이터의 의미</h2>${infoBody(true)}`, {close:true, wide:true, onClose: saved ? ()=>popSheet(saved) : null}); bindInfo($('panel')); };

/* ================= 결과 받아보기: 이미지 · 인쇄 · 텍스트 · 공유 ================= */
function copyText(t, ok){ const fb = ()=>{ const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast(ok); } catch(e){ toast('복사하지 못했어요. 길게 눌러 복사해 주세요'); } ta.remove(); };
  try { navigator.clipboard.writeText(t).then(()=>toast(ok), fb); } catch(e){ fb(); } }
function confirmBtn(b, fn){ let armed = false; const orig = b.textContent; b.onclick = ()=>{ if (!armed){ armed = true; b.textContent = '한 번 더 누르면 처음부터 시작해요'; setTimeout(()=>{ armed = false; b.textContent = orig; }, 4000); } else fn(); }; }
function reportText(withVals){
  const R = ROOMS[roomKey || (result && result.room) || 'balance'], r = result || predict(current), L = [];
  L.push('[방탈출 게임: 인바디 미스터리 · 집현전 보건소 결과]', '');
  L.push(`■ 연구모형이 예측한 상대적 분류 유형: ${R.name} (교육용 분류, 진단 아님)`);
  L.push(`  DXA로 쟀다면 분류가 바뀔 확률 — 근육 ${pctTxt(r.pm)}, 체지방 ${pctTxt(r.pf)}`);
  if (withVals && current){ const RG = RANGES[`${r.sx}_${r.band}`] || {}; L.push(`  내 BIA 값: 근육지수 ${f1(r.smi)} kg/m²(같은 성별·연령대 ${RG.bia_smi ? pctPhrase(r.smi, RG.bia_smi) : '-'}), 체지방률 ${f1(current.pbf)}%(${RG.bia_pbf ? pctPhrase(current.pbf, RG.bia_pbf) : '-'}), BMI ${f1(r.bmi)}${Number.isFinite(current.wc) ? `, 허리둘레 ${f1(current.wc)} cm` : ''}`); }
  L.push('', '■ 내가 모은 열쇠에 새겨진 제안'); cards.forEach(c=>L.push(`  - [${c.lvl}] ${c.text}`)); if (!cards.length) L.push('  (없음)');
  L.push('', '■ 우리 사회의 4가지 문제'); ISSUES.forEach(x=>L.push(`  ${x.k} ${x.name}: ${x.why}`));
  L.push('', '■ 보건소 3단계 실천 계획'); LEVELS.forEach(lv=>L.push(`  ${lv.h}: ${lv.items[0][0]}`));
  if (pledged.size && roomKey){ L.push('', '■ 나의 다짐'); [...pledged].forEach(i=>L.push(`  - ${ROOMS[roomKey].pledges[i]}`)); }
  L.push('', '■ 자료와 기준', `  출처: ${DATA_INFO.source}`, `  대상: 40세 이상 BIA·DXA 동시 측정 ${DATA_INFO.n.toLocaleString()}명(남 ${DATA_INFO.nSex[1].toLocaleString()}, 여 ${DATA_INFO.nSex[2].toLocaleString()})`, `  가중치: ${DATA_INFO.weight}`, '  단위: 키·허리둘레 cm, 체중 kg, BMI·근육지수 kg/m², 체지방률 %', '  기준 문헌: AWGS 2025·2019(근육), 대한비만학회 2022(BMI·허리둘레), Bland·Altman 1986, Landis·Koch 1977, TRIPOD+AI 2024');
  L.push('', '■ 꼭 읽어 주세요', '  ' + POS_NOTICE.replace(/<[^>]+>/g,''));
  L.push('', CONSULT, '', '근거: 국민건강영양조사 2024 원시자료 분석(집현전), Kyle 2004, Bland·Altman 1986, WHO 2020, AWGS 2025, 대한비만학회 2022 등', `다시 해 보기: ${shareUrl()}`, 'TEAM 집현전 · 성균관대학교 2026-2 융합연구학점제');
  return L.join('\n');
}
function wrapLines(g, text, maxW){ const out = []; for (const para of String(text).split('\n')){ let line = ''; for (const ch of para){ if (g.measureText(line + ch).width > maxW && line){ out.push(line); line = ch; } else line += ch; } out.push(line); } return out; }
async function reportImage(withVals){
  const W = 1080, P = 72, cv = document.createElement('canvas'), g = cv.getContext('2d'); const R = ROOMS[roomKey || result.room], r = result || predict(current);
  const blocks = [];
  const T = (t, size, wt=500, col='#1f2b26', gap=10) => blocks.push({t, size, wt, col, gap});
  T('인바디 미스터리 탈출!', 60, 800, '#2f6f5e', 6); T(`${R.no} · ${R.name} — ${R.camp}`, 34, 700, '#b8573c', 24);
  T(`연구모형이 예측한 상대적 분류 유형 (교육용, 진단 아님)`, 26, 500, '#5f6b64', 4);
  T(`DXA로 쟀다면 분류가 바뀔 확률: 근육 ${pctTxt(r.pm)} · 체지방 ${pctTxt(r.pf)}`, 32, 700, '#1f2b26', 22);
  if (withVals){ const RG = RANGES[`${r.sx}_${r.band}`] || {}; T(`내 BIA 값: 근육지수 ${f1(r.smi)} kg/m² (같은 성별·연령대 ${RG.bia_smi ? pctPhrase(r.smi, RG.bia_smi) : '-'}) · 체지방률 ${f1(current.pbf)}% (${RG.bia_pbf ? pctPhrase(current.pbf, RG.bia_pbf) : '-'}) · BMI ${f1(r.bmi)}`, 26, 500, '#1f2b26', 22); }
  T('내가 모은 열쇠에 새겨진 제안', 32, 800, '#2f6f5e', 8); cards.forEach(c=>T(`· [${c.lvl}] ${c.text}`, 25, 500, '#1f2b26', 6)); blocks[blocks.length-1].gap = 22;
  T('우리 사회의 4가지 문제', 32, 800, '#2f6f5e', 8); ISSUES.forEach(x=>T(`${x.k} ${x.name} — ${x.why}`, 24, 500, '#1f2b26', 6)); blocks[blocks.length-1].gap = 22;
  if (pledged.size && roomKey){ T('나의 다짐', 32, 800, '#2f6f5e', 8); [...pledged].forEach(i=>T(`✓ ${ROOMS[roomKey].pledges[i]}`, 28, 600, '#1f2b26', 6)); blocks[blocks.length-1].gap = 22; }
  T('자료와 기준', 32, 800, '#2f6f5e', 8); T(`출처: ${DATA_INFO.source} · 대상: 40세 이상 BIA·DXA 동시 측정 ${DATA_INFO.n.toLocaleString()}명(남 ${DATA_INFO.nSex[1].toLocaleString()}, 여 ${DATA_INFO.nSex[2].toLocaleString()}) · 가중치: 복합표본(층·집락·wt_itvex) · 단위: 키·허리둘레 cm, 체중 kg, BMI·근육지수 kg/m², 체지방률 % · 기준 문헌: AWGS 2025·2019, 대한비만학회 2022, Bland·Altman 1986, TRIPOD+AI 2024`, 22, 500, '#1f2b26', 14);
  T(POS_NOTICE.replace(/<[^>]+>/g,''), 23, 600, '#b8573c', 18);
  T(CONSULT, 24, 500, '#a86a10', 10);
  // 높이 계산
  let y = 330; for (const b of blocks){ g.font = `${b.wt} ${b.size}px ${FONT}`; b.lines = wrapLines(g, b.t, W - P*2); y += b.lines.length * b.size * 1.42 + b.gap; }
  const H = y + 360; cv.width = W; cv.height = H;
  g.fillStyle = '#f4f3ec'; g.fillRect(0,0,W,H); g.fillStyle = '#fbfaf5'; rr(g, 30, 30, W-60, H-60, 40); g.fill();
  g.fillStyle = '#2f6f5e'; rr(g, P, 70, 84, 84, 22); g.fill(); g.fillStyle = '#fff'; g.font = `600 64px Outfit, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText('+', P+42, 135);
  g.textAlign = 'left'; g.fillStyle = '#1f2b26'; g.font = `800 42px ${FONT}`; g.fillText('집현전 보건소', P+108, 110); g.fillStyle = '#5f6b64'; g.font = `500 19px Outfit, sans-serif`; g.fillText('J I P H Y E O N J E O N   H E A L T H   C E N T E R', P+110, 145);
  const img = new Image(); img.src = PIC.me || portrait(avOpts()); await new Promise(r=>{ img.onload = r; img.onerror = r; });
  g.fillStyle = '#e4efe8'; g.beginPath(); g.arc(W-P-70, 112, 70, 0, Math.PI*2); g.fill(); try { g.save(); g.beginPath(); g.arc(W-P-70, 112, 70, 0, Math.PI*2); g.clip(); g.drawImage(img, W-P-140, 42, 140, 140); g.restore(); } catch(e){}
  y = 260; for (const b of blocks){ g.font = `${b.wt} ${b.size}px ${FONT}`; g.fillStyle = b.col; for (const ln of b.lines){ y += b.size*1.42; g.fillText(ln, P, y); } y += b.gap; }
  y += 30; g.fillStyle = '#e4efe8'; rr(g, P, y, W-P*2, 250, 24); g.fill(); g.textAlign = 'center';
  g.fillStyle = '#2f6f5e'; g.font = `800 40px ${FONT}`; g.fillText('숫자 하나보다, 내 몸 전체를.', W/2, y+90);
  g.fillStyle = '#8a948d'; g.font = `500 22px ${FONT}`; g.fillText('교육·캠페인용이며 의학적 진단이 아닙니다', W/2, y+150); g.fillText('TEAM 집현전 · 성균관대 2026-2 URP', W/2, y+190); g.textAlign = 'left';
  return cv;
}
function printReport(withVals){
  const r = result || predict(current), R = ROOMS[roomKey || r.room];
  $('printArea').innerHTML = `<h1>방탈출 게임: 인바디 미스터리 · 집현전 보건소 결과</h1><p>${R.no} · ${R.name} (교육용 분류, 진단 아님)</p>
    <p>DXA로 쟀다면 분류가 바뀔 확률: 근육 ${pctTxt(r.pm)}, 체지방 ${pctTxt(r.pf)}</p>
    ${withVals ? `<h2>내 수치는 어디쯤?</h2>${myGauges(current, r)}<h2>계산 과정</h2>${procHTML(current, r)}` : ''}
    <h2>자료 출처 · 대상자 수 · 가중치 · 단위 · 기준 문헌</h2>${dataInfoTable()}<p><b>꼭 읽어 주세요.</b> ${POS_NOTICE}</p>
    <h2>내가 모은 열쇠에 새겨진 제안</h2><ul>${cards.map(c=>`<li>[${c.lvl}] ${esc(c.text)}</li>`).join('')}</ul>
    <h2>우리 사회의 4가지 문제</h2><ul>${ISSUES.map(x=>`<li><b>${x.k} ${x.name}</b> ${x.fact} ${x.why}</li>`).join('')}</ul>
    <h2>보건소 3단계 실천 계획</h2>${LEVELS.map(L=>`<h3>${L.h}</h3><ul>${L.items.map(([t])=>`<li>${t}</li>`).join('')}</ul>`).join('')}
    <p>${CONSULT}</p><h2>참고문헌</h2><ol>${Object.entries(REFS).map(([k,v])=>`<li value="${k}">${esc(v.t)}</li>`).join('')}</ol>
    <p>${shareUrl()}</p>`;
  setTimeout(()=>{ try { window.print(); } catch(e){ toast('인쇄를 열 수 없어요. 리포트 이미지를 저장해 주세요'); } }, 100);
}
function openShare(){
  const saved = pushSheet();
  openSheet(`<p class="eyebrow">SHARE</p><h2>링크로 공유</h2><p>이 게임 주소를 보내면 휴대폰에서도 바로 할 수 있어요.</p><p class="small" style="word-break:break-all">${shareUrl()}</p>
    <div class="acts"><button class="btn ghost sm" id="shCopy">링크 복사</button><button class="btn ghost sm" id="shShare">공유하기</button></div>`, {close:true, onClose: saved ? ()=>popSheet(saved) : null});
  $('shCopy').onclick = ()=>copyText(shareUrl(), '링크를 복사했어요');
  $('shShare').onclick = async ()=>{ try { await navigator.share({title:'방탈출 게임: 인바디 미스터리', text:'집현전 보건소 방탈출 게임: 인바디 미스터리 · 숫자 너머 내 몸 바로알기', url:shareUrl()}); } catch(e){ copyText(shareUrl(), '공유 창 대신 링크를 복사했어요'); } };
}
function deliver(){
  stage = 'end'; chapter('CHAPTER 11 · TAKE HOME', '결과 받아보기', '이미지·인쇄·텍스트로 결과를 가져가세요.'); pill('11 — 보건소 로비 · 결과 받아보기');
  openSheet(`<p class="eyebrow">CHAPTER 11 · TAKE HOME</p><h2>결과 받아보기</h2>
    <p class="small">예측 결과, 내가 모은 열쇠의 제안, 사회적 메시지, 다짐, 근거를 가져갈 수 있어요.</p>
    <label class="check"><input type="checkbox" id="withVals"> 내 측정값(근육지수·체지방률·BMI)도 포함하기</label>
    <h3>저장·캡처</h3><div class="acts"><button class="btn" id="repImgBtn">리포트 이미지 만들기</button><button class="btn ghost" id="repPrint">인쇄 · PDF로 저장</button><button class="btn ghost" id="repCopy">내용 복사</button><button class="btn ghost" id="repShare">공유하기</button><button class="btn ghost" id="repTxt">텍스트 파일로 저장</button></div>
    <div id="repWrap" hidden><img id="repImg" alt="결과 리포트 이미지" style="width:100%;border-radius:14px;margin-top:12px;border:1px solid var(--line)"><div class="acts"><button class="btn" id="repDl">이미지 내려받기</button><button class="btn ghost" id="repImgShare">이미지 공유</button></div><p class="small">내려받기가 안 되면 이미지를 길게 눌러 저장하세요.</p></div>
    <h3>게임 링크</h3><p class="small" style="word-break:break-all">${shareUrl()}</p><button class="btn ghost sm" id="dlCopyLink">링크 복사</button>
    <div class="nav"><button class="btn ghost" id="dvPrev">‹ 다짐으로</button><button class="btn ghost" id="dvNote">탐험 수첩</button><button class="btn" id="dvAgain">처음부터 다시</button></div>`, {wide:true, close:true, onClose:()=>{ objective('수고하셨어요! 보건소장님이나 간호사에게 가면 결과를 다시 받을 수 있어요.'); play(); }});
  let blob = null;
  $('repImgBtn').onclick = async ()=>{ const cv = await reportImage($('withVals').checked); const url = cv.toDataURL('image/png'); $('repImg').src = url; $('repWrap').hidden = false; cv.toBlob(b=>blob = b, 'image/png'); $('repWrap').scrollIntoView({behavior:'smooth', block:'start'}); };
  $('repImgShare').onclick = async ()=>{ try { await navigator.share({files:[new File([blob], 'inbody-mystery-result.png', {type:'image/png'})], title:'방탈출 게임: 인바디 미스터리 결과'}); } catch(e){ toast('공유를 열 수 없어요. 이미지를 길게 눌러 저장해 주세요'); } };
  $('repDl').onclick = ()=>{ if (blob) saveFile('inbody-mystery-result.png', blob); else toast('잠시 후 다시 눌러 주세요'); };
  $('repTxt').onclick = ()=>saveFile('inbody-mystery-result.txt', reportText($('withVals').checked));
  $('repPrint').onclick = ()=>printReport($('withVals').checked);
  $('repCopy').onclick = ()=>copyText(reportText($('withVals').checked), '결과 내용을 복사했어요');
  $('repShare').onclick = async ()=>{ try { await navigator.share({title:'방탈출 게임: 인바디 미스터리 결과', text:reportText($('withVals').checked)}); } catch(e){ copyText(reportText($('withVals').checked), '공유 창 대신 내용을 복사했어요'); } };
  $('dlCopyLink').onclick = ()=>copyText(shareUrl(), '링크를 복사했어요');
  $('dvPrev').onclick = ()=>{ sheetOnClose = null; pledgeCard(); }; $('dvNote').onclick = ()=>openNotebook('cards');
  confirmBtn($('dvAgain'), ()=>{ sheetOnClose = null; closeSheet(); restart(); });
}

/* 파일 저장: claude.ai 안에서는 downloads 기능(보는 사람이 확인), 직접 배포한 페이지에서는 일반 내려받기 */
async function saveFile(filename, data){
  try { if (window.claude && claude.use){ const d = await claude.use('downloads'); if (d){ await d.save({filename, data}); toast('저장했어요'); return; } } }
  catch(e){ if (e && e.code==='declined') return; if (e && e.code==='rate_limited'){ toast('잠시 후 다시 눌러 주세요'); return; } }
  try { const blob = data instanceof Blob ? data : new Blob([data], {type:'text/plain;charset=utf-8'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove(); }
  catch(e){ toast('저장하지 못했어요. 이미지를 길게 눌러 저장해 주세요'); }
}

function shareUrl(){ try { const u = location.href.split('#')[0]; if (/^https?:/.test(u) && !/claudeusercontent|claude\.ai/.test(u)) return u; } catch(e){} return SHARE_URL; }
