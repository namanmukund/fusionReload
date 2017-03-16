Modal.allowMultiple = true;
Template.wall.onCreated(function () {
    Blaze._allowJavascriptUrls();
});

Template.navigation_wall.events = {
    "click .sign-up": function (e) {
        e.preventDefault();
         ga('send', {
            hitType: 'event',
            eventCategory: 'sign_up_click',
            eventAction: 'sign_up',
            eventLabel: 'sign_up_click_from_wall'
          });
          Session.clear('coming_from_subscription_pricing');
    Session.clear('coming_from_subscription');
    Session.clear('join_course_clicked');
        Modal.show('sign_up');
    },
    "click .sign-in": function (e) {
        e.preventDefault();
         ga('send', {
            hitType: 'event',
            eventCategory: 'sign_in',
            eventAction: 'sign_in_click',
            eventLabel: 'wall'
          });
          Session.clear('coming_from_subscription_pricing');
    Session.clear('coming_from_subscription');
    Session.clear('join_course_clicked');
        Modal.show('sign_in');
    },
    "click .frgtpwd": function (e) {
        e.preventDefault();
        ga('send', {
                hitType: 'event',
                eventCategory: 'forgot_password',
                eventAction: 'forgot_password_clicked',
                eventLabel: 'wall'
            });
        Modal.hide('sign_in');
        Modal.show('#forgotpwd');
    },
    "click .log_out_button": function (e) {
        e.preventDefault();
        localStorage.removeItem('userId');
        Session.set('landing_user_profile_id', undefined);
        Session.clear('global_flag_free');
        window.location.reload(true);
    }
};

Template.wall.onCreated = function () {
//    $(window).scrollTop(0);
//    if(!localStorage.getItem("course")){
//        console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpppppppppppppppppp');
//        Router.go('/');
//    }
}


Template.wall.rendered = function () {
    $('.arrrow_pref').show();
    Session.set('currentPage',2);
    Session.setTemp('currentPageWeb','wall');
    $("#checkAll").click(function () {
        $(".check").prop('checked', $(this).prop('checked'));
    });

    $(window).scrollTop(0);
    Session.clear('onPDPpage');

    if (localStorage.getItem("category")) {
//      console.log('user_preference_cache',(localStorage.getItem("userPrefrences")));
//        Session.set('landing_user_profile_id', (localStorage.getItem("userId")));
//            console.log('grade_id_new',localStorage.getItem("userId"));
//        Session.set('courseIdCache', (localStorage.getItem("course")));
//            console.log('courseId_new',localStorage.getItem("course"));
//        Session.set('selectedSubjectsCache', (localStorage.getItem("subjectIDS")));

//        Session.set('categoryNameCache', (localStorage.getItem("categoryName")));
//        Session.set('subCategoryNameCache', (localStorage.getItem("subCategoryName")));
//        Session.set('courseNameCache', (localStorage.getItem("courseName")));
//        console.log('selectedSubjects', localStorage.getItem("subjectIDS"));
//        console.log('a', Session.get('categoryNameCache'));
//        console.log('b', Session.get('subCategoryNameCache'));
//        console.log('c', Session.get('courseNameCache'));
    }
    var userId = Session.get('landing_user_profile_id');
    var grade_id;
    var subject_id;
    if (Session.get('selectedSubjects') && Session.get('courseId')) {
        grade_id = Session.get('courseId');
        var subjectId = Session.get('selectedSubjects');
        var parseSubjects = [];
        $.each(subjectId, function (index, value) {
            var intsubject = parseInt(value);
            parseSubjects.push(intsubject);
        })
        subject_id = parseSubjects;
    } else {
        grade_id = Session.get('courseIdCache');
        var subjectId = Session.get('selectedSubjectsCache');
        var array_subject_id = subjectId.split(',');
        var parseSubjects = [];
        $.each(array_subject_id, function (index, value) {
            var intsubject = parseInt(value);
            parseSubjects.push(intsubject);
            subject_id = parseSubjects;
        })
    }

    grade_id = parseInt(grade_id);

    if (!userId) {
        userId = 40000560;
    }
    Session.set('global_grade_id', grade_id);
    Session.set('global_subject_id', subject_id);
    Meteor.call('getWallCountData', grade_id, subject_id, 1, function (error, result) {
        Session.set('count', result);
    });
    Meteor.call('getQdData', userId, grade_id, subject_id, function (error, result) {
        Session.set('qd_data', result);
        Session.set('qod_subject_id', result[0].subject_id);
    });
}

Template.navigation_wall.helpers({
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
    },
    is_qod_exist: function () {
        if(Session.get('qd_data').length>0){
            return 1;
        }
    },
    is_qod_show: function (param1,param2) {
        if(param1==param2){
            return true;
        }
    }
});

var question_submit_flag = true;
var question_data = new Deps.Dependency();

Template.qod.helpers({
    'question_submit': function () {
        if ((Session.get('qod_submit'))) {
              return false;
        }else{
            return true;
        }
    },
    'question': function () {
        if (Session.get('qd_data')) {
            var qod_data = Session.get('qd_data');
        }

        if (qod_data[0].question_statement) {
            return qod_data[0].question_statement;
        }
    },
    'options': function () {
        if (Session.get('qd_data')) {
            var qod_data = Session.get('qd_data');

            if (qod_data[0].option_data) {
                return qod_data[0].option_data;
            }
        }
    },
    'submit': function () {
        if ((Session.get('qod_submit'))) {
            var qod_submit = Session.get('qod_submit');
            return qod_submit;
        }
    },
    'question_submit_status': function () {
        question_data.depend();
        var qod_data = Session.get('qd_data');
        if (qod_data[0].question_submit_status==false ||  qod_data[0].question_submit_status=="" || !qod_data[0].question_submit_status) {
            return question_submit_flag;
        }
    },
    'question_data_if_submit': function () {
        var qod_data = Session.get('qd_data');
        if (qod_data[0]) {
            var mssg = qod_data[0].percentageStat + qod_data[0].percentageMsg;
            var ans_exp = qod_data[0].question_solution_text;
            var correct_ans = qod_data[0].question_correct_option_id;
            var answer_image = qod_data[0].question_solution_img;
            if (qod_data[0].user_selected_option_id === correct_ans) {
                var msg = 'Your ans is right';
            } else {
                var msg = 'Your ans is wrong';
            }
            for (var i = 0; i < qod_data[0].option_data.length; i++) {
                if (correct_ans == qod_data[0].option_data[i].option_id) {
                    var ans_value = qod_data[0].option_data[i].option_statement;
                }
                if (qod_data[0].user_selected_option_id == qod_data[0].option_data[i].option_id) {
                    var user_option = qod_data[0].option_data[i].option_statement;
                }
            }
            var result = {
                "user_option":user_option,
                "result": msg,
                "percent": mssg,
                "answer_text": ans_exp,
                "answer_image": answer_image,
                "correct_ans": 'The correct ans is ' + ans_value
            };
            return result;

        }
    }
});

