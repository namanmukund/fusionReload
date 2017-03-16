/*********************************************************User registration************************************************************/
/*
 Template.navigation_user_wall.helpers({
 'user_name': function(){
 var user_name = Session.get('user_name');
 if(user_name){
 return user_name;
 }
 }
 });
 */
Meteor.startup(function () {
    // console.log("meteor started");
    var url = location.hostname;
    if (url == 'iprofindia.com') {
        location.hostname = 'www.iprofindia.com';
    }




//    else if(url =='localhost'){
//        location.hostname = 'www.localhost';
//    }
// console.log("start time startup",new Date());
    window.setTimeout(function () {
        var guest = Session.get('landing_user_profile_id');
        var prompt = Session.get("prompt");
        console.log("prompt", prompt);

        if (prompt == undefined && guest == undefined && !($('#signup').hasClass('in')) && !($('#signin').hasClass('in'))) {

            Modal.show('sign_up');
            Session.set("prompt", "1");

        }

//You can add more APIs on this line

    }, 45000);



    $(window).on('mouseover', (function () {
        window.onbeforeunload = null;
    }));
    $(window).on('mouseout', (function () {
        window.onbeforeunload = ConfirmLeave;
    }));
    function ConfirmLeave() {
        Session.clear("prompt");
    }
    var prevKey = "";
    $(document).keydown(function (e) {
        if (e.key == "F5") {
            window.onbeforeunload = ConfirmLeave;
        }
        else if (e.key.toUpperCase() == "W" && prevKey == "CONTROL") {
            window.onbeforeunload = ConfirmLeave;
        }
        else if (e.key.toUpperCase() == "R" && prevKey == "CONTROL") {
            window.onbeforeunload = ConfirmLeave;
        }
        else if (e.key.toUpperCase() == "F4" && (prevKey == "ALT" || prevKey == "CONTROL")) {
            window.onbeforeunload = ConfirmLeave;
        }
        prevKey = e.key.toUpperCase();
    });

    var connectHandler = WebApp.connectHandlers;
    connectHandler.use(function (req, res, next) {
        res.setHeader('Strict-Transport-Security', 'max-age=2592000; includeSubDomains'); // 2592000s / 30 days
        return next();
    })







});


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId) {
    Meteor.call('add_to_cart', dataFrom, type, parseInt(userId), parseInt(packageId), token, parseInt(packageSubscriptionId), function (error, result) {
        var resultContent = JSON.parse(result.content);
        if (resultContent) {
            if (resultContent.status) {
                var no_items_in_cart = Session.get('no_items_in_cart');
                Meteor.call('lists_cart', userId, function (error, result) {
                    var contentdata = JSON.parse(result.content);
                    console.log('debug begin');
                    console.log(contentdata);
                    console.log('debug end');
                    if (contentdata.result_data) {
                        Session.set('cartList', contentdata.result_data);
                    } else {
                        Session.set('cartList', undefined);
                        Session.set('no_items_in_cart', undefined);
                    }
                });
                toastr.success(resultContent.message, 'success');
                Session.set('cart_items_subs_ids', inCartSubscriptionId);
            } else {
                toastr.warning(resultContent.message);
            }
        }
    });
}


JWPlayer.load('HrmCsKJB');

Modal.allowMultiple = true;
Meteor.subscribe("userData");

Template.landing.onCreated(function () {
    Blaze._allowJavascriptUrls();
    if (Session.get('courseName')) {
        var url_string = Session.get('courseName');
        var id = Session.get('global_grade_id');
        var slugData = url_string.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
        slugData = (slugData).replace('--', "-").toLowerCase();
        slugData = (slugData).replace("---", "-").toLowerCase();
        setTimeout(function () {
            if (slugData == 'iit-jee-advanced') {
                Router.go('/iit-jee/' + id);
            } else {
                Router.go('/' + slugData + '/' + id);
            }
        }, 1000);
    }
    if (localStorage.getItem("userId")) {
        Session.set('landing_user_profile_id', (localStorage.getItem("userId")));
    }
});


//Session.set('landing_user_profile',0);

Template.navigation.helpers({
    login_check: function () {
        var data = Session.get('landing_user_profile_id');
        console.log('login_check_outside', data);
        if (!data) {
            return true;
        } else {
            return false;
        }
    }
});



function cacheData(cache_name, data) {
    if (typeof (Storage) !== "undefined")
    {
//                Session.set('categoryName', categoryName);
        // Store
        localStorage.setItem("cache_name", Session.get('data'));
    }
    else
    {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}






function displayPosition(position) {
    result_loc = {
        "latitude": position.coords.latitude,
        "longitude": position.coords.longitude
    };
    var val = Session.get('email_id');
    if (val && result_loc.latitude && result_loc.longitude) {
        console.log('val', val);
        console.log('latitude', result_loc.latitude);
        console.log('longitude', result_loc.longitude);
        Meteor.call('getLocation', val, result_loc.latitude, result_loc.longitude, function (error, result) {
        });
    }
}

function displayError(error) {
    var errors = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout'
    };
}

Template.sign_up.events({
    'submit form': function (event) {
        event.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'sign_up',
            eventAction: 'sign_up_submitted',
            eventLabel: 'landing page'
        });
        $('#mask1').show();
        if (!($("#inlineCheckbox11").is(":checked"))) {
            $('#mask1').hide();
            var mssg = 'Please agree to the Terms & Conditions';
            toastr.warning(mssg);
            return false;
        }
        var email = $('[name=email_id]').val();
        if (!validateEmail(email)) {
            $('#mask1').hide();
            toastr.warning('Invalid email id');
            return false;
        }
        Session.set('email_id', email);
        var password = $('[name=user_password]').val();
        var user_name = $('[name=user_name]').val();
        var mobile_no = $('[name=mobile_no]').val();
        var first_digit = mobile_no.match(/\d/);
        if (first_digit == 1 || first_digit == 2 || first_digit == 3 || first_digit == 4 || first_digit == 5 || first_digit == 6 || first_digit == 0) {
            $('#mask1').hide();
            toastr.warning('Invalid mobile number');
            return false;
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                    displayPosition,
                    displayError
                    );
        }
        Meteor.call('web_user_register', user_name, email, password, mobile_no, function (error, result) {
            //Session.set('myMethodResult', result);
//            console.log('user_value',result);

            console.log('result_register', result);
            if (result == 3) {
//                    alert('User already exists');
                $('#mask1').hide();
                toastr.warning('User with same Email Id/Mobile already exists');
            }
            else {
                if (result == 2) {
//                    alert('Please enter valid info');
                    $('#mask1').hide();
                    toastr.warning('Please enter valid info');
                } else {
                    $('#signup').modal('hide');
                    var mssg = 'Signed up successfully';
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'sign_up',
                        eventAction: 'sign_up_successfull',
                        eventLabel: 'landing page'
                    });
                    $('#mask1').hide();
                    toastr.success(mssg);
//                    Modal.hide('sign_up');
                    if (Session.get('coming_from_free_trial') == 1) {
                        console.log("getStartId 2");
                        console.log('coming_from_free_trial_in_sign_up', Session.get('coming_from_free_trial'));

                        $('.sign-up').hide();
                        setTimeout(function () {
                            $('#mask1').hide();
                            Modal.show('congrats')
                            console.log("congrats 1");
                        }, 1000);
                        // theDiv = $("#getStartId").attr("href");
                        window.location.href = "#getstarted";
                        // $(theDiv).show();
                    }
                    if (Session.get('global_grade_id') || Session.get('selectedSubjects')) {
                        Modal.hide('sign_up');
                        var token = 'global';
                        Meteor.call('setUserPreference', result.id, token,
                                Session.get('categoryId'), Session.get('subCategoryId'),
                                Session.get('global_grade_id'), Session.get('selectedSubjects').map(Number), function (error, result) {

                            console.log("use preference set", result);
                            console.log("use preference error", error);
                        });
                        if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_subscription')) {
                            location.reload();
                        }
                    } else {
                        console.log("getStartId 1");
                        Modal.hide('sign_up');
                        theDiv = $("#getStartId").attr("href");
                        console.log("theDiv", theDiv);

                        // Router.go('/wall');
                        window.location.href = "#getstarted";
                        // $(theDiv).show();
                    }

                    Session.set('global_user_id', result.id);
                    $(document).ready(function () {
                        Session.set('landing_user_profile', result.name);
                        Session.set('landing_user_profile_id', result.id);
                        if (typeof (Storage) !== "undefined")
                        {
                            // Store
                            localStorage.setItem("userId", result.id);
                        }
                        else
                        {
                            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                        }
                        $('.user_profile_landing').show();

                    });

                    if (Session.get('coming_from_subscription') == 1) {
                        Modal.hide('sign_up');
                        Router.go('/subscription/plan');
                    }
                    if (Session.get(' coming_from_subscription_pricing') == 1) {
                        Modal.hide('sign_up');
                        Router.go('/subscription/plan');
                    }
                    if (Session.get("coming_from_cart") == 1) {
                        Modal.hide('sign_in');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                        Session.clear('coming_from_cart');
                        var cart_data = Session.get("add_to_cart_by_guest");
                        var userId = Session.get('landing_user_profile_id');
                        var token = cart_data.token;
                        var dataFrom = 'tdl';
                        var type = cart_data.type;
                        var packageId = cart_data.packageId;
                        var packageSubscriptionId = cart_data.packageSubscriptionId;
                        var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                        if (buy_now == false) {
                            $('#signup').modal('hide');
                            var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                        } else {
                            $('#signup').modal('hide');
                            Router.go('/express_checkout/go');
                        }
                    }

                    if (Session.get("coming_from_study_pdp") == 1) {
                        Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                        Session.clear('coming_from_study_pdp');
                        var study_data = Session.get("study_pdp_guest");
                        if (study_data) {
                            Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                Session.set('chapter_content_list', result);
                                var slugData = getcustomData(Session.get('about_course_title'));
                                if (study_data.isTestSeries == 0) {
                                    Router.go('/' + slugData + '/chapter_content');
                                } else {
                                    Router.go('/' + slugData + '/chapter_content_test');
                                }
                            });
                        }
                    }
                    
                    if(result.id && Session.get('join_course_clicked')==1){
                    Meteor.call('joinCourse', parseInt(result.id), 'global', parseInt(Session.get('join_package_id')), function (error, result) {
                    var data = JSON.parse(result.content);
                    var status = data.status;
                    if (status == 'true') {
                        if(Session.get('join_course_is_test')==1){
                            Router.go('/my_test_series');
                        }else{
                            Router.go('/my_course');
                        }

                        var msg = "Course added to My Courses section (Under Course Tab) on the left. Access Join courses and download them via our PC app from My Courses.";
                                     toastr.success(msg);

                         ga('send', {
                                hitType: 'event',
                                eventCategory: 'course_join',
                                eventAction: 'course_joined_successfully',
                                eventValue: pckg_id
                             });

                    } 
                    });
                }
                }
            }
            //$('.modal-backdrop').hide();
