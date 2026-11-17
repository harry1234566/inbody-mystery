REFS[28] = {s:'KNHANES 이용지침서', t:'질병관리청. 국민건강영양조사 제9기(2022–2024) 원시자료 이용지침서. 체성분(BIA) 변수 p.193, DXA 변수 p.192, DXA 결측·비해당 코드 p.216–217, 복합표본 설계 변수(kstrata, psu, wt_itvex).'};
/* ===== 자료 정보: 출처 · 대상자 수 · 가중치 · 단위 · 기준 문헌 (교수님 피드백 11/16) ===== */
const DATA_INFO = {
  source:'질병관리청 국민건강영양조사 제9기 3차년도(2024) 원시자료',
  cite:'국민건강영양조사, 2024. 질병관리청 (The Korea National Health and Nutrition Examination Survey (KNHANES), 2024. Korea Disease Control and Prevention Agency)',
  n:3187, nSex:{1:1318, 2:1869},
  nBand:{'1_40-49':268, '1_50-64':542, '1_65+':508, '2_40-49':410, '2_50-64':789, '2_65+':670},
  weight:'복합표본 설계 반영: 층(kstrata) · 집락(psu) · 검진조사 가중치(wt_itvex). 분위수·비율·평균은 가중 추정, 표준오차는 테일러 선형화.',
  units:[['나이','세','만 나이. 공개 자료는 80세 이상을 80으로 묶음',[28]],['키','cm','',[28]],['체중','kg','',[28]],['BMI','kg/m²','체중(kg) ÷ 키(m)²',[10]],
    ['허리둘레','cm','복부비만 기준 남 90, 여 85 cm 이상',[10]],['근육지수(SMI)','kg/m²','팔·다리 근육량 합(kg) ÷ 키(m)². BIA 4부위 합(지침서 p.193)',[7,27,28]],
    ['체지방률','%','체지방량 ÷ 체중 × 100 (각 기기 제공값)',[28]],['위상각','°','50 kHz 전신 위상각(설명용)',[24]],['세포외수분비','비율(단위 없음)','세포외수분 ÷ 체수분(설명용)',[3]]],
  basis:[['상대 기준(근육 하위 20%)','AWGS 2025 최저 5분위 개념',[7]],['상대 기준(체지방 상위 20%)','근육과 대칭인 탐색적 기준',[1]],['AWGS BIA 근육지수 기준','남 7.0, 여 5.7 kg/m²',[27]],
    ['BMI 구간·복부비만','대한비만학회 2022',[10]],['두 기기 차이','Bland-Altman',[4]],['분류 일치도','가중 카파(Landis·Koch 해석)',[5]],['예측 모형 보고','TRIPOD+AI, 보정',[18,19]]],
  /* 연구 자료의 가중 1~99 백분위: 이 범위를 벗어나면 확률 해석에 주의 */
  train:{1:{ht:[156.8,186.7], bmi:[17.7,35.0], wc:[70.4,112.2], smi:[6.06,9.74], pbf:[13.5,39.5]}, 2:{ht:[142.8,171.1], bmi:[17.2,34.7], wc:[62.2,108.6], smi:[4.70,7.99], pbf:[19.5,47.2]}}
};
const POS_NOTICE = '내 위치는 같은 성별·연령대 사람들 사이의 <b>상대적 위치</b>일 뿐, 건강 상태를 확정하지 않아요. 같은 위치라도 근력, 혈액 검사, 생활습관, 질환에 따라 건강 상태는 다를 수 있고, 건강 상태는 의료진의 진찰과 필요한 검사로 판단해요.';
function dataInfoTable(){
  const rt = ids => ids.map(i=>`<sup class="r" data-ref="${i}">[${i}]</sup>`).join('');
  return `<dl class="kv"><dt>자료 출처</dt><dd>${DATA_INFO.source} ${rt([1,28])}</dd>
    <dt>출처 표기</dt><dd>${DATA_INFO.cite}</dd>
    <dt>대상자 수</dt><dd>40세 이상, BIA(InBody 970)와 DXA를 모두 측정한 <b>${DATA_INFO.n.toLocaleString()}명</b> (남 ${DATA_INFO.nSex[1].toLocaleString()}, 여 ${DATA_INFO.nSex[2].toLocaleString()}). 질환자 포함.</dd>
    <dt>가중치</dt><dd>${DATA_INFO.weight}</dd></dl>
    <table class="dt"><tr><th>성별</th><th>40–49세</th><th>50–64세</th><th>65세 이상</th></tr>
    ${[1,2].map(sx=>`<tr><td>${sx===1?'남':'여'}</td>${['40-49','50-64','65+'].map(b=>`<td>${DATA_INFO.nBand[`${sx}_${b}`]}명</td>`).join('')}</tr>`).join('')}</table>
    <p class="small">이 게임에는 원시자료가 들어 있지 않고, 가중 분위수·회귀계수 같은 집계 결과만 들어 있어요. 표의 사람 수는 실제 조사 인원(비가중)이고, 분위수·비율은 이 사람들에게 가중치를 곱해 대한민국 40세 이상 인구를 대표하도록 계산했어요.</p>
    <h3>변수와 단위</h3><table class="dt"><tr><th>변수</th><th>단위</th><th>정의</th></tr>${DATA_INFO.units.map(([a,b,c,r])=>`<tr><td>${a}</td><td>${b}</td><td>${c} ${rt(r)}</td></tr>`).join('')}</table>
    <h3>기준과 근거 문헌</h3><table class="dt"><tr><th>항목</th><th>기준</th></tr>${DATA_INFO.basis.map(([a,b,r])=>`<tr><td>${a}</td><td>${b} ${rt(r)}</td></tr>`).join('')}</table>`;
}
function posNotice(){ return `<div class="posn"><b>꼭 읽어 주세요</b> ${POS_NOTICE}</div>`; }
function dataInfoBox(r){
  const n = r ? DATA_INFO.nBand[`${r.sx}_${r.band}`] : null;
  return `<div class="dinfo"><b>이 비교의 기준</b> <span class="small">출처: ${DATA_INFO.source} [1] · 대상: 40세 이상 ${DATA_INFO.n.toLocaleString()}명${n ? ` (그중 같은 ${r.sx===1?'남성':'여성'}·${r.band}세 ${n}명)` : ''} · 가중치: 복합표본 가중(kstrata·psu·wt_itvex) · 단위: 근육지수 kg/m², 체지방률 %, BMI kg/m², 허리둘레 cm</span> ${statBtn('datainfo','자료 정보 전체')}</div>${posNotice()}`;
}
/* ================= 통계 설명 ('?' 버튼) =================
   팀 분석 결과(국민건강영양조사 2024)와 그래프. 그래프는 원시자료로 다시 그린 것. */
