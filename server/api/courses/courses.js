var Api = new Restivus({
    apiPath: 'course',
    useDefaultAuth: false,
    prettyJson: true,
	defaultHeaders: {
      "Content-Type":"application/json",
	  "charset":"UTF-8"
    }
});

var IprofCache = function(cacheName, ttl) {
  this.localCache = new Mongo.Collection("cache_" + cacheName);
  // apply index for key
  this.localCache._ensureIndex( { "key": 1 });

  // ttl = ttl || 60;
  // ensure key expiration
  this.localCache._ensureIndex({ "createdAt": 1 }, { expireAfterSeconds: ttl });
};

/**
 * Set key and value to the cache
 * @param key
 * @param value
 */
IprofCache.prototype.set = function (key, value) {
	var date = new Date();
            
            date = new Date(date.setMinutes(date.getMinutes() + 330));
  this.localCache.insert(
    {
      key: key,
      value: value,
      createdAt: date
    }
  );
}

/**
 * Get value from the cache
 * @param key to search for
 * @returns found value
 *  or undefined if not found
 */
IprofCache.prototype.get = function (key) {
  var value = this.localCache.findOne({key: key}, {_id: true, value: true});
  if (value) {
    return value.value;
  }
  return value;
}


  var cache = new IprofCache('fusion', 6000000000);



/* start removeFromMyCourses */
Api.addRoute('removeFromMyCourses', {
    post: function () {
	console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
        var params = this.bodyParams;
        var userId = parseInt(params.userId);
        var userIdCheck = Validator.isNull(userId);

        var token = params.token;
        var tokenCheck = Validator.isNull(token);

        var packageId = parseInt(params.packageId);
        var packageIdCheck = Validator.isNull(packageId);

        if(!userIdCheck && !tokenCheck){
        var flag = Meteor.call('validateToken', userId, token);   //Check User Token
        }
        if (flag) {
        if (!userIdCheck && !packageIdCheck) {
            var data = Meteor.call("removeFromMyCourses",userId,packageId);
            return data;
        }
        }else {
                return {status: false, "message": "Invalid Token"};
        }

    }
});



