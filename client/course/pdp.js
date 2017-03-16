Template.pdp.created = function () {
    Blaze._allowJavascriptUrls();
//    $('#mask1').show();
    Session.set('cart_items_subs_ids', 0);
    Session.set('cart_items_subs_ids', []);
    var pckg_id = Session.get('pckg_id');
    if(Session.get('search_package_id')){
        pckg_id = Session.get('search_package_id');
        Session.clear('search_package_id');
    }
    if(pckg_id){
     Meteor.call('hardwareDetailsWeb', pckg_id, function (error, result) {
            Session.set('hardwareDetails', result);
                if(((result.penDrive).length)>0){
                    var hardware_data =(result.penDrive[0].detail);
                    $('#pendrive_hardware_tab_li').addClass('active');
                    $('#pendrive_hardware').addClass('active');
                }else if(((result.sdCard).length)>0){
                    var hardware_data =(result.sdCard[0].detail);
                    $('#sdCard_hardware_tab_li').addClass('active');
                    $('#sdcard_hardware').addClass('active');
                }else if(((result.tablet).length)>0){
                    var hardware_data =(result.tablet[0].detail);
                    $('#tablet_hardware_tab_li').addClass('active');
                    $('#tablet_hardware').addClass('active');
                }
                var image = (result.sdCard[0].system_capacity);
                Session.set('hardware_data',hardware_data);
                Session.set('sd_card_image',image);
        });
    
    }
};
Template.courses_pdp.helpers({
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

Template.courses_pdp.events = {
    "click .sign-up": function (e) {
        e.preventDefault();
        Session.clear('coming_from_subscription_pricing');
    Session.clear('coming_from_subscription');
    Session.clear("coming_from_cart");
    Session.clear('coming_from_study_pdp');
    Session.clear('join_course_clicked');
        Modal.show('sign_up');
    },
    "click .sign-in": function (e) {
        e.preventDefault();
        Session.clear('coming_from_subscription_pricing');
    Session.clear('coming_from_subscription');
    Session.clear("coming_from_cart");
    Session.clear('coming_from_study_pdp');
    Session.clear('join_course_clicked');
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

Template.pdp_breadcrumb.helpers({
    'breadcrumb_value': function () {
        var result = Session.get('breadcrumb_name_course');
        return result;
    },
    'is_trending': function () {
        if (Session.get('coming_from_trending_course') == 1) {
            return true;
        }
    }
});

Template.pdp_breadcrumb.events({
    'click .pdp_to_home': function (event) {
	getPdpWall()
        //Router.go('/wall');
    },
    'click .pdp_to_course': function (event) {
        var slugData = getcustomData(Session.get('about_course_title'));
        Router.go('/courses/'+slugData);
    }
});
Template.sticky_header.helpers({
    'joinCourseVal': function () {
//        joining_course.depend();
        var result = Session.get('pdp_page');
        var is_joined = result[0].isJoined;
        Session.set('is_joined_course_pdp', is_joined);
        return Session.get('is_joined_course_pdp');
    },
    'isJoinedCourse': function (param1) {
//        joining_course.depend();
        if (param1) {
            return true;
        } else {
            return false;
        }
    },
    'is_content_partner': function () {
        if(Session.get('package_faculty_profile')){
            return true;
        }else{
            return false;
        }
    }
});

Template.sticky_header.events({
    'click #pdp_join': function (event) {
        var pckg_id = Session.get('pckg_id');
            ga('send', {
            hitType: 'event',
            eventCategory: 'course_join',
            eventAction: 'course_join_clicked',
            eventLabel: 'course_pdp',
            eventValue: pckg_id
          });
        var userId = Session.get('landing_user_profile_id');
        Meteor.call('joinCourse', userId, 'global', pckg_id, function (error, result) {
            var data = JSON.parse(result.content);
            var status = data.status;
            if (status == 'true') {
                var msg = "Course added to My Courses section (Under Course Tab) on the left. Access Join courses and download them via our PC app from My Courses.";
                toastr.success(msg);
                var pckg_id = Session.get('pckg_id');
                Meteor.call('mainPdpPage', pckg_id,userId, function (error, result) {
                    Session.set('pdp_page', result);
                    console.log('mainPdpPage',result);
                    var is_joined = result[0].isJoined;
                    Session.set('is_joined_course_pdp', is_joined);
                })
                 ga('send', {
                        hitType: 'event',
                        eventCategory: 'course_join',
                        eventAction: 'course_joined_successfully',
                        eventLabel: 'course_pdp',
                        eventValue: pckg_id
                     });
                
            } else {
                Session.clear('join_course_is_test');
                Session.setTemp('join_course_clicked',1);
                Session.setTemp('join_package_id',Session.get('pckg_id'));
                Modal.show('sign_in');
                return;
            }
        });
    },
    'click #pdp_unjoin': function () {
        var pckg_id = Session.get('pckg_id');
        var userId = Session.get('landing_user_profile_id');
        Meteor.call('unjoinCourse', userId, 'global', pckg_id, function (error, result) {
            var data = JSON.parse(result.content);
            var status = data.status;
            if (status == 'true') {
                var msg = "Course removed from My Courses section.";
                toastr.success(msg);
                Meteor.call('mainPdpPage', pckg_id,userId, function (error, result) {
                    Session.set('pdp_page', result);
                    var is_joined = result[0].isJoined;
                    Session.set('is_joined_course_pdp', is_joined);
                })
            } else {
                var msg = 'Something went wrong';
                toastr.success(msg);
            }
        });
    }
});

Template.pdp.rendered = function () {
        $(window).scrollTop(0);
//        $('#mask1').show();
    Session.get('breadcrumb_name_course');
    Session.get('coming_from_trending_course');
    Session.setTemp('onPDPpage',1);
    var pckg_id = Session.get('pckg_id');
    if(Session.get('search_package_id')){
        pckg_id = Session.get('search_package_id');
        Session.clear('search_package_id');
    }
    var packageArr = [];
    var grade_id = '';
    var userId = Session.get('landing_user_profile_id');
    if(!userId){
        userId=1;
    }
    if (pckg_id) {
        Meteor.call('mainPdpPage', pckg_id,userId, function (error, result) {
            Session.set('metaInfo',result[0]);
            Session.set('pdp_page', result);
            var subjectId = result[0].subjects[0].id;
            var userId = Session.get('landing_user_profile_id');
            if (Session.get('global_grade_id')) {
                grade_id = Session.get('global_grade_id');
            } else {
                if (localStorage.getItem("course")) {
                    grade_id = (localStorage.getItem("course"));
                }
            }

            if(Session.get('search_grade_id')){
                grade_id = Session.get('search_grade_id');
                Session.clear('search_grade_id');
            }

            var token = 'global';
            var isTestSeries = 0;
            var pckg_id = result[0].PsCourseId;
            Meteor.call('suggestedCoursesTocListingWeb', userId, token, grade_id, subjectId, isTestSeries, pckg_id, function (error, result) {
                Session.setTemp('TocListingWeb', result);
            });
        });

//        Meteor.call('hardwareDetailsWeb', pckg_id, function (error, result) {
//            Session.set('hardwareDetails', result);
//                if(((result.penDrive).length)>0){
//                    var hardware_data =(result.penDrive[0].detail);
//                    alert('penD');
//                    $('#pendrive_hardware_tab_li').addClass('active');
//                    $('#pendrive_hardware').addClass('active');
//                }else if(((result.sdCard).length)>0){
//                    var hardware_data =(result.sdCard[0].detail);
//                    alert('sdCard');
//                    $('#sdCard_hardware_tab_li').addClass('active');
//                    $('#sdcard_hardware').addClass('active');
//                }else if(((result.tablet).length)>0){
//                    var hardware_data =(result.tablet[0].detail);
//                    alert('tab');
//                    $('#tablet_hardware_tab_li').addClass('active');
//                    $('#tablet_hardware').addClass('active');
//                }
//                var image = (result.sdCard[0].system_capacity);
//                Session.set('hardware_data',hardware_data);
//                Session.set('sd_card_image',image);
//        });
    }

    this.$('.rateit').rateit();
    var hardware = Session.get('hardwareDetails');
}

Template.pdp_head.helpers({
    'header_value': function () {
        var result = Session.get('pdp_page');
        $('#mask1').hide();
        return result;
    },
    'randomJoinedUsers': function() {
        var randomJoinedUsers=Math.floor(Math.random() * (3)) + 18;
        return randomJoinedUsers;
    },
    'allPublishers': function () {
        var result = Session.get('pdp_page');
        var publisher='';
        for(var i=0;i<(result[0].publisher).length;i++){
            publisher = publisher + result[0].publisher[i].name+', ';
        }
        publisher = publisher.replace(/,\s*$/, "");
        return publisher;
    }
});

Template.pdp_publisher.helpers({
    'course_desc': function () {
        var result = Session.get('pdp_page');
        if (result) {
        	var description = {
                "long_desc":result[0].desc,
                "short_desc":result[0].description
            }
            return description;
        }
    }
});

Template.pdp_assets.helpers({
    'course_assets': function () {
        var result = Session.get('pdp_page');
        if (result) {
            return result[0];
        }
    }
});

Template.pdp_hardware.helpers({
    'pdp_hardware': function () {
        var hardware = Session.get('hardwareDetails');
        return hardware;
    },
    'isType': function (param1, param2) {
        return param1 === param2;
    },
    is_subscribed: function () {
        if (Session.get('global_flag_free') == true) {
            return false;
        } else {
            return true;
        }
    },
    is_price_changed_pend: function () {
        if (Session.get('change_hardware_price_pend')) {
            return true;
        } else {
            return false;
        }
    },
    is_price_changed_sd: function () {
        if (Session.get('change_hardware_price_sd')) {
            return true;
        } else {
            return false;
        }
    },
    is_price_changed_tab: function () {
        if (Session.get('change_hardware_price_tab')) {
            return true;
        } else {
            return false;
        }
    },
    price_changed_value_pend: function () {
        if (Session.get('change_hardware_price_pend')) {
            return Session.get('change_hardware_price_pend');
        }
    },
    price_changed_value_sd: function () {
        if (Session.get('change_hardware_price_sd')) {
            return Session.get('change_hardware_price_sd');
        }
    },
    price_changed_value_tab: function () {
        if (Session.get('change_hardware_price_tab')) {
            return Session.get('change_hardware_price_tab');
        }
    },
    is_price_zero: function (param1,param2) {
        if(param1 == param2){
            return true;
        }else{
            return false;
        }
    },
    validity_value: function () {
        if (Session.get('change_validity')) {
            return Session.get('change_validity');
        }
    },
    sd_image: function () {
        var capacity = Session.get('sd_card_image');
        return capacity;
    },
    compare_size: function (param) {
        if(param==2){
            return "/images/pdp-sd-2.png"
        }else if(param==4){
            return "/images/pdp-sd-4.png"
        }else if(param==8){
            return "/images/pdp-sd-8.png"
        }else if(param==16){
            return "/images/pdp-sd-16.png"
        }else if(param==32){
            return "/images/pdp-sd-32.png"
        }else if(param==48){
            return "/images/pdp-sd-48.png"
        }else if(param==64){
            return "/images/pdp-sd-64.png"
        }
    }
});

Template.toc.helpers({
    'toc_list': function () {
        var result = Session.get('TocListingWeb');
        var data1 = JSON.parse(result.content);
        $('#mask1').hide();
        if (data1.status == true) {
            var data2 = data1.result_data.chapters;
            return data2;
        }
    },
    'isType': function (param1, param2) {
        if (param1 == param2) {
            return param1 == param2;
        }
    },
    'isFreeTrial': function () {
        if (Session.get('global_flag_free') == true) {
            return true;
        }
    },
    'isCompCourse': function () {
        var result = Session.get('pdp_page');
        if(result[0].subjects.length>1){
            return true;
        }else{
            return false;
        }

    },
    'getSubjectList': function () {
        var result = Session.get('pdp_page');
        return result[0].subjects;
    }
});

//Template.free_contents.helpers({
//    'toc_free_list': function () {
//        var result = Session.get('TocListingWeb');
//        var data1 = JSON.parse(result.content);
//        var free_chapters_arr = [];
//
//        if (data1.status == true) {
//            var data2 = data1.result_data.chapters;
//            for (var i = 0; i < data2.length; i++) {
//                if (data2[i].isPaid == false) {
//                    free_chapters_arr.push(data2[i]);
//                }
//            }
//            var return_data = {
//                "data_length": free_chapters_arr.length,
//                "free_chapters_arr": free_chapters_arr
//            };
//            return return_data;
//        }
//    },
//    'isFree': function (param1, param2) {
//        if (param1 > param2) {
//            return true;
//        }
//    }
//});

Template.free_contents.events({
    'click #pdp_free_content_tag': function (event) {
        var data = this;
        var pckg_id = data.packageId;
        window.location.hash = '#ch_' + pckg_id;
    }
});

Template.toc.events({
    'click .toc_chapter_read': function (event) {
        $('#mask1').show();
        var chapterId = this.id;
            var information_chapter = this;
            Session.set('chapter_name', information_chapter.heading);
            var grade_id = '';
            var userId = Session.get('landing_user_profile_id');
            if (Session.get('global_grade_id')) {
                grade_id = Session.get('global_grade_id');
            } else {
                if (localStorage.getItem("course")) {
                    grade_id = (localStorage.getItem("course"));
                }
            }
            if (!userId) {
                userId = 1;
            }
            var isTestSeries = 0;
            var token = 'global';
            
        if(Session.get('landing_user_profile_id')>1){
            Meteor.call('getPackageChapterWeb', parseInt(userId), token, parseInt(chapterId), isTestSeries, parseInt(grade_id), function (error, result) {
                Session.set('chapter_content_list', result);
                var slugData = getcustomData(Session.get('about_course_title'));
                Router.go('/'+slugData+'/chapter_content');
            });
        }else{
            $('#mask1').hide();
            Session.setTemp('coming_from_study_pdp',1);
            Session.setTemp('study_pdp_guest',{"userId" :parseInt(userId) ,'chapterId':parseInt(chapterId),'token':token,'isTestSeries':isTestSeries,'grade_id':parseInt(grade_id) });
            Modal.show('sign_in');
        }
    },
    "click .toc_chapter_unlock": function (e) {
        e.preventDefault();
        Session.set('unlock_data', this);
        Modal.show('unlock_popup');
    },
    'change #select_subject_pdp': function (e) {
        e.preventDefault();
        var subject_id = $(e.target).val();
        var pckg_id = Session.get('pckg_id');
        var token = 'global';
        var grade_id = Session.get('global_grade_id');
        var userId = Session.get('landing_user_profile_id');
        Meteor.call('suggestedCoursesTocListingWeb', userId, token, grade_id, subject_id, 0, pckg_id, function (error, result) {
            Session.setTemp('TocListingWeb', result);
        });
    }
});

Template.unlock_popup.helpers({
    'unlock_chapters': function () {
        var result = Session.get('unlock_data');
        return result;

    },
    'discount_percent': function () {
        var result = Session.get('unlock_data');
        if (result) {
            var percentage = Math.round(((result.price - result.discountedPrice) / (result.price)) * 100);
            return percentage;
        }
    },
    'course_name_pdp_page': function () {
        var result = Session.get('pdp_page');
        var course_name = result[0].CourseName;
        if (course_name) {
            return course_name;
        }
    }
});


Template.unlock_popup.events({
    'click .addtocart': function (event) {
        event.preventDefault();
        Modal.hide('unlock_popup');
        var unlock_data = Session.get('unlock_data');
        var userId = Session.get('landing_user_profile_id');

        var token = 'global';//Session.get('token');
        var dataFrom = 'tdl';
        var type = 'chapter';
        var packageId = unlock_data.packageId;
        var packageSubscriptionId = unlock_data.packageSubscriptionId;
        if (userId) {
            Meteor.call('add_to_cart', dataFrom, type, parseInt(userId), parseInt(packageId), token, parseInt(packageSubscriptionId), function (error, result) {
                var resultContent = JSON.parse(result.content);
                if (resultContent) {
                    if (resultContent.status) {
                        Meteor.call('lists_cart', userId, function (error, result) {
                            var contentdata = JSON.parse(result.content);
                            if (contentdata.result_data) {
                                Session.set('cartList', contentdata.result_data);
                            } else {
                                Session.set('cartList', undefined);
                                Session.set('no_items_in_cart', undefined);
                            }
                        });
                    }
                    toastr.success(resultContent.message);
                    $(".buynowsubs").html('<p>' + resultContent.message + '</p>');
                }
            });
        } else {
            Modal.hide('unlock_popup');
            Session.setTemp("coming_from_cart",1);
            Session.setTemp("add_to_cart_by_guest", {'token':token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now':false });
            Modal.show('sign_in');
        }
    },
    'click .buynowbtn': function (event) {
        event.preventDefault();
        Modal.hide('unlock_popup');
        var inCartSubscriptionId = Session.get('cart_items_subs_ids');
        var unlock_data = Session.get('unlock_data');
        var userId = Session.get('landing_user_profile_id');

        var token = 'global';//Session.get('token');
        var dataFrom = 'tdl';
        var type = 'chapter';
        var packageId = unlock_data.packageId;
        var packageSubscriptionId = unlock_data.packageSubscriptionId;
          unlock_data['hardware_type']='Online';
          unlock_data['package_type']= type;
        Session.set('express_checkout_data', unlock_data);
        if (userId) {
            Router.go('/express_checkout/go');
        } else {
            Session.setTemp("coming_from_cart",1);
            Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now':true });
            Modal.hide('unlock_popup');
            Modal.show('sign_in');
        }
    },

    'click #subscribe_from_cart_pop': function (event) {
        event.preventDefault();
        Modal.hide('unlock_popup');
        if(Session.get('landing_user_profile_id')){
            Modal.hide('unlock_popup');
            Router.go('/subscription/plan');
        }else{
            Session.set('coming_from_subscription',1);
            Modal.show('sign_in');
        }
    }
});

Template.pdp_hardware.events({
    'click .duration_change_pend': function (event) {
        event.preventDefault();
        var element = this;
        var hardware_price = this.subscription_cost;
        var discounted_hardware_price = this.discounted_cost;
        var duration = this.duration;
        var sub_id = this.sub_id;
        var price = {
            "hardware_price": hardware_price,
            "discounted_hardware_price": discounted_hardware_price,
            "sub_id": sub_id,
            "duration": duration
        }
        Session.setTemp('change_hardware_price_pend', price);
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
    },
    'click .duration_change_sd': function (event) {
        event.preventDefault();
        var element = this;
        var hardware_price = this.subscription_cost;
        var discounted_hardware_price = this.discounted_cost;
         var sub_id = this.sub_id;
        var price = {
            "hardware_price": hardware_price,
            "discounted_hardware_price": discounted_hardware_price,
            "sub_id":sub_id
        }
        Session.setTemp('change_hardware_price_sd', price);
    },
    'change #hardware_tablet_name': function (evt) {
        var price_info = $(evt.target).val();
        var vH = price_info.split('__');
        var duration = vH[0];
        var discount = vH[1];
        var cost = vH[2];
        var sub_id= vH[3];
        var media_info = vH[4];
        var title = vH[5];
        Session.setTemp('change_validity',duration);
        var price = {
            "hardware_price": cost,
            "discounted_hardware_price": discount,
            "sub_id":sub_id,
            "media_info":media_info,
            "title":title
        }
        Session.setTemp('change_hardware_price_tab', price);
    },
    'click .addtocartbtn': function (event) {
        event.preventDefault();
        var unlock_data = $(event.target).val();
        var inCartSubscriptionId = Session.get('cart_items_subs_ids');
        var userId = Session.get('landing_user_profile_id');
        var token = 'global'; //Session.get('token');
        var dataFrom = 'tdl';
        var type = 'package';
        var packageId = Session.get('pckg_id');
        var packageSubscriptionId = unlock_data;

        if (userId) {
            Meteor.call('add_to_cart', dataFrom, type, parseInt(userId), parseInt(packageId), token, parseInt(packageSubscriptionId), function (error, result) {
                var resultContent = JSON.parse(result.content);
                if (resultContent) {
                    if (resultContent.status) {
                        var no_items_in_cart = Session.get('no_items_in_cart');
                        Meteor.call('lists_cart', userId, function (error, result) {
                            var contentdata = JSON.parse(result.content);
                            if (contentdata.result_data) {
                                Session.set('cartList', contentdata.result_data);
                            } else {
                                Session.set('cartList', undefined);
                                Session.set('no_items_in_cart', undefined);
                            }
                        });
                        toastr.success(resultContent.message,'success');
                        Session.set('cart_items_subs_ids', inCartSubscriptionId);
                    } else {
						toastr.warning(resultContent.message);
                    }
                    $(event.target).text('ADDED TO CART');
                    $(event.target).removeClass('addtocartbtn');
                }
            });
        } else {
            Session.setTemp("coming_from_cart",1);
            Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now':false });
            Modal.show('sign_in');
        }

    },
    'click #submit_pendrive': function (event) {
        event.preventDefault();
        var unlock_data = $(event.target).val();
        var hardware_data = unlock_data.split('__');
        // var inCartSubscriptionId = Session.get('cart_items_subs_ids');
        var packageSubscriptionId = hardware_data[0];
        var hardware_price = hardware_data[1];
        var discounted_hardware_price = hardware_data[2];
        var title= hardware_data[3];

        var hwtitle=$('#hardware_navigation li.active a').html();
        var userId = Session.get('landing_user_profile_id');
        var token = 'global'; //Session.get('token');
        var dataFrom = 'tdl';
        var type = 'package';
        var packageId = Session.get('pckg_id');
        var hardware_purchase_info = {
            "discountedPrice": discounted_hardware_price,
            "hardware_type": hwtitle,
            "heading":title,
            "packageId":packageId,
            "packageSubscriptionId":packageSubscriptionId,
            "price":hardware_price,
            "package_type" :type
        };
        Session.set('express_checkout_data', hardware_purchase_info);
        if (userId) {
            Router.go('/express_checkout/go');
        } else {
            Session.setTemp("coming_from_cart",1);
            Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now':true });
            Modal.hide('unlock_popup');
            Modal.show('sign_in');
        }
    },
    'click .freetrialbtn': function (e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'free_trial',
            eventAction: 'free_trial_clicked',
            eventLabel: 'course_pdp_banner'
          });
       if(Session.get('landing_user_profile_id')){
           Session.set('global_free_subscription',true);
           Modal.show('congrats');
       }else{
           Session.set('coming_from_free_trial_other_page',1);
           Modal.show('sign_in');
       }
    },
    'click #subscribe_from_pdp': function (e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'subscription',
            eventAction: 'subscription_clicked',
            eventLabel: 'course_pdp_banner'
          });
        if(Session.get('landing_user_profile_id')){
            Router.go('/subscription/plan');
        }else{
            Session.set('coming_from_subscription',1);
            Modal.show('sign_in');
        }
    },
    'click #pendrive_hardware_tab': function (e) {
        e.preventDefault();
        var hardware = Session.get('hardwareDetails');
        var hardware_data =(hardware.penDrive[0].detail);
        Session.setTemp('hardware_data',hardware_data);
    },
    'click #sdCard_hardware_tab': function (e) {
        e.preventDefault();
        var hardware = Session.get('hardwareDetails');
        var hardware_data =(hardware.sdCard[0].detail);
        var image = (hardware.sdCard[0].system_capacity);
        Session.setTemp('hardware_data',hardware_data);
        Session.setTemp('sd_card_image',image);
    },
    'click #tablet_hardware_tab': function (e) {
        e.preventDefault();
        var hardware = Session.get('hardwareDetails');
        var hardware_data =(hardware.tablet[0].detail);
        Session.setTemp('hardware_data',hardware_data);
    }

});

Template.hardware.helpers({
    'hardware_specification': function () {
        var hArr = [];
            hArr.push(Session.get('hardware_data')['33']);
            hArr.push(Session.get('hardware_data')['39']);
            hArr.push(Session.get('hardware_data')['42']);
            hArr.push(Session.get('hardware_data')['1']);
            hArr.push(Session.get('hardware_data')['3']);
            hArr.push(Session.get('hardware_data')['5']);
            hArr.push(Session.get('hardware_data')['7']);
            hArr.push(Session.get('hardware_data')['10']);
            hArr.push(Session.get('hardware_data')['12']);
            hArr.push(Session.get('hardware_data')['16']);
            hArr.push(Session.get('hardware_data')['20']);
            hArr.push(Session.get('hardware_data')['28']);
            hArr.push(Session.get('hardware_data')['31']);
            hArr.push(Session.get('hardware_data')['44']);
        var newhArr = [];
        $.each(hArr,function(i,val){
            if(typeof val !='undefined'){
                var html ='';
                    html += '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="table no-margin-bottom">';
                    html += '<tbody>';
                $.each(val['detail'],function(index,value){
                    html += '<tr><td class="greybg" style="text-align:left" width="30%">'+index+'</td><td style="text-align:left" width="70%">'+value+'</td></tr>';
                });
                html += '</tbody>';
                html += '</table>';
                hArr[i]['ht'] = html;
                html = '';
                newhArr.push(hArr[i]);
            }
        });

        return newhArr;
    }
});

Template.package_faculty_profiles_div.rendered = function() {
    var package_id = Session.get('pckg_id');
    try{
        Meteor.call('packageFacultyProfilesData', package_id , function (error, result) {
            var packageFacultyProfiles =  result.content;
            packageFacultyProfiles = JSON.parse(packageFacultyProfiles);
            var packageFacultyProfilesExists = packageFacultyProfiles.result_data;
            if(packageFacultyProfiles.status){
                Session.set('package_faculty_profile',packageFacultyProfilesExists);
            }else{
                Session.set('package_faculty_profile',false);
            }
        });
    } catch (e) {
        console.log(e);
    }
};

Template.package_faculty_profiles_div.helpers({
    'faculty_data': function() {
        var fData = Session.get('package_faculty_profile');
        if(fData){
	    return fData;
        }else{
            return false;
        }
    },
    'decode_desc_data': function(fdesc) {
       if(fData){
		   return  newVal = fData.txt();
	   }
     }
});

function getPdpWall(){
    var url_string = Session.get('courseName');
    var id = Session.get('global_grade_id');
    var slugData = getcustomData(url_string);
    Router.go('/'+slugData+'/'+id);
}
