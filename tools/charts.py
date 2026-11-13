import os
import numpy as np, pandas as pd, warnings, json, os
warnings.filterwarnings('ignore')
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
DATA_PATH=os.environ.get("HN24_CSV", "HN24_ALL.csv")  # 원시자료는 저장소에 올리지 않아요(이용지침)
src=open(os.environ.get('V5_PY','v5.py'),encoding='utf-8').read(); start=src.index('df = pd.read_csv(DATA_PATH'); end=src.index('# [3] 기준 점검')
code=src[start:end].replace("display(flow)","print(flow)")
CFG = dict(WEIGHT='wt_itvex', STRATA='kstrata', PSU='psu', AGE_MIN=40, Q=0.20, Q_SENS=[0.15,0.25], AGE_BANDS=[(40,49),(50,64),(65,200)], MINSIZE=80, MAXDEPTH=3, SEED=1, NBOOT=30)
SEX={1:'남',2:'여'}; CELL_LAB={'NN':'a','NA':'b','AN':'c','AA':'d'}; TYPE_LAB={}; display=print
AWGS25 = {'65+':dict(grip={1:28,2:18},dxa_h={1:7.0,2:5.4},dxa_b={1:0.73,2:0.52}),'50-64':dict(grip={1:34,2:20},dxa_h={1:7.2,2:5.5},dxa_b={1:0.80,2:0.55})}
RUN_R=False
from scipy import stats
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.model_selection import RepeatedStratifiedKFold
from statsmodels.stats.contingency_tables import mcnemar
import statsmodels.api as sm
PLOT_DIR='/tmp/_p'; os.makedirs(PLOT_DIR,exist_ok=True)
import io, contextlib
with contextlib.redirect_stdout(io.StringIO()): exec(code)
B=df[df.elig_all].copy(); W='wt_itvex'; w=B[W].values
print('N',len(B))
fp=[f for f in fm.findSystemFonts() if 'NotoSansCJK' in f and 'Regular' in f] or [f for f in fm.findSystemFonts() if 'CJK' in f]
fm.fontManager.addfont(fp[0]); plt.rcParams['font.family']=fm.FontProperties(fname=fp[0]).get_name(); plt.rcParams['axes.unicode_minus']=False
C={1:'#5f88b5',2:'#d98468'}; OUT='v5/charts'; os.makedirs(OUT,exist_ok=True)
def wq(x,wt,q):
    o=np.argsort(x); x,wt=np.asarray(x)[o],np.asarray(wt)[o]; c=np.cumsum(wt)/wt.sum(); return float(x[min(np.searchsorted(c,q),len(x)-1)])
def wmean(x,wt): return float(np.sum(x*wt)/np.sum(wt))
def style(ax):
    for s in ['top','right']: ax.spines[s].set_visible(False)
    ax.tick_params(labelsize=9); ax.grid(alpha=.25)
stats_out={}
# 1-2 Bland-Altman
for var,lab,unit in [('smi','근육지수','kg/m²'),('pbf','체지방률','%p')]:
    fig,axs=plt.subplots(1,2,figsize=(7.2,3.2),sharey=True,dpi=130)
    for ax,sx in zip(axs,[1,2]):
        m=(B.sex==sx).values; a=B.loc[m,'bia_'+var].values; d=B.loc[m,'dxa_'+var].values; wt=w[m]
        diff=a-d; mean=(a+d)/2; bias=wmean(diff,wt); sd=np.sqrt(wmean((diff-bias)**2,wt))
        ax.scatter(mean,diff,s=4,alpha=.25,color=C[sx],lw=0)
        ax.axhline(bias,color='#2f6f5e',lw=2); [ax.axhline(bias+k*1.96*sd,color='#2f6f5e',ls='--',lw=1) for k in [-1,1]]; ax.axhline(0,color='#888',lw=.8)
        ax.set_title(f'{SEX[sx]}성 (실선: 평균 차이, 점선: 95% 일치한계)',fontsize=9.5); ax.set_xlabel(f'두 기기 평균 {lab}',fontsize=9); style(ax)
        stats_out[f'ba_{var}_{sx}']=[round(bias,2),round(1.96*sd,2)]
    axs[0].set_ylabel(f'BIA − DXA ({unit})',fontsize=9); fig.tight_layout(); fig.savefig(f'{OUT}/ba_{var}.png'); plt.close(fig)
# 3 agreement (relative quantile classification)
def classify(B,col,q,upper):
    out=np.zeros(len(B),int)
    for sx in [1,2]:
        for b in B.band.unique():
            m=((B.sex==sx)&(B.band==b)).values; c=wq(B.loc[m,col].values,w[m],q)
            out[m]=(B.loc[m,col].values>=c) if upper else (B.loc[m,col].values<c)
    return out
