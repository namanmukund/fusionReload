var Api = new Restivus({
    apiPath: 'lms',
    useDefaultAuth: false,
    prettyJson: true,
	defaultHeaders: {
      "Content-Type":"application/json",
	  "charset":"UTF-8"
    }
});


Api.addRoute('getMyCoursesListingLms', {
    post: function () {
	console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
	var param = this.bodyParams;
	if(!Validator.isNull(param.userId)){
		var result = Meteor.call('getMyCoursesListingLms',param.userId);

		if(result){

			return {
				"status":true,
				"result_data":result
			}

		}else{
			return {
				"status":false,
				"message":"No data to show!!!"
			};
		}
	}else{
		return {
				"status":false,
				"message":"Invalid param!!!"
			};
	}


	 }
});
