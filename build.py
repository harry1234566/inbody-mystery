"""src/ 의 조각 파일들을 합쳐 index.html 한 파일로 만듭니다.  사용법: python3 build.py"""
import os
D = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(D, 'src')
rd = lambda f: open(os.path.join(S, f), encoding='utf-8').read()
ORDER = ['core.js','three1.js','three2.js','three3.js','posters.js','extra.js','ui1.js','ui2.js','ui2b.js','ui3.js','ui4.js']
js = rd('data.js') + '\n' + '\n'.join(rd(f) for f in ORDER).replace('__CFG__', rd('cfg.json'))
head = rd('head.html')
html = ('<!DOCTYPE html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n' + head.split('<div id="stage"')[0] + '</head>\n<body>\n<div id="stage"' + head.split('<div id="stage"', 1)[1]
        + '\n<script src="vendor/three.min.js"></script>\n<script>\n(async function(){\n\'use strict\';\n' + js
        + '\n})().catch(e=>{ console.error(e); const l=document.getElementById("loading"); if(l) l.querySelector("span").textContent="불러오는 중 문제가 생겼어요: "+e.message; });\n</script>\n</body>\n</html>\n')
open(os.path.join(D, 'index.html'), 'w', encoding='utf-8').write(html)
print('index.html', len(html), 'bytes')
