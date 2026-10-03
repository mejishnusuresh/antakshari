// Google login, profile, friends, history, leaderboard
// ---------- Google login, history, leaderboard ----------
function setPics(){
  const src=prof.pic||(me_user&&me_user.photo)||"";
  ["pic","avImg"].forEach(id=>{$(id).hidden=!src;if(src)$(id).src=src});
  $("avIni").hidden=!!src;$("avIni").textContent=((me_user&&me_user.name)||"?")[0];
}
let pt=0;
function pushProf(){
  if(!S)return;
  if(isHost){const sd=S.seats.find(x=>x.id===peer.id);if(sd){sd.gd=prof.gd;sd.dc=prof.dc;bc()}}
  else if(conn&&conn.open)conn.send({t:"prof",gd:prof.gd,dc:prof.dc});
}
function pushProfSoon(){clearTimeout(pt);pt=setTimeout(pushProf,200)}
window.akAuth=u=>{
  me_user=u;acctReady=true;syncAdminTab(u);$("gIn").hidden=!!u;$("avBtn").hidden=!u;closeAcct();
  if(u){
    $("pName").textContent=u.name||"";setPics();
    if(!$("nick").value)$("nick").value=(u.name||"").split(" ")[0].slice(0,14);
    AK.stats().then(d=>{if(d.banned&&!isAdm(u)){AK.signOut();msg("This account has been blocked by the admin.");return}prof={gd:d.gd||"m",dc:/^#[0-9a-f]{6}$/i.test(d.dc||"")?d.dc:"#d6336c",pic:d.pic||""};syncProf();setPics();pushProfSoon()}).catch(()=>{});
  }else{prof={gd:"",dc:"",pic:""};setPics()}
  if(u&&!hb){hb=setInterval(()=>AK.beat().catch(()=>{}),30000);AK.beat().then(()=>AK.reconcile()).catch(()=>{});AK.onInvite(showInvite)}
  updAcct();
};
$("picIn").onchange=e=>{
  const f=e.target.files[0];if(!f)return;const im=new Image(),url=URL.createObjectURL(f);
  im.onload=()=>{
    const c=document.createElement("canvas"),n=160,m=Math.min(im.width,im.height);c.width=c.height=n;
    c.getContext("2d").drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,n,n);URL.revokeObjectURL(url);
    prof.pic=c.toDataURL("image/jpeg",.8);setPics();if(window.AK&&me_user)AK.savePic(prof.pic).catch(()=>{});
  };
  im.src=url;e.target.value="";
};
function syncProf(){
  document.querySelectorAll("#gdr [data-gd]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.gd===prof.gd));
  $("dress").value=prof.dc||"#d6336c";$("prev").innerHTML=CS.sprite(lookC({gd:prof.gd,dc:prof.dc},0),"sit","front",false);
}
function saveProf(){if(window.AK&&me_user)AK.saveProfile(prof).catch(()=>{})}
$("gdr").onclick=e=>{const g=e.target.dataset.gd;if(g){prof.gd=g;syncProf();saveProf();pushProfSoon()}};
$("dress").oninput=e=>{prof.dc=e.target.value;syncProf();pushProfSoon()};$("dress").onchange=saveProf;
function openTab(t){
  [["Pr","pr"],["F","f"],["H","h"],["P","p"]].forEach(([k,v])=>$("t"+k).setAttribute("aria-pressed",v===t));
  $("prEd").hidden=t!=="pr";$("fr").hidden=t!=="f";$("sBody").hidden=t==="f"||t==="pr";clearInterval(frT);
  if(t==="f"){frRefresh();frT=setInterval(frRefresh,20000)}else if(t!=="pr")openStats(t);
}
function openAcct(v){curView=v;$("acct").hidden=false;openTab(v)}
function closeAcct(){curView="";$("acct").hidden=true;clearInterval(frT)}
$("acctClose").onclick=closeAcct;
$("acct").onclick=e=>{if(e.target===$("acct"))closeAcct()};
$("avBtn").onclick=()=>openAcct("pr");
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAcct();closePm()}});
$("tPr").onclick=()=>openTab("pr");
$("tF").onclick=()=>openTab("f");$("tH").onclick=()=>openTab("h");$("tP").onclick=()=>openTab("p");
$("gIn").onclick=()=>AK.signIn().catch(()=>msg("Sign-in failed."));
$("gOut").onclick=()=>{closeAcct();AK.signOut()};
async function openStats(t){
  const B=$("sBody"),md=["🥇","🥈","🥉"];B.textContent="Loading…";
  try{
    if(t==="h"){
      const [u,h,fl]=await Promise.all([AK.stats(),AK.history(),AK.friends()]);const fset=new Set(fl.map(f=>f.uid));
      B.innerHTML=`<p class="sub"><b>${u.games||0}</b> games · <b>${u.wins||0}</b> wins · <b>${u.points||0}</b> points · best <b>${u.best||0}</b></p>`+
        (h.length?`<ul class="fin">`+h.map(x=>`<li>${x.rank===1?"🥇":"#"+x.rank}<span style="flex:1">${x.date?x.date.toDate().toLocaleDateString("ml-IN"):""} · ${x.players} players ${(x.badges||[]).map(b=>`<span class="bdg">${esc(b)}</span>`).join("")}</span><b>${x.points}</b><div style="flex-basis:100%">${(x.board||[]).filter(b=>b.g&&b.g!==me_user.uid).map(b=>fset.has(b.g)?`<span class="bdg">✓ ${esc(b.n)}</span>`:`<button class="chip" data-add="${b.g}" data-nm="${esc(b.n)}">➕ ${esc(b.n)}</button>`).join(" ")}</div></li>`).join("")+`</ul>`:`<p class="sub">No games yet.</p>`);
    }else{
      const rows=await AK.board(t==="p"?"points":"wins");
      B.innerHTML=rows.length?`<ul class="fin">`+rows.map((x,i)=>`<li>${md[i]||(i+1)+"."}<span style="flex:1">${esc(x.name||"Singer")} <span class="bdg">${x.games||0} games</span></span><b>${x[t==="p"?"points":"wins"]||0}</b></li>`).join("")+`</ul>`:`<p class="sub">Nobody yet.</p>`;
    }
  }catch(e){B.textContent="Couldn't load. Check Firestore rules."}
}
let hb=null,rqs=[],frT=null,invId=null;
function showInvite(d,id){invId=id;$("toastTxt").textContent="🎤 "+d.fromName+" invited you! Code: "+d.code;$("toastJoin").hidden=$("start").hidden;$("toastAdd").hidden=!me_user;$("toastAdd").disabled=false;$("toastAdd").textContent="➕ Add friend";$("toastAdd").dataset.g=d.from;$("toastAdd").dataset.nm=d.fromName;$("toastJoin").dataset.c=d.code;$("toast").hidden=false}
function closeToast(){$("toast").hidden=true;if(invId&&window.AK)AK.delInvite(invId).catch(()=>{});invId=null}
$("toastX").onclick=closeToast;
function addFriend(g,nm,btn){AK.addById(g,nm).then(()=>{btn.textContent="✅ Sent";btn.disabled=true}).catch(()=>{btn.textContent="⚠️ Already sent"})}
$("toastAdd").onclick=e=>addFriend(e.target.dataset.g,e.target.dataset.nm,e.target);
$("sBody").onclick=e=>{const g=e.target.dataset.add;if(g)addFriend(g,e.target.dataset.nm,e.target)};
async function frRefresh(){
  if(!window.AK||!me_user)return;const B=$("frBody");
  try{
    $("myFc").textContent=await AK.beat();await AK.reconcile();
    const [rq,fl]=await Promise.all([AK.reqs(),AK.friends()]);rqs=rq;
    const inc=rq.filter(r=>r.to===me_user.uid&&r.status==="pending"),canInv=isHost&&S&&S.ph==="lobby";
    B.innerHTML=(inc.length?`<p class="sub">Requests</p><ul class="fin">`+inc.map(r=>`<li><span style="flex:1">${esc(r.fromName)}</span><button class="chip" data-acc="${r.id}">Accept</button></li>`).join("")+`</ul>`:"")+
      (fl.length?`<ul class="fin">`+fl.map(f=>{const on=Date.now()-(f.seen||0)<75000;return `<li>${on?"🟢":"⚪"}<span style="flex:1">${esc(f.name||"Singer")}</span>${on&&canInv?`<button class="chip" data-inv="${f.uid}">🎤 Invite</button>`:""}</li>`}).join("")+`</ul>`:`<p class="sub">Add friends with their code.</p>`);
  }catch(e){B.textContent="Couldn't load. Check Firestore rules."}
}
$("bFr2").onclick=()=>openAcct("f");
$("frBody").onclick=async e=>{
  const a=e.target.dataset.acc,v=e.target.dataset.inv;
  try{
    if(a){await AK.accept(a,rqs.find(x=>x.id===a));frRefresh()}
    if(v){await AK.invite(v,code);e.target.textContent="✅ Sent"}
  }catch(err){$("fcMsg").textContent="Failed. Try again."}
};
$("fcAdd").onclick=()=>{const c=$("fcIn").value.trim().toUpperCase();if(!c)return;
  AK.addByCode(c).then(()=>{$("fcMsg").textContent="✅ Request sent";$("fcIn").value=""}).catch(e=>{$("fcMsg").textContent=e.message==="nf"?"Code not found.":"Couldn't add."})};
