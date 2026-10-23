export interface ReleaseInfo {
  version: string;
  name: string;
  body: string;
  publishedAt: string;
  downloadUrl: string;
}

const GITHUB_REPO = 'samuelspineli34/anamnese';
export const CURRENT_VERSION = '1.0.0';

export async function checkLatestRelease(): Promise<{ hasUpdate: boolean; release?: ReleaseInfo }> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (!res.ok) {
      return { hasUpdate: false };
    }

    const data = await res.json();
    const latestTag = (data.tag_name || '').replace(/^v/, '');

    if (isNewerVersion(latestTag, CURRENT_VERSION)) {
      // Identifica o binário adequado dependendo da plataforma
      const isWindows = navigator.userAgent.toLowerCase().includes('windows');
      const isAndroid = navigator.userAgent.toLowerCase().includes('android');

      let downloadAsset = data.html_url;
      if (Array.isArray(data.assets)) {
        if (isWindows) {
          const exeAsset = data.assets.find((a: any) => a.name.endsWith('.exe'));
          if (exeAsset) downloadAsset = exeAsset.browser_download_url;
        } else if (isAndroid) {
          const apkAsset = data.assets.find((a: any) => a.name.endsWith('.apk'));
          if (apkAsset) downloadAsset = apkAsset.browser_download_url;
        }
      }

      return {
        hasUpdate: true,
        release: {
          version: data.tag_name,
          name: data.name || data.tag_name,
          body: data.body || 'Aprimoramentos técnicos e correções de segurança.',
          publishedAt: data.published_at,
          downloadUrl: downloadAsset,
        },
      };
    }

    return { hasUpdate: false };
  } catch (err) {
    console.warn('Falha na verificação de release:', err);
    return { hasUpdate: false };
  }
}

function isNewerVersion(latest: string, current: string): boolean {
  const parse = (v: string) => v.split('.').map(n => parseInt(n, 10) || 0);
  const [lMaj, lMin, lPat] = parse(latest);
  const [cMaj, cMin, cPat] = parse(current);

  if (lMaj > cMaj) return true;
  if (lMaj === cMaj && lMin > cMin) return true;
  if (lMaj === cMaj && lMin === cMin && lPat > cPat) return true;
  return false;
}