Template.qod.events({
    'click .qod_submit_button': function (event, template) {
        event.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'QOD',
            eventAction: 'QOD_submitted'
          });
        var qod_data = Session.get('qd_data');
        if (qod_data[0].question_correct_option_id) {
            var correct_ans = qod_data[0].question_correct_option_id;
        }
        if (qod_data[0].question_id) {
            var questionId = qod_data[0].question_id;
        }

        var token = 'global';
        var userId = Session.get('landing_user_profile_id');
        var gradeId = Session.get('global_grade_id');
        var subjectId = Session.get('qod_subject_id');
        var element = template.find('input:radio[name=radio]:checked');
        var chosen_option_id = element.id;
        var arr = [];
        if ($(element)[0].id === correct_ans) {
            var user_option = $(element)[0].value;
            var msg = 'Your ans is right';
        } else {
            var user_option = $(element)[0].value;
            var msg = 'Your ans is wrong';
        }

        if (qod_data[0].percentageStat && qod_data[0].percentageMsg) {
            var mssg = qod_data[0].percentageStat + qod_data[0].percentageMsg;
        }
        if (qod_data[0].question_solution_text) {
            var ans_exp = qod_data[0].question_solution_text;
        }

        for (var i = 0; i < qod_data[0].option_data.length; i++) {
            if (correct_ans == qod_data[0].option_data[i].option_id) {
                var ans_value = qod_data[0].option_data[i].option_statement;
            }
        }
        var result = {
            "user_option":user_option,
            "result": msg,
            "percent": mssg,
            "answer_text": ans_exp,
            "correct_ans": 'The correct ans is ' + ans_value
        };
        Session.set('qod_submit', result);
        console.log('qod_submit',Session.get('qod_submit'));

       if(element){
            Meteor.call('submit_qod_web', userId, gradeId, subjectId, questionId, chosen_option_id, correct_ans, token, function (error, result) {
                Session.set('submit_qod_web_status', result.status);
            });

        }
        question_submit_flag = false;
        question_data.changed();
        $(document).ready(function() {
            $('.questionanswerdisplay').show();
        });
    }
});

Template.registerHelper('countTutor', function () {
    Meteor.call("tutorsCount", function (error, results) {
    });
});
Template.registerHelper('countCourse', function () {
    var course_count = 0;
    var total_count = Session.get('count');
    if (total_count) {
        var course_count = total_count.countCourse + total_count.countSubject;
        Session.set('courseCount',course_count)
    }
    return (course_count);
});

Template.registerHelper('disable_tab_test', function (param1,param2) {
    if(param1==param2){
        return true;
    }else{
        return false;
    }
});

Template.registerHelper('disable_tab_course', function (param1,param2) {
    if(param1==param2){
        return true;
    }else{
        return false;
    }

});

Template.registerHelper('countTest', function () {
    var total_count = Session.get('count');
    if (total_count) {
        var test_count = total_count.countCourseTest + total_count.countSubjectTest;
        Session.set('testCount',test_count);
    }else{
        var test_count = 0;
        Session.set('testCount',test_count);
    }
    return (test_count);
});

Template.notif_cart_count.helpers({
    'cartCount': function () {
        var cart_count = Session.get('no_items_in_cart');
        return (cart_count);
    },
    'notificationCount': function () {
        var userId = Session.get('landing_user_profile_id');
        if(userId){
            Meteor.call('new_notification_count', userId, function (error, result) {
                if(result)
                Session.set('notificaiton_count',result);//result is notificationCount
            });
            if(Session.get('notificaiton_count')){
                return Session.get('notificaiton_count');
            }
        }
    }
});



Template.funzone_call.events({
    'click #go_funzone': function (event) {
//        window.location.href = '/funzone';
            ga('send', {
            hitType: 'event',
            eventCategory: 'funzone',
            eventAction: 'funzone_clicked',
          });
          Router.go('/wall/funzone');
    },
    'click .clickBms': function (event) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'BMS',
            eventAction: 'BMS_clicked',
          });
        if(Session.get('landing_user_profile_id')){
            Router.go('/landing/bmsSubject');
        }else{
            Modal.show('sign_in');
	}
    }
});

Template.funzone_call.events({
    'click #go_quiz': function (event) {
        window.location.href = '/quiz';
    }
});

