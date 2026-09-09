import { englishCurriculum } from './english.js';
import { store } from './store.js';
import { escapeHtml, percent } from './utils.js';

export const englishGuides = [
  {
    id: 'zero', level: 'A0', icon: '🔤', title: 'Inglês do zero absoluto', subtitle: 'Sons, primeiras palavras e frases essenciais.', modules: [15, 16, 17],
    goals: ['Reconhecer comandos do curso', 'Soletrar nome e dados', 'Construir frases com I, you, this e that'],
    rules: [['I am / You are', 'Use am depois de I e are depois de you, we e they.', 'I am ready. You are my friend.'], ['This / That', 'This aponta algo próximo; that, algo distante.', 'This is my book. That is your bag.'], ['Pedir ajuda', 'Use frases prontas para manter a conversa.', 'Please repeat slowly. What does this mean?']],
    phrases: [['How do you spell your name?', 'Como você soletra seu nome?'], ['I do not understand yet.', 'Eu ainda não entendo.'], ['Can you repeat slowly, please?', 'Pode repetir devagar, por favor?']],
    mission: 'Grave ou diga em voz alta seu nome, sua cidade e uma frase pedindo ajuda.'
  },
  {
    id: 'survival', level: 'A0–A1', icon: '🧭', title: 'Inglês de sobrevivência', subtitle: 'Apresentações, compras, direções e pedidos.', modules: [1, 2, 5, 6, 8],
    goals: ['Apresentar-se com segurança', 'Fazer um pedido educado', 'Pedir preço e direção'],
    rules: [['Perguntas com do', 'Use do antes de you para perguntar sobre ações e gostos.', 'Do you like coffee?'], ['Can I…?', 'Use can I para pedir algo de modo simples.', 'Can I have the menu, please?'], ['How much / Where', 'How much pergunta preço; where pergunta lugar.', 'How much is this? Where is the station?']],
    phrases: [['My name is Carlos and I am from Brazil.', 'Meu nome é Carlos e sou do Brasil.'], ['I would like water, please.', 'Eu gostaria de água, por favor.'], ['Go straight and turn left.', 'Siga reto e vire à esquerda.']],
    mission: 'Simule com a IA uma chegada a um café: cumprimente, peça algo e pergunte o preço.'
  },
  {
    id: 'routine', level: 'A1', icon: '⏰', title: 'Rotina e presente simples', subtitle: 'Hábitos, horários, frequência e perguntas.', modules: [4, 18, 21],
    goals: ['Descrever um dia completo', 'Usar frequência', 'Fazer frases negativas e perguntas'],
    rules: [['Presente simples', 'Use o verbo base com I, you, we e they; com he, she e it, normalmente acrescente -s.', 'I study at night. She studies in the morning.'], ['Negativa', 'Use do not ou don’t antes do verbo; com he, she e it, use does not ou doesn’t.', 'I do not work on Sunday. He does not work on Sunday.'], ['Frequência', 'Always, often, sometimes e never aparecem antes do verbo principal, mas depois do verbo to be.', 'I often read. She is always early.']],
    phrases: [['I usually wake up at seven.', 'Eu geralmente acordo às sete.'], ['I do not work on weekends.', 'Eu não trabalho nos fins de semana.'], ['How often do you study English?', 'Com que frequência você estuda inglês?']],
    mission: 'Escreva seis frases sobre sua rotina e peça ao Corretor gentil para revisar.'
  },
  {
    id: 'past', level: 'A1–A2', icon: '📖', title: 'Passado e histórias', subtitle: 'Conte o que aconteceu e organize uma narrativa.', modules: [11, 22],
    goals: ['Usar verbos comuns no passado', 'Conectar eventos', 'Diferenciar ação curta e ação em andamento'],
    rules: [['Passado simples', 'Use para ações concluídas em um período terminado.', 'I visited my friend yesterday.'], ['Was/were + verbo-ing', 'Use para uma ação em andamento interrompida ou contextualizada por outra.', 'I was working when you called.'], ['Sequência', 'First, then, afterwards e finally organizam a história.', 'First we ate. Then we walked.']],
    phrases: [['What did you do yesterday?', 'O que você fez ontem?'], ['I was sleeping when the phone rang.', 'Eu estava dormindo quando o telefone tocou.'], ['Finally, we arrived home safely.', 'Finalmente, chegamos em casa com segurança.']],
    mission: 'Conte à IA uma história de quatro frases sobre ontem; peça uma pergunta de continuação por vez.'
  },
  {
    id: 'future', level: 'A2', icon: '🧭', title: 'Planos, previsões e conselhos', subtitle: 'Going to, will, may, might e should.', modules: [10, 23],
    goals: ['Diferenciar intenção e previsão', 'Expressar possibilidade', 'Dar um conselho simples'],
    rules: [['Going to', 'Use para uma intenção já planejada e para previsões baseadas em evidência visível.', 'I am going to travel next month.'], ['Will', 'Use para decisões tomadas no momento, promessas e previsões baseadas em opinião.', 'I think it will rain.'], ['May / might / should', 'May e might indicam possibilidade; should, conselho.', 'It might be late. You should call.']],
    phrases: [['What are you going to do?', 'O que você vai fazer?'], ['It will probably be sunny.', 'Provavelmente fará sol.'], ['You should take the earlier bus.', 'Você deveria pegar o ônibus mais cedo.']],
    mission: 'Planeje um fim de semana com a IA e negocie pelo menos duas mudanças no plano.'
  },
  {
    id: 'work', level: 'A1–A2', icon: '💼', title: 'Inglês para trabalho', subtitle: 'Reuniões, e-mails, tarefas e processos.', modules: [7, 19, 24],
    goals: ['Descrever responsabilidades', 'Participar de uma reunião curta', 'Escrever um e-mail objetivo'],
    rules: [['Responsabilidade', 'Use be responsible for + substantivo ou verbo com ing.', 'I am responsible for testing.'], ['Pedido educado', 'Could you…? torna o pedido mais profissional.', 'Could you confirm the deadline?'], ['Ordem de processo', 'First, next e finally deixam instruções claras.', 'First, open the file. Next, check the data.']],
    phrases: [['Let us review the agenda.', 'Vamos revisar a pauta.'], ['Could you send me an update?', 'Você poderia me enviar uma atualização?'], ['The deadline is next Friday.', 'O prazo é na próxima sexta-feira.']],
    mission: 'Faça uma reunião simulada com a IA: apresente uma atualização, um problema e o próximo passo.'
  },
  {
    id: 'problems', level: 'A2', icon: '🛠️', title: 'Resolver problemas em inglês', subtitle: 'Atendimento, viagem, compras e suporte.', modules: [12, 26],
    goals: ['Descrever um problema sem traduzir palavra por palavra', 'Pedir uma alternativa', 'Confirmar que a solução funcionou'],
    rules: [['Estado do problema', 'Use is/are + adjetivo ou is not working.', 'My flight is delayed. The app is not working.'], ['Solução', 'Use Is there…? e Could you…? para buscar opções.', 'Is there another room?'], ['Confirmação', 'Use Does that solve the problem? ou Is everything working now? para fechar.', 'Is everything working now?']],
    phrases: [['I would like to exchange this item.', 'Eu gostaria de trocar este item.'], ['Is there another option?', 'Existe outra opção?'], ['The issue continues after restarting.', 'O problema continua depois de reiniciar.']],
    mission: 'Escolha hotel, aeroporto ou suporte técnico e peça à IA para interpretar o atendente.'
  },
  {
    id: 'a2', level: 'A2', icon: '🚀', title: 'Consolidação A2', subtitle: 'Produção, leitura, opinião e autonomia.', modules: [25, 27, 28, 29],
    goals: ['Sustentar uma conversa curta', 'Escrever um texto organizado', 'Explicar opinião com razão e exemplo'],
    rules: [['Opinião estruturada', 'Use opinião + razão + exemplo.', 'I believe it is useful because it saves time.'], ['Pergunta de continuação', 'Use really, why, how e what about para manter o diálogo.', 'Really? How did you learn that?'], ['Revisão', 'Cheque verbo, ordem das palavras e clareza antes de enviar.', 'Review the message and replace unclear words.']],
    phrases: [['In my opinion, this is the best option.', 'Na minha opinião, esta é a melhor opção.'], ['What about your experience?', 'E quanto à sua experiência?'], ['My next goal is to speak more naturally.', 'Meu próximo objetivo é falar de forma mais natural.']],
    mission: 'Converse por dez mensagens com a IA somente em inglês e peça um relatório final com três prioridades.'
  },
  {
    id: 'it-networking', level: 'A1–A2', icon: '🌐', title: 'English for IT & Networking', subtitle: 'Chamados, diagnóstico, redes e comunicação com usuários.', modules: [7, 19, 24, 26],
    goals: ['Coletar sintomas e confirmar escopo', 'Explicar ações técnicas com clareza', 'Registrar solução, validação e próximo passo'],
    rules: [['Perguntas de diagnóstico', 'Use is/are para estado e do/does para ações habituais.', 'Is the cable connected? Does the issue affect everyone?'], ['Ações em andamento', 'Use am/is/are + verbo-ing para dizer o que está sendo feito agora.', 'I am checking the network settings.'], ['Causa e resultado', 'Use because para causa e so/therefore para consequência.', 'The DNS server is unavailable, so names are not resolving.']],
    phrases: [['When did the issue start?', 'Quando o problema começou?'], ['Can you reach the default gateway?', 'Você consegue alcançar o gateway padrão?'], ['I changed one setting and tested the connection again.', 'Eu alterei uma configuração e testei a conexão novamente.'], ['The service is working now. I documented the root cause.', 'O serviço está funcionando agora. Documentei a causa raiz.']],
    mission: 'Simule um chamado em inglês: confirme impacto, faça três perguntas, proponha um teste e encerre com validação e resumo.'
  },
];

