import React, { useState, useEffect } from 'react';
import { Question, Category } from '../types';
import { questionEngine } from '../services/questionEngine';
import { StatsService } from '../services/statsService';
import { AchievementService } from '../services/achievementService';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import {
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Filter,
  Check,
  X,
  AlertCircle,
  DownloadCloud
} from 'lucide-react';

interface InfiniteQuizProps {
  selectedCategory?: Category | null;
  onClearFilter?: () => void;
}

export const InfiniteQuiz: React.FC<InfiniteQuizProps> = ({ selectedCategory, onClearFilter }) => {
  const { addXP } = useApp();
  const { t } = useI18n();

  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [roundHits, setRoundHits] = useState(0);
  const [roundMisses, setRoundMisses] = useState(0);
  const [isSearchingMore, setIsSearchingMore] = useState(false);
  const [searchNotification, setSearchNotification] = useState<string | null>(null);

  const loadQuestionDeck = () => {
    let pool = selectedCategory
      ? questionEngine.getQuestionsByCategory(selectedCategory)
      : questionEngine.getAllQuestions();

    if (pool.length === 0) {
      pool = questionEngine.getAllQuestions();
    }

    setQuestionList([...pool].sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    loadQuestionDeck();
    setCurrentIdx(0);
    setGameOver(false);
    setIsAnswered(false);
    setSelectedOpt(null);
    setRoundHits(0);
    setRoundMisses(0);
  }, [selectedCategory]);

  const handleFetchMoreForCurrentScreen = async () => {
    setIsSearchingMore(true);
    setSearchNotification(null);

    const targetCat = selectedCategory || 'algoritmos';
    const addedCount = await questionEngine.harvestForCategory(targetCat, 35);

    loadQuestionDeck();
    setIsSearchingMore(false);
    setSearchNotification(`+${addedCount} novas questoes foram adicionadas a esta trilha!`);

    setTimeout(() => setSearchNotification(null), 4000);
  };

  const q = questionList[currentIdx % (questionList.length || 1)];

  const handleSelect = (idx: number) => {
    if (isAnswered || gameOver || !q) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === q.correctIndex;
    StatsService.recordAttempt(q.category, isCorrect);

    if (isCorrect) {
      setRoundHits((h) => h + 1);
      const earned = 50 * multiplier;
      addXP(earned);
      setScore((s) => s + earned);
      const nextMultiplier = Math.min(multiplier + 1, 5);
      setMultiplier(nextMultiplier);

      if (nextMultiplier === 3) AchievementService.unlock('combo_3');
      if (nextMultiplier === 5) AchievementService.unlock('combo_5');
      if (roundHits + 1 >= 10) AchievementService.unlock('high_accuracy');
    } else {
      setRoundMisses((m) => m + 1);
      setMultiplier(1);
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) setGameOver(true);
        return next;
      });
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOpt(null);
    setCurrentIdx((c) => c + 1);
  };

  const restart = () => {
    setLives(3);
    setScore(0);
    setMultiplier(1);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setGameOver(false);
    setRoundHits(0);
    setRoundMisses(0);
    loadQuestionDeck();
  };

  if (!q) {
    return (
      <div className="p-8 text-center text-[var(--text-muted)] text-sm">
        Carregando as questoes de estudo...
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-sm mx-auto">
        <h2 className="text-lg font-semibold text-[var(--text-main)]">{t.quiz.gameOverTitle}</h2>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{t.quiz.gameOverDesc}</p>

        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 w-full space-y-2">
          <div className="flex justify-around text-xs border-b border-[var(--border-subtle)] pb-2">
            <div>
              <span className="text-[var(--text-dim)] block text-[10px]">Acertos</span>
              <strong className="text-[var(--accent)] text-sm">{roundHits}</strong>
            </div>
            <div>
              <span className="text-[var(--text-dim)] block text-[10px]">Erros</span>
              <strong className="text-red-400 text-sm">{roundMisses}</strong>
            </div>
          </div>
          <div>
            <span className="text-xs text-[var(--text-dim)] block">{t.quiz.finalScore}</span>
            <div className="text-2xl font-bold text-[var(--text-main)] mt-0.5">{score} pontos</div>
          </div>
        </div>

        <button
          onClick={restart}
          className="flex items-center gap-2 bg-[var(--text-main)] text-[var(--bg-main)] text-xs font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.quiz.restartBtn}</span>
        </button>
      </div>
    );
  }

  const isUserCorrect = selectedOpt === q.correctIndex;

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Botao de Busca Direta na Pagina de Questoes */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleFetchMoreForCurrentScreen}
          disabled={isSearchingMore}
          className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-xl hover:border-[var(--border-focus)] transition-colors disabled:opacity-50"
        >
          <DownloadCloud className={`w-3.5 h-3.5 ${isSearchingMore ? 'animate-bounce text-[var(--accent)]' : ''}`} />
          <span>{isSearchingMore ? 'Ampliando Acervo...' : 'Buscar Mais Questoes Para Esta Trilha'}</span>
        </button>

        <span className="text-xs text-[var(--text-dim)]">
          {questionList.length} questoes no baralho
        </span>
      </div>

      {searchNotification && (
        <div className="p-2.5 bg-[var(--accent-soft)] border border-[var(--accent)]/40 rounded-xl text-xs text-[var(--accent)] font-medium text-center">
          {searchNotification}
        </div>
      )}

      {/* Placar de Rodada */}
      <div className="flex items-center justify-between bg-[var(--bg-card)] border border-[var(--border-subtle)] px-4 py-2.5 rounded-xl text-xs">
        <div className="flex items-center gap-3">
          {selectedCategory && (
            <div className="flex items-center gap-1 text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded text-[11px] font-medium">
              <Filter className="w-3 h-3" />
              <span>{t.categories[selectedCategory] || selectedCategory}</span>
              {onClearFilter && (
                <button onClick={onClearFilter} className="ml-1 text-[var(--text-muted)] hover:text-[var(--text-main)]">
                  x
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2.5 text-[11px] border-r border-[var(--border-subtle)] pr-3">
            <span className="flex items-center gap-1 text-[var(--accent)] font-medium">
              <Check className="w-3 h-3" /> {roundHits}
            </span>
            <span className="flex items-center gap-1 text-red-400 font-medium">
              <X className="w-3 h-3" /> {roundMisses}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-dim)]">{t.quiz.livesLabel}:</span>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < lives ? 'bg-[var(--accent)]' : 'bg-[var(--border-subtle)]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-main)]">{score}</span> pontos
        </div>
      </div>

      {/* Card da Questao */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-2xl space-y-5">
        <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
          <span className="text-[var(--accent)] font-medium">
            {t.categories[q.category] || q.category}
          </span>
          <span>Questao {(currentIdx % questionList.length) + 1} de {questionList.length}</span>
        </div>

        <h3 className="text-base font-medium text-[var(--text-main)] leading-relaxed">
          {q.question}
        </h3>

        {/* Alternativas */}
        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            let style = 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-main)] hover:border-[var(--border-focus)]';
            let StatusBadge = null;

            if (isAnswered) {
              if (i === q.correctIndex) {
                style = 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--text-main)] font-medium shadow-sm';
                StatusBadge = (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Gabarito Correto</span>
                  </span>
                );
              } else if (i === selectedOpt) {
                style = 'bg-red-950/30 border-red-500/80 text-red-200 shadow-sm';
                StatusBadge = (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-red-400">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Sua Escolha (Incorreta)</span>
                  </span>
                );
              } else {
                style = 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-dim)] opacity-50';
              }
            }

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between gap-3 ${style}`}
              >
                <span>{opt}</span>
                {StatusBadge}
              </button>
            );
          })}
        </div>

        {/* Explicacao Conceitual Comparativa */}
        {isAnswered && (
          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] space-y-3">
            {!isUserCorrect && selectedOpt !== null && (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-xs leading-relaxed space-y-1">
                <span className="font-semibold text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Por que a alternativa selecionada esta incorreta?</span>
                </span>
                <p className="text-red-200/80 pt-0.5">
                  Voce marcou: <em>"{q.options[selectedOpt]}"</em>. Esta alternativa diverge das definicoes formais ou dos calculos matematicos exigidos para {t.categories[q.category] || q.category}.
                </p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-xs leading-relaxed space-y-1">
              <span className="font-semibold text-[var(--accent)] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Fundamentacao da Resposta Correta:</span>
              </span>
              <p className="text-[var(--text-muted)] pt-0.5">{q.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 bg-[var(--text-main)] text-[var(--bg-main)] font-medium text-xs py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              <span>{t.quiz.nextBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};