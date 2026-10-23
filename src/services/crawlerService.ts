import { Question, Category } from '../types';

export async function scrapeOnlineQuestions(): Promise<Question[]> {
  const scraped: Question[] = [];

  try {
    // Busca bateria da Open Trivia Database (Categoria 18: Computers)
    const res = await fetch('https://opentdb.com/api.php?amount=30&category=18&type=multiple');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results)) {
        data.results.forEach((item: any, idx: number) => {
          const rawQ = decodeHtmlEntities(item.question);
          const qLower = rawQ.toLowerCase();

          // Classificacao semantica automatica por disciplina
          let category: Category = 'algoritmos';
          if (qLower.includes('network') || qLower.includes('protocol') || qLower.includes('ip') || qLower.includes('port') || qLower.includes('router')) {
            category = 'redes';
          } else if (qLower.includes('operating system') || qLower.includes('linux') || qLower.includes('kernel') || qLower.includes('process') || qLower.includes('thread')) {
            category = 'so';
          } else if (qLower.includes('database') || qLower.includes('sql') || qLower.includes('relation') || qLower.includes('table')) {
            category = 'banco_dados';
          } else if (qLower.includes('intelligence') || qLower.includes('neural') || qLower.includes('machine learning') || qLower.includes('ai')) {
            category = 'ia';
          } else if (qLower.includes('compiler') || qLower.includes('grammar') || qLower.includes('syntax') || qLower.includes('parser')) {
            category = 'compiladores';
          }

          const options = [...item.incorrect_answers.map(decodeHtmlEntities), decodeHtmlEntities(item.correct_answer)].sort(
            () => Math.random() - 0.5
          );

          scraped.push({
            id: `scraped_otdb_${Date.now()}_${idx}`,
            category,
            question: rawQ,
            options,
            correctIndex: options.indexOf(decodeHtmlEntities(item.correct_answer)),
            explanation: 'Questao tecnica catalogada via extrator online de computacao.',
          });
        });
      }
    }
  } catch (err) {
    console.warn('Extracao externa indisponivel no momento:', err);
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
    .replace(/&aacute;/g, 'a');
}