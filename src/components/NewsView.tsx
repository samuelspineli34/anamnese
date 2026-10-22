import React from 'react';
import { mockNews } from '../data/news';
import { useI18n } from '../context/I18nContext';
import { ArrowUpRight, Clock, FileCode2 } from 'lucide-react';

export const NewsView: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <h2 className="text-sm font-mono font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-wide">
          <FileCode2 className="w-4 h-4 text-zinc-400" /> {t.newsView.header}
        </h2>
        <span className="text-[10px] font-mono text-zinc-500 uppercase">{t.newsView.updatedLabel}</span>
      </div>

      <div className="space-y-3">
        {mockNews.map((news) => (
          <article
            key={news.id}
            className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                {news.category}
              </span>
              <span className="text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {news.readTime}
              </span>
            </div>

            <h3 className="font-semibold text-zinc-100 text-sm leading-snug">{news.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{news.summary}</p>

            <a
              href={news.url}
              onClick={(e) => { e.preventDefault(); }}
              className="mt-1 inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-500 hover:text-emerald-400"
            >
              <span>{t.newsView.readMore}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};