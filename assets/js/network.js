import { store } from './store.js';
import { escapeHtml, percent } from './utils.js';

export const networkTracks = [
  { id: 'foundation', number: '01', title: 'Fundamentos & infraestrutura', subtitle: 'Do primeiro cabo ao endereçamento IPv4/IPv6', color: '#0ea5e9', icon: '◈' },
  { id: 'routing', number: '02', title: 'Roteadores & configuração', subtitle: 'Cisco IOS, switching, routing e segurança', color: '#8b5cf6', icon: '⌘' },
  { id: 'support', number: '03', title: 'Suporte & carreira profissional', subtitle: 'Diagnóstico, atendimento, documentação e empregabilidade', color: '#10b981', icon: '◎' },
];

const moduleBlueprints = [
  {
    track: 'foundation', icon: '◉', title: 'Pensamento de redes', description: 'Entenda por que redes existem, como os dados circulam e como profissionais raciocinam.',
    topics: ['O que é uma rede e seus componentes', 'LAN, WAN, internet, intranet e topologias', 'Cliente, servidor, peer-to-peer e cloud', 'Método de estudo: teoria, configuração, verificação e correção'],
    outcomes: ['Identificar dispositivos finais e intermediários', 'Comparar topologias e escopos', 'Ler um diagrama lógico simples'],
    concepts: ['host', 'meio', 'NIC', 'switch', 'roteador', 'ISP', 'largura de banda', 'latência'],
    commands: [['ping 127.0.0.1', 'Valida a pilha TCP/IP local'], ['ipconfig /all', 'Inventaria interfaces no Windows'], ['tracert 8.8.8.8', 'Exibe saltos até o destino']],
    lab: 'Desenhe a rede da sua casa, nomeie cada equipamento e marque onde começam a LAN e a WAN.',
    check: ['Qual equipamento encaminha pacotes entre redes diferentes?', ['Switch de acesso', 'Roteador', 'Patch panel', 'Access point em bridge'], 1, 'O roteador toma decisões de camada 3 entre redes IP diferentes.'],
  },
  {
    track: 'foundation', icon: '▦', title: 'Modelos OSI e TCP/IP', description: 'Use camadas para localizar falhas sem adivinhar.',
    topics: ['As 7 camadas do modelo OSI', 'A pilha TCP/IP e o encapsulamento', 'PDU: bits, quadros, pacotes, segmentos e dados', 'Diagnóstico por camadas e caminho do pacote'],
    outcomes: ['Relacionar protocolos às camadas', 'Explicar encapsulamento e desencapsulamento', 'Classificar uma falha por camada'],
    concepts: ['aplicação', 'transporte', 'rede', 'enlace', 'física', 'encapsulamento', 'PDU'],
    commands: [['ping gateway', 'Testa alcance de camada 3'], ['arp -a', 'Inspeciona vizinhos IPv4 conhecidos'], ['netstat -ano', 'Lista conexões e portas locais']],
    lab: 'Acompanhe uma requisição HTTPS do navegador até o servidor e registre a função de cada camada.',
    check: ['Em qual camada do OSI o endereço IP é usado para encaminhamento?', ['Física', 'Enlace', 'Rede', 'Aplicação'], 2, 'A camada de rede usa endereços lógicos e escolhe caminhos.'],
  },
  {
    track: 'foundation', icon: '⌁', title: 'Ethernet e cabeamento', description: 'Domine o meio físico, quadros, MAC e boas práticas de instalação.',
    topics: ['UTP, STP, fibra, conectores e categorias', 'Quadro Ethernet e endereço MAC', 'Auto-MDIX, duplex, velocidade e negociação', 'Patch panel, rack, identificação e certificação'],
    outcomes: ['Escolher cabo e transceptor adequados', 'Interpretar uma tabela MAC', 'Documentar uma instalação organizada'],
    concepts: ['Cat5e', 'Cat6', 'fibra multimodo', 'fibra monomodo', 'RJ-45', 'MAC', 'duplex', 'CRC'],
    commands: [['show interfaces status', 'Resume estado, VLAN, duplex e velocidade'], ['show mac address-table', 'Exibe a aprendizagem de MACs'], ['show interfaces counters errors', 'Localiza erros físicos e de enlace']],
    lab: 'Monte um plano de cabeamento para oito estações, dois APs e um uplink, incluindo portas e etiquetas.',
    check: ['Qual sintoma combina mais com duplex incompatível?', ['DNS inexistente', 'Colisões tardias e baixo desempenho', 'Gateway ausente', 'SSID oculto'], 1, 'Mismatch de duplex costuma gerar erros, colisões tardias e throughput instável.'],
  },
  {
    track: 'foundation', icon: '123', title: 'IPv4 e subnetting', description: 'Transforme endereçamento em uma habilidade automática e verificável.',
    topics: ['Binário, decimal e estrutura do IPv4', 'Máscara, prefixo, rede, broadcast e hosts', 'VLSM e planejamento hierárquico', 'Sub-redes na prática e sumarização'],
    outcomes: ['Calcular rede, broadcast e faixa útil', 'Dimensionar sub-redes com VLSM', 'Evitar sobreposição de endereços'],
    concepts: ['CIDR', 'máscara', 'prefixo', 'broadcast', 'host válido', 'VLSM', 'sumarização'],
    commands: [['show ip interface brief', 'Resume endereços e estado das interfaces'], ['ip address 192.168.10.1 255.255.255.0', 'Define IPv4 em uma interface IOS'], ['show ip route connected', 'Confirma redes diretamente conectadas']],
    lab: 'Divida 192.168.50.0/24 para setores com 60, 30, 14 e 6 hosts usando VLSM.',
    check: ['Quantos endereços úteis existem em uma sub-rede /27 tradicional?', ['14', '30', '32', '62'], 1, 'Um /27 possui 32 endereços totais; rede e broadcast deixam 30 úteis.'],
  },
  {
    track: 'foundation', icon: 'v6', title: 'IPv6 essencial', description: 'Configure e diagnostique IPv6 sem depender de tradução mental para IPv4.',
    topics: ['Formato, abreviação e tipos de endereço IPv6', 'Link-local, global unicast, multicast e anycast', 'SLAAC, DHCPv6 e descoberta de vizinhos', 'Dual stack, rotas e verificação IPv6'],
    outcomes: ['Abreviar e expandir endereços', 'Reconhecer escopos IPv6', 'Configurar conectividade dual stack'],
    concepts: ['global unicast', 'link-local', 'multicast', 'SLAAC', 'NDP', 'EUI-64', 'dual stack'],
    commands: [['show ipv6 interface brief', 'Resume interfaces IPv6'], ['ipv6 unicast-routing', 'Habilita encaminhamento IPv6'], ['ping ipv6 2001:db8::1', 'Testa alcance IPv6 no IOS']],
    lab: 'Planeje /64 distintos para usuários, servidores, voz e gerenciamento a partir de 2001:db8:acad::/48.',
    check: ['Qual prefixo identifica normalmente endereços IPv6 link-local?', ['2000::/3', 'FE80::/10', 'FF00::/8', 'FC00::/7'], 1, 'Endereços link-local usam FE80::/10 e existem em cada interface IPv6.'],
  },
  {
    track: 'foundation', icon: '☍', title: 'Protocolos e serviços', description: 'Compreenda os serviços que fazem uma rede parecer simples para o usuário.',
    topics: ['ARP, ICMP e descoberta local', 'DHCPv4/DHCPv6 e ciclo de concessão', 'DNS, registros e resolução de nomes', 'TCP, UDP, portas, NAT e PAT'],
    outcomes: ['Explicar DORA e resolução DNS', 'Diferenciar TCP de UDP', 'Mapear sintomas a serviços de infraestrutura'],
    concepts: ['ARP', 'ICMP', 'DHCP', 'DNS', 'TCP', 'UDP', 'socket', 'NAT', 'PAT'],
    commands: [['nslookup example.com', 'Consulta DNS e servidor utilizado'], ['ipconfig /release & ipconfig /renew', 'Renova concessão DHCP no Windows'], ['show ip nat translations', 'Inspeciona traduções NAT no IOS']],
    lab: 'Capture uma consulta DNS e uma conexão TCP; identifique portas, flags e ordem dos eventos.',
    check: ['Qual sequência representa o processo DHCPv4 inicial?', ['ACK, Offer, Request, Discover', 'Discover, Offer, Request, ACK', 'Request, Discover, ACK, Offer', 'Offer, Discover, ACK, Request'], 1, 'O cliente descobre, recebe uma oferta, solicita e recebe a confirmação: DORA.'],
  },
  {
    track: 'routing', icon: '>_', title: 'Cisco IOS sem medo', description: 'Navegue, configure, salve e recupere equipamentos com método profissional.',
    topics: ['CLI, modos EXEC e ajuda contextual', 'Configuração inicial segura e identidade', 'Interfaces, descrições e endereçamento', 'Running-config, startup-config e recuperação'],
    outcomes: ['Navegar pelos modos IOS', 'Aplicar uma configuração básica segura', 'Salvar e verificar mudanças'],
    concepts: ['user EXEC', 'privileged EXEC', 'global config', 'interface config', 'running-config', 'startup-config'],
    commands: [['enable', 'Entra no EXEC privilegiado'], ['configure terminal', 'Entra na configuração global'], ['copy running-config startup-config', 'Persiste a configuração']],
    lab: 'Configure hostname, senhas, banner, interface de gerenciamento e salve a configuração.',
    check: ['Qual comando salva a configuração ativa para o próximo boot?', ['reload', 'write erase', 'copy running-config startup-config', 'show startup-config'], 2, 'A cópia da running-config para a startup-config persiste as mudanças.'],
  },
  {
    track: 'routing', icon: '⇄', title: 'Switching profissional', description: 'Construa redes locais segmentadas, resilientes e fáceis de operar.',
    topics: ['Aprendizagem MAC e encaminhamento de quadros', 'VLANs, portas access e voice VLAN', 'Trunks 802.1Q e VLAN nativa', 'STP, RSTP, PortFast, BPDU Guard e EtherChannel'],
    outcomes: ['Criar e verificar VLANs', 'Configurar trunks coerentes', 'Evitar loops de camada 2'],
    concepts: ['CAM table', 'VLAN', 'access', 'trunk', '802.1Q', 'STP', 'root bridge', 'EtherChannel'],
    commands: [['show vlan brief', 'Lista VLANs e portas de acesso'], ['show interfaces trunk', 'Confirma trunks e VLANs permitidas'], ['show spanning-tree', 'Exibe raiz e estados STP']],
    lab: 'Separe usuários, voz e gerenciamento em VLANs; configure trunk e valide o STP.',
    check: ['Qual protocolo evita loops de camada 2 em topologias redundantes?', ['OSPF', 'STP', 'DHCP', 'NAT'], 1, 'STP cria uma árvore lógica sem loops e mantém redundância bloqueada.'],
  },
  {
    track: 'routing', icon: '↔', title: 'Inter-VLAN e gateway', description: 'Faça VLANs diferentes conversarem com controle e previsibilidade.',
    topics: ['Por que VLANs precisam de roteamento', 'Router-on-a-stick e subinterfaces', 'SVIs em switches multicamada', 'Gateway padrão, DHCP relay e verificação'],
    outcomes: ['Configurar router-on-a-stick', 'Criar SVIs e habilitar routing', 'Diagnosticar falhas entre VLANs'],
    concepts: ['subinterface', 'encapsulation dot1q', 'SVI', 'default gateway', 'ip helper-address'],
    commands: [['encapsulation dot1Q 10', 'Associa subinterface a uma VLAN'], ['interface vlan 10', 'Cria ou acessa uma SVI'], ['ip helper-address 10.0.0.10', 'Encaminha broadcasts DHCP ao servidor']],
    lab: 'Entregue conectividade entre três VLANs e DHCP centralizado; documente cada gateway.',
    check: ['O que uma SVI representa em um switch multicamada?', ['Um cabo virtual', 'Uma interface lógica associada a uma VLAN', 'Uma rota padrão', 'Um servidor DHCP'], 1, 'A SVI é a interface lógica de camada 3 de uma VLAN no switch.'],
  },
  {
    track: 'routing', icon: '➜', title: 'Roteamento IP', description: 'Leia a tabela de rotas e controle caminhos com precisão.',
    topics: ['Decisão de encaminhamento e longest prefix match', 'Rotas conectadas, locais, estáticas e padrão', 'Rotas flutuantes e sumarização', 'Métricas, distância administrativa e troubleshooting'],
    outcomes: ['Interpretar a tabela de roteamento', 'Criar rotas estáticas e padrão', 'Explicar a seleção de melhor rota'],
    concepts: ['next hop', 'exit interface', 'longest prefix match', 'métrica', 'distância administrativa', 'default route'],
    commands: [['show ip route', 'Exibe a tabela de rotas IPv4'], ['ip route 0.0.0.0 0.0.0.0 10.0.0.1', 'Cria rota padrão'], ['traceroute 192.168.20.10', 'Mostra o caminho de camada 3']],
    lab: 'Conecte três roteadores com rotas estáticas, rota padrão e uma rota de backup flutuante.',
    check: ['Qual critério é avaliado primeiro ao escolher entre rotas para um destino?', ['Menor IP do roteador', 'Prefixo mais específico', 'Maior métrica', 'Ordem de configuração'], 1, 'O longest prefix match escolhe primeiro a rota mais específica.'],
  },
  {
    track: 'routing', icon: 'O', title: 'OSPF de área única', description: 'Implemente roteamento dinâmico com vizinhança, custo e verificação.',
    topics: ['Link-state, LSDB, SPF e áreas', 'Router ID e configuração OSPFv2', 'Vizinhanças, redes e interfaces passivas', 'DR/BDR, custo, rota padrão e diagnóstico'],
    outcomes: ['Formar adjacências OSPF', 'Anunciar redes com segurança', 'Diagnosticar vizinhos ausentes'],
    concepts: ['Hello', 'LSA', 'LSDB', 'SPF', 'router ID', 'DR', 'BDR', 'cost'],
    commands: [['show ip ospf neighbor', 'Confirma adjacências OSPF'], ['show ip ospf interface brief', 'Resume interfaces participantes'], ['passive-interface default', 'Evita Hellos onde não há roteadores']],
    lab: 'Implemente OSPF área 0 em três roteadores, anuncie uma default e valide convergência.',
    check: ['Qual informação deve coincidir para dois vizinhos OSPF na mesma rede?', ['Hostname', 'Area ID', 'Senha enable', 'Número de VLAN nativa sempre'], 1, 'Interfaces vizinhas precisam concordar, entre outros parâmetros, com a área OSPF.'],
  },
  {
    track: 'routing', icon: '⚿', title: 'Segurança, WAN e qualidade', description: 'Proteja o plano de acesso e conecte filiais com critérios de negócio.',
    topics: ['ACLs IPv4 padrão, estendida e posicionamento', 'Hardening de dispositivos e acesso SSH', 'WAN, VPN, conceitos de SD-WAN e cloud', 'QoS, voz, monitoramento e alta disponibilidade'],
    outcomes: ['Criar ACLs verificáveis', 'Remover acessos inseguros', 'Selecionar uma solução WAN coerente'],
    concepts: ['ACL', 'wildcard', 'SSH', 'VPN', 'IPsec', 'SD-WAN', 'QoS', 'SNMP', 'syslog', 'NTP'],
    commands: [['show access-lists', 'Mostra regras e contadores de ACL'], ['transport input ssh', 'Restringe VTY ao SSH'], ['show logging', 'Exibe eventos do dispositivo']],
    lab: 'Proteja o gerenciamento por SSH, aplique uma ACL de menor privilégio e envie logs a um servidor.',
    check: ['Onde uma ACL estendida costuma ser posicionada?', ['Próxima da origem', 'Sempre no destino', 'Somente em loopback', 'Depois do NAT obrigatoriamente'], 0, 'ACLs estendidas costumam ficar próximas da origem para bloquear cedo o tráfego indesejado.'],
  },
  {
    track: 'support', icon: 'PC', title: 'Estações e sistemas', description: 'Prepare, inventarie e recupere endpoints Windows e Linux.',
    topics: ['Hardware, firmware, boot e armazenamento', 'Windows: contas, serviços, logs e recuperação', 'Linux: shell, permissões, processos e rede', 'Drivers, atualização, backup e padronização'],
    outcomes: ['Coletar informações antes de alterar', 'Diferenciar falha de hardware e software', 'Executar recuperação segura'],
    concepts: ['UEFI', 'SMART', 'driver', 'serviço', 'Event Viewer', 'systemd', 'permissão', 'backup'],
    commands: [['systeminfo', 'Inventaria o Windows'], ['sfc /scannow', 'Verifica arquivos protegidos do sistema'], ['journalctl -p err', 'Lista erros importantes no Linux']],
    lab: 'Crie um checklist de preparação e entrega de notebook corporativo com rollback.',
    check: ['Qual deve ser a primeira atitude antes de uma alteração de alto risco?', ['Formatar', 'Registrar estado e garantir recuperação', 'Atualizar todos os drivers', 'Desativar logs'], 1, 'Uma linha de base e um caminho de rollback reduzem impacto e aceleram recuperação.'],
  },
  {
    track: 'support', icon: '⌕', title: 'Troubleshooting metódico', description: 'Troque tentativa e erro por hipótese, evidência e validação.',
    topics: ['Identificar, estabelecer teoria e testar', 'Linha de base, escopo, impacto e prioridade', 'Ferramentas de rede em Windows, Linux e IOS', 'Correção, validação, prevenção e documentação'],
    outcomes: ['Isolar a camada da falha', 'Testar uma variável por vez', 'Provar que a solução resolveu o problema'],
    concepts: ['sintoma', 'causa raiz', 'baseline', 'hipótese', 'evidência', 'rollback', 'RCA'],
    commands: [['ping', 'Testa alcance e latência'], ['tracert / traceroute', 'Localiza o salto problemático'], ['pathping / mtr', 'Combina caminho e perda ao longo do tempo']],
    lab: 'Resolva um chamado “sem internet” começando por escopo, camada física e configuração IP.',
    check: ['Depois de implementar uma correção, qual passo fecha tecnicamente o incidente?', ['Apagar os logs', 'Validar a funcionalidade completa e documentar', 'Reiniciar novamente', 'Trocar mais um componente'], 1, 'Validação com o usuário e documentação demonstram resultado e preservam conhecimento.'],
  },
  {
    track: 'support', icon: '⚙', title: 'Serviços de infraestrutura', description: 'Opere os serviços que sustentam identidade, nomes, endereços e arquivos.',
    topics: ['DHCP: escopos, reservas, options e relay', 'DNS: zonas, registros, cache e troubleshooting', 'Diretório, autenticação, grupos e políticas', 'Arquivos, impressão, permissões e backup'],
    outcomes: ['Criar um plano de serviços essenciais', 'Diagnosticar nome versus conectividade', 'Aplicar acesso por grupo'],
    concepts: ['scope', 'reservation', 'A record', 'CNAME', 'PTR', 'TTL', 'directory', 'RBAC', '3-2-1 backup'],
    commands: [['ipconfig /displaydns', 'Inspeciona cache DNS local'], ['nslookup -type=mx dominio', 'Consulta um tipo específico de registro'], ['gpresult /r', 'Resume políticas aplicadas no Windows']],
    lab: 'Documente DHCP, DNS, grupos e permissões para uma empresa de 40 pessoas.',
    check: ['Qual registro DNS mapeia diretamente um nome para um endereço IPv4?', ['MX', 'PTR', 'A', 'TXT'], 2, 'O registro A associa um nome a um endereço IPv4.'],
  },
  {
    track: 'support', icon: '🛡', title: 'Cibersegurança operacional', description: 'Reduza risco com controles básicos bem executados e resposta organizada.',
    topics: ['Ameaças, vulnerabilidades, risco e defesa em profundidade', 'MFA, menor privilégio, hardening e patches', 'Segmentação, firewall, endpoint e segurança Wi-Fi', 'Phishing, incidente, contenção e preservação de evidência'],
    outcomes: ['Priorizar riscos de forma prática', 'Aplicar menor privilégio', 'Escalar incidentes sem destruir evidência'],
    concepts: ['CIA triad', 'MFA', 'least privilege', 'patching', 'EDR', 'firewall', 'WPA3', 'incident response'],
    commands: [['show port-security interface', 'Verifica segurança de porta IOS'], ['netstat -abno', 'Relaciona conexões a processos no Windows'], ['ss -tulpn', 'Lista sockets e processos no Linux']],
    lab: 'Crie uma linha de base de hardening para roteador, switch, Wi-Fi e estação.',
    check: ['Qual princípio concede apenas os acessos necessários para a função?', ['Disponibilidade total', 'Menor privilégio', 'Segurança por obscuridade', 'Confiança implícita'], 1, 'Menor privilégio reduz superfície e impacto de comprometimentos.'],
  },
  {
    track: 'support', icon: '🎧', title: 'Service desk de excelência', description: 'Atenda bem, priorize corretamente e transforme incidentes em conhecimento.',
    topics: ['Incidente, requisição, problema, mudança e SLA', 'Triagem, prioridade, impacto, urgência e escalonamento', 'Comunicação, perguntas eficazes e experiência do usuário', 'Base de conhecimento, inventário e métricas'],
    outcomes: ['Registrar chamados reproduzíveis', 'Definir prioridade com critérios', 'Comunicar sem jargão e com prazo'],
    concepts: ['SLA', 'impacto', 'urgência', 'escalonamento', 'workaround', 'base de conhecimento', 'CMDB'],
    commands: [['hostname', 'Identifica rapidamente o endpoint'], ['whoami', 'Confirma o contexto do usuário'], ['Get-NetAdapter', 'Lista adaptadores e estado no PowerShell']],
    lab: 'Atenda três chamados simultâneos e justifique a ordem usando impacto e urgência.',
    check: ['Qual registro permite que outro técnico reproduza o diagnóstico?', ['“Resolvido”', 'Sintoma, ambiente, evidências, ações e resultado', 'Somente o nome do usuário', 'Uma captura sem contexto'], 1, 'Um chamado útil registra contexto, evidências, ações e validação.'],
  },
  {
    track: 'support', icon: '▤', title: 'Documentação e automação', description: 'Crie redes operáveis por outras pessoas e automatize tarefas repetitivas.',
    topics: ['Diagrama físico, lógico e inventário', 'Padrões de nomes, endereços e versionamento', 'Backups de configuração e controle de mudanças', 'APIs, JSON, Git e automação de rede introdutória'],
    outcomes: ['Produzir documentação acionável', 'Controlar mudanças com rollback', 'Reconhecer oportunidades de automação'],
    concepts: ['source of truth', 'runbook', 'change log', 'Git', 'API REST', 'JSON', 'idempotência'],
    commands: [['show running-config', 'Coleta a configuração ativa'], ['show cdp neighbors detail', 'Descobre vizinhos Cisco e portas'], ['show lldp neighbors detail', 'Descobre vizinhos multivendor']],
    lab: 'Entregue diagrama, tabela IP, inventário, backup e runbook de recuperação para uma filial.',
    check: ['Qual característica torna uma automação segura para ser executada novamente?', ['Aleatoriedade', 'Idempotência', 'Ausência de logs', 'Credencial no código'], 1, 'Uma operação idempotente converge ao estado desejado sem duplicar efeitos.'],
  },
  {
    track: 'support', icon: '🏆', title: 'Qualificação profissional', description: 'Consolide portfólio, comunicação técnica e preparação para vagas e certificações.',
    topics: ['Blueprint de competências e revisão espaçada', 'Laboratório final: pequena empresa resiliente', 'Portfólio, currículo e narrativa de projetos', 'Entrevista, simulado técnico e plano de 90 dias'],
    outcomes: ['Demonstrar configuração e diagnóstico', 'Explicar decisões e trade-offs', 'Montar evidências para processos seletivos'],
    concepts: ['competency matrix', 'capstone', 'portfolio', 'STAR', 'postmortem', 'continuous learning'],
    commands: [['show tech-support', 'Coleta ampla para suporte, com cuidado de dados'], ['show version', 'Identifica plataforma e software'], ['show inventory', 'Lista componentes e seriais']],
    lab: 'Projete, configure, teste e apresente a rede de uma empresa com matriz, filial, Wi-Fi e serviços.',
    check: ['Qual evidência é mais forte em um portfólio técnico?', ['Lista de cursos', 'Projeto com requisitos, diagrama, configuração, testes e retrospectiva', 'Muitos termos sem contexto', 'Captura de uma tela verde'], 1, 'Evidência completa mostra raciocínio, execução, validação e aprendizado.'],
  },
];

