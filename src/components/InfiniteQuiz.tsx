import React, { useState } from 'react';
import { mockQuestions } from '../data/questions';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { Heart, Zap, RotateCcw } from 'lucide-react';

export const InfiniteQuiz: React.FC = () => {
  const { addXP } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Embaralha ao atingir o final da lista para ser verdadeiramente infinito
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
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
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
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-3xl font-black text-rose-500">GAME OVER</h2>
        <p className="text-slate-400">Você ficou sem vidas no Modo Infinito!</p>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
          <span className="text-xs uppercase text-slate-500 font-bold">Pontuação Final</span>
          <div className="text-4xl font-extrabold text-emerald-400 mt-1">{score} pts</div>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:brightness-110"
        >
          <RotateCcw className="w-5 h-5" /> Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} className={`w-5 h-5 ${i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'}`} />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-yellow-400 flex items-center gap-1"><Zap className="w-3.5 h-3.5 fill-yellow-400" /> {multiplier}x</span>
          <span className="text-emerald-400">{score} pts</span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-emerald-500/20 p-5 rounded-2xl">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
          {q.category.toUpperCase()}
        </span>
        <h3 className="text-lg font-bold text-slate-100 mt-3 mb-4">{q.question}</h3>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let style = "bg-slate-800/80 border-slate-700 text-slate-300";
            if (isAnswered) {
              if (i === q.correctIndex) style = "bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold";
              else if (i === selectedOpt) style = "bg-rose-600/30 border-rose-500 text-rose-300";
            }
            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-3">
            <p className="text-xs text-slate-400 italic">💡 {q.explanation}</p>
            <button
              onClick={handleNext}
              className="w-full bg-emerald-500 text-black font-extrabold py-2.5 rounded-xl hover:bg-emerald-400"
            >
              Próxima Questão ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};