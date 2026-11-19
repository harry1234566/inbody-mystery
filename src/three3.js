/* ================= 장면 구성 ================= */
const LOBBY_P = {wall:'#ece6d6', wain:'#b7cdb2', rail:'#e6d6b6', floor:'#f1ebdd', grout:'#e2d9c6', cap:'#ead9b8', slab:'#e2d6bd'};
const LOBBY_DOORS = {balance:['L',-0.2], fat:['L',2.6], muscle:['B',2.4], both:['B',4.8]};
let nurse = null, doctor = null, visitors = [], player = null;
const NPC_N = {sex:2, skin:SKINS[1], hair:'#4b3427', style:'bob', face:'round', eyes:'smile', brows:'soft', mouth:'smile', top:'tee', topC:'#7fae9a', botC:'#5b7f74', coat:true, badge:'#e08a6a'};
const NPC_D = {sex:1, skin:SKINS[2], hair:'#6c6a66', style:'part', face:'square', eyes:'dot', brows:'straight', mouth:'smile', glass:'square', top:'shirt', topC:'#5b7fbf', botC:'#3b4455', coat:true, badge:'#2f6f5e', stetho:true};

function signPost(g, w, h, lines, opt={}){ mesh(cyl(0.04,0.05,1.0,8), M(WOOD2), 0, 0.5, 0, g); mesh(cyl(0.22,0.25,0.06,16), M(WOOD2), 0, 0.03, 0, g);
  mesh(rbox(w+0.1, h+0.1, 0.06, 0.03), M(opt.frame||WOOD,0.8), 0, 1.0+h/2, 0, g); const p = textPlane(w, h, opt.bg||'#fbf7ee', lines, opt); p.position.set(0, 1.0+h/2, 0.035); g.add(p); return p; }
function easel(g, w, h, lines, opt={}){ [-1,1].forEach(sd=>{ const l = mesh(cyl(0.03,0.03,1.9,6), M(WOOD2), sd*w*0.42, 0.92, 0.05, g); l.rotation.z = sd*-0.06; });
  const bl = mesh(cyl(0.03,0.03,1.7,6), M(WOOD2), 0, 0.82, -0.32, g); bl.rotation.x = 0.35;
  mesh(rbox(w+0.12, h+0.12, 0.06, 0.03), M(WOOD,0.8), 0, 0.75+h/2, 0.08, g); const p = textPlane(w, h, opt.bg||'#fbf7ee', lines, opt); p.position.set(0, 0.75+h/2, 0.115); g.add(p); return p; }
function chartTex(redY){ return (g, cw, ch)=>{ const bars = [0.35,0.55,0.8,0.62,0.4]; bars.forEach((b,i)=>{ g.fillStyle = '#7d98c4'; g.fillRect(cw*(0.12+i*0.16), ch*(0.88-b*0.6), cw*0.1, ch*b*0.6); });
  g.strokeStyle = '#e0533f'; g.lineWidth = ch*0.025; g.beginPath(); g.moveTo(cw*0.06, ch*redY); g.lineTo(cw*0.94, ch*redY); g.stroke(); g.fillStyle = '#e0533f'; g.font = `700 ${ch*0.07}px ${FONT}`; g.textAlign='right'; g.fillText('기준선', cw*0.94, ch*redY - ch*0.05); }; }

