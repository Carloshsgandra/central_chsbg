import { store } from './store.js';
import { escapeHtml, percent } from './utils.js';

const modules = [
  { id: 15, title: 'Comece aqui', icon: '🔤', color: '#087fce', description: 'Alfabeto, sons, leitura e comandos para quem nunca estudou inglês.' },
  { id: 16, title: 'Inglês essencial', icon: '🧱', color: '#16a66a', description: 'As primeiras estruturas para entender e montar frases mínimas.' },
  { id: 17, title: 'Números e dados', icon: '🔢', color: '#ed8b20', description: 'Números, telefone, códigos, dias e informações pessoais básicas.' },
  { id: 1, title: 'Primeiros passos', icon: '👋', color: '#1687e8', description: 'Cumprimentos, respostas essenciais e palavras de sobrevivência.' },
  { id: 2, title: 'Quem sou eu', icon: '🙂', color: '#7c5cff', description: 'Apresentar-se, falar de origem, idade e preferências.' },
  { id: 3, title: 'Casa e família', icon: '🏠', color: '#16a66a', description: 'Pessoas, objetos cotidianos e frases com this, that e my.' },
  { id: 4, title: 'Minha rotina', icon: '⏰', color: '#ed8b20', description: 'Ações do dia, horários e presente simples em contexto.' },
  { id: 5, title: 'Comida e compras', icon: '🥪', color: '#e34f65', description: 'Pedir comida, entender preços e comprar com segurança.' },
  { id: 6, title: 'Cidade e direção', icon: '🗺️', color: '#1687e8', description: 'Locais, transporte, direções e pedidos de ajuda.' },
  { id: 7, title: 'Estudo e trabalho', icon: '💼', color: '#7c5cff', description: 'Tarefas, habilidades e comunicação básica profissional.' },
  { id: 8, title: 'Conversação A1', icon: '💬', color: '#16a66a', description: 'Conversas reais curtas para consolidar todo o nível iniciante.' },
  { id: 9, title: 'Corpo e saúde', icon: '🩺', color: '#e34f65', description: 'Descrever sintomas, pedir ajuda e falar de hábitos saudáveis.' },
  { id: 10, title: 'Clima e planos', icon: '🌤️', color: '#1687e8', description: 'Entender o clima, escolher roupas e combinar atividades.' },
  { id: 11, title: 'Falando do passado', icon: '⏪', color: '#7c5cff', description: 'Contar acontecimentos simples e fazer perguntas sobre ontem.' },
  { id: 12, title: 'Viagem prática', icon: '✈️', color: '#ed8b20', description: 'Resolver situações em aeroportos, hotéis e passeios.' },
  { id: 13, title: 'Vida social', icon: '🤝', color: '#16a66a', description: 'Fazer convites, dar opiniões e expressar emoções.' },
  { id: 14, title: 'Missões do mundo real', icon: '🌎', color: '#087fce', description: 'Integrar o nível A1 em conversas completas e úteis.' },
  { id: 18, title: 'Gramática que vira fala', icon: '🗣️', color: '#7c5cff', description: 'Pratique estruturas fundamentais dentro de frases e perguntas úteis.' },
  { id: 19, title: 'Conexões digitais', icon: '💻', color: '#1687e8', description: 'Formulários, mensagens, chamadas e segurança básica na internet.' },
  { id: 20, title: 'Consolidação A1', icon: '🏁', color: '#16a66a', description: 'Missões cumulativas para usar o conteúdo com mais autonomia.' },
  { id: 21, title: 'Ponte para o A2', icon: '🌉', color: '#087fce', description: 'Conectores, frequência e frases mais longas para sair do inglês isolado.' },
  { id: 22, title: 'Experiências e histórias', icon: '📖', color: '#7c5cff', description: 'Conte acontecimentos com contexto, sequência e detalhes importantes.' },
  { id: 23, title: 'Planos e decisões', icon: '🧭', color: '#ed8b20', description: 'Fale de intenções, previsões, escolhas e possibilidades reais.' },
  { id: 24, title: 'Inglês profissional', icon: '💼', color: '#1687e8', description: 'Participe de reuniões, escreva mensagens e descreva responsabilidades.' },
  { id: 25, title: 'Conversas com opinião', icon: '💬', color: '#16a66a', description: 'Explique preferências, concorde, discorde e sustente ideias simples.' },
  { id: 26, title: 'Serviços e imprevistos', icon: '🛠️', color: '#e34f65', description: 'Resolva problemas em compras, transporte, hospedagem e atendimento.' },
  { id: 27, title: 'Mídia e tecnologia', icon: '📱', color: '#1687e8', description: 'Converse sobre conteúdo, aplicativos, hábitos digitais e instruções.' },
  { id: 28, title: 'Leitura e escrita A2', icon: '✍️', color: '#7c5cff', description: 'Compreenda textos curtos e escreva mensagens e relatos organizados.' },
  { id: 29, title: 'Missões A2', icon: '🚀', color: '#087fce', description: 'Integre escuta, vocabulário e produção em desafios do mundo real.' },
];

const foundationRawLessons = [
  [15, 'O alfabeto', 'Reconheça letras e soletre palavras', [['letter','letra'],['alphabet','alfabeto'],['spell','soletrar'],['name','nome']], ['This is the English alphabet.','Este é o alfabeto inglês.'], ['How do you spell your name?','C-A-R-L-O-S.']],
  [15, 'Vogais e sons', 'Perceba os sons básicos antes de falar', [['sound','som'],['vowel','vogal'],['listen','ouvir'],['repeat','repetir']], ['Listen and repeat the sound.','Ouça e repita o som.'], ['Can you repeat the vowel?','Yes, listen: A.']],
  [15, 'Palavra e frase', 'Entenda as peças de uma atividade', [['word','palavra'],['sentence','frase'],['question','pergunta'],['answer','resposta']], ['This is a short sentence.','Esta é uma frase curta.'], ['Is this a question?','No, it is an answer.']],
  [15, 'Comandos da aula', 'Siga instruções simples do curso', [['choose','escolher'],['read','ler'],['write','escrever'],['match','combinar']], ['Read the word and choose.','Leia a palavra e escolha.'], ['What do I write?','Write the correct answer.']],
  [16, 'Eu e você', 'Monte suas primeiras frases com to be', [['I','eu'],['you','você'],['am','sou/estou'],['are','é/está/são']], ['I am a student.','Eu sou estudante.'], ['Are you ready?','Yes, I am ready.']],
  [16, 'Isto e aquilo', 'Aponte objetos próximos e distantes', [['this','isto/este'],['that','aquilo/aquele'],['here','aqui'],['there','ali/lá']], ['This is my book.','Este é o meu livro.'], ['Is that your pen?','Yes, it is over there.']],
  [16, 'Não entendi', 'Peça ajuda desde a primeira semana', [['understand','entender'],['mean','significar'],['again','novamente'],['slowly','devagar']], ['I do not understand.','Eu não entendo.'], ['What does this mean?','Please say it again slowly.']],
  [16, 'Durante a prática', 'Fale sobre acertos e dificuldade', [['correct','correto'],['wrong','errado'],['easy','fácil'],['difficult','difícil']], ['This answer is correct.','Esta resposta está correta.'], ['Is the exercise difficult?','No, it is easy.']],
  [17, 'Do zero ao dez', 'Conte pequenas quantidades', [['zero','zero'],['three','três'],['five','cinco'],['ten','dez']], ['I have three books.','Eu tenho três livros.'], ['How many pens are here?','There are five pens.']],
  [17, 'Até cem', 'Entenda idades, preços e quantidades', [['eleven','onze'],['twenty','vinte'],['fifty','cinquenta'],['hundred','cem']], ['The price is twenty dollars.','O preço é vinte dólares.'], ['How old are you?','I am twenty years old.']],
  [17, 'Telefone e códigos', 'Dite informações número por número', [['phone','telefone'],['number','número'],['code','código'],['call','ligar']], ['My phone number starts with five.','Meu telefone começa com cinco.'], ['What is the code?','The code is one, two, three.']],
  [17, 'Dias e datas', 'Localize informações no calendário', [['Monday','segunda-feira'],['today','hoje'],['date','data'],['birthday','aniversário']], ['Today is Monday.','Hoje é segunda-feira.'], ['What is the date today?','It is May tenth.']],
];

