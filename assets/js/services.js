import { curriculum } from './data.js';

export const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_MODEL = 'llama-3.3-70b-versatile';
export const GROQ_SESSION_KEY = 'javaflow-groq-api-key';

const agentPrompts = {
  mentor: 'Você é um mentor de Java. Explique com clareza, exemplos pequenos e uma pergunta de confirmação.',
  debugger: 'Você é um debugger Java. Identifique causa, linha provável, correção e um teste para confirmar.',
  challenge: 'Você cria desafios Java adaptativos. Não entregue a resposta imediatamente; forneça critérios e testes.',
  reviewer: 'Você revisa código Java com foco em legibilidade, métodos pequenos, encapsulamento e riscos.',
  interview: 'Você é um entrevistador Java. Faça perguntas, avalie a resposta e indique lacunas objetivamente.',
  strategist: 'Você é um estrategista de aprendizagem bilíngue. Use o contexto real de progresso para criar um plano curto, equilibrado e acionável. Priorize recuperação ativa, erros recentes e consistência. Não invente métricas.',
  english_beginner: 'Você ensina inglês para uma pessoa brasileira começando do zero absoluto. Explique em português, introduza pouco conteúdo por vez, dê exemplos A0–A1 e termine com uma pergunta curta de verificação.',
  english_conversation: 'Você conduz conversação em inglês do nível A0 ao A2. Ajuste vocabulário e extensão ao nível calculado no contexto, faça uma pergunta por vez, espere a tentativa do aluno e ofereça uma dica em português quando necessário.',
  english_pronunciation: 'Você é um treinador de pronúncia de inglês para brasileiros. Explique som, sílaba forte, ritmo e contraste com português sem prometer sotaque perfeito. Dê uma prática curta de repetição.',
  english_corrector: 'Você corrige inglês iniciante com gentileza. Mostre a frase original, a versão corrigida, uma única regra importante e peça uma nova tentativa. Preserve a intenção do aluno.',
  english_memory: 'Você treina memória de inglês com recuperação ativa e repetição espaçada. Use as palavras conhecidas e os erros do contexto. Faça apenas uma pergunta por vez e não revele a resposta antes da tentativa.',
  network_mentor: 'Você é um instrutor de redes em português, inspirado no ciclo pedagógico Cisco: conceito, configuração, verificação, falha controlada e documentação. Ensine defensivamente e adapte ao progresso real.',
  network_troubleshooter: 'Você é um analista sênior de redes e suporte. Conduza diagnóstico por escopo, camada, evidência, hipótese e teste. Não sugira mudanças destrutivas antes de coleta e rollback.',
  network_cli: 'Você é um instrutor de Cisco IOS. Explique a finalidade do comando, o modo correto, como verificar e um erro comum. Use apenas práticas autorizadas e defensivas.',
  network_interview: 'Você simula entrevistas para suporte e redes júnior. Faça uma pergunta por vez, avalie precisão, método, comunicação e indique uma lacuna acionável.',
};

