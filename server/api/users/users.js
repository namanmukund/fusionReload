var Api = new Restivus({
    apiPath: 'user',
    useDefaultAuth: false,
    prettyJson: true
});

var lmsIP=Meteor.settings.lmsIP;//"10.10.17.210";
var stagingUrl=Meteor.settings.meteorPublicIp;//"http://tdlv3qa.iprofindia.com/users/verifyPassword/"; 


//Users registration API 
//api url : http://localhost:3000/users/userRegistration 
Api.addRoute('userRegistration', {
    post: {
        action: function() {
            console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
            var param = this.bodyParams;

            var countEmail = Users.find({
                "email": param.email
            }).count();

            /*include the following package for validation: "meteor add servicelocale:meteor-server-validator"*/
            var checkEmail = Validator.isEmail(param.email);
			var activateTrial=Validator.isNull(param.activateTrial);
            var isEmail = Validator.isNull(param.email);


            var Mobile = parseInt(param.mobile);

            var checkMobile = Validator.isNumeric(Mobile);
            var checkMobLen = Validator.isLength(param.mobile, 10, 10);
            var isMobile = Validator.isNull(param.mobile);
            // var isUserType = Validator.isNull(param.userType);

            var isName = Validator.isNull(param.name);
            var checkName = Validator.isLength(param.name, 3, 30);

            var isGuestUserId = Validator.isNull(param.guestUserId);
			
			

			var lmsId="";
			var source="";

			if(Validator.isNull(param.lmsId)){
			lmsId=param.userId;			
			}else{
			lmsId=param.lmsId;	
			}
			if(Validator.isNull(param.source)){
			source="app";			
			}else{
			source=param.source;
			}
            //return checkMobile;

            //return param;

            var mob="";
            var countMobile=0;
            if (!isMobile && checkMobile && checkMobLen) {
                 mob = parseInt(param.mobile);
                   countMobile = Users.find({
                "mobile_no": parseInt(param.mobile)
            }).count();
                   console.log("countMobile==",countMobile)
                   if(countMobile>0){
                    //Means already a user has this no. in DB
                                        return {
                                status: false,
                                message: "This mobile number is already used in registration with other user."
                            };
                   }
            } else {
                 mob = "";
            }

            if (param.userType == "student") {
                var role = 12;
            } else {
                var role = "";
            }
            // console.log("mob"+mob);
            // console.log("countEmail"+countEmail);

            console.log("checkMobLen",checkMobLen);                     
            if (countEmail == 0) {
                
                var created = new Date();
                created = new Date(created.setMinutes(created.getMinutes() + 330));

                if (param.mode == "1") {
                    /* users_count to check whether users alredy exist or not*/

                    var isPassword = Validator.isNull(param.password);
                    var checkPasword = Validator.isLength(param.password, 6, 40);
                    var hPassword = Meteor.call('hash', param.password)






                    //inserting the value in collection if user has inputed the mobile no.
                    if (checkEmail && !isEmail && !isPassword && checkPasword && !isName && checkName) {

                        // console.log("mode1");
                        var userId = Meteor.call('autoIncrement');
                        //var userId=4000000;
                      //  var phone=Users.find({"mobile_no":parseInt(mob)}).count();

                if(!isMobile && checkMobile && checkMobLen){
                    //if(phone==0){
                  console.log("isGuestUserId",isGuestUserId);      
                    if(isGuestUserId){   
                        Users.insert({
                            "id": userId,
                            //  "registrationId": param.registrationId, 
                            //  "gaid": param.Gaid, 
                            //  "flow": param.Flow, 
                            "password": hPassword,
                            "created": created, 
                            "role": role,
                            "mode": param.mode,
                            "email": param.email,
                            "name": param.name,
                            "longitude": parseFloat(param.longitude),
                            "latitude": parseFloat(param.latitude),
                            "device_id": param.deviceId,
                            "mobile_no": parseInt(mob),
                            "gen_id":param.gen_id,
							"lms_id":lmsId,
							"source":source
                        });

                        var info = Users.findOne({
                            "email": param.email
                        });
                    }else{

                       var hey= Users.update(

                        {"id": parseInt(param.guestUserId)},
                            //  "registrationId": param.registrationId, 
                            //  "gaid": param.Gaid, 
                            //  "flow": param.Flow,
                        {"$set":{ 
                            "password": hPassword,
                            "created": created, 
                            "role": role,
                            "mode": param.mode,
                            "email": param.email,
                            "name": param.name,
                            "longitude": parseFloat(param.longitude),
                            "latitude": parseFloat(param.latitude),
                            "device_id": param.deviceId,
                            "mobile_no": parseInt(mob),
                            "gen_id":param.gen_id,
                            "lms_id":lmsId,
                            "source":source
                        }   
                    });
                       console.log("hey",hey);

                        var info = Users.findOne({
                            "email": param.email
                        });
                        console.log("info",info);

                    }
                   // }else{
                     //   return {
                    //status: false,
                    //message: "Duplicate mobile number!!!"
                    //};
                    //}
                }else if(isMobile){

                    if(isGuestUserId){   
                        Users.insert({
                            "id": userId,
                            //  "registrationId": param.registrationId, 
                            //  "gaid": param.Gaid, 
                            //  "flow": param.Flow, 
                            "password": hPassword,
                            "created": created, 
                            "role": role,
                            "mode": param.mode,
                            "email": param.email,
                            "name": param.name,
                            "longitude": parseFloat(param.longitude),
                            "latitude": parseFloat(param.latitude),
                            "device_id": param.deviceId,
                            // "mobile_no": parseInt(mob),
                            "gen_id":param.gen_id,
                            "lms_id":lmsId,
                            "source":source
                        });

                        var info = Users.findOne({
                            "email": param.email
                        });
                    }else{

                        Users.update(

                        {"id": parseInt(param.guestUserId)},
                            //  "registrationId": param.registrationId, 
                            //  "gaid": param.Gaid, 
                            //  "flow": param.Flow,
                        {"$set":{ 
                            "password": hPassword,
                            "created": created, 
                            "role": role,
                            "mode": param.mode,
                            "email": param.email,
                            "name": param.name,
                            "longitude": parseFloat(param.longitude),
                            "latitude": parseFloat(param.latitude),
                            "device_id": param.deviceId,
                            // "mobile_no": parseInt(mob),
                            "gen_id":param.gen_id,
                            "lms_id":lmsId,
                            "source":source
                        }   
                    });


                        var info = Users.findOne({
                            "email": param.email
                        });
                    }

                }else{
                    return {
                    status: false,
                    message: "Invalid Params!!!"
                    };
                }



                    }
                } 
                else if (param.mode == "2") {
                    var isFbId = Validator.isNull(param.fbId);




                    //inserting the value in collection if user has inputed the mobile no.
                    if (!isFbId && checkEmail && !isEmail && !isName) {

                        // console.log("mode2");

                        var userId = Meteor.call('autoIncrement');

                        Users.insert({
                            "id": userId,
                            "fb_id": param.fbId,
                            //      "registrationId": param.registrationId, 
                            //      "gaid": param.Gaid, 
                            //      "flow": param.Flow,
                            "created": created, 
                            "role": role,
                            "mode": param.mode,
                            "email": param.email,
                            "name": param.name,
                            "longitude": parseFloat(param.longitude),
                            "latitude": parseFloat(param.latitude),
                            "device_id": param.deviceId,
                            "gen_id":param.gen_id,
							"lms_id":lmsId,
							"source":source
                        });


                        var info = Users.findOne({
                            "email": param.email
                        });
                    }


                    //console.log('FBFBFBFFBB');
                } 
                else if (param.mode == "3") {
                    var isGoogleId = Validator.isNull(param.googleId);



                    if (!isGoogleId && checkEmail && !isEmail && !isName) {


                        // console.log("mode3");
                        var userId = Meteor.call('autoIncrement');
                        Users.insert({
                            "id": userId,
                            "google_id": param.googleId,
                            //   "registrationId": param.registrationId, 
                            //   "gaid": param.Gaid, 
                            //   "flow": param.Flow,
                            "created": created,
                            "role": role,
                            "mode": param.mode,
                            "email": param.email,
                            "name": param.name,
                            "longitude": parseFloat(param.longitude),
                            "latitude": parseFloat(param.latitude),
                            "device_id": param.deviceId,
                            "gen_id":param.gen_id,
							"lms_id":lmsId,
							"source":source
                        });


                        var info = Users.findOne({
                            "email": param.email
                        });
                    }
                }
                else{
                    return {
                    status: false,
                    message: "Wrong mode entered!!!"
                    }; 
                }


                if (info) {
                    Meteor.call('generateToken', info["id"]);
                    var token = Meteor.call('getToken', info["id"]);

                    // console.log(token);


                    if (info["pic"]) {
                        var pic = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/" + info["pic"];
                    } else {
                        var pic = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/" + 'avtaar.png';
                    }

//Force Free Trial for new user at Registration
					 var isFreeTrial=false;
			var showTrialDialog=false;
			if(!activateTrial&&param.activateTrial=='true'){
                
               var isUserHaveFreeTrialSubscription= Meteor.call('isFreeTrialSubscription',param.email);
               
               if (!isUserHaveFreeTrialSubscription) {
                //code               
						Meteor.call('forceFreeTrialSubscription',param.email); 
						showTrialDialog=true;
               }else{       //User want free trial again ,So No need to update expiry date in case of free trial Subscription
                //Return already free subscription taken
				showTrialDialog=false;
                //return {
                  //      status: false,
                    //     message: "You have already availed 7-day FREE Trial. Use INTRO50 & get 50% discount on iProf Subscription."
                    //};
               }
					}
                    var response = {

                        "user_id": info["id"],
                        "message": "You have successfully registered with us! Happy learning :)",
                        "token": token,
                        "is_benefit_visited":"1",
                        "show_subscription":true,
						"showTrialDialog":showTrialDialog,
                        "personal": {
                            "name": info["name"],
                            "email": info["email"],
                            "image": pic,
                            "mobile_no": info["mobile_no"],
							"address":info["address"],
							"schoolName":info["school_name"],
							"about_us":info["about_us"],
							"qualification":info["qualification"]
                        }
                    }

///////////////////////////////////////////////////////////////////////////////////////////

var lmsUser=info;
console.log("lmsUser",lmsUser["name"]);
            // return lmsUser;
            console.log("API Called ==="+"http://"+lmsIP+"/users/createUser");
 // Meteor.setTimeout(function(){           
                var lmsResponse=HTTP.call("POST", "http://"+lmsIP+"/users/createUser",
                      {params: {
                          "result" : "json",
                          "mongo_id":lmsUser["id"],
                          "username" : lmsUser["name"],
                          "email" : lmsUser["email"],
                          "role": 12,
                          "userphone":lmsUser["mobile_no"],
                          "source":"App",
                          "gen_id":lmsUser["gen_id"],
                          "device_id":lmsUser["device_id"] 
                      }}
                  );
                  console.log("API Called=="+"http://"+lmsIP+"/users/createUser");
                    console.log("timeout");
              // }, 17000);
////////////////////////////////////////////////////////////////////////////////////////////////
                    console.log("lmsResponse",JSON.stringify(JSON.parse(lmsResponse.content)));
                    var parsedRes=JSON.parse(lmsResponse.content);
                    console.log("parsedRes",parsedRes["status"]);
                   if(parsedRes["status"]=="true") { 								
                    return {
                        status: true,
                        result_data: response
                    };
                }else{
                    Users.remove({"id":parseInt(userId)});
                    return {
                        status: false,
                        message: "Something went wrong. Please try again."
                    };
                }

                }
                else {
                    
                    return {
                        status: false,
                        message: "Unable to Add"
                    };
                }
            } /////ending line for countemail==0 
            else {
                return {
                    status: false,
                    message: "Duplicate user"
                };
            }
        
        
        
    }
    }
});