/* 방별 미션 소품 */
function prop(type, g, R){
  if (type==='inbody'){ inbodyMachine(g); const s = grp(0.75,0,0.25,-0.3,g); signPost(s, 0.6, 0.5, [['측정 전 체크',0.9,700,R.accent],['오전 · 공복 · 화장실',0.7],['운동 전 · 금속 제거',0.7]]); }
  if (type==='chart') easel(g, 1.3, 0.95, [['근육·체지방 기준선 차트',0.75,700,'#2f4858'],['',2.6]], {after:chartTex(0.55)});
  if (type==='sign') signPost(g, 1.0, 0.7, [['측정기 안내',0.8,700,R.accent],['BIA는 몸속 [ ? ]을',0.62],['지나는 전류로 계산',0.62]], {after:(c,cw,ch)=>{ c.strokeStyle='#8a8a8a'; c.lineWidth=6; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(cw*(0.25+i*0.1), ch*0.55); c.lineTo(cw*(0.3+i*0.1), ch*0.68); c.stroke(); } }});
  if (type==='bench'){ mesh(rbox(1.6,0.1,0.5,0.04), M(WOOD,0.8), 0,0.46,0, g); mesh(rbox(1.6,0.45,0.08,0.03), M(WOOD,0.8), 0,0.75,-0.22, g); [-0.65,0.65].forEach(x=>mesh(rbox(0.08,0.44,0.44,0.02), M(WOOD2), x,0.22,0, g));
    const p = makePerson({sex:1, skin:SKINS[3], hair:'#a7a49e', style:'thin', face:'oval', eyes:'calm', top:'vest', topC:'#556b5a', botC:'#6b5b4e', glass:'round', body:{w:0.88, belly:0, h:0.98}});
    p.sit = true; p.root.position.set(-0.35, 0.47-0.36*0.98*1.12+0.03, 0.05); g.add(p.root); visitors.push(p);
    const q = makePerson({sex:2, skin:SKINS[1], hair:'#2a2421', style:'pony', eyes:'dot', top:'cardigan', topC:'#c45b6a', botC:'#3b4455', body:{w:1.08, belly:0.1, h:1}});
    q.sit = true; q.root.position.set(0.4, 0.47-0.36*1.12+0.03, 0.05); g.add(q.root); visitors.push(q); }
  if (type==='dxa'){ mesh(rbox(2.2,0.6,0.8,0.08), M('#eef1f1',0.6), 0,0.3,0, g); mesh(rbox(2.0,0.08,0.66,0.04), M('#cfe3dc',0.7), 0,0.64,0, g);
    mesh(rbox(0.3,1.5,0.3,0.06), M('#e3e8e8',0.6), -0.95,0.75,-0.45, g); const arm = mesh(rbox(1.2,0.18,0.3,0.06), M('#f7f8f8',0.6), -0.45,1.45,-0.3, g);
    mesh(rbox(0.5,0.1,0.4,0.04), M('#d7dfdf'), 0.0,1.32,-0.1, g); const scr = grp(1.35,0,-0.2,-0.5,g); mesh(cyl(0.03,0.03,1.1,6), M('#9aa5b1'), 0,0.55,0, scr); const p = textPlane(0.55,0.4,'#1f3b4d',[['DXA',0.9,700,'#ffffff'],['체지방률',0.6,500,'#cfe3dc']]); p.position.set(0,1.25,0.03); scr.add(p); }
  if (type==='tape'){ signPost(g, 1.1, 0.75, [['국가건강검진',0.75,700,R.accent],['비만: 키·체중',0.6],['허리둘레·BMI',0.6]]); const t = mesh(new THREE.TorusGeometry(0.16,0.05,10,24), M('#e9c46a',0.6), 0.62, 0.95, 0.12, g); t.rotation.y = 0.4; mesh(box(0.05,0.55,0.01), M('#f3e7b3'), 0.62,0.62,0.18, g); }
  if (type==='mirror'){ mesh(rbox(1.0,2.0,0.12,0.06), M(WOOD,0.7), 0,1.15,0, g); { const mt = canvasTex(256, 512, (c,w,h)=>{ c.fillStyle = '#e9e2d6'; c.fillRect(0,0,w,h); c.fillStyle = '#e3b8a3'; c.fillRect(0,h*0.5,w,h*0.16); c.fillStyle = '#f0e7d8'; c.fillRect(0,h*0.66,w,h*0.34);
        c.fillStyle = '#fbfaf6'; c.fillRect(w*0.06,h*0.12,w*0.4,h*0.26); c.fillStyle = '#bfd8c4'; c.fillRect(w*0.09,h*0.14,w*0.34,h*0.22); c.fillStyle = '#a9c99a'; c.beginPath(); c.arc(w*0.2,h*0.36,w*0.12,0,Math.PI*2); c.arc(w*0.36,h*0.37,w*0.1,0,Math.PI*2); c.fill();
        c.fillStyle = '#d98468'; c.fillRect(w*0.6,h*0.08,w*0.32,h*0.06); c.fillStyle = '#fbf7ee'; c.fillRect(w*0.62,h*0.15,w*0.28,h*0.16);
        c.fillStyle = 'rgba(60,70,80,.22)'; c.beginPath(); c.ellipse(w*0.5,h*0.36,w*0.16,w*0.16,0,0,Math.PI*2); c.fill(); c.beginPath(); c.ellipse(w*0.5,h*0.62,w*0.24,h*0.14,0,0,Math.PI*2); c.fill();
        c.fillStyle = 'rgba(190,220,228,.35)'; c.fillRect(0,0,w,h);
        c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.moveTo(w*0.1,h); c.lineTo(w*0.32,h); c.lineTo(w*0.9,0); c.lineTo(w*0.68,0); c.fill(); c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.moveTo(w*0.42,h); c.lineTo(w*0.5,h); c.lineTo(w*1.0,h*0.22); c.lineTo(w*1.0,h*0.08); c.fill(); });
      mt.generateMipmaps = false; mt.minFilter = THREE.LinearFilter;
      const gl = new THREE.Mesh(new THREE.PlaneGeometry(0.84,1.8), new THREE.MeshBasicMaterial({map:mt, toneMapped:false})); gl.position.set(0,1.15,0.065); g.add(gl); } mesh(rbox(0.7,0.08,0.5,0.03), M(WOOD2), 0,0.04,0.12, g);
    const s = grp(0.75,0,0.3,-0.3,g); signPost(s, 0.7, 0.5, [['BMI 정상이어도',0.62,700,R.accent],['[ ? ]이 높으면…',0.62]]); }
  if (type==='frame') easel(g, 1.2, 0.9, [['혈액 검사 결과',0.8,700,R.accent],['HDL ↓  중성지방 ↑',0.7,700,'#2f4858'],['겉모습으로는 안 보여요',0.55]]);
  if (type==='ruler'){ mesh(rbox(0.7,0.08,0.7,0.03), M(WHITE), 0,0.04,0, g); mesh(rbox(0.16,2.3,0.12,0.03), M(WHITE), 0,1.15,-0.25, g);
    for (let i=0;i<12;i++) mesh(box(i%4===0?0.16:0.09,0.018,0.01), M(DARK), 0.05,0.3+i*0.16,-0.18, g, false); mesh(rbox(0.46,0.05,0.3,0.02), M('#e08a6a'), 0.12,1.85,-0.1, g); }
  if (type==='grip'){ const t = grp(0,0,0,0,g); mesh(rbox(0.9,0.06,0.6,0.02), M(WOOD,0.75), 0,0.72,0, t); [-1,1].forEach(sx=>[-1,1].forEach(sz=>mesh(cyl(0.03,0.03,0.72,6), M(WOOD2), sx*0.38,0.36,sz*0.24, t)));
    const gd = mesh(rbox(0.12,0.3,0.08,0.03), M('#e08a6a'), -0.15,0.9,0.05, g); gd.rotation.z = 0.25; mesh(cyl(0.07,0.07,0.04,16), M(WHITE), -0.2,1.05,0.1, g).rotation.x = Math.PI/2;
    const c = grp(0.9,0,0.2,-0.6,g); mesh(rbox(0.5,0.07,0.5,0.03), M('#7d98c4'), 0,0.45,0, c); mesh(rbox(0.5,0.5,0.07,0.03), M('#7d98c4'), 0,0.72,-0.22, c); [-1,1].forEach(sx=>[-1,1].forEach(sz=>mesh(cyl(0.025,0.025,0.45,6), M(WOOD2), sx*0.2,0.22,sz*0.2, c))); }
  if (type==='dumbbell'){ mesh(rbox(1.6,0.45,0.55,0.05), M('#8fa79a',0.8), 0,0.22,0, g); mesh(rbox(1.5,0.05,0.5,0.02), M('#a8bfb2'), 0,0.47,0, g);
    [-0.5,0,0.5].forEach((x,i)=>{ mesh(cyl(0.03,0.03,0.36,8), M('#9aa5b1',0.4), x,0.56,0, g).rotation.x = Math.PI/2; [-1,1].forEach(sd=>mesh(cyl(0.09+i*0.015,0.09+i*0.015,0.08,16), M(['#7d98c4','#5f88b5','#3d5f86'][i]), x,0.56,sd*0.15, g).rotation.x = Math.PI/2); });
    const s = grp(0,0,-0.4,0,g); signPost(s, 0.9, 0.5, [['근력운동',0.7,700,R.accent],['주 [ ? ]일 이상',0.75]]); }
  if (type==='poster'){ easel(g, 1.2, 0.95, [['경로당 운동교실',0.8,700,R.accent],['근력 · 균형 운동',0.62],['단백질 · 통합돌봄 연계',0.55]]); mesh(rbox(1.0,0.04,0.5,0.02), M('#a8c0d6'), 0.2,0.02,0.7, g, false); }
  if (type==='hanger'){ [-0.7,0.7].forEach(x=>mesh(cyl(0.03,0.03,1.6,8), M('#9aa5b1',0.4), x,0.8,0, g)); mesh(cyl(0.025,0.025,1.5,8), M('#9aa5b1',0.4), 0,1.58,0, g).rotation.z = Math.PI/2;
    [-0.7,0.7].forEach(x=>mesh(rbox(0.1,0.04,0.5,0.02), M('#9aa5b1'), x,0.02,0, g));
    [['#e08a6a',-0.35],['#5b7fbf',0.05],['#e9c46a',0.4]].forEach(([c,x])=>{ const s = new THREE.LatheGeometry([[0,0],[0.14,0.02],[0.2,0.4],[0.16,0.6],[0,0.62]].map(p=>new THREE.Vector2(p[0],p[1])), 18); const m = mesh(s, M(c), x,0.92,0, g); m.scale.z = 0.35; }); }
  if (type==='laptop'){ mesh(rbox(1.4,0.06,0.8,0.02), M(WOOD,0.75), 0,0.76,0, g); [-1,1].forEach(sx=>mesh(rbox(0.06,0.76,0.7,0.02), M(WOOD2), sx*0.62,0.38,0, g));
    mesh(rbox(0.7,0.03,0.45,0.01), M('#9aa5b1',0.4), 0,0.805,0.08, g); const sc = grp(0,0.82,-0.13,0,g); sc.rotation.x = -0.25; mesh(rbox(0.7,0.46,0.03,0.01), M('#3a3f45'), 0,0.23,0, sc);
    const p = textPlane(0.62,0.38,'#1f3b4d',[['AUC 0.84~0.92',0.8,700,'#ffffff'],['외부 검증 필요',0.7,700,'#f2c14e']]); p.position.set(0,0.23,0.017); sc.add(p); }
  if (type==='scale'){ mesh(rbox(0.8,0.1,0.8,0.05), M(WHITE,0.6), 0,0.05,0, g); mesh(rbox(0.36,0.02,0.18,0.02), M('#1f3b4d'), 0,0.11,-0.22, g); const s = grp(0,0,-0.55,0,g); signPost(s, 0.95, 0.55, [['체중계 안내',0.7,700,R.accent],['[ ? ]은 그대로일 수도',0.6]]); }
  if (type==='rx') easel(g, 1.2, 0.95, [['운동·식단 처방전',0.78,700,R.accent],['근력 + 유산소',0.62],['끼니마다 단백질',0.62]]);
}
const PROPSET = {balance:['inbody','chart','sign','bench'], fat:['dxa','tape','mirror','frame'], muscle:['ruler','grip','dumbbell','poster'], both:['hanger','laptop','scale','rx']};
/* 방 안 미션 자리: 소품 위치·방향·서는 곳·표시 높이·충돌 범위 */
const SLOTS = [ {p:[-3.0,-4.1], ry:0, s:[-3.0,-2.55], y:2.5, hw:1.1, hd:0.55},
                {p:[-5.6,-0.4], ry:Math.PI/2, s:[-4.0,-0.4], y:2.3, hw:0.55, hd:0.8},
                {p:[1.2,0.6], ry:0, s:[1.2,1.95], y:2.2, hw:0.8, hd:0.45},
                {p:[-3.2,3.0], ry:Math.PI/2, s:[-1.75,3.0], y:2.1, hw:0.5, hd:0.9} ];
