import { Question } from '../types';

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
];