//           Router.go('/wall');
            //           window.location.href='/wall';
        });
    },
    'click #sign_up_facebook_login': function (event) {
        Meteor.loginWithFacebook({}, function (err) {
            console.log("loginWithFacebook");
            ga('send', {
                hitType: 'event',
                eventCategory: 'sign_up',
                eventAction: 'sign_up_facebook_clicked',
                eventLabel: 'landing page'
            });
            // console.log(Meteor.user().services);
            // console.log(Meteor.user().services.facebook.id);
            // console.log(Meteor.user().services.facebook.email);
            // console.log(Meteor.user().services.facebook.gender);

            // Router.go('/wall');
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }

            // var userId = Meteor.call('autoIncrement');
            var name = Meteor.user().profile.name;
            console.log("nameeeeee", name);
            // var created = new Date();
            // created = new Date(created.setMinutes(created.getMinutes() + 330));

            var fbId = Meteor.user().services.facebook.id;
            // var role=12;
            var mode = "2";
            var email = Meteor.user().services.facebook.email;
            // var pic= "https://graph.facebook.com/" + fb_id + "/picture?width=60&height=60";

            Meteor.call('isUserDuplicate', email, function (error, result) {

//    alert(result);

                if (result == false) {
                    Meteor.call('web_user_register_mode', mode, email, name, fbId, function (error, reg) {
//            alert(reg);
                        console.log("web_user_register_mode", reg["name"]);

                        Modal.hide('sign_up');

                        Session.set('landing_user_profile', reg.name);
                        Session.set('user_name', reg.name);
                        Session.set('landing_user_profile_id', reg.id);


                        var fb_id = reg["fb_id"];
                        var pic = "https://graph.facebook.com/" + fb_id + "/picture?width=60&height=60";

                        Session.set('userProfilePic', pic);

                        console.log("landing_user_profile", reg.name);

                        console.log('landing_user_profile_id_facebook1', reg.id);
                        if (Session.get('coming_from_free_trial') == 1) {
                            $('.sign-up').hide();
                            setTimeout(function () {
                                $('#mask1').hide();
                                Modal.show('congrats')
                                console.log("congrats 1");
                            }, 1000);
                            // theDiv = $("#getStartId").attr("href");
                            window.location.href = "#getstarted";
                            // $(theDiv).show();
                        }
                        if (Session.get('global_grade_id') || Session.get('selectedSubjects')) {
                            Modal.hide('sign_up');
                            var token = 'global';
                            Meteor.call('setUserPreference', reg.id, token,
                                    Session.get('categoryId'), Session.get('subCategoryId'),
                                    Session.get('global_grade_id'), Session.get('selectedSubjects').map(Number), function (error, result) {

                                console.log("use preference set", result);
                                console.log("use preference error", error);
                            });
                            if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_subscription')) {
                                location.reload();
                            }
                        } else {
                            console.log("getStartId 1");
                            Modal.hide('sign_up');
                            theDiv = $("#getStartId").attr("href");
                            console.log("theDiv", theDiv);

                            // Router.go('/wall');
                            window.location.href = "#getstarted";
                            // $(theDiv).show();
                        }

                        if (Session.get('coming_from_subscription') == 1) {
                            Modal.hide('sign_up');
                            Router.go('/subscription/plan');
                        }
                        if (Session.get(' coming_from_subscription_pricing') == 1) {
                            Modal.hide('sign_up');
                            Router.go('/subscription/plan');
                        }
                        if (Session.get("coming_from_cart") == 1) {
                            Modal.hide('sign_in');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                            Session.clear('coming_from_cart');
                            var cart_data = Session.get("add_to_cart_by_guest");
                            var userId = Session.get('landing_user_profile_id');
                            var token = cart_data.token;
                            var dataFrom = 'tdl';
                            var type = cart_data.type;
                            var packageId = cart_data.packageId;
                            var packageSubscriptionId = cart_data.packageSubscriptionId;
                            var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                            if (buy_now == false) {
                                $('#signup').modal('hide');
                                var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                            } else {
                                $('#signup').modal('hide');
                                Router.go('/express_checkout/go');
                            }
                        }

                        if (Session.get("coming_from_study_pdp") == 1) {
                            Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                            Session.clear('coming_from_study_pdp');
                            var study_data = Session.get("study_pdp_guest");
                            if (study_data) {
                                Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                    Session.set('chapter_content_list', result);
                                    var slugData = getcustomData(Session.get('about_course_title'));
                                    if (study_data.isTestSeries == 0) {
                                        Router.go('/' + slugData + '/chapter_content');
                                    } else {
                                        Router.go('/' + slugData + '/chapter_content_test');
                                    }
                                });
                            }
                        }
                        
                        if(reg.id && Session.get('join_course_clicked')==1){
                    Meteor.call('joinCourse', parseInt(reg.id), 'global', parseInt(Session.get('join_package_id')), function (error, result) {
                    var data = JSON.parse(result.content);
                    var status = data.status;
                    if (status == 'true') {
                        if(Session.get('join_course_is_test')==1){
                            Router.go('/my_test_series');
                        }else{
                            Router.go('/my_course');
                        }

                        var msg = "Course added to My Courses section (Under Course Tab) on the left. Access Join courses and download them via our PC app from My Courses.";
                                     toastr.success(msg);

                         ga('send', {
                                hitType: 'event',
                                eventCategory: 'course_join',
                                eventAction: 'course_joined_successfully',
                                eventValue: pckg_id
                             });

                    } 
                    });
                }
                        
                    })
                } else {
                    Meteor.call('emailAndMode', email, mode, function (error, flag) {
                        console.log("flag///////////////", flag);
                        if (flag) {
                            Modal.hide('sign_up');
                            ga('send', {
                                hitType: 'event',
                                eventCategory: 'sign_up',
                                eventAction: 'sign_up_facebook_successfull',
                                eventLabel: 'landing page'
                            });
                            Meteor.call('emailUserDetails', email, function (error, detail) {
                                if (detail.subscription_expiry_date) {
                                    if (detail.subscription_expiry_date > date) {
                                        Session.setTemp('global_flag_free', true);
                                    }
                                }
                                Session.set('landing_user_profile_id', detail.id);
                                console.log("emailUserDetails", detail);
                                console.log("landing_user_profile_id_facebook2", detail.id);
                                if (detail["preference"]) {
                                    //////////////////////set preference
                                    Session.set('landing_user_profile', detail.name);
                                    console.log("landing_user_profile_id_facebook3", detail.id);
                                    Session.set('landing_user_profile_id', detail.id);
                                    Session.set('categoryId', detail.preference.cat_id);
                                    Session.set('subCatId', detail.preference.sub_cat_id);
                                    Session.set('courseId', detail.preference.course.id);
                                    Session.set('global_grade_id', detail.preference.course.id);
                                    Session.set('global_subject_id', detail.preference.course.subject_id);
                                    console.log("detail", JSON.stringify(detail["preference"]));
                                    Meteor.call('fetchPreferenceWeb', detail.preference.cat_id, detail.preference.sub_cat_id,
                                            detail.preference.course.id, detail.preference.course.subject_id, function (error, result) {
                                                console.log('fetchPreferenceWeb', result);

                                                // alert("result");

                                                var subjectName = "";
                                                for (var i = 0; i < (result.subjects).length; i++) {

                                                    if (i == 0)
                                                    {
                                                        subjectName = result.subjects[i].name;
                                                    } else {
                                                        subjectName = subjectName + ", " + result.subjects[i].name;
                                                    }

                                                }
                                                if (subjectName.length > 80) {
                                                    subjectName = subjectName.substring(0, 80) + "...";
                                                }


                                                console.log("web subjectname during sign in", subjectName);
                                                Session.set("subjectName", subjectName);
                                                Session.set('courseName', result.course_name);



                                                if (typeof (Storage) !== "undefined")
                                                {
                                                    // Store
                                                    localStorage.setItem("category", result.cat_id);
                                                    localStorage.setItem("subCategory", result.sub_cat_id);
                                                    localStorage.setItem("course", result.course_id);
                                                    var subjectIDS = (result.subjects).toString();
                                                    var subject_for_cache = '';
                                                    for (var i = 0; i < (result.subjects).length; i++) {
//                                        console.log('subjectIDS_each',result.subjects[i].id);
                                                        var temp = result.subjects[i].id;
                                                        if (i == 0) {
                                                            subject_for_cache = temp;
                                                        } else {
                                                            subject_for_cache = subject_for_cache + ',' + temp;
                                                        }

                                                    }
                                                    console.log('subject_for_cache', subject_for_cache);
                                                    localStorage.setItem("subjectIDS", subject_for_cache);
                                                    localStorage.setItem("categoryName", result.cat_name);
                                                    localStorage.setItem("subCategoryName", result.sub_cat_name);
                                                    localStorage.setItem("courseName", result.course_name);

                                                    Session.set('categoryNameCache', result.cat_name);
                                                    Session.set('subCategoryNameCache', result.sub_cat_name);
                                                    Session.set('courseNameCache', result.course_name);
                                                }
                                                else
                                                {
                                                    document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                                                }
                                                if (Session.get('coming_from_free_trial') == 1) {
                                                    Modal.hide('sign_in');
                                                    setTimeout(function () {
                                                        $('#mask1').hide();
                                                        Modal.show('congrats');
                                                        console.log("congrats 2");
                                                    }, 200)
                                                    Session.set('coming_from_free_trial_preference', 1);
                                                }

                                                if (Session.get('coming_from_subscription') == 1 || Session.get('coming_from_subscription_pricing') == 1) {
                                                    Modal.hide('sign_in');
                                                    Router.go('/subscription/plan');
                                                }

                                                if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_free_trial') && !Session.get('coming_from_subscription') && !Session.get('coming_from_subscription_pricing')) {
                                                    console.log('coming_in_the_wall');
                                                    Modal.hide('sign_in');
                                                    if (result.course_name != '') {
                                                        getCommonUrl();
                                                    }
                                                    //Router.go('/wall');
                                                }
                                                //Router.go('/wall');
                                            });
                                    if (Session.get("coming_from_cart") == 1) {
                                        Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_cart');
                                        var cart_data = Session.get("add_to_cart_by_guest");
                                        var userId = Session.get('landing_user_profile_id');
                                        ;
                                        var token = cart_data.token;
                                        var dataFrom = 'tdl';
                                        var type = cart_data.type;
                                        var packageId = cart_data.packageId;
                                        var packageSubscriptionId = cart_data.packageSubscriptionId;
                                        var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                                        if (buy_now == false) {
                                            $('#signup').modal('hide');
                                            var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                                        } else {
                                            $('#signup').modal('hide');
                                            Router.go('/express_checkout/go');
                                        }
                                    }
                                    if (Session.get("coming_from_study_pdp") == 1) {
                                        Modal.hide('sign_up');
                                        //                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_study_pdp');
                                        var study_data = Session.get("study_pdp_guest");
                                        if (study_data) {
                                            Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                                Session.set('chapter_content_list', result);
                                                var slugData = getcustomData(Session.get('about_course_title'));
                                                if (study_data.isTestSeries == 0) {
                                                    Router.go('/' + slugData + '/chapter_content');
                                                } else {
                                                    Router.go('/' + slugData + '/chapter_content_test');
                                                }
                                            });
                                        }
                                    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                } else {
                                    if ((Session.get('courseId') || Session.get('courseIdCache')) && Session.get('coming_from_free_trial_wall')) {
                                        Modal.hide('sign_in');
                                        if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_subscription')) {
                                            location.reload();
                                        }
                                    } else {
                                        Modal.hide('sign_in');
                                        // Modal.hide('sign_up');
                                        // theDiv = $("#getStartId").attr("href");
                                        //                  $(theDiv).show();
                                        // Router.go('/wall');
                                        window.location.href = "#getstarted";
                                    }

                                    console.log('user_id', result);
                                    Session.set('global_user_id', result.id);
                                    $(document).ready(function () {
                                        // $('.sign-up').hide();
                                        $('.sign-in').hide();
                                        Session.set('landing_user_profile', result.name);
                                        Session.set('landing_user_profile_id', result.id);
                                        if (typeof (Storage) !== "undefined")
                                        {
                                            // Store
                                            localStorage.setItem("userId", result.id);
                                        }
                                        else
                                        {
                                            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                                        }
                                        $('.user_profile_landing').show();
                                    });
                                    if (Session.get('coming_from_free_trial') == 1) {
                                        Modal.hide('sign_in');
                                        // theDiv = $("#getStartId").attr("href");
                                        //          $(theDiv).show();
                                        // Router.go('/wall');
                                        window.location.href = "#getstarted";
                                        setTimeout(function () {
                                            $('#mask1').hide();
                                            Modal.show('congrats');
                                            console.log("congrats 3");
                                        }, 200)
                                    } else if (Session.get('coming_from_free_trial_wall') == 1) {
                                        Modal.hide('sign_in');
                                        setTimeout(function () {
                                            $('#mask1').hide();
                                            Modal.show('congrats');
                                            console.log("congrats 4");
                                        }, 200)
                                    }

                                    if (Session.get('coming_from_subscription') == 1) {
                                        Modal.hide('sign_in');
                                        Router.go('/subscription/plan');
                                    }
                                    if (Session.get(' coming_from_subscription_pricing') == 1) {
                                        Modal.hide('sign_in');
                                        Router.go('/subscription/plan');
                                    }

                                    if (Session.get("coming_from_cart") == 1) {
                                        Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_cart');
                                        var cart_data = Session.get("add_to_cart_by_guest");
                                        var userId = result.id;
                                        var token = cart_data.token;
                                        var dataFrom = 'tdl';
                                        var type = cart_data.type;
                                        var packageId = cart_data.packageId;
                                        var packageSubscriptionId = cart_data.packageSubscriptionId;
                                        var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                                        if (buy_now == false) {
                                            $('#signup').modal('hide');
                                            var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                                        } else {
                                            $('#signup').modal('hide');
                                            Router.go('/express_checkout/go');
                                        }
                                    }

                                    if (Session.get("coming_from_study_pdp") == 1) {
                                        Modal.hide('sign_up');
                                        //                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_study_pdp');
                                        var study_data = Session.get("study_pdp_guest");
                                        if (study_data) {
                                            Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                                Session.set('chapter_content_list', result);
                                                var slugData = getcustomData(Session.get('about_course_title'));
                                                if (study_data.isTestSeries == 0) {
                                                    Router.go('/' + slugData + '/chapter_content');
                                                } else {
                                                    Router.go('/' + slugData + '/chapter_content_test');
                                                }
                                            });
                                        }
                                    }
                                    // alert(window.location.href);
                                }
                                if(detail.id && Session.get('join_course_clicked')==1){
                    Meteor.call('joinCourse', parseInt(detail.id), 'global', parseInt(Session.get('join_package_id')), function (error, result) {
                    var data = JSON.parse(result.content);
                    var status = data.status;
                    if (status == 'true') {
                        if(Session.get('join_course_is_test')==1){
                            Router.go('/my_test_series');
                        }else{
                            Router.go('/my_course');
                        }

                        var msg = "Course added to My Courses section (Under Course Tab) on the left. Access Join courses and download them via our PC app from My Courses.";
                                     toastr.success(msg);

                         ga('send', {
                                hitType: 'event',
                                eventCategory: 'course_join',
                                eventAction: 'course_joined_successfully',
                                eventValue: pckg_id
                             });

                    } 
                    });
                }

                            });
                            
                            
                            
                        } else {
                            ////////////////////alert login via proper

                            toastr.warning("Please login via proper mode");

                        }


                    });
                }

            });

        });
    },
    'click #sign_up_google_login': function (event) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'sign_up',
            eventAction: 'sign_up_google_clicked',
            eventLabel: 'landing_page'
        });
        Meteor.loginWithGoogle({}, function (err) {

            // Router.go('/wall');
            if (err) {
                throw new Meteor.Error("Google login failed");
            }
            // var userId = Meteor.call('autoIncrement');
            var name = Meteor.user().profile.name;
            console.log("googleName", name);
            // var created = new Date();
            // created = new Date(created.setMinutes(created.getMinutes() + 330));

            var googleId = Meteor.user().services.google.id;
            // var role=12;
            var mode = "3";
            var email = Meteor.user().services.google.email;
            var flag = 0;

            Meteor.call('isUserDuplicate', email, function (error, result) {

//    alert(result);

                if (result == false) {
                    Meteor.call('web_user_register_mode', mode, email, name, googleId, function (error, reg) {
//            alert(reg);
                        console.log("web_user_register_mode", reg["name"]);

                        Modal.hide('sign_up');

                        Session.set('landing_user_profile', reg.name);
                        Session.set('landing_user_profile_id', reg.id);

                        console.log("landing_user_profile", reg.name);
                        console.log('landing_user_profile_id', reg.id);

                        if (Session.get('coming_from_free_trial') == 1) {
                            $('.sign-up').hide();
                            setTimeout(function () {
                                $('#mask1').hide();
                                Modal.show('congrats')
                                console.log("congrats 1");
                            }, 1000);
                            // theDiv = $("#getStartId").attr("href");
                            window.location.href = "#getstarted";
                            // $(theDiv).show();
                        }
                        if (Session.get('global_grade_id') || Session.get('selectedSubjects')) {
                            Modal.hide('sign_up');
                            var token = 'global';
                            Meteor.call('setUserPreference', reg.id, token,
                                    Session.get('categoryId'), Session.get('subCategoryId'),
                                    Session.get('global_grade_id'), Session.get('selectedSubjects').map(Number), function (error, result) {

                                console.log("use preference set", result);
                                console.log("use preference error", error);
                            });
                            if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_subscription')) {
                                location.reload();
                            }
                        } else {
                            console.log("getStartId 1");
                            Modal.hide('sign_up');
                            theDiv = $("#getStartId").attr("href");
                            console.log("theDiv", theDiv);

                            // Router.go('/wall');
                            window.location.href = "#getstarted";
                            // $(theDiv).show();
                        }

                        if (Session.get('coming_from_subscription') == 1) {
                            Modal.hide('sign_up');
                            Router.go('/subscription/plan');
                        }
                        if (Session.get(' coming_from_subscription_pricing') == 1) {
                            Modal.hide('sign_up');
                            Router.go('/subscription/plan');
                        }

                        if (Session.get("coming_from_cart") == 1) {
                            Modal.hide('sign_in');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                            Session.clear('coming_from_cart');
                            var cart_data = Session.get("add_to_cart_by_guest");
                            var userId = Session.get('landing_user_profile_id');
                            var token = cart_data.token;
                            var dataFrom = 'tdl';
                            var type = cart_data.type;
                            var packageId = cart_data.packageId;
                            var packageSubscriptionId = cart_data.packageSubscriptionId;
                            var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                            if (buy_now == false) {
                                $('#signup').modal('hide');
                                var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                            } else {
                                $('#signup').modal('hide');
                                Router.go('/express_checkout/go');
                            }
                        }

                        if (Session.get("coming_from_study_pdp") == 1) {
                            Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                            Session.clear('coming_from_study_pdp');
                            var study_data = Session.get("study_pdp_guest");
                            if (study_data) {
                                Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                    Session.set('chapter_content_list', result);
                                    var slugData = getcustomData(Session.get('about_course_title'));
                                    if (study_data.isTestSeries == 0) {
                                        Router.go('/' + slugData + '/chapter_content');
                                    } else {
                                        Router.go('/' + slugData + '/chapter_content_test');
                                    }
                                });
                            }
                        }
                        if(reg.id && Session.get('join_course_clicked')==1){
                    Meteor.call('joinCourse', parseInt(reg.id), 'global', parseInt(Session.get('join_package_id')), function (error, result) {
                    var data = JSON.parse(result.content);
                    var status = data.status;
                    if (status == 'true') {
                        if(Session.get('join_course_is_test')==1){
                            Router.go('/my_test_series');
                        }else{
                            Router.go('/my_course');
                        }

                        var msg = "Course added to My Courses section (Under Course Tab) on the left. Access Join courses and download them via our PC app from My Courses.";
                                     toastr.success(msg);

                         ga('send', {
                                hitType: 'event',
                                eventCategory: 'course_join',
                                eventAction: 'course_joined_successfully',
                                eventValue: pckg_id
                             });

                    } 
                    });
                }
                        
                    })
                } else {
                    Meteor.call('emailAndMode', email, mode, function (error, flag) {

                        if (flag) {
                            ga('send', {
                                hitType: 'event',
                                eventCategory: 'sign_up',
                                eventAction: 'sign_up_google_successfull',
                                eventLabel: 'landing page'
                            });
                            Modal.hide('sign_up');
                            Meteor.call('emailUserDetails', email, function (error, detail) {
                                if (detail.subscription_expiry_date) {
                                    if (detail.subscription_expiry_date > date) {
                                        Session.setTemp('global_flag_free', true);
                                    }
                                }
                                Session.set('landing_user_profile_id', detail.id);
                                console.log("emailUserDetails", detail);

                                if (detail["preference"]) {
                                    //////////////////////set preference

                                    Session.set('landing_user_profile', detail.name);
                                    Session.set('landing_user_profile_id', detail.id);
                                    Session.set('categoryId', detail.preference.cat_id);
                                    Session.set('subCatId', detail.preference.sub_cat_id);
                                    Session.set('courseId', detail.preference.course.id);
                                    Session.set('global_grade_id', detail.preference.course.id);
                                    Session.set('global_subject_id', detail.preference.course.subject_id);
                                    console.log("detail", JSON.stringify(detail["preference"]));
                                    Meteor.call('fetchPreferenceWeb', detail.preference.cat_id, detail.preference.sub_cat_id,
                                            detail.preference.course.id, detail.preference.course.subject_id, function (error, result) {
                                                console.log('fetchPreferenceWeb', result);

                                                // alert("result");

                                                var subjectName = "";
                                                for (var i = 0; i < (result.subjects).length; i++) {

                                                    if (i == 0)
                                                    {
                                                        subjectName = result.subjects[i].name;
                                                    } else {
                                                        subjectName = subjectName + ", " + result.subjects[i].name;
                                                    }

                                                }
                                                if (subjectName.length > 80) {
                                                    subjectName = subjectName.substring(0, 80) + "...";
                                                }


                                                console.log("web subjectname during sign in", subjectName);
                                                Session.set("subjectName", subjectName);
                                                Session.set('courseName', result.course_name);



                                                if (typeof (Storage) !== "undefined")
                                                {
                                                    // Store
                                                    localStorage.setItem("category", result.cat_id);
                                                    localStorage.setItem("subCategory", result.sub_cat_id);
                                                    localStorage.setItem("course", result.course_id);
                                                    var subjectIDS = (result.subjects).toString();
                                                    var subject_for_cache = '';
                                                    for (var i = 0; i < (result.subjects).length; i++) {
//                                        console.log('subjectIDS_each',result.subjects[i].id);
                                                        var temp = result.subjects[i].id;
                                                        if (i == 0) {
                                                            subject_for_cache = temp;
                                                        } else {
                                                            subject_for_cache = subject_for_cache + ',' + temp;
                                                        }

                                                    }
                                                    console.log('subject_for_cache', subject_for_cache);
                                                    localStorage.setItem("subjectIDS", subject_for_cache);
                                                    localStorage.setItem("categoryName", result.cat_name);
                                                    localStorage.setItem("subCategoryName", result.sub_cat_name);
                                                    localStorage.setItem("courseName", result.course_name);

                                                    Session.set('categoryNameCache', result.cat_name);
                                                    Session.set('subCategoryNameCache', result.sub_cat_name);
                                                    Session.set('courseNameCache', result.course_name);
                                                }
                                                else
                                                {
                                                    document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                                                }
                                                if (Session.get('coming_from_free_trial') == 1) {
                                                    Modal.hide('sign_in');
                                                    setTimeout(function () {
                                                        $('#mask1').hide();
                                                        Modal.show('congrats');
                                                        console.log("congrats 2");
                                                    }, 200)
                                                    Session.set('coming_from_free_trial_preference', 1);
                                                }

                                                if (Session.get('coming_from_subscription') == 1 || Session.get('coming_from_subscription_pricing') == 1) {
                                                    Modal.hide('sign_in');
                                                    Router.go('/subscription/plan');
                                                }

                                                if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_free_trial') && !Session.get('coming_from_subscription') && !Session.get('coming_from_subscription_pricing')) {
                                                    console.log('coming_in_the_wall');
                                                    Modal.hide('sign_in');
                                                    if (result.course_name != '') {
                                                        getCommonUrl();
                                                    }
                                                    //Router.go('/wall');
                                                }
                                                //Router.go('/wall');
                                            });
                                    if (Session.get("coming_from_cart") == 1) {
                                        Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_cart');
                                        var cart_data = Session.get("add_to_cart_by_guest");
                                        var userId = Session.get('landing_user_profile_id');
                                        ;
                                        var token = cart_data.token;
                                        var dataFrom = 'tdl';
                                        var type = cart_data.type;
                                        var packageId = cart_data.packageId;
                                        var packageSubscriptionId = cart_data.packageSubscriptionId;
                                        var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                                        if (buy_now == false) {
                                            $('#signup').modal('hide');
                                            var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                                        } else {
                                            $('#signup').modal('hide');
                                            Router.go('/express_checkout/go');
                                        }
                                    }


                                    if (Session.get("coming_from_study_pdp") == 1) {
                                        Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_study_pdp');
                                        var study_data = Session.get("study_pdp_guest");
                                        if (study_data) {
                                            Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                                Session.set('chapter_content_list', result);
                                                var slugData = getcustomData(Session.get('about_course_title'));
                                                if (study_data.isTestSeries == 0) {
                                                    Router.go('/' + slugData + '/chapter_content');
                                                } else {
                                                    Router.go('/' + slugData + '/chapter_content_test');
                                                }
                                            });
                                        }
                                    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                }

                                else {
                                    if ((Session.get('courseId') || Session.get('courseIdCache')) && Session.get('coming_from_free_trial_wall')) {
                                        Modal.hide('sign_in');
                                        if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_subscription')) {
                                            location.reload();
                                        }
                                    } else {
                                        Modal.hide('sign_in');
                                        // Modal.hide('sign_up');
                                        // theDiv = $("#getStartId").attr("href");
                                        //                  $(theDiv).show();
                                        // Router.go('/wall');
                                        window.location.href = "#getstarted";
                                    }

                                    console.log('user_id', result);
                                    Session.set('global_user_id', result.id);
                                    $(document).ready(function () {
                                        // $('.sign-up').hide();
                                        $('.sign-in').hide();
                                        Session.set('landing_user_profile', result.name);
                                        Session.set('landing_user_profile_id', result.id);
                                        if (typeof (Storage) !== "undefined")
                                        {
                                            // Store
                                            localStorage.setItem("userId", result.id);
                                        }
                                        else
                                        {
                                            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                                        }
                                        $('.user_profile_landing').show();
                                    });
                                    if (Session.get('coming_from_free_trial') == 1) {
                                        Modal.hide('sign_in');
                                        // theDiv = $("#getStartId").attr("href");
                                        //          $(theDiv).show();
                                        // Router.go('/wall');
                                        window.location.href = "#getstarted";
                                        setTimeout(function () {
                                            $('#mask1').hide();
                                            Modal.show('congrats');
                                            console.log("congrats 3");
                                        }, 200)
                                    } else if (Session.get('coming_from_free_trial_wall') == 1) {
                                        Modal.hide('sign_in');
                                        setTimeout(function () {
                                            $('#mask1').hide();
                                            Modal.show('congrats');
                                            console.log("congrats 4");
                                        }, 200)
                                    }

                                    if (Session.get('coming_from_subscription') == 1) {
                                        Modal.hide('sign_in');
                                        Router.go('/subscription/plan');
                                    }
                                    if (Session.get(' coming_from_subscription_pricing') == 1) {
                                        Modal.hide('sign_in');
                                        Router.go('/subscription/plan');
                                    }

                                    if (Session.get("coming_from_cart") == 1) {
                                        Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_cart');
                                        var cart_data = Session.get("add_to_cart_by_guest");
                                        var userId = result.id;
                                        var token = cart_data.token;
                                        var dataFrom = 'tdl';
                                        var type = cart_data.type;
                                        var packageId = cart_data.packageId;
                                        var packageSubscriptionId = cart_data.packageSubscriptionId;
                                        var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                                        if (buy_now == false) {
                                            $('#signup').modal('hide');
                                            var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                                        } else {
                                            $('#signup').modal('hide');
                                            Router.go('/express_checkout/go');
                                        }
                                    }

                                    if (Session.get("coming_from_study_pdp") == 1) {
                                        Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_study_pdp');
                                        var study_data = Session.get("study_pdp_guest");
                                        if (study_data) {
                                            Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                                Session.set('chapter_content_list', result);
                                                var slugData = getcustomData(Session.get('about_course_title'));
                                                if (study_data.isTestSeries == 0) {
                                                    Router.go('/' + slugData + '/chapter_content');
                                                } else {
                                                    Router.go('/' + slugData + '/chapter_content_test');
                                                }
                                            });
                                        }
                                    }
                                }

                                if(detail.id && Session.get('join_course_clicked')==1){
                    Meteor.call('joinCourse', parseInt(detail.id), 'global', parseInt(Session.get('join_package_id')), function (error, result) {
                    var data = JSON.parse(result.content);
                    var status = data.status;
                    if (status == 'true') {
                        if(Session.get('join_course_is_test')==1){
                            Router.go('/my_test_series');
                        }else{
                            Router.go('/my_course');
                        }

                        var msg = "Course added to My Courses section (Under Course Tab) on the left. Access Join courses and download them via our PC app from My Courses.";
                                     toastr.success(msg);

                         ga('send', {
                                hitType: 'event',
                                eventCategory: 'course_join',
                                eventAction: 'course_joined_successfully',
                                eventValue: pckg_id
                             });

                    } 
                    });
                }
                            });

                        } else {
                            ////////////////////alert login via proper

                            toastr.warning("Please login via proper mode");

                        }


                    });
                }

            });

        });
    },
    "click .signin_from_signup": function (e) {
        e.preventDefault();
        Modal.hide('sign_up');
        setTimeout(function () {
            Modal.show('sign_in')
        }, 500)
    }
});