const legacyRawLessons = [
  [1, 'Hello!', 'Cumprimente alguém', [['hello','olá'],['hi','oi'],['goodbye','tchau'],['please','por favor']], ['Hello, how are you?','Olá, como você está?'], ['Hi! Nice to meet you.','Hello! Nice to meet you.']],
  [1, 'Sim e não', 'Responda com clareza', [['yes','sim'],['no','não'],['maybe','talvez'],['okay','tudo bem']], ['Yes, please.','Sim, por favor.'], ['Would you like water?','Yes, please.']],
  [1, 'Obrigado', 'Seja gentil em qualquer situação', [['thanks','obrigado'],['sorry','desculpe'],['welcome','bem-vindo'],['excuse me','com licença']], ['Thank you very much.','Muito obrigado.'], ['Thank you for your help.','You are welcome.']],
  [2, 'Meu nome', 'Apresente-se', [['name','nome'],['my','meu/minha'],['your','seu/sua'],['friend','amigo']], ['My name is Ana.','Meu nome é Ana.'], ['What is your name?','My name is Leo.']],
  [2, 'De onde você é?', 'Fale de origem', [['from','de'],['Brazil','Brasil'],['city','cidade'],['country','país']], ['I am from Brazil.','Eu sou do Brasil.'], ['Where are you from?','I am from Brazil.']],
  [2, 'Idade e números', 'Use números em frases', [['one','um'],['ten','dez'],['twenty','vinte'],['years old','anos de idade']], ['I am twenty years old.','Eu tenho vinte anos.'], ['How old are you?','I am twenty years old.']],
  [2, 'Gostos', 'Diga do que gosta', [['like','gostar'],['love','amar'],['music','música'],['books','livros']], ['I like music.','Eu gosto de música.'], ['Do you like books?','Yes, I love books.']],
  [3, 'Minha família', 'Apresente pessoas próximas', [['mother','mãe'],['father','pai'],['sister','irmã'],['brother','irmão']], ['This is my sister.','Esta é minha irmã.'], ['Who is she?','She is my sister.']],
  [3, 'Em casa', 'Nomeie os cômodos', [['house','casa'],['room','quarto'],['kitchen','cozinha'],['bathroom','banheiro']], ['The kitchen is small.','A cozinha é pequena.'], ['Where is the bathroom?','It is over there.']],
  [3, 'Objetos comuns', 'Encontre o que precisa', [['table','mesa'],['chair','cadeira'],['door','porta'],['key','chave']], ['The key is on the table.','A chave está sobre a mesa.'], ['Where is the key?','It is on the table.']],
  [4, 'Começar o dia', 'Fale da manhã', [['wake up','acordar'],['breakfast','café da manhã'],['morning','manhã'],['shower','banho']], ['I wake up in the morning.','Eu acordo de manhã.'], ['What do you do first?','I take a shower.']],
  [4, 'Ações diárias', 'Descreva sua rotina', [['work','trabalhar'],['study','estudar'],['read','ler'],['sleep','dormir']], ['I study English every day.','Eu estudo inglês todos os dias.'], ['Do you study at night?','Yes, I study at night.']],
  [4, 'Horas e dias', 'Combine ações e horários', [['today','hoje'],['tomorrow','amanhã'],['hour','hora'],['night','noite']], ['I work today.','Eu trabalho hoje.'], ['Do you work tomorrow?','No, I work today.']],
  [5, 'Comidas básicas', 'Fale do que come', [['bread','pão'],['rice','arroz'],['fruit','fruta'],['water','água']], ['I would like water.','Eu gostaria de água.'], ['What would you like?','I would like water.']],
  [5, 'No restaurante', 'Faça um pedido simples', [['menu','cardápio'],['coffee','café'],['bill','conta'],['hungry','com fome']], ['Can I have the menu, please?','Pode me trazer o cardápio, por favor?'], ['Are you ready to order?','Yes, I would like coffee.']],
  [5, 'Quanto custa?', 'Pergunte preços', [['price','preço'],['money','dinheiro'],['cheap','barato'],['expensive','caro']], ['How much is this?','Quanto custa isto?'], ['It is ten dollars.','Okay, that is cheap.']],
  [6, 'Lugares da cidade', 'Localize serviços', [['school','escola'],['market','mercado'],['hospital','hospital'],['station','estação']], ['The station is near the market.','A estação fica perto do mercado.'], ['Where is the station?','It is near the market.']],
  [6, 'Direções', 'Entenda o caminho', [['left','esquerda'],['right','direita'],['straight','reto'],['near','perto']], ['Turn left and go straight.','Vire à esquerda e siga reto.'], ['Is the bank near?','Yes, go straight.']],
  [6, 'Transporte', 'Desloque-se pela cidade', [['bus','ônibus'],['train','trem'],['car','carro'],['ticket','passagem']], ['I need a bus ticket.','Eu preciso de uma passagem de ônibus.'], ['One ticket, please.','Here is your ticket.']],
  [7, 'Na escola', 'Comunique necessidades de estudo', [['teacher','professor'],['student','aluno'],['question','pergunta'],['answer','resposta']], ['I have a question.','Eu tenho uma pergunta.'], ['Do you know the answer?','No, I have a question.']],
  [7, 'No trabalho', 'Fale de tarefas', [['job','trabalho'],['meeting','reunião'],['email','e-mail'],['computer','computador']], ['I have a meeting today.','Eu tenho uma reunião hoje.'], ['Did you send the email?','Yes, before the meeting.']],
  [7, 'Habilidades', 'Diga o que consegue fazer', [['can','poder/conseguir'],['speak','falar'],['write','escrever'],['understand','entender']], ['I can understand English.','Eu consigo entender inglês.'], ['Can you speak English?','Yes, a little.']],
  [8, 'Pedindo ajuda', 'Resolva pequenos problemas', [['help','ajuda'],['need','precisar'],['repeat','repetir'],['slowly','devagar']], ['Can you repeat slowly, please?','Pode repetir devagar, por favor?'], ['Do you need help?','Yes, please repeat slowly.']],
  [8, 'Conversa completa', 'Una tudo em uma interação real', [['nice','legal/agradável'],['meet','conhecer'],['again','novamente'],['see you','até mais']], ['It was nice to meet you.','Foi um prazer conhecer você.'], ['It was nice to meet you.','Nice to meet you too. See you!']],
  [9, 'Partes do corpo', 'Descreva onde sente algo', [['head','cabeça'],['hand','mão'],['back','costas'],['stomach','estômago']], ['My back hurts today.','Minhas costas doem hoje.'], ['Where does it hurt?','My back hurts.']],
  [9, 'Como você se sente?', 'Explique sintomas comuns', [['sick','doente'],['tired','cansado'],['fever','febre'],['headache','dor de cabeça']], ['I have a headache.','Eu estou com dor de cabeça.'], ['How do you feel?','I feel tired and sick.']],
  [9, 'No médico', 'Peça atendimento básico', [['doctor','médico'],['medicine','remédio'],['appointment','consulta'],['better','melhor']], ['I need a doctor, please.','Eu preciso de um médico, por favor.'], ['Do you have an appointment?','Yes, at ten o’clock.']],
  [9, 'Hábitos saudáveis', 'Fale de cuidado pessoal', [['exercise','exercício'],['healthy','saudável'],['rest','descansar'],['walk','caminhar']], ['I walk every morning.','Eu caminho toda manhã.'], ['How do you stay healthy?','I exercise and drink water.']],
  [10, 'Como está o tempo?', 'Entenda previsões simples', [['sunny','ensolarado'],['rainy','chuvoso'],['cold','frio'],['hot','quente']], ['It is sunny and hot today.','Está ensolarado e quente hoje.'], ['How is the weather?','It is cold and rainy.']],
  [10, 'Roupas', 'Escolha o que vestir', [['shirt','camisa'],['jacket','jaqueta'],['shoes','sapatos'],['dress','vestido']], ['I need a warm jacket.','Eu preciso de uma jaqueta quente.'], ['What are you wearing?','A blue shirt and black shoes.']],
  [10, 'Estações do ano', 'Converse sobre épocas do ano', [['summer','verão'],['winter','inverno'],['spring','primavera'],['autumn','outono']], ['Summer is my favorite season.','O verão é minha estação favorita.'], ['Do you like winter?','Yes, but I prefer summer.']],
  [10, 'Planos para o fim de semana', 'Combine uma atividade', [['weekend','fim de semana'],['visit','visitar'],['park','parque'],['plan','plano']], ['We are going to the park.','Nós vamos ao parque.'], ['What is your weekend plan?','I am going to visit my friend.']],
  [11, 'Ontem', 'Conte o que fez', [['yesterday','ontem'],['went','foi/fui'],['saw','viu/vi'],['stayed','ficou/fiquei']], ['I stayed home yesterday.','Eu fiquei em casa ontem.'], ['Where did you go yesterday?','I went to the market.']],
  [11, 'Uma viagem passada', 'Relate uma experiência curta', [['trip','viagem'],['visited','visitou/visitei'],['arrived','chegou/cheguei'],['left','partiu/parti']], ['We arrived early in the morning.','Nós chegamos cedo de manhã.'], ['Did you enjoy the trip?','Yes, I visited many places.']],
  [11, 'Momentos importantes', 'Fale de acontecimentos pessoais', [['started','começou/comecei'],['finished','terminou/terminei'],['learned','aprendeu/aprendi'],['moved','mudou/mudei']], ['I started a new job.','Eu comecei um novo trabalho.'], ['When did you move here?','I moved here last year.']],
  [11, 'Perguntas no passado', 'Pergunte e responda sobre experiências', [['did','auxiliar do passado'],['when','quando'],['where','onde'],['why','por quê']], ['Why did you study English?','Por que você estudou inglês?'], ['Did you call your friend?','Yes, I called her yesterday.']],
  [12, 'No aeroporto', 'Encontre seu voo', [['flight','voo'],['passport','passaporte'],['gate','portão'],['luggage','bagagem']], ['Where is gate twelve?','Onde fica o portão doze?'], ['May I see your passport?','Yes, here it is.']],
  [12, 'No hotel', 'Faça check-in e pedidos', [['reservation','reserva'],['reception','recepção'],['towel','toalha'],['checkout','saída do hotel']], ['I have a reservation.','Eu tenho uma reserva.'], ['Can I have an extra towel?','Of course. I will bring one.']],
  [12, 'Conhecendo a cidade', 'Peça recomendações locais', [['museum','museu'],['beach','praia'],['map','mapa'],['tour','passeio']], ['Can you show me on the map?','Pode me mostrar no mapa?'], ['What should I visit?','The museum is very interesting.']],
  [12, 'Problemas na viagem', 'Explique o que deu errado', [['lost','perdido'],['late','atrasado'],['closed','fechado'],['problem','problema']], ['My luggage is lost.','Minha bagagem está perdida.'], ['What is the problem?','My flight is late.']],
  [13, 'Fazendo convites', 'Convide e responda com educação', [['invite','convidar'],['party','festa'],['free','livre'],['together','juntos']], ['Would you like to come with us?','Você gostaria de vir conosco?'], ['Are you free tonight?','Yes, let’s have dinner together.']],
  [13, 'Dando opiniões', 'Concorde e discorde', [['think','achar/pensar'],['agree','concordar'],['different','diferente'],['interesting','interessante']], ['I think this book is interesting.','Eu acho este livro interessante.'], ['Do you agree with me?','I understand, but I think differently.']],
  [13, 'Sentimentos', 'Expresse como se sente', [['happy','feliz'],['worried','preocupado'],['excited','animado'],['afraid','com medo']], ['I am excited about the trip.','Eu estou animado com a viagem.'], ['Why are you worried?','I have an important meeting.']],
  [13, 'Telefone e mensagens', 'Deixe um recado simples', [['call','ligar'],['message','mensagem'],['later','mais tarde'],['busy','ocupado']], ['Can I call you later?','Posso ligar para você mais tarde?'], ['Is Marta there?','She is busy. Can I take a message?']],
  [14, 'Pedidos educados', 'Consiga ajuda sem soar direto demais', [['could','poderia'],['would','gostaria/poderia'],['mind','se importar'],['favor','favor']], ['Could you help me, please?','Você poderia me ajudar, por favor?'], ['Would you mind opening the door?','Not at all.']],
  [14, 'Comparando opções', 'Escolha entre alternativas', [['bigger','maior'],['smaller','menor'],['faster','mais rápido'],['easier','mais fácil']], ['The train is faster than the bus.','O trem é mais rápido que o ônibus.'], ['Which option is easier?','The first one is easier.']],
  [14, 'Contando uma história', 'Organize fatos em sequência', [['first','primeiro'],['then','então/depois'],['after','depois'],['finally','finalmente']], ['First we ate, then we walked.','Primeiro comemos, depois caminhamos.'], ['What happened after that?','Finally, we went home.']],
  [14, 'Missão final A1', 'Resolva uma conversa completa', [['ready','pronto'],['remember','lembrar'],['practice','praticar'],['continue','continuar']], ['I am ready to continue learning.','Eu estou pronto para continuar aprendendo.'], ['Can you have a basic conversation now?','Yes, and I will continue practicing.']],
];

