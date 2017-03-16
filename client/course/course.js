function course_array(p1, p2) {
    return p1 * p2;              // The function returns the product of p1 and p2
}

Template.courses_list.events = {
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
Template.courses_list.helpers({
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

Template.courses.onCreated(function() {
	Blaze._allowJavascriptUrls();
});

Template.courses.rendered = function() {
    Session.setTemp('currentPageWeb','course');
    $(window).scrollTop(0);
     $('#mask1').show();
    $("#checkAll").click(function () {
            $(".check").prop('checked', $(this).prop('checked'));
    });

    this.$('.rateit').rateit();   
   
};

Template.courses_full_list.rendered = function() {
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
	Meteor.call('getFeaturedCoursesWeb',userId,'global',0,grade_id,subject_id, function(error, result){
	    Session.set('courses_data',result);
	});
	this.$('.rateit').rateit();
}
Template.courses_full_list.helpers({
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
    $('#mask1').hide();
    return list_course;
    },
    'randomJoinedUsers': function() {
        var randomJoinedUsers=Math.floor(Math.random() * (3)) + 18;
        return randomJoinedUsers;
    },
    'comp_course': function() {
        var data  = Session.get('courses_data');
        var data1 = JSON.parse(data.content);
        var gradeId = data1.result_data.feature_courses[0]['list'][0]['GradeArr'][0]['id'];
        Meteor.call('CoursesMetaInfo', parseInt(gradeId), function (error, resultMeta) {
            Session.set('metaInfo',resultMeta);
        });
        var data2 = data1.result_data.feature_courses;
        var courses_array = [];
        for(var j=1;j<data2.length;j++){
            var list_course = data2[j].list    ;
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
//        joining_course.depend(); 
        if(param1 == param2){
            return false;
        }else{
            return true;
        }
    },
    'course_title': function () {
//      joining_course.depend(); 
        var data  = Session.get('courses_data');
        var data1 = JSON.parse(data.content);
        var title = data1.result_data.feature_courses[0].title;  
        return title;
    }
});


Template.courses_full_list.events({
    'click .course_pdp': function() {
        var myVar = this;
        console.log('course_data',myVar);
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
	Router.go('/'+slugData+'/tutorials/'+pckg_id);
    },
    'click #join_course_course_page': function() {
         
        var pckg_id = this.PsCourseId;
        ga('send', {
            hitType: 'event',
            eventCategory: 'course_join',
            eventAction: 'course_join_clicked',
            eventLabel: 'course',
            eventValue: pckg_id
          });
        var userId =  Session.get('landing_user_profile_id');

        Meteor.call('joinCourse',userId,'global',pckg_id, function(error, result){
            var data = JSON.parse(result.content);
            var status = data.status;
            if(status == 'true'){
                var msg="Course added successfully to My Courses.";
                toastr.success(msg);
                // Modal.show('courseJoinPopUp');
                var grade_id = Session.get('global_grade_id');
                var subject_id = Session.get('global_subject_id');
                userId = Session.get('landing_user_profile_id');
                Meteor.call('getFeaturedCoursesWeb',userId,'global',0,grade_id,subject_id, function(error, result){
                                Session.set('courses_data',result);
                });
                 ga('send', {
                        hitType: 'event',
                        eventCategory: 'course_join',
                        eventAction: 'course_joined_successfully',
                        eventLabel: 'course',
                        eventValue: pckg_id
                     });
            } else {
                Session.setTemp('join_course_clicked',1);
                Session.setTemp('join_package_id',pckg_id);
                Session.clear('join_course_is_test');
                Modal.show('sign_in');
                return;
            }
        }); 
    },
    'click #unjoin_course_course_page': function() {
        var pckg_id = this.PsCourseId;
        if(localStorage.getItem("userId")){
			Session.set('landing_user_profile_id',(localStorage.getItem("userId")));
        }
        var userId =  Session.get('landing_user_profile_id'); 
        Meteor.call('unjoinCourse',userId,'global',pckg_id, function(error, result){
            var data = JSON.parse(result.content);
            var status = data.status;
            if(status=='true'){
                var msg="Course removed successfully from My Courses.";
                toastr.success(msg);
                var grade_id = Session.get('global_grade_id');
                var subject_id = Session.get('global_subject_id');
                userId = Session.get('landing_user_profile_id');
                Meteor.call('getFeaturedCoursesWeb',userId,'global',0,grade_id,subject_id, function(error, result){
                                Session.set('courses_data',result);
                });
            } else { 
                var msg='Something went wrong';
                toastr.success(msg);
            }
        });
    }
});

Template.nav_course.events({
    'click #render_my_course': function() {
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
    'click #render_my_tests_from_course': function() {
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
    'click #render_my_purchases': function() {
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
	getCourseWall();
    },
    'click #test_page': function() {
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/tests/'+slugData);
    },
    'click #tutor_page': function() {
        Router.go('/tutors');
    },
    'click #test_page_disable': function (event) {
       Modal.show('no_tests');
    }
});
//my_course helpers and events
Template.my_course_list.helpers({
    'my_courses': function() {
        if(Session.get('my_courses')){
            var res = Session.get('my_courses');
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
    'check_empty': function() {
        var param1= Session.get('my_course_size');
        if(param1>0){
            return true;
        }else{
            return false;
        }
    }
});

Template.my_course_list.events({
    'click #unjoin_myCourse': function() {
        var pckg_id = this.PsCourseId;
        var userId =  Session.get('landing_user_profile_id'); 
        Meteor.call('unjoinCourse',userId,'global',pckg_id, function(error, result){
            var data = JSON.parse(result.content);
            var status = data.status;
            if(status=='true'){
            	var msg="Course removed from My Courses section.";
            	toastr.success(msg);
				Meteor.call('getMyCoursesListingWeb',userId,'global',0,false, function(error, result){
					var list = JSON.parse(result.content);
					Session.set('my_courses',list);
				});             
            } else {
                var msg="Something went wrong.";  
                toastr.success(msg);
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
	Router.go('/'+slugData+'/tutorials/'+pckg_id);
    }
});

Template.nav_my_course.events({
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

Template.nav_my_course.helpers({
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


Template.sticky_nav_my_course.events({
    "click #home_page": function (e){
	getCourseWall();
        //Router.go('/wall');     
    },
    "click #course_page": function (e){
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);
    },
    "click #course_page_disable": function (e){
        Modal.show('no_courses');
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
    'click #render_my_tests_from_my_course': function() {
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
    'click #render_my_purchases_course': function() {
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

Template.breadcrumb_my_courses.events({
    "click #course_home": function (e){
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

Template.breadcrumb_my_courses.helpers({
    'breadcrumb_my_course': function(){
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

Template.my_purchase_list.helpers({
    'my_purchases': function() {
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

Template.my_purchase_list.events({
    'click #join_course_course_page': function() {
        var pckg_id = this.PsCourseId;
        var userId =  Session.get('landing_user_profile_id');

        Meteor.call('joinCourse',userId,'global',pckg_id, function(error, result){
            var data = JSON.parse(result.content);
            var status = data.status;
            if(status == 'true'){
                var msg="Course added successfully to My Courses.";
                toastr.success(msg);
                // Modal.show('courseJoinPopUp');
                var grade_id = Session.get('global_grade_id');
                var subject_id = Session.get('global_subject_id');
                userId = Session.get('landing_user_profile_id');
                Meteor.call('getFeaturedCoursesWeb',userId,'global',0,grade_id,subject_id, function(error, result){
                        Session.set('courses_data',result);
                });
                
            }else{
                 Modal.show('sign_in');
                return;
                // Modal.show('courseUnJoinPopUp');
            }
        }); 
    },
    'click #unjoin_course_course_page': function() {
        var pckg_id = this.PsCourseId;  
        if(localStorage.getItem("userId")){
			Session.set('landing_user_profile_id',(localStorage.getItem("userId")));
        }
        var userId =  Session.get('landing_user_profile_id'); 
        Meteor.call('unjoinCourse',userId,'global',pckg_id, function(error, result){
            var data = JSON.parse(result.content);
            var status = data.status;
            if(status=='true'){
                var msg="Course removed successfully from My Courses.";
                toastr.success(msg);
            var grade_id = Session.get('global_grade_id');
            var subject_id = Session.get('global_subject_id');
            userId = Session.get('landing_user_profile_id');
            Meteor.call('getFeaturedCoursesWeb',userId,'global',0,grade_id,subject_id, function(error, result){
                    Session.set('courses_data',result);
            });    
                
            } else {
                var msg='Something went wrong';
                toastr.success(msg);
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
        console.log('asdfghjkljhgfds',this);
        var slugData = getcustomData(this.CourseName);
        Session.set('pckg_id',pckg_id);
        Session.set('course_data',myVar);
        if(this.isTestSeries==0){
            Router.go('/'+slugData+'/tutorials/'+pckg_id);
        }else{
            Router.go('/'+slugData+'/tests/'+pckg_id);
        }
    }
 });

Template.nav_my_purchase.events({
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
        Session.clear('global_flag_free');
        Session.clear('landing_user_profile_id');
        window.location.reload(true);
    }
    
});
Template.nav_my_purchase.helpers({
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

Template.sticky_nav_my_purchase.events({
    "click #home_page": function (e){
	getCourseWall();
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
    'click #render_my_tests_from_my_purchases': function() {
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
     'click #render_my_course_purchase': function() {
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
    
    }
});

Template.breadcrumb_my_purchases.events({
    "click #course_home": function (e){
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);
    }
    
});

Template.my_course.onCreated(function() {
	Blaze._allowJavascriptUrls();
        if(!(Session.get('my_courses')) || !(Session.get('my_course_size'))){
            if(Session.get('landing_user_profile_id')){
                var userId =  Session.get('landing_user_profile_id');
                Meteor.call('getMyCoursesListingWeb',userId,'global',0,false, function(error, result){
                    var list = JSON.parse(result.content);
                        Session.set('my_courses',list);
                        Session.set('my_course_size',(list.result_data.batch).length);
                    if((list.result_data.batch).length<0){
                        Modal.show('no_my_courses');
                    }
                });    
            }else{
                Modal.show('sign_in')
            }
        }
});

Template.my_course.rendered = function() {
    $(window).scrollTop(0);
    this.$('.rateit').rateit();
    Session.get('my_courses');
};

Template.my_purchases.rendered = function() {
    
	$(window).scrollTop(0);    
	this.$('.rateit').rateit();
};
Template.no_my_courses.events({
    "click #go_to_courses_my_course": function (e){
        Modal.hide('no_my_courses');
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);
    }
});

Template.no_my_purchases.events({
    "click #go_to_purchases_my_course": function (e){
        Modal.hide('no_my_purchases');
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);
    }
});

Template.rtbanner_course.events = {
    "click .free_trial_web_course": function (e) {
        e.preventDefault(); 
        ga('send', {
            hitType: 'event',
            eventCategory: 'free_trial',
            eventAction: 'free_trial_clicked',
            eventLabel: 'course_sticky_banner'
          });
        if(Session.get('landing_user_profile_id')){
            Session.set('global_free_subscription',true);
            Modal.show('congrats');
        }else{
            Session.set('coming_from_free_trial_other_page',1);
            Modal.show('sign_in');  
        } 
    },
    "click .subs_from_banner_course": function (e) {
        e.preventDefault();
         ga('send', {
            hitType: 'event',
            eventCategory: 'subscription',
            eventAction: 'subscription_clicked',
            eventLabel: 'course_sticky_banner'
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
Template.rtbanner_course.helpers({
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


Template.courseJoinPopUp.events({
    "click #proceedToMyCourses": function (e){
       Modal.hide('courseJoinPopUp');
       Router.go('/my_course');
    }
    
});

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-full-width",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "1000",
  "hideDuration": "1000",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

Template.studyoffline.events({
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

function getCourseWall(){
    var url_string = Session.get('courseName');
    var id = Session.get('global_grade_id');
    var slugData = getcustomData(url_string);
    Router.go('/'+slugData+'/'+id);
}

Template.my_purchases.onCreated(function() {
	Blaze._allowJavascriptUrls();
         if(Session.get('landing_user_profile_id')){
            var userId =  Session.get('landing_user_profile_id');
            Meteor.call('getMyCoursesListingWeb',userId,'global',0,true, function(error, result){
                var list = JSON.parse(result.content);
                     Session.set('my_purchases',list);
            });    
        } else {
            Modal.show('sign_in');
        }
        
});