Template.forgot_pwd.events({
    'submit form': function (event) {
        event.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'forgot_password',
            eventAction: 'forgot_password_submitted',
            eventLabel: 'landing page'
        });
        var email = $('[name=email_id]').val();
        console.log(email);
        Meteor.call('forget_pass', email, function (error, result) {
            console.log(result);
            console.log(result.data.status);
            if (result.data.status) {
                //Mail Sent
                $('#forgotpwd').find('.modal-body').html('Email has been sent to you with reset password link.');
            } else {
                if (!result.data.status && result.data.message == 'Email does not exists!') {
                    $('#forgotpwd').find('.modal-body').html('Reset password failed as email id does not exists.');
                } else {
                    //Problem in mail sent
                    $('#forgotpwd').find('.modal-body').html('Some problem occurred in sending mail please try again.');
                }
            }
        });

    }

});


Template.registerHelper('user_name', function () {
    return user_name;
});


Template.navigation.events = {
    "click .sign-up": function (e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'sign_up',
            eventAction: 'sign_up_clicked',
            eventLabel: 'landing page'
        });
        Session.clear('coming_from_subscription_pricing');
        Session.clear('coming_from_subscription');
        Modal.show('sign_up');
    },
    "click .sign-in": function (e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'sign_in',
            eventAction: 'sign_in_clicked',
            eventLabel: 'landing page'
        });
        Session.clear('coming_from_subscription_pricing');
        Session.clear('coming_from_subscription');
        Modal.show('sign_in');
    },
    "click .log_out_button": function (e) {
        e.preventDefault();
        localStorage.clear('userId');
        Session.clear('landing_user_profile_id');
        Session.clear('global_flag_free');
        Router.go('/');
        // window.location.reload(true);
    },
    "click #go_to_top_landing_page": function (e) {
        e.preventDefault();
        window.location.href = "#home-bg";
    }
};


