// scripts/crawler.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, '../src/data/questions_bank.json');

// Categorias padrão de Ciência da Computação do App
const CATEGORY_MAP = {
  algorithms: 'algoritmos',
  os: 'so',
  networking: 'redes',
  database: 'banco_dados',
  ai: 'ia',
  compilers: 'compiladores'
};

async function fetchOpenTDBQuestions(amount = 50) {
  console.log(`[+] Baixando ${amount} questões da Open Trivia DB (Ciência da Computação)...`);
  try {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=18&type=multiple`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) return [];

    return data.results.map((item, index) => {
      const options = [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(item.correct_answer);

      // Heurística de classificação automática por palavra-chave
      let cat = 'algoritmos';
      const qLower = item.question.toLowerCase();
      if (qLower.includes('network') || qLower.includes('ip') || qLower.includes('protocol') || qLower.includes('port')) cat = 'redes';
      else if (qLower.includes('operating system') || qLower.includes('linux') || qLower.includes('kernel') || qLower.includes('process')) cat = 'so';
      else if (qLower.includes('sql') || qLower.includes('database') || qLower.includes('relational')) cat = 'banco_dados';
      else if (qLower.includes('neural') || qLower.includes('ai') || qLower.includes('intelligence') || qLower.includes('learning')) cat = 'ia';

      return {
        id: `otdb_${Date.now()}_${index}`,
        category: cat,
        question: decodeHTML(item.question),
        options: options.map(o => decodeHTML(o)),
        correctIndex,
        explanation: 'Questão técnica catalogada de Ciência da Computação.'
      };
    });
  } catch (err) {
    console.error('Erro ao buscar OpenTDB:', err.message);
    return [];
  }
}

function decodeHTML(str) {
  return str.replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

// Scraper template para concursos de TI / POSCOMP (extrai de endpoints ou HTMLs)
async function fetchPOSCOMPDataset() {
  console.log('[+] Montando base brasileira clássica (POSCOMP & Concursos)...');
  
  // Banco base de alta densidade técnica
  return [
    {
      id: "poscomp_01",
      category: "algoritmos",
      question: "Qual o limite inferior assintótico (Ω) para ordenação baseada em comparações no pior caso?",
      options: ["Ω(n)", "Ω(n log n)", "Ω(n²)", "Ω(log n)"],
      correctIndex: 1,
      explanation: "Pela árvore de decisão, qualquer algoritmo baseado exclusivamente em comparações requer no mínimo Ω(n log n) comparações."
    },
    {
      id: "poscomp_02",
      category: "so",
      question: "No algoritmo do Banqueiro de Dijkstra, o estado é considerado 'seguro' se:",
      options: [
        "Não existe nenhum processo bloqueado no momento.",
        "Existe pelo menos uma sequência de alocação que permite a todos os processos terminarem sem deadlock.",
        "A CPU está com 100% de utilização sem preempção.",
        "A paginação sob demanda não possui páginas sujas (dirty pages)."
      ],
      correctIndex: 1,
      explanation: "O estado é seguro se o SO puder alocar recursos a todos os processos em alguma ordem sem travar."
    },
    {
      id: "poscomp_03",
      category: "compiladores",
      question: "Qual classe de gramáticas formais é aceita por autômatos com pilha determinísticos?",
      options: ["Gramáticas Livres de Contexto Determinísticas (LR)", "Gramáticas Regulares Estritas", "Gramáticas Sensíveis ao Contexto", "Linguagens Recursivamente Enumeráveis"],
      correctIndex: 0,
      explanation: "Autômatos com pilha determinísticos reconhecem linguagens livres de contexto determinísticas, base dos analisadores LR."
    },
    {
      id: "poscomp_04",
      category: "ia",
      question: "No algoritmo de busca A*, a heurística h(n) é dita 'admissível' se:",
      options: [
        "Nunca superestima o custo real até atingir o objetivo.",
        "É sempre maior que o custo de Dijkstra.",
        "Depende unicamente do gradiente descendente estocástico.",
        "Garante convergência em tempo estritamente linear O(n)."
      ],
      correctIndex: 0,
      explanation: "Uma heurística admissível nunca superestima o custo para atingir o nó objetivo, garantindo a otimalidade do A*."
    },
    {
      id: "poscomp_05",
      category: "banco_dados",
      question: "Em uma modelagem relacional, uma tabela está na Terceira Forma Normal (3FN) se:",
      options: [
        "Está na 2FN e não possui dependências transitivas de atributos não-chave.",
        "Todos os atributos são atômicos e multivalorados.",
        "Não possui chaves estrangeiras compostas.",
        "Contém apenas índices B+Tree clustered."
      ],
      correctIndex: 0,
      explanation: "A 3FN exige que a relação esteja na 2FN e que nenhum atributo não-chave dependa transitivamente da chave primária."
    }
  ];
}

async function run() {
  console.log('🚀 Iniciando Crawler de Questões de CC...');
  
  const otdbQuestions = await fetchOpenTDBQuestions(50);
  const poscompQuestions = await fetchPOSCOMPDataset();

  const totalBank = [...poscompQuestions, ...otdbQuestions];

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(totalBank, null, 2), 'utf-8');
  console.log(`\n🎉 Banco salvo em: ${OUTPUT_FILE}`);
  console.log(`📊 Total de questões compiladas: ${totalBank.length}`);
}

run();