export const englishExams = [
  { id: 'diagnostic', title: 'Nivelamento inicial', level: 'A0–A2', description: 'Descubra por onde começar sem bloquear nenhuma lição.', modules: [15, 16, 1, 4, 11, 21, 23, 25], questions: 16, passing: 60 },
  { id: 'a0', title: 'Checkpoint A0', level: 'A0', description: 'Alfabeto, comandos, números e primeiras estruturas.', modules: [15, 16, 17], questions: 15, passing: 70 },
  { id: 'a1-survival', title: 'Prova A1 · Sobrevivência', level: 'A1', description: 'Apresentações, rotina, compras, cidade e ajuda.', modules: [1, 2, 3, 4, 5, 6, 7, 8], questions: 20, passing: 70 },
  { id: 'a1-final', title: 'Prova final A1', level: 'A1', description: 'Avaliação cumulativa da base funcional A1.', modules: [9, 10, 11, 12, 13, 14, 18, 19, 20], questions: 24, passing: 75 },
  { id: 'a2-mid', title: 'Checkpoint A2', level: 'A2', description: 'Histórias, planos, trabalho e opiniões.', modules: [21, 22, 23, 24, 25], questions: 24, passing: 75 },
  { id: 'a2-final', title: 'Simulado final A2', level: 'A2', description: 'Missões cumulativas, compreensão e produção guiada.', modules: [21, 22, 23, 24, 25, 26, 27, 28, 29], questions: 30, passing: 80 },
];