const javaTopics = [
  { pattern: /string|texto|equals|concat/i, title: 'Strings', advice: 'Em Java, String é imutável. Compare conteúdo com equals(), use StringBuilder em muitas concatenações e trate null antes de chamar métodos.' },
  { pattern: /arraylist|lista|collection/i, title: 'Coleções', advice: 'Declare pela interface quando possível: List<T>. ArrayList favorece acesso por índice; LinkedList só é útil em cenários específicos de inserção e remoção.' },
  { pattern: /null|optional|nullexception/i, title: 'Null safety', advice: 'Descubra primeiro de onde o null pode nascer. Valide nas fronteiras e use Optional principalmente como retorno, não como campo ou parâmetro.' },
  { pattern: /classe|objeto|oop|encapsula/i, title: 'Orientação a Objetos', advice: 'Agrupe estado e comportamento que mudam juntos. Mantenha campos privados e exponha operações que preservem as regras do objeto.' },
  { pattern: /heran|polimorf|interface|extends|implements/i, title: 'Polimorfismo', advice: 'Prefira depender de abstrações. Herança modela uma relação “é um”; composição costuma ser melhor para reutilizar comportamento.' },
  { pattern: /stream|lambda|map\(|filter\(/i, title: 'Streams', advice: 'Streams descrevem uma transformação: fonte → operações intermediárias → terminal. Evite efeitos colaterais dentro de map e filter.' },
  { pattern: /exception|exce|try|catch/i, title: 'Exceções', advice: 'Capture apenas exceções que você consegue tratar. Preserve a causa original e evite catch(Exception) silencioso.' },
  { pattern: /loop|for|while|repet/i, title: 'Laços', advice: 'Use for-each quando não precisa do índice. Prefira while quando o número de repetições depende de uma condição externa.' },
  { pattern: /m[eé]todo|fun[cç][aã]o|return/i, title: 'Métodos', advice: 'Um método deve ter uma responsabilidade clara, nome com verbo e poucos parâmetros. O retorno deve representar uma única ideia.' },
];

function relevantQuestion(prompt) {
  const terms = prompt.toLocaleLowerCase('pt-BR').split(/\W+/).filter((term) => term.length > 4);
  return curriculum.interviewQuestions
    .map((question) => ({ question, score: terms.filter((term) => `${question.question} ${question.answer}`.toLocaleLowerCase('pt-BR').includes(term)).length }))
    .sort((a, b) => b.score - a.score)[0];
}

function englishLocalCoach(agent, prompt, context = {}, history = []) {
  const english = context.english ?? {};
  const knownVocabulary = english.knownVocabularySample?.length ? english.knownVocabularySample : [{ en: 'hello', pt: 'olá' }, { en: 'name', pt: 'nome' }, { en: 'please', pt: 'por favor' }, { en: 'thanks', pt: 'obrigado' }];
  const knownWords = knownVocabulary.map((word) => word.en);
  const focusWord = String(prompt).match(/[A-Za-z][A-Za-z'-]*/)?.[0] ?? knownWords[0];

  if (agent === 'english_conversation') {
    const level = english.level ?? 'A0 · começando';
    const questions = level.includes('A2') ? [
      ['What is one habit you would like to improve, and why?', 'I would like to improve … because …'],
      ['Tell me about something interesting that happened this week.', 'This week, I …'],
      ['What are you going to do next weekend?', 'I am going to …'],
      ['Which technology is most useful in your daily life?', 'In my opinion, … is useful because …'],
    ] : level.includes('A1') || level.includes('Pré-A1') ? [
      ['What do you usually do in the morning?', 'I usually …'],
      ['What food do you like, and why?', 'I like … because …'],
      ['What did you do yesterday?', 'Yesterday, I …'],
      ['What are your plans for the weekend?', 'I am going to …'],
    ] : [
      ['Hello! What is your name?', 'My name is …'],
      ['Where are you from?', 'I am from …'],
      ['Do you like music?', 'Yes, I do. / No, I do not.'],
      ['What do you study?', 'I study …'],
    ];
    const answerTurns = Math.max(0, history.filter((message) => message.role === 'user').length - 1);
    const [question, hint] = questions[Math.min(answerTurns, questions.length - 1)];
    const acknowledgement = answerTurns ? `Boa tentativa: “${String(prompt).slice(0, 120)}”\n\n` : `Vamos conversar no nível ${level}.\n\n`;
    return `${acknowledgement}— ${question}\n\nResponda em inglês. Se travar, use: “${hint}”`;
  }

  if (agent === 'english_pronunciation') {
    return `Treino curto de pronúncia: “${focusWord}”

1. Ouça a palavra no botão de áudio do curso.
2. Repita devagar, sem acrescentar uma vogal no final.
3. Repita dentro de uma frase curta.

Agora escreva como você acha que essa palavra soa para um brasileiro. Eu ajusto sua aproximação.`;
  }

  if (agent === 'english_corrector') {
    if (/quero escrever|peça uma frase|começar/i.test(prompt)) return 'Escreva sua primeira frase simples em inglês. Pode falar sobre seu nome, sua cidade ou algo de que você gosta.';
    const corrected = String(prompt)
      .replace(/\bi\b/g, 'I')
      .replace(/\bI am have\b/gi, 'I have')
      .replace(/\bI have (\d+) years\b/gi, 'I am $1 years old');
    return `Sua frase: ${prompt}

Versão sugerida: ${corrected}

Regra principal: em inglês, “I” sempre aparece com letra maiúscula. Tente escrever a frase novamente sem olhar.`;
  }

  if (agent === 'english_memory') {
    const previousQuestion = [...history].reverse().find((message) => message.role === 'assistant')?.text?.match(/O que “([^”]+)” significa/);
    if (previousQuestion) {
      const previousWord = knownVocabulary.find((word) => word.en.toLocaleLowerCase() === previousQuestion[1].toLocaleLowerCase());
      if (previousWord) {
        const correct = String(prompt).trim().toLocaleLowerCase('pt-BR') === previousWord.pt.toLocaleLowerCase('pt-BR');
        return `${correct ? '✓ Muito bem!' : `Quase. “${previousWord.en}” significa “${previousWord.pt}”.`}

Agora use “${previousWord.en}” em uma frase curta em inglês.`;
      }
    }
    const word = knownWords[Math.abs(String(prompt).length) % knownWords.length];
    return `Recuperação ativa — não olhe a tradução ainda.

O que “${word}” significa em português?

Responda com uma palavra ou expressão curta.`;
  }

  return `Vamos do zero, em uma ideia por vez.

Próximo foco sugerido: ${english.nextLesson ?? 'primeiras palavras'}.

Estrutura mínima:
• I am … = Eu sou/estou …
• You are … = Você é/está …

Exemplo: “I am ready.” = “Eu estou pronto.”

Complete em inglês: “Eu sou estudante.”`;
}

function strategyLocalCoach(context = {}) {
  const java = context.java ?? {};
  const english = context.english ?? {};
  const priority = (english.dueReviews ?? 0) + (english.activeMistakes ?? 0) >= (java.activeMistakes ?? 0) ? 'inglês' : 'Java';
  const network = context.network ?? {};
  return `Plano adaptativo de 20 minutos

1. 5 min — Java: ${java.activeMistakes ? `recupere ${java.activeMistakes} erro(s) ativo(s)` : `avance em “${java.nextLesson ?? 'próxima lição'}”`}.
2. 5 min — Inglês: ${english.dueReviews ? `faça ${english.dueReviews} revisão(ões) vencida(s)` : `avance em “${english.nextLesson ?? 'próxima lição'}”`}.
3. 7 min — Redes: estude “${network.nextLesson ?? 'próxima lição'}” e registre um comando de verificação.
4. 3 min — Produção: explique em voz alta o conceito mais difícil sem consultar.

Prioridade de hoje: ${priority}. Ao terminar, registre uma nova tentativa para o radar recalcular o plano.`;
}

function networkLocalCoach(agent, prompt, context = {}) {
  const network = context.network ?? {};
  const question = String(prompt).toLocaleLowerCase('pt-BR');
  if (agent === 'network_troubleshooter') {
    return `Diagnóstico em cinco movimentos

1. Escopo — um host, uma VLAN, um site ou todos?
2. Estado — enlace, IP/máscara, gateway e DNS.
3. Evidência — ping local, gateway, destino por IP e por nome.
4. Hipótese — escolha a camada que melhor explica todos os sintomas.
5. Teste — altere uma variável, valide e documente rollback.

Para começar, informe: quem é afetado, desde quando, o que mudou e o primeiro teste que falhou.`;
  }
  if (agent === 'network_cli') {
    const command = question.includes('vlan') ? 'show vlan brief' : question.includes('ospf') ? 'show ip ospf neighbor' : question.includes('rota') ? 'show ip route' : 'show ip interface brief';
    return `Comando recomendado: ${command}

Finalidade: coletar estado antes de alterar a configuração.
Método: execute, compare com o resultado esperado e procure ausência, estado down ou parâmetro divergente.
Próximo passo: cole a saída sem senhas, chaves ou dados sensíveis e diga qual interface/rede deveria aparecer.`;
  }
  if (agent === 'network_interview') {
    return `Entrevista de redes · nível ${network.progressPercent >= 70 ? 'intermediário' : 'fundamentos'}

Um usuário consegue abrir um servidor por endereço IP, mas não pelo nome. Como você investigaria sem pular direto para uma correção?

Estruture sua resposta em: hipótese, dois testes, resultado esperado e documentação final.`;
  }
  return `Próximo foco: ${network.nextLesson ?? 'fundamentos de rede'}.

Use este ciclo em toda prática:
• Conceito — explique o que o protocolo ou equipamento decide.
• Configuração — faça uma mudança pequena e intencional.
• Verificação — defina o comando e o resultado esperado.
• Falha — provoque ou analise um desvio controlado.
• Registro — anote causa, correção e evidência.

Pergunta de checagem: em qual camada está o sintoma e qual comando provaria sua hipótese?`;
}

function localCoach(agent, prompt, context = {}, history = []) {
  if (agent.startsWith('english_')) return englishLocalCoach(agent, prompt, context, history);
  if (agent.startsWith('network_')) return networkLocalCoach(agent, prompt, context);
  if (agent === 'strategist') return strategyLocalCoach(context);
  const topic = javaTopics.find((item) => item.pattern.test(prompt));
  const match = relevantQuestion(prompt);
  const codePresent = /class\s+\w+|public\s+static|System\.out|;|\{/.test(prompt);

  if (agent === 'debugger' && codePresent) {
    const findings = [];
    if (!/public\s+static\s+void\s+main/.test(prompt)) findings.push('Verifique se existe um ponto de entrada `public static void main(String[] args)`.');
    if ((prompt.match(/\{/g) || []).length !== (prompt.match(/\}/g) || []).length) findings.push('A quantidade de chaves de abertura e fechamento não coincide.');
    if (/==\s*"|"\s*==/.test(prompt)) findings.push('A comparação de String com `==` compara referências; provavelmente você quer `equals()`.');
    if (/\/\s*0\b/.test(prompt)) findings.push('Há uma divisão por zero detectável no código.');
    if (!findings.length) findings.push('Não encontrei um erro sintático óbvio na inspeção local. Execute um caso mínimo e envie a mensagem completa do compilador para localizar a falha.');
    return `Diagnóstico inicial:\n\n${findings.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nTeste recomendado: reduza a entrada ao menor caso que ainda reproduz o problema e observe a primeira linha da stack trace.`;
  }

  if (agent === 'challenge') {
    const title = topic?.title ?? 'Fundamentos Java';
    return `Desafio adaptativo — ${title}\n\nCrie um pequeno programa que receba uma coleção de valores, aplique uma regra de validação e devolva um resumo sem alterar a coleção original.\n\nCritérios:\n1. Separe entrada, regra e apresentação em métodos.\n2. Trate entrada vazia.\n3. Escreva pelo menos três casos de teste: comum, limite e inválido.\n\nBônus: explique a complexidade de tempo da solução.`;
  }

  if (agent === 'reviewer' && codePresent) {
    return `Revisão rápida:\n\n• Nomes: confirme se classes são substantivos e métodos começam com verbos.\n• Responsabilidade: quebre métodos que misturam leitura, regra e impressão.\n• Estado: mantenha campos privados e valide mudanças por métodos.\n• Erros: não ignore exceções e evite retornar valores mágicos.\n• Testes: valide caminho feliz, limite e entrada inválida.\n\nPróximo passo: escolha o método mais longo e descreva em uma frase qual deveria ser sua única responsabilidade.`;
  }

  if (agent === 'interview') {
    const question = match?.score ? match.question : curriculum.interviewQuestions[Math.floor(Math.random() * curriculum.interviewQuestions.length)];
    return `Simulação de entrevista (${question.category} · ${question.difficulty})\n\n${question.question}\n\nDica disponível se precisar: ${question.hint}\n\nResponda como se estivesse em uma entrevista: definição, exemplo e principal cuidado.`;
  }

  const answer = topic?.advice ?? (match?.score ? match.question.answer : 'Comece separando o problema em entrada, transformação e saída. Depois identifique qual conceito Java governa cada etapa e valide com um exemplo mínimo.');
  return `${topic ? `${topic.title}\n\n` : ''}${answer}\n\nPara fixar: explique com suas palavras qual regra você aplicaria primeiro e dê um pequeno caso de teste.`;
}

export async function askCoach(agent, prompt, options = {}) {
  const context = options.context ?? {};
  const apiKey = sessionStorage.getItem(GROQ_SESSION_KEY)?.trim();
  if (!apiKey) return { text: localCoach(agent, prompt, context, options.history), local: true };

  try {
    let conversation = (options.history ?? [])
      .filter((message) => ['user', 'assistant'].includes(message.role) && message.text && message.text !== 'Pensando…')
      .slice(-12)
      .map((message) => ({ role: message.role, content: message.text }));
    const firstUserMessage = conversation.findIndex((message) => message.role === 'user');
    conversation = firstUserMessage >= 0 ? conversation.slice(firstUserMessage) : [];
    if (conversation.at(-1)?.content !== prompt) conversation.push({ role: 'user', content: prompt });
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.45,
        max_completion_tokens: 1_200,
        messages: [
          { role: 'system', content: `${agentPrompts[agent] ?? agentPrompts.mentor}\n\nUse somente este contexto pedagógico calculado pelo site; não invente progresso: ${JSON.stringify(context)}\n\nPermaneça em educação defensiva e ambientes autorizados.` },
          ...conversation,
        ],
      }),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody?.error?.message || `A Groq respondeu com status ${response.status}`);
    }
    const data = await response.json();
    return { text: data.choices?.[0]?.message?.content || localCoach(agent, prompt, context, options.history), local: false };
  } catch (error) {
    return { text: `${localCoach(agent, prompt, context, options.history)}\n\n(Usei o tutor local porque a integração externa não respondeu: ${error.message}.)`, local: true };
  }
}

function balancedBraces(code) {
  return (code.match(/\{/g) || []).length === (code.match(/\}/g) || []).length;
}

function replaceVariablesOutsideStrings(expression, variables) {
  let output = '';
  let quote = null;

  for (let index = 0; index < expression.length;) {
    const char = expression[index];
    if (quote) {
      output += char;
      if (char === '\\' && index + 1 < expression.length) {
        output += expression[index + 1];
        index += 2;
        continue;
      }
      if (char === quote) quote = null;
      index += 1;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      output += char;
      index += 1;
      continue;
    }
    const identifier = expression.slice(index).match(/^[A-Za-z_$][\w$]*/)?.[0];
    if (identifier) {
      output += Object.hasOwn(variables, identifier) ? JSON.stringify(variables[identifier]) : identifier;
      index += identifier.length;
      continue;
    }
    output += char;
    index += 1;
  }
  return output;
}

function evaluateSimpleExpression(expression, variables) {
  let candidate = replaceVariablesOutsideStrings(expression.trim(), variables);
  candidate = candidate.replace(/\.length\(\)/g, '.length');
  if (!/^[\d\s+\-*/%().,!<>=&|?\[\]"'A-Za-zÀ-ÿ:_]+$/.test(candidate)) return expression.trim();
  if (/\b(?:fetch|window|document|globalThis|Function|constructor|eval|import|require)\b/.test(candidate)) return expression.trim();
  try {
    return Function(`"use strict"; return (${candidate});`)();
  } catch {
    return expression.trim().replace(/^"|"$/g, '');
  }
}

function offlineJavaPreview(code, stdin = '') {
  if (!balancedBraces(code)) return { output: 'Erro de compilação: verifique as chaves { }.', preview: true, error: true };
  const variables = {};
  const inputValues = stdin.split(/\r?\n/);
  let inputIndex = 0;

  for (const match of code.matchAll(/(?:int|long|double|float|String|boolean|char|var)\s+(\w+)\s*=\s*([^;]+);/g)) {
    const [, name, raw] = match;
    if (/next(?:Int|Double|Line)\s*\(/.test(raw)) {
      const input = inputValues[inputIndex++] ?? '';
      variables[name] = /next(?:Int|Double)/.test(raw) ? Number(input) : input;
    } else {
      variables[name] = evaluateSimpleExpression(raw.replace(/[fLdD]$/, ''), variables);
    }
  }

  const prints = [...code.matchAll(/System\.out\.(println|print)\s*\((.*?)\)\s*;/gs)];
  if (!prints.length) {
    return { output: 'Prévia local concluída sem saída. Adicione System.out.println() para visualizar um resultado.', preview: true };
  }
  const output = prints.map((match) => {
    const value = evaluateSimpleExpression(match[2], variables);
    return `${value}${match[1] === 'println' ? '\n' : ''}`;
  }).join('');
  return { output, preview: true };
}

async function runJudge0(baseUrl, code, stdin) {
  const url = baseUrl.replace(/\/$/, '');
  const token = sessionStorage.getItem('javaflow-runner-key');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['X-Auth-Token'] = token;

  const languagesResponse = await fetch(`${url}/languages`, { headers });
  if (!languagesResponse.ok) throw new Error('Não foi possível consultar as linguagens do executor.');
  const languages = await languagesResponse.json();
  const java = languages.find((item) => /^Java \(/i.test(item.name)) ?? languages.find((item) => /Java/i.test(item.name));
  if (!java) throw new Error('O executor configurado não oferece Java.');

  const submissionResponse = await fetch(`${url}/submissions?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ source_code: code, language_id: java.id, stdin }),
  });
  if (!submissionResponse.ok) throw new Error(`Falha ao enviar o código (${submissionResponse.status}).`);
  const submission = await submissionResponse.json();

  for (let attempt = 0; attempt < 14; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, attempt < 3 ? 450 : 850));
    const resultResponse = await fetch(`${url}/submissions/${submission.token}?base64_encoded=false`, { headers });
    if (!resultResponse.ok) throw new Error('Não foi possível obter o resultado.');
    const result = await resultResponse.json();
    if (![1, 2].includes(result.status?.id)) {
      return {
        output: result.stdout || result.compile_output || result.stderr || result.message || result.status?.description || 'Execução encerrada.',
        preview: false,
        error: result.status?.id !== 3,
      };
    }
  }
  throw new Error('O executor demorou além do esperado.');
}

export async function runJava(code, stdin = '') {
  const settings = JSON.parse(localStorage.getItem('javaflow-state-v3') || '{}').settings ?? {};
  if (!settings.runnerUrl) return offlineJavaPreview(code, stdin);
  try {
    return await runJudge0(settings.runnerUrl, code, stdin);
  } catch (error) {
    const preview = offlineJavaPreview(code, stdin);
    return { ...preview, output: `${preview.output}\n\nExecutor remoto indisponível: ${error.message}\nFoi exibida uma prévia local segura.` };
  }
}
