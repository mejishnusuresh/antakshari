// Active groups list + join requests
// ---------- active groups + join requests ----------
let pubOn=false,pubT=0,pubK="",gReq="",gReqT=0;
function pubGroup(){
  if(!isHost||!pubOn||!S||!window.AK||!AK.pubGroup)return;
  if(S.ph!=="lobby"){if(pubK!=="x"){pubK="x";unpubGroup()}return}
  const k=S.seats.length+"|"+S.gn;
  if(k===pubK&&Date.now()-pubT<20000)return;
  pubK=k;pubT=Date.now();
  AK.pubGroup({code,name:S.gn||"Group",host:myName,count:S.seats.length,max:8,ph:"lobby"}).catch(()=>{});
}
function unpubGroup(){if(isHost&&code&&window.AK&&AK.delGroup)AK.delGroup(code).catch(()=>{})}
addEventListener("pagehide",unpubGroup);
function renderReq(){
  const B=$("reqBox"),ids=Object.keys(pend);
  B.hidden=!(isHost&&ids.length&&S&&S.ph==="lobby");if(B.hidden)return;
  B.innerHTML='<p class="sub" style="margin:0 0 4px">🙋 Join requests</p><ul class="fin" style="margin-top:0">'+ids.map(id=>`<li><span style="flex:1">${esc(pend[id].n)} wants to join</span><button class="chip" data-ap="${esc(id)}">✅ Approve</button><button class="chip red" data-dc="${esc(id)}" aria-label="Decline">✖</button></li>`).join("")+"</ul>";
}
function rejectReq(id,m){
  const c=conns[id];delete pend[id];delete conns[id];
  try{c&&c.send({t:"err",m:m||"The host declined your request."})}catch(e){}
  setTimeout(()=>{try{c&&c.close()}catch(e){}},400);renderReq();
}
function declineAll(m){for(const id in pend)rejectReq(id,m)}
function approveReq(id){
  const p=pend[id];if(!p||!isHost||!S||S.ph!=="lobby")return;
  if(S.seats.length>=8)return rejectReq(id,"Group is full.");
  delete pend[id];names[id]=p.n;guids[id]=p.g;profs[id]={gd:p.gd,dc:p.dc};
  buildSeats();bc();renderReq();
}
function saveGn(){if(!isHost||!S)return;const v=$("gnIn").value.trim().slice(0,24);if(!v)return;S.gn=v;bc();$("gnIn").blur();$("gnSave").textContent="✅ Saved";setTimeout(()=>{$("gnSave").textContent="Save"},1200)}
$("gnSave").onclick=saveGn;$("gnIn").onkeydown=e=>{if(e.key==="Enter")saveGn()};
$("reqBox").onclick=e=>{const a=e.target.dataset.ap,d=e.target.dataset.dc;if(a)approveReq(a);else if(d)rejectReq(d)};
setInterval(()=>{if(isHost)for(const id in pend)if(Date.now()-pend[id].t>90000)rejectReq(id,"Request timed out.")},5000);
async function gRefresh(){
  if($("start").hidden)return;const B=$("gList");
  if(!(window.AK&&AK.groups)){B.innerHTML='<p class="sub">Group list is unavailable right now.</p>';return}
  try{
    const now=Date.now(),l=(await AK.groups()).filter(g=>g.code&&g.ph==="lobby"&&now-(g.ts||0)<60000).sort((a,b)=>(b.ts||0)-(a.ts||0));
    const asked=gReq&&now-gReqT<90000?gReq:"";
    B.innerHTML=l.length?'<ul class="fin">'+l.map(g=>{const mx=+g.max||8,full=(+g.count||0)>=mx,req=asked===g.code;
      return `<li><span style="flex:1;min-width:120px"><span style="font-weight:800">${esc(g.name||"Group")}</span><br><span style="font-size:.85rem;color:var(--mute)">🎤 ${esc(g.host||"")} · 👥 ${+g.count||0}/${mx}</span></span><button class="chip" data-rq="${esc(g.code)}" ${full||req?"disabled":""}>${full?"Full":req?"⏳ Requested":"🙋 Request"}</button></li>`}).join("")+"</ul>":'<p class="sub">No active groups right now. Host one!</p>';
  }catch(e){B.innerHTML='<p class="sub">Couldn\'t load groups. Check Firestore rules.</p>'}
}
$("gList").onclick=e=>{const c=e.target.dataset.rq;if(!c)return;
  e.target.disabled=true;e.target.textContent="⏳ Requested";gReq=c;gReqT=Date.now();joinRoom(c.toLowerCase(),1)};
$("gRef").onclick=gRefresh;
setInterval(gRefresh,8000);setTimeout(gRefresh,1500);setTimeout(gRefresh,4000);
