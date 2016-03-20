'use strict'

const app           = require('electron').app,
      BrowserWindow = require('electron').BrowserWindow;

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  let mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
