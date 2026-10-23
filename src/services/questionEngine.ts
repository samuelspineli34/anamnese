import { Question, Category } from '../types';
import baseQuestions from '../data/questions_bank.json';
import { scrapeOnlineQuestions } from './crawlerService';

const STORAGE_KEY = 'anamnese_questions_repo';

class QuestionEngine {
  private questions: Question[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.questions = parsed;
          return;
        }
      }
    } catch (e) {
      // Ignora erro de parse
    }
    this.questions = [...(baseQuestions as Question[])];
  }

  public getQuestionsByCategory(cat: Category): Question[] {
    return this.questions.filter((q) => q.category === cat);
  }

  public getAllQuestions(): Question[] {
    return this.questions;
  }

  public async runLiveScraper(): Promise<number> {
    const newItems = await scrapeOnlineQuestions();
    if (newItems.length > 0) {
      // Evita duplicatas por texto da pergunta
      const existingTexts = new Set(this.questions.map((q) => q.question.toLowerCase().trim()));
      const uniqueNew = newItems.filter((q) => !existingTexts.has(q.question.toLowerCase().trim()));

      if (uniqueNew.length > 0) {
        this.questions = [...this.questions, ...uniqueNew];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.questions));
        return uniqueNew.length;
      }
    }
    return 0;
  }

  public getCountsByCategory(): Record<Category, number> {
    const counts: Record<Category, number> = {
      algoritmos: 0,
      ia: 0,
      so: 0,
      redes: 0,
      banco_dados: 0,
      compiladores: 0,
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