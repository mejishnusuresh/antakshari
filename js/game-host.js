// Host-authoritative game logic
// ---------- host game logic ----------
function buildSeats(){
  const mk=(id,n,g,pf)=>({id,n,g:g||"",gd:(pf&&pf.gd)||"",dc:(pf&&pf.dc)||"",a:1,p:0,w:0,u:0});S.seats=[mk(peer.id,myName,me_user&&me_user.uid,prof)].concat(Object.keys(names).map(id=>mk(id,names[id],guids[id],profs[id]))).slice(0,8);
  if(S.seats.length>1)S.msg="";
}
function startGame(){
  if(S.seats.length<2){S.msg="Need at least 2 players.";return bc()}
  declineAll("Game already started.");S.ph="pick";S.c=0;S.t=20;S.msg="";S.log=[];S.rd=1;S.half=0;S.vt=0;bc();
}
function chooseLetter(c){S.L=c;S.ph="play";S.t=20;S.pl=90;S.pz=0;S.pk=0;S.msg="";bc()}
const alive=()=>S.seats.filter(s=>s.a);
function endGame(){
  if(!S.rfx){
    const al=S.seats.map((x,i)=>i).filter(i=>S.seats[i].a);
    if(al.length>1){const mx=Math.max(...al.map(i=>S.seats[i].p)),t=al.filter(i=>S.seats[i].p===mx);if(t.length>1){S.rfx=1;return rfStart(t)}}
  }
  finalize(S.rw>=0?S.msg:"");
}
function finalize(m){
  const mx=Math.max(...S.seats.map(x=>x.p));
  S.w=S.rw>=0?S.rw:(mx>0?S.seats.findIndex(x=>x.p===mx):-1);
  S.ph="end";S.bub=null;S.hold=0;S.pz=0;S.pk=0;S.vt=0;S.hr=0;S.msg=m||"";bc();
}
function next(){
  if(alive().length<=1)return endGame();
  const old=S.c;do{S.c=(S.c+1)%S.seats.length}while(!S.seats[S.c].a);
  if(S.c<=old&&++S.rd>S.R)return endGame();
  S.t=20;S.pl=90;S.pz=0;S.pk=0;S.sg=0;S.hr=0;S.msg="";S.hold=0;S.bub=null;bc();
}
function out(i,why){
  const s=S.seats[i];s.a=0;S.pz=0;S.pk=0;S.vt=0;S.half=0;if(S.hr===2&&i===S.c&&S.pa>=0)S.c=S.pa;S.hr=0;S.msg=s.n+" "+why+".";
  S.hold=1;bc();
  setTimeout(()=>{if(alive().length<=1)endGame();else next()},1800);
}
function finish(){
  const s=S.seats[S.c];
  S.bub={i:S.c,t:"finished"};S.vt=1;S.v={};S.sg=0;S.t=15;S.pz=0;S.msg="";if(alive().length<2)return tally();bc();
}
function tally(){
  const s=S.seats[S.c],v=Object.values(S.v),up=v.filter(x=>x>0).length,dn=v.length-up,b=S.half?5:10,pts=up>dn?b:dn>up?-b:0;
  s.p+=pts;s.u+=up;if(up>dn)s.w++;
  S.half=0;S.vt=0;S.pk=1;S.t=15;S.msg="👍 "+up+" : 👎 "+dn+" → "+(pts>0?"+":"")+pts+" pts";
  
  if(S.seats.some(x=>x.p>=50)){S.hold=1;bc();setTimeout(endGame,2500);return}
  bc();
}
function doPass(i,why){
  const s=S.seats[i];S.pz=0;S.sg=0;
  if(S.hr===2){S.hr=0;S.half=0;S.c=S.pa;S.hold=1;S.msg=s.n+" "+why+".";bc();setTimeout(next,1200);return}
  S.hr=1;S.pa=i;S.half=0;S.t=10;S.msg=s.n+" "+why+". ✋ Raise your hand to claim 5 pts!";bc();
}
function pickNext(c){
  if(S.hr===2){S.c=S.pa;S.hr=0}
  S.L=c;S.pk=0;S.half=0;S.hold=1;S.msg="";
  bc();setTimeout(next,1200);
}
function act(pid,d){
  if(!isHost||!S)return;
  if(S.ph==="rapid"){rfAct(pid,d);return}
  if(d.k==="raise"){
    if(S.ph==="play"&&S.hr===1&&!S.hold){const j=S.seats.findIndex(x=>x.id===pid);
      if(j>=0&&j!==S.pa&&S.seats[j].a){S.hr=2;S.c=j;S.half=1;S.t=20;S.pl=90;S.pz=0;S.sg=0;S.pk=0;S.vt=0;S.msg=S.seats[j].n+" raised first! (5 pts)";bc()}}
    return;
  }
  if(d.k==="vote"){
    if(S.ph==="play"&&S.vt&&!S.hold&&(d.v===1||d.v===-1)){const i=S.seats.findIndex(x=>x.id===pid);
      if(i>=0&&i!==S.c&&S.seats[i].a&&!S.v[pid]){S.v[pid]=d.v;if(Object.keys(S.v).length>=alive().length-1)tally();else bc()}}
    return;
  }
  if(S.hold)return;const s=S.seats[S.c];if(!s||s.id!==pid||!s.a)return;
  if(d.k==="letter"&&S.ph==="pick"&&okL(d.c))chooseLetter(d.c);
  else if(d.k==="letter"&&S.ph==="play"&&S.pk&&okL(d.c))pickNext(d.c);
  else if(d.k==="pause"&&S.ph==="play"&&!S.pk&&!S.vt){S.pz=S.pl>0?1:0;if(S.pz)S.sg=1;bc()}
  else if(d.k==="done"&&S.ph==="play"&&!S.pk&&!S.vt&&S.sg)finish();
  else if(d.k==="pass"&&S.ph==="play"&&!S.pk&&!S.vt&&!S.sg)doPass(S.c,"passed");
}
function doAct(d){if(isHost)act(myId(),d);else if(conn&&conn.open)conn.send({t:"act",d})}
setInterval(()=>{
  if(!isHost||!S||S.hold||S.hz)return;
  if(S.ph==="rapid"){rfTick();return}
  if(S.ph!=="play"&&S.ph!=="pick")return;
  if(S.hr===1){S.t-=.5;if(S.t<=0){S.hr=0;S.half=0;next()}else bc();return}
  if(S.pz){S.pl-=.5;if(S.pl<=0){finish();return}}else S.t-=.5;
  if(S.t<=0){if(S.ph==="pick")chooseLetter(pick(MAL));else if(S.vt)tally();else if(S.pk)pickNext(pick(MAL));else doPass(S.c,"time's up")}else bc();
},500);
setInterval(()=>{if(isHost&&S)sendAll()},2000);
 
