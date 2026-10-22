export interface LiveNewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'IA' | 'Computacao' | 'Sistemas' | 'Pesquisa';
  date: string;
  url: string;
  source: string;
  readTime: string;
  savedAt?: string;
}

const SAVED_ARTICLES_KEY = 'anamnese_saved_articles';

export function getSavedArticles(): LiveNewsItem[] {
  try {
    const raw = localStorage.getItem(SAVED_ARTICLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveArticleLocally(article: LiveNewsItem): void {
  const current = getSavedArticles();
  if (current.some((item) => item.id === article.id)) return;

  const updated = [
    { ...article, savedAt: new Date().toLocaleDateString('pt-BR') },
    ...current,
  ];
  localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(updated));
}

export function removeSavedArticle(articleId: string): void {
  const current = getSavedArticles();
  const updated = current.filter((item) => item.id !== articleId);
  localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(updated));
}

export function isArticleSaved(articleId: string): boolean {
  const current = getSavedArticles();
  return current.some((item) => item.id === articleId);
}

export async function fetchLiveTechNews(): Promise<{ items: LiveNewsItem[]; isOffline: boolean }> {
  // Se estiver sem conexão com a internet, não dispara requisições externas
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { items: getSavedArticles(), isOffline: true };
  }

  const articles: LiveNewsItem[] = [];

  try {
    const devToRes = await fetch('https://dev.to/api/articles?tag=ai&top=7', {
      headers: { Accept: 'application/json' },
    });

    if (devToRes.ok) {
      const devToData = await devToRes.json();
      devToData.forEach((item: any) => {
        articles.push({
          id: `devto_${item.id}`,
          title: item.title,
          summary: item.description || 'Publicacao tecnica sobre arquitetura de sistemas e modelos de inteligência artificial.',
          category: 'IA',
          date: new Date(item.published_at).toLocaleDateString('pt-BR'),
          url: item.url,
          source: 'Dev.to Community',
          readTime: `${item.reading_time_minutes || 5} min`,
        });
      });
    }

    const csRes = await fetch('https://dev.to/api/articles?tag=computerscience&top=5', {
      headers: { Accept: 'application/json' },
    });

    if (csRes.ok) {
      const csData = await csRes.json();
      csData.forEach((item: any) => {
        articles.push({
          id: `devto_cs_${item.id}`,
          title: item.title,
          summary: item.description || 'Analise de estruturas de dados, algoritmos e engenharia de software.',
          category: 'Computacao',
          date: new Date(item.published_at).toLocaleDateString('pt-BR'),
          url: item.url,
          source: 'Computer Science Hub',
          readTime: `${item.reading_time_minutes || 4} min`,
        });
      });
    }

    return { items: articles, isOffline: false };
  } catch (err) {
    // Falha de rede durante a execução: retorna o acervo offline
    return { items: getSavedArticles(), isOffline: true };
  }
}