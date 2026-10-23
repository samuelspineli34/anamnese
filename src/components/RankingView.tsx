import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Award, Users } from 'lucide-react';

export const RankingView: React.FC = () => {
  const { ranking } = useApp();

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Cabecalho */}
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h2 className="text-base font-semibold text-[var(--text-main)] flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[var(--accent)]" />
          <span>Quadro da Comunidade de Estudos</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Classificacao por pontuacao cumulativa e consistencia de estudos.
        </p>
      </div>

      {/* Lista de Estudantes */}
      <div className="space-y-2.5">
        {ranking.map((item, index) => {
          const isSelf = item.name.includes('(Voce)');

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                isSelf
                  ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--text-main)] shadow-sm'
                  : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-main)]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 flex justify-center font-semibold text-xs text-[var(--text-dim)]">
                  {index === 0 ? (
                    <Award className="w-5 h-5 text-[var(--accent)]" />
                  ) : (
                    <span>#{item.position}</span>
                  )}
                </div>

                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] object-cover"
                />

                <div>
                  <h3 className="font-medium text-sm leading-tight text-[var(--text-main)]">
                    {item.name}
                  </h3>
                  <span className="text-xs text-[var(--text-muted)]">
                    Nivel {item.level}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-[var(--text-main)]">{item.xp}</span>
                <span className="text-[10px] text-[var(--text-dim)] block uppercase font-medium">XP</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <Users className="w-4 h-4 text-[var(--accent)] shrink-0" />
        <span>
          A pontuacao aumenta a cada questao concluida nas trilhas de estudo e na pratica continua.
        </span>
      </div>
    </div>
  );
};