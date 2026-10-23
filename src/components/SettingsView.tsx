import React, { useState, useEffect } from 'react';
import { StorageService, StorageMetrics } from '../services/storageService';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { HardDrive, Trash2, Palette, Wifi, WifiOff, RefreshCw, Check, Layers } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useApp();
  const { language, setLanguage } = useI18n();
  const [metrics, setMetrics] = useState<StorageMetrics>(StorageService.getMetrics());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const refreshMetrics = () => {
    setMetrics(StorageService.getMetrics());
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-mono text-[var(--text-primary)]">
      <div className="border-b border-[var(--border-ui)] pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--accent)]" />
          <span>Configuracoes e Gestao do Sistema</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Auditoria de armazenamento local, aparencia de interface e conectividade.
        </p>
      </div>

      {/* Seletor de Temas Funcional */}
      <section className="bg-[var(--surface-bg)] border border-[var(--border-ui)] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--border-ui)] pb-3">
          <Palette className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-xs font-bold uppercase text-[var(--text-primary)]">
            Aparencia e Paleta Visual
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('anamnese')}
            className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
              theme === 'anamnese'
                ? 'bg-[var(--elevated-bg)] border-[var(--accent)] text-[var(--accent)] shadow-md'
                : 'bg-[var(--app-bg)] border-[var(--border-ui)] text-[var(--text-secondary)] hover:border-[var(--border-focus)]'
            }`}
          >
            <div>
              <span className="text-xs font-bold block">Anamnese Clinica</span>
              <span className="text-[10px] text-[var(--text-muted)]">Ciano esterilizado diagnostico</span>
            </div>
            {theme === 'anamnese' && <Check className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setTheme('matrix')}
            className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
              theme === 'matrix'
                ? 'bg-[var(--elevated-bg)] border-[var(--accent)] text-[var(--accent)] shadow-md'
                : 'bg-[var(--app-bg)] border-[var(--border-ui)] text-[var(--text-secondary)] hover:border-[var(--border-focus)]'
            }`}
          >
            <div>
              <span className="text-xs font-bold block">Terminal Matrix</span>
              <span className="text-[10px] text-[var(--text-muted)]">Verde fosforescente monocromatico</span>
            </div>
            {theme === 'matrix' && <Check className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setTheme('cyber')}
            className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
              theme === 'cyber'
                ? 'bg-[var(--elevated-bg)] border-[var(--accent)] text-[var(--accent)] shadow-md'
                : 'bg-[var(--app-bg)] border-[var(--border-ui)] text-[var(--text-secondary)] hover:border-[var(--border-focus)]'
            }`}
          >
            <div>
              <span className="text-xs font-bold block">Cyberpunk Sintese</span>
              <span className="text-[10px] text-[var(--text-muted)]">Purpura e magenta de alto contraste</span>
            </div>
            {theme === 'cyber' && <Check className="w-4 h-4" />}
          </button>
        </div>
      </section>

      {/* Auditoria de Armazenamento e Cache */}
      <section className="bg-[var(--surface-bg)] border border-[var(--border-ui)] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-ui)] pb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-xs font-bold uppercase text-[var(--text-primary)]">
              Metricas de Armazenamento e Cache
            </h3>
          </div>
          <button
            onClick={refreshMetrics}
            className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Recalcular</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[var(--app-bg)] border border-[var(--border-ui)] p-3.5 rounded-lg space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">
              Memoria Total Ocupada
            </span>
            <div className="text-xl font-bold text-[var(--text-primary)]">{metrics.totalKb} KB</div>
          </div>

          <div className="bg-[var(--app-bg)] border border-[var(--border-ui)] p-3.5 rounded-lg space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">
              Questoes em Memoria Local
            </span>
            <div className="text-xl font-bold text-[var(--accent)]">{metrics.questionsCount} itens</div>
          </div>

          <div className="bg-[var(--app-bg)] border border-[var(--border-ui)] p-3.5 rounded-lg space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold block">
              Artigos Offline Salvos
            </span>
            <div className="text-xl font-bold text-[var(--text-secondary)]">{metrics.savedArticlesCount} salvos</div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => { StorageService.clearQuestionsCache(); refreshMetrics(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--app-bg)] border border-[var(--border-ui)] hover:border-[var(--border-focus)] text-[var(--text-secondary)] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Resetar Banco de Questoes</span>
          </button>

          <button
            onClick={() => { StorageService.clearSavedArticles(); refreshMetrics(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--app-bg)] border border-[var(--border-ui)] hover:border-[var(--border-focus)] text-[var(--text-secondary)] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Artigos Salvos</span>
          </button>
        </div>
      </section>

      {/* Conectividade e Idioma */}
      <section className="bg-[var(--surface-bg)] border border-[var(--border-ui)] rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-[var(--text-secondary)] block">
              Estado do Link de Dados
            </span>
            <div className="flex items-center gap-2 p-3 bg-[var(--app-bg)] border border-[var(--border-ui)] rounded-lg text-xs">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-[var(--accent)] font-bold">Conectado (Online)</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-400 font-bold">Operacao Desconectada (Offline)</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-[var(--text-secondary)] block">
              Dicionario de Diagnostico
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['pt', 'en', 'es'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`p-2.5 rounded-lg border text-center text-xs font-bold uppercase transition-colors ${
                    language === lang
                      ? 'bg-[var(--accent)] text-[var(--app-bg)] border-[var(--accent)]'
                      : 'bg-[var(--app-bg)] border-[var(--border-ui)] text-[var(--text-muted)] hover:border-[var(--border-focus)]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};