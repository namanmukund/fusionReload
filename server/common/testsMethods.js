

    /* start saveTestResult */
    Meteor.methods({
        'saveTestResult': function(jsonResult, userId, testId) {
            var obj = JSON.parse(jsonResult);
            //return obj.questions;
            var user_id = parseInt(userId);
            var testId = parseInt(testId);
            var attempted_count = parseInt(obj.attemptedCount);
            var unattempted_count = parseInt(obj.unattemptedCount);
            var correct_count = parseInt(obj.correctCount);
            var incorrect_count = parseInt(obj.inCorrectCount);
            var marks_obtained = parseFloat(obj.marksObtained);
            var total_time_taken = obj.totalTimeTaken;
            var attempted_questions = obj.questions;
            var resultArr = [];
             var date = new Date();
           
            date = new Date(date.setMinutes(date.getMinutes() + 330));
            for (var i = 0; i < attempted_questions.length; i++) {
                var temp = {
                    'question_id': parseInt(attempted_questions[i]["id"]),
                    'questionattemptstatus': parseInt(attempted_questions[i]["status"]),
                    'user_option': attempted_questions[i]["selectedOptionid"],
                    'marks': parseFloat(attempted_questions[i]["marks"]),
                    'timetaken': attempted_questions[i]["timetaken"]
                }
                resultArr.push(temp);
                temp = [];
            }

			var res = AttemptedTests.find({"user_id": parseInt(userId)}).count();
		    if(res==0){
               


		    var retVal = AttemptedTests.insert({"user_id":parseInt(userId),"test":[{"test_id": testId,
             "created":date,   
             "attemptedCount": attempted_count,
			"unattemptedCount": unattempted_count, "correctCount": correct_count, "inCorrectCount": incorrect_count, "marksObtained": marks_obtained,
            "totalTimeTaken": total_time_taken,"attempted_questions": resultArr}]
			});
			}else{
			var retVal =  AttemptedTests.update({"user_id": userId},{$addToSet: {"test": {
			"test_id": testId,
            "created":date, 
			"attemptedCount": attempted_count,
			"unattemptedCount": unattempted_count,
			"correctCount": correct_count, 
			"inCorrectCount": incorrect_count,
			"marksObtained": marks_obtained,
            "totalTimeTaken": total_time_taken,
			"attempted_questions":resultArr }}});
			}	
            return retVal;
        }});

    /* done */

	
	    /* start saveTestOffline */
    Meteor.methods({
        'saveTestOffline': function(jsonResult, userId, testId) {
            var obj = JSON.parse(jsonResult);
            //return obj.questions;
            var user_id = userId;
            var testId = parseInt(obj.testId);
            var attempted_count = parseInt(obj.attemptedCount);
            var unattempted_count = parseInt(obj.unattemptedCount);
            var correct_count = parseInt(obj.correctCount);
            var incorrect_count = parseInt(obj.inCorrectCount);
            var marks_obtained = parseFloat(obj.marksObtained);
            var total_time_taken = obj.totalTimeTaken;
            var attempted_questions = obj.questions;
            var resultArr = [];
            for (var i = 0; i < attempted_questions.length; i++) {
                var temp = {
                    'question_id': parseInt(attempted_questions[i]["id"]),
                    'questionattemptstatus': parseInt(attempted_questions[i]["status"]),
                    'user_option': attempted_questions[i]["selectedOptionid"],
                    'marks': parseFloat(attempted_questions[i]["marks"]),
                    'timetaken': attempted_questions[i]["timetaken"],
					'flagged': 0,
					'is_online_assessment':0
                }
                resultArr.push(temp);
                temp = [];
            }

			var res = AttemptedTests.find({"user_id": userId}).count();
		    if(res==0){
		    var retVal = AttemptedTests.insert({"user_id":userId,"test":[{"test_id": testId, "attemptedCount": attempted_count,
			"unattemptedCount": unattempted_count, "correctCount": correct_count, "inCorrectCount": incorrect_count, "marksObtained": marks_obtained,
            "totalTimeTaken": total_time_taken,"attempted_questions": resultArr}]
			});
			}else{
			var retVal =  AttemptedTests.update({"user_id": userId},{$addToSet: {"test": {
			"test_id": testId,
			"attemptedCount": attempted_count,
			"unattemptedCount": unattempted_count,
			"correctCount": correct_count, 
			"inCorrectCount": incorrect_count,
			"marksObtained": marks_obtained,
            "totalTimeTaken": total_time_taken,
			"attempted_questions":resultArr }}});
			}	
            return retVal;
        }});

    /* done */

    /* start userTestRank */
    Meteor.methods({
        'userTestRank': function(testId, userId) {
        /*    var distinctEntries = _.uniq(AttemptedTests.find({"test.test_id": testId}, {
                sort: {user_id: 1}, fields: {user_id: true}
            }).fetch().map(function(x) {
                return x.user_id;
            }), true);
		*/
			
		var countUser = AttemptedTests.find(
			{"test.test_id": parseInt(testId)}).count();
			
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
                    "test.marksObtained": 1

                }
            }
        ];
		
        var result = AttemptedTests.aggregate(pipeline);
		//return result;
        if(result.length > 0){
		var pipeline1 = [{
                $unwind: '$test'
				},{$match: {$and: [
                            {"test.test_id": testId},
                            {"test.marksObtained": {$gt: result[0]['test']['marksObtained']}}
                        ]
                    }
                },
                {
                    "$group": {
                        "_id": "$test.marksObtained",
                        "count": {"$sum": 1}
                    }
                }
            ];
			
        var results = AttemptedTests.aggregate(pipeline1);
		//return results1;
			
            var total = 0;
            for (i = 0; i < results.length; i++) {
                total = total + results[i]["count"];

            }
            total = total + 1;
            data = {"status": true,
                "total_students": countUser,
                "rank": total
            };
            return data;
		}else{
				var data = {"status": false,
							"message":'Test not found.'};
				return data;
		}
        }});
    /* done */



    /* start userTestAnalysis */
