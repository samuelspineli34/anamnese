export interface ReleaseInfo {
  version: string;
  name: string;
  body: string;
  publishedAt: string;
  downloadUrl: string;
  platform: 'windows' | 'android' | 'web';
  fileName: string;
}

declare const __APP_VERSION__: string;

const GITHUB_REPO = 'samuelspineli34/anamnese';

export function getLocalAppVersion(): string {
  if (typeof __APP_VERSION__ !== 'undefined') {
    return __APP_VERSION__;
  }
  return '1.0.0';
}

export function detectCurrentPlatform(): 'windows' | 'android' | 'web' {
  const userAgent = (navigator.userAgent || '').toLowerCase();
  if (userAgent.includes('android')) return 'android';
  if (userAgent.includes('windows') || userAgent.includes('electron')) return 'windows';
  return 'web';
}

export async function checkLatestRelease(): Promise<{ hasUpdate: boolean; release?: ReleaseInfo; currentVersion: string }> {
  const currentVersion = getLocalAppVersion();

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (!res.ok) {
      return { hasUpdate: false, currentVersion };
    }

    const data = await res.json();
    const latestTag = (data.tag_name || '').replace(/^v/, '');

    if (isNewerVersion(latestTag, currentVersion)) {
      const platform = detectCurrentPlatform();
      let downloadUrl = data.html_url;
      let fileName = 'Nova Versao';

      if (Array.isArray(data.assets) && data.assets.length > 0) {
        if (platform === 'windows') {
          const exeAsset = data.assets.find((a: any) => a.name.endsWith('.exe'));
          if (exeAsset) {
            downloadUrl = exeAsset.browser_download_url;
            fileName = exeAsset.name;
          }
        } else if (platform === 'android') {
          const apkAsset = data.assets.find((a: any) => a.name.endsWith('.apk'));
          if (apkAsset) {
            downloadUrl = apkAsset.browser_download_url;
            fileName = apkAsset.name;
          }
        }
      }

      return {
        hasUpdate: true,
        currentVersion,
        release: {
          version: data.tag_name,
          name: data.name || data.tag_name,
          body: data.body || 'Melhorias de desempenho e atualizacoes no acervo de questoes.',
          publishedAt: new Date(data.published_at).toLocaleDateString('pt-BR'),
          downloadUrl,
          platform,
          fileName,
        },
      };
    }

    return { hasUpdate: false, currentVersion };
  } catch (err) {
    return { hasUpdate: false, currentVersion };
  }
}

// Executa o download/atualizacao conforme a plataforma
export function executePlatformUpdate(downloadUrl: string): void {
  // 1. Se estiver rodando no Electron (Windows Desktop)
  if (typeof window !== 'undefined' && (window as any).require) {
    try {
      const { ipcRenderer, shell } = (window as any).require('electron');
      if (shell && shell.openExternal) {
        shell.openExternal(downloadUrl);
        return;
      }
      ipcRenderer.send('open-external-url', downloadUrl);
      return;
    } catch {
      // Fallback para navegador
    }
  }

  // 2. Se for Android nativo ou PWA/Web
  // Utiliza _system para acionar o DownloadManager do Android nativamente
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function isNewerVersion(latest: string, current: string): boolean {
  const parse = (v: string) => v.split('.').map((n) => parseInt(n, 10) || 0);
  const [lMaj = 0, lMin = 0, lPat = 0] = parse(latest);
  const [cMaj = 0, cMin = 0, cPat = 0] = parse(current);

  if (lMaj > cMaj) return true;
  if (lMaj === cMaj && lMin > cMin) return true;
  if (lMaj === cMaj && lMin === cMin && lPat > cPat) return true;
  return false;
}