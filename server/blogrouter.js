//Router.route('/iit/about', {
//    template: 'about'
//});

//WebApp.connectHandlers.stack.splice(0, 0, {
//  route: '/iit/about',
//  handle: function(req, res, next) {
//    res.writeHead(302, {
//      'Location': 'http://iprofindia.com',
//    });
//    res.end();
//  },
//});

Router.route('/blog/', function() {
  this.response.writeHead(301, {
    'Location': "http://blog.iprofindia.com",
  });
  this.response.end();
}, {where: 'server'});

Router.route('/blog/:slug', function() {
    var slug= this.params.slug;
  this.response.writeHead(301, {
    'Location': "http://blog.iprofindia.com/" +slug,
  });
  this.response.end();
}, {where: 'server'});

Router.route('/blog/:slug/:slug1', function() {
    var slug= this.params.slug;
    var slug1= this.params.slug1;
    this.response.writeHead(301, {
    'Location': "http://blog.iprofindia.com/" +slug+'/'+slug1,
  });
  this.response.end();
}, {where: 'server'});