const ROOM_DOOR_U = 3.6;

function buildLobby(){
  clearWorld(); visitors = []; shell(16, 12, LOBBY_P);
  windowWall('B', -4.4, 1.95, 2.2, 1.5);
  bookshelf(-2.0, -5.7, 0, 1.3, 1.85); blockC(-2.0,-5.7,0.7,0.3); clock('B', -2.85, 2.6);
  const ban = onWall('B', -0.1, 2.55); mesh(rbox(3.4,0.9,0.08,0.04), M('#2f6f5e',0.8), 0,0,0.04, ban, false);
  const bt = textPlane(3.2, 0.8, null, [['+ 집현전 보건소',1.15,700,'#ffffff'],['지역과 함께하는 건강한 오늘',0.8,500,'#e7f1ea']]); bt.position.z = 0.09; ban.add(bt);
  board('B', 6.9, 1.85, 1.3, 1.05, [['우리 동네',0.75,700,'#2f6f5e'],['건강 프로그램',0.75,700,'#2f6f5e'],['검진 · 운동교실',0.55],['모바일 헬스케어',0.55]], {bar:'#e9c46a'});
  illPoster('L', -4.6, 2.1, 1.1, 1.25, 'measure', '#5f9e86');
  illPoster('L', 1.2, 2.05, 0.95, 1.2, 'agree100', '#d98468');
  illPoster('L', 4.35, 2.15, 1.15, 1.35, 'issues4', '#2f6f5e');
  illPoster('B', -6.85, 2.25, 1.15, 1.3, 'bia_dxa', '#5f88b5');
  illPoster('B', 3.6, 2.25, 0.72, 0.95, 'move', '#5f9e86');
  tv('L', -2.4, 2.0, [['인바디 미스터리',0.95,700,'#2f4858'],['방탈출 캠페인 퀴즈',0.8,500,'#2f6f5e']]);
  for (const [k,[side,u]] of Object.entries(LOBBY_DOORS)){ const R = ROOMS[k]; DOORS[k] = door(side, u, R.door, `${R.no} · ${R.name}`); }
  // 접수대
  const rc = grp(0.6, 0, -2.5, 0); mesh(rbox(3.3,1.02,0.85,0.08), M('#f4efe3',0.85), 0,0.51,0, rc); mesh(rbox(3.45,0.08,1.0,0.03), M(WOOD,0.7), 0,1.06,0.02, rc);
  mesh(rbox(2.6,0.36,0.02,0.02), M('#2f6f5e'), 0,0.62,0.43, rc, false); const lab = textPlane(2.4, 0.32, null, [['접수 / 상담',1.0,700,'#ffffff']]); lab.position.set(0,0.62,0.445); rc.add(lab);
  mesh(rbox(0.62,0.42,0.04,0.02), M('#2d312f',0.5), -0.6,1.36,-0.15, rc); mesh(box(0.54,0.34,0.01), M('#bfe0d4',0.4,{emissive:'#7fae9a',ei:0.25}), -0.6,1.36,-0.125, rc, false); mesh(cyl(0.04,0.06,0.14,8), M('#9aa5b1'), -0.6,1.15,-0.18, rc);
  [['#7fae9a',0.5],['#e9c46a',0.62],['#7d98c4',0.74]].forEach(([c,x])=>mesh(rbox(0.1,0.32,0.26,0.02), M(c), x,1.26,-0.1, rc)); mesh(cyl(0.06,0.05,0.14,10), M('#5b7f74'), 1.2,1.17,0.1, rc);
  blockC(0.6,-2.5,1.75,0.5); block(-1.3,-3.6,2.5,-2.0);
  // 대기 공간
  sofa(6.2, 0.9, -Math.PI/2, '#9dbd8b', 3); blockC(6.2,0.9,0.5,1.4);
  table(4.6, 0.9, 0.9, 1.4, 0.42, 0, '#efd9a8'); blockC(4.6,0.9,0.5,0.75);
  dispenser(7.35, -2.4, -Math.PI/2);
  table(-4.6, -0.2, 1.7, 0.9, 0.55, 0, WOOD); blockC(-4.6,-0.2,0.9,0.5);
  [[-5.0,-0.25,0.2],[-4.5,-0.15,-0.1],[-4.1,-0.3,0.15]].forEach(([x,z,r])=>{ const l = mesh(rbox(0.36,0.02,0.48,0.01), M(WHITE), x,0.6,z); l.rotation.y = r; });
  const ib = grp(-6.7, 0, -4.8, Math.PI/4); inbodyMachine(ib); blockC(-6.7,-4.8,0.6,0.6);
  // 운동 코너
  rug(1.8, 4.5, 3.4, 1.8, '#c9d9c1');
  const rk = grp(1.4, 0, 4.4, 0); mesh(rbox(1.6,0.34,0.5,0.05), M('#8fa79a',0.8), 0,0.17,0, rk); [-0.5,0,0.5].forEach((x,i)=>{ mesh(cyl(0.025,0.025,0.32,8), M('#9aa5b1',0.4), x,0.42,0, rk).rotation.x = Math.PI/2; [-1,1].forEach(sd=>mesh(cyl(0.08,0.08,0.07,16), M(['#7d98c4','#5f88b5','#3d5f86'][i]), x,0.42,sd*0.13, rk).rotation.x = Math.PI/2); });
  mesh(cyl(0.16,0.16,0.7,18), M('#e8a99a'), 0.2, 0.35, 4.1); blockC(1.4,4.4,0.9,0.35);
  const ball = mesh(sph(0.42, 24, 18), M('#a9bccb',0.6), 3.0, 0.42, 4.7); blockC(3.0,4.7,0.45,0.45);
  plant(-5.3, -5.2, 1.0, 2); plant(7.3, -5.3, 1.15, 0); plant(7.2, 5.0, 1.0, 1); plant(-7.2, 5.1, 1.05, 0);   plant(4.6, 5.2, 0.9, 2);
  // 사람들
  nurse = makePerson(NPC_N); nurse.root.position.set(0.6, 0, -3.35); nurse.facing = 0; world.add(nurse.root);
  doctor = makePerson(NPC_D); doctor.root.position.set(-2.4, 0, -1.7); doctor.facing = 0.5; doctor.root.visible = false; world.add(doctor.root);
  const v1 = makePerson({sex:2, skin:SKINS[2], hair:'#ebe7df', style:'perm', face:'round', eyes:'smile', top:'cardigan', topC:'#e9c46a', botC:'#6b5b4e', acc:'cane', glass:'round', body:{w:1.05, belly:0.1, h:0.95}});
  v1.sit = true; v1.root.position.set(6.05, 0.64-0.36*0.95*1.12, 1.7); v1.facing = -Math.PI/2; world.add(v1.root);
  const v2 = makePerson({sex:1, skin:SKINS[4], hair:'#2a2421', style:'buzz', face:'square', eyes:'dot', top:'hoodie', topC:'#5b7fbf', botC:'#2f3e46', beard:'goatee', body:{w:1.25, belly:0.3, h:1.03}});
  v2.sit = true; v2.root.position.set(6.05, 0.64-0.36*1.03*1.12, 0.1); v2.facing = -Math.PI/2; world.add(v2.root);
  visitors.push(v1, v2);
  if (player) world.add(player.root);
  computeGrid(); computeBBox();
}