Template.sticky_nav.events({
    'click #course_page': function (event) {
        Session.setTemp('coming_from_trending_course',2);
        var grade_id = Session.get('global_grade_id');
        
        var subject_id = Session.get('global_subject_id');
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);
    },
    'click #test_page': function (event) {
        var grade_id = Session.get('global_grade_id');
        var subject_id = Session.get('global_subject_id');
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/tests/'+slugData);
        //Router.go('/tests');
    },
    'click #tutor_page': function (event) {
        Router.go('/tutors');
    },
    'click #test_page_disable': function (event) {
       Modal.show('no_tests');
    },
    'click #course_page_disable': function (event) {
       Modal.show('no_courses');
    },
    'click #render_my_course_from_wall': function() {
    if(Session.get('landing_user_profile_id')){
        var userId =  Session.get('landing_user_profile_id');
        Meteor.call('getMyCoursesListingWeb',userId,'global',0,false, function(error, result){
            var list = JSON.parse(result.content);
                Session.set('my_courses',list);
	        Session.set('my_course_size',(list.result_data.batch).length);
            if((list.result_data.batch).length>0){
                Router.go('/my_course');
            }else{
                Modal.show('no_my_courses');
            }
        });    
    }else{
        Modal.show('sign_in')
    }
    
    },
    'click #render_my_test_from_wall': function() {
        if(Session.get('landing_user_profile_id')){
        var userId =  Session.get('landing_user_profile_id');
        Meteor.call('getMyCoursesListingWeb',userId,'global',1,false, function(error, result){
            var list = JSON.parse(result.content);
            Session.set('my_tests',list);
            if((list.result_data.batch).length>0){
                Router.go('/my_test_series');
            }else{
                Modal.show('no_test_in_my_test');
            }
        });    
        }else{
        Modal.show('sign_in')
        }
    },
    'click #render_my_purchases_from_wall': function() {
        if(Session.get('landing_user_profile_id')){
            var userId =  Session.get('landing_user_profile_id');
            Meteor.call('getMyCoursesListingWeb',userId,'global',0,true, function(error, result){
                var list = JSON.parse(result.content);
                     Session.set('my_purchases',list);
                if(list.status == false){
                    if(Session.get('courseCount')!=0){
                            Modal.show('no_my_purchases');
                        }else{
                            Modal.show('no_purchased_test');
                        }
                } else {
                    if((list.result_data.batch).length>0){
                        Router.go('/my_purchases');
                    }else{
                        if(Session.get('courseCount')!=0){
                            Modal.show('no_my_purchases');
                        }else{
                            Modal.show('no_purchased_test');
                        }
                    }
                }  
            });    
        } else {
            Modal.show('sign_in');
        }
    }
});

Template.breadcrumb_funzone.events({
    'click #funzone_home': function (event) {
        getWall();
        //window.location.href = '/wall';
    }
});
Template.nav_course.events({
    'click #home_page': function (event) {
        getWall();
        //window.location.href = '/wall';
    }
});

Template.search_bar.rendered = function () {
    var grade_id = Session.get('global_grade_id');
    var user_id = Session.get('landing_user_profile_id');
    if(!user_id){
        user_id = 1;
    }
    $(document).ready(function () {
        $('html').on('click', function () {
            $(".search_dropdown_menu").hide();
        });
        $("#query").keyup(function () {
            $(".search_dropdown_menu").show();
            var search_val = document.getElementById("query").value;
            Session.setTemp('search_val', search_val);
            var search_length = search_val.length;
            if (search_length > 2) {

                Meteor.call('search_result_web', search_val,grade_id, user_id,20, function (error, result) {
                    if (result !== false) {
                        var search = JSON.parse(result.content);
                        if (search.status === true) {
                            Session.set('search_result',true);
                            var arr = [];
                            Session.setTemp('solr_result', search.result_data.course.CourseInfoRecord);
                            console.log('solr_search_result',result);
                        } else {
                            Session.set('search_result',false);
                            console.log('No search result for the typed keyword');
                        }
                    }

                });
            }
        });
    });

};


Template.search_bar.helpers({
    search_criteria: function () {
        if (Session.get('search_val')) {
            var x = Session.get('search_val');
            if (x.length > 2) {
                return true;
            }
        }else{
            return false;
        }

    }

});


Template.search_bar.events({
    'keypress #search_button': function(event){
        if(event.keyCode==13){
        event.preventDefault();
        return false;
    }
    },
    'submit .search_page': function(event){
        event.preventDefault();
        return false;
    }

});


Template.search_drop.helpers({
    solr_result: function () {
        if (Session.get('solr_result')) {
            var res = Session.get('solr_result');
            if (res) {
                return res;
            }
        }
    },
    is_search_result:function(){
        if(Session.get('search_result')==true){
            return Session.get('search_result');
        }else{
            return Session.get('search_result');
        }
    }
});

Template.search_drop.events({
    'click .res': function () {
        var x = Session.get('fun_vids');
    },
    'click .search_drop_result': function () {
        var myVar = this;
        Session.clear('search_val');
        if(this.PsCourseId){
            console.log( 'myVar_search_drop',myVar);
            var pckg_id = parseInt(this.PsCourseId);
            var grade_id = parseInt(this.gradeId);
            var course_name =this.CourseName;
            var is_test_series = this.is_test_series;
            console.log('search_grade_id',grade_id);
            console.log('search_package_id',pckg_id);
            Session.set('search_grade_id',grade_id);
            Session.set('coming_from_trending_course',1);
            Session.set('pckg_id',pckg_id);
            Session.set('breadcrumb_name_course',course_name);
            var slugData = getcustomData(this.CourseName);
            if(Session.get('onPDPpage')==1){
                if(Session.get('onTestPDPpage')==1){
                    if(is_test_series == "true"){
                        window.location.reload(true);
                    }else{
                        Router.go('/'+slugData+'/tutorials/'+pckg_id);
                        //Router.go('/course_pdp');
                    }
                }else{
                    if(is_test_series == "true"){
                        Router.go('/'+slugData+'/tests/'+pckg_id);
                        //Router.go('/test_pdp');
                    }else{
                        window.location.reload(true);
                    }
                }
            }else{
                if(is_test_series == "true"){
                    Router.go('/'+slugData+'/tests/'+pckg_id);
                    //Router.go('/test_pdp');
                }else{
                    Router.go('/'+slugData+'/tutorials/'+pckg_id);
                    //Router.go('/course_pdp');
                }
            }
        }else if(this.test_id){
            var test_id = parseInt(this.test_id);
            var chapter_id = parseInt(this.chapter_id);
            Router.go ('bmsTests',{},{query: 'tId='+test_id+'cId='+chapter_id+'&source=bms'});
        }
    }
});

Template.navigation_funzone.events = {
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
        localStorage.removeItem('userId');
        Session.clear('landing_user_profile_id');
        Session.clear('global_flag_free');
        window.location.reload(true);
    }
};