// Start suggestedCoursesTocListing API
Api.addRoute('suggestedCoursesTocListing', {
    post: function () {
	console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
        var params = this.bodyParams; /* reading bodyParams */
        var userId = Validator.isNull(params.userId);
        var token = Validator.isNull(params.token);
        var subjectId = Validator.isNull(params.subjectId);
        var isPackageId = Validator.isNull(params.packageId);
		var gradeId = Validator.isNull(params.gradeId);
		var isTestSeries="0";
    if(!Validator.isNull(params.isTestSeries)){
     isTestSeries =params.isTestSeries
    }	else{
      isTestSeries="0";
    }
        if (!userId && !token && !isPackageId&&!subjectId&&!gradeId) { //Check Mandatory Params
            var flag = Meteor.call('validateToken', params.userId, params.token);	//Check User Token
            if (flag) {
              //Check PackageType i.e. isTestSeries =0/1 "is_test_series":1
              var queryResult = Packages.find( {"id":parseInt(params.packageId)},
                
                 
                   { fields:
                    {"id":1,"name":1,
                    "is_test_series":1 }}).fetch(); 
                    if(queryResult&&queryResult.length>0){
                      isTestSeries=queryResult[0]["is_test_series"];
                    } 
   
      

			var keyForCache = this.request.url+params.gradeId+params.subjectId +isTestSeries;
			//Caching Process start			
			var dataFromCache = cache.get(keyForCache);
		  //console.log("dataFromCache===="+JSON.stringify(dataFromCache));
          if (dataFromCache) {
		  console.log("Cache avail");
		  // data is cached, do not bother with calculation, just send it back
		  //Check User Purchase 
		 // purchasedChapter=Meteor.call("isPurchasedChapter",parseInt(params.userId),parseInt(chapterId));
		 if(dataFromCache["result_data"]["chapters"].length>0){		 
		 for(var i=0; i <dataFromCache["result_data"]["chapters"].length; i++ ){
		 var chapId= dataFromCache["result_data"]["chapters"][i]["id"];
		 purchasedChapter=Meteor.call("isPurchasedChapter",parseInt(params.userId),parseInt(chapId));
		 //console.log("purchasedChapter in API=="+purchasedChapter+",chapId="+chapId);
		 dataFromCache["result_data"]["chapters"][i]["isPurchased"]=purchasedChapter;
		 }		 
		 }		 
		  return dataFromCache;            
           // this.response.end(JSON.stringify(dataFromCache));
          } else { 
       console.log("No Cache avail");
			//Caching Process END
				var response=[];				
                var chapterArr=Meteor.call("getChaptersBySubjectId",parseInt(params.gradeId),parseInt(params.subjectId),isTestSeries);	
				//return chapterArr;
				//console.log("chapterArr====="+JSON.stringify(chapterArr));
//return 	chapterArr;	
		
				if(chapterArr.length>0){
				
				var subjects=[];
				var chapters=[];
				//var userSubscription=Meteor.call("userSubscription", parseInt(params.userId));
				
				//if(userSubscription){
				//if(userSubscription.length){
				//var plan=userSubscription[0]["subscription_plan"]
				//var validity=userSubscription[0]["subscription_validity"]
				//}
				//if(validity){
				//userSubscription=true;
				//}else{
				//userSubscription=false;
				//}
				//}
				//var loop=chapterArr.length;
				//if(loop>chapterArr.length){
				//loop=chapterArr.length;
			//	}
				
				// Making  Packages Array
				var packageArr=[];
				for(var x=0; x<chapterArr.length; x++){
				var packageId=chapterArr[x]["package_id"];
				if(packageId!=0){
				packageArr.push(packageId);
				}
				}
				console.log("packageArr=="+packageArr);
				var packageChapterPrice=Meteor.call("getPackagePrice",packageArr);
				//return packageChapterPrice;
				var chapterPackageArr={};
				if(packageChapterPrice){
				if(packageChapterPrice.length>0){
				//if(chapterPrice["package_subscription"].length>0){
				 
				for(var z=0; z<chapterArr.length; z++){
				
				if(packageChapterPrice[z]){				
				chapterPackageId=packageChapterPrice[z]["id"];
				console.log("chapterPackageId=="+chapterPackageId);
				var is_free_for_preview=packageChapterPrice[z]["is_free_for_preview"];
				//console.log("packageChapterPrice=="+JSON.stringify(packageChapterPrice[z]));
				chapterPackageArr[chapterPackageId]=packageChapterPrice[z];
				}
				}
				}
				}
				//return chapterPackageArr;
				//console.log("userSubscription======"+userSubscription+" for "+parseInt(params.userId));
				//return userSubscription;
				for(k=0; k<chapterArr.length; k++){	
				var totalVideo=0;
				var totalNotes=0;
				var totalTest=0;
				var price=0;
				var discountedPrice=0;
				var chapterPackageId=0;
				var chapterPackageSubscriptionId=0;
				var is_free_for_preview=0;
				var duration=6;
								
				//var chapters=chapterArr[k]["subject"]["publisher"]["content"]["unit"]["sub_unit"]["chapter"];
				var chapterId=chapterArr[k]["id"];
				
				var chapterName=chapterArr[k]["heading"];
				totalVideo=chapterArr[k]["video_count"];
				totalNotes=chapterArr[k]["pdf_count"];
				totalTest=chapterArr[k]["test_count"];				
				var packageId=chapterArr[k]["package_id"];
				console.log("packageId=="+packageId);
				var purchasedChapter=true;
				//if(!userSubscription){				
				purchasedChapter=Meteor.call("isPurchasedChapter",parseInt(params.userId),parseInt(chapterId));
				//}else{
				//purchasedChapter=false;
				//}
				var chapterPrice=chapterPackageArr[packageId];//Meteor.call("getPackagePrice",parseInt(packageId));
				//return chapterPrice;
				//console.log("chapterPrice===========",JSON.stringify(chapterPrice));
				if(chapterPrice){
				//if(chapterPrice.length>0){
				//if(chapterPrice["package_subscription"].length>0){
				price=chapterPrice["package_subscription"]["subscription_cost"];
				discountedPrice=chapterPrice["package_subscription"]["discounted_cost"];
				chapterPackageSubscriptionId=chapterPrice["package_subscription"]["id"];
				duration=chapterPrice["package_subscription"]["subscription"]["duration"];
				chapterPackageId=chapterPrice["id"];
				is_free_for_preview=chapterPrice["is_free_for_preview"];
				console.log("chapterPackageId="+chapterPackageId+",price=="+price+",discountedPrice=="+discountedPrice);
				//}
				}
				var isPaid=false;
				if(is_free_for_preview=='0'&&price>0){
				isPaid=true;
				}
				
				//Have to parse chapterPrice
				//console.log("chapterPrice=="+JSON.stringify(chapterPrice));
				//return chapterPrice;
				
				var obj={"id":chapterId,"heading":chapterName,"totalVideos":totalVideo,"totalNotes":totalNotes,
				"isPurchased":purchasedChapter,	
				"isPaid":isPaid,				
		  "price":price,
		  "discountedPrice":discountedPrice,
		  "duration":duration,
		  //"quickTests":10,
          //"shortTests":15,
          //"longTests":20,
          //"testsTaken":5,
		  "packageId":packageId,
		  "packageSubscriptionId":chapterPackageSubscriptionId,
          "totalTests":totalTest				
				};
				chapters.push(obj);
				}
				responseInfo= {status: true,"result_data":{"subjects":subjects,"chapters":chapters}};
			// retrieve the data from anywhere as data is not cached
            var dataHardToGet = { heavy_calculation: true };
            // store data in the cache using url and Param as a key
            cache.set(keyForCache, responseInfo);
			 return responseInfo;
           // this.response.end(JSON.stringify(responseInfo));
				}else{
				 return {status: false, "message": "Chapters Not Found"};
				}
              
			}
            } else {
                return {status: false, "message": "Invalid Token"};
            }
        }else{
		return {status: false, "message": "Invalid Params"};
		}
		
		
		
		
    }
});
/* done */


