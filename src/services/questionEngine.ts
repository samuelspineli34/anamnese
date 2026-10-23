import { Question, Category } from '../types';
import { scrapeOnlineQuestions } from './crawlerService';

const STORAGE_KEY = 'anamnese_questions_repo';

const MASTER_CC_CURRICULUM: Question[] = [
  // 1. Trivia e Historia da Computacao
  {
    id: "triv_01",
    category: "trivia",
    question: "Quem e amplamente reconhecido na historia por escrever o primeiro algoritmo destinado a ser processado por uma maquina (a Maquina Analitica de Babbage)?",
    options: ["Ada Lovelace", "Alan Turing", "Grace Hopper", "John von Neumann"],
    correctIndex: 0,
    explanation: "Em 1843, Ada Lovelace publicou notas detalhadas sobre a Maquina Analitica de Charles Babbage, contendo o que e considerado o primeiro algoritmo de computador do mundo, para o calculo dos numeros de Bernoulli."
  },
  {
    id: "triv_02",
    category: "trivia",
    question: "O primeiro 'bug' fisico registrado em um computador foi documentado por Grace Hopper e sua equipe no Harvard Mark II. Que tipo de objeto causou a falha?",
    options: ["Uma mariposa presa em um rele eletromecanico", "Um capacitor queimado por sobretensao", "Uma fita perfurada com rasura manual", "Um fio de cobre desconectado no painel central"],
    correctIndex: 0,
    explanation: "Em 1947, os operadores do Harvard Mark II encontraram uma mariposa real presa entre os pontos do Rele numero 70 no Painel F, colando-a no diario de bordo com o aviso 'Primeiro caso real de bug encontrado'."
  },
  {
    id: "triv_03",
    category: "trivia",
    question: "Em outubro de 1969, qual foi a primeira mensagem enviada entre dois computadores na rede ARPANET antes que o sistema falhasse?",
    options: ["LO (tentativa de enviar LOGIN)", "HELLO WORLD", "PING 1.0", "TEST PACKET"],
    correctIndex: 0,
    explanation: "Os pesquisadores da UCLA tentavam digitar 'LOGIN' para o SRI (Stanford), mas o sistema caiu apos a transmissao das duas primeiras letras 'L' e 'O'."
  },

  // 2. Arquitetura e Organizacao de Computadores
  {
    id: "arq_01",
    category: "arquitetura",
    question: "Em pipelines de instrucoes em processadores modernos, o que e um 'Hazard Estrutural' (Structural Hazard)?",
    options: [
      "Conflito de hardware em que dois estagios do pipeline demandam o mesmo recurso fisico simultaneamente.",
      "Dependencia entre instrucoes em que o resultado de uma operacao e requerido antes de ser escrito.",
      "Falha de predicao de desvio condicional provocando o descarte da fila de instrucoes.",
      "Incompatibilidade entre a microarquitetura do processador e o barramento PCI Express."
    ],
    correctIndex: 0,
    explanation: "O hazard estrutural ocorre quando uma instrucao no estagio de busca e outra no estagio de acesso a dados tentam utilizar uma memoria fisica unificada ao mesmo tempo sem portas separadas."
  },
  {
    id: "arq_02",
    category: "arquitetura",
    question: "No protocolo de coerencia de cache MESI utilizado em multiprocessadores, o estado 'Shared' indica que:",
    options: [
      "A linha esta presente em mais de um cache e encontra-se limpa (inalterada em relacao a memoria principal).",
      "A linha foi modificada localmente e requer sincronizacao com os demais nucleos.",
      "A linha e exclusiva do nucleo e pode ser sobrescrita sem emissao de sinal no barramento.",
      "A linha e invalida e deve sofrer miss na proxima tentativa de leitura."
    ],
    correctIndex: 0,
    explanation: "O estado Shared (S) atesta que a linha de cache esta presente em um ou mais caches de outros nucleos e que seus dados permanecem sincronizados e validos com a memoria principal."
  },

  // 3. Linguagens de Programacao e Paradigmas
  {
    id: "lang_01",
    category: "linguagens",
    question: "Na linguagem Rust, o subsistema 'Borrow Checker' impede condicoes de corrida em memoria compilada impondo a regra de que:",
    options: [
      "Pode-se ter multiplas referencias imutaveis (&T) OU exatamente uma unica referencia mutavel (&mut T) por vez.",
      "Toda variavel alocada na heap deve ser gerenciada obrigatoriamente por um coletor de lixo tracing.",
      "Ponteiros crus (raw pointers) sao interpretados em tempo de execucao com custos assintoticos de introspeccao.",
      "Toda funcao assincrona deve operar em threads com prioridade estrita de tempo real."
    ],
    correctIndex: 0,
    explanation: "O modelo de posse e emprestimo de Rust elimina data races em tempo de compilacao estabelecendo que, dentro de um dado ciclo de vida, ou se admitem infinitos leitores imutaveis ou um unico escritor exclusivo mutavel."
  },
  {
    id: "lang_02",
    category: "linguagens",
    question: "O conceito de 'Tail Call Optimization' (TCO) presente em linguagens funcionais permite que:",
    options: [
      "Uma chamada de funcao terminal reutilize o quadro de pilha (stack frame) atual, evitando estouro de memoria (Stack Overflow).",
      "O compilador converta qualquer chamada polimorfica em uma funcao inline nao-recursiva.",
      "Variaveis capturadas por closures sejam alocadas estaticamente na secao BSS do binario.",
      "O programador dispense o uso de avaliacao preguicosa (lazy evaluation) em fluxos infinitos."
    ],
    correctIndex: 0,
    explanation: "A TCO detecta quando a ultima acao de uma sub-rotina e chamar a si mesma ou a outra funcao, reaproveitando o mesmo frame de execucao e convertendo recursao em iteracao plana com espaco O(1)."
  },

  // 4. Engenharia de Software e Padroes
  {
    id: "eng_01",
    category: "engenharia_software",
    question: "O Principio de Substituicao de Liskov (LSP), pertencente ao SOLID, estipula que:",
    options: [
      "Objetos de uma subclasse devem poder substituir objetos da superclasse sem alterar a corretude do programa.",
      "Uma classe deve ter apenas uma unica razao conceitual para sofrer alteracoes no ciclo de vida.",
      "Modulos de alto nivel devem depender estritamente de implementacoes concretas de infraestrutura.",
      "Classes abstratas devem sempre implementar padroes de projeto criacionais do tipo Singleton."
    ],
    correctIndex: 0,
    explanation: "Formulado por Barbara Liskov, o principio estabelece que tipos derivados devem cumprir as pre-condicoes e pos-condicoes estipuladas pelo tipo base, garantindo que o polimorfismo nao quebre invariantes comportamentais."
  },
  {
    id: "eng_02",
    category: "engenharia_software",
    question: "Qual padrao de projeto estrutural fornece uma interface unificada e simplificada para um subsistema complexo de classes?",
    options: ["Facade", "Adapter", "Decorator", "Strategy"],
    correctIndex: 0,
    explanation: "O padrao Facade esconde a complexidade de subsistemas extensos expondo uma interface concisa de nivel superior para clientes que nao precisam gerenciar os componentes internos."
  },

  // 5. Seguranca da Informacao e Criptografia
  {
    id: "sec_01",
    category: "seguranca",
    question: "O algoritmo de criptografia assimetrica RSA fundamenta sua seguranca computacional na dificuldade de:",
    options: [
      "Fatoracao de inteiros que sao produtos de dois numeros primos de grande magnitude.",
      "Inversao do problema da mochila booleana NP-Completa sob chave privada.",
      "Computacao de logaritmos discretos em curvas elipticas de Weierstrass.",
      "Geracao de permutacoes circulares sem colisao em matrizes esparsas."
    ],
    correctIndex: 0,
    explanation: "O RSA baseia-se na assimetria computacional de que multiplicar dois numeros primos grandes e trivial, mas encontrar tais fatores primos a partir de seu produto n = p * q e impraticavel para chaves seguras."
  },
  {
    id: "sec_02",
    category: "seguranca",
    question: "A tecnica de protecao de memoria conhecida como ASLR (Address Space Layout Randomization) tem como objetivo primordial:",
    options: [
      "Randomizar a disposicao das posicoes de memoria dos segmentos de pilha, heap e bibliotecas para dificultar exploits de buffer overflow.",
      "Criptografar as paginas do processo na memoria RAM fisica em tempo real via AES-NI.",
      "Impedir que ponteiros desreferenciados acessem paginas limpas na tabela de paginas do kernel.",
      "Restringir a execucao de chamadas de sistema a enderecos alinhados em 64 bytes."
    ],
    correctIndex: 0,
    explanation: "O ASLR introduz aleatoriedade nas posicoes de memoria onde os executaveis e bibliotecas sao carregados, impedindo que atacantes dependam de enderecos estaticos para injecao de payload (ex: Return-Oriented Programming)."
  },

  // 6. Computacao Grafica e Imagens
  {
    id: "cg_01",
    category: "computacao_grafica",
    question: "No pipeline grafico programavel moderno, qual o estagio responsavel por determinar a cor final e as propriedades de ilumincao de cada pixel/fragmento?",
    options: ["Fragment Shader (Pixel Shader)", "Vertex Shader", "Tessellation Control Shader", "Rasterizer fixo"],
    correctIndex: 0,
    explanation: "Apos a rasterizacao dos triangulos em fragmentos, o Fragment Shader e executado para calcular a cor de cada fragmento, interpolando normais, aplicando mapeamento de texturas e avaliando modelos de luz."
  },
  {
    id: "cg_02",
    category: "computacao_grafica",
    question: "O algoritmo Z-Buffer (Depth Buffer) resolve o problema de remocao de superficies ocultas ao:",
    options: [
      "Armazenar a profundidade (distancia da camera) de cada pixel e atualizar o buffer apenas se o novo fragmento estiver mais proximo.",
      "Ordenar todos os poligonos da cena em ordem decrescente de profundidade antes da rasterizacao (Painter's Algorithm).",
      "Descartar faces que apontam para a direcao oposta ao vetor de visao (Back-Face Culling).",
      "Construir uma arvore de particionamento binario de espaco (BSP Tree) estatica."
    ],
    correctIndex: 0,
    explanation: "O Z-buffer guarda o menor valor de z para cada coordenada da tela. Quando um novo fragmento compete pela mesma coordenada, ele so substitui o pixel caso sua distancia da camera seja inferior ao valor previamente registrado."
  },

  // 7. Compiladores e Teoria da Computacao
  {
    id: "comp_01",
    category: "compiladores",
    question: "Na analise sintatica ascendente (Bottom-Up LR), qual a funcao especifica das tabelas Action e Goto?",
    options: [
      "Action determina decisoes de empilhamento/reducao pelo terminal atual; Goto determina os novos estados ao reduzir nao-terminais.",
      "Action compila a arvore concreta; Goto gerencia alocacao dinamica da memoria estatica.",
      "Action resolve conflitos de precedencia lexico-grafica; Goto otimiza variaveis nao utilizadas.",
      "Ambas realizam podas de producoes nulas sem necessidade de controle de pilha."
    ],
    correctIndex: 0,
    explanation: "Em analisadores LR, a tabela ACTION mapeia Shift/Reduce com os terminais (tokens), enquanto a tabela GOTO orquestra a transicao de estados apos o recolhimento de um simbolo nao-terminal."
  },

  // 8. Sistemas Operacionais
  {
    id: "so_01",
    category: "so",
    question: "O que caracteriza formalmente o fenomeno de Thrashing em um subsistema de gerenciamento de memoria virtual?",
    options: [
      "O sistema despende maior tempo realizando operacoes de paginacao (I/O de swap) do que executando instrucoes de processos reais.",
      "A tabela de paginas sofre corrupcao por escrita em segmentos de codigo compartilhados.",
      "Todos os processos na fila de pronto (Ready Queue) entram em deadlock circular por inversao de prioridade.",
      "O TLB (Translation Lookaside Buffer) para de responder por excesso de interrupcoes de hardware."
    ],
    correctIndex: 0,
    explanation: "O thrashing ocorre quando a soma dos conjuntos de trabalho (working sets) dos processos ativos supera a memoria fisica disponivel, forçando paginacoes continuas e degradando a utilizacao da CPU para perto de zero."
  },

  // 9. Redes de Computadores
  {
    id: "redes_01",
    category: "redes",
    question: "Qual a diferenca fundamental entre o mecanismo de controle de fluxo e o mecanismo de controle de congestionamento no protocolo TCP?",
    options: [
      "Controle de fluxo protege a capacidade de buffer do receptor; controle de congestionamento protege a capacidade de trafego da rede intermediaria.",
      "Controle de fluxo opera em UDP; controle de congestionamento e exclusivo de conexoes TCP seguras.",
      "Controle de fluxo ajusta a janela cwnd; controle de congestionamento ajusta exclusivamente o rwnd do receptor.",
      "Nao ha distincao funcional, sendo ambos controlados pelo algoritmo de Dijkstra no roteador de borda."
    ],
    correctIndex: 0,
    explanation: "O controle de fluxo utiliza a rwnd (receive window) enviada pelo host destino para nao saturar seu buffer local. Ja o congestionamento e inferido via perdas/latencia e dimensiona a cwnd para respeitar a largura de banda da rede."
  },

  // 10. Bancos de Dados
  {
    id: "db_01",
    category: "banco_dados",
    question: "O protocolo WAL (Write-Ahead Logging) em sistemas de banco de dados ACID determina que:",
    options: [
      "Nenhuma pagina modificada de dados pode ser escrita no disco antes que o respectivo registro de log de alteracao seja persistido.",
      "Todas as consultas do tipo SELECT devem ser registradas em memoria persistente antes de retornar ao cliente.",
      "Os bloqueios de leitura devem ser promovidos a bloqueios exclusivos antes de qualquer transacao.",
      "Indices secundarios devem ser reconstruidos a cada novo ciclo de commit assincrono."
    ],
    correctIndex: 0,
    explanation: "O WAL garante atomicidade e durabilidade exigindo que as entradas de log descrevendo uma transacao alcancem o armazenamento nao-volatil antes das paginas de dados modificadas serem despejadas do buffer pool."
  },

  // 11. Inteligencia Artificial
  {
    id: "ia_01",
    category: "ia",
    question: "Em Redes Neurais Convolucionais (CNNs), a operacao de Pooling (ex: Max Pooling) cumpre o proposito de:",
    options: [
      "Reduzir a dimensao espacial dos mapas de caracteristicas, propiciando invariancia a pequenas translacoes e menor custo computacional.",
      "Aumentar o numero de canais de cor na imagem para acelerar a convergencia do gradiente.",
      "Multiplicar os pesos convolucionais por matrizes ortogonais para evitar o vanishing gradient.",
      "Calcular a funcao de ativacao Softmax de forma estocastica sobre os tensores de entrada."
    ],
    correctIndex: 0,
    explanation: "O Max Pooling extrai o valor mais saliente de pequenas janelas espaciais, reduzindo drasticamente o volume de parametros da rede e conferindo robustez contra deslocamentos de escala e posicao."
  },

  // 12. Algoritmos e Estruturas de Dados
  {
    id: "algo_01",
    category: "algoritmos",
    question: "Qual das seguintes estruturas de dados permite realizar operacoes de uniao de conjuntos e busca de representantes (Union-Find) com complexidade de tempo quase linear O(alpha(n))?",
    options: [
      "Disjoint Set Union (DSU) com uniao por rank/tamanho e compressao de caminhos.",
      "Arvore AVL duplamente indexada com rotacao tripla.",
      "Fila de Prioridades com Min-Heap binomial relaxado.",
      "Tabela Hash amortizada sem tratamento de colisoes."
    ],
    correctIndex: 0,
    explanation: "Combinando Union by Rank/Size com Path Compression, as operacoes da DSU atingem complexidade amortizada O(alpha(n)), onde alpha e a funcao inversa de Ackermann, praticamente constante para qualquer tamanho de n real."
  }
];

