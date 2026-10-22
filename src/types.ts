export type Category = 'algoritmos' | 'so' | 'redes' | 'ia' | 'banco_dados' | 'compiladores';

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
}