'use strict';

const {app, BrowserWindow, ipcMain} = require('electron');

const fs   = require('fs');
const path = require('path');

const Config = require('electron-config');

const config = new Config({
  defaults: {notificationMode: 'all'}
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  let mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('setNotificationMode', (event, mode) => {
    config.set('notificationMode', mode);
  });

  ipcMain.on('getNotificationMode', (event, _) => {
    event.returnValue = config.get('notificationMode');
  });

  ipcMain.on('totalUnreadMessagesCount:updated', (_, unreadCount) => {
    app.setBadgeCount(unreadCount);
  });
});