function guideProgress(guide) {
  const lessonIds = englishCurriculum.lessons.filter((lesson) => guide.modules.includes(lesson.module_id)).map((lesson) => lesson.id);
  return percent(lessonIds.filter((id) => store.state.english.completedLessons.includes(id)).length, lessonIds.length);
}

export function englishGuidesView() {
  const completed = store.state.english.resourcesCompleted ?? [];
  return `<section class="page english-page"><div class="page-head"><div><span class="eyebrow">BIBLIOTECA DE ESTUDO</span><h1>Apostilas práticas de inglês</h1><p>Resumos revisados para estudar, imprimir e transformar teoria em fala. Cada apostila termina com uma missão para conversar com a IA.</p></div><a class="button button-ghost" href="#/english">Painel de inglês</a></div><div class="resource-hero card"><div><span>${englishGuides.length} APOSTILAS · A0 AO A2 + INGLÊS TÉCNICO</span><h2>Leia menos. Recupere, fale e aplique mais.</h2><p>Use cada material em três passos: leia os exemplos, cubra as traduções e explique o conteúdo em voz alta.</p></div><a class="button button-primary" href="#/coach">Praticar com a IA</a></div><div class="guide-grid">${englishGuides.map((guide) => `<a class="card guide-card ${completed.includes(guide.id) ? 'completed' : ''}" href="#/english/guide/${guide.id}"><span class="guide-icon">${guide.icon}</span><small>${guide.level} · ${guide.goals.length} OBJETIVOS</small><h2>${escapeHtml(guide.title)}</h2><p>${escapeHtml(guide.subtitle)}</p><div class="guide-progress"><span>Trilha relacionada</span><strong>${guideProgress(guide)}%</strong></div><div class="progress"><i style="width:${guideProgress(guide)}%"></i></div><b>${completed.includes(guide.id) ? '✓ Estudada' : 'Abrir apostila →'}</b></a>`).join('')}</div></section>`;
}

