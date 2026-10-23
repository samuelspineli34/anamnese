import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AchievementService } from '../services/achievementService';
import { LogOut, UserCheck, Edit3, Save, X, Github, Award, CheckCircle2, Lock } from 'lucide-react';

export const ProfileView = () => {
  const { user, login, updateUser, logout } = useApp();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isManagingAchievements, setIsManagingAchievements] = useState<boolean>(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [focusArea, setFocusArea] = useState(user?.focusArea || '');
  const [githubUser, setGithubUser] = useState(user?.githubUser || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const allAchievements = useMemo(() => {
    return AchievementService.getAllAchievements(user);
  }, [user]);

  const featuredList = useMemo(() => {
    const featuredIds = user?.featuredAchievements || [];
    return allAchievements.filter((a) => featuredIds.includes(a.id));
  }, [allAchievements, user?.featuredAchievements]);

  if (!user) {
    return (
      <div className="max-w-sm mx-auto p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="text-sm font-semibold">Identificacao de Estudos</h2>
        </div>
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-xs text-[var(--text-main)] outline-none focus:border-[var(--border-focus)]"
        />
        <button
          onClick={() => name && login(name, `${name.toLowerCase()}@anamnese.local`)}
          className="w-full bg-[var(--text-main)] text-[var(--bg-main)] font-medium py-2.5 rounded-lg text-xs"
        >
          Iniciar Sessao
        </button>
      </div>
    );
  }

  const handleSave = () => {
    updateUser({
      name,
      email,
      bio,
      focusArea,
      githubUser,
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
    });
    setIsEditing(false);
  };

  const handleToggleFeature = (achievementId: string) => {
    const updated = AchievementService.toggleFeatured(user, achievementId);
    updateUser({ featuredAchievements: updated });
  };

  const unlockedCount = allAchievements.filter((a) => a.unlocked).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Cabecalho do Perfil */}
      <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] object-cover"
          />
          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">{user.name}</h2>
            <span className="text-xs text-[var(--accent)] font-medium block">
              {user.focusArea || 'Ciencia da Computacao'}
            </span>
            <span className="text-xs text-[var(--text-dim)] block mt-0.5">{user.email}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setName(user.name);
            setEmail(user.email);
            setBio(user.bio || '');
            setFocusArea(user.focusArea || '');
            setGithubUser(user.githubUser || '');
            setAvatar(user.avatar);
            setIsEditing(!isEditing);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          <span>{isEditing ? 'Cancelar' : 'Editar Perfil'}</span>
        </button>
      </div>

      {/* Formulario de Edicao */}
      {isEditing && (
        <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Editar Informacoes da Conta
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-[var(--text-muted)]">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-xs text-[var(--text-main)] outline-none focus:border-[var(--border-focus)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-[var(--text-muted)]">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-xs text-[var(--text-main)] outline-none focus:border-[var(--border-focus)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-[var(--text-muted)]">Area de Foco</label>
              <input
                type="text"
                placeholder="Ex: Sistemas Distribuidos"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-xs text-[var(--text-main)] outline-none focus:border-[var(--border-focus)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-[var(--text-muted)]">Usuario do GitHub</label>
              <input
                type="text"
                placeholder="Ex: samuelspineli34"
                value={githubUser}
                onChange={(e) => setGithubUser(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-xs text-[var(--text-main)] outline-none focus:border-[var(--border-focus)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[var(--text-muted)]">Biografia</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-xs text-[var(--text-main)] outline-none focus:border-[var(--border-focus)] resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-1.5 w-full bg-[var(--accent)] text-[var(--bg-main)] font-medium py-2.5 rounded-lg text-xs hover:opacity-90 transition-opacity"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Alteracoes</span>
          </button>
        </div>
      )}

      {/* Secao de Conquistas em Destaque (Ate 5) */}
      <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--accent)]" />
              <span>Conquistas em Destaque ({featuredList.length}/5)</span>
            </h3>
            <span className="text-[11px] text-[var(--text-dim)]">
              {unlockedCount} de {allAchievements.length} conquistas desbloqueadas
            </span>
          </div>

          <button
            onClick={() => setIsManagingAchievements(!isManagingAchievements)}
            className="text-xs text-[var(--accent)] border border-[var(--border-subtle)] px-2.5 py-1 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
          >
            {isManagingAchievements ? 'Fechar' : 'Gerenciar Destaques'}
          </button>
        </div>

        {/* Grade de Ate 5 Destaques */}
        {featuredList.length === 0 ? (
          <div className="text-center py-4 text-xs text-[var(--text-dim)]">
            Nenhuma conquista destacada no momento. Clique em 'Gerenciar Destaques' para selecionar ate 5 conquistas.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {featuredList.map((ach) => (
              <div
                key={ach.id}
                className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--accent)]/40 space-y-1 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase text-[var(--accent)]">
                    {ach.category}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                </div>
                <h4 className="font-medium text-xs text-[var(--text-main)] leading-tight">{ach.title}</h4>
                <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-tight">
                  {ach.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Gerenciamento das Conquistas */}
        {isManagingAchievements && (
          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-3">
            <span className="text-[11px] text-[var(--text-muted)] block">
              Selecione quais conquistas desbloqueadas deseja exibir no seu perfil (maximo de 5):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {allAchievements.map((ach) => {
                const isFeatured = (user.featuredAchievements || []).includes(ach.id);

                return (
                  <button
                    key={ach.id}
                    disabled={!ach.unlocked}
                    onClick={() => handleToggleFeature(ach.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-start justify-between gap-2 transition-all ${
                      !ach.unlocked
                        ? 'opacity-40 bg-[var(--bg-main)] border-[var(--border-subtle)] cursor-not-allowed'
                        : isFeatured
                        ? 'bg-[var(--accent-soft)] border-[var(--accent)]'
                        : 'bg-[var(--bg-main)] border-[var(--border-subtle)] hover:border-[var(--border-focus)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-xs text-[var(--text-main)]">{ach.title}</span>
                        {!ach.unlocked && <Lock className="w-3 h-3 text-[var(--text-dim)]" />}
                      </div>
                      <p className="text-[10px] text-[var(--text-dim)] mt-0.5 leading-tight">{ach.description}</p>
                    </div>

                    {ach.unlocked && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                        isFeatured ? 'bg-[var(--accent)] text-[var(--bg-main)]' : 'border border-[var(--border-subtle)] text-[var(--text-muted)]'
                      }`}>
                        {isFeatured ? 'Ativo' : 'Destacar'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Biografia e GitHub */}
      {user.bio && !isEditing && (
        <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl text-xs text-[var(--text-muted)] leading-relaxed">
          <span className="text-[10px] text-[var(--text-dim)] uppercase font-semibold block mb-1">Sobre:</span>
          <p>{user.bio}</p>
          {user.githubUser && (
            <div className="pt-3 mt-3 border-t border-[var(--border-subtle)] flex items-center gap-2 text-[var(--text-main)]">
              <Github className="w-3.5 h-3.5 text-[var(--text-dim)]" />
              <span>github.com/{user.githubUser}</span>
            </div>
          )}
        </div>
      )}

      {/* Metricas */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 rounded-xl">
          <span className="text-xs text-[var(--text-dim)] block">Total de Experiencia</span>
          <div className="text-xl font-bold text-[var(--text-main)] mt-1">{user.xp} XP</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 rounded-xl">
          <span className="text-xs text-[var(--text-dim)] block">Questoes Resolvidas</span>
          <div className="text-xl font-bold text-[var(--accent)] mt-1">{(user.xp / 50).toFixed(0)}</div>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 p-2.5 text-red-400 border border-red-900/30 rounded-xl bg-red-950/20 hover:bg-red-950/40 text-xs font-medium transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Sair da Conta</span>
      </button>
    </div>
  );
};