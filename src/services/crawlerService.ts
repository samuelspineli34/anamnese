import { Question, Category } from '../types';

export async function scrapeOnlineQuestions(): Promise<Question[]> {
  const scraped: Question[] = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch('https://opentdb.com/api.php?amount=40&category=18&type=multiple', {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return [];

    const data = await res.json();
    if (Array.isArray(data.results)) {
      data.results.forEach((item: any, idx: number) => {
        const rawQ = decodeHtmlEntities(item.question);
        const qLower = rawQ.toLowerCase();

        // Se contem mencao a cidades, empresas, sedes ou fundadores -> ESTRICTAMENTE TRIVIA
        const isCompanyOrHistory =
          qLower.includes('headquarters') ||
          qLower.includes('silicon valley') ||
          qLower.includes('company') ||
          qLower.includes('nvidia') ||
          qLower.includes('apple') ||
          qLower.includes('microsoft') ||
          qLower.includes('founder') ||
          qLower.includes('released in') ||
          qLower.includes('ceo') ||
          qLower.includes('game') ||
          qLower.includes('movie');

        let category: Category = 'trivia';

        if (isCompanyOrHistory) {
          category = 'trivia';
        } else if (qLower.includes('cryptography') || qLower.includes('rsa') || qLower.includes('security') || qLower.includes('firewall') || qLower.includes('hash')) {
          category = 'seguranca';
        } else if (qLower.includes('pipeline') || qLower.includes('cpu') || qLower.includes('cache') || qLower.includes('register') || qLower.includes('instruction')) {
          category = 'arquitetura';
        } else if (qLower.includes('python') || qLower.includes('javascript') || qLower.includes('c++') || qLower.includes('rust') || qLower.includes('syntax')) {
          category = 'linguagens';
        } else if (qLower.includes('pixel') || qLower.includes('shader') || qLower.includes('render') || qLower.includes('raster')) {
          category = 'computacao_grafica';
        } else if (qLower.includes('design pattern') || qLower.includes('solid') || qLower.includes('refactoring') || qLower.includes('agile')) {
          category = 'engenharia_software';
        } else if (qLower.includes('protocol') || qLower.includes('ip address') || qLower.includes('tcp') || qLower.includes('udp') || qLower.includes('packet')) {
          category = 'redes';
        } else if (qLower.includes('operating system') || qLower.includes('kernel') || qLower.includes('deadlock') || qLower.includes('page fault')) {
          category = 'so';
        } else if (qLower.includes('sql') || qLower.includes('database') || qLower.includes('acid') || qLower.includes('foreign key')) {
          category = 'banco_dados';
        } else if (qLower.includes('neural') || qLower.includes('machine learning') || qLower.includes('deep learning')) {
          category = 'ia';
        } else if (qLower.includes('compiler') || qLower.includes('ast') || qLower.includes('parser') || qLower.includes('grammar')) {
          category = 'compiladores';
        } else if (qLower.includes('quicksort') || qLower.includes('binary search') || qLower.includes('tree') || qLower.includes('graph') || qLower.includes('complexity')) {
          category = 'algoritmos';
        } else {
          category = 'trivia';
        }

        const options = [...item.incorrect_answers.map(decodeHtmlEntities), decodeHtmlEntities(item.correct_answer)].sort(
          () => Math.random() - 0.5
        );

        scraped.push({
          id: `scraped_${Date.now()}_${idx}`,
          category,
          question: rawQ,
          options,
          correctIndex: options.indexOf(decodeHtmlEntities(item.correct_answer)),
          explanation: `Questao catalogada formalmente no modulo de ${category.toUpperCase()}.`,
        });
      });
    }
  } catch {
    // Falha silenciosa
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