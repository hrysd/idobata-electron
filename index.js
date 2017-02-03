'use strict';

const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
let quit = false;

function createMainWindow() {
  const icon = path.join(__dirname, 'icons/256x256.png');
  const win = new BrowserWindow(Object.assign({icon}, getConfig().boundaryPosition));

  win.loadURL(`file://${__dirname}/index.html`);

  win.on('close', (e) => {
    const config = getConfig();
    config.boundaryPosition = win.getBounds()
    setConfig(config);
    if (!quit) {
      e.preventDefault();
      mainWindow.hide();
    }
  })

  return win;
}

function getConfig() {
  const config_path = path.join(app.getPath('userData'), 'config');
  let config;

  try {
    const file = fs.readFileSync(config_path);
    config = JSON.parse(file);
  } catch(e) {
    config = {notificationMode: 'never'};
  }

  return config;
}

function setConfig(config) {
  const config_path = path.join(app.getPath('userData'), 'config');
  fs.writeFileSync(config_path, JSON.stringify(config));
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
  mainWindow.show();
});

app.on('before-quit', function (e) {
  quit = true;
});

app.on('ready', () => {
  mainWindow = createMainWindow();

  ipcMain.on('setNotificationMode', (event, mode) => {
    const config = getConfig();
    config.notificationMode = mode;
    setConfig(config);
  });

  ipcMain.on('getNotificationMode', (event, _) => {
    const config = getConfig();
    event.returnValue = config.notificationMode;
  });

  ipcMain.on('totalUnreadMessagesCount:updated', (_, unreadCount) => {
    app.setBadgeCount(unreadCount);
  });

  ipcMain.on('showMainWindow', (event) => {
    if (mainWindow && !mainWindow.isVisible()) {
      mainWindow.show();
      event.returnValue = true;
    }
    event.returnValue = false;
  });
});
