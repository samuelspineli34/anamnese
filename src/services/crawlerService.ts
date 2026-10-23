import { Question, Category } from '../types';

export async function scrapeOnlineQuestions(): Promise<Question[]> {
  const scraped: Question[] = [];

  try {
    const res = await fetch('https://opentdb.com/api.php?amount=50&category=18&type=multiple');
    if (!res.ok) return [];

    const data = await res.json();
    if (Array.isArray(data.results)) {
      data.results.forEach((item: any, idx: number) => {
        const rawQ = decodeHtmlEntities(item.question);
        const qLower = rawQ.toLowerCase();

        // Matriz estrita de roteamento semantico
        let category: Category = 'trivia';

        if (qLower.includes('cryptography') || qLower.includes('rsa') || qLower.includes('vulnerability') || qLower.includes('malware') || qLower.includes('firewall') || qLower.includes('injection') || qLower.includes('hash')) {
          category = 'seguranca';
        } else if (qLower.includes('pipeline') || qLower.includes('cpu') || qLower.includes('cache') || qLower.includes('register') || qLower.includes('instruction set') || qLower.includes('clock') || qLower.includes('risc') || qLower.includes('arm')) {
          category = 'arquitetura';
        } else if (qLower.includes('python') || qLower.includes('javascript') || qLower.includes('c++') || qLower.includes('rust') || qLower.includes('syntax') || qLower.includes('variable') || qLower.includes('type system') || qLower.includes('paradigm')) {
          category = 'linguagens';
        } else if (qLower.includes('pixel') || qLower.includes('shader') || qLower.includes('render') || qLower.includes('raster') || qLower.includes('ray tracing') || qLower.includes('polygon') || qLower.includes('rgb')) {
          category = 'computacao_grafica';
        } else if (qLower.includes('agile') || qLower.includes('design pattern') || qLower.includes('refactoring') || qLower.includes('solid') || qLower.includes('ci/cd') || qLower.includes('clean code')) {
          category = 'engenharia_software';
        } else if (qLower.includes('network') || qLower.includes('protocol') || qLower.includes('ip address') || qLower.includes('tcp') || qLower.includes('udp') || qLower.includes('dns') || qLower.includes('packet')) {
          category = 'redes';
        } else if (qLower.includes('operating system') || qLower.includes('kernel') || qLower.includes('thread') || qLower.includes('deadlock') || qLower.includes('page fault') || qLower.includes('semaphore')) {
          category = 'so';
        } else if (qLower.includes('sql') || qLower.includes('database') || qLower.includes('acid') || qLower.includes('relational') || qLower.includes('foreign key') || qLower.includes('transaction')) {
          category = 'banco_dados';
        } else if (qLower.includes('neural') || qLower.includes('machine learning') || qLower.includes('gradient') || qLower.includes('deep learning') || qLower.includes('transformer') || qLower.includes('artificial intelligence')) {
          category = 'ia';
        } else if (qLower.includes('compiler') || qLower.includes('grammar') || qLower.includes('ast') || qLower.includes('parser') || qLower.includes('turing') || qLower.includes('automata')) {
          category = 'compiladores';
        } else if (qLower.includes('binary search') || qLower.includes('quicksort') || qLower.includes('graph') || qLower.includes('tree') || qLower.includes('stack') || qLower.includes('queue') || qLower.includes('complexity') || qLower.includes('o(n)')) {
          category = 'algoritmos';
        } else {
          // Qualquer fato historico, de industria ou curiosidade fica estritamente isolado em Trivia
          category = 'trivia';
        }

        const options = [...item.incorrect_answers.map(decodeHtmlEntities), decodeHtmlEntities(item.correct_answer)].sort(
          () => Math.random() - 0.5
        );

        scraped.push({
          id: `ext_${Date.now()}_${idx}`,
          category,
          question: rawQ,
          options,
          correctIndex: options.indexOf(decodeHtmlEntities(item.correct_answer)),
          explanation: `Questao classificada no modulo de ${category.toUpperCase()} com fundamentacao tecnica em teoria e conceitos estruturais.`,
        });
      });
    }
  } catch (err) {
    // Falha silenciosa de rede
  }

  return scraped;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&eacute;/g, 'e')
    .replace(/&aacute;/g, 'a')
    .replace(/&iacute;/g, 'i')
    .replace(/&oacute;/g, 'o')
    .replace(/&uacute;/g, 'u');
}