function buildRoom(key){
  clearWorld(); visitors = []; const R = ROOMS[key];
  shell(13, 10, {wall:R.wall, wain:R.wain, rail:R.rail, floor:R.floor, grout:R.grout, cap:'#ead9b8', slab:'#e2d6bd'});
  const ban = onWall('B', -0.6, 2.75); mesh(rbox(3.6,0.62,0.08,0.04), M(R.accent,0.8), 0,0,0.04, ban, false);
  const bt = textPlane(3.4, 0.56, null, [[`${R.space} · ${R.camp}`, 0.95, 700, '#ffffff']]); bt.position.z = 0.09; ban.add(bt);
  windowWall('B', 0.9, 1.7, 1.6, 1.1);
  DOORS.exit = door('B', ROOM_DOOR_U, R.door, '출구');
  const lk = onWall('B', ROOM_DOOR_U+1.25, 1.35); mesh(rbox(0.5,0.7,0.08,0.04), M('#3d4a4c',0.6), 0,0,0.04, lk, false);
  DOORS.slots = [0,1,2,3].map(i=>{ const m = new THREE.MeshStandardMaterial({color:lin('#bfb49a'), roughness:0.6}); mesh(rbox(0.15,0.15,0.04,0.02), m, (i%2?0.1:-0.1), (i<2?0.13:-0.13), 0.1, lk, false); return m; });
  const PS = {balance:['measure','bia_dxa','boundary','move','stigma'], fat:['ba_fat','waist','nwo','hidden','move'], muscle:['ba_muscle','grip','protein','knhanes','stigma'], both:['seesaw','model','scale_illusion','protein','knhanes']}[key];
  illPoster('L', -2.6, 2.15, 1.25, 1.2, PS[0], R.door); illPoster('L', 1.0, 2.15, 1.0, 1.2, PS[1], R.accent); illPoster('L', 3.55, 2.2, 1.0, 1.2, PS[2], R.door);
  illPoster('B', -5.2, 2.25, 1.1, 1.3, PS[3], R.accent); illPoster('B', 5.75, 2.3, 0.7, 0.95, PS[4], R.door);
  rug(0.2, 1.2, 4.2, 2.6, shade(R.wain, 0.1));
  plant(5.6, 4.2, 1.0, 1); plant(-5.8, -4.3, 0.95, 2); plant(5.7, -4.3, 0.85, 0); plant(-5.8, 4.3, 0.9, 0);
  PROPSET[key].forEach((t,i)=>{ const sl = SLOTS[i]; const g = grp(sl.p[0], 0, sl.p[1], sl.ry); prop(t, g, R); blockC(sl.p[0], sl.p[1], sl.hw, sl.hd); });
  if (player) world.add(player.root);
  computeGrid(); computeBBox();
}

