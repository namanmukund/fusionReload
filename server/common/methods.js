    var lmsIP=Meteor.settings.lmsIP;
	Meteor.methods({
        'validateToken': function(token, userId) {
            // code goes here
            var isToken = Validator.isNull(token);
            var isUserId = Validator.isNull(userId);

            if (!isUserId && !isToken) {

                if (token == 'global') {
                    return true;
                } else {
return true;
                //     var now=new Date();
                   
                //     console.log("myDate=" + now);
                //     var created = TokenDetails.findOne({"user_id": userId, "token": token}, {"created_on": 1});
                //     var createdOn = created["created_on"];

                //      var expiry_date = createdOn.setMonth(createdOn.getMonth() + 30);
                //     var expiry_date = new Date(expiry_date).toISOString();
                    
                //     console.log("expiry_date"+expiry_date);
                //     console.log("now"+now);
                //     if (now < expiry_date) {

                //         return true;
                //     } else { //if token expired
                //         return false;
                //     }
                 }
            } else {
                return false;
            }
        }

    });


    Meteor.methods({
        'getToken': function(userId) {

            var token=TokenDetails.findOne({"user_id": userId}, {fields:{"token": 1}});
            //console.log("getToken"+token+userId);
            return token["token"];

        }

    });

    Meteor.methods({
        'cartItemCount': function(userId) {
            var count =0;
            var pipeline = [    
            {$match: {"id":userId,"cart_details.status":0,"cart_details.cart.status":1}},
            {$project: { "_id":0,
                count: {$size: '$cart_details'}            
                }}
            ];
            var result = Users.aggregate(pipeline);
            if(result[0]){
                        return result[0]['count'];
            }else{
                return count;
            }
        }
    });



 Meteor.methods({
        'getCartCount': function(userId) {
            var count =0;            
            var result = Users.find({"id":userId},{fields:{"cart_count":1}});
            if(result[0]){
                        return result[0]['cart_count'];
            }else{
                return count;
            }
        }
    });

    Meteor.methods({
        'usersPackagesJoinedCount': function(packageId) {
        // var pipeline = [    
        // {$match: {"id":packageId}},
        // {$project: {"_id":0,
        //     count: {$size: '$users_joined'}            
        //     }}
        // ];
        // var result = Packages.aggregate(pipeline);
        var query=Packages.findOne({"id":parseInt(packageId)},{fields:{"_id":0,"users_joined":1}});
        return query['users_joined'];
        }
    });

    Meteor.methods({
        'generateToken': function(userId) {
           
            var token=Random.id([32]);
              var count= TokenDetails.find({"user_id":userId}).count();
              console.log("count"+count);
                var date = new Date();
                date = new Date(date.setMinutes(date.getMinutes() + 330));
              if(count==0){
                TokenDetails.insert({"user_id": userId,"token":token, "created_on": date });

              }
          else{

             TokenDetails.update({"user_id": userId},{$set :{"token":token, "created_on": date }});
         }

        }

    });

    Meteor.methods({
        'hash': function(password) {
            var salt = "248ca64cfe8898c9176b6615c7941de414bb4e98";
            var res = salt.concat(password);
            return CryptoJS.SHA1(res).toString();
        }

    });


