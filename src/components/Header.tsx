import React from 'react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { Activity, Globe, Shield, Terminal, ArrowDownCircle } from 'lucide-react';
import { Language } from '../i18n/translations';
import { ReleaseInfo } from '../services/updateService';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (t: any) => void;
  pendingUpdate?: ReleaseInfo | null;
  onOpenUpdate?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setActiveTab, pendingUpdate, onOpenUpdate }) => {
  const { user } = useApp();
  const { language, setLanguage, t } = useI18n();

  const handleLangCycle = () => {
    const sequence: Language[] = ['pt', 'en', 'es'];
    const nextIdx = (sequence.indexOf(language) + 1) % sequence.length;
    setLanguage(sequence[nextIdx]);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('quiz')}>
        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 md:hidden">
          <Terminal className="w-4 h-4 text-zinc-100" />
        </div>
        <div>
          <span className="font-mono text-sm tracking-widest font-black text-zinc-100">
            {t.appName}
          </span>
          <span className="text-[10px] block font-mono text-zinc-500 uppercase tracking-tighter">
            Core Engine v1.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {pendingUpdate && (
          <button
            onClick={onOpenUpdate}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-600/60 text-emerald-400 font-mono text-xs hover:bg-emerald-900/50 transition-colors animate-pulse"
            title="Atualização disponível"
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Atualizacao: {pendingUpdate.version}</span>
            <span className="sm:hidden">{pendingUpdate.version}</span>
          </button>
        )}

        {user && (
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-mono">
            <span className="flex items-center gap-1 text-zinc-400">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>{user.streak}d</span>
            </span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1 text-zinc-200">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <span>{user.xp} XP</span>
            </span>
          </div>
        )}

        <button
          onClick={handleLangCycle}
          title="Alterar Idioma"
          className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-colors uppercase"
        >
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
          <span>{language}</span>
        </button>
      </div>
    </header>
  );
};