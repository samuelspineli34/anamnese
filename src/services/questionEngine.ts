import { Question, Category } from '../types';
import { scrapeOnlineQuestions } from './crawlerService';
import { AIQuestionService } from './aiQuestionService';

const STORAGE_KEY = 'anamnese_questions_repo';

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

class QuestionEngine {
  private questions: Question[] = [];
  private isHarvesting: boolean = false;

  constructor() {
    this.init();
    this.runAutonomousHarvesting();
  }

  private init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.questions = parsed;
          return;
        }
      }
    } catch {
      // Ignora erro
    }
    this.populateBaseline();
  }

  private populateBaseline() {
    // Gera questoes procedurais de partida para cada uma das 12 disciplinas
    const baseline: Question[] = [];
    ALL_CATEGORIES.forEach((cat) => {
      const items = AIQuestionService.generateProceduralBatch(cat);
      baseline.push(...items);
    });
    this.questions = baseline;
    this.save();
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.questions));
    } catch {
      // Ignora erro de cota
    }
  }

  // Monitoramento autonomo permanente em segundo plano
  public async runAutonomousHarvesting(): Promise<void> {
    if (this.isHarvesting) return;
    this.isHarvesting = true;

    try {
      // 1. Busca externa massiva via OpenTDB
      const scraped = await scrapeOnlineQuestions();
      this.integrateBatch(scraped);

      // 2. Verifica categorias deficientes e complementa com IA/Procedural
      const counts = this.getCountsByCategory();
      for (const cat of ALL_CATEGORIES) {
        if (counts[cat] < 8) {
          const aiItems = await AIQuestionService.generateAIBatch(cat, 3);
          this.integrateBatch(aiItems);
        }
      }
    } finally {
      this.isHarvesting = false;
    }
  }

  public integrateBatch(newBatch: Question[]): number {
    if (!newBatch || newBatch.length === 0) return 0;
    const existing = new Set(this.questions.map((q) => q.question.toLowerCase().trim()));
    const unique = newBatch.filter((q) => !existing.has(q.question.toLowerCase().trim()));

    if (unique.length > 0) {
      this.questions = [...this.questions, ...unique];
      this.save();
      return unique.length;
    }
    return 0;
  }

  public getQuestionsByCategory(cat: Category): Question[] {
    return this.questions.filter((q) => q.category === cat);
  }

  public getAllQuestions(): Question[] {
    return this.questions;
  }

  public getCountsByCategory(): Record<Category, number> {
    const counts: Record<Category, number> = {
      algoritmos: 0,
      so: 0,
      redes: 0,
      banco_dados: 0,
      compiladores: 0,
      ia: 0,
      arquitetura: 0,
      engenharia_software: 0,
      seguranca: 0,
      linguagens: 0,
      computacao_grafica: 0,
      trivia: 0,
    };

    this.questions.forEach((q) => {
      if (counts[q.category] !== undefined) {
        counts[q.category]++;
      }
    });

    return counts;
  }
}

export const questionEngine = new QuestionEngine();