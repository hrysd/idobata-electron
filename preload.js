(function(){  
  var onMessageCreated = function(user, store, router) {
    return function(data){
      var notify = false;
      var mode = 'all'; 
      if (mode == 'all') {
        notify = true;
      } else if (mode == 'mention') {
        if (data.message.mentions.indexOf(parseInt(user.get('id'))) >= 0) {
          notify = true;
        }
      }
      if (notify) {
        store.find('message', data.message.id).then(function(message) {
          var title = data.message.senderName;
          new Notification(title, {
            body: data.message.bodyPlain,
            icon: data.message.senderIconUrl
          })
        });
      }
    }
  };
  window.addEventListener('ready.idobata', function(e) {
    var container = e.detail.container;
    
    var pusher = container.lookup('pusher:main');
    var user   = container.lookup('service:session').get('user');
    var store  = container.lookup('store:main');
    var router = container.lookup('router:main');
    
    pusher.bind('message:created', onMessageCreated(user, store, router));
  });
})();