const extensionRawLessons = [
  [18, 'He, she, we, they', 'Fale sobre outras pessoas', [['he','ele'],['she','ela'],['we','nós'],['they','eles/elas']], ['They are my friends.','Eles são meus amigos.'], ['Who is she?','She is my teacher.']],
  [18, 'Frases negativas', 'Diga o que não é ou não acontece', [['not','não'],["isn't",'não é/não está'],["aren't",'não são/não estão'],["don't",'não faço/fazem']], ['She is not tired.','Ela não está cansada.'], ['Are they at home?','No, they are not at home.']],
  [18, 'Perguntas essenciais', 'Use palavras interrogativas em contexto', [['what','o quê/qual'],['who','quem'],['where','onde'],['how','como']], ['Where is your school?','Onde fica sua escola?'], ['How are you today?','I am fine, thank you.']],
  [18, 'Um ou vários', 'Use artigos e plurais básicos', [['a','um/uma'],['an','um/uma'],['one','um'],['many','muitos']], ['I have an orange and a banana.','Eu tenho uma laranja e uma banana.'], ['How many books do you have?','I have three books.']],
  [19, 'Preenchendo formulários', 'Informe seus dados com segurança', [['form','formulário'],['address','endereço'],['email','e-mail'],['password','senha']], ['Please enter your email address.','Digite seu endereço de e-mail.'], ['What goes in this field?','Write your name and address.']],
  [19, 'Mensagens', 'Envie e responda recados simples', [['send','enviar'],['receive','receber'],['reply','responder'],['attach','anexar']], ['I will reply to your message.','Eu vou responder à sua mensagem.'], ['Did you receive my email?','Yes, I will reply today.']],
  [19, 'Chamada de vídeo', 'Resolva situações comuns em reuniões', [['camera','câmera'],['microphone','microfone'],['mute','silenciar'],['screen','tela']], ['Your microphone is on mute.','Seu microfone está silenciado.'], ['Can you see my screen?','Yes, but your camera is off.']],
  [19, 'Segurança online', 'Proteja informações pessoais', [['safe','seguro'],['link','link'],['account','conta'],['private','privado']], ['Keep your password private.','Mantenha sua senha privada.'], ['Is this link safe?','I do not know. Do not open it.']],
  [20, 'Minha apresentação', 'Una nome, origem, rotina e preferências', [['introduce','apresentar'],['live','morar'],['enjoy','gostar/aproveitar'],['usually','geralmente']], ['I usually study in the evening.','Eu geralmente estudo à noite.'], ['Can you introduce yourself?','My name is Ana and I live in Brazil.']],
  [20, 'Um dia completo', 'Conecte ações em ordem', [['early','cedo'],['before','antes'],['during','durante'],['after','depois']], ['I study after work.','Eu estudo depois do trabalho.'], ['What do you do before work?','I have breakfast and read.']],
  [20, 'Resolver um problema', 'Explique, peça ajuda e confirme a solução', [['explain','explicar'],['check','verificar'],['fix','consertar'],['solved','resolvido']], ['Can you explain the problem?','Você pode explicar o problema?'], ['Is everything okay now?','Yes, the problem is solved.']],
  [20, 'Checkpoint A1', 'Complete uma conversa cumulativa final', [['confident','confiante'],['improve','melhorar'],['goal','objetivo'],['next','próximo']], ['My next goal is to improve my English.','Meu próximo objetivo é melhorar meu inglês.'], ['Do you feel more confident now?','Yes, and I will keep practicing every day.']],
];

