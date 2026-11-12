'use strict';
const $=(s,e=document)=>e.querySelector(s),
H=(t,c,p,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;if(p)p.append(e);return e},
S=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch{return d}},
W=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const desk=$('#desk'),tasks=$('#tasks'),start=$('#start'),menu=$('#menu');
let z=10,fs=S('fs',null)||{Users:{Nutzer:{Dokumente:{'hallo.txt':'Willkommen im Web-Desktop.'},Bilder:{},Desktop:{}}}};
const saveFs=()=>W('fs',fs),cfg=S('cfg',{ac:'#4cc2ff'}),wins=[];try{const u=fs.Users.Nutzer;if(!u.Downloads)u.Downloads={}}catch{}
const applyCfg=()=>document.documentElement.style.setProperty('--ac',cfg.ac);applyCfg();
const isD=v=>typeof v==='object',
ci=(d,k)=>Object.keys(d).find(x=>x.toLowerCase()===k.toLowerCase()),
nd=p=>p.reduce((a,k)=>a&&isD(a)?a[k]:undefined,fs);
function resolve(cwd,arg){let p=/^[a-z]:/i.test(arg)?[]:[...cwd];for(const s of arg.replace(/^[a-z]:/i,'').split(/[\\/]/).filter(Boolean)){if(s==='..')p.pop();else if(s!=='.'){const d=nd(p),k=d&&isD(d)&&ci(d,s);if(!k)return null;p.push(k)}}return p}
function onOpen(el,fn){let t=0;el.addEventListener('dblclick',fn);el.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse'){const n=Date.now();if(n-t<400){t=0;fn(e)}else t=n}})}
function longPress(el,fn){let t,sx,sy;el.addEventListener('contextmenu',e=>{e.preventDefault();fn(e.clientX,e.clientY,e)});
el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||e.target.closest('.win'))return;sx=e.clientX;sy=e.clientY;clearTimeout(t);t=setTimeout(()=>fn(sx,sy,e),550)});
['pointerup','pointercancel'].forEach(n=>el.addEventListener(n,()=>clearTimeout(t)));
el.addEventListener('pointermove',e=>{if(Math.hypot(e.clientX-sx,e.clientY-sy)>10)clearTimeout(t)})}
function showMenu(x,y,items){menu.innerHTML='';items.forEach(([l,f])=>{const b=H('button','',menu,l);b.onclick=()=>{hideMenu();f()}});menu.style.display='block';menu.style.left=Math.max(0,Math.min(x,innerWidth-menu.offsetWidth-4))+'px';menu.style.top=Math.max(0,Math.min(y,innerHeight-menu.offsetHeight-52))+'px'}
const hideMenu=()=>menu.style.display='none';
document.addEventListener('pointerdown',e=>{if(!menu.contains(e.target))hideMenu();if(!start.contains(e.target)&&!e.target.closest('#sbtn'))start.classList.remove('on')});
const focus=o=>{o.w.classList.remove('hid');o.w.style.zIndex=++z;wins.forEach(x=>x.btn.classList.toggle('act',x===o))};
function openApp(id){const a=apps[id],w=H('div','win',desk),n=wins.length%6,ww=Math.min(a.w||520,innerWidth-8);
w.style.cssText=`left:${Math.max(0,Math.min(40+n*28,innerWidth-ww-4))}px;top:${20+n*28}px;width:${ww}px;height:${Math.min(a.h||380,innerHeight-60)}px`;
const tb=H('div','tb',w);H('span','',tb,a.i+' '+a.t);const bs=H('span','bt',tb),body=H('div','body',w),
o={w,id,t:a.t,btn:H('button','tbtn',tasks,a.i+' '+a.t)};
const mk=(c,f)=>{const b=H('button','',bs,c);b.onpointerdown=e=>e.stopPropagation();b.onclick=f};
mk('–',()=>{w.classList.add('hid');o.btn.classList.remove('act')});mk('▢',()=>w.classList.toggle('max'));mk('✕',()=>o.close());
o.close=()=>{o.onclose&&o.onclose();w.remove();o.btn.remove();wins.splice(wins.indexOf(o),1);const t=wins.filter(x=>!x.w.classList.contains('hid')).pop();t&&focus(t)};
o.btn.onclick=()=>{if(w.classList.contains('hid')||!o.btn.classList.contains('act'))focus(o);else{w.classList.add('hid');o.btn.classList.remove('act')}};
w.addEventListener('pointerdown',()=>focus(o));
tb.addEventListener('pointerdown',e=>{if(w.classList.contains('max'))return;const r=w.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top;tb.setPointerCapture(e.pointerId);
const mv=ev=>{w.style.left=Math.max(80-r.width,Math.min(innerWidth-80,ev.clientX-dx))+'px';w.style.top=Math.max(0,Math.min(innerHeight-90,ev.clientY-dy))+'px'};
const up=()=>{tb.removeEventListener('pointermove',mv);tb.removeEventListener('pointerup',up);tb.removeEventListener('pointercancel',up)};
tb.addEventListener('pointermove',mv);tb.addEventListener('pointerup',up);tb.addEventListener('pointercancel',up)});
wins.push(o);a.b(body,o);focus(o);start.classList.remove('on');return o}