/**********************************************************************************************************************/


Api.addRoute('login', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams;
        ////////////////////Validations
        var checkEmail = Validator.isEmail(param.email);
        var isEmail = Validator.isNull(param.email);
        var isMode = Validator.isNull(param.mode);
        var isPassword = Validator.isNull(param.password);
		var activateTrial=Validator.isNull(param.activateTrial);
        console.log("param.activateTrial"+param.activateTrial);
		 console.log("lmsIP=="+lmsIP);
		

        if (checkEmail && !isEmail && !isMode && !isPassword) {
            var hpassword = Meteor.call('hash', param.password);
//             console.log("hpassword"+hpassword);

        }

        var userDetails = Users.findOne({
            "email": param.email
        });
        if (param.mode == "1") {
            var userDetails = Users.findOne({
                "email": param.email,
                "password": hpassword
            });
        } else {
            var userDetails = Users.findOne({
                "email": param.email
            });
        }


        if (userDetails) {
            
            var notification_count = Meteor.call('new_notification_count',userDetails["id"]);
            var cart_item_count = Meteor.call('getCartCount',userDetails["id"]);  

          // console.log("subscrition_plan",userDetails["subscription_plan"]);
          if(userDetails["is_benefit_visited"]!= null && userDetails["is_benefit_visited"]!= ''){
              var is_benefit_visited = userDetails["is_benefit_visited"];
          }else{
               var is_benefit_visited = "1";
          }
          //if latitude and longitude exists for calculating tutor_count
            if(userDetails["longitude"] && userDetails["latitude"]){
                var latitude1 = parseFloat(userDetails["longitude"]);
                var longitude1 =  parseFloat(userDetails["latitude"]);
                if(latitude1!=null && longitude1!=null && latitude1!='' && longitude1!='' && latitude1!=0 && longitude1!=0){
                    var tutor_count = 0;
                    Meteor.setTimeout(function(){var tutor_count = Meteor.call('getTutorsCount',latitude1,longitude1,userDetails["id"]);}, 17000);
//                    var tutor_count = Meteor.call('getTutorsCount',latitude1,longitude1,userDetails["id"]);
                }else{
                    var tutor_count = 0;
                }  
           }else{
               var tutor_count = 0;
           }

          
            var subscription_type="unsubscribe";
						var userSubscriptionValidityId=0;
						var subscriptionRemainingDays=0;
						var userSubscriptionExpiryDate;
            if(userDetails["subscription_plan"]){
                            var plan=Subscriptions.findOne({"subscription_id":parseInt(userDetails["subscription_plan"])});
							if(plan){
                            subscription_type=plan["type"].toLowerCase();
							userSubscriptionValidityId=userDetails["subscription_validity"];
							userSubscriptionExpiryDate=userDetails["subscription_expiry_date"]
							}
                        }
						//Method call
						var date = new Date();
						date = new Date(date.setMinutes(date.getMinutes() + 330));
						 var retVal = Meteor.call('returnDays', date, userSubscriptionExpiryDate);						 
						subscriptionRemainingDays=retVal;
						console.log("subscriptionRemainingDays",subscriptionRemainingDays);
						
						//var message=

            if(userDetails["is_mobile_verified"]==1){
                                var is_mobile_verified=true;
                            }else{
                                var is_mobile_verified=false;
                            }
       


            Meteor.call('generateToken', userDetails["id"]);
            var token = Meteor.call('getToken', userDetails["id"]);


            //user_type read role
            if (userDetails["pic"]) {
                var pic = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/" +
                    userDetails["pic"];
            } else {
                var pic = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/" +
                    'avtaar.png'
            }



            if (userDetails["role"] == 12) {
                var userType = "student";
            }else if(userDetails["role"] == 11){
                var userType = "teacher";

            }else{
                var userType = "na";
            }
			var isFreeTrial=false;
			var showTrialDialog=false;
			if(!activateTrial&&param.activateTrial=='true'){
			 isFreeTrial= Meteor.call('isFreeTrialSubscription',param.email);
			if(!isFreeTrial){
			//Force Free Trial for old user
			Meteor.call('forceFreeTrialSubscription',param.email);
			showTrialDialog=true;
			}
			
			}
			var preference;
			var response;
			if(userDetails["preference"]){
            if (userDetails["preference"]["cat_id"]) {
        var subjectId=userDetails["preference"]["course"]["subject_id"];
        var gradeId=userDetails["preference"]["course"]["id"];
        var getQdData= Meteor.call('getQdData',userDetails["id"],gradeId,subjectId);
        var trendingCourses= Meteor.call('displayTrendingCourses',gradeId,subjectId,5,userDetails["id"]);
        var wallCount= Meteor.call('getWallCountData',gradeId,subjectId);
         // return wallCount;
         var funZone= Meteor.call('funZone',gradeId,subjectId,1);
         response=
            {
                "course_count":wallCount["countCourse"]+wallCount["countSubject"],
                "tutor_count": tutor_count,
                "test_count": wallCount["countCourseTest"]+wallCount["countSubjectTest"],
                "trending_courses":trendingCourses,
                "question_of_day_data": getQdData,
                "total_funzone_count":funZone["total_result_count"],
                "fun_zone":funZone["gcm_data"]
            };
         

                preference = Meteor.call('fetchPreference', userDetails["preference"]["cat_id"],
                    userDetails["preference"]["sub_cat_id"],
                    userDetails["preference"]["course"]["id"],
                    userDetails["preference"]["course"]["subject_id"]);

                
            } 
			}
			var obj = {
                    "user_id": userDetails["id"],

                    //                 "token": token,
                    // "is_guest_user": false,
                    //             "invite_url": shortUrl,
                    "user_type": userType,

                    "token": token,
                    // "is_guest_user": false,
                    // "invite_url": shortUrl,

                    "is_mobile_verified": is_mobile_verified,
                    //    "is_interested_in_tution": userDetails[0]["is_interested_in_tution"],
                    "is_email_verified": userDetails["is_email_verified"],
                    "is_benefit_visited": is_benefit_visited,
                    "cart_item_count": cart_item_count,
                    "subscription_type":subscription_type,
                    "show_subscription":true,
					"enc_key": "MfiOcoLB+6hGyGckiTGOa5TtY9v8\/WEfpthW+Zw8l9I=",
					"isFreeTrialTaken":isFreeTrial,
					"showTrialDialog":showTrialDialog,
					"subscriptionValidityId":userSubscriptionValidityId,
					"subscriptionRemainingDays":subscriptionRemainingDays,					
                    // "new_notifications_count":0,
                    // "courses_count":countDoc["count"]["countCourses"],
                    // "tests_count":countDoc["count"]["countTests"],
                    // "tutors_count":0,
                    // "subscription_type":0,
                    // "profile_precentage":0,
//                    "message_count": "5",
//                    "reminder_count": "5",
                    "notification_count": notification_count,
//                    "doubt_count": "5",
                    "personal": {
                        "email": userDetails["email"],
                        "name": userDetails["name"],
                        "image": pic,
						"mobile_no": userDetails["mobile_no"],
						"address":userDetails["address"],
						"schoolName":userDetails["school_name"],
						"about_us":userDetails["about_us"],
						"qualification":userDetails["qualification"]
                    },
                    "preference_info": preference,
                    "wall_data":response

                };


             console.log("response",obj);    

            return {
                status: true,
                result_data: obj
            };

        } else {
            return {
                status: false,
                message: "Invalid email/password!!!"
            };
        }
    }
});


