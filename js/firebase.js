// Firebase (auth + Firestore) exposed as window.AK. Needs http(s), not file://
const CFG=APP_CONFIG.firebase;
if(!CFG.apiKey.startsWith("YOUR")){
  try{
    const b="https://www.gstatic.com/firebasejs/10.12.2/";
    const [{initializeApp},A,F]=await Promise.all([import(b+"firebase-app.js"),import(b+"firebase-auth.js"),import(b+"firebase-firestore.js")]);
    const app=initializeApp(CFG),auth=A.getAuth(app),db=F.getFirestore(app);
    const uid=()=>auth.currentUser.uid;
    let FC=null;
    const ADM_EM=APP_CONFIG.adminEmail.toLowerCase();
    const isA=()=>{const u=auth.currentUser;return !!(u&&u.emailVerified&&(u.email||"").toLowerCase()===ADM_EM)};
    const need=()=>{if(!isA())throw new Error("Admin access only")};
    window.AK={
      signIn:()=>A.signInWithPopup(auth,new A.GoogleAuthProvider()),
      signOut:()=>A.signOut(auth),
      async save(r){
        const ref=F.doc(db,"users",uid()),snap=await F.getDoc(ref),best=Math.max(snap.exists()?snap.data().best||0:0,r.points);
        await F.setDoc(ref,{name:auth.currentUser.displayName||"Singer",updated:F.serverTimestamp(),best,games:F.increment(1),wins:F.increment(r.won?1:0),points:F.increment(r.points),approved:F.increment(r.w||0)},{merge:true});
        await F.addDoc(F.collection(db,"history"),{uid:uid(),date:F.serverTimestamp(),code:r.code,players:r.players,rank:r.rank,points:r.points,won:r.won,badges:r.badges,board:r.board});
      },
      async stats(){const s=await F.getDoc(F.doc(db,"users",uid()));return s.exists()?s.data():{}},
      async history(){const q=await F.getDocs(F.query(F.collection(db,"history"),F.where("uid","==",uid()),F.limit(50)));return q.docs.map(d=>d.data()).sort((a,b)=>(b.date?.seconds||0)-(a.date?.seconds||0))},
      suggest:q=>F.addDoc(F.collection(db,"suggestions"),{text:String(q.text||"").slice(0,600),name:String(q.name||"").slice(0,40),uid:auth.currentUser?auth.currentUser.uid:"",ts:Date.now(),at:F.serverTimestamp()}),
      report:r=>F.addDoc(F.collection(db,"reports"),{from:uid(),fromName:auth.currentUser.displayName||"",to:r.to||"",toName:r.toName||"",room:r.room||"",ts:Date.now()}),
      savePic:d=>F.setDoc(F.doc(db,"users",uid()),{pic:d},{merge:true}),
      saveProfile:p=>F.setDoc(F.doc(db,"users",uid()),{gd:p.gd,dc:p.dc},{merge:true}),
      beat:async()=>{FC=FC||uid().slice(0,8).toUpperCase();await F.setDoc(F.doc(db,"users",uid()),{name:auth.currentUser.displayName||"Singer",nl:(auth.currentUser.displayName||"").toLowerCase(),fc:FC,seen:Date.now()},{merge:true});return FC},
      async addByCode(c){const q=await F.getDocs(F.query(F.collection(db,"users"),F.where("fc","==",c),F.limit(1)));if(q.empty||q.docs[0].id===uid())throw new Error("nf");const t=q.docs[0];await F.setDoc(F.doc(db,"reqs",uid()+"_"+t.id),{from:uid(),to:t.id,fromName:auth.currentUser.displayName||"Singer",status:"pending",ts:Date.now()})},
      async addById(t,name){if(!t||t===uid())throw new Error("nf");await F.setDoc(F.doc(db,"reqs",uid()+"_"+t),{from:uid(),to:t,fromName:auth.currentUser.displayName||"Singer",toName:name||"",status:"pending",ts:Date.now()})},
      async reqs(){const [a,b]=await Promise.all([F.getDocs(F.query(F.collection(db,"reqs"),F.where("to","==",uid()))),F.getDocs(F.query(F.collection(db,"reqs"),F.where("from","==",uid())))]);return [...a.docs,...b.docs].map(d=>({id:d.id,...d.data()}))},
      async accept(id,r){await F.updateDoc(F.doc(db,"reqs",id),{status:"accepted"});await F.setDoc(F.doc(db,"users",uid()),{friends:F.arrayUnion(r.from)},{merge:true})},
      async reconcile(){const q=await F.getDocs(F.query(F.collection(db,"reqs"),F.where("from","==",uid()),F.where("status","==","accepted")));const ids=q.docs.map(d=>d.data().to);if(ids.length)await F.setDoc(F.doc(db,"users",uid()),{friends:F.arrayUnion(...ids)},{merge:true})},
      async friends(){const s=await F.getDoc(F.doc(db,"users",uid()));const ids=s.data()?.friends||[];const ds=await Promise.all(ids.map(i=>F.getDoc(F.doc(db,"users",i))));return ds.filter(d=>d.exists()).map(d=>({uid:d.id,...d.data()}))},
      invite:(to,code)=>F.addDoc(F.collection(db,"invites"),{to,from:uid(),fromName:auth.currentUser.displayName||"Singer",code,ts:Date.now()}),
      onInvite(cb){F.onSnapshot(F.query(F.collection(db,"invites"),F.where("to","==",uid())),s=>s.docChanges().forEach(c=>{if(c.type==="added"){const d=c.doc.data();if(Date.now()-d.ts<600000)cb(d,c.doc.id)}}))},
      delInvite:id=>F.deleteDoc(F.doc(db,"invites",id)),
      adm:{
        info:{projectId:CFG.projectId,authDomain:CFG.authDomain,sdk:"10.12.2"},
        async list(c,ob){need();const q=ob?F.query(F.collection(db,c),F.orderBy(ob,"desc"),F.limit(500)):F.query(F.collection(db,c),F.limit(500));return (await F.getDocs(q)).docs.map(d=>({id:d.id,...d.data()}))},
        async counts(){need();const n=["users","history","groups","suggestions","reports","reqs","invites"];const r=await Promise.all(n.map(async c=>{try{return (await F.getCountFromServer(F.collection(db,c))).data().count}catch(e){return null}}));return Object.fromEntries(n.map((c,i)=>[c,r[i]]))},
        del:(c,id)=>{need();return F.deleteDoc(F.doc(db,c,id))},
        ban:(id,b)=>{need();return F.setDoc(F.doc(db,"users",id),{banned:!!b},{merge:true})},
        reset:id=>{need();return F.setDoc(F.doc(db,"users",id),{games:0,wins:0,points:0,best:0,approved:0},{merge:true})}
      },
      pubGroup:g=>F.setDoc(F.doc(db,"groups",g.code),{code:g.code,name:String(g.name||"Group").slice(0,24),host:String(g.host||"").slice(0,14),count:g.count|0,max:g.max|0,ph:g.ph,ts:Date.now()}),
      delGroup:c=>F.deleteDoc(F.doc(db,"groups",c)),
      async groups(){const q=await F.getDocs(F.query(F.collection(db,"groups"),F.limit(50)));return q.docs.map(d=>d.data())},
      async board(k){const q=await F.getDocs(F.query(F.collection(db,"users"),F.orderBy(k,"desc"),F.limit(20)));return q.docs.map(d=>d.data())}
    };
    A.onAuthStateChanged(auth,u=>window.akAuth&&window.akAuth(u?{name:u.displayName,uid:u.uid,photo:u.photoURL,email:u.email||"",verified:!!u.emailVerified}:null));
  }catch(e){console.warn("Firebase unavailable",e)}
}
