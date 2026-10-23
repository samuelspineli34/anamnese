import React, { useState, useEffect } from 'react';
import { StatsService } from '../services/statsService';
import { CategoryMetric, GlobalStats } from '../types';
import { useI18n } from '../context/I18nContext';
import {
  BarChart2,
  Award,
  CheckCircle2,
  Target,
  Zap,
  HelpCircle,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export const StatsView: React.FC = () => {
  const { t } = useI18n();
  const [metrics, setMetrics] = useState<{ categories: CategoryMetric[]; global: GlobalStats } | null>(null);
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  const loadMetrics = () => {
    setMetrics(StatsService.getMetrics());
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (!metrics) return null;

  const { global, categories } = metrics;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabecalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-subtle)] pb-4 gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-main)] flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[var(--accent)]" />
            <span>Diagnostico de Aprendizado e Desempenho</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Metricas estatisticas de retencao, amostragem e dominio por disciplina.
          </p>
        </div>

        <button
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] transition-colors self-start sm:self-auto"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Como o Dominio e Calculado?</span>
        </button>
      </div>

      {/* Explicacao da Formula Estatistica */}
      {showFormulaDetails && (
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] space-y-3 leading-relaxed">
          <h3 className="font-semibold text-sm text-[var(--text-main)] flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--accent)]" />
            <span>Fundamentacao Matematica do Indice de Dominio (D)</span>
          </h3>

          <p>
            Para evitar que um operador atinja 100% de dominio respondendo apenas uma unica questao de um tema, aplicamos uma combinacao de <strong>Suavizacao Bayesiana de Laplace</strong> com uma <strong>Funcao de Saturacao Amostral</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-mono">
            <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[var(--accent)] font-bold block">1. Probabilidade Suavizada (P):</span>
              <p className="text-[11px] text-[var(--text-dim)]">P = (Acertos + 1) / (Tentativas + 2)</p>
              <span className="text-[10px] text-[var(--text-dim)] block">Assume a priori neutro de 50% de probabilidade inicial.</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-[var(--accent)] font-bold block">2. Maturidade Amostral (F):</span>
              <p className="text-[11px] text-[var(--text-dim)]">F = 1 - e^(-Tentativas / 8)</p>
              <span className="text-[10px] text-[var(--text-dim)] block">Atinge alta representatividade estatistica apos 10 a 20 questoes.</span>
            </div>
          </div>

          <p className="pt-1 text-[11px]">
            O valor final exibido nas barras e o produto direto: <strong>Dominio = P x F x 100%</strong>.
          </p>
        </div>
      )}

      {/* Cards de Indicadores Globais */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
            <span>Nivel de Estudo</span>
            <Award className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--text-main)]">Nivel {global.level}</div>
          <span className="text-[11px] text-[var(--text-muted)] block">{global.xp} XP Acumulado</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
            <span>Acuracia Global</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--text-main)]">{global.overallAccuracy}%</div>
          <span className="text-[11px] text-[var(--text-muted)] block">{global.totalCorrect} de {global.totalAttempts} questoes</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
            <span>Indice de Dominio</span>
            <TrendingUp className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--accent)]">{global.overallMastery}%</div>
          <span className="text-[11px] text-[var(--text-muted)] block">Media ponderada geral</span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
            <span>Foco e Constancia</span>
            <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--text-main)]">{global.streakDays} dias</div>
          <span className="text-[11px] text-[var(--text-muted)] block">Sequencia de presenca</span>
        </div>
      </div>

      {/* Relatorio Detalhado por Disciplina */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
          Retencao e Dominio por Disciplina (Grade Completa)
        </h3>

        <div className="space-y-2.5">
          {categories.map((item) => {
            return (
              <div
                key={item.category}
                className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <span className="font-medium text-sm text-[var(--text-main)]">
                      {t.categories[item.category] || item.category}
                    </span>
                    <span className="text-[11px] text-[var(--text-dim)] block sm:inline sm:ml-2">
                      ({item.statusLabel})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span>{item.correct} acertos de {item.attempts}</span>
                    <span className="text-[var(--border-subtle)]">|</span>
                    <span className="font-semibold text-[var(--accent)]">{item.masteryScore}% Dominio</span>
                  </div>
                </div>

                {/* Barra Visual de Dominio */}
                <div className="w-full bg-[var(--bg-main)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                  <div
                    className="h-full bg-[var(--accent)] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(item.masteryScore, 0)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--text-dim)]">
                  <span>Acuracia bruta: {item.accuracy}%</span>
                  <span>Confianca estatistica da amostra: {item.confidenceFactor}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rodape de Manutencao de Metricas */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => {
            if (confirm('Deseja realmente resetar o historico de questoes e recalcular o dominio do zero?')) {
              StatsService.resetStats();
              loadMetrics();
            }
          }}
          className="flex items-center gap-1.5 text-xs text-[var(--text-dim)] hover:text-red-400 transition-colors py-1.5 px-3 rounded-lg border border-[var(--border-subtle)]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Zerar Historico de Respostas</span>
        </button>
      </div>
    </div>
  );
};