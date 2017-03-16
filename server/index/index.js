// Preferences = new Mongo.Collection('preferences');

Meteor.methods({
        'getCategories': function(){
        //    console.log(Preferences.find().fetch());
            return Preferences.find({"status": 1},{}).fetch(); 
        }
    });
 
Meteor.methods({
        'getSubCategories': function(catId){
            catId= parseInt(catId);
            return Preferences.find({"id": catId, "sub_category.status": 1}, {fields: {"id": 1,"display_name": 1, "sub_category.id": 1, "sub_category.name": 1, "sub_category.display_name": 1}}).fetch(); 
        }
    });
    
Meteor.methods({
        'getCourses': function(subCatId){
            subCatId= parseInt(subCatId);
            return Preferences.find({"sub_category.id": subCatId, "sub_category.course.status": 1}, {fields: {"display_name": 1, "sub_category.id": 1, "sub_category.display_name": 1, "sub_category.course.id": 1, "sub_category.course.name": 1, "sub_category.course.display_name": 1}}).fetch(); 
        }
    });    
    
Meteor.methods({
        'getSubjects': function(courseId){
            courseId= parseInt(courseId);
            return Preferences.find({"sub_category.course.id": courseId, "sub_category.course.subject.status": 1}, {fields: {"display_name": 1, "sub_category.id": 1, "sub_category.display_name": 1, "sub_category.course.id": 1, "sub_category.course.display_name": 1, "sub_category.course.subject.id": 1, "sub_category.course.subject.name": 1, "sub_category.course.subject.display_name": 1}}).fetch(); 
        }
    });    

Meteor.methods({
        'getPopularCourses': function(){
            return Preferences.find({"sub_category.course.is_popular": 1, "sub_category.course.status": 1}, {fields: {"display_name": 1, "sub_category.id": 1, "sub_category.display_name": 1, "sub_category.course.id": 1, "sub_category.course.name": 1, "sub_category.course.display_name": 1, "sub_category.course.is_popular": 1}}).fetch(); 
                                    // {"sub_category.course.is_popular": 1},                                             {"display_name":1, "sub_category.id":1, "sub_category.display_name":1, "sub_category.course.id":1, "sub_category.course.name":1, "sub_category.course.display_name":1, "sub_category.course.is_popular":1}
        }
    });       
