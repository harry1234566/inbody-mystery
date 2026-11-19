/* ================= 공통 ================= */
const $ = id => document.getElementById(id);
const CFG = __CFG__;
const CONSULT = '연구모형상 결과가 달라질 가능성이 있으므로 필요하면 전문가와 상담 후 정확한 검사를 고려해 보세요.';
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ================= 참고문헌 =================
   모든 문항·정책 문구는 아래 번호로 근거를 단다. 1번은 팀 자체 분석. */
const REFS = {
  1:{s:'본 연구', t:'집현전. 국민건강영양조사 2024(제9기 3차년도) 원시자료, 40세 이상 BIA·DXA 동시 측정 3,187명, 복합표본(kstrata·psu·wt_itvex) 분석. 질병관리청 원시자료.'},
  2:{s:'Kyle 2004 I', t:'Kyle UG, Bosaeus I, De Lorenzo AD, et al. Bioelectrical impedance analysis—part I: review of principles and methods. Clin Nutr. 2004;23(5):1226–1243.'},
  3:{s:'Kyle 2004 II', t:'Kyle UG, Bosaeus I, De Lorenzo AD, et al. Bioelectrical impedance analysis—part II: utilization in clinical practice. Clin Nutr. 2004;23(6):1430–1453.'},
  4:{s:'Bland·Altman 1986', t:'Bland JM, Altman DG. Statistical methods for assessing agreement between two methods of clinical measurement. Lancet. 1986;1(8476):307–310.'},
  5:{s:'Landis·Koch 1977', t:'Landis JR, Koch GG. The measurement of observer agreement for categorical data. Biometrics. 1977;33(1):159–174.'},
  6:{s:'WHO 2020', t:'Bull FC, Al-Ansari SS, Biddle S, et al. World Health Organization 2020 guidelines on physical activity and sedentary behaviour. Br J Sports Med. 2020;54(24):1451–1462.'},
  7:{s:'AWGS 2025', t:'Chen LK, et al. Asian Working Group for Sarcopenia (AWGS) 2025 consensus. Nature Aging. 2025.'},
  8:{s:'EWGSOP2 2019', t:'Cruz-Jentoft AJ, Bahat G, Bauer J, et al. Sarcopenia: revised European consensus on definition and diagnosis. Age Ageing. 2019;48(1):16–31.'},
  9:{s:'ESPEN·EASO 2022', t:'Donini LM, Busetto L, Bischoff SC, et al. Definition and diagnostic criteria for sarcopenic obesity: ESPEN and EASO consensus statement. Clin Nutr. 2022;41(4):990–1000.'},
  10:{s:'대한비만학회 2022', t:'대한비만학회. 2022 비만 진료지침(제8판). 한국 성인 복부비만 기준: 허리둘레 남 90 cm, 여 85 cm 이상.'},
  11:{s:'Romero-Corral 2010', t:'Romero-Corral A, Somers VK, Sierra-Johnson J, et al. Normal weight obesity: a risk factor for cardiometabolic dysregulation and cardiovascular mortality. Eur Heart J. 2010;31(6):737–746.'},
  12:{s:'NCCOR', t:'National Collaborative on Childhood Obesity Research(NCCOR). Measures Registry User Guide: Assessing adiposity—BIA. "몸통은 체중의 약 75%이지만 전체 임피던스의 약 9%". ', u:'https://www.nccor.org/tools-assessingobesity-guide/assessing-adiposity-3/'},
  13:{s:'PROT-AGE 2013', t:'Bauer J, Biolo G, Cederholm T, et al. Evidence-based recommendations for optimal dietary protein intake in older people: a position paper from the PROT-AGE Study Group. J Am Med Dir Assoc. 2013;14(8):542–559.'},
  14:{s:'국가건강검진 항목', t:'국민건강보험공단 일반건강검진 검사항목: 비만(신장·체중·허리둘레·체질량지수). 정리: KB Think 국가건강검진 총정리.', u:'https://kbthink.com/life/wellness/healthcheck.html'},
  15:{s:'노인신체기능검사', t:'국가건강검진 노인신체기능검사(66·70·80세): 일어서서 걷기(TUG) 등. 메디칼타임즈 보도.', u:'https://www.medicaltimes.com/Main/News/NewsView.html?ID=1149791'},
  16:{s:'돌봄통합지원법', t:'의료·요양 등 지역 돌봄의 통합지원에 관한 법률(돌봄통합지원법), 2026년 3월 27일 시행. 다음 뉴스 보도.', u:'https://v.daum.net/v/20260319181650156'},
  17:{s:'보건소 모바일 헬스케어', t:'보건소 모바일 헬스케어 사업(19세 이상, 24주 비대면 건강관리: 활동량계·앱·전문가 상담). 서울시 미디어허브 구로구 사례.', u:'https://mediahub.seoul.go.kr/archives/2014287'},
  18:{s:'TRIPOD+AI 2024', t:'Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement: updated guidance for reporting clinical prediction models that use regression or machine learning methods. BMJ. 2024;385:e078378.'},
  19:{s:'Van Calster 2019', t:'Van Calster B, McLernon DJ, van Smeden M, et al. Calibration: the Achilles heel of predictive analytics. BMC Med. 2019;17:230.'},
  20:{s:'Galesic 2009', t:'Galesic M, Garcia-Retamero R, Gigerenzer G. Using icon arrays to communicate medical risks: overcoming low numeracy. Health Psychol. 2009;28(2):210–216.'},
  21:{s:'Puhl·Heuer 2010', t:'Puhl RM, Heuer CA. Obesity stigma: important considerations for public health. Am J Public Health. 2010;100(6):1019–1028.'},
  22:{s:'Suarez-Lledo 2021', t:'Suarez-Lledo V, Alvarez-Galvez J. Prevalence of health misinformation on social media: systematic review. J Med Internet Res. 2021;23(1):e17187.'},
  23:{s:'DeSmet 2014', t:'DeSmet A, Van Ryckeghem D, Compernolle S, et al. A meta-analysis of serious digital games for healthy lifestyle promotion. Prev Med. 2014;69:95–107.'},
  24:{s:'Norman 2012', t:'Norman K, Stobäus N, Pirlich M, Bosy-Westphal A. Bioelectrical phase angle and impedance vector analysis—clinical relevance and applicability of impedance parameters. Clin Nutr. 2012;31(6):854–861.'},
  26:{s:'인바디 측정 유의사항', t:'㈜인바디(InBody) 공식 체성분 측정 유의사항: 가벼운 옷차림, 금속 액세서리 제거, 측정 전 화장실 이용, 오전 측정 권장, 상온에서 측정, 공복 상태, 운동 전 측정, 사우나·목욕 후 측정 금지, 월경 기간 피하기, 삽입형 의료기기(심장박동기 등) 착용 시 측정 금지.'},
  25:{s:'Lee·Gallagher 2008', t:'Lee SY, Gallagher D. Assessment methods in human body composition. Curr Opin Clin Nutr Metab Care. 2008;11(5):566–572.'}
};
const refTag = ids => ids.map(i => `<button type="button" class="ref" data-ref="${i}">[${i}] ${esc(REFS[i].s)}</button>`).join('');

