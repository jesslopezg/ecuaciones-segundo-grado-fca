const topics={
 identify:"Identificar a, b y c",
 factor:"Factorización",
 formula:"Fórmula general",
 discriminant:"Discriminante",
 business:"Aplicación a negocios"
};

const state={
 mode:"practice", current:null, attempted:0, correct:0, streak:0, score:0,
 challengeIndex:0, results:[],
 progress:JSON.parse(localStorage.getItem("quadProgress")||"{}")
};
Object.keys(topics).forEach(k=>{if(!state.progress[k])state.progress[k]={attempted:0,correct:0}});

const $=id=>document.getElementById(id);
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const choice=a=>a[rnd(0,a.length-1)];
const round=(n,d=2)=>Number(n.toFixed(d));

function save(){localStorage.setItem("quadProgress",JSON.stringify(state.progress))}
function fmt(a,b,c){
 let s=`${a===1?"":a===-1?"-":a}x²`;
 if(b!==0)s+=` ${b>0?"+":"-"} ${Math.abs(b)===1?"":Math.abs(b)}x`;
 if(c!==0)s+=` ${c>0?"+":"-"} ${Math.abs(c)}`;
 return s+" = 0";
}
function rootsFrom(r1,r2,a=1){
 const b=-a*(r1+r2), c=a*r1*r2;
 return {a,b,c};
}
function solve(a,b,c){
 const D=b*b-4*a*c;
 if(D<0)return {D,roots:[]};
 const s=Math.sqrt(D);
 return {D,roots:[(-b+s)/(2*a),(-b-s)/(2*a)]};
}
function genIdentify(){
 const a=choice([-3,-2,1,2,3]), b=choice([-8,-5,-3,4,6,9]), c=choice([-12,-6,-2,3,7,10]);
 return {
  title:"Identifica los coeficientes",
  text:"Observa la ecuación y escribe correctamente los valores de a, b y c.",
  equation:fmt(a,b,c), kind:"abc", answers:[a,b,c], tolerance:0,
  hint:"Compara con la forma ax² + bx + c = 0.",
  solution:`a = ${a}, b = ${b}, c = ${c}.`
 };
}
function genFactor(){
 let r1=choice([-6,-5,-4,-3,-2,1,2,3,4,5,6]), r2=choice([-6,-4,-2,1,2,3,5,7]);
 if(r1===r2)r2+=1;
 const {a,b,c}=rootsFrom(r1,r2,1);
 return {
  title:"Resuelve por factorización",
  text:"Encuentra las dos soluciones reales de la ecuación.",
  equation:fmt(a,b,c), kind:"roots", answers:[r1,r2], tolerance:.01,
  hint:`Busca dos números que multiplicados den ${c} y sumados den ${b}.`,
  solution:`La factorización es (x ${r1<0?"+":"-"} ${Math.abs(r1)})(x ${r2<0?"+":"-"} ${Math.abs(r2)}) = 0. Por tanto, x = ${r1} y x = ${r2}.`
 };
}
function genFormula(d){
 let a=choice([1,2,3]), r1=choice([-7,-4,-2,1,2,3,5]), r2=choice([-5,-1,2,4,6]);
 if(d==="advanced")a=choice([2,3,4]);
 const q=rootsFrom(r1,r2,a);
 return {
  title:"Aplica la fórmula general",
  text:"Resuelve la ecuación utilizando la fórmula general.",
  equation:fmt(q.a,q.b,q.c), kind:"roots", answers:[r1,r2], tolerance:.02,
  hint:`Identifica a=${q.a}, b=${q.b}, c=${q.c} y calcula primero el discriminante.`,
  solution:`Δ = ${q.b}² - 4(${q.a})(${q.c}) = ${q.b*q.b-4*q.a*q.c}. Las soluciones son x = ${r1} y x = ${r2}.`
 };
}
function genDiscriminant(){
 const a=choice([1,2,3]), b=choice([-8,-5,-2,3,6,9]), c=choice([-10,-4,2,5,8]);
 const D=b*b-4*a*c;
 return {
  title:"Calcula el discriminante",
  text:"Calcula Δ y determina cuántas soluciones reales tiene la ecuación.",
  equation:fmt(a,b,c), kind:"disc", answers:[D,D>0?2:D===0?1:0], tolerance:0,
  hint:"Usa Δ = b² - 4ac.",
  solution:`Δ = ${b}² - 4(${a})(${c}) = ${D}. Por tanto, tiene ${D>0?"dos soluciones reales":D===0?"una solución real doble":"ninguna solución real"}.`
 };
}
function genBusiness(){
 const type=choice(["profit","revenue","area"]);
 if(type==="profit"){
  const r1=choice([10,15,20]), r2=choice([40,50,60]), a=-1;
  const b=-a*(r1+r2), c=a*r1*r2;
  return {
   title:"Utilidad y punto de equilibrio",
   text:"La utilidad mensual de una empresa se modela con la función mostrada. ¿Para qué niveles de producción la utilidad es igual a cero?",
   equation:`U(x) = ${a}x² + ${b}x ${c<0?"-":"+"} ${Math.abs(c)}`,
   kind:"roots",answers:[r1,r2],tolerance:.02,
   hint:"Iguala U(x) a cero y resuelve la ecuación cuadrática.",
   solution:`Los puntos de equilibrio ocurren en x = ${r1} y x = ${r2}. En esos niveles de producción la utilidad es cero.`
  };
 }
 if(type==="revenue"){
  const r1=choice([5,10,12]), r2=choice([30,40,45]);
  const q=rootsFrom(r1,r2,-2);
  return {
   title:"Ingresos y nivel de ventas",
   text:"Una función de ingreso neto se hace cero en dos niveles de ventas. Encuentra esos valores e interprétalos como niveles donde el resultado neto es nulo.",
   equation:`I(x) = ${q.a}x² ${q.b>=0?"+":"-"} ${Math.abs(q.b)}x ${q.c>=0?"+":"-"} ${Math.abs(q.c)}`,
   kind:"roots",answers:[r1,r2],tolerance:.02,
   hint:"Iguala la función a cero y usa factorización o fórmula general.",
   solution:`I(x)=0 cuando x = ${r1} o x = ${r2}. Son dos niveles de ventas donde el ingreso neto del modelo es cero.`
  };
 }
 const width=choice([6,8,10]), extra=choice([4,5,6]);
 const area=width*(width+extra);
 return {
  title:"Dimensiones de un espacio comercial",
  text:`Un local rectangular tiene un largo ${extra} metros mayor que su ancho y un área de ${area} m². ¿Cuál es el ancho del local?`,
  equation:`x(x + ${extra}) = ${area}`,
  kind:"single",answers:[width],tolerance:.02,
  hint:`Expande: x² + ${extra}x - ${area} = 0. Después resuelve y descarta la raíz negativa.`,
  solution:`La ecuación es x² + ${extra}x - ${area}=0. La solución positiva es x = ${width} m. La raíz negativa no tiene sentido como longitud.`
 };
}

