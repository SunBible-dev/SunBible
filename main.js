//I have no idea what most of this does!!! - NCR

const { app, BrowserWindow, Menu, session } = require('electron')




// Main SunBible App Activity: 
app.on('ready', async () => {
  // We cannot require the screen module until the
  // app is ready
  const { screen } = require('electron')

  // Create a window that fills the sceen's available  work area.
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  })

  mainWindow.loadFile('docs/index.html')
})


//App tabs:
//
//     const TabGroup = require("electron-tabs");
//     
//     let tabGroup = new TabGroup();
//     let tab = tabGroup.addTab({
//       title: "SunBible",
//       src: "https://the-sunshining.github.io/SunBible/",
//       visible: true
//     });




// SunBible menu
const isMac = process.platform === 'darwin'
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
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  }
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)



// Right Click Menu using - "electron-context-menu": "^2.3.0"
const contextMenu = require('electron-context-menu');
contextMenu({
	menu: (actions, props, browserWindow) => [
    {
      label: 'SunBible',
      submenu: [
      { label: 'Copy Bible Verses', role: 'copy' },
        { type: 'separator' }
      ]
    }
		
	]
});



 // SunBuble Chrome Ex - for future


 
 // Removed from package json:
 // "electron-tabs": "^0.15.0"
