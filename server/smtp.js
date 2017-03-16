Meteor.startup(function () {
  smtp = {
    username: 'iprof',   
    password: 'Pks@ipf8#',   
    server:   'smtp.falconide.com',  
    port: 25
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' 
  + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' 
  + smtp.port;
});