export const networkModules = moduleBlueprints.map((module, index) => ({ ...module, id: index + 1, order: index + 1 }));

export const networkLessons = networkModules.flatMap((module) => module.topics.map((title, topicIndex) => ({
  id: (module.id - 1) * 4 + topicIndex + 1,
  moduleId: module.id,
  track: module.track,
  order: topicIndex + 1,
  title,
  summary: `${module.description} Nesta etapa, o foco é ${title.toLocaleLowerCase('pt-BR')}.`,
  duration: [25, 35, 45, 60][topicIndex],
  level: module.id <= 6 ? 'Fundamentos' : module.id <= 12 ? 'Implementação' : 'Profissional',
  objectives: [module.outcomes[topicIndex % module.outcomes.length], module.outcomes[(topicIndex + 1) % module.outcomes.length], `Verificar ${title.toLocaleLowerCase('pt-BR')} com evidências`],
  lab: module.lab,
  check: module.check,
})));

export const ciscoAlignment = [
  ['Network Fundamentals', 'Módulos 1–6', 'Modelos, Ethernet, IPv4/IPv6, TCP/UDP e serviços'],
  ['Network Access', 'Módulos 7–9', 'IOS, switching, VLAN, trunks, STP, EtherChannel e WLAN'],
  ['IP Connectivity', 'Módulos 9–11', 'Inter-VLAN, tabela de rotas, estático, default e OSPF'],
  ['IP Services', 'Módulos 6, 9 e 12', 'DHCP, DNS, NAT, NTP, SNMP, syslog e QoS'],
  ['Security Fundamentals', 'Módulos 12 e 16', 'ACL, hardening, acesso seguro, ameaças e menor privilégio'],
  ['Automation & Programmability', 'Módulo 17', 'APIs, JSON, Git, source of truth e idempotência'],
];

