import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { curriculum } from '../assets/js/data.js';

const memoryStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => memoryStorage.get(key) ?? null,
  setItem: (key, value) => memoryStorage.set(key, String(value)),
  removeItem: (key) => memoryStorage.delete(key),
  clear: () => memoryStorage.clear(),
};
const { englishCurriculum, englishLearnView } = await import('../assets/js/english.js');
const { englishExams, englishExamExercises, englishGuides, englishGuidesView } = await import('../assets/js/english-resources.js');
const { calculateSubnet, iosCommandReply, networkLessons, networkModules, networkTracks, supportTickets } = await import('../assets/js/network.js');
const { calendarView, coachView } = await import('../assets/js/views.js');

const root = resolve(import.meta.dirname, '..');
for (const file of ['index.html', 'assets/css/app.css', 'assets/js/app.js', 'assets/js/auth.js', 'assets/js/english.js', 'assets/js/english-resources.js', 'assets/js/network.js', 'assets/js/views.js', 'assets/js/store.js', 'assets/js/services.js', 'netlify/functions/progress.mjs', 'netlify.toml']) {
  await access(resolve(root, file));
}

assert.equal(curriculum.modules.length, 10, 'Os dez módulos devem ser preservados.');
assert.equal(curriculum.lessons.length, 30, 'As trinta lições devem ser preservadas.');
assert.equal(curriculum.exercises.length, 78, 'Todos os exercícios devem ser preservados.');
assert.equal(curriculum.exams.length, 5, 'As cinco provas devem ser preservadas.');
assert.equal(curriculum.examQuestions.length, 50, 'As questões de prova devem ser preservadas.');
assert.equal(curriculum.projects.length, 5, 'Os projetos devem ser preservados.');
assert.equal(curriculum.projectSteps.length, 22, 'Os passos de projeto devem ser preservados.');
assert.equal(curriculum.interviewQuestions.length, 50, 'As perguntas de entrevista devem ser preservadas.');
assert.equal(englishCurriculum.modules.length, 29, 'O curso de inglês deve conter 29 unidades progressivas.');
assert.equal(englishCurriculum.lessons.length, 108, 'O curso de inglês deve conter 108 lições do zero absoluto ao nível A2.');
assert.equal(englishCurriculum.exercises.length, 540, 'Cada lição de inglês deve oferecer cinco práticas ativas.');
assert.equal(englishCurriculum.lessons[0].title, 'O alfabeto', 'A trilha de inglês deve começar pelo alfabeto para atender iniciantes absolutos.');
assert.equal(englishCurriculum.lessons[0].id, 49, 'As novas lições iniciais não podem alterar os identificadores das 48 lições já existentes.');
assert.equal(englishCurriculum.lessons[12].id, 1, 'O progresso das lições antigas deve continuar compatível.');
assert(englishLearnView().includes('O alfabeto'), 'A primeira unidade exibida deve acolher quem começa do zero absoluto.');
assert(englishLearnView().includes('Missões A2'), 'A trilha deve avançar até missões integradas do nível A2.');
assert.equal(englishGuides.length, 9, 'O curso deve oferecer nove apostilas práticas, incluindo inglês para TI e redes.');
assert.equal(englishExams.length, 6, 'O curso deve oferecer seis provas e simulados de inglês.');
assert(englishGuidesView().includes('missão para conversar com a IA'), 'As apostilas devem transformar estudo em conversação com IA.');
assert(englishGuides.some((guide) => guide.id === 'it-networking'), 'As apostilas devem preparar comunicação em TI, redes e suporte.');
for (const exam of englishExams) assert.equal(englishExamExercises(exam.id).length, exam.questions, `A prova de inglês ${exam.id} deve ter a quantidade planejada de questões.`);
const englishCalendar = calendarView('english');
assert(englishCalendar.includes('calendar-tab active') && englishCalendar.includes('Inglês'), 'O calendário de inglês deve renderizar como filtro ativo.');
assert(calendarView('dev').includes('Dev Java'), 'O calendário de desenvolvimento deve ter uma visão própria.');
const bilingualCoach = coachView({ agent: 'english_beginner', messages: [{ role: 'assistant', text: 'Teste' }] });
assert(bilingualCoach.includes('Tutor do zero') && bilingualCoach.includes('Conversação A0–A2'), 'O Coach deve oferecer tutores especializados em inglês do zero ao A2.');
assert(bilingualCoach.includes('RADAR ADAPTATIVO') && bilingualCoach.includes('Seu plano de 20 minutos'), 'O Coach deve transformar o progresso dos três cursos em um plano diário acionável.');

