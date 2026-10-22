import React, { useEffect, useState } from 'react';
import { useI18n } from '../context/I18nContext';
import {
  fetchLiveTechNews,
  LiveNewsItem,
  saveArticleLocally,
  removeSavedArticle,
  getSavedArticles,
} from '../services/newsService';
import { ArrowUpRight, Clock, FileCode2, RefreshCw, Bookmark, BookmarkCheck, WifiOff } from 'lucide-react';

export const NewsView: React.FC = () => {
  const { t } = useI18n();
  const [newsList, setNewsList] = useState<LiveNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'saved'>('feed');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

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

  return (
    <div className="space-y-4 max-w-4xl mx-auto font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
            {t.newsView.header}
          </h2>
          {isOffline && (
            <span className="flex items-center gap-1 text-[10px] bg-amber-950/40 border border-amber-900/60 text-amber-400 px-2 py-0.5 rounded">
              <WifiOff className="w-3 h-3" /> Modo Offline
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'feed' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400'
              }`}
            >
              Feed Principal
            </button>
            <button
              onClick={() => {
                setActiveTab('saved');
                refreshSavedIds();
              }}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'saved' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400'
              }`}
            >
              Salvos Offline ({savedIds.size})
            </button>
          </div>

          {!isOffline && (
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:border-zinc-700 transition-colors disabled:opacity-50"
              title="Sincronizar feed com portais externos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-500' : 'text-zinc-400'}`} />
            </button>
          )}
        </div>
      </div>

      {isOffline && activeTab === 'feed' && (
        <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-center justify-between">
          <span>Sem conexao com a rede. Exibindo artigos salvos em memoria local.</span>
          <button
            onClick={() => setActiveTab('saved')}
            className="text-emerald-400 underline ml-2"
          >
            Ver acervo salvo
          </button>
        </div>
      )}

      {displayedList.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 text-xs bg-zinc-900/20 border border-zinc-800/80 rounded-xl">
          Nenhum artigo disponivel para visualizacao nesta secao.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayedList.map((item) => {
            const isSaved = savedIds.has(item.id);

            return (
              <article
                key={item.id}
                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700 font-bold uppercase">
                      {item.category}
                    </span>
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.readTime}
                    </span>
                  </div>

                  <h3 className="font-semibold text-zinc-100 text-xs md:text-sm leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">{item.source}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSave(item)}
                      className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded transition-colors ${
                        isSaved
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                      title={isSaved ? 'Remover dos salvos' : 'Salvar para ler offline'}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-3 h-3" />
                          <span>Salvo</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3 h-3" />
                          <span>Salvar</span>
                        </>
                      )}
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 ml-1"
                    >
                      <span>{t.newsView.readMore}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};