export function englishGuideView(id) {
  const guide = englishGuides.find((item) => item.id === id);
  if (!guide) return '';
  const completed = (store.state.english.resourcesCompleted ?? []).includes(guide.id);
  return `<section class="page english-page guide-reader"><div class="guide-toolbar"><a class="button button-ghost" href="#/english/guides">← Apostilas</a><div><button class="button button-ghost" data-action="english-download-guide" data-guide="${guide.id}" type="button">Baixar resumo</button><button class="button button-ghost" data-action="english-print-guide" type="button">Imprimir</button></div></div><article class="card guide-sheet"><header><span>${guide.icon}</span><div><small>APOSTILA ${guide.level}</small><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.subtitle)}</p></div></header><section><span class="eyebrow">VOCÊ VAI CONSEGUIR</span><div class="guide-goals">${guide.goals.map((goal) => `<div><b>✓</b><span>${escapeHtml(goal)}</span></div>`).join('')}</div></section><section><span class="eyebrow">GRAMÁTICA PARA USAR</span><div class="rule-list">${guide.rules.map(([title, explanation, example], index) => `<article><b>${index + 1}</b><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(explanation)}</p><button class="phrase-audio" data-speak="${escapeHtml(example)}" type="button">🔊 ${escapeHtml(example)}</button></div></article>`).join('')}</div></section><section><span class="eyebrow">FRASES DE SOBREVIVÊNCIA</span><div class="phrase-table">${guide.phrases.map(([en, pt]) => `<div><button data-speak="${escapeHtml(en)}" type="button">🔊</button><strong>${escapeHtml(en)}</strong><span>${escapeHtml(pt)}</span></div>`).join('')}</div></section><section class="ai-mission"><span>✦</span><div><small>MISSÃO COM O COACH IA</small><h2>Agora transforme leitura em conversa</h2><p>${escapeHtml(guide.mission)}</p><button class="button button-primary" data-action="english-ai-conversation" data-agent="english_conversation" data-prompt="Quero praticar a apostila ${escapeHtml(guide.title)}. ${escapeHtml(guide.mission)} Comece com uma pergunta por vez." type="button">Conversar com a IA agora</button></div></section><footer><button class="button ${completed ? 'button-ghost' : 'button-primary'}" data-action="english-complete-guide" data-guide="${guide.id}" type="button">${completed ? '✓ Apostila concluída' : 'Marcar apostila como estudada'}</button></footer></article></section>`;
}

