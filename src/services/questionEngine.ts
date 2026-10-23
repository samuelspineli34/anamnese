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

type Listener = () => void;

class QuestionEngine {
  private questions: Question[] = [];
  private listeners: Set<Listener> = new Set();
  private isHarvesting: boolean = false;

  constructor() {
    this.init();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
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
    const baseline: Question[] = [];
    ALL_CATEGORIES.forEach((cat) => {
      baseline.push(AIQuestionService.generateProceduralQuestion(cat));
      baseline.push(AIQuestionService.generateProceduralQuestion(cat));
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
    this.notify();
  }

  // Gera questoes imediatamente e garante aumento do acervo
  public async generateImmediateHarvest(): Promise<number> {
    if (this.isHarvesting) return 0;
    this.isHarvesting = true;

    try {
      // Gera novas questoes ineditas para todas as 12 categorias
      const newItems = await AIQuestionService.generateImmediateHarvest(ALL_CATEGORIES);

      // Tenta puxar lote online adicional
      const onlineScraped = await scrapeOnlineQuestions();

      const combined = [...newItems, ...onlineScraped];
      const added = this.integrateBatch(combined);
      return added;
    } finally {
      this.isHarvesting = false;
    }
  }

  public integrateBatch(newBatch: Question[]): number {
    if (!newBatch || newBatch.length === 0) return 0;
    const existingTexts = new Set(this.questions.map((q) => q.question.toLowerCase().trim()));
    const unique = newBatch.filter((q) => !existingTexts.has(q.question.toLowerCase().trim()));

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