function generate(){
 const sel=$("topic").value;
 const topic=sel==="mixed"?choice(Object.keys(topics)):sel;
 let e;
 if(topic==="identify")e=genIdentify();
 if(topic==="factor")e=genFactor();
 if(topic==="formula")e=genFormula($("difficulty").value);
 if(topic==="discriminant")e=genDiscriminant();
 if(topic==="business")e=genBusiness();
 state.current={...e,topic,difficulty:$("difficulty").value,answered:false};
 render();
}

function render(){
 const e=state.current;
 $("topicBadge").textContent=topics[e.topic];
 $("difficultyBadge").textContent=e.difficulty;
 $("title").textContent=e.title;
 $("problem").textContent=e.text;
 $("equation").textContent=e.equation;
 $("feedback").className="feedback hidden";
 $("hintBox").className="helper hidden";
 $("solutionBox").className="helper hidden";
 $("hintBox").textContent=e.hint;
 $("solutionBox").textContent=e.solution;
 $("hintBtn").classList.toggle("hidden",state.mode==="exam");
 $("solutionBtn").classList.toggle("hidden",state.mode==="exam");
 $("progressText").textContent=state.mode==="practice"?"":`${Math.min(state.challengeIndex+1,10)}/10`;

 let html="";
 if(e.kind==="abc"){
  html='<div class="input-grid">'+["a","b","c"].map((n,i)=>`<div class="input-wrap"><label>${n}</label><input class="answer-input" id="ans${i}" type="number"></div>`).join("")+"</div>";
 } else if(e.kind==="roots"){
  html='<div class="input-grid two"><div class="input-wrap"><label>x₁</label><input class="answer-input" id="ans0" type="number" step="any"></div><div class="input-wrap"><label>x₂</label><input class="answer-input" id="ans1" type="number" step="any"></div></div>';
 } else if(e.kind==="disc"){
  html='<div class="input-grid two"><div class="input-wrap"><label>Δ</label><input class="answer-input" id="ans0" type="number"></div><div class="input-wrap"><label>Número de soluciones reales</label><input class="answer-input" id="ans1" type="number"></div></div>';
 } else {
  html='<div class="input-grid"><div class="input-wrap"><label>x</label><input class="answer-input" id="ans0" type="number" step="any"></div></div>';
 }
 $("dynamicInputs").innerHTML=html;
 updateStats();
}