Meteor.methods({
    'autoIncrement':function() {
        currentId = Users.findOne({},{fields:{"id":1},sort:{id:-1}});
        var current= currentId["id"] ;
        var next=current+1;
        //console.log("currentId111"+currentId);
        //MyCollection.insert(doc);
        return next;
    }
});

    Meteor.methods({
        'getAddress': function(lat, lng) {
            var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='
                    + lat + ',' + lng + '&sensor=false';


            var res = Meteor.http.get(url);
            if (res["statusCode"] == '200') {
                return res["data"];
            }
            else {
                return false;
            }
        }

    });


    Meteor.methods({
        'shortUrl': function() {

            var url = "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyD0tbPv-48Tv8VkEWPxgiAsqKl2mxVypy4";

            Meteor.http.post(url,
                    {
                        params:
                                {"longUrl": "https:\/\/play.google.com\/store\/apps\/details?id=com.iprofindia.iprofapp&referrer=MzUzNzA5NQ==",
                                    headers: {"content-type": "application/json"}}

                    });

        }

    });

    
    


    Meteor.methods({
        'userAppActivityLog': function(user_id, activity_type,
                activity_id, action,
                activity_type_id) {
            //****************************************************************
            //need app_version
            var date = new Date();
            date = new Date(date.setMinutes(date.getMinutes() + 330));
            return UserAppActivityLog.insert({"user_id": user_id, "activity_type": activity_type,
                "activity_id": activity_id, "action": action,
                "source": 2, "activity_type_id": activity_type_id,
                "created_on": date,
                "app_version": app_version});
        }
    });


    Meteor.methods({
        'globalAppInstallationLog': function(user_id, gen_id,
                referral_id, created_on, updated_on, is_first,
                utm_source, utm_medium, utm_term, utm_content, utm_campaign, osname,
                manufacturer, model, host, hardware, osversion, product,
                device, brand, referral_code, release, registration_id) {
            return GlobalAppInstallationLog.insert({"user_id": user_id, "gen_id": gen_id,
                "referral_id": referral_id, "created_on": created_on, "updated_on": updated_on, "is_first": is_first,
                "utm_source": utm_source, "utm_medium": utm_medium, "utm_term": utm_term, "utm_content": utm_content, "utm_campaign": utm_campaign,
                "osname": osname,
                "manufacturer": manufacturer, "model": model, "host": host, "hardware": hardware, "osversion": osversion,
                "product": product,
                "device": device, "brand": brand, "referral_code": referral_code, "release": release, "registration_id": registration_id});
        }
    });


    Meteor.methods({
        'userLocationLog': function(user_id, registration_id,
                latitude, longitude, network, gaid,
                created_on, mode, gen_id, address) {
            var date = new Date();
            date = new Date(date.setMinutes(date.getMinutes() + 330));
            created_on = date;
            return UserLocationLog.insert({"user_id": user_id, "registration_id": registration_id,
                "latitude": latitude, "longitude": longitude, "network": network, "gaid": gaid,
                "created_on": created_on, "mode": mode, "gen_id": gen_id, "address": address});
        }
    });


    Meteor.methods({
        'updateSocialDetails': function(userId, google_id, fb_id) {
            var temp = Users.find({"id": userId}, {"google_id": 1, "fb_id": 1}).fetch();
            var isGoogle_id = Validator.isNull(temp.google_id);
            var isFb_id = Validator.isNull(temp.fb_id);

            if (isGoogle_id && !isFb_id) {
                Users.update({id: userId}, {$push: {"fb_id": fb_id}});
            } else {
                Users.update({id: userId}, {$push: {"google_id": google_id}});
            }


        }
    });


    


    Meteor.methods({
        'userLogout': function(user_id) {
            data = TokenDetails.find({"user_id": user_id}).count();
            if (data) {
                data = TokenDetails.remove({"user_id": user_id});
                data = {"status": true, "message": "log out successfully!"};
                return data;
            }
            else {
                data = {"status": true, "message": "No data present."};
                return data;
            }
        }
    });



   







  



   




      
    


  


  


  
				
				//Get Asset Count by Chapter ID 
 Meteor.methods({
                'getAssetCount': function(chapterId,gradeId){
				//chapterId="3753028";				
				var pipeline = [
        {$unwind: '$subject'},		
        {$unwind: "$subject.publisher.content.unit"},
        {$unwind: "$subject.publisher.content.unit.sub_unit"},
        {$unwind: "$subject.publisher.content.unit.sub_unit.chapter"},
        {$match: {"id":parseInt(gradeId),"subject.publisher.content.unit.sub_unit.chapter.id":parseInt(chapterId)}},
        {$project: {
			
			//"subject":1,
			"subject.publisher.content.unit.sub_unit.chapter.id":1,            
            "subject.publisher.content.unit.sub_unit.chapter.study.heading":1,            
            "subject.publisher.content.unit.sub_unit.chapter.study.file_type":1
			}},
                {
                    "$group": {
                        "_id": "$subject.publisher.content.unit.sub_unit.chapter.study.file_type",
						//max_timeStamp : { $timeStamp : 1 },
						//"chapter_id": {"$subject.publisher.content.unit.sub_unit.chapter.id":1},
						//"type":{"subject.publisher.content.unit.sub_unit.chapter.study.file_type": 1},
                        "count": {"$sum": 1}
                    }
                }
				

    ];
          var result = Courses.aggregate(pipeline);
		  console.log("result="+JSON.stringify(result));		 
		  //console.log();
		  return result;
				}});
				
				//Get Chapters by package ID
 Meteor.methods({
                'getChaptersByPackageId': function(packageId,subjectId){
				console.log("subjectId",subjectId);
				
				var pkgChapters= Packages.find(
				{$and:[
				{"id":parseInt(packageId)},
				{"package_program.course.subject.id":parseInt(subjectId)}
				]},
				{fields:{"package_program.course.subject.chapter":1}}).fetch();	
				//console.log("package_program="+pkgChapters["package_program"]);
				//return pkgChapters;
				//console.log("pkgChapters="+JSON.stringify(pkgChapters));
				var chapterIds=[];
				if(pkgChapters.length>0){
				var courses=pkgChapters[0]["package_program"]["course"];				
				for(i=0; i<courses.length; i++){
					var subjects=courses[i]["subject"];
						for(j=0; j<subjects.length; j++){
						var chapters=subjects[j]["chapter"]
							for(k=0; k<chapters.length; k++){
							//console.log("chapterId="+JSON.stringify(chapters[k]));
							chapterIds.push({"id":chapters[k]["id"],"name":chapters[k]["name"]});
							//chapterIds.push(chapters[k]["name"]);
							}
						}
				}
				}else{
				//pkgChapters not found
				}
				//console.log("chapterId="+JSON.stringify(chapterIds));
				return chapterIds;
				}});
				
				//Get Subjects by package ID
				Meteor.methods({
                'getSubjectsByPackageId': function(packageId){
				
				var pkgSubjects= Packages.find({"id":parseInt(packageId)},
				{fields:{"package_program.course.subject":1}}).fetch();	
				//console.log("package_program="+pkgSubjects["package_program"]);
				//return pkgSubjects;
				//console.log("pkgSubjects="+pkgSubjects.length);
				var subjects=[];
				if(pkgSubjects.length>0){
				var courses=pkgSubjects[0]["package_program"]["course"];
				var chapterIds=[];				
				for(i=0; i<courses.length; i++){
					subjects=courses[i]["subject"];
						
				}
				}else{
				//pkgChapters not found
				}
				
				return subjects;
				}});

