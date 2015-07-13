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
          var roomUrl = '/' + router.generate('room.index', message.get('room'));
          var roomName = message.get('room.organization.name').toString() + ' / ' + message.get('room.name').toString();
          var payload = {
            sender: data.message.senderName,
            roomName: roomName,
            text: data.message.bodyPlain,
            iconUrl: data.message.senderIconUrl,
            url: roomUrl
          };
          new Notification(JSON.stringify(payload));
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
