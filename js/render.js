// UI rendering
// ---------- rendering ----------
function render(){
  if(!S)return;
  const n=Math.max(S.seats.length,1),sc=SCENES[S.sc]||SCENES.camp,me=meIdx();
  {const stg=$("stage"),base=me>=0?me:0,end=S.ph==="end";
  const rp=S.ph==="rapid"&&S.rf,sp=rp?S.rf.st==="sing":!!S.pz;
  const info=S.seats.map((p,i)=>{const cur=rp?(i===S.rf.by&&p.a):(S.ph!=="lobby"&&!end&&i===S.c&&p.a);return{cur,talk:cur&&sp}});
  const singing=info.some(x=>x.talk),wd=n>6?12.5:14.5;
  const seatsH=S.seats.map((p,i)=>{
    const th=(270+((i-base+n)%n)*360/n)*Math.PI/180,sn=Math.sin(th),x=50+39*Math.cos(th),y=50+33*sn,{cur,talk}=info[i],tv=((S.ph==="play"&&(S.vt||S.pk)&&S.v&&S.v[p.id])||(rp&&S.rf.v&&S.rf.v[p.id]))||0,
    pose=end?(S.w>=0?(i===S.w?"win":"clap"):"sit"):!p.a?"sit":cur?(talk?"sing":"stand"):tv>0?"up":tv<0?"down":singing?"clap":"sit",[vw,fl]=CS.view(th);
    return `<div class="seat ${p.a?"":"out"} ${cur?"on":""}" data-i="${i}" style="left:${x}%;top:${y}%;width:${wd*(.85+.25*(sn+1)/2)}%;z-index:${Math.round(y)}">
    ${(sp&&cur)||(S.bub&&S.bub.i===i&&S.ph!=="rapid")?`<div class="bub">🎵 ${sp&&cur?"singing…":esc(S.bub.t)}</div>`:""}${CS.sprite(lookC(p,i),pose,vw,fl)}
    <div class="nm">${esc(p.n)}${i===me?" (you)":""}${p.a?"":" 👀"}<br>⭐ ${p.p}</div></div>`}).join("");
  const cap=rp?"⚡ Rapid Fire"+(S.rf.L?" · "+esc(S.rf.L.toUpperCase()):""):S.L&&S.ph!=="lobby"?"Next: "+esc(S.L.toUpperCase()):sc[2],camp=S.sc==="camp",sd=SCN[S.sc];
  const hh=`<div class="pill">${camp?"":sc[1]+" "}${cap}</div>`+(sd?sd.bg:"")+`<div class="gnd">${sd?sd.mid:`<div class="ctr">${sc[1]}</div>`}${seatsH}</div>`;
  stg.className="s-"+S.sc;if(stg.__h!==hh){stg.innerHTML=hh;stg.__h=hh}}
  const myTurn=S.ph==="play"&&me===S.c&&!S.hold&&S.seats[S.c].a&&S.hr!==1;
  $("lobby").hidden=S.ph!=="lobby";if(isHost){pubGroup();renderReq()}$("gnShow").textContent=S.gn&&!isHost?"🎪 "+S.gn:"";$("gnRow").hidden=!(isHost&&S.ph==="lobby");if(isHost&&document.activeElement!==$("gnIn"))$("gnIn").value=S.gn||"";
  $("pick").hidden=S.ph!=="pick";
  $("play").hidden=S.ph!=="play";
  $("endRow").hidden=S.ph!=="end";
  $("bFr2").hidden=!(me_user&&isHost&&S.ph==="lobby");
  $("final").hidden=S.ph!=="end";
  $("rinfo").textContent=S.ph==="lobby"?"Rounds: "+S.R:S.ph==="end"?"":"Round "+Math.min(S.rd,S.R)+"/"+S.R+" · 🎯 50";
  $("rm").hidden=$("rp").hidden=!(isHost&&S.ph!=="end");
  $("endBtn").hidden=!(isHost&&(S.ph==="play"||S.ph==="pick"));
  if(S.ph==="end")showFinal();
  $("nextL").hidden=!(S.ph==="play"&&S.pk&&me===S.c&&!S.hold);
  $("hz").hidden=!(isHost&&(S.ph==="play"||S.ph==="pick"||S.ph==="rapid"));
  $("hz").textContent=S.hz?"▶ Resume timer":"⏸ Pause timer";
  if(S.ph==="lobby"){
    $("codeShow").textContent=S.code;
    $("scenes").innerHTML=Object.entries(SCENES).map(([k,v])=>`<button class="chip" data-k="${k}" aria-pressed="${k===S.sc}" ${isHost?"":"disabled"}>${v[0]}</button>`).join("");
    $("hostBtns").hidden=!isHost;
    $("lobbyHint").textContent=S.msg||"";
  }
  if(S.ph==="pick"){
    $("pickTxt").textContent=me===S.c?"You start! Pick the first letter.":S.seats[S.c].n+" is picking the first letter…";
    $("letters").hidden=me!==S.c;$("fill0").style.width=Math.max(0,S.t/20*100)+"%";
    $("fill0").style.background=S.hz?"#3b82f6":"var(--acc2)";
  }
  if(S.ph==="play"||S.ph==="end"){
    const cur=S.seats[S.c];
    $("need").innerHTML=S.hr===1?(me===S.pa?"You passed. Waiting for a raised hand…":esc(S.seats[S.pa].n)+" passed. ✋ Raise your hand to sing for 5 pts!"):S.vt?(me===S.c?"Friends are voting… 👍👎":esc(cur.n)+" finished. Valid song?"):
      S.pk?(me===S.c?"Nice! Tap the first letter of your song's last word.":esc(cur.n)+" is choosing the next letter…"):
      `${me===S.c?"Your turn":esc(cur.n)+"'s turn"}: <b>${esc(S.L.toUpperCase())}</b>${S.half?" (5 pts)":""}`;
    const f=$("fill");f.style.width=(S.ph==="end"?0:Math.max(0,(S.pz?S.pl/90:S.t/(S.hr===1?10:20))*100))+"%";
    f.style.background=S.hz||S.pz?"#3b82f6":S.t<=6?"var(--acc)":"var(--acc2)";
    $("mine").hidden=!myTurn||!!S.pk||!!S.vt;$("hrBox").hidden=!(S.ph==="play"&&S.hr===1&&me>=0&&me!==S.pa&&S.seats[me].a&&!S.hold);$("bPass").hidden=!!S.pz;$("vote").hidden=!(S.vt&&me>=0&&me!==S.c&&S.seats[me].a&&!S.v[myId()]);
    $("mic").textContent=S.pz?"✅ Finished":"🎤 Start singing";
    $("micHelp").textContent=S.pz?"You're live. Tap Finished when done.":"Mic goes live. Timer pauses.";
    $("msg").textContent=(S.vt?"Votes: 👍 "+Object.values(S.v).filter(x=>x>0).length+"  👎 "+Object.values(S.v).filter(x=>x<0).length+" ":"")+(S.hz?"⏸ Paused by host. ":"")+(S.pz?"Timer paused. ":"")+S.msg+(S.ph==="end"&&me>=0&&!S.seats[me].a?" You were a spectator.":"");
      }
  $("rapid").hidden=S.ph!=="rapid";$("chat").hidden=S.ph==="lobby";
  if(S.ph==="rapid"&&S.rf){
    const r=S.rf,iAm=me>=0&&r.ids.includes(me)&&S.seats[me].a,by=r.by>=0?S.seats[r.by]:null;
    $("rfT").innerHTML="⚡ Rapid Fire "+Math.min(r.n,RFN)+"/"+RFN+(r.L?" · <span class=\"rfL\">"+esc(r.L.toUpperCase())+"</span>":"");
    $("rfScore").textContent=r.ids.map(i=>S.seats[i].n+" "+r.pts[i]).join(" · ");
    $("rfBuzz").hidden=!(r.st==="buzz"&&iAm&&!S.hold);
    $("rfDoneB").hidden=!(r.st==="sing"&&r.by===me);
    $("rfVote").hidden=!(r.st==="vote"&&me>=0&&me!==r.by&&S.seats[me].a&&!r.v[myId()]);
    $("rfMsg").textContent=(S.hold?S.msg:r.st==="buzz"?(iAm?"Be first to buzz!":"Tied players are racing…"):r.st==="sing"&&by?(r.by===me?"You're live! Sing, then tap Finished.":by.n+" is singing…"):r.st==="vote"&&by?(r.by===me?"Friends are voting…":by.n+" finished. Valid song?"):S.msg)+(S.hz?" ⏸ Paused by host.":"");
    const f=$("rfFill");f.style.width=Math.max(0,(r.st==="sing"?S.pl/90:r.st==="buzz"?S.t/10:r.st==="vote"?S.t/15:0)*100)+"%";
    f.style.background=S.hz||r.st==="sing"?"#3b82f6":"var(--acc2)";
  }
  {const ch=S.ch||[],sig=ch.length+"|"+(ch.length?ch[ch.length-1].m:"");
   if(sig!==chatSig){chatSig=sig;const el=$("chatLog");el.innerHTML=ch.length?ch.map(c=>`<p><b>${esc(c.n)}:</b> ${esc(c.m)}</p>`).join(""):`<p class="sub" style="margin:0">No messages yet.</p>`;el.scrollTop=el.scrollHeight}}
  applyMic();
  updAcct();
}
 
