import { Category, CategoryMetric, GlobalStats } from '../types';

const STATS_STORAGE_KEY = 'anamnese_category_stats';

interface RawStatsRecord {
  attempts: number;
  correct: number;
  lastAttemptAt: number;
}

type StoredStats = Partial<Record<Category, RawStatsRecord>>;

const ALL_CATEGORIES: Category[] = [
  'algoritmos',
  'so',
  'redes',
  'banco_dados',
  'compiladores',
  'ia',
  'arquitetura',
  'engenharia_software',
  'seguranca',
  'linguagens',
  'computacao_grafica',
  'trivia'
];

export class StatsService {
  private static getStoredData(): StoredStats {
    try {
      const raw = localStorage.getItem(STATS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  public static recordAttempt(category: Category, isCorrect: boolean): void {
    const data = this.getStoredData();
    const current = data[category] || { attempts: 0, correct: 0, lastAttemptAt: Date.now() };

    data[category] = {
      attempts: current.attempts + 1,
      correct: current.correct + (isCorrect ? 1 : 0),
      lastAttemptAt: Date.now()
    };

    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignora erro de cota
    }
  }

  // Formula estatistica de Calculo de Dominio
  public static calculateCategoryMetric(category: Category, attempts: number, correct: number): CategoryMetric {
    const accuracy = attempts > 0 ? (correct / attempts) * 100 : 0;

    // 1. Suavizacao Bayesiana Laplaciana (evita 100% de dominio com 1 tentativa)
    const laplaceSmoothedProbability = (correct + 1) / (attempts + 2);

    // 2. Fator de Saturacao Amostral (crescimento exponencial assintotico ate 100%)
    const confidenceFactor = 1 - Math.exp(-attempts / 8);

    // 3. Indice de Dominio Final (%)
    const masteryScore = attempts === 0 ? 0 : Math.round(laplaceSmoothedProbability * confidenceFactor * 100);

    let statusLabel = 'Sem Amostragem';
    if (attempts > 0) {
      if (masteryScore >= 75) statusLabel = 'Dominio Consolidado';
      else if (masteryScore >= 50) statusLabel = 'Proficiencia Solida';
      else if (masteryScore >= 25) statusLabel = 'Compreensao Basica';
      else statusLabel = 'Em Fixacao Inicial';
    }

    return {
      category,
      attempts,
      correct,
      accuracy: Math.round(accuracy),
      masteryScore,
      confidenceFactor: Math.round(confidenceFactor * 100),
      statusLabel
    };
  }

  public static getMetrics(): { categories: CategoryMetric[]; global: GlobalStats } {
    const data = this.getStoredData();
    let totalAttempts = 0;
    let totalCorrect = 0;
    let totalMastery = 0;

    const categories: CategoryMetric[] = ALL_CATEGORIES.map((cat) => {
      const record = data[cat] || { attempts: 0, correct: 0, lastAttemptAt: 0 };
      const metric = this.calculateCategoryMetric(cat, record.attempts, record.correct);

      totalAttempts += record.attempts;
      totalCorrect += record.correct;
      totalMastery += metric.masteryScore;

      return metric;
    });

    const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const overallMastery = Math.round(totalMastery / ALL_CATEGORIES.length);

    // Identifica categoria de maior e menor dominio com amostragem
    const sampled = [...categories].filter((c) => c.attempts >= 3);
    sampled.sort((a, b) => b.masteryScore - a.masteryScore);

    const strongestCategory = sampled.length > 0 ? sampled[0].category : 'Sem dados suficientes';
    const weakestCategory = sampled.length > 0 ? sampled[sampled.length - 1].category : 'Sem dados suficientes';

    // Recupera dados do usuario para compor stats globais
    let xp = 0;
    let level = 1;
    let streakDays = 0;

    try {
      const userRaw = localStorage.getItem('anamnese_user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        xp = user.xp || 0;
        level = user.level || 1;
        streakDays = user.streak || 0;
      }
    } catch {
      // Ignora erro
    }

    return {
      categories,
      global: {
        totalAttempts,
        totalCorrect,
        overallAccuracy,
        overallMastery,
        streakDays,
        level,
        xp,
        strongestCategory,
        weakestCategory
      }
    };
  }

  public static resetStats(): void {
    localStorage.removeItem(STATS_STORAGE_KEY);
  }
}