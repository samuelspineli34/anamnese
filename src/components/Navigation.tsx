import React from 'react';
import { useI18n } from '../context/I18nContext';
import { Binary, Gauge, Newspaper, Trophy, UserCheck, Settings, BarChart2 } from 'lucide-react';

export const Navigation: React.FC<{ activeTab: string; setActiveTab: (t: any) => void }> = ({ activeTab, setActiveTab }) => {
  const { t } = useI18n();

  const navItems = [
    { id: 'quiz', label: t.modules, icon: Binary },
    { id: 'infinite', label: t.infinite, icon: Gauge },
    { id: 'stats', label: 'Estatísticas', icon: BarChart2 },
    { id: 'news', label: t.news, icon: Newspaper },
    { id: 'rank', label: t.ranking, icon: Trophy },
    { id: 'profile', label: t.profile, icon: UserCheck },
    { id: 'settings', label: 'Config', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-sidebar)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] px-2 py-2 flex justify-around items-center max-w-lg mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all px-1.5 py-1 rounded-lg ${
              isActive ? 'text-[var(--text-main)] font-medium' : 'text-[var(--text-dim)] hover:text-[var(--text-muted)]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent)]' : ''}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};