export const networkLabs = [
  { id: 'subnet', level: 'Base', title: 'Subnetting Workbench', description: 'Calcule rede, broadcast, faixa útil e quantidade de hosts.', icon: '123' },
  { id: 'ios', level: 'Configuração', title: 'Terminal IOS guiado', description: 'Pratique a sequência profissional de configuração e verificação.', icon: '>_' },
  { id: 'tickets', level: 'Suporte', title: 'Central de incidentes', description: 'Diagnostique chamados usando evidência, camada e prioridade.', icon: '🎧' },
];

export const supportTickets = [
  { id: 'apipa', title: 'Notebook sem acesso à rede', priority: 'P2', symptom: 'Usuário recebe 169.254.34.8/16 e não alcança o gateway.', answer: 'dhcp', options: [['dns', 'Limpar o cache DNS'], ['dhcp', 'Verificar enlace, VLAN e alcance do DHCP'], ['route', 'Criar rota estática no notebook']], explanation: 'APIPA indica que o cliente não recebeu concessão DHCP. Primeiro valide enlace/VLAN e o caminho até o servidor ou relay.' },
  { id: 'dns', title: 'Sites abrem por IP, não por nome', priority: 'P2', symptom: 'Ping para 1.1.1.1 funciona; nslookup expira.', answer: 'dns', options: [['dns', 'Validar servidor DNS, porta 53 e configuração do cliente'], ['cable', 'Trocar o patch cord'], ['gateway', 'Alterar o gateway']], explanation: 'A conectividade IP funciona e a falha está na resolução de nomes. Teste o servidor configurado e consultas DNS.' },
  { id: 'duplex', title: 'Link lento e com erros', priority: 'P3', symptom: 'CRC cresce, throughput oscila e há late collisions em uma ponta.', answer: 'duplex', options: [['duplex', 'Comparar speed/duplex nas duas pontas e o meio físico'], ['dhcp', 'Renovar o DHCP'], ['acl', 'Remover todas as ACLs']], explanation: 'Erros e late collisions apontam para físico/duplex. Compare as duas pontas antes de fixar parâmetros.' },
  { id: 'vlan', title: 'Apenas um setor ficou isolado', priority: 'P1', symptom: 'Após uma mudança, toda a VLAN 30 perdeu o gateway; outras VLANs operam.', answer: 'trunk', options: [['trunk', 'Conferir VLAN 30, trunk permitido e SVI/subinterface'], ['isp', 'Acionar o provedor'], ['host', 'Formatar as estações']], explanation: 'O escopo restrito à VLAN após mudança sugere VLAN/trunk/gateway lógico, não o provedor.' },
];

