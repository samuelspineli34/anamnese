// gerar-projeto.js
const fs = require('fs');
const path = require('path');

const files = {
  "package.json": JSON.stringify({
    "name": "devquiz-cc",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "cap:sync": "npm run build && npx cap sync",
      "cap:android": "npm run build && npx cap run android"
    },
    "dependencies": {
      "@capacitor/android": "^6.0.0",
      "@capacitor/core": "^6.0.0",
      "canvas-confetti": "^1.9.2",
      "clsx": "^2.1.0",
      "lucide-react": "^0.359.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "tailwind-merge": "^2.2.1"
    },
    "devDependencies": {
      "@capacitor/cli": "^6.0.0",
      "@types/canvas-confetti": "^1.6.4",
      "@types/react": "^18.2.66",
      "@types/react-dom": "^18.2.22",
      "@vitejs/plugin-react": "^4.2.1",
      "autoprefixer": "^10.4.19",
      "postcss": "^8.4.38",
      "tailwindcss": "^3.4.1",
      "typescript": "^5.2.2",
      "vite": "^5.1.6"
    }
  }, null, 2),

  "capacitor.config.json": JSON.stringify({
    "appId": "com.devquiz.cc",
    "appName": "DevQuiz CC",
    "webDir": "dist",
    "server": {
      "androidScheme": "https"
    }
  }, null, 2),

  "vite.config.ts": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,

  "tailwind.config.js": `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0b10',
          card: '#121526',
          primary: '#00ffcc',
          secondary: '#ff007f',
          text: '#e0e6ed'
        }
      }
    },
  },
  plugins: [],
};`,

  "postcss.config.js": `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

  "tsconfig.json": JSON.stringify({
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true
    },
    "include": ["src"]
  }, null, 2),

  "index.html": `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>DevQuiz - Ciência da Computação & IA</title>
  </head>
  <body class="bg-slate-900 text-slate-100 antialiased select-none">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  "README.md": `# 🧠 DevQuiz CC & IA

App completo para estudantes e entusiastas de Ciência da Computação e Inteligência Artificial. Funciona na **Web** e no **Android** via Capacitor.

### ✨ Funcionalidades
- 📚 **Módulos de Quiz**: Algoritmos, SO, Redes, Compiladores, IA & Machine Learning, Banco de Dados.
- ♾️ **Modo Infinito**: Teste seus limites sem parar.
- 📰 **Feed de Notícias & Artigos**: Fique por dentro dos avanços de IA e tecnologia.
- 🏆 **Ranking & XP**: Ganhe pontos, suba de patente e dispute a liderança.
- 🎨 **Temas**: Cyberpunk, Dark Mode e Light Mode.
- 📱 **Mobile Ready**: Totalmente responsivo e pronto para compilar como APK Android via Capacitor.

### 🚀 Rodando no PC (Web)
\`\`\`bash
npm install
npm run dev
\`\`\`

### 📱 Gerando APK Android
\`\`\`bash
npm run build
npx cap add android
npx cap open android
\`\`\`
*(Abra no Android Studio e clique em "Build APK")*
`,

  "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow-x: hidden;
}`,

  "src/types.ts": `export type Category = 'algoritmos' | 'so' | 'redes' | 'ia' | 'banco_dados' | 'compiladores';

export interface Question {
  id: string;
  category: Category;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  avatar: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'IA' | 'Computação' | 'Open Source' | 'Hardware';
  date: string;
  url: string;
  readTime: string;
}

export interface RankingUser {
  id: string;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  position: number;
}`,

  "src/data/questions.ts": `import { Question } from '../types';

