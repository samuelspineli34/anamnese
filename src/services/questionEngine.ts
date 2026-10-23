import { Question, Category } from '../types';
import { scrapeOnlineQuestions } from './crawlerService';

const STORAGE_KEY = 'anamnese_questions_repo';

// Acervo abrangente com itens aprofundados para as 6 especialidades
const MASTER_CS_CURRICULUM: Question[] = [
  // Compiladores e Teoria da Computacao
  {
    id: "comp_01",
    category: "compiladores",
    question: "Na analise sintatica ascendente (Bottom-Up LR), qual a funcao da tabela Action e da tabela Goto?",
    options: [
      "Action determina acoes shift/reduce com base no token atual; Goto mapeia transicoes entre estados apos reducoes.",
      "Action gera a arvore abstrata direta; Goto aloca a memoria de tabela de simbolos.",
      "Action realiza a tokenizacao lexico-grafica; Goto otimiza loops intermediarios.",
      "Ambas realizam poda de gramaticas ambiguas sem utilizar pilha de automato."
    ],
    correctIndex: 0,
    explanation: "Em analisadores LR, a tabela ACTION gerencia as decisoes de Shift, Reduce, Accept e Error com o lookahead, enquanto a GOTO comanda as transicoes de estado com os nao-terminais apos cada reducao."
  },
  {
    id: "comp_02",
    category: "compiladores",
    question: "O problema do 'Dangling Else' em gramaticas livres de contexto e resolvido usualmente por meio de:",
    options: [
      "Associacao do 'else' ao 'if' mais proximo nao emparelhado.",
      "Conversao obrigatoria da gramatica para a Forma Normal de Chomsky.",
      "Execucao recursiva com backtracking sem pilha de execucao.",
      "Eliminacao estrita de recursao a esquerda no analisador lexico."
    ],
    correctIndex: 0,
    explanation: "O conflito do else pendente e classicamente resolvido definindo a precedencia sintatica que associa cada else ao if imediatamente antecedente e desprovido de clausula else."
  },
  {
    id: "comp_03",
    category: "compiladores",
    question: "Qual das seguintes representacoes intermediarias baseia-se na propriedade de que cada variavel e atribuida exatamente uma unica vez?",
    options: [
      "Static Single Assignment (SSA)",
      "Three-Address Code linear (3AC puro)",
      "Arvore Sintatica Concreta (Parse Tree)",
      "Codigo Quadruplo sem encadeamento"
    ],
    correctIndex: 0,
    explanation: "O formato Static Single Assignment (SSA) exige que cada variavel seja definida exatamente uma vez, facilitando propagacao de constantes e eliminacao de codigo morto via nos Phi."
  },

  // Sistemas Operacionais
  {
    id: "so_01",
    category: "so",
    question: "Em relacao a memoria virtual com paginacao por demanda, o que caracteriza a Anomalia de Belady?",
    options: [
      "O algoritmo FIFO pode registrar aumento na taxa de page faults ao receber mais molduras de pagina (frames).",
      "Processadores multinucleo entram em starvation devido ao thrashing do TLB.",
      "A memoria swap trava quando a tabela de paginas invertida atinge saturacao.",
      "O algoritmo LRU perde determinismo sob alta carga de IO assincrono."
    ],
    correctIndex: 0,
    explanation: "A anomalia de Belady demonstra que, sob certas referencias de pagina, o algoritmo FIFO pode provocar maior frequencia de page faults mesmo dispondo de mais espaco fisico em memoria."
  },
  {
    id: "so_02",
    category: "so",
    question: "O mecanismo 'Copy-on-Write' (COW) utilizado na chamada de sistema fork() tem como objetivo principal:",
    options: [
      "Evitar a duplicacao fisica imediata de paginas de memoria ate que um dos processos tente modifica-las.",
      "Sincronizar semaforos de exclusao mutua entre o processo pai e o kernel.",
      "Compilar os descritores de arquivos em tempo de chaveamento de contexto.",
      "Isolar completamente os segmentos de pilha contra transbordamento de buffer."
    ],
    correctIndex: 0,
    explanation: "Com o Copy-on-Write, pai e filho compartilham as mesmas paginas em modo somente leitura; apenas quando um deles realiza escrita ocorre a alocacao e copia real do frame."
  },
  {
    id: "so_03",
    category: "so",
    question: "Qual problema de sincronizacao ocorre quando uma thread de alta prioridade fica bloqueada aguardando um recurso retido por uma thread de baixa prioridade?",
    options: [
      "Inversao de Prioridade (Priority Inversion)",
      "Starvation estocastica de escalonamento",
      "Deadlock de exclusao mutua de Coffman",
      "Condicao de corrida preemptiva de barreira"
    ],
    correctIndex: 0,
    explanation: "A inversao de prioridade ocorre quando uma tarefa prioritaria aguarda um lock detido por uma tarefa de baixa prioridade, especialmente se tarefas intermediarias impedirem a execucao da menor. E mitigada por heranca de prioridade."
  },

  // Redes de Computadores e Protocolos
  {
    id: "redes_01",
    category: "redes",
    question: "No protocolo TCP, qual mecanismo e responsavel por evitar que o transmissor sobrecarregue a capacidade da rede intermediaria?",
    options: [
      "Janela de Congestionamento (cwnd) com algoritmos como Reno, Cubic ou BBR.",
      "Janela de Recepcao (rwnd) anunciada no cabecalho do receptor.",
      "Checksum de redundancia ciclica de 16 bits.",
      "Flag PSH (Push) ativada nos segmentos de transporte."
    ],
    correctIndex: 0,
    explanation: "O controle de congestionamento regula o fluxo conforme as condicoes da malha de rede atraves da variavel cwnd, enquanto o controle de fluxo (rwnd) apenas protege a capacidade do buffer do receptor."
  },
  {
    id: "redes_02",
    category: "redes",
    question: "Qual protocolo do plano de controle inter-dominio na Internet e fundamentado em Path Vector para prevencao de loops autonomos?",
    options: ["BGP (Border Gateway Protocol)", "OSPF (Open Shortest Path First)", "RIPv2", "IS-IS"],
    correctIndex: 0,
    explanation: "O BGP e um protocolo de vetor de caminhos (Path Vector) que armazena a lista de AS (Autonomous Systems) percorridos no atributo AS_PATH, descartando rotas que contenham seu proprio AS para vetar loops."
  },
  {
    id: "redes_03",
    category: "redes",
    question: "Em conexoes seguras com TLS 1.3, o aperto de mao (handshake) padrão requer quantas viagens de ida e volta (RTT) para troca de chaves Diffie-Hellman?",
    options: ["1-RTT", "2-RTT", "3-RTT", "Zero absoluto obrigatorio"],
    correctIndex: 0,
    explanation: "O TLS 1.3 reduziu a negociacao convencional para 1-RTT ao enviar o compartilhamento de chave (key_share) ja na mensagem ClientHello, possibilitando ate 0-RTT em reconexoes."
  },

  // Sistemas de Bancos de Dados
  {
    id: "db_01",
    category: "banco_dados",
    question: "Qual o nivel de isolamento ANSI SQL que previne Dirty Reads e Non-Repeatable Reads, mas permite leituras fantasmas (Phantom Reads)?",
    options: ["Repeatable Read", "Read Committed", "Read Uncommitted", "Serializable"],
    correctIndex: 0,
    explanation: "O nivel Repeatable Read assegura que leituras repetidas dos mesmos registros retornem dados identicos, porem consultas que buscam intervalos podem registrar tuplas recem-inseridas por transacoes concomitantes."
  },
  {
    id: "db_02",
    category: "banco_dados",
    question: "A estrutura de indice B+ Tree e preferida em relacao a tabelas Hash em sistemas de banco de dados relacionais porque:",
    options: [
      "Permite consultas eficientes por intervalo (Range Queries) gracas ao encadeamento ordenado das folhas.",
      "Apresenta custo assintotico O(1) estrito para qualquer busca pontual.",
      "Dispensa completamente a gravacao de logs de transacao no WAL.",
      "Opera exclusivamente em memoria volatil sem dependencia de blocos de disco."
    ],
    correctIndex: 0,
    explanation: "Os nos folha da arvore B+ formam uma lista duplamente ligada ordenada, o que viabiliza operacoes de escaneamento por faixa (ex: BETWEEN, >, <) com elevado aproveitamento de localidade espacial."
  },
  {
    id: "db_03",
    category: "banco_dados",
    question: "O algoritmo Two-Phase Locking Rigoroso (Strict 2PL) garante serializabilidade e previne abortos em cascata ao:",
    options: [
      "Reter todos os bloqueios exclusivos e compartilhados ate o commit ou abort definitivo da transacao.",
      "Liberar bloqueios de leitura imediatamente apos a execucao da instrucao SELECT.",
      "Alternar locks por timestamps estocasticos no subsistema de memoria.",
      "Descartar transacoes antigas por meio do protocolo Wound-Wait."
    ],
    correctIndex: 0,
    explanation: "O Strict 2PL mantem todos os locks exclusivos (e frecuentemente compartilhados) ate o termino formal da transacao, impedindo que outras transacoes leiam dados nao commitados que poderiam sofrer rollback."
  },

  // Inteligencia Artificial e Redes Neurais
  {
    id: "ia_01",
    category: "ia",
    question: "A tecnica de FlashAttention otimiza o mecanismo de auto-atencao em transformadores principalmente atraves de:",
    options: [
      "Tiling em blocos e recomputacao online para reduzir acessos lentos a memoria HBM da GPU.",
      "Poda estatica de 90% dos pesos da matriz de atencao antes do treinamento.",
      "Quantizacao uniforme de ponto flutuante para inteiros de 2 bits.",
      "Substituicao completa do produto matricial por redes convolucionais 1D."
    ],
    correctIndex: 0,
    explanation: "O FlashAttention reescreve o calculo do softmax particionando as matrizes em blocos compativeis com a memoria SRAM rapida da GPU, minimizando os gargalos de leitura/escrita na HBM de maior latencia."
  },
  {
    id: "ia_02",
    category: "ia",
    question: "No contexto de Reinforcement Learning from Human Feedback (RLHF), o algoritmo DPO (Direct Preference Optimization) se diferencia do PPO classico por:",
    options: [
      "Otimizar a politica diretamente sobre os dados de preferencia sem necessidade de treinar um modelo de recompensa explicito separado.",
      "Operar exclusivamente em modo offline sem uso de gradiente descendente.",
      "Exigir modelos de difusao latente para estimar o valor da funcao Q.",
      "Descartar totalmente o termo de divergencia Kullback-Leibler (KL)."
    ],
    correctIndex: 0,
    explanation: "O DPO formula analiticamente a recompensa em funcao da probabilidade implicita da propria politica, eliminando a fase de treinamento de um Reward Model intermediario e a instabilidade do PPO."
  },

  // Algoritmos e Estruturas de Dados
  {
    id: "algo_01",
    category: "algoritmos",
    question: "O Teorema Mestre resolve relacoes de recorrencia da forma T(n) = aT(n/b) + f(n). Para a recorrencia T(n) = 2T(n/2) + O(n), o resultado assintotico e:",
    options: ["Theta(n log n)", "Theta(n)", "Theta(n^2)", "Theta(log n)"],
    correctIndex: 0,
    explanation: "Temos a = 2, b = 2 e f(n) = O(n). Como n^(log_b a) = n^(log_2 2) = n^1, e f(n) = Theta(n^1), recaimos no Caso 2 do Teorema Mestre, resultando em Theta(n log n)."
  },
  {
    id: "algo_02",
    category: "algoritmos",
    question: "Qual estrutura de dados permite consultas de soma em intervalos de um array em tempo O(log n) e atualizacao pontual tambem em O(log n)?",
    options: ["Segment Tree ou Fenwick Tree (Binary Indexed Tree)", "Tabela Hash com encadeamento separado", "Fila de Prioridades Max-Heap", "Skip List balanceada estocastica"],
    correctIndex: 0,
    explanation: "Tanto a Segment Tree quanto a Fenwick Tree dividem o espaco de intervalos em potencias acumuladas de 2, permitindo consultas de agregacao e modificacoes pontuais em tempo logaritmico."
  }
];