function saveDl(name,text){const d=nd(['Users','Nutzer']);d.Downloads=d.Downloads||{};const n=name.replace(/[\\/:*?"<>|]/g,'_');let k=n,i=1;while(d.Downloads[k]!==undefined)k=n.replace(/(\.[^.]*)?$/,` (${i++})$1`);d.Downloads[k]=text;saveFs()}
async function dlFile(name,v){const bl=v.startsWith('data:')?await (await fetch(v)).blob():new Blob([v],{type:'text/plain'}),a=H('a','',document.body);a.href=URL.createObjectURL(bl);a.download=name;a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
const isUrl=x=>/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(x);
/* Matrix */
const M={on:false,boost:false},cv=$('#mx'),cx=cv.getContext('2d');let cols=[],raf;
const rb=()=>Math.random()<.5?'0':'1';
function sizeMx(){cv.width=innerWidth;cv.height=innerHeight;cols=Array.from({length:Math.floor(innerWidth/16)},()=>({y:-Math.random()*30,v:.15+Math.random()*.5,ch:Array.from({length:22},rb)}))}
function loop(){cx.clearRect(0,0,cv.width,cv.height);cx.font='16px monospace';const b=M.boost;
cols.forEach((c,i)=>{if(!b&&i%2)return;c.y+=c.v*(b?1.5:1);if(Math.random()<.1)c.ch[Math.floor(Math.random()*22)]=rb();
for(let k=0;k<22;k++){const y=(c.y-k)*16;if(y<0||y>cv.height+16)continue;cx.fillStyle=k?`rgba(0,255,70,${(1-k/22)*(b?1:.7)})`:'#cfffd6';cx.shadowColor='#0f4';cx.shadowBlur=k?(b?6:0):14;cx.fillText(c.ch[k],i*16,y)}
if((c.y-22)*16>cv.height){c.y=-Math.random()*20;c.v=.15+Math.random()*.5}});raf=requestAnimationFrame(loop)}
const startMatrix=()=>{if(M.on)return;M.on=true;cv.style.display='block';sizeMx();loop()},
stopMatrix=()=>{M.on=false;cancelAnimationFrame(raf);cv.style.display='none'};
addEventListener('resize',()=>M.on&&sizeMx());addEventListener('keydown',e=>e.key==='Escape'&&M.on&&stopMatrix());
/* Apps */
const apps={
terminal:{t:'Terminal',i:'⌨️',w:640,h:400,b(b,o){b.classList.add('term');const out=H('div','',b),ln=H('div','ln',b),pr=H('span','',ln),inp=H('input','',ln);
inp.autocapitalize='off';inp.autocomplete='off';inp.spellcheck=false;let cwd=['Users','Nutzer'],hist=[],hi=0;
const P=()=>'C:\\'+cwd.join('\\')+'>',up=()=>pr.textContent=P(),print=t=>{H('div','',out,t);b.scrollTop=1e9};up();
print('Web-Desktop Terminal – "help" zeigt die Befehle.\n');
const list=(p,d,rec)=>{print(' Verzeichnis von C:\\'+p.join('\\'));Object.entries(d).forEach(([k,v])=>print((isD(v)?'<DIR>    ':String(v.length).padStart(7)+'  ')+k));print('');if(rec)Object.entries(d).forEach(([k,v])=>isD(v)&&list([...p,k],v,1))};
const tree=(d,ind)=>Object.entries(d).forEach(([k,v])=>{print(ind+(isD(v)?'+-- ':'|-- ')+k);isD(v)&&tree(v,ind+'    ')});
const C={help(){print('help dir [/s] cd [..] cls color a|c|f echo ver date time tree mkdir type exit whoami hostname systeminfo ipconfig ping')},
dir(a){list(cwd,nd(cwd),/\/s/i.test(a))},
cd(a){if(!a)return print(P().slice(0,-1));const p=resolve(cwd,a);if(!p||!isD(nd(p)))return print('Das System kann den angegebenen Pfad nicht finden.');cwd=p;up()},
cls(){out.innerHTML=''},
color(a){const m={a:'#2f2',c:'#f55',f:'#fff'}[a.trim().toLowerCase()];if(!m)return print('Unterstützt: color a, color c, color f');b.style.color=m;inp.style.color=m;M.boost=a.trim().toLowerCase()==='a'},
echo(a){print(a)},ver(){print('Web-Desktop [Version 1.0] (Browser-Simulation, kein echtes Windows)')},
date(){print(new Date().toLocaleDateString('de-DE'))},time(){print(new Date().toLocaleTimeString('de-DE'))},
tree(){print('C:\\'+cwd.join('\\'));tree(nd(cwd),'')},
mkdir(a){if(!a||/[\\/:*?"<>|]/.test(a))return print('Ungültiger Ordnername.');const d=nd(cwd);if(ci(d,a))return print('Ein Unterverzeichnis oder eine Datei existiert bereits.');d[a]={};saveFs()},
type(a){const p=resolve(cwd,a),v=p&&nd(p);if(v==null||isD(v))return print('Das System kann die angegebene Datei nicht finden.');print(v)},
exit(){o.close()},whoami(){print('web-desktop\\nutzer')},hostname(){print(location.hostname||'localhost')},
systeminfo(){print(['Browser:    '+navigator.userAgent,'Sprache:    '+navigator.language,'CPU-Kerne:  '+(navigator.hardwareConcurrency||'unbekannt'),'RAM (grob): '+(navigator.deviceMemory?navigator.deviceMemory+' GB':'vom Browser nicht verfügbar'),'Bildschirm: '+screen.width+'x'+screen.height,'Online:     '+(navigator.onLine?'ja':'nein')].join('\n'))},
ipconfig(){print('Nicht möglich: Browser dürfen die Netzwerkadapter und IP-Adressen des Geräts nicht auslesen.')},
ping(){print('Nicht möglich: Browser können keine ICMP-Pakete senden. Es wird kein Ergebnis erfunden.')},
'01hacker01'(){startMatrix()},stopmatrix(){stopMatrix()}};
const run=l=>{const m=l.match(/^(\S+)\s*(.*)$/),c=m[1].toLowerCase();Object.hasOwn(C,c)?C[c](m[2]):print("'"+m[1]+"' wird nicht erkannt. 'help' zeigt die Befehle.")};
inp.onkeydown=e=>{if(e.key==='Enter'){const l=inp.value;print(P()+l);inp.value='';if(l.trim()){hist.push(l);hi=hist.length;run(l.trim())}}
else if(e.key==='ArrowUp'){hi=Math.max(0,hi-1);inp.value=hist[hi]||'';e.preventDefault()}else if(e.key==='ArrowDown'){hi=Math.min(hist.length,hi+1);inp.value=hist[hi]||'';e.preventDefault()}};
b.onclick=()=>inp.focus();setTimeout(()=>inp.focus(),50)}},
notes:{t:'Notizen',i:'📝',w:600,h:400,b(b){let ns=S('notes',[]),cur=null;b.classList.add('notes');
const side=H('div','side',b),q=H('input','',side),add=H('button','',side,'+ Neue Notiz'),list=H('div','',side),ed=H('div','ed',b),ti=H('input','',ed),tx=H('textarea','',ed),inf=H('small','',ed),del=H('button','',ed,'Löschen');
q.placeholder='Suchen…';ti.placeholder='Titel';const save=()=>W('notes',ns),stamp=()=>inf.textContent=cur?'Zuletzt bearbeitet: '+new Date(cur.d).toLocaleString('de-DE'):'';
const draw=()=>{list.innerHTML='';ns.filter(n=>(n.t+n.c).toLowerCase().includes(q.value.toLowerCase())).sort((x,y)=>y.d-x.d).forEach(n=>{const e=H('div','it'+(n===cur?' sel':''),list,n.t||'Ohne Titel');e.onclick=()=>{cur=n;load();draw()}})};
const load=()=>{ti.value=cur?cur.t:'';tx.value=cur?cur.c:'';ti.disabled=tx.disabled=del.disabled=!cur;stamp()};
const upd=()=>{if(!cur)return;cur.t=ti.value;cur.c=tx.value;cur.d=Date.now();save();stamp();draw()};
ti.oninput=tx.oninput=upd;q.oninput=draw;add.onclick=()=>{cur={t:'',c:'',d:Date.now()};ns.push(cur);save();load();draw();ti.focus()};
del.onclick=()=>{ns=ns.filter(n=>n!==cur);cur=null;save();load();draw()};load();draw()}},
explorer:{t:'Explorer',i:'📁',w:580,h:400,b(b){b.classList.add('expl');let p=['Users','Nutzer'],sel=null;const bar=H('div','bar',b),up=H('button','',bar,'↰'),pa=H('span','',bar),q=H('input','',bar),bar2=H('div','bar',b),dl=H('button','',bar2,'⬇ Herunterladen'),ad=H('button','',bar2,'＋ Datei hinzufügen'),fi=H('input','',bar2),ls=H('div','ls',b),inf=H('small','',b);
fi.type='file';fi.multiple=true;fi.style.display='none';q.placeholder='Suchen…';
const find=(d,path,s,r)=>{Object.entries(d).forEach(([k,v])=>{if(k.toLowerCase().includes(s))r.push([...path,k]);isD(v)&&find(v,[...path,k],s,r)});return r};
const draw=()=>{ls.innerHTML='';pa.textContent='C:\\'+p.join('\\');const s=q.value.trim().toLowerCase(),items=s?find(fs,[],s,[]):Object.keys(nd(p)).map(k=>[...p,k]);
if(!items.length)H('div','',ls,'Keine Einträge.');items.forEach(ip=>{const v=nd(ip),e=H('div','',ls,(isD(v)?'📁 ':'📄 ')+(s?'C:\\'+ip.join('\\'):ip[ip.length-1]));
e.onclick=()=>{sel=ip;[...ls.children].forEach(c=>c.classList.remove('sel'));e.classList.add('sel');inf.textContent=isD(v)?'Ordner · '+Object.keys(v).length+' Elemente':'Datei · '+(v.startsWith('data:')?Math.round(v.length*.75/1024)+' KB':v.length+' Zeichen')};
onOpen(e,()=>{if(isD(v)){p=ip;q.value='';sel=null;draw()}else inf.textContent=v.startsWith('data:')?'Binärdatei/Import – mit „⬇ Herunterladen“ speichern.':'Inhalt: '+v.slice(0,400)})})};
dl.onclick=()=>{const v=sel&&nd(sel);if(v==null||isD(v)){inf.textContent='Erst eine Datei antippen.';return}dlFile(sel[sel.length-1],v)};
ad.onclick=()=>fi.click();
fi.onchange=()=>{[...fi.files].forEach(f=>{if(f.size>1.5e6){inf.textContent=f.name+': zu groß (max. 1,5 MB, Browser-Speicher ist begrenzt).';return}const r=new FileReader();r.onload=()=>{nd(p)[f.name]=r.result;saveFs();draw()};r.readAsDataURL(f)});fi.value=''};
up.onclick=()=>{p.pop();q.value='';draw()};q.oninput=draw;draw()}},
browser:{t:'Browser',i:'🌐',w:660,h:440,b(b){const bar=H('div','bar',b),bk=H('button','',bar,'◀'),hm=H('button','',bar,'🏠'),u=H('input','',bar),go=H('button','',bar,'Los'),ex=H('button','',bar,'↗ Neuer Tab'),view=H('div','view',b),hist=[];
u.placeholder='Suchbegriff oder Adresse';u.style.cssText='flex:1;width:auto;min-width:0';
const link=(p,t,h)=>{const a=H('a','',p,t);a.href=h;a.target='_blank';a.rel='noopener'},
home=()=>{u.value='';view.innerHTML='';H('div','',view,'Gib einen Suchbegriff ein (Ergebnisse aus Wikipedia) oder eine Adresse. Google, DuckDuckGo und Bing lassen sich nicht einbetten und öffnen sich über „↗ Neuer Tab“.')},
embed=url=>{u.value=url;view.innerHTML='';H('small','',view,'Bleibt die Seite leer, erlaubt sie keine Einbettung – dann „↗ Neuer Tab“ nutzen.');const f=H('iframe','',view);f.src=url;f.style.cssText='flex:1;min-height:300px;border:0;width:100%;background:#fff'},
search=async s=>{u.value=s;view.innerHTML='';H('small','',view,'Suche läuft…');
try{const r=await fetch('https://de.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(s)+'&gsrlimit=8&prop=extracts&exintro=1&explaintext=1&exlimit=max&format=json&origin=*'),j=await r.json();view.innerHTML='';
const row=H('small','',view,'Weitere Suche (neuer Tab): ');[['Google','https://www.google.com/search?q='],['DuckDuckGo','https://duckduckgo.com/?q='],['Bing','https://www.bing.com/search?q=']].forEach(([n,h])=>{link(row,n,h+encodeURIComponent(s));row.append(' · ')});
const pg=Object.values((j.query||{}).pages||{}).sort((x,y)=>x.index-y.index);if(!pg.length)H('div','',view,'Keine Treffer in Wikipedia.');
pg.forEach(p=>{const c=H('div','res',view);H('b','',c,p.title);H('div','',c,(p.extract||'').slice(0,300)+'…');const bt=H('div','',c),o=H('button','',bt,'Öffnen'),d=H('button','',bt,'⬇ In Downloads speichern');
o.onclick=()=>nav('https://de.m.wikipedia.org/?curid='+p.pageid);d.onclick=()=>{saveDl(p.title+'.txt',p.title+'\n\n'+(p.extract||''));d.textContent='✔ In Downloads gespeichert'}})}
catch{view.innerHTML='';H('div','',view,'Suche fehlgeschlagen (offline oder vom Netzwerk blockiert).')}},
nav=(x,push=true)=>{x=x.trim();if(!x)return home();if(push)hist.push(x);/^https?:\/\//i.test(x)?embed(x):isUrl(x)?embed('https://'+x):search(x)};
bk.onclick=()=>{hist.pop();const l=hist[hist.length-1];l?nav(l,false):home()};hm.onclick=()=>{hist.length=0;home()};go.onclick=()=>nav(u.value);u.onkeydown=e=>{if(e.key==='Enter')nav(u.value)};
ex.onclick=()=>{const x=u.value.trim();if(!x)return;window.open(/^https?:\/\//i.test(x)?x:isUrl(x)?'https://'+x:'https://www.google.com/search?q='+encodeURIComponent(x),'_blank','noopener')};home()}},
calc:{t:'Rechner',i:'🧮',w:280,h:380,b(b){b.classList.add('calc');let e='';const d=H('div','disp',b,'0'),g=H('div','grid',b);
'C ⌫ ( ) 7 8 9 / 4 5 6 * 1 2 3 - 0 . = +'.split(' ').forEach(k=>{const x=H('button','',g,k);x.onclick=()=>{if(k==='C')e='';else if(k==='⌫')e=e.slice(0,-1);
else if(k==='='){try{if(!/^[\d+\-*/.() ]+$/.test(e))throw 0;e=String(+Function('return '+e)().toFixed(10))}catch{e='Fehler'}}else{if(e==='Fehler')e='';e+=k}d.textContent=e||'0'}})}},
paint:{t:'Paint',i:'🎨',w:520,h:400,b(b){b.classList.add('paint');const bar=H('div','bar',b),c=H('input','',bar),s=H('input','',bar),cl=H('button','',bar,'Leeren'),cv=H('canvas','',b);
c.type='color';c.value='#ffffff';s.type='range';s.min=1;s.max=30;s.value=4;cv.width=900;cv.height=600;const g=cv.getContext('2d');g.fillStyle='#222';g.fillRect(0,0,900,600);g.lineCap='round';let dr=false;
const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*900/r.width,(e.clientY-r.top)*600/r.height]};
cv.onpointerdown=e=>{dr=true;cv.setPointerCapture(e.pointerId);const[x,y]=pt(e);g.beginPath();g.moveTo(x,y);g.strokeStyle=c.value;g.lineWidth=s.value;g.lineTo(x+.1,y);g.stroke()};
cv.onpointermove=e=>{if(!dr)return;const[x,y]=pt(e);g.lineTo(x,y);g.stroke()};cv.onpointerup=cv.onpointercancel=()=>dr=false;cl.onclick=()=>{g.fillStyle='#222';g.fillRect(0,0,900,600)}}},
taskmgr:{t:'Task-Manager',i:'📊',w:400,h:320,b(b,o){const l=H('div','',b),info=H('small','',b),r=()=>{l.innerHTML='';wins.forEach(x=>{const row=H('div','row',l,x.t),k=H('button','',row,'Beenden');k.onclick=()=>{x.close()}});
info.textContent='CPU-Kerne: '+(navigator.hardwareConcurrency||'?')+' · RAM: '+(navigator.deviceMemory?navigator.deviceMemory+' GB':'nicht verfügbar')};r();const iv=setInterval(r,1000);o.onclose=()=>clearInterval(iv)}},
settings:{t:'Einstellungen',i:'⚙️',w:380,h:260,b(b){b.classList.add('set');H('label','',b,'Akzentfarbe');const c=H('input','',b);c.type='color';c.value=cfg.ac;c.oninput=()=>{cfg.ac=c.value;W('cfg',cfg);applyCfg()};
const r=H('button','',b,'Alle gespeicherten Daten löschen');r.onclick=()=>{if(confirm('Notizen, Dateien und Einstellungen wirklich löschen?')){localStorage.clear();location.reload()}}}}};
/* Desktop, Start, Taskleiste */
const ic=$('#icons'),ap=$('#apps');
Object.entries(apps).forEach(([id,a])=>{const e=H('div','icon',ic);H('b','',e,a.i);H('span','',e,a.t);
e.onclick=()=>{[...ic.children].forEach(c=>c.classList.remove('sel'));e.classList.add('sel')};onOpen(e,()=>openApp(id));
longPress(e,(x,y,ev)=>{ev.stopPropagation();showMenu(x,y,[['Öffnen',()=>openApp(id)]])});
const s=H('button','',ap);H('b','',s,a.i);s.append(a.t);s.dataset.n=a.t.toLowerCase();s.onclick=()=>openApp(id)});
longPress(desk,(x,y)=>showMenu(x,y,[['⌨️ Terminal',()=>openApp('terminal')],['📝 Neue Notiz',()=>openApp('notes')],['⚙️ Einstellungen',()=>openApp('settings')],['🔄 Aktualisieren',()=>location.reload()]]));
desk.addEventListener('pointerdown',e=>{if(e.target===desk||e.target===ic)[...ic.children].forEach(c=>c.classList.remove('sel'))});
$('#sbtn').onclick=()=>{start.classList.toggle('on');$('#sq').value='';$('#sq').dispatchEvent(new Event('input'))};
$('#sq').oninput=e=>[...ap.children].forEach(b=>b.style.display=b.dataset.n.includes(e.target.value.toLowerCase())?'':'none');
const tick=()=>{const d=new Date();$('#clk').innerHTML=d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})+'<br>'+d.toLocaleDateString('de-DE');$('#net').textContent=navigator.onLine?'📶 online':'✖ offline'};
tick();setInterval(tick,1000);addEventListener('online',tick);addEventListener('offline',tick);