const a2RawLessons = [
  [21, 'Conectando ideias', 'Una pensamentos com and, but, because e so', [['because','porque'],['although','embora'],['so','então/por isso'],['however','porém']], ['I stayed home because it was raining.','Eu fiquei em casa porque estava chovendo.'], ['Why did you leave early?','Because I was tired.']],
  [21, 'Com que frequência?', 'Descreva hábitos com mais precisão', [['always','sempre'],['often','frequentemente'],['sometimes','às vezes'],['never','nunca']], ['I often practice English before work.','Eu frequentemente pratico inglês antes do trabalho.'], ['How often do you exercise?','I exercise three times a week.']],
  [21, 'Quantidades reais', 'Use some, any, much e many', [['some','algum/alguns'],['any','algum/nenhum'],['much','muito'],['enough','suficiente']], ['We do not have enough time.','Nós não temos tempo suficiente.'], ['Do you have any questions?','Yes, I have some questions.']],
  [21, 'Descrevendo melhor', 'Combine adjetivos e detalhes úteis', [['quiet','silencioso'],['crowded','lotado'],['comfortable','confortável'],['useful','útil']], ['This place is quiet and comfortable.','Este lugar é silencioso e confortável.'], ['What is the neighborhood like?','It is busy but very safe.']],
  [22, 'Passado em sequência', 'Organize acontecimentos com clareza', [['before','antes'],['afterwards','depois'],['suddenly','de repente'],['during','durante']], ['Suddenly, the lights went out.','De repente, as luzes se apagaram.'], ['What happened afterwards?','We called for help.']],
  [22, 'Enquanto acontecia', 'Use passado contínuo em contexto', [['while','enquanto'],['waiting','esperando'],['driving','dirigindo'],['working','trabalhando']], ['I was working when you called.','Eu estava trabalhando quando você ligou.'], ['What were you doing at eight?','I was having dinner.']],
  [22, 'Experiências de vida', 'Fale do que já viveu sem marcar uma data', [['ever','alguma vez'],['never','nunca'],['already','já'],['yet','ainda']], ['I have already visited that museum.','Eu já visitei aquele museu.'], ['Have you ever traveled alone?','No, I have never traveled alone.']],
  [22, 'Uma história curta', 'Crie começo, conflito e conclusão', [['beginning','começo'],['event','acontecimento'],['ending','final'],['lesson','lição']], ['The story has a surprising ending.','A história tem um final surpreendente.'], ['What did you learn from it?','I learned to plan ahead.']],
  [23, 'Intenções com going to', 'Explique planos já decididos', [['intend','pretender'],['prepare','preparar'],['organize','organizar'],['next month','próximo mês']], ['I am going to start a new course.','Eu vou começar um novo curso.'], ['What are you going to do tonight?','I am going to study.']],
  [23, 'Previsões com will', 'Fale do que acredita que acontecerá', [['probably','provavelmente'],['future','futuro'],['expect','esperar'],['prediction','previsão']], ['It will probably be sunny tomorrow.','Provavelmente fará sol amanhã.'], ['Will the meeting be long?','I think it will be quick.']],
  [23, 'Possibilidades', 'Use may, might e could sem afirmar demais', [['maybe','talvez'],['might','pode ser que'],['possible','possível'],['chance','chance']], ['We might arrive a little late.','Talvez nós cheguemos um pouco atrasados.'], ['Is the store open?','It may be open until nine.']],
  [23, 'Escolhas e conselhos', 'Compare opções e recomende ações', [['should','deveria'],['instead','em vez disso'],['choice','escolha'],['recommend','recomendar']], ['You should take the earlier train.','Você deveria pegar o trem mais cedo.'], ['Which one do you recommend?','I recommend the smaller one.']],
  [24, 'Minha experiência', 'Apresente habilidades e responsabilidades', [['experience','experiência'],['responsible','responsável'],['task','tarefa'],['improve','melhorar']], ['I am responsible for customer support.','Eu sou responsável pelo atendimento ao cliente.'], ['What experience do you have?','I have two years of experience.']],
  [24, 'Reuniões objetivas', 'Contribua e confirme decisões', [['agenda','pauta'],['decision','decisão'],['deadline','prazo'],['update','atualização']], ['Let us review the agenda first.','Vamos revisar a pauta primeiro.'], ['What is the deadline?','The deadline is Friday.']],
  [24, 'E-mails claros', 'Escreva pedidos e respostas profissionais', [['subject','assunto'],['forward','encaminhar'],['confirm','confirmar'],['regards','atenciosamente']], ['Could you confirm the meeting time?','Você poderia confirmar o horário da reunião?'], ['Did you receive the document?','Yes, thank you for sending it.']],
  [24, 'Explicando um processo', 'Dê instruções de trabalho em etapas', [['step','etapa'],['first','primeiro'],['next','em seguida'],['complete','concluir']], ['Next, check all the information.','Em seguida, verifique todas as informações.'], ['What is the final step?','Send the completed form.']],
  [25, 'Dando sua opinião', 'Apresente uma ideia com uma razão', [['opinion','opinião'],['reason','razão'],['believe','acreditar'],['point','ponto']], ['In my opinion, this option is better.','Na minha opinião, esta opção é melhor.'], ['Why do you think that?','Because it is easier to use.']],
  [25, 'Concordar e discordar', 'Responda com respeito e nuance', [['agree','concordar'],['disagree','discordar'],['exactly','exatamente'],['perhaps','talvez']], ['I agree with your main point.','Eu concordo com seu ponto principal.'], ['Do you agree with the plan?','Not completely. It may cost too much.']],
  [25, 'Preferências detalhadas', 'Compare experiências e explique escolhas', [['prefer','preferir'],['rather','preferir/antes'],['favorite','favorito'],['especially','especialmente']], ['I would rather stay home tonight.','Eu preferiria ficar em casa hoje.'], ['Which do you prefer?','I prefer the blue one because it is simpler.']],
  [25, 'Mantendo a conversa', 'Faça perguntas que aprofundam o assunto', [['really','mesmo/sério'],['interesting','interessante'],['tell me','conte-me'],['what about','e quanto a']], ['That sounds really interesting.','Isso parece muito interessante.'], ['What about your experience?','It was difficult but useful.']],
  [26, 'Trocas e devoluções', 'Explique um problema com uma compra', [['receipt','recibo'],['refund','reembolso'],['exchange','troca'],['damaged','danificado']], ['I would like to exchange this item.','Eu gostaria de trocar este item.'], ['Do you have the receipt?','Yes, and the product is damaged.']],
  [26, 'Atrasos e cancelamentos', 'Busque alternativas de transporte', [['delayed','atrasado'],['cancelled','cancelado'],['platform','plataforma'],['alternative','alternativa']], ['My train has been cancelled.','Meu trem foi cancelado.'], ['Is there another option?','Yes, take the bus from platform two.']],
  [26, 'Problemas no hotel', 'Descreva a situação e negocie uma solução', [['noisy','barulhento'],['available','disponível'],['manager','gerente'],['solution','solução']], ['The room is too noisy at night.','O quarto é barulhento demais à noite.'], ['Is another room available?','Yes, we can move you upstairs.']],
  [26, 'Pedindo suporte', 'Relate falhas e confirme o atendimento', [['support','suporte'],['issue','problema'],['restart','reiniciar'],['working','funcionando']], ['The application is not working.','O aplicativo não está funcionando.'], ['Have you tried restarting it?','Yes, but the issue continues.']],
  [27, 'Aplicativos e recursos', 'Explique como usa ferramentas digitais', [['feature','recurso'],['setting','configuração'],['notification','notificação'],['install','instalar']], ['You can change this in the settings.','Você pode mudar isso nas configurações.'], ['How do I turn off notifications?','Open the settings menu.']],
  [27, 'Conteúdo online', 'Fale de vídeos, textos e fontes', [['article','artigo'],['channel','canal'],['source','fonte'],['share','compartilhar']], ['I found this article very useful.','Eu achei este artigo muito útil.'], ['Where did you find it?','A friend shared the link.']],
  [27, 'Hábitos digitais', 'Descreva tempo de tela e escolhas', [['online','online'],['screen time','tempo de tela'],['limit','limite'],['habit','hábito']], ['I try to limit my screen time.','Eu tento limitar meu tempo de tela.'], ['How much time do you spend online?','About two hours a day.']],
  [27, 'Segurança e privacidade', 'Tome decisões seguras na internet', [['privacy','privacidade'],['permission','permissão'],['scam','golpe'],['verify','verificar']], ['Always verify the sender before clicking.','Sempre verifique o remetente antes de clicar.'], ['Does this message look safe?','No, it may be a scam.']],
  [28, 'Lendo pelo contexto', 'Use palavras vizinhas para inferir sentido', [['context','contexto'],['clue','pista'],['meaning','significado'],['guess','deduzir']], ['Use the context to guess the meaning.','Use o contexto para deduzir o significado.'], ['Do you know this word?','No, but the sentence gives me a clue.']],
  [28, 'Mensagem organizada', 'Escreva abertura, informação e fechamento', [['opening','abertura'],['detail','detalhe'],['closing','encerramento'],['paragraph','parágrafo']], ['Add the important details in the second paragraph.','Adicione os detalhes importantes no segundo parágrafo.'], ['How should I end the message?','Use a short and polite closing.']],
  [28, 'Relato pessoal', 'Escreva sobre uma experiência recente', [['recently','recentemente'],['experience','experiência'],['enjoyed','gostou/gostei'],['learned','aprendeu/aprendi']], ['Recently, I started learning a new skill.','Recentemente, comecei a aprender uma nova habilidade.'], ['What did you learn?','I learned how to organize my time.']],
  [28, 'Revisão do próprio texto', 'Encontre problemas simples antes de enviar', [['review','revisar'],['mistake','erro'],['clear','claro'],['replace','substituir']], ['Review your message before you send it.','Revise sua mensagem antes de enviá-la.'], ['Is this sentence clear?','Not yet. Replace the last word.']],
  [29, 'Missão: fazer amizade', 'Sustente uma conversa curta com perguntas', [['conversation','conversa'],['follow-up','continuação'],['common','em comum'],['contact','contato']], ['We have a lot in common.','Nós temos muito em comum.'], ['Would you like to stay in contact?','Yes, let us exchange numbers.']],
  [29, 'Missão: dia de trabalho', 'Resolva uma sequência de tarefas profissionais', [['priority','prioridade'],['schedule','agenda'],['colleague','colega'],['report','relatório']], ['This report is my main priority today.','Este relatório é minha principal prioridade hoje.'], ['Can we change the schedule?','Yes, I will ask my colleague.']],
  [29, 'Missão: viagem independente', 'Tome decisões e resolva dois imprevistos', [['journey','viagem/trajeto'],['booking','reserva'],['local','morador/local'],['route','rota']], ['I changed my booking after the delay.','Eu alterei minha reserva depois do atraso.'], ['Which route should we take?','Let us ask a local person.']],
  [29, 'Checkpoint A2', 'Integre histórias, planos, opiniões e soluções', [['independent','independente'],['communicate','comunicar'],['situation','situação'],['progress','progresso']], ['I can communicate in familiar situations.','Eu consigo me comunicar em situações familiares.'], ['What is your next English goal?','I want to speak with more confidence.']],
];

