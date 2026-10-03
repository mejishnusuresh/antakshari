// Voice chat (PeerJS calls)
// ---------- voice chat (mesh of PeerJS calls) ----------
const OPUS={sdpTransform:sdp=>sdp.replace("useinbandfec=1","useinbandfec=1;maxaveragebitrate=96000;usedtx=0")};
function silent(){const ac=new (window.AudioContext||window.webkitAudioContext)();return ac.createMediaStreamDestination().stream}
async function getMic(){try{mic=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:false,autoGainControl:false}})}catch(e){mic=null}}
function attach(call){
  calls[call.peer]=call;let ok=false;
  const drop=()=>{if(calls[call.peer]===call)delete calls[call.peer];const a=$("a-"+call.peer);a&&a.remove()};
  call.on("stream",st=>{ok=true;let a=$("a-"+call.peer);if(!a){a=document.createElement("audio");a.id="a-"+call.peer;a.autoplay=true;document.body.append(a)}a.srcObject=st;a.play&&a.play().catch(()=>{})});
  call.on("close",drop);call.on("error",drop);
  setTimeout(()=>{if(!ok){try{call.close()}catch(e){}drop()}},12000);
}
function initVoice(){
  peer.on("call",c=>{c.answer(mic||silent(),OPUS);attach(c)});
  voiceReady=true;$("vc").hidden=false;$("vc").textContent=mic?"🎙️ Mic on":"🔇 No mic";applyMic();
}
function voiceSync(){
  if(!voiceReady||!peer||!S||!peer.id)return;
  S.seats.forEach(s=>{if(s.id!==peer.id&&!calls[s.id]&&peer.id<s.id){try{attach(peer.call(s.id,mic||silent(),OPUS))}catch(e){}}});
}
// lobby and end: everyone can talk. During singing: only the current singer, and only after Start.
function applyMic(){
  if(!mic||!S)return;
  const inGame=S.ph==="play"||S.ph==="pick"||S.ph==="rapid";
  const live=userMic&&(!inGame||(S.ph==="play"&&!S.pk&&S.pz&&S.c===meIdx())||(S.ph==="rapid"&&S.rf.st==="sing"&&S.rf.by===meIdx()));
  mic.getAudioTracks()[0].enabled=live;
  $("vc").textContent=!userMic?"🔇 Muted":inGame?(live?"🎙️ You're live":"👂 Listening"):"🎙️ Mic on";
}
$("vc").onclick=()=>{if(!mic)return;userMic=!userMic;applyMic()};
 
