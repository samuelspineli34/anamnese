import React, { useEffect, useState } from 'react';
import { useI18n } from '../context/I18nContext';
import {
  fetchLiveTechNews,
  LiveNewsItem,
  saveArticleLocally,
  removeSavedArticle,
  getSavedArticles,
} from '../services/newsService';
import {
  Clock,
  FileCode2,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ExternalLink,
  BookOpen
} from 'lucide-react';

const ITEMS_PER_PAGE = 4;

export const NewsView: React.FC = () => {
  const { t } = useI18n();
  const [newsList, setNewsList] = useState<LiveNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'saved'>('feed');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [readingArticle, setReadingArticle] = useState<LiveNewsItem | null>(null);

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

  const handleToggleSave = (item: LiveNewsItem) => {
    if (savedIds.has(item.id)) {
      removeSavedArticle(item.id);
    } else {
      saveArticleLocally(item);
    }
    refreshSavedIds();
  };

  const displayedList = activeTab === 'feed' ? newsList : getSavedArticles();
  const totalPages = Math.max(1, Math.ceil(displayedList.length / ITEMS_PER_PAGE));
  const paginatedList = displayedList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4 max-w-4xl mx-auto font-mono">
      {/* Modal Leitor Interno do Aplicativo */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[var(--surface-bg)] border border-[var(--border-ui)] max-w-2xl w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-ui)] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-xs uppercase font-bold text-[var(--text-primary)]">
                  Leitor Tecnico Integrado
                </span>
              </div>
              <button
                onClick={() => setReadingArticle(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
                <span className="bg-[var(--elevated-bg)] text-[var(--accent)] px-2 py-0.5 rounded border border-[var(--border-ui)] font-bold">
                  {readingArticle.category}
                </span>
                <span>Fonte Oficial: <strong className="text-[var(--text-secondary)]">{readingArticle.source}</strong></span>
                <span>•</span>
                <span>{readingArticle.date}</span>
              </div>

              <h2 className="text-base md:text-lg font-bold text-[var(--text-primary)] leading-snug">
                {readingArticle.title}
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-[var(--app-bg)] border border-[var(--border-ui)] text-xs text-[var(--text-secondary)] leading-relaxed space-y-3">
              <p>{readingArticle.summary}</p>
              <p className="text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-ui)]">
                Documento transmitido pelo portal {readingArticle.source}. Esta versao foi renderizada localmente pela engine da Anamnese para leitura imediata.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleToggleSave(readingArticle)}
                className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-lg border border-[var(--border-ui)]"
              >
                {savedIds.has(readingArticle.id) ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Salvo Offline</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Salvar no Disco</span>
                  </>
                )}
              </button>

              <a
                href={readingArticle.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--app-bg)] bg-[var(--accent)] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <span>Acessar Publicacao Original</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Cabecalho de Notícias */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-ui)] pb-3 gap-2">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">
            {t.newsView.header}
          </h2>
          {isOffline && (
            <span className="flex items-center gap-1 text-[10px] bg-amber-950/40 border border-amber-900/60 text-amber-400 px-2 py-0.5 rounded">
              <WifiOff className="w-3 h-3" /> Modo Offline
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[var(--sidebar-bg)] p-0.5 rounded-lg border border-[var(--border-ui)] text-xs">
            <button
              onClick={() => { setActiveTab('feed'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'feed' ? 'bg-[var(--elevated-bg)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'
              }`}
            >
              Feed Geral
            </button>
            <button
              onClick={() => { setActiveTab('saved'); setCurrentPage(1); refreshSavedIds(); }}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'saved' ? 'bg-[var(--elevated-bg)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'
              }`}
            >
              Salvos Offline ({savedIds.size})
            </button>
          </div>

          {!isOffline && (
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[var(--surface-bg)] border border-[var(--border-ui)] text-xs text-[var(--text-secondary)] hover:border-[var(--border-focus)] transition-colors disabled:opacity-50"
              title="Sincronizar feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[var(--accent)]' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Grade de Artigos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {paginatedList.map((item) => {
          const isSaved = savedIds.has(item.id);

          return (
            <article
              key={item.id}
              className="p-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-ui)] hover:border-[var(--border-focus)] transition-all flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="bg-[var(--elevated-bg)] text-[var(--accent)] px-2 py-0.5 rounded border border-[var(--border-ui)] font-bold uppercase">
                    {item.category}
                  </span>
                  <span className="text-[var(--text-muted)] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.readTime}
                  </span>
                </div>

                <h3 className="font-semibold text-[var(--text-primary)] text-xs md:text-sm leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[var(--border-ui)] flex items-center justify-between text-xs">
                {/* Fonte Explicita do Artigo */}
                <div className="flex flex-col">
                  <span className="text-[9px] text-[var(--text-muted)] uppercase">Fonte:</span>
                  <span className="text-[11px] font-bold text-[var(--text-secondary)]">{item.source}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSave(item)}
                    className="p-1.5 rounded-lg border border-[var(--border-ui)] hover:bg-[var(--elevated-bg)] text-[var(--text-secondary)] transition-colors"
                    title={isSaved ? 'Remover dos salvos' : 'Salvar offline'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => setReadingArticle(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent)] hover:opacity-80 py-1 px-2.5 rounded-lg bg-[var(--accent-bg)] border border-[var(--border-ui)]"
                  >
                    <span>Abrir</span>
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Paginador de Noticias */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-ui)] text-xs">
          <span className="text-[var(--text-muted)]">
            Pagina {currentPage} de {totalPages} ({displayedList.length} artigos)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-[var(--border-ui)] bg-[var(--surface-bg)] disabled:opacity-30 hover:border-[var(--border-focus)] text-[var(--text-secondary)]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 font-bold text-[var(--text-primary)]">{currentPage}</span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-[var(--border-ui)] bg-[var(--surface-bg)] disabled:opacity-30 hover:border-[var(--border-focus)] text-[var(--text-secondary)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};