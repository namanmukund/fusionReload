

var Api = new Restivus({
    apiPath: 'subscription',
    useDefaultAuth: false,
    prettyJson: true
  });
var lmsIP=Meteor.settings.lmsIP;//"10.10.17.210";
Api.addRoute('subscriptionPlans', {
      post: function () { 
	  //logger = Meteor.require('winston');
	  //logger.info('Request::', JSON.stringify(this.bodyParams));

   console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
   
   this.urlParams
         subs= Subscriptions.find().fetch(); 
		 //var flag=Meteor.call('validateToken',232323,0);
		 
		 var response={status:"true", result_data:{subscriptions:subs}};
		
		console.log("Response Send::"+JSON.stringify(response)+"##OF Request URL::"+this.request.url)	;
		
		return response
      }
    });

Api.addRoute('tests', {
      post: function () {
         var para = this.bodyParams;
     return Meteor.call('validateToken',"jBrjdAMco2DjJSDZ5",17);    


return Meteor.call('autoIncrement');
     // return  Packages.find({"status":1 , 
       //           "package_program.course.subject.55._id": "147"  }).fetch();
//return Meteor.call('getWallCountData',["55"],["142","147"]);
//return Meteor.call('getCourseList',[13]);
//return Meteor.call('getSubjectList',[24,25,26]);
//var str="3753034";
//return Meteor.call('getPackageChapter',str);
//return Users.update({"id":parseInt(para.id)}, {$push: {  purchased_chapters: 18}});
//return Users.find({"id":0}).fetch();
//var data=[46399, 54297]; //QuestionMasters

var dataC=[1050,10500]; //course
var dataS=[534]; //subject

var dataTs=[47902];
//var data=3752085; //subject

//return Meteor.call('getQuestions',data.map(String));
//return Meteor.call('getCourseList',data.map(String));
//return Meteor.call('getSubjectList',data.map(String));
//

//return Meteor.call('getTestSubjectList',dataTs.map(String));getTrendingCourses
//return Meteor.call('getTrendingCourses',[529],1);




//return QuestionMasters.find({}).fetch();
         }
    });
	
	//Start save Subscription API
	Api.addRoute('saveSubscription', {
      post: function () { 
console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))  
     var params = this.bodyParams; /* reading bodyParams */
var userId=params.userId;
var token=params.token;
var subsid=params.subsId;
var validity=params.validity;
var remainingDays=params.currentDaysRemaining;//now it is handled on server side not from params
var subsSource=params.source;
if(Validator.isNull(subsSource)){
subsSource="app";
}
if(!Validator.isNull(params.userId)&&!Validator.isNull(params.subsId)&&!Validator.isNull(params.validity)){
if(Validator.isNull(remainingDays)){
remainingDays=0;
}
//Get validity date  by subsID and vality id
var pipeline = [{
                $unwind: '$Validity'
            }, {
                $match: {
                    $and: [

                        {
                            "subscription_id": parseInt(subsid)
                        },{
                            "Validity.validityId": validity
                        }
                    ]
                },

            }, {
                $project: {
                    "_id": 0,
                    "Validity.validityDays": 1

                }
            }
        ];
var subsDays=Subscriptions.aggregate(pipeline);//.find({"subscription_id":parseInt(subsid),"Validity.validityId":validity}).fetch();
console.log("subsDays=="+JSON.stringify(subsDays));
//return subsDays;
var validityDays=0;
validityDays=subsDays[0]["Validity"]["validityDays"];
console.log("validityDays=="+validityDays);

//Get User subscription remaining days
var userInfo=Users.find({"id":parseInt(userId)},{fields:
                        {"id":1,"subscription_expiry_date":1,
                    "subscription_validity":1
                    }
                    
                }).fetch();
                    var	subscriptionRemainingDays=0;
                    if (userInfo&&userInfo.length>0&&userInfo[0]["subscription_expiry_date"]) { //Means User already has subscription
                        //code
                        //If User want free trial again ,So No need to update expiry date in case of free trial Subscription
                        if(!Validator.isNull(params.validity)&&params.validity==4){
                                return {
                                status: false,
                                message: "You have already availed 7-day FREE Trial. Use INTRO50 & get 50% discount on iProf Subscription."
                            };
                        }
                        var expiryDate=userInfo[0]["subscription_expiry_date"];
                        console.log("expiryDate=="+expiryDate);
                        var date1 = new Date();
						date1 = new Date(date1.setMinutes(date1.getMinutes() + 330));
						 var retVal = Meteor.call('returnDays', date1, expiryDate);						 
						subscriptionRemainingDays=retVal;
                    console.log("SubscriptionRemainingDays from DB=="+subscriptionRemainingDays);
                }
 
validityDays=parseInt(validityDays)+parseInt(subscriptionRemainingDays); //Adding RemainingDays also
var date=new Date();
date=new Date(date.setMinutes(date.getMinutes() + 330));
 date = new Date(date.setTime(date.getTime() + validityDays*24*60*60*1000));
 
 var currentDate=new Date();
 currentDate=new Date(currentDate.setMinutes(currentDate.getMinutes() + 330));
 
//date=date.setTime((date.getTime())+24*60*60*1000);
	 var response=Users.update({"id":parseInt(userId)},{$set:{"subscription_plan":parseInt(subsid),"subscription_taken_date":currentDate,"subscription_expiry_date":date,"subscription_validity":params.validity,"subscription_source":subsSource}},{ upsert: false });
console.log("Response=="+JSON.stringify(response));
if(response==1){
if(parseInt(params.validity)==4){//Free trial facility is not available for now
return {status: false, "message": "This facility is not available for now"};
/*
//Send mail in case of free Trial subs
var user=Users.find({"id":parseInt(params.userId)}).fetch();
//return user;
var name=user[0]["name"];
var email=user[0]["email"];
Meteor.setTimeout(function(){           
                    HTTP.call("POST","http://"+lmsIP+"/Marketing/sendFreeTrialMail",
                      {params: {
                        "result": "json",
                        "name": name,
                        "email": email,
                        "start_date": new Date(),
                        "end_date": date                      
                                                    
                      }}
                  );
                    console.log("preftimeout");
      
	  }, 7000); 
	  */
	}		
	
return {status: true, "message": "Subscription Added "};
//console.log("Response Send::"+response+"##OF Request URL::"+this.request.url)	;
}else{
return {status: false, "message": "Subscription can not added"};
}
}else{
return {status: false, "message": "Invalid token"};

}	 

//return response; 
	 
	 

     } 
    });