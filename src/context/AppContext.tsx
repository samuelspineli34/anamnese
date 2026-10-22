import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RankingUser } from '../types';

interface AppContextType {
  user: User | null;
  theme: 'cyber' | 'dark' | 'light';
  setTheme: (theme: 'cyber' | 'dark' | 'light') => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  addXP: (amount: number) => void;
  ranking: RankingUser[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'cyber' | 'dark' | 'light'>('cyber');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('devquiz_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_guest',
      name: 'Dev Recruta',
      email: 'recruta@dev.com',
      xp: 150,
      level: 1,
      streak: 3,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    };
  });

  const [ranking, setRanking] = useState<RankingUser[]>([
    { id: '1', name: 'Alan Turing', xp: 5400, level: 12, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=turing', position: 1 },
    { id: '2', name: 'Ada Lovelace', xp: 4890, level: 11, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ada', position: 2 },
    { id: '3', name: 'Linus Torvalds', xp: 4100, level: 10, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=linus', position: 3 },
    { id: '4', name: 'Dev Recruta (Você)', xp: 150, level: 1, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=you', position: 4 }
  ]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('devquiz_user', JSON.stringify(user));
    }
  }, [user]);

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
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('devquiz_user');
  };

  const addXP = (amount: number) => {
    if (!user) return;
    const nextXP = user.xp + amount;
    const nextLevel = Math.floor(nextXP / 500) + 1;
    setUser({ ...user, xp: nextXP, level: nextLevel });

    setRanking(prev =>
      prev.map(r => r.name.includes('(Você)') ? { ...r, xp: nextXP, level: nextLevel } : r)
        .sort((a, b) => b.xp - a.xp)
        .map((item, idx) => ({ ...item, position: idx + 1 }))
    );
  };

  return (
    <AppContext.Provider value={{ user, theme, setTheme, login, logout, addXP, ranking }}>
      <div className={theme === 'cyber' ? 'cyber-mode bg-[#090b10] text-emerald-400 min-h-screen' : theme === 'dark' ? 'dark bg-slate-950 text-slate-100 min-h-screen' : 'bg-slate-50 text-slate-900 min-h-screen'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
};