export function networkLessonById(id) { return networkLessons.find((lesson) => lesson.id === Number(id)); }

export function networkStats() {
  const completed = store.state.network?.completedLessons ?? [];
  const labs = store.state.network?.labsCompleted ?? [];
  const nextLesson = networkLessons.find((lesson) => !completed.includes(lesson.id)) ?? networkLessons.at(-1);
  return { completed, labs, nextLesson, progress: percent(completed.length, networkLessons.length), labProgress: percent(labs.length, networkLabs.length) };
}

function moduleProgress(module) {
  const lessons = networkLessons.filter((lesson) => lesson.moduleId === module.id);
  return percent(lessons.filter((lesson) => store.state.network?.completedLessons?.includes(lesson.id)).length, lessons.length);
}

export function networkDashboardView() {
  const stats = networkStats();
  const trackProgress = (track) => {
    const lessons = networkLessons.filter((lesson) => lesson.track === track.id);
    return percent(lessons.filter((lesson) => stats.completed.includes(lesson.id)).length, lessons.length);
  };
  return `<section class="page network-page"><section class="network-hero"><div><span class="eyebrow">NETWORK OPERATIONS ACADEMY · ZERO → PROFISSIONAL</span><h1>Construa, configure<br>e <em>resolva</em> redes.</h1><p>76 lições, laboratórios e chamados reais em uma trilha inspirada na prática Cisco: aprender, configurar, verificar, diagnosticar e documentar.</p><div class="hero-actions"><a class="button button-primary" href="#/network/lesson/${stats.nextLesson.id}">Continuar formação →</a><a class="button button-ghost" href="#/network/labs">Abrir laboratório</a></div><small>Preparação independente. Cisco e CCNA são marcas de seus respectivos titulares; este curso não é afiliado nem substitui material oficial.</small></div><div class="network-console" aria-label="Resumo de prontidão"><header><i></i><i></i><i></i><b>readiness.check</b></header><pre><span>$</span> show learning-progress\ncourse ............ ${String(stats.progress).padStart(3)}%\nlabs .............. ${stats.labs.length}/${networkLabs.length}\nnext .............. L${String(stats.nextLesson.id).padStart(2, '0')}\nstatus ............ ${stats.progress === 100 ? 'QUALIFIED' : 'BUILDING'}</pre></div></section>
    <div class="network-kpis"><div><b>76</b><span>lições técnicas</span></div><div><b>19</b><span>módulos progressivos</span></div><div><b>3</b><span>laboratórios ativos</span></div><div><b>6</b><span>domínios alinhados</span></div></div>
    <section class="network-track-grid">${networkTracks.map((track) => { const progress = trackProgress(track); return `<a href="#/network/learn?track=${track.id}" class="card network-track" style="--track:${track.color}"><span>${track.number}</span><i>${track.icon}</i><h2>${escapeHtml(track.title)}</h2><p>${escapeHtml(track.subtitle)}</p><div><b>${progress}%</b><span class="progress"><i style="width:${progress}%"></i></span></div></a>`; }).join('')}</section>
    <div class="layout-main"><section class="card card-pad"><div class="card-head"><div><span class="eyebrow">PRÓXIMA MISSÃO</span><h2>${escapeHtml(stats.nextLesson.title)}</h2><p>${escapeHtml(stats.nextLesson.summary)}</p></div><span class="badge badge-purple">${stats.nextLesson.duration} min</span></div><a class="button button-primary" href="#/network/lesson/${stats.nextLesson.id}">Iniciar lição</a></section><aside class="card card-pad network-readiness"><span class="eyebrow">QUALIFICAÇÃO</span><h3>Seu mapa profissional</h3><p>Veja o que já consegue demonstrar, as lacunas por domínio e o projeto final de portfólio.</p><a href="#/network/career">Abrir mapa de carreira →</a></aside></div>
  </section>`;
}

