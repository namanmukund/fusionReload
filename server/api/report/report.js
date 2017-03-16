Router.route('/csv', {
  where: 'server',
  action: function () {
        var data = Users.find({"email":"gupta.disha25@gmail.com"}).fetch();
		var fields = [
		{
			key: 'name',
			title: 'Name'
		},{
			key: 'email',
			title: 'Email'
		},{
			key: 'subscription_expiry_date',
			title: 'Subscription Expiry Date'
		},{
			key: 'source',
			title: 'Source'	
		}
	];
	var title = 'UsersReport';
	var file = Excel.export(title, fields, data);
	var headers = {
    'Content-type': 'application/vnd.openxmlformats',
    'Content-Disposition': 'attachment; filename=' + title + '.xlsx'
  };
    this.response.writeHead(200, headers);
    return  this.response.end(file, 'binary');
  }
});