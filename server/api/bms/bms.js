
var Api = new Restivus({
    apiPath: 'bms',
    useDefaultAuth: false,
    prettyJson: true
  });
//Start get Opponents list and Random Test  API
	Api.addRoute('getOpponentsAndRandomTest', {
      post: function () { 
console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
var param = this.bodyParams;  
    var userId = Validator.isNull(param.userId);
        var token = Validator.isNull(param.token);
        var subjectId = Validator.isNull(param.subjectId);
        var gradeId = Validator.isNull(param.gradeId);
        
		// var isTestSeries = Validator.isNull(params.isTestSeries);
        if (!userId && !token && !subjectId && !gradeId) { //Check Mandatory Params
		var flag=Meteor.call('validateToken',userId,token);	
	 if(flag){	


	 	
	 	var userList=Meteor.call('getBmsUsers',parseInt(param.gradeId),parseInt(param.subjectId),
            parseInt(param.userId));
	 	var testList=Meteor.call('getBmsTestsLists',parseInt(param.gradeId),parseInt(param.subjectId));
        // return testList;
	 	if(userList[0] && testList){	
	 	var response={
				"userList": userList,
				"testList": [testList]
	 	}
	 	return {status: true, result_data: response};
	 	}else{
	 	 	return {status: false, message: "No data to show!!!"};
	 	 }	
		}
		else{
	 		return {status: false, message: "Invalid token!!!"};
	 	}	
     }
		else{
	 		return {status: false, message: "Invalid params!!!"};
	 	}
	 	}	      
    });
	
    Api.addRoute('submitBms', {
        post: function () { 
            console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
            var params = this.bodyParams;  
			
            var challenge_id = parseInt(params.challengeId);
            var challenge_id_check = Validator.isNull(challenge_id);
            
            var challenger_id = parseInt(params.challengerId);
            var challenger_id_check = Validator.isNull(challenger_id);
            
            var current_user_id = parseInt(params.challengeCompleterId);
            var current_user_id_check = Validator.isNull(current_user_id);
            
            var current_user_name = params.challengeCompleterName;
            var current_user_name_check = Validator.isNull(current_user_name);
            
            var opponent_id = parseInt(params.opponentId);
            var opponent_id_check = Validator.isNull(opponent_id);
            
            var source = params.source;
            var source_check = Validator.isNull(source);
			
            var grade_id = parseInt(params.gradeId);
            var grade_id_check = Validator.isNull(grade_id);
			
            var subject_id = parseInt(params.subjectId);
            var subject_id_check = Validator.isNull(subject_id);
			
            var subject_name = params.subjectName;
            var subject_name_check = Validator.isNull(subject_name);
			
            var test_id = parseInt(params.testId);
            var test_id_check = Validator.isNull(test_id);
			
            var marks_obtained = parseInt(params.marksObtained);
            var marks_obtained_check = Validator.isNull(marks_obtained);
			
            var total_time = parseInt(params.totalTime);
            var total_time_check = Validator.isNull(total_time);

            var test_duration = parseInt(params.testDuration);
            var test_duration_check = Validator.isNull(test_duration);

            var total_questions = parseInt(params.totalQuestions);
            var total_questions_check = Validator.isNull(total_questions);

            var chapter_id = parseInt(params.chapterId);
            var chapter_id_check = Validator.isNull(chapter_id);
			
            var question_list = params.questionList;
            var question_list_check = Validator.isNull(question_list);
			
            var token = params.token;
            var token_check = Validator.isNull(token);
//console.log(challenger_id_check, challenger_name_check, grade_id_check, subject_id_check, subject_name_check, 
//				test_id_check, source_check, marks_obtained_check, total_time_check, result_json_check,token_check);            
            
            if(challenge_id_check){
            
            if (!challenger_id_check && !opponent_id_check && !grade_id_check && !subject_id_check && 
                !subject_name_check && !test_id_check && !marks_obtained_check && 
                !total_time_check && !test_duration_check && !total_questions_check && !chapter_id_check && !question_list_check && !token_check) {
            
                var flag = Meteor.call('validateToken', challenger_id, token);
                if (flag){
                    //finding registration_id and pic of user
                    var query = Users.findOne(
                            {"id":opponent_id},
                            {fields: {"registration_id": 1}}
                    );
                    
                    var query1 = Users.findOne(
                            {"id":challenger_id},
                            {fields: {"name":1, "pic": 1}}
                    );
                    
                    //console.log('query',query[0].registration_id);
                    var image_url = "";
                    var challenger_name="User";
                    
                    if(query1){
                        challenger_name = query1.name;
                        if(query1.pic){
                            image_url  = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/"+query1.pic;
                        }
                    }
                    
                    //values to be sent into the notification collection
                    var notification_type = "bms";
                    var message_title = "Beat my score!!";
                    var message_subject = challenger_name;
                    var message = challenger_name+" has challenged you in "+subject_name;
                    var subject_gcm = "Beat My Score!!";
                    
                    //inserting value in bms collection
                    var data2 = Meteor.call("submit_bms",challenger_id, challenger_name, grade_id, subject_id, subject_name, test_id, 
                                marks_obtained, total_time, chapter_id, question_list,"Bms_Test");

                    var created_challenge_id="";
                    if(data2){
                        created_challenge_id = data2.challenge_id;
                    }
                    
//                    console.log('data1',data1);
                    //inserting value in notificaiton collection for the opponent user
                    var deeplink = "http://www.iprofindia.com/iprof/bms?challenger_id="+challenger_id+"&challenge_id="+created_challenge_id+"&bms_src='bms'&test_id="+test_id+"&test_name='bmstest'&test_duration="+test_duration+"&no_of_questions="+total_questions+"&chapter_id="+chapter_id; // change this deeplink to bms deeplink with params
                    console.log('deeplink',deeplink);
                    var data3 = Meteor.call("insert_notificaiton",opponent_id, notification_type, message_title, message_subject, message, image_url, deeplink);
//                    console.log('data2',data2);
                    // if value inserted in bms and notificaiton colleciton
                    if(query){
                             var reg_id = query.registration_id;
                            Meteor.setTimeout(function(){var data1 = Meteor.call("send_bms_notif", reg_id, subject_gcm, message, deeplink);}, 10000);
                             console.log('GCM Notification Send to ==',reg_id);
//                             var data1 = Meteor.call("send_bms_notif", reg_id, subject_gcm, message, deeplink);
                            //send deeplink, image, subject, title 
                    }

                    var response_challenge_id={
                        "challengeIdForSharing": created_challenge_id
                    }
                console.log('data2===',data2);
                console.log('data3===',data3);
                    if(data2 && data3){
                        var data = {
                            "result_data":response_challenge_id,
                            "status": true,
                        };	
                    }else{
                        var data = {
                            "status": false,
                            "message": "Challenge not sent!!"	
                        };
                    }			
                }else{ //if token is not validated
                    var data ={
                            "status": false,
                            "message": "Invalid user!"	
                    };
		        }
            }
            else{
                    var data ={ // if parameters are not passed correctly
                            "status": false,
                            "message": "Invalid params!"	
                    };
            }
            return data;
            }
            else{//Flow 2 i.e. User is playing from challenge
                if (!challenge_id_check && !challenger_id_check && !current_user_id_check && !source_check &&
                  !current_user_name_check && !marks_obtained_check && !total_time_check && !question_list_check && !token_check
                  && !grade_id_check && !test_id_check && !chapter_id_check
                   ) {
            
                var flag = Meteor.call('validateToken', current_user_id, token);
                if (flag){
                    //finding registration_id and pic of challenger
//                    console.log('step1');
                    var query = Users.findOne(
                            {"id":challenger_id},
                            {fields: {"registration_id": 1, "name":1, "pic":1}}     
                    );
//                    console.log('step2');
//                    console.log('query',query);

                    var query1 = Bms.findOne(
                        {"id": challenge_id},
                        {fields: {"subject_name":1,"marks_obtained": 1,"question_detail":1}}
                    );
//                    console.log('step3');
                    // console.log('query1',query1);
                    //console.log('query',query[0].registration_id);
                    var image_url = "";
                    var challenger_name="User";
                    var reg_id = "";
                    var subject_name = "";
                    var msssg = "";
                   
                    if(query){
                        challenger_name = query.name;
                        if(query.pic){
                            image_url  = "http://mcgrawhilldigi.schoolera.com/app/View/Themed/StudentTheme/webroot/img/user_pic/"+query.pic;
                        }else{
                            image_url  = "default";
                        }
                    }
                    
                    //values to be sent into the notification collection
                    var notification_type = "bms";
                    var message_title = "Beat my score!!";
                    var message_subject = current_user_name;




                    if(query1){
                        if (query1.marks_obtained<marks_obtained) {
                            var mssg = " has beaten you in ";
                        }else if(query1.marks_obtained>marks_obtained){
                            var mssg = " has lost in ";
                        }else if(query1.marks_obtained==marks_obtained){
                            var mssg = " has a draw in ";
                        }
                            subject_name = query1.subject_name;
                    }
                    
                    var message = current_user_name+mssg+subject_name;
                    var deeplink = "http://www.iprofindia.com/iprof/xyz"; // change this deeplink to bms deeplink with params
                    var subject_gcm = "Beat My Score!!";
                    var deeplink_gcm = "http://www.iprofindia.com/iprof/xyz";
                    var title_gcm = message_subject+mssg+subject_name;
                    //inserting value in bms collection
                    if(query){
                        reg_id  = query.registration_id;
                          Meteor.setTimeout(function(){Meteor.call("send_bms_notif", reg_id, subject_gcm, title_gcm, deeplink_gcm);}, 10000);
//                        var data1 = Meteor.call("send_bms_notif", reg_id, subject_gcm, title_gcm, deeplink_gcm);
                    }
//                    console.log('stepqqqq');
                    var data2 = Meteor.call("submit_bms_opponent",challenge_id, current_user_id, current_user_name, source, marks_obtained, total_time,question_list);
//                     console.log('step4');
//                    console.log('data1',data1);
                    //inserting value in notificaiton collection for the opponent user
                    var data3 = Meteor.call("insert_notificaiton",challenger_id, notification_type, message_title, message_subject, message, image_url, deeplink);
//                    console.log('data2',data2);
                    // if value inserted in bms and notificaiton colleciton
//                    console.log('step5');
                    var data4 =  Meteor.call("submit_bms_for_sharing",current_user_id, current_user_name,grade_id, test_id, 
                                marks_obtained, total_time, chapter_id, question_list);
                     
                    var created_challenge_id="";
                    if(data4){
                        created_challenge_id = data4.challenge_id;
                    }    
                    var challenger_marks = "";
                    var questionDetail=[];

                    if(query1){
                        challenger_marks = query1.marks_obtained;
                        questionDetail = query1.question_detail;
                    }

                    var response = {
                        "newChallengeIdForSharing":created_challenge_id,
                        "challengerUserName" : challenger_name,
                        "challengerImageURL" : image_url,
                        "challengerMarks" : challenger_marks,
                        "challengerTestDetails" : questionDetail
                    }

                    if(data2 && data3){
                        var data = {
                            "status": true,
                            "result_data": response
                        };	
                    }else{
                        var data = {
                            "status": false,
                            "message": "Challenge not sent!!"	
                        };
                    }			
                }else{ //if token is not validated
                    var data ={
                            "status": false,
                            "message": "Invalid user!"	
                    };
		}
            }
            else{
                    var data ={ // if parameters are not passed correctly
                            "status": false,
                            "message": "Invalid params!"	
                    };
            }
            return data;
            }
            
        } 
    });
    
    