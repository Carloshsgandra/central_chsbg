import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { emptyAcademy, mergeAcademy, moneyToCents, totals, importNexo, scheduleReview } from '../assets/js/academy-core.js';
import { mergeProgress } from '../assets/js/progress-merge.js';
import { academyLessons } from '../assets/js/academy-data.js';
import { handleProgress } from '../netlify/lib/progress-service.mjs';

for(const [input,expected] of [['1.000,25',100025],['0,10',10],['20.99',2099],['1.000',100000],['150',15000]]) assert.equal(moneyToCents(input),expected,input);
for(const input of ['-10','NaN','Infinity','1e4','0','1,234','abc','']) assert.throws(()=>moneyToCents(input));
const ledger={a:{cents:10010,type:'income',date:'2026-09-10'},b:{cents:999,type:'expense',date:'2026-09-10'},c:{cents:1000,type:'expense',date:'2026-08-10'},d:{cents:3000,type:'expense',date:'2026-09-11',deleted:true}};
assert.deepEqual(totals(ledger,'2026-09'),{income:10010,expense:999,balance:9011});
const old='2026-09-01T10:00:00Z',recent='2026-09-03T10:00:00Z';
let a=emptyAcademy(),b=emptyAcademy();
a.ledger.x={id:'x',cents:100,updatedAt:old}; b.ledger.x={id:'x',deleted:true,updatedAt:recent};
a.practice.j={completed:true,reflection:'old',updatedAt:old};b.practice.j={completed:false,reflection:'new',updatedAt:recent};
a.notes.one={body:'meu texto',updatedAt:old};b.notes.two={body:'outro texto',updatedAt:recent};
const merged=mergeAcademy(a,b);
assert(merged.ledger.x.deleted,'Exclusão deve sobreviver ao dispositivo antigo.');
assert.equal(merged.practice.j.completed,true,'Atualizar rascunho não desfaz conclusão.');
assert.equal(merged.practice.j.reflection,'new');
assert.equal(Object.keys(merged.notes).length,2);
assert.deepEqual(mergeAcademy(merged,merged),merged,'Fusão idempotente.');
const legacy={completed:['j1','e1'],note:'Meu texto do Nexo',expenses:[{id:4,title:'Curso',type:'expense',value:39.9}]};
const imported=importNexo(emptyAcademy(),legacy);
const twice=importNexo(imported,legacy);
assert.equal(Object.keys(twice.ledger).length,1);
assert.equal(twice.ledger['nexo-4'].cents,3990);
assert.deepEqual(twice.legacyCompleted,['j1','e1']);
assert.throws(()=>importNexo(emptyAcademy(),{unrelated:true}));
const oldProgress={version:7,user:{xp:100},completedLessons:[1],network:{completedLessons:['n1'],labsCompleted:['l1'],careerChecklist:['c1'],xp:20}};
const newProgress={version:8,user:{xp:130},completedLessons:[2],network:{completedLessons:['n2'],labsCompleted:['l2'],careerChecklist:['c2'],xp:40},academy:imported};
const combined=mergeProgress(oldProgress,newProgress);
assert.deepEqual(combined.completedLessons,[1,2]);
assert.deepEqual(combined.network.completedLessons,['n1','n2']);
assert.equal(combined.academy.notes['nexo-notebook'].body,'Meu texto do Nexo');
const now=new Date('2026-09-01T12:00:00Z');
assert.equal(scheduleReview({},'again',now).due,'2026-09-01T12:10:00.000Z');
assert.equal(scheduleReview({},'hard',now).interval,1);
assert.equal(scheduleReview({interval:80},'good',now).interval,90);
assert.throws(()=>scheduleReview({},'wrong'));
assert.equal(new Set(academyLessons.map(x=>x.id)).size,academyLessons.length);
for(const l of academyLessons){assert(l.options[l.answer]);assert(l.hints.length>=2);assert(l.concept.length>90);}

