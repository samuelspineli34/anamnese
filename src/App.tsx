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
import { Binary, Cpu, Database, Network, Terminal, BrainCircuit, Activity, Shield, DownloadCloud, Settings, Stethoscope } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'infinite' | 'news' | 'rank' | 'profile' | 'settings'>('quiz');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [counts, setCounts] = useState<Record<Category, number>>(questionEngine.getCountsByCategory());
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [availableRelease, setAvailableRelease] = useState<ReleaseInfo | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  const { t } = useI18n();
  const { user } = useApp();

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

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] flex flex-col md:flex-row transition-colors duration-200">
      {showUpdateModal && availableRelease && (
        <UpdateModal release={availableRelease} onDismiss={() => setShowUpdateModal(false)} />
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border-ui)] bg-[var(--sidebar-bg)] p-4 shrink-0 font-mono">
        <div className="flex items-center gap-2.5 mb-6 px-2">
          <div className="p-2 rounded-lg bg-[var(--surface-bg)] border border-[var(--border-ui)]">
            <Stethoscope className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div>
            <span className="text-sm tracking-widest font-black text-[var(--text-primary)] block">{t.appName}</span>
            <span className="text-[10px] text-[var(--accent)] uppercase tracking-tight">Telemetria Clinica v1.0</span>
          </div>
        </div>

        {user && (
          <div className="bg-[var(--surface-bg)] border border-[var(--border-ui)] rounded-xl p-3 mb-6 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Operador:</span>
              <span className="text-[var(--text-primary)] font-bold">{user.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Triagem:</span>
              <span className="text-[var(--accent)] font-bold">Nivel {user.level}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[var(--border-ui)]">
              <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                <Shield className="w-3.5 h-3.5 text-[var(--accent)]" /> Score:
              </span>
              <span className="text-[var(--text-primary)] font-bold">{user.xp} XP</span>
            </div>
          </div>
        )}

        <nav className="space-y-1 text-xs flex-1">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'quiz'
                ? 'bg-[var(--elevated-bg)] text-[var(--accent)] font-bold border border-[var(--border-focus)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-bg)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Binary className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.modules}</span>
          </button>
          <button
            onClick={() => { setSelectedCategory(null); setActiveTab('infinite'); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'infinite'
                ? 'bg-[var(--elevated-bg)] text-[var(--accent)] font-bold border border-[var(--border-focus)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-bg)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Activity className="w-4 h-4 text-[var(--accent)]" />
            <span>Diagnostico Continuo</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'news'
                ? 'bg-[var(--elevated-bg)] text-[var(--accent)] font-bold border border-[var(--border-focus)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-bg)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.news}</span>
          </button>
          <button
            onClick={() => setActiveTab('rank')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'rank'
                ? 'bg-[var(--elevated-bg)] text-[var(--accent)] font-bold border border-[var(--border-focus)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-bg)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Shield className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.ranking}</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'profile'
                ? 'bg-[var(--elevated-bg)] text-[var(--accent)] font-bold border border-[var(--border-focus)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-bg)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Terminal className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.profile}</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === 'settings'
                ? 'bg-[var(--elevated-bg)] text-[var(--accent)] font-bold border border-[var(--border-focus)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-bg)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Settings className="w-4 h-4 text-[var(--accent)]" />
            <span>Configuracoes</span>
          </button>
        </nav>
      </aside>

      {/* Painel Central */}
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
              <div className="flex items-center justify-between border-b border-[var(--border-ui)] pb-3">
                <div>
                  <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[var(--accent)]" />
                    <span>Setores de Triagem Diagnostica</span>
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Avaliacao estrutural por subsistemas de computacao e redes neurais.
                  </p>
                </div>
                <button
                  onClick={handleRunCrawler}
                  disabled={isScraping}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-bg)] border border-[var(--border-ui)] hover:border-[var(--border-focus)] text-xs text-[var(--text-secondary)] transition-colors disabled:opacity-50"
                  title="Ingestar novas questoes de endpoints abertos"
                >
                  <DownloadCloud className={`w-3.5 h-3.5 ${isScraping ? 'animate-bounce text-[var(--accent)]' : ''}`} />
                  <span>{isScraping ? 'Ingestando...' : 'Coletar Questoes'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {tracks.map((track) => {
                  const Icon = track.icon;
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleOpenModule(track.id)}
                      className="p-4 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-ui)] hover:border-[var(--border-focus)] text-left transition-all flex items-start gap-3.5 group shadow-sm"
                    >
                      <div className="p-2.5 rounded-lg bg-[var(--elevated-bg)] border border-[var(--border-ui)] group-hover:border-[var(--border-focus)] shrink-0">
                        <Icon className="w-4 h-4 text-[var(--accent)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs text-[var(--text-primary)] leading-snug truncate">
                          {track.label}
                        </h3>
                        <span className="text-[10px] text-[var(--text-muted)] block mt-1 font-bold">
                          {track.count} itens calibrados
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