export const mockQuestions: Question[] = [
  {
    id: '1',
    category: 'algoritmos',
    question: 'Qual a complexidade de tempo de pior caso do Quicksort tradicional?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctIndex: 2,
    explanation: 'No pior caso (ex: array já ordenado com pivô mal escolhido), o Quicksort degrada para O(n²).'
  },
  {
    id: '2',
    category: 'ia',
    question: 'O que o mecanismo de "Self-Attention" do modelo Transformer permite?',
    options: [
      'Executar apenas em processadores quânticos',
      'Ponderar a relevância de diferentes tokens em uma sequência independente da distância',
      'Eliminar completamente o uso de GPUs no treino',
      'Converter redes convolucionais em binárias'
    ],
    correctIndex: 1,
    explanation: 'O Self-Attention calcula a afinidade de cada palavra/token com todos os outros no contexto.'
  },
  {
    id: '3',
    category: 'redes',
    question: 'Em qual camada do modelo OSI atua o protocolo TCP?',
    options: ['Rede', 'Enlace', 'Transporte', 'Aplicação'],
    correctIndex: 2,
    explanation: 'O TCP opera na Camada 4 (Transporte), garantindo entrega confiável de pacotes.'
  },
  {
    id: '4',
    category: 'so',
    question: 'Qual destas NÃO é uma das quatro condições necessárias para ocorrer Deadlock (Coffman)?',
    options: ['Exclusão Mútua', 'Posse e Espera', 'Preempção Forçada', 'Espera Circular'],
    correctIndex: 2,
    explanation: 'A condição é a *Não-Preempção*. Preempção forçada evita o deadlock.'
  },
  {
    id: '5',
    category: 'banco_dados',
    question: 'Em bancos ACID, o que garante que uma transação concluída persistirá mesmo após pane elétrica?',
    options: ['Atomicidade', 'Consistência', 'Isolamento', 'Durabilidade'],
    correctIndex: 3,
    explanation: 'Durabilidade assegura que registros confirmados (commits) fiquem em armazenamento não volátil.'
  },
  {
    id: '6',
    category: 'ia',
    question: 'O que caracteriza o problema do "Vanishing Gradient" em Redes Neurais Profundas?',
    options: [
      'Os gradientes se tornam infinitesimalmente pequenos nas camadas iniciais durante o backpropagation',
      'A memória de vídeo estoura com tensores gigantes',
      'A acurácia do modelo sobe rápido demais gerando overfitting imediato',
      'A matriz de confusão fica inteiramente zerada'
    ],
    correctIndex: 0,
    explanation: 'Com funções como Sigmoid, derivadas menores que 1 repetidas fazem o gradiente sumir nas camadas de entrada.'
  },
  {
    id: '7',
    category: 'compiladores',
    question: 'Qual etapa do compilador é responsável por gerar a Árvore Sintática Abstrata (AST)?',
    options: ['Análise Léxica', 'Análise Sintática', 'Análise Semântica', 'Otimização de Código'],
    correctIndex: 1,
    explanation: 'O analisador sintático (Parser) agrupa tokens de acordo com a gramática da linguagem e gera a AST.'
  }
];`,

  "src/data/news.ts": `import { NewsItem } from '../types';

