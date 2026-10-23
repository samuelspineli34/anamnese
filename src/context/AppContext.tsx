import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RankingUser } from '../types';

export type ThemeType = 'anamnese' | 'matrix' | 'cyber';

interface AppContextType {
  user: User | null;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  login: (name: string, email: string) => void;
  updateUser: (fields: Partial<User>) => void;
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
    return saved
      ? JSON.parse(saved)
      : {
          id: 'usr_local_default',
          name: 'Samuel Spineli',
          email: 'samuel@nullgarden.dev',
          bio: 'Estudante e Engenheiro de Software focado em sistemas distribuidos e IA.',
          focusArea: 'Sistemas Nativos & Machine Learning',
          githubUser: 'samuelspineli34',
          xp: 350,
          level: 1,
          streak: 4,
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=samuel',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
  });

  const [ranking, setRanking] = useState<RankingUser[]>([
    { id: '1', name: 'Alan Turing', xp: 5400, level: 12, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=turing', position: 1 },
    { id: '2', name: 'Ada Lovelace', xp: 4890, level: 11, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ada', position: 2 },
    { id: '3', name: 'Linus Torvalds', xp: 4100, level: 10, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=linus', position: 3 },
    { id: '4', name: 'Samuel Spineli (Voce)', xp: 350, level: 1, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=samuel', position: 4 }
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
      bio: '',
      focusArea: 'Ciencia da Computacao Geral',
      githubUser: '',
      xp: 0,
      level: 1,
      streak: 1,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('anamnese_user', JSON.stringify(newUser));
  };

  const updateUser = (fields: Partial<User>) => {
    if (!user) return;
    const updated: User = {
      ...user,
      ...fields,
      updatedAt: new Date().toISOString(),
    };
    setUser(updated);
    localStorage.setItem('anamnese_user', JSON.stringify(updated));

    setRanking((prev) =>
      prev.map((r) => (r.id === '4' ? { ...r, name: `${updated.name} (Voce)` } : r))
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('anamnese_user');
  };

  const addXP = (amount: number) => {
    if (!user) return;
    const nextXP = user.xp + amount;
    const nextLevel = Math.floor(nextXP / 500) + 1;
    const updated = { ...user, xp: nextXP, level: nextLevel, updatedAt: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem('anamnese_user', JSON.stringify(updated));

    setRanking((prev) =>
      prev
        .map((r) => (r.id === '4' ? { ...r, xp: nextXP, level: nextLevel } : r))
        .sort((a, b) => b.xp - a.xp)
        .map((item, idx) => ({ ...item, position: idx + 1 }))
    );
  };

  return (
    <AppContext.Provider value={{ user, theme, setTheme, login, updateUser, logout, addXP, ranking }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
};