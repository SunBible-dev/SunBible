//I have no idea what most of this does!!! - NCR




// Retrieve information about screen size, displays, cursor position, etc.
//
// For more info, see:
// https://electronjs.org/docs/api/screen

const { app, BrowserWindow, Menu, session } = require('electron')

const path = require('path')


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



  // SunBuble Chrome Ex
  //await session.defaultSession.loadExtension(path.join(__dirname, 'docs'))
  // or ?
//  session.loadExtension('docs').then(({ id }) => {
    // ...
//  })






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

// Right Click Menu
const POPmenu = Menu.buildFromTemplate(template)
menu.popup(POPmenu)