Template.navigation_funzone.helpers({
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


Template.funzone.onCreated(function () {
    Blaze._allowJavascriptUrls();
});

Template.nav_funzone.events = {
    "click #home_page": function (e){
	getWall();
       //Router.go('/wall');
    },
    "click #course_page": function (e){
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);
        //Router.go('/courses');
    },
    'click #tutor_page': function (event) {
        Router.go('/tutors');
    },
    'click #test_page_disable': function (event) {
       Modal.show('no_tests');
    },
    'click #test_page': function (event) {
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/tests/'+slugData);
        //Router.go('/tests');
    },
    'click #course_page_disable': function (event) {
       Modal.show('no_courses');
    }
}




Template.funzone.rendered = function () {
     $(window).scrollTop(0);
    var userId = Session.get('landing_user_profile_id');
    var grade_id;
    var subject_id;
    if (Session.get('selectedSubjects') && Session.get('courseId')) {
        grade_id = Session.get('courseId');
        console.log('grade_id_new', grade_id);
        var subjectId = Session.get('selectedSubjects');
        var parseSubjects = [];
        console.log('subject_id_wall', subjectId);

        $.each(subjectId, function (index, value) {
            var intsubject = parseInt(value);
            parseSubjects.push(intsubject);
        })
        subject_id = parseSubjects;
    } else {
        grade_id = Session.get('courseIdCache');
        var subjectId = Session.get('selectedSubjectsCache');
        var array_subject_id = subjectId.split(',');
        var parseSubjects = [];
        $.each(array_subject_id, function (index, value) {
            var intsubject = parseInt(value);
            parseSubjects.push(intsubject);
            subject_id = parseSubjects;
        })
    }

    grade_id = parseInt(grade_id);

    if (!userId) {
        userId = 1;
    }
    Session.set('global_grade_id', grade_id);
    Session.set('global_subject_id', subject_id);
    Meteor.call('fun_videos', grade_id, subject_id, 1, function (error, result) {
        Session.set('fun_vids', result);
    });

    Meteor.call('fun_facts', grade_id, subject_id, 1, function (error, result) {
        Session.set('fun_facts', result);
    });
}


Template.funzone_videos.helpers({
    fun_vids: function () {
        var result = Session.get('fun_vids');
        if (result.gcm_data) {
            return result.gcm_data;
        }
    }
});

Template.funzone_facts.helpers({
    fun_facts: function () {
        var result = Session.get('fun_facts');
        if (result.gcm_data) {
            return result.gcm_data;
        }
    }
});

Template.funzone_videos.events = {
    "click .video_funzone_pop_up": function (e) {
        Modal.show('funzone_video_pop');
        var element = this;
        var video_url = element.video_url;
        var final_video_url = video_url.slice(32);
        Session.set('funzone_video_title',element.title);
        Session.set('funzone_video_url','https://www.youtube.com/embed/'+final_video_url);
          ga('send', {
            hitType: 'event',
            eventCategory: 'funzone',
            eventAction: 'funzone_animation_clicked',
            eventValue: Session.get('funzone_video_title')
          });
    }
}
Template.funzone_video_pop.helpers({
    video_pop_data: function () {
        if(Session.get('funzone_video_url') && Session.get('funzone_video_title')){
            var data={
                    "funzone_video_title": Session.get('funzone_video_title'),
                    "funzone_video_url": Session.get('funzone_video_url')
            }
            return data;
        }
    }
});
Template.iprof_video_pop.onRendered(function() {
 this.autorun(function() {
   if (JWPlayer.loaded()) {

    var file_path = Session.get('funzone_video_url');
     jwplayer('playa').setup({
       file: file_path,
       width: '100%',
       aspectratio: '16:9',
       autostart: false
     });
   }
 });
});





Template.funzone_tab.helpers({
    is_video_exist: function () {
        var result = Session.get('fun_vids');
        if (result.total_result_count > 0) {
            return true;
        }
        return false;
    },
    is_facts_exist: function () {
        var result = Session.get('fun_facts');
        if (result.total_result_count > 0) {
            return true;
        }
        return false;
    }
});

Template.my_preference.helpers({
    'categories': function () {
        return Session.get('categories');
    },
    'categoryId': function () {
        return Session.get('pref_categoryId');
    },
    'categoryName': function () {
        if (Session.get('pref_categoryName')) {
        } else {
            return Session.get('categoryName');
        }
    },
    'subCategories': function () {
        return Session.get('pref_subCategories');
    },
    'subCategoryId': function () {
        return Session.get('pref_subCategoryId');
    },
    'subCategoryName': function () {
        if (Session.get('pref_subCategoryName')) {
            return Session.get('pref_subCategoryName');
        } else {
            return Session.get('subCategoryName');
        }
    },
    'catClass': function () {
        return Session.get('catClass');
    },
    'courses': function () {
        return Session.get('pref_courses');
    },
    'courseId': function () {
        return Session.get('pref_courseId');
    },
    'courseName': function () {
        if (Session.get('pref_courseName')) {
            return Session.get('pref_courseName');
        } else {
            return Session.get('courseName');
        }
    },
    'popularCourses': function () {
        return Session.get('popularCourses');
    },
    'subjects': function () {
        return Session.get('pref_subjects');
    },
     'subjectName': function () {
        return Session.get("subjectName");
    },
    'selectedCategory': function (left, right) {
        return left == right ? "selected" : "";
    },
    'selectedSubCategory': function (left, right) {
        return left == right ? "selected" : "";
    },
    'selectedCourse': function (left, right) {
        return left == right ? "selected" : "";
    },
    'selectedSubject': function () {
        return Session.get('selectedSubjects');
    },
    'selectedSubjectTxt': function () {
        if (Session.get('selectedSubjects').length > 0) {
            return Session.get('selectedSubjects').length;
        } else {
            return 'Select';
        }
    },
    'check_for_category_cache': function (param1, param2) {
        if (param1 == param2) {
            return true;
        }
    }
});


Template.my_preference.events({
    'change #category': function (event, template) {
        var catId = $(event.target).val();
        if(!catId){
            subCatId =  Session.get('categoryId');
        }
        Meteor.call('getSubCategories', catId, function (error, result) {
            arrSubCat = [];
            $.each(result, function (i, n) {
                categoryId = n.id;
                categoryName = n.display_name;
                $.each(n.sub_category, function (j, m) {
                    arrSubCat.push(m);
                });
            });
            Session.setTemp('pref_categoryId', parseInt(categoryId));
            Session.setTemp('pref_categoryName', categoryName);
            Session.setTemp('pref_subCategories', arrSubCat);
        });
    },
    'change #subCategory': function (event, template) {
        
        var subCatId = $(event.target).val();
        if(!subCatId){
            subCatId =  Session.get('subCatId');
        }
        Session.set('subCatId', subCatId);
        Meteor.call('getCourses', parseInt(subCatId), function (error, result) {
            arrCourse = [];
            $.each(result, function (i, n) {
                $.each(n.sub_category, function (j, m) {
                    if (m.id == subCatId){
                        subCategoryId = m.id;
                        subCategoryName = m.display_name;
                        $.each(m.course, function (k, l) {
                            arrCourse.push(l);
                        });
                    }
                });
            });
            Session.setTemp('pref_subCategoryId', parseInt(subCategoryId));
            Session.setTemp('pref_subCategoryName', subCategoryName);
            Session.setTemp('pref_courses', arrCourse);
        });
    },
    'change #course': function (event, template) {
        var courseId = $(event.target).val();
        if(!courseId){
            courseId =  Session.get('courseId');
        }
        if(courseId>0){
            Meteor.call('getSubjects', parseInt(courseId), function (error, result) {
                arrSubject = [];
                $.each(result, function (i, n) {
                    categoryName = n.display_name;
                    $.each(n.sub_category, function (j, m) {
                        if (parseInt(m.id) === parseInt(Session.get('subCatId'))){
                            $.each(m.course, function (k, l) {
                                if (parseInt(l.id) === parseInt(courseId)){
                                    courseName = l.display_name;
                                    $.each(l.subject, function (h, o) {
                                        arrSubject.push(o);
                                    });
                                    return false;
                                }
                                return true;
                            });
                            return false;
                        }
                        return true;
                    });
                });
                Session.setTemp('pref_courseId', parseInt(courseId));
                Session.setTemp('pref_courseName', courseName);
                Session.setTemp('pref_subjects', arrSubject);
                var subjectName="";
                for(var i=0; i<arrSubject.length;i++){
                    if(i==0){
                        subjectName=result[i].subject.name;
                    } else {
                        subjectName=subjectName+", "+result[i].subject.name;
                    }
                }
//                if(subjectName.length>80){
//                   subjectName=subjectName.substring(0, 80)+"...";
//                }
                Session.setTemp("pref_subjectName", subjectName);
            });
            
            
            var subjectCheckboxIds=[];
            $("#checkAll").prop('checked', true);
            Meteor.setTimeout(function(){
                $("input:checkbox[name=inputcheckbox]").each(function(){
                    $(this).prop('checked',true);
                    subjectCheckboxIds.push(parseInt($(this).val()));
                });
                Session.set("pref_subjectCheckboxIds",subjectCheckboxIds);
            }, 500)
        }
    },

    'click label': function (event, template) {
        event.stopPropagation(); 
        $("#checkAll").click(function () {
            $(".check").prop('checked', $(this).prop('checked'));
        });

        var subjectCheckboxIds=[];

        $("input:checkbox[name=inputcheckbox]:checked").each(function(){
                subjectCheckboxIds.push(parseInt($(this).val()));
        });

        Session.setTemp("pref_subjectCheckboxIds",subjectCheckboxIds);
   },
    'click .multiselect-container': function (event, template) {
        $(this).parent("div").addClass("btn-group open");
        $(this).closest("li").addClass("active");

    },
    "click .save_pref_btn": function (e) {
        e.preventDefault();
        var selected_cat = $( "#category" ).val();
        var selected_sub_cat = $( "#subCategory" ).val();
        var selected_course = $( "#course" ).val();
        var subjectIDString= Session.get('pref_subjectCheckboxIds').join();
        var subjectIDnumber = subjectIDString.split(',').map(Number);
        if(selected_cat==0){
            toastr.warning('Please select a Category');
            return false;
        }
        if(selected_sub_cat==0){
            toastr.warning('Please select a Sub category');
            return false;
        }
        if(selected_course==0){
            toastr.warning('Please select a Course');
            return false;
        }
        if(subjectIDnumber.length == 1 && subjectIDnumber[0]==0){
            toastr.warning('Please select atleast one subject');
            return false;
        }
        $('.arrrow_pref').show();
        ga('send', {
            hitType: 'event',
            eventCategory: 'preference',
            eventAction: 'preference_saved',
            eventLabel: 'top_fixed_your_preference'
          });
            Session.set('categoryId', Session.get('pref_categoryId'));
            Session.set('categoryName', Session.get('pref_categoryName'));
            Session.set('subCategories', Session.get('pref_subCategories'));
            Session.set('subCategoryId', Session.get('pref_subCategoryId'));
            Session.set('subCategoryName', Session.get('pref_subCategoryName'));
            Session.set('courses', Session.get('pref_courses'));
            Session.set('courseId', Session.get('pref_courseId'));
            Session.set('courseName', Session.get('pref_courseName'));
            Session.set('subjects', Session.get('pref_subjects'));
            Session.set("subjectName", Session.get("pref_subjectName"));
            Session.set("subjectCheckboxIds",Session.get("pref_subjectCheckboxIds"));
        var userPrefrences = [{
                'category': Session.get('categoryId'),
                'subCategory': Session.get('subCategoryId'),
                'course': Session.get('courseId'),
                'subjectIDS': Session.get('subjectCheckboxIds').join(),
        }];
        $('#mask1').show();
        Session.set('userCurrentPrefrences', userPrefrences);
        var userId = Session.get('landing_user_profile_id');
        var token = 'global';

        //set session again
        Session.set('global_grade_id',Session.get('courseId'));
        Session.set('selectedSubjects',Session.get('subjectCheckboxIds'));
        Session.set('global_subject_id', subjectIDnumber);
        Meteor.call('setUserPreference', userId, token,
            Session.get('categoryId'), Session.get('subCategoryId'),
            Session.get('courseId'),Session.get('subjectCheckboxIds').join(), function (error, result) {
        });
	Meteor.call('aboutCourseData', parseInt(Session.get('global_grade_id')) , function (error, result) {
            var aboutData =  result.content;
            aboutData = JSON.parse(aboutData);
            var aboutExists = aboutData.data;
            if(aboutData.result){
                Session.set('about_course_url_str',aboutExists.ecomExam.url_string);
                Session.set('about_course_about_desc',aboutExists.ecomExam.about_desc);
            }else{
                Session.set('about_course_url_str',undefined);
            }
        });
        Meteor.call('preferenceSubjectName',
            parseInt(Session.get('courseId')),Session.get('subjectCheckboxIds'),function (error, result) {
            var subjectName=result;
            Session.set("subjectName", subjectName);

                $('.save-url').hide();
                $('.cancel-url').hide();
                $('.change-url').show();
                $('#hideCategory').hide();
                $('#hideSubCategory').hide();
                $('#subjectOnChange').hide();
                $('#course').hide();
                $('#subjectOnRender').show();
                $('#courseOnRender').show();
                getWall(1);
        });
    },
    'click .change_preference_wall': function (event) {
        event.preventDefault();
        $('.arrrow_pref').hide();
        $('#hideCategory').show();
        $('#hideSubCategory').show();
        $('#subjectOnChange').show();
        $('#course').show();
        $('#subjectOnRender').hide();
        $('#courseOnRender').hide();
        var catId = Session.get('categoryId');
        if(catId){
//            $("#category").val(catId).attr('selected', true);
            Meteor.call('getSubCategories', parseInt(catId), function (error, result) {
                arrSubCat = [];
                $.each(result, function (i, n) {
                    categoryId = n.id;
                    categoryName = n.display_name;
                    $.each(n.sub_category, function (j, m) {
                        arrSubCat.push(m);
                    });
                });
                Session.setTemp('pref_categoryId', parseInt(categoryId));
                Session.setTemp('pref_categoryName', categoryName);
                Session.setTemp('pref_subCategories', arrSubCat);
            }); 
        }  
        var subCatId = Session.get('subCatId');
        if(subCatId){
//                $("#subCategory").val(subCatId).attr('selected', true);
            Meteor.call('getCourses', parseInt(subCatId), function (error, result) {
                arrCourse = [];
                $.each(result, function (i, n) {
                    $.each(n.sub_category, function (j, m) {
                        if (m.id == subCatId){
                            subCategoryId = m.id;
                            subCategoryName = m.display_name;
                            $.each(m.course, function (k, l) {
                                arrCourse.push(l);
                            });
                        }
                    });
                });
                Session.setTemp('pref_subCategoryId', parseInt(subCategoryId));
                Session.setTemp('pref_subCategoryName', subCategoryName);
                Session.setTemp('pref_courses', arrCourse);
            }); 
        } 
        var courseId = Session.get('courseId');
        if(courseId){
//                $("#course").val(courseId).attr('selected', true);
            Meteor.call('getSubjects', parseInt(courseId), function (error, result) {
                arrSubject = [];
                $.each(result, function (i, n) {
                    categoryName = n.display_name;
                    $.each(n.sub_category, function (j, m) {
                        if (parseInt(m.id) === parseInt(Session.get('subCatId'))){
                            $.each(m.course, function (k, l) {
                                if (parseInt(l.id) === parseInt(courseId)){
                                    courseName = l.display_name;
                                    $.each(l.subject, function (h, o) {
                                        arrSubject.push(o);
                                    });
                                    return false;
                                }
                                return true;
                            });
                            return false;
                        }
                        return true;
                    });
                });
                Session.setTemp('pref_courseId', parseInt(courseId));
                Session.setTemp('pref_courseName', courseName);
                Session.setTemp('selectedSubjects', '');
                Session.setTemp('pref_subjects', arrSubject);
                var subjectName="";
                for(var i=0; i<arrSubject.length;i++){
                    if(i==0){
                        subjectName=result[i].subject.name;
                    } else {
                        subjectName=subjectName+", "+result[i].subject.name;
                    }
                }
//                if(subjectName.length>80){
//                   subjectName=subjectName.substring(0, 80)+"...";
//                }
                Session.setTemp("pref_subjectName", subjectName);
            });
        }
         var subjectCheckboxIds=[];
            $("#checkAll").prop('checked', true);
            Meteor.setTimeout(function(){
                $("input:checkbox[name=inputcheckbox]").each(function(){
                    $(this).prop('checked',true);
                    subjectCheckboxIds.push(parseInt($(this).val()));
                });
                Session.setTemp("pref_subjectCheckboxIds",subjectCheckboxIds);
            }, 500) 
    },
    'click .btn': function (event) {
        event.preventDefault();
    },
   'click .cancel-url': function (event) {
        event.preventDefault();
        $('.arrrow_pref').show();
        $('#hideCategory').hide();
        $('#hideSubCategory').hide();
        $('#subjectOnChange').hide();
        $('#course').hide();
        $('#subjectOnRender').show();
        $('#courseOnRender').show();
        Session.set('pref_categoryId', Session.get('categoryId'));
        Session.set('pref_categoryName', Session.get('categoryName'));
        Session.set('pref_subCategories', Session.get('subCategories'));
        Session.set('pref_subCategoryId', Session.get('subCategoryId'));
        Session.set('pref_subCategoryName', Session.get('subCategoryName'));
        Session.set('pref_courses', Session.get('courses'));
        Session.set('pref_courseId', Session.get('courseId'));
        Session.set('pref_courseName', Session.get('courseName'));
        Session.set('pref_subjects', Session.get('subjects'));
        Session.set("pref_subjectName", Session.get("subjectName"));
        Session.set("pref_subjectCheckboxIds",Session.get("subjectCheckboxIds"));
   }
});

Template.my_preference.rendered = function () {
    $(document).ready(function () {
        if ($('button').hasClass("multiselect dropdown-toggle btn btn-default")) {
            $(".multiselect").prop('disabled', true);
        }
    });

}
Modal.allowMultiple = true
Template.change_subject.events({
    'submit form': function (event) {
        event.preventDefault();
        var lastSelectedSubject = [];
        $(":checkbox").each(function () {
            if ($(this).prop("checked") == true) {
                lastSelectedSubject.push(this.value);
            }
        });
        Session.set('lastSelectedSubject', lastSelectedSubject);
        Session.set('selectedSubjects', lastSelectedSubject);
        Modal.hide('change_subject');
    }
});


Template.change_subject.rendered = function () {
    var selectedSubj = Session.get('selectedSubjects');
    $(":checkbox").each(function () {
        var subId = this.value;
        if (selectedSubj.indexOf(subId) > -1) {
            $(this).prop("checked", true);
        } else {
            $(this).prop("checked", false);
        }
    });
    $(".change_subject").on('click', function () {
        var selectedSubj = Session.get('selectedSubjects');
        $(":checkbox").each(function () {
            console.log(this.id);
            var subId = this.value;
            if (selectedSubj.indexOf(subId) > -1) {
                $(this).prop("checked", true);
            } else {
                $(this).prop("checked", false);
            }
        });
    });
}
Template.change_subject.helpers({
    'subjects': function () {
        return Session.get('subjects');
    },
    'subjectName': function () {
        return Session.get("subjectName", subjectName);
    },
    'prefSelectedSubject': function () {
        return Session.get('selectedSubjects');
    },
});

Template.cart.onRendered(function () {
    var userId = Session.get('landing_user_profile_id');
    Session.set('cartList',undefined);
    Session.set('no_items_in_cart',undefined);
    Meteor.call('lists_cart', userId, function (error, result) {
        var contentdata = JSON.parse(result.content);
        if (contentdata.result_data) {
            Session.set('cartList', contentdata.result_data);
        }
    });
});

Template.cart.helpers({
    cartList: function () {
        if (Session.get('cartList')) {
            var data = Session.get('cartList');

            if (data) {
                return data;
            }
        }

    },
    cartCount: function () {
        if (Session.get('cartList')) {
            var data = Session.get('cartList');
            Session.set('no_items_in_cart',data.length);
            return data.length;
        }
    },
    packageCost: function (discountedCost) {
        if (discountedCost > 0) {
            return true;
        } else {
            return false;
        }
    },
    cartTotal: function () {
        if (Session.get('cartList')) {
            var data = Session.get('cartList');
            var total = 0;
            $.each(data, function (i, v) {
                if (v.discounted_cost > 0) {
                    total += parseFloat(v.discounted_cost);
                } else {
                    total += parseFloat(v.subscription_cost);
                }
            });
            total = total.toFixed(2);
            Session.set('cartTotalAmt', total);
            return total;
        }
    },
    totalPayable: function () {
        var discount = 0;
        var cartTotal = Session.get('cartTotalAmt');
        if (cartTotal) {
            if (Session.get('discountamt')) {
                var discountamt = Session.get('discountamt');
                discount = parseFloat(discountamt);
            }
            var calamt = parseFloat(cartTotal) - parseFloat(discount);
            return calamt.toFixed(2);
        } else {
            return 0;
        }

    },
    cartdiscount: function () {
        if (Session.get('discountamt')) {
            var discountamt = Session.get('discountamt');
            discount = parseFloat(discountamt);
            return discount;
        } else {
            return 0;
        }
    },
    hardwareTypeClass:function(hardware_type){
      if(hardware_type==3){
        return 'pendrive';
      }else	if(hardware_type==4){
        return 'pendrive';
      }else if(hardware_type==35){
        return 'dwnlod';
      }if(hardware_type==8){
        return 'sdcard';
      }else if(hardware_type==14){
        return 'tableticn';
      }else{
        return false;
      }
    }
});


Template.cart.events = {
    "click .removeCart": function (event,template) {
        event.preventDefault();
        var userId = Session.get('landing_user_profile_id');
        var packageid = $(event.currentTarget).attr('alt');
        var ids=packageid.split("_");
        var packageid=ids[0];
        var packagesubid=ids[1];
        var packagetype=ids[2];
        Meteor.call('delete_from_cart',packagetype,userId,packageid,packagesubid,function(error, result){
            var contentdata=JSON.parse(result.content);
            if(contentdata.status==true){
                toastr.success(contentdata.message,'success');
                Meteor.call('lists_cart', userId, function (error, result) {
                var contentdata = JSON.parse(result.content);
                if (contentdata.result_data) {
                    Session.set('cartList', contentdata.result_data);
                }else{
                    Session.set('cartList', undefined);
                    Session.set('no_items_in_cart',undefined);
                }
            });
        }
    })
    },
    "click .paynowbtn" : function (event,template) {
        event.preventDefault();
        gaEvent('cart', 'proceed_to_checkout', 'cart_pop_up', ''); 
        $('#mask1').show();
        Session.set('unlock_data',undefined);
        Router.go('/cart/list');
    }
};


Template.rtbanner.events = {
    "click .free_trial_web_wall": function (e) {
        e.preventDefault();
         ga('send', {
            hitType: 'event',
            eventCategory: 'free_trial',
            eventAction: 'free_trial_clicked',
            eventLabel: 'wall_sticky_banner'
          });
       if(Session.get('landing_user_profile_id')){
           Session.set('global_free_subscription',true);
           Modal.show('congrats');
       }else{
           Session.set('coming_from_free_trial_other_page',1);
           Modal.show('sign_in');
       }
    },
    "click .subs_from_banner_wall": function (e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'subscription',
            eventAction: 'subscription_clicked',
            eventLabel: 'wall_sticky_banner'
          });
        if(Session.get('landing_user_profile_id')){
            Router.go('/subscription/plan');
        }else{
            Session.set('coming_from_subscription',1);
            Modal.show('sign_in');
        }
    },
    "click .choose_course_banner_wall": function (e) {
        e.preventDefault();
        toastr.success('Please click on Course Card to buy on Pen Drive or SD Card.');
    }
};

