'use strict'

const app = require('app');
const BrowserWindow = require('browser-window');

require('crash-reporter').start();

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  let mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadUrl(`file://${__dirname}/index.html`);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