export function networkLearnView(trackFilter = '') {
  const visible = trackFilter ? networkModules.filter((module) => module.track === trackFilter) : networkModules;
  return `<section class="page network-page"><div class="page-head"><div><span class="eyebrow">CURRÍCULO COMPLETO</span><h1>Trilha profissional de redes</h1><p>Estude na ordem ou filtre por frente. Cada módulo fecha com configuração, verificação e evidência.</p></div><a class="button button-ghost" href="#/network">Painel de redes</a></div><div class="network-track-tabs"><a class="${!trackFilter ? 'active' : ''}" href="#/network/learn">Todos</a>${networkTracks.map((track) => `<a class="${trackFilter === track.id ? 'active' : ''}" href="#/network/learn?track=${track.id}">${track.number} · ${track.title}</a>`).join('')}</div><div class="network-module-list">${visible.map((module) => { const progress = moduleProgress(module); const lessons = networkLessons.filter((lesson) => lesson.moduleId === module.id); return `<article class="card network-module"><header><span class="network-module-number">${String(module.id).padStart(2, '0')}</span><div><small>${networkTracks.find((track) => track.id === module.track).title}</small><h2>${module.icon} ${escapeHtml(module.title)}</h2><p>${escapeHtml(module.description)}</p></div><div class="module-progress"><b>${progress}%</b><span class="progress"><i style="width:${progress}%"></i></span></div></header><div class="network-lesson-list">${lessons.map((lesson) => { const done = store.state.network?.completedLessons?.includes(lesson.id); return `<a href="#/network/lesson/${lesson.id}" class="${done ? 'done' : ''}"><span>${done ? '✓' : lesson.order}</span><div><strong>${escapeHtml(lesson.title)}</strong><small>${lesson.duration} min · ${lesson.level}</small></div><i>→</i></a>`; }).join('')}</div></article>`; }).join('')}</div></section>`;
}