export const mockNews: NewsItem[] = [
  {
    id: 'n1',
    title: 'Modelos de Raciocínio (Reasoning Models) e o Futuro dos Agentes Autônomos',
    summary: 'Como técnicas de Chain-of-Thought e busca em árvore (MCTS) estão transformando LLMs em resolvedores analíticos complexos.',
    category: 'IA',
    date: 'Hoje',
    url: '#',
    readTime: '4 min'
  },
  {
    id: 'n2',
    title: 'Rust no Kernel Linux: O que mudou na estabilidade e segurança de memória',
    summary: 'Adoção de Rust segue acelerada para drivers de dispositivos, reduzindo falhas de buffer overflow e concorrência.',
    category: 'Computação',
    date: 'Ontem',
    url: '#',
    readTime: '6 min'
  },
  {
    id: 'n3',
    title: 'Supremacia Quântica e Computação Híbrida: Onde estamos?',
    summary: 'Pesquisadores integram supercomputadores clássicos com QPUs quânticos para resolver equações moleculares.',
    category: 'Hardware',
    date: '2 dias atrás',
    url: '#',
    readTime: '5 min'
  }
];`,

  "src/context/AppContext.tsx": `import React, { createContext, useContext, useState, useEffect } from 'react';
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
      avatar: \`https://api.dicebear.com/7.x/bottts/svg?seed=\${name}\`
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
};`,

  "src/components/Header.tsx": `import React from 'react';
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
};`,

  "src/components/Navigation.tsx": `import React from 'react';
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
            className={\`flex flex-col items-center gap-1 transition-all px-3 py-1 rounded-xl \${
              isActive ? 'text-emerald-400 scale-105' : 'text-slate-500 hover:text-slate-300'
            }\`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};`,

  "src/components/InfiniteQuiz.tsx": `import React, { useState } from 'react';
import { mockQuestions } from '../data/questions';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { Heart, Zap, RotateCcw } from 'lucide-react';

export const InfiniteQuiz: React.FC = () => {
  const { addXP } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Embaralha ao atingir o final da lista para ser verdadeiramente infinito
  const q = mockQuestions[currentIdx % mockQuestions.length];

  const handleSelect = (idx: number) => {
    if (isAnswered || gameOver) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    if (idx === q.correctIndex) {
      const earned = 50 * multiplier;
      addXP(earned);
      setScore(s => s + earned);
      setMultiplier(m => Math.min(m + 1, 5));
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } else {
      setMultiplier(1);
      setLives(l => {
        const next = l - 1;
        if (next <= 0) setGameOver(true);
        return next;
      });
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOpt(null);
    setCurrentIdx(c => c + 1);
  };

  const restart = () => {
    setLives(3);
    setScore(0);
    setMultiplier(1);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-3xl font-black text-rose-500">GAME OVER</h2>
        <p className="text-slate-400">Você ficou sem vidas no Modo Infinito!</p>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
          <span className="text-xs uppercase text-slate-500 font-bold">Pontuação Final</span>
          <div className="text-4xl font-extrabold text-emerald-400 mt-1">{score} pts</div>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:brightness-110"
        >
          <RotateCcw className="w-5 h-5" /> Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} className={\`w-5 h-5 \${i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'}\`} />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-yellow-400 flex items-center gap-1"><Zap className="w-3.5 h-3.5 fill-yellow-400" /> {multiplier}x</span>
          <span className="text-emerald-400">{score} pts</span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-emerald-500/20 p-5 rounded-2xl">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
          {q.category.toUpperCase()}
        </span>
        <h3 className="text-lg font-bold text-slate-100 mt-3 mb-4">{q.question}</h3>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let style = "bg-slate-800/80 border-slate-700 text-slate-300";
            if (isAnswered) {
              if (i === q.correctIndex) style = "bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold";
              else if (i === selectedOpt) style = "bg-rose-600/30 border-rose-500 text-rose-300";
            }
            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleSelect(i)}
                className={\`w-full text-left p-3.5 rounded-xl border text-sm transition-all \${style}\`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-3">
            <p className="text-xs text-slate-400 italic">💡 {q.explanation}</p>
            <button
              onClick={handleNext}
              className="w-full bg-emerald-500 text-black font-extrabold py-2.5 rounded-xl hover:bg-emerald-400"
            >
              Próxima Questão ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};`,

  "src/components/NewsView.tsx": `import React from 'react';
import { mockNews } from '../data/news';
import { ExternalLink, Sparkles, Clock } from 'lucide-react';

export const NewsView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" /> Computação & IA
        </h2>
        <span className="text-xs text-slate-500">Atualizado hoje</span>
      </div>

      <div className="space-y-3">
        {mockNews.map((news) => (
          <article
            key={news.id}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="bg-cyan-950/60 text-cyan-400 font-bold px-2 py-0.5 rounded border border-cyan-500/30">
                {news.category}
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {news.readTime}
              </span>
            </div>

            <h3 className="font-bold text-slate-100 text-base leading-snug">{news.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{news.summary}</p>

            <a
              href={news.url}
              onClick={(e) => { e.preventDefault(); alert('Em produção, abre a notícia no navegador ou WebView!'); }}
              className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              Ler artigo completo <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};`,

  "src/components/RankingView.tsx": `import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Medal } from 'lucide-react';

export const RankingView: React.FC = () => {
  const { ranking } = useApp();

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-black text-slate-100">Leaderboard Geral</h2>
      </div>

      <div className="space-y-2">
        {ranking.map((r, i) => {
          let posBadge = null;
          if (i === 0) posBadge = <Medal className="w-5 h-5 text-yellow-400" />;
          else if (i === 1) posBadge = <Medal className="w-5 h-5 text-slate-300" />;
          else if (i === 2) posBadge = <Medal className="w-5 h-5 text-amber-600" />;
          else posBadge = <span className="font-bold text-slate-500 text-sm">#{r.position}</span>;

          const isSelf = r.name.includes('(Você)');

          return (
            <div
              key={r.id}
              className={\`flex items-center justify-between p-3 rounded-2xl border transition-all \${
                isSelf
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-slate-800'
              }\`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 flex justify-center">{posBadge}</div>
                <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700" />
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    {r.name}
                  </div>
                  <div className="text-[11px] text-slate-400">Nível {r.level}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-400">{r.xp}</span>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};`,

  "src/components/ProfileView.tsx": `import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, LogOut, CheckCircle, Flame } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, login, logout } = useApp();
  const [nameInput, setNameInput] = useState('');

  if (!user) {
    return (
      <div className="max-w-sm mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Criar Perfil / Entrar</h2>
        <input
          type="text"
          placeholder="Seu Nickname de Dev"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => nameInput && login(nameInput, 'user@dev.cc')}
          className="w-full bg-emerald-500 text-black font-extrabold py-3 rounded-xl hover:bg-emerald-400"
        >
          Entrar e Salvar Progresso
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
        <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-emerald-500/40" />
        <div>
          <h2 className="text-lg font-bold text-slate-100">{user.name}</h2>
          <span className="text-xs text-emerald-400 font-semibold">Dev Nível {user.level}</span>
          <div className="flex items-center gap-1 mt-1 text-xs text-orange-400 font-bold">
            <Flame className="w-4 h-4 fill-orange-400" /> {user.streak} dias de sequência
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-500 uppercase font-bold">Total XP</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{user.xp}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-500 uppercase font-bold">Resoluções</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">{(user.xp / 50).toFixed(0)}</div>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 p-3 text-rose-400 border border-rose-500/30 rounded-xl bg-rose-950/20 hover:bg-rose-900/30 text-sm font-bold"
      >
        <LogOut className="w-4 h-4" /> Sair da Conta
      </button>
    </div>
  );
};`,

  "src/App.tsx": `import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { InfiniteQuiz } from './components/InfiniteQuiz';
import { NewsView } from './components/NewsView';
import { RankingView } from './components/RankingView';
import { ProfileView } from './components/ProfileView';
import { mockQuestions } from './data/questions';
import { useApp } from './context/AppContext';
import { Cpu, Terminal, Database, GitBranch, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'infinite' | 'news' | 'rank' | 'profile'>('quiz');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const categories = [
    { id: 'algoritmos', label: 'Algoritmos & ED', icon: Layers, count: 18 },
    { id: 'ia', label: 'IA & Deep Learning', icon: Sparkles, count: 14 },
    { id: 'so', label: 'Sistemas Operacionais', icon: Terminal, count: 12 },
    { id: 'redes', label: 'Redes & Protocolos', icon: GitBranch, count: 10 },
    { id: 'banco_dados', label: 'Bancos de Dados', icon: Database, count: 15 },
    { id: 'compiladores', label: 'Compiladores', icon: Cpu, count: 8 },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-4 max-w-lg w-full mx-auto">
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-slate-100">Trilhas de Computação</h2>
              <p className="text-xs text-slate-400">Escolha uma especialidade para treinar</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveTab('infinite')}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/40 text-left transition-all flex flex-col justify-between group"
                  >
                    <Icon className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div className="mt-4">
                      <h3 className="font-bold text-sm text-slate-200">{c.label}</h3>
                      <span className="text-[10px] text-slate-500 font-semibold">{c.count} questões</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'infinite' && <InfiniteQuiz />}
        {activeTab === 'news' && <NewsView />}
        {activeTab === 'rank' && <RankingView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}`,

  "src/main.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);`
};

// Escreve cada arquivo recursivamente
Object.entries(files).forEach(([relPath, content]) => {
  const fullPath = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('✔ Criado:', relPath);
});

console.log('\\n✅ Projeto DevQuiz CC gerado com sucesso!');