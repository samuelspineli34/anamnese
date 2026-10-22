import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { LogOut, Activity, UserCheck } from 'lucide-react';

export const ProfileView = () => {
  const { user, login, logout } = useApp();
  const { t } = useI18n();
  const [nameInput, setNameInput] = useState('');

  if (!user) {
    return (
      <div className="max-w-sm mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 font-mono">
        <div className="flex items-center gap-2 text-zinc-100">
          <UserCheck className="w-5 h-5 text-emerald-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider">{t.profileView.guestTitle}</h2>
        </div>
        <input
          type="text"
          placeholder={t.profileView.inputPlaceholder}
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-zinc-700"
        />
        <button
          onClick={() => nameInput && login(nameInput, `${nameInput.toLowerCase()}@anamnese.local`)}
          className="w-full bg-zinc-100 text-zinc-950 font-bold py-2.5 rounded-lg hover:bg-zinc-200 text-xs transition-colors"
        >
          {t.profileView.loginBtn}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 font-mono">
      <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center gap-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-14 h-14 rounded-lg bg-zinc-800 border border-zinc-700 object-cover"
        />
        <div>
          <h2 className="text-sm font-bold text-zinc-100">{user.name}</h2>
          <span className="text-xs text-emerald-500 font-semibold block mt-0.5">
            {t.level} {user.level}
          </span>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-400">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>{user.streak} {t.streak}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold block">
            {t.profileView.statsTotalXp}
          </span>
          <div className="text-xl font-bold text-zinc-100 mt-1">{user.xp}</div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold block">
            {t.profileView.statsResolutions}
          </span>
          <div className="text-xl font-bold text-zinc-100 mt-1">{(user.xp / 50).toFixed(0)}</div>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 p-2.5 text-red-400 border border-red-950 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-xs font-semibold transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>{t.profileView.logoutBtn}</span>
      </button>
    </div>
  );
};