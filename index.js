'use strict'

const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  let mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const config_path = path.join(app.getPath('userData'), 'config');

  ipcMain.on('setNotificationMode', (event, mode) => {
    const config = getConfig();
    config.notificationMode = mode;

    fs.writeFileSync(config_path, JSON.stringify(config));
  });

  ipcMain.on('getNotificationMode', (event, _) => {
    const config = getConfig();
    event.returnValue = config.notificationMode;
  });

  function getConfig() {
    let config;

    try {
      const file = fs.readFileSync(config_path);
      config = JSON.parse(file);
    } catch(e) {
      config = {notificationMode: 'never'};
    }

    return config;
  }
});