export function networkLessonView(id) {
  const lesson = networkLessonById(id);
  if (!lesson) return '';
  const module = networkModules.find((item) => item.id === lesson.moduleId);
  const track = networkTracks.find((item) => item.id === lesson.track);
  const complete = store.state.network?.completedLessons?.includes(lesson.id);
  const next = networkLessons.find((item) => item.id === lesson.id + 1);
  const [question, options, answer, explanation] = lesson.check;
  return `<section class="page network-page network-lesson"><div class="lesson-breadcrumb"><a href="#/network/learn?track=${track.id}">← ${escapeHtml(track.title)}</a><span>Módulo ${module.id} · Lição ${lesson.order}</span></div><article class="card network-lesson-sheet"><header style="--track:${track.color}"><span>${module.icon}</span><div><small>${lesson.level.toUpperCase()} · ${lesson.duration} MIN</small><h1>${escapeHtml(lesson.title)}</h1><p>${escapeHtml(lesson.summary)}</p></div></header><section><span class="eyebrow">OBJETIVOS DE CAMPO</span><div class="network-objectives">${lesson.objectives.map((objective) => `<div><b>✓</b>${escapeHtml(objective)}</div>`).join('')}</div></section><section><span class="eyebrow">MAPA MENTAL</span><h2>Conceitos que você precisa conectar</h2><div class="concept-cloud">${module.concepts.map((concept) => `<span>${escapeHtml(concept)}</span>`).join('')}</div><div class="network-explanation"><p><strong>Ideia central.</strong> ${escapeHtml(module.description)}</p><p>Ao estudar <strong>${escapeHtml(lesson.title)}</strong>, sempre registre quatro evidências: estado inicial, alteração executada, comando de verificação e resultado esperado. Isso transforma memorização em competência operacional.</p></div></section><section><span class="eyebrow">CLI DE REFERÊNCIA</span><h2>Comandos para reconhecer e explicar</h2><div class="command-list">${module.commands.map(([command, description]) => `<div><code>${escapeHtml(command)}</code><span>${escapeHtml(description)}</span><button data-copy-command="${escapeHtml(command)}" type="button">Copiar</button></div>`).join('')}</div></section><section class="network-lab-mission"><span>>_</span><div><small>PRÁTICA DELIBERADA</small><h2>Missão de laboratório</h2><p>${escapeHtml(lesson.lab)}</p><ol><li>Defina o estado esperado antes de configurar.</li><li>Execute uma mudança por vez e registre o comando.</li><li>Verifique conectividade e estado; provoque uma falha controlada.</li><li>Reverta ou corrija, valide de novo e documente a causa.</li></ol><a class="button button-primary" href="#/network/labs">Abrir bancada de prática</a></div></section><section><span class="eyebrow">CHECKPOINT</span><h2>${escapeHtml(question)}</h2><div class="network-quiz" data-network-quiz data-answer="${answer}" data-explanation="${escapeHtml(explanation)}">${options.map((option, index) => `<button data-network-answer="${index}" type="button"><b>${String.fromCharCode(65 + index)}</b>${escapeHtml(option)}</button>`).join('')}<p class="network-quiz-feedback" aria-live="polite"></p></div></section><footer><button class="button ${complete ? 'button-ghost' : 'button-primary'}" data-action="network-complete-lesson" data-lesson="${lesson.id}" type="button">${complete ? '✓ Lição concluída' : 'Concluir e ganhar 40 XP'}</button>${next ? `<a class="button button-ghost" href="#/network/lesson/${next.id}">Próxima lição →</a>` : '<a class="button button-ghost" href="#/network/career">Ver qualificação →</a>'}</footer></article></section>`;
}