Meteor.methods({
    'userTestAnalysis': function(testId, userId) {
        // var userData = 
        // AttemptedTests.find({$and: [{"user_id": userId}, {"test_id": testId}]},{fields:{"_id": 0}}).fetch();
        // console.log(userData);
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
        // return userData;

        // 




        var resultArr = [];
        var options_arr = [];
        var finalArr = [];
        var questArr = [];
        var k = 0;
        var qID = [];
    if(userData) {
        for (var j = 0; j < userData['attempted_questions'].length; j++) {
            var qID = userData['attempted_questions'][j]['question_id'];
            // console.log("qID", qID);
            var questions = Meteor.call('getQuestions', [qID]);
            console.log("questions",JSON.stringify(questions));

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
                    "selected": selected
                }
                options_arr.push(options);
                options = [];

            }
            ////////////////
            var quest = {
                "id": userData['attempted_questions'][j]['question_id'],
                "questionNumber": userData['attempted_questions'][j]['question_number'],
                "question_attempt_status": userData['attempted_questions'][j]['questionattemptstatus'],
                "timetaken": userData['attempted_questions'][j]['timetaken'],
                "question_statements": questions[0]["question_statements"],
                "options": options_arr

            }
            options_arr=[];
            questArr.push(quest);
            quest = [];

        }

            var obj = {
                // "userId": userData['user_id'],
                "testId": userData['test_id'],
                "totalTimeTaken": userData['totalTimeTaken'],
                "attemptedCount": userData['attemptedCount'],
                "unattemptedCount": userData['unattemptedCount'],
                "correctCount": userData['correctCount'],
                "incorrectCount": userData['inCorrectCount'],
                "marksObtained": userData['marksObtained'],
                "questions": questArr,
                

            };
        //     finalArr.push(obj);
        //     obj = [];
        //     questArr=[];    
        // }


        return obj;
    }else{
        return "";
    }
    }

});

    /* done */




    /* start userTestResult */
    Meteor.methods({
        'userTestResult': function(testId, userId) {
            var userData = AttemptedTests.find({$and: [{"user_id": userId}, {"test_id": testId}]}, {fields: {"attempted_questions": 0}}).fetch();
            return userData;
        }});
    /* done */
	
	
	
	    /* start getAssessments */
		
    Meteor.methods({	
	        'getAssessments': function(chapterId){
        var pipeline = [
        {$unwind: '$subject'},
        {$unwind: "$subject.publisher.content.unit"},
        {$unwind: "$subject.publisher.content.unit.sub_unit"},
        {$unwind: "$subject.publisher.content.unit.sub_unit.chapter"},
        {$match: {"subject.publisher.content.unit.sub_unit.chapter.id":chapterId}},
        {$project: {
			"subject.publisher.content.unit.sub_unit.chapter.test":1
        }}
    ];
	          var result = Courses.aggregate(pipeline);
          var chapter=result[0]["subject"]["publisher"]["content"]["unit"]["sub_unit"]["chapter"]["test"];
		  var topic_content;
		  var resultArr = [];
		    for (var i = 0; i < chapter.length; i++) {
			if(topic_content=="Yes"){
				var user_rating = chapter[i]["user_ratings"];
				var user_rate = 0;
				if(user_rating!=undefined){
				var len = user_rating.length;
				for(var j=0; j < len; j++){
					user_rate = user_rate + user_rating[j]['ratings'];
				}
				user_rate = user_rate/len;	
				}
                var temp = {
                    "author_id": parseInt(chapter[i]["author_id"]),
                    "total_question": parseInt(chapter[i]["no_of_question"]),
                    "type": parseInt(chapter[i]["test_type"]),
                    "rating": parseInt(chapter[i]["rating"]),
                    "test_status": parseInt(chapter[i]["status"]),
					"test_name": chapter[i]["test_name"],
					"test_duration": chapter[i]["total_duration"],
					"total_marks": parseInt(chapter[i]["total_marks"]),
					"user_rating": user_rate
                }
                resultArr.push(temp);
                temp = [];
			}else{
            content_arr=[];
			}
		    var data = {"status": true,
                "result_data": {"test":resultArr}
            };
		  return data;
	}}
});
	
	/* end getAssessments */
	
	/*submit question of the day*/
	
	Meteor.methods({                                    // submit question of day
        'submitQuestion': function(user_id, grade_id, subject_id,question_id,user_ans,correct_ans){
			var date = new Date();
            date = new Date(date.setMinutes(date.getMinutes() + 330));
            var doc = {
				"user_id": user_id,
				"option_id": user_ans,
				"correct_answer": correct_ans,
				"action_date": date
			}	;
			var query = QdQwTransactions.update(
               {$and:[
                    {"course_id": grade_id},
                    {"subject_id": subject_id},
					{"question_id":question_id}
                ]},
                {"$push": 			
                {"user_answers": doc}
				});
		        //console.log('query',query);
				
			var query1 = QdQwTransactions.find(
				{$and: [
					{"course_id": grade_id},
					{"subject_id": subject_id},
					{"question_id":question_id}
				]},
				{fields: {"user_answers.correct_answer":1}}).fetch();
			

			//console.log('query1',query1);
			var correct_count = 0;
			if(query1[0]){
				var total_count = query1[0].user_answers.length;
				for (var i = 0; i < query1[0].user_answers.length; i++) { 
					//console.log('db',query3[0].user_answers[i].user_id);
					if(query1[0].user_answers[i].correct_answer==1){
						correct_count=correct_count+1;
					}
				}  
				if(correct_count!=0){
					
					//console.log('correct_count',correct_count);
					var result_percent = Math.round((correct_count/total_count)*100);
					var percentageStat = result_percent; // add percent symbol
				}else{
					var percentageStat = "0";
				} 
			}else{
				percentageStat = "0";
			}
			var data ={
				"percentageStat":percentageStat+"%",
				"percentageMsg": " people gave correct answer.",
				"isUpdated": query
			};
			return data;
		}                                 
    });


