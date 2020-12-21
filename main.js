//I have no idea what most of this does!!! - NCR

const { app, BrowserWindow } = require('electron')


// Main App Activity: 
app.on('ready', async () => {


    const mainWindow = new BrowserWindow({
        alwaysOnTop: true,
        minimizable: true,
        width: 1000,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    })

    mainWindow.loadFile('app_frame/app-iframe.html')
    mainWindow.removeMenu()




})





// Right Click Menu using - "electron-context-menu": "^2.3.0"
const contextMenu = require('electron-context-menu');
contextMenu({
  menu: (actions, props, browserWindow) => [

    { role: 'copy' },
    { role: 'selectAll' },
    { type: 'separator' },
    actions.copyImage(),
    actions.saveImageAs(),
    { type: 'separator' },
    {
      label: 'View SunBible Online',
      click: async () => {
        const { shell } = require('electron')
        await shell.openExternal('https://the-sunshining.github.io/SunBible/')
      }
    },
    {
      label: 'Open SunBible Wallpaper online',
      click: async () => {
        const { shell } = require('electron')
        await shell.openExternal('https://the-sunshining.github.io/SunBible_IMG_Library/SunBible_wallpaper_img/wallpaper.html')
      }
    },
    { type: 'separator' },
    { role: 'minimize'},
    { role: 'togglefullscreen' },
    { role: 'close' }

  ]
});






 
 // Removed from package json:
 // "electron-tabs": "^0.15.0",
 // "electron-updater": "^4.3.5"
