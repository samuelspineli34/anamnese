import React, { useState } from 'react';
import { ReleaseInfo, executePlatformUpdate, getLocalAppVersion } from '../services/updateService';
import { DownloadCloud, Check, X, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

interface UpdateModalProps {
  release: ReleaseInfo;
  onDismiss: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ release, onDismiss }) => {
  const [hasStartedDownload, setHasStartedDownload] = useState<boolean>(false);
  const currentVersion = getLocalAppVersion();

  const handleUpdate = () => {
    setHasStartedDownload(true);
    executePlatformUpdate(release.downloadUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-sans">
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        {/* Cabecalho */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-sm font-semibold text-[var(--text-main)]">
              Atualizacao Disponivel
            </h3>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Detalhes de Versao */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-subtle)]">
            <div>
              <span className="text-[var(--text-dim)] block text-[11px]">Versao Instalada</span>
              <span className="font-semibold text-[var(--text-main)]">v{currentVersion}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
            <div className="text-right">
              <span className="text-[var(--text-dim)] block text-[11px]">Nova Versao</span>
              <span className="font-semibold text-[var(--accent)]">{release.version}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-[var(--text-dim)] uppercase block">
              Novidades e Modificacoes:
            </span>
            <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-muted)] leading-relaxed max-h-32 overflow-y-auto whitespace-pre-line">
              {release.body}
            </div>
          </div>

          <div className="text-[11px] text-[var(--text-dim)] flex items-center justify-between">
            <span>Plataforma: <strong className="text-[var(--text-main)] uppercase">{release.platform}</strong></span>
            <span>Publicado em: {release.publishedAt}</span>
          </div>
        </div>

        {/* Feedback de Acao */}
        {hasStartedDownload && (
          <div className="p-3 bg-[var(--accent-soft)] border border-[var(--accent)]/30 rounded-xl text-xs text-[var(--accent)] flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>
              O download do arquivo {release.platform === 'android' ? 'APK' : 'executavel'} foi iniciado no seu dispositivo.
            </span>
          </div>
        )}

        {/* Botoes */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onDismiss}
            className="w-full py-2.5 px-3 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            Lembrar Depois
          </button>

          <button
            onClick={handleUpdate}
            className="w-full py-2.5 px-3 rounded-xl bg-[var(--accent)] text-[var(--bg-main)] font-medium text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>{hasStartedDownload ? 'Baixar Novamente' : 'Atualizar Agora'}</span>
          </button>
        </div>

        {hasStartedDownload && (
          <div className="text-center">
            <a
              href={release.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline"
            >
              <span>Se o download nao iniciar, clique aqui para abrir o link direto</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};