function createLesson([moduleId, title, description, words, phrase, dialogue], id) {
  return {
    id, module_id: moduleId, title, description,
  words: words.map(([en, pt]) => ({ en, pt })), phrase: { en: phrase[0], pt: phrase[1] }, dialogue: { prompt: dialogue[0], answer: dialogue[1] }, xp_reward: 40,
  };
}

const lessons = [
  ...foundationRawLessons.map((lesson, index) => createLesson(lesson, 49 + index)),
  ...legacyRawLessons.map((lesson, index) => createLesson(lesson, index + 1)),
  ...extensionRawLessons.map((lesson, index) => createLesson(lesson, 61 + index)),
  ...a2RawLessons.map((lesson, index) => createLesson(lesson, 73 + index)),
];

function alternatives(answer, pool, offset) {
  const filtered = [...new Set(pool.filter((value) => value !== answer))];
  return [answer, ...filtered.slice(offset % Math.max(1, filtered.length), offset % Math.max(1, filtered.length) + 3), ...filtered.slice(0, 3)].slice(0, 4);
}

const exercises = lessons.flatMap((lesson) => {
  const moduleWords = lessons.filter((item) => item.module_id === lesson.module_id).flatMap((item) => item.words);
  const word = lesson.words[0];
  const second = lesson.words[1];
  const englishPool = moduleWords.map((item) => item.en);
  const portuguesePool = moduleWords.map((item) => item.pt);
  const prefix = `en-${lesson.id}`;
  return [
    { id: `${prefix}-meaning`, lesson_id: lesson.id, type: 'choice', skill: 'Vocabulário', prompt: `O que significa “${word.en}”?`, correct_answer: word.pt, options: alternatives(word.pt, portuguesePool, lesson.id), explanation: `“${word.en}” significa “${word.pt}”.`, xp_reward: 8 },
    { id: `${prefix}-recall`, lesson_id: lesson.id, type: 'input', skill: 'Recuperação ativa', prompt: `Sem olhar as opções, escreva em inglês: “${second.pt}”`, correct_answer: second.en, explanation: `A forma esperada é “${second.en}”. Tentar lembrar antes de ver a resposta fortalece a memória.`, xp_reward: 10 },
    { id: `${prefix}-listen`, lesson_id: lesson.id, type: 'listen', skill: 'Compreensão oral', prompt: 'Ouça e escolha a frase que foi dita.', speak: lesson.phrase.en, correct_answer: lesson.phrase.en, options: alternatives(lesson.phrase.en, lessons.filter((item) => item.module_id === lesson.module_id).map((item) => item.phrase.en), lesson.id), explanation: `Você ouviu “${lesson.phrase.en}”, que significa “${lesson.phrase.pt}”.`, xp_reward: 10 },
    { id: `${prefix}-order`, lesson_id: lesson.id, type: 'order', skill: 'Construção de frase', prompt: `Monte em inglês: “${lesson.phrase.pt}”`, correct_answer: lesson.phrase.en, tokens: lesson.phrase.en.replace(/[?.!,]/g, '').split(' ').sort(() => 0.5 - ((lesson.id % 3) / 3)), explanation: `Ordem natural: “${lesson.phrase.en}”.`, xp_reward: 12 },
    { id: `${prefix}-dialogue`, lesson_id: lesson.id, type: 'choice', skill: 'Conversação', prompt: `Complete o diálogo:\n— ${lesson.dialogue.prompt}\n— …`, correct_answer: lesson.dialogue.answer, options: alternatives(lesson.dialogue.answer, lessons.filter((item) => item.module_id === lesson.module_id).map((item) => item.dialogue.answer), lesson.id + 1), explanation: `A resposta mais natural neste contexto é “${lesson.dialogue.answer}”.`, xp_reward: 10 },
  ];
});

export const englishCurriculum = { modules, lessons, exercises };

