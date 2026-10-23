const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

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

  if (app.isPackaged) {
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates().catch((err) => {
      console.warn('Falha na verificacao nativa de release:', err);
    });
  }
}

ipcMain.handle('get-app-version', () => app.getVersion());

ipcMain.on('start-download-update', () => {
  autoUpdater.downloadUpdate().catch((err) => {
    console.error('Falha no download da atualizacao:', err);
  });
});

ipcMain.on('apply-update', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('open-external-url', (_, url) => {
  shell.openExternal(url);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});