/* ================= 연구모형 ================= */
const sig = z => 1/(1+Math.exp(-z));
const bandOf = a => a < 50 ? '40-49' : a < 65 ? '50-64' : '65+';
function score(key, x){ const m = CFG.models[key]; return sig(m.vars.reduce((s,v,i)=>s + m.coef[i]*x[v], 0)); }
function predict(v){
  const sx = v.sex, band = bandOf(v.age), cut = CFG.cutoffs[`${sx}_${band}`], sd = CFG.sd[sx];
  const ageM = Math.min(v.age, 80); /* 국민건강영양조사 나이는 80세 이상을 80으로 묶어 공개 → 모형에는 80까지만 */
  const h2 = (v.ht/100)**2, bmi = v.wt/h2;
  const smi = v.mode==='smi' ? v.smi : (v.ra+v.la+v.rl+v.ll)/h2;
  const bm = smi < cut.smi ? 1 : 0, bf = v.pbf >= cut.pbf ? 1 : 0;
  const dist_m = (smi - cut.smi)/sd.smi, dist_f = (cut.pbf - v.pbf)/sd.pbf;
  const hasWc = Number.isFinite(v.wc);
  const pm = score(`${hasWc?'muscle':'muscle_nowaist'}_${bm?'c2':'c1'}_${sx}`, {const:1, dist_m, age:ageM, HE_ht:v.ht, HE_BMI:bmi, HE_wc:v.wc});
  const pf = score(`fat_${bf?'c2':'c1'}_${sx}`, {const:1, dist_f, age:ageM});
  const rm = CFG.rate[`muscle_${bm?'c2':'c1'}_${sx}_${band}`], rf = CFG.rate[`fat_${bf?'c2':'c1'}_${sx}_${band}`];
  const mLow = bm ? (pm >= .5 ? 0 : 1) : (pm >= .5 ? 1 : 0);
  const fHigh = bf ? (pf >= .5 ? 0 : 1) : (pf >= .5 ? 1 : 0);
  const T = DATA_INFO.train[sx], ext = [];
  const chk = (k, x, lab, u) => { if (Number.isFinite(x) && (x < T[k][0] || x > T[k][1])) ext.push(`${lab} ${f1(x)}${u} (연구 자료 1~99% 범위 ${T[k][0]}~${T[k][1]}${u})`); };
  chk('ht', v.ht, '키', ' cm'); chk('bmi', bmi, 'BMI', ' kg/m²'); if (hasWc) chk('wc', v.wc, '허리둘레', ' cm'); chk('smi', smi, '근육지수', ' kg/m²'); chk('pbf', v.pbf, '체지방률', '%');
  if (v.age > 80) ext.push(`나이 ${v.age}세 (공개 자료는 80세 이상을 80세로 묶어, 모형에는 80세로 넣었어요)`);
  return {sx, band, cut, smi, bmi, bm, bf, dist_m, dist_f, pm, pf, rm, rf, mLow, fHigh, hasWc, ext,
          room: mLow && fHigh ? 'both' : mLow ? 'muscle' : fHigh ? 'fat' : 'balance'};
}
function factors(v, r){
  const out = [], mean = CFG.means[r.sx], opt = CFG.opt[`${r.sx}_${r.band}`];
  if (Math.abs(r.dist_m) < 0.5) out.push('근육지수가 상대 기준선 가까이(성별 표준편차의 0.5배 이내) 있어요. 기준선 근처일수록 두 기기의 분류가 쉽게 달라졌어요.');
  if (Math.abs(r.dist_f) < 0.5) out.push('체지방률이 상대 기준선 가까이 있어요. 기준선 근처일수록 두 기기의 분류가 쉽게 달라졌어요.');
  if (!r.bm && v.ht > mean.ht && r.bmi < mean.bmi - 1) out.push('키가 크고 마른 편이에요. 이런 체형에서는 BIA가 근육을 DXA보다 높게 보여주는 경향이 있었어요.');
  if (r.bm && v.ht < mean.ht) out.push('키가 작은 편이에요. BIA로 근육 하위군이어도 DXA로는 아닌 경우가 키가 작을수록 많았어요.');
  if (Number.isFinite(v.pha) && v.pha < opt.pha_low20) out.push('위상각이 같은 성별·연령대의 하위 20%보다 낮아요. 위상각은 탐색 분석에서 체지방 불일치 후보로 나왔지만 복합표본 회귀에서는 통계적으로 확실하지 않았어요(설명용, 확률 계산에는 쓰지 않음).');
  if (Number.isFinite(v.ecw) && v.ecw >= 0.40) out.push('세포외수분비가 0.40 이상이에요. 몸의 수분 균형이 달라져 있으면 BIA 결과 해석에 주의가 필요해요.');
  if (!r.hasWc) out.push('허리둘레가 없어서 허리둘레를 뺀 근육 모형으로 계산했어요.');
  if (!out.length) out.push('측정값이 기준선에서 충분히 떨어져 있어, 두 기기의 분류가 같을 가능성이 높은 편이에요.');
  return out;
}

