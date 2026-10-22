// src/services/questionEngine.ts
import { Question, Category } from '../types';
import localQuestions from '../data/questions_bank.json';

class QuestionEngine {
  private memoryBank: Question[] = localQuestions as Question[];
  private usedIds: Set<string> = new Set();

  public getQuestionsByCategory(cat: Category): Question[] {
    return this.memoryBank.filter(q => q.category === cat);
  }

  // Pega uma questão aleatória nunca respondida na sessão
  public getNextInfiniteQuestion(): Question {
    const available = this.memoryBank.filter(q => !this.usedIds.has(q.id));
    
    if (available.length === 0) {
      // Se limpou o banco local inteiro, limpa o histórico de uso e repete
      this.usedIds.clear();
      return this.memoryBank[Math.floor(Math.random() * this.memoryBank.length)];
    }

    const selected = available[Math.floor(Math.random() * available.length)];
    this.usedIds.add(selected.id);
    return selected;
  }

  // Faz fetch dinâmico de novas questões em segundo plano caso a bateria acabe
  public async fetchMoreLiveQuestions(): Promise<void> {
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple');
      const data = await res.json();
      if (!data.results) return;

      const newBatch: Question[] = data.results.map((item: any, i: number) => {
        const options = [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5);
        return {
          id: `live_${Date.now()}_${i}`,
          category: 'algoritmos',
          question: item.question.replace(/&#039;/g, "'").replace(/&quot;/g, '"'),
          options,
          correctIndex: options.indexOf(item.correct_answer),
          explanation: 'Questão obtida dinamicamente da API pública de computação.'
        };
      });

      this.memoryBank.push(...newBatch);
      console.log(`[Engine] +${newBatch.length} questões inseridas no banco dinamicamente!`);
    } catch (e) {
      console.warn('Não foi possível buscar mais questões online, usando banco offline local.');
    }
  }

  public getStats() {
    return {
      total: this.memoryBank.length,
      categories: {
        algoritmos: this.memoryBank.filter(q => q.category === 'algoritmos').length,
        so: this.memoryBank.filter(q => q.category === 'so').length,
        redes: this.memoryBank.filter(q => q.category === 'redes').length,
        ia: this.memoryBank.filter(q => q.category === 'ia').length,
        banco_dados: this.memoryBank.filter(q => q.category === 'banco_dados').length,
        compiladores: this.memoryBank.filter(q => q.category === 'compiladores').length,
      }
    };
  }
}

export const questionEngine = new QuestionEngine();