/**********************************************************************************************************************/


Api.addRoute('setPreference', {
    post: {
        action: function() {
            console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
            var param = this.bodyParams; /* reading bodyParams */
            var isUserId = Validator.isNull(param.userId);
            var isToken = Validator.isNull(param.token);
            var isCategoryId = Validator.isNull(param.categoryId);
            var isSubcategoryId = Validator.isNull(param.subcategoryId);
            var isGradeId = Validator.isNull(param.gradeId);
            var isSubjectId = Validator.isNull(param.subjectId);

            //console.log("param"+param);



            if (!isUserId && !isToken && !isCategoryId && !isSubcategoryId && !isGradeId && !isSubjectId) {
            var sub_ids = (param.subjectId).split(',').map(Number);
            // console.log(sub_ids);
            // var pref_count = Users.find({
            //     "id": param.userId,
            //     "preference.cat_id": param.categoryId,
            //     "preference.sub_cat_id": param.subcategoryId,
            //     "preference.course.id": param.gradeId,
            //     "preference.course.subject_id": sub_ids
            // }).count();

            // console.log('prefe', pref_count);

            // if (pref_count == 0) {
                //console.log(sub_ids);
                var return_value = Users.update({
                    "id": parseInt(param.userId)
                }, {
                    $set: {
                        "preference.cat_id": parseInt(param.categoryId),
                        "preference.sub_cat_id": parseInt(param.subcategoryId),
                        "preference.course.id": parseInt(param.gradeId),
                        "preference.course.subject_id": sub_ids
                    }
                });

                //console.log('ret',return_value);

                if (return_value == 1) {
                    var info = "Successfully Added!";
                } else {
                    var info = "Preference already added!";
                }
            // }


            if (info) {
				console.log("API Called ==="+"http://"+lmsIP+"/Users/addPreferences");
                Meteor.setTimeout(function(){           
                    HTTP.call("POST", "http://"+lmsIP+"/Users/addPreferences",
                      {params: {
                        "result": "json",
                        "user_id": param.userId,
                        "grade_id": parseInt(param.gradeId),
                        "subject_id": sub_ids,
                        "category_id": parseInt(param.categoryId),
                        "sub_category_id":parseInt(param.subcategoryId) 
                                                    
                      }}
                  );
				   console.log("API Called=="+"http://"+lmsIP+"/Users/addPreferences");
                    console.log("preftimeout");
              }, 17000); 

                return {
                    status: true,
                    result_data: info
                };
            }
            return {
                
                    status: false,
                    message: "Unable to add successfully!!!"
                
            }
        }else{
            return {
                
                    status: false,
                    message: "Invalid Params!!!"
                
            }

        }


        }
    }
});


/*************************************************************************************************************/

/*
Api.addRoute('getUsercatAndSubCat', {
post: {
action: function() {
var param = this.bodyParams; 
var isUserId = Validator.isNull(param.userId);
var isToken = Validator.isNull(param.token);

if (!isUserId && !isToken) {
var user = Users.findOne({"_id": param.userId}, {fields: {"role": 1}});
var preference = Preferences.find({}, {fields: {"_id": 0}}).fetch();
var user_role = user.role;

if (user_role == 1) {
var info = preference;
}
}

if (info) {
return {status: true, result_data: info};
}
return{
statusCode: 400,
body: {status: false, message: "Preference not obtained !! "}
}

}
}
});

*/


Api.addRoute('getPreference', {
    post: {
        action: function() {
            console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
            var param = this.bodyParams;
            var isUserId = Validator.isNull(param.userId);
            var isToken = Validator.isNull(param.token);

            var query = PreferenceSelection.findOne({}, {
                fields: {
                    _id: 0
                }
            });
            if (query) {
                return {
                    status: true,
                    result_data: query
                };
            } else {
                return {
                    status: false,
                    message: "Invalid Request!!!"
                };
            }

        }
    }
});

Api.addRoute('IprofFuns', {
    get: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.request.query;
        var userId = Validator.isNull(param.userId);
		var funId = Validator.isNull(param.funId);
		
		console.log("fun=="+this.request.params);
		
		console.log("this.request.query=="+this.request.query);
		
		console.log("this.request.query funId=="+this.request.query.funId);
		
		
        if (!userId&&!funId) {
		
            var messageHTML=Meteor.call("getMessageHtml", parseInt(param.funId));
			//return messageHTML;
			if(messageHTML){
			var message=messageHTML[0]["message_html"];
			if(message){
			return message;
			}else{
			return {
                    status: false,
                    message: "No Data"
                };
			}
			
			}else{
			
			return {
                    status: false,
                    message: "No Message HTML"
                };
			}
        }else{
		
		return {
                    status: false,
                    message: "Invalid Request!!!"
                };
		}

    }
});


/********************************************************************************************************************/

Api.addRoute('userLogout', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams;



        // var userId = parseInt(para.user_id);
        var userCheck = Validator.isNull(param.userId);
        if (!userCheck) {
            return Meteor.call("userLogout", userId);
        }

    }
});

/********************************************************************************************************************/

Api.addRoute('changeUserPassword', {
    post: function() {
        var param = this.bodyParams;
        var userid;
		var oldPassword = param.oldPassword;
		var oldPasswordCheck = Validator.isNull(param.oldPassword);
		var newPassword = param.newPassword;
		var newPasswordCheck = Validator.isNull(param.newPassword);
		var userId = parseInt(param.userId);
		var userIdCheck = Validator.isNull(param.userId);			
		var token = param.token;
		var tokenCheck = Validator.isNull(param.token);
		var flag = Meteor.call('validateToken', userId, param.token);	//Check User Token

		if (flag) {	
        if (!oldPasswordCheck && !newPasswordCheck && !param.userIdCheck) {
			var oldPwd = Meteor.call("hash", oldPassword);
			var newPwd = Meteor.call("hash", newPassword);
            return Meteor.call("changeUserPassword",oldPwd,newPwd,newPassword,userId);
        } else {
            data = {
                "status": true,
                "message": "Invalid param!"
            };
            return data;
        }
		}
		else {
            data = {
                "status": true,
                "message": "Invalid token!"
            };
            return data;
        } 
		}
});


Api.addRoute('resetPassword', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams;
		
		var email=param.email;
		var emailCheck = Validator.isNull(param.email);
		
		
		var password = param.password;
		var passwordCheck = Validator.isNull(param.password);	

		var confirmPassword = param.confirmPassword;
		var confirmPasswordCheck = Validator.isNull(param.confirmPassword);		

		var count = Users.find({
            "email": email
        }).count();
		var data;

        if (!passwordCheck && !confirmPasswordCheck && !emailCheck) {
            data = Meteor.call("saveResetPasswordDetails",email,password,confirmPassword);
			return data;
        } else {
			if(passwordCheck || confirmPasswordCheck){
            data = {
                "status": false,
                "message": "Please enter the value"
            };
			}
            return data;
        }
    }
});


