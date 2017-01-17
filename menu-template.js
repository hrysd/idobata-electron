module.exports.getTemplate = (currentMode) => {
  function isChecked(mode) { return currentMode == mode }
  function onClick(mode) { return () => { ipcRenderer.send('setNotificationMode', mode); } }

  return [
    {
      label: 'idobata-electron',
      submenu: [
        {
          role: 'about' // only macOS
        },
        {
          type: 'separator'
        },
        {
          label: 'Notification',
          submenu: [
            {
              label: 'All messages',
              type: 'radio',
              checked: isChecked('all'),
              click: onClick('all')
            },
            {
              label: 'Mentions',
              type: 'radio',
              checked: isChecked('mention'),
              click: onClick('mention')
            },
            {
              label: 'Never',
              type: 'radio',
              checked: isChecked('never'),
              click: onClick('never')
            }
          ]
        },
        {
          type: 'separator'
        },
        {
          role: 'services', // only macOS
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide' // only macOS
        },
        {
          role: 'hideothers' // only macOS
        },
        {
          role: 'unhide' // only macOS
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'pasteandmatchstyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click() { remote.getCurrentWindow().reload(); }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click() { remote.getCurrentWindow().toggleDevTools(); }
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        }
      ]
    },
    {
      role: 'window', // only macOS
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'zoom' // only macOS
        },
        {
          role: 'close'
        },
        {
          type: 'separator'
        },
        {
          role: 'front' // only macOS
        }
      ]
    },
    {
      role: 'help', // only macOS
      submenu: [
        {
          label: 'Learn More',
          click() {
            require('electron').shell.openExternal('https://github.com/hrysd/idobata-electron');
          }
        }
      ]
    }
  ];
}