REFS[10].t = '대한비만학회. 2022 비만 진료지침(제8판). 한국 성인 BMI 23~24.9 비만 전단계, 25 이상 비만. 복부비만: 허리둘레 남 90 cm, 여 85 cm 이상.';
REFS[27] = {s:'AWGS 2019', t:'Chen LK, Woo J, Assantachai P, et al. Asian Working Group for Sarcopenia: 2019 consensus update on sarcopenia diagnosis and treatment. J Am Med Dir Assoc. 2020;21(3):300–307. BIA 근육지수 기준 남 7.0, 여 5.7 kg/m².'};
const fig = (src, cap) => `<figure class="fig"><img src="${src}" alt="${esc(cap)}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
const STATS = {
  datainfo:{t:'자료 출처 · 대상자 수 · 가중치 · 단위 · 기준 문헌', refs:[1,28,4,5,7,10,18,19,27], html:()=>`${dataInfoTable()}${posNotice()}`},
  survey:{t:'자료와 복합표본 설계', refs:[1,28], html:()=>`
    <p>국민건강영양조사는 전국을 대표하도록 <b>층(kstrata) → 집락(psu) → 가구</b> 순서로 표본을 뽑아요. 그래서 한 사람의 값을 그대로 세지 않고, 그 사람이 대표하는 인구만큼 <b>가중치(wt_itvex)</b>를 곱해 계산했어요.</p>
    <ul class="facts"><li>대상: 2024년 조사 40세 이상, BIA(InBody 970)와 DXA를 같은 날 모두 잰 <b>3,187명</b>(남 1,318, 여 1,869). 질환자도 모두 포함하고 질환 민감도 분석을 따로 했어요.</li>
    <li>표준오차: Taylor 선형화(R survey 패키지와 결과 일치), Rao-Wu 복합표본 부트스트랩 400회로 확인.</li>
    <li>민감도 분석 9개 시나리오에서 결론이 유지됐어요.</li></ul>${dataInfoTable()}`},
  bia_dxa:{t:'BIA와 DXA는 왜 다르게 읽을까?', refs:[2,25,12], html:()=>`
    <p><b>BIA</b>는 약한 전류가 몸을 지날 때의 저항으로 몸속 수분을 구하고, 평균적인 사람 자료로 만든 식으로 근육·지방을 <b>추정</b>해요. 몸을 원통 여러 개로 가정해서, 몸통은 체중의 약 75%인데 전체 저항의 약 9%만 차지해요.</p>
    <p><b>DXA</b>는 두 가지 에너지의 X선이 뼈·지방·제지방에 흡수되는 차이로 재는 병원 장비라, 연구에서 기준 방법으로 많이 써요.</p>
    <p>우리 자료에서 같은 사람의 두 값을 비교하면 다음과 같았어요.</p>${fig(IMG.agree, '두 기기의 상대 분류 결과(전체 대비 가중 비율). 노랑·주황이 서로 엇갈린 사람이에요.')}`},
  relative:{t:'상대적 하위·상위군 기준(20%)', refs:[1,7], html:()=>`
    <p>두 기기는 측정값 크기 자체가 달라서, 같은 숫자 기준을 쓰면 비교가 불공정해요. 그래서 <b>각 기기 안에서</b> 같은 성별·연령대(40–49, 50–64, 65+)의 가중 분위수로 위치를 정했어요.</p>
    <ul class="facts"><li>근육지수(팔·다리 근육량 ÷ 키²) <b>하위 20%</b> = 상대적 하위군. AWGS 2025의 최저 5분위 개념을 따랐어요.</li>
    <li>체지방률 <b>상위 20%</b> = 상대적 상위군. 근육과 대칭인 탐색적 기준이에요.</li>
    <li>목적은 진단이 아니라 <b>두 기기 분류가 얼마나 일치하는지</b> 비교하는 거예요.</li></ul>`},
  ba:{t:'Bland-Altman: 두 기기의 차이', refs:[4,1], html:()=>`
    <p>같은 사람을 두 기기로 잰 값의 <b>차이(BIA − DXA)</b>를 세로축에, <b>두 값의 평균</b>을 가로축에 찍은 그래프예요. 실선은 평균 차이(편향), 점선은 95%의 사람이 들어오는 범위(일치한계)예요.</p>
    <ul class="facts"><li>근육지수: BIA가 평균 남 +0.96, 여 +1.01 kg/m² 높음 (95% 일치한계 남 ±0.89, 여 ±0.78)</li><li>체지방률: BIA가 평균 남 −5.35, 여 −6.57%p 낮음 (95% 일치한계 남 ±6.10, 여 ±6.01)</li><li>모두 복합표본 가중 추정(가중치 wt_itvex)이에요. 대상: 40세 이상 3,187명(남 1,318, 여 1,869).</li></ul>
    ${fig(IMG.ba_smi, '근육지수 Bland-Altman (국민건강영양조사 2024, 40세 이상 3,187명, 가중)')}${fig(IMG.ba_pbf, '체지방률 Bland-Altman (같은 자료, 가중)')}
    <p class="small">그래프는 원시자료로 그렸어요. 개인 한 명 한 명의 점 대신, 비슷한 값의 사람을 육각형 칸으로 묶어 색 진하기로 사람 수를 보여 주고, 5명 미만인 칸은 표시하지 않았어요(개인 식별 방지). 선은 모두 복합표본 가중 추정이에요.</p>`},
  kappa:{t:'일치도: 카파와 새로발견·해소', refs:[5,1], html:()=>`
    <p><b>가중 카파</b>는 우연히 맞을 확률을 빼고 두 분류가 얼마나 일치하는지 보는 지표예요(1 = 완전 일치, 0 = 우연 수준). 우리 결과는 <b>0.53~0.62</b>로 "중간 정도" 일치예요.</p>
    <ul class="facts"><li><b>새로발견</b>: BIA로는 해당 아님 → DXA로는 해당. BIA로 괜찮던 사람 중 <b>7.6~9.3%</b>.</li><li><b>해소</b>: BIA로는 해당 → DXA로는 해당 아님. BIA 해당군 중 <b>30.6~37.5%</b>.</li><li>민감도(DXA 해당군을 BIA도 잡은 비율) 0.63~0.69.</li></ul>
    ${fig(IMG.agree, '상대 분류 결과(전체 대비 가중 비율)')}`},
  shape:{t:'체형과 엇갈림: 키·BMI', refs:[1,2], html:()=>`
    <p>BIA로는 근육이 괜찮았는데 DXA로는 하위군인 경우가 <b>키가 클수록, BMI가 낮을수록(마를수록)</b> 많았어요.</p>
    <ul class="facts"><li>복합표본 가중 로지스틱 회귀(1 SD당 오즈비, FDR 보정): BMI OR 0.14~0.15, 키 OR 2.1~2.4.</li><li>체형이 평균과 다를수록 BIA 추정식의 가정에서 멀어지는 것으로 해석할 수 있어요(기전은 문헌 검토 중).</li></ul>
    ${fig(IMG.shape, 'BIA 근육 괜찮음 → DXA 하위군 비율, 키·BMI 3분위별(가중)')}<p class="small">겉모습으로 건강을 판단하면 안 되는 이유이기도 해요.</p>`},
  distance:{t:'기준선까지의 거리', refs:[1], html:()=>`
    <p>"하위군이다/아니다"로 나누면 기준선 바로 위와 아래가 전혀 다른 사람처럼 보여요. 그래서 <b>기준선까지 얼마나 떨어져 있는지</b>를 성별 표준편차(SD) 단위로 함께 썼어요.</p>
    <p>예: 근육 거리 = (내 근육지수 − 기준선) ÷ 성별 SD. 0에 가까울수록 경계에 있어요.</p>
    <p>예측 모형에서 이 거리가 가장 강한 요인이었어요. 경계에 있을수록 두 기기의 분류가 쉽게 달라졌어요.</p>`},
  model:{t:'예측 모형과 검증', refs:[1,18,19], html:()=>`
    <ul class="facts"><li><b>구조</b>: 성별 × 방향(BIA 해당 아님→DXA 해당, BIA 해당→DXA 아님)마다 설계 가중 로지스틱 회귀.</li>
    <li><b>변수</b>: 근육 = 기준선 거리, 나이, 키, BMI, 허리둘레(없으면 허리 뺀 모형) / 체지방 = 기준선 거리, 나이.</li>
    <li><b>검증</b>: 중첩 교차검증(바깥 5겹 × 5회, 안쪽 5겹)으로 데이터 누출을 막았어요. AUC 근육 0.917·0.891, 체지방 0.836·0.844, 반대 방향 0.70~0.81.</li>
    <li><b>보정</b>: 예측 확률과 실제 비율이 맞는지. 보정 기울기 0.85~0.98(신뢰구간이 1 포함).</li>
    <li><b>뺀 변수</b>: 위상각·세포외수분비·악력·질환은 AUC 개선이 0.005 이하라 확률 계산에서 빼고 설명에만 썼어요.</li>
    <li><b>한계</b>: 2024년 한 해 자료, 외부 검증 전. 의사결정곡선(20%/50% 기준)은 탐색적 결과로만 보고해요.</li></ul>`},
  rule50:{t:'방 배정 50% 규칙', refs:[1], html:()=>`
    <p>각 축(근육·체지방)에서 "DXA로 쟀다면 분류가 바뀔 확률"이 <b>50% 이상</b>이면 그 축의 분류를 바꿔서 네 가지 방 중 하나를 정해요.</p>
    <p>이렇게 정한 유형은 DXA 상대 유형과 <b>77%</b> 일치했어요. 게임의 방을 정하기 위한 교육용 규칙이며, 검사 권고 기준이 아니에요.</p>`},
  absrel:{t:'절대 기준을 쓰면? (민감도 분석)', refs:[1], html:()=>`
    <p>국내 DXA 체지방률 절대 기준(남 26%, 여 36%)을 두 기기에 똑같이 적용해 봤어요.</p>${fig(IMG.absrel, '체지방 해당 비율: 상대 20% vs 절대 기준')}
    <p>BIA는 체지방을 낮게 읽기 때문에 같은 숫자 기준에서는 해당 비율이 크게 벌어지고(BIA 45·33% vs DXA 85·79%), 카파가 0.24·0.23으로 떨어졌어요. <b>상대 기준을 쓴 이유</b>이자, 숫자를 그대로 믿으면 안 되는 이유예요.</p>`},
  fat_signal:{t:'숨은 체지방의 혈액 신호', refs:[1,12], html:()=>`
    <p>BIA로는 체지방이 괜찮았지만 DXA로는 상위군이었던 사람(새로발견군)을 일치 정상군과 비교했어요(나이·질환 보정 복합표본 회귀).</p>
    <ul class="facts"><li>HDL 콜레스테롤: 남 −3.0, 여 −4.8 mg/dL</li><li>중성지방: 여 +12.1 mg/dL</li></ul>
    <p>체지방 엇갈림은 위상각, 세포외수분비, 몸통 지방 비율과 관련이 있었어요. 몸통은 전체 저항에 덜 반영돼서 몸통 지방이 BIA에서 덜 보일 수 있어요.</p>`},
  phase:{t:'위상각·세포외수분비', refs:[24,3], html:()=>`
    <p><b>위상각</b>은 전류가 세포막을 지날 때 생기는 시간 차이로, 세포 건강과 수분 상태를 반영하는 지표로 연구돼요. <b>세포외수분비</b>(세포 밖 수분 ÷ 전체 수분)가 높으면 부종 등 수분 균형이 달라졌다는 신호일 수 있어요.</p>
    <p>우리 분석에서 두 지표는 체지방 엇갈림과 관련이 있었지만 예측력을 거의 올리지 않아(ΔAUC ≤ 0.005) <b>설명용</b>으로만 써요. 측정 조건(식사·운동·수분)을 지켜야 하는 이유이기도 해요.</p>`},
  ranges:{t:'내 수치 범위 보는 법', refs:[1,10,27], html:()=>`
    <ul class="facts"><li><b>회색 띠</b>: 같은 성별·연령대 40세 이상 한국인(국민건강영양조사 2024, 가중) 100명 중 5~95번째. <b>진한 띠</b>는 20~80번째.</li>
    <li><b>빨간 선</b>: 우리 연구의 상대 기준선(근육 하위 20%, 체지방 상위 20%).</li>
    <li><b>보라 선</b>: AWGS 2019 BIA 근육지수 기준(남 7.0, 여 5.7 kg/m²).</li>
    <li><b>BMI 색 구간</b>: 대한비만학회 기준(18.5 / 23 / 25). <b>허리둘레</b>: 남 90, 여 85 cm.</li></ul>
    <p class="small">BIA 값을 기준으로 그린 위치예요. DXA로 재면 위치가 달라질 수 있어요.</p>${posNotice()}${dataInfoTable()}`}
};
const statBtn = (k, label) => `<button type="button" class="qbtn" data-stat="${k}" aria-label="${esc(STATS[k].t)} 통계 설명">?${label ? `<span>${label}</span>` : ''}</button>`;
function bindStats(root){ root.querySelectorAll('[data-stat]').forEach(b=>b.onclick = e=>{ e.stopPropagation(); openStat(b.dataset.stat); }); }
const Q_STAT = {C1:'kappa', B1:'phase', B2:'distance', B3:'bia_dxa', B4:'shape', F1:'ba', F2:'ranges', F3:'absrel', F4:'fat_signal', M1:'ba', M2:'relative', M3:'survey', M4:'shape', I1:'relative', I2:'model', I3:'bia_dxa', I4:'rule50'};
/* 정책 카드: 퀴즈를 풀면 얻는 정책 제안서 조각 → 3단계(개인·지역사회·보건정책)로 모임 */
const Q_LVL = {B1:'지역사회', B2:'보건정책', B3:'보건정책', B4:'개인', F1:'보건정책', F2:'지역사회', F3:'보건정책', F4:'개인', M1:'개인', M2:'지역사회', M3:'보건정책', M4:'지역사회', I1:'개인', I2:'보건정책', I3:'보건정책', I4:'지역사회'};
const cards = [];

/* ================= 내 수치 범위 그래프 ================= */
function pctPhrase(v, q){ const p = pctOf(v, q); return p==='5 미만' ? '가장 낮은 5% 안' : p==='95 초과' ? '가장 높은 5% 안' : `낮은 쪽에서 약 ${p}번째`; }
function pctOf(v, q){ const P = [5,20,50,80,95]; if (v <= q[0]) return '5 미만'; if (v >= q[4]) return '95 초과';
  for (let i=0;i<4;i++) if (v <= q[i+1]){ const t = (v-q[i])/(q[i+1]-q[i] || 1); return String(Math.round(P[i] + t*(P[i+1]-P[i]))); } return '-'; }
function gauge(o){ // o: {name, unit, v, q, marks:[{x,label,cls}], zones:[{a,b,label,col}], stat}
  const xs = [o.v, ...(o.q||[]), ...(o.marks||[]).map(m=>m.x)].filter(Number.isFinite); let lo = Math.min(...xs), hi = Math.max(...xs); const pad = (hi-lo)*0.12 || 1; lo -= pad; hi += pad;
  if (o.zones){ lo = Math.min(lo, o.zones[0].b - pad*2); hi = Math.max(hi, o.zones[o.zones.length-1].a + pad*2); }
  const X = x => ((clamp(x, lo, hi)-lo)/(hi-lo)*100).toFixed(2) + '%';
  let h = `<div class="gauge"><div class="gh"><b>${o.name}</b> <span class="gv">${f1(o.v)} ${o.unit}</span>${o.stat ? statBtn(o.stat) : ''}</div><div class="gt">`;
  if (o.zones) o.zones.forEach(z=>{ const a = Math.max(lo, z.a), b = Math.min(hi, z.b); if (b > a) h += `<i class="z" style="left:${X(a)};width:calc(${X(b)} - ${X(a)});background:${z.col}" title="${z.label}"></i>`; });
  if (o.q){ h += `<i class="b1" style="left:${X(o.q[0])};width:calc(${X(o.q[4])} - ${X(o.q[0])})"></i><i class="b2" style="left:${X(o.q[1])};width:calc(${X(o.q[3])} - ${X(o.q[1])})"></i><i class="md" style="left:${X(o.q[2])}"></i>`; }
  (o.marks||[]).forEach(m=>{ h += `<i class="mk ${m.cls||''}" style="left:${X(m.x)}"><em>${m.label}</em></i>`; });
  h += `<i class="me" style="left:${X(o.v)}"><em>나</em></i></div>`;
  if (o.zones) h += `<div class="zl">${o.zones.map(z=>`<span><i style="background:${z.col}"></i>${z.label}</span>`).join('')}</div>`;
  if (o.note) h += `<div class="gn">${o.note}</div>`;
  return h + '</div>';
}
function myGauges(v, r){
  const key = `${r.sx}_${r.band}`, R = RANGES[key] || {}; const out = []; const sxT = r.sx===1 ? '남성' : '여성';
  if (R.bia_smi) out.push(gauge({name:'근육지수 (BIA)', unit:'kg/m²', v:r.smi, q:R.bia_smi, stat:'relative', marks:[{x:r.cut.smi, label:'하위 20%', cls:'red'}, {x: r.sx===1 ? 7.0 : 5.7, label:'AWGS', cls:'pur'}],
    note:`같은 ${sxT}·${r.band}세(조사 ${DATA_INFO.nBand[key]}명, 가중) 100명 중 ${pctPhrase(r.smi, R.bia_smi)} · 빨강: 상대 기준[7] · 보라: AWGS 2019 BIA 기준[27]`}));
  if (R.bia_pbf) out.push(gauge({name:'체지방률 (BIA)', unit:'%', v:v.pbf, q:R.bia_pbf, stat:'relative', marks:[{x:r.cut.pbf, label:'상위 20%', cls:'red'}],
    note:`같은 ${sxT}·${r.band}세(조사 ${DATA_INFO.nBand[key]}명, 가중) 100명 중 ${pctPhrase(v.pbf, R.bia_pbf)} · DXA로는 평균 ${f1(BA[r.sx].pbf)}%p 높게 나왔어요[4]`}));
  out.push(gauge({name:'BMI', unit:'kg/m²', v:r.bmi, q:R.HE_BMI, stat:'ranges', zones:[{a:10,b:18.5,label:'저체중',col:'#d6e4f0'},{a:18.5,b:23,label:'정상',col:'#d7eadf'},{a:23,b:25,label:'비만 전단계',col:'#f6ead0'},{a:25,b:60,label:'비만',col:'#f5d9cf'}],
    note:`대한비만학회 2022 기준 구간[10] · 띠는 같은 ${sxT}·${r.band}세 분포 · BMI는 근육과 지방을 구분하지 못해요.`}));
  if (Number.isFinite(v.wc)) out.push(gauge({name:'허리둘레', unit:'cm', v:v.wc, q:R.HE_wc, stat:'ranges', marks:[{x: r.sx===1 ? 90 : 85, label:'복부비만', cls:'red'}], note:`복부비만 기준 ${r.sx===1 ? '남 90' : '여 85'} cm 이상 (대한비만학회 2022)[10] · 띠는 같은 ${sxT}·${r.band}세 분포`}));
  return out.join('');
}

const KEY_SVG = '<svg class="keyi" viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="12" r="4.2"/><circle cx="7" cy="12" r="1.4" fill="#fff" stroke="none"/><path d="M11 12h10M17.5 12v3.2M20.5 12v2.4"/></svg>';
