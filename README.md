# 인바디 미스터리 · 집현전 보건소 방탈출

성균관대학교 2026-2 융합연구학점제(URP) **TEAM 집현전**의 교육용 웹 방탈출 게임입니다.
국민건강영양조사 2024 원시자료(40세 이상, BIA·DXA 동시 측정 3,187명) 분석 결과를 바탕으로,
인바디(BIA) 결과가 DXA와 다르게 분류될 가능성과 체성분을 둘러싼 사회문제를 체험합니다.

> 교육·캠페인용이며 의학적 진단이 아닙니다. 입력값은 브라우저 안에서만 계산되고 어디로도 전송·저장되지 않습니다.

## 바로 실행 (GitHub Pages)
1. 이 폴더 전체를 GitHub 저장소(예: `inbody-mystery`)에 올립니다.
2. 저장소 **Settings → Pages → Build and deployment**에서 Source를 **Deploy from a branch**, Branch를 **main / (root)** 로 저장합니다.
3. 1~2분 뒤 `https://<GitHub 아이디>.github.io/inbody-mystery/` 에서 휴대폰·PC로 바로 실행됩니다.

## 내 컴퓨터에서 실행
```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 열기
```
(`index.html`을 더블클릭해도 대부분 실행되지만, 일부 브라우저는 로컬 파일 제한이 있어 위 방법을 권장합니다.)

## 폴더 구조
| 경로 | 내용 |
|---|---|
| `index.html` | 배포용 완성 파일 (이 파일 하나 + `vendor/`로 실행) |
| `vendor/three.min.js` | Three.js r128 (MIT) |
| `src/` | 수정용 원본 조각: 화면(`head.html`), 내용·참고문헌(`core.js`), 통계 설명(`extra.js`), 3D(`three*.js`), 포스터(`posters.js`), 흐름(`ui*.js`), 모형 설정(`cfg.json`), 그래프·범위(`data.js`) |
| `build.py` | `src/`를 합쳐 `index.html`을 다시 만듭니다: `python3 build.py` |
| `tools/charts.py` | 통계 그래프·범위 재생성 스크립트 (원시자료 필요) |

## 수정 방법
문항·문구는 `src/core.js`, 통계 설명은 `src/extra.js`를 고친 뒤 `python3 build.py`를 실행하고 커밋하면 GitHub Pages에 반영됩니다.

## 자료 이용 주의
국민건강영양조사 원시자료(`HN24_ALL.csv` 등)는 이용지침에 따라 **이 저장소에 올리지 않습니다**. `src/data.js`에는 가중 분위수·그래프 같은 집계 결과만 들어 있습니다.

## 주요 근거
게임 안 **탐험 수첩 → 근거 문헌**에 전체 목록(27개)이 있습니다. 예: Kyle 2004(Clin Nutr), Bland·Altman 1986(Lancet), WHO 2020, AWGS 2019·2025, ESPEN·EASO 2022, 대한비만학회 2022, TRIPOD+AI 2024.

TEAM 집현전 · 박세현, 이현서, 김현서 · 지도교수 박연희(통계학과)
