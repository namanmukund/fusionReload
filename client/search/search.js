//Template.search.onCreated(function() {
//    Blaze._allowJavascriptUrls();
//});
//if(Session.get('search_kw')){
//    var kw = Session.get('search_kw');;
//    console.log('kw',kw)
//    Meteor.call('search_result_list',kw,function(error, result){
//             Session.set('search_result_list',result);
//        /*    if(result !== false){
//                var search = JSON.parse(result);
//                console.log('search',search);
//                Session.set('search_result_list',search)
//            }   */
//    }); 
//}
//
//
//Template.navigation_search.events = {
//    "click .sign-up" : function(e) {
//    e.preventDefault();
//    Modal.show('sign_up');
//    },
//    "click .sign-in" : function(e) {
//    e.preventDefault();
//    Modal.show('sign_in');
//    }
//};
//
//Template.navigation_wall.events({
//   'submit form': function (evt) {
//        evt.preventDefault();
//        x = Session.get('search_val');
//        console.log('searching...');
//        if(x.length>2){
//            Session.set('search_kw',x);
//            window.location.href='/search';
//        }
//   }
//});
//
//Template.search.rendered = function(){
//    var x = Session.get('search_result_list');
//    if(x){
//        var result = JSON.parse(x.content);
//        var course = result.result_data;
//        console.log('x',course);
//    }
//    $(document).ready(function(){
//        
//    });
//
//};
//Template.search_result.helpers({
//    search_courses: function(){
//        var x = Session.get('search_result_list');
//        if(x){
//            var result = JSON.parse(x.content);
//            var course = result.result_data.course;
//            return course;
//        }   
//    },
//    search_tests: function(){
//        var x = Session.get('search_result_list');
//        if(x){
//            var result = JSON.parse(x.content);
//            var test = result.result_data.tests;
//            return test;
//        }   
//    },
//    search_videos: function(){
//        var x = Session.get('search_result_list');
//        if(x){
//            var result = JSON.parse(x.content);
//            var video = result.result_data.video;
//            return video;
//        }   
//    }
//        
//});