export function networkLabsView() {
  const completed = store.state.network?.labsCompleted ?? [];
  return `<section class="page network-page"><div class="page-head"><div><span class="eyebrow">NETWORK LAB</span><h1>Bancada de prática</h1><p>Ferramentas seguras para criar memória muscular antes do equipamento real ou Packet Tracer.</p></div><a class="button button-ghost" href="#/network">Painel de redes</a></div><div class="network-lab-tabs">${networkLabs.map((lab) => `<a href="#network-lab-${lab.id}" class="card"><span>${lab.icon}</span><div><small>${lab.level}</small><h3>${lab.title}</h3><p>${lab.description}</p></div><b>${completed.includes(lab.id) ? '✓' : '→'}</b></a>`).join('')}</div>
    <section class="card network-tool" id="network-lab-subnet"><header><span>123</span><div><small>LAB 01</small><h2>Subnetting Workbench</h2></div></header><form id="subnet-form" class="subnet-form"><label>Endereço IPv4<input class="input" name="ip" value="192.168.10.34" inputmode="decimal" required></label><label>Prefixo CIDR<input class="input" name="prefix" value="27" type="number" min="0" max="32" required></label><button class="button button-primary" type="submit">Calcular e explicar</button></form><div class="subnet-output" id="subnet-output"><p>Informe um IPv4 e um prefixo para iniciar.</p></div></section>
    <section class="card network-tool" id="network-lab-ios"><header><span>>_</span><div><small>LAB 02</small><h2>Terminal IOS guiado</h2></div></header><div class="ios-lab"><aside><h3>Missão: ativar a LAN</h3><ol><li data-cli-step="enable">Entre no modo privilegiado.</li><li data-cli-step="configure terminal">Abra a configuração global.</li><li data-cli-step="hostname">Defina um hostname.</li><li data-cli-step="interface">Acesse G0/0.</li><li data-cli-step="ip address">Configure 192.168.10.1/24.</li><li data-cli-step="no shutdown">Ative a interface.</li><li data-cli-step="show ip interface brief">Verifique o resultado.</li></ol></aside><div class="ios-terminal"><div class="ios-output" id="ios-output">Cisco IOS Software — laboratório educacional\nDigite <b>enable</b> para começar.\n</div><form id="ios-form"><label>Router&gt; <input id="ios-input" autocomplete="off" spellcheck="false" aria-label="Comando IOS"></label><button type="submit">Executar</button></form></div></div></section>
    <section class="card network-tool" id="network-lab-tickets"><header><span>🎧</span><div><small>LAB 03</small><h2>Central de incidentes</h2></div></header><div class="ticket-grid">${supportTickets.map((ticket) => `<article class="support-ticket" data-ticket="${ticket.id}" data-answer="${ticket.answer}"><header><span>${ticket.priority}</span><small>#${ticket.id.toUpperCase()}</small></header><h3>${ticket.title}</h3><p>${ticket.symptom}</p><div>${ticket.options.map(([value, label]) => `<button data-ticket-answer="${value}" type="button">${label}</button>`).join('')}</div><footer aria-live="polite"></footer></article>`).join('')}</div></section>
  </section>`;
}

export function networkCareerView() {
  const stats = networkStats();
  const checklist = store.state.network?.careerChecklist ?? [];
  const capabilities = ['Explicar o caminho de um pacote', 'Planejar IPv4 com VLSM', 'Configurar VLAN e trunk', 'Entregar roteamento inter-VLAN', 'Configurar rotas e OSPF', 'Proteger acesso com SSH e ACL', 'Diagnosticar DHCP e DNS', 'Registrar e priorizar incidentes', 'Documentar diagrama, IPs e rollback', 'Apresentar um projeto de ponta a ponta'];
  return `<section class="page network-page"><div class="page-head"><div><span class="eyebrow">READINESS MAP</span><h1>Da base à qualificação profissional</h1><p>Não basta assistir: marque somente o que você consegue demonstrar sem roteiro.</p></div><span class="qualification-score">${stats.progress}%<small>currículo</small></span></div><section class="card career-capstone"><div><span class="eyebrow">PROJETO FINAL DE PORTFÓLIO</span><h2>Operação Atlas: matriz + filial</h2><p>Projete uma rede com VLANs, IPv4/IPv6, roteamento, Wi-Fi, DHCP/DNS, acesso seguro, monitoramento e plano de suporte. Entregue diagrama, tabela IP, configurações, testes, incidente simulado e retrospectiva.</p><div><span>Diagrama lógico</span><span>Configuração versionada</span><span>Matriz de testes</span><span>Runbook de suporte</span></div></div><b>CAPSTONE<br>PROFISSIONAL</b></section><div class="layout-main"><section class="card card-pad"><div class="card-head"><div><h2>Matriz de demonstração</h2><p>${checklist.length}/${capabilities.length} competências confirmadas por você.</p></div></div><div class="career-checklist">${capabilities.map((capability, index) => `<label><input type="checkbox" data-network-career="${index}" ${checklist.includes(index) ? 'checked' : ''}><span><b>${String(index + 1).padStart(2, '0')}</b>${escapeHtml(capability)}</span></label>`).join('')}</div></section><aside class="stack"><section class="card card-pad"><span class="eyebrow">CISCO-STYLE BLUEPRINT</span><h3>Mapa de domínios</h3><p class="muted small">Alinhamento independente com as áreas clássicas de formação Cisco/CCNA.</p>${ciscoAlignment.map(([domain, modules]) => `<div class="alignment-row"><strong>${domain}</strong><small>${modules}</small></div>`).join('')}</section><section class="card card-pad"><span class="eyebrow">PRÓXIMO PASSO</span><h3>${escapeHtml(stats.nextLesson.title)}</h3><p class="muted small">Conclua a trilha e depois pratique no Cisco Packet Tracer ou em equipamentos autorizados.</p><a class="button button-primary button-block" href="#/network/lesson/${stats.nextLesson.id}">Continuar agora</a></section></aside></div><section class="card alignment-table"><header><div><span class="eyebrow">REFERÊNCIA CURRICULAR</span><h2>O que cada domínio cobre aqui</h2></div><a href="https://www.netacad.com/" target="_blank" rel="noopener">Cisco Networking Academy ↗</a></header>${ciscoAlignment.map(([domain, modules, scope]) => `<div><strong>${domain}</strong><b>${modules}</b><span>${scope}</span></div>`).join('')}</section></section>`;
}

export function calculateSubnet(ip, prefix) {
  const octets = String(ip).trim().split('.').map(Number);
  const cidr = Number(prefix);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255) || !Number.isInteger(cidr) || cidr < 0 || cidr > 32) throw new Error('Informe um IPv4 válido e um prefixo entre /0 e /32.');
  const value = octets.reduce((total, octet) => ((total << 8) | octet) >>> 0, 0) >>> 0;
  const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const network = (value & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const format = (number) => [24, 16, 8, 0].map((shift) => (number >>> shift) & 255).join('.');
  const total = 2 ** (32 - cidr);
  const usable = cidr === 32 ? 1 : cidr === 31 ? 2 : Math.max(0, total - 2);
  return { address: format(value), prefix: cidr, mask: format(mask), network: format(network), broadcast: format(broadcast), first: format(cidr >= 31 ? network : network + 1), last: format(cidr >= 31 ? broadcast : broadcast - 1), total, usable };
}

export function iosCommandReply(command, history = []) {
  const normalized = String(command).trim().toLocaleLowerCase('en-US').replace(/\s+/g, ' ');
  if (!normalized) return { output: '', prompt: history.includes('configure terminal') ? 'Router(config)#' : 'Router>' };
  const known = [
    [/^enable$/, 'Router#', 'Modo EXEC privilegiado habilitado.'],
    [/^(configure terminal|conf t)$/, 'Router(config)#', 'Entre com um comando de configuração por linha.'],
    [/^hostname\s+[a-z0-9-]+$/i, 'EDGE-R1(config)#', 'Hostname aplicado.'],
    [/^(interface|int)\s+(g|gigabitethernet)0\/0$/i, 'EDGE-R1(config-if)#', 'Interface GigabitEthernet0/0 selecionada.'],
    [/^ip address 192\.168\.10\.1 255\.255\.255\.0$/, 'EDGE-R1(config-if)#', 'Endereço IPv4 configurado.'],
    [/^no shutdown$/, 'EDGE-R1(config-if)#', '%LINK-3-UPDOWN: Interface GigabitEthernet0/0, changed state to up'],
    [/^(end|exit)$/, 'EDGE-R1#', 'Modo anterior encerrado.'],
    [/^show ip interface brief$/, 'EDGE-R1#', 'Interface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0     192.168.10.1    YES manual up                    up'],
    [/^(copy running-config startup-config|write memory|wr)$/, 'EDGE-R1#', 'Building configuration...\n[OK]'],
    [/^show (running-config|run)$/, 'EDGE-R1#', 'hostname EDGE-R1\ninterface GigabitEthernet0/0\n ip address 192.168.10.1 255.255.255.0\n no shutdown'],
    [/^ping 192\.168\.10\.\d+$/, 'EDGE-R1#', '!!!!!\nSuccess rate is 100 percent (5/5)'],
  ];
  const match = known.find(([pattern]) => pattern.test(normalized));
  return match ? { prompt: match[1], output: match[2], normalized } : { prompt: history.includes('configure terminal') ? 'EDGE-R1(config)#' : 'EDGE-R1#', output: `% Comando não reconhecido neste laboratório: ${command}\nUse a missão como guia e confira a sintaxe.`, normalized };
}
