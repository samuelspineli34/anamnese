import React, { useEffect, useState, useMemo } from 'react';
import { useI18n } from '../context/I18nContext';
import {
  fetchLiveTechNews,
  fetchFullArticleContent,
  LiveNewsItem,
  saveArticleLocally,
  removeSavedArticle,
  getSavedArticles,
} from '../services/newsService';
import {
  Clock,
  BookOpen,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Type,
  Search,
  ArrowUpDown,
  Filter
} from 'lucide-react';

const ITEMS_PER_PAGE = 4;
type SortOption = 'recent' | 'old' | 'alphabetical' | 'reading_time';

export const NewsView: React.FC = () => {
  const { t } = useI18n();
  const [newsList, setNewsList] = useState<LiveNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'saved'>('feed');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Controles de Filtro e Ordenação
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Leitor
  const [readingArticle, setReadingArticle] = useState<LiveNewsItem | null>(null);
  const [articleBody, setArticleBody] = useState<string>('');
  const [loadingBody, setLoadingBody] = useState<boolean>(false);
  const [readerFontSize, setReaderFontSize] = useState<'normal' | 'large'>('normal');

  const refreshSavedIds = () => {
    const saved = getSavedArticles();
    setSavedIds(new Set(saved.map((item) => item.id)));
  };

  const loadData = async () => {
    setLoading(true);
    const result = await fetchLiveTechNews();
    setNewsList(result.items);
    setIsOffline(result.isOffline);
    refreshSavedIds();
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenReader = async (item: LiveNewsItem) => {
    setReadingArticle(item);
    setLoadingBody(true);
    const fullText = await fetchFullArticleContent(item);
    setArticleBody(fullText);
    setLoadingBody(false);
  };

  const handleToggleSave = (item: LiveNewsItem) => {
    if (savedIds.has(item.id)) {
      removeSavedArticle(item.id);
    } else {
      saveArticleLocally(item);
    }
    refreshSavedIds();
  };

  // Filtragem e Ordenacao combinadas
  const processedArticles = useMemo(() => {
    let list = activeTab === 'feed' ? [...newsList] : getSavedArticles();

    // 1. Filtro por Categoria
    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 2. Filtro de Busca Textual
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (item) => item.title.toLowerCase().includes(term) || item.summary.toLowerCase().includes(term)
      );
    }

    // 3. Ordenacao
    list.sort((a, b) => {
      if (sortBy === 'recent') return b.timestamp - a.timestamp;
      if (sortBy === 'old') return a.timestamp - b.timestamp;
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      if (sortBy === 'reading_time') return a.readMinutes - b.readMinutes;
      return 0;
    });

    return list;
  }, [newsList, activeTab, selectedCategory, searchTerm, sortBy]);

  const totalPages = Math.max(1, Math.ceil(processedArticles.length / ITEMS_PER_PAGE));
  const paginatedList = processedArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // MODO LEITURA INTEGRAL
  if (readingArticle) {
    const isSaved = savedIds.has(readingArticle.id);

    return (
      <div className="max-w-2xl mx-auto py-4 px-2 space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <button
            onClick={() => { setReadingArticle(null); setArticleBody(''); }}
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors py-1 px-2 rounded-lg hover:bg-[var(--bg-card)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a biblioteca</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setReaderFontSize(f => f === 'normal' ? 'large' : 'normal')}
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] py-1.5 px-2.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-card)]"
            >
              <Type className="w-3.5 h-3.5" />
              <span>{readerFontSize === 'normal' ? 'Texto Médio' : 'Texto Grande'}</span>
            </button>

            <button
              onClick={() => handleToggleSave(readingArticle)}
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] py-1.5 px-2.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-card)]"
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Salvo' : 'Salvar'}</span>
            </button>
          </div>
        </div>

        <article className="space-y-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
              <span className="font-medium text-[var(--accent)] uppercase">{readingArticle.category}</span>
              <span>•</span>
              <span>Fonte: {readingArticle.source}</span>
              <span>•</span>
              <span>{readingArticle.readTime}</span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-[var(--text-main)] leading-snug">
              {readingArticle.title}
            </h1>
          </div>

          {loadingBody ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)] space-y-2">
              <div className="animate-spin w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full mx-auto" />
              <p>Baixando texto integral do artigo...</p>
            </div>
          ) : (
            <div
              className={`reader-text text-[var(--text-main)] leading-relaxed space-y-4 pt-4 border-t border-[var(--border-subtle)] ${
                readerFontSize === 'large' ? 'text-lg leading-8' : 'text-base leading-7'
              }`}
            >
              {articleBody.split('\n\n').map((paragraph, idx) => {
                const text = paragraph.trim();
                if (!text) return null;

                // Subtitulos
                if (text.startsWith('#')) {
                  const heading = text.replace(/^#+\s*/, '');
                  return <h2 key={idx} className="font-bold text-base md:text-lg text-[var(--text-main)] pt-3">{heading}</h2>;
                }

                // Blocos de Codigo
                if (text.startsWith('```')) {
                  const code = text.replace(/```[a-z]*\n?/g, '').trim();
                  return (
                    <pre key={idx} className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-xs overflow-x-auto text-[var(--text-secondary)]">
                      <code>{code}</code>
                    </pre>
                  );
                }

                return (
                  <p key={idx} className="opacity-95 text-[var(--text-main)]">
                    {text}
                  </p>
                );
              })}
            </div>
          )}

          <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-dim)]">
            <span>Publicado em {readingArticle.date}</span>
            <a
              href={readingArticle.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[var(--accent)] hover:underline"
            >
              <span>Acessar fonte externa original</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Cabecalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-subtle)] pb-4 gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-main)] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.newsView.header}</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Artigos completos selecionados sobre arquitetura, computacao e IA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[var(--bg-card)] p-1 rounded-lg border border-[var(--border-subtle)] text-xs">
            <button
              onClick={() => { setActiveTab('feed'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'feed' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] font-medium' : 'text-[var(--text-muted)]'
              }`}
            >
              Feed Geral
            </button>
            <button
              onClick={() => { setActiveTab('saved'); setCurrentPage(1); refreshSavedIds(); }}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'saved' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] font-medium' : 'text-[var(--text-muted)]'
              }`}
            >
              Salvas ({savedIds.size})
            </button>
          </div>

          {!isOffline && (
            <button
              onClick={loadData}
              disabled={loading}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              title="Recarregar feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[var(--accent)]' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros, Busca e Ordenacao */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* Campo de Busca */}
        <div className="relative sm:col-span-1">
          <Search className="w-3.5 h-3.5 text-[var(--text-dim)] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por termo ou assunto..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg pl-8 pr-3 py-2 text-xs text-[var(--text-main)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--border-focus)]"
          />
        </div>

        {/* Filtro de Categoria */}
        <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-[var(--text-dim)] shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="bg-transparent w-full text-[var(--text-main)] outline-none text-xs"
          >
            <option value="all" className="bg-[var(--bg-card)]">Todas as Categorias</option>
            <option value="ia" className="bg-[var(--bg-card)]">Inteligencia Artificial</option>
            <option value="computacao" className="bg-[var(--bg-card)]">Ciencia da Computacao</option>
          </select>
        </div>

        {/* Seletor de Ordenacao */}
        <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-dim)] shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent w-full text-[var(--text-main)] outline-none text-xs"
          >
            <option value="recent" className="bg-[var(--bg-card)]">Mais Recentes</option>
            <option value="old" className="bg-[var(--bg-card)]">Mais Antigos</option>
            <option value="alphabetical" className="bg-[var(--bg-card)]">Ordem Alfabetica (A-Z)</option>
            <option value="reading_time" className="bg-[var(--bg-card)]">Menor Tempo de Leitura</option>
          </select>
        </div>
      </div>

      {isOffline && (
        <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-muted)] flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Modo offline ativo. Os artigos salvos estao preservados com texto completo.</span>
        </div>
      )}

      {/* Lista de Artigos */}
      {processedArticles.length === 0 ? (
        <div className="p-12 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl">
          Nenhum artigo encontrado com os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {paginatedList.map((item) => {
            const isSaved = savedIds.has(item.id);

            return (
              <article
                key={item.id}
                className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-focus)] transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
                    <span className="text-[var(--accent)] font-medium uppercase">{item.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.readTime}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-[var(--text-main)] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[var(--text-dim)]">Fonte:</span>
                    <span className="text-[11px] font-medium text-[var(--text-secondary)]">{item.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSave(item)}
                      className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      title={isSaved ? 'Remover dos salvos' : 'Salvar no disco'}
                    >
                      {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleOpenReader(item)}
                      className="text-xs font-medium text-[var(--accent)] bg-[var(--accent-soft)] hover:opacity-90 py-1 px-3 rounded-lg border border-transparent transition-opacity"
                    >
                      Ler Artigo
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Paginador */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <span>Pagina {currentPage} de {totalPages} ({processedArticles.length} artigos)</span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] disabled:opacity-30 hover:text-[var(--text-main)]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-[var(--text-main)]">{currentPage}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] disabled:opacity-30 hover:text-[var(--text-main)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};