for (const lesson of curriculum.lessons) {
  assert(curriculum.exercises.some((exercise) => exercise.lesson_id === lesson.id), `A lição ${lesson.id} precisa de exercícios.`);
}
for (const exam of curriculum.exams) {
  assert.equal(curriculum.examQuestions.filter((question) => question.exam_id === exam.id).length, 10, `A prova ${exam.id} precisa de 10 questões.`);
}
for (const lesson of englishCurriculum.lessons) {
  assert.equal(englishCurriculum.exercises.filter((exercise) => exercise.lesson_id === lesson.id).length, 5, `A lição de inglês ${lesson.id} precisa de 5 práticas.`);
}

const index = await readFile(resolve(root, 'index.html'), 'utf8');
assert(!index.includes('th:'), 'A nova interface não pode depender de Thymeleaf.');
assert(index.includes('type="module"'), 'A aplicação deve carregar módulos JavaScript.');

const storeSource = await readFile(resolve(root, 'assets/js/store.js'), 'utf8');
assert(storeSource.includes("localStorage.setItem(STORAGE_KEY"), 'O estado deve ter uma gravação síncrona entre sessões.');
assert(storeSource.includes('indexedDB.open(BACKUP_DB'), 'O estado deve manter uma segunda cópia persistente no IndexedDB.');
assert(storeSource.includes('const ready ='), 'A aplicação deve aguardar a restauração antes de renderizar.');
assert(storeSource.includes('recordEnglishAnswer'), 'O progresso do inglês deve ser persistido independentemente.');
assert(storeSource.includes('recordEnglishSession'), 'O tempo e as sessões de inglês devem ser persistidos.');
assert(storeSource.includes('saveEnglishExamAttempt'), 'As tentativas das provas de inglês devem ser persistidas.');
assert(storeSource.includes('completeEnglishResource'), 'A conclusão das apostilas deve ser persistida.');

const englishSource = await readFile(resolve(root, 'assets/js/english.js'), 'utf8');
assert(englishSource.includes('englishProgressView'), 'O curso de inglês deve exibir estatísticas de aprendizado.');
assert(englishSource.includes('não garantia de fluência ou certificação'), 'As projeções de aprendizado devem deixar seus limites claros.');

const englishResourcesSource = await readFile(resolve(root, 'assets/js/english-resources.js'), 'utf8');
assert(englishResourcesSource.includes('Conversar com a IA agora'), 'As apostilas devem convidar diretamente para uma conversa com IA.');
assert(englishResourcesSource.includes('englishExamExercises'), 'As provas devem montar avaliações a partir do currículo real.');

const servicesSource = await readFile(resolve(root, 'assets/js/services.js'), 'utf8');
assert(servicesSource.includes('english_beginner') && servicesSource.includes('english_conversation'), 'A integração de IA deve incluir prompts pedagógicos para inglês do zero e conversação.');
assert(servicesSource.includes('options.history') && servicesSource.includes('options.context'), 'A IA deve receber memória curta da conversa e contexto pedagógico do aluno.');
assert(servicesSource.includes("export const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'"), 'A URL da Groq deve ficar fixa no código.');
assert(servicesSource.includes("export const GROQ_MODEL = 'llama-3.3-70b-versatile'"), 'O modelo de produção da Groq deve ficar fixo no código.');
assert(servicesSource.includes("sessionStorage.getItem(GROQ_SESSION_KEY)"), 'A chave Groq deve permanecer apenas durante a sessão da aba.');
assert(!servicesSource.includes('localStorage.setItem(GROQ_SESSION_KEY'), 'A chave Groq não pode ser persistida no dispositivo.');

