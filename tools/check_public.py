"""공개 전 점검: 저장소에 원시자료·개인정보가 들어가지 않았는지 확인합니다.
사용법: 저장소 폴더에서  python3 tools/check_public.py   (git 기록까지 보려면 --history)
"""
import os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BAD_EXT = ('.csv','.tsv','.xlsx','.xls','.sav','.sas7bdat','.dta','.parquet','.rds','.rdata','.rda','.feather','.zip','.7z')
PAT = {
  '이메일': re.compile(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'),
  '학번(10자리)': re.compile(r'\b20[0-2]\d{7}\b'),
  '전화번호': re.compile(r'\b01[016789]-?\d{3,4}-?\d{4}\b'),
  '주민등록번호 형식': re.compile(r'\b\d{6}-[1-4]\d{6}\b'),
  '원시자료 ID 변수': re.compile(r'\b(ID_fam|ID)\s*[,=:]\s*["\']?[A-Z]\d{6,}'),
  '로컬 경로': re.compile(r'(/Users/|C:\\\\Users\\\\|/home/[a-z]+/|/mnt/user-data)'),
}
SKIP = {'three.min.js', 'check_public.py'}
issues = []
for dp, dn, fn in os.walk(ROOT):
    if '.git' in dp.split(os.sep): continue
    for f in fn:
        p = os.path.join(dp, f); rel = os.path.relpath(p, ROOT)
        if f.lower().endswith(BAD_EXT): issues.append(f'[자료 파일] {rel}')
        if os.path.getsize(p) > 5_000_000: issues.append(f'[큰 파일 5MB+] {rel}')
        if f in SKIP or not f.lower().endswith(('.js','.html','.json','.py','.md','.txt','.r','.ipynb')): continue
        t = open(p, encoding='utf-8', errors='ignore').read()
        if 'data:image' in t: t = re.sub(r'data:image/[a-z]+;base64,[A-Za-z0-9+/=]+', '', t)
        for k, rx in PAT.items():
            for m in set(rx.findall(t)):
                if k == '이메일' and m.endswith(('w3.org','example.com')): continue
                issues.append(f'[{k}] {rel}: {m}')
        if re.search(r'\b(ID_fam|wt_itvex)\b.*\n.*\d+\.\d+,\d+\.\d+,\d+', t): issues.append(f'[개인 단위 표 의심] {rel}')
if '--history' in sys.argv:
    try:
        out = subprocess.run(['git','-C',ROOT,'log','--all','--name-only','--pretty=format:'], capture_output=True, text=True).stdout
        for f in sorted(set(out.split())):
            if f.lower().endswith(BAD_EXT): issues.append(f'[과거 커밋에 자료 파일] {f}  → 기록에서 지워야 합니다(git filter-repo 등)')
    except Exception as e: issues.append(f'[git 기록 확인 실패] {e}')
print('점검 결과:', '문제 없음' if not issues else f'{len(issues)}건 확인 필요')
for i in issues: print(' -', i)
sys.exit(1 if issues else 0)