Template.sign_up.onRendered(function () {
    //console.log('rendered');
    $('.register').validate({
        rules: {
            email_id: {
                required: true,
                email: true
            },
            user_password: {
                required: true,
                minlength: 6
            },
            user_name: {
                required: true,
                minlength: 3
            },
            mobile_no: {
                required: true,
                digits: true,
                rangelength: [10, 10]
            }
        },
        messages: {
            email_id: {
                required: "Please enter an email address.",
                email: "You've entered an invalid email address."
            },
            user_password: {
                required: "Please enter a password.",
                minlength: "Your password must be at least 6 characters."
            },
            user_name: {
                required: "Please enter a name.",
                minlength: "Your name must be at least 3 characters."
            },
            mobile_no: {
                required: "Please enter a valid mobile number.",
                digits: "You must enter digits only",
                rangelength: "Your mobile should have 10 characters."
            }
        }
    });
});
Template.forgot_pwd.onRendered(function () {
    //console.log('rendered');
    $('.forgetpass').validate({
        rules: {
            email_id: {
                required: true,
                email: true
            }
        },
        messages: {
            email_id: {
                required: "Please enter email address.",
                email: "You've entered an invalid email address."
            }
        }
    });
});


Modal.allowMultiple = true
Template.sign_in.events({
    "click .frgtpwd": function (e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'forgot_password',
            eventAction: 'forgot_password_clicked',
            eventLabel: 'landing page'
        });
        Modal.hide('sign_in');
        setTimeout(function () {
            Modal.show('forgot_pwd')
        }, 200)
    },
    'submit form': function (event) {
        event.preventDefault();
        $('#mask1').show();
        ga('send', {
            hitType: 'event',
            eventCategory: 'sign_in',
            eventAction: 'sign_in_submitted',
            eventLabel: 'landing page'
        });
//        $('#mask1').show();
        var email = $('[name=email_id1]').val();
        var password = $('[name=user_password1]').val();
        Meteor.call('web_user_login', email, password, function (error, result) {
            //Session.set('myMethodResult1', result);
            console.log('result_signin', result);
            if (result) {
                ga('send', {
                    hitType: 'event',
                    eventCategory: 'sign_in',
                    eventAction: 'sign_in_successfull',
                    eventLabel: 'landing page'
                });
                $('#signin').modal('hide');
                Session.set('landing_user_profile_id', result.id);
                var date = new Date();
                if (result.subscription_expiry_date) {
                    if (result.subscription_expiry_date > date) {
                        Session.setTemp('global_flag_free', true);
                    }
                }
                if (result.preference) {
                    console.log('result.preference', result.preference);
                    if (typeof (Storage) !== "undefined")
                    {
                        // Store
                        localStorage.setItem("userId", result.id);

                    }
                    else
                    {
                        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                    }
//                        fetchPreferenceWeb': function(categoryId,subcategoryId,gradeId,subjectId) {
                    console.log('result.preference.cat_id', result.preference.cat_id);
                    console.log('result.preference.sub_cat_id', result.preference.sub_cat_id);
                    console.log('result.preference.course.id', result.preference.course.id);
                    console.log('result.preference.course.subject_id', result.preference.course.subject_id);
                    Session.set('selectedSubjects', result.preference.course.subject_id);
                    Session.set('courseId', result.preference.course.id);
                    Session.set('global_grade_id', result.preference.course.id);
                    Session.set('global_subject_id', result.preference.course.subject_id);
                    Session.set('categoryId', result.preference.cat_id);
                    Session.set('subCatId', result.preference.sub_cat_id);
                    Session.set('courseId', result.preference.course.id);

                    Meteor.call('fetchPreferenceWeb', result.preference.cat_id, result.preference.sub_cat_id,
                            result.preference.course.id, result.preference.course.subject_id, function (error, result) {
                                console.log('fetchPreferenceWeb', result);



                                var subjectName = "";
                                for (var i = 0; i < (result.subjects).length; i++) {

                                    if (i == 0)
                                    {
                                        subjectName = result.subjects[i].name;
                                    } else {
                                        subjectName = subjectName + ", " + result.subjects[i].name;
                                    }

                                }
                                if (subjectName.length > 80) {
                                    subjectName = subjectName.substring(0, 80) + "...";
                                }


                                console.log("web subjectname during sign in", subjectName);
                                Session.set("subjectName", subjectName);
                                Session.set('courseName', result.course_name);




                                if (typeof (Storage) !== "undefined")
                                {
                                    // Store
                                    localStorage.setItem("category", result.cat_id);
                                    localStorage.setItem("subCategory", result.sub_cat_id);
                                    localStorage.setItem("course", result.course_id);
                                    var subjectIDS = (result.subjects).toString();
                                    var subject_for_cache = '';
                                    for (var i = 0; i < (result.subjects).length; i++) {
//                                        console.log('subjectIDS_each',result.subjects[i].id);
                                        var temp = result.subjects[i].id;
                                        if (i == 0) {
                                            subject_for_cache = temp;
                                        } else {
                                            subject_for_cache = subject_for_cache + ',' + temp;
                                        }

                                    }
                                    console.log('subject_for_cache', subject_for_cache);
                                    localStorage.setItem("subjectIDS", subject_for_cache);
                                    localStorage.setItem("categoryName", result.cat_name);
                                    localStorage.setItem("subCategoryName", result.sub_cat_name);
                                    localStorage.setItem("courseName", result.course_name);

                                    Session.set('categoryNameCache', result.cat_name);
                                    Session.set('subCategoryNameCache', result.sub_cat_name);
                                    Session.set('courseNameCache', result.course_name);

                                }
                                else
                                {
                                    document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                                }

                                if (Session.get('coming_from_free_trial') == 1) {
                                    Modal.hide('sign_in');
                                    setTimeout(function () {
                                        $('#mask1').hide();
                                        Modal.show('congrats');
                                        console.log("congrats 2");
                                    }, 200)
                                    Session.set('coming_from_free_trial_preference', 1);
                                }

                                if (Session.get('coming_from_subscription') == 1 || Session.get('coming_from_subscription_pricing') == 1) {
                                    Modal.hide('sign_in');
                                    Router.go('/subscription/plan');
                                }
                                if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_free_trial') && !Session.get('coming_from_subscription') && !Session.get('coming_from_subscription_pricing')) {
                                    console.log('coming_in_the_wall');
                                    Modal.hide('sign_in');
                                    if (result.course_name != '') {
                                        getCommonUrl();
                                    }
                                    //Router.go('/wall');
                                }
                                if (Session.get("coming_from_cart") == 1) {
                                    Session.get('express_checkout_data');
                                    console.log('express_checkout_data_after', Session.get('express_checkout_data'));
                                    Modal.hide('sign_in');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                    Session.clear('coming_from_cart');
                                    var cart_data = Session.get("add_to_cart_by_guest");
                                    console.log('add_to_cart_by_guest', cart_data);
                                    var userId = Session.get('landing_user_profile_id');
                                    console.log('add_to_cart_user_id', userId);
                                    var token = cart_data.token;
                                    var dataFrom = 'tdl';
                                    var type = cart_data.type;
                                    var packageId = cart_data.packageId;
                                    var packageSubscriptionId = cart_data.packageSubscriptionId;
                                    var buy_now = cart_data.buy_now;
                                    console.log('add_to_cart_user_id', userId);
                                    console.log('add_to_cart_user_id', token);
                                    console.log('add_to_cart_user_id', dataFrom);
                                    console.log('add_to_cart_user_id', type);
                                    console.log('add_to_cart_user_id', packageId);
                                    console.log('add_to_cart_user_id', packageSubscriptionId);
                                    console.log('add_to_cart_user_id', buy_now);
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                                    if (buy_now == false) {
                                        $('#signin').modal('hide');
                                        var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                                    } else {
                                        $('#signin').modal('hide');
                                        Router.go('/express_checkout/go');
                                    }
                                }

                                if (Session.get("coming_from_study_pdp") == 1) {
                                        Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_study_pdp');
                                        var study_data = Session.get("study_pdp_guest");
                                        if (study_data) {
                                            Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                                Session.set('chapter_content_list', result);
                                                var slugData = getcustomData(Session.get('about_course_title'));
                                                if (study_data.isTestSeries == 0) {
                                                    Router.go('/' + slugData + '/chapter_content');
                                                } else {
                                                    Router.go('/' + slugData + '/chapter_content_test');
                                                }
                                            });
                                        }
                                    }
                            });

                    console.log('coming_in_the_wall_outside');

                } else {
                    // Modal.hide('sign_in');
                    if ((Session.get('courseId') || Session.get('courseIdCache')) && Session.get('coming_from_free_trial_wall')) {
                        Modal.hide('sign_in');
                        if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_subscription')) {
                                            location.reload();
                                        }
                    } else {
                        Modal.hide('sign_in');
                        // Modal.hide('sign_up');
                        // theDiv = $("#getStartId").attr("href");
                        //                  $(theDiv).show();
                        // Router.go('/wall');
                        window.location.href = "#getstarted";
                    }

                    console.log('user_id', result);
                    Session.set('global_user_id', result.id);
                    $(document).ready(function () {
                        // $('.sign-up').hide();
                        $('.sign-in').hide();
                        Session.set('landing_user_profile', result.name);
                        Session.set('landing_user_profile_id', result.id);
                        if (typeof (Storage) !== "undefined")
                        {
                            // Store
                            localStorage.setItem("userId", result.id);
                        }
                        else
                        {
                            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                        }
                        $('.user_profile_landing').show();
                    });
                    if (Session.get('coming_from_free_trial') == 1) {
                        Modal.hide('sign_in');
                        // theDiv = $("#getStartId").attr("href");
                        //          $(theDiv).show();
                        // Router.go('/wall');
                        window.location.href = "#getstarted";
                        setTimeout(function () {
                            $('#mask1').hide();
                            Modal.show('congrats');
                            console.log("congrats 3");
                        }, 200)
                    } else if (Session.get('coming_from_free_trial_wall') == 1) {
                        Modal.hide('sign_in');
                        setTimeout(function () {
                            $('#mask1').hide();
                            Modal.show('congrats');
                            console.log("congrats 4");
                        }, 200)
                    }

                    if (Session.get('coming_from_subscription') == 1) {
                        Modal.hide('sign_in');
                        Router.go('/subscription/plan');
                    }
                    if (Session.get(' coming_from_subscription_pricing') == 1) {
                        Modal.hide('sign_in');
                        Router.go('/subscription/plan');
                    }
                    if (Session.get("coming_from_cart") == 1) {
                        Modal.hide('sign_in');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                        Session.clear('coming_from_cart');
                        var cart_data = Session.get("add_to_cart_by_guest");
                        var userId = result.id;
                        var token = cart_data.token;
                        var dataFrom = 'tdl';
                        var type = cart_data.type;
                        var packageId = cart_data.packageId;
                        var packageSubscriptionId = cart_data.packageSubscriptionId;
                        var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                        if (buy_now == false) {
                            $('#signin').modal('hide');
                            var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                        } else {
                            $('#signin').modal('hide');
                            Router.go('/express_checkout/go');
                        }
                    }
                    if (Session.get("coming_from_study_pdp") == 1) {
                                        Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_study_pdp');
                                        var study_data = Session.get("study_pdp_guest");
                                        if (study_data) {
                                            Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                                Session.set('chapter_content_list', result);
                                                var slugData = getcustomData(Session.get('about_course_title'));
                                                if (study_data.isTestSeries == 0) {
                                                    Router.go('/' + slugData + '/chapter_content');
                                                } else {
                                                    Router.go('/' + slugData + '/chapter_content_test');
                                                }
                                            });
                                        }
                                    }
                }
                if(result.id && Session.get('join_course_clicked')==1){
                    Meteor.call('joinCourse', parseInt(result.id), 'global', parseInt(Session.get('join_package_id')), function (error, result) {
                    var data = JSON.parse(result.content);
                    var status = data.status;
                    if (status == 'true') {
                        if(Session.get('join_course_is_test')==1){
                            Router.go('/my_test_series');
                        }else{
                            Router.go('/my_course');
                        }

                        var msg = "Course added to My Courses section (Under Course Tab) on the left. Access Join courses and download them via our PC app from My Courses.";
                                     toastr.success(msg);

                         ga('send', {
                                hitType: 'event',
                                eventCategory: 'course_join',
                                eventAction: 'course_joined_successfully',
                                eventValue: pckg_id
                             });

                    } 
                    });
                }
            } else {
                toastr.warning('Please enter correct Email Id and Password');
            }
        });
    },
    'click #facebook-login': function (event) {
        Meteor.loginWithFacebook({}, function (err) {
            console.log("loginWithFacebook");
            ga('send', {
                hitType: 'event',
                eventCategory: 'sign_in',
                eventAction: 'sign_in_facebook_clicked',
                eventLabel: 'landing_page'
            });
            // console.log(Meteor.user().services);
            // console.log(Meteor.user().services.facebook.id);
            // console.log(Meteor.user().services.facebook.email);
            // console.log(Meteor.user().services.facebook.gender);

            // Router.go('/wall');
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }

            // var userId = Meteor.call('autoIncrement');
            var name = Meteor.user().profile.name;
            console.log("nameeeeee", name);
            // var created = new Date();
            // created = new Date(created.setMinutes(created.getMinutes() + 330));

            var fbId = Meteor.user().services.facebook.id;
            // var role=12;
            var mode = "2";
            var email = Meteor.user().services.facebook.email;
            // var pic= "https://graph.facebook.com/" + fb_id + "/picture?width=60&height=60";

            Meteor.call('isUserDuplicate', email, function (error, result) {

//    alert(result);

                if (result == false) {
                    Meteor.call('web_user_register_mode', mode, email, name, fbId, function (error, reg) {
//            alert(reg);
                        console.log("web_user_register_mode", reg["name"]);

                        Modal.hide('sign_in');

                        Session.set('landing_user_profile', reg.name);
                        Session.set('user_name', reg.name);
                        Session.set('landing_user_profile_id', reg.id);

                        var fb_id = reg["fb_id"];
                        var pic = "https://graph.facebook.com/" + fb_id + "/picture?width=60&height=60";

                        Session.set('userProfilePic', pic);

                        console.log("landing_user_profile", reg.name);

                        console.log('landing_user_profile_id', reg.id);

                        if (Session.get('coming_from_free_trial') == 1) {
                            $('.sign-up').hide();
                            setTimeout(function () {
                                $('#mask1').hide();
                                Modal.show('congrats')
                                console.log("congrats 1");
                            }, 1000);
                            // theDiv = $("#getStartId").attr("href");
                            window.location.href = "#getstarted";
                            // $(theDiv).show();
                        }
                        if (Session.get('global_grade_id') || Session.get('selectedSubjects')) {
                            Modal.hide('sign_up');
                            var token = 'global';
                            Meteor.call('setUserPreference', reg.id, token,
                                    Session.get('categoryId'), Session.get('subCategoryId'),
                                    Session.get('global_grade_id'), Session.get('selectedSubjects').map(Number), function (error, result) {

                                console.log("use preference set", result);
                                console.log("use preference error", error);
                            });
                            if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_subscription')) {
                                location.reload();
                            }
                        } else {
                            console.log("getStartId 1");
                            Modal.hide('sign_up');
                            theDiv = $("#getStartId").attr("href");
                            console.log("theDiv", theDiv);

                            // Router.go('/wall');
                            window.location.href = "#getstarted";
                            // $(theDiv).show();
                        }

                        if (Session.get('coming_from_subscription') == 1) {
                            Modal.hide('sign_up');
                            Router.go('/subscription/plan');
                        }
                        if (Session.get(' coming_from_subscription_pricing') == 1) {
                            Modal.hide('sign_up');
                            Router.go('/subscription/plan');
                        }
                        
                        if (Session.get("coming_from_cart") == 1) {
                            Modal.hide('sign_in');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                            Session.clear('coming_from_cart');
                            var cart_data = Session.get("add_to_cart_by_guest");
                            var userId = Session.get('landing_user_profile_id');
                            var token = cart_data.token;
                            var dataFrom = 'tdl';
                            var type = cart_data.type;
                            var packageId = cart_data.packageId;
                            var packageSubscriptionId = cart_data.packageSubscriptionId;
                            var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                            if (buy_now == false) {
                                $('#signup').modal('hide');
                                var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                            } else {
                                $('#signup').modal('hide');
                                Router.go('/express_checkout/go');
                            }
                        }

                        if (Session.get("coming_from_study_pdp") == 1) {
                            Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                            Session.clear('coming_from_study_pdp');
                            var study_data = Session.get("study_pdp_guest");
                            if (study_data) {
                                Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                    Session.set('chapter_content_list', result);
                                    var slugData = getcustomData(Session.get('about_course_title'));
                                    if (study_data.isTestSeries == 0) {
                                        Router.go('/' + slugData + '/chapter_content');
                                    } else {
                                        Router.go('/' + slugData + '/chapter_content_test');
                                    }
                                });
                            }
                        }
                        
                        if(reg.id && Session.get('join_course_clicked')==1){
                    Meteor.call('joinCourse', parseInt(reg.id), 'global', parseInt(Session.get('join_package_id')), function (error, result) {
                    var data = JSON.parse(result.content);
                    var status = data.status;
                    if (status == 'true') {
                        if(Session.get('join_course_is_test')==1){
                            Router.go('/my_test_series');
                        }else{
                            Router.go('/my_course');
                        }

                        var msg = "Course added to My Courses section (Under Course Tab) on the left. Access Join courses and download them via our PC app from My Courses.";
                                     toastr.success(msg);

                         ga('send', {
                                hitType: 'event',
                                eventCategory: 'course_join',
                                eventAction: 'course_joined_successfully',
                                eventValue: pckg_id
                             });

                    } 
                    });
                }

                    })
                } else {
                    Meteor.call('emailAndMode', email, mode, function (error, flag) {
                        console.log("flag///////////////", flag);
                        if (flag) {
                            ga('send', {
                                hitType: 'event',
                                eventCategory: 'sign_in',
                                eventAction: 'sign_in_facebook_successfull',
                                eventLabel: 'landing page'
                            });
                            Modal.hide('sign_in');
                            Meteor.call('emailUserDetails', email, function (error, detail) {
                                var date = new Date();
                                if (detail.subscription_expiry_date) {
                                    if (detail.subscription_expiry_date > date) {
                                        Session.setTemp('global_flag_free', true);
                                    }
                                }
                                Session.set('landing_user_profile_id', detail.id);
                                console.log("emailUserDetails", detail);

                                if (detail["preference"]) {
                                    //////////////////////set preference

                                    Session.set('landing_user_profile', detail.name);
                                    Session.set('landing_user_profile_id', detail.id);
                                    Session.set('global_grade_id', detail.preference.course.id);
                                    Session.set('global_subject_id', detail.preference.course.subject_id);
                                    Session.set('categoryId', detail.preference.cat_id);
                                    Session.set('subCatId', detail.preference.sub_cat_id);
                                    Session.set('courseId', detail.preference.course.id);
                                    console.log("detail", JSON.stringify(detail["preference"]));
                                    Meteor.call('fetchPreferenceWeb', detail.preference.cat_id, detail.preference.sub_cat_id,
                                            detail.preference.course.id, detail.preference.course.subject_id, function (error, result) {
                                                console.log('fetchPreferenceWeb', result);

                                                // alert("result");

                                                var subjectName = "";
                                                for (var i = 0; i < (result.subjects).length; i++) {

                                                    if (i == 0)
                                                    {
                                                        subjectName = result.subjects[i].name;
                                                    } else {
                                                        subjectName = subjectName + ", " + result.subjects[i].name;
                                                    }

                                                }
                                                if (subjectName.length > 80) {
                                                    subjectName = subjectName.substring(0, 80) + "...";
                                                }


                                                console.log("web subjectname during sign in", subjectName);
                                                Session.set("subjectName", subjectName);
                                                Session.set('courseName', result.course_name);




                                                if (typeof (Storage) !== "undefined")
                                                {
                                                    // Store
                                                    localStorage.setItem("category", result.cat_id);
                                                    localStorage.setItem("subCategory", result.sub_cat_id);
                                                    localStorage.setItem("course", result.course_id);
                                                    var subjectIDS = (result.subjects).toString();
                                                    var subject_for_cache = '';
                                                    for (var i = 0; i < (result.subjects).length; i++) {
//                                        console.log('subjectIDS_each',result.subjects[i].id);
                                                        var temp = result.subjects[i].id;
                                                        if (i == 0) {
                                                            subject_for_cache = temp;
                                                        } else {
                                                            subject_for_cache = subject_for_cache + ',' + temp;
                                                        }

                                                    }
                                                    console.log('subject_for_cache', subject_for_cache);
                                                    localStorage.setItem("subjectIDS", subject_for_cache);
                                                    localStorage.setItem("categoryName", result.cat_name);
                                                    localStorage.setItem("subCategoryName", result.sub_cat_name);
                                                    localStorage.setItem("courseName", result.course_name);

                                                    Session.set('categoryNameCache', result.cat_name);
                                                    Session.set('subCategoryNameCache', result.sub_cat_name);
                                                    Session.set('courseNameCache', result.course_name);

                                                }
                                                else
                                                {
                                                    document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                                                }
                                                if (Session.get('coming_from_free_trial') == 1) {
                                                    Modal.hide('sign_in');
                                                    setTimeout(function () {
                                                        $('#mask1').hide();
                                                        Modal.show('congrats');
                                                        console.log("congrats 2");
                                                    }, 200)
                                                    Session.set('coming_from_free_trial_preference', 1);
                                                }

                                                if (Session.get('coming_from_subscription') == 1 || Session.get('coming_from_subscription_pricing') == 1) {
                                                    Modal.hide('sign_in');
                                                    Router.go('/subscription/plan');
                                                }

                                                if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_free_trial') && !Session.get('coming_from_subscription') && !Session.get('coming_from_subscription_pricing')) {
                                                    console.log('coming_in_the_wall');
                                                    Modal.hide('sign_in');
                                                    if (result.course_name != '') {
                                                        getCommonUrl();
                                                    }
                                                    //Router.go('/wall');
                                                }
                                                //Router.go('/wall');
                                            });
                                    if (Session.get("coming_from_cart") == 1) {
                                        Modal.hide('sign_in');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_cart');
                                        var cart_data = Session.get("add_to_cart_by_guest");
                                        var userId = Session.get('landing_user_profile_id');
                                        ;
                                        var token = cart_data.token;
                                        var dataFrom = 'tdl';
                                        var type = cart_data.type;
                                        var packageId = cart_data.packageId;
                                        var packageSubscriptionId = cart_data.packageSubscriptionId;
                                        var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                                        if (buy_now == false) {
                                            $('#signin').modal('hide');
                                            var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                                        } else {
                                            $('#signin').modal('hide');
                                            Router.go('/express_checkout/go');
                                        }
                                    }
                                    
                                     if (Session.get("coming_from_study_pdp") == 1) {
                                        Modal.hide('sign_up');
                                        //                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_study_pdp');
                                        var study_data = Session.get("study_pdp_guest");
                                        if (study_data) {
                                            Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                                Session.set('chapter_content_list', result);
                                                var slugData = getcustomData(Session.get('about_course_title'));
                                                if (study_data.isTestSeries == 0) {
                                                    Router.go('/' + slugData + '/chapter_content');
                                                } else {
                                                    Router.go('/' + slugData + '/chapter_content_test');
                                                }
                                            });
                                        }
                                    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                } else {
                                    if ((Session.get('courseId') || Session.get('courseIdCache')) && Session.get('coming_from_free_trial_wall')) {
                                        Modal.hide('sign_in');
                                         if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_subscription')) {
                                            location.reload();
                                        }
                                    } else {
                                        Modal.hide('sign_in');
                                        // Modal.hide('sign_up');
                                        // theDiv = $("#getStartId").attr("href");
                                        //                  $(theDiv).show();
                                        // Router.go('/wall');
                                        window.location.href = "#getstarted";
                                    }

                                    console.log('user_id', result);
                                    Session.set('global_user_id', result.id);
                                    $(document).ready(function () {
                                        // $('.sign-up').hide();
                                        $('.sign-in').hide();
                                        Session.set('landing_user_profile', result.name);
                                        Session.set('landing_user_profile_id', result.id);
                                        if (typeof (Storage) !== "undefined")
                                        {
                                            // Store
                                            localStorage.setItem("userId", result.id);
                                        }
                                        else
                                        {
                                            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                                        }
                                        $('.user_profile_landing').show();
                                    });
                                    if (Session.get('coming_from_free_trial') == 1) {
                                        Modal.hide('sign_in');
                                        // theDiv = $("#getStartId").attr("href");
                                        //          $(theDiv).show();
                                        // Router.go('/wall');
                                        window.location.href = "#getstarted";
                                        setTimeout(function () {
                                            $('#mask1').hide();
                                            Modal.show('congrats');
                                            console.log("congrats 3");
                                        }, 200)
                                    } else if (Session.get('coming_from_free_trial_wall') == 1) {
                                        Modal.hide('sign_in');
                                        setTimeout(function () {
                                            $('#mask1').hide();
                                            Modal.show('congrats');
                                            console.log("congrats 4");
                                        }, 200)
                                    }

                                    if (Session.get('coming_from_subscription') == 1) {
                                        Modal.hide('sign_in');
                                        Router.go('/subscription/plan');
                                    }
                                    if (Session.get(' coming_from_subscription_pricing') == 1) {
                                        Modal.hide('sign_in');
                                        Router.go('/subscription/plan');
                                    }

                                    if (Session.get("coming_from_cart") == 1) {
                                        Modal.hide('sign_in');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_cart');
                                        var cart_data = Session.get("add_to_cart_by_guest");
                                        var userId = result.id;
                                        var token = cart_data.token;
                                        var dataFrom = 'tdl';
                                        var type = cart_data.type;
                                        var packageId = cart_data.packageId;
                                        var packageSubscriptionId = cart_data.packageSubscriptionId;
                                        var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                                        if (buy_now == false) {
                                            $('#signin').modal('hide');
                                            var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                                        } else {
                                            $('#signin').modal('hide');
                                            Router.go('/express_checkout/go');
                                        }
                                    }
                                    // alert(window.location.href);
                                    
                                    if (Session.get("coming_from_study_pdp") == 1) {
                                        Modal.hide('sign_up');
                                        //                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_study_pdp');
                                        var study_data = Session.get("study_pdp_guest");
                                        if (study_data) {
                                            Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                                Session.set('chapter_content_list', result);
                                                var slugData = getcustomData(Session.get('about_course_title'));
                                                if (study_data.isTestSeries == 0) {
                                                    Router.go('/' + slugData + '/chapter_content');
                                                } else {
                                                    Router.go('/' + slugData + '/chapter_content_test');
                                                }
                                            });
                                        }
                                    }
                                }
                                
                                if(detail.id && Session.get('join_course_clicked')==1){
                                    Meteor.call('joinCourse', parseInt(detail.id), 'global', parseInt(Session.get('join_package_id')), function (error, result) {
                                    var data = JSON.parse(result.content);
                                    var status = data.status;
                                    if (status == 'true') {
                                        if(Session.get('join_course_is_test')==1){
                                            Router.go('/my_test_series');
                                        }else{
                                            Router.go('/my_course');
                                        }

                                        var msg = "Course added to My Courses section (Under Course Tab) on the left. Access Join courses and download them via our PC app from My Courses.";
                                                     toastr.success(msg);

                                         ga('send', {
                                                hitType: 'event',
                                                eventCategory: 'course_join',
                                                eventAction: 'course_joined_successfully',
                                                eventValue: pckg_id
                                             });

                                    } 
                                    });
                                }

                            });

                        } else {
                            ////////////////////alert login via proper

                            toastr.warning("Please login via proper mode");

                        }


                    });
                }

            });

        });
    },
    'click #google-login': function (event) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'sign_in',
            eventAction: 'sign_in_google_clicked',
            eventLabel: 'landing page'
        });
        Meteor.loginWithGoogle({}, function (err) {

            // Router.go('/wall');
            if (err) {
                throw new Meteor.Error("Google login failed");
            }
            // var userId = Meteor.call('autoIncrement');
            var name = Meteor.user().profile.name;
            console.log("googleName", name);
            // var created = new Date();
            // created = new Date(created.setMinutes(created.getMinutes() + 330));

            var googleId = Meteor.user().services.google.id;
            // var role=12;
            var mode = "3";
            var email = Meteor.user().services.google.email;
            var flag = 0;

            Meteor.call('isUserDuplicate', email, function (error, result) {

//    alert(result);

                if (result == false) {
                    Meteor.call('web_user_register_mode', mode, email, name, googleId, function (error, reg) {
//            alert(reg);
                        console.log("web_user_register_mode", reg["name"]);

                        Modal.hide('sign_in');

                        Session.set('landing_user_profile', reg.name);
                        Session.set('landing_user_profile_id', reg.id);

                        console.log("landing_user_profile", reg.name);
                        console.log('landing_user_profile_id', reg.id);

                        if (Session.get('coming_from_free_trial') == 1) {
                            $('.sign-up').hide();
                            setTimeout(function () {
                                $('#mask1').hide();
                                Modal.show('congrats')
                                console.log("congrats 1");
                            }, 1000);
                            // theDiv = $("#getStartId").attr("href");
                            window.location.href = "#getstarted";
                            // $(theDiv).show();
                        }
                        if (Session.get('global_grade_id') || Session.get('selectedSubjects')) {
                            Modal.hide('sign_up');
                            var token = 'global';
                            Meteor.call('setUserPreference', reg.id, token,
                                    Session.get('categoryId'), Session.get('subCategoryId'),
                                    Session.get('global_grade_id'), Session.get('selectedSubjects').map(Number), function (error, result) {

                                console.log("use preference set", result);
                                console.log("use preference error", error);
                            });
                            if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_subscription')) {
                                location.reload();
                            }
                        } else {
                            console.log("getStartId 1");
                            Modal.hide('sign_up');
                            theDiv = $("#getStartId").attr("href");
                            console.log("theDiv", theDiv);

                            // Router.go('/wall');
                            window.location.href = "#getstarted";
                            // $(theDiv).show();
                        }

                        if (Session.get('coming_from_subscription') == 1) {
                            Modal.hide('sign_up');
                            Router.go('/subscription/plan');
                        }
                        if (Session.get(' coming_from_subscription_pricing') == 1) {
                            Modal.hide('sign_up');
                            Router.go('/subscription/plan');
                        }
                        
                        if (Session.get("coming_from_cart") == 1) {
                            Modal.hide('sign_in');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                            Session.clear('coming_from_cart');
                            var cart_data = Session.get("add_to_cart_by_guest");
                            var userId = Session.get('landing_user_profile_id');
                            var token = cart_data.token;
                            var dataFrom = 'tdl';
                            var type = cart_data.type;
                            var packageId = cart_data.packageId;
                            var packageSubscriptionId = cart_data.packageSubscriptionId;
                            var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                            if (buy_now == false) {
                                $('#signup').modal('hide');
                                var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                            } else {
                                $('#signup').modal('hide');
                                Router.go('/express_checkout/go');
                            }
                        }

                        if (Session.get("coming_from_study_pdp") == 1) {
                            Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                            Session.clear('coming_from_study_pdp');
                            var study_data = Session.get("study_pdp_guest");
                            if (study_data) {
                                Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                    Session.set('chapter_content_list', result);
                                    var slugData = getcustomData(Session.get('about_course_title'));
                                    if (study_data.isTestSeries == 0) {
                                        Router.go('/' + slugData + '/chapter_content');
                                    } else {
                                        Router.go('/' + slugData + '/chapter_content_test');
                                    }
                                });
                            }
                        }
                        
                        if(reg.id && Session.get('join_course_clicked')==1){
                            Meteor.call('joinCourse', parseInt(reg.id), 'global', parseInt(Session.get('join_package_id')), function (error, result) {
                            var data = JSON.parse(result.content);
                            var status = data.status;
                            if (status == 'true') {
                                if(Session.get('join_course_is_test')==1){
                                    Router.go('/my_test_series');
                                }else{
                                    Router.go('/my_course');
                                }

                                var msg = "Course added to My Courses section (Under Course Tab) on the left. Access Join courses and download them via our PC app from My Courses.";
                                             toastr.success(msg);

                                 ga('send', {
                                        hitType: 'event',
                                        eventCategory: 'course_join',
                                        eventAction: 'course_joined_successfully',
                                        eventValue: pckg_id
                                     });

                            } 
                            });
                        }

                    })
                } else {
                    Meteor.call('emailAndMode', email, mode, function (error, flag) {

                        if (flag) {
                            ga('send', {
                                hitType: 'event',
                                eventCategory: 'sign_in',
                                eventAction: 'sign_in_google_successfull',
                                eventLabel: 'landing page'
                            });
                            Meteor.call('emailUserDetails', email, function (error, detail) {
                                Session.set('landing_user_profile_id', detail.id);
                                if (detail.subscription_expiry_date) {
                                    if (detail.subscription_expiry_date > date) {
                                        Session.setTemp('global_flag_free', true);
                                    }
                                }
                                console.log("emailUserDetails", detail);

                                if (detail["preference"]) {
                                    //////////////////////set preference

                                    Session.set('landing_user_profile', detail.name);
                                    Session.set('landing_user_profile_id', detail.id);
                                    Session.set('global_grade_id', detail.preference.course.id);
                                    Session.set('global_subject_id', detail.preference.course.subject_id);
                                    Session.set('categoryId', detail.preference.cat_id);
                                    Session.set('subCatId', detail.preference.sub_cat_id);
                                    Session.set('courseId', detail.preference.course.id);
                                    console.log("detail", JSON.stringify(detail["preference"]));
                                    Meteor.call('fetchPreferenceWeb', detail.preference.cat_id, detail.preference.sub_cat_id,
                                            detail.preference.course.id, detail.preference.course.subject_id, function (error, result) {
                                                console.log('fetchPreferenceWeb', result);

                                                // alert("result");

                                                var subjectName = "";
                                                for (var i = 0; i < (result.subjects).length; i++) {

                                                    if (i == 0)
                                                    {
                                                        subjectName = result.subjects[i].name;
                                                    } else {
                                                        subjectName = subjectName + ", " + result.subjects[i].name;
                                                    }

                                                }
                                                if (subjectName.length > 80) {
                                                    subjectName = subjectName.substring(0, 80) + "...";
                                                }


                                                console.log("web subjectname during sign in", subjectName);
                                                Session.set("subjectName", subjectName);
                                                Session.set('courseName', result.course_name);



                                                if (typeof (Storage) !== "undefined")
                                                {
                                                    // Store
                                                    localStorage.setItem("category", result.cat_id);
                                                    localStorage.setItem("subCategory", result.sub_cat_id);
                                                    localStorage.setItem("course", result.course_id);
                                                    var subjectIDS = (result.subjects).toString();
                                                    var subject_for_cache = '';
                                                    for (var i = 0; i < (result.subjects).length; i++) {
//                                        console.log('subjectIDS_each',result.subjects[i].id);
                                                        var temp = result.subjects[i].id;
                                                        if (i == 0) {
                                                            subject_for_cache = temp;
                                                        } else {
                                                            subject_for_cache = subject_for_cache + ',' + temp;
                                                        }

                                                    }
                                                    console.log('subject_for_cache', subject_for_cache);
                                                    localStorage.setItem("subjectIDS", subject_for_cache);
                                                    localStorage.setItem("categoryName", result.cat_name);
                                                    localStorage.setItem("subCategoryName", result.sub_cat_name);
                                                    localStorage.setItem("courseName", result.course_name);

                                                    Session.set('categoryNameCache', result.cat_name);
                                                    Session.set('subCategoryNameCache', result.sub_cat_name);
                                                    Session.set('courseNameCache', result.course_name);
                                                }
                                                else
                                                {
                                                    document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                                                }
                                                if (Session.get('coming_from_free_trial') == 1) {
                                                    Modal.hide('sign_in');
                                                    setTimeout(function () {
                                                        $('#mask1').hide();
                                                        Modal.show('congrats');
                                                        console.log("congrats 2");
                                                    }, 200)
                                                    Session.set('coming_from_free_trial_preference', 1);
                                                }

                                                if (Session.get('coming_from_subscription') == 1 || Session.get('coming_from_subscription_pricing') == 1) {
                                                    Modal.hide('sign_in');
                                                    Router.go('/subscription/plan');
                                                }

                                                if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_free_trial') && !Session.get('coming_from_subscription') && !Session.get('coming_from_subscription_pricing')) {
                                                    console.log('coming_in_the_wall');
                                                    Modal.hide('sign_in');
                                                    if (result.course_name != '') {
                                                        getCommonUrl();
                                                    }
                                                    //Router.go('/wall');
                                                }
                                                //Router.go('/wall');
                                            });
                                    if (Session.get("coming_from_cart") == 1) {
                                        Modal.hide('sign_in');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_cart');
                                        var cart_data = Session.get("add_to_cart_by_guest");
                                        var userId = Session.get('landing_user_profile_id');
                                        ;
                                        var token = cart_data.token;
                                        var dataFrom = 'tdl';
                                        var type = cart_data.type;
                                        var packageId = cart_data.packageId;
                                        var packageSubscriptionId = cart_data.packageSubscriptionId;
                                        var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                                        if (buy_now == false) {
                                            $('#signin').modal('hide');
                                            var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);

                                        } else {
                                            $('#signin').modal('hide');
                                            Router.go('/express_checkout/go');
                                        }
                                    }

                                    if (Session.get("coming_from_study_pdp") == 1) {
                                        Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_study_pdp');
                                        var study_data = Session.get("study_pdp_guest");
                                        if (study_data) {
                                            Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                                Session.set('chapter_content_list', result);
                                                var slugData = getcustomData(Session.get('about_course_title'));
                                                if (study_data.isTestSeries == 0) {
                                                    Router.go('/' + slugData + '/chapter_content');
                                                } else {
                                                    Router.go('/' + slugData + '/chapter_content_test');
                                                }
                                            });
                                        }
                                    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                }

                                else {
                                    if ((Session.get('courseId') || Session.get('courseIdCache')) && Session.get('coming_from_free_trial_wall')) {
                                        Modal.hide('sign_in');
                                        if (!Session.get('join_course_clicked') && !Session.get("coming_from_cart") && !Session.get('coming_from_study_pdp') && !Session.get('coming_from_subscription')) {
                                            location.reload();
                                        }
                                    } else {
                                        Modal.hide('sign_in');
                                        // Modal.hide('sign_up');
                                        // theDiv = $("#getStartId").attr("href");
                                        //                  $(theDiv).show();
                                        // Router.go('/wall');
                                        window.location.href = "#getstarted";
                                    }

                                    console.log('user_id', result);
                                    Session.set('global_user_id', result.id);
                                    $(document).ready(function () {
                                        // $('.sign-up').hide();
                                        $('.sign-in').hide();
                                        Session.set('landing_user_profile', result.name);
                                        Session.set('landing_user_profile_id', result.id);
                                        if (typeof (Storage) !== "undefined")
                                        {
                                            // Store
                                            localStorage.setItem("userId", result.id);
                                        }
                                        else
                                        {
                                            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                                        }
                                        $('.user_profile_landing').show();
                                    });
                                    if (Session.get('coming_from_free_trial') == 1) {
                                        Modal.hide('sign_in');
                                        // theDiv = $("#getStartId").attr("href");
                                        //          $(theDiv).show();
                                        // Router.go('/wall');
                                        window.location.href = "#getstarted";
                                        setTimeout(function () {
                                            $('#mask1').hide();
                                            Modal.show('congrats');
                                            console.log("congrats 3");
                                        }, 200)
                                    } else if (Session.get('coming_from_free_trial_wall') == 1) {
                                        Modal.hide('sign_in');
                                        setTimeout(function () {
                                            $('#mask1').hide();
                                            Modal.show('congrats');
                                            console.log("congrats 4");
                                        }, 200)
                                    }

                                    if (Session.get('coming_from_subscription') == 1) {
                                        Modal.hide('sign_in');
                                        Router.go('/subscription/plan');
                                    }
                                    if (Session.get(' coming_from_subscription_pricing') == 1) {
                                        Modal.hide('sign_in');
                                        Router.go('/subscription/plan');
                                    }

                                    if (Session.get("coming_from_cart") == 1) {
                                        Modal.hide('sign_in');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_cart');
                                        var cart_data = Session.get("add_to_cart_by_guest");
                                        var userId = result.id;
                                        var token = cart_data.token;
                                        var dataFrom = 'tdl';
                                        var type = cart_data.type;
                                        var packageId = cart_data.packageId;
                                        var packageSubscriptionId = cart_data.packageSubscriptionId;
                                        var buy_now = cart_data.buy_now;
//                        cartPurchase(dataFrom,type,userId,packageId,token,packageSubscriptionId){
                                        if (buy_now == false) {
                                            $('#signin').modal('hide');
                                            var add_cart = cartPurchase(dataFrom, type, userId, packageId, token, packageSubscriptionId);
                                        } else {
                                            $('#signin').modal('hide');
                                            Router.go('/express_checkout/go');
                                        }
                                    }
                                    
                                    if (Session.get("coming_from_study_pdp") == 1) {
                                        Modal.hide('sign_up');
//                      Session.setTemp("add_to_cart_by_guest", {"token" :token ,'type':type,'packageId':packageId,'packageSubscriptionId':packageSubscriptionId,'buy_now',false });
                                        Session.clear('coming_from_study_pdp');
                                        var study_data = Session.get("study_pdp_guest");
                                        if (study_data) {
                                            Meteor.call('getPackageChapterWeb', study_data.userId, study_data.token, study_data.chapterId, study_data.isTestSeries, study_data.grade_id, function (error, result) {
                                                Session.set('chapter_content_list', result);
                                                var slugData = getcustomData(Session.get('about_course_title'));
                                                if (study_data.isTestSeries == 0) {
                                                    Router.go('/' + slugData + '/chapter_content');
                                                } else {
                                                    Router.go('/' + slugData + '/chapter_content_test');
                                                }
                                            });
                                        }
                                    }
                                    
                                }

                                if(detail.id && Session.get('join_course_clicked')==1){
                            Meteor.call('joinCourse', parseInt(detail.id), 'global', parseInt(Session.get('join_package_id')), function (error, result) {
                            var data = JSON.parse(result.content);
                            var status = data.status;
                            if (status == 'true') {
                                if(Session.get('join_course_is_test')==1){
                                    Router.go('/my_test_series');
                                }else{
                                    Router.go('/my_course');
                                }

                                var msg = "Course added to My Courses section (Under Course Tab) on the left. Access Join courses and download them via our PC app from My Courses.";
                                             toastr.success(msg);

                                 ga('send', {
                                        hitType: 'event',
                                        eventCategory: 'course_join',
                                        eventAction: 'course_joined_successfully',
                                        eventValue: pckg_id
                                     });

                            } 
                            });
                        }
                            });

                        } else {
                            ////////////////////alert login via proper

                            toastr.warning("Please login via proper mode");

                        }


                    });
                }

            });

        });
    },
    "click .signup_from_signin": function (e) {
        e.preventDefault();
        Modal.hide('sign_in');
        setTimeout(function () {
            Modal.show('sign_up')
        }, 200)
    }
    /*
     'click #logout': function(event) {
     Meteor.logout(function(err){
     if (err) {
     throw new Meteor.Error("Logout failed");
     }
     })
     }
     */
});

