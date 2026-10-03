// SVG characters, scene backgrounds
const look=(p,i)=>{const l={...LK[i%8]};if(/^#[0-9a-f]{6}$/i.test(p.dc||""))l.t=p.dc;if(p.gd==="f")l.st=1;else if(p.gd==="m")l.st=0;return l};
// full-body seated figure
function fig(l,on){
  const hb=l.st===1?`<path d="M17 21a13 13 0 0 1 26 0v24h-6V22H23v23h-6z" fill="${l.h}"/>`:"";
  const hf=l.st===2?`<circle cx="30" cy="4" r="5" fill="${l.h}"/><path d="M19 18a11 11 0 0 1 22 0z" fill="${l.h}"/>`:`<path d="M19 18a11 11 0 0 1 22 0c-4-3-7-4-11-4s-7 1-11 4z" fill="${l.h}"/>`;
  const arm=on
    ?`<path d="M41 36l6-12" stroke="${l.t}" stroke-width="7" stroke-linecap="round"/><circle cx="47" cy="22" r="3.6" fill="${l.s}"/><rect x="45" y="12" width="4" height="9" rx="2" fill="#333"/><circle cx="47" cy="11" r="3" fill="#888"/>`
    :`<path d="M41 36l4 18" stroke="${l.t}" stroke-width="7" stroke-linecap="round"/><circle cx="45" cy="56" r="3.6" fill="${l.s}"/>`;
  return `<svg viewBox="-2 -4 64 98" role="img" aria-hidden="true">
<ellipse cx="30" cy="66" rx="24" ry="7" fill="#6b4a2b"/>
${hb}
<rect x="17" y="66" width="12" height="18" rx="5" fill="${l.p}"/><rect x="31" y="66" width="12" height="18" rx="5" fill="${l.p}"/>
<ellipse cx="23" cy="87" rx="7" ry="3.5" fill="#222"/><ellipse cx="37" cy="87" rx="7" ry="3.5" fill="#222"/>
<rect x="17" y="30" width="26" height="38" rx="10" fill="${l.t}"/>
<path d="M19 36l-4 18" stroke="${l.t}" stroke-width="7" stroke-linecap="round"/><circle cx="15" cy="56" r="3.6" fill="${l.s}"/>
${arm}
<circle cx="30" cy="19" r="11" fill="${l.s}"/>${hf}
<circle cx="26" cy="19" r="1.5" fill="#222"/><circle cx="34" cy="19" r="1.5" fill="#222"/>
${on?`<ellipse cx="30" cy="25" rx="3" ry="3.4" fill="#7a1f1f"/>`:`<path d="M26 24q4 3 8 0" stroke="#7a1f1f" stroke-width="1.4" fill="none" stroke-linecap="round"/>`}
</svg>`;
}
 
const CAMP_BG=`<svg class="bgsvg" viewBox="0 0 100 80" preserveAspectRatio="none"><circle cx="0" cy="1" r=".25" fill="#fff" opacity=".5"/><circle cx="37" cy="14" r=".25" fill="#fff" opacity=".6"/><circle cx="74" cy="7" r=".25" fill="#fff" opacity=".7"/><circle cx="11" cy="20" r=".25" fill="#fff" opacity=".8"/><circle cx="48" cy="13" r=".25" fill="#fff" opacity=".9"/><circle cx="85" cy="6" r=".25" fill="#fff" opacity=".5"/><circle cx="22" cy="19" r=".25" fill="#fff" opacity=".6"/><circle cx="59" cy="12" r=".25" fill="#fff" opacity=".7"/><circle cx="96" cy="5" r=".25" fill="#fff" opacity=".8"/><circle cx="33" cy="18" r=".25" fill="#fff" opacity=".9"/><circle cx="70" cy="11" r=".25" fill="#fff" opacity=".5"/><circle cx="7" cy="4" r=".25" fill="#fff" opacity=".6"/><circle cx="44" cy="17" r=".25" fill="#fff" opacity=".7"/><circle cx="81" cy="10" r=".25" fill="#fff" opacity=".8"/><circle cx="18" cy="3" r=".25" fill="#fff" opacity=".9"/><circle cx="55" cy="16" r=".25" fill="#fff" opacity=".5"/><circle cx="92" cy="9" r=".25" fill="#fff" opacity=".6"/><circle cx="29" cy="2" r=".25" fill="#fff" opacity=".7"/><circle cx="66" cy="15" r=".25" fill="#fff" opacity=".8"/><circle cx="3" cy="8" r=".25" fill="#fff" opacity=".9"/><circle cx="40" cy="1" r=".25" fill="#fff" opacity=".5"/><circle cx="77" cy="14" r=".25" fill="#fff" opacity=".6"/><circle cx="14" cy="7" r=".25" fill="#fff" opacity=".7"/><circle cx="51" cy="20" r=".25" fill="#fff" opacity=".8"/><circle cx="88" cy="13" r=".25" fill="#fff" opacity=".9"/><circle cx="25" cy="6" r=".25" fill="#fff" opacity=".5"/><circle cx="62" cy="19" r=".25" fill="#fff" opacity=".6"/><circle cx="99" cy="12" r=".25" fill="#fff" opacity=".7"/><circle cx="36" cy="5" r=".25" fill="#fff" opacity=".8"/><circle cx="73" cy="18" r=".25" fill="#fff" opacity=".9"/><circle cx="10" cy="11" r=".25" fill="#fff" opacity=".5"/><circle cx="47" cy="4" r=".25" fill="#fff" opacity=".6"/><circle cx="84" cy="17" r=".25" fill="#fff" opacity=".7"/><circle cx="21" cy="10" r=".25" fill="#fff" opacity=".8"/><circle cx="58" cy="3" r=".25" fill="#fff" opacity=".9"/><circle cx="95" cy="16" r=".25" fill="#fff" opacity=".5"/><circle cx="32" cy="9" r=".25" fill="#fff" opacity=".6"/><circle cx="69" cy="2" r=".25" fill="#fff" opacity=".7"/><circle cx="6" cy="15" r=".25" fill="#fff" opacity=".8"/><circle cx="43" cy="8" r=".25" fill="#fff" opacity=".9"/><circle cx="80" cy="1" r=".25" fill="#fff" opacity=".5"/><circle cx="17" cy="14" r=".25" fill="#fff" opacity=".6"/><circle cx="54" cy="7" r=".25" fill="#fff" opacity=".7"/><circle cx="91" cy="20" r=".25" fill="#fff" opacity=".8"/><circle cx="28" cy="13" r=".25" fill="#fff" opacity=".9"/><circle cx="84" cy="8" r="9" fill="#fdf3c8" opacity=".12"/><circle cx="84" cy="8" r="4" fill="#fdf3c8"/><path d="M-2 16L1.2000000000000002 26L-5.2 26Z" fill="#13261f"/><path d="M3 16L6.2 26L-0.20000000000000018 26Z" fill="#13261f"/><path d="M8 16L11.2 26L4.8 26Z" fill="#13261f"/><path d="M13 16L16.2 26L9.8 26Z" fill="#13261f"/><path d="M18 16L21.2 26L14.8 26Z" fill="#13261f"/><path d="M23 16L26.2 26L19.8 26Z" fill="#13261f"/><path d="M28 16L31.2 26L24.8 26Z" fill="#13261f"/><path d="M33 16L36.2 26L29.8 26Z" fill="#13261f"/><path d="M38 16L41.2 26L34.8 26Z" fill="#13261f"/><path d="M43 16L46.2 26L39.8 26Z" fill="#13261f"/><path d="M48 16L51.2 26L44.8 26Z" fill="#13261f"/><path d="M53 16L56.2 26L49.8 26Z" fill="#13261f"/><path d="M58 16L61.2 26L54.8 26Z" fill="#13261f"/><path d="M63 16L66.2 26L59.8 26Z" fill="#13261f"/><path d="M68 16L71.2 26L64.8 26Z" fill="#13261f"/><path d="M73 16L76.2 26L69.8 26Z" fill="#13261f"/><path d="M78 16L81.2 26L74.8 26Z" fill="#13261f"/><path d="M83 16L86.2 26L79.8 26Z" fill="#13261f"/><path d="M88 16L91.2 26L84.8 26Z" fill="#13261f"/><path d="M93 16L96.2 26L89.8 26Z" fill="#13261f"/><path d="M98 16L101.2 26L94.8 26Z" fill="#13261f"/><path d="M103 16L106.2 26L99.8 26Z" fill="#13261f"/><path d="M0 14L3.2 26L-3.2 26Z" fill="#0a1a14"/><path d="M5 14L8.2 26L1.7999999999999998 26Z" fill="#0a1a14"/><path d="M10 14L13.2 26L6.8 26Z" fill="#0a1a14"/><path d="M15 14L18.2 26L11.8 26Z" fill="#0a1a14"/><path d="M20 14L23.2 26L16.8 26Z" fill="#0a1a14"/><path d="M25 14L28.2 26L21.8 26Z" fill="#0a1a14"/><path d="M30 14L33.2 26L26.8 26Z" fill="#0a1a14"/><path d="M35 14L38.2 26L31.8 26Z" fill="#0a1a14"/><path d="M40 14L43.2 26L36.8 26Z" fill="#0a1a14"/><path d="M45 14L48.2 26L41.8 26Z" fill="#0a1a14"/><path d="M50 14L53.2 26L46.8 26Z" fill="#0a1a14"/><path d="M55 14L58.2 26L51.8 26Z" fill="#0a1a14"/><path d="M60 14L63.2 26L56.8 26Z" fill="#0a1a14"/><path d="M65 14L68.2 26L61.8 26Z" fill="#0a1a14"/><path d="M70 14L73.2 26L66.8 26Z" fill="#0a1a14"/><path d="M75 14L78.2 26L71.8 26Z" fill="#0a1a14"/><path d="M80 14L83.2 26L76.8 26Z" fill="#0a1a14"/><path d="M85 14L88.2 26L81.8 26Z" fill="#0a1a14"/><path d="M90 14L93.2 26L86.8 26Z" fill="#0a1a14"/><path d="M95 14L98.2 26L91.8 26Z" fill="#0a1a14"/><path d="M100 14L103.2 26L96.8 26Z" fill="#0a1a14"/></svg>`,FIRE=`<svg class="firesvg" viewBox="0 0 100 100"><ellipse cx="50" cy="82" rx="46" ry="14" fill="#ff9a3c" opacity=".35"/><ellipse cx="88.0" cy="82.0" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/><ellipse cx="17.1" cy="76.5" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/><ellipse cx="31.0" cy="72.5" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/><ellipse cx="50.0" cy="71.0" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/><ellipse cx="69.0" cy="72.5" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/><ellipse cx="82.9" cy="76.5" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/>
<g class="cfl"><path d="M50 4C60 26 78 36 72 62C69 76 31 76 28 62C22 38 40 28 50 4Z" fill="#e8451c"/></g>
<g class="cfl cfl2"><path d="M50 22C58 38 68 44 64 62C62 72 38 72 36 62C32 46 44 40 50 22Z" fill="#ff9a1f"/></g>
<g class="cfl cfl3"><path d="M50 40C55 50 60 54 57 65C55 71 45 71 43 65C40 55 46 50 50 40Z" fill="#ffe27a"/></g>
<rect x="14" y="72" width="72" height="11" rx="5.5" fill="#6b4423" stroke="#3b2412" stroke-width="1.2" transform="rotate(-9 50 78)"/>
<rect x="14" y="72" width="72" height="11" rx="5.5" fill="#7d5230" stroke="#3b2412" stroke-width="1.2" transform="rotate(9 50 78)"/>
<ellipse cx="82.9" cy="87.5" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/><ellipse cx="69.0" cy="91.5" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/><ellipse cx="50.0" cy="93.0" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/><ellipse cx="31.0" cy="91.5" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/><ellipse cx="17.1" cy="87.5" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/><ellipse cx="12.0" cy="82.0" rx="6" ry="4" fill="#8d8d96" stroke="#4a4a55" stroke-width="1"/>
<circle class="cspark" cx="44" cy="34" r="1.6" fill="#ffd54a"/><circle class="cspark" style="animation-delay:.6s" cx="56" cy="30" r="1.3" fill="#ff9a1f"/><circle class="cspark" style="animation-delay:1.2s" cx="50" cy="26" r="1.5" fill="#ffe27a"/></svg>`;
const CS=(()=>{
const K='#2b2b3a',O=` stroke="${K}" stroke-width="1.5" stroke-linejoin="round"`;
function arm(x,y,len,a,col,sk,d){
 const an=d?`<animateTransform attributeName="transform" type="rotate" values="${-a} ${x} ${y};${-(a+d)} ${x} ${y};${-a} ${x} ${y}" dur=".5s" repeatCount="indefinite"/>`:'';
 const L=(c,w)=>`<line x1="${x}" y1="${y}" x2="${x}" y2="${y+len}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
 return `<g transform="rotate(${-a} ${x} ${y})">${an}${L(K,11.5)}${L(col,8.6)}<circle cx="${x}" cy="${y+len+1}" r="5" fill="${sk}"${O}/></g>`}
function hairParts(c,v){
 const F=`fill="${c.h}"${O}`,st=c.st;let b='',o='';
 if(st=='long'){const p=`<path d="M-23 -4Q-28 38 -14 44L14 44Q28 38 23 -4Z" ${F}/>`;(v=='back'||v=='b3')?o=p:b=p}
 if(st=='pig')b=`<ellipse cx="-25" cy="14" rx="6" ry="13" ${F}/><ellipse cx="25" cy="14" rx="6" ry="13" ${F}/>`;
 if(st=='pony'){const e=(x,y,ry)=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="${ry}" ${F}/>`;if(v=='back')o=e(0,26,11);else b=e({front:25,q3:-22,side:-25,b3:-22}[v],6,13)}
 return[b,o]}
function tuft(c){const F=`fill="${c.h}"${O}`;
 if(c.st=='spiky')return `<path d="M-16 -14L-13 -29L-6 -20L0 -31L6 -20L13 -28L16 -14Z" ${F}/>`;
 if(c.st=='curly')return [[-14,-15],[-5,-22],[6,-22],[15,-15],[-20,-4],[20,-4]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7.5" ${F}/>`).join('');
 if(c.st=='bun')return `<circle cy="-27" r="7" fill="${c.h}"${O}/>`;
 return ''}
function head(c,v,pose){
 const sk=c.s,F=`fill="${c.h}"${O}`,S=`fill="${sk}"${O}`,happy=pose=='sing'||pose=='win',open=happy||pose=='clap'||pose=='up';
 const ear=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="3" ry="4" ${S}/>`;
 if(v=='back')return ear(-20.5,4)+ear(20.5,4)+`<circle r="20" ${S}/><circle r="21" ${F}/>`+tuft(c);
 if(v=='b3')return `<circle r="20" ${S}/><circle cx="-2" r="21" ${F}/>`+ear(18,4)+tuft(c);
 const cap=`<path d="M-21 4Q-25 -25 0 -25Q25 -25 21 4Q16 -8 4 -11Q-8 -5 -21 4Z" ${F}/>`;
 const ex={front:[-7,7],q3:[3,14],side:[12]}[v],mx={front:0,q3:9,side:14}[v],bx={front:[-12,12],q3:[5],side:[6]}[v];
 let s=v=='front'?ear(-20.5,4)+ear(20.5,4):'';
 s+=`<circle r="20" ${S}/>`;
 if(v=='q3')s+=`<ellipse cx="-12" cy="2" rx="9" ry="18" ${F}/>`;
 if(v=='side')s+=`<ellipse cx="-8" cy="2" rx="14" ry="19" ${F}/>`;
 if(v!='front')s+=`<path d="M19 3Q25 7 19 11Z" ${S}/>`;
 s+=cap+bx.map(x=>`<circle cx="${x}" cy="9" r="3" fill="#f4a6a6" opacity=".7"/>`).join('');
 s+=ex.map(x=>happy?`<path d="M${x-3} 3Q${x} -2 ${x+3} 3" fill="none" stroke="${K}" stroke-width="1.7" stroke-linecap="round"/>`:`<circle cx="${x}" cy="2" r="1.9" fill="${K}"/>`).join('');
 s+=pose=='down'?`<path d="M${mx-4} 15Q${mx} 10 ${mx+4} 15" fill="none" stroke="${K}" stroke-width="1.5" stroke-linecap="round"/>`:open?`<path d="M${mx-5} 10Q${mx} 23 ${mx+5} 10Z" fill="#c2392b" stroke="${K}" stroke-width="1.2" stroke-linejoin="round"/>`:`<path d="M${mx-4} 11Q${mx} 16 ${mx+4} 11" fill="none" stroke="${K}" stroke-width="1.5" stroke-linecap="round"/>`;
 if(v=='side')s+=ear(-4,4);
 return s+tuft(c)}
function sprite(c,pose,v,flip){
 v=v||'front';
 const sk=c.s,sit=['sit','clap','up','down'].includes(pose),back=v=='back'||v=='b3',fr=v=='front'||v=='q3';
 const hy=sit?50:33,tT=sit?70:52,tH=sit?30:38,sy=tT+7;
 const tw={front:17,q3:15,side:11,b3:15,back:17}[v],lx=50-tw+3,rx=50+tw-3;
 const A=(x,l,a,d)=>arm(x,sy,l,a,c.t,sk,d);
 let arms='',fx='',extra='';
 if(pose=='sit')arms=A(lx,22,-28)+A(rx,22,28);
 if(pose=='up'||pose=='down'){const ta=pose=='up'?115:80,tl=24,tx=rx+tl*Math.sin(ta*Math.PI/180),ty=sy+tl*Math.cos(ta*Math.PI/180)+1;
  arms=A(lx,22,-28)+A(rx,tl,ta)+`<rect x="${(tx-2.3).toFixed(1)}" y="${(pose=='up'?ty-13:ty+1).toFixed(1)}" width="4.6" height="11" rx="2.3" fill="${sk}"${O}/>`}
 if(pose=='stand')arms=A(lx,28,-8)+A(rx,28,8);
 if(pose=='sing'){if(!back)extra=`<rect x="6" y="${sy+2}" width="17" height="21" rx="2" fill="#fff"${O}/><path d="M9 ${sy+8}h11M9 ${sy+13}h11M9 ${sy+18}h8" stroke="#999" stroke-width="1.2"/>`;arms=A(lx,22,-35)+A(rx,26,125);fx='<g class="fx" fill="#ffd54a" font-size="14"><text x="74" y="14">♪</text><text x="86" y="30">♫</text></g>'}
 if(pose=='win'){arms=A(lx,26,-145)+A(rx,26,145);fx='<text x="2" y="12" font-size="13" fill="#f5b400">★</text><text x="86" y="10" font-size="13" fill="#f5b400">✦</text><text x="90" y="56" font-size="10" fill="#f5b400">★</text>'}
 if(pose=='clap'){const a=Math.asin(Math.min(1,(50-lx)/21))*180/Math.PI;arms=A(lx,21,a,-22)+A(rx,21,-a,22);fx=`<g class="fx" stroke="#ffd54a" stroke-width="1.6" stroke-linecap="round"><path d="M43 ${sy+11}l-4 -4M50 ${sy+9}v-6M57 ${sy+11}l4 -4"/></g>`}
 const [hb,ho]=hairParts(c,v);
 const shoe=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="7.5" ry="4.5" fill="${c.sh}"${O}/>`;
 let legs;
 if(!sit)legs=`<rect x="37" y="${tT+tH-4}" width="12" height="28" rx="5" fill="${c.p}"${O}/><rect x="51" y="${tT+tH-4}" width="12" height="28" rx="5" fill="${c.p}"${O}/>${shoe(43,117)}${shoe(57,117)}`;
 else if(fr)legs=`<ellipse cx="33" cy="106" rx="22" ry="9" transform="rotate(10 33 106)" fill="${c.p}"${O}/><ellipse cx="67" cy="106" rx="22" ry="9" transform="rotate(-10 67 106)" fill="${c.p}"${O}/>${shoe(43,111)}${shoe(57,111)}`;
 else if(v=='side')legs=`<ellipse cx="58" cy="106" rx="30" ry="9" fill="${c.p}"${O}/>${shoe(84,110)}`;
 else legs=`<ellipse cx="50" cy="106" rx="33" ry="11" fill="${c.p}"${O}/>${shoe(21,111)}${shoe(79,111)}`;
 const body=`<rect x="${50-tw}" y="${tT}" width="${2*tw}" height="${tH}" rx="10" fill="${c.t}"${O}/>`+(fr?`<path d="M44 ${tT}L50 ${tT+7}L56 ${tT}Z" fill="${sk}"/>`:'')+(pose=='win'&&fr?`<circle cx="50" cy="${tT+14}" r="5" fill="#f5b400" stroke="#c88a00"/>`:'');
 const crown=pose=='win'?`<path d="M-12 -23L-14 -36L-6 -29L0 -38L6 -29L14 -36L12 -23Z" fill="#f5b400"${O}/>`:'';
 const T=`<g transform="translate(50 ${hy})">`;
 const g=(sit?`<ellipse cx="50" cy="112" rx="42" ry="10" fill="#6b4423"/>`:'')+T+hb+`</g>`+legs+`<rect x="44" y="${tT-9}" width="12" height="12" rx="4" fill="${sk}"${O}/>`+(back?arms:'')+body+T+ho+`</g>`+extra+(back?'':arms)+T+head(c,v,pose)+crown+`</g>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -6 100 132" class="s-${pose}">${flip?`<g transform="translate(100 0) scale(-1 1)">${g}</g>`:g}${fx}</svg>`}


function view(th){const fx=-Math.cos(th),fy=-Math.sin(th);
 return[fy>.85?'front':fy>.25?'q3':fy>-.25?'side':fy>-.85?'b3':'back',fx<-.05]}

return{sprite,view}})();
const lookC=(p,i)=>{const l=look(p,i);return{s:l.s,h:l.h,t:l.t,p:l.p,sh:"#fff",st:["short","long","bun"][l.st]}};
