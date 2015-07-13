(function(){
  window.addEventListener('ready.idobata', function(e) {
    var container = e.detail.container;

    var pusher = container.lookup('pusher:main');
    var user   = container.lookup('service:session').get('user');
    var store  = container.lookup('store:main');
    var router = container.lookup('router:main');
  });
})();