Template.sign_in.onRendered(function () {
    $('.login').validate({
        rules: {
            email_id1: {
                required: true,
                email: true
            },
            user_password1: {
                required: true,
                minlength: 6
            }
        },
        messages: {
            email_id1: {
                required: "You must enter an email address.",
                email: "You've entered an invalid email address."
            },
            user_password1: {
                required: "You must enter a password.",
                minlength: "Your password must be at least 6 characters."
            }
        }
    });
});


//SUBSCRIBE NOW
Template.start.events({
    'click #landing_subscribe': function (event) {
//        Router.go('/subscription');
        window.location.href = '/subscription/plan';
    },
    'click .free_trial': function (e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'free_trial',
            eventAction: 'free_trial_clicked',
            eventLabel: 'landing_page'
        });
        if (Session.get('landing_user_profile_id')) {
//                   console.log('landing_user_profile in free trial',Session.get('landing_user_profile'));
            Session.set('global_free_subscription', true);
            Modal.show('congrats');
            console.log("congrats 5");
        } else {
            Session.setTemp('coming_from_free_trial', 1);
            Modal.show('sign_in');
        }
//        Router.go('/subscription');
    },
    'click .subscription_from_landing': function (e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'paid_subscription',
            eventAction: 'subscription_clicked',
            eventLabel: 'landing_page'
        });
        if (Session.get('landing_user_profile_id')) {
//                   console.log('landing_user_profile in free trial',Session.get('landing_user_profile'));
            Session.set('global_paid_subscription', true);
            Session.set('validityPrice_from_pricing_subscription', 3999);
            Router.go('/subscription/plan');
        } else {
            Session.setTemp('coming_from_subscription', 1);
            Modal.show('sign_in');
        }
    },
    'click .bannerbtn': function (e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'free_trial',
            eventAction: 'free_trial_clicked',
            eventLabel: 'landing_page_banners'
        });
        if (Session.get('landing_user_profile_id')) {
            console.log("////////////////////////////////", Session.get('landing_user_profile_id'));
            Modal.show("congrats");
        } else {
            Session.setTemp('coming_from_free_trial', 1);
            Modal.show('sign_in');

        }
    },
    'click .banner_subscription': function (e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'paid_subscription',
            eventAction: 'subscription_clicked',
            eventLabel: 'landing_page_banners'
        });
        if (Session.get('landing_user_profile_id')) {
//                   console.log('landing_user_profile in free trial',Session.get('landing_user_profile'));
            Session.set('global_paid_subscription', true);
            Session.set('validityPrice_from_pricing_subscription', 3999);
            Router.go('/subscription/plan');
        } else {
            Session.setTemp('coming_from_subscription', 1);
            Modal.show('sign_in');
        }
    }
});

