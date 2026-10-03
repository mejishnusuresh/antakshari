// Small helpers
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const okL=c=>typeof c==="string"&&c.length>0&&c.length<=8&&/^[\p{L}\p{M}]+$/u.test(c);
const seg=t=>{try{return Array.from(new Intl.Segmenter("ml",{granularity:"grapheme"}).segment(t),x=>x.segment)}catch(e){return Array.from(t)}};
const lastLetter=t=>{const g=seg(String(t).trim().replace(/[^\p{L}\p{M}]/gu,""));return g[g.length-1]||""};
 
