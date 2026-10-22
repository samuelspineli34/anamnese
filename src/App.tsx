import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { InfiniteQuiz } from './components/InfiniteQuiz';
import { NewsView } from './components/NewsView';
import { RankingView } from './components/RankingView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { UpdateModal } from './components/UpdateModal';
import { checkLatestRelease, ReleaseInfo } from './services/updateService';
import { questionEngine } from './services/questionEngine';
import { Category } from './types';
import { useI18n, I18nProvider } from './context/I18nContext';
import { useApp, AppProvider } from './context/AppContext';
import { Binary, Cpu, Database, Network, Terminal, BrainCircuit, Activity, Shield, DownloadCloud, Settings } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'infinite' | 'news' | 'rank' | 'profile' | 'settings'>('quiz');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [counts, setCounts] = useState<Record<Category, number>>(questionEngine.getCountsByCategory());
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [availableRelease, setAvailableRelease] = useState<ReleaseInfo | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  const { t } = useI18n();
  const { user, theme } = useApp();

  useEffect(() => {
    checkLatestRelease().then((res) => {
      if (res.hasUpdate && res.release) {
        setAvailableRelease(res.release);
        setShowUpdateModal(true);
      }
    });
  }, []);

  const handleRunCrawler = async () => {
    setIsScraping(true);
    await questionEngine.runLiveScraper();
    setCounts(questionEngine.getCountsByCategory());
    setIsScraping(false);
  };

  const handleOpenModule = (catId: Category) => {
    setSelectedCategory(catId);
    setActiveTab('infinite');
  };

  const tracks = [
    { id: 'algoritmos' as Category, label: t.categories.algoritmos, icon: Binary, count: counts.algoritmos },
    { id: 'ia' as Category, label: t.categories.ia, icon: BrainCircuit, count: counts.ia },
    { id: 'so' as Category, label: t.categories.so, icon: Terminal, count: counts.so },
    { id: 'redes' as Category, label: t.categories.redes, icon: Network, count: counts.redes },
    { id: 'banco_dados' as Category, label: t.categories.banco_dados, icon: Database, count: counts.banco_dados },
    { id: 'compiladores' as Category, label: t.categories.compiladores, icon: Cpu, count: counts.compiladores },
  ];

  const themeClasses =
    theme === 'cyber'
      ? 'bg-[#0a0c14] text-cyan-400'
      : theme === 'light'
      ? 'bg-zinc-900 text-zinc-100'
      : 'bg-zinc-950 text-zinc-100';

  return (
    <div className={`min-h-screen flex flex-col md:flex-row selection:bg-zinc-800 selection:text-zinc-100 ${themeClasses}`}>
      {showUpdateModal && availableRelease && (
        <UpdateModal release={availableRelease} onDismiss={() => setShowUpdateModal(false)} />
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950/80 p-4 shrink-0 font-mono">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <Terminal className="w-5 h-5 text-zinc-100" />
          </div>
          <div>
            <span className="text-sm tracking-widest font-black text-zinc-100 block">{t.appName}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Desktop Edition v1.0</span>
          </div>
        </div>

        {user && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 mb-6 text-xs space-y-2">
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

        <nav className="space-y-1 text-xs flex-1">
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
            onClick={() => { setSelectedCategory(null); setActiveTab('infinite'); }}
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
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'settings' ? 'bg-zinc-900 text-zinc-100 font-bold border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-4 h-4 text-emerald-500" />
            <span>Configuracoes</span>
          </button>
        </nav>
      </aside>

      {/* Area Central */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingUpdate={availableRelease}
          onOpenUpdate={() => setShowUpdateModal(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto pb-24 md:pb-8">
          {activeTab === 'quiz' && (
            <div className="space-y-6 font-mono">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-zinc-100">
                    {t.modules}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">{t.tagline}</p>
                </div>
                <button
                  onClick={handleRunCrawler}
                  disabled={isScraping}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-colors disabled:opacity-50"
                  title="Buscar novas questoes em endpoints abertos"
                >
                  <DownloadCloud className={`w-3.5 h-3.5 ${isScraping ? 'animate-bounce text-emerald-500' : 'text-zinc-400'}`} />
                  <span>{isScraping ? 'Coletando...' : 'Coletar Novas Questoes'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {tracks.map((track) => {
                  const Icon = track.icon;
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleOpenModule(track.id)}
                      className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70 text-left transition-all flex items-start gap-3.5 group"
                    >
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 shrink-0">
                        <Icon className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs text-zinc-200 leading-snug truncate">
                          {track.label}
                        </h3>
                        <span className="text-[10px] text-zinc-500 block mt-1">
                          {track.count} questoes catalogadas
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'infinite' && (
            <InfiniteQuiz
              selectedCategory={selectedCategory}
              onClearFilter={() => setSelectedCategory(null)}
            />
          )}
          {activeTab === 'news' && <NewsView />}
          {activeTab === 'rank' && <RankingView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>

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