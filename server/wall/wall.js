//Packages = new Mongo.Collection('packages');

Meteor.methods({                                    // Most joined courses
        'getTrendingCourses': function(selectedSubjects, maxLimit){console.log("pp"+selectedSubjects+"qq"+maxLimit+"rr");
            var pipeline = [
    {$match: {'users_joined.0': {$exists: true}}},
    {$project: {id: 1, "name": 1, "rating": 1, "is_test_series": 1, "no_of_tests" : 1, "no_of_pdfs" : 1, "no_of_multimedia" : 1, "package_subscription.hardware_master.type": 1, "package_program.course.subject.publisher_name": 1, count: {$size: '$users_joined'}}},
    {$sort : { 'count' : -1}}
    ];
            if(maxLimit != '')pipeline.push({$limit: maxLimit});     
            return Packages.aggregate(pipeline); 
                                    // {"sub_category.course.is_popular": "1"}, {"display_name":1, "sub_category._id":1, "sub_category.display_name":1, "sub_category.course._id":1, "sub_category.course.name":1, "sub_category.course.display_name":1, "sub_category.course.is_popular":1}
        }
    });  

Meteor.methods({                                    // Most joined Test Series courses
        'getTrendingTests': function(selectedSubjects, maxLimit){console.log("rr"+selectedSubjects+"ss"+maxLimit+"tt");
            var pipeline = [
    {$match: {'users_joined.0': {$exists: true}, 'is_test_series': 1, 'package_program.course.subject.id': {$in: selectedSubjects}}},
    {$project: {id: 1, "name": 1, "rating": 1, "is_test_series": 1, "no_of_tests" : 1, "no_of_pdfs" : 1, "no_of_multimedia" : 1, "package_subscription.hardware_master.type": 1, "package_program.course.subject.publisher_name": 1, count: {$size: '$users_joined'}}},
    {$sort : { 'count' : -1}},
    {$limit: maxLimit}
];
            if(maxLimit != '')pipeline.push({$limit: maxLimit});     
            return Packages.aggregate(pipeline);
                                    // {"sub_category.course.is_popular": "1"}, {"display_name":1, "sub_category._id":1, "sub_category.display_name":1, "sub_category.course._id":1, "sub_category.course.name":1, "sub_category.course.display_name":1, "sub_category.course.is_popular":1}
        }
    });
    