export function englishStats() {
  const state = store.state.english;
  const now = Date.now();
  const dueCards = Object.entries(state.flashcards).filter(([, card]) => !card.due || new Date(card.due).getTime() <= now).map(([id]) => id);
  const activeMistakes = state.mistakes.filter((item) => !item.mastered);
  const learnedWords = new Set(lessons.filter((lesson) => state.completedLessons.includes(lesson.id)).flatMap((lesson) => lesson.words.map((word) => word.en)));
  const courseWords = new Set(lessons.flatMap((lesson) => lesson.words.map((word) => word.en)));
  const nextLesson = lessons.find((lesson) => !state.completedLessons.includes(lesson.id)) ?? lessons.at(-1);
  const sessions = state.sessions ?? [];
  const totalMinutes = sessions.reduce((sum, session) => sum + (Number(session.minutes) || 0), 0);
  const accuracy = percent(state.totalCorrect, state.totalAttempted);
  const scheduledCards = Object.values(state.flashcards);
  const strongCards = scheduledCards.filter((card) => (card.repetitions ?? 0) >= 2).length;
  const memoryStrength = scheduledCards.length ? percent(strongCards, scheduledCards.length) : 0;
  const lastSevenDays = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (6 - offset));
    const key = date.toISOString().slice(0, 10);
    return { key, label: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''), ...(state.activity[key] ?? { xp: 0, exercises: 0, lessons: 0, minutes: 0 }) };
  });
  const weeklyLessons = lastSevenDays.reduce((sum, day) => sum + (day.lessons ?? 0), 0);
  const weeklyMinutes = lastSevenDays.reduce((sum, day) => sum + (day.minutes ?? 0), 0);
  const activeDays = lastSevenDays.filter((day) => (day.exercises ?? 0) > 0 || (day.minutes ?? 0) > 0).length;
  const remainingLessons = Math.max(0, lessons.length - state.completedLessons.length);
  const lessonsPerWeek = weeklyLessons || Math.min(state.weeklyGoalLessons ?? 5, 7);
  const estimatedWeeks = remainingLessons ? Math.max(1, Math.ceil(remainingLessons / Math.max(1, lessonsPerWeek))) : 0;
  let level = 'A0 · começando';
  if (state.completedLessons.length >= 12) level = 'A0 · fundamentos';
  if (state.completedLessons.length >= 28) level = 'Pré-A1';
  if (state.completedLessons.length >= 48) level = 'A1 · inicial';
  if (state.completedLessons.length >= 64) level = 'A1 · consolidando';
  if (state.completedLessons.length >= 72) level = 'A1 concluído · rumo A2';
  if (state.completedLessons.length >= 88) level = 'A2 · inicial';
  if (state.completedLessons.length >= 100) level = 'A2 · consolidando';
  if (state.completedLessons.length === lessons.length) level = 'A2 · trilha concluída';
  return { dueCards, activeMistakes, learnedWords: learnedWords.size, courseWords: courseWords.size, nextLesson, progress: percent(state.completedLessons.length, lessons.length), level, totalMinutes, accuracy, memoryStrength, lastSevenDays, weeklyLessons, weeklyMinutes, activeDays, remainingLessons, estimatedWeeks, lessonsPerWeek };
}

export function englishDashboardView() {
  const state = store.state.english;
  const stats = englishStats();
  const dailyDone = state.daily[new Date().toISOString().slice(0, 10)]?.completed;
  return `<section class="page english-page">
    <div class="english-hero">
      <div><span class="eyebrow">ENGLISHFLOW · ${lessons.length} LIÇÕES DO ZERO AO A2</span><h1>Aprenda inglês para <em>usar de verdade.</em></h1><p>Comece pelo alfabeto e avance até histórias, trabalho, opiniões e resolução de problemas com prática ativa, apostilas, provas e conversação guiada por IA.</p><div class="hero-actions"><a class="button button-primary" href="#/english/lesson/${stats.nextLesson.id}">${state.completedLessons.length ? 'Continuar trilha' : 'Começar do zero'} →</a><a class="button button-ghost-on-dark" href="#/english/guides">Abrir apostilas</a><a class="button button-ghost-on-dark" href="#/english/exams">Fazer uma prova</a></div></div>
      <div class="english-level"><span>${stats.level}</span><strong>${stats.progress}%</strong><small>${stats.learnedWords} palavras estudadas</small><div class="progress"><i style="width:${stats.progress}%"></i></div></div>
    </div>
    <div class="grid grid-4 metrics-mobile english-metrics">
      <div class="metric card"><span>⚡</span><div><strong>${state.xp}</strong><small>XP de inglês</small></div></div>
      <div class="metric card"><span>🔥</span><div><strong>${state.streak}</strong><small>dias seguidos</small></div></div>
      <div class="metric card"><span>🧠</span><div><strong>${stats.dueCards.length}</strong><small>revisões vencidas</small></div></div>
      <div class="metric card"><span>🎯</span><div><strong>${stats.progress}%</strong><small>da trilha A2</small></div></div>
    </div>
    <div class="layout-main">
      <div class="stack">
        <div class="card card-pad english-next"><div class="card-head"><div><span class="eyebrow">PRÓXIMO PASSO</span><h2>${escapeHtml(stats.nextLesson.title)}</h2><p>${escapeHtml(stats.nextLesson.description)}</p></div><span class="lesson-bubble">${modules.find((item) => item.id === stats.nextLesson.module_id).icon}</span></div><div class="method-strip"><span>👂 Ouvir</span><span>🧩 Montar</span><span>💬 Responder</span><span>🧠 Recordar</span></div><a class="button button-primary button-block" href="#/english/lesson/${stats.nextLesson.id}">Estudar por 8 minutos</a></div>
        <div class="card card-pad"><div class="card-head"><div><h2>Plano de hoje</h2><p>Conteúdo novo + recuperação + produção para lembrar por mais tempo.</p></div></div><div class="english-plan"><div class="${dailyDone ? 'done' : ''}"><b>1</b><span><strong>Missão rápida</strong><small>5 questões misturadas</small></span><button class="button button-sm" data-action="english-daily" type="button">${dailyDone ? 'Refazer' : 'Começar'}</button></div><div><b>2</b><span><strong>Revisão espaçada</strong><small>${stats.dueCards.length || stats.activeMistakes.length} itens para recuperar</small></span><a class="button button-sm button-ghost" href="#/english/review">Revisar</a></div><div><b>3</b><span><strong>Converse com a IA</strong><small>Uma pergunta por vez no seu nível</small></span><button class="button button-sm button-ghost" data-action="english-ai-conversation" data-agent="english_conversation" data-prompt="Quero fazer uma conversa curta em inglês no meu nível atual. Faça uma pergunta por vez, corrija com gentileza e aumente a dificuldade aos poucos." type="button">Conversar</button></div></div></div>
      </div>
      <aside class="stack"><div class="card card-pad"><div class="card-head"><div><h3>Seu centro de recursos</h3><p>Escolha o formato certo para cada momento.</p></div></div><div class="english-resource-links"><a href="#/english/guides"><span>▤</span><div><strong>8 apostilas práticas</strong><small>Resumo, áudio, exemplos e missão com IA</small></div><b>→</b></a><a href="#/english/exams"><span>✓</span><div><strong>6 provas e simulados</strong><small>Nivelamento, checkpoints A0, A1 e A2</small></div><b>→</b></a><a href="#/coach"><span>✦</span><div><strong>Coach de conversação</strong><small>Prática adaptada ao seu progresso</small></div><b>→</b></a></div></div><a class="card card-pad progress-teaser" href="#/english/progress"><span>📈</span><div><strong>Veja o que você pode alcançar</strong><small>Metas realistas, precisão, tempo e ritmo semanal.</small></div><b>→</b></a></aside>
    </div>
  </section>`;
}

