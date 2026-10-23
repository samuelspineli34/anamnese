import React from 'react';
import { ReleaseInfo } from '../services/updateService';
import { ArrowDownCircle, Clock, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface UpdateModalProps {
  release: ReleaseInfo;
  onDismiss: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ release, onDismiss }) => {
  const handleUpdateNow = () => {
    // Se estiver rodando no Electron via require/ipc
    if (typeof window !== 'undefined' && (window as any).require) {
      try {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('open-external-url', release.downloadUrl);
        onDismiss();
        return;
      } catch (e) {
        // Fallback para navegador
      }
    }
    window.open(release.downloadUrl, '_blank');
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
              Nova Versao Disponivel
            </h3>
          </div>
          <button onClick={onDismiss} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Versao identificada:</span>
            <span className="text-emerald-400 font-bold">{release.version}</span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-3 text-xs text-zinc-400 space-y-1 max-h-36 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
              Registro de Alteracoes:
            </span>
            <p className="whitespace-pre-line leading-relaxed">{release.body}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onDismiss}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-zinc-800 text-xs font-semibold text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Atualizar Depois</span>
          </button>

          <button
            onClick={handleUpdateNow}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-colors"
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>Atualizar Agora</span>
          </button>
        </div>
      </div>
    </div>
  );
};