Template.my_preference.rendered = function () {

$('#hideCategory').hide();
$('#hideSubCategory').hide();
$('#subjectOnChange').hide();

$('#course').hide();

};

Template.rtbanner.helpers({
    is_subscribed: function () {
        if(Session.get('global_flag_free')==true){
            return false;
        }else{
            return true;
        }
    },
     'is_free_trial_taken': function() {
        if(Session.get('free_trial_taken')==true){
            return false;
        }else{
            return true;
        }
    }
});


Template.about_courses_div.onCreated(function() {
    var grade_id = Session.get('global_grade_id');
    try{
        Meteor.call('aboutCourseData', parseInt(grade_id) , function (error, result) {
            var aboutData =  result.content;
            aboutData = JSON.parse(aboutData);
            var aboutExists = aboutData.data;
            if(aboutData.result){
                Session.set('about_course_url_str',aboutExists.ecomExam.url_string);
                Session.set('about_course_about_desc',aboutExists.ecomExam.about_desc);
            }else{
                Session.set('about_course_url_str',undefined);
            }
        });
    } catch (e) {
        console.log(e);
    }
    Session.set('about_course_title',Session.get('courseName'));
});

Template.about_courses_div.helpers({
    'course_about_url_string': function() {
       var titleStr = Session.get('about_course_url_str');
       if(titleStr){
         return titleStr;
        }else{
            return false;
        }
    },
    'about_course_title_string': function() {
        var titleStr = Session.get('about_course_title');
        return titleStr;
    },
    'about_course_desc': function() {
        var about_desc = Session.get('about_course_about_desc');
        return about_desc;
    }
});



