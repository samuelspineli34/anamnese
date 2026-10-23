export interface LiveNewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: 'IA' | 'Computacao' | 'Sistemas' | 'Pesquisa';
  date: string;
  timestamp: number;
  url: string;
  source: string;
  readTime: string;
  readMinutes: number;
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

// Ingestao de lista inicial de despachos
export async function fetchLiveTechNews(): Promise<{ items: LiveNewsItem[]; isOffline: boolean }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { items: getSavedArticles(), isOffline: true };
  }

  const articles: LiveNewsItem[] = [];

  try {
    const [aiRes, csRes] = await Promise.all([
      fetch('https://dev.to/api/articles?tag=ai&top=10', { headers: { Accept: 'application/json' } }),
      fetch('https://dev.to/api/articles?tag=computerscience&top=10', { headers: { Accept: 'application/json' } })
    ]);

    if (aiRes.ok) {
      const aiData = await aiRes.json();
      aiData.forEach((item: any) => {
        articles.push(normalizeArticle(item, 'IA', 'Dev.to AI'));
      });
    }

    if (csRes.ok) {
      const csData = await csRes.json();
      csData.forEach((item: any) => {
        articles.push(normalizeArticle(item, 'Computacao', 'Computer Science Hub'));
      });
    }

    return { items: articles, isOffline: false };
  } catch (err) {
    return { items: getSavedArticles(), isOffline: true };
  }
}

// Coleta do artigo COMPLETO sob demanda
export async function fetchFullArticleContent(article: LiveNewsItem): Promise<string> {
  // Se ja possui conteudo salvo ou baixado previamente
  if (article.content && article.content.length > 300) {
    return article.content;
  }

  // Se for um artigo do Dev.to, busca o endpoint de texto integral
  if (article.id.startsWith('devto_')) {
    const numericId = article.id.replace('devto_cs_', '').replace('devto_', '');
    try {
      const res = await fetch(`https://dev.to/api/articles/${numericId}`);
      if (res.ok) {
        const fullData = await res.json();
        const rawContent = fullData.body_markdown || fullData.description || '';
        if (rawContent) {
          article.content = cleanMarkdown(rawContent);
          // Se o artigo estiver salvo localmente, atualiza o cache com o texto completo
          if (isArticleSaved(article.id)) {
            saveArticleLocally(article);
          }
          return article.content;
        }
      }
    } catch (e) {
      console.warn('Falha na coleta do corpo completo do artigo:', e);
    }
  }

  return article.summary || 'Conteudo do artigo indisponivel para exibicao offline.';
}

function normalizeArticle(item: any, category: 'IA' | 'Computacao', source: string): LiveNewsItem {
  const publishedDate = new Date(item.published_at || Date.now());
  const minutes = item.reading_time_minutes || 4;

  return {
    id: `devto_${item.id}`,
    title: item.title,
    summary: item.description || 'Analise estruturada sobre fundamentos e desenvolvimento de software.',
    category,
    date: publishedDate.toLocaleDateString('pt-BR'),
    timestamp: publishedDate.getTime(),
    url: item.url,
    source,
    readTime: `${minutes} min de leitura`,
    readMinutes: minutes,
  };
}

function cleanMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---/, '') // Remove frontmatter yaml inicial
    .replace(/\{%[\s\S]*?%\}/g, '') // Remove liquid tags
    .trim();
}