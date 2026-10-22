import React from 'react';
import { mockNews } from '../data/news';
import { ExternalLink, Sparkles, Clock } from 'lucide-react';

export const NewsView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" /> Computação & IA
        </h2>
        <span className="text-xs text-slate-500">Atualizado hoje</span>
      </div>

      <div className="space-y-3">
        {mockNews.map((news) => (
          <article
            key={news.id}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="bg-cyan-950/60 text-cyan-400 font-bold px-2 py-0.5 rounded border border-cyan-500/30">
                {news.category}
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {news.readTime}
              </span>
            </div>

            <h3 className="font-bold text-slate-100 text-base leading-snug">{news.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{news.summary}</p>

            <a
              href={news.url}
              onClick={(e) => { e.preventDefault(); alert('Em produção, abre a notícia no navegador ou WebView!'); }}
              className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              Ler artigo completo <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};