Template.pricing.rendered = function () {
    var userId = 40000480;
    if (Session.get('landing_user_profile_id')) {
        var userId = Session.get('landing_user_profile_id');
    }
    var token = 'global';
//            subscriptionPlansWeb: function (userId, token) {
    Meteor.call('subscriptionPlansWeb', userId, token, function (error, result) {
        console.log('subs_result', result);
        Session.set('subscription_data', result);
    });
};

Template.pricing.events({
    'click .free_trial': function (e) {
        e.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'free_trial',
            eventAction: 'free_trial_clicked',
            eventLabel: 'landing_page_subscription_plan'
        });
        if (Session.get('landing_user_profile_id')) {
//                   console.log('landing_user_profile in free trial',Session.get('landing_user_profile'));
            Session.set('global_free_subscription', true);
            Modal.show('congrats');
            console.log("congrats 6");
        } else {
            Session.setTemp('coming_from_free_trial', 1);
            Modal.show('sign_in');
        }
//        Router.go('/subscription');

    },
    'click .subscribenowPricing': function (event, template) {
        event.preventDefault();
        ga('send', {
            hitType: 'event',
            eventCategory: 'paid_subscription',
            eventAction: 'subscription_clicked',
            eventLabel: 'landing_page_subscription_plan'
        });
        if (Session.get('landing_user_profile_id')) {
//              console.log('landing_user_profile in free trial',Session.get('landing_user_profile'));
            Session.set('global_paid_subscription', true);
            var element = template.find('input:radio[name=radio]:checked');
            var validityId = $(element)[0].id;
            var price_value = $(element)[0].value;
//                console.log('validityId',validityId);
//                console.log('price_value',price_value);
            Session.set('validityId_from_pricing_subscription', validityId);
            Session.set('validityPrice_from_pricing_subscription', price_value);

            if (Session.get('validityId_from_pricing_subscription')) {
                console.log('index_subscription', Session.get('validityId_from_pricing_subscription'));

                Router.go('/subscription/plan');
            }

        } else {
            var element = template.find('input:radio[name=radio]:checked');
            var validityId = $(element)[0].id;
            console.log('validityId', validityId);
            Session.set('validityId_from_pricing_subscription', validityId);
            Session.setTemp('coming_from_subscription_pricing', 1);

            Modal.show('sign_in');
        }
    }
});
Template.pricing.helpers({
    'subscription_val': function () {
        var data = Session.get('subscription_data');
        var data1 = JSON.parse(data.content);
        console.log('subscription_val_result', data1);
        console.log('data1_subs', data1.result_data.subscriptions[0]);
        return data1.result_data.subscriptions[0].Validity;
    },
    'check_price': function (param1, param2) {
        console.log('param1', param1);
        console.log('param2', param2);
        if (param1 > param2) {
            return true
        }
    },
    'checked_button': function (param1, param2) {
        console.log('param1', param1);
        console.log('param2', param2);
        if (param1 == param2) {
            return true
        }
    },
    'is_free_trial_taken': function () {
        if (Session.get('free_trial_taken') == true) {
            return false;
        } else {
            return true;
        }
    }
});



