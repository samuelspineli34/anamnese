export type Language = 'pt' | 'en' | 'es';

export interface Translations {
  appName: string;
  tagline: string;
  modules: string;
  infinite: string;
  news: string;
  ranking: string;
  profile: string;
  streak: string;
  score: string;
  level: string;
  categories: Record<string, string>;
  quiz: {
    gameOverTitle: string;
    gameOverDesc: string;
    finalScore: string;
    restartBtn: string;
    nextBtn: string;
    explanationLabel: string;
    livesLabel: string;
  };
  newsView: {
    header: string;
    updatedLabel: string;
    readMore: string;
  };
  rankingView: {
    header: string;
    position: string;
    xpUnit: string;
  };
  profileView: {
    guestTitle: string;
    inputPlaceholder: string;
    loginBtn: string;
    logoutBtn: string;
    statsResolutions: string;
    statsTotalXp: string;
  };
}

export const translations: Record<Language, Translations> = {
  pt: {
    appName: 'Anamnese',
    tagline: 'O resgate e o aprofundamento dos fundamentos da computacao.',
    modules: 'Trilhas de Estudo',
    infinite: 'Pratica Continua',
    news: 'Leitura',
    ranking: 'Comunidade',
    profile: 'Meu Perfil',
    streak: 'Dias Seguidos',
    score: 'Pontos',
    level: 'Nivel',
    categories: {
      algoritmos: 'Algoritmos e Estruturas de Dados',
      so: 'Sistemas Operacionais',
      redes: 'Redes de Computadores',
      banco_dados: 'Bancos de Dados',
      compiladores: 'Compiladores e Teoria da Computacao',
      ia: 'Inteligencia Artificial e Aprendizado de Maquina',
      arquitetura: 'Arquitetura de Computadores',
      engenharia_software: 'Engenharia de Software e Padroes',
      seguranca: 'Seguranca e Criptografia',
      linguagens: 'Linguagens de Programacao',
      computacao_grafica: 'Computacao Grafica',
      trivia: 'Historia da Computacao e Curiosidades'
    },
    quiz: {
      gameOverTitle: 'Fim da Rodada de Pratica',
      gameOverDesc: 'Voce utilizou todas as tentativas desta rodada. Revise os conceitos com calma e tente novamente.',
      finalScore: 'Pontuacao Alcancada',
      restartBtn: 'Praticar Novamente',
      nextBtn: 'Proxima Questao',
      explanationLabel: 'Entenda o Conceito',
      livesLabel: 'Tentativas'
    },
    newsView: {
      header: 'Biblioteca de Leitura e Artigos',
      updatedLabel: 'Atualizado',
      readMore: 'Ler Artigo'
    },
    rankingView: {
      header: 'Painel da Comunidade',
      position: 'Posicao',
      xpUnit: 'XP'
    },
    profileView: {
      guestTitle: 'Identificacao de Estudos',
      inputPlaceholder: 'Seu nome ou apelido de estudo',
      loginBtn: 'Salvar e Continuar',
      logoutBtn: 'Sair da Conta',
      statsResolutions: 'Questoes Resolvidas',
      statsTotalXp: 'Experiencia Total'
    }
  },
  en: {
    appName: 'Anamnese',
    tagline: 'Recalling and understanding the core fundamentals of computing.',
    modules: 'Study Tracks',
    infinite: 'Continuous Practice',
    news: 'Reading',
    ranking: 'Community',
    profile: 'My Profile',
    streak: 'Streak Days',
    score: 'Score',
    level: 'Level',
    categories: {
      algoritmos: 'Algorithms & Data Structures',
      so: 'Operating Systems',
      redes: 'Computer Networks',
      banco_dados: 'Database Systems',
      compiladores: 'Compilers & Theory of Computation',
      ia: 'Artificial Intelligence & Machine Learning',
      arquitetura: 'Computer Architecture',
      engenharia_software: 'Software Engineering & Patterns',
      seguranca: 'Security & Cryptography',
      linguagens: 'Programming Languages',
      computacao_grafica: 'Computer Graphics',
      trivia: 'History of Computing & Trivia'
    },
    quiz: {
      gameOverTitle: 'Practice Round Finished',
      gameOverDesc: 'You have used all attempts for this round. Review the concepts calmly and try again.',
      finalScore: 'Achieved Score',
      restartBtn: 'Practice Again',
      nextBtn: 'Next Question',
      explanationLabel: 'Understand the Concept',
      livesLabel: 'Attempts'
    },
    newsView: {
      header: 'Reading Library & Articles',
      updatedLabel: 'Updated',
      readMore: 'Read Article'
    },
    rankingView: {
      header: 'Community Board',
      position: 'Rank',
      xpUnit: 'XP'
    },
    profileView: {
      guestTitle: 'Study Identification',
      inputPlaceholder: 'Your name or nickname',
      loginBtn: 'Save and Continue',
      logoutBtn: 'Sign Out',
      statsResolutions: 'Questions Completed',
      statsTotalXp: 'Total Experience'
    }
  },
  es: {
    appName: 'Anamnese',
    tagline: 'Recordando y comprendiendo los fundamentos esenciales de la computacion.',
    modules: 'Rutas de Estudio',
    infinite: 'Practica Continua',
    news: 'Lectura',
    ranking: 'Comunidad',
    profile: 'Mi Perfil',
    streak: 'Dias Seguidos',
    score: 'Puntos',
    level: 'Nivel',
    categories: {
      algoritmos: 'Algoritmos y Estructuras de Datos',
      so: 'Sistemas Operativos',
      redes: 'Redes de Computadoras',
      banco_dados: 'Sistemas de Bases de Datos',
      compiladores: 'Compiladores y Teoria de la Computacion',
      ia: 'Inteligencia Artificial y Aprendizaje Automatico',
      arquitetura: 'Arquitectura de Computadoras',
      engenharia_software: 'Ingenieria de Software y Patrones',
      seguranca: 'Seguridad y Criptografia',
      linguagens: 'Lenguajes de Programacion',
      computacao_grafica: 'Computacion Grafica',
      trivia: 'Historia de la Computacion y Curiosidades'
    },
    quiz: {
      gameOverTitle: 'Ronda de Practica Finalizada',
      gameOverDesc: 'Has utilizado todos los intentos de esta ronda. Revisa los conceptos con calma e intentalo de nuevo.',
      finalScore: 'Puntuacion Alcanzada',
      restartBtn: 'Practicar Nuevamente',
      nextBtn: 'Siguiente Pregunta',
      explanationLabel: 'Comprende el Concepto',
      livesLabel: 'Intentos'
    },
    newsView: {
      header: 'Biblioteca de Lectura y Articulos',
      updatedLabel: 'Actualizado',
      readMore: 'Leer Articulo'
    },
    rankingView: {
      header: 'Tabla de la Comunidad',
      position: 'Posicion',
      xpUnit: 'XP'
    },
    profileView: {
      guestTitle: 'Identificacion de Estudio',
      inputPlaceholder: 'Tu nombre o apodo',
      loginBtn: 'Guardar y Continuar',
      logoutBtn: 'Cerrar Sesion',
      statsResolutions: 'Preguntas Completadas',
      statsTotalXp: 'Experiencia Total'
    }
  }
};