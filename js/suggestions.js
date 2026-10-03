// Suggestion box
// ---------- suggestions ----------
const sugClose=()=>{$("sug").hidden=true};let sugT=0;
$("sugBtn").onclick=()=>{$("sug").hidden=false;$("sugMsg").textContent="";$("sugTx").focus()};
$("sugX").onclick=sugClose;$("sug").onclick=e=>{if(e.target===$("sug"))sugClose()};
$("sugTx").oninput=()=>{$("sugN").textContent=$("sugTx").value.length+"/600"};
$("sugSend").onclick=async()=>{
  const t=$("sugTx").value.trim(),m=$("sugMsg"),mail=`<a href="mailto:ijishnusuresh@gmail.com?subject=Antakshari%20suggestion&body=${encodeURIComponent(t)}">Email it instead</a>`;
  if(t.length<3){m.textContent="Please type a few words.";return}
  if(Date.now()-sugT<15000){m.textContent="Please wait a few seconds before sending another.";return}
  if(!window.AK||!AK.suggest){m.innerHTML="Couldn't reach the server. "+mail;return}
  $("sugSend").disabled=true;
  try{await AK.suggest({text:t,name:$("nick").value.trim()||myName});sugT=Date.now();$("sugTx").value="";$("sugN").textContent="0/600";m.textContent="✅ Thank you! Your suggestion was sent to the admin."}
  catch(e){m.innerHTML="Couldn't send. "+mail}
  $("sugSend").disabled=false};
