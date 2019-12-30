const { app, BrowserWindow, ipcMain } = require('electron')

// let knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: './db.sqlite'
//   }
// })

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    height: 800,
    width: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true
  }
  })

  // mainWindow.webContents.openDevTools()

  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // ipcMain.on('mainWindowLoaded', function () {
  //   let result = knex.select('FirstName').from('Users')
  //   result.then(function (rows) {
  //     mainWindow.webContents.send('resultSent', rows)
  //   })

  //   knex('Users').insert({FirstName: 'Test'})
  //   .then((res) => {
      
  //   })
  // })
})

app.on('window-all-closed', () => {
  app.quit()
})