Template.congrats.events({
    'click #congratsProceedFreeTrial': function (event, template) {
        // e.preventDefault();
        $('#mask1').hide();
        console.log("You clicked congrats proceed button");
//        setTimeout(function(){
//        Modal.hide('congrats');
        $('#congratspop').modal('hide');
//        }, 2000);
        var userId = Session.get('landing_user_profile_id');
        var subsId = 1;
//            free_trial_web: function (userId, token, validity, subsId) {
        var validity_id = 4;
        if (Session.get('free_trial_taken') == true) {
            toastr.warning('You have already availed 7-day FREE Trial.');
            return false;
        }
        Meteor.call('free_trial_web', userId, 'global', validity_id, subsId, function (error, result) {
            var free_trial_result = JSON.parse(result.content);
            console.log('free_trial_web_result', JSON.parse(result.content));

            Session.setTemp('global_flag_free', true);
            Session.setTemp('free_trial_taken', true);
            if (free_trial_result.status == true) {
                ga('send', {
                    hitType: 'event',
                    eventCategory: 'free_trial',
                    eventAction: 'free_trial_activated',
                });
                toastr.success('Your free trial has been activated successfully.');
            } else {
                toastr.warning('You have already availed 7-day FREE Trial.');
            }
        });

        if (Session.get('coming_from_free_trial_preference') == 1) {
            console.log("coming_from_free_trial_preference");
            setTimeout(function () {
                getCommonUrl();
                //Router.go('/wall');
            }, 8000)

        } else if (Session.get('coming_from_free_trial_other_page') == 1) {
            console.log("coming_from_free_trial_other_page");
            window.location.reload(true);
        }
    }
});


/*
 HTTP.call("POST", "https://iproflive.iprofindia.com/2_6/Recommendations/system_recommendations",
 {data: {some: "json", stuff: 1}},
 function (error, result) {
 if (!error) {
 console.log('result_tutor',result);
 // Session.set("tutorsCount", result);
 }
 });
 
 */



/*
 Template.qod.onCreated(function() {
 Blaze._allowJavascriptUrls();
 Meteor.call('getQdData',[12,13],[24,25], function(error, result){
 Session.set('ques_ans', result);
 //var x = Session.get('count');
 //console.log('count_inside',x.count.countCourses);
 });
 });
 
 
 Template.qod.helpers({
 'ques_statement': function(){
 var ques = Session.get('ques_ans');
 if(ques && ques.statement){
 var ques_text = ques.statement;
 //console.log('count_inside',x.count.countTests);
 }
 return (ques_text);
 }
 
 });
 
 
 Template.funzone.onCreated(function() {
 Blaze._allowJavascriptUrls();
 Meteor.call('get_funzone',213,[12,13],[24,25], function(error, result){             //parameters --- user_id, course_id, subject_id
 Session.set('ques_ans', result);
 //var x = Session.get('count');
 //console.log('count_inside',x.count.countCourses);
 });
 });
 
 Template.funzone.helpers({
 'fun_facts': function(){
 
 },
 'fun_videos': function(){
 
 },
 'fun_articles': function(){
 
 }
 
 });
 
 */

/*     Blaze._allowJavascriptUrls();
 Template.getStarted.onCreated(function() {
 Blaze._allowJavascriptUrls();
 });     */

/*     Blaze._allowJavascriptUrls();
 Template.getStarted.onCreated(function() {
 Blaze._allowJavascriptUrls();
 });     */
Session.keys = {}
Meteor.call('getCategories', function (error, result) {
    arrCat = [];
    $.each(result, function (i, n) {
        if (n.id == '52') {
            n.dispClass = 'competitive-exam';
        }
        if (n.id == '53') {
            n.dispClass = 'english-language';
        }
        if (n.id == '54') {
            n.dispClass = 'gk-skills';
        }
        if (n.id == '55') {
            n.dispClass = 'ias-govt-jobs';
        }
        if (n.id == '56') {
            n.dispClass = 'prog-soft';
        }
        if (n.id == '57') {
            n.dispClass = 'school-jobs';
        }
        if (n.id == '58') {
            n.dispClass = 'collage-studies';
        }
        if (n.id == '59') {
            n.dispClass = 'prof-course';
        }
        arrCat.push(n);
    });
    Session.set('categories', arrCat);
    Session.set('stepNo', 1);
});

Template.getStarted.helpers({
    'categories': function () {
        return Session.get('categories');
    },
    'categoryId': function () {
        return Session.get('categoryId');
    },
    'categoryName': function () {
        return Session.get('categoryName');
    },
    'subCategories': function () {
        return Session.get('subCategories');
    },
    'subCategoryId': function () {
        return Session.get('subCategoryId');
    },
    'subCategoryName': function () {
        return Session.get('subCategoryName');
    },
    'catClass': function () {
        return Session.get('catClass');
    },
    'courses': function () {
        return Session.get('courses');
    },
    'courseId': function () {
        return Session.get('courseId');
    },
    'courseName': function () {
        return Session.get('courseName');
    },
    'popularCourses': function () {
        console.log('popularCourses', Session.get('popularCourses'));
        return Session.get('popularCourses');
    },
    'subjects': function () {
        return Session.get('subjects');
    },
    'no_of_courses': function (param1) {
        if (param1 == 52) {
            return 529;
        } else if (param1 == 55) {
            return 9;
        } else if (param1 == 53) {
            return 47;
        } else if (param1 == 54) {
            return 59;
        } else if (param1 == 56) {
            return 128;
        } else if (param1 == 57) {
            return 923;
        } else if (param1 == 58) {
            return 97;
        } else if (param1 == 59) {
            return 80;
        }

    },
    'change_subj_color_school_k12': function () {
        if (Session.get('cat_id_for_color')==57) {
            return true;
        }else{
            return false;
        }
    }
//        'Step1Class': function () {
//              if(Session.get('stepNo')<4){
//                return 'active checked';
//            }
//          },
//        'Step2Class': function () {
//             if(Session.get('stepNo') <3){
//                return 'active checked';
//            }
//          },
//        'Step3Class': function () {
//              if(Session.get('stepNo')==3){
//                return 'active checked';
//            }
//        },
//        'Step4Class': function () {
//              if(Session.get('stepNo')==4){
//                return 'active checked';
//            }
//        }
});


