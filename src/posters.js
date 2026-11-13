/* ================= 그림 포스터 (우리 연구·근거 기반) ================= */
const PK = {ink:'#24302e', mut:'#6b756f', green:'#2f6f5e', sage:'#a9cdb9', coral:'#d98468', blue:'#5f88b5', yel:'#e9c46a', lav:'#8a74b3', skin:'#f3cfae', paper:'#fbf7ee'};
function pPerson(c, x, y, s, col, o={}){ // x,y = 발 위치, s = 키(px)
  const w = (o.w || 1), hr = s*0.13;
  c.fillStyle = o.skin || PK.skin; c.beginPath(); c.arc(x, y - s + hr, hr, 0, Math.PI*2); c.fill();
  c.fillStyle = col; rr(c, x - s*0.16*w, y - s + hr*2.1, s*0.32*w, s*0.42, s*0.1*Math.min(w,1.3)); c.fill();
  if (o.belly){ c.beginPath(); c.ellipse(x + s*0.05*w, y - s*0.5, s*0.18*w, s*0.14, 0, 0, Math.PI*2); c.fill(); }
  c.fillStyle = o.leg || '#3b4455'; c.fillRect(x - s*0.12*w, y - s*0.36, s*0.1*Math.max(0.9,w*0.9), s*0.36); c.fillRect(x + s*0.02*w, y - s*0.36, s*0.1*Math.max(0.9,w*0.9), s*0.36);
  c.strokeStyle = col; c.lineWidth = s*0.07*Math.min(1.2, w); c.lineCap = 'round'; c.beginPath(); c.moveTo(x - s*0.15*w, y - s*0.68); c.lineTo(x - s*0.24*w, y - s*0.42); c.moveTo(x + s*0.15*w, y - s*0.68); c.lineTo(x + s*0.24*w, y - s*0.42); c.stroke();
}
function pText(c, t, x, y, size, col=PK.ink, wt=700, align='center'){ c.font = `${wt} ${size}px ${FONT}`; c.fillStyle = col; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(t, x, y); }
function pIcons(c, x, y, w, n, on, colOn, colOff='#e1dccf', cols=10, hmax=1e9){ const s = Math.min(w/cols, hmax/Math.ceil(n/cols)); x += (w - s*cols)/2; for (let i=0;i<n;i++){ const cx = x + (i%cols)*s + s/2, cy = y + Math.floor(i/cols)*s + s/2; c.fillStyle = i < on ? colOn : colOff; c.beginPath(); c.arc(cx, cy - s*0.12, s*0.17, 0, Math.PI*2); c.fill(); rr(c, cx - s*0.2, cy + s*0.05, s*0.4, s*0.3, s*0.12); c.fill(); } }
const POSTERS = {
  bia_dxa:{t:'BIA와 DXA는 어떻게 잴까?', cap:'원리가 달라 같은 몸도 다르게 읽혀요', src:'Kyle 2004 · Lee·Gallagher 2008', draw:(c,x,y,w,h)=>{
    pPerson(c, x + w*0.25, y + h*0.92, h*0.8, PK.sage); c.strokeStyle = PK.yel; c.lineWidth = w*0.012; c.beginPath();
    for (let i=0;i<7;i++){ const yy = y + h*(0.25 + i*0.09); c.lineTo(x + w*0.25 + (i%2 ? 1 : -1)*w*0.05, yy); } c.stroke();
    pText(c, 'BIA: 전류·수분', x + w*0.25, y + h*0.04, h*0.065);
    c.fillStyle = '#e3e8e8'; rr(c, x + w*0.55, y + h*0.62, w*0.4, h*0.12, 8); c.fill(); c.fillStyle = '#cfe3dc'; c.fillRect(x + w*0.57, y + h*0.6, w*0.36, h*0.03);
    c.fillStyle = 'rgba(95,136,181,.35)'; c.fillRect(x + w*0.68, y + h*0.18, w*0.1, h*0.42); c.fillStyle = '#9aa5b1'; c.fillRect(x + w*0.62, y + h*0.14, w*0.22, h*0.05);
    pText(c, 'DXA: X선 흡수', x + w*0.75, y + h*0.04, h*0.065); }},
  agree100:{t:'인바디 해당군 100명 중', cap:'31~38명은 DXA로는 해당하지 않았어요', src:'본 연구 · 국민건강영양조사 2024', draw:(c,x,y,w,h)=>{ pIcons(c, x + w*0.05, y, w*0.9, 100, 34, PK.coral, PK.sage, 10, h); }},
  issues4:{t:'체성분 숫자의 4가지 사회문제', cap:'집현전이 찾은 숙제', src:'본 연구', draw:(c,x,y,w,h)=>{
    [['①','수치 맹신',PK.coral],['②','검사 접근성',PK.blue],['③','잘못된 정보',PK.yel],['④','체형 편견',PK.lav]].forEach(([n,t,col],i)=>{ const cx = x + (i%2)*w/2, cy = y + Math.floor(i/2)*h/2;
      c.fillStyle = col; rr(c, cx + w*0.03, cy + h*0.03, w*0.44, h*0.44, 14); c.fill(); pText(c, n, cx + w*0.25, cy + h*0.18, h*0.13, '#fff', 800); pText(c, t, cx + w*0.25, cy + h*0.35, h*0.075, '#fff', 700); }); }},
  measure:{t:'정확한 측정 체크리스트', cap:'삽입형 의료기기(심장박동기 등) 착용 시 측정 금지', src:'인바디 측정 유의사항 · Kyle 2004 II', draw:(c,x,y,w,h)=>{
    ['오전 · 공복 · 운동 전','측정 전 화장실','가벼운 옷 · 금속 제거','상온에서 측정','사우나·목욕 직후 피하기'].forEach((t,i)=>{ const yy = y + h*(0.08 + i*0.2); c.strokeStyle = PK.green; c.lineWidth = h*0.018; c.strokeRect(x + w*0.08, yy - h*0.06, h*0.12, h*0.12);
      c.beginPath(); c.moveTo(x + w*0.08 + h*0.03, yy); c.lineTo(x + w*0.08 + h*0.06, yy + h*0.04); c.lineTo(x + w*0.08 + h*0.12, yy - h*0.05); c.stroke(); pText(c, t, x + w*0.08 + h*0.2, yy, h*0.075, PK.ink, 600, 'left'); }); }},
  move:{t:'모두에게 같은 권고', cap:'주 150분 유산소 + 주 2일 근력', src:'WHO 2020', draw:(c,x,y,w,h)=>{
    pPerson(c, x + w*0.3, y + h*0.95, h*0.75, PK.green); c.fillStyle = PK.blue; const dx = x + w*0.72, dy = y + h*0.55; c.fillRect(dx - w*0.12, dy - h*0.015, w*0.24, h*0.03); [-1,1].forEach(sd=>{ rr(c, dx + sd*w*0.12 - w*0.04, dy - h*0.08, w*0.08, h*0.16, 6); c.fill(); });
    pText(c, '150분', x + w*0.3, y + h*0.08, h*0.12, PK.green, 800); pText(c, '주 2일', x + w*0.72, y + h*0.3, h*0.12, PK.blue, 800); }},
  ba_fat:{t:'BIA 체지방률은 더 낮게', cap:'DXA보다 평균 남 5.2·여 6.5%p 낮음 (±6%p)', src:'본 연구 · Bland·Altman 1986', draw:(c,x,y,w,h)=>{
    c.strokeStyle = '#c9c2b0'; c.lineWidth = 2; c.strokeRect(x + w*0.05, y, w*0.9, h*0.9); const my = y + h*0.55;
    c.strokeStyle = PK.coral; c.lineWidth = 4; c.beginPath(); c.moveTo(x + w*0.05, my); c.lineTo(x + w*0.95, my); c.stroke(); c.setLineDash([8,6]); c.lineWidth = 2; [-1,1].forEach(sd=>{ c.beginPath(); c.moveTo(x + w*0.05, my + sd*h*0.28); c.lineTo(x + w*0.95, my + sd*h*0.28); c.stroke(); }); c.setLineDash([]);
    c.strokeStyle = '#8a948d'; c.beginPath(); c.moveTo(x + w*0.05, y + h*0.2); c.lineTo(x + w*0.95, y + h*0.2); c.stroke(); pText(c, '0 (차이 없음)', x + w*0.8, y + h*0.14, h*0.05, PK.mut, 500);
    for (let i=0;i<60;i++){ const r1 = Math.sin(i*12.9898)*43758.5453, r2 = Math.sin(i*78.233)*12345.678; const fx = r1 - Math.floor(r1), fy = r2 - Math.floor(r2); c.fillStyle = 'rgba(47,111,94,.6)'; c.beginPath(); c.arc(x + w*(0.1 + fx*0.8), my + (fy - 0.5)*h*0.5, 4, 0, Math.PI*2); c.fill(); } }},
  waist:{t:'줄자 하나로 확인해요', cap:'복부비만: 허리둘레 남 90 · 여 85 cm 이상', src:'대한비만학회 2022 · 국가건강검진', draw:(c,x,y,w,h)=>{
    pPerson(c, x + w*0.5, y + h*0.98, h*0.95, PK.sage, {w:1.3, belly:true}); c.strokeStyle = PK.yel; c.lineWidth = h*0.04; c.beginPath(); c.ellipse(x + w*0.5, y + h*0.52, w*0.2, h*0.05, 0, 0, Math.PI*2); c.stroke();
    pText(c, '90 / 85', x + w*0.82, y + h*0.4, h*0.1, PK.coral, 800); }},
  nwo:{t:'BMI가 정상이어도', cap:'체지방이 높으면 대사 위험 신호 (정상 체중 비만)', src:'Romero-Corral 2010', draw:(c,x,y,w,h)=>{
    pPerson(c, x + w*0.28, y + h*0.95, h*0.85, PK.sage); pPerson(c, x + w*0.72, y + h*0.95, h*0.85, PK.sage);
    c.fillStyle = 'rgba(233,196,106,.85)'; [[0.69,0.45],[0.75,0.52],[0.7,0.6],[0.76,0.4]].forEach(([fx,fy])=>{ c.beginPath(); c.arc(x + w*fx, y + h*fy, h*0.04, 0, Math.PI*2); c.fill(); });
    pText(c, 'BMI 22', x + w*0.28, y + h*0.06, h*0.08, PK.mut, 700); pText(c, 'BMI 22', x + w*0.72, y + h*0.06, h*0.08, PK.coral, 700); }},
  hidden:{t:'숨은 비만의 혈액 신호', cap:'BIA로 놓친 DXA 상위군: HDL↓ · 중성지방↑', src:'본 연구 (나이·질환 보정)', draw:(c,x,y,w,h)=>{
    const base = y + h*0.85; [['HDL',0.55,PK.blue,'↓'],['중성지방',0.8,PK.coral,'↑']].forEach(([t,v,col,ar],i)=>{ const bx = x + w*(0.18 + i*0.42); c.fillStyle = '#e1dccf'; c.fillRect(bx, base - h*0.7, w*0.22, h*0.7); c.fillStyle = col; c.fillRect(bx, base - h*0.7*v, w*0.22, h*0.7*v);
      pText(c, ar, bx + w*0.11, base - h*0.7*v - h*0.08, h*0.14, col, 800); pText(c, t, bx + w*0.11, base + h*0.07, h*0.075, PK.ink, 700); }); }},
  ba_muscle:{t:'BIA 근육은 더 넉넉하게', cap:'근육지수 BIA가 DXA보다 평균 약 1 kg/m² 높음', src:'본 연구 · Bland·Altman 1986', draw:(c,x,y,w,h)=>{
    const base = y + h*0.85; [['BIA',0.8,PK.blue],['DXA',0.6,PK.green]].forEach(([t,v,col],i)=>{ const bx = x + w*(0.2 + i*0.38); c.fillStyle = col; rr(c, bx, base - h*0.75*v, w*0.24, h*0.75*v, 8); c.fill(); pText(c, t, bx + w*0.12, base + h*0.07, h*0.08); });
    pText(c, '+1', x + w*0.5, y + h*0.12, h*0.13, PK.coral, 800); }},
  grip:{t:'근육은 양보다 힘', cap:'악력 · 의자 일어서기 먼저 확인', src:'AWGS 2025 · EWGSOP2 2019', draw:(c,x,y,w,h)=>{
    c.fillStyle = PK.coral; rr(c, x + w*0.12, y + h*0.2, w*0.16, h*0.45, 12); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x + w*0.2, y + h*0.32, w*0.05, 0, Math.PI*2); c.fill();
    c.fillStyle = PK.blue; rr(c, x + w*0.55, y + h*0.5, w*0.3, h*0.07, 6); c.fill(); c.fillRect(x + w*0.55, y + h*0.2, w*0.05, h*0.37); c.fillRect(x + w*0.57, y + h*0.57, w*0.03, h*0.3); c.fillRect(x + w*0.8, y + h*0.57, w*0.03, h*0.3);
    pText(c, '악력', x + w*0.2, y + h*0.8, h*0.09); pText(c, '일어서기', x + w*0.7, y + h*0.95, h*0.09); }},
  protein:{t:'끼니마다 단백질 한 가지', cap:'노인 하루 체중 1 kg당 1.0~1.2 g (콩팥병은 상담)', src:'PROT-AGE 2013', draw:(c,x,y,w,h)=>{
    c.fillStyle = '#fff'; c.beginPath(); c.arc(x + w*0.5, y + h*0.5, h*0.42, 0, Math.PI*2); c.fill(); c.strokeStyle = '#e1dccf'; c.lineWidth = 4; c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(x + w*0.38, y + h*0.38, h*0.11, h*0.08, 0, 0, Math.PI*2); c.fill(); c.strokeStyle = '#e1dccf'; c.stroke(); c.fillStyle = PK.yel; c.beginPath(); c.arc(x + w*0.38, y + h*0.38, h*0.045, 0, Math.PI*2); c.fill();
    c.fillStyle = '#f4ead2'; c.fillRect(x + w*0.52, y + h*0.32, h*0.16, h*0.16); c.fillStyle = PK.coral; c.beginPath(); c.ellipse(x + w*0.5, y + h*0.66, h*0.18, h*0.07, 0.2, 0, Math.PI*2); c.fill(); }},
  seesaw:{t:'근육↓ 지방↑ 시소', cap:'근감소성 비만: 체중이 그대로여도 생겨요', src:'ESPEN·EASO 2022', draw:(c,x,y,w,h)=>{
    c.save(); c.translate(x + w*0.5, y + h*0.62); c.rotate(-0.18); c.fillStyle = WOOD2; c.fillRect(-w*0.42, -h*0.03, w*0.84, h*0.06);
    c.fillStyle = PK.blue; rr(c, -w*0.4, -h*0.2, w*0.22, h*0.17, 8); c.fill(); pText(c, '근육', -w*0.29, -h*0.115, h*0.07, '#fff'); c.fillStyle = PK.yel; rr(c, w*0.16, -h*0.26, w*0.26, h*0.23, 8); c.fill(); pText(c, '지방', w*0.29, -h*0.145, h*0.07, PK.ink); c.restore();
    c.fillStyle = '#9aa5b1'; c.beginPath(); c.moveTo(x + w*0.5, y + h*0.62); c.lineTo(x + w*0.42, y + h*0.85); c.lineTo(x + w*0.58, y + h*0.85); c.fill(); }},
  model:{t:'우리 예측 모형 성적표', cap:'AUC 0.84~0.92 · 확률 보정 양호 · 외부 검증 필요', src:'본 연구 · TRIPOD+AI 2024', draw:(c,x,y,w,h)=>{
    const ox = x + w*0.12, oy = y + h*0.9, s = Math.min(w*0.8, h*0.85); c.strokeStyle = '#8a948d'; c.lineWidth = 2; c.strokeRect(ox, oy - s, s, s);
    c.setLineDash([6,5]); c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox + s, oy - s); c.stroke(); c.setLineDash([]);
    c.strokeStyle = PK.green; c.lineWidth = 5; c.beginPath(); c.moveTo(ox, oy); c.quadraticCurveTo(ox + s*0.05, oy - s*0.9, ox + s, oy - s); c.stroke(); pText(c, 'AUC 0.84~0.92', ox + s*0.58, oy - s*0.3, h*0.075, PK.green, 800); }},
  scale_illusion:{t:'체중계의 착시', cap:'같은 65 kg, 다른 몸속 구성', src:'ESPEN·EASO 2022', draw:(c,x,y,w,h)=>{
    [0.27,0.73].forEach((fx,i)=>{ pPerson(c, x + w*fx, y + h*0.78, h*0.7, i ? PK.yel : PK.blue, {w: i ? 1.2 : 1, belly: !!i}); c.fillStyle = '#fff'; rr(c, x + w*fx - w*0.15, y + h*0.8, w*0.3, h*0.1, 6); c.fill(); pText(c, '65.0 kg', x + w*fx, y + h*0.85, h*0.065, PK.ink, 800); }); }},
  boundary:{t:'경계선 근처에서 엇갈려요', cap:'기준선 가까이 있을수록 두 기기 분류가 달라졌어요', src:'본 연구 (선별 예측 모형)', draw:(c,x,y,w,h)=>{
    c.strokeStyle = PK.green; c.lineWidth = 4; c.beginPath(); for (let i=0;i<=40;i++){ const t = i/40, xx = x + w*(0.05 + t*0.9), yy = y + h*0.85 - Math.exp(-((t-0.5)**2)/0.03)*h*0.65; i ? c.lineTo(xx,yy) : c.moveTo(xx,yy); } c.stroke();
    const cx = x + w*0.32; c.strokeStyle = '#e0533f'; c.lineWidth = 4; c.beginPath(); c.moveTo(cx, y + h*0.1); c.lineTo(cx, y + h*0.9); c.stroke(); c.fillStyle = 'rgba(224,83,63,.15)'; c.fillRect(cx - w*0.07, y + h*0.1, w*0.14, h*0.8); pText(c, '기준선', cx, y + h*0.05, h*0.07, '#e0533f'); }},
  knhanes:{t:'국민건강영양조사 2024', cap:'40세 이상 3,187명 · BIA와 DXA 동시 측정', src:'질병관리청 원시자료 · 본 연구', draw:(c,x,y,w,h)=>{ pIcons(c, x + w*0.05, y, w*0.9, 60, 60, PK.green, PK.green, 12, h*0.75); pText(c, '3,187명', x + w*0.5, y + h*0.9, h*0.13, PK.green, 800); }},
  stigma:{t:'체형으로 판단하지 마세요', cap:'겉모습과 건강 관리는 다른 이야기', src:'Puhl·Heuer 2010 · WHO 2020', draw:(c,x,y,w,h)=>{
    [[0.15,0.8,0.85,PK.blue],[0.38,1.0,1.3,PK.coral],[0.62,0.9,0.95,PK.green],[0.85,0.7,1.15,PK.lav]].forEach(([fx,hs,ww,col])=>pPerson(c, x + w*fx, y + h*0.95, h*0.8*hs, col, {w:ww, belly:ww>1.2}));
    c.fillStyle = PK.coral; pText(c, '♥', x + w*0.5, y + h*0.1, h*0.12, PK.coral); }}
};
function illPoster(side, u, y, w, h, kind, accent){
  const P = POSTERS[kind]; if (!P) return; const g = onWall(side, u, y);
  mesh(rbox(w+0.1, h+0.1, 0.05, 0.02), M('#e8dcc2', 0.8), 0, 0, 0.025, g, false);
  const S = 420, cw = Math.round(S*w), ch = Math.round(S*h);
  const t = canvasTex(cw, ch, (c)=>{ c.fillStyle = PK.paper; c.fillRect(0,0,cw,ch); c.fillStyle = accent; c.fillRect(0,0,cw,ch*0.15);
    let fs = ch*0.075; c.font = `800 ${fs}px ${FONT}`; while (c.measureText(P.t).width > cw*0.9 && fs > 10){ fs -= 1; c.font = `800 ${fs}px ${FONT}`; } pText(c, P.t, cw/2, ch*0.075, fs, '#fff', 800);
    P.draw(c, cw*0.06, ch*0.2, cw*0.88, ch*0.56);
    let cs = ch*0.05; c.font = `700 ${cs}px ${FONT}`; while (c.measureText(P.cap).width > cw*0.92 && cs > 8){ cs -= 1; c.font = `700 ${cs}px ${FONT}`; } pText(c, P.cap, cw/2, ch*0.86, cs, PK.ink, 700);
    pText(c, '근거: ' + P.src, cw/2, ch*0.94, Math.min(ch*0.032, cw*0.035), PK.mut, 500); });
  t.generateMipmaps = false; t.minFilter = THREE.LinearFilter;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({map:t, toneMapped:false})); m.position.z = 0.055; g.add(m); return g;
}