/* ================= 방 ================= */
const ROOMS = {
  balance:{no:'A', name:'균형 유지의 방', space:'체성분 측정실', camp:'올바른 측정, 건강한 주권', en:'THE MEASUREMENT ROOM',
    wall:'#ece6d6', wain:'#a9cdb9', rail:'#e3d3b3', floor:'#efe8d8', grout:'#e0d6c1', door:'#5f9e86', accent:'#2f6f5e',
    why:'근육과 체지방 모두 상대적 하위·상위군이 아닐 가능성이 더 높게 나왔어요.', qs:['B1','B2','B3','B4'],
    focus:'숫자를 바르게 재고, 경계에 있을 때 한 번 더 확인하는 법',
    pledges:['같은 조건(오전·공복·화장실 후·운동 전)에서 다시 재기','주 150분 유산소 + 주 2일 근력운동','SNS 측정 꿀팁 대신 공식 안내 확인하기'],
    doctor:'지금은 균형 쪽으로 예측됐지만, 숫자는 측정 조건과 기준선과의 거리에 따라 흔들릴 수 있어요. 같은 조건에서 꾸준히 재고, 지금의 생활 습관을 지켜 주세요.'},
  fat:{no:'B', name:'체지방 관리의 방', space:'대사증후군 상담실', camp:'숨은 비만 찾기', en:'THE METABOLIC CLINIC',
    wall:'#f1e6da', wain:'#e9b9a2', rail:'#e6cfb1', floor:'#f1e8da', grout:'#e3d4c0', door:'#d98468', accent:'#b8573c',
    why:'체지방이 같은 성별·연령대의 상대적 상위군일 가능성이 더 높게 나왔어요.', qs:['F1','F2','F3','F4'],
    focus:'체중에 가려진 체지방과 대사 신호를 허리둘레·혈액 지표로 함께 보는 법',
    pledges:['한 달에 한 번 허리둘레 재기','주 150~300분 빠르게 걷기','건강검진 혈액 지표(HDL·중성지방) 확인하기'],
    doctor:'인바디는 체지방을 DXA보다 낮게 보여주는 경향이 있었어요. 체중보다 허리둘레와 혈액 지표를 함께 보고, 걷기부터 꾸준히 시작해 보세요.'},
  muscle:{no:'C', name:'근육 관리의 방', space:'근력·낙상예방 교실', camp:'청춘 근육, 안심 돌봄', en:'THE STRENGTH CLASS',
    wall:'#e7e8e0', wain:'#a8c0d6', rail:'#dfd2b8', floor:'#ece6d8', grout:'#ddd3c0', door:'#5f88b5', accent:'#2f5f8a',
    why:'근육이 같은 성별·연령대의 상대적 하위군일 가능성이 더 높게 나왔어요.', qs:['M1','M2','M3','M4'],
    focus:'근육의 양보다 힘과 기능을 확인하고, 동네에서 근력을 지키는 법',
    pledges:['주 2일 근력운동','끼니마다 단백질 식품 한 가지','가족과 악력·의자 일어서기 확인하기'],
    doctor:'인바디는 근육을 DXA보다 넉넉하게 보여주는 경향이 있었어요. 숫자에 안심하기보다 근력과 기능을 확인하고, 동네 근력운동 교실을 활용해 보세요.'},
  both:{no:'D', name:'통합 관리의 방', space:'만성질환 예방관리실', camp:'내 몸의 이중고 탈출', en:'THE PREVENTION OFFICE',
    wall:'#ebe6df', wain:'#c3b5d6', rail:'#e2d3b6', floor:'#eee8dc', grout:'#e0d6c4', door:'#8a74b3', accent:'#5b4787',
    why:'근육은 상대적 하위군, 체지방은 상대적 상위군일 가능성이 함께 높게 나왔어요.', qs:['I1','I2','I3','I4'],
    focus:'체중계 숫자 뒤에서 함께 움직이는 근육과 지방을 같이 관리하는 법',
    pledges:['근력운동과 유산소운동 함께하기','끼니마다 단백질 식품 한 가지','필요하면 전문가와 상담하기'],
    doctor:'근육과 체지방을 함께 살펴볼 필요가 있다고 예측됐어요. 체중만 보지 말고 근력운동과 유산소운동, 단백질 섭취를 함께 챙겨 보세요.'}
};
const ISSUE = {'①':'인바디 숫자 미스터리','②':'정밀 검사 접근성','③':'잘못된 정보','④':'체형 편견'};

/* 개인 맞춤 값: 본 연구 Bland-Altman 평균 차이(BIA − DXA)와 95% 일치한계 폭 */
/* Bland-Altman: 복합표본 가중 평균 차이(BIA−DXA)와 95% 일치한계 반폭(1.96×가중 SD) */
const BA = {1:{pbf:5.35, pbfLoA:6.1, smi:0.96, smiLoA:0.89}, 2:{pbf:6.57, pbfLoA:6.0, smi:1.01, smiLoA:0.78}};
const f1 = x => (Math.round(x*10)/10).toFixed(1);
const sdTxt = d => { const a = Math.abs(d); return a < 0.5 ? `아주 가까이(표준편차의 ${f1(a)}배)` : `표준편차의 ${f1(a)}배만큼`; };

/* ================= 문항 =================
   issue: 사회문제 번호, kind: choice | short, refs: 근거 번호, lesson: 탐험 수첩에 남는 한 줄 */
