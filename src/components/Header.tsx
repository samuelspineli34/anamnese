import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Trophy, Palette, Terminal } from 'lucide-react';

export const Header: React.FC<{ activeTab: string; setActiveTab: (t: any) => void }> = ({ activeTab, setActiveTab }) => {
  const { user, theme, setTheme } = useApp();

  const cycleTheme = () => {
    if (theme === 'cyber') setTheme('dark');
    else if (theme === 'dark') setTheme('light');
    else setTheme('cyber');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-emerald-500/20 bg-black/40 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('quiz')}>
        <Terminal className="w-6 h-6 text-emerald-400" />
        <span className="font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
          DEVQUIZ<span className="text-pink-500">.CC</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 rounded-full px-3 py-1 text-xs">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-bold text-orange-400">{user.streak}d</span>
            <span className="text-slate-500">|</span>
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-semibold text-yellow-400">{user.xp} XP</span>
          </div>
        )}

        <button 
          onClick={cycleTheme}
          title="Alternar Tema (Cyber / Dark / Light)" 
          className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300">
          <Palette className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};