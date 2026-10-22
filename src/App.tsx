import { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { InfiniteQuiz } from './components/InfiniteQuiz';
import { NewsView } from './components/NewsView';
import { RankingView } from './components/RankingView';
import { ProfileView } from './components/ProfileView';
import { useI18n, I18nProvider } from './context/I18nContext';
import { useApp, AppProvider } from './context/AppContext';
import { Binary, Cpu, Database, Network, Terminal, BrainCircuit, Activity, Shield } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'infinite' | 'news' | 'rank' | 'profile'>('quiz');
  const { t } = useI18n();
  const { user } = useApp();

  const tracks = [
    { id: 'algoritmos', label: t.categories.algoritmos, icon: Binary, count: 18 },
    { id: 'ia', label: t.categories.ia, icon: BrainCircuit, count: 14 },
    { id: 'so', label: t.categories.so, icon: Terminal, count: 12 },
    { id: 'redes', label: t.categories.redes, icon: Network, count: 10 },
    { id: 'banco_dados', label: t.categories.banco_dados, icon: Database, count: 15 },
    { id: 'compiladores', label: t.categories.compiladores, icon: Cpu, count: 8 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row selection:bg-zinc-800 selection:text-zinc-100">
      {/* Sidebar para telas de PC (Desktop / .exe) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950 p-4 shrink-0">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <Terminal className="w-5 h-5 text-zinc-100" />
          </div>
          <div>
            <span className="font-mono text-sm tracking-widest font-black text-zinc-100 block">
              {t.appName}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
              Desktop Edition v1.0
            </span>
          </div>
        </div>

        {user && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 mb-6 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Operador:</span>
              <span className="text-zinc-200 font-bold">{user.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Nivel:</span>
              <span className="text-emerald-500 font-bold">{user.level}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
              <span className="flex items-center gap-1 text-zinc-400">
                <Shield className="w-3.5 h-3.5 text-zinc-400" /> XP:
              </span>
              <span className="text-zinc-100 font-bold">{user.xp}</span>
            </div>
          </div>
        )}

        <nav className="space-y-1 font-mono text-xs flex-1">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'quiz' ? 'bg-zinc-900 text-zinc-100 font-bold border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200'
            }`}
          >
            <Binary className="w-4 h-4 text-emerald-500" />
            <span>{t.modules}</span>
          </button>
          <button
            onClick={() => setActiveTab('infinite')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'infinite' ? 'bg-zinc-900 text-zinc-100 font-bold border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>{t.infinite}</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'news' ? 'bg-zinc-900 text-zinc-100 font-bold border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200'
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-emerald-500" />
            <span>{t.news}</span>
          </button>
          <button
            onClick={() => setActiveTab('rank')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'rank' ? 'bg-zinc-900 text-zinc-100 font-bold border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>{t.ranking}</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'profile' ? 'bg-zinc-900 text-zinc-100 font-bold border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span>{t.profile}</span>
          </button>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto pb-24 md:pb-8">
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <h2 className="text-sm md:text-base font-mono font-bold uppercase tracking-wider text-zinc-100">
                  {t.modules}
                </h2>
                <p className="text-xs text-zinc-500 mt-1">{t.tagline}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {tracks.map((track) => {
                  const Icon = track.icon;
                  return (
                    <button
                      key={track.id}
                      onClick={() => setActiveTab('infinite')}
                      className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70 text-left transition-all flex items-start gap-3.5 group"
                    >
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 shrink-0">
                        <Icon className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs text-zinc-200 leading-snug truncate">{track.label}</h3>
                        <span className="text-[10px] font-mono text-zinc-500 block mt-1">{track.count} itens avaliativos</span>
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

        {/* Navegação inferior exclusiva para dispositivos móveis (Android / Celular) */}
        <div className="md:hidden">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <I18nProvider>
        <MainApp />
      </I18nProvider>
    </AppProvider>
  );
}