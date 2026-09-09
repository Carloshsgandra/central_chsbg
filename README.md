# Nexo Academy
Central unificada de estudos, carreira e vida: o currículo do JavaDuolingo com a organização pessoal do Nexo.

## O que está disponível
- 30 lições e 78 exercícios Java, 5 provas, 5 projetos guiados e 50 questões de entrevista.
- 108 lições e 540 práticas de inglês A0–A2, apostilas, provas e revisão.
- 76 lições de redes, calculadora de sub-redes, terminal IOS simulado e chamados de suporte.
- 25 laboratórios adicionais: Java intermediário/avançado, HTML, CSS, JavaScript, Python, inglês empresarial e educação financeira.
- Caderno com várias páginas, planejamento de tarefas, revisão agendada e modo foco.
- Carteira com receitas/despesas, categorias, filtro mensal, limite de gastos e metas com simulação sem juros.
- Importação dos backups antigos do Nexo e JavaDuolingo, exportação completa e histórico de versões na conta.

Cada laboratório combina explicação, desafio autoral, dicas graduais, tentativa escrita, autoavaliação e uma pergunta conceitual. A escrita não recebe correção automática. O nível C1 é prática orientada de comunicação; concluir as atividades não certifica proficiência.

## Rodar
Node.js 22 ou superior:
1. npm ci
2. npm run dev
3. Abra a URL exibida no terminal.

O servidor local encaminha contas e progresso ao site Netlify configurado em NETLIFY_SITE_URL. O padrão é o site JavaDuolingo existente. A interface e os exercícios funcionam localmente; login e sincronização exigem conexão e serviço configurado.

## Publicar no Netlify
Importe o repositório. O netlify.toml configura:
- build: npm run build
- diretório público: dist
- funções: netlify/functions
- API: /api/progress

Ative **Identity / Authentication** no projeto Netlify usado para a publicação. O armazenamento **Netlify Blobs** é obtido pela função autenticada, sem chave de banco no navegador. Crie sua conta pelo botão Entrar, confirme o e-mail quando solicitado e aguarde o indicador Sincronizado.

**Para preservar contas e dados já existentes, publique no MESMO projeto/site do Netlify.** Você pode apontar esse site para o repositório central_chsbg. Criar outro site Netlify cria outra identidade de armazenamento; não transfere automaticamente contas ou progresso. Nesse caso, exporte e importe um backup pela tela Conta & backups.

Esta versão usa Netlify Identity + Blobs, preservando a infraestrutura que já existia no JavaDuolingo. Não usa Firebase; não existe configuração Firebase ativa ou sincronização entre dois provedores.

## Como os dados sobrevivem às atualizações
- Os arquivos do site são substituídos a cada publicação; os registros ficam no armazenamento estável javaflow-user-progress.
- Os registros são separados por ID da conta. A API exige autenticação e usa chaves restritas à própria conta.
- A chave local javaflow-state-v3 foi mantida. O formato é migrado aditivamente para a versão 8, preservando IDs de lições.
- Há uma cópia local síncrona e uma segunda cópia em IndexedDB. São recursos de recuperação offline, não substitutos de uma sincronização confirmada.
- Escritas condicionais por ETag impedem duas sessões de sobrescreverem o mesmo registro silenciosamente.
- A fusão combina conclusões de Java, inglês e redes. Notas, tarefas e finanças usam IDs e datas de alteração; exclusões preservam marcadores para não reaparecerem.
- Ao editar o mesmo registro em dois dispositivos, vence a alteração mais recente. O histórico permite recuperar o texto anterior.
- A tela Conta & backups disponibiliza o estado atual e as sete versões anteriores. Uma importação combina os dados; ela não apaga todo o estado atual.
- O cache offline contém apenas os arquivos públicos da aplicação. Dados de conta e respostas da API não entram nele.
- Limite por estado sincronizado: 900 KB. Caso excedido, o aplicativo avisa; exporte um backup antes de reorganizar suas anotações.

Não limpe os dados do navegador sem confirmar uma sincronização ou baixar um backup. Mudanças de domínio ou de site não transportam o armazenamento local.

## Migração do Nexo
Na tela Conta & backups, escolha o JSON exportado pelo Nexo. Receitas/despesas e o caderno entram sem duplicação por ID. Conclusões antigas são mantidas como histórico legado: elas não são tratadas como aprovação de exercícios diferentes no novo currículo.
Se nexo-v2 existir na mesma origem, a migração local ocorre automaticamente. Quando os sites têm domínios diferentes, use o arquivo de backup.

## Testes
npm test
npm run build

A suíte verifica currículo preservado, cálculo em centavos, importação idempotente, exclusões, agendamento de revisões, migração de esquema, fusão de redes, concorrência atômica e isolamento de contas, além das superfícies renderizadas. O build valida o grafo inteiro de módulos.
Os testes do serviço usam armazenamento simulado; uma sessão real de conta e o envio real para a nuvem devem ser verificados após configurar Identity no site de destino.

## Serviços opcionais
O Coach existente permite configurar uma chave Groq por sessão. Sem ela, funciona com respostas locais limitadas. O playground oferece uma prévia local limitada; compilação Java completa exige configurar um executor Judge0. Essas funções não fingem ser uma avaliação completa de código.

## Referências
- Java: https://dev.java/learn/
- Desenvolvimento web: https://developer.mozilla.org/en-US/curriculum/
- Python: https://docs.python.org/3/tutorial/
- Inglês: https://learnenglish.britishcouncil.org/
- Educação financeira: https://www.bcb.gov.br/cidadaniafinanceira/indexcidadaniafinanceira
- Aprendizagem e revisão: https://www.learningscientists.org/faq