Api.addRoute('profile', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams;
        var isUserId = Validator.isNull(param.userId);
        var isToken = Validator.isNull(param.token);

        var userId = parseInt(param.userId);
        var token = param.token;
		var activateTrial=Validator.isNull(param.activateTrial);
        var count = Users.find({
            "id": userId
        }).count();
        if (count == 1) {
            if (!isUserId && !isToken) {
                var retVal = Meteor.call('validateToken', token, userId);

                //  console.log("hey");
                // console.log("retVal"+retVal);

                if (retVal == true) {
                    var userDetails = Users.findOne({
                        "id": userId
                    });
                    // if (userDetails) {

                        // console.log("subscrition_plan",userDetails["subscription_plan"]);
						var subscription_type="unsubscribe";
						var userSubscriptionValidityId=0;
						var subscriptionRemainingDays=0;
						var userSubscriptionExpiryDate;
            if(userDetails["subscription_plan"]){
                            var plan=Subscriptions.findOne({"subscription_id":userDetails["subscription_plan"]});
							if(plan){
                            subscription_type=plan["type"].toLowerCase();
							userSubscriptionValidityId=userDetails["subscription_validity"];
							userSubscriptionExpiryDate=userDetails["subscription_expiry_date"];
							}
                        }
						//Method call
						var date = new Date();
						date = new Date(date.setMinutes(date.getMinutes() + 330));
						 var retVal = Meteor.call('returnDays', date, userSubscriptionExpiryDate);						 
						subscriptionRemainingDays=retVal;
						console.log("subscriptionRemainingDays",subscriptionRemainingDays);
                        // if(userDetails["subscription"]
                        if (userDetails["pic"]) {
                            var pic = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/" +
                                userDetails["pic"];
                        } else {
                            var pic = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/" +
                                'avtaar.png'
                        }


                        if (userDetails["role"] == 12) {
                            var userType = "student";
                        } else if (userDetails["role"] == 11) {
                            var userType = "teacher";

                        } else {
                            var userType = "na";
                        }
                        if(userDetails["is_mobile_verified"]==1){
                                var is_mobile_verified=true;
                            }else{
                                var is_mobile_verified=false;
                            }
                            
                        if(userDetails["is_benefit_visited"]!= null && userDetails["is_benefit_visited"]!= ''){
                            var is_benefit_visited = userDetails["is_benefit_visited"];
                        }else{
                             var is_benefit_visited = "1";
                        }  
//                        console.log('longitude',userDetails["longitude"]);
//                        console.log('latitude',userDetails["latitude"]);
//                        console.log('user_id',userDetails["id"]);
                        if(userDetails["longitude"] && userDetails["latitude"]){
                            var latitude1 = parseFloat(userDetails["latitude"]);
                            var longitude1 =  parseFloat(userDetails["longitude"]);
                            if(latitude1!=null && longitude1!=null && latitude1!='' && longitude1!='' && latitude1!=0 && longitude1!=0){
                            var tutor_count = 0 ;
                            Meteor.setTimeout(function(){var tutor_count = Meteor.call('getTutorsCount',latitude1,longitude1,userDetails["id"]);}, 17000);
                                
//                                var tutor_count = Meteor.call('getTutorsCount',latitude1,longitude1,userDetails["id"]);
                            }else{
                                var tutor_count = 0;
                            }  
                        }else{
                            var tutor_count = 0;
                        }
                        
                         var notification_count = Meteor.call('new_notification_count',userDetails["id"]);
                         if (notification_count<0) {
                            //code
                            notification_count=0;
                         }
                        var cart_item_count = Meteor.call('getCartCount',userDetails["id"]); 
		 var isFreeTrial=false;
			var showTrialDialog=false;
			if(!activateTrial&&param.activateTrial=='true'){						
					var isFreeTrial= Meteor.call('isFreeTrialSubscription',param.email);
					
					
						if(!isFreeTrial){
								//Force Free Trial for old user
								Meteor.call('forceFreeTrialSubscription',param.email);
								showTrialDialog=true;
							}
							
							}
						var response;	
						var preference;
						if(userDetails["preference"]){
                        if (userDetails["preference"]["cat_id"]) {

                            var subjectId = userDetails["preference"]["course"]["subject_id"];
                            var gradeId = userDetails["preference"]["course"]["id"];

                            var getQdData= Meteor.call('getQdData',userDetails["id"],gradeId,subjectId);
                            var trendingCourses = Meteor.call('displayTrendingCourses', gradeId, subjectId, 5,userDetails["id"]);
                            var wallCount = Meteor.call('getWallCountData', gradeId, subjectId);
                            // return wallCount;
                            var funZone = Meteor.call('funZone', gradeId, subjectId, 1);
                            response = {
                                "course_count": wallCount["countCourse"] + wallCount["countSubject"],
                                "tutor_count": tutor_count,
                                "test_count": wallCount["countCourseTest"] + wallCount["countSubjectTest"],
                                "trending_courses": trendingCourses,
                                "question_of_day_data": getQdData,
                                "total_funzone_count": funZone["total_result_count"],
                                "fun_zone": funZone["gcm_data"]
                            };

                             preference = Meteor.call('fetchPreference', userDetails["preference"]["cat_id"],
                                userDetails["preference"]["sub_cat_id"],
                                userDetails["preference"]["course"]["id"],
                                userDetails["preference"]["course"]["subject_id"]);           

                            
                        } 
						}
                        //Maintaining Last Access Date Time of User
                        var date = new Date();
						date = new Date(date.setMinutes(date.getMinutes() + 330));                       
                        var responseUser=Users.update({"id":parseInt(userId)},{$set:{"last_access_date":date}},{ upsert: true });
                        console.log("last_access_date=="+date+" and Response="+responseUser);
						var obj = {
                                "user_id": userDetails["id"],

                                //                 "token": token,
                                // "is_guest_user": false,
                                //             "invite_url": shortUrl,
                                "user_type": userType,

                                "token": token,
                                // "is_guest_user": false,
                                // "invite_url": shortUrl,

                                "is_mobile_verified": is_mobile_verified,
                                //    "is_interested_in_tution": userDetails[0]["is_interested_in_tution"],
                                "is_email_verified": userDetails["is_email_verified"],
                                "is_benefit_visited":  is_benefit_visited,
                                "cart_item_count": cart_item_count,
                                "subscription_type": subscription_type,
                                "show_subscription":true,
								"enc_key": "MfiOcoLB+6hGyGckiTGOa5TtY9v8\/WEfpthW+Zw8l9I=",
								"isFreeTrialTaken":isFreeTrial,
								"showTrialDialog":showTrialDialog,
								"subscriptionValidityId":userSubscriptionValidityId,
								"subscriptionRemainingDays":subscriptionRemainingDays,
                                // "new_notifications_count":0,
                                // "courses_count":countDoc["count"]["countCourses"],
                                // "tests_count":countDoc["count"]["countTests"],
                                // "tutors_count":0,

                                // "subscription_type":0,
                                // "profile_precentage":0,
//                                "message_count": "5",
//                                "reminder_count": "5",
                                "notification_count": notification_count,
//                                "doubt_count": "5",
                                "personal": {
                                    "email": userDetails["email"],
                                    "name": userDetails["name"],
                                    "image": pic,
                                    "mobile_no": userDetails["mobile_no"],
									"address":userDetails["address"],
									"schoolName":userDetails["school_name"],
									"about_us":userDetails["about_us"],
									"qualification":userDetails["qualification"]
                                },
                                "preference_info": preference,
                                "wall_data": response

                            };

                        }

                        console.log("response",obj);

                        return {
                            status: true,
                            result_data: obj
                        };
                    }
                
            } else {
                return {
                    status: false,
                    message: "Invalid userId!!!"
                };
            }
        // }
    }
});






//Start Validate API
Api.addRoute('validateToken', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams; /* reading bodyParams */
        var user = param.userid;
        var token = param.token;
        if (!Validator.isNull(user) && !Validator.isNull(token)) {
            var flag = Meteor.call('validateToken', user, token);
            if (flag) {
                return {
                    status: true
                };
            } else {
                return {
                    status: false
                };
            }
        } else {
            return {
                status: false
            };
        }
    }
});

//Start getPurchageChapters API
Api.addRoute('getPurchageChapters', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams; /* reading bodyParams */
        var userId = param.userid;
        var token = param.token;


        // console.log("userId=" + userId);

        var flag = Meteor.call('validateToken', userId, token);
        if (flag) { //Check Token
            //Process if token is validate   
            var userChapters = Users.find({
                "_id": userId
            }, {
                "purchased_chapters": 1
            }).fetch();

            //console.log("userChapters=" + userChapters);

            return {
                status: true,
                result_data: {
                    chapters: userChapters
                }
            };
        } else {
            return {
                status: false
            };
        }

    }
});