Template.my_preference.rendered = function () {
$('#hideCategory').hide();
$('#hideSubCategory').hide();
$('#subjectOnChange').hide();
$('#course').hide();
};

Template.about_courses_div.events = {
    "click .gotoabout" : function (event) {
  		event.preventDefault();
  		var urlstr1 = Session.get('about_course_url_str');
        var url='/'+urlstr1+'/about';
        // window.location.href = '/'+urlstr1+'/about';
         Router.go(url);

        return true;
      }
};

Template.wall_banner1.events = {
    "click .bannerbtn" : function (event) {
	event.preventDefault();
         ga('send', {
            hitType: 'event',
            eventCategory: 'free_trial',
            eventAction: 'free_trial_clicked',
            eventLabel: 'wall_banner'
          });
        if(Session.get('landing_user_profile_id')){
            Modal.show("congrats");
        } else {
            Session.setTemp('coming_from_free_trial',1);
            Modal.show('sign_in');
        }
    },
   'click .banner_subscription': function(e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'subscription',
            eventAction: 'subscription_clicked',
            eventLabel: 'wall_banner'
          });
        if(Session.get('landing_user_profile_id')){
            Session.set('global_paid_subscription',true);
            Session.set('validityPrice_from_pricing_subscription',3999);
            Router.go('/subscription/plan');
        }else{
            Session.setTemp('coming_from_subscription',1);
            Modal.show('sign_in');
        }
 }

};