Template.getStarted.events({
    'click .step-1 .card:not("#popular")': function (event, template) {
// event.preventDefault();
        Session.clear('cat_id_for_color');
        $('#stepper_1').addClass('checked');
        $('#stepper_2').addClass('active');
        Session.set('stepNo', 2);
        var catId = parseInt(event.currentTarget.id);
        Meteor.call('getSubCategories', catId, function (error, result) {
            arrSubCat = [];
            $.each(result, function (i, n) {
                categoryId = n.id;
                categoryName = n.display_name;
                $.each(n.sub_category, function (j, m) {
                    arrSubCat.push(m);
                });
            });
            if (catId == '52') {
                var catClass = 'competitive-exam';
            }
            if (catId == '53') {
                var catClass = 'english-language';
            }
            if (catId == '54') {
                var catClass = 'gk-skills';
            }
            if (catId == '55') {
                var catClass = 'ias-govt-jobs';
            }
            if (catId == '56') {
                var catClass = 'prog-soft';
            }
            if (catId == '57') {
                var catClass = 'school-jobs';
            }
            if (catId == '58') {
                var catClass = 'collage-studies';
            }
            if (catId == '59') {
                var catClass = 'prof-course';
            }

            Session.set('categoryId', categoryId);
            Session.set('categoryName', categoryName);
            Session.set('subCategories', arrSubCat);
            console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', Session.get('subCategories'));
            Session.set('catClass', catClass);
        });
        ga('send', {
            hitType: 'event',
            eventCategory: 'preference',
            eventAction: 'category_selected',
            eventValue: Session.get('categoryName')
        });
        Session.setTemp('cat_id_for_color',this.id);
    },
    'click .step-2 .box': function (event, template) {
        $('#stepper_2').addClass('checked');
        $('#stepper_3').addClass('active');
        Session.set('stepNo', 3);
        var subCatId = parseInt(event.currentTarget.id);
        Session.set('subCatId', subCatId);
        Meteor.call('getCourses', subCatId, function (error, result) {
            arrCourse = [];
            $.each(result, function (i, n) {
// categoryName = n.display_name;
                $.each(n.sub_category, function (j, m) {
                    if (m.id == subCatId)
                    {
                        subCategoryId = m.id;
                        subCategoryName = m.display_name;
                        $.each(m.course, function (k, l) {
                            arrCourse.push(l);
                        });
                    }
                });
            });
            Session.set('subCategoryId', subCategoryId);
            Session.set('subCategoryName', subCategoryName);
            Session.set('courses', arrCourse);

// console.log(Session.get('courses'));
        });
        ga('send', {
            hitType: 'event',
            eventCategory: 'preference',
            eventAction: 'sub_category_selected',
            eventValue: Session.get('subCategoryName')
        });
    },
    'click #popular': function (event, template) {
        Meteor.call('getPopularCourses', function (error, result) {
// console.log(result);
            arrPopularCourse = [];
// console.log(arrPopularCourse);
            Session.set('categoryName', 'Popular Courses');
            // Session.set('subCategoryName', 'Popular Courses');
            Session.set('popularCourses', result[0].popular_courses[0].grade);
            console.log('result', result[0].popular_courses[0]);
// console.log(Session.get('categoryName'));
// console.log(Session.get('popularCourses'));
        });
    },
    'click #popular_course': function (event, template) {
        var courseId = parseInt(event.currentTarget.id);
        Meteor.call('getSubjects', courseId, function (error, result) {
            arrSubject = [];
            $.each(result, function (i, n) {
                categoryName = n.display_name;
                $.each(n.sub_category, function (j, m) {
                    if (m.id == Session.get('subCatId'))
                    {
                        $.each(m.course, function (k, l) {
                            if (l.id == courseId)
                            {
                                courseName = l.display_name;
                                $.each(l.subject, function (h, o) {
                                    arrSubject.push(o);
                                });
                            }
                        });
                    }
                });
            });
            Session.set('courseId', courseId);
            Session.set('courseName', courseName);
            Session.set('subjects', arrSubject);
        });

    },
    'click .step-3 .box': function (event, template) {
        $('#stepper_3').addClass('checked');
        $('#stepper_4').addClass('active');
        Session.set('stepNo', 4);
        var courseId = parseInt(event.currentTarget.id);
        Meteor.call('getSubjects', courseId, function (error, result) {
            arrSubject = [];
            $.each(result, function (i, n) {
                categoryName = n.display_name;
                $.each(n.sub_category, function (j, m) {
                    if (m.id == Session.get('subCatId'))
                    {
                        $.each(m.course, function (k, l) {
                            if (l.id == courseId)
                            {
                                courseName = l.display_name;
                                $.each(l.subject, function (h, o) {
                                    arrSubject.push(o);
                                });
                            }
                        });
                    }
                });
            });
            Session.set('courseId', courseId);
            Session.set('courseName', courseName);
            Session.set('subjects', arrSubject);

            console.log("arrSubject from preference", arrSubject);

            var subjectName = "";
            for (var i = 0; i < arrSubject.length; i++) {
                if (i == 0)
                {
                    subjectName = result[i].subject.name;
                } else {
                    subjectName = subjectName + ", " + result[i].subject.name;
                }
            }
            console.log("subjectName", subjectName);
            console.log("subjectName.len", subjectName.length);
            if (subjectName.length > 80) {
                subjectName = subjectName.substring(0, 80) + "...";
            }
            Session.set("subjectName", subjectName);
            console.log("subjectName", subjectName);
        });
        ga('send', {
            hitType: 'event',
            eventCategory: 'preference',
            eventAction: 'grade_selected',
            eventValue: Session.get('courseName')
        });
        ga('send', {
            hitType: 'event',
            eventCategory: 'preference',
            eventAction: 'subject_selected',
            eventValue: JSON.stringify(Session.get('subjectName'))
        });
        /*            Meteor.call('getTrendingCourses', function(error, result){
         console.log(result);
         });
         Meteor.call('getTrendingTests', function(error, result){
         console.log(result);
         });                             */
        

    },
    'submit form': function (event, template) {
        event.preventDefault();
        $('#mask1').show();
        ga('send', {
            hitType: 'event',
            eventCategory: 'preference',
            eventAction: 'preference_proceed',
            eventLabel: 'landing_page'
        });
        var selected = template.findAll(".submitPreferences input[type=checkbox]:checked");
        var selectedSubjects = _.map(selected, function (item) {
            return item.defaultValue;
        });
        /*        console.log(selectedSubjects);
         console.log(Session.get('categoryId')+" "+Session.get('categoryName'));
         console.log(Session.get('subCategoryId')+" "+Session.get('subCategoryName'));
         console.log(Session.get('courseId')+" "+Session.get('courseName'));
         console.log(Session.get('subjects'));       */
        // selectedSubjects = [47689, 47693, 47690, 47694];
        // selectedSubjects = ["47689", "47693", "47690", "47694"];
        Session.set('selectedSubjects', selectedSubjects);
        var userPrefrences = [{
                'category': Session.get('categoryId'),
                'subCategory': Session.get('subCategoryId'),
                'course': Session.get('courseId'),
                'subjectIDS': Session.get('selectedSubjects'),
            }];
        console.log("//////////////////////////////////////////////////////////////////////////");
        console.log("userPrefrences", Session.get('categoryId'));
        console.log("userPrefrences", Session.get('subCategoryId'));
        console.log("userPrefrences", Session.get('courseId'));
        console.log("userPrefrences", Session.get('selectedSubjects').map(Number));


        Meteor.call('fetchPreferenceWeb', Session.get('categoryId'), Session.get('subCategoryId'),
                Session.get('courseId'),
                Session.get('selectedSubjects').map(Number), function (error, result) {
            console.log('fetchPreferenceWeb', result);


            var subjectName = "";
            for (var i = 0; i < (result.subjects).length; i++) {

                if (i == 0)
                {
                    subjectName = result.subjects[i].name;
                } else {
                    subjectName = subjectName + ", " + result.subjects[i].name;
                }

            }
            if (subjectName.length > 80) {
                subjectName = subjectName.substring(0, 80) + "...";
            }


            console.log("web subjectname during sign in", subjectName);
            Session.set("subjectName", subjectName);
            Session.set('courseName', result.course_name);
            if (result.course_name != '') {
                getCommonUrl();
            }







            if (typeof (Storage) !== "undefined")
            {
                Session.set('categoryName', categoryName);
                // Store
                localStorage.setItem("category", Session.get('categoryId'));
                localStorage.setItem("subCategory", Session.get('subCategoryId'));
                localStorage.setItem("course", Session.get('courseId'));
                localStorage.setItem("subjectIDS", Session.get('selectedSubjects'));
                localStorage.setItem("categoryName", Session.get('categoryName'));
                localStorage.setItem("subCategoryName", Session.get('subCategoryName'));
                localStorage.setItem("courseName", Session.get('courseName'));
            }
            else
            {
                document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
            }

            var userId = Session.get('landing_user_profile_id');
            console.log('userId_for_preference', userId);
//            var userId= 40000461;
            var token = 'global';
            Session.set('userCurrentPrefrences', userPrefrences);
            Session.set('global_grade_id', Session.get('courseId'));

//            Meteor.call('getLocation',val,result_loc.latitude,result_loc.longitude, function(error, result){
            Meteor.call('setUserPreference', userId, token, Session.get('categoryId'), Session.get('subCategoryId'), Session.get('courseId'), Session.get('selectedSubjects').join(","), function (error, result) {
                console.log('result', result);
            });

            console.log("setUserPreference first time", "categoryId", Session.get('categoryId'), "subCategoryId",
                    "gradeId", Session.get('courseId'), "subjectId", Session.get('selectedSubjects'));
            getCommonUrl();
            //window.location.href = '/wall';
            Modal.hide('change_preference_pop_up');

        });
    }
});


Template.user_profile_data.rendered = function () {
    $(document).ready(function () {
        "use strict";
        $(".welcome").click(function (e) {
            $(this).find('i').toggleClass('glyphicon-traingle-bottom').toggleClass('glyphicon-triangle-top');
            /*		$('#arrowdown').removeClass('glyphicon-traingle-bottom');
             $('#arrowdown').addClass('glyphicon-triangle-top');*/
            $(".notifi_pop").hide();
            $(".cartpop").hide();
            $(".welcomepop").toggle();
            e.stopPropagation();

        });

    });
    var userId = Session.get('landing_user_profile_id');
    var token = "global";
    Meteor.call('profileWeb', userId, token, function (error, result) {
        console.log('profileWeb', result);
        Session.set("subscriptionValidityId", result.result_data.subscriptionValidityId);
        Session.set("subscriptionRemainingDays", result.result_data.subscriptionRemainingDays);
        Session.set("subscriberName", result.result_data.personal.name);
//                    alert(result.result_data.subscriptionValidityId);
//                    alert(result.result_data.subscriptionRemainingDays);

//                    alert(JSON.stringify(result));
        // Session.set('login_check_name',result.name);

        var subscriptionValidityId = Session.get('subscriptionValidityId');
        var subscriptionRemainingDays = Session.get('subscriptionRemainingDays');
        var flag = "";
        if (subscriptionRemainingDays == 0) {
            if (subscriptionValidityId == 0) {
                console.log("iprofsubscriptionStart");
                flag = "iprofsubscriptionStart";
            } else {
                console.log("subscriptionExpired");
                flag = "subscriptionExpired";
//            return "subscriptionExpired";
            }
        } else {
            if (subscriptionValidityId != 0) {
                if (subscriptionValidityId == 4) {
                    console.log("mysubscription");
                    flag = "mysubscription";
//                    return "mysubscription";
                } else {
                    console.log("monthssubscription");
                    flag = "monthssubscription";
//                    return "monthssubscription";
                }
            } else {
                console.log("iprofsubscription");
                flag = "iprofsubscription";
//                return "iprofsubscription";
            }


        }
        Session.set("showSubscription", flag);


    });


}

Template.user_profile_data.helpers({
    login_user_name: function () {
        var userId = Session.get('landing_user_profile_id');
        console.log('login_check_login_profile', userId);
//        if(userId){
        Meteor.call('webUserInfo', parseInt(userId), function (error, result) {
            console.log('webUserInfo', result);
            Session.set('user_name', result.name);
        });
        console.log('login_check', userId);
        return Session.get('user_name');
//        }
    },
    'subscriptionRemainingDays': function () {
        return Session.get('subscriptionRemainingDays');
    },
    'subscriptionValidityId': function () {
        return Session.get('subscriptionValidityId');
    },
    'subscriptionPlan': function () {
        var subscriptionValidityId = Session.get('subscriptionValidityId');
        var subscriptionRemainingDays = Session.get('subscriptionRemainingDays');

        console.log("subscriptionValidityId", subscriptionValidityId);
        console.log("subscriptionRemainingDays", subscriptionRemainingDays);

        var flag = "";
        if (subscriptionRemainingDays == 0) {
            console.log("subscriptionExpired");
            flag = "subscriptionExpired";
//            return "subscriptionExpired";
        } else {
            if (subscriptionValidityId != 0) {
                if (subscriptionValidityId == 4) {
                    console.log("mysubscription");
                    flag = "mysubscription";
//                    return "mysubscription";
                } else {
                    console.log("monthssubscription");
                    flag = "monthssubscription";
//                    return "monthssubscription";
                }
            } else {
                console.log("iprofsubscription");
                flag = "iprofsubscription";
//                return "iprofsubscription";
            }


        }
        Session.set("showSubscription", flag);
        return flag;



    },
    'showSubscription': function () {
        return Session.get('showSubscription');
    }

});


Template.footer.rendered = function () {
    $(window).scrollTop(0);
    Session.clear('search_val');
    var data = Session.get('landing_user_profile_id');
    console.log('landing_user_profile_id_index', data);
    Meteor.call('webUserInfo', data, function (error, result) {
        if (result != false) {
            console.log('webUserInfo', result);
            var date = new Date();
            if (result.subscription_expiry_date) {
                if (result.subscription_expiry_date > date) {
                    Session.setTemp('global_flag_free', true);
                    console.log('global_flag_free_index', Session.get('global_flag_free'));
                }
                date = new Date(date.setMinutes(date.getMinutes() + 330));
                Meteor.call('returnDays', date, result.subscription_expiry_date, function (error, result) {
                    if (result) {
                        Session.set('subs_remaining_days', result);
                    }
                })
//                Meteor.call('returnDays', date, result.subscription_expiry_date); 

            }
            if (result.subscription_validity) {
                Session.setTemp('free_trial_taken', true);
            }
        }
    });

    var current = Iron.Location.get();
    if (current.path != '/express_checkout/go') {
        if (data) {
            Session.clear('express_checkout_data');
        }
    }

}


Template.user_profile_data.events({
    'click .mySubscriptionIcon': function (event) {
        event.preventDefault();

        var showSubscription = Session.get("showSubscription");
        console.log("showSubscription", showSubscription);
        Modal.show(showSubscription);


    }

});

Template.topstrip.events({
    'click #getacall': function (event) {
        event.preventDefault();
        $('#getBox').slideToggle();
    },
    'click #callSubmit': function (event) {
        event.preventDefault();
        $('#messageCall').html('<img src="images/loader.gif" >')
        var getMobileVal = $('#getmobile').val();
        Meteor.call('clickTocall', getMobileVal, function (error, result) {
            $('#messageCall').text(result.message);
            if (result.status) {
                $('#messageCall').css('color', 'green');
            } else {
                $('#messageCall').css('color', 'red');
            }
        });
    }
});

Template.footer.created = function () {
    Session.set('currentPage', '');
    Session.clear('onPDPpage');
    Session.clear('onTestPDPpage');
    Session.clear('pdp_page');
    Session.clear('coming_from_subscription_pricing');
    Session.clear('coming_from_subscription');
    Session.clear('coming_from_cart');
    Session.clear('coming_from_study_pdp');
    Session.clear('join_course_clicked');
    Session.clear('join_course_is_test');
}

function getCommonUrl() {
    if (Session.get('express_checkout_data')) {
        return false;
    }
    else {
        var url_string = Session.get('courseName');
        var id = Session.get('global_grade_id');

        var slugData = url_string.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
        slugData = (slugData).replace('--', "-").toLowerCase();
        slugData = (slugData).replace("---", "-").toLowerCase();
        setTimeout(function () {
            if (slugData == 'iit-jee-advanced') {
                Router.go('/iit-jee/' + id);
                $('#mask1').hide();
            } else {
                Router.go('/' + slugData + '/' + id);
                $('#mask1').hide();
            }
        }, 2000);
    }
}
;

Template.start.helpers({
    'is_free_trial_taken': function () {
        if (Session.get('free_trial_taken') == true) {
            return false;
        } else {
            return true;
        }
    }
});