let acctReady=false;
let curView="",chatSig="",pmI=-1;
function updAcct(){
  const inGame=!$("game").hidden&&S&&S.ph!=="lobby";
  document.querySelectorAll("#acct .outg").forEach(b=>b.hidden=!!inGame);
  if(inGame&&curView&&curView!=="pr")closeAcct();
}
let popped=false,saved=false,saveNote="",me_user=null,prof={gd:"",dc:""};
function showFinal(){
  const r=[...S.seats].sort((a,b)=>b.p-a.p||((S.seats.indexOf(b)===S.rw)-(S.seats.indexOf(a)===S.rw))),bd={};r.forEach(s=>bd[s.id]=[]);
  if(r[0])bd[r[0].id].push("🥇 Champion");
  if(S.rw>=0&&S.seats[S.rw])bd[S.seats[S.rw].id].push("⚡ Rapid Fire Champ");
  const top=k=>{const m=Math.max(...S.seats.map(s=>s[k]));return m>0?S.seats.find(s=>s[k]===m):null};
  const gv=top("w");if(gv)bd[gv.id].push("🎤 Golden Voice");
  const fan=top("u");if(fan)bd[fan.id].push("👍 Crowd Favourite");
  r.forEach(s=>{if(s.p>=50)bd[s.id].push("🎯 50 Club");if(!bd[s.id].length)bd[s.id].push("🌟 Good Effort")});
  const medal=["🥇","🥈","🥉"];
  $("fTitle").innerHTML=r.length?"🎉 "+esc(r[0].n)+" wins! 👏":"Game over";
  $("fList").innerHTML=r.map((s,i)=>`<li>${medal[i]||(i+1)+"."} ${esc(s.n)} ${bd[s.id].map(b=>`<span class="bdg">${b}</span>`).join("")}<b>${s.p}</b></li>`).join("");
  const mi=r.findIndex(s=>s.id===myId()),upd=()=>{$("fMsg").textContent=[S.msg,saveNote].filter(Boolean).join(" ")};
  if(!saved&&mi>=0){saved=true;
    if(me_user&&window.AK){saveNote="Saving…";
      AK.save({code,players:r.length,rank:mi+1,points:r[mi].p,won:mi===0,w:r[mi].w,badges:bd[r[mi].id],board:r.map(x=>({n:x.n,p:x.p,g:x.g||""}))})
        .then(()=>{saveNote="✅ Saved."}).catch(()=>{saveNote="⚠️ Couldn't save."}).finally(upd)}
    else if(window.AK)saveNote="Sign in to save results."}
  upd();
  if(!popped){popped=true;pop();setTimeout(pop,1000)}
}
function pop(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const c=document.createElement("canvas");c.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:999";document.body.append(c);
  const x=c.getContext("2d"),W=c.width=innerWidth,H=c.height=innerHeight,cols=["#ffd23f","#ff7ab8","#5ef2d6","#fff","#7b5cff","#ff7b54"];
  const P=Array.from({length:180},(_,i)=>({x:i%2?W*.1:W*.9,y:H*.85,vx:(i%2?1:-1)*(2+Math.random()*9),vy:-9-Math.random()*13,r:3+Math.random()*5,c:cols[Math.random()*6|0],a:Math.random()*6,va:(Math.random()-.5)*.4}));
  let f=0;(function loop(){x.clearRect(0,0,W,H);P.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.a+=p.va;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r,-p.r/2,p.r*2,p.r);x.restore()});
    if(++f<240)requestAnimationFrame(loop);else c.remove()})();
}