//Start savePackageChapter API
Api.addRoute('savePackageChapter', {
    post: function() {
        var date = new Date();
        date1 = new Date(date.setMinutes(date.getMinutes() + 330));
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams; /* reading bodyParams */
        var userId = param.userId;
        var token = param.token;
        var chapterId = param.chapterId;
		var packageId = param.packageId;
		var isTestSeries = param.isTestSeries;
		
		var hardwareId = param.hardwareId;
		var hardwareType = param.hardwareType;
		var duration=param.duration;
		if(Validator.isNull(param.duration)){
		duration=12;
		}		
        console.log("chapterId=" + param.chapterId);
        var flag = true//Meteor.call('validateToken', param.userId, param.token);
		var testSeries=0;
		if(isTestSeries){
		testSeries=parseInt(param.isTestSeries);
		}
        if (flag) { //Check Token
            //Process if token is validate                
            var packageDetail = Packages.findOne({"id":parseInt(packageId)},{fields: {"package_level.validity":1,"is_test_series":1}});
		if(packageDetail){			
            var months=parseInt(duration);//parseInt(packageDetail["package_level"]["validity"]);
			console.log("Duration=="+months);
			testSeries = packageDetail['is_test_series'];			
			
            var expiry_date = new Date(date.setMonth(date1.getMonth() + months)).toISOString();
			console.log("join_date="+date1);
			console.log("expiry_date="+expiry_date);
			
			var check_value = Users.find({"id": parseInt(userId),"packages_joined.package_id":parseInt(packageId),"packages_joined.chapter_id":parseInt(param.chapterId)}).count();
			
			console.log("check_value=="+check_value);
			//if(check_value==0){
			var return_value = Users.update({"id": parseInt(userId)},
            {$addToSet: {"packages_joined": {'package_id': parseInt(packageId),'chapter_id': parseInt(param.chapterId), 'is_joined': 1, 'joined_date': date1,
                        'expiry_date': new Date(expiry_date), 'hardware_id': param.hardwareId, 'hardware_type': param.hardwareType, 'global_flag_for_free': 2, 'unjoined_date': '','is_test_series':testSeries
            }}});
			if(return_value){
             return {
                status: true,
				message:"Purchased Successfully"
            };
			}else{
			return {
                status: false,
				message:"Can not Updated"
            };
			}
			//}else{
			//return {
              //  status: false,
		//		message:"This Package already exist"
          //  };
			//}
			}else{
			return {
                status: false,
				message:"This Package does not exist"
            };
			
			}
        } else {
            return {
                status: false,
				message:"Invalid Token"
            };
        }

    }
});

/* done */

Api.addRoute('getIprofFeeds', {
    post: {
        action: function() {
            console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
            var param = this.bodyParams; /* reading bodyParams */
            var isUserId = Validator.isNull(param.userId);
            var isToken = Validator.isNull(param.token);
            var isGradeId = Validator.isNull(param.gradeId);
            var isSubjectId = Validator.isNull(param.subjectId);
			var pageNo=param.pageNo;
            var total_result_count = 0;
            // order by and limit to be implemented
            if (!isUserId && !isToken && !isGradeId && !isSubjectId) {
                var flag = Meteor.call('validateToken', param.userId, param.token);
                if (flag) {
					var subjectIds=param.subjectId.split(',').map(Number);
					//console.log("subjectIds==",subjectIds);
					var feeds = Meteor.call('funZone', parseInt(param.gradeId),subjectIds,parseInt(pageNo));	
					//return 	feeds;			
                    /*category_id and sub_category _id not needed in request*/
                    var gcm_data = []
                    if (feeds) {                    
                        return {
                            status: true,
                            result_data: {
                                "fun_zone": feeds["gcm_data"],
                                "total_result_count": feeds["total_result_count"]
                            }
                        };
                    } else {
                        //console.log("in else=");
						return {
							status: false,
							"message": "No feeds Found"
						};
                    }
                } else {
                    return {
                        status: false,
                        "message": "Invalid Token"
                    };
                }
            }
			else{
				return {
					status: false,
					"message": "Invalid Params!!"
                };
			}
        }
    }
});

//Start updateRegistrationId API
Api.addRoute('updateRegistrationId', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams; /* reading bodyParams */
        var userId = Validator.isNull(param.userId);
        var token = Validator.isNull(param.token);
        var regid = Validator.isNull(param.registrationId);
        var genId = Validator.isNull(param.gen_id);

        if ((!userId && !token && !regid) || (!genId && !regid)) {
            var flag = Meteor.call('validateToken', param.userId, param.token);
            if (flag || (!genId && !regid)) { //Check Token
                //Process if token is validate       
                if(!userId && !token && !regid){
                Users.update({
                    "id": parseInt(param.userId)
                }, {
                    $set: {
                        "registration_id": param.registrationId
                    }
                });
				//Synch Reg ID
				 console.log("API Called ==="+"http://"+lmsIP+"/Users/updateRegistrationId");
				Meteor.setTimeout(function(){           
                    HTTP.call("POST", "http://"+lmsIP+"/Users/updateRegistrationId",
                      {params: {
                          "result" : "json",
                          "mongo_id":param.userId,
                          "registrationId" : param.registrationId                          
                      }}
                  );
                    console.log("timeout");
              }, 17000); 
            }else{
                    Users.update({
                    "gen_id": param.gen_id
                }, {
                    $set: {
                        "registration_id": param.registrationId
                    }
                });
                //Synch Reg ID
                console.log("API Called ==="+"http://"+lmsIP+"/Users/updateRegistrationId");
               Meteor.setTimeout(function(){           
                    HTTP.call("POST", "http://"+lmsIP+"/Users/updateRegistrationId",
                      {params: {
                          "result" : "json",
                          "gen_id":param.gen_id,
                          "registrationId" : param.registrationId                          
                      }}
                  );
				   console.log("API Called=="+"http://"+lmsIP+"/Users/updateRegistrationId");
                    console.log("timeout");
              }, 17000); 
            }
				
                return {
                    status: true
                };
            } else {
                return {
                    status: false,
                    "message": "Invalid Token"
                };
            }

        } else {
            return {
                status: false,
                "message": "Invalid param"
            };
        }
    }
});


//Start studentCourseCompletion API
Api.addRoute('studentCourseCompletion', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams; /* reading bodyParams */
        var userId = Validator.isNull(param.userId);
        var token = Validator.isNull(param.token);

        if (!userId && !token) {
            var flag = Meteor.call('validateToken', param.userId, param.token);
            if (flag) { //Check Token
                //Process if token is validate  
                var packageIds = Users.find({
                    "id": parseInt(param.userId)
                }, {
                    fields: {
                        "packages_joined.package_id": 1
                    }
                }).fetch();
                if (packageIds.length > 0) {
                   // console.log("packageIds=" + packageIds[0]['packages_joined'][0]['package_id']);
                    pkgid = [];
                    var i = 0;

                    for (i = 0; i < packageIds.length; i++) {
                        //console.log("packages[0]['packages_joined']="+packageIds[i]['packages_joined'][i]);
                        var joinedPackage = packageIds[i]['packages_joined'];
                       // console.log("joinedPackage=" + joinedPackage.length);
                        var j = 0;
						if(joinedPackage && joinedPackage.length>0){
                        for (j = 0; j < joinedPackage.length; j++) {
                            pkgid[j] = joinedPackage[j]['package_id'];

                        }
						}
                    }

                    var packages = Packages.find({
                        "id": {
                            $in: pkgid
                        }
                    }, {
                        fields: {
                            "id": 1,
                            "package_assets.no_of_pdf": 1,
                            "package_assets.no_of_multimedia": 1
                        }
                    }).fetch();
                    var pdfs = 0;
                    var videos = 0;
                    var userViewAssets = 0;
                    var response = [];
					if(packages.length>0){
                    for (i = 0; i < packages.length; i++) {
                        var packagesAssets = packages[i]["package_assets"];

                        //for (j = 0; j < packagesAssets.length; j++) { 
						if(packagesAssets){						
                        pdfs = pdfs + parseInt(packages[i]["package_assets"]["no_of_pdf"]);
                        videos = videos + parseInt(packages[i]["package_assets"]["no_of_multimedia"]);
						}
                        var packageAssetSize = Meteor.call('userContentView', param.userId, packages[i]["id"]);
                        //console.log("packageAssetSize=" + packageAssetSize);
                        userViewAssets = userViewAssets + parseInt(packageAssetSize);
                        var obj = {
                            "id": packages[i]["id"],
                            "completion": ((parseInt(userViewAssets)) * 100) / (parseInt(pdfs) + parseInt(videos))
                        };
                        response.push(obj);
                       // console.log("obj=" + obj);
                         }
                    }
                } else {
                    return {
                        status: false,
                        "message": "No Package Joined"
                    };
                }
                //console.log("pdfs=" + pdfs + ",videos=" + videos + ",userViewAssets=" + userViewAssets);


                return {
                    status: true,
                    "result_data": {
                        "courses": response
                    }
                };
            } else {
                return {
                    status: false,
                    "message": "Invalid Token"
                };
            }

        } else {
            return {
                status: false,
                "message": "Invalid param"
            };
        }
    }
});

