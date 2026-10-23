import { Question } from '../types';

export class ProceduralGenerator {
  public static generateComprehensiveCurriculum(): Question[] {
    const questions: Question[] = [];

    // 1. ALGORITMOS E ESTRUTURAS DE DADOS
    const sortingAlgorithms = [
      { name: 'Quicksort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n^2)', exp: 'No pior caso (pivo desbalanceado em vetor ordenado), o Quicksort degrada para particionamento O(n^2).' },
      { name: 'Mergesort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', exp: 'O Mergesort divide o vetor sempre ao meio, garantindo custo estrito O(n log n) em qualquer cenario, com custo de memoria auxiliar O(n).' },
      { name: 'Heapsort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', exp: 'O Heapsort mantem a propriedade de max-heap em arvore binaria implicita, com ordenacao in-place O(n log n).' },
      { name: 'Bubble Sort', best: 'O(n)', avg: 'O(n^2)', worst: 'O(n^2)', exp: 'Com flag de parada para vetor ja ordenado, o Bubble Sort atinge O(n) no melhor caso e O(n^2) no pior.' },
      { name: 'Insertion Sort', best: 'O(n)', avg: 'O(n^2)', worst: 'O(n^2)', exp: 'Excelente para vetores quase ordenados com O(n) no melhor caso por deslocamento local de elementos.' },
    ];

    sortingAlgorithms.forEach((algo, i) => {
      questions.push({
        id: `algo_sort_worst_${i}`,
        category: 'algoritmos',
        question: `Qual e a complexidade de tempo de pior caso do algoritmo de ordenacao ${algo.name}?`,
        options: [algo.worst, 'O(log n)', 'O(n)', 'O(n!)'],
        correctIndex: 0,
        explanation: algo.exp,
      });

      questions.push({
        id: `algo_sort_best_${i}`,
        category: 'algoritmos',
        question: `Qual e a complexidade de tempo de melhor caso do algoritmo ${algo.name}?`,
        options: [algo.best, 'O(n^3)', 'O(2^n)', 'O(1)'],
        correctIndex: 0,
        explanation: algo.exp,
      });
    });

    const masterTheorems = [
      { a: 2, b: 2, fn: 'O(n)', res: 'Theta(n log n)', c: 'Caso 2: n^(log_2 2) = n^1 equivale assintoticamente a f(n) = n.' },
      { a: 4, b: 2, fn: 'O(n)', res: 'Theta(n^2)', c: 'Caso 1: n^(log_2 4) = n^2 domina f(n) = n polinomialmente.' },
      { a: 1, b: 2, fn: 'O(1)', res: 'Theta(log n)', c: 'Caso 2: recorrencia padrao da busca binaria em espaco logaritmico.' },
      { a: 8, b: 2, fn: 'O(n^2)', res: 'Theta(n^3)', c: 'Caso 1: n^(log_2 8) = n^3 domina f(n) = n^2.' },
      { a: 2, b: 2, fn: 'O(1)', res: 'Theta(n)', c: 'Caso 1: n^(log_2 2) = n domina a constante f(n) = O(1).' },
      { a: 3, b: 3, fn: 'O(n)', res: 'Theta(n log n)', c: 'Caso 2: n^(log_3 3) = n^1 equivale a f(n).' },
      { a: 16, b: 4, fn: 'O(n)', res: 'Theta(n^2)', c: 'Caso 1: log_4 16 = 2, dominando linearmente f(n).' }
    ];

    masterTheorems.forEach((mt, i) => {
      questions.push({
        id: `algo_master_${i}`,
        category: 'algoritmos',
        question: `Pelo Teorema Mestre, qual a solucao assintotica para a relacao T(n) = ${mt.a}T(n/${mt.b}) + ${mt.fn}?`,
        options: [mt.res, 'Theta(n^4)', 'Theta(log log n)', 'Theta(n!)'],
        correctIndex: 0,
        explanation: mt.c,
      });
    });

    // 2. REDES DE COMPUTADORES (Subnetting, Protocolos e Portas)
    const wellKnownPorts = [
      { port: 53, proto: 'DNS', desc: 'Resolucao de nomes de dominio para enderecos IP' },
      { port: 22, proto: 'SSH', desc: 'Acesso remoto criptografado via terminal seguro' },
      { port: 443, proto: 'HTTPS', desc: 'Trafego web seguro com criptografia TLS/SSL' },
      { port: 25, proto: 'SMTP', desc: 'Envio de correio eletronico entre servidores' },
      { port: 179, proto: 'BGP', desc: 'Troca de rotas entre sistemas autonomos na Internet' },
      { port: 3306, proto: 'MySQL', desc: 'Porta padrao do servidor de banco relacional MySQL' },
      { port: 5432, proto: 'PostgreSQL', desc: 'Porta padrao do SGBD relacional PostgreSQL' },
      { port: 80, proto: 'HTTP', desc: 'Protocolo de transferencia de hipertexto sem criptografia' },
      { port: 123, proto: 'NTP', desc: 'Sincronizacao de relogio de precisao em rede' },
    ];

    wellKnownPorts.forEach((p, i) => {
      questions.push({
        id: `net_port_${i}`,
        category: 'redes',
        question: `No modelo TCP/IP, qual servico utiliza por padrao a porta de transporte ${p.port}?`,
        options: [p.proto, 'DHCP Client', 'SNMP Trap', 'Telnet'],
        correctIndex: 0,
        explanation: `A porta ${p.port} e atribuida pela IANA para o servico ${p.proto}: ${p.desc}.`,
      });
    });

    const cidrRanges = [
      { prefix: 24, hosts: 254, mask: '255.255.255.0' },
      { prefix: 25, hosts: 126, mask: '255.255.255.128' },
      { prefix: 26, hosts: 62, mask: '255.255.255.192' },
      { prefix: 27, hosts: 30, mask: '255.255.255.224' },
      { prefix: 28, hosts: 14, mask: '255.255.255.240' },
      { prefix: 29, hosts: 6, mask: '255.255.255.248' },
      { prefix: 30, hosts: 2, mask: '255.255.255.252' },
    ];

    cidrRanges.forEach((cidr, i) => {
      questions.push({
        id: `net_cidr_${i}`,
        category: 'redes',
        question: `Quantos enderecos IPv4 de hosts validos estao disponiveis em uma sub-rede com mascara /${cidr.prefix} (${cidr.mask})?`,
        options: [`${cidr.hosts} hosts`, `${cidr.hosts + 2} hosts`, `${cidr.hosts * 2} hosts`, `${Math.max(1, cidr.hosts - 4)} hosts`],
        correctIndex: 0,
        explanation: `Com prefixo /${cidr.prefix}, restam ${32 - cidr.prefix} bits para host. 2^(${32 - cidr.prefix}) - 2 (descontando ID de rede e broadcast) = ${cidr.hosts} hosts uteis.`,
      });
    });

    // 3. ARQUITETURA E ORGANIZACAO DE COMPUTADORES
    const cacheConfigs = [
      { sets: 64, ways: 2, line: 32 },
      { sets: 128, ways: 4, line: 64 },
      { sets: 256, ways: 8, line: 64 },
      { sets: 512, ways: 4, line: 128 },
    ];

    cacheConfigs.forEach((cc, i) => {
      const setBits = Math.log2(cc.sets);
      const offsetBits = Math.log2(cc.line);
      questions.push({
        id: `arq_cache_${i}`,
        category: 'arquitetura',
        question: `Em uma memoria cache com ${cc.sets} conjuntos e linhas de ${cc.line} bytes, quantos bits do endereco fisico compoem respectivamente os campos Index e Offset?`,
        options: [
          `Index: ${setBits} bits | Offset: ${offsetBits} bits`,
          `Index: ${setBits + 2} bits | Offset: ${offsetBits - 1} bits`,
          `Index: ${offsetBits} bits | Offset: ${setBits} bits`,
          `Index: ${cc.sets} bits | Offset: ${cc.line} bits`
        ],
        correctIndex: 0,
        explanation: `O campo Index seleciona o conjunto (log2(${cc.sets}) = ${setBits} bits) e o campo Offset seleciona o byte na linha (log2(${cc.line}) = ${offsetBits} bits).`,
      });
    });

    // 4. SISTEMAS OPERACIONAIS
    const osConcepts = [
      {
        q: 'Qual condicao necessaria de Coffman e quebrada quando o sistema operacional permite desalocar compulsoriamente recursos mantidos por um processo?',
        a: 'Nao-preempcao (No Preemption)',
        e: 'A quebra da condicao de nao-preempcao possibilita retirar recursos a forca de um processo bloqueado para evitar deadlock.'
      },
      {
        q: 'O algoritmo de substituicao de paginas Segunda Chance (Clock) utiliza qual bit da tabela de paginas para inspecao heuristica?',
        a: 'Bit de Referencia (Reference Bit)',
        e: 'O ponteiro circular verifica o bit de referencia: se for 1, recebe segunda chance e zera o bit; se for 0, a pagina e selecionada para substituicao.'
      },
      {
        q: 'No escalonamento Round Robin, o que ocorre quando a fatia de tempo (quantum) e configurada para um valor excessivamente pequeno?',
        a: 'Degradacao de desempenho pelo custo excessivo de chaveamento de contexto (Context Switch)',
        e: 'Com quantum infinitesimal, a CPU despende maior tempo salvando e restaurando registradores no chaveamento do que executando instrucoes uteis.'
      },
      {
        q: 'Qual a funcao basica da instrucao atomica de hardware Test-and-Set (ou Compare-and-Swap)?',
        a: 'Permitir a leitura e gravacao concorrente em memoria em um unico ciclo indivisivel de barramento',
        e: 'Instrucoes atomicas de hardware fornecem a base de implementacao para primitivas de exclusao mutua como spinlocks e mutexes sem condicoes de corrida.'
      }
    ];

    osConcepts.forEach((c, i) => {
      questions.push({
        id: `so_concept_${i}`,
        category: 'so',
        question: c.q,
        options: [c.a, 'Paginacao Invertida', 'Escalonamento Multinivel com Realimentacao', 'Barreira de E/S Bloqueante'],
        correctIndex: 0,
        explanation: c.e,
      });
    });

    // 5. BANCOS DE DADOS
    const dbNormalForms = [
      {
        nf: 'Primeira Forma Normal (1FN)',
        rule: 'Todos os atributos contem apenas valores atomicos e indivisiveis, sem grupos repetitivos.',
        exp: 'A 1FN veta vetores, tuplas aninhadas ou listas multivaloradas em uma mesma coluna.'
      },
      {
        nf: 'Segunda Forma Normal (2FN)',
        rule: 'Estar na 1FN e nenhum atributo nao-chave depender parcialmente de uma chave primaria composta.',
        exp: 'A 2FN exige dependencia funcional total dos atributos nao-chave em relacao a chave primaria composta.'
      },
      {
        nf: 'Terceira Forma Normal (3FN)',
        rule: 'Estar na 2FN e nao conter dependencias transitivas entre atributos nao-chave.',
        exp: 'Na 3FN, nenhum atributo nao-chave pode determinar outro atributo nao-chave (X -> Y transitivo).'
      },
      {
        nf: 'Forma Normal de Boyce-Codd (BCNF)',
        rule: 'Para toda dependencia funcional X -> Y valida, X deve ser obrigatoriamente uma superchave da relacao.',
        exp: 'A BCNF e uma versao mais estrita da 3FN que elimina redundancias em tabelas com multiplas chaves candidatas compostas sobrepostas.'
      }
    ];

    dbNormalForms.forEach((nf, i) => {
      questions.push({
        id: `db_nf_${i}`,
        category: 'banco_dados',
        question: `Qual regra conceitual define a conformidade de uma tabela com a ${nf.nf}?`,
        options: [
          nf.rule,
          'Conter apenas chaves estrangeiras com indices B+Tree pre-computados.',
          'Operar sob isolamento Snapshot em armazenamento colunar.',
          'Possuir particionamento horizontal hash por timestamp estrito.'
        ],
        correctIndex: 0,
        explanation: nf.exp,
      });
    });

    // 6. COMPILADORES E TEORIA DA COMPUTACAO
    const compilerPhases = [
      { phase: 'Analise Lexica (Scanner)', out: 'Fluxo ordenado de Tokens categorizados', exp: 'O analisador lexico le o codigo-fonte bruto em caracteres e agrupa os lexemas em tokens.' },
      { phase: 'Analise Sintatica (Parser)', out: 'Arvore Sintatica Abstrata (AST)', exp: 'O parser valida a sequencia de tokens contra a gramatica livre de contexto e gera a AST.' },
      { phase: 'Analise Semantica', out: 'Tabela de Simbolos anotada e Arvore com checagem de tipos', exp: 'Verifica compatibilidade de tipos, escopos de variaveis e declaracoes repetidas.' },
      { phase: 'Otimizacao Intermediaria', out: 'Representacao SSA com propagacao de constantes e eliminacao de codigo morto', exp: 'Reduz operacoes redundantes sem alterar o comportamento semantico do programa.' }
    ];

    compilerPhases.forEach((cp, i) => {
      questions.push({
        id: `comp_phase_${i}`,
        category: 'compiladores',
        question: `Qual artefato principal e produzido pela fase de ${cp.phase} em um compilador moderno?`,
        options: [cp.out, 'Codigo de maquina binario final em formato ELF', 'Tabela de roteamento de descritores', 'Arquivo de configuracao JSON'],
        correctIndex: 0,
        explanation: cp.exp,
      });
    });

    // 7. SEGURANCA E CRIPTOGRAFIA
    const secItems = [
      {
        q: 'O algoritmo de troca de chaves Diffie-Hellman permite que duas partes estabeleçam um segredo compartilhado em um canal inseguro baseando-se em:',
        a: 'Dificuldade de calcular o logaritmo discreto em corpos finitos',
        e: 'Mesmo interceptando g^a e g^b mod p, calcular os expoentes secretos a ou b e computacionalmente inviavel para primos de grande magnitude.'
      },
      {
        q: 'Qual mecanismo de prevencao contra ataques de Cross-Site Request Forgery (CSRF) e amplamente recomendado em aplicacoes web modernas?',
        a: 'Tokens Anti-CSRF sincronizados e cookies com atributo SameSite=Strict ou Lax',
        e: 'O token imprevisivel impede que requisicoes forjadas por sites de terceiros sejam aceitas pela sessao autenticada da vitima.'
      },
      {
        q: 'Qual propriedade criptografica assegura que uma mensagem nao pode ser alterada em transito sem que o destinatario detecte a modificacao?',
        a: 'Integridade (via HMAC ou hashes com assinatura digital)',
        e: 'A integridade atesta que o conteudo recebido corresponde exatamente ao emitido, detectando qualquer mutacao de bits.'
      }
    ];

    secItems.forEach((s, i) => {
      questions.push({
        id: `sec_item_${i}`,
        category: 'seguranca',
        question: s.q,
        options: [s.a, 'Criptografia simetrica ECB sem vetor de inicializacao', 'Poda estatica de pacotes UDP na porta 80', 'Inversao de chaves assimetricas via salt estocastico'],
        correctIndex: 0,
        explanation: s.e,
      });
    });

    // 8. TRIVIA E HISTORIA DA COMPUTACAO
    const triviaItems = [
      {
        q: 'A sede global da Nvidia (empresa lider em microarquitetura de GPUs para IA) esta localizada em qual cidade do Vale do Silicio?',
        a: 'Santa Clara, California',
        e: 'A Nvidia foi fundada em 1993 e mantem sua sede corporativa principal no campus de Santa Clara, California.'
      },
      {
        q: 'Qual dos seguintes cientistas da computacao criou a linguagem C e foi co-criador do sistema operacional Unix na Bell Labs?',
        a: 'Dennis Ritchie',
        e: 'Dennis Ritchie projetou a linguagem C entre 1969 e 1973 e, ao lado de Ken Thompson, reescreveu o kernel Unix em C.'
      },
      {
        q: 'Em que ano foi acionado pela primeira vez o computador eletronico ENIAC na Universidade da Pensilvania?',
        a: '1945 / 1946',
        e: 'Construido para calculo de tabelas balisticas de artilharia, o ENIAC foi anunciado formalmente ao publico em fevereiro de 1946.'
      },
      {
        q: 'O centro de pesquisas Xerox PARC na decada de 1970 foi responsavel pelo desenvolvimento pioneiro de qual das seguintes tecnologias?',
        a: 'Interface Grafica de Usuario (GUI) orientada a janelas, mouse e Ethernet',
        e: 'O computador Xerox Alto criado no PARC introduziu o mouse moderno, desktop com icones, programacao orientada a objetos e impressao a laser.'
      }
    ];

    triviaItems.forEach((t, i) => {
      questions.push({
        id: `trivia_item_${i}`,
        category: 'trivia',
        question: t.q,
        options: [t.a, 'Palo Alto', 'Cupertino', 'Mountain View'],
        correctIndex: 0,
        explanation: t.e,
      });
    });

    return questions;
  }
}