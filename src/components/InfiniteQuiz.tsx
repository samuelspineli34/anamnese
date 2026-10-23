import React, { useState, useEffect } from 'react';
import { Question, Category } from '../types';
import { questionEngine } from '../services/questionEngine';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { RotateCcw, ArrowRight, CheckCircle2, XCircle, HelpCircle, Filter } from 'lucide-react';

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

  useEffect(() => {
    let pool = selectedCategory
      ? questionEngine.getQuestionsByCategory(selectedCategory)
      : questionEngine.getAllQuestions();

    if (pool.length === 0) {
      pool = questionEngine.getAllQuestions();
    }

    setQuestionList([...pool].sort(() => Math.random() - 0.5));
    setCurrentIdx(0);
    setGameOver(false);
    setIsAnswered(false);
    setSelectedOpt(null);
  }, [selectedCategory]);

  const q = questionList[currentIdx % (questionList.length || 1)];

  const handleSelect = (idx: number) => {
    if (isAnswered || gameOver || !q) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    if (idx === q.correctIndex) {
      const earned = 50 * multiplier;
      addXP(earned);
      setScore((s) => s + earned);
      setMultiplier((m) => Math.min(m + 1, 5));
    } else {
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
    setQuestionList((prev) => [...prev].sort(() => Math.random() - 0.5));
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

        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 w-full">
          <span className="text-xs text-[var(--text-dim)] block">{t.quiz.finalScore}</span>
          <div className="text-2xl font-bold text-[var(--text-main)] mt-1">{score} pontos</div>
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

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Barra de Progresso e Tentativas */}
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

        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            let style = 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-main)] hover:border-[var(--border-focus)]';
            let IconIndicator = null;

            if (isAnswered) {
              if (i === q.correctIndex) {
                style = 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--text-main)] font-medium';
                IconIndicator = <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />;
              } else if (i === selectedOpt) {
                style = 'bg-red-950/20 border-red-800 text-red-200';
                IconIndicator = <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
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
                {IconIndicator}
              </button>
            );
          })}
        </div>

        {/* Explicacao Conceitual Didatica */}
        {isAnswered && (
          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] space-y-4">
            <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-xs leading-relaxed space-y-1">
              <span className="font-semibold text-[var(--accent)] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.quiz.explanationLabel}</span>
              </span>
              <p className="text-[var(--text-muted)] pt-1">{q.explanation}</p>
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