/* done */

/* start addCourseToMyCourses */
Api.addRoute('addCourseToMyCourses', {
    post: function () {
	console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
        var params = this.bodyParams;
        var userId = parseInt(params.userId);
        var token = params.token;
        var tokenCheck = Validator.isNull(token);
        var userIdCheck = Validator.isNull(userId);
        var packageId = parseInt(params.packageId);
        var packageIdCheck = Validator.isNull(params.packageId);
        if(!userIdCheck && !tokenCheck){
        var flag = Meteor.call('validateToken', userId, token);   //Check User Token
        }
        if (flag) {
        if (!userIdCheck && !packageIdCheck) {
            var data = Meteor.call("addCourseToMyCourses", userId, packageId);
            return data;
        }
        }else {
                return {status: false, "message": "Invalid Token"};
        }
    }
}
);
/* done */


Api.addRoute('mainPdpPage', {
        post: function() {
		console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
            var param = this.bodyParams;

           // var dataP="49846";
           var data= Meteor.call('mainPdpPage',parseInt(param.courseId),parseInt(param.userId));
          // var data= Meteor.call('mainPdpPage',parseInt(param.courseId));
         var response=  { "status": true,"result_data": {
        "CourseInfoRecord":data
        }};
    return response; 
    }
           
    });


        Api.addRoute('getPackageChapter', {
        post: function() {
		console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
            var param = this.bodyParams;
            var isTestSeries=0;
            isTestSeries=param.isTestSeries;
            var flag = Meteor.call('validateToken', param.userId, param.token); 
            if(flag){
              //Check PackageType is Test series
              var queryResult = Packages.find( {"id":parseInt(param.packageId)},                
                 
                   { fields:
                    {"id":1,"name":1,
                    "is_test_series":1 }}).fetch(); 
                    if(queryResult&&queryResult.length>0){
                      isTestSeries=queryResult[0]["is_test_series"];
                    } 

           var keyForCache = this.request.url+param.gradeId+param.chapterId+isTestSeries;
			//Caching Process start
			var dataFromCache = cache.get(keyForCache);
		  //console.log("dataFromCache===="+JSON.stringify(dataFromCache));
		  if(dataFromCache){
		  	//console.log("dataFromCache",JSON.stringify(dataFromCache));

         if (dataFromCache["result_data"]["test"]) {
		  // data is cached, do not bother with calculation, just send it back
		  
		 	 // return dataFromCache;
	for(var i=0;i<dataFromCache["result_data"]["test"].length;i++){
		// console.log("i",i);
        var attempted="Not Attempted";
        var count=Meteor.call('studentTestAttempted',dataFromCache["result_data"]["test"][i]["test_id"],parseInt(param.userId));
        // console.log("count",count);
        if(count!=0){
           var attempted="Attempted";  
        	} 
        	dataFromCache["result_data"]["test"][i]["student_status"]=attempted;
        	
        }
        console.log("cacheavail1 GPC"); 
        return dataFromCache;          
           
          }
          else{
          	//console.log("cacheavail2 GPC");
          	//console.log("cacheavail2 GPC",JSON.stringify(dataFromCache));
          	return dataFromCache;
          }
      }
           else { 

            var response=Meteor.call('getPackageChapter',
                parseInt(param.gradeId),parseInt(param.chapterId),isTestSeries,parseInt(param.userId));
            //  console.log("response",JSON.stringify(response));
            
            if(response){
                if(isTestSeries=="0"){
                	
                    var responseInfo= {status: true, result_data: response};
                    cache.set(keyForCache, responseInfo);
                    // console.log("response");
                    return responseInfo;
                }else if(isTestSeries=="1" && response.length>0){
                		
                    var responseInfo= {status: true, result_data:{
                        "test": response}
                    };
                    cache.set(keyForCache, responseInfo);
                    return responseInfo;


                }else{
                    return {status: false, message: "Invalid request!!!"};
                }
        }else{
            return {status: false, message: "No data to show!!!"};
        }}
            }
             else{
                 return {status: false, message: "Invalid token!!!"};
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


          var qID=Meteor.call('getQuestionsId',parseInt(param.testId));
        // return qID;
          var result=Meteor.call('getQuestions',qID);
          return result;

    }
          
    });


    Api.addRoute('getWallData', {
        post: function() {
		console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
            var param = this.bodyParams;
            var subjectId=(param.subjectId).split(',').map(Number);
            var gradeId=parseInt(param.gradeId);

        var getQdData= Meteor.call('getQdData',5,[12],[24]);
         var trendingCourses= Meteor.call('displayTrendingCourses',gradeId,subjectId,5);
        var wallCount= Meteor.call('getWallCountData',gradeId,subjectId);
         // return wallCount;
         var funZone= Meteor.call('funZone',gradeId,subjectId,1);
         var response=
            {
                "course_count":wallCount["countCourse"]+wallCount["countSubject"],
                "tutor_count": 0,
                "test_count": wallCount["countCourseTest"]+wallCount["countSubjectTest"],
                "trending_courses":trendingCourses,
                "question_of_day_data": getQdData,
				"total_funzone_count":funZone["total_result_count"],
                "fun_zone":funZone["gcm_data"]
            };
         
            if(response){
                    return {
                            status: true,
                            result_data: response
                        };
            }
    }
          
    });

Api.addRoute('getMyCoursesListing', {
        post: function() {
		
 console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams));

	          var param = this.bodyParams;  
    var flag=Meteor.call('validateToken',param.token,param.userId);
    if(flag){
        if( 
            !Validator.isNull(param.token) &&
            !Validator.isNull(param.userPurchased) &&
            !Validator.isNull(param.userId) &&
            !Validator.isNull(param.isTestSeries)

            ){
              

            
        if(param.userPurchased=="true"){
            var result= Meteor.call('getMyPurchasedCoursesListing',parseInt(param.userId),param.isTestSeries);
            if(result &&result.length>0){
                return {
                    status: true,
                            result_data: {
                                "batch":result 
                            }
                        
                };
            }else{
               return {
                    status: false,
                            message: "No lists to display!!!"
                        
                };
            }
        }
        else if(param.userPurchased=="false"){
            var result= Meteor.call('getMyCoursesListing',parseInt(param.userId),param.isTestSeries);
            if(result){
                return {
                    status: true,
                            result_data: {
                                "batch":result 
                            }
                        
                };
            }else{
               return {
                    status: false,
                            message: "No lists to display!!!"
                        
                };
            }

        }else{
            return {
                    status: false,
                            message: "Invalid Params!!!"
                        
                };

        }
    }else{
        return {
                status: false,
                message: "Invalid Params!!!"
            };
        }
    }
    else{
        return {
                status: false,
                message: "Invalid token!!!"
            };
        }
    
    }
         
});


