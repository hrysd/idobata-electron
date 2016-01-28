(function(){
  var onMessageCreated = function(session, store) {
    return function(data) {
      store.find('message', data.message.id).then(function(message) {
        var room  = message.get('room'),
            title = message.get('senderName') + ' > ' + room.get('organization.slug') + ' / ' + room.get('name');

        var isSameId = message.get('senderId') === Number(session.get('user.id')),
            byHuman  = message.get('senderType') === 'User';

        if (isSameId) {
          if (byHuman) return;
        } else {
          notification = new Notification(title, {
            body: message.get('bodyPlain'),
            icon: message.get('senderIconUrl')
          });

          notification.addEventListener('click', function() {
            var app = Ember.Namespace.NAMESPACES.find(function(a) {
              return a instanceof Ember.Application;
            });

            var router = app.__container__.lookup('router:main');

            if (!router.isActive('main')) return;

            router.transitionTo('room', message.get('room'));
          });
        }
      });
    }
  };

  window.addEventListener('ready.idobata', function(e) {
    var container = e.detail.container;

    var pusher  = container.lookup('pusher:main'),
        session = container.lookup('service:session'),
        store   = container.lookup('service:store');

    pusher.bind('message:created', onMessageCreated(session, store));
  });
})();
