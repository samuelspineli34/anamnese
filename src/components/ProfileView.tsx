import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, LogOut, CheckCircle, Flame } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, login, logout } = useApp();
  const [nameInput, setNameInput] = useState('');

  if (!user) {
    return (
      <div className="max-w-sm mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Criar Perfil / Entrar</h2>
        <input
          type="text"
          placeholder="Seu Nickname de Dev"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => nameInput && login(nameInput, 'user@dev.cc')}
          className="w-full bg-emerald-500 text-black font-extrabold py-3 rounded-xl hover:bg-emerald-400"
        >
          Entrar e Salvar Progresso
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
        <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-emerald-500/40" />
        <div>
          <h2 className="text-lg font-bold text-slate-100">{user.name}</h2>
          <span className="text-xs text-emerald-400 font-semibold">Dev Nível {user.level}</span>
          <div className="flex items-center gap-1 mt-1 text-xs text-orange-400 font-bold">
            <Flame className="w-4 h-4 fill-orange-400" /> {user.streak} dias de sequência
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-500 uppercase font-bold">Total XP</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{user.xp}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-500 uppercase font-bold">Resoluções</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">{(user.xp / 50).toFixed(0)}</div>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 p-3 text-rose-400 border border-rose-500/30 rounded-xl bg-rose-950/20 hover:bg-rose-900/30 text-sm font-bold"
      >
        <LogOut className="w-4 h-4" /> Sair da Conta
      </button>
    </div>
  );
};