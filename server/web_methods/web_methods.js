var globalApiUrl = Meteor.settings.globalApiUrl;
var meteorServerUrl = Meteor.settings.meteorServerUrl;
var lmsIP =  Meteor.settings.lmsIP;
var methodurl = Meteor.settings.methodurl;
console.log('meteorServerUrl',meteorServerUrl);

Meteor.methods({
    'getLocation': function (email_id, lat, lng) {
        var countEmail = Users.find({"email": email_id}).count();
        console.log('countEmail', countEmail);
        if (countEmail === 1) {
            var info = Users.update(
                    {"email": email_id},
            {"$set":
                        {"latitude": lat, "longitude": lng}});
        }
    }
});

Meteor.methods({
    'web_user_register': function (user_name, email, password, mobile) {
        var countEmail = Users.find({"email": email}).count();

        /*include the following package for validation: "meteor add servicelocale:meteor-server-validator"*/
        var isEmail1 = Validator.isNull(email); //checking for email is not null

        var checkMobile = Validator.isNumeric(mobile); //checking that only numbers are passed in mobile
        var checkMobLen = Validator.isLength(mobile, 10, 10);//mobile is 10 digits long
        var isMobile = Validator.isNull(mobile);//checking for if mobile is null
        //var isUserType=Validator.isNull(para.userType);//checking if isUserType is null or not

        var isName = Validator.isNull(user_name);// checking if name is null or not
        var checkName = Validator.isLength(user_name, 3, 30);
        var isPasword = Validator.isNull(password);// checking if password is null
        var checkPasword = Validator.isLength(password, 6, 40);// password is between length 6 and 40
        var role = 12; //for student
        var mode = 1; //for registration

        console.log(countEmail);
        console.log(isEmail1);
        console.log(checkMobile);
        console.log(checkMobLen);
        console.log(isMobile);
        console.log(isName);
        console.log(checkName);
        console.log(isPasword);
        console.log(checkPasword);
         var mob="";
            var countMobile=0;
            var countMobileApp=0;
            var countMobileWeb=0;
            if (!isMobile && checkMobile && checkMobLen) {
//                 mobile = parseInt(mobile);
                   countMobileApp = Users.find({
                "mobile_no": parseInt(mobile)
            }).count();
                 countMobileWeb = Users.find({
                "mobile": mobile
            }).count();
            countMobile= parseInt(countMobileApp) + parseInt(countMobileWeb);
                   console.log("countMobile==",countMobile)
            } else {
                 mobile = "";
            }
        
        

        if (countEmail === 0 && countMobile === 0) {

            var userId = Meteor.call('autoIncrement');
            var created = new Date();
            created = new Date(created.setMinutes(created.getMinutes() + 330));


            //inserting the value in collection if user has inputed the mobile no.
            var hPassword = Meteor.call('hash', password);
            if (!isMobile && !isEmail1 && !isPasword && checkPasword && !isName && checkName) {

                var info = Users.insert({"id": userId, "name": user_name, "email": email, "password": hPassword,
                    "mobile_no": parseInt(mobile), "role": 12, "mode": 1,"source":"web","created":created});
                //var info = Users2.findOne({"email":email});
                var user_data = Users.findOne({"id": userId});
            }
            //inserting the value in collection if user has not inputed the mobile no.
            else if (!isEmail1 && !isPasword && checkPasword && !isName && checkName) {

                var info = Users.insert({"id": userId, "name": user_name, "email": email, "password": hPassword,
                 "role": 12, "mode": 1, "source":"web",
                "created":created});
                //    console.log('not_mobile');
                //var info= Users2.findOne({"email": email});
                var user_data = Users.findOne({"id": userId});
            }

        } else {
            return 3;//if user already exists
        }
        //console.log('info', info);
        if (user_data) {
            Meteor.call('generateToken', user_data["id"]);
//            var token = Meteor.call('getToken', user_data["id"]);
            console.log('result',"json");
            console.log('mongo_id',user_data["id"]);
            console.log('username', user_data["name"]);
            console.log('password',user_data["password"]);
            console.log('email',user_data["email"]);
            console.log('role',user_data["role"]);
            console.log('userphone',user_data["mobile_no"]);
            console.log('gen_id',user_data["gen_id"]);
            console.log('device_id',user_data["device_id"]);
            console.log('URL::'+globalApiUrl+"/users/createUser");





//            Meteor.setTimeout(function(){
                    var lmsResponse = HTTP.call("POST", globalApiUrl+"/users/createUser",
                      {params: {
                          "result" : "json",
                          "mongo_id":user_data["id"],
                          "username" : user_data["name"],
                          "password" : user_data["password"],
                          "email" : user_data["email"],
                          "role": user_data["role"],
                          "userphone":user_data["mobile_no"],
                          "gen_id":user_data["gen_id"],
                          "device_id":user_data["device_id"],
                          "source":"Web"
                      }}
                  );
          
          
          
         var parsedRes=JSON.parse(lmsResponse.content);
                    console.log("parsedRes",parsedRes["status"]);
                   if(parsedRes["status"]=="true") { 								
                    value = user_data;
                }else{
                    Users.remove({"id":parseInt(userId)});
                   value=2;
                } 
          
          
          
          
          
          
          
          
//                  console.log('user_syncing',user_sync);
//				  console.log("API Called=="+globalApiUrl+"/users/createUser");
//                    console.log("timeout");
//              }, 60000);
                

        }
        else {
            value = 2;
        }
        //console.log(value);
        return value;
    }

});

