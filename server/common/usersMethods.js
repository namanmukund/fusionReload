    Meteor.methods({
        'usersPreference': function(userId) {
            return Users.find({"id": userId}, {fields: {"preference": 1}}).fetch();
        }
    });
	
	
	Meteor.methods({
        'userSubscription': function(userId) {
            return Users.find({"id": userId}, {fields: {"subscription_plan": 1,"subscription_validity":1}}).fetch();
        }
    });
	
	Meteor.methods({
        'isFreeTrialSubscription': function(userEmail) {
		console.log("userEmail=="+userEmail);
			var user=Users.findOne({"email": userEmail,}, {fields: {"subscription_plan": 1,"subscription_validity":1}});
			var isFreeTrial=false;
			var subscription_validity=0;			
			if(user){
			subscription_validity=user["subscription_validity"];
			if(subscription_validity){
			isFreeTrial=true;
			}
			}
			return isFreeTrial;
        }
    });
	
	Meteor.methods({
        'forceFreeTrialSubscription': function(userEmail) {
			  Users.update({"email": userEmail}, {$set: {"subscription_plan": 1, "subscription_validity": 4}});			
			
        }
    });
	
	

   //  Meteor.methods({
   //      'changeMyPassword': function(oldPwd,newPwd,newPassword,userId) {
   //      	 var date = new Date();
   //          date = new Date(date.setMinutes(date.getMinutes() + 330));
			// var userid;
   //              if (newPassword.length >= 6) {
   //                  userid = Users.find({"id": userId}).fetch();
   //                  if (userid[0].password == oldPwd) {
   //                      var modified = date;

   //                      Users.update({"id": userId}, {$set: {"password": newPwd, "modified": modified}});
   //                      data = {"status": true, "message": "Password changed successfully!"};
   //                      // console.log(data);
			// 			return data;
   //                  }
   //                  else {
   //                      data = {"status": true, "message": "Wrong old password!"};
   //                      return data;
   //                  }
   //              }
   //              else {
   //                  data = {"status": true, "message": "short password length!"};
   //                  return data;
   //              }
   //      }
   //  });



    // Meteor.methods({
    //     'resetPassword': function(userid, password) {
    //     	var date = new Date();
    //         date = new Date(date.setMinutes(date.getMinutes() + 330));
    //         if (password.length >= 6) {
    //             var password = Meteor.call("hash", password);
				// // console.log("password=="+password);
    //             var modified = date;				
    //             Users.update({id: userid}, {$set: {"password": password, "modified": modified}});
    //             data = {"status": true, "message": "Password changed successfully!"};
    //             return data;
    //         }
    //         else {
    //             data = {"status": true, "message": "short password length!"};
    //             return data;
    //         }
    //     }
    // });


    /* start */
  








    //Get UserContentView Size by Package ID 
    Meteor.methods({
        'userContentView': function(userId, packageId) {
            return Users.find({"id": parseInt(userId)}, {"content_view.course_id": parseInt(packageId)}, 
                {fields: {
                    "content_view": 1}}).count();
        }});

    //Update User Role
  Meteor.methods({
        'updateUserRole': function(userId, userType) {


            if(userType=="student"){
                var role=12;
            }
            else if(userType=="teacher"){
                var role=11;
            }

     return Users.update({"id": parseInt(userId)}, {$set: {"role": role} });
        }});

    Meteor.methods({
        'isPurchasedChapter': function(userId,chapterId) {
            var purchasedChapters=Users.find({"id": parseInt(userId),"packages_joined.chapter_id":parseInt(chapterId)}).count();
			console.log("purchasedChapters===="+purchasedChapters);
					if(purchasedChapters>0){
					return true;
					}else{
					return false;
					}
        }});
		
		
		//get funzone data 	
	Meteor.methods({
		getMessageHtml: function (funId) {
		
      		
			var message=Funzone.find(
                {"id":parseInt(funId)
              },
            {fields:
                        {
						"message_html":1,
						"_id":0
						}
				}).fetch();
			
			
			   return message;
    }
	});	

	//get funzone data 	
	Meteor.methods({
		funZone: function (gradeId,subjectId, pageNo) {
		if(pageNo){
			pageNo =pageNo;
		}else{
			pageNo =1;
		}	
        var skip_limit = pageNo*5-5;
        var feeds = Funzone.find(
                {
                    "course_id": gradeId, 
                    "subject_id": {$in: subjectId}, 
                    "notification_type": {$ne: 4}
                },
                {skip: skip_limit, limit: 5, sort: {id: -1}}
            ).fetch();
			//console.log('feeds',JSON.stringify(feeds));
			var feedsCount = Funzone.find(
                {
                    "course_id": gradeId, 
                    "subject_id": {$in: subjectId}, 
                    "notification_type": {$ne: 4}
                }).count();
       // console.log('feedsCount',feedsCount);
		var total_result_count = 0;
		var arr =[];
        if(feeds[0]){
            total_result_count = feedsCount;
            for(var i=0;i<5;i++){
			 //console.log('feeds[i]',feeds[i]);
			 	if (feeds[i]){
				 	if(feeds[i].attach_name!=null && feeds[i].attach_name!=''){
	                    var vid_file = "http://globalapi.schoolera.com/app/webroot/v5/gcm files/"+feeds[i].attach_name;
	                }
					else{
	                    var vid_file = '';
	                }
	                if(feeds[i].message_html!=null&&feeds[i].message_html!='null'&&feeds[i].message_html!=''){
	                    var mssg_html = true;
	                }else{
	                    var mssg_html = false;
	                }
	                var obj = {
	                              "feed_id": feeds[i].id,
	                              "title": feeds[i].title,
	                              "subject": feeds[i].subject,
	                              "post_description": feeds[i].post_description,
	                              "video_file": vid_file,
	                              "type_id": feeds[i].notification_type,
	                              "date": feeds[i].date_added,
	                              "link": feeds[i].link,
	                              "video_url": feeds[i].video_url,
	                              "video_image": "http:\/\/globalstagingv2.schoolera.com\/app\/webroot\/img\/icon1.jpg",
	                              "message_type": mssg_html
	                           };
	                arr.push(obj);     

                }  
            }
            
        }
		    var response  = {
                "total_result_count": total_result_count,
                "gcm_data": arr
            };
         return response;
    }
	});	
		


    //Update User Role
    Meteor.methods({
        'editProfile': function(userId,mobile,email,exp,aboutUs,school,qualification,address) {
                var ret_val = Users.update({
                    "id": parseInt(userId)
                },{
                    $set: {
						"email":email,
						"mobile":mobile,
						"experience":exp,
						"about_us":aboutUs,
						"school_name":school,
						"qualification":qualification,
						"address":address
                    }
                });
				if(ret_val){
				var response  = {
                "status": true,
                "message": "Your Profile is successfully updated"
				};
				}
				else{
				var response  = {
                "status": false,
                "message": "Sorry!Profile cant be updated.Please try again later"
				};
			}
				return response;
			}
		}
	);

    Meteor.methods({
        'sendOTP': function(userId,mobileNo) {
        	var date = new Date();
            date = new Date(date.setMinutes(date.getMinutes() + 330));
			var dataUser = Users.find({"id":userId},{fields:{"role":1}}).fetch();
			if(dataUser[0]['role']==12){
				var ucnt = Users.find({"id":userId}).count();
			}else{
			var ucnt = Users.find({"id":userId,"mobile_no":mobileNo}).count();
			}
			var otpCode;
			if(ucnt ==1){
			var otpRes = Otp.find({"user_id":userId,"expired_on":{$gt: date}},{fields: {"otp_code":1}}).fetch();
			if(otpRes.length > 0){
				otpCode=otpRes[0]['otp_code'];
			}else{
				otpCode=Math.floor(Math.random() * (899999)) + 100000;
			}	
				var smsShortCode = 'iProfs';
                var smsExpiryTime = 30;
                var smsExpiryTimeInMinutes = smsExpiryTime / 60;
                var smsContent = otpCode+' is your One Time Password (OTP) for resetting your password.This is valid for ' +smsExpiryTimeInMinutes+ ' minutes from the request.';
				var textVal =encodeURI(smsContent);
				var url = 'http://203.129.203.243/blank/sms/user/urlsms.php?username=iproflearning&pass=thedigilibrary&senderid='
                    +smsShortCode+'&dest_mobileno='+mobileNo+'&msgtype=TXT&message='+textVal+"&response=Y";
				var res = Meteor.http.get(url);
				if (res!='') {
									var userId = userId;
                                    var mobileNo = mobileNo;
                                    var otp_code = otpCode;
                                    var short_code = smsShortCode;
                                    var sms_response = res;
                                    var created_on = date;
                                    var modified_on = date;
                                    var expired_on = new Date(created_on.setMinutes(created_on.getMinutes() + smsExpiryTime));
                                    Otp.insert({"user_id":userId,
									"mob_no":mobileNo,
									"otp_code":otpCode,
									"sms_response":res,
									"created":created_on,
									"expired_on":expired_on,
									"modified_on":date,
									"is_responsed":0
									});
									
								return{	status:true,
                                    message:"OTP sent successfully",
									userid:userId
								};
				}
				else {
                return false;
				}
			}
			else{
				return false;
			}
        }
    });
	
	Meteor.methods({
        'sendOTPAtRegistration': function(mobileNo,userId) {
			
			    //Check Any User map with this mobile no ---
				var user = Users.find({"mobile_no":parseInt(mobileNo),"status":1,"is_mobile_verified":1},{fields:{"id":1}}).fetch();
				console.log("User =="+JSON.stringify(user));	
				var sendOTPFlag=true;
				if(user && user.length>1){
					sendOTPFlag=false;								
					}else if(user && user.length==1){
						//compare request userid and id from DB
						if(userId!=user[0]["id"]){
						sendOTPFlag=false;
						}
					}	
				if(!sendOTPFlag){
								return {"status":false,
									"message":"This mobile number is already connected with another account. Please use another alternate number!"
								}
				}

				var date = new Date();
            	date = new Date(date.setMinutes(date.getMinutes() + 330));
			
				var otpCode=Math.floor(Math.random() * (899999)) + 100000;
			
				var smsShortCode = 'iProfs';
                var smsExpiryTime = 30;
                var smsExpiryTimeInMinutes = smsExpiryTime / 60;
                var smsContent = otpCode+' is your One Time Password (OTP) for resetting your password.This is valid for ' +smsExpiryTimeInMinutes+ ' minutes from the request.';
				var textVal =encodeURI(smsContent);
				var url = 'http://203.129.203.243/blank/sms/user/urlsms.php?username=iproflearning&pass=thedigilibrary&senderid='
                    +smsShortCode+'&dest_mobileno='+mobileNo+'&msgtype=TXT&message='+textVal+"&response=Y";
				var res = Meteor.http.get(url);
				if (res!='') {
									var userId = userId;                                    
                                    var otp_code = parseInt(otpCode);
                                    var short_code = smsShortCode;
                                    var sms_response = res;
                                    var created_on = date;
                                    var modified_on = date;
                                    var expired_on = new Date(created_on.setMinutes(created_on.getMinutes() + smsExpiryTime));
                                    Otp.insert({"user_id":userId,
									"mob_no":mobileNo,
									"otp_code":otpCode,
									"sms_response":res,
									"created":created_on,
									"expired_on":expired_on,
									"modified_on":date,
									"is_responsed":0
									});
									
								return{	status:true,
								message:"OTP sent successfully"
									
								};
				}
				else {
                return{	status:false,
								message:"OTP sent fails"
									
								};
				}
			
  //       }else{
		// 	return {"status":false,
		// 			"message":"This mobile number is already connected with another account. Please use another alternate number!"}
		// }
		}
    });
	
	
	Meteor.methods({
        'validateOTP': function(userId,mobileNo,attempt,otp) {
        	var date = new Date();
            date = new Date(date.setMinutes(date.getMinutes() + 330));
			if(mobileNo.toString().length == 10){
				if(isNaN(mobileNo)){
				return {
					status:false,
					message :'Looks like you have entered an invalid mobile number!'
				}	
				}
			}else{
				return {
					status:false,
					message :'Looks like you have entered an invalid mobile number!'
				}
			}	
			if(otp.toString().length != 6){
				if(isNaN(otp)){
				return {
					status:false,
					message :'Looks like you have entered an invalid mobile number!'
				}	
				}
			}
			
            var ucnt = Users.find({"mobile_no":parseInt(mobileNo),"status":1,"is_mobile_verified":1}).count();
			console.log("User Count=="+ucnt);
			var otpCode;
			if(ucnt ==0){
			
			if(attempt < 3){ //otpRes.length > 0 && 
			
			var data = Otp.find({"mob_no":mobileNo,"otp_code":otp}).count();
				//data=1;//need to be removed
				console.log("OTP data=="+data);
				if(data>0){
					Otp.update({"otp_code":otp},{
									$set: {
									"modified_on":date,
									"is_responsed":1
									}
					});

				    Users.update({
                    "id": parseInt(userId)
					}, {
                    $set: {
                        "mobile_no": mobileNo,
						"is_mobile_verified":1,
						"status":1,
						"modified":date
                    }
					});
					
					return {"status":true,
					"message":"Thanks for verifying your mobile number."
					}
				}
				else{
					return {"status":false,
					"message":"OTP entered is incorrect. Please try again!"
					}
				}
			}else{
			return {"status":false,
					"message":"Maximum Attempts reached"
					}
			}
		}else{
			return {"status":false,
					"message":"This mobile number is already connected with another account. Please use another alternate number!"}
		}
		}
    });


		
			Meteor.methods({
		        'userFeedback': function(userId,feedback,name,email,mobileNo,latitude,longitude) {
		        	        var res = ApiUserFeedback.find({"user_id": userId}).count();
		        	        var date = new Date();
            				date = new Date(date.setMinutes(date.getMinutes() + 330));
		        	        if(res==0){
		                    ApiUserFeedback.insert({"user_id":userId,
											"feedbacks":[{'feedback':feedback,'created_on':date}],
											"name":name,
											"email":email,
											"mobileNo":mobileNo,
											"latitude":latitude,
											"longitude":longitude
							});
							return {"status":true,
							"message":"Thanks! Feedback saved successfully"}
						}else{
							ApiUserFeedback.update({"user_id": userId},
		            {$addToSet: {"feedbacks": {'feedback': feedback,'created_on':date}}});
							return {"status":true,
							"message":"Thanks! Feedback saved successfully"}
						}
		        }
		    });
			
			
			
				Meteor.methods({
		        'userPackageActivation': function(userId,packageId,deviceId) {
		        			var date = new Date();
            				date = new Date(date.setMinutes(date.getMinutes() + 330));
		                    UserPackageActivation.insert({"user_id":userId,
											"package_id":packageId,
											"device_id":deviceId,
											"activation_date":date,
											"status":1
							});
							return {"status":true,
							"message":"Thanks! Package activation saved successfully"}
		        }
		    });

				Meteor.methods({
		        'isJoinedPackage': function(userId,packageId) {
		        	// console.log(packageId);
		  //       		 var pipeline = [
    //     {
    //         $unwind: '$packages_joined'
    //     }, 
    //     {
    //         $match: {
    //             "id": userId,
    //             "packages_joined.package_id":packageId,
    //             "packages_joined.is_joined":1
                

    //         }
    //     }, {
    //         $project: {
    //             "_id":0,
    //             "packages_joined.is_joined": 1

    //                 }
    //     }   

    // ];
    // // console.log("testId",testId);
    // var result = Users.aggregate(pipeline);

    //  var joinCount=result.length;
    //         if(joinCount>0){
    //             var isJoined=result[0]["packages_joined"]["is_joined"];
    //         }
    //         else{
    //             var isJoined=-1;
    //         }
     // var info=Users.find({
     //                    "id":parseInt(userId),
     //                    "packages_joined":{
     //                        $elemMatch:{
     //                        "package_id":17064,
     //                        "is_joined":1
     //                        // "global_flag_for_free":1,
     //                        // "is_test_series":0}

     //                    }},
                        
     //                },{fields:{
                        
     //                    "_id":0,  
     //                    "packages_joined.package_id": 1
     //                }

     //                }).fetch();


		        	// var count=Users.find({"id":parseInt(userId)},
		        	// 	{fields:{
		        	// 	"packages_joined":{$elemMatch:{
		        	// 		"package_id":parseInt(packageId),
		        	// 	"is_joined":1}},
		        	// 	"_id":0,
		        	// 	"packages_joined.package_id":1

		        	// }}).fetch();

var info=Users.find({   
                        "id":parseInt(userId)
                        
                    },{fields:{
                        
                        "_id":0,  
                        "packages_joined.package_id": 1,
                        "packages_joined.is_joined":1,
                        "packages_joined.global_flag_for_free":1,
                        "packages_joined.is_test_series":1
                    }}

                    ).fetch();

// console.log(JSON.stringify(info));
// console.log(userId,packageId);
//             // var j=0;
            var isJoined=false;
            var isPurchased=false;
            if(info[0]){
            if(info[0]["packages_joined"]&&info[0]["packages_joined"].length>0){
           for(i=0;i<info[0]["packages_joined"].length;i++){
            if(
                info[0].packages_joined[i].is_joined==1 &&
                info[0].packages_joined[i].package_id==parseInt(packageId)
                

                ){
            	isJoined=true;
            	break;
                
            }else if(
            	(info[0].packages_joined[i].global_flag_for_free==0 ||info[0].packages_joined[i].global_flag_for_free==2) &&
                info[0].packages_joined[i].package_id==parseInt(packageId)
            	){
            	isPurchased=true;
            }

			}
            }
            // console.log("pkgid",pkgid);



		        	// console.log("packageId",packageId);
		        	// console.log("count",JSON.stringify(info));
		        }
		        var status={
		        	"isJoined":isJoined,
		        	"isPurchased":isPurchased
		        };
		        	return status;
		        	

		        	  }
		    });
			
			
			Meteor.methods({
		        'getPackageHardware': function(userId,packageId) {
		        	

var info=Users.find({   
                        "id":parseInt(userId)
                        
                    },{fields:{
                        
                        "_id":0,  
                        "packages_joined.package_id": 1,
                        "packages_joined.is_joined":1,
                        "packages_joined.global_flag_for_free":1,
                        "packages_joined.is_test_series":1,
						"packages_joined.hardware_type":1
						
                    }}

                    ).fetch();

            
			var PackageHardwares=[];
			//console.log("User packages_joined Arr==",JSON.stringify(info[0]));
            if(info[0]){
            if(info[0]["packages_joined"]&&info[0]["packages_joined"].length>0){
           for(i=0;i<info[0]["packages_joined"].length;i++){
		  // console.log("packageId from Request==",packageId);
		   // console.log("packageId from DB==",packageId);
            if(
                info[0]["packages_joined"][i]["is_joined"]==1 &&
                info[0]["packages_joined"][i]["package_id"]==parseInt(packageId)
                

                ){
            	console.log("HardwareType==",info[0]["packages_joined"][i]["hardware_type"]);
				PackageHardwares.push(info[0]["packages_joined"][i]["hardware_type"]);          	
                
            }
			}
            }
                 	console.log("PackageHardwares==",JSON.stringify(PackageHardwares));
		        }
		        	return PackageHardwares;
		        	

		        	  }
		    });

			
		Meteor.methods({
        'saveResetPasswordDetails': function(email, password, confirmPassword) {
		if(password == confirmPassword){
		if (password.length >= 6) {
				var hPassword = Meteor.call('hash', password);
                Users.update({email: email}, {$set: {"password": hPassword}});
                data = {"status": true, "message": "Password reset successfully!"};
                return data;
            }
            else {
                data = {"status": true, "message": "short password length!"};
                return data;
            }
			}else{
			    data = {"status": true, "message": "password and confirm password are not same!"};
                return data;
			}
		}
		});