const Q = {
 C1:{issue:'①', name:'대기실 TV', title:'인바디 "하위·상위군" 100명, DXA로 다시 재면?',
  q:()=>'인바디(BIA)에서 근육 하위군이나 체지방 상위군으로 나온 사람 100명을 병원 정밀 검사(DXA)로 다시 재면, 여전히 같은 군인 사람은 대략 몇 명일까요?',
  opts:()=>['100명 모두','약 60~70명','약 10명'], ans:1,
  hint:'두 기기 결과는 많이 겹치지만, 완전히 같지는 않아요.',
  ok:()=>'우리 팀이 국민건강영양조사 2024의 40세 이상 3,187명을 분석했더니, BIA로 해당군이었던 사람의 31~38%는 DXA로는 해당하지 않았어요. 반대로 BIA로 괜찮았던 사람의 8~9%는 DXA로는 해당했어요. 두 기기의 일치도(가중 카파 0.53~0.62)는 "중간 정도"예요. BIA는 약한 전류가 몸속 수분을 지나는 저항으로, DXA는 두 가지 에너지의 X선이 흡수되는 차이로 재기 때문에 같은 몸도 다르게 읽혀요.',
  lesson:'BIA 해당군의 31~38%는 DXA로는 해당하지 않았다. 숫자 하나로 단정하지 않기.',
  camp:'숫자 하나로 내 건강을 단정하지 말아요. 여러 지표를 함께 보는 것이 "진짜 내 몸 바로알기"의 시작이에요.', refs:[1,5,2,25]},

 B1:{issue:'①', name:'인바디 측정기', title:'한 달 만에 체지방 2%p 감소?',
  q:()=>'지난달에는 아침 공복에, 오늘은 점심을 먹고 운동한 직후에 인바디를 쟀더니 체지방률이 2%p 낮게 나왔어요. 가장 알맞은 해석은?',
  opts:()=>['한 달 만에 지방이 확실히 빠졌다','측정 조건이 달라 비교하기 어렵다. 같은 조건에서 다시 재 본다','기계가 고장 났다'], ans:1,
  hint:'두 번의 측정에서 무엇이 달랐는지 살펴보세요.',
  ok:()=>'BIA는 식사, 운동, 몸속 수분 상태에 따라 값이 달라져요. ESPEN의 BIA 지침과 인바디 측정 유의사항 모두 공복, 화장실 다녀온 뒤, 운동 전에 재도록 안내해요. 인바디는 오전 측정, 상온에서 측정, 사우나·목욕 직후 피하기도 권해요. 변화를 비교하려면 같은 시간대·같은 조건에서 재야 해요.',
  lesson:'BIA 비교는 오전·공복·화장실 후·운동 전처럼 같은 조건에서.',
  camp:'보건소와 헬스장 측정기 옆에 "표준 측정 안내문"을 붙이자고 제안해요.', refs:[3,26]},
 B2:{issue:'②', name:'기준선 차트', title:'경계선 위의 나',
  q:c=>`방문자님의 값은 같은 성별·연령대 기준선에서 근육은 ${sdTxt(c.dm)}, 체지방은 ${sdTxt(c.df)} 떨어져 있어요(표준편차의 배수: 0에 가까울수록 기준선 바로 옆이에요). 우리 모형에서 두 기기 결과가 가장 잘 엇갈린 사람은?`,
  opts:()=>['기준선에서 아주 먼 사람','기준선 바로 근처에 있는 사람','나이가 가장 어린 사람'], ans:1,
  hint:'차트의 빨간 선 근처에서는 작은 차이로도 칸이 바뀌어요.',
  ok:c=>`예측 모형에서 가장 강한 요인은 기준선까지의 거리였어요. ${Math.min(Math.abs(c.dm),Math.abs(c.df))<0.5 ? '방문자님은 경계 가까이에 있어서, 한 번의 결과로 단정하지 말고 같은 조건에서 다시 확인하는 것이 좋아요.' : '방문자님은 기준선에서 비교적 떨어져 있지만, 경계 근처라면 한 번 더 확인하는 습관이 도움이 돼요.'} 정밀 검사를 모두가 받기는 어려우니, 경계에 있는 사람을 먼저 다시 확인하는 것이 한정된 검사를 나누는 현실적인 방법이에요.`,
  lesson:'기준선 근처일수록 BIA·DXA 분류가 잘 엇갈린다. 경계면 다시 확인.',
  camp:'결과지에 "경계 구간" 표시를 넣어, 경계에 있는 사람이 다시 확인하도록 돕자고 제안해요.', refs:[1]},
 B3:{issue:'③', name:'고장 난 안내판', title:'SNS 속설: "물 많이 마시고 재면 근육이 늘어난다"?', kind:'short',
  q:()=>'측정기 안내판 글자가 지워졌어요. 빈칸을 채워 고쳐 주세요.', sign:'BIA는 몸속 [ ]을 지나는 전류의 저항으로 근육과 지방을 계산하므로, 물을 마시거나 땀을 흘리면 결과가 달라집니다.',
  short:['수분','물','체수분','수분량','몸속수분','몸의수분'], ansText:'수분', chips:['수분','지방','뼈','공기','혈압'],
  hint:'물을 마시거나 땀을 흘리면 몸속에서 늘거나 줄어드는 것이에요.',
  ok:()=>'BIA가 직접 재는 것은 전류가 지나가는 몸속 수분이고, 근육과 지방은 이 값으로 추정해요. 물을 마셔 숫자가 바뀌었다면 근육이 늘어난 게 아니라 수분 상태가 바뀐 거예요. 소셜미디어에는 이런 잘못된 건강 정보가 흔하다는 체계적 문헌고찰도 있어요.',
  lesson:'BIA는 몸속 수분을 재서 근육·지방을 추정한다. 물 마시기는 측정값을 흔들 뿐.',
  camp:'SNS 측정 꿀팁보다 공식 측정 안내를 믿어요. 공공기관이 체성분 정보를 팩트체크하자고 제안해요.', refs:[2,22]},
 B4:{issue:'④', name:'대기실 대화', title:'"저분은 말랐으니 운동 안 해도 되겠네"',
  q:()=>'측정실 대기 줄에서 누군가 마른 체형의 사람을 보고 이렇게 말해요. 우리 연구와 지침에 비추어 가장 알맞은 말은?',
  opts:()=>['맞다. 마른 사람은 관리가 필요 없다','체형과 관계없이 모든 성인에게 주 150분 이상 유산소운동과 주 2일 이상 근력운동이 권장된다','마른 사람은 무조건 체중을 늘려야 한다'], ans:1,
  hint:'겉모습과 건강 관리의 필요는 다른 이야기예요.',
  ok:()=>'우리 자료에서 키가 크고 마른 사람일수록 BIA가 근육을 DXA보다 높게 보여주는 경향이 있었어요(BMI가 높을수록 불일치 오즈비 0.14~0.15). 겉모습만으로는 알 수 없다는 뜻이에요. WHO는 체형과 관계없이 모든 성인에게 주 150~300분 중강도 유산소운동과 주 2일 이상 근력운동을 권해요. 체형을 두고 하는 말은 그 사람의 건강 행동에도 나쁜 영향을 줄 수 있어요.',
  lesson:'체형으로 건강을 판단하지 않기. 운동 권고는 모두에게 같다(WHO 2020).',
  camp:'"정상이면 끝", "마르면 건강" 같은 체형 편견 대신, 모두에게 맞는 관리를 응원해요.', refs:[1,6,21]},

 F1:{issue:'①', name:'DXA 검사대', title:'내 체지방률, DXA로 쟀다면?',
  q:c=>`방문자님의 인바디 체지방률은 ${f1(c.pbf)}%예요. 우리 연구(국민건강영양조사 2024, 가중 분석)에서 같은 사람을 DXA로 재면 체지방률이 평균 ${f1(BA[c.sex].pbf)}%p 높게 나왔어요. DXA로 쟀다면 대략 몇 %였을까요?`,
  opts:c=>[`약 ${f1(c.pbf-BA[c.sex].pbf)}%`,`약 ${f1(c.pbf)}%`,`약 ${f1(c.pbf+BA[c.sex].pbf)}%`], ans:2,
  hint:'인바디는 체지방을 DXA보다 낮게 보여주는 경향이 있었어요.',
  ok:c=>`평균 차이를 더한 참고값은 약 ${f1(c.pbf+BA[c.sex].pbf)}%예요. 다만 사람마다 차이가 커서, 95%의 사람은 평균 차이에서 ±${f1(BA[c.sex].pbfLoA)}%p 안에 있었어요(Bland-Altman 일치한계). 그래서 숫자 하나보다 범위로 이해하는 것이 정확해요.`,
  lesson:'BIA 체지방률은 DXA보다 평균 5.4~6.6%p 낮았다(가중 평균, 일치한계 ±6%p). 범위로 읽기.',
  camp:'체성분 결과지에 "측정 기기에 따라 체지방률이 다르게 나올 수 있음"을 표기하자고 제안해요.', refs:[1,4]},
 F2:{issue:'②', name:'줄자와 검진 안내판', title:'DXA 없이도, 누구나 확인할 수 있는 지표',
  q:()=>'정밀 장비가 없어도, 국가 일반건강검진에서 이미 누구나 확인할 수 있는 복부비만 지표는?',
  opts:()=>['허리둘레','DXA 체지방률','위상각'], ans:0,
  hint:'옆에 걸린 줄자로 재는 것이에요.',
  ok:()=>'국가 일반건강검진의 비만 검사에는 키, 체중, 허리둘레, 체질량지수가 들어 있어요. 대한비만학회 기준 한국 성인 복부비만은 허리둘레 남 90 cm, 여 85 cm 이상이에요. DXA는 주로 병원에 있는 장비라 누구나 받기 어렵지만, 허리둘레는 줄자 하나로 집에서도 잴 수 있어요.',
  lesson:'허리둘레(남 90·여 85 cm)는 국가검진에서 누구나 확인할 수 있는 지표.',
  camp:'검진 결과 상담 때 허리둘레를 체지방 관리 안내와 함께 설명하고, 보건소 모바일 헬스케어 같은 지역 프로그램으로 이어 주자고 제안해요.', refs:[14,10,17,25]},
 F3:{issue:'③', name:'고장 난 거울', title:'SNS 속설: "BMI만 정상이면 다이어트 끝"?', kind:'short',
  q:()=>'거울 옆 안내판 글자가 지워졌어요. 빈칸을 채워 고쳐 주세요.', sign:'BMI가 정상이어도 [ ]이 높으면 대사 건강에 신호가 올 수 있습니다.',
  short:['체지방','체지방률','지방','내장지방','뱃살'], ansText:'체지방', chips:['체지방','키','나이','시력','수분'],
  hint:'BMI는 키와 체중만으로 계산해서, 몸속 이것의 비율은 알려 주지 않아요.',
  ok:()=>'BMI는 정상이지만 체지방률이 높은 "정상 체중 비만"은 심혈관·대사 이상과 관련이 있다고 보고됐어요(미국 성인 대상 연구). BMI는 근육과 지방을 구분하지 못해요.',
  lesson:'BMI 정상이어도 체지방이 높으면 대사 위험 신호(정상 체중 비만).',
  camp:'"BMI만 보면 된다"는 정보 대신, 체지방과 허리둘레를 함께 보는 공공 캠페인을 제안해요.', refs:[11]},
 F4:{issue:'④', name:'혈액 검사 액자', title:'겉모습으로는 보이지 않는 신호',
  q:()=>'인바디로는 체지방이 괜찮았지만 DXA로는 상위군이었던 사람들. 이들의 혈액 검사에서 보인 경향은?',
  opts:()=>['좋은 콜레스테롤(HDL)은 낮았고, 여성은 중성지방도 높았다','모든 지표가 더 좋았다','차이가 없었다'], ans:0,
  hint:'숨은 체지방은 혈관 속 지방 지표에 신호를 줘요.',
  ok:()=>'나이·질환을 보정한 복합표본 회귀에서 이 집단은 HDL이 남성 약 3.0, 여성 약 4.8 mg/dL 낮았고, 여성은 중성지방이 약 12 mg/dL 높았어요. 또 몸통은 체중의 약 75%를 차지하지만 전체 전기 저항의 약 9%만 차지해서, 몸통에 쌓인 지방은 BIA에 덜 반영될 수 있어요.',
  lesson:'BIA로 놓친 숨은 체지방군은 HDL↓·중성지방↑ 경향. 몸통 지방은 BIA에 덜 반영.',
  camp:'"마르면 건강"이라는 편견 대신, 체형과 관계없이 허리둘레와 혈액 지표를 함께 보자고 제안해요.', refs:[1,12]},

 M1:{issue:'①', name:'키 재기 막대', title:'내 근육지수, DXA로 쟀다면?',
  q:c=>`방문자님의 인바디 근육지수(팔·다리 근육량 ÷ 키²)는 ${f1(c.smi)} kg/m²예요. 우리 연구(국민건강영양조사 2024, 가중 분석)에서 같은 사람을 DXA로 재면 평균 약 ${f1(BA[c.sex].smi)} kg/m² 낮게 나왔어요. DXA로 쟀다면 대략?`,
  opts:c=>[`약 ${f1(c.smi-BA[c.sex].smi)} kg/m²`,`약 ${f1(c.smi)} kg/m²`,`약 ${f1(c.smi+BA[c.sex].smi)} kg/m²`], ans:0,
  hint:'인바디는 근육을 DXA보다 넉넉하게 보여주는 경향이 있었어요.',
  ok:c=>`평균 차이를 뺀 참고값은 약 ${f1(c.smi-BA[c.sex].smi)} kg/m²예요. 95%의 사람은 평균 차이에서 ±${f1(BA[c.sex].smiLoA)} kg/m² 안에 있었어요. 특히 키가 크고 마른 체형일수록 인바디가 근육을 높게 보여줬어요. BIA는 몸을 원통 여러 개로 가정하고 평균적인 사람 자료로 만든 식으로 계산해서, 체형이 평균과 다를수록 오차가 커질 수 있어요.`,
  lesson:'BIA 근육지수는 DXA보다 평균 약 1 kg/m² 높았다. 키 크고 마른 체형일수록 더.',
  camp:'근육 "양" 숫자 하나에 안심하지 말고, 힘과 기능을 함께 보자고 제안해요.', refs:[1,4,2]},
 M2:{issue:'②', name:'악력계와 의자', title:'장비 없이 근육 건강 확인하기',
  q:()=>'아시아 근감소증 기준(AWGS 2025)과 유럽 기준(EWGSOP2)이 근육량보다 먼저 확인하도록 한, 정밀 장비 없이도 할 수 있는 검사는?',
  opts:()=>['악력이나 의자에서 일어서기 같은 근력·신체기능 검사','혈압 측정','시력 검사'], ans:0,
  hint:'바로 앞의 악력계와 의자가 힌트예요.',
  ok:()=>'두 기준 모두 근력·신체기능 저하를 먼저 확인해요. 우리나라 66세 생애전환기 건강검진의 노인신체기능검사에도 의자에서 일어나 3m를 걸어 돌아오는 "일어서서 걷기" 검사가 들어 있어요. DXA가 없는 동네에서도 근육 건강을 먼저 살필 수 있다는 뜻이에요.',
  lesson:'근육은 양보다 힘·기능 먼저(악력, 의자 일어서기). 66세 검진에 일어서서 걷기 검사.',
  camp:'보건소 체성분 검사 때 악력·일어서기 검사를 함께 하고, 결과가 낮으면 지역 근력운동 교실로 이어 주자고 제안해요.', refs:[7,8,15]},
 M3:{issue:'③', name:'고장 난 운동 안내판', title:'SNS 속설: "근육은 젊을 때만 생긴다"?', kind:'short',
  q:()=>'안내판 숫자가 지워졌어요. 빈칸을 채워 고쳐 주세요.', sign:'근력운동은 나이와 관계없이 성인에게 주 [ ]일 이상 권장됩니다.',
  short:['2','2일','2회','두','둘','이틀'], ansText:'2', chips:['1','2','3','5','7'],
  hint:'일주일에 이틀이에요. 숫자로 적어 주세요.',
  ok:()=>'WHO는 성인과 노인 모두에게 주 2일 이상 근력 강화 활동을 권해요. 65세 이상은 균형·근력 운동을 섞어 주 3일 이상 하도록 권해요. 나이 들어서 시작해도 늦지 않아요.',
  lesson:'근력운동은 나이와 관계없이 주 2일 이상(65세 이상은 균형 포함 주 3일).',
  camp:'"나이 들면 근육은 포기"라는 잘못된 정보 대신, 연령별 근력운동 안내를 공공 캠페인으로 알리자고 제안해요.', refs:[6]},
 M4:{issue:'④', name:'경로당 운동교실 포스터', title:'마른 어르신, 안심해도 될까?',
  q:()=>'인바디로는 괜찮았지만 DXA로 근육 하위군이었던 사람은 골절 경험이 더 많은 경향이 있었어요(통계적으로는 경계 수준). "마르면 건강하다"는 편견을 넘어 지역사회가 할 수 있는 일은?',
  opts:()=>['마른 분은 관리 대상에서 뺀다','체형과 관계없이 근력·균형 운동과 단백질 섭취를 돕는 동네 프로그램에 연결한다','외출을 줄이고 쉬시게 한다'], ans:1,
  hint:'근육을 지키는 두 가지는 움직이는 것과 먹는 것이에요.',
  ok:()=>'골절 경향은 오즈비 약 1.5~1.6(p=0.08~0.09)으로 경계 수준이라 단정할 수는 없어요. 근력·균형 운동(WHO)과 노인의 충분한 단백질 섭취(PROT-AGE, 하루 체중 1 kg당 1.0~1.2 g)는 근육을 지키는 기본이에요. 2026년 3월 시행된 돌봄통합지원법은 노인이 살던 곳에서 의료·요양·돌봄을 이어서 받도록 해요.',
  lesson:'숨은 근육 부족은 겉모습으로 안 보인다. 근력·균형 운동 + 단백질 + 지역 돌봄 연계.',
  camp:'지역 통합돌봄과 경로당 근력·균형 운동 교실을 연계해, 마른 어르신의 숨은 근육 부족까지 챙기자고 제안해요.', refs:[1,6,13,16]},

 I1:{issue:'①', name:'옛날 옷 옷걸이', title:'체중은 그대로인데 옷이 안 맞는 이유',
  q:()=>'체중계 숫자는 그대로인데 예전 옷이 안 맞아요. 근육은 줄고 그 자리를 지방이 채우는 "근감소성 비만"일 수 있어요. 이 상태를 놓치면?',
  opts:()=>['비만만 있을 때보다 대사질환·신체 기능 저하 위험이 더 높을 수 있다','머리카락이 두꺼워진다','기초대사량이 크게 늘어난다'], ans:0,
  hint:'근육과 지방, 두 가지 문제가 겹친 상태예요.',
  ok:()=>'ESPEN·EASO 합의문은 근감소성 비만을 근기능·근육량 감소와 지방 과다가 함께 있는 상태로 정의하고, 나쁜 건강 결과와 관련된다고 보고해요. 진단은 전문가가 근기능과 체성분 검사로 해요. 이 체험의 방 배정은 진단이 아니에요.',
  lesson:'근감소성 비만 = 근육↓ + 지방↑. 체중이 그대로여도 생길 수 있다.',
  camp:'체중계의 착시에 속지 않도록, 중장년 건강관리에서 근육과 지방을 함께 보자고 제안해요.', refs:[9]},
 I2:{issue:'②', name:'연구팀 노트북', title:'방을 정한 연구모형, 어디까지 믿을까?',
  q:()=>'이 체험에서 방을 정한 연구모형에 대한 설명으로 맞는 것은?',
  opts:()=>['병원 진단과 같은 정확한 판정이다','2024년 자료로 내부 검증만 한 교육용 분류로, 다른 집단에서의 외부 검증이 필요하다','틀릴 가능성이 전혀 없다'], ans:1,
  hint:'노트북 화면의 "외부 검증 필요"를 보세요.',
  ok:()=>'중첩 교차검증 AUC는 근육 0.89~0.92, 체지방 0.84였고, 예측 확률과 실제 비율도 잘 맞았어요(보정 기울기 0.85~0.98). 그래도 다른 해·다른 집단에서의 외부 검증은 아직이에요. 예측 모형 보고 지침(TRIPOD+AI)처럼 목적, 대상, 성능, 한계를 함께 밝히는 것이 믿을 수 있는 정보의 조건이에요.',
  lesson:'모형은 내부 검증까지. 목적·대상·성능·한계를 함께 봐야 한다(TRIPOD+AI).',
  camp:'검증된 선별 도구가 생기면, 정밀 검사가 더 필요할 수 있는 사람을 보건소에서 병원으로 이어 주는 단계적 검사 체계를 연구하자고 제안해요.', refs:[1,18,19]},
 I3:{issue:'③', name:'고장 난 체중계', title:'SNS 속설: "체중계 숫자만 그대로면 괜찮다"?', kind:'short',
  q:()=>'체중계 안내판 글자가 지워졌어요. 빈칸을 채워 고쳐 주세요.', sign:'근육이 줄고 지방이 늘면 [ ]은 그대로일 수 있습니다.',
  short:['체중','몸무게','무게'], ansText:'체중', chips:['체중','키','근력','체지방','나이'],
  hint:'체중계가 보여 주는 숫자예요.',
  ok:()=>'근육이 빠진 만큼 지방이 늘면 체중은 변하지 않을 수 있어요. 그래서 근감소성 비만은 체중이 아니라 근기능과 체성분으로 평가해요.',
  lesson:'체중이 그대로여도 근육↓·지방↑일 수 있다.',
  camp:'"체중만 재면 된다"는 정보 대신, 근육과 지방을 함께 보는 측정 안내를 퍼뜨리자고 제안해요.', refs:[9]},
 I4:{issue:'④', name:'운동·식단 처방전', title:'근육과 지방, 한꺼번에 관리하려면?',
  q:()=>'근육은 지키고 지방은 줄여야 해요. 모두에게 같은 "굶는 다이어트" 대신, 가장 알맞은 방법은?',
  opts:()=>['굶어서 체중부터 줄인다','유산소운동만 한다','근력운동과 유산소운동을 함께 하고, 끼니마다 단백질 식품을 챙긴다'], ans:2,
  hint:'근육과 지방, 두 가지를 모두 챙기는 방법이에요.',
  ok:()=>'WHO는 주 150~300분 유산소운동과 주 2일 이상 근력운동을 함께 권해요. 굶으면 지방과 함께 근육도 빠질 수 있어요. 노인은 하루 체중 1 kg당 1.0~1.2 g의 단백질이 권장되지만, 콩팥병이 있으면 전문가와 상의해요.',
  lesson:'근력 + 유산소 + 끼니마다 단백질(콩팥병은 상담).',
  camp:'모두에게 같은 처방 대신, 근육과 지방을 함께 보는 맞춤 관리를 지역 건강 프로그램에서 넓히자고 제안해요.', refs:[6,13]}
};
Object.entries(Q).forEach(([k,q])=>q.id = k);

