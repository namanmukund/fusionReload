Meteor.methods({
        'getWallCountData': function(gradeId, subjectId,showOnWeb) {
            //var currentUserId = Meteor.userId();
            var countCourse = 0;
            var countSubject = 0;
            var countCourseTest = 0;
            var countSubjectTest = 0;

        if(showOnWeb==true){
            countCourse = Packages.find(
                {$and: [
                
               // {$or: [
               // {"package_level.id":1},
               // {"package_level.id":2},
               // {"package_level.id":3},
               //  ]},
               // {"package_level.id":{$ne:4}},
                // {"package_level.id":{$ne:5}},
                {"package_level.id":{$ne:5}},
               {"status":1},
                {"for_csr_only":0},
                {"show_on_web":1},
                {"package_subscription.status":1},
                {"is_demo_package":false},
                {"se_package":0},
               
               {"is_test_series":{$ne:1}},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}

                
                ]}).count();

          countSubject= Packages.find(
                {$and: [
                {"package_level.id":4},
                {"status":1},
                {"for_csr_only":0},
                {"show_on_web":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},
               {"is_test_series":{$ne:1}},
               {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}
                ]}).count();

          countCourseTest = Packages.find(
                {$and: [
              //  {$or: [
               // {$or: [
               // {"package_level.id":1},
               // {"package_level.id":2},
               // {"package_level.id":3},
               //  ]},

               // {"package_level.id":{$ne:4}},
                // {"package_level.id":{$ne:5}},
                {"package_level.id":{$ne:5}},
               {"status":1},
                {"for_csr_only":0},
                {"show_on_web":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},
               // {"package_level.id":"2"},
               // {"package_level.id":"3"},
                // ]},
                {"is_test_series": 1},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}

                
                ]}).count();

          countSubjectTest= Packages.find(
                {$and: [
                {"package_level.id":4},
                {"status":1},
                {"for_csr_only":0},
                {"show_on_web":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},
                {"is_test_series": 1},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}
                ]}).count();


      }else{

            countCourse = Packages.find(
                {$and: [
                
               // {$or: [
               {"package_level.id":1},
               // {"package_level.id":2},
               // {"package_level.id":3},
               //  ]},
               // {"package_level.id":{$ne:4}},
                // {"package_level.id":{$ne:5}},
               {"status":1},
                {"for_csr_only":0},
                {"show_on_app":1},
                {"package_subscription.status":1},
                {"is_demo_package":false},
                {"se_package":0},
               
               {"is_test_series":{$ne:1}},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}

                
                ]}).count();

          countSubject= Packages.find(
                {$and: [
                {"package_level.id":4},
                {"status":1},
                {"for_csr_only":0},
                {"show_on_app":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},
               {"is_test_series":{$ne:1}},
               {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}
                ]}).count();

          countCourseTest = Packages.find(
                {$and: [
              //  {$or: [
               // {$or: [
               {"package_level.id":1},
               // {"package_level.id":2},
               // {"package_level.id":3},
               //  ]},

               // {"package_level.id":{$ne:4}},
                // {"package_level.id":{$ne:5}},
               {"status":1},
                {"for_csr_only":0},
                {"show_on_app":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},
               // {"package_level.id":"2"},
               // {"package_level.id":"3"},
                // ]},
                {"is_test_series": 1},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}

                
                ]}).count();

          countSubjectTest= Packages.find(
                {$and: [
                {"package_level.id":4},
                {"status":1},
                {"for_csr_only":0},
                {"show_on_app":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},
                {"is_test_series": 1},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}
                ]}).count();

      }
         
            


            var doc = {"countCourse": countCourse,
                    "countSubject": countSubject,
                    "countCourseTest": countCourseTest,
                    "countSubjectTest": countSubjectTest
                };

            return doc;


        },
        'getCourseList': function(gradeId,subjectId,maxLimit,userId,showOnWeb) {
            //var currentUserId = Meteor.userId();


        if(showOnWeb==true){    
            var query = Packages.find(
                {$and: [

                {"status":1},
                {"for_csr_only":0},
                {"show_on_web":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},
                {"package_level.id":{$ne:5}},
                // {"package_level.id":{$ne:4}},
                // {"package_level.id":{$ne:5}},
               //  {$or: [
               // {"package_level.id":1},
               // {"package_level.id":2},
               // {"package_level.id":3},
               // {"package_level.id":8},
               //  ]},
                {"is_test_series":{$ne:1}},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}

                
                ]},
            {fields:
                        {"id":1,"name":1, "short_desc":1, "created":1,


                    "pkg_rating":1,
                    "users_joined":1, 

                    "meta_title":1,
                    "meta_desc":1,
                    "keyword":1,
                    "is_test_series":1,    
                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1,
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
                    "package_subscription.subscription.id":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 },
                    limit:maxLimit
                }).fetch();


                        console.log("course_list"+JSON.stringify(query));
                        //console.log("gradeId"+gradeId);

        // return query;
        console.log("showOnWeb");
        return Meteor.call('returnJson',query,userId); 
        }else{
            var query = Packages.find(
                {$and: [

                {"status":1},
                {"for_csr_only":0},
                {"show_on_app":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},
                // {"package_level.id":{$ne:4}},
                // {"package_level.id":{$ne:5}},
               //  {$or: [
               {"package_level.id":1},
               // {"package_level.id":2},
               // {"package_level.id":3},
               //  ]},
                {"is_test_series":{$ne:1}},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}

                
                ]},
            {fields:
                        {"id":1,"name":1, "short_desc":1, "created":1,

                      "pkg_rating":1,
                    "users_joined":1,    

                    "is_free_for_preview" :1,
                    "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1,
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
                    "package_subscription.subscription.id":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 },
                    limit:maxLimit
                }).fetch();


                        // console.log("course_list"+JSON.stringify(query));
                        //console.log("gradeId"+gradeId);

        // return query;
        return Meteor.call('returnJson',query,userId);

        }       



            

        },
        'getSubjectList': function(gradeId,subjectId,maxLimit,userId,showOnWeb) {


        if(showOnWeb==true){     
            var query = Packages.find(
                {$and: [
                {"package_level.id":4},

                {"status":1},
                {"for_csr_only":0},
                {"show_on_web":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},

                {"is_test_series":{$ne:1}},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}
                ]},
            {fields:
                        {"id":1,"name":1, "short_desc":1, "created":1,

                     "pkg_rating":1,
                    "users_joined":1,     

                    "meta_title":1,
                    "meta_desc":1, 
                    "keyword":1,
                    "is_test_series":1, 
                    "is_free_for_preview" :1,
                    "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1,
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
                    "package_subscription.subscription.id":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 },
                    limit:maxLimit

                }).fetch();

            // return query;
            return Meteor.call('returnJson',query,userId); 
        }else{
            var query = Packages.find(
                {$and: [
                {"package_level.id":4},

                {"status":1},
                {"for_csr_only":0},
                {"show_on_app":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},

                {"is_test_series":{$ne:1}},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}
                ]},
            {fields:
                        {"id":1,"name":1, "short_desc":1, "created":1,

                      "pkg_rating":1,
                    "users_joined":1,    

                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1, 
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
                    "package_subscription.subscription.id":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 },
                    limit:maxLimit

                }).fetch();

            // return query;
            return Meteor.call('returnJson',query,userId);
        }

        },
        'getTestCourseList': function(gradeId,subjectId,maxLimit,userId,showOnWeb) {
            

    if(showOnWeb==true){             

             var query = Packages.find(
                {$and: [
                // {$or: [
               // {"package_level.id":1},
               // {"package_level.id":2},
               // {"package_level.id":3},
               // {"package_level.id":8},
               //  ]},

                // {"package_level.id":{$ne:4}},
                // {"package_level.id":{$ne:5}},

               {"status":1},
               {"package_level.id":{$ne:5}},
                {"for_csr_only":0},
                {"show_on_web":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},

               
                {"is_test_series": 1},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}

                
                ]},
            {fields:
                    {"id":1,"name":1, "short_desc":1, "created":1,

                     "pkg_rating":1,
                    "users_joined":1, 

                     "meta_title":1,
                    "meta_desc":1,
                    "keyword":1, 
                    "is_test_series":1,    
                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1, 
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
                    "package_subscription.subscription.id":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 },
                    limit:maxLimit
                }).fetch();




            return Meteor.call('returnJson',query,userId); 

        }else{
                         var query = Packages.find(
                {$and: [
               //  {$or: [
               {"package_level.id":1},
               // {"package_level.id":2},
               // {"package_level.id":3},
               //  ]},

                // {"package_level.id":{$ne:4}},
                // {"package_level.id":{$ne:5}},

               {"status":1},
                {"for_csr_only":0},
                {"show_on_app":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},

               
                {"is_test_series": 1},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}

                
                ]},
            {fields:
                    {"id":1,"name":1, "short_desc":1, "created":1,

                     "pkg_rating":1,
                    "users_joined":1, 

                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1, 
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
                    "package_subscription.subscription.id":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 },
                    limit:maxLimit
                }).fetch();




            return Meteor.call('returnJson',query,userId);

        }

        },       'getTestSubjectList': function(gradeId,subjectId,maxLimit,userId,showOnWeb) {


            if(showOnWeb==true){
            var query = Packages.find(
                {$and: [
                {"package_level.id":4},

                {"status":1},
                {"for_csr_only":0},
                {"show_on_web":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},


                {"is_test_series": 1},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}
                ]},
            {fields:
                        {"id":1,"name":1, "short_desc":1, "created":1,


                     "pkg_rating":1,
                    "users_joined":1,     

                     "meta_title":1,
                    "meta_desc":1,
                    "keyword":1,
                    "is_test_series":1, 
                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1, 
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
                    "package_subscription.subscription.id":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 },
                    limit:maxLimit
                }).fetch();


            return Meteor.call('returnJson',query,userId); 
        }else{
            var query = Packages.find(
                {$and: [
                {"package_level.id":4},

                {"status":1},
                {"for_csr_only":0},
                {"show_on_app":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},


                {"is_test_series": 1},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}
                ]},
            {fields:
                        {"id":1,"name":1, "short_desc":1, "created":1,

                     "pkg_rating":1,
                    "users_joined":1,     

                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1, 
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
                    "package_subscription.subscription.id":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 },
                    limit:maxLimit
                }).fetch();


            return Meteor.call('returnJson',query,userId); 

        }
        },
