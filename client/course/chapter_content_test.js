Template.chapter_content_test.onCreated(function() {
    Blaze._allowJavascriptUrls();
});

Template.chapter_content_test.onRendered(function() {
    $(window).scrollTop(0);
});


Template.chapter_content_result_test.onRendered(function() {
    var data = Session.get('chapter_content_list');
});

Template.chapter_content_result_test.helpers({
    'chapter_content_result_list': function() {
        if(Session.get('chapter_content_list')){
            var data = Session.get('chapter_content_list');
            var data1 = JSON.parse(data.content);
            return data1.result_data.topics[0].content;
        }
    },
    'attemptTest': function (param1, param2) {
        return param1 === param2;
    },
    'user_id': function(){
        return Session.get('landing_user_profile_id');
    },
    'chapter_test_result_list': function() {
        if(Session.get('chapter_content_list')){
            var data = Session.get('chapter_content_list');
            var data1 = JSON.parse(data.content);
            return data1.result_data.test;
        }
    },
    'isAnimation': function (param1, param2) {
	if(param1 == param2){
	    return true;
	}
    },
    'breadcrumb_course_name': function(){
        var result  = Session.get('pdp_page');
        var course_name = result[0].CourseName;
        return course_name;
    },
    'breadcrumb_chapter_name': function(){
        var result  = Session.get('chapter_name');
        return result;
    }
});


Template.chapter_content_result_test.events({
    'click .content_to_home': function(event) {
		getContentTestWall();
        //Router.go('/wall');
    },
    'click .content_to_test': function(event) {
	var slugData = getcustomData(Session.get('about_course_title'));
	Router.go('/tests/'+slugData);
        //Router.go('/tests');
    },
    'click .content_to_test_pdp': function(event) {
	var slugData = getcustomData(Session.get('about_course_title'));
	Router.go('/'+slugData+'/tests');
        //Router.go('/test_pdp');
    },
    'click .strtTest':function(){
    }
});

Template.navigation_chapter_content_test.helpers({
    login_check: function () {
        var data = Session.get('landing_user_profile_id');
        if (!data) {
            return true;
        }
    },
    login_user_name: function () {
        var data = Session.get('landing_user_profile_id');
        if (data) {
            Meteor.call('webUserInfo', data, function (error, result) {
                Session.set('login_check_name', result.name);
            });
            return Session.get('login_check_name');
        }
    }
});

Template.navigation_chapter_content_test.events = {
    "click .sign-up": function (e) {
        e.preventDefault();
        Modal.show('sign_up');
    },
    "click .sign-in": function (e) {
        e.preventDefault();
        Modal.show('sign_in');
    },
    "click .frgtpwd": function (e) {
        e.preventDefault();
        Modal.hide('sign_in');
        Modal.show('#forgotpwd');
    },
    "click .log_out_button": function (e) {
        e.preventDefault();
        console.log('logout');
        Session.clear('landing_user_profile_id');
        localStorage.removeItem('userId');
        Session.clear('global_flag_free');
        window.location.reload(true);
    }
};

function getContentTestWall(){
    var url_string = Session.get('courseName');
    var id = Session.get('global_grade_id');
    var slugData = getcustomData(url_string);
    Router.go('/'+slugData+'/'+id);
}