export function englishLearnView() {
  const state = store.state.english;
  return `<section class="page english-page"><div class="page-head"><div><span class="eyebrow">CAMINHO A0 → A2</span><h1>Inglês do zero à autonomia básica</h1><p>${lessons.length} lições e ${exercises.length} práticas. Comece por letras e sons, consolide o A1 e atravesse a ponte para histórias, trabalho, opiniões e situações A2.</p></div><div class="hero-actions"><a class="button button-ghost" href="#/english/guides">Apostilas</a><a class="button button-ghost" href="#/english/exams">Provas</a><a class="button button-ghost" href="#/english">Painel</a></div></div><div class="module-list">${modules.map((module, moduleIndex) => {
    const moduleLessons = lessons.filter((lesson) => lesson.module_id === module.id);
    const completed = moduleLessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
    return `<article class="module-card card"><header class="module-head" style="--module-color:${module.color}"><div class="module-icon">${module.icon}</div><div><small>UNIDADE ${moduleIndex + 1}</small><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.description)}</p></div><div class="module-progress"><strong>${completed}/${moduleLessons.length}</strong><div class="progress"><i style="width:${percent(completed,moduleLessons.length)}%"></i></div></div></header><div class="lesson-list">${moduleLessons.map((lesson) => {
      const done = state.completedLessons.includes(lesson.id);
      const sequenceIndex = lessons.findIndex((item) => item.id === lesson.id);
      const unlocked = done || sequenceIndex === 0 || state.completedLessons.includes(lessons[sequenceIndex - 1].id);
      return `<${unlocked ? 'a' : 'div'} ${unlocked ? `href="#/english/lesson/${lesson.id}"` : ''} class="lesson-row ${done ? 'completed' : ''} ${unlocked ? '' : 'locked'}"><span class="lesson-node">${done ? '✓' : sequenceIndex + 1}</span><span><h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.description)} · 5 práticas</p></span><span class="lesson-meta"><strong>${state.lessonScores[lesson.id] ?? 0}%</strong><small>+${lesson.xp_reward} XP</small></span></${unlocked ? 'a' : 'div'}>`;
    }).join('')}</div></article>`;
  }).join('')}</div></section>`;
}

export function englishExerciseView(session) {
  const exercise = session.exercises[session.index];
  const lesson = lessons.find((item) => item.id === exercise.lesson_id);
  const value = escapeHtml(session.answer ?? '');
  const progress = percent(session.index, session.exercises.length);
  let answerArea = '';
  if (exercise.type === 'choice' || exercise.type === 'listen') answerArea = `<div class="answers">${exercise.options.map((option, index) => `<button class="answer-option ${session.answer === option ? 'selected' : ''}" data-english-answer="${escapeHtml(option)}" type="button"><span class="answer-key">${index + 1}</span><span>${escapeHtml(option)}</span></button>`).join('')}</div>`;
  if (exercise.type === 'input') answerArea = `<input class="text-answer" id="english-answer" autocomplete="off" autocapitalize="none" value="${value}" placeholder="Digite em inglês...">`;
  if (exercise.type === 'order') answerArea = `<div class="word-bank">${exercise.tokens.map((token) => `<button data-english-token="${escapeHtml(token)}" type="button">${escapeHtml(token)}</button>`).join('')}</div><input class="text-answer" id="english-answer" value="${value}" readonly placeholder="Toque nas palavras para montar a frase"><button class="text-button" data-action="english-clear-order" type="button">Limpar frase</button>`;
  return `<section class="page english-page lesson-shell"><div class="lesson-top"><a class="icon-button" href="#/english/${session.exitRoute}" aria-label="Sair">×</a><div class="progress"><i style="width:${progress}%"></i></div><span>${session.index + 1}/${session.exercises.length}</span></div>${session.mode !== 'exam' ? `<button class="lesson-ai-nudge" data-action="english-ai-conversation" data-agent="english_conversation" data-prompt="Quero conversar sobre a lição ${escapeHtml(lesson?.title ?? 'atual')}. Use o vocabulário desta etapa, faça uma pergunta por vez e corrija minha resposta." type="button"><span>✦</span><div><strong>Use esta lição em uma conversa</strong><small>Pratique com a IA no seu nível atual</small></div><b>Conversar →</b></button>` : `<div class="exam-mode-label"><span>✓</span><strong>${escapeHtml(session.examTitle ?? 'Prova de inglês')}</strong><small>Sem consultar apostilas durante a avaliação</small></div>`}<article class="question-card card"><div class="question-label"><span>${exercise.skill}</span><div><button class="audio-button" data-speak="${escapeHtml(exercise.speak ?? exercise.correct_answer)}" type="button">🔊 Ouvir</button><button class="audio-button" data-action="english-pronounce" type="button">🎙️ Falar</button></div></div><h2>${escapeHtml(exercise.prompt).replace(/\n/g,'<br>')}</h2>${answerArea}${session.checked ? `<div class="feedback ${session.correct ? 'correct' : 'wrong'}"><strong>${session.correct ? '✓ Muito bem!' : '↻ Quase lá.'}</strong><p>${escapeHtml(exercise.explanation)}</p>${!session.correct ? `<p><b>Resposta:</b> ${escapeHtml(exercise.correct_answer)}</p>` : ''}</div>` : ''}<div class="lesson-actions">${session.mode === 'exam' ? '<span></span>' : `<button class="button button-ghost" data-action="english-hint" type="button">${session.hint ? escapeHtml(session.hint) : 'Pedir dica'}</button>`}<button class="button button-primary" data-action="${session.checked ? 'english-next' : 'english-check'}" type="button">${session.checked ? 'Continuar →' : 'Verificar'}</button></div></article></section>`;
}

export function englishResultView(session) {
  const score = percent(session.correctCount, session.exercises.length);
  const passed = session.mode === 'exam' ? score >= session.passing : score >= 60;
  return `<section class="page english-page"><div class="card result-card"><div class="result-ring" style="--score:${score}%"><span><strong>${score}%</strong><small>acerto</small></span></div><h1>${session.mode === 'exam' ? (passed ? 'Prova concluída com sucesso!' : 'Você encontrou o próximo foco.') : score >= 80 ? 'Excelente prática!' : score >= 60 ? 'Bom avanço!' : 'O erro faz parte.'}</h1><p>Você acertou ${session.correctCount} de ${session.exercises.length}. ${session.mode === 'exam' ? `A meta desta prova era ${session.passing}%. Os erros já foram enviados para a revisão adaptativa.` : 'As dificuldades entram automaticamente na revisão espaçada.'}</p><div class="method-strip"><span>+${session.xpEarned} XP</span><span>${session.mode === 'lesson' ? 'Lição registrada' : session.mode === 'exam' ? `${escapeHtml(session.examTitle)} · ${passed ? 'aprovado' : 'revisar'}` : 'Prática registrada'}</span></div>${session.mode === 'exam' ? `<button class="lesson-ai-nudge result-coach" data-action="english-ai-conversation" data-agent="english_corrector" data-prompt="Acabei a prova ${escapeHtml(session.examTitle)} com ${score}%. Ajude-me a revisar meus pontos fracos com uma pergunta curta por vez." type="button"><span>✦</span><div><strong>Revise o resultado com a IA</strong><small>Receba uma prática curta baseada no seu progresso</small></div><b>Começar →</b></button>` : ''}<div class="hero-actions" style="justify-content:center"><a class="button button-primary" href="#/english/${session.exitRoute}">Continuar</a><button class="button button-ghost" data-action="english-repeat" type="button">Praticar novamente</button></div></div></section>`;
}

function formatStudyTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}

