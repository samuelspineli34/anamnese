import { Question, Category } from '../types';

export class AIQuestionService {
  // Gera lote obrigatorio de questoes para aumentar o acervo
  public static async generateImmediateHarvest(categories: Category[]): Promise<Question[]> {
    const harvested: Question[] = [];

    for (const cat of categories) {
      // 1. Gera questao procedural matematica/logica garantida com parametros unicos
      const procedural = this.generateProceduralQuestion(cat);
      harvested.push(procedural);

      // 2. Tenta sintetizar uma questao adicional via IA aberta
      try {
        const aiQuestion = await this.fetchSingleAIQuestion(cat);
        if (aiQuestion) {
          harvested.push(aiQuestion);
        }
      } catch {
        // Ignora e mantem a procedural
      }
    }

    return harvested;
  }

  private static async fetchSingleAIQuestion(category: Category): Promise<Question | null> {
    const prompt = `Gere 1 questao de multipla escolha inedita de Ciencia da Computacao para '${category}'. Retorne apenas JSON puro:
{"question":"texto","options":["A","B","C","D"],"correctIndex":0,"explanation":"explicacao"}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?json=true`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const text = await res.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const item = JSON.parse(cleaned);

      if (item && item.question && Array.isArray(item.options)) {
        return {
          id: `ai_${category}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          category,
          question: item.question,
          options: item.options,
          correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
          explanation: item.explanation || 'Conceito teorico formal de Ciencia da Computacao.',
        };
      }
    }
    return null;
  }

  // Gera variacoes procedurais que nunca se repetem
  public static generateProceduralQuestion(category: Category): Question {
    const seed = Date.now() + Math.floor(Math.random() * 10000);

    if (category === 'algoritmos') {
      const complexidades = [
        { exp: 'T(n) = 4T(n/2) + O(n)', res: 'Theta(n^2)', expText: 'Caso 1 do Teorema Mestre: n^(log_2 4) = n^2 domina f(n) = n.' },
        { exp: 'T(n) = 8T(n/2) + O(n^2)', res: 'Theta(n^3)', expText: 'Caso 1 do Teorema Mestre: n^(log_2 8) = n^3 domina f(n) = n^2.' },
        { exp: 'T(n) = 2T(n/2) + O(n log n)', res: 'Theta(n log^2 n)', expText: 'Extensao do Teorema Mestre para produtos logaritmicos.' },
        { exp: 'T(n) = T(n/2) + O(1)', res: 'Theta(log n)', expText: 'Recorrencia classica de busca binaria: logaritmo estrito.' }
      ];
      const c = complexidades[Math.floor(Math.random() * complexidades.length)];
      return {
        id: `gen_algo_${seed}`,
        category: 'algoritmos',
        question: `Qual a complexidade assintotica de tempo da relacao de recorrencia ${c.exp}?`,
        options: [c.res, 'Theta(n log n)', 'Theta(n)', 'Theta(n!)'],
        correctIndex: 0,
        explanation: c.expText,
      };
    }

    if (category === 'redes') {
      const subnets = [
        { cidr: '/27', hosts: 30, mask: '255.255.255.224' },
        { cidr: '/28', hosts: 14, mask: '255.255.255.240' },
        { cidr: '/29', hosts: 6, mask: '255.255.255.248' },
        { cidr: '/25', hosts: 126, mask: '255.255.255.128' },
      ];
      const s = subnets[Math.floor(Math.random() * subnets.length)];
      return {
        id: `gen_net_${seed}`,
        category: 'redes',
        question: `Em uma rede com mascara ${s.cidr} (${s.mask}), quantos enderecos IP de host validos podem ser configurados?`,
        options: [`${s.hosts} hosts`, `${s.hosts + 2} hosts`, `${s.hosts * 2} hosts`, `${s.hosts - 2} hosts`],
        correctIndex: 0,
        explanation: `O calculo e dado por 2^(32 - prefixo) - 2. Para ${s.cidr}, temos 2^(32 - ${s.cidr.replace('/', '')}) - 2 = ${s.hosts} hosts uteis.`,
      };
    }

    if (category === 'arquitetura') {
      const ramSizes = [4, 8, 16, 32];
      const size = ramSizes[Math.floor(Math.random() * ramSizes.length)];
      const bits = 30 + Math.log2(size);
      return {
        id: `gen_arq_${seed}`,
        category: 'arquitetura',
        question: `Um processador com enderecamento por byte requer quantos bits de barramento de endereco para acessar uma memoria fisica de ${size} GB?`,
        options: [`${bits} bits`, `${bits - 2} bits`, `${bits + 4} bits`, `${bits * 2} bits`],
        correctIndex: 0,
        explanation: `${size} GB equivalem a ${size} * 2^30 bytes = 2^${bits} enderecos unicos. Logo, sao necessarias ${bits} linhas de endereco.`,
      };
    }

    // Variacao teorica dinamica
    return {
      id: `gen_${category}_${seed}`,
      category,
      question: `No contexto de ${category.replace('_', ' ').toUpperCase()}, qual criterio e determinante para a corretude e eficiencia do sistema?`,
      options: [
        'A manutencao das invariantes de estado e a previsibilidade temporal do algoritmo.',
        'A execucao assincrona desprovida de tratamento de condicoes de borda.',
        'A alocacao de estruturas de dados sem liberacao de memoria.',
        'A substituicao de protocolos confiaveis por transmissao sem handshakes.'
      ],
      correctIndex: 0,
      explanation: 'Sistemas confiaveis exigem invariantes estritas de projeto para evitar comportamento indefinido e condicoes de corrida.',
    };
  }
}