function check(){
 const e=state.current;if(!e||e.answered)return;
 const vals=e.answers.map((_,i)=>parseFloat($("ans"+i).value));
 if(vals.some(Number.isNaN)){feedback("Completa todas las respuestas.","bad");return}
 let ok=false;
 if(e.kind==="roots"){
  const a=[...vals].sort((x,y)=>x-y), b=[...e.answers].sort((x,y)=>x-y);
  ok=Math.abs(a[0]-b[0])<=e.tolerance&&Math.abs(a[1]-b[1])<=e.tolerance;
 }else{
  ok=vals.every((v,i)=>Math.abs(v-e.answers[i])<=e.tolerance);
 }
 e.answered=true;state.attempted++;state.progress[e.topic].attempted++;
 if(ok){state.correct++;state.streak++;state.score+=state.mode==="exam"?15:10;state.progress[e.topic].correct++;feedback("¡Correcto!","ok")}
 else{state.streak=0;feedback("Revisa el procedimiento. La solución aparece en el botón de solución cuando esté disponible.","bad")}
 state.results.push({topic:e.topic,ok});save();updateStats();renderProgress();
 if(state.mode!=="practice"){state.challengeIndex++;if(state.challengeIndex>=10)setTimeout(showResults,250)}
}
function feedback(t,type){$("feedback").textContent=t;$("feedback").className="feedback "+type}
function updateStats(){$("score").textContent=state.score;$("streak").textContent=state.streak;$("accuracy").textContent=state.attempted?Math.round(state.correct/state.attempted*100)+"%":"0%"}
function renderProgress(){
 $("progressGrid").innerHTML=Object.entries(topics).map(([k,n])=>{const p=state.progress[k],pc=p.attempted?Math.round(p.correct/p.attempted*100):0;return `<div class="progress-item"><b>${n}</b><span>${p.correct}/${p.attempted} · ${pc}%</span><div class="bar"><i style="width:${pc}%"></i></div></div>`}).join("");
}
function startMode(m){state.mode=m;state.challengeIndex=0;state.results=[];document.querySelectorAll(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===m));generate()}
function showResults(){
 const c=state.results.filter(x=>x.ok).length,t=state.results.length;
 $("modalTitle").textContent=state.mode==="exam"?"Resultado del examen":"Resultado del reto";
 $("modalSummary").textContent=`Obtuviste ${c} de ${t} respuestas correctas (${Math.round(c/t*100)}%).`;
 const map={};Object.keys(topics).forEach(k=>map[k]={a:0,c:0});state.results.forEach(r=>{map[r.topic].a++;if(r.ok)map[r.topic].c++});
 $("modalBreakdown").innerHTML=Object.entries(map).filter(([k,v])=>v.a).map(([k,v])=>`<p><b>${topics[k]}:</b> ${v.c}/${v.a}</p>`).join("");
 $("modal").classList.remove("hidden");
}

document.querySelectorAll(".mode").forEach(b=>b.addEventListener("click",()=>startMode(b.dataset.mode)));
$("newBtn").onclick=generate;$("checkBtn").onclick=check;$("nextBtn").onclick=()=>{if(state.mode==="practice"||state.challengeIndex<10)generate()};
$("hintBtn").onclick=()=>$("hintBox").classList.toggle("hidden");
$("solutionBtn").onclick=()=>$("solutionBox").classList.toggle("hidden");
$("topic").onchange=generate;$("difficulty").onchange=generate;
$("closeModal").onclick=()=>{$("modal").classList.add("hidden");startMode("practice")};
$("resetBtn").onclick=()=>{if(confirm("¿Reiniciar todo el progreso?")){Object.keys(topics).forEach(k=>state.progress[k]={attempted:0,correct:0});save();renderProgress()}};

renderProgress();generate();