class QuestionEngine {
  private questions: Question[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= MASTER_CS_CURRICULUM.length) {
          this.questions = parsed;
          return;
        }
      }
    } catch (e) {
      // Ignora erro
    }
    this.questions = [...MASTER_CS_CURRICULUM];
    this.save();
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.questions));
    } catch (e) {
      // Ignora erro de cota
    }
  }

  public getQuestionsByCategory(cat: Category): Question[] {
    return this.questions.filter((q) => q.category === cat);
  }

  public getAllQuestions(): Question[] {
    return this.questions;
  }

  public async runLiveScraper(): Promise<number> {
    const scraped = await scrapeOnlineQuestions();
    if (scraped.length > 0) {
      const existing = new Set(this.questions.map(q => q.question.toLowerCase().trim()));
      const unique = scraped.filter(q => !existing.has(q.question.toLowerCase().trim()));

      if (unique.length > 0) {
        this.questions = [...this.questions, ...unique];
        this.save();
        return unique.length;
      }
    }
    return 0;
  }

  public getCountsByCategory(): Record<Category, number> {
    const counts: Record<Category, number> = {
      algoritmos: 0,
      ia: 0,
      so: 0,
      redes: 0,
      banco_dados: 0,
      compiladores: 0,
    };

    this.questions.forEach((q) => {
      if (counts[q.category] !== undefined) {
        counts[q.category]++;
      }
    });

    return counts;
  }
}

export const questionEngine = new QuestionEngine();