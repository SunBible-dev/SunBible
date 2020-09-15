//I have no idea what most of this does!!! - NCR

// Retrieve information about screen size, displays, cursor position, etc.
//
// For more info, see:
// https://electronjs.org/docs/api/screen

const { app, BrowserWindow, Menu, session } = require('electron')


app.on('ready', async () => {
  // We cannot require the screen module until the
  // app is ready
  const { screen } = require('electron')

  // Create a window that fills the sceen's available
  // work area.
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('docs/index.html')
})







// SunBible menu
const template = [

  {
    label: 'SunBible',
    submenu: [
    { label: 'Copy Bible Verses', role: 'copy' },
      { type: 'separator' },
      {
        label: 'View SunBible Online',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://the-sunshining.github.io/SunBible/')
        }
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)



// Right Click Menu using - "electron-context-menu": "^2.3.0"
const contextMenu = require('electron-context-menu');
contextMenu({
	menu: (actions, props, browserWindow) => [
		{ type: 'separator' },
		{ label: 'SunBible' },
		{ type: 'separator' },
   { label: 'Copy Bible Verses', role: 'copy' }
		
	]
});



 // SunBuble Chrome Ex