'getPackageChapter': function(gradeId,chapterId,isTestSeries,userId) {






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
                    
                "id":gradeId,
                // "subject.publisher.content.unit.sub_unit.chapter.id": {$exists:true},
                "subject.publisher.content.unit.sub_unit.chapter.id": chapterId,
                // "subject.publisher.content.unit.sub_unit.chapter.study.status": 2,
                // "subject.publisher.content.unit.sub_unit.chapter.is_deleted":0
            }
        }
        , {
            $project: {
                // "subject.publisher.content.unit.sub_unit.chapter.id":1,
                // "subject.publisher.content.unit.sub_unit.chapter.study":1,
                // "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.id":1,

                "subject.publisher.content.unit.sub_unit.chapter.id": 1,
                "subject.publisher.content.unit.sub_unit.chapter.study.id": 1,
                "subject.publisher.content.unit.sub_unit.chapter.study.status":1,
                "subject.publisher.content.unit.sub_unit.chapter.study.is_deleted":1,

                
                "subject.publisher.content.unit.sub_unit.chapter.study.heading": 1,
                "subject.publisher.content.unit.sub_unit.chapter.study.description": 1,
                "subject.publisher.content.unit.sub_unit.chapter.study.file_name": 1,
                "subject.publisher.content.unit.sub_unit.chapter.study.md5": 1,
                "subject.publisher.content.unit.sub_unit.chapter.study.duration": 1,
                "subject.publisher.content.unit.sub_unit.chapter.study.type": 1,
                "subject.publisher.content.unit.sub_unit.chapter.study.files_count": 1,
                "subject.publisher.content.unit.sub_unit.chapter.study.thumbnail": 1,
                "subject.publisher.content.unit.sub_unit.chapter.study.size": 1,
                "subject.publisher.content.unit.sub_unit.chapter.study.file_path": 1,



                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.id": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.is_available": 1,

                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.is_deleted": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.is_deleted": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.status": 1,

                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.id": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.heading": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.description": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.file_name": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.md5": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.duration": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.type": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.files_count": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.thumbnail": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.size": 1,
                "subject.publisher.content.unit.sub_unit.chapter.sub_chapter.topic.study.file_path": 1




                




            }
        }

    ];
    var result = Courses.aggregate(pipeline);
    // return result;
   // console.log(JSON.stringify(result));
    if(result[0]){
    if(isTestSeries=="0"){

    var chapter = result[0]["subject"]["publisher"]["content"]["unit"]["sub_unit"]["chapter"];

    var imageUrl = "http://lms.thedigilibrary.com/";


    // console.log(JSON.stringify(chapter));
    // console.log("chapter len",chapter["study"].length);

   
        var chapter_content = "No";
    



   
        
        var topic_content = "No";
    


    //console.log("topic_content",topic_content);
//console.log("chapter_content",chapter_content);

    var topic = [];
    var topic_arr = [];

    var topicContent = [];
    var content_arr = [];
    var empty=[];

if (chapter["sub_chapter"][0]["topic"][0]["study"]) {
    for (var i = 0; i < chapter["sub_chapter"][0]["topic"].length; i++) {
        
console.log("topicId",chapter["sub_chapter"][0]["topic"][i]);

            for (var j = 0; j < chapter["sub_chapter"][0]["topic"][i]["study"].length; j++) {
                if( chapter["sub_chapter"][0]["topic"][i]["is_deleted"]==0 &&
                // chapter["sub_chapter"][0]["topic"][i]["study"] && 
                chapter["sub_chapter"][0]["topic"][i]["study"][j]["is_deleted"]==0 &&
                chapter["sub_chapter"][0]["topic"][i]["study"][j]["status"]==2){

            topic_content = "Yes";


			var filePath=chapter["sub_chapter"][0]["topic"][i]["study"][j]["file_path"]
                                        +chapter["sub_chapter"][0]["topic"][i]["study"][j]["file_name"];
                                        console.log("filePath=="+filePath);
                if (filePath.indexOf(".mp4")>=0||filePath.indexOf(".pdf")>=0) { //Only Support of .mp4 or .pdf files
                        var fileType="notes";
                  if(filePath.indexOf(".mp4")>=0){
                     fileType="video";   
                  }
                                        
				filePath=imageUrl+encodeURI(filePath);
                topicContent = {
                    "id":chapter["sub_chapter"][0]["topic"][i]["study"][j]["id"],
                    "heading":chapter["sub_chapter"][0]["topic"][i]["study"][j]["heading"],
                    "file_path":filePath,
                    "md5":chapter["sub_chapter"][0]["topic"][i]["study"][j]["md5"],
                    "duration":chapter["sub_chapter"][0]["topic"][i]["study"][j]["duration"],
                    "file_type": fileType,
                    "file_size":chapter["sub_chapter"][0]["topic"][i]["study"][j]["size"]

                }
                
                //return content;

                content_arr.push(topicContent);
                                        }
                topicContent = [];

            }
			}
			}
			
			
        } else {
            content_arr = [];
        }
        var content = content_arr;
        var topic = {
            content
        };

        topic_arr.push(topic);
    

    //console.log("chapter["study"]",chapter["study"]);
    var chapStudyArr=[];
    if(chapter["study"].length>0){
    for(var i=0;i<chapter["study"].length;i++){
        if(
        chapter["study"][i]["is_deleted"]==0 && 
        chapter["study"][i]["status"]==2){

        chapter_content = "Yes";
            
        var chapStudy=[];
        var filePath=chapter["study"][i]["file_path"]
                                +chapter["study"][i]["file_name"];
				filePath=imageUrl+encodeURI(filePath);
				console.log("filePath=="+filePath);
                if (filePath.indexOf(".mp4")>=0||filePath.indexOf(".pdf")>=0) { //Only Support of .mp4 or .pdf files
                        var fileType="notes";
                  if(filePath.indexOf(".mp4")>=0){
                     fileType="video";   
                  }
        chapStudy={
            "id":chapter["study"][i]["id"],
            "heading":chapter["study"][i]["heading"],
            "file_path":filePath,
            "md5":chapter["study"][i]["md5"],
            "duration":chapter["study"][i]["duration"],
            "file_type": fileType,
            "file_size":chapter["study"][i]["size"]
        }
        chapStudyArr.push(chapStudy);
                }
    }
}
}else{
        var chapter_content = "No";
         chapStudyArr=[];
    }
    // return chapter["study"];

   var test_arr=Meteor.call('getChapterTest',chapterId,gradeId,userId);
   // var test='';

    if(test_arr.length>0){
       var test=test_arr;
       var arrResult = {

        // "result_data": {
        "chapter_content": chapter_content,
        "content": chapStudyArr,

        "topic_content": topic_content,
        "topics": topic_arr,
        "test":test

};
    }else{
        var arrResult = {

        // "result_data": {
        "chapter_content": chapter_content,
        "content": chapStudyArr,

        "topic_content": topic_content,
        "topics": topic_arr
        

};


    }
    

    return arrResult;

}else if(isTestSeries=="1"){
    var resultArr=Meteor.call('getChapterTest',chapterId,gradeId,userId);
    return resultArr;
}


else{
    return "";
}
}
else{
    return "";
}

    

        






          }
      });
 






         Meteor.methods({

            'mainPdpPage': function(courseId,userId){
                
                var query = Packages.find( {"id":courseId},
                
                 
                   { fields:
                    {"id":1,"name":1, "short_desc":1,"desc":1, "created":1,

                     "pkg_rating":1,
                    "users_joined":1, 

                     "meta_title":1,
                    "meta_desc":1, 
                    "keyword":1,
                    "is_test_series":1,

                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1, 
                    "total_assets_size":1,  
                    "rating":1,
                    "publisher_ids":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_program.course.subject.publisher_short_desc":1,
                    "package_program.course.subject.publisher_image_name":1,                    
                    "package_subscription.subscription.id":1,
                    "package_subscription.id":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 }}).fetch();


//console.log("hey"+Packages.find().fetch({"id":"49846"}));

  
var imageUrl = "http://img.thedigilibrary.com/img/";


var arrResult= [];

var price_info=[];
var price_info_arr=[];
var subjects_arr=[];
var subjects=[];
var publisher=[];
var publisher_arr=[];
publisherName=[];
var obj=[];
var img='';





                
                   // for (var i = 0; i < query.length; i++) {
						var i=0;
                        if(query[i]){
                            var isJoined=false;
							
							var packageHardware=Meteor.call('getPackageHardware',userId,query[i]["id"]);
							console.log("packageHardware==",packageHardware);
							var purchaseOnHardwares="";
							if(packageHardware&&packageHardware.length>0){
							isJoined=true;
							for(var x=0;x<packageHardware.length; x++){
							purchaseOnHardwares=purchaseOnHardwares+packageHardware[x]+",";
							}
							}
							//console.log("purchaseOnHardwares==",purchaseOnHardwares);
							var isPurchased=false;
                            for(var j=0;j<query[i]["package_subscription"].length;j++){
							var isPaidForHardware="0";//Not taken boolean due to client side restriction							
							console.log("hardwaretype==",query[i]["package_subscription"][j]["hardware_master"]["type"]);
							console.log("Index==",packageHardware.indexOf(query[i]["package_subscription"][j]["hardware_master"]["type"]))
								if(purchaseOnHardwares.indexOf(query[i]["package_subscription"][j]["hardware_master"]["type"])>=0){
								isPaidForHardware="1";
								isPurchased=false;
									}
                                    var discountedPrice=query[i]["package_subscription"][j]["discounted_cost"];
                                    if (discountedPrice==0) {
                                        //code
                                        discountedPrice=query[i]["package_subscription"][j]["subscription_cost"];
                                    }
                              price_info={
                                "hw_id":query[i]["package_subscription"][j]["hardware_master"]["id"],
                                "hw_name":query[i]["package_subscription"][j]["hardware_master"]["title"],
                                "hw_type":query[i]["package_subscription"][j]["hardware_master"]["type"],
                                "sub_id": query[i]["package_subscription"][j]["id"],
                                "price": query[i]["package_subscription"][j]["subscription_cost"],
                                "discounted_price": discountedPrice,
                                "duration":query[i]["package_subscription"][j]["subscription"]["duration"],
								"is_paid":isPaidForHardware

                            } 

                                 price_info_arr.push(price_info);
                                 
                                  
                        }

                        


                          

                           for (var k = 0; k < query[i]["package_program"]["course"].length; k++) {
                            for (var l = 0; l < query[i]["package_program"]["course"][k]["subject"].length; l++) {
                           // console.log("hey");
                            subjects = {
                                "id": query[i]["package_program"]["course"][k]["subject"][l]["id"],
                                "name": query[i]["package_program"]["course"][k]["subject"][l]["name"]

                            }
                           
                            
                            
                           
                            
                            
                            
                            subjects_arr.push(subjects);



                        }
                    }

  

                

                    

                           if(query[i]["package_media_infos"]["package_image_large"]){
                            img=imageUrl+query[i]["package_media_infos"]["package_image_large"];
                           }else{
                              img='';
                           }
                           var total_users=Meteor.call('usersPackagesJoinedCount',query[i]["id"]);
                        var isTestSeries=query[i]["is_test_series"];
                        var totalPDFs=query[i]["no_of_pdfs"];                        
                        var totalMultiMedias=query[i]["no_of_multimedia"];
                        var totalTests=query[i]["no_of_tests"];
                        if (isTestSeries==1) {
                            //code
                            totalMultiMedias=0;
                            totalPDFs=0;
                        }
                            if(query[i]["rating"]<3){
                            var rating= query[i]["pkg_rating"]; 
                       }else{
                            var rating=query[i]["rating"];
                       } 

                       if(total_users<500){
                        total_users=query[i]["users_joined"];
                       }
                           
                      var prof=Meteor.call('publisherInfo',query[i]["publisher_ids"]);
                           

                           obj={
                                    "isFreeForPrev":query[i]["is_free_for_preview"],
                                     "PsCourseId":query[i]["id"],
                                     "isJoined":isJoined,
									 "isPurchased":isPurchased,
                                     "CourseName": query[i]["name"],
                                      "size": query[i]["total_assets_size"],
                                      "numAssessments":totalTests,
                                      "numNotes":totalPDFs,
                                      "numMultimedia":totalMultiMedias ,
                                      "rating":rating,
                                      "total_users": total_users,
                                     "teacher": prof["publisherName"],
                                      "duration":query[i]["package_subscription.subscription.duration"],
                                      "description":query[i]["short_desc"],
                                      "publisher":prof["publisher_arr"],
                                      "subjects": subjects_arr,
                                      "price_info": price_info_arr,
                                      "desc": query[i]["desc"],
                                "meta_title":query[i]["meta_title"],
                                "meta_desc":query[i]["meta_desc"], 
                                "keyword":query[i]["keyword"],
                                "is_test_series":query[i]["is_test_series"] 
                                                           } 
                           arrResult.push(obj);
                           obj=[];
                        
                            subjects_arr=[];
                            price_info_arr=[];
                            publisher_arr=[];
                            publisherName=[];



                          
                         }
                         
                        // console.log(obj);
                         
                      // }
                     
return arrResult;




}});


     Meteor.methods({
        'getQdData': function(userId, gradeId, subjectId) {
            //change date_of_qd_qw
			var date = new Date();
            date.setHours(0,0,0,0);
            date = new Date(date.setMinutes(date.getMinutes() + 330));
            var query1 = QdQwTransactions.find({
							$and: [
								{"course_id": gradeId}, 
								{"subject_id": {$in: subjectId}},
								{"status" : 1},
								{"flag_qd_qw":1},
								{"date_of_qd_qw": date}
							]
						},
						{	fields: {"id": 1, "question_id": 1, "course_id":1, "subject_id":1, "title":1, 
								"user_answers.option_id": 1, "user_answers.correct_answer":1, "user_answers.user_id":1
							}
						}						
						).fetch();

			var response_arr = [];
            var options_arr=[];
            var image_url = 'http://wapcontent.thedigilibrary.com/question_image/questionBank_PS_images/';
			//console.log('query1',query1);
			// if question exists in question_master
			var ques_exist = 1 ;
            if(query1[0]){
                var obj = [];
                obj['grade_id'] = query1[0].course_id;
                obj['subject_id'] = query1[0].subject_id;
                obj['question_id'] = query1[0].question_id;
                obj['question_title'] = query1[0].title;
                
                var query2 = QuestionMasters.find({"id": query1[0].question_id },
                {fields: {"id": 1, "statement": 1, "question_image": 1, 
                    "options": 1 }}).fetch();
				//console.log('query2',query2);
				
                if(query2[0]){
                    obj['question_statement'] = query2[0].statement;
                    if(query2[0].question_image){
                        obj['question_img'] = image_url+query2[0].question_image; 
                    }else{
                        obj['question_img'] = "";
                    }
                    var options =[];
                    for (var i = 0; i < query2[0].options.length; i++) {//query2[0].options.length

                        if(query2[0].options[i].option_image){
                            var option_img =  image_url+query2[0].options[i].option_image;
                        }else{
                            var option_img = "";
                        }
                        
                        var obj1 = {
                            "option_id" :query2[0].options[i].id,
                            "option_statement" : query2[0].options[i].statement,
                            "option_img" : option_img
                        };
                        options_arr.push(obj1);
                        obj1=[];
                        console.log("key",query2[0].options[i].key);
                        console.log("key",query2[0].options[i].id);
                        if(query2[0].options[i].key!= 0){

                            obj['question_correct_option_id'] = query2[0].options[i].id;
                            obj['question_solution_text'] = query2[0].options[i].explanation;
                            if(query2[0].options[i].option_image){
                                obj['question_solution_img'] = image_url+query2[0].options[i].option_image; //add abslute url
                            }else{
                                obj['question_solution_img'] = "";
                            } 
                        }
                    }
                    //console.log('options',options);  
					
                    var correct_count = 0;
                    if(query1[0].user_answers[0]){
						var total_count = query1[0].user_answers.length;
                        for (var i = 0; i < query1[0].user_answers.length; i++) { 
                            if(query1[0].user_answers[i].user_id == userId ){
                                obj['question_submit_status'] = true;
                                obj['user_selected_option_id'] = query1[0].user_answers[i].option_id ; 
                            }
                            if(query1[0].user_answers[i].correct_answer==1){
                                correct_count=correct_count+1;
                            }
                        }  
						if(correct_count!=0){
							var result_percent = Math.round((correct_count/total_count)*100);
							obj['percentageStat'] = result_percent; // add percent symbol
						}else{
							obj['percentageStat'] = "0";
						} 
                    }else{
                        obj['question_submit_status'] = false;
                        obj['user_selected_option_id'] = "" ; 
						obj['percentageStat'] = "0";
                    } 
				}else{
					// if question does not exist in question_master
					ques_exist = 0 ;
				}
				
				if(ques_exist == 1){
					var response={
						"grade_id": obj['grade_id'],
						"subject_id": obj['subject_id'],
						"question_id": obj['question_id'],
						"question_title":obj['question_title'],
						"question_statement": obj['question_statement'],
						"question_img":obj['question_img'],
						"question_submit_status":obj['question_submit_status'],
						"user_selected_option_id": obj['user_selected_option_id'],
						"percentageStat":obj['percentageStat'] +"%",
						"percentageMsg": " people gave correct answer.",
						"option_data":options_arr,
						"question_correct_option_id":obj['question_correct_option_id'],
						"question_solution_text":obj['question_solution_text'],
						"question_solution_img":obj['question_solution_img']  
					};
				}
      
            }
           // console.log('response',response);
			if(response){
				response_arr.push(response);
			}
             
             return response_arr;
        }
        
    });
    

    /* start removeFromMyCourses */
    Meteor.methods({
        'removeFromMyCourses': function(userid, packageId) {

            var date = new Date();
            date = new Date(date.setMinutes(date.getMinutes() + 330));
                var ret_value = Users.update(
               {$and:[
                    {"id": userid},
                    {"packages_joined.package_id": packageId}
                    ]},
                {"$set":{
                    "packages_joined.$.is_joined":0,
                    "packages_joined.$.unjoined_date":date
                    }
                });
                if (ret_value == 1) {
                var data = "Course removed successfully!";
                }
                if (data) {
                // Meteor.call('usersJoinedMinus',packageId);
                return {status: "true", message: data};
                }
                else {
                return {status: "false", message: "Unable to remove successfully!!"};
                }
                }   
    });

    /* done */
    
    
        /* start addCourseToMyCourses */
    Meteor.methods({
        'addCourseToMyCourses': function(userId, packageId) {

    //         var pipeline = [
    //     {
    //         $unwind: '$packages_joined'
    //     }, 
    //     {
    //         $match: {
    //             "id": userId,
    //             "packages_joined.package_id":packageId
                

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
    //  console.log("result",JSON.stringify(result));
     var dataJoin=Users.find({
                        "id":parseInt(userId),
                        "packages_joined":{$elemMatch:{
                            "package_id":parseInt(packageId),
                        "is_joined":1}}

                    }).count();
      var dataUnjoin=Users.find({
                        "id":parseInt(userId),
                        "packages_joined":{$elemMatch:{
                            "package_id":parseInt(packageId),
                        "is_joined":0}}

                    }).count();

            // var dataJoin = Users.find(
            //     {$and:[
            //     {"id":userId},
            //     {"packages_joined.package_id":packageId},
            //     {"packages_joined.is_joined":1}
            //     ]}
            //     ).count(); 

            // var dataUnjoin = Users.find(
            //     {$and:[
            //     {"id":userId},
            //     {"packages_joined.$.package_id":packageId},
            //     {"packages_joined.$.is_joined":0}
            //     ]}
            //     ).count(); 
                console.log("userId"+userId+"packageId"+packageId);   
                console.log(dataJoin+"fff"+dataUnjoin); 

            // var joinCount=result.length;
            // if(dataJoin==0 && dataUnjoin==0){
            //     var isJoined=result[0]["packages_joined"]["is_joined"];
            // }
            // else{
            //     var isJoined=-1;
            // }
            if(dataJoin==0 && dataUnjoin==0){
            var months;
            var expiry_date;
            var validity = Packages.findOne({"id":packageId},{fields: {"package_level.validity":1,"is_test_series":1}});    
            var months=parseInt(validity["package_level"]["validity"]);
			var is_test_series = validity['is_test_series'];
            var date1=new Date();
            date1 = new Date(date1.setMinutes(date1.getMinutes() + 330));

            var expiry_date = date1.setMonth(date1.getMonth() + months);
            var expiry_date = new Date(expiry_date).toISOString();
            var return_value = Users.update({"id": userId},
            {$addToSet: {"packages_joined": {'package_id': packageId, 'is_joined': 1, 'joined_date': new Date(),
                        'expiry_date': new Date(expiry_date), 'global_flag_for_free': 1, 'unjoined_date': '','is_test_series':is_test_series
            }}});

            if (return_value) {
                var info = "Course Added Successfully!";
                if(is_test_series==1){
                  info="Test Series Added Successfully!";      
                }
                
            }
            if (info) {
                return {status: "true", message: info};
            }
            else {
                return {status: "false", message: "Unable to add successfully!!"};
            }
        }else if(dataJoin==0 && dataUnjoin>0){

           


            var months;
            var expiry_date;
            var validity = Packages.findOne({"id":packageId},{fields: {"package_level.validity":1,"is_test_series":1}});    
            var months=parseInt(validity["package_level"]["validity"]);
            var is_test_series = validity['is_test_series'];
            var date1=new Date();
            date1 = new Date(date1.setMinutes(date1.getMinutes() + 330));
            var created=date1;

            var expiry_date = date1.setMonth(date1.getMonth() + months);
            var expiry_date = new Date(expiry_date).toISOString();
            var return_value = Users.update({"id": userId,"packages_joined.package_id":packageId},
                {"$set":{
                    // "packages_joined.$.package_id":packageId,
                    "packages_joined.$.is_joined":1,
                    "packages_joined.$.joined_date":created,
                    "packages_joined.$.expiry_date":new Date(expiry_date),
                    "packages_joined.$.global_flag_for_free":1,
                    "packages_joined.$.unjoined_date":''
                    }   
                }
                );

            if (return_value) {
                var info = "Course added successfully!";
            }
            if (info) {
                // Meteor.call('usersJoinedPlus',packageId);
                
                return {status: "true", message: info};
            }
            else {
                return {status: "false", message: "Unable to add successfully!!"};
            }


        }


        else{
            return {status: "true", message: "Package already joined!!"};
        }
        }
    });
    
    /* done */

    Meteor.methods({                                    // Most joined courses
        'displayTrendingCourses': function(gradeId,subjectId, maxLimit,userId){
           console.log("subjectId",subjectId);

            var query = Packages.find(
                {$and: [

                {"status":1},
                {"for_csr_only":0},
                {"show_on_web":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},
                {$or: [
               {"package_level.id":1},
               {"package_level.id":4}
               // "package_level.id":3,
                ]},
                 
                // {"package_level.id":{$ne:4}},
                // {"package_level.id":{$ne:5}},
               //  {$or: [
               // {"package_level.id":1},
               // {"package_level.id":2},
               // {"package_level.id":3},
               // {"package_level.id":8},
               //  ]},
                // {"is_test_series":{$ne:1}},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}

                
                ]},
            {fields:
                        {"id":1,"name":1, "short_desc":1, "created":1,


                    "pkg_rating":1,
                    "users_joined":1, 

                    "meta_title":1,
                    "meta_desc":1,
                    "keyword":1,
                    "is_test_series":1,    
                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1,
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
                    "package_subscription.subscription.id":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 },
                    limit:maxLimit,
                    sort: {users_joined: -1}
                }).fetch();










            

            // console.log("count display trending",JSON.stringify(query));
                return Meteor.call('returnJson',query,userId); 
        }     
}); 


    Meteor.methods({                                    // Most joined courses
        'displayTrendingCoursesOnWeb': function(gradeId,subjectId, maxLimit,userId){
           console.log("subjectId",subjectId);
             
            var query = Packages.find(
                {$and: [

                {"status":1},
                {"for_csr_only":0},
                {"show_on_web":1},
                {"is_demo_package":false},
                {"se_package":0},
                {"package_subscription.status":1},
                {"package_level.id":{$ne:5}},
                // {"package_level.id":{$ne:4}},
                // {"package_level.id":{$ne:5}},
               //  {$or: [
               // {"package_level.id":1},
               // {"package_level.id":2},
               // {"package_level.id":3},
               // {"package_level.id":8},
               //  ]},
                // {"is_test_series":{$ne:1}},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": {$in: subjectId}}

                
                ]},
            {fields:
                        {"id":1,"name":1, "short_desc":1, "created":1,


                    "pkg_rating":1,
                    "users_joined":1, 

                    "meta_title":1,
                    "meta_desc":1,
                    "keyword":1,
                    "is_test_series":1,    
                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1,
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
                    "package_subscription.subscription.id":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 },
                    limit:maxLimit,
                    sort: {users_joined: -1}
                }).fetch();

            // console.log("count display trending",JSON.stringify(query));
                return Meteor.call('returnJson',query,userId); 
        }     
});



 
     Meteor.methods({
        'getChapterPrice': function(chapterId) {

            var query = Packages.findOne({$and: [{"package_level.id":5},
					{"package_subscription":{$size:1}},
					{"package_program.course.subject.chapter.id":chapterId}]},                
                 
                   { fields:
                    {
					"id":1,
					"package_subscription.id":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1
                }});

                return query;
            }
    }); 

       Meteor.methods({
        'getMyCoursesListing': function(userId,isTestSeries) {
            // console.log("isTestSeries",isTestSeries);
            var pkgid = [];
            
    if(isTestSeries=="0"){
        // console.log("isTestSeries0");
 //        var pipeline = [
 //        {$unwind: '$packages_joined'}, 
 //        {$match: 
 //            {$and: [


 //               "packages_joined":{$elemMatch:{
 //                            "package_id":parseInt(packageId),
 //                        "is_joined":1}}

 //                {"id": userId},
 //                {"packages_joined":{$exists:true}},
 //                {"packages_joined.is_joined":1},
 //                {"packages_joined.global_flag_for_free":1},
 //                {"packages_joined.is_test_series":{$ne:1}} 
 //                ]},

 //     }, 
 //        { $project: {
 //              "_id":0,  
 //             "packages_joined.package_id": 1

 //         }
 //     }
     

 // ];
 // var info = Users.aggregate(pipeline);


//  var info=Users.find({
//                         "id":parseInt(userId),
                        
//                     },{fields:{
//                         "packages_joined":{
//                             $elemMatch:{
//                             // "package_id":parseInt(packageId),
//                             "is_joined":1,
//                             "global_flag_for_free":1,
//                             "is_test_series":0}

//                         },
//                         "_id":0,  
//                         "packages_joined.package_id": 1
//                     }}

//                     ).fetch();
//  // 
//   console.log("JSON.stringify(info)");
//  console.log(JSON.stringify(info));
// // return info;



            
//             if(info[0]){
            
//             for(i=0;i<info[0]["packages_joined"].length;i++){
//                 pkgid[i] = info[0].packages_joined[i].package_id;
//             }
//             // return pkgid;


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

//console.log(JSON.stringify(info));
            var j=0;
            
            if(info[0]){
            if(info[0]["packages_joined"]&&info[0]["packages_joined"].length>0){
           for(i=0;i<info[0]["packages_joined"].length;i++){
            if(
                info[0].packages_joined[i].is_joined==1 &&
                info[0].packages_joined[i].global_flag_for_free==1 				
                && info[0].packages_joined[i].is_test_series==0 

                ){
                pkgid[j++] = info[0].packages_joined[i].package_id;
            }
			}
            }
            console.log("pkgid",pkgid);


            var query = Packages.find( {"id":{$in: pkgid}},
                
                 
                   { fields:
                    {   "_id":0,
                        "id":1,"name":1, "short_desc":1, "created":1,

                      "pkg_rating":1,
                    "users_joined":1,    

                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1, 
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.subscription.id":1,
                    "package_subscription.id":1,
					"is_test_series":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 }}).fetch();
// return query;
            return Meteor.call('returnJson',query,userId);

           } else{
            return "";
           }

            
        }else if(isTestSeries=="1"){
            // console.log("isTestSeries11111111");

 //            var pipeline = [
 //        {$unwind: '$packages_joined'}, 
 //        // {$match:{"id": userId}},
 //        {$match: {
            
 //                "id": userId,
 //                "packages_joined":{$exists:true},
 //                "packages_joined.is_test_series":1, 
 //                "packages_joined.is_joined":1,
 //                "packages_joined.global_flag_for_free":1
 //            } 
               
 //     }, 
 //        { $project: {

 //             "_id":0,   
 //             "packages_joined.package_id": 1

 //         }
 //     }
 //     // 

 // ];
 // var info = Users.aggregate(pipeline);
 // // console.log("info",info);
//             var info=Users.find({
//                         "id":parseInt(userId)
                       
//                     },{fields:{
//                          "packages_joined":{
//                             $elemMatch:{
//                             // "package_id":parseInt(packageId),
//                             "is_joined":1,
//                             "global_flag_for_free":1,
//                             "is_test_series":1
//                         }

//                         },
//                         "_id":0,  
//                         "packages_joined.package_id": 1
//                     }}

//                     ).fetch();



// console.log(JSON.stringify(info));

//  if(info[0]){
            
//            for(i=0;i<info[0]["packages_joined"].length;i++){
//                 pkgid[i] = info[0].packages_joined[i].package_id;
//             }
//             // console.log("pkgid",pkgid);


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

//console.log(JSON.stringify(info));
            var j=0;
            
            if(info[0]){
            if(info[0]["packages_joined"]&&info[0]["packages_joined"].length>0){
           for(i=0;i<info[0]["packages_joined"].length;i++){
            if(
                info[0].packages_joined[i].is_joined==1 &&
                info[0].packages_joined[i].global_flag_for_free==1 &&
               info[0].packages_joined[i].is_test_series==1 

                ){
                pkgid[j++] = info[0].packages_joined[i].package_id;
            }
			}
            }
            console.log("pkgid",pkgid);

         
            var query = Packages.find( {"id":{$in: pkgid}},
                
                 
                   { fields:
                    {
                        "_id":0,
                        "id":1,"name":1, "short_desc":1, "created":1,

                      "pkg_rating":1,
                    "users_joined":1,    

                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1, 
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
					"is_test_series":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 }}).fetch();
            // console.log("query",query);
            return Meteor.call('returnJson',query,userId);
           } else{
            return "";
           }

        }else{
            return "";

        }
    }

    });

    Meteor.methods({
        'getMyPurchasedCoursesListing': function(userId,isTestSeries) {
            var pkgid = [];
        if(isTestSeries=="0"){

            // console.log("isTestSeries0+purchaseTrue");
 //        var pipeline = [
 //        {$unwind: '$packages_joined'}, 
 //        // {$match:{"id": userId}},
 //        {$match: 
 //            {$and: [
 //                {"id": userId},
 //                {"packages_joined":{$exists:true}},
 //                {"packages_joined.is_test_series":{$ne:1}}, 
 //                {"packages_joined.is_joined":1},
 //                {$or:[
                    
 //                {"packages_joined.global_flag_for_free":0},
 //                {"packages_joined.global_flag_for_free":2}
 //                ]}
 //                ]}
 //     }, 
 //        { $project: {
 //              "_id":0,  
 //             "packages_joined": 1
 //             // "packages_joined.hardware_type":1

 //         }
 //     }
     

 // ];
 // var info = Users.aggregate(pipeline);

// var info=Users.find({   "packages_joined":{
//                             $elemMatch:{
//                             // "package_id":parseInt(packageId),
//                             "is_joined":1,
//                             "global_flag_for_free":{$ne:1},
//                             "is_test_series":{$ne:1}
//                         }

//                         },
//                         "id":parseInt(userId)
                        
//                     },{fields:{
                        
//                         "_id":0,  
//                         "packages_joined.package_id": 1
//                     }}

//                     ).fetch();


 // 
// console.log(JSON.stringify(info));
// return info;


var info=Users.find({   
                        "id":parseInt(userId)
                        
                    },{fields:{
                        
                        "_id":0,  
                        "packages_joined.package_id": 1,
                        "packages_joined.is_joined":1,
                        "packages_joined.global_flag_for_free":1,
                        "packages_joined.is_test_series":1,
                        "packages_joined.hardware_type":1,
                        "packages_joined.joined_date":1,
                        "packages_joined.expiry_date":1
                    }}

                    ).fetch();

console.log("JoinedPackageInfo=",JSON.stringify(info));
            var j=0;
            
            if(info[0]){
            if(info[0]["packages_joined"]&&info[0]["packages_joined"].length>0){
           for(i=0;i<info[0]["packages_joined"].length;i++){
            if(
                info[0].packages_joined[i].is_joined==1 &&
                info[0].packages_joined[i].global_flag_for_free!=1
				//&& info[0].packages_joined[i].is_test_series==0 

                ){
                pkgid[j++] = info[0].packages_joined[i].package_id;
            }
			}
            }
            console.log("pkgid",pkgid);
            var query = Packages.find( {"id":{$in: pkgid}},
                
                 
                   { fields:
                    {"id":1,"name":1, "short_desc":1, "created":1,

                     "pkg_rating":1,
                    "users_joined":1, 

                    "tdl_package_id":1,
                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1, 
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.subscription.id":1,
                    "package_subscription.id":1,
					"is_test_series":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 }}).fetch();
            return Meteor.call('returnMyCourseList',query,info);

           } else{
            return "";
           }
       }else if(isTestSeries=="1"){

        // console.log("TS1+UP-true");

 //        var pipeline = [
 //        {$unwind: '$packages_joined'}, 
 //        {$match: 
 //            {$and: [
 //                {"id": userId},
 //                {"packages_joined":{$exists:true}},
 //                {"packages_joined.is_test_series":1},
 //                {"packages_joined.is_joined":1},
 //                {$or:[
 //                {"packages_joined.is_test_series":0},
 //                {"packages_joined.is_test_series":null},    
 //                {"packages_joined.global_flag_for_free":0},
 //                {"packages_joined.global_flag_for_free":2}
 //                ]}
 //                ]}
 //     }, 
 //        { $project: {
 //              "_id":0,  
 //             "packages_joined": 1,
 //             // "packages_joined.hardware_type":1

 //         }
 //     }
     

 // ];
 // var info = Users.aggregate(pipeline);
 // 
// console.log(JSON.stringify(info));

// var info=Users.find({
//                         "id":parseInt(userId)
                        
//                     },{fields:{
//                         "packages_joined":{
//                             $elemMatch:{
//                             // "package_id":parseInt(packageId),
//                             "is_joined":1,
//                             "global_flag_for_free":{$ne:1},
//                             "is_test_series":1
//                         }

//                         },
//                         "_id":0,  
//                         "packages_joined.package_id": 1
//                     }}

//                     ).fetch();



// console.log(JSON.stringify(info));
            
//             if(info[0]["packages_joined"]){
            
//            for(i=0;i<info[0]["packages_joined"].length;i++){
//                 pkgid[i] = info[0].packages_joined[i].package_id;
//             }

var info=Users.find({   
                        "id":parseInt(userId)
                        
                    },{fields:{
                        
                        "_id":0,  
                        "packages_joined.package_id": 1,
                        "packages_joined.is_joined":1,
                        "packages_joined.global_flag_for_free":1,
                        "packages_joined.is_test_series":1,
						"packages_joined.hardware_type":1,
                        "packages_joined.joined_date":1,
                        "packages_joined.expiry_date":1
                    }}

                    ).fetch();

//console.log(JSON.stringify(info));
            var j=0;
            
            if(info[0]){
           if(info[0]["packages_joined"]&&info[0]["packages_joined"].length>0){
           for(i=0;i<info[0]["packages_joined"].length;i++){
            if(
                info[0].packages_joined[i].is_joined==1 &&
                info[0].packages_joined[i].global_flag_for_free!=1 
				//&& info[0].packages_joined[i].is_test_series==1 

                ){
                pkgid[j++] = info[0].packages_joined[i].package_id;
            }
			}
            }
            console.log("pkgid",pkgid);

        

       
            var query = Packages.find( {"id":{$in: pkgid}},
                
                 
                   { fields:
                    {"id":1,"name":1, "short_desc":1, "created":1,

                     "pkg_rating":1,
                    "users_joined":1, 

                    "tdl_package_id":1,
                    "is_free_for_preview" :1,
                     "package_media_infos.package_image_small" :1,
                    "package_media_infos.package_image_thumb" :1,
                    "package_media_infos.package_image_large" :1, 
                    "total_assets_size":1,  
                    "rating":1,

                    "package_program.course.id":1,
                    "package_program.course.name":1,  
                    "package_program.course.subject.id":1, 
                    "package_program.course.subject.name":1,
                    "package_subscription.subscription_cost":1,
                    "package_subscription.discounted_cost":1,
                    "package_subscription.hardware_master.id":1,
                     "package_subscription.hardware_master.type":1,
                    "package_subscription.hardware_master.title":1,
                    "package_subscription.subscription.duration":1,
                    "package_program.course.subject.publisher_name":1,
                    "package_subscription.id":1,
					"is_test_series":1,
                    "no_of_tests":1, 
                    "no_of_pdfs":1, 
                    "no_of_multimedia":1 }}).fetch();
            return Meteor.call('returnMyCourseList',query,info);

           } else{
            return "";
           }

       }else{
            return "";
       }

            
        }});
		
			
		Meteor.methods({
			'courseRating': function(userId,packageId,rating) {		
                var date = new Date();
                date = new Date(date.setMinutes(date.getMinutes() + 330));  
				var ret_val = Packages.update({"id": packageId},
		        {$addToSet: {"users_rating": {'users_id': userId,'rating':rating,'created':date}}});
				if(ret_val){
				return {"status":true,
						"message":"Thanks! Rating saved successfully"}
				}
				else{
				return {"status":false,
						"message":"Rating saved failed"}
				}
				}
		}); 


        Meteor.methods({
            'individualSubjectCount': function(gradeId,subjectId,isTestSeries) { 
                
                if(isTestSeries=="0"){

                subjectCount= Packages.find(
                {$and: [
                {"package_level.id":4},
                {"status":1},
                {"for_csr_only":0},
                {"show_on_app":1},
                {"package_subscription.status":1},
               {"is_test_series":{$ne:1}},
               {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": subjectId}
                ]}).count();
                // console.log("subjectCount",subjectCount);
                return subjectCount;
                }else{

                    subjectTestCount= Packages.find(
                {$and: [
                {"package_level.id":4},
                {"status":1},
                {"for_csr_only":0},
                {"show_on_app":1},
                {"package_subscription.status":1},
                {"is_test_series": 1},
                {"package_program.course.id": gradeId},
                {"package_program.course.subject.id": subjectId}
                ]}).count();
                  return subjectTestCount;  
                }
            }
        }); 

