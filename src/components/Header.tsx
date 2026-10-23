import React from 'react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { Globe, Award, Sparkles, BookOpen } from 'lucide-react';
import { Language } from '../i18n/translations';
import { ReleaseInfo } from '../services/updateService';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (t: any) => void;
  pendingUpdate?: ReleaseInfo | null;
  onOpenUpdate?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setActiveTab, pendingUpdate, onOpenUpdate }) => {
  const { user } = useApp();
  const { language, setLanguage, t } = useI18n();

  const handleLangCycle = () => {
    const sequence: Language[] = ['pt', 'en', 'es'];
    const nextIdx = (sequence.indexOf(language) + 1) % sequence.length;
    setLanguage(sequence[nextIdx]);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/90 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('quiz')}>
        <div className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]">
          <BookOpen className="w-4 h-4 text-[var(--accent)]" />
        </div>
        <div>
          <span className="text-sm font-semibold text-[var(--text-main)] tracking-tight block">
            {t.appName}
          </span>
          <span className="text-[11px] text-[var(--text-dim)] block">
            Estudos de Computacao
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {pendingUpdate && (
          <button
            onClick={onOpenUpdate}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] text-xs hover:opacity-90 transition-opacity font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atualizacao Disponivel</span>
          </button>
        )}

        {user && (
          <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-3 py-1 text-xs">
            <span className="text-[var(--text-muted)]">{user.streak} dias de estudo</span>
            <span className="text-[var(--border-subtle)]">|</span>
            <span className="flex items-center gap-1 text-[var(--text-main)] font-medium">
              <Award className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>{user.xp} XP</span>
            </span>
          </div>
        )}

        <button
          onClick={handleLangCycle}
          title="Alterar Idioma"
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors uppercase font-medium"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language}</span>
        </button>
      </div>
    </header>
  );
};