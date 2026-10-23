import { Question, Category } from '../types';

export async function scrapeOnlineQuestions(): Promise<Question[]> {
  const scraped: Question[] = [];

  try {
    // Busca um lote maior de 50 itens de computacao
    const res = await fetch('https://opentdb.com/api.php?amount=50&category=18&type=multiple');
    if (!res.ok) return [];

    const data = await res.json();
    if (Array.isArray(data.results)) {
      data.results.forEach((item: any, idx: number) => {
        const rawQ = decodeHtmlEntities(item.question);
        const qLower = rawQ.toLowerCase();

        // Roteamento semantico de precisao
        let category: Category = 'trivia';

        if (qLower.includes('cryptography') || qLower.includes('rsa') || qLower.includes('security') || qLower.includes('firewall') || qLower.includes('hash') || qLower.includes('injection') || qLower.includes('exploit')) {
          category = 'seguranca';
        } else if (qLower.includes('pipeline') || qLower.includes('cpu') || qLower.includes('cache') || qLower.includes('register') || qLower.includes('processor') || qLower.includes('instruction') || qLower.includes('mips') || qLower.includes('arm')) {
          category = 'arquitetura';
        } else if (qLower.includes('python') || qLower.includes('javascript') || qLower.includes('c++') || qLower.includes('rust') || qLower.includes('syntax') || qLower.includes('variable') || qLower.includes('pointer') || qLower.includes('datatype')) {
          category = 'linguagens';
        } else if (qLower.includes('pixel') || qLower.includes('shader') || qLower.includes('render') || qLower.includes('raster') || qLower.includes('ray tracing') || qLower.includes('polygon') || qLower.includes('texture')) {
          category = 'computacao_grafica';
        } else if (qLower.includes('agile') || qLower.includes('design pattern') || qLower.includes('refactoring') || qLower.includes('solid') || qLower.includes('scrum') || qLower.includes('testing')) {
          category = 'engenharia_software';
        } else if (qLower.includes('network') || qLower.includes('protocol') || qLower.includes('ip') || qLower.includes('tcp') || qLower.includes('udp') || qLower.includes('dns') || qLower.includes('packet') || qLower.includes('ethernet')) {
          category = 'redes';
        } else if (qLower.includes('operating system') || qLower.includes('kernel') || qLower.includes('thread') || qLower.includes('deadlock') || qLower.includes('page') || qLower.includes('semaphore') || qLower.includes('linux')) {
          category = 'so';
        } else if (qLower.includes('sql') || qLower.includes('database') || qLower.includes('acid') || qLower.includes('relational') || qLower.includes('query') || qLower.includes('foreign key')) {
          category = 'banco_dados';
        } else if (qLower.includes('neural') || qLower.includes('machine learning') || qLower.includes('gradient') || qLower.includes('deep learning') || qLower.includes('ai') || qLower.includes('intelligence')) {
          category = 'ia';
        } else if (qLower.includes('compiler') || qLower.includes('grammar') || qLower.includes('ast') || qLower.includes('parser') || qLower.includes('automata') || qLower.includes('turing')) {
          category = 'compiladores';
        } else if (qLower.includes('algorithm') || qLower.includes('binary search') || qLower.includes('sorting') || qLower.includes('tree') || qLower.includes('graph') || qLower.includes('complexity') || qLower.includes('big o')) {
          category = 'algoritmos';
        } else {
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
          explanation: `Questao tecnica avaliativa catalogada em ${category.replace('_', ' ').toUpperCase()} com fundamentacao teorica estrutural.`,
        });
      });
    }
  } catch {
    // Ignora erro
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