Meteor.methods({                                    
        'userTestDetails': function(userId,testId){
	  var query= AttemptedTests.find(
        {$and:[
            {"user_id":userId},
            {"test_id":{$in:testId}}
        ]},
        {fields:{
            "_id":0,
            "test_id":1,
            "test_status":1,
            "start_time":1,
            "end_time":1,
            "totalTimeTaken":1,
            "attemptedCount":1,
            "unattemptedCount":1,
            "correctCount":1,
            "inCorrectCount":1,
            "marksObtained":1,
        }}



       ).fetch();
	return query;
    // return query[0].attempted_questions.length;
        }                                 
    });



    Meteor.methods({
        'getQuestions': function(questionId,showOnWeb) {

            if(showOnWeb==true || showOnWeb=="true"){
            var query=QuestionMasters.find({
                "id": {$in: questionId}
                // "question_type":"MCQ"

                }).fetch();

        }else{

            var query=QuestionMasters.find({
                "id": {$in: questionId},
                "question_type":"MCQ"

                }).fetch();
        }
    
            var options=[];
            var options_arr=[];
            var response=[];
            var response_arr=[];
        if(query[0]){
            for(i=0;i<query.length;i++){

                for(j=0;j<query[i]["options"].length;j++){

                        if(query[i]["options"][j]["key"]=="0"){
                            var right_options=false;
                        }else{
                            var right_options=true;
                        }

                        options={
                    "id":query[i]["options"][j]["id"],
                    "explanation":query[i]["options"][j]["explanation"], 
                    "statement":query[i]["options"][j]["statement"],
                    "key":query[i]["options"][j]["key"],
                    // "option_image": query[i]["options"][j]["option_image"],
                       // "explain_image":query[i]["options"][j]["explain_image"],
                    "right_options": right_options
                };
                options_arr.push(options);
                options=[];
                }
                

             response={   
            "id":query[i]["id"],
            "question_marks": query[i]["marks"],
            "hint": query[i]["hint"],
            // "ques_image": query[i]["question_image"],
            "question_statements": query[i]["statement"], 
            "difficulty_level_id": query[i]["difficulty_level"],
            "question_type_id": query[i]["question_type"],
			"duration":query[i]["duration"],
            // "block_count": query[i][""]
            // "block": query[i][""]
            "options": options_arr

                };

                response_arr.push(response);
                response=[];
                options_arr=[];


            }
        }else{
            var response_arr="";
        }

            return response_arr;
        }

    });



     Meteor.methods({
        'getQuestionsId': function(testId,chapterId) {

            var pipeline = [
        {
            $unwind: '$test'
        }, 
        {
            $match: {
                "id": chapterId,
                "type":"chapter",
                "test.id":testId,
                "test.is_deleted":0,
                "test.status":2
                

            }
        }, {
            $project: {
                "_id":0,
                "test.test_section.question_id": 1

                    }
        }   

    ];
    // console.log("testId",testId);
    var result = TestsCollection.aggregate(pipeline);
    // console.log("getQuestionsId",JSON.stringify(result));
    if(result[0]){
    var response= result[0].test.test_section.question_id;
}else{
    var response="";

}
    // console.log("response",JSON.stringify(response));
    return response;
           

        }

    });



  Meteor.methods({
        'testJson': function(chapter) {
            var resultArr=[];
            for (var i = 0; i < chapter.length; i++) {
            var temp = {
                    "test_id":parseInt(chapter[i]["id"]),
                    "author_id": parseInt(chapter[i]["author_id"]),
                    "total_question": parseInt(chapter[i]["no_of_question"]),
                    "type": parseInt(chapter[i]["test_type"]),
                    "rating": parseInt(chapter[i]["rating"]),
                    "test_status": parseInt(chapter[i]["status"]),
                    "test_name": chapter[i]["test_name"],
                    "test_duration": chapter[i]["total_duration"],
                    "total_marks": parseInt(chapter[i]["total_marks"]),
                    // "user_rating": user_rate
                    // "userTestDetails":userTestDetails
                }
                resultArr.push(temp);
                temp = [];
            }

return resultArr;
            }

    });


          Meteor.methods({
            'getChapterTest': function(chapterId,gradeId,userId) { 
                var pipeline = [
        {$unwind: '$test'}, 
        {$match: {
                "id":chapterId,
                "course_id":gradeId,
                // "subject_id": subjectId,
                "type":"chapter",
                "test.status":2,
                "test.is_deleted":0,
                "test.test_type":54,
                "test.test_name":{$regex:"Quick Test*"}

                // "subject.publisher.content.unit.sub_unit.chapter":{$exists:true}
                }
        }, 
        {$project: {
                // "subject.publisher.content.unit.sub_unit.chapter.id": 1,
                "_id":0,
                "id":1,
                "test":1,
                // "test.id":1,
                // "test_name":1,
                // "test.total_duration":1,
                // "test.test_type":1,
                // "test.test_section.question_id":1
                
                }
        }
        // ,{ $limit : 50 }

    ];
    var result = TestsCollection.aggregate(pipeline);
    // return result;
    response_arr=[];
    // console.log(result.length);

if(result[0]){
    for(var i=0;i<result.length;i++){
        var attempted="Not Attempted";
        var count=Meteor.call('studentTestAttempted',result[i]["test"]["id"],userId);
        
        if(count!=0){
           var attempted="Attempted";  
        }

        if(result[i]["test"]["no_of_question"]<result[i]["test"]["total_duration"]){
            var test_duration=result[i]["test"]["no_of_question"];
        }else{
            var test_duration=result[i]["test"]["total_duration"];
        }

    var response=
    {
    "chapterId":chapterId,
    "test_id":result[i]["test"]["id"],
    "total_question":result[i]["test"]["no_of_question"],
    "type":result[i]["test"]["test_type"],
    "rating":result[i]["test"]["rating"],
    "test_status":result[i]["test"]["status"],
    "test_name":result[i]["test"]["test_name"],
    "test_duration":test_duration,
    "total_marks":result[i]["test"]["total_marks"],
    "student_status":attempted
}
response_arr.push(response);
response=[];

}
return response_arr;
}else{
return [];
}

    // return result;

                }
        
        }); 

 Meteor.methods({
            'studentTestAttempted': function(testId,userId) { 
                return AttemptedTests.find({"user_id":userId,"test.test_id":testId}).count();

            }
        
        }); 

		
