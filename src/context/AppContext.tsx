import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RankingUser } from '../types';

export type ThemeType = 'anamnese' | 'matrix' | 'cyber';

interface AppContextType {
  user: User | null;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  addXP: (amount: number) => void;
  ranking: RankingUser[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('anamnese_theme') as ThemeType;
    return saved && ['anamnese', 'matrix', 'cyber'].includes(saved) ? saved : 'anamnese';
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('anamnese_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_recruta',
      name: 'Operador Padrao',
      email: 'operador@anamnese.local',
      xp: 250,
      level: 1,
      streak: 4,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    };
  });

  const [ranking, setRanking] = useState<RankingUser[]>([
    { id: '1', name: 'Alan Turing', xp: 5400, level: 12, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=turing', position: 1 },
    { id: '2', name: 'Ada Lovelace', xp: 4890, level: 11, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ada', position: 2 },
    { id: '3', name: 'Linus Torvalds', xp: 4100, level: 10, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=linus', position: 3 },
    { id: '4', name: 'Operador Padrao (Voce)', xp: 250, level: 1, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=you', position: 4 }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('anamnese_theme', theme);
  }, [theme]);

  const setTheme = (t: ThemeType) => {
    setThemeState(t);
  };

  const login = (name: string, email: string) => {
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      xp: 0,
      level: 1,
      streak: 1,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`
    };
    setUser(newUser);
    localStorage.setItem('anamnese_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('anamnese_user');
  };

  const addXP = (amount: number) => {
    if (!user) return;
    const nextXP = user.xp + amount;
    const nextLevel = Math.floor(nextXP / 500) + 1;
    const updated = { ...user, xp: nextXP, level: nextLevel };
    setUser(updated);
    localStorage.setItem('anamnese_user', JSON.stringify(updated));

    setRanking(prev =>
      prev.map(r => r.name.includes('(Voce)') ? { ...r, xp: nextXP, level: nextLevel } : r)
        .sort((a, b) => b.xp - a.xp)
        .map((item, idx) => ({ ...item, position: idx + 1 }))
    );
  };

  return (
    <AppContext.Provider value={{ user, theme, setTheme, login, logout, addXP, ranking }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
};