//Get Chapters by Subject ID
				Meteor.methods({
                'getChaptersBySubjectId': function(gradeId,subjectId,isTestSeries){				
				
	   if(isTestSeries=="1"){	
			 var pipeline = [
        {
            $unwind: "$subject"
        }, {
            $unwind: "$subject.publisher.content.unit"
        }, {
            $unwind: "$subject.publisher.content.unit.sub_unit"
        }, {
            $unwind: "$subject.publisher.content.unit.sub_unit.chapter"
        }, {
            $match: {
                 $and:[ 
               // {"id":gradeId},
                {"subject.id": {$exists:true}},
                {"subject.id": subjectId},
                {"subject.publisher.content.unit.sub_unit.chapter.is_deleted":0}               
                
            ]}
        }
    
        , {
            $project: {
                
				"subject.publisher.content.unit.sub_unit.chapter.id":1,
				"subject.publisher.content.unit.sub_unit.chapter.heading":1,
				"subject.publisher.content.unit.sub_unit.chapter.video_count":1,
				"subject.publisher.content.unit.sub_unit.chapter.pdf_count":1,
				"subject.publisher.content.unit.sub_unit.chapter.test_count":1,
				"subject.publisher.content.unit.sub_unit.chapter.package_id":1	
            }
        }

    ];
    var result = Courses.aggregate(pipeline);

}else{
    var pipeline = [
        {
            $unwind: "$subject"
        }, {
            $unwind: "$subject.publisher.content.unit"
        }, {
            $unwind: "$subject.publisher.content.unit.sub_unit"
        }, {
            $unwind: "$subject.publisher.content.unit.sub_unit.chapter"
        }, {
            $match: {
                 $and:[ 
              //  {"id":gradeId},
                {"subject.id": {$exists:true}},
                {"subject.id": subjectId},
                {$or:[
                        {"subject.publisher.content.unit.sub_unit.chapter.study.id":{$exists:true}},
                        {"subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.id":{$exists:true}}                         
                    ]}
                
            ]}
        }
    
        , {
            $project: {
                
                "subject.publisher.content.unit.sub_unit.chapter.id":1,
                "subject.publisher.content.unit.sub_unit.chapter.heading":1,
                "subject.publisher.content.unit.sub_unit.chapter.video_count":1,
                "subject.publisher.content.unit.sub_unit.chapter.pdf_count":1,
                "subject.publisher.content.unit.sub_unit.chapter.test_count":1,
                "subject.publisher.content.unit.sub_unit.chapter.package_id":1  
            }
        }

    ];
    var result = Courses.aggregate(pipeline);

}
	//console.log("result==="+JSON.stringify(result));
	//console.log("result Length==="+result.length);
	chapterArr=[];
	if(result){ 
	for(k=0; k<result.length; k++){	
     chapters = result[k]["subject"]["publisher"]["content"]["unit"]["sub_unit"]["chapter"];
	 chapterArr.push(chapters);
	 }
		//console.log("chapterArr Length==="+chapterArr.length);	
				}
				return chapterArr;
				}});
				
				
				//Get Package price 
				Meteor.methods({
        'getPackagePrice': function(packageId) {				
				
				var pipeline = [
        {
            $unwind: "$package_subscription"
        }, {
            $match: {$and:[         
      
			{"id":{$in:packageId}},
			{"package_level.id":5},
			{"status":1},
			{"package_subscription.status":1},			
			{"package_subscription.hardware_master.id":35}// 35 is for App Direct download					
                
            ]}    
        },{
            $project: {
				"_id":0,			
				"id":1,
				"is_free_for_preview":1,
					"package_subscription.id":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
					"package_subscription.subscription.duration":1
            }
        }

    ];
    var result = Packages.aggregate(pipeline);
				

                return result;
            }
    }); 

    Meteor.methods({
        'getTutorsCount': function(latitude, longitude, userId) {
            var count = 0;
            var userId = parseInt(userId);
            var latitude = parseFloat(latitude);
            var longitude = parseFloat(longitude);
//            console.log('userId',userId);
//            console.log('latitudetu',latitude);
//            console.log('longitudetu',longitude);
//return 2;
            var res = Meteor.http.post(
            "http://10.10.17.207/2_6/Recommendations/system_recommendations",
            {params: {"latitude":latitude,"longitude":longitude,"callApi":1,"queryType":2,"limit":1,"row":0,"userId":userId}});
            var countVal = JSON.parse(res['content']);
//            console.log('countVal',countVal);
            if (res["statusCode"] == 200) {
//                console.log('asghj');
                if(countVal['status']==true){
                    return countVal['recommended_tutor_count'];
//                    console.log('tutor',countVal['recommended_tutor_count']);
                }
            else{
                    return count;
                }
            }
            else {
                return count;
            }
        }
    });


 Meteor.methods({
        'fetchPreference': function(categoryId,subcategoryId,gradeId,subjectId) {
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
              "sub_category.id": 1, 
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
              "sub_cat_id":result[0]["sub_category"]["id"],
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
        'returnJson': function(query,userId) {

             var imageUrl = "http://img.thedigilibrary.com/img/";


            var arrResult = [];

            var price_info = [];
            var price_info_arr = [];
            var subjects_arr = [];
            var subjects = [];
            var grade_arr=[];
            var grade = [];
            var obj = [];
            var img = '';
            // return query;

            if (query) {
                for (var i = 0; i < query.length; i++) {
                    if (query[i]) {
                        for (var j = 0; j < query[i]["package_subscription"].length; j++) {
                            var discountedPrice=query[i]["package_subscription"][j]["discounted_cost"];
                                    if (discountedPrice==0) {
                                        //code
                                        discountedPrice=query[i]["package_subscription"][j]["subscription_cost"];
                                    }
									var hardware_type=query[i]["package_subscription"][j]["hardware_master"]["type"];
						if(hardware_type==2){ //hardware_type==2 means it is for Tablet with SD card
							hardware_type=4;
							}
                            price_info = {
                                "hw_id":query[i]["package_subscription"][j]["hardware_master"]["id"],
                                "hw_name":query[i]["package_subscription"][j]["hardware_master"]["title"],
                                "hw_type":hardware_type,
                                "sub_id": query[i]["package_subscription"][j]["id"],
                                "price": query[i]["package_subscription"][j]["subscription_cost"],
                                "discounted_price": discountedPrice,
                                "duration":query[i]["package_subscription"][j]["subscription"]["duration"]
                            }

                            price_info_arr.push(price_info);
                        }

                        for (var k = 0; k < query[i]["package_program"]["course"].length; k++) {
                            for (var l = 0; l < query[i]["package_program"]["course"][k]["subject"].length; l++) {
                            
                            subjects = {
                                "id": query[i]["package_program"]["course"][k]["subject"][l]["id"],
                                "name": query[i]["package_program"]["course"][k]["subject"][l]["name"]

                            }
                            publisher = query[i]["package_program"]["course"][k]["subject"][l]["publisher_name"];
                            subjects_arr.push(subjects);


                        }
                                grade = {
                                "id": query[i]["package_program"]["course"][k]["id"],
                                "name": query[i]["package_program"]["course"][k]["name"]

                            };
                            grade_arr.push(grade);

                    }

                        if (query[i]["package_media_infos"][0]) {
                            img = imageUrl + query[i]["package_media_infos"][0]["package_image_thumb"];
                        } else {
                            img = '';
                        }

                        var total_users=Meteor.call('usersPackagesJoinedCount',query[i]["id"]);
                        console.log("userId",userId);
						 console.log("Course Name==",query[i]["name"]);
						
                        var isJoinedPurchased=Meteor.call('isJoinedPackage',userId,query[i]["id"]);
						//console.log("isJoinedPurchased=="+isJoinedPurchased);

                       if(query[i]["rating"]<3){
                            var rating= query[i]["pkg_rating"]; 
                       }else{
                            var rating=query[i]["rating"];
                       } 

                       if(total_users<500){
                        total_users=query[i]["users_joined"];
                       }

                        obj = {
                            "isFreeForPrev": query[i]["is_free_for_preview"],
                            "PsCourseId": query[i]["id"],
                            "isJoined":isJoinedPurchased["isJoined"],
                            "isPurchased":isJoinedPurchased["isPurchased"],
                            "total_users": total_users,
                            "CourseName": query[i]["name"],
							"gradeId":grade["id"],
                            "GradeArr":grade_arr,
                            "numAssessments":query[i]["no_of_tests"],
                              "numNotes":query[i]["no_of_pdfs"],
                              "numMultimedia": query[i]["no_of_multimedia"],
                              "rating":rating,
                                      
                            "teacher": publisher,
                            "size": query[i]["total_assets_size"],
                            "imgurl": img,
                            "subjects": subjects_arr,
                            "price_info": price_info_arr,
                            "is_test_series":query[i]["is_test_series"],
                            "keyword":query[i]["keyword"],
                            "meta_title":query[i]["meta_title"],
                            "meta_desc":query[i]["meta_desc"]
                    }

                        arrResult.push(obj);
                        obj = [];

                        subjects_arr = [];
                        grade_arr=[];
                        price_info_arr = [];



                    }
                }
            }

            return arrResult;

        }
    });
     Meteor.methods({
        'returnMyCourseList': function(query,users) {

             var imageUrl = "http://img.thedigilibrary.com/img/";


            var arrResult = [];

            var price_info = [];
            var price_info_arr = [];
            var subjects_arr = [];
            var subjects = [];
            var obj = [];
            var img = '';
           // return query;

            if (query) {
                for (var i = 0; i < query.length; i++) {
                    if (query[i]) {
                        for (var j = 0; j < query[i]["package_subscription"].length; j++) {
						var hardware_type=query[i]["package_subscription"][j]["hardware_master"]["type"];
						if(hardware_type==2){ //hardware_type==2 means it is for Tablet with SD card
							hardware_type=4;
							}
                            price_info = {
                                "hw_id":query[i]["package_subscription"][j]["hardware_master"]["id"],
                                "hw_name":query[i]["package_subscription"][j]["hardware_master"]["title"],
                                "hw_type":""+hardware_type,
                                "sub_id": query[i]["package_subscription"][j]["id"],
                                "price": query[i]["package_subscription"][j]["subscription_cost"],
                                "discounted_price": query[i]["package_subscription"][j]["discounted_cost"],
                                "duration":query[i]["package_subscription"][j]["subscription"]["duration"],
								"is_paid":"1"
                            }

                            price_info_arr.push(price_info);
                        }
					var gradeId="";
                        for (var k = 0; k < query[i]["package_program"]["course"].length; k++) {
						gradeId=query[i]["package_program"]["course"][k]["id"];
                            for (var l = 0; l < query[i]["package_program"]["course"][k]["subject"].length; l++) {
                            
                            subjects = {
                                "id": query[i]["package_program"]["course"][k]["subject"][l]["id"],
                                "name": query[i]["package_program"]["course"][k]["subject"][l]["name"]

                            }
                            publisher = query[i]["package_program"]["course"][k]["subject"][l]["publisher_name"];
                            subjects_arr.push(subjects);


                        }
                    }

                        if (query[i]["package_media_infos"]["package_image_large"]) {
                            img = imageUrl + query[i]["package_media_infos"]["package_image_large"];
                        } else {
                            img = '';
                        }

                        var total_users=Meteor.call('usersPackagesJoinedCount',query[i]["id"]);
						//console.log("users=="+JSON.stringify(users));
						//users=users[0];
						//console.log(users);
						var hardware_type="0";
						if(users[0]&&users[0].packages_joined &&users[0].packages_joined.length>0){
						//console.log("User=="+JSON.stringify(users[0]));
						//return users[0];
                         for(var j=0;j<users[0]["packages_joined"].length;j++){
						 console.log("id=="+query[i]["id"]);
						 console.log("Package Id=="+users[0]["packages_joined"][j]["package_id"]);
                            if(parseInt(users[0]["packages_joined"][j]["package_id"])==parseInt(query[i]["id"])){

                                 var start_date=users[0].packages_joined[j].joined_date;
                                start_date= start_date.toISOString().slice(0, 19).replace('T', ' ');
                                var expired_on=users[0].packages_joined[j].expiry_date;
                               expired_on= expired_on.toISOString().slice(0, 19).replace('T', ' ');
							   console.log("expired_on=",expired_on);
                                hardware_type= users[0]["packages_joined"][j]["hardware_type"];
                               // break;

                            }
							}
                        }
                                 
                          if(hardware_type==2){ //hardware_type==2 means it is for Tablet with SD card
							hardware_type=4;
							}						  


                        if(hardware_type==4 && query[i]["tdl_package_id"] !=0){
                            var PsCourseId=query[i]["tdl_package_id"];
                            console.log("tdl_package_id",PsCourseId);
                        }else{
                           var PsCourseId=query[i]["id"]; 
                        }

                    if(query[i]["rating"]<3){
                            var rating= query[i]["pkg_rating"]; 
                       }else{
                            var rating=query[i]["rating"];
                       } 

                       if(total_users<500){
                        total_users=query[i]["users_joined"];
                       }


						// console.log("Course Name==="+query[i]["name"]);
                        obj = {
                            "isFreeForPrev": query[i]["is_free_for_preview"],
                            "PsCourseId": PsCourseId,
                            "hw_type":hardware_type,
                            "total_users": total_users,
                           "start_date":start_date,
                           "expired_on":expired_on,
                            "CourseName": query[i]["name"],
                            "numAssessments":query[i]["no_of_tests"],
                              "numNotes":query[i]["no_of_pdfs"],
                              "numMultimedia": query[i]["no_of_multimedia"],
                              "rating":rating,
                                      
                            "teacher": publisher,
                            "size": query[i]["total_assets_size"],
                            "imgurl": img,
                            "subjects": subjects_arr,
                            "price_info": price_info_arr,
							"gradeId":gradeId,
							"isTestSeries":query[i]["is_test_series"]


                        }
                        arrResult.push(obj);
                        obj = [];

                        subjects_arr = [];
                        price_info_arr = [];

                        

                    }
                }
            }

            return arrResult;

        }
    });
     

     Meteor.methods({
        'getBmsUsers': function(gradeId,subjectId,userId) {

        // var count=Users.find(
        //     {$and:[ 
        //         {"preference.course.id": gradeId}, 
        //         { "preference.course.subject_id": subjectId}
                    
        //         ]}
        //     ).count();
            
        //     console.log("countre",count);


        //     if(count>=10){
        //     var random=Math.floor(Math.random() * (count-10)) + 1;
        //     console.log("random",random);
        // }
        //     else{
        //         var random=1;
        //     }

         var query =Users.find(
            {$and:[ 
                {"preference.course.id": gradeId}, 
                { "preference.course.subject_id": subjectId},
                { "id": {$ne:userId}},
                { "name": {$ne:"Hi There "}},
                {"role":12}
                
                    
                ]},
            {
                fields:{
                "_id":0,
                "id":1,
                "name":1,
                "pic":1,
                "mode":1,
                "fb_id":1,
                "google_id":1
                        },
                // skip: random, 
                limit: 10, 
                sort: {id: -1}
            }
            
            ).fetch();

         // console.log("queryUsers",JSON.stringify(query));

         var userList=[];
         if(query[0]){
            for(i=0;i<query.length;i++){

                if (query[i]["pic"]) {
                var pic = "http://mcgrawhilldigi.schoolera.com/app/View/themed/StudentTheme/webroot/img/user_pic/" +
                    query[i]["pic"];
            } else {

                if(query[i]["mode"]=="2"){
                    var fb_id=query[i]["fb_id"];
                    var pic="https://graph.facebook.com/" + fb_id + "/picture?width=60&height=60";


                }
                // else if(query[i]["mode"]=="3"){
                //     var google_id=query[i]["google_id"];
                //     var pic="https://graph.facebook.com/" + fb_id + "/picture?width=60&height=60";

                // }
                else{
                var pic ="default";
                }
            }
                var obj={
                "userId":query[i]["id"],
                "userName":query[i]["name"],
                "userImageUrl":pic
            };
            userList.push(obj);
            obj=[];
            }
         }

         return userList;

            }

        });
		
		
	// method to send push notification	
	Meteor.methods({
		  send_bms_notif: function (reg_id, title, subject, deeplink) {
			  this.unblock();
			  try {
                var ip="http://"+lmsIP+"/Users/gcmPushApi";
				  console.log("bms:GCM Sending ...through ",ip +" ON REG_ID="+reg_id);
                              
				  var result = HTTP.call("POST", ip,
					  {params: {
						  "registrationId" : reg_id,
						  "subject" : subject,
						  "title" : title,
						  "deeplink": deeplink
					  }}
				  );
			  console.log('result',result);
				return result.content;
			  } catch (e) {
				// Got a network error, time-out or HTTP error in the 400 or 500 range.
				//console.log('false');
				var result1= {
					"status":false
				};
				return result1;
			  }  
		  }
	  });

     Meteor.methods({
        'getBmsTestsLists': function(gradeId,subjectId) {
             var pipeline = [
        {$unwind: '$test'}, 
        {$match: {
                "course_id":gradeId,
                "subject_id": subjectId,
                "type":"chapter",
                "test.no_of_question":10
                // "subject.publisher.content.unit.sub_unit.chapter":{$exists:true}
                }
        }, 
        {$project: {
                // "subject.publisher.content.unit.sub_unit.chapter.id": 1,
                "_id":0,
                "id":1,
                "test.id":1,
                "test_name":1,
                "test.total_duration":1,
                "test.no_of_question":1,
                "test.test_type":1,
                "test.test_section.question_id":1
                
                }
        }

    ];
    var result = TestsCollection.aggregate(pipeline);
    // console.log("resulttest",JSON.stringify(result));

    // return result;
if(result[0]){

    
 var random=Math.floor(Math.random() * (result.length)) + 1;

    var randomTest=result[random];
   // return randomTest;
    var totalQuestions=randomTest["test"]["no_of_question"];
    
    if(totalQuestions<randomTest["test"]["total_duration"]){
        var totalTimeLimit=totalQuestions;
    }else{
        var totalTimeLimit=randomTest["test"]["total_duration"];
    }

    var response={
        "chapterId":randomTest["id"],
        "testId":randomTest["test"]["id"],
        "testName":randomTest["test"]["test_name"],
        "totalTimeLimit":totalTimeLimit,
        "totalQuestions":totalQuestions,
        "testType":"Objective"
        // "question_id":randomTest["test_section"]["question_id"]
    };

    //  var jugaar={
    //     "testId":22972,
    //     "testName":"Linear Equation",
    //     "totalTimeLimit":120,
    //     "totalQuestions":10,
    //     "testType":"objective"
    //     // "question_id":randomTest["test_section"]["question_id"]
    // }

// console.log("response",response);
    return response;
}else{
    return "";
}




            }

        });


    Meteor.methods({
        'webTestDetails': function(testId) {
             var pipeline = [
        {$unwind: '$test'}, 
        {$match: {
                // "id":parseInt(chapterId),
                // "subject_id": subjectId,
                "type":"chapter",
                "test.id":parseInt(testId)
                // "test.no_of_question":10
                // "subject.publisher.content.unit.sub_unit.chapter":{$exists:true}
                }
        }, 
        {$project: {
                // "subject.publisher.content.unit.sub_unit.chapter.id": 1,
                "_id":0,
                "id":1,
                "test":1
                // "test.id":1,
                // "test_name":1,
                // "test.total_duration":1,
                // "test.no_of_question":1,
                // "test.test_type":1,
                // "test.test_section.question_id":1
                
                }
        }

    ];
    var result = TestsCollection.aggregate(pipeline);
    // console.log("resulttest",JSON.stringify(result));

    // return result;
if(result[0]){


    var totalQuestions=result[0]["test"]["no_of_question"];
    if(totalQuestions<result[0]["test"]["total_duration"]){
        var totalTimeLimit=totalQuestions;
    }else{
        var totalTimeLimit=randomTest["test"]["total_duration"];
    }
     
    var response=
    {
    "chapterId":result[0]["id"],
    "test_id":result[0]["test"]["id"],
    "total_question":result[0]["test"]["no_of_question"],
    "type":result[0]["test"]["test_type"],
    "rating":result[0]["test"]["rating"],
    "test_status":result[0]["test"]["status"],
    "test_name":result[0]["test"]["test_name"],
    "test_duration":totalTimeLimit,
    "total_marks":result[0]["test"]["total_marks"],
    // "student_status":attempted
};



    return response;
}else{
    return "Test not available!!!";
}




            }

        });


		
	Meteor.methods({
        'notification': function(userId) {
            var notif_data = Notifications.find({"user_id": userId}).fetch();

			var update_is_read = Notifications.update(
                {"user_id": userId},
                {$set: {"newNotificationCount": 0}}
                
            );
//            co
            //console.log("notif_data length==",JSON.stringify(notif_data[0]["notifications"].length));
            if (notif_data&&notif_data.length>0) {
                //code
            
        var notifications=notif_data[0]["notifications"];
       // return notifications
			var result_data=[];
			if(notif_data[0] &&notifications &&notifications.length>0){
				for (var i=0; i< notifications.length;i++){    
					var temp_date = notifications[i].createdDate;
					var date = new Date(temp_date);
					var date_no = date.getDate();
					var month_no = date.getMonth();
					var months = [ "Jan", "Feb", "Mar", "Apr", "May", "June",
						"July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
					var month = months[parseInt(month_no)] ;
					//console.log(date_no+month);
					var data ={
						"messageTitle": notifications[i].messageTitle,
						"messageSubject": notifications[i].messageSubject,
						"message": notifications[i].message,
						"imageUrl": notifications[i].imageUrl,
						"deeplink": notifications[i].deeplink,
						"createdDate": date_no+" "+month
					};
					result_data.push(data);
				}
			}
            }
            return result_data;
        }	
	});	
    
    Meteor.methods({
        'autoIncrementBms':function() {
            var currentId = Bms.findOne({},{fields:{"id":1},sort:{id:-1}});
            var current= currentId["id"];
            var next=current+1;
            //console.log("currentId111"+currentId);
            //MyCollection.insert(doc);
            return next;
        }
    });
    
	Meteor.methods({
        'submit_bms': function(challenger_id, challenger_name,grade_id, subject_id, subject_name, test_id, marks_obtained, total_time, chapter_id, question_list,source) {
            var challenge_id  = Meteor.call('autoIncrementBms');
            var qlistArr=[];
            if (source=='Bms_Test') { //Convert it to Array if ource is BMS
                //code
                qlistArr=JSON.parse(question_list);
            }
            
           // qlistArr=qlistArr.push(question_list);
            var data1 = Bms.insert({
                "id": challenge_id, "challenger_id": challenger_id, "challenger_name":challenger_name, "grade_id": grade_id, 
                "subject_id":subject_id, "subject_name":subject_name, "chapter_id":chapter_id, "test_id":test_id,
                "marks_obtained":marks_obtained, "total_time":total_time, "question_detail": qlistArr	
            });
            if(data1){
                var data2 = {
                    "data" : data1,
                    "challenge_id" : challenge_id
                };
                return data2;
            }else{
                    return "";
            }
            
        }	
	});	
	
        Meteor.methods({
            'autoIncrementNotification':function() {
                var currentId = Notifications.findOne({},{fields:{"id":1},sort:{id:-1}});
                var next=0;
                if (currentId) {
                var current= currentId["id"];
                next=current+1;
                }
               
               
                return next;
            }
        });
        
	Meteor.methods({
            'insert_notificaiton': function(user_id, notification_type, message_title, message_subject, message, image_url, deeplink) {
               
                 var notificaitonCount  = Meteor.call('new_notification_count',user_id);
                 
                console.log("notificaitonCount=="+notificaitonCount);
                var date = new Date();
                date = new Date(date.setMinutes(date.getMinutes() + 330));
                if (notificaitonCount==-1) {//means new user so insert
                     var notificaiton_id  = Meteor.call('autoIncrementNotification');
                     notificaitonCount=notificaitonCount+1;//Increase count by One
                     var data = Notifications.insert({
                    "id": notificaiton_id, "user_id": user_id,"newNotificationCount":1,
                   "notifications": [{ 
                    "notificationType":notification_type, "messageTitle": message_title, 
                    "messageSubject":message_subject, "message":message, "imageUrl":image_url, "deeplink":deeplink, "createdDate": date,	
                    "is_read":0    
                }]});
                }else{
                     notificaitonCount=notificaitonCount+1;//Increase count by One
                var data = Notifications.update({
                    "user_id": user_id},{$set:{"newNotificationCount":notificaitonCount},
                   $addToSet: {"notifications": { 
                    "notificationType":notification_type, "messageTitle": message_title, 
                    "messageSubject":message_subject, "message":message, "imageUrl":image_url, "deeplink":deeplink, "createdDate": date,	
                    "is_read":0    
                }}},{upsert:false});
            }
//                console.log('data',data);
                return data;
            }	
	});

    Meteor.methods({
            'new_notification_count': function(userId) {
                var notificationCount = -1;
                var notif_data = Notifications.find({"user_id": parseInt(userId)}).fetch();
                if (notif_data&&notif_data.length>0) {
                    notificationCount=notif_data[0]["newNotificationCount"] //code
                }
               
               // console.log('data',data);
                return notificationCount;
            }   
    });
    Meteor.methods({
            'getTotalNotifications': function(userId) {
                var notificationCount = 0;
                var notif_data = Notifications.find({"user_id": parseInt(userId)}).fetch();
                if (notif_data&&notif_data.length>0) {
                    notificationCount=notif_data[0]["notifications"].length //code
                }
               
               // console.log('data',data);
                return notificationCount;
            }   
    });
    
    Meteor.methods({
            'setNotificationAsRead': function(userId,notificationId) {
                
                var notificaitonCount  = Meteor.call('new_notification_count',parseInt(userId));
                
                var data = Notifications.update({
                    "user_id": parseInt(userId)},{$set:{"newNotificationCount":notificaitonCount-1}}
                    
                ,{upsert:false});
                return data;
            }   
    });
    
     Meteor.methods({
            'increaseCartCount': function(userId) {
                
                var cartCount  = Meteor.call('getCartCount',parseInt(userId));
                
                var data = Users.update({
                    "user_id": parseInt(userId)},{$set:{"cart_count":cartCount+1}}
                    
                ,{upsert:false});
                return data;
            }   
    });
     
     Meteor.methods({
            'decreaseCartCount': function(userId) {
                
                var cartCount  = Meteor.call('getCartCount',parseInt(userId));
                
                var data = Users.update({
                    "user_id": parseInt(userId)},{$set:{"cart_count":cartCount-1}}
                    
                ,{upsert:false});
                return data;
            }   
    }); 

    Meteor.methods({
        'submit_bms_opponent': function(challenge_id, current_user_id, current_user_name, source, marks_obtained, total_time,question_list) {
            var update_val = {
                "opponent_id": current_user_id,
                "opponent_name": current_user_name,
                "marks_obtained" : marks_obtained, 
                "total_time" : total_time, 
                "source": source,
                "question_detail" : JSON.parse(question_list)
            };
            
            var data = Bms.update(
                {"id": challenge_id},
                {$push: {"opponent": update_val}}
            );
           // console.log('data',data);
            return data;
        }   
    });
    Meteor.methods({
            'returnDays': function(firstDate,secondDate) {
var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

if(Validator.isNull(secondDate)){
 secondDate = new Date("2016-01-02 16:18:04");
}else{
secondDate = new Date(secondDate);

}

console.log("secondDate",secondDate);
firstDate=new Date(firstDate);
var diffDays=0;
if(secondDate.getTime() - firstDate.getTime()>0){
diffDays = Math.round(Math.abs((secondDate.getTime() - firstDate.getTime())/(oneDay)));
}
return diffDays;


        }   
    });


Meteor.methods({
    'getGrades': function() {
        var course=Courses.find({},{fields:{"_id":0,"id":1}}).fetch();
        grades=[];
        for(var i=0;i<course.length;i++){
            grades.push(course[i]["id"]);
        }
        return grades;


    }
});

Meteor.methods({
    'getSubjectsID': function(gradeId) {
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
                "subject.id": 1

                    }
        }   

    ];
    // console.log("testId",testId);
    var result = Courses.aggregate(pipeline);
    var subjects=[];

    for(var i=0;i<result.length;i++){

        subjects.push(result[i]["subject"]["id"]);
    }
        return subjects;


    }
});

    Meteor.methods({
    'submit_bms_for_sharing': function(challenger_id, challenger_name,grade_id, test_id, marks_obtained, total_time, chapter_id, question_list) {
        var challenge_id  = Meteor.call('autoIncrementBms');
        var data1 = Bms.insert({
            "id": challenge_id, "challenger_id": challenger_id, "challenger_name":challenger_name, 
            "grade_id": grade_id, "chapter_id":chapter_id, "test_id":test_id,
            "marks_obtained":marks_obtained, "total_time":total_time, "question_detail": JSON.parse(question_list)	
        });
//            console.log('data',data);
        if(data1){
            var data2 = {
                "data" : data1,
                "challenge_id" : challenge_id
            };
            return data2;
        }else{
                return "";
        }

    }	
    });


    Meteor.methods({
    'cacheTOC': function() {
    var grades=Meteor.call('getGrades');       

        for(var i=0;i<grades.length;i++){
            var subjects=Meteor.call('getSubjectsID',grades[i]);
            for(var j=0; j<subjects.length;j++){
                //console.log("grades",grades[i]);
                //console.log("subjects",subjects[j]);
                console.log("start:",new Date());
				var packages=Meteor.call('getPackagesByGradeAndSubject',grades[i],subjects[j]);
                if (packages&&packages.length>0) {
                    //code
                    for(var k=0; k<packages.length;k++){                      
                   
				//Meteor.setTimeout(function(){           
                    HTTP.call("POST", "http://localhost:3000/course/suggestedCoursesTocListing",
                      {params: {
                          "subjectId": subjects[j],
                        "gradeId": grades[i],
                        "userId": 4000021,
                        "token": "global",
                        "packageId": packages[k]["id"] 						  
                      }}
                  );
                    console.log("Cache for GradeId=="+grades[i]+",SubjectId="+subjects[j]+",PackageId=="+packages[k]["id"]);
             // }, 55000); 
                 }
                }
                console.log("enddate:",new Date());
                //console.log("response",JSON.stringify(resonse));
            }
        }

    }
});
    
    
    Meteor.methods({
            'getPackagesByGradeAndSubject':function(gradeId,subjectId) { 
    var query = Packages.find(
                {$and: [

                {"status":1},
                {"for_csr_only":{$ne:1}},                
                {"is_demo_package":false},
                {"se_package":0},                
                {"package_level.id":{$ne:5}},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id":subjectId}

                
                ]},
            {fields:
                        {"id":1,"name":1,
                    "package_program.course.id":1
                    }
                    
                }).fetch();

                        console.log("course_list Size=="+query.length);
                        return query;
                       // console.log("course_list=="+JSON.stringify(query));
   
    }
});                     
    
     Meteor.methods({
            'getSummaryByCategoryId':function(categoryId) {
                var summary ="";
                
                var grades=Courses.find({"categories.id":parseInt(categoryId)},{fields:{"id":1,"_id":0}}).fetch();
               // console.log("grades==",JSON.stringify(grades));
               if (grades&&grades.length>0) {
                //code
                var totalPackage=0
                var totalPublishers=0
                var totalUsers=0
                console.log("grades.length===",grades.length);
               
            
                for (var i=0; i<grades.length; i++) {
                    //code
                    var gradeId=grades[i]["id"];
                   // console.log("gradeId==",gradeId);
                   var levelId=[3,4];
                     var packageCount=Packages.find({"package_program.course.id":parseInt(gradeId),"package_level.id":{$in:levelId}}).count();
                     //console.log("packageCount==",packageCount);
                     totalPackage=totalPackage+packageCount;
                }
                totalUsers=Users.find({"preference.cat_id":parseInt(categoryId)}).count();
                
                summary={
                    "totalPackages":totalPackage,
                    "totalPublishers":totalPublishers,
                    "totalUsers":totalUsers
                }
                
                
               }
               
               
                return summary;
            }
        });


    //  Meteor.methods({
    //         'usersJoinedPlus':function(packageId) {

    //         var query= Packages.findOne(
    //                 {"id":parseInt(packageId)},
    //                 {fields:{"users_joined":1}}
    //             );

    //         if(query){
    //             var count=query["users_joined"]+1;
    //             console.log("count",count);

    //             Packages.update(
    //                 {"id":parseInt(packageId)},
    //                 {$set:{"users_joined":NumberLong(count)}}
    //             );

    //         }
    //     }
    // });

    //  Meteor.methods({
    //         'usersJoinedMinus':function(packageId) {

    //         var query= Packages.findOne(
    //                 {"id":parseInt(packageId)},
    //                 {fields:{"users_joined":1}}
    //             );

    //         if(query){
    //             var count=query["users_joined"]-1;
    //             console.log("count",count);

    //             Packages.update(
    //                 {"id":parseInt(packageId)},
    //                 {$set:{"users_joined":NumberLong(count)}}
    //             );

    //         }
    //     }
    // }); 



    Meteor.methods({
            'publisherInfo':function(publisherId) {
               var query=ContentPartners.find({"user_id": {$in: publisherId}}).fetch();
               // console.log("publisherId",publisherId);
               // console.log("query",query);

               var publisher=[];
               var publisher_arr=[];
               var publisherName=[];
                    for(var i=0;i<query.length;i++){
                        if (query[i]["short_desc"]) {

                            var desc = query[i]["short_desc"];

                        } else {
                            var desc = "";
                        }

                        if (query[i]["image_name"]) {
                            var publisher_img = 'https://globalapi.schoolera.com/img/publisher/' +
                                query[i]["image_name"];
                        } else {
                            var publisher_img = "";
                        }
                        publisher = {

                            "name": query[i]["name"],
                            "short_desc": desc,
                            "image": publisher_img


                        }
                publisher_arr.push(publisher);
                publisherName.push(query[i]["name"]);
            }
			var publisherName="iProf Learning"
			if(query.length>0){			
			publisherName=query[0]["name"]
				}
                // for(var i=0;i<publisherId.length;i++){
                //     if(publisherId[i]==205){
                //         publisher = {

                //             "name": "iProf Learning",
                //             "short_desc": "iProf is India’s leading digital education company established in 2009. In just 5 years, the iProf platform has been used by more than 8 million students across courses ranging from KG to examinations like IIT / PMT / CAT",
                //             "image": ""


                //         };
                //         publisher_arr.push(publisher);
                //         publisherName.push("iProf Learning");
                //     }
                // }

                return {
                    "publisher_arr":publisher_arr,
                    "publisherName":publisherName
                }

               
            
        }
    });