Api.addRoute('viewAllCourses', {
        post: function() {

        console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams));

              var param = this.bodyParams; 
              
                // console.log(param.gradeId);
                
                
                // console.log(param.gradeId);
               

        var subjectId=(param.subjectId).split(',').map(Number);
            //console.log("onesubject",subjectId);

            var gradeId=parseInt(param.gradeId);
            var flag=Meteor.call('validateToken',param.token,param.userId);
    if(flag){
        if( !Validator.isNull(param.id) &&
            !Validator.isNull(param.subjectId) &&
            !Validator.isNull(param.gradeId) &&
            !Validator.isNull(param.userId)

            ){

             var count=Meteor.call('getWallCountData',gradeId,subjectId);


               
            if (parseInt(param.id)==1){
                    var course = Meteor.call('getCourseList',gradeId,subjectId,count["countCourse"],param.userId);

                    // var subjectLevel=[];

				// var course = Meteor.call('getCourseList',gradeId,subjectId,2,param.userId);                
				// return course;	
                if(course[0]){
                	// var subjectArr=[];
                // var packageId=course[0]["PsCourseId"];
				
				var comprehensiveCourses={
					"title":course[0]["GradeName"],
					// "id":1,
					// "subjectId":param.subjectId,
					"totalCount":count["countCourse"],
					"list":course
				};
					
                	
                
                    return {
                                    status: true,
                                    result_data: comprehensiveCourses
                };
            }
               }
                else if(parseInt(param.id)==2){
                	var subjectCount=Meteor.call('individualSubjectCount',gradeId,parseInt(param.subjectId),"0");
                	var subject = Meteor.call('getSubjectList',gradeId, [parseInt(param.subjectId)],subjectCount,param.userId);
				

			console.log(subjectCount+param.subjectId);
				// console.log(JSON.stringify(subject));
				if(subject[0]){
				var doc={
					"title":subject[0]["subjects"][0]["name"],
					// "id":2,
					// "subjectId":subjectId[i],
					"totalCount":subjectCount,
					"list":subject
				};

				return {
                                    status: true,
                                    result_data:doc
                    };
					 
                }else{
				return {
                                    status: false,
                                    message:"No course found"
                    };
				}
                    
                    
                }
                    else if(parseInt(param.id)==3){



				var course = Meteor.call('getTestCourseList',gradeId,subjectId,count["countCourseTest"],param.userId);                
				// return course;	
                if(course[0]){
                	// var subjectArr=[];
				
				var comprehensiveCourses={
					"title":course[0]["GradeName"],
					// "id":param.subjectId,
					// "subjectId":param.subjectId
					// "idType":gradeId,
					"totalCount":count["countCourseTest"],
					"list":course
				};
					
                


                       
                        return {
                                    status: true,
                                    result_data: comprehensiveCourses
                        };
                    }
                }
                        else if(parseInt(param.id)==4){

               var subjectCount=Meteor.call('individualSubjectCount',gradeId,parseInt(param.subjectId),"1");         		
               var subject = Meteor.call('getTestSubjectList',gradeId, [parseInt(param.subjectId)],
               	subjectCount,param.userId);
				

				
				if(subject[0]){
				var doc={
					"title":subject[0]["subjects"][0]["name"],
					// "id":4,
					// "subjectId":subjectId[i],
					"totalCount":subjectCount,
					"list":subject
				};
				 return {
                                    status: true,
                                    result_data: doc
                                    };
					
                }
                            
                            

                        }
                            else{
                                return {
                                    status: false,
                                    message: "Invalid Params!!!"
                                };
                            }

                        }else{
                            return {
                                    status: false,
                                    message: "Invalid Params!!!"
                                };
                        }
                    }else{
                        return {
                                    status: false,
                                    message: "Invalid token!!!"
                                };
                    }
              
    
    }      
});
          
	
	
		
		
