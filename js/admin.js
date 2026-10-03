// Admin dashboard (admin e-mail only)
// ---------- admin dashboard ----------
const ADM=APP_CONFIG.adminEmail;
const isAdm=u=>!!(u&&u.verified&&(u.email||"").toLowerCase()===ADM);
let adT="ov",adC={};
const tms=x=>!x?0:x.toMillis?x.toMillis():x.seconds?x.seconds*1000:+x||0;
const ago=ms=>{if(!ms)return"—";const t=(Date.now()-ms)/1000;return t<60?"just now":t<3600?Math.floor(t/60)+"m ago":t<86400?Math.floor(t/3600)+"h ago":Math.floor(t/86400)+"d ago"};
const adCard=(n,l)=>`<div class="adc"><b>${n}</b><span>${l}</span></div>`;
function openAdm(){if(!isAdm(me_user))return;closeAcct();$("adm").hidden=false;adLoad(adT)}
function closeAdm(){$("adm").hidden=true}
async function adLoad(t){
  adT=t;document.querySelectorAll("#adTabs [data-at]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.at===t));
  const B=$("adBody");if(!isAdm(me_user)){B.textContent="Admin only.";return}
  B.innerHTML='<p class="sub">Loading…</p>';
  try{
    const A=AK.adm;
    if(t==="ov"){const [c,us,hs,rq]=await Promise.all([A.counts(),A.list("users"),A.list("history","date"),A.list("reqs")]);adC.users=us;adC.hist=hs;adOv(c,us,hs,rq)}
    else if(t==="us"){adC.users=await A.list("users");adUsers()}
    else if(t==="gm"){const [hs,us]=await Promise.all([A.list("history","date"),A.list("users")]);adC.hist=hs;adC.users=us;adGames()}
    else if(t==="gr"){adC.groups=await A.list("groups");adGroups()}
    else if(t==="fb"){adC.sug=await A.list("suggestions","ts");adSug()}
    else if(t==="rp"){adC.rep=await A.list("reports","ts");adRep()}
    else if(t==="in"){adInfo(await A.counts())}
  }catch(e){B.innerHTML='<p class="sub">⚠️ '+esc(e.message||"Failed")+'<br>Check that your Firestore rules allow the admin account to read/write.</p>'}
}
function adOv(c,us,hs,rq){
  const now=Date.now(),on=us.filter(u=>now-(+u.seen||0)<90000).length,d1=us.filter(u=>now-(+u.seen||0)<864e5).length,d7=us.filter(u=>now-(+u.seen||0)<6048e5).length;
  const pts=us.reduce((a,u)=>a+(u.points||0),0),wins=us.reduce((a,u)=>a+(u.wins||0),0),gp=us.reduce((a,u)=>a+(u.games||0),0);
  const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(6-i));return{d,n:0}});
  hs.forEach(h=>{const m=tms(h.date);days.forEach(x=>{if(m>=x.d.getTime()&&m<x.d.getTime()+864e5)x.n++})});
  const mx=Math.max(1,...days.map(x=>x.n)),top=[...us].sort((a,b)=>(b.points||0)-(a.points||0)).slice(0,5);
  $("adBody").innerHTML=`<div class="adg">`+adCard(c.users??us.length,"Total users")+adCard(on,"Online now")+adCard(d1,"Active 24h")+adCard(d7,"Active 7d")+adCard(c.history??hs.length,"Games saved")+adCard(gp,"Player-games")+adCard(wins,"Total wins")+adCard(pts,"Total points")+adCard(gp?Math.round(pts/gp):0,"Avg pts/game")+adCard(c.groups??0,"Active groups")+adCard(c.suggestions??0,"Suggestions")+adCard(c.reports??0,"Reports")+adCard(rq.filter(r=>r.status==="accepted").length,"Friendships")+adCard(rq.filter(r=>r.status==="pending").length,"Pending requests")+adCard(us.filter(u=>u.banned).length,"Blocked users")+`</div>
  <p class="sub" style="margin-bottom:22px">Games per day (last 7 days)</p><div class="adbar" style="margin-bottom:26px">${days.map(x=>`<div style="height:${Math.round(x.n/mx*100)}%"><i>${x.n}</i><em>${x.d.getDate()}/${x.d.getMonth()+1}</em></div>`).join("")}</div>
  <p class="sub">🏆 Top players</p><ul class="ad">${top.map((u,i)=>`<li>${["🥇","🥈","🥉","4️⃣","5️⃣"][i]}<span class="grow">${esc(u.name||"Singer")}</span><b>${u.points||0}</b> pts · ${u.games||0} games</li>`).join("")||"<li>No data yet</li>"}</ul>`;
}
function adUsers(){
  const q=($("adQ")?$("adQ").value:"").toLowerCase();
  const l=[...adC.users].sort((a,b)=>(+b.seen||0)-(+a.seen||0)).filter(u=>!q||(u.name||"").toLowerCase().includes(q)||(u.fc||"").toLowerCase().includes(q)||u.id.toLowerCase().includes(q));
  const keep=$("adQ")?$("adQ").value:"";
  $("adBody").innerHTML=`<div class="row" style="margin-top:0"><input id="adQ" placeholder="Search name / friend code / uid" style="flex:1" value="${esc(keep)}"><button class="chip" data-act="csv">⬇️ Export CSV</button></div><p class="sub">${l.length} of ${adC.users.length} users</p><ul class="ad">`+l.slice(0,150).map(u=>{
    const on=Date.now()-(+u.seen||0)<90000;
    return `<li><span class="grow"><b style="margin:0;font-size:1rem">${on?"🟢 ":""}${esc(u.name||"Singer")}</b> ${u.banned?'<span class="bdg">⛔ blocked</span>':""}<br><small>${esc(u.fc||"no code")} · ${u.games||0} games · ${u.wins||0} wins · ${u.points||0} pts · best ${u.best||0} · seen ${ago(+u.seen)}</small></span><button class="chip" data-act="det" data-id="${esc(u.id)}">Details</button><button class="chip" data-act="ban" data-id="${esc(u.id)}">${u.banned?"Unblock":"Block"}</button><button class="chip" data-act="reset" data-id="${esc(u.id)}">Reset</button><button class="chip red" data-act="delu" data-id="${esc(u.id)}">Delete</button><div class="det" id="det_${esc(u.id)}" hidden>UID: ${esc(u.id)}<br>Friends: ${(u.friends||[]).length} · Gender: ${esc(u.gd||"—")} · Dress: ${esc(u.dc||"—")} · Approved answers: ${u.approved||0}<br>Last updated: ${u.updated?new Date(tms(u.updated)).toLocaleString():"—"} · Last seen: ${u.seen?new Date(+u.seen).toLocaleString():"—"}</div></li>`}).join("")+"</ul>";
  $("adQ").oninput=adUsers;const e=$("adQ");e.focus();e.setSelectionRange(keep.length,keep.length);
}
function adGames(){
  const nm={};adC.users.forEach(u=>nm[u.id]=u.name);
  $("adBody").innerHTML=`<p class="sub">${adC.hist.length} recent games</p><ul class="ad">`+adC.hist.slice(0,100).map(h=>`<li><span class="grow"><b style="margin:0;font-size:1rem">${h.rank===1?"🥇":"#"+(h.rank||"?")} ${esc(nm[h.uid]||h.uid||"")}</b> ${(h.badges||[]).map(b=>`<span class="bdg">${esc(b)}</span>`).join("")}<br><small>Room ${esc(h.code||"")} · ${h.players||0} players · ${h.points||0} pts · ${h.date?new Date(tms(h.date)).toLocaleString():""}</small></span><button class="chip red" data-act="del" data-c="history" data-id="${esc(h.id)}">Delete</button></li>`).join("")+"</ul>";
}
function adGroups(){
  $("adBody").innerHTML=`<p class="sub">${adC.groups.length} listed groups</p><ul class="ad">`+(adC.groups.map(g=>`<li><span class="grow"><b style="margin:0;font-size:1rem">${esc(g.name||"Group")}</b><br><small>Host ${esc(g.host||"")} · 👥 ${g.count||0}/${g.max||8} · code ${esc(g.code||g.id)} · ${ago(g.ts)}${Date.now()-(g.ts||0)>60000?" (stale)":""}</small></span><button class="chip red" data-act="del" data-c="groups" data-id="${esc(g.id)}">Remove</button></li>`).join("")||"<li>No groups</li>")+"</ul>";
}
function adSug(){
  $("adBody").innerHTML=`<p class="sub">${adC.sug.length} suggestions</p><ul class="ad">`+(adC.sug.map(x=>`<li><span class="grow">${esc(x.text||"")}<br><small>${esc(x.name||"anon")} ${x.uid?"· "+esc(x.uid):""} · ${ago(x.ts)}</small></span><button class="chip red" data-act="del" data-c="suggestions" data-id="${esc(x.id)}">Delete</button></li>`).join("")||"<li>None</li>")+"</ul>";
}
function adRep(){
  $("adBody").innerHTML=`<p class="sub">${adC.rep.length} reports</p><ul class="ad">`+(adC.rep.map(r=>`<li><span class="grow">🚩 <b style="margin:0;font-size:1rem">${esc(r.toName||r.to||"?")}</b> reported by ${esc(r.fromName||r.from||"?")}<br><small>Room ${esc(r.room||"")} · ${ago(r.ts)}${r.to?" · "+esc(r.to):""}</small></span>${r.to?`<button class="chip" data-act="ban" data-id="${esc(r.to)}" data-v="1">Block user</button>`:""}<button class="chip red" data-act="del" data-c="reports" data-id="${esc(r.id)}">Dismiss</button></li>`).join("")||"<li>None</li>")+"</ul>";
}
function adInfo(c){
  const rows=[["App","അന്താക്ഷരി ലൈവ് (Antakshari Live)"],["Admin",ADM],["Signed in as",(me_user.name||"")+" ("+me_user.uid+")"],["Firebase project",AK.adm.info.projectId],["Auth domain",AK.adm.info.authDomain],["Firebase SDK",AK.adm.info.sdk],["Realtime layer","PeerJS (WebRTC, host-authoritative)"],["Scenes",Object.keys(SCENES).length+" ("+Object.keys(SCENES).join(", ")+")"],["Page size",Math.round(document.documentElement.outerHTML.length/1024)+" KB"],["Browser",navigator.userAgent],["Language",navigator.language],["Online",navigator.onLine?"yes":"no"],["Current session",(S?("phase "+S.ph+", room "+(S.code||"")):"not in a game")]];
  $("adBody").innerHTML=`<ul class="ad">`+rows.map(r=>`<li><b style="margin:0;font-size:.9rem;min-width:130px">${esc(r[0])}</b><span class="grow" style="word-break:break-all">${esc(r[1])}</span></li>`).join("")+`</ul><p class="sub">Firestore documents</p><div class="adg">`+Object.entries(c).map(([k,v])=>adCard(v??"?",k)).join("")+`</div><p class="sub">⚠️ The email check in this page only hides the dashboard. Real protection comes from your Firestore security rules (see setup note).</p>`;
}
function adCsv(){
  const h=["uid","name","friendCode","games","wins","points","best","approved","friends","lastSeen","blocked"],q=v=>'"'+String(v??"").replace(/"/g,'""')+'"';
  const r=adC.users.map(u=>[u.id,u.name,u.fc,u.games||0,u.wins||0,u.points||0,u.best||0,u.approved||0,(u.friends||[]).length,u.seen?new Date(+u.seen).toISOString():"",u.banned?1:0].map(q).join(","));
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([[h.join(",")].concat(r).join("\n")],{type:"text/csv"}));a.download="antakshari-users.csv";a.click();
}
$("adBody").onclick=async e=>{
  const b=e.target.closest("[data-act]");if(!b||!isAdm(me_user))return;const a=b.dataset.act,id=b.dataset.id,A=AK.adm;
  try{
    if(a==="csv")return adCsv();
    if(a==="det"){const d=$("det_"+id);d.hidden=!d.hidden;return}
    if(a==="ban"){const u=(adC.users||[]).find(x=>x.id===id);await A.ban(id,b.dataset.v?true:!(u&&u.banned))}
    else if(a==="reset"){if(!confirm("Reset this user's stats to zero?"))return;await A.reset(id)}
    else if(a==="delu"){if(!confirm("Delete this user's profile document? (Their Google account is not deleted.)"))return;await A.del("users",id)}
    else if(a==="del"){await A.del(b.dataset.c,id)}
    adLoad(adT);
  }catch(err){alert("Failed: "+(err.message||err))}
};
$("adTabs").onclick=e=>{const t=e.target.dataset.at;if(t)adLoad(t)};
$("adRef").onclick=()=>adLoad(adT);$("adX").onclick=closeAdm;
$("adm").onclick=e=>{if(e.target===$("adm"))closeAdm()};
// The Admin tab is created only for the admin, and removed for everyone else.
function syncAdminTab(u){
  let b=$("tA");
  if(!isAdm(u)){if(b)b.remove();closeAdm();return}
  if(b)return;
  b=document.createElement("button");
  b.id="tA";b.className="outg";b.setAttribute("aria-pressed","false");
  b.innerHTML="<i>🛡️</i>Admin";b.onclick=openAdm;
  $("acctClose").before(b);
}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAdm()});
