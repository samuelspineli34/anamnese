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

  const handleClearQuestions = () => {
    StorageService.clearQuestionsCache();
    refreshMetrics();
  };

  const handleClearArticles = () => {
    StorageService.clearSavedArticles();
    refreshMetrics();
  };

  const handlePurgeAll = () => {
    StorageService.purgeAllCache();
    refreshMetrics();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-mono">
      <div className="border-b border-zinc-800 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500" />
          <span>Configuracoes e Gestao do Sistema</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Auditoria de armazenamento local, aparencia de interface e conectividade.
        </p>
      </div>

      {/* Secao 1: Auditoria de Armazenamento e Cache */}
      <section className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold uppercase text-zinc-200">
              Metricas de Armazenamento e Cache
            </h3>
          </div>
          <button
            onClick={refreshMetrics}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Atualizar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-lg space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold block">
              Memoria Ocupada
            </span>
            <div className="text-xl font-bold text-zinc-100">{metrics.totalKb} KB</div>
            <span className="text-[10px] text-zinc-500 block">Capacidade utilizada</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-lg space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold block">
              Questoes em Cache
            </span>
            <div className="text-xl font-bold text-emerald-400">{metrics.questionsCount} itens</div>
            <span className="text-[10px] text-zinc-500 block">{metrics.questionsKb} KB em disco</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-lg space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold block">
              Artigos Offline
            </span>
            <div className="text-xl font-bold text-cyan-400">{metrics.savedArticlesCount} salvos</div>
            <span className="text-[10px] text-zinc-500 block">{metrics.savedArticlesKb} KB em disco</span>
          </div>
        </div>

        {/* Botoes de Expurgo Seletivo */}
        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <button
            onClick={handleClearQuestions}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Limpar Cache de Questoes</span>
          </button>

          <button
            onClick={handleClearArticles}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Limpar Artigos Offline</span>
          </button>

          <button
            onClick={handlePurgeAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Expurgar Todos os Dados Locais</span>
          </button>
        </div>
      </section>

      {/* Secao 2: Aparencia e Temas */}
      <section className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
          <Palette className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-bold uppercase text-zinc-200">
            Aparencia e Paleta Visual
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-600 text-zinc-100' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div>
              <span className="text-xs font-bold block">Zinc Neutro</span>
              <span className="text-[10px] text-zinc-500">Padrao industrial escuro</span>
            </div>
            {theme === 'dark' && <Check className="w-4 h-4 text-emerald-500" />}
          </button>

          <button
            onClick={() => setTheme('cyber')}
            className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
              theme === 'cyber' ? 'bg-[#0f111a] border-cyan-500/60 text-cyan-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div>
              <span className="text-xs font-bold block">Terminal Matrix</span>
              <span className="text-[10px] text-zinc-500">Contraste verde fosforescente</span>
            </div>
            {theme === 'cyber' && <Check className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
              theme === 'light' ? 'bg-zinc-800 border-zinc-500 text-zinc-100' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div>
              <span className="text-xs font-bold block">Alto Contraste</span>
              <span className="text-[10px] text-zinc-500">Superficies cinza calibradas</span>
            </div>
            {theme === 'light' && <Check className="w-4 h-4 text-emerald-500" />}
          </button>
        </div>
      </section>

      {/* Secao 3: Diagnostico de Rede e Idioma */}
      <section className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-zinc-300 block">
              Status da Conexao
            </span>
            <div className="flex items-center gap-2 p-3 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-400 font-bold">Online (Rede Ativa)</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-400 font-bold">Offline (Operacao Local)</span>
                </>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Em modo offline, o sistema preserva a execucao dos testes e exibe artigos previamente salvos.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-zinc-300 block">
              Idioma do Sistema
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['pt', 'en', 'es'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`p-2.5 rounded-lg border text-center text-xs font-bold uppercase transition-colors ${
                    language === lang
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Ajusta a nomenclatura tecnica dos modulos, titulos e explicacoes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};