// In-game chat
// ---------- Chat ----------
function addChat(n,m){m=String(m||"").trim().slice(0,120);if(!m||!S)return;S.ch=(S.ch||[]).concat({n,m}).slice(-20);bc()}
function sendChat(){const m=$("chatIn").value.trim();if(!m)return;$("chatIn").value="";if(isHost)addChat(myName,m);else if(conn&&conn.open)conn.send({t:"chat",m})}
$("chatSend").onclick=sendChat;$("chatIn").onkeydown=e=>{if(e.key==="Enter")sendChat()};