/* start removeFromMyCourses */
Api.addRoute('courseRating', {
    post: function () {
	console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
        var params = this.bodyParams;
		
		var userId = parseInt(params.userId);
        var userIdCheck = Validator.isNull(userId);
		
        var packageId = parseInt(params.packageId);
        var packageIdCheck = Validator.isNull(packageId);
		
		var rating = parseFloat(params.rating);
		var rateChk = Validator.isNull(rating);

        if (!userIdCheck && !packageIdCheck) {
            var data = Meteor.call("courseRating",userId,packageId,rating);
            return data;
        }
    }
});


Api.addRoute('getFeaturedCourses', {
    post: {
        action: function() {
            console.log("Request URL::" + this.request.url + "##Request Params::" + JSON.stringify(this.bodyParams))
            var param = this.bodyParams;
            var doc={
            	"key":1
            };
            console.log("doc",JSON.stringify(doc));

            // var data = [55];
            // var data1 = [47779];
            var subjectId = (param.subjectId).split(',').map(Number);

            if(Validator.isNull(param.showOnWeb)){
            	var showOnWeb=false;
            }else{
            	var showOnWeb=true;
            }
            //console.log("onesubject",subjectId);

            var gradeId = parseInt(param.gradeId);
            var flag = Meteor.call('validateToken', param.token, param.userId);
            if (flag) {
                if (!Validator.isNull(param.isTestSeries) &&
                    !Validator.isNull(param.subjectId) &&
                    !Validator.isNull(param.gradeId) &&
                    !Validator.isNull(param.userId)

                ) 
                {
                    var keyForCache = this.request.url + param.gradeId + param.subjectId +showOnWeb+ param.isTestSeries;
                    //Caching Process start
                    var dataFromCache = cache.get(keyForCache);
                    //console.log("dataFromCache===="+JSON.stringify(dataFromCache));
                    if (dataFromCache) {
                        if (dataFromCache["result_data"]["feature_courses"].length > 0) {
                            for (var i = 0; i < dataFromCache["result_data"]["feature_courses"].length; i++) {
                                if (dataFromCache["result_data"]["feature_courses"][i]["list"].length > 0) {
                                    for (var j = 0; j < dataFromCache["result_data"]["feature_courses"][i]["list"].length; j++) {
                                        var packageId = dataFromCache["result_data"]["feature_courses"][i]["list"][j]["PsCourseId"];
                                        var isJoinedPurchased = Meteor.call('isJoinedPackage', parseInt(param.userId), packageId);
                                        // console.log("isJoined",isJoined);
                                        dataFromCache["result_data"]["feature_courses"][i]["list"][j]["isJoined"] = isJoinedPurchased["isJoined"];
                                        dataFromCache["result_data"]["feature_courses"][i]["list"][j]["isPurchased"] = isJoinedPurchased["isPurchased"];
                                    }


                                }
                            }
                        }
                        console.log("cache avail GFeaturedC")
                        return dataFromCache;

                    } else {


                        var count = Meteor.call('getWallCountData', gradeId, subjectId,showOnWeb);
                        console.log("count", JSON.stringify(count));
                        if(showOnWeb==true){
                        	var countCourse=count["countCourse"];
                        	var countSubject=count["countSubject"];
                        	var countCourseTest=count["countCourseTest"];
                        	var countSubjectTest=count["countSubjectTest"];
                        }else{
                        	var countCourse=2;
                        	var countSubject=2;
                        	var countCourseTest=2;
                        	var countSubjectTest=2;
                        }

                        var banners = [{
                            "imgurl": "http://addimages.thedigilibrary.com/test/iprofindia_curtain_banner/New-Year-CB.jpg",
                            "deeplink": "http://www.iprofindia.com/iprof/subscription"
                        }]


                        if (param.isTestSeries == "0") {
                            var subjectLevel = [];

                            var course = Meteor.call('getCourseList', gradeId, subjectId,countCourse, param.userId,showOnWeb);
                            // return course;   
                            if (course[0]) {
                                // var subjectArr=[];
                                // var packageId=course[0]["PsCourseId"];
                                for (var i = 0; i < course.length; i++) {
                                    for (var j = 0; j < course[i]["GradeArr"].length; j++) {
                                        if (course[i]["GradeArr"][j]["id"] == gradeId) {
                                            var title = course[i]["GradeArr"][j]["name"];
                                            break;
                                        }
                                    }
                                }

                                var comprehensiveCourses = {
                                    "title": title,
                                    "id": 1,
                                    "subjectId": param.subjectId,
                                    "totalCount": count["countCourse"],
                                    "list": course
                                };
                                subjectLevel.push(comprehensiveCourses);
                            }


                            for (var i = 0; i < subjectId.length; i++) {

                                var subject = Meteor.call('getSubjectList', gradeId, [subjectId[i]], countSubject, param.userId,showOnWeb);
                                var subjectCount = Meteor.call('individualSubjectCount', gradeId, subjectId[i], "0");

                                // console.log(subject[0]["subjects"][0]["name"]);
                                // console.log(JSON.stringify(subject));
                                if (subject[0]) {
                                    var doc = {
                                        "title": subject[0]["subjects"][0]["name"],
                                        "id": 2,
                                        "subjectId": subjectId[i],
                                        "totalCount": subjectCount,
                                        "list": subject
                                    };
                                    subjectLevel.push(doc);
                                    subject = [];
                                }
                            }


                            var result_data = {
                                "feature_courses": subjectLevel,
                                "banners": banners
                            };
                        } else {
                            var subjectLevel = [];

                            var course = Meteor.call('getTestCourseList', gradeId, subjectId,countCourseTest, param.userId,showOnWeb);
                            // return course;   
                            if (course[0]) {
                                // var subjectArr=[];

                                for (var i = 0; i < course.length; i++) {
                                    for (var j = 0; j < course[i]["GradeArr"].length; j++) {
                                        if (course[i]["GradeArr"][j]["id"] == gradeId) {
                                            var title = course[i]["GradeArr"][j]["name"];
                                            break;
                                        }
                                    }
                                }

                                var comprehensiveCourses = {
                                    "title": title,
                                    "id": 3,
                                    "subjectId": param.subjectId,
                                    // "idType":gradeId,
                                    "totalCount": count["countCourseTest"],
                                    "list": course
                                };
                                subjectLevel.push(comprehensiveCourses);
                            }


                            for (var i = 0; i < subjectId.length; i++) {

                                var subject = Meteor.call('getTestSubjectList', gradeId, [subjectId[i]],countSubjectTest, param.userId,showOnWeb);
                                var subjectCount = Meteor.call('individualSubjectCount', gradeId, subjectId[i], "1");

                                // console.log(subject[0]["subjects"][0]["name"]);
                                // console.log(JSON.stringify(subject));
                                if (subject[0]) {
                                    var doc = {
                                        "title": subject[0]["subjects"][0]["name"],
                                        "id": 4,
                                        "subjectId": subjectId[i],
                                        "totalCount": subjectCount,
                                        "list": subject
                                    };
                                    subjectLevel.push(doc);
                                    subject = [];
                                }
                            }



                            var result_data = {
                                "feature_courses": subjectLevel,
                                "banners": banners
                            };


                        }
                        

                        if (result_data["feature_courses"].length>0) {
                             var responseInfo= {
                                status: true,
                                result_data: result_data
                            };
                            cache.set(keyForCache, responseInfo);
                            return responseInfo;


                           
                        } else {
                            return {
                                status: false,
                                message: "No data to show!!!"
                            };
                        }
                    }
                } else {
                    return {
                        status: false,
                        message: "Invalid Params!!!"
                    };
                }

            } else {
                return {
                    status: false,
                    message: "Invalid Token!!!"
                };
            }
        }
    }
});
Api.addRoute('getSummaryByCategoryId', {

      post: function () { 	 
   var params=this.bodyParams;
   console.log("Request URL::"+this.request.url+"##Request Params::"+JSON.stringify(this.bodyParams))
   //debugger;
   var categoryId=params.categoryId;
    var keyForCache = this.request.url+"-"+categoryId;
			//Caching Process start			
			var dataFromCache = cache.get(keyForCache);
            if (dataFromCache) {
                //code
                return dataFromCache;
            }
    var summary=Meteor.call("getSummaryByCategoryId",categoryId);
    console.log("summary==",JSON.stringify(summary));
    if (summary&&summary["totalPackages"]>0) {
        //code
     cache.set(keyForCache, summary);
    	console.log("Cache set Success");
      }
      return summary;
  
     }
    });


