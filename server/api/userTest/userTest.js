    var Api = new Restivus({
        apiPath: 'test',
        useDefaultAuth: false,
        prettyJson: true,
		defaultHeaders: {
      "Content-Type":"application/json",
	  "charset":"UTF-8"
    }
    });


    /* start  saveTestResult */
    Api.addRoute('saveTestResult', {
        post: function() {
            var params = this.bodyParams;
            console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
            var exit_course = params.exit_source;
            var exit_courseCheck = Validator.isNull(params.exit_source);
            var jsonResult = params.jsonResult;
            var jsonResultCheck = Validator.isNull(params.jsonResult);
            var token = params.token;
            var tokenCheck = Validator.isNull(params.token);
            var userId = parseInt(params.userId);
            var userIdCheck = Validator.isNull(params.userId);
			var testId = parseInt(params.testId);
            var testIdCheck = Validator.isNull(params.testId);

            if(params.showOnWeb==true ||params.showOnWeb=="true"){
                var showOnWeb=true;
            }else {
                var showOnWeb=false;
            }

            if (!jsonResultCheck && !tokenCheck && !userIdCheck && !testIdCheck) {
                var flag = Meteor.call('validateToken', userId, token);
                if (flag) {
                    var retVal = Meteor.call("saveTestResult", jsonResult, userId, testId);
                    if (retVal) {
                        //Submit Challenge 
                       
                    var userInfo = Users.findOne(
                            {"id":userId},
                            {fields: {"registration_id": 1,"name":1,"pic": 1}}
                    );
					
					var pipeline = [{
					$unwind: '$test'
					}, {
					$match: {
                    $and: [
                        {
                            "user_id": userId
                        }, {
                            "test.test_id": testId
                        }
                    ]
                },	
            }, {
                $project: {
                    "_id": 0,
                    "test": 1
                }
            },
            {$sort: {"test.created": -1}}
        ];
        var result = AttemptedTests.aggregate(pipeline);
        // console.log("userData", userData);
        if(result[0]){
        var userData = result[0]["test"];
		}else{
        var userData="";
		}
		var resultArr = [];
        var options_arr = [];
        var finalArr = [];
        var questArr = [];
		var obj = JSON.parse(jsonResult);
        var k = 0;
        var qID = [];
		if(userData) {
        for (var j = 0; j < userData['attempted_questions'].length; j++) {
            var qID = userData['attempted_questions'][j]['question_id'];
            var questions = Meteor.call('getQuestions', [qID],showOnWeb);
            var selected = false;
            for (var k = 0; k < questions[0]["options"].length; k++) {
                // console.log("len",questions[0]["options"].length);
                var selected = false;
                var option = (userData['attempted_questions'][j]['user_option']).split(',').map(Number);
                // console.log("option",option);
                if (option.length == 1) {
                    // for(x=0;x<userData[i]['attempted_questions'][j]['user_option'].length;x++){
                    if (option[0] == questions[0]['options'][k]['id']) {
                        var selected = true;
                        // }
                    }
                }   
                options = {
                    "id": questions[0]['options'][k]['id'],
                    "explanation": questions[0]['options'][k]['explanation'],
                    "statement": questions[0]['options'][k]['statement'],
                    // "key": questions[0]['options'][k]['key'],
                    "right_options": questions[0]['options'][k]['right_options'],
                    "selected": selected,
					"localSelectedOption":selected
                }
                options_arr.push(options);
                options = [];

            }

			for(var t1=0; t1 < obj.questions.length; t1++){
				if(questions[0]['id']==obj.questions[t1].id){
					var question_attempt_status=obj.questions[t1].status;
					var question_marks=obj.questions[t1].marks;
					var selectedAnswer=obj.questions[t1].selectedOptionid;
					var timetaken=obj.questions[t1].timetaken;
					break;
				}
			}
			
			
			for(var t2=0;t2 < questions[0].options.length; t2++){
					if(questions[0].options[t2].key==1){
						var correctAnswer=questions[0].options[t2].id;
						break;
					}
					else{
						var correctAnswer='';
					}
			}
			
            var quest = {
				"id": questions[0]['id'],
                "questionNumber" : questions[0]['id'], 
				"question_attempt_status" :question_attempt_status, 
				"question_statements" : questions[0]['question_statements'], 
				"question_marks" : question_marks, 
				"selectedAnswer" : selectedAnswer, 
				"timetaken" : timetaken,
                "question_type_id": questions[0]['question_type_id'],
                "difficulty_level_id": questions[0]['difficulty_level_id'],
                "options": options_arr
            }
            options_arr=[];
            questArr.push(quest);
            quest = [];

        }
					var grade_id=params.gradeId;
                    var subject_id="";
                    var subject_name="";
					var chapter_id=params.chapterId;
                    var image_url = "";
                    var challenger_name="User";
                    
					var marks_obtained = parseFloat(obj.marksObtained);
					var total_time_taken = obj.totalTimeTaken;
                    if(userInfo){
                        challenger_name = userInfo.name;
                    }
                    
                    //inserting value in bms collection
                    var submitBMS = Meteor.call("submit_bms",userId, challenger_name, grade_id, subject_id, subject_name, testId, 
                                marks_obtained, total_time_taken, chapter_id, questArr,"Normal_Test");

                    var created_challenge_id="";
					
                    if(submitBMS){
                        created_challenge_id = submitBMS.challenge_id;
                    }

                        var data = {
                            "status": true,
                            "result_data":{"challengeId":created_challenge_id,
                            "message": "Test Details has been saved successfully!"
                            }
                        };
                        return data;
                    }
                    else {
                        var data = {
                            "status": false,
                            "message": "Test Details has been saved failed!"
                        };
                        return data;
                    }
                }
                else {
                    return {status: "false", "message": "Invalid Token"};
                }
            }
			}
			else{
        return "";
    }
    }});

    

	
	    /* start  saveTestOffline */
    Api.addRoute('saveTestOffline', {
        post: function() {
            var params = this.bodyParams;

            var exit_course = params.exit_source;
            var exit_courseCheck = Validator.isNull(params.exit_source);

            var jsonResult = params.jsonResult;
            var jsonResultCheck = Validator.isNull(params.jsonResult);

            var token = params.token;
            var tokenCheck = Validator.isNull(params.token);
			
			var obj = JSON.parse(jsonResult);
            var testId = parseInt(obj.testId);

            var userId = parseInt(params.userId);
            var userIdCheck = Validator.isNull(params.userId);

            if (!jsonResultCheck && !tokenCheck && !userIdCheck) {
                var flag = Meteor.call('validateToken', userId, token);
                if (flag) {
                    var retVal = Meteor.call("saveTestOffline", jsonResult, userId);
                    if (retVal) {
                        var data = {
							"test_id":testId,
                            "status": true,
                            "message": "Test Details has been saved successfully!"
                        };
                        return data;
                    }
                    else {
                        var data = {
                            "status": false,
                            "message": "Test Details has been saved failed!"
                        };
                        return data;
                    }
                }
                else {
                    return {status: "false", "message": "Invalid Token"};
                }
            }
        }
    });

    /* start userTestAnalysis */
    Api.addRoute('userTestAnalysis', {
        post: function() {
		console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
            var params = this.bodyParams;
            var attemptStatus = parseInt(params.attemptStatus);
            var attemptStatusCheck = Validator.isNull(attemptStatus);

            var testId = parseInt(params.testId);
            var testIdCheck = Validator.isNull(testId);

            var token = params.token;
            var tokenCheck = Validator.isNull(token);

            var userId = parseInt(params.userId);
            var userIdCheck = Validator.isNull(userId);
			
			                 //    var userData = Meteor.call("userTestAnalysis", testId, userId);
                    // var data = {"status": true,
                    //     "result_data": userData
                    // };
                    // return data;

            if (!testIdCheck && !tokenCheck && !userIdCheck) {
                var flag = Meteor.call('validateToken', userId, token);
                if (flag) {
                    var userData = Meteor.call("userTestAnalysis", testId, userId);
                    if(userData){
                    var data = {"status": true,
                        "result_data": userData
                    };
                    return data;
                }else{
                    return {
                        status: false,
                            "message": "No data to show!!!"
                    };
                }
                }
                else{
                    return {
                        status: false,
                            "message": "Invalid token!!!"
                    };
                }
            }
            else{
                    return {
                        status: false,
                            "message": "Invalid Params!!!"
                    };
                }
        }
    });


    /* start userTestRank */
    Api.addRoute('userTestRank', {
        post: function() {
		console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
            var params = this.bodyParams;
			
            var testId = parseInt(params.testId);
            var testIdCheck = Validator.isNull(testId);

            var token = params.token;
            var tokenCheck = Validator.isNull(token);

            var userId = parseInt(params.userId);
            var userIdCheck = Validator.isNull(userId);
					
            if (!testIdCheck && !tokenCheck && !userIdCheck) {
                var flag = Meteor.call('validateToken', userId, token);
                if (flag) {
                    var userData = Meteor.call("userTestRank", testId, userId);
                    return userData;
                }
            }
        }
    });

     Api.addRoute('getPackageTest', {
        post: function() {
        console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
            var param = this.bodyParams;

            return Meteor.call('getPackageTest',param.testId);
    }
           
    });

         Api.addRoute('takeTest', {
        post: function() {
        console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
            var param = this.bodyParams;

    var flag=Meteor.call('validateToken',param.token,param.userId);
    console.log("flag",flag);
    if(param.showOnWeb==true ||param.showOnWeb=="true"){
                var showOnWeb=true;
            }else {
                var showOnWeb=false;
            }


    if(flag){
        if( !Validator.isNull(param.testId) &&
            !Validator.isNull(param.userId) &&
            !Validator.isNull(param.token) 

            ){    

        var qID=Meteor.call('getQuestionsId',parseInt(param.testId),parseInt(param.chapterId));

        if(qID){

          var result=Meteor.call('getQuestions',qID,showOnWeb);
          return {
                    status: true,
                            result_data:{ 
                                "questions":result
                            }
                        
                };
          
      }else
       {
            return {
                "status":false,
                "messsage": "No data to display!!!"
            };
       }
   }else{

            return {
                "status":false,
                "messsage": "Invalid Params!!!"
            };
       
   }
}else{
        return {
                "status":false,
                "messsage": "Invalid token!!!"
            };
   }
          
       

    }

          
    });
	
	Api.addRoute('submitQod', {
        post: function() {
            var params = this.bodyParams;
            var user_id = parseInt(params.userId);
            var user_id_check = Validator.isNull(user_id);

            var grade_id = parseInt(params.gradeId);
            var grade_id_check = Validator.isNull(grade_id);
			
			var subject_id = parseInt(params.subjectId);
            var subject_id_check = Validator.isNull(subject_id);
			
			var question_id = parseInt(params.questionId);
            var question_id_check = Validator.isNull(question_id);
			
			var user_ans = parseInt(params.userAns);
            var user_ans_check = Validator.isNull(user_ans);
			
			var correct_ans = parseInt(params.correctAns);
            var correct_ans_check = Validator.isNull(correct_ans);
			
            var token = params.token;
            var token_check = Validator.isNull(token);
			
            if (!user_id_check && !grade_id_check && !subject_id_check && !question_id_check && !user_ans_check && !correct_ans_check && !token_check) {
                var flag = Meteor.call('validateToken', user_id, token);
                if (flag) {
                    var submit_stat = Meteor.call("submitQuestion", user_id, grade_id, subject_id,question_id,user_ans,correct_ans);
					if(submit_stat.isUpdated==1){
						var result_data={
							"percentageStat":submit_stat.percentageStat ,
							"percentageMsg": submit_stat.percentageMsg
						};
						var data ={
							"status": true,
							"message": "Your answer has been submited.",
							"result_data": result_data
						};
					}else{
						var data ={// if value is not updated in collection
							"status": false,
							"message": "Your answer has not been submited.",
							"result_data": result_data
						};
					}
                }
				else{ //if token is not validated
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
    });
	
	
    Api.addRoute('userTestResults', {
        post: function() {
		console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
            var params = this.bodyParams;
			
            var testId = parseInt(params.testId);
            var testIdCheck = Validator.isNull(testId);

            var token = params.token;
            var tokenCheck = Validator.isNull(token);

            var userId = parseInt(params.userId);
            var userIdCheck = Validator.isNull(userId);

            if (!testIdCheck && !tokenCheck && !userIdCheck) {
                var flag = Meteor.call('validateToken', userId, token);
                if (flag) {
                    var userData = Meteor.call("userTestResults", testId, userId);
                    return {"status":true,
						"result_data":userData[0]['test']
						}
				}else{
				return {
                "status":false,
                "messsage": "Invalid token!!!"
				};
				}
            }
			 else{
                    return {
                        status: false,
                            "message": "Invalid Params!!!"
                    };
                }
		}
    });