Template.notif_cart_count.events = {
    "click #notifidweb" : function (event) {
        event.preventDefault();
        $('.notifi_pop').show();
        var userId = Session.get('landing_user_profile_id');
        if(userId){
            Meteor.call('new_notification_count', userId, function (error, result) {
                if(result){
                Session.set('notificaiton_count',result);//result is notificationCount
                }
            });
        }
    }
};

Template.notification.rendered = function () {
        var userId=Session.get('landing_user_profile_id');
        if(userId){
            var token ='global';
            Meteor.call('getUserNotificationWeb',userId,token, function (error, result) {
                if(result){
                    console.log('getNotifWeb',JSON.parse(result.content));
                    Session.set('user_notification',JSON.parse(result.content));
                }
            })
        }
};

Template.notification.helpers({
    'userNotificationCount': function () {
        var notification = Session.get('user_notification');
        var notificationCount = (notification.result_data).length;
        return notificationCount;
    },
    'userNotification': function () {
        var notification = Session.get('user_notification');
        var notificationListing = notification.result_data;
        console.log('notificationListing',notificationListing);
        return notificationListing;
    }
});

function getWall(reload){
    var slugData = getcustomData(Session.get('courseName'));
    var id = Session.get('global_grade_id');
    if(reload==1){
        window.location.href='/'+slugData+'/'+id;   
    } else {
        Router.go('/'+slugData+'/'+id);   
    }
}

