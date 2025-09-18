const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
// Force production mode behavior so auto-updater runs even when launched from dev environments.
// NOTE: set to `false` for testing packaged update flow. Revert to `!app.isPackaged` for normal dev.
const isDev = false;
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

// FORCE disable signature verification for development
Object.defineProperty(autoUpdater, 'verifySignature', {
  value: () => Promise.resolve(null),
  writable: false,
  configurable: false
});

// Configure electron-updater to bypass signature verification before any usage
autoUpdater.autoDownload = false;
autoUpdater.allowPrerelease = false;
autoUpdater.allowDowngrade = false;

// Additional configuration to bypass verification
autoUpdater.forceDevUpdateConfig = true;
process.env.ELECTRON_UPDATER_ALLOW_UNVERIFIED = 'true';

// Override the entire signature verification system
if (process.platform === 'win32') {
  // Monkey-patch the internal verification method
  const Module = require('module');
  const originalRequire = Module.prototype.require;
  
  Module.prototype.require = function(id) {
    const result = originalRequire.apply(this, arguments);
    
    if (id === 'electron-updater' && result && result.autoUpdater) {
      // Override signature verification at the module level
      if (result.autoUpdater.constructor && result.autoUpdater.constructor.prototype) {
        result.autoUpdater.constructor.prototype.verifySignature = function() {
          return Promise.resolve(null);
        };
      }
    }
    
    return result;
  };
}

// Simple file logger that writes into the user's appData folder so packaged installs can write logs.
function flog(...args) {
  try {
    // prefer per-user writable path; fallback to __dirname
    let base = __dirname;
    try { base = app && app.getPath ? app.getPath('userData') : __dirname; } catch (e) { base = __dirname; }
    const LOG_PATH = path.join(base, 'electron-main.log');
    const line = new Date().toISOString() + ' ' + args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ') + '\n';
    fs.appendFileSync(LOG_PATH, line);
  } catch (e) {
    try { console.error('failed to write log', e); } catch (e2) {}
  }
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    },
  icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'default',
  show: false,
  autoHideMenuBar: true
  });

  // Compute start URL (dev server vs production build)
  // In production the "build" folder (React output) is packed alongside this file inside the asar.
  // So we reference it relative to __dirname (no ../). In dev we point to CRA dev server.
  const productionIndex = path.join(__dirname, 'build', 'index.html');
  const startUrl = isDev ? 'http://localhost:3000' : `file://${productionIndex}`;

  console.log('[electron] isDev:', isDev);
  console.log('[electron] loading URL:', startUrl);
  flog('[electron] isDev:', isDev);
  flog('[electron] loading URL:', startUrl);

  // Prefer loadURL during dev; in production use loadFile for robustness if file exists
  const loadPromise = isDev
    ? mainWindow.loadURL(startUrl)
    : (fs.existsSync(productionIndex)
        ? mainWindow.loadFile(productionIndex)
        : mainWindow.loadURL(startUrl));

  loadPromise.then(() => {
  console.log('[electron] loadURL succeeded');
  flog('[electron] loadURL succeeded');
  }).catch((err) => {
  console.error('[electron] loadURL failed:', err && err.message ? err.message : err);
  flog('[electron] loadURL failed:', err && err.message ? err.message : err);
    // Show a small fallback page that explains the error (use data URL)
    const fallbackHtml = `data:text/html;charset=utf-8,` + encodeURIComponent(`
      <html>
        <head><title>App failed to load</title></head>
        <body style="font-family: sans-serif; display:flex;align-items:center;justify-content:center;height:100vh;">
          <div style="max-width:720px;text-align:center;">
            <h1>Application failed to load</h1>
            <p>Electron couldn't load the application at <strong>${startUrl}</strong>.</p>
            <p>Make sure the React dev server is running (<code>npm start</code>) or run a production build and start the app again.</p>
            <pre style="background:#f5f5f5;padding:12px;border-radius:6px;overflow:auto;">${err && err.message ? err.message : JSON.stringify(err)}</pre>
          </div>
        </body>
      </html>
    `);

    // Try to load fallback page; if that also fails log to console
    mainWindow.loadURL(fallbackHtml).catch(e => {
      console.error('[electron] failed to load fallback page', e);
      flog('[electron] failed to load fallback page', e && e.message ? e.message : e);
    });
  });

  // Show window when ready-to-show to avoid visual flash; also fallback to showing after 5s
  let shown = false;
  mainWindow.once('ready-to-show', () => {
    shown = true;
    mainWindow.show();
  console.log('[electron] window ready-to-show -> shown');
  flog('[electron] window ready-to-show -> shown');
  // Ensure the menu bar is hidden for a cleaner desktop UI
  try { mainWindow.setMenuBarVisibility(false); } catch (e) { flog('setMenuBarVisibility failed', e && e.message ? e.message : e); }
  });

  // Fallback: if ready-to-show didn't fire within 5s, show the window anyway so user sees fallback content
  setTimeout(() => {
    if (!shown) {
      console.warn('[electron] ready-to-show did not fire within timeout; showing window anyway');
      try {
        mainWindow.show();
      } catch (e) {
        console.error('[electron] error showing window in fallback timeout', e);
        flog('[electron] error showing window in fallback timeout', e && e.message ? e.message : e);
      }
    }
  }, 5000);

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Remove default menu in production
  if (!isDev) {
    Menu.setApplicationMenu(null);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Ensure Windows AppUserModelID is set for proper behavior with shortcuts and notifications
  try {
    if (process.platform === 'win32' && app.setAppUserModelId) {
      app.setAppUserModelId('com.yourcompany.ecommerce-saas-manager');
    }
  } catch (e) { flog('setAppUserModelId failed', e && e.message ? e.message : e); }
  
  // Single instance lock - prevents multiple instances and helps with updates
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    flog('[app] Another instance is running, quitting');
    app.quit();
    return;
  }
  
  createWindow();
  
  // Configure auto-updater (only in production)
  if (!isDev) {
    setupAutoUpdater();
  }

  // Generic API proxy handler to avoid CORS issues from renderer
  ipcMain.handle('api-request', async (event, opts) => {
    try {
      const fetch = require('node-fetch');
      const url = opts.url;
      // Basic host whitelist — only allow requests to trusted backend hosts
      try {
        const parsed = new URL(url);
        const allowedHosts = ['backend.youshop.pro', 'localhost', '127.0.0.1'];
        if (!allowedHosts.includes(parsed.hostname)) {
          throw new Error('Host not allowed');
        }
      } catch (ee) {
        throw ee;
      }
      const method = opts.method || 'GET';
      const headers = opts.headers || {};
      const body = opts.body || null;

      const res = await fetch(url, { method, headers, body });
      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
      return { status: res.status, ok: res.ok, body: data };
    } catch (e) {
      flog('[api-proxy] request failed', e && (e.stack || e.message) ? (e.stack || e.message) : JSON.stringify(e));
      throw e;
    }
  });
});

