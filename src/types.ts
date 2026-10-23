export type Category =
  | 'algoritmos'
  | 'so'
  | 'redes'
  | 'banco_dados'
  | 'compiladores'
  | 'ia'
  | 'arquitetura'
  | 'engenharia_software'
  | 'seguranca'
  | 'linguagens'
  | 'computacao_grafica'
  | 'trivia';

export interface Question {
  id: string;
  category: Category;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  url: string;
  readTime: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  focusArea?: string;
  githubUser?: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryMetric {
  category: Category;
  attempts: number;
  correct: number;
  accuracy: number;
  masteryScore: number;
  confidenceFactor: number;
  statusLabel: string;
}

export interface GlobalStats {
  totalAttempts: number;
  totalCorrect: number;
  overallAccuracy: number;
  overallMastery: number;
  streakDays: number;
  level: number;
  xp: number;
  strongestCategory: string;
  weakestCategory: string;
}

export interface RankingUser {
  id: string;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  position: number;
}