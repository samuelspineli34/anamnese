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

export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  avatar: string;
}

export interface RankingUser {
  id: string;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  position: number;
}