const appSource = await readFile(resolve(root, 'assets/js/app.js'), 'utf8');
assert(appSource.includes('coachLearningContext'), 'O aplicativo deve calcular contexto seguro de Java e inglês para o tutor.');
assert(appSource.includes('availableLessonIds'), 'A missão diária de inglês deve respeitar a nova ordem pedagógica das lições.');
assert(appSource.includes('startEnglishExam'), 'O aplicativo deve iniciar provas de inglês dentro do curso.');
assert(appSource.includes('english-ai-conversation'), 'O curso deve abrir a conversação com IA em contexto.');
assert(appSource.includes('networkDashboardView') && appSource.includes('handleSubnetSubmit') && appSource.includes('handleIosSubmit'), 'O aplicativo deve integrar painel e laboratórios de redes.');
assert(appSource.includes('preserveChatPosition') && appSource.includes('previousScrollY'), 'Atualizações do chat devem preservar a posição da página em vez de saltar para o topo.');

const viewsSource = await readFile(resolve(root, 'assets/js/views.js'), 'utf8');
assert(viewsSource.includes("['combined', 'dev', 'english']"), 'O calendário deve separar os históricos combinado, Dev Java e Inglês.');
assert(viewsSource.includes('calendarStreaks'), 'O calendário deve calcular sequências a partir dos dias realmente estudados.');
assert(viewsSource.includes('DIA SELECIONADO'), 'O calendário deve permitir inspecionar os dados de um dia.');

const authSource = await readFile(resolve(root, 'assets/js/auth.js'), 'utf8');
assert(authSource.includes('handleAuthCallback'), 'O login deve processar confirmação de e-mail e recuperação de senha.');
assert(authSource.includes('mergeProgress'), 'A sincronização deve preservar progresso local e remoto.');
assert(authSource.includes('expectedRevision'), 'A sincronização deve detectar alterações concorrentes.');
assert(authSource.includes('data-auth-form-mode'), 'O modo do formulário não pode reutilizar o controle dos botões de navegação.');
assert(authSource.includes("closest('button[data-auth-mode]')"), 'Somente botões de navegação podem trocar o modo do formulário.');
assert(authSource.includes("message.includes('invalid_grant')"), 'Credenciais inválidas devem exibir a mensagem correta ao usuário.');
assert(authSource.includes("if (!user?.id || !user?.email)"), 'O cadastro não pode aceitar uma resposta inválida como sucesso.');

const serverSource = await readFile(resolve(root, 'scripts/serve.mjs'), 'utf8');
assert(serverSource.includes("pathname.startsWith('/.netlify/identity')"), 'O servidor local deve encaminhar autenticação para o Netlify.');
assert(serverSource.includes("pathname === '/api/progress'"), 'O servidor local deve encaminhar a sincronização autenticada.');

const progressFunction = await readFile(resolve(root, 'netlify/functions/progress.mjs'), 'utf8');
assert(progressFunction.includes('await getUser()'), 'O endpoint de progresso deve exigir um usuário autenticado.');
assert(progressFunction.includes("consistency: 'strong'"), 'A nuvem deve usar leitura consistente para evitar perda de progresso.');
const progressService = await readFile(resolve(root, 'netlify/lib/progress-service.mjs'), 'utf8');
assert(progressService.includes('expectedRevision !== currentRevision'), 'O servidor deve rejeitar gravações concorrentes desatualizadas.');

assert.equal(networkTracks.length, 3, 'O curso de redes deve manter as três frentes profissionais solicitadas.');
assert.equal(networkModules.length, 19, 'O curso de redes deve conter 19 módulos progressivos.');
assert.equal(networkLessons.length, 76, 'O curso de redes deve conter 76 lições do zero à qualificação.');
assert.equal(supportTickets.length, 4, 'O laboratório deve oferecer chamados práticos de suporte.');
const subnet = calculateSubnet('192.168.10.34', 27);
assert.deepEqual({ network: subnet.network, broadcast: subnet.broadcast, first: subnet.first, last: subnet.last, usable: subnet.usable }, { network: '192.168.10.32', broadcast: '192.168.10.63', first: '192.168.10.33', last: '192.168.10.62', usable: 30 }, 'A calculadora de sub-redes deve produzir uma faixa correta.');
assert.equal(iosCommandReply('show ip interface brief', ['no shutdown']).prompt, 'EDGE-R1#', 'O terminal IOS deve reconhecer comandos de verificação.');
assert(appSource.includes("sessionStorage.setItem(GROQ_SESSION_KEY, apiKey)"), 'O formulário deve aceitar somente a chave e mantê-la na aba.');
assert(appSource.includes("apiKey.startsWith('gsk_')"), 'O formulário deve validar o prefixo de uma chave Groq.');

console.log('Todos os testes de estrutura e conteúdo passaram.');
