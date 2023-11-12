const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const { createServer } = require('vite')

async function createWindow() {
  const vite = await createServer({
    server: { base: './' },
  });

  await vite.listen();

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the Vite app URL
  win.loadURL(`http://localhost:${vite.config.server.port}`);

  // Open the DevTools.
  if (process.env.NODE_ENV !== 'production') {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});