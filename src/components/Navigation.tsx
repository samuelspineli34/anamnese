import React from 'react';
import { BookOpen, Newspaper, Trophy, Infinity as InfinityIcon, User as UserIcon } from 'lucide-react';

export const Navigation: React.FC<{ activeTab: string; setActiveTab: (t: any) => void }> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'quiz', label: 'Módulos', icon: BookOpen },
    { id: 'infinite', label: 'Infinito', icon: InfinityIcon },
    { id: 'news', label: 'Notícias & IA', icon: Newspaper },
    { id: 'rank', label: 'Ranking', icon: Trophy },
    { id: 'profile', label: 'Perfil', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-emerald-500/20 px-2 py-2 flex justify-around items-center max-w-lg mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all px-3 py-1 rounded-xl ${
              isActive ? 'text-emerald-400 scale-105' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};