export function englishGuideText(id) {
  const guide = englishGuides.find((item) => item.id === id);
  if (!guide) return '';
  return `${guide.title} (${guide.level})\n\nOBJETIVOS\n${guide.goals.map((goal) => `- ${goal}`).join('\n')}\n\nGRAMÁTICA PARA USAR\n${guide.rules.map(([title, explanation, example]) => `${title}\n${explanation}\nExemplo: ${example}`).join('\n\n')}\n\nFRASES\n${guide.phrases.map(([en, pt]) => `${en} — ${pt}`).join('\n')}\n\nMISSÃO COM IA\n${guide.mission}\n`;
}

export function englishExamExercises(id) {
  const exam = englishExams.find((item) => item.id === id);
  if (!exam) return [];
  const eligible = englishCurriculum.exercises.filter((exercise) => {
    const lesson = englishCurriculum.lessons.find((item) => item.id === exercise.lesson_id);
    return lesson && exam.modules.includes(lesson.module_id);
  });
  const bySkill = ['Vocabulário', 'Recuperação ativa', 'Compreensão oral', 'Construção de frase', 'Conversação'];
  const balanced = bySkill.flatMap((skill) => eligible.filter((item) => item.skill === skill));
  const stride = Math.max(1, Math.floor(balanced.length / exam.questions));
  return Array.from({ length: exam.questions }, (_, index) => balanced[(index * stride + exam.id.length) % balanced.length]);
}

export function englishExamsView() {
  const attempts = store.state.english.examAttempts ?? [];
  const bestScore = (id) => Math.max(0, ...attempts.filter((item) => item.examId === id).map((item) => item.score));
  return `<section class="page english-page"><div class="page-head"><div><span class="eyebrow">AVALIAÇÕES A0 → A2</span><h1>Provas de inglês</h1><p>Checkpoints equilibrados de vocabulário, escuta, construção de frases e conversação. Cada tentativa alimenta sua revisão adaptativa.</p></div><a class="button button-ghost" href="#/english">Painel de inglês</a></div><div class="exam-notice card"><span>✓</span><div><strong>Faça sem consultar a apostila</strong><p>Use o resultado para decidir o que revisar. Uma nota não mede toda a sua capacidade de conversar.</p></div></div><div class="english-exam-grid">${englishExams.map((exam) => { const best = bestScore(exam.id); return `<article class="card english-exam-card"><header><span>${exam.level}</span><strong>${exam.questions} questões</strong></header><h2>${escapeHtml(exam.title)}</h2><p>${escapeHtml(exam.description)}</p><div class="exam-score"><span>Melhor nota</span><b>${best ? `${best}%` : '—'}</b></div><div class="progress"><i style="width:${best}%"></i></div><button class="button button-primary button-block" data-action="english-start-exam" data-exam="${exam.id}" type="button">${best ? 'Refazer prova' : 'Começar prova'}</button></article>`; }).join('')}</div>${attempts.length ? `<section class="card card-pad attempt-history"><div class="card-head"><div><h2>Histórico recente</h2><p>Suas últimas tentativas ficam salvas no progresso.</p></div></div>${attempts.slice(0, 8).map((attempt) => { const exam = englishExams.find((item) => item.id === attempt.examId); return `<div><span><strong>${escapeHtml(exam?.title ?? 'Prova')}</strong><small>${new Date(attempt.at).toLocaleDateString('pt-BR')} · ${attempt.correct}/${attempt.questions}</small></span><b class="${attempt.passed ? 'passed' : ''}">${attempt.score}%</b></div>`; }).join('')}</section>` : ''}</section>`;
}

export function englishExamById(id) { return englishExams.find((item) => item.id === id); }
