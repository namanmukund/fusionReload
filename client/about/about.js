function setSeo(title,keywords,description){
  return SEO.set({
      title: title,
      meta: {
        'keywords': keywords,
        'description': description
    }
});
}
Template.about.onCreated(function() {
   Blaze._allowJavascriptUrls();
   $('#mask1').show();
});
Template.about.rendered = function() {
    Session.set('aboutProgram', '');
    var urlstr =   Session.get('url_str');  
    // Session.setTemp('show_signup_popup',1);  
    // if (!(Session.get('landing_user_profile_id'))) {
    //     Modal.show('sign_up');
    //   }
    // $(window).scroll(function() {
    //    if($(window).scrollTop() + $(window).height() == $(document).height()) {
    //        if(!(Session.get('landing_user_profile_id')) && Session.get('show_signup_popup')){ 
    //           Modal.show('sign_up');           
    //           Session.setTemp('show_signup_popup',0);              
    //        }
    //    }
    // });
          Meteor.call('aboutCourseDataByUrl', urlstr , function (error, result) {
              if(result){
                  var aboutData =  result.content;
                  if(JSON.parse(aboutData).result){
                      Session.set('aboutProgram', JSON.parse(aboutData).data.ecomExam);
                      setSeo(Session.get('aboutProgram').title,Session.get('aboutProgram').keywords,Session.get('aboutProgram').metatag);
                  }else{
                      Session.set('aboutProgram','');
                      Session.set('courseId', 0);
                  }
                  $('#mask1').hide();
              }
          });

};
Template.info.rendered = function() {
  Session.set('infoData', '');
  // Session.setTemp('show_signup_popup',1);  
  //   if (!(Session.get('landing_user_profile_id'))) {
  //       Modal.show('sign_up');
  //     }
  //   $(window).scroll(function() {
  //      if($(window).scrollTop() + $(window).height() == $(document).height()) {
  //          if(!(Session.get('landing_user_profile_id')) && Session.get('show_signup_popup')){ 
  //             Modal.show('sign_up');           
  //             Session.setTemp('show_signup_popup',0);              
  //          }
  //      }
  //   });
  var sendParam =   Session.get('url_str');
  Meteor.call('infoPagesData', sendParam , function (error, result) {
      if(result){
        var aboutData =  result.content;
        Session.set('infoData', JSON.parse(aboutData));
        setSeo(Session.get('infoData').title,Session.get('infoData').metakey,Session.get('infoData').metadesc);
      }

  });
}
Template.infonavigationData.helpers({
  'headerData': function () {
    if(Session.get('infoData')){
        return Session.get('infoData').introtext;
      }
    }
});
Template.about.events = {
    "click .homelink" : function (event,template) {
        event.preventDefault();
        Router.go('/');
    }
};
Template.navigationData.helpers({
    'headerData': function () {
        if(Session.get('aboutProgram')!=''){
        return Session.get('aboutProgram').header;
      }
    },
    'courseId': function () {
        if(Session.get('courseId')!=''){
        return Session.get('courseId');
        }
    },
    'conditionalHeader': function () {
        var courseId= Session.get('courseId');
        if(courseId){
            switch(courseId){
                case 288 : return Template.conditional_header_288;
                case 298 : return Template.conditional_header_298;
                case 315 : return Template.conditional_header_315;
                case 326 : return Template.conditional_header_326;
                case 352 : return Template.conditional_header_352;
                case 306 : return Template.conditional_header_306;
                case 311 : return Template.conditional_header_311;
                case 334 : return Template.conditional_header_334;
                case 271 : return Template.conditional_header_271;
                case 301 : return Template.conditional_header_301;
                case 272 : return Template.conditional_header_272;
                case 295 : return Template.conditional_header_295;
                case 304 : return Template.conditional_header_304;
                case 310 : return Template.conditional_header_310;
                case 302 : return Template.conditional_header_302;
                case 325 : return Template.conditional_header_325;
                case 350 : return Template.conditional_header_350;
                case 335 : return Template.conditional_header_335;
                case 239 : return Template.conditional_header_239;
                case 229 : return Template.conditional_header_229;
                case 188 : return Template.conditional_header_188;
                case 316 : return Template.conditional_header_316;
                case 57 : return Template.conditional_header_57;
                case 356 : return Template.conditional_header_356;
                case 119 : return Template.conditional_header_119;
                case 95 : return Template.conditional_header_95;
                case 191 : return Template.conditional_header_191;
                case 114 : return Template.conditional_header_114;
                case 113 : return Template.conditional_header_113;
                case 115 : return Template.conditional_header_115;
                case 116 : return Template.conditional_header_116;
                case 84 : return Template.conditional_header_84;
                case 83 : return Template.conditional_header_83;
                case 80 : return Template.conditional_header_80;
                case 79 : return Template.conditional_header_79;
                case 85 : return Template.conditional_header_85;
                case 86 : return Template.conditional_header_86;
                case 87 : return Template.conditional_header_87;
                case 88 : return Template.conditional_header_88;
            }
        }
        return false;
    }
});
Template.contentSectionData.helpers({
    'descriptionData': function () {
        if(Session.get('aboutProgram')!=''){
        return Session.get('aboutProgram').description;
    }
    }
});
Router.map(function() {
  return this.route('info', {
    path: '/info/:slug',
    action: function(){
    Session.setTemp('url_str',this.params.slug);
    this.render();
  }
  });
});
//Router of about course moved to router.js
Template.headerabout.helpers({
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

Template.headerabout.events = {
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
        Session.set('landing_user_profile_id', undefined);
        Session.clear('global_flag_free');
        window.location.reload(true);
    }
};

Template.about.helpers({
  login_check: function () {        
        if (!(Session.get('landing_user_profile_id'))) {
            return true;
        }
    }
});

Template.about_signup_sticky.events({
    'submit form': function (event) {
        event.preventDefault();
         // ga('send', {
         //    hitType: 'event',
         //    eventCategory: 'sign_up',
         //    eventAction: 'sign_up_submitted',
         //    eventLabel: Session.get('url_str')+'/about'
         //  });
          // $('#mask1').show();
        // if (!($("#inlineCheckbox11").is(":checked"))) {
        //     $('#mask1').hide();
        //     var mssg = 'Please agree to the Terms & Conditions';
        //     toastr.warning(mssg);
        //     return false;
        // }
        var email = $('[name=email_id]').val();
        if (!validateEmail(email)){
            // $('#mask1').hide();
            toastr.warning('Invalid email id');
            return false;
        }        
        Session.set('email_id', email);
        var password = $('[name=user_password]').val();
        var user_name = $('[name=user_name]').val();
        var mobile_no = $('[name=mobile_no]').val();
        var first_digit=mobile_no.match(/\d/);
        
        if(first_digit<7){
            $('#mask1').hide();
            toastr.warning('Invalid mobile number');
            return false;
        }
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(
        //             displayPosition,
        //             displayError
        //             );
        // }
        // console.log('password',password);
        // console.log('user_name',user_name);
        // console.log('mobile_no',mobile_no);
        // console.log('first_digit',first_digit);

        Meteor.call('web_user_register', user_name, email, password, mobile_no, function (error, result) {
            if (result == 3) {
                $('#mask1').hide();
                toastr.warning('User with same Email Id/Mobile already exists');
            }
            else {
                if (result == 2) {
                    $('#mask1').hide();
                    toastr.warning('Please enter valid info');
                } else {
                    $('.sign-up').hide();
                    var mssg = 'Signed up successfully';
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'sign_up',
                        eventAction: 'sign_up_successfull',
                        eventLabel: Session.get('url_str')+'/about'
                      });
                  $('#mask1').hide();
                    toastr.success(mssg);
                    if (Session.get('global_grade_id') || Session.get('selectedSubjects')) {
                        Modal.hide('sign_up');
                        var token = 'global';
                        Meteor.call('setUserPreference', result.id, token,
                                Session.get('categoryId'), Session.get('subCategoryId'),
                                Session.get('global_grade_id'), Session.get('selectedSubjects').map(Number), function (error, result) {

                            console.log("use preference set", result);
                            console.log("use preference error", error);
                        });
                        location.reload();
                    } else {
                        console.log("getStartId 1");
                        Modal.hide('sign_up');
                        theDiv = $("#getStartId").attr("href");
                        console.log("theDiv", theDiv);

                        Router.go('/');
                    }

                    Session.set('global_user_id', result.id);
                    $(document).ready(function () {

                        $('.sign-up').hide();
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
                }
            }
        });
    },
    'click #sign_up_facebook_login': function (event) {
      event.preventDefault();
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
                        if (Session.get('coming_from_free_trial')==1) {                        
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
                            location.reload();
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
                                    Session.set('categoryId',detail.preference.cat_id);
                                    Session.set('subCatId',detail.preference.sub_cat_id);
                                    Session.set('courseId',detail.preference.course.id);
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

                                                if (!Session.get('coming_from_free_trial') && !Session.get('coming_from_subscription') && !Session.get('coming_from_subscription_pricing')) {
                                                    console.log('coming_in_the_wall');
                                                    Modal.hide('sign_in');
                                                    if(result.course_name !=''){
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                } else {
                                    if ((Session.get('courseId') || Session.get('courseIdCache')) && Session.get('coming_from_free_trial_wall')) {
                                        Modal.hide('sign_in');
                                        location.reload();
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
                                    // alert(window.location.href);
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
      event.preventDefault();
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

                        if (Session.get('coming_from_free_trial')==1) {                        
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
                            location.reload();
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
                                    Session.set('categoryId',detail.preference.cat_id);
                                    Session.set('subCatId',detail.preference.sub_cat_id);
                                    Session.set('courseId',detail.preference.course.id);
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

                                                if (!Session.get('coming_from_free_trial') && !Session.get('coming_from_subscription') && !Session.get('coming_from_subscription_pricing')) {
                                                    console.log('coming_in_the_wall');
                                                    Modal.hide('sign_in');
                                                    if(result.course_name !=''){
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




////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                }

                                else {
                                    if ((Session.get('courseId') || Session.get('courseIdCache')) && Session.get('coming_from_free_trial_wall')) {
                                        Modal.hide('sign_in');
                                        location.reload();
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
    }
  });


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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

Template.rtbanner_about_page_right.events = {
    "click .free_trial_web_about": function (e) {
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
    "click .subs_from_banner_about": function (e) {
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
    }
};

Template.rtbanner_about_page_left.events = {	
    "click .choose_course_banner_about": function (e) {
        e.preventDefault();
        Router.go('/');
        setTimeout(function(){
                    toastr.success('Please click on Course Card to buy on Pen Drive or SD Card.');
                }, 2000);
    }
};