Meteor.methods({
    'web_user_login': function (email, password) {

        /*include the following package for validation: "meteor add servicelocale:meteor-server-validator"*/
        var checkEmail = Validator.isEmail(email); //checking whether email is valid
        var isEmail1 = Validator.isNull(email); //checking for email is not null
        var isPasword = Validator.isNull(password);// checking if password is null
        var checkPasword = Validator.isLength(password, 6, 40);// password is between length 6 and 40

        //inserting the value in collection if user has inputed the mobile no.
        if (checkEmail && !isEmail1 && !isPasword && checkPasword) {
            //console.log('id_email',email);
            //console.log('password_user',password);
            var hPassword = Meteor.call('hash', password);
            var result = Users.findOne({"email": email, "password": hPassword});
        }
        //console.log('result',result);
        if (result) {
            return result
        }
    }

});

Meteor.methods({
    search_result: function (key_word, grade_id, user_id) {
        this.unblock();
//             console.log('key_word',key_word);
        try {
            var result = HTTP.call("POST", globalApiUrl+"/Searches/searchSuggestion",
                    {params: {
                            "result": "json",
                            "filter_grade": grade_id,
                            "vendorName": "iprof global",
                            "token": "global",
                            "keyword": key_word,
                            "type_flag": "All",
                            "userId": user_id,
                            "userType": "Student",
                            "vendorKey": "Jnl32SBuUN"
                        }}
            );
            //console.log('result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            return false;
        }
    }
});

Meteor.methods({
    search_result_list: function (key_word, user_id) {
        this.unblock();
        try {
            var result = HTTP.call("POST", globalApiUrl+"/Searches/searchResult",
                    {params: {
                            "result": "json",
                            "vendorName": "iprof global",
                            "token": "global",
                            "keyword": key_word,
                            "type_flag": "All",
                            "userId": user_id,
                            "pageNo": 1,
                            "listing": 1,
                            "vendorKey": "Jnl32SBuUN"
                        }}
            );
//            console.log('result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            return false;
        }
    }
});