Meteor.methods({                                    
    'userTestResults': function(testId,userId){
		var pipeline1 = [{
                $unwind: '$test'
            }, {
                $match: {
                            "test.id": testId,
                            "test.is_deleted":0,
                            "test.status":2
                        }
                },{
					$project:{
						"test.total_marks":1,
						"test.total_duration":1,
						"test.no_of_question":1
					}
				}
        ];
        var result1 = TestsCollection.aggregate(pipeline1);
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
            "test.test_id":1,
            "test.totalTimeTaken":1,
            "test.attemptedCount":1,
            "test.unattemptedCount":1,
            "test.correctCount":1,
            "test.inCorrectCount":1,
            "test.marksObtained":1,
                }
            }
        ];
        var result = AttemptedTests.aggregate(pipeline);
		var userData = Meteor.call("userTestRank", testId, userId);
		result[0]['test']['total_student'] = userData['total_students'];
		result[0]['test']['rank'] = userData['rank'];
		result[0]['test']['testTotalDuration']=result1[0]['test']['total_duration'];
		result[0]['test']['testTotalQuestions']=result1[0]['test']['no_of_question'];
		result[0]['test']['testTotalMarks']=result1[0]['test']['total_marks'];
		result[0]['test']['testTotalTaken']=result[0]['test']['totalTimeTaken'];
		return result;
        }                                 
    });
	
	
	
