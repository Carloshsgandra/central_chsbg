import { store } from './store.js';
import { curriculum } from './data.js';
import { englishCurriculum } from './english.js';
import { networkLessons } from './network.js';
import { academyLessons, academyTracks } from './academy-data.js';
import { emptyAcademy, moneyToCents, totals, localDay, scheduleReview, importNexo, mergeAcademy } from './academy-core.js';
import { escapeHtml as esc, toast, go, downloadFile } from './utils.js';

const money = n => (n/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const alive = map => Object.values(map || {}).filter(x=>!x.deleted);
const academy = () => store.state.academy || emptyAcademy();
const href = (path,text,cls='button button-primary') => `<a class="${cls}" href="#/${path}">${text}</a>`;
const head = (tag,title,text,action='') => `<header class="nx-head"><div><span class="nx-eyebrow">${tag}</span><h1>${title}</h1><p>${text}</p></div>${action}</header>`;
const bar = (done,total) => `<progress value="${done}" max="${total || 1}" aria-label="${done} de ${total} concluídos"></progress>`;
const currentMonth = () => localDay().slice(0,7);
const dueLessons = () => academyLessons.filter(l=>academy().practice[l.id]?.completed && (!academy().reviews[l.id]?.due || new Date(academy().reviews[l.id].due)<=new Date()));
const field = (name,label,type='text',value='',attrs='') => `<label class="nx-field">${label}<input name="${name}" type="${type}" value="${esc(value)}" ${attrs}></label>`;
let checked = new Map();
let hintCount = new Map();
let financeMonth = currentMonth();
let noteId = '';
let reviewShown = false;
let redraw = () => {};
const update = fn => store.update(s=>{s.academy ||= emptyAcademy();fn(s.academy);});
const patchRecord = (collection,id,patch) => update(a=>{a[collection][id]={...a[collection][id],...patch,id,updatedAt:new Date().toISOString()};});
const saveId = () => crypto.randomUUID();

export function academyDashboard() {
 const s=store.state,a=academy();
 const javaNext=curriculum.lessons.find(l=>!s.completedLessons.includes(l.id));
 const enNext=englishCurriculum.lessons.find(l=>!s.english.completedLessons.includes(l.id));
 const due=dueLessons();
 const month=totals(a.ledger,currentMonth());
 const done=Object.values(a.practice).filter(x=>x.completed).length;
 const cards=[
  ['orange','J','Java & ADS','Lógica, POO, testes e projetos com aplicação real.',s.completedLessons.length,curriculum.lessons.length,'learn'],
  ['purple','EN','Inglês para a vida','Comece pelo alfabeto. Avance até conversas de trabalho.',s.english.completedLessons.length,englishCurriculum.lessons.length,'english'],
  ['blue','NET','Redes & infraestrutura','Laboratórios que conversam com seu dia no provedor.',s.network.completedLessons.length,networkLessons.length,'network'],
  ['green','R$','Sua vida financeira','Um orçamento claro para financiar os seus planos.',alive(a.ledger).length,0,'finance']
 ];
 const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const key=localDay(d);return {key,label:d.toLocaleDateString('pt-BR',{weekday:'narrow'}),active:Boolean(s.activity[key]?.exercises || s.activity[key]?.minutes || s.english.activity[key]?.exercises || Object.values(a.practice).some(p=>p.completed && p.updatedAt?.startsWith(key)))};});
 return `<section class="page nx-page">
 ${head('NEXO ACADEMY / MEU ESPAÇO','Seu próximo capítulo<br><span>começa aqui.</span>','Estudo, carreira e vida. Um passo possível a cada dia.',`<div class="nx-date">${new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}<span>UM DIA DE CADA VEZ</span></div>`)}
 <div class="nx-dashboard"><div>
 <section class="nx-mission"><div class="nx-eyebrow"><span class="nx-live"></span> SEU PLANO DE HOJE <span>25–35 MIN</span></div><h2>Conecte o que você aprende.</h2><p>Uma ideia em Java. Uma conversa em inglês.<br>Uma decisão melhor para o seu futuro.</p><div class="nx-actions">${href(javaNext ? 'lesson/'+javaNext.id : 'academy/java','Começar minha sessão →')}${href('planner','Organizar a semana','nx-text-link')}</div><div class="nx-mission-foot"><span>01 · Aprender</span><span>02 · Praticar</span><span>03 · Revisar</span></div></section>
 <div class="nx-section-title"><h2>Suas trilhas</h2>${href('academy','Explorar laboratórios ↗','nx-text-link')}</div>
 <div class="nx-course-grid">${cards.map(([color,mark,title,desc,count,total,route])=>`<a class="nx-course ${color}" href="#/${route}"><div class="nx-course-top"><span class="nx-mark">${mark}</span><span>↗</span></div><h3>${title}</h3><p>${desc}</p><div class="nx-small-line"><span>${total ? count+' de '+total+' lições' : count+' movimentações'}</span><b>${total ? Math.round(count/total*100)+'%' : 'Abrir carteira'}</b></div>${total ? bar(count,total) : '<div class="nx-finance-line">Planejar hoje. Escolher melhor amanhã.</div>'}</a>`).join('')}</div>
 <div class="nx-section-title"><h2>Seu próximo passo</h2><span>Curto, claro e possível.</span></div>
 <div class="nx-next-list">${[
 [javaNext?'lesson/'+javaNext.id:'academy/java','J',javaNext?.title||'Aprofundamento em Java','Java · teoria + prática'],
 [enNext?'english/lesson/'+enNext.id:'academy/business','EN',enNext?.title||'Comunicação empresarial','Inglês · escuta + resposta'],
 ['finance','R$','Revisar os gastos do mês','Finanças · 5 minutos']
 ].map(([route,mark,title,meta],i)=>`<a href="#/${route}"><span class="nx-step-num">0${i+1}</span><span class="nx-next-copy"><small>${meta}</small><b>${esc(title)}</b></span><span>→</span></a>`).join('')}</div>
 </div><aside class="nx-aside">
 <section class="nx-card"><div class="nx-section-title"><h3>Seu ritmo</h3><span>✦</span></div><div class="nx-big-number">${s.completedLessons.length+s.english.completedLessons.length+s.network.completedLessons.length+done}<span>etapas praticadas<br><small>Seu progresso real, acumulado.</small></span></div><div class="nx-week">${days.map(d=>`<div><span>${d.label}</span><i class="${d.active?'active':''}" title="${d.key}">${d.active?'✓':'·'}</i></div>`).join('')}</div><div class="nx-small-line"><span>Laboratórios de aprofundamento</span><b>${done}/${academyLessons.length}</b></div>${bar(done,academyLessons.length)}</section>
 <section class="nx-card nx-recall"><span class="nx-mark">↻</span><h3>Lembrar é aprender.</h3><p>${due.length ? due.length+' práticas estão prontas para revisão.' : 'Depois da prática, o conhecimento volta na hora de revisar.'}</p>${href('academy-review','Abrir revisões →','button button-ghost')}</section>
 <section class="nx-focus"><span>◷</span><h3>Um bloco de foco.</h3><p>Reserve ${s.settings.focusMinutes} minutos só para você.</p>${href('focus','Entrar no modo foco →','nx-text-link')}</section>
 <section class="nx-cloud"><span>☁</span><div><b>Seu progresso tem casa.</b><p data-cloud-summary>Entre para guardar seus dados na conta.</p><a href="#/vault">Conta, backups e recuperação →</a></div></section>
 </aside></div>
 <section class="nx-bridge"><div><span class="nx-eyebrow">DA FACULDADE PARA O MUNDO REAL</span><h2>Aprenda. Construa. Explique em inglês.</h2><p>Transforme os conceitos em projetos próprios e use o caderno para explicar suas decisões.</p></div>${href('projects','Abrir projetos guiados ↗','button button-ghost')}</section>
 </section>`;
}