Meteor.methods({
    fun_videos: function (gradeId, subjectId, pageNo) {
        var skip_limit = pageNo * 5 - 5;
        var feeds = Funzone.find(
                {
                    "course_id": gradeId,
                    "subject_id": {$in: subjectId},
                    "notification_type": 7
                },
        {skip: skip_limit, limit: 5, sort: {id: -1}}
        ).fetch();
        //console.log('feeds',feeds);
        var total_result_count = 0;
        var arr = [];
        if (feeds[0]) {
            total_result_count = feeds.length;
            for (var i = 0; i < total_result_count; i++) {
                if (feeds[i].attach_name != null && feeds[i].attach_name != '') {
                    var vid_file = globalApiUrl+"/gcm_files/" + feeds[i].attach_name;
                } else {
                    var vid_file = feeds[i].attach_name;
                }
                if (!feeds[i].message_html) {
                    var mssg_html = true;
                } else {
                    var mssg_html = false;
                }
                var date = feeds[i].date_added;
                var date_no = date.getDate();
                var month_no = date.getMonth();
                var months = [ "Jan", "Feb", "Mar", "Apr", "May", "June",
                        "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
                var month = months[parseInt(month_no)] ;
                var year = date.getFullYear();
                var obj = {
                    "feed_id": feeds[i].id,
                    "title": feeds[i].title,
                    "subject": feeds[i].subject,
                    "post_description": feeds[i].post_description,
                    "video_file": vid_file,
                    "type_id": feeds[i].notification_type,
                    "date": date_no+" "+month+" "+year,
                    "link": feeds[i].link,
                    "video_url": feeds[i].video_url,
                    "video_image": "http:\/\/globalstagingv2.schoolera.com\/app\/webroot\/img\/icon1.jpg",
                    "message_type": mssg_html
                };
                arr.push(obj);
            }

        }
        var response = {
            "total_result_count": total_result_count,
            "gcm_data": arr
        };
        return response;
    },
    fun_facts: function (gradeId, subjectId, pageNo) {
        var skip_limit = pageNo * 5 - 5;
        var feeds = Funzone.find(
                {
                    "course_id": gradeId,
                    "subject_id": {$in: subjectId},
                    "notification_type": 5
                },
        {skip: skip_limit, limit: 5, sort: {id: -1}}
        ).fetch();
        //console.log('feeds',feeds);
        var total_result_count = 0;
        var arr = [];
        if (feeds[0]) {
            total_result_count = feeds.length;
            for (var i = 0; i < total_result_count; i++) {
                if (feeds[i].attach_name != null && feeds[i].attach_name != '') {
                    var vid_file = globalApiUrl+"/gcm_files/" + feeds[i].attach_name;
                } else {
                    var vid_file = feeds[i].attach_name;
                }
                if (!feeds[i].message_html) {
                    var mssg_html = true;
                } else {
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
        var response = {
            "total_result_count": total_result_count,
            "gcm_data": arr
        };
        return response;
    }
});

Meteor.methods({
    chapter_asset_listing: function (chapterId, userId, token, isTestSeries, gradeId) {
        this.unblock();
        try {
            var result = HTTP.call("POST", meteorServerUrl+"/course/getPackageChapter",
                    {params: {
                            "chapterId": chapterId,
                            "userId": userId,
                            "token": "global",
                            "isTestSeries": isTestSeries,
                            "gradeId": gradeId
                        }}
            );
//            console.log('result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            return false;
        }
    }
});

Meteor.methods({
    joinCourse: function (userId, token, packageId) {
        this.unblock();
//         console.log('userId',userId);
//         console.log('token',token);
//         console.log('packageId',packageId);
        try {
            var result = HTTP.call("POST", meteorServerUrl+"/course/addCourseToMyCourses",
                    {params: {
                            "userId": userId,
                            "token": token,
                            "packageId": packageId,
                        }}
            );
//            console.log('join_result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('false',e);
            return false;
        }
    }
});

Meteor.methods({
    unjoinCourse: function (userId, token, packageId) {
        this.unblock();
        try {
            var result = HTTP.call("POST", meteorServerUrl+"/course/removeFromMyCourses",
                    {params: {
                            "userId": userId,
                            "token": "global",
                            "packageId": packageId,
                        }}
            );
//            console.log('result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            return false;
        }
    }
});

Meteor.methods({
    getMyCoursesListingWeb: function (userId, token, isTestSeries, userPurchased) {
        this.unblock();
        try {
            var result = HTTP.call("POST", meteorServerUrl+"/course/getMyCoursesListing",
                    {params: {
                            "userId": userId,
                            "token": "global",
                            "isTestSeries": isTestSeries,
                            "userPurchased": userPurchased

                        }}
            );
//            console.log('result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            return false;
        }
    }
});

Meteor.methods({
    getFeaturedCoursesWeb: function (userId, token, isTestSeries, gradeId, subjectId) {
        this.unblock();
         console.log('userId',userId);
         console.log('token',token);
         console.log('isTestSeries',isTestSeries);
         console.log('gradeId',gradeId);
         console.log('subjectId',subjectId);
         console.log(meteorServerUrl+"/course/getFeaturedCourses");
        try {
            var result = HTTP.call("POST", meteorServerUrl+"/course/getFeaturedCourses",
                    {params: {
                            "isTestSeries": isTestSeries,
                            "userId": userId,
                            "token": token,
                            "gradeId": gradeId,
                            "subjectId": subjectId,
                            "showOnWeb":true
                        }}
            );
            console.log('result_course',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('false',e);
            return false;
        }
    }
});

Meteor.methods({
    subscriptionPlansWeb: function (userId, token) {
        this.unblock();
//        console.log('userId',userId);
//        console.log('token',token);
        try {
            var result = HTTP.call("POST", meteorServerUrl+"/subscription/subscriptionPlans",
                    {params: {
                            "userId": userId,
                            "token": token,
                        }}
            );
            console.log('result', result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            return false;
        }
    }
});
// course/suggestedCoursesTocListing
Meteor.methods({
//       gradeId | subjectId | userId | token | isTestSeries | packageId
    suggestedCoursesTocListingWeb: function (userId, token, gradeId, subjectId, isTestSeries, packageId) {
        this.unblock();
//         console.log('userId',userId);
//         console.log('token',token);
//         console.log('isTestSeries',isTestSeries);
//         console.log('gradeId',gradeId);
//         console.log('subjectId',subjectId);
//          console.log('packageId',packageId);
        try {
            var result = HTTP.call("POST", meteorServerUrl+"/course/suggestedCoursesTocListing",
                    {params: {
                            "userId": userId,
                            "token": token,
                            "gradeId": gradeId,
                            "subjectId": subjectId,
                            "isTestSeries": isTestSeries,
                            "packageId": packageId,
                        }}
            );
            console.log('result', result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            return false;
        }
    }
});

// course/getPackageChapter
Meteor.methods({
//chapterId | userId | token | isTestSeries | gradeId
    getPackageChapterWeb: function (userId, token, chapterId, isTestSeries, gradeId) {
        this.unblock();
        console.log('userId', userId);
        console.log('token', token);
        console.log('isTestSeries', isTestSeries);
        console.log('gradeId', gradeId);
        console.log('chapterId', chapterId);
        try {
            var result=HTTP.call("POST",meteorServerUrl+"/course/getPackageChapter",
                    {params: {
                            "userId": userId,
                            "token": token,
                            "chapterId": chapterId,
                            "gradeId": gradeId,
                            "isTestSeries": isTestSeries,
                        }}
            );
            console.log('result', result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('false',e);
            return false;
        }
    }
});

Meteor.methods({
//chapterId | userId | token | isTestSeries | gradeId
    setUserPreference: function (userId, token, categoryId, subcategoryId, gradeId, subjectId) {
//        var apiUrl = 'http://180.179.206.96:3000/';
        this.unblock();
//         console.log('userId',userId);
//         console.log('token',token);
//         console.log('gradeId',gradeId);
//         console.log('chapterId',chapterId);
//         console.log('subjectId',subjectId);
        try {
            var result = HTTP.call("POST", meteorServerUrl+"/user/setPreference",
                    {params: {
                            "userId": userId,
                            "token": token,
                            "categoryId": categoryId,
                            "subcategoryId": subcategoryId,
                            "gradeId": gradeId,
                            "subjectId": subjectId
                        }}
            );
            return result;
        } catch (e) {
//           Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('false',e);
            return false;
        }
    }
});


Meteor.methods({
    payment_subscription: function (payableAmount, merchant, is_express_checkout, userId, course, couponCode,paymentMode) {
        this.unblock();
        console.log('payableAmount',payableAmount);
        console.log('merchant',merchant);
        console.log('is_express_checkout',is_express_checkout);
        console.log('userId',userId);
        console.log('course',course);
        console.log('couponCode',couponCode);
        console.log(globalApiUrl+"/Payments/payment");
        try {
            var result = HTTP.call("POST", globalApiUrl+"/Payments/payment",
                    {params: {
                            "pointsRedeemed": 0,
                            "payableAmount": payableAmount,
                            "merchant": merchant,
                            "is_express_checkout": is_express_checkout,
                            "token": 'global',
                            "userId": userId,
                            "course": course,
                            "couponCode":couponCode,
                            "source":'web',
                            "paymentMode":paymentMode
                        }}
            );
            console.log('try', result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            console.log('message', e);
            return false;
        }
    }
});

Meteor.methods({
    aboutCourseData: function (programId) {
//        var apiUrl = 'http://globalstagingv6.schoolera.com/';
        this.unblock();
        try {
            var result = HTTP.call("POST", globalApiUrl + "/Course/aboutData/" + programId);
            console.log(result);
            return result;
        } catch (e) {
//           Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('false');
            return false;
        }
    }
});

Meteor.methods({
    aboutCourseDataByUrl: function (urlstr) {
//        var apiUrl = 'http://globalstagingv6.schoolera.com/';
        this.unblock();
        try {
            console.log(urlstr);
            var result = HTTP.call("POST", globalApiUrl + "/Course/aboutDataByUrl/" + urlstr);
            console.log(result);
            return result;
        } catch (e) {
//           Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('false');
            return false;
        }
    }
});



Meteor.methods({
    free_trial_web: function (userId, token, validity, subsId) {
        this.unblock();
        try {
            var result = HTTP.call("POST", meteorServerUrl+"/subscription/saveSubscription",
                    {params: {
                            "userId": userId,
                            "token": token,
                            "validity": validity,
                            "subsId": subsId,
                            "source": 'web'
                        }}
            );
            console.log('try', result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            console.log('message', e);
            return false;
        }
    }
});

/////////////////////////////////////////////////////////////////NAMAN/////////////////////////
Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
    {fields: {'services': 1,'profile':1 }
    });
});


Meteor.methods({
    fbGmailRegistration: function (mode,email,name,fbGoogleId) {
        this.unblock();
            console.log('fbGmailRegistration',email,fbGoogleId,mode,name);
        try {
            if(mode=="2"){
            Meteor.setTimeout(function(){

                var result = HTTP.call("POST", meteorServerUrl+"/user/userRegistration",
                      {params: {
                        "mode": mode,
                        "email": email,
                        "name": name,
                        "fbId": fbGoogleId,
                        // "category_id": parseInt(param.categoryId),
                        // "sub_category_id":parseInt(param.subcategoryId)

                      }}
                  );
           console.log("API Called=="+meteorServerUrl+"/user/userRegistration");
                    console.log("preftimeout");

                    var user_data = Users.findOne({"email": email});
                    console.log("user_data",user_data);
              }, 2000);



              // console.log("user_data",user_data);

                Meteor.setTimeout(function(){
                    HTTP.call("POST", "http://"+lmsIP+"/users/createUser",
                      {params: {
                          "result" : "json",
                          "mongo_id":user_data["id"],
                          "username" : user_data["name"],
                          "email" : user_data["email"],
                          "role": user_data["role"],
                          "userphone":user_data["mobile_no"],
                          "gen_id":user_data["gen_id"],
                          "device_id":user_data["device_id"]
                      }}
                  );
				  console.log("API Called=="+"http://"+lmsIP+"/users/createUser");
                    console.log("timeout");
              }, 3000);


           console.log("fbReg",JSON.stringify(result));
            return result;


              }else if (mode=='3'){
                Meteor.setTimeout(function(){
                var result = HTTP.call("POST", meteorServerUrl+"/user/userRegistration",
                      {params: {
                        "mode": mode,
                        "email": email,
                        "name": name,
                        "googleId": fbGoogleId,
                        // "category_id": parseInt(param.categoryId),
                        // "sub_category_id":parseInt(param.subcategoryId)

                      }}
                  );

           console.log("API Called=="+"http://localhost:3000/user/userRegistration");
                    console.log("preftimeout");
              }, 1600);

                var user_data = Users.findOne({"email": email});

                Meteor.setTimeout(function(){
                    HTTP.call("POST", "http://"+lmsIP+"/users/createUser",
                      {params: {
                          "result" : "json",
                          "mongo_id":user_data["id"],
                          "username" : user_data["name"],
                          "email" : user_data["email"],
                          "role": user_data["role"],
                          "userphone":user_data["mobile_no"],
                          "gen_id":user_data["gen_id"],
                          "device_id":user_data["device_id"]
                      }}
                  );
				  console.log("API Called=="+"http://"+lmsIP+"/users/createUser");
                    console.log("timeout");
              }, 2000);


              console.log("gmailReg",JSON.stringify(result));
                return result;

              }

            //console.log('result',result);

        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('EXCEPTION',e);
            return false;
        }
    }
});


Meteor.methods({
    'webUserInfo': function (userId) {
        if(userId &&  userId != '' ){
        var query = Users.findOne({"id": parseInt(userId)},
            {   fields:{
                "_id":0,
                "name":1,
                "email":1,
                "mobile_no":1,
                "subscription_expiry_date":1,
                "subscription_validity":1
                }});
        return query;

    }
    else{
    return false;
    }
}
});




 Meteor.methods({
        'fetchPreferenceWeb': function(categoryId,subcategoryId,gradeId,subjectId) {
        console.log("categoryId="+categoryId+",subcategoryId="+subcategoryId+",gradeId="+gradeId+",subjectId="+subjectId);
    var pipeline = [
         {$unwind: '$sub_category'},
         {$unwind: "$sub_category.course"},
        {$unwind: "$sub_category.course.subject"},

        {$match: {$and: [{"id":categoryId } ,{"sub_category.id": subcategoryId},
        {"sub_category.course.id": gradeId},
        {"sub_category.course.subject.id": {$in: subjectId}}]}},

        {$project: {
              "id": 1,
              "name":1,
              "sub_category.id": 1,
              "sub_category.name": 1,
              "sub_category.course.id": 1,
              "sub_category.course.name": 1,
              "sub_category.course.subject.id": 1,
              "sub_category.course.subject.name": 1

            }}];
         var result = Preferences.aggregate(pipeline);
         // return result;
         console.log("Preference==",JSON.stringify(result));
         var sub=[];
         var sub_arr=[];
         var pref;
        if(result){
         if(result.length>0){
          for(i=0;i<result.length;i++){
           if(result[i]){
            sub={
              "id":result[i]["sub_category"]["course"]["subject"]["id"],
              "name":result[i]["sub_category"]["course"]["subject"]["name"]
            };
            sub_arr.push(sub);
            }
          }
            pref={
             "cat_id":result[0]["id"],
             "cat_name":result[0]["name"],
              "sub_cat_id":result[0]["sub_category"]["id"],
              "sub_cat_name":result[0]["sub_category"]["name"],
              "course_id":result[0]["sub_category"]["course"]["id"],
              "course_name":result[0]["sub_category"]["course"]["name"],
              "subjects":sub_arr
            };

         }
         }

return pref;

        }
    });

Meteor.methods({
    'getSubjectsIDWeb': function(gradeId) {
        var pipeline = [
        {
            $unwind: '$subject'
        },
        {
            $match: {
                "id": gradeId,
                "subject.status":1,
                "subject.state":2


            }
        }, {
            $project: {
                "_id":0,
                "id":1,
                "subject.id": 1,
                "subject.name":1

                    }
        }

    ];
    // console.log("testId",testId);
    var result = Courses.aggregate(pipeline);
    var subjects=[];

    for(var i=0;i<result.length;i++){
        var sub={
            "subjectId":result[i]["subject"]["id"],
            "subjectName":result[i]["subject"]["name"]
        };
        subjects.push(sub);
    }
        return subjects;


    }
});


Meteor.methods({

// Parameters are :-->{validity_id=1, purchase_type=subscription, coupon=all1998, is_express_checkout=1, userId=4000167, token=ea8DfmJyMHP4FSA2rwJp5Rk6KStq9KrH, subscription_id=1, type=3}
    coupon_apply_web: function (validity_id, purchase_type, coupon, is_express_checkout, userId, token, subscription_id, type) {
        this.unblock();
        try {
            var result = HTTP.call("POST", globalApiUrl+"/Payments/payment",
                    {params: {
                            "validity_id": validity_id,
                            "purchase_type": purchase_type,
                            "coupon": coupon,
                            "is_express_checkout": is_express_checkout,
                            "userId": userId,
                            "token": token,
                            "subscription_id": subscription_id,
                            "type":type
                        }}
            );
            console.log('try', result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            console.log('message', e);
            return false;
        }
    }
});




Meteor.methods({
    forget_pass: function (email) {
        this.unblock();
        try {
			//console.log('My email'+email);
            var result = HTTP.call("POST", meteorServerUrl+"/user/getOTPorEMAIL",
                    {params: {
                            "email": email
                        }}
            );
            //console.log('try', result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            //console.log('message', e);
            return false;
        }
    }
});

Meteor.methods({
    infoPagesData: function (param) {
//        var apiUrl = 'http://http://localhost/globalapiv6/';
        this.unblock();
        try {
            var result = HTTP.call("POST", globalApiUrl + "/Course/infoData/" + param);
            console.log(result);
            return result;
        } catch (e) {
//           Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('false');
            return false;
        }
    }
});


Meteor.methods({
    submit_qod_web: function (userId, gradeId, subjectId, questionId, userAns, correctAns, token) {
        this.unblock();
//        console.log('userId',userId);
//        console.log('token',token);

//    !user_id_check && !grade_id_check && !subject_id_check && !question_id_check && !user_ans_check && !correct_ans_check && !token_check) {
       console.log('userId',userId);
       console.log('gradeId',gradeId);
       console.log('subjectId',subjectId);
       console.log('questionId',questionId);
       console.log('userAns',userAns);
       console.log('correctAns',correctAns);
       console.log('token',token);



        try {
            var result = HTTP.call("POST", meteorServerUrl+"/test/submitQod",
                    {params: {
                            "userId": userId,
                            "gradeId":gradeId,
                            "subjectId":subjectId,
                            "questionId": questionId,
                            "userAns": userAns,
                            "correctAns": correctAns,
                            "token": token
                        }}
            );
            console.log('result', result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('false',e);
            return false;
        }
    }
});




Meteor.methods({
    submitBmsWeb: function (challengerId,gradeId,subjectId,subjectName,testId,marksObtained,totalTime,questionList,token,opponentId,testDuration,totalQuestions,chapterId) {
        this.unblock();
//             console.log('key_word',key_word);
            try {
                //Meteor.setTimeout(function(){
                    var result = HTTP.call("POST",meteorServerUrl+"/bms/submitBms",
                      {params: {
                          "challengerId" : challengerId,
                          "gradeId":gradeId,
                          "subjectId" : subjectId,
                          "subjectName" : subjectName,
                          "testId": testId,
                          "marksObtained":marksObtained,
                          "totalTime":totalTime,
                          "questionList":questionList,
                          "token":token,
                          "opponentId":opponentId,
                          "testDuration":testDuration,
                          "totalQuestions":totalQuestions,
                          "chapterId":chapterId
                      }}
                  );
		    console.log("API Called=="+meteorServerUrl+"/bms/submitBms");
                    console.log("timeout");
		    return result;
              //}, 17000);
	    } catch (e) {
		// Got a network error, time-out or HTTP error in the 400 or 500 range.
		console.log('false',e);
		return false;
	    }

        }
});

Meteor.methods({
    submitBmsChallangeWeb: function (challangeId,challengerId,challengeCompleterId,challengeCompleterName,gradeId,testId,marksObtained,totalTime,questionList,token,chapterId) {
        this.unblock();
//             console.log('key_word',key_word);
            try {
                Meteor.setTimeout(function(){
                    var result = HTTP.call("POST",meteorServerUrl+"/bms/submitBms",
                      {params: {
                          "challangeId" : challangeId,
			  "challengerId" : challengerId,
			  "challengeCompleterId" : challengeCompleterId,
			  "challengeCompleterName" : challengeCompleterName,
                          "gradeId":gradeId,
                          "testId": testId,
                          "marksObtained":marksObtained,
                          "totalTime":totalTime,
                          "questionList":questionList,
                          "token":token,
                          "chapterId":chapterId,
			  "source":"bms"
                      }}
                  );
		    console.log("API Called=="+meteorServerUrl+"/bms/submitBms");
                    console.log("timeout");
		    return result;
              }, 17000);
	    } catch (e) {
		// Got a network error, time-out or HTTP error in the 400 or 500 range.
		console.log('false',e);
		return false;
	    }

        }
});


Meteor.methods({
    getNotificationWeb: function (userId,token) {
        this.unblock();
//             console.log('key_word',key_word);

                Meteor.setTimeout(function(){
                    HTTP.call("POST", "http://"+lmsIP+"/notification/get_notification",
                      {params: {
                          "userId" : userId,
                          "token":token
                      }}
                  );
                  console.log("API Called=="+"http://"+lmsIP+"/notification/get_notification");
                    console.log("timeout");
              }, 10000);

        }
});


Meteor.methods({
    reset_pass: function (password,confirmPassword,email) {
        this.unblock();
        try {
            var result = HTTP.call("POST", meteorServerUrl+"/user/resetPassword",
                    {params: {
							"password":password,
							"confirmPassword":confirmPassword,
							"email":email
                        }}
            );
            return result;
        } catch (e) {
            return false;
        }
    }
});

Meteor.methods({
    preferenceSubjectName: function (gradeId,subjectId) {
        this.unblock();
        try {


            var pipeline = [
        {$unwind: '$subject'},
        {$match: {
                "id":gradeId,
                "subject.id": {$in:subjectId}
                }
        },
        {$project: {
                // "subject.publisher.content.unit.sub_unit.chapter.id": 1,
                "_id":0,
                "id":1,
                "subject.id":1,
                "subject.name":1

                }
        }

    ];
    var result = Courses.aggregate(pipeline);
    // console.log("resulttest",JSON.stringify(result));
     var subjectName="";
            for(var i=0;i<result.length;i++){

            if(i==0)
            {
                    subjectName=result[i].subject.name;
                }else{
                subjectName=subjectName+", "+result[i].subject.name;
            }

           }
//            if(subjectName.length>80){
//               subjectName=subjectName.substring(0, 80)+"...";
//            }


            console.log("web subjectname",subjectName);
            return subjectName;


        } catch (e) {
            return false;
        }
    }
});




Meteor.methods({
    hardwareDetailsWeb: function (packageId) {
        var result=Packages.find(

//                 {$and: [
                {"id":parseInt(packageId)},
//                    {$or: [
//               {"package_subscription.status":1},
//                {"package_subscription.hardware_master.status":1}
//
//                 ]}
//                 ]},

            {fields:{"package_subscription":1,"_id":0}

        }).fetch();

        var penDrive=[];
        var penDriveArr=[];
        var tablet=[];
        var tabletArr=[];

        var sdCard=[];
        var sdCardArr=[];

        var durationArr=[];
        // var hardwareDetail=[];
        // var hardwareDetailArr=[];

        for(var i=0;i<result[0]["package_subscription"].length;i++){
            
        hardwareDetail=[];
            if(result[0]["package_subscription"][i]["status"]==1 && result[0]["package_subscription"][i]["hardware_master"]["status"]==1){

            if(result[0]["package_subscription"][i]["hardware_master"]["type"]==1){
                 var size=result[0]["package_subscription"][i]["hardware_master"]["system_capacity"]/1024;
                penDrive={
                    "sub_id": result[0]["package_subscription"][i]["id"],
                    "title":result[0]["package_subscription"][i]["hardware_master"]["title"],
                    "information":result[0]["package_subscription"][i]["hardware_master"]["information"],
                    "detailed_specs":result[0]["package_subscription"][i]["hardware_master"]["detailed_specs"],
                    "colors_available":result[0]["package_subscription"][i]["hardware_master"]["colors_available"],
                    "model_no":result[0]["package_subscription"][i]["hardware_master"]["model_no"],
                    "system_capacity":size,
                    "subscription_cost":result[0]["package_subscription"][i]["subscription_cost"],
                    "discounted_cost":result[0]["package_subscription"][i]["discounted_cost"],
                    "duration":result[0]["package_subscription"][i]["subscription"]["duration"],
                    "detail":result[0]["package_subscription"][i]["hardware_master"]["detail"],
                "HardwareMediaInfo":result[0]["package_subscription"][i]["hardware_master"]["HardwareMediaInfo"]

                };
                penDriveArr.push(penDrive);
                penDrive=[];
            }else if(result[0]["package_subscription"][i]["hardware_master"]["type"]==2){



                 var size=result[0]["package_subscription"][i]["hardware_master"]["system_capacity"]/1024;
                tablet={
                    "sub_id": result[0]["package_subscription"][i]["id"],
                    "title":result[0]["package_subscription"][i]["hardware_master"]["title"],
                    "information":result[0]["package_subscription"][i]["hardware_master"]["information"],
                    "detailed_specs":result[0]["package_subscription"][i]["hardware_master"]["detailed_specs"],
                    "colors_available":result[0]["package_subscription"][i]["hardware_master"]["colors_available"],
                    "model_no":result[0]["package_subscription"][i]["hardware_master"]["model_no"],
                    "system_capacity":size,
                    "subscription_cost":result[0]["package_subscription"][i]["subscription_cost"],
                    "discounted_cost":result[0]["package_subscription"][i]["discounted_cost"],
                    "duration":result[0]["package_subscription"][i]["subscription"]["duration"],
                    "detail":result[0]["package_subscription"][i]["hardware_master"]["detail"],
                "HardwareMediaInfo":result[0]["package_subscription"][i]["hardware_master"]["HardwareMediaInfo"]

                };
                durationArr.push(result[0]["package_subscription"][i]["subscription"]["duration"]);
                tabletArr.push(tablet);
                tablet=[];


            }else if(result[0]["package_subscription"][i]["hardware_master"]["type"]==4){


            sdCard={
                    "sub_id": result[0]["package_subscription"][i]["id"],
                    "title":result[0]["package_subscription"][i]["hardware_master"]["title"],
                    "information":result[0]["package_subscription"][i]["hardware_master"]["information"],
                    "detailed_specs":result[0]["package_subscription"][i]["hardware_master"]["detailed_specs"],
                    "colors_available":result[0]["package_subscription"][i]["hardware_master"]["colors_available"],
                    "model_no":result[0]["package_subscription"][i]["hardware_master"]["model_no"],
                    "system_capacity":size,
                    "subscription_cost":result[0]["package_subscription"][i]["subscription_cost"],
                    "discounted_cost":result[0]["package_subscription"][i]["discounted_cost"],
                    "duration":result[0]["package_subscription"][i]["subscription"]["duration"],
                    "detail":result[0]["package_subscription"][i]["hardware_master"]["detail"],
                "HardwareMediaInfo":result[0]["package_subscription"][i]["hardware_master"]["HardwareMediaInfo"]

                };
                sdCardArr.push(sdCard);
                sdCard=[];

            }



        }
    }

    var uniqueArray = durationArr.filter(function(elem, pos) {
    return durationArr.indexOf(elem) == pos;
  });
    console.log("durationArr",durationArr);
    console.log("uniqueArray",uniqueArray);
        var myTablet={};
        var temp=[];

        if(tabletArr.length>0){
            for(var i=0;i<uniqueArray.length;i++){
                // var k=0;
                for(var j=0;j<tabletArr.length;j++){
                    if(tabletArr[j]["duration"]===uniqueArray[i]){
                        temp.push(tabletArr[j]);
                        // console.log(tabletArr[j]);
                        // console.log(temp);

                    }


            }
            myTablet[uniqueArray[i]]=temp;
            temp=[];

        }
    }

        var response={

            "penDrive":penDriveArr,
            "tablet":tabletArr,
            "sdCard":sdCardArr,
            "myTablet":myTablet,
            "tabletKey":uniqueArray
            // "hardwareDetailArr":hardwareDetailArr
        }
        return response;




        }
});


Meteor.methods({
    'emailAndMode': function(email,mode) {
      var count=Users.find({"email":email}).count();
      // console.log(email+" "+mode+" "+count);
      console.log("emailAndMode",count);
      if(count!=0){
        return true;
      }else{
        return false;
      }


    }
});

Meteor.methods({
    'emailUserDetails': function(email) {
      var query=Users.findOne({"email":email});
        console.log('user_data_fb',query);
        return query;
        

    }
});
Meteor.methods({
    'emailAndNotMode': function(email,mode) {
      var count=Users.find({"email":email,
        "mode":{$ne:mode}
    }).count();

      console.log(email+" "+mode+" "+count);
      console.log("emailAndNotMode");
      if(count==0){
        return true;
      }else{
        return false;
      }


    }
});


Meteor.methods({
    'profileWeb': function(userId,token) {
// this.unblock();
         // Meteor.setTimeout(function(){
                    var result=HTTP.call("POST", meteorServerUrl+"/user/profile",
                      {params: {
                          "userId" : userId,
                          "token":token
                      }}
                  );
                  console.log("API Called=="+"POST", meteorServerUrl+"/user/profile");
                console.log("timeout");
                return result.data;
              // }, 10000);



    }
});


Meteor.methods({
    'isUserDuplicate': function(email) {
      var count=Users.find({"email":email}).count();
      if(count==0){
        return false;
      }else{
        return true;
      }


    }
});


Meteor.methods({
    'web_user_register_mode': function (mode, email, name, fbGoogleId) {
        var countEmail = Users.find({"email": email}).count();

if (countEmail === 0) {

            var userId = Meteor.call('autoIncrement');
            var created = new Date();
            var role=12;
            var source="web";
            created = new Date(created.setMinutes(created.getMinutes() + 330));
            if(mode=="2"){

                Users.insert({
                            "id": userId,
                            "fb_id": fbGoogleId,
                            //      "registrationId": param.registrationId,
                            //      "gaid": param.Gaid,
                            //      "flow": param.Flow,
                            "created": created,
                            "role": role,
                            "mode": mode,
                            "email": email,
                            "name": name,
                            // "longitude": parseFloat(param.longitude),
                            // "latitude": parseFloat(param.latitude),
                            // "device_id": param.deviceId,
                            // "gen_id":param.gen_id,
                            // "lms_id":lmsId,
                            "source":source
                        });
                console.log("mode",mode);
                 var user_data = Users.findOne({
                            "email": email
                        });

                 // return query;



        }else if(mode=="3"){

                Users.insert({
                            "id": userId,
                            "google_id": fbGoogleId,
                            //   "registrationId": param.registrationId,
                            //   "gaid": param.Gaid,
                            //   "flow": param.Flow,
                            "created": created,
                            "role": role,
                            "mode": mode,
                            "email":email,
                            "name":name,
                            // "longitude": parseFloat(param.longitude),
                            // "latitude": parseFloat(param.latitude),
                            // "device_id": param.deviceId,
                            // "gen_id":param.gen_id,
                            // "lms_id":lmsId,
                            "source":source
                        });

                console.log("mode",mode);

                var user_data = Users.findOne({
                            "email": email
                        });

                 // return user_data;

        }

            console.log("user_data",user_data);


        if (user_data) {
            Meteor.call('generateToken', user_data["id"]);
          var token = Meteor.call('getToken', user_data["id"]);
            // value = user_data;
            // console.log('user_data',user_data);




            Meteor.setTimeout(function(){
                    HTTP.call("POST", globalApiUrl+"/users/createUser",
                      {params: {
                          "result" : "json",
                          "mongo_id":user_data["id"],
                          "username" : user_data["name"],
                          "password" : user_data["password"],
                          "email" : user_data["email"],
                          "role": user_data["role"],
                          "userphone":user_data["mobile_no"],
                          "gen_id":user_data["gen_id"],
                          "device_id":user_data["device_id"]
                      }}
                  );
                  console.log("API Called=="+globalApiUrl+"/users/createUser");
                    console.log("timeout");
              }, 17000);


        //console.log(value);
        return user_data;
    }

}
    else{

        return false;
    }
}});

Meteor.methods({
    packageFacultyProfilesData: function (packageId) {
        this.unblock();
        try {
            var result = HTTP.call("POST", globalApiUrl + "/Users/packageFacultyProfiles",
					{params: {
                            "packageId": packageId
							}}
            );
            console.log('=====================',result);
            return result;
        } catch (e) {
//           Got a network error, time-out or HTTP error in the 400 or 500 range.
            console.log('false');
            return false;
        }
    }
});

Meteor.methods({
    'getMyCoursesListingLms': function (userId) {


        var info = Users.find({
            "id": parseInt(userId)

        }, {fields: {
                "_id": 0,
                "subscription_plan": 1,
                "subscription_expiry_date": 1,
                "subscription_validity": 1,
                "packages_joined.package_id": 1,
                "packages_joined.is_joined": 1,
                "packages_joined.global_flag_for_free": 1,
                "packages_joined.is_test_series": 1
            }}

        ).fetch();

console.log("info",JSON.stringify(info));

        var data="";
        var pkgid=[];
        var j=0;
        if (info[0]) {
            if (info[0]["packages_joined"] && info[0]["packages_joined"].length > 0) {
                for (i = 0; i < info[0]["packages_joined"].length; i++) {
                    if (
                            info[0].packages_joined[i].is_joined == 1 &&
                            info[0].packages_joined[i].global_flag_for_free == 1
//                info[0].packages_joined[i].is_test_series==0

                            ) {

                        pkgid[j++] = info[0].packages_joined[i].package_id;
                    }
                }
            }
            console.log("pkgid", pkgid);
             data = {
                "subscription_plan": info[0].subscription_plan,
                "subscription_expiry_date": info[0].subscription_expiry_date,
                "subscription_validity": info[0].subscription_validity,
                "packageId": pkgid
            };

        }
        return data;
    }
});

Meteor.methods({
    contactUsFormWeb: function (msg) {
        this.unblock();
        try {
	    console.log('msg:'+msg);
            Email.send({
		from: "ccare@iprofindia.com",
		//to: 'info@iprofindia.com',
		to: 'anuj.gupta@irpofindia.com',
		subject: "Contact Us",
		html: msg
	    });
	    return {
		status: true,
		"message": "Thank you for sharing feedback!"
	    };
        } catch (e) {
            return e;
        }
    },
    contentPartnerWeb: function (name,course,content,email,mobile,bestTime) {
        this.unblock();
        try {
	    var result = HTTP.call("POST", "http://10.10.17.196/Services/saveContentPartnerQuery",
		{params: {
		    "result" : "json",
		    "name":name,
		    "course_id" : course,
		    "content_component" : content,
		    "email" : email,
		    "mobile": mobile,
		    "best_call_time":bestTime
		}}
	    );

	    var r = JSON.parse(result.content);
	    //console.log('result1:'+JSON.stringify(result));
	    return r ;
        } catch (e) {
	    console.log('error:'+e);
	    return e;
        }
    },
    clickTocall: function (mobile) {
	if(mobile!=''){
	    var filter = /^[1-9]{1}[0-9]{9}$/;
	    console.log("mobile:"+mobile);
	    if (filter.test(mobile)){
		console.log("mobile1:"+mobile);
		this.unblock();
		try {
		    console.log("mobile2:"+mobile);
		    var result = HTTP.call("POST", "http://10.10.17.196/Services/clickTocall",
			{params: {
			    "result" : "json",
			    "mobile": mobile
			}}
		    );
		    
		    console.log("result"+JSON.stringify(result));
		    var r = JSON.parse(result.content);
		    return r ;
		} catch (e) {
		    console.log('error:'+e);
		    var r={"status":false,"message":"Please enter valid mobile."}
		    return r;
		}   
	    } else {
		var r={"status":false,"message":"Please enter valid mobile."}
		return r;
	    }
	} else {
	    var r={"status":false,"message":"Please enter mobile no."}
	    return r ;
	}
    }
});

Meteor.methods({
    search_result_web: function (key_word, grade_id, user_id, limit) {
        this.unblock();
//             console.log('key_word',key_word);
        try {
            var result = HTTP.call("POST", globalApiUrl+"/Searches/searchResult",
                    {params: {
                            "type_flag": "All",
                            "listing": 1,
                            "token": "global",
                            "userId": user_id,
                            "userType": "Student",
                            "keyword": key_word,
                            "pageNo":1,
                            "filter_grade": grade_id,
                            "isSaved":0,
                            "limit":limit,
                            "source":"web"
                        }}
            );
            //console.log('result',result);
            return result;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            //console.log('false');
            return false;
        }
    }
});

Meteor.methods({
    CoursesMetaInfo: function (gradeId) {
    var query=CoursesMetaInfo.findOne({"course_id":parseInt(gradeId)},{fields:{"_id":0}});
    if(query){
	return query;
	} else {
	    return gradeId+"--iProf--";
	}
    }
});
Meteor.methods({
    getUserNotificationWeb: function (userId,token) {
        this.unblock();
        try {
            var result = HTTP.call("POST", meteorServerUrl+"/notification/getNotifications",
                    {params: {
                            "userId":userId,
                            "token":token
                        }}
            );
            console.log('getNotificationWeb',result);
            return result;
        } catch (e) {
            console.log('getNotificationWeb_error',e);
            return false;
        }
    }
});

Meteor.methods({
    'fetchCourseDataFromPckgId': function(packageId) {
        var result = Packages.findOne({"id":packageId},{fields: 
            {"keyword":1,
             "meta_title":1,
             "meta_desc":1,
             "package_program.course.id":1,
             "package_program.course.subject.id":1}
        });
        return result;
    }
});

Meteor.methods({
//chapterId | userId | token | isTestSeries | gradeId
    isDeliveryAvailable: function (pincode) {
        this.unblock();
        console.log('pin',parseInt(pincode));
        var pincode_data = Pincode.findOne({"pincode":parseInt(pincode)});
        console.log('pincode_data',pincode_data);
        return pincode_data;
        
    }
});