// Start updateUserRole API
Api.addRoute('updateUserRole', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams; / reading bodyParams /
        var userId = Validator.isNull(param.userId);
        var token = Validator.isNull(param.token);
        var userType = Validator.isNull(param.userType);
        if (!userId && !token && !userType) { //Check Mandatory param
            var flag = Meteor.call('validateToken', param.userId, param.token); //Check User Token
            if (flag) {
                Meteor.call("updateUserRole", param.userId, param.userType);

//////////////////////////////////sending users details to lms first////////////////////////////////////
//             var lmsUser=Users.findOne({"id":parseInt(param.userId)});
//             // return lmsUser;
// 			console.log("API Called ==="+"http://"+lmsIP+"/users/createUser");
// Meteor.setTimeout(function(){           
//                     HTTP.call("POST", "http://"+lmsIP+"/users/createUser",
//                       {params: {
//                           "result" : "json",
//                           "mongo_id":lmsUser["id"],
//                           "username" : lmsUser["name"],
//                           "email" : lmsUser["email"],
//                           "role": lmsUser["role"],
//                           "userphone":lmsUser["mobile_no"],
//                           "gen_id":lmsUser["gen_id"],
//                           "device_id":lmsUser["device_id"] 
//                       }}
//                   );
// 				  console.log("API Called=="+"http://"+lmsIP+"/users/createUser");
//                     console.log("timeout");
//               }, 17000);       

                
                return {
                    status: true,
                    message: "User role updated!!!"
                };

            } else {
                return {
                    status: false,
                    message: "Invalid Token"
                };
            }
        }
    }
});



Api.addRoute('isUserDuplicate', {
    post: {
        action: function() {
            console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
            var param = this.bodyParams;
            if (!Validator.isNull(param.email)) {
                var count = Users.find({
                    "email": param.email
                }).count();
                if (count == 1) {
                    data = {
                        "status": true,
						"result_data":{
                        "message": "duplicate entry.",
						"user_type":"student"
						}
                    };
                    return data;
                } else {
                    return {
                        "status": false,
                        "message": "no record found!"
                    };
                }
            } else {
                return {
                    "status": false,
                    "message": "Invalid Params"
                };
            }
        }
    }
});



//Start storeRegistrationId API
Api.addRoute('storeRegistrationId', {
    post: function() {
        var param = this.bodyParams; /* reading bodyParams */
        var userId = Validator.isNull(param.userId);
        var token = Validator.isNull(param.token);
        var regid = Validator.isNull(param.registrationId);
        if (!userId && !token && !regid) {
            var flag = Meteor.call('validateToken', param.userId, param.token);
            if (flag) { //Check Token
                //Process if token is validate       
                Users.update({
                    "id": parseInt(param.userId)
                }, {
                    $set: {
                        "registration_id": param.registrationId
                    }
                });
				console.log("API Called ==="+"http://"+lmsIP+"/Users/updateRegistrationId");
				Meteor.setTimeout(function(){           
                    HTTP.call("POST", "http://"+lmsIP+"/Users/updateRegistrationId",
                      {params: {
                          "result" : "json",
                          "mongo_id":param.userId,
                          "registrationId" : param.registrationId,
						"gen_id" : param.gen_id,
						"device_id" : param.deviceId 						  
                      }}
                  );
				  console.log("API Called ==="+"http://"+lmsIP+"/Users/updateRegistrationId");
				  console.log("timeout");
              }, 17000);       

				
				
                return {
                    status: true
                };
            } else {
                return {
                    status: false,
                    "message": "Invalid Token"
                };
            }

        } else {
            return {
                status: false,
                "message": "Invalid param"
            };
        }
    }
});


Api.addRoute('editProfile', {
    post: function() {        
		var param = this.bodyParams; /* reading bodyParams */
		
		var userId = parseInt(param.userId);
        var userIdCheck = Validator.isNull(userId);
		
		var token = param.token;
        var tokenCheck = Validator.isNull(token);
        
		var isGuestUser = param.is_guest_user;
		if(param.address!=''){
		var address = param.address;
		}else{
			var address = '';
		}
		var lat;
        var lng;
        var screen;
        
		if(param.lat!=''){
            lat = param.lat;
        }else{
            lat ='';
        }
        if(param.lng!=''){
            lng = param.lng;
        }else{
            lng='';
        }
        if(param.screen!=''){
            screen = param.screen;
        }else{
            screen='';
        }
		
				
		//{is_guest_user=false, jsonResult={"profile":[{"mobile":"","email":"sam@mail.com","qualification":"",
		//"exp":"","school":"","aboutUs":""}]}, token=DyBA4SAREALhqX7X6qiGZACSoqjxGQ3X, userId=2043516}
		
        var jsonResult = param.jsonResult;
        var obj = JSON.parse(jsonResult);
		if(obj['profile'][0]['mobile']!=''){
        var mobile = obj['profile'][0]['mobile'];
		}else{
			var mobile ='';
		}
		if(obj['profile'][0]['email']!=''){
        var email = obj['profile'][0]['email'];
		}else{
			var email ='';
		}
		if(obj['profile'][0]['exp']){
        var exp = obj['profile'][0]['exp'];
		}else{
			var exp ='';
		}
		if(obj['profile'][0]['aboutUs']){
        var aboutUs = obj['profile'][0]['aboutUs'];
		}else{
			var aboutUs ='';
		}
		if(obj['profile'][0]['school']){
        var school = obj['profile'][0]['school'];
		}else{
			var school ='';
		}
		if(obj['profile'][0]['qualification']){
        var qualification = obj['profile'][0]['qualification'];
		}else{
			var qualification ='';
		}
		if(obj['profile'][0]['experience']){
        var exp = obj['profile'][0]['experience'];
		}else{
			var exp ='';
		}
        if (!userIdCheck && !tokenCheck) {
            var flag = Meteor.call('validateToken', userId, token);
            if (flag) { 
                return Meteor.call("editProfile",userId,mobile,email,exp,aboutUs,school,qualification,address);
                }
             else {
                return {
                    status: false,
                    "message": "Invalid Token"
                };
            }
        }
         else {
            return {
                status: false,
                "message": "Invalid param"
            };
        }
    }
});



