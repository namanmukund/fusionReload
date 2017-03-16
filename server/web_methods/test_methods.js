var globalApiUrl = Meteor.settings.globalApiUrl;
var meteorServerUrl = Meteor.settings.meteorServerUrl;

Meteor.methods({
    saveUserTestWeb: function (userId, testId, jsonResult, chapterId, token) {
	this.unblock();
	try {
	    var result = HTTP.call("POST", meteorServerUrl+"/test/saveTestResult",
		{params: {
		    "userId":userId,
		    "token":token,
		    "jsonResult":jsonResult,
		    "testId":testId,
		    "chapterId":chapterId
		    
		}}
	    );
	    console.log('====');
	    console.log(result);
	    console.log('====');
	  return result;
	} catch (e) {
	  // Got a network error, time-out or HTTP error in the 400 or 500 range.
	  console.log(e)
	  return false;
	}
    }
});

Meteor.methods({
    getTestAnalysisDetailsWeb: function (userId, testId, token) {
	this.unblock();
	try {
	    var result = HTTP.call("POST", meteorServerUrl+"/test/userTestAnalysis",
		{params: {
		    "userId":userId,
		    "token":token,
		    "testId":testId
		    
		}}
	    );
	  return result;
	} catch (e) {
	  // Got a network error, time-out or HTTP error in the 400 or 500 range.
	  console.log(e);
	  return false;
	}
    }
});