class QuestionEngine {
  private questions: Question[] = [];
  private isAutoCrawling: boolean = false;

  constructor() {
    this.init();
    this.startBackgroundSync();
  }

  private init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= MASTER_CC_CURRICULUM.length) {
          // Garante mescla para conter todas as novas categorias se faltar alguma
          const existingIds = new Set(parsed.map((q: Question) => q.id));
          const missingMaster = MASTER_CC_CURRICULUM.filter(q => !existingIds.has(q.id));
          this.questions = [...parsed, ...missingMaster];
          this.save();
          return;
        }
      }
    } catch (e) {
      // Ignora erro
    }
    this.questions = [...MASTER_CC_CURRICULUM];
    this.save();
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.questions));
    } catch (e) {
      // Ignora estouro de storage
    }
  }

  // Sincronizacao automatica em segundo plano
  public startBackgroundSync() {
    if (this.isAutoCrawling) return;
    this.isAutoCrawling = true;

    // Dispara imediatamente e repete a cada 5 minutos
    this.runLiveScraper().finally(() => {
      this.isAutoCrawling = false;
    });

    setInterval(() => {
      this.runLiveScraper();
    }, 5 * 60 * 1000);
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
      const existing = new Set(this.questions.map((q) => q.question.toLowerCase().trim()));
      const unique = scraped.filter((q) => !existing.has(q.question.toLowerCase().trim()));

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
      so: 0,
      redes: 0,
      banco_dados: 0,
      compiladores: 0,
      ia: 0,
      arquitetura: 0,
      engenharia_software: 0,
      seguranca: 0,
      linguagens: 0,
      computacao_grafica: 0,
      trivia: 0,
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