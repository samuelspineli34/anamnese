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
  BookOpen,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Type
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

  // MODO LEITURA ERGONOMICO (Focado em conforto visual e leitura fluida)
  if (readingArticle) {
    const isSaved = savedIds.has(readingArticle.id);

    return (
      <div className="max-w-2xl mx-auto py-4 px-2 space-y-6">
        {/* Barra superior do leitor */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <button
            onClick={() => setReadingArticle(null)}
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors py-1 px-2 rounded-lg hover:bg-[var(--bg-card)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a lista</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Controle de tamanho de fonte para evitar cansaço visual */}
            <button
              onClick={() => setReaderFontSize(f => f === 'normal' ? 'large' : 'normal')}
              className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] py-1 px-2 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-card)]"
              title="Ajustar tamanho do texto"
            >
              <Type className="w-3.5 h-3.5" />
              <span>{readerFontSize === 'normal' ? 'Texto Médio' : 'Texto Grande'}</span>
            </button>

            <button
              onClick={() => handleToggleSave(readingArticle)}
              className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] py-1 px-2 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-card)]"
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Salvo' : 'Salvar'}</span>
            </button>
          </div>
        </div>

        {/* Artigo com tipografia descansada para a vista */}
        <article className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
              <span className="font-medium text-[var(--accent)]">{readingArticle.category}</span>
              <span>•</span>
              <span>Fonte: {readingArticle.source}</span>
              <span>•</span>
              <span>{readingArticle.readTime} de leitura</span>
            </div>

            <h1 className="text-xl md:text-2xl font-semibold text-[var(--text-main)] leading-snug tracking-tight">
              {readingArticle.title}
            </h1>
          </div>

          <div
            className={`reader-text text-[var(--text-main)] leading-relaxed space-y-4 pt-4 border-t border-[var(--border-subtle)] ${
              readerFontSize === 'large' ? 'text-lg leading-8' : 'text-base leading-7'
            }`}
          >
            <p className="text-[var(--text-main)] opacity-95">
              {readingArticle.summary}
            </p>

            <p className="text-[var(--text-muted)] text-sm italic pt-4">
              Este resumo foi preparado pelo Anamnese para proporcionar uma leitura rápida e sem distrações. Voce tambem pode conferir o documento original na fonte oficial caso queira aprofundar todos os codigos e referencias.
            </p>
          </div>

          <div className="pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-xs text-[var(--text-dim)]">Publicado originalmente em {readingArticle.date}</span>
            <a
              href={readingArticle.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
            >
              <span>Abrir artigo completo na fonte</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </article>
      </div>
    );
  }

  // MODO LISTA DE ARTIGOS
  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Cabecalho simples e acolhedor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-subtle)] pb-4 gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-main)] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.newsView.header}</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Artigos e publicacoes selecionadas sobre computacao e inteligencia artificial.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[var(--bg-card)] p-1 rounded-lg border border-[var(--border-subtle)] text-xs">
            <button
              onClick={() => { setActiveTab('feed'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'feed' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] font-medium' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Novas Leituras
            </button>
            <button
              onClick={() => { setActiveTab('saved'); setCurrentPage(1); refreshSavedIds(); }}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'saved' ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] font-medium' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Salvas ({savedIds.size})
            </button>
          </div>

          {!isOffline && (
            <button
              onClick={loadData}
              disabled={loading}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-50 transition-colors"
              title="Buscar atualizacoes"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[var(--accent)]' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {isOffline && (
        <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-muted)] flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Voce esta sem internet no momento. As leituras salvas continuam totalmente disponiveis.</span>
        </div>
      )}

      {/* Grade de Artigos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {paginatedList.map((item) => {
          const isSaved = savedIds.has(item.id);

          return (
            <article
              key={item.id}
              className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-focus)] transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
                  <span className="text-[var(--accent)] font-medium">{item.category}</span>
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
                <span className="text-[11px] text-[var(--text-dim)]">Fonte: {item.source}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSave(item)}
                    className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                    title={isSaved ? 'Remover dos salvos' : 'Salvar para ler depois'}
                  >
                    {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setReadingArticle(item)}
                    className="text-xs font-medium text-[var(--accent)] bg-[var(--accent-soft)] hover:opacity-90 py-1 px-3 rounded-lg border border-transparent transition-opacity"
                  >
                    {t.newsView.readMore}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Paginador amigavel */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <span>Pagina {currentPage} de {totalPages}</span>

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