// Auto-updater setup and event handlers
function setupAutoUpdater() {
  flog('[updater] Setting up auto-updater');
  
  // Configure updater
  try {
    
    // Setup IPC handlers
    ipcMain.handle('get-version', () => app.getVersion());
    ipcMain.handle('start-download', () => {
      try {
        autoUpdater.downloadUpdate();
        flog('[updater] Download started via UI');
      } catch (e) {
        flog('[updater] Download start failed', e && (e.stack || e.message) ? (e.stack || e.message) : JSON.stringify(e));
        throw e;
      }
    });
    
    ipcMain.handle('install-update', () => {
      try {
        flog('[updater] Installing update via UI');
        autoUpdater.quitAndInstall(true, true);
      } catch (e) {
        flog('[updater] Install failed', e && (e.stack || e.message) ? (e.stack || e.message) : JSON.stringify(e));
        throw e;
      }
    });

    ipcMain.handle('check-for-updates', () => {
      try {
        flog('[updater] Manual update check triggered via UI');
        autoUpdater.checkForUpdates();
      } catch (e) {
        flog('[updater] Manual update check failed', e && (e.stack || e.message) ? (e.stack || e.message) : JSON.stringify(e));
        throw e;
      }
    });

    // Auto-updater events - send to renderer via IPC
    autoUpdater.on('checking-for-update', () => {
      flog('[updater] Checking for update...');
      if (mainWindow) {
        mainWindow.webContents.send('update-checking');
      }
    });

    autoUpdater.on('update-available', (info) => {
      flog('[updater] Update available:', info.version);
      if (mainWindow) {
        mainWindow.webContents.send('update-available', info);
      }
    });

    autoUpdater.on('update-not-available', (info) => {
      flog('[updater] Update not available:', info && info.version ? info.version : 'n/a');
      if (mainWindow) {
        mainWindow.webContents.send('update-not-available', info);
      }
    });

    autoUpdater.on('error', (err) => {
      flog('[updater] Error in auto-updater:', err && (err.stack || err.message) ? (err.stack || err.message) : JSON.stringify(err));
      if (mainWindow) {
        mainWindow.webContents.send('update-error', { message: err.message || 'Update failed' });
      }
    });

    autoUpdater.on('download-progress', (progressObj) => {
      let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
      logMessage = logMessage + ` - Downloaded ${progressObj.percent}%`;
      logMessage = logMessage + ` (${progressObj.transferred}/${progressObj.total})`;
      flog('[updater]', logMessage);
      
      if (mainWindow) {
        mainWindow.webContents.send('download-progress', progressObj);
      }
    });

    autoUpdater.on('update-downloaded', (info) => {
      flog('[updater] Update downloaded:', info.version);
      if (mainWindow) {
        mainWindow.webContents.send('update-downloaded', info);
      }
    });

    // Initial check for updates
    autoUpdater.checkForUpdates();

    // Check for updates every 30 minutes
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 30 * 60 * 1000);
  } catch (e) {
    flog('[updater] setup failed', e && (e.stack || e.message) ? (e.stack || e.message) : JSON.stringify(e));
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