class FakeStore {
 constructor(){this.records=new Map();this.serial=0;}
 async get(key){return structuredClone(this.records.get(key)?.data||null);}
 async getWithMetadata(key){return structuredClone(this.records.get(key)||null);}
 async setJSON(key,data,options={}){
  const old=this.records.get(key);
  if(options.onlyIfNew && old || options.onlyIfMatch && options.onlyIfMatch!==old?.etag)return {modified:false};
  const etag=String(++this.serial);this.records.set(key,{data:structuredClone(data),etag});return {modified:true,etag};
 }
}
const fake=new FakeStore();
const state={version:8,user:{name:'Aluno'},completedLessons:[1],academy:emptyAcademy()};
const put=(state,revision=null)=>new Request('https://example.netlify.app/api/progress',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({state,expectedRevision:revision})});
const get=(suffix='')=>new Request('https://example.netlify.app/api/progress'+suffix);
assert.equal((await handleProgress(put(state),null,fake)).status,401);
const firstResponse=await handleProgress(put(state),{id:'one'},fake);assert.equal(firstResponse.status,200);
const first=(await firstResponse.json()).record;
assert.equal((await handleProgress(put(state),{id:'one'},fake)).status,409,'Revisão ausente não sobrescreve registro existente.');
const parallel=await Promise.all([handleProgress(put({...state,completedLessons:[1,2]},first.revision),{id:'one'},fake),handleProgress(put({...state,completedLessons:[1,3]},first.revision),{id:'one'},fake)]);
assert.deepEqual(parallel.map(x=>x.status).sort(),[200,409],'Somente uma escrita concorrente é confirmada.');
const history=await (await handleProgress(get('?history=1'),{id:'one'},fake)).json();
assert.equal(history.history.length,2);
const saved=await (await handleProgress(get('?revision='+first.revision),{id:'one'},fake)).json();
assert.deepEqual(saved.record.state.completedLessons,[1]);
assert.equal((await handleProgress(get('?revision='+first.revision),{id:'two'},fake)).status,404,'Histórico isolado por conta.');
assert.equal((await handleProgress(put({...state,version:99}),{id:'one'},fake)).status,400);
const crossOrigin=put(state);crossOrigin.headers.set('origin','https://other.test');
assert.equal((await handleProgress(crossOrigin,{id:'one'},fake)).status,403);
const own=await (await handleProgress(get(),{id:'two'},fake)).json();assert.equal(own.record,null);
const memory = new Map([['javaflow-state-v3',JSON.stringify(oldProgress)]]);
globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
const {store}=await import('../assets/js/store.js');
await store.ready;
assert.equal(store.state.version,8);assert.deepEqual(store.state.completedLessons,[1]);
store.update(s=>{s.academy.ledger=ledger;});
const savedBeforeUpdate=store.export();store.import(savedBeforeUpdate);
assert.equal(store.state.academy.ledger.a.cents,10010);
assert(memory.has('javaflow-state-v3'),'A atualização não troca a chave persistente.');
// Every new rendered route must be a usable working surface, with escaped user content.
store.update(s=>{s.user.name='<img src=x>';s.academy.notes.x={id:'x',title:'<script>x</script>',body:'texto',tag:'ADS',updatedAt:recent};});
const {academyView}=await import('../assets/js/academy.js');
const dashboard=academyView('dashboard');
assert(dashboard.includes('Suas trilhas')&&dashboard.includes('Minhas')===false);
for(const route of ['academy','practice','academy-review','finance','notebook','planner','vault','library']){
 const markup=academyView(route,route==='practice'?academyLessons[0].id:undefined);
 assert(markup.includes('<section'),route+' deve renderizar conteúdo');
 assert(!markup.includes('<script>x</script>'),'Conteúdo do usuário deve ser escapado.');
}
const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
assert(sw.includes('!paths.has(url.pathname)'),'Não armazenar endpoints autenticados no cache.');
console.log('Nexo: valores monetários, migração, revisão, fusão, concorrência, isolamento de contas e renderização passaram.');

