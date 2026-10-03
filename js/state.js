// Scenes and shared game state
let S=null,isHost=false,myName="Singer",code="",peer=null,conn=null,mic=null,userMic=true,voiceReady=false;
const pend={},conns={},names={},guids={},profs={},calls={},lastChat={},banned=new Set(),banU=new Set();
const myId=()=>peer?peer.id:null;
const meIdx=()=>{const id=myId();return S?S.seats.findIndex(s=>s.id===id):-1};
const fresh=()=>({sc:"camp",ph:"lobby",seats:[],c:0,L:"",t:20,pl:90,pz:0,pk:0,sg:0,hz:0,hold:0,msg:"",log:[],ch:[],rw:-1,hr:0,rfx:0,bub:null,w:-1,R:5,rd:1,vt:0,v:{},half:0,code});
function bc(){render();sendAll();voiceSync()}
function sendAll(){for(const id in conns){if(pend[id])continue;try{conns[id].send({t:"st",s:S})}catch(e){}}}
 
