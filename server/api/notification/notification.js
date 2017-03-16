var Api = new Restivus({
    apiPath: 'notification',
    useDefaultAuth: false,
    prettyJson: true
  });
  
  	Api.addRoute('getNotifications', {
		post: function () { 
			var params = this.bodyParams;  
			
            var user_id = parseInt(params.userId);
            var user_id_check = Validator.isNull(user_id);
			
            var token = params.token;
            var token_check = Validator.isNull(token);
			
            if (!user_id_check && !token_check ) {
                var flag = Meteor.call('validateToken', user_id, token);
                if (flag){

                    var data = Meteor.call("notification", user_id);
                    if (data&&data.length>0) {
                       var response ={
						"status": true,
						"result_data": data
					}
                    }else{
					var response ={
						"status": false,
						"message": "No Notification Found"
					}
                    }
                }
				else{ //if token is not validated
						var response ={
							"status": false,
							"message": "Invalid user!"	
						};
				}
            }
			else{
				var response ={ // if parameters are not passed correctly
					"status": false,
					"message": "Invalid params!"	
				};
			}
			return response;
		} 
    });
    
    Api.addRoute('setNotificationAsRead', {
		post: function () { 
			var params = this.bodyParams;  
			console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
			var user_id = parseInt(params.userId);
            var user_id_check = Validator.isNull(user_id);
			
			var token = params.token;
            var token_check = Validator.isNull(token);
			
			if (!user_id_check && !token_check ) {
                var flag = Meteor.call('validateToken', user_id, token);
                if (flag){
                     var flag = Meteor.call('setNotificationAsRead', user_id, params.notificationId);
                  var response ={
							"status": true,
							"message": "Notification Read Successfully"	
						};  
                }
				else{ //if token is not validated
						var response ={
							"status": false,
							"message": "Invalid Token!"	
						};
				}
            }
			else{
				var response ={ // if parameters are not passed correctly
					"status": false,
					"message": "Invalid params!"	
				};
			}
			return response;
		} 
    });
    