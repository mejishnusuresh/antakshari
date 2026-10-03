// Rapid Fire tie-break
// ---------- Rapid Fire tie-break ----------
const RFN=5;
function rfStart(ids){
  S.ph="rapid";S.rf={ids,n:0,L:"",st:"intro",by:-1,rt:0,t0:0,pts:{},sp:{},v:{}};
  ids.forEach(i=>{S.rf.pts[i]=0;S.rf.sp[i]=0});
  S.pz=0;S.pk=0;S.vt=0;S.hr=0;S.hold=1;S.msg="⚡ Tie! Rapid Fire: "+ids.map(i=>S.seats[i].n).join(", ");bc();
  setTimeout(()=>{S.hold=0;rfNext()},2500);
}
function rfNext(){const r=S.rf;if(++r.n>RFN)return rfEnd();r.L=pick(MAL);r.st="buzz";r.by=-1;r.v={};r.t0=Date.now();S.t=10;S.hold=0;S.msg="";bc()}
function rfSkip(m){S.msg=m;S.hold=1;bc();setTimeout(()=>{S.hold=0;rfNext()},1400)}
function rfDone(){const r=S.rf;r.st="vote";r.v={};S.t=15;S.msg="";if(alive().length<2)return rfTally();bc()}
function rfTally(){
  const r=S.rf,v=Object.values(r.v),up=v.filter(x=>x>0).length,dn=v.length-up,ok=up>dn,s=S.seats[r.by];
  if(ok){r.pts[r.by]++;r.sp[r.by]+=r.rt}
  rfSkip("👍 "+up+" : 👎 "+dn+(ok?" → "+s.n+" +1":" → no point"));
}
function rfEnd(){
  const r=S.rf,mx=Math.max(...r.ids.map(i=>r.pts[i])),c=r.ids.filter(i=>r.pts[i]===mx&&S.seats[i].a);
  const pool=c.length?c:r.ids;pool.sort((a,b)=>r.sp[a]-r.sp[b]);
  S.rw=pool[0];finalize("⚡ "+S.seats[S.rw].n+" wins Rapid Fire!");
}
function rfAct(pid,d){
  if(S.hold)return;const r=S.rf,i=S.seats.findIndex(x=>x.id===pid);if(!r||i<0||!S.seats[i].a)return;
  if(d.k==="buzz"&&r.st==="buzz"&&r.ids.includes(i)){r.by=i;r.rt=Date.now()-r.t0;r.st="sing";S.pl=90;S.msg="";bc()}
  else if(d.k==="rdone"&&r.st==="sing"&&r.by===i)rfDone();
  else if(d.k==="rvote"&&r.st==="vote"&&i!==r.by&&!r.v[pid]&&(d.v===1||d.v===-1)){r.v[pid]=d.v;if(Object.keys(r.v).length>=alive().length-1)rfTally()}
}
function rfTick(){
  const r=S.rf;
  if(r.st==="sing"){S.pl-=.5;if(S.pl<=0)rfDone();else bc();return}
  if(r.st!=="buzz"&&r.st!=="vote")return;
  S.t-=.5;if(S.t>0)return bc();
  if(r.st==="buzz")rfSkip("Nobody buzzed.");else rfTally();
}
$("rfBuzz").onclick=()=>doAct({k:"buzz"});$("rfDoneB").onclick=()=>doAct({k:"rdone"});
$("rfUp").onclick=()=>doAct({k:"rvote",v:1});$("rfDn").onclick=()=>doAct({k:"rvote",v:-1});
$("hrBtn").onclick=()=>doAct({k:"raise"});
