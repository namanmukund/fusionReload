Template.wall.onCreated(function () {
    Blaze._allowJavascriptUrls();
});

Template.trending_courses.rendered = function () {
    if (localStorage.getItem("category")) {
        Session.set('courseIdCache', (localStorage.getItem("course")));
        Session.set('selectedSubjectsCache', (localStorage.getItem("subjectIDS")));

        Session.set('categoryNameCache', (localStorage.getItem("categoryName")));
        Session.set('subCategoryNameCache', (localStorage.getItem("subCategoryName")));
        Session.set('courseNameCache', (localStorage.getItem("courseName")));
    }
    var userId = Session.get('landing_user_profile_id');
    var grade_id = '';
    var subject_id = '';
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
        userId = 1;
    }

    Meteor.call('displayTrendingCoursesOnWeb', grade_id, subject_id, 3, userId, function (error, result) {
        Session.set('trendingCourseDetail', result);
    });
    this.$('.rateit').rateit();
}

Template.trending_courses.helpers({
    'comp_course': function () {
        var list_course = Session.get('trendingCourseDetail');


        if (list_course) {
            for (var k = 0; k < list_course.length; k++) {
                if (list_course[k]) {
                    var min_sd_price = 100000;
                    var min_usb_price = 100000;
                    var min_tab_price = 100000;
                    if (list_course[k].price_info) {
                        var price_info = list_course[k].price_info;

                        for (var i = 0; i < price_info.length; i++) {
                            if (price_info[i].hw_type == 1) {
                                if (price_info[i].price < min_usb_price)
                                    min_usb_price = price_info[i].price;
                            }
                            if (price_info[i].hw_type == 4) {
                                if (price_info[i].price < min_sd_price)
                                    min_sd_price = price_info[i].price;
                            }
                            if (price_info[i].hw_type == 2) {
                                if (price_info[i].price < min_tab_price)
                                    min_tab_price = price_info[i].price;
                            }

                        }
                    }
                    if (min_usb_price == 100000) {
                        min_usb_price = 0;
                    }
                    if (min_sd_price == 100000) {
                        min_sd_price = 0;
                    }
                    if (min_tab_price == 100000) {
                        min_tab_price = 0;
                    }
                    var min_usb = {"min_usb_price": min_usb_price};
                    var min_sd = {"min_sd_price": min_sd_price};
                    var min_tab = {"min_tab_price": min_tab_price};

                    (list_course[k].price_info).push(min_usb);
                    (list_course[k].price_info).push(min_sd);
                    (list_course[k].price_info).push(min_tab);
                }
            }
        }
        return list_course;
    },
    'isRating': function (param1, param2) {
        return param1 === param2;
    },
    'randomJoinedUsers': function () {
        var randomJoinedUsers = Math.floor(Math.random() * (3)) + 18;
        return randomJoinedUsers;
    },
    'isType': function (param1, param2) {
        return param1 === param2;
    },
    'isJoinedCourse': function (param1, param2) {
//        joining_course.depend();
        if (param1 == param2) {
            return false;
        } else {
            return true;
        }
    },
    'isCourse': function (param1,param2) {
       if(param1==param2){
           return true;
       }
       return false;
    },
    'getCourseCount': function () {
      if(Session.get('courseCount')){
        return Session.get('courseCount');
      }else{
        return 0;
      }
    },
    'getTestCount': function () {
        if(Session.get('testCount')){
          return Session.get('testCount');
        }else{
          return 0;
        }
    }
});

Template.trending_courses.events({
    'click .course_pdp': function () {
        ga('send', {
            hitType: 'event',
            eventCategory: 'top_trending_clicked',
            eventAction: 'trending_on_wall',
            eventLabel: 'trending_course_clicked_from_wall'
          });
        var myVar = this;
        var breadcrumb_name_course;
        Session.setTemp('coming_from_trending_course', 1);
        if ((this.subjects).length > 1) {
            breadcrumb_name_course = this.GradeArr[0].name;
            Session.set('breadcrumb_name_course', breadcrumb_name_course);
        } else {
            breadcrumb_name_course = this.subjects[0].name;
            Session.set('breadcrumb_name_course', breadcrumb_name_course);
        }

        var pckg_id = this.PsCourseId;
        var slugData = getcustomData(this.CourseName);
        Session.set('pckg_id', pckg_id);
        Session.set('course_data', myVar);
        if(this.is_test_series==0){
            Router.go('/'+slugData+'/tutorials/'+pckg_id);
            //Router.go('/course_pdp');
        }else if(this.is_test_series==1){
            Router.go('/'+slugData+'/tests/'+pckg_id);
            //Router.go('/test_pdp');
        }
    },
    'click #join_course_trending_course': function () {
        var pckg_id = this.PsCourseId;
        Session.clear('join_course_is_test');
            if(this.is_test_series==1){
                Session.setTemp('join_course_is_test',1);
            }
        if (Session.get('landing_user_profile_id') > 1) {
            ga('send', {
            hitType: 'event',
            eventCategory: 'course_join',
            eventAction: 'course_join_clicked',
            eventLabel: 'top_trending',
            eventValue: pckg_id
          });
            var userId = Session.get('landing_user_profile_id');

            Meteor.call('joinCourse', userId, 'global', pckg_id, function (error, result) {
                var data = JSON.parse(result.content);
                var status = data.status;
                if (status == 'true') {
                    var msg="Course added successfully to My Courses.";
                    toastr.success(msg);
                    var grade_id = Session.get('global_grade_id');
                    var subject_id = Session.get('global_subject_id');
                    Meteor.call('displayTrendingCourses', grade_id, subject_id, 3, userId, function (error, result) {
                        Session.set('trendingCourseDetail', result);
                    });
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'course_join',
                        eventAction: 'course_joined_successfully',
                        eventLabel: 'top_trending',
                        eventValue: pckg_id
                     });
                } else {
                    var msg="Something went wrong.";
                    toastr.success(msg);
                }
            });
        } else {
            Modal.show('sign_in');
            Session.set('coming_from_trending_course', 1);
            Session.setTemp('join_course_clicked',1);
            Session.setTemp('join_package_id',pckg_id);
            return;
        }
       
    },
    'click #unjoin_course_trending_course': function () {
        var pckg_id = this.PsCourseId;
        var userId = Session.get('landing_user_profile_id');
        Meteor.call('unjoinCourse', userId, 'global', pckg_id, function (error, result) {
            var data = JSON.parse(result.content);
            var status = data.status;
            if (status == 'true') {
                var msg="Course removed successfully from My Courses.";
                toastr.success(msg);
                var grade_id = Session.get('global_grade_id');
                var subject_id = Session.get('global_subject_id');
                Meteor.call('displayTrendingCourses', grade_id, subject_id, 3, userId, function (error, result) {
                    Session.set('trendingCourseDetail', result);
                });
            } else {
                var msg="Something went wrong.";
                toastr.success(msg);
            }
        });
    },
    'click #seemorecourse': function () {
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);

    },
    'click #seemoretest': function () {
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/tests/'+slugData);

    }
});


