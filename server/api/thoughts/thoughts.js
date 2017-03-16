var Api = new Restivus({
     apiPath: 'config',
    useDefaultAuth: false,
    prettyJson: true
  });

Api.addRoute('index', {
      get: function () {   
       
   console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
				var params = this.bodyParams; /* reading bodyParams */
                var isUserId=Validator.isNull(params.userId);
                var isToken=Validator.isNull(params.token);
                
       //  if(!isUserId && !isToken){ 
		 var flag=true//Meteor.call('validateToken',isToken,isUserId);
		// if(flag){
		 var obj={"enc_key": "MfiOcoLB+6hGyGckiTGOa5TtY9v8\/WEfpthW+Zw8l9I=",
		"payu_wallet": "1% discount",
		"paytm_wallet": "",
		"mobikwik_wallet": "",
		"ispaytmshow": "true",
		"ispayushow": "true",
		"is_add_status": false,
	"is_guest_user_login": true,
	"add_url": "http:\/\/globalapi.schoolera.com\/app\/webroot\/v9\/ad.html",
	"add_default_time": "5000",	
	"policy_content": "iProf App delivers an unprecedented mobile customer experience by turning Android smartphones into Virtual learning destinations connecting students and teachers. Students can take assessments, join discussion forums, clear doubts and consume study materials by India's best teachers. It's an equally empowering tool for teachers which allows them to connect with new students and publish courses.\r\n                               Visit our Website:\r\n                     http:\/\/iprofindia.com\/mobileapp\/ ",
	"policy_url": "http:\/\/www.iprofindia.com\/return-cancellation-policy\/",
	"show_rating": 100,
	"subsPopupMessage":"Get Unlimited Access, Starting Rs 999 only! \n Use Code INTRO50 for the Introductory prices!",
	"subsAlreadyPopupMessage":"Renew your subscription, Starting Rs 999 only!  Use Code INTRO50 for the Introductory prices!",
	"subscriptionHint":"Hint: Use INTRO50 to avail 50% discount on subscription."
	}
	;
return {status:"true", "result_data":obj};
		 }
		
      
    });
	// Version Update API
	Api.addRoute('versionUpdateCheck', {
      post: function () {
	  console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
	  	var params = this.bodyParams; /* reading bodyParams */
                var isUserId=Validator.isNull(params.userId);
                var isToken=Validator.isNull(params.token);
            
         if(!Validator.isNull(params.apk_version)){
		  var clientVersion =params.apk_version;  
		  var updateFlag=false;
		 if(clientVersion<81){
		 updateFlag=true;
		 }
		 var obj={	
		"upgrade_available": updateFlag,
		"text": "Update Required! A new version of App is available now.",
		"latest_version": 81,
		"url": "https:\/\/118896.api-04.com\/serve?action=click&publisher_id=118896&site_id=76812&offer_id=341370",
		"forceUpgrade": "0",
		"message": "Information saved successfully!"
		}
	;
		return {status:"true", "result_data":obj};
		 }
		 }
	  
    });