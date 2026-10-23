import { Question, Category } from '../types';
import { scrapeOnlineQuestions } from './crawlerService';
import { ProceduralGenerator } from './proceduralGenerator';

const STORAGE_KEY = 'anamnese_questions_repo_v3';

type Listener = () => void;

class QuestionEngine {
  private questions: Question[] = [];
  private listeners: Set<Listener> = new Set();
  private isHarvesting: boolean = false;

  constructor() {
    this.cleanLegacyContaminatedCache();
    this.init();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private cleanLegacyContaminatedCache() {
    localStorage.removeItem('anamnese_questions_repo');
    localStorage.removeItem('anamnese_questions_repo_v2');
  }

  private init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 30) {
          this.questions = this.sanitizeDataset(parsed);
          this.save();
          return;
        }
      }
    } catch {
      // Ignora erro
    }

    this.questions = ProceduralGenerator.generateComprehensiveCurriculum();
    this.save();
  }

  private sanitizeDataset(dataset: Question[]): Question[] {
    return dataset.map((q) => {
      const qLower = q.question.toLowerCase();
      const isTrivia =
        qLower.includes('headquarters') ||
        qLower.includes('nvidia') ||
        qLower.includes('silicon valley') ||
        qLower.includes('founded') ||
        qLower.includes('apple') ||
        qLower.includes('microsoft') ||
        qLower.includes('steve jobs') ||
        qLower.includes('nintendo') ||
        qLower.includes('video game');

      if (isTrivia && q.category !== 'trivia') {
        return { ...q, category: 'trivia' as Category };
      }
      return q;
    });
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.questions));
    } catch {
      // Ignora erro de cota
    }
    this.notify();
  }

  public async generateImmediateHarvest(): Promise<number> {
    if (this.isHarvesting) return 0;
    this.isHarvesting = true;

    try {
      const generated = ProceduralGenerator.generateComprehensiveCurriculum();
      const scraped = await scrapeOnlineQuestions();
      const combined = [...generated, ...scraped];
      return this.integrateBatch(combined);
    } finally {
      this.isHarvesting = false;
    }
  }

  public integrateBatch(newBatch: Question[]): number {
    if (!newBatch || newBatch.length === 0) return 0;
    const cleanBatch = this.sanitizeDataset(newBatch);
    const existingTexts = new Set(this.questions.map((q) => q.question.toLowerCase().trim()));
    const unique = cleanBatch.filter((q) => !existingTexts.has(q.question.toLowerCase().trim()));

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