/* 로비 단서(퀴즈 없는 조사 지점) */
const CLUES = {
  inbody:{name:'체성분 측정기', title:'정확하게 재는 방법', refs:[26,3,2,25],
    html:`<p>BIA(인바디)는 손발의 전극으로 약한 전류를 흘려 몸의 저항을 재요. 전류는 수분이 많은 근육으로 잘 흐르고 지방에서는 잘 흐르지 않아서, 저항으로 몸속 수분을 구하고 근육과 지방을 <b>추정</b>해요. 그래서 몸속 수분을 바꾸는 행동은 결과를 흔들어요.</p>
      <div class="howto">${[['👕','최대한 가벼운 옷차림'],['⌚','금속 액세서리 제거'],['🚻','측정 전 화장실 이용'],['⏰','오전 측정 권장'],['🌡️','상온에서 측정'],['🍽️','공복 상태에서'],['🏃','운동 전에'],['♨️','사우나·목욕 직후는 피하기'],['📅','월경 기간은 피하기']].map(([i,t])=>`<span><i>${i}</i>${t}</span>`).join('')}</div>
      <ul class="facts small"><li>음식은 체중에 더해져 체성분으로 잘못 계산될 수 있어요.</li><li>운동 직후에는 체수분 분포와 혈류가 바뀌어요.</li><li>땀으로 빠진 수분은 체수분 감소로 읽혀 오차가 생겨요.</li><li>월경 중에는 체수분이 일시적으로 늘 수 있어요.</li></ul>
      <div class="note" style="background:#fcefe9"><b>측정하면 안 되는 경우</b> 심장박동기(페이스메이커) 등 삽입형 의료기기를 착용했다면 인바디를 측정하지 마세요.</div>
      <p class="small">DXA는 두 가지 에너지의 X선이 뼈·지방·제지방에 흡수되는 차이로 재는 병원 장비예요. 원리가 달라서 같은 몸도 다르게 읽힐 수 있어요.</p>`,
    lesson:'정확한 측정: 가벼운 옷, 금속 제거, 화장실 후, 오전·상온, 공복·운동 전, 사우나·월경 기간 피하기. 삽입형 의료기기 착용자는 측정 금지.'},
  board:{name:'동네 건강 게시판', title:'우리 동네에 이미 있는 건강 자원', refs:[14,15,17,16],
    html:`<ul class="facts">
      <li><b>국가 일반건강검진</b> 키·체중·허리둘레·체질량지수를 재요.</li>
      <li><b>66세 생애전환기 검진</b> 노인신체기능검사로 "일어서서 걷기"를 해요(66·70·80세).</li>
      <li><b>보건소 모바일 헬스케어</b> 19세 이상, 24주 동안 활동량계와 앱, 전문가 상담으로 생활 습관을 관리해요.</li>
      <li><b>지역 통합돌봄</b> 2026년 3월 27일 돌봄통합지원법 시행. 노인·장애인이 살던 곳에서 의료·요양·돌봄을 이어서 받아요.</li></ul>
      <p class="small">집현전의 정책 제안은 새 제도를 만드는 것보다, 이미 있는 이 자원들을 체성분 결과와 잘 잇는 데서 출발해요.</p>`,
    lesson:'허리둘레 검진, 66세 일어서서 걷기, 보건소 모바일 헬스케어, 통합돌봄: 이미 있는 자원을 잇자.'}
};

