import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Medal } from 'lucide-react';

export const RankingView: React.FC = () => {
  const { ranking } = useApp();

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-black text-slate-100">Leaderboard Geral</h2>
      </div>

      <div className="space-y-2">
        {ranking.map((r, i) => {
          let posBadge = null;
          if (i === 0) posBadge = <Medal className="w-5 h-5 text-yellow-400" />;
          else if (i === 1) posBadge = <Medal className="w-5 h-5 text-slate-300" />;
          else if (i === 2) posBadge = <Medal className="w-5 h-5 text-amber-600" />;
          else posBadge = <span className="font-bold text-slate-500 text-sm">#{r.position}</span>;

          const isSelf = r.name.includes('(Você)');

          return (
            <div
              key={r.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                isSelf
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 flex justify-center">{posBadge}</div>
                <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700" />
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    {r.name}
                  </div>
                  <div className="text-[11px] text-slate-400">Nível {r.level}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-400">{r.xp}</span>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};