Api.addRoute('guestRegistration', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams;

        var subjectId=(param.subjectId).split(',').map(Number);
        var gradeId=parseInt(param.gradeId);

        var userId = Meteor.call('autoIncrement');
        var count = Users.find({"device_id":param.deviceId}).count();
//        console.log('count',count);
        var date = new Date();
        date = new Date(date.setMinutes(date.getMinutes() + 330));

         var role = 20; //for students
         if(param.longitude && param.latitude){
             var latitude = parseFloat(param.latitude);
             var longitude =  parseFloat(param.longitude)   ;    
         }else{
            var latitude = "";
            var longitude = ""; 
         }

        if(
            !Validator.isNull(param.categoryId) &&
            !Validator.isNull(param.subcategoryId) &&
            !Validator.isNull(param.gradeId) &&
            !Validator.isNull(param.subjectId) &&
            !Validator.isNull(param.deviceId)
        ){

        if(count==0){
                       

                   var result= Users.insert({
                        "id": userId,   
                        "mode": parseInt(param.mode),
                        "device_id": param.deviceId,
                        "role": role,
                        // "email": "guest",
                        "name": "Hi There",
                        "mobile_no": "",
                        "latitude":latitude,
                        "longitude":longitude,

                    "preference" :
                                    {
                                        "id" : 0,
                                        "cat_id" : parseInt(param.categoryId),
                                        "sub_cat_id" : parseInt(param.subcategoryId),
                                        "course" : {
                                            "id" : gradeId,
                                            "subject_id" : subjectId
                                        }
                                    }
                        });
                  
                    var userDetails = Users.findOne({
                        "device_id": param.deviceId
                    });
                 
                if (userDetails) {
                    Meteor.call('generateToken', userDetails["id"]);
                    var token = Meteor.call('getToken', userDetails["id"]);
                    
                    // console.log(token);
                    var subscription_type=0;
                    var is_mobile_verified=false;
                    var is_email_verified=false;
                    var is_benefit_visited="1";
                    var userType = "student";
                    var notification_count = Meteor.call('new_notification_count',userDetails["id"]);
                    var cart_item_count = Meteor.call('getCartCount',userDetails["id"]);
                    
                    
                    if(param.longitude && param.latitude){
                        var latitude1 = parseFloat(param.latitude);
                        var longitude1 =  parseFloat(param.longitude);
                        if(latitude1!=null && longitude1!=null && latitude1!='' && longitude1!=''){
                            Meteor.setTimeout(function(){var tutor_count = Meteor.call('getTutorsCount',latitude1,longitude1,userDetails["id"]);}, 17000);
                            //var tutor_count = Meteor.call('getTutorsCount',latitude1,longitude1,userDetails["id"]);
                        }else{
                            var tutor_count = 0;
                        }  
                    }else{
                        var tutor_count = 0;
                    }
                    
                    if (userDetails["pic"]) {
                        var pic = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/" + userDetails["pic"];
                    } else {
                        var pic = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/" + 'avtaar.png';
                    }

//            console.log('preference',userDetails["preference"]);


            if (userDetails["preference"]) {

                var subjectId=userDetails["preference"]["course"]["subject_id"];
                var gradeId=userDetails["preference"]["course"]["id"];

                var getQdData= Meteor.call('getQdData',userDetails["id"],gradeId,subjectId);
                var trendingCourses= Meteor.call('displayTrendingCourses',gradeId,subjectId,5,userDetails["id"]);
                var wallCount= Meteor.call('getWallCountData',gradeId,subjectId);
                 // return wallCount;
                 var funZone= Meteor.call('funZone',gradeId,subjectId,1);
                 var response=
                    {
                        "course_count":wallCount["countCourse"]+wallCount["countSubject"],
                        "tutor_count": tutor_count,
                        "test_count": wallCount["countCourseTest"]+wallCount["countSubjectTest"],
                        "trending_courses":trendingCourses,
                        "question_of_day_data": getQdData,
                        "total_funzone_count":funZone["total_result_count"],
                        "fun_zone":funZone["gcm_data"]
                    };
         

                var preference = Meteor.call('fetchPreference', userDetails["preference"]["cat_id"],
                    userDetails["preference"]["sub_cat_id"],
                    userDetails["preference"]["course"]["id"],
                    userDetails["preference"]["course"]["subject_id"]);

                var obj = {
                    "user_id": userDetails["id"],

                    //                 "token": token,
                    "is_guest_user": true,
                    //             "invite_url": shortUrl,
                    "user_type": userType,

                    "token": token,
                    // "is_guest_user": false,
                    // "invite_url": shortUrl,

                    "is_mobile_verified": is_mobile_verified,
                    //    "is_interested_in_tution": userDetails[0]["is_interested_in_tution"],
                    "is_email_verified": is_email_verified,
                    "is_benefit_visited": is_benefit_visited,
                    "cart_item_count": cart_item_count,
                    "subscription_type":subscription_type,
                    "show_subscription":true, 
                    // "new_notifications_count":0,
                    // "courses_count":countDoc["count"]["countCourses"],
                    // "tests_count":countDoc["count"]["countTests"],
                    // "tutors_count":0,
                    // "subscription_type":0,
                    // "profile_precentage":0,
                    // "message_count": "5",
                    // "reminder_count": "5",
                    "notification_count": notification_count,
                    // "doubt_count": "5",
                    "personal": {
                        "email": userDetails["email"],
                        "name": userDetails["name"],
                        "image": pic,
						"mobile_no": userDetails["mobile_no"],
						"address":userDetails["address"],
						"schoolName":userDetails["school_name"],
						"about_us":userDetails["about_us"],
						"qualification":userDetails["qualification"]
                    },
                    "preference_info": preference,
                    "wall_data":response

                };
            } else {
                
                
                

                var obj = {
                    "user_id": userDetails["id"],

                    //                 "token": token,
                    // "is_guest_user": false,
                    //             "invite_url": shortUrl,
                    "user_type": userType,

                    "token": token,
                    "is_guest_user": true,
                    // "invite_url": shortUrl,

                    "is_mobile_verified": is_mobile_verified,
                    //    "is_interested_in_tution": userDetails[0]["is_interested_in_tution"],
                    "is_email_verified": is_email_verified,
                    "is_benefit_visited": is_benefit_visited,
                    "cart_item_count": cart_item_count,
                    "subscription_type":subscription_type,
                    "show_subscription":true, 
                    // "new_notifications_count":0,
                    // "courses_count":countDoc["count"]["countCourses"],
                    // "tests_count":countDoc["count"]["countTests"],
                    // "tutors_count":0,
                    // "subscription_type":0,
                    // "profile_precentage":0,
                    "personal": {
                        "email": userDetails["email"],
                        "name": userDetails["name"],
                        "image": pic,
                        "mobile_no": userDetails["mobile_no"],
						"address":userDetails["address"],
						"schoolName":userDetails["school_name"],
						"about_us":userDetails["about_us"],
						"qualification":userDetails["qualification"]
                    },
                    "wall_data":response


                };

            }



                    return {
                        status: true,
                        result_data: obj
                    };
                }
                else {
                    
                    return {
                        status: false,
                        message: "Unable to add user"
                    };
                }
        }else{
            
                var result= Users.update(
                        {"device_id": param.deviceId},
                        {$set: 
                             { "preference" :
                                    {
                                        "id" : 0,
                                        "cat_id" : parseInt(param.categoryId),
                                        "sub_cat_id" : parseInt(param.subcategoryId),
                                        "course" : {
                                            "id" : gradeId,
                                            "subject_id" : subjectId
                                        }
                                    }
                                }       
                        }

                        );
                  
                    var userDetails = Users.findOne({
                        "device_id": param.deviceId
                    });
                 
                if (userDetails) {
                    Meteor.call('generateToken', userDetails["id"]);
                    var token = Meteor.call('getToken', userDetails["id"]);

                    // console.log(token);
                    var subscription_type=0;
                    var is_mobile_verified=false;
                    var is_email_verified=false;
                    var is_benefit_visited="1";
                    var userType = "student";
                    var notification_count = Meteor.call('new_notification_count',userDetails["id"]);
                    var cart_item_count = Meteor.call('getCartCount',userDetails["id"]);
                    if(param.longitude && param.latitude){
                        var latitude1 = parseFloat(param.latitude);
                        var longitude1 =  parseFloat(param.longitude);
                        if(latitude1!=null && longitude1!=null && latitude1!='' && longitude1!=''){
                            var tutor_count = Meteor.call('getTutorsCount',latitude1,longitude1,userDetails["id"]);
                        }else{
                            var tutor_count = 0;
                        }  
                    }else{
                        var tutor_count = 0;
                    }
                    if (userDetails["pic"]) {
                        var pic = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/" + userDetails["pic"];
                    } else {
                        var pic = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/" + 'avtaar.png';
                    }

//            console.log('preference',userDetails["preference"]);


            if (userDetails["preference"]) {

                var subjectId=userDetails["preference"]["course"]["subject_id"];
                var gradeId=userDetails["preference"]["course"]["id"];

                var getQdData= Meteor.call('getQdData',userDetails["id"],gradeId,subjectId);
                var trendingCourses= Meteor.call('displayTrendingCourses',gradeId,subjectId,5,userDetails["id"]);
                var wallCount= Meteor.call('getWallCountData',gradeId,subjectId);
                 // return wallCount;
                 var funZone= Meteor.call('funZone',gradeId,subjectId,1);
                 var response=
                    {
                        "course_count":wallCount["countCourse"]+wallCount["countSubject"],
                        "tutor_count": tutor_count,
                        "test_count": wallCount["countCourseTest"]+wallCount["countSubjectTest"],
                        "trending_courses":trendingCourses,
                        "question_of_day_data": getQdData,
                        "total_funzone_count":funZone["total_result_count"],
                        "fun_zone":funZone["gcm_data"]
                    };
         

                var preference = Meteor.call('fetchPreference', userDetails["preference"]["cat_id"],
                    userDetails["preference"]["sub_cat_id"],
                    userDetails["preference"]["course"]["id"],
                    userDetails["preference"]["course"]["subject_id"]);

                var obj = {
                    "user_id": userDetails["id"],

                    //                 "token": token,
                     "is_guest_user": true,
                    //             "invite_url": shortUrl,
                    "user_type": userType,

                    "token": token,
                    // "is_guest_user": false,
                    // "invite_url": shortUrl,

                    "is_mobile_verified": is_mobile_verified,
                    //    "is_interested_in_tution": userDetails[0]["is_interested_in_tution"],
                    "is_email_verified": is_email_verified,
                    "is_benefit_visited": is_benefit_visited,
                    "cart_item _count": cart_item_count,
                    "subscription_type":subscription_type,
					"show_subscription":true,					
                    // "new_notifications_count":0,
                    // "courses_count":countDoc["count"]["countCourses"],
                    // "tests_count":countDoc["count"]["countTests"],
                    // "tutors_count":0,
                    // "subscription_type":0,
                    // "profile_precentage":0,
                    // "message_count": "5",
                    // "reminder_count": "5",
                    "notification_count": notification_count,
                    // "doubt_count": "5",
                    "personal": {
                        "email": userDetails["email"],
                        "name": userDetails["name"],
                        "image": pic,
                        "mobile_no": userDetails["mobile_no"],
						"address":userDetails["address"],
						"schoolName":userDetails["school_name"],
						"about_us":userDetails["about_us"],
						"qualification":userDetails["qualification"]
                    },
                    "preference_info": preference,
                    "wall_data":response

                };
            } else {

                var obj = {
                    "user_id": userDetails["id"],

                    //                 "token": token,
                    // "is_guest_user": false,
                    //             "invite_url": shortUrl,
                    "user_type": userType,

                    "token": token,
                     "is_guest_user": true,
                    // "invite_url": shortUrl,

                    "is_mobile_verified": is_mobile_verified,
                    //    "is_interested_in_tution": userDetails[0]["is_interested_in_tution"],
                    "is_email_verified": is_email_verified,
                    "is_benefit_visited": is_benefit_visited,
                    "cart_item _count": cart_item_count,
                    "subscription_type":subscription_type,
					"show_subscription":true,					
                    // "new_notifications_count":0,
                    // "courses_count":countDoc["count"]["countCourses"],
                    // "tests_count":countDoc["count"]["countTests"],
                    // "tutors_count":0,
                    // "subscription_type":0,
                    // "profile_precentage":0,
                    "personal": {
                        "email": userDetails["email"],
                        "name": userDetails["name"],
                        "image": pic,
                        "mobile_no": userDetails["mobile_no"],
						"address":userDetails["address"],
						"schoolName":userDetails["school_name"],
						"about_us":userDetails["about_us"],
						"qualification":userDetails["qualification"]
                    },
                    "wall_data":response


                };

            }



                    return {
                        status: true,
                        result_data: obj
                    };
                }
                else {
                    
                    return {
                        status: false,
                        message: "Unable to add user"
                    };
                }
        }
        }else{
                return {
                        status: false,
                        "message": "Invalid params!!!"
                        };
            }




        }
});