/* ================= 사회문제와 정책 ================= */
const ISSUES = [
  {k:'①', name:'인바디 숫자 미스터리', fact:'BIA로 해당군이었던 사람의 31~38%는 DXA로는 아니었고, BIA로 괜찮았던 사람의 8~9%는 DXA로는 해당했어요. 같은 절대 기준(체지방률 남 26%, 여 36%)을 두 기기에 똑같이 쓰면 해당 비율이 BIA 45%·33%, DXA 85%·79%로 크게 벌어졌어요.',
    why:'BIA는 싸고 빠르며 휴대가 쉬워 보건소·헬스장에서 널리 쓰여요. 그만큼 숫자 하나를 진단처럼 받아들이기 쉬워요.', refs:[1,2]},
  {k:'②', name:'정밀 검사 접근성', fact:'DXA는 주로 병원에 있는 방사선 장비예요. 우리 모형은 BIA 값과 키·나이·허리둘레만으로 분류가 달라질 가능성을 예측했어요(내부 검증 AUC 0.84~0.92, 외부 검증 전).',
    why:'모두가 정밀 검사를 받을 수는 없어요. 누가 먼저 다시 확인해야 하는지 고르는 것이 한정된 자원을 나누는 문제예요.', refs:[1,25]},
  {k:'③', name:'잘못된 정보', fact:'BIA 값은 식사·운동·수분 상태에 따라 달라져요. "물 마시고 재면 근육이 늘어난다" 같은 속설은 측정 원리를 오해한 거예요.',
    why:'소셜미디어의 건강 정보에는 잘못된 정보가 흔하다는 체계적 문헌고찰이 있어요.', refs:[3,22]},
  {k:'④', name:'체형 편견', fact:'키 크고 마른 체형일수록 BIA가 근육을 높게 보여줬고, BIA로 체지방이 괜찮았던 사람 중 DXA 상위군은 HDL이 낮고 중성지방이 높은 경향이었어요.',
    why:'체형에 대한 낙인은 건강 행동과 공중보건 캠페인 효과를 해칠 수 있어요. 겉모습으로 건강을 판단하면 안 되는 이유예요.', refs:[1,21]}
];
const LEVELS = [
  {h:'개인', sub:'오늘부터 할 수 있는 일', items:[
    ['오전·공복·화장실 후·운동 전, 가벼운 옷차림으로 같은 조건에서 재고 기록해요.', [26,3]],
    ['체중만 보지 말고 허리둘레와 근력(악력·의자 일어서기)을 함께 확인해요.', [10,7]],
    ['주 150~300분 중강도 유산소운동과 주 2일 이상 근력운동을 해요.', [6]]]},
  {h:'지역사회', sub:'보건소 · 경로당 · 헬스장', items:[
    ['측정기 옆에 표준 측정 안내문을 붙이고, 결과지를 설명해 주는 상담을 함께 해요.', [3,'팀']],
    ['보건소 체성분 검사 때 악력·일어서기 검사를 함께 하고, 결과에 따라 근력운동 교실과 영양 상담으로 이어요.', [7,8,'팀']],
    ['이미 있는 보건소 모바일 헬스케어와 지역 통합돌봄을 체성분 결과와 연결해요.', [17,16,'팀']]]},
  {h:'보건정책', sub:'제도와 기준', items:[
    ['체성분 결과지에 측정 조건, 기기 간 차이, 경계 구간을 표기하는 표준 안내를 마련해요.', [1,'팀']],
    ['국가건강검진 결과 상담에서 허리둘레와 66세 "일어서서 걷기" 결과를 근육·지방 관리 안내로 이어 줘요.', [14,15,'팀']],
    ['외부 검증을 거친 선별 도구로, 정밀 검사가 더 필요할 수 있는 사람을 보건소에서 병원으로 잇는 단계적 검사 체계를 연구해요.', [1,18,'팀']],
    ['공공기관이 체성분·다이어트 정보를 팩트체크하고 공식 측정 안내를 알려요.', [22,'팀']]]}
];
/* 체험 설계 자체의 근거 */
const DESIGN = [
  ['확률을 "100명 중 ○명" 점 그림으로 보여 줘요', '숫자에 익숙하지 않은 사람도 위험을 더 정확히 이해했어요.', [20]],
  ['결과 화면에 목적·대상·성능·불확실성을 함께 적어요', '예측 모형 보고 지침의 핵심 항목이에요.', [18,19]],
  ['아바타 체형은 중립적으로, 끌 수도 있게', '체형 낙인을 피하는 것이 공중보건 메시지의 원칙이에요.', [21]],
  ['게임으로 전달해요', '건강 생활습관 게임은 지식·태도·행동에 작은 효과가 있었어요(메타분석).', [23]]
];
