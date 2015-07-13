(function(){
  var onMessageCreated = function(user, store) {
    return function(data) {
      store.find('message', data.message.id).then(function(message) {
        var title = data.message.senderName;
        new Notification(title, {
          body: data.message.bodyPlain,
          icon: data.message.senderIconUrl
        });
      });
    }
  };

  window.addEventListener('ready.idobata', function(e) {
    var container = e.detail.container;
    var pusher = container.lookup('pusher:main');
    var user   = container.lookup('service:session').get('user.id');
    var store  = container.lookup('store:main');

    pusher.bind('message:created', onMessageCreated(user, store));
  });
})();
