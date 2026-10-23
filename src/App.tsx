import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { InfiniteQuiz } from './components/InfiniteQuiz';
import { NewsView } from './components/NewsView';
import { RankingView } from './components/RankingView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { StatsView } from './components/StatsView';
import { UpdateModal } from './components/UpdateModal';
import { checkLatestRelease, ReleaseInfo } from './services/updateService';
import { questionEngine } from './services/questionEngine';
import { Category } from './types';
import { useI18n, I18nProvider } from './context/I18nContext';
import { useApp, AppProvider } from './context/AppContext';
import {
  Binary,
  Cpu,
  Database,
  Network,
  Terminal,
  BrainCircuit,
  Activity,
  Award,
  Settings,
  BookOpen,
  Code2,
  Lock,
  Layers,
  Image,
  Sparkles,
  UserCheck,
  BarChart2
} from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'infinite' | 'stats' | 'news' | 'rank' | 'profile' | 'settings'>('quiz');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [counts, setCounts] = useState<Record<Category, number>>(questionEngine.getCountsByCategory());
  const [availableRelease, setAvailableRelease] = useState<ReleaseInfo | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  const { t } = useI18n();
  const { user } = useApp();

  useEffect(() => {
    // 1. Busca automatica de atualizacao ao abrir o aplicativo (Mobile e Desktop)
    checkLatestRelease().then((res) => {
      if (res.hasUpdate && res.release) {
        setAvailableRelease(res.release);
        setShowUpdateModal(true);
      }
    });

    // 2. Sincronizacao periodica do contador de questoes
    const timer = setInterval(() => {
      setCounts(questionEngine.getCountsByCategory());
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleOpenModule = (catId: Category) => {
    setSelectedCategory(catId);
    setActiveTab('infinite');
  };

  const tracks: Array<{ id: Category; label: string; icon: any; count: number }> = [
    { id: 'algoritmos', label: t.categories.algoritmos, icon: Binary, count: counts.algoritmos },
    { id: 'so', label: t.categories.so, icon: Terminal, count: counts.so },
    { id: 'redes', label: t.categories.redes, icon: Network, count: counts.redes },
    { id: 'banco_dados', label: t.categories.banco_dados, icon: Database, count: counts.banco_dados },
    { id: 'compiladores', label: t.categories.compiladores, icon: Cpu, count: counts.compiladores },
    { id: 'ia', label: t.categories.ia, icon: BrainCircuit, count: counts.ia },
    { id: 'arquitetura', label: t.categories.arquitetura, icon: Layers, count: counts.arquitetura },
    { id: 'engenharia_software', label: t.categories.engenharia_software, icon: Code2, count: counts.engenharia_software },
    { id: 'seguranca', label: t.categories.seguranca, icon: Lock, count: counts.seguranca },
    { id: 'linguagens', label: t.categories.linguagens, icon: Terminal, count: counts.linguagens },
    { id: 'computacao_grafica', label: t.categories.computacao_grafica, icon: Image, count: counts.computacao_grafica },
    { id: 'trivia', label: t.categories.trivia, icon: Sparkles, count: counts.trivia },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col md:flex-row transition-colors duration-200">
      {showUpdateModal && availableRelease && (
        <UpdateModal release={availableRelease} onDismiss={() => setShowUpdateModal(false)} />
      )}

      {/* Barra Lateral Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-sidebar)] p-4 shrink-0">
        <div className="flex items-center gap-2.5 mb-6 px-2">
          <div className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <BookOpen className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[var(--text-main)] block">{t.appName}</span>
            <span className="text-xs text-[var(--text-dim)]">Ciencia da Computacao</span>
          </div>
        </div>

        {user && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-3.5 mb-6 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-dim)]">Estudante:</span>
              <span className="text-[var(--text-main)] font-medium">{user.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-dim)]">Nivel:</span>
              <span className="text-[var(--accent)] font-medium">{user.level}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
              <span className="text-[var(--text-dim)]">Pontuacao:</span>
              <span className="text-[var(--text-main)] font-semibold">{user.xp} XP</span>
            </div>
          </div>
        )}

        <nav className="space-y-1 text-xs flex-1">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
              activeTab === 'quiz'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] font-medium'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
            }`}
          >
            <Binary className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.modules}</span>
          </button>
          <button
            onClick={() => { setSelectedCategory(null); setActiveTab('infinite'); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
              activeTab === 'infinite'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] font-medium'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
            }`}
          >
            <Activity className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.infinite}</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
              activeTab === 'stats'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] font-medium'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-[var(--accent)]" />
            <span>Estatisticas</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
              activeTab === 'news'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] font-medium'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.news}</span>
          </button>
          <button
            onClick={() => setActiveTab('rank')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
              activeTab === 'rank'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] font-medium'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
            }`}
          >
            <Award className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.ranking}</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
              activeTab === 'profile'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] font-medium'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[var(--accent)]" />
            <span>{t.profile}</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
              activeTab === 'settings'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] font-medium'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
            }`}
          >
            <Settings className="w-4 h-4 text-[var(--accent)]" />
            <span>Configuracoes</span>
          </button>
        </nav>
      </aside>

      {/* Conteudo Central */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingUpdate={availableRelease}
          onOpenUpdate={() => setShowUpdateModal(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto pb-24 md:pb-8">
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="border-b border-[var(--border-subtle)] pb-4">
                <h2 className="text-base font-semibold text-[var(--text-main)]">
                  {t.modules}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {t.tagline} Escolha uma area para revisar conceitos essenciais.
                </p>
              </div>

              {/* Grade de 12 Trilhas Curriculares */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {tracks.map((track) => {
                  const Icon = track.icon;
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleOpenModule(track.id)}
                      className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-focus)] text-left transition-all flex items-start gap-3.5 group"
                    >
                      <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] group-hover:border-[var(--border-focus)] shrink-0">
                        <Icon className="w-4 h-4 text-[var(--accent)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-xs md:text-sm text-[var(--text-main)] leading-snug">
                          {track.label}
                        </h3>
                        <span className="text-xs text-[var(--text-dim)] block mt-1">
                          {track.count} questoes para praticar
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
          {activeTab === 'stats' && <StatsView />}
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