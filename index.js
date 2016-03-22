'use strict'

const {app, BrowserWindow} = require('electron');

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  let mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
