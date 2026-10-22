export interface StorageMetrics {
  totalKb: number;
  questionsCount: number;
  questionsKb: number;
  savedArticlesCount: number;
  savedArticlesKb: number;
  userProfileKb: number;
}

export class StorageService {
  public static getMetrics(): StorageMetrics {
    let totalBytes = 0;
    let questionsBytes = 0;
    let articlesBytes = 0;
    let profileBytes = 0;
    let questionsCount = 0;
    let savedArticlesCount = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key) || '';
      const itemBytes = (key.length + value.length) * 2; // UTF-16
      totalBytes += itemBytes;

      if (key === 'anamnese_questions_repo') {
        questionsBytes += itemBytes;
        try {
          const parsed = JSON.parse(value);
          questionsCount = Array.isArray(parsed) ? parsed.length : 0;
        } catch (e) {
          questionsCount = 0;
        }
      } else if (key === 'anamnese_saved_articles') {
        articlesBytes += itemBytes;
        try {
          const parsed = JSON.parse(value);
          savedArticlesCount = Array.isArray(parsed) ? parsed.length : 0;
        } catch (e) {
          savedArticlesCount = 0;
        }
      } else if (key.startsWith('anamnese_user')) {
        profileBytes += itemBytes;
      }
    }

    return {
      totalKb: parseFloat((totalBytes / 1024).toFixed(2)),
      questionsCount,
      questionsKb: parseFloat((questionsBytes / 1024).toFixed(2)),
      savedArticlesCount,
      savedArticlesKb: parseFloat((articlesBytes / 1024).toFixed(2)),
      userProfileKb: parseFloat((profileBytes / 1024).toFixed(2)),
    };
  }

  public static clearQuestionsCache(): void {
    localStorage.removeItem('anamnese_questions_repo');
  }

  public static clearSavedArticles(): void {
    localStorage.removeItem('anamnese_saved_articles');
  }

  public static purgeAllCache(): void {
    localStorage.removeItem('anamnese_questions_repo');
    localStorage.removeItem('anamnese_saved_articles');
  }
}