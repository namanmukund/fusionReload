Template.rtbanner_test.helpers({
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

Template.no_test_in_my_test.events({
    "click #go_to_test_my_test_pop": function (e){
        e.preventDefault(); 
        Modal.hide('no_test_in_my_test');
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/tests/'+slugData);
    }
});

Template.no_purchased_test.events({
    "click #my_purchased_test_pop": function (e){
        e.preventDefault();
        Modal.hide('no_purchased_test');
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/tests/'+slugData);
    }
});


Template.test_list.events = {
    "click .sign-up" : function(e) {
        e.preventDefault();
        Session.clear('coming_from_subscription_pricing');
    Session.clear('coming_from_subscription');
    Session.clear('join_course_clicked');
        Modal.show('sign_up');
    },
    "click .sign-in" : function(e) {
        e.preventDefault();
        Session.clear('coming_from_subscription_pricing');
    Session.clear('coming_from_subscription');
    Session.clear('join_course_clicked');
        Modal.show('sign_in');
    },
    "click .frgtpwd" : function(e) {
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
Template.test_list.helpers({
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

Template.tests_page.onCreated(function() {
	Blaze._allowJavascriptUrls();
});

Template.tests_page.rendered = function() {
    Session.setTemp('currentPageWeb','test');
    $(window).scrollTop(0);
    $('#mask1').show();
    $("#checkAll").click(function () {
        $(".check").prop('checked', $(this).prop('checked'));
    });
    this.$('.rateit').rateit();
};

Template.tests_full_list.rendered = function() {
    var userId =  Session.get('landing_user_profile_id');
    var grade_id = '';
    var subject_id = '';
    if(Session.get('global_grade_id') && Session.get('global_subject_id')){
        grade_id = Session.get('global_grade_id');
        subject_id = Session.get('global_subject_id');
    }else{
        if(localStorage.getItem("course")){
            grade_id = (localStorage.getItem("course"));
            var subjectId = (localStorage.getItem("subjectIDS"));
            var array_subject_id = subjectId.split(',');
            
            var parseSubjects=[];
            $.each(array_subject_id,function(index,value){
                var intsubject = parseInt(value);
                parseSubjects.push(intsubject);
            })
            subject_id  = parseSubjects;
        }
    }

    if(!userId){
        userId = 40000483;
    }

	Meteor.call('getFeaturedCoursesWeb',userId,'global',1,grade_id,subject_id, function(error, result){
		Session.set('courses_data',result);
	});
	this.$('.rateit').rateit();
}

Template.tests_full_list.helpers({
    'comp_course_first': function() {
        var data  = Session.get('courses_data');
        var data1 = JSON.parse(data.content);
        var data2 = data1.result_data.feature_courses[0];
        var list_course =  data2.list;

    if(list_course){    
        for(var k=0; k<list_course.length ; k++){
            if(list_course[k]){ 
                var min_sd_price = 100000;
                var min_usb_price = 100000;
                var min_tab_price = 100000;
                if(list_course[k].price_info){
                    var price_info =  list_course[k].price_info;

                    for(var i=0; i<price_info.length ; i++){
                        if(price_info[i].hw_type == 1){
                            if(price_info[i].price<min_usb_price)
                            min_usb_price = price_info[i].price;
                        }
                        if(price_info[i].hw_type == 4){
                            if(price_info[i].price<min_sd_price)
                            min_sd_price = price_info[i].price;
                        }
                        if(price_info[i].hw_type == 2){
                            if(price_info[i].price<min_tab_price)
                            min_tab_price = price_info[i].price;
                        }
                    }
                }
                if(min_usb_price == 100000){
                    min_usb_price =0;
                }
                if(min_sd_price == 100000){
                    min_sd_price =0;
                }
                if(min_tab_price == 100000){
                    min_tab_price =0;
                }
                var min_usb = {"min_usb_price":min_usb_price};
                var min_sd = {"min_sd_price":min_sd_price};
                var min_tab = {"min_tab_price":min_tab_price};
                
                (list_course[k].price_info).push(min_usb);
                (list_course[k].price_info).push(min_sd);
                (list_course[k].price_info).push(min_tab);
            }
        }
    }
    return list_course;
    },
    'randomJoinedUsers': function() {
        var randomJoinedUsers=Math.floor(Math.random() * (3)) + 18;
        return randomJoinedUsers;
    },
    'comp_course': function() {
        var data  = Session.get('courses_data');
        var data1 = JSON.parse(data.content);
        var data2 = data1.result_data.feature_courses;
        var courses_array = [];
        for(var j=1;j<data2.length;j++){
            var list_course = data2[j].list;
            if(list_course){    
                for(var k=0; k<list_course.length ; k++){
                    if(list_course[k]){ 
                        var min_sd_price = 100000;
                        var min_usb_price = 100000;
                        var min_tab_price = 100000;
                        if(list_course[k].price_info){
                            var price_info =  list_course[k].price_info;

                            for(var i=0; i<price_info.length ; i++){
                                if(price_info[i].hw_type == 1){
                                    if(price_info[i].price<min_usb_price)
                                    min_usb_price = price_info[i].price;
                                }
                                if(price_info[i].hw_type == 4){
                                    if(price_info[i].price<min_sd_price)
                                    min_sd_price = price_info[i].price;
                                }
                                if(price_info[i].hw_type == 2){
                                    if(price_info[i].price<min_tab_price)
                                    min_tab_price = price_info[i].price;
                                }

                            }
                        }
                        if(min_usb_price == 100000){
                            min_usb_price =0;
                        }
                        if(min_sd_price == 100000){
                            min_sd_price =0;
                        }
                        if(min_tab_price == 100000){
                            min_tab_price =0;
                        }
                        var min_usb = {"min_usb_price":min_usb_price};
                        var min_sd = {"min_sd_price":min_sd_price};
                        var min_tab = {"min_tab_price":min_tab_price};

                        (list_course[k].price_info).push(min_usb);
                        (list_course[k].price_info).push(min_sd);
                        (list_course[k].price_info).push(min_tab);
                    }
                }
            }
            
            courses_array.push(data2[j]);
		}
        $('#mask1').hide();        
        return courses_array;
    },
    'hw_type': function () {
        var result = Sesison.get('course_list');
        var flag_sd_card = [];
        var flag_pend = [];
        var flag_download= [];
        if(result){
            for(var i=0;i<result.length;i++){
                for(var j=0;j<result[i].price_info.length;i++){
                    if(result[i].price_info[j].hw_type=='1'){
                        flag_pend = 1;
                    }else if(result[i].price_info[j].hw_type=='4'){
                        flag_sd_card = 1;
                    }else if(result[i].price_info[j].hw_type=='3'){
                        flag_download = 1;
                    }
                }
            }      
        }
        var hardware_details = {
            "flag_sd_card": flag_sd_card,
            "flag_pend": flag_pend,
            "flag_download": flag_download
        };
        return hardware_details;
    },
    'isType': function (param1, param2) {
        return param1 === param2;
    },
    'isJoinedCourse': function (param1, param2) {
        if(param1 == param2){
            return false;
        }else{
            return true;
        }
    },
    'course_title': function () {
        var data  = Session.get('courses_data');
        var data1 = JSON.parse(data.content);
        var title = data1.result_data.feature_courses[0].title;  
        return title;
    }
});


Template.tests_full_list.events({
    'click .course_pdp': function() {
        var myVar = this;
        var breadcrumb_name_course;
        if((this.subjects).length>1){
            breadcrumb_name_course = this.GradeArr[0].name;
            Session.set('breadcrumb_name_course',breadcrumb_name_course);
        }else{
            breadcrumb_name_course = this.subjects[0].name;
            Session.set('breadcrumb_name_course',breadcrumb_name_course);
        }
        var pckg_id = this.PsCourseId;
        var slugData = getcustomData(this.CourseName);
        Session.set('pckg_id',pckg_id);
        Session.set('course_data',myVar);
	Router.go('/'+slugData+'/tests/'+pckg_id);
    },
    'click #join_course_test_page': function() {
        var pckg_id = this.PsCourseId;
        ga('send', {
                        hitType: 'event',
                        eventCategory: 'test_join',
                        eventAction: 'test_clicked_successfully',
                        eventLabel: 'test',
                        eventValue: pckg_id
                     });
        var userId =  Session.get('landing_user_profile_id');
        Meteor.call('joinCourse',userId,'global',pckg_id, function(error, result){
            var data = JSON.parse(result.content);
            var status = data.status;
            if(status == 'true'){
                var msg="Test-Series added successfully to My Tests.";
                toastr.success(msg);
                // Modal.show('courseJoinPopUp');
            var grade_id = Session.get('global_grade_id');
            var subject_id = Session.get('global_subject_id');
            userId = Session.get('landing_user_profile_id');
            Meteor.call('getFeaturedCoursesWeb',userId,'global',1,grade_id,subject_id, function(error, result){
                Session.set('courses_data',result);
            });
                ga('send', {
                        hitType: 'event',
                        eventCategory: 'test_join',
                        eventAction: 'test_joined_successfully',
                        eventLabel: 'test',
                        eventValue: pckg_id
                     });
            }else{
                Modal.show('sign_in');
                Session.setTemp('join_course_clicked',1);
                Session.setTemp('join_course_is_test',1);
                Session.setTemp('join_package_id',pckg_id);
                return;
                // Modal.show('courseUnJoinPopUp');
            }
        }); 
    },
    'click #unjoin_course_test_page': function() {
        var pckg_id = this.PsCourseId;    
        if(localStorage.getItem("userId")){
			Session.set('landing_user_profile_id',(localStorage.getItem("userId")));
        }
        var userId =  Session.get('landing_user_profile_id'); 
        Meteor.call('unjoinCourse',userId,'global',pckg_id, function(error, result){
            var data = JSON.parse(result.content);
            var status = data.status;
            if(status=='true'){
                var msg="Test-Series removed successfully from My Tests.";
                toastr.success(msg);
            var grade_id = Session.get('global_grade_id');
            var subject_id = Session.get('global_subject_id');
            userId = Session.get('landing_user_profile_id');
            Meteor.call('getFeaturedCoursesWeb',userId,'global',1,grade_id,subject_id, function(error, result){
                    Session.set('courses_data',result);
            });    
                
            } else {
                var msg='Something went wrong';
                toastr.warning(msg);
            }
        });    
    
    }
});

Template.nav_test.events({
    'click #render_my_test': function() {
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
     'click #render_my_course_from_test': function() {
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
    'click #render_my_purchasedTest': function() {
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
	getTestWall();
        //Router.go('/wall');
    },
    'click #course_page': function() {
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);
    },
    'click #tutor_page': function() {
	Router.go('/tutors');
    },
    'click #test_page_disable': function (event) {
	Modal.show('no_tests');
    },
    'click #course_page_disable': function() {
        toastr.warning('No courses found');
    }
});
//my_course helpers and events
Template.my_test_list.helpers({
    'my_courses': function() {
        if(Session.get('my_tests')){
            var res = Session.get('my_tests');
            if(res){
                
                var list_course = res.result_data.batch;
                
                if(list_course){    
                    for(var k=0; k<list_course.length ; k++){
                        if(list_course[k]){ 
                            var min_sd_price = 100000;
                            var min_usb_price = 100000;
                            var min_tab_price = 100000;
                            if(list_course[k].price_info){
                                var price_info =  list_course[k].price_info;

                                for(var i=0; i<price_info.length ; i++){
                                    if(price_info[i].hw_type == 1){
                                        if(price_info[i].price<min_usb_price)
                                        min_usb_price = price_info[i].price;
                                    }
                                    if(price_info[i].hw_type == 4){
                                        if(price_info[i].price<min_sd_price)
                                        min_sd_price = price_info[i].price;
                                    }
                                    if(price_info[i].hw_type == 2){
                                        if(price_info[i].price<min_tab_price)
                                        min_tab_price = price_info[i].price;
                                    }

                                }
                            }
                            if(min_usb_price == 100000){
                                min_usb_price =0;
                            }
                            if(min_sd_price == 100000){
                                min_sd_price =0;
                            }
                            if(min_tab_price == 100000){
                                min_tab_price =0;
                            }
                            var min_usb = {"min_usb_price":min_usb_price};
                            var min_sd = {"min_sd_price":min_sd_price};
                            var min_tab = {"min_tab_price":min_tab_price};

                            (list_course[k].price_info).push(min_usb);
                            (list_course[k].price_info).push(min_sd);
                            (list_course[k].price_info).push(min_tab);
                        }
                    }
                } 
                return res;
            }
        }           
    },
    'check_empty': function(param1,param2) {
        if(param1==param2){
        return true;
    }
    }
});

Template.my_test_list.events({
    'click #unjoin_myTest': function() {
        var pckg_id = this.PsCourseId;
        var userId =  Session.get('landing_user_profile_id'); 
        Meteor.call('unjoinCourse',userId,'global',pckg_id, function(error, result){
            var data = JSON.parse(result.content);
            var status = data.status;
            if(status=='true'){
                 var msg="Test-Series removed from My Tests.";
                toastr.success(msg);
            Meteor.call('getMyCoursesListingWeb',userId,'global',1,false, function(error, result){
                var list = JSON.parse(result.content);
                Session.set('my_courses',list);
            });               
            } else {
                var msg="Something went wrong.";
                toastr.warning(msg);
            }    
        }); 
    },
    'click .course_pdp': function() {
        var myVar = this;
        var breadcrumb_name_course;
        if((this.subjects).length>1){
            breadcrumb_name_course = this.GradeArr[0].name;
            Session.set('breadcrumb_name_course',breadcrumb_name_course);
        }else{
            breadcrumb_name_course = this.subjects[0].name;
            Session.set('breadcrumb_name_course',breadcrumb_name_course);
        }
        var pckg_id = this.PsCourseId;
        var slugData = getcustomData(this.CourseName);
        Session.set('pckg_id',pckg_id);
        Session.set('course_data',myVar);
	Router.go('/'+slugData+'/tests/'+pckg_id);
    }
});

Template.nav_my_test.events({
    "click .sign-up" : function(e) {
        e.preventDefault();
        Session.clear('coming_from_subscription_pricing');
    Session.clear('coming_from_subscription');
        Modal.show('sign_up');
    },
    "click .sign-in" : function(e) {
        e.preventDefault();
        Session.clear('coming_from_subscription_pricing');
    Session.clear('coming_from_subscription');
        Modal.show('sign_in');
    },
    "click .frgtpwd" : function(e) {
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
});

Template.nav_my_test.helpers({
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

Template.sticky_nav_my_test.events({
    "click #home_page": function (e){
	getTestWall();
       //Router.go('/wall');
    },
    "click #course_page": function (e){
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);
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
    },
    'click #render_my_purchasedTest': function (event) {
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
    'click #render_my_course_test': function() {
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
    "click #course_page_disable": function (e){
       toastr.warning('No courses found');    
    }
});

Template.breadcrumb_my_tests.events({
    "click #test_home": function (e){
        var slugData = getcustomData(Session.get('about_course_title'));
        if(Session.get('currentPageWeb')=='course'){
            Router.go('/courses/'+slugData);
        }else if(Session.get('currentPageWeb')=='wall'){
            getCourseWall();
        }else if(Session.get('currentPageWeb')=='test'){
            Router.go('/tests/'+slugData);
        }
    }
});

Template.breadcrumb_my_tests.helpers({
    'breadcrumb_my_test': function(){
        if(Session.get('currentPageWeb')=='course'){
            return 'Courses';
        }else if(Session.get('currentPageWeb')=='wall'){
            return 'Home';
        }else if(Session.get('currentPageWeb')=='test'){
            return 'Tests';
        }else if(!Session.get('currentPageWeb')){
            return 'Home';
        }
    }
});

Template.my_purchase_list_tests.helpers({
    'my_purchase_list_tests': function() {
        if(Session.get('my_purchases')){
            var res = Session.get('my_purchases');
            if(res){
                
                var list_course = res.result_data.batch;
                
                if(list_course){    
                    for(var k=0; k<list_course.length ; k++){
                        if(list_course[k]){ 
                            var min_sd_price = 100000;
                            var min_usb_price = 100000;
                            var min_tab_price = 100000;
                            if(list_course[k].price_info){
                                var price_info =  list_course[k].price_info;

                                for(var i=0; i<price_info.length ; i++){
                                    if(price_info[i].hw_type == 1){
                                        if(price_info[i].price<min_usb_price)
                                        min_usb_price = price_info[i].price;
                                    }
                                    if(price_info[i].hw_type == 4){
                                        if(price_info[i].price<min_sd_price)
                                        min_sd_price = price_info[i].price;
                                    }
                                    if(price_info[i].hw_type == 2){
                                        if(price_info[i].price<min_tab_price)
                                        min_tab_price = price_info[i].price;
                                    }

                                }
                            }
                            if(min_usb_price == 100000){
                                min_usb_price =0;
                            }
                            if(min_sd_price == 100000){
                                min_sd_price =0;
                            }
                            if(min_tab_price == 100000){
                                min_tab_price =0;
                            }
                            var min_usb = {"min_usb_price":min_usb_price};
                            var min_sd = {"min_sd_price":min_sd_price};
                            var min_tab = {"min_tab_price":min_tab_price};

                            (list_course[k].price_info).push(min_usb);
                            (list_course[k].price_info).push(min_sd);
                            (list_course[k].price_info).push(min_tab);
                        }
                    }
                }    
                return res;
            }
        }           
    },
    'check_empty': function(param1,param2) {
        if(param1=param2){
        return true;
    }
    },
    'isJoinedCourse': function (param1, param2) {
        if(param1 == param2){
            return false;
        }else{
            return true;
        }
    }
});

Template.my_purchase_list_tests.events({
    'click #join_course_test_page': function() {
        var pckg_id = this.PsCourseId;
        var userId =  Session.get('landing_user_profile_id');

        Meteor.call('joinCourse',userId,'global',pckg_id, function(error, result){
            var data = JSON.parse(result.content);
            var status = data.status;
            if(status == 'true'){
                var msg="Test-Series added successfully to My Tests.";
                toastr.success(msg);
                // Modal.show('courseJoinPopUp');
            var grade_id = Session.get('global_grade_id');
            var subject_id = Session.get('global_subject_id');
            userId = Session.get('landing_user_profile_id');
            Meteor.call('getFeaturedCoursesWeb',userId,'global',1,grade_id,subject_id, function(error, result){
                    Session.set('courses_data',result);
            });
                
            }else{
                Modal.show('sign_in');
                return;
                // Modal.show('courseUnJoinPopUp');
            }
        }); 
    },
    'click #unjoin_course_test_page': function() {
        var pckg_id = this.PsCourseId;
        if(localStorage.getItem("userId")){
             Session.set('landing_user_profile_id',(localStorage.getItem("userId")));
        }
        var userId =  Session.get('landing_user_profile_id'); 
        Meteor.call('unjoinCourse',userId,'global',pckg_id, function(error, result){
            var data = JSON.parse(result.content);
            var status = data.status;
            if(status=='true'){
                var msg="Test-Series removed successfully from My Tests.";
                toastr.success(msg);
				var grade_id = Session.get('global_grade_id');
				var subject_id = Session.get('global_subject_id');
				userId = Session.get('landing_user_profile_id');
				Meteor.call('getFeaturedCoursesWeb',userId,'global',1,grade_id,subject_id, function(error, result){
						Session.set('courses_data',result);
				});
            } else {
                var msg='Something went wrong';
                toastr.warning(msg);
            }
        });
    }
});

Template.nav_my_purchased_tests.events({
    "click .sign-up" : function(e) {
        e.preventDefault();
        Modal.show('sign_up');
    },
    "click .sign-in" : function(e) {
        e.preventDefault();
        Modal.show('sign_in');
    },
    "click .frgtpwd" : function(e) {
        e.preventDefault();
        Modal.hide('sign_in');
        Modal.show('#forgotpwd');
    },
    "click .log_out_button": function (e) {
        e.preventDefault();
        localStorage.removeItem('userId');
        Session.clear('global_flag_free');
        Session.clear('landing_user_profile_id');
        window.location.reload(true);
    }
    
});
Template.nav_my_purchased_tests.helpers({
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

Template.sticky_nav_my_purchased_tests.events({
    "click #home_page": function (e){
	getTestWall();
        //Router.go('/wall');     
    },
    "click #course_page": function (e){
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);
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
    },
    'click #render_my_course_purchase': function (event) {
       Router.go('/my_course');
    },
    "click #course_page_disbale": function (e){
       toastr.warning('No courses found');   
    }
});

Template.breadcrumb_my_purchased_tests.events({
    "click #test_home": function (e){
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/tests/'+slugData);
    }
});

Template.my_test.onCreated(function() {
    Blaze._allowJavascriptUrls();
    if(!(Session.get('my_tests'))){
            if(Session.get('landing_user_profile_id')){
                var userId =  Session.get('landing_user_profile_id');
                Meteor.call('getMyCoursesListingWeb',userId,'global',1,false, function(error, result){
                    var list = JSON.parse(result.content);
                        Session.set('my_tests',list);
                    if((list.result_data.batch).length<0){
                        Modal.show('no_my_tests');
                    }
                });    
            }else{
                Modal.show('sign_in')
            }
        }
});

Template.my_test.rendered = function() {
    this.$('.rateit').rateit();
};

Template.my_purchased_tests.rendered = function() {
    this.$('.rateit').rateit();
};
Template.rtbanner_test.events = {
    "click .free_trial_web_test": function (e) {
        e.preventDefault(); 
        ga('send', {
            hitType: 'event',
            eventCategory: 'free_trial',
            eventAction: 'free_trial_clicked',
            eventLabel: 'test_sticky_banner'
          });
        if(Session.get('landing_user_profile_id')){
            Session.set('global_free_subscription',true);
            Modal.show('congrats');
        }else{
            Session.set('coming_from_free_trial_other_page',1);
            Modal.show('sign_in');  
        } 
    },
    "click .subs_from_banner_test": function (e) {
        e.preventDefault();
         ga('send', {
            hitType: 'event',
            eventCategory: 'subscription',
            eventAction: 'subscription_clicked',
            eventLabel: 'test_sticky_banner'
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

Template.studyoffline_test.events({
    "click .downloadpcapp": function (e){
        e.preventDefault();
        var element = $("input[type='radio']:checked").val();
        if(element == 32){
            window.location.href='http://static.iprofindia.com/directdownloadapp/Directdownload_setup_x86.exe';
        }else if(element == 64){
            window.location.href='http://static.iprofindia.com/directdownloadapp/Directdownload_setup_x64.exe';
        }
    }    
});

function getTestWall(){
    var url_string = Session.get('courseName');
    var id = Session.get('global_grade_id');
    var slugData = getcustomData(url_string);
    Router.go('/'+slugData+'/'+id);
}
