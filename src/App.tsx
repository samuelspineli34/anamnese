import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { InfiniteQuiz } from './components/InfiniteQuiz';
import { NewsView } from './components/NewsView';
import { RankingView } from './components/RankingView';
import { ProfileView } from './components/ProfileView';
import { mockQuestions } from './data/questions';
import { useApp } from './context/AppContext';
import { Cpu, Terminal, Database, GitBranch, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'infinite' | 'news' | 'rank' | 'profile'>('quiz');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const categories = [
    { id: 'algoritmos', label: 'Algoritmos & ED', icon: Layers, count: 18 },
    { id: 'ia', label: 'IA & Deep Learning', icon: Sparkles, count: 14 },
    { id: 'so', label: 'Sistemas Operacionais', icon: Terminal, count: 12 },
    { id: 'redes', label: 'Redes & Protocolos', icon: GitBranch, count: 10 },
    { id: 'banco_dados', label: 'Bancos de Dados', icon: Database, count: 15 },
    { id: 'compiladores', label: 'Compiladores', icon: Cpu, count: 8 },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-4 max-w-lg w-full mx-auto">
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-slate-100">Trilhas de Computação</h2>
              <p className="text-xs text-slate-400">Escolha uma especialidade para treinar</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveTab('infinite')}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/40 text-left transition-all flex flex-col justify-between group"
                  >
                    <Icon className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div className="mt-4">
                      <h3 className="font-bold text-sm text-slate-200">{c.label}</h3>
                      <span className="text-[10px] text-slate-500 font-semibold">{c.count} questões</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'infinite' && <InfiniteQuiz />}
        {activeTab === 'news' && <NewsView />}
        {activeTab === 'rank' && <RankingView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}