export function englishProgressView() {
  const state = store.state.english;
  const stats = englishStats();
  const completed = state.completedLessons.length;
  const maxActivity = Math.max(1, ...stats.lastSevenDays.map((day) => (day.exercises ?? 0) + (day.lessons ?? 0) * 2));
  const projections = [
    { lessons: 12, title: 'Fundação A0', icon: '🔤', words: 48, outcome: 'Reconhecer comandos, soletrar, usar números e montar frases mínimas sem conhecimento anterior.' },
    { lessons: 36, title: 'Sobrevivência prática', icon: '🧭', words: 144, outcome: 'Apresentar-se e lidar com família, rotina, alimentação, compras, direções, estudo e pedidos de ajuda.' },
    { lessons: 72, title: 'Base A1 ampliada', icon: '🌎', words: stats.courseWords, outcome: 'Participar de diálogos curtos sobre saúde, clima, passado, viagens, vida social, gramática prática e comunicação digital.' },
    { lessons: 108, title: 'Base A2 guiada', icon: '🚀', words: stats.courseWords, outcome: 'Narrar experiências, discutir planos, explicar opiniões e resolver situações familiares com mais detalhes e autonomia.' },
  ];
  const forecast = stats.remainingLessons ? `No ritmo de ${stats.lessonsPerWeek} ${stats.lessonsPerWeek === 1 ? 'lição' : 'lições'} por semana, a trilha pode ser concluída em cerca de ${stats.estimatedWeeks} ${stats.estimatedWeeks === 1 ? 'semana' : 'semanas'}.` : 'Você concluiu todo o conteúdo guiado. Continue revisando e usando inglês fora do site.';
  return `<section class="page english-page">
    <div class="page-head"><div><span class="eyebrow">PROGRESSO COM EXPECTATIVAS REAIS</span><h1>Suas estatísticas de inglês</h1><p>Dados calculados a partir das suas respostas e sessões neste dispositivo. Projeções são referências, não garantia de fluência ou certificação.</p></div><a class="button button-ghost" href="#/english">Painel de inglês</a></div>
    <div class="progress-summary card"><div><span class="level-seal">${stats.level}</span><h2>${completed} de ${lessons.length} lições concluídas</h2><p>${forecast}</p><div class="progress"><i style="width:${stats.progress}%"></i></div></div><div class="progress-score"><strong>${stats.progress}%</strong><small>da trilha</small></div></div>
    <div class="grid grid-4 metrics-mobile learning-stats">
      <div class="metric card"><span>⏱️</span><div><strong>${formatStudyTime(stats.totalMinutes)}</strong><small>tempo registrado</small></div></div>
      <div class="metric card"><span>🎯</span><div><strong>${state.totalAttempted ? `${stats.accuracy}%` : '—'}</strong><small>precisão geral</small></div></div>
      <div class="metric card"><span>ABC</span><div><strong>${stats.learnedWords}</strong><small>termos liberados</small></div></div>
      <div class="metric card"><span>📅</span><div><strong>${stats.activeDays}/7</strong><small>dias ativos na semana</small></div></div>
    </div>
    <div class="grid grid-2 progress-layout">
      <article class="card card-pad"><div class="card-head"><div><h2>Últimos 7 dias</h2><p>${stats.weeklyLessons} lições · ${stats.weeklyMinutes} minutos registrados</p></div></div><div class="study-chart">${stats.lastSevenDays.map((day) => {
        const amount = (day.exercises ?? 0) + (day.lessons ?? 0) * 2;
        return `<div><span><i style="height:${Math.max(amount ? 12 : 3, Math.round((amount / maxActivity) * 100))}%"></i></span><strong>${day.label}</strong><small>${day.exercises ?? 0}</small></div>`;
      }).join('')}</div><p class="chart-note">A barra combina exercícios e lições. O número abaixo mostra questões respondidas.</p></article>
      <article class="card card-pad"><div class="card-head"><div><h2>Qualidade do aprendizado</h2><p>Indicadores para decidir o que praticar agora.</p></div></div><div class="quality-list"><div><span>Precisão</span><strong>${state.totalAttempted ? `${stats.accuracy}%` : 'Sem dados'}</strong><i><b style="width:${state.totalAttempted ? stats.accuracy : 0}%"></b></i></div><div><span>Memória forte</span><strong>${stats.memoryStrength}%</strong><i><b style="width:${stats.memoryStrength}%"></b></i></div><div><span>Curso concluído</span><strong>${stats.progress}%</strong><i><b style="width:${stats.progress}%"></b></i></div></div><p class="chart-note">Meta saudável: manter pelo menos 80% de precisão e revisar cartões vencidos antes de acumular conteúdo novo.</p></article>
    </div>
    <section class="outcomes-section"><div class="section-title"><div><span class="eyebrow">O QUE VOCÊ PODE ALCANÇAR</span><h2>Marcos realistas da trilha</h2></div><span class="badge badge-purple">${lessons.length} lições · ${exercises.length} práticas</span></div><div class="grid grid-3 outcome-grid">${projections.map((item) => {
      const reached = completed >= item.lessons;
      const progress = percent(Math.min(completed, item.lessons), item.lessons);
      return `<article class="card outcome-card ${reached ? 'reached' : ''}"><span class="outcome-icon">${reached ? '✓' : item.icon}</span><small>APÓS ${item.lessons} LIÇÕES</small><h3>${item.title}</h3><p>${item.outcome}</p><div class="outcome-meta"><span>até ${Math.min(item.words, stats.courseWords)} termos centrais</span><strong>${progress}%</strong></div><div class="progress"><i style="width:${progress}%"></i></div></article>`;
    }).join('')}</div></section>
    <div class="reality-card card"><span>✓</span><div><h2>Resultado esperado com honestidade</h2><p>Com as ${lessons.length} lições, revisões regulares, provas, apostilas e cerca de 70–100 horas de prática total, você pode construir uma <strong>base A2 guiada nos temas cobertos</strong>, mesmo começando do zero. Isso não garante certificação nem fluência espontânea. Para transferir o aprendizado para a vida real, converse frequentemente com a IA e com pessoas, leia textos simples e escute inglês fora do site.</p></div></div>
  </section>`;
}

export function englishReviewView() {
  const state = store.state.english;
  const stats = englishStats();
  const mistakeExercises = stats.activeMistakes.map((item) => exercises.find((exercise) => exercise.id === item.exerciseId)).filter(Boolean);
  const dueExercises = stats.dueCards.map((id) => exercises.find((exercise) => exercise.id === id)).filter(Boolean);
  const queue = [...new Map([...mistakeExercises, ...dueExercises].map((item) => [item.id, item])).values()];
  return `<section class="page english-page"><div class="page-head"><div><span class="eyebrow">MEMÓRIA ADAPTATIVA</span><h1>Revisão de inglês</h1><p>O sistema prioriza o que você errou e reapresenta cada item em intervalos crescentes.</p></div><a class="button button-ghost" href="#/english">Painel de inglês</a></div><div class="grid grid-3"><div class="metric card"><span>↻</span><div><strong>${stats.activeMistakes.length}</strong><small>erros ativos</small></div></div><div class="metric card"><span>🧠</span><div><strong>${stats.dueCards.length}</strong><small>cartões vencidos</small></div></div><div class="metric card"><span>✓</span><div><strong>${state.mistakes.filter((item) => item.mastered).length}</strong><small>itens dominados</small></div></div></div><div class="card card-pad review-callout"><div><h2>${queue.length ? `${queue.length} itens prontos` : 'Memória em dia'}</h2><p>${queue.length ? 'Faça uma rodada curta. O sistema mistura ouvir, recordar e construir frases.' : 'Não há revisões vencidas. Você pode treinar vocabulário mesmo assim.'}</p></div><button class="button button-primary" data-action="english-review" type="button">${queue.length ? 'Iniciar revisão' : 'Revisar vocabulário'}</button></div></section>`;
}

export function englishWordsView() {
  const completed = lessons.filter((lesson) => store.state.english.completedLessons.includes(lesson.id));
  const words = completed.flatMap((lesson) => lesson.words.map((word) => ({ ...word, lesson: lesson.title })));
  return `<section class="page english-page"><div class="page-head"><div><span class="eyebrow">MEU VOCABULÁRIO</span><h1>${words.length} palavras estudadas</h1><p>Ouça cada palavra e tente lembrar o significado antes de revelá-lo.</p></div><a class="button button-ghost" href="#/english">Painel de inglês</a></div>${words.length ? `<div class="word-grid">${words.map((word) => `<article class="card word-card"><button class="audio-button" data-speak="${escapeHtml(word.en)}" type="button">🔊</button><div><strong>${escapeHtml(word.en)}</strong><span>${escapeHtml(word.pt)}</span><small>${escapeHtml(word.lesson)}</small></div></article>`).join('')}</div>` : `<div class="card empty-state"><div class="empty-icon">ABC</div><h2>Seu vocabulário começa na primeira lição</h2><p>Complete uma aula para liberar palavras, traduções e áudio.</p><a class="button button-primary" href="#/english/lesson/1">Começar agora</a></div>`}</section>`;
}

export function englishLessonExercises(id) { return exercises.filter((exercise) => exercise.lesson_id === id); }
export function englishExerciseById(id) { return exercises.find((exercise) => exercise.id === id); }
