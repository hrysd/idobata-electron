'use strict';

const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  const config_path = path.join(app.getPath('userData'), 'config');

  let mainWindow = new BrowserWindow(getConfig().boundaryPosition);

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('close', () => {
    const config = getConfig();
    config.boundaryPosition = mainWindow.getBounds()
    fs.writeFileSync(config_path, JSON.stringify(config));
  })

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('setNotificationMode', (event, mode) => {
    const config = getConfig();
    config.notificationMode = mode;

    fs.writeFileSync(config_path, JSON.stringify(config));
  });

  ipcMain.on('getNotificationMode', (event, _) => {
    const config = getConfig();
    event.returnValue = config.notificationMode;
  });

  ipcMain.on('totalUnreadMessagesCount:updated', (_, unreadCount) => {
    app.setBadgeCount(unreadCount);
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
