import React from 'react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { Activity, Globe, Shield, Terminal } from 'lucide-react';
import { Language } from '../i18n/translations';

export const Header: React.FC<{ activeTab: string; setActiveTab: (t: any) => void }> = ({ setActiveTab }) => {
  const { user } = useApp();
  const { language, setLanguage, t } = useI18n();

  const handleLangCycle = () => {
    const sequence: Language[] = ['pt', 'en', 'es'];
    const nextIdx = (sequence.indexOf(language) + 1) % sequence.length;
    setLanguage(sequence[nextIdx]);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('quiz')}>
        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
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