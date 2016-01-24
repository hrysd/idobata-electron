(function(){
  var onMessageCreated = function(user, store) {
    return function(data) {
      store.find('message', data.message.id).then(function(message) {
        var title = message.get('senderName');

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
      });
    }
  };

  window.addEventListener('ready.idobata', function(e) {
    var container = e.detail.container;
    var pusher = container.lookup('pusher:main');
    var user   = container.lookup('service:session').get('user.id');
    var store  = container.lookup('service:store');

    pusher.bind('message:created', onMessageCreated(user, store));
  });
})();
