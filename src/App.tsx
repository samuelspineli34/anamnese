import { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { InfiniteQuiz } from './components/InfiniteQuiz';
import { NewsView } from './components/NewsView';
import { RankingView } from './components/RankingView';
import { ProfileView } from './components/ProfileView';
import { useI18n, I18nProvider } from './context/I18nContext';
import { Binary, Cpu, Database, Network, Terminal, BrainCircuit } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'infinite' | 'news' | 'rank' | 'profile'>('quiz');
  const { t } = useI18n();

  const tracks = [
    { id: 'algoritmos', label: t.categories.algoritmos, icon: Binary, count: 18 },
    { id: 'ia', label: t.categories.ia, icon: BrainCircuit, count: 14 },
    { id: 'so', label: t.categories.so, icon: Terminal, count: 12 },
    { id: 'redes', label: t.categories.redes, icon: Network, count: 10 },
    { id: 'banco_dados', label: t.categories.banco_dados, icon: Database, count: 15 },
    { id: 'compiladores', label: t.categories.compiladores, icon: Cpu, count: 8 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col pb-20 selection:bg-zinc-800 selection:text-zinc-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-4 max-w-lg w-full mx-auto">
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-2">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-100">
                {t.modules}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">{t.tagline}</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {tracks.map((track) => {
                const Icon = track.icon;
                return (
                  <button
                    key={track.id}
                    onClick={() => setActiveTab('infinite')}
                    className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700">
                        <Icon className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xs text-zinc-200">{track.label}</h3>
                        <span className="text-[10px] font-mono text-zinc-500">{track.count} itens avaliativos</span>
                      </div>
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

export default function App() {
  return (
    <I18nProvider>
      <MainApp />
    </I18nProvider>
  );
}