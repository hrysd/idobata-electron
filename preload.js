(function(){
  var onMessageCreated = function(user, store) {
    return function(data) {
      store.find('message', data.message.id).then(function(message) {
        var title = message.get('senderName');

        new Notification(title, {
          body: message.get('bodyPlain'),
          icon: message.get('senderIconUrl')
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