/* ================= 길찾기 (격자 A*) ================= */
const CELL = 0.25; let GRID = null;
function computeGrid(){
  const nx = Math.round(RM.W/CELL), nz = Math.round(RM.D/CELL), g = new Uint8Array(nx*nz), pad = 0.3;
  for (let i=0;i<nx;i++) for (let j=0;j<nz;j++){ const x = -RM.W/2 + (i+0.5)*CELL, z = -RM.D/2 + (j+0.5)*CELL;
    if (x < -RM.W/2+0.35 || x > RM.W/2-0.3 || z < -RM.D/2+0.35 || z > RM.D/2-0.3) { g[i*nz+j] = 1; continue; }
    for (const o of OB) if (x > o.x0-pad && x < o.x1+pad && z > o.z0-pad && z < o.z1+pad){ g[i*nz+j] = 1; break; } }
  GRID = {nx, nz, g};
}
const toCell = (x,z) => [clamp(Math.floor((x+RM.W/2)/CELL),0,GRID.nx-1), clamp(Math.floor((z+RM.D/2)/CELL),0,GRID.nz-1)];
const cellPt = (i,j) => [-RM.W/2 + (i+0.5)*CELL, -RM.D/2 + (j+0.5)*CELL];
const free = (i,j) => i>=0 && j>=0 && i<GRID.nx && j<GRID.nz && !GRID.g[i*GRID.nz+j];
function nearestFree(i,j){ if (free(i,j)) return [i,j]; for (let r=1;r<12;r++) for (let di=-r;di<=r;di++) for (let dj=-r;dj<=r;dj++){ if (Math.max(Math.abs(di),Math.abs(dj))!==r) continue; if (free(i+di,j+dj)) return [i+di,j+dj]; } return [i,j]; }
function findPath(x0,z0,x1,z1){
  const [si,sj] = nearestFree(...toCell(x0,z0)), [ti,tj] = nearestFree(...toCell(x1,z1)); const {nx,nz} = GRID;
  const N = nx*nz, gS = new Float32Array(N).fill(1e9), came = new Int32Array(N).fill(-1), closed = new Uint8Array(N); const open = [];
  const id = (i,j)=>i*nz+j, h = (i,j)=>Math.hypot(i-ti, j-tj);
  gS[id(si,sj)] = 0; open.push([h(si,sj), si, sj]);
  const D8 = [[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];
  let found = false, it = 0;
  while (open.length && it++ < 20000){ let bi = 0; for (let k=1;k<open.length;k++) if (open[k][0] < open[bi][0]) bi = k; const [,ci,cj] = open.splice(bi,1)[0]; const cid = id(ci,cj); if (closed[cid]) continue; closed[cid] = 1;
    if (ci===ti && cj===tj){ found = true; break; }
    for (const [di,dj,c] of D8){ const ni = ci+di, nj = cj+dj; if (!free(ni,nj)) continue; if (di && dj && (!free(ci+di,cj) || !free(ci,cj+dj))) continue; const nid = id(ni,nj), ng = gS[cid]+c; if (ng < gS[nid]){ gS[nid] = ng; came[nid] = cid; open.push([ng + h(ni,nj), ni, nj]); } } }
  if (!found) return [[x1,z1]];
  const cells = []; let c = id(ti,tj); while (c !== -1){ cells.push([Math.floor(c/nz), c%nz]); c = came[c]; } cells.reverse();
  const pts = cells.map(([i,j])=>cellPt(i,j));
  // 직선으로 보이는 점은 줄이기
  const out = []; let a = [x0,z0];
  for (let k=1;k<pts.length;k++){ if (!lineFree(a, pts[k])){ out.push(pts[k-1]); a = pts[k-1]; } }
  out.push(free(...toCell(x1,z1)) ? [x1,z1] : pts[pts.length-1]); return out;
}
function lineFree(a, b){ const L = Math.hypot(b[0]-a[0], b[1]-a[1]), n = Math.ceil(L/(CELL*0.5)); for (let k=1;k<=n;k++){ const t = k/n; if (!free(...toCell(a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t))) return false; } return true; }
const walkable = (x,z) => GRID && free(...toCell(x,z));

/* ================= 카메라 (고정 방향, 창만 이동·확대) ================= */
const BB = {x0:-10,x1:10,y0:-10,y1:10};
const tmpV = new THREE.Vector3();
const toCam = (x,y,z) => tmpV.set(x,y,z).applyMatrix4(camera.matrixWorldInverse);
function computeBBox(){
  const {W, D} = RM; let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9; const pts = [];
  for (const sx of [-1,1]) for (const sz of [-1,1]) pts.push([sx*(W/2+0.4), -0.55, sz*(D/2+0.4)]);
  pts.push([-W/2-0.4, 3.5, -D/2-0.4], [W/2+0.2, 3.5, -D/2-0.4], [-W/2-0.4, 3.5, D/2+0.2]);
  for (const p of pts){ const c = toCam(...p); x0 = Math.min(x0,c.x); x1 = Math.max(x1,c.x); y0 = Math.min(y0,c.y); y1 = Math.max(y1,c.y); }
  Object.assign(BB, {x0,x1,y0,y1});
}
const CAM = {mode:'room', l:-12, r:12, t:8, b:-8, init:false, safe:{t:110, b:90, l:20, r:20}, focus:null};
function desiredFrustum(){
  const sw = W_, sh = H_, S = CAM.safe; const aw = Math.max(80, sw - S.l - S.r), ah = Math.max(80, sh - S.t - S.b);
  const cx = S.l + aw/2, cy = S.t + ah/2; let k, C;
  const bw = BB.x1-BB.x0, bh = BB.y1-BB.y0;
  const pc = player ? toCam(player.root.position.x, 0.8*player.root.scale.y, player.root.position.z).clone() : new THREE.Vector3();
  if (CAM.mode==='close'){ k = (MOBILE ? 3.3 : 2.9)/ah; C = toCam(player.root.position.x, 1.0*player.root.scale.y, player.root.position.z).clone(); }
  else if (CAM.mode==='focus' && CAM.focus){ k = Math.min(Math.max(bw/aw, bh/ah), 7.5/ah); const f = CAM.focus; C = toCam(f[0], f[1], f[2]).clone(); }
  else { const fb = S.fitB != null ? S.fitB : S.b, ah2 = Math.max(80, sh - S.t - fb), cy2 = S.t + ah2/2;
    k = Math.max(bw/aw, bh/ah2); C = new THREE.Vector3((BB.x0+BB.x1)/2, (BB.y0+BB.y1)/2, 0);
    const kMax = 1.55/(MOBILE ? 62 : 50); if (k > kMax){ k = kMax; C = pc; } else { let l = C.x - cx*k, t = C.y + cy2*k; return {l, r:l+sw*k, t, b:t-sh*k}; } }
  let l = C.x - (cx)*k, t = C.y + (cy)*k, r = l + sw*k, b = t - sh*k;
  // 방 밖으로 너무 나가지 않게
  if (CAM.mode!=='close'){ const m = 0.6;
    if (aw*k < bw + 2*m){ const lo = BB.x0 - m - S.l*k, hi = BB.x1 + m + S.r*k - sw*k; l = clamp(l, lo, Math.max(lo, hi)); r = l + sw*k; }
    if (ah*k < bh + 2*m){ const hi = BB.y1 + m + S.t*k, lo = BB.y0 - m - S.b*k + sh*k; t = clamp(t, Math.min(hi, lo), hi); b = t - sh*k; } }
  return {l, r, t, b};
}
function updateCamera(dt){
  const d = desiredFrustum(); const k = CAM.init ? Math.min(1, dt*4.5) : 1; CAM.init = true;
  for (const s of ['l','r','t','b']) CAM[s] += (d[s]-CAM[s])*k;
  camera.left = CAM.l; camera.right = CAM.r; camera.top = CAM.t; camera.bottom = CAM.b; camera.updateProjectionMatrix();
}
