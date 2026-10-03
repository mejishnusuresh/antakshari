// Report and kick
// ---------- Report / kick ----------
function kick(id){
  if(!isHost||!S||id===peer.id)return;const c=conns[id];
  try{c&&c.send({t:"kick"})}catch(e){}
  setTimeout(()=>{try{c&&c.close()}catch(e){}},400);
  banned.add(id);if(guids[id])banU.add(guids[id]);gone(id,"was removed");
}
function openPm(i){const p=S&&S.seats[i];if(!p||i===meIdx())return;pmI=i;$("pmName").textContent=p.n;$("pmKick").hidden=!isHost;$("pmMsg").textContent="";$("pm").hidden=false}
function closePm(){$("pm").hidden=true;pmI=-1}
$("stage").onclick=e=>{const el=e.target.closest(".seat");if(el)openPm(+el.dataset.i)};
$("pmX").onclick=closePm;$("pm").onclick=e=>{if(e.target===$("pm"))closePm()};
$("pmKick").onclick=()=>{const p=S.seats[pmI];if(p&&isHost&&confirm("Kick out "+p.n+"?"))kick(p.id);closePm()};
$("pmRep").onclick=()=>{
  const p=S.seats[pmI];if(!p)return;
  if(!(window.AK&&me_user)){$("pmMsg").textContent="Sign in to report.";return}
  AK.report({to:p.g||"",toName:p.n,room:code}).then(()=>{$("pmMsg").textContent="✅ Report sent."}).catch(()=>{$("pmMsg").textContent="Couldn't send."});
};
