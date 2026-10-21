const $=s=>document.querySelector(s);
const shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);

/* Tablar */
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("#nav button").forEach(x=>x.classList.toggle("on",x===b));
  ["t","q","g1","g2"].forEach(id=>$("#"+id).hidden=id!==b.dataset.p);
  if(b.dataset.p==="q")startQuiz();
  if(b.dataset.p!=="g1")stopG1();
});

/* TEST */
const Q=[
["“Besh” qaysi son?",["Miqdor son","Tartib son"],0],
["“Uchinchi” qaysi son?",["Miqdor son","Tartib son"],1],
["Tartib son qaysi savolga javob beradi?",["Nechta?","Nechanchi?","Qancha?"],1],
["Miqdor son qaysi savolga javob beradi?",["Nechanchi?","Nima qildi?","Nechta?"],2],
["“Yetti” soʻzidan tartib son yasang:",["yettinchi","yettiinchi","yettichi"],0],
["“Oʻn” soʻzidan tartib son yasang:",["oʻnnchi","oʻninchi","oʻnchi"],1],
["“Ikkinchi qavatda yashayman” gapida son turi?",["Miqdor son","Tartib son"],1],
["“Beshovimiz bordik” — qaysi miqdor son turi?",["Sanoq","Chama","Jamlovchi"],2],
["“Oʻntacha odam keldi” — qaysi tur?",["Chama","Taqsim","Dona"],0],
["“Ikkitadan daftar oldik” — qaysi tur?",["Sanoq","Taqsim","Jamlovchi"],1]
];
let qi=0,qs=0;
function startQuiz(){qi=0;qs=0;showQ()}
function showQ(){
  const el=$("#q");
  if(qi>=Q.length){
    const p=qs/Q.length;
    el.innerHTML=`<div class="card c"><div class="big">${qs} / ${Q.length}</div><p>${p>=.9?"🏆 Ajoyib!":p>=.6?"👍 Yaxshi!":"📚 Nazariyani qayta koʻring."}</p><button class="btn p" id="qr">Qaytadan</button></div>`;
    $("#qr").onclick=startQuiz;return;
  }
  const [t,o,c]=Q[qi];
  el.innerHTML=`<div class="bar"><i style="width:${qi/Q.length*100}%"></i></div><div class="card"><div class="mu">Savol ${qi+1}/${Q.length}</div><h3>${t}</h3><div id="qo"></div></div>`;
  o.forEach((x,i)=>{
    const b=document.createElement("button");b.className="opt";b.textContent=x;
    b.onclick=()=>{
      const bs=[...document.querySelectorAll("#qo .opt")];
      bs.forEach(y=>y.disabled=true);
      bs[c].classList.add("ok");
      if(i===c)qs++;else b.classList.add("no");
      setTimeout(()=>{qi++;showQ()},900);
    };
    $("#qo").appendChild(b);
  });
}

/* O'YIN 1 */
const M=["uch","yigirma","yuz","ming","oʻn besh","qirq","sakkiz","toʻqqiz","ellik","yetmish"];
const T=["birinchi","ikkinchi","beshinchi","oʻninchi","yigirmanchi","yuzinchi","oltinchi","toʻqqizinchi","uchinchi","yettinchi"];
let tm=null,left=30,sc=0,cur=null,run=false;
function nextW(){const m=Math.random()<.5;cur=m?"m":"t";const a=m?M:T;$("#gw").textContent=a[Math.floor(Math.random()*a.length)]}
function stopG1(){clearInterval(tm);run=false}
$("#gstart").onclick=()=>{stopG1();left=30;sc=0;run=true;$("#gs").textContent=0;$("#gt").textContent=left;$("#tb").style.width="100%";nextW();
  tm=setInterval(()=>{left--;$("#gt").textContent=left;$("#tb").style.width=left/30*100+"%";
    if(left<=0){stopG1();$("#gw").textContent="⏱ Tugadi! Ball: "+sc}},1000)};
function ans(k){if(!run)return;sc+=cur===k?1:-1;if(sc<0)sc=0;$("#gs").textContent=sc;nextW()}
$("#bm").onclick=()=>ans("m");$("#bt").onclick=()=>ans("t");

/* O'YIN 2 */
const P=[["1","bir"],["2","ikki"],["3","uch"],["4","toʻrt"],["5","besh"],["6","olti"]];
let first=null,lock=false,mv=0,done=0;
function initMem(){
  mv=0;done=0;first=null;lock=false;$("#mv").textContent=0;$("#mm").textContent="Raqam va uning soʻzini toping.";
  const cards=shuf(P.flatMap(([n,w],i)=>[{k:i,v:n},{k:i,v:w}]));
  const g=$("#mg");g.innerHTML="";
  cards.forEach(c=>{
    const b=document.createElement("button");b.className="mc";b.textContent="?";
    b.onclick=()=>{
      if(lock||b.classList.contains("f")||b.classList.contains("d"))return;
      b.classList.add("f");b.textContent=c.v;
      if(!first){first={b,c};return}
      mv++;$("#mv").textContent=mv;
      if(first.c.k===c.k){
        first.b.classList.add("d");b.classList.add("d");first=null;done++;
        if(done===P.length)$("#mm").textContent="🎉 Barakalla! "+mv+" yurishda topdingiz.";
      }else{
        lock=true;const f=first.b;first=null;
        setTimeout(()=>{[f,b].forEach(x=>{x.classList.remove("f");x.textContent="?"});lock=false},800);
      }
    };
    g.appendChild(b);
  });
}
$("#mr").onclick=initMem;initMem();