import { Question, Category } from '../types';

export class AIQuestionService {
  // 1. Sintese Dinamica de questoes via IA aberta (sem chaves de API pagas e leve)
  public static async generateAIBatch(category: Category, count: number = 3): Promise<Question[]> {
    try {
      const prompt = `Gere exatamente ${count} questoes tecnicas de nivel superior de Ciencia da Computacao sobre '${category}'.
Retorne APENAS um JSON valido sem formatacao markdown, no formato:
[{"question":"pergunta","options":["A","B","C","D"],"correctIndex":0,"explanation":"explicacao formal"}]`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // Timeout rapido de 6s para nao travar o app

      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai&json=true`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        if (Array.isArray(parsed)) {
          return parsed.map((item, idx) => ({
            id: `ai_${category}_${Date.now()}_${idx}`,
            category,
            question: item.question,
            options: item.options,
            correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
            explanation: item.explanation || 'Resolucao fundamentada em conceitos formais de computacao.'
          }));
        }
      }
    } catch {
      // Em caso de falha de rede ou timeout, recorre ao gerador procedural imediato
    }
    return this.generateProceduralBatch(category);
  }

  // 2. Motor Procedural Matematico (Gera questoes tecnicas instantaneas com calculo real)
  public static generateProceduralBatch(category: Category): Question[] {
    const list: Question[] = [];
    const timestamp = Date.now();

    if (category === 'algoritmos') {
      const nValues = [2, 4, 8];
      const aVal = nValues[Math.floor(Math.random() * nValues.length)];
      list.push({
        id: `proc_algo_${timestamp}`,
        category: 'algoritmos',
        question: `Pelo Teorema Mestre, qual a complexidade assintotica da recorrencia T(n) = ${aVal}T(n/2) + Theta(n)?`,
        options: [
          aVal === 2 ? "Theta(n log n)" : aVal > 2 ? `Theta(n^${Math.log2(aVal)})` : "Theta(n)",
          "Theta(n^2)",
          "Theta(log n)",
          "Theta(n!)"
        ],
        correctIndex: 0,
        explanation: `Na relacao T(n) = aT(n/b) + f(n), temos a=${aVal}, b=2 e f(n)=Theta(n). Como log_b(a) = log_2(${aVal}), a comparacao com f(n) define o caso analitico do Teorema Mestre.`
      });
    } else if (category === 'redes') {
      const prefix = [24, 26, 28, 30][Math.floor(Math.random() * 4)];
      const totalHosts = Math.pow(2, 32 - prefix) - 2;
      list.push({
        id: `proc_net_${timestamp}`,
        category: 'redes',
        question: `Em uma sub-rede IPv4 com mascara CIDR /${prefix}, quantos enderecos IP de host validos estao disponiveis para alocacao?`,
        options: [
          `${totalHosts} hosts utilizaveis`,
          `${totalHosts + 2} hosts utilizaveis`,
          `${Math.pow(2, prefix)} hosts utilizaveis`,
          `${Math.max(1, totalHosts - 4)} hosts utilizaveis`
        ],
        correctIndex: 0,
        explanation: `Com prefixo /${prefix}, restam ${32 - prefix} bits para a porcao de host. O total de combinacoes e 2^(${32 - prefix}) = ${totalHosts + 2}. Subtraem-se 2 enderecos reservados (identificador da rede e broadcast), restando ${totalHosts} enderecos uteis.`
      });
    } else if (category === 'arquitetura') {
      const cacheSets = [64, 128, 256][Math.floor(Math.random() * 3)];
      const setBits = Math.log2(cacheSets);
      list.push({
        id: `proc_arq_${timestamp}`,
        category: 'arquitetura',
        question: `Em uma memoria cache mapeada por conjuntos com ${cacheSets} conjuntos (sets), quantos bits do endereco de memoria sao destinados exclusivamente ao campo Index?`,
        options: [
          `${setBits} bits`,
          `${setBits + 2} bits`,
          `${Math.round(setBits / 2)} bits`,
          `${cacheSets} bits`
        ],
        correctIndex: 0,
        explanation: `O campo Index seleciona exatamente qual conjunto da cache sera consultado. O numero de bits necessarios e dado por log2(numero de conjuntos). Logo, log2(${cacheSets}) = ${setBits} bits.`
      });
    } else {
      // Questoes conceituais estruturadas de contingencia
      list.push({
        id: `proc_gen_${category}_${timestamp}`,
        category,
        question: `Qual a propriedade fundamental de isolamento e corretude no contexto de ${category.replace('_', ' ').toUpperCase()}?`,
        options: [
          "Garantia de determinismo, ausencia de condicoes de corrida e respeito as invariantes de projeto.",
          "Processamento estritamente assincrono sem validacao de tipos em tempo de compilacao.",
          "Eliminacao de estruturas hierarquicas em prol de busca linear plana.",
          "Substituicao completa de transacoes formais por gravacoes estocasticas."
        ],
        correctIndex: 0,
        explanation: "Sistemas robustos de computacao priorizam a preservacao de invariantes de estado, previsibilidade assintotica e integridade formal de dados."
      });
    }

    return list;
  }
}