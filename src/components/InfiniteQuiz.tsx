import React, { useState } from 'react';
import { mockQuestions } from '../data/questions';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { ShieldAlert, RotateCcw, ArrowRight, CheckCircle2, XCircle, Info } from 'lucide-react';

export const InfiniteQuiz: React.FC = () => {
  const { addXP } = useApp();
  const { t } = useI18n();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const q = mockQuestions[currentIdx % mockQuestions.length];

  const handleSelect = (idx: number) => {
    if (isAnswered || gameOver) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    if (idx === q.correctIndex) {
      const earned = 50 * multiplier;
      addXP(earned);
      setScore(s => s + earned);
      setMultiplier(m => Math.min(m + 1, 5));
    } else {
      setMultiplier(1);
      setLives(l => {
        const next = l - 1;
        if (next <= 0) setGameOver(true);
        return next;
      });
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOpt(null);
    setCurrentIdx(c => c + 1);
  };

  const restart = () => {
    setLives(3);
    setScore(0);
    setMultiplier(1);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-5">
        <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-mono font-bold text-zinc-100">{t.quiz.gameOverTitle}</h2>
          <p className="text-xs text-zinc-500 mt-1">{t.quiz.gameOverDesc}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 w-full max-w-xs font-mono">
          <span className="text-[10px] uppercase text-zinc-500 font-semibold">{t.quiz.finalScore}</span>
          <div className="text-3xl font-bold text-zinc-100 mt-1">{score}</div>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 bg-zinc-100 text-zinc-950 text-xs font-mono font-bold px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> {t.quiz.restartBtn}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 px-4 py-2.5 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500 mr-1 text-[11px]">{t.quiz.livesLabel}:</span>
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={`inline-block w-2 h-2 rounded-full ${
                i < lives ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <span>MULT: {multiplier}x</span>
          <span className="text-zinc-200 font-bold">{score} PTS</span>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider text-emerald-500 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded">
            {q.category.toUpperCase()}
          </span>
          <span className="text-[10px] font-mono text-zinc-500">ID: {q.id}</span>
        </div>

        <h3 className="text-sm font-semibold text-zinc-100 leading-snug">{q.question}</h3>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let style = "bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700";
            let IconIndicator = null;

            if (isAnswered) {
              if (i === q.correctIndex) {
                style = "bg-emerald-950/30 border-emerald-600/60 text-emerald-300";
                IconIndicator = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
              } else if (i === selectedOpt) {
                style = "bg-red-950/30 border-red-600/60 text-red-300";
                IconIndicator = <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
              }
            }

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between gap-3 ${style}`}
              >
                <span>{opt}</span>
                {IconIndicator}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-4 pt-3 border-t border-zinc-800 space-y-3">
            <div className="flex items-start gap-2 bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg">
              <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">
                  {t.quiz.explanationLabel}
                </span>
                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">{q.explanation}</p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-1.5 bg-zinc-100 text-zinc-950 font-mono font-bold text-xs py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
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