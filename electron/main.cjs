const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

let autoUpdater = null;
try {
  const updaterModule = require('electron-updater');
  autoUpdater = updaterModule.autoUpdater;
} catch (err) {
  console.warn('Modulo electron-updater indisponivel no runtime:', err.message);
}

let mainWindow;

function createWindow() {
  const iconPath = path.join(__dirname, '../assets/anamnese.png');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    autoHideMenuBar: true,
    title: 'Anamnese',
    icon: iconPath,
    backgroundColor: '#06080d',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
  }

  // Consulta de atualizacao com protecao
  if (app.isPackaged && autoUpdater) {
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates().catch((err) => {
      console.warn('Falha na verificacao nativa de release:', err);
    });
  }
}

ipcMain.handle('get-app-version', () => app.getVersion());

ipcMain.on('start-download-update', () => {
  if (autoUpdater) {
    autoUpdater.downloadUpdate().catch((err) => {
      console.error('Falha no download da atualizacao:', err);
    });
  }
});

ipcMain.on('apply-update', () => {
  if (autoUpdater) {
    autoUpdater.quitAndInstall();
  }
});

ipcMain.on('open-external-url', (_, url) => {
  shell.openExternal(url);
});

if (autoUpdater) {
  autoUpdater.on('update-available', (info) => {
    if (mainWindow) {
      mainWindow.webContents.send('native-update-available', info);
    }
  });

  autoUpdater.on('update-downloaded', () => {
    if (mainWindow) {
      mainWindow.webContents.send('native-update-downloaded');
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});