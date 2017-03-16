Template.chapter_content.onCreated(function() {
    Blaze._allowJavascriptUrls();
});

Template.chapter_content.onRendered(function() {
    $(window).scrollTop(0);
});


Template.chapter_content_result.onRendered(function() {
    var data = Session.get('chapter_content_list');
});

Template.chapter_content_result.helpers({
    'chapter_content_result_list': function() {
        if(Session.get('chapter_content_list')){
            var data = Session.get('chapter_content_list');
            var data1 = JSON.parse(data.content);
            return data1.result_data.topics[0].content;
        }
    },
    'chapter_content_notes_list': function() {
        if(Session.get('chapter_content_list')){
            var data = Session.get('chapter_content_list');
            var data1 = JSON.parse(data.content);
            return data1.result_data.content;
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
    'isAnimation': function (param1, param2,param3) {
          if((param1 == param2)||(param1 == param3)){
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

Template.iprof_video_pop.helpers({
    'iprof_video_pop_list': function() {
        var data = Session.get('heading');
        return data; 
    }
});

JWPlayer.load('HrmCsKJB');


Template.iprof_video_pop.onRendered(function() {
 this.autorun(function() {
   if (JWPlayer.loaded()) {
       
    var file_path = Session.get('file_path');
    console.log('file_path',file_path); 
     jwplayer('videoPlayer').setup({
       file: file_path,
       width: '100%',
       aspectratio: '16:9',
       autostart: false
     });
   }
 });
});

Template.chapter_content_result.events({
    'click .play_pdf': function(event) {
        gaEvent('content_consumption', 'pdf_play', '','');
        var element = this;
        Session.set('pdf_file_path',element.file_path);
        Session.set('pdf_heading',element.heading);
        Modal.show('iprof_pdf_pop');
    },
        'click .play_video': function(event) {
        gaEvent('content_consumption', 'video_play', '', '');    
        var element = this;
        Session.set('file_path',element.file_path);
        Session.set('heading',element.heading);
        Modal.show('iprof_video_pop');
    },
    'click .content_to_home': function(event) {
		getContentWall();
        //Router.go('/wall');
    },
    'click .content_to_courses': function(event) {
        var slugData = (Session.get('about_course_title')).replace(/ /g,"-").toLowerCase();
        slugData = (slugData).replace("---","-").toLowerCase();
        Router.go('/courses/'+slugData);
        //Router.go('/courses');
    },
    'click .content_to_pdp': function(event) {
        var slugData = (Session.get('about_course_title')).replace(/ /g,"-").toLowerCase();
        slugData = (slugData).replace("---","-").toLowerCase();
        Router.go('/'+slugData+'/tutorials');
        //Router.go('/course_pdp');
    },
    'click .strtTest':function(){
    }
});
Template.iprof_pdf_pop.helpers({
    'pdf_heading': function() {

        var data = Session.get('pdf_heading');
        return data;
       
    },
    'pdf_file_path': function() {
        
        var url="http://docs.google.com/gview?url=";
        var pdf_file_path = Session.get('pdf_file_path');
        var result=pdf_file_path+'#toolbar=0&statusbar=0&navpanes=0&scrollbar=0" width="425" height="425"';
        console.log("result",result);
        return result;
       
    }
});

Template.navigation_chapter_content.helpers({
    login_check: function () {
        var data = Session.get('landing_user_profile_id');
        console.log('login_check_outside', data);
        if (!data) {
            return true;
        }
    },
    login_user_name: function () {
        var data = Session.get('landing_user_profile_id');
        console.log('login_check_outside', data);
        if (data) {
            Meteor.call('webUserInfo', data, function (error, result) {
                console.log('webUserInfo', result);
                Session.set('login_check_name', result.name);
            });
            console.log('login_check', data);
            return Session.get('login_check_name');
        }
    }
});

Template.navigation_chapter_content.events = {
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

function getContentWall(){
    var url_string = Session.get('courseName');
    var id = Session.get('global_grade_id');
    var slugData = getcustomData(url_string);
    Router.go('/'+slugData+'/'+id);
}