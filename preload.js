const {ipcRenderer} = require('electron');

(() => {
  function onEventReceived(session, store, router) {
    return (messageEvent) => {
      const {data, type} = JSON.parse(messageEvent.data);

      if (type !== 'message:created') { return; }

      store.find('message', data.message.id).then((message) => {
        const isSameId = message.get('senderId') === Number(session.get('user.id'));
        const byHuman  = message.get('senderType') === 'User';

        if (isSameId && byHuman) { return; }

        const room  = message.get('room');
        const title = `${message.get('senderName')} > ${room.get('organization.slug')} / ${room.get('name')}`;

        const bodyPlain = ((body) => {
          let tmp = document.createElement('div');

          tmp.innerHTML = body;

          return tmp.textContent.replace(/ +/g, ' ').replace(/\n/g, '');
        })(message.get('body'));

        const currentMode = ipcRenderer.sendSync('getNotificationMode');

        if (isNotify(currentMode, message, session.user)) {
          const notification = new Notification(title, {
            body: bodyPlain,
            icon: message.get('senderIconUrl')
          });

          notification.addEventListener('click', () => {
            if (!router.isActive('main')) { return };
            
            ipcRenderer.sendSync('showMainWindow');
            router.transitionTo('room', room);
          });
        }
      });
    };
  }

  function isNotify(mode, message, user) {
    switch (mode) {
      case 'all':
        return true;
      case 'mention':
        return message.mentioned(user);
      case 'never':
        return false
    }
  }

  window.addEventListener('ready.idobata', (e) => {
    const container = e.detail.container;
    const stream    = container.lookup('service:stream');
    const session   = container.lookup('service:session');
    const store     = container.lookup('service:store');
    const router    = container.lookup('router:main');

    function sleep(millisec) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, millisec);
      });
    }

    // NOTE: この時点ではユーザを取ることができない
    session.addObserver('user.totalUnreadMessagesCount', (session) => {
      ipcRenderer.send('totalUnreadMessagesCount:updated', session.get('user.totalUnreadMessagesCount'));
    });

    sleep(1000).then(() => {
      stream.on('event', onEventReceived(session, store, router));
    });
  });
})();
