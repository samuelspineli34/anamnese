import React, { useState, useEffect } from 'react';
import { StorageService, StorageMetrics } from '../services/storageService';
import { questionEngine } from '../services/questionEngine';
import { checkLatestRelease, ReleaseInfo, getLocalAppVersion } from '../services/updateService';
import { UpdateModal } from './UpdateModal';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import {
  HardDrive,
  Trash2,
  Palette,
  Wifi,
  WifiOff,
  RefreshCw,
  Check,
  Settings,
  Sparkles,
  DownloadCloud
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useApp();
  const { language, setLanguage } = useI18n();
  const [metrics, setMetrics] = useState<StorageMetrics>(StorageService.getMetrics());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // Estados de Verificacao de Atualizacao
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);
  const [foundRelease, setFoundRelease] = useState<ReleaseInfo | null>(null);

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

  const handleManualUpdateCheck = async () => {
    setIsCheckingUpdate(true);
    setUpdateFeedback(null);

    const res = await checkLatestRelease();
    setIsCheckingUpdate(false);

    if (res.hasUpdate && res.release) {
      setFoundRelease(res.release);
    } else {
      setUpdateFeedback(`Voce ja esta utilizando a versao mais recente (v${res.currentVersion}).`);
    }
  };

  const handleGenerateQuestionsWithAI = async () => {
    setIsSynthesizing(true);
    await questionEngine.runAutonomousHarvesting();
    refreshMetrics();
    setIsSynthesizing(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {foundRelease && (
        <UpdateModal release={foundRelease} onDismiss={() => setFoundRelease(null)} />
      )}

      {/* Cabecalho */}
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h2 className="text-base font-semibold text-[var(--text-main)] flex items-center gap-2">
          <Settings className="w-4 h-4 text-[var(--accent)]" />
          <span>Configuracoes e Preferencias</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Gerenciamento de memoria local, atualizacoes do sistema e aparencia visual.
        </p>
      </div>

      {/* Secao de Atualizacoes do Aplicativo */}
      <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <DownloadCloud className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              Versao e Atualizacoes
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            Versao Instalada: <strong className="text-[var(--text-main)]">v{getLocalAppVersion()}</strong>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="text-xs text-[var(--text-muted)]">
            <p>O aplicativo verifica novidades automaticamente ao iniciar.</p>
            {updateFeedback && (
              <span className="text-[var(--accent)] font-medium block mt-1">
                {updateFeedback}
              </span>
            )}
          </div>

          <button
            onClick={handleManualUpdateCheck}
            disabled={isCheckingUpdate}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-main)] text-xs text-[var(--text-main)] font-medium transition-colors disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin text-[var(--accent)]' : ''}`} />
            <span>{isCheckingUpdate ? 'Verificando...' : 'Verificar Atualizacoes Agora'}</span>
          </button>
        </div>
      </section>

      {/* Paleta e Temas */}
      <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Palette className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Aparencia Visual
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('anamnese')}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              theme === 'anamnese'
                ? 'bg-[var(--bg-elevated)] border-[var(--accent)] text-[var(--text-main)] shadow-sm'
                : 'bg-[var(--bg-main)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-focus)]'
            }`}
          >
            <div>
              <span className="text-xs font-semibold block text-[var(--text-main)]">Anamnese Neutro</span>
              <span className="text-[11px] text-[var(--text-dim)]">Grafite escuro e ciano suave</span>
            </div>
            {theme === 'anamnese' && <Check className="w-4 h-4 text-[var(--accent)]" />}
          </button>

          <button
            onClick={() => setTheme('matrix')}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              theme === 'matrix'
                ? 'bg-[var(--bg-elevated)] border-[var(--accent)] text-[var(--text-main)] shadow-sm'
                : 'bg-[var(--bg-main)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-focus)]'
            }`}
          >
            <div>
              <span className="text-xs font-semibold block text-[var(--text-main)]">Floresta Termica</span>
              <span className="text-[11px] text-[var(--text-dim)]">Tons verdes monocromaticos</span>
            </div>
            {theme === 'matrix' && <Check className="w-4 h-4 text-[var(--accent)]" />}
          </button>

          <button
            onClick={() => setTheme('cyber')}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              theme === 'cyber'
                ? 'bg-[var(--bg-elevated)] border-[var(--accent)] text-[var(--text-main)] shadow-sm'
                : 'bg-[var(--bg-main)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-focus)]'
            }`}
          >
            <div>
              <span className="text-xs font-semibold block text-[var(--text-main)]">Sintese Purpura</span>
              <span className="text-[11px] text-[var(--text-dim)]">Violeta suave de alto contraste</span>
            </div>
            {theme === 'cyber' && <Check className="w-4 h-4 text-[var(--accent)]" />}
          </button>
        </div>
      </section>

      {/* Armazenamento e Geracao Dinamica com IA */}
      <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              Banco de Dados e Memoria Local
            </h3>
          </div>
          <button
            onClick={refreshMetrics}
            className="flex items-center gap-1 text-xs text-[var(--text-dim)] hover:text-[var(--text-main)]"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Recalcular</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[var(--bg-main)] border border-[var(--border-subtle)] p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-[var(--text-dim)] uppercase font-medium block">
              Tamanho em Disco
            </span>
            <div className="text-lg font-bold text-[var(--text-main)]">{metrics.totalKb} KB</div>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-subtle)] p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-[var(--text-dim)] uppercase font-medium block">
              Questoes Armazenadas
            </span>
            <div className="text-lg font-bold text-[var(--accent)]">{metrics.questionsCount} itens</div>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-subtle)] p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-[var(--text-dim)] uppercase font-medium block">
              Artigos Salvos
            </span>
            <div className="text-lg font-bold text-[var(--text-main)]">{metrics.savedArticlesCount} artigos</div>
          </div>
        </div>

        {/* Botoes de Acao */}
        <div className="pt-2 flex flex-wrap gap-2.5">
          <button
            onClick={handleGenerateQuestionsWithAI}
            disabled={isSynthesizing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--accent)] text-[var(--bg-main)] font-medium text-xs hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
            <span>{isSynthesizing ? 'Sintetizando com IA...' : 'Buscar e Gerar Questoes com IA'}</span>
          </button>

          <button
            onClick={() => { StorageService.clearQuestionsCache(); refreshMetrics(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] hover:border-[var(--border-focus)] text-xs text-[var(--text-muted)] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Resetar Questoes</span>
          </button>

          <button
            onClick={() => { StorageService.clearSavedArticles(); refreshMetrics(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] hover:border-[var(--border-focus)] text-xs text-[var(--text-muted)] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Artigos</span>
          </button>
        </div>
      </section>

      {/* Diagnostico de Rede e Idioma */}
      <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] block">
              Conexao de Rede
            </span>
            <div className="flex items-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl text-xs">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-[var(--accent)] font-medium">Conectado (Online)</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-medium">Desconectado (Modo Offline)</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] block">
              Idioma
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['pt', 'en', 'es'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-medium uppercase transition-colors ${
                    language === lang
                      ? 'bg-[var(--text-main)] text-[var(--bg-main)] border-[var(--text-main)]'
                      : 'bg-[var(--bg-main)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-focus)]'
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