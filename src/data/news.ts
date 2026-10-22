import { NewsItem } from '../types';

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
];