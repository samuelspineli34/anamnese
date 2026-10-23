import { Achievement, User } from '../types';
import { StatsService } from './statsService';
import { getSavedArticles } from './newsService';

const ACHIEVEMENTS_STORAGE_KEY = 'anamnese_unlocked_achievements';

export const MASTER_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'progress' | 'unlockedAt'>[] = [
  { id: 'first_step', title: 'Primeiro Passo', description: 'Conclua sua primeira questao de estudo.', category: 'Geral', maxProgress: 1 },
  { id: 'streak_3', title: 'Foco Constante', description: 'Mantenha 3 dias consecutivos de presenca.', category: 'Consistencia', maxProgress: 3 },
  { id: 'streak_7', title: 'Habito Semanal', description: 'Complete 7 dias ininterruptos de estudo.', category: 'Consistencia', maxProgress: 7 },
  { id: 'streak_30', title: 'Mente Disciplinada', description: 'Alcance 30 dias de sequencia de estudos.', category: 'Consistencia', maxProgress: 30 },
  { id: 'combo_3', title: 'Sincronia Tripla', description: 'Atinja o multiplicador de pontuacao 3x.', category: 'Desempenho', maxProgress: 1 },
  { id: 'combo_5', title: 'Fluxo Perfeito', description: 'Alcance o multiplicador maximo de 5x.', category: 'Desempenho', maxProgress: 1 },
  { id: 'century', title: 'Centenario', description: 'Resolva 100 questoes na plataforma.', category: 'Geral', maxProgress: 100 },
  { id: 'half_k', title: 'Vanguardista', description: 'Acumule 500 questoes concluidas.', category: 'Geral', maxProgress: 500 },
  { id: 'master_algo', title: 'Mestre dos Algoritmos', description: 'Acerte 15 questoes de Algoritmos e Estruturas de Dados.', category: 'Especialidade', maxProgress: 15 },
  { id: 'master_so', title: 'Arquiteto de Kernel', description: 'Acerte 15 questoes de Sistemas Operacionais.', category: 'Especialidade', maxProgress: 15 },
  { id: 'master_net', title: 'Protocolo Universal', description: 'Acerte 15 questoes de Redes de Computadores.', category: 'Especialidade', maxProgress: 15 },
  { id: 'master_db', title: 'Integridade ACID', description: 'Acerte 15 questoes de Bancos de Dados.', category: 'Especialidade', maxProgress: 15 },
  { id: 'master_comp', title: 'Analise Lexica e Sintatica', description: 'Acerte 15 questoes de Compiladores e Teoria.', category: 'Especialidade', maxProgress: 15 },
  { id: 'master_ia', title: 'Sintese Neural', description: 'Acerte 15 questoes de Inteligencia Artificial.', category: 'Especialidade', maxProgress: 15 },
  { id: 'master_sec', title: 'Cifra Inviolavel', description: 'Acerte 15 questoes de Seguranca e Criptografia.', category: 'Especialidade', maxProgress: 15 },
  { id: 'master_arch', title: 'Microarquitetura Pura', description: 'Acerte 15 questoes de Arquitetura de Computadores.', category: 'Especialidade', maxProgress: 15 },
  { id: 'master_eng', title: 'Engenheiro SOLID', description: 'Acerte 15 questoes de Engenharia de Software.', category: 'Especialidade', maxProgress: 15 },
  { id: 'master_lang', title: 'Poliglota de Sistemas', description: 'Acerte 15 questoes de Linguagens de Programacao.', category: 'Especialidade', maxProgress: 15 },
  { id: 'master_cg', title: 'Rasterizador 3D', description: 'Acerte 15 questoes de Computacao Grafica.', category: 'Especialidade', maxProgress: 15 },
  { id: 'master_trivia', title: 'Historiador da Computacao', description: 'Acerte 15 questoes de Historia e Curiosidades.', category: 'Especialidade', maxProgress: 15 },
  { id: 'reader_scholar', title: 'Avido Leitor', description: 'Salve 3 artigos na sua biblioteca para estudo offline.', category: 'Leitura', maxProgress: 3 },
  { id: 'high_accuracy', title: 'Precisao Cirurgica', description: 'Conclua uma rodada com acuracia de 80% ou superior.', category: 'Desempenho', maxProgress: 1 },
  { id: 'level_5', title: 'Pesquisador Nivel 5', description: 'Alcance o Nivel 5 de progressao de estudo.', category: 'Geral', maxProgress: 5 },
  { id: 'level_10', title: 'Cientista da Computacao Nivel 10', description: 'Atinja o Nivel 10 na plataforma Anamnese.', category: 'Geral', maxProgress: 10 }
];

export class AchievementService {
  private static getUnlockedMap(): Record<string, string> {
    try {
      const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  public static unlock(id: string): void {
    const map = this.getUnlockedMap();
    if (!map[id]) {
      map[id] = new Date().toLocaleDateString('pt-BR');
      try {
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(map));
      } catch {
        // Ignora erro
      }
    }
  }

  public static getAllAchievements(user: User | null): Achievement[] {
    const unlockedMap = this.getUnlockedMap();
    const stats = StatsService.getMetrics();
    const savedArticles = getSavedArticles();

    return MASTER_ACHIEVEMENTS.map((def) => {
      let progress = 0;

      if (def.id === 'first_step') progress = Math.min(stats.global.totalAttempts, 1);
      else if (def.id === 'streak_3' || def.id === 'streak_7' || def.id === 'streak_30') progress = user ? user.streak : 0;
      else if (def.id === 'century' || def.id === 'half_k') progress = stats.global.totalAttempts;
      else if (def.id === 'reader_scholar') progress = savedArticles.length;
      else if (def.id === 'level_5' || def.id === 'level_10') progress = user ? user.level : 1;
      else if (def.id.startsWith('master_')) {
        const catName = def.id.replace('master_', '');
        const metric = stats.categories.find((c) => c.category === catName);
        progress = metric ? metric.correct : 0;
      }

      const isUnlocked = !!unlockedMap[def.id] || progress >= def.maxProgress;
      if (isUnlocked && !unlockedMap[def.id]) {
        this.unlock(def.id);
      }

      return {
        ...def,
        unlocked: isUnlocked,
        progress: Math.min(progress, def.maxProgress),
        unlockedAt: unlockedMap[def.id]
      };
    });
  }

  public static toggleFeatured(user: User, achievementId: string): string[] {
    const current = user.featuredAchievements || [];
    let updated: string[];

    if (current.includes(achievementId)) {
      updated = current.filter((id) => id !== achievementId);
    } else {
      if (current.length >= 5) {
        return current; // Limite maximo de 5
      }
      updated = [...current, achievementId];
    }

    return updated;
  }
}