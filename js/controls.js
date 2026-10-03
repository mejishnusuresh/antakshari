// Buttons and controls
// ---------- controls ----------
$("mic").onclick=()=>{if(S&&S.pz)doAct({k:"done"});else doAct({k:"pause",on:1})};
$("hz").onclick=()=>{if(isHost&&S){S.hz=S.hz?0:1;bc()}};
$("letters2").innerHTML=MAL.map(c=>`<button data-c="${c}">${c}</button>`).join("");
$("letters2").onclick=e=>{const c=e.target.dataset.c;if(c&&S.ph==="play"&&S.pk&&meIdx()===S.c)doAct({k:"letter",c})};
$("letters").innerHTML=MAL.map(c=>`<button data-c="${c}">${c}</button>`).join("");
$("letters").onclick=e=>{const c=e.target.dataset.c;if(c&&S.ph==="pick"&&meIdx()===S.c)doAct({k:"letter",c})};
$("scenes").onclick=e=>{const k=e.target.dataset.k;if(k&&isHost&&SCENES[k]){S.sc=k;bc()}};
$("bGo").onclick=startGame;
$("bPass").onclick=()=>doAct({k:"pass"});
$("vUp").onclick=()=>doAct({k:"vote",v:1});$("vDn").onclick=()=>doAct({k:"vote",v:-1});
$("rm").onclick=()=>{if(isHost&&S.R>1){S.R--;bc()}};$("rp").onclick=()=>{if(isHost&&S.R<20){S.R++;bc()}};
$("endBtn").onclick=()=>{if(isHost&&confirm("End the game now?"))endGame()};
$("bAgain").onclick=()=>{location.href=location.pathname};
$("leave").onclick=()=>{
  if(!confirm(isHost?"Leaving ends the game for everyone. Leave?":"Leave the group?"))return;
  unpubGroup();try{conn&&conn.close()}catch(e){}try{peer&&peer.destroy()}catch(e){}
  location.href=location.pathname;
};
$("bCopy").onclick=()=>{const u=location.href.split("#")[0]+"#"+code;(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>{$("bCopy").textContent="✅ Copied"}).catch(()=>{prompt("Copy invite link:",u)})};
 