cls={'근육':(classify(B,'bia_smi',.2,False),classify(B,'dxa_smi',.2,False)),'체지방':(classify(B,'bia_pbf',.8,True),classify(B,'dxa_pbf',.8,True))}
fig,ax=plt.subplots(figsize=(7.2,3.0),dpi=130); labels=[]; i=0
cols=['#cfe0d6','#2f6f5e','#e9c46a','#d98468']; names=['둘 다 아님','둘 다 해당','BIA 아님→DXA 해당(새로발견)','BIA 해당→DXA 아님(해소)']
for ax_name,(a,d) in cls.items():
    for sx in [1,2]:
        m=(B.sex==sx).values; wt=w[m]; aa,dd=a[m],d[m]
        p=[np.sum(wt*((aa==0)&(dd==0))),np.sum(wt*((aa==1)&(dd==1))),np.sum(wt*((aa==0)&(dd==1))),np.sum(wt*((aa==1)&(dd==0)))]; p=np.array(p)/wt.sum()*100
        left=0
        for k in range(4):
            ax.barh(i,p[k],left=left,color=cols[k],label=names[k] if i==0 else None)
            if p[k]>3: ax.text(left+p[k]/2,i,f'{p[k]:.0f}%',ha='center',va='center',fontsize=8,color='white' if k in (1,3) else '#222')
            left+=p[k]
        labels.append(f'{ax_name} {SEX[sx]}'); i+=1
        stats_out[f'agree_{ax_name}_{sx}']=[round(x,1) for x in p]
ax.set_yticks(range(i)); ax.set_yticklabels(labels,fontsize=9); ax.invert_yaxis(); ax.set_xlim(0,100); ax.set_xlabel('가중 비율 (%)',fontsize=9)
ax.legend(fontsize=7.5,ncol=2,loc='lower center',bbox_to_anchor=(.5,1.0),frameon=False); style(ax); fig.tight_layout(); fig.savefig(f'{OUT}/agree.png'); plt.close(fig)
# 4 absolute vs relative
fig,ax=plt.subplots(figsize=(7.2,2.9),dpi=130)
data=[('상대 20%\n남',20,20),('상대 20%\n여',20,20),('절대 26%\n남',45.4,85.2),('절대 36%\n여',32.9,78.8)]
x=np.arange(len(data)); ax.bar(x-.18,[d[1] for d in data],.36,color='#5f88b5',label='BIA로 해당'); ax.bar(x+.18,[d[2] for d in data],.36,color='#2f6f5e',label='DXA로 해당')
for xi,d in zip(x,data): ax.text(xi-.18,d[1]+1.5,f'{d[1]:.0f}',ha='center',fontsize=8); ax.text(xi+.18,d[2]+1.5,f'{d[2]:.0f}',ha='center',fontsize=8)
ax.set_xticks(x); ax.set_xticklabels([d[0] for d in data],fontsize=8.5); ax.set_ylabel('체지방 해당 비율 (%)',fontsize=9); ax.set_ylim(0,100); ax.legend(fontsize=8,frameon=False); style(ax)
ax.set_title('같은 숫자 기준을 두 기기에 쓰면 차이가 커져요 (카파 0.53·0.61 → 0.24·0.23)',fontsize=9.5); fig.tight_layout(); fig.savefig(f'{OUT}/absrel.png'); plt.close(fig)
# 5 body shape: muscle c1 (BIA not low) -> DXA low rate by height & BMI tertile
a,d=cls['근육']; B['m_c1']=d; sub_mask=(a==0)
fig,axs=plt.subplots(1,2,figsize=(7.2,2.9),dpi=130,sharey=True)
for ax,(var,lab) in zip(axs,[('HE_ht','키'),('HE_BMI','BMI')]):
    for j,sx in enumerate([1,2]):
        m=((B.sex==sx).values)&sub_mask; v=B.loc[m,var].values; y=B.loc[m,'m_c1'].values; wt=w[m]
        q1,q2=wq(v,wt,1/3),wq(v,wt,2/3); grp=np.digitize(v,[q1,q2])
        rates=[np.sum(wt[grp==g]*y[grp==g])/np.sum(wt[grp==g])*100 for g in range(3)]
        ax.bar(np.arange(3)+(j-.5)*.36,rates,.36,color=C[sx],label=f'{SEX[sx]}성')
        stats_out[f'shape_{var}_{sx}']=[round(r,1) for r in rates]
    ax.set_xticks(range(3)); ax.set_xticklabels([f'{lab} 하','중','상'],fontsize=9); style(ax); ax.set_title(f'{lab} 3분위별',fontsize=10)
axs[0].set_ylabel('BIA 근육 괜찮음 → DXA 하위군 (%)',fontsize=8.5); axs[1].legend(fontsize=8,frameon=False); fig.tight_layout(); fig.savefig(f'{OUT}/shape.png'); plt.close(fig)
# 6 personal ranges: BIA SMI, PBF, BMI, waist weighted quantiles by sex x band
ranges={}
for sx in [1,2]:
    for b in ['40-49','50-64','65+']:
        m=((B.sex==sx)&(B.band==b)).values
        if not m.any(): continue
        r={}
        for col in ['bia_smi','bia_pbf','HE_BMI','HE_wc']:
            v=B.loc[m,col].values; ok=~np.isnan(v); r[col]=[round(wq(v[ok],w[m][ok],q),2) for q in [.05,.2,.5,.8,.95]]
        ranges[f'{sx}_{b}']=r
print(sorted(B.band.unique()))
json.dump({'stats':stats_out,'ranges':ranges},open('v5/charts/stats.json','w'),ensure_ascii=False,indent=1)
print(json.dumps(stats_out,ensure_ascii=False)); print(ranges['1_50-64'])
