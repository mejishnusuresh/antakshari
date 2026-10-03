// Hosting / joining / networking entry
// ---------- entry ----------
function enter(){$("start").hidden=true;$("groups").hidden=true;$("game").hidden=false;$("leave").hidden=false;updAcct()}
function nick(){myName=($("nick").value.trim()||"Singer").slice(0,14)}
function msg(t){$("startMsg").textContent=t}
function gone(id,why){
  delete pend[id];delete conns[id];delete names[id];delete guids[id];delete profs[id];if(!isHost||!S)return;
  if(S.ph==="lobby"){buildSeats();bc();return}
  const i=S.seats.findIndex(x=>x.id===id);
  if(S.ph==="rapid"){if(i>=0&&S.seats[i].a){S.seats[i].a=0;if(S.rf.by===i&&!S.hold)rfSkip(S.seats[i].n+" "+(why||"left")+".");else bc()}return}
  if(i>=0&&S.seats[i].a&&S.ph!=="end"){if(i===S.c&&!S.hold)out(i,why||"left");else{S.seats[i].a=0;if(alive().length<=1)endGame();else bc()}}
}
const openPeer=id=>new Promise((res,rej)=>{const p=id?new Peer(id):new Peer();p.on("open",()=>res(p));p.on("error",rej)});
 
$("bHost").onclick=async()=>{
  nick();if(typeof Peer==="undefined"){msg("Couldn't load the connection library. Reload the page.");return}
  msg("Allow the microphone…");await getMic();msg("Opening room…");
  for(let k=0;k<3&&!peer;k++){
    code=Math.random().toString(36).slice(2,6).toUpperCase();
    try{peer=await openPeer("ak-"+code.toLowerCase())}catch(e){peer=null;if(e.type!=="unavailable-id"){msg("Couldn't reach the connection service ("+(e.type||"error")+"). Try again.");return}}
  }
  if(!peer){msg("Couldn't create a room. Try again.");return}
  isHost=true;S=fresh();S.code=code;S.gn=(myName+"'s group").slice(0,24);pubOn=true;
  initVoice();
  peer.on("connection",c=>{
    c.on("open",()=>{
      if(S.ph!=="lobby"){c.send({t:"err",m:"Game already started."});setTimeout(()=>c.close(),400);return}
      if(S.seats.length>=8){c.send({t:"err",m:"Group is full."});setTimeout(()=>c.close(),400);return}
      conns[c.peer]=c;
    });
    c.on("data",d=>{
      if(!d||!conns[c.peer])return;
      if(pend[c.peer]&&d.t!=="hi")return;
      if(d.t==="hi"){if(d.g&&banU.has(String(d.g))){c.send({t:"err",m:"You were removed from this game."});setTimeout(()=>c.close(),400);return}
        if(d.rq&&!names[c.peer]){if(!pend[c.peer]){pend[c.peer]={n:String(d.n||"Singer").slice(0,14),g:String(d.g||"").slice(0,40),gd:String(d.gd||"").slice(0,1),dc:String(d.dc||"").slice(0,7),t:Date.now()};c.send({t:"wait"});renderReq()}return}names[c.peer]=String(d.n||"Singer").slice(0,14);guids[c.peer]=String(d.g||"").slice(0,40);profs[c.peer]={gd:String(d.gd||"").slice(0,1),dc:String(d.dc||"").slice(0,7)};buildSeats();bc()}
      else if(d.t==="prof"){const pf={gd:String(d.gd||"").slice(0,1),dc:/^#[0-9a-f]{6}$/i.test(d.dc||"")?d.dc:""};profs[c.peer]=pf;const sd=S.seats.find(x=>x.id===c.peer);if(sd){sd.gd=pf.gd;sd.dc=pf.dc;bc()}}
      else if(d.t==="chat"){const now=Date.now();if(now-(lastChat[c.peer]||0)>400){lastChat[c.peer]=now;addChat(names[c.peer]||"Player",d.m)}}
      else if(d.t==="act")act(c.peer,d.d||{});
    });
    c.on("close",()=>gone(c.peer));c.on("error",()=>gone(c.peer));
  });
  enter();buildSeats();bc();
};
$("bJoin").onclick=()=>joinRoom($("jcode").value.trim().toLowerCase().replace(/[^a-z0-9]/g,""),0);
async function joinRoom(c,rq){
  nick();
  if(c.length<3){msg("Enter the invite code.");return}
  if(typeof Peer==="undefined"){msg("Couldn't load the connection library. Reload the page.");return}
  msg("Allow the microphone…");await getMic();msg("Joining…");
  try{peer=await openPeer()}catch(e){msg("Couldn't reach the connection service. Try again.");return}
  initVoice();
  let opened=false,wait=0;
  peer.on("error",e=>{if(!opened)msg(e.type==="peer-unavailable"?"No room with that code.":"Connection problem ("+e.type+").")});
  conn=peer.connect("ak-"+c,{serialization:"json",reliable:true});
  setTimeout(()=>{if(!opened)msg("Couldn't reach that room. Check the code.")},9000);
  conn.on("open",()=>{
    opened=true;isHost=false;code=c.toUpperCase();S=fresh();S.code=code;
    conn.send({t:"hi",rq,n:myName,g:me_user?me_user.uid:"",gd:prof.gd,dc:prof.dc});
    if(rq){wait=1;msg("⏳ Request sent. Waiting for the host to approve…")}else{enter();render()}
  });
  conn.on("data",d=>{
    if(!d)return;
    if(d.t==="st"){S=d.s;if(wait){wait=0;gReq="";enter()}render();voiceSync()}
    else if(d.t==="err"){opened=false;wait=0;gReq="";msg(d.m);if(rq){try{peer.destroy()}catch(e){}peer=null}}
    else if(d.t==="kick"){alert("You were removed by the host.");location.href=location.pathname}
  });
  conn.on("close",()=>{if(wait){wait=0;gReq="";msg("The host closed your request.");return}if(S&&opened){S.ph="end";S.w=-1;S.msg="Host left the game.";render()}});
};
