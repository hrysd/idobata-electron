(() => {
  function onMessageCreated(session, store, router) {
    return (data) => {
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

        const notification = new Notification(title, {
          body: bodyPlain,
          icon: message.get('senderIconUrl')
        });

        notification.addEventListener('click', () => {
          if (!router.isActive('main')) { return };

          router.transitionTo('room', room);
        });
      });
    };
  }

  window.addEventListener('ready.idobata', (e) => {
    const container = e.detail.container;

    const pusher  = container.lookup('pusher:main');
    const session = container.lookup('service:session');
    const store   = container.lookup('service:store');
    const router  = container.lookup('router:main');

    pusher.bind('message:created', onMessageCreated(session, store, router));
  });
})();