Template.wall_banner1.helpers({
    is_free_trial_taken: function() {
        if(Session.get('free_trial_taken')==true){
            return false;
        }else{
            return true;
        }
    }
});


Template.left_navigation_mobile.events({
    'click #course_page': function (event) {
        Session.setTemp('coming_from_trending_course',2);
        var grade_id = Session.get('global_grade_id');
        
        var subject_id = Session.get('global_subject_id');
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);
    },
    'click #test_page': function (event) {
        var grade_id = Session.get('global_grade_id');
        var subject_id = Session.get('global_subject_id');
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/tests/'+slugData);
        //Router.go('/tests');
    },
    'click #tutor_page': function (event) {
        Router.go('/tutors');
    },
    'click #test_page_disable': function (event) {
       Modal.show('no_tests');
    },
    'click #course_page_disable': function (event) {
       Modal.show('no_courses');
    },
    'click #render_my_course_from_wall': function() {
    if(Session.get('landing_user_profile_id')){
        var userId =  Session.get('landing_user_profile_id');
        Meteor.call('getMyCoursesListingWeb',userId,'global',0,false, function(error, result){
            var list = JSON.parse(result.content);
                Session.set('my_courses',list);
	        Session.set('my_course_size',(list.result_data.batch).length);
            if((list.result_data.batch).length>0){
                Router.go('/my_course');
            }else{
                Modal.show('no_my_courses');
            }
        });    
    }else{
        Modal.show('sign_in')
    }
    
    },
    'click #render_my_test_from_wall': function() {
        if(Session.get('landing_user_profile_id')){
        var userId =  Session.get('landing_user_profile_id');
        Meteor.call('getMyCoursesListingWeb',userId,'global',1,false, function(error, result){
            var list = JSON.parse(result.content);
            Session.set('my_tests',list);
            if((list.result_data.batch).length>0){
                Router.go('/my_test_series');
            }else{
                Modal.show('no_test_in_my_test');
            }
        });    
        }else{
        Modal.show('sign_in')
        }
    },
    'click #render_my_purchases_from_wall': function() {
        if(Session.get('landing_user_profile_id')){
            var userId =  Session.get('landing_user_profile_id');
            Meteor.call('getMyCoursesListingWeb',userId,'global',0,true, function(error, result){
                var list = JSON.parse(result.content);
                     Session.set('my_purchases',list);
                if(list.status == false){
                    if(Session.get('courseCount')!=0){
                            Modal.show('no_my_purchases');
                        }else{
                            Modal.show('no_purchased_test');
                        }
                } else {
                    if((list.result_data.batch).length>0){
                        Router.go('/my_purchases');
                    }else{
                        if(Session.get('courseCount')!=0){
                            Modal.show('no_my_purchases');
                        }else{
                            Modal.show('no_purchased_test');
                        }
                    }
                }  
            });    
        } else {
            Modal.show('sign_in');
        }
    },
    'click #home_page': function() {
	getWall(0);
    }
});