function catalog(track='') {
 const selected=academyTracks.find(t=>t.id===track);
 const lessons=track?academyLessons.filter(l=>l.track===track):academyLessons;
 return `<section class="page nx-page">${head('LABORATÓRIOS / PRÁTICA DELIBERADA',selected?.label||'Construa a sua base.','Teoria curta, uma tentativa sua e perguntas para confirmar o entendimento.',href('dashboard','← Meu espaço','button button-ghost'))}
 <nav class="nx-filters" aria-label="Trilhas de laboratório">${href('academy','Todas',!track?'selected':'')}${academyTracks.map(t=>href('academy/'+t.id,t.label,t.id===track?'selected':'')).join('')}</nav>
 ${track==='java'?'<div class="nx-tip">Está começando? <a href="#/learn">Faça primeiro a trilha Java do zero</a>. Os laboratórios abaixo aprofundam os fundamentos.</div>':''}
 ${track==='business'?'<div class="nx-tip">Inglês zero? <a href="#/english/learn">Comece pelo alfabeto e pelo nível A0</a>. Estas situações complementam a formação; nível indicado não equivale a certificação.</div>':''}
 <div class="nx-lab-grid">${lessons.map(l=>{const t=academyTracks.find(t=>t.id===l.track),p=academy().practice[l.id];return `<a class="nx-card nx-lab ${t.color}" href="#/practice/${l.id}"><div class="nx-course-top"><span class="nx-mark">${t.mark}</span><small>${p?.completed?'✓ Praticado':esc(l.level)}</small></div><h3>${l.title}</h3><p>${esc(l.concept.split('. ')[0])}.</p><span class="nx-text-link">Abrir prática →</span></a>`;}).join('')}</div>
 <div class="nx-tip">As atividades de programação guiam sua solução. A escrita é autoavaliada; o sistema não finge compilar nem corrigir seu código.</div></section>`;
}
function practice(id) {
 const l=academyLessons.find(l=>l.id===id); if(!l)return '<section class="page"><h1>Prática não encontrada</h1><a href="#/academy">Voltar às trilhas</a></section>';
 const t=academyTracks.find(t=>t.id===l.track),p=academy().practice[id]||{},result=checked.get(id),count=hintCount.get(id)||0;
 return `<section class="page nx-page">${head(t.label.toUpperCase()+' / '+l.level,l.title,'Entenda a ideia. Tente aplicar. Depois confira o conceito.',href('academy/'+t.id,'← Voltar à trilha','button button-ghost'))}
 <div class="nx-workspace"><aside class="nx-card"><span class="nx-eyebrow">A IDEIA CENTRAL</span><p class="nx-concept">${esc(l.concept)}</p><div class="nx-method"><b>Seu roteiro</b><ol><li>Leia e feche a explicação.</li><li>Explique com suas palavras.</li><li>Tente resolver o desafio.</li><li>Confira e revise em outro dia.</li></ol></div><a class="nx-text-link" href="${t.source}" target="_blank" rel="noopener">Aprofundar na referência ↗</a>${l.track==='business'?'<button class="button button-ghost" data-nx-action="speak" data-id="'+id+'">Ouvir a frase em inglês ▷</button>':''}</aside>
 <section class="nx-card"><span class="nx-eyebrow">AGORA É COM VOCÊ</span><h2 class="nx-challenge">${esc(l.challenge)}</h2><form data-nx-form="practice" data-id="${id}"><label class="nx-field">Meu raciocínio / minha tentativa<textarea name="reflection" data-nx-draft="${id}" rows="7" maxlength="16000" placeholder="O que entendi, como resolveria e o que preciso testar...">${esc(p.reflection||'')}</textarea></label><p class="nx-muted" id="draft-status">Rascunho salvo ao sair do campo ou concluir.</p>
 ${count?'<div class="nx-tip">'+l.hints.slice(0,count).map((h,i)=>'<p><b>Dica '+(i+1)+'.</b> '+esc(h)+'</p>').join('')+'</div>':''}
 ${count<l.hints.length?'<button class="button button-ghost" type="button" data-nx-action="hint" data-id="'+id+'">Uma dica, por favor</button>':''}
 <fieldset class="nx-question"><legend>${esc(l.question)}</legend>${l.options.map((o,i)=>`<label class="nx-option"><input type="radio" name="answer" value="${i}" required ${result?.answer===i?'checked':''}>${esc(o)}</label>`).join('')}</fieldset>
 ${result?`<p class="nx-feedback ${result.correct?'success':'retry'}" role="status">${result.correct ? '✓ '+esc(l.feedback) : 'Ainda não. Revise a ideia central e tente novamente.'}</p>`:''}
 <label class="nx-check"><input name="selfcheck" type="checkbox" required> Consigo explicar minha tentativa e reconheço o que ainda preciso praticar.</label>
 <button class="button button-primary" type="submit">Conferir e registrar prática →</button><p class="nx-muted">${p.completed?'Prática registrada. Repetir não duplica XP.':'A conclusão exige uma tentativa escrita, autoavaliação e a pergunta conceitual correta.'}</p></form></section></div></section>`;
}
function review() {
 const due=dueLessons(),l=due[0];
 return `<section class="page nx-page">${head('REVISÃO ESPAÇADA','Puxe da memória.','Tente responder antes de revelar. Avalie com honestidade para ajustar o próximo encontro.')}
 <div class="nx-actions">${href('flashcards','Flashcards Java','button button-ghost')}${href('english/review','Revisar inglês','button button-ghost')}${href('review','Caderno de erros','button button-ghost')}</div>
 <section class="nx-card nx-review-card">${l?`<span class="nx-eyebrow">${due.length} REVISÕES DISPONÍVEIS</span><h2>${l.question}</h2><p>Responda em voz alta ou no papel antes de continuar.</p>${reviewShown?`<div class="nx-tip">${esc(l.options[l.answer])}<p>${esc(l.feedback)}</p></div><div class="nx-actions">${[['again','Esqueci · 10 min'],['hard','Com esforço · amanhã'],['good','Lembrei · alguns dias']].map(([r,t])=>'<button class="button button-ghost" data-nx-action="rate" data-id="'+l.id+'" data-rating="'+r+'">'+t+'</button>').join('')}</div>`:'<button class="button button-primary" data-nx-action="reveal">Mostrar explicação</button>'}`:`<span class="nx-mark">✓</span><h2>Tudo em dia por aqui.</h2><p>As revisões dos laboratórios aparecem depois da primeira prática. As próximas datas ficam guardadas com o seu progresso.</p>${href('academy','Escolher uma prática →')}`}</section></section>`;
}
function finance() {
 const a=academy(),sum=totals(a.ledger,financeMonth),limit=a.monthlyLimit,ratio=limit?Math.round(sum.expense/limit*100):0;
 const rows=alive(a.ledger).filter(x=>x.date.startsWith(financeMonth)).sort((a,b)=>b.date.localeCompare(a.date));
 const categories=rows.filter(x=>x.type==='expense').reduce((a,x)=>({...a,[x.category]:(a[x.category]||0)+x.cents}),{});
 return `<section class="page nx-page">${head('FINANÇAS / CLAREZA PARA ESCOLHER','Seu dinheiro, com propósito.','Registre, compare e reserve espaço para os seus próximos passos.',href('academy/finance','Aprender sobre finanças ↗','button button-ghost'))}
 <label class="nx-month">Período <input type="month" id="nx-month" value="${financeMonth}" required></label>
 <div class="nx-metrics"><article class="nx-card"><small>Entradas no mês</small><b class="nx-positive">${money(sum.income)}</b></article><article class="nx-card"><small>Saídas no mês</small><b>${money(sum.expense)}</b></article><article class="nx-card"><small>Saldo registrado do mês</small><b class="${sum.balance<0?'nx-negative':'nx-positive'}">${money(sum.balance)}</b></article></div>
 <div class="nx-finance-grid"><section class="nx-card"><h2>Nova movimentação</h2><form data-nx-form="transaction" class="nx-form">${field('title','Descrição','text','','required maxlength="120"')}
 <div class="nx-pair"><label class="nx-field">Tipo<select name="type"><option value="expense">Despesa</option><option value="income">Receita</option></select></label>${field('amount','Valor em R$','text','','required inputmode="decimal" placeholder="125,50"')}</div>
 <div class="nx-pair"><label class="nx-field">Categoria<select name="category">${['Estudos','Moradia','Alimentação','Transporte','Lazer','Trabalho','Saúde','Outros'].map(x=>'<option>'+x+'</option>').join('')}</select></label>${field('date','Data','date',localDay(),'required')}</div>
 <button class="button button-primary">Registrar movimentação +</button></form></section>
 <section class="nx-card"><div class="nx-section-title"><h2>Movimentações</h2><span>${rows.length} registros</span></div><div class="nx-ledger">${rows.length?rows.map(x=>`<article><span class="nx-ledger-icon ${x.type}">${x.type==='income'?'+':'−'}</span><div><b>${esc(x.title)}</b><small>${esc(x.category)} · ${x.date.split('-').reverse().join('/')}</small></div><strong>${money(x.cents)}</strong><button class="icon-button" aria-label="Excluir ${esc(x.title)}" data-nx-action="delete" data-collection="ledger" data-id="${esc(x.id)}">×</button></article>`).join(''):'<div class="nx-empty"><span>R$</span><p>Nenhum lançamento neste mês.<br>Comece por uma entrada ou uma despesa.</p></div>'}</div></section></div>
 <div class="nx-finance-grid"><section class="nx-card"><h2>Um limite que faz sentido</h2><form data-nx-form="limit" class="nx-inline-form">${field('amount','Limite mensal de despesas','text',limit?(limit/100).toFixed(2).replace('.',','):'','required inputmode="decimal"')}<button class="button button-ghost">Salvar limite</button></form>
 ${limit?`<div class="nx-small-line"><span>${ratio}% do limite utilizado</span><b>${money(limit)}</b></div>${bar(Math.min(sum.expense,limit),limit)}<p class="nx-muted">${sum.expense>limit?'O mês passou do limite em '+money(sum.expense-limit)+'. Reveja o planejamento.':money(Math.max(0,limit-sum.expense))+' ainda disponíveis no planejamento.'}</p>`:'<p class="nx-muted">Defina o limite a partir da sua realidade, sem percentuais obrigatórios.</p>'}
 ${Object.entries(categories).map(([cat,n])=>'<div class="nx-category"><span>'+esc(cat)+'</span><b>'+money(n)+'</b></div>').join('')}</section>
 <section class="nx-card"><h2>Seus próximos planos</h2><form data-nx-form="goal" class="nx-form">${field('title','Nome da meta','text','','required maxlength="100"')}<div class="nx-pair">${field('target','Valor total · R$','text','','required inputmode="decimal"')}${field('saved','Já guardado · R$','text','0','required inputmode="decimal"')}</div>${field('monthly','Aporte mensal · R$','text','','required inputmode="decimal"')}<button class="button button-ghost">Criar meta +</button></form>
 ${alive(a.goals).map(g=>`<div class="nx-goal"><b>${esc(g.title)}</b><span>${money(g.saved)} / ${money(g.target)}</span>${bar(Math.min(g.saved,g.target),g.target)}<small>${Math.ceil(Math.max(0,g.target-g.saved)/g.monthly)} meses estimados · sem juros</small><form data-nx-form="goal-update" data-id="${g.id}" class="nx-inline-form">${field('amount','Atualizar valor guardado','text',(g.saved/100).toFixed(2).replace('.',','),'required inputmode="decimal"')}<button class="button button-ghost">Atualizar</button></form></div>`).join('')}</section></div></section>`;
}
function notebook() {
 const a=academy(),notes=alive(a.notes).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)),selected=a.notes[noteId]&&!a.notes[noteId].deleted?a.notes[noteId]:null;
 return `<section class="page nx-page">${head('CADERNO / MEU CONHECIMENTO','Dê forma ao que você entendeu.','Anote dúvidas, decisões de projeto e palavras novas. Explicar também é praticar.')}
 <div class="nx-notebook"><aside class="nx-card"><button class="button button-primary" data-nx-action="new-note">Nova anotação +</button>${notes.map(n=>'<button class="nx-note-link '+(n.id===noteId?'selected':'')+'" data-nx-action="open-note" data-id="'+esc(n.id)+'"><small>'+esc(n.tag)+'</small><b>'+esc(n.title)+'</b></button>').join('')}</aside>
 <section class="nx-card"><form data-nx-form="note" data-id="${selected?.id||''}" class="nx-form">${field('title','Título','text',selected?.title||'','required maxlength="120"')}${field('tag','Área / etiqueta','text',selected?.tag||'Estudos','maxlength="40"')}<label class="nx-field">Anotação<textarea name="body" rows="15" maxlength="60000" required placeholder="O que entendi… Minha dúvida… Onde posso aplicar…">${esc(selected?.body||'')}</textarea></label><div class="nx-actions"><button class="button button-primary">Salvar anotação</button>${selected?'<button type="button" class="button button-ghost" data-nx-action="delete" data-collection="notes" data-id="'+selected.id+'">Excluir</button>':''}</div></form><p class="nx-muted">Use “Salvar anotação” para guardar suas alterações.</p></section></div></section>`;
}
function planner() {
 const tasks=alive(academy().tasks).sort((a,b)=>a.date.localeCompare(b.date));
 return `<section class="page nx-page">${head('PLANEJAMENTO / CONSTÂNCIA','Reserve espaço para evoluir.','Três sessões possíveis valem mais do que uma semana impossível.',href('calendar','Ver histórico de estudos','button button-ghost'))}
 <div class="nx-finance-grid"><section class="nx-card"><h2>Agendar um passo</h2><form data-nx-form="task" class="nx-form">${field('title','O que vou praticar','text','','required maxlength="160"')}${field('date','Dia','date',localDay(),'required')}<label class="nx-field">Área<select name="track">${academyTracks.map(t=>'<option value="'+t.id+'">'+t.label+'</option>').join('')}</select></label><button class="button button-primary">Adicionar ao plano +</button></form></section>
 <section class="nx-card"><h2>Meu plano</h2>${tasks.length?tasks.map(t=>`<div class="nx-task"><label><input type="checkbox" data-nx-task="${esc(t.id)}" ${t.done?'checked':''}><span class="${t.done?'nx-strike':''}">${esc(t.title)}<small>${t.date} · ${esc(t.track)}</small></span></label><button class="icon-button" aria-label="Excluir tarefa" data-nx-action="delete" data-collection="tasks" data-id="${esc(t.id)}">×</button></div>`).join(''):'<p class="nx-muted">Escolha uma tarefa pequena e uma data para começar.</p>'}</section></div></section>`;
}
function vault() {
 return `<section class="page nx-page">${head('CONTA & DADOS / CONTINUIDADE','O site evolui. Você continua.','Seu progresso usa identificadores permanentes e dados separados dos arquivos do site.')}
 <div class="nx-lab-grid"><article class="nx-card"><span class="nx-mark">☁</span><h2>Sua conta</h2><p data-cloud-summary>Entre para guardar seu progresso na nuvem.</p><button class="button button-primary" data-auth-open data-cloud-action>Entrar e sincronizar</button><p class="nx-muted">Contas e dados usam o serviço deste site no Netlify. Atualizar o mesmo site mantém o mesmo armazenamento.</p></article><article class="nx-card"><span class="nx-mark">↓</span><h2>Uma cópia sua</h2><p>Exporte antes de trocar de domínio ou dispositivo. O arquivo inclui cursos, finanças, caderno e planejamento.</p><button class="button button-primary" data-nx-action="backup">Baixar backup completo</button></article><article class="nx-card"><span class="nx-mark">↗</span><h2>Traga seu histórico</h2><p>Importe um backup do Nexo ou JavaDuolingo. A fusão preserva as lições existentes e não duplica lançamentos do Nexo.</p><label class="button button-ghost">Escolher backup<input id="nx-import" type="file" accept=".json,application/json" hidden></label></article></div>
 <section class="nx-card nx-spaced"><h2>Recuperação na nuvem</h2><p>As oito últimas versões confirmadas ficam disponíveis para download. A recuperação combina dados com o estado atual após sua escolha.</p><button class="button button-ghost" data-nx-action="history">Consultar versões salvas</button><div id="nx-history" aria-live="polite"></div></section>
 <div class="nx-tip"><b>Como proteger a continuidade:</b> use a mesma conta e mantenha o site no mesmo projeto do Netlify. Enquanto estiver desconectado, seus dados ficam neste navegador e numa segunda cópia local; limpar os dados do navegador pode apagar ambas. O indicador de sincronização confirma quando chegaram à nuvem.</div></section>`;
}
function references() {
 return `<section class="page nx-page">${head('BIBLIOTECA / FONTES E MÉTODO','Boas referências. Prática sua.','Materiais oficiais para aprofundar; exercícios próprios para transformar leitura em aprendizado.')}
 <div class="nx-lab-grid">${academyTracks.map(t=>`<a class="nx-card nx-lab ${t.color}" href="${t.source}" target="_blank" rel="noopener"><span class="nx-mark">${t.mark}</span><h2>${t.label}</h2><p>${t.description}</p><span class="nx-text-link">Abrir referência oficial ↗</span></a>`).join('')}</div>
 <section class="nx-card nx-spaced"><h2>Como estudar aqui</h2><p>Recuperação ativa: tente lembrar antes de consultar. Prática espaçada: retorne em dias diferentes. Projetos: aplique conceitos em problemas próprios. A revisão agenda 10 minutos, 1 dia ou intervalos crescentes conforme sua autoavaliação; os intervalos são uma regra prática ajustável, não uma garantia de domínio.</p><a href="https://www.learningscientists.org/faq" target="_blank" rel="noopener">Conheça a pesquisa sobre aprendizado ↗</a></section></section>`;
}
export function academyView(route,id) {
 if(route==='dashboard')return academyDashboard();
 if(route==='academy')return catalog(id);
 if(route==='practice')return practice(id);
 if(route==='academy-review')return review();
 if(route==='finance')return finance();
 if(route==='notebook')return notebook();
 if(route==='planner')return planner();
 if(route==='vault')return vault();
 if(route==='library')return references();
 return '';
}
export function initAcademy(render) {
 redraw=render;
 document.addEventListener('submit',event=>{
  const form=event.target.closest('[data-nx-form]');if(!form)return;
  event.preventDefault();const values=Object.fromEntries(new FormData(form)),id=form.dataset.id,kind=form.dataset.nxForm,now=new Date().toISOString();
  try {
   if(kind==='transaction'){if(!values.title.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(values.date))throw Error('Preencha descrição e data.');patchRecord('ledger',saveId(),{title:values.title.trim(),type:values.type,category:values.category,date:values.date,cents:moneyToCents(values.amount)});financeMonth=values.date.slice(0,7);}
   if(kind==='limit')update(a=>{a.monthlyLimit=moneyToCents(values.amount);a.limitUpdatedAt=now;});
   if(kind==='goal'){const saved=Number(values.saved)===0?0:moneyToCents(values.saved);patchRecord('goals',saveId(),{title:values.title.trim(),target:moneyToCents(values.target),saved,monthly:moneyToCents(values.monthly)});}
   if(kind==='goal-update')patchRecord('goals',id,{saved:Number(values.amount)===0?0:moneyToCents(values.amount)});
   if(kind==='note'){noteId=id||saveId();patchRecord('notes',noteId,{title:values.title.trim(),tag:values.tag.trim(),body:values.body});}
   if(kind==='task')patchRecord('tasks',saveId(),{title:values.title.trim(),date:values.date,track:values.track,done:false});
   if(kind==='practice'){
    const l=academyLessons.find(l=>l.id===id);if(!l)return;
    patchRecord('practice',id,{reflection:values.reflection});
    if(values.reflection.trim().length<30)throw Error('Desenvolva sua tentativa um pouco mais antes de concluir.');
    const correct=Number(values.answer)===l.answer;checked.set(id,{correct,answer:Number(values.answer)});
    if(correct)update(a=>{a.practice[id]={...a.practice[id],completed:true,updatedAt:now};a.reviews[id]||={due:new Date(Date.now()+86400000).toISOString(),interval:1,updatedAt:now,count:0};});
    redraw();toast(correct?'Prática registrada. Sua revisão está agendada.':'Revise o conceito e tente novamente.',correct?'success':'error');return;
   }
   toast('Salvo.');redraw();
  }catch(error){toast(error.message,'error');}
 });
 document.addEventListener('change',event=>{
  if(event.target.matches('[data-nx-draft]')){patchRecord('practice',event.target.dataset.nxDraft,{reflection:event.target.value});const status=document.getElementById('draft-status');if(status)status.textContent='Rascunho guardado.';}
  if(event.target.matches('[data-nx-task]')){patchRecord('tasks',event.target.dataset.nxTask,{done:event.target.checked});redraw();}
  if(event.target.id==='nx-month' && event.target.value){financeMonth=event.target.value;redraw();}
  if(event.target.id==='nx-import' && event.target.files?.[0]) importFile(event.target.files[0]);
 });
 document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-nx-action]');if(!button)return;
  const {nxAction:action,id,collection,rating}=button.dataset;
  try {
   if(action==='hint'){const draft=document.querySelector('[data-nx-draft]');if(draft)patchRecord('practice',id,{reflection:draft.value});hintCount.set(id,(hintCount.get(id)||0)+1);redraw();}
   if(action==='reveal'){reviewShown=true;redraw();}
   if(action==='rate'){patchRecord('reviews',id,scheduleReview(academy().reviews[id],rating));reviewShown=false;redraw();}
   if(action==='new-note'){noteId='';redraw();}
   if(action==='open-note'){noteId=id;redraw();}
   if(action==='delete' && ['ledger','notes','tasks'].includes(collection)){if(!confirm('Excluir este registro? A exclusão será sincronizada com a sua conta.'))return;patchRecord(collection,id,{deleted:true});redraw();}
   if(action==='backup')downloadFile('nexo-academy-'+localDay()+'.json',store.export());
   if(action==='history')await showHistory();
   if(action==='speak'){const l=academyLessons.find(x=>x.id===id);if(!('speechSynthesis' in window))throw Error('Este navegador não oferece leitura por voz.');speechSynthesis.cancel();const speech=new SpeechSynthesisUtterance(l.options[l.answer]);speech.lang='en-US';speech.rate=.85;speechSynthesis.speak(speech);}
  }catch(error){toast(error.message,'error');}
 });
}
async function importFile(file) {
 try{
  if(file.size>2_000_000)throw Error('O backup deve ter até 2 MB.');
  const data=JSON.parse(await file.text());
  // Save the original before importing, without deleting any source keys.
  downloadFile('nexo-antes-da-importacao-'+localDay()+'.json',store.export());
  if(data.user && data.version){const {mergeProgress}=await import('./progress-merge.js');store.import(JSON.stringify(mergeProgress(data,JSON.parse(store.export()))));}
  else update(a=>Object.assign(a,importNexo(a,data)));
  toast('Backup combinado com seu progresso.');redraw();
 }catch(error){toast(error.message,'error');}
}
async function showHistory() {
 const box=document.getElementById('nx-history');box.textContent='Consultando sua conta...';
 const response=await fetch('/api/progress?history=1',{credentials:'same-origin',cache:'no-store'});
 const data=await response.json();if(!response.ok)throw Error(data.error||'Entre para consultar versões.');
 box.innerHTML=(data.history||[]).map((r,i)=>'<button class="button button-ghost" data-history-index="'+i+'">Baixar versão · '+esc(new Date(r.updatedAt).toLocaleString('pt-BR'))+'</button>').join('')||'<p>A primeira versão será guardada após sincronizar.</p>';
 box.querySelectorAll('[data-history-index]').forEach(b=>b.addEventListener('click',async ()=>{
  try {
   const revision = data.history[Number(b.dataset.historyIndex)].revision;
   const response = await fetch('/api/progress?revision='+encodeURIComponent(revision),{credentials:'same-origin',cache:'no-store'});
   const result = await response.json();
   if (!response.ok) throw Error(result.error || 'Não foi possível recuperar esta versão.');
   downloadFile('nexo-recuperacao-'+revision+'.json',JSON.stringify(result.record.state,null,2));
  } catch(error) { toast(error.message,'error'); }
 }));
}
