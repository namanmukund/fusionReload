    var Api = new Restivus({
        apiPath: 'test',
        useDefaultAuth: false,
        prettyJson: true
    });

    /* start  saveTestResult */
    Api.addRoute('saveTestResult', {
        post: function() {
            var params = this.bodyParams;

            var exit_course = params.exit_source;
            var exit_courseCheck = Validator.isNull(params.exit_source);

            var jsonResult = params.jsonResult;
            var jsonResultCheck = Validator.isNull(params.jsonResult);

            var token = parseInt(params.token);
            var tokenCheck = Validator.isNull(params.token);

            var userId = parseInt(params.userId);
            var userIdCheck = Validator.isNull(params.userId);

            if (!exit_courseCheck && !jsonResultCheck && !tokenCheck && !userIdCheck) {
                var flag = Meteor.call('validateToken', userId, token);
                if (flag) {
                    var retVal = Meteor.call("saveTestResult", exit_course, jsonResult, token, userId);
                    if (retVal == 1) {
                        var data = {
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
            var params = this.bodyParams;
            var attemptStatus = parseInt(params.attemptStatus);
            var attemptStatusCheck = Validator.isNull(attemptStatus);

            var testId = parseInt(params.testId);
            var testIdCheck = Validator.isNull(testId);

            var token = parseInt(params.token);
            var tokenCheck = Validator.isNull(token);

            var userId = parseInt(params.userId);
            var userIdCheck = Validator.isNull(userId);

            if (!attemptStatusCheck && !testIdCheck && !tokenCheck && !userIdCheck) {
                var flag = Meteor.call('validateToken', userId, token);
                if (flag) {
                    var userData = Meteor.call("userTestAnalysis", testId, userId);
                    var data = {"status": true,
                        "result_data": userData
                    };
                    return data;
                }
            }
        }
    });


    /* start userTestRank */
    Api.addRoute('userTestRank', {
        post: function() {
            var params = this.bodyParams;

            var attemptStatus = parseInt(params.attemptStatus);
            var attemptStatusCheck = Validator.isNull(attemptStatus);

            var testId = parseInt(params.testId);
            var testIdCheck = Validator.isNull(testId);

            var token = parseInt(params.token);
            var tokenCheck = Validator.isNull(token);

            var userId = parseInt(params.userId);
            var userIdCheck = Validator.isNull(userId);
			
            if (!attemptStatusCheck && !testIdCheck && !tokenCheck && !userIdCheck && !vendorNameCheck) {
                var flag = Meteor.call('validateToken', userId, token);
                if (flag) {
                    var userData = Meteor.call("userTestRank", testId, userId);
                    return userData;
                }
            }
        }
    });



    /* start userTestResult */
    Api.addRoute('userTestResult', {
        post: function() {
            var params = this.bodyParams;
            var testId = params.testId;
            var testIdCheck = Validator.isNull(testId);

            var token = parseInt(params.token);
            var tokenCheck = Validator.isNull(token);

            var userId = parseInt(params.userId);
            var userIdCheck = Validator.isNull(userId);

            var vendorKey = params.vendorKey;
            var vendorKeyCheck = Validator.isNull(vendorKey);

            var vendorName = params.vendorName;
            var vendorNameCheck = Validator.isNull(vendorName);

            if (!testIdCheck && !tokenCheck && !userIdCheck) {
                var flag = Meteor.call('validateToken', userId, token);
                if (flag) {
                    var userData = Meteor.call("userTestResult", testId, userId);
                    var resultArr = [];
                    var temp = {
                        "userId": parseInt(userData[0]['user_id']),
                        "attemptedCount": parseInt(userData[0]['attempted_Count']),
                        "unattemptedCount": parseInt(userData[0]['unattempted_Count']),
                        "correctCount": parseInt(userData[0]['correct_Count']),
                        "incorrectCount": parseInt(userData[0]["inCorrect_Count"]),
                        "marksObtained": parseInt(userData[0]["marks_Obtained"]),
                        "totalTimeTaken": parseInt(userData[0]["total_Time_Taken"])
                    }
                    resultArr.push(temp);
                    temp = [];

                    var data = {"status": true,
                        "result_data": resultArr
                    };
                    return data;
                }
            }
        }
    });