Api.addRoute('cartItemCount', {
    post: function() {
        var param = this.bodyParams; 
        var userId = parseInt(param.userId);
        var result = Meteor.call('getCartCount',userId);
        return result;
}});


Api.addRoute('usersPackagesJoinedCount', {
    post: function() {
        var param = this.bodyParams; 
        var id = parseInt(param.id);
        var result = Meteor.call('usersPackagesJoinedCount',id);
        return result;
}});

Api.addRoute('sendOTP', {
    post: function() {
	console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams;		
		var mobile=Validator.isNull(param.mobileNo); 
        var userid=Validator.isNull(param.userId);
        if(!mobile&&!userid){      
		if(!mobile && parseInt(param.mobileNo)!=''){		
		var mobileNo = parseInt(param.mobileNo);
		return Meteor.call("sendOTPAtRegistration",mobileNo,param.userId);
		}else{
			return {
				status:false,
				message:"Invalid mobile number."
			};
		}
        
    }else{
        return {
                status:false,
                message:"Invalid params."
            };
    }
}});


Api.addRoute('getOTPorEMAIL', {
    post: function() {

		console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
        var param = this.bodyParams;		
		var mobile=Validator.isNull(param.mobileNo);       
		if(!mobile && parseInt(param.mobileNo)!=''){
		var dataUser=Users.find({"mobile_no":parseInt(param.mobileNo)},
		{fields: {"id":1,"email": 1}}).fetch();
		if(dataUser){
		var mobileNo = parseInt(param.mobileNo);
		return Meteor.call("sendOTP",dataUser[0]['id'],mobileNo);
		}else{
		return {
                    status: false,
                    "message": "NO user user with this mobile Number!"
                };
		}
		}else{
		var email = param.email;
		var emailChk = Users.find({"email":email}).count();
		if(emailChk!=0){
		var userData = Users.find({"email":email}).fetch();
		var strUrl = email+'#'+userData[0]['lms_id'];
		var webUrl = stagingUrl;
		var dataString = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(strUrl));
		var resetUrl = webUrl+'/forget_password/'+dataString;
		var text='<html lang="en"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content=""><meta name="author" content=""><link rel="icon"><title>iProf</title></head><body style="padding: 0; margin: 0;font-family: arial; font-size:13px"><table width ="600" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#f5f5f5"><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-image:url(http://addimages.thedigilibrary.com/test/emailer/december_mailers/invoice-bg.png); background-repeat:no-repeat; height:600px;"><tbody><tr><td style="padding:20px;" valign="top"><div><p>Dear '+userData[0]['name']+',</p><p style="padding-top:20px;">We got your request for a change of password.</p><p style="padding-top:20px;margin:0;">Click on the link below to set your new password</p><p style="margin:0;padding:5px 0 0">Set Password: <a href="'+resetUrl+'">'+resetUrl+'</a> Click here</p></div><div style="margin-top:30px;"><p style="margin:0;padding:5px 0">In case this request was not sent by you, let us know ASAP at</p><p style="margin:0;padding:5px 0" style="color:red">info@iprofindia.com</p></div><div style="margin-top:100px;"><p style="margin:0;padding:5px 0 0">Warm Regards,</p><p style="margin:0;padding:5px 0">Team iProf</p></div></td></tr></tbody></table></td></tr></table></body></html>';
		
		
		Email.send({
                        from: "ccare@iprofindia.com",
                        to: email,
                        subject: "IProf reset password link",
						html:text 
                        });
						
				return {
                    status: true,
                    "message": "Mail sent successfully!"
                };
		}
		else{
		return {
                    status: false,
                    "message": "Email does not exists!"
                };
		}		
		//return Meteor.call("sendEmail",userId,mobileNo);
		}
        }
		
});


Api.addRoute('validateOTP', {
    post: function() {
	console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var date = new Date();
        date = new Date(date.setMinutes(date.getMinutes() + 330));
        var param = this.bodyParams; 
		var result = param.result;
		var userId = parseInt(param.userId);
		var mobileNo = parseInt(param.mobileNo);
		var token = param.token;
		var otp = parseInt(param.otp);
		var attempt = parseInt(param.attempt);
		var flag = Meteor.call('validateToken', userId, token);
		if (flag) { 
		if(attempt >=2){
			var message = 'Your validation is unsuccessful. Please close the app and try again after some time';
		}else{
			var message = 'Your OTP has expired. Please request for another OTP';
		}
		
		if(otp == '0000'){				   
				    Users.update({
                    "id": parseInt(param.userId)
					}, {
                    $set: {
                        "mobile_no": mobileNo,
						"is_mobile_verified":1,
						"status":1,
						"modified":date
                    }
					});
                    
					var message = 'Thanks for verifing your mobile number.'
					
					return {
                        status: true,
                        "message": message
                    };
		}
		return Meteor.call("validateOTP",userId,mobileNo,attempt,otp);	
                
        }
		else{
			    return {
                    status: false,
                    "message": "Invalid Token"
                };
		}
}});


Api.addRoute('userFeedback', {
    post: function() {
        var param = this.bodyParams; 
        var userIdChk = Validator.isNull(param.userId);
        var tokenChk = Validator.isNull(param.token);
		var feedbackChk = Validator.isNull(param.feedback);
		var nameChk = Validator.isNull(param.name);
		var emailChk = Validator.isNull(param.email);
		var mobileNoChk = Validator.isNull(param.mobileNo);
		var latitudeChk = Validator.isNull(param.latitude);
		var longitudeChk = Validator.isNull(param.longitude);


		if(!userIdChk){
        var userId = parseInt(param.userId);
		}else{
			var userId='';
		}
		
		if(!tokenChk){
		var token = param.token;
		}else{
			var token ='';
		}
		
		if(!feedbackChk){
		var feedback = param.feedback;
		}else{
			var feedback ='';
		}
		
		if(!nameChk){
		var name = param.name;
		}else{
			var name ='';
		}
		
		if(!emailChk){
		var email = param.email;
		}else{
			var email ='';
		}
		
		if(!mobileNoChk){
		var mobileNo = parseInt(param.mobileNo);
		}else{
			var mobileNo ='';
		}
		
		if(!latitudeChk){
		var latitude = param.latitude;
		}else{
			var latitude ='';
		}
		
		if(!longitudeChk){
		var longitude = param.longitude;
		}else{
			var longitude ='';
		}

		if (!userIdChk && !tokenChk) {
		var flag = Meteor.call('validateToken', userId, token);
		if (flag) { 
        return Meteor.call('userFeedback',userId,feedback,name,email,mobileNo,latitude,longitude);
		}else{
				return {
                    status: false,
                    "message": "Invalid Token"
                };
		}
		}
}});




Api.addRoute('getTutorsCount', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams;
            return Meteor.call("getTutorsCount", parseFloat(param.latitude), parseFloat(param.longitude), parseInt(param.userId));
    }
});


Api.addRoute('userPackageActivation', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams;
        return Meteor.call("userPackageActivation", parseInt(param.userId), parseInt(param.packageId), parseInt(param.deviceId));
    }
});

Api.addRoute('IncreaseCartCount', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams;
        return Meteor.call("increaseCartCount", parseInt(param.userId));
    }
});

Api.addRoute('DecreaseCartCount', {
    post: function() {
        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
        var param = this.bodyParams;
        return Meteor.call("decreaseCartCount", parseInt(param.userId));
    }
});



