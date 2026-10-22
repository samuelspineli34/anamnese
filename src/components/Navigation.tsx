import React from 'react';
import { useI18n } from '../context/I18nContext';
import { Binary, Gauge, Newspaper, Trophy, UserCheck, Settings } from 'lucide-react';

export const Navigation: React.FC<{ activeTab: string; setActiveTab: (t: any) => void }> = ({ activeTab, setActiveTab }) => {
  const { t } = useI18n();

  const navItems = [
    { id: 'quiz', label: t.modules, icon: Binary },
    { id: 'infinite', label: t.infinite, icon: Gauge },
    { id: 'news', label: t.news, icon: Newspaper },
    { id: 'rank', label: t.ranking, icon: Trophy },
    { id: 'profile', label: t.profile, icon: UserCheck },
    { id: 'settings', label: 'Config', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 px-2 py-2 flex justify-around items-center max-w-lg mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all px-2 py-1 rounded-lg ${
              isActive ? 'text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-zinc-500'}`} />
            <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};