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
  categories: {
    algoritmos: string;
    ia: string;
    so: string;
    redes: string;
    banco_dados: string;
    compiladores: string;
  };
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
    appName: 'ANAMNESE',
    tagline: 'Plataforma de Avaliacao e Diagnostico em Computacao e Inteligencia Artificial',
    modules: 'Modulos',
    infinite: 'Continuo',
    news: 'Boletim & IA',
    ranking: 'Classificacao',
    profile: 'Operador',
    streak: 'Dias',
    score: 'Pontos',
    level: 'Nivel',
    categories: {
      algoritmos: 'Algoritmos e Estruturas de Dados',
      ia: 'Inteligencia Artificial e Aprendizado Profundo',
      so: 'Sistemas Operacionais e Concorrencia',
      redes: 'Redes de Computadores e Protocolos',
      banco_dados: 'Sistemas de Bancos de Dados',
      compiladores: 'Compiladores e Teoria da Computacao'
    },
    quiz: {
      gameOverTitle: 'Sessao Encerrada',
      gameOverDesc: 'Limite de falhas operacionais atingido.',
      finalScore: 'Pontuacao Consolidada',
      restartBtn: 'Reiniciar Sessao',
      nextBtn: 'Avancar Questao',
      explanationLabel: 'Fundamentacao Tecnica',
      livesLabel: 'Integridade'
    },
    newsView: {
      header: 'Despachos Tecnologicos & Pesquisa',
      updatedLabel: 'Sincronizado',
      readMore: 'Acessar Documento'
    },
    rankingView: {
      header: 'Quadro Geral de Desempenho',
      position: 'Posicao',
      xpUnit: 'XP'
    },
    profileView: {
      guestTitle: 'Autenticacao de Operador',
      inputPlaceholder: 'Identificador (Nickname)',
      loginBtn: 'Iniciar Sessao',
      logoutBtn: 'Encerrar Acesso',
      statsResolutions: 'Avaliacoes Concluidas',
      statsTotalXp: 'Experiencia Cumulativa'
    }
  },
  en: {
    appName: 'ANAMNESE',
    tagline: 'Diagnostic & Evaluation Platform for Computer Science & Artificial Intelligence',
    modules: 'Modules',
    infinite: 'Continuous',
    news: 'Dispatches & AI',
    ranking: 'Leaderboard',
    profile: 'Operator',
    streak: 'Days',
    score: 'Score',
    level: 'Level',
    categories: {
      algoritmos: 'Algorithms & Data Structures',
      ia: 'Artificial Intelligence & Deep Learning',
      so: 'Operating Systems & Concurrency',
      redes: 'Computer Networks & Protocols',
      banco_dados: 'Database Systems',
      compiladores: 'Compilers & Theory of Computation'
    },
    quiz: {
      gameOverTitle: 'Session Terminated',
      gameOverDesc: 'Failure threshold exceeded.',
      finalScore: 'Consolidated Score',
      restartBtn: 'Restart Session',
      nextBtn: 'Next Question',
      explanationLabel: 'Technical Rationale',
      livesLabel: 'Integrity'
    },
    newsView: {
      header: 'Technical Dispatches & Research',
      updatedLabel: 'Synchronized',
      readMore: 'Open Document'
    },
    rankingView: {
      header: 'Global Performance Index',
      position: 'Rank',
      xpUnit: 'XP'
    },
    profileView: {
      guestTitle: 'Operator Authentication',
      inputPlaceholder: 'Identifier (Nickname)',
      loginBtn: 'Initialize Session',
      logoutBtn: 'Terminate Session',
      statsResolutions: 'Evaluations Completed',
      statsTotalXp: 'Cumulative XP'
    }
  },
  es: {
    appName: 'ANAMNESE',
    tagline: 'Plataforma de Evaluacion y Diagnostico en Computacion e Inteligencia Artificial',
    modules: 'Modulos',
    infinite: 'Continuo',
    news: 'Boletin & IA',
    ranking: 'Clasificacion',
    profile: 'Operador',
    streak: 'Dias',
    score: 'Puntos',
    level: 'Nivel',
    categories: {
      algoritmos: 'Algoritmos y Estructuras de Datos',
      ia: 'Inteligencia Artificial y Aprendizaje Profundo',
      so: 'Sistemas Operativos y Concurrencia',
      redes: 'Redes de Computadoras y Protocolos',
      banco_dados: 'Sistemas de Bases de Datos',
      compiladores: 'Compiladores y Teoria de la Computacion'
    },
    quiz: {
      gameOverTitle: 'Sesion Finalizada',
      gameOverDesc: 'Limite de tolerancia alcanzado.',
      finalScore: 'Puntuacion Consolidada',
      restartBtn: 'Reiniciar Sesion',
      nextBtn: 'Siguiente Pregunta',
      explanationLabel: 'Fundamento Tecnico',
      livesLabel: 'Integridad'
    },
    newsView: {
      header: 'Informes Tecnologicos e Investigacion',
      updatedLabel: 'Sincronizado',
      readMore: 'Acceder al Documento'
    },
    rankingView: {
      header: 'Tabla General de Rendimiento',
      position: 'Puesto',
      xpUnit: 'XP'
    },
    profileView: {
      guestTitle: 'Autenticacion de Operador',
      inputPlaceholder: 'Identificador (Nickname)',
      loginBtn: 'Iniciar Sesion',
      logoutBtn: 'Cerrar Sesion',
      statsResolutions: 'Evaluaciones Completadas',
      statsTotalXp: 'Experiencia Total'
    }
  }
};