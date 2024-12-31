const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 300,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Log to check if the file exists
  const filePath = path.join(__dirname, '../BibleBase/appTheme/theme-iframe.html');
  console.log(`Loading file from: ${filePath}`);
  console.log(`File exists: ${fs.existsSync(filePath)}`);

  mainWindow.loadFile(filePath);

  // App menu for macOS
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'about' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'View',
      submenu: [
        { role: 'copy' },
        { role: 'selectAll' },
        { type: 'separator' },
        { role: 'reload' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
          label: 'Always On Top',
          click() {
            mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop());
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
});

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
